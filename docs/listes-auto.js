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

  /* ═══════════════════════════════════════════════════════════════════════
     CHOISIR UN SALARIÉ REMPLIT LE RESTE.

     Demande du 15 septembre 2026 : « sélectionner le salarié, objet du
     courrier quel qu'il soit, et ensuite enchaîner ». La liste des salariés
     existait déjà sur les champs de nom, mais choisir un nom ne faisait que
     poser le nom : l'emploi, la qualification, la nationalité, la date de
     naissance et la date d'entrée restaient à retaper, alors que le registre
     du personnel les porte.

     Ce qui est déjà écrit n'est jamais remplacé : on ne remplit que les cases
     vides. Une lettre en cours de rédaction ne se fait pas réécrire sous les
     doigts de celui qui la rédige.                                          */
  var CHAMPS_SALARIE = [
    [/qualification|cat[ée]gorie professionnelle/i, "qua"],
    [/nationalit/i, "nat"],
    [/date de naissance|n[ée]\(e\) le/i, "nais"],
    [/date d'entr[ée]e|date d'embauche|entr[ée]e dans l'entreprise/i, "ent"],
    [/date de sortie|date de d[ée]part/i, "sor"],
    /* L'emploi en dernier : « Emploi supprimé » ou « Emploi » se reconnaît
       largement, et ne doit pas rafler un champ de qualification. */
    [/emploi|poste|fonction|m[ée]tier/i, "emp"],
  ];

  /* La comparaison se fait sans accents, sans ponctuation, et sans la
     civilité : les champs des lettres donnent « Monsieur Karim BENALI » quand
     le registre porte « BENALI » et « Karim ». */
  function pareil(x) {
    var t = String(x == null ? "" : x);
    try { t = t.normalize("NFD").replace(/[̀-ͯ]/g, ""); } catch (e) {}
    return t.toLowerCase().replace(/^\s*(monsieur|madame|mademoiselle|m\.|mme|mlle)\s+/, "")
      .replace(/[^a-z0-9]+/g, " ").trim();
  }

  function salarieDuRegistre(nom) {
    var E = null;
    try { E = JSON.parse(window.localStorage.getItem("registre-personnel") || "null"); }
    catch (e) { return null; }
    var L = (E && E.salaries) || [];
    var cherche = pareil(nom);
    if (!cherche) return null;
    var trouve = null;
    L.forEach(function (s) {
      var a = pareil(String(s.pre || "") + " " + String(s.nom || ""));
      var b = pareil(String(s.nom || "") + " " + String(s.pre || ""));
      if (!trouve && (a === cherche || b === cherche)) trouve = s;
    });
    return trouve;
  }

  /* Pour remplir, on ne regarde QUE l'étiquette et l'identifiant du champ,
     jamais son texte d'invite. Mesuré le 15 septembre 2026 : l'invite de la
     zone « Ce que vous reprochez » de la lettre d'avertissement parle de
     poste, et l'emploi du salarié s'y était écrit. */
  function etiquette(el) {
    var parts = [];
    var lab = el.closest ? el.closest("label") : null;
    if (lab) {
      var n = lab.querySelector(".nom");
      parts.push(n ? n.textContent : lab.textContent);
    }
    if (el.id) parts.push(el.id);
    return parts.join(" | ");
  }

  function enchainer(el) {
    if (listeDe(description(el)) !== "salarie") return;
    var s = salarieDuRegistre(el.value);
    if (!s) return;
    var cadre = (el.closest && (el.closest("form") || el.closest(".champs") ||
      el.closest("section"))) || doc;
    var champs = cadre.querySelectorAll("input, select, textarea");
    Array.prototype.forEach.call(champs, function (x) {
      if (x === el || x.value) return;          /* jamais par-dessus une saisie */
      if (x.tagName === "TEXTAREA") return;     /* une zone de texte n'est pas une case */
      var d = etiquette(x);
      if (listeDe(d) === "salarie") return;
      for (var i = 0; i < CHAMPS_SALARIE.length; i++) {
        if (!CHAMPS_SALARIE[i][0].test(d)) continue;
        var v = s[CHAMPS_SALARIE[i][1]];
        if (v == null || String(v).trim() === "") return;
        /* Une date du registre est en AAAA-MM-JJ, ce qu'attend un champ date ;
           ailleurs, elle s'écrit telle quelle. */
        x.value = String(v);
        x.dispatchEvent(new Event("input", { bubbles: true }));
        x.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }
    });
  }

  function demarrer() {
    equiper(doc);
    doc.addEventListener("change", function (ev) {
      var el = ev.target;
      if (!el || el.tagName !== "INPUT" || el.type !== "text") return;
      if (!el.value) return;
      try { enchainer(el); } catch (e) { /* remplir ne doit jamais casser l'écran */ }
    });
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

  /* L'ADRESSE DU SALARIÉ, POUR LES ÉCRANS QUI ÉCRIVENT DES LETTRES.

     Elle est saisie sur la fiche du registre, où elle ne compte pas comme une
     mention obligatoire, et les courriers la reprennent d'eux-mêmes plutôt
     que d'écrire « [adresse du salarié] ». Demande du 25 septembre 2026.
     Rien n'est rendu quand le nom ne correspond à aucune fiche : la lettre
     garde alors son crochet, qui se voit. */
  function adresseDuSalarie(nom) {
    var s = salarieDuRegistre(nom);
    return (s && String(s.adr || "").trim()) || "";
  }

  window.ListesAuto = { equiper: equiper, listeDe: listeDe, REGLES: REGLES,
    salarie: salarieDuRegistre, adresse: adresseDuSalarie };
})(window);
