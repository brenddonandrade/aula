// App instalado (PWA): só guarda a página inicial para abrir mesmo com a internet oscilando. Os dados (aulas,
// tarefas, testes) vêm sempre do servidor; os arquivos da interface têm nome novo a cada versão (não ficam velhos).
const CACHE = "aula-shell-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./manifest.webmanifest", "./icon-192.png"])).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;   // API, imagens e scripts: direto da rede
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put("./", copy)).catch(() => {});
      return res;
    }).catch(() => caches.match("./").then((r) => r || Response.error())),
  );
});
