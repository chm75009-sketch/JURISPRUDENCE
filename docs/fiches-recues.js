/* LES FICHES REÇUES DES SALARIÉS (25 novembre 2026).

   Demande : un lien mis dans les groupes WhatsApp, le salarié remplit sa
   fiche sur son téléphone (photos et signature comprises), et T.E.C la reçoit
   ici, en tête de l'onglet « Conducteurs ». Un bouton la reporte dans la fiche
   du chauffeur.

   Ce module ne s'allume que sur le site de T.E.C, là où le dossier partagé
   existe (clé « synchro-cle ») et où le serveur sait recevoir les fiches
   (/fiches/...). Ailleurs, il ne fait rien.

   LE CHIFFREMENT. À l'activation, l'application crée une paire de clés
   (ECDH P-256). La clé publique part sur le serveur, avec l'empreinte du code
   donné aux salariés. La clé privée reste dans le dossier (« fiches-cle-
   privee ») : le partage la porte, chiffrée, chez T.E.C et chez le cabinet,
   et nulle part ailleurs. Le téléphone du salarié chiffre la fiche avec la clé
   publique ; seule la clé privée la rouvre.                                   */
(function () {
  "use strict";

  var ls = window.localStorage, S = window.crypto && window.crypto.subtle;
  if (!ls || !S || !window.fetch) return;
  /* Sur les pages sans cadre (accueil, salariés, documents), le module
     travaille sans rien afficher : il range les fiches arrivées. */
  var hote = document.getElementById("fiches-recues");
  /* LE CHEF DE PARC SANS ACCÈS AUX CONDUCTEURS (27 novembre 2026) : les fiches
     reçues portent l'identité, le numéro de sécurité sociale et les papiers
     des chauffeurs. Elles ne s'écrivent pas dans sa page, même dans l'onglet
     masqué ; le module continue seulement de les ranger. */
  try {
    var role = (window.sessionStorage && window.sessionStorage.getItem("seance-role")) || ls.getItem("seance-role");
    if (role === "parc" && ls.getItem("parc-conducteurs-visibles") !== "oui") hote = null;
  } catch (e) {}
  var brut64 = ls.getItem("synchro-cle");
  if (!brut64) return;

  var CLE_PRIV = "fiches-cle-privee", CLE_CODE = "fiches-code", CLE_FAITES = "fiches-reportees",
    CLE_RANGEES = "fiches-rangees", CLE_VERROU = "fiches-verrou";
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  function ech(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lire(k, d) { try { var v = JSON.parse(ls.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function garder(k, v) { try { ls.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function enFrancais(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
    if (!m) return "";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function hex(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (x) { return ("0" + x.toString(16)).slice(-2); }).join(""); }
  function deB64(s) { var b = window.atob(s), t = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) t[i] = b.charCodeAt(i); return t; }
  function sansAccent(s) {
    return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* Le jeton du dossier, calculé comme le partage le calcule. */
  var JETON = null;
  function jeton() {
    if (JETON) return Promise.resolve(JETON);
    var brut = deB64(brut64), et = new TextEncoder().encode("synchro-tec|");
    var t = new Uint8Array(et.length + brut.length); t.set(et); t.set(brut, et.length);
    return S.digest("SHA-256", t).then(function (h) { JETON = hex(h); return JETON; });
  }
  function appel(methode, chemin, corps) {
    return jeton().then(function (j) {
      var o = { method: methode, headers: { "x-synchro-jeton": j }, cache: "no-store" };
      if (corps) { o.body = JSON.stringify(corps); o.headers["content-type"] = "application/json"; }
      return fetch("/fiches/" + chemin, o);
    });
  }

  /* ─── la clé privée, et le déchiffrement ─── */
  var PRIV = null;
  function clePrivee() {
    if (PRIV) return Promise.resolve(PRIV);
    var j = lire(CLE_PRIV, null);
    if (!j) return Promise.resolve(null);
    return S.importKey("jwk", j, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveKey"])
      .then(function (k) { PRIV = k; return k; });
  }
  function ouvrir(octets) {
    var t = new Uint8Array(octets);
    return clePrivee().then(function (priv) {
      return S.importKey("raw", t.slice(0, 65), { name: "ECDH", namedCurve: "P-256" }, false, [])
        .then(function (pub) {
          return S.deriveKey({ name: "ECDH", public: pub }, priv, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        }).then(function (cle) {
          return S.decrypt({ name: "AES-GCM", iv: t.slice(65, 77) }, cle, t.slice(77));
        }).then(function (b) { return JSON.parse(new TextDecoder().decode(b)); });
    });
  }

  /* ─── l'activation du lien ─── */
  function codeAuHasard() {
    var A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", r = window.crypto.getRandomValues(new Uint8Array(8)), c = "";
    for (var i = 0; i < 8; i++) c += A.charAt(r[i] % A.length);
    return c;
  }
  function activer() {
    var code = codeAuHasard(), paire;
    return S.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey"]).then(function (p) {
      paire = p;
      return Promise.all([S.exportKey("jwk", p.privateKey), S.exportKey("jwk", p.publicKey),
        S.digest("SHA-256", new TextEncoder().encode(code))]);
    }).then(function (r) {
      return appel("PUT", "cle", { pub: r[1], code: hex(r[2]) }).then(function (rep) {
        if (!rep.ok) throw new Error("serveur");
        garder(CLE_PRIV, r[0]); ls.setItem(CLE_CODE, code); PRIV = null;
      });
    });
  }
  function lien() {
    var c = ls.getItem(CLE_CODE) || "";
    return location.origin + "/fiche-chauffeur.html#c=" + c;
  }

  /* ─── QUI A REMPLI, QUI NE L'A PAS FAIT (26 novembre 2026) ───

     Demande : savoir qui relancer. On part du registre du personnel, salariés
     présents. Un salarié a rempli quand sa fiche porte une fiche reçue, ou
     quand une fiche à son nom attend d'être rangée. Seuls ceux qui n'ont pas
     rempli sont listés, avec un bouton pour copier leurs noms. */
  function presents() {
    var reg = lire("registre-personnel", {}) || {};
    return (reg.salaries || []).filter(function (s) {
      return !String(s.sor || "").trim() && (String(s.nom || "").trim() || String(s.pre || "").trim());
    }).map(function (s) {
      var nom = (String(s.nom || "").trim() + " " + String(s.pre || "").trim()).trim();
      return { sid: sansAccent(nom) || "salarie", nom: nom, emp: String(s.emp || "").trim() };
    }).sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
  }
  /* L'ÉTAT DE CHAQUE SALARIÉ, EN TROIS COULEURS (26 novembre 2026).
     Rouge : pas de fiche. Orange : une fiche nouvelle ou mise à jour, pas
     encore validée. Vert : validée par T.E.C ou le cabinet. Une fiche qui
     attend d'être rangée compte comme orange. */
  function etats() {
    var T = lire("flotte-conducteurs", {}), attendus = {};
    Object.keys(ETAT.resumes).forEach(function (id) {
      var r = ETAT.resumes[id], s = salarieDe(r, id);
      if (s) attendus[sansAccent(((s.nom || "") + " " + (s.pre || "")).trim())] = 1;
    });
    return presents().map(function (p) {
      var f = T[p.sid] || {}, e = "rouge";
      if (f.recue) e = (f.validee && f.validee.id === f.recue.id) ? "vert" : "orange";
      if (attendus[p.sid]) e = "orange";
      p.etat = e; p.f = f; return p;
    });
  }
  function nonRemplis() { return etats().filter(function (p) { return p.etat === "rouge"; }); }
  function suivi() {
    var E = etats();
    if (!E.length) return "";
    var G = { orange: [], rouge: [], vert: [] };
    E.forEach(function (p) { G[p.etat].push(p); });
    function ligne(p) {
      var f = p.f, sous = p.emp;
      if (p.etat === "orange") sous = (f.maj && f.recue && f.maj.id === f.recue.id ? "mise à jour" : "nouvelle") +
        (f.recue ? " du " + enFrancais(f.recue.le) : ", en cours de rangement") + ", à vérifier";
      if (p.etat === "vert") sous = "validée le " + enFrancais(f.validee.le) + (f.validee.par ? " par " + f.validee.par : "");
      var lienF = p.etat === "rouge" ? "<b>" + ech(p.nom) + "</b>"
        : '<a href="salaries.html?s=' + encodeURIComponent(p.sid) + '&v=fiche"><b>' + ech(p.nom) + "</b></a>";
      return '<li class="fr-' + p.etat + '"><i class="fr-pt"></i><span class="fr-qui">' + lienF +
        (sous ? "<span>" + ech(sous) + "</span>" : "") + "</span>" +
        (p.etat !== "rouge" && f.recue ? '<button type="button" class="fr-x" data-fr="retirer" data-id="' + ech(f.recue.id) +
          '" data-sid="' + ech(p.sid) + '">Supprimer</button>' : "") + "</li>";
    }
    function groupe(cle, titre, ouvert) {
      if (!G[cle].length) return "";
      var o = ETAT["g-" + cle];
      return '<details class="fr-g fr-g-' + cle + '" data-g="' + cle + '"' + ((o === undefined ? ouvert : o) ? " open" : "") + ">" +
        '<summary><i class="fr-pt"></i>' + titre + " (" + G[cle].length + ")</summary>" +
        '<ul class="fr-liste">' + G[cle].map(ligne).join("") + "</ul>" +
        (cle === "rouge" ? '<button type="button" class="fr-b second" data-fr="copier-nr">Copier la liste pour relancer</button>' : "") +
        "</details>";
    }
    return '<p class="fr-st">Suivi des réponses</p>' +
      '<p class="fr-leg"><span class="fr-rouge"><i class="fr-pt"></i>pas encore remplie</span>' +
      '<span class="fr-orange"><i class="fr-pt"></i>nouvelle ou mise à jour, à vérifier</span>' +
      '<span class="fr-vert"><i class="fr-pt"></i>validée</span></p>' +
      '<p class="fr-compte"><b>' + (G.orange.length + G.vert.length) + " sur " + E.length + "</b> salarié" +
      (E.length > 1 ? "s ont" : " a") + " rempli leur fiche.</p>" +
      groupe("orange", "À vérifier", true) + groupe("rouge", "Pas encore remplie", false) + groupe("vert", "Validées", false);
  }

  /* Supprimer une fiche rangée. Si elle mettait à jour une fiche précédente,
     les valeurs d'avant reviennent et les photos remplacées reprennent leur
     nom ; sinon, ses réponses sortent de la fiche et ses pièces des
     documents. Pour une fiche d'essai, ou envoyée par erreur. */
  function renommer(d, nom) {
    return window.Documents.lire(d.id).then(function (x) {
      if (!x) return null;
      return window.Documents.enregistrer(x.rubrique, { nom: nom, sorte: x.sorte, type: x.type, contenu: x.contenu })
        .then(function () { return window.Documents.supprimer(d.id); });
    });
  }
  function retirer(id, sidDonne) {
    var R = lire(CLE_RANGEES, []), x = null;
    R.forEach(function (e) { if (e.id === id) x = e; });
    var sid = (x && x.sid) || sidDonne;
    if (!sid) return Promise.resolve();
    var T = lire("flotte-conducteurs", {}), f = T[sid] || {};
    var le = (f.recue && f.recue.id === id && f.recue.le) || (x && x.fait) || "";
    var maj = f.maj && f.maj.id === id ? f.maj : null;
    if (f.recue && f.recue.id === id) {
      if (maj) {
        (maj.changes || []).forEach(function (ch) { f[ch.k] = ch.avant; });
        (maj.ajouts || []).forEach(function (k) { delete f[k]; });
        f.recue = maj.precedente || null; if (!f.recue) delete f.recue;
        if (maj.valideeAvant) f.validee = maj.valideeAvant; else delete f.validee;
        delete f.maj;
      } else {
        CHAMPS_FICHE.forEach(function (k) { delete f[k]; });
        delete f.recue; delete f.validee; delete f.maj;
      }
      T[sid] = f; garder("flotte-conducteurs", T);
    }
    garder(CLE_RANGEES, R.filter(function (e) { return e.id !== id; }));
    var faites = lire(CLE_FAITES, {}); delete faites[id]; garder(CLE_FAITES, faites);
    appel("DELETE", "depot/" + id).catch(function () {});
    if (!window.Documents || !le) return Promise.resolve();
    var marque = "(" + enFrancais(le) + ")", rempl = " (remplacée le " + enFrancais(le) + ")";
    return window.Documents.liste("salarie-" + sid).then(function (L) {
      /* D'abord retirer les pièces de cette fiche, puis rendre leur nom aux
         anciennes : un document produit du même nom serait sinon confondu. */
      var P = L.filter(function (d) { var n = String(d.nom || ""); return n.indexOf(marque) >= 0 && n.indexOf("remplacée") < 0; })
        .map(function (d) { return window.Documents.supprimer(d.id); });
      return Promise.all(P).then(function () {
        if (!maj) return null;
        return L.filter(function (d) { return String(d.nom || "").indexOf(rempl) >= 0; }).reduce(function (pr, d) {
          return pr.then(function () { return renommer(d, String(d.nom).replace(rempl, "")); });
        }, Promise.resolve());
      });
    });
  }

  /* ─── l'affichage ─── */
  var ETAT = { liste: [], resumes: {}, ouvertes: {}, fiches: {}, msg: "" };

  function rendre() {
    if (!hote) return;
    var faites = lire(CLE_FAITES, {});
    var h = '<div class="fr-bloc"><div class="fr-tete"><span class="fr-t">Fiches reçues des salariés</span></div>';
    if (!lire(CLE_PRIV, null)) {
      h += '<p class="fr-doux">Un lien à mettre dans vos groupes WhatsApp : chaque salarié remplit sa fiche sur son téléphone, ' +
        "photos de ses papiers et signature comprises, et elle arrive ici.</p>" +
        '<button type="button" class="fr-b" data-fr="activer">Créer le lien pour les salariés</button>';
    } else {
      h += '<div class="fr-lien"><span class="fr-l">Lien à envoyer dans les groupes WhatsApp</span>' +
        '<input type="text" readonly value="' + ech(lien()) + '">' +
        '<div class="fr-2"><button type="button" class="fr-b" data-fr="copier">Copier le lien</button>' +
        (navigator.share ? '<button type="button" class="fr-b second" data-fr="partager">Partager</button>' : "") + "</div></div>";
      h += '<button type="button" class="fr-b second fr-act" data-fr="actualiser">Actualiser</button>' +
        '<p class="fr-auto">Vérifié automatiquement toutes les 30 secondes' + (ETAT.vu ? ", dernière fois à " + ETAT.vu : "") + ".</p>";
      if (ETAT.msg) h += '<p class="fr-msg">' + ech(ETAT.msg) + "</p>";
      h += suivi();
      var attente = ETAT.liste;
      if (!attente.length) {
        h += "";
      } else {
        h += '<p class="fr-st">Reçues, pas encore rangées</p>' + attente.map(function (it) {
          var r = ETAT.resumes[it.id] || {};
          var nom = r.nom ? (r.nom + " " + (r.prenom || "")) : "Fiche reçue";
          var sous = [r.profil === "pl" ? "poids lourd" : (r.profil === "leger" ? "pas poids lourd" : ""),
            "reçue le " + enFrancais(it.quand), faites[it.id] ? "déjà reportée" : (r.nom && !salarieDe(r, it.id) ? "à rattacher à un salarié du registre" : "en cours de rangement")].filter(Boolean).join(" · ");
          return '<div class="fr-it' + (faites[it.id] ? " fait" : "") + '">' +
            '<button type="button" class="fr-ligne" data-fr="voir" data-id="' + ech(it.id) + '">' +
            '<span class="fr-n">' + ech(nom) + '<small>' + ech(sous) + "</small></span><span class=\"fr-fl\">" +
            (ETAT.ouvertes[it.id] ? "&#8963;" : "&#8964;") + "</span></button>" +
            (ETAT.ouvertes[it.id] ? detail(it.id) : "") + "</div>";
        }).join("");
      }
    }
    hote.innerHTML = h + "</div>";
    Array.prototype.forEach.call(hote.querySelectorAll("details[data-g]"), function (d) {
      d.addEventListener("toggle", function () { ETAT["g-" + d.getAttribute("data-g")] = d.open; });
    });
  }

  /* Les réponses ajoutées au questionnaire le 27 novembre 2026 : l'identité
     du registre et de l'embauche, le titre de séjour, le permis étranger, les
     points, le retrait, la formation et la carte conducteur. */
  var LIB = [
    ["nom", "Nom"], ["prenom", "Prénoms"], ["sexe", "Sexe"], ["nais", "Date de naissance"], ["naisLieu", "Lieu de naissance"],
    ["nat", "Nationalité"], ["adresse", "Adresse"], ["tel", "Téléphone"], ["courriel", "Adresse e-mail"],
    ["nir", "Numéro de sécurité sociale"], ["sansNir", "Pas encore de numéro de sécurité sociale"],
    ["roulant", "Personnel roulant"], ["profil", "Profil"], ["ue", "Ressortissant UE, EEE ou Suisse"],
    ["titreType", "Titre de séjour ou de travail"], ["titreNum", "Numéro du titre"], ["titreFin", "Titre valable jusqu'au"],
    ["inter", "International ou cabotage"],
    ["permisNum", "Numéro du permis"], ["permisCat", "Catégories"], ["permisFin", "Permis valable jusqu'au"],
    ["permisOrigine", "Permis délivré"], ["permisPays", "Pays du permis"], ["arrivee", "Arrivée en France le"],
    ["permisEchange", "Échange du permis demandé"], ["points", "Points restants"],
    ["suspendu", "Permis suspendu ou retiré"], ["retraitLe", "Suspendu ou retiré depuis le"], ["retraitFin", "Jusqu'au"],
    ["retraitMotif", "Motif"], ["visiteTravail", "Dernière visite, médecine du travail"],
    ["visitePermisFin", "Visite médicale du permis, jusqu'au"], ["fcoType", "Dernière formation"], ["fco", "Date de la FIMO ou FCO"],
    ["code95", "Code 95 sur le permis"], ["carteQualif", "Carte de qualification, jusqu'au"],
    ["carteNum", "Numéro de la carte conducteur"], ["carteCond", "Carte conducteur, jusqu'au"],
    ["livret", "Livret individuel de contrôle"], ["aCarte", "A une carte conducteur"],
  ];
  function valeur(k, v) {
    if (v === "" || v == null) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return enFrancais(v);
    if (k === "profil") return v === "pl" ? "Poids lourd" : "Pas poids lourd";
    if (k === "permisOrigine") return v === "etr" ? "Hors Union européenne" : (v === "ue" ? "Union européenne ou EEE" : "En France");
    if (k === "sexe") return v === "F" ? "Femme" : (v === "M" ? "Homme" : v);
    if (v === "oui") return "Oui"; if (v === "non") return "Non";
    return v;
  }
  function alertes(c) {
    var A = [], auj = (function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); })(new Date());
    [["permisFin", "Le permis"], ["titreFin", "Le titre de séjour"], ["carteQualif", "La carte de qualification"],
      ["carteCond", "La carte conducteur"], ["visitePermisFin", "La visite médicale du permis"]].forEach(function (x) {
      if (c[x[0]] && c[x[0]] < auj) A.push(x[1] + " n'est plus valable depuis le " + enFrancais(c[x[0]]) + ".");
    });
    if (c.suspendu === "oui") A.push("Le salarié déclare un permis suspendu ou retiré.");
    if (c.permisOrigine === "etr" && c.arrivee) {
      var d = new Date(c.arrivee); d.setFullYear(d.getFullYear() + 1);
      var lim = d.toISOString().slice(0, 10);
      if (lim < auj) A.push("Permis étranger : arrivée en France le " + enFrancais(c.arrivee) +
        ", il n'est plus reconnu en France depuis le " + enFrancais(lim) + " s'il n'a pas été échangé (code de la route, R. 222-3).");
      else A.push("Permis étranger : à échanger avant le " + enFrancais(lim) + " (code de la route, R. 222-3).");
    }
    return A;
  }
  function detail(id) {
    var F = ETAT.fiches[id];
    if (!F) return '<div class="fr-det"><p class="fr-doux">Ouverture de la fiche...</p></div>';
    if (F.erreur) return '<div class="fr-det"><p class="fr-msg">' + ech(F.erreur) + "</p></div>";
    var c = F.champs || {};
    var A = alertes(c);
    var lignes = LIB.filter(function (l) { return valeur(l[0], c[l[0]]) !== ""; }).map(function (l) {
      return "<tr><th>" + ech(l[1]) + "</th><td>" + ech(valeur(l[0], c[l[0]])) + "</td></tr>";
    }).join("");
    var ph = Object.keys(F.photos || {}).map(function (k) {
      var p = F.photos[k];
      return '<a class="fr-ph" href="' + ech(p.image) + '" target="_blank" rel="noopener"><img alt="" src="' + ech(p.image) + '"><span>' + ech(p.titre) + "</span></a>";
    }).join("");
    return '<div class="fr-det">' +
      (A.length ? '<div class="fr-al">' + A.map(function (a) { return "<p>" + ech(a) + "</p>"; }).join("") + "</div>" : "") +
      '<table class="fr-tab">' + lignes + "</table>" +
      (ph ? '<p class="fr-st">Photos</p><div class="fr-phs">' + ph + "</div>" : "") +
      '<p class="fr-st">Signature, le ' + ech(enFrancais(F.fait)) + '</p><img class="fr-sig" alt="Signature" src="' + ech(F.signature) + '">' +
      (salarieDe(c, id) ? '<button type="button" class="fr-b" data-fr="reporter" data-id="' + ech(id) + '">Ranger dans la page du salarié</button>'
        : '<p class="fr-msg">' + ech((c.nom || "") + " " + (c.prenom || "")) + " n'est pas au registre du personnel sous ce nom exact. " +
          "Choisissez-le dans la liste ci-dessous, les noms les plus proches en tête, ou ajoutez-le au <a href=\"registre.html\">registre</a>.</p>" +
          '<select class="fr-sel" data-sel="' + ech(id) + '"><option value="">- choisir le salarié -</option>' +
          choixSalaries(c).map(function (x) { return '<option value="' + ech(x.sid) + '">' + ech(x.nom) + "</option>"; }).join("") +
          "</select>" +
          '<button type="button" class="fr-b" data-fr="rattacher" data-id="' + ech(id) + '">Ranger chez ce salarié</button>') +
      '<button type="button" class="fr-b second" data-fr="supprimer" data-id="' + ech(id) + '">Supprimer cette fiche reçue</button></div>';
  }

  /* ─── le rangement dans la page du salarié ───

     Demande du 25 novembre 2026 : la fiche remplie par le salarié entre d'elle-
     même dans sa page, sans bouton. Ses réponses vont case par case dans sa
     fiche chauffeur, ses photos et sa fiche signée dans ses documents, sous la
     rubrique « salarie-<identifiant> ». Une fois rangée, la fiche est retirée
     du serveur : l'autre appareil ne la rangera pas une seconde fois. Si le
     nom n'est pas au registre du personnel, elle attend dans le cadre des
     fiches reçues. */
  var CHAMPS_FICHE = ["roulant", "adresse", "tel", "nir", "ue", "permisOrigine", "permisPays", "arrivee", "inter", "titreFin",
    "permisNum", "permisCat", "permisFin", "suspendu", "visiteTravail", "visitePermisFin", "fco",
    "carteQualif", "code95", "carteCond", "livret", "aCarte", "profil",
    /* Ajoutés le 27 novembre 2026, avec les questions du même jour. */
    "sexe", "nais", "naisLieu", "nat", "courriel", "sansNir", "titreType", "titreNum", "permisEchange",
    "points", "retraitLe", "retraitFin", "retraitMotif", "fcoType", "carteNum"];

  /* LA FICHE REMPLIT AUSSI LE REGISTRE (27 novembre 2026).

     Elle ne remplissait que la page du salarié. Or le registre du personnel,
     les contrats, la déclaration préalable à l'embauche et les lettres lisent
     le registre : l'adresse, le numéro de sécurité sociale, la nationalité, la
     naissance, le sexe et le titre de séjour y restaient vides, et les
     documents sortaient avec des crochets. La fiche complète donc les cases
     vides du registre ; elle n'écrase jamais ce que T.E.C y a déjà mis. */
  function versRegistre(sid, c, F) {
    var R0 = lire("registre-personnel", null);
    if (!R0 || !R0.salaries) return;
    var x = null;
    R0.salaries.forEach(function (s) { if (!x && sidDe(s) === sid) x = s; });
    if (!x) return;
    function poser(k, v) {
      if (v == null || String(v).trim() === "") return;
      if (x[k] == null || String(x[k]).trim() === "") x[k] = v;
    }
    poser("sexe", c.sexe === "F" ? "Féminin" : (c.sexe === "M" ? "Masculin" : ""));
    poser("nais", c.nais);
    poser("naisLieu", c.naisLieu);
    poser("nat", c.nat ? String(c.nat).trim().charAt(0).toLowerCase() + String(c.nat).trim().slice(1) : "");
    poser("adr", c.adresse);
    /* Le contrat lit « nir », la déclaration préalable et les modèles « secu » :
       les deux reçoivent le même numéro. */
    poser("nir", c.nir);
    poser("secu", c.nir);
    if (c.ue === "non") {
      poser("etr", "oui");
      poser("titT", c.titreType);
      poser("titN", c.titreNum);
      poser("titFin", c.titreFin);
      /* La copie du titre est annexée au registre (D. 1221-24) : les photos du
         titre sont rangées dans son coffre fort. */
      if (F && F.photos && (F.photos.titreRecto || F.photos.titreVerso)) poser("titCop", "oui");
    } else if (c.ue === "oui") poser("etr", "non");
    garder("registre-personnel", R0);
  }
  /* Le courriel sert à envoyer le relevé d'heures : il va là où la page des
     heures le lit, s'il n'y en a pas déjà un. */
  function versHeures(sid, c) {
    if (!c.courriel) return;
    var H = lire("heures-reference", {}) || {}, r = H[sid] || {};
    if (String(r.courriel || "").trim()) return;
    r.courriel = c.courriel; H[sid] = r; garder("heures-reference", H);
  }
  /* RETROUVER LE SALARIÉ AU REGISTRE (26 novembre 2026). Le nom tapé par
     le salarié diffère souvent du registre : prénom composé, deuxième prénom,
     ordre inversé, tiret. On cherche d'abord le nom exact ; sinon le salarié
     dont le nom et le prénom contiennent tous les mots tapés, s'il est le
     seul. Une fiche rattachée à la main l'emporte toujours. */
  function registre() { return ((lire("registre-personnel", {}) || {}).salaries || []); }
  function mots(t) { return sansAccent(t).split("-").filter(Boolean); }
  function salarieDe(c, id) {
    var R = registre(), cible = sansAccent((c.nom || "") + " " + (c.prenom || "")), sal = null;
    var lies = lire("fiches-rattachees", {});
    if (id && lies[id]) R.forEach(function (s) { if (sidDe(s) === lies[id]) sal = s; });
    if (sal) return sal;
    R.forEach(function (s) {
      if (sansAccent((s.nom || "") + " " + (s.pre || "")) === cible ||
          sansAccent((s.pre || "") + " " + (s.nom || "")) === cible) sal = s;
    });
    if (sal) return sal;
    var M = mots((c.nom || "") + " " + (c.prenom || ""));
    if (M.length < 2) return null;
    var C = R.filter(function (s) {
      var N = mots((s.nom || "") + " " + (s.pre || ""));
      return M.every(function (m) { return N.indexOf(m) >= 0; }) || N.every(function (m) { return M.indexOf(m) >= 0; });
    });
    if (C.length === 1) return C[0];
    /* Les mêmes mots à une ou deux lettres près (Taoufik et Toufik, Mohamed
       et Mohammed), que le registre range le prénom à part ou l'écrive avec
       le nom dans la même case. Un seul salarié dans ce cas, sinon on
       demande. */
    function proche(m, n) { return m === n || (m.length >= 4 && n.length >= 4 && ecart(m, n) <= 2); }
    var P = R.filter(function (s) {
      var N = mots((s.nom || "") + " " + (s.pre || ""));
      return N.length === M.length && M.every(function (m) { return N.some(function (n) { return proche(m, n); }); }) &&
        N.every(function (n) { return M.some(function (m) { return proche(m, n); }); });
    });
    return P.length === 1 ? P[0] : null;
  }
  function ecart(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var d = [], i, j;
    for (i = 0; i <= a.length; i++) d[i] = [i];
    for (j = 0; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    return d[a.length][b.length];
  }
  function sidDe(s) { return sansAccent(((s.nom || "") + " " + (s.pre || "")).trim()) || "salarie"; }
  /* La liste du registre, les plus proches du nom tapé en tête. */
  function choixSalaries(c) {
    var M = mots((c.nom || "") + " " + (c.prenom || ""));
    return registre().filter(function (s) { return !String(s.sor || "").trim(); }).map(function (s) {
      var N = mots((s.nom || "") + " " + (s.pre || "")), n = 0;
      M.forEach(function (m) { if (N.indexOf(m) >= 0) n++; });
      return { sid: sidDe(s), nom: ((s.nom || "") + " " + (s.pre || "")).trim(), n: n };
    }).sort(function (a, b) { return b.n - a.n || a.nom.localeCompare(b.nom, "fr"); });
  }
  function blobDe(url) { return fetch(url).then(function (r) { return r.blob(); }); }
  /* La fiche signée, mise en image : ses réponses, puis la signature. */
  function ficheImage(F) {
    var c = F.champs || {}, W = 1240, M = 80, L = [];
    LIB.forEach(function (l) { var v = valeur(l[0], c[l[0]]); if (v !== "") L.push([l[1], v]); });
    var cv = document.createElement("canvas"), x = cv.getContext("2d");
    cv.width = W; cv.height = 260 + L.length * 52 + 420;
    x.fillStyle = "#fff"; x.fillRect(0, 0, W, cv.height);
    x.fillStyle = "#1F3864"; x.font = "bold 44px system-ui, sans-serif";
    x.fillText("Fiche chauffeur, T.E.C", M, 110);
    x.fillStyle = "#5f6874"; x.font = "28px system-ui, sans-serif";
    x.fillText("Remplie et signée par le salarié le " + enFrancais(F.fait), M, 160);
    var y = 240;
    L.forEach(function (l) {
      x.fillStyle = "#5f6874"; x.font = "28px system-ui, sans-serif"; x.fillText(l[0], M, y);
      x.fillStyle = "#16181d"; x.font = "bold 28px system-ui, sans-serif"; x.fillText(String(l[1]).slice(0, 40), 700, y);
      x.strokeStyle = "#dcdfe4"; x.beginPath(); x.moveTo(M, y + 16); x.lineTo(W - M, y + 16); x.stroke();
      y += 52;
    });
    y += 40;
    x.fillStyle = "#5f6874"; x.font = "28px system-ui, sans-serif";
    x.fillText("« Je certifie que ces informations sont exactes. »  Signature :", M, y);
    return new Promise(function (ok) {
      var im = new Image();
      im.onload = function () {
        var h = 300, l = Math.min(W - 2 * M, im.width * h / im.height);
        x.drawImage(im, M, y + 24, l, h);
        cv.toBlob(function (b) { ok(b); }, "image/png");
      };
      im.onerror = function () { cv.toBlob(function (b) { ok(b); }, "image/png"); };
      im.src = F.signature || "";
    });
  }
  function ranger(id, F) {
    var c = F.champs || {}, sal = salarieDe(c, id);
    if (!sal || !window.Documents) return Promise.resolve(false);
    var sid = sansAccent(((sal.nom || "") + " " + (sal.pre || "")).trim()) || "salarie";
    var rub = "salarie-" + sid, quand = enFrancais(F.fait);
    /* Le nom du salarié en tête de chaque pièce : « Mes documents » range
       ses pièces sous son nom, et le filtre par salarié les retrouve. */
    var qui = ((sal.nom || "").trim() + " " + (sal.pre || "").trim()).trim();
    /* UNE PHOTO DU MÊME DOCUMENT REMPLACE L'ANCIENNE. L'ancienne n'est pas
       effacée : elle prend la mention « remplacée le ... » et reste dans ses
       documents. */
    function poser(debut, ext, sorte, type, blob) {
      return window.Documents.liste(rub).then(function (L) {
        var anciennes = L.filter(function (d) {
          var n = String(d.nom || ""); return n.indexOf(debut + " (") === 0 && n.indexOf("remplacée") < 0;
        });
        return Promise.all(anciennes.map(function (d) {
          return renommer(d, String(d.nom).replace(/(\.[a-z]+)$/, "") + " (remplacée le " + quand + ")" + (String(d.nom).match(/\.[a-z]+$/) || [""])[0]);
        }));
      }).then(function () {
        return window.Documents.enregistrer(rub, { nom: debut + " (" + quand + ")" + ext, sorte: sorte, type: type, contenu: blob });
      });
    }
    var cles = Object.keys(F.photos || {});
    var P = cles.reduce(function (pr, k) {
      var p = F.photos[k];
      return pr.then(function () { return blobDe(p.image); }).then(function (b) {
        return poser(qui + ", " + p.titre.charAt(0).toLowerCase() + p.titre.slice(1), ".jpg", "depose", "image/jpeg", b);
      });
    }, Promise.resolve()).then(function () { return ficheImage(F); }).then(function (b) {
      return poser(qui + ", fiche chauffeur signée", ".png", "produit", "image/png", b);
    });
    return P.then(function () {
      var T = lire("flotte-conducteurs", {}), f = T[sid] || {};
      /* LA MISE À JOUR NE FAIT QUE COMPLÉTER OU CORRIGER. Case vide :
         complétée. Case identique : inchangée. Case différente : la nouvelle
         valeur, l'ancienne gardée dans la trace. Case laissée vide par le
         salarié : rien n'est effacé. */
      var changes = [], ajouts = [];
      if (f.recue) {
        CHAMPS_FICHE.forEach(function (k) {
          var v = c[k]; if (v == null || v === "") return;
          if (f[k] == null || f[k] === "") ajouts.push(k);
          else if (String(f[k]) !== String(v)) changes.push({ k: k, avant: f[k], apres: v });
        });
        f.maj = { id: id, le: F.fait, changes: changes, ajouts: ajouts, precedente: f.recue, valideeAvant: f.validee || null };
      } else delete f.maj;
      CHAMPS_FICHE.forEach(function (k) { if (c[k] != null && c[k] !== "") f[k] = c[k]; });
      f.recue = { le: F.fait, id: id };
      T[sid] = f; garder("flotte-conducteurs", T);
      versRegistre(sid, c, F);
      versHeures(sid, c);
      var faites = lire(CLE_FAITES, {}); faites[id] = (function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); })(new Date()); garder(CLE_FAITES, faites);
      var R = lire(CLE_RANGEES, []);
      R.unshift({ id: id, sid: sid, nom: ((c.nom || "") + " " + (c.prenom || "")).trim(), le: (function (d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); })(new Date()), fait: F.fait });
      garder(CLE_RANGEES, R.slice(0, 30));
      return appel("DELETE", "depot/" + id).then(function () { return true; }, function () { return true; });
    });
  }
  function chargerFiche(id) {
    if (ETAT.fiches[id] && !ETAT.fiches[id].erreur) return Promise.resolve(ETAT.fiches[id]);
    return appel("GET", "depot/" + id).then(function (r) { if (!r.ok) throw new Error(); return r.arrayBuffer(); })
      .then(ouvrir).then(function (F) { ETAT.fiches[id] = F; return F; });
  }
  /* Une seule fois à la fois sur l'appareil, même si deux pages sont ouvertes. */
  function rangerTout() {
    var v = parseInt(ls.getItem(CLE_VERROU) || "0", 10);
    if (Date.now() - v < 90000) return Promise.resolve(0);
    ls.setItem(CLE_VERROU, String(Date.now()));
    var faites = lire(CLE_FAITES, {}), n = 0;
    var L = ETAT.liste.filter(function (it) { return !faites[it.id]; });
    return L.reduce(function (pr, it) {
      return pr.then(function () {
        var r = ETAT.resumes[it.id];
        if (r && !salarieDe(r, it.id)) return null;   /* pas au registre : on ne télécharge pas */
        return chargerFiche(it.id).then(function (F) { return ranger(it.id, F); })
          .then(function (ok) { if (ok) n++; }, function (e) {
            /* Un échec se dit, au lieu de laisser la fiche en attente sans
               explication. */
            ETAT.msg = "La fiche de " + ((r && (r.nom + " " + (r.prenom || ""))) || "un salarié") +
              " n'a pas pu être rangée (" + String((e && e.message) || e || "erreur").slice(0, 80) + "). Ouvrez-la et touchez « Ranger ».";
          });
      });
    }, Promise.resolve()).then(function () { ls.removeItem(CLE_VERROU); return n; },
      function () { ls.removeItem(CLE_VERROU); return n; });
  }

  /* ─── les gestes ─── */
  if (hote) hote.addEventListener("click", function (ev) {
    var b = ev.target.closest ? ev.target.closest("[data-fr]") : null; if (!b) return;
    var q = b.getAttribute("data-fr"), id = b.getAttribute("data-id");
    if (q === "activer") {
      b.disabled = true; b.textContent = "Création du lien...";
      activer().then(charger, function () { ETAT.msg = "Le lien n'a pas pu être créé : vérifiez la connexion et réessayez."; rendre(); });
    } else if (q === "copier") {
      var t = lien();
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () {
        b.textContent = "Lien copié";
      }, function () { var i = hote.querySelector(".fr-lien input"); i.select(); document.execCommand("copy"); b.textContent = "Lien copié"; });
    } else if (q === "partager") {
      navigator.share({ title: "Fiche chauffeur T.E.C", text: "Merci de remplir votre fiche chauffeur, avec les photos de vos papiers :", url: lien() }).catch(function () {});
    } else if (q === "voir") {
      ETAT.ouvertes[id] = !ETAT.ouvertes[id]; rendre();
      if (ETAT.ouvertes[id] && !ETAT.fiches[id]) {
        appel("GET", "depot/" + id).then(function (r) { if (!r.ok) throw new Error(); return r.arrayBuffer(); })
          .then(ouvrir).then(function (F) { ETAT.fiches[id] = F; rendre(); },
            function () { ETAT.fiches[id] = { erreur: "Cette fiche ne s'ouvre pas sur cet appareil. Rouvrez la page dans un instant, le temps que le dossier se mette à jour." }; rendre(); });
      }
    } else if (q === "actualiser") {
      ETAT.msg = ""; b.textContent = "Vérification..."; charger();
    } else if (q === "retirer") {
      if (!window.confirm("Supprimer cette fiche ? Ses réponses sortent de la fiche du salarié, et ses photos et sa fiche signée de ses documents.")) return;
      retirer(id, b.getAttribute("data-sid")).then(function () { ETAT.msg = "Fiche supprimée."; rendre(); }, function () { rendre(); });
    } else if (q === "copier-nr") {
      var t = "Fiche chauffeur pas encore remplie :\n" + nonRemplis().map(function (p) { return "- " + p.nom; }).join("\n");
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { b.textContent = "Liste copiée"; },
        function () { window.prompt("Copiez la liste :", t); });
    } else if (q === "rattacher") {
      var sel = hote.querySelector('[data-sel="' + id + '"]');
      if (!sel || !sel.value) { ETAT.msg = "Choisissez d'abord le salarié dans la liste."; rendre(); return; }
      var lies = lire("fiches-rattachees", {}); lies[id] = sel.value; garder("fiches-rattachees", lies);
      q = "reporter";
    }
    if (q === "reporter") {
      b.disabled = true; b.textContent = "Rangement...";
      chargerFiche(id).then(function (F) { return ranger(id, F); }).then(function (ok) {
        if (ok) location.href = "salaries.html?s=" + encodeURIComponent(lire(CLE_RANGEES, [])[0].sid) + "&v=fiche";
        else { ETAT.msg = "Le rangement n'a pas pu se faire. Réessayez."; rendre(); }
      }, function () { ETAT.msg = "Le rangement n'a pas pu se faire. Réessayez."; rendre(); });
    } else if (q === "supprimer") {
      if (!window.confirm("Supprimer cette fiche reçue ? Pensez à la reporter d'abord.")) return;
      appel("DELETE", "depot/" + id).then(function () { delete ETAT.fiches[id]; charger(); });
    }
  });

  function charger() {
    rendre();
    if (!lire(CLE_PRIV, null)) {
      /* Le lien peut avoir été créé sur un autre appareil : la clé arrive avec
         le partage du dossier. On le dit, sans en créer une seconde. */
      fetch("/fiches/cle", { cache: "no-store" }).then(function (r) {
        if (r.ok && hote) { ETAT.msg = ""; hote.querySelector(".fr-b").outerHTML = '<p class="fr-doux">Le lien a déjà été créé sur un autre appareil. Il apparaîtra ici dès que le dossier se sera mis à jour : rouvrez la page dans un instant.</p>'; }
      }).catch(function () {});
      return;
    }
    appel("GET", "liste").then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (L) {
      ETAT.liste = L.sort(function (a, b) { return a.quand < b.quand ? 1 : -1; });
      return Promise.all(L.map(function (it) {
        if (!it.resume || ETAT.resumes[it.id]) return null;
        return ouvrir(deB64(it.resume)).then(function (r) { ETAT.resumes[it.id] = r; }, function () {});
      }));
    }).then(function () {
      rendre();
      return rangerTout().then(function (n) {
        var d = new Date(); ETAT.vu = ("0" + d.getHours()).slice(-2) + " h " + ("0" + d.getMinutes()).slice(-2);
        if (n && hote) ETAT.msg = n + " fiche" + (n > 1 ? "s rangées" : " rangée") + " dans la page du salarié.";
        if (n && window.Flotte && window.Flotte.rendre) window.Flotte.rendre();
        rendre();
      });
    }, function () { ETAT.msg = "La liste des fiches n'a pas pu être lue : vérifiez la connexion."; rendre(); });
  }
  charger();
  /* EN DIRECT (26 novembre 2026) : tant que la page est ouverte et visible,
     on regarde toutes les 30 secondes si une fiche est arrivée. Seule la
     liste est demandée, quelques octets ; la fiche n'est téléchargée que si
     elle est nouvelle. */
  setInterval(function () {
    if (document.visibilityState === "visible" && lire(CLE_PRIV, null)) charger();
  }, 30000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && lire(CLE_PRIV, null)) charger();
  });
})();
