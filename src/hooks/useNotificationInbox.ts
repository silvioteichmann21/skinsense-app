import { useCallback, useEffect, useState } from 'react';

import {
  getUnreadInboxCount,
  loadNotificationInbox,
  markAllInboxRead,
  markInboxNotificationRead,
  type InboxNotification,
} from '@/core/storage/notificationInbox';

export function useNotificationInbox() {
  const [items, setItems] = useState<InboxNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [inbox, unread] = await Promise.all([
      loadNotificationInbox(),
      getUnreadInboxCount(),
    ]);
    setItems(inbox);
    setUnreadCount(unread);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markRead = useCallback(
    async (id: string) => {
      await markInboxNotificationRead(id);
      await refresh();
    },
    [refresh],
  );

  const markAllRead = useCallback(async () => {
    await markAllInboxRead();
    await refresh();
  }, [refresh]);

  return {
    items,
    unreadCount,
    loading,
    refresh,
    markRead,
    markAllRead,
  };
}
