import { useMemo } from 'react';

import { useI18n } from '@/i18n/I18nProvider';
import { localeToBcp47 } from '@/i18n/localeTags';

export function formatAppDate(
  date: Date,
  locale: Parameters<typeof localeToBcp47>[0],
  options: Intl.DateTimeFormatOptions,
): string {
  return date.toLocaleDateString(localeToBcp47(locale), options);
}

/** Long weekday + short month + day (home header). */
export function useHomeHeaderDate(): string {
  const { locale } = useI18n();
  return useMemo(
    () =>
      formatAppDate(new Date(), locale, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
    [locale],
  );
}

export function useScanDateLabel(iso: string): string {
  const { locale } = useI18n();
  return useMemo(
    () =>
      formatAppDate(new Date(iso), locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [iso, locale],
  );
}
