import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

type Props = {
  label?: string;
};

export function Divider({ label = 'or' }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
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
