import {
  DEFAULT_LANGUAGE_CODE,
  normalizeLanguageCode,
  type LanguageCode,
} from '@/screens/settings/languages';

/** Primary device locale tag, e.g. `ko-KR`, `en-US`. */
export function getDeviceLocaleTags(): string[] {
  const tags: string[] = [];

  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    if (resolved) tags.push(resolved);
  } catch {
    /* ignore */
  }

  try {
    const numberLocale = Intl.NumberFormat().resolvedOptions().locale;
    if (numberLocale && !tags.includes(numberLocale)) {
      tags.push(numberLocale);
    }
  } catch {
    /* ignore */
  }

  return tags;
}

/** Pick the best supported app language from the device locale on first launch. */
export function detectDeviceLanguageCode(): LanguageCode {
  const tags = getDeviceLocaleTags();

  for (const tag of tags) {
    const exact = normalizeLanguageCode(tag);
    if (exact) return exact;

    const base = tag.split(/[-_]/)[0]?.toLowerCase();
    if (base) {
      const fromBase = normalizeLanguageCode(base);
      if (fromBase) return fromBase;
    }
  }

  return DEFAULT_LANGUAGE_CODE;
}
