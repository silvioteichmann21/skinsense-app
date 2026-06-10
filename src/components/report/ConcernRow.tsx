import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import type { ReportConcern } from '@/types/skinAnalysis';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  concern: ReportConcern;
  onPress?: () => void;
};

function severityStyles(severity: ReportConcern['severity'], colors: AppColors) {
  switch (severity) {
    case 'medium':
      return {
        badgeBg: colors.severityMedBg,
        badgeText: colors.severityMedText,
        bar: colors.severityMedText,
        icon: colors.severityMedText,
        border: colors.severityMedBorder,
      };
    case 'high':
      return {
        badgeBg: colors.severityHighBg,
        badgeText: colors.severityHighText,
        bar: colors.severityHighText,
        icon: colors.severityHighText,
        border: colors.severityHighBorder,
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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.base,
    ...shadows.sm,
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
    backgroundColor: colors.periodTrack,
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
}

export function ConcernRow({
 concern, onPress }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const palette = severityStyles(concern.severity, colors);

  return (
    <PressableScale
      onPress={onPress}
      style={styles.card}
      disabled={!onPress}
      haptic={onPress ? 'light' : 'none'}
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
    </PressableScale>
  );
}
