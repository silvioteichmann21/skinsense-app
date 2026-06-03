import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type RoutineStep = {
  id: string;
  name: string;
  duration: string;
  icon: IconName;
  category: string;
};

export type PersonalizedRoutine = {
  subtitle: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
};

export const MORNING_STEPS: RoutineStep[] = [
  { id: 'am-1', name: 'Gentle Cleanser', duration: '~1 min', icon: 'water-outline', category: 'CLEANSE' },
  { id: 'am-2', name: 'Hydrating Toner', duration: '~1 min', icon: 'water', category: 'PREP' },
  { id: 'am-3', name: 'Vitamin C Serum', duration: '~2 min', icon: 'flask-outline', category: 'TREAT' },
  { id: 'am-4', name: 'Lightweight Moisturizer', duration: '~1 min', icon: 'spa', category: 'HYDRATE' },
  { id: 'am-5', name: 'Mineral SPF 30', duration: '~1 min', icon: 'white-balance-sunny', category: 'PROTECT' },
];

export const EVENING_STEPS: RoutineStep[] = [
  { id: 'pm-1', name: 'Oil-based Cleanser', duration: '~2 min', icon: 'bottle-tonic-outline', category: 'DOUBLE CLEANSE' },
  { id: 'pm-2', name: 'Gentle Cleanser', duration: '~1 min', icon: 'water-outline', category: 'CLEANSE' },
  { id: 'pm-3', name: 'Niacinamide Serum', duration: '~1 min', icon: 'medical-bag', category: 'CALM' },
  { id: 'pm-4', name: 'Night Repair Cream', duration: '~2 min', icon: 'weather-night', category: 'RECOVER' },
];
