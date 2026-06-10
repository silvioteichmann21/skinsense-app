import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

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

  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      maxWidth: '100%',
    },
    glowRing: {
      position: 'absolute',
      width: ovalWidth + 28,
      height: ovalHeight + 28,
      borderRadius: (ovalHeight + 28) / 2,
      borderWidth: 1,
      borderColor: colors.primaryGlow,
      opacity: 0.55,
    },
    oval: {
      width: ovalWidth,
      height: ovalHeight,
      borderRadius: ovalHeight / 2,
      borderWidth: 2,
      borderColor: colors.primaryLight,
      shadowColor: colors.primaryLight,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.55,
      shadowRadius: 24,
      overflow: 'hidden',
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
    poseIconWrap: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    poseIcon: {
      opacity: 0.22,
    },
    scanLineWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '50%',
      marginTop: -2,
    },
    scanLine: {
      height: 3,
      width: '100%',
    },
    bracket: {
      position: 'absolute',
      width: bracket,
      height: bracket,
      borderColor: 'rgba(255,255,255,0.75)',
    },
    bracketTL: {
      top: spacing.md,
      left: spacing.md,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopLeftRadius: radius.lg,
    },
    bracketTR: {
      top: spacing.md,
      right: spacing.md,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderTopRightRadius: radius.lg,
    },
    bracketBL: {
      bottom: spacing.md,
      left: spacing.md,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderBottomLeftRadius: radius.lg,
    },
    bracketBR: {
      bottom: spacing.md,
      right: spacing.md,
      borderBottomWidth: 3,
      borderRightWidth: 3,
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
      gap: spacing.sm,
      marginTop: spacing.md,
      justifyContent: 'center',
    },
    stepDot: {
      flex: 1,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    stepDotDone: {
      backgroundColor: colors.ctaGradientMid,
    },
    stepDotActive: {
      backgroundColor: colors.ctaGradientStart,
    },
    alignTrack: {
      width: ovalWidth,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.14)',
      marginTop: spacing.sm,
      overflow: 'hidden',
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
      backgroundColor: colors.glassFill,
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
      letterSpacing: 1.4,
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

  useEffect(() => {
    alignAmount.value = withTiming(poseProgress, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [alignAmount, poseProgress]);

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
      scanLine.value = 0.5;
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

  return (
    <View style={styles.wrap} pointerEvents="none">
      <Animated.View style={[styles.glowRing, glowStyle]} />
      <Animated.View style={[styles.oval, poseAligned && isGuided && styles.ovalAligned, ringStyle]}>
        <View style={styles.ovalClip}>
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
              return (
                <View
                  key={stepId}
                  style={[
                    styles.stepDot,
                    done && styles.stepDotDone,
                    active && !done && styles.stepDotActive,
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.alignTrack}>
            <AnimatedGradient
              colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.ctaGradientEnd]}
              locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.alignFill, alignFillStyle]}
            />
          </View>
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
