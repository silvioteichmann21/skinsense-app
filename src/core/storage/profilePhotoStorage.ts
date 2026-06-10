import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';

const PROFILE_PHOTO_KEY = '@skinsense/profile_photo';

export type StoredProfilePhoto = {
  rawUri: string;
  idealUri: string;
};

export async function saveProfilePhotoUri(photo: StoredProfilePhoto): Promise<void> {
  const scope = await getActiveUserScope();
  const key = storageKeyForUser(PROFILE_PHOTO_KEY, scope);
  await AsyncStorage.setItem(key, JSON.stringify(photo));
}

export async function loadProfilePhotoUri(): Promise<StoredProfilePhoto | null> {
  const scope = await getActiveUserScope();
  const key = storageKeyForUser(PROFILE_PHOTO_KEY, scope);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredProfilePhoto;
    if (parsed?.idealUri) return parsed;
  } catch {
    /* legacy string uri */
    return { rawUri: raw, idealUri: raw };
  }
  return null;
}

export async function clearProfilePhotoUri(): Promise<void> {
  const scope = await getActiveUserScope();
  const key = storageKeyForUser(PROFILE_PHOTO_KEY, scope);
  await AsyncStorage.removeItem(key);
}
