/* Service worker : rend l'application installable et consultable hors connexion.

   Stratégie « réseau d'abord, cache en secours ». C'est le choix déterminant :
   une stratégie « cache d'abord » servirait une version périmée après chaque
   mise à jour, ce qui serait pire que l'absence de cache. Ici, tant qu'il y a du
   réseau l'utilisateur voit toujours la dernière version ; sans réseau, il
   retrouve l'application telle qu'il l'a consultée la dernière fois.

   Les appels aux API (Judilibre, relais Légifrance, API Anthropic de
   l'assistant) ne sont jamais mis en cache : les résultats doivent rester
   frais, et une réponse d'API stockée hors ligne induirait en erreur. */

/* Le nom du cache porte la version : un changement de version écarte
   automatiquement l'ancien contenu. */
const CACHE = "jurisprudence-7.9";
const ESSENTIELS = [
  "./", "./index.html", "./auditer.html", "./gerer.html", "./recherche.html", "./manifest.json",
  /* L'icône : sans elle, chaque page demandait un favicon.ico inexistant,
     et le 404 passait pour une erreur de chargement à chaque essai. */
  "./favicon.ico",
  /* Les trois outils : ils tiennent la donnée que les audits se bornaient à contrôler. */
  "./duerp.html",
  /* Le vocabulaire de la Cour : 149 Ko lus une fois, qui rendent la
     reconnaissance de la matière instantanée et disponible hors connexion. */
  "./vocabulaire.json",
  "./guides.html",
  /* L'agenda social lit les brouillons des audits et le moteur NAO, déjà listés. */
  "./agenda.html",
  /* Le générateur de documents des relations collectives : autonome, tout est dans la page. */
  "./documents.html",
  /* Les parcours guidés : la couche opératoire au-dessus des audits. La page
     et son moteur ne dépendent d'aucun réseau — le profil et l'avancement sont
     lus dans le stockage local du poste, les délais se calculent sur place.
     Une procédure engagée hors connexion est justement le cas où l'échéance
     compte le plus : elle doit s'ouvrir.
     Quinze parcours depuis le 23 août 2026 : aux sept premiers se sont
     ajoutés les cinq parcours de régularisation appelés par le guide de
     l'audit social — affichages obligatoires, registre unique du personnel,
     base de données, index de l'égalité professionnelle, entretiens de
     parcours professionnel —, puis les trois nés de l'harmonisation avec
     Juris Expert : embaucher, organiser les congés payés, établir les
     documents de fin de contrat. */
  "./parcours.html", "./parcours.js",
  /* L'équipe, ses droits et son journal. Le module est chargé par TOUTES les
     pages : sans lui hors connexion, elles s'ouvriraient sans identification
     et sans journal — c'est-à-dire autrement qu'en ligne. La page
     d'administration suit, pour que les droits se règlent aussi sans réseau. */
  "./droits.js", "./equipe.html", "./DROITS.md",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-180.png",
  /* Les audits et leurs moteurs. Ils pèsent ensemble un peu plus d'un
     mégaoctet, et c'est délibéré : une page d'audit installée qui échouerait
     hors connexion serait pire que pas d'installation du tout. L'audit se
     calcule entièrement sur le poste — il n'a besoin d'aucun réseau. */
  "./audit.html", "./moteur-eco.js",
  "./audit-cse.html", "./moteur-cse.js",
  "./audit-pse.html", "./moteur-pse.js",
  "./audit-bdese.html", "./bdese.html", "./moteur-bdese.js",
  "./audit-nao.html", "./moteur-nao.js",
  /* Le plan d'action pour l'égalité professionnelle : l'outil, pas l'audit. La
     page est autonome — les textes qu'elle cite sont dans son code, le plan
     vit dans le stockage local. Elle doit donc s'ouvrir hors connexion comme
     le reste. */
  "./egalite.html",
  "./audit-sst.html", "./moteur-sst.js",
  /* Le premier module côté relations individuelles : discipline et règlement
     intérieur. Même raison que les autres — un audit installé qui échouerait
     hors connexion serait pire que pas d'installation du tout. */
  "./audit-discipline.html", "./moteur-discipline.js",
  /* L'audit social chapeau : le point d'entrée des obligations, qui renvoie
     aux modules détaillés. */
  "./audit-social.html", "./moteur-social.js",
  /* Le registre unique du personnel : l'outil, pas l'audit. Tout est dans la
     page — les six articles qui la commandent y sont reproduits, et les lignes
     du registre vivent dans le stockage local du poste. Une entreprise qui
     tient son registre sans réseau doit pouvoir l'ouvrir : c'est justement le
     document qu'un agent de contrôle demande sur place. */
  "./registre.html",
  /* Le formulaire est commun aux pages d'audit : sans lui, elles s'ouvrent vides. */
  "./audit-form.js", "./audit-export.js", "./parcours-deux-temps.js",
  /* Les documents que l'application rédige elle-même. */
  "./documents-produits.js",
  "./documents-cse.js", "./documents-pse.js", "./documents-discipline.js",
  "./documents-cse-2.js", "./documents-cse-3.js",
  "./documents-bdese.js", "./documents-sst.js",
  "./documents-sst-2.js", "./documents-discipline-2.js",
  "./documents-nao.js",
  "./documents-eco-procedure.js", "./documents-eco-cse.js",
  "./documents-eco-fond.js", "./documents-eco-2.js",
  /* La fiche client : la source unique du profil partagé (clé
     « profil-entreprise »), lue et écrite par l'audit social, les parcours, le
     générateur de documents et les huit audits détaillés. Sans elle, la
     première étape du parcours client ne s'affiche pas. */
  "./profil.js",
  /* La table des outils de Juris Expert : l'autre application de la juriste,
     celle qui imprime le document final. Ce fichier ne contient que des liens
     — il ne charge rien, il n'appelle rien. Il est mis en cache parce que le
     guide de régularisation, les parcours et le générateur de documents le
     lisent : sans lui, les renvois disparaissent silencieusement au lieu de
     s'afficher. */
  "./juris-expert.js",
  /* Le sélecteur de convention collective et la liste officielle des IDCC
     (54 Ko) : sans eux, le champ convention retombe en saisie libre — il
     fonctionne, mais la liste doit être là hors connexion comme le reste. */
  "./idcc.js", "./idcc.json",
  /* L'assistant Claude, présent sur toutes les pages. Son code se met en cache
     comme le reste ; ses appels à api.anthropic.com, eux, ne passent JAMAIS par
     ce service worker (le gestionnaire fetch ne retient que la même origine). */
  "./assistant.js",
  /* Chaque audit s'installe pour lui-même : son manifeste et ses icônes. */
  "./manifest-audit.json", "./manifest-audit-cse.json", "./manifest-audit-pse.json", "./manifest-audit-bdese.json", "./manifest-audit-nao.json", "./manifest-audit-sst.json", "./manifest-audit-social.json", "./manifest-audit-discipline.json",
  "./icons/icon-audit-192.png", "./icons/icon-audit-512.png", "./icons/icon-audit-180.png",
  "./icons/icon-cse-192.png", "./icons/icon-cse-512.png", "./icons/icon-cse-180.png",
  "./icons/icon-pse-192.png", "./icons/icon-pse-512.png", "./icons/icon-pse-180.png",
  "./icons/icon-bdese-192.png", "./icons/icon-bdese-512.png", "./icons/icon-bdese-180.png",
  "./icons/icon-nao-192.png", "./icons/icon-nao-512.png", "./icons/icon-nao-180.png",
  "./icons/icon-sst-192.png", "./icons/icon-sst-512.png", "./icons/icon-sst-180.png",
  "./icons/icon-social-192.png", "./icons/icon-social-512.png", "./icons/icon-social-180.png",
  "./icons/icon-discipline-192.png", "./icons/icon-discipline-512.png", "./icons/icon-discipline-180.png",
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
  if (url.origin !== self.location.origin) return;          // API Judilibre, Légifrance, Anthropic
  if (url.pathname.startsWith("/.netlify/")) return;        // relais

  /* GitHub Pages sert index.html (et le reste) avec un en-tête
     « cache-control: max-age=600 » : sans ce qui suit, fetch(req) peut être
     satisfait par le cache HTTP du navigateur lui-même, sans passer par le
     réseau — le repli hors connexion n'a jamais lieu, mais l'utilisateur voit
     quand même une page vieille de dix minutes, malgré le commentaire
     ci-dessus. { cache: "reload" } force la vérification réseau à chaque
     requête ; le résultat continue d'alimenter le cache du service worker. */
  e.respondWith(
    fetch(req.url, { cache: "reload" })
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
