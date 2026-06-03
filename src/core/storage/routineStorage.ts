import AsyncStorage from '@react-native-async-storage/async-storage';

import type { PersonalizedRoutine } from '@/types/routine';

const ROUTINE_KEY = '@skinsense/personalized_routine';

export type StoredRoutine = PersonalizedRoutine & {
  scanId: string | null;
  updatedAt: string;
};

export async function loadStoredRoutine(): Promise<StoredRoutine | null> {
  const raw = await AsyncStorage.getItem(ROUTINE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredRoutine;
  } catch {
    return null;
  }
}

export async function saveStoredRoutine(
  routine: PersonalizedRoutine,
  scanId: string | null,
): Promise<StoredRoutine> {
  const stored: StoredRoutine = {
    ...routine,
    scanId,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(ROUTINE_KEY, JSON.stringify(stored));
  return stored;
}

export async function clearStoredRoutine(): Promise<void> {
  await AsyncStorage.removeItem(ROUTINE_KEY);
}
