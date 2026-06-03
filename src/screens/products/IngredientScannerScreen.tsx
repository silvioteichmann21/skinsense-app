import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

import { IngredientScanViewfinder } from '@/components/products/IngredientScanViewfinder';
import { CameraGlassButton } from '@/components/scan/CameraGlassButton';
import { CameraVignetteOverlay } from '@/components/scan/CameraVignetteOverlay';
import { ScreenBackButton } from '@/components/ui/ScreenBackButton';
import type { RootStackParamList } from '@/core/navigation/types';
import { useTranslation } from '@/i18n/useTranslation';
import { colors, radius, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'IngredientScanner'>;
type ScanMode = 'ingredients' | 'texture';

export function IngredientScannerScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [flashOn, setFlashOn] = useState(true);
  const [mode, setMode] = useState<ScanMode>('ingredients');
  const [capturing, setCapturing] = useState(false);

  const flareOpacity = useSharedValue(0);
  const flareStyle = useAnimatedStyle(() => ({ opacity: flareOpacity.value }));

  const triggerFlare = useCallback(() => {
    flareOpacity.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 120 }),
    );
  }, [flareOpacity]);

  const finishScan = useCallback(() => {
    navigation.replace('IngredientScanResult');
  }, [navigation]);

  const handleCapture = async () => {
    if (capturing || mode !== 'ingredients') return;
    setCapturing(true);
    if (flashOn) triggerFlare();

    try {
      await cameraRef.current?.takePictureAsync({ quality: 0.85 });
      finishScan();
    } catch {
      finishScan();
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionRoot}>
        <ActivityIndicator color={colors.primaryPale} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionRoot}>
        <StatusBar style="light" />
        <Text style={styles.permissionText}>{t('scan.cameraRequired')}</Text>
        <Pressable style={styles.permissionBtn} onPress={() => requestPermission()}>
          <Text style={styles.permissionBtnLabel}>{t('common.openSettings')}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.permissionBack}>{t('common.goBack')}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Animated.View style={[styles.flare, flareStyle]} pointerEvents="none" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenBackButton variant="inverse" />
        <Text style={styles.headerTitle}>{t('products.scanTitle')}</Text>
        <Pressable
          style={styles.flashBtn}
          onPress={() => setFlashOn((v) => !v)}
          accessibilityLabel={flashOn ? t('products.flashOn') : t('products.flashOff')}
        >
          <MaterialCommunityIcons
            name={flashOn ? 'flash' : 'flash-off'}
            size={24}
            color={colors.white}
          />
        </Pressable>
      </View>

      <View style={styles.preview}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
        <CameraVignetteOverlay />
        <View style={styles.centered}>
          <IngredientScanViewfinder />
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <View style={styles.controls}>
          <CameraGlassButton
            icon="image-outline"
            accessibilityLabel={t('common.gallery')}
            onPress={() => Alert.alert(t('common.gallery'), t('common.gallerySoon'))}
          />
          <Pressable
            style={styles.shutterOuter}
            onPress={handleCapture}
            disabled={capturing}
            accessibilityLabel={t('products.captureLabel')}
          >
            <View style={styles.shutterRing} />
            <View style={styles.shutter}>
              {capturing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <MaterialCommunityIcons name="camera" size={32} color={colors.white} />
              )}
            </View>
          </Pressable>
          <CameraGlassButton
            icon="help-circle-outline"
            accessibilityLabel={t('products.help')}
            onPress={() => Alert.alert(t('products.scanTitle'), t('products.scanHint'))}
          />
        </View>
        <View style={styles.modeRow}>
          <Pressable onPress={() => setMode('ingredients')}>
            <Text style={[styles.modeLabel, mode === 'ingredients' && styles.modeActive]}>
              INGREDIENTS
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode('texture');
              Alert.alert('Skin texture', 'Texture scan mode is coming soon.');
            }}
          >
            <Text style={[styles.modeLabel, mode === 'texture' && styles.modeActive]}>
              SKIN TEXTURE
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  flare: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
  },
  headerTitle: {
    ...typography.h3,
    flex: 1,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  flashBtn: {
    width: touchTarget,
    height: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    position: 'relative',
  },
  centered: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
    gap: spacing.lg,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 280,
    alignSelf: 'center',
    width: '100%',
  },
  shutterOuter: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterRing: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: 'rgba(183, 228, 199, 0.5)',
  },
  shutter: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  modeLabel: {
    ...typography.label,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'none',
    paddingBottom: spacing.xs,
  },
  modeActive: {
    color: colors.primaryPale,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryPale,
  },
  permissionRoot: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  permissionText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
  },
  permissionBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  permissionBtnLabel: {
    ...typography.h3,
    color: colors.white,
  },
  permissionBack: {
    ...typography.body,
    color: colors.primaryPale,
  },
});
