import { Appearance } from 'react-native';
import { create } from 'zustand';

import type { ThemeMode } from '@/components/settings/ThemeSelector';
import { getAppThemeMode, setAppThemeMode } from '@/core/storage/themePreferences';
import {
  type AppColors,
  type ColorScheme,
  paletteForScheme,
} from '@/theme/palettes';

type ThemeStore = {
  themeMode: ThemeMode;
  systemScheme: ColorScheme;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setSystemScheme: (scheme: ColorScheme) => void;
};

export function resolveColorScheme(
  themeMode: ThemeMode,
  systemScheme: ColorScheme,
): ColorScheme {
  if (themeMode === 'system') return systemScheme;
  return themeMode;
}

export function selectResolvedScheme(state: ThemeStore): ColorScheme {
  return resolveColorScheme(state.themeMode, state.systemScheme);
}

export function selectThemeColors(state: ThemeStore): AppColors {
  return paletteForScheme(selectResolvedScheme(state));
}

function readSystemScheme(): ColorScheme {
  const scheme = Appearance.getColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themeMode: 'dark',
  systemScheme: readSystemScheme(),
  hydrated: false,

  hydrate: async () => {
    const themeMode = await getAppThemeMode();
    const systemScheme = readSystemScheme();
    const state = get();
    if (
      state.hydrated &&
      state.themeMode === themeMode &&
      state.systemScheme === systemScheme
    ) {
      return;
    }
    set({ themeMode, systemScheme, hydrated: true });
  },

  setThemeMode: async (mode) => {
    await setAppThemeMode(mode);
    set({ themeMode: mode });
  },

  setSystemScheme: (scheme) => {
    if (get().systemScheme === scheme) return;
    set({ systemScheme: scheme });
  },
}));
