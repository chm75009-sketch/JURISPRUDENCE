/* Équipe, droits et journal — le point unique d'autorisation de l'application.

   POURQUOI CE FICHIER EXISTE. Jusqu'ici l'application n'avait qu'un usager :
   celui qui ouvrait le navigateur. Une juriste qui travaille avec une équipe a
   besoin de savoir qui a lancé quel audit, qui a produit quel document, et de
   pouvoir ouvrir tel module à telle personne sans lui ouvrir les autres. Ce
   fichier apporte les trois : des utilisateurs, des droits par module, un
   journal.

   LA RÈGLE D'ARCHITECTURE, QUI PRIME SUR TOUT LE RESTE. Il n'existe qu'un seul
   endroit où l'on demande un droit, et un seul où l'on enregistre un acte :

       Droits.peut(module, action)          -> true / false
       Journal.acte(module, action, detail) -> Promise

   Aucune page n'écrit de vérification de droit à la main. Aucune page ne lit
   « equipe-utilisateurs ». Les deux fonctions ci-dessus s'appuient sur un
   FOURNISSEUR interchangeable : aujourd'hui le fournisseur local, qui range
   tout dans le stockage du navigateur ; demain un fournisseur distant
   (Supabase, fonction Netlify) qu'il suffira de brancher — `Droits.brancher(f)`
   — sans toucher une seule page. Le contrat du fournisseur est décrit dans
   DROITS.md, dans le dossier docs/.

   CE QUE CES DROITS SONT, ET CE QU'ILS NE SONT PAS. Tant que l'application
   fonctionne sans serveur, ces droits sont ORGANISATIONNELS et non
   SÉCURITAIRES : ils répartissent le travail dans une équipe de bonne foi.
   Quiconque a accès au poste peut les contourner — la console du navigateur
   suffit. Cette phrase est affichée en clair sur la page d'administration, et
   elle n'est pas une précaution de style : c'est la vérité du dispositif.

   LES CODES D'ACCÈS NE SONT PAS STOCKÉS EN CLAIR. Chaque utilisateur porte un
   sel tiré au hasard ; ce qui est enregistré est le condensat SHA-256 du sel et
   du code. Cela protège de la lecture accidentelle — un collègue qui ouvre le
   stockage local ne lit pas les codes de l'équipe. Cela ne protège pas d'un
   utilisateur déterminé : le condensat est sur le poste, et rien n'empêche de
   l'attaquer hors ligne ou de le remplacer.

   MODE OUVERT. Tant qu'aucun utilisateur n'a été créé, l'application se
   comporte exactement comme avant : aucun écran de connexion, tous les droits
   accordés, aucun journal. L'équipe est une fonction que l'on ajoute, pas un
   péage que l'on subit.                                                      */

"use strict";
(function () {

  /* =====================================================================
     1. CE QUE L'ON PEUT FAIRE, ET SUR QUOI
     ===================================================================== */

  var CLE_UTILISATEURS = "equipe-utilisateurs";
  var CLE_SESSION      = "equipe-session";
  var CLE_JOURNAL      = "equipe-journal";
  var SCHEMA           = 1;          // version du schéma des données (voir DROITS.md)
  var JOURNAL_MAX      = 4000;       // au-delà, les plus anciennes entrées tombent
  var PHOTO_COTE       = 256;        // côté maximal de la photo, en pixels
  var PHOTO_OCTETS_MAX = 180 * 1024; // ~180 Ko une fois encodée en base64

  /* Les modules de l'application. L'identifiant ne change jamais : il est
     inscrit dans les droits enregistrés et dans le journal. Le libellé, lui,
     peut être réécrit sans conséquence. */
  var MODULES = [
    { id: "recherche",        nom: "Recherche de jurisprudence",        page: "index.html" },
    { id: "audit-social",     nom: "Audit social — le point complet",   page: "audit-social.html" },
    { id: "audit-economique", nom: "Audit — licenciement économique",   page: "audit.html" },
    { id: "audit-cse",        nom: "Audit — comité social et économique", page: "audit-cse.html" },
    { id: "audit-pse",        nom: "Audit — plan de sauvegarde de l'emploi", page: "audit-pse.html" },
    { id: "audit-bdese",      nom: "Audit — base de données (BDESE)",   page: "audit-bdese.html" },
    { id: "audit-nao",        nom: "Audit — négociation obligatoire",   page: "audit-nao.html" },
    { id: "audit-sst",        nom: "Audit — santé-sécurité (SST)",      page: "audit-sst.html" },
    { id: "audit-discipline", nom: "Audit — discipline et règlement intérieur", page: "audit-discipline.html" },
    { id: "parcours",         nom: "Parcours guidés",                   page: "parcours.html" },
    { id: "documents",        nom: "Documents",                         page: "documents.html" },
    { id: "agenda",           nom: "Agenda social",                     page: "agenda.html" },
    { id: "profil",           nom: "Fiche client (profil d'entreprise)", page: null },
    { id: "assistant",        nom: "Assistant Claude",                  page: null },
    { id: "equipe",           nom: "Équipe, droits et journal",         page: "equipe.html" }
  ];

  /* Les quatre gestes que l'on ouvre ou que l'on ferme, module par module. */
  var ACTIONS = [
    { id: "consulter", nom: "Consulter",
      aide: "Ouvrir le module et lire ce qui s'y trouve." },
    { id: "saisir",    nom: "Saisir / modifier",
      aide: "Répondre aux questionnaires, enregistrer, modifier la fiche client." },
    { id: "produire",  nom: "Produire des documents",
      aide: "Engendrer un courrier, un rapport, un modèle depuis le module." },
    { id: "exporter",  nom: "Exporter / imprimer",
      aide: "Imprimer, enregistrer un fichier, copier le résultat hors de l'application." }
  ];

  /* Les droits d'administration. Ils ne portent pas sur un module : ils
     portent sur l'équipe elle-même. */
  var ACTIONS_ADMIN = [
    { id: "creerUtilisateur",     nom: "Créer un utilisateur" },
    { id: "supprimerUtilisateur", nom: "Supprimer un utilisateur" },
    { id: "changerCode",          nom: "Changer un code d'accès" },
    { id: "accorderDroits",       nom: "Accorder les droits complets" }
  ];

  /* Les pages qui restent ouvertes à tous : la documentation ne se ferme pas. */
  var PAGES_LIBRES = { "guides.html": true };

  /* Les clés du stockage local que l'application écrit dans son travail
     ordinaire, et le module auquel chacune se rattache. Elles servent à
     alimenter le journal SANS modifier une seule page : droits.js observe les
     écritures et en tire l'acte correspondant. */
  var CLES_SURVEILLEES = {
    "profil-entreprise":         { module: "profil",           action: "saisir",  detail: "Fiche client modifiée" },
    "audit-eco-brouillon":       { module: "audit-economique", action: "saisir",  detail: "Audit renseigné" },
    "audit-brouillon":           { module: "audit-economique", action: "saisir",  detail: "Audit renseigné" },
    "audit-cse-brouillon":       { module: "audit-cse",        action: "saisir",  detail: "Audit renseigné" },
    "audit-pse-brouillon":       { module: "audit-pse",        action: "saisir",  detail: "Audit renseigné" },
    "audit-bdese-brouillon":     { module: "audit-bdese",      action: "saisir",  detail: "Audit renseigné" },
    "audit-nao-brouillon":       { module: "audit-nao",        action: "saisir",  detail: "Audit renseigné" },
    "audit-sst-brouillon":       { module: "audit-sst",        action: "saisir",  detail: "Audit renseigné" },
    "audit-discipline-brouillon":{ module: "audit-discipline", action: "saisir",  detail: "Audit renseigné" },
    "audit-social-brouillon":    { module: "audit-social",     action: "saisir",  detail: "Audit renseigné" },
    "audit-social-historique":   { module: "audit-social",     action: "produire", detail: "Rapport d'audit social versé à l'historique" },
    "documents-brouillon":       { module: "documents",        action: "produire", detail: "Document engendré" },
    "parcours-etat":             { module: "parcours",         action: "saisir",  detail: "Étape de parcours franchie" },
    "agenda-brouillon":          { module: "agenda",           action: "saisir",  detail: "Agenda modifié" }
  };

  /* =====================================================================
     2. OUTILS — condensat, échappement, identifiants
     ===================================================================== */

  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function identifiant(prefixe) {
    var t = Date.now().toString(36);
    var h = "";
    try {
      var o = new Uint8Array(6);
      (self.crypto || window.crypto).getRandomValues(o);
      for (var i = 0; i < o.length; i++) h += (o[i] + 256).toString(16).slice(1);
    } catch (_) {
      h = Math.random().toString(36).slice(2, 14);
    }
    return prefixe + "-" + t + "-" + h;
  }

  function sel() {
    var o = new Uint8Array(16), h = "";
    try { (self.crypto || window.crypto).getRandomValues(o); }
    catch (_) { for (var j = 0; j < 16; j++) o[j] = Math.floor(Math.random() * 256); }
    for (var i = 0; i < o.length; i++) h += (o[i] + 256).toString(16).slice(1);
    return h;
  }

  /* SHA-256 en JavaScript pur.

     L'API Web Crypto n'existe que dans un contexte sécurisé : https, ou
     localhost. L'application s'ouvre aussi depuis un fichier local, où
     crypto.subtle est absent. Un condensat qui changerait selon le mode
     d'ouverture rendrait les codes invérifiables d'un jour à l'autre — c'est
     pourquoi la même implémentation sert partout. Elle rend exactement ce que
     rend Web Crypto : les deux ont été comparées sur les vecteurs d'essai. */
  var K256 = [
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];

  function sha256hex(texte) {
    /* Le texte est d'abord encodé en UTF-8 : sans cela, un code contenant un
       accent ne rendrait pas le même condensat que Web Crypto. */
    var octets = [], i, c;
    var u = unescape(encodeURIComponent(String(texte)));
    for (i = 0; i < u.length; i++) octets.push(u.charCodeAt(i) & 0xff);

    var l = octets.length, bits = l * 8;
    octets.push(0x80);
    while (octets.length % 64 !== 56) octets.push(0);
    octets.push(0, 0, 0, 0);
    octets.push((bits >>> 24) & 0xff, (bits >>> 16) & 0xff, (bits >>> 8) & 0xff, bits & 0xff);

    var H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var w = new Array(64);

    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }

    for (i = 0; i < octets.length; i += 64) {
      var t;
      for (t = 0; t < 16; t++)
        w[t] = (octets[i + 4 * t] << 24) | (octets[i + 4 * t + 1] << 16) |
               (octets[i + 4 * t + 2] << 8) | octets[i + 4 * t + 3];
      for (t = 16; t < 64; t++) {
        var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], cc = H[2], d = H[3], f = H[4], g = H[5], hh = H[6], hx = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(f, 6) ^ rotr(f, 11) ^ rotr(f, 25);
        var ch = (f & g) ^ (~f & hh);
        var t1 = (hx + S1 + ch + K256[t] + w[t]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & cc) ^ (b & cc);
        var t2 = (S0 + maj) | 0;
        hx = hh; hh = g; g = f; f = (d + t1) | 0;
        d = cc; cc = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + f) | 0; H[5] = (H[5] + g) | 0; H[6] = (H[6] + hh) | 0; H[7] = (H[7] + hx) | 0;
    }
    var sortie = "";
    for (i = 0; i < 8; i++) sortie += ("00000000" + (H[i] >>> 0).toString(16)).slice(-8);
    return sortie;
  }

  function condensat(sel_, code) { return sha256hex(sel_ + ":" + String(code)); }

  /* =====================================================================
     3. LE FOURNISSEUR LOCAL

     Il implémente le contrat décrit dans DROITS.md. Toutes ses méthodes
     rendent une promesse — y compris celles qui, ici, répondent
     instantanément : le jour où elles passeront par le réseau, rien ne
     changera pour l'appelant.

     `instantane()` est la seule méthode facultative du contrat : elle rend
     une photographie synchrone de l'état. Le fournisseur local la propose,
     parce qu'il lit un stockage synchrone ; un fournisseur distant ne la
     proposera pas, et le noyau s'en passera (voir `quandPret`).
     ===================================================================== */

  function FournisseurLocal() {

    function lireJson(cle, defaut) {
      try {
        var v = JSON.parse(localStorage.getItem(cle) || "null");
        return v == null ? defaut : v;
      } catch (_) { return defaut; }
    }
    function ecrireJson(cle, valeur) {
      try { localStorage.setItem(cle, JSON.stringify(valeur)); return true; }
      catch (_) { return false; }
    }

    function utilisateurs() {
      var v = lireJson(CLE_UTILISATEURS, null);
      if (!v || !Array.isArray(v.utilisateurs)) return [];
      return v.utilisateurs;
    }
    function poserUtilisateurs(liste) {
      return ecrireJson(CLE_UTILISATEURS, { schema: SCHEMA, utilisateurs: liste });
    }

    return {
      nom: "local",

      /* ---- photographie synchrone (facultative dans le contrat) ---- */
      instantane: function () {
        return { utilisateurs: utilisateurs(), session: lireJson(CLE_SESSION, null) };
      },

      /* ---- utilisateurs ---- */
      listerUtilisateurs: function () {
        return Promise.resolve(utilisateurs());
      },
      creerUtilisateur: function (u) {
        var liste = utilisateurs();
        liste.push(u);
        if (!poserUtilisateurs(liste))
          return Promise.reject(new Error("Le stockage du navigateur est plein : l'utilisateur n'a pas été enregistré."));
        return Promise.resolve(u);
      },
      modifierUtilisateur: function (id, patch) {
        var liste = utilisateurs(), trouve = null;
        for (var i = 0; i < liste.length; i++) {
          if (liste[i].id === id) {
            for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) liste[i][k] = patch[k];
            trouve = liste[i];
          }
        }
        if (!trouve) return Promise.reject(new Error("Utilisateur introuvable."));
        if (!poserUtilisateurs(liste))
          return Promise.reject(new Error("Le stockage du navigateur est plein : la modification n'a pas été enregistrée."));
        return Promise.resolve(trouve);
      },
      supprimerUtilisateur: function (id) {
        var liste = utilisateurs().filter(function (u) { return u.id !== id; });
        poserUtilisateurs(liste);
        var s = lireJson(CLE_SESSION, null);
        if (s && s.utilisateur === id) { try { localStorage.removeItem(CLE_SESSION); } catch (_) {} }
        return Promise.resolve();
      },

      /* ---- session ---- */
      sessionCourante: function () { return Promise.resolve(lireJson(CLE_SESSION, null)); },
      ouvrirSession: function (session) { ecrireJson(CLE_SESSION, session); return Promise.resolve(session); },
      fermerSession: function () {
        try { localStorage.removeItem(CLE_SESSION); } catch (_) {}
        return Promise.resolve();
      },

      /* ---- journal ---- */
      journaliser: function (entree) {
        var j = lireJson(CLE_JOURNAL, null);
        if (!j || !Array.isArray(j.entrees)) j = { schema: SCHEMA, entrees: [] };
        j.entrees.push(entree);
        if (j.entrees.length > JOURNAL_MAX) j.entrees = j.entrees.slice(j.entrees.length - JOURNAL_MAX);
        /* Un journal saturé ne doit jamais empêcher de travailler : si
           l'écriture échoue faute de place, on sacrifie la moitié des plus
           anciennes entrées, une seule fois, puis on renonce en silence. */
        if (!ecrireJson(CLE_JOURNAL, j)) {
          j.entrees = j.entrees.slice(Math.floor(j.entrees.length / 2));
          ecrireJson(CLE_JOURNAL, j);
        }
        return Promise.resolve(entree);
      },
      lireJournal: function () {
        var j = lireJson(CLE_JOURNAL, null);
        return Promise.resolve(j && Array.isArray(j.entrees) ? j.entrees : []);
      },
      purgerJournal: function () {
        try { localStorage.removeItem(CLE_JOURNAL); } catch (_) {}
        return Promise.resolve();
      }
    };
  }

  /* =====================================================================
     4. LE NOYAU — état, hydratation, abonnements
     ===================================================================== */

  var fournisseur = FournisseurLocal();

  var etat = { pret: false, utilisateurs: [], session: null };
  var abonnes = [];
  var attentes = [];

  function prevenir() {
    for (var i = 0; i < abonnes.length; i++) {
      try { abonnes[i](instantaneLecture()); } catch (_) {}
    }
  }

  function instantaneLecture() {
    return {
      pret: etat.pret,
      modeOuvert: etat.utilisateurs.length === 0,
      utilisateur: utilisateurCourant(),
      nbUtilisateurs: etat.utilisateurs.length
    };
  }

  function hydrater() {
    /* Le fournisseur local répond sans attendre : on prend sa photographie
       synchrone pour que `peut()` soit utilisable dès la lecture du script.
       Un fournisseur distant ne l'offrira pas — la promesse ci-dessous fait
       alors seule le travail, et `quandPret` sert à l'attendre. */
    if (typeof fournisseur.instantane === "function") {
      try {
        var v = fournisseur.instantane();
        etat.utilisateurs = v.utilisateurs || [];
        etat.session = v.session || null;
        etat.pret = true;
      } catch (_) {}
    }
    return Promise.all([fournisseur.listerUtilisateurs(), fournisseur.sessionCourante()])
      .then(function (r) {
        etat.utilisateurs = r[0] || [];
        etat.session = r[1] || null;
        etat.pret = true;
        var f = attentes; attentes = [];
        for (var i = 0; i < f.length; i++) { try { f[i](); } catch (_) {} }
        prevenir();
        return instantaneLecture();
      })
      .catch(function (err) {
        /* Un fournisseur en panne ne doit pas fermer l'application : on
           retombe en mode ouvert, et on le dit dans la console. */
        etat.utilisateurs = []; etat.session = null; etat.pret = true;
        try { console.warn("Droits : fournisseur indisponible, mode ouvert.", err); } catch (_) {}
        var g = attentes; attentes = [];
        for (var k = 0; k < g.length; k++) { try { g[k](); } catch (_) {} }
        prevenir();
        return instantaneLecture();
      });
  }

  function parId(id) {
    for (var i = 0; i < etat.utilisateurs.length; i++)
      if (etat.utilisateurs[i].id === id) return etat.utilisateurs[i];
    return null;
  }

  function utilisateurCourant() {
    if (!etat.session) return null;
    var u = parId(etat.session.utilisateur);
    if (!u) return null;
    return { id: u.id, nom: u.nom, fonction: u.fonction, photo: u.photo || "",
             admin: !!u.admin, droits: u.droits || {}, droitsAdmin: u.droitsAdmin || {},
             depuis: etat.session.depuis };
  }

  /* =====================================================================
     5. LE POINT UNIQUE D'AUTORISATION
     ===================================================================== */

  function modeOuvert() { return etat.utilisateurs.length === 0; }

  /* peut(module, action) — la seule question que les pages posent.

     Elle répond sans attendre. Trois cas, dans cet ordre :
       — aucun utilisateur n'existe : mode ouvert, tout est permis ;
       — personne n'est connecté : rien n'est permis (l'écran de connexion
         est affiché par ailleurs) ;
       — un utilisateur est connecté : administrateur, tout est permis ;
         sinon, la case cochée fait foi.                                    */
  function peut(module, action) {
    if (modeOuvert()) return true;
    var u = utilisateurCourant();
    if (!u) return false;
    if (u.admin) return true;
    if (!module) return false;
    var d = u.droits && u.droits[module];
    if (!d) return false;
    return d[action] === true;
  }

  /* peutAdmin(action) — les gestes qui portent sur l'équipe elle-même. */
  function peutAdmin(action) {
    if (modeOuvert()) return true;
    var u = utilisateurCourant();
    if (!u) return false;
    if (u.admin) return true;
    return !!(u.droitsAdmin && u.droitsAdmin[action] === true);
  }

  function quandPret(fn) {
    if (etat.pret) { try { fn(instantaneLecture()); } catch (_) {} return; }
    attentes.push(function () { try { fn(instantaneLecture()); } catch (_) {} });
  }

  /* =====================================================================
     6. LE JOURNAL
     ===================================================================== */

  function entree(type, module, action, detail) {
    var u = utilisateurCourant();
    return {
      id: identifiant("j"),
      horodatage: new Date().toISOString(),
      type: type,                                  // connexion | deconnexion | acte | refus | administration
      utilisateur: u ? u.id : "",
      nom: u ? u.nom : "",
      module: module || "",
      action: action || "",
      detail: detail == null ? "" : String(detail).slice(0, 400),
      page: (location.pathname.split("/").pop() || "index.html")
    };
  }

  function journaliser(type, module, action, detail) {
    /* En mode ouvert, il n'y a personne à qui imputer un acte : on n'écrit
       rien plutôt que d'écrire « inconnu » quatre mille fois. */
    if (modeOuvert()) return Promise.resolve(null);
    var ent = entree(type, module, action, detail);
    /* Prévenir les abonnés APRÈS l'écriture, et non avant : la page
       d'administration se repeignait sinon juste avant que la connexion
       qu'elle venait d'obtenir soit inscrite, et son journal affichait tout
       sauf la ligne que l'on venait de produire. */
    return fournisseur.journaliser(ent).then(function () { prevenir(); return ent; })
      .catch(function () { return null; });
  }

  var Journal = {
    acte: function (module, action, detail) { return journaliser("acte", module, action, detail); },
    refus: function (module, action, detail) { return journaliser("refus", module, action, detail); },
    administration: function (action, detail) { return journaliser("administration", "equipe", action, detail); },
    lire: function (filtre) {
      return fournisseur.lireJournal().then(function (entrees) {
        return filtrer(entrees, filtre || {});
      });
    },
    purger: function () { return fournisseur.purgerJournal(); },
    csv: function (entrees) { return versCsv(entrees); }
  };

  function filtrer(entrees, f) {
    return entrees.filter(function (x) {
      if (f.utilisateur && x.utilisateur !== f.utilisateur) return false;
      if (f.module && x.module !== f.module) return false;
      if (f.type && x.type !== f.type) return false;
      if (f.du && x.horodatage.slice(0, 10) < f.du) return false;
      if (f.au && x.horodatage.slice(0, 10) > f.au) return false;
      if (f.texte) {
        var t = f.texte.toLowerCase();
        var champ = (x.nom + " " + x.module + " " + x.action + " " + x.detail + " " + x.page).toLowerCase();
        if (champ.indexOf(t) === -1) return false;
      }
      return true;
    });
  }

  function versCsv(entrees) {
    function q(v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }
    var lignes = [["Date", "Heure", "Utilisateur", "Type", "Module", "Action", "Détail", "Page"].map(q).join(";")];
    entrees.forEach(function (x) {
      var d = new Date(x.horodatage);
      lignes.push([
        isNaN(d) ? x.horodatage : d.toLocaleDateString("fr-FR"),
        isNaN(d) ? "" : d.toLocaleTimeString("fr-FR"),
        x.nom || x.utilisateur, x.type, nomModule(x.module), x.action, x.detail, x.page
      ].map(q).join(";"));
    });
    /* Le BOM : sans lui, Excel lit les accents de travers. */
    return "﻿" + lignes.join("\r\n");
  }

  function nomModule(id) {
    for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i].nom;
    return id || "";
  }

  /* =====================================================================
     7. LES UTILISATEURS — création, modification, suppression, connexion
     ===================================================================== */

  function droitsVides() {
    var d = {};
    MODULES.forEach(function (m) {
      d[m.id] = {};
      ACTIONS.forEach(function (a) { d[m.id][a.id] = false; });
    });
    return d;
  }

  function droitsComplets() {
    var d = {};
    MODULES.forEach(function (m) {
      d[m.id] = {};
      ACTIONS.forEach(function (a) { d[m.id][a.id] = true; });
    });
    return d;
  }

  function normaliserDroits(source) {
    var d = droitsVides();
    if (source && typeof source === "object") {
      MODULES.forEach(function (m) {
        var s = source[m.id];
        if (!s) return;
        ACTIONS.forEach(function (a) { d[m.id][a.id] = s[a.id] === true; });
      });
    }
    return d;
  }

  function normaliserDroitsAdmin(source) {
    var d = {};
    ACTIONS_ADMIN.forEach(function (a) { d[a.id] = !!(source && source[a.id] === true); });
    return d;
  }

  /* creer({nom, fonction, code, photo, admin, droits, droitsAdmin}) */
  function creerUtilisateur(champs) {
    var nom = String(champs && champs.nom || "").trim();
    var code = String(champs && champs.code || "");
    if (!nom) return Promise.reject(new Error("Le nom est obligatoire."));
    if (code.length < 4) return Promise.reject(new Error("Le code d'accès doit compter au moins quatre caractères."));
    if (!modeOuvert() && !peutAdmin("creerUtilisateur"))
      return Promise.reject(new Error("Vous n'avez pas le droit de créer un utilisateur."));
    var photo = String(champs.photo || "");
    if (photo.length > PHOTO_OCTETS_MAX * 1.4)
      return Promise.reject(new Error("La photo est trop lourde."));

    var s = sel();
    var admin = !!champs.admin;
    var u = {
      id: identifiant("u"),
      schema: SCHEMA,
      nom: nom,
      fonction: String(champs.fonction || "").trim(),
      photo: photo,
      sel: s,
      condensat: condensat(s, code),
      admin: admin,
      droits: admin ? droitsComplets() : normaliserDroits(champs.droits),
      droitsAdmin: admin
        ? (function () { var d = {}; ACTIONS_ADMIN.forEach(function (a) { d[a.id] = true; }); return d; })()
        : normaliserDroitsAdmin(champs.droitsAdmin),
      cree: new Date().toISOString(),
      creePar: (utilisateurCourant() || {}).id || ""
    };
    return fournisseur.creerUtilisateur(u).then(function (r) {
      return hydrater().then(function () {
        return journaliser("administration", "equipe", "creerUtilisateur",
          "Utilisateur créé : " + nom + (admin ? " (administrateur)" : "")).then(function () { return r; });
      });
    });
  }

  function modifierUtilisateur(id, patch) {
    if (!peutAdmin("accorderDroits") && !peutAdmin("changerCode"))
      return Promise.reject(new Error("Vous n'avez pas le droit de modifier un utilisateur."));
    var p = {};
    if (typeof patch.nom === "string") p.nom = patch.nom.trim();
    if (typeof patch.fonction === "string") p.fonction = patch.fonction.trim();
    if (typeof patch.photo === "string") p.photo = patch.photo;
    if (typeof patch.admin === "boolean") p.admin = patch.admin;
    if (patch.droits) p.droits = normaliserDroits(patch.droits);
    if (patch.droitsAdmin) p.droitsAdmin = normaliserDroitsAdmin(patch.droitsAdmin);
    if (p.admin === true) { p.droits = droitsComplets(); p.droitsAdmin = normaliserDroitsAdmin(
      (function () { var d = {}; ACTIONS_ADMIN.forEach(function (a) { d[a.id] = true; }); return d; })()); }
    return fournisseur.modifierUtilisateur(id, p).then(function (r) {
      return hydrater().then(function () {
        return journaliser("administration", "equipe", "accorderDroits",
          "Droits modifiés : " + (r.nom || id)).then(function () { return r; });
      });
    });
  }

  function changerCode(id, nouveauCode) {
    if (!peutAdmin("changerCode"))
      return Promise.reject(new Error("Vous n'avez pas le droit de changer un code d'accès."));
    if (String(nouveauCode).length < 4)
      return Promise.reject(new Error("Le code d'accès doit compter au moins quatre caractères."));
    var s = sel();
    return fournisseur.modifierUtilisateur(id, { sel: s, condensat: condensat(s, nouveauCode) })
      .then(function (r) {
        return hydrater().then(function () {
          return journaliser("administration", "equipe", "changerCode",
            "Code d'accès changé : " + (r.nom || id)).then(function () { return r; });
        });
      });
  }

  function supprimerUtilisateur(id) {
    if (!peutAdmin("supprimerUtilisateur"))
      return Promise.reject(new Error("Vous n'avez pas le droit de supprimer un utilisateur."));
    var cible = parId(id);
    /* On ne supprime pas le dernier administrateur : l'équipe deviendrait
       ingérable, et personne ne pourrait plus rouvrir les droits. */
    if (cible && cible.admin) {
      var restants = etat.utilisateurs.filter(function (u) { return u.admin && u.id !== id; });
      if (restants.length === 0)
        return Promise.reject(new Error("C'est le dernier administrateur : supprimez-le en dernier, ou nommez d'abord un autre administrateur."));
    }
    var nom = cible ? cible.nom : id;
    return journaliser("administration", "equipe", "supprimerUtilisateur", "Utilisateur supprimé : " + nom)
      .then(function () { return fournisseur.supprimerUtilisateur(id); })
      .then(function () { return hydrater(); });
  }

  function connecter(id, code) {
    var u = parId(id);
    if (!u) return Promise.reject(new Error("Utilisateur inconnu."));
    if (condensat(u.sel, code) !== u.condensat)
      return Promise.reject(new Error("Code d'accès incorrect."));
    var session = { utilisateur: u.id, depuis: new Date().toISOString(), schema: SCHEMA };
    return fournisseur.ouvrirSession(session)
      .then(function () { return hydrater(); })
      .then(function () { return journaliser("connexion", "", "connexion", "Connexion de " + u.nom); })
      .then(function () { return utilisateurCourant(); });
  }

  function deconnecter() {
    var u = utilisateurCourant();
    return journaliser("deconnexion", "", "deconnexion", u ? "Déconnexion de " + u.nom : "Déconnexion")
      .then(function () { return fournisseur.fermerSession(); })
      .then(function () { return hydrater(); });
  }

  /* =====================================================================
     8. LA PHOTO — choisie sur le poste, redimensionnée, encodée
     ===================================================================== */

  function photoDepuisFichier(fichier) {
    return new Promise(function (resoudre, rejeter) {
      if (!fichier) return rejeter(new Error("Aucun fichier."));
      if (!/^image\//.test(fichier.type)) return rejeter(new Error("Ce fichier n'est pas une image."));
      if (fichier.size > 12 * 1024 * 1024) return rejeter(new Error("Image trop lourde (plus de 12 Mo)."));
      var lecteur = new FileReader();
      lecteur.onerror = function () { rejeter(new Error("Lecture impossible.")); };
      lecteur.onload = function () {
        var img = new Image();
        img.onerror = function () { rejeter(new Error("Image illisible.")); };
        img.onload = function () {
          try {
            /* Carré centré, puis réduction : une photo d'identité, pas une
               photographie de vacances de quatre mégaoctets. */
            var cote = Math.min(img.width, img.height);
            var sx = (img.width - cote) / 2, sy = (img.height - cote) / 2;
            var c = document.createElement("canvas");
            c.width = c.height = PHOTO_COTE;
            var ctx = c.getContext("2d");
            ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, PHOTO_COTE, PHOTO_COTE);
            ctx.drawImage(img, sx, sy, cote, cote, 0, 0, PHOTO_COTE, PHOTO_COTE);
            var q = 0.82, sortie = c.toDataURL("image/jpeg", q);
            while (sortie.length > PHOTO_OCTETS_MAX && q > 0.35) {
              q -= 0.12; sortie = c.toDataURL("image/jpeg", q);
            }
            if (sortie.length > PHOTO_OCTETS_MAX)
              return rejeter(new Error("La photo reste trop lourde après réduction."));
            resoudre(sortie);
          } catch (err) { rejeter(err); }
        };
        img.src = lecteur.result;
      };
      lecteur.readAsDataURL(fichier);
    });
  }

  /* =====================================================================
     9. L'APPLICATION DU DROIT DANS LA PAGE

     Aucune page ne teste un droit : c'est ici, et ici seulement, que le
     refus se traduit à l'écran. Trois applications générales :

       — CONSULTER  : la page entière est remplacée par un refus lisible ;
       — SAISIR     : les champs de la page passent en lecture seule ;
       — EXPORTER   : l'impression et les téléchargements sont interrompus.

     PRODUIRE se rattache pour l'instant aux deux précédentes — un document
     se saisit puis s'imprime — et à l'attribut `data-droit="produire"` que
     les pages pourront porter le jour où elles seront retouchées. Ce point
     est écrit tel quel dans DROITS.md : mieux vaut dire ce qui n'est pas
     encore intercepté que de le laisser croire.
     ===================================================================== */

  var CLE_VERROU = "droits-attente";

  function poserVerrou() {
    try {
      var st = document.createElement("style");
      st.id = "droits-verrou-style";
      st.textContent = "html." + CLE_VERROU + " body{visibility:hidden!important}";
      (document.head || document.documentElement).appendChild(st);
      document.documentElement.classList.add(CLE_VERROU);
      /* Filet de sécurité : quoi qu'il arrive, la page réapparaît. Une
         application qui reste blanche parce que son module de droits a
         échoué serait pire que pas de droits du tout. */
      setTimeout(leverVerrou, 4000);
    } catch (_) {}
  }
  function leverVerrou() {
    try { document.documentElement.classList.remove(CLE_VERROU); } catch (_) {}
  }

  function pageCourante() { return (location.pathname.split("/").pop() || "index.html"); }

  function moduleDeLaPage() {
    var p = pageCourante();
    if (p === "" || p === "/") p = "index.html";
    for (var i = 0; i < MODULES.length; i++)
      if (MODULES[i].page === p) return MODULES[i].id;
    return null;
  }

  var STYLE = [
    "#droits-ecran{position:fixed;inset:0;z-index:10000;background:#f6f7f9;color:#2b313a;",
    "font:16px/1.6 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;overflow:auto;padding:24px}",
    "#droits-ecran .dr-boite{max-width:760px;margin:min(9vh,70px) auto 40px;background:#fff;",
    "border:1px solid #dcdfe4;border-radius:14px;padding:28px 26px 26px}",
    "#droits-ecran .dr-fil{font:600 11.5px/1 system-ui;letter-spacing:.14em;text-transform:uppercase;color:#1F3864;margin:0 0 12px}",
    "#droits-ecran h1{font:600 clamp(22px,3.4vw,28px)/1.2 system-ui;color:#16181d;margin:0 0 10px}",
    "#droits-ecran p{margin:0 0 12px;color:#5f6874}",
    "#droits-ecran .dr-grille{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin:18px 0 6px}",
    "#droits-ecran .dr-carte{border:1px solid #dcdfe4;border-radius:12px;background:#fff;padding:14px 10px;",
    "text-align:center;cursor:pointer;font:inherit;color:#16181d;display:flex;flex-direction:column;align-items:center;gap:8px}",
    "#droits-ecran .dr-carte:hover{border-color:#1F3864;background:#f4f6fb}",
    "#droits-ecran .dr-carte[aria-pressed=true]{border-color:#1F3864;box-shadow:0 0 0 2px #1F386433}",
    "#droits-ecran .dr-photo{width:74px;height:74px;border-radius:50%;object-fit:cover;background:#e8ebf0;",
    "display:flex;align-items:center;justify-content:center;font:600 24px/1 system-ui;color:#5f6874}",
    "#droits-ecran .dr-nom{font:600 15px/1.3 system-ui}",
    "#droits-ecran .dr-fonction{font-size:12.5px;color:#5f6874}",
    "#droits-ecran .dr-code{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:14px 0 0}",
    "#droits-ecran input[type=password]{font:16px/1.4 system-ui;padding:10px 12px;border:1px solid #dcdfe4;",
    "border-radius:8px;min-width:200px;flex:1 1 200px}",
    "#droits-ecran button.dr-ok{font:600 15px/1 system-ui;padding:11px 18px;border-radius:99px;border:1px solid #1F3864;",
    "background:#1F3864;color:#fff;cursor:pointer}",
    "#droits-ecran button.dr-sec{font:600 14px/1 system-ui;padding:10px 16px;border-radius:99px;border:1px solid #dcdfe4;",
    "background:#fff;color:#2b313a;cursor:pointer}",
    "#droits-ecran .dr-erreur{color:#8E1B1B;font-size:14px;margin:10px 0 0;min-height:1.2em}",
    "#droits-ecran .dr-avert{background:#fbf7f1;border:1px solid #e5d9c4;border-radius:10px;padding:12px 14px;",
    "font-size:13.5px;color:#5f6874;margin:18px 0 0}",
    "#droits-ecran .dr-liens{margin-top:16px;font-size:13.5px}",
    "#droits-ecran .dr-liens a{color:#1F3864}",
    "#droits-badge{position:fixed;left:14px;bottom:14px;z-index:9985;display:flex;align-items:center;gap:9px;",
    "background:#fff;border:1px solid #dcdfe4;border-radius:99px;padding:5px 12px 5px 5px;",
    "box-shadow:0 2px 10px #16181d1a;font:13px/1.2 system-ui,-apple-system,sans-serif;color:#2b313a;max-width:min(76vw,320px)}",
    "#droits-badge .dr-mini{width:30px;height:30px;border-radius:50%;object-fit:cover;background:#e8ebf0;flex:0 0 auto;",
    "display:flex;align-items:center;justify-content:center;font:600 13px/1 system-ui;color:#5f6874}",
    "#droits-badge .dr-b-nom{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    "#droits-badge button{font:600 12px/1 system-ui;border:1px solid #dcdfe4;background:#f6f7f9;color:#2b313a;",
    "border-radius:99px;padding:6px 10px;cursor:pointer;flex:0 0 auto}",
    "#droits-badge button:hover{background:#eef1f6}",
    "#droits-bandeau{position:sticky;top:0;z-index:9984;background:#fbf7f1;border-bottom:1px solid #e5d9c4;",
    "color:#5f6874;font:13.5px/1.5 system-ui,-apple-system,sans-serif;padding:9px 16px;text-align:center}",
    "@media print{#droits-badge,#droits-bandeau,#droits-ecran{display:none!important}}"
  ].join("");

  function injecterStyle() {
    if (document.getElementById("droits-style")) return;
    var st = document.createElement("style");
    st.id = "droits-style";
    st.textContent = STYLE;
    (document.head || document.documentElement).appendChild(st);
  }

  function initiales(nom) {
    var m = String(nom || "?").trim().split(/\s+/);
    return ((m[0] || "?")[0] + (m.length > 1 ? m[m.length - 1][0] : "")).toUpperCase();
  }

  function vignette(u, classe) {
    if (u && u.photo)
      return '<img class="' + classe + '" src="' + e(u.photo) + '" alt="">';
    return '<span class="' + classe + '">' + e(initiales(u && u.nom)) + "</span>";
  }

  function retirerEcran() {
    var x = document.getElementById("droits-ecran");
    if (x && x.parentNode) x.parentNode.removeChild(x);
  }

  /* ------------------------------------------------ écran de connexion --- */
  function afficherConnexion() {
    injecterStyle();
    retirerEcran();
    var d = document.createElement("div");
    d.id = "droits-ecran";
    d.setAttribute("data-droits-ui", "1");

    var cartes = etat.utilisateurs.map(function (u) {
      return '<button type="button" class="dr-carte" data-id="' + e(u.id) + '" aria-pressed="false">' +
             vignette(u, "dr-photo") +
             '<span class="dr-nom">' + e(u.nom) + "</span>" +
             (u.fonction ? '<span class="dr-fonction">' + e(u.fonction) + "</span>" : "") +
             (u.admin ? '<span class="dr-fonction">administrateur</span>' : "") +
             "</button>";
    }).join("");

    d.innerHTML =
      '<div class="dr-boite">' +
        '<p class="dr-fil">Application Jurisprudence</p>' +
        "<h1>Qui travaille ?</h1>" +
        "<p>Choisissez votre nom, puis saisissez votre code d'accès. " +
        "Vos droits déterminent les modules qui s'ouvriront.</p>" +
        '<div class="dr-grille">' + cartes + "</div>" +
        '<div class="dr-code" hidden id="droits-zone-code">' +
          '<input type="password" id="droits-code" autocomplete="current-password" placeholder="Code d\'accès" aria-label="Code d\'accès">' +
          '<button type="button" class="dr-ok" id="droits-entrer">Entrer</button>' +
          '<button type="button" class="dr-sec" id="droits-annuler">Changer de nom</button>' +
        "</div>" +
        '<p class="dr-erreur" id="droits-erreur" role="alert"></p>' +
        '<div class="dr-avert"><b>Ce que ces droits font, et ne font pas.</b> Ils répartissent le travail ' +
        "dans l'équipe. Tant que l'application fonctionne sans serveur, ils ne protègent pas les données : " +
        "quiconque a accès à ce poste peut les contourner.</div>" +
        '<p class="dr-liens"><a href="guides.html">Guides d\'utilisation</a> · ' +
        '<a href="equipe.html">Administration de l\'équipe</a></p>' +
      "</div>";

    document.body.appendChild(d);
    leverVerrou();
    /* La page reste masquée derrière l'écran : c'est l'écran qui la couvre,
       pas le verrou. Le corps redevient visible pour que l'écran s'affiche. */
    document.documentElement.classList.remove(CLE_VERROU);
    masquerCorps(true);

    var choisi = null;
    var zone = d.querySelector("#droits-zone-code");
    var champ = d.querySelector("#droits-code");
    var err = d.querySelector("#droits-erreur");

    Array.prototype.forEach.call(d.querySelectorAll(".dr-carte"), function (b) {
      b.addEventListener("click", function () {
        choisi = b.getAttribute("data-id");
        Array.prototype.forEach.call(d.querySelectorAll(".dr-carte"), function (o) {
          o.setAttribute("aria-pressed", o === b ? "true" : "false");
        });
        zone.hidden = false;
        err.textContent = "";
        champ.value = "";
        champ.focus();
      });
    });

    function tenter() {
      if (!choisi) { err.textContent = "Choisissez d'abord votre nom."; return; }
      connecter(choisi, champ.value).then(function () {
        masquerCorps(false);
        retirerEcran();
        demarrerPage();
      }).catch(function (ex) {
        err.textContent = ex && ex.message ? ex.message : "Connexion impossible.";
        champ.select();
      });
    }

    d.querySelector("#droits-entrer").addEventListener("click", tenter);
    d.querySelector("#droits-annuler").addEventListener("click", function () {
      choisi = null; zone.hidden = true; err.textContent = "";
      Array.prototype.forEach.call(d.querySelectorAll(".dr-carte"), function (o) {
        o.setAttribute("aria-pressed", "false");
      });
    });
    champ.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { ev.preventDefault(); tenter(); }
    });
  }

  /* Le corps de la page est masqué derrière l'écran de connexion ou de refus,
     sans être détruit : revenir en arrière ne recharge rien.

     On ne remet pas `display:""` à l'aveugle en démasquant : une page peut
     avoir posé elle-même un `style="display:none"` sur un bloc, et l'effacer
     ferait apparaître ce qu'elle avait choisi de cacher. On note donc, pour
     chaque nœud masqué, la valeur qu'il portait, et on la lui rend.

     Masquer deux fois de suite était le piège : le second passage notait
     « none » comme valeur d'origine, et le démasquage rendait alors la page
     invisible pour de bon. Un corps déjà masqué ne se remasque pas. */
  var masques = [];
  function masquerCorps(oui) {
    if (oui) {
      if (masques.length) return;
      Array.prototype.forEach.call(document.body.children, function (n) {
        if (n.getAttribute && n.getAttribute("data-droits-ui")) return;
        if (n.id === "droits-style") return;
        if (!n.style) return;
        masques.push({ n: n, avant: n.style.display });
        try { n.style.display = "none"; } catch (_) {}
      });
    } else {
      masques.forEach(function (m) { try { m.n.style.display = m.avant; } catch (_) {} });
      masques = [];
    }
  }

  /* ------------------------------------------------------ écran de refus --- */
  function afficherRefus(moduleId) {
    injecterStyle();
    retirerEcran();
    var u = utilisateurCourant();
    var d = document.createElement("div");
    d.id = "droits-ecran";
    d.setAttribute("data-droits-ui", "1");
    d.innerHTML =
      '<div class="dr-boite">' +
        '<p class="dr-fil">Accès non ouvert</p>' +
        "<h1>Ce module ne vous est pas ouvert</h1>" +
        "<p><b>" + e(u ? u.nom : "") + "</b> n'a pas le droit de consulter « " +
        e(nomModule(moduleId)) + " ». Ce n'est pas une panne : la case correspondante " +
        "n'a pas été cochée par l'administrateur de l'équipe.</p>" +
        "<p>Demandez-lui d'ouvrir ce module, ou connectez-vous sous un autre nom.</p>" +
        '<div class="dr-code" style="margin-top:6px">' +
          '<button type="button" class="dr-ok" id="droits-changer">Changer d\'utilisateur</button>' +
          '<a class="dr-sec" href="index.html" style="text-decoration:none;display:inline-block">Retour à l\'accueil</a>' +
        "</div>" +
        '<div class="dr-avert">Les droits sont organisationnels : ils répartissent le travail. ' +
        "Tant que l'application fonctionne sans serveur, ils ne protègent pas les données de ce poste.</div>" +
      "</div>";
    document.body.appendChild(d);
    leverVerrou();
    document.documentElement.classList.remove(CLE_VERROU);
    masquerCorps(true);
    d.querySelector("#droits-changer").addEventListener("click", function () {
      deconnecter().then(function () { retirerEcran(); afficherConnexion(); });
    });
    Journal.refus(moduleId, "consulter", "Accès refusé à la page " + pageCourante());
  }

  /* --------------------------------------------------------- le bandeau --- */
  function afficherBandeau(texte) {
    if (document.getElementById("droits-bandeau")) return;
    var b = document.createElement("div");
    b.id = "droits-bandeau";
    b.setAttribute("data-droits-ui", "1");
    b.textContent = texte;
    document.body.insertBefore(b, document.body.firstChild);
  }

  /* ------------------------------------------------------------ badge --- */
  function afficherBadge() {
    var u = utilisateurCourant();
    var vieux = document.getElementById("droits-badge");
    if (vieux && vieux.parentNode) vieux.parentNode.removeChild(vieux);
    if (!u) return;
    injecterStyle();
    var b = document.createElement("div");
    b.id = "droits-badge";
    b.setAttribute("data-droits-ui", "1");
    b.innerHTML = vignette(u, "dr-mini") +
      '<span class="dr-b-nom" title="' + e(u.nom + (u.fonction ? " — " + u.fonction : "")) + '">' + e(u.nom) + "</span>" +
      '<button type="button" id="droits-btn-changer" title="Se déconnecter et choisir un autre utilisateur">Changer</button>';
    document.body.appendChild(b);
    b.querySelector("#droits-btn-changer").addEventListener("click", function () {
      deconnecter().then(function () { afficherBadge(); afficherConnexion(); });
    });
  }

  /* ----------------------------------------- lecture seule et impression --- */
  var gelActif = false;

  function gelerSaisie() {
    if (!document.body) return;
    var champs = document.body.querySelectorAll("input,select,textarea,button");
    Array.prototype.forEach.call(champs, function (n) {
      if (n.closest && (n.closest("[data-droits-ui]") || n.closest("#assist-panneau") || n.id === "assist-bouton")) return;
      if (n.getAttribute("data-droits-gel")) return;
      n.setAttribute("data-droits-gel", "1");
      if (n.tagName === "INPUT" || n.tagName === "TEXTAREA") {
        if (/^(button|submit|reset|checkbox|radio|file)$/i.test(n.type || "")) n.disabled = true;
        else n.readOnly = true;
      } else {
        n.disabled = true;
      }
    });
  }

  function surveillerGel() {
    if (!window.MutationObserver) return;
    var attente = null;
    var obs = new MutationObserver(function () {
      if (attente) return;
      attente = setTimeout(function () { attente = null; if (gelActif) gelerSaisie(); }, 250);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function interdireExport(moduleId) {
    /* L'impression. `window.print` est remplacé, et le raccourci clavier
       intercepté : les deux chemins mènent au même refus. */
    var vraiPrint = window.print;
    window.print = function () {
      if (peut(moduleId, "exporter")) { Journal.acte(moduleId, "exporter", "Impression"); return vraiPrint.call(window); }
      Journal.refus(moduleId, "exporter", "Impression refusée");
      alerteRefus("imprimer");
    };
    document.addEventListener("keydown", function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && (ev.key === "p" || ev.key === "P")) {
        if (!peut(moduleId, "exporter")) {
          ev.preventDefault();
          Journal.refus(moduleId, "exporter", "Impression refusée (raccourci)");
          alerteRefus("imprimer");
        }
      }
    }, true);

    /* Les téléchargements. Toute ancre porteuse de `download` passe par ici. */
    document.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a[download]") : null;
      if (!a) return;
      if (a.closest("[data-droits-ui]")) return;
      if (peut(moduleId, "exporter")) { Journal.acte(moduleId, "exporter", "Fichier enregistré : " + (a.getAttribute("download") || "")); return; }
      ev.preventDefault(); ev.stopPropagation();
      Journal.refus(moduleId, "exporter", "Téléchargement refusé");
      alerteRefus("exporter un fichier");
    }, true);

    /* Le geste que les pages pourront déclarer le jour où elles seront
       retouchées : `data-droit="produire"` sur le bouton qui engendre. */
    document.addEventListener("click", function (ev) {
      var n = ev.target && ev.target.closest ? ev.target.closest("[data-droit]") : null;
      if (!n) return;
      var action = n.getAttribute("data-droit");
      var mod = n.getAttribute("data-droit-module") || moduleId;
      if (peut(mod, action)) { Journal.acte(mod, action, n.getAttribute("data-droit-detail") || ""); return; }
      ev.preventDefault(); ev.stopPropagation();
      Journal.refus(mod, action, "Geste refusé");
      alerteRefus(action === "produire" ? "produire ce document" : action);
    }, true);
  }

  function alerteRefus(quoi) {
    var u = utilisateurCourant();
    try {
      alert("Vous n'avez pas le droit de " + quoi + " depuis ce module." +
        (u ? "\n\nConnecté : " + u.nom : "") +
        "\n\nDemandez à l'administrateur de l'équipe d'ouvrir ce droit (page « Équipe »).");
    } catch (_) {}
  }

  /* ------------------------------------------------- journal automatique --- */
  /* Les pages n'ont pas été retouchées : c'est l'écriture dans le stockage
     local qui trahit l'acte. On enveloppe `localStorage.setItem` une seule
     fois, on regarde la clé, et on en tire l'entrée de journal. Deux
     écritures de la même clé à moins de quinze secondes ne comptent que pour
     une : sinon un questionnaire rempli produirait deux cents lignes. */
  var derniere = {};
  function observerEcritures() {
    if (window.__droitsObserve) return;
    window.__droitsObserve = true;
    var proto = Object.getPrototypeOf(localStorage) || Storage.prototype;
    var vrai = proto.setItem;
    try {
      proto.setItem = function (cle, valeur) {
        var r = vrai.apply(this, arguments);
        try {
          var m = CLES_SURVEILLEES[cle];
          if (m && !modeOuvert() && utilisateurCourant()) {
            var t = Date.now();
            if (!derniere[cle] || t - derniere[cle] > 15000) {
              derniere[cle] = t;
              journaliser("acte", m.module, m.action, m.detail);
            }
          }
        } catch (_) {}
        return r;
      };
    } catch (_) {}
  }

  /* =====================================================================
     10. DÉMARRAGE
     ===================================================================== */

  var pageDemarree = false;

  function demarrerPage() {
    if (!document.body) return;
    injecterStyle();
    observerEcritures();

    if (modeOuvert()) {
      /* Aucun utilisateur : l'application est exactement ce qu'elle était.
         Ni écran, ni badge, ni journal. */
      masquerCorps(false);
      leverVerrou();
      return;
    }

    var u = utilisateurCourant();
    if (!u) { afficherConnexion(); return; }

    masquerCorps(false);
    leverVerrou();

    var moduleId = moduleDeLaPage();
    var libre = PAGES_LIBRES[pageCourante()] === true;

    if (moduleId && !libre && !peut(moduleId, "consulter")) { afficherRefus(moduleId); return; }

    afficherBadge();

    if (moduleId && !libre) {
      if (!pageDemarree) {
        Journal.acte(moduleId, "consulter", "Ouverture de " + nomModule(moduleId));
        interdireExport(moduleId);
      }
      if (!peut(moduleId, "saisir")) {
        gelActif = true;
        gelerSaisie();
        surveillerGel();
        afficherBandeau("Lecture seule — " + u.nom + " peut consulter ce module, non le modifier. " +
          "L'administrateur de l'équipe peut ouvrir ce droit.");
      }
    }
    pageDemarree = true;
  }

  /* Le verrou est posé dès la lecture du script, avant que le corps existe :
     l'utilisateur ne doit pas voir une demi-seconde de contenu avant l'écran
     de connexion. Il est levé au démarrage, quoi qu'il arrive. */
  poserVerrou();

  var pretPromesse = hydrater();

  function amorcer() {
    pretPromesse.then(demarrerPage).catch(function () { leverVerrou(); });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", amorcer);
  else
    amorcer();

  /* =====================================================================
     11. L'INTERFACE PUBLIQUE
     ===================================================================== */

  window.Droits = {
    /* le point unique */
    peut: peut,
    peutAdmin: peutAdmin,

    /* état */
    utilisateur: utilisateurCourant,
    modeOuvert: modeOuvert,
    pret: function () { return pretPromesse; },
    quandPret: quandPret,
    rafraichir: hydrater,
    surChangement: function (fn) { abonnes.push(fn); return function () {
      abonnes = abonnes.filter(function (x) { return x !== fn; }); }; },

    /* administration */
    listerUtilisateurs: function () { return fournisseur.listerUtilisateurs(); },
    creer: creerUtilisateur,
    modifier: modifierUtilisateur,
    changerCode: changerCode,
    supprimer: supprimerUtilisateur,
    connecter: connecter,
    deconnecter: deconnecter,
    photo: photoDepuisFichier,

    /* écrans */
    ecranConnexion: afficherConnexion,

    /* vocabulaire */
    MODULES: MODULES,
    ACTIONS: ACTIONS,
    ACTIONS_ADMIN: ACTIONS_ADMIN,
    SCHEMA: SCHEMA,
    droitsVides: droitsVides,
    droitsComplets: droitsComplets,
    nomModule: nomModule,

    /* le fournisseur — le jour de la bascule, une seule ligne change */
    fournisseur: function () { return fournisseur; },
    brancher: function (f) {
      fournisseur = f;
      pretPromesse = hydrater();
      return pretPromesse;
    },
    FournisseurLocal: FournisseurLocal,

    /* utilitaire exposé pour les essais */
    condensat: condensat
  };

  window.Journal = Journal;

})();
