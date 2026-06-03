import { StyleSheet, Text, View } from 'react-native';

import type { ScoreTrendPoint } from '@/screens/progress/progressMockData';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  current: number;
  points: ScoreTrendPoint[];
};

const CHART_HEIGHT = 180;

export function ScoreTrendChart({ current, points }: Props) {
  const maxScore = 100;
  const peak = Math.max(...points.map((p) => p.score));
  const labels = points.filter((p) => p.label);
  const firstLabel = labels[0]?.label ?? '';
  const midLabel = labels[Math.floor(labels.length / 2)]?.label ?? '';
  const lastLabel = labels[labels.length - 1]?.label ?? '';

  return (
    <View style={styles.card}>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreBig}>{current}</Text>
        <Text style={styles.scoreSub}>/100 Health Score</Text>
      </View>
      <View style={styles.chart}>
        {points.map((point, index) => {
          const barHeight = Math.max(8, (point.score / maxScore) * CHART_HEIGHT);
          const isLatest = index === points.length - 1;
          const isPeak = point.score === peak && !isLatest;
          return (
            <View
              key={`${point.score}-${index}`}
              style={[
                styles.bar,
                {
                  height: barHeight,
                  backgroundColor: isLatest
                    ? colors.primary
                    : isPeak
                      ? colors.primaryContainer
                      : colors.primaryPale,
                  opacity: isLatest ? 1 : index === points.length - 2 ? 0.5 : 1,
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisLabel}>{firstLabel}</Text>
        <Text style={styles.axisLabel}>{midLabel}</Text>
        <Text style={styles.axisLabel}>{lastLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  scoreBig: {
    ...typography.score,
    color: colors.primary,
  },
  scoreSub: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chart: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  bar: {
    flex: 1,
    maxWidth: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 8,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  axisLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 10,
  },
});
