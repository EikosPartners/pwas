//precaches app files
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
//precache data from ajax request
workbox.precaching.precacheAndRoute(["http://localhost:9000"]);
//data from ajax request uses network first strategy
//meaning it will only load from the cache if the network is unavailable

workbox.routing.registerRoute(
  new RegExp("^http://localhost:9000"),
  workbox.strategies.networkFirst({
    cacheName: "data-cache"
  })
);
