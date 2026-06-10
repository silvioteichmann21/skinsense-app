import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { layout } from '@/theme/layout';
import { spacing, typography, useThemedStyles } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
  uppercase?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      marginBottom: spacing.md,
      gap: spacing.xs,
    },
    title: {
      ...typography.label,
      color: colors.textTertiary,
      letterSpacing: 1.2,
    },
    titleSentence: {
      ...typography.h3,
      color: colors.textPrimary,
      letterSpacing: -0.2,
      textTransform: 'none',
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
    },
  });
}

export function SectionHeading({ title, subtitle, style, uppercase = true }: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.wrap, style]}>
      <Text style={uppercase ? styles.title : styles.titleSentence}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export const sectionHeadingMargin = { marginHorizontal: layout.screenPaddingX } as const;
