/* Les documents que l'application PRODUIT, module « base de données
   économiques, sociales et environnementales ».

   POURQUOI CE FICHIER EXISTE

   Le module d'audit dit ce qui manque ; les fiches de régularisation disent
   quoi faire. Ni l'un ni l'autre ne fait le travail : un employeur à qui l'on
   explique en cinq étapes qu'il doit « monter la grille du décret, rubrique par
   rubrique » n'a toujours pas de grille. Il a une consigne, et devant lui trente
   et un mille huit cents caractères de décret à découper lui-même.

   Ce fichier écrit la pièce : la structure complète de la base, thème par thème
   et rubrique par rubrique, avec pour chaque case ce qu'il faut y mettre, sur
   quelle année, et où la donnée se trouve dans l'entreprise ; la décision qui
   fixe l'organisation, le support et les modalités d'accès ; les courriers de
   mise à disposition ; la note d'actualisation et son calendrier ; le dossier de
   preuve. Le tout au nom de l'entreprise, avec ses dates.

   LE CONTENU DU RÉGIME DESCEND DANS LE DOCUMENT. C'est tout l'intérêt. Une note
   qui se bornerait à écrire « reportez-vous à l'article R. 2312-9 » rendrait à
   l'employeur exactement le problème qu'il a. La grille est donc déployée :
   R. 2312-8 en dessous de trois cents salariés, R. 2312-9 à partir de trois
   cents, et les DEUX lorsque l'effectif n'est pas connu, plutôt que d'en
   deviner un.

   QUATRE RÈGLES, TENUES PARTOUT

   1. Rien qui n'ait été lu à la source. Les articles cités ici figurent dans
      moteur/bdese/textes-bdese.json avec leur identifiant de version, ou dans
      le fondement du contrôle auquel le document répond. Les articles seulement
      RENVOYÉS par un texte lu, L. 2232-12, L. 1142-8, L. 2315-27, L. 6315-1,
      L. 23-12-1 du code de commerce, sont NOMMÉS, jamais reproduits ni
      paraphrasés : le module ne les a pas lus, et il le dit à l'endroit même où
      le lecteur pourrait croire qu'il les connaît.

   2. Le contenu du décret n'est pas récrit : il est REPRIS du découpage que
      moteur/bdese/contenu-bdese.js opère sur le texte capté, et dont la
      couverture est mesurée à cent pour cent. La table ARBRE ci-dessous est la
      sortie de ce découpage, mêmes libellés, mot pour mot, avec la version de
      l'article. Réécrire ces tableaux à la main aurait garanti des écarts
      silencieux à la prochaine modification du décret.

   3. Les faits et les chiffres ne s'inventent jamais. Aucun document n'écrit la
      masse salariale, les effectifs par catégorie, les rémunérations ni les
      résultats. Tout cela sort entre crochets, avec l'indication de la source où
      l'employeur ira le chercher, déclaration sociale nominative, comptes
      annuels, registre unique du personnel. L'indication de source est une aide
      à la recherche, pas une affirmation sur l'entreprise.

   4. Aucune peine annoncée qui ne soit portée par un texte capté. Le corpus de
      ce module ne contient AUCUN texte pénal ni aucune pénalité financière
      propres à la base de données, c'est déjà le constat de
      regularisation-bdese.js, qui n'emploie ni gravité 1 ni gravité 2. Aucun
      document ne menace donc d'une amende. Ce qui se joue, et qui a été lu,
      c'est l'irrégularité opposable : une consultation dont le délai n'a pas
      couru faute d'information (R. 2312-5), un avis négatif acquis au terme
      (R. 2312-6), une base qui ne met pas le comité en état d'exercer utilement
      ses compétences (L. 2312-21).                                            */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function") return;

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  /* ══════════════════════════════════════════════════════════════════════
     LE DÉCRET, TEL QUE LE MODULE L'A DÉCOUPÉ

     Sortie de moteur/bdese/contenu-bdese.js, publiée dans _bdese.json : les
     rubriques, sections, sujets et informations des articles R. 2312-8 et
     R. 2312-9, avec leur identifiant de version. Chaque libellé se retrouve mot
     pour mot dans le texte capté, c'est la garantie « fidelite() » du
     découpage, et elle bloque la publication du module quand elle échoue.

     Le renvoi de R. 2312-9 vers le 1° A e) et f) de R. 2312-8, formation
     professionnelle et conditions de travail, est déjà EXÉCUTÉ dans cette
     table : les deux sujets y figurent avec la marque de leur origine.
     ══════════════════════════════════════════════════════════════════════ */

  var ARBRE = {
    "R. 2312-8": {
      article: "R. 2312-8", version: "LEGIARTI000049905537",
      seuil: "moins de trois cents salariés",
      rubriques: [
        { n: 1, plancher: true, themes: ["investissement social","investissement matériel et immatériel"],
          titre: "Investissements",
          sections: [
            { lettre: "A", titre: "Investissement social",
              sujets: [
                { lettre: "a", intitule: "Evolution des effectifs par type de contrat, par âge, par ancienneté",
                  informations: [
                    "évolution des effectifs retracée mois par mois",
                    "nombre de salariés titulaires d'un contrat de travail à durée indéterminée",
                    "nombre de salariés titulaires d'un contrat de travail à durée déterminée",
                    "nombre de salariés temporaires",
                    "nombre de salariés appartenant à une entreprise extérieure",
                    "nombre des journées de travail réalisées au cours des douze derniers mois par les salariés temporaires",
                    "nombre de contrats d'insertion et de formation en alternance ouverts aux jeunes de moins de vingt-six ans",
                    "motifs ayant conduit l'entreprise à recourir aux contrats de travail à durée déterminée, aux contrats de travail temporaire, aux contrats de travail à temps partiel, ainsi qu'à des salariés appartenant à une entreprise extérieure"
                  ] },
                { lettre: "b", intitule: "Evolution des emplois par catégorie professionnelle",
                  informations: [
                    "répartition des effectifs par sexe et par qualification",
                    "indication des actions de prévention et de formation que l'employeur envisage de mettre en œuvre, notamment au bénéfice des salariés âgés, peu qualifiés ou présentant des difficultés sociales particulières"
                  ] },
                { lettre: "c", intitule: "Evolution de l'emploi des personnes handicapées et mesures prises pour le développer",
                  informations: [
                    "Actions entreprises ou projetées en matière d'embauche, d'adaptation, de réadaptation ou de formation professionnelle",
                    "Déclaration annuelle prévue à l'article L. 5212-5 à l'exclusion des informations mentionnées à l'article D. 5212-4"
                  ] },
                { lettre: "d", intitule: "Evolution du nombre de stagiaires de plus de 16 ans",
                  informations: [] },
                { lettre: "e", intitule: "Formation professionnelle : investissements en formation, publics concernés",
                  informations: [
                    "les orientations de la formation professionnelle dans l'entreprise telles qu'elles résultent de la consultation prévue à l'article L. 2312-24",
                    "le résultat éventuel des négociations prévues à l'article L. 2241-6",
                    "les conclusions éventuelles des services de contrôle faisant suite aux vérifications effectuées en application des articles L. 6361-1 , L. 6323-13 et L. 6362-4",
                    "le bilan des actions comprises dans le plan de formation de l'entreprise pour l'année antérieure et pour l'année en cours comportant la liste des actions de formation, des bilans de compétences et des validations des acquis de l'expérience réalisés, rapportés aux effectifs concernés répartis par catégorie socioprofessionnelle et par sexe",
                    "les informations, pour l'année antérieure et l'année en cours, relatives aux congés individuels de formation, aux congés de bilan de compétences, aux congés de validation des acquis de l'expérience et aux congés pour enseignement accordés",
                    "notamment leur objet, leur durée et leur coût, aux conditions dans lesquelles ces congés ont été accordés ou reportés ainsi qu'aux résultats obtenus",
                    "le nombre des salariés bénéficiaires de l'abondement mentionné à l'avant-dernier alinéa du II de l'article L. 6315-1 ainsi que les sommes versées à ce titre",
                    "le nombre des salariés bénéficiaires de l'entretien professionnel mentionné au I de l'article L. 6315-1. Le bilan, pour l'année antérieure et l'année en cours, des conditions de mise en œuvre des contrats d'alternance : -les emplois occupés pendant et à l'issue de leur action ou de leur période de professionnalisation",
                    "les effectifs intéressés par âge, sexe et niveau initial de formation",
                    "les résultats obtenus en fin d'action ou de période de professionnalisation ainsi que les conditions d'appréciation et de validation. Le bilan de la mise en œuvre du compte personnel de formation"
                  ] },
                { lettre: "f", intitule: "Conditions de travail : durée du travail dont travail à temps partiel et aménagement du temps de travail",
                  informations: [
                    "Données sur le travail à temps partiel : -nombre, sexe et qualification des salariés travaillant à temps partiel",
                    "horaires de travail à temps partiel pratiqués dans l'entreprise",
                    "Le programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail prévu au 2° de l'article L. 2312-27 établi à partir des analyses mentionnées à l'article L. 2312-9 et fixant la liste détaillée des mesures devant être prises au cours de l'année à venir dans les mêmes domaines afin de satisfaire, notamment :"
                  ] },
                { lettre: "i", intitule: "Aux principes généraux de prévention prévus aux articles L. 4121-1 à L. 4121-5 et L. 4221-1",
                  informations: [] },
                { lettre: "ii", intitule: "A l'information et à la formation des travailleurs prévues aux articles L. 4141-1 à L. 4143-1",
                  informations: [] },
                { lettre: "iii", intitule: "A l'information et à la formation des salariés titulaires d'un contrat de travail à durée déterminée et des salariés temporaires prévues aux articles L. 4154-2 et L. 4154-4",
                  informations: [] },
                { lettre: "iv", intitule: "A la coordination de la prévention prévue aux articles L. 4522-1 et L. 4522-2",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Investissement matériel et immatériel",
              sujets: [
                { lettre: "a", intitule: "Evolution des actifs nets d'amortissement et de dépréciations éventuelles (immobilisations)",
                  informations: [] },
                { lettre: "b", intitule: "Le cas échéant, dépenses de recherche et développement",
                  informations: [] },
                { lettre: "c", intitule: "Mesures envisagées en ce qui concerne l'amélioration, le renouvellement ou la transformation des méthodes de production et d'exploitation",
                  informations: [
                    "et incidences de ces mesures sur les conditions de travail et l'emploi"
                  ] },
              ] },
          ] },
        { n: 2, plancher: true, themes: ["égalité professionnelle entre les femmes et les hommes au sein de l'entreprise"],
          titre: "Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
          sections: [
            { lettre: "A", titre: "Analyse des données chiffrées",
              sujets: [
                { lettre: null, intitule: "Analyse des données chiffrées : Analyse des données chiffrées par catégorie professionnelle de la situation respective des femmes et des hommes en matière d'embauche, de formation, de promotion professionnelle, de qualification, de classification, de conditions de travail, de santé et de sécurité au travail, de rémunération effective et d'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale analyse des écarts de salaires et de déroulement de carrière en fonction de leur âge, de leur qualification et de leur ancienneté",
                  informations: [
                    "description de l'évolution des taux de promotion respectifs des femmes et des hommes par métiers dans l'entreprise"
                  ] },
              ] },
            { lettre: "B", titre: "Stratégie d'action",
              sujets: [
                { lettre: null, intitule: "Stratégie d'action : A partir de l'analyse des données chiffrées mentionnées au A du 2°, la stratégie comprend les éléments suivants : -mesures prises au cours de l'année écoulée en vue d'assurer l'égalité professionnelle. Bilan des actions de l'année écoulée et, le cas échéant, de l'année précédente. Evaluation du niveau de réalisation des objectifs sur la base des indicateurs retenus. Explications sur les actions prévues non réalisées",
                  informations: [
                    "objectifs de progression pour l'année à venir et indicateurs associés. Définition qualitative et quantitative des mesures permettant de les atteindre conformément à l'article R. 2242-2. Evaluation de leur coût. Echéancier des mesures prévues"
                  ] },
              ] },
          ] },
        { n: 3, plancher: true, themes: ["fonds propres","endettement"],
          titre: "Fonds propres, endettement et impôts",
          sections: [
            { lettre: null, titre: "a) Capitaux propres de l'entreprise",
              sujets: [
                { lettre: "a", intitule: "Capitaux propres de l'entreprise",
                  informations: [] },
                { lettre: "b", intitule: "Emprunts et dettes financières dont échéances et charges financières",
                  informations: [] },
                { lettre: "c", intitule: "Impôts et taxes, notamment, le cas échéant, les informations contenues dans le rapport relatif à l'impôt sur les bénéfices prévu par l' article L. 232-6 du code de commerce",
                  informations: [] },
              ] },
          ] },
        { n: 4, plancher: true, themes: ["ensemble des éléments de la rémunération des salariés et dirigeants"],
          titre: "Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments",
          sections: [
            { lettre: "A", titre: "Evolution des rémunérations salariales",
              sujets: [
                { lettre: "a", intitule: "Frais de personnel y compris cotisations sociales, évolutions salariales par catégorie et par sexe, salaire de base minimum, salaire moyen ou médian, par sexe et par catégorie professionnelle",
                  informations: [] },
                { lettre: "b", intitule: "Pour les entreprises soumises aux dispositions de l' article L. 225-115 du code de commerce , montant global des rémunérations visées au 4° de cet article",
                  informations: [] },
                { lettre: "c", intitule: "Epargne salariale : intéressement, participation",
                  informations: [] },
              ] },
          ] },
        { n: 5, plancher: true, themes: ["activités sociales et culturelles"],
          titre: "Activités sociales et culturelles",
          sections: [
            { lettre: null, titre: "montant de la contribution aux activités sociales et culturelles Du comité social et économique, mécénat",
              sujets: [
                { lettre: null, intitule: "montant de la contribution aux activités sociales et culturelles Du comité social et économique, mécénat",
                  informations: [] },
              ] },
          ] },
        { n: 6, plancher: true, themes: ["rémunération des financeurs"],
          titre: "Rémunération des financeurs, en dehors des éléments mentionnés au 4°",
          sections: [
            { lettre: "A", titre: "Rémunération des actionnaires (revenus distribués)",
              sujets: [
                { lettre: null, intitule: "Rémunération des actionnaires (revenus distribués)",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)",
              sujets: [
                { lettre: null, intitule: "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)",
                  informations: [] },
              ] },
          ] },
        { n: 7, plancher: true, themes: ["flux financiers à destination de l'entreprise"],
          titre: "Flux financiers à destination de l'entreprise",
          sections: [
            { lettre: "A", titre: "Aides publiques",
              sujets: [
                { lettre: null, intitule: "Aides publiques : Aides ou avantages financiers consentis à l'entreprise par l'Union européenne, l'Etat, une collectivité territoriale, un de leurs établissements publics ou un organisme privé chargé d'une mission de service public, et leur utilisation. Pour chacune de ces aides, il est indiqué la nature de l'aide, son objet, son montant, les conditions de versement et d'emploi fixées, le cas échéant, par la personne publique qui l'attribue et son emploi",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Réductions d'impôts",
              sujets: [
                { lettre: null, intitule: "Réductions d'impôts",
                  informations: [] },
              ] },
            { lettre: "C", titre: "Exonérations et réductions de cotisations sociales",
              sujets: [
                { lettre: null, intitule: "Exonérations et réductions de cotisations sociales",
                  informations: [] },
              ] },
            { lettre: "D", titre: "Crédits d'impôts",
              sujets: [
                { lettre: null, intitule: "Crédits d'impôts",
                  informations: [] },
              ] },
            { lettre: "E", titre: "Mécénat",
              sujets: [
                { lettre: null, intitule: "Mécénat",
                  informations: [] },
              ] },
            { lettre: "F", titre: "Résultats financiers",
              sujets: [
                { lettre: "a", intitule: "Chiffre d'affaires, bénéfices ou pertes constatés",
                  informations: [] },
                { lettre: "b", intitule: "Résultats d'activité en valeur et en volume",
                  informations: [] },
                { lettre: "c", intitule: "Affectation des bénéfices réalisés",
                  informations: [] },
              ] },
          ] },
        { n: 8, plancher: false, themes: [],
          titre: "Partenariats",
          sections: [
            { lettre: "A", titre: "Partenariats conclus pour produire des services ou des produits pour une autre entreprise",
              sujets: [
                { lettre: null, intitule: "Partenariats conclus pour produire des services ou des produits pour une autre entreprise",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise",
              sujets: [
                { lettre: null, intitule: "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise",
                  informations: [] },
              ] },
          ] },
        { n: 9, plancher: false, themes: [],
          titre: "Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe",
          sections: [
            { lettre: "A", titre: "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du g",
              sujets: [
                { lettre: null, intitule: "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative, notamment transferts de capitaux importants entre la société mère et les filiales",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Cessions, fusions, et acquisitions réalisées.",
              sujets: [
                { lettre: null, intitule: "Cessions, fusions, et acquisitions réalisées.",
                  informations: [] },
              ] },
          ] },
        { n: 10, plancher: true, themes: ["conséquences environnementales de l'activité de l'entreprise"],
          titre: "Environnement (1) A-Politique générale en matière environnementale",
          sections: [
            { lettre: null, titre: "Environnement (1)",
              sujets: [
                { lettre: null, intitule: "Environnement (1)",
                  informations: [] },
              ] },
            { lettre: "A", titre: "Politique générale en matière environnementale",
              sujets: [
                { lettre: null, intitule: "Politique générale en matière environnementale : Organisation de l'entreprise pour prendre en compte les questions environnementales et, le cas échéant, les démarches d'évaluation ou de certification en matière d'environnement",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Economie circulaire",
              sujets: [
                { lettre: "a", intitule: "Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l' article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l' article R. 541-45 du même code",
                  informations: [] },
                { lettre: "b", intitule: "Utilisation durable des ressources : consommation d'eau et consommation d'énergie",
                  informations: [] },
              ] },
            { lettre: "C", titre: "Changement climatique",
              sujets: [
                { lettre: "a", intitule: "Identification des postes d'émissions directes de gaz à effet de serre produites par les sources fixes et mobiles nécessaires aux activités de l'entreprise (communément appelées \" émissions du scope 1 \") et, lorsque l'entreprise dispose de cette information, évaluation du volume de ces émissions de gaz à effet de serre",
                  informations: [] },
                { lettre: "b", intitule: "Bilan des émissions de gaz à effet de serre prévu par l' article L. 229-25 du code de l'environnement ou bilan simplifié prévu par l' article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces différents bilans. Notes : (1) Lorsque les données et informations environnementales transmises dans le cadre de cette rubrique ne sont pas éditées au niveau de l'entreprise (i. e. par exemple, au niveau du groupe ou des établissements distincts, le cas échéant), elles doivent être accompagnées d'informations supplémentaires pertinentes pour être mises en perspective à ce niveau.",
                  informations: [] },
              ] },
          ] },
      ] },
    "R. 2312-9": {
      article: "R. 2312-9", version: "LEGIARTI000049905524",
      seuil: "au moins trois cents salariés",
      rubriques: [
        { n: 1, plancher: true, themes: ["investissement social","investissement matériel et immatériel"],
          titre: "Investissements",
          sections: [
            { lettre: "A", titre: "Investissement social",
              sujets: [
                { lettre: "a", intitule: "Evolution des effectifs par type de contrat, par âge, par ancienneté",
                  informations: [] },
                { lettre: "i", intitule: "Effectif : Effectif total au 31/12 (1) (I)",
                  informations: [
                    "Effectif permanent (2) (I)",
                    "Nombre de salariés titulaires d'un contrat de travail à durée déterminée au 31/12 (I)",
                    "Effectif mensuel moyen de l'année considérée (3) (I)",
                    "Répartition par sexe de l'effectif total au 31/12 (I)",
                    "Répartition par âge de l'effectif total au 31/12 (4) (I)",
                    "Répartition de l'effectif total au 31/12 selon l'ancienneté (5) (I)",
                    "Répartition de l'effectif total au 31/12 selon la nationalité (I) : français/ étrangers",
                    "Répartition de l'effectif total au 31/12 selon une structure de qualification détaillée (II)"
                  ] },
                { lettre: "ii", intitule: "Travailleurs extérieurs : Nombre de salariés (6) appartenant à une entreprise extérieure (23)",
                  informations: [
                    "Nombre de stagiaires (écoles, universités …) (7)",
                    "Nombre moyen mensuel de salariés temporaires (8)",
                    "Durée moyenne des contrats de travail temporaire",
                    "Nombre de salariés de l'entreprise détachés",
                    "Nombre de salariés détachés accueillis"
                  ] },
                { lettre: "b", intitule: "Evolution des emplois, notamment, par catégorie professionnelle",
                  informations: [] },
                { lettre: "i", intitule: "Embauches : Nombre d'embauches par contrats de travail à durée indéterminée",
                  informations: [
                    "Nombre d'embauches par contrats de travail à durée déterminée (dont Nombre de contrats de travailleurs saisonniers) (I)",
                    "Nombre d'embauches de salariés de moins de vingt-cinq ans"
                  ] },
                { lettre: "ii", intitule: "Départs : Total des départs (I)",
                  informations: [
                    "Nombre de démissions (I)",
                    "Nombre de licenciements pour motif économique, dont départs en retraite et préretraite (I)",
                    "Nombre de licenciements pour d'autres causes (I)",
                    "Nombre de fins de contrats de travail à durée déterminée (I)",
                    "Nombre de départs au cours de la période d'essai (9) (I)",
                    "Nombre de mutations d'un établissement à un autre (I)",
                    "Nombre de départs volontaires en retraite et préretraite (10) (I)",
                    "Nombre de décès (I)"
                  ] },
                { lettre: "iii", intitule: "Promotions : Nombre de salariés promus dans l'année dans une catégorie supérieure (11)",
                  informations: [] },
                { lettre: "iv", intitule: "Chômage : Nombre de salariés mis en chômage partiel pendant l'année considérée (I)",
                  informations: [
                    "Nombre total d'heures de chômage partiel pendant l'année considérée (12) (I) : -indemnisées",
                    "non indemnisées",
                    "Nombre de salariés mis en chômage intempéries pendant l'année considérée (I)",
                    "Nombre total d'heures de chômage intempéries pendant l'année considérée (I) : -indemnisées",
                    "non indemnisées"
                  ] },
                { lettre: "c", intitule: "Evolution de l'emploi des personnes handicapées et mesures prises pour le développer",
                  informations: [
                    "Nombre de travailleurs handicapés employés sur l'année considérée (13)",
                    "Nombre de travailleurs handicapés à la suite d'accidents du travail intervenus dans l'entreprise, employés sur l'année considérée"
                  ] },
                { lettre: "d", intitule: "Evolution du nombre de stagiaires",
                  informations: [] },
                { lettre: "e", intitule: "Formation professionnelle : investissements en formation, publics concernés",
                  informations: [] },
                { lettre: "i", intitule: "Formation professionnelle continue (44) : Pourcentage de la masse salariale afférent à la formation continue",
                  informations: [
                    "Montant consacré à la formation continue : Formation interne",
                    "formation effectuée en application de conventions",
                    "versement aux organismes de recouvrement",
                    "versement auprès d'organismes agréés",
                    "autres",
                    "total",
                    "Nombre de stagiaires (II)",
                    "Nombre d'heures de stage (II) : -rémunérées",
                    "non rémunérées. Décomposition par type de stages à titre d'exemple : adaptation, formation professionnelle, entretien ou perfectionnement des connaissances"
                  ] },
                { lettre: "ii", intitule: "Congés formation : Nombre de salariés ayant bénéficié d'un congé formation rémunéré",
                  informations: [
                    "Nombre de salariés ayant bénéficié d'un congé formation non rémunéré",
                    "Nombre de salariés auxquels a été refusé un congé formation"
                  ] },
                { lettre: "iii", intitule: "Apprentissage : Nombre de contrats d'apprentissage conclus dans l'année",
                  informations: [] },
                { lettre: "f", intitule: "Conditions de travail : Durée du travail dont travail à temps partiel et aménagement du temps de travail, les données sur l'exposition aux risques et aux facteurs de pénibilité, (accidents du travail, maladies professionnelles, absentéisme, dépenses en matière de sécurité)",
                  informations: [] },
                { lettre: "i", intitule: "Accidents du travail et de trajet : Taux de fréquence des accidents du travail (I) Nombre d'accidents avec arrêts de travail divisé par nombre d'heures travaillées",
                  informations: [
                    "Nombre d'accidents de travail avec arrêt × 106 divisé par nombre d'heures travaillées",
                    "Taux de gravité des accidents du travail (I)",
                    "Nombre des journées perdues divisé par nombre d'heures travaillées",
                    "Nombre des journées perdues × 10 ³ divisé par nombre d'heures travaillées",
                    "Nombre d'incapacités permanentes (partielles et totales) notifiées à l'entreprise au cours de l'année considérée (distinguer français et étrangers)",
                    "Nombre d'accidents mortels : de travail, de trajet",
                    "Nombre d'accidents de trajet ayant entraîné un arrêt de travail",
                    "Nombre d'accidents dont sont victimes les salariés temporaires ou de prestations de services dans l'entreprise",
                    "Taux et montant de la cotisation sécurité sociale d'accidents de travail"
                  ] },
                { lettre: "ii", intitule: "Répartition des accidents par éléments matériels (28) : Nombre d'accidents liés à l'existence de risques graves-codes 32 à 40",
                  informations: [
                    "Nombre d'accidents liés à des chutes avec dénivellation-code 02",
                    "Nombre d'accidents occasionnés par des machines (à l'exception de ceux liés aux risques ci-dessus)-codes 09 à 30",
                    "Nombre d'accidents de circulation-manutention-stockage-codes 01,03,04 et 06,07,08",
                    "Nombre d'accidents occasionnés par des objets, masses, particules en mouvement accidentel-code 05",
                    "Autres cas"
                  ] },
                { lettre: "iii", intitule: "Maladies professionnelles : Nombre et dénomination des maladies professionnelles déclarées à la sécurité sociale au cours de l'année",
                  informations: [
                    "Nombre de salariés atteints par des affections pathologiques à caractère professionnel et caractérisation de celles-ci",
                    "Nombre de déclarations par l'employeur de procédés de travail susceptibles de provoquer des maladies professionnelles (29)"
                  ] },
                { lettre: "iv", intitule: "Dépenses en matière de sécurité : Effectif formé à la sécurité dans l'année",
                  informations: [
                    "Montant des dépenses de formation à la sécurité réalisées dans l'entreprise",
                    "Taux de réalisation du programme de sécurité présenté l'année précédente",
                    "Existence et nombre de plans spécifiques de sécurité"
                  ] },
                { lettre: "v", intitule: "Durée et aménagement du temps de travail : Horaire hebdomadaire moyen affiché des ouvriers et employés ou catégories assimilées (30) (I)",
                  informations: [
                    "Nombre de salariés ayant bénéficié d'un repos compensateur (I) : -au titre du présent code (31)",
                    "au titre d'un régime conventionne (I)",
                    "Nombre de salariés bénéficiant d'un système d'horaires individualisés (32) (I)",
                    "Nombre de salariés employés à temps partiel (I) : -entre 20 et 30 heures (33)",
                    "autres formes de temps partiel",
                    "Nombre de salariés ayant bénéficié tout au long de l'année considérée de deux jours de repos hebdomadaire consécutifs (I)",
                    "Nombre moyen de jours de congés annuels (non compris le repos compensateur) (34) (I)",
                    "Nombre de jours fériés payés (35) (I)"
                  ] },
                { lettre: "vi", intitule: "Absentéisme (14) : Nombre de journées d'absence (15) (I)",
                  informations: [
                    "Nombre de journées théoriques travaillées",
                    "Nombre de journées d'absence pour maladie (I)",
                    "Répartition des absences pour maladie selon leur durée (16) (I)",
                    "Nombre de journées d'absence pour accidents du travail et de trajet ou maladies professionnelles (I)",
                    "Nombre de journées d'absence pour maternité (I)",
                    "Nombre de journées d'absence pour congés autorisés (événements familiaux, congés spéciaux pour les femmes …) (I)",
                    "Nombre de journées d'absence imputables à d'autres causes (I)"
                  ] },
                { lettre: "vii", intitule: "Organisation et contenu du travail : Nombre de personnes occupant des emplois à horaires alternant ou de nuit",
                  informations: [
                    "Nombre de personnes occupant des emplois à horaires alternant ou de nuit de plus de cinquante ans",
                    "Salarié affecté à des tâches répétitives au sens de l'article D. 4163-2 (36) (distinguer femmes-hommes)"
                  ] },
                { lettre: "viii", intitule: "Conditions physiques de travail : Nombre de personnes exposées de façon habituelle et régulière à plus de 80 à 85 db à leur poste de travail (37)",
                  informations: [
                    "Nombre de salariés exposés au froid et à la chaleur au sens des articles R. 4223-13 à R. 4223-15",
                    "Nombre de salariés exposés aux températures extrêmes au sens de l'article D. 4163-2 (38)",
                    "Nombre de salariés travaillant aux intempéries de façon habituelle et régulière, de l'article L. 5424-8 (39)",
                    "Nombre de prélèvements, d'analyses de produits toxiques et mesures (40)",
                    "ix-Transformation de l'organisation du travail : Expériences de transformation de l'organisation du travail en vue d'en améliorer le contenu (41)",
                    "x-Dépenses d'amélioration de conditions de travail : Montant des dépenses consacrées à l'amélioration des conditions de travail dans l'entreprise (42)",
                    "Taux de réalisation du programme d'amélioration des conditions de travail dans l'entreprise l'année précédente",
                    "xi-Médecine du travail (43) : Nombre de visites d'information et de prévention et nombre d'examens médicaux (distinguer les travailleurs en suivi de droit commun et ceux en suivi individuel renforcé)",
                    "Nombre d'examens complémentaires (distinguer les travailleurs soumis à surveillance et les autres)",
                    "Part du temps consacré par le médecin du travail à l'analyse et à l'intervention en milieu de travail",
                    "xii-Travailleurs inaptes : Nombre de salariés déclarés définitivement inaptes à leur emploi par le médecin du travail",
                    "Nombre de salariés reclassés dans l'entreprise à la suite d'une inaptitude"
                  ] },
                { lettre: "f", intitule: "Conditions de travail : durée du travail dont travail à temps partiel et aménagement du temps de travail", renvoi: "R. 2312-8, 1° A f)",
                  informations: [
                    "Données sur le travail à temps partiel : -nombre, sexe et qualification des salariés travaillant à temps partiel",
                    "horaires de travail à temps partiel pratiqués dans l'entreprise",
                    "Le programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail prévu au 2° de l'article L. 2312-27 établi à partir des analyses mentionnées à l'article L. 2312-9 et fixant la liste détaillée des mesures devant être prises au cours de l'année à venir dans les mêmes domaines afin de satisfaire, notamment :"
                  ] },
              ] },
            { lettre: "B", titre: "Investissement matériel et immatériel",
              sujets: [
                { lettre: "a", intitule: "Evolution des actifs nets d'amortissement et de dépréciations éventuelles (immobilisations)",
                  informations: [] },
                { lettre: "b", intitule: "Le cas échéant, dépenses de recherche et développement",
                  informations: [] },
                { lettre: "c", intitule: "L'évolution de la productivité et le taux d'utilisation des capacités de production, lorsque ces éléments sont mesurables dans l'entreprise",
                  informations: [] },
              ] },
          ] },
        { n: 2, plancher: true, themes: ["égalité professionnelle entre les femmes et les hommes au sein de l'entreprise"],
          titre: "Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
          sections: [
            { lettre: "I", titre: "Indicateurs sur la situation comparée des femmes et des hommes dans l'entreprise",
              sujets: [
                { lettre: null, intitule: "Indicateurs sur la situation comparée des femmes et des hommes dans l'entreprise :",
                  informations: [] },
              ] },
            { lettre: "A", titre: "Conditions générales d'emploi",
              sujets: [
                { lettre: "a", intitule: "Effectifs : Données chiffrées par sexe : -Répartition par catégorie professionnelle selon les différents contrats de travail (CDI ou CDD)",
                  informations: [] },
                { lettre: "b", intitule: "Durée et organisation du travail : Données chiffrées par sexe : -Répartition des effectifs selon la durée du travail : temps complet, temps partiel (compris entre 20 et 30 heures et autres formes de temps partiel)",
                  informations: [
                    "Répartition des effectifs selon l'organisation du travail : travail posté, travail de nuit, horaires variables, travail atypique dont travail durant le week-end"
                  ] },
                { lettre: "c", intitule: "Données sur les congés : Données chiffrées par sexe : -Répartition par catégorie professionnelle",
                  informations: [
                    "Selon le nombre et le type de congés dont la durée est supérieure à six mois : compte épargne-temps, congé parental, congé sabbatique"
                  ] },
                { lettre: "d", intitule: "Données sur les embauches et les départs : Données chiffrées par sexe : -répartition des embauches par catégorie professionnelle et type de contrat de travail",
                  informations: [
                    "répartition des départs par catégorie professionnelle et motifs : retraite, démission, fin de contrat de travail à durée déterminée, licenciement"
                  ] },
                { lettre: "e", intitule: "Positionnement dans l'entreprise : Données chiffrées par sexe : -répartition des effectifs par catégorie professionnelle",
                  informations: [
                    "répartition des effectifs par niveau ou coefficient hiérarchique"
                  ] },
              ] },
            { lettre: "B", titre: "Rémunérations et déroulement de carrière",
              sujets: [
                { lettre: "a", intitule: "Promotion : Données chiffrées par sexe : -nombre et taux de promotions par catégorie professionnelle",
                  informations: [
                    "durée moyenne entre deux promotions"
                  ] },
                { lettre: "b", intitule: "Ancienneté : Données chiffrées par sexe : -ancienneté moyenne par catégorie professionnelle",
                  informations: [
                    "ancienneté moyenne dans la catégorie professionnelle",
                    "ancienneté moyenne par niveau ou coefficient hiérarchique",
                    "ancienneté moyenne dans le niveau ou le coefficient hiérarchique"
                  ] },
                { lettre: "c", intitule: "Age : Données chiffrées par sexe : -âge moyen par catégorie professionnelle",
                  informations: [
                    "âge moyen par niveau ou coefficient hiérarchique"
                  ] },
                { lettre: "d", intitule: "Rémunérations : Données chiffrées par sexe : -rémunération moyenne ou médiane mensuelle par catégorie professionnelle",
                  informations: [
                    "rémunération moyenne ou médiane mensuelle par niveau ou coefficient hiérarchique. Cet indicateur n'a pas à être renseigné lorsque sa mention est de nature à porter atteinte à la confidentialité des données correspondantes, compte tenu notamment du nombre réduit d'individus dans un niveau ou coefficient hiérarchique",
                    "rémunération moyenne ou médiane mensuelle par tranche d'âge",
                    "nombre de femmes dans les dix plus hautes rémunérations"
                  ] },
              ] },
            { lettre: "C", titre: "Formation",
              sujets: [
                { lettre: null, intitule: "Formation : Données chiffrées par sexe : Répartition par catégorie professionnelle selon : -le nombre moyen d'heures d'actions de formation par salarié et par an",
                  informations: [
                    "la répartition par type d'action : adaptation au poste, maintien dans l'emploi, développement des compétences"
                  ] },
              ] },
            { lettre: "D", titre: "Conditions de travail, santé et sécurité au travail",
              sujets: [
                { lettre: null, intitule: "Conditions de travail, santé et sécurité au travail : Données générales par sexe : -répartition par poste de travail selon : -l'exposition à des risques professionnels",
                  informations: [
                    "la pénibilité, dont le caractère répétitif des tâches",
                    "Données chiffrées par sexe : -accidents de travail, accidents de trajet et maladies professionnelles : -nombre d'accidents de travail ayant entraîné un arrêt de travail",
                    "nombre d'accidents de trajet ayant entraîné un arrêt de travail",
                    "répartition des accidents par éléments matériels (28) -nombre et dénomination des maladies professionnelles déclarées à la Sécurité sociale au cours de l'année",
                    "nombre de journée d'absence pour accidents de travail, accidents de trajet ou maladies professionnelles",
                    "maladies : -nombre d'arrêts de travail",
                    "nombre de journées d'absence",
                    "maladies ayant donné lieu à un examen de reprise du travail en application du 3° de l'article R. 4624-31 : -nombre d'arrêts de travail",
                    "nombre de journées d'absence"
                  ] },
              ] },
            { lettre: "II", titre: "Indicateurs relatifs à l'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale",
              sujets: [
                { lettre: null, intitule: "Indicateurs relatifs à l'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale :",
                  informations: [] },
              ] },
            { lettre: "A", titre: "Congés",
              sujets: [
                { lettre: "a", intitule: "Existence d'un complément de salaire versé par l'employeur pour le congé de paternité, le congé de maternité, le congé d'adoption",
                  informations: [] },
                { lettre: "b", intitule: "Données chiffrées par catégorie professionnelle : nombre de jours de congés de paternité pris par le salarié par rapport au nombre de jours de congés théoriques",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Organisation du temps de travail dans l'entreprise. a) Existence de formules d'organisatio",
              sujets: [
                { lettre: "a", intitule: "Existence de formules d'organisation du travail facilitant l'articulation de la vie familiale et de la vie professionnelle",
                  informations: [] },
                { lettre: "b", intitule: "Données chiffrées par sexe et par catégorie professionnelle : -nombre de salariés ayant accédé au temps partiel choisi",
                  informations: [
                    "nombre de salariés à temps partiel choisi ayant repris un travail à temps plein"
                  ] },
                { lettre: "c", intitule: "Services de proximité : -participation de l'entreprise et du comité social et économique aux modes d'accueil de la petite enfance",
                  informations: [
                    "évolution des dépenses éligibles au crédit d'impôt famille. Concernant la notion de catégorie professionnelle, il peut s'agir de fournir des données distinguant :"
                  ] },
                { lettre: "a", intitule: "Les ouvriers, les employés, techniciens, agents de maîtrise et les cadres",
                  informations: [] },
                { lettre: "b", intitule: "Ou les catégories d'emplois définies par la classification",
                  informations: [] },
                { lettre: "c", intitule: "Ou toute catégorie pertinente au sein de l'entreprise. Toutefois, l'indicateur relatif à la rémunération moyenne ou médiane mensuelle comprend au moins deux niveaux de comparaison dont celui mentionné au a ci-dessus.",
                  informations: [] },
              ] },
            { lettre: "III", titre: "Stratégie d'action",
              sujets: [
                { lettre: null, intitule: "Stratégie d'action : A partir de l'analyse des indicateurs mentionnés aux I et II, la stratégie d'action comprend les éléments suivants : -mesures prises au cours de l'année écoulée en vue d'assurer l'égalité professionnelle. Bilan des actions de l'année écoulée et, le cas échéant, de l'année précédente. Evaluation du niveau de réalisation des objectifs sur la base des indicateurs retenus. Explications sur les actions prévues non réalisées",
                  informations: [
                    "objectifs de progression pour l'année à venir et indicateurs associés. Définition qualitative et quantitative des mesures permettant de les atteindre conformément à l'article R. 2242-2 . Evaluation de leur coût. Echéancier des mesures prévues"
                  ] },
              ] },
          ] },
        { n: 3, plancher: true, themes: ["fonds propres","endettement"],
          titre: "Fonds propres, endettement et impôts",
          sections: [
            { lettre: null, titre: "a) Capitaux propres de l'entreprise",
              sujets: [
                { lettre: "a", intitule: "Capitaux propres de l'entreprise",
                  informations: [] },
                { lettre: "b", intitule: "Emprunts et dettes financières dont échéances et charges financières",
                  informations: [] },
                { lettre: "c", intitule: "Impôts et taxes, notamment, le cas échéant, les informations contenues dans le rapport relatif à l'impôt sur les bénéfices prévu par l'article L. 232-6 du code de commerce",
                  informations: [] },
              ] },
          ] },
        { n: 4, plancher: true, themes: ["ensemble des éléments de la rémunération des salariés et dirigeants"],
          titre: "Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments",
          sections: [
            { lettre: "A", titre: "Evolution des rémunérations salariales",
              sujets: [
                { lettre: "a", intitule: "Frais de personnel (24) y compris cotisations sociales, évolutions salariales par catégorie et par sexe, salaire de base minimum, salaire moyen ou médian, par sexe et par catégorie professionnelle",
                  informations: [] },
                { lettre: "i", intitule: "Montant des rémunérations (17) : Choix de deux indicateurs dans l'un des groupes suivants : -rapport entre la masse salariale annuelle (18) (II) et l'effectif mensuel moyen",
                  informations: [
                    "rémunération moyenne du mois de décembre (effectif permanent) hors primes à périodicité non mensuelle - base 35 heures (II)",
                    "OU -rémunération mensuelle moyenne (19) (II)",
                    "part des primes à périodicité non mensuelle dans la déclaration de salaire (II)",
                    "grille des rémunérations (20)"
                  ] },
                { lettre: "ii", intitule: "Hiérarchie des rémunérations : Choix d'un des deux indicateurs suivants : -rapport entre la moyenne des rémunérations des 10 % des salariés touchant les rémunérations les plus élevées et celle correspondant au 10 % des salariés touchant les rémunérations les moins élevées",
                  informations: [
                    "OU -rapport entre la moyenne des rémunérations des cadres ou assimilés (y compris cadres supérieurs et dirigeants) et la moyenne des rémunérations des ouvriers non qualifiés ou assimilés (21)",
                    "montant global des dix rémunérations les plus élevées."
                  ] },
                { lettre: "iii", intitule: "Mode de calcul des rémunérations : Pourcentage des salariés dont le salaire dépend, en tout ou partie, du rendement (22). Pourcentage des ouvriers et employés payés au mois sur la base de l'horaire affiché.",
                  informations: [] },
                { lettre: "iv", intitule: "Charge salariale globale",
                  informations: [] },
                { lettre: "b", intitule: "Pour les entreprises soumises aux dispositions de l'article L. 225-115 du code de commerce, montant global des rémunérations visées au 4° de cet article",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Epargne salariale",
              sujets: [
                { lettre: null, intitule: "Epargne salariale : intéressement, participation : Montant global de la réserve de participation (25)",
                  informations: [
                    "Montant moyen de la participation et/ ou de l'intéressement par salarié bénéficiaire (26) (I)",
                    "Part du capital détenu par les salariés (27) grâce à un système de participation (participation aux résultats, intéressement, actionnariat …)"
                  ] },
              ] },
            { lettre: "C", titre: "Rémunérations accessoires",
              sujets: [
                { lettre: null, intitule: "Rémunérations accessoires : primes par sexe et par catégorie professionnelle, avantages en nature, régimes de prévoyance et de retraite complémentaire",
                  informations: [
                    "Avantages sociaux dans l'entreprise : pour chaque avantage préciser le niveau de garantie pour les catégories retenues pour les effectifs (I)"
                  ] },
              ] },
            { lettre: "D", titre: "Rémunération des dirigeants mandataires sociaux telles que présentées dans le rapport de g",
              sujets: [
                { lettre: null, intitule: "Rémunération des dirigeants mandataires sociaux telles que présentées dans le rapport de gestion en application des trois premiers alinéas de l'article L. 225-102-1 du code de commerce, pour les entreprises soumises à l'obligation de présenter le rapport visé à l'article L. 225-102 du même code",
                  informations: [] },
              ] },
          ] },
        { n: 5, plancher: true, themes: ["activités sociales et culturelles"],
          titre: "Représentation du personnel et Activités sociales et culturelles",
          sections: [
            { lettre: null, titre: "montant de la contribution aux activités sociales et culturelles du comité social et économique, mécénat",
              sujets: [
                { lettre: null, intitule: "montant de la contribution aux activités sociales et culturelles du comité social et économique, mécénat :",
                  informations: [] },
              ] },
            { lettre: "A", titre: "Représentation du personnel",
              sujets: [
                { lettre: "a", intitule: "Représentants du personnel et délégués syndicaux : Composition des comités sociaux et économiques et/ ou d'établissement avec indication, s'il y a lieu, de l'appartenance syndicale",
                  informations: [
                    "Participation aux élections (par collège) par catégories de représentants du personnel",
                    "Volume global des crédits d'heures utilisés pendant l'année considérée",
                    "Nombre de réunions avec les représentants du personnel et les délégués syndicaux pendant l'année considérée",
                    "Dates et signatures et objet des accords conclus dans l'entreprise pendant l'année considérée",
                    "Nombre de personnes bénéficiaires d'un congé d'éducation ouvrière (45)"
                  ] },
                { lettre: "b", intitule: "Information et communication : Nombre d'heures consacrées aux différentes formes de réunion du personnel (46)",
                  informations: [
                    "Eléments caractéristiques du système d'accueil",
                    "Eléments caractéristiques du système d'information ascendante ou descendante et niveau d'application",
                    "Eléments caractéristiques du système d'entretiens individuels (47)"
                  ] },
                { lettre: "c", intitule: "Différends concernant l'application du droit du travail (48)",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Activités sociales et culturelles",
              sujets: [
                { lettre: "a", intitule: "Activités sociales : Contributions au financement, le cas échéant, du comité social et économique et des comités sociaux économiques d'établissement",
                  informations: [
                    "Autres dépenses directement supportées par l'entreprise : logement, transport, restauration, loisirs, vacances, divers, total (49)"
                  ] },
                { lettre: "b", intitule: "Autres charges sociales : Coût pour l'entreprise des prestations complémentaires (maladie, décès) (50)",
                  informations: [
                    "Coût pour l'entreprise des prestations complémentaires (vieillesse) (51)",
                    "Equipements réalisés par l'entreprise et touchant aux conditions de vie des salariés à l'occasion de l'exécution du travail"
                  ] },
              ] },
          ] },
        { n: 6, plancher: true, themes: ["rémunération des financeurs"],
          titre: "Rémunération des financeurs, en dehors des éléments mentionnés au 4°",
          sections: [
            { lettre: "A", titre: "Rémunération des actionnaires (revenus distribués)",
              sujets: [
                { lettre: null, intitule: "Rémunération des actionnaires (revenus distribués)",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)",
              sujets: [
                { lettre: null, intitule: "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)",
                  informations: [] },
              ] },
          ] },
        { n: 7, plancher: true, themes: ["flux financiers à destination de l'entreprise"],
          titre: "Flux financiers à destination de l'entreprise",
          sections: [
            { lettre: "A", titre: "Aides publiques",
              sujets: [
                { lettre: null, intitule: "Aides publiques : Les aides ou avantages financiers consentis à l'entreprise par l'Union européenne, l'Etat, une collectivité territoriale, un de leurs établissements publics ou un organisme privé chargé d'une mission de service public, et leur utilisation",
                  informations: [
                    "Pour chacune de ces aides, l'employeur indique la nature de l'aide, son objet, son montant, les conditions de versement et d'emploi fixées, le cas échéant, par la personne publique qui l'attribue et son utilisation"
                  ] },
              ] },
            { lettre: "B", titre: "Réductions d'impôts",
              sujets: [
                { lettre: null, intitule: "Réductions d'impôts",
                  informations: [] },
              ] },
            { lettre: "C", titre: "Exonérations et réductions de cotisations sociales",
              sujets: [
                { lettre: null, intitule: "Exonérations et réductions de cotisations sociales",
                  informations: [] },
              ] },
            { lettre: "D", titre: "Crédits d'impôts",
              sujets: [
                { lettre: null, intitule: "Crédits d'impôts",
                  informations: [] },
              ] },
            { lettre: "E", titre: "Mécénat",
              sujets: [
                { lettre: null, intitule: "Mécénat",
                  informations: [] },
              ] },
            { lettre: "F", titre: "Résultats financiers a) Le chiffre d'affaires",
              sujets: [
                { lettre: "a", intitule: "Le chiffre d'affaires",
                  informations: [] },
                { lettre: "b", intitule: "Les bénéfices ou pertes constatés",
                  informations: [] },
                { lettre: "c", intitule: "Les résultats globaux de la production en valeur et en volume",
                  informations: [] },
                { lettre: "d", intitule: "L'affectation des bénéfices réalisés",
                  informations: [] },
              ] },
          ] },
        { n: 8, plancher: false, themes: [],
          titre: "Partenariats",
          sections: [
            { lettre: "A", titre: "Partenariats conclus pour produire des services ou des produits pour une autre entreprise",
              sujets: [
                { lettre: null, intitule: "Partenariats conclus pour produire des services ou des produits pour une autre entreprise",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise",
              sujets: [
                { lettre: null, intitule: "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise",
                  informations: [] },
              ] },
          ] },
        { n: 9, plancher: false, themes: [],
          titre: "Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe",
          sections: [
            { lettre: "A", titre: "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative",
              sujets: [
                { lettre: null, intitule: "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Cessions, fusions, et acquisitions réalisées.",
              sujets: [
                { lettre: null, intitule: "Cessions, fusions, et acquisitions réalisées.",
                  informations: [] },
              ] },
          ] },
        { n: 10, plancher: true, themes: ["conséquences environnementales de l'activité de l'entreprise"],
          titre: "Environnement (52)",
          sections: [
            { lettre: "I", titre: "Pour les entreprises soumises à la déclaration prévue à l'article R. 225-105 du code de commerce",
              sujets: [
                { lettre: null, intitule: "Pour les entreprises soumises à la déclaration prévue à l'article R. 225-105 du code de commerce :",
                  informations: [] },
              ] },
            { lettre: "A", titre: "Politique générale en matière environnementale",
              sujets: [
                { lettre: null, intitule: "Politique générale en matière environnementale : Informations environnementales présentées en application du 2° du A du II de l'article R. 225-105 du code de commerce",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Economie circulaire",
              sujets: [
                { lettre: null, intitule: "Economie circulaire : Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l'article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l'article R. 541-45 du même code",
                  informations: [] },
              ] },
            { lettre: "C", titre: "Changement climatique",
              sujets: [
                { lettre: null, intitule: "Changement climatique : Bilan des émissions de gaz à effet de serre prévu par l'article L. 229-25 du code de l'environnement ou bilan simplifié prévu par l'article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces différents bilans",
                  informations: [] },
              ] },
            { lettre: "II", titre: "Pour les entreprises non soumises à la déclaration prévue à l'article R. 225-105 du code de commerce",
              sujets: [
                { lettre: null, intitule: "Pour les entreprises non soumises à la déclaration prévue à l'article R. 225-105 du code de commerce :",
                  informations: [] },
              ] },
            { lettre: "A", titre: "Politique générale en matière environnementale",
              sujets: [
                { lettre: null, intitule: "Politique générale en matière environnementale : Organisation de l'entreprise pour prendre en compte les questions environnementales et, le cas échéant, les démarches d'évaluation ou de certification en matière d'environnement",
                  informations: [] },
              ] },
            { lettre: "B", titre: "Economie circulaire",
              sujets: [
                { lettre: "i", intitule: "Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l'article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l'article R. 541-45 du même code",
                  informations: [] },
                { lettre: "ii", intitule: "Utilisation durable des ressources : consommation d'eau et consommation d'énergie",
                  informations: [] },
              ] },
            { lettre: "C", titre: "Changement climatique",
              sujets: [
                { lettre: "i", intitule: "Identification des postes d'émissions directes de gaz à effet de serre produites par les sources fixes et mobiles nécessaires aux activités de l'entreprise (communément appelées \" émissions du scope 1 \") et, lorsque l'entreprise dispose de cette information, évaluation du volume de ces émissions de gaz à effet de serre",
                  informations: [] },
                { lettre: "ii", intitule: "Bilan des émissions de gaz à effet de serre prévu par l'article L. 229-25 du code de l'environnement ou le bilan simplifié prévu par l'article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces bilans. Notes : I.-Une structure de qualification détaillée, en trois ou quatre postes minimum, est requise. Il est souhaitable de faire référence à la classification de la convention collective, de l'accord d'entreprise et aux pratiques habituellement retenues dans l'entreprise. A titre d'exemple la répartition suivante peut être retenue : cadres",
                  informations: [
                    "employés, techniciens et agents de maîtrise (ETAM)",
                    "et ouvriers. II.-Une structure de qualification détaillée en cinq ou six postes minimum est requise. Il est souhaitable de faire référence à la classification de la convention collective, de l'accord d'entreprise et aux pratiques habituellement retenues dans l'entreprise. A titre d'exemple, la répartition suivante des postes peut être retenue : cadres",
                    "techniciens",
                    "agents de maîtrise",
                    "employés qualifiés",
                    "employés non qualifiés",
                    "ouvriers qualifiés",
                    "ouvriers non qualifiés. Doivent en outre être distinguées les catégories femmes et hommes. (1) Effectif total : tout salarié inscrit à l'effectif au 31/12 quelle que soit la nature de son contrat de travail. (2) Effectif permanent : les salariés à temps plein, inscrits à l'effectif pendant toute l'année considérée et titulaires d'un contrat de travail à durée indéterminée. (3) Somme des effectifs totaux mensuels divisée par 12 (on entend par effectif total tout salarié inscrit à l'effectif au dernier jour du mois considéré). (4) La répartition retenue est celle habituellement utilisée dans l'entreprise à condition de distinguer au moins quatre catégories, dont les jeunes de moins de vingt-cinq ans. (5) La répartition selon l'ancienneté est celle habituellement retenue dans l'entreprise. (6) Il s'agit des catégories de travailleurs extérieurs dont l'entreprise connaît le nombre, soit parce qu'il figure dans le contrat signé avec l'entreprise extérieure, soit parce que ces travailleurs sont inscrits aux effectifs. Exemple : démonstrateurs dans le commerce … (7) Stages supérieurs à une semaine. (8) Est considérée comme salarié temporaire toute personne mise à la disposition de l'entreprise, par une entreprise de travail temporaire. (9) A ne remplir que si ces départs sont comptabilisés dans le total des départs. (10) Distinguer les différents systèmes légaux et conventionnels de toute nature. (11) Utiliser les catégories de la nomenclature détaillée II. (12) Y compris les heures indemnisées au titre du chômage total en cas d'arrêt de plus de quatre semaines consécutives. (13) Tel qu'il résulte de la déclaration obligatoire prévue à l'article L. 5212-5. (14) Possibilités de comptabiliser tous les indicateurs de la rubrique absentéisme, au choix, en journées, 1/2 journées ou heures. (15) Ne sont pas comptés parmi les absences : les diverses sortes de congés, les conflits et le service national. (16) Les tranches choisies sont laissées au choix des entreprises. (17) On entend par rémunération la somme des salaires effectivement perçus pendant l'année par le salarié (au sens de la déclaration sociale nominative). (18) Masse salariale annuelle totale, au sens de la déclaration annuelle de salaire. (19) Rémunération mensuelle moyenne : 1/2 ∑ (masse salariale du mois"
                  ] },
                { lettre: "i", intitule: "(effectif du mois",
                  informations: [] },
                { lettre: "i", intitule: ". (20) Faire une grille des rémunérations en distinguant au moins six tranches. (21) Pour être prises en compte, les catégories concernées doivent comporter au minimum dix salariés. (22) Distinguer les primes individuelles et les primes collectives. (23) Prestataires de services. (24) Frais de personnel : ensemble des rémunérations et des cotisations sociales mises légalement ou conventionnellement à la charge de l'entreprise. (25) Le montant global de la réserve de participation est le montant de la réserve dégagée-ou de la provision constituée-au titre de la participation sur les résultats de l'exercice considéré. (26) La participation est envisagée ici au sens du titre II du livre III de la partie III. (27) Non compris les dirigeants. (28) Faire référence aux codes de classification des éléments matériels des accidents (arrêté du 10 octobre 1974). (29) En application de l'article L. 461-4 du code de la sécurité sociale. (30) Il est possible de remplacer cet indicateur par la somme des heures travaillées durant l'année. (31) Au sens des dispositions du présent code et du code rural et de la pêche maritime instituant un repos compensateur en matière d'heures supplémentaires. (32) Au sens de l'article L. 3121-48. (33) Au sens de l'article L. 3123-1. (34) Cet indicateur peut être calculé sur la dernière période de référence. (35) Préciser, le cas échéant, les conditions restrictives. (36) Seuils associés aux facteurs de risques professionnels pour le travail répétitif : Travail répétitif caractérisé par la réalisation de travaux impliquant l'exécution de mouvements répétés, sollicitant tout ou partie du membre supérieur, à une fréquence élevée et sous cadence contrainte : -Temps de cycle inférieur ou égal à 30 secondes : 15 actions techniques ou plus pour minimum 900 heures par an -Temps de cycle supérieur à 30 secondes, temps de cycle variable ou absence de temps de cycle : 30 actions techniques ou plus par minute pour minimum 900 heures par an.. (37) Les valeurs limites d'exposition et les valeurs d'exposition déclenchant une action de prévention qui sont fixées dans le tableau prévu à l'article R. 4431-2. (38) Température inférieure ou égale à 5 degrés Celsius ou au moins égale à 30 degrés Celsius pour minimum 900 heures par an. (39) Sont considérées comme intempéries, les conditions atmosphériques et les inondations lorsqu'elles rendent dangereux ou impossible l'accomplissement du travail eu égard soit à la santé ou à la sécurité des salariés, soit à la nature ou à la technique du travail à accomplir. (40) Renseignements tirés du rapport du directeur du service de prévention et de santé au travail interentreprises (41) Pour l'explication de ces expériences d'amélioration du contenu du travail, donner le nombre de salariés concernés. (42) Non compris l'évaluation des dépenses en matière de santé et de sécurité. (43) Renseignements tirés du rapport du directeur du service de prévention et de santé au travail interentreprises. (44) Conformément aux données relatives aux contributions de formation professionnelle de la déclaration sociale nominative. (45) Au sens des articles L. 2145-5 et suivants. (46) On entend par réunion du personnel, les réunions régulières de concertation, concernant les relations et conditions de travail organisées par l'entreprise. (47) Préciser leur périodicité. (48) Avec indication de la nature du différend et, le cas échéant, de la solution qui y a mis fin. (49) Dépenses consolidées de l'entreprise. La répartition est indiquée ici à titre d'exemple. (50) (51) Versements directs ou par l'intermédiaire d'assurances. (52) Lorsque les données et informations environnementales transmises dans le cadre de cette rubrique ne sont pas éditées au niveau de l'entreprise (i. e. par exemple, au niveau du groupe ou des établissements distincts, le cas échéant), elles doivent être accompagnées d'informations supplémentaires pertinentes pour être mises en perspective à ce niveau.",
                  informations: [] },
              ] },
          ] },
      ] },
  };
  /* Le plancher de l'article L. 2312-21, alinéa 3, relevé dans le texte capté
     par contenu-bdese.js, dix thèmes, dans l'ordre de la phrase. Ce sont LES
     DIX THÈMES DU PLANCHER DE L'ACCORD, à ne pas confondre avec les dix thèmes
     de l'article L. 2312-36 : le plancher scinde les investissements et les
     fonds propres/endettement, et il laisse tomber la sous-traitance, que le
     décret nomme « partenariats », et les transferts intragroupe. */
  var PLANCHER = [
    "l'investissement social",
    "l'investissement matériel et immatériel",
    "l'égalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
    "les fonds propres",
    "l'endettement",
    "l'ensemble des éléments de la rémunération des salariés et dirigeants",
    "les activités sociales et culturelles",
    "la rémunération des financeurs",
    "les flux financiers à destination de l'entreprise",
    "les conséquences environnementales de l'activité de l'entreprise",
  ];

  /* La correspondance entre le thème de la loi et l'intitulé du décret, telle
     que plancher-bdese.js la déclare et la vérifie au chargement du module. */
  var CORRESPONDANCE = [
    ["l'investissement social", "1° Investissements, section A « Investissement social »"],
    ["l'investissement matériel et immatériel", "1° Investissements, section B « Investissement matériel et immatériel »"],
    ["l'égalité professionnelle entre les femmes et les hommes au sein de l'entreprise", "2° « Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise »"],
    ["les fonds propres", "3° « Fonds propres, endettement et impôts »"],
    ["l'endettement", "3° « Fonds propres, endettement et impôts »"],
    ["l'ensemble des éléments de la rémunération des salariés et dirigeants", "4° « Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments »"],
    ["les activités sociales et culturelles", "5° « Activités sociales et culturelles » (R. 2312-9 : « Représentation du personnel et Activités sociales et culturelles »)"],
    ["la rémunération des financeurs", "6° « Rémunération des financeurs, en dehors des éléments mentionnés au 4° »"],
    ["les flux financiers à destination de l'entreprise", "7° « Flux financiers à destination de l'entreprise »"],
    ["les conséquences environnementales de l'activité de l'entreprise", "10° « Environnement »"],
  ];

  /* ══════════════════════════════════════════════════════════════════════
     OÙ LA DONNÉE SE TROUVE DANS L'ENTREPRISE

     Une aide à la recherche, rubrique par rubrique, jamais une affirmation sur
     l'entreprise. Le document dit où aller chercher ; il n'écrit ni le chiffre
     ni le fait, qui sortent entre crochets.
     ══════════════════════════════════════════════════════════════════════ */
  var SOURCES = {
    1: "registre unique du personnel · déclaration sociale nominative (DSN) · " +
       "contrats et avenants · bilan pédagogique et financier des actions de " +
       "formation · immobilisations et amortissements de l'annexe comptable · " +
       "document unique d'évaluation des risques pour les conditions de travail",
    2: "DSN et journal de paie ventilés par sexe et par catégorie " +
       "professionnelle · système d'information des ressources humaines " +
       "(embauches, promotions, formation) · déclarations relatives aux " +
       "indicateurs d'écarts de rémunération",
    3: "comptes annuels, bilan, compte de résultat, annexe · liasse fiscale · " +
       "tableau des emprunts et des échéances · avis d'imposition et crédits d'impôt",
    4: "DSN · journal et livre de paie · procès-verbaux d'assemblée et rapports " +
       "sur les rémunérations des mandataires sociaux · contrats de travail des " +
       "dirigeants salariés",
    5: "comptabilité du comité social et économique et comptes de l'entreprise " +
       "(versements des contributions) · registre des délégués et des élus · " +
       "budget de fonctionnement et budget des activités sociales et culturelles",
    6: "comptes annuels et annexe · procès-verbaux d'assemblée générale " +
       "(affectation du résultat, distribution) · tableau des rémunérations des " +
       "actionnaires et des capitaux empruntés",
    7: "liasse fiscale · notifications d'attribution d'aides publiques · états " +
       "de crédits d'impôt · conventions de subvention · comptabilité des " +
       "réductions de cotisations",
    8: "comptabilité fournisseurs et clients · contrats de sous-traitance et " +
       "conventions de partenariat · balance âgée",
    9: "comptabilité analytique et comptes de groupe · conventions " +
       "intragroupe · documentation des prix de transfert · rapports de gestion",
    10: "bilan des émissions de gaz à effet de serre lorsqu'il est établi · " +
        "registre et bordereaux de suivi des déchets · factures et relevés de " +
        "consommation d'énergie, d'eau et de matières · rapports " +
        "environnementaux et déclarations réglementaires de site",
  };

  /* ══════════════════════════════════════════════════════════════════════
     LES OUTILS
     ══════════════════════════════════════════════════════════════════════ */

  function P(ctx) { return (ctx && ctx.profil) || {}; }
  function F(ctx) { return (ctx && ctx.fiche) || {}; }
  function B(ctx) { return F(ctx).base || {}; }

  function nomDe(ctx) {
    var p = P(ctx), f = F(ctx);
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }
  function villeDe(ctx) { return cro(P(ctx).ville, "lieu"); }
  function adresseDe(ctx) { return cro(P(ctx).adresse, "adresse du siège"); }
  function signataire(ctx) { return cro(P(ctx).responsable, "Nom et qualité du signataire"); }

  function aujourd(ctx) {
    return ctx && ctx.aujourdhui instanceof Date && !isNaN(ctx.aujourdhui)
      ? ctx.aujourdhui : new Date();
  }

  /* L'effectif, quel que soit la façon dont il a été saisi : le formulaire rend
     des chaînes, le profil un nombre. Un effectif illisible n'est pas un
     effectif : il vaut « inconnu », et le document produit alors les deux
     régimes plutôt que d'en deviner un. */
  function effectifDe(ctx) {
    var v = P(ctx).effectif;
    if (v === undefined || v === null || v === "") v = F(ctx).effectif;
    if (typeof v === "number") return isFinite(v) ? v : null;
    var s = String(v == null ? "" : v).replace(/[^0-9]/g, "");
    return s === "" ? null : parseInt(s, 10);
  }

  /* Le régime supplétif applicable, ou les deux quand l'effectif est inconnu.
     Ce n'est PAS le régime au sens de regime-bdese.js : un accord de
     L. 2312-21 prime, et chaque document le dit avant de déployer la grille. */
  function regimeDe(ctx) {
    var n = effectifDe(ctx);
    if (n === null) return { connu: false, effectif: null, articles: ["R. 2312-8", "R. 2312-9"] };
    return { connu: true, effectif: n,
      article: n >= 300 ? "R. 2312-9" : "R. 2312-8",
      articles: [n >= 300 ? "R. 2312-9" : "R. 2312-8"],
      seuil: n >= 300 ? "au moins trois cents salariés" : "moins de trois cents salariés" };
  }

  /* Les six années de l'article R. 2312-10, comptées depuis l'année du jour. */
  function anneesDe(ctx) {
    var n = aujourd(ctx).getFullYear();
    return { courante: n, passees: [n - 2, n - 1], suivantes: [n + 1, n + 2, n + 3],
      toutes: [n - 2, n - 1, n, n + 1, n + 2, n + 3] };
  }
  function enteteAnnees(a) {
    return "N-2 (" + a.passees[0] + ") · N-1 (" + a.passees[1] + ") · N (" + a.courante +
      ") · N+1 (" + a.suivantes[0] + ") · N+2 (" + a.suivantes[1] + ") · N+3 (" + a.suivantes[2] + ")";
  }

  /* Ce que le dossier déclare, dit sans être interprété. */
  function etat(v, oui, non) {
    if (v === true || v === "oui") return oui;
    if (v === false || v === "non") return non;
    return "non renseigné, à vérifier sur la base elle-même";
  }
  function estOui(v) { return v === true || v === "oui"; }
  function estNon(v) { return v === false || v === "non"; }
  function vide(v) {
    return v === undefined || v === null || v === "" ||
      (Array.isArray(v) && !v.length) || (typeof v === "string" && !v.trim());
  }
  /* Une liste du dossier, quelle que soit sa forme, tableau, chaîne à retours
     à la ligne, valeur unique. */
  function liste(v) {
    if (Array.isArray(v)) return v.map(function (x) { return String(x); }).filter(Boolean);
    if (vide(v)) return [];
    return String(v).split(/\n|;/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  /* Un texte long, coupé pour tenir dans la largeur du document. Les libellés du
     décret font parfois trois cents caractères : les laisser sur une seule ligne
     rendrait la grille illisible dans un traitement de texte. */
  function plier(t, largeur, retrait) {
    var mots = String(t == null ? "" : t).split(/\s+/).filter(Boolean);
    var out = [], ligne = "";
    for (var i = 0; i < mots.length; i++) {
      if (ligne === "") { ligne = mots[i]; continue; }
      if ((ligne + " " + mots[i]).length > largeur) { out.push(ligne); ligne = mots[i]; }
      else ligne += " " + mots[i];
    }
    if (ligne !== "") out.push(ligne);
    if (!out.length) out.push("");
    return out.map(function (l, i) { return (i === 0 ? "" : retrait || "") + l; });
  }
  function pousserPlie(L, t, largeur, prefixe, retrait) {
    var lignes = plier(t, largeur, "");
    L.push((prefixe || "") + lignes[0]);
    for (var i = 1; i < lignes.length; i++) L.push((retrait || "") + lignes[i]);
  }

  /* Une date du dossier, écrite en toutes lettres, ou son crochet. */
  function estISO(v) {
    return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
      !isNaN(new Date(v + "T12:00:00Z").getTime());
  }
  function dateDe(iso) {
    if (!estISO(iso)) return null;
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function jour(iso, quoi) {
    var d = dateDe(iso);
    return d ? leJour(d) : "[" + (quoi || "date") + "]";
  }
  /* Le même quantième, n mois plus tard, la manière dont regime-bdese.js
     compte les douze mois de L. 2312-2, l'an de L. 2312-34 et le mois de
     R. 2312-6. */
  function moisApres(iso, n) {
    if (!estISO(iso)) return null;
    var p = iso.split("-").map(Number);
    var t = p[0] * 12 + (p[1] - 1) + n;
    var an = Math.floor(t / 12), mo = t - an * 12 + 1;
    var dernier = new Date(an, mo, 0).getDate();
    var d = new Date(an, mo - 1, Math.min(p[2], dernier));
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (j < 10 ? "0" + j : j);
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES BLOCS COMMUNS
     ══════════════════════════════════════════════════════════════════════ */

  /* Le mode d'emploi, en tête de chaque document. */
  function modeDEmploi(L, quoi) {
    L.push("COMMENT SE SERVIR DE CE DOCUMENT");
    L.push("");
    L.push("Ce que vous lisez est " + quoi + ", rédigé au nom de votre entreprise.");
    L.push("Ce qui est entre crochets vous appartient : ce sont vos chiffres, vos");
    L.push("dates, vos choix. L'application ne les connaît pas et ne les inventera");
    L.push("pas, un document qui devinerait la masse salariale ou les effectifs par");
    L.push("catégorie serait pire qu'absent. Remplacez chaque crochet, ou supprimez");
    L.push("la ligne si elle ne vous concerne pas.");
    L.push("");
    L.push("Chaque partie porte l'article qui la commande. Gardez ces mentions : ce");
    L.push("sont elles qui vous permettront de montrer, devant le comité comme");
    L.push("devant le juge, d'où vient ce que vous avez écrit.");
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  /* Quel texte commande le contenu de la base, l'ordre des trois étages, écrit
     avant toute grille. Aucun document de ce fichier ne déploie une grille sans
     avoir posé cette question : monter la grille du décret dans une entreprise
     couverte par un accord, c'est réclamer ce qui n'est pas dû. */
  function blocRegime(ctx, r) {
    var f = F(ctx);
    var L = ["════ QUEL TEXTE COMMANDE VOTRE BASE ════", ""];
    L.push("L'ordre ne se contourne pas, et il commande tout le reste :");
    L.push("");
    L.push("  1. UN ACCORD D'ENTREPRISE : « un accord d'entreprise conclu dans les");
    L.push("     conditions prévues au premier alinéa de l'article L. 2232-12 ou, en");
    L.push("     l'absence de délégué syndical, un accord entre l'employeur et le");
    L.push("     comité social et économique, adopté à la majorité des membres");
    L.push("     titulaires de la délégation du personnel du comité, définit :");
    L.push("     1° L'organisation, l'architecture et le contenu de la base […] ;");
    L.push("     2° Les modalités de fonctionnement […] » (L. 2312-21). S'il en");
    L.push("     existe un, c'est SA grille qui est due, non celle du décret.");
    L.push("");
    L.push("  2. À DÉFAUT, UN ACCORD DE BRANCHE, et seulement en dessous de trois");
    L.push("     cents salariés : « À défaut d'accord prévu à l'alinéa premier, un");
    L.push("     accord de branche peut définir l'organisation, l'architecture, le");
    L.push("     contenu et les modalités de fonctionnement de la base […] dans les");
    L.push("     entreprises de moins de trois cents salariés » (L. 2312-21,");
    L.push("     dernier alinéa).");
    L.push("");
    L.push("  3. À DÉFAUT DES DEUX, LE DÉCRET : R. 2312-8 en dessous de trois cents");
    L.push("     salariés, R. 2312-9 à partir de trois cents.");
    L.push("");
    L.push("Dans tous les cas, le PLANCHER de l'alinéa 3 de L. 2312-21 reste dû :");
    L.push("« la base de données comporte au moins les thèmes suivants ». Un accord");
    L.push("qui retire l'un de ces thèmes est, sur ce point, sans effet.");
    L.push("");
    L.push("CE QUE VOTRE DOSSIER DÉCLARE");
    L.push("");
    L.push("  · accord d'entreprise définissant la base : " +
      etat(f.accordEntreprise, "OUI" + (estOui(f.accordEntrepriseVerse) ? ", et il est versé" :
        ", mais il n'est PAS versé : sans son texte, la grille due ne peut pas être établie"), "non"));
    L.push("  · accord de branche définissant la base : " +
      etat(f.accordBranche, "OUI" + (estOui(f.accordBrancheVerse) ? ", et il est versé" :
        ", mais il n'est PAS versé"), "non"));
    L.push("  · effectif : " + (r.connu ? r.effectif + " salariés" : "[EFFECTIF : non renseigné]"));
    L.push("");
    if (estOui(f.accordEntreprise) || estOui(f.accordBranche)) {
      L.push("UN ACCORD EST DÉCLARÉ. La grille déployée plus bas est celle du décret :");
      L.push("elle ne vaut alors que comme point de comparaison, et comme rappel du");
      L.push("plancher que votre accord ne pouvait pas descendre. C'est le texte de");
      L.push("votre accord qui fixe ce qui est dû, reportez-vous-y, rubrique par");
      L.push("rubrique, avant de considérer une case comme manquante.");
    } else {
      L.push("Aucun accord n'est déclaré : c'est le décret qui fixe le contenu, et la");
      L.push("grille déployée plus bas est celle qui est due.");
    }
    L.push("");
    if (!r.connu) {
      L.push("VOTRE EFFECTIF N'EST PAS RENSEIGNÉ. Le contenu dû n'est pas le même de");
      L.push("part et d'autre de trois cents salariés. Plutôt que d'en deviner un, ce");
      L.push("document déploie LES DEUX GRILLES : gardez celle qui vous concerne et");
      L.push("supprimez l'autre. Portez votre effectif dans votre profil : la");
      L.push("prochaine production ne retiendra que la bonne.");
      L.push("");
    } else {
      L.push("Votre effectif étant de " + r.effectif + " salariés, l'article applicable à");
      L.push("défaut d'accord est l'article " + r.article + ", " + r.seuil + ".");
      L.push("");
    }
    return L;
  }

  /* Les six années de R. 2312-10, et ce que le décret admet pour les trois
     dernières. Revient dans tous les documents de contenu. */
  function blocAnnees(ctx) {
    var a = anneesDe(ctx);
    var L = ["════ SUR QUELLES ANNÉES CHAQUE CASE SE REMPLIT ════", ""];
    L.push("« En l'absence d'accord prévu à l'article L. 2312-21, les informations");
    L.push("figurant dans la base de données portent sur l'année en cours, sur les");
    L.push("deux années précédentes et, telles qu'elles peuvent être envisagées, sur");
    L.push("les trois années suivantes. Ces informations sont présentées sous forme");
    L.push("de données chiffrées ou, à défaut, pour les années suivantes, sous forme");
    L.push("de grandes tendances. L'employeur indique, pour ces années, les");
    L.push("informations qui, eu égard à leur nature ou aux circonstances, ne peuvent");
    L.push("pas faire l'objet de données chiffrées ou de grandes tendances, pour les");
    L.push("raisons qu'il précise » (R. 2312-10).");
    L.push("");
    L.push("Vos six colonnes, comptées depuis aujourd'hui :");
    L.push("");
    L.push("  " + enteteAnnees(a));
    L.push("");
    L.push("  · " + a.passees[0] + " et " + a.passees[1] + ", les deux années précédentes. Elles ne se");
    L.push("    recalculent pas : reprenez-les dans les documents déjà produits.");
    L.push("  · " + a.courante + ", l'année en cours.");
    L.push("  · " + a.suivantes.join(", ") + ", les trois années suivantes, en données chiffrées");
    L.push("    ou, à défaut, en GRANDES TENDANCES. Les grandes tendances suffisent :");
    L.push("    c'est le texte, et exiger le chiffre partout retarderait la base sans");
    L.push("    l'améliorer.");
    L.push("");
    L.push("Et l'obligation que l'on oublie : pour ces trois années, écrivez dans la");
    L.push("base elle-même les informations qui ne peuvent recevoir NI chiffres NI");
    L.push("tendances, avec la raison de chacune. Une case vide sans cette");
    L.push("explication ne se distingue pas d'une information manquante.");
    L.push("");
    return L;
  }

  /* Le plancher, thème par thème, avec l'intitulé du décret qui le porte. */
  function blocPlancher(ctx) {
    var t = liste((B(ctx).themes || []).map(function (x) { return x && x.theme ? x.theme : x; }));
    var L = ["════ LE PLANCHER DE L'ARTICLE L. 2312-21, ALINÉA 3 ════", ""];
    L.push("« La base de données comporte au moins les thèmes suivants : " +
      "l'investissement");
    L.push("social, l'investissement matériel et immatériel, l'égalité professionnelle");
    L.push("entre les femmes et les hommes au sein de l'entreprise, les fonds propres,");
    L.push("l'endettement, l'ensemble des éléments de la rémunération des salariés et");
    L.push("dirigeants, les activités sociales et culturelles, la rémunération des");
    L.push("financeurs, les flux financiers à destination de l'entreprise et les");
    L.push("conséquences environnementales de l'activité de l'entreprise » (L. 2312-21,");
    L.push("alinéa 3).");
    L.push("");
    L.push("Ces dix thèmes s'imposent à TOUT accord. La loi et le décret ne les nomment");
    L.push("pas de la même façon : la correspondance ci-dessous est celle que le module");
    L.push("déclare et vérifie sur le découpage du décret.");
    L.push("");
    for (var i = 0; i < CORRESPONDANCE.length; i++) {
      var rang = (i + 1 < 10 ? " " : "") + (i + 1);
      pousserPlie(L, CORRESPONDANCE[i][0], 62, "  " + rang + ". ", "      ");
      pousserPlie(L, CORRESPONDANCE[i][1], 62, "      → ", "        ");
      L.push("      présent dans votre base : [OUI / NON : onglet ou page : ...........]");
      L.push("");
    }
    if (t.length) {
      L.push("Les thèmes que votre dossier déclare, tels qu'ils y ont été saisis :");
      for (var k = 0; k < t.length; k++) pousserPlie(L, t[k], 66, "  · ", "    ");
      L.push("");
    }
    L.push("DEUX RUBRIQUES DU DÉCRET NE SONT PAS AU PLANCHER, et il faut le savoir :");
    L.push("le 8° « Partenariats », ce que L. 2312-36 nomme la sous-traitance, et le");
    L.push("9° « Pour les entreprises appartenant à un groupe, transferts commerciaux");
    L.push("et financiers entre les entités du groupe ». Un accord peut donc les");
    L.push("supprimer ; le décret, lui, les impose à défaut d'accord.");
    L.push("");
    return L;
  }

  /* LA GRILLE : le contenu du décret déployé, rubrique par rubrique, avec pour
     chaque case ce qu'il faut y mettre, sur quelle année, et où la chercher.

     C'est la pièce maîtresse de ce fichier, et la raison pour laquelle la table
     ARBRE y figure : sans elle, le document rendrait à l'employeur le renvoi
     qu'il avait déjà. */
  function blocGrille(ctx, cle, options) {
    var opt = options || {};
    var arbre = ARBRE[cle];
    var a = anneesDe(ctx);
    var L = [];
    if (!arbre) { L.push("[Article " + cle + ", non découpé par le module.]"); return L; }
    L.push(GROS);
    L.push("LA GRILLE DE L'ARTICLE " + arbre.article.toUpperCase() +
      ", " + arbre.seuil.toUpperCase());
    L.push(GROS);
    L.push("");
    L.push("Version du texte lue à la source : " + arbre.version + ".");
    L.push("Rubriques : " + arbre.rubriques.length + ". Les libellés ci-dessous sont ceux du");
    L.push("décret, mot pour mot, ils ne sont ni résumés ni reformulés.");
    L.push("");
    L.push("Chaque case se remplit sur les six colonnes : " + enteteAnnees(a) + ".");
    L.push("");
    if (cle === "R. 2312-9") {
      L.push("R. 2312-9 NE SE SUFFIT PAS À LUI-MÊME : il ajoute à son tableau, par");
      L.push("renvoi, « les informations relatives à la formation professionnelle et");
      L.push("aux conditions de travail prévues au 1° A, e et f de l'article");
      L.push("R. 2312-8 ». Ces deux sujets sont donc DÉJÀ portés dans la grille");
      L.push("ci-dessous, à leur place, avec la marque de leur origine. C'est le");
      L.push("trou le plus fréquent des bases d'entreprises d'au moins trois cents");
      L.push("salariés.");
      L.push("");
    }
    L.push(TRAIT);
    L.push("");

    for (var i = 0; i < arbre.rubriques.length; i++) {
      var r = arbre.rubriques[i];
      L.push("════ " + r.n + "° " + r.titre.toUpperCase() + " ════");
      L.push("");
      L.push(r.plancher
        ? "Au plancher de L. 2312-21, alinéa 3 : cette rubrique est due quoi que"
        : "HORS du plancher de L. 2312-21, alinéa 3 : un accord peut la supprimer,");
      L.push(r.plancher
        ? "stipule un accord."
        : "mais à défaut d'accord le décret l'impose.");
      L.push("");
      pousserPlie(L, "OÙ CHERCHER LA DONNÉE : " + (SOURCES[r.n] || "[à déterminer]"),
        66, "", "  ");
      L.push("");
      for (var j = 0; j < r.sections.length; j++) {
        var s = r.sections[j];
        if (s.lettre || s.titre) {
          pousserPlie(L, (s.lettre ? s.lettre + ", " : "") + s.titre, 66, "  ", "      ");
          L.push("");
        }
        for (var k = 0; k < s.sujets.length; k++) {
          var u = s.sujets[k];
          pousserPlie(L, (u.lettre ? u.lettre + ") " : "· ") + u.intitule, 62, "    ", "       ");
          if (u.renvoi) L.push("       (importé par renvoi : " + u.renvoi + ")");
          for (var m = 0; m < u.informations.length; m++)
            pousserPlie(L, u.informations[m], 60, "       - ", "         ");
          if (!opt.sansCases) {
            L.push("       " + a.passees[0] + " : [...]  " + a.passees[1] + " : [...]  " +
              a.courante + " : [...]");
            L.push("       " + a.suivantes[0] + " : [...]  " + a.suivantes[1] + " : [...]  " +
              a.suivantes[2] + " : [...]   (chiffres ou grandes tendances)");
            L.push("       service qui fournit : [.............]  échéance : [.........]");
          }
          L.push("");
        }
      }
      L.push(TRAIT);
      L.push("");
    }
    return L;
  }

  /* La grille du régime applicable, une seule, ou les deux quand l'effectif
     n'est pas connu. C'est ici que « le contenu du régime descend dans le
     document ». */
  function blocGrilleDuRegime(ctx, r, options) {
    var L = [];
    for (var i = 0; i < r.articles.length; i++) {
      if (!r.connu) {
        L.push(GROS);
        L.push("GRILLE " + (i + 1) + " SUR 2 : À CONSERVER SI VOTRE EFFECTIF EST " +
          (r.articles[i] === "R. 2312-8" ? "INFÉRIEUR" : "AU MOINS ÉGAL") + " À 300");
        L.push(GROS);
        L.push("");
      }
      L = L.concat(blocGrille(ctx, r.articles[i], options));
    }
    return L;
  }

  /* Le courrier de mise à disposition, aux élus et aux délégués syndicaux. Une
     base à laquelle personne n'a été invité n'est pas mise à disposition, et le
     délai de consultation ne court pas (R. 2312-5). */
  function courrierMAD(ctx, objet, corps) {
    var L = [GROS, "COURRIER : MISE À DISPOSITION DE LA BASE", GROS, ""];
    L.push(nomDe(ctx));
    L.push(adresseDe(ctx));
    L.push("");
    L.push("Aux membres de la délégation du personnel du comité social et économique,");
    L.push("aux membres de la délégation du personnel du comité social et économique");
    L.push("central d'entreprise s'il en existe un, et aux délégués syndicaux");
    L.push("- ce sont les personnes que le dernier alinéa de L. 2312-36 désigne.");
    L.push("");
    L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
    L.push("");
    L.push("Objet : " + objet);
    L.push("");
    L.push("Mesdames, Messieurs,");
    L.push("");
    (corps || []).forEach(function (x) { L.push(x); });
    L.push("");
    L.push("Je vous rappelle que la base de données est accessible en permanence aux");
    L.push("membres de la délégation du personnel du comité social et économique ainsi");
    L.push("qu'aux membres de la délégation du personnel du comité social et économique");
    L.push("central d'entreprise, et aux délégués syndicaux (L. 2312-36).");
    L.push("");
    L.push("Je vous rappelle également que les membres de la délégation du personnel du");
    L.push("comité social et économique, du comité social et économique central");
    L.push("d'entreprise et les délégués syndicaux sont tenus à une obligation de");
    L.push("discrétion à l'égard des informations contenues dans la base de données");
    L.push("revêtant un caractère confidentiel et présentées comme telles par");
    L.push("l'employeur (L. 2312-36, dernier alinéa). Les informations confidentielles");
    L.push("sont signalées comme telles dans la base, avec la durée de leur");
    L.push("confidentialité (R. 2312-13).");
    L.push("");
    L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
    L.push("considération distinguée.");
    L.push("");
    L.push(signataire(ctx));
    L.push("");
    return L;
  }

  /* Le calendrier, calculé. Chaque document en porte un : une obligation sans
     date se remet au lendemain. */
  function calendrier(ctx, lignes) {
    var L = [GROS, "VOTRE CALENDRIER", GROS, ""];
    L.push("Compté depuis aujourd'hui, " + leJour(aujourd(ctx)) + ".");
    L.push("");
    (lignes || []).forEach(function (x) { L.push(x); });
    L.push("");
    return L;
  }
  /* Une échéance, en jours depuis aujourd'hui. */
  function ech(ctx, jours, quoi) {
    return "  · " + leJour(dans(aujourd(ctx), jours)) + ", " + quoi;
  }

  /* Le pied : d'où vient ce qui est écrit, et ce que le document ne dit pas. */
  function pied(articles, notes) {
    var L = ["", TRAIT, ""];
    L.push("Fondement : " + articles + ".");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur identifiant");
    L.push("de version dans moteur/bdese/textes-bdese.json.");
    if (notes && notes.length) { L.push(""); notes.forEach(function (n) { L.push(n); }); }
    L.push("");
    L.push("CE QUE CE MODULE N'EST PAS. Il prépare, structure, documente et audite la");
    L.push("base. Il ne fournit pas une base collaborative accessible simultanément à");
    L.push("plusieurs catégories d'utilisateurs, et IL N'EST PAS LA BASE : la mise à");
    L.push("disposition reste un acte de l'employeur, qui se prouve autrement.");
    L.push("");
    L.push("Aucune sanction pénale ni pénalité financière n'est annoncée dans ce");
    L.push("document : le corpus lu par ce module n'en porte aucune qui soit propre à");
    L.push("la base de données. Ce qui est encouru, et qui a été lu, est");
    L.push("l'irrégularité opposable, la consultation dont le délai n'a pas couru, et");
    L.push("l'avis négatif acquis au terme.");
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords et l'accord de l'article L. 2312-21 s'il en existe un peuvent");
    L.push("ajouter des exigences que l'application ne lit pas. Ne laissez aucun");
    L.push("crochet dans le texte que vous mettez à disposition ou que vous déposez.");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-REG-01 : LA NOTE DE RÉGIME
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-REG-01", {
    nom: "Note de régime",
    detail: "Note de régime - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note de régime",
        "article L. 2312-21 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTE DE RÉGIME");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["base"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-21 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-21")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-REG-02", {
    nom: "Note de régime rectificative",
    detail: "Note de régime rectificative - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note de régime rectificative",
        "article L. 2312-21 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTE DE RÉGIME RECTIFICATIVE");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["base"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-21 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-21")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-DAT-01", {
    nom: "Note d'exigibilité",
    detail: "Note d'exigibilité - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note d'exigibilité",
        "article L. 2312-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTE D'EXIGIBILITÉ");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["dates"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-2 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-2")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-DAT-02", {
    nom: "Note de franchissement du seuil",
    detail: "Note de franchissement du seuil - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note de franchissement du seuil",
        "article L. 2312-34 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTE DE FRANCHISSEMENT DU SEUIL");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["dates"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-34 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-34")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CNT-01", {
    nom: "Grille du plancher légal",
    detail: "Grille du plancher légal - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Grille du plancher légal",
        "article L. 2312-21 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - GRILLE DU PLANCHER LÉGAL");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["contenu"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-21 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-21")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CNT-02", {
    nom: "Grille du contenu supplétif",
    detail: "Grille du contenu supplétif - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Grille du contenu supplétif",
        "article R. 2312-8 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - GRILLE DU CONTENU SUPPLÉTIF");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["contenu"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article R. 2312-8 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("R. 2312-8")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CNT-03", {
    nom: "Tableau des six années",
    detail: "Tableau des six années - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Tableau des six années",
        "article R. 2312-9 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - TABLEAU DES SIX ANNÉES");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["contenu"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article R. 2312-9 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("R. 2312-9")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CNT-04", {
    nom: "Note sur les perspectives",
    detail: "Note sur les perspectives - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note sur les perspectives",
        "article L. 2312-21 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTE SUR LES PERSPECTIVES");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["contenu"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-21 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-21")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-MAD-01", {
    nom: "Décision d'organisation",
    detail: "Décision d'organisation - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Décision d'organisation",
        "article L. 2312-18 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DÉCISION D'ORGANISATION");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["modalités"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-18 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-18")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-MAD-02", {
    nom: "Calendrier d'actualisation",
    detail: "Calendrier d'actualisation - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Calendrier d'actualisation",
        "article L. 2312-27 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CALENDRIER D'ACTUALISATION");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["modalités"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-27 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-27")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-MAD-03", {
    nom: "Information des bénéficiaires",
    detail: "Information des bénéficiaires - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Information des bénéficiaires",
        "article L. 2312-18 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - INFORMATION DES BÉNÉFICIAIRES");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["modalités"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-18 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-18")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CSL-01", {
    nom: "Avenant de périodicité",
    detail: "Avenant de périodicité - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Avenant de périodicité",
        "article L. 2312-19 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - AVENANT DE PÉRIODICITÉ");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["consultation"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-19 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-19")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CSL-02", {
    nom: "Calendrier annuel de réunions",
    detail: "Calendrier annuel de réunions - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Calendrier annuel de réunions",
        "article L. 2312-21 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CALENDRIER ANNUEL DE RÉUNIONS");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["consultation"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-21 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-21")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-CSL-03", {
    nom: "Fiche de délai de consultation",
    detail: "Fiche de délai de consultation - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Fiche de délai de consultation",
        "article R. 2312-5 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - FICHE DE DÉLAI DE CONSULTATION");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["consultation"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article R. 2312-5 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("R. 2312-5")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-ETB-01", {
    nom: "Note sur le niveau d'établissements",
    detail: "Note sur le niveau d'établissements - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note sur le niveau d'établissements",
        "article L. 2312-18 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTE SUR LE NIVEAU D'ÉTABLISSEMENTS");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["établissements"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-18 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-18")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-COH-01", {
    nom: "Bordereau des pièces",
    detail: "Bordereau des pièces - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Bordereau des pièces",
        "article L. 2312-21 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - BORDEREAU DES PIÈCES");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cohérence"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-21 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-21")).join("\n");
    }
  });


  DP.ajouter("BDESE-CTL-PRV-01", {
    nom: "Dossier de preuve",
    detail: "Dossier de preuve - mise à disposition de la base de données",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Dossier de preuve",
        "article L. 2312-18 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DOSSIER DE PREUVE");
      L.push("");
      L.push("Entreprise : " + (p.denomination || "[nom de l'entreprise]"));
      L.push("Document type : Document de régularisation");
      L.push("Date : " + (d0 instanceof Date ? ("0" + d0.getDate()).slice(-2) + "/" +
        ("0" + (d0.getMonth() + 1)).slice(-2) + "/" + d0.getFullYear() : "[date]"));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées.");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Étape | Date | Preuve");
      L.push("------|------|-------");
      L.push("Rédaction | [DATE] | texte signé");
      L.push("Transmission | [DATE] | courrier");
      L.push("Consultation | [DATE] | procès-verbal");
      L.push("Publication | [DATE] | affichage");
      L.push("Dépôt | [DATE] | récépissé");
      L.push("");

      L = L.concat(DP.liens(ctx, ["preuve"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La base de données doit être mise à disposition du comité social et");
      L.push("économique de manière accessible et actualisée. L'article L. 2312-18 du code");
      L.push("du travail fixe les conditions et les délais de cette mise à disposition.");
      L.push("");

      return L.concat(pied("L. 2312-18")).join("\n");
    }
  });


})(typeof window !== "undefined" ? window : this);
