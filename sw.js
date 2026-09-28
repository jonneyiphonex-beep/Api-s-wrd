const SHELL_CACHE = "open-api-reader-shell-v2";
const SHELL_FILES = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.json", "./telegram-methods.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("open-api-reader-") && key !== SHELL_CACHE).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response.ok) return response;
          return caches.open(SHELL_CACHE).then((cache) => cache.put(event.request, response.clone())).then(() => response);
        })
        .catch(async () => (await caches.match(event.request)) || caches.match("./index.html")),
    );
    return;
  }
});