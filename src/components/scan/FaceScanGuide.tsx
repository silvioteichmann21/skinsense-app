import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

import {
  CAPTURE_POSE_SEQUENCE,
  FACE_SCAN_POSE_PHASES,
  getCapturePhase,
  getPhaseLocalProgress,
  getPosePhase,
  type FacePoseId,
} from '@/components/scan/facePoseScan';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import {
  FACE_OVAL_BASE_HEIGHT,
  FACE_OVAL_BASE_WIDTH,
  fontFamilies,
  radius,
  spacing,
  useFaceOvalSize,
  useThemedStyles,
  useAppTheme,
} from '@/theme';

export const FACE_OVAL_WIDTH = FACE_OVAL_BASE_WIDTH;
export const FACE_OVAL_HEIGHT = FACE_OVAL_BASE_HEIGHT;

const POSE_ICON: Record<FacePoseId, keyof typeof MaterialCommunityIcons.glyphMap> = {
  front: 'face-recognition',
  left: 'face-man-profile',
  right: 'face-man-profile',
};

const FACE_LANDMARKS = [
  { x: 0.5, y: 0.23, size: 3 },
  { x: 0.35, y: 0.38, size: 3 },
  { x: 0.65, y: 0.38, size: 3 },
  { x: 0.5, y: 0.48, size: 2.5 },
  { x: 0.38, y: 0.58, size: 2.5 },
  { x: 0.62, y: 0.58, size: 2.5 },
  { x: 0.5, y: 0.68, size: 3 },
  { x: 0.31, y: 0.48, size: 2 },
  { x: 0.69, y: 0.48, size: 2 },
];

function CornerBracket({
  corner,
  styles,
}: {
  corner: 'tl' | 'tr' | 'bl' | 'br';
  styles: {
    bracket: object;
    bracketTL: object;
    bracketTR: object;
    bracketBL: object;
    bracketBR: object;
  };
}) {
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
  /** Static pose for guided multi-capture (camera) */
  pose?: FacePoseId;
  /** Poses already captured in this session */
  completedPoses?: FacePoseId[];
  /** Current pose is correctly aligned (guided capture) */
  poseAligned?: boolean;
  /** 0–1 alignment progress during guided capture */
  poseProgress?: number;
  /** Tap a step indicator to jump to that angle */
  onStepPress?: (pose: FacePoseId) => void;
  /** 0–100 from analysis pipeline (Analyzing screen) */
  progress?: number;
  width?: number;
  height?: number;
};

function createStyles(
  colors: AppColors,
  ovalWidth: number,
  ovalHeight: number,
  scale: number,
  compact: boolean,
) {
  const bracket = Math.max(24, Math.round(36 * scale));
  const arrowSize = Math.max(36, Math.round(44 * scale));
  const arrowInset = compact ? spacing.sm : Math.max(spacing.md, Math.round(spacing.xxl * scale));
  const shellPad = Math.max(18, Math.round(24 * scale));

  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      maxWidth: '100%',
      position: 'relative',
    },
    haloShell: {
      position: 'absolute',
      top: -shellPad,
      left: -shellPad,
      width: ovalWidth + shellPad * 2,
      height: ovalHeight + shellPad * 2,
    },
    orbitRing: {
      position: 'absolute',
      top: -Math.round(shellPad * 0.44),
      left: -Math.round(shellPad * 0.44),
      width: ovalWidth + Math.round(shellPad * 0.88),
      height: ovalHeight + Math.round(shellPad * 0.88),
      borderRadius: (ovalHeight + Math.round(shellPad * 0.88)) / 2,
      borderWidth: 1,
      borderColor: 'rgba(183,228,199,0.18)',
    },
    orbitDot: {
      position: 'absolute',
      top: Math.round(shellPad * 0.24),
      alignSelf: 'center',
      width: Math.max(7, Math.round(9 * scale)),
      height: Math.max(7, Math.round(9 * scale)),
      borderRadius: radius.full,
      backgroundColor: colors.ctaGradientStart,
      shadowColor: colors.ctaGradientStart,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.85,
      shadowRadius: 10,
    },
    glowRing: {
      position: 'absolute',
      width: ovalWidth + 34,
      height: ovalHeight + 34,
      borderRadius: (ovalHeight + 34) / 2,
      borderWidth: 1,
      borderColor: colors.primaryGlow,
      opacity: 0.48,
    },
    oval: {
      width: ovalWidth,
      height: ovalHeight,
      borderRadius: ovalHeight / 2,
      borderWidth: 1.5,
      borderColor: 'rgba(215,255,233,0.86)',
      shadowColor: colors.primaryLight,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.38,
      shadowRadius: 28,
      overflow: 'hidden',
      backgroundColor: 'rgba(0,0,0,0.08)',
    },
    ovalAligned: {
      borderColor: colors.success,
      shadowColor: colors.success,
    },
    ovalClip: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
      borderRadius: ovalHeight / 2,
    },
    ovalTint: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.88,
    },
    meshSvg: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.46,
    },
    skinZone: {
      position: 'absolute',
      left: ovalWidth * 0.14,
      width: ovalWidth * 0.72,
      borderRadius: radius.xxl,
      overflow: 'hidden',
    },
    skinZoneTop: {
      top: ovalHeight * 0.17,
      height: ovalHeight * 0.2,
    },
    skinZoneMid: {
      top: ovalHeight * 0.41,
      height: ovalHeight * 0.19,
      left: ovalWidth * 0.1,
      width: ovalWidth * 0.8,
    },
    skinZoneBottom: {
      top: ovalHeight * 0.64,
      height: ovalHeight * 0.18,
      left: ovalWidth * 0.2,
      width: ovalWidth * 0.6,
    },
    skinZoneGradient: {
      flex: 1,
    },
    poseIconWrap: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    poseIcon: {
      opacity: 0.1,
    },
    focusCore: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: Math.max(86, Math.round(104 * scale)),
      height: Math.max(86, Math.round(104 * scale)),
      marginLeft: -Math.max(86, Math.round(104 * scale)) / 2,
      marginTop: -Math.max(86, Math.round(104 * scale)) / 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    focusRing: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: 'rgba(232,121,249,0.25)',
    },
    focusDot: {
      width: Math.max(9, Math.round(11 * scale)),
      height: Math.max(9, Math.round(11 * scale)),
      borderRadius: radius.full,
      backgroundColor: colors.ctaGradientStart,
      shadowColor: colors.ctaGradientStart,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.76,
      shadowRadius: 12,
    },
    scanBeamWrap: {
      position: 'absolute',
      left: -ovalWidth * 0.12,
      right: -ovalWidth * 0.12,
      top: -ovalHeight * 0.1,
      height: ovalHeight * 1.2,
      justifyContent: 'center',
    },
    scanBeam: {
      height: Math.max(74, Math.round(92 * scale)),
      width: '100%',
    },
    scanLineWrap: {
      position: 'absolute',
      left: -ovalWidth * 0.08,
      right: -ovalWidth * 0.08,
      top: '50%',
      marginTop: -4,
    },
    scanLine: {
      height: 8,
      width: '100%',
    },
    scanLineCore: {
      position: 'absolute',
      left: ovalWidth * 0.16,
      right: ovalWidth * 0.16,
      top: 3,
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.86)',
      shadowColor: colors.ctaGradientMid,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
    },
    bracket: {
      position: 'absolute',
      width: bracket,
      height: bracket,
      borderColor: 'rgba(255,255,255,0.86)',
    },
    bracketTL: {
      top: spacing.md,
      left: spacing.md,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderTopLeftRadius: radius.lg,
    },
    bracketTR: {
      top: spacing.md,
      right: spacing.md,
      borderTopWidth: 2,
      borderRightWidth: 2,
      borderTopRightRadius: radius.lg,
    },
    bracketBL: {
      bottom: spacing.md,
      left: spacing.md,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderBottomLeftRadius: radius.lg,
    },
    bracketBR: {
      bottom: spacing.md,
      right: spacing.md,
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderBottomRightRadius: radius.lg,
    },
    arrowCue: {
      position: 'absolute',
      top: '40%',
      width: arrowSize,
      height: arrowSize,
      borderRadius: arrowSize / 2,
      backgroundColor: 'rgba(0,0,0,0.45)',
      borderWidth: 1.5,
      borderColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    arrowCueLeft: {
      left: compact ? arrowInset : -arrowInset,
    },
    arrowCueRight: {
      right: compact ? arrowInset : -arrowInset,
    },
    stepTrack: {
      flexDirection: 'row',
      width: ovalWidth,
      gap: Math.max(spacing.xs, Math.round(spacing.sm * scale)),
      marginTop: spacing.md,
      justifyContent: 'center',
      zIndex: 4,
    },
    stepDot: {
      flex: 1,
      height: Math.max(5, Math.round(6 * scale)),
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    stepDotDone: {
      backgroundColor: colors.ctaGradientMid,
      borderColor: 'rgba(255,255,255,0.28)',
    },
    stepDotActive: {
      backgroundColor: colors.ctaGradientStart,
      borderColor: 'rgba(255,255,255,0.5)',
    },
    stepDotPressable: {
      flex: 1,
      paddingVertical: spacing.sm,
      justifyContent: 'center',
    },
    alignTrack: {
      width: ovalWidth,
      height: 5,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.14)',
      marginTop: spacing.xs,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    alignFill: {
      height: '100%',
      borderRadius: radius.full,
    },
    aiTag: {
      marginTop: spacing.lg,
      borderRadius: radius.full,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    aiTagInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: 'rgba(9,16,14,0.74)',
    },
    aiDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.ctaGradientStart,
    },
    aiLabel: {
      fontFamily: fontFamilies.mono,
      fontSize: 11,
      letterSpacing: 0.8,
      color: colors.onPrimaryContainer,
    },
  });
}

export function FaceScanGuide({
  showAiTag = true,
  pose,
  completedPoses = [],
  poseAligned = false,
  poseProgress = 0,
  onStepPress,
  progress,
  width: widthProp,
  height: heightProp,
}: Props) {
  const fallbackSize = useFaceOvalSize({
    topReserved: 160,
    bottomReserved: 240,
  });
  const width = widthProp ?? fallbackSize.width;
  const height = heightProp ?? fallbackSize.height;
  const scale = width / FACE_OVAL_BASE_WIDTH;
  const isCompact = widthProp == null ? fallbackSize.compact : scale < 0.88;

  const styles = useThemedStyles((colors) =>
    createStyles(colors, width, height, scale, isCompact),
  );
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const isGuided = pose != null;
  const isAnalyzing = progress != null && !isGuided;

  const phase = useMemo(() => {
    if (isGuided) return getCapturePhase(pose);
    if (isAnalyzing) return getPosePhase(progress);
    return getCapturePhase('front');
  }, [isAnalyzing, isGuided, pose, progress]);

  const localProgress = useMemo(
    () => (isAnalyzing ? getPhaseLocalProgress(progress!) : 0),
    [isAnalyzing, progress],
  );

  const pulse = useSharedValue(1);
  const scanLine = useSharedValue(0.5);
  const alignAmount = useSharedValue(0);
  const orbit = useSharedValue(0);
  const shimmer = useSharedValue(0.55);

  useEffect(() => {
    alignAmount.value = withTiming(poseProgress, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [alignAmount, poseProgress]);

  useEffect(() => {
    orbit.value = withRepeat(
      withTiming(360, { duration: 9000, easing: Easing.linear }),
      -1,
      false,
    );
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.52, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [orbit, shimmer]);

  useEffect(() => {
    if (isGuided) {
      if (poseAligned) {
        pulse.value = withRepeat(
          withSequence(
            withTiming(1.012, { duration: 900, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        );
      } else {
        pulse.value = withRepeat(
          withSequence(
            withTiming(1.006, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        );
      }
      scanLine.value = withRepeat(
        withSequence(
          withTiming(0.18, { duration: 1200, easing: Easing.inOut(Easing.cubic) }),
          withTiming(0.82, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
        ),
        -1,
        true,
      );
      return;
    }

    if (isAnalyzing) {
      scanLine.value = withTiming(localProgress, { duration: 280, easing: Easing.linear });
    }
  }, [isAnalyzing, isGuided, localProgress, poseAligned, pulse, scanLine]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.32 + alignAmount.value * 0.45,
  }));

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit.value}deg` }],
  }));

  const counterOrbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-orbit.value * 0.6}deg` }],
    opacity: shimmer.value,
  }));

  const zoneStyle = useAnimatedStyle(() => ({
    opacity: 0.1 + shimmer.value * 0.12,
    transform: [{ scale: 0.98 + shimmer.value * 0.025 }],
  }));

  const beamStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-orbit.value * 0.28}deg` }],
    opacity: 0.12 + shimmer.value * 0.12,
  }));

  const alignFillStyle = useAnimatedStyle(() => ({
    width: Math.max(6, width * alignAmount.value),
  }));

  const scanStyle = useAnimatedStyle(() => {
    const y = scanLine.value * height - height / 2;
    return {
      transform: [{ translateY: y }],
      opacity: isAnalyzing ? 0.5 : 0.35,
    };
  });

  const poseIconName = POSE_ICON[phase.id];
  const mirrorProfile = phase.id === 'right';
  const shellWidth = width + Math.max(40, Math.round(60 * scale));
  const shellHeight = height + Math.max(40, Math.round(60 * scale));
  const shellCenterX = shellWidth / 2;
  const shellCenterY = shellHeight / 2;

  return (
    <View style={styles.wrap} pointerEvents={onStepPress ? 'box-none' : 'none'}>
      <Animated.View style={[styles.haloShell, orbitStyle]}>
        <Svg width={shellWidth} height={shellHeight}>
          <Defs>
            <RadialGradient id="haloGlow" cx="50%" cy="45%" rx="50%" ry="58%">
              <Stop offset="0%" stopColor={colors.ctaGradientStart} stopOpacity="0.04" />
              <Stop offset="72%" stopColor={colors.primaryLight} stopOpacity="0.14" />
              <Stop offset="100%" stopColor={colors.primaryLight} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx={shellCenterX}
            cy={shellCenterY}
            rx={width / 2 + 19}
            ry={height / 2 + 19}
            fill="url(#haloGlow)"
          />
          <Ellipse
            cx={shellCenterX}
            cy={shellCenterY}
            rx={width / 2 + 12}
            ry={height / 2 + 12}
            stroke="rgba(116,212,168,0.42)"
            strokeWidth={1.5}
            strokeDasharray="48 22 10 18"
            fill="none"
          />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.orbitRing, counterOrbitStyle]}>
        <View style={styles.orbitDot} />
      </Animated.View>
      <Animated.View style={[styles.glowRing, glowStyle]} />
      <Animated.View style={[styles.oval, poseAligned && isGuided && styles.ovalAligned, ringStyle]}>
        <View style={styles.ovalClip}>
          <LinearGradient
            colors={[
              'rgba(1,7,6,0.58)',
              'rgba(18,58,43,0.12)',
              'rgba(1,7,6,0.48)',
            ]}
            locations={[0, 0.48, 1]}
            style={styles.ovalTint}
          />
          <Animated.View style={[styles.skinZone, styles.skinZoneTop, zoneStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(116,212,168,0.38)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.skinZoneGradient}
            />
          </Animated.View>
          <Animated.View style={[styles.skinZone, styles.skinZoneMid, zoneStyle]}>
            <LinearGradient
              colors={['rgba(232,121,249,0.08)', 'rgba(183,228,199,0.32)', 'rgba(99,102,241,0.08)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.skinZoneGradient}
            />
          </Animated.View>
          <Animated.View style={[styles.skinZone, styles.skinZoneBottom, zoneStyle]}>
            <LinearGradient
              colors={['transparent', 'rgba(192,132,252,0.24)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.skinZoneGradient}
            />
          </Animated.View>
          <Svg width={width} height={height} style={styles.meshSvg}>
            <G opacity={0.34}>
              <Ellipse
                cx={width / 2}
                cy={height * 0.48}
                rx={width * 0.32}
                ry={height * 0.36}
                stroke={colors.primaryLight}
                strokeWidth={1}
                strokeDasharray="8 10"
                fill="none"
              />
              <Path
                d={`M ${width * 0.28} ${height * 0.37} C ${width * 0.38} ${height * 0.32}, ${width * 0.62} ${height * 0.32}, ${width * 0.72} ${height * 0.37}`}
                stroke={colors.ctaGradientMid}
                strokeWidth={1}
                strokeLinecap="round"
                fill="none"
              />
              <Path
                d={`M ${width * 0.34} ${height * 0.61} C ${width * 0.43} ${height * 0.67}, ${width * 0.57} ${height * 0.67}, ${width * 0.66} ${height * 0.61}`}
                stroke={colors.ctaGradientStart}
                strokeWidth={1}
                strokeLinecap="round"
                fill="none"
              />
              <Line
                x1={width * 0.5}
                y1={height * 0.18}
                x2={width * 0.5}
                y2={height * 0.73}
                stroke={colors.primaryLight}
                strokeWidth={0.8}
                strokeDasharray="5 12"
              />
              <Line
                x1={width * 0.22}
                y1={height * 0.48}
                x2={width * 0.78}
                y2={height * 0.48}
                stroke={colors.primaryLight}
                strokeWidth={0.8}
                strokeDasharray="5 12"
              />
            </G>
            <G opacity={0.88}>
              {FACE_LANDMARKS.map((point) => (
                <Circle
                  key={`${point.x}-${point.y}`}
                  cx={width * point.x}
                  cy={height * point.y}
                  r={Math.max(1.8, point.size * scale)}
                  fill={colors.ctaGradientMid}
                />
              ))}
            </G>
          </Svg>
          <View style={styles.poseIconWrap}>
            <MaterialCommunityIcons
              name={poseIconName}
              size={Math.round(Math.min(width, height) * 0.22)}
              color={colors.ctaGradientMid}
              style={[
                styles.poseIcon,
                mirrorProfile ? { transform: [{ scaleX: -1 }] } : null,
              ]}
            />
          </View>
          <Animated.View style={[styles.focusCore, glowStyle]}>
            <View style={styles.focusRing} />
            <View style={[styles.focusRing, { transform: [{ scale: 0.7 }] }]} />
            <View style={styles.focusDot} />
          </Animated.View>
          {(isAnalyzing || isGuided) ? (
            <Animated.View style={[styles.scanBeamWrap, beamStyle]}>
              <LinearGradient
                colors={[
                  'transparent',
                  'rgba(232,121,249,0.08)',
                  'rgba(116,212,168,0.12)',
                  'transparent',
                ]}
                locations={[0, 0.42, 0.56, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.scanBeam}
              />
            </Animated.View>
          ) : null}
          {(isAnalyzing || isGuided) ? (
            <Animated.View style={[styles.scanLineWrap, scanStyle]}>
              <LinearGradient
                colors={[
                  'transparent',
                  colors.ctaGradientMid,
                  colors.ctaGradientStart,
                  colors.ctaGradientMid,
                  'transparent',
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.scanLine}
              />
              <View style={styles.scanLineCore} />
            </Animated.View>
          ) : null}
        </View>
        <CornerBracket corner="tl" styles={styles} />
        <CornerBracket corner="tr" styles={styles} />
        <CornerBracket corner="bl" styles={styles} />
        <CornerBracket corner="br" styles={styles} />

        {isGuided && phase.id === 'right' ? (
          <View style={[styles.arrowCue, styles.arrowCueRight]}>
            <MaterialCommunityIcons
              name="arrow-right-bold"
              size={Math.max(22, Math.round(28 * scale))}
              color={colors.ctaGradientStart}
            />
          </View>
        ) : null}
        {isGuided && phase.id === 'left' ? (
          <View style={[styles.arrowCue, styles.arrowCueLeft]}>
            <MaterialCommunityIcons
              name="arrow-left-bold"
              size={Math.max(22, Math.round(28 * scale))}
              color={colors.ctaGradientStart}
            />
          </View>
        ) : null}
      </Animated.View>

      {isGuided ? (
        <>
          <View style={styles.stepTrack}>
            {CAPTURE_POSE_SEQUENCE.map((stepId) => {
              const done = completedPoses.includes(stepId);
              const active = stepId === pose;
              const dot = (
                <View
                  style={[
                    styles.stepDot,
                    done && styles.stepDotDone,
                    active && !done && styles.stepDotActive,
                  ]}
                />
              );

              if (!onStepPress) {
                return <View key={stepId} style={styles.stepDotPressable}>{dot}</View>;
              }

              return (
                <Pressable
                  key={stepId}
                  style={styles.stepDotPressable}
                  accessibilityRole="button"
                  accessibilityLabel={t(getCapturePhase(stepId).labelKey)}
                  onPress={() => onStepPress(stepId)}
                >
                  {dot}
                </Pressable>
              );
            })}
          </View>
          {poseProgress > 0 || poseAligned ? (
            <View style={styles.alignTrack}>
              <AnimatedGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
                locations={[0, 0.48, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.alignFill, alignFillStyle]}
              />
            </View>
          ) : null}
        </>
      ) : isAnalyzing ? (
        <View style={styles.stepTrack}>
          {FACE_SCAN_POSE_PHASES.map((item) => {
            const done = progress! >= item.end;
            const active = progress! >= item.start && progress! < item.end;
            return (
              <View
                key={item.id}
                style={[
                  styles.stepDot,
                  done && styles.stepDotDone,
                  active && styles.stepDotActive,
                ]}
              />
            );
          })}
        </View>
      ) : null}

      {showAiTag ? (
        <View style={styles.aiTag}>
          <BlurView intensity={32} tint="dark" style={styles.aiTagInner}>
            <View style={styles.aiDot} />
            <Text style={styles.aiLabel}>{t(phase.labelKey)}</Text>
          </BlurView>
        </View>
      ) : null}
    </View>
  );
}
