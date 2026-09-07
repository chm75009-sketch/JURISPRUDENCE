/* LES UNITÉS DE TRAVAIL, PAR MÉTIER, ENTIÈREMENT RÉDIGÉES.

   Ce fichier ne contient pas de gabarit : chaque risque porte sa situation de
   travail décrite en une phrase concrète, sa gravité, sa fréquence, ses
   mesures de prévention détaillées, un responsable et une échéance. C'est ce
   qui permet à l'écran de ne jamais nommer un manque : il affiche le bloc fini
   et l'insère.

   CE QUI EST AFFIRMÉ, ET CE QUI NE L'EST PAS. Les mesures listées sont des
   mesures de prévention proposées, à retenir ou à écarter par l'employeur. Ce
   ne sont pas des énoncés de ce qu'un texte imposerait, et elles ne citent
   aucun article : les seuls articles cités par l'application sont ceux du
   fichier controler-duerp.js, lus à la source le 7 septembre 2026.

   LA COTATION. Gravité de 1 à 4, fréquence de 1 à 4, priorité égale au
   produit. Aucun texte ne l'impose : c'est une aide au classement, et le
   document produit l'écrit.

   LE CODE NAF sert à proposer le bon jeu d'unités. Il ne le décide pas :
   l'utilisateur en change d'un menu, et un poste qui n'existe pas chez lui se
   retire d'un clic. */
"use strict";
(function () {

  var GRAVITE = {
    1: "1 - bénin, soin sur place",
    2: "2 - sérieux, arrêt de travail",
    3: "3 - grave, séquelles possibles",
    4: "4 - très grave, irréversible ou mortel",
  };
  var FREQUENCE = {
    1: "1 - rare, quelques fois par an",
    2: "2 - occasionnelle, quelques fois par mois",
    3: "3 - fréquente, plusieurs fois par semaine",
    4: "4 - permanente, à chaque prise de poste",
  };
  /* Le produit va de 1 à 16. Quatre paliers, et le libellé dit ce qu'on en
     fait, pas ce que le risque « vaut ». */
  function priorite(g, f) {
    var p = g * f;
    if (p >= 12) return { p: p, rang: 4, mot: "action immédiate" };
    if (p >= 8) return { p: p, rang: 3, mot: "prioritaire" };
    if (p >= 4) return { p: p, rang: 2, mot: "à programmer" };
    return { p: p, rang: 1, mot: "à surveiller" };
  }

  /* =================================================================== */
  /* RESTAURATION                                                        */
  /* =================================================================== */
  var RESTAURATION = {
    cle: "restauration",
    nom: "Restauration et débits de boissons",
    naf: "56.10A restauration traditionnelle, 56.10C restauration de type rapide, 56.30Z débits de boissons",
    mots: "restaur|brasserie|pizz|traiteur|snack|café|cafe|bar|hôtel|hotel|cuisine|56.10|56.30|5610|5630",
    secteurs: ["services"],
    unites: [
      { cle: "salle", nom: "Salle et service", m: "salle|service en salle|serveur|runner|chef de rang",
        qui: "Serveurs, runners, chefs de rang, maître d'hôtel. Toute personne qui travaille entre le passe et les tables.",
        risques: [
          { n: "Chute de plain-pied", m: "plain-pied|glissade|sol glissant|sol mouillé|chute",
            s: "Le serveur traverse la salle avec trois assiettes, sur un carrelage rendu glissant par un verre renversé au service précédent.",
            g: 2, f: 3, r: "Responsable de salle", mois: 1,
            mes: [
              "Revêtement antidérapant en salle et dans le sas de la cuisine : spécification R11 au minimum demandée au fournisseur lors du prochain changement de sol.",
              "Kit d'essuyage complet à l'entrée de la salle et au passe (seau, raclette, cône de signalisation), et une consigne écrite : celui qui voit essuie tout de suite, il n'attend pas la fin du service.",
              "Chaussures fermées à semelle antidérapante fournies par l'entreprise, remplacées sur simple demande dès que la semelle est lisse.",
              "Circulation dégagée : passage libre entre les tables, plan de salle affiché en office, aucun carton ni caisse au sol pendant le service.",
            ] },
          { n: "Brûlures et coupures au service", m: "brûlure|brulure|coupure|verre cassé|assiette chaude",
            s: "Le runner sort du passe des assiettes tenues sous cloche à plus de soixante degrés et les porte jusqu'à la table du fond, l'avant-bras chargé.",
            g: 2, f: 3, r: "Responsable de salle", mois: 1,
            mes: [
              "Une manique sèche par personne au passe, remplacée dès qu'elle est humide : un torchon mouillé conduit la chaleur au lieu de l'arrêter.",
              "Plateau ou cloche pour tout plat sorti du four ou de la salamandre, jamais le portage à mains nues.",
              "Verre brisé ramassé à la pelle et à la balayette, jamais à la main ; bac à verre dédié, à couvercle, vidé à chaque fin de service.",
              "Trousse de secours vérifiée le premier lundi de chaque mois, avec compresses stériles et pansements pour brûlure ; tout soin porté au registre.",
            ] },
          { n: "Agression et incivilité de clientèle", m: "agression|incivilité|incivilite|violence|client alcoolisé|menace",
            s: "À 23 h 30, le serveur en fermeture doit refuser un dernier service à un client qui a trop bu et qui hausse le ton.",
            g: 3, f: 2, r: "L'exploitant", mois: 2,
            mes: [
              "Jamais une personne seule en fermeture : deux au minimum jusqu'à la mise en sécurité de la caisse et à la sortie du dernier client.",
              "Conduite à tenir remise à l'embauche et affichée en office : la phrase de refus, l'appel du responsable, l'appel du 17 si la personne ne quitte pas les lieux.",
              "Caisse prélevée à intervalles réguliers, fond de caisse plafonné, coffre à ouverture différée.",
              "Chaque incident est débriefé le lendemain et consigné ; une visite auprès du service de prévention et de santé au travail est proposée à la personne concernée.",
            ] },
          { n: "Horaires coupés, travail en soirée, charge mentale", m: "horaire coupé|coupure|charge mentale|stress|soirée|nuit|rythme",
            s: "Le service du midi se termine à 15 h, celui du soir commence à 18 h 30, six jours sur sept en pleine saison.",
            g: 2, f: 4, r: "L'exploitant", mois: 3,
            mes: [
              "Planning remis quinze jours à l'avance et non modifié dans les quarante-huit heures, sauf accord de la personne concernée.",
              "Deux jours de repos consécutifs par quinzaine au minimum, portés au planning et non reportables sans accord écrit.",
              "Local de pause assis, hors de vue de la clientèle, avec de l'eau et de quoi se restaurer.",
              "Point d'équipe de quinze minutes en début de mois : ce qui a coincé, ce qu'on change. Les décisions sont écrites au cahier de service.",
            ] },
          { n: "Port de charges et station debout prolongée", m: "port de charge|manutention|station debout|dos|plateau|tms",
            s: "Le serveur porte des plateaux chargés huit à dix heures par jour, presque toujours debout, souvent en montant à l'étage.",
            g: 2, f: 4, r: "Responsable de salle", mois: 6,
            mes: [
              "Chariot de desserte pour tout ce qui peut rouler : débarrassage, mise en place, réapprovisionnement du bar.",
              "Plateaux allégés : deux voyages plutôt qu'un. La règle est écrite, et aucun responsable ne demande l'inverse.",
              "Tapis anti-fatigue au poste du passe et derrière le comptoir.",
              "Formation aux gestes et postures pour toute nouvelle personne dans le mois de son arrivée, reprise tous les trois ans.",
            ] },
        ] },

      { cle: "cuisine", nom: "Cuisine", m: "cuisine|piano|chef|commis|pâtissier|patissier|cuisson",
        qui: "Chef, seconds, commis, pâtissier. Tout ce qui se passe entre la chambre froide et le passe.",
        risques: [
          { n: "Brûlures par contact, projection ou vapeur", m: "brûlure|brulure|friteuse|projection|vapeur|huile",
            s: "Le commis plonge un panier de frites dans une friteuse à 180 degrés pendant que la casserole du dessus déborde sur le piano.",
            g: 3, f: 3, r: "Chef de cuisine", mois: 1,
            mes: [
              "Aliments égouttés avant toute immersion dans l'huile : l'eau projette l'huile bouillante.",
              "Vidange de la friteuse à froid uniquement, jamais en fin de service sur une huile encore chaude.",
              "Manches longues et gants anti-chaleur au poste de cuisson, couvercles ouverts vers l'extérieur, visage écarté.",
              "Zone d'un mètre dégagée devant les feux : ni caisse, ni bac, ni personne qui traverse.",
              "En cas de brûlure : eau froide quinze minutes, avis du service de secours si la surface dépasse la paume de la main, inscription au registre le jour même.",
            ] },
          { n: "Coupures aux couteaux et aux machines de découpe", m: "coupure|couteau|trancheuse|mandoline|lame",
            s: "Le cuisinier émince deux kilos d'oignons à la mandoline, sans poussoir, en fin de service.",
            g: 2, f: 4, r: "Chef de cuisine", mois: 1,
            mes: [
              "Poussoir et gant anti-coupure obligatoires sur la mandoline et la trancheuse, sans exception de durée : c'est la tranche de trop qui coupe.",
              "Affûtage hebdomadaire des couteaux : un couteau émoussé glisse et blesse davantage qu'un couteau tranchant.",
              "Planche stabilisée sur un linge humide, jamais posée à même l'inox mouillé.",
              "Couteaux transportés lame vers le bas, jamais laissés dans un bac d'eau ni dans un évier plein.",
              "Nettoyage de la trancheuse machine à l'arrêt et débranchée, chariot ramené à zéro.",
            ] },
          { n: "Chute de plain-pied sur sol gras", m: "plain-pied|glissade|sol gras|sol mouillé|chute",
            s: "Le sol devant la friteuse est gras dès le coup de feu, et le commis y passe cent fois par service.",
            g: 2, f: 3, r: "Chef de cuisine", mois: 2,
            mes: [
              "Dégraissage du sol entre les deux services, et pas seulement le soir.",
              "Caillebotis antidérapant devant les postes de cuisson et au passe.",
              "Chaussures de sécurité antidérapantes fournies par l'entreprise et remplacées dès usure de la semelle.",
              "Toute fuite d'eau ou de graisse est portée au cahier de maintenance et réparée sous soixante-douze heures.",
            ] },
          { n: "Incendie et explosion", m: "incendie|feu|explosion|gaz|hotte|extincteur",
            s: "Les graisses s'accumulent dans les filtres de la hotte au-dessus des feux vifs, et le bac à friture est à moins d'un mètre.",
            g: 4, f: 1, r: "L'exploitant", mois: 3,
            mes: [
              "Filtres de hotte dégraissés chaque semaine ; conduit d'extraction nettoyé par une entreprise une fois par an, avec attestation conservée.",
              "Extincteur adapté aux feux de graisse et couverture anti-feu à portée immédiate du poste de friture, jamais derrière un empilement.",
              "Flexibles gaz vérifiés à chaque nettoyage complet et remplacés à l'échéance imprimée dessus.",
              "Emplacement de la coupure générale du gaz repéré, dégagé et affiché ; toute l'équipe sait où il est.",
              "Exercice d'évacuation une fois par an, avec la durée relevée et consignée.",
            ] },
          { n: "Risque chimique lié aux produits de nettoyage", m: "chimique|produit|dégraissant|javel|désinfectant|fds",
            s: "Le commis remplit le pulvérisateur de dégraissant sans gants et range le bidon à côté du désinfectant chloré.",
            g: 2, f: 3, r: "Chef de cuisine", mois: 2,
            mes: [
              "Fiches de données de sécurité rassemblées dans un classeur accessible en cuisine, et non au bureau.",
              "Aucun mélange, aucun transvasement dans une bouteille alimentaire : le produit reste dans son emballage d'origine, étiqueté.",
              "Dosage par centrale de dilution ou par doses préemballées, jamais au jugé.",
              "Gants et lunettes au poste de nettoyage, rangés à côté des produits et non dans un tiroir.",
              "Produits chlorés et produits acides stockés séparément, contenants fermés.",
            ] },
          { n: "Ambiances thermiques", m: "chaleur|ambiance thermique|thermique|canicule|température",
            s: "En juillet, la température devant le piano dépasse largement celle de la salle, et le service dure quatre heures d'affilée.",
            g: 2, f: 3, r: "L'exploitant", mois: 4,
            mes: [
              "Extraction et compensation d'air contrôlées avant chaque été, filtres changés.",
              "Eau fraîche à disposition au poste de cuisson, pas seulement au vestiaire.",
              "Rotation des postes chauds pendant les périodes de forte chaleur, écrite au planning.",
              "Tenue légère et ventilée fournie, chaussures aérées.",
              "Pause supplémentaire de dix minutes toutes les deux heures au-delà d'un seuil de température fixé par écrit et affiché en cuisine.",
            ] },
        ] },

      { cle: "plonge", nom: "Plonge", m: "plonge|plongeur|lave-vaisselle|vaisselle",
        qui: "Plongeur, commis affecté à la plonge, personnel de nettoyage de fin de service.",
        risques: [
          { n: "Chute sur sol constamment mouillé", m: "plain-pied|glissade|sol mouillé|chute|siphon",
            s: "Le sol de la plonge est mouillé du début à la fin du service, et l'évacuation reflue dès que le lave-vaisselle vidange.",
            g: 2, f: 4, r: "Chef de cuisine", mois: 1,
            mes: [
              "Caillebotis antidérapant sur toute la zone de travail, relevé et nettoyé chaque semaine.",
              "Siphon et grille nettoyés chaque jour, débouchage sous vingt-quatre heures dès qu'une évacuation ralentit.",
              "Raclette à demeure et passage du sol à chaque fin de cycle.",
              "Bottes ou chaussures antidérapantes fournies, remplacées dès que la semelle est lisse.",
            ] },
          { n: "Coupures dans les bacs de lavage", m: "coupure|bac|verre cassé|couteau|main",
            s: "Le plongeur plonge la main dans un bac d'eau savonneuse où quelqu'un a laissé un couteau et un verre ébréché.",
            g: 2, f: 3, r: "Chef de cuisine", mois: 1,
            mes: [
              "Interdiction écrite de mettre couteaux et verres dans un bac plein : ils vont dans le bac à couverts, à vue.",
              "Bac à couverts séparé, vidé à vue et jamais rempli d'eau opaque.",
              "Verre ébréché mis au rebut immédiatement, jamais relavé ni remis en service.",
              "Gants de plonge résistants fournis et remplacés dès qu'ils sont percés.",
            ] },
          { n: "Risque chimique lié aux produits lessiviels", m: "chimique|produit lessiviel|alcalin|acide|bidon|projection",
            s: "Le plongeur change le bidon de produit alcalin du lave-vaisselle en fin de service, sans lunettes, la canne d'aspiration dégoulinante.",
            g: 3, f: 3, r: "Chef de cuisine", mois: 1,
            mes: [
              "Dosage automatique branché et contrôlé chaque mois : le dosage à la main est la première cause de projection.",
              "Changement de bidon avec gants à manchette et lunettes, canne posée dans un bac et non sur le sol.",
              "Jamais un produit acide et un produit alcalin ouverts en même temps sur le même poste.",
              "Fiches de données de sécurité affichées en plonge, à hauteur des yeux.",
              "En cas de projection oculaire : rinçage à l'eau pendant quinze minutes et appel du 15, sans attendre de voir si ça passe.",
            ] },
          { n: "Brûlure par la vapeur du lave-vaisselle", m: "vapeur|brûlure|brulure|capot|lave-vaisselle",
            s: "Le capot du lave-vaisselle est relevé dès la fin du cycle et la vapeur monte au visage.",
            g: 2, f: 3, r: "Chef de cuisine", mois: 1,
            mes: [
              "Dix secondes capot fermé après la fin du cycle avant toute ouverture : la consigne est collée sur la machine.",
              "Ouverture en se plaçant de côté, jamais face au capot.",
              "Joint de capot vérifié chaque mois et remplacé dès qu'il fuit.",
            ] },
          { n: "Troubles musculo-squelettiques", m: "tms|poignet|épaule|geste répétitif|bac|manutention",
            s: "Le plongeur soulève des bacs gastronormes pleins et répète le même geste de poignet plusieurs centaines de fois par service.",
            g: 2, f: 4, r: "Chef de cuisine", mois: 6,
            mes: [
              "Hauteur du plan de travail ajustée pour que les coudes restent à angle droit ; rehausse ou marchepied si la personne est petite.",
              "Bacs remplis à mi-hauteur et transportés à deux au-delà.",
              "Chariot à niveau constant pour les piles d'assiettes propres.",
              "Rotation vers un autre poste une heure par service, écrite au planning.",
            ] },
          { n: "Ambiance humide, chaude et bruyante", m: "humidité|humide|chaleur|bruit|ambiance",
            s: "La plonge est un local fermé, chaud et humide, où la machine tourne en continu pendant tout le service.",
            g: 1, f: 4, r: "L'exploitant", mois: 6,
            mes: [
              "Extraction vérifiée une fois par an et remise en état si le débit a chuté.",
              "Tenue de rechange à disposition sur place.",
              "Pauses prises hors de la plonge, dans le local de pause.",
              "Capot maintenu fermé pendant le cycle : c'est aussi ce qui fait le bruit.",
            ] },
        ] },

      { cle: "bar", nom: "Bar", m: "bar|barman|comptoir|limonadier|fût|fut",
        qui: "Barman, limonadier, aide de bar, personne affectée au comptoir.",
        risques: [
          { n: "Coupures sur la verrerie", m: "coupure|verre|verrerie|glace|éclat",
            s: "Le barman casse un verre au-dessus du bac à glace et doit récupérer les éclats parmi les glaçons.",
            g: 2, f: 3, r: "Responsable de bar", mois: 1,
            mes: [
              "Pelle à glace exclusivement, jamais un verre plongé dans le bac.",
              "Tout le bac est jeté dès qu'un verre s'y casse : la consigne est écrite, personne n'a à en discuter en plein service.",
              "Gant anti-coupure pour la remise en état du bac.",
              "Poubelle à verre à couvercle sous le comptoir, vidée à chaque fermeture.",
            ] },
          { n: "Manutention des fûts et des casiers", m: "fût|fut|casier|cave|manutention|escalier",
            s: "Le barman descend un fût de trente litres à la cave par un escalier étroit, seul, avant le service.",
            g: 2, f: 3, r: "Responsable de bar", mois: 2,
            mes: [
              "Diable à sangle pour tout fût : aucune descente d'escalier avec un fût porté à bras.",
              "Livraison programmée hors service et déchargée à deux.",
              "Éclairage de la cave et main courante de l'escalier vérifiés chaque trimestre.",
              "Casiers stockés entre les hanches et les épaules, les plus lourds au plus près du poste.",
            ] },
          { n: "Chute de plain-pied derrière le comptoir", m: "plain-pied|glissade|comptoir|sol mouillé|chute",
            s: "Le sol derrière le bar reçoit de la glace, du sirop et l'eau du rinçage, sur deux mètres de large où deux personnes se croisent.",
            g: 2, f: 3, r: "Responsable de bar", mois: 1,
            mes: [
              "Tapis caillebotis sur toute la longueur du bar, relevé et lavé chaque semaine.",
              "Nettoyage du sol à chaque changement d'équipe et non seulement à la fermeture.",
              "Écoulement au sol dégagé et grille nettoyée chaque jour.",
              "Chaussures antidérapantes fournies.",
            ] },
          { n: "Bruit et sollicitation de la voix", m: "bruit|sonore|voix|musique|acouphène",
            s: "Le niveau sonore monte à partir de 22 h et le barman parle fort pendant quatre heures pour prendre les commandes.",
            g: 2, f: 3, r: "L'exploitant", mois: 6,
            mes: [
              "Niveau sonore mesuré une fois par an aux heures fortes, et plafonné par un réglage verrouillé sur la sonorisation.",
              "Protections auditives moulées proposées aux personnes régulièrement exposées.",
              "Pause hors zone bruyante toutes les deux heures.",
              "Toute gêne persistante ou acouphène est orientée vers le service de prévention et de santé au travail sans attendre la visite périodique.",
            ] },
          { n: "Fin de service, alcool et agression", m: "agression|fermeture|recette|vol|alcool",
            s: "Le barman ferme seul, avec la recette de la soirée, une caisse à compter et un rideau à descendre sur la rue.",
            g: 3, f: 2, r: "L'exploitant", mois: 2,
            mes: [
              "Fermeture à deux, sans exception, y compris les soirs creux.",
              "Dépôt de la recette en journée, jamais de nuit ; fond de caisse plafonné et prélèvements réguliers.",
              "Éclairage extérieur en état et abords dégagés au moment de la fermeture.",
              "Procédure écrite : en cas de menace, on donne la caisse, on n'oppose rien, on appelle après.",
            ] },
        ] },

      { cle: "livraison", nom: "Livraison et vente à emporter", m: "livraison|livreur|scooter|deux-roues|emporter|coursier",
        qui: "Livreurs à deux-roues ou en véhicule, personnel affecté à la vente à emporter.",
        risques: [
          { n: "Risque routier", m: "routier|route|scooter|accident|circulation|vitesse",
            s: "Le livreur enchaîne quinze courses en scooter un soir de pluie, en consultant l'application au feu rouge.",
            g: 4, f: 3, r: "L'exploitant", mois: 1,
            mes: [
              "Entretien du deux-roues consigné tous les deux mois : pneus, freins, éclairage, rétroviseurs. Un véhicule non conforme ne sort pas.",
              "Casque homologué et équipement de pluie fournis par l'entreprise et remplacés à l'usure.",
              "Téléphone en support fixe, consultation à l'arrêt uniquement.",
              "Règle écrite et rappelée en réunion : aucun délai annoncé au client n'autorise un excès de vitesse ni un franchissement. C'est l'entreprise qui répond du retard, pas le livreur.",
              "Courses regroupées et espacées, et aucun départ en cas d'alerte météorologique.",
            ] },
          { n: "Chute et port de charge dans les escaliers", m: "escalier|chute|sac|charge|étage",
            s: "Le livreur monte quatre étages sans ascenseur avec un sac isotherme de quinze kilos sur le dos.",
            g: 2, f: 3, r: "L'exploitant", mois: 2,
            mes: [
              "Sac à dos réglé et sanglé à la taille, jamais porté à l'épaule.",
              "Poids limité par commande : au-delà, la commande est scindée ou livrée en véhicule.",
              "Étage et présence d'un ascenseur demandés à la prise de commande et transmis au livreur.",
              "Chaussures fermées antidérapantes fournies.",
            ] },
          { n: "Agression et vol pendant la tournée", m: "agression|vol|menace|tournée|nuit",
            s: "Le livreur se présente à 23 h dans un hall mal éclairé, avec la recette des courses précédentes en poche.",
            g: 3, f: 2, r: "L'exploitant", mois: 2,
            mes: [
              "Paiement en ligne privilégié et fond de caisse plafonné à un montant écrit.",
              "Départ et retour de chaque course suivis par le point de vente, avec appel de contrôle si une course dépasse le temps prévu.",
              "Consigne écrite : en cas de menace, remettre l'argent et le sac, ne rien discuter, appeler ensuite.",
              "Retour au point de vente et débriefing pour tout incident, même sans blessure.",
            ] },
          { n: "Intempéries et ambiances thermiques", m: "intempérie|froid|pluie|thermique|neige",
            s: "Les tournées d'hiver se font par deux degrés, deux heures d'affilée, à moto.",
            g: 2, f: 3, r: "L'exploitant", mois: 3,
            mes: [
              "Équipement chaud et imperméable fourni, gants compris.",
              "Pause au chaud au retour de chaque tournée, boisson chaude à disposition.",
              "Livraisons suspendues en cas de neige, de verglas ou d'alerte orange : la décision appartient au responsable, pas au livreur.",
            ] },
          { n: "Cadence et charge mentale", m: "cadence|charge mentale|application|délai|stress",
            s: "L'application affiche un temps de course qui défile pendant que le livreur conduit.",
            g: 2, f: 3, r: "L'exploitant", mois: 3,
            mes: [
              "Temps de course affichés comme une cible indicative, jamais comme une injonction.",
              "Aucun classement individuel, aucune sanction fondée sur un temps de course.",
              "Nombre de courses par heure plafonné par écrit.",
              "Point mensuel avec les livreurs sur la charge réelle et les points noirs du secteur.",
            ] },
        ] },
    ],
  };

  window.DuerpMetiers = {
    GRAVITE: GRAVITE, FREQUENCE: FREQUENCE, priorite: priorite,
    METIERS: [RESTAURATION],
  };
})();
