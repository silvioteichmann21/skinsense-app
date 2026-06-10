import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthDecorBackground } from '@/components/auth/AuthDecorBackground';
import { CommunityReviewsSection } from '@/components/feedback/CommunityReviewsSection';
import { ScreenBackButton, ScreenHeaderSpacer } from '@/components/ui/ScreenBackButton';
import { PaginationDots } from '@/components/ui/PaginationDots';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { useWelcomeSlides } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { WelcomeSlidePage } from '@/screens/onboarding/WelcomeSlidePage';
import type { WelcomeSlide } from '@/screens/onboarding/welcomeSlides';
import type { AppColors } from '@/theme/palettes';
import { spacing, typography, useThemedStyles, useAppTheme } from '@/theme';

/** Pause on each slide before the next step (same delay for every move) */
const SLIDE_DWELL_MS = 4000;
/** Portrait hero aspect (width : height) — matches welcome slide artwork */
const HERO_ASPECT = 4 / 5;
const COMPACT_SCREEN_HEIGHT = 740;

type SlideDirection = 'forward' | 'backward';

function getNextStep(
  current: number,
  direction: SlideDirection,
  slideCount: number,
): { index: number; direction: SlideDirection } {
  if (direction === 'forward') {
    if (current >= slideCount - 1) {
      return { index: current - 1, direction: 'backward' };
    }
    return { index: current + 1, direction: 'forward' };
  }

  if (current <= 0) {
    return { index: 1, direction: 'forward' };
  }
  return { index: current - 1, direction: 'backward' };
}

function getIndexFromOffset(offsetX: number, slideWidth: number, slideCount: number): number {
  const index = Math.round(offsetX / slideWidth);
  return Math.max(0, Math.min(index, slideCount - 1));
}

function computeWelcomeHeroSize(
  screenWidth: number,
  carouselHeight: number,
  isCompact: boolean,
): { width: number; height: number } {
  const widthBudget = screenWidth - spacing.base * 2;
  const heightBudget = Math.max(96, carouselHeight - spacing.md);

  let width = isCompact ? widthBudget * 0.94 : widthBudget;
  let height = Math.round(width / HERO_ASPECT);

  if (height > heightBudget) {
    height = heightBudget;
    width = Math.round(height * HERO_ASPECT);
  }

  return { width: Math.round(width), height };
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<WelcomeSlide>);

type WelcomeNav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.base,
    zIndex: 3,
  },
  logo: {
    ...typography.h2,
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  carouselWrap: {
    flex: 1,
    minHeight: 0,
    zIndex: 1,
  },
  carousel: {
    flex: 1,
  },
  copyWrap: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
    zIndex: 2,
  },
  slideTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
  },
  slideTitleCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  slideSubtitle: {
    ...typography.bodyLg,
    color: colors.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  slideSubtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewsWrap: {
    zIndex: 2,
    flexShrink: 0,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    flexShrink: 0,
    zIndex: 2,
  },
  footerGap: {
    gap: spacing.xl,
  },
  footerGapCompact: {
    gap: spacing.md,
  },
  dotsCenter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: spacing.md,
    width: '100%',
  },
  guestLink: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  guestPressed: {
    opacity: 0.7,
  },
  guestText: {
    ...typography.label,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
}

export function WelcomeScreen() {
  const styles = useThemedStyles(createStyles);
  const { resolvedScheme } = useAppTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isCompact = screenHeight < COMPACT_SCREEN_HEIGHT;
  const estimatedCarouselHeight = Math.round(screenHeight * (isCompact ? 0.28 : 0.34));

  const navigation = useNavigation<WelcomeNav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const welcomeSlides = useWelcomeSlides();
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const slideCount = welcomeSlides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(estimatedCarouselHeight);
  const heroSize = computeWelcomeHeroSize(screenWidth, carouselHeight, isCompact);
  const activeSlide = welcomeSlides[activeIndex];
  const listRef = useRef<FlatList<WelcomeSlide>>(null);
  const scrollX = useSharedValue(0);
  const indexRef = useRef(0);
  const isUserDragging = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Auto-advance in progress — ignore intermediate scroll stops (e.g. passing slide 2 on 3→1) */
  const autoScrollTargetRef = useRef<number | null>(null);
  const slideDirectionRef = useRef<SlideDirection>('forward');

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const scrollToSlide = useCallback((index: number, animated = true) => {
    const clamped = Math.max(0, Math.min(index, slideCount - 1));
    const offset = clamped * screenWidth;
    listRef.current?.scrollToOffset({ offset, animated });
    if (!animated) {
      scrollX.value = offset;
    }
  }, [scrollX, screenWidth, slideCount]);

  const applyIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, slideCount - 1));
    indexRef.current = clamped;
    setActiveIndex(clamped);
  }, [slideCount]);

  const scheduleAutoAdvance = useCallback(() => {
    clearAutoTimer();
    autoTimerRef.current = setTimeout(() => {
      autoTimerRef.current = null;
      if (isUserDragging.current) {
        scheduleAutoAdvance();
        return;
      }

      const current = indexRef.current;
      const { index: next, direction: nextDirection } = getNextStep(
        current,
        slideDirectionRef.current,
        slideCount,
      );

      slideDirectionRef.current = nextDirection;
      autoScrollTargetRef.current = next;
      scrollToSlide(next, true);
    }, SLIDE_DWELL_MS);
  }, [clearAutoTimer, scrollToSlide, slideCount]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearAutoTimer;
  }, [clearAutoTimer, scheduleAutoAdvance]);

  const onScrollBeginDrag = () => {
    isUserDragging.current = true;
    autoScrollTargetRef.current = null;
    clearAutoTimer();
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    isUserDragging.current = false;
    const offsetX = e.nativeEvent.contentOffset.x;

    if (autoScrollTargetRef.current !== null) {
      const target = autoScrollTargetRef.current;
      const targetOffset = target * screenWidth;

      if (Math.abs(offsetX - targetOffset) > 6) {
        return;
      }

      autoScrollTargetRef.current = null;
      applyIndex(target);
      scheduleAutoAdvance();
      return;
    }

    const previous = indexRef.current;
    const index = getIndexFromOffset(offsetX, screenWidth, slideCount);
    if (index > previous) slideDirectionRef.current = 'forward';
    else if (index < previous) slideDirectionRef.current = 'backward';

    applyIndex(index);
    scheduleAutoAdvance();
  };

  const getItemLayout = useCallback(
    (_: ArrayLike<WelcomeSlide> | null | undefined, index: number) => ({
      length: screenWidth,
      offset: screenWidth * index,
      index,
    }),
    [screenWidth],
  );

  const onCarouselLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0) setCarouselHeight(height);
  }, []);

  const renderSlide = useCallback(
    ({ item, index }: { item: WelcomeSlide; index: number }) => (
      <WelcomeSlidePage
        item={item}
        index={index}
        scrollX={scrollX}
        slideWidth={screenWidth}
        slideHeight={carouselHeight}
        heroWidth={heroSize.width}
        heroHeight={heroSize.height}
      />
    ),
    [carouselHeight, heroSize.height, heroSize.width, screenWidth, scrollX],
  );

  return (
    <View style={styles.root}>
      <AuthDecorBackground />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.xs }]}>
        <ScreenBackButton variant="default" />
        <Text style={styles.logo} numberOfLines={1}>
          {t('common.brand')}
        </Text>
        <ScreenHeaderSpacer />
      </View>

      <View style={styles.body}>
        <View style={styles.carouselWrap} onLayout={onCarouselLayout}>
          <AnimatedFlatList
            ref={listRef}
            data={welcomeSlides}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={scrollHandler}
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={getItemLayout}
            bounces={false}
            overScrollMode="never"
            style={styles.carousel}
          />
        </View>

        {activeSlide ? (
          <View style={styles.copyWrap} key={activeSlide.id}>
            <Text
              style={[styles.slideTitle, isCompact && styles.slideTitleCompact]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {activeSlide.title}
            </Text>
            <Text
              style={[styles.slideSubtitle, isCompact && styles.slideSubtitleCompact]}
              numberOfLines={3}
            >
              {activeSlide.subtitle}
            </Text>
          </View>
        ) : null}

        <View style={styles.reviewsWrap}>
          <CommunityReviewsSection
            compact
            maxItems={isCompact ? 2 : 3}
            minimalHeader={isCompact}
            compactHeight={132}
          />
        </View>
      </View>

      <View
        style={[
          styles.footer,
          isCompact ? styles.footerGapCompact : styles.footerGap,
          { paddingBottom: insets.bottom + (isCompact ? spacing.md : spacing.lg) },
        ]}
      >
        <View style={styles.dotsCenter}>
          <PaginationDots
            count={welcomeSlides.length}
            activeIndex={activeIndex}
            variant={resolvedScheme === 'dark' ? 'dark' : 'light'}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={t('onboarding.getStarted')}
            variant="green"
            onPress={() => {
              if (session) {
                const displayName =
                  profile?.firstName?.trim() || profile?.displayName?.trim() || undefined;
                navigation.navigate('SkinQuiz', { displayName });
                return;
              }
              navigation.navigate('Signup');
            }}
          />
          {!session ? (
            <PrimaryButton
              label={t('onboarding.haveAccount')}
              variant="outline"
              onPress={() => navigation.navigate('Login')}
            />
          ) : null}
          <Pressable
            onPress={() => navigation.navigate('SkinQuiz')}
            style={({ pressed }) => [styles.guestLink, pressed && styles.guestPressed]}
          >
            <Text style={styles.guestText}>{t('onboarding.guest')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
