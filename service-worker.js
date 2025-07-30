const CACHE_NAME = 'myapp-v1';
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

// Install event - cache essential files
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Caching essential files...');
        return cache.addAll(CACHE_URLS);
      })
      .then(function() {
        // Force the service worker to become active immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  
  // Handle navigation requests (page loads)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(function() {
          // If network fails, serve offline page with URL parameters preserved
          const requestUrl = new URL(event.request.url);
          const offlineUrl = new URL(OFFLINE_URL, self.location.origin);
          
          // Preserve important URL parameters for context
          if (requestUrl.searchParams.has('modal')) {
            offlineUrl.searchParams.set('modal', requestUrl.searchParams.get('modal'));
          }
          if (requestUrl.searchParams.has('page')) {
            offlineUrl.searchParams.set('page', requestUrl.searchParams.get('page'));
          }
          
          return caches.match(offlineUrl.toString()) || caches.match(OFFLINE_URL);
        })
    );
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

// Handle messages from the main thread
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
