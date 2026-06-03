import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, radius } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  iconColor?: string;
};

export function CameraGlassButton({
  icon,
  accessibilityLabel,
  onPress,
  iconColor = colors.textInverse,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <BlurView intensity={50} tint="dark" style={styles.blur}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </BlurView>
    </Pressable>
  );
}

const BTN = 40;

const styles = StyleSheet.create({
  wrap: {
    width: BTN,
    height: BTN,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  blur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
