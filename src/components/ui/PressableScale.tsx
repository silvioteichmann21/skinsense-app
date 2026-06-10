import * as Haptics from 'expo-haptics';
import { forwardRef, useCallback } from 'react';
import { Pressable } from 'react-native';
import type { PressableProps, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { damping: 16, stiffness: 320, mass: 0.5 };

type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'none';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Scale applied while pressed. Default 0.97. */
  pressedScale?: number;
  /** Dim opacity while pressed. Default 1 (no dim). */
  pressedOpacity?: number;
  /** Haptic fired on press-in. Default 'light'. */
  haptic?: HapticStyle;
};

/**
 * A drop-in `Pressable` with a smooth spring scale + optional haptic.
 * Use for cards, buttons, and any tappable surface that should feel tactile.
 */
export const PressableScale = forwardRef<View, Props>(function PressableScale(
  {
    style,
    pressedScale = 0.97,
    pressedOpacity = 1,
    haptic = 'light',
    onPressIn,
    onPress,
    disabled,
    ...rest
  },
  ref,
) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    (e) => {
      scale.value = withSpring(pressedScale, SPRING);
      if (pressedOpacity !== 1) opacity.value = withSpring(pressedOpacity, SPRING);
      if (!disabled && haptic !== 'none') {
        if (haptic === 'selection') {
          void Haptics.selectionAsync();
        } else {
          const map = {
            light: Haptics.ImpactFeedbackStyle.Light,
            medium: Haptics.ImpactFeedbackStyle.Medium,
            heavy: Haptics.ImpactFeedbackStyle.Heavy,
          } as const;
          void Haptics.impactAsync(map[haptic]);
        }
      }
      onPressIn?.(e);
    },
    [disabled, haptic, onPressIn, opacity, pressedOpacity, pressedScale, scale],
  );

  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    (e) => {
      scale.value = withSpring(1, SPRING);
      opacity.value = withSpring(1, SPRING);
      rest.onPressOut?.(e);
    },
    [opacity, rest, scale],
  );

  return (
    <AnimatedPressable
      ref={ref}
      {...rest}
      disabled={disabled}
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    />
  );
});
