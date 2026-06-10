import { StyleSheet, Text, View } from 'react-native';

import type { CompareDeltaRow as Delta } from '@/screens/progress/compareMockData';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles } from '@/theme';

type Props = {
  row: Delta;
  isLast?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
  },
  concern: {
    flex: 1.2,
    ...typography.body,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  cell: {
    flex: 0.9,
    textAlign: 'center',
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.textSecondary,
  },
  cellCurrent: {
    color: colors.textPrimary,
  },
  changeWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  change: {
    ...typography.label,
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    textTransform: 'none',
    overflow: 'hidden',
  },
});
}

export function CompareDeltaRow({
 row, isLast }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.row, !isLast && styles.border]}>
      <Text style={styles.concern}>{row.concern}</Text>
      <Text style={styles.cell}>{row.before}</Text>
      <Text style={[styles.cell, styles.cellCurrent]}>{row.after}</Text>
      <View style={styles.changeWrap}>
        <Text style={styles.change}>{row.change}</Text>
      </View>
    </View>
  );
}
