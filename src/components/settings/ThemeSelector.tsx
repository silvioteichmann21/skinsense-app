import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { colors, radius, spacing, typography } from '@/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

const OPTIONS: { id: ThemeMode; labelKey: TranslationKey }[] = [
  { id: 'light', labelKey: 'settings.themeLight' },
  { id: 'dark', labelKey: 'settings.themeDark' },
  { id: 'system', labelKey: 'settings.themeSystem' },
];

type Props = {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

export function ThemeSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Theme</Text>
      <View style={styles.track}>
        {OPTIONS.map((opt) => {
          const active = value === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onChange(opt.id)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {t(opt.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMuted,
    gap: spacing.md,
  },
  title: {
    ...typography.bodyLg,
    fontFamily: typography.h3.fontFamily,
    color: colors.textPrimary,
  },
  track: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  option: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  optionActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 12,
  },
  optionTextActive: {
    color: colors.primary,
    fontFamily: typography.h3.fontFamily,
  },
});
