import { getAppLanguage } from '@/core/storage/languagePreferences';
import { messagesForLocale } from '@/i18n/locales';

export type ScheduledNotificationCopy = {
  morningTitle: string;
  morningBody: string;
  eveningTitle: string;
  eveningBody: string;
  weeklyScanTitle: string;
  weeklyScanBody: string;
  skinTipsTitle: string;
  skinTipsBody: string;
  scanReadyTitle: string;
  scanReadyBody: string;
  streakTitle: string;
  streakBody: string;
};

export async function getNotificationCopy(): Promise<ScheduledNotificationCopy> {
  const locale = await getAppLanguage();
  const m = messagesForLocale(locale);
  const push = m.notifications.push;
  return {
    morningTitle: push.morningTitle,
    morningBody: push.morningBody,
    eveningTitle: push.eveningTitle,
    eveningBody: push.eveningBody,
    weeklyScanTitle: push.weeklyScanTitle,
    weeklyScanBody: push.weeklyScanBody,
    skinTipsTitle: push.skinTipsTitle,
    skinTipsBody: push.skinTipsBody,
    scanReadyTitle: push.scanReadyTitle,
    scanReadyBody: push.scanReadyBody,
    streakTitle: push.streakTitle,
    streakBody: push.streakBody,
  };
}
