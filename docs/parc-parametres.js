/* LES PARAMÈTRES DU PARC.

   Premier des sept volets d'une gestion de parc (demande du 10 novembre 2026,
   d'après le modèle montré par l'utilisatrice) : les listes de référence qui
   commandent tout le reste. Type de financement, genre de véhicule, marque,
   type de sinistre, type de dépense, les alertes et leur délai en jours, les
   paliers de maintenance au kilométrage, et les entreprises de maintenance.

   Tout est modifiable : les listes sont pré-remplies pour un transporteur
   poids lourds français, et l'entreprise ajoute, retire, corrige. Rien n'est
   figé dans le code, tout vit dans « parc-parametres », sur le poste.

   Ces listes alimentent ensuite les autres volets : le genre et la marque sur
   la fiche du véhicule, le type de dépense sur une intervention, le délai
   d'alerte sur chaque échéance, le type de sinistre sur une déclaration. */

"use strict";
(function (window, document) {

  var CLE = "parc-parametres";

  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lire() {
    try { return JSON.parse(window.localStorage.getItem(CLE) || "null"); } catch (e) { return null; }
  }
  function garder(v) { try { window.localStorage.setItem(CLE, JSON.stringify(v)); } catch (e) {} }
  function net(v) { return String(v == null ? "" : v).trim(); }

  /* Les valeurs par défaut, pensées pour TEC : un transporteur de marchandises,
     poids lourds et utilitaires, marques du marché français. Elles ne sont
     qu'un point de départ, chacune se change. */
  var DEFAUTS = {
    financement: ["Achat", "Leasing", "Location longue durée", "Location courte durée"],
    typeVehicule: ["Tracteur routier", "Semi-remorque", "Camion porteur", "Camion frigorifique",
      "Camion plateau", "Camion-citerne", "Fourgon", "Fourgonnette", "Véhicule utilitaire léger",
      "Voiture", "Remorque"],
    marque: ["Renault Trucks", "Iveco", "Volvo", "DAF", "MAN", "Scania", "Mercedes-Benz",
      "Fiat", "Peugeot", "Citroën", "Ford"],
    typeSinistre: ["Accident", "Bris de glace", "Vol", "Incendie", "Évènement naturel",
      "Vandalisme", "Dommage au chargement"],
    typeDepense: ["Assurance et taxes", "Carburant", "Lubrifiant", "Maintenance",
      "Pièce de rechange", "Pneumatique", "Réparation", "Vidange", "Carrosserie", "Lavage",
      "Péage", "Contrôle technique"],
    alertes: [
      { nom: "Fin d'assurance", jours: 45 },
      { nom: "Contrôle technique", jours: 30 },
      { nom: "Carte grise", jours: 15 },
      { nom: "Fin de licence, copie conforme", jours: 30 },
      { nom: "Chronotachygraphe", jours: 30 },
      { nom: "Extincteur", jours: 30 },
    ],
    maintenanceKm: [15000, 30000, 45000, 60000, 90000],
    entreprises: [],
  };

  function etat() {
    var e = lire();
    if (!e) { e = JSON.parse(JSON.stringify(DEFAUTS)); garder(e); }
    /* Une clé ajoutée après coup ne doit pas manquer sur un poste déjà rempli. */
    Object.keys(DEFAUTS).forEach(function (k) { if (e[k] === undefined) e[k] = JSON.parse(JSON.stringify(DEFAUTS[k])); });
    return e;
  }

  /* Une liste simple de mots : chaque ligne est un champ, plus un bouton pour
     la retirer, et un bouton pour en ajouter une. */
  function listeSimple(key, titre, aide, placeholder) {
    var e = etat(), L = e[key] || [];
    var h = '<section class="bloc"><h2>' + ech(titre) + "</h2>" +
      (aide ? '<p class="aide">' + ech(aide) + "</p>" : "") + '<div class="lignes">';
    L.forEach(function (v, i) {
      h += '<div class="ligne"><input type="text" data-liste="' + key + '" data-i="' + i +
        '" value="' + ech(v) + '">' +
        '<button type="button" class="retirer" data-sup-liste="' + key + '" data-i="' + i +
        '" aria-label="Retirer">&times;</button></div>';
    });
    h += "</div>" +
      '<button type="button" class="ajouter" data-add-liste="' + key + '">+ Ajouter</button>' +
      "</section>";
    return h;
  }

  /* Les alertes portent un délai : « prévenir X jours avant ». */
  function listeAlertes() {
    var e = etat(), L = e.alertes || [];
    var h = '<section class="bloc"><h2>Alertes et délais</h2>' +
      '<p class="aide">Le nombre de jours avant l\'échéance où l\'alerte passe au rouge. ' +
      "Ces délais commanderont les alertes des véhicules.</p>" +
      '<div class="lignes entete-al"><span>Alerte</span><span>Jours avant</span><span></span></div>' +
      '<div class="lignes">';
    L.forEach(function (a, i) {
      h += '<div class="ligne al"><input type="text" data-al-nom="' + i + '" value="' + ech(a.nom) + '">' +
        '<input type="text" inputmode="numeric" data-al-jours="' + i + '" value="' + ech(a.jours) + '">' +
        '<button type="button" class="retirer" data-sup-al="' + i + '" aria-label="Retirer">&times;</button></div>';
    });
    h += "</div>" +
      '<button type="button" class="ajouter" data-add-al="1">+ Ajouter une alerte</button>' +
      "</section>";
    return h;
  }

  function rendre() {
    var hote = $("corps");
    hote.innerHTML =
      listeSimple("financement", "Type de financement", "Comment le véhicule est détenu.") +
      listeSimple("typeVehicule", "Type de véhicule", "Les genres de votre parc.") +
      listeSimple("marque", "Marque", "Les constructeurs présents dans le parc.") +
      listeSimple("typeDepense", "Type de dépense", "Les postes de coût, pour classer chaque dépense.") +
      listeSimple("typeSinistre", "Type de sinistre", "Pour classer une déclaration de sinistre.") +
      listeAlertes() +
      listeSimple("maintenanceKm", "Paliers de maintenance, en kilomètres",
        "Les kilométrages où une révision est prévue.") +
      listeSimple("entreprises", "Entreprises de maintenance",
        "Vos garages et prestataires, pour les retrouver sur une intervention.");
  }

  function demarrer() {
    if (!$("corps")) return;
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    if ($("ent")) $("ent").textContent = (p && p.denomination) || "";

    rendre();

    document.addEventListener("input", function (ev) {
      var el = ev.target;
      if (!el || !el.hasAttribute) return;
      if (el.hasAttribute("data-liste")) {
        var e = etat(); e[el.getAttribute("data-liste")][parseInt(el.getAttribute("data-i"), 10)] = el.value; garder(e);
        return;
      }
      if (el.hasAttribute("data-al-nom")) {
        var e2 = etat(); e2.alertes[parseInt(el.getAttribute("data-al-nom"), 10)].nom = el.value; garder(e2);
        return;
      }
      if (el.hasAttribute("data-al-jours")) {
        var e3 = etat(); var n = parseInt(String(el.value).replace(/[^0-9]/g, ""), 10);
        e3.alertes[parseInt(el.getAttribute("data-al-jours"), 10)].jours = isFinite(n) ? n : 0; garder(e3);
        return;
      }
    });

    document.addEventListener("click", function (ev) {
      var t = ev.target;
      var add = t.getAttribute && t.getAttribute("data-add-liste");
      if (add) { var e = etat(); e[add].push(""); garder(e); rendre(); focusDernier(add); return; }
      var sup = t.getAttribute && t.getAttribute("data-sup-liste");
      if (sup) { var e2 = etat(); e2[sup].splice(parseInt(t.getAttribute("data-i"), 10), 1); garder(e2); rendre(); return; }
      if (t.getAttribute && t.getAttribute("data-add-al")) {
        var e3 = etat(); e3.alertes.push({ nom: "", jours: 30 }); garder(e3); rendre(); return;
      }
      if (t.hasAttribute && t.hasAttribute("data-sup-al")) {
        var e4 = etat(); e4.alertes.splice(parseInt(t.getAttribute("data-sup-al"), 10), 1); garder(e4); rendre(); return;
      }
    });
  }

  function focusDernier(key) {
    var L = document.querySelectorAll('[data-liste="' + key + '"]');
    if (L.length) { var el = L[L.length - 1]; el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); }
  }

  /* Ce que les autres volets liront. */
  window.ParcParametres = { lire: etat };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
