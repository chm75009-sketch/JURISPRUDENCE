/* Service worker : rend l'application installable et consultable hors connexion.

   Stratégie « réseau d'abord, cache en secours ». C'est le choix déterminant :
   une stratégie « cache d'abord » servirait une version périmée après chaque
   mise à jour, ce qui serait pire que l'absence de cache. Ici, tant qu'il y a du
   réseau l'utilisateur voit toujours la dernière version ; sans réseau, il
   retrouve l'application telle qu'il l'a consultée la dernière fois.

   Les appels aux API (Judilibre, relais Légifrance) ne sont jamais mis en
   cache : les résultats de recherche doivent rester frais, et une réponse
   d'API stockée hors ligne induirait en erreur. */

/* Le nom du cache porte la version : un changement de version écarte
   automatiquement l'ancien contenu. */
const CACHE = "jurisprudence-2.0";
const ESSENTIELS = [
  "./", "./index.html", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-180.png",
  /* Les deux audits et leurs moteurs. Ils pèsent ensemble un peu plus d'un
     mégaoctet, et c'est délibéré : une page d'audit installée qui échouerait
     hors connexion serait pire que pas d'installation du tout. L'audit se
     calcule entièrement sur le poste — il n'a besoin d'aucun réseau. */
  "./audit.html", "./moteur-eco.js",
  "./audit-cse.html", "./moteur-cse.js",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ESSENTIELS))
      .catch(() => {})                      // un fichier manquant ne doit pas tout bloquer
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;                         // le relais fonctionne en POST
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // API Judilibre et Légifrance
  if (url.pathname.startsWith("/.netlify/")) return;        // relais

  e.respondWith(
    fetch(req)
      .then(rep => {
        if (rep && rep.ok && rep.type === "basic") {
          const copie = rep.clone();
          caches.open(CACHE).then(c => c.put(req, copie)).catch(() => {});
        }
        return rep;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
