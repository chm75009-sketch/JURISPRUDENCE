/* LES LISTES, POSÉES TOUTES SEULES, SUR TOUS LES ÉCRANS.

   Demande du 14 septembre 2026 : « faire ça partout ». L'application compte
   plus de cent trente champs de saisie libre, répartis sur une quinzaine
   d'écrans qui ont chacun leur façon de les décrire. Les reprendre un par un
   aurait garanti qu'on en oublie, et que le prochain champ ajouté n'ait pas
   sa liste.

   Ce fichier reconnaît donc le champ à ce qu'il demande : son intitulé, son
   identifiant, son texte d'invite. Un champ qui parle de nationalité reçoit
   la liste des nationalités, un champ d'emploi celle des emplois, un champ de
   lieu celle des villes. Les écrans n'ont rien à déclarer, et un écran écrit
   demain en bénéficiera sans qu'on y pense.

   La reconnaissance se fait au chargement, puis à chaque fois que la page
   redessine ses champs : les formulaires de l'application se reconstruisent
   à chaque saisie.

   Ce qui n'est jamais touché : les listes déroulantes déjà posées (select),
   les champs de date, de nombre, de mot de passe, et les zones de texte. */

(function (window) {
  "use strict";
  var doc = window.document;

  /* L'ordre compte : le premier motif qui reconnaît le champ l'emporte.
     « Titre autorisant l'activité » avant « activité », « lieu de naissance »
     avant « naissance ». */
  var REGLES = [
    /* Le nom d'un salarié déjà inscrit au registre se choisit au lieu de se
       retaper. Avant la nationalité : « Nom et prénom du salarié » ne parle
       pas de nationalité, mais l'ordre évite toute surprise. */
    [/nom et pr[ée]nom|nom du salari|salari[ée] \(nom|nom, pr[ée]nom/i, "salarie"],
    [/nationalit/i, "nationalite"],
    [/titre de s[ée]jour|titre autorisant/i, "titreSejour"],
    [/pays/i, "pays"],
    [/civilit/i, "civilite"],
    [/motif du recours|motif de recours|motif du cdd/i, "motifCdd"],
    [/qualification|cat[ée]gorie professionnelle/i, "qualification"],
    [/emploi|poste|fonction|m[ée]tier|profession/i, "emploi"],
    /* « lieu » sans limite de mot : l'identifiant du champ s'écrit souvent
       « lieuNaissance », en un seul mot. */
    [/lieu|n[ée]\(e\) [àa]|ville|commune/i, "ville"],
  ];

  function listeDe(texte) {
    var t = String(texte || "");
    for (var i = 0; i < REGLES.length; i++) if (REGLES[i][0].test(t)) return REGLES[i][1];
    return null;
  }

  /* Ce que le champ demande : son étiquette d'abord, puis son identifiant et
     son texte d'invite. Une étiquette dit « Né(e) le » et « À » dans deux
     cellules voisines : l'invite (« Argenteuil ») tranche alors. */
  function description(el) {
    var parts = [];
    var lab = el.closest ? el.closest("label") : null;
    if (lab) parts.push(lab.textContent);
    if (el.id) parts.push(el.id);
    var n = el.getAttribute("name"); if (n) parts.push(n);
    var d = el.getAttribute("data-ch") || el.getAttribute("data-champ"); if (d) parts.push(d);
    var p = el.getAttribute("placeholder"); if (p) parts.push(p);
    var al = el.getAttribute("aria-label"); if (al) parts.push(al);
    return parts.join(" | ");
  }

  function equiper(racine) {
    if (!window.ListeChoix || !window.ListesValeurs) return 0;
    var n = 0;
    var champs = (racine || doc).querySelectorAll('input[type="text"]:not([data-lc]):not([data-idcc]):not([data-sans-liste])');
    Array.prototype.forEach.call(champs, function (el) {
      var cle = listeDe(description(el));
      if (!cle) return;
      var valeurs = window.ListesValeurs[cle];
      /* Une liste peut se calculer au moment où l'on en a besoin : celle des
         salariés se lit dans le registre tenu sur ce poste. */
      if (typeof valeurs === "function") valeurs = valeurs();
      if (!valeurs || !valeurs.length) return;
      window.ListeChoix.attacher(el, { valeurs: valeurs, libelle: nomListe(cle) });
      n++;
    });
    return n;
  }

  function nomListe(cle) {
    return { nationalite: "nationalité", pays: "pays", titreSejour: "titre de séjour",
      motifCdd: "motif du recours", qualification: "qualification", emploi: "emploi",
      ville: "ville", civilite: "civilité" }[cle] || cle;
  }

  function demarrer() {
    equiper(doc);
    /* Les écrans reconstruisent leurs champs à chaque saisie : sans cette
       surveillance, la liste ne tiendrait qu'une frappe. */
    if (typeof MutationObserver !== "function") return;
    var enAttente = false;
    var obs = new MutationObserver(function () {
      if (enAttente) return;
      enAttente = true;
      setTimeout(function () { enAttente = false; equiper(doc); }, 120);
    });
    obs.observe(doc.body, { childList: true, subtree: true });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

  window.ListesAuto = { equiper: equiper, listeDe: listeDe, REGLES: REGLES };
})(window);
