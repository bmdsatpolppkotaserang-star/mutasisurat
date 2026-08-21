const CACHE_NAME = 'agenda-surat-satpolpp-v1.0.3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './polpp.png',
  './icon-192x192-maskable.png,
  './icon-512x512-maskable.png'
];

// Saat Service Worker dipasang (Install)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache dibuka:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Membersihkan cache lama jika ada pembaruan versi
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Mengatur strategi pengambilan data (Cache, lalu Network)
self.addEventListener('fetch', (e) => {
  // Lewatkan request ke Google Apps Script agar data selalu real-time (tidak di-cache)
  if (e.request.url.includes('script.google.com')) {
    return fetch(e.request);
  }

  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
