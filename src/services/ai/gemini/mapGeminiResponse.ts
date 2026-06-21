import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import {
  generatePersonalizedRoutine,
  getRoutineStepDef,
} from '@/services/routine/routineGenerator';
import type { PersonalizedRoutine } from '@/types/routine';
import type { ConcernSeverity, ReportConcern, SkinAnalysisResult } from '@/types/skinAnalysis';
import type { SkinScoreVector } from '@/types/scanPipeline';
import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const GEMINI_MODEL_VERSION = 'gemini-2.5-flash';

export type GeminiConcernRaw = {
  id: string;
  severity: string;
  barPercent: number;
  insightId?: string;
};

export type GeminiAnalysisRaw = {
  skinScore: number;
  skinTypeId: string;
  fitzpatrickId: string;
  chipIds: string[];
  positiveIds: string[];
  concerns: GeminiConcernRaw[];
  routine: {
    subtitle: string;
    morningStepIds: string[];
    eveningStepIds: string[];
  };
};

export type GeminiAnalyzeApiResponse = {
  analysis: GeminiAnalysisRaw;
  modelVersion: string;
  confidence: number;
};

export type GeminiScanResult = {
  result: SkinAnalysisResult;
  routine: PersonalizedRoutine;
  scoreVector: SkinScoreVector;
  confidence: number;
  modelVersion: string;
};

const CONCERN_ICONS: Record<string, IconName> = {
  hydration: 'water-outline',
  acne: 'alert-circle-outline',
  texture: 'blur',
  barrier: 'shield-check-outline',
  redness: 'heart-pulse',
};

const SEVERITY_LABELS: Record<ConcernSeverity, string> = {
  healthy: 'HEALTHY',
  low: 'LOW SEVERITY',
  medium: 'MEDIUM SEVERITY',
  high: 'HIGH SEVERITY',
};

function parseSeverity(raw: string): ConcernSeverity {
  if (raw === 'healthy' || raw === 'low' || raw === 'medium' || raw === 'high') {
    return raw;
  }
  return 'low';
}

function buildScoreVectorFromGemini(analysis: GeminiAnalysisRaw): SkinScoreVector {
  const typeIdx: Record<string, number> = {
    oily: 0,
    dry: 1,
    combination: 2,
    normal: 3,
    sensitive: 4,
  };
  const vector: SkinScoreVector = [0.1, 0.1, 0.1, 0.1, 0.1];
  const idx = typeIdx[analysis.skinTypeId] ?? 2;
  vector[idx] = 0.72;
  for (let i = 0; i < 5; i++) {
    if (i !== idx) vector[i] = 0.08;
  }

  const concernOrder = ['hydration', 'acne', 'texture', 'redness', 'pigmentation'];
  for (let i = 0; i < 5; i++) {
    const id = concernOrder[i];
    const c = analysis.concerns.find((x) => x.id === id);
    vector[5 + i] = c ? c.barPercent / 100 : 0.25;
  }

  while (vector.length < 20) vector.push(0.2);
  return vector.slice(0, 20);
}

function buildRoutineFromGemini(
  raw: GeminiAnalysisRaw,
  result: SkinAnalysisResult,
  quiz: QuizAnswers | null,
): PersonalizedRoutine {
  const morning = raw.routine.morningStepIds
    .map((id) => getRoutineStepDef(id))
    .filter((step): step is NonNullable<typeof step> => Boolean(step));

  const evening = raw.routine.eveningStepIds
    .map((id) => getRoutineStepDef(id))
    .filter((step): step is NonNullable<typeof step> => Boolean(step));

  if (morning.length >= 2 && evening.length >= 2) {
    return {
      subtitle: raw.routine.subtitle,
      morning,
      evening,
    };
  }

  return generatePersonalizedRoutine(result, quiz);
}

export function mapGeminiToScanResult(
  raw: GeminiAnalysisRaw,
  params: {
    frontImageUri: string;
    modelVersion: string;
    confidence: number;
    quiz: QuizAnswers | null;
  },
): GeminiScanResult {
  const concerns: ReportConcern[] = raw.concerns.map((c) => {
    const severity = parseSeverity(c.severity);
    return {
      id: c.id,
      name: c.id,
      icon: CONCERN_ICONS[c.id] ?? 'circle-outline',
      severity,
      severityLabel: SEVERITY_LABELS[severity],
      barPercent: Math.max(0, Math.min(100, Math.round(c.barPercent))),
      insightId: c.insightId,
    };
  });

  const result: SkinAnalysisResult = {
    id: `scan-${Date.now()}`,
    skinScore: Math.max(0, Math.min(100, Math.round(raw.skinScore))),
    skinType: raw.skinTypeId,
    skinTypeId: raw.skinTypeId,
    fitzpatrick: raw.fitzpatrickId,
    fitzpatrickId: raw.fitzpatrickId,
    scannedAt: new Date().toISOString(),
    imageUri: params.frontImageUri,
    skinTypeDescription: '',
    skinTypeChips: [],
    chipIds: raw.chipIds?.length ? raw.chipIds : ['tZoneOily', 'cheeksNormal'],
    positiveIds: raw.positiveIds?.length ? raw.positiveIds : ['goodElasticity'],
    concerns,
    positives: [],
  };

  const routine = buildRoutineFromGemini(raw, result, params.quiz);

  return {
    result,
    routine,
    scoreVector: buildScoreVectorFromGemini(raw),
    confidence: params.confidence,
    modelVersion: params.modelVersion,
  };
}
