import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { ConcernDetailContent } from '@/screens/report/concernDetailData';
import { CONCERN_DETAIL_SOURCE } from '@/screens/report/concernDetailSource';

function detailKey(concernId: string, suffix: string): TranslationKey {
  return `report.detail.${concernId}.${suffix}` as TranslationKey;
}

function reportText(
  t: (key: TranslationKey) => string,
  key: TranslationKey,
  fallback: string,
): string {
  const value = t(key);
  return value === key ? fallback : value;
}

export function useLocalizedConcernDetail(concernId: string): ConcernDetailContent {
  const { t } = useTranslation();

  return useMemo(() => {
    const source = CONCERN_DETAIL_SOURCE[concernId] ?? CONCERN_DETAIL_SOURCE.hydration;

    const whatIs = reportText(t, detailKey(concernId, 'whatIs'), '');
    const yourResult = reportText(t, detailKey(concernId, 'yourResult'), '');
    const highlightPhrase = reportText(t, detailKey(concernId, 'highlightPhrase'), '');
    const libraryTopic = reportText(
      t,
      detailKey(concernId, 'libraryTopic'),
      concernId,
    );

    return {
      displayTitle: concernId,
      whatIs,
      causes: source.causeKeys.map((c) => ({
        icon: c.icon,
        label: reportText(t, detailKey(concernId, `causes.${c.key}`), c.key),
      })),
      yourResult,
      highlightPhrase: highlightPhrase || undefined,
      improvements: source.improvementKeys.map((stepKey) => ({
        title: reportText(t, detailKey(concernId, `improvements.${stepKey}.title`), ''),
        body: reportText(t, detailKey(concernId, `improvements.${stepKey}.body`), ''),
      })),
      ingredientIds: source.ingredientIds,
      libraryTopic,
    };
  }, [concernId, t]);
}
