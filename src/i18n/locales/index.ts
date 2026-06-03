import type { LanguageCode } from '@/screens/settings/languages';

import { en } from '@/i18n/catalog/en';
import { deepMerge } from '@/i18n/deepMerge';
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

const merged: Record<LanguageCode, Messages> = {
  en,
  es: deepMerge(en, es as Partial<Messages>) as Messages,
  ar: deepMerge(en, ar as Partial<Messages>) as Messages,
  'zh-Hans': deepMerge(en, zhHans as Partial<Messages>) as Messages,
  fr: deepMerge(en, fr as Partial<Messages>) as Messages,
  de: deepMerge(en, de as Partial<Messages>) as Messages,
  hi: deepMerge(en, hi as Partial<Messages>) as Messages,
  it: deepMerge(en, it as Partial<Messages>) as Messages,
  ja: deepMerge(en, ja as Partial<Messages>) as Messages,
  ko: deepMerge(en, ko as Partial<Messages>) as Messages,
};

export function messagesForLocale(code: LanguageCode): Messages {
  return merged[code] ?? en;
}
