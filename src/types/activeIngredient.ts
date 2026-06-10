import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type IngredientIcon = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type SkinConcern = 'hydration' | 'acne' | 'texture' | 'barrier';

/** Structural metadata only — all display text comes from i18n. */
export type IngredientMeta = {
  id: string;
  icon: IngredientIcon;
  concerns: SkinConcern[];
};

export type LocalizedActiveIngredient = {
  id: string;
  icon: IngredientIcon;
  concerns: SkinConcern[];
  name: string;
  category: string;
  summary: string;
  whyItWorks: string;
  howItHelps: string[];
  routineRole: string;
  consistencyNote: string;
  scienceNote: string;
  evidenceNote: string;
};

export const INGREDIENT_META: IngredientMeta[] = [
  { id: 'hyaluronic-acid', icon: 'water-outline', concerns: ['hydration', 'barrier'] },
  { id: 'ceramides', icon: 'shield-outline', concerns: ['hydration', 'barrier'] },
  { id: 'niacinamide', icon: 'heart-pulse', concerns: ['acne', 'barrier', 'texture'] },
  { id: 'vitamin-c', icon: 'white-balance-sunny', concerns: ['texture'] },
  { id: 'salicylic-acid', icon: 'flask-outline', concerns: ['acne', 'texture'] },
  { id: 'spf', icon: 'weather-sunny', concerns: ['texture', 'acne'] },
  { id: 'glycerin', icon: 'water-plus', concerns: ['hydration'] },
  { id: 'squalane', icon: 'oil', concerns: ['barrier', 'hydration'] },
];

export function ingredientIdToKey(id: string): string {
  return id
    .split('-')
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}

export function getIngredientMeta(id: string): IngredientMeta | undefined {
  return INGREDIENT_META.find((item) => item.id === id);
}

export const CONCERN_INGREDIENT_IDS: Record<SkinConcern, string[]> = {
  hydration: ['hyaluronic-acid', 'ceramides', 'glycerin'],
  acne: ['salicylic-acid', 'niacinamide', 'spf'],
  texture: ['vitamin-c', 'salicylic-acid', 'spf'],
  barrier: ['ceramides', 'niacinamide', 'squalane'],
};

export const STEP_INGREDIENT_IDS: Record<string, string[]> = {
  'am-1': ['ceramides', 'glycerin'],
  'am-2': ['hyaluronic-acid', 'glycerin'],
  'am-3': ['vitamin-c'],
  'am-3b': ['niacinamide'],
  'am-6': ['hyaluronic-acid'],
  'am-4': ['ceramides', 'squalane'],
  'am-5': ['spf'],
  'pm-1': ['squalane'],
  'pm-2': ['ceramides', 'glycerin'],
  'pm-3': ['niacinamide'],
  'pm-5': ['salicylic-acid'],
  'pm-4': ['ceramides', 'squalane'],
};
