import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { extractImageMetrics, type ImageSkinMetrics } from '@/services/ai/imageMetrics';
import { buildScoreVector } from '@/services/ai/scoreVector';
import type { ConcernSeverity, ReportConcern, SkinAnalysisResult } from '@/types/skinAnalysis';
import type { SkinScoreVector } from '@/types/scanPipeline';

export const ON_DEVICE_MODEL_VERSION = 'skinsense-vision-v1';

type LocalAnalysisResult = {
  scoreVector: SkinScoreVector;
  confidence: number;
  result: SkinAnalysisResult;
};

const SKIN_TYPE_META: Record<
  string,
  {
    skinTypeId: string;
    chipIds: string[];
    positiveIds: string[];
  }
> = {
  oily: {
    skinTypeId: 'oily',
    chipIds: ['tZoneOily', 'cheeksNormal', 'seasonalDryness'],
    positiveIds: ['goodElasticity'],
  },
  dry: {
    skinTypeId: 'dry',
    chipIds: ['cheeksNormal', 'seasonalDryness', 'tZoneOily'],
    positiveIds: ['strongBarrier'],
  },
  combination: {
    skinTypeId: 'combination',
    chipIds: ['tZoneOily', 'cheeksNormal', 'seasonalDryness'],
    positiveIds: ['strongBarrier', 'goodElasticity'],
  },
  normal: {
    skinTypeId: 'normal',
    chipIds: ['cheeksNormal', 'tZoneOily', 'seasonalDryness'],
    positiveIds: ['strongBarrier', 'goodElasticity'],
  },
  sensitive: {
    skinTypeId: 'sensitive',
    chipIds: ['cheeksNormal', 'seasonalDryness', 'tZoneOily'],
    positiveIds: ['goodElasticity'],
  },
};

function severityFromScore(score: number): { severity: ConcernSeverity; label: string; bar: number } {
  if (score < 0.25) {
    return { severity: 'healthy', label: 'HEALTHY', bar: Math.round(85 + score * 40) };
  }
  if (score < 0.45) {
    return { severity: 'low', label: 'LOW SEVERITY', bar: Math.round(15 + score * 80) };
  }
  if (score < 0.65) {
    return { severity: 'medium', label: 'MEDIUM SEVERITY', bar: Math.round(40 + score * 50) };
  }
  return { severity: 'high', label: 'HIGH SEVERITY', bar: Math.round(55 + score * 40) };
}

function skinTypeFromVector(
  vector: SkinScoreVector,
  quiz: QuizAnswers | null,
  metrics: ImageSkinMetrics | null,
): string {
  const types = ['oily', 'dry', 'combination', 'normal', 'sensitive'];
  let best = 2;
  let bestVal = -1;
  for (let i = 0; i < 5; i++) {
    const v = vector[i] ?? 0;
    if (v > bestVal) {
      bestVal = v;
      best = i;
    }
  }
  const fromScan = types[best] ?? 'combination';

  if (quiz?.skinType) {
    const map: Record<string, string> = {
      'very-oily': 'oily',
      oily: 'oily',
      combination: 'combination',
      normal: 'normal',
      dry: 'dry',
      'very-dry': 'dry',
      'not-sure': 'combination',
    };
    const fromQuiz = map[quiz.skinType] ?? 'combination';
    if (!metrics) return fromQuiz;
    return metrics.confidence >= 0.55 ? fromScan : fromQuiz;
  }

  if (metrics) {
    if (metrics.tZoneShine > 0.55 && metrics.cheekHydrationProxy > 0.45) return 'combination';
    if (metrics.tZoneShine > 0.6) return 'oily';
    if (metrics.cheekHydrationProxy < 0.4) return 'dry';
    if (metrics.redness > 0.55) return 'sensitive';
  }

  return fromScan;
}

function fitzpatrickFromQuiz(quiz: QuizAnswers | null): string {
  const age = quiz?.ageRange;
  if (age === 'under-18' || age === '18-24') return 'typeII';
  if (age === '55-plus') return 'typeIV';
  return 'typeIII';
}

function buildConcerns(
  vector: SkinScoreVector,
  quiz: QuizAnswers | null,
  metrics: ImageSkinMetrics | null,
): ReportConcern[] {
  const dim = (i: number) => vector[5 + i] ?? 0.3;
  const hydrationScore = dim(0) + (quiz?.concerns.includes('dryness') ? 0.15 : 0);
  const acneScore = dim(1) + (quiz?.concerns.includes('acne') ? 0.2 : 0);
  const textureScore =
    dim(2) +
    (quiz?.concerns.includes('uneven-tone') || quiz?.concerns.includes('large-pores') ? 0.15 : 0);
  const barrierScore = 1 - dim(7) - (quiz?.concerns.includes('sensitivity') ? 0.1 : 0);

  const specs: { id: string; name: string; icon: ReportConcern['icon']; raw: number; insight?: string }[] = [
    {
      id: 'hydration',
      name: 'Hydration',
      icon: 'water-outline',
      raw: hydrationScore,
      insight:
        hydrationScore > 0.4
          ? metrics && metrics.cheekHydrationProxy < 0.45
            ? 'Cheek zones look drier than your T-zone — extra hydration may help.'
            : 'Mild dehydration detected around cheeks.'
          : undefined,
    },
    {
      id: 'acne',
      name: 'Acne',
      icon: 'alert-circle-outline',
      raw: acneScore,
      insight:
        acneScore > 0.45 && metrics && metrics.tZoneShine > 0.5
          ? 'T-zone oiliness may be contributing to breakouts.'
          : undefined,
    },
    {
      id: 'texture',
      name: 'Texture',
      icon: 'blur',
      raw: textureScore,
      insight:
        textureScore > 0.45 && metrics && metrics.textureVariance > 0.5
          ? 'Uneven texture detected — gentle exfoliation and SPF can help over time.'
          : undefined,
    },
    {
      id: 'barrier',
      name: 'Barrier health',
      icon: 'shield-check-outline',
      raw: Math.max(0, 1 - barrierScore),
      insight: barrierScore > 0.7 ? 'Your moisture barrier is performing well.' : undefined,
    },
  ];

  return specs.map((s) => {
    const { severity, label, bar } = severityFromScore(s.raw);
    return {
      id: s.id,
      name: s.name,
      icon: s.icon,
      severity,
      severityLabel: label,
      barPercent: Math.min(98, bar),
      insight: s.insight,
    };
  });
}

function overallScore(concerns: ReportConcern[], vector: SkinScoreVector): number {
  const concernAvg =
    concerns.reduce((sum, c) => sum + c.barPercent, 0) / Math.max(concerns.length, 1);
  const barrier = concerns.find((c) => c.id === 'barrier')?.barPercent ?? 70;
  const typeBoost = Math.max(...vector.slice(0, 5)) * 8;
  const raw = 0.55 * barrier + 0.25 * (100 - concernAvg * 0.35) + typeBoost;
  return Math.round(Math.max(52, Math.min(92, raw)));
}

/** Build report from an existing score vector (e.g. TFLite + vision blend). */
export function buildAnalysisFromVector(params: {
  vector: SkinScoreVector;
  confidence: number;
  displayImageUri: string;
  quiz: QuizAnswers | null;
  metrics: ImageSkinMetrics | null;
}): LocalAnalysisResult {
  const { vector, confidence, displayImageUri, quiz, metrics } = params;
  const typeKey = skinTypeFromVector(vector, quiz, metrics);
  const meta = SKIN_TYPE_META[typeKey] ?? SKIN_TYPE_META.combination;
  const concerns = buildConcerns(vector, quiz, metrics);
  const skinScore = overallScore(concerns, vector);

  const result: SkinAnalysisResult = {
    id: `scan-${Date.now()}`,
    skinScore,
    skinType: typeKey,
    skinTypeId: meta.skinTypeId,
    fitzpatrick: fitzpatrickFromQuiz(quiz),
    fitzpatrickId: fitzpatrickFromQuiz(quiz),
    scannedAt: new Date().toISOString(),
    imageUri: displayImageUri,
    skinTypeDescription: '',
    skinTypeChips: [],
    chipIds: meta.chipIds,
    positiveIds: meta.positiveIds,
    concerns,
    positives: [],
  };

  return { scoreVector: vector, confidence, result };
}

/** On-device analysis pass (no network, no image upload). */
export async function analyzeSkinLocally(params: {
  imageUri: string;
  quiz: QuizAnswers | null;
  /** When set (e.g. after face crop), skips a second pixel read. */
  metrics?: ImageSkinMetrics | null;
}): Promise<LocalAnalysisResult> {
  const metrics =
    params.metrics !== undefined
      ? params.metrics
      : await extractImageMetrics(params.imageUri);
  const { vector, confidence } = buildScoreVector({
    imageUri: params.imageUri,
    quiz: params.quiz,
    metrics,
  });

  return buildAnalysisFromVector({
    vector,
    confidence,
    displayImageUri: params.imageUri,
    quiz: params.quiz,
    metrics,
  });
}
