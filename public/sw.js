// Offline support + web-push handling.
// Runtime cache so the app works fully offline after the first load;
// SPA navigations fall back to the cached app shell.
const CACHE = 'shreya-wellness-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          caches.open(CACHE).then((c) => c.put('/', res.clone()))
          return res
        })
        .catch(() => caches.match('/').then((m) => m || caches.match(request))),
    )
    return
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request)
      const network = fetch(request)
        .then((res) => {
          if (res && res.ok) cache.put(request, res.clone())
          return res
        })
        .catch(() => cached)
      return cached || network
    }),
  )
})

// --- Web push ---
self.addEventListener('push', (event) => {
  let data = { title: "Shreya's Wellness", body: 'Time for a little movement today.', tag: 'reminder' }
  try {
    if (event.data) data = { ...data, ...event.data.json() }
  } catch {
    /* non-JSON payload */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: data.tag,
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow('/')
    }),
  )
})
