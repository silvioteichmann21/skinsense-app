import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, spacing, typography } from '@/theme';

export const FACE_OVAL_WIDTH = 280;
export const FACE_OVAL_HEIGHT = 380;

function CornerBracket({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const cornerStyle = {
    tl: styles.bracketTL,
    tr: styles.bracketTR,
    bl: styles.bracketBL,
    br: styles.bracketBR,
  }[corner];

  return <View style={[styles.bracket, cornerStyle]} />;
}

type Props = {
  showAiTag?: boolean;
};

export function FaceScanGuide({ showAiTag = true }: Props) {
  const pulse = useSharedValue(1);
  const ringOpacity = useSharedValue(0.85);
  const scanProgress = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.8, { duration: 1500 }),
      ),
      -1,
      false,
    );
    scanProgress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [pulse, ringOpacity, scanProgress]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: ringOpacity.value,
  }));

  const scanStyle = useAnimatedStyle(() => {
    const y = scanProgress.value * FACE_OVAL_HEIGHT - FACE_OVAL_HEIGHT / 2;
    const mid = 1 - Math.abs(scanProgress.value - 0.5) * 2;
    return {
      transform: [{ translateY: y }],
      opacity: 0.15 + mid * 0.45,
    };
  });

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Animated.View style={[styles.oval, ringStyle]}>
        <View style={styles.ovalClip}>
          <Animated.View style={[styles.scanLineWrap, scanStyle]}>
            <LinearGradient
              colors={['transparent', colors.primaryLight, 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.scanLine}
            />
          </Animated.View>
        </View>
        <CornerBracket corner="tl" />
        <CornerBracket corner="tr" />
        <CornerBracket corner="bl" />
        <CornerBracket corner="br" />
      </Animated.View>

      {showAiTag ? (
        <View style={styles.aiTag}>
          <View style={styles.aiDot} />
          <Text style={styles.aiLabel}>AI Alignment Active</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  oval: {
    width: FACE_OVAL_WIDTH,
    height: FACE_OVAL_HEIGHT,
    borderRadius: FACE_OVAL_HEIGHT / 2,
    borderWidth: 3,
    borderColor: colors.primaryPale,
    shadowColor: colors.primaryPale,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  ovalClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: FACE_OVAL_HEIGHT / 2,
  },
  scanLineWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -1,
  },
  scanLine: {
    height: 2,
    width: '100%',
  },
  bracket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bracketTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: radius.lg,
  },
  bracketTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: radius.lg,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: radius.lg,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: radius.lg,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(45, 106, 79, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(45, 106, 79, 0.35)',
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  aiLabel: {
    ...typography.label,
    color: '#B1F0CE',
    letterSpacing: 1.5,
    fontSize: 11,
  },
});
