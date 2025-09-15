const cacheName = "qtw-v2";

function log(...args: unknown[]) {
  const [msg, ...moreArgs] = args;
  console.log("[SW] " + (msg as string), ...moreArgs);
}

self.addEventListener("install", () => {
  log("installing");
});

self.addEventListener("fetch", (evt: FetchEvent) => {
  evt.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);

      const cacheRes = await cache.match(evt.request);
      if (cacheRes) {
        log("serving " + evt.request.url + " from cache");
        return cacheRes;
      }

      const liveRes = await fetch(evt.request);
      await cache.put(evt.request, liveRes.clone());
      return liveRes;
    })(),
  );
});

self.addEventListener("activate", (evt: ExtendableEvent) => {
  evt.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return undefined;
          }
          log("deleting old cache '" + key + "'");
          return caches.delete(key);
        }),
      ),
    ),
  );
});
