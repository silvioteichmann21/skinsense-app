import { StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useThemedStyles } from '@/theme';

type Props = {
  title: string;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
}

export function LanguageSectionHeader({
 title }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
