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


  /* ════════════════════════════════════════════════════════════════════════
     L'EMBAUCHE

     Cinq des trente-cinq obligations du module social renvoient au parcours
     « embauche », et ce parcours ne produisait aucun document : le client y
     était envoyé et n'y trouvait rien à signer. Trois pièces le comblent —
     la déclaration préalable, le contrat à durée indéterminée, le contrat à
     durée déterminée.
     ════════════════════════════════════════════════════════════════════════ */

  /* Les durées maximales d'essai, telles que L. 1221-19 les fixe, et les
     plafonds de renouvellement de L. 1221-21. Le renouvellement suppose un
     accord de branche étendu qui le prévoie : le document le dit, il ne le
     présume pas. */
  var ESSAI = {
    "ouvrier": { max: 2, plafond: 4, nom: "ouvriers et employés" },
    "employé": { max: 2, plafond: 4, nom: "ouvriers et employés" },
    "agent de maîtrise": { max: 3, plafond: 6, nom: "agents de maîtrise et techniciens" },
    "technicien": { max: 3, plafond: 6, nom: "agents de maîtrise et techniciens" },
    "cadre": { max: 4, plafond: 8, nom: "cadres" },
  };
  function essaiDe(cat) {
    var c = String(cat || "").toLowerCase();
    var k = Object.keys(ESSAI).filter(function (x) { return c.indexOf(x) >= 0; })[0];
    return ESSAI[k] || null;
  }

  function enteteContrat(ctx, titre, fondement) {
    var p = ctx.profil || {};
    return entete(ctx, titre, fondement).concat([
      "ENTRE LES SOUSSIGNÉS :",
      "",
      cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE") + ", dont le siège social est situé " +
        cro(p.adresse, "adresse du siège") + ", " + (p.siret ? "immatriculée sous le numéro SIRET " + p.siret : "[SIRET]") + ",",
      "représentée par " + cro(p.responsable, "nom et qualité du représentant légal") + ",",
      "",
      "Ci-après « l'employeur »,",
      "",
      "ET",
      "",
      "[NOM ET PRÉNOMS DU SALARIÉ], né(e) le [DATE DE NAISSANCE] à [LIEU],",
      "demeurant [ADRESSE], de nationalité [NATIONALITÉ],",
      "numéro de sécurité sociale [NUMÉRO],",
      "",
      "Ci-après « le salarié »,",
      "",
      "IL A ÉTÉ CONVENU CE QUI SUIT :",
      "",
    ]);
  }

  function clausesCommunes(L, p, d) {
    var ccn = cro(p.conventionCollective, "INTITULÉ DE LA CONVENTION COLLECTIVE ET IDCC");

    L.push("Article — Convention collective");
    L.push("Les relations entre les parties sont régies par la convention collective");
    L.push(ccn + ", dont un exemplaire est tenu à la disposition du salarié.");
    L.push("");
    L.push("NOTE — Vérifiez dans cette convention la classification, le coefficient, le");
    L.push("minimum conventionnel et la durée d'essai qu'elle prévoit : une clause moins");
    L.push("favorable que la convention est illicite.");
    L.push("");
    L.push("Article — Fonctions et classification");
    L.push("Le salarié est engagé en qualité de " + cro(d.emploi, "INTITULÉ DE L'EMPLOI") + ",");
    L.push("classification [NIVEAU, ÉCHELON, COEFFICIENT], statut " +
      cro(d.categorie, "ouvrier / employé / agent de maîtrise / technicien / cadre") + ".");
    L.push("Ses fonctions sont les suivantes : [DÉCRIRE LES TÂCHES PRINCIPALES].");
    L.push("");
    L.push("Article — Lieu de travail");
    L.push("Le salarié exerce ses fonctions à " + cro(d.lieu, "ADRESSE DU LIEU DE TRAVAIL") + ".");
    L.push("Cette mention est informative et ne constitue pas une clause de sédentarité.");
    L.push("");
    L.push("Article — Durée du travail");
    L.push("[TEMPS COMPLET : la durée du travail est de trente-cinq heures par semaine,");
    L.push("réparties selon l'horaire collectif affiché.]");
    L.push("");
    L.push("NOTE — TEMPS PARTIEL : si le salarié est à temps partiel, cet article doit");
    L.push("porter, à peine de requalification, les mentions de l'article L. 3123-6 : la");
    L.push("qualification, les éléments de la rémunération, la durée hebdomadaire ou");
    L.push("mensuelle prévue et la répartition de cette durée entre les jours de la");
    L.push("semaine ou les semaines du mois ; les cas dans lesquels une modification de");
    L.push("cette répartition peut intervenir et la nature de cette modification ; les");
    L.push("modalités selon lesquelles les horaires de chaque journée travaillée sont");
    L.push("communiqués par écrit ; et les limites dans lesquelles des heures");
    L.push("complémentaires peuvent être accomplies.");
    L.push("");
    L.push("Article — Rémunération");
    L.push("Le salarié perçoit une rémunération mensuelle brute de [MONTANT] euros pour");
    L.push("l'horaire ci-dessus, versée le [JOUR] de chaque mois.");
    L.push("[Le cas échéant : primes et accessoires — INTITULÉ, MONTANT, PÉRIODICITÉ.]");
    L.push("");
    L.push("Article — Retraite complémentaire et prévoyance");
    L.push("Le salarié est affilié à la caisse de retraite complémentaire [NOM ET ADRESSE]");
    L.push("et, le cas échéant, à l'organisme de prévoyance [NOM ET ADRESSE].");
    L.push("");
  }

  DP.ajouter("RH-CTL-EMB-01", {
    nom: "Le contrat de travail à durée indéterminée",
    detail: "Le contrat rédigé, avec la clause d'essai à la bonne durée et le " +
            "rappel des mentions du temps partiel.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = enteteContrat(ctx, "Contrat de travail à durée indéterminée",
        "articles L. 1221-1 et suivants du code du travail");

      L.push("Article — Engagement");
      L.push("Le salarié est engagé pour une durée indéterminée à compter du " +
        cro(d.dateEmbauche, "DATE D'EMBAUCHE") + ".");
      L.push("Cet engagement est subordonné au résultat de la visite d'information et de");
      L.push("prévention, ou de l'examen médical d'aptitude lorsque le poste en relève.");
      L.push("");

      var e = essaiDe(d.categorie);
      L.push("Article — Période d'essai");
      if (e) {
        L.push("Le contrat comporte une période d'essai de [DURÉE] mois, qui court à compter");
        L.push("du premier jour de travail.");
        L.push("");
        L.push("NOTE — Pour un salarié de la catégorie « " + e.nom + " », la durée maximale");
        L.push("est de " + e.max + " mois (L. 1221-19). Elle ne peut être renouvelée une fois que si");
        L.push("un accord de branche ÉTENDU le prévoit et en fixe les conditions ; le total,");
        L.push("renouvellement compris, ne peut alors dépasser " + e.plafond + " mois (L. 1221-21).");
      } else {
        L.push("Le contrat comporte une période d'essai de [DURÉE] mois, qui court à compter");
        L.push("du premier jour de travail.");
        L.push("");
        L.push("NOTE — La durée maximale dépend de la catégorie : deux mois pour les ouvriers");
        L.push("et employés, trois pour les agents de maîtrise et techniciens, quatre pour les");
        L.push("cadres (L. 1221-19). Le renouvellement suppose un accord de branche étendu qui");
        L.push("le prévoie ; le total ne peut alors dépasser quatre, six ou huit mois selon la");
        L.push("catégorie (L. 1221-21).");
      }
      L.push("");
      L.push("NOTE — « La période d'essai et la possibilité de la renouveler ne se présument");
      L.push("pas. Elles sont expressément stipulées dans la lettre d'engagement ou le");
      L.push("contrat de travail » (L. 1221-23). Une clause absente, c'est un contrat sans");
      L.push("essai.");
      L.push("");
      L.push("En cas de rupture de l'essai par l'employeur, le salarié est prévenu dans le");
      L.push("délai de l'article L. 1221-25 : vingt-quatre heures en deçà de huit jours de");
      L.push("présence, quarante-huit heures entre huit jours et un mois, deux semaines");
      L.push("après un mois, un mois après trois mois. Ce délai ne prolonge pas l'essai, et");
      L.push("son inexécution ouvre droit à une indemnité compensatrice.");
      L.push("");

      clausesCommunes(L, p, d);

      L.push("Article — Obligations générales");
      L.push("Le salarié se conforme aux instructions qui lui sont données et aux règles");
      L.push("de sécurité applicables à son poste. Il prend soin, en fonction de sa");
      L.push("formation et selon ses possibilités, de sa santé et de sa sécurité ainsi que");
      L.push("de celles des autres personnes concernées par ses actes ou ses omissions au");
      L.push("travail (L. 4122-1).");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui) + ", en deux exemplaires.");
      L.push("");
      L.push("L'employeur                                Le salarié");
      L.push(cro(p.responsable, "Nom et qualité") + "                    [NOM ET PRÉNOMS]");

      return L.join("\n");
    },
  });

  DP.ajouter("RH-CTL-EMB-02", {
    nom: "Le contrat à durée déterminée",
    detail: "Les huit mentions que l'article L. 1242-12 impose, et le délai de " +
            "transmission de deux jours ouvrables.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = enteteContrat(ctx, "Contrat de travail à durée déterminée",
        "articles L. 1242-1 et suivants du code du travail");

      L.push("Article 1 — Motif du recours");
      L.push("Le présent contrat est conclu pour le motif suivant : [ÉNONCER LE MOTIF");
      L.push("PRÉCIS — remplacement d'un salarié absent, accroissement temporaire");
      L.push("d'activité, emploi à caractère saisonnier, usage constant du secteur…].");
      L.push("");
      L.push("NOTE — C'EST LA MENTION QUI DÉCIDE DE TOUT. L'article L. 1242-12 exige « la");
      L.push("définition précise de son motif » et ajoute : « À défaut, il est réputé conclu");
      L.push("pour une durée indéterminée. » Un motif générique, ou l'absence d'écrit,");
      L.push("entraîne la requalification.");
      L.push("");
      L.push("[SI REMPLACEMENT — motifs des 1°, 4° et 5° de L. 1242-2 : nom et qualification");
      L.push("professionnelle de la personne remplacée : NOM, QUALIFICATION.]");
      L.push("");
      L.push("Article 2 — Durée");
      L.push("[TERME PRÉCIS : le contrat est conclu du [DATE] au [DATE] inclus.");
      L.push("Le cas échéant, clause de renouvellement : le contrat pourra être renouvelé");
      L.push("[NOMBRE] fois, pour une durée de [DURÉE], dans la limite de la durée maximale");
      L.push("applicable.]");
      L.push("");
      L.push("[SANS TERME PRÉCIS : le contrat est conclu pour une durée minimale de [DURÉE]");
      L.push("et prendra fin au retour de la personne remplacée ou à la réalisation de");
      L.push("l'objet pour lequel il a été conclu.]");
      L.push("");
      L.push("Article 3 — Poste de travail");
      L.push("Le salarié est engagé en qualité de " + cro(d.emploi, "INTITULÉ DE L'EMPLOI") + ",");
      L.push("classification [NIVEAU, ÉCHELON, COEFFICIENT].");
      L.push("[Le cas échéant : ce poste figure sur la liste des postes présentant des");
      L.push("risques particuliers pour la santé ou la sécurité établie en application de");
      L.push("l'article L. 4154-2, et le salarié bénéficie à ce titre d'une formation");
      L.push("renforcée à la sécurité.]");
      L.push("");
      L.push("Article 4 — Convention collective");
      L.push("La convention collective applicable est " +
        cro(p.conventionCollective, "INTITULÉ ET IDCC") + ".");
      L.push("");
      L.push("Article 5 — Période d'essai");
      L.push("Le contrat comporte une période d'essai de [DURÉE].");
      L.push("");
      L.push("NOTE — Elle se calcule à raison d'un jour par semaine de contrat, dans la");
      L.push("limite de deux semaines lorsque la durée initiale est au plus de six mois, et");
      L.push("d'un mois au-delà (L. 1242-10), sauf usages ou stipulations conventionnelles");
      L.push("plus favorables. Comme pour le contrat à durée indéterminée, elle ne se");
      L.push("présume pas et doit être écrite.");
      L.push("");
      L.push("Article 6 — Rémunération");
      L.push("Le salarié perçoit une rémunération mensuelle brute de [MONTANT] euros,");
      L.push("outre [PRIMES ET ACCESSOIRES, S'IL EN EXISTE].");
      L.push("À l'issue du contrat, il perçoit l'indemnité de fin de contrat lorsqu'elle est");
      L.push("due, ainsi que l'indemnité compensatrice de congés payés.");
      L.push("");
      L.push("Article 7 — Retraite complémentaire et prévoyance");
      L.push("Caisse de retraite complémentaire : [NOM ET ADRESSE].");
      L.push("Organisme de prévoyance, le cas échéant : [NOM ET ADRESSE].");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui) + ", en deux exemplaires.");
      L.push("");
      L.push("L'employeur                                Le salarié");
      L.push(cro(p.responsable, "Nom et qualité") + "                    [NOM ET PRÉNOMS]");
      L.push("");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("NOTE — LE DÉLAI, À NE PAS MANQUER");
      L.push("");
      L.push("« Le contrat de travail est transmis au salarié, au plus tard, dans les deux");
      L.push("jours ouvrables suivant l'embauche » (L. 1242-13). Faites signer le jour de");
      L.push("l'embauche, ou transmettez dans ce délai et gardez-en la preuve : la");
      L.push("transmission tardive est sanctionnée.");
      L.push("");
      L.push("Les huit mentions de l'article L. 1242-12, à vérifier une à une avant de");
      L.push("signer : le motif précis ; le nom et la qualification de la personne");
      L.push("remplacée s'il s'agit d'un remplacement ; la date du terme et, le cas échéant,");
      L.push("la clause de renouvellement ; ou la durée minimale s'il n'y a pas de terme");
      L.push("précis ; la désignation du poste, en précisant s'il figure sur la liste des");
      L.push("postes à risques particuliers ; l'intitulé de la convention collective ; la");
      L.push("durée de la période d'essai ; le montant de la rémunération et de ses");
      L.push("composantes ; le nom et l'adresse de la caisse de retraite complémentaire et,");
      L.push("le cas échéant, de l'organisme de prévoyance.");

      return L.join("\n");
    },
  });

  DP.ajouter("RH-CTL-EMB-03", {
    nom: "La déclaration préalable à l'embauche",
    detail: "Les mentions de l'article R. 1221-1, à réunir avant que le salarié " +
            "ne prenne son poste.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = entete(ctx, "Déclaration préalable à l'embauche",
        "articles L. 1221-10 et R. 1221-1 du code du travail");

      L.push("À QUOI SERT CE DOCUMENT");
      L.push("");
      L.push("La déclaration elle-même se fait en ligne, auprès de l'URSSAF ou de la");
      L.push("mutualité sociale agricole. Ce document n'en tient pas lieu : il réunit les");
      L.push("mentions exigées, pour que la saisie se fasse en une fois et que la preuve en");
      L.push("soit conservée. Joignez-y l'accusé de réception délivré par l'organisme.");
      L.push("");
      L.push("« L'embauche d'un salarié ne peut intervenir qu'APRÈS déclaration nominative");
      L.push("accomplie par l'employeur auprès des organismes de protection sociale");
      L.push("désignés à cet effet » (L. 1221-10). Avant, donc — jamais après.");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push("1. L'EMPLOYEUR (R. 1221-1, 1°)");
      L.push("");
      L.push("   Dénomination sociale : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("   Code APE : " + cro(p.ape, "CODE APE"));
      L.push("   Adresse : " + cro(p.adresse, "adresse de l'employeur"));
      L.push("   Numéro SIRET : " + (p.siret || "[SIRET]"));
      L.push("   Service de santé au travail dont l'employeur dépend : [NOM ET ADRESSE]");
      L.push("");
      L.push("2. LE SALARIÉ (R. 1221-1, 2°)");
      L.push("");
      L.push("   Nom et prénoms : " + cro(d.salarieEmbauche, "NOM ET PRÉNOMS"));
      L.push("   Sexe : [F / M]");
      L.push("   Date et lieu de naissance : [DATE] à [LIEU]");
      L.push("   Numéro national d'identification, s'il est déjà immatriculé : [NIR]");
      L.push("");
      L.push("3. L'EMBAUCHE (R. 1221-1, 3° et 4°)");
      L.push("");
      L.push("   Date d'embauche : " + cro(d.dateEmbauche, "DATE"));
      L.push("   Heure d'embauche : [HEURE]");
      L.push("   Nature du contrat : [CDI / CDD]");
      L.push("   Durée du contrat : [DURÉE, POUR UN CDD]");
      L.push("   Durée de la période d'essai : [DURÉE]");
      L.push("");
      L.push("   NOTE — La durée de l'essai n'est à déclarer que pour les contrats à durée");
      L.push("   indéterminée et les contrats à durée déterminée dont le terme ou la durée");
      L.push("   minimale excède six mois (R. 1221-1, 4°).");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));

      return L.join("\n");
    },
  });


  /* ════════════════════════════════════════════════════════════════════════
     LES ENTRETIENS DE PARCOURS PROFESSIONNEL
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-ENT-01", {
    nom: "Le document d'entretien de parcours professionnel",
    detail: "Les cinq sujets de l'article L. 6315-1, I, et la copie remise au salarié.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = entete(ctx, "Entretien de parcours professionnel",
        "article L. 6315-1, I, du code du travail");

      L.push("Entreprise : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Salarié : " + cro(d.salarie, "NOM ET PRÉNOMS") + " — emploi occupé : [EMPLOI]");
      L.push("Date d'entrée dans l'entreprise : [DATE]");
      L.push("Entretien tenu le : " + cro(d.dateEntretien, "DATE") + ", à [HEURE], pendant le temps de travail");
      L.push("Conduit par : [NOM ET QUALITÉ — supérieur hiérarchique ou représentant de la direction]");
      L.push("Motif : [premier entretien de la première année / entretien des quatre ans /");
      L.push("        entretien proposé au retour d'une absence longue]");
      L.push("");
      L.push("AVERTISSEMENT, À LIRE AVANT DE COMMENCER");
      L.push("");
      L.push("« L'entretien de parcours professionnel ne porte pas sur l'évaluation du");
      L.push("travail du salarié » (L. 6315-1, I). Un document qui note, apprécie ou");
      L.push("sanctionne la performance n'est pas cet entretien-là : c'est un entretien");
      L.push("d'évaluation, et le confondre avec celui-ci fait manquer l'obligation.");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push("1. COMPÉTENCES ET QUALIFICATIONS MOBILISÉES DANS L'EMPLOI ACTUEL,");
      L.push("   ET LEUR ÉVOLUTION POSSIBLE AU REGARD DES TRANSFORMATIONS DE L'ENTREPRISE");
      L.push("");
      L.push("   [À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("2. SITUATION ET PARCOURS PROFESSIONNELS, AU REGARD DES ÉVOLUTIONS DES");
      L.push("   MÉTIERS ET DES PERSPECTIVES D'EMPLOI DANS L'ENTREPRISE");
      L.push("");
      L.push("   [À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("3. BESOINS DE FORMATION — liés à l'activité actuelle, à l'évolution de");
      L.push("   l'emploi au regard des transformations de l'entreprise, ou à un projet");
      L.push("   personnel");
      L.push("");
      L.push("   [À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("4. SOUHAITS D'ÉVOLUTION PROFESSIONNELLE");
      L.push("");
      L.push("   [À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("   Suites envisagées, le cas échéant : reconversion interne ou externe,");
      L.push("   projet de transition professionnelle, bilan de compétences, validation");
      L.push("   des acquis de l'expérience. [PRÉCISER]");
      L.push("");
      L.push("5. COMPTE PERSONNEL DE FORMATION — activation par le salarié, abondements");
      L.push("   que l'employeur est susceptible de financer, conseil en évolution");
      L.push("   professionnelle");
      L.push("");
      L.push("   Le salarié a été informé de la possibilité d'activer son compte, des");
      L.push("   abondements éventuels et du conseil en évolution professionnelle.");
      L.push("   Observations : [À REMPLIR]");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push("ACTIONS DÉCIDÉES ET ÉCHÉANCES");
      L.push("");
      L.push("   [ACTION] — responsable : [QUI] — échéance : [DATE]");
      L.push("");
      L.push("Observations du salarié : [ESPACE LAISSÉ AU SALARIÉ]");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui) + ", en deux exemplaires.");
      L.push("");
      L.push("Pour l'employeur                           Le salarié");
      L.push("[NOM ET QUALITÉ]                          " + cro(d.salarie, "Nom et prénoms"));
      L.push("");
      L.push("NOTE — L'entretien « donne lieu à la rédaction d'un document dont une copie");
      L.push("est remise au salarié » (L. 6315-1, I). Remettez cette copie et gardez la");
      L.push("trace de la remise : c'est elle qui prouve que l'entretien a eu lieu.");

      return L.join("\n");
    },
  });

  DP.ajouter("RH-CTL-ENT-02", {
    nom: "L'état des lieux récapitulatif des huit ans",
    detail: "Le récapitulatif de l'article L. 6315-1, II, et la copie remise au salarié.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = entete(ctx, "État des lieux récapitulatif du parcours professionnel",
        "article L. 6315-1, II, du code du travail");

      L.push("Entreprise : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Salarié : " + cro(d.salarie, "NOM ET PRÉNOMS") + " — ancienneté depuis le [DATE]");
      L.push("État des lieux établi le : " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Cet état des lieux est fait tous les huit ans, à l'occasion de l'entretien");
      L.push("de parcours professionnel. Lorsqu'il s'agit du premier après l'embauche, il");
      L.push("peut être réalisé sept ans après le premier entretien ; la durée s'apprécie");
      L.push("par référence à l'ancienneté du salarié dans l'entreprise (L. 6315-1, II).");
      L.push("");
      L.push("1. LES ENTRETIENS DES HUIT DERNIÈRES ANNÉES");
      L.push("");
      L.push("   Date de l'entretien       Motif                  Document remis le");
      L.push("   [DATE]                    [PREMIER / QUATRE ANS] [DATE]");
      L.push("   (une ligne par entretien tenu)");
      L.push("");
      L.push("   NOTE — L'objet de ce tableau est de « vérifier que le salarié a bénéficié");
      L.push("   au cours des huit dernières années des entretiens de parcours");
      L.push("   professionnels prévus au I ». Une ligne manquante est un manquement");
      L.push("   constaté par l'employeur lui-même : mieux vaut le voir ici qu'ailleurs.");
      L.push("");
      L.push("2. LE PARCOURS SUR LA PÉRIODE");
      L.push("");
      L.push("   Emplois successivement occupés : [LISTER, AVEC LES PÉRIODES]");
      L.push("   Actions de formation suivies : [LISTER, AVEC LES DATES ET LES DURÉES]");
      L.push("   Éléments de certification acquis par la formation ou par la validation");
      L.push("   des acquis de l'expérience : [LISTER]");
      L.push("   Progression salariale ou professionnelle : [DÉCRIRE]");
      L.push("");
      L.push("3. CONCLUSIONS ET SUITES");
      L.push("");
      L.push("   [À REMPLIR]");
      L.push("");
      L.push("Observations du salarié : [ESPACE LAISSÉ AU SALARIÉ]");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui) + ", en deux exemplaires.");
      L.push("");
      L.push("Pour l'employeur                           Le salarié");
      L.push("[NOM ET QUALITÉ]                          " + cro(d.salarie, "Nom et prénoms"));
      L.push("");
      L.push("NOTE — Comme l'entretien lui-même, cet état des lieux « donne lieu à la");
      L.push("rédaction d'un document dont une copie est remise au salarié ».");

      return L.join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LES CONGÉS PAYÉS
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-CGP-01", {
    nom: "L'avis de période de prise des congés",
    detail: "À porter à la connaissance des salariés deux mois au moins avant " +
            "l'ouverture de la période.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = entete(ctx, "Période de prise des congés payés — avis au personnel",
        "articles L. 3141-13 et D. 3141-5 du code du travail");

      L.push("AVIS AU PERSONNEL");
      L.push("");
      L.push("La période de prise des congés payés est fixée du " +
        cro(d.debutPeriode, "DATE DE DÉBUT") + " au " + cro(d.finPeriode, "DATE DE FIN") + ".");
      L.push("");
      L.push("Cette période comprend, comme la loi l'exige dans tous les cas, la période");
      L.push("du 1er mai au 31 octobre (L. 3141-13).");
      L.push("");
      L.push("[LE CAS ÉCHÉANT : cette période est celle que fixe l'accord d'entreprise ou,");
      L.push("à défaut, la convention ou l'accord de branche du [DATE].]");
      L.push("");
      L.push("[À DÉFAUT D'ACCORD : cette période est fixée par l'employeur après avis du");
      L.push("comité social et économique, recueilli le [DATE].]");
      L.push("");
      L.push("Les demandes de congés sont adressées à [DESTINATAIRE] avant le [DATE].");
      L.push("L'ordre des départs sera communiqué à chaque salarié un mois au moins avant");
      L.push("son départ.");
      L.push("");
      L.push("Affiché le " + leJour(ctx.aujourdhui) + " à " + cro(p.adresse, "lieu d'affichage") + ".");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("NOTE — LE DÉLAI, ET IL SE COMPTE À REBOURS");
      L.push("");
      L.push("« La période de prise des congés payés est portée par l'employeur à la");
      L.push("connaissance des salariés au moins DEUX MOIS avant l'ouverture de cette");
      L.push("période » (D. 3141-5). Si la période s'ouvre le 1er mai, l'avis est affiché");
      L.push("le 1er mars au plus tard. Datez l'affichage et conservez-en la preuve.");

      return L.join("\n");
    },
  });

  DP.ajouter("RH-CTL-CGP-02", {
    nom: "La communication de l'ordre des départs",
    detail: "L'ordre des départs et ses critères, communiqué un mois au moins " +
            "avant chaque départ.",
    produire: function (ctx) {
      var p = ctx.profil || {}, d = ctx.donnees || {};
      var L = entete(ctx, "Ordre des départs en congé — communication",
        "articles L. 3141-16 et D. 3141-6 du code du travail");

      L.push("ORDRE DES DÉPARTS EN CONGÉ");
      L.push("Période de prise : " + cro(d.debutPeriode, "DATE") + " — " + cro(d.finPeriode, "DATE"));
      L.push("");
      L.push("   Salarié                  Dates de congé accordées      Notifié le");
      L.push("   [NOM ET PRÉNOMS]         du [DATE] au [DATE]           [DATE]");
      L.push("   (une ligne par salarié)");
      L.push("");
      L.push("LES CRITÈRES SUR LESQUELS CET ORDRE A ÉTÉ ARRÊTÉ");
      L.push("");
      L.push("[LE CAS ÉCHÉANT : ceux que fixe l'accord d'entreprise ou de branche du");
      L.push("[DATE], à savoir : ÉNUMÉRER.]");
      L.push("");
      L.push("[À DÉFAUT DE STIPULATION CONVENTIONNELLE, les critères de l'article");
      L.push("L. 3141-16, appliqués à chaque situation :");
      L.push("  — la situation de famille des bénéficiaires, notamment les possibilités de");
      L.push("    congé du conjoint ou du partenaire lié par un pacte civil de solidarité,");
      L.push("    et la présence au foyer d'un enfant ou d'un adulte handicapé ou d'une");
      L.push("    personne âgée en perte d'autonomie ;");
      L.push("  — la durée des services chez l'employeur ;");
      L.push("  — l'activité éventuelle du salarié chez un ou plusieurs autres employeurs.");
      L.push("L'avis du comité social et économique a été recueilli le [DATE], s'il en");
      L.push("existe un.]");
      L.push("");
      L.push("MOTIF DES DEMANDES NON SATISFAITES");
      L.push("");
      L.push("   [NOM] — demande du [DATE] au [DATE] — critère appliqué : [LEQUEL]");
      L.push("   (une ligne par refus ; une phrase suffit, l'absence de phrase ne suffit");
      L.push("   jamais)");
      L.push("");
      L.push("Communiqué le " + leJour(ctx.aujourdhui) + " par " +
        cro(d.moyen, "MOYEN — affichage, courriel, remise en main propre") + ".");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("NOTE — DEUX DÉLAIS À NE PAS CONFONDRE");
      L.push("");
      L.push("« L'ordre des départs en congé est communiqué, par tout moyen, à chaque");
      L.push("salarié UN MOIS avant son départ » (D. 3141-6). Ce délai court par salarié,");
      L.push("non pour l'ensemble du personnel.");
      L.push("");
      L.push("Et une fois l'ordre communiqué, l'employeur « ne peut, sauf circonstances");
      L.push("exceptionnelles, modifier l'ordre et les dates de départ moins d'un mois");
      L.push("avant la date prévue » (L. 3141-16, dernier alinéa). Une réorganisation");
      L.push("prévisible n'est pas une circonstance exceptionnelle.");

      return L.join("\n");
    },
  });

})(typeof window !== "undefined" ? window : this);
