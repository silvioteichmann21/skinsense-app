import * as Notifications from 'expo-notifications';
import { useEffect, type ReactNode } from 'react';

import {
  configureNotificationHandler,
  evaluateStreakAtRisk,
  recordDeliveredNotification,
  rescheduleNotifications,
} from '@/services/notifications/notificationService';

type Props = {
  children: ReactNode;
};

export function NotificationProvider({ children }: Props) {
  useEffect(() => {
    configureNotificationHandler();

    void rescheduleNotifications();
    void evaluateStreakAtRisk();

    const receivedSub = Notifications.addNotificationReceivedListener((event) => {
      const { title, body, data } = event.request.content;
      void recordDeliveredNotification(title ?? '', body ?? '', data as Record<string, unknown>);
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const { title, body, data } = response.notification.request.content;
      void recordDeliveredNotification(title ?? '', body ?? '', data as Record<string, unknown>);
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  return children;
}
