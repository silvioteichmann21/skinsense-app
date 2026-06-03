import { useCallback } from 'react';

import { useI18n } from '@/i18n/I18nProvider';
import { interpolate } from '@/i18n/interpolate';
import { messagesForLocale } from '@/i18n/locales';
import type { Messages } from '@/i18n/types';

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends string
        ? Prefix extends ''
          ? K
          : `${Prefix}.${K}`
        : NestedKeyOf<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<Messages>;

function resolvePath(obj: Messages, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function useTranslation() {
  const { messages, locale, setLocale, ready } = useI18n();

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number | undefined>): string => {
      const value = resolvePath(messages, key) ?? resolvePath(messagesForLocale('en'), key);
      if (value == null) return key;
      return interpolate(value, params);
    },
    [messages],
  );

  return { t, locale, setLocale, ready, messages };
}
