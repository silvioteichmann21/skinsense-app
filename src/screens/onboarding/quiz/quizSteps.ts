import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type GridOption = {
  id: string;
  label: string;
  icon: IconName;
  fullWidth?: boolean;
};

export type ListOption = {
  id: string;
  label: string;
  description?: string;
  icon?: IconName;
};

export type BentoOption = {
  id: string;
  label: string;
  icon: IconName;
};

export const QUIZ_TOTAL_STEPS = 5;

export const concernOptions: GridOption[] = [
  { id: 'acne', label: 'Acne', icon: 'spa' },
  { id: 'oiliness', label: 'Oiliness', icon: 'water' },
  { id: 'dryness', label: 'Dryness', icon: 'water-outline' },
  { id: 'uneven-tone', label: 'Uneven tone', icon: 'blur' },
  { id: 'dark-spots', label: 'Dark spots', icon: 'circle-multiple-outline' },
  { id: 'wrinkles', label: 'Wrinkles', icon: 'chart-line' },
  { id: 'redness', label: 'Redness', icon: 'white-balance-sunny' },
  { id: 'sensitivity', label: 'Sensitivity', icon: 'shield-check-outline' },
  { id: 'large-pores', label: 'Large pores', icon: 'view-grid-outline', fullWidth: true },
];

export const skinTypeOptions: ListOption[] = [
  {
    id: 'very-oily',
    label: 'Very oily',
    description: 'Persistent shine and frequent breakouts across the whole face.',
  },
  {
    id: 'oily',
    label: 'Oily',
    description: 'Noticeable shine through the day, especially in the afternoon.',
  },
  {
    id: 'combination',
    label: 'Combination',
    description: 'Oily T-zone (forehead, nose, chin) but normal or dry cheeks.',
  },
  {
    id: 'normal',
    label: 'Normal',
    description: 'Balanced moisture levels, neither particularly oily nor dry.',
  },
  {
    id: 'dry',
    label: 'Dry',
    description: 'Tends to feel tight or rough, prone to occasional flaking.',
  },
  {
    id: 'very-dry',
    label: 'Very dry',
    description: 'Constant tightness, visible flaking, and frequent irritation.',
  },
  {
    id: 'not-sure',
    label: 'Not sure',
    description: "I'm not exactly certain how my skin behaves.",
  },
];

export const routineOptions: ListOption[] = [
  {
    id: 'none',
    label: 'No routine',
    description: 'I rarely use products beyond soap and water.',
    icon: 'cancel',
  },
  {
    id: 'cleanser',
    label: 'Cleanser only',
    description: 'Simple wash, but no targeted treatments.',
    icon: 'water-outline',
  },
  {
    id: 'basic',
    label: 'Basic (3 steps)',
    description: 'Cleanse, hydrate, and protect daily.',
    icon: 'spa',
  },
  {
    id: 'full',
    label: 'Full routine (5+ steps)',
    description: 'Serums, toners, and specialized care.',
    icon: 'auto-fix',
  },
  {
    id: 'beginner',
    label: "I don't know where to start",
    description: "I'm a total beginner looking for guidance.",
    icon: 'help-circle-outline',
  },
];

export const ageRangeOptions: ListOption[] = [
  { id: 'under-18', label: 'Under 18' },
  { id: '18-24', label: '18–24' },
  { id: '25-34', label: '25–34' },
  { id: '35-44', label: '35–44' },
  { id: '45-54', label: '45–54' },
  { id: '55-plus', label: '55+' },
];

export const goalOptions: BentoOption[] = [
  { id: 'clearing-acne', label: 'Clearing acne', icon: 'medical-bag' },
  { id: 'anti-aging', label: 'Anti-aging', icon: 'clock-outline' },
  { id: 'brightening', label: 'Brightening', icon: 'white-balance-sunny' },
  { id: 'hydration', label: 'Hydration', icon: 'water' },
  { id: 'minimizing-pores', label: 'Minimizing pores', icon: 'view-grid-outline' },
  { id: 'calming-redness', label: 'Calming redness', icon: 'spa' },
  { id: 'natural-clean', label: 'Going natural/clean', icon: 'leaf' },
  { id: 'keeping-simple', label: 'Keeping it simple', icon: 'auto-fix' },
];

export const quizStepMeta = [
  {
    title: "What's your main skin concern?",
    subtitle: 'Choose up to 3 options to help us personalize your routine.',
    footerCaption: 'Step 1: Scientific Assessment',
    progress: 20,
    percentLabel: '20%',
  },
  {
    title: 'How would you describe your skin type right now?',
    subtitle: "Select the option that best represents your skin's daily behavior.",
    progress: 40,
    percentLabel: '40% Complete',
  },
  {
    title: "What's your current routine like?",
    subtitle: 'Knowing your habits helps us craft a regimen that actually fits into your daily life.',
    progress: 60,
    percentLabel: '60%',
  },
  {
    title: "What's your age range?",
    subtitle:
      "We tailor ingredient recommendations based on your skin's biological age and cellular turnover rate.",
    progress: 80,
    percentLabel: 'Step 4 of 5',
  },
  {
    title: 'What matters most to you?',
    subtitle: 'Choose up to 2',
    progress: 100,
    percentLabel: '100%',
  },
] as const;

export function labelForId(
  options: { id: string; label: string }[],
  id: string,
): string {
  return options.find((o) => o.id === id)?.label ?? id;
}
