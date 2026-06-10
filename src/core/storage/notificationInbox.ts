import AsyncStorage from '@react-native-async-storage/async-storage';

import { getActiveUserScope, storageKeyForUser } from '@/core/storage/userScope';

const BASE_KEY = '@skinsense/notification_inbox';
const MAX_ITEMS = 40;

export type NotificationKind =
  | 'routine_reminder_am'
  | 'routine_reminder_pm'
  | 'weekly_scan_reminder'
  | 'streak_at_risk'
  | 'scan_result_ready'
  | 'skin_tips'
  | 'product_restock';

export type InboxNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  targetScreen?: 'Routine' | 'Home' | 'ScanGuide' | 'SkinReport' | 'Settings';
};

async function storageKey(): Promise<string> {
  return storageKeyForUser(BASE_KEY, await getActiveUserScope());
}

async function readInbox(): Promise<InboxNotification[]> {
  const raw = await AsyncStorage.getItem(await storageKey());
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as InboxNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeInbox(items: InboxNotification[]): Promise<void> {
  await AsyncStorage.setItem(await storageKey(), JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export async function loadNotificationInbox(): Promise<InboxNotification[]> {
  return readInbox();
}

export async function addInboxNotification(
  entry: Omit<InboxNotification, 'id' | 'read' | 'createdAt'> & {
    id?: string;
    read?: boolean;
    createdAt?: string;
  },
): Promise<InboxNotification> {
  const items = await readInbox();
  const notification: InboxNotification = {
    id: entry.id ?? `inbox-${Date.now()}`,
    kind: entry.kind,
    title: entry.title,
    body: entry.body,
    read: entry.read ?? false,
    createdAt: entry.createdAt ?? new Date().toISOString(),
    targetScreen: entry.targetScreen,
  };
  const withoutDup = items.filter((item) => item.id !== notification.id);
  await writeInbox([notification, ...withoutDup]);
  return notification;
}

export async function markInboxNotificationRead(id: string): Promise<void> {
  const items = await readInbox();
  await writeInbox(
    items.map((item) => (item.id === id ? { ...item, read: true } : item)),
  );
}

export async function markAllInboxRead(): Promise<void> {
  const items = await readInbox();
  await writeInbox(items.map((item) => ({ ...item, read: true })));
}

export async function getUnreadInboxCount(): Promise<number> {
  const items = await readInbox();
  return items.filter((item) => !item.read).length;
}
