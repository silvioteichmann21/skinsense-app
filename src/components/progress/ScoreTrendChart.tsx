import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useTranslation } from '@/i18n/useTranslation';
import type { ScoreTrendPoint } from '@/screens/progress/progressMockData';
import type { AppColors } from '@/theme/palettes';
import {
  glow,
  motion,
  radius,
  shadows,
  spacing,
  typography,
  useThemedStyles,
  useAppTheme,
} from '@/theme';

type Props = {
  current: number;
  points: ScoreTrendPoint[];
};

const CHART_HEIGHT = 132;

function GrowBar({
  height,
  color,
  opacity,
  delay,
  style,
  gradient,
}: {
  height: number;
  color: string;
  opacity: number;
  delay: number;
  style: object;
  gradient?: readonly [string, string, ...string[]];
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: motion.duration.slow }));
  }, [delay, height, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: Math.max(10, height * progress.value),
  }));

  if (gradient) {
    return (
      <Animated.View style={[style, animatedStyle, glow(color, 'md')]}>
        <LinearGradient
          colors={gradient as [string, string, ...string[]]}
          locations={gradient.length === 3 ? [0, 0.48, 1] : undefined}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[style, { backgroundColor: color, opacity }, animatedStyle]}
    />
  );
}

function createStyles(colors: AppColors, barWidth: number, compact: boolean) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.xl,
      padding: compact ? spacing.lg : spacing.xl,
      borderWidth: 1,
      borderColor: colors.hairline,
      overflow: 'hidden',
      ...shadows.md,
    },
    accentLine: {
      position: 'absolute',
      top: 0,
      left: spacing.xl,
      right: spacing.xl,
      height: 3,
      borderRadius: radius.full,
      opacity: 0.85,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    scoreBlock: {
      flex: 1,
      minWidth: 0,
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    scoreBig: {
      ...typography.score,
      fontSize: compact ? 40 : 46,
      lineHeight: compact ? 44 : 50,
      color: colors.ctaGradientStart,
    },
    scoreSub: {
      ...typography.body,
      color: colors.textSecondary,
      fontSize: compact ? 13 : 14,
    },
    trendPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.ctaTint,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    trendPillUp: {
      backgroundColor: colors.ctaTint,
    },
    trendPillDown: {
      backgroundColor: 'rgba(255, 107, 107, 0.12)',
    },
    trendText: {
      ...typography.label,
      color: colors.ctaGradientStart,
      fontSize: 12,
      letterSpacing: 0.4,
      textTransform: 'none',
    },
    trendTextDown: {
      color: colors.error,
    },
    chartWrap: {
      position: 'relative',
    },
    gridLine: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: colors.hairline,
    },
    baseline: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 2,
      backgroundColor: colors.border,
      borderRadius: 1,
    },
    chart: {
      height: CHART_HEIGHT,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.xs,
      paddingTop: spacing.sm,
    },
    barCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: 0,
      height: CHART_HEIGHT,
    },
    barSlot: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    bar: {
      width: barWidth,
      borderTopLeftRadius: radius.sm,
      borderTopRightRadius: radius.sm,
      minHeight: 10,
      overflow: 'hidden',
    },
    barMuted: {
      borderWidth: 1,
      borderColor: 'rgba(232, 121, 249, 0.22)',
    },
    barScore: {
      ...typography.label,
      fontSize: 10,
      color: colors.ctaGradientStart,
      marginBottom: spacing.xs,
      letterSpacing: 0.2,
      textTransform: 'none',
    },
    barLabel: {
      ...typography.caption,
      color: colors.textTertiary,
      fontSize: 10,
      marginTop: spacing.sm,
      textAlign: 'center',
      minHeight: 14,
    },
    barLabelActive: {
      color: colors.textSecondary,
      fontFamily: typography.h3.fontFamily,
    },
  });
}

export function ScoreTrendChart({ current, points }: Props) {
  const { width: screenW } = useWindowDimensions();
  const compact = screenW < 360;
  const barWidth = Math.min(28, Math.max(14, Math.round((screenW - 80) / Math.max(points.length, 5) - 6)));
  const styles = useThemedStyles((colors) => createStyles(colors, barWidth, compact));
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const maxScore = 100;
  const peak = Math.max(...points.map((p) => p.score), current);

  const delta = useMemo(() => {
    if (points.length < 2) return null;
    return current - points[0].score;
  }, [current, points]);

  const gridPositions = [0.25, 0.5, 0.75];

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.accentLine}
      />

      <View style={styles.header}>
        <View style={styles.scoreBlock}>
          <View style={styles.scoreRow}>
            <AnimatedCounter value={current} style={styles.scoreBig} />
            <Text style={styles.scoreSub}>{t('progress.scoreOutOf')}</Text>
          </View>
        </View>
        {delta !== null && delta !== 0 ? (
          <View
            style={[
              styles.trendPill,
              delta > 0 ? styles.trendPillUp : styles.trendPillDown,
            ]}
          >
            <MaterialCommunityIcons
              name={delta > 0 ? 'trending-up' : 'trending-down'}
              size={14}
              color={delta > 0 ? colors.ctaGradientStart : colors.error}
            />
            <Text style={[styles.trendText, delta < 0 && styles.trendTextDown]}>
              {delta > 0 ? `+${delta}` : String(delta)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.chartWrap}>
        {gridPositions.map((ratio) => (
          <View
            key={ratio}
            style={[styles.gridLine, { bottom: CHART_HEIGHT * ratio }]}
          />
        ))}
        <View style={styles.baseline} />

        <View style={styles.chart}>
          {points.map((point, index) => {
            const barHeight = Math.max(12, (point.score / maxScore) * CHART_HEIGHT);
            const isLatest = index === points.length - 1;
            const isPeak = point.score === peak && !isLatest;
            const isRecent = index === points.length - 2;

            return (
              <View key={`${point.score}-${index}`} style={styles.barCol}>
                <View style={styles.barSlot}>
                  {isLatest ? (
                    <Text style={styles.barScore}>{point.score}</Text>
                  ) : null}
                  <GrowBar
                    style={[styles.bar, !isLatest && styles.barMuted]}
                    height={barHeight}
                    delay={index * 50}
                    color={
                      isLatest
                        ? colors.ctaGradientEnd
                        : isPeak || isRecent
                          ? colors.ctaGradientMid
                          : 'rgba(192, 132, 252, 0.42)'
                    }
                    opacity={isLatest ? 1 : isRecent ? 0.85 : isPeak ? 0.72 : 1}
                    gradient={
                      isLatest
                        ? [colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]
                        : undefined
                    }
                  />
                </View>
                <Text
                  style={[styles.barLabel, (point.label || isLatest) && styles.barLabelActive]}
                  numberOfLines={1}
                >
                  {point.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
