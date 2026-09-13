const CACHE_NAME = "baymax-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(ARQUIVOS);
            })
    );

});

self.addEventListener("fetch", function (event) {

    event.respondWith(
        caches.match(event.request)
            .then(function (resposta) {
                return resposta || fetch(event.request);
            })
    );

});