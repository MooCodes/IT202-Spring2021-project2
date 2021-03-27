const cacheName = "ali-baig-it202-project2"
const assets = [
    "IT202-Spring2021-project2/",
    "IT202-Spring2021-project2/index.js",
    "IT202-Spring2021-project2/img/background.jpg",
    "IT202-Spring2021-project2/img/benefit.png",
    "IT202-Spring2021-project2/img/enemy.png",
    "IT202-Spring2021-project2/img/player.png"
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