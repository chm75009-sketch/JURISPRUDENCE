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
  var hote = document.getElementById("fiches-recues");
  if (!hote) return;
  var brut64 = ls.getItem("synchro-cle");
  if (!brut64) return;

  var CLE_PRIV = "fiches-cle-privee", CLE_CODE = "fiches-code", CLE_FAITES = "fiches-reportees";
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
      if (!ETAT.liste.length) {
        h += '<p class="fr-doux">Aucune fiche reçue pour l\'instant.</p>';
      } else {
        h += ETAT.liste.map(function (it) {
          var r = ETAT.resumes[it.id] || {};
          var nom = r.nom ? (r.nom + " " + (r.prenom || "")) : "Fiche reçue";
          var sous = [r.profil === "pl" ? "poids lourd" : (r.profil === "leger" ? "pas poids lourd" : ""),
            "reçue le " + enFrancais(it.quand), faites[it.id] ? "reportée" : "à reporter"].filter(Boolean).join(" · ");
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
      '<button type="button" class="fr-b" data-fr="reporter" data-id="' + ech(id) + '">Reporter dans la fiche du chauffeur</button>' +
      '<button type="button" class="fr-b second" data-fr="supprimer" data-id="' + ech(id) + '">Supprimer cette fiche reçue</button></div>';
  }

  /* ─── reporter dans la fiche du chauffeur ─── */
  function reporter(id) {
    var F = ETAT.fiches[id]; if (!F || !F.champs) return;
    var c = F.champs;
    var reg = lire("registre-personnel", {}), sal = null;
    ((reg && reg.salaries) || []).forEach(function (s) {
      if (sansAccent((s.nom || "") + " " + (s.pre || "")) === sansAccent(c.nom + " " + c.prenom) ||
          sansAccent((s.pre || "") + " " + (s.nom || "")) === sansAccent(c.nom + " " + c.prenom)) sal = s;
    });
    if (!sal) {
      ETAT.msg = c.nom + " " + c.prenom + " n'est pas au registre du personnel sous ce nom. Ajoutez-le au registre, puis reportez la fiche.";
      rendre(); return;
    }
    var sid = sansAccent(((sal.nom || "") + " " + (sal.pre || "")).trim()) || "salarie";
    var T = lire("flotte-conducteurs", {}), f = T[sid] || {};
    ["permisNum", "permisCat", "permisFin", "visiteTravail", "visitePermisFin", "fco", "carteQualif", "carteCond",
      "titreFin", "permisPays", "arrivee"].forEach(function (k) { if (c[k]) f[k] = c[k]; });
    if (c.profil) f.profil = c.profil;
    var note = "Fiche remplie et signée par le salarié le " + enFrancais(F.fait) + "." +
      (c.tel ? " Téléphone : " + c.tel + "." : "") +
      (c.suspendu === "oui" ? " Déclare un permis suspendu ou retiré." : "") +
      (c.code95 ? " Code 95 sur le permis : " + c.code95 + "." : "") +
      (c.livret ? " Livret individuel de contrôle : " + c.livret + "." : "");
    f.note = (f.note ? f.note + "\n" : "") + note;
    T[sid] = f; garder("flotte-conducteurs", T);
    var faites = lire(CLE_FAITES, {}); faites[id] = new Date().toISOString().slice(0, 10); garder(CLE_FAITES, faites);
    location.href = "flotte.html?vue=conducteurs";
  }

  /* ─── les gestes ─── */
  hote.addEventListener("click", function (ev) {
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
      reporter(id);
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
        if (r.ok) { ETAT.msg = ""; hote.querySelector(".fr-b").outerHTML = '<p class="fr-doux">Le lien a déjà été créé sur un autre appareil. Il apparaîtra ici dès que le dossier se sera mis à jour : rouvrez la page dans un instant.</p>'; }
      }).catch(function () {});
      return;
    }
    appel("GET", "liste").then(function (r) { if (!r.ok) throw new Error(); return r.json(); }).then(function (L) {
      ETAT.liste = L.sort(function (a, b) { return a.quand < b.quand ? 1 : -1; });
      return Promise.all(L.map(function (it) {
        if (!it.resume || ETAT.resumes[it.id]) return null;
        return ouvrir(deB64(it.resume)).then(function (r) { ETAT.resumes[it.id] = r; }, function () {});
      }));
    }).then(rendre, function () { ETAT.msg = "La liste des fiches n'a pas pu être lue : vérifiez la connexion."; rendre(); });
  }
  charger();
})();
