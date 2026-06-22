import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityReviewsSection } from '@/components/feedback/CommunityReviewsSection';
import { CommunityTrustCard } from '@/components/feedback/CommunityTrustCard';
import { incrementHomeVisitCount } from '@/core/storage/feedbackPromptStorage';
import { useReviewPrompt } from '@/hooks/useReviewPrompt';
import { useRequirePremium } from '@/hooks/usePremiumAccess';
import { SkinScoreRing } from '@/components/report/SkinScoreRing';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { GradientButton } from '@/components/ui/GradientButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Reveal } from '@/components/ui/Reveal';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useHomeArticles } from '@/i18n/content/useLocalizedContent';
import { useHomeMorningRoutine } from '@/hooks/useHomeMorningRoutine';
import { useHomeWeeklyInsight } from '@/hooks/useHomeWeeklyInsight';
import { useTranslation } from '@/i18n/useTranslation';
import { useHomeHeaderDate } from '@/i18n/useFormattedDate';
import { useHomeScanSummary } from '@/hooks/useHomeScanSummary';
import { useActivityStats } from '@/hooks/useActivityStats';
import { useUserDisplayName } from '@/hooks/useUserDisplayName';
import type { HomeRoutineStep } from '@/hooks/useHomeMorningRoutine';
import type { AppColors } from '@/theme/palettes';
import {
  flatCard,
  fontFamilies,
  layout,
  radius,
  spacing,
  sectionTitleStyle,
  touchTarget,
  typography,
  useAppTheme,
  useCarouselCardWidth,
  useThemedStyles,
} from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function useGreeting(): string {
  const { t } = useTranslation();
  const hour = new Date().getHours();
  if (hour < 12) return t('home.greetingMorning');
  if (hour < 17) return t('home.greetingAfternoon');
  return t('home.greetingEvening');
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: layout.screenPaddingX,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  topBarCenter: {
    flex: 1,
    minWidth: 0,
  },
  greetingLine: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  greetingName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  streakText: {
    ...typography.label,
    color: colors.accentTagText,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  bellBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
  },
  scroll: {
    paddingHorizontal: layout.screenPaddingX,
    gap: layout.sectionGap,
  },
  scoreCard: {
    ...flatCard(colors),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  scoreRingPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.ctaTint,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scoreLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: spacing.md,
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  scoreBig: {
    ...typography.score,
    color: colors.ctaGradientStart,
  },
  scoreDelta: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    lineHeight: 20,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  lastScan: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scanBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
  scanBtnContent: {
    gap: spacing.sm,
  },
  scanBtnLabel: {
    ...typography.body,
    color: colors.textInverse,
    fontFamily: typography.h3.fontFamily,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
  },
  routineCard: flatCard(colors),
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  routineTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  routineProgress: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  miniTrack: {
    width: 64,
    height: 5,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.sm,
  },
  checkRowDone: {
    backgroundColor: colors.surfaceAlt,
  },
  checkLabel: {
    ...typography.bodyLg,
    color: colors.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  checkLabelDone: {
    color: colors.primary,
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  viewRoutine: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  viewRoutineLabel: {
    ...typography.body,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  insightCard: {
    ...flatCard(colors),
    flexDirection: 'row',
    gap: spacing.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBody: {
    flex: 1,
    minWidth: 0,
  },
  insightTitle: {
    ...sectionTitleStyle(colors),
    marginBottom: spacing.xs,
  },
  insightText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  insightBold: {
    fontFamily: typography.h3.fontFamily,
  },
  learnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  learnTitle: sectionTitleStyle(colors),
  seeAll: {
    ...typography.body,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  learnScroll: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
    paddingRight: spacing.sm,
  },
  articleCard: {
    ...flatCard(colors),
    gap: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  articleIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articleBody: {
    flex: 1,
    minWidth: 0,
    gap: spacing.sm,
  },
  articleTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  articleTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  tagPrimary: {
    backgroundColor: colors.ctaTint,
  },
  tagAccent: {
    backgroundColor: colors.accentLight,
  },
  articleTagText: {
    fontSize: 11,
    fontFamily: fontFamilies.bodyMed,
    color: colors.textSecondary,
  },
  articleTagTextAccent: {
    color: colors.accentTagText,
  },
  readTime: {
    ...typography.label,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'none',
  },
  articleTitle: {
    ...typography.h3,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
}

export function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const greeting = useGreeting();
  const {
    steps: previewSteps,
    doneCount,
    totalSteps,
    progressPct,
    isDone,
    toggleStep,
  } = useHomeMorningRoutine();
  const articles = useHomeArticles();
  const today = useHomeHeaderDate();
  const scanSummary = useHomeScanSummary();
  const weeklyInsight = useHomeWeeklyInsight();
  const displayName = useUserDisplayName();
  const { streakDays, totalScans } = useActivityStats();
  const { tryShowAnyPrompt } = useReviewPrompt();
  const { guardPremium } = useRequirePremium();
  const articleWidth = useCarouselCardWidth();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        const homeVisitCount = await incrementHomeVisitCount();
        if (!active) return;
        await tryShowAnyPrompt({
          totalScans,
          streakDays,
          homeVisitCount,
        });
      })();
      return () => {
        active = false;
      };
    }, [totalScans, streakDays, tryShowAnyPrompt]),
  );

  const openScan = useCallback(() => {
    navigation.navigate('ScanGuide');
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.base }]}>
        <View style={styles.topBarCenter}>
          <Text style={styles.greetingLine}>
            {displayName ? greeting : `${greeting} ☀️`}
          </Text>
          {displayName ? (
            <Text style={styles.greetingName}>
              {t('home.greetingNameLine', { name: displayName })}
            </Text>
          ) : null}
          <Text style={styles.date}>{today}</Text>
        </View>
        <View style={styles.topActions}>
          <View style={styles.streakBadge}>
            <MaterialCommunityIcons name="fire" size={14} color={colors.accent} />
            <Text style={styles.streakText}>
              {t('home.streak', { count: streakDays })}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.notifications')}
            style={styles.bellBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Reveal index={0} style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>{t('home.skinHealthScore')}</Text>
            <View style={styles.scoreRow}>
              {scanSummary.hasScan && scanSummary.score !== null ? (
                <AnimatedCounter value={scanSummary.score} style={styles.scoreBig} />
              ) : (
                <Text style={styles.scoreBig}>—</Text>
              )}
              {scanSummary.deltaLabel ? (
                <Text style={styles.scoreDelta}>{scanSummary.deltaLabel}</Text>
              ) : null}
            </View>
            <Text style={styles.lastScan}>{scanSummary.lastScanLabel}</Text>
            <GradientButton
              onPress={openScan}
              size="compact"
              style={styles.scanBtn}
              contentStyle={styles.scanBtnContent}
            >
              <MaterialCommunityIcons name="image-filter-center-focus" size={18} color={colors.textInverse} />
              <Text style={styles.scanBtnLabel}>
                {scanSummary.hasScan ? t('home.scanNow') : t('home.firstScan')}
              </Text>
            </GradientButton>
          </View>
          {scanSummary.hasScan && scanSummary.score !== null ? (
            <View style={{ flexShrink: 0 }}>
              <SkinScoreRing score={scanSummary.score} size={96} />
            </View>
          ) : (
            <View style={styles.scoreRingPlaceholder}>
              <MaterialCommunityIcons name="camera-outline" size={36} color={colors.onPrimaryPale} />
            </View>
          )}
        </Reveal>

        <CommunityTrustCard revealIndex={1} embedded />

        <Reveal index={2} style={styles.quickActions}>
          {(
            [
              { key: 'scan', label: t('home.quickScan'), icon: 'qrcode-scan' as const, onPress: openScan },
              {
                key: 'science',
                label: t('home.quickScience'),
                icon: 'book-open-variant' as const,
                onPress: () => navigation.navigate('ScienceLibrary'),
              },
              {
                key: 'progress',
                label: t('home.quickProgress'),
                icon: 'chart-line' as const,
                onPress: () => navigation.navigate('Progress'),
              },
              {
                key: 'chat',
                label: t('home.quickChat'),
                icon: 'chat-outline' as const,
                onPress: () => guardPremium(() => navigation.navigate('AIChat'), { mode: 'checkout' }),
              },
            ] as const
          ).map((action) => (
            <PressableScale key={action.key} style={styles.quickAction} onPress={action.onPress} haptic="light">
              <View style={styles.quickIconWrap}>
                <MaterialCommunityIcons name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </PressableScale>
          ))}
        </Reveal>

        <Reveal index={3} style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View>
              <Text style={styles.routineTitle}>{t('home.morningRoutine')}</Text>
              <Text style={styles.routineProgress}>
                {t('home.stepsComplete', { done: doneCount, total: totalSteps })}
              </Text>
            </View>
            <View style={styles.miniTrack}>
              <LinearGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
                locations={[0, 0.48, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.miniFill, { width: `${progressPct}%` }]}
              />
            </View>
          </View>
          {previewSteps.map((step) => (
            <RoutineCheckRow
              key={step.id}
              step={step}
              done={isDone(step.id)}
              onToggle={() => void toggleStep(step.id)}
            />
          ))}
          <Pressable
            style={styles.viewRoutine}
            onPress={() => navigation.navigate('Routine')}
          >
            <Text style={styles.viewRoutineLabel}>{t('home.viewFullRoutine')}</Text>
          </Pressable>
        </Reveal>

        <Reveal index={4} style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <MaterialCommunityIcons name="water" size={20} color={colors.primary} />
          </View>
          <View style={styles.insightBody}>
            <Text style={styles.insightTitle}>{t('home.weeklyInsight')}</Text>
            <Text style={styles.insightText}>{weeklyInsight}</Text>
          </View>
        </Reveal>

        <CommunityReviewsSection revealIndex={5} maxItems={4} carouselInset={false} />

        <Reveal index={6} style={styles.learnHeader}>
          <Text style={styles.learnTitle}>{t('home.learnTitle')}</Text>
          <Pressable onPress={() => navigation.navigate('ScienceLibrary')}>
            <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
          </Pressable>
        </Reveal>
        <Reveal index={7}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.learnScroll}
        >
          {articles.map((article) => (
            <PressableScale
              key={article.id}
              style={[styles.articleCard, { width: articleWidth }]}
              haptic="light"
              onPress={() => navigation.navigate('ArticleReader', { articleId: article.id })}
            >
              <View style={styles.articleIcon}>
                <MaterialCommunityIcons name={article.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.articleBody}>
                <View style={styles.articleTags}>
                  <View
                    style={[
                      styles.articleTag,
                      article.tagBg === 'accentLight' ? styles.tagAccent : styles.tagPrimary,
                    ]}
                  >
                    <Text
                      style={[
                        styles.articleTagText,
                        article.tagBg === 'accentLight' && styles.articleTagTextAccent,
                      ]}
                    >
                      {article.tag}
                    </Text>
                  </View>
                  <Text style={styles.readTime}>{article.readTime}</Text>
                </View>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              </View>
            </PressableScale>
          ))}
        </ScrollView>
        </Reveal>
      </ScrollView>
    </View>
  );
}

function RoutineCheckRow({
  step,
  done,
  onToggle,
}: {
  step: HomeRoutineStep;
  done: boolean;
  onToggle: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <PressableScale
      style={[styles.checkRow, done && styles.checkRowDone]}
      onPress={onToggle}
      haptic="selection"
      pressedScale={0.99}
    >
      <MaterialCommunityIcons
        name={done ? 'check-circle' : 'circle-outline'}
        size={24}
        color={done ? colors.primary : colors.textTertiary}
      />
      <Text style={[styles.checkLabel, done && styles.checkLabelDone]} numberOfLines={2}>
        {step.name}
      </Text>
    </PressableScale>
  );
}
