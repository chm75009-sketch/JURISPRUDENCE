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
  /* L'adresse publique : un document emporté en Word ou imprimé quitte le
     navigateur, un lien relatif n'y mène plus nulle part. */
  var SITE_APP = "https://chm75009-sketch.github.io/JURISPRUDENCE/docs/";

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

  /* ══════════════════════════════════════════════════════════════════════
     LA BASE DE DONNÉES ÉCONOMIQUES, SOCIALES ET ENVIRONNEMENTALES

     Trois onglets, comme le règlement intérieur : la base elle-même, les
     formalités une par une, le droit qui les fonde. Demande du 12 septembre
     2026, « dans le même principe que le règlement intérieur ».

     LA GRILLE N'EST PAS ÉCRITE ICI. Elle est découpée du texte du décret par
     moteur/bdese, mise à plat par engendrer-grille.js, et servie au navigateur
     dans bdese-grille.js sous window.GRILLE_BDESE. Deux arbres : R. 2312-8 en
     deçà de trois cents salariés, R. 2312-9 au-delà. L'effectif de la fiche
     choisit, l'utilisateur ne choisit pas.

     Articles lus au relais Légifrance le 12 septembre 2026 :
     L. 2312-18 (LEGIARTI000052437125), L. 2312-36 (LEGIARTI000048533625),
     R. 2312-10 (LEGIARTI000036411580), R. 2312-12 (LEGIARTI000036411586),
     R. 2312-13 (LEGIARTI000036411588), R. 2312-15 (LEGIARTI000036411594),
     L. 2317-1 (LEGIARTI000035634273).
     ══════════════════════════════════════════════════════════════════════ */

  /* Les intitulés courts des rubriques : ce qui tient sur un sous-bouton de
     téléphone. La clé est le début du titre que porte la grille. */
  var COURT_BDESE = [
    ["Investissements", "1 Investissements"],
    ["Egalité professionnelle", "2 Égalité"],
    ["Fonds propres", "3 Fonds propres"],
    ["Rémunération des salariés", "4 Rémunérations"],
    ["Activités sociales", "5 ASC"],
    ["Représentation du personnel", "5 Représentation et ASC"],
    ["Rémunération des financeurs", "6 Financeurs"],
    ["Flux financiers", "7 Flux"],
    ["Partenariats", "8 Partenariats"],
    ["Pour les entreprises appartenant", "9 Groupe"],
    ["Environnement", "10 Environnement"],
  ];
  function courtBdese(titre) {
    for (var i = 0; i < COURT_BDESE.length; i++)
      if (String(titre).indexOf(COURT_BDESE[i][0]) === 0) return COURT_BDESE[i][1];
    return String(titre).slice(0, 22);
  }
  /* Le titre de la rubrique, tel que le décret le donne, traîne son appel de
     note et parfois le début de sa première section : « Environnement (1)
     A-Politique générale en matière environnementale ». On garde le titre,
     on coupe à l'appel de note. */
  function titreRubrique(t) {
    return String(t).replace(/\s*\(\d+\).*$/, "").trim();
  }

  function grandEffectif(p) {
    var n = parseInt(String(p.effectif == null ? "" : p.effectif).replace(/\s/g, ""), 10);
    return isFinite(n) && n >= 300;
  }
  function grilleBdese(p) {
    var g = (typeof window !== "undefined" && window.GRILLE_BDESE) || null;
    if (!g) return [];
    return (grandEffectif(p) ? g.plus300 : g.moins300) || [];
  }
  /* Les six années de R. 2312-10 : l'année en cours, les deux précédentes,
     les trois suivantes. Le décret ne dit pas autre chose, et le générateur
     disait « trois années précédentes » jusqu'au 12 septembre 2026. */
  function anneesBdese(d0) {
    var an = d0.getFullYear(), out = [];
    for (var i = -2; i <= 3; i++) out.push(String(an + i) + (i === 0 ? " (en cours)" : ""));
    return out;
  }

  DP.ajouter("BDESE-CTL-CNT-00", {
    nom: "La base de données économiques, sociales et environnementales",
    detail: "La grille du décret, rubrique par rubrique, avec les six années ; " +
            "puis les six formalités, chacune avec son document ; puis le droit.",
    tableur: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var g = grilleBdese(p), an = anneesBdese(d0);
      var L = [];
      L.push(["BASE DE DONNÉES ÉCONOMIQUES, SOCIALES ET ENVIRONNEMENTALES"]);
      L.push([cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE")]);
      L.push(["Effectif : " + (p.effectif ? p.effectif + " salariés" : "[EFFECTIF]") +
              " - contenu applicable : " + (grandEffectif(p) ? "R. 2312-9 (au moins 300 salariés)"
                                                            : "R. 2312-8 (moins de 300 salariés)")]);
      L.push(["Établie le " + leJour(d0) + " - articles L. 2312-18, L. 2312-21 et " +
              (grandEffectif(p) ? "R. 2312-9" : "R. 2312-8") + " du code du travail"]);
      L.push([]);
      L.push(["Rubrique", "Section", "Sujet", "Ce que le décret demande"].concat(an));
      g.forEach(function (l) { L.push([l[0], l[1], l[2], l[3], "", "", "", "", "", ""]); });
      return L;
    },
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var g = grilleBdese(p), an = anneesBdese(d0);
      var gros = grandEffectif(p);
      var art = gros ? "R. 2312-9" : "R. 2312-8";
      var eff = String(p.effectif == null ? "" : p.effectif).trim();
      var L = [];

      L = L.concat(entete(ctx, "Base de données économiques, sociales et environnementales",
        "articles L. 2312-18, L. 2312-21 et " + art + " du code du travail"));
      L.push(DP.EXEMPLE);
      L.push("");

      /* ---------- le régime, avant tout : il commande le contenu ---------- */
      L.push("VOTRE CONTENU EST CELUI DE " + art.toUpperCase());
      L.push("");
      L.push((eff ? eff + " salariés" : "Effectif non renseigné") +
        ", et aucun accord au sens de L. 2312-21 : le contenu supplétif du décret");
      L.push("s'applique. " + (gros
        ? "Au-dessus de trois cents salariés, c'est la grille longue de R. 2312-9."
        : "En deçà de trois cents salariés, c'est la grille de R. 2312-8 ; les rubriques plus lourdes de R. 2312-9 ne vous sont pas dues.") +
        " La bascule se fait sur l'effectif de votre fiche, vous n'avez rien à choisir.");
      L.push("");
      L.push("Les informations portent sur l'année en cours, les deux années précédentes");
      L.push("et, telles qu'elles peuvent être envisagées, les trois années suivantes");
      L.push("(R. 2312-10). Soit " + an.join(", ") + ".");
      L.push("");
      L.push("NOTE - Un accord d'entreprise, ou à défaut de branche, peut redéfinir");
      L.push("l'organisation, l'architecture, le contenu et le fonctionnement de la base");
      L.push("(L. 2312-21). Si vous en avez un, c'est lui qui commande, et cette grille");
      L.push("n'est plus qu'un plancher de comparaison.");
      L.push("");
      L.push("");

      /* ---------- la grille, rubrique par rubrique ---------- */
      var vues = [], courante = null;
      g.forEach(function (l) {
        if (l[0] !== courante) { courante = l[0]; vues.push({ titre: l[0], lignes: [] }); }
        vues[vues.length - 1].lignes.push(l);
      });
      vues.forEach(function (v, i) {
        L.push("RUBRIQUE " + (i + 1) + " - " + titreRubrique(v.titre).toUpperCase());
        L.push("");
        L.push("(" + art + ") - " + v.lignes.length + " information" +
          (v.lignes.length > 1 ? "s" : "") + " à porter");
        L.push("");
        var section = null;
        v.lignes.forEach(function (l) {
          /* La ligne vide avant le titre de section : sans elle, FeuilleDoc
             recolle le titre à la puce qui précède et la section disparaît. */
          if (l[1] && l[1] !== section) { section = l[1]; L.push(""); L.push(section); L.push(""); }
          L.push("  - " + l[3]);
          L.push("    " + an.join(" [    ]  ") + " [    ]");
          L.push("");
        });
        L.push("");
        L.push("");
      });

      /* ---------- les formalités ---------- */
      L.push("DANS CET ORDRE");
      L.push("");
      L.push("Six formalités, chacune avec le document qui l'accomplit. La première");
      L.push("n'en est pas une : elle demande à qui la base serait due, et la réponse");
      L.push("décide de tout le reste.");
      L.push("");
      L.push("");

      var cse = String(p.cseExiste || (ctx.fiche || {}).cseExiste ||
        (ctx.donnees || {}).cseExiste || "").trim().toLowerCase();

      L.push("ÉTAPE 0 - À QUI LA BASE EST-ELLE DUE ?");
      L.push("");
      L.push("(L. 2312-18 et L. 2312-36) - avant tout");
      L.push("");
      L.push("La base est ce que l'employeur « met à disposition du comité social et");
      L.push("économique » (L. 2312-18), et elle est « accessible en permanence aux");
      L.push("membres de la délégation du personnel du comité social et économique ainsi");
      L.push("qu'aux membres de la délégation du personnel du comité social et économique");
      L.push("central d'entreprise, et aux délégués syndicaux » (L. 2312-36). Deux");
      L.push("destinataires, pas un de plus.");
      L.push("");
      L.push("Un comité social et économique est-il en place ?");
      L.push("");
      L.push("  [" + (cse === "oui" ? "x" : " ") + "] OUI" +
        (cse === "oui" ? " - c'est ce que dit votre fiche." : " - cochez si c'est votre cas."));
      L.push("      La base est due, et l'accès leur est ouvert en permanence.");
      L.push("");
      L.push("  [ ] NON, MAIS DES DÉLÉGUÉS SYNDICAUX SONT DÉSIGNÉS.");
      L.push("      La base leur est accessible de plein droit (L. 2312-36) : elle est");
      L.push("      due, et tout ce qui suit vaut.");
      L.push("");
      L.push("  [" + (cse === "non" ? "x" : " ") + "] NON, NI L'UN NI L'AUTRE, AVEC UN PROCÈS-VERBAL DE CARENCE.");
      L.push("      Aucun destinataire n'est désigné par les textes. Ils ne disent pas");
      L.push("      pour autant que la base n'est pas due : ils se taisent. Les vingt");
      L.push("      décisions publiées qui citent la base ne tranchent pas ce cas, la");
      L.push("      dernière en date, Cass. soc. 3 décembre 2025, n° 24-10.326, se");
      L.push("      bornant à nommer les bénéficiaires. Voyez un avocat avant de vous");
      L.push("      en dispenser, et sachez que la base redeviendra due le jour où un");
      L.push("      comité sera élu ou un délégué désigné.");
      L.push("");
      L.push("  [ ] NON, ET PAS DE PROCÈS-VERBAL DE CARENCE.");
      L.push("      Ce n'est pas la base qui est en retard, ce sont les élections. Le");
      L.push("      comité est obligatoire dans les entreprises d'au moins onze salariés,");
      L.push("      dès lors que ce seuil est atteint pendant douze mois consécutifs");
      L.push("      (L. 2311-2), et l'employeur informe le personnel de l'organisation");
      L.push("      des élections par un moyen donnant date certaine, le premier tour se");
      L.push("      tenant au plus tard le quatre-vingt-dixième jour suivant cette");
      L.push("      diffusion (L. 2314-4).");
      L.push("");
      L.push("      Le modèle qui écrit ces documents :");
      L.push("      " + SITE_APP + "audit-cse.html#elections");
      L.push("");
      L.push("Rien n'interdit de constituer la base sans y être tenu : elle sera prête.");
      L.push("");
      L.push("");

      L.push("ÉTAPE 1 - DÉTERMINER LE RÉGIME");
      L.push("");
      L.push("(L. 2312-21) - avant de constituer quoi que ce soit");
      L.push("");
      L.push("Un accord d'entreprise, ou à défaut de branche, peut définir l'organisation,");
      L.push("l'architecture, le contenu et le fonctionnement de la base. En son absence,");
      L.push("c'est le contenu supplétif du décret qui s'impose, et il dépend de votre");
      L.push("effectif : " + art + " pour vous.");
      L.push("");
      L.push("Fait le [DATE]   -   Référence : [ACCORD DU DATE, OU « AUCUN ACCORD »]");
      L.push("");
      L.push("  Le document de cette étape :");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("DOCUMENT 1 - NOTE DE RÉGIME");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE"));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("NOTE DE RÉGIME DE LA BASE DE DONNÉES");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le [DATE]");
      L.push("");
      L.push("Régime applicable : [ACCORD DU DATE / ACCORD DE BRANCHE DU DATE / AUCUN");
      L.push("ACCORD, CONTENU SUPPLÉTIF].");
      L.push("");
      L.push("Effectif retenu : " + (eff ? eff + " salariés" : "[EFFECTIF]") + ". Contenu applicable : " + art + ".");
      L.push("");
      L.push("Années couvertes : " + an.join(", ") + " (R. 2312-10).");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité"));
      L.push("");
      L.push("");

      L.push("ÉTAPE 2 - CONSTITUER LA BASE");
      L.push("");
      L.push("(L. 2312-18 et " + art + ") - une fois le régime arrêté");
      L.push("");
      L.push("Les " + vues.length + " rubriques de l'onglet précédent, et dans chacune les");
      L.push("informations que le décret nomme : " + g.length + " lignes à porter en tout,");
      L.push("sur six colonnes d'années.");
      L.push("");
      L.push("Le classeur se télécharge rempli de ce que vous avez saisi, une feuille par");
      L.push("rubrique.");
      L.push("");
      L.push("Fait le [DATE]");
      L.push("");
      L.push("");

      L.push("ÉTAPE 3 - LE SUPPORT");
      L.push("");
      L.push("(R. 2312-12) - dès la base constituée");
      L.push("");
      L.push("À défaut d'accord, la base est tenue « sur un support informatique pour les");
      L.push("entreprises d'au moins trois cents salariés, et sur un support informatique");
      L.push("ou papier pour les entreprises de moins de trois cents salariés ».");
      L.push("");
      L.push(gros
        ? "Vous êtes à " + eff + " : le support informatique est obligatoire, le papier n'est pas admis."
        : "Vous êtes à " + (eff || "[EFFECTIF]") + " : les deux sont admis.");
      L.push("");
      L.push("Fait le [DATE]   -   Support : [PAPIER / INFORMATIQUE]   -   Accès : [LIEU OU ADRESSE]");
      L.push("");
      L.push("");

      L.push("ÉTAPE 4 - OUVRIR L'ACCÈS PERMANENT");
      L.push("");
      L.push("(L. 2312-36) - le jour de la mise à disposition");
      L.push("");
      L.push("Accès permanent aux membres de la délégation du personnel du comité, à ceux");
      L.push("du comité central s'il en existe un, et aux délégués syndicaux. Permanent :");
      L.push("pas sur demande, pas à l'occasion d'une consultation. Tenez la liste");
      L.push("nominative de ceux à qui l'accès est ouvert, avec sa date.");
      L.push("");
      L.push("Fait le [DATE]   -   Liste nominative : [NOMS]");
      L.push("");
      L.push("  Le document de cette étape :");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("DOCUMENT 4 - NOTE D'ACCÈS À LA BASE");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE"));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel du comité social et économique");
      L.push("et aux délégués syndicaux");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le [DATE]");
      L.push("");
      L.push("Objet : accès à la base de données économiques, sociales et environnementales");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("La base de données économiques, sociales et environnementales de");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE") + " est à votre disposition depuis le [DATE], sur");
      L.push("[SUPPORT], à [LIEU OU ADRESSE D'ACCÈS]. Elle vous est accessible en");
      L.push("permanence, conformément à l'article L. 2312-36 du code du travail.");
      L.push("");
      L.push("Elle porte sur " + an.join(", ") + ".");
      L.push("");
      L.push("Les informations qui y sont présentées comme confidentielles le sont pour la");
      L.push("durée qui y est indiquée, et vous êtes tenus de la respecter (R. 2312-13).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité"));
      L.push("");
      L.push("");

      L.push("ÉTAPE 5 - INFORMER DE CHAQUE ACTUALISATION");
      L.push("");
      L.push("(R. 2312-12 et L. 2312-18) - à chaque mise à jour");
      L.push("");
      L.push("« L'employeur informe ces personnes de l'actualisation de la base de données");
      L.push("selon des modalités qu'il détermine » (R. 2312-12). Les modalités sont");
      L.push("libres, l'information ne l'est pas.");
      L.push("");
      L.push("Ce qui se joue ici dépasse la formalité : « cette mise à disposition");
      L.push("actualisée vaut communication des rapports et informations au comité »");
      L.push("(L. 2312-18). Une base à jour remplace la transmission ; une base en retard");
      L.push("ne remplace rien, et la consultation se tient alors sans les éléments dus.");
      L.push("");
      L.push("Fait le [DATE]   -   Moyen : [COURRIEL, REMISE, AFFICHAGE]");
      L.push("");
      L.push("  Le document de cette étape :");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("DOCUMENT 5 - NOTE D'ACTUALISATION");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE"));
      L.push("");
      L.push("Objet : actualisation de la base de données");
      L.push("");
      L.push("La base a été actualisée le [DATE]. Les rubriques modifiées sont :");
      L.push("[LISTE DES RUBRIQUES].");
      L.push("");
      L.push("Cette mise à disposition actualisée vaut communication des rapports et");
      L.push("informations au comité (L. 2312-18).");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité"));
      L.push("");
      L.push("");

      L.push("ÉTAPE 6 - CE QUI EST CONFIDENTIEL");
      L.push("");
      L.push("(R. 2312-13) - au fil de l'eau");
      L.push("");
      L.push("Les informations confidentielles « doivent être présentées comme telles par");
      L.push("l'employeur qui indique la durée du caractère confidentiel de ces");
      L.push("informations ». Deux choses, donc : le dire, et dire combien de temps.");
      L.push("");
      L.push("Une mention générale de confidentialité portée sur toute la base ne vaut");
      L.push("rien : elle se porte information par information, avec sa durée.");
      L.push("");
      L.push("Rubriques concernées : [LISTE]   -   Durée : [DURÉE]");
      L.push("");
      L.push("");

      L.push("LE RELEVÉ DES DATES, À GARDER AVEC LA BASE");
      L.push("");
      L.push("Formalité | Date | Référence");
      L.push("1. Régime arrêté (L. 2312-21) | [DATE] | [accord, ou « aucun »]");
      L.push("2. Base constituée (" + art + ") | [DATE] | [" + g.length + " lignes portées]");
      L.push("3. Support retenu (R. 2312-12) | [DATE] | [papier / informatique]");
      L.push("4. Accès ouvert (L. 2312-36) | [DATE] | [liste nominative]");
      L.push("5. Information de l'actualisation (R. 2312-12) | [DATE] | [moyen]");
      L.push("6. Mentions de confidentialité (R. 2312-13) | [DATE] | [rubriques, durées]");
      L.push("");
      L.push("NOTE - Sans ces dates, vous ne pouvez pas établir que la base était à jour");
      L.push("le jour d'une consultation, et la mise à disposition ne vaudra pas");
      L.push("communication.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");

      /* ---------- le droit ---------- */
      L.push("LE DROIT QUI FONDE CE DOCUMENT");
      L.push("");
      L.push("Articles lus au relais Légifrance le 12 septembre 2026, chacun avec");
      L.push("l'identifiant de la version lue.");
      L.push("");
      L.push("L. 2312-18 - ce qu'est la base, et ce qu'elle vaut (LEGIARTI000052437125)");
      L.push("");
      L.push("« Une base de données économiques, sociales et environnementales rassemble");
      L.push("l'ensemble des informations nécessaires aux consultations et informations");
      L.push("récurrentes que l'employeur met à disposition du comité social et");
      L.push("économique. […] Les éléments d'information transmis de manière récurrente au");
      L.push("comité sont mis à la disposition de leurs membres dans la base de données et");
      L.push("cette mise à disposition actualisée vaut communication des rapports et");
      L.push("informations au comité. »");
      L.push("");
      L.push("L. 2312-36 - à qui elle est due (LEGIARTI000048533625)");
      L.push("");
      L.push("« La base de données est accessible en permanence aux membres de la");
      L.push("délégation du personnel du comité social et économique ainsi qu'aux membres");
      L.push("de la délégation du personnel du comité social et économique central");
      L.push("d'entreprise, et aux délégués syndicaux. »");
      L.push("");
      L.push("L. 2312-21 - l'accord qui peut tout redéfinir");
      L.push("");
      L.push("Il fixe l'organisation, l'architecture, le contenu et les modalités de");
      L.push("fonctionnement de la base. R. 2312-8 et R. 2312-9 ne s'appliquent qu'à son");
      L.push("défaut.");
      L.push("");
      L.push("R. 2312-10 - les six années (LEGIARTI000036411580)");
      L.push("");
      L.push("« Les informations figurant dans la base de données portent sur l'année en");
      L.push("cours, sur les deux années précédentes et, telles qu'elles peuvent être");
      L.push("envisagées, sur les trois années suivantes. »");
      L.push("");
      L.push("R. 2312-12 - le support, et l'information de l'actualisation (LEGIARTI000036411586)");
      L.push("");
      L.push("« La base de données est tenue à la disposition des personnes mentionnées au");
      L.push("dernier alinéa de l'article L. 2312-36 sur un support informatique pour les");
      L.push("entreprises d'au moins trois cents salariés, et sur un support informatique");
      L.push("ou papier pour les entreprises de moins de trois cents salariés. L'employeur");
      L.push("informe ces personnes de l'actualisation de la base de données selon des");
      L.push("modalités qu'il détermine. »");
      L.push("");
      L.push("R. 2312-13 - la confidentialité (LEGIARTI000036411588)");
      L.push("");
      L.push("« Les informations figurant dans la base de données qui revêtent un caractère");
      L.push("confidentiel doivent être présentées comme telles par l'employeur qui indique");
      L.push("la durée du caractère confidentiel de ces informations que les personnes");
      L.push("mentionnées au dernier alinéa de l'article L. 2312-36 sont tenues de");
      L.push("respecter. »");
      L.push("");
      L.push("R. 2312-15 - la base de groupe (LEGIARTI000036411594)");
      L.push("");
      L.push("« Sans préjudice de l'obligation de mise en place d'une base de données au");
      L.push("niveau de l'entreprise, une convention ou un accord de groupe peut prévoir la");
      L.push("constitution d'une base de données au niveau du groupe. » Elle s'ajoute, elle");
      L.push("ne remplace pas.");
      L.push("");
      L.push("L. 2317-1 - ce qui est encouru (LEGIARTI000035634273)");
      L.push("");
      L.push("L'entrave au fonctionnement du comité est punie d'une amende de 7 500 euros.");
      L.push("Méfiez-vous des sources qui visent L. 2312-8 : cet article définit la mission");
      L.push("du comité, il ne porte aucune peine.");
      L.push("");
      L.push("La jurisprudence");
      L.push("");
      L.push("Vingt décisions publiées citent la base, relevées à Judilibre le 12 septembre");
      L.push("2026. La plus récente sur les destinataires est Cass. soc. 3 décembre 2025,");
      L.push("n° 24-10.326 : les demandes d'accès à la base « dont sont bénéficiaires les");
      L.push("membres de la délégation du personnel au comité social et économique et les");
      L.push("délégués syndicaux ». Aucune ne tranche le cas où il n'existe ni comité ni");
      L.push("délégué syndical.");
      L.push("");

      return L.join("\n");
    },
  });

  /* Les trois onglets, et leurs sous-boutons. La base ouvre une rubrique par
     bouton, les formalités une étape par bouton. */
  function coupeBdese(L, debut, fin) {
    var a = -1, b = L.length;
    for (var i = 0; i < L.length; i++) if (L[i].indexOf(debut) === 0) { a = i; break; }
    if (a < 0) return [];
    if (fin) for (var j = a + 1; j < L.length; j++) if (L[j].indexOf(fin) === 0) { b = j; break; }
    return L.slice(a, b);
  }
  DP.pour("BDESE-CTL-CNT-00").parties = function (ctx) {
    var p = (ctx && ctx.profil) || {};
    var L = DP.pour("BDESE-CTL-CNT-00").produire(ctx).split("\n");
    var g = grilleBdese(p);

    /* Les rubriques, dans l'ordre où la grille les donne. */
    var titres = [], vu = {};
    g.forEach(function (l) { if (!vu[l[0]]) { vu[l[0]] = true; titres.push(l[0]); } });
    var sousBase = [{ cle: "tete", nom: "Le régime",
      texte: coupeBdese(L, L[0], "RUBRIQUE 1 - ").join("\n") }];
    titres.forEach(function (t, i) {
      var debut = "RUBRIQUE " + (i + 1) + " - ";
      var fin = (i + 1 < titres.length) ? "RUBRIQUE " + (i + 2) + " - " : "DANS CET ORDRE";
      var texte = coupeBdese(L, debut, fin).join("\n");
      if (texte.trim()) sousBase.push({ cle: "r" + (i + 1), nom: courtBdese(t), texte: texte });
    });

    var bornes = [
      { cle: "f0", nom: "0 À qui ?", debut: "DANS CET ORDRE", fin: "ÉTAPE 1 - " },
      { cle: "f1", nom: "1 Le régime", debut: "ÉTAPE 1 - ", fin: "ÉTAPE 2 - " },
      { cle: "f2", nom: "2 Constituer", debut: "ÉTAPE 2 - ", fin: "ÉTAPE 3 - " },
      { cle: "f3", nom: "3 Le support", debut: "ÉTAPE 3 - ", fin: "ÉTAPE 4 - " },
      { cle: "f4", nom: "4 L'accès", debut: "ÉTAPE 4 - ", fin: "ÉTAPE 5 - " },
      { cle: "f5", nom: "5 Informer", debut: "ÉTAPE 5 - ", fin: "ÉTAPE 6 - " },
      { cle: "f6", nom: "6 Confidentiel", debut: "ÉTAPE 6 - ", fin: "LE RELEVÉ" },
      { cle: "rel", nom: "Le relevé", debut: "LE RELEVÉ", fin: "LE DROIT QUI FONDE" },
    ];
    var sousForm = bornes.map(function (b) {
      return { cle: b.cle, nom: b.nom, texte: coupeBdese(L, b.debut, b.fin).join("\n") };
    }).filter(function (x) { return x.texte.trim() !== ""; });

    return [
      /* « entier » : les onze rubriques sont les morceaux d'UNE base, pas onze
         documents. Le bouton Word de cet onglet emporte donc la base entière,
         rubrique par rubrique, avec les corrections portées à chacune. Sans ce
         drapeau, le fichier téléchargé ne contenait que la rubrique ouverte.
         « pieces » dit l'inverse pour les formalités : chaque sous-bouton y
         porte une lettre autonome, qui s'emporte seule. */
      { cle: "base", nom: "La base", entier: true,
        texte: coupeBdese(L, L[0], "DANS CET ORDRE").join("\n"), sous: sousBase },
      { cle: "formalites", nom: "Formalités", pieces: true,
        texte: coupeBdese(L, "DANS CET ORDRE", "LE DROIT QUI FONDE").join("\n"), sous: sousForm },
      { cle: "droit", nom: "Le droit", texte: coupeBdese(L, "LE DROIT QUI FONDE", null).join("\n") },
    ];
  };

})(typeof window !== "undefined" ? window : this);
