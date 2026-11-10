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

  var MOIS_AB = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  /* Les coûts d'entretien des douze derniers mois, un seau par mois. */
  function coutsParMois(V) {
    var base = new Date(); base = new Date(base.getFullYear(), base.getMonth(), 1);
    var map = {}, order = [];
    for (var i = 11; i >= 0; i--) {
      var d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      var key = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2);
      map[key] = 0; order.push({ key: key, label: MOIS_AB[d.getMonth()] });
    }
    V.forEach(function (v) {
      (v.interventions || []).forEach(function (it) {
        var m = /^(\d{4})-(\d{2})/.exec(net(it.date)); if (!m) return;
        var key = m[1] + "-" + m[2]; if (key in map) map[key] += coutInter(it);
      });
    });
    return order.map(function (o) { return { label: o.label, v: map[o.key] }; });
  }
  function barres(data) {
    var max = Math.max.apply(null, data.map(function (d) { return d.v; }).concat([1]));
    var bars = data.map(function (d) {
      var h = max > 0 ? Math.round(d.v / max * 100) : 0;
      return '<div class="bc"><div class="bwrap"><div class="bar" style="height:' + h + '%"' +
        (d.v > 0 ? ' title="' + ech(euros(d.v)) + '"' : "") + "></div></div>" +
        '<div class="bl">' + ech(d.label) + "</div></div>";
    }).join("");
    return '<div class="graph"><div class="gt">Coûts de maintenance par mois</div>' +
      '<div class="bars">' + bars + "</div>" +
      '<div class="gmax">Échelle : ' + ech(euros(max)) + " au plus haut, sur les 12 derniers mois</div></div>";
  }

  /* ─────────────────────────── la structure ─────────────────────────────── */

  var ICONS = {
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h12v10H1z"/><path d="M13 8h4l4 4v2h-8V8z"/><circle cx="5" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 12 0v1"/></svg>',
    gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15a9 9 0 1 1 18 0"/><path d="M12 15l4-3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
    euro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 5a7 7 0 1 0 0 14M4 10h8M4 14h7"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-2.5 2.5 2 2L17 7a4 4 0 0 1-5 5l-6 6 3 3 6-6a4 4 0 0 1 5-5z"/></svg>',
  };
  function tile(valeur, libelle, classe, icone) {
    var ic = (icone && ICONS[icone]) ? '<span class="ic">' + ICONS[icone] + "</span>" : "";
    return '<div class="tile ' + (classe || "") + '">' + ic +
      '<div class="tx"><div class="v">' + ech(valeur) + '</div><div class="l">' + ech(libelle) + "</div></div></div>";
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
      tile(V.length, "Véhicules", null, "truck") +
      tile(C.length, "Conducteurs", null, "user") +
      tile(kms.length ? entier(kmMoyen) + " km" : "-", "Kilométrage moyen", null, "gauge") +
      tile(ages.length ? ageTexte(Math.round(ageMoyen)) : "-", "Âge moyen du parc", null, "calendar") + "</div>";

    /* Structure */
    var parG = {};
    V.forEach(function (v) { var g = net(v.genre) || "autre"; parG[g] = (parG[g] || 0) + 1; });
    var liste = Object.keys(parG).map(function (g) { return { lib: GENRES[g] || "Autre", n: parG[g] }; })
      .sort(function (a, b) { return b.n - a.n; });
    $("structure").innerHTML = anneau(liste);

    /* Affectation : un véhicule porte un chauffeur attitré, ou il est libre.
       Les remorques, qui ne se conduisent pas seules, sont mises à part. */
    var roulants = V.filter(function (v) { return v.genre !== "remorque"; });
    var affectes = roulants.filter(function (v) { return net(v.conducteur); }).length;
    var libres = roulants.length - affectes;
    $("affectation").innerHTML = '<div class="tiles">' +
      tile(affectes, "Affectés", affectes ? "vert" : "") +
      tile(libres, "Libres", libres ? "ambre" : "") + "</div>" +
      (V.length > roulants.length ? '<p class="rien">' + (V.length - roulants.length) +
        " remorque" + (V.length - roulants.length > 1 ? "s" : "") + ", comptée" +
        (V.length - roulants.length > 1 ? "s" : "") + " à part.</p>" : "");

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
    /* LE BANDEAU D'ALERTE, EN HAUT, IMPOSSIBLE À MANQUER. */
    var BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10.5 21a1.8 1.8 0 0 0 3 0"/></svg>';
    var bcls = "vert", btxt = "Aucune échéance à traiter, tout est à jour.";
    if (nPasse) { bcls = "rouge"; btxt = nPasse + " échéance" + (nPasse > 1 ? "s" : "") + " dépassée" + (nPasse > 1 ? "s" : "") +
      (nRouge ? ", et " + nRouge + " à traiter d'urgence" : "") + " : à régulariser."; }
    else if (nRouge) { bcls = "rouge"; btxt = nRouge + " échéance" + (nRouge > 1 ? "s" : "") + " à traiter dans les délais d'alerte."; }
    else if (nAmbre) { bcls = "ambre"; btxt = nAmbre + " échéance" + (nAmbre > 1 ? "s" : "") + " à surveiller bientôt."; }
    if ($("banniere")) $("banniere").innerHTML = '<div class="banniere ' + bcls + '">' + BELL + "<span>" + ech(btxt) + "</span></div>";

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
      tile(euros(total), "Total entretien", null, "euro") + tile(euros(moyen), "Moyenne par véhicule", null, "euro") +
      tile(nbInt, "Intervention" + (nbInt > 1 ? "s" : ""), null, "wrench") + "</div>" +
      (nbInt ? barres(coutsParMois(V)) : '<p class="rien">Aucune intervention enregistrée. Ajoutez-les sur la fiche de chaque véhicule.</p>');

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
