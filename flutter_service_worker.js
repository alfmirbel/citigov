'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "2c62bdb7f92c32577005bf69af84f41d",
"assets/AssetManifest.json": "df8b97de4d4576fa1500196bb011ab21",
"assets/assets/images/CitigovLogoBlanco.jpg": "da394e4f4ee034dd77204fa616de9cfa",
"assets/assets/images/CitigovLogoRosa.jpg": "68230489e1628f99fef7abe28489dedc",
"assets/assets/images/Filtros.jpg": "b165883ffb5a81809b340d1ca3d0df30",
"assets/assets/images/LogoMiVotoCel.jpg": "8fe8cb35e4d4b658e6952c96d5cd5a57",
"assets/assets/images/LogoVotoCloud.jpg": "6d1ece2d61d1e8fef99cd1cb3cc5703d",
"assets/assets/images/LogoVotoNet.jpg": "ac64144bb8ffd8107b1eec9ad61e19b0",
"assets/assets/images/Mecanismos.jpg": "dc493337913884bf4ba758f3a3655f39",
"assets/assets/images/NivelGobierno.jpg": "c601035d76541504cd2d7d712f94c667",
"assets/assets/images/nombreespacios21.jpg": "9801d382d0beb89dab5dbb3d92f8afc0",
"assets/assets/images/Temas.jpg": "c96b5f791f3c32b9e6267a164e11bb85",
"assets/FontManifest.json": "733e592cf5e4007366442434ccbbfa6a",
"assets/fonts/Comfortaa-Bold.ttf": "281df342e6f73c20ebc6526f130e00b3",
"assets/fonts/Comfortaa-Light.ttf": "d30cea8a3c38eee6a405049e1d8c7c2f",
"assets/fonts/Comfortaa-Medium.ttf": "1a7bfac2b8d70a2726a281786c3894cd",
"assets/fonts/Comfortaa-Regular.ttf": "53f695dbfc6f703f86ed88bddde527b6",
"assets/fonts/Comfortaa-SemiBold.ttf": "50c5468a51006a4b81d223cc28aa1790",
"assets/fonts/MaterialIcons-Regular.otf": "b65bcef73dc843700e8c83f68922074d",
"assets/fonts/Urbanist-Bold.ttf": "1ffe51e22e7841c65481a727515e2198",
"assets/fonts/Urbanist-Light.ttf": "46ffc15bcd0fb7da54fc241cb43ece28",
"assets/fonts/Urbanist-Medium.ttf": "9ffbd4b23b829ddd499aaf5eb925a86c",
"assets/fonts/Urbanist-Regular.ttf": "4c1ae1074c39cca3b3fd7a788b5afd96",
"assets/fonts/Urbanist-SemiBold.ttf": "ae731014b8aa4267df78b8e854d006ef",
"assets/NOTICES": "b786c0ce552341068d077c77ae010f1b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "bbf39143dfd758d8d847453b120c8ebb",
"canvaskit/canvaskit.wasm": "42df12e09ecc0d5a4a34a69d7ee44314",
"canvaskit/chromium/canvaskit.js": "96ae916cd2d1b7320fff853ee22aebb0",
"canvaskit/chromium/canvaskit.wasm": "be0e3b33510f5b7b0cc76cc4d3e50048",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "1a074e8452fe5e0d02b112e22cdcf455",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "fd6f3563c5d209345adfc6cde7572243",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "b71ae5ede97d29360aa603997298a90b",
"icons/Icon-512.png": "ea032c396cdb4bf2756885fdd6464603",
"icons/Icon-maskable-192.png": "b71ae5ede97d29360aa603997298a90b",
"icons/Icon-maskable-512.png": "ea032c396cdb4bf2756885fdd6464603",
"index.html": "e469f74b6d07f5f549236bef41e22e4e",
"/": "e469f74b6d07f5f549236bef41e22e4e",
"main.dart.js": "0b0f8db1f76aa77be2e9a71713eba574",
"manifest.json": "da29d599103308ffd43dbc1260e0b30e",
"version.json": "e93b1c4510d759b5235de698657aaf9d"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
