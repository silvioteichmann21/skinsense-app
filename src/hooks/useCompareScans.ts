import { useMemo } from 'react';

import { useI18n } from '@/i18n/I18nProvider';
import { formatAppDate } from '@/i18n/useFormattedDate';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type {
  CompareDeltaRow,
  CompareScanOption,
} from '@/screens/progress/compareMockData';
import { useSkinStore } from '@/store/skinStore';
import type { StoredScanRecord } from '@/types/scanPipeline';

function concernName(t: (key: TranslationKey) => string, id: string): string {
  const key = `reportData.concerns.${id}.name` as TranslationKey;
  const value = t(key);
  return value === key ? id : value;
}

function buildCompareOptions(
  scans: StoredScanRecord[],
  locale: import('@/screens/settings/languages').LanguageCode,
  t: (key: TranslationKey) => string,
): CompareScanOption[] {
  const chronological = [...scans].reverse();
  return chronological.map((scan, index) => ({
    id: scan.id,
    dateLabel: formatAppDate(new Date(scan.scannedAt), locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    score: scan.skinScore,
    imageUri: scan.imageUri,
    badge:
      index === 0
        ? t('compare.initial')
        : index === chronological.length - 1
          ? t('compare.current')
          : '',
  }));
}

function buildDeltas(
  before: StoredScanRecord,
  after: StoredScanRecord,
  t: (key: TranslationKey) => string,
): CompareDeltaRow[] {
  const ids = [...new Set([...before.concerns, ...after.concerns].map((c) => c.id))];

  return ids.slice(0, 6).map((id) => {
    const b = before.concerns.find((c) => c.id === id);
    const a = after.concerns.find((c) => c.id === id);
    const beforeVal = b?.barPercent ?? 0;
    const afterVal = a?.barPercent ?? 0;
    const delta = afterVal - beforeVal;
    return {
      id,
      concern: concernName(t, id),
      before: `${beforeVal}%`,
      after: `${afterVal}%`,
      change: `${delta >= 0 ? '+' : ''}${delta}%`,
      changePositive: delta <= 0,
    };
  });
}

export function useCompareScans(beforeId: string, afterId: string) {
  const history = useSkinStore((s) => s.analysisHistory);
  const { locale } = useI18n();
  const { t } = useTranslation();

  return useMemo(() => {
    const options = buildCompareOptions([...history].reverse(), locale, t);
    const beforeScan = history.find((s) => s.id === beforeId) ?? history[history.length - 1];
    const afterScan = history.find((s) => s.id === afterId) ?? history[0];

    const before = beforeScan
      ? {
          id: beforeScan.id,
          dateLabel: formatAppDate(new Date(beforeScan.scannedAt), locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          score: beforeScan.skinScore,
          imageUri: beforeScan.imageUri,
          badge: t('compare.initial'),
        }
      : null;

    const after = afterScan
      ? {
          id: afterScan.id,
          dateLabel: formatAppDate(new Date(afterScan.scannedAt), locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          score: afterScan.skinScore,
          imageUri: afterScan.imageUri,
          badge: t('compare.current'),
        }
      : null;

    const deltas =
      beforeScan && afterScan ? buildDeltas(beforeScan, afterScan, t) : [];

    const defaultBeforeId = history.length > 1 ? history[history.length - 1].id : history[0]?.id ?? '';
    const defaultAfterId = history[0]?.id ?? '';

    return {
      hasEnoughScans: history.length >= 2,
      options,
      before,
      after,
      deltas,
      defaultBeforeId,
      defaultAfterId,
    };
  }, [history, beforeId, afterId, locale, t]);
}
