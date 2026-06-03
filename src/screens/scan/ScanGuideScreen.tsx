import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { RootStackParamList } from '@/core/navigation/types';
import { getSkipScanTips, setSkipScanTips } from '@/core/storage/scanPreferences';
import { useScanTips } from '@/i18n/content/useLocalizedContent';
import { useTranslation } from '@/i18n/useTranslation';
import { SCAN_GUIDE_HERO_URI } from '@/screens/scan/scanGuideContent';
import { colors, radius, shadows, spacing, touchTarget, typography } from '@/theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ScanGuide'>;

export function ScanGuideScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation();
  const scanTips = useScanTips();
  const [permission, requestPermission] = useCameraPermissions();

  const [skipTips, setSkipTips] = useState(false);
  const [checkingSkip, setCheckingSkip] = useState(true);
  const [openingCamera, setOpeningCamera] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const heroSize = screenWidth - spacing.base * 2;
  const footerPadBottom = Math.max(insets.bottom, spacing.base) + spacing.sm;

  const navigateToCamera = useCallback(async () => {
    setOpeningCamera(true);
    try {
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          setPermissionDenied(true);
          return;
        }
      }
      navigation.navigate('Camera');
    } finally {
      setOpeningCamera(false);
    }
  }, [navigation, permission?.granted, requestPermission]);

  const handleOpenCamera = useCallback(async () => {
    await setSkipScanTips(skipTips);
    await navigateToCamera();
  }, [navigateToCamera, skipTips]);

  useEffect(() => {
    let active = true;
    getSkipScanTips().then((skip) => {
      if (!active) return;
      setCheckingSkip(false);
      if (skip) {
        navigateToCamera();
      }
    });
    return () => {
      active = false;
    };
  }, [navigateToCamera]);

  if (checkingSkip) {
    return (
      <View style={[styles.root, styles.loading]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <ScreenHeader topInset={insets.top} title={t('scan.title')} style={styles.headerBar} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: 200 + footerPadBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { width: heroSize, height: heroSize }]}>
          <LinearGradient
            colors={['transparent', `${colors.primary}0D`]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <Image
            source={{ uri: SCAN_GUIDE_HERO_URI }}
            style={styles.heroImage}
            contentFit="contain"
            transition={200}
          />
        </View>

        <Text style={styles.title}>{t('scan.getReady')}</Text>
        <Text style={styles.subtitle}>{t('scan.getReadySub')}</Text>

        <View style={styles.tips}>
          {scanTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipIconWrap}>
                <MaterialCommunityIcons name={tip.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
        <Pressable
          onPress={handleOpenCamera}
          disabled={openingCamera}
          style={({ pressed }) => [
            styles.cta,
            pressed && styles.ctaPressed,
            openingCamera && styles.ctaDisabled,
          ]}
        >
          {openingCamera ? (
            <ActivityIndicator color={colors.textInverse} />
          ) : (
            <>
              <Text style={styles.ctaLabel}>{t('scan.openCamera')}</Text>
              <MaterialCommunityIcons name="camera" size={20} color={colors.textInverse} />
            </>
          )}
        </Pressable>

        <Pressable
          onPress={() => setSkipTips((v) => !v)}
          style={styles.skipRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: skipTips }}
        >
          <View style={[styles.checkbox, skipTips && styles.checkboxChecked]}>
            {skipTips ? (
              <MaterialCommunityIcons name="check" size={14} color={colors.textInverse} />
            ) : null}
          </View>
          <Text style={styles.skipLabel}>{t('scan.skipTips')}</Text>
        </Pressable>
      </View>

      <PermissionDeniedSheet
        visible={permissionDenied}
        onClose={() => setPermissionDenied(false)}
        onOpenSettings={() => {
          setPermissionDenied(false);
          Linking.openSettings();
        }}
      />
    </View>
  );
}

function PermissionDeniedSheet({
  visible,
  onClose,
  onOpenSettings,
}: {
  visible: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.sheetTitle}>{t('scan.cameraNeeded')}</Text>
          <Text style={styles.sheetBody}>{t('scan.cameraNeededBody')}</Text>
          <Pressable onPress={onOpenSettings} style={styles.sheetPrimary}>
            <Text style={styles.sheetPrimaryLabel}>{t('common.openSettings')}</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.sheetCancel}>
            <Text style={styles.sheetCancelLabel}>{t('common.cancel')}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBar: {
    backgroundColor: `${colors.background}CC`,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
  },
  hero: {
    alignSelf: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    padding: spacing.xxl,
  },
  title: {
    ...typography.h2,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  tips: {
    gap: spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  tipIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  tipText: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    fontFamily: typography.bodyLg.fontFamily,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderMuted,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.base,
    ...shadows.lg,
  },
  cta: {
    height: touchTarget,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  ctaPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#BFC9C1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  skipLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'none',
    letterSpacing: 0,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sheetBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  sheetPrimary: {
    height: touchTarget,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  sheetPrimaryLabel: {
    ...typography.h3,
    color: colors.textInverse,
  },
  sheetCancel: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  sheetCancelLabel: {
    ...typography.body,
    color: colors.primary,
  },
});
