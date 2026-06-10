import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { LocalizedSkinProfileConcern } from '@/i18n/content/useLocalizedSkinProfile';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function trendMeta(trend: LocalizedSkinProfileConcern['trend'], colors: AppColors) {
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

function barColor(concern: LocalizedSkinProfileConcern, colors: AppColors): string {
  if (concern.severity === 'none') return colors.borderMuted;
  if (concern.severity === 'medium') return colors.accent;
  if (concern.trend === 'stable') return colors.switchTrackOff;
  return colors.primary;
}

type Props = {
  concern: LocalizedSkinProfileConcern;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
}

export function SkinProfileConcernRow({ concern }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const trend = trendMeta(concern.trend, colors);
  const none = concern.severity === 'none';

  return (
    <View style={styles.row}>
      <View style={styles.head}>
        <Text style={styles.name}>{concern.name}</Text>
        {none ? (
          <Text style={styles.noneLabel}>{t('skinProfileData.severity.none')}</Text>
        ) : (
          <View style={styles.severityRow}>
            <Text
              style={[
                styles.severityLabel,
                concern.severity === 'medium' && styles.severityMedium,
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
                backgroundColor: barColor(concern, colors),
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}
