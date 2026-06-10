import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoutineStepCard } from '@/components/routine/RoutineStepCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TabScreenHeader } from '@/components/ui/TabScreenHeader';
import {
  getCompletedStepIds,
  toggleStepCompleted,
  type RoutinePeriod,
} from '@/core/storage/routinePreferences';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useLocalizedRoutineSteps } from '@/i18n/content/useLocalizedRoutine';
import { useActivityStats } from '@/hooks/useActivityStats';
import { syncRoutineActivity } from '@/utils/syncRoutineActivity';
import { useRoutineStore } from '@/store/routineStore';
import type { AppColors } from '@/theme/palettes';
import { layout, radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Routine'>,
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
    gap: layout.sectionGap,
  },
  streakCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: layout.listCardRadius,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.hairline,
    ...shadows.md,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
  },
  streakPct: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.ctaGradientStart,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.ctaTint,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  completeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceAlt,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.ctaTint,
  },
  completeText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  stepList: {
    gap: spacing.md,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.ctaGradientMid,
    borderRadius: radius.full,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  editLabel: {
    ...typography.h3,
    color: colors.ctaGradientStart,
  },
});
}

export function RoutineScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<RoutinePeriod>('morning');
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const storedRoutine = useRoutineStore((s) => s.routine);
  const { streakDays } = useActivityStats();

  const steps = useLocalizedRoutineSteps(period, storedRoutine);
  const doneCount = steps.filter((s) => completed.has(s.id)).length;
  const progressPct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;
  const allDone = doneCount === steps.length && steps.length > 0;

  const reloadCompleted = useCallback(async () => {
    const ids = await getCompletedStepIds(period);
    setCompleted(ids);
  }, [period]);

  useEffect(() => {
    reloadCompleted();
  }, [reloadCompleted]);

  useFocusEffect(
    useCallback(() => {
      reloadCompleted();
    }, [reloadCompleted]),
  );

  const openStep = (stepId: string, stepIndex: number) => {
    navigation.navigate('RoutineStep', { stepId, period, stepIndex });
  };

  const handleToggle = async (stepId: string) => {
    await toggleStepCompleted(period, stepId);
    await reloadCompleted();
    await syncRoutineActivity();
  };

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />

      <TabScreenHeader
        topInset={insets.top + spacing.sm}
        title={t('tabs.routine')}
        right={
          <Pressable
            accessibilityLabel={t('common.notifications')}
            onPress={() => navigation.navigate('Notifications')}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textSecondary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <SegmentedControl
          options={[
            { id: 'morning' as const, label: t('routine.morning') },
            { id: 'evening' as const, label: t('routine.evening') },
          ]}
          value={period}
          onChange={setPeriod}
        />

        <View style={styles.streakCard}>
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakTitle}>
              {t('routine.streakDays', { days: streakDays })}
            </Text>
            <Text style={styles.streakPct}>
              {t('routine.percentComplete', { percent: progressPct })}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
              locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.progressFill, { width: `${progressPct}%` }]}
            />
          </View>
        </View>

        {allDone ? (
          <View style={styles.completeBanner}>
            <MaterialCommunityIcons name="party-popper" size={22} color={colors.ctaGradientStart} />
            <Text style={styles.completeText}>
              {t('routine.completeBanner', {
                period: period === 'morning' ? t('routine.morning') : t('routine.evening'),
              })}
            </Text>
          </View>
        ) : null}

        <View style={styles.stepList}>
          {steps.map((step, index) => (
            <RoutineStepCard
              key={step.id}
              step={step}
              index={index}
              completed={completed.has(step.id)}
              onPressCard={() => openStep(step.id, index)}
              onToggleComplete={() => handleToggle(step.id)}
            />
          ))}
        </View>

        <Pressable
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditRoutine')}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primary} />
          <Text style={styles.editLabel}>{t('routine.editRoutine')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
