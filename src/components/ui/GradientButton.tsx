import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import type { AppColors } from '@/theme/palettes';
import { ctaGlow, radius, touchTarget, useAppTheme, useThemedStyles } from '@/theme';

type Shape = 'pill' | 'circle';
type Size = 'default' | 'compact';

type Props = {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  haptic?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  borderRadius?: number;
  shape?: Shape;
  size?: Size;
  glow?: boolean;
};

function createStyles(colors: AppColors, borderRadius: number, shape: Shape, size: Size, withGlow: boolean) {
  const compact = size === 'compact';
  const circle = shape === 'circle';
  const dim = circle ? 40 : compact ? 44 : touchTarget;

  return StyleSheet.create({
    shell: {
      borderRadius: circle ? radius.full : borderRadius,
      overflow: 'hidden',
      minHeight: circle ? dim : compact ? dim : touchTarget,
      width: circle ? dim : undefined,
      alignSelf: circle ? undefined : 'stretch',
      ...(withGlow ? ctaGlow(colors.ctaGlow, circle ? 'lg' : 'md') : null),
    },
    gradient: {
      minHeight: circle ? dim : compact ? dim : touchTarget,
      width: circle ? dim : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      paddingHorizontal: circle ? 0 : compact ? 18 : 22,
      paddingVertical: circle ? 0 : compact ? 10 : 12,
    },
    disabled: {
      opacity: 0.45,
    },
  });
}

/** Pill or circle CTA with horizontal magenta → violet → indigo gradient */
export function GradientButton({
  onPress,
  children,
  style,
  contentStyle,
  disabled,
  haptic = 'medium',
  borderRadius = radius.full,
  shape = 'pill',
  size = 'default',
  glow = true,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles((c) => createStyles(c, borderRadius, shape, size, glow));

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic={haptic}
      pressedScale={0.98}
      style={[styles.shell, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradient, contentStyle]}
      >
        {children}
      </LinearGradient>
    </PressableScale>
  );
}

type SurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

/** Gradient fill for cards and inline surfaces */
export function GradientSurface({
  children,
  style,
  borderRadius = radius.lg,
}: SurfaceProps) {
  const { colors } = useAppTheme();

  return (
    <LinearGradient
      colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
      locations={[0, 0.48, 1]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[{ borderRadius, overflow: 'hidden' }, style]}
    >
      {children}
    </LinearGradient>
  );
}
