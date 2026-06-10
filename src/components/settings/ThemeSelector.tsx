import { StyleSheet, Text, View } from 'react-native';

import { CtaSegment } from '@/components/ui/CtaSegment';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, spacing, typography, useThemedStyles } from '@/theme';

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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
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
      padding: 3,
      backgroundColor: colors.periodTrack,
      borderRadius: radius.full,
      gap: 2,
    },
  });
}

export function ThemeSelector({ value, onChange }: Props) {
  const { t } = useTranslation();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Theme</Text>
      <View style={styles.track}>
        {OPTIONS.map((opt) => (
          <CtaSegment
            key={opt.id}
            label={t(opt.labelKey)}
            active={value === opt.id}
            onPress={() => onChange(opt.id)}
          />
        ))}
      </View>
    </View>
  );
}
