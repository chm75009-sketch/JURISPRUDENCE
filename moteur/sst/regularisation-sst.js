/* Ce qu'il faut faire quand un contrôle de la santé, de la sécurité et des
   conditions de travail ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger (l'exposition aux sanctions, qui ne se
   régularise pas pour elle-même), et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Une précaution propre à ce module : aucune sanction n'est annoncée qui ne
   soit dans un texte lu. R. 4741-1 punit le défaut de transcription et le
   défaut de mise à jour de l'évaluation des risques, dans les conditions des
   articles R. 4121-1 et R. 4121-2 — et rien d'autre. L'amende de L. 4741-1 vise
   les livres et titres que ce texte énumère, non les principes généraux de
   prévention : elle n'est donc pas invoquée ici pour le document unique.
   Aucune pénalité financière n'est prévue par les textes captés pour ce
   domaine : le degré 2 ne sert pas dans ce fichier, et c'est délibéré.

   CE QUI A CHANGÉ LE 24 AOÛT 2026. Le corpus a été complété par deux textes
   répressifs qui manquaient, lus à la source, deux lectures concordantes
   chacun, et versés dans textes-sst.json :
     L. 2317-1 (LEGIARTI000035634273) — l'entrave au comité social et
       économique. « Le fait d'apporter une entrave à leur fonctionnement
       régulier est puni d'une amende de 7 500 €. » Deux contrôles de ce
       module portent sur le comité et passent au degré 1 : la consultation
       sur le document unique (SST-CTL-DUE-07) et la commission santé,
       sécurité et conditions de travail qui n'est pas créée là où elle est
       due (SST-CTL-CSS-01). Le module CSE cite le même texte dans les mêmes
       termes, et cote ces deux points au même degré.
     R. 4741-3 (LEGIARTI000020398000) — les documents et affichages
       obligatoires. Il n'est invoqué nulle part : il est capté parce que son
       intitulé pouvait laisser croire qu'il atteignait l'avis d'accès au
       document unique de R. 4121-4, et la lecture montre qu'il ne l'atteint
       pas. Un texte capté pour fermer une hypothèse vaut un texte capté pour
       en ouvrir une.
   Ce qui n'a pas bougé n'a pas bougé par défaut de texte, et non par
   prudence : trois commentaires de bloc, devant SST-CTL-DUE-05,
   SST-CTL-CSS-02 et SST-CTL-HAR-01, disent article par article ce que les
   textes répressifs captés n'atteignent pas. Ils sont là pour qu'on ne
   « corrige » pas ces degrés sans avoir relu.

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-sst.json, et publier-sst.js confronte les deux. */

const { C } = require("./controles-sst.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

const R = {

  /* ------------------------------------------------------ le document unique */

  "SST-CTL-DUE-01": {
    gravite: 1,
    quoiFaire: "Évaluer les risques pour la santé et la sécurité des travailleurs, et en transcrire les résultats dans un document unique.",
    risque: "Le fait de ne pas transcrire les résultats de l'évaluation des risques dans les conditions prévues à R. 4121-1 est puni de l'amende prévue pour les contraventions de la cinquième classe, la récidive étant réprimée conformément aux articles 132-11 et 132-15 du code pénal (R. 4741-1). Le document unique est dû par tout employeur, sans seuil d'effectif.",
    delai: "Un à trois mois : l'évaluation se conduit unité de travail par unité de travail, et elle ne se rattrape pas en une journée.",
    document: "Document unique d'évaluation des risques professionnels — inventaire par unité de travail",
    etapes: [
      "Recenser les unités de travail de l'entreprise ou de l'établissement : c'est la maille que R. 4121-1 impose à l'inventaire, et c'est elle qui commande tout le reste.",
      "Évaluer, pour chacune, les risques pour la santé et la sécurité des travailleurs — y compris dans le choix des procédés de fabrication, des équipements de travail, des substances ou préparations chimiques, dans l'aménagement des lieux et des installations, dans l'organisation du travail et dans la définition des postes (L. 4121-3) — en tenant compte de l'impact différencié de l'exposition au risque en fonction du sexe.",
      "Appeler les contributions que L. 4121-3 prévoit : celle du comité social et économique et de sa commission santé, sécurité et conditions de travail s'ils existent, celle du ou des salariés désignés pour s'occuper des activités de protection et de prévention s'ils ont été désignés, celle du service de prévention et de santé au travail auquel l'employeur adhère.",
      "Transcrire les résultats dans le document unique : il répertorie l'ensemble des risques professionnels auxquels les travailleurs sont exposés et assure la traçabilité collective de ces expositions (L. 4121-3-1, I et II).",
      "En tirer les suites que le III de L. 4121-3-1 commande — programme annuel de prévention à partir de cinquante salariés, liste d'actions consignée en deçà — puis consulter le comité (L. 4121-3, 1°), transmettre le document au service de prévention et de santé au travail (L. 4121-3-1, VI) et le conserver (L. 4121-3-1, V) : chacun de ces points est contrôlé pour lui-même.",
    ],
    verifs: [
      { cle: "due01Piece", question: "Où se trouve le document unique, et de quand date la version en vigueur ?", attendu: "Le document lui-même, daté. Un projet, un modèle vierge ou un document de branche non repris ne vaut pas transcription." },
      { cle: "due01Perimetre", question: "Quels établissements et quelles unités de travail ce document couvre-t-il ?", attendu: "La liste des unités couvertes, confrontée à l'organisation réelle de l'entreprise." },
      { cle: "due01Contributions", question: "Quelles contributions ont nourri l'évaluation — comité, salarié désigné, service de prévention et de santé au travail ?", attendu: "Les avis, comptes rendus ou échanges, datés (L. 4121-3)." },
    ],
  },

  "SST-CTL-DUE-02": {
    gravite: 1,
    quoiFaire: "Reprendre le document unique pour qu'il comporte l'inventaire des risques identifiés dans chaque unité de travail.",
    risque: "R. 4741-1 punit de l'amende prévue pour les contraventions de la cinquième classe le fait de ne pas transcrire les résultats de l'évaluation dans les conditions prévues aux articles R. 4121-1 et R. 4121-2 — et l'inventaire par unité de travail est l'une de ces conditions. Un document global, sans maille, ne vaut pas transcription.",
    delai: "Deux à six semaines si le document existe déjà : c'est la maille qu'il faut reprendre, non l'évaluation entière.",
    document: "Inventaire des risques par unité de travail, annexé au document unique",
    etapes: [
      "Arrêter la liste des unités de travail : postes, ateliers, services, sites — la découpe doit refléter les situations d'exposition réelles, non l'organigramme.",
      "Pour chaque unité, identifier les risques et les consigner distinctement, sans renvoyer à un inventaire commun : R. 4121-1 exige un inventaire dans chaque unité.",
      "Ne pas omettre les risques liés aux ambiances thermiques, que R. 4121-1 mentionne expressément, ni les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes, que L. 4121-2, 7°, fait entrer dans la planification de la prévention.",
      "Tenir compte de l'impact différencié de l'exposition au risque en fonction du sexe (L. 4121-3).",
      "Réintégrer l'inventaire au document unique, dater la nouvelle version et conserver la précédente (L. 4121-3-1, V).",
    ],
    verifs: [
      { cle: "due02Unites", question: "Quelles sont les unités de travail retenues, et sur quoi repose ce découpage ?", attendu: "La liste des unités et la logique du découpage, confrontées aux situations de travail réelles." },
      { cle: "due02Inventaire", question: "Chaque unité a-t-elle son propre inventaire de risques dans le document ?", attendu: "Le document, ouvert à la section d'une unité prise au hasard." },
      { cle: "due02Thermiques", question: "Les risques liés aux ambiances thermiques figurent-ils à l'inventaire ?", attendu: "La mention dans les unités concernées ; R. 4121-1 les vise expressément." },
    ],
  },

  "SST-CTL-DUE-03": {
    gravite: 1,
    quoiFaire: "Mettre à jour le document unique et dater la nouvelle version.",
    risque: "Le fait de ne pas mettre à jour les résultats de l'évaluation des risques dans les conditions prévues aux articles R. 4121-1 et R. 4121-2 est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1). Dans les entreprises d'au moins onze salariés, la mise à jour est due au moins chaque année (R. 4121-2, 1°).",
    delai: "Deux à quatre semaines : le retard se compte à partir de la date de la dernière version, et il ne cesse qu'avec la version nouvelle.",
    document: "Mise à jour du document unique — version datée et suites revues",
    etapes: [
      "Relever la date de la version en vigueur : c'est d'elle que court l'année de R. 4121-2, 1°.",
      "Reprendre l'inventaire unité par unité, en intégrant ce qui a changé depuis — postes, équipements, procédés, effectifs, organisation.",
      "Dans une entreprise de moins de onze salariés, où la mise à jour peut être moins fréquente qu'annuelle, écrire ce qui garantit un niveau équivalent de protection de la santé et de la sécurité des travailleurs (L. 4121-3, dernier alinéa) : cette garantie s'apprécie au fond, elle ne se présume pas.",
      "Mettre à jour, si nécessaire, le programme annuel de prévention ou la liste des actions de prévention et de protection : R. 4121-2 impose que cette révision se fasse à chaque mise à jour du document unique.",
      "Dater la nouvelle version sans écraser la précédente (L. 4121-3-1, V), consulter le comité social et économique (L. 4121-3, 1°) et transmettre le document au service de prévention et de santé au travail (L. 4121-3-1, VI).",
    ],
    verifs: [
      { cle: "due03DateMaj", question: "À quelle date la dernière mise à jour du document unique a-t-elle été faite ?", attendu: "La date portée sur la version elle-même, et non celle d'une réunion ou d'un courriel." },
      { cle: "due03Effectif", question: "Quel est l'effectif de l'entreprise, et depuis quand ?", attendu: "L'effectif : à partir de onze salariés, la mise à jour est au moins annuelle (R. 4121-2, 1°)." },
      { cle: "due03Suites", question: "Le programme annuel de prévention ou la liste des actions a-t-il été revu à cette occasion ?", attendu: "La version revue, ou la raison écrite pour laquelle la révision n'était pas nécessaire (R. 4121-2, dernier alinéa)." },
    ],
  },

  "SST-CTL-DUE-04": {
    gravite: 1,
    quoiFaire: "Mettre à jour le document unique à la suite de l'aménagement important ou de l'information nouvelle survenus.",
    risque: "R. 4121-2 impose la mise à jour lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur. Le défaut de mise à jour dans ces conditions est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1).",
    delai: "Deux à quatre semaines à compter de la décision ou de l'information : ce cas de mise à jour ne suit pas le calendrier annuel, il suit l'événement.",
    document: "Mise à jour événementielle du document unique — décision ou information à l'origine",
    etapes: [
      "Dater et qualifier l'événement : décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail (R. 4121-2, 2°), ou information supplémentaire intéressant l'évaluation d'un risque portée à la connaissance de l'employeur (R. 4121-2, 3°).",
      "Identifier les unités de travail que l'événement touche, et n'en réévaluer que ce qui a changé : la mise à jour n'est pas la réécriture du document.",
      "Reprendre l'inventaire de ces unités et le transcrire dans une version nouvelle et datée.",
      "Réviser en conséquence le programme annuel de prévention ou la liste des actions de prévention et de protection (R. 4121-2, dernier alinéa).",
      "Consulter le comité social et économique sur cette mise à jour (L. 4121-3, 1°) et la transmettre au service de prévention et de santé au travail (L. 4121-3-1, VI).",
    ],
    verifs: [
      { cle: "due04Evenement", question: "Quel aménagement important ou quelle information nouvelle est survenu, et à quelle date ?", attendu: "La nature de l'événement et sa date — décision d'investissement, réorganisation, accident, alerte, signalement." },
      { cle: "due04MajFaite", question: "À quelle date la version du document unique postérieure à cet événement a-t-elle été établie ?", attendu: "La version datée après l'événement. Une version antérieure ne peut pas en tenir compte." },
      { cle: "due04Portee", question: "Quelles unités de travail cette mise à jour a-t-elle touchées ?", attendu: "Les sections modifiées, comparées à la version précédente." },
    ],
  },

  /* CE QUE LES TEXTES RÉPRESSIFS CAPTÉS N'ATTEIGNENT PAS, DANS CE BLOC.
     R. 4741-1 ne punit qu'une chose : le défaut de transcription et le défaut
     de mise à jour « dans les conditions prévues aux articles R. 4121-1 et
     R. 4121-2 ». Il ne va pas plus loin. Ne sont donc atteints ni le III de
     L. 4121-3-1 (programme annuel ou liste d'actions, SST-CTL-DUE-05), ni son
     V et R. 4121-4 (conservation des versions et avis d'accès affiché,
     SST-CTL-DUE-06), ni son VI (transmission au service de prévention et de
     santé au travail, SST-CTL-DUE-08).
     L. 4741-1 ne les rattrape pas non plus : son énumération vise, pour le
     livre Ier de la quatrième partie, les « Titres Ier, III et IV » — le titre
     II, celui des principes généraux de prévention où vivent L. 4121-1 à
     L. 4121-3-1, en est absent. C'est la lecture qu'un auteur du module avait
     déjà faite ; elle a été refaite à la source le 24 août 2026 et elle tient.
     R. 4741-3 ne les rattrape pas davantage, quoique son objet — « les
     documents et affichages obligatoires » — puisse le laisser croire. Son
     énumération, lue à la source le 24 août 2026 et versée telle quelle dans
     textes-sst.json, est close : « les articles L. 4711-1 à L. 4711-5 ainsi
     que […] les articles D. 4711-1 à D. 4711-3 ». R. 4121-4, qui porte l'avis
     d'accès au document unique, n'y est pas, et aucun de ces numéros n'est
     celui d'un article du titre II du livre Ier. Le contenu de ces huit
     articles n'a pas été capté ici : il n'a pas à l'être, puisque c'est
     l'énumération, et elle seule, qui décide de la portée du texte pénal.
     Ces trois contrôles restent donc au degré 3 ou 4. Ce n'est pas un oubli :
     c'est le résultat de la lecture. */

  "SST-CTL-DUE-05": {
    gravite: 3,
    quoiFaire: "Faire déboucher l'évaluation sur ce que le seuil commande : programme annuel de prévention à partir de cinquante salariés, liste d'actions consignée dans le document unique en deçà.",
    risque: "Sans programme ni liste d'actions, l'évaluation ne débouche sur rien et le III de L. 4121-3-1 n'est pas satisfait. Dans les entreprises d'au moins cinquante salariés, le procès-verbal de la réunion du comité consacrée à l'examen du rapport et du programme annuels est joint à toute demande présentée en vue d'obtenir des marchés publics, des participations publiques, des subventions, des primes de toute nature ou des avantages sociaux ou fiscaux (L. 2312-27) : sans programme examiné, ces demandes sont incomplètes.",
    delai: "Un mois : le programme suppose de chiffrer chaque mesure et de la caler dans un calendrier.",
    document: "Programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail (à partir de cinquante salariés), ou liste des actions de prévention consignée au document unique",
    etapes: [
      "Vérifier l'effectif : à partir de cinquante salariés, c'est le programme annuel du 1° du III de L. 4121-3-1 ; en deçà, c'est la définition d'actions de prévention des risques et de protection des salariés, dont la liste est consignée dans le document unique et ses mises à jour (2° du même III).",
      "Pour le programme : fixer la liste détaillée des mesures devant être prises au cours de l'année à venir, y compris les mesures de prévention des effets de l'exposition aux facteurs de risques professionnels, et pour chaque mesure ses conditions d'exécution, des indicateurs de résultat et l'estimation de son coût.",
      "Y identifier les ressources de l'entreprise pouvant être mobilisées et y joindre un calendrier de mise en œuvre : L. 4121-3-1, III, 1°, exige les trois éléments ensemble.",
      "Le présenter au comité social et économique dans le cadre de la consultation sur la politique sociale, avec le rapport annuel écrit faisant le bilan de la situation générale de la santé, de la sécurité et des conditions de travail (L. 2312-27) — le comité peut proposer un ordre de priorité et l'adoption de mesures supplémentaires.",
      "Si des mesures prévues par l'employeur ou demandées par le comité n'ont pas été prises au cours de l'année concernée, en énoncer les motifs en annexe au rapport annuel (L. 2312-27).",
      "Pour la liste d'actions, en deçà de cinquante salariés : la consigner dans le document unique lui-même et dans chacune de ses mises à jour, et non dans un document séparé.",
    ],
    verifs: [
      { cle: "due05Regime", question: "Quel est l'effectif, et quel régime en découle — programme annuel ou liste d'actions consignée ?", attendu: "L'effectif, et la pièce correspondante." },
      { cle: "due05Contenu", question: "Le programme fixe-t-il, mesure par mesure, ses conditions d'exécution, ses indicateurs de résultat et l'estimation de son coût ?", attendu: "Le programme, ouvert sur une mesure prise au hasard : les trois éléments doivent y figurer." },
      { cle: "due05Calendrier", question: "Le programme identifie-t-il les ressources mobilisables et comporte-t-il un calendrier de mise en œuvre ?", attendu: "Les deux sections ; L. 4121-3-1, III, 1°, les exige au même titre que la liste des mesures." },
      { cle: "due05Cse", question: "À quelle date le programme a-t-il été présenté au comité social et économique, et quel avis a-t-il rendu ?", attendu: "Le procès-verbal de la réunion consacrée à l'examen du rapport et du programme annuels (L. 2312-27)." },
    ],
  },

  "SST-CTL-DUE-06": {
    gravite: 3,
    quoiFaire: "Conserver les versions successives du document unique et afficher l'avis indiquant les modalités d'accès des travailleurs.",
    risque: "Les versions successives doivent être conservées et tenues à la disposition des travailleurs, des anciens travailleurs et de toute personne ou instance pouvant justifier d'un intérêt à y avoir accès, pendant une durée qui ne peut être inférieure à quarante ans à compter de leur élaboration (L. 4121-3-1, V ; R. 4121-4). Sans elles, la traçabilité collective des expositions que le document unique doit assurer est perdue, et l'employeur ne peut répondre ni à la demande d'un ancien salarié ni à celle d'un agent de contrôle.",
    delai: "Quelques jours pour l'avis d'affichage ; un mois pour organiser la conservation.",
    document: "Avis d'affichage des modalités d'accès au document unique, et protocole de conservation des versions successives",
    etapes: [
      "Rassembler les versions successives du document unique et les conserver, sur papier ou sous forme dématérialisée, sans écraser les précédentes : chacune doit rester lisible pendant quarante ans au moins à compter de son élaboration (R. 4121-4).",
      "Organiser leur mise à disposition au profit des personnes et instances que R. 4121-4 énumère : travailleurs et anciens travailleurs pour les versions en vigueur durant leur période d'activité, membres de la délégation du personnel du comité social et économique, service de prévention et de santé au travail, agents du système d'inspection du travail, agents des services de prévention des organismes de sécurité sociale, agents des organismes professionnels de santé, de sécurité et des conditions de travail, inspecteurs de la radioprotection pour ce qui concerne l'exposition aux rayonnements ionisants.",
      "Prévoir que la communication des versions antérieures à un travailleur ou à un ancien travailleur peut être limitée aux seuls éléments afférents à son activité, et qu'il peut communiquer ces éléments aux professionnels de santé chargés de son suivi médical (R. 4121-4, 1°).",
      "Afficher l'avis indiquant les modalités d'accès des travailleurs au document unique, à une place convenable et aisément accessible dans les lieux de travail — au même emplacement que le règlement intérieur lorsqu'il en existe un (R. 4121-4, dernier alinéa).",
      "Consigner par écrit où se trouvent les versions, qui en donne l'accès et sous quel délai une demande est traitée.",
    ],
    verifs: [
      { cle: "due06Versions", question: "Quelles versions successives du document unique sont conservées, et depuis quelle année ?", attendu: "La liste des versions, chacune datée et consultable." },
      { cle: "due06Duree", question: "Comment la conservation pendant quarante ans au moins est-elle assurée ?", attendu: "Le support, le lieu et le responsable — une sauvegarde écrasée à chaque mise à jour ne satisfait pas R. 4121-4." },
      { cle: "due06Avis", question: "Où l'avis indiquant les modalités d'accès est-il affiché, et depuis quand ?", attendu: "L'emplacement — celui du règlement intérieur là où il en existe un — et la date." },
      { cle: "due06Demande", question: "Comment une demande d'accès d'un ancien travailleur serait-elle traitée aujourd'hui ?", attendu: "La procédure écrite, et le nom de la personne qui la met en œuvre." },
    ],
  },

  "SST-CTL-DUE-07": {
    gravite: 1,
    quoiFaire: "Consulter le comité social et économique sur le document unique et sur chacune de ses mises à jour.",
    risque: "L. 4121-3, 1°, impose que le comité social et économique soit consulté sur le document unique d'évaluation des risques professionnels et sur ses mises à jour. Faute de consultation, le comité et sa commission sont privés de la contribution à l'évaluation des risques que le texte leur reconnaît, et le document adopté sans avis est contestable. Le manquement n'est pas seulement civil : « le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1). La consultation que la loi impose et qui n'a pas eu lieu expose l'employeur à cette qualification, qu'il appartient au juge de retenir ou d'écarter.",
    delai: "Le temps d'une réunion, convoquée selon les règles propres au comité.",
    document: "Ordre du jour et procès-verbal de la consultation du comité sur le document unique",
    etapes: [
      "Transmettre aux membres du comité le document unique — ou la mise à jour soumise — avant la réunion, de manière qu'ils puissent en prendre connaissance.",
      "Inscrire la consultation à l'ordre du jour, en la distinguant de la présentation du rapport et du programme annuels de L. 2312-27 : ce sont deux points différents.",
      "Recueillir l'avis du comité et le consigner au procès-verbal, avec la date de la réunion et la version soumise.",
      "Recommencer à chaque mise à jour : L. 4121-3, 1°, vise le document unique « et ses mises à jour », sans distinguer.",
      "Conserver les procès-verbaux avec les versions correspondantes du document.",
    ],
    verifs: [
      { cle: "due07Date", question: "À quelle date le comité a-t-il été consulté sur la version en vigueur du document unique ?", attendu: "La date de la réunion et l'ordre du jour la portant." },
      { cle: "due07Avis", question: "Quel avis le comité a-t-il rendu, et où figure-t-il ?", attendu: "Le procès-verbal. Une simple information portée au comité n'est pas une consultation." },
      { cle: "due07MisesAJour", question: "Les mises à jour successives ont-elles chacune été soumises au comité ?", attendu: "La correspondance entre la liste des versions et la liste des consultations." },
    ],
  },

  "SST-CTL-DUE-08": {
    gravite: 4,
    quoiFaire: "Transmettre le document unique au service de prévention et de santé au travail auquel l'entreprise adhère, à chaque mise à jour.",
    risque: "L. 4121-3-1, VI, impose cette transmission à chaque mise à jour. Sans elle, le service ne dispose pas de la pièce sur laquelle repose la contribution à l'évaluation des risques que L. 4121-3 lui reconnaît.",
    delai: "Quelques jours : un envoi, et la preuve de cet envoi.",
    document: "Bordereau de transmission du document unique au service de prévention et de santé au travail",
    etapes: [
      "Identifier le service de prévention et de santé au travail auquel l'employeur adhère, et le canal de transmission qu'il accepte.",
      "Lui transmettre la version en vigueur du document unique, et conserver la preuve de l'envoi et sa date.",
      "Inscrire cette transmission dans la procédure de mise à jour du document, pour qu'elle se répète à chaque nouvelle version sans qu'il faille y penser (L. 4121-3-1, VI).",
    ],
    verifs: [
      { cle: "due08Service", question: "À quel service de prévention et de santé au travail l'entreprise adhère-t-elle ?", attendu: "Le nom du service et la preuve de l'adhésion." },
      { cle: "due08DerniereTransmission", question: "À quelle date la dernière version du document unique lui a-t-elle été transmise ?", attendu: "La date et la preuve de l'envoi, comparées à la date de la version." },
      { cle: "due08Systematique", question: "Qu'est-ce qui garantit que la transmission se refera à la prochaine mise à jour ?", attendu: "La procédure écrite, ou la personne nommément chargée de l'envoi." },
    ],
  },

  /* ----------------------------------------------------------------- la CSSCT */

  "SST-CTL-CSS-01": {
    gravite: 1,
    quoiFaire: "Créer la commission santé, sécurité et conditions de travail au sein du comité social et économique.",
    risque: "La commission est créée dans les entreprises et les établissements distincts d'au moins trois cents salariés ainsi que dans les établissements mentionnés aux articles L. 4521-1 et suivants (L. 2315-36) ; en deçà de trois cents salariés, l'inspecteur du travail peut en imposer la création lorsque cette mesure est nécessaire, notamment en raison de la nature des activités, de l'agencement ou de l'équipement des locaux (L. 2315-37). Là où elle est due et n'existe pas, les attributions du comité en matière de santé, de sécurité et de conditions de travail ne sont pas organisées et l'obligation reste ouverte. « Le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1) : la commission absente là où elle est due expose l'employeur à cette qualification. Le module CSE cote le même manquement au même degré, dans les mêmes termes (CSE-CTL-SST-01).",
    delai: "Deux à trois mois : il faut d'abord ce qui fixe les modalités, puis la résolution de désignation.",
    document: "Accord de mise en place de la commission santé, sécurité et conditions de travail, et résolution de désignation de ses membres",
    etapes: [
      "Établir sur quel fondement la commission est due : effectif d'au moins trois cents salariés dans l'entreprise ou dans un établissement distinct, établissement mentionné aux articles L. 4521-1 et suivants (L. 2315-36), ou décision de l'inspecteur du travail (L. 2315-37).",
      "Fixer les modalités de mise en place : accord d'entreprise (L. 2315-41), accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus en l'absence de délégué syndical (L. 2315-42), ou, à défaut d'accord, règlement intérieur du comité (L. 2315-44). Hors des cas où elle est due, l'accord peut aussi en fixer le nombre et le périmètre (L. 2315-43).",
      "Faire désigner les membres par le comité, parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32 — à la majorité des membres présents, le président ne participant pas au vote.",
      "Respecter la composition de L. 2315-39 : présidence par l'employeur ou son représentant, trois membres représentants du personnel au minimum, dont au moins un représentant du second collège ou, le cas échéant, du troisième.",
      "Arrêter par écrit la délégation confiée à la commission, dans les limites de L. 2315-38, et réunir la commission.",
    ],
    verifs: [
      { cle: "css01Fondement", question: "Sur quel fondement la commission est-elle due ici — effectif, établissement à hauts risques, décision de l'inspecteur ?", attendu: "L'effectif de l'entreprise et de chaque établissement distinct, ou la décision de l'inspecteur du travail." },
      { cle: "css01Creation", question: "À quelle date la commission a-t-elle été mise en place ?", attendu: "L'accord ou le règlement intérieur qui la crée, et la résolution de désignation." },
      { cle: "css01Perimetre", question: "Combien de commissions existent, et sur quel périmètre chacune ?", attendu: "Le périmètre retenu, confronté à la liste des établissements distincts d'au moins trois cents salariés." },
    ],
  },

  /* CE QUE L. 2317-1 N'ATTEINT PAS, DANS CE BLOC.
     L. 2317-1 punit deux choses, et deux seulement : l'entrave à la
     constitution du comité ou à la libre désignation de ses membres, et
     l'entrave à son fonctionnement régulier. La commission qui n'est pas
     créée là où elle est due relève du second cas — c'est SST-CTL-CSS-01, coté
     1. Les cinq contrôles qui suivent portent sur autre chose : la composition
     de la commission (CSS-02), les modalités fixées par accord ou par le
     règlement intérieur du comité (CSS-03), les limites de la délégation
     (CSS-04), la formation des élus (CSS-05), le remplacement des membres
     avant terme (CSS-06). Ce sont des irrégularités que le juge annule, non
     des faits que le texte pénal désigne, et l'employeur n'en est même pas
     toujours l'auteur : la désignation et le remplacement des membres
     appartiennent au comité. Ils restent au degré 3 ou 4 — c'est aussi la
     cotation que le module CSE retient pour les mêmes points. */

  "SST-CTL-CSS-02": {
    gravite: 3,
    quoiFaire: "Rétablir la composition de la commission telle que L. 2315-39 l'impose, et refaire la désignation si elle est irrégulière.",
    risque: "Les dispositions de L. 2315-39 sont d'ordre public : un accord ne peut ni les écarter ni les réécrire, et une stipulation attribuant un siège à chaque organisation syndicale par ordre de représentativité ne peut s'entendre comme imposant une désignation proportionnelle au résultat électoral (Soc., 11 février 2026, n° 24-16.408). Là où un troisième collège est institué en application de L. 2314-11, un siège au moins doit revenir à un élu du comité qui le représente (Soc., 26 février 2025, n° 24-12.295). La désignation qui méconnaît ces règles encourt l'annulation.",
    delai: "Le temps d'une réunion du comité : la désignation se refait par résolution.",
    document: "Résolution du comité désignant les membres de la commission — composition conforme à L. 2315-39",
    etapes: [
      "Vérifier la présidence : la commission est présidée par l'employeur ou son représentant, qui peut se faire assister de collaborateurs appartenant à l'entreprise et choisis en dehors du comité, sans qu'ensemble ils soient en nombre supérieur à celui des représentants du personnel titulaires (L. 2315-39).",
      "Vérifier le nombre : trois membres représentants du personnel au minimum, désignés par le comité parmi ses membres.",
      "Vérifier les collèges : au moins un représentant du second collège ou, le cas échéant, du troisième collège prévu à L. 2314-11 ; là où un troisième collège est institué, un siège au moins lui revient (Soc., 26 février 2025, n° 24-12.295).",
      "Refaire la désignation par une résolution du comité adoptée selon les modalités de L. 2315-32 : un vote des membres présents à la majorité, sans qu'il soit besoin d'une résolution préalable fixant les modalités de l'élection (Soc., 27 novembre 2019, n° 19-14.224).",
      "Écarter toute stipulation d'accord qui imposerait une répartition des sièges proportionnelle au résultat électoral de chaque syndicat : une telle lecture est contraire à L. 2315-32 et L. 2315-39 (Soc., 11 février 2026, n° 24-16.408).",
      "Rappeler par écrit aux membres, et aux collaborateurs qui assistent l'employeur, le secret professionnel et l'obligation de discrétion que L. 2315-39 leur rend applicables.",
    ],
    verifs: [
      { cle: "css02Presidence", question: "Qui préside la commission, et à quel titre ?", attendu: "L'employeur ou son représentant, avec l'acte qui donne cette qualité." },
      { cle: "css02Nombre", question: "Combien de représentants du personnel siègent à la commission ?", attendu: "Le nombre : trois au minimum (L. 2315-39)." },
      { cle: "css02College", question: "Quel membre représente le second collège — ou le troisième là où il est institué ?", attendu: "Le nom et le collège d'élection, tirés des résultats des dernières élections." },
      { cle: "css02Resolution", question: "Où figure la résolution du comité désignant les membres, et à quelle date a-t-elle été adoptée ?", attendu: "Le procès-verbal portant la résolution et le décompte des voix (L. 2315-32)." },
    ],
  },

  "SST-CTL-CSS-03": {
    gravite: 4,
    quoiFaire: "Faire fixer par écrit les modalités de mise en place et de fonctionnement de la commission — accord d'entreprise, accord avec le comité, ou règlement intérieur du comité à défaut.",
    risque: "En l'absence d'accord d'entreprise (L. 2315-41) et d'accord entre l'employeur et le comité (L. 2315-42), c'est au règlement intérieur du comité de définir les six points énumérés par L. 2315-41 (L. 2315-44). Tant que rien ne les fixe, ni les missions déléguées, ni les heures de délégation, ni la formation des membres ne sont établies, et la commission ne peut démontrer ce qu'elle est en droit de faire.",
    delai: "Une réunion du comité pour un règlement intérieur ; deux à trois mois si un accord est négocié.",
    document: "Accord d'entreprise, accord avec le comité ou règlement intérieur fixant les six points de L. 2315-41",
    etapes: [
      "Choisir la source : accord d'entreprise défini à L. 2313-2 (L. 2315-41) ; à défaut de délégué syndical, accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus de la délégation du personnel (L. 2315-42) ; à défaut d'accord, règlement intérieur du comité (L. 2315-44).",
      "Y définir les six points de L. 2315-41 : le nombre de membres ; les missions déléguées par le comité et leurs modalités d'exercice ; les modalités de fonctionnement, notamment le nombre d'heures de délégation ; les modalités de formation conformément aux articles L. 2315-16 à L. 2315-18 ; le cas échéant, les moyens alloués ; le cas échéant, les conditions d'une formation spécifique correspondant aux risques ou facteurs de risques particuliers en rapport avec l'activité de l'entreprise.",
      "Vérifier que les missions déléguées restent dans les limites de L. 2315-38 : ni le recours à un expert, ni les attributions consultatives du comité.",
      "Notifier le texte aux membres de la commission et le verser au dossier : c'est lui qui prouvera l'étendue de la délégation.",
    ],
    verifs: [
      { cle: "css03Source", question: "Qu'est-ce qui fixe les modalités de la commission — accord d'entreprise, accord avec le comité, ou règlement intérieur ?", attendu: "Le texte lui-même, daté et signé ou adopté." },
      { cle: "css03Points", question: "Ce texte couvre-t-il les six points de L. 2315-41 ?", attendu: "Le texte, point par point : nombre de membres, missions déléguées, fonctionnement, formation, moyens, formation spécifique." },
      { cle: "css03Heures", question: "Quel nombre d'heures de délégation les membres de la commission ont-ils pour l'exercice de leurs missions ?", attendu: "Le nombre écrit, tel que L. 2315-41, 3°, le fait fixer." },
    ],
  },

  "SST-CTL-CSS-04": {
    gravite: 3,
    quoiFaire: "Ramener la délégation confiée à la commission dans les limites de L. 2315-38.",
    risque: "L. 2315-38 est d'ordre public : la commission reçoit, par délégation du comité, tout ou partie des attributions relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert et des attributions consultatives du comité (Soc., 13 mai 2026, n° 25-12.560). Un avis rendu par la seule commission, ou une expertise qu'elle aurait décidée, est irrégulier — et l'accord qui l'aurait prévu ne peut pas y suppléer.",
    delai: "Le temps de reprendre l'accord ou le règlement intérieur : une réunion.",
    document: "Avenant à l'accord, ou modification du règlement intérieur, ramenant la délégation dans les limites de L. 2315-38",
    etapes: [
      "Relire ligne à ligne la délégation écrite et en retirer ce que L. 2315-38 interdit de déléguer : le recours à un expert et les attributions consultatives du comité.",
      "Faire adopter la modification par la voie qui a fixé les modalités — avenant à l'accord, ou délibération modifiant le règlement intérieur du comité.",
      "Réorganiser le circuit : la commission instruit et propose, le comité consulte et décide. Le comité peut décider d'une expertise, le cas échéant sur proposition des commissions constituées en son sein — la proposition appartient à la commission, la décision reste au comité (Soc., 18 mars 2026, n° 23-22.270).",
      "Reprendre, s'il y a lieu, les avis déjà rendus par la seule commission en les faisant délibérer par le comité, afin qu'ils ne soient pas discutés plus tard pour ce motif.",
    ],
    verifs: [
      { cle: "css04Texte", question: "Que dit exactement le texte qui fixe les missions déléguées à la commission ?", attendu: "La clause de délégation, lue mot à mot." },
      { cle: "css04Expert", question: "Qui a décidé des expertises intervenues depuis la mise en place de la commission ?", attendu: "Les délibérations : la décision doit émaner du comité (L. 2315-38)." },
      { cle: "css04Avis", question: "Les avis rendus en matière de santé, de sécurité et de conditions de travail l'ont-ils été par le comité lui-même ?", attendu: "Les procès-verbaux du comité portant ces avis, et non ceux de la commission." },
    ],
  },

  "SST-CTL-CSS-05": {
    gravite: 3,
    quoiFaire: "Faire bénéficier les élus, et le référent harcèlement du comité, de la formation santé, sécurité et conditions de travail.",
    risque: "L. 2315-18 impose la formation nécessaire à l'exercice des missions en matière de santé, de sécurité et de conditions de travail : cinq jours au minimum lors du premier mandat, trois jours en cas de renouvellement pour chaque membre quelle que soit la taille de l'entreprise, cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés. Son financement est pris en charge par l'employeur. Un élu non formé exerce des missions pour lesquelles la loi le veut préparé, et l'entreprise se prive de l'apport que le texte organise.",
    delai: "Une à deux sessions à programmer : compter le délai d'inscription auprès de l'organisme.",
    document: "Plan de formation santé, sécurité et conditions de travail des élus et du référent harcèlement",
    etapes: [
      "Recenser les bénéficiaires : les membres de la délégation du personnel du comité social et économique et le référent prévu au dernier alinéa de L. 2314-1 (L. 2315-18).",
      "Déterminer la durée due, élu par élu : cinq jours au minimum lors du premier mandat ; en cas de renouvellement, trois jours pour chaque membre de la délégation du personnel quelle que soit la taille de l'entreprise, et cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés.",
      "Programmer les sessions et en assurer le financement, qui est pris en charge par l'employeur (L. 2315-18).",
      "Vérifier ce que l'accord ou le règlement intérieur prévoit sur les modalités de formation des membres de la commission (L. 2315-41, 4°), et sur la formation spécifique correspondant aux risques particuliers de l'activité (L. 2315-41, 6°).",
      "Conserver les attestations de formation, élu par élu : c'est la seule pièce qui établira la durée suivie.",
    ],
    verifs: [
      { cle: "css05Beneficiaires", question: "Quels élus ont suivi la formation, et lesquels ne l'ont pas suivie ?", attendu: "La liste nominative, confrontée à la composition du comité." },
      { cle: "css05Durees", question: "Quelle durée chacun a-t-il suivie, et s'agissait-il d'un premier mandat ou d'un renouvellement ?", attendu: "Le nombre de jours par élu, rapporté au minimum applicable (L. 2315-18)." },
      { cle: "css05Commission", question: "Les membres de la commission ont-ils reçu la durée qui leur est propre dans les entreprises d'au moins trois cents salariés ?", attendu: "Cinq jours en cas de renouvellement, attestations à l'appui." },
      { cle: "css05Referent", question: "Le référent harcèlement du comité a-t-il été formé ?", attendu: "Son attestation ; L. 2315-18 le vise expressément." },
    ],
  },

  "SST-CTL-CSS-06": {
    gravite: 3,
    quoiFaire: "Reprendre tout remplacement de membre de la commission intervenu hors des cas de fin anticipée de mandat.",
    risque: "Sauf dans les cas de fin anticipée de mandat énumérés à L. 2314-33 — décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible — le comité ne peut pas remplacer les membres de la commission initialement désignés avant le terme du mandat des membres élus du comité, et aucun accord d'entreprise ne peut y déroger (Soc., 28 mai 2026, n° 24-22.914). La délibération de remplacement encourt l'annulation.",
    delai: "Immédiat : c'est la délibération elle-même qu'il faut reprendre.",
    document: "Délibération du comité rapportant le remplacement irrégulier et rétablissant le membre désigné",
    etapes: [
      "Reprendre chaque remplacement intervenu depuis la désignation initiale et en identifier la cause exacte, telle qu'elle figure au procès-verbal.",
      "Confronter cette cause aux fins anticipées de mandat de L. 2314-33 : décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible. Toute autre cause — perte de confiance, changement d'équipe, arrangement entre organisations — ne permet pas le remplacement.",
      "Pour un remplacement sans cause admise, faire rapporter la délibération par le comité et rétablir le membre initialement désigné : son mandat court jusqu'au terme de celui des membres élus du comité (L. 2315-39).",
      "Écarter la stipulation d'accord qui autoriserait ces remplacements : elle ne peut pas déroger à la règle (Soc., 28 mai 2026, n° 24-22.914).",
      "Faire consigner au procès-verbal, pour chaque remplacement à venir, la cause invoquée et la pièce qui l'établit.",
    ],
    verifs: [
      { cle: "css06Liste", question: "Quels membres de la commission ont été remplacés depuis la désignation initiale, et à quelles dates ?", attendu: "La liste des délibérations de remplacement." },
      { cle: "css06Cause", question: "Pour chacun, quelle cause a été retenue, et quelle pièce l'établit ?", attendu: "La cause et sa pièce : lettre de démission, rupture du contrat, perte d'éligibilité, acte de décès (L. 2314-33)." },
      { cle: "css06Composition", question: "La composition actuelle correspond-elle à la désignation initiale, corrigée des seules fins anticipées de mandat ?", attendu: "La composition, rapprochée de la résolution initiale." },
    ],
  },

  /* ------------------------------------------------------------ le harcèlement */

  /* CE QUE L. 1155-2 N'ATTEINT PAS, DANS CE BLOC.
     Le seul texte répressif du corpus en matière de harcèlement punit « les
     faits de discriminations commis à la suite d'un harcèlement moral ou
     sexuel définis aux articles L. 1152-2, L. 1153-2 et L. 1153-3 » : il vise
     les représailles, non l'organisation de la prévention. Il fonde donc
     SST-CTL-HAR-05, où un signalement est resté sans réaction, et lui seul.
     La désignation des référents (HAR-01, HAR-02), l'information obligatoire
     (HAR-03) et l'organisation de la prévention (HAR-04) ne sont visées par
     aucun texte répressif capté : le harcèlement moral et le harcèlement
     sexuel sont eux-mêmes punis par les articles 222-33-2 et 222-33 du code
     pénal, que L. 1152-4 et L. 1153-5 obligent à afficher, mais le relais
     Légifrance du dépôt ne sert que le code du travail et le dépôt interdit
     de citer un autre code sans l'avoir lu à la source. Ces quatre contrôles
     restent donc au degré 3 ou 4. */

  "SST-CTL-HAR-01": {
    gravite: 4,
    quoiFaire: "Désigner le référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes.",
    risque: "Dans toute entreprise employant au moins deux cent cinquante salariés, ce référent est désigné (L. 1153-5-1). Son adresse et son numéro d'appel font partie de l'information obligatoire que D. 1151-1 énumère : sans référent désigné, cette information est incomplète, et le manquement se constate à deux titres.",
    delai: "Quelques jours : la désignation est un acte de l'employeur, elle ne dépend de personne d'autre.",
    document: "Décision de désignation du référent harcèlement sexuel et agissements sexistes",
    etapes: [
      "Vérifier le seuil : au moins deux cent cinquante salariés (L. 1153-5-1).",
      "Désigner le référent par écrit, en énonçant sa mission telle que le texte la définit : orienter, informer et accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes.",
      "Lui donner le temps, la formation et l'accès aux interlocuteurs que sa mission suppose, et le faire connaître dans l'entreprise.",
      "Porter son adresse et son numéro d'appel dans l'information délivrée aux salariés et aux candidats (D. 1151-1, 4°).",
    ],
    verifs: [
      { cle: "har01Decision", question: "Qui est le référent, et par quel acte a-t-il été désigné ?", attendu: "La décision écrite, datée et nominative." },
      { cle: "har01Coordonnees", question: "Son adresse et son numéro d'appel figurent-ils dans l'information affichée ou diffusée ?", attendu: "Le support d'information, où D. 1151-1, 4°, veut les trouver." },
      { cle: "har01Moyens", question: "De quels moyens dispose-t-il pour orienter, informer et accompagner les salariés ?", attendu: "Le temps alloué, la formation suivie, la procédure de saisine." },
    ],
  },

  "SST-CTL-HAR-02": {
    gravite: 4,
    quoiFaire: "Faire désigner par le comité social et économique, parmi ses membres, le référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes.",
    risque: "L. 2314-1 impose cette désignation par le comité, parmi ses membres, sous la forme d'une résolution adoptée selon les modalités de L. 2315-32, pour une durée qui prend fin avec celle du mandat des membres élus. La désignation appartient au comité — mais les coordonnées du référent font partie de l'information que l'employeur doit délivrer (D. 1151-1, 5°) : à défaut, c'est cette information qui est incomplète.",
    delai: "La prochaine réunion du comité.",
    document: "Inscription à l'ordre du jour du comité de la désignation du référent harcèlement",
    etapes: [
      "Inscrire la désignation à l'ordre du jour de la prochaine réunion du comité et en informer les élus par écrit : c'est la démarche que l'employeur peut accomplir, et elle se prouve.",
      "Faire adopter la résolution selon les modalités de L. 2315-32 — à la majorité des membres présents, le président ne participant pas au vote.",
      "Consigner la désignation au procès-verbal, en rappelant que le mandat du référent prend fin avec celui des membres élus du comité (L. 2314-1).",
      "Porter l'adresse et le numéro d'appel du référent dans l'information délivrée aux salariés (D. 1151-1, 5°).",
      "Inscrire le référent parmi les bénéficiaires de la formation santé, sécurité et conditions de travail, que L. 2315-18 lui reconnaît expressément.",
    ],
    verifs: [
      { cle: "har02Resolution", question: "Qui est le référent du comité, et par quelle résolution a-t-il été désigné ?", attendu: "Le procès-verbal portant la résolution et son décompte de voix (L. 2315-32)." },
      { cle: "har02Demarche", question: "Si le comité n'a pas désigné, quelle démarche a été accomplie pour l'y inviter ?", attendu: "L'ordre du jour ou le courrier aux élus, daté." },
      { cle: "har02Information", question: "Ses coordonnées figurent-elles dans l'information délivrée aux salariés ?", attendu: "Le support d'information (D. 1151-1, 5°)." },
    ],
  },

  "SST-CTL-HAR-03": {
    gravite: 3,
    quoiFaire: "Délivrer l'information obligatoire sur le harcèlement moral, le harcèlement sexuel et les coordonnées des autorités et des référents.",
    risque: "L. 1152-4 impose d'informer par tout moyen du texte de l'article 222-33-2 du code pénal les personnes mentionnées à L. 1152-2 ; L. 1153-5 impose, dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche, l'information sur le texte de l'article 222-33 du code pénal, sur les actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel et sur les coordonnées des autorités et services compétents, dont D. 1151-1 fixe la liste. Une information absente ou incomplète se constate sur place, et elle nourrit le manquement à l'obligation de prévention.",
    delai: "Une semaine : l'information se rédige, s'affiche et se date.",
    document: "Affichage et note d'information — harcèlement moral, harcèlement sexuel et agissements sexistes",
    etapes: [
      "Reprendre le texte de l'article 222-33-2 du code pénal et le porter par tout moyen à la connaissance des personnes mentionnées à L. 1152-2 (L. 1152-4).",
      "Reprendre le texte de l'article 222-33 du code pénal, ainsi que les actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel, et les afficher dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche (L. 1153-5) : le lieu d'embauche est visé pour lui-même, il est souvent oublié.",
      "Y joindre l'adresse et le numéro d'appel que D. 1151-1 énumère : du médecin du travail ou du service de santé au travail compétent pour l'établissement ; de l'inspection du travail compétente, avec le nom de l'inspecteur ; du Défenseur des droits ; du référent de L. 1153-5-1 dans les entreprises d'au moins deux cent cinquante salariés ; du référent de L. 2314-1 lorsqu'un comité social et économique existe.",
      "Dater l'affichage et en conserver une trace — photographie, note de diffusion, accusé de réception — puis prévoir sa mise à jour dès qu'un nom, une adresse ou un numéro change.",
    ],
    verifs: [
      { cle: "har03Moral", question: "Par quel moyen le texte de l'article 222-33-2 du code pénal est-il porté à la connaissance des salariés ?", attendu: "Le support et sa date de diffusion (L. 1152-4)." },
      { cle: "har03Sexuel", question: "Où l'information sur le harcèlement sexuel et sur les actions contentieuses ouvertes est-elle affichée ?", attendu: "Les emplacements : lieux de travail, et locaux ou porte des locaux d'embauche (L. 1153-5)." },
      { cle: "har03Coordonnees", question: "Les cinq coordonnées de D. 1151-1 y figurent-elles, avec le nom de l'inspecteur du travail compétent ?", attendu: "Le support, lu ligne à ligne : médecin du travail ou service de santé au travail, inspection du travail et nom de l'inspecteur, Défenseur des droits, référent employeur, référent du comité." },
      { cle: "har03MiseAJour", question: "À quelle date ce support a-t-il été vérifié pour la dernière fois ?", attendu: "La date, et le nom de la personne qui en a la charge." },
    ],
  },

  "SST-CTL-HAR-04": {
    gravite: 3,
    quoiFaire: "Organiser la prévention du harcèlement : intégrer le risque à l'évaluation et prendre les dispositions de prévention.",
    risque: "L'employeur prend toutes dispositions nécessaires en vue de prévenir les agissements de harcèlement moral (L. 1152-4) et les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner (L. 1153-5) ; la planification de la prévention intègre, dans un ensemble cohérent, les risques liés au harcèlement moral et au harcèlement sexuel ainsi que ceux liés aux agissements sexistes (L. 4121-2, 7°). Ce module constate l'existence des mesures ; leur suffisance s'apprécie au fond, et c'est au fond qu'elle sera discutée.",
    delai: "Un à deux mois : l'évaluation du risque précède les mesures, et les mesures ne valent que mises en œuvre.",
    document: "Volet « harcèlement et agissements sexistes » du document unique, et dispositif de prévention",
    etapes: [
      "Intégrer les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes à l'évaluation des risques et à sa transcription dans le document unique, unité de travail par unité de travail (L. 4121-2, 7° ; R. 4121-1).",
      "Définir les dispositions de prévention : information des salariés, formation de l'encadrement, procédure de signalement et de traitement, rappel des sanctions disciplinaires encourues par l'auteur des faits.",
      "Faire connaître ces dispositions et le rôle des référents — celui de l'employeur à partir de deux cent cinquante salariés (L. 1153-5-1), celui du comité (L. 2314-1).",
      "Documenter la mise en œuvre effective : dates, destinataires, contenus, participants. C'est elle qui sera discutée, non l'existence d'un document.",
      "Réexaminer le dispositif à chaque mise à jour du document unique, et après tout signalement.",
    ],
    verifs: [
      { cle: "har04Duerp", question: "Dans quelles unités de travail le risque de harcèlement est-il inscrit au document unique ?", attendu: "Les sections du document où il figure ; une mention générale en préambule ne vaut pas inventaire." },
      { cle: "har04Dispositif", question: "Quelles dispositions de prévention ont été prises, et par quel acte ?", attendu: "Le dispositif écrit : procédure de signalement, actions d'information, actions de formation." },
      { cle: "har04MiseEnOeuvre", question: "Quand ces dispositions ont-elles été mises en œuvre, et auprès de qui ?", attendu: "Les dates, les destinataires et les feuilles de présence ou preuves de diffusion." },
      { cle: "har04Encadrement", question: "L'encadrement a-t-il été formé à repérer et à traiter ces situations ?", attendu: "Le programme suivi et la liste des participants." },
    ],
  },

  "SST-CTL-HAR-05": {
    gravite: 1,
    quoiFaire: "Réagir au signalement : faire cesser les faits allégués, conduire une enquête et en tirer les suites.",
    risque: "L. 1153-5 impose de prévenir les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner, et L. 4121-1 impose de prendre les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs. Outre la responsabilité civile de l'employeur au titre de cette obligation, les faits de discrimination commis à la suite d'un harcèlement moral ou sexuel sont punis d'un an d'emprisonnement et de 3 750 € d'amende (L. 1155-2), la juridiction pouvant en outre ordonner l'affichage et la publication du jugement.",
    delai: "Immédiat pour les mesures conservatoires ; l'enquête se conduit en quelques semaines, pas en quelques mois.",
    document: "Dossier d'enquête interne — saisine, mesures conservatoires, auditions, rapport et suites",
    etapes: [
      "Dater la réception du signalement, et prendre sans attendre les mesures propres à faire cesser les faits allégués et à protéger la personne qui les signale.",
      "Diligenter une enquête : en fixer par écrit l'auteur, le périmètre et le calendrier, entendre la personne qui signale, la personne mise en cause et les témoins utiles, et consigner chaque audition.",
      "Établir un rapport écrit et daté, qui expose ce qui a été recherché, ce qui a été constaté et ce qui ne l'a pas été.",
      "En tirer les suites : mesures pour mettre un terme aux faits et, s'ils sont établis, sanction — L. 1153-5 exige les trois temps, prévenir, mettre un terme, sanctionner.",
      "Veiller à ce qu'aucune mesure ne soit prise contre la personne ayant subi ou refusé de subir les faits, ni contre celle qui, de bonne foi, les a relatés ou en a témoigné : L. 1152-2 et L. 1153-2 la protègent.",
      "Conserver le dossier entier — saisine, mesures conservatoires, auditions, rapport, suites : sa valeur probante s'apprécie au fond, au regard le cas échéant des autres éléments de preuve.",
    ],
    verifs: [
      { cle: "har05Reception", question: "À quelle date le signalement a-t-il été reçu, et par qui ?", attendu: "La date et la pièce : courriel, courrier, note du référent, procès-verbal du comité." },
      { cle: "har05Conservatoire", question: "Quelles mesures immédiates ont été prises pour faire cesser les faits allégués et protéger la personne qui les signale ?", attendu: "Les mesures et leur date, rapportées à celle du signalement." },
      { cle: "har05Enquete", question: "Qui a conduit l'enquête, quelles personnes ont été entendues et où se trouve le rapport ?", attendu: "Le rapport daté et les comptes rendus d'audition." },
      { cle: "har05Suites", question: "Quelles suites ont été données — mesures pour mettre un terme aux faits, et sanction s'ils sont établis ?", attendu: "Les décisions écrites et leurs dates (L. 1153-5)." },
      { cle: "har05Protection", question: "La personne qui a signalé ou témoigné a-t-elle fait l'objet d'une mesure défavorable depuis le signalement ?", attendu: "L'absence de toute mesure de cette nature ; L. 1152-2 et L. 1153-2 l'interdisent." },
    ],
  },

  /* ------------------------------------------------------------- l'exposition */

  /* Ce contrôle mesure l'exposition résultant des autres — défaut de document
     unique, défaut de mise à jour, signalement resté sans réaction. Il ne se
     régularise pas pour lui-même : on régularise ce qui la cause, et il s'éteint
     de lui-même. */
  "SST-CTL-PEN-01": null,
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
      /* Deux clés identiques, et les réponses de la page se mélangent : la
         grille du second temps est indexée par la clé, pas par le contrôle. */
      if (v.cle && CLES.has(v.cle))
        ECARTS.push(`${id} : la clé « ${v.cle} » est déjà utilisée par ${CLES.get(v.cle)}`);
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
