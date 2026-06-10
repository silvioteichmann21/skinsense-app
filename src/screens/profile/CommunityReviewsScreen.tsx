import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityReviewCard } from '@/components/feedback/CommunityReviewCard';
import { CommunityReviewsLoading } from '@/components/feedback/CommunityReviewsLoading';
import { ReviewStars } from '@/components/feedback/ReviewStars';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { RootStackParamList } from '@/core/navigation/types';
import { useCommunityReviews } from '@/hooks/useCommunityReviews';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { glow, layout, motion, radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

const INTRO_LOADING_MS = 1000;

type Nav = NativeStackNavigationProp<RootStackParamList, 'CommunityReviews'>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scroll: {
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      gap: layout.sectionGap,
    },
    hero: {
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.xl,
      ...glow(colors.primaryGlow, 'md'),
    },
    heroStars: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    heroValue: {
      ...typography.display,
      color: colors.textPrimary,
    },
    heroLabel: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    heroCount: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    trustRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    trustText: {
      ...typography.caption,
      color: colors.primary,
    },
    list: {
      gap: spacing.md,
    },
    emptyCard: {
      alignItems: 'center',
      gap: spacing.lg,
      paddingVertical: spacing.xxl,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      ...typography.h2,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    emptyBody: {
      ...typography.bodyLg,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    cta: {
      width: '100%',
    },
  });
}

export function CommunityReviewsScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { reviews, average, loading, refresh, hasReviews } = useCommunityReviews();
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIntroReady(true), INTRO_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  const roundedAvg = average !== null ? Math.round(average) : 0;
  const showIntroLoading = !introReady;

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader topInset={insets.top} title={t('reviews.screenTitle')} />

      {showIntroLoading ? (
        <CommunityReviewsLoading />
      ) : (
        <Animated.View
          entering={FadeInDown.springify()
            .damping(motion.spring.soft.damping)
            .stiffness(motion.spring.soft.stiffness)
            .mass(motion.spring.soft.mass)}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => void refresh()}
                tintColor={colors.primary}
              />
            }
          >
            {hasReviews && average !== null ? (
              <SurfaceCard variant="elevated" style={styles.hero}>
                <View style={styles.heroStars}>
                  <Text style={styles.heroValue}>{average.toFixed(1)}</Text>
                  <ReviewStars stars={roundedAvg} size={22} />
                </View>
                <Text style={styles.heroLabel}>{t('reviews.heroLabel')}</Text>
                <Text style={styles.heroCount}>
                  {t('reviews.count', { count: String(reviews.length) })}
                </Text>
                <View style={styles.trustRow}>
                  <MaterialCommunityIcons name="shield-check" size={16} color={colors.primary} />
                  <Text style={styles.trustText}>{t('reviews.trustBadge')}</Text>
                </View>
              </SurfaceCard>
            ) : null}

            {hasReviews ? (
              <View style={styles.list}>
                {reviews.map((review) => (
                  <CommunityReviewCard key={review.id} review={review} />
                ))}
              </View>
            ) : (
              <SurfaceCard variant="outlined" style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <MaterialCommunityIcons
                    name="message-star-outline"
                    size={36}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.emptyTitle}>{t('reviews.emptyTitle')}</Text>
                <Text style={styles.emptyBody}>{t('reviews.emptyBody')}</Text>
                <PrimaryButton
                  label={t('reviews.beFirst')}
                  variant="green"
                  onPress={() => navigation.navigate('AppFeedback')}
                  style={styles.cta}
                />
              </SurfaceCard>
            )}

            {hasReviews ? (
              <PrimaryButton
                label={t('reviews.writeReview')}
                variant="outline"
                onPress={() => navigation.navigate('AppFeedback')}
              />
            ) : null}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}
