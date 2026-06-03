import type { QuizAnswers } from '@/screens/onboarding/quiz/quizTypes';
import type { PersonalizedRoutine, RoutineStep } from '@/types/routine';
import type { ReportConcern, SkinAnalysisResult } from '@/types/skinAnalysis';

const STEP_DEFS: Record<string, RoutineStep> = {
  'am-1': {
    id: 'am-1',
    name: 'Gentle Cleanser',
    duration: '~1 min',
    icon: 'water-outline',
    category: 'CLEANSE',
  },
  'am-2': {
    id: 'am-2',
    name: 'Hydrating Toner',
    duration: '~1 min',
    icon: 'water',
    category: 'PREP',
  },
  'am-3': {
    id: 'am-3',
    name: 'Vitamin C Serum',
    duration: '~2 min',
    icon: 'flask-outline',
    category: 'TREAT',
  },
  'am-3b': {
    id: 'am-3b',
    name: 'Niacinamide Serum',
    duration: '~2 min',
    icon: 'medical-bag',
    category: 'CALM',
  },
  'am-6': {
    id: 'am-6',
    name: 'Hyaluronic Serum',
    duration: '~2 min',
    icon: 'water-plus',
    category: 'HYDRATE',
  },
  'am-4': {
    id: 'am-4',
    name: 'Lightweight Moisturizer',
    duration: '~1 min',
    icon: 'spa',
    category: 'HYDRATE',
  },
  'am-5': {
    id: 'am-5',
    name: 'Mineral SPF 30',
    duration: '~1 min',
    icon: 'white-balance-sunny',
    category: 'PROTECT',
  },
  'pm-1': {
    id: 'pm-1',
    name: 'Oil-based Cleanser',
    duration: '~2 min',
    icon: 'bottle-tonic-outline',
    category: 'DOUBLE CLEANSE',
  },
  'pm-2': {
    id: 'pm-2',
    name: 'Gentle Cleanser',
    duration: '~1 min',
    icon: 'water-outline',
    category: 'CLEANSE',
  },
  'pm-3': {
    id: 'pm-3',
    name: 'Niacinamide Serum',
    duration: '~1 min',
    icon: 'medical-bag',
    category: 'CALM',
  },
  'pm-5': {
    id: 'pm-5',
    name: 'Salicylic Treatment',
    duration: '~2 min',
    icon: 'flask-empty-outline',
    category: 'TREAT',
  },
  'pm-4': {
    id: 'pm-4',
    name: 'Night Repair Cream',
    duration: '~2 min',
    icon: 'weather-night',
    category: 'RECOVER',
  },
};

function concernWeight(concern: ReportConcern): number {
  switch (concern.severity) {
    case 'high':
      return 0.9;
    case 'medium':
      return 0.65;
    case 'low':
      return 0.4;
    default:
      return 0;
  }
}

function concernLevel(result: SkinAnalysisResult, id: string): number {
  const c = result.concerns.find((x) => x.id === id);
  return c ? concernWeight(c) : 0;
}

function pickMorningTreatment(
  result: SkinAnalysisResult,
  quiz: QuizAnswers | null,
  sensitive: boolean,
): RoutineStep | null {
  const quizConcerns = new Set(quiz?.concerns ?? []);
  const goals = new Set(quiz?.goals ?? []);
  const acne = concernLevel(result, 'acne') + (quizConcerns.has('acne') ? 0.25 : 0);
  const texture = concernLevel(result, 'texture');
  const hydration = concernLevel(result, 'hydration');
  const barrier = concernLevel(result, 'barrier');

  if (
    goals.has('calming-redness') ||
    goals.has('clearing-acne') ||
    acne >= 0.4 ||
    quizConcerns.has('redness') ||
    quizConcerns.has('acne')
  ) {
    return STEP_DEFS['am-3b'];
  }
  if (
    !sensitive &&
    (goals.has('brightening') ||
      goals.has('anti-aging') ||
      texture >= 0.4 ||
      quizConcerns.has('uneven-tone') ||
      quizConcerns.has('dark-spots'))
  ) {
    return STEP_DEFS['am-3'];
  }
  if (goals.has('hydration') || hydration >= 0.45 || quizConcerns.has('dryness')) {
    return STEP_DEFS['am-6'];
  }
  if (goals.has('minimizing-pores') || texture >= 0.45) {
    return STEP_DEFS['am-3b'];
  }
  if (!sensitive && barrier < 0.5) {
    return STEP_DEFS['am-3b'];
  }
  return null;
}

function pickEveningTreatment(
  result: SkinAnalysisResult,
  quiz: QuizAnswers | null,
): RoutineStep | null {
  const quizConcerns = new Set(quiz?.concerns ?? []);
  const acne = concernLevel(result, 'acne') + (quizConcerns.has('acne') ? 0.2 : 0);
  const texture = concernLevel(result, 'texture');
  const barrier = concernLevel(result, 'barrier');

  const goals = new Set(quiz?.goals ?? []);
  if (
    goals.has('clearing-acne') ||
    acne >= 0.65 ||
    (quizConcerns.has('acne') && acne >= 0.35)
  ) {
    return STEP_DEFS['pm-5'];
  }
  if (
    goals.has('calming-redness') ||
    goals.has('minimizing-pores') ||
    acne >= 0.4 ||
    texture >= 0.4 ||
    barrier >= 0.4 ||
    quizConcerns.has('redness')
  ) {
    return STEP_DEFS['pm-3'];
  }
  return null;
}

/** Build morning/evening steps from scan concerns + quiz profile. */
export function generatePersonalizedRoutine(
  result: SkinAnalysisResult,
  quiz: QuizAnswers | null,
): PersonalizedRoutine {
  const skinType = result.skinTypeId ?? result.skinType;
  const oily = skinType === 'oily' || skinType === 'combination';
  const dry = skinType === 'dry';
  const sensitive =
    skinType === 'sensitive' || (quiz?.concerns ?? []).includes('sensitivity');

  const quizConcerns = new Set(quiz?.concerns ?? []);
  const goals = new Set(quiz?.goals ?? []);
  const hydration = concernLevel(result, 'hydration');
  const doubleCleansePm =
    oily || quiz?.routine === 'full' || quizConcerns.has('acne');

  if (goals.has('keeping-simple')) {
    return {
      subtitle: `A simple ${skinType} routine focused on cleanse, hydrate, and protect.`,
      morning: [STEP_DEFS['am-1'], STEP_DEFS['am-4'], STEP_DEFS['am-5']],
      evening: [STEP_DEFS['pm-2'], STEP_DEFS['pm-4']],
    };
  }

  const morning: RoutineStep[] = [STEP_DEFS['am-1']];

  if (dry || hydration >= 0.35 || quizConcerns.has('dryness')) {
    morning.push(STEP_DEFS['am-2']);
  }

  const amTreatment = pickMorningTreatment(result, quiz, sensitive);
  if (amTreatment) morning.push(amTreatment);

  morning.push(STEP_DEFS['am-4'], STEP_DEFS['am-5']);

  const evening: RoutineStep[] = [];
  if (doubleCleansePm) {
    evening.push(STEP_DEFS['pm-1'], STEP_DEFS['pm-2']);
  } else {
    evening.push(STEP_DEFS['pm-2']);
  }

  const pmTreatment = pickEveningTreatment(result, quiz);
  if (pmTreatment) evening.push(pmTreatment);

  evening.push(STEP_DEFS['pm-4']);

  const topNames = result.concerns
    .filter((c) => c.severity !== 'healthy')
    .sort((a, b) => concernWeight(b) - concernWeight(a))
    .slice(0, 2)
    .map((c) => c.name.toLowerCase());

  const focus =
    topNames.length >= 2
      ? `${topNames[0]} and ${topNames[1]}`
      : topNames[0] ?? 'hydration and barrier support';

  return {
    subtitle: `Built for ${skinType} with focus on ${focus}.`,
    morning,
    evening,
  };
}

export function getAllRoutineStepDefs(): RoutineStep[] {
  return Object.values(STEP_DEFS);
}
