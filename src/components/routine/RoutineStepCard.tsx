import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { EnrichedRoutineStep } from '@/screens/routine/routineStepContent';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  step: EnrichedRoutineStep;
  index: number;
  completed: boolean;
  onPressCard: () => void;
  onToggleComplete: () => void;
};

export function RoutineStepCard({
  step,
  index,
  completed,
  onPressCard,
  onToggleComplete,
}: Props) {
  const { t } = useTranslation();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPressCard}
    >
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
        <Text style={styles.productRec}>{step.productRec}</Text>
        <View style={[styles.whyRow, completed && styles.whyRowDone]}>
          <MaterialCommunityIcons name={step.whyIcon} size={16} color={colors.textSecondary} />
          <Text style={styles.whyText}>{step.whyHint}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    ...shadows.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  leftCol: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: '#F1F3FF',
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
    borderColor: '#BFC9C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  productRec: {
    ...typography.body,
    color: colors.primary,
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
    backgroundColor: '#F1F3FF',
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
