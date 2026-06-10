import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ReviewAuthorAvatar } from '@/components/feedback/ReviewAuthorAvatar';
import { ReviewStars } from '@/components/feedback/ReviewStars';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { useTranslation } from '@/i18n/useTranslation';
import type { CommunityReview } from '@/services/feedback/communityReviewsService';
import type { AppColors } from '@/theme/palettes';
import {
  glow,
  layout,
  spacing,
  typography,
  useAppTheme,
  useReviewCardWidth,
  useThemedStyles,
} from '@/theme';

type Props = {
  review: CommunityReview;
  width?: number;
  compact?: boolean;
};

const NARROW_SCREEN = 400;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    card: {
      minHeight: 168,
      ...glow(colors.primaryGlow, 'md'),
    },
    cardCompact: {
      height: 132,
    },
    cardFull: {
      width: '100%',
      alignSelf: 'stretch',
      minHeight: 0,
    },
    cardCarousel: {
      alignSelf: 'flex-start',
      flexShrink: 0,
    },
    inner: {
      width: '100%',
      gap: spacing.md,
    },
    innerCompact: {
      width: '100%',
      gap: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      width: '100%',
    },
    name: {
      ...typography.h3,
      color: colors.textPrimary,
      flex: 1,
      minWidth: 0,
    },
    quoteRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      width: '100%',
      minWidth: 0,
    },
    quoteIcon: {
      marginTop: 2,
      flexShrink: 0,
    },
    body: {
      ...typography.body,
      color: colors.textPrimary,
      lineHeight: 22,
      flex: 1,
      minWidth: 0,
    },
    bodyMuted: {
      ...typography.body,
      color: colors.textSecondary,
      fontStyle: 'italic',
      lineHeight: 22,
      flex: 1,
      minWidth: 0,
    },
  });
}

export function CommunityReviewCard({ review, width, compact }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const responsiveWidth = useReviewCardWidth(Boolean(compact));
  const isFullWidth = width == null;
  const resolvedWidth = width ?? (compact ? responsiveWidth : undefined);
  const isCarousel = resolvedWidth != null;

  const cardPadding = compact
    ? spacing.sm
    : screenWidth < NARROW_SCREEN
      ? spacing.lg
      : layout.cardPadding;

  const displayName = review.authorDisplayName;

  const displayText =
    review.comment && review.comment.length > 0
      ? review.comment
      : t('reviews.starsOnly', { stars: String(review.stars) });

  const cardStyle = StyleSheet.flatten([
    compact ? styles.cardCompact : styles.card,
    isFullWidth && styles.cardFull,
    isCarousel && styles.cardCarousel,
    resolvedWidth != null ? { width: resolvedWidth } : null,
  ]);

  return (
    <SurfaceCard
      variant="elevated"
      style={cardStyle}
      padding={cardPadding}
    >
      <View style={compact ? styles.innerCompact : styles.inner}>
        <View style={styles.header}>
          <ReviewAuthorAvatar
            reviewId={review.id}
            displayName={displayName}
            avatarUrl={review.authorAvatarUrl}
            size={compact ? 36 : 40}
          />
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <ReviewStars stars={review.stars} size={compact ? 13 : 15} />

        <View style={styles.quoteRow}>
          <MaterialCommunityIcons
            name="format-quote-open"
            size={compact ? 16 : 18}
            color={colors.primaryPale}
            style={styles.quoteIcon}
          />
          <Text
            style={review.comment ? styles.body : styles.bodyMuted}
            numberOfLines={compact ? 2 : 6}
          >
            {displayText}
          </Text>
        </View>
      </View>
    </SurfaceCard>
  );
}
