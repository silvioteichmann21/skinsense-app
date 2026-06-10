import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

import { CONCERN_INGREDIENT_IDS, type SkinConcern } from '@/types/activeIngredient';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ConcernDetailSource = {
  causeKeys: readonly { icon: IconName; key: string }[];
  improvementKeys: readonly string[];
  libraryTopicKey: string;
  ingredientIds: string[];
};

export const CONCERN_DETAIL_SOURCE: Record<string, ConcernDetailSource> = {
  hydration: {
    causeKeys: [
      { icon: 'weather-cloudy', key: 'environment' },
      { icon: 'food-apple-outline', key: 'diet' },
      { icon: 'flask-outline', key: 'wrongProducts' },
      { icon: 'dna', key: 'genetics' },
    ],
    improvementKeys: ['step1', 'step2', 'step3'],
    libraryTopicKey: 'dehydration',
    ingredientIds: CONCERN_INGREDIENT_IDS.hydration,
  },
  acne: {
    causeKeys: [
      { icon: 'hospital-box-outline', key: 'hormones' },
      { icon: 'bottle-tonic-outline', key: 'comedogenic' },
      { icon: 'lightning-bolt-outline', key: 'stress' },
      { icon: 'bed-outline', key: 'sleep' },
    ],
    improvementKeys: ['step1', 'step2', 'step3'],
    libraryTopicKey: 'acne',
    ingredientIds: CONCERN_INGREDIENT_IDS.acne,
  },
  texture: {
    causeKeys: [
      { icon: 'white-balance-sunny', key: 'sun' },
      { icon: 'water-outline', key: 'dehydration' },
      { icon: 'layers-outline', key: 'buildup' },
      { icon: 'clock-outline', key: 'aging' },
    ],
    improvementKeys: ['step1', 'step2', 'step3'],
    libraryTopicKey: 'texture',
    ingredientIds: CONCERN_INGREDIENT_IDS.texture,
  },
  barrier: {
    causeKeys: [
      { icon: 'weather-windy', key: 'climate' },
      { icon: 'flask-empty-outline', key: 'harshActives' },
      { icon: 'water-off-outline', key: 'overCleansing' },
      { icon: 'shield-off-outline', key: 'overload' },
    ],
    improvementKeys: ['step1', 'step2', 'step3'],
    libraryTopicKey: 'barrier',
    ingredientIds: CONCERN_INGREDIENT_IDS.barrier,
  },
};

export function concernToSkinConcern(concernId: string): SkinConcern {
  if (concernId === 'hydration' || concernId === 'acne' || concernId === 'texture' || concernId === 'barrier') {
    return concernId;
  }
  return 'hydration';
}
