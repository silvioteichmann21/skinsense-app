import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { ScannedIngredient } from '@/screens/products/ingredientScanMockData';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  ingredient: ScannedIngredient;
};

export function ScannedIngredientRow({ ingredient }: Props) {
  const caution = ingredient.status === 'caution';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.bar, caution && styles.barCaution]} />
        <View>
          <Text style={styles.name}>{ingredient.name}</Text>
          <Text style={styles.note}>{ingredient.note}</Text>
        </View>
      </View>
      <MaterialCommunityIcons
        name={caution ? 'information' : 'check-circle'}
        size={22}
        color={caution ? colors.accent : colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    marginRight: spacing.sm,
  },
  bar: {
    width: 4,
    height: 32,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  barCaution: {
    backgroundColor: colors.accent,
  },
  name: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  note: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
