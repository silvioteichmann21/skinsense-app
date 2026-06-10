import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemeMode } from '@/components/settings/ThemeSelector';

const THEME_KEY = '@skinsense/app_theme';

const VALID: ThemeMode[] = ['light', 'dark', 'system'];

const DEFAULT_THEME_MODE: ThemeMode = 'dark';

export async function getAppThemeMode(): Promise<ThemeMode> {
  const raw = await AsyncStorage.getItem(THEME_KEY);
  if (raw && VALID.includes(raw as ThemeMode)) {
    return raw as ThemeMode;
  }
  return DEFAULT_THEME_MODE;
}

export async function setAppThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, mode);
}
