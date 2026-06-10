import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

type Props = {
  value: number;
  onChange: (stars: number) => void;
  size?: number;
  showLabel?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      gap: spacing.sm,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    starBtn: {
      padding: spacing.xs,
    },
    label: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}

const LABEL_KEYS: TranslationKey[] = [
  'feedback.starLabels.0',
  'feedback.starLabels.1',
  'feedback.starLabels.2',
  'feedback.starLabels.3',
  'feedback.starLabels.4',
  'feedback.starLabels.5',
];

export function StarRating({ value, onChange, size = 36, showLabel = true }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const labelKey = LABEL_KEYS[Math.max(0, Math.min(5, value))];

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= value;
          return (
            <Pressable
              key={star}
              style={styles.starBtn}
              onPress={() => onChange(star)}
              accessibilityRole="button"
              accessibilityLabel={t('feedback.starA11y', { count: star })}
              accessibilityState={{ selected: filled }}
            >
              <MaterialCommunityIcons
                name={filled ? 'star' : 'star-outline'}
                size={size}
                color={filled ? colors.accent : colors.textTertiary}
              />
            </Pressable>
          );
        })}
      </View>
      {showLabel && value > 0 ? (
        <Text style={styles.label}>{t(labelKey)}</Text>
      ) : showLabel ? (
        <Text style={styles.label}>{t('feedback.tapStars')}</Text>
      ) : null}
    </View>
  );
}
