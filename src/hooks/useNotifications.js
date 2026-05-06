import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  requestNotificationPermission,
  onForegroundMessage,
  showLocalNotification,
} from '../firebase/messaging';

export function useNotifications() {
  const { userId, isLoggedIn } = useAuth();
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Request permission when user logs in
  useEffect(() => {
    if (!isLoggedIn || !userId) return;
    if (permission === 'granted') return;
    if (!('Notification' in window)) return;
    // Auto-request after short delay
    const t = setTimeout(() => {
      requestNotificationPermission(userId).then((token) => {
        if (token) setPermission('granted');
      });
    }, 2000);
    return () => clearTimeout(t);
  }, [isLoggedIn, userId]);

  // Listen for foreground FCM messages
  useEffect(() => {
    const unsub = onForegroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      showLocalNotification(title || 'Pikko', body || '새 알림');
    });
    return unsub;
  }, []);

  const requestPermission = useCallback(async () => {
    const token = await requestNotificationPermission(userId);
    setPermission(Notification.permission);
    return !!token;
  }, [userId]);

  return { permission, requestPermission };
}
