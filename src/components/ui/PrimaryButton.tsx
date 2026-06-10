import { StyleSheet, Text, ViewStyle } from 'react-native';

import { GradientButton } from '@/components/ui/GradientButton';
import { PressableScale } from '@/components/ui/PressableScale';
import type { AppColors } from '@/theme/palettes';
import { radius, touchTarget, typography, useThemedStyles } from '@/theme';

type Variant = 'light' | 'green' | 'gradient' | 'ghost' | 'outline';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    base: {
      height: touchTarget,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexDirection: 'row',
    },
    gradientBtn: {
      width: '100%',
    },
    light: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    disabled: {
      opacity: 0.5,
    },
    label: {
      ...typography.h3,
    },
    labelDark: {
      color: colors.textPrimary,
    },
    labelLight: {
      color: colors.textInverse,
      fontFamily: typography.h3.fontFamily,
      letterSpacing: 0.2,
    },
    labelGhost: {
      color: colors.textPrimary,
      opacity: 0.9,
    },
    labelOutline: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      fontFamily: typography.h3.fontFamily,
    },
  });
}

export function PrimaryButton({ label, onPress, variant = 'light', style, disabled }: Props) {
  const styles = useThemedStyles(createStyles);
  const isGradient = variant === 'green' || variant === 'gradient';

  if (isGradient) {
    return (
      <GradientButton
        onPress={onPress}
        disabled={disabled}
        style={[styles.gradientBtn, style]}
        haptic="medium"
      >
        <Text style={[styles.label, styles.labelLight]}>{label}</Text>
      </GradientButton>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic={variant === 'ghost' || variant === 'outline' ? 'selection' : 'medium'}
      pressedScale={0.98}
      style={[
        styles.base,
        variant === 'light' && styles.light,
        variant === 'ghost' && styles.ghost,
        variant === 'outline' && styles.outline,
        disabled && styles.disabled,
        style,
      ].filter(Boolean) as ViewStyle[]}
    >
      <Text
        style={[
          styles.label,
          variant === 'light' && styles.labelDark,
          variant === 'ghost' && styles.labelGhost,
          variant === 'outline' && styles.labelOutline,
        ]}
      >
        {label}
      </Text>
    </PressableScale>
  );
}
