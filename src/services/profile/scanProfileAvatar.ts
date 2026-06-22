import {
  loadProfilePhotoUri,
  saveProfilePhotoUri,
  type StoredProfilePhoto,
} from '@/core/storage/profilePhotoStorage';
import { loadScanHistory } from '@/core/storage/scanHistoryStorage';
import {
  enhancePortraitWithGemini,
  isGeminiPortraitAvailable,
  saveGeminiPortraitToFile,
} from '@/services/api/geminiPortrait';
import { generateIdealPortrait } from '@/services/profile/idealPortraitService';
import { syncUserAvatarFromLocal } from '@/services/profile/userAvatarSync';
import { useSkinStore } from '@/store/skinStore';
import type { StoredScanRecord } from '@/types/scanPipeline';

export type ProfileAvatarResult = StoredProfilePhoto & {
  source: 'gemini' | 'local';
};

export type ProfileAvatarInput = {
  imageUri: string;
  cacheKey: string;
  locale: string;
  skinScore?: number;
  skinType?: string;
  styleSeed?: string;
};

async function buildLocalPortrait(input: ProfileAvatarInput): Promise<ProfileAvatarResult> {
  const result = await generateIdealPortrait({
    imageUri: input.imageUri,
    cacheKey: input.cacheKey,
    skinScore: input.skinScore,
    progressRatio: 0,
  });

  return {
    rawUri: result.rawUri,
    idealUri: result.idealUri,
    source: 'local',
  };
}

async function buildGeminiPortrait(input: ProfileAvatarInput): Promise<ProfileAvatarResult> {
  const { base64 } = await enhancePortraitWithGemini({
    imageUri: input.imageUri,
    skinScore: input.skinScore,
    skinType: input.skinType,
    locale: input.locale,
    styleSeed: input.styleSeed ?? input.cacheKey,
  });

  const idealUri = await saveGeminiPortraitToFile(base64, input.cacheKey);

  return {
    rawUri: input.imageUri,
    idealUri,
    source: 'gemini',
  };
}

/** AI profile avatar from a real photo (Gemini styling → local fallback). */
export async function generateProfileAvatar(
  input: ProfileAvatarInput,
): Promise<ProfileAvatarResult> {
  if (isGeminiPortraitAvailable()) {
    try {
      return await buildGeminiPortrait(input);
    } catch (e) {
      if (__DEV__) {
        console.warn('[generateProfileAvatar] Gemini failed, using local enhance:', e);
      }
    }
  }

  return buildLocalPortrait(input);
}

export async function saveProfileAvatar(
  portrait: ProfileAvatarResult,
): Promise<StoredProfilePhoto> {
  const photo: StoredProfilePhoto = {
    rawUri: portrait.rawUri,
    idealUri: portrait.idealUri,
  };
  await saveProfilePhotoUri(photo);
  useSkinStore.getState().bumpProfilePhotoRevision();
  return photo;
}

/** After first scan, create an AI-styled profile avatar from the scan photo. */
export async function ensureProfileAvatarFromScan(
  scan: StoredScanRecord,
  locale: string,
): Promise<ProfileAvatarResult | null> {
  const existing = await loadProfilePhotoUri();
  if (existing?.idealUri) {
    return null;
  }

  const history = await loadScanHistory();
  if (history.length > 1) {
    return null;
  }

  useSkinStore.getState().setProfileAvatarGenerating(true);

  try {
    const portrait = await generateProfileAvatar({
      imageUri: scan.imageUri,
      cacheKey: scan.id,
      locale,
      skinScore: scan.skinScore,
      skinType: scan.skinTypeId ?? scan.skinType,
      styleSeed: scan.id,
    });

    await saveProfilePhotoUri({
      rawUri: portrait.rawUri,
      idealUri: portrait.idealUri,
    });

    useSkinStore.getState().bumpProfilePhotoRevision();

    return portrait;
  } finally {
    useSkinStore.getState().setProfileAvatarGenerating(false);
  }
}

/** Regenerate AI avatar from the latest scan (e.g. after clearing a custom gallery photo). */
export async function regenerateProfileAvatarFromScan(
  scan: StoredScanRecord,
  locale: string,
): Promise<ProfileAvatarResult> {
  useSkinStore.getState().setProfileAvatarGenerating(true);

  try {
    const portrait = await generateProfileAvatar({
      imageUri: scan.imageUri,
      cacheKey: scan.id,
      locale,
      skinScore: scan.skinScore,
      skinType: scan.skinTypeId ?? scan.skinType,
      styleSeed: scan.id,
    });

    await saveProfileAvatar(portrait);
    return portrait;
  } finally {
    useSkinStore.getState().setProfileAvatarGenerating(false);
  }
}

export async function syncProfileAvatarIfNeeded(
  userId: string | null,
  idealUri: string,
): Promise<void> {
  if (!userId) return;
  await syncUserAvatarFromLocal(userId, idealUri, { force: true });
}
