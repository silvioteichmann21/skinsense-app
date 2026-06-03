import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { resolveSplashRoute } from '@/core/navigation/authRouting';
import type { RootStackParamList } from '@/core/navigation/types';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme';

const MIN_DISPLAY_MS = 1500;

type SplashNav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

function LoadingDots() {
  return (
    <View style={styles.dotsRow}>
      {[0, 1, 2].map((i) => (
        <AnimatedDot key={i} index={i} />
      ))}
    </View>
  );
}

function AnimatedDot({ index }: { index: number }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0.2, { duration: 400, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );
  }, [index, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function SplashScreen() {
  const navigation = useNavigation<SplashNav>();
  const insets = useSafeAreaInsets();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const session = useAuthStore((s) => s.session);

  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.2);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    contentOpacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
    contentTranslateY.value = withTiming(0, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [contentOpacity, contentTranslateY, glowOpacity, glowScale]);

  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      void resolveSplashRoute(Boolean(session)).then((route) => {
        navigation.replace(route);
      });
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [isInitialized, session, navigation]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    footerOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, [footerOpacity]);

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.glowOrb, glowStyle]} />

      <Animated.View style={[styles.content, contentStyle]}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name="leaf"
            size={64}
            color={colors.textInverse}
            style={styles.icon}
          />
        </View>
        <Text style={styles.brand}>SkinSense</Text>
        <Text style={styles.tagline}>Know your skin. Own your glow.</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 24) + 40 },
          footerStyle,
        ]}
      >
        <LoadingDots />
      </Animated.View>
    </View>
  );
}

const ORB_SIZE = 320;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOrb: {
    position: 'absolute',
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: colors.primaryPale,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    zIndex: 1,
  },
  iconWrap: {
    marginBottom: spacing.xl,
  },
  icon: {
    opacity: 0.92,
  },
  brand: {
    ...typography.h1,
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.bodyLg,
    color: colors.textInverse,
    opacity: 0.8,
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textInverse,
  },
});
