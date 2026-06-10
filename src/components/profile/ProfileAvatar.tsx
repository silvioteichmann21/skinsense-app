import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { ProfilePhotoSheet } from '@/components/profile/ProfilePhotoSheet';
import { GradientSurface } from '@/components/ui/GradientButton';
import { PermissionSheet } from '@/components/scan/PermissionSheet';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';
import { useTranslation } from '@/i18n/useTranslation';
import type { AppColors } from '@/theme/palettes';
import { radius, shadows, useAppTheme, useThemedStyles } from '@/theme';

type Size = 'md' | 'lg';

type Props = {
  size?: Size;
  showEdit?: boolean;
  style?: ViewStyle;
};

const SIZES: Record<Size, { outer: number; edit: number; icon: number }> = {
  md: { outer: 64, edit: 32, icon: 16 },
  lg: { outer: 104, edit: 36, icon: 18 },
};

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    wrap: {
      position: 'relative',
      alignItems: 'center',
    },
    ring: {
      padding: 3,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.hairline,
      backgroundColor: colors.surfaceElevated,
      ...shadows.md,
    },
    avatar: {
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.ctaTint,
      backgroundColor: colors.imagePlaceholder,
    },
    placeholder: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceMuted,
    },
    editBtn: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      borderRadius: radius.full,
      borderWidth: 2,
      borderColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...shadows.sm,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.full,
      backgroundColor: colors.overlayLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export function ProfileAvatar({ size = 'lg', showEdit = false, style }: Props) {
  const styles = useThemedStyles(createStyles);
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dims = SIZES[size];

  const { displayUri, hasScans, enhancing, pickFromGallery, useLatestScanPhoto } =
    useProfilePhoto();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [galleryDenied, setGalleryDenied] = useState<{ canAskAgain: boolean } | null>(null);

  const handleChooseLibrary = useCallback(async () => {
    const result = await pickFromGallery();
    if (result.status === 'denied') {
      setGalleryDenied({ canAskAgain: result.canAskAgain });
    }
  }, [pickFromGallery]);

  const retryGalleryPermission = useCallback(async () => {
    const canAskAgain = galleryDenied?.canAskAgain ?? false;
    setGalleryDenied(null);
    if (canAskAgain) {
      await handleChooseLibrary();
      return;
    }
    await Linking.openSettings();
  }, [galleryDenied?.canAskAgain, handleChooseLibrary]);

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.ring}>
        <Pressable
          onPress={showEdit ? () => setSheetOpen(true) : undefined}
          disabled={!showEdit}
        >
          {displayUri ? (
            <Image
              source={{ uri: displayUri }}
              style={[styles.avatar, { width: dims.outer, height: dims.outer }]}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.placeholder,
                { width: dims.outer, height: dims.outer },
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={dims.outer * 0.42}
                color={colors.textTertiary}
              />
            </View>
          )}
          {enhancing ? (
            <View style={[styles.loadingOverlay, { width: dims.outer, height: dims.outer }]}>
              <ActivityIndicator color={colors.ctaGradientStart} size="small" />
            </View>
          ) : null}
        </Pressable>
      </View>

      {showEdit ? (
        <Pressable
          style={[styles.editBtn, { width: dims.edit, height: dims.edit }]}
          onPress={() => setSheetOpen(true)}
          accessibilityLabel={t('profile.editPhoto')}
        >
          <GradientSurface
            style={{ width: dims.edit, height: dims.edit, alignItems: 'center', justifyContent: 'center' }}
            borderRadius={radius.full}
          >
            <MaterialCommunityIcons name="pencil" size={dims.icon} color={colors.white} />
          </GradientSurface>
        </Pressable>
      ) : null}

      <ProfilePhotoSheet
        visible={sheetOpen}
        title={t('profile.editPhoto')}
        hasScans={hasScans}
        useScanLabel={t('profile.useScanPhoto')}
        chooseLabel={t('profile.choosePhoto')}
        cancelLabel={t('common.cancel')}
        onUseScan={() => {
          void useLatestScanPhoto();
        }}
        onChooseLibrary={() => {
          void handleChooseLibrary();
        }}
        onClose={() => setSheetOpen(false)}
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
          void retryGalleryPermission();
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
