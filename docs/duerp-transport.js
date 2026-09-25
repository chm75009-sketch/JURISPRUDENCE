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
            cond: "consigne téléphone rédigée par la direction et remise contre décharge en novembre ; plannings revus avec l'exploitation avant le 15 du mois ; deux sessions de conduite préventive réservées auprès de l'organisme retenu",
            ind: "aucune tournée dont le temps de conduite dépasse la réglementation sur le mois ; nombre de conducteurs formés sur l'effectif",
            mes: [
              "Tournées construites sur les temps de conduite réglementaires, sans marge prise sur les pauses : le planning ne demande jamais ce que la réglementation interdit.",
              "Consigne écrite : aucun appel ni message pendant la conduite, ni en main ni en kit, l'exploitation rappelle à l'arrêt.",
              "Aucune prime, aucun objectif ni aucune prise de commande n'est assis sur le nombre de livraisons par jour ou sur le respect d'un horaire impossible.",
              "Retard annoncé au client par l'exploitation, jamais rattrapé par le conducteur.",
              "Formation à la conduite préventive tous les cinq ans, qui s'ajoute à la formation continue obligatoire du transport et ne s'y substitue pas.",
              "Véhicules entretenus selon le plan d'entretien du constructeur, contrôle avant départ signé chaque jour.",
            ] },
          { n: "Fatigue, horaires décalés et travail de nuit", m: "fatigue|nuit|horaire|sommeil|repos|amplitude",
            s: "Le conducteur grand routier enchaîne des départs à quatre heures, dort en cabine trois nuits par semaine et cumule les amplitudes hautes.",
            g: 3, f: 3, r: "Responsable d'exploitation", mois: 3,
            cond: "extraction hebdomadaire des données du chronotachygraphe par l'exploitation, écarts examinés avec le conducteur sous huit jours ; visites de nuit programmées avec le service de santé au travail",
            ind: "nombre d'écarts d'amplitude par mois, en baisse d'un trimestre à l'autre ; visites de nuit honorées sur visites dues",
            mes: [
              "Amplitude et temps de service suivis chaque semaine sur les données du chronotachygraphe, écarts examinés avec le conducteur.",
              "Repos quotidiens et hebdomadaires garantis par le planning, y compris en cas d'aléa : un aléa se règle par un remplacement, pas par un repos rogné.",
              "Travailleurs de nuit : visite d'information et de prévention préalable à l'affectation sur le poste (R. 4624-18), puis modalités de suivi adaptées arrêtées à l'issue de cette visite, selon une périodicité qui n'excède pas trois ans (R. 4624-17), dans le cadre du suivi individuel régulier que leur reconnaît L. 3122-11. Visites suivies et honorées.",
              "Cabine équipée pour le repos : couchette, rideaux occultants, chauffage à l'arrêt.",
              "Consigne écrite autorisant l'arrêt immédiat en cas de somnolence, sans avoir à se justifier.",
            ] },
          { n: "Agression et incivilité en livraison", m: "agression|incivilité|violence|client|vol|braquage",
            s: "Le conducteur livre seul en centre-ville en fin de journée, avec de la marchandise de valeur et un stationnement en double file.",
            g: 3, f: 2, r: "Responsable d'exploitation", mois: 3,
            cond: "registre des incidents ouvert par l'exploitation ; tournées sensibles repérées avec les conducteurs puis replanifiées ; convention passée avec un service de soutien psychologique",
            ind: "nombre d'incidents déclarés et suivis d'une mesure ; délai entre l'incident et la mesure",
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
            cond: "deux sièges remplacés par trimestre au fil des révisions, en commençant par les grands routiers ; réglage expliqué à la remise de chaque véhicule",
            ind: "nombre de sièges remplacés sur le parc ; plaintes lombaires signalées au service de santé au travail",
            mes: [
              "Sièges à suspension pneumatique entretenus et remplacés dès que le réglage ne tient plus.",
              "Réglage du poste de conduite expliqué à la prise de poste de chaque véhicule, pas seulement à l'embauche.",
              "Pauses effectives hors du véhicule, l'arrêt en cabine n'étant pas une pause.",
              "Véhicules affectés nominativement là où c'est possible, pour éviter les réglages perdus.",
            ] },
          { n: "Travail isolé", m: "isolé|isole|seul|malaise|alerte",
            s: "Un conducteur fait un malaise sur une aire de repos, de nuit, hors de portée de vue.",
            g: 4, f: 1, r: "Responsable d'exploitation", mois: 2,
            cond: "dispositif d'alerte pour travailleur isolé chiffré par deux fournisseurs avant fin novembre, ou appel de contrôle à heure fixe écrit en procédure dès ce mois-ci",
            ind: "essais d'alerte réussis sur essais faits ; délai de réaction de l'exploitation à un non-retour",
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
            cond: "échelle fixe ou plateforme d'accès commandée pour les porteurs bâchés ; bâches à commande latérale au renouvellement ; chaussures vérifiées à l'usure lors de la remise des équipements",
            ind: "nombre de véhicules équipés d'un accès conforme sur le parc ; aucune chute déclarée sur l'année",
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
            cond: "dotation d'arrimage refaite véhicule par véhicule par l'atelier ; formation arrimage pour tous les conducteurs en deux sessions ; contrôle au départ porté sur la fiche journalière",
            ind: "véhicules dont la dotation est complète au contrôle mensuel ; nombre de charges déplacées constatées à l'arrivée",
            mes: [
              "Sangles, barres et tapis antiglisse en nombre suffisant dans chaque véhicule, vérifiés au départ.",
              "Sangles contrôlées à chaque usage et retirées dès qu'elles sont coupées ou effilochées.",
              "Ouverture des portes du côté opposé à la charge, à distance, après contrôle visuel.",
              "Formation à l'arrimage pour tous les conducteurs, avec mise à niveau après tout incident.",
            ] },
          { n: "Manutention manuelle et transpalette chez le client", m: "manutention|transpalette|rolls|charge|dos|client",
            s: "Livraison d'un magasin sans quai : trente rolls descendus au hayon puis tirés sur trottoir en pente.",
            g: 3, f: 4, r: "Responsable d'exploitation", mois: 3,
            cond: "protocole de sécurité écrit avec les dix premiers clients réguliers avant mars ; transpalette électrique acheté pour les tournées de rolls ; formation gestes et postures sur site",
            ind: "clients réguliers couverts par un protocole sur le total ; nombre de refus de livraison motivés par un risque",
            mes: [
              "Protocole de sécurité écrit avec les clients réguliers : lieu de déchargement, moyens mis à disposition, aide éventuelle.",
              "Transpalette électrique là où les rolls ou les charges dépassent ce qu'un homme tire seul.",
              "Refus possible et assumé d'une livraison qui ne peut se faire sans risque, avec appel à l'exploitation.",
              "Formation gestes et postures orientée sur les situations réelles de livraison, pas sur une salle de cours.",
            ] },
          { n: "Circulation de tiers et manœuvres en cour client", m: "manœuvre|manoeuvre|recul|cour|piéton|guidage",
            s: "Manœuvre en marche arrière dans une cour de supermarché, avec des piétons et sans visibilité à droite.",
            g: 4, f: 3, r: "Responsable d'exploitation", mois: 2,
            cond: "consigne de guidage écrite et remise aux conducteurs ; caméras de recul posées au renouvellement des véhicules ; gilets renouvelés en dotation",
            ind: "véhicules équipés d'une caméra de recul sur le parc ; incidents de manœuvre déclarés par trimestre",
            mes: [
              "Tour du véhicule avant toute manœuvre en marche arrière dans un lieu non connu.",
              "Guidage par un tiers uniquement si la personne reste visible dans le rétroviseur, consigne écrite.",
              "Caméra de recul et détecteurs sur les véhicules lors du renouvellement.",
              "Gilet haute visibilité porté dès la descente de cabine, sans exception.",
            ] },
          /* LES MARCHANDISES DANGEREUSES.

             Absentes du document alors que l'entreprise a des conducteurs
             ADR : relevé le 25 septembre 2026. Le risque est posé ici, sur
             l'unité du chargement, parce que c'est au chargement et au
             déchargement qu'il se joue d'abord. Les mesures décrivent
             l'organisation ; l'application ne cite pas l'accord européen
             lui-même, qu'elle n'a pas lu à la source. */
          { n: "Marchandises dangereuses", m: "adr|matière dangereuse|matieres dangereuses|dangereuse|citerne|épandage|epandage|étiquetage",
            s: "Un conducteur charge des fûts de classe 3 sans que les documents de transport ni les plaques aient été vérifiés, et le kit d'épandage du véhicule est incomplet.",
            g: 4, f: 2, r: "Conseiller à la sécurité", mois: 1,
            cond: "conseiller à la sécurité désigné par lettre avant fin octobre ; équipements de bord vérifiés au départ sur la fiche journalière ; formations spéciales suivies avant expiration",
            ind: "conducteurs à formation valide sur conducteurs affectés ; équipements de bord complets au contrôle",
            mes: [
              "Conseiller à la sécurité désigné et joignable, ses rapports annuels classés et ses observations suivies d'effet.",
              "Conducteurs titulaires d'une formation spéciale en cours de validité pour les classes transportées, et pour la citerne lorsqu'elle est utilisée.",
              "Consignes écrites de sécurité à bord, dans une langue que le conducteur lit, vérifiées au départ avec les documents de transport.",
              "Équipement de bord contrôlé avant chaque départ : extincteurs, protection individuelle, kit d'épandage, cales, signalisation.",
              "Plaques, étiquettes et signalisation orange posées et retirées selon le chargement réel, jamais laissées sur un véhicule vide.",
              "Interdiction de charger un colis endommagé ou mal étiqueté, avec consigne écrite d'appeler l'exploitation plutôt que de décider seul.",
              "Conduite à tenir en cas de fuite ou d'accident affichée en cabine : se mettre en sécurité, baliser, alerter, ne jamais intervenir seul sur le produit.",
              "[ Classes transportées par l'entreprise, véhicules concernés et nom du conseiller à la sécurité : à écrire ]",
            ] },
        ] },

      /* ════════════════════════════════════════════════════════════════ */
      /* LE QUAI ET LA MANUTENTION, UNE UNITÉ À PART.

         Le chargement était décrit du côté du conducteur seulement. Les
         manutentionnaires, le chariot, le gerbage et le transpalette n'avaient
         donc aucune unité, alors que R. 4121-1 veut l'inventaire « dans chaque
         unité de travail ». Relevé le 25 septembre 2026. */
      { cle: "quai-manutention", nom: "Quai et manutention", m: "quai|manutention|manutentionnaire|chariot|cariste|gerbage|palette|transpalette|entrepôt",
        qui: "Manutentionnaires, caristes et personnel de quai, pendant la réception, le tri et l'expédition.",
        risques: [
          { n: "Chute depuis le quai et heurt par un véhicule", m: "quai|chute|heurt|niveleur|recul|camion",
            s: "Un agent recule d'un pas sur le bord du quai pendant qu'un porteur se met à quai, sans butoir ni signal.",
            g: 4, f: 2, r: "Responsable d'exploitation", mois: 1,
            cond: "butoirs et garde-corps escamotables posés aux portes non utilisées par l'entreprise de maintenance ; marquage des cheminements piétons au sol pendant la fermeture d'août",
            ind: "portes de quai protégées sur le total ; aucun heurt ni chute déclarés sur l'année",
            mes: [
              "Bords de quai matérialisés, butoirs et garde-corps escamotables aux portes non utilisées.",
              "Calage ou blocage du véhicule à quai, clés remises à l'exploitation ou feu de quai asservi, personne ne repart sur un simple geste.",
              "Niveleur de quai vérifié périodiquement, manœuvre réservée au personnel désigné par écrit.",
              "Cheminements piétons tracés au sol et respectés, gilet haute visibilité sur tout le quai.",
            ] },
          { n: "Conduite de chariot automoteur et gerbage", m: "chariot|cariste|caces|autorisation de conduite|gerbage|rayonnage",
            s: "Un cariste gerbe une palette filmée en hauteur, à la limite de charge, avec un collègue qui passe dans l'allée.",
            g: 4, f: 3, r: "Responsable d'exploitation", mois: 1,
            cond: "autorisations de conduite délivrées par écrit après formation et avis médical avant fin décembre ; charges affichées par rayonnage ; contrôle annuel des rayonnages commandé à un organisme",
            ind: "caristes titulaires d'une autorisation à jour sur caristes affectés ; réserves du contrôle des rayonnages levées",
            mes: [
              "Autorisation de conduite délivrée par écrit après formation, aptitude médicale et connaissance des lieux, tenue à jour.",
              "Charges et hauteurs de gerbage affichées par rayonnage, et jamais dépassées, même pour une palette.",
              "Vitesse limitée dans l'entrepôt, klaxon aux croisements, allées dégagées et éclairées.",
              "Rayonnages contrôlés une fois par an, échelles et lisses endommagées remplacées sans délai.",
              "Piétons interdits dans les allées de gerbage pendant les manœuvres, séparation matérialisée.",
              "Chariots vérifiés chaque jour par le conducteur, défauts consignés et traités avant remise en service.",
            ] },
          { n: "Manutention manuelle et port de charges", m: "manutention|charge|port|dos|lombalgie|gestes et postures",
            s: "Trois heures de tri de colis au sol, en torsion, avec des charges de vingt kilos reprises une à une.",
            g: 3, f: 4, r: "Responsable d'exploitation", mois: 2,
            cond: "tables élévatrices chiffrées pour les deux postes de tri ; rotation écrite avec l'encadrement du quai ; deux sessions de trois heures de gestes et postures hors période de pointe",
            ind: "manutentionnaires formés sur l'effectif du quai ; nombre de jours d'arrêt liés au dos sur l'année",
            mes: [
              "Aides à la manutention à portée du poste : transpalette, table élévatrice, convoyeur, diable.",
              "Hauteurs de travail revues pour éviter le tri au sol et les reprises en torsion.",
              "Formation gestes et postures assise sur les charges et les gestes réels du quai.",
              "Rotation des tâches sur les postes les plus répétitifs, et pauses tenues.",
              "[ Charges unitaires maximales retenues dans l'entreprise, par poste : à écrire ]",
            ] },
        ] },

      /* ════════════════════════════════════════════════════════════════ */
      { cle: "atelier", nom: "Atelier mécanique intégré", m: "atelier|mécanique|mecanique|garage|pont élévateur|maintenance|réparation",
        qui: "Mécaniciens, chefs d'atelier, apprentis et personnel affecté à l'entretien des véhicules.",
        risques: [
          { n: "Travail sous véhicule et pont élévateur", m: "pont élévateur|élévateur|sous véhicule|fosse|levage|béquille",
            s: "Un mécanicien travaille sous un porteur de dix-neuf tonnes levé sur un pont dont la dernière vérification n'est pas retrouvée.",
            g: 4, f: 3, r: "Chef d'atelier", mois: 1,
            cond: "vérification générale périodique commandée à un organisme accrédité, réserves levées sous trente jours ; béquilles achetées ; zone de dégagement tracée au sol par l'atelier",
            ind: "vérification à jour et réserves levées ; interventions sous véhicule avec béquilles sur interventions prolongées",
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
            cond: "inventaire des produits et fiches de données de sécurité rassemblées par le chef d'atelier avant fin novembre ; extraction des gaz devisée ; local de charge séparé aménagé",
            ind: "produits avec fiche à jour sur produits présents ; mesures d'exposition conformes aux valeurs limites",
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
            cond: "mesurage par poste commandé à un organisme avant mars ; protections auditives en trois modèles posées à l'entrée de l'atelier ; capotage étudié au renouvellement des machines",
            ind: "postes mesurés sur postes exposés ; port effectif constaté lors des contrôles mensuels",
            mes: [
              "Mesurage du bruit par poste, refait après tout changement d'équipement.",
              "Protections auditives adaptées, en plusieurs modèles, disponibles à l'entrée de l'atelier.",
              "Traitement acoustique du local ou capotage des machines les plus bruyantes lors du renouvellement.",
              "Examens audiométriques proposés et suivis dans le temps.",
            ] },
          { n: "Projection, coupure et écrasement aux mains", m: "projection|coupure|écrasement|main|outil|disque|lunettes",
            s: "Démontage d'un moyeu grippé à la masse, sans lunettes, avec les doigts au point de pincement.",
            g: 3, f: 4, r: "Chef d'atelier", mois: 2,
            cond: "lunettes et gants mis à chaque poste et non au vestiaire ; outils déformés retirés lors de l'inventaire d'octobre ; contrôle mensuel des protecteurs signé par le chef d'atelier",
            ind: "contrôles mensuels signés sur douze ; nombre de blessures aux mains déclarées",
            mes: [
              "Lunettes de protection portées dès qu'il y a projection possible, disponibles au poste et non au vestiaire.",
              "Outils entretenus et remplacés dès qu'ils sont déformés ; les outils improvisés sont retirés.",
              "Protecteurs des machines fixes en place et jamais neutralisés, contrôle mensuel signé.",
              "Gants adaptés au geste, retirés près des pièces tournantes.",
            ] },
          { n: "Pneumatiques et énergies accumulées", m: "pneu|pneumatique|jante|air comprimé|ressort|accumulée",
            s: "Gonflage d'un pneu de poids lourd sans cage de sécurité, à côté d'un collègue qui passe.",
            g: 4, f: 2, r: "Chef d'atelier", mois: 2,
            cond: "cage de gonflage devisée auprès de deux fournisseurs, pose par l'atelier un samedi, mécaniciens formés le jour de la mise en service",
            ind: "gonflages réalisés en cage sur gonflages poids lourds ; procédure de consignation signée par chaque mécanicien",
            mes: [
              "Cage de gonflage utilisée pour tout pneumatique de poids lourd, personne devant la jante pendant le gonflage.",
              "Consignation des énergies avant intervention : batterie déconnectée, air purgé, circuits hydrauliques dépressurisés.",
              "Procédure écrite pour les ressorts et vérins, avec outillage dédié.",
              "Formation spécifique des mécaniciens au poids lourd, pas seulement au véhicule léger.",
            ] },
          { n: "Incendie et permis de feu", m: "incendie|feu|soudure|extincteur|permis|évacuation",
            s: "Une soudure sur un châssis à deux mètres d'un bidon d'huile et de chiffons gras.",
            g: 4, f: 2, r: "Chef d'atelier", mois: 3,
            cond: "carnet de permis de feu ouvert et expliqué en réunion d'atelier ; récipient métallique pour chiffons commandé ; exercice d'évacuation programmé avec le personnel de quai",
            ind: "permis de feu établis sur travaux par point chaud recensés ; exercice annuel réalisé",
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
            cond: "plan de circulation dessiné avec l'exploitation, marquage au sol pendant la fermeture d'août, panneaux commandés avant, sens unique expliqué aux conducteurs au retour",
            ind: "plan affiché et respecté au contrôle trimestriel ; incidents de circulation dans la cour par trimestre",
            mes: [
              "Plan de circulation affiché à l'entrée : sens unique, zones de manœuvre, cheminements piétons séparés et éclairés.",
              "Gilet haute visibilité obligatoire dans la cour pour tous, visiteurs et chauffeurs extérieurs compris.",
              "Éclairage de la cour vérifié chaque trimestre, points noirs traités.",
              "Vitesse limitée à dix kilomètres par heure sur le site, affichée et respectée par l'encadrement le premier.",
            ] },
          { n: "Glissade et travail par tous temps sur la cour", m: "glissade|verglas|pluie|sol|cour",
            s: "Verglas sur la cour au petit matin, départs en tournée à partir de cinq heures.",
            g: 2, f: 3, r: "Responsable d'exploitation", mois: 4,
            cond: "stock de sel constitué avant novembre, personne désignée pour le salage du matin, nids-de-poule traités par l'entreprise de voirie au printemps",
            ind: "matinées de gel traitées avant le premier départ ; chutes de plain-pied déclarées sur l'hiver",
            mes: [
              "Salage et déneigement organisés à l'avance, avec une personne désignée et un stock constitué avant l'hiver.",
              "Revêtement de cour entretenu, nids-de-poule et flaques traités.",
              "Chaussures antidérapantes fournies et remplacées à l'usure.",
            ] },
          { n: "Carburant et lavage", m: "carburant|cuve|gasoil|lavage|haute pression|adblue",
            s: "Remplissage à la cuve interne, moteur tournant, à côté du poste de lavage haute pression.",
            g: 3, f: 3, r: "Responsable d'exploitation", mois: 3,
            cond: "consignes affichées à la cuve par l'exploitation ; kit anti-pollution et bac de rétention vérifiés au même rythme que les extincteurs ; sol du lavage repris en revêtement antidérapant",
            ind: "vérifications du bac et du kit à jour ; aucun épandage non maîtrisé sur l'année",
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
            cond: "renfort d'exploitation prévu au budget pour les congés ; plages sans appel inscrites au planning ; point trimestriel sur la charge, distinct de l'entretien annuel",
            ind: "points de charge tenus sur quatre par an ; heures supplémentaires de l'exploitation par trimestre",
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
            cond: "sièges et supports d'écran remplacés poste par poste sur le budget de l'année ; examen de la vue proposé au service de santé au travail à la prochaine visite",
            ind: "postes conformes sur postes administratifs ; salariés ayant bénéficié de l'examen de la vue",
            mes: [
              "Siège réglable, écrans à hauteur des yeux, distance d'un bras, éclairage sans reflet.",
              "Pause de quelques minutes toutes les deux heures, hors écran.",
              "Examen de la vue proposé au service de prévention et de santé au travail.",
            ] },
          { n: "Agression verbale au téléphone et à l'accueil", m: "agression|verbale|téléphone|accueil|incivilité",
            s: "Appels de clients mécontents plusieurs fois par jour, parfois insultants, sans soutien organisé.",
            g: 2, f: 3, r: "Le dirigeant", mois: 3,
            cond: "conduite à tenir écrite par la direction et remise aux exploitants ; relais par l'encadrement organisé pour les clients difficiles ; incidents consignés dans le même registre que les livraisons",
            ind: "incidents consignés suivis d'une mesure ; nombre d'appels interrompus après avertissement",
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
