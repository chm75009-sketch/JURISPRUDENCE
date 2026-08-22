/* Le pont vers Juris Expert — la table des outils qui produisent le document
   final, et rien d'autre.

   POURQUOI CE FICHIER EXISTE. Deux applications de la même juriste font le
   même chemin par les deux bouts. Celle-ci DIAGNOSTIQUE et FONDE : quelles
   obligations pèsent sur l'entreprise, quels articles les portent, quelle
   jurisprudence les éclaire, dans quel ordre on les régularise. Juris Expert
   PRODUIT : le contrat, le règlement intérieur, le registre du personnel, les
   documents des élections professionnelles, les accords et procès-verbaux de
   la négociation — imprimables, pré-remplis, prêts à signer.

   Le partage a été arrêté par l'utilisatrice, et il tient en une phrase :
   ce qui se constate reste ici, ce qui s'imprime part là-bas. Les élections
   professionnelles relèvent entièrement de Juris Expert.

   CE QUE CE FICHIER NE FAIT PAS. Il n'appelle rien, ne charge rien, n'envoie
   rien. Ce sont des liens, écrits en dur, vers un site public dont l'adresse
   a été VÉRIFIÉE (réponse 200 sur chacune des pages listées, le 22 août
   2026) — pas devinée. Un outil dont l'adresse n'a pas été vérifiée n'entre
   pas dans cette table.

   L'ADRESSE. Juris Expert est publié par GitHub Pages sur le dépôt
   « JURISTE-EXPERT- » du même compte. La casse du chemin compte : l'adresse
   en minuscules rend 404. Le dépôt porte aussi un netlify.toml, mais aucun
   nom de site Netlify n'y figure et aucune adresse Netlify n'a pu être
   vérifiée : on ne cite donc que GitHub Pages.

   LES DEUX FORMES DE LIEN.
   - Les pages autonomes de Juris Expert (élections, PSE, contrôle-minute,
     défense prud'homale) ont leur propre adresse : on y va directement.
   - Les modules qui vivent dans son index.html unique n'ont pas d'adresse
     propre aujourd'hui : le lien porte « #/<module> ». Tant que Juris Expert
     ne lit pas ce fragment, il ouvre son accueil — le renvoi reste juste, il
     est seulement moins précis. Le jour où il le lit, le lien tombe pile.
     C'est délibéré : aucun lien de cette table ne peut casser.             */
"use strict";
(function () {

  var BASE = "https://chm75009-sketch.github.io/JURISTE-EXPERT-/";

  /* La table des outils. `cible` est relative à BASE. `quoi` dit ce que
     l'outil imprime — c'est ce qui justifie le renvoi, et c'est ce que le
     client lit. */
  var OUTILS = {
    "elections": {
      nom: "Élections du comité social et économique",
      cible: "elections-cse.html",
      quoi: "protocole d'accord préélectoral, convocations, bulletins, feuille d'émargement, procès-verbaux, procès-verbal de carence",
    },
    "pse": {
      nom: "Plan de sauvegarde de l'emploi",
      cible: "pse.html",
      quoi: "la procédure guidée et les documents du licenciement économique collectif",
    },
    "controle-minute": {
      nom: "Contrôle-minute",
      cible: "controle-minute.html",
      quoi: "l'état de préparation à un contrôle, question par question",
    },
    "cph": {
      nom: "Défense prud'homale",
      cible: "defense-cph.html",
      quoi: "la chronologie des faits et le bordereau de pièces",
    },
    "ri": {
      nom: "Règlement intérieur",
      cible: "index.html#/ri",
      quoi: "le règlement intérieur complet et la procédure de mise en place (comité, dépôt, publicité)",
    },
    "discipline": {
      nom: "Discipline et licenciement",
      cible: "index.html#/disciplinaire",
      quoi: "les courriers de la procédure et le calcul des indemnités",
    },
    "registre": {
      nom: "Registre unique du personnel",
      cible: "index.html#/personnel",
      quoi: "le registre tenu, chiffré sur le poste, et son édition imprimable",
    },
    "embauche": {
      nom: "Embauche",
      cible: "index.html#/embauche",
      quoi: "contrat de travail, déclaration préalable à l'embauche, fiche de poste, liste de contrôle",
    },
    "cse-installation": {
      nom: "Installer le comité",
      cible: "index.html#/cseinst",
      quoi: "première réunion, bureau, référent, règlement intérieur du comité, documentation",
    },
    "cse-reunion": {
      nom: "Réunion du comité",
      cible: "index.html#/csereu",
      quoi: "convocation, ordre du jour, votes, procès-verbal",
    },
    "cse-budgets": {
      nom: "Budgets du comité",
      cible: "index.html#/csebud",
      quoi: "fonctionnement, activités sociales, transferts, comptes",
    },
    "cse-reclamations": {
      nom: "Réclamations",
      cible: "index.html#/csercl",
      quoi: "le registre des réclamations et les réponses écrites",
    },
    "nego": {
      nom: "Négociations obligatoires",
      cible: "index.html#/nego",
      quoi: "invitation, ordre du jour, bordereau des informations, accords, procès-verbal de désaccord, plan d'action égalité",
    },
    "harcelement": {
      nom: "Harcèlement — prévention et preuve",
      cible: "index.html#/harcele",
      quoi: "la procédure de signalement, l'enquête et le dossier de preuve imprimable",
    },
  };

  function existe(cle) {
    return !!(cle && Object.prototype.hasOwnProperty.call(OUTILS, cle));
  }

  function lien(cle) {
    return existe(cle) ? BASE + OUTILS[cle].cible : null;
  }

  function nom(cle) {
    return existe(cle) ? OUTILS[cle].nom : null;
  }

  function quoi(cle) {
    return existe(cle) ? OUTILS[cle].quoi : null;
  }

  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Le lien inline, tel qu'il s'insère dans une liste de renvois. Il porte
     rel="noopener" et s'ouvre dans un onglet : on ne fait pas perdre au
     client l'audit qu'il est en train de remplir. */
  function ancre(cle, libelle) {
    if (!existe(cle)) return "";
    return '<a class="jx" href="' + e(lien(cle)) + '" target="_blank" rel="noopener">' +
      e(libelle || ("Produire dans Juris Expert : " + OUTILS[cle].nom)) + " →</a>";
  }

  /* Le bandeau de tête, pour un modèle interne qui fait doublon avec un
     générateur de Juris Expert. Il ne retire rien : il dit où se trouve la
     version complète et imprimable. */
  function bandeau(cle, precision) {
    if (!existe(cle)) return "";
    return '<p class="renvoi-jx">La version complète et imprimable se génère dans ' +
      '<a href="' + e(lien(cle)) + '" target="_blank" rel="noopener">Juris Expert — ' +
      e(OUTILS[cle].nom) + "</a> : " + e(precision || OUTILS[cle].quoi) +
      ". Le modèle ci-dessous reste disponible ici : il montre la structure et " +
      "l'article qui la commande.</p>";
  }

  window.JurisExpert = {
    BASE: BASE, OUTILS: OUTILS,
    existe: existe, lien: lien, nom: nom, quoi: quoi,
    ancre: ancre, bandeau: bandeau,
  };
})();
