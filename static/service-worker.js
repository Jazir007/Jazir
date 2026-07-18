const CACHE='zedjer-shell-v4';
const SHELL=['/','/static/style.css','/static/app.js','/static/manifest.webmanifest','/static/images/zedjer-zj.png','/static/zedjer-books-logo.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin || !url.pathname.startsWith('/static/')) return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok) caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));
    return response;
  }).catch(()=>caches.match(event.request)));
});
