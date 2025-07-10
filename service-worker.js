const CACHE_NAME = 'tms-pro-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png',
  '/chart.min.js',
  '/html2canvas.min.js',
  '/jspdf.umd.min.js',
  '/jspdf.plugin.autotable.min.js',
  '/xlsx.full.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Return cached version if available
        if (cached) return cached;
        
        // Fallback for HTML
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        
        // Try network for other files
        return fetch(event.request)
          .then(res => {
            // Cache new responses
            const resClone = res.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, resClone));
            return res;
          })
          .catch(() => {
            // Additional fallbacks can be added here
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});
