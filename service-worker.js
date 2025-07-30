const CACHE_NAME = 'EOW PWA Demo-v1';
const OFFLINE_URL = '/offline.html';
const CACHE_MAX_AGE = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
const MAX_CACHE_SIZE = 50; // Maximum number of cached items per cache

// Files to cache for offline functionality
const CACHE_URLS = [
  '/',
  '/api/',
  '/styles.css',
  '/script.js',
  '/offline.html',
  '/manifest.json',
  '/manifest-dashboard.json',
  '/manifest-settings.json'
];

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    Promise.all([
      // Clean up old cache versions
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function(cacheName) {
              // Delete caches that don't match current version
              return cacheName !== CACHE_NAME;
            })
            .map(function(cacheName) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Clean expired entries from current cache
      cleanExpiredCacheEntries(),
      // Limit cache size
      limitCacheSize(CACHE_NAME, MAX_CACHE_SIZE),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

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
              // Cache successful responses with timestamp
              if (response.status === 200) {
                const responseClone = response.clone();
                const responseWithTimestamp = addTimestampToResponse(responseClone);
                caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, responseWithTimestamp);
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
          // Cache successful API responses for offline fallback with timestamp
          if (response.status === 200) {
            const responseClone = response.clone();
            const responseWithTimestamp = addTimestampToResponse(responseClone);
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseWithTimestamp);
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

// Helper function to clean expired cache entries
function cleanExpiredCacheEntries() {
  return caches.open(CACHE_NAME).then(function(cache) {
    return cache.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(request) {
          return cache.match(request).then(function(response) {
            if (response) {
              const cachedDate = response.headers.get('sw-cached-date');
              if (cachedDate) {
                const cacheAge = Date.now() - parseInt(cachedDate);
                if (cacheAge > CACHE_MAX_AGE) {
                  console.log('Removing expired cache entry:', request.url);
                  return cache.delete(request);
                }
              }
            }
          });
        })
      );
    });
  });
}

// Helper function to limit cache size
function limitCacheSize(cacheName, maxSize) {
  return caches.open(cacheName).then(function(cache) {
    return cache.keys().then(function(keys) {
      if (keys.length > maxSize) {
        // Remove oldest entries (FIFO approach)
        const keysToDelete = keys.slice(0, keys.length - maxSize);
        return Promise.all(
          keysToDelete.map(function(key) {
            console.log('Removing cache entry due to size limit:', key.url);
            return cache.delete(key);
          })
        );
      }
    });
  });
}

// Helper function to add timestamp to cached responses
function addTimestampToResponse(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-date', Date.now().toString());
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}


