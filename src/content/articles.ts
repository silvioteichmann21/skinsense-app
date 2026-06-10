import type { IngredientIcon } from '@/types/activeIngredient';

/** Structural article metadata — all text is localized via i18n. */
export const ARTICLE_IDS = ['1', '2', '3'] as const;

export const ARTICLE_ICONS: Record<string, IngredientIcon> = {
  '1': 'water-outline',
  '2': 'weather-sunny',
  '3': 'calendar-check',
};

export const ARTICLE_TAG_BG: Record<string, 'primaryPale' | 'accentLight'> = {
  '1': 'primaryPale',
  '2': 'accentLight',
  '3': 'primaryPale',
};
