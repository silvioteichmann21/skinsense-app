import { radius, spacing } from '@/theme/spacing';

/** Shared screen rhythm — use across all pages for editorial consistency. */
export const layout = {
  screenPaddingX: spacing.lg,
  sectionGap: spacing.xxl,
  cardPadding: spacing.lg,
  heroCardRadius: radius.lg,
  listCardRadius: radius.lg,
} as const;
