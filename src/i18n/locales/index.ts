import type { LanguageCode } from '@/screens/settings/languages';

import { en } from '@/i18n/catalog/en';
import { deepMerge, type DeepPartial } from '@/i18n/deepMerge';
import type { Messages } from '@/i18n/types';
import { ar } from '@/i18n/locales/ar';
import { de } from '@/i18n/locales/de';
import { es } from '@/i18n/locales/es';
import { fr } from '@/i18n/locales/fr';
import { hi } from '@/i18n/locales/hi';
import { it } from '@/i18n/locales/it';
import { ja } from '@/i18n/locales/ja';
import { ko } from '@/i18n/locales/ko';
import { zhHans } from '@/i18n/locales/zh-Hans';

type Override = DeepPartial<Messages>;

/** Locale files are authored as `as const` literals; bridge through `unknown`. */
const asOverride = (m: unknown): Override => m as Override;

const merged: Record<LanguageCode, Messages> = {
  en,
  es: deepMerge(en, asOverride(es)),
  ar: deepMerge(en, asOverride(ar)),
  'zh-Hans': deepMerge(en, asOverride(zhHans)),
  fr: deepMerge(en, asOverride(fr)),
  de: deepMerge(en, asOverride(de)),
  hi: deepMerge(en, asOverride(hi)),
  it: deepMerge(en, asOverride(it)),
  ja: deepMerge(en, asOverride(ja)),
  ko: deepMerge(en, asOverride(ko)),
};

export function messagesForLocale(code: LanguageCode): Messages {
  return merged[code] ?? en;
}
