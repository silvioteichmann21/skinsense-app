import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ConcernRow } from '@/components/report/ConcernRow';
import { FaceMap } from '@/components/report/FaceMap';
import { SkinScoreRing } from '@/components/report/SkinScoreRing';
import type { RootStackParamList } from '@/core/navigation/types';
import { useLocalizedSkinReport } from '@/i18n/content/useLocalizedSkinReport';
import { useTranslation } from '@/i18n/useTranslation';
import { useScanDateLabel } from '@/i18n/useFormattedDate';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SkinReport'>;
type Route = RouteProp<RootStackParamList, 'SkinReport'>;

export function SkinReportScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { result: rawResult } = route.params;
  const result = useLocalizedSkinReport(rawResult);
  const scanDateLabel = useScanDateLabel(result.scannedAt);

  const nextSteps = useMemo(
    () => [
      {
        id: 'routine' as const,
        title: t('report.startRoutine'),
        subtitle: t('report.startRoutineSub'),
        icon: 'calendar' as const,
        variant: 'primary' as const,
      },
      {
        id: 'products' as const,
        title: t('report.exploreProducts'),
        subtitle: t('report.exploreProductsSub'),
        icon: 'shopping-outline' as const,
        variant: 'neutral' as const,
      },
      {
        id: 'scan' as const,
        title: t('report.scanAgain'),
        subtitle: t('report.scanAgainSub'),
        icon: 'camera-outline' as const,
        variant: 'neutral' as const,
      },
    ],
    [t],
  );

  const footerBottom = Math.max(insets.bottom, spacing.base);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScreenHeader
        topInset={insets.top}
        title={t('report.skinReport')}
        style={styles.headerBar}
        right={
          <Pressable style={styles.avatarBtn} accessibilityLabel="Profile photo">
            <Image source={{ uri: result.imageUri }} style={styles.headerAvatar} contentFit="cover" />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: touchTarget + footerBottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scoreCard}>
          <SkinScoreRing score={result.skinScore} />
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreLabel}>{t('report.skinHealthScore')}</Text>
            <Text style={styles.scoreSub}>
              {result.skinType} · {result.fitzpatrick}
            </Text>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>
                {t('report.scannedOn', { date: scanDateLabel })}
              </Text>
              <View style={styles.dot} />
              <Pressable hitSlop={8}>
                <Text style={styles.historyLink}>{t('report.viewHistory')}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.skinTypeCard}>
          <View style={styles.skinTypeHeader}>
            <View style={styles.skinTypeIcon}>
              <MaterialCommunityIcons name="spa" size={22} color={colors.textInverse} />
            </View>
            <Text style={styles.skinTypeTitle}>{result.skinType}</Text>
          </View>
          <Text style={styles.skinTypeDesc}>{result.skinTypeDescription}</Text>
          <View style={styles.chipRow}>
            {result.skinTypeChips.map((chip) => (
              <View
                key={chip.label}
                style={[
                  styles.chip,
                  chip.variant === 'primary' ? styles.chipPrimary : styles.chipNeutral,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    chip.variant === 'primary' ? styles.chipTextPrimary : styles.chipTextNeutral,
                  ]}
                >
                  {chip.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('report.yourConcerns')}</Text>
        {result.concerns.map((concern) => (
          <ConcernRow
            key={concern.id}
            concern={concern}
            onPress={() =>
              navigation.navigate('ReportDetail', {
                concernId: concern.id,
                scanId: result.id,
                concern,
                scannedAt: result.scannedAt,
              })
            }
          />
        ))}

        <FaceMap />

        <Text style={[styles.sectionTitle, styles.sectionSpaced]}>{t('report.whatsWorking')}</Text>
        <View style={styles.positivesCard}>
          {result.positives.map((item) => (
            <View key={item} style={styles.positiveRow}>
              <View style={styles.positiveIcon}>
                <MaterialCommunityIcons name="check" size={18} color={colors.primary} />
              </View>
              <Text style={styles.positiveText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpaced]}>{t('report.nextSteps')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nextStepsRow}
        >
          {nextSteps.map((step) => (
            <Pressable
              key={step.id}
              onPress={
                step.id === 'routine'
                  ? () => navigation.navigate('RoutineReveal', { result })
                  : step.id === 'products'
                    ? () => navigation.navigate('Products')
                    : undefined
              }
              style={[
                styles.nextCard,
                step.variant === 'primary' ? styles.nextCardPrimary : styles.nextCardNeutral,
              ]}
            >
              <MaterialCommunityIcons
                name={step.icon}
                size={24}
                color={step.variant === 'primary' ? colors.textInverse : colors.primary}
              />
              <Text
                style={[
                  styles.nextTitle,
                  step.variant === 'primary' && styles.nextTitlePrimary,
                ]}
              >
                {step.title}
              </Text>
              <Text
                style={[
                  styles.nextSub,
                  step.variant === 'primary' && styles.nextSubPrimary,
                ]}
              >
                {step.subtitle}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerBottom }]}>
        <Pressable
          onPress={() => navigation.navigate('RoutineReveal', { result })}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <Text style={styles.ctaLabel}>{t('report.seeRoutine')}</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color={colors.textInverse} />
        </Pressable>
      </View>
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
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  scoreMeta: {
    flex: 1,
  },
  scoreLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  scoreSub: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFC9C1',
  },
  historyLink: {
    fontSize: 11,
    fontFamily: typography.h3.fontFamily,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  skinTypeCard: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primaryPale,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  skinTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  skinTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skinTypeTitle: {
    ...typography.h3,
    color: colors.primary,
  },
  skinTypeDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.base,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  chipPrimary: {
    backgroundColor: colors.primaryPale,
  },
  chipNeutral: {
    backgroundColor: '#DCE2F7',
  },
  chipText: {
    ...typography.label,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 12,
  },
  chipTextPrimary: {
    color: colors.primaryDark,
  },
  chipTextNeutral: {
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  sectionSpaced: {
    marginTop: spacing.xl,
  },
  positivesCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  positiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  positiveIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positiveText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  nextStepsRow: {
    gap: spacing.base,
    paddingBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  nextCard: {
    width: 180,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  nextCardPrimary: {
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  nextCardNeutral: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  nextTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    marginBottom: 4,
  },
  nextTitlePrimary: {
    color: colors.textInverse,
  },
  nextSub: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  nextSubPrimary: {
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderMuted,
  },
  cta: {
    height: touchTarget,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.lg,
  },
  ctaPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  ctaLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
