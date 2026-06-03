import { isApiConfigured } from '@/config/env';
import { apiPost } from '@/services/api/client';
import { mockRefineAnalysis } from '@/services/api/mockScanApi';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { RefinedAnalysisPatch, SkinScoreVector } from '@/types/scanPipeline';

type RefineResponse = RefinedAnalysisPatch & { result?: SkinAnalysisResult };

export async function refineAnalysisWithCloud(params: {
  scoreVector: SkinScoreVector;
  quizContext: QuizAnswers | null;
  imageUri: string;
  token?: string | null;
}): Promise<{ result: SkinAnalysisResult; vector: SkinScoreVector }> {
  if (!isApiConfigured()) {
    return mockRefineAnalysis(params.scoreVector, params.quizContext, params.imageUri);
  }

  try {
    const patch = await apiPost<RefineResponse>(
      '/ai/analyze',
      {
        scoreVector: params.scoreVector,
        quizContext: params.quizContext,
      },
      params.token,
    );
    if (patch.result) {
      return { result: patch.result, vector: params.scoreVector };
    }
    const local = await mockRefineAnalysis(
      params.scoreVector,
      params.quizContext,
      params.imageUri,
    );
    return local;
  } catch {
    return mockRefineAnalysis(params.scoreVector, params.quizContext, params.imageUri);
  }
}
