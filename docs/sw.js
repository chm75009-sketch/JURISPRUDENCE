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
const CACHE = "jurisprudence-4.2";
const ESSENTIELS = [
  "./", "./index.html", "./manifest.json",
  /* Le vocabulaire de la Cour : 149 Ko lus une fois, qui rendent la
     reconnaissance de la matière instantanée et disponible hors connexion. */
  "./vocabulaire.json",
  "./guides.html",
  /* L'agenda social lit les brouillons des audits et le moteur NAO, déjà listés. */
  "./agenda.html",
  /* Le générateur de documents des relations collectives : autonome, tout est dans la page. */
  "./documents.html",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-180.png",
  /* Les quatre audits et leurs moteurs. Ils pèsent ensemble un peu plus d'un
     mégaoctet, et c'est délibéré : une page d'audit installée qui échouerait
     hors connexion serait pire que pas d'installation du tout. L'audit se
     calcule entièrement sur le poste — il n'a besoin d'aucun réseau. */
  "./audit.html", "./moteur-eco.js",
  "./audit-cse.html", "./moteur-cse.js",
  "./audit-pse.html", "./moteur-pse.js",
  "./audit-bdese.html", "./moteur-bdese.js",
  "./audit-nao.html", "./moteur-nao.js",
  /* Le formulaire est commun aux quatre pages : sans lui, elles s'ouvrent vides. */
  "./audit-form.js", "./audit-export.js",
  /* Chaque audit s'installe pour lui-même : son manifeste et ses icônes. */
  "./manifest-audit.json", "./manifest-audit-cse.json", "./manifest-audit-pse.json", "./manifest-audit-bdese.json", "./manifest-audit-nao.json",
  "./icons/icon-audit-192.png", "./icons/icon-audit-512.png", "./icons/icon-audit-180.png",
  "./icons/icon-cse-192.png", "./icons/icon-cse-512.png", "./icons/icon-cse-180.png",
  "./icons/icon-pse-192.png", "./icons/icon-pse-512.png", "./icons/icon-pse-180.png",
  "./icons/icon-bdese-192.png", "./icons/icon-bdese-512.png", "./icons/icon-bdese-180.png",
  "./icons/icon-nao-192.png", "./icons/icon-nao-512.png", "./icons/icon-nao-180.png",
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
      /* Le repli hors connexion, et le défaut qu'il portait.

         La version précédente renvoyait « ./index.html » dès qu'une page
         n'était pas en cache. Conséquence : l'icône de l'audit du comité,
         ouverte sans réseau, affichait la recherche de jurisprudence — quatre
         applications installées, une seule qui s'ouvrait. Le repli était plus
         nuisible que l'absence de repli : il ne signalait pas la panne, il
         servait autre chose à sa place, ce qui est la pire des réponses.

         Chaque page se replie désormais sur ELLE-MÊME, et sur rien d'autre.
         Si elle n'a jamais été mise en cache, on le dit — au lieu de faire
         croire que l'application demandée est celle qui s'affiche. */
      .catch(() => caches.match(req).then(r => {
        if (r) return r;
        if (req.mode !== "navigate") return Response.error();
        return new Response(
          '<!doctype html><html lang="fr"><meta charset="utf-8">' +
          '<meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>Hors connexion</title>' +
          '<body style="margin:0;min-height:100vh;display:grid;place-items:center;' +
          'font:16px/1.6 system-ui,-apple-system,sans-serif;background:#f6f7f9;color:#16181d;padding:24px">' +
          '<div style="max-width:34rem;text-align:center">' +
          '<h1 style="font:600 22px/1.3 system-ui;margin:0 0 12px">Cette page n\'est pas disponible hors connexion</h1>' +
          '<p style="margin:0 0 10px;color:#5f6874">Vous l\'ouvrez pour la première fois, ou depuis une mise à jour : ' +
          'elle n\'a pas encore été enregistrée sur l\'appareil. Rétablissez la connexion et rouvrez-la une fois ; ' +
          'elle fonctionnera ensuite sans réseau.</p>' +
          '<p style="margin:0;color:#5f6874;font-size:14px">Aucune autre page ne vous est présentée à sa place : ' +
          'ce serait vous laisser croire que vous consultez celle que vous avez demandée.</p>' +
          '</div></body></html>',
          { headers: { "content-type": "text/html; charset=utf-8" }, status: 503 });
      }))
  );
});
