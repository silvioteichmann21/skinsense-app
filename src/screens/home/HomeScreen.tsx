import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
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

import { SkinScoreRing } from '@/components/report/SkinScoreRing';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useHomeArticles } from '@/i18n/content/useLocalizedContent';
import { useHomeMorningRoutine } from '@/hooks/useHomeMorningRoutine';
import { useHomeWeeklyInsight } from '@/hooks/useHomeWeeklyInsight';
import { useTranslation } from '@/i18n/useTranslation';
import { useHomeHeaderDate } from '@/i18n/useFormattedDate';
import { useHomeScanSummary } from '@/hooks/useHomeScanSummary';
import {
  HOME_DISPLAY_NAME,
  HOME_STREAK_DAYS,
} from '@/screens/home/homeMockData';
import type { HomeRoutineStep } from '@/hooks/useHomeMorningRoutine';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

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

export function HomeScreen() {
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

  const openScan = useCallback(() => {
    navigation.navigate('ScanGuide');
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.base }]}>
        <ScreenBackButton style={styles.backBtn} />
        <View style={styles.topBarCenter}>
          <Text style={styles.greeting}>
            {greeting}, {HOME_DISPLAY_NAME} ☀️
          </Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <View style={styles.topActions}>
          <View style={styles.streakBadge}>
            <MaterialCommunityIcons name="fire" size={14} color={colors.accent} />
            <Text style={styles.streakText}>
              {t('home.streak', { count: HOME_STREAK_DAYS })}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.notifications')}
            style={styles.bellBtn}
            onPress={() => Alert.alert(t('common.notifications'), t('common.notificationsSoon'))}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreLabel}>{t('home.skinHealthScore')}</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreBig}>
                {scanSummary.hasScan && scanSummary.score !== null
                  ? scanSummary.score
                  : '—'}
              </Text>
              {scanSummary.deltaLabel ? (
                <Text style={styles.scoreDelta}>{scanSummary.deltaLabel}</Text>
              ) : null}
            </View>
            <Text style={styles.lastScan}>{scanSummary.lastScanLabel}</Text>
            <Pressable style={styles.scanBtn} onPress={openScan}>
              <MaterialCommunityIcons name="image-filter-center-focus" size={18} color={colors.textInverse} />
              <Text style={styles.scanBtnLabel}>
                {scanSummary.hasScan ? t('home.scanNow') : t('home.firstScan')}
              </Text>
            </Pressable>
          </View>
          {scanSummary.hasScan && scanSummary.score !== null ? (
            <SkinScoreRing score={scanSummary.score} size={96} />
          ) : (
            <View style={styles.scoreRingPlaceholder}>
              <MaterialCommunityIcons name="camera-outline" size={36} color={colors.primaryPale} />
            </View>
          )}
        </View>

        <View style={styles.quickActions}>
          {(
            [
              { key: 'scan', label: t('home.quickScan'), icon: 'qrcode-scan' as const, onPress: openScan },
              {
                key: 'products',
                label: t('home.quickProducts'),
                icon: 'auto-fix' as const,
                onPress: () => navigation.navigate('Products'),
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
                onPress: () => navigation.navigate('AIChat'),
              },
            ] as const
          ).map((action) => (
            <Pressable key={action.key} style={styles.quickAction} onPress={action.onPress}>
              <View style={styles.quickIconWrap}>
                <MaterialCommunityIcons name={action.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View>
              <Text style={styles.routineTitle}>{t('home.morningRoutine')}</Text>
              <Text style={styles.routineProgress}>
                {t('home.stepsComplete', { done: doneCount, total: totalSteps })}
              </Text>
            </View>
            <View style={styles.miniTrack}>
              <View style={[styles.miniFill, { width: `${progressPct}%` }]} />
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
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <MaterialCommunityIcons name="water" size={22} color={colors.primary} />
          </View>
          <View style={styles.insightBody}>
            <Text style={styles.insightTitle}>{t('home.weeklyInsight')}</Text>
            <Text style={styles.insightText}>{weeklyInsight}</Text>
          </View>
        </View>

        <View style={styles.learnHeader}>
          <Text style={styles.learnTitle}>{t('home.learnTitle')}</Text>
          <Pressable
            onPress={() => Alert.alert(t('home.articlesTitle'), t('home.articleSoon'))}
          >
            <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.learnScroll}
        >
          {articles.map((article) => (
            <Pressable
              key={article.id}
              style={styles.articleCard}
              onPress={() => Alert.alert(article.title, t('home.articleSoon'))}
            >
              <Image source={{ uri: article.imageUri }} style={styles.articleImage} contentFit="cover" />
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
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.communityCard}>
          <View style={styles.communityBlurContent}>
            <Text style={styles.communityTitle}>{t('home.communityTitle')}</Text>
            <Text style={styles.communityBody}>{t('home.communityBody')}</Text>
          </View>
          <BlurView intensity={20} style={styles.communityOverlay} tint="light">
            <View style={styles.comingSoonPill}>
              <Text style={styles.comingSoonText}>{t('home.communitySoon')}</Text>
            </View>
          </BlurView>
        </View>
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
  return (
    <Pressable
      style={[styles.checkRow, done && styles.checkRowDone]}
      onPress={onToggle}
    >
      <MaterialCommunityIcons
        name={done ? 'check-circle' : 'circle-outline'}
        size={24}
        color={done ? colors.primary : colors.textTertiary}
      />
      <Text style={[styles.checkLabel, done && styles.checkLabelDone]}>{step.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  backBtn: {
    marginTop: 2,
  },
  topBarCenter: {
    flex: 1,
    minWidth: 0,
  },
  greeting: {
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
    color: colors.primaryDark,
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
    paddingHorizontal: spacing.base,
    gap: spacing.xl,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  scoreRingPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  scoreLabel: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 10,
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
    color: colors.primary,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
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
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: '#F1F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textPrimary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  routineCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
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
    height: 4,
    backgroundColor: '#F1F3FF',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  checkRowDone: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primaryPale,
  },
  checkLabel: {
    ...typography.bodyLg,
    color: colors.textPrimary,
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
    ...typography.label,
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
    letterSpacing: 1.2,
  },
  insightCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primaryPale,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBody: {
    flex: 1,
  },
  insightTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  insightText: {
    ...typography.body,
    color: colors.primaryDark,
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
  learnTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  learnScroll: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  articleCard: {
    width: 288,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F1F3FF',
  },
  articleBody: {
    padding: spacing.lg,
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
    backgroundColor: colors.primaryPale,
  },
  tagAccent: {
    backgroundColor: colors.accentLight,
  },
  articleTagText: {
    fontSize: 10,
    fontFamily: typography.h3.fontFamily,
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  articleTagTextAccent: {
    color: '#783D01',
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
  communityCard: {
    borderRadius: radius.lg,
    backgroundColor: '#F1F3FF',
    borderWidth: 1,
    borderColor: colors.borderMuted,
    overflow: 'hidden',
    minHeight: 120,
    marginBottom: spacing.md,
  },
  communityBlurContent: {
    padding: spacing.xl,
    opacity: 0.35,
  },
  communityTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  communityBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  communityOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonPill: {
    backgroundColor: 'rgba(20, 27, 43, 0.85)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  comingSoonText: {
    ...typography.label,
    color: colors.textInverse,
    letterSpacing: 0.8,
  },
});
