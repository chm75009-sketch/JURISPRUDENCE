/* LE DOCUMENT UNIQUE DU TRANSPORT ROUTIER DE MARCHANDISES.

   POURQUOI CE FICHIER EXISTE

   Le 14 septembre 2026, le document unique de TEC, entreprise de transport de
   quatre-vingt-un salariés, a été contrôlé avec le jeu de risques de
   l'entrepôt : quai, préparation de commandes, chariot, expédition. Il en est
   sorti trois unités de travail et quatre actions. Or le métier de cette
   entreprise, ce sont des conducteurs sur la route toute la journée, et un
   atelier mécanique intégré où l'on travaille sous des poids lourds. Rien de
   cela n'était évalué. Demande du même jour : « un développement particulier
   pour le secteur du transport routier de marchandises », « sachant que TEC a
   aussi un garage mécanique intégré ».

   CE QUE CE FICHIER AJOUTE

   Sept unités de travail, dont celles qui manquaient : la conduite elle-même,
   le chargement et l'arrimage chez le client, l'atelier mécanique et son pont
   élévateur, le lavage et le carburant, l'exploitation. Le risque routier y
   est traité pour ce qu'il est, la première cause d'accident mortel du
   travail, et non comme un déplacement professionnel occasionnel.

   CE QU'IL N'EST PAS

   Ce n'est pas le document unique de TEC : c'est le socle d'un transporteur
   routier de marchandises, à adapter poste par poste. Les cotations proposées
   sont des points de départ, pas des constats : la gravité et la fréquence
   se décident dans l'entreprise, en regardant les postes. Aucune obligation
   n'est créée ici ; les articles qui fondent le document unique sont cités
   par le module de contrôle, lus à la source.                              */

(function (window) {
  "use strict";
  if (!window.DuerpMetiers || !window.DuerpMetiers.ajouter) return;

  var TRANSPORT = {
    cle: "transport",
    nom: "Transport routier de marchandises",
    naf: "49.41A et 49.41B transports routiers de fret, 49.42Z déménagement, 52.29 messagerie",
    mots: "transport routier|transports routiers|fret|messagerie|camion|poids lourd|conducteur routier|" +
      "déménagement|demenagement|49.41|4941|affrètement|affretement|logistique routière",
    secteurs: ["transport et logistique"],
    codes: ["16", "3085"],
    unites: [
      /* ════════════════════════════════════════════════════════════════ */
      { cle: "conduite", nom: "Conduite et route", m: "conduite|route|conducteur|chauffeur|routier|véhicule|tournée",
        qui: "Conducteurs poids lourds, super poids lourds et véhicules légers, en longue distance comme en distribution.",
        risques: [
          { n: "Accident de la circulation", m: "accident|circulation|route|collision|routier",
            s: "Le conducteur termine une tournée de neuf heures dans la nuit, sous la pluie, avec un retard à rattraper sur le dernier client.",
            g: 4, f: 2, r: "Responsable d'exploitation", mois: 1,
            mes: [
              "Tournées construites sur les temps de conduite réglementaires, sans marge prise sur les pauses : le planning ne demande jamais ce que la réglementation interdit.",
              "Consigne écrite : aucun appel ni message pendant la conduite, ni en main ni en kit, l'exploitation rappelle à l'arrêt.",
              "Aucune prime, aucun objectif ni aucune prise de commande n'est assis sur le nombre de livraisons par jour ou sur le respect d'un horaire impossible.",
              "Retard annoncé au client par l'exploitation, jamais rattrapé par le conducteur.",
              "Formation à la conduite préventive au-delà de la formation continue obligatoire, renouvelée tous les cinq ans.",
              "Véhicules entretenus selon le plan d'entretien du constructeur, contrôle avant départ signé chaque jour.",
            ] },
          { n: "Fatigue, horaires décalés et travail de nuit", m: "fatigue|nuit|horaire|sommeil|repos|amplitude",
            s: "Le conducteur grand routier enchaîne des départs à quatre heures, dort en cabine trois nuits par semaine et cumule les amplitudes hautes.",
            g: 3, f: 3, r: "Responsable d'exploitation", mois: 3,
            mes: [
              "Amplitude et temps de service suivis chaque semaine sur les données du chronotachygraphe, écarts examinés avec le conducteur.",
              "Repos quotidiens et hebdomadaires garantis par le planning, y compris en cas d'aléa : un aléa se règle par un remplacement, pas par un repos rogné.",
              "Travailleurs de nuit : suivi individuel régulier de l'état de santé (L. 3122-11) et visite d'information et de prévention préalable à l'affectation sur le poste (R. 4624-18), visites suivies et honorées.",
              "Cabine équipée pour le repos : couchette, rideaux occultants, chauffage à l'arrêt.",
              "Consigne écrite autorisant l'arrêt immédiat en cas de somnolence, sans avoir à se justifier.",
            ] },
          { n: "Agression et incivilité en livraison", m: "agression|incivilité|violence|client|vol|braquage",
            s: "Le conducteur livre seul en centre-ville en fin de journée, avec de la marchandise de valeur et un stationnement en double file.",
            g: 3, f: 2, r: "Responsable d'exploitation", mois: 3,
            mes: [
              "Consigne écrite : aucune résistance en cas d'agression, la marchandise n'a pas la valeur d'une personne.",
              "Téléphone chargé, numéro d'urgence de l'exploitation enregistré, procédure d'alerte connue.",
              "Tournées sensibles doublées ou replanifiées à des heures plus sûres.",
              "Signalement de tout incident dans un registre, examiné en réunion d'exploitation, suivi d'une mesure.",
              "Soutien psychologique proposé après toute agression, et accompagnement pour le dépôt de plainte.",
            ] },
          { n: "Postures de conduite et vibrations", m: "vibration|posture|dos|siège|lombaire|tms",
            s: "Huit heures par jour dans le même siège, sur des routes dégradées, avec un siège qui ne se règle plus.",
            g: 2, f: 4, r: "Chef d'atelier", mois: 4,
            mes: [
              "Sièges à suspension pneumatique entretenus et remplacés dès que le réglage ne tient plus.",
              "Réglage du poste de conduite expliqué à la prise de poste de chaque véhicule, pas seulement à l'embauche.",
              "Pauses effectives hors du véhicule, l'arrêt en cabine n'étant pas une pause.",
              "Véhicules affectés nominativement là où c'est possible, pour éviter les réglages perdus.",
            ] },
          { n: "Travail isolé", m: "isolé|isole|seul|malaise|alerte",
            s: "Un conducteur fait un malaise sur une aire de repos, de nuit, hors de portée de vue.",
            g: 4, f: 1, r: "Responsable d'exploitation", mois: 2,
            mes: [
              "Dispositif d'alerte pour travailleur isolé, ou appel de contrôle à heure fixe avec procédure écrite en cas de non-réponse.",
              "Points de passage connus de l'exploitation, position du véhicule suivie pendant le service.",
              "Numéros d'urgence et conduite à tenir affichés en cabine.",
            ] },
        ] },

      /* ════════════════════════════════════════════════════════════════ */
      { cle: "chargement", nom: "Chargement, arrimage et livraison", m: "chargement|arrimage|hayon|sangle|bâchage|livraison|transpalette",
        qui: "Conducteurs pendant les opérations de chargement et de déchargement, personnel de quai en accompagnement.",
        risques: [
          { n: "Chute de hauteur depuis le plateau, le hayon ou la citerne", m: "chute|hauteur|hayon|plateau|bâche|échelle",
            s: "Le conducteur monte sur le plateau pour sangler, à un mètre quarante, sans protection, sous la pluie.",
            g: 4, f: 3, r: "Responsable d'exploitation", mois: 1,
            mes: [
              "Accès au plateau par une échelle fixe ou une plateforme, jamais par les roues ou les ridelles.",
              "Bâchage et débâchage depuis le sol : bâches à commande latérale, systèmes de bâchage automatique lors du renouvellement.",
              "Hayon utilisé avec garde-corps, charge centrée, et personne sur le hayon en mouvement en dehors de l'opérateur.",
              "Chaussures antidérapantes fournies, semelles vérifiées à l'usure.",
              "Trois points d'appui en montée comme en descente de cabine, rappelés à chaque accueil sécurité.",
            ] },
          { n: "Renversement de charge, arrimage insuffisant", m: "arrimage|sangle|charge|renversement|calage",
            s: "Une palette mal calée bascule à l'ouverture des portes chez le client.",
            g: 4, f: 2, r: "Responsable d'exploitation", mois: 2,
            mes: [
              "Sangles, barres et tapis antiglisse en nombre suffisant dans chaque véhicule, vérifiés au départ.",
              "Sangles contrôlées à chaque usage et retirées dès qu'elles sont coupées ou effilochées.",
              "Ouverture des portes du côté opposé à la charge, à distance, après contrôle visuel.",
              "Formation à l'arrimage pour tous les conducteurs, avec mise à niveau après tout incident.",
            ] },
          { n: "Manutention manuelle et transpalette chez le client", m: "manutention|transpalette|rolls|charge|dos|client",
            s: "Livraison d'un magasin sans quai : trente rolls descendus au hayon puis tirés sur trottoir en pente.",
            g: 3, f: 4, r: "Responsable d'exploitation", mois: 3,
            mes: [
              "Protocole de sécurité écrit avec les clients réguliers : lieu de déchargement, moyens mis à disposition, aide éventuelle.",
              "Transpalette électrique là où les rolls ou les charges dépassent ce qu'un homme tire seul.",
              "Refus possible et assumé d'une livraison qui ne peut se faire sans risque, avec appel à l'exploitation.",
              "Formation gestes et postures orientée sur les situations réelles de livraison, pas sur une salle de cours.",
            ] },
          { n: "Circulation de tiers et manœuvres en cour client", m: "manœuvre|manoeuvre|recul|cour|piéton|guidage",
            s: "Manœuvre en marche arrière dans une cour de supermarché, avec des piétons et sans visibilité à droite.",
            g: 4, f: 3, r: "Responsable d'exploitation", mois: 2,
            mes: [
              "Tour du véhicule avant toute manœuvre en marche arrière dans un lieu non connu.",
              "Guidage par un tiers uniquement si la personne reste visible dans le rétroviseur, consigne écrite.",
              "Caméra de recul et détecteurs sur les véhicules lors du renouvellement.",
              "Gilet haute visibilité porté dès la descente de cabine, sans exception.",
            ] },
        ] },

      /* ════════════════════════════════════════════════════════════════ */
      { cle: "atelier", nom: "Atelier mécanique intégré", m: "atelier|mécanique|mecanique|garage|pont élévateur|maintenance|réparation",
        qui: "Mécaniciens, chefs d'atelier, apprentis et personnel affecté à l'entretien des véhicules.",
        risques: [
          { n: "Travail sous véhicule et pont élévateur", m: "pont élévateur|élévateur|sous véhicule|fosse|levage|béquille",
            s: "Un mécanicien travaille sous un porteur de dix-neuf tonnes levé sur un pont dont la dernière vérification n'est pas retrouvée.",
            g: 4, f: 3, r: "Chef d'atelier", mois: 1,
            mes: [
              "Vérification générale périodique du pont élévateur par un organisme accrédité, rapport classé et levée des réserves tracée.",
              "Charge maximale affichée sur le pont et respectée, y compris pour un véhicule chargé.",
              "Béquilles ou chandelles en complément du pont pour toute intervention prolongée sous le véhicule.",
              "Dégagement d'au moins un mètre vingt autour du pont, matérialisé au sol et tenu libre.",
              "Commande du pont réservée aux personnes désignées par écrit, consignes de débrayage manuel affichées.",
              "[ Si l'atelier comporte une fosse : garde-corps ou couvertures, éclairage et ventilation ; supprimez cette ligne dans le cas contraire ]",
            ] },
          { n: "Risque chimique : huiles, solvants, batteries, gaz d'échappement", m: "chimique|huile|solvant|batterie|acide|échappement|ventilation",
            s: "Vidanges, nettoyage des pièces au solvant et charge de batteries dans le même local, ventilation naturelle.",
            g: 3, f: 4, r: "Chef d'atelier", mois: 3,
            mes: [
              "Inventaire des produits, fiches de données de sécurité à jour et accessibles à l'atelier, en français.",
              "Extraction des gaz d'échappement raccordée aux véhicules qui tournent à l'intérieur.",
              "Local de charge des batteries ventilé et séparé, interdiction de feu nu, rince-œil à proximité.",
              "Gants adaptés au produit, non le même gant pour tout, et changement dès dégradation.",
              "Suppression des produits les plus dangereux lorsqu'un équivalent existe, décision tracée.",
              "Suivi médical adapté et fiche d'exposition tenue pour chaque mécanicien.",
            ] },
          { n: "Bruit de l'atelier", m: "bruit|décibel|acoustique|meuleuse|compresseur|audition",
            s: "Meuleuse, clé à chocs et compresseur dans un local sans traitement acoustique, huit heures par jour.",
            g: 3, f: 3, r: "Chef d'atelier", mois: 4,
            mes: [
              "Mesurage du bruit par poste, refait après tout changement d'équipement.",
              "Protections auditives adaptées, en plusieurs modèles, disponibles à l'entrée de l'atelier.",
              "Traitement acoustique du local ou capotage des machines les plus bruyantes lors du renouvellement.",
              "Examens audiométriques proposés et suivis dans le temps.",
            ] },
          { n: "Projection, coupure et écrasement aux mains", m: "projection|coupure|écrasement|main|outil|disque|lunettes",
            s: "Démontage d'un moyeu grippé à la masse, sans lunettes, avec les doigts au point de pincement.",
            g: 3, f: 4, r: "Chef d'atelier", mois: 2,
            mes: [
              "Lunettes de protection portées dès qu'il y a projection possible, disponibles au poste et non au vestiaire.",
              "Outils entretenus et remplacés dès qu'ils sont déformés ; les outils improvisés sont retirés.",
              "Protecteurs des machines fixes en place et jamais neutralisés, contrôle mensuel signé.",
              "Gants adaptés au geste, retirés près des pièces tournantes.",
            ] },
          { n: "Pneumatiques et énergies accumulées", m: "pneu|pneumatique|jante|air comprimé|ressort|accumulée",
            s: "Gonflage d'un pneu de poids lourd sans cage de sécurité, à côté d'un collègue qui passe.",
            g: 4, f: 2, r: "Chef d'atelier", mois: 2,
            mes: [
              "Cage de gonflage utilisée pour tout pneumatique de poids lourd, personne devant la jante pendant le gonflage.",
              "Consignation des énergies avant intervention : batterie déconnectée, air purgé, circuits hydrauliques dépressurisés.",
              "Procédure écrite pour les ressorts et vérins, avec outillage dédié.",
              "Formation spécifique des mécaniciens au poids lourd, pas seulement au véhicule léger.",
            ] },
          { n: "Incendie et permis de feu", m: "incendie|feu|soudure|extincteur|permis|évacuation",
            s: "Une soudure sur un châssis à deux mètres d'un bidon d'huile et de chiffons gras.",
            g: 4, f: 2, r: "Chef d'atelier", mois: 3,
            mes: [
              "Permis de feu écrit pour tout travail par point chaud, y compris pour une intervention de dix minutes.",
              "Zone dégagée de tout produit inflammable, extincteur adapté à portée immédiate, surveillance après travaux.",
              "Chiffons gras dans un récipient métallique fermé, évacués régulièrement.",
              "Extincteurs vérifiés chaque année, personnel formé à leur usage, exercice d'évacuation annuel.",
            ] },
        ] },

      /* ════════════════════════════════════════════════════════════════ */
      { cle: "cour", nom: "Cour, lavage et carburant", m: "cour|parking|lavage|carburant|cuve|gasoil|circulation",
        qui: "Conducteurs en manœuvre sur le site, personnel de lavage, personnel affecté à la distribution de carburant.",
        risques: [
          { n: "Circulation dans la cour, piétons et poids lourds", m: "circulation|cour|piéton|manœuvre|plan de circulation",
            s: "Un conducteur traverse la cour à pied entre deux camions qui manœuvrent, à la nuit tombée.",
            g: 4, f: 3, r: "Responsable d'exploitation", mois: 2,
            mes: [
              "Plan de circulation affiché à l'entrée : sens unique, zones de manœuvre, cheminements piétons séparés et éclairés.",
              "Gilet haute visibilité obligatoire dans la cour pour tous, visiteurs et chauffeurs extérieurs compris.",
              "Éclairage de la cour vérifié chaque trimestre, points noirs traités.",
              "Vitesse limitée à dix kilomètres par heure sur le site, affichée et respectée par l'encadrement le premier.",
            ] },
          { n: "Glissade et travail par tous temps sur la cour", m: "glissade|verglas|pluie|sol|cour",
            s: "Verglas sur la cour au petit matin, départs en tournée à partir de cinq heures.",
            g: 2, f: 3, r: "Responsable d'exploitation", mois: 4,
            mes: [
              "Salage et déneigement organisés à l'avance, avec une personne désignée et un stock constitué avant l'hiver.",
              "Revêtement de cour entretenu, nids-de-poule et flaques traités.",
              "Chaussures antidérapantes fournies et remplacées à l'usure.",
            ] },
          { n: "Carburant et lavage", m: "carburant|cuve|gasoil|lavage|haute pression|adblue",
            s: "Remplissage à la cuve interne, moteur tournant, à côté du poste de lavage haute pression.",
            g: 3, f: 3, r: "Responsable d'exploitation", mois: 3,
            mes: [
              "Consignes affichées à la cuve : moteur coupé, pas de téléphone, pas de feu, rétention en état.",
              "Bac de rétention et kit anti-pollution disponibles et connus de tous.",
              "Lavage haute pression avec protection des yeux et du corps, jamais de jet vers une personne.",
              "Sol du poste de lavage antidérapant, écoulements entretenus.",
            ] },
        ] },

      /* ════════════════════════════════════════════════════════════════ */
      { cle: "exploitation", nom: "Exploitation et bureau", m: "exploitation|bureau|administratif|planning|affrètement|écran",
        qui: "Exploitants, affréteurs, personnel administratif et d'accueil.",
        risques: [
          { n: "Charge mentale et pression du planning", m: "charge mentale|stress|pression|planning|urgence|rps",
            s: "L'exploitant gère trente conducteurs, les aléas de la route et les appels des clients en même temps, toute la journée.",
            g: 3, f: 4, r: "Le dirigeant", mois: 3,
            mes: [
              "Effectif d'exploitation dimensionné pour absorber les aléas, remplacement prévu pendant les congés.",
              "Interruptions limitées : plages sans appel pour le travail de planification.",
              "Procédure écrite pour les situations dégradées, afin que la décision ne repose pas sur une personne seule.",
              "Point régulier sur la charge de travail, distinct de l'entretien annuel.",
              "Droit à la déconnexion écrit et respecté par l'encadrement le premier.",
            ] },
          { n: "Travail sur écran", m: "écran|ecran|poste|siège|tms|vue",
            s: "Double écran mal placé, siège non réglable, huit heures par jour.",
            g: 1, f: 4, r: "Le dirigeant", mois: 4,
            mes: [
              "Siège réglable, écrans à hauteur des yeux, distance d'un bras, éclairage sans reflet.",
              "Pause de quelques minutes toutes les deux heures, hors écran.",
              "Examen de la vue proposé au service de prévention et de santé au travail.",
            ] },
          { n: "Agression verbale au téléphone et à l'accueil", m: "agression|verbale|téléphone|accueil|incivilité",
            s: "Appels de clients mécontents plusieurs fois par jour, parfois insultants, sans soutien organisé.",
            g: 2, f: 3, r: "Le dirigeant", mois: 3,
            mes: [
              "Conduite à tenir écrite : fin d'appel possible après avertissement, sans avoir à se justifier.",
              "Relais par l'encadrement pour les clients difficiles, le salarié n'est pas laissé seul.",
              "Incidents consignés et examinés, mesures prises avec le client concerné.",
            ] },
        ] },
    ],
  };

  window.DuerpMetiers.ajouter(TRANSPORT);
})(window);
