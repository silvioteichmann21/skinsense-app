import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveIngredientCard } from '@/components/education/ActiveIngredientCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { severityBadgeColors } from '@/screens/report/concernDetailData';
import { useLocalizedConcernDetail } from '@/i18n/content/useLocalizedConcernDetail';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { useScanDateLabel } from '@/i18n/useFormattedDate';
import { useLocalizedIngredients } from '@/i18n/content/useLocalizedIngredient';
import type { SkinConcern } from '@/types/activeIngredient';

import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

function concernNameKey(id: string): TranslationKey {
  return `reportData.concerns.${id}.name` as TranslationKey;
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'ReportDetail'>;
type Route = RouteProp<RootStackParamList, 'ReportDetail'>;

const SEVERITY_KEYS: Record<string, TranslationKey> = {
  high: 'report.severityHigh',
  medium: 'report.severityMedium',
  low: 'report.severityLow',
  healthy: 'report.severityHealthy',
};

function ResultBody({ text, highlight }: { text: string; highlight?: string }) {
  const styles = useThemedStyles(createStyles);

  if (!highlight || !text.includes(highlight)) {
    return <Text style={styles.resultText}>{text}</Text>;
  }

  const [before, after] = text.split(highlight);

  return (
    <Text style={styles.resultText}>
      {before}
      <Text style={styles.resultHighlight}>{highlight}</Text>
      {after}
    </Text>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  hero: {
    marginBottom: spacing.xl,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.primary,
    flex: 1,
  },
  severityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  severityText: {
    ...typography.caption,
    fontWeight: '600',
  },
  heroMeta: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textTertiary,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  whatCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  whatText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  causeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  causeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  causeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  resultCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  resultDecor: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  resultContent: {
    padding: spacing.xl,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  resultTitle: {
    ...typography.h3,
    color: colors.textInverse,
  },
  resultText: {
    ...typography.body,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
  },
  resultHighlight: {
    color: colors.primaryLight,
    fontFamily: typography.h3.fontFamily,
  },
  improveRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    ...typography.label,
    color: colors.primaryDark,
    fontSize: 12,
  },
  improveBody: {
    flex: 1,
  },
  improveTitle: {
    ...typography.label,
    color: colors.textPrimary,
    textTransform: 'none',
    marginBottom: spacing.xs,
  },
  improveDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ingredientsTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  ingredientsHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  viewAll: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
  },
  ingredientsScroll: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  footer: {
    marginTop: spacing.md,
  },
  libraryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  libraryText: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
    textAlign: 'center',
    flexShrink: 1,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
});
}

export function ReportDetailScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { concern, scannedAt } = route.params;
  const scanDateLabel = useScanDateLabel(scannedAt);
  const detail = useLocalizedConcernDetail(concern.id);
  const concernKey = (['hydration', 'acne', 'texture', 'barrier'].includes(concern.id)
    ? concern.id
    : 'hydration') as SkinConcern;
  const recommendedIngredients = useLocalizedIngredients(detail.ingredientIds, concernKey);
  const badge = severityBadgeColors(concern.severity, colors);
  const severityLabel = t(SEVERITY_KEYS[concern.severity] ?? 'report.severityLow');

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('report.reportDetail')} style={styles.headerBar} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, spacing.xxl) + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTitleRow}>
            <Text style={styles.heroTitle}>{t(concernNameKey(concern.id))}</Text>
            <View style={[styles.severityPill, { backgroundColor: badge.bg }]}>
              <MaterialCommunityIcons
                name={concern.severity === 'healthy' ? 'check-circle' : 'alert'}
                size={14}
                color={badge.icon}
              />
              <Text style={[styles.severityText, { color: badge.text }]}>{severityLabel}</Text>
            </View>
          </View>
          <Text style={styles.heroMeta}>
            {t('report.detectedOn', { date: scanDateLabel })}
          </Text>
        </View>

        <Section title={t('report.whatIs')}>
          <View style={styles.whatCard}>
            <Text style={styles.whatText}>{detail.whatIs}</Text>
          </View>
        </Section>

        <Section title={t('report.causes')}>
          <View style={styles.causeGrid}>
            {detail.causes.map((cause, index) => (
              <View key={`${cause.icon}-${index}`} style={styles.causeChip}>
                <MaterialCommunityIcons name={cause.icon} size={20} color={colors.primary} />
                <Text style={styles.causeLabel}>{cause.label}</Text>
              </View>
            ))}
          </View>
        </Section>

        <View style={styles.resultCard}>
          <View style={styles.resultDecor} />
          <View style={styles.resultContent}>
            <View style={styles.resultTitleRow}>
              <MaterialCommunityIcons name="chart-line" size={22} color={colors.primaryLight} />
              <Text style={styles.resultTitle}>{t('report.yourResult')}</Text>
            </View>
            <ResultBody text={detail.yourResult} highlight={detail.highlightPhrase} />
          </View>
        </View>

        <Section title={t('report.howToImprove')}>
          {detail.improvements.map((step, index) => (
            <View key={step.title} style={styles.improveRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{index + 1}</Text>
              </View>
              <View style={styles.improveBody}>
                <Text style={styles.improveTitle}>{step.title}</Text>
                <Text style={styles.improveDesc}>{step.body}</Text>
              </View>
            </View>
          ))}
        </Section>

        <View style={styles.ingredientsHeader}>
          <Text style={styles.ingredientsTitle}>{t('report.recommendedIngredients')}</Text>
          <Pressable onPress={() => navigation.navigate('ScienceLibrary')} hitSlop={8}>
            <Text style={styles.viewAll}>{t('common.viewAll')}</Text>
          </Pressable>
        </View>
        <Text style={styles.ingredientsHint}>{t('report.recommendedIngredientsHint')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ingredientsScroll}
        >
          {recommendedIngredients.map((ingredient) => (
            <ActiveIngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onPress={() => navigation.navigate('IngredientDetail', { ingredientId: ingredient.id })}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.libraryLink}
            onPress={() => navigation.navigate('ScienceLibrary')}
          >
            <Text style={styles.libraryText}>
              {t('report.libraryLink', { topic: detail.libraryTopic })}
            </Text>
            <MaterialCommunityIcons name="open-in-new" size={18} color={colors.primary} />
          </Pressable>
          <Text style={styles.disclaimer}>{t('report.disclaimer')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}
