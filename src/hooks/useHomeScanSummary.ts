import { useMemo } from 'react';

import { useSkinStore } from '@/store/skinStore';
import { useTranslation } from '@/i18n/useTranslation';

function daysBetween(iso: string): number {
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export function useHomeScanSummary() {
  const { t } = useTranslation();
  const latest = useSkinStore((s) => s.latestAnalysis);
  const history = useSkinStore((s) => s.analysisHistory);
  const hydrated = useSkinStore((s) => s.hydrated);

  return useMemo(() => {
    if (!latest) {
      return {
        hasScan: false,
        score: null as number | null,
        deltaLabel: null as string | null,
        lastScanLabel: t('home.noScanYet'),
      };
    }

    const prev = history[1];
    let deltaLabel: string | null = null;
    if (prev) {
      const delta = latest.skinScore - prev.skinScore;
      if (delta > 0) {
        deltaLabel = t('home.scoreDeltaUp', { delta: `+${delta}` });
      } else if (delta < 0) {
        deltaLabel = t('home.scoreDeltaDown', { delta: String(delta) });
      } else {
        deltaLabel = t('home.scoreDeltaSame');
      }
    }

    const days = daysBetween(latest.scannedAt);
    const lastScanLabel =
      days <= 0
        ? t('home.lastScanToday')
        : t('home.lastScanDays', { days: String(days) });

    return {
      hasScan: true,
      score: latest.skinScore,
      deltaLabel,
      lastScanLabel,
    };
  }, [latest, history, t, hydrated]);
}
