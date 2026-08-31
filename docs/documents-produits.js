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
   Là où la loi laisse un choix, le document en PROPOSE un, rédigé : demande du
   31 août 2026, « suggérer toujours une version quel que soit l'article ». Un
   employeur qui n'a pas de règlement intérieur n'a pas non plus la clause à
   écrire dans le crochet — lui laisser la page blanche, c'est ne rien faire.

   Le choix reste néanmoins visible, et il reste le sien : sous chaque clause
   proposée, une ligne « NOTE — » dit à quelle condition elle tient, ce qu'il
   faut y adapter, et quand la supprimer. Ces lignes ne font pas partie du
   règlement et se retirent avant le dépôt. Ne demeurent entre crochets que les
   renseignements que l'application ne peut pas connaître : un SIRET, des
   horaires, la liste des postes à risque, un nom, une date.

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
      L.push("Toutes les clauses sont rédigées : vous n'avez rien à écrire vous-même.");
      L.push("Il ne reste entre crochets que des renseignements — votre SIRET, vos");
      L.push("horaires, la liste de vos postes à risque, une date, un nom. Remplacez-les,");
      L.push("ou supprimez la ligne si elle ne vous concerne pas. Ne laissez aucun");
      L.push("crochet dans le texte que vous déposez.");
      L.push("");
      L.push("Les lignes qui commencent par NOTE ne font pas partie du règlement : elles");
      L.push("vous disent à quelle condition la clause qui précède tient, et ce qu'il");
      L.push("faut y adapter. SUPPRIMEZ-LES avant le dépôt.");
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
      L.push("Il s'applique uniformément à l'ensemble du personnel : aucune disposition");
      L.push("spéciale n'est établie pour une catégorie de personnel ou une division de");
      L.push("l'entreprise.");
      L.push("");
      L.push("NOTE — Si vous en établissez, l'article L. 1311-2, dernier alinéa, le");
      L.push("permet : remplacez alors la phrase ci-dessus par « Des dispositions");
      L.push("spéciales sont établies pour [CATÉGORIE OU DIVISION] ; elles figurent en");
      L.push("annexe du présent règlement et suivent les mêmes formalités que lui. »");
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
      L.push("Chaque salarié respecte les consignes de sécurité affichées ou portées à sa");
      L.push("connaissance pour l'unité de travail à laquelle il appartient, ainsi que les");
      L.push("modes opératoires qui lui ont été enseignés lors de sa formation à la");
      L.push("sécurité.");
      L.push("");
      L.push("Il est notamment interdit :");
      L.push("  — de neutraliser, modifier ou déposer un dispositif de sécurité d'une");
      L.push("    machine, d'un équipement, d'un véhicule ou d'un local ;");
      L.push("  — d'utiliser un équipement de travail pour un usage auquel il n'est pas");
      L.push("    destiné, ou sans avoir reçu la formation ou l'habilitation requises ;");
      L.push("  — d'introduire dans l'entreprise un produit, un matériel ou un véhicule");
      L.push("    non autorisé par la direction ;");
      L.push("  — d'accéder sans autorisation à une zone dont l'accès est réservé ou");
      L.push("    signalé comme dangereux ;");
      L.push("  — de fumer et de vapoter dans les locaux fermés et couverts affectés à un");
      L.push("    usage collectif.");
      L.push("");
      L.push("Tout salarié qui constate la défaillance d'un dispositif de protection en");
      L.push("avise immédiatement son responsable hiérarchique.");
      L.push("");
      L.push("NOTE — Ajoutez ici les consignes propres à vos unités de travail, telles");
      L.push("qu'elles ressortent de votre document unique. Une instruction qui ne");
      L.push("correspond à aucun risque évalué se défend mal ; une instruction absente là");
      L.push("où le risque est évalué se défend encore plus mal (L. 4122-1, qui impose");
      L.push("que les instructions précisent les conditions d'utilisation des équipements");
      L.push("de travail, des moyens de protection et des substances dangereuses, et");
      L.push("qu'elles soient adaptées à la nature des tâches).");
      L.push("");
      L.push("Article 3 — Équipements de protection individuelle");
      L.push("L'entreprise fournit gratuitement à chaque salarié les équipements de");
      L.push("protection individuelle nécessaires à son poste, ainsi que les vêtements de");
      L.push("travail lorsque la nature du travail l'exige.");
      L.push("");
      L.push("Le port de ces équipements est obligatoire pendant toute la durée de");
      L.push("l'exposition au risque, aux postes et dans les zones où il est prescrit par");
      L.push("la signalisation ou par la consigne de poste. Il n'y est dérogé en aucun");
      L.push("cas, quelle que soit la durée de l'intervention.");
      L.push("");
      L.push("Chaque salarié maintient ses équipements en bon état, les entretient");
      L.push("conformément à la notice qui lui a été remise et signale sans délai toute");
      L.push("détérioration ou perte : l'équipement est alors remplacé par l'entreprise,");
      L.push("sans frais pour le salarié. Ces équipements restent la propriété de");
      L.push("l'entreprise et sont restitués à la fin du contrat.");
      L.push("");
      L.push("NOTE — Annexez la liste des équipements fournis, poste par poste : c'est");
      L.push("elle qui rend l'obligation de port opposable à un salarié déterminé.");
      L.push("");
      L.push("Article 4 — Accidents et incidents");
      L.push("Tout accident, même bénin, et tout incident ayant pu entraîner un accident");
      L.push("sont signalés sans délai au responsable hiérarchique et, en son absence, à");
      L.push("la direction, qui procède à leur inscription et met en œuvre les mesures");
      L.push("nécessaires.");
      L.push("");
      L.push("NOTE — Si un service ou une personne est spécialement chargé de la sécurité");
      L.push("dans l'entreprise, nommez-le ici en plus du responsable hiérarchique.");
      L.push("");
      L.push("Article 5 — Visites médicales");
      L.push("Le personnel se soumet aux visites médicales et aux examens prévus par la");
      L.push("réglementation relative au suivi individuel de l'état de santé.");
      L.push("");
      L.push("Article 6 — Boissons alcoolisées et substances");
      L.push("6.1 — Aucune boisson alcoolisée autre que le vin, la bière, le cidre et le");
      L.push("poiré n'est autorisée sur le lieu de travail (R. 4228-20, alinéa 1er).");
      L.push("Toute autre boisson alcoolisée ne peut y être ni introduite, ni distribuée,");
      L.push("ni consommée.");
      L.push("");
      L.push("6.2 — Il est interdit de laisser entrer ou séjourner dans les lieux de");
      L.push("travail des personnes en état d'ivresse (R. 4228-21).");
      L.push("");
      L.push("6.3 — La consommation des boissons mentionnées au 6.1 est interdite aux");
      L.push("postes suivants, dont le document unique d'évaluation des risques établit");
      L.push("qu'une atteinte à la vigilance y exposerait le salarié ou autrui à un");
      L.push("danger : [LISTER VOS POSTES — par exemple : conduite d'un véhicule ou d'un");
      L.push("engin, travail en hauteur, conduite de machine dangereuse, manipulation de");
      L.push("produits dangereux, travail isolé, port d'arme, encadrement d'une");
      L.push("intervention de secours].");
      L.push("");
      L.push("6.4 — L'introduction, la détention et l'usage de substances stupéfiantes");
      L.push("sont interdits dans l'entreprise et pendant le temps de travail.");
      L.push("");
      L.push("6.5 — Lorsque l'état d'une personne occupant l'un des postes énumérés au 6.3");
      L.push("fait présumer une atteinte à sa vigilance et que cet état l'expose ou expose");
      L.push("autrui à un danger immédiat, un contrôle par éthylotest peut être pratiqué.");
      L.push("Ce contrôle ne peut avoir lieu que dans ce cas et selon les garanties");
      L.push("suivantes : le salarié est préalablement informé de l'objet du contrôle et");
      L.push("de son droit d'exiger la présence d'un témoin appartenant au personnel ; il");
      L.push("peut demander une seconde mesure immédiate ; le résultat n'est porté qu'à la");
      L.push("connaissance des personnes qui doivent en connaître.");
      L.push("");
      L.push("6.6 — Le retrait immédiat du poste de la personne dont l'état constitue un");
      L.push("danger est une mesure de sécurité, et non une sanction : il ne dispense pas");
      L.push("de la procédure disciplinaire si une sanction est ensuite envisagée.");
      L.push("");
      L.push("NOTE — La liste des postes du 6.3 est la condition de validité de tout ce");
      L.push("qui précède : R. 4228-20 exige que la mesure soit proportionnée au but");
      L.push("recherché, et L. 1321-3, 2° interdit les restrictions qui ne sont ni");
      L.push("justifiées par la nature de la tâche à accomplir ni proportionnées au but");
      L.push("recherché. Une interdiction générale et absolue, sans lien avec des postes");
      L.push("identifiés comme à risque dans votre document unique, est exposée au retrait");
      L.push("par l'inspecteur du travail. Si aucun poste n'est concerné, supprimez les");
      L.push("6.3 et 6.5 et gardez les autres : ils sont, eux, la loi elle-même.");
      L.push("");
      L.push("Article 7 — Rétablissement de conditions de travail protectrices");
      L.push("(L. 1321-1, 2°)");
      L.push("Lorsque les conditions de travail protectrices de la santé et de la sécurité");
      L.push("apparaissent compromises — notamment à la suite d'un accident, d'un");
      L.push("sinistre, de la défaillance d'un dispositif de protection, d'un défaut");
      L.push("d'hygiène ou d'une observation de l'inspecteur du travail ou du médecin du");
      L.push("travail —, les salariés peuvent être appelés, à la demande de l'employeur, à");
      L.push("participer à leur rétablissement.");
      L.push("");
      L.push("Les tâches confiées à ce titre se limitent à la mise en sécurité de la zone,");
      L.push("au rangement, au nettoyage, à l'évacuation des matériels ou produits en");
      L.push("cause et à l'assistance des intervenants. Elles ne peuvent excéder les");
      L.push("capacités du salarié ni la formation qu'il a reçue, et ne comportent aucune");
      L.push("opération pour laquelle une habilitation particulière est exigée si le");
      L.push("salarié n'en est pas titulaire. Elles s'exécutent pendant le temps de");
      L.push("travail, sont rémunérées comme tel, et prennent fin dès le rétablissement");
      L.push("constaté.");
      L.push("");
      L.push("Le présent article laisse entier le droit de tout travailleur de se retirer");
      L.push("d'une situation dont il a un motif raisonnable de penser qu'elle présente un");
      L.push("danger grave et imminent pour sa vie ou sa santé (L. 4131-1).");
      L.push("");

      L.push("════ TITRE II — DISCIPLINE ════");
      L.push("(L. 1321-1, 3° : les règles générales et permanentes relatives à la");
      L.push("discipline, notamment la nature et l'échelle des sanctions)");
      L.push("");
      L.push("Article 8 — Règles générales");
      L.push("8.1 Horaires — Le personnel respecte les horaires de travail affichés dans");
      L.push("l'entreprise. Tout retard est justifié auprès du responsable hiérarchique");
      L.push("dès la prise de poste. Le salarié ne quitte son poste avant l'heure qu'avec");
      L.push("l'accord de son responsable.");
      L.push("");
      L.push("8.2 Absences — Toute absence est portée à la connaissance de l'entreprise");
      L.push("dès que possible et, sauf impossibilité, le jour même. Elle est justifiée");
      L.push("dans les quarante-huit heures, sauf force majeure. En cas de maladie ou");
      L.push("d'accident, le salarié adresse l'arrêt de travail dans ce même délai, ainsi");
      L.push("que toute prolongation. Toute absence prévisible est autorisée");
      L.push("préalablement.");
      L.push("");
      L.push("8.3 Accès aux locaux — Le salarié n'accède aux locaux de l'entreprise que");
      L.push("pour l'exécution de son travail. Toute présence en dehors des horaires est");
      L.push("subordonnée à l'autorisation de la direction. Il est interdit d'y introduire");
      L.push("une personne étrangère à l'entreprise sans autorisation. Ces dispositions ne");
      L.push("font pas obstacle à l'exercice du droit syndical, du droit de grève et des");
      L.push("mandats représentatifs, ni à la libre circulation des représentants du");
      L.push("personnel dans les conditions prévues par la loi.");
      L.push("");
      L.push("8.4 Matériel, documents et données — Le matériel, les documents et les");
      L.push("données de l'entreprise sont réservés à un usage professionnel. Le salarié");
      L.push("en assure la conservation et les restitue à la fin de son contrat, sans");
      L.push("qu'il soit besoin de les lui réclamer.");
      L.push("");
      L.push("8.5 Tenue et comportement — Le salarié adopte une tenue compatible avec ses");
      L.push("fonctions et avec les règles de sécurité et d'hygiène de son poste. Il");
      L.push("s'abstient de tout comportement portant atteinte à la dignité ou à la");
      L.push("sécurité d'autrui, ainsi que de toute violence, physique ou verbale.");
      L.push("");
      L.push("NOTE — Adaptez les horaires et les délais aux vôtres et à votre convention");
      L.push("collective : une clause moins favorable que la convention est illicite");
      L.push("(L. 1321-3, 1°). Ces règles doivent rester GÉNÉRALES et PERMANENTES : une");
      L.push("règle qui ne vise qu'un salarié, ou qui n'a qu'un temps, relève de la note");
      L.push("de service ou du contrat, non du règlement intérieur.");
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
      L.push("  3. La mise à pied disciplinaire, d'une durée maximale de trois jours");
      L.push("     ouvrables, entraînant la suspension du contrat et de la rémunération");
      L.push("     pendant cette durée ;");
      L.push("  4. La mutation disciplinaire et la rétrogradation ;");
      L.push("  5. Le licenciement pour motif disciplinaire.");
      L.push("");
      L.push("L'employeur n'est pas tenu de suivre cet ordre : il choisit la sanction");
      L.push("proportionnée à la faute. Il ne peut en revanche prononcer aucune sanction");
      L.push("qui ne figure pas dans cette liste.");
      L.push("");
      L.push("NOTE — La durée de la mise à pied est ici proposée à trois jours ouvrables :");
      L.push("vous la fixez librement, mais elle doit figurer dans le règlement, à défaut");
      L.push("de quoi cette sanction ne peut pas être prononcée. La mutation et la");
      L.push("rétrogradation modifient le contrat et ne peuvent être imposées : le refus");
      L.push("du salarié oblige l'employeur à y renoncer ou à engager une autre");
      L.push("procédure ; supprimez le 4 si vous ne voulez pas de ces sanctions.");
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
      L.push("Lorsque la convention collective applicable — " +
        cro(p.conventionCollective, "INTITULÉ DE LA CONVENTION COLLECTIVE, IDCC") + " —");
      L.push("prévoit en matière disciplinaire des garanties supérieures à celles qui");
      L.push("précèdent, notamment la saisine préalable d'une commission de discipline,");
      L.push("un avis préalable ou des délais particuliers, ces garanties s'appliquent en");
      L.push("sus des dispositions du présent titre, qui ne s'y substituent pas.");
      L.push("");
      L.push("NOTE — Écrivez ici, en toutes lettres, la procédure que votre convention");
      L.push("impose. Sa méconnaissance est assimilée à la violation d'une garantie de");
      L.push("fond lorsqu'elle a privé le salarié de ses droits de la défense ou a pu");
      L.push("influer sur la décision : la sanction tombe alors sans examen des faits.");
      L.push("");

      L.push("════ TITRE IV — HARCÈLEMENTS ET AGISSEMENTS SEXISTES ════");
      L.push("(L. 1321-2, 2° : le règlement rappelle les dispositions relatives aux");
      L.push("harcèlements moral et sexuel et aux agissements sexistes prévues par le code)");
      L.push("");
      L.push("Article 15 — Harcèlement moral");
      L.push("Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui");
      L.push("ont pour objet ou pour effet une dégradation de ses conditions de travail");
      L.push("susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa");
      L.push("santé physique ou mentale ou de compromettre son avenir professionnel");
      L.push("(L. 1152-1).");
      L.push("");
      L.push("Aucune personne ayant subi ou refusé de subir de tels agissements, ni ayant");
      L.push("de bonne foi relaté ou témoigné de tels agissements, ne peut être écartée");
      L.push("d'un recrutement, sanctionnée, licenciée ni faire l'objet d'une mesure");
      L.push("discriminatoire, directe ou indirecte (L. 1152-2, renvoyant à L. 1121-2).");
      L.push("Toute rupture du contrat intervenue en méconnaissance de ces dispositions,");
      L.push("toute disposition ou tout acte contraire, est nul (L. 1152-3).");
      L.push("");
      L.push("Tout salarié ayant procédé à des agissements de harcèlement moral est");
      L.push("passible d'une sanction disciplinaire (L. 1152-5).");
      L.push("");
      L.push("Article 16 — Harcèlement sexuel");
      L.push("Aucun salarié ne doit subir des faits (L. 1153-1) :");
      L.push("  1° Soit de harcèlement sexuel, constitué par des propos ou comportements à");
      L.push("     connotation sexuelle ou sexiste répétés qui soit portent atteinte à sa");
      L.push("     dignité en raison de leur caractère dégradant ou humiliant, soit créent");
      L.push("     à son encontre une situation intimidante, hostile ou offensante. Le");
      L.push("     harcèlement sexuel est également constitué lorsqu'un même salarié subit");
      L.push("     de tels propos ou comportements venant de plusieurs personnes, de");
      L.push("     manière concertée ou à l'instigation de l'une d'elles, alors même que");
      L.push("     chacune n'a pas agi de façon répétée, et lorsqu'un même salarié les");
      L.push("     subit successivement de plusieurs personnes qui, même sans concertation,");
      L.push("     savent qu'ils caractérisent une répétition ;");
      L.push("  2° Soit assimilés au harcèlement sexuel, consistant en toute forme de");
      L.push("     pression grave, même non répétée, exercée dans le but réel ou apparent");
      L.push("     d'obtenir un acte de nature sexuelle, que celui-ci soit recherché au");
      L.push("     profit de l'auteur des faits ou au profit d'un tiers.");
      L.push("");
      L.push("Aucune personne ayant subi ou refusé de subir de tels faits — y compris,");
      L.push("dans le cas du 1°, si les propos ou comportements n'ont pas été répétés —");
      L.push("ni ayant de bonne foi témoigné ou relaté de tels faits, ne peut être écartée");
      L.push("d'un recrutement, sanctionnée, licenciée ni faire l'objet d'une mesure");
      L.push("discriminatoire (L. 1153-2, renvoyant à L. 1121-2). Toute disposition ou");
      L.push("tout acte contraire est nul (L. 1153-4).");
      L.push("");
      L.push("Tout salarié ayant procédé à des faits de harcèlement sexuel est passible");
      L.push("d'une sanction disciplinaire (L. 1153-6).");
      L.push("");
      L.push("Article 17 — Agissements sexistes");
      L.push("Nul ne doit subir d'agissement sexiste, défini comme tout agissement lié au");
      L.push("sexe d'une personne, ayant pour objet ou pour effet de porter atteinte à sa");
      L.push("dignité ou de créer un environnement intimidant, hostile, dégradant,");
      L.push("humiliant ou offensant (L. 1142-2-1). Un tel agissement expose son auteur");
      L.push("aux sanctions prévues à l'article 9 du présent règlement.");
      L.push("");
      L.push("Article 18 — Prévention, information et signalement");
      L.push("L'employeur prend toutes dispositions nécessaires en vue de prévenir les");
      L.push("agissements de harcèlement moral (L. 1152-4), de prévenir les faits de");
      L.push("harcèlement sexuel, d'y mettre un terme et de les sanctionner (L. 1153-5).");
      L.push("");
      L.push("Le texte de l'article 222-33-2 du code pénal (harcèlement moral) et celui de");
      L.push("l'article 222-33 du code pénal (harcèlement sexuel), les actions");
      L.push("contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel");
      L.push("ainsi que les coordonnées des autorités et services compétents sont portés à");
      L.push("la connaissance des personnes concernées par voie d'affichage dans les lieux");
      L.push("de travail et dans les locaux où se fait l'embauche (L. 1152-4 ; L. 1153-5).");
      L.push("");
      L.push("Tout salarié qui s'estime victime de tels faits, ou qui en est témoin, peut");
      L.push("les signaler par tout moyen écrit, sans passer par sa hiérarchie s'il ne le");
      L.push("souhaite pas, à l'un des interlocuteurs suivants :");
      L.push("  — son responsable hiérarchique ou la direction ;");
      L.push("  — le référent en matière de lutte contre le harcèlement sexuel et les");
      L.push("    agissements sexistes désigné par le comité social et économique parmi");
      L.push("    ses membres : [NOM ET COORDONNÉES] ;");
      L.push("  — [SI L'ENTREPRISE ATTEINT 250 SALARIÉS : le référent désigné par");
      L.push("    l'employeur : NOM ET COORDONNÉES] ;");
      L.push("  — le médecin du travail ou le service de prévention et de santé au");
      L.push("    travail : [COORDONNÉES] ;");
      L.push("  — l'inspection du travail : [COORDONNÉES DE LA SECTION COMPÉTENTE].");
      L.push("");
      L.push("Tout signalement donne lieu à un accusé de réception écrit et à une enquête");
      L.push("conduite avec impartialité et discrétion, à laquelle la personne mise en");
      L.push("cause est mise à même de répondre. Lorsque les faits sont établis,");
      L.push("l'employeur y met un terme, prend les mesures de protection nécessaires et");
      L.push("engage la procédure disciplinaire. L'auteur du signalement est informé des");
      L.push("suites qui lui sont données.");
      L.push("");

      L.push("════ TITRE V — PROTECTION DES LANCEURS D'ALERTE ════");
      L.push("(L. 1321-2, 3° : le règlement rappelle l'existence du dispositif de");
      L.push("protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691");
      L.push("du 9 décembre 2016)");
      L.push("");
      L.push("Article 19 — Existence du dispositif et protection");
      L.push("Il existe un dispositif de protection des lanceurs d'alerte, institué par le");
      L.push("chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la");
      L.push("transparence, à la lutte contre la corruption et à la modernisation de la");
      L.push("vie économique.");
      L.push("");
      L.push("Aucune personne ne peut être écartée d'une procédure de recrutement ou de");
      L.push("l'accès à un stage ou à une période de formation, aucun salarié ne peut être");
      L.push("sanctionné, licencié ni faire l'objet d'une mesure discriminatoire, directe");
      L.push("ou indirecte — notamment en matière de rémunération, de formation, de");
      L.push("reclassement, d'affectation, de qualification, de classification, de");
      L.push("promotion, d'horaires, d'évaluation de la performance, de mutation ou de");
      L.push("renouvellement de contrat — pour avoir signalé ou divulgué des informations");
      L.push("dans les conditions prévues par cette loi (L. 1121-2).");
      L.push("");
      L.push("Les signalements sont recueillis et traités selon la procédure interne en");
      L.push("vigueur dans l'entreprise, consultable [OÙ LA CONSULTER — par exemple : sur");
      L.push("l'intranet, auprès du service des ressources humaines], et peuvent être");
      L.push("adressés à [PERSONNE OU SERVICE DÉSIGNÉ POUR LES RECEVOIR]. Le salarié");
      L.push("conserve la faculté de s'adresser directement à l'autorité externe");
      L.push("compétente dans les conditions prévues par la même loi.");
      L.push("");
      L.push("NOTE — Cette loi n'est pas au code du travail : l'application ne l'a pas lue");
      L.push("à la source et n'en détaille donc pas le contenu ici. Si vous n'avez pas");
      L.push("encore de procédure interne de recueil des signalements, supprimez la");
      L.push("dernière phrase du troisième alinéa jusqu'à sa mise en place — l'existence");
      L.push("du dispositif, elle, doit être rappelée dans tous les cas (L. 1321-2, 3°).");
      L.push("");

      /* Le principe de neutralité n'est pas obligatoire : il est une faculté que
         L. 1321-2-1 encadre. Le proposer comme un modèle tout fait pousserait à
         l'inscrire sans en mesurer la condition. */
      L.push("════ TITRE VI — [FACULTATIF] PRINCIPE DE NEUTRALITÉ ════");
      L.push("(L. 1321-2-1 — ce titre est FACULTATIF : supprimez-le si vous n'inscrivez");
      L.push("pas de principe de neutralité)");
      L.push("");
      L.push("Article 20 — Principe de neutralité");
      L.push("Les salariés occupant un poste comportant un contact direct avec la");
      L.push("clientèle ou le public observent, dans l'exercice de leurs fonctions et");
      L.push("pendant ce seul temps, une stricte neutralité : ils s'abstiennent de");
      L.push("manifester leurs convictions politiques, philosophiques ou religieuses par");
      L.push("leurs propos, leur comportement ou leur tenue.");
      L.push("");
      L.push("Cette restriction est justifiée par [ÉCRIRE ICI CE QUI LA JUSTIFIE DANS");
      L.push("VOTRE ENTREPRISE — par exemple : la nécessité de préserver, auprès d'une");
      L.push("clientèle diverse, l'image d'impartialité de l'entreprise dans l'exécution");
      L.push("de prestations réalisées chez le client]. Elle est proportionnée au but");
      L.push("recherché en ce qu'elle est limitée aux seuls salariés en contact avec la");
      L.push("clientèle ou le public, qu'elle ne s'applique pas aux autres postes, et");
      L.push("qu'un salarié qui s'y refuserait se verrait proposer, dans la mesure du");
      L.push("possible, un poste sans contact avec la clientèle plutôt qu'un licenciement.");
      L.push("");
      L.push("NOTE — La clause n'est licite qu'à ces deux conditions cumulatives");
      L.push("(L. 1321-2-1) : une clause qui viserait l'ensemble du personnel sans");
      L.push("distinction de poste ne l'est pas. Le motif entre crochets doit être écrit");
      L.push("dans le règlement lui-même : c'est cette motivation qui défendra la clause.");
      L.push("Supprimez tout ce titre si vous n'inscrivez pas de principe de neutralité.");
      L.push("");

      L.push("════ TITRE VII — ENTRÉE EN VIGUEUR, PUBLICITÉ, MODIFICATIONS ════");
      L.push("");
      L.push("Article 21 — Entrée en vigueur");
      L.push("Le présent règlement entre en vigueur le [DATE D'ENTRÉE EN VIGUEUR].");
      L.push("Cette date doit être postérieure d'un mois à l'accomplissement des");
      L.push("formalités de publicité, le délai courant à compter de la dernière en date");
      L.push("des formalités de publicité et de dépôt (L. 1321-4 ; R. 1321-3).");
      L.push("");
      L.push("Article 22 — Publicité");
      L.push("Le règlement est porté, par tout moyen, à la connaissance des personnes ayant");
      L.push("accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1).");
      L.push("");
      L.push("Article 23 — Modifications");
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
      L.push("Article 24 — Langue");
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
