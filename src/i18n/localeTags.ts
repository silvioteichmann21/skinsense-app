import type { LanguageCode } from '@/screens/settings/languages';

/** BCP 47 tags for `Intl` / `toLocaleDateString`. */
export const LOCALE_BCP47: Record<LanguageCode, string> = {
  en: 'en-US',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ja: 'ja',
  ko: 'ko',
  'zh-Hans': 'zh-CN',
  ar: 'ar',
  hi: 'hi',
  it: 'it',
};

export function localeToBcp47(code: LanguageCode): string {
  return LOCALE_BCP47[code] ?? 'en-US';
}
