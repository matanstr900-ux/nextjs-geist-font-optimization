const CACHE_NAME = 'employee-tracking-v1'
const urlsToCache = [
  '/',
  '/forms/injections',
  '/forms/assemblies',
  '/forms/coloring',
  '/forms/filling',
  '/export',
  '/manifest.json'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'hourly-reminder') {
    event.waitUntil(sendNotification())
  }
})

function sendNotification() {
  return self.registration.showNotification('תזכורת מילוי טופס', {
    body: 'זמן למלא את טופס מעקב העובדים',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'hourly-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'פתח אפליקציה'
      },
      {
        action: 'dismiss',
        title: 'דחה'
      }
    ]
  })
}
