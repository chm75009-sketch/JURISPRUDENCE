/* LES SINISTRES DU PARC.

   Volet 5 de la gestion de parc (modèle FleetNote / Avrios, demande du
   10 novembre 2026). On déclare un sinistre par véhicule : sa date, son type
   (pris dans les paramètres du parc), le conducteur, le coût estimé et le
   statut, en cours ou clos. Le tableau de bord en tire le nombre de sinistres
   en cours.

   Tout est gardé sur le poste, dans « parc-sinistres ». Rien ne s'efface sur un
   seul geste : une suppression demande confirmation. */

"use strict";
(function (window, document) {

  var CLE = "parc-sinistres";
  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lire(c, d) { try { return JSON.parse(window.localStorage.getItem(c) || "null") || d; } catch (e) { return d; } }
  function garder(c, v) { try { window.localStorage.setItem(c, JSON.stringify(v)); } catch (e) {} }
  function net(v) { return String(v == null ? "" : v).trim(); }
  function sinistres() { return lire(CLE, []); }
  function garderS(L) { garder(CLE, L); }

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
    "septembre", "octobre", "novembre", "décembre"];
  function enFrancais(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(iso)); if (!m) return "";
    var j = parseInt(m[3], 10); return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function euros(n) {
    var x = parseFloat(String(n == null ? "" : n).replace(/\s/g, "").replace(",", ".")); if (!isFinite(x)) x = 0;
    var s = (Math.round(x * 100) / 100).toFixed(2).replace(".", ","); var p = s.split(",");
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return p.join(",") + " €";
  }

  function vehicules() { return lire("flotte-vehicules", []); }
  function parcListe(key) {
    try {
      if (window.ParcParametres && window.ParcParametres.lire) { var e = window.ParcParametres.lire(); return (e && e[key]) || []; }
      var j = JSON.parse(window.localStorage.getItem("parc-parametres") || "null"); return (j && j[key]) || [];
    } catch (e) { return []; }
  }
  function salaries() {
    var r = lire("registre-personnel", {});
    return ((r && r.salaries) || []).filter(function (s) { return net(s.nom) || net(s.pre); })
      .map(function (s) { return (net(s.nom) + " " + net(s.pre)).trim(); });
  }

  var STATUTS = ["En cours", "Clos"];

  function champ(ch, valeur, pref) {
    var id = pref + "-" + ch.c, v = net(valeur);
    var h = '<label' + (ch.large ? ' class="large"' : "") + '><span>' + ech(ch.lib) + "</span>";
    function sel(opts, blanc) {
      return '<select id="' + id + '" data-ch="' + ch.c + '">' +
        (blanc ? '<option value="">' + ech(blanc) + "</option>" : "") +
        opts.map(function (o) { return '<option value="' + ech(o) + '"' + (o === v ? " selected" : "") + ">" + ech(o) + "</option>"; }).join("") +
        "</select>";
    }
    if (ch.t === "vehicule") h += sel(vehicules().map(function (x) { return x.immat || "sans immatriculation"; }), "- véhicule -");
    else if (ch.t === "salarie") h += sel(salaries(), "- conducteur -");
    else if (ch.t === "parc") h += sel(parcListe(ch.parc), "- à préciser -");
    else if (ch.t === "statut") h += sel(STATUTS, "");
    else if (ch.t === "textarea") h += '<textarea id="' + id + '" data-ch="' + ch.c + '">' + ech(valeur) + "</textarea>";
    else h += '<input type="' + (ch.t === "date" ? "date" : "text") + '" id="' + id + '" data-ch="' + ch.c + '" value="' + ech(valeur) + '"' + (ch.t === "dec" ? ' inputmode="decimal"' : "") + ">";
    return h + "</label>";
  }

  var CHAMPS = [
    { c: "date", lib: "Date du sinistre", t: "date" },
    { c: "vehicule", lib: "Véhicule", t: "vehicule" },
    { c: "type", lib: "Type de sinistre", t: "parc", parc: "typeSinistre" },
    { c: "conducteur", lib: "Conducteur", t: "salarie" },
    { c: "montant", lib: "Coût estimé, en euros", t: "dec" },
    { c: "statut", lib: "Statut", t: "statut" },
    { c: "note", lib: "Description et circonstances", t: "textarea", large: true },
  ];

  var ouvert = {};

  function rendre() {
    var L = sinistres();
    var enCours = L.filter(function (s) { return (s.statut || "En cours") === "En cours"; }).length;
    var clos = L.length - enCours;
    var cout = L.reduce(function (t, s) { var x = parseFloat(String(s.montant || "").replace(/\s/g, "").replace(",", ".")); return t + (isFinite(x) ? x : 0); }, 0);
    $("compte").innerHTML = '<div class="tiles">' +
      '<div class="tile rouge"><div class="v">' + enCours + '</div><div class="l">En cours</div></div>' +
      '<div class="tile"><div class="v">' + clos + '</div><div class="l">Clos</div></div>' +
      '<div class="tile"><div class="v">' + ech(euros(cout)) + '</div><div class="l">Coût cumulé</div></div></div>';

    var hote = $("liste");
    if (!L.length) { hote.innerHTML = '<p class="rien">Aucun sinistre déclaré. Le bouton ci-dessus en ajoute un.</p>'; return; }
    hote.innerHTML = L.map(function (s, i) {
      var est = !!ouvert[i];
      var statut = s.statut || "En cours";
      var sous = [s.vehicule, s.type, s.montant ? euros(s.montant) : ""].filter(Boolean).join(" · ");
      return '<div class="carte-s" data-i="' + i + '">' +
        '<div class="tt" data-plier="' + i + '"><span class="nom">' + ech(s.date ? enFrancais(s.date) : "Sans date") +
        '<span class="sous">' + ech(sous || "à compléter") + "</span></span>" +
        '<span class="st ' + (statut === "Clos" ? "clos" : "cours") + '">' + ech(statut) + "</span></div>" +
        (est ? '<div class="corps"><div class="gr">' + CHAMPS.map(function (ch) { return champ(ch, s[ch.c], "s" + i); }).join("") + "</div>" +
          '<div class="actions"><button type="button" class="lien" data-sup="' + i + '">Supprimer ce sinistre</button></div></div>' : "") +
        "</div>";
    }).join("");

    L.forEach(function (s, i) {
      if (!ouvert[i]) return;
      var cadre = hote.querySelector('[data-i="' + i + '"]');
      if (!cadre) return;
      Array.prototype.forEach.call(cadre.querySelectorAll("[data-ch]"), function (el) {
        var quand = (el.tagName === "SELECT" || el.type === "date") ? "change" : "input";
        el.addEventListener(quand, function () {
          var T = sinistres(); if (!T[i]) return; T[i][el.getAttribute("data-ch")] = el.value; garderS(T);
          if (el.getAttribute("data-ch") === "statut" || el.getAttribute("data-ch") === "vehicule" ||
            el.getAttribute("data-ch") === "type" || el.getAttribute("data-ch") === "montant") rendre();
        });
      });
    });
  }

  function demarrer() {
    if (!$("liste")) return;
    var p = null;
    try { p = (window.Profil && window.Profil.lire) ? window.Profil.lire() : lire("profil-entreprise", {}); } catch (e) { p = {}; }
    if ($("ent")) $("ent").textContent = (p && p.denomination) || "";

    $("ajouter").addEventListener("click", function () {
      var L = sinistres(); L.unshift({ date: iso(new Date()), statut: "En cours" }); garderS(L);
      ouvert = { 0: true }; rendre();
      window.scrollTo(0, 0);
    });

    document.addEventListener("click", function (ev) {
      var t = ev.target.closest ? ev.target.closest("[data-plier]") : null;
      if (t) { var k = t.getAttribute("data-plier"); ouvert[k] = !ouvert[k]; rendre(); return; }
      var s = ev.target.closest ? ev.target.closest("[data-sup]") : null;
      if (s) {
        if (!window.confirm("Supprimer ce sinistre ? Cette action ne se rattrape pas.")) return;
        var L = sinistres(); L.splice(parseInt(s.getAttribute("data-sup"), 10), 1); garderS(L); ouvert = {}; rendre();
      }
    });

    rendre();
  }

  /* Ce que le tableau de bord lit. */
  window.ParcSinistres = {
    enCours: function () { return sinistres().filter(function (s) { return (s.statut || "En cours") === "En cours"; }).length; },
    total: function () { return sinistres().length; },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
