import { useMemo } from 'react';

import { useI18n } from '@/i18n/I18nProvider';
import { formatAppDate } from '@/i18n/useFormattedDate';
import { useSkinStore } from '@/store/skinStore';
import type { TimelinePhoto } from '@/screens/progress/progressMockData';

export function useScanPhotoTimeline(): TimelinePhoto[] {
  const history = useSkinStore((s) => s.analysisHistory);
  const { locale } = useI18n();

  return useMemo(() => {
    return history.map((scan, index) => ({
      id: scan.id,
      dateLabel: formatAppDate(new Date(scan.scannedAt), locale, {
        month: 'short',
        day: 'numeric',
      }),
      score: scan.skinScore,
      imageUri: scan.imageUri,
      dimmed: index > 0 && index === history.length - 1,
    }));
  }, [history, locale]);
}
