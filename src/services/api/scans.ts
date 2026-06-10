import { isApiConfigured } from '@/config/env';
import { apiPost } from '@/services/api/client';
import { analyzeSkinLocally } from '@/services/ai/skinAnalyzer';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AngleImageUris, ScanPersistPayload, StoredScanRecord } from '@/types/scanPipeline';

export async function submitScan(params: {
  payload: ScanPersistPayload;
  imageUri: string;
  confidence: number;
  modelVersion: string;
  usedCloudRefine: boolean;
  localResult?: SkinAnalysisResult;
  angleImageUris?: AngleImageUris;
  token?: string | null;
}): Promise<StoredScanRecord> {
  const { payload, imageUri, confidence, modelVersion, usedCloudRefine, localResult, angleImageUris } =
    params;

  let result: SkinAnalysisResult;

  if (!isApiConfigured()) {
    if (localResult) {
      result = localResult;
    } else {
      const local = await analyzeSkinLocally({ imageUri, quiz: payload.quizContext });
      result = { ...local.result, imageUri };
    }
  } else {
    try {
      result = await apiPost<SkinAnalysisResult>('/scans', payload, params.token);
      result = { ...result, imageUri: result.imageUri || imageUri };
    } catch {
      const local = await analyzeSkinLocally({ imageUri, quiz: payload.quizContext });
      result = local.result;
    }
  }

  return {
    ...result,
    imageUri,
    scoreVector: payload.scoreVector,
    confidence,
    modelVersion,
    usedCloudRefine,
    angleImageUris,
  };
}
