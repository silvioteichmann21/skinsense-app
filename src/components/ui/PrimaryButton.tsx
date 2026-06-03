import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius, touchTarget, typography } from '@/theme';

type Variant = 'light' | 'green' | 'ghost';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, variant = 'light', style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'light' && styles.light,
        variant === 'green' && styles.green,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'light' && styles.labelDark,
          variant === 'green' && styles.labelLight,
          variant === 'ghost' && styles.labelGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: touchTarget,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  light: {
    backgroundColor: '#F4FAF9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  green: {
    backgroundColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...typography.h3,
  },
  labelDark: {
    color: colors.primaryDark,
  },
  labelLight: {
    color: colors.textInverse,
  },
  labelGhost: {
    color: 'rgba(255,255,255,0.9)',
  },
});
