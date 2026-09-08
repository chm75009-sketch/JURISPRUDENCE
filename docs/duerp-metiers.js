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
    codes: ["1979", "1501", "1266"],
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
    codes: ["2216", "1517", "573", "1606"],
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
    codes: ["1486", "2098"],
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

  /* =================================================================== */
  /* ENTREPÔT ET LOGISTIQUE                                              */
  /* =================================================================== */
  var ENTREPOT = {
    cle: "entrepot",
    nom: "Entrepôt et logistique",
    naf: "52.10B entreposage et stockage non frigorifique, 52.29A messagerie, 46 commerce de gros",
    mots: "entrepôt|entrepot|logistique|stockage|messagerie|plateforme|préparation de commandes|52.|4941|gros",
    secteurs: ["transport et logistique"],
    codes: ["16"],
    unites: [
      { cle: "quai", nom: "Réception et quai", m: "quai|réception|reception|déchargement|camion|dépotage",
        qui: "Réceptionnaires, agents de quai, personnel affecté au dépotage.",
        risques: [
          { n: "Chute de hauteur depuis le quai", m: "chute de hauteur|quai|bord|garde-corps",
            s: "L'agent de quai recule vers le bord pendant qu'aucun camion n'est à poste, la porte étant restée ouverte.",
            g: 3, f: 2, r: "Responsable de quai", mois: 1,
            mes: [
              "Bord de quai matérialisé au sol et barrière escamotable ou garde-corps à chaque poste sans camion à quai.",
              "Porte de quai fermée dès la fin de l'opération.",
              "Éclairage du quai vérifié chaque trimestre.",
              "Aucun déplacement à reculons avec une charge.",
            ] },
          { n: "Coincement entre camion et quai, départ inopiné", m: "coincement|camion|départ|calage|écrasement",
            s: "Le chauffeur avance de deux mètres alors que le cariste est encore dans la remorque.",
            g: 4, f: 1, r: "Responsable de quai", mois: 1,
            mes: [
              "Protocole de sécurité écrit avec chaque transporteur régulier, remis au chauffeur à son arrivée.",
              "Cale de roue posée et vérifiée avant toute entrée dans la remorque.",
              "Clés du camion remises au responsable de quai pendant toute la durée du déchargement.",
              "Feux rouge et vert au poste à quai, commandés depuis l'intérieur.",
            ] },
          { n: "Manutention manuelle au dépotage", m: "manutention|dépotage|conteneur|colis|port de charge",
            s: "Le dépotage d'un conteneur se fait à la main, colis par colis, pendant deux heures sans relève.",
            g: 2, f: 4, r: "Responsable de quai", mois: 3,
            mes: [
              "Convoyeur mobile ou table à niveau constant pour le dépotage des conteneurs et des camions en vrac.",
              "Poids maximal par colis inscrit au cahier des charges des fournisseurs et vérifié à la réception.",
              "Port à deux au-delà de ce poids, sans avoir à le demander.",
              "Rotation des personnes affectées au dépotage toutes les deux heures.",
            ] },
          { n: "Ambiances thermiques", m: "thermique|froid|chaleur|quai|température",
            s: "En février, la température au quai suit celle de l'extérieur pendant toute la vacation.",
            g: 2, f: 3, r: "Responsable d'exploitation", mois: 4,
            mes: [
              "Quai fermé ou sas d'isolation entre le quai et l'entrepôt.",
              "Vêtements adaptés fournis, gants compris, renouvelés à l'usure.",
              "Local de pause chauffé accessible depuis le quai sans traverser tout l'entrepôt.",
              "Temps d'exposition continu limité, avec des seuils de température fixés par écrit et affichés.",
              "Eau fraîche en été, boisson chaude en hiver, à disposition sur le quai.",
            ] },
        ] },

      { cle: "preparation", nom: "Préparation de commandes", m: "préparation|preparation|picking|commande|préparateur",
        qui: "Préparateurs de commandes, agents de picking, personnel affecté au réapprovisionnement des zones de prélèvement.",
        risques: [
          { n: "Troubles musculo-squelettiques et cadence", m: "tms|cadence|picking|geste répétitif|productivité",
            s: "Le préparateur prend deux cents références par heure, souvent au niveau du sol ou au-dessus des épaules, avec un objectif affiché en permanence sur son terminal.",
            g: 2, f: 4, r: "Chef d'équipe préparation", mois: 3,
            mes: [
              "Références lourdes et à forte rotation placées entre les hanches et les épaules ; la cartographie du picking est revue une fois par an sur ce seul critère.",
              "Objectifs de cadence discutés en réunion d'équipe et jamais affichés en classement individuel.",
              "Rotation des postes dans la vacation, écrite au planning.",
              "Échauffement encadré de dix minutes en début de poste.",
              "Terminal affichant la progression, pas un compte à rebours.",
            ] },
          { n: "Port de charges", m: "port de charge|manutention|dos|colis|lourd",
            s: "Le préparateur soulève seul des colis de vingt kilos depuis le niveau du sol, plusieurs dizaines de fois par vacation.",
            g: 2, f: 4, r: "Chef d'équipe préparation", mois: 3,
            mes: [
              "Chariot ou rolls à niveau constant, réglé à la hauteur de travail.",
              "Aide mécanique obligatoire au-delà d'un poids fixé par écrit et affiché en zone.",
              "Formation gestes et postures à l'arrivée, reprise tous les trois ans.",
              "Palettes de préparation surélevées pour supprimer la prise au ras du sol.",
            ] },
          { n: "Heurt d'un piéton par un engin", m: "heurt|piéton|engin|chariot|allée|circulation",
            s: "Un préparateur à pied traverse une allée au moment où un chariot élévateur sort d'une travée, chargé, sans visibilité.",
            g: 4, f: 2, r: "Responsable d'exploitation", mois: 1,
            mes: [
              "Allées piétonnes peintes au sol et séparées physiquement partout où la largeur le permet.",
              "Gilet haute visibilité fourni et porté par toute personne circulant à pied dans l'entrepôt.",
              "Miroirs à chaque angle mort et vitesse limitée, affichée à l'entrée de chaque allée.",
              "Règle écrite du croisement en allée étroite : le piéton attend en zone dégagée, l'engin passe, le contact visuel est établi avant tout mouvement.",
            ] },
          { n: "Chute de plain-pied", m: "plain-pied|chute|film|sol|allée",
            s: "Des chutes de film et de cerclage traînent dans l'allée de préparation en fin de vacation.",
            g: 2, f: 3, r: "Chef d'équipe préparation", mois: 1,
            mes: [
              "Poubelle à film et à cerclage à chaque tête d'allée, vidée à chaque vacation.",
              "Allées dégagées en fin de poste, contrôlées par le chef d'équipe.",
              "Sol réparé sous quinze jours dès qu'un défaut est signalé.",
              "Éclairage contrôlé chaque trimestre, tubes remplacés sans attendre la panne complète.",
            ] },
        ] },

      { cle: "chariot", nom: "Conduite de chariot automoteur", m: "chariot|cariste|élévateur|caces|autorisation de conduite",
        qui: "Caristes, conducteurs de chariots automoteurs de manutention et de gerbeurs.",
        risques: [
          { n: "Renversement du chariot", m: "renversement|chariot|virage|pente|ceinture",
            s: "Le cariste prend un virage avec une palette levée à trois mètres, sur un sol en légère pente.",
            g: 4, f: 2, r: "Responsable d'exploitation", mois: 1,
            mes: [
              "Conduite réservée aux personnes titulaires d'une autorisation de conduite délivrée par l'employeur après formation et examen d'aptitude ; la liste des personnes autorisées est affichée au quai.",
              "Fourches abaissées en circulation, sans exception de distance.",
              "Ceinture de sécurité bouclée, contrôle effectif par l'encadrement et non simple rappel.",
              "Vitesse maximale et pentes admissibles fixées par écrit et affichées.",
              "Contrôle du chariot en début de poste sur une fiche signée : freins, avertisseur, éclairage, fuites, état des fourches.",
            ] },
          { n: "Heurt et écrasement", m: "heurt|écrasement|avertisseur|recul|piéton",
            s: "Le cariste recule dans une allée où un collègue s'est accroupi pour lire une étiquette basse.",
            g: 4, f: 2, r: "Responsable d'exploitation", mois: 1,
            mes: [
              "Avertisseur sonore utilisé à chaque angle et signal de recul en état de marche, vérifié chaque semaine.",
              "Gyrophare et projecteur de zone bleue là où la configuration s'y prête.",
              "Interdiction absolue de faire monter ou de lever une personne sur les fourches, quelle que soit la raison.",
              "Zone de manœuvre interdite aux piétons pendant le chargement, matérialisée au sol.",
            ] },
          { n: "Chute de la charge", m: "chute de charge|palette|gerbage|filmage|hauteur",
            s: "Une palette dont un dé est cassé se déforme au levage et la charge glisse.",
            g: 3, f: 2, r: "Chef d'équipe expédition", mois: 2,
            mes: [
              "Palette contrôlée avant chaque prise et mise au rebut dès qu'un dé ou une planche est cassé.",
              "Filmage systématique au-delà d'une hauteur fixée, jusqu'au socle de la palette.",
              "Charge centrée sur les fourches, jamais en porte-à-faux.",
              "Hauteur de gerbage limitée et marquée sur les montants des racks.",
            ] },
          { n: "Batteries et énergie de traction", m: "batterie|charge|électrolyte|acide|local de charge",
            s: "Le cariste rebranche la batterie au plomb dans un local de charge encombré, sans écran facial.",
            g: 3, f: 2, r: "Responsable d'exploitation", mois: 2,
            mes: [
              "Charge des batteries dans un local ventilé, signalé et dégagé.",
              "Écran facial, gants et tablier pour toute intervention sur une batterie au plomb.",
              "Rince-œil à proximité immédiate, vérifié chaque mois.",
              "Interdiction de fumer et de vapoter dans le local de charge, affichée à la porte.",
              "Procédure écrite en cas de projection d'électrolyte, affichée dans le local.",
            ] },
          { n: "Vibrations et posture de conduite", m: "vibration|posture|siège|conduite|dos",
            s: "Le cariste passe sept heures sur un siège non réglé, sur un sol bosselé aux joints de dalle.",
            g: 2, f: 3, r: "Responsable d'exploitation", mois: 6,
            mes: [
              "Siège à suspension réglé au poids de chaque conducteur, réglage expliqué et non supposé connu.",
              "Sol réparé et joints de dalle repris : ce sont les défauts du sol qui font les vibrations, pas le chariot.",
              "Rotation avec un poste au sol dans la journée.",
              "Suivi médical demandé pour les conducteurs à temps plein.",
            ] },
        ] },

      { cle: "expedition", nom: "Expédition et filmage", m: "expédition|expedition|filmeuse|filmage|palettisation|cutter",
        qui: "Agents d'expédition, opérateurs de filmeuse, personnel de contrôle départ.",
        risques: [
          { n: "Coupure au cutter", m: "coupure|cutter|lame|film",
            s: "L'agent ouvre les colis de contrôle au cutter à lame fixe, plusieurs dizaines de fois par vacation.",
            g: 1, f: 4, r: "Chef d'équipe expédition", mois: 1,
            mes: [
              "Cutter à rétractation automatique fourni à chacun ; les lames fixes sont retirées du site.",
              "Coupe en s'éloignant du corps et jamais vers la main qui maintient.",
              "Lames changées à date fixe et lames usagées déposées dans un collecteur fermé.",
            ] },
          { n: "Entraînement par la filmeuse", m: "filmeuse|entraînement|machine|plateau|carter",
            s: "L'opérateur intervient sur le plateau tournant pour redresser un film qui se déchire, la machine en marche.",
            g: 3, f: 1, r: "Chef d'équipe expédition", mois: 2,
            mes: [
              "Carters et arrêt d'urgence vérifiés chaque semaine, machine consignée à la moindre anomalie.",
              "Aucune intervention plateau tournant en marche : on arrête, on attend l'arrêt complet, on intervient.",
              "Consignation écrite avant tout dépannage.",
              "Seules les personnes formées et désignées interviennent sur la machine ; la liste est affichée.",
            ] },
          { n: "Chute d'une palette instable", m: "palette|instable|chute|filmage|gerbage",
            s: "Une palette montée trop haut et mal filmée penche déjà au moment où elle quitte la zone d'expédition.",
            g: 3, f: 2, r: "Chef d'équipe expédition", mois: 1,
            mes: [
              "Hauteur maximale de palette fixée par écrit et affichée en zone d'expédition.",
              "Filmage descendant jusqu'au socle, tours de maintien en haut et en bas.",
              "Règle sans exception : une palette instable ne quitte pas le quai, elle est refaite.",
            ] },
          { n: "Bruit", m: "bruit|sonore|machine|protection auditive",
            s: "Convoyeurs, filmeuse et cerclage tournent en continu dans la même zone.",
            g: 1, f: 3, r: "Responsable d'exploitation", mois: 6,
            mes: [
              "Mesure du bruit une fois par an aux postes les plus exposés.",
              "Protections auditives individuelles à disposition, plusieurs modèles proposés.",
              "Capotage des machines les plus bruyantes lors du renouvellement du matériel.",
            ] },
        ] },
    ],
  };

  /* =================================================================== */
  /* BÂTIMENT ET TRAVAUX                                                 */
  /* =================================================================== */
  var BATIMENT = {
    cle: "batiment",
    nom: "Bâtiment et travaux",
    naf: "41.20A et 41.20B construction de bâtiments, 43 travaux de construction spécialisés",
    mots: "bâtiment|batiment|btp|construction|maçon|macon|travaux|chantier|électricien|plomb|peintre|41.2|43.",
    secteurs: ["bâtiment et travaux publics"],
    codes: ["1596", "1597", "2609", "2420", "1702", "2614", "3212"],
    unites: [
      { cle: "gros-oeuvre", nom: "Gros œuvre et maçonnerie", m: "gros œuvre|gros oeuvre|maçonnerie|maconnerie|maçon|banche|fouille",
        qui: "Maçons, coffreurs, ferrailleurs, manœuvres affectés au gros œuvre.",
        risques: [
          { n: "Chute de hauteur", m: "chute de hauteur|échafaudage|echafaudage|garde-corps|trémie|harnais",
            s: "Le maçon monte un mur en limite de plancher, à quatre mètres du sol, avec un garde-corps posé sur trois côtés seulement.",
            g: 4, f: 3, r: "Le chef de chantier", mois: 1,
            mes: [
              "La protection collective d'abord : garde-corps sur les quatre côtés, sans exception ni provisoire qui dure.",
              "Trémies couvertes ou protégées dès leur création, par le compagnon qui les crée.",
              "Échafaudage monté par des personnes formées et réceptionné par écrit avant la première utilisation, puis vérifié à chaque reprise de chantier et après toute intempérie.",
              "Harnais seulement là où la protection collective est impossible, avec un point d'ancrage identifié, vérifié et connu de celui qui s'y attache.",
              "Interdiction écrite de travailler sur un échafaudage incomplet, même pour dix minutes : c'est toujours la tâche courte qui blesse.",
            ] },
          { n: "Ensevelissement en fouille", m: "ensevelissement|fouille|tranchée|blindage|talutage|éboulement",
            s: "Un compagnon descend dans une tranchée d'un mètre quatre-vingts, non blindée, pour reprendre un raccordement.",
            g: 4, f: 2, r: "Le conducteur de travaux", mois: 1,
            mes: [
              "Blindage ou talutage de toute fouille au-delà d'une profondeur fixée par écrit dans le mode opératoire.",
              "Déblais et engins éloignés du bord d'au moins la profondeur de la fouille.",
              "Échelle d'accès dépassant d'un mètre le niveau du sol, en place avant la descente.",
              "Personne ne descend seul : un guetteur reste en surface, en contact visuel.",
              "Contrôle de la fouille après chaque pluie et avant toute reprise.",
            ] },
          { n: "Port de charges et troubles musculo-squelettiques", m: "port de charge|manutention|dos|tms|sac|parpaing",
            s: "Le maçon porte des sacs et des parpaings sur vingt mètres, plusieurs heures par jour, sur un sol encombré.",
            g: 2, f: 4, r: "Le chef de chantier", mois: 3,
            mes: [
              "Grue, monte-matériaux ou brouette motorisée pour tout transport de plus de dix mètres.",
              "Approvisionnement livré au poste, sur palettes déposées à hauteur de travail.",
              "Sacs de moins de vingt-cinq kilos commandés en priorité, à prix comparable.",
              "Deux personnes pour les banches, les bordures et les regards, sans avoir à le demander.",
            ] },
          { n: "Poussières de silice cristalline", m: "silice|poussière|poussiere|découpe|disqueuse|masque|ffp3",
            s: "Le maçon découpe des parpaings à la disqueuse toute la matinée, à sec, dans un local fermé.",
            g: 4, f: 3, r: "Le conducteur de travaux", mois: 1,
            mes: [
              "Découpe à l'eau ou aspiration à la source, sans exception : la coupe à sec est proscrite sur le chantier et le matériel qui ne le permet pas est remplacé.",
              "Masque FFP3 fourni, avec essai d'ajustement individuel : un masque qui fuit au visage ne protège pas.",
              "Découpe à l'extérieur ou en local ventilé, jamais dans un volume fermé.",
              "Nettoyage à l'aspirateur à filtre absolu, jamais au balai ni à la soufflette.",
              "Vêtements de travail nettoyés par l'entreprise et non rapportés à la maison.",
            ] },
          { n: "Bruit", m: "bruit|sonore|protection auditive|marteau|disqueuse",
            s: "Le compagnon travaille au marteau-piqueur et à la disqueuse plusieurs heures par jour, sans protection ajustée.",
            g: 2, f: 4, r: "Le chef de chantier", mois: 3,
            mes: [
              "Niveau sonore pris en compte comme critère d'achat au renouvellement du matériel.",
              "Protections auditives individuelles fournies, plusieurs modèles proposés, remplacées à la demande.",
              "Travaux bruyants regroupés sur des plages annoncées, pour que les autres corps d'état s'écartent.",
              "Exposition mesurée sur les postes les plus exposés et suivi médical demandé.",
            ] },
        ] },

      { cle: "second-oeuvre", nom: "Second œuvre et finitions", m: "second œuvre|second oeuvre|finition|plaquiste|électricien|peinture|plomberie",
        qui: "Électriciens, plombiers, plaquistes, peintres, menuisiers d'intérieur.",
        risques: [
          { n: "Chute depuis un moyen d'accès léger", m: "chute|escabeau|échelle|echelle|plateforme|pir",
            s: "L'électricien travaille au plafond depuis un escabeau posé sur un plancher encombré, en se penchant sur le côté.",
            g: 3, f: 3, r: "Le chef de chantier", mois: 1,
            mes: [
              "Plateforme individuelle roulante avec garde-corps dès que la tâche dure plus de quelques minutes.",
              "Échelle réservée à l'accès, jamais utilisée comme poste de travail.",
              "Sol dégagé et stable avant toute montée : on range d'abord, on monte ensuite.",
              "Matériel vérifié à chaque prise de poste et retiré dès qu'il est douteux, sans discussion.",
            ] },
          { n: "Risque chimique : colles, peintures, solvants, mousses", m: "chimique|solvant|colle|peinture|mousse|fds|vapeur",
            s: "Le peintre applique un produit à solvant dans une pièce sans ouverture, porte fermée, pendant deux heures.",
            g: 3, f: 3, r: "Le conducteur de travaux", mois: 2,
            mes: [
              "Fiches de données de sécurité présentes au chantier, pas seulement au dépôt.",
              "Produit le moins dangereux retenu à performance égale, et la substitution recherchée à chaque commande.",
              "Ventilation forcée ou extraction en local fermé, porte et fenêtre ouvertes quand elles existent.",
              "Gants choisis en fonction du produit : le nitrile ne convient pas à tous les solvants, la fiche le dit.",
              "Ni repas ni cigarette sans lavage des mains, et jamais de personne seule en local confiné.",
            ] },
          { n: "Poussières de bois", m: "poussière de bois|bois|scie|aspiration|ponçage",
            s: "Le menuisier découpe et ponce au ras du poste, sans aspiration raccordée, dans un local fermé.",
            g: 3, f: 3, r: "Le chef d'atelier", mois: 2,
            mes: [
              "Machines raccordées à l'aspiration, et la machine ne démarre pas si l'aspiration ne fonctionne pas.",
              "Masque FFP3 fourni avec essai d'ajustement.",
              "Nettoyage par aspiration exclusivement.",
              "Local de découpe ventilé, et suivi médical demandé pour les personnes régulièrement exposées.",
            ] },
          { n: "Électricité", m: "électricité|electricite|consignation|habilitation|câble|percement",
            s: "Le plaquiste perce une cloison où passent des câbles que personne n'a consignés.",
            g: 4, f: 2, r: "Le conducteur de travaux", mois: 1,
            mes: [
              "Consignation écrite avant toute intervention à proximité d'un circuit, avec la fiche remise à celui qui intervient.",
              "Détection de réseaux avant tout percement, sur plan et à l'appareil.",
              "Outillage isolé, rallonges vérifiées et remplacées dès qu'une gaine est entaillée.",
              "Coffret de chantier équipé d'un différentiel, testé chaque semaine, test consigné.",
              "Seules les personnes habilitées interviennent sur les installations électriques.",
            ] },
          { n: "Postures contraignantes et troubles musculo-squelettiques", m: "posture|tms|genou|plafond|accroupi|plaque",
            s: "Le plaquiste pose des plaques au plafond à bout de bras, puis travaille à genoux sur les plinthes tout l'après-midi.",
            g: 2, f: 4, r: "Le chef de chantier", mois: 3,
            mes: [
              "Lève-plaque pour toute pose en plafond.",
              "Genouillères et tabouret roulant fournis pour les travaux au sol.",
              "Hauteur de travail ajustée par tréteaux réglables plutôt que par le dos du compagnon.",
              "Alternance des tâches dans la journée, organisée par le chef d'équipe.",
            ] },
        ] },

      { cle: "circulation", nom: "Circulation et coactivité de chantier", m: "circulation|coactivité|coactivite|engin|chantier|balisage|casque",
        qui: "Toute personne présente sur le chantier, y compris les entreprises extérieures et les visiteurs.",
        risques: [
          { n: "Heurt par un engin", m: "heurt|engin|recul|guide|circulation",
            s: "Une pelle recule vers la zone de stockage pendant qu'un compagnon la traverse à pied, casque baissé.",
            g: 4, f: 2, r: "Le conducteur de travaux", mois: 1,
            mes: [
              "Plan de circulation affiché à l'entrée du chantier et tenu à jour à chaque phase.",
              "Zones piétonnes balisées et séparées des zones d'évolution des engins.",
              "Aucun recul sans guide au sol ou sans caméra en état.",
              "Gilet haute visibilité pour tous, sans exception de fonction ni de durée de présence.",
              "Contact visuel avec le conducteur établi avant de traverser : la règle est dite à l'accueil sécurité de chaque nouvel arrivant.",
            ] },
          { n: "Chute d'objets", m: "chute d'objet|casque|plinthe|filet|hauteur",
            s: "Un outil posé en bord de plancher tombe dans la zone où travaillent les compagnons de l'étage inférieur.",
            g: 3, f: 2, r: "Le chef de chantier", mois: 1,
            mes: [
              "Casque porté par tous sur l'ensemble de la zone de travaux.",
              "Plinthes sur les échafaudages, filets ou bâches sur les façades.",
              "Zone située sous des travaux en hauteur interdite et balisée pendant l'intervention.",
              "Aucun outil ni matériau laissé en bord de plancher, y compris pendant la pause.",
            ] },
          { n: "Coactivité avec les autres entreprises", m: "coactivité|coactivite|plan de prévention|ppsps|coordination|entreprise extérieure",
            s: "Le peintre applique un produit à solvant dans la pièce où l'électricien travaille au chalumeau.",
            g: 3, f: 3, r: "Le conducteur de travaux", mois: 1,
            mes: [
              "Réunion de coordination hebdomadaire, avec compte rendu écrit diffusé aux chefs d'équipe.",
              "Plan de prévention ou plan particulier de sécurité communiqué aux compagnons et commenté, pas rangé au bureau de chantier.",
              "Tâches incompatibles décalées dans le temps plutôt que juxtaposées dans l'espace.",
              "Quart d'heure sécurité en début de semaine, sur le risque du moment et non sur un thème général.",
            ] },
          { n: "Chute de plain-pied et encombrement", m: "plain-pied|encombrement|gravats|câble|cheminement",
            s: "Le cheminement du chantier est encombré de gravats et de câbles en fin de journée, et l'équipe du lendemain arrive avant le jour.",
            g: 2, f: 4, r: "Le chef de chantier", mois: 1,
            mes: [
              "Nettoyage du chantier en fin de chaque journée, pas en fin de semaine.",
              "Cheminements dégagés, balisés et éclairés, y compris en hiver.",
              "Gravats évacués au fur et à mesure, bennes positionnées au plus près.",
              "Gaines et câbles relevés ou protégés par des passages de câbles.",
            ] },
        ] },

      { cle: "atelier", nom: "Atelier et dépôt", m: "atelier|dépôt|depot|machine|scie|stockage|chargement",
        qui: "Personnel affecté à l'atelier, au dépôt et à la préparation des véhicules.",
        risques: [
          { n: "Machines à bois et meuleuses", m: "machine|scie|meuleuse|protecteur|disque|carter",
            s: "Le protecteur de la scie circulaire a été déposé pour gagner du temps sur une série de coupes.",
            g: 4, f: 2, r: "Le chef d'atelier", mois: 1,
            mes: [
              "Protecteurs en place en permanence ; une machine dont le protecteur est déposé est mise hors service le jour même.",
              "Poussoir obligatoire pour la scie, jamais la main en approche de lame.",
              "Arrêt d'urgence accessible depuis le poste, testé chaque mois.",
              "Consignation avant tout réglage ou changement de disque.",
              "Une liste affichée des personnes formées et désignées pour chaque machine.",
            ] },
          { n: "Chute d'objets stockés", m: "chute d'objet|rack|stockage|rayonnage|hauteur",
            s: "Un rack de profilés heurté par un chariot penche depuis plusieurs semaines et personne ne l'a signalé.",
            g: 3, f: 2, r: "Le chef d'atelier", mois: 2,
            mes: [
              "Racks fixés au mur ou au sol, charges lourdes au niveau bas.",
              "Hauteur de stockage limitée et marquée sur les montants.",
              "Contrôle visuel mensuel, avec une fiche signée.",
              "Rack déformé mis hors service et vidé le jour même.",
            ] },
          { n: "Manutention au chargement des véhicules", m: "chargement|véhicule|hayon|arrimage|échelle de toit",
            s: "Deux compagnons chargent une échelle sur la galerie du fourgon, seuls, en la faisant pivoter au-dessus de leur tête.",
            g: 2, f: 4, r: "Le chef d'atelier", mois: 2,
            mes: [
              "Hayon ou rampe de chargement pour tout matériel lourd.",
              "Chargement à deux au-delà d'un poids fixé par écrit.",
              "Arrimage systématique, contrôlé avant départ.",
              "Échelle de toit maniée à deux, jamais seul.",
            ] },
          { n: "Incendie lié au stockage de produits inflammables", m: "incendie|inflammable|solvant|extincteur|stockage|chiffon",
            s: "Des bidons de solvant et des chiffons souillés sont stockés dans un coin de l'atelier, près du poste de meulage.",
            g: 4, f: 1, r: "Le chef d'atelier", mois: 2,
            mes: [
              "Armoire ventilée et fermée pour les produits inflammables, éloignée de tout poste à étincelles.",
              "Quantités limitées à l'usage de la semaine ; le reste au dépôt extérieur.",
              "Extincteurs adaptés, vérifiés une fois par an, accès dégagé et signalé.",
              "Interdiction de fumer et de vapoter affichée et tenue.",
              "Chiffons souillés déposés dans un bac métallique à couvercle, vidé chaque semaine.",
            ] },
        ] },
    ],
  };

  /* =================================================================== */
  /* INDUSTRIE                                                           */
  /* =================================================================== */
  var INDUSTRIE = {
    cle: "industrie",
    nom: "Industrie et atelier de production",
    naf: "10 à 33 industrie manufacturière, 25 fabrication de produits métalliques, 22 plasturgie",
    mots: "industr|usine|fabrication|métallurg|metallurg|plasturgie|chimie|chimique|textile|production|mécanique|mecanique|usinage|2[0-9]\\.|3[0-3]\\.",
    secteurs: ["industrie"],
    codes: ["3248", "44", "176", "18", "292", "1090"],
    unites: [
      { cle: "production", nom: "Atelier de production", m: "atelier|production|machine|presse|opérateur|operateur|ligne",
        qui: "Opérateurs, conducteurs de ligne, régleurs. Toute personne qui travaille sur ou près d'une machine en marche.",
        risques: [
          { n: "Happement, écrasement et coupure par les machines", m: "happement|écrasement|ecrasement|machine|presse|organe en mouvement|carter|protecteur",
            s: "L'opérateur dégage une pièce coincée dans la presse sans arrêter la machine, la main dans la zone d'outillage.",
            g: 4, f: 2, r: "Le responsable de production", mois: 1,
            mes: [
              "Protecteurs et carters en place sur chaque machine, vérifiés à la prise de poste ; une machine dont le protecteur manque ne démarre pas.",
              "Arrêt et consignation avant toute intervention dans la zone d'outillage : la consigne est affichée sur la machine, pas dans un classeur.",
              "Arrêt d'urgence repéré, accessible et essayé une fois par mois, avec la date notée.",
              "Vêtements ajustés, pas de gants près des organes en rotation, cheveux longs attachés.",
              "Formation au poste consignée pour chaque nouvel opérateur avant la première conduite seul.",
            ] },
          { n: "Bruit", m: "bruit|sonore|décibel|decibel|acoustique|bouchon|casque anti-bruit",
            s: "Le poste de découpe dépasse le niveau où l'on doit hausser la voix pour se parler à un mètre, huit heures par jour.",
            g: 3, f: 4, r: "Le responsable de production", mois: 3,
            mes: [
              "Mesure du niveau sonore aux postes exposés, refaite à chaque changement de machine, résultat affiché.",
              "Capotage ou éloignement des sources les plus bruyantes avant toute protection individuelle.",
              "Bouchons moulés ou casques fournis, au choix de la personne, et portés dans les zones marquées au sol.",
              "Suivi audiométrique organisé avec le service de prévention et de santé au travail.",
            ] },
          { n: "Manutention et gestes répétitifs", m: "manutention|port de charge|répétitif|repetitif|tms|posture|dos",
            s: "Le conducteur de ligne alimente la machine à la main, quarante fois par heure, avec des bacs de quinze kilos posés au sol.",
            g: 2, f: 4, r: "Le responsable de production", mois: 3,
            mes: [
              "Bacs posés à hauteur de hanche sur un support, jamais au sol.",
              "Aide à la manutention (table élévatrice, palan, convoyeur) pour toute charge répétée.",
              "Rotation entre postes toutes les deux heures, inscrite au planning.",
              "Formation aux gestes et postures dans le mois de l'arrivée, reprise tous les trois ans.",
            ] },
          { n: "Risque chimique des produits de process", m: "chimique|solvant|huile de coupe|fumée|fumee|poussière|poussiere|fds|aspiration",
            s: "Le régleur nettoie les outillages au solvant, sur un chiffon, sans aspiration, à côté d'un poste de soudure.",
            g: 3, f: 3, r: "Le responsable de production", mois: 2,
            mes: [
              "Fiches de données de sécurité à jour et accessibles à l'atelier, pas au bureau.",
              "Aspiration à la source sur les postes de soudure, de meulage et de nettoyage au solvant.",
              "Produit le moins dangereux retenu à chaque renouvellement de commande, en le disant au fournisseur.",
              "Gants adaptés au produit (le gant de manutention ne protège pas d'un solvant), lunettes, et lavage des mains avant les pauses.",
              "Suivi individuel renforcé demandé au service de prévention et de santé au travail pour les personnes exposées.",
            ] },
          { n: "Ambiances thermiques", m: "chaleur|froid|ambiance thermique|thermique|canicule|four|température|temperature",
            s: "Le poste devant le four dépasse largement la température du reste de l'atelier ; l'hiver, le quai d'expédition est ouvert sur l'extérieur.",
            g: 2, f: 3, r: "Le responsable de production", mois: 4,
            mes: [
              "Écrans et isolation des sources de chaleur, ventilation contrôlée avant chaque été.",
              "Eau fraîche au poste, pauses supplémentaires au-delà d'un seuil de température écrit et affiché.",
              "Rideau d'air ou sas au quai ouvert, vêtements chauds fournis pour les postes froids.",
              "Rotation des postes chauds et froids en période extrême, écrite au planning.",
            ] },
        ] },

      { cle: "maintenance", nom: "Maintenance", m: "maintenance|technicien|dépannage|depannage|réparation|reparation|électrique|electrique|consignation",
        qui: "Techniciens de maintenance, électriciens, mécaniciens. Ceux qui interviennent sur une machine arrêtée ou qu'on croit arrêtée.",
        risques: [
          { n: "Électrisation et remise en marche intempestive", m: "électrisation|electrisation|électrique|electrique|consignation|cadenas|habilitation",
            s: "Le technicien intervient dans l'armoire électrique d'une ligne qu'un collègue remet en route depuis le pupitre, sans le savoir.",
            g: 4, f: 2, r: "Le responsable maintenance", mois: 1,
            mes: [
              "Consignation par cadenas personnel avant toute intervention : chaque intervenant pose le sien, la machine ne repart que quand tous sont retirés.",
              "Habilitation électrique à jour pour toute personne qui ouvre une armoire, copie au dossier.",
              "Vérification d'absence de tension à chaque intervention, avec l'appareil, pas au jugé.",
              "Procédure de consignation écrite par machine, affichée à côté de l'armoire.",
            ] },
          { n: "Chute de hauteur", m: "hauteur|échelle|echelle|nacelle|toiture|escabeau|garde-corps",
            s: "Le technicien change un néon à quatre mètres depuis une échelle posée sur un sol huileux.",
            g: 4, f: 2, r: "Le responsable maintenance", mois: 1,
            mes: [
              "Plateforme roulante ou nacelle pour tout travail au-dessus de deux mètres, l'échelle reste un moyen d'accès.",
              "Autorisation de conduite de nacelle pour ceux qui l'utilisent.",
              "Harnais et point d'ancrage définis pour les interventions en toiture, jamais seul.",
              "Contrôle périodique des équipements en hauteur, rapport conservé.",
            ] },
          { n: "Travail isolé en dehors des heures de production", m: "isolé|isole|seul|nuit|astreinte|dati|week-end",
            s: "Le technicien d'astreinte intervient seul dans l'usine un dimanche, sans que personne ne sache où il est.",
            g: 3, f: 2, r: "Le responsable maintenance", mois: 2,
            mes: [
              "Dispositif d'alarme pour travailleur isolé porté pendant toute intervention hors production.",
              "Appel de prise de poste et de fin d'intervention à une personne désignée, avec le lieu précis.",
              "Interventions dangereuses (hauteur, électricité, espace confiné) interdites seul : elles attendent un second.",
              "Numéros d'urgence et plan d'accès affichés à l'entrée et dans l'atelier.",
            ] },
        ] },

      { cle: "magasin", nom: "Magasin et expéditions", m: "magasin|expédition|expedition|réception|reception|chariot|cariste|palette|quai",
        qui: "Magasiniers, caristes, agents de réception et d'expédition.",
        risques: [
          { n: "Circulation de chariots et piétons", m: "chariot|cariste|circulation|piéton|pieton|collision|allée|allee|marquage",
            s: "Le cariste recule avec une palette haute qui masque sa vue, dans une allée que traverse un opérateur venu chercher un bac.",
            g: 4, f: 3, r: "Le responsable logistique", mois: 1,
            mes: [
              "Plan de circulation affiché, allées piétonnes marquées au sol, zones interdites aux piétons.",
              "Autorisation de conduite délivrée par écrit à chaque cariste après formation et visite médicale.",
              "Vitesse limitée et affichée, avertisseur de recul et gyrophare en état, vérifiés à la prise de poste.",
              "Gilet haute visibilité pour toute personne dans la zone de circulation.",
            ] },
          { n: "Chute d'objets et effondrement de rayonnages", m: "rayonnage|rack|étagère|etagere|chute d'objet|gerbage|stockage",
            s: "Des palettes gerbées sur trois niveaux dépassent des rayonnages dont un montant a été heurté par un chariot.",
            g: 3, f: 2, r: "Le responsable logistique", mois: 2,
            mes: [
              "Charge maximale affichée par niveau et respectée.",
              "Contrôle visuel mensuel des rayonnages, fiche signée ; montant déformé signalé et vidé le jour même.",
              "Sabots de protection sur les montants d'angle.",
              "Casques et chaussures de sécurité dans la zone de stockage en hauteur.",
            ] },
          { n: "Manutention au quai", m: "quai|hayon|transpalette|déchargement|dechargement|chargement|camion",
            s: "L'agent décharge un camion au transpalette manuel sur un quai dont le niveleur est en panne depuis des semaines.",
            g: 3, f: 3, r: "Le responsable logistique", mois: 2,
            mes: [
              "Niveleur de quai réparé sous quinze jours et vérifié chaque année ; quai fermé tant qu'il est en panne.",
              "Camion calé et immobilisé avant tout accès à la remorque.",
              "Transpalette électrique pour les charges lourdes, manuel réservé aux charges légères.",
              "Zone de quai éclairée et dégagée, pas de stockage tampon devant les portes.",
            ] },
        ] },

      { cle: "bureaux", nom: "Bureaux et encadrement", m: "bureau|administratif|écran|ecran|encadrement|chef d'équipe|planning",
        qui: "Personnel administratif, encadrement d'atelier, méthodes et qualité.",
        risques: [
          { n: "Travail sur écran et posture", m: "écran|ecran|posture|siège|siege|clavier|ordinateur",
            s: "La gestionnaire de production saisit les ordres de fabrication huit heures par jour sur un écran posé de côté.",
            g: 1, f: 4, r: "Le responsable administratif", mois: 6,
            mes: [
              "Écran en face, haut du moniteur à hauteur des yeux, à une longueur de bras.",
              "Siège réglable en hauteur et en dossier, réglé avec la personne à son arrivée.",
              "Pause visuelle de cinq minutes par heure, dite et acceptée.",
              "Second écran ou support pour le poste qui compare deux documents.",
            ] },
          { n: "Charge mentale de l'encadrement et horaires", m: "charge mentale|stress|horaire|astreinte|planning|équipe|epuisement|épuisement",
            s: "Le chef d'équipe enchaîne les postes du matin et de l'après-midi quand un opérateur manque, et répond au téléphone le soir.",
            g: 2, f: 3, r: "La direction", mois: 3,
            mes: [
              "Remplaçants identifiés par poste, pour que l'absence ne retombe pas sur l'encadrant.",
              "Plage sans sollicitation en dehors des heures, écrite et respectée par la direction.",
              "Point mensuel sur la charge de chaque équipe, décisions notées.",
              "Possibilité de rencontrer le service de prévention et de santé au travail à la demande de la personne.",
            ] },
          { n: "Circulation dans l'atelier pour le personnel de bureau", m: "circulation|atelier|visiteur|chaussure|allée|allee|protection",
            s: "Le responsable qualité traverse l'atelier en chaussures de ville pour vérifier une pièce, en coupant par l'allée des chariots.",
            g: 3, f: 2, r: "Le responsable de production", mois: 2,
            mes: [
              "Chaussures de sécurité et gilet fournis à tout le personnel de bureau qui entre dans l'atelier.",
              "Allées piétonnes seules empruntées, même pour un détour.",
              "Protections auditives à l'entrée de l'atelier, à disposition.",
              "Visiteurs accompagnés et équipés, enregistrés à l'accueil.",
            ] },
        ] },
    ],
  };

  /* Le métier déduit de la fiche d'entreprise, sans rien demander : le
     numéro de la convention collective d'abord (c'est le plus sûr), les mots
     de son intitulé et du secteur ensuite, le secteur seul enfin. Le dernier
     recours est le bureau. */
  var METIERS = [RESTAURATION, COMMERCE, BUREAU, ENTREPOT, BATIMENT, INDUSTRIE];
  function deduire(profil) {
    profil = profil || {};
    var conv = String(profil.conventionCollective || profil.idcc || profil.convention || "");
    var num = (conv.match(/\d{1,4}/) || [""])[0].replace(/^0+/, "");
    var trouve = null;
    if (num) METIERS.forEach(function (m) {
      if (!trouve && (m.codes || []).indexOf(num) >= 0) trouve = m.cle;
    });
    if (trouve) return trouve;
    var texte = [profil.secteur, conv, profil.activite, profil.naf].join(" ").toLowerCase();
    METIERS.forEach(function (m) {
      if (!trouve && new RegExp(m.mots, "i").test(texte)) trouve = m.cle;
    });
    if (trouve) return trouve;
    /* Le secteur seul. « services » sans autre mot va au bureau, pas à la
       restauration : c'est le cas le plus courant. */
    var s = String(profil.secteur || "").toLowerCase();
    [BUREAU].concat(METIERS).forEach(function (m) {
      if (!trouve && (m.secteurs || []).indexOf(s) >= 0) trouve = m.cle;
    });
    return trouve || "bureau";
  }
  function pour(cle) {
    var m = null;
    METIERS.forEach(function (x) { if (x.cle === cle) m = x; });
    return m || BUREAU;
  }

  window.DuerpMetiers = {
    GRAVITE: GRAVITE, FREQUENCE: FREQUENCE, priorite: priorite,
    METIERS: METIERS, deduire: deduire, pour: pour,
  };
})();
