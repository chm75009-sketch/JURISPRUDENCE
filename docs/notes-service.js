/* LES NOTES DE SERVICE, PAR THÈME.

   POURQUOI CE FICHIER EXISTE

   Demande du 15 septembre 2026 : « une série de modèles de notes de service
   qui concerne toute la vie de l'entreprise, le maximum possible ; une fois
   générée et validée, tu lui donnes un numéro et une référence automatique »,
   puis « tu les classes par thème et pour le secteur transport tu les adaptes
   à ce secteur ».

   CE QU'UNE NOTE DE SERVICE EST, EN DROIT

   Article L. 1321-5 du code du travail (LEGIARTI000035653093, deux lectures
   concordantes le 15 septembre 2026) : « Les notes de service ou tout autre
   document comportant des obligations générales et permanentes dans les
   matières mentionnées aux articles L. 1321-1 et L. 1321-2 sont, lorsqu'il
   existe un règlement intérieur, considérées comme des adjonctions à
   celui-ci. Ils sont, en toute hypothèse, soumis aux dispositions du présent
   titre. Toutefois, lorsque l'urgence le justifie, les obligations relatives
   à la santé et à la sécurité peuvent recevoir application immédiate. »

   Les matières en cause sont celles de L. 1321-1 (LEGIARTI000006901432, deux
   lectures le même jour) : les mesures d'application de la réglementation de
   santé et de sécurité, la participation des salariés au rétablissement de
   conditions de travail protectrices, et les règles générales et permanentes
   relatives à la discipline.

   Conséquence pratique, et c'est ce que porte l'alerte de chaque modèle
   concerné : une note qui touche à ces matières suit les formalités du
   règlement intérieur, avis du comité social et économique, publicité,
   communication à l'inspecteur du travail, entrée en vigueur un mois après
   (L. 1321-4, LEGIARTI000054140230). Une note d'information ou
   d'organisation, elle, s'affiche et s'applique.

   COMMENT UN MODÈLE EST ÉCRIT

     { id, theme, titre, objet, corps[], adjonction, urgence, secteurs }

   - « adjonction » vrai : la note porte des obligations générales et
     permanentes de santé, de sécurité ou de discipline. L'écran affiche
     alors les formalités.
   - « urgence » vrai : la note peut recevoir application immédiate si
     l'urgence le justifie, la santé ou la sécurité étant en cause.
   - « secteurs » limite un modèle à un secteur ; absent, il vaut pour tous.

   Ce que l'application ne peut pas savoir reste entre crochets, en rouge à
   l'écran comme dans le Word. Aucun article n'est cité dans le corps des
   notes : seuls le sont, dans l'alerte, ceux qui ont été lus à la source.  */

"use strict";
(function (window) {

  var THEMES = [
    { cle: "org", nom: "Organisation du travail", sous: "Services, remplacements, ouverture et fermeture", code: "ORG" },
    { cle: "tps", nom: "Horaires et temps de travail", sous: "Décompte, heures supplémentaires, pauses, dimanche", code: "TPS" },
    { cle: "abs", nom: "Congés et absences", sous: "Demandes, ordre des départs, justificatifs, retards", code: "ABS" },
    { cle: "sst", nom: "Santé et sécurité", sous: "Évacuation, protections, accidents, chaleur, froid", code: "SST" },
    { cle: "dis", nom: "Discipline et vie de l'entreprise", sous: "Règlement intérieur, tenue, téléphone, respect", code: "DIS" },
    { cle: "mat", nom: "Matériel, véhicules et locaux", sous: "Remise, usage, dommages, entretien, propreté", code: "MAT" },
    { cle: "num", nom: "Informatique et données", sous: "Outils, mots de passe, messagerie, données clients", code: "NUM" },
    { cle: "pay", nom: "Rémunération et frais", sous: "Bulletins, frais professionnels, acomptes, primes", code: "PAY" },
    { cle: "rep", nom: "Personnel et représentation", sous: "Affichage, comité, entretiens, formation", code: "REP" },
    { cle: "env", nom: "Environnement et énergie", sous: "Déchets, tri, consommations", code: "ENV" },
  ];

  var M = [];
  function a(theme, id, titre, objet, corps, o) {
    o = o || {};
    M.push({
      theme: theme, id: id, titre: titre, objet: objet, corps: corps,
      adjonction: !!o.adjonction, urgence: !!o.urgence,
      secteurs: o.secteurs || null, note: o.note || "",
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     ORGANISATION DU TRAVAIL
     ══════════════════════════════════════════════════════════════════════ */

  a("org", "org-organigramme", "Organisation des services et responsables",
    "Organisation des services à compter du [DATE]",
    ["À compter du [DATE], l'organisation des services est la suivante.",
     "",
     "[SERVICE] : responsable [NOM ET PRÉNOM], [QUALITÉ].",
     "[SERVICE] : responsable [NOM ET PRÉNOM], [QUALITÉ].",
     "",
     "Chaque salarié relève du responsable de son service pour l'organisation quotidienne du travail, la validation des absences et la remontée des difficultés.",
     "",
     "Cette organisation ne modifie ni les contrats de travail, ni les qualifications, ni les rémunérations.",
     "",
     "Toute question sur ce point se pose au responsable du service ou à la direction."]);

  a("org", "org-remplacement", "Remplacement en cas d'absence",
    "Conduite à tenir en cas d'absence d'un salarié",
    ["Pour que le service soit assuré en toute circonstance, la procédure suivante s'applique.",
     "",
     "Le salarié empêché prévient son responsable dès qu'il a connaissance de son absence, et au plus tard [DÉLAI], par téléphone au [NUMÉRO] ou par message.",
     "",
     "Le responsable organise le remplacement dans son service. Si aucun remplacement interne n'est possible, il en informe la direction le jour même.",
     "",
     "Le salarié qui accepte de remplacer un collègue n'est pas tenu de le faire en dehors de son horaire de travail ; s'il l'accepte, les heures sont décomptées et payées comme telles.",
     "",
     "Aucun poste de [POSTES CONCERNÉS] ne reste sans titulaire pendant le service."]);

  a("org", "org-ouverture", "Ouverture, fermeture, clés et alarme",
    "Ouverture et fermeture de l'établissement",
    ["L'ouverture et la fermeture de l'établissement obéissent aux règles suivantes.",
     "",
     "Les personnes habilitées à détenir les clés et le code de l'alarme sont : [NOMS ET QUALITÉS]. Cette liste est tenue à jour par la direction.",
     "",
     "À l'ouverture : désactivation de l'alarme, vérification de l'état des locaux, et signalement immédiat de toute anomalie à [NOM OU FONCTION].",
     "",
     "À la fermeture : extinction des appareils, contrôle des issues et des fenêtres, mise en route de l'alarme, verrouillage.",
     "",
     "Les clés ne se prêtent pas et ne se dupliquent pas. Une perte se signale le jour même.",
     "",
     "Le code de l'alarme est personnel et ne se communique à personne."],
    { adjonction: true });

  a("org", "org-reunion", "Réunion d'équipe et compte rendu",
    "Réunions de service : périodicité et déroulement",
    ["Une réunion de service se tient [PÉRIODICITÉ], le [JOUR] à [HEURE], dans [LIEU].",
     "",
     "Elle porte sur l'organisation du travail, les difficultés rencontrées, les consignes de sécurité et les projets en cours.",
     "",
     "Le temps de réunion est du temps de travail effectif : il est décompté et payé comme tel.",
     "",
     "Un compte rendu est établi par [NOM OU FONCTION] et affiché sur le panneau de [LIEU] dans les [DÉLAI] qui suivent.",
     "",
     "Tout salarié peut faire inscrire un point à l'ordre du jour en le remettant à [NOM OU FONCTION] avant la réunion."]);

  a("org", "org-polyvalence", "Polyvalence et entraide entre services",
    "Entraide entre services aux heures de forte activité",
    ["Aux heures de forte activité, l'entraide entre services permet de tenir la cadence sans allonger les journées.",
     "",
     "Chaque salarié peut se voir confier, dans la limite de sa qualification et de sa formation, une tâche relevant d'un autre poste de l'établissement.",
     "",
     "Aucune tâche exigeant une habilitation, une autorisation de conduite ou une formation particulière n'est confiée à un salarié qui ne la détient pas.",
     "",
     "Cette entraide ne modifie ni la qualification, ni la classification, ni la rémunération du salarié.",
     "",
     "Une difficulté d'exécution se signale au responsable, qui réorganise ou reprend la tâche."]);

  /* ══════════════════════════════════════════════════════════════════════
     HORAIRES ET TEMPS DE TRAVAIL
     ══════════════════════════════════════════════════════════════════════ */

  a("tps", "tps-decompte", "Décompte du temps de travail",
    "Décompte quotidien du temps de travail",
    ["Le temps de travail de chacun est décompté chaque jour, par [MOYEN DE DÉCOMPTE : badgeuse, feuille de présence, application].",
     "",
     "Chaque salarié enregistre lui-même son arrivée, son départ, et le début et la fin de ses pauses non travaillées.",
     "",
     "Un oubli se corrige auprès de [NOM OU FONCTION] le jour même ou le lendemain, par écrit.",
     "",
     "Nul n'enregistre l'arrivée ou le départ d'un autre salarié.",
     "",
     "Le relevé individuel est consultable à tout moment auprès de [NOM OU FONCTION], et remis sur demande.",
     "",
     "Ce décompte sert au paiement du salaire, des heures supplémentaires et des majorations : il doit être exact."],
    { adjonction: true });

  a("tps", "tps-heures-sup", "Heures supplémentaires : demande écrite préalable",
    "Heures supplémentaires : conditions d'accomplissement",
    ["Les heures supplémentaires ne s'accomplissent qu'à la demande écrite et préalable de la direction ou du responsable de service.",
     "",
     "Aucune heure accomplie de sa propre initiative n'est considérée comme une heure supplémentaire commandée ; le salarié qui estime devoir dépasser son horaire en avertit son responsable avant de le faire.",
     "",
     "Les heures commandées sont décomptées, majorées et payées selon la loi et la convention collective applicable, ou récupérées lorsque cette possibilité est prévue et acceptée.",
     "",
     "Elles figurent sur le bulletin de paie du mois où elles sont accomplies, ou du mois suivant.",
     "",
     "Le responsable qui commande une heure supplémentaire en informe la direction le jour même."]);

  a("tps", "tps-pauses", "Pauses et temps de repas",
    "Organisation des pauses",
    ["Les pauses s'organisent de la façon suivante, pour que le service reste assuré.",
     "",
     "Dès que le travail quotidien atteint six heures, le salarié bénéficie d'une pause d'au moins vingt minutes consécutives.",
     "",
     "Dans ce service, la pause se prend entre [HEURE] et [HEURE], par roulement arrêté par le responsable.",
     "",
     "Pendant la pause, le salarié est libre de vaquer à ses occupations : il n'est pas tenu de rester à la disposition de l'entreprise, et la pause n'est pas du temps de travail effectif.",
     "",
     "Le lieu prévu pour les pauses est [LIEU]. Il est laissé propre.",
     "",
     "Une pause interrompue à la demande du responsable redevient du temps de travail et se reprend plus tard."],
    { adjonction: true });

  a("tps", "tps-dimanche", "Travail du dimanche et des jours fériés",
    "Organisation du travail le dimanche et les jours fériés",
    ["L'activité de l'entreprise conduit à travailler certains dimanches et jours fériés.",
     "",
     "Le planning des dimanches et jours fériés travaillés est affiché [DÉLAI] à l'avance sur le panneau de [LIEU].",
     "",
     "Il est établi par roulement, de façon que la charge soit répartie entre les salariés du service.",
     "",
     "Les contreparties applicables, majoration ou repos, sont celles de la convention collective et de la loi : [PRÉCISER CE QUI S'APPLIQUE DANS L'ENTREPRISE].",
     "",
     "Un empêchement se signale dès la parution du planning, par écrit, à [NOM OU FONCTION]."]);

  a("tps", "tps-modification", "Modification de la répartition des horaires",
    "Changement d'horaires à compter du [DATE]",
    ["À compter du [DATE], la répartition des horaires de [SERVICE OU SALARIÉS CONCERNÉS] devient la suivante : [NOUVEAUX HORAIRES].",
     "",
     "Cette modification tient à [MOTIF : évolution de l'activité, ouverture d'un service, saison].",
     "",
     "Elle est annoncée [DÉLAI] avant son entrée en vigueur, conformément au délai de prévenance prévu par les contrats de travail et la convention collective.",
     "",
     "La durée hebdomadaire de travail de chacun reste inchangée.",
     "",
     "Le salarié qui rencontre une difficulté personnelle sérieuse liée à ce changement en informe la direction par écrit avant le [DATE], pour qu'une solution soit cherchée."]);

  a("tps", "tps-astreinte", "Astreintes",
    "Organisation des astreintes",
    ["Une astreinte est une période pendant laquelle le salarié, sans être sur son lieu de travail et sans être à la disposition permanente de l'entreprise, doit pouvoir intervenir.",
     "",
     "Les astreintes concernent [POSTES CONCERNÉS] et s'organisent ainsi : [PÉRIODES ET ROULEMENT].",
     "",
     "Le planning des astreintes est communiqué à chaque salarié concerné [DÉLAI] à l'avance.",
     "",
     "La compensation de l'astreinte est de [COMPENSATION PRÉVUE].",
     "",
     "Le temps d'intervention, déplacement compris, est du temps de travail effectif : il est décompté, payé et pris en compte pour les repos.",
     "",
     "Chaque intervention est consignée : date, heure d'appel, heure de retour, nature de l'intervention."]);

  /* ══════════════════════════════════════════════════════════════════════
     CONGÉS ET ABSENCES
     ══════════════════════════════════════════════════════════════════════ */

  a("abs", "abs-demande", "Demandes de congés payés",
    "Dépôt des demandes de congés payés",
    ["Les demandes de congés payés se déposent selon les règles suivantes.",
     "",
     "La demande est écrite, sur [FORMULAIRE OU OUTIL], et remise à [NOM OU FONCTION] au moins [DÉLAI] avant la date souhaitée.",
     "",
     "Pour les congés d'été, les demandes sont déposées avant le [DATE], afin que l'ordre des départs soit arrêté et affiché.",
     "",
     "La réponse est écrite et donnée dans un délai de [DÉLAI]. Un refus est motivé.",
     "",
     "Aucun départ en congé n'a lieu avant l'accord écrit de l'entreprise.",
     "",
     "Le solde de congés de chacun figure sur le bulletin de paie."]);

  a("abs", "abs-ordre", "Ordre des départs en congés",
    "Ordre des départs en congés pour la période [PÉRIODE]",
    ["L'ordre des départs en congés pour la période allant du [DATE] au [DATE] est arrêté comme suit : [TABLEAU OU LISTE DES DATES PAR SALARIÉ].",
     "",
     "Il tient compte de la situation de famille de chacun, de l'ancienneté, et de l'activité de l'entreprise pendant la période.",
     "",
     "Il est affiché ce jour sur le panneau de [LIEU] et le restera jusqu'au [DATE].",
     "",
     "Une fois l'ordre des départs fixé, il ne peut être modifié dans le mois qui précède le départ, sauf circonstance exceptionnelle.",
     "",
     "Une demande d'échange entre deux salariés se présente par écrit et signée des deux."]);

  a("abs", "abs-justificatifs", "Justification des absences",
    "Signalement et justification des absences",
    ["Toute absence se signale et se justifie, quelle qu'en soit la cause.",
     "",
     "Le salarié prévient son responsable dès qu'il a connaissance de son absence, et au plus tard [DÉLAI] après le début du service, par téléphone au [NUMÉRO].",
     "",
     "En cas de maladie ou d'accident, l'arrêt de travail est transmis dans les quarante-huit heures à [DESTINATAIRE ET ADRESSE].",
     "",
     "Une prolongation se signale et se justifie dans les mêmes conditions.",
     "",
     "Une absence non signalée et non justifiée perturbe le service et peut donner lieu à une procédure disciplinaire, dans le respect du règlement intérieur et de la loi.",
     "",
     "Le salarié informe également l'entreprise de sa date de reprise, pour que la visite médicale éventuellement due soit organisée."],
    { adjonction: true });

  a("abs", "abs-retards", "Retards",
    "Ponctualité à la prise de poste",
    ["La prise de poste à l'heure conditionne le travail de tous : un retard reporte la charge sur les collègues présents.",
     "",
     "Chacun est à son poste, en tenue, à l'heure inscrite au planning.",
     "",
     "Un retard, quelle qu'en soit la cause, se signale au responsable avant l'heure de prise de poste lorsque c'est possible, et s'explique dès l'arrivée.",
     "",
     "Les retards sont décomptés du temps de travail.",
     "",
     "Des retards répétés, après rappel, peuvent donner lieu à une sanction disciplinaire proportionnée, dans le respect du règlement intérieur et de la loi.",
     "",
     "Une difficulté durable de transport ou de garde se signale à la direction : une solution est cherchée avant qu'elle ne devienne un motif de reproche."],
    { adjonction: true });

  a("abs", "abs-evenements", "Congés pour événements familiaux",
    "Congés pour événements familiaux : comment les demander",
    ["Certains événements familiaux ouvrent droit à des jours d'absence payés : mariage, naissance, décès d'un proche, et les autres cas prévus par la loi et la convention collective.",
     "",
     "La demande se fait par écrit, dès que l'événement est connu, auprès de [NOM OU FONCTION], avec la pièce justificative.",
     "",
     "Ces jours sont assimilés à du temps de travail effectif : ils n'entament ni les congés payés, ni la rémunération.",
     "",
     "Ils se prennent au moment de l'événement, ou dans les jours qui l'entourent.",
     "",
     "En cas de doute sur le droit applicable à votre situation, adressez-vous à [NOM OU FONCTION] : la convention collective est consultable dans l'entreprise."]);

  /* ══════════════════════════════════════════════════════════════════════
     SANTÉ ET SÉCURITÉ
     ══════════════════════════════════════════════════════════════════════ */

  a("sst", "sst-evacuation", "Consignes d'évacuation",
    "Consignes d'évacuation et point de rassemblement",
    ["En cas d'alarme, l'évacuation est immédiate et sans exception.",
     "",
     "Chacun quitte son poste, arrête son installation si un geste suffit, et sort par l'issue la plus proche indiquée par les panneaux.",
     "",
     "Les ascenseurs ne sont pas utilisés. Personne ne revient chercher un effet personnel.",
     "",
     "Le point de rassemblement est [LIEU PRÉCIS]. On y reste jusqu'à l'autorisation de regagner les locaux.",
     "",
     "Les guides et serre-files désignés sont : [NOMS]. Ils s'assurent que personne ne reste dans les locaux et comptent les présents.",
     "",
     "Les issues de secours restent dégagées en permanence : rien n'est stocké devant, aucune porte n'est calée ni verrouillée pendant le service.",
     "",
     "Un exercice d'évacuation aura lieu le [DATE]."],
    { adjonction: true, urgence: true });

  a("sst", "sst-epi", "Équipements de protection individuelle",
    "Port des équipements de protection",
    ["Les équipements de protection sont fournis par l'entreprise, gratuitement, et leur port est obligatoire aux postes concernés.",
     "",
     "Postes et équipements : [POSTE] : [ÉQUIPEMENTS]. [POSTE] : [ÉQUIPEMENTS].",
     "",
     "Un équipement usé, cassé ou perdu se signale immédiatement à [NOM OU FONCTION] et est remplacé sans délai : travailler sans, en attendant, n'est pas autorisé.",
     "",
     "Chacun vérifie l'état de son équipement avant la prise de poste.",
     "",
     "Les équipements se rangent à [LIEU] et ne quittent pas l'établissement.",
     "",
     "Le refus de porter un équipement obligatoire expose le salarié à une sanction disciplinaire, et surtout à un risque qui n'a pas à être couru."],
    { adjonction: true, urgence: true });

  a("sst", "sst-accident", "Conduite à tenir en cas d'accident du travail",
    "Accident du travail : ce qu'il faut faire",
    ["Tout accident, même léger, même sans arrêt, se déclare.",
     "",
     "Porter secours en priorité : appeler le 15 ou le 112 si l'état le justifie, et alerter un sauveteur secouriste du travail.",
     "",
     "Les sauveteurs secouristes du travail de l'établissement sont : [NOMS]. La trousse de premiers secours se trouve à [LIEU].",
     "",
     "Prévenir immédiatement [NOM OU FONCTION], qui note les circonstances, l'heure, le lieu et les témoins.",
     "",
     "La victime, ou un témoin si elle ne le peut pas, informe l'employeur dans la journée : c'est ce qui permet la déclaration à la caisse dans le délai légal.",
     "",
     "Le poste est laissé en l'état tant que les circonstances n'ont pas été relevées, sauf si cela crée un nouveau danger.",
     "",
     "Un accident évité de justesse se signale de la même façon : c'est ce qui permet d'éviter le suivant."],
    { adjonction: true, urgence: true });

  a("sst", "sst-duerp", "Document unique : mise à jour et consultation",
    "Mise à jour du document unique d'évaluation des risques",
    ["Le document unique d'évaluation des risques professionnels a été mis à jour le [DATE].",
     "",
     "Il recense, pour chaque unité de travail, les risques auxquels les salariés sont exposés et les mesures de prévention retenues.",
     "",
     "Il est consultable par tout salarié à [LIEU], sur simple demande auprès de [NOM OU FONCTION], et les versions successives sont conservées.",
     "",
     "Le programme d'actions qui en découle porte pour cette année sur : [ACTIONS RETENUES].",
     "",
     "Chacun peut signaler un risque qui n'y figurerait pas, ou une mesure qui ne fonctionne pas en pratique, auprès de [NOM OU FONCTION] : le document se nourrit de ce qui se constate au poste.",
     "",
     "Les représentants du personnel sont associés à sa mise à jour."],
    { adjonction: true });

  a("sst", "sst-chaleur", "Travail par fortes chaleurs",
    "Mesures applicables en cas de forte chaleur",
    ["En période de forte chaleur, les mesures suivantes s'appliquent à compter du [DATE].",
     "",
     "De l'eau fraîche potable est mise à disposition à [LIEUX] ; chacun boit régulièrement sans attendre la soif.",
     "",
     "Les tâches les plus physiques sont avancées aux heures les plus fraîches, dans la mesure où l'activité le permet.",
     "",
     "Des pauses supplémentaires de [DURÉE] sont accordées à [POSTES CONCERNÉS], à l'ombre ou dans un local rafraîchi, à [LIEU].",
     "",
     "Le travail isolé aux postes exposés est suspendu : personne ne reste seul sur [POSTES].",
     "",
     "Un malaise, un vertige, des crampes ou des maux de tête : le salarié s'arrête, prévient, et un collègue reste auprès de lui.",
     "",
     "L'encadrement adapte les cadences et suspend les tâches non indispensables si la situation l'exige."],
    { adjonction: true, urgence: true });

  a("sst", "sst-froid", "Travail par temps froid, pluie et verglas",
    "Mesures applicables par temps froid ou verglacé",
    ["Les mesures suivantes s'appliquent aux postes exposés au froid et aux intempéries.",
     "",
     "Les vêtements chauds et imperméables prévus pour [POSTES CONCERNÉS] sont fournis par l'entreprise et portés.",
     "",
     "Une boisson chaude est disponible à [LIEU].",
     "",
     "Les zones de circulation extérieures sont salées ou sablées avant la prise de poste par [NOM OU FONCTION]. Une zone glissante non traitée se signale immédiatement.",
     "",
     "Des pauses de réchauffement de [DURÉE] sont prises à [LIEU].",
     "",
     "Par verglas, les déplacements non indispensables sont reportés et les cadences adaptées."],
    { adjonction: true, urgence: true });

  a("sst", "sst-tabac", "Interdiction de fumer et de vapoter",
    "Interdiction de fumer et de vapoter dans les locaux",
    ["Il est interdit de fumer et de vapoter dans l'ensemble des locaux fermés et couverts de l'entreprise, ainsi que dans les véhicules de service.",
     "",
     "Cette interdiction s'applique à tous : salariés, intérimaires, stagiaires, prestataires et visiteurs.",
     "",
     "La signalisation réglementaire est apposée aux entrées et dans les locaux.",
     "",
     "L'emplacement extérieur où il est possible de fumer est [LIEU], en dehors des temps de travail effectif et en respectant les règles de sécurité applicables aux zones voisines.",
     "",
     "Les mégots se jettent dans le cendrier prévu, jamais au sol ni dans une poubelle.",
     "",
     "Le manquement à cette interdiction expose à une sanction disciplinaire, et engage la responsabilité de l'entreprise en cas de contrôle."],
    { adjonction: true });

  a("sst", "sst-alcool", "Alcool, médicaments et substances : rappel des règles",
    "Vigilance au poste : alcool, médicaments et substances",
    ["Une vigilance diminuée expose le salarié et ses collègues à un danger immédiat. Les règles suivantes sont rappelées.",
     "",
     "L'introduction et la consommation de boissons alcoolisées dans l'entreprise sont réglées par le règlement intérieur : s'y reporter.",
     "",
     "Les postes où une vigilance diminuée met en danger sont : [LISTE DES POSTES]. Cette liste est tenue à jour et connue de ceux qui les tiennent.",
     "",
     "Un salarié qui se sait hors d'état de tenir son poste le dit à son responsable et il est remplacé : l'avoir dit ne lui sera pas reproché.",
     "",
     "Un traitement médical susceptible d'altérer la vigilance se signale au médecin du travail, jamais à l'employeur, et l'aménagement du poste passe par le service de prévention et de santé au travail.",
     "",
     "L'encadrement qui constate un état inquiétant écarte le salarié du poste sur-le-champ, organise son retour sans conduite personnelle, et écrit ce qui a été constaté. Écarter n'est pas sanctionner.",
     "",
     "Les pots et repas d'entreprise sont encadrés : quantité limitée, boissons sans alcool disponibles, et personne ne reprend ensuite la route, un engin ou une machine."],
    { adjonction: true, urgence: true });

  a("sst", "sst-secours", "Sauveteurs secouristes et trousse de secours",
    "Premiers secours dans l'établissement",
    ["Les salariés formés au sauvetage et secourisme du travail sont : [NOMS ET SERVICES]. Leur formation est à jour au [DATE].",
     "",
     "Les trousses de premiers secours se trouvent à [LIEUX]. Leur contenu est vérifié par [NOM OU FONCTION] tous les [PÉRIODICITÉ].",
     "",
     "[LE DÉFIBRILLATEUR SE TROUVE À : LIEU.]",
     "",
     "Les numéros d'urgence sont affichés à côté de chaque téléphone : 15 secours médicaux, 18 pompiers, 112 numéro européen, 114 par message pour les personnes sourdes.",
     "",
     "Tout usage du contenu d'une trousse se signale à [NOM OU FONCTION] pour réapprovisionnement.",
     "",
     "Le registre des soins et petits accidents est tenu à [LIEU] : y inscrire tout soin, même bénin."],
    { adjonction: true });

  a("sst", "sst-circulation", "Circulation et stockage dans les locaux",
    "Règles de circulation et de stockage",
    ["La sécurité des déplacements dans les locaux tient à des règles simples, applicables à tous.",
     "",
     "Les allées de circulation, les issues et les accès aux moyens de secours restent libres en permanence.",
     "",
     "Rien n'est stocké devant un extincteur, un tableau électrique, une porte de secours ou une bouche de désenfumage.",
     "",
     "Les charges sont rangées du plus lourd en bas au plus léger en haut, sans dépasser la hauteur de [HAUTEUR].",
     "",
     "Un sol mouillé ou souillé se signale, se balise et se nettoie immédiatement.",
     "",
     "Les zones où circulent des engins sont matérialisées : les piétons empruntent les cheminements prévus.",
     "",
     "Une anomalie, une charge instable, un éclairage défaillant se signalent à [NOM OU FONCTION] le jour même."],
    { adjonction: true });

  /* ══════════════════════════════════════════════════════════════════════
     DISCIPLINE ET VIE DE L'ENTREPRISE
     ══════════════════════════════════════════════════════════════════════ */

  a("dis", "dis-ri", "Rappel du règlement intérieur",
    "Rappel des règles du règlement intérieur",
    ["Le règlement intérieur de l'entreprise, en vigueur depuis le [DATE], s'impose à tous.",
     "",
     "Il est affiché sur le panneau de [LIEU] et consultable à tout moment auprès de [NOM OU FONCTION].",
     "",
     "Il fixe les mesures d'application de la réglementation de santé et de sécurité, les règles générales et permanentes de discipline, et l'échelle des sanctions.",
     "",
     "Les points suivants appellent une attention particulière : [POINTS RAPPELÉS].",
     "",
     "Chacun est invité à en relire le texte. Une question sur son application se pose à [NOM OU FONCTION].",
     "",
     "Aucune sanction ne peut être prononcée en dehors de celles qu'il prévoit, ni sans la procédure qu'il décrit."],
    { adjonction: true });

  a("dis", "dis-tenue", "Tenue de travail et présentation",
    "Tenue de travail",
    ["La tenue de travail répond à des exigences d'hygiène, de sécurité et de représentation de l'entreprise.",
     "",
     "La tenue fournie pour [POSTES CONCERNÉS] comprend : [COMPOSITION]. Elle est portée pendant tout le service.",
     "",
     "Elle est entretenue [PAR QUI ET COMMENT], et se change dès qu'elle est souillée.",
     "",
     "Le temps d'habillage et de déshabillage, lorsqu'il a lieu dans l'entreprise, donne lieu à la contrepartie prévue par la convention collective.",
     "",
     "Les chaussures de sécurité, lorsqu'elles sont prévues au poste, ne sont remplacées par aucune autre.",
     "",
     "La tenue reste dans l'établissement et se range à [LIEU]. Elle est restituée au départ du salarié."],
    { adjonction: true });

  a("dis", "dis-telephone", "Usage du téléphone personnel pendant le service",
    "Téléphone personnel pendant le service",
    ["L'usage du téléphone personnel est réglé de la façon suivante.",
     "",
     "Pendant le service, le téléphone personnel reste rangé : pas d'appel, pas de message, pas de consultation, sauf urgence familiale.",
     "",
     "À certains postes, l'usage du téléphone est interdit pour des raisons de sécurité : [POSTES CONCERNÉS].",
     "",
     "Les appels personnels se passent pendant les pauses, à [LIEU].",
     "",
     "Une urgence familiale peut être reçue à tout moment : prévenir son responsable et s'écarter du poste.",
     "",
     "Le numéro de l'entreprise, [NUMÉRO], peut être communiqué à vos proches pour qu'ils vous joignent en cas de besoin."],
    { adjonction: true });

  a("dis", "dis-respect", "Respect entre collègues, harcèlement et agissements sexistes",
    "Respect des personnes au travail",
    ["Aucun propos ni comportement portant atteinte à la dignité d'une personne n'a sa place dans l'entreprise.",
     "",
     "Sont notamment proscrits le harcèlement moral, le harcèlement sexuel, les agissements sexistes, les propos racistes ou discriminatoires, et les brimades, y compris présentés comme des plaisanteries.",
     "",
     "Un salarié qui subit ou qui voit de tels agissements peut s'adresser à : [NOM OU FONCTION], au référent désigné [NOM], aux représentants du personnel, au médecin du travail, ou à l'inspection du travail.",
     "",
     "Tout signalement est reçu, instruit sans délai et traité avec discrétion.",
     "",
     "Aucune personne ne peut être sanctionnée, ni écartée, ni pénalisée pour avoir signalé de tels faits ou en avoir témoigné.",
     "",
     "Les auteurs s'exposent à une sanction disciplinaire pouvant aller jusqu'au licenciement, indépendamment des poursuites que la loi prévoit.",
     "",
     "Les coordonnées et les textes sont affichés sur le panneau de [LIEU]."],
    { adjonction: true });

  a("dis", "dis-clientele", "Comportement avec la clientèle",
    "Relation avec la clientèle",
    ["La façon dont chacun s'adresse aux clients engage l'entreprise entière.",
     "",
     "Accueil, politesse et réponse au moins provisoire à toute demande : personne ne repart sans réponse.",
     "",
     "Une réclamation se recueille sans discussion, se note, et se transmet le jour même à [NOM OU FONCTION].",
     "",
     "Un geste commercial ne s'accorde qu'avec l'accord de [NOM OU FONCTION].",
     "",
     "Face à un client agressif : ne pas répondre sur le même ton, s'écarter, appeler un responsable. Personne n'a à supporter d'insulte ni de menace.",
     "",
     "Tout incident sérieux se signale par écrit le jour même : il ouvre, s'il y a lieu, la protection de l'entreprise et une déclaration."],
    { adjonction: true });

  a("dis", "dis-vol", "Disparition de matériel et de marchandises",
    "Procédure en cas de disparition de matériel ou de marchandise",
    ["Des disparitions ont été constatées [PRÉCISER SI NÉCESSAIRE]. La procédure suivante s'applique.",
     "",
     "Toute disparition constatée se signale immédiatement à [NOM OU FONCTION], par écrit, avec la date, le lieu et la nature de ce qui manque.",
     "",
     "Les inventaires sont effectués [PÉRIODICITÉ] par [NOM OU FONCTION] et contresignés.",
     "",
     "Aucune marchandise, aucun matériel, aucun document ne sort de l'établissement sans l'accord écrit d'un responsable.",
     "",
     "Ces mesures ne visent personne en particulier : elles protègent l'entreprise et, tout autant, les salariés d'un soupçon injustifié.",
     "",
     "Un fait établi est traité dans le respect de la procédure disciplinaire, après entretien et examen des explications du salarié."],
    { adjonction: true });

  /* ══════════════════════════════════════════════════════════════════════
     MATÉRIEL, VÉHICULES ET LOCAUX
     ══════════════════════════════════════════════════════════════════════ */

  a("mat", "mat-remise", "Remise et restitution du matériel",
    "Matériel confié aux salariés",
    ["Le matériel confié reste la propriété de l'entreprise et sert exclusivement à l'activité professionnelle.",
     "",
     "Chaque remise fait l'objet d'un état écrit, signé des deux parties, mentionnant la nature, le numéro de série et l'état du matériel.",
     "",
     "Le matériel confié à ce jour comprend notamment : [LISTE].",
     "",
     "Le salarié en prend soin, l'utilise conformément à sa destination et signale toute anomalie à [NOM OU FONCTION].",
     "",
     "Il est restitué à la demande de l'entreprise et, en tout état de cause, au départ du salarié, dans l'état d'usage normal.",
     "",
     "Une perte ou une dégradation se signale le jour même : c'est le silence, non l'incident, qui pose problème."],
    { adjonction: true });

  a("mat", "mat-vehicule", "Usage du véhicule de service",
    "Règles d'usage des véhicules de service",
    ["Les véhicules de service sont affectés à l'activité professionnelle et confiés dans les conditions suivantes.",
     "",
     "Le conducteur détient un permis en cours de validité et en présente la copie à l'entreprise ; il signale sans délai toute suspension ou annulation.",
     "",
     "L'usage privé du véhicule [EST AUTORISÉ DANS LES CONDITIONS SUIVANTES / N'EST PAS AUTORISÉ] : [PRÉCISER].",
     "",
     "Avant chaque prise de service : contrôle visuel des pneumatiques, des feux, des niveaux et de la propreté. Toute anomalie se signale avant de partir.",
     "",
     "Les documents du véhicule, carte grise, attestation d'assurance et constat amiable, restent à bord.",
     "",
     "Les amendes pour infraction au code de la route restent à la charge du conducteur, et la désignation du conducteur est faite par l'entreprise comme la loi l'y oblige.",
     "",
     "Le véhicule est rendu propre, avec le carburant prévu, à [LIEU]."],
    { adjonction: true });

  a("mat", "mat-sinistre", "Déclaration des dommages et sinistres",
    "Déclarer un dommage ou un sinistre",
    ["Tout dommage causé ou subi se déclare, même minime, même sans tiers.",
     "",
     "La déclaration se fait le jour même auprès de [NOM OU FONCTION], par écrit, avec les circonstances, l'heure, le lieu, les témoins et des photographies si c'est possible.",
     "",
     "En cas d'accident avec un tiers, le constat amiable est rempli sur place, signé, et remis dans les vingt-quatre heures.",
     "",
     "Aucune réparation n'est engagée sans l'accord de [NOM OU FONCTION] : l'assureur doit pouvoir constater.",
     "",
     "Une déclaration tardive peut faire perdre à l'entreprise le bénéfice de sa garantie : c'est la raison du délai.",
     "",
     "La déclaration d'un incident n'emporte par elle-même aucune sanction."],
    { adjonction: true });

  a("mat", "mat-entretien", "Entretien courant et signalement des pannes",
    "Entretien du matériel et signalement des pannes",
    ["L'entretien courant fait partie du travail : il se fait au poste, chaque jour.",
     "",
     "Chaque utilisateur nettoie et range le matériel qu'il a employé avant la fin de son service.",
     "",
     "Les entretiens périodiques et les contrôles réglementaires sont suivis par [NOM OU FONCTION] ; le registre est tenu à [LIEU].",
     "",
     "Une panne, un bruit anormal, un jeu, une fuite, une protection manquante se signalent immédiatement à [NOM OU FONCTION].",
     "",
     "Un matériel dont la sécurité est en cause est mis hors service, étiqueté, et n'est pas réutilisé avant remise en état : nul ne le contourne.",
     "",
     "Aucune intervention sur une machine n'est faite par un salarié qui n'y est pas habilité."],
    { adjonction: true, urgence: true });

  a("mat", "mat-proprete", "Propreté et rangement des locaux",
    "Propreté et rangement",
    ["La propreté des locaux relève de tous, pas seulement de qui nettoie.",
     "",
     "Chaque poste est laissé propre et rangé en fin de service.",
     "",
     "Les déchets sont évacués dans les contenants prévus, au fur et à mesure.",
     "",
     "Les vestiaires et le local de pause sont entretenus par ceux qui les utilisent.",
     "",
     "Les produits d'entretien restent dans leur emballage d'origine, à [LIEU], et ne se mélangent jamais entre eux.",
     "",
     "Un manque de fourniture se signale à [NOM OU FONCTION] avant la rupture."]);

  /* ══════════════════════════════════════════════════════════════════════
     INFORMATIQUE ET DONNÉES
     ══════════════════════════════════════════════════════════════════════ */

  a("num", "num-charte", "Usage des outils informatiques",
    "Règles d'usage des outils informatiques",
    ["Les outils informatiques de l'entreprise, postes, téléphones, tablettes et logiciels, sont fournis pour l'activité professionnelle.",
     "",
     "Un usage personnel raisonnable est toléré, à condition qu'il reste occasionnel, qu'il ne perturbe pas le travail et qu'il n'engage pas l'entreprise.",
     "",
     "Aucun logiciel n'est installé sans l'accord de [NOM OU FONCTION].",
     "",
     "Aucune clé USB ni disque externe d'origine inconnue n'est branché sur un poste de l'entreprise.",
     "",
     "Un message suspect, une demande de virement inhabituelle, une pièce jointe inattendue : ne pas ouvrir, ne pas répondre, prévenir [NOM OU FONCTION].",
     "",
     "Les fichiers professionnels se rangent dans [EMPLACEMENT] et non sur le bureau du poste : c'est ce qui permet la sauvegarde.",
     "",
     "Le poste est verrouillé dès qu'on le quitte."],
    { adjonction: true });

  a("num", "num-motsdepasse", "Mots de passe et accès",
    "Mots de passe et droits d'accès",
    ["Les accès aux outils de l'entreprise sont personnels et ne se partagent pas.",
     "",
     "Chaque salarié dispose de son propre identifiant : travailler sous celui d'un collègue n'est pas autorisé, même avec son accord.",
     "",
     "Les mots de passe ne s'écrivent pas sur un papier laissé à la vue, ne se communiquent ni par message ni par téléphone, et se changent tous les [PÉRIODICITÉ].",
     "",
     "Un mot de passe que l'on pense compromis se change immédiatement et se signale à [NOM OU FONCTION].",
     "",
     "Les droits d'accès sont retirés au départ du salarié ou au changement de poste.",
     "",
     "Aucune demande de mot de passe ne vous sera jamais adressée par message : une telle demande est une tentative de fraude."],
    { adjonction: true });

  a("num", "num-messagerie", "Messagerie professionnelle",
    "Usage de la messagerie professionnelle",
    ["La messagerie professionnelle engage l'entreprise : ce qui en part est écrit en son nom.",
     "",
     "Les échanges professionnels passent par l'adresse de l'entreprise, non par une adresse personnelle.",
     "",
     "Les messages sont relevés au moins [PÉRIODICITÉ] pendant le temps de travail.",
     "",
     "En cas d'absence, un message d'absence est activé, avec le nom de la personne à contacter.",
     "",
     "Un message marqué personnel est présumé privé : il ne sera pas ouvert par l'entreprise.",
     "",
     "Aucun fichier contenant des données de clients ou de salariés n'est transféré vers une adresse personnelle ou un service extérieur."],
    { adjonction: true });

  a("num", "num-donnees", "Données personnelles des clients et des salariés",
    "Protection des données personnelles",
    ["Les données personnelles que l'entreprise détient, sur ses clients comme sur ses salariés, ne se consultent que pour le besoin du travail.",
     "",
     "Chacun n'accède qu'aux données nécessaires à son poste et ne les communique à personne d'autre.",
     "",
     "Aucune donnée n'est copiée sur un support personnel, ni envoyée à une adresse privée.",
     "",
     "Les documents papier comportant des données personnelles se rangent sous clé à [LIEU] et se détruisent au broyeur.",
     "",
     "Toute perte, vol ou divulgation, même par erreur, se signale immédiatement à [NOM OU FONCTION] : l'entreprise peut avoir à en informer l'autorité de contrôle dans un délai très court.",
     "",
     "Une demande d'accès ou de suppression émanant d'une personne se transmet sans réponse improvisée à [NOM OU FONCTION]."],
    { adjonction: true });

  a("num", "num-reseaux", "Réseaux sociaux",
    "Réseaux sociaux et expression publique",
    ["Chacun est libre de s'exprimer ; cette note ne porte que sur ce qui touche à l'entreprise.",
     "",
     "Aucune photographie prise dans les locaux, aucun document interne, aucun nom de client ne se publie sans l'accord de [NOM OU FONCTION].",
     "",
     "L'image d'un collègue ne se diffuse pas sans son accord.",
     "",
     "Ce qui est publié sous son nom n'engage que son auteur ; le faire sous l'apparence de l'entreprise n'est pas autorisé.",
     "",
     "Les comptes officiels de l'entreprise sont tenus par [NOM OU FONCTION] et par lui seul.",
     "",
     "Un avis en ligne mettant en cause l'entreprise se signale à [NOM OU FONCTION] : n'y répondez pas à titre personnel."],
    { adjonction: true });

  /* ══════════════════════════════════════════════════════════════════════
     RÉMUNÉRATION ET FRAIS
     ══════════════════════════════════════════════════════════════════════ */

  a("pay", "pay-bulletins", "Remise des bulletins de paie",
    "Remise des bulletins de paie",
    ["Les bulletins de paie sont remis [MODALITÉ : en main propre, par voie électronique] le [JOUR] de chaque mois.",
     "",
     "Le salaire est viré le [JOUR] du mois.",
     "",
     "Le bulletin remis sous forme électronique est déposé sur [OUTIL] et reste accessible ; le salarié peut s'opposer à cette forme de remise à tout moment, par écrit.",
     "",
     "Une erreur constatée se signale à [NOM OU FONCTION] dans les meilleurs délais : elle est vérifiée et régularisée sur la paie suivante.",
     "",
     "Conservez vos bulletins sans limitation de durée : ils servent à faire valoir vos droits, notamment à la retraite.",
     "",
     "Une question sur une ligne du bulletin se pose à [NOM OU FONCTION], qui l'explique."]);

  a("pay", "pay-frais", "Frais professionnels",
    "Remboursement des frais professionnels",
    ["Les frais engagés pour le compte de l'entreprise sont remboursés dans les conditions suivantes.",
     "",
     "Tout frais est autorisé au préalable par [NOM OU FONCTION] dès qu'il dépasse [MONTANT] euros.",
     "",
     "La note de frais est remise avant le [JOUR] du mois, accompagnée des justificatifs originaux, sur [FORMULAIRE OU OUTIL].",
     "",
     "Les barèmes applicables sont : repas [MONTANT], nuitée [MONTANT], kilomètre [BARÈME].",
     "",
     "Un frais sans justificatif n'est pas remboursé : c'est une exigence de l'administration, non une défiance.",
     "",
     "Le remboursement intervient avec la paie du mois suivant la remise."]);

  a("pay", "pay-acompte", "Acomptes",
    "Demande d'acompte sur salaire",
    ["Un acompte correspond au travail déjà effectué dans le mois en cours.",
     "",
     "La demande se fait par écrit auprès de [NOM OU FONCTION], au plus tard le [JOUR] du mois.",
     "",
     "Son montant ne peut dépasser [MONTANT OU PROPORTION] du salaire déjà acquis.",
     "",
     "Il est versé par [MOYEN] sous [DÉLAI], et déduit du salaire du mois.",
     "",
     "L'acompte figure sur le bulletin de paie.",
     "",
     "Une difficulté financière durable peut être signalée à [NOM OU FONCTION] : d'autres dispositifs existent parfois."]);

  a("pay", "pay-prime", "Conditions d'attribution d'une prime",
    "Prime de [INTITULÉ] : conditions d'attribution",
    ["Une prime de [INTITULÉ] est mise en place à compter du [DATE].",
     "",
     "Elle concerne [SALARIÉS CONCERNÉS].",
     "",
     "Son montant est de [MONTANT], versé [PÉRIODICITÉ].",
     "",
     "Elle est attribuée lorsque les conditions suivantes sont réunies : [CONDITIONS PRÉCISES ET VÉRIFIABLES].",
     "",
     "Les éléments de calcul sont communiqués à chaque salarié concerné en même temps que la prime.",
     "",
     "[Cette prime est mise en place pour l'année [ANNÉE] et fera l'objet d'un réexamen au terme de cette période.]"]);

  /* ══════════════════════════════════════════════════════════════════════
     PERSONNEL ET REPRÉSENTATION
     ══════════════════════════════════════════════════════════════════════ */

  a("rep", "rep-affichage", "Affichages et panneaux",
    "Affichages obligatoires et panneaux d'information",
    ["Les informations que l'entreprise doit porter à la connaissance de tous sont affichées aux emplacements suivants : [LIEUX].",
     "",
     "Y figurent notamment les horaires de travail, les consignes de sécurité et d'incendie, les coordonnées de l'inspection du travail, du médecin du travail et des services de secours, les textes sur l'égalité et contre le harcèlement, et le règlement intérieur.",
     "",
     "Le panneau réservé aux représentants du personnel se trouve à [LIEU] : il leur appartient, et l'entreprise n'y touche pas.",
     "",
     "Aucun affichage personnel ou commercial n'est apposé sur les panneaux de l'entreprise sans l'accord de [NOM OU FONCTION].",
     "",
     "Un affichage déchiré, illisible ou périmé se signale à [NOM OU FONCTION]."]);

  a("rep", "rep-cse", "Comité social et économique : information",
    "Comité social et économique",
    ["Les représentants du personnel élus au comité social et économique sont : [NOMS, COLLÈGES ET SUPPLÉANTS].",
     "",
     "Leur mandat court jusqu'au [DATE].",
     "",
     "Ils peuvent être saisis par tout salarié de toute question relative aux conditions de travail, à la santé, à la sécurité ou à l'application du droit du travail dans l'entreprise.",
     "",
     "Les réunions ordinaires se tiennent [PÉRIODICITÉ]. Les procès-verbaux sont affichés sur le panneau de [LIEU].",
     "",
     "Le registre des questions et des réponses de l'employeur est consultable à [LIEU].",
     "",
     "Les heures de délégation sont du temps de travail : elles se prennent librement et se paient à l'échéance normale."]);

  a("rep", "rep-entretien", "Entretiens professionnels",
    "Campagne d'entretiens professionnels",
    ["Les entretiens professionnels de [ANNÉE] se tiendront du [DATE] au [DATE].",
     "",
     "L'entretien professionnel porte sur les perspectives d'évolution, les besoins de formation et le parcours du salarié. Il ne porte pas sur l'évaluation du travail.",
     "",
     "Chaque salarié est convoqué par écrit au moins [DÉLAI] à l'avance, avec le document préparatoire.",
     "",
     "L'entretien se tient sur le temps de travail, dans un lieu permettant la confidentialité.",
     "",
     "Un compte rendu écrit est établi et remis au salarié, qui peut y porter ses observations.",
     "",
     "Un salarié qui souhaite avancer la date de son entretien peut le demander à [NOM OU FONCTION]."]);

  a("rep", "rep-formation", "Plan de formation de l'année",
    "Formations prévues pour [ANNÉE]",
    ["Les formations retenues pour l'année [ANNÉE] sont les suivantes : [LISTE : INTITULÉ, SALARIÉS CONCERNÉS, DATES].",
     "",
     "Elles se déroulent sur le temps de travail et sont rémunérées comme tel.",
     "",
     "Les frais de déplacement et de repas sont pris en charge selon les règles applicables aux frais professionnels.",
     "",
     "Les formations obligatoires liées à la sécurité du poste ne se refusent pas : elles font partie du travail.",
     "",
     "Un salarié souhaitant une formation qui ne figure pas dans cette liste peut la demander par écrit à [NOM OU FONCTION] avant le [DATE].",
     "",
     "Les attestations sont remises à chaque participant et une copie est conservée dans son dossier."]);

  a("rep", "rep-accueil", "Accueil d'un nouveau salarié",
    "Accueil et intégration des nouveaux salariés",
    ["L'accueil d'un nouveau salarié obéit au parcours suivant, qui vaut pour les embauches, les intérimaires et les stagiaires.",
     "",
     "Le jour de l'arrivée : présentation de l'équipe, visite des locaux, remise de la tenue et du matériel, et remise des consignes de sécurité du poste.",
     "",
     "La formation à la sécurité au poste est assurée par [NOM OU FONCTION] avant toute mise au travail effective.",
     "",
     "Un tuteur est désigné pour les [DURÉE] premiers jours : [NOM OU FONCTION DÉSIGNÉ PAR SERVICE].",
     "",
     "Les documents remis sont : contrat, règlement intérieur, notice de prévoyance et de frais de santé, consignes de sécurité.",
     "",
     "Un point est fait avec le nouveau salarié au bout de [DÉLAI], pour vérifier que tout est en place."],
    { adjonction: true });

  /* ══════════════════════════════════════════════════════════════════════
     ENVIRONNEMENT ET ÉNERGIE
     ══════════════════════════════════════════════════════════════════════ */

  a("env", "env-dechets", "Tri et évacuation des déchets",
    "Tri des déchets",
    ["Le tri des déchets s'organise comme suit à compter du [DATE].",
     "",
     "Les contenants se trouvent à [LIEUX] : [COULEUR OU ÉTIQUETTE] pour [TYPE DE DÉCHET], [COULEUR OU ÉTIQUETTE] pour [TYPE DE DÉCHET].",
     "",
     "Les cartons sont pliés avant d'être déposés.",
     "",
     "L'évacuation est assurée [PÉRIODICITÉ] par [PRESTATAIRE OU SERVICE].",
     "",
     "Rien n'est déposé au sol à côté d'un contenant plein : prévenir [NOM OU FONCTION], qui fait enlever.",
     "",
     "Le local à déchets est tenu propre et sa porte reste fermée."]);

  a("env", "env-dangereux", "Déchets dangereux et produits usagés",
    "Déchets dangereux : collecte et traçabilité",
    ["Certains déchets ne se jettent ni au tout-venant, ni à l'évier : huiles, solvants, batteries, piles, néons, cartouches, aérosols, chiffons souillés.",
     "",
     "Ils se déposent exclusivement dans les contenants prévus à [LIEU], fermés et étiquetés.",
     "",
     "Les contenants ne se mélangent jamais entre eux.",
     "",
     "L'enlèvement est assuré par [PRESTATAIRE] ; le bordereau de suivi est conservé par [NOM OU FONCTION] à [LIEU].",
     "",
     "Un déversement accidentel se contient avec le kit absorbant situé à [LIEU], puis se signale immédiatement.",
     "",
     "Les fiches de données de sécurité des produits sont consultables à [LIEU]."],
    { adjonction: true, urgence: true });

  a("env", "env-energie", "Économies d'énergie",
    "Consommations d'énergie : gestes à tenir",
    ["Les consommations d'énergie de l'établissement ont [ÉVOLUÉ DE : PRÉCISER]. Les gestes suivants sont demandés à tous.",
     "",
     "Éclairage éteint dans toute pièce inoccupée, et en fin de service.",
     "",
     "Chauffage réglé à [TEMPÉRATURE] dans les locaux de travail, fenêtres fermées lorsqu'il fonctionne.",
     "",
     "Appareils et écrans éteints, non en veille, à la fermeture.",
     "",
     "Portes des chambres froides et des vitrines réfrigérées refermées immédiatement.",
     "",
     "Une fuite d'eau, un joint défectueux, un appareil qui tourne en permanence se signalent à [NOM OU FONCTION]."]);

  /* ══════════════════════════════════════════════════════════════════════ */

  function ajouter(modele) {
    if (!modele || !modele.id) return;
    for (var i = 0; i < M.length; i++) if (M[i].id === modele.id) { M[i] = modele; return; }
    M.push(modele);
  }
  function ajouterTheme(theme) {
    if (!theme || !theme.cle) return;
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].cle === theme.cle) { THEMES[i] = theme; return; }
    THEMES.push(theme);
  }

  window.NotesService = {
    THEMES: THEMES, MODELES: M, ajouter: ajouter, ajouterTheme: ajouterTheme,
  };
})(window);
