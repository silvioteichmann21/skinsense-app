import { StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useThemedStyles } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: spacing.xs,
  },
  accent: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryPale,
  },
  textBlock: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
}

export function ProfileSectionTitle({
 title, subtitle }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.wrap}>
      <View style={styles.accent} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}
