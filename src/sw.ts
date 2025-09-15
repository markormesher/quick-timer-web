declare const self: ServiceWorkerGlobalScope;

const cacheName = "qtw-v2";

function log(...args: unknown[]) {
  const [msg, ...moreArgs] = args;
  console.log("[SW] " + (msg as string), ...moreArgs);
}

self.addEventListener("install", () => {
  log("installing");
  self.skipWaiting().catch((err) => log("failed to skip waiting", err));
});

self.addEventListener("activate", () => {
  log("activating");

  self.clients.claim().catch((err) => log("failed to claim clients", err));

  caches
    .keys()
    .then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return undefined;
          }
          log("deleting old cache '" + key + "'");
          return caches.delete(key);
        }),
      ),
    )
    .catch((err) => {
      log("failed to clear old caches", err);
    });
});

self.addEventListener("online", () => {
  log("online");
});

self.addEventListener("fetch", (evt: FetchEvent) => {
  evt.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(evt.request);
      const cachedBlob = await cachedResponse?.clone().blob();

      const fetchPromise = (async () => {
        try {
          const liveResponse = await fetch(evt.request);
          const liveBlob = await liveResponse.clone().blob();

          if (liveResponse?.ok) {
            let changed = true;

            if (cachedBlob) {
              // size check lets us skip B64 comparison
              if (cachedBlob.size == liveBlob.size) {
                const cachedBlobB64 = await blobToBase64(cachedBlob);
                const liveBlobB64 = await blobToBase64(liveBlob);
                if (cachedBlobB64 == liveBlobB64) {
                  changed = false;
                }
              }
            }

            if (changed) {
              log(evt.request.url + " has changed - suggesting a refresh");
              cache
                .put(evt.request, liveResponse.clone())
                .then(() => {
                  setTimeout(() => announceNewVersion(), 1000);
                })
                .catch((err) => {
                  log("failed to cache entry", err);
                });
            } else {
              log(evt.request.url + " has not changed");
            }
          }

          return liveResponse.clone();
        } catch (err) {
          log("failed to check for updates", err);
          return new Response();
        }
      })();

      return cachedResponse ?? fetchPromise;
    })(),
  );
});

function announceNewVersion() {
  self.clients
    .matchAll()
    .then((clients) => clients.forEach((c) => c.postMessage("UPDATE_AVAILABLE")))
    .catch((err) => {
      log("failed to announce new version", err);
    });
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (err) => {
      log("blob reader error", err);
      reject(new Error("error reading blob"));
    };
    reader.readAsDataURL(blob);
  });
}
