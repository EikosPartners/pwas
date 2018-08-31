console.log("this works!");

//precaches app files
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
