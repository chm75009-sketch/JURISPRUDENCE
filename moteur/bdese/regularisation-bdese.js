/* Ce qu'il faut faire quand un contrôle de la base de données ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger, et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé sur un article lu
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   L'ORDRE PROPRE À CE MODULE, et il ne se contourne pas. Régulariser une base
   incomplète, c'est monter la grille due, puis la remplir sur six années. La
   grille due n'est pas la même selon le texte qui commande : celle de l'accord
   s'il en existe un — L. 2312-21 lui laisse définir l'organisation, l'architecture
   et le contenu de la base —, sinon celle du décret, R. 2312-8 en dessous de
   trois cents salariés et R. 2312-9 à partir de trois cents. C'est pourquoi
   chaque procédure de contenu commence par la même étape : chercher l'accord
   AVANT de retenir le supplétif. Monter la grille du décret dans une entreprise
   couverte par un accord, c'est réclamer ce qui n'est pas dû.

   Les tableaux du décret ne sont pas recopiés dans les étapes : ils font
   plusieurs dizaines de milliers de caractères, ils sont découpés depuis leur
   texte par contenu-bdese.js, et une étape qui les résumerait de mémoire
   trahirait le texte. Les étapes renvoient à l'article et décrivent la
   démarche.

   Aucune gravité 1 ni 2 n'est employée : le corpus lu par ce module ne porte ni
   texte pénal ni pénalité financière propres à la base de données. Affirmer une
   sanction sans avoir lu l'article qui la fonde serait exactement ce que le
   dépôt s'interdit. Ce qui est encouru et qui a été lu, c'est l'irrégularité
   opposable — degré 3.

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-bdese.json, et publier-bdese.js confronte les deux. */

const { C } = require("./controles-bdese.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

const R = {

  "BDESE-CTL-REG-01": {
    gravite: 3,
    quoiFaire: "Établir par écrit le texte qui commande le contenu de la base : l'accord d'entreprise de L. 2312-21, à défaut l'accord de branche dans les entreprises de moins de trois cents salariés, à défaut le contenu supplétif du décret.",
    risque: "Tant que ce texte n'est pas identifié, la grille due est inconnue : l'entreprise monte une base au hasard, et ne peut établir devant le comité qu'elle porte ce qui lui est dû. L'article L. 2312-21 laisse l'accord définir l'organisation, l'architecture et le contenu de la base ; le décret ne s'applique qu'en son absence. Les deux grilles ne se recouvrent pas, et l'erreur de texte se paie en rubriques manquantes.",
    delai: "Une à deux semaines : c'est une recherche dans les accords en vigueur, pas une négociation.",
    document: "Note de régime — le texte applicable à la base et la pièce qui l'établit",
    etapes: [
      "Rechercher un accord d'entreprise définissant la base : L. 2312-21 n'en connaît que deux formes — l'accord conclu dans les conditions du premier alinéa de L. 2232-12, ou, en l'absence de délégué syndical, l'accord entre l'employeur et le comité social et économique adopté à la majorité des membres titulaires de la délégation du personnel.",
      "S'il en existe un, le verser en entier au dossier : c'est son texte, et non son résumé, qui fixe la grille à monter.",
      "À défaut d'accord d'entreprise, rechercher un accord de branche : le dernier alinéa de L. 2312-21 ne l'ouvre qu'aux entreprises de moins de trois cents salariés.",
      "À défaut des deux, retenir le contenu supplétif du décret, l'article dépendant de l'effectif : R. 2312-8 en dessous de trois cents salariés, R. 2312-9 à partir de trois cents.",
      "Consigner le régime retenu, sa date et la pièce qui le porte : aucun contrôle de contenu ne conclut avant lui, et tout le reste de la régularisation s'y adosse.",
    ],
    verifs: [
      { cle: "regimeTexte", question: "Quel texte commande le contenu de votre base — un accord d'entreprise, un accord de branche, ou le décret ?", attendu: "Le texte nommé, et la raison pour laquelle c'est celui-là." },
      { cle: "regimePiece", question: "Si un accord est invoqué, quelle est sa date de signature et où est son texte ?", attendu: "L'accord lui-même, daté et signé. Un régime conventionnel se prouve par son texte." },
      { cle: "regimeEffectif", question: "Quel est l'effectif de l'entreprise à la date de l'audit ?", attendu: "L'effectif chiffré : c'est lui qui départage R. 2312-8 et R. 2312-9, et qui ouvre ou ferme l'accord de branche." },
    ],
  },

  "BDESE-CTL-REG-02": {
    gravite: 3,
    quoiFaire: "Écarter l'accord de branche lorsqu'il ne peut pas régir cette entreprise, et retenir le texte qui s'y applique réellement.",
    risque: "Le dernier alinéa de L. 2312-21 ne permet à un accord de branche de définir la base qu'à défaut d'accord d'entreprise, et dans les entreprises de moins de trois cents salariés. Hors de ces deux conditions, la base est bâtie sur un texte qui ne la commande pas : elle sera incomplète au regard de celui qui la commande — l'accord d'entreprise, ou l'article R. 2312-9 — et le comité peut le lui opposer.",
    delai: "Quelques jours pour le constat ; le temps de monter la grille due si elle change.",
    document: "Note de régime rectificative — le texte réellement applicable à la base",
    etapes: [
      "Reprendre l'effectif et la date à laquelle le seuil de trois cents salariés a été franchi : ce seuil ferme à lui seul la voie de l'accord de branche.",
      "Vérifier s'il existe un accord d'entreprise au sens du premier alinéa de L. 2312-21 : s'il en existe un, l'accord de branche ne s'applique pas, puisqu'il ne vaut qu'à défaut.",
      "Retenir le texte qui s'applique réellement — l'accord d'entreprise, ou, à partir de trois cents salariés et sans accord, l'article R. 2312-9 — et le consigner dans la note de régime.",
      "Comparer la grille déjà montée à celle que ce texte commande, rubrique par rubrique, et inscrire les écarts au plan de complètement.",
      "Combler ces écarts avant la prochaine mise à disposition, puis en informer les bénéficiaires.",
    ],
    verifs: [
      { cle: "brancheEffectif", question: "Quel est l'effectif, et depuis quelle date le seuil de trois cents salariés est-il franchi ou non ?", attendu: "L'effectif et la date. Au-delà de trois cents, l'accord de branche ne peut plus définir la base." },
      { cle: "brancheAccordEntreprise", question: "Existe-t-il un accord d'entreprise définissant la base, et à quelle date a-t-il été conclu ?", attendu: "L'accord et sa date, ou le constat écrit qu'il n'en existe aucun." },
      { cle: "brancheTexteRetenu", question: "Quel texte a finalement été retenu pour monter la grille, et depuis quand ?", attendu: "Le texte nommé et la date de la note de régime rectificative." },
    ],
  },

  "BDESE-CTL-DAT-01": {
    gravite: 4,
    quoiFaire: "Établir et consigner la date à laquelle les attributions récurrentes du comité s'exercent, en partant de celle où l'effectif a atteint cinquante salariés pendant douze mois consécutifs.",
    risque: "L'article L. 2312-2 fait courir un délai de douze mois à compter de cette date, et ce n'est qu'à son expiration que le comité exerce l'ensemble des attributions récurrentes dont la base relève. Tant que la date n'est pas arrêtée, l'entreprise ne sait ni depuis quand la base est due, ni depuis quand elle est en retard, et elle ne peut opposer aucun délai à qui le lui reproche.",
    delai: "Quelques jours : la date se lit dans les déclarations sociales déjà produites.",
    document: "Note d'exigibilité — atteinte du seuil de cinquante salariés et point de départ du délai de douze mois",
    etapes: [
      "Relever l'effectif mois par mois, et identifier la date à laquelle cinquante salariés ont été atteints pendant douze mois consécutifs : c'est ce point de départ que L. 2312-2 retient, et non la date de mise en place du comité, qui relève d'un seuil distinct.",
      "En déduire le terme du délai de douze mois à l'expiration duquel le comité exerce l'ensemble des attributions récurrentes.",
      "Vérifier la réserve du même article : si, à ce terme, le mandat du comité restant à courir est inférieur à un an, le délai court à compter de son renouvellement.",
      "Consigner la date retenue et la pièce qui la porte au dossier : c'est d'elle que se compteront tous les retards du module.",
    ],
    verifs: [
      { cle: "dat01Seuil50", question: "À quelle date l'effectif a-t-il atteint cinquante salariés pendant douze mois consécutifs ?", attendu: "La date, avec le relevé d'effectif mensuel qui la porte." },
      { cle: "dat01Terme", question: "Quelle date d'exigibilité en avez-vous déduite pour les attributions récurrentes ?", attendu: "La date, soit douze mois après la précédente." },
      { cle: "dat01Mandat", question: "À ce terme, quelle durée de mandat restait-il à courir au comité ?", attendu: "La durée. En dessous d'un an, le délai court à compter du renouvellement du comité." },
    ],
  },

  "BDESE-CTL-DAT-02": {
    gravite: 4,
    quoiFaire: "Dater le franchissement du seuil de trois cents salariés et programmer, dans l'année que la loi laisse, le passage au contenu des entreprises de cette taille.",
    risque: "L'article L. 2312-34 répute le seuil franchi lorsque l'effectif le dépasse pendant douze mois consécutifs, et ne laisse qu'un an à compter de ce franchissement pour se conformer complètement aux obligations d'information et de consultation qui en découlent. Sans date, ce délai d'un an ne se compte pas : l'entreprise le dépasse sans le savoir, et son contenu reste celui d'une entreprise plus petite.",
    delai: "Quelques jours pour la date ; l'année entière que L. 2312-34 laisse pour le contenu.",
    document: "Note de franchissement du seuil de trois cents salariés et calendrier de mise en conformité",
    etapes: [
      "Relever l'effectif mois par mois et identifier la période de douze mois consécutifs pendant laquelle il a dépassé trois cents salariés : le seuil est réputé franchi à ce terme.",
      "Fixer la date limite de mise en conformité complète : un an à compter de ce franchissement.",
      "Vérifier d'abord si un accord de L. 2312-21 définit la base : s'il en existe un, c'est sa grille qui reste due, et le changement de seuil ne la déplace pas.",
      "À défaut d'accord, préparer le passage de la grille de l'article R. 2312-8 à celle de l'article R. 2312-9, en se reportant au texte de ce dernier — il ajoute expressément à son tableau la formation professionnelle et les conditions de travail du 1° A, e et f de R. 2312-8.",
      "Étaler le complètement sur le calendrier, rubrique par rubrique, de sorte que la base soit complète à la date limite.",
    ],
    verifs: [
      { cle: "dat02Franchissement", question: "À quelle date le seuil de trois cents salariés a-t-il été réputé franchi ?", attendu: "La date, avec le relevé d'effectif sur douze mois consécutifs." },
      { cle: "dat02Limite", question: "Quelle date limite de mise en conformité complète en avez-vous déduite ?", attendu: "La date, soit un an après le franchissement." },
      { cle: "dat02Calendrier", question: "Quelles rubriques restent à monter à ce jour, et pour quelle échéance ?", attendu: "La liste et les échéances, rubrique par rubrique." },
    ],
  },

  "BDESE-CTL-CNT-01": {
    gravite: 3,
    quoiFaire: "Compléter la base des thèmes du plancher de L. 2312-21, alinéa 3, qui n'y figurent pas.",
    risque: "Le troisième alinéa de L. 2312-21 dit que « la base de données comporte au moins les thèmes suivants » : ce plancher s'impose à tout accord, et un accord qui retire l'un de ces thèmes est, sur ce point, sans effet. Une base amputée ne rassemble pas l'ensemble des informations nécessaires aux consultations récurrentes que L. 2312-18 lui fait porter : la consultation qui s'en réclame peut être jugée irrégulière, et le délai de R. 2312-5 ne court pas sur ce qui n'a pas été mis à disposition.",
    delai: "Un à deux mois, selon le nombre de thèmes à monter et l'ancienneté des données.",
    document: "Grille de la base — thèmes du plancher légal et pièces qui les alimentent",
    etapes: [
      "Reprendre les thèmes que la base comporte réellement, un par un, et non le sommaire de l'outil qui la porte : c'est le contenu qui se contrôle.",
      "Vérifier AVANT toute chose s'il existe un accord au sens de L. 2312-21 : c'est lui qui définit l'organisation, l'architecture et le contenu de la base, et la grille à monter est la sienne. Le plancher de son troisième alinéa lui reste opposable, quoi qu'il stipule.",
      "À défaut d'accord seulement, la grille à monter est celle du décret — R. 2312-8 en dessous de trois cents salariés, R. 2312-9 à partir de trois cents. Ne pas la reconstituer de mémoire : s'y reporter rubrique par rubrique.",
      "Pour chaque thème du plancher absent, désigner le service qui détient la donnée et la date à laquelle il la fournit.",
      "Alimenter le thème sur les années dues, puis dater la mise à jour et en informer les bénéficiaires : sans cette information, le délai de consultation ne court pas.",
    ],
    verifs: [
      { cle: "cnt01Liste", question: "Quels thèmes la base comporte-t-elle, tels qu'ils apparaissent dans son sommaire ?", attendu: "La liste, thème par thème, avec l'onglet ou la page où chacun se trouve." },
      { cle: "cnt01Environnement", question: "Les conséquences environnementales de l'activité de l'entreprise figurent-elles parmi ces thèmes ?", attendu: "Le thème et son emplacement ; c'est le thème le plus souvent absent du plancher de L. 2312-21, alinéa 3." },
      { cle: "cnt01DateAjout", question: "À quelle date le dernier thème manquant a-t-il été ajouté à la base ?", attendu: "La date, et la trace de l'information donnée aux bénéficiaires à cette occasion." },
    ],
  },

  "BDESE-CTL-CNT-02": {
    gravite: 3,
    quoiFaire: "Monter la grille du décret, rubrique par rubrique, et la renseigner : article R. 2312-8 en dessous de trois cents salariés, article R. 2312-9 à partir de trois cents.",
    risque: "En l'absence d'accord, c'est le décret qui fixe le contenu de la base, et les rubriques qu'il énumère sont dues. Une rubrique absente prive le comité d'une information que L. 2312-18 range parmi celles nécessaires à ses consultations récurrentes : la consultation peut être jugée irrégulière, et l'avis n'être pas valablement rendu. L'article R. 2312-7 ajoute que l'ensemble des informations de la base contribue à donner une vision claire et globale de la formation et de la répartition de la valeur créée par l'activité — une grille trouée ne la donne pas.",
    delai: "Deux à quatre mois : la grille des entreprises d'au moins trois cents salariés compte plusieurs centaines d'informations.",
    document: "Grille du contenu supplétif — rubriques du décret, pièces qui les alimentent, service responsable",
    etapes: [
      "Vérifier AVANT toute chose qu'aucun accord de L. 2312-21 ne définit la base : le contenu du décret n'est dû qu'en son absence. S'il existe un accord, c'est sa grille qu'il faut monter, et ce contrôle n'a pas lieu d'être.",
      "À défaut d'accord, déterminer par l'effectif lequel des deux articles s'applique : R. 2312-8 en dessous de trois cents salariés, R. 2312-9 à partir de trois cents.",
      "Si c'est R. 2312-9, ne pas s'arrêter à son tableau : il ajoute expressément les informations relatives à la formation professionnelle et aux conditions de travail prévues au 1° A, e et f de l'article R. 2312-8.",
      "Monter la grille rubrique par rubrique en se reportant au texte de l'article retenu, sans le résumer : le découpage du décret est fait pour cela, et il est publié avec sa couverture.",
      "Pour chaque rubrique, désigner le service qui détient la donnée et la date à laquelle il la fournit, puis la renseigner sur les années dues.",
      "Dater la mise à jour, en informer les bénéficiaires, et conserver la preuve de cette information.",
    ],
    verifs: [
      { cle: "cnt02Article", question: "Sur quel article la grille de votre base est-elle bâtie, et pourquoi celui-là ?", attendu: "R. 2312-8 ou R. 2312-9, avec l'effectif qui le commande et le constat écrit qu'aucun accord ne définit la base." },
      { cle: "cnt02Rubriques", question: "Combien de rubriques la base comporte-t-elle, et lesquelles ?", attendu: "La liste, comparable rubrique par rubrique à celle de l'article retenu." },
      { cle: "cnt02Renvoi", question: "Si l'article R. 2312-9 s'applique, la formation professionnelle et les conditions de travail y figurent-elles ?", attendu: "Les deux rubriques : R. 2312-9 les ajoute à son tableau par renvoi au 1° A, e et f de R. 2312-8." },
      { cle: "cnt02Responsables", question: "Pour chaque rubrique, qui fournit la donnée et à quelle échéance ?", attendu: "Le tableau des responsables et des échéances ; sans lui, la grille se vide au premier exercice." },
    ],
  },

  "BDESE-CTL-CNT-03": {
    gravite: 3,
    quoiFaire: "Étendre la base aux six années dues : l'année en cours, les deux années précédentes et les trois années suivantes.",
    risque: "L'article R. 2312-10 fixe, en l'absence d'accord, les années sur lesquelles portent les informations — et l'article L. 2312-36 le dit déjà de la loi : les informations portent sur les deux années précédentes et l'année en cours, et intègrent des perspectives sur les trois années suivantes. Une base qui ne présente qu'un exercice ne montre ni l'évolution passée ni la trajectoire : le comité n'est pas mis en état d'exercer utilement ses compétences, ce que L. 2312-21 exige de l'organisation et du contenu de la base.",
    delai: "Un à deux mois : les années passées se retrouvent dans les données déjà produites, elles ne se recalculent pas.",
    document: "Tableau des six années — deux exercices passés, l'année en cours, trois exercices à venir",
    etapes: [
      "Vérifier d'abord qu'aucun accord de L. 2312-21 ne définit lui-même les années couvertes : l'article R. 2312-10 ne vaut qu'en l'absence d'accord, et un accord peut retenir une autre profondeur.",
      "À défaut d'accord, ouvrir pour chaque rubrique six colonnes : les deux années précédentes, l'année en cours, les trois années suivantes.",
      "Reprendre les deux années passées dans les documents déjà produits — comptes, déclarations sociales, bilans antérieurs — plutôt que de les reconstituer.",
      "Renseigner les trois années suivantes en données chiffrées ou, à défaut, sous forme de grandes tendances : le décret admet expressément les deux, et exiger le chiffre partout retarderait la base sans l'améliorer.",
      "Dater la mise à jour et en informer les bénéficiaires.",
    ],
    verifs: [
      { cle: "cnt03Colonnes", question: "Combien d'années chaque rubrique de la base présente-t-elle, et lesquelles ?", attendu: "Les six millésimes, visibles en tête de colonne : deux années passées, l'année en cours, trois années à venir." },
      { cle: "cnt03Passees", question: "Les deux années précédentes sont-elles renseignées pour toutes les rubriques, ou seulement pour certaines ?", attendu: "Le pointage rubrique par rubrique ; une colonne vide se voit." },
      { cle: "cnt03Suivantes", question: "Les trois années suivantes sont-elles renseignées, et depuis quelle mise à jour ?", attendu: "Les trois colonnes et la date de la mise à jour qui les a portées." },
    ],
  },

  "BDESE-CTL-CNT-04": {
    gravite: 4,
    quoiFaire: "Renseigner les trois années suivantes en données chiffrées ou en grandes tendances, et indiquer, pour ces années, les informations qui ne peuvent recevoir ni l'une ni l'autre, avec les raisons qui l'expliquent.",
    risque: "L'article R. 2312-10 admet les grandes tendances, mais il ajoute une obligation qu'on oublie : l'employeur indique, pour ces années, les informations qui ne peuvent pas faire l'objet de données chiffrées ou de grandes tendances, et les raisons qu'il en donne. Une case laissée vide sans cette explication ne se distingue pas d'une information manquante, et le comité peut soutenir qu'il n'a pas été mis en état d'exercer utilement ses compétences.",
    delai: "Deux semaines : c'est une mention à écrire, rubrique par rubrique, non une donnée à produire.",
    document: "Note sur les perspectives — forme retenue et informations non renseignables, avec leurs raisons",
    etapes: [
      "Vérifier d'abord qu'aucun accord de L. 2312-21 ne règle la question : l'article R. 2312-10 ne vaut qu'en l'absence d'accord.",
      "Pour chaque rubrique, arrêter la forme des trois années suivantes : données chiffrées lorsque le chiffre a un sens, grandes tendances lorsqu'il n'en a pas.",
      "Relever les informations qui ne peuvent recevoir ni chiffres ni tendances, et écrire pour chacune la raison — la nature de l'information, ou les circonstances.",
      "Faire figurer cette liste motivée dans la base elle-même, et non dans un document séparé : c'est là que le comité la lit, et c'est là que le décret la place.",
      "Dater la mise à jour et en informer les bénéficiaires.",
    ],
    verifs: [
      { cle: "cnt04Forme", question: "Sous quelle forme les trois années suivantes sont-elles présentées — chiffres, grandes tendances, ou les deux selon les rubriques ?", attendu: "La forme, rubrique par rubrique. Les grandes tendances suffisent : le décret les admet." },
      { cle: "cnt04Liste", question: "Où, dans la base, figure la liste des informations qui ne peuvent recevoir ni chiffres ni tendances ?", attendu: "L'emplacement dans la base ; une note conservée à part ne vaut pas mention dans la base." },
      { cle: "cnt04Motifs", question: "Chaque information de cette liste porte-t-elle la raison qui l'explique ?", attendu: "La raison, information par information : le décret exige les raisons, non le seul constat." },
    ],
  },

  "BDESE-CTL-MAD-01": {
    gravite: 3,
    quoiFaire: "Ouvrir l'accès à la base, en permanence, aux membres de la délégation du personnel du comité — et du comité central s'il en existe un — ainsi qu'aux délégués syndicaux.",
    risque: "L'article L. 2312-18 met la base à la disposition du comité, et le dernier alinéa de L. 2312-36 la rend accessible en permanence aux membres de la délégation du personnel du comité, à ceux du comité central et aux délégués syndicaux. Un accord peut organiser les droits d'accès — L. 2312-21, 2° le lui permet — il ne peut pas les supprimer. Une base qu'une catégorie de bénéficiaires n'atteint pas n'est pas mise à sa disposition, et la consultation qui s'en réclame est contestable.",
    delai: "Quelques jours : ce sont des droits à ouvrir, pas un contenu à produire.",
    document: "Liste nominative des accès à la base et modalités de consultation et d'utilisation",
    etapes: [
      "Établir la liste nominative des personnes qui doivent avoir accès : membres de la délégation du personnel du comité, membres du comité social et économique central s'il en existe un, délégués syndicaux.",
      "Vérifier le support : en l'absence d'accord, l'article R. 2312-12 impose le support informatique dans les entreprises d'au moins trois cents salariés, et admet le support informatique ou papier en dessous.",
      "Ouvrir les accès manquants, puis écrire les modalités d'accès, de consultation et d'utilisation : le même article les fait fixer par l'employeur, et exige qu'elles permettent à chacun d'exercer utilement ses compétences.",
      "Notifier ces accès aux intéressés et conserver la trace de la notification.",
      "Rappeler par écrit l'obligation de discrétion qui pèse sur eux à l'égard des informations que l'employeur présente comme confidentielles (L. 2312-36, dernier alinéa) : c'est la contrepartie de l'accès permanent, et elle se rappelle au moment où l'accès s'ouvre.",
    ],
    verifs: [
      { cle: "mad01Liste", question: "Qui a aujourd'hui accès à la base, nominativement ?", attendu: "La liste : élus du comité, élus du comité central s'il existe, délégués syndicaux." },
      { cle: "mad01Support", question: "Sur quel support la base est-elle tenue — informatique ou papier ?", attendu: "Le support. À partir de trois cents salariés et à défaut d'accord, R. 2312-12 impose l'informatique." },
      { cle: "mad01Ouverture", question: "À quelle date l'accès de chaque bénéficiaire a-t-il été ouvert, et est-il resté ouvert entre deux réunions ?", attendu: "Les dates d'ouverture et la trace des accès hors période de consultation : l'accès est permanent, non ponctuel." },
    ],
  },

  "BDESE-CTL-MAD-02": {
    gravite: 3,
    quoiFaire: "Actualiser la base et organiser son actualisation : une date de mise à jour par rubrique, une périodicité, et la personne qui en répond.",
    risque: "Les informations de la base portent sur l'année en cours : une base qui n'a pas bougé depuis plus d'un an ne les porte plus, quoi qu'affirme son sommaire. L'article L. 2312-18 parle d'une mise à disposition actualisée, et c'est elle qui vaut communication des rapports et informations au comité ; l'article R. 2312-11 fait mettre à jour régulièrement les éléments d'information, au moins dans le respect des périodicités prévues par le code. Une base périmée fait tomber ce bénéfice : l'employeur croit avoir communiqué, et il n'a rien communiqué.",
    delai: "Un mois pour la remise à niveau ; la périodicité, elle, se fixe une fois pour toutes.",
    document: "Calendrier d'actualisation — rubrique, responsable, périodicité, date de dernière mise à jour",
    etapes: [
      "Relever, rubrique par rubrique, la date de la dernière mise à jour : une date globale ne dit rien de la rubrique qui n'a pas bougé depuis trois ans.",
      "Vérifier d'abord ce que prévoit l'accord de L. 2312-21 : son 2° porte les modalités de fonctionnement de la base, et l'actualisation en fait partie. À défaut d'accord, R. 2312-11 impose une mise à jour régulière, au moins selon les périodicités prévues par le code.",
      "Fixer, pour chaque rubrique, une périodicité d'actualisation et le service qui en répond.",
      "Mettre à jour ce qui est en retard, en commençant par les rubriques qui alimentent la prochaine consultation récurrente.",
      "Informer les bénéficiaires de chaque actualisation et conserver la trace de cette information.",
    ],
    verifs: [
      { cle: "mad02Dates", question: "Quelle est la date de dernière mise à jour de chaque rubrique de la base ?", attendu: "Les dates, rubrique par rubrique, et non une date unique portée en page de garde." },
      { cle: "mad02Calendrier", question: "Quelle périodicité d'actualisation est fixée, et où est-elle écrite ?", attendu: "Le calendrier d'actualisation, ou la stipulation de l'accord qui la fixe." },
      { cle: "mad02Responsable", question: "Qui répond de l'actualisation de chaque rubrique ?", attendu: "Le service ou la personne, rubrique par rubrique." },
    ],
  },

  "BDESE-CTL-MAD-03": {
    gravite: 3,
    quoiFaire: "Informer les bénéficiaires de chaque actualisation de la base, par un moyen qui en garde la trace.",
    risque: "L'article R. 2312-5 fait courir le délai de consultation de la communication des informations par l'employeur, ou de l'information par l'employeur de leur mise à disposition dans la base. Sans cette information, le délai ne court pas : le comité ne peut pas être réputé consulté, et l'avis que R. 2312-6 attache au terme du délai ne se produit jamais. La consultation reste ouverte indéfiniment, et la décision prise après elle est exposée.",
    delai: "Immédiat, et à chaque mise à jour : c'est un envoi.",
    document: "Modèle d'information des bénéficiaires de la mise à jour de la base",
    etapes: [
      "Arrêter le moyen d'information et l'écrire dans les modalités de fonctionnement de la base : en l'absence d'accord, R. 2312-12 laisse l'employeur déterminer ces modalités, mais il les lui fait fixer.",
      "À chaque actualisation, informer les personnes qui ont accès à la base en désignant ce qui a été mis à jour et à quelle date.",
      "Conserver la preuve d'envoi : c'est elle qui datera le point de départ du délai de consultation.",
      "Pour les consultations récurrentes, rappeler dans cette information que la mise à disposition actualisée vaut communication des rapports et informations au comité (L. 2312-18) — c'est ce qui donne à l'envoi sa portée.",
    ],
    verifs: [
      { cle: "mad03Moyen", question: "Par quel moyen les bénéficiaires sont-ils informés d'une mise à jour, et où ce moyen est-il écrit ?", attendu: "Le moyen retenu et le document qui le fixe — l'accord, ou les modalités arrêtées par l'employeur." },
      { cle: "mad03Dernier", question: "À quelle date la dernière information de mise à jour a-t-elle été envoyée, et à qui ?", attendu: "La date et la liste des destinataires." },
      { cle: "mad03Preuve", question: "Quelle preuve d'envoi conservez-vous de ces informations ?", attendu: "Les accusés, courriels ou décharges datés : c'est la pièce qui fait courir le délai." },
    ],
  },

  "BDESE-CTL-CSL-01": {
    gravite: 3,
    quoiFaire: "Ramener la périodicité des consultations récurrentes dans la limite de trois ans, et ne pas confondre l'accord qui la fixe avec celui qui définit la base.",
    risque: "Le dernier alinéa de L. 2312-19 plafonne à trois ans la périodicité que l'accord peut prévoir : au-delà, la stipulation est sans effet, et les consultations restent dues à l'échéance que le code fixe. L'employeur qui s'en croit dispensé laisse passer une consultation récurrente en pensant l'avoir aménagée.",
    delai: "Le temps d'un avenant : trois à six mois si l'accord doit être rouvert.",
    document: "Avenant à l'accord sur les consultations récurrentes — périodicité ramenée dans la limite de trois ans",
    etapes: [
      "Distinguer les deux accords, car ils se confondent souvent : celui de L. 2312-19 définit le contenu, la périodicité et les modalités des consultations récurrentes ; celui de L. 2312-21 définit la base. Un accord sur la base ne déplace pas la périodicité des consultations.",
      "Relire l'accord de L. 2312-19 et relever la périodicité qu'il fixe, consultation par consultation.",
      "Pour toute périodicité supérieure à trois ans, la ramener par avenant dans cette limite.",
      "En attendant l'avenant, tenir la consultation à l'échéance légale : une stipulation sans effet ne dispense de rien.",
      "Déposer l'avenant et conserver le récépissé.",
    ],
    verifs: [
      { cle: "csl01Objet", question: "Quel accord fixe la périodicité de vos consultations récurrentes, et quel est son objet exact ?", attendu: "L'accord de L. 2312-19, distinct de celui qui définit la base. Si c'est le même document, la stipulation qui porte la périodicité." },
      { cle: "csl01Periodicite", question: "Quelle périodicité y est fixée, consultation par consultation ?", attendu: "Les périodicités chiffrées. Aucune ne peut excéder trois ans." },
      { cle: "csl01Derniere", question: "À quelle date chacune des consultations récurrentes a-t-elle été tenue pour la dernière fois ?", attendu: "Les dates, avec les procès-verbaux." },
    ],
  },

  "BDESE-CTL-CSL-02": {
    gravite: 4,
    quoiFaire: "Porter à six au moins le nombre de réunions annuelles du comité que l'accord prévoit, et tenir ces réunions sans attendre l'avenant.",
    risque: "Le 2° de L. 2312-19 permet à l'accord de fixer le nombre de réunions annuelles du comité, mais il ajoute qu'il ne peut être inférieur à six. En dessous, la stipulation ne tient pas : les réunions restent dues, et l'employeur qui s'en tient au chiffre de l'accord en omet.",
    delai: "Immédiat pour la programmation des réunions ; le temps d'un avenant pour la stipulation.",
    document: "Calendrier annuel des réunions du comité et avenant portant le nombre à six au moins",
    etapes: [
      "Relever le nombre de réunions que l'accord prévoit et le nombre effectivement tenues dans l'année écoulée.",
      "Programmer immédiatement les réunions manquantes pour atteindre six sur l'année en cours : c'est le plancher du 2° de L. 2312-19, et il ne se négocie pas à la baisse.",
      "Corriger la stipulation par avenant, puis le déposer.",
      "Convoquer, tenir et procès-verbaliser chaque réunion : c'est le procès-verbal qui prouvera le nombre.",
    ],
    verifs: [
      { cle: "csl02Nombre", question: "Combien de réunions du comité l'accord prévoit-il, et combien se sont tenues sur les douze derniers mois ?", attendu: "Les deux chiffres. Le second ne peut pas descendre en dessous de six." },
      { cle: "csl02Dates", question: "À quelles dates ces réunions se sont-elles tenues ?", attendu: "Les dates, avec les procès-verbaux ou les feuilles d'émargement." },
      { cle: "csl02Avenant", question: "Si l'accord prévoyait moins de six réunions, à quelle date l'avenant a-t-il été signé et déposé ?", attendu: "La date et le récépissé de dépôt." },
    ],
  },

  "BDESE-CTL-CSL-03": {
    gravite: 3,
    quoiFaire: "Établir le point de départ et le terme du délai de consultation, et faire rendre l'avis avant ce terme.",
    risque: "À défaut d'accord, le I de l'article R. 2312-6 répute le comité consulté ET AYANT RENDU UN AVIS NÉGATIF à l'expiration d'un mois — porté à deux mois en cas d'intervention d'un expert, à trois lorsque des expertises interviennent à la fois au niveau du comité central et d'un ou plusieurs comités d'établissement. Le terme n'est pas un silence neutre : il produit un avis défavorable, opposable, que l'employeur n'a pas voulu et qu'il ne peut plus effacer.",
    delai: "Le délai lui-même : un mois, deux ou trois selon l'expertise.",
    document: "Fiche de délai de consultation — mise à disposition, terme applicable, date de l'avis",
    etapes: [
      "Dater la communication des informations, ou l'information de leur mise à disposition dans la base : c'est de là que court le délai (R. 2312-5), et non de la première réunion.",
      "Retenir le terme applicable : un mois à défaut d'accord, deux en cas d'intervention d'un expert, trois lorsque des expertises interviennent à la fois au niveau du comité central et d'un ou plusieurs comités d'établissement.",
      "Si la consultation se déroule à la fois au niveau central et au niveau des établissements, faire rendre et transmettre l'avis de chaque comité d'établissement au comité central au plus tard sept jours avant ce terme : à défaut, cet avis est réputé négatif (R. 2312-6, II).",
      "Porter l'avis au procès-verbal, daté, avant le terme, et conserver le procès-verbal avec la fiche de délai.",
    ],
    verifs: [
      { cle: "csl03Depart", question: "À quelle date les informations ont-elles été communiquées, ou leur mise à disposition dans la base signalée ?", attendu: "La date, avec la preuve d'envoi : c'est le point de départ du délai." },
      { cle: "csl03Terme", question: "Quel terme en avez-vous déduit, et une expertise est-elle intervenue ?", attendu: "Le terme calculé, et le cas échéant la lettre de mission de l'expert qui allonge le délai." },
      { cle: "csl03Avis", question: "À quelle date l'avis a-t-il été rendu, et où est le procès-verbal ?", attendu: "La date et le procès-verbal. Après le terme, l'avis négatif était déjà acquis." },
    ],
  },

  "BDESE-CTL-ETB-01": {
    gravite: 4,
    quoiFaire: "Fixer et écrire le niveau auquel la base est mise en place lorsque l'entreprise comporte des établissements distincts.",
    risque: "Le 2° de L. 2312-21 range expressément parmi ce que l'accord définit le niveau de mise en place de la base dans les entreprises comportant des établissements distincts. À défaut d'accord, R. 2312-11 la constitue au niveau de l'entreprise et lui fait comporter les informations que l'employeur met à disposition du comité central et des comités d'établissement. Un niveau non fixé laisse chaque comité sans savoir où lire ce qui le concerne, et l'employeur sans pouvoir démontrer qu'il l'a mis à sa disposition.",
    delai: "Une réunion, puis une mention écrite.",
    document: "Note sur le niveau de mise en place de la base et les droits d'accès par établissement",
    etapes: [
      "Recenser les établissements distincts et les comités qui y sont installés, ainsi que le comité social et économique central.",
      "Vérifier d'abord ce que l'accord de L. 2312-21 prévoit : son 2° porte le niveau de mise en place et les droits d'accès.",
      "À défaut d'accord, retenir le niveau de l'entreprise et faire comporter à la base les informations mises à disposition du comité central et des comités d'établissement, comme le prescrit R. 2312-11.",
      "Écrire les droits d'accès de chaque comité, les notifier, et conserver la trace de cette notification.",
    ],
    verifs: [
      { cle: "etb01Etablissements", question: "Combien d'établissements distincts l'entreprise comporte-t-elle, et quels comités y sont installés ?", attendu: "La liste des établissements et des comités, avec le comité central." },
      { cle: "etb01Niveau", question: "À quel niveau la base est-elle mise en place, et où cela est-il écrit ?", attendu: "Le niveau et la pièce qui le fixe — l'accord, ou la note de l'employeur à défaut d'accord." },
      { cle: "etb01Acces", question: "Quels droits d'accès chaque comité d'établissement a-t-il sur la base ?", attendu: "Les droits, comité par comité, et la notification qui les a portés à leur connaissance." },
    ],
  },

  "BDESE-CTL-COH-01": {
    gravite: 3,
    quoiFaire: "Mettre d'accord le régime déclaré et les pièces versées : produire l'accord qui définit la base, ou retirer du dossier celui qui n'en traite pas.",
    risque: "Un régime conventionnel se prouve par son texte. Déclarer un accord sans le produire, ou se dire sous le régime supplétif tout en versant un accord, laisse le dossier contradictoire : l'un des deux est faux. Devant le comité comme devant le juge, l'employeur ne peut pas opposer un accord qu'il ne produit pas, et la grille qu'il aura montée sera jugée au regard du texte que les pièces établissent, non de celui qu'il affirme.",
    delai: "Quelques jours : il s'agit de retrouver une pièce, ou de rectifier une déclaration.",
    document: "Bordereau des pièces — accords versés, leur objet, et régime retenu",
    etapes: [
      "Reprendre le régime déclaré et la liste des pièces versées, et dire lequel des deux est erroné.",
      "Si un accord définit la base, le verser en entier : c'est son texte qui fixe l'organisation, l'architecture, le contenu et les modalités de fonctionnement, et un résumé n'en tient pas lieu.",
      "Vérifier que l'accord versé porte bien sur la base et non sur les consultations récurrentes : celui de L. 2312-21 et celui de L. 2312-19 se confondent souvent, et ils n'ont pas le même objet.",
      "Si aucun accord ne définit la base, retirer du bordereau ceux qui n'en traitent pas et retenir le régime supplétif, en le motivant par écrit.",
      "Rectifier la déclaration de régime et relancer l'audit : les contrôles de contenu ne concluent qu'une fois le régime établi.",
    ],
    verifs: [
      { cle: "coh01Piece", question: "Quelles pièces établissent le régime que vous déclarez, et où sont-elles ?", attendu: "L'accord complet et daté, ou le constat écrit qu'il n'en existe aucun." },
      { cle: "coh01Objet", question: "L'accord versé définit-il l'organisation, l'architecture et le contenu de la base, ou la périodicité des consultations ?", attendu: "L'article ou la stipulation qui le montre : L. 2312-21 pour la base, L. 2312-19 pour les consultations." },
      { cle: "coh01Signature", question: "Dans quelles conditions cet accord a-t-il été conclu ?", attendu: "Les signatures des organisations syndicales dans les conditions du premier alinéa de L. 2232-12, ou, en l'absence de délégué syndical, le procès-verbal d'adoption par le comité à la majorité des membres titulaires de la délégation du personnel — L. 2312-21 n'ouvre que ces deux voies." },
    ],
  },

  "BDESE-CTL-PRV-01": {
    gravite: 4,
    quoiFaire: "Réunir et tenir à jour le dossier qui prouve la mise à disposition effective : le support, ses traces d'accès, et les informations données aux bénéficiaires.",
    risque: "L'article L. 2312-18 met la base à disposition, et c'est un acte de l'employeur : c'est à lui de l'établir. Le module prépare, structure, date et audite le contenu — il n'est pas la base, et il n'atteste pas la mise à disposition. Sans dossier de preuve, l'employeur qui affirme avoir mis la base à disposition ne peut pas le démontrer, et il ne peut pas se prévaloir de la règle du même article selon laquelle la mise à disposition actualisée vaut communication des rapports et informations au comité.",
    delai: "Une semaine pour constituer le dossier, puis en continu : la preuve se réunit au fil des mises à jour, jamais après coup.",
    document: "Dossier de preuve de la mise à disposition — support, accès, notifications",
    etapes: [
      "Décrire le support de la base : en l'absence d'accord, R. 2312-12 impose l'informatique à partir de trois cents salariés et admet l'informatique ou le papier en dessous.",
      "Réunir les traces d'accès que ce support produit : journal de connexions, décharges de remise, registre de consultation selon le cas.",
      "Réunir les informations envoyées aux bénéficiaires à chaque actualisation, avec leur date d'envoi et la liste des destinataires.",
      "Classer ces pièces par date et les conserver avec la base : c'est ce dossier, et non le rapport d'audit, qui prouvera la mise à disposition.",
    ],
    verifs: [
      { cle: "prv01Support", question: "Sur quel support la base est-elle tenue, et depuis quand ?", attendu: "Le support et sa date de mise en service." },
      { cle: "prv01Traces", question: "Quelles traces d'accès ce support produit-il, et où sont-elles conservées ?", attendu: "Le journal de connexions, les décharges ou le registre, et leur lieu de conservation." },
      { cle: "prv01Notifications", question: "Quelles informations de mise à jour avez-vous envoyées sur les douze derniers mois, et à quelles dates ?", attendu: "Les envois datés et leurs destinataires." },
    ],
  },
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
const CLES = new Set();
for (const [id, r] of Object.entries(R)) {
  if (r === null) continue;
  for (const champ of ["gravite", "quoiFaire", "risque", "delai", "etapes", "verifs"])
    if (r[champ] === undefined || r[champ] === null || r[champ] === "")
      ECARTS.push(`${id} : le champ « ${champ} » manque`);
  if (!GRAVITES[r.gravite]) ECARTS.push(`${id} : gravité « ${r.gravite} » inconnue`);
  if (Array.isArray(r.etapes) && r.etapes.length < 2)
    ECARTS.push(`${id} : une procédure d'une seule étape n'accompagne personne`);
  if (Array.isArray(r.verifs))
    for (const v of r.verifs) {
      if (!v.cle || !v.question || !v.attendu)
        ECARTS.push(`${id} : une vérification est incomplète (clé, question, attendu)`);
      /* Une clé qui se répète écraserait la réponse de l'autre point : les
         réponses de la page sont rangées par clé, et deux points ne peuvent pas
         partager la même case. */
      if (v.cle && CLES.has(v.cle)) ECARTS.push(`${id} : la clé « ${v.cle} » sert déjà ailleurs`);
      if (v.cle) CLES.add(v.cle);
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
