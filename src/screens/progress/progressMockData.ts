import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type TrendPeriod = '30d' | '90d' | '180d';

export type ScoreTrendPoint = {
  label: string;
  score: number;
};

export type ConcernTrend = {
  id: string;
  name: string;
  status: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  change: string;
  changePositive: boolean;
  sparkline: number[];
  sparkStroke?: string;
};

export type TimelinePhoto = {
  id: string;
  dateLabel: string;
  score: number;
  imageUri: string;
  dimmed?: boolean;
};

export type Milestone = {
  id: string;
  label: string;
  icon: IconName;
  unlocked: boolean;
};

export const WEEKLY_DIGEST = {
  adherencePercent: 78,
  deltaLabel: '+5% vs last week',
  body: 'Your adherence is 78%. Great job on nighttime hydration, but morning SPF usage has slipped. Consistency is key for your texture goals.',
};

export const SCORE_BY_PERIOD: Record<TrendPeriod, { current: number; points: ScoreTrendPoint[] }> = {
  '30d': {
    current: 84,
    points: [
      { label: 'Oct 1', score: 68 },
      { label: '', score: 72 },
      { label: '', score: 70 },
      { label: '', score: 75 },
      { label: '', score: 80 },
      { label: '', score: 78 },
      { label: 'Oct 15', score: 82 },
      { label: '', score: 84 },
    ],
  },
  '90d': {
    current: 81,
    points: [
      { label: 'Aug', score: 62 },
      { label: '', score: 68 },
      { label: '', score: 72 },
      { label: '', score: 76 },
      { label: 'Oct', score: 81 },
    ],
  },
  '180d': {
    current: 79,
    points: [
      { label: 'May', score: 58 },
      { label: '', score: 65 },
      { label: '', score: 70 },
      { label: '', score: 74 },
      { label: '', score: 79 },
    ],
  },
};

export const CONCERN_TRENDS: ConcernTrend[] = [
  {
    id: 'hydration',
    name: 'Hydration',
    status: 'Optimal',
    icon: 'water',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    change: '+12%',
    changePositive: true,
    sparkline: [20, 10, 15, 5, 8],
  },
  {
    id: 'acne',
    name: 'Acne',
    status: 'Calming',
    icon: 'virus',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    change: '+8%',
    changePositive: true,
    sparkline: [5, 15, 10, 20],
  },
  {
    id: 'texture',
    name: 'Texture',
    status: 'Needs Focus',
    icon: 'blur',
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    change: '-2%',
    changePositive: false,
    sparkline: [15, 18, 16, 19],
    sparkStroke: '#8E4E14',
  },
];

export const PHOTO_TIMELINE: TimelinePhoto[] = [
  {
    id: 't1',
    dateLabel: 'Oct 28',
    score: 84,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0eZlkEMGKaNcpvA0bV5fzfq6wDT4ANj6qwtV_1tndbt4WUunfDZjvGm9l_XwgMpod1eUVHyofurkb0nhKlHNpKwUI-EBwzDjnNyn7yZ_kFstOugDC5bRMxS86e59L-EIRnD6tLeIpE7o4RyAXYz_5cVdk31bmB5O5Bi0EFxPiwOkrSmBB9WjafqjfXW7L95O7O-j2j5_cI1-FkQZqFC4gmj-LE9XiZa2w3mgYX22bN4H869XtKrPpVoDon0GSsegLmJPovnPLRAI',
  },
  {
    id: 't2',
    dateLabel: 'Oct 14',
    score: 79,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnTJpRsgbKLCAG2rnvpESIQmC_cSuGzM8vkPwlssv0h60JgNtGqkCTQlG7aiI-n1pVWkaBFPizmdD1tOzBu_az-ulP980EwE6SGp_O7hd1HEPzFbSw8rxdd_KRkmBCBjoex-mrdJJDqImPncsqWYAIXvCARK6yKCIMuZc79IyvpEW6sygw9Rg6M4ygkt37_3Wvi_IAIGFxUnsdyZUvhVoPtOWOqcaYTdEXoPsnPTs_XJd9DThnazZ-F2LD37eWqzwgtCR2wj4nIvc',
  },
  {
    id: 't3',
    dateLabel: 'Sep 28',
    score: 76,
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZhwrDtaUQ24uZep74D3WY-6csZ6Ktxh4WJiILRZ8AthIf_3flwwxGFXP5d-R0HsOt5fvz6UM8REbyzOdSI9AV-n22dl3IDXzrWeQeuyNPH77zoavSDb6vRHurhi38a-UrtKgbH9w_WPJvEjCi--0LRyVQMWZ4vJSv4XVZ3uuLJRUrV69OdtfaFQXrHW8BWRpG9LTCa-r__gfAKj1Ndg3RWotsOjofRS5ThbT0Wo8Nqx7tr9lslAjev28qWYD-3q_atNpXFBDbWW4',
    dimmed: true,
  },
];

export const MILESTONES: Milestone[] = [
  { id: 'm1', label: '7-Day Streak', icon: 'medal-outline', unlocked: true },
  { id: 'm2', label: 'First Scan', icon: 'camera-timer', unlocked: true },
  { id: 'm3', label: '30-Day Ritual', icon: 'calendar-month-outline', unlocked: false },
  { id: 'm4', label: 'Ingredient Pro', icon: 'flask-outline', unlocked: true },
  { id: 'm5', label: 'Zen Master', icon: 'meditation', unlocked: false },
  { id: 'm6', label: 'Bloom Award', icon: 'flower-outline', unlocked: false },
];
