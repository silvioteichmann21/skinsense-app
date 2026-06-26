import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useLocalizedSkinReport } from '@/i18n/content/useLocalizedSkinReport';
import { useTranslation } from '@/i18n/useTranslation';
import type { SkinAnalysisResult } from '@/types/skinAnalysis';
import type { AppColors } from '@/theme/palettes';
import { flatCard, radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  result: SkinAnalysisResult;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      ...flatCard(colors),
      overflow: 'hidden',
      gap: spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.primaryPale,
    },
    topRow: {
      flexDirection: 'row',
      gap: spacing.base,
      alignItems: 'center',
    },
    photoWrap: {
      width: 72,
      height: 72,
      borderRadius: radius.md,
      overflow: 'hidden',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.hairline,
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    scoreLock: {
      width: 80,
      height: 80,
      borderRadius: radius.full,
      borderWidth: 3,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    lockIcon: {
      marginBottom: 2,
    },
    scoreHidden: {
      ...typography.score,
      fontSize: 28,
      color: colors.textTertiary,
    },
    meta: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },
    readyLabel: {
      ...typography.label,
      color: colors.primary,
    },
    skinType: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    hint: {
      ...typography.body,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    concernsWrap: {
      gap: spacing.sm,
    },
    concernsTitle: {
      ...typography.label,
      color: colors.textSecondary,
    },
    concernRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    concernName: {
      ...typography.body,
      flex: 1,
      color: colors.textPrimary,
    },
    barTrack: {
      flex: 1,
      height: 8,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceMuted,
      overflow: 'hidden',
    },
    barBlur: {
      ...StyleSheet.absoluteFillObject,
    },
    hiddenValue: {
      ...typography.label,
      color: colors.textTertiary,
      minWidth: 36,
      textAlign: 'right',
    },
  });
}

export function TeaserReportPreview({ result }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const localized = useLocalizedSkinReport(result);
  const topConcerns = localized.concerns.slice(0, 3);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.photoWrap}>
          <Image source={{ uri: localized.imageUri }} style={styles.photo} contentFit="cover" />
        </View>
        <View style={styles.scoreLock}>
          <MaterialCommunityIcons
            name="lock-outline"
            size={18}
            color={colors.textTertiary}
            style={styles.lockIcon}
          />
          <Text style={styles.scoreHidden}>??</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.readyLabel}>{t('paywall.analysisReady')}</Text>
          <Text style={styles.skinType} numberOfLines={1}>
            {localized.skinType}
          </Text>
          <Text style={styles.hint}>{t('paywall.teaserHint')}</Text>
        </View>
      </View>

      {topConcerns.length > 0 ? (
        <View style={styles.concernsWrap}>
          <Text style={styles.concernsTitle}>{t('paywall.topConcerns')}</Text>
          {topConcerns.map((concern) => (
            <View key={concern.id} style={styles.concernRow}>
              <MaterialCommunityIcons name={concern.icon} size={18} color={colors.primary} />
              <Text style={styles.concernName} numberOfLines={1}>
                {concern.name}
              </Text>
              <View style={styles.barTrack}>
                <View style={[StyleSheet.absoluteFill, { width: `${concern.barPercent}%`, backgroundColor: colors.primaryPale }]} />
                <BlurView intensity={28} tint="light" style={styles.barBlur} />
              </View>
              <Text style={styles.hiddenValue}>??</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
