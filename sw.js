
const CACHE_NAME = 'zen-snake-v3';
const STATIC_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Use a Network-First strategy for core application files and modules
  // This ensures transpiled code is up-to-date while providing a reliable cache fallback.
  if (
    event.request.mode === 'navigate' || 
    url.pathname.endsWith('.tsx') || 
    url.pathname.endsWith('.ts') || 
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If successful, cache the response and return it
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            
            // If it's a navigation request and we're offline, return the root shell
            if (event.request.mode === 'navigate') {
              return caches.match('./') || caches.match('index.html');
            }
            return null;
          });
        })
    );
  } else {
    // Cache-First strategy for other static assets (CSS, Fonts, CDN assets)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
