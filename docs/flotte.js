/* LA FLOTTE ET LES CONDUCTEURS.

   Le pourquoi, et ce que l'écran affirme ou n'affirme pas, sont en tête de
   flotte.html. Ici, la mécanique.

   Tout tient dans une seule idée : une échéance est une date, et une date a
   une couleur. Passée, elle clignote en rouge ; dans les trente jours, elle
   est rouge ; dans les soixante, ambre ; au-delà, verte. Le compteur du haut
   additionne ces couleurs sur les deux fichiers.

   Ce qui est gardé sur le poste :

     flotte-vehicules     les véhicules et leurs dates
     flotte-conducteurs   par salarié du registre, ses titres et ses visites
     registre-personnel   les noms, écrits ailleurs, seulement lus ici        */

"use strict";
(function (window, document) {

  var CLE_V = "flotte-vehicules";
  var CLE_C = "flotte-conducteurs";
  var CLE_REG = "registre-personnel";

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];

  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lire(c, d) {
    try { return JSON.parse(window.localStorage.getItem(c) || "null") || d; }
    catch (e) { return d; }
  }
  function garder(c, v) { try { window.localStorage.setItem(c, JSON.stringify(v)); } catch (e) {} }
  function net(v) { return String(v == null ? "" : v).trim(); }
  function enFrancais(isoDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    if (!m) return "";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function plusMois(isoDate, mois) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    var n = parseInt(mois, 10);
    if (!m || !n) return "";
    var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    var j = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    d.setDate(Math.min(j, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
    return iso(d);
  }
  function joursAvant(isoDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    if (!m) return null;
    var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    var n = new Date(); n.setHours(0, 0, 0, 0);
    return Math.round((d - n) / 86400000);
  }
  /* La couleur d'une échéance, une fois pour toutes. */
  function etat(isoDate) {
    var j = joursAvant(isoDate);
    if (j === null) return "";
    if (j < 0) return "passe";
    if (j <= 30) return "rouge";
    if (j <= 60) return "ambre";
    return "vert";
  }
  function dit(j) {
    if (j === null) return "";
    if (j < 0) return "dépassée de " + (-j) + " jour" + (-j > 1 ? "s" : "");
    if (j === 0) return "aujourd'hui";
    if (j === 1) return "demain";
    return "dans " + j + " jours";
  }

  /* ─────────────────────────── les deux fichiers ────────────────────────── */

  var GENRES = [
    ["vl", "Voiture particulière"],
    ["vul", "Véhicule utilitaire léger"],
    ["pl", "Poids lourd"],
    ["tracteur", "Tracteur routier"],
    ["remorque", "Remorque ou semi-remorque"],
    ["autre", "Autre"],
  ];
  /* Pré-remplissage, jamais une affirmation : le champ reste modifiable, et
     c'est la date obtenue qui commande l'alerte. */
  var CT_DEFAUT = { vl: 24, vul: 24, pl: 12, tracteur: 12, remorque: 12, autre: 12 };

  var CHAMPS_V = [
    { c: "immat", lib: "Immatriculation", t: "text", maj: true, large: false },
    { c: "genre", lib: "Genre", t: "select", opts: GENRES },
    { c: "marque", lib: "Marque et modèle", t: "text" },
    { c: "mec", lib: "1re mise en circulation", t: "date" },
    { c: "km", lib: "Kilométrage", t: "num" },
    { c: "kmLe", lib: "Relevé le", t: "date" },
    { c: "ct", lib: "Dernier contrôle technique", t: "date" },
    { c: "ctMois", lib: "Périodicité du contrôle, en mois", t: "num" },
    { c: "lim", lib: "Dernier contrôle du limiteur", t: "date" },
    { c: "limMois", lib: "Périodicité du limiteur, en mois", t: "num" },
    { c: "chrono", lib: "Dernier contrôle du chronotachygraphe", t: "date" },
    { c: "chronoMois", lib: "Périodicité du chronotachygraphe, en mois", t: "num" },
    { c: "assur", lib: "Échéance de l'assurance", t: "date" },
    { c: "licence", lib: "Copie conforme de licence, numéro", t: "text" },
    { c: "licenceFin", lib: "Échéance de la copie conforme", t: "date" },
    { c: "revision", lib: "Prochaine révision, au plus tard le", t: "date" },
    { c: "revisionKm", lib: "ou au kilométrage", t: "num" },
    { c: "extincteur", lib: "Échéance de l'extincteur", t: "date" },
    { c: "note", lib: "Observations", t: "textarea", large: true },
  ];

  var SUIVIS = [
    ["", "- à préciser -"],
    ["vip", "Visite d'information et de prévention (5 ans au plus)"],
    ["sir", "Suivi individuel renforcé (4 ans au plus, intermédiaire à 2 ans)"],
  ];

  var CHAMPS_C = [
    { c: "permisNum", lib: "Permis, numéro", t: "text" },
    { c: "permisCat", lib: "Catégories", t: "text" },
    { c: "permisFin", lib: "Validité du permis jusqu'au", t: "date" },
    { c: "points", lib: "Points restants", t: "num" },
    { c: "retraitLe", lib: "Retrait ou suspension, le", t: "date" },
    { c: "retraitFin", lib: "Jusqu'au", t: "date" },
    { c: "retraitMotif", lib: "Motif du retrait ou de la suspension", t: "text", large: true },
    { c: "fco", lib: "Dernière FIMO ou FCO", t: "date" },
    { c: "fcoMois", lib: "Périodicité de la FCO, en mois", t: "num" },
    { c: "carteCond", lib: "Carte de conducteur, échéance", t: "date" },
    { c: "carteQualif", lib: "Carte de qualification, échéance", t: "date" },
    { c: "visitePermisFin", lib: "Visite médicale du permis, valable jusqu'au", t: "date" },
    { c: "suivi", lib: "Suivi médical du travail", t: "select", opts: SUIVIS, large: true },
    { c: "visiteTravail", lib: "Dernière visite avec le médecin du travail", t: "date" },
    { c: "visiteInter", lib: "Dernière visite intermédiaire", t: "date" },
    { c: "vehicule", lib: "Véhicule habituel", t: "vehicule" },
    { c: "note", lib: "Observations", t: "textarea", large: true },
  ];

  function vehicules() { return lire(CLE_V, []); }
  function garderVehicules(L) { garder(CLE_V, L); }

  function sansAccent(s) {
    try {
      return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    } catch (e) { return String(s == null ? "" : s).toLowerCase(); }
  }
  function salaries() {
    var r = lire(CLE_REG, {});
    return ((r && r.salaries) || []).filter(function (s) {
      return net(s.nom) || net(s.pre);
    }).map(function (s) {
      var nom = (net(s.nom) + " " + net(s.pre)).trim();
      return { id: sansAccent(nom) || "salarie", nom: nom, emp: net(s.emp), ent: net(s.ent), sor: net(s.sor) };
    });
  }
  function fiche(id) {
    var t = lire(CLE_C, {});
    return t[id] || {};
  }
  function garderFiche(id, f) {
    var t = lire(CLE_C, {});
    t[id] = f;
    garder(CLE_C, t);
  }

  /* ───────────────────────────── les échéances ──────────────────────────── */

  function echeancesVehicule(v) {
    var L = [];
    function pose(quoi, date) {
      if (!net(date)) return;
      L.push({ quoi: quoi, date: date, etat: etat(date), jours: joursAvant(date) });
    }
    pose("Contrôle technique", v.ct ? plusMois(v.ct, v.ctMois || CT_DEFAUT[v.genre] || 12) : "");
    pose("Limiteur", v.lim ? plusMois(v.lim, v.limMois || 24) : "");
    pose("Chronotachygraphe", v.chrono ? plusMois(v.chrono, v.chronoMois || 24) : "");
    pose("Assurance", v.assur);
    pose("Copie conforme", v.licenceFin);
    pose("Révision", v.revision);
    pose("Extincteur", v.extincteur);
    /* La révision au kilométrage n'a pas de date : elle se compare au dernier
       relevé, et se dit en kilomètres. */
    var seuil = parseInt(v.revisionKm, 10), km = parseInt(v.km, 10);
    if (seuil && !isNaN(km)) {
      var reste = seuil - km;
      L.push({
        quoi: "Révision", km: true, reste: reste,
        etat: reste < 0 ? "passe" : (reste <= 1000 ? "rouge" : (reste <= 3000 ? "ambre" : "vert")),
      });
    }
    return L;
  }

  function echeancesConducteur(f) {
    var L = [];
    function pose(quoi, date) {
      if (!net(date)) return;
      L.push({ quoi: quoi, date: date, etat: etat(date), jours: joursAvant(date) });
    }
    pose("Permis", f.permisFin);
    pose("Fin de suspension", f.retraitFin);
    pose("FCO", f.fco ? plusMois(f.fco, f.fcoMois || 60) : "");
    pose("Carte conducteur", f.carteCond);
    pose("Carte de qualification", f.carteQualif);
    pose("Visite du permis", f.visitePermisFin);
    /* Le code du travail, lui, est lu à la source : cinq ans au plus pour le
       renouvellement de la visite d'information et de prévention (R. 4624-16),
       quatre ans au plus en suivi renforcé, avec une visite intermédiaire à
       deux ans au plus tard (R. 4624-28). */
    if (f.suivi === "vip") pose("Visite de prévention", f.visiteTravail ? plusMois(f.visiteTravail, 60) : "");
    if (f.suivi === "sir") {
      pose("Visite du médecin", f.visiteTravail ? plusMois(f.visiteTravail, 48) : "");
      pose("Visite intermédiaire", f.visiteTravail
        ? plusMois(f.visiteInter || f.visiteTravail, f.visiteInter ? 48 : 24) : "");
    }
    var pts = parseInt(f.points, 10);
    if (!isNaN(pts)) {
      L.push({
        quoi: "Points", points: true, valeur: pts,
        etat: pts <= 0 ? "passe" : (pts <= 3 ? "rouge" : (pts <= 6 ? "ambre" : "vert")),
      });
    }
    return L;
  }

  function pastilles(L) {
    if (!L.length) return '<span class="p">Aucune date encore renseignée</span>';
    return L.map(function (e) {
      var texte;
      if (e.km) {
        texte = e.reste < 0 ? "<b>Révision</b> dépassée de " + (-e.reste) + " km"
          : "<b>Révision</b> dans " + e.reste + " km";
      } else if (e.points) {
        texte = "<b>Points</b> " + e.valeur;
      } else {
        texte = "<b>" + ech(e.quoi) + "</b> " + ech(enFrancais(e.date)) + ", " + ech(dit(e.jours));
      }
      return '<span class="p ' + e.etat + '">' + texte + "</span>";
    }).join("");
  }

  function pire(L) {
    if (L.some(function (e) { return e.etat === "passe"; })) return "passe";
    if (L.some(function (e) { return e.etat === "rouge"; })) return "rouge";
    if (L.some(function (e) { return e.etat === "ambre"; })) return "ambre";
    return L.length ? "vert" : "";
  }

  /* ──────────────────────────────── les formes ──────────────────────────── */

  function champHtml(ch, valeur, prefixe) {
    var id = prefixe + "-" + ch.c;
    var h = '<label' + (ch.large ? ' class="large"' : "") + '><span>' + ech(ch.lib) + "</span>";
    if (ch.t === "select") {
      h += '<select id="' + id + '" data-ch="' + ch.c + '">' + ch.opts.map(function (o) {
        return '<option value="' + ech(o[0]) + '"' + (o[0] === net(valeur) ? " selected" : "") +
          ">" + ech(o[1]) + "</option>";
      }).join("") + "</select>";
    } else if (ch.t === "vehicule") {
      var L = vehicules();
      h += '<select id="' + id + '" data-ch="' + ch.c + '"><option value="">- aucun -</option>' +
        L.map(function (v) {
          return '<option value="' + ech(v.id) + '"' + (v.id === net(valeur) ? " selected" : "") +
            ">" + ech(v.immat || "sans immatriculation") + "</option>";
        }).join("") + "</select>";
    } else if (ch.t === "textarea") {
      h += '<textarea id="' + id + '" data-ch="' + ch.c + '">' + ech(valeur) + "</textarea>";
    } else {
      var type = ch.t === "date" ? "date" : "text";
      h += '<input type="' + type + '" id="' + id + '" data-ch="' + ch.c + '" value="' + ech(valeur) + '"' +
        (ch.t === "num" ? ' inputmode="numeric"' : "") +
        (ch.maj ? ' style="text-transform:uppercase"' : "") + ">";
    }
    return h + "</label>";
  }

  function brancher(cadre, prefixe, lit, ecrit) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-ch]"), function (el) {
      var quand = (el.tagName === "SELECT" || el.type === "date") ? "change" : "input";
      el.addEventListener(quand, function () {
        var o = lit(), c = el.getAttribute("data-ch");
        var v = el.value;
        if (c === "immat") v = v.toUpperCase();
        o[c] = v;
        ecrit(o);
        rendre();
      });
    });
  }

  /* ─────────────────────────────── les écrans ───────────────────────────── */

  var ouvert = {};           /* les fiches dépliées, par identifiant         */

  function rendreVehicules() {
    var L = vehicules(), hote = $("vehicules");
    if (!L.length) {
      hote.innerHTML = '<p class="rien">Aucun véhicule. Le bouton ci-dessus en ajoute un : ' +
        "il suffit de l'immatriculation pour commencer.</p>";
      return;
    }
    hote.innerHTML = L.map(function (v) {
      var E = echeancesVehicule(v), p = pire(E);
      var genre = "";
      GENRES.forEach(function (g) { if (g[0] === v.genre) genre = g[1]; });
      var sous = [genre, v.marque, v.km ? v.km + " km" : ""].filter(Boolean).join(" · ");
      var est = !!ouvert["v" + v.id];
      return '<div class="carte-v' + (p === "passe" ? " urgent" : "") + '" data-v="' + ech(v.id) + '">' +
        '<div class="tt" data-plier="v' + ech(v.id) + '">' +
        '<span class="nom">' + ech(v.immat || "Immatriculation à saisir") +
        '<span class="sous">' + ech(sous || "à compléter") + "</span></span>" +
        '<span class="fl">' + (est ? "&#8963;" : "&#8964;") + "</span></div>" +
        '<div class="ech">' + pastilles(E) + "</div>" +
        (est ? '<div class="corps"><div class="gr">' +
          CHAMPS_V.map(function (ch) {
            var val = v[ch.c];
            if (val == null || val === "") {
              if (ch.c === "ctMois") val = CT_DEFAUT[v.genre] || 12;
              if (ch.c === "limMois") val = 24;
              if (ch.c === "chronoMois") val = 24;
            }
            return champHtml(ch, val, "v" + v.id);
          }).join("") +
          '</div><div class="actions">' +
          '<button type="button" class="second" data-sup="' + ech(v.id) + '">Retirer ce véhicule</button>' +
          "</div></div>" : "") +
        "</div>";
    }).join("");

    L.forEach(function (v) {
      var cadre = hote.querySelector('[data-v="' + v.id + '"]');
      if (!cadre || !ouvert["v" + v.id]) return;
      brancher(cadre, "v" + v.id,
        function () {
          var T = vehicules(), o = null;
          T.forEach(function (x) { if (x.id === v.id) o = x; });
          return o || v;
        },
        function (o) {
          var T = vehicules();
          garderVehicules(T.map(function (x) { return x.id === o.id ? o : x; }));
        });
    });
  }

  function rendreConducteurs() {
    var G = salaries(), hote = $("conducteurs");
    $("con-vide").hidden = !!G.length;
    if (!G.length) { hote.innerHTML = ""; return; }
    hote.innerHTML = G.map(function (s) {
      var f = fiche(s.id), E = echeancesConducteur(f), p = pire(E);
      var est = !!ouvert["c" + s.id];
      var sous = [s.emp, f.permisCat ? "permis " + f.permisCat : ""].filter(Boolean).join(" · ");
      return '<div class="carte-v' + (p === "passe" ? " urgent" : "") + '" data-c="' + ech(s.id) + '">' +
        '<div class="tt" data-plier="c' + ech(s.id) + '">' +
        '<span class="nom">' + ech(s.nom) +
        '<span class="sous">' + ech(sous || "à compléter") + "</span></span>" +
        '<span class="fl">' + (est ? "&#8963;" : "&#8964;") + "</span></div>" +
        '<div class="ech">' + pastilles(E) + "</div>" +
        (est ? '<div class="corps"><div class="gr">' +
          CHAMPS_C.map(function (ch) {
            var val = f[ch.c];
            if ((val == null || val === "") && ch.c === "fcoMois") val = 60;
            return champHtml(ch, val, "c" + s.id);
          }).join("") + "</div></div>" : "") +
        "</div>";
    }).join("");

    G.forEach(function (s) {
      var cadre = hote.querySelector('[data-c="' + s.id + '"]');
      if (!cadre || !ouvert["c" + s.id]) return;
      brancher(cadre, "c" + s.id,
        function () { return fiche(s.id); },
        function (o) { garderFiche(s.id, o); });
    });
  }

  function rendreCompte() {
    var n = { passe: 0, rouge: 0, ambre: 0 };
    vehicules().forEach(function (v) {
      echeancesVehicule(v).forEach(function (e) { if (n[e.etat] !== undefined) n[e.etat]++; });
    });
    salaries().forEach(function (s) {
      echeancesConducteur(fiche(s.id)).forEach(function (e) { if (n[e.etat] !== undefined) n[e.etat]++; });
    });
    var h = "";
    if (n.passe) h += '<span class="c rouge">' + n.passe + " dépassée" + (n.passe > 1 ? "s" : "") + "</span>";
    if (n.rouge) h += '<span class="c rouge">' + n.rouge + " dans les 30 jours</span>";
    if (n.ambre) h += '<span class="c ambre">' + n.ambre + " dans les 60 jours</span>";
    if (!h) h = '<span class="c vert">Aucune échéance proche</span>';
    h += '<span class="c">' + vehicules().length + " véhicule" + (vehicules().length > 1 ? "s" : "") + "</span>";
    $("compte").innerHTML = h;
  }

  function rendre() {
    rendreCompte();
    rendreVehicules();
    rendreConducteurs();
  }

  /* ──────────────────────────────── le classeur ─────────────────────────── */

  function classeur() {
    if (!window.TableurExport) return;
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    p = p || {};

    var V = [["Immatriculation", "Genre", "Marque et modèle", "1re mise en circulation",
      "Kilométrage", "Relevé le", "Dernier contrôle technique", "Prochain contrôle",
      "Prochain limiteur", "Prochain chronotachygraphe", "Assurance", "Copie conforme",
      "Prochaine révision", "Extincteur", "Observations"]];
    vehicules().forEach(function (v) {
      var genre = "";
      GENRES.forEach(function (g) { if (g[0] === v.genre) genre = g[1]; });
      V.push([
        v.immat || "", genre, v.marque || "", enFrancais(v.mec), v.km || "", enFrancais(v.kmLe),
        enFrancais(v.ct), enFrancais(v.ct ? plusMois(v.ct, v.ctMois || CT_DEFAUT[v.genre] || 12) : ""),
        enFrancais(v.lim ? plusMois(v.lim, v.limMois || 24) : ""),
        enFrancais(v.chrono ? plusMois(v.chrono, v.chronoMois || 24) : ""),
        enFrancais(v.assur), enFrancais(v.licenceFin),
        enFrancais(v.revision) || (v.revisionKm ? v.revisionKm + " km" : ""),
        enFrancais(v.extincteur), v.note || "",
      ]);
    });
    if (V.length === 1) V.push(V[0].map(function () { return ""; }));

    var C = [["Conducteur", "Emploi", "Permis", "Catégories", "Validité du permis", "Points",
      "Suspension jusqu'au", "Dernière FCO", "Prochaine FCO", "Carte conducteur",
      "Carte de qualification", "Visite du permis", "Suivi médical",
      "Dernière visite", "Prochaine visite", "Véhicule", "Observations"]];
    var parId = {};
    vehicules().forEach(function (v) { parId[v.id] = v.immat || ""; });
    salaries().forEach(function (s) {
      var f = fiche(s.id), suivi = "";
      SUIVIS.forEach(function (o) { if (o[0] === f.suivi) suivi = o[1]; });
      var prochaine = "";
      if (f.suivi === "vip" && f.visiteTravail) prochaine = plusMois(f.visiteTravail, 60);
      if (f.suivi === "sir" && f.visiteTravail) prochaine = plusMois(f.visiteTravail, 48);
      C.push([
        s.nom, s.emp, f.permisNum || "", f.permisCat || "", enFrancais(f.permisFin),
        f.points == null ? "" : f.points, enFrancais(f.retraitFin), enFrancais(f.fco),
        enFrancais(f.fco ? plusMois(f.fco, f.fcoMois || 60) : ""),
        enFrancais(f.carteCond), enFrancais(f.carteQualif), enFrancais(f.visitePermisFin),
        suivi, enFrancais(f.visiteTravail), enFrancais(prochaine),
        parId[f.vehicule] || "", f.note || "",
      ]);
    });
    if (C.length === 1) C.push(C[0].map(function () { return ""; }));

    var alertes = [["Échéance", "Qui ou quoi", "Date", "Où l'on en est"]];
    vehicules().forEach(function (v) {
      echeancesVehicule(v).forEach(function (e) {
        if (e.etat !== "passe" && e.etat !== "rouge" && e.etat !== "ambre") return;
        alertes.push([e.quoi, v.immat || "", e.km ? "" : enFrancais(e.date),
          e.km ? (e.reste < 0 ? "dépassée de " + (-e.reste) + " km" : "dans " + e.reste + " km") : dit(e.jours)]);
      });
    });
    salaries().forEach(function (s) {
      echeancesConducteur(fiche(s.id)).forEach(function (e) {
        if (e.etat !== "passe" && e.etat !== "rouge" && e.etat !== "ambre") return;
        alertes.push([e.quoi, s.nom, e.points ? "" : enFrancais(e.date),
          e.points ? e.valeur + " points restants" : dit(e.jours)]);
      });
    });
    if (alertes.length === 1) alertes.push(["Aucune échéance dépassée ni proche", "", "", ""]);

    var nom = "flotte-et-conducteurs-" + iso(new Date()) + ".xlsx";
    window.TableurExport.telecharger(window.TableurExport.xlsx([
      { titre: "Véhicules", lignes: V },
      { titre: "Conducteurs", lignes: C },
      { titre: "À surveiller", lignes: alertes, largeurs: [28, 30, 22, 26] },
      { titre: "Mode d'emploi", lignes: [
        ["Flotte et conducteurs"],
        ["Entreprise", p.denomination || ""],
        ["Édité le", new Date().toLocaleDateString("fr-FR")],
        [],
        ["Les périodicités du contrôle technique, du limiteur, du chronotachygraphe et des titres " +
         "de conduite relèvent du code de la route et de la réglementation des transports : " +
         "l'application ne les affirme pas, elle reprend les dates que vous avez saisies."],
        ["Le suivi médical du travail suit le code du travail : visite d'information et de prévention " +
         "dans les trois mois de la prise de poste (R. 4624-10), renouvelée tous les cinq ans au plus " +
         "(R. 4624-16) ; sur un poste à risques particuliers, suivi individuel renforcé tous les quatre " +
         "ans au plus, avec une visite intermédiaire deux ans au plus tard (R. 4624-22, R. 4624-28)."],
      ], largeurs: [26, 80] },
    ]), nom);
  }

  /* ──────────────────────────────── branchements ────────────────────────── */

  function demarrer() {
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    if ($("ent")) $("ent").textContent = (p && p.denomination) || "";

    $("o-veh").addEventListener("click", function () { onglet(true); });
    $("o-con").addEventListener("click", function () { onglet(false); });
    function onglet(veh) {
      $("o-veh").setAttribute("aria-selected", veh ? "true" : "false");
      $("o-con").setAttribute("aria-selected", veh ? "false" : "true");
      $("e-veh").hidden = !veh;
      $("e-con").hidden = veh;
      window.scrollTo(0, 0);
    }

    $("v-ajouter").addEventListener("click", function () {
      var L = vehicules();
      var id = "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      L.push({ id: id, immat: "", genre: "pl", ctMois: CT_DEFAUT.pl, limMois: 24, chronoMois: 24 });
      garderVehicules(L);
      ouvert["v" + id] = true;
      rendre();
      var e = document.getElementById("v" + id + "-immat");
      if (e) { e.focus(); e.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });

    /* Un seul écouteur pour tout l'écran : les fiches se redessinent sans
       cesse, des écouteurs posés sur chaque titre disparaîtraient avec elles. */
    document.addEventListener("click", function (ev) {
      var t = ev.target.closest ? ev.target.closest("[data-plier]") : null;
      if (t) {
        var cle = t.getAttribute("data-plier");
        ouvert[cle] = !ouvert[cle];
        rendre();
        return;
      }
      var s = ev.target.closest ? ev.target.closest("[data-sup]") : null;
      if (s) {
        var id = s.getAttribute("data-sup");
        var L = vehicules(), v = null;
        L.forEach(function (x) { if (x.id === id) v = x; });
        if (!window.confirm("Retirer " + ((v && v.immat) || "ce véhicule") + " du fichier ?")) return;
        garderVehicules(L.filter(function (x) { return x.id !== id; }));
        delete ouvert["v" + id];
        rendre();
      }
    });

    $("b-excel").addEventListener("click", classeur);
    $("b-heures").addEventListener("click", function () { window.location.href = "heures.html"; });

    rendre();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
