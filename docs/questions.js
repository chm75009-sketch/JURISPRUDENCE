/* LES QUESTIONS DE L'ABONNEMENT.

   POURQUOI CE FICHIER EXISTE

   Demande du 24 septembre 2026 : « un mini module de questions à m'adresser
   par le client par mois. Cet abonnement leur donne le droit de me poser
   5 questions en droit du travail par mois, précise question et non rédaction
   de contrat ou tout autre document, les questions doivent passer
   obligatoirement par ce biais, aucun autre moyen ne sera accepté, quand il
   arrive à 5 plus possible de poser des questions, avec les questions
   possibilité de joindre des documents. »

   CE QU'IL FAIT

   Cinq questions par mois civil, décomptées à l'envoi. À cinq, le formulaire
   se ferme et dit la date de réouverture. Chaque question est gardée sur
   l'appareil du client avec sa date, son objet, son texte et le nom des
   pièces jointes : c'est son registre, et c'est aussi ce qui permet de savoir
   où en est le mois.

   COMMENT LA QUESTION PART

   L'application n'a pas de serveur : rien ne s'envoie tout seul. Le bouton
   ouvre la messagerie du client avec l'adresse, l'objet et le texte déjà
   écrits ; il appuie sur envoyer. Les pièces ne peuvent pas être attachées
   par ce moyen : elles sont sur son appareil, l'écran lui rappelle lesquelles
   joindre, et elles restent dans « Mes documents » pour la trace.

   CE QUE LE DÉCOMPTE VAUT

   Il vit dans le navigateur du client. Qui efface les données de son
   navigateur remet son compteur à zéro. C'est un compteur d'usage, pas un
   péage : il rappelle la règle, il ne la garde pas sous clé. Le vrai décompte
   reste celui du cabinet, qui reçoit les courriels.                        */

"use strict";
(function (window) {

  var CLE = "questions-abonnement";
  var CLE_REGLAGE = "questions-reglage";
  var PAR_MOIS = 5;

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];

  function net(v) { return String(v == null ? "" : v).trim(); }

  function moisDe(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2);
  }
  function moisEnFrancais(m) {
    var p = String(m).split("-");
    return MOIS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function premierDuMoisSuivant(m) {
    var p = String(m).split("-");
    var an = parseInt(p[0], 10), mo = parseInt(p[1], 10);
    if (mo === 12) { an++; mo = 1; } else { mo++; }
    return "1er " + MOIS[mo - 1] + " " + an;
  }
  function jourEnFrancais(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return net(iso);
    var j = d.getDate();
    return (j === 1 ? "1er" : j) + " " + MOIS[d.getMonth()] + " " + d.getFullYear();
  }

  function lire() {
    var o = null;
    try { o = JSON.parse(window.localStorage.getItem(CLE) || "null"); } catch (e) {}
    if (!o || typeof o !== "object") o = { questions: [] };
    if (!o.questions) o.questions = [];
    return o;
  }
  function garder(o) {
    try { window.localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {}
  }

  function reglage() {
    var o = null;
    try { o = JSON.parse(window.localStorage.getItem(CLE_REGLAGE) || "null"); } catch (e) {}
    return o && typeof o === "object" ? o : {};
  }
  function reglerAdresse(a) {
    var o = reglage();
    o.adresse = net(a);
    try { window.localStorage.setItem(CLE_REGLAGE, JSON.stringify(o)); } catch (e) {}
    return o.adresse;
  }

  /* Les questions du mois en cours, et ce qu'il en reste. */
  function duMois(m) {
    var mois = m || moisDe(new Date());
    return lire().questions.filter(function (q) { return q.mois === mois; });
  }
  function reste(m) {
    return Math.max(0, PAR_MOIS - duMois(m).length);
  }

  function identifiant(mois, rang) {
    return "Q" + String(mois).replace("-", "") + "-" + ("0" + rang).slice(-2);
  }

  /* Poser une question : elle est comptée à cet instant, puisque c'est à cet
     instant qu'elle part. */
  function poser(o) {
    var mois = moisDe(new Date());
    if (reste(mois) <= 0) return null;
    var tout = lire();
    var rang = duMois(mois).length + 1;
    var q = {
      id: identifiant(mois, rang),
      mois: mois,
      rang: rang,
      date: new Date().toISOString(),
      objet: net(o.objet),
      texte: net(o.texte),
      pieces: (o.pieces || []).map(function (p) { return net(p); }).filter(Boolean),
      etat: "posée",
    };
    tout.questions.push(q);
    garder(tout);
    return q;
  }

  /* Le courriel, tel qu'il s'ouvrira. Le corps porte la référence, parce que
     c'est elle qui relie le courriel reçu à la question gardée ici. */
  function courriel(q, entreprise) {
    var e = entreprise || {};
    var lignes = [];
    lignes.push("Question " + q.rang + " sur " + PAR_MOIS + " pour " + moisEnFrancais(q.mois) + ".");
    lignes.push("Référence : " + q.id);
    lignes.push("");
    lignes.push(q.texte);
    lignes.push("");
    if (q.pieces.length) {
      lignes.push("Pièces jointes à ce message :");
      q.pieces.forEach(function (p) { lignes.push("- " + p); });
      lignes.push("");
    }
    lignes.push(e.denomination || "");
    if (e.responsable) lignes.push(e.responsable);
    if (e.siret) lignes.push("SIRET " + e.siret);
    return {
      objet: "[" + q.id + "] " + (e.denomination ? e.denomination + " - " : "") + q.objet,
      corps: lignes.join("\n"),
    };
  }

  function lien(q, entreprise, adresse) {
    var c = courriel(q, entreprise);
    return "mailto:" + encodeURIComponent(net(adresse)) +
      "?subject=" + encodeURIComponent(c.objet) +
      "&body=" + encodeURIComponent(c.corps);
  }

  window.QuestionsAbonnement = {
    PAR_MOIS: PAR_MOIS,
    lire: lire, duMois: duMois, reste: reste, poser: poser,
    courriel: courriel, lien: lien,
    reglage: reglage, reglerAdresse: reglerAdresse,
    moisDe: moisDe, moisEnFrancais: moisEnFrancais,
    premierDuMoisSuivant: premierDuMoisSuivant, jourEnFrancais: jourEnFrancais,
  };

})(window);
