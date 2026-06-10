import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { layout } from '@/theme/layout';
import { radius, shadows, useThemedStyles } from '@/theme';

type Variant = 'elevated' | 'outlined' | 'sunken';

type Props = {
  children: ReactNode;
  variant?: Variant;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    base: {
      borderRadius: layout.listCardRadius,
      overflow: 'hidden',
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      ...shadows.md,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sunken: {
      backgroundColor: colors.surfaceSunken,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    inner: {
      padding: layout.cardPadding,
      width: '100%',
    },
  });
}

export function SurfaceCard({
  children,
  variant = 'elevated',
  style,
  padding = layout.cardPadding,
  radius: cardRadius = layout.listCardRadius,
}: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        variant === 'sunken' && styles.sunken,
        { borderRadius: cardRadius },
        style,
      ]}
    >
      <View style={[styles.inner, { padding }]}>{children}</View>
    </View>
  );
}
