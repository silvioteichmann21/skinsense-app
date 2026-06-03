import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import { PaginationDots } from '@/components/ui/PaginationDots';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { useWelcomeSlides } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { WelcomeSlidePage } from '@/screens/onboarding/WelcomeSlidePage';
import type { WelcomeSlide } from '@/screens/onboarding/welcomeSlides';
import { colors, spacing, typography } from '@/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
/** Fallback until carousel `onLayout` runs — keeps slides vertically centered */
const ESTIMATED_CAROUSEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.46);
const IMAGE_SIZE = Math.min(SCREEN_WIDTH - 32, 320);
/** Pause on each slide before the next step (same delay for every move) */
const SLIDE_DWELL_MS = 4000;

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

function getIndexFromOffset(offsetX: number, slideCount: number): number {
  const index = Math.round(offsetX / SCREEN_WIDTH);
  return Math.max(0, Math.min(index, slideCount - 1));
}

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<WelcomeSlide>);

type WelcomeNav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const welcomeSlides = useWelcomeSlides();
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const slideCount = welcomeSlides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(ESTIMATED_CAROUSEL_HEIGHT);
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
    const offset = clamped * SCREEN_WIDTH;
    listRef.current?.scrollToOffset({ offset, animated });
    if (!animated) {
      scrollX.value = offset;
    }
  }, [scrollX, slideCount]);

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
      const targetOffset = target * SCREEN_WIDTH;

      if (Math.abs(offsetX - targetOffset) > 6) {
        return;
      }

      autoScrollTargetRef.current = null;
      applyIndex(target);
      scheduleAutoAdvance();
      return;
    }

    const previous = indexRef.current;
    const index = getIndexFromOffset(offsetX, slideCount);
    if (index > previous) slideDirectionRef.current = 'forward';
    else if (index < previous) slideDirectionRef.current = 'backward';

    applyIndex(index);
    scheduleAutoAdvance();
  };

  const getItemLayout = useCallback(
    (_: ArrayLike<WelcomeSlide> | null | undefined, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
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
        slideWidth={SCREEN_WIDTH}
        slideHeight={carouselHeight}
        imageSize={IMAGE_SIZE}
      />
    ),
    [carouselHeight, scrollX],
  );

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.primaryContainer, colors.primaryDark]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.atmosphere, styles.atmosphereGlow]} />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <ScreenBackButton variant="inverse" />
      </View>

      <View style={[styles.header, { paddingTop: spacing.md }]}>
        <Text style={styles.logo}>{t('common.brand')}</Text>
      </View>

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

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.dotsCenter}>
          <PaginationDots count={welcomeSlides.length} activeIndex={activeIndex} variant="dark" />
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={t('onboarding.getStarted')}
            variant="light"
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
              variant="ghost"
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  atmosphere: {
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: SCREEN_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  atmosphereGlow: {
    opacity: 0.35,
  },
  topBar: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing.base,
    zIndex: 3,
  },
  header: {
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    ...typography.h2,
    color: 'rgba(255,255,255,0.9)',
  },
  carouselWrap: {
    flex: 1,
    zIndex: 1,
  },
  carousel: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.base,
    gap: spacing.xl,
    zIndex: 2,
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
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },
});
