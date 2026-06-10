import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { AppColors } from '@/theme/palettes';
import { spacing, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  count: number;
  activeIndex: number;
  variant?: 'light' | 'dark';
};

function createStyles(_colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      gap: spacing.sm,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
  });
}

function Dot({ active, variant }: { active: boolean; variant: 'light' | 'dark' }) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const progress = useSharedValue(active ? 1 : 0);
  const inactive = variant === 'dark' ? 'rgba(255,255,255,0.3)' : colors.border;
  const activeColor = variant === 'dark' ? colors.ctaGradientStart : colors.ctaGradientEnd;

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [8, 24]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [inactive, activeColor]),
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function PaginationDots({ count, activeIndex, variant = 'dark' }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} active={i === activeIndex} variant={variant} />
      ))}
    </View>
  );
}
