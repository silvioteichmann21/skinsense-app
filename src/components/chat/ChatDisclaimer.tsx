import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  text: {
    ...typography.label,
    flex: 1,
    color: colors.textSecondary,
    textTransform: 'none',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
});
}

export function ChatDisclaimer() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();

  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name="information" size={20} color={colors.accent} />
      <Text style={styles.text}>{t('chat.disclaimer')}</Text>
    </View>
  );
}
