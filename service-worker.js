const CACHE = "survivor-workbench-v33";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/ingredient-sprites.png?v=33", "./assets/ui-sprites.png?v=33", "./assets/survivor-emblem.png?v=33", "./assets/cooking-animation.png", "./assets/ambient-world.png", "./assets/stone-tablet.png", "./assets/jerboa-animation.png", "./assets/jerboa-final-full.png", "./assets/jerboa-top-compact.png", "./assets/jerboa-final-hop.png", "./assets/jerboa-draped-rest.png", "./assets/goal-flask.png?v=33"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
