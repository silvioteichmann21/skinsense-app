import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_LANGUAGE_CODE,
  normalizeLanguageCode,
  type LanguageCode,
} from '@/screens/settings/languages';

const LANGUAGE_KEY = '@skinsense/app_language';

export async function getAppLanguage(): Promise<LanguageCode> {
  const raw = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (raw) {
    const normalized = normalizeLanguageCode(raw);
    if (normalized) {
      if (normalized !== raw) {
        await AsyncStorage.setItem(LANGUAGE_KEY, normalized);
      }
      return normalized;
    }
  }
  return DEFAULT_LANGUAGE_CODE;
}

export async function setAppLanguage(code: LanguageCode): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_KEY, code);
}
