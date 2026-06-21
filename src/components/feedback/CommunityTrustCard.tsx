import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { ReviewStars } from '@/components/feedback/ReviewStars';
import { GradientButton } from '@/components/ui/GradientButton';
import { PressableScale } from '@/components/ui/PressableScale';
import { Reveal } from '@/components/ui/Reveal';
import type { RootStackParamList } from '@/core/navigation/types';
import { useCommunityReviews } from '@/hooks/useCommunityReviews';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { flatCard, layout, radius, spacing, touchTarget, typography, useThemedStyles, useAppTheme } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const NARROW_WIDTH = 360;

type Props = {
  revealIndex?: number;
  /** When inside a padded ScrollView (e.g. Home), skip extra horizontal inset */
  embedded?: boolean;
};

function createStyles(colors: AppColors, stackActions: boolean, embedded: boolean) {
  return StyleSheet.create({
    card: {
      ...flatCard(colors),
      marginHorizontal: embedded ? 0 : layout.screenPaddingX,
      gap: spacing.md,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    copy: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
      paddingTop: 2,
    },
    title: {
      ...typography.h3,
      color: colors.textPrimary,
      lineHeight: 24,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    ratingPanel: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceMuted,
    },
    ratingValue: {
      ...typography.h2,
      color: colors.primary,
      lineHeight: 28,
    },
    count: {
      ...typography.caption,
      color: colors.textTertiary,
      flexShrink: 1,
    },
    quote: {
      ...typography.body,
      color: colors.textPrimary,
      fontStyle: 'italic',
      lineHeight: 22,
      paddingLeft: spacing.md,
      paddingRight: spacing.xs,
      borderLeftWidth: 2,
      borderLeftColor: colors.primaryPale,
    },
    actions: {
      flexDirection: stackActions ? 'column' : 'row',
      gap: spacing.sm,
    },
    actionPrimary: {
      flex: stackActions ? undefined : 1,
    },
    actionPrimaryContent: {
      gap: spacing.sm,
    },
    actionPrimaryLabel: {
      ...typography.bodyLg,
      color: colors.textInverse,
      fontFamily: typography.h3.fontFamily,
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },
    actionSecondary: {
      flex: stackActions ? undefined : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.primaryPale,
      minHeight: touchTarget,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    actionSecondaryLabel: {
      ...typography.bodyLg,
      color: colors.primary,
      fontFamily: typography.h3.fontFamily,
      letterSpacing: 0,
      flexShrink: 1,
      textAlign: 'center',
    },
    loading: {
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
  });
}

export function CommunityTrustCard({ revealIndex, embedded = false }: Props) {
  const { width } = useWindowDimensions();
  const stackActions = width < NARROW_WIDTH;
  const styles = useThemedStyles((colors) => createStyles(colors, stackActions, embedded));
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { featured, average, loading, hasReviews, reviews } = useCommunityReviews();

  const featuredQuote = featured.find((r) => r.comment && r.comment.length >= 20)?.comment;
  const roundedAvg = average !== null ? Math.round(average) : 0;

  const content = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="shield-check" size={24} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>{t('reviews.trustCardTitle')}</Text>
          <Text style={styles.subtitle}>
            {hasReviews ? t('reviews.trustCardSubtitle') : t('reviews.trustCardEmpty')}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : hasReviews && average !== null ? (
        <>
          <View style={styles.ratingPanel}>
            <Text style={styles.ratingValue}>{average.toFixed(1)}</Text>
            <ReviewStars stars={roundedAvg} size={16} />
            <Text style={styles.count}>
              {t('reviews.count', { count: String(reviews.length) })}
            </Text>
          </View>
          {featuredQuote ? (
            <Text style={styles.quote} numberOfLines={3}>
              “{featuredQuote}”
            </Text>
          ) : null}
        </>
      ) : null}

      <View style={styles.actions}>
        <GradientButton
          style={styles.actionPrimary}
          contentStyle={styles.actionPrimaryContent}
          onPress={() => navigation.navigate('AppFeedback')}
        >
          <MaterialCommunityIcons name="star-outline" size={20} color={colors.textInverse} />
          <Text style={styles.actionPrimaryLabel} numberOfLines={1}>
            {t('reviews.rateCta')}
          </Text>
        </GradientButton>
        <PressableScale
          style={styles.actionSecondary}
          haptic="light"
          onPress={() => navigation.navigate('CommunityReviews')}
        >
          <MaterialCommunityIcons name="message-star-outline" size={20} color={colors.primary} />
          <Text style={styles.actionSecondaryLabel} numberOfLines={1}>
            {t('reviews.readCta')}
          </Text>
        </PressableScale>
      </View>
    </View>
  );

  if (revealIndex != null) {
    return <Reveal index={revealIndex}>{content}</Reveal>;
  }

  return content;
}
