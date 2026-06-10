import type { StatusBarStyle } from 'expo-status-bar';

import type { ThemeMode } from '@/components/settings/ThemeSelector';
import { selectResolvedScheme, useThemeStore } from '@/store/themeStore';
import type { AppColors, ColorScheme } from '@/theme/palettes';
import { paletteForScheme } from '@/theme/palettes';

export function useAppTheme(): {
  themeMode: ThemeMode;
  colors: AppColors;
  resolvedScheme: ColorScheme;
  statusBarStyle: StatusBarStyle;
  blurTint: 'light' | 'dark';
  hydrated: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
} {
  const themeMode = useThemeStore((s) => s.themeMode);
  const resolvedScheme = useThemeStore(selectResolvedScheme);
  const colors = paletteForScheme(resolvedScheme);
  const hydrated = useThemeStore((s) => s.hydrated);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);

  return {
    themeMode,
    colors,
    resolvedScheme,
    statusBarStyle: resolvedScheme === 'dark' ? 'light' : 'dark',
    blurTint: resolvedScheme === 'dark' ? 'dark' : 'light',
    hydrated,
    setThemeMode,
  };
}
