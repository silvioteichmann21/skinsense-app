import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';

const COMPLETED_BASE_KEY = '@skinsense/routine.completed';
const LEGACY_COMPLETED_KEY = 'skinsense.routine.completed';

async function completedKey(): Promise<string> {
  return storageKeyForUser(COMPLETED_BASE_KEY, await getActiveUserScope());
}

export type RoutinePeriod = 'morning' | 'evening';

function periodKey(period: RoutinePeriod): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${date}:${period}`;
}

async function readAll(): Promise<Record<string, string[]>> {
  const raw = await AsyncStorage.getItem(await completedKey());
  if (!raw) return {};
  try {
    await AsyncStorage.removeItem(LEGACY_COMPLETED_KEY);
    return JSON.parse(raw) as Record<string, string[]>;
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, string[]>): Promise<void> {
  await AsyncStorage.setItem(await completedKey(), JSON.stringify(data));
  await AsyncStorage.removeItem(LEGACY_COMPLETED_KEY);
}

export async function getCompletedStepIds(period: RoutinePeriod): Promise<Set<string>> {
  const all = await readAll();
  const ids = all[periodKey(period)] ?? [];
  return new Set(ids);
}

export async function setStepCompleted(
  period: RoutinePeriod,
  stepId: string,
  completed: boolean,
): Promise<Set<string>> {
  const all = await readAll();
  const key = periodKey(period);
  const current = new Set(all[key] ?? []);

  if (completed) {
    current.add(stepId);
  } else {
    current.delete(stepId);
  }

  all[key] = [...current];
  await writeAll(all);
  return current;
}

export async function toggleStepCompleted(
  period: RoutinePeriod,
  stepId: string,
): Promise<boolean> {
  const current = await getCompletedStepIds(period);
  const next = !current.has(stepId);
  await setStepCompleted(period, stepId, next);
  return next;
}
