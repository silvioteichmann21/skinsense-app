import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';
import type { StoredScanRecord } from '@/types/scanPipeline';

const SCAN_HISTORY_BASE_KEY = '@skinsense/scan_history';
/** Pre–per-user key; cleared on read so data is not shared across accounts. */
const LEGACY_SCAN_HISTORY_KEY = SCAN_HISTORY_BASE_KEY;
const MAX_SCANS = 50;

async function resolveStorageKey(userScope?: string): Promise<string> {
  const scope = userScope ?? (await getActiveUserScope());
  return storageKeyForUser(SCAN_HISTORY_BASE_KEY, scope);
}

async function readHistory(key: string): Promise<StoredScanRecord[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredScanRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Remove legacy shared history so scans are never visible across accounts. */
async function clearLegacySharedHistory(): Promise<void> {
  await AsyncStorage.removeItem(LEGACY_SCAN_HISTORY_KEY);
}

export async function loadScanHistory(userScope?: string): Promise<StoredScanRecord[]> {
  const key = await resolveStorageKey(userScope);
  const history = await readHistory(key);
  await clearLegacySharedHistory();
  return history;
}

export async function saveScanHistory(
  history: StoredScanRecord[],
  userScope?: string,
): Promise<void> {
  const key = await resolveStorageKey(userScope);
  const trimmed = history.slice(0, MAX_SCANS);
  await AsyncStorage.setItem(key, JSON.stringify(trimmed));
}

export async function appendScanRecord(
  record: StoredScanRecord,
  userScope?: string,
): Promise<StoredScanRecord[]> {
  const history = await loadScanHistory(userScope);
  const withoutDup = history.filter((s) => s.id !== record.id);
  const next = [record, ...withoutDup];
  await saveScanHistory(next, userScope);
  return next;
}

export async function getScanById(
  id: string,
  userScope?: string,
): Promise<StoredScanRecord | null> {
  const history = await loadScanHistory(userScope);
  return history.find((s) => s.id === id) ?? null;
}

export async function deleteScanRecord(
  id: string,
  userScope?: string,
): Promise<StoredScanRecord[]> {
  const history = await loadScanHistory(userScope);
  const next = history.filter((s) => s.id !== id);
  await saveScanHistory(next, userScope);
  return next;
}
