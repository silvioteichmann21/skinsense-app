import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useAppTheme, useThemedStyles } from '@/theme';

type Variant = 'success' | 'error';

type Props = {
  variant: Variant;
  message: string;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    banner: {
      width: '100%',
      maxWidth: 440,
      alignSelf: 'center',
      marginBottom: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    success: {
      backgroundColor: colors.primaryPale,
      borderWidth: 1,
      borderColor: colors.primaryLight,
    },
    error: {
      backgroundColor: colors.severityHighBg,
      borderWidth: 1,
      borderColor: colors.severityHighBorder,
    },
    text: {
      ...typography.body,
      flex: 1,
    },
    successText: {
      color: colors.onPrimaryContainer,
    },
    errorText: {
      color: colors.severityHighText,
    },
  });
}

export function AuthFeedbackBanner({ variant, message }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  return (
    <View style={[styles.banner, variant === 'success' ? styles.success : styles.error]}>
      <MaterialCommunityIcons
        name={variant === 'success' ? 'check-circle-outline' : 'alert-circle-outline'}
        size={20}
        color={variant === 'success' ? colors.primary : colors.severityHighText}
      />
      <Text style={[styles.text, variant === 'success' ? styles.successText : styles.errorText]}>
        {message}
      </Text>
    </View>
  );
}
