import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ReportConcern } from '@/types/skinAnalysis';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  concern: ReportConcern;
  onPress?: () => void;
};

function severityStyles(severity: ReportConcern['severity']) {
  switch (severity) {
    case 'medium':
      return {
        badgeBg: '#FFDCC4',
        badgeText: '#8E4E14',
        bar: '#8E4E14',
        icon: '#8E4E14',
        border: '#FFB780',
      };
    case 'high':
      return {
        badgeBg: colors.error + '22',
        badgeText: colors.error,
        bar: colors.error,
        icon: colors.error,
        border: colors.error,
      };
    case 'healthy':
      return {
        badgeBg: colors.primaryPale,
        badgeText: colors.primary,
        bar: colors.primaryLight,
        icon: colors.primary,
        border: colors.primaryPale,
      };
    default:
      return {
        badgeBg: colors.primaryPale,
        badgeText: colors.primary,
        bar: colors.primary,
        icon: colors.primary,
        border: colors.primaryPale,
      };
  }
}

export function ConcernRow({ concern, onPress }: Props) {
  const palette = severityStyles(concern.severity);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons name={concern.icon} size={22} color={palette.icon} />
          <Text style={styles.name}>{concern.name}</Text>
          {onPress ? (
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textTertiary} />
          ) : null}
        </View>
        <Text style={[styles.badge, { backgroundColor: palette.badgeBg, color: palette.badgeText }]}>
          {concern.severityLabel}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${concern.barPercent}%`, backgroundColor: palette.bar }]}
        />
      </View>
      {concern.insight ? (
        <Text style={[styles.insight, { borderLeftColor: palette.border }]}>
          &ldquo;{concern.insight}&rdquo;
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  cardPressed: {
    opacity: 0.92,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  badge: {
    ...typography.label,
    fontSize: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  track: {
    height: 8,
    backgroundColor: '#E9EDFF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  insight: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    borderLeftWidth: 2,
    paddingLeft: spacing.md,
  },
});
