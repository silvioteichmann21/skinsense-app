import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import type { RoutinePeriod } from '@/core/storage/routinePreferences';
import { loadQuizAnswers } from '@/core/storage/quizStorage';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import {
  generatePersonalizedRoutine,
  getRoutineStepDef,
  getStepDefsForPeriod,
} from '@/services/routine/routineGenerator';
import { useRoutineStore } from '@/store/routineStore';
import { useSkinStore } from '@/store/skinStore';
import type { PersonalizedRoutine, RoutineStep } from '@/types/routine';
import { EVENING_STEPS, MORNING_STEPS } from '@/types/routine';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'EditRoutine'>;

type EditorRow = {
  step: RoutineStep;
  enabled: boolean;
};

function stepKey(stepId: string): string {
  return stepId.replace(/-/g, '');
}

function localizeStep(
  step: RoutineStep,
  t: (key: TranslationKey, params?: Record<string, string | number | undefined>) => string,
): { name: string; category: string } {
  const key = stepKey(step.id);
  const nameKey = `routine.steps.${key}.name` as TranslationKey;
  const categoryKey = `routine.steps.${key}.category` as TranslationKey;
  const name = t(nameKey);
  const category = t(categoryKey);
  return {
    name: name === nameKey ? step.name : name,
    category: category === categoryKey ? step.category : category,
  };
}

function toEditorRows(steps: RoutineStep[]): EditorRow[] {
  return steps.map((step) => ({ step, enabled: true }));
}

function rowsToSteps(rows: EditorRow[]): RoutineStep[] {
  return rows.filter((row) => row.enabled).map((row) => row.step);
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      gap: spacing.lg,
    },
    segment: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceMuted,
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
    list: {
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    rowDisabled: {
      opacity: 0.55,
    },
    dragCol: {
      gap: spacing.xs,
    },
    iconBtn: {
      width: 32,
      height: 32,
      borderRadius: radius.sm,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBtnDisabled: {
      opacity: 0.35,
    },
    rowBody: {
      flex: 1,
      gap: 2,
    },
    rowName: {
      ...typography.body,
      color: colors.textPrimary,
      fontFamily: typography.h3.fontFamily,
    },
    rowCategory: {
      ...typography.caption,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    textBtn: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    textBtnLabel: {
      ...typography.body,
      color: colors.primary,
      fontFamily: typography.h3.fontFamily,
    },
    resetBtn: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.sm,
    },
    resetLabel: {
      ...typography.body,
      color: colors.accent,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.borderMuted,
      overflow: 'hidden',
    },
    saveBtn: {
      width: '100%',
    },
    saveText: {
      ...typography.h3,
      color: colors.textInverse,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: colors.scrim,
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      maxHeight: '70%',
    },
    modalTitle: {
      ...typography.h3,
      color: colors.primary,
      marginBottom: spacing.md,
    },
    pickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderMuted,
    },
    pickerName: {
      ...typography.body,
      color: colors.textPrimary,
    },
    pickerCategory: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    modalClose: {
      marginTop: spacing.md,
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    modalCloseText: {
      ...typography.body,
      color: colors.textSecondary,
    },
  });
}

export function EditRoutineScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle, blurTint } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const storedRoutine = useRoutineStore((s) => s.routine);
  const saveRoutine = useRoutineStore((s) => s.saveRoutine);
  const latestAnalysis = useSkinStore((s) => s.latestAnalysis);

  const [period, setPeriod] = useState<RoutinePeriod>('morning');
  const [subtitle, setSubtitle] = useState('');
  const [morningRows, setMorningRows] = useState<EditorRow[]>([]);
  const [eveningRows, setEveningRows] = useState<EditorRow[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const base: PersonalizedRoutine = storedRoutine ?? {
      subtitle: '',
      morning: MORNING_STEPS,
      evening: EVENING_STEPS,
    };
    setSubtitle(base.subtitle);
    setMorningRows(toEditorRows(base.morning));
    setEveningRows(toEditorRows(base.evening));
  }, [storedRoutine]);

  const currentRows = period === 'morning' ? morningRows : eveningRows;
  const setCurrentRows = period === 'morning' ? setMorningRows : setEveningRows;

  const canSave = useMemo(
    () =>
      morningRows.some((row) => row.enabled) && eveningRows.some((row) => row.enabled),
    [morningRows, eveningRows],
  );

  const availableToAdd = useMemo(() => {
    const existing = new Set(currentRows.map((row) => row.step.id));
    return getStepDefsForPeriod(period).filter((step) => !existing.has(step.id));
  }, [currentRows, period]);

  const moveRow = useCallback(
    (index: number, direction: -1 | 1) => {
      setCurrentRows((rows) => {
        const next = [...rows];
        const target = index + direction;
        if (target < 0 || target >= next.length) return rows;
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });
    },
    [setCurrentRows],
  );

  const toggleRow = useCallback(
    (index: number, enabled: boolean) => {
      setCurrentRows((rows) =>
        rows.map((row, i) => (i === index ? { ...row, enabled } : row)),
      );
    },
    [setCurrentRows],
  );

  const addStep = useCallback(
    (stepId: string) => {
      const def = getRoutineStepDef(stepId);
      if (!def) return;
      setCurrentRows((rows) => [...rows, { step: def, enabled: true }]);
      setShowPicker(false);
    },
    [setCurrentRows],
  );

  const handleReset = useCallback(() => {
    Alert.alert(t('routine.resetConfirmTitle'), t('routine.resetConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('routine.resetConfirmAction'),
        style: 'destructive',
        onPress: async () => {
          if (!latestAnalysis) {
            Alert.alert(t('routine.resetToAi'), t('routine.editNeedScan'));
            return;
          }
          const quiz = await loadQuizAnswers();
          const ai = generatePersonalizedRoutine(latestAnalysis, quiz);
          setSubtitle(ai.subtitle);
          setMorningRows(toEditorRows(ai.morning));
          setEveningRows(toEditorRows(ai.evening));
        },
      },
    ]);
  }, [latestAnalysis, t]);

  const handleSave = useCallback(async () => {
    if (morningRows.filter((r) => r.enabled).length === 0) {
      Alert.alert(t('routine.editRoutineTitle'), t('routine.editNeedStep'));
      return;
    }
    if (eveningRows.filter((r) => r.enabled).length === 0) {
      Alert.alert(t('routine.editRoutineTitle'), t('routine.editNeedStep'));
      return;
    }

    setSaving(true);
    try {
      await saveRoutine({
        subtitle,
        morning: rowsToSteps(morningRows),
        evening: rowsToSteps(eveningRows),
      });
      Alert.alert(t('routine.editSaved'), t('routine.editSavedMessage'), [
        { text: t('common.ok'), onPress: () => navigation.goBack() },
      ]);
    } finally {
      setSaving(false);
    }
  }, [eveningRows, morningRows, navigation, saveRoutine, subtitle, t]);

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('routine.editRoutineTitle')} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + touchTarget + spacing.xxl * 2 },
        ]}
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

        <View style={styles.list}>
          {currentRows.map((row, index) => {
            const { name, category } = localizeStep(row.step, t);
            return (
              <View
                key={row.step.id}
                style={[styles.row, !row.enabled && styles.rowDisabled]}
              >
                <View style={styles.dragCol}>
                  <Pressable
                    style={[styles.iconBtn, index === 0 && styles.iconBtnDisabled]}
                    disabled={index === 0}
                    accessibilityLabel={t('routine.moveStepUp')}
                    onPress={() => moveRow(index, -1)}
                  >
                    <MaterialCommunityIcons
                      name="chevron-up"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.iconBtn,
                      index === currentRows.length - 1 && styles.iconBtnDisabled,
                    ]}
                    disabled={index === currentRows.length - 1}
                    accessibilityLabel={t('routine.moveStepDown')}
                    onPress={() => moveRow(index, 1)}
                  >
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>

                <View style={styles.rowBody}>
                  <Text style={styles.rowName}>{name}</Text>
                  <Text style={styles.rowCategory}>{category}</Text>
                </View>

                <Switch
                  value={row.enabled}
                  onValueChange={(value) => toggleRow(index, value)}
                  trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                  thumbColor={colors.white}
                  ios_backgroundColor={colors.switchTrackOff}
                  accessibilityLabel={
                    row.enabled
                      ? t('routine.stepDisabled', { name })
                      : t('routine.stepEnabled', { name })
                  }
                />
              </View>
            );
          })}
        </View>

        {availableToAdd.length > 0 ? (
          <Pressable style={styles.textBtn} onPress={() => setShowPicker(true)}>
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.textBtnLabel}>{t('routine.addStep')}</Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetLabel}>{t('routine.resetToAi')}</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <BlurView intensity={72} tint={blurTint} style={StyleSheet.absoluteFill} />
        <GradientButton
          style={styles.saveBtn}
          disabled={saving || !canSave}
          onPress={() => void handleSave()}
        >
          <Text style={styles.saveText}>{t('routine.saveChanges')}</Text>
        </GradientButton>
      </View>

      <Modal visible={showPicker} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPicker(false)}>
          <Pressable
            style={[styles.modalSheet, { paddingBottom: insets.bottom + spacing.lg }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>{t('routine.pickStepTitle')}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {availableToAdd.map((step) => {
                const { name, category } = localizeStep(step, t);
                return (
                  <Pressable key={step.id} style={styles.pickerRow} onPress={() => addStep(step.id)}>
                    <View>
                      <Text style={styles.pickerName}>{name}</Text>
                      <Text style={styles.pickerCategory}>{category}</Text>
                    </View>
                    <MaterialCommunityIcons name="plus" size={22} color={colors.primary} />
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable style={styles.modalClose} onPress={() => setShowPicker(false)}>
              <Text style={styles.modalCloseText}>{t('common.cancel')}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
