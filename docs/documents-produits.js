/* Les documents que l'application PRODUIT.

   POURQUOI CE FICHIER EXISTE

   L'audit disait ce qui manque. Les fiches de régularisation disaient quoi
   faire. Aucun des deux ne faisait le travail : un employeur qui apprend qu'il
   lui manque un règlement intérieur, et à qui l'on explique en cinq étapes
   comment en établir un, n'a toujours pas de règlement intérieur.

   Ce fichier produit le document lui-même — rédigé, au nom de l'entreprise,
   prêt à suivre ses formalités. C'est la différence entre un outil de constat
   et un outil de travail.

   CE QUE LE DOCUMENT CONTIENT, ET CE QU'IL LAISSE À DÉCIDER

   Tout ce que la loi impose est écrit, et fondé sur l'article lu à la source.
   Tout ce que la loi laisse à l'employeur est entre crochets : c'est un choix,
   pas un oubli, et le lecteur doit le voir. Un document qui devinerait ces
   choix serait pire qu'absent — il ferait signer à l'employeur des règles
   qu'il n'a pas voulues.

   Chaque partie porte l'article qui la commande. Ce n'est pas de l'ornement :
   un règlement intérieur se discute devant l'inspecteur du travail, qui peut
   en exiger le retrait ou la modification (L. 1322-1). Savoir d'où vient
   chaque clause, c'est pouvoir la défendre — ou l'abandonner sans tout casser.

   LES COURRIERS VONT AVEC. Un règlement intérieur non consulté, non publié,
   non déposé et non communiqué n'entre pas en vigueur. Les trois courriers
   sont donc produits en même temps que lui, et non « à faire ensuite ».  */
(function (global) {
  "use strict";

  /* Ce qui n'est pas renseigné sort entre crochets : visible, jamais inventé.
     C'est la convention du module d'organisation des élections, et elle vaut
     partout où l'application produit un document. */
  function cro(v, quoi) {
    var s = String(v == null ? "" : v).trim();
    return s === "" ? "[" + (quoi || "à compléter") + "]" : s;
  }

  function leJour(d) {
    var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                "août", "septembre", "octobre", "novembre", "décembre"];
    var x = d instanceof Date ? d : new Date(d);
    if (isNaN(x)) return "[date]";
    return x.getDate() + " " + MOIS[x.getMonth()] + " " + x.getFullYear();
  }

  function dans(d, jours) {
    var x = d instanceof Date ? new Date(d.getTime()) : new Date(d);
    if (isNaN(x)) return null;
    x.setDate(x.getDate() + jours);
    return x;
  }

  /* L'en-tête commun : qui écrit, à quelle date, sur quel fondement. */
  function entete(ctx, titre, fondement) {
    var p = ctx.profil || {};
    return [
      cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE").toUpperCase(),
      cro(p.adresse, "adresse du siège"),
      p.siret ? "SIRET " + p.siret : "[SIRET]",
      "",
      titre.toUpperCase(),
      fondement ? "(" + fondement + ")" : "",
      "",
      "Établi le " + leJour(ctx.aujourdhui) + ".",
      "",
    ].filter(function (l) { return l !== null; });
  }

  var D = {};

  /* ══════════════════════════════════════════════════════════════════════
     LE RÈGLEMENT INTÉRIEUR
     ══════════════════════════════════════════════════════════════════════ */

  D["DIS-CTL-RI-01"] = {
    nom: "Le règlement intérieur, et ses trois courriers",
    detail: "Le règlement rédigé, la consultation du comité, la transmission à " +
            "l'inspecteur du travail et le dépôt au greffe.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var nom = cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE");
      var eff = p.effectif;
      var L = [];

      L = L.concat(entete(ctx, "Règlement intérieur", "articles L. 1311-2 et L. 1321-1 à L. 1321-6 du code du travail"));

      L.push("COMMENT SE SERVIR DE CE DOCUMENT");
      L.push("");
      L.push("Ce texte est complet : il porte tout ce que la loi impose à un règlement");
      L.push("intérieur, et rien d'autre — l'article L. 1321-1 dit que l'employeur y fixe");
      L.push("« exclusivement » trois matières, et une clause étrangère à ces matières");
      L.push("n'a pas sa place ici.");
      L.push("");
      L.push("Ce qui est entre crochets vous appartient : ce sont les choix que la loi");
      L.push("vous laisse — l'échelle de vos sanctions, vos règles d'hygiène propres,");
      L.push("vos horaires. Remplacez chaque crochet, ou supprimez la ligne si elle ne");
      L.push("vous concerne pas. Ne laissez aucun crochet dans le texte que vous déposez.");
      L.push("");
      L.push("Chaque partie porte l'article qui la commande. Gardez ces mentions : elles");
      L.push("vous serviront si l'inspecteur du travail demande le retrait ou la");
      L.push("modification d'une clause (L. 1322-1).");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");

      L.push("RÈGLEMENT INTÉRIEUR");
      L.push("");
      L.push(nom.toUpperCase());
      L.push("");
      L.push("PRÉAMBULE — CHAMP D'APPLICATION");
      L.push("");
      L.push("Le présent règlement intérieur s'applique à l'ensemble du personnel de");
      L.push(nom + ", en quelque lieu qu'il exerce son activité, ainsi qu'aux");
      L.push("personnes qui, sans être salariées, exécutent un travail dans l'entreprise");
      L.push("— notamment les salariés d'entreprises extérieures, les intérimaires, les");
      L.push("stagiaires et les apprentis — pour celles de ses dispositions relatives à");
      L.push("la santé, à la sécurité et à la discipline.");
      L.push("");
      L.push("Il est établi en application de l'article L. 1311-2 du code du travail, qui");
      L.push("le rend obligatoire dans les entreprises et établissements employant au");
      L.push("moins cinquante salariés" +
        (eff ? " — l'effectif de l'entreprise est de " + eff + " salariés" : "") + ".");
      L.push("");
      L.push("[Le cas échéant : des dispositions spéciales sont établies pour la catégorie");
      L.push("de personnel ou la division suivante — L. 1311-2, dernier alinéa :");
      L.push("préciser laquelle, et lesquelles.]");
      L.push("");

      L.push("════ TITRE I — SANTÉ ET SÉCURITÉ ════");
      L.push("(L. 1321-1, 1° : les mesures d'application de la réglementation en matière");
      L.push("de santé et de sécurité, notamment les instructions prévues à L. 4122-1)");
      L.push("");
      L.push("Article 1 — Obligation générale");
      L.push("Chaque salarié prend soin, en fonction de sa formation et selon ses");
      L.push("possibilités, de sa santé et de sa sécurité ainsi que de celles des autres");
      L.push("personnes concernées par ses actes ou ses omissions au travail. Il se");
      L.push("conforme aux instructions données par l'employeur.");
      L.push("");
      L.push("Article 2 — Instructions particulières");
      L.push("[Énumérer ici vos instructions propres, tirées de votre document unique");
      L.push("d'évaluation des risques : consignes par unité de travail, conduites à");
      L.push("tenir, interdictions particulières. Une instruction qui ne correspond à");
      L.push("aucun risque évalué se défend mal ; une instruction absente là où le risque");
      L.push("est évalué se défend encore plus mal.]");
      L.push("");
      L.push("Article 3 — Équipements de protection individuelle");
      L.push("[Lister les équipements fournis, les postes où leur port est obligatoire, et");
      L.push("les conditions de leur entretien et de leur remplacement.]");
      L.push("");
      L.push("Article 4 — Accidents et incidents");
      L.push("Tout accident, même bénin, et tout incident ayant pu entraîner un accident");
      L.push("sont signalés sans délai à [préciser : le responsable hiérarchique, le");
      L.push("service désigné].");
      L.push("");
      L.push("Article 5 — Visites médicales");
      L.push("Le personnel se soumet aux visites médicales et aux examens prévus par la");
      L.push("réglementation relative au suivi individuel de l'état de santé.");
      L.push("");
      L.push("Article 6 — Boissons alcoolisées et substances");
      L.push("[Rédiger votre clause. Attention : une restriction n'est licite que si elle");
      L.push("est justifiée par la nature de la tâche à accomplir ET proportionnée au but");
      L.push("recherché (L. 1321-3, 2°). Une interdiction générale et absolue, sans lien");
      L.push("avec des postes identifiés comme à risque dans votre document unique, est");
      L.push("exposée au retrait par l'inspecteur du travail.]");
      L.push("");
      L.push("Article 7 — Rétablissement de conditions de travail protectrices");
      L.push("(L. 1321-1, 2°)");
      L.push("[Préciser les conditions dans lesquelles les salariés peuvent être appelés,");
      L.push("à la demande de l'employeur, à participer au rétablissement de conditions de");
      L.push("travail protectrices de la santé et de la sécurité, dès lors qu'elles");
      L.push("apparaîtraient compromises : qui peut être appelé, à quelles tâches, dans");
      L.push("quelles limites.]");
      L.push("");

      L.push("════ TITRE II — DISCIPLINE ════");
      L.push("(L. 1321-1, 3° : les règles générales et permanentes relatives à la");
      L.push("discipline, notamment la nature et l'échelle des sanctions)");
      L.push("");
      L.push("Article 8 — Règles générales");
      L.push("[Rédiger vos règles générales et permanentes : horaires et leur respect,");
      L.push("accès aux locaux, usage du matériel de l'entreprise, tenue, absences et");
      L.push("leur justification. Elles doivent être GÉNÉRALES et PERMANENTES : une règle");
      L.push("individuelle ou temporaire n'a pas sa place dans un règlement intérieur.]");
      L.push("");
      L.push("Article 9 — Nature et échelle des sanctions");
      L.push("Constitue une sanction toute mesure, autre que les observations verbales,");
      L.push("prise par l'employeur à la suite d'un agissement du salarié considéré par");
      L.push("lui comme fautif, que cette mesure soit de nature à affecter immédiatement");
      L.push("ou non la présence du salarié dans l'entreprise, sa fonction, sa carrière ou");
      L.push("sa rémunération (L. 1331-1).");
      L.push("");
      L.push("Les sanctions susceptibles d'être prononcées sont, dans l'ordre croissant");
      L.push("de gravité :");
      L.push("");
      L.push("  1. L'avertissement ;");
      L.push("  2. Le blâme ;");
      L.push("  3. La mise à pied disciplinaire, d'une durée maximale de [PRÉCISER LA");
      L.push("     DURÉE MAXIMALE — par exemple : trois jours ouvrables] ;");
      L.push("  4. [Le cas échéant : la mutation disciplinaire, la rétrogradation — ces");
      L.push("     sanctions modifient le contrat et ne peuvent être imposées : le refus");
      L.push("     du salarié oblige l'employeur à renoncer ou à engager une autre");
      L.push("     procédure] ;");
      L.push("  5. Le licenciement pour motif disciplinaire.");
      L.push("");
      L.push("La durée maximale de la mise à pied disciplinaire doit impérativement");
      L.push("figurer ci-dessus : à défaut, cette sanction ne peut pas être prononcée.");
      L.push("");
      L.push("L'employeur n'est pas tenu de suivre cet ordre : il choisit la sanction");
      L.push("proportionnée à la faute. Il ne peut en revanche prononcer aucune sanction");
      L.push("qui ne figure pas dans cette liste.");
      L.push("");
      L.push("Article 10 — Interdiction des sanctions pécuniaires");
      L.push("Les amendes et autres sanctions pécuniaires sont interdites. Toute");
      L.push("disposition ou stipulation contraire est réputée non écrite (L. 1331-2).");
      L.push("");

      L.push("════ TITRE III — DROITS DE LA DÉFENSE ════");
      L.push("(L. 1321-2, 1° : le règlement rappelle les dispositions relatives aux droits");
      L.push("de la défense définies aux articles L. 1332-1 à L. 1332-3)");
      L.push("");
      L.push("Article 11 — Information écrite des griefs");
      L.push("Aucune sanction ne peut être prise à l'encontre d'un salarié sans que");
      L.push("celui-ci soit informé, dans le même temps et par écrit, des griefs retenus");
      L.push("contre lui (L. 1332-1).");
      L.push("");
      L.push("Article 12 — Entretien préalable et assistance");
      L.push("Lorsque l'employeur envisage de prendre une sanction, il convoque le salarié");
      L.push("en lui précisant l'objet de la convocation — sauf si la sanction envisagée");
      L.push("est un avertissement ou une sanction de même nature n'ayant pas");
      L.push("d'incidence, immédiate ou non, sur la présence dans l'entreprise, la");
      L.push("fonction, la carrière ou la rémunération.");
      L.push("");
      L.push("Lors de son audition, le salarié peut se faire assister par une personne de");
      L.push("son choix appartenant au personnel de l'entreprise. Au cours de l'entretien,");
      L.push("l'employeur indique le motif de la sanction envisagée et recueille les");
      L.push("explications du salarié (L. 1332-2).");
      L.push("");
      L.push("Article 13 — Mise à pied conservatoire");
      L.push("Lorsque les faits reprochés ont rendu indispensable une mesure conservatoire");
      L.push("de mise à pied à effet immédiat, aucune sanction définitive relative à ces");
      L.push("faits ne peut être prise sans que la procédure de l'article L. 1332-2 ait été");
      L.push("respectée (L. 1332-3). La mise à pied conservatoire n'est pas une sanction.");
      L.push("");
      L.push("Article 14 — Prescription");
      L.push("Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de");
      L.push("poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour");
      L.push("où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans");
      L.push("le même délai à l'exercice de poursuites pénales (L. 1332-4).");
      L.push("");
      L.push("Aucune sanction antérieure de plus de trois ans à l'engagement des");
      L.push("poursuites ne peut être invoquée à l'appui d'une nouvelle sanction");
      L.push("(L. 1332-5).");
      L.push("");
      L.push("[Le cas échéant : rappeler ici la procédure disciplinaire propre à votre");
      L.push("convention collective — commission de discipline, avis préalable, délais");
      L.push("particuliers. Sa méconnaissance est assimilée à la violation d'une garantie");
      L.push("de fond lorsqu'elle a privé le salarié de ses droits de la défense ou a pu");
      L.push("influer sur la décision finale.]");
      L.push("");

      L.push("════ TITRE IV — HARCÈLEMENTS ET AGISSEMENTS SEXISTES ════");
      L.push("(L. 1321-2, 2° : le règlement rappelle les dispositions relatives aux");
      L.push("harcèlements moral et sexuel et aux agissements sexistes prévues par le code)");
      L.push("");
      L.push("Article 15 — Rappel");
      L.push("[Reproduire ici le texte des dispositions du code du travail relatives au");
      L.push("harcèlement moral, au harcèlement sexuel et aux agissements sexistes. Le");
      L.push("module « santé, sécurité et conditions de travail » de cette application");
      L.push("porte ces articles, lus à la source, et le module « comité » traite du");
      L.push("référent chargé de ces questions.]");
      L.push("");
      L.push("Article 16 — Signalement");
      L.push("[Préciser à qui un salarié peut signaler des faits de harcèlement ou des");
      L.push("agissements sexistes, et ce qui suit un signalement.]");
      L.push("");

      L.push("════ TITRE V — PROTECTION DES LANCEURS D'ALERTE ════");
      L.push("(L. 1321-2, 3° : le règlement rappelle l'existence du dispositif de");
      L.push("protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691");
      L.push("du 9 décembre 2016)");
      L.push("");
      L.push("Article 17 — Existence du dispositif");
      L.push("Il existe un dispositif de protection des lanceurs d'alerte, institué par le");
      L.push("chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la");
      L.push("transparence, à la lutte contre la corruption et à la modernisation de la");
      L.push("vie économique.");
      L.push("");
      L.push("[Préciser la procédure de recueil et de traitement des signalements en");
      L.push("vigueur dans l'entreprise, si elle existe, et où la consulter. Cette loi");
      L.push("n'est pas au code du travail : l'application ne l'a pas lue à la source et");
      L.push("n'en détaille donc pas le contenu ici.]");
      L.push("");

      /* Le principe de neutralité n'est pas obligatoire : il est une faculté que
         L. 1321-2-1 encadre. Le proposer comme un modèle tout fait pousserait à
         l'inscrire sans en mesurer la condition. */
      L.push("════ TITRE VI — [FACULTATIF] PRINCIPE DE NEUTRALITÉ ════");
      L.push("(L. 1321-2-1 — ce titre est FACULTATIF : supprimez-le si vous n'inscrivez");
      L.push("pas de principe de neutralité)");
      L.push("");
      L.push("Le règlement intérieur PEUT contenir des dispositions inscrivant le principe");
      L.push("de neutralité et restreignant la manifestation des convictions des salariés,");
      L.push("à deux conditions cumulatives : que ces restrictions soient justifiées par");
      L.push("l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du");
      L.push("bon fonctionnement de l'entreprise, ET qu'elles soient proportionnées au but");
      L.push("recherché.");
      L.push("");
      L.push("[Si vous inscrivez une telle clause, écrivez dans le règlement lui-même en");
      L.push("quoi elle est justifiée et en quoi elle est proportionnée : c'est cette");
      L.push("motivation qui la défendra.]");
      L.push("");

      L.push("════ TITRE VII — ENTRÉE EN VIGUEUR, PUBLICITÉ, MODIFICATIONS ════");
      L.push("");
      L.push("Article 18 — Entrée en vigueur");
      L.push("Le présent règlement entre en vigueur le [DATE D'ENTRÉE EN VIGUEUR].");
      L.push("Cette date doit être postérieure d'un mois à l'accomplissement des");
      L.push("formalités de publicité, le délai courant à compter de la dernière en date");
      L.push("des formalités de publicité et de dépôt (L. 1321-4 ; R. 1321-3).");
      L.push("");
      L.push("Article 19 — Publicité");
      L.push("Le règlement est porté, par tout moyen, à la connaissance des personnes ayant");
      L.push("accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1).");
      L.push("");
      L.push("Article 20 — Modifications");
      L.push("Toute modification ou tout retrait de clause suit les mêmes formalités que");
      L.push("l'établissement du règlement : avis du comité social et économique,");
      L.push("publicité, dépôt et communication à l'inspecteur du travail (L. 1321-4,");
      L.push("dernier alinéa).");
      L.push("");
      L.push("Les notes de service et tout autre document comportant des obligations");
      L.push("générales et permanentes dans les matières du règlement en sont des");
      L.push("adjonctions et suivent les mêmes règles. Toutefois, lorsque l'urgence le");
      L.push("justifie, les obligations relatives à la santé et à la sécurité peuvent");
      L.push("recevoir application immédiate ; elles sont alors immédiatement et");
      L.push("simultanément communiquées au secrétaire du comité social et économique");
      L.push("ainsi qu'à l'inspection du travail (L. 1321-5).");
      L.push("");
      L.push("Article 21 — Langue");
      L.push("Le présent règlement est rédigé en français (L. 1321-6).");
      L.push("");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");

      /* ---- les trois courriers, produits avec le règlement ---- */
      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("COURRIER 1 — CONSULTATION DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("");
      L.push("À adresser AVANT toute introduction du règlement : L. 1321-4 interdit son");
      L.push("introduction avant que le comité ait été mis à même de donner son avis.");
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : consultation sur le projet de règlement intérieur");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'entreprise employant au moins cinquante salariés, l'établissement d'un");
      L.push("règlement intérieur lui est imposé par l'article L. 1311-2 du code du");
      L.push("travail.");
      L.push("");
      L.push("Conformément à l'article L. 1321-4 du même code, aux termes duquel le");
      L.push("règlement intérieur ne peut être introduit qu'après avoir été soumis à");
      L.push("l'avis du comité social et économique, je vous adresse ci-joint le projet");
      L.push("et vous invite à en délibérer lors de la réunion du [DATE DE LA RÉUNION].");
      L.push("");
      L.push("L'avis que vous rendrez sera communiqué à l'inspecteur du travail en même");
      L.push("temps que le règlement, comme le même article l'exige.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité"));
      L.push("");
      L.push("Pièce jointe : projet de règlement intérieur");
      L.push("");
      L.push("");

      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("COURRIER 2 — TRANSMISSION À L'INSPECTEUR DU TRAVAIL");
      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("");
      L.push("À adresser EN MÊME TEMPS que les mesures de publicité, en DEUX exemplaires,");
      L.push("accompagné de l'avis du comité (L. 1321-4 ; R. 1321-4).");
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse"));
      L.push("");
      L.push("Monsieur l'Inspecteur du travail");
      L.push("[Adresse de l'unité de contrôle compétente]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le [DATE D'ENVOI]");
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : communication du règlement intérieur");
      L.push("");
      L.push("Monsieur l'Inspecteur,");
      L.push("");
      L.push("En application des articles L. 1321-4 et R. 1321-4 du code du travail, je");
      L.push("vous communique en deux exemplaires le règlement intérieur de " + nom + ",");
      L.push("accompagné de l'avis rendu par le comité social et économique le");
      L.push("[DATE DE L'AVIS].");
      L.push("");
      L.push("Les formalités de publicité ont été accomplies le [DATE DE PUBLICITÉ] et le");
      L.push("dépôt au greffe du conseil de prud'hommes de [VILLE] le [DATE DE DÉPÔT].");
      L.push("L'entrée en vigueur est fixée au [DATE], postérieure d'un mois à la");
      L.push("dernière en date de ces formalités.");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur l'Inspecteur, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité"));
      L.push("");
      L.push("Pièces jointes : règlement intérieur (2 exemplaires) · avis du comité social");
      L.push("et économique");
      L.push("");
      L.push("");

      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("COURRIER 3 — DÉPÔT AU GREFFE DU CONSEIL DE PRUD'HOMMES");
      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("");
      L.push("Le dépôt se fait au greffe du conseil de prud'hommes DU RESSORT de");
      L.push("l'entreprise ou de l'établissement (R. 1321-2).");
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse"));
      L.push("");
      L.push("Monsieur le Greffier en chef");
      L.push("Conseil de prud'hommes de [VILLE DU RESSORT]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le [DATE D'ENVOI]");
      L.push("");
      L.push("Objet : dépôt du règlement intérieur");
      L.push("");
      L.push("Monsieur le Greffier en chef,");
      L.push("");
      L.push("En application de l'article R. 1321-2 du code du travail, je procède au");
      L.push("dépôt du règlement intérieur de " + nom + " au greffe du conseil de");
      L.push("prud'hommes du ressort de l'entreprise.");
      L.push("");
      L.push("Je vous serais reconnaissant de bien vouloir m'en délivrer récépissé : c'est");
      L.push("de la dernière en date des formalités de publicité et de dépôt que court le");
      L.push("délai d'un mois précédant l'entrée en vigueur (R. 1321-3).");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur le Greffier en chef, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité"));
      L.push("");
      L.push("Pièce jointe : règlement intérieur");
      L.push("");
      L.push("");

      /* ---- le calendrier, calculé ---- */
      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("VOTRE CALENDRIER");
      L.push("════════════════════════════════════════════════════════════════════════");
      L.push("");
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous adressez le projet au comité (courrier 1).");
      L.push("Le comité rend son avis en réunion : prévoyez le délai de convocation que");
      L.push("votre règlement intérieur de comité ou vos usages imposent.");
      L.push("");
      L.push("Le jour de l'avis — vous accomplissez la publicité (R. 1321-1), vous déposez");
      L.push("au greffe (R. 1321-2) et vous transmettez à l'inspecteur en deux exemplaires");
      L.push("avec l'avis (R. 1321-4). Ces trois actes peuvent se faire le même jour.");
      L.push("");
      L.push("Un mois plus tard, au plus tôt — le règlement entre en vigueur. Si la");
      L.push("dernière formalité était accomplie aujourd'hui, l'entrée en vigueur ne");
      L.push("pourrait pas être antérieure au " + leJour(dans(d0, 31)) + ".");
      L.push("");
      L.push("Avant cette date, aucune sanction ne peut être fondée sur ce règlement.");
      L.push("");
      L.push("────────────────────────────────────────────────────────────────────────");
      L.push("");
      L.push("Ce document reprend les textes lus à la source : L. 1311-2, L. 1321-1,");
      L.push("L. 1321-2, L. 1321-2-1, L. 1321-3, L. 1321-4, L. 1321-5, L. 1321-6,");
      L.push("L. 1331-1, L. 1331-2, L. 1332-1 à L. 1332-5, R. 1321-1 à R. 1321-5.");
      L.push("Il ne vaut pas consultation : votre convention collective et vos accords");
      L.push("peuvent ajouter des exigences que l'application ne lit pas.");
      return L.join("\n");
    },
  };

  /* Ce que la page demande : y a-t-il un document pour ce point ? */
  function pour(id) { return Object.prototype.hasOwnProperty.call(D, id) ? D[id] : null; }

  /* Les modules déposent leurs générateurs ici, chacun dans son fichier —
     documents-cse.js, documents-pse.js… Un seul registre, huit sources : c'est
     ce qui permet de travailler sur un module sans toucher aux sept autres.

     Les outils communs sont passés à celui qui enregistre : rien n'oblige un
     générateur à réécrire la mise entre crochets ou le formatage des dates,
     et deux façons d'écrire une date dans deux documents de la même entreprise
     se remarquent tout de suite. */
  function ajouter(id, def) {
    if (!id || !def || typeof def.produire !== "function")
      throw new Error("documents produits : « " + id + " » n'a pas de fonction produire.");
    if (Object.prototype.hasOwnProperty.call(D, id))
      throw new Error("documents produits : « " + id + "  » est déjà enregistré.");
    D[id] = def;
  }

  global.DocumentsProduits = {
    pour: pour, tous: D, ajouter: ajouter,
    outils: { cro: cro, leJour: leJour, dans: dans, entete: entete },
  };
})(typeof window !== "undefined" ? window : this);
