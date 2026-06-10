import { StyleSheet, Switch, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Props = {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  isLast?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: spacing.lg,
      gap: spacing.md,
    },
    border: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
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
}

export function SettingsToggleRow({
  label,
  subtitle,
  value,
  onValueChange,
  isLast,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={[styles.row, !isLast && styles.border]}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
        thumbColor={colors.white}
        ios_backgroundColor={colors.switchTrackOff}
      />
    </View>
  );
}
