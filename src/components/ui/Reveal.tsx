import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { motion } from '@/theme';

type Props = {
  children: ReactNode;
  /** Explicit entrance delay (ms). Overrides `index`-based stagger. */
  delay?: number;
  /** Position in a sequence; delay becomes `index * motion.stagger`. */
  index?: number;
  /** Vertical travel distance for the slide-in. Default 14. */
  offsetY?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Wraps content in a subtle fade + slide-up entrance. Compose several with
 * incrementing `index` to get a premium staggered reveal as a screen mounts.
 */
export function Reveal({ children, delay, index = 0, offsetY = 6, style }: Props) {
  const computedDelay = delay ?? index * motion.stagger;

  return (
    <Animated.View
      style={style}
      entering={FadeInDown.delay(computedDelay)
        .withInitialValues({ transform: [{ translateY: offsetY }] })
        .springify()
        .damping(motion.spring.soft.damping)
        .stiffness(motion.spring.soft.stiffness)
        .mass(motion.spring.soft.mass)}
    >
      {children}
    </Animated.View>
  );
}
