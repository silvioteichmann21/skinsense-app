import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StoredScanRecord } from '@/types/scanPipeline';

const SCAN_HISTORY_KEY = '@skinsense/scan_history';
const MAX_SCANS = 50;

export async function loadScanHistory(): Promise<StoredScanRecord[]> {
  const raw = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredScanRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveScanHistory(history: StoredScanRecord[]): Promise<void> {
  const trimmed = history.slice(0, MAX_SCANS);
  await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(trimmed));
}

export async function appendScanRecord(record: StoredScanRecord): Promise<StoredScanRecord[]> {
  const history = await loadScanHistory();
  const withoutDup = history.filter((s) => s.id !== record.id);
  const next = [record, ...withoutDup];
  await saveScanHistory(next);
  return next;
}

export async function getScanById(id: string): Promise<StoredScanRecord | null> {
  const history = await loadScanHistory();
  return history.find((s) => s.id === id) ?? null;
}
