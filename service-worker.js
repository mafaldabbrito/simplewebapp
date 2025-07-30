const CACHE_NAME = 'EOW PWA Demo-v1';
const OFFLINE_URL = '/offline.html';
const CACHE_MAX_AGE = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
const MAX_CACHE_SIZE = 50; // Maximum number of cached items per cache

// Files to cache for offline functionality
const CACHE_URLS = [
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

  // Handle API requests and all non-static requests - serve offline page when network fails
  event.respondWith(
    fetch(event.request)
      .catch(function() {
        // If network fails, serve offline page for navigation requests
        if (event.request.mode === 'navigate') {
          console.log("Network request failed, serving offline page");
          return caches.match(OFFLINE_URL);
        }
        // For other requests, just fail
        return Response.error();
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

// Listen for messages from the main application
self.addEventListener('message', function(event) {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'USER_OFFLINE':
        console.log('Service Worker: User went offline');
        // You can implement additional offline logic here
        // For example, pre-cache critical data or change caching strategies
        break;
        
      case 'USER_ONLINE':
        console.log('Service Worker: User came back online');
        // You can implement online logic here
        // For example, sync cached data or update resources
        break;
        
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      default:
        console.log('Service Worker: Unknown message type:', event.data.type);
    }
  }
});


