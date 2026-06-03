import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { extractImageMetrics, type ImageSkinMetrics } from '@/services/ai/imageMetrics';
import {
  analyzeWithTflite,
  isTfliteRuntimeAvailable,
  TFLITE_MODEL_VERSION,
} from '@/services/ai/tflite/tfliteSkinAnalyzer';
import { analyzeSkinLocally, ON_DEVICE_MODEL_VERSION } from '@/services/ai/skinAnalyzer';
import { prepareFaceScanImage } from '@/services/scan/faceScanImage';
import type { SkinScoreVector } from '@/types/scanPipeline';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

export type FaceScanErrorCode =
  | 'photo_too_dark'
  | 'photo_too_bright'
  | 'photo_low_quality'
  | 'analysis_failed';

export class FaceScanError extends Error {
  readonly code: FaceScanErrorCode;

  constructor(code: FaceScanErrorCode) {
    super(code);
    this.name = 'FaceScanError';
    this.code = code;
  }
}

function validateMetrics(metrics: ImageSkinMetrics): void {
  if (metrics.meanBrightness < 0.2) {
    throw new FaceScanError('photo_too_dark');
  }
  if (metrics.meanBrightness > 0.9) {
    throw new FaceScanError('photo_too_bright');
  }
  if (metrics.confidence < 0.48) {
    throw new FaceScanError('photo_low_quality');
  }
}

export type FaceScanAnalysisResult = {
  scoreVector: SkinScoreVector;
  confidence: number;
  result: SkinAnalysisResult;
  metrics: ImageSkinMetrics;
  modelVersion: string;
};

/**
 * Analyze skin from a camera (or gallery) photo.
 * Prefers TFLite in dev builds; falls back to vision pipeline in Expo Go.
 */
export async function analyzeFaceFromCameraPhoto(params: {
  displayImageUri: string;
  quiz: QuizAnswers | null;
}): Promise<FaceScanAnalysisResult> {
  try {
    const faceUri = await prepareFaceScanImage(params.displayImageUri);

    if (await isTfliteRuntimeAvailable()) {
      const tflite = await analyzeWithTflite({
        faceImageUri: faceUri,
        displayImageUri: params.displayImageUri,
        quiz: params.quiz,
      });
      if (tflite?.metrics) {
        validateMetrics(tflite.metrics);
        return {
          scoreVector: tflite.scoreVector,
          confidence: tflite.confidence,
          result: tflite.result,
          metrics: tflite.metrics,
          modelVersion: TFLITE_MODEL_VERSION,
        };
      }
    }

    const metrics = await extractImageMetrics(faceUri);
    if (!metrics) {
      throw new FaceScanError('photo_low_quality');
    }
    validateMetrics(metrics);

    const local = await analyzeSkinLocally({
      imageUri: faceUri,
      quiz: params.quiz,
      metrics,
    });

    return {
      ...local,
      metrics,
      modelVersion: ON_DEVICE_MODEL_VERSION,
      result: {
        ...local.result,
        imageUri: params.displayImageUri,
      },
    };
  } catch (e) {
    if (e instanceof FaceScanError) throw e;
    throw new FaceScanError('analysis_failed');
  }
}
