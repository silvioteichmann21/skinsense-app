import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, useThemedStyles, useAppTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  iconColor?: string;
  disabled?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    width: BTN,
    height: BTN,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.45,
  },
  blur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
}

export function CameraGlassButton({
  icon,
  accessibilityLabel,
  onPress,
  iconColor,
  disabled,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const iconColorResolved = iconColor ?? colors.textInverse;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <BlurView intensity={50} tint="dark" style={styles.blur}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColorResolved} />
      </BlurView>
    </Pressable>
  );
}

const BTN = 40;
