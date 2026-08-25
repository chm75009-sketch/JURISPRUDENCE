/* Les documents que l'application PRODUIT — module « base de données
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
   cents, et les DEUX lorsque l'effectif n'est pas connu — plutôt que d'en
   deviner un.

   QUATRE RÈGLES, TENUES PARTOUT

   1. Rien qui n'ait été lu à la source. Les articles cités ici figurent dans
      moteur/bdese/textes-bdese.json avec leur identifiant de version, ou dans
      le fondement du contrôle auquel le document répond. Les articles seulement
      RENVOYÉS par un texte lu — L. 2232-12, L. 1142-8, L. 2315-27, L. 6315-1,
      L. 23-12-1 du code de commerce — sont NOMMÉS, jamais reproduits ni
      paraphrasés : le module ne les a pas lus, et il le dit à l'endroit même où
      le lecteur pourrait croire qu'il les connaît.

   2. Le contenu du décret n'est pas récrit : il est REPRIS du découpage que
      moteur/bdese/contenu-bdese.js opère sur le texte capté, et dont la
      couverture est mesurée à cent pour cent. La table ARBRE ci-dessous est la
      sortie de ce découpage — mêmes libellés, mot pour mot, avec la version de
      l'article. Réécrire ces tableaux à la main aurait garanti des écarts
      silencieux à la prochaine modification du décret.

   3. Les faits et les chiffres ne s'inventent jamais. Aucun document n'écrit la
      masse salariale, les effectifs par catégorie, les rémunérations ni les
      résultats. Tout cela sort entre crochets, avec l'indication de la source où
      l'employeur ira le chercher — déclaration sociale nominative, comptes
      annuels, registre unique du personnel. L'indication de source est une aide
      à la recherche, pas une affirmation sur l'entreprise.

   4. Aucune peine annoncée qui ne soit portée par un texte capté. Le corpus de
      ce module ne contient AUCUN texte pénal ni aucune pénalité financière
      propres à la base de données — c'est déjà le constat de
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
     pour mot dans le texte capté — c'est la garantie « fidelite() » du
     découpage, et elle bloque la publication du module quand elle échoue.

     Le renvoi de R. 2312-9 vers le 1° A e) et f) de R. 2312-8 — formation
     professionnelle et conditions de travail — est déjà EXÉCUTÉ dans cette
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
                    "rémunération moyenne du mois de décembre (effectif permanent) hors primes à périodicité non mensuelle ― base 35 heures (II)",
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
     par contenu-bdese.js — dix thèmes, dans l'ordre de la phrase. Ce sont LES
     DIX THÈMES DU PLANCHER DE L'ACCORD, à ne pas confondre avec les dix thèmes
     de l'article L. 2312-36 : le plancher scinde les investissements et les
     fonds propres/endettement, et il laisse tomber la sous-traitance — que le
     décret nomme « partenariats » — et les transferts intragroupe. */
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
    ["l'investissement social", "1° Investissements — section A « Investissement social »"],
    ["l'investissement matériel et immatériel", "1° Investissements — section B « Investissement matériel et immatériel »"],
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

     Une aide à la recherche, rubrique par rubrique — jamais une affirmation sur
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
    3: "comptes annuels — bilan, compte de résultat, annexe · liasse fiscale · " +
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
    return "non renseigné — à vérifier sur la base elle-même";
  }
  function estOui(v) { return v === true || v === "oui"; }
  function estNon(v) { return v === false || v === "non"; }
  function vide(v) {
    return v === undefined || v === null || v === "" ||
      (Array.isArray(v) && !v.length) || (typeof v === "string" && !v.trim());
  }
  /* Une liste du dossier, quelle que soit sa forme — tableau, chaîne à retours
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

  /* Une date du dossier, écrite en toutes lettres — ou son crochet. */
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
  /* Le même quantième, n mois plus tard — la manière dont regime-bdese.js
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
    L.push("pas — un document qui devinerait la masse salariale ou les effectifs par");
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

  /* Quel texte commande le contenu de la base — l'ordre des trois étages, écrit
     avant toute grille. Aucun document de ce fichier ne déploie une grille sans
     avoir posé cette question : monter la grille du décret dans une entreprise
     couverte par un accord, c'est réclamer ce qui n'est pas dû. */
  function blocRegime(ctx, r) {
    var f = F(ctx);
    var L = ["════ QUEL TEXTE COMMANDE VOTRE BASE ════", ""];
    L.push("L'ordre ne se contourne pas, et il commande tout le reste :");
    L.push("");
    L.push("  1. UN ACCORD D'ENTREPRISE — « un accord d'entreprise conclu dans les");
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
    L.push("  3. À DÉFAUT DES DEUX, LE DÉCRET — R. 2312-8 en dessous de trois cents");
    L.push("     salariés, R. 2312-9 à partir de trois cents.");
    L.push("");
    L.push("Dans tous les cas, le PLANCHER de l'alinéa 3 de L. 2312-21 reste dû :");
    L.push("« la base de données comporte au moins les thèmes suivants ». Un accord");
    L.push("qui retire l'un de ces thèmes est, sur ce point, sans effet.");
    L.push("");
    L.push("CE QUE VOTRE DOSSIER DÉCLARE");
    L.push("");
    L.push("  · accord d'entreprise définissant la base : " +
      etat(f.accordEntreprise, "OUI" + (estOui(f.accordEntrepriseVerse) ? " — et il est versé" :
        " — mais il n'est PAS versé : sans son texte, la grille due ne peut pas être établie"), "non"));
    L.push("  · accord de branche définissant la base : " +
      etat(f.accordBranche, "OUI" + (estOui(f.accordBrancheVerse) ? " — et il est versé" :
        " — mais il n'est PAS versé"), "non"));
    L.push("  · effectif : " + (r.connu ? r.effectif + " salariés" : "[EFFECTIF — non renseigné]"));
    L.push("");
    if (estOui(f.accordEntreprise) || estOui(f.accordBranche)) {
      L.push("UN ACCORD EST DÉCLARÉ. La grille déployée plus bas est celle du décret :");
      L.push("elle ne vaut alors que comme point de comparaison, et comme rappel du");
      L.push("plancher que votre accord ne pouvait pas descendre. C'est le texte de");
      L.push("votre accord qui fixe ce qui est dû — reportez-vous-y, rubrique par");
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
      L.push("défaut d'accord est l'article " + r.article + " — " + r.seuil + ".");
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
    L.push("  · " + a.passees[0] + " et " + a.passees[1] + " — les deux années précédentes. Elles ne se");
    L.push("    recalculent pas : reprenez-les dans les documents déjà produits.");
    L.push("  · " + a.courante + " — l'année en cours.");
    L.push("  · " + a.suivantes.join(", ") + " — les trois années suivantes, en données chiffrées");
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
      L.push("      présent dans votre base : [OUI / NON — onglet ou page : ...........]");
      L.push("");
    }
    if (t.length) {
      L.push("Les thèmes que votre dossier déclare, tels qu'ils y ont été saisis :");
      for (var k = 0; k < t.length; k++) pousserPlie(L, t[k], 66, "  · ", "    ");
      L.push("");
    }
    L.push("DEUX RUBRIQUES DU DÉCRET NE SONT PAS AU PLANCHER, et il faut le savoir :");
    L.push("le 8° « Partenariats » — ce que L. 2312-36 nomme la sous-traitance — et le");
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
    if (!arbre) { L.push("[Article " + cle + " — non découpé par le module.]"); return L; }
    L.push(GROS);
    L.push("LA GRILLE DE L'ARTICLE " + arbre.article.toUpperCase() +
      " — " + arbre.seuil.toUpperCase());
    L.push(GROS);
    L.push("");
    L.push("Version du texte lue à la source : " + arbre.version + ".");
    L.push("Rubriques : " + arbre.rubriques.length + ". Les libellés ci-dessous sont ceux du");
    L.push("décret, mot pour mot — ils ne sont ni résumés ni reformulés.");
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
      L.push("════ " + r.n + "° — " + r.titre.toUpperCase() + " ════");
      L.push("");
      L.push(r.plancher
        ? "Au plancher de L. 2312-21, alinéa 3 : cette rubrique est due quoi que"
        : "HORS du plancher de L. 2312-21, alinéa 3 : un accord peut la supprimer,");
      L.push(r.plancher
        ? "stipule un accord."
        : "mais à défaut d'accord le décret l'impose.");
      L.push("");
      pousserPlie(L, "OÙ CHERCHER LA DONNÉE — " + (SOURCES[r.n] || "[à déterminer]"),
        66, "", "  ");
      L.push("");
      for (var j = 0; j < r.sections.length; j++) {
        var s = r.sections[j];
        if (s.lettre || s.titre) {
          pousserPlie(L, (s.lettre ? s.lettre + " — " : "") + s.titre, 66, "  ", "      ");
          L.push("");
        }
        for (var k = 0; k < s.sujets.length; k++) {
          var u = s.sujets[k];
          pousserPlie(L, (u.lettre ? u.lettre + ") " : "· ") + u.intitule, 62, "    ", "       ");
          if (u.renvoi) L.push("       (importé par renvoi : " + u.renvoi + ")");
          for (var m = 0; m < u.informations.length; m++)
            pousserPlie(L, u.informations[m], 60, "       – ", "         ");
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

  /* La grille du régime applicable — une seule, ou les deux quand l'effectif
     n'est pas connu. C'est ici que « le contenu du régime descend dans le
     document ». */
  function blocGrilleDuRegime(ctx, r, options) {
    var L = [];
    for (var i = 0; i < r.articles.length; i++) {
      if (!r.connu) {
        L.push(GROS);
        L.push("GRILLE " + (i + 1) + " SUR 2 — À CONSERVER SI VOTRE EFFECTIF EST " +
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
    var L = [GROS, "COURRIER — MISE À DISPOSITION DE LA BASE", GROS, ""];
    L.push(nomDe(ctx));
    L.push(adresseDe(ctx));
    L.push("");
    L.push("Aux membres de la délégation du personnel du comité social et économique,");
    L.push("aux membres de la délégation du personnel du comité social et économique");
    L.push("central d'entreprise s'il en existe un, et aux délégués syndicaux");
    L.push("— ce sont les personnes que le dernier alinéa de L. 2312-36 désigne.");
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
    return "  · " + leJour(dans(aujourd(ctx), jours)) + " — " + quoi;
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
    L.push("l'irrégularité opposable — la consultation dont le délai n'a pas couru, et");
    L.push("l'avis négatif acquis au terme.");
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords et l'accord de l'article L. 2312-21 s'il en existe un peuvent");
    L.push("ajouter des exigences que l'application ne lit pas. Ne laissez aucun");
    L.push("crochet dans le texte que vous mettez à disposition ou que vous déposez.");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-REG-01 — LA NOTE DE RÉGIME
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-REG-01", {
    nom: "La note de régime — quel texte commande votre base, et la pièce qui l'établit",
    detail: "La recherche des accords dans l'ordre que la loi impose, la note " +
            "signée qui arrête le régime retenu, le bordereau des pièces et la " +
            "grille qui en découle.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx);
      var L = entete(ctx, "Note de régime — le texte applicable à la base de données",
        "article L. 2312-21 du code du travail");

      modeDEmploi(L, "la note qui arrête le texte applicable à votre base");

      L.push("POURQUOI CETTE NOTE VIENT AVANT TOUT LE RESTE");
      L.push("");
      L.push("Tant que le texte applicable n'est pas identifié, la grille due est");
      L.push("inconnue : l'entreprise monte une base au hasard, et ne peut pas établir");
      L.push("devant le comité qu'elle porte ce qui lui est dû. L'article L. 2312-21");
      L.push("laisse l'accord définir l'organisation, l'architecture et le contenu de");
      L.push("la base ; le décret ne s'applique qu'en son absence. Les deux grilles ne");
      L.push("se recouvrent pas, et l'erreur de texte se paie en rubriques manquantes.");
      L.push("");

      L = L.concat(blocRegime(ctx, r));

      L.push(GROS);
      L.push("NOTE DE RÉGIME");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — LA RECHERCHE ACCOMPLIE");
      L.push("");
      L.push("1.1. Recherche d'un accord d'entreprise définissant la base.");
      L.push("L'article L. 2312-21 n'en connaît que deux formes, et il n'en admet pas");
      L.push("d'autre : l'accord conclu dans les conditions prévues au premier alinéa");
      L.push("de l'article L. 2232-12, ou, en l'absence de délégué syndical, l'accord");
      L.push("entre l'employeur et le comité social et économique adopté à la majorité");
      L.push("des membres titulaires de la délégation du personnel du comité.");
      L.push("");
      L.push("Résultat de la recherche : [AUCUN ACCORD TROUVÉ / ACCORD DU ..............");
      L.push("intitulé ............................................................]");
      L.push("Forme de conclusion, s'il en existe un : [signatures des organisations");
      L.push("syndicales dans les conditions du premier alinéa de L. 2232-12 / procès-");
      L.push("verbal d'adoption par le comité à la majorité des titulaires].");
      L.push("");
      L.push("L'article L. 2232-12, auquel L. 2312-21 renvoie pour les conditions de");
      L.push("conclusion, N'A PAS ÉTÉ LU À LA SOURCE par ce module : son contenu n'est");
      L.push("pas reproduit ici, et il faut le vérifier avant d'affirmer que l'accord");
      L.push("a été régulièrement conclu.");
      L.push("");
      L.push("1.2. À défaut, recherche d'un accord de branche.");
      L.push("Le dernier alinéa de L. 2312-21 ne l'ouvre qu'aux entreprises de MOINS de");
      L.push("trois cents salariés, et seulement à défaut d'accord d'entreprise.");
      L.push("Convention collective ou branche applicable : " +
        cro(P(ctx).conventionCollective || f.conventionCollective, "convention collective"));
      L.push("Résultat : [AUCUNE STIPULATION SUR LA BASE / ACCORD DE BRANCHE DU .......");
      L.push("article ou avenant : ...........................]");
      L.push("");
      L.push("1.3. À défaut des deux, le contenu supplétif du décret.");
      L.push("R. 2312-8 en dessous de trois cents salariés, R. 2312-9 à partir de trois");
      L.push("cents. L'effectif se justifie par le relevé mensuel qui l'établit.");
      L.push("");
      L.push("ARTICLE 2 — LE RÉGIME RETENU");
      L.push("");
      L.push("Le texte qui commande le contenu de la base de " + nomDe(ctx) + " est :");
      L.push("");
      L.push("  [ ] l'accord d'entreprise du .............., versé au dossier ;");
      L.push("  [ ] l'accord de branche du .............., versé au dossier ;");
      if (r.connu) {
        L.push("  [ ] l'article " + r.article + " du code du travail — l'entreprise comptant");
        L.push("      " + r.effectif + " salariés, soit " + r.seuil + ", et aucun accord ne");
        L.push("      définissant la base.");
      } else {
        L.push("  [ ] l'article R. 2312-8 — effectif inférieur à trois cents salariés ;");
        L.push("  [ ] l'article R. 2312-9 — effectif d'au moins trois cents salariés.");
      }
      L.push("");
      L.push("Date à laquelle ce régime est retenu : " + leJour(aujourd(ctx)) + ".");
      L.push("");
      L.push("ARTICLE 3 — LE PLANCHER, QUEL QUE SOIT LE RÉGIME");
      L.push("");
      L.push("Quel que soit le texte retenu, les dix thèmes de l'alinéa 3 de");
      L.push("L. 2312-21 sont dus : « la base de données comporte au moins les thèmes");
      L.push("suivants ». Ils sont repris à l'article 4 ci-dessous.");
      L.push("");
      L.push("ARTICLE 4 — LE BORDEREAU DES PIÈCES");
      L.push("");
      L.push("  1. [Accord d'entreprise définissant la base — texte complet et daté]");
      L.push("  2. [Le cas échéant, procès-verbal d'adoption par le comité à la");
      L.push("     majorité des membres titulaires, ou signatures syndicales]");
      L.push("  3. [Accord de branche, s'il est invoqué — texte complet]");
      L.push("  4. [Relevé d'effectif mensuel établissant le seuil retenu]");
      L.push("  5. [Le cas échéant, constat écrit qu'aucun accord ne définit la base]");
      L.push("");
      L.push("Un régime conventionnel se prouve par son texte. Un accord déclaré et non");
      L.push("versé ne vaut pas régime : ni l'application ni le comité ne peuvent");
      L.push("vérifier ce qu'ils n'ont pas.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(blocPlancher(ctx));
      L = L.concat(blocAnnees(ctx));
      L = L.concat(blocGrilleDuRegime(ctx, r));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous signez la note et ouvrez le bordereau des pièces."),
        ech(ctx, 7, "la recherche des accords est close : accord d'entreprise, accord"),
        "    de branche, ou constat écrit qu'il n'en existe aucun.",
        ech(ctx, 14, "le régime est arrêté et la grille due est connue. Les contrôles"),
        "    de contenu ne concluent pas avant ce jour : auditer un contenu sans",
        "    savoir quel texte le commande produit des manquements inventés.",
        ech(ctx, 15, "vous relancez l'audit avec le régime établi."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-8, R. 2312-9, " +
        "R. 2312-10, R. 2312-11, R. 2312-12",
        ["L'article L. 2232-12, auquel L. 2312-21 renvoie pour les conditions de",
         "conclusion de l'accord d'entreprise, n'a pas été lu à la source par ce",
         "module : il est nommé, non reproduit."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-REG-02 — L'ACCORD DE BRANCHE ÉCARTÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-REG-02", {
    nom: "La note de régime rectificative — l'accord de branche écarté",
    detail: "Le constat qui écarte l'accord de branche, le texte réellement " +
            "applicable, le tableau des écarts à combler, le courrier aux élus " +
            "et le calendrier de complètement.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx);
      var L = entete(ctx, "Note de régime rectificative — le texte réellement applicable à la base",
        "article L. 2312-21, dernier alinéa, du code du travail");

      modeDEmploi(L, "la note qui écarte l'accord de branche et rétablit le texte applicable");

      L.push("CE QUE LE TEXTE DIT, ET LES DEUX CONDITIONS QU'IL POSE");
      L.push("");
      L.push("« À défaut d'accord prévu à l'alinéa premier, un accord de branche peut");
      L.push("définir l'organisation, l'architecture, le contenu et les modalités de");
      L.push("fonctionnement de la base de données économiques, sociales et");
      L.push("environnementales dans les entreprises de moins de trois cents");
      L.push("salariés » (L. 2312-21, dernier alinéa).");
      L.push("");
      L.push("Deux conditions, cumulatives, et aucune n'est facultative :");
      L.push("");
      L.push("  1. IL N'EXISTE PAS D'ACCORD D'ENTREPRISE définissant la base. L'accord");
      L.push("     de branche ne vaut qu'« à défaut » : dès qu'un accord d'entreprise");
      L.push("     existe, la branche ne commande plus.");
      L.push("  2. L'ENTREPRISE COMPTE MOINS DE TROIS CENTS SALARIÉS. Au-delà, la voie");
      L.push("     de la branche est fermée, et c'est l'article R. 2312-9 qui");
      L.push("     s'applique à défaut d'accord d'entreprise.");
      L.push("");
      L.push("Hors de ces deux conditions, la base est bâtie sur un texte qui ne la");
      L.push("commande pas. Elle sera jugée au regard de celui qui la commande, et le");
      L.push("comité peut lui opposer les rubriques manquantes.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · accord de branche invoqué : " + etat(f.accordBranche, "OUI", "non"));
      L.push("  · accord d'entreprise définissant la base : " +
        etat(f.accordEntreprise, "OUI — la branche est alors écartée par le texte lui-même", "non"));
      L.push("  · effectif : " + (r.connu ? r.effectif + " salariés" : "[EFFECTIF — non renseigné]"));
      if (r.connu && r.effectif >= 300) {
        L.push("");
        L.push("  → L'EFFECTIF FERME À LUI SEUL LA VOIE DE LA BRANCHE : " + r.effectif +
          " salariés,");
        L.push("    soit au moins trois cents. À défaut d'accord d'entreprise, le texte");
        L.push("    applicable est l'article R. 2312-9.");
      } else if (r.connu) {
        L.push("");
        L.push("  → L'effectif de " + r.effectif + " salariés est inférieur à trois cents : la");
        L.push("    première condition est remplie. Reste la seconde — l'absence");
        L.push("    d'accord d'entreprise.");
      }
      L.push("");

      L.push(GROS);
      L.push("NOTE DE RÉGIME RECTIFICATIVE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — LE CONSTAT");
      L.push("");
      L.push("1.1. Effectif de l'entreprise : " +
        (r.connu ? r.effectif + " salariés" : "[EFFECTIF]") + ", établi par [relevé");
      L.push("d'effectif mensuel / déclarations sociales nominatives de la période].");
      L.push("Date à laquelle le seuil de trois cents salariés a été franchi, s'il l'a");
      L.push("été : [DATE — douze mois consécutifs de dépassement, L. 2312-34].");
      L.push("");
      L.push("1.2. Existence d'un accord d'entreprise au sens du premier alinéa de");
      L.push("L. 2312-21 : [OUI, du .............. / NON, constat du ..............].");
      L.push("");
      L.push("1.3. En conséquence, l'accord de branche [invoqué : ..................]");
      L.push("[ne peut pas / peut] définir la base de l'entreprise.");
      L.push("");
      L.push("ARTICLE 2 — LE TEXTE RÉELLEMENT APPLICABLE");
      L.push("");
      L.push("Le texte qui commande le contenu de la base est :");
      L.push("");
      L.push("  [ ] l'accord d'entreprise du .............. ;");
      if (r.connu) {
        L.push("  [ ] l'article " + r.article + " — " + r.seuil + ", et aucun accord");
        L.push("      d'entreprise ne définissant la base.");
      } else {
        L.push("  [ ] l'article R. 2312-8 — moins de trois cents salariés ;");
        L.push("  [ ] l'article R. 2312-9 — au moins trois cents salariés.");
      }
      L.push("");
      L.push("ARTICLE 3 — LES ÉCARTS À COMBLER");
      L.push("");
      L.push("La grille déjà montée est comparée à celle que ce texte commande,");
      L.push("rubrique par rubrique. La grille due est déployée en entier plus bas :");
      L.push("pointez-la, et reportez ici ce qui manque.");
      L.push("");
      L.push("  rubrique manquante ou incomplète │ service │ échéance de complètement");
      L.push("  ─────────────────────────────────┼─────────┼─────────────────────────");
      for (var i = 0; i < 8; i++)
        L.push("  [...............................] │ [.....] │ [.....................]");
      L.push("");
      L.push("Ces écarts sont comblés AVANT la prochaine mise à disposition, et les");
      L.push("bénéficiaires en sont informés : sans cette information, le délai de");
      L.push("consultation ne court pas (R. 2312-5).");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(blocAnnees(ctx));
      L = L.concat(blocGrilleDuRegime(ctx, r));

      L = L.concat(courrierMAD(ctx,
        "changement du texte applicable à la base de données et complètement en cours",
        ["Je vous informe que le texte qui commande le contenu de la base de données",
         "économiques, sociales et environnementales de l'entreprise a été rectifié.",
         "",
         "L'accord de branche jusqu'ici retenu ne peut pas définir cette base : le",
         "dernier alinéa de l'article L. 2312-21 du code du travail ne l'admet qu'à",
         "défaut d'accord d'entreprise, et dans les entreprises de moins de trois",
         "cents salariés.",
         "",
         "Le texte applicable est désormais [l'accord d'entreprise du ............ /",
         "l'article " + (r.connu ? r.article : "R. 2312-8 ou R. 2312-9") + " du code du travail]. La grille correspondante",
         "est en cours de complètement selon le calendrier joint ; chaque rubrique",
         "ajoutée vous sera signalée."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous signez la note rectificative et la versez au dossier."),
        ech(ctx, 7, "les écarts sont relevés, rubrique par rubrique, sur la grille"),
        "    déployée ci-dessus.",
        ech(ctx, 14, "chaque écart a son service responsable et son échéance."),
        ech(ctx, 60, "les rubriques manquantes sont montées et renseignées sur les six"),
        "    années dues.",
        ech(ctx, 61, "vous informez les bénéficiaires : c'est cette information qui"),
        "    fait courir le délai de consultation (R. 2312-5).",
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-34, L. 2312-36, R. 2312-5, " +
        "R. 2312-8, R. 2312-9, R. 2312-10",
        ["L'article L. 2232-12, auquel L. 2312-21 renvoie, n'a pas été lu à la",
         "source par ce module : il est nommé, non reproduit."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-DAT-01 — LA NOTE D'EXIGIBILITÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-DAT-01", {
    nom: "La note d'exigibilité — le seuil de cinquante salariés et les douze mois de L. 2312-2",
    detail: "Le relevé d'effectif mois par mois, la date d'atteinte du seuil, le " +
            "terme du délai de douze mois, la réserve du mandat inférieur à un an " +
            "et le calendrier qui en découle.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx);
      var d50 = f.dateSeuil50Atteint, fin = f.dateFinMandat, ren = f.dateRenouvellementCSE;
      var terme = estISO(d50) ? moisApres(d50, 12) : null;
      var L = entete(ctx, "Note d'exigibilité — atteinte du seuil de cinquante salariés",
        "article L. 2312-2 du code du travail");

      modeDEmploi(L, "la note qui établit depuis quand la base vous est due");

      L.push("POURQUOI CETTE DATE COMPTE");
      L.push("");
      L.push("La base de données relève des attributions récurrentes d'information et");
      L.push("de consultation. Tant que la date n'est pas arrêtée, l'entreprise ne sait");
      L.push("ni depuis quand la base est due, ni depuis quand elle est en retard, et");
      L.push("elle ne peut opposer aucun délai à qui le lui reproche.");
      L.push("");
      L.push("ET DEUX SEUILS À NE PAS CONFONDRE. Le comité social et économique se met");
      L.push("en place à onze salariés ; les attributions récurrentes, dont la base");
      L.push("relève, ne s'exercent qu'à partir de cinquante. Ce sont deux seuils");
      L.push("distincts, et c'est le second qui commande ici.");
      L.push("");
      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Lorsque, postérieurement à la mise en place du comité social et");
      L.push("économique, l'effectif de l'entreprise atteint au moins cinquante");
      L.push("salariés pendant douze mois consécutifs, le comité exerce l'ensemble des");
      L.push("attributions récurrentes d'information et de consultation définies par la");
      L.push("section 3 à l'expiration d'un délai de douze mois à compter de la date à");
      L.push("laquelle le seuil de 50 salariés a été atteint pendant douze mois");
      L.push("consécutifs. Dans le cas où, à l'expiration de ce délai de douze mois, le");
      L.push("mandat du comité restant à courir est inférieur à un an, ce délai court à");
      L.push("compter de son renouvellement. Lorsque l'entreprise n'est pas pourvue");
      L.push("d'un comité social et économique, dans le cas où l'effectif de");
      L.push("l'entreprise atteint au moins cinquante salariés pendant douze mois");
      L.push("consécutifs, le comité exerce l'ensemble des attributions définies par la");
      L.push("section 3 à l'expiration d'un délai d'un an à compter de sa mise en");
      L.push("place » (L. 2312-2).");
      L.push("");
      L.push("Trois hypothèses, donc, et non une seule : le comité existait déjà ; le");
      L.push("mandat restant à courir est inférieur à un an ; l'entreprise n'a pas de");
      L.push("comité. La note ci-dessous les distingue.");
      L.push("");

      L.push(GROS);
      L.push("NOTE D'EXIGIBILITÉ");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — LE RELEVÉ D'EFFECTIF, MOIS PAR MOIS");
      L.push("");
      L.push("Ce n'est pas l'effectif d'un jour qui compte, mais douze mois consécutifs");
      L.push("d'effectif au moins égal à cinquante. Le relevé se lit dans les");
      L.push("déclarations sociales déjà produites : il ne se reconstitue pas.");
      L.push("");
      L.push("  mois        │ effectif │ ≥ 50 ?   source : déclaration sociale nominative");
      L.push("  ────────────┼──────────┼───────   ou registre unique du personnel");
      var moisNoms = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
                      "août", "septembre", "octobre", "novembre", "décembre"];
      for (var m = 0; m < 12; m++)
        L.push("  [" + (moisNoms[m] + " " + "....").slice(0, 10) + "] │ [......] │ [ ]");
      L.push("");
      L.push("Effectif de l'entreprise à la date de la présente note : " +
        (r.connu ? r.effectif + " salariés." : "[EFFECTIF]."));
      L.push("");
      L.push("ARTICLE 2 — LA DATE D'ATTEINTE DU SEUIL");
      L.push("");
      if (estISO(d50)) {
        L.push("Votre dossier porte cette date : le seuil de cinquante salariés a été");
        L.push("atteint pendant douze mois consécutifs au " + jour(d50) + ".");
      } else {
        L.push("Votre dossier ne porte pas cette date : [DATE À LAQUELLE CINQUANTE");
        L.push("SALARIÉS ONT ÉTÉ ATTEINTS PENDANT DOUZE MOIS CONSÉCUTIFS]. C'est le");
        L.push("dernier mois de la série de douze, et non le premier.");
      }
      L.push("");
      L.push("ARTICLE 3 — LE TERME DU DÉLAI DE DOUZE MOIS");
      L.push("");
      if (terme) {
        L.push("Douze mois plus tard : le " + jour(terme) + ". À compter de ce jour, le");
        L.push("comité exerce l'ensemble des attributions récurrentes d'information et");
        L.push("de consultation — la base de données en fait partie.");
      } else {
        L.push("Douze mois après la date de l'article 2 : [DATE D'EXIGIBILITÉ]. À");
        L.push("compter de ce jour, le comité exerce l'ensemble des attributions");
        L.push("récurrentes — la base en fait partie.");
      }
      L.push("");
      L.push("ARTICLE 4 — LA RÉSERVE DU MANDAT INFÉRIEUR À UN AN");
      L.push("");
      L.push("Si, à l'expiration de ce délai de douze mois, le mandat du comité restant");
      L.push("à courir est inférieur à un an, le délai court à compter de son");
      L.push("RENOUVELLEMENT. C'est la seconde phrase de L. 2312-2, et elle est ce qui");
      L.push("fait dire une date fausse à qui ne la lit pas.");
      L.push("");
      L.push("Date de fin des mandats en cours : " +
        (estISO(fin) ? jour(fin) + " (portée par votre dossier)." : "[DATE DE FIN DES MANDATS]."));
      if (terme && estISO(fin)) {
        var mois12 = moisApres(terme, 12);
        L.push("Au terme du " + jour(terme) + ", le mandat restant à courir est " +
          (fin < mois12 ? "INFÉRIEUR À UN AN :" : "d'au moins un an :"));
        L.push(fin < mois12
          ? "  le délai court alors à compter du renouvellement du comité."
          : "  la première phrase de L. 2312-2 s'applique, sans report.");
      }
      L.push("Date de renouvellement du comité, si la réserve joue : " +
        (estISO(ren) ? jour(ren) + "." : "[DATE DE RENOUVELLEMENT]."));
      if (estISO(ren)) {
        L.push("Terme reporté correspondant : " + jour(moisApres(ren, 12)) + ".");
      }
      L.push("");
      L.push("ARTICLE 5 — L'HYPOTHÈSE DE L'ENTREPRISE SANS COMITÉ");
      L.push("");
      L.push("Si l'entreprise n'est pas pourvue d'un comité social et économique, le");
      L.push("délai n'est pas le même : le comité exerce l'ensemble des attributions à");
      L.push("l'expiration d'un délai d'UN AN À COMPTER DE SA MISE EN PLACE.");
      L.push("Date de mise en place du comité, le cas échéant : [DATE].");
      L.push("Terme correspondant : [DATE + un an].");
      L.push("");
      L.push("ARTICLE 6 — LA DATE RETENUE");
      L.push("");
      L.push("La date à compter de laquelle la base de données est due dans");
      L.push(nomDe(ctx) + " est le [DATE RETENUE], établie par [pièce].");
      L.push("C'est de cette date que se comptent tous les retards du dossier.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push("════ CE QUE CETTE DATE COMMANDE ENSUITE ════");
      L.push("");
      L.push("À compter d'elle, la base « rassemble l'ensemble des informations");
      L.push("nécessaires aux consultations et informations récurrentes que l'employeur");
      L.push("met à disposition du comité social et économique » (L. 2312-18), et « les");
      L.push("éléments d'information transmis de manière récurrente au comité sont mis");
      L.push("à la disposition de leurs membres dans la base de données et cette mise à");
      L.push("disposition actualisée vaut communication des rapports et informations au");
      L.push("comité, dans les conditions et limites fixées par un décret en Conseil");
      L.push("d'État » (même article). C'est ce bénéfice que perd l'employeur dont la");
      L.push("base n'existe pas, ou n'est pas actualisée.");
      L.push("");
      L.push("La grille due est celle du régime applicable : la note de régime");
      L.push("(BDESE-CTL-REG-01) l'établit, et la déploie.");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous ouvrez le relevé d'effectif mensuel."),
        ech(ctx, 7, "le relevé est complet et la date d'atteinte du seuil est arrêtée."),
        ech(ctx, 10, "le terme des douze mois est calculé, et la réserve du mandat"),
        "    inférieur à un an est vérifiée sur la date de fin des mandats.",
        ech(ctx, 14, "la note est signée et versée au dossier."),
        terme ? "  · " + leJour(dateDe(terme)) + " — terme calculé sur la date de votre dossier."
              : "  · [DATE + 12 mois] — terme, dès que la date de l'article 2 est établie.",
      ]));

      return L.concat(pied("L. 2312-2, L. 2312-18, L. 2312-21, L. 2312-36")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-DAT-02 — LE FRANCHISSEMENT DU SEUIL DE TROIS CENTS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-DAT-02", {
    nom: "La note de franchissement du seuil de trois cents salariés et son calendrier",
    detail: "La date de franchissement, l'année que L. 2312-34 laisse, le tableau " +
            "des rubriques que R. 2312-9 ajoute à R. 2312-8, et la grille complète " +
            "à monter.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx);
      var d300 = f.dateSeuil300Franchi;
      var limite = estISO(d300) ? moisApres(d300, 12) : null;
      var L = entete(ctx, "Note de franchissement du seuil de trois cents salariés",
        "article L. 2312-34 du code du travail");

      modeDEmploi(L, "la note qui date le franchissement du seuil et programme le passage à R. 2312-9");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Le seuil de trois cents salariés mentionné au présent chapitre est");
      L.push("réputé franchi lorsque l'effectif de l'entreprise dépasse ce seuil");
      L.push("pendant douze mois consécutifs. L'employeur dispose d'un délai d'un an à");
      L.push("compter du franchissement de ce seuil pour se conformer complètement aux");
      L.push("obligations d'information et de consultation du comité social et");
      L.push("économique qui en découlent » (L. 2312-34).");
      L.push("");
      L.push("Deux temps, donc, et l'on ne compte pas depuis le mois où l'effectif a");
      L.push("dépassé trois cents pour la première fois : douze mois consécutifs de");
      L.push("dépassement d'abord, puis un an pour se conformer complètement.");
      L.push("");
      L.push("SANS CETTE DATE, LE DÉLAI D'UN AN NE SE COMPTE PAS : l'entreprise le");
      L.push("dépasse sans le savoir, et son contenu reste celui d'une entreprise plus");
      L.push("petite.");
      L.push("");
      L.push("ET UNE RÉSERVE, QUI PRIME TOUT LE RESTE : si un accord de L. 2312-21");
      L.push("définit la base, c'est SA grille qui reste due, et le changement de seuil");
      L.push("ne la déplace pas. Vérifiez cela d'abord.");
      L.push("");
      L.push("  · accord d'entreprise déclaré : " + etat(f.accordEntreprise, "OUI", "non"));
      L.push("  · effectif déclaré : " + (r.connu ? r.effectif + " salariés" : "[EFFECTIF]"));
      L.push("");

      L.push(GROS);
      L.push("NOTE DE FRANCHISSEMENT ET CALENDRIER DE MISE EN CONFORMITÉ");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — LES DOUZE MOIS CONSÉCUTIFS DE DÉPASSEMENT");
      L.push("");
      L.push("  mois        │ effectif │ > 300 ?   source : déclaration sociale");
      L.push("  ────────────┼──────────┼────────   nominative, registre du personnel");
      for (var m = 0; m < 12; m++)
        L.push("  [.........] │ [......] │ [ ]");
      L.push("");
      L.push("Date à laquelle le seuil est réputé franchi — dernier mois de la série :");
      L.push(estISO(d300) ? "  " + jour(d300) + " (portée par votre dossier)." : "  [DATE DE FRANCHISSEMENT].");
      L.push("");
      L.push("ARTICLE 2 — LA DATE LIMITE DE MISE EN CONFORMITÉ COMPLÈTE");
      L.push("");
      L.push(limite
        ? "  Un an plus tard : le " + jour(limite) + "."
        : "  Un an après la date de l'article 1 : [DATE LIMITE].");
      L.push("");
      L.push("À cette date, la base doit porter le contenu de l'article R. 2312-9 en");
      L.push("entier — à défaut d'accord de L. 2312-21 qui en disposerait autrement.");
      L.push("");
      L.push("ARTICLE 3 — CE QUE R. 2312-9 AJOUTE À R. 2312-8");
      L.push("");
      L.push("Les deux articles ne se recouvrent pas. Le tableau ci-dessous relève, sur");
      L.push("le découpage des deux textes, les sections que l'article R. 2312-9 porte");
      L.push("et que l'article R. 2312-8 ne porte pas : ce sont elles qu'il faut monter");
      L.push("en plus, rubrique par rubrique.");
      L.push("");

      /* Le comparatif est CALCULÉ sur le découpage, non écrit à la main : le
         décret peut changer, et une liste recopiée dériverait en silence. */
      var petite = ARBRE["R. 2312-8"], grande = ARBRE["R. 2312-9"];
      var nAjouts = 0;
      for (var i = 0; i < grande.rubriques.length; i++) {
        var rg = grande.rubriques[i];
        var rp = null;
        for (var q = 0; q < petite.rubriques.length; q++)
          if (petite.rubriques[q].n === rg.n) rp = petite.rubriques[q];
        var titresPetits = [];
        if (rp) for (var s1 = 0; s1 < rp.sections.length; s1++)
          titresPetits.push(String(rp.sections[s1].titre || "").toLowerCase());
        var nouvelles = [];
        for (var s2 = 0; s2 < rg.sections.length; s2++) {
          var t = String(rg.sections[s2].titre || "");
          var vu = false;
          for (var z = 0; z < titresPetits.length; z++)
            if (titresPetits[z].indexOf(t.toLowerCase().slice(0, 22)) >= 0 ||
                t.toLowerCase().indexOf(titresPetits[z].slice(0, 22)) >= 0) vu = true;
          if (!vu) nouvelles.push(rg.sections[s2]);
        }
        if (!nouvelles.length) continue;
        nAjouts += nouvelles.length;
        L.push("  " + rg.n + "° " + rg.titre);
        for (var s3 = 0; s3 < nouvelles.length; s3++) {
          pousserPlie(L, (nouvelles[s3].lettre ? nouvelles[s3].lettre + " — " : "") +
            nouvelles[s3].titre, 60, "      + ", "        ");
          L.push("        service : [..............]   échéance : [..............]");
        }
        L.push("");
      }
      if (!nAjouts) {
        L.push("  [Le découpage ne relève aucune section propre à R. 2312-9 : reportez-");
        L.push("   vous à la grille complète ci-dessous.]");
        L.push("");
      }
      L.push("Et le renvoi qu'on oublie : R. 2312-9 « comporte également les");
      L.push("informations relatives à la formation professionnelle et aux conditions");
      L.push("de travail prévues au 1° A, e et f de l'article R. 2312-8 ». Ces deux");
      L.push("sujets sont portés dans la grille ci-dessous, à leur place, avec la");
      L.push("marque de leur origine.");
      L.push("");
      L.push("ARTICLE 4 — L'ÉTALEMENT SUR L'ANNÉE");
      L.push("");
      L.push("Le complètement s'étale sur l'année que L. 2312-34 laisse, de sorte que");
      L.push("la base soit complète à la date limite de l'article 2. Reportez ci-dessus");
      L.push("l'échéance de chaque section, et commencez par celles qui alimentent la");
      L.push("prochaine consultation récurrente.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(blocAnnees(ctx));
      L = L.concat(blocGrille(ctx, "R. 2312-9"));

      L = L.concat(courrierMAD(ctx,
        "franchissement du seuil de trois cents salariés et complètement de la base",
        ["Je vous informe que l'effectif de l'entreprise a dépassé trois cents",
         "salariés pendant douze mois consécutifs : le seuil est réputé franchi au",
         (estISO(d300) ? jour(d300) : "[DATE]") + ", au sens de l'article L. 2312-34 du code du travail.",
         "",
         "Le contenu de la base de données est en conséquence porté à celui de",
         "l'article R. 2312-9. Le complètement est engagé et sera achevé au plus tard",
         "le " + (limite ? jour(limite) : "[DATE LIMITE]") + ", terme du délai d'un an que ce même article",
         "laisse à l'employeur pour se conformer complètement.",
         "",
         "Chaque rubrique ajoutée vous sera signalée à mesure : c'est cette",
         "information qui fait courir le délai de consultation (R. 2312-5)."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous ouvrez le relevé d'effectif mensuel et le comparatif."),
        ech(ctx, 14, "la date de franchissement est arrêtée et la date limite calculée."),
        ech(ctx, 30, "chaque section ajoutée par R. 2312-9 a son service et son échéance."),
        ech(ctx, 90, "les sections nouvelles sont montées ; le renseignement sur les six"),
        "    années commence.",
        limite ? "  · " + leJour(dateDe(limite)) + " — DATE LIMITE de mise en conformité complète (L. 2312-34)."
               : "  · [DATE DE FRANCHISSEMENT + un an] — date limite de mise en conformité.",
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-34, L. 2312-36, R. 2312-5, " +
        "R. 2312-8, R. 2312-9, R. 2312-10, R. 2312-12")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CNT-01 — LES THÈMES DU PLANCHER
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CNT-01", {
    nom: "La grille du plancher légal — les dix thèmes que l'accord ne peut pas descendre",
    detail: "Les dix thèmes de L. 2312-21, alinéa 3, un par un, avec l'intitulé " +
            "du décret qui les porte, la pièce qui les alimente, le service " +
            "responsable et les six années.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx), a = anneesDe(ctx);
      var L = entete(ctx, "Grille de la base — thèmes du plancher légal",
        "article L. 2312-21, alinéa 3, du code du travail");

      modeDEmploi(L, "la grille des dix thèmes que votre base doit comporter en toute hypothèse");

      L.push("POURQUOI CE PLANCHER S'IMPOSE MÊME À UN ACCORD");
      L.push("");
      L.push("Le troisième alinéa de L. 2312-21 dit que « la base de données comporte");
      L.push("AU MOINS les thèmes suivants ». Ce plancher s'impose à tout accord, et un");
      L.push("accord qui retire l'un de ces thèmes est, sur ce point, sans effet.");
      L.push("");
      L.push("Une base amputée ne rassemble pas l'ensemble des informations nécessaires");
      L.push("aux consultations récurrentes que L. 2312-18 lui fait porter : la");
      L.push("consultation qui s'en réclame peut être jugée irrégulière, et le délai de");
      L.push("R. 2312-5 ne court pas sur ce qui n'a pas été mis à disposition.");
      L.push("");
      L.push("LE THÈME LE PLUS SOUVENT ABSENT est le dixième — les conséquences");
      L.push("environnementales de l'activité de l'entreprise. Regardez-le en premier.");
      L.push("");

      L = L.concat(blocRegime(ctx, r));
      L = L.concat(blocPlancher(ctx));

      L.push(GROS);
      L.push("LA GRILLE DU PLANCHER, THÈME PAR THÈME");
      L.push(GROS);
      L.push("");
      L.push("Six colonnes par thème : " + enteteAnnees(a) + ".");
      L.push("");
      var RUB = { 0: 1, 1: 1, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 10 };
      for (var i = 0; i < CORRESPONDANCE.length; i++) {
        var n = RUB[i];
        L.push(TRAIT);
        pousserPlie(L, "THÈME " + (i + 1) + " — " + CORRESPONDANCE[i][0].toUpperCase(),
          64, "", "  ");
        L.push("");
        pousserPlie(L, "Où il se trouve dans le décret : " + CORRESPONDANCE[i][1],
          64, "", "  ");
        L.push("");
        pousserPlie(L, "Où chercher la donnée : " + (SOURCES[n] || "[à déterminer]"),
          64, "", "  ");
        L.push("");
        L.push("  emplacement dans votre base (onglet, page) : [..................]");
        L.push("  service qui détient la donnée : [..................................]");
        L.push("  date à laquelle il la fournit : [..................................]");
        L.push("  date de la dernière mise à jour de ce thème : [....................]");
        L.push("");
        L.push("  " + a.passees[0] + " : [........]   " + a.passees[1] + " : [........]   " +
          a.courante + " : [........]");
        L.push("  " + a.suivantes[0] + " : [........]   " + a.suivantes[1] + " : [........]   " +
          a.suivantes[2] + " : [........]");
        L.push("  (les trois années suivantes : chiffres ou grandes tendances)");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");
      L.push("CE QUE LE PLANCHER NE PORTE PAS, ET QUE LE DÉCRET IMPOSE POURTANT");
      L.push("");
      L.push("Deux rubriques du décret ne figurent pas au plancher : le 8°");
      L.push("« Partenariats » et le 9° « Pour les entreprises appartenant à un groupe,");
      L.push("transferts commerciaux et financiers entre les entités du groupe ». Un");
      L.push("accord peut donc les supprimer ; à défaut d'accord, le décret les impose.");
      L.push("");
      L.push("  8° Partenariats — présent : [OUI / NON]   " +
        (estOui(f.accordEntreprise) || estOui(f.accordBranche)
          ? "un accord est déclaré : vérifiez ce qu'il en dit."
          : "aucun accord : la rubrique est due."));
      L.push("  9° Transferts intragroupe — présent : [OUI / NON]   " +
        cro(P(ctx).groupe, "appartenance à un groupe non renseignée"));
      L.push("");

      L = L.concat(blocAnnees(ctx));
      L = L.concat(blocGrilleDuRegime(ctx, r));

      L = L.concat(courrierMAD(ctx,
        "complètement de la base de données — thèmes du plancher légal",
        ["Je vous informe que la base de données économiques, sociales et",
         "environnementales de l'entreprise a été complétée des thèmes que le",
         "troisième alinéa de l'article L. 2312-21 du code du travail impose en toute",
         "hypothèse.",
         "",
         "Thèmes ajoutés : [.................................................].",
         "Date de la mise à jour : " + leJour(aujourd(ctx)) + ".",
         "Emplacement dans la base : [......................................].",
         "",
         "Cette information vaut information de la mise à disposition au sens de",
         "l'article R. 2312-5 : c'est d'elle que court le délai de consultation."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous pointez les dix thèmes du plancher sur votre base réelle,"),
        "    et non sur le sommaire de l'outil qui la porte.",
        ech(ctx, 7, "chaque thème absent a son service responsable et sa date de"),
        "    fourniture.",
        ech(ctx, 45, "les thèmes manquants sont montés et renseignés sur les six"),
        "    années dues.",
        ech(ctx, 46, "vous informez les bénéficiaires — sans cette information, le"),
        "    délai de consultation ne court pas (R. 2312-5).",
        ech(ctx, 60, "vous relancez l'audit."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-5, R. 2312-7, " +
        "R. 2312-8, R. 2312-9, R. 2312-10")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CNT-02 — LA GRILLE DU CONTENU SUPPLÉTIF

     C'est ici que tout se joue : la grille du décret déployée en entier, et non
     un renvoi à l'article. Une note qui écrirait « reportez-vous à R. 2312-9 »
     rendrait à l'employeur le problème qu'il avait.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CNT-02", {
    nom: "La grille du contenu supplétif — le décret déployé, rubrique par rubrique",
    detail: "L'article R. 2312-8 ou R. 2312-9 selon l'effectif — les deux si " +
            "l'effectif n'est pas connu — déployé rubrique par rubrique, sujet " +
            "par sujet, avec les six années, la source de la donnée et le " +
            "service responsable.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx), a = anneesDe(ctx);
      var b = B(ctx);
      var L = entete(ctx, "Grille du contenu supplétif de la base de données",
        "articles R. 2312-8 et R. 2312-9 du code du travail");

      modeDEmploi(L, "la grille complète du contenu que le décret impose à votre base");

      L.push("CE QUE CE DOCUMENT EST, ET POURQUOI IL EST LONG");
      L.push("");
      L.push("En l'absence d'accord, c'est le décret qui fixe le contenu de la base, et");
      L.push("les rubriques qu'il énumère sont dues. Le texte fait onze mille");
      L.push("caractères pour R. 2312-8 et trente et un mille huit cents pour");
      L.push("R. 2312-9 : le résumer, c'est le trahir, et renvoyer à l'article, c'est");
      L.push("laisser l'employeur devant la page blanche qu'il avait déjà.");
      L.push("");
      L.push("La grille ci-dessous est donc DÉPLOYÉE. Chaque libellé est celui du");
      L.push("décret, mot pour mot — il est repris du découpage que le module opère sur");
      L.push("le texte capté, dont la couverture est mesurée à cent pour cent et dont");
      L.push("chaque libellé est vérifié comme se retrouvant dans le texte.");
      L.push("");
      L.push("CE QU'UNE RUBRIQUE ABSENTE COÛTE");
      L.push("");
      L.push("Elle prive le comité d'une information que L. 2312-18 range parmi celles");
      L.push("nécessaires à ses consultations récurrentes : la consultation peut être");
      L.push("jugée irrégulière, et l'avis n'être pas valablement rendu. Et");
      L.push("l'article R. 2312-7 ajoute que « l'ensemble des informations de la base de");
      L.push("données contribue à donner une vision claire et globale de la formation et");
      L.push("de la répartition de la valeur créée par l'activité de l'entreprise » —");
      L.push("une grille trouée ne la donne pas.");
      L.push("");
      L.push("R. 2312-7 ajoute encore que la base « comporte également les indicateurs");
      L.push("relatifs aux écarts de rémunération entre les femmes et les hommes et aux");
      L.push("actions mises en œuvre pour les supprimer mentionnés à l'article");
      L.push("L. 1142-8 ainsi que, pour les entreprises mentionnées au premier alinéa de");
      L.push("l'article L. 1142-11, les écarts de répartition entre les femmes et les");
      L.push("hommes parmi les cadres dirigeants définis à l'article L. 3111-2 et les");
      L.push("membres des instances dirigeantes définies à l'article L. 23-12-1 du code");
      L.push("de commerce ». Ces quatre articles sont NOMMÉS par le texte lu, ils n'ont");
      L.push("pas été lus eux-mêmes par ce module : leur contenu n'est pas reproduit");
      L.push("ici, et il faut s'y reporter pour savoir ce que ces indicateurs portent.");
      L.push("");

      L = L.concat(blocRegime(ctx, r));

      L.push("CE QUE VOTRE DOSSIER DÉCLARE SUR LE CONTENU");
      L.push("");
      var themes = (b.themes || []);
      if (themes.length) {
        L.push("Rubriques déclarées renseignées : " + themes.length + ".");
        for (var i = 0; i < themes.length; i++) {
          var t = themes[i];
          pousserPlie(L, String(t && t.theme ? t.theme : t) +
            (t && t.renseigne ? " — renseignée : " + t.renseigne : ""), 66, "  · ", "    ");
        }
      } else {
        L.push("Aucune rubrique n'est déclarée dans le dossier : la comparaison se fait");
        L.push("donc à la main, sur la grille ci-dessous.");
      }
      L.push("");
      L.push("Années couvertes déclarées : " +
        (b.anneesPassees != null && b.anneesPassees !== "" ? b.anneesPassees : "[?]") +
        " année(s) passée(s), " +
        (b.anneesSuivantes != null && b.anneesSuivantes !== "" ? b.anneesSuivantes : "[?]") +
        " suivante(s). Le décret en impose deux et trois.");
      L.push("");

      L = L.concat(blocAnnees(ctx));

      L.push(GROS);
      L.push("COMMENT REMPLIR CETTE GRILLE");
      L.push(GROS);
      L.push("");
      L.push("Pour chaque sujet, quatre choses, et dans cet ordre :");
      L.push("");
      L.push("  1. LE SERVICE QUI DÉTIENT LA DONNÉE. Sans lui, la grille se vide au");
      L.push("     premier exercice : personne n'est chargé de la remplir.");
      L.push("  2. LA DATE À LAQUELLE IL LA FOURNIT. Une échéance, pas une intention.");
      L.push("  3. LES SIX ANNÉES — " + enteteAnnees(a) + ".");
      L.push("     Les trois dernières en chiffres ou en grandes tendances.");
      L.push("  4. LE CAS ÉCHÉANT, LA MENTION « ne peut faire l'objet ni de données");
      L.push("     chiffrées ni de grandes tendances », AVEC SA RAISON. C'est ce que");
      L.push("     R. 2312-10 exige, et c'est la mention qu'on oublie.");
      L.push("");
      L.push("Les informations confidentielles sont présentées comme telles, avec la");
      L.push("durée de leur confidentialité (R. 2312-13) : c'est cette présentation qui");
      L.push("déclenche l'obligation de discrétion du dernier alinéa de L. 2312-36.");
      L.push("");

      L = L.concat(blocGrilleDuRegime(ctx, r));

      L.push(GROS);
      L.push("LE TABLEAU DES RESPONSABLES");
      L.push(GROS);
      L.push("");
      L.push("  rubrique                      │ service │ échéance │ dernière mise à jour");
      L.push("  ──────────────────────────────┼─────────┼──────────┼─────────────────────");
      var arbreRef = ARBRE[r.articles[r.articles.length - 1]];
      for (var k = 0; k < arbreRef.rubriques.length; k++) {
        var rub = arbreRef.rubriques[k];
        var lib = rub.n + "° " + rub.titre;
        if (lib.length > 29) lib = lib.slice(0, 28) + "…";
        while (lib.length < 29) lib += " ";
        L.push("  " + lib + " │ [.....] │ [......] │ [...................]");
      }
      L.push("");

      L = L.concat(courrierMAD(ctx,
        "mise à disposition de la base de données complétée",
        ["Je vous informe que la base de données économiques, sociales et",
         "environnementales de l'entreprise a été complétée des rubriques prévues par",
         "l'article " + (r.connu ? r.article : "R. 2312-8 ou R. 2312-9") + " du code du travail.",
         "",
         "Rubriques ajoutées ou complétées : [...............................].",
         "Date de la mise à jour : " + leJour(aujourd(ctx)) + ".",
         "Support et emplacement : [........................................].",
         "",
         "L'article L. 2312-18 dispose que les éléments d'information transmis de",
         "manière récurrente au comité sont mis à la disposition de leurs membres dans",
         "la base de données et que cette mise à disposition actualisée vaut",
         "communication des rapports et informations au comité, dans les conditions et",
         "limites fixées par un décret en Conseil d'État.",
         "",
         "La présente information vaut information de la mise à disposition au sens de",
         "l'article R. 2312-5 : c'est d'elle que court le délai de consultation."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous vérifiez d'abord qu'aucun accord de L. 2312-21 ne définit la"),
        "    base : le contenu du décret n'est dû qu'en son absence.",
        ech(ctx, 7, "l'article applicable est arrêté par l'effectif, et la grille"),
        "    ci-dessus est celle qu'il faut monter.",
        ech(ctx, 21, "chaque rubrique a son service et son échéance."),
        ech(ctx, 90, "les rubriques sont renseignées sur les deux années passées et"),
        "    l'année en cours.",
        ech(ctx, 120, "les trois années suivantes sont renseignées, en chiffres ou en"),
        "    grandes tendances, et la liste motivée des informations qui ne peuvent",
        "    recevoir ni l'un ni l'autre figure dans la base.",
        ech(ctx, 121, "vous informez les bénéficiaires et conservez la preuve d'envoi."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-5, R. 2312-7, " +
        "R. 2312-8, R. 2312-9, R. 2312-10, R. 2312-12, R. 2312-13",
        ["Les articles L. 1142-8, L. 1142-11, L. 3111-2 et L. 23-12-1 du code de",
         "commerce, que R. 2312-7 et L. 2312-18 nomment, n'ont pas été lus à la source",
         "par ce module : leur contenu n'est pas reproduit.",
         "Les articles cités À L'INTÉRIEUR des tableaux du décret — L. 5212-5,",
         "D. 5212-4, L. 2241-6, L. 6361-1 et les autres — le sont par le texte du",
         "décret lui-même, reproduit ici mot pour mot ; ils ne sont pas davantage",
         "développés."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CNT-03 — LES SIX ANNÉES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CNT-03", {
    nom: "Le tableau des six années — deux exercices passés, l'année en cours, trois à venir",
    detail: "Les six millésimes calculés, la matrice rubrique par rubrique et " +
            "année par année, la source de chaque exercice passé et la forme " +
            "admise pour les exercices à venir.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx), a = anneesDe(ctx), b = B(ctx);
      var L = entete(ctx, "Tableau des six années couvertes par la base",
        "articles L. 2312-36 et R. 2312-10 du code du travail");

      modeDEmploi(L, "le tableau des six années sur lesquelles chaque rubrique se remplit");

      L.push("LA LOI LE DIT DÉJÀ, LE DÉCRET LE PRÉCISE");
      L.push("");
      L.push("L. 2312-36 : « Ces informations portent sur les deux années précédentes");
      L.push("et l'année en cours et intègrent des perspectives sur les trois années");
      L.push("suivantes. »");
      L.push("");
      L.push("R. 2312-10 : « En l'absence d'accord prévu à l'article L. 2312-21, les");
      L.push("informations figurant dans la base de données portent sur l'année en");
      L.push("cours, sur les deux années précédentes et, telles qu'elles peuvent être");
      L.push("envisagées, sur les trois années suivantes. »");
      L.push("");
      L.push("Une base qui ne présente qu'un exercice ne montre ni l'évolution passée");
      L.push("ni la trajectoire : le comité n'est pas mis en état d'exercer utilement");
      L.push("ses compétences, ce que L. 2312-21 exige de l'organisation et du contenu");
      L.push("de la base.");
      L.push("");
      L.push("ET LA RÉSERVE : R. 2312-10 ne vaut qu'en l'absence d'accord. Un accord de");
      L.push("L. 2312-21 peut retenir une autre profondeur — vérifiez-le avant d'ouvrir");
      L.push("six colonnes.");
      L.push("  · accord d'entreprise déclaré : " + etat(f.accordEntreprise, "OUI", "non"));
      L.push("  · accord de branche déclaré : " + etat(f.accordBranche, "OUI", "non"));
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · années passées couvertes : " +
        (b.anneesPassees != null && b.anneesPassees !== "" ? b.anneesPassees : "[non renseigné]") +
        " — le décret en impose deux.");
      L.push("  · années suivantes couvertes : " +
        (b.anneesSuivantes != null && b.anneesSuivantes !== "" ? b.anneesSuivantes : "[non renseigné]") +
        " — le décret en impose trois.");
      L.push("  · forme des perspectives : " +
        (vide(b.formePerspectives) ? "[non renseignée]" : String(b.formePerspectives)));
      L.push("");

      L = L.concat(blocAnnees(ctx));

      L.push(GROS);
      L.push("OÙ RETROUVER CHAQUE EXERCICE");
      L.push(GROS);
      L.push("");
      L.push("Les deux années passées NE SE RECALCULENT PAS. Elles se retrouvent dans");
      L.push("les documents déjà produits — c'est plus rapide et c'est plus sûr :");
      L.push("");
      L.push("  · " + a.passees[0] + " et " + a.passees[1] + " — comptes annuels et annexe, liasse fiscale,");
      L.push("    déclarations sociales nominatives, bilans et rapports antérieurs,");
      L.push("    versions précédentes de la base elle-même si elles ont été");
      L.push("    conservées.");
      L.push("  · " + a.courante + " — les mêmes sources, arrêtées à la dernière période close, et");
      L.push("    la mention de la date d'arrêté.");
      L.push("  · " + a.suivantes.join(", ") + " — budget, plan d'affaires, plan de charge, plan de");
      L.push("    développement des compétences, trajectoire d'investissement. À défaut");
      L.push("    de chiffres, DES GRANDES TENDANCES SUFFISENT : le décret les admet");
      L.push("    expressément pour ces années.");
      L.push("");

      L.push(GROS);
      L.push("LA MATRICE — RUBRIQUE PAR RUBRIQUE, ANNÉE PAR ANNÉE");
      L.push(GROS);
      L.push("");
      for (var w = 0; w < r.articles.length; w++) {
        var arbre = ARBRE[r.articles[w]];
        L.push("Article " + arbre.article + " — " + arbre.seuil + " (version " + arbre.version + ")");
        L.push("");
        for (var i = 0; i < arbre.rubriques.length; i++) {
          var rub = arbre.rubriques[i];
          pousserPlie(L, rub.n + "° " + rub.titre, 66, "  ", "     ");
          L.push("     " + a.passees[0] + " [ ]   " + a.passees[1] + " [ ]   " + a.courante + " [ ]   " +
            a.suivantes[0] + " [ ]   " + a.suivantes[1] + " [ ]   " + a.suivantes[2] + " [ ]");
          L.push("     forme des trois dernières : [chiffres / grandes tendances]");
          L.push("     source des années passées : [...........................]");
          L.push("");
        }
        L.push(TRAIT);
        L.push("");
      }

      L.push("UNE COLONNE VIDE SE VOIT. C'est l'intérêt de cocher : le pointage");
      L.push("rubrique par rubrique montre en une page ce qu'un sommaire cache.");
      L.push("");

      L = L.concat(courrierMAD(ctx,
        "extension de la base aux six années dues",
        ["Je vous informe que la base de données économiques, sociales et",
         "environnementales a été étendue aux six années que les articles L. 2312-36",
         "et R. 2312-10 du code du travail imposent : les deux années précédentes",
         "(" + a.passees.join(" et ") + "), l'année en cours (" + a.courante + ") et les trois années",
         "suivantes (" + a.suivantes.join(", ") + ").",
         "",
         "Les trois années suivantes sont présentées [en données chiffrées / sous",
         "forme de grandes tendances, ce que l'article R. 2312-10 admet expressément].",
         "",
         "Date de la mise à jour : " + leJour(aujourd(ctx)) + "."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous vérifiez qu'aucun accord ne fixe lui-même les années couvertes."),
        ech(ctx, 7, "les six colonnes sont ouvertes pour chaque rubrique."),
        ech(ctx, 30, "les deux années passées sont reprises dans les documents déjà"),
        "    produits — elles ne se reconstituent pas.",
        ech(ctx, 45, "l'année en cours est arrêtée à la dernière période close."),
        ech(ctx, 60, "les trois années suivantes sont renseignées, en chiffres ou en"),
        "    grandes tendances.",
        ech(ctx, 61, "vous datez la mise à jour et informez les bénéficiaires."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-5, R. 2312-8, " +
        "R. 2312-9, R. 2312-10")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CNT-04 — LES PERSPECTIVES ET LEURS MANQUES MOTIVÉS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CNT-04", {
    nom: "La note sur les perspectives — forme retenue et informations non renseignables",
    detail: "La forme des trois années à venir rubrique par rubrique, et la liste " +
            "motivée — à porter DANS la base — des informations qui ne peuvent " +
            "recevoir ni chiffres ni tendances.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx), a = anneesDe(ctx), b = B(ctx);
      var non = liste(b.informationsNonRenseignables);
      var L = entete(ctx, "Note sur les perspectives — les trois années suivantes",
        "article R. 2312-10 du code du travail");

      modeDEmploi(L, "la note qui arrête la forme des trois années à venir et motive ce qui ne peut pas être renseigné");

      L.push("L'OBLIGATION QU'ON OUBLIE");
      L.push("");
      L.push("R. 2312-10 admet les grandes tendances — c'est une facilité, et il faut");
      L.push("s'en servir. Mais il ajoute une obligation dans la même phrase :");
      L.push("");
      L.push("« L'employeur indique, pour ces années, les informations qui, eu égard à");
      L.push("leur nature ou aux circonstances, ne peuvent pas faire l'objet de données");
      L.push("chiffrées ou de grandes tendances, pour les raisons qu'il précise. »");
      L.push("");
      L.push("Une case laissée vide sans cette explication ne se distingue pas d'une");
      L.push("information manquante, et le comité peut soutenir qu'il n'a pas été mis");
      L.push("en état d'exercer utilement ses compétences (L. 2312-21).");
      L.push("");
      L.push("ET L'EMPLACEMENT COMPTE : cette liste motivée figure DANS LA BASE, non");
      L.push("dans un document conservé à part. C'est là que le comité la lit, et c'est");
      L.push("là que le décret la place.");
      L.push("");
      L.push("LA RÉSERVE : R. 2312-10 ne vaut qu'en l'absence d'accord de L. 2312-21.");
      L.push("  · accord d'entreprise déclaré : " + etat(f.accordEntreprise, "OUI", "non"));
      L.push("  · accord de branche déclaré : " + etat(f.accordBranche, "OUI", "non"));
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · forme des perspectives : " +
        (vide(b.formePerspectives) ? "[NON RENSEIGNÉE]" : String(b.formePerspectives)));
      L.push("  · informations non renseignables déclarées : " +
        (non.length ? non.length : "AUCUNE — soit tout est renseignable et il faut pouvoir le dire, soit la liste manque"));
      if (non.length) {
        L.push("");
        for (var i = 0; i < non.length; i++) pousserPlie(L, non[i], 66, "    – ", "      ");
      }
      L.push("");

      L.push(GROS);
      L.push("NOTE SUR LES PERSPECTIVES — À INSÉRER DANS LA BASE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("Années concernées : " + a.suivantes.join(", ") + ".");
      L.push("");
      L.push("ARTICLE 1 — LA FORME RETENUE, RUBRIQUE PAR RUBRIQUE");
      L.push("");
      L.push("Données chiffrées lorsque le chiffre a un sens ; grandes tendances");
      L.push("lorsqu'il n'en a pas. Les deux formes sont admises, et la seconde n'est");
      L.push("pas un pis-aller : c'est le texte.");
      L.push("");
      var arbre = ARBRE[r.articles[r.articles.length - 1]];
      for (var k = 0; k < arbre.rubriques.length; k++) {
        var rub = arbre.rubriques[k];
        pousserPlie(L, rub.n + "° " + rub.titre, 64, "  ", "     ");
        L.push("     forme retenue : [données chiffrées / grandes tendances / les deux");
        L.push("     selon les sujets]");
        L.push("     source de la projection : [budget / plan d'affaires / plan de");
        L.push("     charge / plan de développement des compétences / ...............]");
        L.push("");
      }
      L.push("ARTICLE 2 — LES INFORMATIONS QUI NE PEUVENT RECEVOIR NI CHIFFRES NI");
      L.push("TENDANCES, ET LES RAISONS QUE L'EMPLOYEUR EN DONNE");
      L.push("");
      L.push("Une ligne par information. La raison tient à la nature de l'information");
      L.push("ou aux circonstances — ce sont les deux motifs que le texte retient. Le");
      L.push("décret exige LES RAISONS, non le seul constat : « ne peut pas être");
      L.push("renseigné » n'est pas une raison.");
      L.push("");
      L.push("  information concernée                  │ année(s) │ raison");
      L.push("  ───────────────────────────────────────┼──────────┼──────────────────");
      if (non.length) {
        for (var j = 0; j < non.length; j++) {
          var lib = non[j];
          if (lib.length > 38) lib = lib.slice(0, 37) + "…";
          while (lib.length < 38) lib += " ";
          L.push("  " + lib + " │ [......] │ [................]");
        }
      }
      for (var z = 0; z < 8; z++)
        L.push("  [....................................] │ [......] │ [................]");
      L.push("");
      L.push("ARTICLE 3 — OÙ CETTE LISTE FIGURE");
      L.push("");
      L.push("Emplacement dans la base : [onglet / page ........................].");
      L.push("Date d'insertion : " + leJour(aujourd(ctx)) + ".");
      L.push("");
      L.push("Une note conservée à part ne vaut pas mention dans la base.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(blocAnnees(ctx));

      L = L.concat(courrierMAD(ctx,
        "perspectives des trois années suivantes — forme retenue et informations non renseignables",
        ["Je vous informe que la base de données a été complétée des perspectives sur",
         "les trois années suivantes (" + a.suivantes.join(", ") + "), présentées [en données",
         "chiffrées / sous forme de grandes tendances selon les rubriques].",
         "",
         "Conformément au dernier alinéa de l'article R. 2312-10 du code du travail,",
         "la base indique désormais, pour ces années, les informations qui ne peuvent",
         "pas faire l'objet de données chiffrées ou de grandes tendances, avec les",
         "raisons qui l'expliquent. Cette liste figure [emplacement dans la base].",
         "",
         "Date de la mise à jour : " + leJour(aujourd(ctx)) + "."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous arrêtez, rubrique par rubrique, la forme des trois années"),
        "    suivantes.",
        ech(ctx, 7, "vous relevez les informations qui ne peuvent recevoir ni chiffres"),
        "    ni tendances, et écrivez pour chacune la raison.",
        ech(ctx, 14, "la liste motivée est insérée DANS la base, à l'endroit où le"),
        "    comité la lit.",
        ech(ctx, 15, "vous datez la mise à jour et informez les bénéficiaires."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-5, R. 2312-10")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-MAD-01 — LES ACCÈS, LE SUPPORT, LES MODALITÉS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-MAD-01", {
    nom: "La décision d'organisation de la base — support, accès, modalités, et le courrier de mise à disposition",
    detail: "La décision unilatérale qui fixe le support, les droits d'accès et " +
            "les modalités de consultation et d'utilisation ; la liste nominative " +
            "des bénéficiaires ; le courrier aux élus et aux délégués syndicaux.",
    produire: function (ctx) {
      var f = F(ctx), b = B(ctx), r = regimeDe(ctx);
      var benef = liste(b.beneficiaires);
      var L = entete(ctx, "Organisation de la base — support, droits d'accès et modalités",
        "articles L. 2312-18, L. 2312-36 et R. 2312-12 du code du travail");

      modeDEmploi(L, "la décision qui organise l'accès à votre base, et le courrier qui l'ouvre");

      L.push("QUI DOIT POUVOIR ENTRER, ET QUAND");
      L.push("");
      L.push("L. 2312-18 met la base à la disposition du comité social et économique.");
      L.push("L. 2312-36 précise qui y accède, et le mot qui compte est « en");
      L.push("permanence » : « La base de données est accessible EN PERMANENCE aux");
      L.push("membres de la délégation du personnel du comité social et économique ainsi");
      L.push("qu'aux membres de la délégation du personnel du comité social et");
      L.push("économique central d'entreprise, et aux délégués syndicaux. »");
      L.push("");
      L.push("Un accord peut ORGANISER les droits d'accès — L. 2312-21, 2°, range");
      L.push("expressément parmi ce qu'il définit « les droits d'accès et le niveau de");
      L.push("mise en place de la base dans les entreprises comportant des");
      L.push("établissements distincts, son support, ses modalités de consultation et");
      L.push("d'utilisation ». Il ne peut pas les SUPPRIMER. Une base qu'une catégorie");
      L.push("de bénéficiaires n'atteint pas n'est pas mise à sa disposition, et la");
      L.push("consultation qui s'en réclame est contestable.");
      L.push("");
      L.push("ET L'ACCÈS EST PERMANENT, NON PONCTUEL : ouvrir la base la veille d'une");
      L.push("réunion et la refermer le lendemain n'est pas la rendre accessible en");
      L.push("permanence.");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · support : " + (vide(b.support) ? "[NON RENSEIGNÉ]" : String(b.support)));
      L.push("  · bénéficiaires déclarés : " + (benef.length ? "" : "[NON RENSEIGNÉS]"));
      for (var i = 0; i < benef.length; i++) pousserPlie(L, benef[i], 66, "      – ", "        ");
      L.push("  · trace d'accès : " + (vide(b.preuveAcces) ? "[NON RENSEIGNÉE]" : String(b.preuveAcces)));
      L.push("  · effectif : " + (r.connu ? r.effectif + " salariés" : "[EFFECTIF non renseigné]"));
      L.push("");

      L.push(GROS);
      L.push("DÉCISION D'ORGANISATION DE LA BASE DE DONNÉES");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("À adapter si un accord de L. 2312-21 organise déjà ces points : c'est");
      L.push("alors l'accord qui commande, et cette décision ne fait que rappeler ce");
      L.push("qu'il stipule. En l'absence d'accord, l'article R. 2312-12 laisse ces");
      L.push("modalités à l'employeur — mais il les lui fait FIXER : elles ne peuvent");
      L.push("pas rester implicites.");
      L.push("");
      L.push("ARTICLE 1 — LE SUPPORT");
      L.push("");
      L.push("« En l'absence d'accord prévu à l'article L. 2312-21, la base de données");
      L.push("est tenue à la disposition des personnes mentionnées au dernier alinéa de");
      L.push("l'article L. 2312-36 sur un support informatique pour les entreprises");
      L.push("d'au moins trois cents salariés, et sur un support informatique ou papier");
      L.push("pour les entreprises de moins de trois cents salariés » (R. 2312-12).");
      L.push("");
      if (r.connu && r.effectif >= 300) {
        L.push("L'entreprise comptant " + r.effectif + " salariés, LE SUPPORT INFORMATIQUE EST");
        L.push("IMPOSÉ à défaut d'accord. Le papier ne suffit pas.");
      } else if (r.connu) {
        L.push("L'entreprise comptant " + r.effectif + " salariés, le support informatique OU papier");
        L.push("est admis à défaut d'accord. Le support informatique reste le seul qui");
        L.push("produise, de lui-même, la trace d'accès dont l'employeur aura besoin.");
      } else {
        L.push("Votre effectif n'est pas renseigné : à partir de trois cents salariés le");
        L.push("support informatique est imposé, en dessous l'informatique ou le papier");
        L.push("sont admis. Tranchez sur votre effectif réel.");
      }
      L.push("");
      L.push("Support retenu : [espace informatique dédié / intranet / classeur papier");
      L.push("tenu à ..............................].");
      L.push("Adresse ou lieu de consultation : [.................................].");
      L.push("Date de mise en service : [..............].");
      L.push("");
      L.push("ARTICLE 2 — LA LISTE NOMINATIVE DES PERSONNES AYANT ACCÈS");
      L.push("");
      L.push("  nom et prénom          │ qualité                    │ accès ouvert le");
      L.push("  ───────────────────────┼────────────────────────────┼────────────────");
      L.push("  [.....................] │ membre titulaire du CSE    │ [.............]");
      L.push("  [.....................] │ membre suppléant du CSE    │ [.............]");
      L.push("  [.....................] │ membre du CSE central      │ [.............]");
      L.push("  [.....................] │ délégué syndical           │ [.............]");
      for (var k = 0; k < 6; k++)
        L.push("  [.....................] │ [........................] │ [.............]");
      L.push("");
      L.push("Ces trois qualités sont celles que le dernier alinéa de L. 2312-36");
      L.push("désigne : membres de la délégation du personnel du comité, membres de la");
      L.push("délégation du personnel du comité central s'il en existe un, délégués");
      L.push("syndicaux. Aucune ne peut être omise.");
      L.push("");
      L.push("ARTICLE 3 — LES MODALITÉS D'ACCÈS, DE CONSULTATION ET D'UTILISATION");
      L.push("");
      L.push("R. 2312-12 : « L'employeur informe ces personnes de l'actualisation de la");
      L.push("base de données selon des modalités qu'il détermine et fixe les modalités");
      L.push("d'accès, de consultation et d'utilisation de la base. Ces modalités");
      L.push("permettent aux personnes mentionnées au dernier alinéa de l'article");
      L.push("L. 2312-36 d'exercer utilement leurs compétences respectives. »");
      L.push("");
      L.push("3.1. Accès : [identifiant nominatif remis à chaque bénéficiaire / clé");
      L.push("d'accès / lieu et heures d'ouverture du classeur papier].");
      L.push("3.2. Permanence : l'accès est ouvert en continu, y compris hors période de");
      L.push("consultation. [Préciser les périodes de fermeture technique éventuelles");
      L.push("et leur durée.]");
      L.push("3.3. Consultation : [consultation sur place / à distance / impression");
      L.push("autorisée / extraction autorisée].");
      L.push("3.4. Utilisation : les informations servent à l'exercice des compétences");
      L.push("respectives des bénéficiaires. [Préciser ce qui est admis : reproduction");
      L.push("pour les besoins d'une réunion, remise à un expert désigné, etc.]");
      L.push("3.5. Information de l'actualisation : [par courriel à la liste ci-dessus /");
      L.push("par affichage / par mention datée en page d'accueil de la base] — et la");
      L.push("preuve d'envoi est conservée.");
      L.push("3.6. Ces modalités doivent permettre à chacun d'exercer UTILEMENT ses");
      L.push("compétences. Une modalité qui rendrait la consultation impraticable —");
      L.push("créneau unique, poste partagé, interdiction de prendre copie — manque");
      L.push("cette exigence.");
      L.push("");
      L.push("ARTICLE 4 — LA CONFIDENTIALITÉ, ET SA CONTREPARTIE");
      L.push("");
      L.push("« Les informations figurant dans la base de données qui revêtent un");
      L.push("caractère confidentiel doivent être présentées comme telles par");
      L.push("l'employeur qui indique la durée du caractère confidentiel de ces");
      L.push("informations que les personnes mentionnées au dernier alinéa de l'article");
      L.push("L. 2312-36 sont tenues de respecter » (R. 2312-13).");
      L.push("");
      L.push("Deux devoirs, donc, et l'un conditionne l'autre : c'est l'employeur qui");
      L.push("présente l'information comme confidentielle ET qui indique la durée. À");
      L.push("défaut, l'obligation de discrétion du dernier alinéa de L. 2312-36 ne");
      L.push("s'attache à rien.");
      L.push("");
      L.push("  information présentée comme confidentielle │ durée de confidentialité");
      L.push("  ───────────────────────────────────────────┼─────────────────────────");
      for (var z = 0; z < 5; z++)
        L.push("  [.........................................] │ [.....................]");
      L.push("");
      L.push("ARTICLE 5 — DATE D'EFFET");
      L.push("");
      L.push("La présente décision prend effet le [DATE]. Elle est portée à la");
      L.push("connaissance des bénéficiaires par le courrier ci-après, et la preuve de");
      L.push("cet envoi est conservée.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(courrierMAD(ctx,
        "ouverture de votre accès à la base de données économiques, sociales et environnementales",
        ["Je vous informe que votre accès à la base de données économiques, sociales",
         "et environnementales de l'entreprise est ouvert à compter du [DATE].",
         "",
         "Support : [.....................................................].",
         "Adresse ou lieu de consultation : [.............................].",
         "Vos identifiants vous sont remis [par pli séparé / ci-joint].",
         "",
         "Cet accès est permanent : il reste ouvert entre les réunions, et non",
         "seulement pendant les périodes de consultation.",
         "",
         "Les modalités d'accès, de consultation et d'utilisation de la base sont",
         "jointes à la présente. Elles ont été fixées de manière à vous permettre",
         "d'exercer utilement vos compétences (R. 2312-12). Si tel n'était pas le cas,",
         "faites-le savoir : c'est une exigence du texte, pas une commodité.",
         "",
         "Vous serez informé de chaque actualisation de la base selon ces modalités."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous établissez la liste nominative des personnes qui doivent"),
        "    avoir accès : élus du comité, élus du comité central s'il en existe un,",
        "    délégués syndicaux.",
        ech(ctx, 3, "vous vérifiez le support au regard de R. 2312-12 et de votre"),
        "    effectif.",
        ech(ctx, 7, "les accès manquants sont ouverts et les modalités écrites."),
        ech(ctx, 8, "le courrier ci-dessus est envoyé, et la preuve d'envoi conservée."),
        ech(ctx, 10, "l'obligation de discrétion est rappelée par écrit, et les"),
        "    informations confidentielles sont présentées comme telles, avec leur",
        "    durée (R. 2312-13).",
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-11, R. 2312-12, " +
        "R. 2312-13")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-MAD-02 — L'ACTUALISATION ET SON CALENDRIER
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-MAD-02", {
    nom: "Le calendrier d'actualisation — rubrique, responsable, périodicité, dernière mise à jour",
    detail: "La note d'actualisation périodique, le tableau rubrique par rubrique " +
            "construit sur le décret, et le courrier qui signale chaque mise à jour.",
    produire: function (ctx) {
      var f = F(ctx), b = B(ctx), r = regimeDe(ctx);
      var L = entete(ctx, "Note et calendrier d'actualisation de la base de données",
        "articles L. 2312-18, L. 2312-21, 2°, et R. 2312-11 du code du travail");

      modeDEmploi(L, "la note qui organise l'actualisation de votre base, et son calendrier");

      L.push("CE QU'UNE BASE PÉRIMÉE FAIT PERDRE");
      L.push("");
      L.push("Les informations de la base portent sur l'année en cours : une base qui");
      L.push("n'a pas bougé depuis plus d'un an ne les porte plus, quoi qu'affirme son");
      L.push("sommaire.");
      L.push("");
      L.push("L. 2312-18 attache un bénéfice précis à l'actualisation : « Les éléments");
      L.push("d'information transmis de manière récurrente au comité sont mis à la");
      L.push("disposition de leurs membres dans la base de données et cette MISE À");
      L.push("DISPOSITION ACTUALISÉE VAUT COMMUNICATION des rapports et informations au");
      L.push("comité, dans les conditions et limites fixées par un décret en Conseil");
      L.push("d'État. » Une base périmée fait tomber ce bénéfice : l'employeur croit");
      L.push("avoir communiqué, et il n'a rien communiqué.");
      L.push("");
      L.push("R. 2312-14 dit les conditions de ce bénéfice, et il faut les lire : « En");
      L.push("l'absence d'accord prévu à l'article L. 2312-21, la mise à disposition");
      L.push("actualisée dans la base de données des éléments d'information contenus");
      L.push("dans les rapports et des informations transmis de manière récurrente au");
      L.push("comité social et économique vaut communication à celui-ci des rapports et");
      L.push("informations lorsque les conditions cumulatives suivantes sont remplies :");
      L.push("1° La condition fixée au second alinéa de l'article R. 2312-11 est");
      L.push("remplie ; 2° L'employeur met à disposition des membres du comité social et");
      L.push("économique les éléments d'analyse ou d'explication lorsqu'ils sont prévus");
      L.push("par le présent code. »");
      L.push("");
      L.push("Les DEUX conditions doivent être remplies, et la seconde s'oublie : les");
      L.push("éléments d'analyse ou d'explication, quand le code en prévoit, sont mis à");
      L.push("disposition en même temps que les chiffres.");
      L.push("");
      L.push("Et R. 2312-11, second alinéa : « Dans les entreprises dotées d'un comité");
      L.push("social et économique central, la base de données comporte les informations");
      L.push("que l'employeur met à disposition de ce comité et des comités");
      L.push("d'établissement. » Son dernier alinéa commande l'actualisation : « Les");
      L.push("éléments d'information sont régulièrement mis à jour, au moins dans le");
      L.push("respect des périodicités prévues par le présent code. »");
      L.push("");
      L.push("LA RÉSERVE : l'accord de L. 2312-21 porte, à son 2°, les modalités de");
      L.push("fonctionnement de la base — l'actualisation en fait partie. Vérifiez ce");
      L.push("qu'il prévoit avant d'appliquer le supplétif.");
      L.push("  · accord d'entreprise déclaré : " + etat(f.accordEntreprise, "OUI", "non"));
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · dernière mise à jour : " +
        (vide(b.dateDerniereMiseAJour) ? "[NON RENSEIGNÉE]" : jour(b.dateDerniereMiseAJour, "date")));
      L.push("  · date de l'audit : " + (vide(f.dateAudit) ? "[non renseignée]" : jour(f.dateAudit, "date")));
      L.push("  · information des bénéficiaires à chaque mise à jour : " +
        etat(b.informationMiseAJour, "oui", "NON"));
      L.push("");
      L.push("Une date globale de mise à jour ne dit rien de la rubrique qui n'a pas");
      L.push("bougé depuis trois ans. C'est pourquoi le tableau ci-dessous demande une");
      L.push("date PAR RUBRIQUE.");
      L.push("");

      L.push(GROS);
      L.push("NOTE D'ACTUALISATION PÉRIODIQUE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — LE PRINCIPE");
      L.push("");
      L.push("Les éléments d'information de la base sont régulièrement mis à jour, au");
      L.push("moins dans le respect des périodicités prévues par le code du travail");
      L.push("(R. 2312-11). Chaque actualisation est datée, et les bénéficiaires en sont");
      L.push("informés (R. 2312-12).");
      L.push("");
      L.push("ARTICLE 2 — LE CALENDRIER, RUBRIQUE PAR RUBRIQUE");
      L.push("");
      L.push("Périodicité proposée : annuelle pour ce qui suit l'exercice comptable ou");
      L.push("l'année civile ; plus rapprochée pour ce qui bouge en cours d'année —");
      L.push("effectifs, contrats, accidents. Arrêtez la vôtre : le tableau ci-dessous");
      L.push("est à remplir, pas à subir.");
      L.push("");
      var arbre = ARBRE[r.articles[r.articles.length - 1]];
      L.push("Grille de référence : article " + arbre.article + " — " + arbre.seuil + ".");
      L.push("");
      for (var i = 0; i < arbre.rubriques.length; i++) {
        var rub = arbre.rubriques[i];
        pousserPlie(L, rub.n + "° " + rub.titre, 66, "  ", "     ");
        L.push("     périodicité : [annuelle / semestrielle / trimestrielle / ........]");
        L.push("     service qui en répond : [.....................................]");
        L.push("     dernière mise à jour : [..............]");
        L.push("     prochaine échéance : [..............]");
        pousserPlie(L, "où chercher : " + (SOURCES[rub.n] || "[à déterminer]"), 60,
          "     ", "       ");
        L.push("");
      }
      L.push("ARTICLE 3 — LES ÉLÉMENTS D'ANALYSE OU D'EXPLICATION");
      L.push("");
      L.push("Lorsque le code en prévoit, ils sont mis à disposition en même temps que");
      L.push("les informations : c'est la seconde condition cumulative de R. 2312-14, et");
      L.push("sans elle la mise à disposition actualisée ne vaut pas communication.");
      L.push("");
      L.push("  rubrique concernée │ élément d'analyse ou d'explication prévu par le code");
      L.push("  ───────────────────┼───────────────────────────────────────────────────");
      for (var z = 0; z < 5; z++)
        L.push("  [.................] │ [.................................................]");
      L.push("");
      L.push("ARTICLE 4 — LA PRIORITÉ DE RATTRAPAGE");
      L.push("");
      L.push("Ce qui est en retard se met à jour en commençant par les rubriques qui");
      L.push("alimentent la PROCHAINE consultation récurrente : c'est elle qui est");
      L.push("exposée, et c'est sur elle que le délai va courir.");
      L.push("");
      L.push("Prochaine consultation récurrente prévue : [orientations stratégiques /");
      L.push("situation économique et financière / politique sociale, conditions de");
      L.push("travail et emploi], le [DATE].");
      L.push("Rubriques à mettre à jour d'ici là : [........................].");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(courrierMAD(ctx,
        "actualisation de la base de données",
        ["Je vous informe que la base de données économiques, sociales et",
         "environnementales a été actualisée le " + leJour(aujourd(ctx)) + ".",
         "",
         "Rubriques mises à jour : [.......................................].",
         "Années concernées : [............................................].",
         "Éléments d'analyse ou d'explication joints, le cas échéant :",
         "[..............................................................].",
         "",
         "Je vous rappelle que la mise à disposition actualisée dans la base des",
         "éléments d'information transmis de manière récurrente au comité vaut",
         "communication des rapports et informations au comité (L. 2312-18).",
         "",
         "La présente information vaut information de la mise à disposition au sens de",
         "l'article R. 2312-5 : c'est d'elle que court le délai de consultation."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous relevez la date de dernière mise à jour de CHAQUE rubrique."),
        ech(ctx, 7, "vous vérifiez ce que l'accord de L. 2312-21 prévoit, à défaut"),
        "    R. 2312-11.",
        ech(ctx, 14, "chaque rubrique a sa périodicité et son service responsable."),
        ech(ctx, 30, "les rubriques en retard sont à jour, en commençant par celles qui"),
        "    alimentent la prochaine consultation récurrente.",
        ech(ctx, 31, "vous informez les bénéficiaires et conservez la preuve d'envoi."),
        ech(ctx, 365, "première échéance annuelle : la base est revue en entier."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-5, R. 2312-11, " +
        "R. 2312-12, R. 2312-14")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-MAD-03 — L'INFORMATION QUI FAIT COURIR LE DÉLAI
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-MAD-03", {
    nom: "L'information des bénéficiaires d'une mise à jour, et son registre",
    detail: "Le modèle d'information, le registre daté des envois, et le rappel " +
            "de ce qu'il commande : le point de départ du délai de consultation.",
    produire: function (ctx) {
      var b = B(ctx);
      var L = entete(ctx, "Information des bénéficiaires de la mise à jour de la base",
        "articles R. 2312-5 et R. 2312-12 du code du travail");

      modeDEmploi(L, "l'envoi qui fait courir le délai de consultation, et son registre");

      L.push("CE QUE CET ENVOI DÉCLENCHE — ET CE QUE SON ABSENCE EMPÊCHE");
      L.push("");
      L.push("« Pour l'ensemble des consultations mentionnées au présent code pour");
      L.push("lesquelles la loi n'a pas fixé de délai spécifique, le délai de");
      L.push("consultation du comité social et économique court à compter de la");
      L.push("communication par l'employeur des informations prévues par le code du");
      L.push("travail pour la consultation OU DE L'INFORMATION PAR L'EMPLOYEUR DE LEUR");
      L.push("MISE À DISPOSITION DANS LA BASE de données économiques, sociales et");
      L.push("environnementales dans les conditions prévues aux articles R. 2312-7 et");
      L.push("suivants » (R. 2312-5).");
      L.push("");
      L.push("Sans cette information, le délai NE COURT PAS. Le comité ne peut pas être");
      L.push("réputé consulté, et l'avis que R. 2312-6 attache au terme du délai ne se");
      L.push("produit jamais : la consultation reste ouverte indéfiniment, et la");
      L.push("décision prise après elle est exposée.");
      L.push("");
      L.push("C'est le paradoxe qu'il faut avoir en tête : l'employeur qui n'informe");
      L.push("pas croit gagner du temps, et il perd le terme qui l'aurait libéré.");
      L.push("");
      L.push("QUI FIXE LE MOYEN");
      L.push("");
      L.push("« L'employeur informe ces personnes de l'actualisation de la base de");
      L.push("données selon des modalités qu'il détermine » (R. 2312-12). Le moyen est");
      L.push("libre ; ce qui ne l'est pas, c'est qu'il soit FIXÉ et qu'il laisse une");
      L.push("trace. Une information dont on ne peut pas prouver la date ne fixe aucun");
      L.push("point de départ.");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · information des bénéficiaires : " + etat(b.informationMiseAJour, "oui", "NON"));
      L.push("  · trace d'accès et de notification : " +
        (vide(b.preuveAcces) ? "[NON RENSEIGNÉE]" : String(b.preuveAcces)));
      L.push("");

      L.push(GROS);
      L.push("MODÈLE D'INFORMATION — À ENVOYER À CHAQUE ACTUALISATION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("Aux membres de la délégation du personnel du comité social et économique,");
      L.push("aux membres de la délégation du personnel du comité social et économique");
      L.push("central d'entreprise, et aux délégués syndicaux");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Envoyé par [courriel avec accusé de réception / remise contre décharge");
      L.push("datée / dépôt horodaté sur l'espace de la base]");
      L.push("");
      L.push("Objet : mise à disposition d'informations actualisées dans la base de");
      L.push("données économiques, sociales et environnementales");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous informe que les informations suivantes ont été mises à jour dans");
      L.push("la base de données économiques, sociales et environnementales de");
      L.push("l'entreprise, et y sont à votre disposition depuis le [DATE] :");
      L.push("");
      L.push("  · rubrique(s) : [.............................................]");
      L.push("  · années concernées : [.......................................]");
      L.push("  · emplacement dans la base : [................................]");
      L.push("  · éléments d'analyse ou d'explication joints, le cas échéant :");
      L.push("    [...........................................................]");
      L.push("");
      L.push("[Lorsque la mise à disposition sert une consultation récurrente, ajouter :]");
      L.push("Cette mise à disposition intervient en vue de la consultation sur");
      L.push("[orientations stratégiques / situation économique et financière /");
      L.push("politique sociale, conditions de travail et emploi]. Conformément à");
      L.push("l'article L. 2312-18 du code du travail, la mise à disposition actualisée");
      L.push("vaut communication des rapports et informations au comité, dans les");
      L.push("conditions et limites fixées par un décret en Conseil d'État.");
      L.push("");
      L.push("Conformément à l'article R. 2312-5 du code du travail, le délai de");
      L.push("consultation court à compter de la présente information.");
      L.push("");
      L.push("[Le cas échéant :] Les informations suivantes revêtent un caractère");
      L.push("confidentiel et sont présentées comme telles : [.................],");
      L.push("pour une durée de [..............] (R. 2312-13).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("LE REGISTRE DES INFORMATIONS ENVOYÉES");
      L.push(GROS);
      L.push("");
      L.push("C'est cette pièce, et non le rapport d'audit, qui datera le point de");
      L.push("départ du délai. Tenez-la au fil des envois : elle ne se reconstitue pas");
      L.push("après coup.");
      L.push("");
      L.push("  date d'envoi │ rubriques mises à jour │ destinataires │ preuve conservée");
      L.push("  ─────────────┼────────────────────────┼───────────────┼─────────────────");
      for (var i = 0; i < 12; i++)
        L.push("  [..........] │ [....................] │ [...........] │ [..............]");
      L.push("");
      L.push("Preuves admises : accusé de réception d'un courriel, décharge datée et");
      L.push("signée, journal horodaté de dépôt sur l'espace de la base, récépissé de");
      L.push("remise en main propre.");
      L.push("");

      L.push("════ CE QUE LE DÉLAI DEVIENT UNE FOIS QU'IL COURT ════");
      L.push("");
      L.push("« À défaut d'accord, le comité social et économique est réputé avoir été");
      L.push("consulté et avoir rendu un AVIS NÉGATIF à l'expiration d'un délai d'un");
      L.push("mois à compter de la date prévue à cet article. En cas d'intervention");
      L.push("d'un expert, le délai mentionné au premier alinéa est porté à deux mois.");
      L.push("Ce délai est porté à trois mois en cas d'intervention d'une ou plusieurs");
      L.push("expertises dans le cadre de consultation se déroulant à la fois au niveau");
      L.push("du comité social et économique central et d'un ou plusieurs comités");
      L.push("sociaux économiques d'établissement » (R. 2312-6, I).");
      L.push("");
      L.push("Le terme n'est pas un silence neutre : il produit un avis défavorable,");
      L.push("opposable, que l'employeur n'a pas voulu et qu'il ne peut plus effacer.");
      L.push("La fiche de délai (BDESE-CTL-CSL-03) le calcule.");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous arrêtez le moyen d'information et l'écrivez dans les"),
        "    modalités de fonctionnement de la base (R. 2312-12).",
        ech(ctx, 1, "le registre est ouvert."),
        ech(ctx, 2, "à chaque actualisation, l'information part le jour même : elle"),
        "    désigne ce qui a été mis à jour et à quelle date.",
        "  · et à chaque fois — la preuve d'envoi est classée au registre.",
        "  · un mois après chaque envoi lié à une consultation — le comité est",
        "    réputé avoir rendu un avis, négatif à défaut d'avis exprès",
        "    (R. 2312-6, I). Deux mois en cas d'expertise, trois en cas",
        "    d'expertises au niveau central et d'établissement.",
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-36, R. 2312-5, R. 2312-6, R. 2312-7, " +
        "R. 2312-12, R. 2312-13, R. 2312-14")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CSL-01 — LA PÉRIODICITÉ DES CONSULTATIONS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CSL-01", {
    nom: "L'avenant qui ramène la périodicité des consultations dans la limite de trois ans",
    detail: "La distinction des deux accords — L. 2312-19 et L. 2312-21 —, " +
            "l'avenant rédigé, le courrier aux organisations syndicales et au " +
            "comité, et le calendrier de dépôt.",
    produire: function (ctx) {
      var f = F(ctx);
      var p = f.periodiciteConsultations;
      var L = entete(ctx, "Avenant à l'accord sur les consultations récurrentes — périodicité",
        "article L. 2312-19 du code du travail");

      modeDEmploi(L, "l'avenant qui ramène la périodicité de vos consultations dans la limite légale");

      L.push("DEUX ACCORDS QUI SE CONFONDENT SOUVENT, ET QUI N'ONT PAS LE MÊME OBJET");
      L.push("");
      L.push("  · L'ACCORD DE L. 2312-19 définit « le contenu, la périodicité et les");
      L.push("    modalités des consultations récurrentes du comité social et");
      L.push("    économique mentionnées à l'article L. 2312-17 ainsi que la liste et");
      L.push("    le contenu des informations nécessaires à ces consultations » (1°).");
      L.push("  · L'ACCORD DE L. 2312-21 définit l'organisation, l'architecture, le");
      L.push("    contenu et les modalités de fonctionnement de la BASE DE DONNÉES.");
      L.push("");
      L.push("UN ACCORD SUR LA BASE NE DÉPLACE PAS LA PÉRIODICITÉ DES CONSULTATIONS.");
      L.push("C'est l'erreur la plus fréquente, et elle fait sauter une consultation");
      L.push("récurrente en croyant l'avoir aménagée.");
      L.push("");
      L.push("LE PLAFOND, ET SA CONSÉQUENCE");
      L.push("");
      L.push("« La périodicité des consultations prévue par l'accord ne peut être");
      L.push("supérieure à trois ans » (L. 2312-19, dernier alinéa). Au-delà, la");
      L.push("stipulation est sans effet, et les consultations restent dues à l'échéance");
      L.push("que le code fixe. L'employeur qui s'en croit dispensé laisse passer une");
      L.push("consultation en pensant l'avoir aménagée.");
      L.push("");
      L.push("À DÉFAUT D'ACCORD, LE RYTHME EST ANNUEL : « En l'absence d'accord prévu à");
      L.push("l'article L. 2312-19, le comité social et économique est consulté chaque");
      L.push("année sur : 1° Les orientations stratégiques de l'entreprise […] ; 2° La");
      L.push("situation économique et financière de l'entreprise […] ; 3° La politique");
      L.push("sociale de l'entreprise, les conditions de travail et l'emploi […] »");
      L.push("(L. 2312-22). Et « au cours de ces consultations, le comité est informé");
      L.push("des conséquences environnementales de l'activité de l'entreprise »");
      L.push("(même article).");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · accord fixant la périodicité des consultations : " +
        etat(f.accordPeriodiciteConsultations, "OUI", "non — le rythme annuel de L. 2312-22 s'applique"));
      L.push("  · périodicité qu'il fixe : " +
        (p == null || p === "" ? "[NON RENSEIGNÉE]" : p + " an(s)" +
          (Number(p) > 3 ? " — AU-DELÀ DU PLAFOND DE TROIS ANS" : ", dans la limite de trois ans")));
      L.push("  · nombre de réunions annuelles prévu : " +
        (f.reunionsAnnuellesAccord == null || f.reunionsAnnuellesAccord === ""
          ? "[non renseigné]" : f.reunionsAnnuellesAccord));
      L.push("");

      L.push(GROS);
      L.push("AVENANT N° [numéro] À L'ACCORD SUR LES CONSULTATIONS RÉCURRENTES");
      L.push(GROS);
      L.push("");
      L.push("Entre " + nomDe(ctx) + ", " + adresseDe(ctx) + ",");
      L.push("représentée par " + signataire(ctx) + ",");
      L.push("");
      L.push("et [les organisations syndicales représentatives signataires : ..........");
      L.push("...................................................................]");
      L.push("[ou, en l'absence de délégué syndical : le comité social et économique,");
      L.push("l'accord étant adopté à la majorité des membres titulaires de la");
      L.push("délégation du personnel — c'est la seconde voie que L. 2312-19 ouvre].");
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("L'accord du [DATE] fixe le contenu, la périodicité et les modalités des");
      L.push("consultations récurrentes du comité social et économique mentionnées à");
      L.push("l'article L. 2312-17 du code du travail. Le dernier alinéa de l'article");
      L.push("L. 2312-19 plafonne cette périodicité à trois ans. Le présent avenant");
      L.push("ramène dans cette limite les stipulations qui l'excédaient.");
      L.push("");
      L.push("ARTICLE 1 — LA PÉRIODICITÉ, CONSULTATION PAR CONSULTATION");
      L.push("");
      L.push("Les trois consultations récurrentes sont celles de L. 2312-17 :");
      L.push("");
      L.push("  1° les orientations stratégiques de l'entreprise ;");
      L.push("  2° la situation économique et financière de l'entreprise ;");
      L.push("  3° la politique sociale de l'entreprise, les conditions de travail et");
      L.push("     l'emploi.");
      L.push("");
      L.push("  consultation                        │ ancienne │ nouvelle │ ≤ 3 ans ?");
      L.push("  ────────────────────────────────────┼──────────┼──────────┼──────────");
      L.push("  1° orientations stratégiques        │ [......] │ [......] │ [ ]");
      L.push("  2° situation économique et financière│ [......] │ [......] │ [ ]");
      L.push("  3° politique sociale, conditions de │ [......] │ [......] │ [ ]");
      L.push("     travail et emploi                │          │          │");
      L.push("");
      L.push("Aucune périodicité ne peut excéder trois ans.");
      L.push("");
      L.push("ARTICLE 2 — LES CONSÉQUENCES ENVIRONNEMENTALES");
      L.push("");
      L.push("Au cours de chacune de ces consultations, le comité est informé des");
      L.push("conséquences environnementales de l'activité de l'entreprise (L. 2312-17,");
      L.push("deuxième alinéa ; L. 2312-22). L'aménagement de la périodicité ne");
      L.push("supprime pas cette information.");
      L.push("");
      L.push("ARTICLE 3 — CE QUE L'ACCORD PEUT AUSSI RÉGLER");
      L.push("");
      L.push("L'article L. 2312-19 permet au même accord de définir :");
      L.push("  2° le nombre de réunions annuelles du comité prévues à l'article");
      L.push("     L. 2315-27, « qui ne peut être inférieur à six » ;");
      L.push("  3° les niveaux auxquels les consultations sont conduites et, le cas");
      L.push("     échéant, leur articulation ;");
      L.push("  4° les délais mentionnés à l'article L. 2312-15 dans lesquels les avis");
      L.push("     du comité sont rendus.");
      L.push("Il peut également prévoir la possibilité pour le comité d'émettre un avis");
      L.push("unique portant sur tout ou partie des thèmes de consultation prévus à");
      L.push("l'article L. 2312-17.");
      L.push("");
      L.push("[Le cas échéant, reprendre ici ces stipulations. L'article L. 2315-27,");
      L.push("auquel le 2° renvoie pour le nombre de réunions, n'a pas été lu à la");
      L.push("source par ce module : il est nommé, non reproduit — mais le PLANCHER DE");
      L.push("SIX, lui, figure bien dans L. 2312-19, 2°, qui a été lu.]");
      L.push("");
      L.push("ARTICLE 4 — DURÉE, ENTRÉE EN VIGUEUR, DÉPÔT");
      L.push("");
      L.push("Le présent avenant est conclu pour [durée] et entre en vigueur le [DATE].");
      L.push("Il est déposé dans les conditions prévues par le code du travail, et le");
      L.push("récépissé est conservé au dossier.");
      L.push("");
      L.push("EN ATTENDANT L'AVENANT, LA CONSULTATION RESTE DUE À L'ÉCHÉANCE LÉGALE :");
      L.push("une stipulation sans effet ne dispense de rien. Ne différez pas une");
      L.push("consultation au motif que l'avenant est en cours de négociation.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le [DATE DE SIGNATURE], en [nombre] exemplaires.");
      L.push("");
      L.push("Pour l'entreprise                    Pour les organisations syndicales");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("COURRIER — OUVERTURE DE LA NÉGOCIATION DE L'AVENANT");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("Aux organisations syndicales représentatives dans l'entreprise");
      L.push("[et, en l'absence de délégué syndical, aux membres titulaires de la");
      L.push("délégation du personnel du comité social et économique]");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : périodicité des consultations récurrentes — projet d'avenant");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'accord du [DATE] fixe la périodicité des consultations récurrentes du");
      L.push("comité social et économique. Le dernier alinéa de l'article L. 2312-19 du");
      L.push("code du travail plafonne cette périodicité à trois ans.");
      L.push("");
      L.push("Je vous invite en conséquence à ouvrir la négociation d'un avenant, dont");
      L.push("le projet est joint, lors d'une réunion fixée au [DATE].");
      L.push("");
      L.push("Jusqu'à sa conclusion, les consultations seront tenues aux échéances que");
      L.push("le code fixe : une stipulation excédant le plafond légal est sans effet et");
      L.push("ne dispense d'aucune consultation.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : projet d'avenant");
      L.push("");
      L.push("");

      L.push("════ LE RELEVÉ DES CONSULTATIONS TENUES ════");
      L.push("");
      L.push("  consultation                          │ dernière tenue │ procès-verbal");
      L.push("  ──────────────────────────────────────┼────────────────┼──────────────");
      L.push("  1° orientations stratégiques          │ [............] │ [...........]");
      L.push("  2° situation économique et financière │ [............] │ [...........]");
      L.push("  3° politique sociale, conditions de   │ [............] │ [...........]");
      L.push("     travail et emploi                  │                │");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous distinguez les deux accords et relevez la stipulation qui"),
        "    porte la périodicité, consultation par consultation.",
        ech(ctx, 7, "le courrier d'ouverture est envoyé avec le projet d'avenant."),
        ech(ctx, 30, "première réunion de négociation."),
        ech(ctx, 90, "l'avenant est signé."),
        ech(ctx, 105, "l'avenant est déposé et le récépissé conservé."),
        "  · et pendant tout ce temps — les consultations restent tenues à",
        "    l'échéance légale : annuelle à défaut d'accord valable (L. 2312-22).",
      ]));

      return L.concat(pied("L. 2312-15, L. 2312-17, L. 2312-19, L. 2312-21, L. 2312-22",
        ["L'article L. 2315-27, auquel L. 2312-19, 2°, renvoie pour le nombre de",
         "réunions annuelles, n'a pas été lu à la source par ce module : il est nommé,",
         "non reproduit. Le plancher de six réunions, lui, figure dans L. 2312-19, 2°,",
         "qui a été lu."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CSL-02 — LES SIX RÉUNIONS ANNUELLES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CSL-02", {
    nom: "Le calendrier annuel des réunions du comité, et l'avenant qui porte leur nombre à six",
    detail: "Le calendrier des réunions programmées sans attendre l'avenant, " +
            "l'avenant qui corrige la stipulation, et le rappel de ce que le " +
            "procès-verbal prouve.",
    produire: function (ctx) {
      var f = F(ctx);
      var n = f.reunionsAnnuellesAccord;
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Calendrier annuel des réunions du comité et avenant sur leur nombre",
        "article L. 2312-19, 2°, du code du travail");

      modeDEmploi(L, "le calendrier des réunions à tenir, et l'avenant qui corrige la stipulation");

      L.push("UN PLANCHER QUI NE SE NÉGOCIE PAS À LA BAISSE");
      L.push("");
      L.push("L'article L. 2312-19 permet à l'accord de définir, à son 2°, « le nombre");
      L.push("de réunions annuelles du comité prévues à l'article L. 2315-27, QUI NE");
      L.push("PEUT ÊTRE INFÉRIEUR À SIX ».");
      L.push("");
      L.push("En dessous de six, la stipulation ne tient pas : les réunions restent");
      L.push("dues, et l'employeur qui s'en tient au chiffre de l'accord en omet. La");
      L.push("correction se fait donc en deux temps, et le premier ne peut pas");
      L.push("attendre : PROGRAMMER LES RÉUNIONS D'ABORD, corriger la stipulation");
      L.push("ensuite.");
      L.push("");
      L.push("L'article L. 2315-27, auquel le 2° renvoie, n'a pas été lu à la source par");
      L.push("ce module : il est nommé, non reproduit. Le plancher de six, lui, est dans");
      L.push("L. 2312-19, 2°, qui a été lu.");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · accord fixant le nombre de réunions : " +
        etat(f.accordPeriodiciteConsultations, "OUI", "non — c'est le régime supplétif qui s'applique"));
      L.push("  · nombre de réunions annuelles prévu par l'accord : " +
        (n == null || n === "" ? "[NON RENSEIGNÉ]"
          : n + (Number(n) < 6 ? " — EN DESSOUS DU PLANCHER DE SIX" : ", au moins six")));
      L.push("");

      L.push(GROS);
      L.push("PREMIER TEMPS — LE CALENDRIER DES RÉUNIONS DE L'ANNÉE EN COURS");
      L.push(GROS);
      L.push("");
      L.push("Programmez les réunions manquantes pour atteindre six sur l'année. Cela");
      L.push("se fait immédiatement, sans attendre l'avenant : une stipulation");
      L.push("inférieure au plancher ne dispense d'aucune réunion.");
      L.push("");
      L.push("  n° │ date        │ ordre du jour principal        │ procès-verbal");
      L.push("  ───┼─────────────┼────────────────────────────────┼──────────────");
      for (var i = 1; i <= 6; i++)
        L.push("  " + i + "  │ [.........] │ [............................] │ [...........]");
      L.push("");
      L.push("Réunions déjà tenues sur les douze derniers mois : [nombre]. Il en reste");
      L.push("donc [nombre] à programmer d'ici la fin de l'année.");
      L.push("");
      L.push("Deux dates repères, comptées depuis aujourd'hui :");
      L.push("  · " + leJour(dans(d0, 30)) + " — première réunion de rattrapage ;");
      L.push("  · " + leJour(dans(d0, 60)) + " — deuxième, si deux réunions manquent.");
      L.push("");
      L.push("C'EST LE PROCÈS-VERBAL QUI PROUVERA LE NOMBRE. Une réunion tenue sans");
      L.push("procès-verbal ne se démontre pas. Feuilles d'émargement et convocations");
      L.push("sont conservées avec lui.");
      L.push("");

      L.push(GROS);
      L.push("SECOND TEMPS — AVENANT N° [numéro] SUR LE NOMBRE DE RÉUNIONS ANNUELLES");
      L.push(GROS);
      L.push("");
      L.push("Entre " + nomDe(ctx) + ", " + adresseDe(ctx) + ",");
      L.push("représentée par " + signataire(ctx) + ",");
      L.push("");
      L.push("et [les organisations syndicales représentatives signataires / le comité");
      L.push("social et économique, en l'absence de délégué syndical, l'accord étant");
      L.push("adopté à la majorité des membres titulaires de la délégation du");
      L.push("personnel].");
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("L'accord du [DATE] fixe à [nombre] le nombre de réunions annuelles du");
      L.push("comité social et économique. L'article L. 2312-19, 2°, du code du travail");
      L.push("dispose que ce nombre « ne peut être inférieur à six ». Les parties");
      L.push("conviennent de le porter à ce plancher.");
      L.push("");
      L.push("ARTICLE 1 — Le nombre de réunions annuelles du comité social et économique");
      L.push("est porté à [nombre, au moins six] à compter du [DATE].");
      L.push("");
      L.push("ARTICLE 2 — [Le cas échéant : répartition indicative des réunions dans");
      L.push("l'année, et articulation avec les trois consultations récurrentes de");
      L.push("l'article L. 2312-17.]");
      L.push("");
      L.push("ARTICLE 3 — Le présent avenant entre en vigueur le [DATE]. Il est déposé");
      L.push("dans les conditions prévues par le code du travail, et le récépissé est");
      L.push("conservé au dossier.");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le [DATE DE SIGNATURE].");
      L.push("");
      L.push("Pour l'entreprise                    Pour les organisations syndicales");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("COURRIER — CONVOCATION À LA NÉGOCIATION DE L'AVENANT");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("Aux organisations syndicales représentatives dans l'entreprise");
      L.push("[et, en l'absence de délégué syndical, aux membres titulaires du comité]");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : nombre de réunions annuelles du comité — projet d'avenant");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'accord du [DATE] fixe à [nombre] le nombre de réunions annuelles du");
      L.push("comité social et économique. L'article L. 2312-19, 2°, du code du travail");
      L.push("dispose que ce nombre ne peut être inférieur à six.");
      L.push("");
      L.push("Je vous invite à ouvrir la négociation d'un avenant, dont le projet est");
      L.push("joint, lors d'une réunion fixée au [DATE].");
      L.push("");
      L.push("Sans attendre cette négociation, les réunions manquantes de l'année en");
      L.push("cours sont programmées : le calendrier vous est joint.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : projet d'avenant · calendrier des réunions");
      L.push("");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous relevez le nombre de réunions prévu par l'accord et le nombre"),
        "    effectivement tenues sur les douze derniers mois.",
        ech(ctx, 3, "les réunions manquantes sont programmées et les convocations"),
        "    parties : c'est le plancher de L. 2312-19, 2°, et il ne se négocie pas",
        "    à la baisse.",
        ech(ctx, 7, "le courrier d'ouverture de la négociation est envoyé."),
        ech(ctx, 30, "première réunion de rattrapage, et première réunion de"),
        "    négociation de l'avenant.",
        ech(ctx, 90, "l'avenant est signé, puis déposé ; le récépissé est conservé."),
      ]));

      return L.concat(pied("L. 2312-17, L. 2312-19, L. 2312-22",
        ["L'article L. 2315-27, auquel L. 2312-19, 2°, renvoie, n'a pas été lu à la",
         "source par ce module : il est nommé, non reproduit."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-CSL-03 — LE DÉLAI DE CONSULTATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-CSL-03", {
    nom: "La fiche de délai de consultation — point de départ, terme applicable, date de l'avis",
    detail: "Le calcul du terme selon l'expertise, la lettre qui fait courir le " +
            "délai, la règle des sept jours entre établissements et comité " +
            "central, et le procès-verbal.",
    produire: function (ctx) {
      var f = F(ctx), c = f.consultation || {};
      var depart = c.dateMiseADisposition || c.dateCommunication;
      var nbExp = c.nbExpertises;
      var central = c.centralEtEtablissements;
      var moisDus = 1, cas = "aucune expertise";
      if (estOui(central) && Number(nbExp) >= 1) { moisDus = 3; cas = "expertises au niveau central ET d'établissement"; }
      else if (Number(nbExp) >= 1) { moisDus = 2; cas = "intervention d'un expert"; }
      var terme = estISO(depart) ? moisApres(depart, moisDus) : null;
      var L = entete(ctx, "Fiche de délai de consultation du comité social et économique",
        "articles R. 2312-5 et R. 2312-6 du code du travail");

      modeDEmploi(L, "la fiche qui calcule le terme au-delà duquel l'avis est réputé rendu");

      L.push("CE QUE LE TERME PRODUIT — ET CE N'EST PAS UN SILENCE");
      L.push("");
      L.push("« I. — Pour les consultations mentionnées à l'article R. 2312-5, à défaut");
      L.push("d'accord, le comité social et économique est réputé avoir été consulté et");
      L.push("AVOIR RENDU UN AVIS NÉGATIF à l'expiration d'un délai d'un mois à compter");
      L.push("de la date prévue à cet article. En cas d'intervention d'un expert, le");
      L.push("délai mentionné au premier alinéa est porté à deux mois. Ce délai est");
      L.push("porté à trois mois en cas d'intervention d'une ou plusieurs expertises");
      L.push("dans le cadre de consultation se déroulant à la fois au niveau du comité");
      L.push("social et économique central et d'un ou plusieurs comités sociaux");
      L.push("économiques d'établissement » (R. 2312-6, I).");
      L.push("");
      L.push("Le terme n'est pas neutre : il produit un AVIS DÉFAVORABLE, opposable, que");
      L.push("l'employeur n'a pas voulu et qu'il ne peut plus effacer.");
      L.push("");
      L.push("LE POINT DE DÉPART N'EST PAS LA PREMIÈRE RÉUNION");
      L.push("");
      L.push("« Le délai de consultation du comité social et économique court à compter");
      L.push("de la communication par l'employeur des informations prévues par le code");
      L.push("du travail pour la consultation ou de l'information par l'employeur de");
      L.push("leur mise à disposition dans la base de données […] » (R. 2312-5).");
      L.push("");
      L.push("C'est de l'un de ces deux actes que court le délai — pas de la réunion, ni");
      L.push("de la date de l'ordre du jour.");
      L.push("");
      L.push("ET LE DÉLAI D'EXAMEN SUFFISANT RESTE DÛ : le comité « dispose à cette fin");
      L.push("d'un délai d'examen suffisant et d'informations précises et écrites");
      L.push("transmises ou mises à disposition par l'employeur, et de la réponse");
      L.push("motivée de l'employeur à ses propres observations » (L. 2312-15). Le même");
      L.push("article ouvre au comité, s'il estime ne pas disposer d'éléments");
      L.push("suffisants, la saisine du président du tribunal judiciaire statuant selon");
      L.push("la procédure accélérée au fond ; cette saisine ne prolonge pas le délai,");
      L.push("mais « en cas de difficultés particulières d'accès aux informations");
      L.push("nécessaires à la formulation de l'avis motivé du comité, le juge peut");
      L.push("décider la prolongation du délai ».");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · accord fixant les délais de consultation : " +
        etat(f.accordDelaisConsultation,
          "OUI — c'est lui qui commande, non le mois supplétif de R. 2312-6 ; joignez-le",
          "non — le régime de R. 2312-6 s'applique"));
      L.push("  · date de mise à disposition ou de communication : " +
        (estISO(depart) ? jour(depart) : "[NON RENSEIGNÉE]"));
      L.push("  · nombre d'expertises : " + (nbExp == null || nbExp === "" ? "[non renseigné]" : nbExp));
      L.push("  · consultation menée à la fois au niveau central et d'établissement : " +
        etat(central, "oui", "non"));
      L.push("  · date de l'avis : " + (estISO(c.dateAvis) ? jour(c.dateAvis) : "[NON RENSEIGNÉE]"));
      L.push("");

      L.push(GROS);
      L.push("FICHE DE DÉLAI");
      L.push(GROS);
      L.push("");
      L.push("Consultation concernée : [orientations stratégiques / situation économique");
      L.push("et financière / politique sociale, conditions de travail et emploi /");
      L.push("consultation ponctuelle : ..................................].");
      L.push("");
      L.push("1. POINT DE DÉPART");
      L.push("   Date de la communication des informations, ou de l'information de leur");
      L.push("   mise à disposition dans la base : " + (estISO(depart) ? jour(depart) : "[DATE]") + ".");
      L.push("   Preuve : [accusé de réception / décharge datée / journal horodaté].");
      L.push("");
      L.push("2. TERME APPLICABLE");
      L.push("   · un mois — aucune expertise ;");
      L.push("   · deux mois — intervention d'un expert ;");
      L.push("   · trois mois — expertises au niveau du comité central ET d'un ou");
      L.push("     plusieurs comités d'établissement.");
      L.push("");
      L.push("   Terme retenu ici : " + moisDus + " mois (" + cas + ")" +
        (terme ? ", soit le " + jour(terme) + "." : ", à compter de la date ci-dessus."));
      L.push("   Lettre de mission de l'expert, le cas échéant : [DATE, objet].");
      L.push("");
      L.push("3. LA RÈGLE DES SEPT JOURS, LORSQUE LA CONSULTATION SE DÉROULE AUX DEUX");
      L.push("   NIVEAUX");
      L.push("");
      L.push("   « Lorsqu'il y a lieu de consulter à la fois le comité social et");
      L.push("   économique central et un ou plusieurs comités d'établissement en");
      L.push("   application du second alinéa de l'article L. 2316-22, les délais prévus");
      L.push("   au I s'appliquent au comité social et économique central. Dans ce cas,");
      L.push("   l'avis de chaque comité d'établissement est rendu et transmis au comité");
      L.push("   social et économique central au plus tard SEPT JOURS avant la date à");
      L.push("   laquelle ce dernier est réputé avoir été consulté et avoir rendu un");
      L.push("   avis négatif en application du I. À défaut, l'avis du comité");
      L.push("   d'établissement est réputé négatif » (R. 2312-6, II).");
      L.push("");
      if (terme) {
        var sept = dateDe(terme);
        if (sept) { sept.setDate(sept.getDate() - 7);
          L.push("   Sur votre dossier : les avis d'établissement doivent être rendus et");
          L.push("   transmis au comité central au plus tard le " + leJour(sept) + ".");
        }
      } else {
        L.push("   Date limite des avis d'établissement : [TERME − 7 jours].");
      }
      L.push("");
      L.push("   Et L. 2316-22 le dit déjà : à défaut d'accord définissant l'ordre et les");
      L.push("   délais, « l'avis de chaque comité social et économique d'établissement");
      L.push("   est rendu et transmis au comité social et économique central et l'avis");
      L.push("   du comité social et économique central est rendu dans des délais fixés");
      L.push("   par décret en Conseil d'État ».");
      L.push("");
      L.push("4. L'AVIS");
      L.push("   Date de l'avis rendu : " + (estISO(c.dateAvis) ? jour(c.dateAvis) : "[DATE]") + ".");
      L.push("   Porté au procès-verbal du [DATE], conservé avec la présente fiche.");
      if (terme && estISO(c.dateAvis)) {
        L.push("   " + (c.dateAvis <= terme
          ? "Cet avis est intervenu DANS le délai."
          : "Cet avis est POSTÉRIEUR au terme : à cette date, le comité était déjà"));
        if (c.dateAvis > terme) L.push("   réputé avoir rendu un avis négatif (R. 2312-6, I).");
      }
      L.push("");
      L.push("5. LA RÉPONSE MOTIVÉE DE L'EMPLOYEUR");
      L.push("   « L'employeur rend compte, en la motivant, de la suite donnée aux avis");
      L.push("   et vœux du comité » (L. 2312-15, dernier alinéa). Date de cette réponse");
      L.push("   motivée : [DATE].");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(courrierMAD(ctx,
        "mise à disposition des informations en vue d'une consultation — point de départ du délai",
        ["Je vous informe que les informations nécessaires à la consultation sur",
         "[objet de la consultation] sont mises à votre disposition dans la base de",
         "données économiques, sociales et environnementales depuis le [DATE].",
         "",
         "Rubriques concernées : [.........................................].",
         "Emplacement dans la base : [.....................................].",
         "Éléments d'analyse ou d'explication joints : [....................].",
         "",
         "Conformément à l'article R. 2312-5 du code du travail, le délai de",
         "consultation court à compter de la présente information. À défaut d'accord,",
         "et sauf intervention d'un expert, le comité est réputé avoir été consulté et",
         "avoir rendu un avis à l'expiration d'un délai d'un mois (R. 2312-6, I).",
         "",
         "[Si la consultation se déroule aussi au niveau des établissements :] L'avis",
         "de chaque comité d'établissement est rendu et transmis au comité social et",
         "économique central au plus tard sept jours avant ce terme (R. 2312-6, II)."]));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous datez la communication ou l'information de mise à"),
        "    disposition, et conservez la preuve d'envoi.",
        terme ? "  · " + leJour(dateDe(terme)) + " — terme du délai de " + moisDus + " mois calculé sur votre dossier."
              : "  · [DATE DE MISE À DISPOSITION + " + moisDus + " mois] — terme du délai.",
        ech(ctx, 30 * moisDus - 7, "si la consultation se déroule aux deux niveaux : date"),
        "    limite indicative des avis d'établissement — sept jours avant le terme.",
        ech(ctx, 30 * moisDus - 1, "l'avis est rendu et porté au procès-verbal, daté. Après"),
        "    le terme, l'avis négatif était déjà acquis.",
      ]));

      return L.concat(pied("L. 2312-15, L. 2312-17, L. 2312-18, L. 2312-19, L. 2312-22, " +
        "L. 2316-22, R. 2312-5, R. 2312-6, R. 2312-7")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-ETB-01 — LE NIVEAU DE MISE EN PLACE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-ETB-01", {
    nom: "La note sur le niveau de mise en place de la base et les droits d'accès par établissement",
    detail: "Le recensement des établissements et des comités, le niveau retenu, " +
            "les droits d'accès comité par comité, et les courriers de " +
            "notification.",
    produire: function (ctx) {
      var f = F(ctx), b = B(ctx);
      var ed = f.etablissementsDistincts;
      if (ed === undefined || ed === null || ed === "") ed = P(ctx).etablissementsDistincts;
      var L = entete(ctx, "Niveau de mise en place de la base et droits d'accès par établissement",
        "articles L. 2312-21, 2°, L. 2316-1 et R. 2312-11 du code du travail");

      modeDEmploi(L, "la note qui fixe où la base est mise en place et qui y accède, établissement par établissement");

      L.push("CE QUE LE TEXTE RANGE PARMI CE QUE L'ACCORD DÉFINIT");
      L.push("");
      L.push("L'accord de L. 2312-21 définit, à son 2°, « les modalités de");
      L.push("fonctionnement de la base de données économiques, sociales et");
      L.push("environnementales, notamment les droits d'accès et LE NIVEAU DE MISE EN");
      L.push("PLACE DE LA BASE DANS LES ENTREPRISES COMPORTANT DES ÉTABLISSEMENTS");
      L.push("DISTINCTS, son support, ses modalités de consultation et d'utilisation ».");
      L.push("");
      L.push("À DÉFAUT D'ACCORD, LE DÉCRET TRANCHE : « En l'absence d'accord prévu à");
      L.push("l'article L. 2312-21, la base de données prévue à l'article L. 2312-18 est");
      L.push("CONSTITUÉE AU NIVEAU DE L'ENTREPRISE. Dans les entreprises dotées d'un");
      L.push("comité social et économique central, la base de données comporte les");
      L.push("informations que l'employeur met à disposition de ce comité ET DES COMITÉS");
      L.push("D'ÉTABLISSEMENT » (R. 2312-11).");
      L.push("");
      L.push("Un niveau non fixé laisse chaque comité sans savoir où lire ce qui le");
      L.push("concerne, et l'employeur sans pouvoir démontrer qu'il l'a mis à sa");
      L.push("disposition.");
      L.push("");
      L.push("QUI EST CONSULTÉ SUR QUOI");
      L.push("");
      L.push("« Le comité social et économique central d'entreprise exerce les");
      L.push("attributions qui concernent la marche générale de l'entreprise et qui");
      L.push("excèdent les limites des pouvoirs des chefs d'établissement. Il est seul");
      L.push("consulté sur : 1° Les projets décidés au niveau de l'entreprise qui ne");
      L.push("comportent pas de mesures d'adaptation spécifiques à un ou plusieurs");
      L.push("établissements […] ; 2° Les projets et consultations récurrentes décidés");
      L.push("au niveau de l'entreprise lorsque leurs éventuelles mesures de mise en");
      L.push("œuvre […] ne sont pas encore définies ; 3° Les mesures d'adaptation");
      L.push("communes à plusieurs établissements des projets […] » (L. 2316-1).");
      L.push("");
      L.push("Et « le comité social et économique d'établissement a les mêmes");
      L.push("attributions que le comité social et économique d'entreprise, dans la");
      L.push("limite des pouvoirs confiés au chef de cet établissement. Le comité social");
      L.push("et économique d'établissement est consulté sur les mesures d'adaptation");
      L.push("des décisions arrêtées au niveau de l'entreprise spécifiques à");
      L.push("l'établissement et qui relèvent de la compétence du chef de cet");
      L.push("établissement » (L. 2316-20).");
      L.push("");
      L.push("C'est ce partage qui commande les droits d'accès : un comité");
      L.push("d'établissement doit atteindre ce sur quoi il est consulté.");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · établissements distincts : " +
        etat(ed, "OUI", "non — la base est mise en place au niveau de l'entreprise"));
      L.push("  · niveau de mise en place déclaré : " +
        (vide(b.niveau) ? "[NON RENSEIGNÉ]" : String(b.niveau)));
      L.push("  · accord d'entreprise déclaré : " + etat(f.accordEntreprise, "OUI", "non"));
      L.push("");

      L.push(GROS);
      L.push("NOTE SUR LE NIVEAU DE MISE EN PLACE ET LES DROITS D'ACCÈS");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — LE RECENSEMENT");
      L.push("");
      L.push("  établissement distinct   │ comité installé │ président │ nb d'élus");
      L.push("  ─────────────────────────┼─────────────────┼───────────┼──────────");
      for (var i = 0; i < 6; i++)
        L.push("  [.......................] │ [.............] │ [.......] │ [.......]");
      L.push("");
      L.push("Comité social et économique central : [OUI, installé le ......... / NON].");
      L.push("Nombre de délégués syndicaux, et leur périmètre : [..................].");
      L.push("");
      L.push("ARTICLE 2 — LE NIVEAU RETENU");
      L.push("");
      L.push("  [ ] Un accord de L. 2312-21 fixe le niveau : accord du ..............,");
      L.push("      stipulation ..............., niveau retenu : ...................");
      L.push("  [ ] À défaut d'accord : la base est constituée AU NIVEAU DE");
      L.push("      L'ENTREPRISE (R. 2312-11), et elle comporte les informations que");
      L.push("      l'employeur met à disposition du comité central et des comités");
      L.push("      d'établissement.");
      L.push("");
      L.push("ARTICLE 3 — LES DROITS D'ACCÈS, COMITÉ PAR COMITÉ");
      L.push("");
      L.push("  comité                 │ rubriques accessibles │ notifié le");
      L.push("  ───────────────────────┼───────────────────────┼────────────");
      L.push("  CSE central            │ [.....................] │ [.........]");
      for (var k = 0; k < 5; k++)
        L.push("  CSE d'établissement    │ [.....................] │ [.........]");
      L.push("  [..................... ]│ [.....................] │ [.........]");
      L.push("");
      L.push("Rappel : l'accord peut ORGANISER ces droits, non les supprimer. La base");
      L.push("est accessible en permanence aux membres de la délégation du personnel du");
      L.push("comité, à ceux du comité central et aux délégués syndicaux (L. 2312-36).");
      L.push("");
      L.push("ARTICLE 4 — LA CONSULTATION AUX DEUX NIVEAUX ET LA RÈGLE DES SEPT JOURS");
      L.push("");
      L.push("Lorsque la consultation se déroule à la fois au niveau du comité central");
      L.push("et de comités d'établissement, l'avis de chaque comité d'établissement est");
      L.push("rendu et transmis au comité central AU PLUS TARD SEPT JOURS avant la date");
      L.push("à laquelle celui-ci est réputé avoir été consulté et avoir rendu un avis");
      L.push("négatif. À défaut, l'avis du comité d'établissement est réputé négatif");
      L.push("(R. 2312-6, II).");
      L.push("");
      L.push("Et le délai applicable au comité central passe à TROIS MOIS en cas");
      L.push("d'expertises intervenant aux deux niveaux (R. 2312-6, I).");
      L.push("");
      L.push("[Le cas échéant : un accord peut définir l'ordre et les délais dans");
      L.push("lesquels le comité central et les comités d'établissement rendent et");
      L.push("transmettent leurs avis (L. 2316-22). Si vous en avez un, reportez-le ici.]");
      L.push("");
      L.push("ARTICLE 5 — LA BASE DE GROUPE, LE CAS ÉCHÉANT");
      L.push("");
      L.push("« Sans préjudice de l'obligation de mise en place d'une base de données au");
      L.push("niveau de l'entreprise, une convention ou un accord de groupe peut prévoir");
      L.push("la constitution d'une base de données au niveau du groupe. La convention");
      L.push("ou l'accord détermine notamment les personnes ayant accès à cette base");
      L.push("ainsi que les modalités d'accès, de consultation et d'utilisation de cette");
      L.push("base » (R. 2312-15).");
      L.push("");
      L.push("Le mot qui compte est « sans préjudice » : une base de groupe ne dispense");
      L.push("pas de la base d'entreprise.");
      L.push("Appartenance à un groupe : " + cro(P(ctx).groupe, "non renseignée") + ".");
      L.push("Base de groupe existante : [OUI, accord du ......... / NON].");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("COURRIER — NOTIFICATION AUX COMITÉS D'ÉTABLISSEMENT ET AU COMITÉ CENTRAL");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(adresseDe(ctx));
      L.push("");
      L.push("Aux membres de la délégation du personnel du comité social et économique");
      L.push("central d'entreprise et des comités sociaux et économiques");
      L.push("d'établissement, et aux délégués syndicaux");
      L.push("");
      L.push(villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : niveau de mise en place de la base de données et vos droits d'accès");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous informe que la base de données économiques, sociales et");
      L.push("environnementales de l'entreprise est mise en place au niveau [de");
      L.push("l'entreprise / ....................], en application [de l'accord du");
      L.push(".............. / de l'article R. 2312-11 du code du travail, à défaut");
      L.push("d'accord].");
      L.push("");
      L.push("Elle comporte les informations que l'employeur met à disposition du comité");
      L.push("social et économique central et des comités d'établissement.");
      L.push("");
      L.push("Vos droits d'accès sont les suivants : [........................].");
      L.push("Support et adresse de consultation : [.........................].");
      L.push("");
      L.push("Lorsqu'une consultation se déroule à la fois au niveau central et au niveau");
      L.push("des établissements, l'avis de chaque comité d'établissement est rendu et");
      L.push("transmis au comité central au plus tard sept jours avant la date à laquelle");
      L.push("celui-ci est réputé avoir été consulté (R. 2312-6, II).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : note sur le niveau de mise en place et les droits d'accès");
      L.push("");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous recensez les établissements distincts, les comités qui y"),
        "    sont installés, et le comité central.",
        ech(ctx, 7, "vous vérifiez ce que l'accord de L. 2312-21 prévoit à son 2°."),
        ech(ctx, 14, "le niveau est arrêté et écrit ; à défaut d'accord, c'est celui de"),
        "    l'entreprise (R. 2312-11).",
        ech(ctx, 21, "les droits d'accès de chaque comité sont écrits et notifiés ; la"),
        "    trace de la notification est conservée.",
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, L. 2316-1, L. 2316-20, " +
        "L. 2316-22, R. 2312-6, R. 2312-11, R. 2312-12, R. 2312-15")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-COH-01 — LE BORDEREAU DES PIÈCES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-COH-01", {
    nom: "Le bordereau des pièces — accords versés, leur objet, et régime retenu",
    detail: "La grille qui qualifie chaque accord versé, le constat écrit lorsque " +
            "aucun accord ne définit la base, et la rectification de la " +
            "déclaration de régime.",
    produire: function (ctx) {
      var f = F(ctx), r = regimeDe(ctx);
      var pieces = Array.isArray(f.pieces) ? f.pieces : liste(f.pieces);
      var L = entete(ctx, "Bordereau des pièces et régime retenu pour la base de données",
        "article L. 2312-21 du code du travail");

      modeDEmploi(L, "le bordereau qui met d'accord ce que vous déclarez et ce que vos pièces établissent");

      L.push("UN RÉGIME CONVENTIONNEL SE PROUVE PAR SON TEXTE");
      L.push("");
      L.push("Déclarer un accord sans le produire, ou se dire sous le régime supplétif");
      L.push("tout en versant un accord, laisse le dossier contradictoire : l'un des");
      L.push("deux est faux.");
      L.push("");
      L.push("Devant le comité comme devant le juge, l'employeur ne peut pas opposer un");
      L.push("accord qu'il ne produit pas, et la grille qu'il aura montée sera jugée au");
      L.push("regard du texte que LES PIÈCES établissent, non de celui qu'il affirme.");
      L.push("");
      L.push("ET LES DEUX ACCORDS SE CONFONDENT SOUVENT. Celui de L. 2312-21 définit la");
      L.push("BASE ; celui de L. 2312-19 définit les CONSULTATIONS RÉCURRENTES. Ils");
      L.push("n'ont pas le même objet, et un accord unique intitulé « dialogue social »");
      L.push("peut porter l'un, l'autre, les deux, ou aucun : c'est la stipulation qui");
      L.push("décide, pas le titre.");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · accord d'entreprise : " + etat(f.accordEntreprise, "OUI", "non") +
        " — versé : " + etat(f.accordEntrepriseVerse, "oui", "NON"));
      L.push("  · accord de branche : " + etat(f.accordBranche, "OUI", "non") +
        " — versé : " + etat(f.accordBrancheVerse, "oui", "NON"));
      L.push("  · accord sur la périodicité des consultations (L. 2312-19) : " +
        etat(f.accordPeriodiciteConsultations, "OUI", "non"));
      L.push("  · pièces versées : " + (pieces.length ? pieces.length : "AUCUNE"));
      for (var i = 0; i < pieces.length; i++) {
        var pc = pieces[i];
        pousserPlie(L, typeof pc === "string" ? pc :
          String((pc && (pc.nom || pc.type)) || "pièce"), 66, "      – ", "        ");
      }
      L.push("");

      L.push(GROS);
      L.push("BORDEREAU DES PIÈCES");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("Arrêté le " + leJour(aujourd(ctx)) + ".");
      L.push("");
      L.push("ARTICLE 1 — LA GRILLE DE QUALIFICATION DE CHAQUE ACCORD VERSÉ");
      L.push("");
      L.push("Pour chaque accord au dossier, quatre questions. Elles se posent sur le");
      L.push("TEXTE, pas sur l'intitulé.");
      L.push("");
      L.push("  Q1. Définit-il l'organisation, l'architecture et le contenu de la base");
      L.push("      (L. 2312-21, 1°) ?");
      L.push("  Q2. Définit-il les modalités de fonctionnement de la base — droits");
      L.push("      d'accès, niveau de mise en place, support, modalités de");
      L.push("      consultation et d'utilisation (L. 2312-21, 2°) ?");
      L.push("  Q3. Définit-il le contenu, la périodicité ou les modalités des");
      L.push("      consultations récurrentes (L. 2312-19) ? — alors il ne règle pas la");
      L.push("      base.");
      L.push("  Q4. Dans quelles conditions a-t-il été conclu ? L. 2312-21 n'ouvre que");
      L.push("      deux voies : les signatures des organisations syndicales dans les");
      L.push("      conditions du premier alinéa de L. 2232-12, ou, en l'absence de");
      L.push("      délégué syndical, l'adoption par le comité à la majorité des");
      L.push("      membres titulaires de la délégation du personnel.");
      L.push("");
      L.push("  pièce                        │ date     │ Q1 │ Q2 │ Q3 │ Q4");
      L.push("  ─────────────────────────────┼──────────┼────┼────┼────┼──────────────");
      for (var k = 0; k < 6; k++)
        L.push("  [...........................] │ [......] │[ ] │[ ] │[ ] │ [...........]");
      L.push("");
      L.push("L'article L. 2232-12, auquel L. 2312-21 renvoie, N'A PAS ÉTÉ LU À LA");
      L.push("SOURCE par ce module : il est nommé, non reproduit. Vérifiez-y les");
      L.push("conditions de conclusion avant de répondre à Q4.");
      L.push("");
      L.push("ARTICLE 2 — LE CONSTAT, LORSQU'AUCUN ACCORD NE DÉFINIT LA BASE");
      L.push("");
      L.push("« Je soussigné " + signataire(ctx) + ",");
      L.push("agissant en qualité de représentant légal de " + nomDe(ctx) + ",");
      L.push("constate qu'à la date du " + leJour(aujourd(ctx)) + ", aucun accord");
      L.push("d'entreprise au sens du premier alinéa de l'article L. 2312-21 du code du");
      L.push("travail, ni aucun accord de branche au sens de son dernier alinéa, ne");
      L.push("définit l'organisation, l'architecture, le contenu ou les modalités de");
      L.push("fonctionnement de la base de données économiques, sociales et");
      L.push("environnementales de l'entreprise.");
      L.push("");
      L.push("Recherches effectuées : [accords d'entreprise en vigueur consultés le");
      L.push(".............. ; convention collective et accords de branche consultés le");
      L.push("..............].");
      L.push("");
      L.push("En conséquence, le contenu de la base est celui que fixe l'article " +
        (r.connu ? r.article : "R. 2312-8 ou R. 2312-9") + " du");
      L.push("code du travail" + (r.connu ? ", l'entreprise comptant " + r.effectif + " salariés" : "") + ". »");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("ARTICLE 3 — CE QU'IL FAUT RETIRER DU BORDEREAU");
      L.push("");
      L.push("Les accords qui ne traitent pas de la base n'ont pas leur place dans ce");
      L.push("bordereau : ils y font croire à un régime conventionnel qui n'existe pas.");
      L.push("Retirez-les, et versez-les au dossier qui les concerne — celui de");
      L.push("l'article L. 2312-19 pour les consultations récurrentes.");
      L.push("");
      L.push("Pièces retirées : [.............................................].");
      L.push("");
      L.push("ARTICLE 4 — LA RECTIFICATION DE LA DÉCLARATION");
      L.push("");
      L.push("Régime déclaré avant rectification : [...........................].");
      L.push("Régime retenu après examen des pièces : [........................].");
      L.push("");
      L.push("Les contrôles de contenu ne concluent qu'une fois le régime établi :");
      L.push("relancez l'audit après cette rectification.");
      L.push("");
      L.push("");

      L = L.concat(blocRegime(ctx, r));

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous reprenez le régime déclaré et la liste des pièces versées, et"),
        "    vous dites lequel des deux est erroné.",
        ech(ctx, 7, "chaque accord versé passe la grille de qualification : c'est la"),
        "    stipulation qui décide, pas le titre du document.",
        ech(ctx, 10, "les accords étrangers à la base sont retirés du bordereau, ou"),
        "    l'accord qui la définit est versé en entier.",
        ech(ctx, 14, "la déclaration de régime est rectifiée et l'audit relancé."),
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-19, L. 2312-21, L. 2312-36, R. 2312-8, " +
        "R. 2312-9",
        ["L'article L. 2232-12, auquel L. 2312-21 renvoie pour les conditions de",
         "conclusion de l'accord d'entreprise, n'a pas été lu à la source par ce",
         "module : il est nommé, non reproduit."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     BDESE-CTL-PRV-01 — LE DOSSIER DE PREUVE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("BDESE-CTL-PRV-01", {
    nom: "Le dossier de preuve de la mise à disposition — support, accès, notifications",
    detail: "L'inventaire des pièces qui prouvent la mise à disposition, le " +
            "registre des accès et des envois, et ce que l'application ne peut " +
            "pas attester à votre place.",
    produire: function (ctx) {
      var f = F(ctx), b = B(ctx), r = regimeDe(ctx);
      var L = entete(ctx, "Dossier de preuve de la mise à disposition de la base",
        "article L. 2312-18 du code du travail");

      modeDEmploi(L, "l'inventaire des pièces qui prouveront que la base a été mise à disposition");

      L.push("CE QUE L'APPLICATION NE FERA PAS À VOTRE PLACE");
      L.push("");
      L.push("L'article L. 2312-18 met la base à disposition, et c'est un ACTE DE");
      L.push("L'EMPLOYEUR : c'est à lui de l'établir. Ce module prépare, structure, date");
      L.push("et audite le contenu — il n'est pas la base, et il n'atteste pas la mise à");
      L.push("disposition. Il ne le fera pas, et un rapport d'audit ne vaut pas preuve");
      L.push("de mise à disposition.");
      L.push("");
      L.push("CE QUE L'ABSENCE DE PREUVE COÛTE");
      L.push("");
      L.push("Sans dossier de preuve, l'employeur qui affirme avoir mis la base à");
      L.push("disposition ne peut pas le démontrer. Il perd alors le bénéfice de la");
      L.push("règle du même article : « Les éléments d'information transmis de manière");
      L.push("récurrente au comité sont mis à la disposition de leurs membres dans la");
      L.push("base de données et cette mise à disposition actualisée vaut communication");
      L.push("des rapports et informations au comité, dans les conditions et limites");
      L.push("fixées par un décret en Conseil d'État. »");
      L.push("");
      L.push("Et il perd davantage : sans information datée, le délai de consultation");
      L.push("n'a pas couru (R. 2312-5), donc le terme de R. 2312-6 n'est jamais");
      L.push("intervenu, donc la consultation n'est pas close.");
      L.push("");
      L.push("LA PREUVE SE RÉUNIT AU FIL DES MISES À JOUR, JAMAIS APRÈS COUP. Un journal");
      L.push("de connexions ne se reconstitue pas, et une décharge ne se signe pas");
      L.push("rétroactivement.");
      L.push("");
      L.push("CE QUE VOTRE DOSSIER DÉCLARE DÉJÀ");
      L.push("");
      var elements = [];
      if (!vide(b.support)) elements.push("support déclaré : " + b.support);
      if (!vide(b.dateDerniereMiseAJour)) elements.push("dernière mise à jour : " + jour(b.dateDerniereMiseAJour, "date"));
      if (estOui(b.informationMiseAJour)) elements.push("information des bénéficiaires déclarée");
      if (!vide(b.preuveAcces)) elements.push("trace d'accès : " + b.preuveAcces);
      if (!vide(b.niveau)) elements.push("niveau de mise en place : " + b.niveau);
      if (elements.length) {
        for (var i = 0; i < elements.length; i++)
          pousserPlie(L, elements[i], 66, "  · ", "    ");
      } else {
        L.push("  Aucun élément ne documente la mise à disposition. Le dossier est à");
        L.push("  constituer en entier.");
      }
      L.push("");

      L.push(GROS);
      L.push("DOSSIER DE PREUVE — INVENTAIRE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("Constitué le " + leJour(aujourd(ctx)) + ", tenu au fil des mises à jour.");
      L.push("");
      L.push("PIÈCE 1 — LE SUPPORT");
      L.push("");
      L.push("Description : [espace informatique dédié / intranet / classeur papier");
      L.push("tenu à ..............................].");
      L.push("Date de mise en service : [..............].");
      L.push("");
      L.push("« En l'absence d'accord prévu à l'article L. 2312-21, la base de données");
      L.push("est tenue à la disposition des personnes mentionnées au dernier alinéa de");
      L.push("l'article L. 2312-36 sur un support informatique pour les entreprises");
      L.push("d'au moins trois cents salariés, et sur un support informatique ou papier");
      L.push("pour les entreprises de moins de trois cents salariés » (R. 2312-12).");
      if (r.connu)
        L.push("Votre effectif est de " + r.effectif + " salariés : " +
          (r.effectif >= 300 ? "le support informatique est imposé." : "les deux supports sont admis."));
      else
        L.push("Votre effectif n'est pas renseigné : tranchez sur votre effectif réel.");
      L.push("");
      L.push("PIÈCE 2 — LES TRACES D'ACCÈS QUE CE SUPPORT PRODUIT");
      L.push("");
      L.push("  · support informatique : journal de connexions horodaté, avec");
      L.push("    l'identifiant de chaque bénéficiaire — [conservé à : ............] ;");
      L.push("  · support papier : registre de consultation signé et daté, ou décharges");
      L.push("    de remise — [conservé à : ............] ;");
      L.push("  · dans les deux cas : la liste nominative des accès ouverts, avec la");
      L.push("    date d'ouverture de chacun.");
      L.push("");
      L.push("Ce qui doit s'y voir : que l'accès était ouvert HORS période de");
      L.push("consultation. L'accès est permanent (L. 2312-36) ; une trace qui ne montre");
      L.push("que les semaines de réunion prouve l'inverse de ce qu'on veut prouver.");
      L.push("");
      L.push("PIÈCE 3 — LES INFORMATIONS ENVOYÉES AUX BÉNÉFICIAIRES");
      L.push("");
      L.push("  date d'envoi │ objet de la mise à jour │ destinataires │ preuve");
      L.push("  ─────────────┼─────────────────────────┼───────────────┼──────────────");
      for (var k = 0; k < 12; k++)
        L.push("  [..........] │ [.....................] │ [...........] │ [...........]");
      L.push("");
      L.push("C'est cette pièce qui datera le point de départ des délais de");
      L.push("consultation (R. 2312-5).");
      L.push("");
      L.push("PIÈCE 4 — LA DÉCISION D'ORGANISATION ET LES MODALITÉS");
      L.push("");
      L.push("  · la décision ou l'accord qui fixe le support, les droits d'accès et");
      L.push("    les modalités de consultation et d'utilisation (L. 2312-21, 2° ;");
      L.push("    R. 2312-12) ;");
      L.push("  · la notification de ces modalités aux bénéficiaires, datée ;");
      L.push("  · le rappel écrit de l'obligation de discrétion (L. 2312-36, dernier");
      L.push("    alinéa) et la liste des informations présentées comme");
      L.push("    confidentielles, avec la durée de leur confidentialité (R. 2312-13).");
      L.push("");
      L.push("PIÈCE 5 — LES ÉLÉMENTS D'ANALYSE OU D'EXPLICATION");
      L.push("");
      L.push("R. 2312-14 pose deux conditions cumulatives pour que la mise à disposition");
      L.push("actualisée vaille communication : la condition du second alinéa de");
      L.push("R. 2312-11, et la mise à disposition des éléments d'analyse ou");
      L.push("d'explication « lorsqu'ils sont prévus par le présent code ». Conservez la");
      L.push("trace de ces éléments : sans eux, le bénéfice ne joue pas.");
      L.push("");
      L.push("PIÈCE 6 — LE CLASSEMENT");
      L.push("");
      L.push("Ces pièces sont classées PAR DATE et conservées AVEC la base — non dans un");
      L.push("dossier d'audit. C'est ce dossier, et non le rapport d'audit, qui prouvera");
      L.push("la mise à disposition.");
      L.push("");
      L.push("Lieu de conservation : [..........................................].");
      L.push("Personne qui en répond : [........................................].");
      L.push("");
      L.push("Fait à " + villeDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L = L.concat(calendrier(ctx, [
        ech(ctx, 0, "vous décrivez le support et sa date de mise en service."),
        ech(ctx, 3, "vous réunissez les traces d'accès que ce support produit."),
        ech(ctx, 7, "vous réunissez les informations envoyées sur les douze derniers"),
        "    mois, avec leur date et leurs destinataires.",
        ech(ctx, 10, "les pièces sont classées par date et conservées avec la base."),
        "  · et ensuite, en continu — chaque mise à jour verse sa preuve au dossier.",
        "    Une preuve réunie après coup n'en est pas une.",
      ]));

      return L.concat(pied("L. 2312-18, L. 2312-21, L. 2312-36, R. 2312-5, R. 2312-6, " +
        "R. 2312-11, R. 2312-12, R. 2312-13, R. 2312-14")).join("\n");
    },
  });

/* ICI LES GÉNÉRATEURS */
})(typeof window !== "undefined" ? window : this);
