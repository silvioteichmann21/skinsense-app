import { Pressable, StyleSheet, Text, View } from 'react-native';

import { goalOptions } from '@/screens/onboarding/quiz/quizSteps';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  selected: string[];
  maxSelect?: number;
  onToggle: (id: string) => void;
  onLimitReached?: () => void;
};

export function SkinGoalChips({
  selected,
  maxSelect = 3,
  onToggle,
  onLimitReached,
}: Props) {
  return (
    <View style={styles.wrap}>
      {goalOptions.map((goal) => {
        const active = selected.includes(goal.id);
        return (
          <Pressable
            key={goal.id}
            onPress={() => {
              if (active) {
                onToggle(goal.id);
                return;
              }
              if (selected.length >= maxSelect) {
                onLimitReached?.();
                return;
              }
              onToggle(goal.id);
            }}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{goal.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  chip: {
    height: 36,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  chipPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
});
