import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useFaceZoneMetrics } from '@/hooks/useFaceZoneMetrics';
import type { FaceZoneId, ZoneIssueType } from '@/services/ai/faceZoneMetrics';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AppColors } from '@/theme/palettes';
import {
  radius,
  spacing,
  typography,
  useContentWidth,
  useThemedStyles,
  useAppTheme,
} from '@/theme';

const ZONE_LABEL_KEYS: Record<FaceZoneId, TranslationKey> = {
  forehead: 'report.zoneForehead',
  leftCheek: 'report.zoneLeftCheek',
  rightCheek: 'report.zoneRightCheek',
  nose: 'report.zoneNose',
  chin: 'report.zoneChin',
};

const ZONE_IDS: FaceZoneId[] = ['forehead', 'leftCheek', 'rightCheek', 'nose', 'chin'];

const ISSUE_STATUS_KEYS: Record<ZoneIssueType, TranslationKey> = {
  oil: 'report.zoneIssueStatus.oil',
  dryness: 'report.zoneIssueStatus.dryness',
  texture: 'report.zoneIssueStatus.texture',
  redness: 'report.zoneIssueStatus.redness',
  balanced: 'report.zoneIssueStatus.balanced',
};

const ISSUE_DESC_KEYS: Record<ZoneIssueType, TranslationKey> = {
  oil: 'report.zoneIssueDesc.oil',
  dryness: 'report.zoneIssueDesc.dryness',
  texture: 'report.zoneIssueDesc.texture',
  redness: 'report.zoneIssueDesc.redness',
  balanced: 'report.zoneIssueDesc.balanced',
};

function createStyles(colors: AppColors, compact: boolean) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.lg,
      padding: compact ? spacing.lg : spacing.xl,
      borderWidth: 1,
      borderColor: colors.hairline,
      gap: spacing.lg,
    },
    heading: {
      ...typography.label,
      color: colors.textSecondary,
      letterSpacing: 1,
    },
    summary: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    loadingRow: {
      paddingVertical: spacing.xl,
      alignItems: 'center',
    },
    zoneList: {
      gap: spacing.md,
    },
    zoneRow: {
      padding: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      gap: spacing.sm,
    },
    zoneHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    zoneName: {
      ...typography.h3,
      color: colors.textPrimary,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
    },
    statusElevated: {
      backgroundColor: 'rgba(245, 200, 66, 0.18)',
    },
    statusBalanced: {
      backgroundColor: 'rgba(82, 183, 136, 0.16)',
    },
    statusTextElevated: {
      ...typography.label,
      color: colors.warning,
      fontSize: 11,
      letterSpacing: 0.6,
    },
    statusTextBalanced: {
      ...typography.label,
      color: colors.primaryLight,
      fontSize: 11,
      letterSpacing: 0.6,
    },
    zoneBody: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.lg,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.hairline,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
      minWidth: '45%',
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    dotElevated: {
      backgroundColor: colors.warning,
    },
    dotBalanced: {
      backgroundColor: colors.primary,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: typography.body.fontFamily,
    },
  });
}

type Props = {
  result?: SkinAnalysisResult;
};

export function FaceMap({ result }: Props) {
  const contentWidth = useContentWidth();
  const compact = contentWidth < 340;
  const styles = useThemedStyles((colors) => createStyles(colors, compact));
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const { metrics, loading } = useFaceZoneMetrics(result?.imageUri, result);

  const zones = useMemo(() => {
    if (!metrics) return [];

    return ZONE_IDS.map((id) => ({
      id,
      label: t(ZONE_LABEL_KEYS[id]),
      tint: metrics[id].tint,
      issue: metrics[id].issue,
    }));
  }, [metrics, t]);

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{t('report.faceMapTitle')}</Text>
      <Text style={styles.summary}>{t('report.faceMapSummary')}</Text>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={[styles.summary, { marginTop: spacing.sm, textAlign: 'center' }]}>
            {t('report.zoneAnalyzing')}
          </Text>
        </View>
      ) : (
        <View style={styles.zoneList}>
          {zones.map((zone) => (
            <View key={zone.id} style={styles.zoneRow}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{zone.label}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    zone.tint === 'elevated' ? styles.statusElevated : styles.statusBalanced,
                  ]}
                >
                  <Text
                    style={
                      zone.tint === 'elevated'
                        ? styles.statusTextElevated
                        : styles.statusTextBalanced
                    }
                  >
                    {t(ISSUE_STATUS_KEYS[zone.issue])}
                  </Text>
                </View>
              </View>
              <Text style={styles.zoneBody}>{t(ISSUE_DESC_KEYS[zone.issue])}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotElevated]} />
          <Text style={styles.legendText}>{t('report.elevatedActivity')}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, styles.dotBalanced]} />
          <Text style={styles.legendText}>{t('report.optimalBalance')}</Text>
        </View>
      </View>
    </View>
  );
}
