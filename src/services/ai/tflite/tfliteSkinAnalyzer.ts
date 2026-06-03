import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { extractImageMetrics, type ImageSkinMetrics } from '@/services/ai/imageMetrics';
import { buildScoreVector } from '@/services/ai/scoreVector';
import { buildAnalysisFromVector } from '@/services/ai/skinAnalyzer';
import { preprocessFaceForTflite } from '@/services/ai/tflite/preprocessor';
import { mapTfliteOutputsToScoreVector } from '@/services/ai/tflite/scoreMapping';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { SkinScoreVector } from '@/types/scanPipeline';
import { canUseNativeTflite } from '@/utils/expoRuntime';

export const TFLITE_MODEL_VERSION = 'skinsense-tflite-v1';

const INPUT_SIZE = 224;

type TfliteModel = {
  run: (input: ArrayBuffer[]) => Promise<ArrayBuffer[]>;
};

let runtimeChecked = false;
let runtimeAvailable = false;
let cachedModel: TfliteModel | null = null;

async function getTfliteModule() {
  if (!canUseNativeTflite()) return null;
  try {
    return await import('react-native-fast-tflite');
  } catch {
    return null;
  }
}

function float32ToArrayBuffer(tensor: Float32Array): ArrayBuffer {
  const copy = new Float32Array(tensor);
  return copy.buffer;
}

async function loadSkinTfliteModel(): Promise<TfliteModel | null> {
  const mod = await getTfliteModule();
  if (!mod?.loadTensorflowModel) return null;

  if (!cachedModel) {
    const model = await mod.loadTensorflowModel(
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../../../assets/models/skin_analysis_v1.tflite'),
      [],
    );
    cachedModel = model as TfliteModel;
  }
  return cachedModel;
}

export async function isTfliteRuntimeAvailable(): Promise<boolean> {
  if (!canUseNativeTflite()) {
    runtimeChecked = true;
    runtimeAvailable = false;
    return false;
  }
  if (runtimeChecked) return runtimeAvailable;
  runtimeChecked = true;
  try {
    runtimeAvailable = Boolean(await loadSkinTfliteModel());
  } catch {
    runtimeAvailable = false;
    cachedModel = null;
  }
  return runtimeAvailable;
}

export type TfliteAnalysisResult = {
  scoreVector: SkinScoreVector;
  confidence: number;
  result: SkinAnalysisResult;
  metrics: ImageSkinMetrics | null;
  modelVersion: typeof TFLITE_MODEL_VERSION;
};

function blendVectors(tflite: SkinScoreVector, vision: SkinScoreVector): SkinScoreVector {
  return tflite.map((v, i) => v * 0.72 + (vision[i] ?? 0) * 0.28);
}

/** Run bundled TFLite model on a face-cropped image (development build only). */
export async function analyzeWithTflite(params: {
  faceImageUri: string;
  displayImageUri: string;
  quiz: QuizAnswers | null;
}): Promise<TfliteAnalysisResult | null> {
  if (!canUseNativeTflite()) return null;

  try {
    const model = await loadSkinTfliteModel();
    if (!model) return null;

    const inputTensor = await preprocessFaceForTflite(params.faceImageUri, INPUT_SIZE);
    const outputs = await model.run([float32ToArrayBuffer(inputTensor)]);
    const outBuffer = outputs[0];
    if (!outBuffer || outBuffer.byteLength < 20 * 4) return null;

    const outputArray = new Float32Array(outBuffer);

    const { vector: tfliteVector, confidence: tfliteConfidence } = mapTfliteOutputsToScoreVector(
      outputArray,
      params.quiz,
    );

    const metrics = await extractImageMetrics(params.faceImageUri);
    const vision = buildScoreVector({
      imageUri: params.faceImageUri,
      quiz: params.quiz,
      metrics,
    });

    const mergedVector = blendVectors(tfliteVector, vision.vector);
    const mergedConfidence = Math.min(
      0.94,
      tfliteConfidence * 0.7 + vision.confidence * 0.3,
    );

    const local = buildAnalysisFromVector({
      vector: mergedVector,
      confidence: mergedConfidence,
      displayImageUri: params.displayImageUri,
      quiz: params.quiz,
      metrics,
    });

    return {
      ...local,
      metrics,
      modelVersion: TFLITE_MODEL_VERSION,
    };
  } catch {
    cachedModel = null;
    runtimeChecked = false;
    return null;
  }
}
