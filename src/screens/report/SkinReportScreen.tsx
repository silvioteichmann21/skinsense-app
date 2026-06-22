import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { GradientButton, GradientSurface } from '@/components/ui/GradientButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { ConcernRow } from '@/components/report/ConcernRow';
import { FaceMap } from '@/components/report/FaceMap';
import { SkinScoreRing } from '@/components/report/SkinScoreRing';
import type { RootStackParamList } from '@/core/navigation/types';
import { useReviewPrompt } from '@/hooks/useReviewPrompt';
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useLocalizedSkinReport } from '@/i18n/content/useLocalizedSkinReport';
import { useSkinStore } from '@/store/skinStore';
import { useTranslation } from '@/i18n/useTranslation';
import { useScanDateLabel } from '@/i18n/useFormattedDate';
import type { AppColors } from '@/theme/palettes';
import {
  flatCard,
  radius,
  sectionTitleStyle,
  spacing,
  touchTarget,
  typography,
  useAppTheme,
  useHorizontalCardWidth,
  useThemedStyles,
} from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SkinReport'>;
type Route = RouteProp<RootStackParamList, 'SkinReport'>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
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
    ...flatCard(colors),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.xl,
  },
  scoreMeta: {
    flex: 1,
    minWidth: 0,
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
    borderRadius: radius.full,
    backgroundColor: colors.switchTrackOff,
  },
  historyLink: {
    fontSize: 11,
    fontFamily: typography.h3.fontFamily,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  skinTypeCard: {
    ...flatCard(colors),
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
    backgroundColor: colors.chipNeutralBg,
  },
  chipText: {
    ...typography.label,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 12,
  },
  chipTextPrimary: {
    color: colors.onPrimaryPale,
  },
  chipTextNeutral: {
    color: colors.chipNeutralText,
  },
  sectionTitle: {
    ...sectionTitleStyle(colors),
    marginBottom: spacing.base,
  },
  sectionSpaced: {
    marginTop: spacing.xl,
  },
  positivesCard: {
    ...flatCard(colors),
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
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  positiveText: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  nextStepsRow: {
    alignItems: 'stretch',
    gap: spacing.base,
    paddingBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  nextStepPressable: {
    alignSelf: 'stretch',
  },
  nextCard: {
    flex: 1,
    width: '100%',
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  nextCardPrimary: {
    overflow: 'hidden',
  },
  nextCardNeutral: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
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
    color: colors.onPrimary,
    opacity: 0.85,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    backgroundColor: colors.glassStrong,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  cta: {
    width: '100%',
  },
  ctaContent: {
    gap: spacing.sm,
  },
  ctaLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
});
}

export function SkinReportScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { result: rawResult } = route.params;
  const result = useLocalizedSkinReport(rawResult);
  const scanDateLabel = useScanDateLabel(result.scannedAt);
  const totalScans = useSkinStore((s) => s.analysisHistory.length);
  const { isPremium, hydrated } = usePremiumAccess();
  const { tryShowPrompt } = useReviewPrompt();

  useEffect(() => {
    if (!hydrated || isPremium) return;
    navigation.replace('Paywall', { result: rawResult, mode: 'checkout' });
  }, [hydrated, isPremium, navigation, rawResult]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void tryShowPrompt('first_scan', {
        totalScans,
        streakDays: 0,
        homeVisitCount: 0,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [totalScans, tryShowPrompt]);

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
        id: 'science' as const,
        title: t('report.exploreScience'),
        subtitle: t('report.exploreScienceSub'),
        icon: 'book-open-variant' as const,
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
  const nextCardWidth = useHorizontalCardWidth(180, 0.46);

  if (!hydrated || !isPremium) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <StatusBar style={statusBarStyle} />
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

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
          <View style={{ flexShrink: 0 }}>
            <SkinScoreRing score={result.skinScore} />
          </View>
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreLabel}>{t('report.skinHealthScore')}</Text>
            <Text style={styles.scoreSub} numberOfLines={2}>
              {result.skinType}
              {result.fitzpatrick ? ` · ${result.fitzpatrick}` : ''}
            </Text>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>
                {t('report.scannedOn', { date: scanDateLabel })}
              </Text>
              <View style={styles.dot} />
              <Pressable
                hitSlop={8}
                accessibilityRole="link"
                accessibilityLabel={t('report.viewHistory')}
                onPress={() => navigation.navigate('SkinProfile')}
              >
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

        <FaceMap result={result} />

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
          {nextSteps.map((step) => {
            const cardBody = (
              <>
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
                  numberOfLines={2}
                >
                  {step.title}
                </Text>
                <Text
                  style={[
                    styles.nextSub,
                    step.variant === 'primary' && styles.nextSubPrimary,
                  ]}
                  numberOfLines={2}
                >
                  {step.subtitle}
                </Text>
              </>
            );

            return (
              <PressableScale
                key={step.id}
                haptic="light"
                onPress={
                  step.id === 'routine'
                    ? () => navigation.navigate('RoutineReveal', { result })
                    : step.id === 'science'
                      ? () => navigation.navigate('ScienceLibrary')
                      : step.id === 'scan'
                        ? () => navigation.navigate('ScanGuide')
                        : undefined
                }
                style={[styles.nextStepPressable, { width: nextCardWidth }]}
              >
                {step.variant === 'primary' ? (
                  <GradientSurface style={[styles.nextCard, styles.nextCardPrimary]}>
                    {cardBody}
                  </GradientSurface>
                ) : (
                  <View style={[styles.nextCard, styles.nextCardNeutral]}>{cardBody}</View>
                )}
              </PressableScale>
            );
          })}
        </ScrollView>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerBottom }]}>
        <GradientButton
          onPress={() => navigation.navigate('RoutineReveal', { result })}
          style={styles.cta}
          contentStyle={styles.ctaContent}
        >
          <Text style={styles.ctaLabel}>{t('report.seeRoutine')}</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color={colors.textInverse} />
        </GradientButton>
      </View>
    </View>
  );
}
