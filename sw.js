// Diana Surfers: offline cache. Bump the version after every deploy so phones pick up the new files.
const C = 'diana-v11';
const CORE = ['./', 'index.html', 'diana-assets.js', 'diana-model.js', 'diana-music.js', 'vendor/three.min.js', 'vendor/GLTFLoader.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// cache first; CDN scripts and fonts get cached on the first online launch
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
    return res;
  }).catch(() => caches.match('index.html'))));
});
