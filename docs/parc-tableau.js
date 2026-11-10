/* LE TABLEAU DE BORD DU PARC.

   Le volet 6 de la gestion de parc (demande du 10 novembre 2026, modèle
   Avrios) : la synthèse que l'on voit en arrivant. Rien n'est inventé, tout
   est tiré des véhicules et de leurs échéances déjà saisis.

     Structure     combien de véhicules, de conducteurs, et leur répartition
                   par genre, en anneau.
     Surveillance  les échéances dépassées, puis à trente et soixante jours,
                   et les plus proches, nommées.
     Coûts         le total dépensé en entretien, la moyenne par véhicule, le
                   nombre d'interventions.

   Les consommations de carburant et le CO2 du modèle Avrios ne figurent pas :
   ils viennent de boîtiers que l'entreprise n'a pas, et un chiffre inventé ne
   vaut rien. */

"use strict";
(function (window, document) {

  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lire(c, d) {
    try { return JSON.parse(window.localStorage.getItem(c) || "null") || d; } catch (e) { return d; }
  }
  function net(v) { return String(v == null ? "" : v).trim(); }
  function fnum(x) { var n = parseFloat(String(x == null ? "" : x).replace(/\s/g, "").replace(",", ".")); return isFinite(n) ? n : 0; }
  function euros(n) {
    var s = (Math.round(n * 100) / 100).toFixed(2).replace(".", ",");
    var p = s.split(","); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return p.join(",") + " €";
  }
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
    "septembre", "octobre", "novembre", "décembre"];
  function enFrancais(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(iso)); if (!m) return "";
    var j = parseInt(m[3], 10); return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function moisDepuis(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(iso)); if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]), n = new Date();
    var mo = (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth());
    return mo >= 0 ? mo : null;
  }
  function entier(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function ageTexte(mois) {
    if (mois == null) return "-";
    var a = Math.floor(mois / 12), m = mois % 12;
    if (a <= 0) return m + " mois";
    if (m === 0) return a + " an" + (a > 1 ? "s" : "");
    return a + " an" + (a > 1 ? "s" : "") + " " + m + " mois";
  }

  var GENRES = { vl: "Voiture", vul: "Utilitaire léger", pl: "Poids lourd", tracteur: "Tracteur",
    remorque: "Remorque", public10: "Transport de personnes", commun: "Transport en commun", autre: "Autre" };
  /* Une palette stable et lisible, la même en clair et en sombre. */
  var COULEURS = ["#4e79a7", "#f28e2b", "#59a14f", "#e15759", "#76b7b2", "#edc948", "#b07aa1", "#9c755f"];

  function vehicules() { return lire("flotte-vehicules", []); }
  function conducteursNoms() {
    var r = lire("registre-personnel", {});
    return ((r && r.salaries) || []).filter(function (s) { return !net(s.sor) && (net(s.nom) || net(s.pre)); });
  }
  function coutInter(it) {
    return fnum(it.heures) * fnum(it.taux) + fnum(it.pieces) + fnum(it.sous);
  }

  /* ─────────────────────────── la structure ─────────────────────────────── */

  function tile(valeur, libelle, classe) {
    return '<div class="tile ' + (classe || "") + '"><div class="v">' + ech(valeur) + "</div>" +
      '<div class="l">' + ech(libelle) + "</div></div>";
  }

  function anneau(parGenre) {
    var total = parGenre.reduce(function (s, g) { return s + g.n; }, 0);
    if (!total) return '<p class="rien">Aucun véhicule enregistré.</p>';
    var R = 54, r = 32, cx = 70, cy = 70, a = -Math.PI / 2, tour = Math.PI * 2;
    var arcs = parGenre.map(function (g, i) {
      var frac = g.n / total, a2 = a + frac * tour;
      var x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a);
      var x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
      var xi2 = cx + r * Math.cos(a2), yi2 = cy + r * Math.sin(a2);
      var xi1 = cx + r * Math.cos(a), yi1 = cy + r * Math.sin(a);
      var grand = frac > 0.5 ? 1 : 0;
      a = a2;
      /* Un seul genre : un anneau plein, sans arc dégénéré. */
      if (frac >= 0.999) {
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + ((R + r) / 2) + '" fill="none" stroke="' +
          COULEURS[i % COULEURS.length] + '" stroke-width="' + (R - r) + '"></circle>';
      }
      return '<path d="M' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A' + R + ' ' + R + ' 0 ' + grand + ' 1 ' +
        x2.toFixed(2) + ' ' + y2.toFixed(2) + ' L' + xi2.toFixed(2) + ' ' + yi2.toFixed(2) +
        ' A' + r + ' ' + r + ' 0 ' + grand + ' 0 ' + xi1.toFixed(2) + ' ' + yi1.toFixed(2) + ' Z" fill="' +
        COULEURS[i % COULEURS.length] + '"></path>';
    }).join("");
    var legende = parGenre.map(function (g, i) {
      return '<div class="lg"><span class="pt" style="background:' + COULEURS[i % COULEURS.length] + '"></span>' +
        '<span class="nm">' + ech(g.lib) + "</span><span class=\"nb\">" + g.n + "</span></div>";
    }).join("");
    return '<div class="donut"><svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">' + arcs +
      '<text x="70" y="66" text-anchor="middle" class="d-n">' + total + "</text>" +
      '<text x="70" y="82" text-anchor="middle" class="d-l">véhicules</text></svg>' +
      '<div class="legende">' + legende + "</div></div>";
  }

  /* ─────────────────────────── la surveillance ──────────────────────────── */

  function echeances() {
    if (window.Flotte && window.Flotte.echeances) {
      try { return window.Flotte.echeances() || []; } catch (e) { return []; }
    }
    return [];
  }

  function rendre() {
    var V = vehicules(), C = conducteursNoms();

    /* Vue d'ensemble : les grandeurs moyennes du parc, celles que l'on peut
       calculer sans boîtier télématique. */
    var kms = V.map(function (v) { return fnum(v.km); }).filter(function (k) { return k > 0; });
    var kmMoyen = kms.length ? kms.reduce(function (s, k) { return s + k; }, 0) / kms.length : 0;
    var ages = V.map(function (v) { return moisDepuis(v.mec || v.dateAchat); }).filter(function (m) { return m != null; });
    var ageMoyen = ages.length ? ages.reduce(function (s, m) { return s + m; }, 0) / ages.length : null;
    $("vue").innerHTML = '<div class="tiles">' +
      tile(V.length, "Véhicules") +
      tile(C.length, "Conducteurs") +
      tile(kms.length ? entier(kmMoyen) + " km" : "-", "Kilométrage moyen") +
      tile(ages.length ? ageTexte(Math.round(ageMoyen)) : "-", "Âge moyen du parc") + "</div>";

    /* Structure */
    var parG = {};
    V.forEach(function (v) { var g = net(v.genre) || "autre"; parG[g] = (parG[g] || 0) + 1; });
    var liste = Object.keys(parG).map(function (g) { return { lib: GENRES[g] || "Autre", n: parG[g] }; })
      .sort(function (a, b) { return b.n - a.n; });
    $("structure").innerHTML = anneau(liste);

    /* Surveillance */
    var E = echeances().filter(function (e) { return e.date; });
    var nPasse = E.filter(function (e) { return e.etat === "passe"; }).length;
    var nRouge = E.filter(function (e) { return e.etat === "rouge"; }).length;
    var nAmbre = E.filter(function (e) { return e.etat === "ambre"; }).length;
    var aSurveiller = E.filter(function (e) { return e.etat === "passe" || e.etat === "rouge" || e.etat === "ambre"; });
    var prochaines = aSurveiller.slice().sort(function (a, b) {
      return (a.jours == null ? 1e9 : a.jours) - (b.jours == null ? 1e9 : b.jours);
    }).slice(0, 8);
    /* Les alertes par type, comme le « Alertes du parc » du modèle : combien de
       contrôles techniques, d'assurances, de licences à traiter. */
    var parType = {};
    aSurveiller.forEach(function (e) { parType[e.quoi] = (parType[e.quoi] || 0) + 1; });
    var typeList = Object.keys(parType).sort(function (a, b) { return parType[b] - parType[a]; });
    var alertesHtml = typeList.length ? '<div class="alertes">' + typeList.map(function (q) {
      return '<div class="al-l chaud"><span class="n">' + parType[q] + '</span><span class="t">' + ech(q) + "</span></div>";
    }).join("") + "</div>" : "";
    var ligne = prochaines.map(function (e) {
      var dit = e.jours < 0 ? "dépassée de " + (-e.jours) + " j" : (e.jours === 0 ? "aujourd'hui" : "dans " + e.jours + " j");
      return '<div class="surv-l ' + e.etat + '"><span class="q"><b>' + ech(e.quoi) + "</b> " + ech(e.qui) + "</span>" +
        '<span class="rt"><span class="d">' + ech(enFrancais(e.date)) + "</span>" +
        '<span class="j">' + ech(dit) + "</span></span></div>";
    }).join("");
    $("surveillance").innerHTML =
      '<div class="tiles">' + tile(nPasse, "Dépassées", "rouge") + tile(nRouge, "Sous 30 jours", "rouge") +
      tile(nAmbre, "Sous 60 jours", "ambre") + "</div>" + alertesHtml +
      (prochaines.length ? '<div class="surv">' + ligne + "</div>"
        : '<p class="ok">Aucune échéance dépassée ni proche.</p>');

    /* Coûts */
    var total = 0, nbInt = 0, avecCout = 0;
    V.forEach(function (v) {
      var L = v.interventions || [];
      if (L.length) { avecCout++; }
      L.forEach(function (it) { total += coutInter(it); nbInt++; });
    });
    var moyen = V.length ? total / V.length : 0;
    $("couts").innerHTML = '<div class="tiles">' +
      tile(euros(total), "Total entretien") + tile(euros(moyen), "Moyenne par véhicule") +
      tile(nbInt, "Intervention" + (nbInt > 1 ? "s" : "")) + "</div>" +
      (nbInt ? "" : '<p class="rien">Aucune intervention enregistrée. Ajoutez-les sur la fiche de chaque véhicule.</p>');

    /* Sinistres */
    var S = lire("parc-sinistres", []);
    var sCours = S.filter(function (s) { return (s.statut || "En cours") === "En cours"; }).length;
    $("sinistres").innerHTML = '<div class="tiles">' +
      tile(sCours, "En cours", sCours ? "rouge" : "") + tile(S.length - sCours, "Clos") + tile(S.length, "Total") + "</div>" +
      (S.length ? "" : '<p class="rien">Aucun sinistre déclaré. Déclarez-les depuis le bouton « Sinistres ».</p>');
  }

  function demarrer() {
    if (!$("structure")) return;
    var p = null;
    try { p = (window.Profil && window.Profil.lire) ? window.Profil.lire() : lire("profil-entreprise", {}); }
    catch (e) { p = {}; }
    if ($("ent")) $("ent").textContent = (p && p.denomination) || "";
    rendre();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
