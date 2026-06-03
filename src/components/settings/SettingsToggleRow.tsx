import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type Props = {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
};

export function SettingsToggleRow({
  label,
  subtitle,
  value,
  onValueChange,
  isLast,
}: Props) {
  return (
    <View style={[styles.row, !isLast && styles.border]}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#BFC9C1', true: colors.primaryPale }}
        thumbColor={value ? colors.primary : colors.white}
        ios_backgroundColor="#BFC9C1"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    gap: spacing.md,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.bodyLg,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.score.fontFamily,
    fontSize: 13,
    color: colors.primary,
  },
});
