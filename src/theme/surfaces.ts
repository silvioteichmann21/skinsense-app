import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import type { AppColors } from '@/theme/palettes';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/** Shared flat card — hairline border, no shadow. Default surface across screens. */
export function flatCard(colors: AppColors, padded = true): ViewStyle {
  return {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairline,
    ...(padded ? { padding: spacing.lg } : {}),
  };
}

/** Section headings — sentence case, no uppercase labels. */
export function sectionTitleStyle(colors: AppColors): TextStyle {
  return {
    ...typography.h3,
    fontSize: 17,
    color: colors.textPrimary,
  };
}

/** Muted meta line under section titles. */
export function sectionMetaStyle(colors: AppColors): TextStyle {
  return {
    ...typography.caption,
    color: colors.textSecondary,
  };
}
