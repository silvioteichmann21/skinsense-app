import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';

const BASE_KEY = '@skinsense/notification_preferences';

export type NotificationPreferences = {
  morningReminder: boolean;
  eveningReminder: boolean;
  weeklyScan: boolean;
  skinTips: boolean;
  restock: boolean;
  morningHour: number;
  morningMinute: number;
  eveningHour: number;
  eveningMinute: number;
  weeklyScanHour: number;
  weeklyScanMinute: number;
  weeklyScanWeekday: number;
  skinTipsHour: number;
  skinTipsMinute: number;
  skinTipsWeekday: number;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  morningReminder: true,
  eveningReminder: true,
  weeklyScan: true,
  skinTips: false,
  restock: true,
  morningHour: 8,
  morningMinute: 0,
  eveningHour: 21,
  eveningMinute: 0,
  weeklyScanHour: 10,
  weeklyScanMinute: 0,
  weeklyScanWeekday: 1,
  skinTipsHour: 11,
  skinTipsMinute: 0,
  skinTipsWeekday: 3,
};

async function storageKey(): Promise<string> {
  return storageKeyForUser(BASE_KEY, await getActiveUserScope());
}

export async function loadNotificationPreferences(): Promise<NotificationPreferences> {
  const raw = await AsyncStorage.getItem(await storageKey());
  if (!raw) return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  try {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...(JSON.parse(raw) as NotificationPreferences) };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  }
}

export async function saveNotificationPreferences(
  prefs: NotificationPreferences,
): Promise<void> {
  await AsyncStorage.setItem(await storageKey(), JSON.stringify(prefs));
}

export async function updateNotificationPreferences(
  patch: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const current = await loadNotificationPreferences();
  const next = { ...current, ...patch };
  await saveNotificationPreferences(next);
  return next;
}
