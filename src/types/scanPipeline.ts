import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';

/** 5 skin-type logits + 15 concern severities (on-device model output). */
export const SCORE_VECTOR_LENGTH = 20;

export type SkinScoreVector = number[];

export type AnalysisPipelineMeta = {
  scoreVector: SkinScoreVector;
  confidence: number;
  modelVersion: string;
  usedCloudRefine: boolean;
  durationMs: number;
};

export type ScanPersistPayload = {
  scoreVector: SkinScoreVector;
  quizContext: QuizAnswers | null;
};

export type RefinedAnalysisPatch = {
  skinScore?: number;
  concernAdjustments?: Record<string, { barPercent?: number; severity?: string }>;
};

export type StoredScanRecord = SkinAnalysisResult & {
  scoreVector?: SkinScoreVector;
  confidence?: number;
  modelVersion?: string;
  usedCloudRefine?: boolean;
};
