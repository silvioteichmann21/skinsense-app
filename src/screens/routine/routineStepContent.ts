import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

import { STEP_INGREDIENT_IDS } from '@/types/activeIngredient';
import type { PersonalizedRoutine, RoutineStep } from '@/types/routine';
import { EVENING_STEPS, MORNING_STEPS } from '@/types/routine';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type RoutineListMeta = {
  ingredientFocus: string;
  whyHint: string;
  whyIcon: IconName;
};

export type StepDetailContent = {
  heroIcon: IconName;
  why: string;
  whyHighlight: string;
  dosage: { value: string; unit: string };
  when: { am: boolean; pm: boolean; frequency: string };
  applySteps: string[];
  proTip: string;
  ingredientIds: string[];
};

export type EnrichedRoutineStep = RoutineStep & RoutineListMeta & { detail: StepDetailContent };

const CLEANSER_APPLY = [
  'Wet face with lukewarm water.',
  'Apply 2 pumps to fingertips.',
  'Massage in circular motions for 60 seconds.',
  'Rinse and pat dry.',
];
const CLEANSER_TIP =
  'Double cleanse in the evening if wearing makeup or heavy SPF to ensure a truly deep clean.';

const LIST_META: Record<string, RoutineListMeta> = {
  'am-1': {
    ingredientFocus: 'Key actives: Ceramides, Glycerin',
    whyHint: 'Targets dryness from your last scan',
    whyIcon: 'information-outline',
  },
  'am-2': {
    ingredientFocus: 'Key actives: Hyaluronic Acid, Glycerin',
    whyHint: 'Boosts moisture barrier',
    whyIcon: 'check-decagram-outline',
  },
  'am-3': {
    ingredientFocus: 'Key active: Vitamin C',
    whyHint: 'Brightens and protects',
    whyIcon: 'white-balance-sunny',
  },
  'am-3b': {
    ingredientFocus: 'Key active: Niacinamide',
    whyHint: 'Calms redness and supports barrier',
    whyIcon: 'medical-bag',
  },
  'am-6': {
    ingredientFocus: 'Key active: Hyaluronic Acid',
    whyHint: 'Boosts hydration from your scan',
    whyIcon: 'water-plus',
  },
  'am-4': {
    ingredientFocus: 'Key actives: Ceramides, Squalane',
    whyHint: 'Locks in hydration',
    whyIcon: 'lock-outline',
  },
  'am-5': {
    ingredientFocus: 'Key active: Broad-Spectrum SPF',
    whyHint: 'Daily UV protection',
    whyIcon: 'shield-outline',
  },
  'pm-1': {
    ingredientFocus: 'Key active: Squalane',
    whyHint: 'Dissolves SPF and makeup',
    whyIcon: 'oil',
  },
  'pm-2': {
    ingredientFocus: 'Key actives: Ceramides, Glycerin',
    whyHint: 'Second cleanse without stripping',
    whyIcon: 'water-outline',
  },
  'pm-3': {
    ingredientFocus: 'Key active: Niacinamide',
    whyHint: 'Calms redness from your scan',
    whyIcon: 'heart-pulse',
  },
  'pm-5': {
    ingredientFocus: 'Key active: Salicylic Acid',
    whyHint: 'Targets acne flagged in your scan',
    whyIcon: 'flask-empty-outline',
  },
  'pm-4': {
    ingredientFocus: 'Key actives: Ceramides, Squalane',
    whyHint: 'Supports overnight repair',
    whyIcon: 'weather-night',
  },
};

const DETAIL: Record<string, StepDetailContent> = {
  'am-1': {
    heroIcon: 'face-woman-shimmer',
    why: 'Based on your profile, this cleanser was selected to neutralize transepidermal water loss. Its soap-free formula removes environmental pollutants without disrupting your lipid barrier, effectively preparing your skin to absorb the active serums in step two.',
    whyHighlight: 'neutralize transepidermal water loss',
    dosage: { value: '2', unit: 'Pumps' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: CLEANSER_APPLY,
    proTip: CLEANSER_TIP,
    ingredientIds: STEP_INGREDIENT_IDS['am-1'],
  },
  'am-2': {
    heroIcon: 'water-outline',
    why: 'This toner replenishes water content after cleansing and primes your skin to absorb treatment serums. It was matched to your scan’s mild dehydration around the cheeks.',
    whyHighlight: 'mild dehydration around the cheeks',
    dosage: { value: '1', unit: 'Capful' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: [
      'Pour onto a cotton pad or palms.',
      'Sweep across face and neck.',
      'Wait 30 seconds before the next step.',
      'Do not rinse off.',
    ],
    proTip: 'Press the toner in with your palms instead of rubbing to reduce friction on sensitive areas.',
    ingredientIds: STEP_INGREDIENT_IDS['am-2'],
  },
  'am-3b': {
    heroIcon: 'heart-pulse',
    why: 'Morning niacinamide calms redness and helps regulate oil without the irritation risk of stronger acids — matched to what your scan highlighted.',
    whyHighlight: 'calms redness',
    dosage: { value: '2', unit: 'Drops' },
    when: { am: true, pm: false, frequency: 'Daily' },
    applySteps: [
      'Apply to clean, dry skin after toner.',
      'Smooth over face; avoid the eye area.',
      'Wait 1 minute before moisturizer.',
      'Always follow with SPF in the morning.',
    ],
    proTip: 'If you also use vitamin C on other days, alternate mornings rather than layering both.',
    ingredientIds: STEP_INGREDIENT_IDS['am-3b'],
  },
  'am-6': {
    heroIcon: 'water-plus',
    why: 'Hyaluronic acid pulls water into the skin after cleansing — especially helpful when your scan suggests dehydration in the cheek zones.',
    whyHighlight: 'dehydration in the cheek zones',
    dosage: { value: '3', unit: 'Drops' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: [
      'Apply to damp skin for best absorption.',
      'Press gently into cheeks and forehead.',
      'Layer moisturizer on top while skin is still slightly damp.',
      'Do not skip SPF in the morning.',
    ],
    proTip: 'Mist face with water or use toner first so hyaluronic acid has moisture to bind to.',
    ingredientIds: STEP_INGREDIENT_IDS['am-6'],
  },
  'am-3': {
    heroIcon: 'white-balance-sunny',
    why: 'Vitamin C supports brightness and environmental defense. Your scan showed room to improve overall radiance without aggravating existing congestion.',
    whyHighlight: 'improve overall radiance',
    dosage: { value: '3', unit: 'Drops' },
    when: { am: true, pm: false, frequency: 'Daily' },
    applySteps: [
      'Apply to dry skin after toner.',
      'Use 3–4 drops for face and neck.',
      'Allow 1 minute to absorb.',
      'Follow with moisturizer and SPF.',
    ],
    proTip: 'Store vitamin C in a cool, dark place and avoid mixing with niacinamide in the same layer if your skin is reactive.',
    ingredientIds: STEP_INGREDIENT_IDS['am-3'],
  },
  'am-4': {
    heroIcon: 'lock-outline',
    why: 'A lightweight moisturizer seals hydration from previous steps and supports your barrier, which your latest scan rated as healthy but still benefits from consistent sealing.',
    whyHighlight: 'supports your barrier',
    dosage: { value: '1', unit: 'Scoop' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: [
      'Warm product between fingertips.',
      'Press onto cheeks, forehead, and chin.',
      'Blend outward with gentle upward strokes.',
      'Wait before applying SPF in the morning.',
    ],
    proTip: 'If skin feels tight in the afternoon, you can add a thin second layer only on dry zones.',
    ingredientIds: STEP_INGREDIENT_IDS['am-4'],
  },
  'am-5': {
    heroIcon: 'weather-sunny',
    why: 'Mineral SPF 30 shields against UV-driven texture changes and helps prevent post-acne marks from darkening — a priority for your combination skin profile.',
    whyHighlight: 'UV-driven texture changes',
    dosage: { value: '2', unit: 'Finger lengths' },
    when: { am: true, pm: false, frequency: 'Daily' },
    applySteps: [
      'Apply as the final morning step.',
      'Use two finger-lengths for face and neck.',
      'Blend until no white cast remains.',
      'Reapply every 2 hours if outdoors.',
    ],
    proTip: 'Wait 15 minutes before makeup so the filter sets evenly on the skin.',
    ingredientIds: STEP_INGREDIENT_IDS['am-5'],
  },
  'pm-1': {
    heroIcon: 'oil',
    why: 'Oil cleansing dissolves sunscreen and sebum before your water-based cleanse, reducing the chance of clogged pores along the chin and jaw.',
    whyHighlight: 'clogged pores along the chin',
    dosage: { value: '1', unit: 'Pump' },
    when: { am: false, pm: true, frequency: 'Daily' },
    applySteps: [
      'Apply to dry skin with dry hands.',
      'Massage for 45–60 seconds.',
      'Emulsify with a splash of water.',
      'Rinse thoroughly before step two.',
    ],
    proTip: 'Focus on the hairline and jawline where SPF buildup is common.',
    ingredientIds: STEP_INGREDIENT_IDS['pm-1'],
  },
  'pm-2': {
    heroIcon: 'face-woman-shimmer',
    why: 'Your second cleanse removes remaining oil and debris while keeping the barrier calm — especially important after actives in your evening routine.',
    whyHighlight: 'keeping the barrier calm',
    dosage: { value: '2', unit: 'Pumps' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: CLEANSER_APPLY,
    proTip: CLEANSER_TIP,
    ingredientIds: STEP_INGREDIENT_IDS['pm-2'],
  },
  'pm-5': {
    heroIcon: 'flask-outline',
    why: 'Salicylic acid exfoliates inside pores when acne is a primary concern from your scan. Use on non-retinol nights and always moisturize after.',
    whyHighlight: 'acne is a primary concern',
    dosage: { value: '1', unit: 'Thin layer' },
    when: { am: false, pm: true, frequency: '3× weekly' },
    applySteps: [
      'Apply to dry, clean skin.',
      'Use a thin layer on T-zone and breakout-prone areas.',
      'Wait 2 minutes before moisturizer.',
      'Start 2–3 nights per week and increase slowly.',
    ],
    proTip: 'Do not combine with retinol or strong AHAs the same night until your barrier feels comfortable.',
    ingredientIds: STEP_INGREDIENT_IDS['pm-5'],
  },
  'pm-3': {
    heroIcon: 'heart-pulse',
    why: 'Niacinamide helps calm visible redness and refine the look of pores without the irritation risk of stronger retinoids at this stage of your journey.',
    whyHighlight: 'calm visible redness',
    dosage: { value: '2', unit: 'Drops' },
    when: { am: false, pm: true, frequency: 'Daily' },
    applySteps: [
      'Apply to clean, dry skin.',
      'Smooth over face and avoid the eye area.',
      'Wait 1 minute before moisturizer.',
      'Patch test if you are new to niacinamide.',
    ],
    proTip: 'If tingling occurs, buffer with moisturizer first and apply serum on top.',
    ingredientIds: STEP_INGREDIENT_IDS['pm-3'],
  },
  'pm-4': {
    heroIcon: 'weather-night',
    why: 'Night cream supports repair while you sleep and complements your morning hydration strategy identified in your latest scan.',
    whyHighlight: 'supports repair while you sleep',
    dosage: { value: '1', unit: 'Scoop' },
    when: { am: false, pm: true, frequency: 'Daily' },
    applySteps: [
      'Apply as the final evening step.',
      'Press onto face and neck.',
      'Use a slightly richer amount on dry zones.',
      'Avoid layering with strong acids the same night.',
    ],
    proTip: 'Pair with silk pillowcases to reduce friction on treated skin overnight.',
    ingredientIds: STEP_INGREDIENT_IDS['pm-4'],
  },
};

function enrich(step: RoutineStep): EnrichedRoutineStep {
  const meta = LIST_META[step.id];
  const detail = DETAIL[step.id] ?? DETAIL['am-1'];
  return {
    ...step,
    ingredientFocus: meta?.ingredientFocus ?? `Key actives for ${step.name}`,
    whyHint: meta?.whyHint ?? 'Personalized for your skin goals',
    whyIcon: meta?.whyIcon ?? 'information-outline',
    detail,
  };
}

export function getRoutineSteps(
  period: 'morning' | 'evening',
  routine?: PersonalizedRoutine | null,
): EnrichedRoutineStep[] {
  const steps =
    routine != null
      ? period === 'morning'
        ? routine.morning
        : routine.evening
      : period === 'morning'
        ? MORNING_STEPS
        : EVENING_STEPS;
  return steps.map(enrich);
}

export function getEnrichedStep(
  stepId: string,
  routine?: PersonalizedRoutine | null,
): EnrichedRoutineStep | undefined {
  const all = [...getRoutineSteps('morning', routine), ...getRoutineSteps('evening', routine)];
  return all.find((s) => s.id === stepId);
}
