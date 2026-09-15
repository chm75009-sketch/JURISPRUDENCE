/* LA BASE DES DOCUMENTS, UNE PAR RUBRIQUE.

   POURQUOI CE FICHIER EXISTE

   Demande du 15 septembre 2026 : « tu dois créer une base de données dans
   chaque rubrique où tu stockes les documents pour au fur et à mesure les
   mettre à jour ». Jusqu'ici, un document déposé était lu puis oublié, et un
   document produit partait dans les téléchargements sans laisser de trace :
   la fois suivante, l'écran repartait de rien et l'utilisateur redéposait le
   même fichier.

   CE QU'ELLE GARDE

   Par rubrique (registre, document unique, règlement intérieur, base de
   données, et ainsi de suite), les fichiers déposés et les documents produits,
   avec leur nom, leur type, leur taille, la date et le contenu lui-même. Le
   dernier en date de chaque sorte se retrouve d'un appel.

   OÙ

   Dans IndexedDB, sur le poste, comme tout le reste de l'application : rien
   n'est envoyé. IndexedDB et non localStorage, parce qu'un PDF de quelques
   centaines de kilo-octets sature vite les cinq mégaoctets d'un localStorage,
   et qu'un registre de cinq pages en fait déjà 370.

   L'API

     Documents.enregistrer(rubrique, { nom, sorte, type, contenu })
     Documents.liste(rubrique)            -> [{ id, nom, sorte, type, taille, date }]
     Documents.lire(id)                   -> { ..., contenu }
     Documents.dernier(rubrique, sorte)   -> le plus récent, contenu compris
     Documents.supprimer(id)
     Documents.vider(rubrique)

   « sorte » vaut « depose » ou « produit » : ce que le client a remis, ou ce
   que l'application a écrit. Les deux ne se confondent jamais.               */

(function (window) {
  "use strict";

  var NOM = "jurisprudence-documents";
  var MAGASIN = "documents";
  var VERSION = 1;
  var base = null;

  function ouvrir() {
    if (base) return Promise.resolve(base);
    return new Promise(function (ok, non) {
      if (!window.indexedDB) { non(new Error("Ce navigateur ne garde pas les documents.")); return; }
      var d = window.indexedDB.open(NOM, VERSION);
      d.onupgradeneeded = function () {
        var b = d.result;
        if (!b.objectStoreNames.contains(MAGASIN)) {
          var m = b.createObjectStore(MAGASIN, { keyPath: "id", autoIncrement: true });
          m.createIndex("rubrique", "rubrique", { unique: false });
          m.createIndex("rubrique_sorte", ["rubrique", "sorte"], { unique: false });
        }
      };
      d.onsuccess = function () { base = d.result; ok(base); };
      d.onerror = function () { non(d.error || new Error("Base des documents indisponible.")); };
    });
  }

  function transaction(mode) {
    return ouvrir().then(function (b) {
      return b.transaction(MAGASIN, mode).objectStore(MAGASIN);
    });
  }
  function promesse(req) {
    return new Promise(function (ok, non) {
      req.onsuccess = function () { ok(req.result); };
      req.onerror = function () { non(req.error); };
    });
  }

  /* Le contenu est gardé tel quel : une chaîne pour un texte, un Blob pour un
     fichier. Rien n'est converti, donc rien n'est abîmé. */
  function enregistrer(rubrique, doc) {
    var d = doc || {};
    var contenu = d.contenu;
    var taille = 0;
    if (contenu && typeof contenu.size === "number") taille = contenu.size;
    else if (typeof contenu === "string") taille = contenu.length;
    var ligne = {
      rubrique: String(rubrique || "sans-rubrique"),
      sorte: d.sorte === "produit" ? "produit" : "depose",
      nom: String(d.nom || "document"),
      type: String(d.type || ""),
      taille: taille,
      date: new Date().toISOString(),
      note: String(d.note || ""),
      contenu: contenu,
    };
    return transaction("readwrite").then(function (m) {
      return promesse(m.add(ligne));
    }).then(function (id) { ligne.id = id; return ligne; });
  }

  function sansContenu(l) {
    return { id: l.id, rubrique: l.rubrique, sorte: l.sorte, nom: l.nom,
      type: l.type, taille: l.taille, date: l.date, note: l.note };
  }

  function liste(rubrique) {
    return transaction("readonly").then(function (m) {
      return promesse(m.index("rubrique").getAll(String(rubrique)));
    }).then(function (r) {
      return (r || []).map(sansContenu).sort(function (a, b) {
        return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0);
      });
    });
  }

  function lire(id) {
    return transaction("readonly").then(function (m) { return promesse(m.get(Number(id))); });
  }

  function dernier(rubrique, sorte) {
    return transaction("readonly").then(function (m) {
      return promesse(m.index("rubrique").getAll(String(rubrique)));
    }).then(function (r) {
      var L = (r || []).filter(function (x) { return !sorte || x.sorte === sorte; });
      L.sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });
      return L[0] || null;
    });
  }

  function supprimer(id) {
    return transaction("readwrite").then(function (m) { return promesse(m.delete(Number(id))); });
  }

  function vider(rubrique) {
    return transaction("readwrite").then(function (m) {
      return promesse(m.index("rubrique").getAllKeys(String(rubrique))).then(function (cles) {
        return Promise.all((cles || []).map(function (k) { return promesse(m.delete(k)); }));
      });
    });
  }

  /* De quoi écrire une ligne lisible : « registre-tec.pdf, déposé le 15
     septembre 2026, 363 Ko ». */
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];
  function enFrancais(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso || "");
    return (d.getDate() === 1 ? "1er" : d.getDate()) + " " + MOIS[d.getMonth()] + " " +
      d.getFullYear() + " à " + ("0" + d.getHours()).slice(-2) + " h " + ("0" + d.getMinutes()).slice(-2);
  }
  function poids(n) {
    if (!n) return "";
    if (n < 1024) return n + " o";
    if (n < 1024 * 1024) return Math.round(n / 1024) + " Ko";
    return (n / (1024 * 1024)).toFixed(1).replace(".", ",") + " Mo";
  }

  /* L'ACCROCHAGE AUTOMATIQUE.

     Un écran n'a rien à écrire pour garder ses documents : tout fichier
     déposé dans un champ de dépôt de la page, et tout document que
     l'application fait télécharger, entrent dans la base sous la rubrique de
     la page. Les écrans qui veulent nommer eux-mêmes leur rubrique posent
     window.RUBRIQUE_DOCS avant de charger ce fichier. */
  function rubriqueDeLaPage() {
    if (window.RUBRIQUE_DOCS) return String(window.RUBRIQUE_DOCS);
    var f = String(location.pathname || "").split("/").pop() || "accueil";
    return f.replace(/\.html?$/i, "").replace(/^$/, "accueil");
  }

  function accrocher() {
    if (!window.indexedDB) return;
    var r = rubriqueDeLaPage();

    /* Les dépôts. En capture, pour passer avant le gestionnaire de l'écran. */
    document.addEventListener("change", function (ev) {
      var el = ev.target;
      if (!el || el.tagName !== "INPUT" || el.type !== "file") return;
      var f = el.files && el.files[0];
      if (!f) return;
      enregistrer(r, { nom: f.name, sorte: "depose", type: f.type || "", contenu: f })
        .catch(function () {});
    }, true);

    /* Les productions, par le seul chemin qu'elles prennent toutes. */
    var poser = function () {
      if (!window.AuditExport || !window.AuditExport.telecharger ||
          window.AuditExport.telecharger.__garde) return false;
      var vrai = window.AuditExport.telecharger;
      var enrobe = function (octets, nom, type) {
        try {
          var blob = (octets && typeof octets.size === "number")
            ? octets : new Blob([octets], { type: type || "application/octet-stream" });
          enregistrer(r, { nom: nom, sorte: "produit", type: type || "", contenu: blob })
            .catch(function () {});
        } catch (e) { /* garder un document ne doit jamais empêcher de le télécharger */ }
        return vrai.apply(this, arguments);
      };
      enrobe.__garde = true;
      window.AuditExport.telecharger = enrobe;
      return true;
    };
    if (!poser()) {
      var essais = 0;
      var t = setInterval(function () {
        if (poser() || ++essais > 40) clearInterval(t);
      }, 250);
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", accrocher);
  else accrocher();

  window.Documents = {
    enregistrer: enregistrer, liste: liste, lire: lire, dernier: dernier,
    supprimer: supprimer, vider: vider, enFrancais: enFrancais, poids: poids,
    disponible: function () { return !!window.indexedDB; },
    rubriqueDeLaPage: rubriqueDeLaPage,
  };
})(window);
