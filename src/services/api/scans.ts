import { isApiConfigured } from '@/config/env';
import { apiPost } from '@/services/api/client';
import { analyzeSkinLocally } from '@/services/ai/skinAnalyzer';
import { mockPersistScan } from '@/services/api/mockScanApi';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { ScanPersistPayload, StoredScanRecord } from '@/types/scanPipeline';

export async function submitScan(params: {
  payload: ScanPersistPayload;
  imageUri: string;
  confidence: number;
  modelVersion: string;
  usedCloudRefine: boolean;
  localResult?: SkinAnalysisResult;
  token?: string | null;
}): Promise<StoredScanRecord> {
  const { payload, imageUri, confidence, modelVersion, usedCloudRefine, localResult } = params;

  let result: SkinAnalysisResult;

  if (!isApiConfigured()) {
    result = localResult ?? (await mockPersistScan(payload, imageUri));
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
  };
}
