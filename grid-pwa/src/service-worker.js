//precaches app files
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

//caches data from ajax request using network first strategy - meaning it will only load the cache if the network is unavailable
workbox.routing.registerRoute(
  new RegExp("^http://localhost:9000"),
  workbox.strategies.networkFirst({
    cacheName: "data-cache"
  })
);
