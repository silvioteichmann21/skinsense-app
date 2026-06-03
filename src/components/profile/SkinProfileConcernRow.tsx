import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { SkinProfileConcern } from '@/screens/profile/skinProfileMockData';
import { colors, radius, spacing, typography } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function trendMeta(trend: SkinProfileConcern['trend']) {
  switch (trend) {
    case 'up':
      return { icon: 'trending-up' as IconName, color: colors.accent };
    case 'down':
      return { icon: 'trending-down' as IconName, color: colors.primary };
    case 'stable':
      return { icon: 'minus' as IconName, color: colors.textTertiary };
    default:
      return null;
  }
}

function barColor(concern: SkinProfileConcern): string {
  if (concern.severityLabel === 'NONE') return colors.borderMuted;
  if (concern.severityLabel === 'MEDIUM') return colors.accent;
  if (concern.trend === 'stable') return '#BFC9C1';
  return colors.primary;
}

type Props = {
  concern: SkinProfileConcern;
};

export function SkinProfileConcernRow({ concern }: Props) {
  const trend = trendMeta(concern.trend);
  const none = concern.severityLabel === 'NONE';

  return (
    <View style={styles.row}>
      <View style={styles.head}>
        <Text style={styles.name}>{concern.name}</Text>
        {none ? (
          <Text style={styles.noneLabel}>NONE</Text>
        ) : (
          <View style={styles.severityRow}>
            <Text
              style={[
                styles.severityLabel,
                concern.severityLabel === 'MEDIUM' && styles.severityMedium,
              ]}
            >
              {concern.severityLabel}
            </Text>
            {trend ? (
              <MaterialCommunityIcons name={trend.icon} size={16} color={trend.color} />
            ) : null}
          </View>
        )}
      </View>
      <View style={[styles.track, none && styles.trackMuted]}>
        {!none ? (
          <View
            style={[
              styles.fill,
              {
                width: `${concern.barPercent}%`,
                backgroundColor: barColor(concern),
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  severityLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.primary,
    textTransform: 'none',
    letterSpacing: 0.3,
  },
  severityMedium: {
    color: colors.accent,
  },
  noneLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textTertiary,
    textTransform: 'none',
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderMuted,
    overflow: 'hidden',
  },
  trackMuted: {
    opacity: 0.3,
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
