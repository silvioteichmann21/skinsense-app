import { StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { typography, useThemedStyles } from '@/theme';

type Props = {
  label?: string;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    label: {
      ...typography.body,
      color: colors.textTertiary,
    },
  });
}

export function Divider({ label = 'or' }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}
