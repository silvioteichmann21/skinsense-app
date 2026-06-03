import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { I18nManager } from 'react-native';

import { getAppLanguage, setAppLanguage } from '@/core/storage/languagePreferences';
import { messagesForLocale } from '@/i18n/locales';
import type { Messages } from '@/i18n/types';
import {
  DEFAULT_LANGUAGE_CODE,
  type LanguageCode,
} from '@/screens/settings/languages';

type I18nContextValue = {
  locale: LanguageCode;
  messages: Messages;
  ready: boolean;
  setLocale: (code: LanguageCode) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function applyRtl(code: LanguageCode) {
  const rtl = code === 'ar';
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LanguageCode>(DEFAULT_LANGUAGE_CODE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const code = await getAppLanguage();
      if (!mounted) return;
      applyRtl(code);
      setLocaleState(code);
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setLocale = useCallback(async (code: LanguageCode) => {
    await setAppLanguage(code);
    applyRtl(code);
    setLocaleState(code);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: messagesForLocale(locale),
      ready,
      setLocale,
    }),
    [locale, ready, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
