import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
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
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CameraGlassButton } from '@/components/scan/CameraGlassButton';
import { persistScanImage } from '@/services/scan/scanImageStorage';
import { useSkinStore } from '@/store/skinStore';
import { CameraVignetteOverlay } from '@/components/scan/CameraVignetteOverlay';
import { FaceScanGuide } from '@/components/scan/FaceScanGuide';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { pickFacePhotoFromGallery } from '@/screens/scan/pickFacePhoto';
import { colors, radius, spacing, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Camera'>;
type CameraFacing = 'front' | 'back';
type CaptureMode = 'selfie' | 'scan' | 'video';

const MODES: { id: CaptureMode; labelKey: 'scan.modeSelfie' | 'scan.modeScan' | 'scan.modeVideo' }[] = [
  { id: 'selfie', labelKey: 'scan.modeSelfie' },
  { id: 'scan', labelKey: 'scan.modeScan' },
  { id: 'video', labelKey: 'scan.modeVideo' },
];

export function CameraScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraFacing>('front');
  const [flashOn, setFlashOn] = useState(false);
  const [mode, setMode] = useState<CaptureMode>('scan');
  const [capturing, setCapturing] = useState(false);

  const flareOpacity = useSharedValue(0);

  const flareStyle = useAnimatedStyle(() => ({
    opacity: flareOpacity.value,
  }));

  const triggerFlare = useCallback(() => {
    flareOpacity.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 120 }),
    );
  }, [flareOpacity]);

  const goToAnalyzing = useCallback(
    async (uri: string) => {
      const storedUri = await persistScanImage(uri);
      useSkinStore.getState().setScanImage(storedUri);
      navigation.replace('Analyzing', { imageUri: storedUri });
    },
    [navigation],
  );

  const handleCapture = async () => {
    if (capturing || mode === 'video') {
      if (mode === 'video') {
        Alert.alert(t('scan.modeVideo'), t('scan.videoSoon'));
      }
      return;
    }

    setCapturing(true);
    if (flashOn) {
      triggerFlare();
    }

    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.92,
        shutterSound: false,
      });
      if (!photo?.uri) {
        Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
        return;
      }
      await goToAnalyzing(photo.uri);
    } catch {
      Alert.alert(t('scan.analysisFailed'), t('scan.captureFailed'));
    } finally {
      setCapturing(false);
    }
  };

  const handleGallery = async () => {
    if (capturing) return;
    setCapturing(true);
    try {
      const uri = await pickFacePhotoFromGallery();
      if (uri) {
        await goToAnalyzing(uri);
      }
    } finally {
      setCapturing(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  if (!permission) {
    return (
      <View style={styles.permissionRoot}>
        <StatusBar style="light" />
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionRoot}>
        <StatusBar style="light" />
        <MaterialCommunityIcons name="camera-outline" size={48} color={colors.primaryPale} />
        <Text style={styles.permissionText}>{t('scan.cameraRequired')}</Text>
        <Pressable
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
        </Pressable>
        <Pressable style={styles.permissionBack} onPress={() => navigation.goBack()}>
          <Text style={styles.permissionBackLabel}>{t('common.goBack')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        enableTorch={flashOn && facing === 'back'}
      />

      <CameraVignetteOverlay />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.base }]}>
        <CameraGlassButton
          icon="close"
          accessibilityLabel="Close scanner"
          onPress={() => navigation.goBack()}
        />
        <CameraGlassButton
          icon={flashOn ? 'flash' : 'flash-off'}
          accessibilityLabel={flashOn ? t('products.flashOn') : t('products.flashOff')}
          iconColor={flashOn ? colors.textInverse : 'rgba(255,255,255,0.45)'}
          onPress={() => setFlashOn((v) => !v)}
        />
      </View>

      <View style={styles.center} pointerEvents="none">
        <BlurView intensity={40} tint="dark" style={styles.hintPill}>
          <Text style={styles.hintText}>{t('scan.holdStill')}</Text>
        </BlurView>
        <FaceScanGuide />
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.xl) + spacing.lg }]}>
        <View style={styles.controlsRow}>
          <Pressable
            style={styles.sideControl}
            accessibilityLabel="Choose from gallery"
            onPress={() => void handleGallery()}
            disabled={capturing}
          >
            <MaterialCommunityIcons name="image-outline" size={28} color={colors.textInverse} />
          </Pressable>

          <Pressable
            style={[styles.shutterOuter, capturing && styles.shutterDisabled]}
            accessibilityLabel="Capture scan"
            onPress={() => void handleCapture()}
            disabled={capturing}
          >
            <View style={styles.shutterInner}>
              {capturing ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <View style={styles.shutterDot} />
              )}
            </View>
          </Pressable>

          <Pressable
            style={styles.sideControl}
            accessibilityLabel="Switch camera"
            onPress={toggleFacing}
            disabled={capturing}
          >
            <MaterialCommunityIcons name="camera-flip-outline" size={28} color={colors.textInverse} />
          </Pressable>
        </View>

        <View style={styles.modeRow}>
          {MODES.map((item) => {
            const active = mode === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (item.id === 'video') {
                    Alert.alert(t('scan.modeVideo'), t('scan.videoSoon'));
                    return;
                  }
                  setMode(item.id);
                  if (item.id === 'scan') setFacing('front');
                }}
              >
                <Text style={[styles.modeLabel, active && styles.modeLabelActive]}>
                  {t(item.labelKey)}
                </Text>
                {active ? <View style={styles.modeUnderline} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.flare, flareStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
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
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  hintPill: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  hintText: {
    ...typography.h3,
    color: colors.textInverse,
    letterSpacing: 0.5,
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
    gap: spacing.xxl * 2,
    marginBottom: spacing.xl,
  },
  sideControl: {
    opacity: 0.6,
    width: 48,
    alignItems: 'center',
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(45, 106, 79, 0.25)',
  },
  shutterDisabled: {
    opacity: 0.75,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  modeLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    paddingBottom: spacing.xs,
  },
  modeLabelActive: {
    color: colors.textInverse,
    fontFamily: typography.h3.fontFamily,
  },
  modeUnderline: {
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
    marginTop: 2,
  },
  flare: {
    backgroundColor: colors.textInverse,
    zIndex: 100,
  },
});
