import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  getIngredientMeta,
  ingredientIdToKey,
  INGREDIENT_META,
  type LocalizedActiveIngredient,
  type SkinConcern,
} from '@/types/activeIngredient';

function ingredientPath(key: string, field: string): TranslationKey {
  return `science.ingredients.${key}.${field}` as TranslationKey;
}

function concernSummaryKey(concern: SkinConcern): string {
  const map: Record<SkinConcern, string> = {
    hydration: 'summaryHydration',
    acne: 'summaryAcne',
    texture: 'summaryTexture',
    barrier: 'summaryBarrier',
  };
  return map[concern];
}

function reportText(
  t: (key: TranslationKey) => string,
  key: TranslationKey,
  fallback: string,
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

function collectHelps(
  t: (key: TranslationKey) => string,
  key: string,
): string[] {
  const helps: string[] = [];
  for (let i = 1; i <= 4; i++) {
    const path = ingredientPath(key, `help${i}`);
    const value = t(path);
    if (value === path) break;
    helps.push(value);
  }
  return helps;
}

export function useLocalizedIngredient(
  id: string,
  concern?: SkinConcern,
): LocalizedActiveIngredient | undefined {
  const { t } = useTranslation();

  return useMemo(() => {
    const meta = getIngredientMeta(id);
    if (!meta) return undefined;

    const key = ingredientIdToKey(id);

    let summary = reportText(t, ingredientPath(key, 'summary'), '');
    if (concern) {
      const concernKey = concernSummaryKey(concern);
      const concernSummary = reportText(
        t,
        ingredientPath(key, concernKey),
        '',
      );
      if (concernSummary) summary = concernSummary;
    }

    return {
      id: meta.id,
      icon: meta.icon,
      concerns: meta.concerns,
      name: reportText(t, ingredientPath(key, 'name'), id),
      category: reportText(t, ingredientPath(key, 'category'), ''),
      summary,
      whyItWorks: reportText(t, ingredientPath(key, 'whyItWorks'), ''),
      howItHelps: collectHelps(t, key),
      routineRole: reportText(t, ingredientPath(key, 'routineRole'), ''),
      consistencyNote: reportText(t, ingredientPath(key, 'consistencyNote'), ''),
      scienceNote: reportText(t, ingredientPath(key, 'scienceNote'), ''),
      evidenceNote: reportText(t, ingredientPath(key, 'evidenceNote'), ''),
    };
  }, [id, concern, t]);
}

export function useLocalizedIngredients(
  ids: string[],
  concern?: SkinConcern,
): LocalizedActiveIngredient[] {
  const { t } = useTranslation();

  return useMemo(
    () =>
      ids
        .map((id) => {
          const meta = getIngredientMeta(id);
          if (!meta) return null;
          const key = ingredientIdToKey(id);

          let summary = reportText(t, ingredientPath(key, 'summary'), '');
          if (concern) {
            const concernKey = concernSummaryKey(concern);
            const concernSummary = reportText(
              t,
              ingredientPath(key, concernKey),
              '',
            );
            if (concernSummary) summary = concernSummary;
          }

          return {
            id: meta.id,
            icon: meta.icon,
            concerns: meta.concerns,
            name: reportText(t, ingredientPath(key, 'name'), id),
            category: reportText(t, ingredientPath(key, 'category'), ''),
            summary,
            whyItWorks: reportText(t, ingredientPath(key, 'whyItWorks'), ''),
            howItHelps: collectHelps(t, key),
            routineRole: reportText(t, ingredientPath(key, 'routineRole'), ''),
            consistencyNote: reportText(t, ingredientPath(key, 'consistencyNote'), ''),
            scienceNote: reportText(t, ingredientPath(key, 'scienceNote'), ''),
            evidenceNote: reportText(t, ingredientPath(key, 'evidenceNote'), ''),
          } satisfies LocalizedActiveIngredient;
        })
        .filter((item): item is LocalizedActiveIngredient => item != null),
    [ids, concern, t],
  );
}

export function useAllIngredientMeta() {
  return INGREDIENT_META;
}
