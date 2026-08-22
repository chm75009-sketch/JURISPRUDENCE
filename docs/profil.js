/* La fiche client — le tout premier écran du parcours, et la seule source du
   profil d'entreprise partagé par toutes les pages.

   POURQUOI CE FICHIER EXISTE. Trois pages écrivaient ou lisaient la clé
   « profil-entreprise » avec chacune sa liste de champs : les parcours
   guidés l'écrivaient, le générateur de documents et l'audit social la
   lisaient, l'assistant la joignait à son contexte. Personne ne demandait
   l'adresse, le SIRET, le courriel, le responsable ni le téléphone — les
   données qui identifient le client et permettent d'orienter l'application
   vers une interface adaptée à sa taille, à son secteur et à sa convention.

   CE QU'IL GARANTIT. La clé reste la même, les noms de champs existants
   restent les mêmes, et les alias historiques continuent d'être lus
   (« denominationSociale », « entreprise », « nom » pour la dénomination ;
   « convention », « idcc » pour la convention ; « activite » pour le
   secteur). Une page qui lisait le profil avant ce fichier le lit encore
   après : rien n'est renommé, tout est ajouté.

   OÙ VIVENT LES DONNÉES. Dans le stockage local du navigateur, et nulle part
   ailleurs. Aucune requête n'est faite, aucun champ n'est envoyé. Le SIRET,
   le courriel et le téléphone d'un client sont des données personnelles :
   elles ne quittent pas le poste, et l'utilisateur peut tout effacer d'un
   bouton sur la page d'audit.                                               */
"use strict";
(function () {

  var CLE = "profil-entreprise";

  var SECTEURS = ["transport et logistique", "industrie",
    "bâtiment et travaux publics", "commerce", "services"];

  /* La fiche d'inscription : ce que l'on demande au client avant tout audit.
     L'ordre est celui d'une fiche que l'on remplit — l'entreprise, puis qui
     la représente, puis ce qui commande les obligations. */
  var IDENTITE = [
    { c: "denomination", nom: "Dénomination sociale", t: "text", pleine: true,
      aide: "Telle qu'elle figure au Kbis. Elle pré-remplit tous les rapports, courriers et modèles de l'application." },
    { c: "siret", nom: "SIRET (14 chiffres)", t: "text",
      aide: "Il identifie l'établissement. L'application ne l'envoie nulle part : il sert à nommer le dossier et à en-tête des documents produits." },
    { c: "adresse", nom: "Adresse du siège", t: "text", pleine: true,
      aide: "Elle figure en tête des courriers produits (convocations, notifications, dépôts)." },
    { c: "responsable", nom: "Responsable du dossier (nom, qualité)", t: "text",
      aide: "La personne qui signe : gérant, président, directeur des ressources humaines, responsable du personnel." },
    { c: "courriel", nom: "Courriel de contact", t: "email",
      aide: "Sert de coordonnée sur les documents produits. Il reste sur ce poste." },
    { c: "telephone", nom: "Téléphone", t: "tel" },
    { c: "effectif", nom: "Effectif de l'entreprise (salariés)", t: "number",
      aide: "C'est lui qui ouvre ou ferme la plupart des obligations : 11, 20, 50, 250, 300, 1 000 sont des seuils du code du travail. Laissé vide, rien n'est conclu — l'application ne devine pas." },
    { c: "secteur", nom: "Secteur d'activité", t: "select", options: SECTEURS, autre: true,
      aide: "Il oriente la convention applicable et le contenu des modèles (unités de travail du document unique, risques types)." },
    { c: "conventionCollective", nom: "Convention collective applicable (IDCC)", t: "idcc",
      aide: "Elle s'identifie par l'activité réelle. L'application ne lit aucune convention : elle signale l'endroit où la vôtre peut ajouter une obligation, elle n'affirme jamais ce qu'elle contient." },
    { c: "groupe", nom: "L'entreprise appartient-elle à un groupe ?", t: "oui-non",
      aide: "Le groupe déclenche le comité de groupe et pèse sur certains seuils des modules dédiés." },
    { c: "etablissementsDistincts", nom: "L'entreprise comporte-t-elle au moins deux établissements distincts ?", t: "oui-non",
      aide: "Plusieurs établissements appellent des comités d'établissement et un comité central, et des registres par établissement." },
    { c: "nbEtablissements", nom: "Nombre d'établissements", t: "number",
      aide: "Facultatif. Le registre unique du personnel se tient dans chaque établissement (art. L. 1221-13)." },
  ];

  /* Les quatre valeurs de toute réponse fermée de l'application.

     « oui » et « non » concluent. « en cours » et « autre » NE CONCLUENT
     JAMAIS : ils sont remis aux moteurs comme une donnée absente, et le
     contrôle rend au mieux « risque à vérifier », jamais « conforme ». C'est
     la règle du dépôt — cocher n'est pas prouver — étendue aux réponses
     nuancées : une régularisation commencée n'est pas une régularisation
     faite, et une réponse hors cadre n'est pas une réponse. */
  var VALEURS = ["oui", "non", "en cours", "autre"];
  var CONCLUANTES = { oui: true, non: true };
  function conclut(v) { return CONCLUANTES[String(v || "").trim()] === true; }

  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ------------------------------------------------------------- lecture --- */
  /* Les alias historiques sont lus, jamais réécrits à la place des nouveaux :
     un profil enregistré par une version antérieure s'ouvre tel quel. */
  function lire() {
    var p;
    try { p = JSON.parse(localStorage.getItem(CLE) || "null"); } catch (_) { p = null; }
    if (!p || typeof p !== "object") p = {};
    if (!p.denomination) p.denomination = p.denominationSociale || p.entreprise || p.nom || "";
    if (!p.conventionCollective) p.conventionCollective = p.convention || p.idcc || "";
    if (!p.secteur) p.secteur = p.activite || "";
    if (!p.adresse) p.adresse = p.siege || "";
    return p;
  }

  /* L'écriture est une FUSION : une page qui ne connaît que trois champs
     n'efface pas les huit autres. « entreprise » est tenu à jour à côté de
     « denomination » parce que l'audit social et le générateur de documents
     le lisent sous ce nom depuis le début. */
  function ecrire(patch) {
    var p = lire();
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) p[k] = patch[k];
    if (p.denomination) p.entreprise = p.denomination;
    try { localStorage.setItem(CLE, JSON.stringify(p)); } catch (_) {}
    return p;
  }

  function effacer() { try { localStorage.removeItem(CLE); } catch (_) {} }

  /* La fiche est-elle assez remplie pour ouvrir un audit ? La dénomination et
     l'effectif suffisent — le reste enrichit, il ne bloque pas. */
  function suffisante(p) {
    p = p || lire();
    var eff = String(p.effectif == null ? "" : p.effectif).trim();
    return String(p.denomination || "").trim() !== "" && eff !== "" && isFinite(+eff);
  }
  function manquants(p) {
    p = p || lire();
    return IDENTITE.filter(function (ch) {
      var v = p[ch.c];
      return v === undefined || v === null || String(v).trim() === "";
    }).map(function (ch) { return ch.nom; });
  }

  /* ------------------------------------------------------------- rendu --- */
  /* Un champ. Les réponses fermées portent les quatre valeurs ; « autre »
     ouvre une saisie libre dont le texte est la valeur enregistrée, précédée
     de « autre : » pour que rien ne la confonde avec un « oui ». */
  function champHtml(ch, valeur, prefixe) {
    var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
    var aide = ch.aide ? '<p class="aide-champ">' + e(ch.aide) + "</p>" : "";
    var val = valeur == null ? "" : String(valeur);
    var dedans;
    if (ch.t === "oui-non") {
      var libre = val && VALEURS.indexOf(val) < 0;
      var choisi = libre ? "autre" : val;
      dedans = '<select id="' + id + '" data-champ="' + e(ch.c) + '" data-ouinon="1">' +
        '<option value=""></option>' +
        VALEURS.map(function (o) {
          return '<option value="' + o + '"' + (choisi === o ? " selected" : "") + ">" + o + "</option>";
        }).join("") + "</select>" +
        '<input type="text" id="' + id + '-libre" data-libre="' + e(ch.c) + '" placeholder="précisez" ' +
        'style="margin-top:6px' + (libre ? "" : ";display:none") + '" value="' + (libre ? e(val) : "") + '">';
    } else if (ch.t === "select") {
      var connu = (ch.options || []).indexOf(val) >= 0;
      dedans = '<select id="' + id + '" data-champ="' + e(ch.c) + '"><option value=""></option>' +
        (ch.options || []).map(function (o) {
          return '<option' + (val === o ? " selected" : "") + ">" + e(o) + "</option>";
        }).join("") +
        (ch.autre ? '<option value="__autre"' + (val && !connu ? " selected" : "") + ">— autre —</option>" : "") +
        "</select>" +
        (ch.autre ? '<input type="text" id="' + id + '-libre" data-libre="' + e(ch.c) + '" ' +
          'placeholder="précisez" style="margin-top:6px' + (val && !connu ? "" : ";display:none") +
          '" value="' + (connu ? "" : e(val)) + '">' : "");
    } else if (ch.t === "idcc") {
      dedans = '<input id="' + id + '" data-champ="' + e(ch.c) + '" type="text" value="' + e(val) +
        '" placeholder="numéro IDCC ou intitulé — la liste s\'ouvre à la saisie" autocomplete="off">';
    } else {
      dedans = '<input id="' + id + '" data-champ="' + e(ch.c) + '" type="' + e(ch.t) + '"' +
        (ch.t === "number" ? ' min="0" step="1"' : "") +
        (ch.t === "tel" ? ' inputmode="tel"' : "") +
        ' value="' + e(val) + '">';
    }
    return '<label' + (ch.pleine ? ' class="pleine"' : "") + '><span class="nom">' + e(ch.nom) +
      "</span>" + dedans + aide + "</label>";
  }

  /* Lire un champ rendu par champHtml : le menu, ou la saisie libre qu'il
     ouvre. Rend la chaîne à enregistrer — jamais une valeur devinée. */
  function lireChamp(ch, prefixe, racine) {
    racine = racine || document;
    var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
    var el = racine.querySelector("#" + CSS.escape(id));
    if (!el) return undefined;
    var v = el.value;
    if ((ch.t === "select" && v === "__autre") || (ch.t === "oui-non" && v === "autre")) {
      var l = racine.querySelector("#" + CSS.escape(id + "-libre"));
      v = l ? l.value.trim() : "";
    }
    return v;
  }

  /* Rendre la fiche complète dans un conteneur, et tenir le profil à jour à
     chaque frappe. `onChange` est appelé après chaque enregistrement. */
  function rendre(conteneur, options) {
    options = options || {};
    var prefixe = options.prefixe || "fc";
    var champs = options.champs || IDENTITE;
    var p = lire();
    conteneur.innerHTML = "<fieldset><legend>" +
      e(options.legende || "Fiche client — l'entreprise auditée") + "</legend>" +
      (options.aide ? '<p class="aide-champ" style="margin:0 0 12px">' + e(options.aide) + "</p>" : "") +
      '<div class="grille">' +
      champs.map(function (ch) { return champHtml(ch, p[ch.c], prefixe); }).join("") +
      "</div></fieldset>";

    /* Les saisies libres : celles des menus « — autre — » et « autre ». */
    champs.forEach(function (ch) {
      var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
      var sel = conteneur.querySelector("#" + CSS.escape(id));
      var libre = conteneur.querySelector("#" + CSS.escape(id + "-libre"));
      if (!sel || !libre) return;
      sel.addEventListener("change", function () {
        var ouvert = sel.value === "__autre" || sel.value === "autre";
        libre.style.display = ouvert ? "" : "none";
        if (!ouvert) libre.value = "";
        majorer();
      });
      libre.addEventListener("input", majorer);
    });

    var cc = conteneur.querySelector("#" + CSS.escape(prefixe + "-conventionCollective"));
    if (cc && window.IDCC && window.IDCC.attacher) window.IDCC.attacher(cc);

    function majorer() {
      var patch = {};
      champs.forEach(function (ch) {
        var v = lireChamp(ch, prefixe, conteneur);
        if (v === undefined) return;
        patch[ch.c] = v;
      });
      var np = ecrire(patch);
      if (typeof options.onChange === "function") options.onChange(np);
    }

    conteneur.addEventListener("input", majorer);
    conteneur.addEventListener("change", majorer);
    return { majorer: majorer };
  }

  window.Profil = {
    CLE: CLE, IDENTITE: IDENTITE, SECTEURS: SECTEURS,
    VALEURS: VALEURS, conclut: conclut,
    lire: lire, ecrire: ecrire, effacer: effacer,
    suffisante: suffisante, manquants: manquants,
    champHtml: champHtml, lireChamp: lireChamp, rendre: rendre,
  };
})();
