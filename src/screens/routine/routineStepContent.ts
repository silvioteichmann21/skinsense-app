import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

import type { PersonalizedRoutine, RoutineStep } from '@/types/routine';
import { EVENING_STEPS, MORNING_STEPS } from '@/types/routine';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type RoutineListMeta = {
  productRec: string;
  whyHint: string;
  whyIcon: IconName;
};

export type StepProduct = {
  id: string;
  name: string;
  matchPercent: number;
  imageUri: string;
};

export type StepDetailContent = {
  heroImageUri: string;
  why: string;
  whyHighlight: string;
  dosage: { value: string; unit: string };
  when: { am: boolean; pm: boolean; frequency: string };
  applySteps: string[];
  proTip: string;
  products: StepProduct[];
};

export type EnrichedRoutineStep = RoutineStep & RoutineListMeta & { detail: StepDetailContent };

const CLEANSER_HERO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAPfe990rXArEjhmuShNx-cjHlzQFGYQatx7PUJJeLDrArri9uHVQqo1HDRtP5GLldib4TqoqkS5gJsb-r7Akw3TIVSThXGnoKRnB16Ez-9oHiwefeBueI4BiUjAiqhmcOATNE8nXwHpuiavb_DuxN7MpVvQnkqpou68D_Z23FoUoLXbyPt2Ttt0x9sy6OrJtoe2XWHKdphlw7W4Tva42gDiBIWqYBEDJ9VQWzqNyT4Z8XDKekRSR0uDZHpefknScV5xEjcrkKitq4';

const IMG_WASH =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsERShLtAAfKTvfFykhBiisPsE-HVBptSzlRV7I4Bs5niyUe4u2Iq9l8QMB8pFQRpKQXVPMuDCnGjwou8bUnlShvZ9mFcbdYhUtw8N-4VxZv0fxhVzlvkSLaXV-VajiWgeB7k-VANaadoh_9bpKxUFPEkUExNhBzJMf_8CFuQlImas8IEkQ2p1DbzBZpkSIt5JkOjVk2A4M7wvbc99NtNb0QfgaFbWOwrzxsLLS3Yj2Psm1hrPeP5ACKmJXU9pzb59YPFcznC_p9E';
const IMG_BALM =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNPRnlfNKSXbksor0GfSonBaNbg5q6jJzBdXmnkPrfnTmU6txcwMioR-0Ywpe7KCfKkuW0zjl2AAMXpUdk_ZLlCG4TYSx85ROEL1yyApqSmDhW0gU1cm1-M4_qSgr2m44KmCtalv7xhV6IkuxXSdfWcGbu3SKZClvx9i4JCO92-XpP5ms7WklXlHY0V7tu9GJSnINtbvplftKgrteRyIMbYTBnaL6blpbnFpkWuaSM0wrkJ3AE_tLXdt8MSXPLLwWUDsSyZpW_SE';
const IMG_GEL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDydQO4OBDMYdvi9YtjhKVbP_0pSLtideCYrHQOLZdUZtTXI2zMgSUFhFo5KokEtRXhOjNtR6wbQ19WgPslq5A5PBDVpLqh3ZYuHAb6p3_k4ZbGo2WwhiTfTow3BDeOFVycNWYnu5XHV6GOKvA0ynjMf_p1-tNwCxQ8bbBpsoegU16s8trSRVkk3zqFyYy-hehOrdd2RmB1pm9hkdvDWu0lQ3JBeAau9pyTaYHwNIRIVBEFTpDwxFIj6UtCF1zdLyeLtlNdT39goJ8';

const CLEANSER_APPLY = [
  'Wet face with lukewarm water.',
  'Apply 2 pumps to fingertips.',
  'Massage in circular motions for 60 seconds.',
  'Rinse and pat dry.',
];
const CLEANSER_TIP =
  'Double cleanse in the evening if wearing makeup or heavy SPF to ensure a truly deep clean.';

const CLEANSER_PRODUCTS: StepProduct[] = [
  { id: 'r1', name: 'Hydrating Wash', matchPercent: 98, imageUri: IMG_WASH },
  { id: 'r2', name: 'Oat Cleansing Balm', matchPercent: 94, imageUri: IMG_BALM },
  { id: 'r3', name: 'Soothing Gel', matchPercent: 91, imageUri: IMG_GEL },
];

const LIST_META: Record<string, RoutineListMeta> = {
  'am-1': {
    productRec: 'Try: CeraVe Hydrating Cleanser',
    whyHint: 'Targets dryness from your last scan',
    whyIcon: 'information-outline',
  },
  'am-2': {
    productRec: 'Try: Laneige Water Bank',
    whyHint: 'Boosts moisture barrier',
    whyIcon: 'check-decagram-outline',
  },
  'am-3': {
    productRec: 'Try: SkinCeuticals CE Ferulic',
    whyHint: 'Brightens and protects',
    whyIcon: 'white-balance-sunny',
  },
  'am-3b': {
    productRec: 'Try: The Ordinary Niacinamide',
    whyHint: 'Calms redness and supports barrier',
    whyIcon: 'medical-bag',
  },
  'am-6': {
    productRec: 'Try: Hyaluronic Acid 2%',
    whyHint: 'Boosts hydration from your scan',
    whyIcon: 'water-plus',
  },
  'am-4': {
    productRec: "Try: Kiehl's Ultra Facial Cream",
    whyHint: 'Locks in hydration',
    whyIcon: 'lock-outline',
  },
  'am-5': {
    productRec: 'Try: EltaMD UV Clear',
    whyHint: 'Daily UV protection',
    whyIcon: 'shield-outline',
  },
  'pm-1': {
    productRec: 'Try: DHC Deep Cleansing Oil',
    whyHint: 'Dissolves SPF and makeup',
    whyIcon: 'oil',
  },
  'pm-2': {
    productRec: 'Try: CeraVe Hydrating Cleanser',
    whyHint: 'Second cleanse without stripping',
    whyIcon: 'water-outline',
  },
  'pm-3': {
    productRec: 'Try: The Ordinary Niacinamide',
    whyHint: 'Calms redness from your scan',
    whyIcon: 'heart-pulse',
  },
  'pm-5': {
    productRec: 'Try: 2% Salicylic Acid',
    whyHint: 'Targets acne flagged in your scan',
    whyIcon: 'flask-empty-outline',
  },
  'pm-4': {
    productRec: 'Try: CeraVe PM Lotion',
    whyHint: 'Supports overnight repair',
    whyIcon: 'weather-night',
  },
};

const DETAIL: Record<string, StepDetailContent> = {
  'am-1': {
    heroImageUri: CLEANSER_HERO,
    why: 'Based on your profile, this cleanser was selected to neutralize transepidermal water loss. Its soap-free formula removes environmental pollutants without disrupting your lipid barrier, effectively preparing your skin to absorb the active serums in step two.',
    whyHighlight: 'neutralize transepidermal water loss',
    dosage: { value: '2', unit: 'Pumps' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: CLEANSER_APPLY,
    proTip: CLEANSER_TIP,
    products: CLEANSER_PRODUCTS,
  },
  'am-2': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 't1',
        name: 'Water Bank Toner',
        matchPercent: 96,
        imageUri: IMG_WASH,
      },
      {
        id: 't2',
        name: 'Hydrating Essence',
        matchPercent: 92,
        imageUri: IMG_BALM,
      },
    ],
  },
  'am-3b': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'n-am',
        name: 'Niacinamide 10%',
        matchPercent: 95,
        imageUri: IMG_GEL,
      },
    ],
  },
  'am-6': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'h1',
        name: 'Hyaluronic 2%',
        matchPercent: 94,
        imageUri: IMG_WASH,
      },
    ],
  },
  'am-3': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'v1',
        name: 'CE Ferulic Serum',
        matchPercent: 97,
        imageUri: IMG_WASH,
      },
      {
        id: 'v2',
        name: '15% Vitamin C',
        matchPercent: 90,
        imageUri: IMG_GEL,
      },
    ],
  },
  'am-4': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'm1',
        name: 'Ultra Facial Cream',
        matchPercent: 93,
        imageUri: IMG_BALM,
      },
      {
        id: 'm2',
        name: 'Hydro Boost Gel',
        matchPercent: 88,
        imageUri: IMG_GEL,
      },
    ],
  },
  'am-5': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 's1',
        name: 'UV Clear SPF 46',
        matchPercent: 95,
        imageUri: IMG_WASH,
      },
      {
        id: 's2',
        name: 'Mineral SPF 30',
        matchPercent: 91,
        imageUri: IMG_GEL,
      },
    ],
  },
  'pm-1': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'o1',
        name: 'Deep Cleansing Oil',
        matchPercent: 94,
        imageUri: IMG_BALM,
      },
    ],
  },
  'pm-2': {
    heroImageUri: CLEANSER_HERO,
    why: 'Your second cleanse removes remaining oil and debris while keeping the barrier calm — especially important after actives in your evening routine.',
    whyHighlight: 'keeping the barrier calm',
    dosage: { value: '2', unit: 'Pumps' },
    when: { am: true, pm: true, frequency: 'Daily' },
    applySteps: CLEANSER_APPLY,
    proTip: CLEANSER_TIP,
    products: CLEANSER_PRODUCTS,
  },
  'pm-5': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'bha1',
        name: '2% BHA Liquid',
        matchPercent: 93,
        imageUri: IMG_GEL,
      },
    ],
  },
  'pm-3': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'n1',
        name: 'Niacinamide 10%',
        matchPercent: 96,
        imageUri: IMG_GEL,
      },
    ],
  },
  'pm-4': {
    heroImageUri: CLEANSER_HERO,
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
    products: [
      {
        id: 'c1',
        name: 'PM Facial Lotion',
        matchPercent: 92,
        imageUri: IMG_WASH,
      },
    ],
  },
};

function enrich(step: RoutineStep): EnrichedRoutineStep {
  const meta = LIST_META[step.id];
  const detail = DETAIL[step.id] ?? DETAIL['am-1'];
  return {
    ...step,
    productRec: meta?.productRec ?? `Try: ${step.name}`,
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
  const fallback = [...MORNING_STEPS, ...EVENING_STEPS];
  const dynamic = routine ? [...routine.morning, ...routine.evening] : [];
  const base =
    dynamic.find((s) => s.id === stepId) ?? fallback.find((s) => s.id === stepId);
  return base ? enrich(base) : undefined;
}

export const ROUTINE_STREAK_DAYS = 12;
