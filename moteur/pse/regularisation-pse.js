/* Ce qu'il faut faire quand un contrôle du plan de sauvegarde de l'emploi ne
   passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   de calibrage, qui calculent un rapport et l'affichent sans rien constater, et
   ce null doit être écrit.

   UNE PARTICULARITÉ DE CE MODULE, ET IL FAUT LA DIRE D'EMBLÉE. Beaucoup
   d'irrégularités du plan ne se régularisent pas après coup : elles imposent de
   reprendre la procédure à un point donné. Le comité est consulté sur les
   mesures sociales d'accompagnement prévues par le plan (L. 1233-30, I, 2°) —
   une mesure ajoutée après la dernière réunion n'a donc pas été soumise à lui.
   L'administration vérifie la régularité de la procédure d'information et de
   consultation et le respect des articles L. 1233-61 à L. 1233-63
   (L. 1233-57-3) — ce qu'elle a sous les yeux est le dossier tel qu'il a été
   déposé. Et l'employeur ne peut procéder à la rupture des contrats, à peine de
   nullité, avant la décision (L. 1233-39). Là où c'est le cas, l'entrée le dit
   dans « quoiFaire » et fait commencer les étapes par le point de reprise.
   Aucune entrée n'écrit qu'une chose se rattrape lorsque le texte ne le permet
   pas.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé sur un article lu
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la saisine ou la décision
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-pse.json. Aucun montant de plan n'est indiqué nulle part ici :
   aucun texte n'en fixe, et l'appréciation appartient à l'administration puis au
   juge administratif (L. 1233-57-3). */

const { C } = require("./controles-pse.js");

/* Les quatre degrés, nommés une fois pour toutes. Le troisième est celui du
   module : dans un dossier de plan, l'irrégularité se paie devant
   l'administration avant de se payer devant le juge. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — la validation ou l'homologation peut être refusée ou annulée",
  4: "Régularisation rapide",
};

const R = {

  "PSE-CTL-CON-01": {
    gravite: 3,
    quoiFaire: "Rattacher une mesure à chaque rubrique de l'article L. 1233-62, ou porter au dossier le motif pour lequel une rubrique est écartée — et, si la dernière réunion du comité a déjà eu lieu, soumettre le plan complété à une nouvelle réunion avant de saisir l'administration.",
    risque: "L'administration vérifie le respect par le plan des articles L. 1233-61 à L. 1233-63 (L. 1233-57-3). La liste de L. 1233-62 n'est pas limitative — l'article énonce « des mesures telles que » — mais une rubrique laissée vide sans explication est un motif de refus ordinaire, et le refus renvoie tout le dossier au point de départ.",
    delai: "Une à deux semaines pour compléter le plan ; une réunion supplémentaire du comité si le plan a déjà été présenté en dernière réunion.",
    document: "Tableau des mesures du plan, rubrique par rubrique de l'article L. 1233-62",
    etapes: [
      "Reprendre les sept rubriques du texte et pointer celles qui ne portent aucune mesure : reclassement interne sur le territoire national (1°), reprise de tout ou partie des activités pour éviter la fermeture d'un établissement (1° bis), créations d'activités nouvelles par l'entreprise (2°), reclassement externe et soutien à la réactivation du bassin d'emploi (3°), soutien à la création ou à la reprise d'activités par les salariés (4°), formation, validation des acquis et reconversion (5°), réduction ou aménagement du temps de travail et des heures supplémentaires régulières (6°).",
      "Pour chaque rubrique vide, décider : soit une mesure y est rattachée, soit le motif de son écartement est écrit au dossier. Un silence n'est ni l'un ni l'autre.",
      "Si la dernière réunion du comité a déjà eu lieu, ne pas ajouter la mesure au dossier sans la lui soumettre : le comité est consulté sur les mesures sociales d'accompagnement prévues par le plan (L. 1233-30, I, 2°). Convoquer une réunion sur le plan complété.",
      "Ne saisir l'administration qu'une fois le plan complété et le comité consulté sur sa version définitive.",
    ],
    verifs: [
      { cle: "con01Rubriques", question: "Quelles rubriques de L. 1233-62 portent au moins une mesure, et lesquelles n'en portent aucune ?", attendu: "Le tableau rubrique par rubrique, avec la marque (1°, 1° bis, 2°, 3°, 4°, 5°, 6°)." },
      { cle: "con01Motifs", question: "Pour chaque rubrique écartée, où est écrit le motif de son écartement ?", attendu: "La pièce du dossier qui le porte, et sa page." },
      { cle: "con01DerniereReunion", question: "À quelle date le comité a-t-il été consulté sur la version du plan qui a été déposée ?", attendu: "La date de la réunion, et le procès-verbal portant sur cette version-là." },
    ],
  },

  "PSE-CTL-CON-02": {
    gravite: 3,
    quoiFaire: "Intégrer au plan un véritable plan de reclassement interne et y identifier nommément les catégories de salariés dont la réinsertion professionnelle est particulièrement difficile — puis, la dernière réunion du comité ayant déjà eu lieu le cas échéant, reprendre la consultation sur ce plan.",
    risque: "L'article L. 1233-61 fait du plan de reclassement le cœur du plan de sauvegarde de l'emploi : le plan « intègre un plan de reclassement visant à faciliter le reclassement sur le territoire national des salariés dont le licenciement ne pourrait être évité, notamment celui des salariés âgés ou présentant des caractéristiques sociales ou de qualification rendant leur réinsertion professionnelle particulièrement difficile ». L'administration vérifie le respect de cet article (L. 1233-57-3) : un plan sans reclassement interne n'est pas un plan incomplet, c'est un plan qui n'a pas son objet.",
    delai: "Trois à quatre semaines : le recensement des postes disponibles dans l'entreprise et, s'il y a lieu, dans le groupe, en est le préalable.",
    document: "Plan de reclassement interne — postes recensés, catégories visées, salariés à réinsertion difficile",
    etapes: [
      "Recenser les postes disponibles relevant de la même catégorie d'emplois ou équivalents à ceux qu'occupent les salariés concernés, et ceux de catégorie inférieure, ces derniers ne pouvant être proposés que sous réserve de l'accord exprès du salarié (L. 1233-62, 1°).",
      "Identifier les salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification — et écrire ce qui leur est spécifiquement proposé : l'article les vise nommément.",
      "Chiffrer chaque action de reclassement : nombre de postes, nombre de bénéficiaires attendus, durée de la période de recherche, budget.",
      "Soumettre le plan ainsi complété au comité social et économique, la consultation portant sur les mesures sociales d'accompagnement prévues par le plan (L. 1233-30, I, 2°).",
      "Ne déposer la demande de validation ou d'homologation qu'ensuite.",
    ],
    verifs: [
      { cle: "con02Postes", question: "Combien de postes de reclassement interne sont recensés, et à quelle date ce recensement a-t-il été arrêté ?", attendu: "La liste des postes et sa date d'arrêté." },
      { cle: "con02Exposes", question: "Quelles catégories de salariés à réinsertion particulièrement difficile sont identifiées, et où le sont-elles ?", attendu: "La partie du plan qui les nomme — âge, caractéristiques sociales, qualification." },
      { cle: "con02Consultation", question: "À quelle date le comité a-t-il été consulté sur le plan de reclassement dans sa version déposée ?", attendu: "La date de la réunion et le procès-verbal." },
    ],
  },

  "PSE-CTL-CON-03": {
    gravite: 4,
    quoiFaire: "Distinguer dans le plan les offres de reclassement situées sur le territoire national de celles qui ne le sont pas, et ne faire compter que les premières au titre de l'obligation.",
    risque: "Le plan de reclassement de l'article L. 1233-61 vise le reclassement sur le territoire national, et l'article L. 1233-62, 1° vise les actions de reclassement interne sur ce même territoire. Une offre située hors de France ne compte pas dans l'obligation : un plan qui l'y compte affiche un volume de reclassement qu'il n'a pas, et l'écart se voit dès l'instruction.",
    delai: "Quelques jours : c'est un travail de tri sur les mesures déjà écrites.",
    document: "Ventilation des offres de reclassement — territoire national et hors territoire national",
    etapes: [
      "Reprendre chaque mesure de reclassement et localiser les emplois qu'elle vise.",
      "Séparer les deux colonnes : ce qui est sur le territoire national, ce qui ne l'est pas. Rien n'interdit de proposer en sus des postes situés à l'étranger, mais ils s'ajoutent, ils ne remplacent pas.",
      "Recalculer le nombre de bénéficiaires et le budget de l'obligation sur la seule colonne nationale.",
      "Si le retrait des offres étrangères vide la rubrique du reclassement interne, le plan est à compléter avant toute saisine — le point est traité par le contrôle du plan de reclassement.",
    ],
    verifs: [
      { cle: "con03Localisation", question: "Pour chaque mesure de reclassement, où sont situés les emplois visés ?", attendu: "La localisation, mesure par mesure." },
      { cle: "con03NationalSeul", question: "Combien de postes de reclassement le plan offre-t-il sur le seul territoire national ?", attendu: "Le nombre, après retrait des postes situés hors de France." },
    ],
  },

  "PSE-CTL-CHF-01": {
    gravite: 3,
    quoiFaire: "Doter chaque mesure du plan d'un budget, d'un nombre de bénéficiaires et d'une durée, avant la saisine de l'administration.",
    risque: "L'administration apprécie les mesures d'accompagnement au regard de l'importance du projet de licenciement et des moyens dont disposent l'entreprise, l'unité économique et sociale et le groupe (L. 1233-57-3, 1° et 2°). Une mesure non chiffrée n'est pas appréciable : elle ne pèse rien dans cette appréciation, et le plan est jugé sur ce qui reste.",
    delai: "Une à deux semaines si les données de gestion existent ; davantage si les coûts unitaires sont à établir.",
    document: "Tableau de chiffrage des mesures — budget, bénéficiaires, durée",
    etapes: [
      "Lister les mesures dépourvues de l'un des trois éléments : budget, nombre de bénéficiaires, durée.",
      "Pour chacune, établir le coût unitaire et le nombre de bénéficiaires attendus, et en déduire le budget. Une enveloppe globale sans base de calcul n'est pas un chiffrage.",
      "Fixer la durée de chaque mesure : la période pendant laquelle elle est ouverte, et non la durée d'un entretien.",
      "Reporter les totaux dans le budget du plan et vérifier que la somme des mesures et le total annoncé coïncident.",
      "Si le plan a déjà été présenté en dernière réunion, soumettre la version chiffrée au comité avant de déposer.",
    ],
    verifs: [
      { cle: "chf01Complet", question: "Combien de mesures le plan compte-t-il, et combien portent à la fois un budget, un nombre de bénéficiaires et une durée ?", attendu: "Les deux nombres, et le tableau qui les porte." },
      { cle: "chf01Unitaire", question: "Sur quelle base unitaire chaque budget est-il calculé ?", attendu: "Le coût unitaire et le nombre de bénéficiaires, mesure par mesure." },
    ],
  },

  "PSE-CTL-CHF-02": {
    gravite: 3,
    quoiFaire: "Faire coïncider le budget total annoncé et la somme des mesures, en corrigeant celui des deux qui est faux, puis présenter la version corrigée au comité.",
    risque: "Un plan dont le total ne correspond pas au détail se retourne contre celui qui le produit : c'est la première vérification faite en séance, et l'écart nourrit la contestation du chiffrage tout entier devant l'administration, qui apprécie les mesures d'accompagnement au regard de l'importance du projet (L. 1233-57-3, 2°).",
    delai: "Quelques jours pour le rapprochement ; une réunion si le plan doit être représenté.",
    document: "Rapprochement du budget total et du détail des mesures",
    etapes: [
      "Poser côte à côte le total annoncé et la somme ligne à ligne des budgets de mesures, et isoler l'écart.",
      "Déterminer d'où vient l'écart : une mesure oubliée dans le détail, une mesure comptée deux fois, une provision non ventilée, ou un total arrêté avant la dernière version du plan.",
      "Corriger la source de l'écart — et non le total, si c'est le détail qui est faux : un total ajusté à la main sur un détail erroné se voit à la ligne suivante.",
      "Republier le tableau des mesures et le total dans une même pièce, et la soumettre au comité si le plan avait déjà été présenté.",
    ],
    verifs: [
      { cle: "chf02Total", question: "Quel est le budget total annoncé du plan, et quelle est la somme des budgets de mesures ?", attendu: "Les deux montants, et leur écart s'il en subsiste un." },
      { cle: "chf02Origine", question: "Si un écart existait, d'où venait-il et comment a-t-il été corrigé ?", attendu: "L'explication, et la pièce corrigée." },
    ],
  },

  /* Le coût par salarié est une mesure, pas un verdict : aucun texte ne fixe le
     montant d'un plan, et le contrôle le dit lui-même. Il n'y a donc rien à
     régulariser au titre de ce contrôle — ce qui se corrige, c'est le chiffrage
     des mesures et les pièces versées, traités pour eux-mêmes. */
  "PSE-CTL-CAL-01": null,

  /* Même raison : le rapport entre le budget du plan et les moyens du groupe est
     calculé et affiché, il n'est jugé par aucun seuil. L'acte qui se fait
     — verser les comptes du groupe — relève du contrôle suivant. */
  "PSE-CTL-CAL-02": null,

  "PSE-CTL-CAL-03": {
    gravite: 4,
    quoiFaire: "Verser au dossier les comptes consolidés du groupe, avant le dépôt de la demande de validation ou d'homologation.",
    risque: "L'article L. 1233-57-3 fait des moyens dont disposent l'entreprise, l'unité économique et sociale et le groupe le premier critère d'appréciation du plan. À défaut de comptes, l'administration apprécie ces moyens sur ce dont elle dispose : l'employeur perd la main sur ce qui est retenu contre lui, sans pouvoir le reprocher à personne.",
    delai: "Quelques jours si les comptes sont publiés ; deux à trois semaines s'ils doivent être obtenus de la société mère.",
    document: "Comptes consolidés du groupe versés au dossier de demande",
    etapes: [
      "Identifier le périmètre : entreprise, unité économique et sociale s'il en existe une, groupe — ce sont les trois niveaux que l'article énumère.",
      "Réunir les comptes consolidés du dernier exercice clos et, s'ils existent, les comptes intermédiaires plus récents.",
      "Les joindre à la demande adressée à l'administration, et les mettre à disposition du comité social et économique dans le cadre de sa consultation.",
      "Écrire, dans une note du dossier, le rapport entre le budget du plan et ces moyens : le calcul appartient à l'employeur, l'appréciation à l'administration.",
    ],
    verifs: [
      { cle: "cal03Comptes", question: "Quels comptes du groupe sont versés au dossier, et sur quel exercice portent-ils ?", attendu: "La pièce et l'exercice, avec la date de clôture." },
      { cle: "cal03Perimetre", question: "Le dossier identifie-t-il l'entreprise, l'unité économique et sociale et le groupe ?", attendu: "Les trois niveaux, ou la mention expresse qu'il n'en existe pas." },
    ],
  },

  "PSE-CTL-ACC-01": {
    gravite: 3,
    quoiFaire: "Substituer au dispositif retenu celui que l'effectif commande — congé de reclassement à partir de mille salariés (L. 1233-71), contrat de sécurisation professionnelle en deçà (L. 1233-66) — et soumettre le plan ainsi corrigé au comité.",
    risque: "L'administration s'assure que l'employeur a prévu le recours au contrat de sécurisation professionnelle mentionné à l'article L. 1233-65 ou la mise en place du congé de reclassement mentionné à l'article L. 1233-71 (L. 1233-57-3, dernier alinéa). Les deux dispositifs ne se cumulent pas et ne se choisissent pas : le mauvais dispositif dans le plan est un motif de refus, et il ne se corrige pas par une note en séance.",
    delai: "Deux à trois semaines : le dispositif change le coût du plan et son calendrier.",
    document: "Volet accompagnement individuel du plan — dispositif dû et modalités",
    etapes: [
      "Arrêter l'effectif au niveau où le seuil se lit : l'entreprise, l'établissement, et le groupe lorsque l'entreprise en relève.",
      "En déduire le dispositif dû, et le seul : congé de reclassement au-dessus de mille salariés, contrat de sécurisation professionnelle en deçà.",
      "Réécrire le volet accompagnement du plan sur ce dispositif — durée, financement, moment de la proposition — et en tirer les conséquences sur le budget.",
      "Soumettre le plan corrigé au comité social et économique avant toute saisine de l'administration : le dispositif d'accompagnement fait partie des mesures sociales sur lesquelles il est consulté (L. 1233-30, I, 2°).",
    ],
    verifs: [
      { cle: "acc01Effectif", question: "Quel est l'effectif de l'entreprise, celui de l'établissement et, s'il y a lieu, celui du groupe, et à quelle date sont-ils arrêtés ?", attendu: "Les trois nombres et leur date d'arrêté." },
      { cle: "acc01Dispositif", question: "Quel dispositif le plan prévoit-il, et dans quelle page ?", attendu: "Le dispositif nommé, et un seul des deux." },
    ],
  },

  "PSE-CTL-ACC-02": {
    gravite: 3,
    quoiFaire: "Ramener la durée du congé de reclassement dans la limite de l'article L. 1233-71 — douze mois, vingt-quatre en cas de formation de reconversion professionnelle — ou verser au dossier la formation de reconversion qui justifie la durée retenue.",
    risque: "L'article L. 1233-71 plafonne la durée du congé : « La durée du congé de reclassement ne peut excéder douze mois, pouvant être portés à vingt-quatre mois en cas de formation de reconversion professionnelle. » Une durée annoncée hors de cette limite, sans la formation qui la justifie, est une stipulation que le plan ne peut pas tenir, et l'administration vérifie le respect des articles L. 1233-61 à L. 1233-63 comme la mise en place du congé (L. 1233-57-3).",
    delai: "Une semaine si la formation de reconversion existe et n'est que non documentée ; trois à quatre semaines s'il faut réécrire le parcours de formation.",
    document: "Volet congé de reclassement — durée, bilan de compétences, actions de formation, financement",
    etapes: [
      "Vérifier si le plan prévoit une formation de reconversion professionnelle : c'est elle, et elle seule, qui porte le plafond de douze à vingt-quatre mois.",
      "Si elle existe, la décrire au dossier — nature, organisme, durée, coût — et rattacher la durée du congé à cette formation.",
      "Si elle n'existe pas, ramener la durée à douze mois au plus et recalculer le budget du volet.",
      "Écrire les modalités que le texte attache au congé : il débute si nécessaire par un bilan de compétences, l'employeur finance l'ensemble des actions (L. 1233-71) ; il est pris pendant le préavis, que le salarié est dispensé d'exécuter, et lorsqu'il excède le préavis, le terme de celui-ci est reporté jusqu'à la fin du congé (L. 1233-72).",
      "Soumettre la version corrigée au comité avant la saisine.",
    ],
    verifs: [
      { cle: "acc02Duree", question: "Quelle durée de congé de reclassement le plan retient-il ?", attendu: "La durée en mois, telle qu'elle est écrite au plan." },
      { cle: "acc02Reconversion", question: "Si la durée dépasse douze mois, quelle formation de reconversion professionnelle la justifie ?", attendu: "La formation décrite au dossier — nature, organisme, durée." },
      { cle: "acc02Preavis", question: "Le plan prévoit-il que le congé est pris pendant le préavis et que le terme de celui-ci est reporté lorsque le congé l'excède ?", attendu: "La clause du plan reprenant L. 1233-72." },
    ],
  },

  "PSE-CTL-ACC-03": {
    gravite: 2,
    quoiFaire: "Refaire la proposition du contrat de sécurisation professionnelle après la notification de la décision de validation ou d'homologation : une proposition faite avant cette notification, lorsqu'un plan est dû, n'est pas celle que le texte prévoit et ne se rétrodate pas.",
    risque: "À défaut de proposition, France Travail propose le contrat au salarié, et l'employeur verse à l'organisme de gestion du régime d'assurance chômage une contribution égale à deux mois de salaire brut, portée à trois mois lorsque l'ancien salarié adhère sur proposition de cette institution (L. 1233-66). La contribution est due par salarié, et elle se recouvre comme les contributions d'assurance chômage.",
    delai: "Immédiat après la notification de la décision : la proposition précède la notification du licenciement.",
    document: "Proposition de contrat de sécurisation professionnelle — remise contre décharge datée",
    etapes: [
      "Attendre la notification par l'autorité administrative de sa décision de validation ou d'homologation : lorsque le licenciement donne lieu à un plan dans les conditions des articles L. 1233-24-2 et L. 1233-24-4, la proposition est faite après cette notification (L. 1233-66).",
      "Remettre à chaque salarié dont le licenciement est envisagé le document de proposition, contre décharge datée — c'est la décharge qui prouvera la proposition, pas le courrier type.",
      "Tenir le tableau nominatif des propositions : salarié, date de remise, date de réponse.",
      "Ne notifier les licenciements qu'après la décision administrative, l'article L. 1233-39 le commandant par ailleurs.",
      "Conserver les décharges : c'est sur elles que se règle la question de la contribution due à l'assurance chômage.",
    ],
    verifs: [
      { cle: "acc03DateDecision", question: "À quelle date l'autorité administrative a-t-elle notifié sa décision de validation ou d'homologation ?", attendu: "La date exacte, et la décision elle-même." },
      { cle: "acc03DateProposition", question: "À quelle date le contrat de sécurisation professionnelle a-t-il été proposé à chaque salarié ?", attendu: "Le tableau des dates, toutes postérieures à celle de la décision." },
      { cle: "acc03Decharges", question: "Où sont les décharges datées de remise du document de proposition ?", attendu: "Les décharges signées, salarié par salarié." },
    ],
  },

  "PSE-CTL-VOI-01": {
    gravite: 3,
    quoiFaire: "Arrêter la voie — accord collectif majoritaire ou document unilatéral — avant la première réunion du comité, et écrire ce choix au dossier.",
    risque: "La voie commande tout le calendrier : quinze jours d'instruction pour la validation de l'accord, vingt et un pour l'homologation du document unilatéral (L. 1233-57-4). Elle commande aussi ce que l'administration contrôle et le moment où le document est élaboré, celui-ci l'étant après la dernière réunion du comité (L. 1233-24-4). Une voie non arrêtée est un calendrier non arrêté, et la procédure se déroule alors sans échéance connue.",
    delai: "Une décision, prise avant l'ouverture de la procédure ; l'information de l'administration sur l'ouverture d'une négociation est due sans délai.",
    document: "Note de choix de la voie et calendrier prévisionnel de la procédure",
    etapes: [
      "Apprécier si un accord majoritaire est atteignable : il doit être signé par une ou plusieurs organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité, quel que soit le nombre de votants, ou par le conseil d'entreprise (L. 1233-24-1).",
      "Si la voie de l'accord est retenue, informer l'administration sans délai de l'ouverture de la négociation, comme le dernier alinéa de L. 1233-24-1 l'impose.",
      "Si la voie du document unilatéral est retenue, retenir qu'il est élaboré après la dernière réunion du comité et qu'il fixe le contenu du plan en précisant les éléments des 1° à 5° de l'article L. 1233-24-2 (L. 1233-24-4).",
      "Écrire le calendrier qui en découle : dates des réunions du comité, date de dépôt de la demande, échéance d'instruction de quinze ou vingt et un jours.",
    ],
    verifs: [
      { cle: "voi01Voie", question: "Quelle voie a été retenue, et à quelle date la décision a-t-elle été prise ?", attendu: "La voie nommée et la date, antérieure à la première réunion du comité." },
      { cle: "voi01InfoAdmin", question: "Si la voie de l'accord a été retenue, à quelle date l'administration a-t-elle été informée de l'ouverture de la négociation ?", attendu: "La date de l'information, due sans délai (L. 1233-24-1)." },
      { cle: "voi01Calendrier", question: "Quelles sont les dates prévues de première réunion, de dernière réunion et de dépôt de la demande ?", attendu: "Les trois dates." },
    ],
  },

  "PSE-CTL-VOI-02": {
    gravite: 3,
    quoiFaire: "Constater que l'accord signé en deçà de 50 % des suffrages n'existe pas comme accord majoritaire — il ne se complète pas après coup — et choisir : recueillir la signature d'organisations portant le total à 50 %, ou basculer sur le document unilatéral et reprendre la procédure à ce point.",
    risque: "L'article L. 1233-24-1 subordonne l'accord à la signature d'organisations ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité. En deçà, il n'y a pas d'accord au sens du texte : la demande de validation est sans objet, et le dossier repart sur la voie de l'homologation, dont le délai d'instruction est de vingt et un jours et non de quinze (L. 1233-57-4).",
    delai: "Deux à quatre semaines : le temps de reprendre la négociation, ou d'élaborer le document unilatéral après la dernière réunion du comité.",
    document: "Relevé des suffrages du premier tour des dernières élections et acte de choix de la voie",
    etapes: [
      "Reprendre le procès-verbal du premier tour des dernières élections des titulaires au comité et calculer le total des suffrages recueillis par les organisations signataires, le nombre de votants étant indifférent.",
      "Si le total est en deçà de 50 %, ne pas déposer la demande de validation : elle porterait sur un accord qui n'en est pas un.",
      "Soit rouvrir la négociation pour recueillir la signature d'une organisation qui porte le total à 50 % ou plus, soit, à défaut, élaborer le document unilatéral prévu à l'article L. 1233-24-4, qui se fait après la dernière réunion du comité et précise les éléments des 1° à 5° de l'article L. 1233-24-2.",
      "Refaire le calendrier sur le délai d'instruction de la voie retenue : quinze jours pour la validation, vingt et un pour l'homologation.",
      "Déposer la demande correspondant à la voie effectivement retenue, et à elle seule.",
    ],
    verifs: [
      { cle: "voi02Suffrages", question: "Quel pourcentage de suffrages les organisations signataires ont-elles recueilli au premier tour des dernières élections des titulaires ?", attendu: "Le pourcentage, et le procès-verbal des élections qui l'établit." },
      { cle: "voi02Signataires", question: "Quelles organisations ont signé, et à quelle date ?", attendu: "La liste des signataires et la date de signature." },
      { cle: "voi02VoieFinale", question: "Quelle demande a finalement été déposée — validation ou homologation — et à quelle date ?", attendu: "La demande déposée et sa date, cohérente avec la voie retenue." },
    ],
  },

  "PSE-CTL-VOI-03": {
    gravite: 3,
    quoiFaire: "Établir la date de réception du dossier complet, en déduire l'échéance d'instruction, et, si le silence a couru jusqu'à son terme, accomplir les actes que l'article L. 1233-57-4 met alors à la charge de l'employeur — le silence vaut acceptation, il ne dispense de rien.",
    risque: "Le délai est de quinze jours pour la validation à compter de la réception de l'accord, de vingt et un jours pour l'homologation à compter de la réception du document complet (L. 1233-57-4). Le silence gardé pendant ce délai vaut décision d'acceptation ; l'employeur transmet alors au comité — et, si la demande portait sur un accord, aux organisations syndicales représentatives signataires — une copie de la demande accompagnée de son accusé de réception. La décision, ou à défaut ces documents, ainsi que les voies et délais de recours, sont portés à la connaissance des salariés par affichage sur les lieux de travail ou par tout autre moyen conférant date certaine. Rien de tout cela ne se présume : ce sont ces actes qui font courir les recours.",
    delai: "Quinze ou vingt et un jours d'instruction selon la voie ; les actes qui suivent l'échéance se font dans les jours qui la suivent.",
    document: "Transmission au comité de la demande et de son accusé de réception, et affichage aux salariés",
    etapes: [
      "Retrouver l'accusé de réception du dossier : c'est la réception de la demande — de l'accord, ou du document complet — qui fait courir le délai, et non la date d'envoi.",
      "Calculer l'échéance : quinze jours pour la validation, vingt et un pour l'homologation.",
      "Si une décision a été notifiée, vérifier qu'elle l'a été dans ce délai, qu'elle est motivée, et qu'elle a été notifiée dans les mêmes délais au comité et, s'il y a lieu, aux organisations syndicales signataires.",
      "Si le délai s'est écoulé sans décision, transmettre au comité — et aux organisations signataires si la demande portait sur un accord — une copie de la demande accompagnée de son accusé de réception par l'administration.",
      "Porter à la connaissance des salariés la décision ou, à défaut, ces documents, ainsi que les voies et délais de recours, par affichage sur les lieux de travail ou par tout moyen conférant date certaine — et conserver la preuve de cette date.",
    ],
    verifs: [
      { cle: "voi03Reception", question: "À quelle date l'administration a-t-elle accusé réception du dossier complet ?", attendu: "L'accusé de réception et sa date." },
      { cle: "voi03Echeance", question: "Quelle est l'échéance du délai d'instruction, et de quinze ou de vingt et un jours s'agit-il ?", attendu: "La date d'échéance et le délai applicable à la voie retenue." },
      { cle: "voi03Decision", question: "Une décision a-t-elle été notifiée, à quelle date, et est-elle motivée ?", attendu: "La décision datée et motivée, ou la mention que le délai s'est écoulé sans décision." },
      { cle: "voi03Affichage", question: "À quelle date la décision — ou, à défaut, la demande et son accusé de réception — a-t-elle été portée à la connaissance des salariés, et par quel moyen ?", attendu: "La date certaine et le moyen employé, avec sa preuve." },
    ],
  },

  "PSE-CTL-VOI-04": {
    gravite: 3,
    quoiFaire: "Ne pas notifier, et suspendre toute notification déjà programmée, jusqu'à la notification de la décision administrative ou l'expiration du délai d'instruction — une lettre de licenciement déjà envoyée avant cette date ne se régularise pas : le texte frappe la rupture de nullité.",
    risque: "Dans les entreprises de cinquante salariés ou plus, lorsque le projet concerne dix salariés ou plus dans une même période de trente jours, l'employeur notifie le licenciement après la notification par l'autorité administrative de la décision de validation ou d'homologation, ou à l'expiration des délais prévus à l'article L. 1233-57-4. « Il ne peut procéder, à peine de nullité, à la rupture des contrats de travail avant la notification de cette décision d'homologation ou de validation ou l'expiration des délais » (L. 1233-39). La nullité n'est pas une irrégularité que l'on couvre : elle atteint la rupture elle-même.",
    delai: "Immédiat : c'est l'envoi qu'il faut arrêter, avant qu'il ne parte.",
    document: "Note de suspension des notifications et calendrier de notification postérieur à la décision",
    etapes: [
      "Arrêter sur-le-champ toute notification programmée et retirer les lettres du circuit d'envoi : le point de départ est la décision administrative, pas la fin de la consultation.",
      "Pour les lettres déjà expédiées avant la décision, ne pas tenter de les régulariser par un courrier rectificatif : constater la situation, ne pas exécuter la rupture, et arrêter avec le conseil de l'entreprise la conduite à tenir salarié par salarié.",
      "Attendre la notification de la décision de validation ou d'homologation, ou l'expiration des délais de l'article L. 1233-57-4.",
      "Ne notifier qu'ensuite, par lettre recommandée avec avis de réception, en respectant l'ordre : décision d'abord, proposition d'accompagnement individuel ensuite lorsqu'elle est due après la décision, notification enfin.",
      "Conserver, pour chaque salarié, la date de la décision et la date d'envoi de la lettre : c'est la comparaison de ces deux dates qui sera faite.",
    ],
    verifs: [
      { cle: "voi04DateDecision", question: "À quelle date la décision de validation ou d'homologation a-t-elle été notifiée à l'employeur, ou à quelle date le délai d'instruction a-t-il expiré ?", attendu: "La date, avec la décision ou l'accusé de réception de la demande." },
      { cle: "voi04DateEnvoi", question: "À quelle date la première lettre de notification de licenciement a-t-elle été expédiée ?", attendu: "La date d'expédition, avec la preuve de dépôt." },
      { cle: "voi04Aucune", question: "Aucune rupture n'a-t-elle été exécutée avant la date de la décision ou l'expiration des délais ?", attendu: "Le tableau des notifications, dates à l'appui." },
    ],
  },

  "PSE-CTL-SUI-01": {
    gravite: 3,
    quoiFaire: "Compléter le plan sur les trois obligations de l'article L. 1233-63 — modalités de suivi, consultation du comité, bilan à l'administration — avant la saisine, le suivi faisant partie de ce que l'administration contrôle.",
    risque: "L'article L. 1233-63 met trois obligations distinctes à la charge de l'employeur : le plan détermine les modalités de suivi de la mise en œuvre effective des mesures du plan de reclassement ; ce suivi fait l'objet d'une consultation régulière et détaillée du comité, dont l'avis est transmis à l'autorité administrative ; l'autorité administrative est associée au suivi et reçoit un bilan, établi par l'employeur, de la mise en œuvre effective du plan. L'administration vérifie le respect des articles L. 1233-61 à L. 1233-63 (L. 1233-57-3) : un plan muet sur son suivi est incomplet au regard du texte.",
    delai: "Une semaine : il s'agit d'écrire une clause et un calendrier, non de créer un dispositif.",
    document: "Clause de suivi du plan — commission, périodicité, avis du comité, bilan à l'administration",
    etapes: [
      "Écrire dans le plan les modalités de suivi de la mise en œuvre effective des mesures du plan de reclassement : qui suit, sur quels indicateurs, à quelle fréquence.",
      "Fixer le calendrier des consultations du comité sur ce suivi — le texte les veut régulières et détaillées — et prévoir la transmission de son avis à l'autorité administrative.",
      "Prévoir le bilan de la mise en œuvre effective du plan que l'employeur établit et que l'administration reçoit, et arrêter la date à laquelle il sera transmis.",
      "Soumettre la clause de suivi au comité avec le reste du plan, puis la verser au dossier de demande.",
    ],
    verifs: [
      { cle: "sui01Modalites", question: "Quelle clause du plan détermine les modalités de suivi, et que prévoit-elle ?", attendu: "La clause, avec les indicateurs et la périodicité." },
      { cle: "sui01Consultation", question: "À quelles dates le comité est-il consulté sur le suivi, et comment son avis est-il transmis à l'administration ?", attendu: "Le calendrier des consultations et le mode de transmission de l'avis." },
      { cle: "sui01Bilan", question: "À quelle date le bilan de la mise en œuvre effective du plan sera-t-il transmis à l'autorité administrative ?", attendu: "La date prévue, et l'auteur du bilan." },
    ],
  },

  "PSE-CTL-REM-01": {
    gravite: 4,
    quoiFaire: "Informer les représentants du personnel des postes disponibles et tenir le registre des demandes de priorité de réembauche — étant entendu qu'un poste déjà pourvu sans avoir été proposé au salarié qui avait demandé le bénéfice de la priorité ne se rattrape pas.",
    risque: "L'article L. 1233-45 met deux obligations distinctes à la charge de l'employeur : informer le salarié qui a demandé le bénéfice de la priorité de tout emploi devenu disponible et compatible avec sa qualification, et informer les représentants du personnel des postes disponibles. La seconde ne dépend d'aucune demande d'un salarié : elle est due par elle-même. La priorité court un an à compter de la rupture, et le salarié qui a acquis une nouvelle qualification en bénéficie aussi au titre de celle-ci s'il en informe l'employeur.",
    delai: "Immédiat pour l'information des élus ; le registre se tient ensuite au fil des postes, pendant l'année qui suit chaque rupture.",
    document: "Registre des demandes de priorité de réembauche et information périodique des représentants du personnel",
    etapes: [
      "Recenser les salariés licenciés dont la rupture remonte à moins d'un an, et parmi eux ceux qui ont demandé le bénéfice de la priorité au cours de ce délai.",
      "Ouvrir le registre : nom, date de rupture, date de la demande, qualification, et nouvelle qualification acquise si le salarié l'a signalée.",
      "Informer sans attendre les représentants du personnel des postes actuellement disponibles, et fixer la périodicité à laquelle cette information leur sera faite ensuite.",
      "Pour chaque poste devenu disponible, vérifier sa compatibilité avec la qualification des salariés inscrits au registre et informer ceux qui sont concernés, par écrit et de manière datée.",
      "Pour les postes déjà pourvus sans que cette information ait été faite, ne rien antidater : consigner la situation telle qu'elle est et arrêter la conduite à tenir avec le conseil de l'entreprise.",
    ],
    verifs: [
      { cle: "rem01Registre", question: "Combien de demandes de priorité de réembauche ont été reçues, et à quelles dates ?", attendu: "Le registre, avec les dates de rupture et les dates de demande." },
      { cle: "rem01Elus", question: "À quelle date les représentants du personnel ont-ils été informés des postes disponibles pour la dernière fois, et selon quelle périodicité le sont-ils ?", attendu: "La date et la périodicité, avec la pièce transmise." },
      { cle: "rem01Postes", question: "Quels postes sont devenus disponibles depuis la première rupture, et lesquels ont été proposés aux salariés inscrits au registre ?", attendu: "La liste des postes et, pour chacun, la proposition datée ou le motif d'incompatibilité." },
    ],
  },

  "PSE-CTL-CSE-01": {
    gravite: 3,
    quoiFaire: "Reprendre la consultation au point où l'exigence n'a pas été tenue : tenir la seconde réunion, ou la réunion qui rétablit l'espacement d'au moins quinze jours — un espacement trop court ne se corrige pas sur le procès-verbal, il se corrige en tenant la réunion.",
    risque: "L'article L. 1233-30, I impose que le comité tienne au moins deux réunions espacées d'au moins quinze jours. L'administration vérifie la régularité de la procédure d'information et de consultation du comité (L. 1233-57-3) : une consultation qui n'a pas respecté ce rythme est irrégulière, et la décision qui l'homologue ou la valide encourt l'annulation. C'est l'irrégularité la plus visible du dossier, parce qu'elle se lit sur deux dates.",
    delai: "Au moins quinze jours : c'est l'espacement lui-même qu'il faut laisser courir.",
    document: "Convocation à la réunion de reprise et procès-verbaux des réunions du comité",
    etapes: [
      "Poser les dates des réunions déjà tenues et mesurer l'écart entre chacune : c'est l'écart qui est en cause, pas le nombre de points à l'ordre du jour.",
      "Si une seule réunion s'est tenue, convoquer la seconde — celle où l'avis se rend — en respectant l'espacement d'au moins quinze jours depuis la première.",
      "Si deux réunions ont été tenues à moins de quinze jours d'intervalle, tenir une nouvelle réunion à plus de quinze jours de la précédente et y reprendre la consultation sur les points concernés : la première réunion trop rapprochée ne se déplace pas.",
      "Mettre à l'étude les suggestions relatives aux mesures sociales envisagées et les propositions alternatives formulées par le comité, et y donner une réponse motivée (L. 1233-33) : c'est ce qui donne son objet à l'espacement.",
      "Ne saisir l'administration qu'une fois ce rythme rétabli, et joindre les procès-verbaux datés.",
    ],
    verifs: [
      { cle: "cse01Dates", question: "À quelles dates exactes les réunions du comité sur le projet se sont-elles tenues ?", attendu: "La liste des dates, dans l'ordre." },
      { cle: "cse01Ecarts", question: "Quel est l'écart en jours entre chaque réunion et la précédente ?", attendu: "Les écarts, tous d'au moins quinze jours." },
      { cle: "cse01Reponses", question: "Quelles suggestions et propositions alternatives le comité a-t-il formulées, et où sont les réponses motivées ?", attendu: "Les propositions et les réponses écrites, datées (L. 1233-33)." },
    ],
  },

  "PSE-CTL-CSE-02": {
    gravite: 3,
    quoiFaire: "Arrêter la date d'expiration du délai d'avis à partir de la date de la première réunion, et verser au dossier l'accord qui fixe des délais différents lorsqu'il en existe un — à défaut, c'est le plafond légal qui s'applique.",
    risque: "Le comité rend ses deux avis dans un délai qui ne peut excéder, à compter de la date de sa première réunion, deux mois lorsque le nombre de licenciements est inférieur à cent, trois mois lorsqu'il est au moins égal à cent et inférieur à deux cent cinquante, quatre mois lorsqu'il est au moins égal à deux cent cinquante ; une convention ou un accord collectif peut prévoir des délais différents, et à défaut d'avis dans le délai le comité est réputé avoir été consulté (L. 1233-30, II). Un accord invoqué mais non versé n'est opposable à personne : ni l'administration ni l'application ne peuvent vérifier le délai que l'employeur applique.",
    delai: "Quelques jours pour verser l'accord et poser le calendrier ; le délai d'avis lui-même court de la première réunion.",
    document: "Calendrier de consultation — première réunion, délai applicable, date d'expiration",
    etapes: [
      "Fixer la date de la première réunion au cours de laquelle le comité est consulté sur l'opération projetée et sur le projet de licenciement collectif : c'est d'elle que court le délai.",
      "Déterminer le délai applicable au nombre de licenciements envisagés — deux, trois ou quatre mois selon les tranches de L. 1233-30, II.",
      "Si un accord ou une convention fixe des délais différents, le verser au dossier et y renvoyer expressément ; sans cette pièce, le plafond légal reste la seule référence.",
      "Écrire la date d'expiration du délai et la porter au calendrier remis au comité.",
      "Recueillir les deux avis avant ce terme ; à défaut, constater que le comité est réputé consulté, ce qui ne dispense pas d'avoir tenu les réunions ni d'avoir répondu à ses propositions.",
    ],
    verifs: [
      { cle: "cse02Premiere", question: "À quelle date exacte s'est tenue la première réunion au cours de laquelle le comité a été consulté sur l'opération et sur le projet de licenciement ?", attendu: "La date, avec la convocation et le procès-verbal." },
      { cle: "cse02Delai", question: "Quel délai d'avis s'applique, et pourquoi — nombre de licenciements envisagés, ou accord fixant un délai différent ?", attendu: "Le délai en mois et sa source ; si c'est un accord, l'accord versé au dossier." },
      { cle: "cse02Avis", question: "À quelles dates les deux avis du comité ont-ils été rendus ?", attendu: "Les dates des avis, ou le constat daté qu'ils n'ont pas été rendus dans le délai." },
    ],
  },

  "PSE-CTL-CSE-03": {
    gravite: 3,
    quoiFaire: "Verser au dossier la délibération du comité désignant l'expert avec sa date, et tenir les délais d'échange que l'article L. 1233-35 impose — une désignation postérieure à la première réunion ne se rétrodate pas, et le délai d'avis n'en est pas prolongé.",
    risque: "L'article L. 1233-34 place la décision de recourir à l'expertise à la première réunion prévue à l'article L. 1233-30. Une désignation postérieure expose la procédure à la contestation devant l'administration, qui vérifie la régularité de l'information et de la consultation du comité (L. 1233-57-3), sans que le délai d'avis en soit allongé pour autant : le calendrier reste celui de L. 1233-30, II. Le rapport de l'expert est remis au comité — et, le cas échéant, aux organisations syndicales — au plus tard quinze jours avant l'expiration de ce délai.",
    delai: "Dix jours pour la demande d'informations de l'expert, huit jours pour la réponse de l'employeur ; le rapport est dû quinze jours avant l'expiration du délai d'avis.",
    document: "Délibération de désignation de l'expert et journal des échanges d'informations",
    etapes: [
      "Verser au dossier la délibération du comité et sa date, ainsi que le procès-verbal de la réunion au cours de laquelle elle a été prise : la date est ce qu'elle est, et elle sera lue.",
      "Répondre dans les huit jours à la demande d'informations que l'expert adresse dans les dix jours de sa désignation, puis dans les huit jours à toute demande complémentaire formulée dans les dix jours (L. 1233-35).",
      "Tenir le journal daté de ces échanges : demande, date, réponse, date — c'est lui qui établira que les délais ont été tenus.",
      "Arrêter la date à laquelle le rapport doit être remis : au plus tard quinze jours avant l'expiration du délai de l'article L. 1233-30, et la porter au calendrier.",
      "Ne pas différer la saisine de l'administration au motif de l'expertise : le délai d'avis n'est pas prolongé par elle.",
    ],
    verifs: [
      { cle: "cse03Designation", question: "À quelle date le comité a-t-il décidé de recourir à l'expertise, et à quelle réunion ?", attendu: "La date de la délibération et le procès-verbal de la réunion correspondante." },
      { cle: "cse03Echanges", question: "À quelles dates l'expert a-t-il demandé des informations et à quelles dates l'employeur a-t-il répondu ?", attendu: "Le journal daté des demandes et des réponses — dix jours pour demander, huit pour répondre." },
      { cle: "cse03Rapport", question: "À quelle date le rapport de l'expert a-t-il été remis au comité, et le cas échéant aux organisations syndicales ?", attendu: "La date de remise, au plus tard quinze jours avant l'expiration du délai d'avis." },
    ],
  },

  "PSE-CTL-COH-01": {
    gravite: 3,
    quoiFaire: "Reprendre le décompte des licenciements envisagés et le nombre de bénéficiaires des mesures individuelles jusqu'à ce que les deux soient cohérents, puis corriger celle des deux pièces qui est fausse.",
    risque: "Le reclassement interne (L. 1233-62, 1°), le soutien à la création ou à la reprise d'activités par les salariés (4°) et la formation ou la reconversion (5°) s'adressent aux salariés dont le licenciement est envisagé. Une mesure individuelle qui vise plus de bénéficiaires qu'il n'y a de licenciements signale que l'un des deux chiffres est faux — et les deux emportent des conséquences : le nombre de licenciements commande le délai d'avis du comité (L. 1233-30, II), et le chiffrage commande l'appréciation des mesures d'accompagnement au regard de l'importance du projet (L. 1233-57-3, 2°).",
    delai: "Une semaine : c'est un rapprochement de deux décomptes, mais il peut déplacer le calendrier.",
    document: "Rapprochement du décompte des licenciements et des bénéficiaires des mesures individuelles",
    etapes: [
      "Reprendre le décompte des licenciements envisagés sur une même période de trente jours, en y intégrant, s'il y a lieu, les refus de modification d'un élément essentiel du contrat proposée pour un motif économique (L. 1233-25) et la règle des licenciements successifs de l'article L. 1233-26.",
      "Reprendre le nombre de bénéficiaires de chaque mesure relevant des rubriques 1°, 4° et 5°, qui visent les salariés dont le licenciement est envisagé.",
      "Corriger le chiffre qui est faux — et non celui qui est le plus commode : si c'est le décompte des licenciements, tout le calendrier de consultation s'en trouve déplacé et doit être refait.",
      "Vérifier ensuite que les mesures collectives — reprise d'activité, création d'activités nouvelles, bassin d'emploi, temps de travail — restent identifiées comme telles : elles peuvent légitimement viser au-delà du nombre de licenciements.",
      "Reporter les corrections dans le tableau des mesures, dans le budget total et dans le calendrier, puis présenter la version corrigée au comité si elle intervient après une réunion.",
    ],
    verifs: [
      { cle: "coh01Licenciements", question: "Combien de licenciements sont envisagés sur une même période de trente jours, et sur quelle période exactement ?", attendu: "Le nombre et les deux dates qui bornent la période." },
      { cle: "coh01Beneficiaires", question: "Pour chaque mesure des rubriques 1°, 4° et 5°, combien de bénéficiaires sont annoncés ?", attendu: "Le nombre, mesure par mesure, aucun n'excédant le nombre de licenciements." },
      { cle: "coh01Calendrier", question: "Si le décompte des licenciements a changé, le délai d'avis du comité et le calendrier ont-ils été refaits ?", attendu: "Le calendrier corrigé, avec la nouvelle date d'expiration du délai." },
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
const CLES = new Map();
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
      /* Une clé qui sert deux fois écrase la réponse de l'autre : la page range
         les réponses par clé, et rien ne l'avertirait. */
      else if (CLES.has(v.cle))
        ECARTS.push(`${id} : la clé « ${v.cle} » sert déjà dans ${CLES.get(v.cle)}`);
      else CLES.set(v.cle, id);
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
