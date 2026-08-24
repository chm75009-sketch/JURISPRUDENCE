/* Ce qu'il faut faire quand un contrôle de la discipline ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas du contrôle
   d'exposition, qui mesure ce que les autres causent et ne se régularise pas
   pour lui-même, et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   OÙ SONT LES DEGRÉS 1 ET 2, ET POURQUOI LÀ SEULEMENT.
   Jusqu'au 24 août 2026, aucune entrée n'était cotée 1 ni 2, et l'en-tête en
   donnait la raison : le corpus du module ne contenait aucun texte répressif,
   et le dépôt interdit d'annoncer une amende que personne n'a lue. La
   précaution était juste, le constat était incomplet — ces textes existent.
   Trois ont été lus à la source le 24 août 2026, deux lectures concordantes
   chacun, et versés dans textes-discipline.json :
     R. 1323-1 (LEGIARTI000037899552) — « Le fait de méconnaître les
       dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à
       R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue
       pour les contraventions de la quatrième classe. » L'énumération couvre
       tout le chapitre du règlement intérieur : les douze contrôles
       DIS-CTL-RI-01 à DIS-CTL-RI-12 passent au degré 1.
     L. 1334-1 (LEGIARTI000006901456) — « Le fait d'infliger une amende ou une
       sanction pécuniaire en méconnaissance des dispositions de l'article
       L. 1331-2 est puni d'une amende de 3 750 euros. » Il ne vise que
       L. 1331-2 : DIS-CTL-SAN-02, et lui seul, passe au degré 1.
     L. 2317-1 (LEGIARTI000035634273) — l'entrave au comité social et
       économique, « punie d'une amende de 7 500 € » pour ce qui est du
       fonctionnement régulier. Cité en second fondement là où le comité doit
       être consulté sur le règlement intérieur ou sur ses modifications
       (DIS-CTL-RI-06, DIS-CTL-RI-11).
   Le degré 2 — pénalité financière — ne sert toujours pas dans ce fichier, et
   c'est délibéré : aucun texte lu n'attache de pénalité financière à ces
   manquements. Ce qui reste au degré 3 y reste parce qu'aucun texte répressif
   ne l'atteint ; le commentaire placé devant DIS-CTL-SAN-01 dit précisément
   lesquels, et pourquoi. Ce que les textes lus disent là, et qui fonde le
   degré 3 : le conseil de prud'hommes « peut annuler une sanction irrégulière
   en la forme ou injustifiée ou disproportionnée à la faute commise »
   (L. 1333-2), et l'inspecteur du travail « peut à tout moment exiger le
   retrait ou la modification des dispositions contraires aux articles
   L. 1321-1 à L. 1321-3 et L. 1321-6 » (L. 1322-1). C'est la sanction qui
   tombe, ou la clause qui saute : c'est le degré 3.

   CE QUE CE FICHIER NE DIT JAMAIS. Il ne dit pas qu'une sanction est justifiée,
   ni qu'elle est proportionnée : la réalité des faits, leur caractère fautif et
   la mesure de la réponse s'apprécient au fond, l'employeur en fournit les
   éléments et, si un doute subsiste, il profite au salarié (L. 1333-1). Toutes
   les procédures écrites ici sont des procédures de forme.

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-discipline.json, et publier-discipline.js confronte les deux. Les
   décisions citées sont celles que les contrôles portent en fondement, lues à
   la source dans la base Judilibre. */

const { C } = require("./controles-discipline.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — la sanction ou le licenciement peut tomber",
  4: "Régularisation rapide",
};

const R = {

  "DIS-CTL-RI-01": {
    gravite: 1,
    quoiFaire: "Établir un règlement intérieur et lui faire suivre les quatre formalités : avis du comité social et économique, publicité, dépôt au greffe du conseil de prud'hommes, communication à l'inspecteur du travail.",
    risque: "L'entreprise d'au moins cinquante salariés est tenue d'en établir un (L. 1311-2). « Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1) : L. 1311-2, qui pose l'obligation même, ouvre cette énumération. Sans règlement intérieur, l'employeur n'a en outre aucune échelle de sanctions à opposer : la nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au règlement, et une sanction qui ne s'y trouve pas ne peut pas être prononcée — le contrôle DIS-CTL-SAN-03 le dit avec la décision qu'il cite.",
    delai: "Deux à trois mois : la rédaction, la consultation du comité, puis le mois qui doit séparer la dernière formalité de l'entrée en vigueur.",
    document: "Règlement intérieur — projet soumis à l'avis du comité social et économique",
    etapes: [
      "Dater le franchissement du seuil de cinquante salariés : l'obligation ne s'applique qu'au terme d'un délai de douze mois à compter de cette date (L. 1311-2, second alinéa ; R. 1321-5). C'est cette date qui dit si le manquement est constitué ou seulement prochain.",
      "Rédiger le projet en n'y mettant que ce que L. 1321-1 y réserve — mesures de santé et de sécurité, conditions de participation au rétablissement de conditions de travail protectrices, règles générales et permanentes de discipline avec la nature et l'échelle des sanctions — et en y portant les trois rappels de L. 1321-2.",
      "Le soumettre à l'avis du comité social et économique : L. 1321-4 interdit son introduction avant cet avis.",
      "Accomplir la publicité (R. 1321-1) et le dépôt au greffe du conseil de prud'hommes du ressort (R. 1321-2), et communiquer le texte accompagné de l'avis du comité à l'inspecteur du travail, en deux exemplaires (L. 1321-4 ; R. 1321-4).",
      "Inscrire dans le règlement une date d'entrée en vigueur postérieure d'un mois à la dernière en date de ces formalités (L. 1321-4 ; R. 1321-3), et ne prononcer aucune sanction tirée du règlement avant cette date.",
    ],
    verifs: [
      { cle: "ri01Seuil", question: "À quelle date l'effectif de cinquante salariés a-t-il été atteint ?", attendu: "La date ; l'obligation de L. 1311-2 ne s'applique qu'au terme d'un délai de douze mois à compter d'elle (R. 1321-5)." },
      { cle: "ri01Dates", question: "Quelle est la date du règlement intérieur en vigueur, et quelle date d'entrée en vigueur porte-t-il ?", attendu: "Les deux dates, lues sur le document : L. 1321-4 impose que le règlement indique sa date d'entrée en vigueur." },
      { cle: "ri01Exemplaire", question: "Où se trouve l'exemplaire applicable aujourd'hui, et de quelle version s'agit-il ?", attendu: "Le document lui-même, dans sa version en vigueur, et non un projet ni une version ancienne." },
    ],
  },

  "DIS-CTL-RI-02": {
    gravite: 1,
    quoiFaire: "Compléter le règlement intérieur pour qu'il porte les trois matières que L. 1321-1 lui réserve, puis refaire les formalités.",
    risque: "L. 1321-1 énumère ce que l'employeur y fixe exclusivement ; un règlement qui laisse une de ces matières de côté est contraire à ce texte. « Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1), et L. 1321-1 est dans cette énumération. L'inspecteur du travail peut en outre à tout moment en exiger la modification (L. 1322-1).",
    delai: "Deux mois : la rédaction de l'avenant, l'avis du comité, puis le mois qui précède l'entrée en vigueur.",
    document: "Avenant au règlement intérieur — les trois matières de L. 1321-1",
    etapes: [
      "Pointer sur le règlement, matière par matière, ce qui y figure : 1° les mesures d'application de la réglementation en matière de santé et de sécurité, notamment les instructions prévues à l'article L. 4122-1 ; 2° les conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices ; 3° les règles générales et permanentes relatives à la discipline.",
      "Rédiger un avenant pour la ou les matières absentes, en restant dans le champ de L. 1321-1 : le texte dit « exclusivement », et une clause étrangère à ces trois matières s'expose au retrait.",
      "Soumettre l'avenant à l'avis du comité social et économique : L. 1321-4 s'applique également en cas de modification des clauses du règlement intérieur.",
      "Refaire pour l'avenant la publicité, le dépôt au greffe et la communication à l'inspecteur du travail, et lui donner une date d'entrée en vigueur postérieure d'un mois à la dernière de ces formalités (R. 1321-3).",
    ],
    verifs: [
      { cle: "ri02SanteSecurite", question: "Quels articles du règlement intérieur portent les mesures d'application de la réglementation en matière de santé et de sécurité (L. 1321-1, 1°) ?", attendu: "Les numéros d'articles ou de pages, pointés sur le document." },
      { cle: "ri02Participation", question: "Quels articles portent les conditions de participation des salariés au rétablissement de conditions de travail protectrices (L. 1321-1, 2°) ?", attendu: "Les articles, pointés sur le document." },
      { cle: "ri02Discipline", question: "Quels articles portent les règles générales et permanentes relatives à la discipline (L. 1321-1, 3°) ?", attendu: "Les articles, pointés sur le document." },
    ],
  },

  "DIS-CTL-RI-03": {
    gravite: 1,
    quoiFaire: "Inscrire au règlement intérieur la nature et l'échelle des sanctions, et y préciser la durée maximale de la mise à pied disciplinaire.",
    risque: "C'est le point qui fait tomber les sanctions. La nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au règlement intérieur ; une sanction qui n'y figure pas ne peut pas être prononcée, et une mise à pied disciplinaire dont le règlement ne précise pas la durée maximale n'est pas licite — les contrôles DIS-CTL-SAN-03 et DIS-CTL-SAN-04 citent les décisions qui le jugent. Le conseil de prud'hommes annule la sanction irrégulière en la forme (L. 1333-2). Le règlement qui ne fixe pas cette échelle méconnaît L. 1321-1, et « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1).",
    delai: "Deux mois, avenant et formalités comprises. Aucune sanction nouvelle ne devrait être prononcée entre-temps sur le fondement d'une échelle absente.",
    document: "Avenant au règlement intérieur — échelle des sanctions et durée maximale de la mise à pied",
    etapes: [
      "Écrire l'échelle : énumérer les sanctions que l'employeur peut prendre, de la moins grave à la plus grave, en les nommant. Une sanction absente de la liste sera une sanction non prévue.",
      "Chiffrer la durée maximale de la mise à pied disciplinaire, en jours, et l'écrire dans le règlement : c'est cette mention qui rend la mise à pied licite.",
      "Vérifier que l'échelle ne comporte aucune amende ni sanction pécuniaire : L. 1331-2 les interdit et répute non écrite toute disposition contraire.",
      "Soumettre l'avenant à l'avis du comité social et économique (L. 1321-4), puis lui faire suivre publicité, dépôt au greffe et communication à l'inspection, avec une entrée en vigueur postérieure d'un mois à la dernière formalité (R. 1321-3).",
    ],
    verifs: [
      { cle: "ri03Echelle", question: "Quelles sanctions l'échelle du règlement intérieur énumère-t-elle, et à quel article ?", attendu: "La liste telle qu'elle est écrite, et l'article : une sanction absente de cette liste ne peut pas être prononcée." },
      { cle: "ri03MisePiedMax", question: "Quelle durée maximale le règlement intérieur assigne-t-il à la mise à pied disciplinaire, et à quel article ?", attendu: "Le nombre de jours et l'article ; L. 1321-1, 3°, réserve au règlement la nature et l'échelle des sanctions." },
      { cle: "ri03Pecuniaire", question: "L'échelle est-elle exempte de toute amende ou sanction pécuniaire ?", attendu: "La lecture de la liste : L. 1331-2 répute non écrite toute disposition contraire." },
    ],
  },

  "DIS-CTL-RI-04": {
    gravite: 1,
    quoiFaire: "Ajouter au règlement intérieur les trois rappels que L. 1321-2 lui impose de faire.",
    risque: "L. 1321-2 est rédigé à l'impératif : le règlement intérieur « rappelle » les droits de la défense des articles L. 1332-1 à L. 1332-3, les dispositions sur les harcèlements moral et sexuel et les agissements sexistes, et l'existence du dispositif de protection des lanceurs d'alerte. Un règlement qui ne les rappelle pas est contraire à ce texte, et « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1) — L. 1321-2 est dans cette énumération. L'inspecteur du travail peut en outre à tout moment en exiger la modification (L. 1322-1).",
    delai: "Deux mois, avenant et formalités comprises.",
    document: "Avenant au règlement intérieur — les rappels de L. 1321-2",
    etapes: [
      "Rappeler les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3, ou celles de la convention collective applicable si elle en prévoit de plus favorables : information écrite des griefs, convocation, entretien, mise à pied conservatoire suivie de la procédure.",
      "Rappeler les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes prévues par le code du travail.",
      "Rappeler l'existence du dispositif de protection des lanceurs d'alerte.",
      "Soumettre l'avenant à l'avis du comité social et économique, puis accomplir publicité, dépôt et communication à l'inspection, avec une entrée en vigueur postérieure d'un mois à la dernière formalité (L. 1321-4 ; R. 1321-3).",
    ],
    verifs: [
      { cle: "ri04Defense", question: "À quel article le règlement intérieur rappelle-t-il les droits de la défense des articles L. 1332-1 à L. 1332-3, ou ceux de la convention collective applicable ?", attendu: "L'article, pointé sur le document." },
      { cle: "ri04Harcelement", question: "À quel article rappelle-t-il les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ?", attendu: "L'article, pointé sur le document." },
      { cle: "ri04Alerte", question: "À quel article rappelle-t-il l'existence du dispositif de protection des lanceurs d'alerte ?", attendu: "L'article, pointé sur le document." },
    ],
  },

  "DIS-CTL-RI-05": {
    gravite: 1,
    quoiFaire: "Retirer du règlement intérieur les clauses que L. 1321-3 prohibe, et documenter la justification et la proportionnalité de toute clause de neutralité qui y demeure.",
    risque: "L. 1321-3 interdit les dispositions contraires aux lois, règlements et stipulations conventionnelles, les restrictions aux droits des personnes et aux libertés qui ne seraient ni justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché, et les dispositions discriminatoires. L'inspecteur du travail peut à tout moment en exiger le retrait ou la modification (L. 1322-1) ; et une sanction prise sur le fondement d'une clause prohibée est une sanction sans support. Le règlement qui porte une telle clause méconnaît L. 1321-3, et « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1).",
    delai: "Un mois pour l'examen clause par clause, deux de plus pour l'avenant et ses formalités.",
    document: "Note de revue des clauses du règlement intérieur au regard de L. 1321-3 et L. 1321-2-1",
    etapes: [
      "Relire le règlement clause par clause et isoler celles qui restreignent un droit ou une liberté : fouille, contrôle d'alcoolémie, tenue, usage des outils numériques, expression, circulation.",
      "Pour chacune, écrire deux choses et non une seule : la nature de la tâche qui la justifie, et pourquoi la restriction ne va pas au-delà du but recherché. L. 1321-3, 2°, exige cette double condition.",
      "Supprimer ce qui ne la remplit pas, ainsi que toute disposition contraire aux lois, aux règlements ou aux stipulations conventionnelles applicables, et toute disposition discriminant les salariés au sens de L. 1321-3, 3°.",
      "Si une clause de neutralité est maintenue, la rattacher à ce que L. 1321-2-1 autorise : l'exercice d'autres libertés et droits fondamentaux ou les nécessités du bon fonctionnement de l'entreprise, et la proportionner au but recherché ; consigner cette justification par écrit, poste par poste.",
      "Soumettre l'avenant à l'avis du comité social et économique, puis accomplir publicité, dépôt et communication à l'inspection (L. 1321-4 ; R. 1321-1 ; R. 1321-2 ; R. 1321-4).",
    ],
    verifs: [
      { cle: "ri05Restrictions", question: "Quelles clauses du règlement intérieur restreignent un droit ou une liberté, et pour quels postes ou quelles tâches ?", attendu: "La liste, article par article, avec la tâche invoquée : L. 1321-3, 2°, n'admet que les restrictions justifiées par la nature de la tâche à accomplir et proportionnées au but recherché." },
      { cle: "ri05Neutralite", question: "Si une clause de neutralité existe, quel écrit daté consigne la justification retenue et le but poursuivi ?", attendu: "L'écrit lui-même — note, délibération, avis. L. 1321-2-1 exige justification et proportionnalité ; une affirmation ne les établit pas." },
    ],
  },

  "DIS-CTL-RI-06": {
    gravite: 1,
    quoiFaire: "Soumettre le règlement intérieur à l'avis du comité social et économique, et ne l'introduire qu'ensuite.",
    risque: "L. 1321-4 dispose que le règlement intérieur « ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique ». Introduit sans cet avis, il l'a été en méconnaissance de la condition que le texte pose ; et l'avis est en outre la pièce qui doit accompagner le règlement communiqué à l'inspecteur du travail. Deux textes répressifs se rencontrent ici. « Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1), et L. 1321-4 est dans cette énumération. Par ailleurs, « le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1) : la consultation qui n'a pas eu lieu expose l'employeur à cette qualification, qu'il appartient au juge de retenir ou d'écarter.",
    delai: "Un mois pour la consultation, un mois de plus avant l'entrée en vigueur de la version régularisée.",
    document: "Ordre du jour et procès-verbal de consultation du comité social et économique sur le règlement intérieur",
    etapes: [
      "Inscrire le règlement intérieur — ou l'avenant — à l'ordre du jour d'une réunion du comité social et économique, et transmettre le projet aux membres avant la réunion : un avis se rend sur un texte, pas sur une annonce.",
      "Tenir la réunion, recueillir l'avis et le consigner au procès-verbal, avec sa date. Le texte exige que le règlement ait été soumis à l'avis, non que l'avis soit favorable.",
      "Conserver le procès-verbal : c'est la pièce qui accompagne le règlement communiqué à l'inspecteur du travail (L. 1321-4).",
      "Ne fixer la date d'entrée en vigueur qu'après cet avis, et postérieure d'un mois à la dernière des formalités de publicité et de dépôt (R. 1321-3).",
    ],
    verifs: [
      { cle: "ri06AvisDate", question: "À quelle date le comité social et économique a-t-il été consulté, et à quelle date a-t-il rendu son avis ?", attendu: "Les deux dates, et le procès-verbal de la réunion." },
      { cle: "ri06AvisAvant", question: "Cette date est-elle antérieure à l'introduction du règlement intérieur ?", attendu: "La comparaison des deux dates : L. 1321-4 interdit l'introduction avant l'avis." },
    ],
  },

  "DIS-CTL-RI-07": {
    gravite: 1,
    quoiFaire: "Porter le règlement intérieur à la connaissance des personnes ayant accès aux lieux de travail, et reporter son entrée en vigueur à un mois au moins après la dernière des formalités de publicité et de dépôt.",
    risque: "R. 1321-1 impose que le règlement soit porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche. L. 1321-4 exige que la date d'entrée en vigueur soit postérieure d'un mois à l'accomplissement des formalités de publicité, ce délai courant de la dernière en date des formalités de publicité et de dépôt (R. 1321-3). Une entrée en vigueur anticipée prive de support toute sanction prise dans l'intervalle sur le fondement du règlement. R. 1321-1, R. 1321-3 et L. 1321-4 sont tous trois dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Quelques jours pour la publicité, puis le mois qu'impose le texte.",
    document: "Attestation de publicité du règlement intérieur et note fixant sa date d'entrée en vigueur",
    etapes: [
      "Choisir le moyen de publicité et l'accomplir : affichage sur les lieux de travail et dans les locaux où se fait l'embauche, mise en ligne accessible, remise contre émargement — R. 1321-1 laisse le moyen libre, mais la preuve incombe à l'employeur.",
      "Dater cet accomplissement, et le documenter : photographie de l'affichage, capture datée, liste d'émargement.",
      "Relever la date de la dernière en date des formalités de publicité et de dépôt : c'est d'elle, et non de la première, que court le délai d'un mois (R. 1321-3).",
      "Inscrire dans le règlement une date d'entrée en vigueur postérieure d'un mois à cette date, et ne l'appliquer qu'à compter de celle-ci.",
    ],
    verifs: [
      { cle: "ri07Publicite", question: "Par quel moyen et à quelle date le règlement intérieur a-t-il été porté à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche ?", attendu: "Le moyen et la date, avec la pièce qui l'établit (R. 1321-1)." },
      { cle: "ri07DerniereFormalite", question: "Quelle est la date de la dernière en date des formalités de publicité et de dépôt ?", attendu: "La date : c'est d'elle que court le délai d'un mois (R. 1321-3)." },
      { cle: "ri07EntreeVigueur", question: "Quelle date d'entrée en vigueur le règlement intérieur indique-t-il ?", attendu: "La date portée sur le document, postérieure d'un mois à celle de la dernière formalité (L. 1321-4)." },
    ],
  },

  "DIS-CTL-RI-08": {
    gravite: 1,
    quoiFaire: "Déposer le règlement intérieur au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement.",
    risque: "R. 1321-2 impose ce dépôt, et R. 1321-3 fait courir de la dernière en date des formalités de publicité et de dépôt le délai d'un mois qui précède l'entrée en vigueur : tant que le dépôt n'est pas fait, ce délai n'a pas commencé de courir, et la date d'entrée en vigueur inscrite au règlement ne vaut pas. Ces deux articles réglementaires sont dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Quelques jours pour le dépôt ; un mois ensuite avant que l'entrée en vigueur puisse être fixée.",
    document: "Lettre de dépôt du règlement intérieur au greffe du conseil de prud'hommes",
    etapes: [
      "Identifier le conseil de prud'hommes du ressort de l'entreprise ou de l'établissement — R. 1321-2 vise le ressort, et non le siège social lorsque les deux diffèrent.",
      "Y déposer le texte du règlement intérieur, en demandant un récépissé ou un accusé de réception daté.",
      "Comparer la date du dépôt à celle de la publicité, et retenir la plus tardive des deux : c'est elle qui fait courir le mois (R. 1321-3).",
      "Rectifier, s'il y a lieu, la date d'entrée en vigueur inscrite au règlement, et refaire pour cette rectification les formalités de L. 1321-4.",
    ],
    verifs: [
      { cle: "ri08DepotDate", question: "À quelle date le règlement intérieur a-t-il été déposé, et auprès de quel conseil de prud'hommes ?", attendu: "La date et le conseil de prud'hommes du ressort de l'entreprise ou de l'établissement (R. 1321-2)." },
      { cle: "ri08DepotPreuve", question: "Quelle pièce établit ce dépôt ?", attendu: "Le récépissé ou l'accusé du greffe. Sans pièce, la date n'est qu'une déclaration." },
    ],
  },

  /* Ce contrôle passe de 4 à 1 le 24 août 2026, et le saut mérite d'être
     expliqué. Civilement, la carence est bénigne : le contrôle relève,
     décision à l'appui, qu'elle ne prive pas le salarié de se prévaloir du
     règlement. Pénalement, elle ne l'est pas : L. 1321-4 et R. 1321-4 sont
     tous deux dans l'énumération de R. 1323-1. Le degré dit la nature de
     l'exposition, non la peine du travail à faire — l'envoi de deux
     exemplaires reste l'affaire d'une heure, et le délai le dit. */
  "DIS-CTL-RI-09": {
    gravite: 1,
    quoiFaire: "Transmettre à l'inspecteur du travail le texte du règlement intérieur en deux exemplaires, accompagné de l'avis du comité social et économique.",
    risque: "L. 1321-4 impose que le règlement, accompagné de l'avis du comité social et économique, soit communiqué à l'inspecteur du travail en même temps qu'il fait l'objet des mesures de publicité, et R. 1321-4 précise qu'il est transmis en deux exemplaires. Cette carence est la seule du chapitre dont le contrôle DIS-CTL-RI-09 relève, décision à l'appui, qu'elle ne prive pas le salarié de se prévaloir du règlement : elle se répare par un envoi, mais elle ouvre la voie à l'exigence de retrait ou de modification de L. 1322-1 sur un texte que l'inspection n'a jamais vu. Sur le terrain pénal, en revanche, elle est traitée comme les autres : L. 1321-4 et R. 1321-4 figurent dans l'énumération de R. 1323-1, aux termes duquel « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Quelques jours : c'est un envoi.",
    document: "Lettre de transmission du règlement intérieur à l'inspecteur du travail, en deux exemplaires",
    etapes: [
      "Réunir les pièces : deux exemplaires du texte du règlement intérieur (R. 1321-4) et l'avis du comité social et économique (L. 1321-4).",
      "Les adresser à l'inspecteur du travail compétent pour l'établissement, par une voie qui laisse une trace datée.",
      "Conserver la preuve d'envoi et sa date : L. 1321-4 veut que la communication soit faite en même temps que les mesures de publicité, et c'est la date qui l'établit.",
      "Traiter sans délai toute observation en retour : l'inspecteur peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1).",
    ],
    verifs: [
      { cle: "ri09Communication", question: "À quelle date le règlement intérieur a-t-il été communiqué à l'inspecteur du travail, et par quelle voie ?", attendu: "La date et la preuve d'envoi ; L. 1321-4 veut qu'elle soit celle des mesures de publicité." },
      { cle: "ri09Exemplaires", question: "L'envoi comportait-il deux exemplaires du texte et l'avis du comité social et économique ?", attendu: "Le bordereau ou la copie de l'envoi (R. 1321-4 pour les deux exemplaires, L. 1321-4 pour l'avis)." },
    ],
  },

  "DIS-CTL-RI-10": {
    gravite: 1,
    quoiFaire: "Rédiger en français le règlement intérieur et tout document comportant des obligations pour le salarié, les traductions n'étant qu'un accompagnement.",
    risque: "L. 1321-6 impose la rédaction en français, et étend l'exigence à tout document comportant des obligations pour le salarié ou des dispositions dont la connaissance est nécessaire à l'exécution de son travail. L'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires à ce texte (L. 1322-1). L. 1321-6 est dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Un mois pour la version française, deux de plus pour les formalités de l'avenant.",
    document: "Version française du règlement intérieur et des documents portant obligations pour le salarié",
    etapes: [
      "Établir la version française du règlement intérieur : c'est elle qui fait foi, la ou les traductions ne venant qu'en accompagnement (L. 1321-6).",
      "Recenser les autres documents visés par le texte — consignes, chartes, procédures, notes — qui comportent des obligations pour le salarié ou dont la connaissance est nécessaire à l'exécution de son travail, et les mettre en français.",
      "Réserver l'exception que le texte prévoit aux seuls documents reçus de l'étranger ou destinés à des étrangers, et ne pas l'étendre au-delà.",
      "Soumettre la version française à l'avis du comité social et économique, puis accomplir publicité, dépôt et communication à l'inspection (L. 1321-4).",
    ],
    verifs: [
      { cle: "ri10Francais", question: "Quelle version du règlement intérieur fait foi, et quelles traductions l'accompagnent ?", attendu: "Le document français, et la liste des traductions éventuelles (L. 1321-6)." },
      { cle: "ri10AutresDocuments", question: "Quels autres documents comportant des obligations pour le salarié sont diffusés, et dans quelle langue ?", attendu: "La liste et la langue : L. 1321-6 étend l'exigence à tout document comportant des obligations pour le salarié ou dont la connaissance est nécessaire à l'exécution de son travail." },
    ],
  },

  "DIS-CTL-RI-11": {
    gravite: 1,
    quoiFaire: "Refaire, pour chaque modification ou retrait de clause et pour chaque note de service à portée générale et permanente, les formalités du titre.",
    risque: "L. 1321-4 dispose que ses dispositions « s'appliquent également en cas de modification ou de retrait des clauses du règlement intérieur », et L. 1321-5 considère les notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 comme des adjonctions au règlement, soumises en toute hypothèse aux dispositions du titre. Une modification introduite sans ces formalités n'a pas été régulièrement introduite ; une note de service prise à leur place n'échappe pas à la règle en changeant de nom. L. 1321-4 et L. 1321-5 sont l'un et l'autre dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ». Et la modification soustraite à l'avis du comité social et économique expose en outre à l'amende de 7 500 € que L. 2317-1 attache à l'entrave au fonctionnement régulier du comité.",
    delai: "Deux mois par vague de modifications : consultation, formalités, puis le mois qui précède l'entrée en vigueur.",
    document: "Récapitulatif daté des modifications et notes de service, avec les formalités accomplies pour chacune",
    etapes: [
      "Recenser, depuis l'introduction du règlement intérieur, toutes les clauses modifiées ou retirées, et toutes les notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2.",
      "Pour chacune, dresser le relevé des quatre formalités et de leurs dates : avis du comité social et économique, publicité, dépôt au greffe, communication à l'inspection.",
      "Reprendre celles dont une formalité manque : les soumettre à l'avis du comité, puis accomplir publicité, dépôt et communication, avec une entrée en vigueur postérieure d'un mois à la dernière formalité (R. 1321-3).",
      "Réserver l'application immédiate à ce que L. 1321-5 permet — les seules obligations relatives à la santé et à la sécurité, lorsque l'urgence le justifie — en communiquant alors immédiatement et simultanément les prescriptions au secrétaire du comité social et économique et à l'inspection du travail.",
    ],
    verifs: [
      { cle: "ri11Modifications", question: "Quelles clauses ont été modifiées ou retirées depuis l'introduction du règlement intérieur, et à quelles dates ?", attendu: "La liste datée des avenants." },
      { cle: "ri11FormalitesModif", question: "Pour chacune, à quelles dates l'avis du comité, la publicité, le dépôt et la communication à l'inspection sont-ils intervenus ?", attendu: "Les quatre dates, modification par modification (L. 1321-4, dernier alinéa)." },
      { cle: "ri11Notes", question: "Quelles notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 sont en vigueur, et quelles formalités ont-elles suivies ?", attendu: "La liste et les dates ; L. 1321-5 les considère comme des adjonctions au règlement intérieur." },
    ],
  },

  "DIS-CTL-RI-12": {
    gravite: 1,
    quoiFaire: "Exécuter la demande de retrait ou de modification formée par l'inspecteur du travail, ou former le recours hiérarchique que L. 1322-3 ouvre.",
    risque: "L. 1322-1 permet à l'inspecteur du travail d'exiger à tout moment le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6. Sa décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité social et économique (L. 1322-2). La seule voie que le texte ouvre contre elle est le recours hiérarchique (L. 1322-3) : ne rien faire n'en est pas une, et laisse en vigueur une disposition dont l'irrégularité est désormais actée par écrit. L'énumération de R. 1323-1 court jusqu'à L. 1322-4 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ». La décision restée sans effet laisse donc subsister, en même temps que la clause, la disposition méconnue qu'elle désigne.",
    delai: "Quelques semaines pour l'avenant ; le recours hiérarchique, s'il est choisi, se forme sans attendre.",
    document: "Avenant de retrait ou de modification des dispositions visées par l'inspecteur du travail",
    etapes: [
      "Reprendre la décision de l'inspecteur du travail et relever ce qu'elle vise exactement : elle est motivée, et c'est sa motivation qui délimite ce qu'il faut retirer ou modifier (L. 1322-2).",
      "Choisir la voie, et une seule : exécuter, ou former le recours hiérarchique de L. 1322-3. Le choix se date et s'écrit.",
      "Si la voie est l'exécution, rédiger l'avenant de retrait ou de modification, le soumettre à l'avis du comité social et économique, puis accomplir publicité, dépôt au greffe et communication à l'inspection (L. 1321-4).",
      "Informer l'inspecteur du travail de la suite donnée, et conserver la trace de cette information ; vérifier que la décision a bien été communiquée pour information aux membres du comité social et économique (L. 1322-2).",
    ],
    verifs: [
      { cle: "ri12DemandeDate", question: "À quelle date l'inspecteur du travail a-t-il exigé le retrait ou la modification, et sur quelles dispositions ?", attendu: "La décision motivée et notifiée elle-même (L. 1322-1 ; L. 1322-2)." },
      { cle: "ri12SuiteDate", question: "À quelle date le retrait ou la modification a-t-il été opéré, et par quel acte ?", attendu: "L'avenant daté, et les dates des formalités de L. 1321-4 accomplies pour lui." },
      { cle: "ri12Recours", question: "Un recours hiérarchique a-t-il été formé, et à quelle date ?", attendu: "La date et la copie du recours (L. 1322-3), ou la mention expresse qu'aucun n'a été formé." },
    ],
  },

  /* ------------------------------------------------------- les sanctions */

  /* CE QUE R. 1323-1 NE COUVRE PAS, ET QU'IL NE FAUT PAS « CORRIGER ».
     R. 1323-1 punit la méconnaissance des articles « L. 1311-2 à L. 1322-4 et
     R. 1321-1 à R. 1321-5 ». L'énumération s'arrête à L. 1322-4 : elle
     n'atteint ni L. 1331-1, ni les articles L. 1332-1 à L. 1332-5 de la
     procédure disciplinaire, ni les articles R. 1332-1 à R. 1332-3 qui les
     appliquent. Et L. 1334-1, seul autre texte répressif du titre, ne vise
     qu'un article : L. 1331-2.
     Conséquence, tenue article par article : de DIS-CTL-SAN-01 à
     DIS-CTL-SAN-12, seul DIS-CTL-SAN-02 — la sanction pécuniaire — est coté 1.
     Tous les autres restent au degré 3, non par prudence rédactionnelle mais
     parce qu'aucun texte lu ne les punit : ce que risque l'employeur est
     l'annulation de la sanction par le conseil de prud'hommes (L. 1333-2), et
     c'est exactement ce que le degré 3 annonce. Relever l'un d'eux
     reviendrait à annoncer une amende qu'aucun texte ne porte.
     Deux cas frontaliers, notés pour qu'on n'y revienne pas : DIS-CTL-SAN-03
     et DIS-CTL-SAN-04 citent L. 1321-1, 3°, qui est bien dans l'énumération de
     R. 1323-1 — mais ce qu'ils contrôlent n'est pas le contenu du règlement
     intérieur (c'est l'objet de DIS-CTL-RI-03, coté 1) : c'est le fait de
     prononcer une sanction hors de l'échelle que le règlement fixe. Sortir de
     son propre règlement n'est pas méconnaître L. 1321-1, et aucun texte lu ne
     l'érige en infraction. Ils restent au degré 3. */

  "DIS-CTL-SAN-01": {
    gravite: 3,
    quoiFaire: "Informer le salarié, par écrit, des griefs retenus contre lui, avant toute sanction.",
    risque: "« Aucune sanction ne peut être prise à l'encontre du salarié sans que celui-ci soit informé, dans le même temps et par écrit, des griefs retenus contre lui » (L. 1332-1). L'exigence porte sur toute sanction au sens de L. 1331-1 — toute mesure autre que les observations verbales — et ne connaît pas l'exception que L. 1332-2 réserve à l'avertissement. La sanction prise sans cet écrit est irrégulière en la forme, et le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Immédiat pour l'avenir ; pour la sanction déjà prise, c'est elle qu'il faut reprendre.",
    document: "Écrit d'énonciation des griefs retenus contre le salarié",
    etapes: [
      "Reprendre la mesure prononcée et vérifier qu'elle est bien une sanction au sens de L. 1331-1 : toute mesure autre qu'une observation verbale, de nature à affecter immédiatement ou non la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération.",
      "Si aucun écrit n'a énoncé les griefs, retirer la sanction plutôt que de la compléter après coup : L. 1332-1 exige que l'information soit donnée « dans le même temps », et un écrit postérieur ne rétablit pas ce simultané.",
      "Reprendre, s'il y a lieu, une procédure régulière : énonciation écrite des griefs, puis convocation et entretien lorsqu'ils sont dus, en veillant au délai de deux mois de L. 1332-4 qui court de la connaissance des faits.",
      "Conserver l'écrit et la preuve de sa remise : c'est cette pièce, et non le souvenir d'un entretien, qui établit l'information.",
    ],
    verifs: [
      { cle: "san01EcritDate", question: "À quelle date, et par quel écrit, les griefs ont-ils été portés à la connaissance du salarié ?", attendu: "La date et l'écrit lui-même, avec la preuve de sa remise (L. 1332-1)." },
      { cle: "san01Contenu", question: "Quels faits cet écrit énonce-t-il ?", attendu: "Les faits, tels qu'ils y sont écrits : L. 1332-1 veut que le salarié soit informé des griefs retenus contre lui, non de leur existence." },
    ],
  },

  "DIS-CTL-SAN-02": {
    gravite: 1,
    quoiFaire: "Supprimer toute amende ou retenue sur la rémunération qui ne soit pas la conséquence d'une suspension du contrat, et restituer les sommes retenues.",
    risque: "« Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite » (L. 1331-2). L'interdiction est absolue : elle ne se négocie ni par le contrat ni par le règlement intérieur. Elle est en outre la seule du chapitre que le code assortit d'une peine : « le fait d'infliger une amende ou une sanction pécuniaire en méconnaissance des dispositions de l'article L. 1331-2 est puni d'une amende de 3 750 euros » (L. 1334-1). Le conseil de prud'hommes peut par ailleurs annuler la sanction (L. 1333-2), et la somme retenue reste due.",
    delai: "Immédiat : la retenue se répare sur la paie suivante.",
    document: "Note de retrait de la sanction pécuniaire et régularisation de paie",
    etapes: [
      "Identifier la mesure pécuniaire : amende, pénalité, retenue, suppression de prime prononcée à titre de sanction, quelle que soit sa dénomination.",
      "La distinguer de ce qui n'en est pas une : la retenue correspondant à une mise à pied disciplinaire régulièrement prononcée n'est pas une sanction pécuniaire, elle est la conséquence de la suspension du contrat pendant les jours de mise à pied.",
      "Retirer la sanction pécuniaire par écrit, et restituer la somme sur la paie suivante, avec une ligne de régularisation identifiable.",
      "Purger le règlement intérieur, les contrats et les notes de toute stipulation qui la prévoyait : L. 1331-2 la répute non écrite, mais la laisser figurer entretient la pratique.",
    ],
    verifs: [
      { cle: "san02Retenue", question: "La sanction s'accompagne-t-elle d'une retenue sur la rémunération, et de quel montant ?", attendu: "Le montant, ou l'absence de retenue. Seule la retenue correspondant à la suspension du contrat pendant une mise à pied disciplinaire échappe à L. 1331-2." },
      { cle: "san02Bulletin", question: "Quel bulletin de paie porte cette retenue, et pour quelle période ?", attendu: "Le bulletin et la période, à confronter aux jours de mise à pied effectivement prononcés." },
    ],
  },

  "DIS-CTL-SAN-03": {
    gravite: 3,
    quoiFaire: "Ne prononcer que des sanctions figurant dans l'échelle du règlement intérieur, et retirer celle qui n'y figure pas.",
    risque: "La nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au règlement intérieur, que L. 1311-2 rend obligatoire à partir de cinquante salariés. Le contrôle DIS-CTL-SAN-03 cite les décisions qui en tirent la conséquence : chez l'employeur tenu d'établir un règlement intérieur, une sanction autre que le licenciement ne peut être prononcée que si elle y est prévue. À défaut, elle est irrégulière et le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Immédiat pour le retrait de la sanction ; deux mois si l'échelle doit être créée ou complétée.",
    document: "Note de retrait de la sanction non prévue par le règlement intérieur",
    etapes: [
      "Prendre le règlement intérieur dans la version en vigueur à la date de la sanction — et non dans celle d'aujourd'hui — et y chercher la sanction prononcée dans l'échelle.",
      "Si elle n'y figure pas, retirer la sanction par écrit et en informer le salarié : la maintenir laisse prospérer une irrégularité que le juge peut sanctionner par l'annulation (L. 1333-2).",
      "Examiner s'il existe, dans l'échelle telle qu'elle est écrite, une sanction adaptée aux faits, et reprendre le cas échéant une procédure régulière en respectant le délai de deux mois de L. 1332-4.",
      "Compléter l'échelle pour l'avenir par un avenant au règlement intérieur, avec l'avis du comité social et économique et les formalités de L. 1321-4 : une échelle complétée ne rétroagit pas sur une sanction déjà prononcée.",
    ],
    verifs: [
      { cle: "san03Article", question: "Quel article du règlement intérieur prévoit la sanction prononcée ?", attendu: "L'article, cité et pointé sur le document." },
      { cle: "san03Version", question: "Quelle version du règlement intérieur était en vigueur à la date de la sanction ?", attendu: "La version, avec sa date d'entrée en vigueur : c'est elle qui s'applique, non celle d'aujourd'hui." },
    ],
  },

  "DIS-CTL-SAN-04": {
    gravite: 3,
    quoiFaire: "Ramener la mise à pied disciplinaire dans la limite de la durée maximale que le règlement intérieur fixe, ou la retirer.",
    risque: "L. 1321-1, 3°, réserve au règlement intérieur la nature et l'échelle des sanctions, et le contrôle DIS-CTL-SAN-04 cite la décision qui en tire la règle : une mise à pied disciplinaire n'est licite que si le règlement intérieur précise sa durée maximale. Une mise à pied qui excède cette durée excède l'échelle, et la sanction est annulable comme irrégulière en la forme (L. 1333-2). La rémunération des jours retenus en excès reste due.",
    delai: "Immédiat : les jours excédentaires se corrigent avant d'être exécutés, et se paient s'ils l'ont été.",
    document: "Note rectificative de la durée de la mise à pied disciplinaire",
    etapes: [
      "Relever deux nombres : la durée maximale inscrite au règlement intérieur en vigueur à la date de la sanction, et la durée effectivement prononcée.",
      "Si la seconde excède la première, ramener la mise à pied à la durée maximale par une décision écrite notifiée au salarié, et lui rendre les jours retirés en excès.",
      "Régulariser la paie des jours indûment retenus : la retenue sans support disciplinaire n'est plus la conséquence d'une suspension du contrat, et tombe sous l'interdiction des sanctions pécuniaires de L. 1331-2.",
      "Si le règlement intérieur ne précise aucune durée maximale, retirer la mise à pied et traiter le point au niveau du règlement — c'est l'objet de la régularisation de DIS-CTL-RI-03.",
    ],
    verifs: [
      { cle: "san04Duree", question: "Combien de jours la mise à pied disciplinaire prononcée compte-t-elle, et entre quelles dates ?", attendu: "Le nombre de jours et les dates de début et de fin, portés sur la notification." },
      { cle: "san04Plafond", question: "Quelle durée maximale le règlement intérieur en vigueur à cette date fixait-il, et à quel article ?", attendu: "Le nombre de jours et l'article (L. 1321-1, 3°)." },
    ],
  },

  "DIS-CTL-SAN-05": {
    gravite: 3,
    quoiFaire: "Retirer la sanction fondée sur des faits prescrits, et n'engager les poursuites que dans les deux mois de la connaissance des faits.",
    risque: "« Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales » (L. 1332-4). Le délai est de prescription : passé le terme, le fait ne peut plus fonder une sanction, quelle que soit sa gravité. R. 1332-1 impose d'ailleurs que la lettre de convocation soit remise ou adressée dans ce délai de deux mois.",
    delai: "Immédiat : le délai est passé ou il ne l'est pas, et rien ne le rouvre.",
    document: "Note de retrait de la sanction fondée sur des faits prescrits",
    etapes: [
      "Fixer le point de départ : le jour où l'employeur a eu connaissance des faits, et non celui où ils se sont produits ni celui où l'enquête s'est achevée. Documenter cette date par la pièce qui l'établit — signalement, constat, rapport reçu.",
      "Fixer la date d'engagement des poursuites : celle de la lettre de convocation à l'entretien préalable, ou, lorsque aucun entretien n'était dû, celle de la notification. R. 1332-1 rattache expressément la convocation au délai de deux mois de L. 1332-4.",
      "Comparer les deux dates. Si l'écart dépasse deux mois, vérifier la seule réserve que le texte prévoit : les faits ont-ils donné lieu, dans le même délai de deux mois, à l'exercice de poursuites pénales ? La réserve suppose que les poursuites aient été exercées dans le délai, non après.",
      "Hors cette réserve, retirer la sanction par écrit : le fait prescrit ne peut plus la fonder. Pour l'avenir, engager les poursuites dès la connaissance des faits, sans attendre l'issue d'une enquête interne au-delà du terme.",
    ],
    verifs: [
      { cle: "san05Connaissance", question: "À quelle date exacte l'employeur a-t-il eu connaissance des faits, et par quelle pièce ?", attendu: "La date et la pièce qui l'établit : c'est d'elle que court le délai de deux mois (L. 1332-4)." },
      { cle: "san05Engagement", question: "À quelle date les poursuites ont-elles été engagées, et par quel acte ?", attendu: "La date de la lettre de convocation ou, à défaut d'entretien dû, de la notification ; R. 1332-1 veut que la convocation soit remise ou adressée dans ce délai." },
      { cle: "san05Penales", question: "Les faits ont-ils donné lieu à des poursuites pénales, et à quelle date ont-elles été exercées ?", attendu: "La date de l'acte de poursuite : L. 1332-4 ne réserve le cas que si elles ont été exercées dans le même délai de deux mois." },
    ],
  },

  "DIS-CTL-SAN-06": {
    gravite: 3,
    quoiFaire: "Écarter de la motivation de la sanction toute sanction antérieure de plus de trois ans, et réexaminer la mesure sans elle.",
    risque: "« Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction » (L. 1332-5). Une sanction qui ne tient que par un passé disciplinaire prescrit perd son appui : le conseil de prud'hommes peut l'annuler comme irrégulière en la forme, injustifiée ou disproportionnée (L. 1333-2).",
    delai: "Quelques jours : c'est une relecture du dossier et de la lettre de notification.",
    document: "Note rectificative des motifs de la sanction, expurgée des sanctions antérieures prescrites",
    etapes: [
      "Lister les sanctions antérieures invoquées, avec la date de leur notification, et relever la date d'engagement des poursuites en cours.",
      "Écarter celles dont la notification est antérieure de plus de trois ans à cet engagement : L. 1332-5 en interdit l'invocation, sans exception.",
      "Réexaminer la mesure au vu des seuls éléments qui subsistent, et se demander si elle tenait par eux seuls. Si elle ne tenait que par le passé écarté, la retirer.",
      "Reprendre la lettre de notification pour qu'aucune sanction prescrite n'y soit mentionnée, et purger les dossiers individuels des mentions devenues inutilisables.",
    ],
    verifs: [
      { cle: "san06Anterieures", question: "Quelles sanctions antérieures sont invoquées, et à quelles dates ont-elles été notifiées ?", attendu: "La liste datée, avec les notifications." },
      { cle: "san06PlusAncienne", question: "Quelle est la date de la plus ancienne, et quelle est celle de l'engagement des poursuites ?", attendu: "Les deux dates : L. 1332-5 écarte toute sanction antérieure de plus de trois ans à l'engagement des poursuites." },
    ],
  },

  "DIS-CTL-SAN-07": {
    gravite: 3,
    quoiFaire: "Convoquer le salarié et tenir l'entretien préalable avant de prononcer la sanction, chaque fois qu'il est dû.",
    risque: "Lorsque l'employeur envisage une sanction, il convoque le salarié en lui précisant l'objet de la convocation ; au cours de l'entretien, il indique le motif de la sanction envisagée et recueille les explications du salarié (L. 1332-2). L'exception que ce texte réserve à l'avertissement tombe lorsque le règlement intérieur ou la convention collective subordonnent le licenciement à l'existence de sanctions antérieures : la sanction peut alors avoir une influence sur le maintien du salarié dans l'entreprise, et l'entretien devient une garantie de fond (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204). La sanction prise sans l'entretien dû est irrégulière en la forme, et le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Deux à trois semaines, sans jamais sortir du délai de deux mois de L. 1332-4.",
    document: "Lettre de convocation à l'entretien préalable et compte rendu d'entretien",
    etapes: [
      "Déterminer d'abord si l'entretien est dû : il l'est pour toute sanction, sauf l'avertissement ou une sanction de même nature sans incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération (L. 1332-2).",
      "Lire le règlement intérieur et la convention collective avant de conclure que l'entretien n'est pas dû : s'ils subordonnent le licenciement à l'existence de sanctions antérieures, l'avertissement lui-même peut peser sur le maintien du salarié dans l'entreprise, et l'entretien est alors dû au titre d'une garantie de fond (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204).",
      "Convoquer par une lettre portant les mentions de R. 1332-1, remise contre récépissé ou adressée par lettre recommandée, dans le délai de deux mois de L. 1332-4.",
      "Tenir l'entretien : indiquer le motif de la sanction envisagée, recueillir les explications du salarié, laisser jouer l'assistance par une personne de son choix appartenant au personnel de l'entreprise, et consigner le tout dans un compte rendu daté.",
      "Si la sanction a déjà été prononcée sans l'entretien dû, la retirer : un entretien tenu après coup ne répare pas une sanction déjà notifiée.",
    ],
    verifs: [
      { cle: "san07Convocation", question: "À quelle date le salarié a-t-il été convoqué, et à quelle date l'entretien s'est-il tenu ?", attendu: "Les deux dates, avec la convocation et la preuve de sa remise." },
      { cle: "san07Assistance", question: "Le salarié s'est-il fait assister, et par qui ?", attendu: "Le nom et la qualité de la personne, ou la mention qu'il y a renoncé ; L. 1332-2 ouvre l'assistance à une personne du choix du salarié appartenant au personnel de l'entreprise." },
      { cle: "san07Explications", question: "Quel écrit consigne le motif indiqué au salarié et les explications qu'il a données ?", attendu: "Le compte rendu d'entretien, daté : L. 1332-2 impose que l'employeur indique le motif et recueille les explications." },
      { cle: "san07Garantie", question: "Le règlement intérieur ou la convention collective subordonnent-ils le licenciement à l'existence de sanctions antérieures ?", attendu: "La clause, citée : dans ce cas l'entretien est dû même avant un avertissement (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204)." },
    ],
  },

  "DIS-CTL-SAN-08": {
    gravite: 3,
    quoiFaire: "Reprendre la lettre de convocation pour qu'elle porte les quatre exigences de R. 1332-1 et soit remise dans l'une des deux formes qu'il ouvre.",
    risque: "R. 1332-1 exige que la lettre indique l'objet de l'entretien, précise sa date, son heure et son lieu, rappelle que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et soit remise contre récépissé ou adressée par lettre recommandée, dans le délai de deux mois fixé à l'article L. 1332-4. Une convocation privée de la mention d'assistance prive le salarié de sa défense avant même l'entretien ; la sanction qui suit est irrégulière en la forme (L. 1333-2).",
    delai: "Immédiat : c'est une lettre à refaire, avant l'entretien.",
    document: "Lettre de convocation à l'entretien préalable — mentions de R. 1332-1",
    etapes: [
      "Reprendre le modèle de convocation et y vérifier les quatre exigences de R. 1332-1, une par une : l'objet de l'entretien, la date, l'heure et le lieu, le rappel du droit d'assistance, la forme de la remise.",
      "Écrire l'objet en clair — un entretien préalable à une éventuelle sanction — sans le noyer dans une formule vague : L. 1332-2 impose de préciser l'objet de la convocation.",
      "Rappeler mot pour mot la faculté d'assistance par une personne du choix du salarié appartenant au personnel de l'entreprise.",
      "Remettre la lettre contre récépissé ou l'adresser par lettre recommandée : R. 1332-1 n'ouvre que ces deux voies, et la date de cette remise doit tomber dans le délai de deux mois de L. 1332-4.",
      "Si l'entretien s'est déjà tenu sur une convocation irrégulière, ne pas prononcer la sanction sur ce fondement : reconvoquer régulièrement, si le délai de deux mois le permet encore.",
    ],
    verifs: [
      { cle: "san08Objet", question: "Que la lettre de convocation indique-t-elle comme objet de l'entretien ?", attendu: "La mention, telle qu'elle est écrite sur la lettre (R. 1332-1)." },
      { cle: "san08DateHeureLieu", question: "Quels date, heure et lieu la lettre précise-t-elle ?", attendu: "Les trois mentions, portées sur la lettre." },
      { cle: "san08Assistance", question: "La lettre rappelle-t-elle que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise ?", attendu: "La phrase elle-même, telle qu'elle figure sur la lettre." },
      { cle: "san08Remise", question: "Par quelle voie et à quelle date la lettre a-t-elle été remise ou adressée ?", attendu: "Le récépissé daté ou l'avis de recommandé : R. 1332-1 n'ouvre que ces deux voies." },
    ],
  },

  "DIS-CTL-SAN-09": {
    gravite: 3,
    quoiFaire: "Notifier la sanction au moins deux jours ouvrables et au plus un mois après le jour fixé pour l'entretien.",
    risque: "« La sanction ne peut intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour fixé pour l'entretien » (L. 1332-2). R. 1332-3 dit comment se compte le mois : il expire à vingt-quatre heures le jour du mois suivant qui porte le même quantième que le jour fixé pour l'entretien, à défaut de quantième identique le dernier jour du mois suivant, et il est prorogé jusqu'au premier jour ouvrable suivant lorsque son dernier jour est un samedi, un dimanche ou un jour férié ou chômé. R. 1332-2 impose la notification dans ce même délai d'un mois. Hors des deux bornes, la sanction est irrégulière en la forme et peut être annulée (L. 1333-2).",
    delai: "Le délai est celui du texte : entre deux jours ouvrables et un mois après l'entretien.",
    document: "Calendrier de notification — bornes de L. 1332-2 calculées selon R. 1332-3",
    etapes: [
      "Noter le jour fixé pour l'entretien : les deux délais courent de ce jour, et non de celui où la décision a été arrêtée.",
      "Calculer la borne basse : deux jours ouvrables au moins doivent s'écouler, ce qui laisse au salarié le temps de faire valoir ce qu'il a dit à l'entretien.",
      "Calculer la borne haute selon R. 1332-3 : même quantième le mois suivant, à vingt-quatre heures ; à défaut de quantième identique, le dernier jour du mois suivant ; prorogation au premier jour ouvrable suivant si ce jour est un samedi, un dimanche ou un jour férié ou chômé. Vérifier le calendrier des jours fériés à la main : l'application ne le tient pas.",
      "Notifier dans l'intervalle, contre récépissé ou par lettre recommandée (R. 1332-2), et conserver la preuve datée de cette remise — c'est elle qui fixe la date de la sanction.",
      "Si le mois est passé, ne pas notifier : la sanction serait irrégulière. Le cas se traite comme un retrait, non comme un rattrapage.",
    ],
    verifs: [
      { cle: "san09Entretien", question: "Quel jour a été fixé pour l'entretien ?", attendu: "La date, celle que porte la convocation : les deux délais de L. 1332-2 courent de ce jour." },
      { cle: "san09Notification", question: "À quelle date la sanction a-t-elle été notifiée ?", attendu: "La date de la remise contre récépissé ou de l'envoi recommandé." },
      { cle: "san09Feries", question: "Un jour férié ou chômé s'intercale-t-il entre l'entretien et la notification, ou tombe-t-il au terme du délai d'un mois ?", attendu: "Le calendrier : R. 1332-3 proroge le terme au premier jour ouvrable suivant lorsqu'il tombe un samedi, un dimanche ou un jour férié ou chômé, et l'application ne tient pas ce calendrier." },
    ],
  },

  "DIS-CTL-SAN-10": {
    gravite: 3,
    quoiFaire: "Notifier la sanction par une décision écrite et motivée, remise contre récépissé ou adressée par lettre recommandée.",
    risque: "« La sanction prévue à l'article L. 1332-2 fait l'objet d'une décision écrite et motivée. La décision est notifiée au salarié soit par lettre remise contre récépissé, soit par lettre recommandée, dans le délai d'un mois prévu par l'article L. 1332-2 » (R. 1332-2) ; L. 1332-2 le dit dans les mêmes termes — la sanction « est motivée et notifiée à l'intéressé ». Une notification qui n'énonce pas les griefs ne met pas le salarié en mesure de les discuter, et la sanction est irrégulière en la forme : le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Immédiat, et en tout cas dans le mois qui suit l'entretien.",
    document: "Lettre de notification de la sanction — décision écrite et motivée",
    etapes: [
      "Écrire la décision : R. 1332-2 exige un écrit, et une sanction annoncée oralement n'en est pas un.",
      "La motiver en énonçant les faits reprochés, datés et circonstanciés, et non par une formule générale : c'est la motivation qui permet au salarié de discuter les griefs et au juge d'apprécier.",
      "Nommer la sanction telle que le règlement intérieur la nomme, et en préciser la portée — pour une mise à pied, les dates de début et de fin.",
      "Remettre la lettre contre récépissé ou l'adresser par lettre recommandée, dans le délai d'un mois prévu par L. 1332-2, et conserver la preuve datée.",
    ],
    verifs: [
      { cle: "san10Ecrit", question: "Quel écrit porte la décision de sanction ?", attendu: "La lettre de notification elle-même (R. 1332-2)." },
      { cle: "san10Motifs", question: "Quels motifs la décision énonce-t-elle ?", attendu: "Les motifs, tels qu'ils y sont écrits : L. 1332-2 et R. 1332-2 imposent l'un et l'autre qu'elle soit motivée." },
      { cle: "san10Remise", question: "Par quelle voie et à quelle date la décision a-t-elle été notifiée ?", attendu: "Le récépissé daté ou l'avis de recommandé (R. 1332-2)." },
    ],
  },

  "DIS-CTL-SAN-11": {
    gravite: 3,
    quoiFaire: "Faire suivre toute mise à pied conservatoire de la procédure de L. 1332-2 avant de prononcer la sanction définitive.",
    risque: "« Lorsque les faits reprochés au salarié ont rendu indispensable une mesure conservatoire de mise à pied à effet immédiat, aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure prévue à l'article L. 1332-2 ait été respectée » (L. 1332-3). La mise à pied conservatoire n'est pas une sanction : elle attend la décision, elle ne la remplace pas. Une sanction définitive prise sans convocation ni entretien est irrégulière en la forme et peut être annulée (L. 1333-2) ; et la mise à pied conservatoire non suivie de la procédure risque d'être requalifiée en sanction, avec la retenue de salaire qui l'accompagne.",
    delai: "Quelques jours : la mise à pied conservatoire est une mesure d'attente, elle ne se prolonge pas.",
    document: "Notification de mise à pied conservatoire et convocation à l'entretien préalable",
    etapes: [
      "Notifier la mise à pied conservatoire par écrit en la qualifiant comme telle, en indiquant qu'elle est prise dans l'attente de la décision et non à titre de sanction.",
      "Engager sans attendre la procédure de L. 1332-2 : convocation portant les mentions de R. 1332-1, remise contre récépissé ou adressée par lettre recommandée.",
      "Tenir l'entretien, y indiquer le motif de la sanction envisagée et recueillir les explications du salarié, puis notifier la décision écrite et motivée dans les bornes de L. 1332-2.",
      "Si la mise à pied conservatoire n'a été suivie d'aucune procédure, ne pas prononcer la sanction définitive sur ces faits : L. 1332-3 l'interdit tant que la procédure de L. 1332-2 n'a pas été respectée, et le délai de deux mois de L. 1332-4 continue de courir.",
    ],
    verifs: [
      { cle: "san11MisePiedDates", question: "Entre quelles dates la mise à pied conservatoire a-t-elle couru, et quel écrit l'a notifiée ?", attendu: "Les dates de début et de fin, et l'écrit qui la qualifie de conservatoire." },
      { cle: "san11Enchainement", question: "À quelles dates la convocation, l'entretien et la notification de la sanction définitive sont-ils intervenus ?", attendu: "Les trois dates : L. 1332-3 exige que la procédure de L. 1332-2 ait été respectée avant toute sanction définitive relative à ces faits." },
    ],
  },

  "DIS-CTL-SAN-12": {
    gravite: 3,
    quoiFaire: "Accomplir, avant le prononcé de la sanction, la procédure que la convention collective ou le règlement intérieur imposent — et l'accomplir à temps.",
    risque: "C'est le manquement le plus coûteux du module, parce qu'il ne se répare pas. « La consultation d'un organisme chargé, en vertu d'une disposition conventionnelle ou d'un règlement intérieur, de donner son avis sur un licenciement envisagé par un employeur constitue une garantie de fond, en sorte que le licenciement prononcé sans que cet organisme ait été consulté ne peut avoir de cause réelle et sérieuse » ; l'irrégularité commise dans le déroulement de la procédure disciplinaire prévue par une telle disposition est assimilée à la violation d'une garantie de fond lorsqu'elle a privé le salarié de droits de sa défense ou qu'elle est susceptible d'avoir exercé une influence sur la décision finale (Soc., 8 septembre 2021, n° 19-15.039). Le caractère tardif de la demande d'avis est lui-même une irrégularité de la procédure disciplinaire (Soc., 20 mars 2024, n° 22-17.292). Pour une sanction autre que le licenciement, le conseil de prud'hommes apprécie si la sanction irrégulière en la forme doit être annulée (L. 1333-2).",
    delai: "Le temps que la clause prévoit, et pas moins : c'est la première chose à regarder, avant même de convoquer.",
    document: "Saisine de l'organisme prévu par la convention collective ou le règlement intérieur, et avis rendu",
    etapes: [
      "Lire la convention collective applicable et le règlement intérieur avant toute convocation, et relever ce qu'ils imposent : consultation d'un conseil de discipline ou d'une commission paritaire, entretien supplémentaire, délai de réflexion, forme particulière de notification.",
      "Relever les délais que la clause fixe : c'est le calendrier conventionnel qui commande, et une saisine tardive est en elle-même une irrégularité de la procédure disciplinaire.",
      "Saisir l'organisme, ou accomplir la formalité, avant le prononcé de la sanction, et conserver la date de saisine, la composition de l'organisme et l'avis rendu.",
      "Ne notifier la sanction qu'après l'avis, en veillant à rester dans les bornes de L. 1332-2 : les délais conventionnels ne suspendent pas le mois qui suit l'entretien.",
      "Si la procédure n'a pas été suivie, ou l'a été tardivement, retirer la sanction plutôt que de la maintenir : l'irrégularité ne se répare pas après coup, et la reprendre régulièrement dès l'origine est la seule voie — sous réserve du délai de deux mois de L. 1332-4.",
    ],
    verifs: [
      { cle: "san12Clause", question: "Quelle stipulation de la convention collective ou quel article du règlement intérieur prévoit la procédure, et que prévoit-il exactement ?", attendu: "Le texte de la clause, cité, avec les délais qu'elle fixe." },
      { cle: "san12Saisine", question: "À quelle date l'organisme a-t-il été saisi, ou la formalité accomplie, et à quelle date la sanction a-t-elle été notifiée ?", attendu: "Les deux dates : le caractère tardif de la demande d'avis est en lui-même une irrégularité de la procédure disciplinaire (Soc., 20 mars 2024, n° 22-17.292)." },
      { cle: "san12Avis", question: "Quel écrit consigne l'avis rendu et son contenu ?", attendu: "L'avis, daté, et la trace de la composition de l'organisme (Soc., 8 septembre 2021, n° 19-15.039)." },
    ],
  },

  /* Ce contrôle mesure l'exposition résultant des autres : il ne se régularise
     pas pour lui-même — on régularise ce qui la cause. Il ne rend d'ailleurs
     jamais « conforme » (il figure dans DETECTION), et n'a donc rien à
     reprendre au second temps non plus. */
  "DIS-CTL-EXP-01": null,
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
      /* Les clés voyagent jusqu'au formulaire de la page : deux clés identiques
         y feraient répondre une question à la place d'une autre. */
      if (v.cle && CLES.has(v.cle))
        ECARTS.push(`${id} : la clé de vérification « ${v.cle} » est déjà utilisée par ${CLES.get(v.cle)}`);
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
