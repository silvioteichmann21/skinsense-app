import { analyzeSkinLocally } from '@/services/ai/skinAnalyzer';
import { mergeRefinedVector } from '@/services/ai/scoreVector';
import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type {
  RefinedAnalysisPatch,
  ScanPersistPayload,
  SkinScoreVector,
} from '@/types/scanPipeline';

const CLOUD_REFINE_DELAY_MS = 400;

function applyPatch(
  base: SkinAnalysisResult,
  vector: SkinScoreVector,
  patch: RefinedAnalysisPatch,
): SkinAnalysisResult {
  const next = { ...base, concerns: base.concerns.map((c) => ({ ...c })) };
  if (patch.skinScore !== undefined) {
    next.skinScore = patch.skinScore;
  }
  if (patch.concernAdjustments) {
    for (const c of next.concerns) {
      const adj = patch.concernAdjustments[c.id];
      if (adj?.barPercent !== undefined) {
        c.barPercent = adj.barPercent;
      }
    }
  }
  return next;
}

/** Local stand-in for POST /ai/analyze — never receives image bytes. */
export async function mockRefineAnalysis(
  scoreVector: SkinScoreVector,
  quiz: QuizAnswers | null,
  imageUri: string,
): Promise<{ result: SkinAnalysisResult; vector: SkinScoreVector }> {
  await new Promise((r) => setTimeout(r, CLOUD_REFINE_DELAY_MS));
  const local = await analyzeSkinLocally({ imageUri, quiz });
  const patch: RefinedAnalysisPatch = {
    skinScore: Math.min(92, local.result.skinScore + 2),
    concernAdjustments: {
      hydration: { barPercent: Math.max(20, (local.result.concerns.find((c) => c.id === 'hydration')?.barPercent ?? 50) - 5) },
    },
  };
  const mergedVector = mergeRefinedVector(scoreVector, patch);
  const refined = applyPatch(local.result, mergedVector, patch);
  return { result: refined, vector: mergedVector };
}

/** Local stand-in for POST /scans. */
export async function mockPersistScan(
  payload: ScanPersistPayload,
  imageUri: string,
): Promise<SkinAnalysisResult> {
  const local = await analyzeSkinLocally({
    imageUri,
    quiz: payload.quizContext,
  });
  return {
    ...local.result,
    id: `scan-${Date.now()}`,
    imageUri,
  };
}
