import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserProfile } from '@/types/auth';

const CACHE_KEY = '@skinsense/profile_cache';

export async function cacheProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(profile));
}

export async function loadCachedProfile(userId: string): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const profile = JSON.parse(raw) as UserProfile;
    return profile.id === userId ? profile : null;
  } catch {
    return null;
  }
}

export async function clearCachedProfile(): Promise<void> {
  await AsyncStorage.removeItem(CACHE_KEY);
}
