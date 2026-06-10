import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import type { EnrichedRoutineStep } from '@/screens/routine/routineStepContent';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  step: EnrichedRoutineStep;
  index: number;
  completed: boolean;
  onPressCard: () => void;
  onToggleComplete: () => void;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    ...shadows.sm,
  },
  leftCol: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDone: {
    backgroundColor: colors.surfaceAlt,
  },
  duration: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textTertiary,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.primaryDark,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.switchTrackOff,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.ctaGradientMid,
    borderColor: colors.ctaGradientStart,
  },
  ingredientFocus: {
    ...typography.body,
    color: colors.ctaGradientStart,
    fontFamily: typography.h3.fontFamily,
    marginTop: spacing.xs,
  },
  whyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  whyRowDone: {
    backgroundColor: colors.surfaceAlt,
  },
  whyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
}

export function RoutineStepCard({
  step,
  index,
  completed,
  onPressCard,
  onToggleComplete,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <PressableScale style={styles.card} onPress={onPressCard} haptic="light">

      <View style={styles.leftCol}>
        <View style={[styles.iconWrap, completed && styles.iconWrapDone]}>
          <MaterialCommunityIcons
            name={step.icon}
            size={22}
            color={completed ? colors.primary : colors.textTertiary}
          />
        </View>
        <Text style={styles.duration}>{step.duration}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            {index + 1}. {step.name}
          </Text>
          <Pressable
            onPress={onToggleComplete}
            hitSlop={12}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: completed }}
            accessibilityLabel={
              completed
                ? t('routine.markIncomplete', { name: step.name })
                : t('routine.markComplete', { name: step.name })
            }
          >
            <View style={[styles.checkbox, completed && styles.checkboxDone]}>
              {completed ? (
                <MaterialCommunityIcons name="check" size={18} color={colors.textInverse} />
              ) : null}
            </View>
          </Pressable>
        </View>
        <Text style={styles.ingredientFocus}>{step.ingredientFocus}</Text>
        <View style={[styles.whyRow, completed && styles.whyRowDone]}>
          <MaterialCommunityIcons name={step.whyIcon} size={16} color={colors.textSecondary} />
          <Text style={styles.whyText}>{step.whyHint}</Text>
        </View>
      </View>
    </PressableScale>
  );
}
