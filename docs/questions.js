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
  /* UNE QUESTION NON ENVOYÉE NE SE DÉCOMPTE PAS.

     Le lien mailto ouvre la messagerie ; il n'envoie rien. L'écran annonçait
     pourtant « envoyée » et le compteur passait de cinq à quatre, sans que
     personne n'ait cliqué sur envoyer. Le décompte ne retient donc que les
     questions confirmées par l'utilisateur. Relevé le 26 septembre 2026. */
  function envoyees(m) {
    return duMois(m).filter(function (q) { return q.etat !== "brouillon"; });
  }
  function reste(m) {
    return Math.max(0, PAR_MOIS - envoyees(m).length);
  }
  /* La question est écrite dès qu'on ouvre la messagerie, pour garder son
     texte et ses pièces ; elle attend sa confirmation pour compter. */
  function confirmer(id) {
    var tout = lire(), fait = false;
    tout.questions.forEach(function (q) {
      if (q.id === id && q.etat === "brouillon") { q.etat = "posée"; q.envoyeeLe = new Date().toISOString(); fait = true; }
    });
    if (fait) garder(tout);
    return fait;
  }
  function retirer(id) {
    var tout = lire();
    var avant = tout.questions.length;
    tout.questions = tout.questions.filter(function (q) { return !(q.id === id && q.etat === "brouillon"); });
    if (tout.questions.length !== avant) garder(tout);
    return tout.questions.length !== avant;
  }

  /* ═══════════════ LE FIL DES RÉPONSES DU CABINET ═══════════════════════

     La question partait, la réponse arrivait dans la messagerie, et rien ne
     les reliait : six mois plus tard, le client ne retrouvait ni ce qu'il
     avait demandé ni ce qu'on lui avait répondu. L'audit du 26 septembre 2026
     l'a relevé. La réponse se colle ici, sous sa question, avec sa date ; elle
     reste sur l'appareil du client, comme le reste du dossier.

     Rien n'arrive tout seul : l'application n'a pas de serveur, et c'est le
     client qui reporte ce qu'il a reçu. L'écran le dit plutôt que de laisser
     croire à un fil qui se remplirait de lui-même.                         */
  function repondre(id, r) {
    var tout = lire(), fait = null;
    tout.questions.forEach(function (q) {
      if (q.id !== id) return;
      if (!q.reponses) q.reponses = [];
      var v = { le: net(r && r.le) || new Date().toISOString().slice(0, 10),
        texte: net(r && r.texte), notee: new Date().toISOString() };
      if (!v.texte) return;
      q.reponses.push(v);
      fait = v;
    });
    if (fait) garder(tout);
    return fait;
  }
  function retirerReponse(id, rang) {
    var tout = lire(), fait = false;
    tout.questions.forEach(function (q) {
      if (q.id !== id || !q.reponses) return;
      if (rang >= 0 && rang < q.reponses.length) { q.reponses.splice(rang, 1); fait = true; }
    });
    if (fait) garder(tout);
    return fait;
  }
  /* Toutes les questions, du plus récent au plus ancien : le fil ne s'arrête
     pas au mois civil, la réponse arrive souvent le mois suivant. */
  function toutes() {
    return lire().questions.slice().sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
  }
  function sansReponse() {
    return toutes().filter(function (q) {
      return q.etat !== "brouillon" && !(q.reponses && q.reponses.length);
    });
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
    var rang = envoyees(mois).length + 1;
    var q = {
      id: identifiant(mois, rang),
      mois: mois,
      rang: rang,
      date: new Date().toISOString(),
      objet: net(o.objet),
      texte: net(o.texte),
      pieces: (o.pieces || []).map(function (p) { return net(p); }).filter(Boolean),
      etat: "brouillon",
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
    lire: lire, duMois: duMois, envoyees: envoyees, reste: reste, poser: poser,
    confirmer: confirmer, retirer: retirer,
    repondre: repondre, retirerReponse: retirerReponse,
    toutes: toutes, sansReponse: sansReponse,
    courriel: courriel, lien: lien,
    reglage: reglage, reglerAdresse: reglerAdresse,
    moisDe: moisDe, moisEnFrancais: moisEnFrancais,
    premierDuMoisSuivant: premierDuMoisSuivant, jourEnFrancais: jourEnFrancais,
  };

})(window);
