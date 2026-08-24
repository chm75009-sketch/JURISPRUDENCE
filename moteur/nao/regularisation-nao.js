/* Ce qu'il faut faire quand un contrôle de la négociation obligatoire ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger (l'assujettissement, l'exposition aux
   sanctions), et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, chiffré et fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-nao.json, et publier-nao.js confronte les deux. */

const { C } = require("./controles-nao.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

const R = {

  /* Le contrôle constate un régime, il ne relève aucun manquement : rien à
     régulariser, et c'est écrit. */
  "NAO-CTL-REG-01": null,

  "NAO-CTL-REG-02": {
    gravite: 3,
    quoiFaire: "Établir le calendrier qui s'impose : soit conclure l'accord de méthode de L. 2242-11, soit constater que le régime supplétif annuel et triennal de L. 2242-13 s'applique.",
    risque: "Sans calendrier identifié, aucun retard ne se mesure — et l'employeur ne peut opposer aucune périodicité aménagée à une organisation syndicale qui demande l'ouverture d'une négociation.",
    delai: "Une réunion pour constater le régime ; trois à six mois si un accord de méthode est négocié.",
    document: "Accord de méthode sur la périodicité des négociations obligatoires (L. 2242-11)",
    etapes: [
      "Rechercher un accord de méthode en vigueur : l'accord de L. 2242-11 fixe la périodicité, les thèmes, le calendrier et le contenu des négociations.",
      "S'il existe, vérifier qu'il respecte les bornes de L. 2242-12 — la périodicité d'un thème ne peut excéder quatre ans — et que ses stipulations sont respectées : leur non-respect fait retomber l'entreprise dans le régime supplétif (L. 2242-13).",
      "S'il n'existe pas, ou s'il n'est pas respecté, appliquer L. 2242-13 : négociation annuelle sur la rémunération, négociation annuelle sur l'égalité professionnelle, et à partir de trois cents salariés, négociation triennale sur la gestion des emplois et négociation triennale sur les salariés expérimentés.",
      "Consigner le régime retenu par écrit, avec sa source, et le porter au dossier : c'est lui qui datera tous les retards.",
    ],
    verifs: [
      { cle: "regimeSource", question: "Sur quoi repose le calendrier que vous appliquez — un accord de méthode, ou le régime supplétif ?", attendu: "L'accord daté et déposé, ou la mention expresse du régime supplétif de L. 2242-13." },
      { cle: "regimeBornes", question: "Si un accord de méthode existe, aucune périodicité qu'il fixe ne dépasse-t-elle quatre ans ?", attendu: "L. 2242-12 plafonne à quatre ans ; au-delà, la stipulation ne tient pas." },
    ],
  },

  "NAO-CTL-PER-01": {
    gravite: 1,
    quoiFaire: "Engager la négociation sur la rémunération, le temps de travail et le partage de la valeur ajoutée.",
    risque: "Un an d'emprisonnement et 3 750 € d'amende (L. 2243-1). La pénalité de L. 2242-7 s'y ajoute : jusqu'à 10 % des exonérations de cotisations pour les périodes non couvertes.",
    delai: "Compter deux à trois mois entre la convocation et le procès-verbal.",
    document: "Convocation des organisations syndicales représentatives à la négociation annuelle",
    etapes: [
      "Recenser les organisations syndicales représentatives dans l'entreprise : toutes doivent être convoquées, sans exception.",
      "Les convoquer par écrit, en indiquant l'objet de la négociation, le lieu et la date de la première réunion.",
      "Lors de la première réunion, fixer le lieu et le calendrier des réunions, la liste des informations qui seront remises et la date de leur remise (L. 2242-14). Ce point est distinct : il est contrôlé pour lui-même.",
      "Remettre les informations à la date annoncée, et répondre de manière motivée aux propositions syndicales — c'est la condition de la loyauté (L. 2242-6).",
      "Conclure : accord signé et déposé, ou procès-verbal de désaccord établi et déposé (L. 2242-5, R. 2242-1).",
    ],
    verifs: [
      { cle: "per01Convocation", question: "À quelle date les organisations syndicales représentatives ont-elles été convoquées, et lesquelles ?", attendu: "La date et la liste ; une seule organisation oubliée suffit à vicier la négociation." },
      { cle: "per01Reunions", question: "Combien de réunions se sont tenues, et à quelles dates ?", attendu: "Les dates, avec les feuilles d'émargement ou les convocations." },
      { cle: "per01Issue", question: "Quelle a été l'issue — accord ou procès-verbal de désaccord — et à quelle date a-t-elle été déposée ?", attendu: "Le récépissé de dépôt. Sans dépôt, la négociation n'est pas achevée." },
    ],
  },

  "NAO-CTL-PER-02": {
    gravite: 1,
    quoiFaire: "Engager la négociation sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail.",
    risque: "Un an d'emprisonnement et 3 750 € d'amende (L. 2243-1), et la pénalité de L. 2242-8 — jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes.",
    delai: "Deux à trois mois.",
    document: "Convocation des organisations syndicales représentatives à la négociation sur l'égalité professionnelle",
    etapes: [
      "Convoquer toutes les organisations syndicales représentatives.",
      "Réunir les données de la base de données économiques, sociales et environnementales : L. 2242-17, 2° impose que la négociation s'appuie sur elles.",
      "Couvrir les thèmes énumérés par L. 2242-17, et non seulement les salaires : articulation des temps, suppression des écarts de rémunération, accès à l'emploi et à la formation, promotion, conditions de travail, droit à la déconnexion.",
      "À défaut d'accord, établir le plan d'action annuel de L. 2242-3 et le déposer : c'est ce plan qui couvre l'entreprise au regard de la pénalité.",
      "Déposer l'accord ou le procès-verbal de désaccord.",
    ],
    verifs: [
      { cle: "per02Convocation", question: "À quelle date les organisations syndicales ont-elles été convoquées ?", attendu: "La date et la liste des organisations." },
      { cle: "per02Themes", question: "Quels thèmes de L. 2242-17 la négociation a-t-elle couverts ?", attendu: "La liste ; un thème non abordé se constate sur le procès-verbal." },
      { cle: "per02Couverture", question: "L'entreprise est-elle couverte par un accord, ou par un plan d'action déposé ?", attendu: "L'accord déposé ou le plan d'action déposé — l'un des deux, jamais rien." },
    ],
  },

  "NAO-CTL-PER-03": {
    gravite: 1,
    quoiFaire: "Engager la négociation triennale sur la gestion des emplois et des parcours professionnels.",
    risque: "Un an d'emprisonnement et 3 750 € d'amende (L. 2243-2), l'obligation étant due dans les entreprises d'au moins trois cents salariés (L. 2242-2).",
    delai: "Trois à six mois : la négociation porte sur des engagements pluriannuels.",
    document: "Convocation à la négociation sur la gestion des emplois et des parcours professionnels",
    etapes: [
      "Vérifier le seuil : la négociation est due à partir de trois cents salariés (L. 2242-2), et tous les trois ans (L. 2242-13, 3°).",
      "Convoquer toutes les organisations syndicales représentatives.",
      "Préparer les données d'emploi : pyramide des âges, métiers en tension, projets de mutation technologique — la négociation porte sur la mise en place d'un dispositif de gestion prévisionnelle et sur les mesures d'accompagnement.",
      "Déposer l'accord ou le procès-verbal de désaccord.",
    ],
    verifs: [
      { cle: "per03Seuil", question: "L'entreprise atteint-elle trois cents salariés, et depuis quand ?", attendu: "L'effectif et sa date d'atteinte." },
      { cle: "per03Derniere", question: "À quelle date la précédente négociation triennale a-t-elle été engagée ?", attendu: "La date ; au-delà de trente-six mois, une organisation syndicale peut en imposer l'ouverture." },
      { cle: "per03Issue", question: "Quelle en a été l'issue, et à quelle date a-t-elle été déposée ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-PER-04": {
    gravite: 1,
    quoiFaire: "Engager la négociation triennale sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés.",
    risque: "Même exposition que la négociation sur la gestion des emplois : un an d'emprisonnement et 3 750 € d'amende, la pénalité de L. 2242-7 pouvant s'y ajouter.",
    delai: "Trois à six mois.",
    document: "Convocation à la négociation sur les salariés expérimentés",
    etapes: [
      "Vérifier le seuil de trois cents salariés (L. 2242-2-1) et la périodicité triennale (L. 2242-13, 4°).",
      "Convoquer toutes les organisations syndicales représentatives.",
      "Documenter la situation des salariés expérimentés : effectifs par tranche d'âge, pénibilité des postes, accès à la formation, aménagements de fin de carrière.",
      "Déposer l'accord ou le procès-verbal de désaccord.",
    ],
    verifs: [
      { cle: "per04Seuil", question: "L'entreprise atteint-elle trois cents salariés ?", attendu: "L'effectif." },
      { cle: "per04Derniere", question: "À quelle date la précédente négociation a-t-elle été engagée ?", attendu: "La date." },
      { cle: "per04Issue", question: "Quelle en a été l'issue, et quand a-t-elle été déposée ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-DEM-01": {
    gravite: 1,
    quoiFaire: "Traiter la demande syndicale d'ouverture dans les deux délais qu'impose le dernier alinéa de L. 2242-13 : transmission aux autres organisations sous huit jours, convocation des parties sous quinze.",
    risque: "Se soustraire à la convocation des parties est puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1). Les deux délais sont courts et se comptent en jours.",
    delai: "Quinze jours, pas un de plus, à compter de la demande.",
    document: "Transmission de la demande syndicale aux autres organisations, et convocation des parties",
    etapes: [
      "Dater la réception de la demande : c'est de cette date que courent les deux délais.",
      "Dans les huit jours, transmettre la demande aux autres organisations syndicales représentatives — toutes, y compris celles qui n'ont pas demandé l'ouverture.",
      "Dans les quinze jours de la demande, convoquer les parties à la négociation, par écrit, en indiquant l'objet, le lieu et la date.",
      "Conserver les preuves d'envoi des deux actes : ce sont elles qui établiront le respect des délais.",
    ],
    verifs: [
      { cle: "dem01Recue", question: "À quelle date la demande syndicale a-t-elle été reçue ?", attendu: "La date, avec le courrier ou le courriel." },
      { cle: "dem01Transmise", question: "À quelle date a-t-elle été transmise aux autres organisations, et à quelles organisations ?", attendu: "La date — au plus huit jours après la demande — et la liste." },
      { cle: "dem01Convocation", question: "À quelle date les parties ont-elles été convoquées ?", attendu: "La date — au plus quinze jours après la demande — et la preuve d'envoi." },
    ],
  },

  "NAO-CTL-LOY-01": {
    gravite: 3,
    quoiFaire: "Faire figurer au procès-verbal de la première réunion les quatre mentions de L. 2242-14 : le lieu, le calendrier, les informations que l'employeur remettra, et la date de cette remise.",
    risque: "Sans ces mentions, la loyauté de la négociation n'est pas établie : un accord sur les salaires effectifs ne peut alors pas être valablement déposé (L. 2242-6), et le juge peut annuler une décision unilatérale prise dans le champ négocié.",
    delai: "Une réunion. La régularisation tient en un procès-verbal.",
    document: "Procès-verbal de première réunion — lieu, calendrier, informations et date de remise",
    etapes: [
      "Reprendre le procès-verbal de la première réunion et vérifier qu'il porte les quatre mentions.",
      "S'il en manque une, convoquer une réunion de cadrage et l'y arrêter avec les organisations syndicales : le calendrier et la liste des informations se fixent contradictoirement.",
      "Notifier le procès-verbal à toutes les organisations convoquées.",
      "Remettre les informations à la date annoncée : une date annoncée et non tenue vaut manquement à la loyauté.",
    ],
    verifs: [
      { cle: "loy01Lieu", question: "Le procès-verbal de première réunion précise-t-il le lieu et le calendrier des réunions ?", attendu: "Le procès-verbal lui-même, avec ces mentions." },
      { cle: "loy01Infos", question: "Précise-t-il la liste des informations remises et la date de leur remise ?", attendu: "La liste et la date." },
      { cle: "loy01Remise", question: "Les informations ont-elles été remises à la date annoncée ?", attendu: "La preuve de remise, datée." },
    ],
  },

  "NAO-CTL-LOY-02": {
    gravite: 3,
    quoiFaire: "Réunir les conditions de dépôt d'un accord sur les salaires effectifs : le procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes, et les réponses motivées aux propositions syndicales.",
    risque: "L'accord sur les salaires effectifs ne peut pas être déposé sans ce procès-verbal (L. 2242-6). Sans dépôt, il n'est pas opposable, et la période n'est pas couverte au regard des pénalités.",
    delai: "Deux semaines si les négociations ont eu lieu ; sinon, il faut les rouvrir.",
    document: "Procès-verbal d'ouverture des négociations sur les écarts de rémunération femmes-hommes",
    etapes: [
      "Établir le procès-verbal d'ouverture : il consigne les propositions respectives des parties et atteste que l'employeur a engagé sérieusement et loyalement les négociations.",
      "Vérifier les quatre éléments que L. 2242-6 exige de cet engagement : toutes les organisations représentatives convoquées, lieu et calendrier fixés, informations nécessaires communiquées, réponses motivées apportées aux propositions syndicales.",
      "Reprendre chaque proposition syndicale restée sans réponse et y répondre par écrit, en motivant : un refus non motivé est un manquement à la loyauté.",
      "Déposer l'accord accompagné du procès-verbal, dans les conditions de L. 2231-6.",
    ],
    verifs: [
      { cle: "loy02Pv", question: "Le procès-verbal d'ouverture des négociations sur les écarts de rémunération existe-t-il, et que consigne-t-il ?", attendu: "Le procès-verbal, portant les propositions respectives des parties." },
      { cle: "loy02Reponses", question: "Chaque proposition syndicale a-t-elle reçu une réponse écrite et motivée ?", attendu: "Les réponses, datées. Un silence se constate." },
      { cle: "loy02Depot", question: "L'accord sur les salaires effectifs a-t-il été déposé, accompagné de ce procès-verbal ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-UNI-01": {
    gravite: 2,
    quoiFaire: "Retirer, ou suspendre, toute décision unilatérale prise dans une matière en cours de négociation, tant que la négociation n'est pas achevée.",
    risque: "L. 2242-4 interdit à l'employeur de prendre des décisions unilatérales dans les matières traitées tant que la négociation est en cours, sauf urgence. La décision est annulable, et le manquement nourrit l'entrave.",
    delai: "Immédiat : c'est la décision elle-même qu'il faut reprendre.",
    document: "Note de retrait de la décision unilatérale et information des organisations syndicales",
    etapes: [
      "Identifier les décisions prises depuis l'ouverture de la négociation qui touchent à l'une des matières négociées.",
      "Pour chacune, vérifier si l'urgence était caractérisée : c'est la seule réserve que L. 2242-4 admet, et elle se démontre, elle ne se déclare pas.",
      "Retirer ou suspendre celles qui ne le sont pas, et en informer les organisations syndicales par écrit.",
      "Rouvrir le point en négociation, et faire figurer au procès-verbal que la décision a été retirée.",
    ],
    verifs: [
      { cle: "uni01Decisions", question: "Quelles décisions unilatérales ont été prises depuis l'ouverture de la négociation, et dans quelles matières ?", attendu: "La liste, datée." },
      { cle: "uni01Urgence", question: "Pour celles qui touchent aux matières négociées, l'urgence est-elle établie, et par quoi ?", attendu: "Les éléments de fait. Une affirmation d'urgence ne suffit pas." },
    ],
  },

  "NAO-CTL-ISS-01": {
    gravite: 2,
    quoiFaire: "Clore chaque négociation achevée par un accord déposé, ou par un procès-verbal de désaccord déposé.",
    risque: "Aucun texte n'oblige à conclure — mais l'absence de toute issue formalisée laisse la période non couverte, et expose aux pénalités de L. 2242-7 et L. 2242-8. Le procès-verbal de désaccord doit être déposé (L. 2242-5, R. 2242-1), à défaut de quoi il ne produit aucun effet.",
    delai: "Quinze jours après la dernière réunion.",
    document: "Procès-verbal de désaccord — propositions en leur dernier état et mesures unilatérales",
    etapes: [
      "Pour chaque négociation achevée sans accord, établir le procès-verbal de désaccord.",
      "Y consigner, en leur dernier état, les propositions respectives des parties — et non un simple constat d'échec.",
      "Y consigner les mesures que l'employeur entend appliquer unilatéralement : L. 2242-5 l'exige, et c'est ce qui fonde ensuite leur opposabilité.",
      "Le déposer dans les conditions de D. 2231-2, à l'initiative de la partie la plus diligente — l'employeur ne peut pas attendre que les syndicats s'en chargent.",
      "Conserver le récépissé : c'est lui, et non le procès-verbal, qui prouve le dépôt.",
    ],
    verifs: [
      { cle: "iss01Liste", question: "Pour chaque négociation achevée, quelle en a été l'issue — accord ou procès-verbal de désaccord ?", attendu: "L'issue, négociation par négociation." },
      { cle: "iss01Contenu", question: "Le procès-verbal de désaccord consigne-t-il les propositions en leur dernier état et les mesures unilatérales de l'employeur ?", attendu: "Les deux mentions. Un procès-verbal qui ne les porte pas est incomplet au sens de L. 2242-5." },
      { cle: "iss01Depot", question: "À quelle date le dépôt a-t-il été effectué, et où est le récépissé ?", attendu: "La date et le récépissé." },
    ],
  },

  "NAO-CTL-EGA-01": {
    gravite: 2,
    quoiFaire: "À défaut d'accord sur l'égalité professionnelle, établir le plan d'action annuel de L. 2242-3, et le déposer auprès de l'autorité administrative.",
    risque: "Sans accord ni plan d'action déposé, l'entreprise d'au moins cinquante salariés encourt la pénalité de L. 2242-8 : jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes.",
    delai: "Un mois : l'évaluation de l'année écoulée en est le préalable.",
    document: "Plan d'action annuel pour l'égalité professionnelle entre les femmes et les hommes",
    etapes: [
      "Évaluer les objectifs fixés et les mesures prises au cours de l'année écoulée : L. 2242-3 en fait le préalable exprès du plan.",
      "Fixer les objectifs de progression de l'année à venir, sur des critères clairs, précis et opérationnels.",
      "Définir les actions qualitatives et quantitatives qui permettent de les atteindre.",
      "Évaluer le coût de chacune : le texte l'exige, et un plan sans chiffrage est incomplet.",
      "Déposer le plan auprès de l'autorité administrative, et conserver le récépissé.",
    ],
    verifs: [
      { cle: "ega01Bilan", question: "Le plan évalue-t-il les objectifs et les mesures de l'année écoulée ?", attendu: "La partie « bilan » du plan." },
      { cle: "ega01Objectifs", question: "Fixe-t-il des objectifs de progression chiffrés pour l'année à venir ?", attendu: "Les objectifs, avec leurs indicateurs." },
      { cle: "ega01Cout", question: "Chaque action est-elle chiffrée ?", attendu: "Le coût, action par action." },
      { cle: "ega01Depot", question: "À quelle date le plan a-t-il été déposé ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-EGA-02": {
    gravite: 2,
    quoiFaire: "Couvrir l'entreprise d'au moins cinquante salariés par un accord ou un plan d'action, et publier l'index de l'égalité professionnelle de L. 1142-8.",
    risque: "La pénalité de L. 2242-8 va jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes. Le défaut de publication de l'index l'expose à ce seul titre.",
    delai: "Publication de l'index : au plus tard le 1er mars de chaque année.",
    document: "Publication de l'index de l'égalité professionnelle et déclaration à l'administration",
    etapes: [
      "Vérifier la couverture : un accord d'égalité professionnelle en vigueur, ou un plan d'action déposé. L'un des deux, jamais rien.",
      "Calculer les indicateurs de l'index sur la période de référence retenue.",
      "Publier le résultat de manière visible et lisible sur le site internet de l'entreprise, ou à défaut le porter à la connaissance des salariés par tout moyen.",
      "Le déclarer à l'administration et au comité social et économique.",
      "Si le résultat est inférieur au seuil réglementaire, définir les mesures de correction — leur absence est un manquement distinct.",
    ],
    verifs: [
      { cle: "ega02Couverture", question: "L'entreprise est-elle couverte par un accord ou par un plan d'action, et depuis quelle date ?", attendu: "L'accord ou le plan, daté et déposé." },
      { cle: "ega02Index", question: "L'index a-t-il été publié, à quelle date, et où ?", attendu: "La date et l'adresse de publication, ou le mode de diffusion retenu." },
      { cle: "ega02Correction", question: "Si le résultat est inférieur au seuil, quelles mesures de correction ont été définies ?", attendu: "Les mesures et leur calendrier." },
    ],
  },

  "NAO-CTL-CON-01": {
    gravite: 3,
    quoiFaire: "Couvrir, dans la négociation sur la rémunération, tous les thèmes que L. 2242-15 énumère.",
    risque: "Une négociation qui laisse un thème de côté n'est pas complète : le manquement se constate sur le procès-verbal, et nourrit le grief de négociation déloyale.",
    delai: "Une réunion supplémentaire par thème omis.",
    document: "Ordre du jour de la négociation sur la rémunération — les thèmes de L. 2242-15",
    etapes: [
      "Reprendre le procès-verbal et pointer, thème par thème, ceux que L. 2242-15 énumère : salaires effectifs, durée effective et organisation du temps de travail, intéressement, participation et épargne salariale, suivi de la mise en œuvre des mesures de suppression des écarts de rémunération.",
      "Pour chaque thème omis, inscrire le point à l'ordre du jour d'une réunion complémentaire.",
      "Remettre aux organisations syndicales les informations propres à ce thème, avant la réunion.",
      "Consigner au procès-verbal que le thème a été abordé, et ce qui s'y est dit.",
    ],
    verifs: [
      { cle: "con01Themes", question: "Quels thèmes de L. 2242-15 le procès-verbal montre-t-il abordés ?", attendu: "La liste, pointée sur le procès-verbal." },
      { cle: "con01Ecarts", question: "Le suivi des mesures de suppression des écarts de rémunération a-t-il été abordé ?", attendu: "La mention au procès-verbal ; c'est un thème distinct des salaires effectifs." },
    ],
  },

  "NAO-CTL-CON-02": {
    gravite: 3,
    quoiFaire: "Couvrir, dans la négociation sur l'égalité professionnelle, tous les thèmes que L. 2242-17 énumère.",
    risque: "Même constat que pour la négociation sur la rémunération, avec en outre l'exposition à la pénalité de L. 2242-8 si la période n'est pas valablement couverte.",
    delai: "Une réunion supplémentaire par thème omis.",
    document: "Ordre du jour de la négociation sur l'égalité professionnelle — les thèmes de L. 2242-17",
    etapes: [
      "Pointer sur le procès-verbal les thèmes de L. 2242-17 : articulation entre vie personnelle et vie professionnelle, suppression des écarts de rémunération, accès à l'emploi, à la formation et à la promotion, conditions de travail et d'emploi, insertion et maintien dans l'emploi des travailleurs handicapés, régimes de prévoyance et de complémentaire santé, droit à la déconnexion.",
      "Pour chaque thème omis, l'inscrire à l'ordre du jour d'une réunion complémentaire.",
      "Verser les données correspondantes issues de la base de données économiques, sociales et environnementales.",
      "Consigner au procès-verbal.",
    ],
    verifs: [
      { cle: "con02Themes", question: "Quels thèmes de L. 2242-17 le procès-verbal montre-t-il abordés ?", attendu: "La liste, pointée sur le procès-verbal." },
      { cle: "con02Deconnexion", question: "Le droit à la déconnexion a-t-il été abordé, et avec quelle issue ?", attendu: "La mention au procès-verbal ; à défaut d'accord, la charte de l'employeur." },
    ],
  },

  "NAO-CTL-CON-03": {
    gravite: 4,
    quoiFaire: "Appuyer la négociation sur l'égalité professionnelle sur les données de la base de données économiques, sociales et environnementales, comme L. 2242-17, 2° l'impose.",
    risque: "Une négociation menée sans ces données est contestable dans sa loyauté : les organisations syndicales n'ont pas pu négocier en connaissance de cause au sens de L. 2242-6.",
    delai: "Quelques jours si la base existe ; sinon, c'est la base qu'il faut d'abord constituer.",
    document: "Extraction de la base de données pour la négociation sur l'égalité professionnelle",
    etapes: [
      "Vérifier que la base existe et qu'elle est à jour : si elle ne l'est pas, le module « base de données » traite ce point pour lui-même.",
      "En extraire les données relatives à l'égalité professionnelle : effectifs par sexe et par catégorie, rémunérations comparées, promotions, formation, embauches et départs.",
      "Les remettre aux organisations syndicales avant la réunion, et en consigner la remise au procès-verbal.",
      "Faire figurer au procès-verbal que la négociation s'est appuyée sur ces données.",
    ],
    verifs: [
      { cle: "con03Extraction", question: "Quelles données de la base ont été remises aux organisations syndicales, et à quelle date ?", attendu: "L'extraction et sa date de remise." },
      { cle: "con03Pv", question: "Le procès-verbal mentionne-t-il que la négociation s'est appuyée sur ces données ?", attendu: "La mention au procès-verbal." },
    ],
  },

  /* Ce contrôle mesure l'exposition résultant des autres : il ne se régularise
     pas pour lui-même — on régularise ce qui la cause. */
  "NAO-CTL-PEN-01": null,
};

/* La règle du dépôt : l'oubli se voit. Tout contrôle doit avoir une entrée,
   fût-elle null, et toute entrée doit correspondre à un contrôle. */
const ECARTS = [];
for (const c of C)
  if (!Object.prototype.hasOwnProperty.call(R, c.id))
    ECARTS.push(`le contrôle ${c.id} n'a pas d'entrée de régularisation (fût-ce à null)`);
for (const id of Object.keys(R))
  if (!C.some(c => c.id === id))
    ECARTS.push(`l'entrée de régularisation ${id} ne correspond à aucun contrôle`);
for (const [id, r] of Object.entries(R)) {
  if (r === null) continue;
  for (const champ of ["gravite", "quoiFaire", "risque", "delai", "etapes", "verifs"])
    if (r[champ] === undefined || r[champ] === null || r[champ] === "")
      ECARTS.push(`${id} : le champ « ${champ} » manque`);
  if (!GRAVITES[r.gravite]) ECARTS.push(`${id} : gravité « ${r.gravite} » inconnue`);
  if (Array.isArray(r.etapes) && r.etapes.length < 2)
    ECARTS.push(`${id} : une procédure d'une seule étape n'accompagne personne`);
  if (Array.isArray(r.verifs))
    for (const v of r.verifs)
      if (!v.cle || !v.question || !v.attendu)
        ECARTS.push(`${id} : une vérification est incomplète (clé, question, attendu)`);
}
/* L'unicité des clés de vérification. Deux clés identiques feraient répondre
   une question à la place d'une autre : la réponse de la seconde écraserait
   silencieusement celle de la première, et le verdict porterait sur autre chose
   que ce qui a été demandé. Le garde vient des modules PSE, discipline, BDESE
   et santé-sécurité, où il a été posé avant d'exister ici. */
{
  const vues = new Map();
  for (const [id, r] of Object.entries(R)) {
    if (!r || !Array.isArray(r.verifs)) continue;
    for (const v of r.verifs) {
      if (vues.has(v.cle)) ECARTS.push(`${id} : la clé « ${v.cle} » est déjà employée par ${vues.get(v.cle)}`);
      else vues.set(v.cle, id);
    }
  }
}

module.exports = { R, GRAVITES, ECARTS };

if (require.main === module) {
  const aRegulariser = Object.values(R).filter(x => x !== null).length;
  const verifs = Object.values(R).filter(x => x).reduce((n, x) => n + x.verifs.length, 0);
  console.log(`${C.length} contrôle(s) · ${aRegulariser} régularisation(s) · ${verifs} vérification(s)`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("chaque contrôle a son issue, et chaque issue son contrôle");
}
