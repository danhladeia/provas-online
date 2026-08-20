/* ============================================================
   SERVICE WORKER — deixa o app instalável e funcionando offline.
   Estratégia: cache-first para tudo que já foi visitado, com
   atualização em segundo plano quando há internet.
   ============================================================ */
const CACHE = "prova-ed-fisica-v1";
const NUCLEO = [
  "./",
  "index.html",
  "professor.html",
  "manifest.webmanifest",
  "css/estilo.css",
  "js/config.js",
  "js/dados.js",
  "js/banco.js",
  "js/banco7.js",
  "js/banco8.js",
  "js/banco9.js",
  "js/app.js",
  "js/professor.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(NUCLEO)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(chaves => Promise.all(chaves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then(cache => {
      const rede = fetch(req).then(resp => {
        if (resp && resp.ok) caches.open(CACHE).then(c => c.put(req, resp.clone()));
        return resp;
      }).catch(() => cache);
      return cache || rede;
    })
  );
});
