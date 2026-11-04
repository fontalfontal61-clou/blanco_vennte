const C='blanco-v2';
const URLS=['./','./index.html','./manifest.webmanifest','./blanco-offline.html',
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(C).then(c=>Promise.all(URLS.map(u=>fetch(new Request(u,{mode:u.startsWith('http')?'no-cors':'same-origin'})).then(r=>c.put(u,r)).catch(()=>{}))).then(()=>self.skipWaiting())))});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.hostname==='www.gstatic.com'){
  e.respondWith(caches.match(r.url).then(m=>m||fetch(r).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put(r.url,cp));return x})));return}
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(x=>{const cp=x.clone();caches.open(C).then(c=>c.put(r,cp));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))))}});
