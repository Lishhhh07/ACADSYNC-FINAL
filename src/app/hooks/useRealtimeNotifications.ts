import { useEffect, useState } from 'react';
import { notificationAPI } from '../utils/api';

/**
 * Hook to listen for real-time notifications using polling
 * In a production app, you'd use WebSockets or Firebase SDK for real-time updates
 */
export const useRealtimeNotifications = (enabled: boolean = true) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const fetchNotifications = async () => {
      try {
        const response = await notificationAPI.getNotifications();
        const unread = response.notifications.filter((n: any) => !n.read);
        setNotifications(response.notifications);
        setUnreadCount(unread.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { notifications, unreadCount };
};
