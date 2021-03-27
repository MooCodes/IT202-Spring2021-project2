const cacheName = "ali-baig-it202-project2"
const assets = [
    "./",
    "./index.html",
    "./index.js",
    "./img/background.jpg",
    "./img/benefit.png",
    "./img/enemy.png",
    "./img/player.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})