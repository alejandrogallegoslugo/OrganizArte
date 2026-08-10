// Service Worker for PWA Web Push Notifications (iOS & Android)

self.addEventListener('install', (event) => {
  console.log('[PWA SW] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[PWA SW] Activated');
});

// Listen for incoming Push Notifications from backend/Resend
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'OrganizArte Tec', body: 'Tienes un ensayo o aviso nuevo.' };
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
