import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { useAppBack } from '@/core/navigation/useAppBack';
import { colors, touchTarget } from '@/theme';

type Variant = 'default' | 'muted' | 'inverse';

type Props = {
  variant?: Variant;
  onPress?: () => void;
  style?: ViewStyle;
  /** When true, reserves layout space even on Splash (unused). */
  preserveLayout?: boolean;
};

const ICON_COLORS: Record<Variant, string> = {
  default: colors.primary,
  muted: colors.textSecondary,
  inverse: colors.textInverse,
};

export function ScreenBackButton({ variant = 'default', onPress, style, preserveLayout }: Props) {
  const { goBack, showBack } = useAppBack();

  if (!showBack && !preserveLayout) {
    return null;
  }

  if (!showBack && preserveLayout) {
    return <View style={[styles.btn, style]} />;
  }

  return (
    <Pressable
      onPress={onPress ?? goBack}
      style={[styles.btn, style]}
      accessibilityLabel="Go back"
      hitSlop={8}
    >
      <MaterialCommunityIcons name="arrow-left" size={24} color={ICON_COLORS[variant]} />
    </Pressable>
  );
}

/** Keeps header layouts aligned when a custom right slot is wider than the back button. */
export function ScreenHeaderSpacer() {
  return <View style={styles.btn} />;
}

const styles = StyleSheet.create({
  btn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
