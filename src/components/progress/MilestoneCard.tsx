import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Milestone } from '@/screens/progress/progressMockData';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  milestone: Milestone;
  onPress?: () => void;
};

export function MilestoneCard({ milestone, onPress }: Props) {
  const locked = !milestone.unlocked;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        locked && styles.cardLocked,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, locked && styles.iconWrapLocked]}>
        <MaterialCommunityIcons
          name={milestone.icon}
          size={26}
          color={locked ? colors.textTertiary : colors.primary}
        />
      </View>
      <Text style={[styles.label, locked && styles.labelLocked]} numberOfLines={2}>
        {milestone.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '30%',
    maxWidth: '33%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryPale,
    gap: spacing.sm,
  },
  cardLocked: {
    borderColor: colors.borderMuted,
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapLocked: {
    backgroundColor: '#DCE2F7',
  },
  label: {
    ...typography.label,
    fontSize: 10,
    color: colors.textPrimary,
    textAlign: 'center',
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 14,
  },
  labelLocked: {
    color: colors.textSecondary,
  },
});
