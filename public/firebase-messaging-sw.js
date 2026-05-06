// Firebase Cloud Messaging Service Worker
// Handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyDYN2TtRinA_435MdH9IhU0HUEhB85mtn0',
  authDomain:        'pikko-app.firebaseapp.com',
  projectId:         'pikko-app',
  storageBucket:     'pikko-app.firebasestorage.app',
  messagingSenderId: '256520655407',
  appId:             '1:256520655407:web:42a747529e513bb0996cda',
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, data } = payload.notification || {};

  self.registration.showNotification(title || 'Pikko 알림', {
    body:  body  || '새로운 알림이 있습니다',
    icon:  icon  || '/icon-192.png',
    badge: '/icon-192.png',
    tag:   data?.bookingId ? `booking-${data.bookingId}` : 'pikko',
    data:  data  || {},
    actions: [
      { action: 'view',    title: '예약 확인' },
      { action: 'dismiss', title: '닫기' },
    ],
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/my-bookings';

  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        return clients.openWindow(url);
      })
    );
  }
});
