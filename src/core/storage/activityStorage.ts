import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';

const ACTIVITY_BASE_KEY = '@skinsense/activity_days';
const ROUTINE_LOG_BASE_KEY = '@skinsense/routine_daily_log';
const LEGACY_ACTIVITY_KEY = ACTIVITY_BASE_KEY;
const LEGACY_ROUTINE_LOG_KEY = ROUTINE_LOG_BASE_KEY;

async function activityKey(): Promise<string> {
  return storageKeyForUser(ACTIVITY_BASE_KEY, await getActiveUserScope());
}

async function routineLogKey(): Promise<string> {
  return storageKeyForUser(ROUTINE_LOG_BASE_KEY, await getActiveUserScope());
}

async function clearLegacyActivityKeys(): Promise<void> {
  await AsyncStorage.multiRemove([LEGACY_ACTIVITY_KEY, LEGACY_ROUTINE_LOG_KEY]);
}

type ActivityDays = Record<string, true>;
type RoutineDailyLog = Record<string, { morningPct: number; eveningPct: number }>;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function readActivityDays(): Promise<ActivityDays> {
  const raw = await AsyncStorage.getItem(await activityKey());
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ActivityDays;
  } catch {
    return {};
  }
}

async function writeActivityDays(days: ActivityDays): Promise<void> {
  await AsyncStorage.setItem(await activityKey(), JSON.stringify(days));
  await clearLegacyActivityKeys();
}

async function readRoutineLog(): Promise<RoutineDailyLog> {
  const raw = await AsyncStorage.getItem(await routineLogKey());
  if (!raw) return {};
  try {
    return JSON.parse(raw) as RoutineDailyLog;
  } catch {
    return {};
  }
}

async function writeRoutineLog(log: RoutineDailyLog): Promise<void> {
  await AsyncStorage.setItem(await routineLogKey(), JSON.stringify(log));
  await clearLegacyActivityKeys();
}

/** Mark today as an active day (scan completed). */
export async function recordScanActivity(): Promise<void> {
  const days = await readActivityDays();
  days[todayKey()] = true;
  await writeActivityDays(days);
}

/**
 * Log routine completion % for today. A day qualifies for streak when either
 * period reaches 70%+ or a scan was recorded.
 */
export async function recordRoutineProgress(
  morningDone: number,
  morningTotal: number,
  eveningDone: number,
  eveningTotal: number,
): Promise<void> {
  const key = todayKey();
  const log = await readRoutineLog();
  log[key] = {
    morningPct: morningTotal ? Math.round((morningDone / morningTotal) * 100) : 0,
    eveningPct: eveningTotal ? Math.round((eveningDone / eveningTotal) * 100) : 0,
  };
  await writeRoutineLog(log);

  const morningQualifies = morningTotal > 0 && (morningDone / morningTotal) >= 0.7;
  const eveningQualifies = eveningTotal > 0 && (eveningDone / eveningTotal) >= 0.7;
  if (morningQualifies || eveningQualifies) {
    const days = await readActivityDays();
    days[key] = true;
    await writeActivityDays(days);
  }
}

export async function getActivityDayKeys(): Promise<string[]> {
  await clearLegacyActivityKeys();
  const days = await readActivityDays();
  return Object.keys(days).sort();
}

/** Consecutive active days ending today (or yesterday if today not yet active). */
export function calculateStreak(dayKeys: string[]): number {
  if (dayKeys.length === 0) return 0;

  const set = new Set(dayKeys);
  const cursor = new Date();
  const today = todayKey();
  if (!set.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** % of last N days with qualifying activity (scan or 70%+ routine). */
export function calculateAdherence(dayKeys: string[], windowDays = 7): number {
  if (windowDays <= 0) return 0;
  let active = 0;
  const cursor = new Date();
  for (let i = 0; i < windowDays; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (dayKeys.includes(key)) active += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return Math.round((active / windowDays) * 100);
}

/** Average routine completion across morning + evening for the last N days. */
export async function getRoutineAdherencePercent(windowDays = 7): Promise<number> {
  const log = await readRoutineLog();
  const cursor = new Date();
  const samples: number[] = [];

  for (let i = 0; i < windowDays; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const entry = log[key];
    if (entry) {
      const values = [entry.morningPct, entry.eveningPct].filter((v) => v > 0);
      if (values.length) samples.push(values.reduce((a, b) => a + b, 0) / values.length);
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  if (!samples.length) return 0;
  return Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
}
