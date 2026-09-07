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

  /* =================================================================== */
  /* COMMERCE DE DÉTAIL                                                  */
  /* =================================================================== */
  var COMMERCE = {
    cle: "commerce",
    nom: "Commerce de détail",
    naf: "47.11 à 47.99 commerce de détail, en magasin ou hors magasin",
    mots: "commerce|détail|detail|magasin|boutique|supérette|superette|épicerie|epicerie|vente|47.|4711|4719",
    secteurs: ["commerce"],
    unites: [
      { cle: "caisse", nom: "Caisse et encaissement", m: "caisse|encaissement|hôtesse|hotesse|scanner",
        qui: "Hôtes et hôtesses de caisse, personnel affecté à l'encaissement, y compris en caisse automatique.",
        risques: [
          { n: "Troubles musculo-squelettiques des membres supérieurs", m: "tms|poignet|épaule|geste répétitif|scanner|coude",
            s: "L'hôtesse de caisse scanne plusieurs centaines d'articles par heure en période de forte affluence, le buste en rotation vers le tapis.",
            g: 2, f: 4, r: "Responsable de magasin", mois: 3,
            mes: [
              "Poste réglé personne par personne à l'arrivée : hauteur du scanner, longueur du tapis, siège assis-debout réglable, repose-pieds.",
              "Alternance caisse et rayon, deux heures maximum d'affilée en caisse aux heures de forte affluence.",
              "Douchette pour les articles lourds ou volumineux, qui ne sont plus soulevés.",
              "Pause de dix minutes toutes les deux heures les jours de forte affluence, inscrite au planning.",
              "Formation au réglage du poste dès la première journée, refaite à chaque changement de caisse.",
            ] },
          { n: "Station assise-debout prolongée", m: "station debout|assise|jambes|circulation|siège",
            s: "La personne reste au même poste plusieurs heures, sans pouvoir se lever entre deux clients.",
            g: 1, f: 4, r: "Responsable de magasin", mois: 2,
            mes: [
              "Siège assis-debout à chaque caisse, avec repose-pieds réglable.",
              "Autorisation permanente de se lever entre deux clients, sans avoir à demander : la consigne est dite à l'équipe et à l'encadrement.",
              "Chaussures adaptées, plates et fermées, prises en charge par l'entreprise.",
            ] },
          { n: "Braquage et incivilité au comptoir", m: "braquage|vol|agression|incivilité|incivilite|menace",
            s: "La caissière est seule en caisse le dimanche matin, avec un fonds important et une porte donnant directement sur la rue.",
            g: 4, f: 1, r: "Responsable de magasin", mois: 1,
            mes: [
              "Prélèvements réguliers et coffre à ouverture différée, signalé par une affichette visible depuis la caisse.",
              "Jamais une personne seule à l'ouverture ni à la fermeture.",
              "Consigne écrite et connue de tous : on obéit, on ne résiste pas, on mémorise, on appelle après.",
              "Débriefing dans les quarante-huit heures et soutien psychologique proposé, pris en charge par l'entreprise.",
              "Dépôt de plainte accompagné par l'entreprise, sur le temps de travail.",
            ] },
          { n: "Charge mentale et exigences de la clientèle", m: "charge mentale|client|conflit|stress|refus",
            s: "La caissière doit refuser un remboursement hors délai à un client qui insiste devant la file d'attente.",
            g: 2, f: 3, r: "Responsable de magasin", mois: 2,
            mes: [
              "Procédure de refus écrite et affichée en caisse : la personne l'oppose telle quelle, sans avoir à arbitrer seule.",
              "Appel d'un responsable garanti en moins de deux minutes, à toute heure d'ouverture.",
              "Aucun reproche fait à une personne qui a appliqué la procédure, même si le client se plaint.",
              "Réunion mensuelle sur les incidents survenus, avec décisions écrites.",
            ] },
        ] },

      { cle: "rayon", nom: "Mise en rayon et réserve", m: "rayon|réserve|reserve|mise en rayon|linéaire|stock",
        qui: "Employés de libre-service, vendeurs chargés du réassort, personnel de réserve.",
        risques: [
          { n: "Manutention manuelle et troubles musculo-squelettiques", m: "manutention|port de charge|dos|tms|palette",
            s: "Le vendeur descend des packs d'eau d'une palette posée au sol et les remonte en linéaire, plusieurs dizaines de fois dans la matinée.",
            g: 2, f: 4, r: "Chef de rayon", mois: 3,
            mes: [
              "Table élévatrice ou palette surélevée : on ne travaille pas au ras du sol.",
              "Transpalette pour tout déplacement de plus de cinq mètres.",
              "Références lourdes rangées entre les hanches et les épaules, jamais au sol ni au-dessus de la tête.",
              "Port à deux au-delà d'un poids fixé par écrit et connu de l'équipe.",
              "Formation gestes et postures dans le mois de l'arrivée, reprise tous les trois ans.",
            ] },
          { n: "Chute de hauteur depuis un escabeau", m: "chute de hauteur|escabeau|échelle|echelle|marchepied",
            s: "Le vendeur monte sur la deuxième traverse d'un escabeau pour attraper un carton en haut du linéaire, un bras déjà chargé.",
            g: 3, f: 3, r: "Chef de rayon", mois: 1,
            mes: [
              "Escabeau à plate-forme et main courante, un par rayon, à sa place marquée.",
              "Interdiction absolue de monter sur un rayonnage, une caisse, une chaise ou un rolls.",
              "Matériel vérifié chaque trimestre et retiré du service dès qu'un patin manque ou qu'une marche joue.",
              "On monte les mains libres : la charge est passée par une deuxième personne ou hissée après.",
            ] },
          { n: "Chute d'objets stockés en hauteur", m: "chute d'objet|rack|rayonnage|gerbage|hauteur",
            s: "Une palette filmée à la hâte est gerbée en réserve au-dessus d'un passage emprunté toute la journée.",
            g: 3, f: 2, r: "Chef de rayon", mois: 2,
            mes: [
              "Charges les plus lourdes toujours au niveau bas des racks.",
              "Filmage systématique des palettes stockées en hauteur.",
              "Hauteur de gerbage limitée, marquée sur le montant du rack, et respectée sans dérogation.",
              "Contrôle visuel des racks une fois par mois ; un rack déformé est mis hors service et vidé le jour même.",
            ] },
          { n: "Heurt par un engin de manutention", m: "heurt|transpalette|engin|chariot|piéton",
            s: "Un transpalette électrique circule dans l'allée de réserve pendant que deux personnes déballent au sol.",
            g: 3, f: 2, r: "Responsable de magasin", mois: 2,
            mes: [
              "Transpalette électrique confié uniquement aux personnes autorisées par l'employeur après formation ; la liste est affichée en réserve.",
              "Allées de réserve dégagées et marquées au sol.",
              "Marche à vitesse d'homme et avertisseur utilisé à chaque angle.",
              "Réserve interdite à la clientèle, porte fermée et signalée.",
            ] },
          { n: "Coupures au déballage", m: "coupure|cutter|carton|cerclage|lame",
            s: "Le vendeur ouvre deux cents cartons dans la matinée avec un cutter à lame fixe, en tirant vers lui.",
            g: 1, f: 4, r: "Chef de rayon", mois: 1,
            mes: [
              "Cutter à lame rétractable automatique fourni à chaque personne ; les cutters à lame fixe sont retirés du magasin.",
              "Coupe en s'éloignant du corps, jamais vers la main qui tient.",
              "Lame changée dès qu'elle accroche : une lame usée demande de la force et dérape.",
              "Cerclages coupés au coupe-cerclage et non au cutter ; gants anti-coupure à disposition.",
            ] },
        ] },

      { cle: "reception", nom: "Réception et livraison", m: "réception|reception|quai|livraison|déchargement",
        qui: "Réceptionnaires, personnel affecté au quai et au contrôle des livraisons.",
        risques: [
          { n: "Chute de quai et manœuvre de hayon", m: "quai|hayon|chute|camion|bord",
            s: "Le réceptionnaire recule sur le quai en tirant un rolls, à trente centimètres du bord, pendant que le hayon descend.",
            g: 3, f: 2, r: "Responsable réception", mois: 1,
            mes: [
              "Bord de quai marqué au sol sur toute sa longueur, et barrière ou garde-corps là où la configuration le permet.",
              "Cale de roue posée avant tout déchargement, clés du camion remises au réceptionnaire pendant l'opération.",
              "Hayon manœuvré par une seule personne, qui garde la vue sur toute la zone.",
              "Aucun déplacement à reculons avec une charge : on tourne le rolls, on ne tourne pas le dos.",
            ] },
          { n: "Coactivité avec les chauffeurs et les entreprises extérieures", m: "coactivité|chauffeur|transporteur|protocole|extérieure",
            s: "Trois camions se présentent en même temps et les chauffeurs circulent sur le quai pendant le déchargement.",
            g: 3, f: 2, r: "Responsable réception", mois: 3,
            mes: [
              "Protocole de sécurité écrit avec chaque transporteur régulier, remis au chauffeur et affiché au quai.",
              "Zone d'attente matérialisée pour les chauffeurs, hors de la zone de manœuvre.",
              "Gilet haute visibilité fourni et porté par toute personne présente sur le quai, chauffeurs compris.",
              "Aucun démarrage de manœuvre tant que la zone n'est pas dégagée, contrôle visuel avant chaque mouvement.",
            ] },
          { n: "Port de charges lourdes au dépotage", m: "port de charge|dépotage|colis|manutention|lourd",
            s: "Le réceptionnaire décharge à la main un camion de colis de vingt kilos, un par un, pendant quarante minutes.",
            g: 2, f: 4, r: "Responsable réception", mois: 3,
            mes: [
              "Transpalette pour toute palette, rolls plutôt que portage manuel dès que c'est possible.",
              "Poids maximal par colis négocié avec les fournisseurs et écrit au cahier des charges.",
              "Aide systématique d'une deuxième personne au-delà de ce poids, sans avoir à la demander.",
              "Rotation avec un poste de contrôle ou de saisie toutes les deux heures.",
            ] },
          { n: "Ambiances thermiques au quai", m: "thermique|froid|quai|courant d'air|température",
            s: "Le quai reste ouvert plusieurs heures en hiver et le réceptionnaire y travaille dans le courant d'air.",
            g: 1, f: 3, r: "Responsable de magasin", mois: 6,
            mes: [
              "Rideau d'air ou sas au quai, porte refermée entre deux livraisons.",
              "Vêtement chaud fourni par l'entreprise, gants compris.",
              "Temps de présence continu au quai limité en dessous d'un seuil de température fixé par écrit.",
              "Boisson chaude à disposition à proximité immédiate.",
            ] },
        ] },

      { cle: "vente", nom: "Accueil et vente conseil", m: "accueil|vente|conseil|surface de vente|client",
        qui: "Vendeurs conseil, personnel d'accueil, responsables de surface de vente.",
        risques: [
          { n: "Station debout prolongée", m: "station debout|jambes|piétinement|fatigue",
            s: "Le vendeur passe la journée debout sur un sol dur, sans siège disponible en zone de vente.",
            g: 1, f: 4, r: "Responsable de magasin", mois: 3,
            mes: [
              "Siège assis-debout à disposition en zone de vente, utilisable sans autorisation.",
              "Tapis anti-fatigue au comptoir et au poste d'emballage.",
              "Rotation dans la journée entre postes debout et postes assis.",
              "Chaussures adaptées prises en charge par l'entreprise.",
            ] },
          { n: "Incivilité et agression verbale", m: "incivilité|incivilite|agression|verbale|client|conflit",
            s: "Un client refuse de quitter le magasin à la fermeture et prend le vendeur à partie devant les autres clients.",
            g: 2, f: 3, r: "Responsable de magasin", mois: 2,
            mes: [
              "Procédure de refus et d'appel d'un responsable écrite et affichée en réserve.",
              "Deux personnes au minimum en zone de vente aux heures sensibles et à la fermeture.",
              "Main courante interne des incidents, relue en réunion chaque mois.",
              "Soutien proposé après tout incident, et temps de retrait immédiat accordé à la personne concernée.",
            ] },
          { n: "Ambiances thermiques liées aux portes ouvertes", m: "thermique|courant d'air|porte|froid|entrée",
            s: "La porte d'entrée reste ouverte toute la journée et le poste d'accueil est placé juste dans le courant d'air.",
            g: 1, f: 3, r: "Responsable de magasin", mois: 6,
            mes: [
              "Rideau d'air chaud à l'entrée, ou fermeture de porte en période froide.",
              "Poste d'accueil déplacé hors de l'axe du courant d'air.",
              "Vêtement adapté fourni pour les personnes affectées à l'entrée.",
            ] },
          { n: "Chute de plain-pied les jours de pluie", m: "plain-pied|glissade|pluie|sol mouillé|chute",
            s: "Les jours de pluie, l'entrée du magasin est trempée sur trois mètres et personne n'a passé la serpillière depuis l'ouverture.",
            g: 2, f: 3, r: "Responsable de magasin", mois: 1,
            mes: [
              "Tapis absorbant déployé dès la première pluie, sur toute la largeur de l'entrée.",
              "Passage de serpillière programmé à heure fixe les jours de pluie, et non à la demande.",
              "Cône de signalisation posé systématiquement pendant et après le passage.",
              "Sol antidérapant à l'entrée lors du prochain remplacement de revêtement.",
            ] },
        ] },
    ],
  };

  /* =================================================================== */
  /* BUREAU ET ACTIVITÉS DE SIÈGE                                        */
  /* =================================================================== */
  var BUREAU = {
    cle: "bureau",
    nom: "Bureau et activités de siège",
    naf: "62, 64, 66, 69, 70, 71, 73, 78, 82 activités de bureau, de conseil et de siège",
    mots: "bureau|siège|siege|conseil|comptab|assurance|informatique|cabinet|agence|administratif|62.|69.|70.|82.",
    secteurs: ["services"],
    unites: [
      { cle: "ecran", nom: "Poste administratif sur écran", m: "écran|ecran|bureau|ordinateur|administratif|informatique",
        qui: "Assistants, gestionnaires, comptables, chargés d'affaires : toute personne dont le travail se fait principalement devant un écran.",
        risques: [
          { n: "Troubles musculo-squelettiques et fatigue visuelle", m: "tms|écran|ecran|nuque|poignet|vue|cervicales",
            s: "La gestionnaire travaille sept heures par jour sur un ordinateur portable posé à plat sur le bureau, sans rehausseur ni clavier séparé.",
            g: 2, f: 4, r: "Le responsable administratif", mois: 2,
            mes: [
              "Sur tout poste équipé d'un portable utilisé plus de deux heures par jour : rehausseur, clavier et souris séparés fournis. C'est la mesure la moins chère et la plus efficace du poste.",
              "Écran à hauteur des yeux, à environ un bras de distance, placé perpendiculairement à la fenêtre et non face à elle ni dos à elle.",
              "Réglage du siège fait avec la personne le jour de son arrivée, et refait à chaque changement de bureau.",
              "Pause visuelle de quelques minutes toutes les heures, regard porté au loin.",
              "Toute gêne visuelle est orientée vers le médecin du travail sans attendre la visite périodique.",
            ] },
          { n: "Sédentarité", m: "sédentarité|sedentarite|assis|immobilité|position assise",
            s: "La personne reste assise sept heures d'affilée, déjeuner compris, sans autre déplacement que celui de l'imprimante.",
            g: 2, f: 4, r: "Le responsable administratif", mois: 4,
            mes: [
              "Réunions courtes tenues debout quand le sujet s'y prête.",
              "Imprimante et corbeille volontairement placées à distance des postes.",
              "Consigne de se lever quelques minutes toutes les heures, rappelée par l'encadrement qui l'applique le premier.",
              "Bureau assis-debout proposé aux personnes suivies pour un mal de dos, sur avis du médecin du travail.",
            ] },
          { n: "Charge de travail et risques psychosociaux", m: "charge de travail|rps|psychosocial|stress|surcharge|burn",
            s: "La comptable traite la paie, les relances et l'accueil téléphonique en même temps, pendant la semaine de clôture.",
            g: 3, f: 3, r: "La direction", mois: 2,
            mes: [
              "Charge évaluée par écrit avant toute nouvelle mission confiée : ce qu'on ajoute, et ce qu'on retire en échange.",
              "Priorités arbitrées par le responsable, jamais laissées à la personne qui les subit.",
              "Remplacement organisé pendant les congés, au lieu du report de la charge au retour.",
              "Droit à la déconnexion écrit, et respecté par l'encadrement en premier : pas de courriel envoyé le soir ni le week-end.",
              "Entretien annuel sur la charge de travail, dont le compte rendu est remis à la personne.",
              "Un interlocuteur nommé, connu de tous, à qui dire que ça ne va pas.",
            ] },
          { n: "Électricité et départ de feu", m: "électricité|electricite|multiprise|incendie|feu|prise",
            s: "Quatre multiprises en cascade alimentent les postes d'un open space, sous un bureau encombré de cartons d'archives.",
            g: 3, f: 1, r: "La direction", mois: 3,
            mes: [
              "Multiprises en cascade supprimées et prises murales ajoutées : c'est un chantier d'une journée, pas un rappel à faire chaque année.",
              "Vérification périodique des installations électriques par un organisme extérieur, rapport conservé et observations levées.",
              "Appareils personnels tolérés seulement s'ils portent le marquage réglementaire et sont en bon état.",
              "Aucun carton d'archives sous les bureaux ni dans les dégagements.",
            ] },
          { n: "Évacuation des locaux", m: "évacuation|evacuation|incendie|issue|rassemblement|exercice",
            s: "Le plan d'évacuation date de l'aménagement précédent et personne dans l'équipe ne sait où se trouve le point de rassemblement.",
            g: 3, f: 1, r: "La direction", mois: 3,
            mes: [
              "Plan d'évacuation à jour affiché à chaque étage, avec le point de rassemblement nommé.",
              "Deux personnes chargées du guidage désignées par fonction et non par nom, pour que la consigne survive aux départs.",
              "Exercice d'évacuation une fois par an, durée relevée et compte rendu écrit.",
              "Visiteurs enregistrés à l'accueil et comptés au rassemblement.",
            ] },
        ] },

      { cle: "accueil", nom: "Accueil et standard", m: "accueil|standard|réception|receptionniste|téléphone",
        qui: "Personnel d'accueil physique et téléphonique.",
        risques: [
          { n: "Charge émotionnelle et incivilité téléphonique", m: "incivilité|incivilite|téléphone|agressivité|charge émotionnelle",
            s: "Le standard reçoit une dizaine d'appels agressifs par semaine, sans que la personne puisse raccrocher.",
            g: 2, f: 3, r: "Le responsable administratif", mois: 2,
            mes: [
              "Droit de transférer un appel devenu agressif, sans avoir à se justifier : la règle est écrite et connue de l'encadrement.",
              "Phrase de fin d'appel formulée à l'avance et connue de tous.",
              "Main courante des appels difficiles, relue chaque mois.",
              "Un quart d'heure hors ligne après un appel violent, accordé d'office.",
            ] },
          { n: "Station assise prolongée et bruit ambiant", m: "assis|bruit|casque|siège|open space",
            s: "La personne d'accueil est assise huit heures dans un hall de passage, avec un casque en continu.",
            g: 1, f: 4, r: "Le responsable administratif", mois: 3,
            mes: [
              "Siège réglable et repose-pieds au poste d'accueil.",
              "Casque individuel à limiteur de niveau sonore, non partagé.",
              "Poste isolé du passage direct par un écran ou une cloison basse.",
              "Pauses prises hors du hall.",
            ] },
          { n: "Intrusion et vol", m: "intrusion|vol|visiteur|badge|sécurité",
            s: "Un inconnu franchit l'accueil pendant que la personne est au téléphone, et circule dans les étages.",
            g: 2, f: 2, r: "La direction", mois: 3,
            mes: [
              "Accueil placé en vue directe de l'entrée.",
              "Bouton d'appel discret relié à un poste toujours occupé.",
              "Badge visiteur et registre d'entrée tenus systématiquement.",
              "Aucun objet de valeur ni sac laissé sur le comptoir.",
            ] },
        ] },

      { cle: "deplacements", nom: "Déplacements professionnels", m: "déplacement|deplacement|route|véhicule|commercial|mission",
        qui: "Commerciaux, techniciens itinérants, toute personne qui conduit pour le travail.",
        risques: [
          { n: "Risque routier", m: "routier|route|accident|véhicule|conduite|vitesse",
            s: "Le commercial enchaîne cinq rendez-vous à trois cents kilomètres, repart à 19 h et téléphone au volant en mains libres.",
            g: 4, f: 2, r: "La direction", mois: 1,
            mes: [
              "Tournées organisées avec un temps de trajet réaliste et une marge : c'est l'organisation qui crée l'excès de vitesse, pas le conducteur.",
              "Aucun rendez-vous fixé de façon à rendre le respect des limitations impossible.",
              "Appels professionnels interdits au volant, y compris en mains libres : le téléphone reste en messagerie et on rappelle à l'arrêt.",
              "Véhicule entretenu selon le carnet, avec justificatif conservé ; pneus contrôlés avant chaque hiver.",
              "Pause de quinze minutes toutes les deux heures, et nuit sur place plutôt que retour tardif au-delà d'une distance fixée par écrit.",
            ] },
          { n: "Fatigue et isolement", m: "fatigue|isolement|seul|travailleur isolé|mission",
            s: "Le technicien intervient seul chez un client, en fin de journée, sans que personne ne sache exactement où il se trouve.",
            g: 2, f: 3, r: "La direction", mois: 2,
            mes: [
              "Planning des interventions connu au bureau, avec l'adresse et l'heure prévue de fin.",
              "Point téléphonique quotidien avec le responsable, et procédure d'alerte écrite si une personne ne donne pas de nouvelles.",
              "Hébergement pris en charge dès que le retour se ferait au-delà d'une heure fixée.",
              "Jours de récupération après une semaine complète de déplacement.",
            ] },
        ] },
    ],
  };

  window.DuerpMetiers = {
    GRAVITE: GRAVITE, FREQUENCE: FREQUENCE, priorite: priorite,
    METIERS: [RESTAURATION, COMMERCE, BUREAU],
  };
})();
