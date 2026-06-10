import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CommunityReviewCard } from '@/components/feedback/CommunityReviewCard';
import { ReviewStars } from '@/components/feedback/ReviewStars';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Reveal } from '@/components/ui/Reveal';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { RootStackParamList } from '@/core/navigation/types';
import { useCommunityReviews } from '@/hooks/useCommunityReviews';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import {
  glow,
  layout,
  radius,
  spacing,
  typography,
  useAppTheme,
  useReviewCardWidth,
  useThemedStyles,
} from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  variant?: 'horizontal' | 'vertical';
  maxItems?: number;
  showSeeAll?: boolean;
  revealIndex?: number;
  compact?: boolean;
  /** Hide subtitle/rating row — saves vertical space on Welcome */
  minimalHeader?: boolean;
  /** Override compact carousel height (e.g. short phones) */
  compactHeight?: number;
  /** When false, parent already applies screen padding — carousel uses full content width */
  carouselInset?: boolean;
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      gap: spacing.md,
    },
    header: {
      paddingHorizontal: layout.screenPaddingX,
      gap: spacing.xs,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    headerText: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    title: {
      ...typography.h3,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.caption,
      color: colors.textTertiary,
      lineHeight: 18,
    },
    seeAll: {
      ...typography.label,
      color: colors.ctaGradientStart,
      letterSpacing: 0.6,
    },
    ratingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: colors.ctaTint,
      ...glow(colors.ctaGlow, 'md'),
    },
    ratingValue: {
      ...typography.h3,
      color: colors.ctaGradientStart,
    },
    ratingCount: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    horizontalScroll: {
      paddingHorizontal: layout.screenPaddingX,
      gap: spacing.md,
      paddingBottom: spacing.xs,
      alignItems: 'stretch',
    },
    horizontalScrollFlush: {
      paddingHorizontal: 0,
    },
    compactScroll: {
      height: 140,
    },
    verticalList: {
      paddingHorizontal: layout.screenPaddingX,
      gap: spacing.md,
    },
    loadingRow: {
      flexDirection: 'row',
      paddingHorizontal: layout.screenPaddingX,
      gap: spacing.md,
    },
    skeleton: {
      height: 140,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceSunken,
    },
    emptyCard: {
      marginHorizontal: layout.screenPaddingX,
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.xl,
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.ctaTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      ...typography.h3,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    emptyBody: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    emptyBtn: {
      width: '100%',
      marginTop: spacing.sm,
    },
  });
}

export function CommunityReviewsSection({
  variant = 'horizontal',
  maxItems = 6,
  showSeeAll = true,
  revealIndex,
  compact = false,
  minimalHeader = false,
  compactHeight,
  carouselInset = true,
}: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { featured, average, loading, hasReviews, reviews } = useCommunityReviews();
  const cardWidth = useReviewCardWidth(compact);

  const visible = featured.slice(0, maxItems);
  const count = reviews.length;

  const openAll = () => navigation.navigate('CommunityReviews');
  const openFeedback = () => navigation.navigate('AppFeedback');

  const content = (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>{t('reviews.title')}</Text>
          {showSeeAll && hasReviews ? (
            <Pressable onPress={openAll} accessibilityRole="button">
              <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
            </Pressable>
          ) : null}
        </View>
        {!minimalHeader ? (
          <View style={styles.metaRow}>
            <Text style={styles.subtitle}>{t('reviews.subtitle')}</Text>
            {hasReviews && average !== null ? (
              <View style={styles.ratingPill}>
                <MaterialCommunityIcons name="star" size={16} color={colors.ctaGradientStart} />
                <Text style={styles.ratingValue}>{average.toFixed(1)}</Text>
                <Text style={styles.ratingCount}>({count})</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.ctaGradientStart} />
          <View style={[styles.skeleton, { width: cardWidth }]} />
          <View style={[styles.skeleton, { width: cardWidth }]} />
        </View>
      ) : hasReviews ? (
        variant === 'horizontal' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={
              compact
                ? [styles.compactScroll, compactHeight != null ? { height: compactHeight } : null]
                : undefined
            }
            contentContainerStyle={[
              styles.horizontalScroll,
              !carouselInset && styles.horizontalScrollFlush,
            ]}
          >
            {visible.map((review) => (
              <CommunityReviewCard
                key={review.id}
                review={review}
                compact={compact}
                width={cardWidth}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.verticalList}>
            {visible.map((review) => (
              <CommunityReviewCard key={review.id} review={review} compact={compact} />
            ))}
          </View>
        )
      ) : (
        <SurfaceCard variant="sunken" style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="shield-check-outline" size={28} color={colors.ctaGradientStart} />
          </View>
          <Text style={styles.emptyTitle}>{t('reviews.emptyTitle')}</Text>
          <Text style={styles.emptyBody}>{t('reviews.emptyBody')}</Text>
          <PrimaryButton
            label={t('reviews.beFirst')}
            variant="green"
            onPress={openFeedback}
            style={styles.emptyBtn}
          />
        </SurfaceCard>
      )}

    </View>
  );

  if (revealIndex != null) {
    return <Reveal index={revealIndex}>{content}</Reveal>;
  }

  return content;
}
