const CACHE_NAME = 'tms-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './proxy.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo.png',
  './chart.min.js',
  './html2canvas.min.js',
  './jspdf.umd.min.js',
  './jspdf.plugin.autotable.min.js',
  './xlsx.full.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
