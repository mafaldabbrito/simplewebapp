const CACHE_NAME = 'EOW PWA Demo-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/api/',
  '/styles.css',
  '/script.js',
  '/offline.html',
  '/offline.html?modal=dashboard',
  '/offline.html?modal=settings',
  '/offline.html?page=dashboard',
  '/offline.html?page=settings',
  '/icons/dashboard.svg',
  '/icons/settings.png',
  '/manifest.json',
  '/manifest-dashboard.json',
  '/manifest-settings.json'
];
// Install event - cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(CACHE_URLS);
      })
      .then(function() {
        // Skip waiting to activate the new service worker immediately
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.error('Failed to cache files during install:', error);
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle other requests with cache-first strategy for static assets
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(function(response) {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            })
            .catch(function() {
              // For failed requests of static assets, try to return a cached version
              return caches.match(event.request);
            });
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // Cache successful API responses for offline fallback
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(function() {
          // If network fails, try to serve cached version
          return caches.match(event.request)
            .then(function(cachedResponse) {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If no cached version, return offline page for HTML requests
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match(OFFLINE_URL);
              }
              // For other requests, let them fail naturally
              throw new Error('No cached response available');
            });
        })
    );
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(event.request)
      .catch(function() {
        return caches.match(event.request);
      })
  );
});

// Helper function to check if request is for static assets
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.includes(ext)) || 
         url.includes('/icons/') || 
         url.includes('manifest');
}


