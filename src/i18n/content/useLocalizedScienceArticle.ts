import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { IngredientIcon } from '@/types/activeIngredient';

export type LocalizedScienceArticle = {
  id: string;
  title: string;
  tag: string;
  tagBg: 'primaryPale' | 'accentLight';
  readTime: string;
  icon: IngredientIcon;
  sections: { heading: string; body: string }[];
  takeaway: string;
};

const ARTICLE_META: Record<
  string,
  { slug: string; icon: IngredientIcon; tagBg: 'primaryPale' | 'accentLight' }
> = {
  '1': { slug: 'hydration', icon: 'water-outline', tagBg: 'primaryPale' },
  '2': { slug: 'spf', icon: 'weather-sunny', tagBg: 'accentLight' },
  '3': { slug: 'consistency', icon: 'calendar-check', tagBg: 'primaryPale' },
};

function reportText(
  t: (key: TranslationKey) => string,
  key: TranslationKey,
  fallback = '',
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function useLocalizedScienceArticle(id: string): LocalizedScienceArticle | undefined {
  const { t } = useTranslation();

  return useMemo(() => {
    const meta = ARTICLE_META[id];
    if (!meta) return undefined;

    const { slug } = meta;
    const sections: { heading: string; body: string }[] = [];
    for (let i = 1; i <= 6; i++) {
      const headingKey = `science.articleBodies.${slug}.sec${i}heading` as TranslationKey;
      const bodyKey = `science.articleBodies.${slug}.sec${i}body` as TranslationKey;
      const heading = t(headingKey);
      if (heading === headingKey) break;
      sections.push({
        heading,
        body: reportText(t, bodyKey),
      });
    }

    return {
      id,
      icon: meta.icon,
      tagBg: meta.tagBg,
      title: reportText(t, `home.articles.${slug}.title` as TranslationKey),
      tag: reportText(t, `home.articles.${slug}.tag` as TranslationKey),
      readTime: reportText(t, `home.articles.${slug}.readTime` as TranslationKey),
      sections,
      takeaway: reportText(t, `science.articleBodies.${slug}.takeaway` as TranslationKey),
    };
  }, [id, t]);
}

export function useLocalizedScienceArticles(): LocalizedScienceArticle[] {
  const { t } = useTranslation();

  return useMemo(
    () =>
      Object.keys(ARTICLE_META)
        .map((id) => {
          const meta = ARTICLE_META[id];
          const { slug } = meta;
          const sections: { heading: string; body: string }[] = [];
          for (let i = 1; i <= 6; i++) {
            const headingKey = `science.articleBodies.${slug}.sec${i}heading` as TranslationKey;
            const bodyKey = `science.articleBodies.${slug}.sec${i}body` as TranslationKey;
            const heading = t(headingKey);
            if (heading === headingKey) break;
            sections.push({ heading, body: reportText(t, bodyKey) });
          }
          return {
            id,
            icon: meta.icon,
            tagBg: meta.tagBg,
            title: reportText(t, `home.articles.${slug}.title` as TranslationKey),
            tag: reportText(t, `home.articles.${slug}.tag` as TranslationKey),
            readTime: reportText(t, `home.articles.${slug}.readTime` as TranslationKey),
            sections,
            takeaway: reportText(t, `science.articleBodies.${slug}.takeaway` as TranslationKey),
          };
        })
        .filter((a) => a.sections.length > 0),
    [t],
  );
}
