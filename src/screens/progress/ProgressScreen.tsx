import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { useScanPhotoTimeline } from '@/hooks/useScanPhotoTimeline';
import {
  CONCERN_TRENDS,
  MILESTONES,
  SCORE_BY_PERIOD,
  WEEKLY_DIGEST,
  type TrendPeriod,
} from '@/screens/progress/progressMockData';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

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

export function ProgressScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<TrendPeriod>('30d');
  const trend = SCORE_BY_PERIOD[period];
  const photoTimeline = useScanPhotoTimeline();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenBackButton />
        <Text style={styles.headerTitle}>{t('progress.title')}</Text>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-circle" size={28} color={colors.primary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.digest}>
          <MaterialCommunityIcons
            name="auto-fix"
            size={72}
            color={colors.primaryPale}
            style={styles.digestWatermark}
          />
          <View style={styles.digestContent}>
            <View style={styles.digestLabelRow}>
              <MaterialCommunityIcons name="brain" size={16} color={colors.primaryPale} />
              <Text style={styles.digestLabel}>{t('progress.weeklyDigest')}</Text>
            </View>
            <Text style={styles.digestBody}>{t('progress.digestBody')}</Text>
            <View style={styles.digestBarRow}>
              <View style={styles.digestTrack}>
                <View
                  style={[
                    styles.digestFill,
                    { width: `${WEEKLY_DIGEST.adherencePercent}%` },
                  ]}
                />
              </View>
              <Text style={styles.digestDelta}>{t('progress.digestDelta')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{t('progress.scoreTrend')}</Text>
            <View style={styles.periodToggle}>
              {PERIODS.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => setPeriod(p.id)}
                  style={[styles.periodBtn, period === p.id && styles.periodBtnActive]}
                >
                  <Text style={[styles.periodText, period === p.id && styles.periodTextActive]}>
                    {t(p.labelKey)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <ScoreTrendChart current={trend.current} points={trend.points} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('progress.concernTrends')}</Text>
          <View style={styles.concernList}>
            {CONCERN_TRENDS.map((c) => (
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
        </View>

        <View style={styles.section}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('progress.milestonesTitle')}</Text>
          <View style={styles.milestoneGrid}>
            {MILESTONES.map((m) => (
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  avatar: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
    borderWidth: 1,
    borderColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scroll: {
    paddingHorizontal: spacing.lg,
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
    color: colors.primaryPale,
    letterSpacing: 2,
  },
  digestBody: {
    ...typography.bodyLg,
    color: colors.primaryPale,
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
    backgroundColor: 'rgba(27, 67, 50, 0.35)',
    overflow: 'hidden',
  },
  digestFill: {
    height: '100%',
    backgroundColor: '#B1F0CE',
    borderRadius: radius.full,
  },
  digestDelta: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.primaryPale,
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
    backgroundColor: '#E9EDFF',
    borderRadius: radius.md,
    padding: 4,
    gap: 2,
  },
  periodBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  periodBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  periodText: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 11,
  },
  periodTextActive: {
    color: colors.primary,
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
});
