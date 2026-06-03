import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import { colors, radius, spacing, typography } from '@/theme';

export function ChatDisclaimer() {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons name="information" size={20} color={colors.accent} />
      <Text style={styles.text}>{t('chat.disclaimer')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: '#F1F3FF',
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
