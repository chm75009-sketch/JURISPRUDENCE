/* Ce qu'il faut faire quand un contrôle du licenciement économique ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger, et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   UNE PARTICULARITÉ DE CE MODULE, ET ELLE COMMANDE TOUT LE FICHIER.

   La plupart des obligations du licenciement économique s'apprécient au jour de
   la notification. Une offre de reclassement adressée après la lettre, un état
   des postes redaté, une réunion du comité tenue après coup ne régularisent
   rien : ils ne font qu'ajouter une pièce postérieure à un acte antérieur. Il
   n'y a alors que deux issues honnêtes, et ce sont les seules que ce fichier
   écrive : reprendre la procédure avant notification tant que la lettre n'est
   pas partie, ou constater que le grief est constitué et le traiter comme tel.
   Aucune entrée ne promet un rattrapage que le texte ne permet pas.

   Les articles cités ont été lus à la source : ils figurent dans textes_eco.json
   avec leur identifiant de version, ou dans le champ « fondement » du contrôle
   auquel l'entrée répond. Aucun autre n'est cité. */

const { C } = require("./controles.js");

/* Les quatre degrés, nommés une fois pour toutes. Ils sont communs à tous les
   modules du dépôt : c'est l'ordre dans lequel le guide fait traiter les
   manquements, non l'ordre du montant encouru. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — le licenciement peut être jugé sans cause réelle et sérieuse ou nul",
  4: "Régularisation rapide",
};

const R = {

  /* ---------------- RECLASSEMENT ----------------
     L'article L. 1233-4 subordonne le licenciement à ce que « tous les efforts
     de formation et d'adaptation aient été réalisés » et que le reclassement
     « ne puisse être opéré » : ce sont des conditions du licenciement, pas des
     formalités qui l'accompagnent. Elles se vérifient au jour où la lettre
     part. D'où la forme constante des entrées qui suivent. */

  "CTL-REC-01": {
    gravite: 3,
    quoiFaire: "Établir, dater et signer l'état des postes disponibles société par société, avant d'adresser la moindre offre — et si la notification est déjà partie, verser l'état tel qu'il existait à cette date, sans le reconstituer après coup.",
    risque: "Sans état daté, la recherche de reclassement n'est pas prouvée. La charge de la preuve pèse sur l'employeur : le licenciement est alors jugé sans cause réelle et sérieuse, et l'indemnité relève du barème de L. 1235-3.",
    delai: "Une à deux semaines selon le nombre de sociétés à interroger.",
    document: "État daté des postes disponibles, société par société",
    etapes: [
      "Arrêter la date à laquelle l'état est établi : c'est elle qui devra être antérieure à la notification (contrôle CTL-REC-06).",
      "Recenser, pour chaque société du périmètre de permutation de L. 1233-4, les emplois disponibles — vacants, créés, libérés par un départ — avec leur intitulé, leur localisation et leur classification.",
      "Faire signer l'état par celui qui l'a établi, et conserver les réponses écrites de chaque société, y compris les réponses négatives.",
      "Verser l'état au dossier avant d'adresser les offres : c'est lui qui datera la recherche.",
    ],
    verifs: [
      { cle: "rec01Etat", question: "Quelle est la date portée sur l'état des postes disponibles, et qui l'a signé ?", attendu: "L'état lui-même, daté et signé. Une liste sans date ne prouve aucune recherche." },
      { cle: "rec01Societes", question: "Quelles sociétés du périmètre l'état couvre-t-il, et combien de postes y sont recensés ?", attendu: "La liste des sociétés interrogées et le nombre de postes, société par société." },
    ],
  },

  "CTL-REC-02": {
    gravite: 3,
    quoiFaire: "Interroger chaque société française du périmètre de permutation et conserver sa réponse écrite, même négative — une société non interrogée n'est pas une société sans poste.",
    risque: "L. 1233-4 fixe le périmètre de recherche à l'entreprise et aux autres entreprises du groupe dont l'organisation, les activités ou le lieu d'exploitation assurent la permutation de tout ou partie du personnel. Une société du périmètre laissée de côté suffit à faire tomber le licenciement pour absence de cause réelle et sérieuse.",
    delai: "Deux à trois semaines : il faut écrire à chaque société et attendre les réponses.",
    document: "Lettres d'interrogation des sociétés du périmètre et réponses reçues",
    etapes: [
      "Délimiter le périmètre de permutation au sens de L. 1233-4 : les entreprises du groupe dont l'organisation, les activités ou le lieu d'exploitation permettent la permutation du personnel, situées sur le territoire national.",
      "Écrire à chacune, en datant l'envoi, et demander l'état de ses postes disponibles.",
      "Conserver chaque réponse, y compris « aucun poste disponible » : c'est cette réponse-là qui atteste que la société a été interrogée.",
      "Reporter les réponses dans l'état des postes, société par société, avant d'adresser les offres.",
    ],
    verifs: [
      { cle: "rec02Perimetre", question: "Quelles sociétés composent le périmètre de permutation retenu, et sur quoi repose ce découpage ?", attendu: "La liste nominative, et ce qui justifie l'inclusion ou l'exclusion de chacune." },
      { cle: "rec02Reponses", question: "Pour chaque société du périmètre, où est la réponse écrite, et à quelle date a-t-elle été reçue ?", attendu: "Une réponse datée par société. Une absence de réponse n'est pas une absence de poste." },
    ],
  },

  "CTL-REC-03": {
    gravite: 3,
    quoiFaire: "Reprendre chaque offre pour qu'elle porte les six mentions du II de l'article D. 1233-2-1, et l'adresser par un moyen conférant date certaine — si les offres incomplètes ont déjà été adressées et la notification faite, l'irrégularité est acquise et ne se répare pas.",
    risque: "L'offre incomplète n'est pas une offre : le poste est réputé n'avoir pas été proposé, et l'obligation de reclassement n'est pas satisfaite. Le licenciement est alors sans cause réelle et sérieuse.",
    delai: "Quelques jours si les postes sont déjà recensés ; le délai de réponse laissé au salarié s'y ajoute.",
    document: "Offre de reclassement écrite — les six mentions de D. 1233-2-1",
    etapes: [
      "Reprendre offre par offre et pointer les six mentions du II de D. 1233-2-1 : intitulé du poste et son descriptif, nom de l'employeur, nature du contrat de travail, localisation du poste, niveau de rémunération, classification du poste.",
      "Compléter les offres incomplètes et les réadresser avant toute notification.",
      "Les adresser par tout moyen permettant de conférer date certaine, comme l'exige le I du même article, et conserver la preuve d'envoi.",
      "Rouvrir un délai de réponse à compter de la nouvelle offre : une offre complétée est une offre nouvelle.",
    ],
    verifs: [
      { cle: "rec03Mentions", question: "Pour chaque offre adressée, les six mentions de D. 1233-2-1 y figurent-elles toutes ?", attendu: "Une copie d'offre, mention par mention." },
      { cle: "rec03DateCertaine", question: "Par quel moyen chaque offre a-t-elle été adressée, et où est la preuve de date certaine ?", attendu: "L'accusé de réception ou la décharge, offre par offre." },
    ],
  },

  "CTL-REC-04": {
    gravite: 3,
    quoiFaire: "Faire établir et dater une attestation d'absence de poste disponible, adossée à un état des effectifs et des mouvements — l'absence de poste se justifie, elle ne se déclare pas.",
    risque: "L'employeur ne manque pas à son obligation s'il justifie de l'absence de poste disponible ; c'est cette justification, et non l'affirmation, qui le protège. Sans elle, le licenciement est jugé sans cause réelle et sérieuse.",
    delai: "Une semaine.",
    document: "Attestation datée d'absence de poste disponible, appuyée sur l'état des effectifs et des mouvements",
    etapes: [
      "Extraire, à date, l'état des effectifs et des mouvements de personnel de chaque société du périmètre : entrées, sorties, postes ouverts, postes pourvus.",
      "Établir l'attestation d'absence de poste en la datant et en renvoyant à ces pièces.",
      "La faire signer par une personne en mesure de la vérifier, et la verser au dossier avant la notification.",
      "Refaire l'exercice si la procédure se prolonge : un poste peut se libérer entre l'attestation et la lettre.",
    ],
    verifs: [
      { cle: "rec04Attestation", question: "À quelle date l'attestation d'absence de poste a-t-elle été établie, et par qui ?", attendu: "L'attestation, datée et signée." },
      { cle: "rec04Appui", question: "Sur quelles pièces l'attestation s'appuie-t-elle ?", attendu: "L'état des effectifs et des mouvements, ou le registre du personnel, joint à l'attestation." },
    ],
  },

  "CTL-REC-05": {
    gravite: 3,
    quoiFaire: "Documenter les actions de formation et d'adaptation proposées, avec la réponse de chaque salarié, ou motiver par écrit pourquoi aucune n'était possible.",
    risque: "L. 1233-4 ne permet le licenciement que lorsque tous les efforts de formation et d'adaptation ont été réalisés. Ces efforts non établis, la condition n'est pas remplie et le licenciement est sans cause réelle et sérieuse. Lorsque la cause invoquée est la mutation technologique, c'est le terrain même du litige.",
    delai: "Deux semaines pour documenter ; davantage si des actions restent à proposer.",
    document: "Tableau des actions de formation et d'adaptation proposées, salarié par salarié, avec les réponses",
    etapes: [
      "Lister, salarié par salarié, les actions de formation ou d'adaptation proposées, avec leur date, leur objet et leur durée.",
      "Y joindre la réponse du salarié — acceptation, refus, silence — datée.",
      "Pour les salariés sans action proposée, écrire pourquoi : le poste visé n'existe pas, la formation excède l'adaptation au poste, aucune permutation n'est possible.",
      "Verser l'ensemble au dossier avant la notification : après elle, la liste ne fait qu'attester ce qui n'a pas été fait.",
    ],
    verifs: [
      { cle: "rec05Actions", question: "Quelles actions de formation ou d'adaptation ont été proposées, à qui, et à quelles dates ?", attendu: "Le tableau nominatif, daté." },
      { cle: "rec05Reponses", question: "Où sont les réponses des salariés à ces propositions ?", attendu: "Les réponses écrites, ou le constat daté du silence." },
    ],
  },

  "CTL-REC-06": {
    gravite: 3,
    quoiFaire: "Vérifier que l'état des postes est antérieur à la notification, et si la notification est déjà partie avec un état postérieur, s'abstenir de le redater : le grief est constitué et se traite comme tel.",
    risque: "Le reclassement s'apprécie au jour du licenciement. Un état des postes postérieur à la lettre ne prouve pas la recherche : il prouve qu'elle n'était pas faite. Le licenciement est alors sans cause réelle et sérieuse.",
    delai: "Immédiat : c'est une date à contrôler, non une pièce à produire.",
    document: null,
    etapes: [
      "Relever la date portée sur l'état des postes et celle de la notification.",
      "Si la notification n'est pas partie, refaire l'état à une date antérieure et n'expédier la lettre qu'ensuite.",
      "Si elle est partie, ne pas antidater ni reconstituer : verser l'état tel qu'il est, et documenter séparément ce que la recherche avait réellement couvert avant la lettre.",
      "Porter le point à la connaissance du conseil de l'entreprise : c'est une irrégularité acquise, elle se plaide, elle ne se corrige pas.",
    ],
    verifs: [
      { cle: "rec06DateEtat", question: "Quelle date porte l'état des postes disponibles ?", attendu: "La date, lue sur la pièce." },
      { cle: "rec06DateLettre", question: "Quelle est la date de notification des licenciements ?", attendu: "La date de la lettre, et la preuve d'envoi." },
    ],
  },

  "CTL-REC-07": {
    gravite: 3,
    quoiFaire: "Proposer les postes recensés comme disponibles qui n'ont fait l'objet d'aucune offre, ou motiver poste par poste leur exclusion — et le faire avant la notification, car après elle un poste omis reste omis.",
    risque: "Un poste disponible non proposé, sans motif d'exclusion, établit à lui seul le manquement à l'obligation de reclassement de L. 1233-4 : le licenciement est sans cause réelle et sérieuse.",
    delai: "Une semaine pour les offres, plus le délai de réponse laissé au salarié.",
    document: "Offres complémentaires et tableau des motifs d'exclusion, poste par poste",
    etapes: [
      "Rapprocher l'état des postes disponibles de la liste des offres réellement adressées, poste par poste.",
      "Pour chaque poste sans offre, décider : soit l'offrir, soit écrire le motif d'exclusion — poste non disponible à la date utile, qualification hors de portée d'une adaptation, poste déjà pourvu.",
      "Adresser les offres complémentaires par un moyen conférant date certaine, avec les six mentions de D. 1233-2-1.",
      "Ne notifier qu'après l'expiration du délai de réponse ouvert par ces offres.",
    ],
    verifs: [
      { cle: "rec07Rapprochement", question: "Combien de postes figurent à l'état des postes disponibles, et combien ont fait l'objet d'une offre ?", attendu: "Les deux nombres, et le rapprochement poste par poste." },
      { cle: "rec07Exclusions", question: "Pour chaque poste non proposé, quel motif d'exclusion est écrit au dossier ?", attendu: "Le motif, poste par poste. Un poste sans motif est un poste omis." },
    ],
  },

  "CTL-REC-08": {
    gravite: 3,
    quoiFaire: "Adresser à chaque salarié concerné une offre écrite et personnalisée par un moyen conférant date certaine, ou diffuser une liste conforme au III de D. 1233-2-1 ; ne pas notifier tant qu'un salarié n'a rien reçu.",
    risque: "L. 1233-4 impose d'adresser les offres de manière personnalisée à chaque salarié ou de diffuser une liste des postes disponibles. Un salarié qui n'a reçu ni l'une ni l'autre n'a pas été mis en mesure de se reclasser : son licenciement est sans cause réelle et sérieuse.",
    delai: "Une semaine pour adresser, plus le délai de réponse — au moins quinze jours francs pour une liste diffusée, quatre en redressement ou liquidation judiciaire (D. 1233-2-1, III).",
    document: "Offres personnalisées, ou liste diffusée des postes disponibles avec critères de départage et délai de réponse",
    etapes: [
      "Dresser la liste nominative des salariés dont le licenciement est envisagé.",
      "Vérifier, nom par nom, qu'une offre personnalisée leur a été adressée, ou que la liste des postes leur a été diffusée.",
      "Pour les salariés sans destinataire identifié, adresser l'offre par un moyen conférant date certaine (D. 1233-2-1, I).",
      "Si la voie de la liste est retenue, y faire figurer les critères de départage en cas de candidatures multiples et le délai de candidature, que le III de D. 1233-2-1 impose.",
      "N'expédier aucune lettre de licenciement avant l'expiration de ce délai.",
    ],
    verifs: [
      { cle: "rec08Destinataires", question: "Combien de salariés sont concernés, et combien sont destinataires d'au moins une offre ou de la liste ?", attendu: "Les deux nombres, et la liste nominative des destinataires." },
      { cle: "rec08Preuve", question: "Par quel moyen conférant date certaine chaque envoi a-t-il été fait ?", attendu: "Les accusés de réception ou décharges, salarié par salarié." },
    ],
  },

  "CTL-REC-09": {
    gravite: 3,
    quoiFaire: "Indiquer dans chaque offre le délai de réponse et le moyen de répondre, avant de l'adresser.",
    risque: "Sans délai identifiable, le silence du salarié ne peut pas lui être opposé comme un refus : le poste reste réputé non refusé, et l'obligation de reclassement n'est pas soldée. Pour une liste diffusée, D. 1233-2-1 fixe le plancher — quinze jours francs, quatre en redressement ou liquidation judiciaire — et précise que l'absence de candidature écrite à l'issue de ce délai vaut refus.",
    delai: "Quelques jours ; le délai laissé au salarié court ensuite.",
    document: "Offre de reclassement mentionnant le délai et le moyen de réponse",
    etapes: [
      "Fixer le délai de réponse et le moyen par lequel le salarié répond, et les faire figurer dans le corps de l'offre.",
      "Pour une liste diffusée, respecter le plancher du III de D. 1233-2-1 et compter les jours francs à partir de la publication.",
      "Réadresser les offres muettes sur ce point, en rouvrant le délai.",
      "Consigner les réponses reçues et la date d'expiration du délai pour ceux qui n'ont pas répondu.",
    ],
    verifs: [
      { cle: "rec09Delai", question: "Quel délai de réponse chaque offre indique-t-elle, et à compter de quelle date ?", attendu: "Le délai écrit dans l'offre et son point de départ." },
      { cle: "rec09Moyen", question: "Par quel moyen le salarié devait-il répondre, et où sont les réponses reçues ?", attendu: "Le moyen indiqué dans l'offre et les réponses, datées." },
    ],
  },

  "CTL-REC-10": {
    gravite: 3,
    quoiFaire: "Recueillir l'accord exprès et écrit du salarié avant toute proposition de poste de catégorie inférieure ; si la proposition est déjà partie sans cet accord, ne pas la régulariser après coup mais reprendre la proposition.",
    risque: "L. 1233-4 réserve le reclassement sur un emploi de catégorie inférieure à l'accord exprès du salarié. Sans cet accord, la proposition ne vaut pas offre de reclassement : elle ne décharge de rien et peut être opposée comme une dégradation imposée.",
    delai: "Quelques jours.",
    document: "Recueil de l'accord exprès du salarié sur un reclassement de catégorie inférieure",
    etapes: [
      "Identifier les offres portant sur un emploi de catégorie inférieure à celui occupé.",
      "Écrire au salarié pour lui demander s'il accepte que des postes de catégorie inférieure lui soient proposés, avant de les lui proposer.",
      "Conserver l'accord écrit, daté, ou le refus.",
      "N'adresser l'offre de catégorie inférieure qu'aux salariés ayant donné cet accord ; retirer les autres du décompte des offres.",
    ],
    verifs: [
      { cle: "rec10Inferieures", question: "Quelles offres portent sur un emploi de catégorie inférieure, et à quels salariés ?", attendu: "La liste des offres et de leurs destinataires." },
      { cle: "rec10Accord", question: "Pour chacun, où est l'accord exprès et écrit, et à quelle date a-t-il été donné ?", attendu: "L'accord écrit, antérieur à la proposition." },
    ],
  },

  "CTL-REC-11": {
    gravite: 3,
    quoiFaire: "Adosser l'absence de poste à des pièces extérieures à la direction — registre du personnel, organigramme daté, extraction de la base de gestion des ressources humaines — plutôt qu'à une attestation que l'employeur se délivre à lui-même.",
    risque: "Une attestation interne est une affirmation de l'employeur sur lui-même : elle ne renverse pas la charge de la preuve qui pèse sur lui, et le manquement à l'obligation de reclassement de L. 1233-4 reste constitué faute de justification.",
    delai: "Une semaine.",
    document: "Pièces extérieures établissant l'absence de poste : registre du personnel, extraction datée, organigramme",
    etapes: [
      "Extraire le registre unique du personnel et l'état des mouvements sur la période de recherche.",
      "Y joindre l'organigramme daté et, s'il existe, un état des postes ouverts au recrutement dans le groupe.",
      "Faire établir l'attestation par une personne distincte de celle qui décide du licenciement, ou par un tiers.",
      "Verser l'ensemble avant la notification, et le conserver en vue d'un litige : c'est sur ces pièces que la recherche sera appréciée.",
    ],
    verifs: [
      { cle: "rec11Auteur", question: "Qui a établi l'attestation d'absence de poste, et quelle est sa fonction ?", attendu: "Le nom et la qualité. Une attestation signée de la seule direction ne vaut pas justification." },
      { cle: "rec11Pieces", question: "Quelles pièces extérieures appuient l'absence de poste, et quelles dates portent-elles ?", attendu: "Le registre, l'extraction ou l'organigramme, datés." },
    ],
  },

  "CTL-REC-12": {
    gravite: 3,
    quoiFaire: "Retirer du décompte les offres émanant de sociétés non établies sur le territoire national et rechercher les postes disponibles en France ; les offres déjà adressées à l'étranger ne comptent pas et ne se rattrapent pas après la notification.",
    risque: "Depuis l'ordonnance du 22 septembre 2017, L. 1233-4 limite le reclassement aux emplois « situés sur le territoire national ». Une offre à l'étranger ne satisfait pas l'obligation : le salarié qui n'a reçu que celles-là est réputé n'avoir reçu aucune offre, et son licenciement est sans cause réelle et sérieuse.",
    delai: "Une à deux semaines : il faut rouvrir la recherche sur le périmètre national.",
    document: "État des postes disponibles limité au territoire national",
    etapes: [
      "Identifier les sociétés du groupe non établies sur le territoire national et écarter leurs postes du décompte.",
      "Vérifier si la date de notification est antérieure au 24 septembre 2017 : la limitation au territoire national ne lui serait pas opposable, et le contrôle le dit lui-même.",
      "Reprendre la recherche sur les seules sociétés françaises du périmètre de permutation.",
      "Adresser les offres correspondantes avant toute notification, et refaire le décompte des salariés servis.",
    ],
    verifs: [
      { cle: "rec12Etrangeres", question: "Quelles sociétés du groupe ne sont pas établies sur le territoire national ?", attendu: "La liste nominative, avec le pays d'établissement." },
      { cle: "rec12OffresFrance", question: "Combien d'offres émanent de sociétés françaises, et à quels salariés ont-elles été adressées ?", attendu: "Le décompte, offres à l'étranger retirées." },
    ],
  },

  /* ---------------- EMPLOI ---------------- */

  "CTL-EMP-01": {
    gravite: 3,
    quoiFaire: "Documenter la suppression poste par poste : organigramme avant et après, fiches de poste, redistribution des tâches — et expliquer tout écart entre le nombre de suppressions et le nombre de licenciements.",
    risque: "L. 1233-3 fait de la suppression ou de la transformation d'emploi la condition du licenciement économique. Un écart non expliqué entre les suppressions déclarées et les licenciements envisagés affaiblit la démonstration au point qu'elle peut être écartée, et le licenciement jugé sans cause réelle et sérieuse.",
    delai: "Deux semaines.",
    document: "Dossier de suppression d'emploi : organigrammes avant et après, fiches de poste, tableau de redistribution des tâches",
    etapes: [
      "Établir l'organigramme avant projet et l'organigramme cible, poste par poste, avec les effectifs de chacun.",
      "Pour chaque poste supprimé, dire ce que deviennent les tâches : abandonnées, réparties entre les postes subsistants, externalisées.",
      "Rapprocher le total des suppressions du nombre de licenciements envisagés et écrire l'explication de l'écart s'il en subsiste un — reclassements internes, départs volontaires, postes vacants supprimés.",
      "Verser le dossier avant la convocation du comité : c'est de là que part la démonstration économique.",
    ],
    verifs: [
      { cle: "emp01Organigrammes", question: "Les organigrammes avant et après le projet sont-ils versés, et quelles dates portent-ils ?", attendu: "Les deux organigrammes, datés." },
      { cle: "emp01Ecart", question: "Quel est le total des suppressions déclarées, et comment s'explique l'écart avec le nombre de licenciements ?", attendu: "Le total et l'explication écrite de l'écart." },
    ],
  },

  "CTL-EMP-02": {
    gravite: 3,
    quoiFaire: "Mettre fin aux contrats précaires et aux recrutements portant sur un emploi déclaré supprimé, ou écrire ce qui les justifie — remplacement d'un absent, surcroît ponctuel étranger au poste supprimé.",
    risque: "Un recrutement ou un contrat précaire sur l'emploi que l'on déclare supprimé contredit la suppression elle-même : la condition de L. 1233-3 n'est plus établie, et le licenciement est sans cause réelle et sérieuse. C'est la première contradiction que recherche un contradicteur.",
    delai: "Immédiat pour l'inventaire ; le temps du terme ou de la rupture pour les contrats en cours.",
    document: "Inventaire des contrats à durée déterminée, missions d'intérim et recrutements sur les emplois supprimés",
    etapes: [
      "Extraire du registre du personnel les contrats à durée déterminée, missions d'intérim et embauches des derniers mois, avec l'emploi occupé.",
      "Rapprocher cet inventaire de la liste des postes déclarés supprimés, intitulé par intitulé.",
      "Pour chaque recoupement, décider : mettre fin au contrat, ou écrire le motif qui le rend compatible avec la suppression.",
      "Verser l'inventaire et les explications au dossier avant la notification.",
    ],
    verifs: [
      { cle: "emp02Inventaire", question: "Quels contrats précaires ou recrutements portent sur un emploi déclaré supprimé ?", attendu: "L'inventaire, extrait du registre du personnel." },
      { cle: "emp02Justification", question: "Pour chacun, quelle explication écrite figure au dossier ?", attendu: "Le motif, contrat par contrat, ou la preuve qu'il a pris fin." },
    ],
  },

  /* ---------------- CAUSE ÉCONOMIQUE ---------------- */

  "CTL-ECO-01": {
    gravite: 3,
    quoiFaire: "Produire la démonstration comptable chiffrée : tableau trimestriel comparé, résultat d'exploitation sur trois exercices, trésorerie et excédent brut d'exploitation, appuyés sur la liasse fiscale.",
    risque: "L. 1233-3, 1° caractérise les difficultés économiques par l'évolution significative d'au moins un indicateur — baisse des commandes ou du chiffre d'affaires, pertes d'exploitation, dégradation de la trésorerie ou de l'excédent brut d'exploitation — ou par tout autre élément de nature à les justifier. Non chiffrée, la difficulté n'est pas caractérisée et le licenciement est sans cause réelle et sérieuse.",
    delai: "Deux à quatre semaines, selon que les comptes de la période sont arrêtés.",
    document: "Dossier de démonstration économique : tableau trimestriel comparé, comptes de résultat, liasse fiscale",
    etapes: [
      "Construire le tableau trimestriel comparé, trimestre par trimestre, avec le même trimestre de l'année précédente : c'est la forme que le 1° de L. 1233-3 rend vérifiable.",
      "Y joindre le résultat d'exploitation des trois derniers exercices et l'évolution de la trésorerie et de l'excédent brut d'exploitation.",
      "Verser la liasse fiscale : sans elle, les tableaux restent des documents internes, non opposables.",
      "Faire viser l'ensemble par le commissaire aux comptes ou l'expert-comptable lorsqu'il en existe un, et le remettre au comité avec la convocation.",
    ],
    verifs: [
      { cle: "eco01Trimestres", question: "Le tableau trimestriel comparé est-il produit, et sur combien de trimestres ?", attendu: "Le tableau, trimestre par trimestre, avec le comparatif de l'année précédente." },
      { cle: "eco01Liasse", question: "La liasse fiscale est-elle versée, et pour quels exercices ?", attendu: "La liasse, exercice par exercice." },
      { cle: "eco01Indicateurs", question: "Quels indicateurs de L. 1233-3, 1° sont documentés, et lequel est invoqué ?", attendu: "Les séries chiffrées, et l'indicateur retenu." },
    ],
  },

  "CTL-ECO-02": {
    gravite: 3,
    quoiFaire: "Refaire la démonstration au périmètre du secteur d'activité du groupe, en nommant les sociétés qu'elle agrège, plutôt qu'au périmètre de la seule entreprise.",
    risque: "Le périmètre d'appréciation de la cause commande tout : une démonstration faite au niveau de la seule filiale, alors que le secteur d'activité du groupe est bénéficiaire, ne caractérise pas les difficultés de L. 1233-3 et le licenciement est jugé sans cause réelle et sérieuse.",
    delai: "Trois à six semaines : il faut agréger des comptes.",
    document: "Démonstration économique consolidée au périmètre du secteur d'activité, avec la liste des sociétés agrégées",
    etapes: [
      "Énumérer nommément les sociétés du groupe relevant du même secteur d'activité, en indiquant pour chacune son activité et son pays d'établissement.",
      "Agréger les indicateurs de L. 1233-3, 1° sur ce périmètre, société par société puis en total.",
      "Faire dire à la pièce elle-même quelles sociétés elle couvre : une étiquette « secteur » portée sur un tableau n'est pas une couverture.",
      "Remettre la démonstration ainsi refaite au comité, et la conserver pour un éventuel contentieux.",
    ],
    verifs: [
      { cle: "eco02Societes", question: "Quelles sociétés composent le secteur d'activité retenu ?", attendu: "La liste nominative, avec l'activité de chacune." },
      { cle: "eco02Agregats", question: "Les agrégats produits couvrent-ils chacune de ces sociétés, et où le lit-on ?", attendu: "Le tableau consolidé nommant les sociétés agrégées." },
    ],
  },

  "CTL-ECO-03": {
    gravite: 3,
    quoiFaire: "Faire établir, par un tiers et avant toute décision, l'analyse de la menace pesant sur la compétitivité du secteur d'activité : origine, date, chiffrage, et scénario de référence sans réorganisation.",
    risque: "L. 1233-3, 3° vise la réorganisation nécessaire à la sauvegarde de la compétitivité. Une menace seulement affirmée ne distingue pas la réorganisation d'une recherche de rentabilité : le licenciement est alors sans cause réelle et sérieuse. Ce contrôle ne conclut jamais à la conformité — le sujet excède ce qu'une base peut trancher.",
    delai: "Quatre à huit semaines : l'analyse suppose des données de marché.",
    document: "Note d'analyse de la menace sur la compétitivité, établie par un tiers",
    etapes: [
      "Décrire la menace : d'où elle vient, à quelle date elle s'est manifestée, sur quel marché elle pèse.",
      "La chiffrer : perte de parts de marché, évolution des prix, marges du secteur.",
      "Construire le scénario de référence — ce qu'il advient de l'entreprise si la réorganisation n'a pas lieu — et le confronter au scénario retenu.",
      "Faire relire l'analyse par un professionnel avant toute décision : ce contrôle est un contrôle de détection, il signale et ne tranche pas.",
    ],
    verifs: [
      { cle: "eco03Menace", question: "Quelle est la menace invoquée, et sur quelles données extérieures repose-t-elle ?", attendu: "La note d'analyse, avec ses sources datées." },
      { cle: "eco03Scenario", question: "Le scénario de référence sans réorganisation est-il écrit et chiffré ?", attendu: "Le scénario, avec ses hypothèses." },
    ],
  },

  "CTL-ECO-04": {
    gravite: 3,
    quoiFaire: "Dater et documenter la mutation technologique : outil abandonné, outil nouveau, date de mise en service, montant, effets sur les postes.",
    risque: "L. 1233-3, 2° vise les mutations technologiques. Non datée et non documentée, la mutation ne se distingue pas d'un simple changement d'organisation, et la cause économique n'est pas caractérisée.",
    delai: "Une à deux semaines : les pièces existent, il faut les réunir.",
    document: "Dossier de mutation technologique : commande, facture, procès-verbal de mise en service, preuve de l'arrêt de l'ancien outil",
    etapes: [
      "Décrire l'outil abandonné et l'outil nouveau, avec la date de mise en service de celui-ci.",
      "Verser la commande, la facture et le procès-verbal de mise en service, ainsi que la preuve de l'arrêt de l'ancien outil.",
      "Écrire l'effet de la mutation sur chaque poste supprimé : tâches disparues, compétences nouvelles exigées.",
      "Rapprocher ce dossier des actions de formation et d'adaptation : c'est sur ce terrain que la mutation technologique se conteste (contrôle CTL-REC-05).",
    ],
    verifs: [
      { cle: "eco04Mutation", question: "Quel outil a été abandonné, quel outil l'a remplacé, et à quelle date la mise en service est-elle intervenue ?", attendu: "La description et la date, appuyées sur le procès-verbal de mise en service." },
      { cle: "eco04Pieces", question: "La commande, la facture et la preuve de l'arrêt de l'ancien outil sont-elles versées ?", attendu: "Les trois pièces, datées." },
    ],
  },

  "CTL-ECO-05": {
    gravite: 3,
    quoiFaire: "Établir que la cessation d'activité est complète et définitive, et expliquer la poursuite de la même activité par une autre société du groupe si elle existe.",
    risque: "L. 1233-3, 4° ne vise que la cessation complète et définitive de l'activité de l'entreprise. Une cessation partielle ou temporaire ne la constitue pas, et la poursuite de la même activité dans le groupe nourrit le débat sur le caractère réel de la cessation comme sur l'obligation de reclassement : le licenciement peut être jugé sans cause réelle et sérieuse.",
    delai: "Deux à quatre semaines.",
    document: "Dossier de cessation d'activité : décision de l'organe compétent, calendrier d'arrêt, état des sociétés du groupe et de leurs activités",
    etapes: [
      "Verser la décision de l'organe compétent arrêtant la cessation, avec sa date et son étendue.",
      "Établir le calendrier d'arrêt effectif de l'activité, site par site, et ce qu'il advient des actifs.",
      "Énumérer les sociétés du groupe et leur activité, en France et à l'étranger, pour que la contradiction puisse être recherchée.",
      "Si une société exerce la même activité, écrire ce qui distingue les deux — clientèle, marché, moyens — ou renoncer à invoquer la cessation.",
    ],
    verifs: [
      { cle: "eco05Decision", question: "Où est la décision arrêtant la cessation, et quelle date porte-t-elle ?", attendu: "La décision de l'organe compétent, datée." },
      { cle: "eco05Groupe", question: "Quelles sociétés du groupe exercent la même activité, en France ou à l'étranger ?", attendu: "La liste nominative des sociétés et de leurs activités." },
    ],
  },

  "CTL-ECO-06": {
    gravite: 3,
    quoiFaire: "Faire examiner par un professionnel, pièces de gestion à l'appui, si la cessation peut être imputée à une faute de l'employeur ou à sa légèreté blâmable.",
    risque: "La cessation complète et définitive constitue en elle-même une cause économique, sauf si elle procède d'une faute de l'employeur ou de sa légèreté blâmable. C'est là que se joue ce type de dossier, et la base ne peut pas trancher : ce contrôle ne conclut jamais à la conformité.",
    delai: "Deux à quatre semaines d'examen extérieur.",
    document: "Note d'un conseil sur l'imputabilité de la cessation",
    etapes: [
      "Réunir les pièces de gestion des exercices ayant précédé la cessation : comptes, décisions d'investissement, opérations avec les sociétés liées, distributions.",
      "Confier l'examen à un avocat ou à un juriste en droit social, la question excédant le champ de l'application.",
      "Faire écrire la conclusion : ce qui, dans la gestion, pourrait être qualifié de faute ou de légèreté blâmable, et ce qui l'écarte.",
      "Décider au vu de cette note, et non au vu du seul constat de cessation.",
    ],
    verifs: [
      { cle: "eco06Examen", question: "Un professionnel a-t-il examiné l'imputabilité de la cessation, et sa note est-elle au dossier ?", attendu: "La note, datée et signée." },
      { cle: "eco06Gestion", question: "Quelles pièces de gestion lui ont été remises ?", attendu: "La liste des pièces communiquées." },
    ],
  },

  /* ---------------- PROCÉDURE — LE COMITÉ ---------------- */

  "CTL-CSE-01": {
    gravite: 3,
    quoiFaire: "Convoquer et consulter le comité social et économique dans les formes et le nombre de réunions que le régime commande, avant tout acte suivant — une consultation tenue après la notification ne la régularise pas.",
    risque: "La consultation est due par L. 1233-8 pour un licenciement collectif de moins de dix salariés et par L. 1233-28 au-delà. Notifier sans elle expose à l'indemnité de L. 1235-12, et lorsqu'un plan de sauvegarde de l'emploi est dû, à la nullité de L. 1235-10.",
    delai: "De trois semaines à plusieurs mois selon le régime : le nombre de réunions et les délais d'avis s'ajoutent.",
    document: "Convocation du comité social et économique et ordre du jour",
    etapes: [
      "Déterminer le régime applicable : moins de dix licenciements sur trente jours (L. 1233-8), ou au moins dix (L. 1233-28), et l'effectif de l'entreprise.",
      "Convoquer le comité en joignant à la convocation les renseignements exigés (contrôle CTL-CSE-03).",
      "Tenir le nombre de réunions que le régime impose — deux dans les régimes où le texte le prévoit, une sinon.",
      "Faire établir le procès-verbal de chaque réunion et le verser au dossier.",
      "Ne notifier aucun licenciement avant que le comité ait rendu son avis ou soit réputé consulté (contrôle CTL-CSE-04).",
    ],
    verifs: [
      { cle: "cse01Convocation", question: "À quelle date le comité a-t-il été convoqué, et quel ordre du jour portait la convocation ?", attendu: "La convocation datée et son ordre du jour." },
      { cle: "cse01Reunions", question: "Combien de réunions se sont tenues, et à quelles dates ?", attendu: "Les dates et les procès-verbaux." },
    ],
  },

  "CTL-CSE-02": {
    gravite: 3,
    quoiFaire: "Reprendre le calendrier de consultation pour respecter l'intervalle entre les deux réunions que le régime impose ; si les réunions ont déjà eu lieu hors délai, l'irrégularité est acquise et ne se rattrape pas par une réunion supplémentaire.",
    risque: "Dans les entreprises de moins de cinquante salariés, L. 1233-29 impose deux réunions séparées d'un délai qui ne peut être supérieur à quatorze jours. Dans les entreprises d'au moins cinquante salariés, L. 1233-30 organise la consultation et ses délais. Un calendrier irrégulier expose à l'indemnité de L. 1235-12 et, en régime de plan de sauvegarde de l'emploi, au refus de validation ou d'homologation.",
    delai: "Le temps de refixer les réunions : deux à quatre semaines.",
    document: "Calendrier de consultation daté, réunion par réunion",
    etapes: [
      "Relever les dates réelles des réunions tenues et calculer l'intervalle entre la première et la seconde.",
      "Le confronter au régime : maximum de quatorze jours dans le cas de L. 1233-29, minimum imposé par L. 1233-30 dans l'autre.",
      "Si la seconde réunion n'a pas eu lieu, la fixer à une date conforme et en informer le comité par écrit.",
      "Si elle a eu lieu hors délai, ne pas la refaire pour effacer la première : consigner le calendrier réel et porter le point au conseil de l'entreprise.",
    ],
    verifs: [
      { cle: "cse02Dates", question: "Quelles sont les dates exactes des réunions du comité, dans l'ordre ?", attendu: "Les dates, lues sur les convocations et les procès-verbaux." },
      { cle: "cse02Intervalle", question: "Quel intervalle sépare la première réunion de la seconde ?", attendu: "Le nombre de jours, et le régime auquel il se compare." },
    ],
  },

  "CTL-CSE-03": {
    gravite: 2,
    quoiFaire: "Joindre à la convocation l'intégralité des sept renseignements exigés par le texte applicable au régime — L. 1233-10 en régime de moins de dix licenciements, L. 1233-31 au-delà — et non les remettre en séance.",
    risque: "Les deux articles imposent que les renseignements soient adressés « avec la convocation ». Remis en séance, ils privent le comité de tout examen préalable : la consultation est viciée et le salarié compris dans le licenciement peut obtenir l'indemnité de L. 1235-12, calculée en fonction du préjudice subi.",
    delai: "Quelques jours, mais la convocation doit être refaite : compter le délai jusqu'à la nouvelle réunion.",
    document: "Document d'information du comité — les sept renseignements de L. 1233-10 ou L. 1233-31",
    etapes: [
      "Identifier le texte applicable : L. 1233-10 pour un licenciement collectif de moins de dix salariés, L. 1233-31 pour un licenciement d'au moins dix.",
      "Rédiger le document en reprenant les sept points : raisons économiques, financières ou techniques ; nombre de licenciements envisagé ; catégories professionnelles concernées et critères proposés pour l'ordre des licenciements ; nombre de salariés, permanents ou non, employés dans l'établissement ; calendrier prévisionnel des licenciements ; mesures de nature économique envisagées ; le cas échéant, les conséquences en matière de santé, de sécurité ou de conditions de travail.",
      "L'adresser avec la convocation et recueillir la décharge des membres.",
      "Verser au dossier la convocation, le document et les décharges.",
    ],
    verifs: [
      { cle: "cse03Document", question: "Le document d'information est-il versé, et lequel des sept points y manque-t-il ?", attendu: "Le document, point par point." },
      { cle: "cse03Envoi", question: "À quelle date le document a-t-il été adressé, et où sont les décharges des membres ?", attendu: "La date d'envoi, antérieure ou concomitante à la convocation, et les décharges." },
    ],
  },

  "CTL-CSE-04": {
    gravite: 3,
    quoiFaire: "Recueillir l'avis du comité, ou constater par écrit l'expiration du délai qui vaut avis rendu, avant d'expédier la moindre lettre de licenciement.",
    risque: "L. 1233-8 dispose qu'en l'absence d'avis rendu dans le délai, le comité est réputé avoir été consulté. Notifier avant l'expiration de ce délai, c'est notifier sans consultation : l'indemnité de L. 1235-12 est encourue, et la nullité de L. 1235-10 lorsqu'un plan de sauvegarde de l'emploi est dû. Une lettre déjà partie ne se rattrape pas.",
    delai: "Le délai d'avis du régime, à compter de la première réunion.",
    document: "Procès-verbal d'avis du comité, ou constat écrit d'expiration du délai",
    etapes: [
      "Relever la date de la première réunion : c'est d'elle que court le délai d'avis.",
      "Calculer la date d'expiration selon le régime, et l'écrire au dossier.",
      "À l'expiration, si aucun avis n'a été rendu, établir un constat écrit et daté : le comité est réputé consulté à cette date.",
      "Fixer la notification à une date postérieure — et non le jour même, la coïncidence exacte des deux dates n'étant tranchée ni par le texte ni par un arrêt publié du corpus.",
    ],
    verifs: [
      { cle: "cse04Avis", question: "Le comité a-t-il rendu un avis, et à quelle date ?", attendu: "Le procès-verbal portant l'avis, daté au format AAAA-MM-JJ." },
      { cle: "cse04Expiration", question: "À défaut d'avis, quelle est la date d'expiration du délai, et où est le constat écrit ?", attendu: "La date calculée depuis la première réunion, et le constat." },
      { cle: "cse04Notification", question: "Quelle date de notification est retenue, et est-elle postérieure à cette date ?", attendu: "La date de notification, strictement postérieure." },
    ],
  },

  "CTL-CSE-05": {
    gravite: 2,
    quoiFaire: "Informer ou saisir l'autorité administrative sur le support et dans le délai exigés, et conserver l'accusé de réception — sans notifier le projet avant le lendemain de la date prévue pour la première réunion lorsque le régime l'impose.",
    risque: "L. 1233-19 impose d'informer l'autorité administrative des licenciements prononcés en régime de moins de dix salariés ; L. 1233-46 impose de lui notifier tout projet d'au moins dix licenciements sur trente jours, au plus tôt le lendemain de la date prévue pour la première réunion. Le non-respect de l'information de l'autorité administrative ouvre au salarié l'indemnité de L. 1235-12.",
    delai: "Quelques jours, mais la date d'envoi est contrainte par le calendrier des réunions.",
    document: "Notification du projet de licenciement à l'autorité administrative, ou information des licenciements prononcés",
    etapes: [
      "Déterminer l'acte dû : information au titre de L. 1233-19, ou notification du projet au titre de L. 1233-46.",
      "Pour L. 1233-46, fixer l'envoi au plus tôt le lendemain de la date prévue pour la première réunion, et y joindre les renseignements sur la convocation, l'ordre du jour et la tenue de cette réunion.",
      "Indiquer, le cas échéant et au plus tard à cette date, l'intention d'ouvrir la négociation de L. 1233-24-1.",
      "Conserver l'accusé de réception : c'est lui, et non la lettre, qui prouve la date.",
    ],
    verifs: [
      { cle: "cse05Envoi", question: "À quelle date l'administration a-t-elle été informée ou saisie, et par quel support ?", attendu: "La date et l'accusé de réception." },
      { cle: "cse05Anteriorite", question: "Cette date est-elle postérieure à la date prévue pour la première réunion du comité ?", attendu: "Les deux dates, rapprochées." },
    ],
  },

  "CTL-CSE-06": {
    gravite: 2,
    quoiFaire: "Reporter la première réunion pour laisser au comité un délai réel d'examen entre la convocation et la séance, les renseignements devant lui parvenir avec la convocation.",
    risque: "L. 1233-10 et L. 1233-31 imposent d'adresser les renseignements « avec la convocation ». Une convocation à trois jours de la séance prive le comité de tout examen : c'est sur ce terrain que la consultation est attaquée, et l'indemnité de L. 1235-12 encourue.",
    delai: "Le temps du report : une à deux semaines.",
    document: "Convocation reportée, avec l'ordre du jour et les renseignements joints",
    etapes: [
      "Relever la date d'envoi de la convocation et celle de la première réunion, et compter les jours qui les séparent.",
      "Si l'écart ne laisse aucun temps d'examen, reporter la réunion et en informer les membres par écrit.",
      "Joindre à la nouvelle convocation l'intégralité des renseignements du texte applicable.",
      "Conserver les deux convocations : le report se documente, il ne s'efface pas.",
    ],
    verifs: [
      { cle: "cse06Convocation", question: "À quelle date la convocation a-t-elle été envoyée, et à quelle date la première réunion s'est-elle tenue ?", attendu: "Les deux dates, et la preuve d'envoi." },
      { cle: "cse06Joints", question: "Les renseignements étaient-ils joints à cette convocation ?", attendu: "La convocation et ses pièces jointes, ou la décharge." },
    ],
  },

  "CTL-CSE-07": {
    gravite: 3,
    quoiFaire: "Consulter l'instance que la loi désigne : le comité social et économique central et les comités d'établissement intéressés lorsque les mesures excèdent le pouvoir des chefs d'établissement ou portent sur plusieurs établissements.",
    risque: "L. 1233-9 impose de réunir le comité central et le ou les comités d'établissement intéressés dès lors que les mesures envisagées excèdent le pouvoir du ou des chefs d'établissement concernés ou portent sur plusieurs établissements simultanément. Consulter la mauvaise instance équivaut à ne pas consulter : l'indemnité de L. 1235-12 est encourue, et la nullité de L. 1235-10 en régime de plan de sauvegarde de l'emploi.",
    delai: "Il faut reprendre la consultation : plusieurs semaines.",
    document: "Convocations du comité central et des comités d'établissement intéressés",
    etapes: [
      "Établir le nombre d'établissements distincts et l'existence d'un comité central.",
      "Déterminer si les mesures excèdent le pouvoir des chefs d'établissement ou portent sur plusieurs établissements : c'est le critère de L. 1233-9.",
      "Si oui, convoquer le comité central et chacun des comités d'établissement intéressés, et non l'un à l'exclusion des autres.",
      "Reprendre la consultation à son point de départ si elle a été conduite devant la seule instance locale : une consultation devant l'instance incompétente ne se valide pas rétroactivement.",
    ],
    verifs: [
      { cle: "cse07Etablissements", question: "Combien d'établissements distincts l'entreprise compte-t-elle, et un comité central existe-t-il ?", attendu: "Le nombre et la preuve de la mise en place du comité central." },
      { cle: "cse07Instances", question: "Quelles instances ont été convoquées, et à quelles dates ?", attendu: "Les convocations, instance par instance." },
    ],
  },

  "CTL-CSE-08": {
    gravite: 3,
    quoiFaire: "Verser le procès-verbal de carence, ou organiser les élections, avant d'engager la procédure — l'absence d'institution ne dispense pas de consulter, elle doit être établie.",
    risque: "Sans comité ni procès-verbal de carence, l'employeur ne peut établir qu'il était dispensé de consulter : la procédure est conduite comme si la consultation n'avait pas été due, alors qu'elle l'était. L'indemnité de L. 1235-12 est encourue, et la nullité de L. 1235-10 lorsqu'un plan de sauvegarde de l'emploi est dû.",
    delai: "Le procès-verbal de carence est immédiat s'il existe ; l'organisation d'élections se compte en mois.",
    document: "Procès-verbal de carence, ou calendrier électoral",
    etapes: [
      "Vérifier si un comité social et économique est en place, et depuis quand.",
      "S'il n'y en a pas, rechercher le procès-verbal de carence du dernier scrutin et le verser au dossier.",
      "S'il n'en existe pas, engager le processus électoral avant de poursuivre la procédure de licenciement.",
      "Consigner par écrit la situation retenue : comité en place, carence établie, ou élections en cours.",
    ],
    verifs: [
      { cle: "cse08Existence", question: "Un comité social et économique est-il en place, et depuis quelle date ?", attendu: "Le procès-verbal d'élection ou la preuve de sa mise en place." },
      { cle: "cse08Carence", question: "À défaut, où est le procès-verbal de carence, et quelle date porte-t-il ?", attendu: "Le procès-verbal de carence, daté." },
    ],
  },

  "CTL-CSE-09": {
    gravite: 2,
    quoiFaire: "Arrêter par écrit le calendrier de l'expertise décidée par le comité et l'articuler avec le délai d'avis, qui n'est pas prolongé de plein droit par elle.",
    risque: "Une expertise dont le calendrier n'est pas articulé avec le délai d'avis conduit soit à notifier avant que le comité soit réputé consulté — voir le contrôle CTL-CSE-04 —, soit à laisser expirer le délai sans que le comité ait pu se prononcer. Dans les deux cas, l'irrégularité de la consultation ouvre au salarié l'indemnité de L. 1235-12.",
    delai: "Le temps de l'expertise, à arrêter dès sa désignation.",
    document: "Calendrier arrêté de l'expertise et de la consultation",
    etapes: [
      "Consigner la date à laquelle le comité a décidé de recourir à l'expertise et la date de désignation de l'expert.",
      "Fixer avec l'expert la date de remise de son rapport, et la rapprocher de la date d'expiration du délai d'avis.",
      "Écrire au comité le calendrier retenu, en indiquant la date à laquelle il est réputé consulté à défaut d'avis.",
      "Ne fixer la notification qu'après cette date, expertise remise ou non.",
    ],
    verifs: [
      { cle: "cse09Designation", question: "À quelle date l'expertise a-t-elle été décidée, et l'expert désigné ?", attendu: "Les deux dates, lues sur la délibération du comité." },
      { cle: "cse09Calendrier", question: "Quelle est la date prévue de remise du rapport, et comment se situe-t-elle par rapport à l'expiration du délai d'avis ?", attendu: "Le calendrier écrit, les deux dates rapprochées." },
    ],
  },

  "CTL-CSE-10": {
    gravite: 2,
    quoiFaire: "Exposer par écrit au comité les conséquences du projet en matière de santé, de sécurité ou de conditions de travail, et joindre cet exposé à la convocation.",
    risque: "C'est le septième renseignement de L. 1233-10 et de L. 1233-31, et il est dû comme les six autres. Son omission vicie la consultation et ouvre au salarié l'indemnité de L. 1235-12 ; en régime de plan de sauvegarde de l'emploi, elle nourrit le refus de validation ou d'homologation.",
    delai: "Une semaine de rédaction ; la convocation doit ensuite être refaite si elle est déjà partie.",
    document: "Exposé des conséquences du projet en matière de santé, de sécurité et de conditions de travail",
    etapes: [
      "Décrire, poste par poste et service par service, ce que le projet change dans la charge de travail, les horaires, les responsabilités et l'environnement de travail.",
      "Indiquer les mesures de prévention envisagées pour les salariés qui restent, dont la charge se redistribue.",
      "Joindre l'exposé au document des sept renseignements et l'adresser avec la convocation.",
      "Faire consigner au procès-verbal les observations du comité sur ce point.",
    ],
    verifs: [
      { cle: "cse10Expose", question: "L'exposé des conséquences en matière de santé, de sécurité et de conditions de travail est-il versé ?", attendu: "Le document lui-même." },
      { cle: "cse10Remise", question: "À quelle date a-t-il été adressé au comité, et avec quelle convocation ?", attendu: "La date d'envoi et la décharge des membres." },
    ],
  },

  "CTL-ENT-01": {
    gravite: 3,
    quoiFaire: "Régler la notification sur le calendrier que le régime commande : convoquer et tenir l'entretien préalable lorsqu'il est dû, ou s'en tenir au calendrier collectif — avis du comité et, le cas échéant, décision administrative — lorsque la loi en dispense.",
    risque: "L. 1233-11 impose l'entretien préalable pour un licenciement individuel ou collectif de moins de dix salariés sur trente jours, l'entretien ne pouvant avoir lieu moins de cinq jours ouvrables après la présentation de la lettre de convocation. L. 1233-38 écarte cette procédure lorsque le licenciement porte sur au moins dix salariés sur trente jours et qu'il existe un comité. Se régler sur le mauvais calendrier conduit à notifier trop tôt : l'irrégularité est acquise dès l'envoi de la lettre.",
    delai: "Au moins cinq jours ouvrables avant l'entretien lorsqu'il est dû, puis le délai de L. 1233-15 avant la lettre.",
    document: "Convocation à l'entretien préalable, ou note fixant le calendrier collectif retenu",
    etapes: [
      "Déterminer si l'entretien est dû : régime de L. 1233-11, ou dispense de L. 1233-38 lorsqu'un comité existe et que le projet porte sur au moins dix salariés sur trente jours.",
      "S'il est dû, convoquer par lettre recommandée ou remise en main propre contre décharge, en indiquant l'objet, et tenir l'entretien au plus tôt cinq jours ouvrables après la présentation de la lettre.",
      "S'il n'est pas dû, écrire au dossier que la notification est commandée par l'avis du comité et, le cas échéant, par la décision administrative — un entretien tenu par précaution n'ouvre aucun délai opposable.",
      "Respecter ensuite le délai de L. 1233-15 lorsqu'il s'applique : la lettre ne peut être expédiée moins de sept jours ouvrables à compter de la date prévue de l'entretien, quinze jours ouvrables pour le licenciement individuel d'un membre du personnel d'encadrement.",
    ],
    verifs: [
      { cle: "ent01Regime", question: "L'entretien préalable est-il dû dans ce dossier, et sur quel fondement ?", attendu: "Le régime retenu, L. 1233-11 ou la dispense de L. 1233-38, écrit au dossier." },
      { cle: "ent01Dates", question: "Quelles sont les dates de convocation à l'entretien, de l'entretien et de la notification envisagée ?", attendu: "Les trois dates, et les délais qui les séparent." },
    ],
  },

  /* ---------------- PLAN DE SAUVEGARDE DE L'EMPLOI ---------------- */

  "CTL-PSE-01": {
    gravite: 3,
    quoiFaire: "Établir un plan de sauvegarde de l'emploi couvrant les mesures que L. 1233-61 à L. 1233-63 exigent, et le compléter sur les catégories laissées vides avant de le soumettre à l'administration.",
    risque: "L'annulation de la décision de validation ou d'homologation en raison d'une absence ou d'une insuffisance de plan de sauvegarde de l'emploi rend la procédure de licenciement nulle (L. 1235-10). Le juge peut alors ordonner la poursuite du contrat ou prononcer la nullité du licenciement et la réintégration (L. 1235-11).",
    delai: "Quatre à huit semaines : le plan se négocie ou s'élabore, puis se soumet à l'administration.",
    document: "Plan de sauvegarde de l'emploi",
    etapes: [
      "Vérifier que le plan est dû : entreprise d'au moins cinquante salariés et projet portant sur au moins dix salariés dans une même période de trente jours (L. 1233-61).",
      "Y intégrer le plan de reclassement visant à faciliter le reclassement sur le territoire national des salariés dont le licenciement ne pourrait être évité, que L. 1233-61 exige.",
      "Renseigner les mesures énumérées par L. 1233-62 : reclassement interne, actions favorisant la reprise d'activités, créations d'activités nouvelles, reclassement externe, soutien à la création ou à la reprise d'activités, actions de formation, de validation des acquis ou de reconversion.",
      "Déterminer les modalités de suivi de la mise en œuvre effective des mesures, que L. 1233-63 impose, et prévoir la consultation régulière du comité sur ce suivi.",
      "Soumettre le plan à l'administration par la voie retenue, et attendre sa décision avant toute notification.",
    ],
    verifs: [
      { cle: "pse01Contenu", question: "Quelles catégories de mesures le plan renseigne-t-il, et lesquelles restent vides ?", attendu: "Le plan, mesure par mesure, rapproché de L. 1233-62." },
      { cle: "pse01Suivi", question: "Quelles modalités de suivi de la mise en œuvre le plan détermine-t-il ?", attendu: "La partie « suivi » du plan, avec la périodicité de la consultation du comité." },
    ],
  },

  "CTL-PSE-02": {
    gravite: 3,
    quoiFaire: "Calibrer le plan sur les moyens du groupe et verser les comptes consolidés qui en justifient le niveau, avant de saisir l'administration.",
    risque: "L. 1233-57-3 charge l'autorité administrative de vérifier le respect par le plan des articles L. 1233-61 à L. 1233-63. Un plan calibré sur les seuls moyens de la filiale expose au refus d'homologation ; l'annulation de la décision pour insuffisance du plan rend la procédure nulle (L. 1235-10) et l'annulation pour un autre motif ouvre l'indemnité de L. 1235-16, qui ne peut être inférieure aux salaires des six derniers mois.",
    delai: "Deux à quatre semaines pour réunir les comptes du groupe.",
    document: "Comptes consolidés du groupe et note de proportionnalité des mesures",
    etapes: [
      "Réunir les comptes consolidés du groupe et, si le périmètre s'y prête, ceux de l'unité économique et sociale.",
      "Rapprocher le budget du plan des moyens ainsi établis, mesure par mesure.",
      "Écrire la note de proportionnalité : ce que chaque mesure coûte, et au regard de quels moyens elle est calibrée.",
      "Joindre l'ensemble au dossier soumis à l'administration.",
    ],
    verifs: [
      { cle: "pse02Comptes", question: "Les comptes consolidés du groupe sont-ils versés, et pour quels exercices ?", attendu: "Les comptes, exercice par exercice." },
      { cle: "pse02Budget", question: "Quel est le budget total du plan, et à quels moyens est-il rapporté ?", attendu: "Le chiffrage global et la note de proportionnalité." },
    ],
  },

  "CTL-PSE-03": {
    gravite: 4,
    quoiFaire: "Arrêter par écrit la voie retenue — accord majoritaire de L. 1233-24-1 ou document unilatéral homologué — et la faire figurer au dossier avant la première réunion.",
    risque: "La voie commande tout le calendrier et la nature du contrôle administratif : validation de l'accord ou homologation du document. Tant qu'elle n'est pas arrêtée, aucune date de saisine de l'administration ni de notification ne peut être fixée de manière fiable.",
    delai: "Une réunion : c'est une décision à formaliser, non une pièce à construire.",
    document: "Note arrêtant la voie retenue pour le plan de sauvegarde de l'emploi",
    etapes: [
      "Vérifier s'il existe des organisations syndicales représentatives en mesure de signer l'accord de L. 1233-24-1, et à quel niveau de suffrages.",
      "Arrêter la voie : accord collectif majoritaire, ou document élaboré par l'employeur soumis à homologation.",
      "L'écrire au dossier avec sa date, et en informer le comité.",
      "En déduire le calendrier : délai de décision de l'administration, puis notification postérieure à cette décision.",
    ],
    verifs: [
      { cle: "pse03Voie", question: "Quelle voie a été retenue — accord majoritaire ou document unilatéral — et à quelle date la décision a-t-elle été prise ?", attendu: "La note datée arrêtant la voie." },
      { cle: "pse03Calendrier", question: "Quel calendrier en découle jusqu'à la décision administrative ?", attendu: "Le calendrier écrit, avec la date prévue de saisine." },
    ],
  },

  "CTL-PSE-04": {
    gravite: 3,
    quoiFaire: "Ne notifier aucun licenciement avant la décision de validation ou d'homologation de l'administration ; si une lettre est déjà partie avant cette décision, le licenciement est nul et il n'y a rien à corriger — il y a une nullité à traiter.",
    risque: "L. 1233-39 impose, dans les entreprises de cinquante salariés ou plus et pour un projet d'au moins dix licenciements sur trente jours, de notifier après la décision de validation ou d'homologation. L. 1235-10 déclare nul le licenciement intervenu en l'absence de toute décision ou alors qu'une décision négative a été rendue, et L. 1235-11 permet au juge d'ordonner la poursuite du contrat ou la réintégration.",
    delai: "Le délai de décision de l'administration : L. 1233-57-4 fixe quinze jours pour la validation d'un accord et vingt et un jours pour l'homologation d'un document.",
    document: "Décision de validation ou d'homologation, et calendrier de notification",
    etapes: [
      "Suspendre tout envoi de lettre de licenciement tant que la décision administrative n'est pas notifiée à l'entreprise.",
      "Relever la date de notification de la décision, que L. 1233-57-4 impose à l'administration dans quinze ou vingt et un jours selon la voie retenue.",
      "Fixer la date de notification des licenciements strictement après cette date, et non le jour même.",
      "Si des lettres sont déjà parties avant la décision, ne pas les réexpédier : saisir le conseil de l'entreprise, la nullité de L. 1235-10 étant encourue.",
    ],
    verifs: [
      { cle: "pse04Decision", question: "À quelle date l'administration a-t-elle notifié sa décision de validation ou d'homologation ?", attendu: "La décision, datée, et sa notification à l'entreprise." },
      { cle: "pse04Lettres", question: "À quelle date les lettres de licenciement ont-elles été expédiées ?", attendu: "La date d'expédition, postérieure à la décision, et les preuves d'envoi." },
    ],
  },

  "CTL-PSE-05": {
    gravite: 3,
    quoiFaire: "Chiffrer chaque mesure du plan : montants, nombre de bénéficiaires, durée, budget affecté.",
    risque: "L. 1233-62 énumère des mesures que l'administration apprécie au regard des moyens de l'entreprise et du groupe. Une mesure non chiffrée n'est pas appréciable : le plan peut être tenu pour insuffisant, et l'annulation de la décision pour insuffisance du plan rend la procédure de licenciement nulle (L. 1235-10).",
    delai: "Une à deux semaines.",
    document: "Tableau budgétaire du plan, mesure par mesure",
    etapes: [
      "Reprendre chaque mesure du plan et lui attacher un montant, un nombre de bénéficiaires attendu et une durée.",
      "Totaliser le budget du plan et le rapprocher des moyens établis au titre du contrôle CTL-PSE-02.",
      "Faire figurer le tableau budgétaire dans le plan lui-même, et non dans une annexe séparée.",
      "Le remettre au comité et à l'administration avec le plan.",
    ],
    verifs: [
      { cle: "pse05Chiffrage", question: "Quelles mesures du plan restent sans aucun chiffre ?", attendu: "Le tableau budgétaire, mesure par mesure." },
      { cle: "pse05Total", question: "Quel est le budget total du plan ?", attendu: "Le total, et sa ventilation." },
    ],
  },

  "CTL-PSE-06": {
    gravite: 3,
    quoiFaire: "Joindre le plan à la convocation du comité et non le remettre en séance ; si la réunion s'est tenue sans le plan, la reprendre sur une nouvelle convocation à laquelle il est joint.",
    risque: "L. 1233-32 impose d'adresser aux représentants du personnel, outre les renseignements de L. 1233-31, le plan de sauvegarde de l'emploi dans les entreprises d'au moins cinquante salariés. Une consultation menée sans le plan est irrégulière : elle expose au refus de validation ou d'homologation et, en cas d'annulation pour insuffisance du plan, à la nullité de L. 1235-10.",
    delai: "Le temps d'une nouvelle convocation : une à deux semaines.",
    document: "Convocation du comité accompagnée du projet de plan de sauvegarde de l'emploi",
    etapes: [
      "Relever la date portée sur le projet de plan et celle de la convocation du comité.",
      "Si le plan est postérieur à la convocation, ne pas tenir la réunion en l'état.",
      "Convoquer à nouveau en joignant le plan et les renseignements de L. 1233-31, et recueillir les décharges.",
      "Faire consigner au procès-verbal que le plan a été adressé avec la convocation.",
    ],
    verifs: [
      { cle: "pse06DatePlan", question: "Quelle date porte le projet de plan de sauvegarde de l'emploi ?", attendu: "La date, lue sur la pièce enregistrée." },
      { cle: "pse06DateConvoc", question: "À quelle date la convocation a-t-elle été adressée, et le plan y était-il joint ?", attendu: "La convocation datée et la décharge mentionnant les pièces jointes." },
    ],
  },

  "CTL-PSE-07": {
    gravite: 3,
    quoiFaire: "Vérifier que les signataires de l'accord atteignent le seuil de représentativité de L. 1233-24-1 avant de le déposer, et basculer sur le document unilatéral s'ils ne l'atteignent pas.",
    risque: "L. 1233-24-1 exige la signature d'organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité. Un accord signé en deçà ne peut être validé : le licenciement prononcé en l'absence de décision de validation est nul (L. 1235-10).",
    delai: "Quelques jours pour le calcul ; le basculement vers le document unilatéral rouvre le délai d'homologation de vingt et un jours.",
    document: "Décompte des suffrages du premier tour et procès-verbal des dernières élections",
    etapes: [
      "Reprendre le procès-verbal des dernières élections des titulaires au comité et relever les suffrages exprimés au premier tour en faveur d'organisations reconnues représentatives.",
      "Calculer le pourcentage recueilli par les organisations signataires, quel que soit le nombre de votants.",
      "Si le seuil de 50 % n'est pas atteint, ne pas déposer l'accord et élaborer le document unilatéral soumis à homologation.",
      "Joindre le décompte au dossier adressé à l'administration.",
    ],
    verifs: [
      { cle: "pse07Suffrages", question: "Quel pourcentage de suffrages les signataires ont-ils recueilli au premier tour des dernières élections des titulaires ?", attendu: "Le pourcentage, et le procès-verbal des élections qui l'établit." },
      { cle: "pse07Voie", question: "Si le seuil n'est pas atteint, quelle voie a été retenue à la place ?", attendu: "La note arrêtant le passage au document unilatéral." },
    ],
  },

  /* ---------------- SALARIÉS PROTÉGÉS ET SITUATIONS INDIVIDUELLES ---------------- */

  "CTL-PRT-01": {
    gravite: 1,
    quoiFaire: "Demander à l'inspecteur du travail l'autorisation de licencier chaque salarié protégé et attendre la décision ; si une notification est intervenue sans autorisation ou malgré un refus, ne rien tenter pour la régulariser et saisir immédiatement le conseil de l'entreprise.",
    risque: "Les salariés protégés bénéficient de la protection de L. 2411-1 et, pour le délégué syndical, de L. 2411-5 : le licenciement suppose l'autorisation de l'inspecteur du travail. Le licenciement notifié malgré un refus est nul, et le fait de passer outre est pénalement sanctionné.",
    delai: "Le temps de l'instruction par l'inspecteur du travail : la notification est suspendue jusqu'à la décision.",
    document: "Demandes d'autorisation de licenciement et décisions de l'inspecteur du travail",
    etapes: [
      "Recenser nominativement les salariés protégés concernés et le mandat de chacun.",
      "Déposer, pour chacun, la demande d'autorisation auprès de l'inspecteur du travail.",
      "Attendre la décision et relever son sens — accord, refus — et sa date : une demande en cours d'instruction n'est pas une autorisation.",
      "N'expédier la lettre qu'aux salariés dont l'autorisation est acquise, et à une date postérieure à celle de la décision.",
      "Pour tout refus, retirer le salarié du projet : le licenciement notifié malgré un refus est nul.",
    ],
    verifs: [
      { cle: "prt01Liste", question: "Quels salariés protégés sont concernés, et quel mandat détient chacun ?", attendu: "La liste nominative, mandat par mandat." },
      { cle: "prt01Decisions", question: "Pour chacun, quel est le sens de la décision de l'inspecteur du travail, et sa date ?", attendu: "La décision elle-même — accord ou refus — datée." },
      { cle: "prt01Anteriorite", question: "Chaque autorisation est-elle antérieure à la date de notification ?", attendu: "Les deux dates rapprochées, salarié par salarié." },
    ],
  },

  "CTL-IND-01": {
    gravite: 3,
    quoiFaire: "Faire examiner par un professionnel la situation de chaque salarié en arrêt, en congé maternité ou déclaré inapte avant toute notification le concernant.",
    risque: "Chacune de ces situations obéit à des règles propres, qui peuvent interdire ou retarder la notification. Ce contrôle ne conclut jamais à la conformité : la base signale la situation et s'arrête, l'examen individuel excédant son champ.",
    delai: "Une à deux semaines d'examen extérieur, par salarié.",
    document: "Note d'examen individuel des salariés en situation particulière",
    etapes: [
      "Recenser nominativement les salariés en arrêt de travail, en congé maternité ou déclarés inaptes parmi ceux que le projet concerne.",
      "Pour chacun, réunir les pièces de sa situation : arrêt, avis du médecin du travail, dates de congé.",
      "Confier l'examen à un avocat ou à un juriste en droit social, salarié par salarié.",
      "Différer la notification pour ceux dont la situation l'interdit ou la retarde, et le consigner par écrit.",
    ],
    verifs: [
      { cle: "ind01Liste", question: "Quels salariés concernés sont en arrêt, en congé maternité ou déclarés inaptes ?", attendu: "La liste nominative, avec la nature et les dates de chaque situation." },
      { cle: "ind01Examen", question: "Où est la note d'examen individuel, et que conclut-elle pour chacun ?", attendu: "La note, salarié par salarié." },
    ],
  },

  "CTL-COE-01": {
    gravite: 3,
    quoiFaire: "Faire examiner par un professionnel le risque de co-emploi signalé, avant toute décision.",
    risque: "Le co-emploi suppose une confusion d'intérêts, d'activités et de direction se manifestant par une immixtion permanente de la société mère dans la gestion économique et sociale de la société employeuse, conduisant à la perte totale d'autonomie d'action de cette dernière. Le critère est exigeant et la qualification excède le champ de la base : ce contrôle ne conclut jamais à la conformité.",
    delai: "Deux à quatre semaines d'examen extérieur.",
    document: "Note d'un conseil sur le risque de co-emploi",
    etapes: [
      "Décrire les faits d'immixtion signalés : décisions prises par la société mère, gestion du personnel, direction effective, flux financiers.",
      "Réunir les pièces correspondantes — conventions de prestations, délégations, comptes rendus de comités de direction.",
      "Confier l'examen à un avocat ou à un juriste en droit social.",
      "Décider au vu de sa note, et non du seul signalement porté au questionnaire.",
    ],
    verifs: [
      { cle: "coe01Faits", question: "Quels faits d'immixtion de la société mère sont signalés, et sur quelles pièces reposent-ils ?", attendu: "Les faits, datés, et les pièces qui les établissent." },
      { cle: "coe01Note", question: "Un professionnel a-t-il examiné le risque, et où est sa note ?", attendu: "La note, datée et signée." },
    ],
  },

  /* ---------------- NORMES CONVENTIONNELLES ---------------- */

  "CTL-CCN-01": {
    gravite: 4,
    quoiFaire: "Verser la convention collective applicable et les accords d'entreprise, puis relancer l'audit.",
    risque: "L. 1233-5 réserve la définition des critères d'ordre à l'employeur « en l'absence de convention ou accord collectif de travail applicable », et L. 1233-39 admet qu'une convention ou un accord prévoie des délais de notification plus favorables. Tant que ces textes ne sont pas versés, l'audit applique la loi seule, alors que les stipulations conventionnelles priment.",
    delai: "Quelques jours : les textes existent, il s'agit de les produire.",
    document: null,
    etapes: [
      "Identifier la convention collective applicable par son numéro IDCC et en verser le texte à jour de ses avenants.",
      "Verser les accords d'entreprise applicables : accord de méthode, accord portant plan de sauvegarde de l'emploi, accord fixant le périmètre des critères d'ordre, accord de performance collective.",
      "Enregistrer chaque texte comme une pièce datée, avec son auteur et sa version.",
      "Relancer l'audit : les règles conventionnelles seront alors confrontées aux règles légales.",
    ],
    verifs: [
      { cle: "ccn01Convention", question: "Quel est le numéro IDCC de la convention applicable, et le texte est-il versé ?", attendu: "L'IDCC et le texte, daté." },
      { cle: "ccn01Accords", question: "Quels accords d'entreprise sont versés, et lesquels manquent ?", attendu: "La liste des accords versés, avec leur date de signature et de dépôt." },
    ],
  },

  "CTL-CCN-02": {
    gravite: 4,
    quoiFaire: "Vérifier que le texte versé correspond bien à l'IDCC déclaré et qu'il est à jour de ses avenants, et expliquer tout écart avec le dernier texte publié.",
    risque: "Une convention versée dans une version dépassée conduit à appliquer des stipulations abrogées sur les critères d'ordre, les délais ou l'indemnité. L'écart entre la version appliquée et le dernier texte publié doit être expliqué, sans quoi l'audit repose sur un texte que l'entreprise n'applique peut-être pas.",
    delai: "Quelques jours.",
    document: null,
    etapes: [
      "Relever le numéro IDCC déclaré et le rapprocher de l'intitulé du texte versé.",
      "Relever la version du texte versé et la comparer au dernier texte publié signalé par la veille.",
      "Si les deux diffèrent, écrire l'explication : avenant non encore publié, avenant publié mais non applicable à l'entreprise, erreur de version.",
      "Remplacer le texte versé par la version applicable, et enregistrer sa date.",
    ],
    verifs: [
      { cle: "ccn02Idcc", question: "L'intitulé du texte versé correspond-il à l'IDCC déclaré ?", attendu: "L'IDCC et l'intitulé, rapprochés." },
      { cle: "ccn02Version", question: "Quelle version est versée, et comment se compare-t-elle au dernier texte publié ?", attendu: "La version et, s'il y a écart, l'explication écrite." },
    ],
  },

  "CTL-CCN-03": {
    gravite: 4,
    quoiFaire: "Confronter chaque accord versé aux règles légales qu'il aménage, et enregistrer les accords comme lus : un accord déposé au dossier mais non lu n'a été articulé avec rien.",
    risque: "L. 1233-21 permet à un accord de fixer les modalités d'information et de consultation du comité, L. 1233-24-1 de déterminer le contenu du plan et les modalités de mise en œuvre des licenciements, L. 2254-2 de régir le refus d'un accord de performance collective. Appliquer la loi sans lire ces accords conduit à retenir un calendrier ou un contenu que l'accord a modifiés.",
    delai: "Une semaine de lecture, accord par accord.",
    document: "Tableau de confrontation des accords versés aux règles légales",
    etapes: [
      "Lister les accords versés et, pour chacun, les matières qu'il aménage.",
      "Confronter chaque stipulation à la règle légale correspondante : consultation du comité (L. 1233-21), contenu du plan et mise en œuvre des licenciements (L. 1233-24-1), refus d'un accord de performance collective (L. 2254-2).",
      "Écrire, matière par matière, ce que l'accord modifie et ce qu'il laisse à la loi.",
      "Marquer chaque accord comme lu, avec la date de lecture et le nom du lecteur.",
    ],
    verifs: [
      { cle: "ccn03Accords", question: "Quels accords ont été lus, et à quelles dates ?", attendu: "La liste, avec la date de lecture de chacun." },
      { cle: "ccn03Confrontation", question: "Quelles règles légales chaque accord aménage-t-il, et dans quel sens ?", attendu: "Le tableau de confrontation, matière par matière." },
    ],
  },

  "CTL-USA-01": {
    gravite: 4,
    quoiFaire: "Recenser par écrit les usages, engagements unilatéraux et décisions unilatérales plus favorables applicables dans l'entreprise, et les verser au dossier.",
    risque: "Ces normes ne figurent dans aucune base publique et priment lorsqu'elles sont plus favorables. Les ignorer conduit à appliquer un régime moins favorable que celui auquel les salariés ont droit ; leur articulation avec la loi et la convention excède le champ de la base, et ce contrôle ne conclut jamais à la conformité.",
    delai: "Une à deux semaines de recensement.",
    document: "Recensement des usages et engagements unilatéraux applicables",
    etapes: [
      "Interroger la direction des ressources humaines et les représentants du personnel sur les usages en vigueur : primes, indemnités, préavis, priorité de réembauche.",
      "Rechercher les engagements unilatéraux écrits — notes de service, courriers, procès-verbaux du comité.",
      "Écrire, pour chacun, son objet, sa date d'apparition et les salariés qu'il vise.",
      "Le verser au dossier et le faire examiner avec la convention et les accords.",
    ],
    verifs: [
      { cle: "usa01Recensement", question: "Quels usages ou engagements unilatéraux ont été recensés, et sur quoi portent-ils ?", attendu: "Le recensement écrit, usage par usage." },
      { cle: "usa01Sources", question: "Quelles pièces établissent chacun d'eux ?", attendu: "Les notes, courriers ou procès-verbaux, datés." },
    ],
  },

  "CTL-CTX-01": {
    gravite: 4,
    quoiFaire: "Signaler par écrit à la direction et au conseil de l'entreprise tout contentieux ou contrôle en cours, avant toute décision.",
    risque: "Un contentieux ou un contrôle en cours peut modifier la stratégie et les délais du projet. Le sujet excède le champ de la base : ce contrôle ne conclut jamais à la conformité, il signale.",
    delai: "Immédiat.",
    document: "Note de signalement des contentieux et contrôles en cours",
    etapes: [
      "Recenser les instances en cours : prud'homales, administratives, contrôles de l'inspection du travail ou de l'organisme de recouvrement.",
      "Pour chacune, indiquer l'objet, la juridiction ou l'autorité saisie, la date de saisine et l'état d'avancement.",
      "Transmettre la note à la direction et au conseil de l'entreprise avant toute décision sur le projet.",
      "Conserver la note au dossier : elle date le moment où l'information a été portée.",
    ],
    verifs: [
      { cle: "ctx01Liste", question: "Quels contentieux ou contrôles sont en cours, et depuis quand ?", attendu: "La liste, avec l'objet et la date de saisine de chacun." },
      { cle: "ctx01Signalement", question: "À qui la note a-t-elle été transmise, et à quelle date ?", attendu: "La note et sa preuve de transmission." },
    ],
  },

  /* ---------------- LES PIÈCES ---------------- */

  "CTL-PCE-01": {
    gravite: 4,
    quoiFaire: "Compléter les métadonnées de chaque pièce : nom de fichier, date, période couverte, auteur, version et périmètre — une case cochée n'établit ni la date, ni le périmètre, ni la complétude.",
    risque: "Une pièce sans date ne peut pas être confrontée à la chronologie de la procédure, et une pièce sans périmètre ne peut pas être rapportée au périmètre à démontrer. Les contrôles qui en dépendent — antériorité, périmètre, complétude — ne peuvent alors conclure ni dans un sens ni dans l'autre.",
    delai: "Quelques jours.",
    document: null,
    etapes: [
      "Reprendre les pièces seulement cochées comme versées et leur attacher un fichier réel.",
      "Renseigner pour chacune la date, la période couverte, l'auteur, la version et le périmètre.",
      "Reprendre ensuite les pièces incomplètes, champ manquant par champ manquant.",
      "Relancer l'audit : les contrôles de pièces et de chronologie pourront alors conclure.",
    ],
    verifs: [
      { cle: "pce01Metadonnees", question: "Combien de pièces sont enregistrées, et combien portent l'ensemble de leurs métadonnées ?", attendu: "Le décompte, et la liste des pièces incomplètes." },
      { cle: "pce01Manquants", question: "Pour les pièces incomplètes, quels champs manquent ?", attendu: "Le détail, pièce par pièce." },
    ],
  },

  "CTL-PCE-02": {
    gravite: 3,
    quoiFaire: "Remplacer les pièces postérieures à l'acte qu'elles justifient par des pièces contemporaines ; si la notification est déjà intervenue, ne pas redater et constater que ces pièces ne peuvent pas la justifier.",
    risque: "Une pièce postérieure à la notification ne peut pas justifier un acte antérieur : elle établit au contraire que l'élément n'existait pas au jour de la lettre. La démonstration de la cause ou du reclassement s'en trouve privée de support, et le licenciement peut être jugé sans cause réelle et sérieuse.",
    delai: "Quelques jours pour l'inventaire ; l'irrégularité elle-même ne se répare pas après la notification.",
    document: null,
    etapes: [
      "Relever la date de notification et lister les pièces dont la date lui est postérieure.",
      "Pour chacune, rechercher la pièce contemporaine correspondante — l'état, le tableau, l'attestation tels qu'ils existaient avant la lettre.",
      "Substituer la pièce contemporaine lorsqu'elle existe, et l'enregistrer avec sa vraie date.",
      "Lorsqu'elle n'existe pas, ne pas antidater : écarter la pièce de la démonstration et signaler le point au conseil de l'entreprise.",
    ],
    verifs: [
      { cle: "pce02Posterieures", question: "Quelles pièces portent une date postérieure à la notification ?", attendu: "La liste, pièce par pièce, avec les deux dates." },
      { cle: "pce02Substitution", question: "Pour chacune, une pièce contemporaine a-t-elle été retrouvée ?", attendu: "La pièce de substitution et sa date, ou le constat qu'il n'en existe pas." },
    ],
  },

  "CTL-PCE-03": {
    gravite: 3,
    quoiFaire: "Produire les pièces au périmètre à démontrer — secteur d'activité du groupe — et faire nommer par la pièce elle-même les sociétés qu'elle agrège.",
    risque: "L. 1233-3 fait apprécier la cause au périmètre pertinent. Une pièce comptable qui porte l'étiquette « groupe » ou « secteur » sans nommer les sociétés couvertes ne démontre pas que les agrégats portent sur ce périmètre : la démonstration risque de ne valoir que pour la seule entreprise, et le licenciement d'être jugé sans cause réelle et sérieuse.",
    delai: "Deux à quatre semaines : il faut refaire ou compléter les agrégats.",
    document: "Comptes du secteur d'activité nommant les sociétés agrégées",
    etapes: [
      "Énumérer les sociétés qui composent le secteur d'activité du groupe.",
      "Demander au producteur de la pièce comptable la liste des sociétés effectivement agrégées, et la faire figurer sur la pièce.",
      "Rapprocher les deux listes et compléter les agrégats des sociétés manquantes.",
      "Réenregistrer la pièce avec son périmètre et les sociétés couvertes.",
    ],
    verifs: [
      { cle: "pce03Perimetre", question: "Quel périmètre la pièce comptable déclare-t-elle couvrir ?", attendu: "L'étiquette de périmètre portée sur la pièce." },
      { cle: "pce03Couvertes", question: "Quelles sociétés la pièce nomme-t-elle comme agrégées, et lesquelles du secteur manquent ?", attendu: "Les deux listes, rapprochées société par société." },
    ],
  },

  "CTL-PCE-04": {
    gravite: 4,
    quoiFaire: "Faire lire et viser chaque pièce déposée, et enregistrer la lecture : le dépôt n'est pas la lecture, et la lecture n'est pas la conformité.",
    risque: "Une pièce déposée sans avoir été lue n'a été rapprochée d'aucune réponse du questionnaire. Les contradictions entre les déclarations et les pièces — celles que le juge relèvera — ne sont alors pas détectées avant la décision.",
    delai: "Quelques jours, selon le nombre de pièces.",
    document: null,
    etapes: [
      "Lister les pièces enregistrées mais non marquées comme lues.",
      "Les lire une à une et les rapprocher des réponses correspondantes du questionnaire.",
      "Noter les écarts constatés et les traiter avant de poursuivre.",
      "Marquer chaque pièce comme lue, avec la date et le nom du lecteur.",
    ],
    verifs: [
      { cle: "pce04NonLues", question: "Quelles pièces restent enregistrées sans avoir été lues ?", attendu: "La liste des pièces, par code." },
      { cle: "pce04Ecarts", question: "Quels écarts la lecture a-t-elle révélés entre les pièces et les réponses ?", attendu: "La note des écarts, ou le constat qu'il n'y en a pas." },
    ],
  },

  /* ---------------- EFFECTIFS ET PÉRIMÈTRE DES CRITÈRES D'ORDRE ---------------- */

  "CTL-EFF-01": {
    gravite: 4,
    quoiFaire: "Réconcilier l'effectif de l'établissement et celui de l'entreprise, pièces à l'appui.",
    risque: "Un effectif d'établissement supérieur à celui de l'entreprise est arithmétiquement impossible : il révèle une erreur de saisie ou une confusion de périmètre. Or les seuils de procédure s'apprécient au niveau de l'entreprise, et le périmètre des critères d'ordre au niveau que fixe L. 1233-5 : une erreur d'effectif déplace l'un et l'autre.",
    delai: "Un à deux jours.",
    document: null,
    etapes: [
      "Extraire l'effectif de l'entreprise et celui de l'établissement concerné, à la même date, du même registre.",
      "Identifier l'origine de l'écart : double compte, salariés mis à disposition, périmètre d'établissement mal délimité.",
      "Corriger la donnée saisie et joindre l'extraction qui l'établit.",
      "Relancer l'audit : les seuils de procédure et le périmètre des critères d'ordre en dépendent.",
    ],
    verifs: [
      { cle: "eff01Effectifs", question: "Quels sont l'effectif de l'entreprise et celui de l'établissement, à la même date ?", attendu: "Les deux nombres et la date d'appréciation." },
      { cle: "eff01Piece", question: "Quelle pièce établit ces effectifs ?", attendu: "L'extraction du registre du personnel ou la déclaration sociale, datée." },
    ],
  },

  "CTL-EFF-02": {
    gravite: 3,
    quoiFaire: "Ramener le périmètre d'application des critères d'ordre à celui qu'autorise L. 1233-5, ou verser l'accord collectif qui le fixe ; si les licenciements sont déjà notifiés sur un périmètre illicite, l'ordre ne se refait pas après coup.",
    risque: "L. 1233-5 permet à un accord collectif de fixer le périmètre d'application des critères d'ordre ; en l'absence d'un tel accord, ce périmètre ne peut être inférieur à celui de chaque zone d'emplois dans laquelle sont situés les établissements concernés par les suppressions d'emplois. Un périmètre réduit à l'établissement sans accord vicie l'ordre des licenciements et expose le licenciement à être jugé sans cause réelle et sérieuse.",
    delai: "Immédiat si le périmètre doit être élargi ; le temps de produire l'accord s'il existe.",
    document: "Accord collectif fixant le périmètre d'application des critères d'ordre, ou note de délimitation de la zone d'emplois",
    etapes: [
      "Relever le périmètre effectivement appliqué pour départager les salariés.",
      "S'il est réduit à l'établissement, rechercher l'accord collectif qui le prévoit et le verser comme pièce datée : c'est le seul titre auquel ce périmètre se défende.",
      "À défaut d'accord, élargir le périmètre à la zone d'emplois dans laquelle sont situés les établissements concernés, comme L. 1233-5 l'impose.",
      "Refaire l'application des critères d'ordre sur le périmètre corrigé, avant toute notification.",
    ],
    verifs: [
      { cle: "eff02Perimetre", question: "Quel périmètre a été appliqué pour l'ordre des licenciements ?", attendu: "Le périmètre retenu, écrit au dossier." },
      { cle: "eff02Accord", question: "Un accord collectif le fixe-t-il, et est-il versé avec sa date ?", attendu: "L'accord, daté. À défaut, la délimitation de la zone d'emplois." },
    ],
  },

  "CTL-ORD-02": {
    gravite: 3,
    quoiFaire: "Rattacher chaque catégorie professionnelle d'un seul salarié à une catégorie plus large, ou justifier par écrit la spécificité de la fonction — et le faire avant l'application des critères d'ordre, non après.",
    risque: "Une catégorie professionnelle regroupe les salariés exerçant des fonctions de même nature supposant une formation professionnelle commune. Une catégorie d'une seule personne désigne cette personne au lieu de la classer et neutralise les quatre critères de L. 1233-5 ; lorsqu'elle est occupée par un salarié protégé, la construction devient un ciblage. Le licenciement est alors exposé à être jugé sans cause réelle et sérieuse.",
    delai: "Une à deux semaines : il faut reconstruire les catégories et refaire le classement.",
    document: "Note de construction des catégories professionnelles",
    etapes: [
      "Lister les catégories professionnelles retenues et leur effectif, salarié par salarié.",
      "Pour chaque catégorie d'un seul salarié, rechercher les fonctions de même nature supposant une formation professionnelle commune et les regrouper.",
      "Si le regroupement est impossible, écrire ce qui rend la fonction spécifique : formation, qualification, technicité — et non le nom de son titulaire.",
      "Refaire l'application des quatre critères de L. 1233-5 sur les catégories reconstruites, avant toute notification.",
    ],
    verifs: [
      { cle: "ord02Categories", question: "Quelles catégories professionnelles ont été retenues, et quel est l'effectif de chacune ?", attendu: "La liste, avec l'effectif catégorie par catégorie." },
      { cle: "ord02Justification", question: "Pour chaque catégorie d'un seul salarié, quelle justification écrite figure au dossier ?", attendu: "La note de construction, catégorie par catégorie." },
    ],
  },

  /* ---------------- LE SEUIL DE DIX ---------------- */

  "CTL-SEU-01": {
    gravite: 3,
    quoiFaire: "Reprendre la procédure au régime du licenciement collectif d'au moins dix salariés : le seuil se compte sur la fenêtre de trente jours, licenciements déjà prononcés compris — une procédure conduite au régime allégé ne se convertit pas en cours de route.",
    risque: "L. 1233-28 soumet au régime collectif l'employeur qui envisage de licencier au moins dix salariés dans une même période de trente jours, et L. 1233-61 rend le plan de sauvegarde de l'emploi obligatoire à ce seuil dans les entreprises d'au moins cinquante salariés. Conduire la procédure au régime des moins de dix salariés, c'est omettre la consultation, la saisine de l'administration et, le cas échéant, le plan : le licenciement prononcé sans décision de validation ou d'homologation est nul (L. 1235-10).",
    delai: "Il faut reprendre la procédure au début : plusieurs semaines à plusieurs mois.",
    document: "Note de décompte des licenciements sur la fenêtre de trente jours",
    etapes: [
      "Compter les licenciements économiques déjà prononcés dans les trente jours et les ajouter au projet en cours.",
      "Si le total atteint dix, arrêter la procédure engagée au régime allégé avant tout acte suivant.",
      "Reprendre au régime collectif : convocation et consultation du comité selon L. 1233-28, notification du projet à l'autorité administrative selon L. 1233-46, et plan de sauvegarde de l'emploi si l'entreprise atteint cinquante salariés (L. 1233-61).",
      "Consigner le décompte par écrit : c'est lui qui justifiera le régime retenu.",
    ],
    verifs: [
      { cle: "seu01Recents", question: "Combien de licenciements économiques ont été prononcés dans les trente jours précédents, et à quelles dates ?", attendu: "Le décompte nominatif et daté." },
      { cle: "seu01Total", question: "Quel est le total sur la fenêtre de trente jours, projet compris, et quel régime en découle ?", attendu: "Le total et le régime retenu, écrits au dossier." },
    ],
  },

  "CTL-SEU-02": {
    gravite: 3,
    quoiFaire: "Soumettre au régime du licenciement collectif les licenciements consécutifs aux refus de modification du contrat lorsque au moins dix salariés ont refusé — et si la procédure a été conduite comme un licenciement de moins de dix salariés, la reprendre au bon régime.",
    risque: "L. 1233-25 soumet aux dispositions applicables en cas de licenciement collectif pour motif économique le licenciement envisagé lorsque au moins dix salariés ont refusé la modification d'un élément essentiel de leur contrat proposée pour l'un des motifs de L. 1233-3. La procédure conduite au régime allégé est alors irrégulière, et l'absence de plan de sauvegarde de l'emploi expose à la nullité de L. 1235-10.",
    delai: "Il faut reprendre la procédure : plusieurs semaines.",
    document: "Décompte des refus de modification du contrat de travail",
    etapes: [
      "Recenser nominativement les salariés ayant refusé la modification d'un élément essentiel de leur contrat, avec la date de leur refus.",
      "Vérifier que la modification était proposée pour l'un des motifs économiques de L. 1233-3 : c'est la condition posée par L. 1233-25.",
      "Si le seuil de dix refus est atteint, arrêter la procédure individuelle et reprendre au régime collectif.",
      "Consigner le décompte au dossier avant la convocation du comité.",
    ],
    verifs: [
      { cle: "seu02Refus", question: "Combien de salariés ont refusé la modification, et à quelles dates ?", attendu: "Le décompte nominatif et daté, avec les lettres de refus." },
      { cle: "seu02Motif", question: "Pour quel motif économique la modification avait-elle été proposée ?", attendu: "Le motif invoqué dans la proposition, et la proposition elle-même." },
    ],
  },

  "CTL-SEU-03": {
    gravite: 3,
    quoiFaire: "Soumettre tout nouveau licenciement économique des trois mois à venir au régime du licenciement collectif d'au moins dix salariés, la règle anti-fractionnement de L. 1233-26 étant déclenchée.",
    risque: "L. 1233-26 soumet aux dispositions du chapitre tout nouveau licenciement économique envisagé au cours des trois mois suivants lorsque l'entreprise ou l'établissement d'au moins cinquante salariés a procédé, pendant trois mois consécutifs, à des licenciements économiques de plus de dix salariés au total sans atteindre dix sur une même période de trente jours. Conduire la nouvelle procédure au régime allégé la rend irrégulière.",
    delai: "Le temps de la procédure collective : plusieurs semaines.",
    document: "Relevé des licenciements économiques des trois mois consécutifs précédents",
    etapes: [
      "Relever, mois par mois, les licenciements économiques prononcés au cours des trois mois consécutifs précédents et en faire le total.",
      "Vérifier l'effectif : L. 1233-26 ne vise que les entreprises ou établissements employant habituellement au moins cinquante salariés.",
      "Si le total dépasse dix sans qu'aucune période de trente jours en compte dix, appliquer le régime collectif au nouveau projet.",
      "Conserver le relevé : c'est lui qui justifie le régime retenu.",
    ],
    verifs: [
      { cle: "seu03Releve", question: "Combien de licenciements économiques ont été prononcés au cours des trois mois consécutifs précédents, mois par mois ?", attendu: "Le relevé daté, licenciement par licenciement." },
      { cle: "seu03Regime", question: "Quel régime a été retenu pour le nouveau projet, et où est-il écrit ?", attendu: "La note fixant le régime, avec son fondement." },
    ],
  },

  /* ---------------- COHÉRENCE ---------------- */

  "CTL-COH-01": {
    gravite: 3,
    quoiFaire: "Trancher : retirer le poste de la liste des postes disponibles ou de celle des postes supprimés, et refaire la démonstration de suppression en conséquence.",
    risque: "Un poste ne peut pas être à la fois supprimé au sens de L. 1233-3 et disponible au reclassement au sens de L. 1233-4. La contradiction fait tomber l'une des deux affirmations : soit l'emploi n'est pas supprimé et la cause n'est pas caractérisée, soit il n'était pas disponible et le reclassement a été mal recensé. Dans les deux cas, le licenciement est exposé à être jugé sans cause réelle et sérieuse.",
    delai: "Quelques jours, mais la démonstration de suppression doit être refaite.",
    document: "Note de résolution de la contradiction, poste par poste",
    etapes: [
      "Lister les postes figurant à la fois parmi les postes supprimés et parmi les postes disponibles dans l'entreprise.",
      "Pour chacun, établir sa situation réelle à la date utile : occupé et supprimé, ou vacant et disponible.",
      "Corriger celle des deux listes qui est fausse, et refaire le décompte des suppressions comme celui des postes à proposer.",
      "Refaire la démonstration de suppression d'emploi et la remettre au comité si elle a déjà été présentée.",
    ],
    verifs: [
      { cle: "coh01Postes", question: "Quels postes figurent à la fois comme supprimés et comme disponibles ?", attendu: "La liste, intitulé par intitulé." },
      { cle: "coh01Resolution", question: "Pour chacun, quelle situation a été retenue, et sur quelle pièce ?", attendu: "La note de résolution et la pièce qui l'établit." },
    ],
  },

  "CTL-COH-02": {
    gravite: 3,
    quoiFaire: "Compter les postes et non les offres : si un même poste est proposé à plusieurs salariés, faire figurer les critères de départage entre eux, comme le III de D. 1233-2-1 l'impose pour la liste diffusée.",
    risque: "Le nombre d'offres ne vaut pas nombre de postes. Proposer le même poste à plusieurs salariés sans dire comment ils seront départagés revient à n'offrir qu'un poste pour plusieurs : l'obligation de reclassement de L. 1233-4 n'est satisfaite que pour l'un d'eux, et le licenciement des autres est exposé à être jugé sans cause réelle et sérieuse.",
    delai: "Quelques jours, plus le délai de réponse rouvert.",
    document: "Liste des offres avec critères de départage entre candidatures multiples",
    etapes: [
      "Rapprocher les offres par poste — intitulé, employeur, lieu — et compter les destinataires de chacun.",
      "Pour les postes proposés à plusieurs salariés, écrire les critères de départage en cas de candidatures multiples.",
      "Communiquer ces critères aux salariés concernés, avec le délai dont ils disposent pour présenter leur candidature écrite.",
      "Refaire le décompte des postes réellement offerts à chaque salarié, et compléter les offres si le compte n'y est pas.",
    ],
    verifs: [
      { cle: "coh02Partages", question: "Quels postes ont été proposés à plusieurs salariés, et à combien de destinataires chacun ?", attendu: "Le tableau des offres regroupées par poste." },
      { cle: "coh02Departage", question: "Quels critères de départage ont été communiqués, et à quelle date ?", attendu: "Les critères écrits et la preuve de leur communication." },
    ],
  },

  "CTL-COH-03": {
    gravite: 3,
    quoiFaire: "Renseigner les quatre critères de L. 1233-5 avec des valeurs différenciées, justifiées salarié par salarié — un critère qui prend la même valeur pour tous ne départage personne.",
    risque: "L. 1233-5 impose de prendre en compte les charges de famille, l'ancienneté de service, la situation des salariés dont la réinsertion est particulièrement difficile et les qualités professionnelles appréciées par catégorie ; l'employeur peut privilégier l'un d'eux à condition de tenir compte de tous les autres. Des critères formellement présents mais matériellement neutralisés font reposer le départage sur un seul : l'ordre des licenciements est alors contestable et le licenciement exposé.",
    delai: "Une à deux semaines : chaque valeur doit être justifiée.",
    document: "Tableau d'application des quatre critères de L. 1233-5, salarié par salarié",
    etapes: [
      "Reprendre les quatre critères de L. 1233-5 et, pour chacun, relever les valeurs attribuées à chaque salarié de la catégorie.",
      "Identifier les critères dont la valeur est identique pour tous et vérifier si cette identité est réelle ou résulte d'un renseignement par défaut.",
      "Documenter chaque valeur par une pièce : composition de famille, ancienneté, reconnaissance de travailleur handicapé, évaluations professionnelles.",
      "Refaire le classement sur les valeurs corrigées, et conserver le tableau : sur demande écrite du salarié, l'employeur indique par écrit les critères retenus (L. 1233-43).",
    ],
    verifs: [
      { cle: "coh03Valeurs", question: "Quelles valeurs chacun des quatre critères prend-il, salarié par salarié ?", attendu: "Le tableau d'application complet." },
      { cle: "coh03Pieces", question: "Quelles pièces justifient les valeurs retenues pour chaque critère ?", attendu: "Les pièces, critère par critère." },
    ],
  },

  "CTL-VAL-01": {
    gravite: 4,
    quoiFaire: "Corriger les données signalées comme impossibles ou incohérentes avant de lire le reste du rapport, puis relancer l'audit.",
    risque: "Tant qu'une donnée impossible subsiste, les verdicts qui l'utilisent ne valent rien : ils peuvent conclure à la conformité comme à la non-conformité sur une valeur qui ne peut pas exister. Décider sur un tel rapport, c'est décider sans savoir.",
    delai: "Quelques heures : ce sont des saisies à reprendre.",
    document: null,
    etapes: [
      "Reprendre chaque donnée signalée : le champ, la valeur saisie et le motif de l'anomalie sont indiqués par le contrôle.",
      "Corriger la saisie à partir de la pièce d'origine, et non de mémoire.",
      "Vérifier les dates entre elles — convocation, réunions, avis, notification — et les effectifs entre eux.",
      "Relancer l'audit et ne lire les verdicts qu'ensuite.",
    ],
    verifs: [
      { cle: "val01Anomalies", question: "Quelles données ont été signalées comme impossibles ou incohérentes ?", attendu: "La liste des champs et des valeurs signalés." },
      { cle: "val01Correction", question: "Pour chacune, quelle valeur a été retenue, et sur quelle pièce ?", attendu: "La valeur corrigée et la pièce d'origine." },
    ],
  },

  /* ---------------- DROIT DANS LE TEMPS ---------------- */

  "CTL-TMP-01": {
    gravite: 3,
    quoiFaire: "Renseigner la date de notification pour que la version applicable de L. 1233-3 soit déterminée, et faire relire le dossier par un professionnel lorsqu'il est régi par une version abrogée.",
    risque: "La version applicable de L. 1233-3 est celle en vigueur au jour de la notification. Raisonner sur la version en vigueur aujourd'hui est faux pour tout licenciement antérieur au 24 septembre 2017 : le seuil trimestriel chiffré et la limitation du périmètre au territoire national n'existaient pas dans les versions antérieures. La base connaît les trois versions, elle ne connaît pas la jurisprudence propre à chacune.",
    delai: "Immédiat pour la date ; une à deux semaines pour la relecture professionnelle.",
    document: "Note de relecture du dossier au regard de la version applicable du texte",
    etapes: [
      "Renseigner la date de notification, ou la date envisagée : c'est elle qui commande la version du texte.",
      "Lire la version que l'application retient et ce qu'elle porte, indiquées dans le motif du contrôle.",
      "Si la notification est antérieure au 24 septembre 2017, confier le dossier à un professionnel : le périmètre d'appréciation et les indicateurs applicables ne sont pas ceux de la version en vigueur.",
      "Conserver au dossier la version retenue et la note de relecture : c'est ce qui datera le raisonnement.",
    ],
    verifs: [
      { cle: "tmp01Date", question: "Quelle est la date de notification retenue ?", attendu: "La date, au format AAAA-MM-JJ." },
      { cle: "tmp01Version", question: "Quelle version de L. 1233-3 s'applique à cette date, et le dossier a-t-il été relu en conséquence ?", attendu: "La version retenue et, si elle est abrogée, la note de relecture." },
    ],
  },

  /* ---------------- PROCÉDURE COLLECTIVE ---------------- */

  "CTL-PCO-01": {
    gravite: 4,
    quoiFaire: "Renseigner la nature de la procédure collective, la date du jugement d'ouverture ou de liquidation et la qualité de celui qui met en œuvre le plan — employeur, administrateur ou liquidateur.",
    risque: "L. 1233-58 fait dépendre le régime applicable de ces trois éléments : il désigne, selon le cas, l'employeur, l'administrateur ou le liquidateur comme auteur du plan de licenciement, et renvoie à des articles de consultation différents selon le nombre de licenciements et l'effectif. Tant qu'ils manquent, le régime ne peut pas être appliqué.",
    delai: "Immédiat : ce sont trois données à renseigner.",
    document: null,
    etapes: [
      "Relever la nature de la procédure — sauvegarde, redressement judiciaire ou liquidation judiciaire — sur le jugement.",
      "Relever la date du jugement d'ouverture ou de liquidation.",
      "Indiquer la qualité de celui qui met en œuvre le plan de licenciement, telle que L. 1233-58 la désigne.",
      "Relancer l'audit : la consultation du comité et le plan de sauvegarde de l'emploi obéissent alors au régime correspondant.",
    ],
    verifs: [
      { cle: "pco01Nature", question: "Quelle est la nature de la procédure collective et la date du jugement ?", attendu: "Le jugement, avec sa date et sa nature." },
      { cle: "pco01Auteur", question: "Qui met en œuvre le plan de licenciement — employeur, administrateur ou liquidateur ?", attendu: "La qualité, et l'acte qui la désigne." },
    ],
  },

  "CTL-PCO-02": {
    gravite: 3,
    quoiFaire: "Obtenir l'ordonnance du juge-commissaire autorisant les licenciements et informer l'autorité administrative avant d'y procéder — une notification intervenue sans l'une ou l'autre ne se régularise pas après coup.",
    risque: "En redressement comme en liquidation, les licenciements présentant un caractère urgent, inévitable et indispensable sont autorisés par ordonnance du juge-commissaire ; sans elle, la notification est dépourvue de fondement. L. 1233-60 impose en outre d'informer l'autorité administrative avant de procéder aux licenciements, dans les conditions du code de commerce auxquelles il renvoie.",
    delai: "Le temps de la requête et de l'ordonnance ; l'information de l'administration est immédiate.",
    document: "Requête et ordonnance du juge-commissaire, et information de l'autorité administrative",
    etapes: [
      "Établir la requête au juge-commissaire en caractérisant l'urgence, le caractère inévitable et indispensable des licenciements envisagés.",
      "Attendre l'ordonnance et relever sa date : elle doit précéder toute notification.",
      "Informer l'autorité administrative avant de procéder aux licenciements, comme L. 1233-60 l'impose, et conserver l'accusé de réception.",
      "Ne notifier qu'ensuite, et dans le périmètre exact que l'ordonnance autorise.",
    ],
    verifs: [
      { cle: "pco02Ordonnance", question: "L'ordonnance du juge-commissaire est-elle versée, et quelle date porte-t-elle ?", attendu: "L'ordonnance datée, et le périmètre qu'elle autorise." },
      { cle: "pco02Admin", question: "À quelle date l'autorité administrative a-t-elle été informée ?", attendu: "La date et l'accusé de réception." },
    ],
  },

  "CTL-PCO-03": {
    gravite: 2,
    quoiFaire: "Notifier dans la fenêtre que L. 3253-8 ouvre après le jugement de liquidation ; si elle est déjà expirée, ne pas notifier sans avoir mesuré la charge que représentent des créances non garanties.",
    risque: "L. 3253-8, 2° c) couvre les créances résultant de la rupture des contrats de travail intervenant dans les quinze jours, ou vingt et un jours lorsqu'un plan de sauvegarde de l'emploi est élaboré, suivant le jugement de liquidation. Hors de cette fenêtre, les créances de rupture ne sont pas garanties : indemnités et préavis restent à la charge de la procédure, et les salariés ne sont pas payés par la garantie.",
    delai: "Quinze jours à compter du jugement de liquidation, vingt et un lorsqu'un plan de sauvegarde de l'emploi est élaboré.",
    document: "Calendrier de notification calé sur le jugement de liquidation",
    etapes: [
      "Relever la date du jugement de liquidation et calculer la date limite : quinze jours, ou vingt et un si un plan de sauvegarde de l'emploi est élaboré.",
      "Vérifier que la notification envisagée est postérieure au jugement et antérieure à cette limite.",
      "Si la fenêtre n'est pas encore expirée, avancer la notification pour y entrer.",
      "Si elle est expirée, ne pas antidater : mesurer avec le liquidateur la charge des créances non garanties avant de notifier.",
    ],
    verifs: [
      { cle: "pco03Jugement", question: "Quelle est la date du jugement de liquidation ?", attendu: "Le jugement, daté." },
      { cle: "pco03Fenetre", question: "Quelle est la date de notification, et combien de jours la séparent du jugement ?", attendu: "La date et l'écart en jours, rapportés à la fenêtre de quinze ou vingt et un jours." },
    ],
  },

  /* ---------------- FERMETURE DE SITE, GROUPE, TRANSFERT, QUALIFICATION ---------------- */

  "CTL-REP-01": {
    gravite: 3,
    quoiFaire: "Engager la recherche d'un repreneur dès l'information du comité et l'informer de son déroulement : mandat, journal des candidats, motifs d'écartement.",
    risque: "L'obligation de recherche d'un repreneur des articles L. 1233-57-9 à L. 1233-57-14 pèse sur l'entreprise d'au moins mille salariés qui envisage la fermeture d'un établissement, et son respect est vérifié par l'autorité administrative au titre de L. 1233-57-3. L. 1233-57-20 impose en outre, avant la fin de la procédure d'information et de consultation, de présenter au comité un rapport sur les actions engagées, les offres reçues et les motifs de refus. Le comité peut saisir le juge du respect de cette obligation.",
    delai: "Toute la durée de la procédure d'information et de consultation, dès son ouverture.",
    document: "Dossier de recherche de repreneur : mandat, journal des candidats, motifs d'écartement, rapport au comité",
    etapes: [
      "Engager la recherche dès l'information du comité sur le projet de fermeture, et non après.",
      "Confier un mandat écrit et daté, et tenir le journal des contacts et des candidats.",
      "Informer le comité du déroulement de la recherche au fil des réunions, et consigner cette information au procès-verbal.",
      "Consulter le comité sur toute offre de reprise à laquelle l'entreprise souhaite donner suite, en indiquant les raisons de ce choix (L. 1233-57-19).",
      "Avant la fin de la procédure d'information et de consultation, si aucune offre n'a été reçue ou retenue, réunir le comité et lui présenter le rapport de L. 1233-57-20, communiqué à l'autorité administrative.",
    ],
    verifs: [
      { cle: "rep01Mandat", question: "À quelle date la recherche de repreneur a-t-elle été engagée, et sous quel mandat ?", attendu: "Le mandat écrit et daté." },
      { cle: "rep01Journal", question: "Où est le journal des candidats, et quels motifs d'écartement y figurent ?", attendu: "Le journal, candidat par candidat, avec les motifs." },
      { cle: "rep01Rapport", question: "Le rapport au comité a-t-il été présenté avant la fin de la procédure, et communiqué à l'administration ?", attendu: "Le rapport, sa date de présentation et sa communication." },
    ],
  },

  "CTL-FRA-01": {
    gravite: 3,
    quoiFaire: "Produire le résultat d'exploitation reconstitué hors flux intragroupe — redevances de marque, management fees, prix de transfert — avec le détail des flux qui permet de le recalculer, et faire examiner l'origine des difficultés par un professionnel.",
    risque: "Des difficultés qui disparaissent une fois les flux intragroupe neutralisés ne caractérisent pas celles de L. 1233-3 : elles peuvent procéder de l'organisation du groupe. Une reconstitution qui ne se recalcule pas ne démontre rien. L'appréciation excède le champ de la base, et ce contrôle ne conclut jamais à la conformité.",
    delai: "Deux à quatre semaines : la reconstitution suppose le détail des flux.",
    document: "Reconstitution du résultat d'exploitation hors flux intragroupe, exercice par exercice",
    etapes: [
      "Relever, exercice par exercice, le résultat d'exploitation déclaré.",
      "Détailler les flux intragroupe du même exercice : redevances de marque, management fees, prix de transfert, en montants.",
      "Recalculer le résultat reconstitué — résultat d'exploitation augmenté des flux de l'exercice — et vérifier qu'il correspond au montant déclaré.",
      "Faire examiner par un avocat ou un juriste en droit social ce que ces flux impliquent sur le périmètre d'appréciation de la cause.",
    ],
    verifs: [
      { cle: "fra01Flux", question: "Quels flux intragroupe ont été identifiés, exercice par exercice, et pour quels montants ?", attendu: "Le détail des flux, poste par poste." },
      { cle: "fra01Recalcul", question: "Le résultat reconstitué se recalcule-t-il à partir du résultat déclaré et de ces flux ?", attendu: "Le calcul écrit, exercice par exercice." },
    ],
  },

  "CTL-TRF-01": {
    gravite: 3,
    quoiFaire: "Faire examiner par un professionnel l'articulation du transfert d'entité avec le projet de licenciement, et la répartition des salariés entre l'entité transférée et celle qui demeure, avant toute notification.",
    risque: "L. 1224-1 fait subsister avec le nouvel employeur tous les contrats de travail en cours au jour de la modification de la situation juridique de l'employeur. Les licenciements prononcés à l'occasion du transfert se heurtent à cette règle, et la répartition des salariés entre l'entité transférée et celle qui demeure décide de leur sort. Ce contrôle ne conclut jamais à la conformité.",
    delai: "Deux à quatre semaines d'examen extérieur, avant toute notification.",
    document: "Note d'un conseil sur l'articulation du transfert et du projet de licenciement",
    etapes: [
      "Décrire l'opération envisagée et la date de la modification dans la situation juridique de l'employeur.",
      "Établir la répartition nominative des salariés entre l'entité transférée et celle qui demeure, avec le critère de rattachement retenu.",
      "Confier l'examen à un avocat ou à un juriste en droit social : c'est lui qui dira quels contrats subsistent avec le nouvel employeur au sens de L. 1224-1.",
      "Différer la notification des salariés rattachés à l'entité transférée jusqu'à la conclusion de cet examen.",
    ],
    verifs: [
      { cle: "trf01Operation", question: "Quelle opération est envisagée, et à quelle date la modification doit-elle intervenir ?", attendu: "La description de l'opération et sa date." },
      { cle: "trf01Repartition", question: "Comment les salariés sont-ils répartis entre l'entité transférée et celle qui demeure, et selon quel critère ?", attendu: "La répartition nominative et le critère écrit." },
    ],
  },

  "CTL-APC-01": {
    gravite: 3,
    quoiFaire: "Requalifier : le licenciement consécutif au refus d'un accord de performance collective n'est pas économique et ne suit pas cette procédure — le sortir du projet plutôt que de l'y maintenir.",
    risque: "L. 2254-2 régit l'accord de performance collective et le sort du salarié qui en refuse l'application. Le licenciement qui suit ce refus repose sur un motif spécifique et n'est pas un licenciement pour motif économique : lui appliquer le régime de L. 1233-3 — cause économique, critères d'ordre, plan de sauvegarde de l'emploi — est une erreur de qualification, et les développements du rapport sur ces points ne lui sont pas applicables.",
    delai: "Immédiat : c'est une qualification à corriger avant tout acte.",
    document: "Note de qualification du licenciement consécutif au refus d'un accord de performance collective",
    etapes: [
      "Identifier nominativement les salariés dont le licenciement est envisagé à la suite du refus d'un accord de performance collective.",
      "Les retirer du projet de licenciement économique : ni la cause de L. 1233-3, ni les critères d'ordre de L. 1233-5, ni le plan de sauvegarde de l'emploi ne les concernent à ce titre.",
      "Conduire leur licenciement selon le régime propre au refus de l'accord, tel que L. 2254-2 l'organise.",
      "Refaire les décomptes du projet économique — seuil de dix, effectifs concernés — une fois ces salariés retirés.",
    ],
    verifs: [
      { cle: "apc01Salaries", question: "Quels salariés sont concernés par un refus d'accord de performance collective, et à quelles dates ont-ils refusé ?", attendu: "La liste nominative et les refus écrits, datés." },
      { cle: "apc01Qualification", question: "Ces salariés ont-ils été retirés du projet de licenciement économique, et où la note de qualification figure-t-elle ?", attendu: "La note de qualification et le décompte du projet, corrigé." },
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
      /* Deux vérifications qui portent la même clé se recouvrent : la réponse de
         l'une vaudrait pour l'autre, et un point serait tenu pour vérifié sans
         l'avoir été. */
      if (v.cle && CLES.has(v.cle))
        ECARTS.push(`${id} : la clé de vérification « ${v.cle} » est déjà employée par ${CLES.get(v.cle)}`);
      else if (v.cle) CLES.set(v.cle, id);
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
