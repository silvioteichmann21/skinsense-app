import * as Notifications from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import {
  type NotificationPreferences,
  loadNotificationPreferences,
} from '@/core/storage/notificationPreferences';
import {
  addInboxNotification,
  loadNotificationInbox,
  type InboxNotification,
  type NotificationKind,
} from '@/core/storage/notificationInbox';
import { getActivityDayKeys, calculateStreak } from '@/core/storage/activityStorage';
import { getNotificationCopy } from '@/services/notifications/notificationCopy';

export const NOTIFICATION_IDS = {
  morning: 'routine_reminder_am',
  evening: 'routine_reminder_pm',
  weeklyScan: 'weekly_scan_reminder',
  skinTips: 'skin_tips',
} as const;

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'SkinSense',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function getNotificationPermissionStatus(): Promise<Notifications.PermissionStatus> {
  const settings = await Notifications.getPermissionsAsync();
  return settings.status;
}

export async function requestNotificationPermission(): Promise<boolean> {
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.status === Notifications.PermissionStatus.GRANTED) return true;
  if (current.status === Notifications.PermissionStatus.DENIED && !current.canAskAgain) {
    return false;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === Notifications.PermissionStatus.GRANTED;
}

async function cancelScheduled(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

function kindFromIdentifier(identifier: string): NotificationKind | null {
  if (identifier === NOTIFICATION_IDS.morning) return 'routine_reminder_am';
  if (identifier === NOTIFICATION_IDS.evening) return 'routine_reminder_pm';
  if (identifier === NOTIFICATION_IDS.weeklyScan) return 'weekly_scan_reminder';
  if (identifier === NOTIFICATION_IDS.skinTips) return 'skin_tips';
  return null;
}

function targetForKind(kind: NotificationKind): InboxNotification['targetScreen'] {
  if (kind === 'routine_reminder_am' || kind === 'routine_reminder_pm') return 'Routine';
  if (kind === 'weekly_scan_reminder') return 'ScanGuide';
  if (kind === 'scan_result_ready') return 'SkinReport';
  if (kind === 'streak_at_risk') return 'Home';
  if (kind === 'skin_tips') return 'Home';
  return 'Settings';
}

export async function recordDeliveredNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  const identifier = typeof data?.identifier === 'string' ? data.identifier : undefined;
  const kind =
    (typeof data?.kind === 'string' ? data.kind : kindFromIdentifier(identifier ?? '')) as
      | NotificationKind
      | null;

  if (!kind) return;

  await addInboxNotification({
    kind,
    title,
    body,
    targetScreen: targetForKind(kind),
  });
}

export async function rescheduleNotifications(
  prefs?: NotificationPreferences,
): Promise<void> {
  const preferences = prefs ?? (await loadNotificationPreferences());
  const copy = await getNotificationCopy();

  await cancelScheduled(Object.values(NOTIFICATION_IDS));

  const hasEnabled =
    preferences.morningReminder ||
    preferences.eveningReminder ||
    preferences.weeklyScan ||
    preferences.skinTips;

  if (!hasEnabled) return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  if (preferences.morningReminder) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.morning,
      content: {
        title: copy.morningTitle,
        body: copy.morningBody,
        data: { kind: 'routine_reminder_am', identifier: NOTIFICATION_IDS.morning },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: preferences.morningHour,
        minute: preferences.morningMinute,
      },
    });
  }

  if (preferences.eveningReminder) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.evening,
      content: {
        title: copy.eveningTitle,
        body: copy.eveningBody,
        data: { kind: 'routine_reminder_pm', identifier: NOTIFICATION_IDS.evening },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: preferences.eveningHour,
        minute: preferences.eveningMinute,
      },
    });
  }

  if (preferences.weeklyScan) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.weeklyScan,
      content: {
        title: copy.weeklyScanTitle,
        body: copy.weeklyScanBody,
        data: { kind: 'weekly_scan_reminder', identifier: NOTIFICATION_IDS.weeklyScan },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: preferences.weeklyScanWeekday,
        hour: preferences.weeklyScanHour,
        minute: preferences.weeklyScanMinute,
      },
    });
  }

  if (preferences.skinTips) {
    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.skinTips,
      content: {
        title: copy.skinTipsTitle,
        body: copy.skinTipsBody,
        data: { kind: 'skin_tips', identifier: NOTIFICATION_IDS.skinTips },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: preferences.skinTipsWeekday,
        hour: preferences.skinTipsHour,
        minute: preferences.skinTipsMinute,
      },
    });
  }
}

export async function notifyScanResultReady(skinScore: number): Promise<void> {
  const copy = await getNotificationCopy();
  const body = copy.scanReadyBody.replace('{{score}}', String(skinScore));

  await addInboxNotification({
    kind: 'scan_result_ready',
    title: copy.scanReadyTitle,
    body,
    targetScreen: 'SkinReport',
  });

  const granted = await getNotificationPermissionStatus();
  if (granted !== Notifications.PermissionStatus.GRANTED) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: copy.scanReadyTitle,
      body,
      data: { kind: 'scan_result_ready' },
    },
    trigger: null,
  });
}

export async function evaluateStreakAtRisk(): Promise<void> {
  const dayKeys = await getActivityDayKeys();
  const streak = calculateStreak(dayKeys);
  if (streak < 1) return;

  const today = new Date().toISOString().slice(0, 10);
  if (dayKeys.includes(today)) return;

  const inbox = await loadNotificationInbox();
  const alreadyToday = inbox.some(
    (item) =>
      item.kind === 'streak_at_risk' && item.createdAt.slice(0, 10) === today,
  );
  if (alreadyToday) return;

  const copy = await getNotificationCopy();
  await addInboxNotification({
    kind: 'streak_at_risk',
    title: copy.streakTitle,
    body: copy.streakBody.replace('{{days}}', String(streak)),
    targetScreen: 'Home',
  });
}

export async function openSystemNotificationSettings(): Promise<void> {
  await Linking.openSettings();
}
