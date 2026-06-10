import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import type { AppColors } from '@/theme/palettes';
import { typography, useThemedStyles, useAppTheme } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DEFAULT_SIZE = 100;
const STROKE = 8;

type Props = {
  score: number;
  max?: number;
  size?: number;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
  },
  score: {
    ...typography.score,
    color: colors.primary,
  },
  max: {
    fontFamily: typography.label.fontFamily,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textTertiary,
    letterSpacing: 0.5,
  },
});
}

export function SkinScoreRing({
 score, max = 100, size = DEFAULT_SIZE }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const radius = (size - STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(score / max, 1), { duration: 2000 });
  }, [max, progress, score]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const scoreFontSize = size <= 96 ? 22 : 28;
  const scoreLineHeight = size <= 96 ? 26 : 32;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primaryPale}
          strokeWidth={STROKE}
          fill={colors.surface}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={STROKE}
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.score, { fontSize: scoreFontSize, lineHeight: scoreLineHeight }]}>
          {Math.round(score)}
        </Text>
        <Text style={styles.max}>/100</Text>
      </View>
    </View>
  );
}
