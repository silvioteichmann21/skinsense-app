import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { goalOptions } from '@/screens/onboarding/quiz/quizSteps';
import type { BentoOption } from '@/screens/onboarding/quiz/quizSteps';
import type { AppColors } from '@/theme/palettes';
import { ctaGlow, radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  selected: string[];
  options?: BentoOption[];
  maxSelect?: number;
  onToggle: (id: string) => void;
  onLimitReached?: () => void;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    chip: {
      minHeight: 38,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.chipNeutralBg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    chipActive: {
      borderColor: 'transparent',
      ...ctaGlow(colors.ctaGlow, 'md'),
    },
    chipPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    chipGradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.full,
    },
    chipText: {
      ...typography.body,
      color: colors.chipNeutralText,
    },
    chipTextActive: {
      color: colors.onPrimary,
      fontFamily: typography.h3.fontFamily,
    },
  });
}

export function SkinGoalChips({
  selected,
  options = goalOptions,
  maxSelect = 3,
  onToggle,
  onLimitReached,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrap}>
      {options.map((goal) => {
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
            {active ? (
              <LinearGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
                locations={[0, 0.48, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.chipGradient}
              />
            ) : null}
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{goal.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
