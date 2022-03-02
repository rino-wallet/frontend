self.addEventListener("install", (event) => {
   // Activate service worker immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("message", event => {
  if (event.data.type === "metadata") {
    self.INTEGRITY_METADATA = event.data.payload;
  }
});

self.addEventListener('activate', function(event) {
  // Become available to all tabs
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event) {
  let request = event.request;
  if (request.method === "GET") {
    // check if URL in pre-defined whitelist
    const resourceName = request.url.split('/').pop();
    if (resourceName in (self.INTEGRITY_METADATA || {})) { 
      console.log("Fetch event: ", resourceName)
      let sriHash = self.INTEGRITY_METADATA[resourceName];
      let fetchOptions = {
        integrity: sriHash,
        method: request.method,
        mode: "cors",
        credentials: "omit",
      };
      // ServiceWorker lets the document proceed fetching the resource, but with modified fetch options
      event.respondWith(fetch(request, fetchOptions));
    }
  }
})