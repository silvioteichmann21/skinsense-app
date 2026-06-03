import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { ImageSkinMetrics } from '@/services/ai/imageMetrics';
import {
  SCORE_VECTOR_LENGTH,
  type SkinScoreVector,
} from '@/types/scanPipeline';

const SKIN_TYPE_IDS = ['oily', 'dry', 'combination', 'normal', 'sensitive'] as const;

const CONCERN_DIMS = [
  'hydration',
  'acne',
  'texture',
  'redness',
  'pigmentation',
  'wrinkles',
  'pores',
  'barrier',
  'oiliness',
  'dryness',
  'sensitivity',
  'dark-spots',
  'uneven-tone',
  'large-pores',
  'inflammation',
] as const;

function hashUri(uri: string): number {
  let h = 0;
  for (let i = 0; i < uri.length; i++) {
    h = (h * 31 + uri.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function quizSkinTypeIndex(skinType: string | null): number {
  const map: Record<string, number> = {
    'very-oily': 0,
    oily: 0,
    combination: 2,
    normal: 3,
    dry: 1,
    'very-dry': 1,
    'not-sure': 2,
  };
  if (!skinType) return 2;
  return map[skinType] ?? 2;
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function concernFromMetrics(metrics: ImageSkinMetrics, id: (typeof CONCERN_DIMS)[number]): number {
  const m = metrics;
  switch (id) {
    case 'hydration':
      return 1 - m.cheekHydrationProxy;
    case 'dryness':
      return 1 - m.cheekHydrationProxy;
    case 'acne':
      return m.textureVariance * 0.55 + m.tZoneShine * 0.25;
    case 'texture':
      return m.textureVariance;
    case 'redness':
      return m.redness;
    case 'sensitivity':
      return m.redness * 0.85 + (1 - m.cheekHydrationProxy) * 0.15;
    case 'pigmentation':
    case 'dark-spots':
    case 'uneven-tone':
      return (1 - m.meanBrightness) * 0.35 + m.textureVariance * 0.35;
    case 'pores':
    case 'large-pores':
      return m.tZoneShine * 0.7 + m.textureVariance * 0.3;
    case 'oiliness':
      return m.tZoneShine;
    case 'barrier':
      return m.redness * 0.35 + (1 - m.cheekHydrationProxy) * 0.45;
    case 'wrinkles':
      return m.textureVariance * 0.4 + (1 - m.cheekHydrationProxy) * 0.2;
    case 'inflammation':
      return m.redness * 0.9;
    default:
      return 0.3;
  }
}

export type BuildScoreVectorInput = {
  imageUri: string;
  quiz: QuizAnswers | null;
  metrics: ImageSkinMetrics | null;
};

/** On-device vector from photo zones + quiz (no upload). */
export function buildScoreVector(input: BuildScoreVectorInput): {
  vector: SkinScoreVector;
  confidence: number;
} {
  const { imageUri, quiz, metrics } = input;
  const seed = hashUri(imageUri);
  const noise = (i: number) => ((seed + i * 17) % 100) / 100;

  const typeIdx = quizSkinTypeIndex(quiz?.skinType ?? null);
  const typeLogits = SKIN_TYPE_IDS.map((_, i) => {
    let boost = i === typeIdx ? 1.4 : 0;
    if (metrics) {
      if (i === 0) boost += metrics.tZoneShine * 1.3;
      if (i === 1) boost += (1 - metrics.cheekHydrationProxy) * 1.1;
      if (i === 2) boost += metrics.tZoneShine * 0.6 + (1 - metrics.cheekHydrationProxy) * 0.5;
      if (i === 4) boost += metrics.redness * 1.2;
    }
    return boost + noise(i) * 0.2;
  });
  const typeProbs = softmax(typeLogits);

  const quizConcerns = new Set(quiz?.concerns ?? []);
  const concernScores = CONCERN_DIMS.map((id, i) => {
    const fromImage = metrics ? concernFromMetrics(metrics, id) : noise(i + 10) * 0.4;
    let base = metrics ? fromImage * 0.7 + noise(i + 10) * 0.15 : noise(i + 10) * 0.45;

    if (quizConcerns.has(id)) base += 0.32;
    if (id === 'hydration' && quizConcerns.has('dryness')) base += 0.22;
    if (id === 'acne' && quizConcerns.has('acne')) base += 0.38;
    if (id === 'oiliness' && quizConcerns.has('oiliness')) base += 0.32;
    if (id === 'pigmentation' && quizConcerns.has('dark-spots')) base += 0.28;
    if (id === 'pigmentation' && quizConcerns.has('uneven-tone')) base += 0.22;
    if (id === 'pores' && quizConcerns.has('large-pores')) base += 0.28;
    if (id === 'wrinkles' && quizConcerns.has('wrinkles')) base += 0.28;
    if (id === 'redness' && quizConcerns.has('redness')) base += 0.32;
    if (id === 'sensitivity' && quizConcerns.has('sensitivity')) base += 0.32;
    if (id === 'barrier' && quizConcerns.has('sensitivity')) base += 0.12;

    return Math.min(1, base);
  });

  const vector: SkinScoreVector = [...typeProbs, ...concernScores];
  while (vector.length < SCORE_VECTOR_LENGTH) {
    vector.push(noise(vector.length) * 0.15);
  }

  const maxType = Math.max(...typeProbs);
  const hasQuiz = Boolean(quiz?.skinType && (quiz.concerns?.length ?? 0) > 0);
  const imageSignal = metrics?.confidence ?? 0;

  let confidence = maxType * 0.4 + (hasQuiz ? 0.28 : 0.12) + imageSignal * 0.32;
  if (!quiz?.skinType) confidence -= 0.08;
  if (!metrics) confidence -= 0.1;
  confidence = Math.max(0.48, Math.min(0.94, confidence));

  return { vector: vector.slice(0, SCORE_VECTOR_LENGTH), confidence };
}

export function mergeRefinedVector(
  base: SkinScoreVector,
  patch: { concernAdjustments?: Record<string, { barPercent?: number }> },
): SkinScoreVector {
  const next = [...base];
  if (!patch.concernAdjustments) return next;
  for (const [key, adj] of Object.entries(patch.concernAdjustments)) {
    const idx = CONCERN_DIMS.indexOf(key as (typeof CONCERN_DIMS)[number]);
    if (idx >= 0 && adj.barPercent !== undefined) {
      next[5 + idx] = Math.min(1, adj.barPercent / 100);
    }
  }
  return next;
}
