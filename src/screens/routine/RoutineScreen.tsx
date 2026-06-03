import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import {
  getCompletedStepIds,
  toggleStepCompleted,
  type RoutinePeriod,
} from '@/core/storage/routinePreferences';
import type { MainTabParamList, RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getRoutineSteps,
  ROUTINE_STREAK_DAYS,
} from '@/screens/routine/routineStepContent';
import { useRoutineStore } from '@/store/routineStore';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Routine'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function RoutineScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<RoutinePeriod>('morning');
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const storedRoutine = useRoutineStore((s) => s.routine);

  const steps = getRoutineSteps(period, storedRoutine);
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
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenBackButton />
        <Text style={styles.headerTitle}>{t('common.brand')}</Text>
        <Pressable
          style={styles.bellBtn}
          accessibilityLabel={t('common.notifications')}
          onPress={() => Alert.alert(t('common.notifications'), t('common.notificationsSoon'))}
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.segment}>
          <Pressable
            style={[styles.segmentBtn, period === 'morning' && styles.segmentBtnActive]}
            onPress={() => setPeriod('morning')}
          >
            <Text style={[styles.segmentLabel, period === 'morning' && styles.segmentLabelActive]}>
              {t('routine.morning')}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.segmentBtn, period === 'evening' && styles.segmentBtnActive]}
            onPress={() => setPeriod('evening')}
          >
            <Text style={[styles.segmentLabel, period === 'evening' && styles.segmentLabelActive]}>
              {t('routine.evening')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakTitle}>
              {t('routine.streakDays', { days: ROUTINE_STREAK_DAYS })}
            </Text>
            <Text style={styles.streakPct}>
              {t('routine.percentComplete', { percent: progressPct })}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        {allDone ? (
          <View style={styles.completeBanner}>
            <MaterialCommunityIcons name="party-popper" size={22} color={colors.primary} />
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
          onPress={() => Alert.alert(t('routine.editRoutine'), t('routine.editRoutineSoon'))}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.primary} />
          <Text style={styles.editLabel}>{t('routine.editRoutine')}</Text>
        </Pressable>
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
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  bellBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: spacing.base,
    gap: spacing.xl,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#F1F3FF',
    borderRadius: radius.lg,
    padding: spacing.xs,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  segmentLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  segmentLabelActive: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
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
    color: colors.primaryDark,
    flex: 1,
  },
  streakPct: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.primaryPale,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  completeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceAlt,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryPale,
  },
  completeText: {
    ...typography.body,
    color: colors.primaryDark,
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
    borderColor: colors.primary,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  editLabel: {
    ...typography.h3,
    color: colors.primary,
  },
});
