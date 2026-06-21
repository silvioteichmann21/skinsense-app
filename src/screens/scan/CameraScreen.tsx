import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CameraGlassButton } from '@/components/scan/CameraGlassButton';
import { GradientButton } from '@/components/ui/GradientButton';
import { PermissionSheet } from '@/components/scan/PermissionSheet';
import { persistScanImage } from '@/services/scan/scanImageStorage';
import { useSkinStore } from '@/store/skinStore';
import { CameraVignetteOverlay } from '@/components/scan/CameraVignetteOverlay';
import type { FacePoseId } from '@/components/scan/facePoseScan';
import { FaceScanGuide } from '@/components/scan/FaceScanGuide';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import type { TranslationKey } from '@/i18n/useTranslation';
import { CAPTURE_POSE_SEQUENCE, getCapturePhase } from '@/components/scan/facePoseScan';
import {
  CAPTURE_STEP_COUNT,
  delay,
  getCaptureHintKey,
  getCompletedPoses,
  getCurrentCapturePose,
  POSE_TRANSITION_MS,
  type CapturePhotos,
} from '@/screens/scan/cameraCaptureFlow';
import type { AngleImageUris } from '@/types/scanPipeline';
import { startScanFromGallery } from '@/screens/scan/startScanFromGallery';
import type { AppColors } from '@/theme/palettes';
import {
  glow,
  radius,
  spacing,
  typography,
  useCameraScanLayout,
  useThemedStyles,
  useAppTheme,
} from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Camera'>;
type CameraFacing = 'front' | 'back';
type CaptureMode = 'selfie' | 'scan' | 'video';

const MODES: { id: CaptureMode; labelKey: 'scan.modeSelfie' | 'scan.modeScan' | 'scan.modeVideo' }[] = [
  { id: 'selfie', labelKey: 'scan.modeSelfie' },
  { id: 'scan', labelKey: 'scan.modeScan' },
  { id: 'video', labelKey: 'scan.modeVideo' },
];

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionRoot: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.lg,
  },
  permissionText: {
    ...typography.bodyLg,
    color: colors.textInverse,
    textAlign: 'center',
  },
  permissionBtn: {
    minWidth: 240,
  },
  permissionBtnLabel: {
    ...typography.bodyLg,
    color: colors.textInverse,
    fontFamily: typography.h3.fontFamily,
  },
  permissionBack: {
    paddingVertical: spacing.sm,
  },
  permissionBackLabel: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
  },
  center: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  hintPill: {
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(215,255,233,0.18)',
    shadowColor: colors.primaryLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
  },
  hintInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(4,10,9,0.68)',
  },
  consoleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  consoleCopy: {
    flex: 1,
    minWidth: 0,
  },
  consoleKicker: {
    fontFamily: typography.score.fontFamily,
    fontSize: 10,
    lineHeight: 14,
    color: colors.primaryLight,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  consoleTitle: {
    ...typography.h3,
    color: colors.onPrimaryContainer,
    lineHeight: 23,
    letterSpacing: 0,
  },
  hintText: {
    ...typography.caption,
    color: 'rgba(234,247,239,0.66)',
    letterSpacing: 0,
    textTransform: 'none',
    fontSize: 12,
    lineHeight: 17,
  },
  stepBadge: {
    marginTop: spacing.xs,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(215,255,233,0.16)',
  },
  stepBadgeInner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(4,10,9,0.52)',
  },
  stepBadgeText: {
    fontFamily: typography.score.fontFamily,
    fontSize: 11,
    color: colors.onPrimaryContainer,
    letterSpacing: 1.2,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
    overflow: 'hidden',
    ...glow(colors.ctaGlow, 'lg'),
  },
  shutterPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: radius.full,
    backgroundColor: colors.ctaTint,
    borderWidth: 1,
    borderColor: colors.ctaGradientStart,
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.76)',
  },
  shutterCore: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primaryDark,
  },
  shutterDisabled: {
    opacity: 0.75,
  },
  modeTrack: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  modeTrackCompact: {
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  modeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  modeItemActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modeLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.48)',
    letterSpacing: 0.8,
  },
  modeLabelActive: {
    color: colors.onPrimaryContainer,
    fontFamily: typography.h3.fontFamily,
  },
  modeUnderline: {
    width: 20,
    height: 2,
    backgroundColor: colors.ctaGradientStart,
    borderRadius: 1,
    marginTop: spacing.xs,
    shadowColor: colors.ctaGradientStart,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  flare: {
    backgroundColor: colors.textInverse,
    zIndex: 100,
  },
});
}

export function CameraScreen() {
  const styles = useThemedStyles(createStyles);
  const { colors, statusBarStyle } = useAppTheme();

  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraFacing>('front');
  const [flashOn, setFlashOn] = useState(false);
  const [mode, setMode] = useState<CaptureMode>('scan');
  const [capturing, setCapturing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [galleryDenied, setGalleryDenied] = useState<{ canAskAgain: boolean } | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const scanLayout = useCameraScanLayout(scanActive);
  const [captureStep, setCaptureStep] = useState(0);
  const [capturePhotos, setCapturePhotos] = useState<CapturePhotos>({});
  const [stepJustCaptured, setStepJustCaptured] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const scanPhotosRef = useRef<CapturePhotos>({});

  const flareOpacity = useSharedValue(0);
  const shutterPulse = useSharedValue(0);

  const flareStyle = useAnimatedStyle(() => ({
    opacity: flareOpacity.value,
  }));

  const shutterPulseStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + shutterPulse.value * 0.24,
    transform: [{ scale: 0.82 + shutterPulse.value * 0.28 }],
  }));

  useEffect(() => {
    shutterPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [shutterPulse]);

  const triggerFlare = useCallback(() => {
    flareOpacity.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 120 }),
    );
  }, [flareOpacity]);

  const goToAnalyzing = useCallback(
    async (photos: CapturePhotos) => {
      const frontUri = photos.front;
      if (!frontUri) return;

      const angleImageUris: AngleImageUris = {};
      for (const pose of CAPTURE_POSE_SEQUENCE) {
        const raw = photos[pose];
        if (!raw) continue;
        const alreadyStored = raw.includes('/scans/');
        angleImageUris[pose] = alreadyStored ? raw : await persistScanImage(raw);
      }

      const storedFront = angleImageUris.front;
      if (!storedFront) return;

      useSkinStore.getState().setScanImage(storedFront);
      useSkinStore.getState().setPendingAnglePhotos(angleImageUris);
      navigation.replace('Analyzing', { imageUri: storedFront });
    },
    [navigation],
  );

  const resetScanSession = useCallback(() => {
    setScanActive(false);
    setCaptureStep(0);
    setCapturePhotos({});
    scanPhotosRef.current = {};
    setStepJustCaptured(false);
    setIsSnapping(false);
    setCapturing(false);
  }, []);

  const takeScanPhoto = useCallback(async (): Promise<string | null> => {
    setIsSnapping(true);
    if (flashOn) {
      triggerFlare();
    }
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.92,
        shutterSound: false,
      });
      return photo?.uri ?? null;
    } finally {
      setIsSnapping(false);
    }
  }, [flashOn, triggerFlare]);

  const selectCaptureStep = useCallback((pose: FacePoseId) => {
    const stepIndex = CAPTURE_POSE_SEQUENCE.indexOf(pose);
    if (stepIndex < 0) return;

    setScanActive(true);
    setCaptureStep(stepIndex);
    setStepJustCaptured(false);
  }, []);

  /** Shutter tap = capture the selected step; step dots jump between angles. */
  const captureScanStep = useCallback(async () => {
    if (capturing || isSnapping) return;

    if (!scanActive) {
      setScanActive(true);
      setCaptureStep(0);
      setCapturePhotos({});
      scanPhotosRef.current = {};
      setStepJustCaptured(false);
    }

    const step = captureStep;
    const pose = getCurrentCapturePose(step);

    setCapturing(true);
    try {
      const uri = await takeScanPhoto();
      if (!uri) {
        Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
        return;
      }

      const nextPhotos: CapturePhotos = { ...scanPhotosRef.current, [pose]: uri };
      scanPhotosRef.current = nextPhotos;
      setCapturePhotos(nextPhotos);
      setStepJustCaptured(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const isLastStep = step >= CAPTURE_STEP_COUNT - 1;
      if (isLastStep) {
        if (!nextPhotos.front) {
          Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
          return;
        }
        setScanActive(false);
        await goToAnalyzing(nextPhotos);
        return;
      }

      await delay(POSE_TRANSITION_MS);
      setStepJustCaptured(false);
      setCaptureStep(step + 1);
    } catch {
      Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
    } finally {
      setCapturing(false);
    }
  }, [captureStep, capturing, goToAnalyzing, isSnapping, scanActive, t, takeScanPhoto]);

  const handleCapture = async () => {
    if (mode === 'video') {
      Alert.alert(t('scan.modeVideo'), t('scan.videoSoon'));
      return;
    }

    if (capturing || isSnapping) return;

    if (mode === 'scan') {
      await captureScanStep();
      return;
    }

    setCapturing(true);
    try {
      const uri = await takeScanPhoto();
      if (!uri) {
        Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
        return;
      }
      await goToAnalyzing({ front: uri });
    } catch {
      Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
    } finally {
      setCapturing(false);
    }
  };

  const handleGallery = async () => {
    if (capturing) return;
    setCapturing(true);
    setGalleryDenied(null);
    setCameraActive(false);
    try {
      const result = await startScanFromGallery(navigation);
      if (result.status === 'denied') {
        setGalleryDenied({ canAskAgain: result.canAskAgain });
      } else if (result.status === 'error') {
        Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
      }
    } finally {
      setCapturing(false);
      setCameraActive(true);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const currentCapturePose: FacePoseId | undefined =
    mode === 'scan' ? getCurrentCapturePose(scanActive ? captureStep : 0) : undefined;
  const completedCapturePoses = getCompletedPoses(capturePhotos);
  const scanHintKey: TranslationKey = !scanActive
    ? 'scan.captureTapToStart'
    : isSnapping
      ? 'scan.captureScanning'
      : stepJustCaptured
        ? 'scan.captureStepDone'
        : getCaptureHintKey(captureStep);
  const shutterBusy = capturing || isSnapping;
  const currentPhase = getCapturePhase(currentCapturePose ?? 'front');
  const activeModeLabelKey = MODES.find((item) => item.id === mode)?.labelKey ?? 'scan.modeScan';
  const consoleIcon =
    mode === 'scan' ? 'face-recognition' : mode === 'selfie' ? 'camera-outline' : 'video-outline';
  const consoleTitle = mode === 'scan' ? t(currentPhase.labelKey) : t(activeModeLabelKey);
  const consoleHint = mode === 'scan' ? t(scanHintKey) : t('scan.holdStill');

  if (!permission) {
    return (
      <View style={styles.permissionRoot}>
        <StatusBar style={statusBarStyle} />
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionRoot}>
        <StatusBar style={statusBarStyle} />
        <MaterialCommunityIcons name="camera-outline" size={48} color={colors.primaryPale} />
        <Text style={styles.permissionText}>{t('scan.cameraRequired')}</Text>
        <GradientButton
          style={styles.permissionBtn}
          onPress={async () => {
            const result = await requestPermission();
            if (!result.granted && !result.canAskAgain) {
              Alert.alert(t('scan.cameraNeeded'), t('scan.cameraNeededBody'), [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.openSettings'), onPress: () => Linking.openSettings() },
              ]);
            }
          }}
        >
          <Text style={styles.permissionBtnLabel}>{t('scan.grantCameraAccess')}</Text>
        </GradientButton>
        <GradientButton style={styles.permissionBtn} onPress={() => void handleGallery()}>
          <Text style={styles.permissionBtnLabel}>{t('scan.chooseFromLibrary')}</Text>
        </GradientButton>
        <Pressable style={styles.permissionBack} onPress={() => navigation.goBack()}>
          <Text style={styles.permissionBackLabel}>{t('common.goBack')}</Text>
        </Pressable>

        <PermissionSheet
          visible={galleryDenied !== null}
          title={t('scan.galleryNeeded')}
          body={t('scan.galleryNeededBody')}
          icon="image-multiple"
          primaryLabel={
            galleryDenied?.canAskAgain
              ? t('scan.grantGalleryAccess')
              : t('common.openSettings')
          }
          onPrimary={() => {
            const canAskAgain = galleryDenied?.canAskAgain ?? false;
            setGalleryDenied(null);
            if (canAskAgain) {
              void handleGallery();
              return;
            }
            void Linking.openSettings();
          }}
          secondaryLabel={galleryDenied?.canAskAgain ? t('common.openSettings') : undefined}
          onSecondary={
            galleryDenied?.canAskAgain
              ? () => {
                  setGalleryDenied(null);
                  void Linking.openSettings();
                }
              : undefined
          }
          cancelLabel={t('common.cancel')}
          onClose={() => setGalleryDenied(null)}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style={statusBarStyle} />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        active={cameraActive}
        enableTorch={flashOn && facing === 'back'}
      />

      <CameraVignetteOverlay />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.base }]}>
        <CameraGlassButton
          icon="close"
          accessibilityLabel="Close scanner"
          onPress={() => {
            resetScanSession();
            navigation.goBack();
          }}
        />
        <CameraGlassButton
          icon={flashOn ? 'flash' : 'flash-off'}
          accessibilityLabel={flashOn ? t('scan.flashOn') : t('scan.flashOff')}
          iconColor={flashOn ? colors.textInverse : 'rgba(255,255,255,0.45)'}
          onPress={() => setFlashOn((v) => !v)}
        />
      </View>

      <View
        style={[
          styles.center,
          {
            top: scanLayout.guideTop,
            bottom: scanLayout.guideBottom,
            paddingHorizontal: spacing.base,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={[styles.hintPill, { maxWidth: scanLayout.hintMaxWidth, width: '100%' }]}>
          <BlurView intensity={48} tint="dark" style={styles.hintInner}>
            <LinearGradient
              colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.consoleIcon}
            >
              <MaterialCommunityIcons
                name={consoleIcon}
                size={22}
                color={colors.textInverse}
              />
            </LinearGradient>
            <View style={styles.consoleCopy}>
              <Text style={styles.consoleKicker} numberOfLines={1}>
                {t(activeModeLabelKey)}
              </Text>
              <Text style={styles.consoleTitle} numberOfLines={1} adjustsFontSizeToFit>
                {consoleTitle}
              </Text>
              <Text
                style={[styles.hintText, { fontSize: Math.max(11, scanLayout.hintFontSize - 1) }]}
                numberOfLines={1}
              >
                {consoleHint}
              </Text>
            </View>
          </BlurView>
        </View>
        {mode === 'scan' ? (
          <>
            <FaceScanGuide
              pose={currentCapturePose}
              completedPoses={completedCapturePoses}
              onStepPress={capturing || isSnapping ? undefined : selectCaptureStep}
              width={scanLayout.oval.width}
              height={scanLayout.oval.height}
            />
            {scanActive ? (
              <View style={styles.stepBadge}>
                <BlurView intensity={32} tint="dark" style={styles.stepBadgeInner}>
                  <Text style={styles.stepBadgeText}>
                    {t('scan.captureStep', {
                      step: String(captureStep + 1),
                      total: String(CAPTURE_STEP_COUNT),
                    })}
                  </Text>
                </BlurView>
              </View>
            ) : null}
          </>
        ) : (
          <FaceScanGuide
            showAiTag={false}
            pose="front"
            width={scanLayout.oval.width}
            height={scanLayout.oval.height}
          />
        )}
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg }]}>
        <View style={[styles.controlsRow, { gap: scanLayout.controlsGap }]}>
          <CameraGlassButton
            icon="image-multiple-outline"
            accessibilityLabel={t('scan.chooseFromLibrary')}
            onPress={() => void handleGallery()}
            disabled={capturing}
          />

          <Pressable
            style={[
              styles.shutterOuter,
              {
                width: scanLayout.shutter.outer,
                height: scanLayout.shutter.outer,
                borderRadius: scanLayout.shutter.outer / 2,
              },
              shutterBusy && styles.shutterDisabled,
            ]}
            accessibilityLabel={mode === 'scan' ? 'Start skin scan' : 'Capture photo'}
            onPress={() => void handleCapture()}
            disabled={shutterBusy}
          >
            <Animated.View pointerEvents="none" style={[styles.shutterPulse, shutterPulseStyle]} />
            <View
              style={[
                styles.shutterInner,
                {
                  width: scanLayout.shutter.inner,
                  height: scanLayout.shutter.inner,
                  borderRadius: scanLayout.shutter.inner / 2,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.ctaGradientStart, colors.ctaGradientMid, colors.primaryLight]}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.shutterCore,
                  {
                    width: scanLayout.shutter.core,
                    height: scanLayout.shutter.core,
                    borderRadius: scanLayout.shutter.core / 2,
                  },
                ]}
              >
                {shutterBusy ? (
                  <ActivityIndicator color={colors.textInverse} size="small" />
                ) : (
                  <View
                    style={[
                      styles.shutterDot,
                      {
                        width: scanLayout.shutter.dot,
                        height: scanLayout.shutter.dot,
                        borderRadius: scanLayout.shutter.dot / 2,
                      },
                    ]}
                  />
                )}
              </LinearGradient>
            </View>
          </Pressable>

          <CameraGlassButton
            icon="camera-flip-outline"
            accessibilityLabel="Switch camera"
            onPress={toggleFacing}
            disabled={capturing}
          />
        </View>

        <BlurView
          intensity={40}
          tint="dark"
          style={[
            styles.modeTrack,
            scanLayout.compact && styles.modeTrackCompact,
          ]}
        >
          {MODES.map((item) => {
            const active = mode === item.id;
            return (
              <Pressable
                key={item.id}
                style={[styles.modeItem, active && styles.modeItemActive]}
                onPress={() => {
                  if (item.id === 'video') {
                    Alert.alert(t('scan.modeVideo'), t('scan.videoSoon'));
                    return;
                  }
                  if (mode === 'scan' && item.id !== 'scan') {
                    resetScanSession();
                  }
                  setMode(item.id);
                  if (item.id === 'scan') {
                    setFacing('front');
                    resetScanSession();
                  }
                }}
              >
                <Text style={[styles.modeLabel, active && styles.modeLabelActive]}>
                  {t(item.labelKey)}
                </Text>
                {active ? <View style={styles.modeUnderline} /> : <View style={{ height: 10 }} />}
              </Pressable>
            );
          })}
        </BlurView>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.flare, flareStyle]}
      />

      <PermissionSheet
        visible={galleryDenied !== null}
        title={t('scan.galleryNeeded')}
        body={t('scan.galleryNeededBody')}
        icon="image-multiple"
        primaryLabel={
          galleryDenied?.canAskAgain
            ? t('scan.grantGalleryAccess')
            : t('common.openSettings')
        }
        onPrimary={() => {
          const canAskAgain = galleryDenied?.canAskAgain ?? false;
          setGalleryDenied(null);
          if (canAskAgain) {
            void handleGallery();
            return;
          }
          void Linking.openSettings();
        }}
        secondaryLabel={galleryDenied?.canAskAgain ? t('common.openSettings') : undefined}
        onSecondary={
          galleryDenied?.canAskAgain
            ? () => {
                setGalleryDenied(null);
                void Linking.openSettings();
              }
            : undefined
        }
        cancelLabel={t('common.cancel')}
        onClose={() => setGalleryDenied(null)}
      />
    </View>
  );
}
