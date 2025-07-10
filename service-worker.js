const CACHE_NAME = 'tms-pro-v1.2';
const ASSETS = [
  '/TMS-Pro-Spreadsheet/',
  '/TMS-Pro-Spreadsheet/index.html',
  '/TMS-Pro-Spreadsheet/proxy.html',
  '/TMS-Pro-Spreadsheet/manifest.json',
  '/TMS-Pro-Spreadsheet/icon-192.png',
  '/TMS-Pro-Spreadsheet/icon-512.png',
  '/TMS-Pro-Spreadsheet/logo.png',
  '/TMS-Pro-Spreadsheet/chart.js',
  '/TMS-Pro-Spreadsheet/html2canvas.min.js',
  '/TMS-Pro-Spreadsheet/jspdf.umd.min.js',
  '/TMS-Pro-Spreadsheet/jspdf.plugin.autotable.min.js',
  '/TMS-Pro-Spreadsheet/xlsx.full.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Gunakan Promise.all untuk menangani error individual
        return Promise.all(
          ASSETS.map(asset => {
            return fetch(asset)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch ${asset}: ${response.status}`);
                }
                return cache.put(asset, response);
              })
              .catch(err => {
                console.error('Failed to cache:', asset, err);
                // Lanjutkan meskipun ada yang gagal
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
