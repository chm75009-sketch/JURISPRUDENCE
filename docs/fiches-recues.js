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
      if (ETAT.msg) h += '<p class="fr-msg">' + ech(ETAT.msg) + "</p>";
      var R = lire(CLE_RANGEES, []);
      if (R.length) {
        h += '<p class="fr-st">Rangées dans la page du salarié</p>' + R.slice(0, 5).map(function (x) {
          return '<a class="fr-ok" href="flotte.html?c=' + encodeURIComponent(x.sid) + '">' + ech(x.nom) +
            "<small>rangée le " + ech(enFrancais(x.le)) + "</small></a>";
        }).join("");
      }
      var attente = ETAT.liste.filter(function (it) { return !faites[it.id]; });
      if (!attente.length) {
        h += '<p class="fr-doux">' + (R.length ? "Aucune fiche en attente." : "Aucune fiche reçue pour l'instant.") + "</p>";
      } else {
        h += '<p class="fr-st">En attente</p>' + attente.map(function (it) {
          var r = ETAT.resumes[it.id] || {};
          var nom = r.nom ? (r.nom + " " + (r.prenom || "")) : "Fiche reçue";
          var sous = [r.profil === "pl" ? "poids lourd" : (r.profil === "leger" ? "pas poids lourd" : ""),
            "reçue le " + enFrancais(it.quand), r.nom && !salarieDe(r) ? "nom absent du registre du personnel" : "en cours de rangement"].filter(Boolean).join(" · ");
          return '<div class="fr-it' + (faites[it.id] ? " fait" : "") + '">' +
            '<button type="button" class="fr-ligne" data-fr="voir" data-id="' + ech(it.id) + '">' +
            '<span class="fr-n">' + ech(nom) + '<small>' + ech(sous) + "</small></span><span class=\"fr-fl\">" +
            (ETAT.ouvertes[it.id] ? "&#8963;" : "&#8964;") + "</span></button>" +
            (ETAT.ouvertes[it.id] ? detail(it.id) : "") + "</div>";
        }).join("");
      }
    }
    hote.innerHTML = h + "</div>";
  }

  var LIB = [
    ["nom", "Nom"], ["prenom", "Prénom"], ["tel", "Téléphone"],
    ["profil", "Profil"], ["ue", "Ressortissant UE ou EEE"], ["titreFin", "Titre de séjour, valable jusqu'au"],
    ["permisOrigine", "Permis"], ["permisPays", "Pays du permis"], ["arrivee", "Arrivée en France le"],
    ["inter", "International ou cabotage"],
    ["permisNum", "Numéro du permis"], ["permisCat", "Catégories"], ["permisFin", "Permis valable jusqu'au"],
    ["suspendu", "Permis suspendu ou retiré"], ["visiteTravail", "Dernière visite, médecin du travail"],
    ["visitePermisFin", "Visite médicale du permis, jusqu'au"], ["fco", "Dernière FIMO ou FCO"],
    ["carteQualif", "Carte de qualification, jusqu'au"], ["code95", "Code 95 sur le permis"],
    ["carteCond", "Carte conducteur, jusqu'au"], ["livret", "Livret individuel de contrôle"], ["aCarte", "A une carte conducteur"],
  ];
  function valeur(k, v) {
    if (v === "" || v == null) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return enFrancais(v);
    if (k === "profil") return v === "pl" ? "Poids lourd" : "Pas poids lourd";
    if (k === "permisOrigine") return v === "etr" ? "Étranger" : "Français";
    if (v === "oui") return "Oui"; if (v === "non") return "Non";
    return v;
  }
  function alertes(c) {
    var A = [], auj = new Date().toISOString().slice(0, 10);
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
      (salarieDe(c) ? '<button type="button" class="fr-b" data-fr="reporter" data-id="' + ech(id) + '">Ranger dans la page du salarié</button>'
        : '<p class="fr-msg">' + ech((c.nom || "") + " " + (c.prenom || "")) + ' n\'est pas au registre du personnel sous ce nom. Ajoutez-le au <a href="registre.html">registre</a> : la fiche se rangera d\'elle-même à la prochaine ouverture.</p>') +
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
  var CHAMPS_FICHE = ["tel", "ue", "permisOrigine", "permisPays", "arrivee", "inter", "titreFin",
    "permisNum", "permisCat", "permisFin", "suspendu", "visiteTravail", "visitePermisFin", "fco",
    "carteQualif", "code95", "carteCond", "livret", "aCarte", "profil"];
  function salarieDe(c) {
    var reg = lire("registre-personnel", {}), sal = null, cible = sansAccent((c.nom || "") + " " + (c.prenom || ""));
    ((reg && reg.salaries) || []).forEach(function (s) {
      if (sansAccent((s.nom || "") + " " + (s.pre || "")) === cible ||
          sansAccent((s.pre || "") + " " + (s.nom || "")) === cible) sal = s;
    });
    return sal;
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
    var c = F.champs || {}, sal = salarieDe(c);
    if (!sal || !window.Documents) return Promise.resolve(false);
    var sid = sansAccent(((sal.nom || "") + " " + (sal.pre || "")).trim()) || "salarie";
    var rub = "salarie-" + sid, quand = enFrancais(F.fait);
    /* Le nom du salarié en tête de chaque pièce : « Mes documents » range
       ses pièces sous son nom, et le filtre par salarié les retrouve. */
    var qui = ((sal.nom || "").trim() + " " + (sal.pre || "").trim()).trim();
    var P = Object.keys(F.photos || {}).map(function (k) {
      var p = F.photos[k];
      return blobDe(p.image).then(function (b) {
        return window.Documents.enregistrer(rub, { nom: qui + ", " + p.titre.charAt(0).toLowerCase() + p.titre.slice(1) + " (" + quand + ").jpg", sorte: "depose", type: "image/jpeg", contenu: b });
      });
    });
    P.push(ficheImage(F).then(function (b) {
      return window.Documents.enregistrer(rub, { nom: qui + ", fiche chauffeur signée (" + quand + ").png", sorte: "produit", type: "image/png", contenu: b });
    }));
    return Promise.all(P).then(function () {
      var T = lire("flotte-conducteurs", {}), f = T[sid] || {};
      CHAMPS_FICHE.forEach(function (k) { if (c[k] != null && c[k] !== "") f[k] = c[k]; });
      f.recue = { le: F.fait, id: id };
      T[sid] = f; garder("flotte-conducteurs", T);
      var faites = lire(CLE_FAITES, {}); faites[id] = new Date().toISOString().slice(0, 10); garder(CLE_FAITES, faites);
      var R = lire(CLE_RANGEES, []);
      R.unshift({ id: id, sid: sid, nom: ((c.nom || "") + " " + (c.prenom || "")).trim(), le: new Date().toISOString().slice(0, 10) });
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
        if (r && !salarieDe(r)) return null;          /* pas au registre : on ne télécharge pas */
        return chargerFiche(it.id).then(function (F) { return ranger(it.id, F); })
          .then(function (ok) { if (ok) n++; }, function () {});
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
    } else if (q === "reporter") {
      b.disabled = true; b.textContent = "Rangement...";
      chargerFiche(id).then(function (F) { return ranger(id, F); }).then(function (ok) {
        if (ok) location.href = "flotte.html?c=" + encodeURIComponent(lire(CLE_RANGEES, [])[0].sid);
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
        if (n && hote) ETAT.msg = n + " fiche" + (n > 1 ? "s rangées" : " rangée") + " dans la page du salarié.";
        rendre();
      });
    }, function () { ETAT.msg = "La liste des fiches n'a pas pu être lue : vérifiez la connexion."; rendre(); });
  }
  charger();
})();
