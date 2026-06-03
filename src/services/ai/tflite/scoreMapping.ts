import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import { SCORE_VECTOR_LENGTH, type SkinScoreVector } from '@/types/scanPipeline';

const SKIN_TYPE_COUNT = 5;
const CONCERN_COUNT = 15;

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/** Map 20 sigmoid outputs → skin-type softmax + concern severities, blended with quiz. */
export function mapTfliteOutputsToScoreVector(
  outputs: Float32Array,
  quiz: QuizAnswers | null,
): { vector: SkinScoreVector; confidence: number } {
  const raw = Array.from(outputs.slice(0, 20));

  const typeLogits = raw.slice(0, SKIN_TYPE_COUNT).map((v) => Math.log(v / (1 - v + 1e-6) + 1e-6));
  const typeProbs = softmax(typeLogits);

  const concernScores = raw.slice(SKIN_TYPE_COUNT, SKIN_TYPE_COUNT + CONCERN_COUNT).map((v, i) => {
    let score = Math.max(0, Math.min(1, v));
    const quizConcerns = new Set(quiz?.concerns ?? []);
    const concernIds = [
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
    ];
    const id = concernIds[i];
    if (id && quizConcerns.has(id)) score = Math.min(1, score + 0.12);
    if (id === 'hydration' && quizConcerns.has('dryness')) score = Math.min(1, score + 0.1);
    if (id === 'acne' && quizConcerns.has('acne')) score = Math.min(1, score + 0.15);
    return score;
  });

  const vector: SkinScoreVector = [...typeProbs, ...concernScores];
  while (vector.length < SCORE_VECTOR_LENGTH) {
    vector.push(0.2);
  }

  const maxType = Math.max(...typeProbs);
  const meanConcern =
    concernScores.reduce((a, b) => a + b, 0) / Math.max(concernScores.length, 1);
  const hasQuiz = Boolean(quiz?.skinType || (quiz?.concerns?.length ?? 0) > 0);

  let confidence = maxType * 0.5 + (1 - meanConcern) * 0.2 + (hasQuiz ? 0.22 : 0.08);
  confidence = Math.max(0.55, Math.min(0.94, confidence));

  return { vector: vector.slice(0, SCORE_VECTOR_LENGTH), confidence };
}
