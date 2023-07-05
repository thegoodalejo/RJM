// Archivo: service-worker.js

// Nombre del caché
var CACHE_NAME = 'kingdom-cache';

// Archivos a cachear
var urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Instalación del service worker
self.addEventListener('install', function(event) {
  // Espera hasta que se complete la instalación
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Cacha los archivos definidos en urlsToCache
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', function(event) {
  // Elimina los cachés antiguos
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Intercepta las solicitudes y las maneja desde el caché
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Si la solicitud está en caché, retorna la respuesta en caché
        if (response) {
          return response;
        }

        // Si la solicitud no está en caché, la realiza normalmente
        return fetch(event.request);
      })
  );
});
