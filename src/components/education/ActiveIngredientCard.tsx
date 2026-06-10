import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { LocalizedActiveIngredient } from '@/types/activeIngredient';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  ingredient: LocalizedActiveIngredient;
  onPress?: () => void;
  compact?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      width: 156,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      padding: spacing.md,
      marginRight: spacing.md,
    },
    cardCompact: {
      width: 140,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    category: {
      ...typography.caption,
      color: colors.primary,
      marginBottom: spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    name: {
      ...typography.label,
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 18,
      marginBottom: spacing.xs,
    },
    summary: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderMuted,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    rowBody: {
      flex: 1,
    },
    chevron: {
      marginLeft: spacing.xs,
    },
  });
}

export function ActiveIngredientCard({ ingredient, onPress, compact }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  if (compact) {
    return (
      <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name={ingredient.icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.rowBody}>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.summary} numberOfLines={2}>
            {ingredient.summary}
          </Text>
        </View>
        {onPress ? (
          <MaterialCommunityIcons name="chevron-right" size={20} color={styles.summary.color} style={styles.chevron} />
        ) : null}
      </Pressable>
    );
  }

  return (
    <Pressable
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={ingredient.icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.category}>{ingredient.category}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {ingredient.name}
      </Text>
      <Text style={styles.summary} numberOfLines={3}>
        {ingredient.summary}
      </Text>
    </Pressable>
  );
}
