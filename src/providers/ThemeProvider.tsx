import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import { useThemeStore } from '@/store/themeStore';

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const hydrate = useThemeStore((s) => s.hydrate);
  const setSystemScheme = useThemeStore((s) => s.setSystemScheme);
  const colorScheme = useColorScheme();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';
    setSystemScheme(scheme);

    const sub = Appearance.addChangeListener(({ colorScheme: next }) => {
      setSystemScheme(next === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, [colorScheme, setSystemScheme]);

  return children;
}
