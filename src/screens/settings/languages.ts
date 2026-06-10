export type LanguageCode =
  | 'en'
  | 'es'
  | 'ar'
  | 'zh-Hans'
  | 'fr'
  | 'de'
  | 'hi'
  | 'it'
  | 'ja'
  | 'ko';

export type AppLanguage = {
  code: LanguageCode;
  /** English descriptor shown as subtitle in the picker */
  label: string;
  /** Native name shown as primary title */
  nativeLabel: string;
  suggested?: boolean;
};

export const DEFAULT_LANGUAGE_CODE: LanguageCode = 'en';

export const APP_LANGUAGES: AppLanguage[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', suggested: true },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', suggested: true },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'zh-Hans', label: 'Chinese (Simplified)', nativeLabel: '中文 (简体)' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
];

const LEGACY_CODE_MAP: Record<string, LanguageCode> = {
  'en-US': 'en',
  'en-GB': 'en',
  'pt-BR': 'es',
};

const LANGUAGE_CODES = new Set<string>(APP_LANGUAGES.map((l) => l.code));

export function normalizeLanguageCode(code: string): LanguageCode | undefined {
  if (LANGUAGE_CODES.has(code)) {
    return code as LanguageCode;
  }

  const legacy = LEGACY_CODE_MAP[code];
  if (legacy) return legacy;

  const lower = code.toLowerCase();
  if (LANGUAGE_CODES.has(lower)) {
    return lower as LanguageCode;
  }

  const base = lower.split(/[-_]/)[0];
  if (base === 'zh') return 'zh-Hans';
  if (base && LANGUAGE_CODES.has(base)) {
    return base as LanguageCode;
  }

  return undefined;
}

export function languageByCode(code: string): AppLanguage | undefined {
  const normalized = normalizeLanguageCode(code);
  if (!normalized) return undefined;
  return APP_LANGUAGES.find((l) => l.code === normalized);
}

export function languageSettingsLabel(code: string): string {
  const lang = languageByCode(code);
  if (!lang) return 'English';
  if (lang.code === 'en') return 'English (United States)';
  return lang.nativeLabel;
}

export const SUGGESTED_LANGUAGES = APP_LANGUAGES.filter((l) => l.suggested);
export const ALL_OTHER_LANGUAGES = APP_LANGUAGES.filter((l) => !l.suggested);

export function filterLanguages(query: string): AppLanguage[] {
  const q = query.trim().toLowerCase();
  if (!q) return APP_LANGUAGES;
  return APP_LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(q) ||
      l.nativeLabel.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q),
  );
}

export function filterLanguagesBySection(
  query: string,
): { suggested: AppLanguage[]; all: AppLanguage[] } {
  const filtered = filterLanguages(query);
  return {
    suggested: filtered.filter((l) => l.suggested),
    all: filtered.filter((l) => !l.suggested),
  };
}
