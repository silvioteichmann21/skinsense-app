import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductRecommendCard } from '@/components/report/ProductRecommendCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import {
  getConcernDetail,
  severityBadgeColors,
} from '@/screens/report/concernDetailData';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { useScanDateLabel } from '@/i18n/useFormattedDate';

import { colors, radius, shadows, spacing, typography } from '@/theme';

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

export function ReportDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { concern, scannedAt } = route.params;
  const scanDateLabel = useScanDateLabel(scannedAt);
  const detail = getConcernDetail(concern.id);
  const badge = severityBadgeColors(concern.severity);
  const severityLabel = t(SEVERITY_KEYS[concern.severity] ?? 'report.severityLow');

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
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
            {detail.causes.map((cause) => (
              <View key={cause.label} style={styles.causeChip}>
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
              <MaterialCommunityIcons name="chart-line" size={22} color="#A8E7C7" />
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

        <View style={styles.productsHeader}>
          <Text style={styles.productsTitle}>{t('report.recommendedProducts')}</Text>
          <Pressable onPress={() => navigation.navigate('Products')} hitSlop={8}>
            <Text style={styles.viewAll}>{t('common.viewAll')}</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScroll}
        >
          {detail.products.map((product) => (
            <ProductRecommendCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.libraryLink}
            onPress={() =>
              Alert.alert(t('report.scienceLibrary'), t('report.scienceLibrarySoon'))
            }
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
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  severityText: {
    ...typography.label,
    fontSize: 11,
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  heroMeta: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  whatCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  whatText: {
    ...typography.body,
    color: '#404943',
    lineHeight: 22,
  },
  causeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  causeChip: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(183, 228, 199, 0.5)',
  },
  causeLabel: {
    ...typography.body,
    color: '#404943',
    flex: 1,
  },
  resultCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  resultDecor: {
    position: 'absolute',
    right: -32,
    bottom: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(168, 231, 197, 0.15)',
  },
  resultContent: {
    zIndex: 1,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  resultTitle: {
    ...typography.h3,
    color: '#A8E7C7',
  },
  resultText: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  resultHighlight: {
    fontFamily: typography.h3.fontFamily,
    textDecorationLine: 'underline',
    color: colors.primaryPale,
  },
  improveRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#B1F0CE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: typography.score.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  improveBody: {
    flex: 1,
  },
  improveTitle: {
    ...typography.bodyLg,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  improveDesc: {
    ...typography.body,
    color: colors.textSecondary,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  productsTitle: {
    ...typography.h3,
    color: colors.primary,
  },
  viewAll: {
    ...typography.label,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  productsScroll: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.borderMuted,
    alignItems: 'center',
  },
  libraryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  libraryText: {
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.primary,
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
