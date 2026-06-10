import { useMemo } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { useSkinStore } from '@/store/skinStore';

const INSIGHT_BY_CONCERN: Record<string, TranslationKey> = {
  hydration: 'home.insightHydration',
  acne: 'home.insightAcne',
  texture: 'home.insightTexture',
  barrier: 'home.insightBarrier',
};

export function useHomeWeeklyInsight(): string {
  const { t } = useTranslation();
  const latest = useSkinStore((s) => s.latestAnalysis);

  return useMemo(() => {
    if (!latest) return t('home.insightNoScan');

    const top = [...latest.concerns]
      .filter((c) => c.severity !== 'healthy')
      .sort((a, b) => b.barPercent - a.barPercent)[0];

    if (!top) return t('home.insightEncourage');

    const key = INSIGHT_BY_CONCERN[top.id];
    if (key) return t(key);

    return t('home.insightPersonalized', {
      concern: t(`reportData.concerns.${top.id}.name` as TranslationKey),
    });
  }, [latest, t]);
}
