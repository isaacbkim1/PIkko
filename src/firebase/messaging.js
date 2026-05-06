import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import app, { db } from './config';

// TODO: Replace with your VAPID key from Firebase Console
// Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let messaging = null;

function getMessagingInstance() {
  if (!messaging) {
    try {
      messaging = getMessaging(app);
    } catch (e) {
      console.warn('FCM not supported in this environment');
    }
  }
  return messaging;
}

// Request permission + get FCM token
export async function requestNotificationPermission(userId) {
  if (!('Notification' in window)) return null;
  if (!VAPID_KEY) {
    console.warn('VAPID key not set — push notifications disabled');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const m = getMessagingInstance();
    if (!m) return null;

    // Register service worker first
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(m, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: reg,
    });

    if (token && userId) {
      // Save FCM token to Firestore so backend can target this device
      await setDoc(doc(db, 'fcmTokens', userId), {
        token,
        userId,
        updatedAt: serverTimestamp(),
        platform: /iPhone|iPad/.test(navigator.userAgent) ? 'ios' : 'web',
      }, { merge: true });
    }

    return token;
  } catch (err) {
    console.warn('FCM token error:', err);
    return null;
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback) {
  const m = getMessagingInstance();
  if (!m) return () => {};
  return onMessage(m, callback);
}

// Show a local notification (fallback when FCM not available)
export function showLocalNotification(title, body, options = {}) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const n = new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: options.tag || 'pikko',
    data: options.data || {},
    ...options,
  });

  n.onclick = () => {
    window.focus();
    if (options.url) window.location.href = options.url;
    n.close();
  };

  return n;
}

// Send booking confirmation notification
export async function sendBookingConfirmation({ facilityName, date, time, bookingId }) {
  // 1. Try FCM foreground message listener (already running)
  // 2. Fall back to local Notification API
  showLocalNotification(
    '예약이 확정되었습니다!',
    `${facilityName} · ${date} ${time}`,
    {
      tag: `booking-${bookingId}`,
      url: '/my-bookings',
      data: { bookingId },
    }
  );
}
