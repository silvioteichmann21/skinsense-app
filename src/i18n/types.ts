import type { LanguageCode } from '@/screens/settings/languages';

import type { Messages } from '@/i18n/catalog/en';

export type { Messages };

export type LocaleMessages = Record<LanguageCode, Messages>;
