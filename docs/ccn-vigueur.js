/* LES MONTANTS CONVENTIONNELS EN VIGUEUR, PORTÉS PAR CELUI QUI LES A.

   POURQUOI CE FICHIER EXISTE

   L'application ne lit pas les grilles de la convention collective. Le relais
   sert les codes, pas les tableaux des avenants KALI : interrogé le 1er octobre
   2026 sur les deux annexes de taux horaires des personnels ouvriers du
   transport routier, par identifiant et par recherche en plein texte, il rend
   leur titre, leurs métadonnées, et un tableau d'articles vide.

   Les montants figés dans contrats-transport.js portent donc la date de leur
   dernière lecture, et rien ne garantit qu'un avenant ne les a pas relevés
   depuis. Cinq familles sont dans ce cas : les taux horaires, les garanties
   annuelles de rémunération, les frais de déplacement, la prime de nuit et la
   garantie d'amplitude. Le taux horaire a reçu son champ le 1er octobre 2026 ;
   ce fichier généralise aux quatre autres.

   LE PRINCIPE, ET CE QU'IL REFUSE DE FAIRE

   Celui qui écrit le contrat a la convention sous les yeux. Il porte le montant
   en vigueur et la référence de l'avenant d'où il le tire ; l'application le
   garde sur le poste et s'en sert partout, en disant d'où il vient. Elle ne
   devine aucun montant, elle n'en interpole aucun, et elle n'écrase jamais ce
   qui est saisi par ce qu'elle croit savoir.

   Ce qui est saisi l'emporte, sans comparaison : un avenant peut baisser un
   plafond ou refondre un barème, et retenir « le plus élevé des deux » serait
   écrire autre chose que la convention. La seule exception est le taux horaire,
   où le SMIC est un minimum légal, et où le plus élevé des trois est donc bien
   ce qui est dû.

   USAGE

     CcnVigueur.lire()                 →  tout ce qui est saisi
     CcnVigueur.valeur(cle, defaut)    →  le montant saisi, ou celui du code
     CcnVigueur.source(cle, defaut)    →  « avenant n° 82 du … », ou la source du code
     CcnVigueur.saisi(cle)             →  vrai si le montant vient de l'utilisateur
     CcnVigueur.poser(cle, valeur, source)
     CcnVigueur.CHAMPS                 →  les champs à afficher, dans l'ordre

   Tout reste sur le poste : rien n'est envoyé.                               */

"use strict";
(function (window) {

  var CLE = "ccn-montants";

  /* Les montants qu'un avenant peut changer, et que l'application ne lit pas.
     Chaque clé porte son intitulé, son unité, et la famille à laquelle elle
     appartient : c'est la famille qui regroupe les champs à l'écran. */
  var CHAMPS = [
    { c: "garantieAnnuelle", famille: "Garantie annuelle de rémunération",
      nom: "Garantie annuelle du coefficient, pour l'horaire du contrat (euros)",
      unite: "euros par an",
      sous: "Celle de votre coefficient dans la grille en vigueur. Elle remplace celle que " +
        "l'application porte, quelle qu'en soit la valeur." },
    { c: "repas", famille: "Frais de déplacement",
      nom: "Indemnité de repas (euros)", unite: "euros" },
    { c: "repasUnique", famille: "Frais de déplacement",
      nom: "Indemnité de repas unique (euros)", unite: "euros" },
    { c: "repasUniqueNuit", famille: "Frais de déplacement",
      nom: "Indemnité de repas unique « nuit » (euros)", unite: "euros" },
    { c: "casseCroute", famille: "Frais de déplacement",
      nom: "Indemnité de casse-croûte (euros)", unite: "euros" },
    { c: "speciale", famille: "Frais de déplacement",
      nom: "Indemnité spéciale (euros)", unite: "euros" },
    { c: "grandDeplacement1", famille: "Frais de déplacement",
      nom: "Grand déplacement, 1 repas et 1 découcher (euros)", unite: "euros" },
    { c: "grandDeplacement2", famille: "Frais de déplacement",
      nom: "Grand déplacement, 2 repas et 1 découcher (euros)", unite: "euros" },
    { c: "nuitTaux", famille: "Prime de nuit",
      nom: "Taux de la prime de nuit (pourcentage)", unite: "%",
      sous: "En pourcentage du taux horaire conventionnel à l'embauche du coefficient de " +
        "référence. Portez 20 pour 20 %." },
    { c: "amplitudePart", famille: "Garantie d'amplitude",
      nom: "Part des amplitudes cumulées garantie (pourcentage)", unite: "%",
      sous: "Portez 75 pour 75 %." },
    { c: "amplitudePlafond", famille: "Garantie d'amplitude",
      nom: "Réduction maximale des amplitudes (heures)", unite: "heures" },
  ];

  function lire() {
    var v = null;
    try { v = JSON.parse(window.localStorage.getItem(CLE) || "null"); } catch (e) { v = null; }
    if (!v || typeof v !== "object") v = {};
    if (!v.valeurs || typeof v.valeurs !== "object") v.valeurs = {};
    if (!v.sources || typeof v.sources !== "object") v.sources = {};
    return v;
  }
  function ecrire(v) {
    try { window.localStorage.setItem(CLE, JSON.stringify(v)); } catch (e) {}
  }

  /* Un nombre écrit à la française ou à l'anglaise. Zéro n'est pas une saisie :
     un montant conventionnel nul n'existe pas, et accepter zéro reviendrait à
     effacer le barème par une frappe. */
  function nombre(x) {
    var n = parseFloat(String(x == null ? "" : x).replace(",", ".").replace(/[^\d.-]/g, ""));
    return (isFinite(n) && n > 0) ? n : null;
  }

  function saisi(cle) {
    return nombre(lire().valeurs[cle]) !== null;
  }
  function valeur(cle, defaut) {
    var n = nombre(lire().valeurs[cle]);
    return n === null ? defaut : n;
  }
  function source(cle, defaut) {
    var v = lire();
    if (nombre(v.valeurs[cle]) === null) return defaut;
    var s = String(v.sources[cle] || v.source || "").trim();
    return s || "grille en vigueur portée sur ce poste, référence non précisée";
  }
  function poser(cle, val, src) {
    var v = lire();
    if (val === "" || val === null || val === undefined) delete v.valeurs[cle];
    else v.valeurs[cle] = String(val);
    if (src !== undefined) {
      if (String(src || "").trim() === "") delete v.sources[cle];
      else v.sources[cle] = String(src).trim();
    }
    ecrire(v);
  }
  /* La référence commune, quand l'avenant est le même pour toute une famille :
     on ne la retape pas sur chaque ligne. */
  function poserSource(src) {
    var v = lire();
    if (String(src || "").trim() === "") delete v.source;
    else v.source = String(src).trim();
    ecrire(v);
  }
  /* Combien de montants sont portés à la main : l'écran le dit, et le document
     aussi, parce que c'est ce qui distingue un contrat vérifié d'un contrat
     écrit sur des chiffres datés. */
  function combien() {
    var v = lire(), n = 0;
    CHAMPS.forEach(function (c) { if (nombre(v.valeurs[c.c]) !== null) n++; });
    return n;
  }

  window.CcnVigueur = {
    CHAMPS: CHAMPS, lire: lire, valeur: valeur, source: source, saisi: saisi,
    poser: poser, poserSource: poserSource, combien: combien,
  };

})(window);
