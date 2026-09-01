/* Les documents que l'application PRODUIT — la gestion du personnel.

   POURQUOI CE FICHIER EXISTE

   Mesuré le 1er septembre 2026, en passant sept effectifs dans les quinze
   parcours : cinq d'entre eux ne produisaient AUCUN document. Registre unique
   du personnel, embauche, entretiens professionnels, congés payés, fin de
   contrat — quarante-cinq étapes qui expliquent, et rien à signer au bout.
   C'est la contradiction directe de ce que le volet « non » promet : celui qui
   n'a pas de registre n'a pas non plus le registre à remplir.

   Ce fichier écrit ces pièces. Il commence par celles de la sortie et du
   registre, qui sont les plus contraintes — leur contenu est fixé par décret,
   mot pour mot, et c'est justement ce qui les rend fautives quand elles sont
   improvisées.

   DEUX RÈGLES, TENUES PARTOUT

   1. Rien qui n'ait été lu à la source. Chaque article cité ici a été relu au
      relais Légifrance le 1er septembre 2026, avec son identifiant de version.

   2. Le contenu limitatif est respecté comme tel. D. 1234-6 dit que le
      certificat de travail contient « exclusivement » deux mentions : le
      document produit ne va pas au-delà, et dit pourquoi. Un certificat qui
      porte un motif de rupture ou une appréciation est une faute, pas un
      supplément.                                                             */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-rh.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, entete = O.entete;

  /* ════════════════════════════════════════════════════════════════════════
     LE REGISTRE UNIQUE DU PERSONNEL
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-REG-01", {
    nom: "Le registre unique du personnel, à ouvrir et à tenir",
    detail: "Le registre lui-même, ses deux parties, ses treize indications " +
            "complémentaires et la règle de mise à jour.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var L = [];

      L = L.concat(entete(ctx, "Registre unique du personnel",
        "articles L. 1221-13, D. 1221-23 à D. 1221-25 du code du travail"));

      L.push("COMMENT SE SERVIR DE CE DOCUMENT");
      L.push("");
      L.push("Ce document est le registre lui-même : imprimez-le, ou reportez ses");
      L.push("colonnes dans votre tableur ou votre logiciel de paie. Un registre par");
      L.push("établissement — l'article L. 1221-13 le veut « dans tout établissement où");
      L.push("sont employés des salariés », et non un seul pour l'entreprise.");
      L.push("");
      L.push("Les lignes qui commencent par NOTE ne font pas partie du registre.");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");

      L.push("REGISTRE UNIQUE DU PERSONNEL");
      L.push("");
      L.push("Établissement : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Adresse de l'établissement : " + cro(p.adresse, "adresse de l'établissement"));
      L.push("Registre ouvert le : [DATE D'OUVERTURE]");
      L.push("");
      L.push("PREMIÈRE PARTIE — LES SALARIÉS");
      L.push("");
      L.push("Les noms et prénoms de tous les salariés sont inscrits DANS L'ORDRE DES");
      L.push("EMBAUCHES, au moment de l'embauche, et de façon indélébile (L. 1221-13).");
      L.push("");
      L.push("Pour chaque salarié, les treize indications complémentaires de l'article");
      L.push("D. 1221-23 :");
      L.push("");
      L.push("   n° d'ordre :");
      L.push("   1. Nom et prénoms :");
      L.push("   2. Nationalité :");
      L.push("   3. Date de naissance :");
      L.push("   4. Sexe :");
      L.push("   5. Emploi :");
      L.push("   6. Qualification :");
      L.push("   7. Date d'entrée dans l'établissement :");
      L.push("      Date de sortie de l'établissement :");
      L.push("   8. Lorsqu'une autorisation d'embauche ou de licenciement est requise,");
      L.push("      date de cette autorisation ou, à défaut, date de la demande :");
      L.push("   9. Pour un travailleur étranger assujetti à la possession d'un titre");
      L.push("      autorisant l'exercice d'une activité salariée : type et numéro");
      L.push("      d'ordre du titre valant autorisation de travail :");
      L.push("  10. Mention « contrat à durée déterminée », s'il y a lieu :");
      L.push("  11. Mention « salarié temporaire », s'il y a lieu, avec le nom et");
      L.push("      l'adresse de l'entreprise de travail temporaire :");
      L.push("  12. Mention « mis à disposition par un groupement d'employeurs », s'il");
      L.push("      y a lieu, avec la dénomination et l'adresse du groupement :");
      L.push("  13. Mention « salarié à temps partiel », s'il y a lieu :");
      L.push("      Mention « apprenti » ou « contrat de professionnalisation », s'il");
      L.push("      y a lieu :");
      L.push("");
      L.push("(Reproduire ce bloc autant de fois qu'il y a de salariés, dans l'ordre");
      L.push("des embauches. Aucune ligne ne se réécrit ni ne s'efface : les mentions");
      L.push("sont portées de façon indélébile.)");
      L.push("");
      L.push("SECONDE PARTIE — STAGIAIRES ET VOLONTAIRES EN SERVICE CIVIQUE");
      L.push("");
      L.push("Partie spécifique et distincte de la précédente (L. 1221-13, troisième");
      L.push("alinéa). Les noms et prénoms des stagiaires et des personnes volontaires");
      L.push("en service civique accueillis dans l'établissement y sont inscrits DANS");
      L.push("L'ORDRE D'ARRIVÉE.");
      L.push("");
      L.push("   n° d'ordre :");
      L.push("   Nom et prénoms :");
      L.push("   Qualité (stagiaire / volontaire en service civique) :");
      L.push("   Date d'arrivée :");
      L.push("   Date de départ :");
      L.push("");
      L.push("ANNEXE — TITRES DE TRAVAIL DES TRAVAILLEURS ÉTRANGERS");
      L.push("");
      L.push("Une copie des titres autorisant l'exercice d'une activité salariée des");
      L.push("travailleurs étrangers est annexée au registre et rendue accessible aux");
      L.push("membres de la délégation du personnel du comité social et économique");
      L.push("ainsi qu'aux agents chargés de veiller à l'application du code du travail");
      L.push("et du code de la sécurité sociale. Elle est tenue à leur disposition soit");
      L.push("dans l'établissement, soit sur chaque chantier ou lieu de travail distinct");
      L.push("de l'établissement pour ceux des travailleurs étrangers qui y sont");
      L.push("employés (D. 1221-24).");
      L.push("");
      L.push("RÈGLE DE MISE À JOUR");
      L.push("");
      L.push("Les mentions relatives à des événements postérieurs à l'embauche du");
      L.push("salarié, ou à l'arrivée du stagiaire, sont portées sur le registre AU");
      L.push("MOMENT OÙ CEUX-CI SURVIENNENT (D. 1221-25). Une mise à jour mensuelle ou");
      L.push("trimestrielle ne satisfait pas le texte.");
      L.push("");
      L.push("NOTE — Le registre se tient à la disposition des membres de la délégation");
      L.push("du personnel du comité social et économique et des agents de contrôle. Un");
      L.push("support informatique est admis, mais il doit offrir les mêmes garanties");
      L.push("que le support papier, à commencer par l'inaltérabilité des inscriptions :");
      L.push("un tableur que chacun peut réécrire sans trace n'y répond pas.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));

      return L.join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LE CERTIFICAT DE TRAVAIL

     D. 1234-6 : le certificat contient « EXCLUSIVEMENT » deux mentions. Les
     3° et 4° de l'article sont abrogés. Tout ce que l'usage y ajoute — motif
     de la rupture, appréciation sur le travail, mention de la portabilité —
     déborde le texte ; la portabilité de la prévoyance se notifie, elle ne
     s'inscrit pas ici.
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-FIN-01", {
    nom: "Le certificat de travail",
    detail: "Les deux seules mentions que le décret autorise, et rien d'autre.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = [];

      L = L.concat(entete(ctx, "Certificat de travail",
        "articles L. 1234-19 et D. 1234-6 du code du travail"));

      L.push("CERTIFICAT DE TRAVAIL");
      L.push("");
      L.push("Je soussigné, " + cro(p.responsable, "nom et qualité du représentant légal") + ",");
      L.push("agissant pour la société " + cro(p.denomination || p.entreprise, "DÉNOMINATION") + ",");
      L.push("dont le siège est " + cro(p.adresse, "adresse du siège") + ",");
      L.push("");
      L.push("certifie que " + cro(d.salarieSortie, "NOM ET PRÉNOMS DU SALARIÉ"));
      L.push("");
      L.push("  — est entré à mon service le " + cro(d.dateEmbauche, "DATE D'ENTRÉE") + " ;");
      L.push("  — en est sorti le " + cro(d.dateSortie, "DATE DE SORTIE") + " ;");
      L.push("");
      L.push("  — y a occupé le ou les emplois suivants, aux périodes indiquées :");
      L.push("");
      L.push("      [EMPLOI OCCUPÉ], du [DATE] au [DATE]");
      L.push("      (répéter pour chaque emploi successivement tenu)");
      L.push("");
      L.push("En foi de quoi ce certificat est délivré au salarié pour servir et valoir");
      L.push("ce que de droit.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("NOTE — À LIRE AVANT DE SIGNER, PUIS À SUPPRIMER");
      L.push("");
      L.push("L'article D. 1234-6 dit que le certificat de travail contient");
      L.push("« EXCLUSIVEMENT » les mentions suivantes : la date d'entrée du salarié et");
      L.push("celle de sa sortie, et la nature de l'emploi ou des emplois");
      L.push("successivement occupés avec les périodes pendant lesquelles ces emplois");
      L.push("ont été tenus. Ses 3° et 4° sont abrogés.");
      L.push("");
      L.push("N'ajoutez donc RIEN : ni le motif de la rupture, ni une appréciation sur");
      L.push("le travail ou la conduite, ni une mention de solde de tout compte, ni la");
      L.push("qualification conventionnelle si elle ne correspond pas à l'emploi tenu.");
      L.push("Un certificat qui porte un motif de rupture défavorable expose l'employeur");
      L.push("à réparer le préjudice qui en résulte pour la recherche d'emploi.");
      L.push("");
      L.push("La date de sortie est celle du terme du contrat, préavis compris lorsqu'il");
      L.push("est exécuté — non celle de la notification du licenciement.");
      L.push("");
      L.push("Le certificat est délivré à l'expiration du contrat (L. 1234-19). Il est");
      L.push("quérable : tenez-le à disposition et gardez la trace de sa mise à");
      L.push("disposition ou de son envoi.");

      return L.join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LE REÇU POUR SOLDE DE TOUT COMPTE
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-FIN-02", {
    nom: "Le reçu pour solde de tout compte",
    detail: "L'inventaire des sommes versées, en double exemplaire, avec la " +
            "mention du double et le délai de dénonciation de six mois.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = [];

      L = L.concat(entete(ctx, "Reçu pour solde de tout compte",
        "articles L. 1234-20 et D. 1234-7 du code du travail"));

      L.push("REÇU POUR SOLDE DE TOUT COMPTE");
      L.push("");
      L.push("Entre la société " + cro(p.denomination || p.entreprise, "DÉNOMINATION") + ",");
      L.push(cro(p.adresse, "adresse du siège") + ",");
      L.push("et " + cro(d.salarieSortie, "NOM ET PRÉNOMS DU SALARIÉ") + ",");
      L.push("dont le contrat de travail a pris fin le " + cro(d.dateSortie, "DATE DE SORTIE") + ".");
      L.push("");
      L.push("INVENTAIRE DES SOMMES VERSÉES LORS DE LA RUPTURE");
      L.push("");
      L.push("Le solde de tout compte fait l'inventaire des sommes versées au salarié");
      L.push("lors de la rupture du contrat de travail (L. 1234-20). Chaque somme est");
      L.push("désignée séparément, avec son montant : une somme globale ne vaut");
      L.push("inventaire d'aucune d'entre elles.");
      L.push("");
      L.push("   Salaire du mois de [MOIS] ....................... [MONTANT] €");
      L.push("   Rappel de salaire, s'il y a lieu ................ [MONTANT] €");
      L.push("   Heures supplémentaires, s'il y a lieu ........... [MONTANT] €");
      L.push("   Indemnité compensatrice de congés payés ......... [MONTANT] €");
      L.push("   Indemnité compensatrice de préavis, s'il y a lieu [MONTANT] €");
      L.push("   Indemnité de licenciement, s'il y a lieu ........ [MONTANT] €");
      L.push("   Indemnité de fin de contrat (CDD), s'il y a lieu  [MONTANT] €");
      L.push("   Prime ou gratification [INTITULÉ] ............... [MONTANT] €");
      L.push("   Épargne salariale [INTITULÉ] .................... [MONTANT] €");
      L.push("   [AUTRE SOMME — À DÉSIGNER] ..................... [MONTANT] €");
      L.push("");
      L.push("   TOTAL BRUT ..................................... [MONTANT] €");
      L.push("   Cotisations et contributions salariales ......... [MONTANT] €");
      L.push("   TOTAL NET VERSÉ ................................ [MONTANT] €");
      L.push("");
      L.push("Le présent reçu est établi en DEUX EXEMPLAIRES, dont l'un est remis au");
      L.push("salarié (D. 1234-7). Mention en est faite sur le reçu, comme le même");
      L.push("article l'exige : la présente phrase y pourvoit.");
      L.push("");
      L.push("Le reçu pour solde de tout compte peut être dénoncé dans les six mois qui");
      L.push("suivent sa signature, délai au-delà duquel il devient libératoire pour");
      L.push("l'employeur pour les sommes qui y sont mentionnées (L. 1234-20).");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui) + ", en deux exemplaires.");
      L.push("");
      L.push("Pour la société                          Le salarié");
      L.push(cro(p.responsable, "Nom et qualité") + "        " +
             cro(d.salarieSortie, "Nom et prénoms"));
      L.push("");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("NOTE — À LIRE AVANT DE SIGNER, PUIS À SUPPRIMER");
      L.push("");
      L.push("L'effet libératoire ne joue que pour LES SOMMES MENTIONNÉES. Une somme");
      L.push("absente de l'inventaire reste réclamable après les six mois : c'est");
      L.push("l'inventaire, et non la signature, qui protège l'employeur. Détaillez donc");
      L.push("chaque poste plutôt que d'écrire un total.");
      L.push("");
      L.push("Ne faites signer aucune formule de renonciation : le reçu pour solde de");
      L.push("tout compte n'est pas une transaction, et une clause par laquelle le");
      L.push("salarié renoncerait à toute réclamation n'y a pas sa place.");
      L.push("");
      L.push("Le double remis au salarié n'est pas facultatif : sans lui, et sans la");
      L.push("mention du double portée sur le reçu, le texte n'est pas respecté.");

      return L.join("\n");
    },
  });

})(typeof window !== "undefined" ? window : this);
