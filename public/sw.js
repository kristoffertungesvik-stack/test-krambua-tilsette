/**
 * Minimal service worker: caches the app shell so the PWA can install to
 * the home screen and open offline to a "you're offline" state. This is
 * intentionally basic — it does NOT cache API responses or attempt
 * background sync. Replace with a generated Workbox service worker (or
 * next-pwa) once there's a real API to think about caching/staleness for.
 *
 * Paths are computed from the service worker's own URL rather than
 * hardcoded, so this works whether the site is served from the domain
 * root or from a GitHub Pages project subpath (e.g. /repo-name/).
 */
const CACHE = "krambua-shell-v1";
const BASE = new URL(".", self.location.href).pathname; // e.g. "/" or "/repo-name/"
const SHELL = [BASE, `${BASE}logg-inn/`, `${BASE}manifest.json`];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match(BASE)))
  );
});
