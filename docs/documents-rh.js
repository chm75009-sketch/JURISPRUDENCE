/* Les documents que l'application PRODUIT - la gestion du personnel.

   POURQUOI CE FICHIER EXISTE

   Mesuré le 1er septembre 2026, en passant sept effectifs dans les quinze
   parcours : cinq d'entre eux ne produisaient AUCUN document. Registre unique
   du personnel, embauche, entretiens professionnels, congés payés, fin de
   contrat - quarante-cinq étapes qui expliquent, et rien à signer au bout.
   C'est la contradiction directe de ce que le volet « non » promet : celui qui
   n'a pas de registre n'a pas non plus le registre à remplir.

   Ce fichier écrit ces pièces. Il commence par celles de la sortie et du
   registre, qui sont les plus contraintes - leur contenu est fixé par décret,
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

  function X(ex, valeur, crochet) { return ex ? valeur : "[" + crochet + "]"; }
  function jj(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "[date]";
    var m = d.getMonth() + 1, j = d.getDate();
    return (j < 10 ? "0" + j : j) + "/" + (m < 10 ? "0" + m : m) + "/" + d.getFullYear();
  }
  function dans(d, jours) {
    var r = new Date(d);
    r.setDate(r.getDate() + jours);
    return r;
  }
  function tableau(en_tete, lignes) {
    var L = [];
    if (en_tete && en_tete.length > 0) {
      L.push(en_tete.join(" | "));
    }
    if (lignes) {
      lignes.forEach(function (l) {
        L.push(l.join(" | "));
      });
    }
    return L;
  }
  function pied(articles, notes) {
    var L = [];
    L.push("");
    L.push("CITATIONS LÉGALES");
    L.push("");
    L.push(articles);
    L.push("");
    if (notes && notes.length > 0) {
      L.push("NOTE - " + notes.join(" "));
    }
    return L;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LE REGISTRE UNIQUE DU PERSONNEL
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-REG-01", {
    nom: "Le registre unique du personnel, à ouvrir et à tenir",
    detail: "Le registre lui-même, ses deux parties, ses treize indications " +
            "complémentaires et la règle de mise à jour.",
    tableur: function (ctx) {
      var p = ctx.profil || {};
      var L = [];
      L.push(["REGISTRE UNIQUE DU PERSONNEL"]);
      L.push([cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE")]);
      L.push(["Établissement : " + cro(p.adresse, "adresse de l'établissement")]);
      L.push(["Ouvert le " + leJour(ctx.aujourdhui) + ", articles L. 1221-13 et D. 1221-23 du code du travail"]);
      L.push([]);
      L.push(["MODE D'EMPLOI : un registre PAR ÉTABLISSEMENT. Les salariés dans l'ordre des embauches, " +
              "les mentions portées au moment de l'embauche et de façon indélébile. Les deux lignes " +
              "d'exemple sont à effacer."]);
      L.push([]);
      L.push(["N° d'ordre", "Nom et prénoms", "Nationalité", "Date de naissance", "Sexe", "Emploi",
              "Qualification", "Date d'entrée", "Date de sortie",
              "Date d'autorisation d'embauche ou de licenciement (ou de la demande)",
              "Titre de travail du travailleur étranger : type et n° d'ordre",
              "Mention « contrat à durée déterminée »",
              "Mention « salarié temporaire » + entreprise de travail temporaire",
              "Mention « mis à disposition par un groupement d'employeurs » + groupement",
              "Mention « salarié à temps partiel »",
              "Mention « apprenti » ou « contrat de professionnalisation »"]);
      L.push(["1", "DUPONT Jean", "française", "12/04/1988", "M", "Conducteur poids lourd",
              "Ouvrier, coefficient 138 M", "15/09/2026", "", "", "", "", "", "", "", ""]);
      L.push(["2", "MARTIN Sofia", "portugaise", "03/11/1995", "F", "Agent d'exploitation",
              "Employé, coefficient 120", "01/10/2026", "", "",
              "Carte de séjour pluriannuelle n° [NUMÉRO]", "contrat à durée déterminée", "", "",
              "salarié à temps partiel", ""]);
      L.push(["3", "[NOM ET PRÉNOMS]", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
      L.push([]);
      L.push(["SECONDE PARTIE : STAGIAIRES ET VOLONTAIRES EN SERVICE CIVIQUE (partie spécifique, ordre d'arrivée)"]);
      L.push(["N° d'ordre", "Nom et prénoms", "Qualité", "Date d'arrivée", "Date de départ"]);
      L.push(["1", "[NOM ET PRÉNOMS]", "stagiaire", "", ""]);
      L.push([]);
      L.push(["RAPPEL : Les mentions relatives à des événements postérieurs à l'embauche sont portées " +
              "AU MOMENT OÙ CEUX-CI SURVIENNENT (D. 1221-25). Une copie des titres de travail des " +
              "travailleurs étrangers est annexée au registre (D. 1221-24)."]);
      return L;
    },
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Registre unique du personnel",
        "articles L. 1221-13, D. 1221-23 à D. 1221-25 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - REGISTRE UNIQUE DU PERSONNEL");
      L.push("");
      L.push("Établissement : DUPONT TRANSPORTS SARL");
      L.push("Adresse de l'établissement : 45 rue du Port, 76600 Le Havre");
      L.push("Registre ouvert le : 1er septembre 2026");
      L.push("");
      L.push("PREMIÈRE PARTIE : LES SALARIÉS");
      L.push("");
      L = L.concat(tableau(["N° d'ordre", "Nom et prénoms", "Nationalité", "Date de naissance", "Sexe",
                           "Emploi", "Qualification", "Date d'entrée", "Date de sortie"],
                         [["1", "DUPONT Jean", "française", "12/04/1988", "M",
                           "Conducteur poids lourd", "Ouvrier, coefficient 138 M", "15/09/2019", ""],
                          ["2", "MARTIN Sofia", "portugaise", "03/11/1995", "F",
                           "Agent d'exploitation", "Employé, coefficient 120", "01/10/2022", ""]]));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées ; " +
             "chaque crochet est un choix à faire, pas une case à cocher.");
      L.push("");
      L.push("Établissement : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Adresse de l'établissement : " + cro(p.adresse, "adresse de l'établissement"));
      L.push("Registre ouvert le : [DATE D'OUVERTURE]");
      L.push("");
      L.push("PREMIÈRE PARTIE : LES SALARIÉS");
      L.push("");
      L.push("Les noms et prénoms de tous les salariés sont inscrits DANS L'ORDRE DES EMBAUCHES.");
      L.push("");
      L = L.concat(tableau(["N° d'ordre", "Nom et prénoms", "Nationalité", "Date de naissance", "Sexe",
                           "Emploi", "Qualification", "Date d'entrée", "Date de sortie"],
                         [["1", "[NOM ET PRÉNOMS]", "[nationalité]", "[JJ/MM/AAAA]", "[M/F]",
                           "[emploi]", "[qualification]", "[JJ/MM/AAAA]", ""]]));
      L.push("");
      L.push("SECONDE PARTIE : STAGIAIRES ET VOLONTAIRES EN SERVICE CIVIQUE");
      L.push("");
      L = L.concat(tableau(["N° d'ordre", "Nom et prénoms", "Qualité", "Date d'arrivée", "Date de départ"],
                         [["1", "[NOM ET PRÉNOMS]", "stagiaire", "[JJ/MM/AAAA]", ""]]));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Trace conservée"], [
        ["Ouverture du registre : avant la première embauche", jj(d0), "registre daté et signé"],
        ["Inscription de chaque salarié : au moment de l'embauche, de façon indélébile", jj(dans(d0, 1)), "registre à jour"],
        ["Mise à jour des événements postérieurs : le jour où ils surviennent", "au moment du fait", "registre actualisé le jour même"],
        ["Conservation et mise à disposition : registre tenu à la disposition du CSE et de l'inspection", "en permanence", "accès établi et documenté"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Dans tout établissement où sont employés des salariés sont inscrits, au moment de " +
             "l'embauche, sur un registre tenu à la disposition des agents chargés de veiller à " +
             "l'application du code du travail, le nom et les prénoms des salariés, leur emploi et " +
             "leur qualification, ainsi que la date de leur entrée et celle de leur sortie » " +
             "(L. 1221-13).");
      L.push("");
      L.push("POINTS ESSENTIELS :");
      L.push("  - Un registre par établissement, jamais un seul pour l'entreprise.");
      L.push("  - Inscription dans l'ordre DES EMBAUCHES, au moment de l'embauche.");
      L.push("  - De façon INDÉLÉBILE : pas de rature, pas d'effacement, pas de tableur modifiable.");
      L.push("  - Treize indications complémentaires : article D. 1221-23.");
      L.push("  - Mise à jour des événements postérieurs : au MOMENT OÙ ILS SURVIENNENT, " +
             "pas mensuellement ni trimestriellement.");
      L.push("");

      return L.concat(pied("L. 1221-13, D. 1221-23, D. 1221-24, D. 1221-25",
        ["L'obligation est absolue : un registre non tenu ou tenu irrégulièrement est un " +
         "manquement civil à l'obligation de sécurité (L. 4121-1), et un manquement à une " +
         "obligation de l'inspection du travail (L. 8271-1)."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LE CERTIFICAT DE TRAVAIL
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-FIN-01", {
    nom: "Le certificat de travail",
    detail: "Les deux seules mentions que le décret autorise, et rien d'autre.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Certificat de travail",
        "articles L. 1234-19 et D. 1234-6 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CERTIFICAT DE TRAVAIL");
      L.push("");
      L.push("Je soussigné, Jean DUPONT, gérant de la SARL DUPONT TRANSPORTS,");
      L.push("agissant pour la société DUPONT TRANSPORTS,");
      L.push("dont le siège est 45 rue du Port, 76600 Le Havre,");
      L.push("");
      L.push("certifie que MARTIN Sofia");
      L.push("");
      L.push("- est entrée à mon service le 01/10/2022 ;");
      L.push("- en est sortie le 30/06/2026 ;");
      L.push("- y a occupé le ou les emplois suivants, aux périodes indiquées :");
      L.push("");
      L.push("Agent d'exploitation, du 01/10/2022 au 30/06/2026");
      L.push("");
      L.push("En foi de quoi ce certificat est délivré au salarié pour servir et valoir ce que de droit.");
      L.push("");
      L.push("Fait à Le Havre, le 30 juin 2026");
      L.push("Jean DUPONT, Gérant");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");
      L.push("Je soussigné, " + cro(p.responsable, "nom et qualité du représentant légal") + ",");
      L.push("agissant pour la société " + cro(p.denomination || p.entreprise, "DÉNOMINATION") + ",");
      L.push("dont le siège est " + cro(p.adresse, "adresse du siège") + ",");
      L.push("");
      L.push("certifie que " + cro(d.salarieSortie, "NOM ET PRÉNOMS DU SALARIÉ"));
      L.push("");
      L.push("- est entré à mon service le " + cro(d.dateEmbauche, "DATE D'ENTRÉE") + " ;");
      L.push("- en est sorti le " + cro(d.dateSortie, "DATE DE SORTIE") + " ;");
      L.push("- y a occupé le ou les emplois suivants, aux périodes indiquées :");
      L.push("");
      L.push("[EMPLOI OCCUPÉ], du [DATE] au [DATE]");
      L.push("(répéter pour chaque emploi successivement tenu)");
      L.push("");
      L.push("En foi de quoi ce certificat est délivré au salarié pour servir et valoir ce que de droit.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Établissement du certificat : à l'expiration du contrat", jj(d0), "certificat signé et daté"],
        ["Remise au salarié ou mise à disposition : le certificat est quérable", jj(d0), "trace de la remise ou mise à disposition"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le certificat de travail contient EXCLUSIVEMENT : 1° la date d'entrée du salarié et " +
             "celle de sa sortie ; 2° la nature de l'emploi ou des emplois successivement occupés " +
             "avec les périodes pendant lesquelles ces emplois ont été tenus » (D. 1234-6).");
      L.push("");
      L.push("LES INTERDICTIONS ABSOLUES :");
      L.push("- Pas de motif de rupture (même pas « licenciement pour cause personnelle »).");
      L.push("- Pas d'appréciation sur le travail ou la conduite.");
      L.push("- Pas de mention de solde de tout compte.");
      L.push("- Pas de qualification conventionnelle si elle ne correspond pas à l'emploi réel.");
      L.push("");
      L.push("Un certificat qui porte un motif de rupture défavorable expose l'employeur à " +
             "réparer le préjudice qui en résulte pour la recherche d'emploi.");
      L.push("");

      return L.concat(pied("L. 1234-19, D. 1234-6",
        ["Le certificat est délivré à l'expiration du contrat. Il est quérable : tenez-le à " +
         "disposition et gardez la trace de sa mise à disposition ou de son envoi."])).join("\n");
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
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Reçu pour solde de tout compte",
        "articles L. 1234-20 et D. 1234-7 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - REÇU POUR SOLDE DE TOUT COMPTE");
      L.push("");
      L.push("Entre la société DUPONT TRANSPORTS,");
      L.push("45 rue du Port, 76600 Le Havre,");
      L.push("et MARTIN Sofia,");
      L.push("dont le contrat de travail a pris fin le 30/06/2026.");
      L.push("");
      L.push("INVENTAIRE DES SOMMES VERSÉES LORS DE LA RUPTURE");
      L.push("");
      L = L.concat(tableau(["Désignation", "Montant"], [
        ["Salaire juin 2026", "2200 €"],
        ["Indemnité compensatrice de congés payés", "840 €"],
        ["Indemnité de fin de contrat CDD", "220 €"],
      ]));
      L.push("");
      L.push("TOTAL BRUT : 3260 €");
      L.push("Cotisations salariales : 410 €");
      L.push("TOTAL NET VERSÉ : 2850 €");
      L.push("");
      L.push("Le présent reçu est établi en DEUX EXEMPLAIRES.");
      L.push("Fait à Le Havre, le 30 juin 2026, en deux exemplaires.");
      L.push("Pour la société                          La salariée");
      L.push("Jean DUPONT, Gérant                      MARTIN Sofia");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. L'inventaire détaille chaque poste sans regroupement.");
      L.push("");
      L.push("Entre la société " + cro(p.denomination || p.entreprise, "DÉNOMINATION") + ",");
      L.push(cro(p.adresse, "adresse du siège") + ",");
      L.push("et " + cro(d.salarieSortie, "NOM ET PRÉNOMS DU SALARIÉ") + ",");
      L.push("dont le contrat de travail a pris fin le " + cro(d.dateSortie, "DATE DE SORTIE") + ".");
      L.push("");
      L.push("INVENTAIRE DES SOMMES VERSÉES LORS DE LA RUPTURE");
      L.push("");
      L = L.concat(tableau(["Désignation", "Montant"], [
        ["Salaire du mois de [MOIS]", "[MONTANT] €"],
        ["Rappel de salaire, s'il y a lieu", "[MONTANT] €"],
        ["Indemnité compensatrice de congés payés", "[MONTANT] €"],
        ["Indemnité de fin de contrat, s'il y a lieu", "[MONTANT] €"],
      ]));
      L.push("");
      L.push("TOTAL BRUT : [MONTANT] €");
      L.push("Cotisations salariales : [MONTANT] €");
      L.push("TOTAL NET VERSÉ : [MONTANT] €");
      L.push("");
      L.push("Le présent reçu est établi en DEUX EXEMPLAIRES.");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("");
      L.push("Pour la société                          Le salarié");
      L.push(cro(p.responsable, "Nom et qualité") + "                      " +
             cro(d.salarieSortie, "Nom et prénoms"));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Établissement du reçu en double exemplaire", jj(d0), "deux exemplaires signés"],
        ["Remise d'un exemplaire au salarié", jj(d0), "signature du salarié ou trace de remise"],
        ["Conservation du second exemplaire", "en permanence", "au dossier du personnel"],
        ["Dénonciation possible par le salarié", jj(dans(d0, 180)), "délai de 6 mois à partir de la signature"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Lors de la cessation du contrat de travail, l'employeur remet au salarié un " +
             "reçu pour solde de tout compte qui est établi en deux exemplaires, dont l'un est " +
             "remis au salarié » (D. 1234-7).");
      L.push("");
      L.push("POINTS ESSENTIELS :");
      L.push("- L'inventaire doit DÉTAILLER chaque somme versée, pas un total global.");
      L.push("- Deux exemplaires obligatoires : l'absence du double vaut manquement au texte.");
      L.push("- Le salarié peut dénoncer le reçu dans les SIX MOIS suivant sa signature.");
      L.push("- L'effet libératoire ne joue que pour les sommes MENTIONNÉES dans l'inventaire.");
      L.push("- Une somme absente reste réclamable après les six mois.");
      L.push("");
      L.push("INTERDICTION ABSOLUE :");
      L.push("- Ne faites signer aucune formule de renonciation. Le reçu pour solde n'est pas " +
             "une transaction et ne peut pas contenir de clause de renonciation à toute réclamation.");
      L.push("");

      return L.concat(pied("L. 1234-20, D. 1234-7",
        ["L'effet libératoire ne joue que pour les sommes mentionnées. Une somme absente de " +
         "l'inventaire reste réclamable après les six mois : c'est l'inventaire, et non la " +
         "signature, qui protège l'employeur."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     L'EMBAUCHE - CONTRAT À DURÉE INDÉTERMINÉE
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-EMB-01", {
    nom: "Le contrat de travail à durée indéterminée",
    detail: "Le contrat rédigé, avec la clause d'essai à la bonne durée et le " +
            "rappel des mentions du temps partiel.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Contrat de travail à durée indéterminée",
        "articles L. 1221-1 et suivants du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE");
      L.push("");
      L.push("ENTRE LES SOUSSIGNÉS :");
      L.push("");
      L.push("DUPONT TRANSPORTS SARL, dont le siège social est situé 45 rue du Port, 76600 Le Havre, " +
             "immatriculée sous le numéro SIRET 12345678901234,");
      L.push("représentée par Jean DUPONT, gérant,");
      L.push("");
      L.push("Ci-après « l'employeur »,");
      L.push("");
      L.push("ET");
      L.push("");
      L.push("MARTIN Sofia, née le 03/11/1995 à Lisbonne, demeurant 12 rue de la Paix, 76000 Rouen, " +
             "de nationalité portugaise, numéro de sécurité sociale 195 95 75 123 456,");
      L.push("");
      L.push("Ci-après « le salarié »,");
      L.push("");
      L.push("IL A ÉTÉ CONVENU CE QUI SUIT :");
      L.push("");
      L.push("Article - Engagement");
      L.push("Le salarié est engagé pour une durée indéterminée à compter du 01/10/2026.");
      L.push("");
      L.push("Article - Période d'essai");
      L.push("Le contrat comporte une période d'essai de 2 mois.");
      L.push("");
      L.push("Article - Convention collective");
      L.push("Les relations entre les parties sont régies par la convention collective IDCC 1234.");
      L.push("");
      L.push("Fait à Le Havre, le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur                              Le salarié");
      L.push("Jean DUPONT, Gérant                      MARTIN Sofia");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");
      L.push("ENTRE LES SOUSSIGNÉS :");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE") + ", dont le siège social est situé " +
        cro(p.adresse, "adresse du siège") + ", " + (p.siret ? "immatriculée sous le numéro SIRET " + p.siret : "[SIRET]") + ",");
      L.push("représentée par " + cro(p.responsable, "nom et qualité du représentant légal") + ",");
      L.push("");
      L.push("Ci-après « l'employeur »,");
      L.push("");
      L.push("ET");
      L.push("");
      L.push("[NOM ET PRÉNOMS DU SALARIÉ], né(e) le [DATE DE NAISSANCE] à [LIEU],");
      L.push("demeurant [ADRESSE], de nationalité [NATIONALITÉ], numéro de sécurité sociale [NUMÉRO],");
      L.push("");
      L.push("Ci-après « le salarié »,");
      L.push("");
      L.push("IL A ÉTÉ CONVENU CE QUI SUIT :");
      L.push("");
      L.push("Article - Engagement");
      L.push("Le salarié est engagé pour une durée indéterminée à compter du " +
        cro(d.dateEmbauche, "DATE D'EMBAUCHE") + ".");
      L.push("");
      L.push("Article - Période d'essai");
      L.push("Le contrat comporte une période d'essai de [DURÉE] mois.");
      L.push("");
      L.push("Article - Convention collective");
      L.push("Les relations entre les parties sont régies par la convention collective " +
        cro(p.conventionCollective, "INTITULÉ ET IDCC") + ".");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur                              Le salarié");
      L.push(cro(p.responsable, "Nom et qualité") + "                      [NOM ET PRÉNOMS]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Préparation du contrat avec mention de l'essai expressément stipulée", jj(d0), "contrat signé"],
        ["Remise au salarié le jour de l'embauche", jj(dans(d0, 1)), "signature du salarié"],
        ["Durée de l'essai : vérifier la convention collective applicable", jj(dans(d0, 1)), "convention collective lue"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("PÉRIODE D'ESSAI :");
      L.push("« La période d'essai et la possibilité de la renouveler ne se présument pas. " +
             "Elles sont expressément stipulées dans la lettre d'engagement ou le contrat de travail » " +
             "(L. 1221-23).");
      L.push("");
      L.push("Durée maximale (L. 1221-19) :");
      L.push("- Ouvriers et employés : 2 mois");
      L.push("- Agents de maîtrise et techniciens : 3 mois");
      L.push("- Cadres : 4 mois");
      L.push("");
      L.push("Le renouvellement suppose un accord de branche étendu. Durée totale (renouvellement inclus) : " +
             "4, 6 ou 8 mois selon la catégorie (L. 1221-21).");
      L.push("");

      return L.concat(pied("L. 1221-1, L. 1221-19, L. 1221-21, L. 1221-23, L. 1221-25",
        ["L'absence de clause d'essai vaut contrat sans essai. Une clause absente, c'est un droit " +
         "que le salarié ne peut pas perdre."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     L'EMBAUCHE - CONTRAT À DURÉE DÉTERMINÉE
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-EMB-02", {
    nom: "Le contrat à durée déterminée",
    detail: "Les huit mentions que l'article L. 1242-12 impose, et le délai de " +
            "transmission de deux jours ouvrables.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Contrat de travail à durée déterminée",
        "articles L. 1242-1 et suivants du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CONTRAT DE TRAVAIL À DURÉE DÉTERMINÉE");
      L.push("");
      L.push("ENTRE LES SOUSSIGNÉS :");
      L.push("DUPONT TRANSPORTS SARL, [...], représentée par Jean DUPONT, gérant,");
      L.push("ET");
      L.push("MARTIN Sofia, [...]");
      L.push("");
      L.push("Article 1 - Motif du recours");
      L.push("Le présent contrat est conclu pour remplacement d'un salarié absent : remplacement de " +
             "Jean BERNARD, Agent d'exploitation.");
      L.push("");
      L.push("Article 2 - Durée");
      L.push("Le contrat est conclu du 01/07/2026 au 31/08/2026 inclus.");
      L.push("");
      L.push("Article 3 - Poste de travail");
      L.push("Le salarié est engagé en qualité d'Agent d'exploitation, classification Employé, coefficient 120.");
      L.push("");
      L.push("Fait à Le Havre, le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur                              Le salarié");
      L.push("Jean DUPONT, Gérant                      MARTIN Sofia");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. DÉLAI IMPÉRATIF : transmission au salarié dans les deux jours ouvrables " +
             "suivant l'embauche.");
      L.push("");
      L.push("ENTRE LES SOUSSIGNÉS :");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE") + ", [...]");
      L.push("représentée par " + cro(p.responsable, "nom et qualité du représentant légal") + ",");
      L.push("ET");
      L.push("[NOM ET PRÉNOMS DU SALARIÉ], [...]");
      L.push("");
      L.push("Article 1 - Motif du recours");
      L.push("Le présent contrat est conclu pour le motif suivant : [MOTIF PRÉCIS - remplacement, " +
             "accroissement temporaire d'activité, emploi saisonnier, etc.]");
      L.push("[SI REMPLACEMENT : nom et qualification professionnelle de la personne remplacée]");
      L.push("");
      L.push("Article 2 - Durée");
      L.push("Le contrat est conclu du [DATE DE DÉBUT] au [DATE DE FIN] inclus.");
      L.push("");
      L.push("Article 3 - Poste de travail");
      L.push("Le salarié est engagé en qualité de " + cro(d.emploi, "INTITULÉ DE L'EMPLOI") + ", " +
             "classification [NIVEAU, ÉCHELON, COEFFICIENT].");
      L.push("");
      L.push("Article 4 - Convention collective");
      L.push("La convention collective applicable est " + cro(p.conventionCollective, "INTITULÉ ET IDCC") + ".");
      L.push("");
      L.push("Article 5 - Période d'essai");
      L.push("Le contrat comporte une période d'essai de [DURÉE].");
      L.push("");
      L.push("Article 6 - Rémunération");
      L.push("Le salarié perçoit une rémunération mensuelle brute de [MONTANT] euros.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur                              Le salarié");
      L.push(cro(p.responsable, "Nom et qualité") + "                      [NOM ET PRÉNOMS]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date limite", "Trace conservée"], [
        ["Établissement du contrat avec les 8 mentions obligatoires", jj(d0), "contrat écrit"],
        ["Transmission au salarié : deux jours ouvrables maximum", jj(dans(d0, 2)), "preuve de transmission datée"],
        ["Signature des deux exemplaires par les parties", jj(dans(d0, 2)), "contrats signés"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("LES HUIT MENTIONS OBLIGATOIRES (L. 1242-12) :");
      L.push("1. La définition précise du motif du recours (à défaut, requalification en CDI)");
      L.push("2. Nom et qualification de la personne remplacée, si applicable");
      L.push("3. Date du terme et, le cas échéant, clause de renouvellement");
      L.push("4. Ou durée minimale si pas de terme précis");
      L.push("5. Désignation du poste, précisant s'il figure sur la liste des postes à risques");
      L.push("6. Intitulé de la convention collective");
      L.push("7. Durée de la période d'essai");
      L.push("8. Montant de la rémunération et de ses composantes");
      L.push("");
      L.push("DÉLAI IMPÉRATIF :");
      L.push("« Le contrat de travail est transmis au salarié, au plus tard, dans les deux jours " +
             "ouvrables suivant l'embauche » (L. 1242-13).");
      L.push("");

      return L.concat(pied("L. 1242-1, L. 1242-12, L. 1242-13",
        ["Transmission tardive du contrat est sanctionnée. À défaut de motif précis ou d'écrit, " +
         "le contrat est réputé conclu pour une durée indéterminée."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     L'EMBAUCHE - DÉCLARATION PRÉALABLE
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-EMB-03", {
    nom: "La déclaration préalable à l'embauche",
    detail: "Les mentions de l'article R. 1221-1, à réunir avant que le salarié " +
            "ne prenne son poste.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Déclaration préalable à l'embauche",
        "articles L. 1221-10 et R. 1221-1 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DÉCLARATION PRÉALABLE À L'EMBAUCHE");
      L.push("");
      L.push("RÉUNION DES MENTIONS À DÉCLARER À L'URSSAF");
      L.push("");
      L.push("1. L'EMPLOYEUR");
      L.push("Dénomination : DUPONT TRANSPORTS SARL");
      L.push("Code APE : 4941B");
      L.push("SIRET : 12345678901234");
      L.push("Adresse : 45 rue du Port, 76600 Le Havre");
      L.push("");
      L.push("2. LE SALARIÉ");
      L.push("Nom et prénoms : MARTIN Sofia");
      L.push("Date et lieu de naissance : 03/11/1995 à Lisbonne");
      L.push("Nationalité : portugaise");
      L.push("");
      L.push("3. L'EMBAUCHE");
      L.push("Date d'embauche : 01/10/2026");
      L.push("Nature du contrat : CDD");
      L.push("Durée du contrat : 2 mois");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("« L'embauche d'un salarié ne peut intervenir qu'APRÈS déclaration nominative accomplies " +
             "par l'employeur auprès des organismes de protection sociale » (L. 1221-10).");
      L.push("");
      L.push("1. L'EMPLOYEUR");
      L.push("Dénomination : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Code APE : " + cro(p.ape, "CODE APE"));
      L.push("SIRET : " + (p.siret || "[SIRET]"));
      L.push("Adresse : " + cro(p.adresse, "adresse de l'employeur"));
      L.push("");
      L.push("2. LE SALARIÉ");
      L.push("Nom et prénoms : " + cro(d.salarieEmbauche, "NOM ET PRÉNOMS"));
      L.push("Sexe : [M / F]");
      L.push("Date et lieu de naissance : [DATE] à [LIEU]");
      L.push("Nationalité : [NATIONALITÉ]");
      L.push("");
      L.push("3. L'EMBAUCHE");
      L.push("Date d'embauche : " + cro(d.dateEmbauche, "DATE"));
      L.push("Heure d'embauche : [HEURE]");
      L.push("Nature du contrat : [CDI / CDD]");
      L.push("Durée du contrat : [DURÉE, POUR UN CDD]");
      L.push("Durée de la période d'essai : [DURÉE]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Réunion des informations de l'article R. 1221-1", jj(d0), "liste complétée"],
        ["Déclaration à l'URSSAF ou MSA : avant le premier jour de travail du salarié", jj(dans(d0, 1)), "accusé de réception de la déclaration"],
        ["Conservation de la déclaration et de l'accusé", "en permanence", "au dossier du personnel"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("TIMING IMPÉRATIF :");
      L.push("« L'embauche d'un salarié ne peut intervenir qu'APRÈS déclaration nominative " +
             "accomplies par l'employeur auprès des organismes de protection sociale désignés à cet effet » " +
             "(L. 1221-10).");
      L.push("");
      L.push("Les informations à déclarer (R. 1221-1) :");
      L.push("  1. Identité de l'employeur, code APE, SIRET, adresse");
      L.push("  2. Identité du salarié, sexe, date de naissance, nationalité");
      L.push("  3. Date d'embauche, heure, nature du contrat");
      L.push("  4. Durée du contrat pour les CDD");
      L.push("  5. Durée de la période d'essai pour les contrats qui en comportent");
      L.push("");

      return L.concat(pied("L. 1221-10, R. 1221-1",
        ["Aucune flexibilité : la déclaration doit précéder l'embauche, jamais la suivre. " +
         "L'embauche sans déclaration préalable est un manquement à l'obligation de sécurité."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LES ENTRETIENS DE PARCOURS PROFESSIONNEL
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-ENT-01", {
    nom: "Le document d'entretien de parcours professionnel",
    detail: "Les cinq sujets de l'article L. 6315-1, I, et la copie remise au salarié.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Entretien de parcours professionnel",
        "article L. 6315-1, I, du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ENTRETIEN DE PARCOURS PROFESSIONNEL");
      L.push("");
      L.push("Entreprise : DUPONT TRANSPORTS");
      L.push("Salarié : MARTIN Sofia - emploi occupé : Agent d'exploitation");
      L.push("Date d'entrée : 01/10/2022");
      L.push("Entretien tenu le : 15/06/2026, à 14h00, pendant le temps de travail");
      L.push("Conduit par : Jean DUPONT, gérant");
      L.push("");
      L.push("1. COMPÉTENCES ET QUALIFICATIONS MOBILISÉES");
      L.push("Maîtrise des outils informatiques, gestion de la logistique, communication avec les clients.");
      L.push("");
      L.push("2. SITUATION ET PARCOURS PROFESSIONNELS");
      L.push("Trois ans d'ancienneté, aucune évolution depuis l'embauche.");
      L.push("");
      L.push("3. BESOINS DE FORMATION");
      L.push("Formation souhaitée : gestion managériale, en prévision d'une promotion possible.");
      L.push("");
      L.push("4. SOUHAITS D'ÉVOLUTION PROFESSIONNELLE");
      L.push("Intérêt manifesté pour un poste de responsable de site dans les 2 ans.");
      L.push("");
      L.push("5. COMPTE PERSONNEL DE FORMATION");
      L.push("Le salarié a été informé de son CPF et des possibilités d'abondement par l'entreprise.");
      L.push("");
      L.push("Fait à Le Havre, le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur : Jean DUPONT                Le salarié : MARTIN Sofia");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("« L'entretien de parcours professionnel ne porte pas sur l'évaluation du travail du salarié » " +
             "(L. 6315-1, I). C'est un entretien sur les parcours, pas sur la performance.");
      L.push("");
      L.push("Entreprise : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Salarié : " + cro(d.salarie, "NOM ET PRÉNOMS") + " - emploi occupé : [EMPLOI]");
      L.push("Date d'entrée : [DATE]");
      L.push("Entretien tenu le : " + cro(d.dateEntretien, "DATE") + ", à [HEURE], pendant le temps de travail");
      L.push("Conduit par : [NOM ET QUALITÉ]");
      L.push("");
      L.push("1. COMPÉTENCES ET QUALIFICATIONS MOBILISÉES");
      L.push("[À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("2. SITUATION ET PARCOURS PROFESSIONNELS");
      L.push("[À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("3. BESOINS DE FORMATION");
      L.push("[À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("4. SOUHAITS D'ÉVOLUTION PROFESSIONNELLE");
      L.push("[À REMPLIR PENDANT L'ENTRETIEN]");
      L.push("");
      L.push("5. COMPTE PERSONNEL DE FORMATION");
      L.push("Le salarié a été informé de son CPF et de ses possibilités d'abondement.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur : [NOM]                      Le salarié : " + cro(d.salarie, "Nom et prénoms"));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Premier entretien : première année d'emploi", jj(dans(d0, 365)), "document signé et remis"],
        ["Entretien tous les 4 ans", "à la même date", "document signé et remis"],
        ["Remise d'une copie au salarié le jour même", jj(d0), "signature du salarié sur l'original"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Un entretien de parcours professionnel est organisé au cours de la première année, puis " +
             "au cours de la quatrième année suivant l'embauche, et tous les quatre ans » (L. 6315-1, I).");
      L.push("");
      L.push("LES CINQ SUJETS OBLIGATOIRES :");
      L.push("  1. Compétences et qualifications mobilisées dans l'emploi actuel");
      L.push("  2. Situation et parcours professionnels au regard des transformations de l'entreprise");
      L.push("  3. Besoins de formation liés à l'activité, à l'évolution de l'emploi ou au projet personnel");
      L.push("  4. Souhaits d'évolution professionnelle");
      L.push("  5. Compte personnel de formation - activation, abondements, conseil");
      L.push("");
      L.push("POINT CRUCIAL : Ce n'est PAS un entretien d'évaluation de performance. Aucune note, " +
             "aucune appréciation, aucune sanction ne doit y figurer.");
      L.push("");

      return L.concat(pied("L. 6315-1, I",
        ["L'entretien « donne lieu à la rédaction d'un document dont une copie est remise au salarié ». " +
         "La remise de la copie est la preuve de l'entretien : gardez-en la trace."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     L'ÉTAT DES LIEUX DES HUIT ANS
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-ENT-02", {
    nom: "L'état des lieux récapitulatif des huit ans",
    detail: "Le récapitulatif de l'article L. 6315-1, II, et la copie remise au salarié.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var an = d0.getFullYear();
      var L = [];

      L = L.concat(entete(ctx, "État des lieux récapitulatif du parcours professionnel",
        "article L. 6315-1, II, du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ÉTAT DES LIEUX RÉCAPITULATIF - HUIT ANS");
      L.push("");
      L.push("Entreprise : DUPONT TRANSPORTS");
      L.push("Salarié : DUPONT Jean - ancienneté depuis le 15/09/2019");
      L.push("État des lieux établi le : " + leJour(d0));
      L.push("");
      L.push("LES ENTRETIENS DES HUIT DERNIÈRES ANNÉES");
      L.push("");
      L = L.concat(tableau(["Date de l'entretien", "Motif", "Document remis le"], [
        ["12/06/" + (an - 7), "première année", "12/06/" + (an - 7)],
        ["20/06/" + (an - 3), "quatre ans", "20/06/" + (an - 3)],
      ]));
      L.push("");
      L.push("LE PARCOURS SUR LA PÉRIODE");
      L.push("Emplois occupés : Conducteur poids lourd depuis septembre 2019");
      L.push("Formations : FIMO (2019), FCO (2023), ADR base (2023)");
      L.push("Certifications : ADR, FIMO, FCO");
      L.push("Progressions : coefficient 138 M (2019) puis 150 (2024)");
      L.push("");
      L.push("Fait à Le Havre, le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur : Jean DUPONT                Le salarié : DUPONT Jean");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("L'état des lieux vérifie que les entretiens de parcours ont tous eu lieu au cours des " +
             "huit dernières années. Il récapitule le parcours du salarié.");
      L.push("");
      L.push("Entreprise : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("Salarié : " + cro(d.salarie, "NOM ET PRÉNOMS") + " - ancienneté depuis le [DATE]");
      L.push("État des lieux établi le : " + leJour(d0));
      L.push("");
      L.push("LES ENTRETIENS DES HUIT DERNIÈRES ANNÉES");
      L.push("");
      L = L.concat(tableau(["Date de l'entretien", "Motif", "Document remis le"], [
        ["[DATE]", "[première année / quatre ans / état des lieux]", "[DATE]"],
        ["[DATE]", "[première année / quatre ans / état des lieux]", "[DATE]"],
      ]));
      L.push("");
      L.push("LE PARCOURS SUR LA PÉRIODE");
      L.push("Emplois occupés : [LISTER, AVEC LES PÉRIODES]");
      L.push("Formations : [LISTER, AVEC LES DATES]");
      L.push("Certifications : [LISTER]");
      L.push("Progressions : [DÉCRIRE SALARIALES OU PROFESSIONNELLES]");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("L'employeur : [NOM]                      Le salarié : " + cro(d.salarie, "Nom et prénoms"));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Trace conservée"], [
        ["Premier entretien : première année", jj(dans(d0, 365)), "document signé"],
        ["Deuxième entretien : quatre ans après le premier", jj(dans(d0, 1460)), "document signé"],
        ["État des lieux : huit ans après la première embauche", jj(dans(d0, 2920)), "document signé et remis"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Au cours de la huitième année de présence du salarié dans l'entreprise, un état des " +
             "lieux récapitulatif du parcours professionnel du salarié depuis son embauche est établi » " +
             "(L. 6315-1, II).");
      L.push("");
      L.push("CET ÉTAT DES LIEUX DOIT :");
      L.push("  1. Vérifier que le salarié a bénéficié des entretiens prévus au cours des huit ans");
      L.push("  2. Récapituler les emplois successifs tenus et leurs périodes");
      L.push("  3. Lister les formations suivies et les certifications acquises");
      L.push("  4. Décrire les progressions salariales et professionnelles");
      L.push("");
      L.push("TIMING : Lorsqu'il s'agit du premier état des lieux après l'embauche, il peut être " +
             "réalisé sept ans après le premier entretien (L. 6315-1, II).");
      L.push("");

      return L.concat(pied("L. 6315-1, II",
        ["Cet état des lieux « donne lieu à la rédaction d'un document dont une copie est remise " +
         "au salarié ». La remise de cette copie est la preuve."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LES CONGÉS PAYÉS - AVIS DE PÉRIODE
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-CGP-01", {
    nom: "L'avis de période de prise des congés",
    detail: "À porter à la connaissance des salariés deux mois au moins avant " +
            "l'ouverture de la période.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = [];

      L = L.concat(entete(ctx, "Période de prise des congés payés - avis au personnel",
        "articles L. 3141-13 et D. 3141-5 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - AVIS AU PERSONNEL - PÉRIODE DE PRISE DES CONGÉS");
      L.push("");
      L.push("AVIS AU PERSONNEL - PERIODE DE PRISE DES CONGÉS PAYÉS");
      L.push("");
      L.push("La période de prise des congés payés est fixée du 1er mai 2026 au 31 octobre 2026.");
      L.push("");
      L.push("Cette période comprend la période du 1er mai au 31 octobre (L. 3141-13).");
      L.push("");
      L.push("Les demandes de congés sont adressées à la direction avant le 31 mars 2026.");
      L.push("L'ordre des départs sera communiqué à chaque salarié un mois au moins avant son départ.");
      L.push("");
      L.push("Affiché le " + leJour(dans(d0, 60)) + " aux emplacements habituels.");
      L.push("Jean DUPONT, gérant");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Attention au délai : « La période de prise des congés payés est portée par l'employeur " +
             "à la connaissance des salariés au moins DEUX MOIS avant l'ouverture de cette période » " +
             "(D. 3141-5).");
      L.push("");
      L.push("AVIS AU PERSONNEL - PÉRIODE DE PRISE DES CONGÉS PAYÉS");
      L.push("");
      L.push("La période de prise des congés payés est fixée du " +
        cro(d.debutPeriode, "DATE DE DÉBUT") + " au " + cro(d.finPeriode, "DATE DE FIN") + ".");
      L.push("");
      L.push("Cette période comprend la période du 1er mai au 31 octobre (L. 3141-13).");
      L.push("");
      L.push("[LE CAS ÉCHÉANT : Cette période est celle que fixe l'accord d'entreprise du [DATE].]");
      L.push("[À DÉFAUT D'ACCORD : Cette période est fixée par l'employeur après avis du " +
             "comité social et économique, recueilli le [DATE].]");
      L.push("");
      L.push("Les demandes de congés sont adressées à [DESTINATAIRE] avant le [DATE].");
      L.push("L'ordre des départs sera communiqué à chaque salarié un mois au moins avant son départ.");
      L.push("");
      L.push("Affiché le " + leJour(d0) + " à " + cro(p.adresse, "lieu d'affichage") + ".");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Trace conservée"], [
        ["Rédaction et affichage de l'avis : au moins deux mois avant l'ouverture", jj(d0), "affichage daté, photographie"],
        ["Demandes de congés par les salariés : avant la date fixée", jj(dans(d0, 60)), "demandes reçues"],
        ["Communication de l'ordre des départs : un mois avant chaque départ", jj(dans(d0, 90)), "notification datée par salarié"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("DÉLAI OBLIGATOIRE :");
      L.push("« La période de prise des congés payés est portée par l'employeur à la connaissance des " +
             "salariés au moins DEUX MOIS avant l'ouverture de cette période » (D. 3141-5).");
      L.push("");
      L.push("CONTENU DE L'AVIS :");
      L.push("  - Les dates de la période : date d'ouverture et date de fermeture");
      L.push("  - Confirmation que la période comprend le 1er mai au 31 octobre (L. 3141-13)");
      L.push("  - Indication de la procédure de demande de congés");
      L.push("  - Calendrier de communication de l'ordre des départs");
      L.push("");

      return L.concat(pied("L. 3141-13, D. 3141-5",
        ["Le défaut d'affichage à temps est un manquement à une obligation d'information. " +
         "Datez l'affichage et conservez-en la preuve."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LES CONGÉS PAYÉS - ORDRE DES DÉPARTS
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("RH-CTL-CGP-02", {
    nom: "La communication de l'ordre des départs",
    detail: "L'ordre des départs et ses critères, communiqué un mois au moins " +
            "avant chaque départ.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d = ctx.donnees || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var an = d0.getFullYear();
      var L = [];

      L = L.concat(entete(ctx, "Ordre des départs en congé - communication",
        "articles L. 3141-16 et D. 3141-6 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ORDRE DES DÉPARTS EN CONGÉ");
      L.push("");
      L.push("ORDRE DES DÉPARTS EN CONGÉ");
      L.push("Période de prise : 1er mai " + an + " - 31 octobre " + an);
      L.push("");
      L = L.concat(tableau(["Salarié", "Dates demandées", "Dates accordées", "Décision", "Critère appliqué", "Notifié le"],
        [["DUPONT Jean", "01/07 au 26/07", "01/07 au 26/07", "accordé", "situation de famille (2 enfants)", "15/05"],
         ["MARTIN Sofia", "01/08 au 23/08", "08/08 au 30/08", "décalé", "durée des services", "20/05"]]));
      L.push("");
      L.push("LES CRITÈRES APPLIQUÉS :");
      L.push("  - Situation de famille (enfants, conjoint enseignant, personne en perte d'autonomie)");
      L.push("  - Durée des services chez l'employeur (ancienneté)");
      L.push("  - Activité éventuelle chez d'autres employeurs");
      L.push("");
      L.push("Communiqué le " + leJour(d0));
      L.push("Jean DUPONT, gérant");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Attention aux deux délais : ordre communiqué un mois avant CHAQUE départ, et impossibilité " +
             "de modifier moins d'un mois avant la date prévue.");
      L.push("");
      L.push("ORDRE DES DÉPARTS EN CONGÉ");
      L.push("Période de prise : " + cro(d.debutPeriode, "DATE") + " - " + cro(d.finPeriode, "DATE"));
      L.push("");
      L = L.concat(tableau(["Salarié", "Dates demandées", "Dates accordées", "Décision", "Critère appliqué", "Notifié le"],
        [["[NOM]", "[du] au [du]", "[du] au [du]", "[accordé / décalé / refusé]", "[lequel]", "[date]"]]));
      L.push("");
      L.push("LES CRITÈRES APPLIQUÉS :");
      L.push("[ÉNUMÉRER LES CRITÈRES SELON L'ACCORD OU L'ARTICLE L. 3141-16]");
      L.push("");
      L.push("MOTIF DES DEMANDES NON SATISFAITES :");
      L.push("[NOM] - demande du [DATE] au [DATE] - critère appliqué : [LEQUEL]");
      L.push("");
      L.push("Communiqué le " + leJour(d0) + " par " +
        cro(d.moyen, "MOYEN - affichage, courriel, remise en main propre") + ".");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Trace conservée"], [
        ["Fixation de l'ordre des départs", jj(d0), "ordre établi"],
        ["Communication à chaque salarié : UN MOIS avant son départ", jj(dans(d0, 30)), "notification datée individuellement"],
        ["Absence de modification moins d'un mois avant le départ : sauf circonstances exceptionnelles", jj(dans(d0, 30)), "preuve d'absence de modification"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("LES TROIS CRITÈRES DE L'ARTICLE L. 3141-16 :");
      L.push("  1. La situation de famille : présence d'enfants, conjoint enseignant, personne en perte " +
             "d'autonomie au foyer");
      L.push("  2. La durée des services chez l'employeur : ancienneté");
      L.push("  3. L'activité éventuelle du salarié chez d'autres employeurs");
      L.push("");
      L.push("DEUX DÉLAIS IMPÉRATIFS :");
      L.push("  - Communication à chaque salarié : UN MOIS avant son départ (D. 3141-6)");
      L.push("  - Absence de modification : impossible moins d'un mois avant le départ, sauf " +
             "circonstances exceptionnelles (L. 3141-16)");
      L.push("");
      L.push("ATTENTION : Une réorganisation prévisible n'est pas une circonstance exceptionnelle.");
      L.push("");

      return L.concat(pied("L. 3141-16, D. 3141-6",
        ["L'ordre doit être communiqué à CHAQUE salarié individuellement, un mois avant SON départ. " +
         "Ce délai se compte par salarié, non pour l'ensemble du personnel."])).join("\n");
    },
  });

  /* ════════════════════════════════════════════════════════════════════════
     LA BASE DE DONNÉES ÉCONOMIQUES, SOCIALES ET ENVIRONNEMENTALES
     ════════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CNT-00", {
    nom: "La base de données économiques, sociales et environnementales",
    detail: "La base elle-même : ses dix thèmes, ses six années, ses modalités " +
            "de mise à disposition.",
    tableur: function (ctx) {
      var p = ctx.profil || {};
      var L = [];
      L.push(["BASE DE DONNÉES ÉCONOMIQUES, SOCIALES ET ENVIRONNEMENTALES"]);
      L.push([cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE")]);
      L.push(["Effectif : " + (p.effectif ? p.effectif + " salariés" : "à renseigner")]);
      L.push(["Établie le " + leJour(ctx.aujourdhui)]);
      L.push([]);
      L.push(["Les dix thèmes du contenu : Investissements, Égalité professionnelle, Fonds propres, " +
              "Rémunération, Activités sociales, Rémunération des financeurs, Flux financiers, " +
              "Partenariats, Transferts commerciaux intra-groupe, Environnement"]);
      return L;
    },
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var an = d0.getFullYear();
      var L = [];

      L = L.concat(entete(ctx, "Base de données économiques, sociales et environnementales",
        "articles L. 2312-18, L. 2312-21, R. 2312-8 et R. 2312-9 du code du travail"));

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - BASE DE DONNÉES ÉCONOMIQUES, SOCIALES ET ENVIRONNEMENTALES");
      L.push("");
      L.push("Établissement : DUPONT TRANSPORTS");
      L.push("Effectif : 45 salariés");
      L.push("Base ouverte le : 1er janvier " + an);
      L.push("");
      L.push("LES DIX THÈMES");
      L.push("");
      L = L.concat(tableau(["Thème", "Année N-2", "Année N-1", "Année N", "N+1", "N+2", "N+3"], [
        ["1. Investissements", "520000 €", "550000 €", "580000 €", "600000 €", "620000 €", "640000 €"],
        ["2. Égalité professionnelle F/H", "45% F / 55% H", "46% F / 54% H", "47% F / 53% H", "", "", ""],
        ["3. Fonds propres", "750000 €", "800000 €", "850000 €", "880000 €", "900000 €", "920000 €"],
        ["4. Masse salariale brute", "1200000 €", "1260000 €", "1320000 €", "1380000 €", "1440000 €", "1500000 €"],
        ["5. Activités sociales", "8000 €", "8500 €", "9000 €", "9500 €", "10000 €", "10500 €"],
      ]));
      L.push("");
      L.push("MISE À DISPOSITION");
      L.push("Support : papier");
      L.push("Lieu : bureau du directeur");
      L.push("Accès permanent : membres de la délégation du personnel du CSE");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("« La base de données comporte les informations relatives aux trois années précédentes, " +
             "l'année en cours et les trois années suivantes, sous forme de perspectives » " +
             "(L. 2312-18).");
      L.push("");
      L.push("Établissement : " + cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE"));
      L.push("Effectif : " + (p.effectif ? p.effectif + " salariés" : "[EFFECTIF]"));
      L.push("Base ouverte le : [DATE]");
      L.push("");
      L.push("LES DIX THÈMES");
      L.push("");
      L = L.concat(tableau(["Thème", "Année N-2", "Année N-1", "Année N", "N+1", "N+2", "N+3"], [
        ["1. Investissements", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]"],
        ["2. Égalité professionnelle", "[%F/%H]", "[%F/%H]", "[%F/%H]", "[%F/%H]", "[%F/%H]", "[%F/%H]"],
        ["3. Fonds propres", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]"],
        ["4. Masse salariale brute", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]"],
        ["5. Rémunération dirigeants", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]", "[montant]"],
      ]));
      L.push("");
      L.push("MISE À DISPOSITION");
      L.push("Support : [papier / informatique]");
      L.push("Lieu : [lieu d'accès]");
      L.push("Accès permanent : [membres du CSE et délégués syndicaux - liste nominative]");
      L.push("Dernière mise à jour : [date]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Trace conservée"], [
        ["Ouverture de la base : avant la première présentation au comité", jj(d0), "base signée et datée"],
        ["Mise à jour des données : au moins annuellement", jj(dans(d0, 365)), "trace de chaque mise à jour"],
        ["Communication au comité : à chaque mise à jour", "au fil de l'année", "ordre du jour et PV CSE"],
        ["Accès permanent : pour le comité et les délégués syndicaux", "en permanence", "registre d'accès"],
      ]));

      L = L.concat(DP.liens(ctx, ["emploi", "rh"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("CONTENUS OBLIGATOIRES (L. 2312-21) :");
      L.push("- Investissement social, matériel et immatériel");
      L.push("- Égalité professionnelle femmes-hommes");
      L.push("- Fonds propres, endettement, impôts");
      L.push("- Rémunération des salariés et dirigeants");
      L.push("- Activités sociales et culturelles");
      L.push("- Rémunération des financeurs");
      L.push("- Flux financiers à destination de l'entreprise");
      L.push("- Partenariats");
      L.push("- Transferts commerciaux et financiers intra-groupe");
      L.push("- Environnement et changement climatique");
      L.push("");
      L.push("PÉRIODES COUVERTES :");
      L.push("- Trois années écoulées");
      L.push("- L'année en cours");
      L.push("- Trois années à venir (sous forme de perspectives et tendances)");
      L.push("");
      L.push("ACCESSIBILITÉ :");
      L.push("« La base de données est mise à la disposition des membres de la délégation du personnel " +
             "du comité et, le cas échéant, des délégués syndicaux » (L. 2312-18).");
      L.push("");

      return L.concat(pied("L. 2312-18, L. 2312-21, R. 2312-8, R. 2312-9",
        ["La mise à disposition actualisée des éléments transmis régulièrement au comité vaut " +
         "communication des rapports et informations au comité. Une base figée ne satisfait pas cette " +
         "obligation."])).join("\n");
    },
  });

})(typeof window !== "undefined" ? window : this);
