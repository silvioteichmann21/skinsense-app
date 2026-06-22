import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  clearProfilePhotoUri,
  loadProfilePhotoUri,
  type StoredProfilePhoto,
} from '@/core/storage/profilePhotoStorage';
import { useIdealPortrait } from '@/hooks/useIdealPortrait';
import { useI18n } from '@/i18n/I18nProvider';
import { pickFacePhotoFromGallery } from '@/screens/scan/pickFacePhoto';
import {
  generateProfileAvatar,
  regenerateProfileAvatarFromScan,
  saveProfileAvatar,
} from '@/services/profile/scanProfileAvatar';
import { persistProfilePhoto } from '@/services/profile/persistProfilePhoto';
import { syncUserAvatarFromLocal } from '@/services/profile/userAvatarSync';
import { useAuthStore } from '@/store/authStore';
import { useSkinStore } from '@/store/skinStore';

export type ProfilePhotoSource = 'custom' | 'scan' | 'none';

export function useProfilePhoto() {
  const { locale } = useI18n();
  const userId = useAuthStore((s) => s.user?.id);
  const latestScan = useSkinStore((s) => s.latestAnalysis);
  const history = useSkinStore((s) => s.analysisHistory);
  const profilePhotoRevision = useSkinStore((s) => s.profilePhotoRevision);
  const profileAvatarGenerating = useSkinStore((s) => s.profileAvatarGenerating);
  const syncAttempted = useRef<string | null>(null);

  const [customPhoto, setCustomPhoto] = useState<StoredProfilePhoto | null>(null);
  const [ready, setReady] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    let active = true;
    void loadProfilePhotoUri().then((photo) => {
      if (!active) return;
      setCustomPhoto(photo);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [profilePhotoRevision]);

  const firstScan = history.length > 0 ? history[history.length - 1] : null;
  const progressRatio = useMemo(() => {
    if (!latestScan || !firstScan || history.length < 2) return 0;
    const delta = latestScan.skinScore - firstScan.skinScore;
    return Math.max(0, Math.min(1, delta / 25));
  }, [firstScan, history.length, latestScan]);

  const { idealUri: scanIdealUri, rawUri, targetScore, generating } = useIdealPortrait(
    customPhoto ? null : latestScan,
    { progressRatio },
  );

  const avatarGenerating = enhancing || generating || profileAvatarGenerating;

  const displayUri =
    customPhoto?.idealUri ??
    scanIdealUri ??
    rawUri ??
    latestScan?.imageUri ??
    null;

  useEffect(() => {
    if (!userId || !displayUri || !ready) return;
    if (syncAttempted.current === displayUri) return;
    syncAttempted.current = displayUri;
    void syncUserAvatarFromLocal(userId, displayUri);
  }, [userId, displayUri, ready]);

  const photoSource: ProfilePhotoSource = customPhoto
    ? 'custom'
    : latestScan?.imageUri
      ? 'scan'
      : 'none';

  const scoreDelta = useMemo(() => {
    if (!latestScan || !firstScan || history.length < 2) return null;
    const delta = latestScan.skinScore - firstScan.skinScore;
    return delta > 0 ? delta : null;
  }, [firstScan, history.length, latestScan]);

  const pickFromGallery = useCallback(async (): Promise<
    | { status: 'success' }
    | { status: 'cancelled' }
    | { status: 'denied'; canAskAgain: boolean }
  > => {
    const result = await pickFacePhotoFromGallery({ aspect: [1, 1] });
    if (result.status === 'denied') {
      return { status: 'denied', canAskAgain: result.canAskAgain };
    }
    if (result.status === 'cancelled') return { status: 'cancelled' };

    setEnhancing(true);
    try {
      const stored = await persistProfilePhoto(result.uri);
      const cacheKey = `custom-${Date.now()}`;
      const portrait = await generateProfileAvatar({
        imageUri: stored,
        cacheKey,
        locale,
        skinScore: latestScan?.skinScore ?? 68,
        skinType: latestScan?.skinTypeId ?? latestScan?.skinType,
        styleSeed: userId ?? cacheKey,
      });
      const photo = await saveProfileAvatar(portrait);
      setCustomPhoto(photo);
      if (userId) {
        void syncUserAvatarFromLocal(userId, photo.idealUri, { force: true });
      }
      return { status: 'success' };
    } finally {
      setEnhancing(false);
    }
  }, [
    latestScan?.skinScore,
    latestScan?.skinType,
    latestScan?.skinTypeId,
    locale,
    userId,
  ]);

  const useLatestScanPhoto = useCallback(async () => {
    if (!latestScan) {
      await clearProfilePhotoUri();
      setCustomPhoto(null);
      return;
    }

    setEnhancing(true);
    try {
      const portrait = await regenerateProfileAvatarFromScan(latestScan, locale);
      setCustomPhoto({
        rawUri: portrait.rawUri,
        idealUri: portrait.idealUri,
      });
      if (userId) {
        void syncUserAvatarFromLocal(userId, portrait.idealUri, { force: true });
      }
    } finally {
      setEnhancing(false);
    }
  }, [latestScan, locale, userId]);

  return {
    displayUri,
    idealUri: customPhoto?.idealUri ?? scanIdealUri,
    rawUri: customPhoto?.rawUri ?? rawUri,
    avatarTargetScore: targetScore,
    photoSource,
    latestScan,
    firstScan,
    scoreDelta,
    hasScans: history.length > 0,
    ready,
    enhancing: avatarGenerating,
    pickFromGallery,
    useLatestScanPhoto,
  };
}
