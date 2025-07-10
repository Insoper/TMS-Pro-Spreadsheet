// service-worker.js
const CACHE_NAME = 'tms-pro-v1.1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png',
  '/chart.js',
  '/html2canvas.min.js',
  '/jspdf.umd.min.js',
  '/jspdf.plugin.autotable.min.js',
  '/xlsx.full.min.js',
  // Tambahkan semua asset penting lainnya
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  // Handle semua request, termasuk dari origin lain untuk resource eksternal
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Jika ada di cache, kembalikan
        if (cached) return cached;
        
        // Jika tidak, fetch dari network
        return fetch(event.request)
          .then(response => {
            // Jika response valid, cache untuk penggunaan berikutnya
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            
            return response;
          });
      })
  );
});

self.addEventListener('activate', event => {
  // Hapus cache lama
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});
