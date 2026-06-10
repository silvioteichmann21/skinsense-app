import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConcernTrendRow } from '@/components/progress/ConcernTrendRow';
import { MilestoneCard } from '@/components/progress/MilestoneCard';
import { PhotoTimelineCard } from '@/components/progress/PhotoTimelineCard';
import { ScoreTrendChart } from '@/components/progress/ScoreTrendChart';
import { Reveal } from '@/components/ui/Reveal';
import { TabScreenHeader } from '@/components/ui/TabScreenHeader';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { useScanPhotoTimeline } from '@/hooks/useScanPhotoTimeline';
import { useProgressMetrics } from '@/hooks/useProgressMetrics';
import type { TrendPeriod } from '@/screens/progress/progressMockData';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

const PERIODS: { id: TrendPeriod; labelKey: TranslationKey }[] = [
  { id: '30d', labelKey: 'progress.period30' },
  { id: '90d', labelKey: 'progress.period90' },
  { id: '180d', labelKey: 'progress.period180' },
];

const CONCERN_NAME_KEYS: Record<string, TranslationKey> = {
  hydration: 'progress.concerns.hydration',
  acne: 'progress.concerns.acne',
  texture: 'progress.concerns.texture',
  redness: 'progress.concerns.redness',
};

const STATUS_KEYS: Record<string, TranslationKey> = {
  Optimal: 'progress.status.optimal',
  Calming: 'progress.status.calming',
  'Needs Focus': 'progress.status.needsFocus',
  Improving: 'progress.status.improving',
};

const MILESTONE_LABEL_KEYS: Record<string, TranslationKey> = {
  m1: 'progress.milestoneLabels.sevenDay',
  m2: 'progress.milestoneLabels.firstScan',
  m3: 'progress.milestoneLabels.thirtyDay',
  m4: 'progress.milestoneLabels.score75',
};

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Progress'>,
  NativeStackNavigationProp<RootStackParamList>
>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
  },
  digest: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  digestWatermark: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    opacity: 0.2,
  },
  digestContent: {
    zIndex: 1,
  },
  digestLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  digestLabel: {
    ...typography.label,
    color: colors.onPrimaryContainerMuted,
    letterSpacing: 2,
  },
  digestBody: {
    ...typography.bodyLg,
    color: colors.onPrimaryContainer,
    marginBottom: spacing.lg,
  },
  digestBold: {
    fontFamily: typography.h3.fontFamily,
  },
  digestBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  digestTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainerTrack,
    overflow: 'hidden',
  },
  digestFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  digestDelta: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.onPrimaryContainerMuted,
  },
  section: {
    gap: spacing.lg,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: colors.periodTrack,
    borderRadius: radius.full,
    padding: 3,
    gap: 2,
  },
  periodBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  periodBtnActive: {
    ...shadows.sm,
  },
  periodText: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 11,
  },
  periodTextActive: {
    color: colors.textInverse,
    fontFamily: typography.h3.fontFamily,
  },
  concernList: {
    gap: spacing.md,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'none',
  },
  timelineScroll: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  milestoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  emptyHint: {
    ...typography.body,
    color: colors.textSecondary,
    paddingVertical: spacing.lg,
  },
});
}

export function ProgressScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<TrendPeriod>('30d');
  const { hasScans, scoreTrend, concernTrends, milestones, weeklyDigest } =
    useProgressMetrics(period);
  const photoTimeline = useScanPhotoTimeline();

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <TabScreenHeader topInset={insets.top + spacing.sm} title={t('progress.title')} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Reveal index={0} style={styles.digest}>
          <MaterialCommunityIcons
            name="auto-fix"
            size={72}
            color={colors.onPrimaryContainerMuted}
            style={styles.digestWatermark}
          />
          <View style={styles.digestContent}>
            <View style={styles.digestLabelRow}>
              <MaterialCommunityIcons name="brain" size={16} color={colors.onPrimaryContainerMuted} />
              <Text style={styles.digestLabel}>{t('progress.weeklyDigest')}</Text>
            </View>
            <Text style={styles.digestBody}>{weeklyDigest.body}</Text>
            <View style={styles.digestBarRow}>
              <View style={styles.digestTrack}>
                <LinearGradient
                  colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
                  locations={[0, 0.48, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[
                    styles.digestFill,
                    { width: `${weeklyDigest.adherencePercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.digestDelta}>{weeklyDigest.deltaLabel}</Text>
            </View>
          </View>
        </Reveal>

        <Reveal index={1} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{t('progress.scoreTrend')}</Text>
            <View style={styles.periodToggle}>
              {PERIODS.map((p) => {
                const active = period === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setPeriod(p.id)}
                    style={[styles.periodBtn, active && styles.periodBtnActive]}
                  >
                    {active ? (
                      <LinearGradient
                        colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
                        locations={[0, 0.48, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.xs,
                          borderRadius: radius.full,
                        }}
                      >
                        <Text style={[styles.periodText, styles.periodTextActive]}>
                          {t(p.labelKey)}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.periodText}>{t(p.labelKey)}</Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
          {hasScans ? (
            <ScoreTrendChart current={scoreTrend.current} points={scoreTrend.points} />
          ) : (
            <Text style={styles.emptyHint}>{t('progress.noScansBody')}</Text>
          )}
        </Reveal>

        <Reveal index={2} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('progress.concernTrends')}</Text>
          <View style={styles.concernList}>
            {concernTrends.map((c) => (
              <ConcernTrendRow
                key={c.id}
                concern={{
                  ...c,
                  name: t(CONCERN_NAME_KEYS[c.id] ?? 'progress.concerns.hydration'),
                  status: t(STATUS_KEYS[c.status] ?? 'progress.status.improving'),
                }}
              />
            ))}
          </View>
        </Reveal>

        <Reveal index={3} style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{t('progress.photoTimeline')}</Text>
            <Pressable
              style={styles.viewAll}
              onPress={() => navigation.navigate('Compare')}
            >
              <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color={colors.primary} />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timelineScroll}
          >
            {photoTimeline.map((photo) => (
              <PhotoTimelineCard key={photo.id} photo={photo} />
            ))}
          </ScrollView>
        </Reveal>

        <Reveal index={4} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('progress.milestonesTitle')}</Text>
          <View style={styles.milestoneGrid}>
            {milestones.map((m) => (
              <MilestoneCard
                key={m.id}
                milestone={{
                  ...m,
                  label: MILESTONE_LABEL_KEYS[m.id] ? t(MILESTONE_LABEL_KEYS[m.id]) : m.label,
                }}
                onPress={() => {
                  if (!m.unlocked) {
                    Alert.alert(
                      MILESTONE_LABEL_KEYS[m.id] ? t(MILESTONE_LABEL_KEYS[m.id]) : m.label,
                      t('progress.milestoneLocked'),
                    );
                  }
                }}
              />
            ))}
          </View>
        </Reveal>
      </ScrollView>
    </View>
  );
}
