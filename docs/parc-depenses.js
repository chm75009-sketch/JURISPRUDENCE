/* LES DÉPENSES DU PARC.

   Le détail de l'entretien, pour tout le parc, sur sa propre page. Le tableau
   de bord ne fait que résumer ; ici on voit chaque intervention, et on filtre
   par camion. Demande du 10 novembre 2026 : « si 20 camions concernés on aura
   une liste sans fin » sur le tableau de bord. La liste longue vit donc ici,
   pas sur l'accueil.

   Rien ne se saisit sur cette page : les interventions se créent et se
   modifient sur la fiche de chaque véhicule. Ici, on lit et on filtre. */

"use strict";
(function (window, document) {

  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lire(c, d) { try { return JSON.parse(window.localStorage.getItem(c) || "null") || d; } catch (e) { return d; } }
  function net(v) { return String(v == null ? "" : v).trim(); }
  function fnum(x) { var n = parseFloat(String(x == null ? "" : x).replace(/\s/g, "").replace(",", ".")); return isFinite(n) ? n : 0; }
  function euros(n) {
    var s = (Math.round(n * 100) / 100).toFixed(2).replace(".", ","); var p = s.split(",");
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); return p.join(",") + " €";
  }
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
    "septembre", "octobre", "novembre", "décembre"];
  function enFrancais(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(iso)); if (!m) return "";
    var j = parseInt(m[3], 10); return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function coutInter(it) { return fnum(it.heures) * fnum(it.taux) + fnum(it.pieces) + fnum(it.sous); }

  var filtre = "";   /* immatriculation choisie, ou "" pour tout le parc */

  function toutes() {
    var out = [];
    lire("flotte-vehicules", []).forEach(function (v) {
      (v.interventions || []).forEach(function (it) {
        out.push({ immat: v.immat || "sans immatriculation", date: it.date, objet: it.objet,
          par: it.par, cout: coutInter(it) });
      });
    });
    out.sort(function (a, b) { return net(b.date).localeCompare(net(a.date)); });
    return out;
  }

  function rendre() {
    var L = toutes();
    var immats = {};
    L.forEach(function (x) { immats[x.immat] = true; });
    var listeImmats = Object.keys(immats).sort();

    var vis = filtre ? L.filter(function (x) { return x.immat === filtre; }) : L;
    var total = vis.reduce(function (t, x) { return t + x.cout; }, 0);

    /* Le filtre par véhicule. */
    $("filtre").innerHTML = '<label><span>Véhicule</span><select id="f-veh">' +
      '<option value="">Tout le parc</option>' +
      listeImmats.map(function (im) { return '<option value="' + ech(im) + '"' + (im === filtre ? " selected" : "") + ">" + ech(im) + "</option>"; }).join("") +
      "</select></label>";
    $("f-veh").addEventListener("change", function () { filtre = this.value; rendre(); });

    $("compte").innerHTML = '<div class="tiles">' +
      '<div class="tile"><div class="v">' + vis.length + '</div><div class="l">Intervention' + (vis.length > 1 ? "s" : "") + "</div></div>" +
      '<div class="tile"><div class="v">' + ech(euros(total)) + '</div><div class="l">Total</div></div></div>';

    if (!vis.length) {
      $("liste").innerHTML = '<p class="rien">Aucune intervention ' + (filtre ? "pour ce véhicule" : "enregistrée") +
        '. Elles se créent sur la fiche de chaque véhicule.</p>';
      return;
    }
    $("liste").innerHTML = '<div class="dl">' + vis.map(function (x) {
      var bas = [x.objet || "Intervention", x.par].filter(Boolean).join(" · ");
      /* UN CLIC OUVRE LA FICHE DU VÉHICULE, SUR SON ENTRETIEN. La ligne mène à
         la liste des véhicules, filtrée sur l'immatriculation, fiche dépliée sur
         l'onglet Entretien. Un véhicule sans immatriculation n'a pas de fiche à
         ouvrir : il reste une ligne simple. */
      var ouvrable = x.immat && x.immat !== "sans immatriculation";
      var dedans = '<span class="q"><b>' + ech(x.immat) + "</b>" +
        '<span class="sb">' + ech(bas) + "</span></span>" +
        '<span class="rt"><span class="d">' + ech(x.date ? enFrancais(x.date) : "") + "</span>" +
        '<span class="m">' + ech(euros(x.cout)) + "</span></span>";
      if (!ouvrable) return '<div class="dl-l">' + dedans + "</div>";
      return '<a class="dl-l lien-fiche" href="flotte.html?immat=' +
        encodeURIComponent(x.immat) + '&tab=entretien">' + dedans +
        '<span class="chev" aria-hidden="true">&#8250;</span></a>';
    }).join("") + "</div>";
  }

  function demarrer() {
    if (!$("liste")) return;
    var p = null;
    try { p = (window.Profil && window.Profil.lire) ? window.Profil.lire() : lire("profil-entreprise", {}); } catch (e) { p = {}; }
    if ($("ent")) $("ent").textContent = (p && p.denomination) || "";
    rendre();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
