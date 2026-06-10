import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { glow, layout, radius, spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

function ShimmerBlock({
  width,
  height,
  radius: blockRadius = radius.md,
  style,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: object;
}) {
  const { colors } = useAppTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-120, 320]),
      },
    ],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: blockRadius,
          backgroundColor: colors.surfaceSunken,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', colors.primaryPale, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: 120, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      paddingHorizontal: layout.screenPaddingX,
      paddingTop: spacing.lg,
      gap: layout.sectionGap,
    },
    center: {
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.xl,
    },
    iconRing: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primaryPale,
      alignItems: 'center',
      justifyContent: 'center',
      ...glow(colors.primaryGlow, 'md'),
    },
    loadingText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    heroSkeleton: {
      borderRadius: layout.listCardRadius,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: spacing.xl,
      alignItems: 'center',
      gap: spacing.md,
    },
    cardSkeleton: {
      borderRadius: layout.listCardRadius,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.hairline,
      padding: layout.cardPadding,
      gap: spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
  });
}

export function CommunityReviewsLoading() {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(220)} style={styles.root}>
      <View style={styles.center}>
        <Animated.View style={[styles.iconRing, pulseStyle]}>
          <MaterialCommunityIcons name="message-star-outline" size={34} color={colors.primary} />
        </Animated.View>
        <Text style={styles.loadingText}>{t('reviews.loading')}</Text>
      </View>

      <View style={styles.heroSkeleton}>
        <ShimmerBlock width={96} height={40} radius={radius.md} />
        <ShimmerBlock width="70%" height={14} />
        <ShimmerBlock width="50%" height={12} />
        <ShimmerBlock width="60%" height={12} />
      </View>

      <View style={styles.cardSkeleton}>
        <View style={styles.row}>
          <ShimmerBlock width={40} height={40} radius={radius.full} />
          <ShimmerBlock width={120} height={16} />
        </View>
        <ShimmerBlock width={110} height={14} />
        <ShimmerBlock width="100%" height={14} />
        <ShimmerBlock width="85%" height={14} />
      </View>

      <View style={styles.cardSkeleton}>
        <View style={styles.row}>
          <ShimmerBlock width={40} height={40} radius={radius.full} />
          <ShimmerBlock width={100} height={16} />
        </View>
        <ShimmerBlock width={110} height={14} />
        <ShimmerBlock width="100%" height={14} />
        <ShimmerBlock width="70%" height={14} />
      </View>
    </Animated.View>
  );
}
