/* LES NOTES DE SERVICE DU TRANSPORT ROUTIER.

   POURQUOI CE FICHIER EXISTE

   Demande du 15 septembre 2026 : « tu les classes par thème, et pour le
   secteur transport tu les adaptes à ce secteur ». Une note sur le port des
   protections écrite pour un atelier ne dit rien à un conducteur qui passe sa
   journée sur la route et descend charger chez le client ; une note sur les
   horaires ne dit rien si elle ignore le temps de conduite.

   CE QU'IL AJOUTE

   Un thème entier, « Conduite et exploitation », avec les notes propres au
   métier : temps de conduite et de repos, chronotachygraphe, contrôle avant
   départ, arrimage, documents de bord, accident de la route, carburant,
   marchandises sensibles, chaîne du froid, hayon, amendes.

   ET CE QU'IL ADAPTE

   Quelques notes générales sont remplacées par leur version transport quand
   la fiche d'entreprise désigne ce secteur : les protections individuelles,
   la vigilance au poste, le téléphone, l'accident du travail. Le modèle
   général reste dans les autres entreprises.

   Comme dans le fichier général, aucun article n'est cité dans le corps des
   notes : seules les formalités du règlement intérieur, affichées par
   l'écran, s'appuient sur des textes lus à la source.                       */

"use strict";
(function (window) {
  if (!window.NotesService) return;
  var NS = window.NotesService;

  NS.ajouterTheme({
    cle: "tra", nom: "Conduite et exploitation", code: "TRA",
    sous: "Temps de conduite, chronotachygraphe, arrimage, documents de bord",
    secteurs: ["transport et logistique"],
  });

  function a(id, titre, objet, corps, o) {
    o = o || {};
    NS.ajouter({
      theme: "tra", id: id, titre: titre, objet: objet, corps: corps,
      adjonction: !!o.adjonction, urgence: !!o.urgence,
      secteurs: ["transport et logistique"], note: o.note || "",
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     CONDUITE ET EXPLOITATION
     ══════════════════════════════════════════════════════════════════════ */

  a("tra-temps", "Temps de conduite et de repos",
    "Respect des temps de conduite et de repos",
    ["Les temps de conduite, de pause et de repos ne se négocient pas : ils protègent le conducteur, les autres usagers et l'entreprise.",
     "",
     "Aucune tournée n'est construite sur un temps de conduite qui dépasse ce que la réglementation autorise. Si un planning paraît impossible à tenir, il se signale à l'exploitation avant le départ, non après.",
     "",
     "Un retard ne se rattrape jamais sur une pause ni sur un repos. L'exploitation prévient le client ; le conducteur ne roule pas davantage.",
     "",
     "Les pauses de conduite se prennent aux emplacements prévus et se constatent sur le chronotachygraphe.",
     "",
     "Un dépassement, même subi, se déclare à [NOM OU FONCTION] dès le retour, avec ses circonstances : c'est la seule façon de corriger un planning qui ne tient pas.",
     "",
     "Aucune prime, aucun objectif, aucune prise de commande ne repose sur un nombre de livraisons qui obligerait à dépasser ces temps."],
    { adjonction: true, urgence: true });

  a("tra-chrono", "Chronotachygraphe et cartes",
    "Usage du chronotachygraphe et des cartes conducteur",
    ["Le chronotachygraphe enregistre l'activité de conduite : son usage correct est une obligation professionnelle de chacun.",
     "",
     "La carte conducteur est personnelle : elle est insérée dès la prise du véhicule et retirée à la fin du service. Elle ne se prête pas.",
     "",
     "Les changements d'activité, conduite, autre travail, disponibilité, repos, sont saisis au moment où ils interviennent.",
     "",
     "Les données de la carte sont téléchargées par [NOM OU FONCTION] tous les [PÉRIODICITÉ], et celles du véhicule tous les [PÉRIODICITÉ].",
     "",
     "Une carte perdue, volée ou défectueuse se déclare immédiatement à l'exploitation, et les feuillets manuels sont renseignés en attendant son remplacement.",
     "",
     "Aucune manipulation destinée à fausser l'enregistrement n'est tolérée : elle expose son auteur à une sanction disciplinaire et à des poursuites."],
    { adjonction: true });

  a("tra-controle-depart", "Contrôle du véhicule avant départ",
    "Contrôle avant départ : ce qui se vérifie",
    ["Aucun véhicule ne part sans le contrôle visuel de son conducteur. Il prend cinq minutes et évite l'immobilisation d'une journée.",
     "",
     "Sont vérifiés : pneumatiques et pression, éclairage et signalisation, niveaux, essuie-glaces, freins et purge, état de la carrosserie et du hayon, présence des sangles et des cales, propreté des rétroviseurs.",
     "",
     "Le résultat est porté sur la fiche de contrôle, datée et signée, remise à [NOM OU FONCTION] au retour.",
     "",
     "Un défaut touchant à la sécurité, freinage, direction, pneumatiques, éclairage, interdit le départ : le conducteur prévient l'exploitation, qui organise un autre véhicule.",
     "",
     "Un défaut sans incidence immédiate sur la sécurité se signale au retour et est porté au carnet du véhicule.",
     "",
     "Le conducteur n'a jamais à partir avec un véhicule dont il estime l'état dangereux, et il ne lui en sera pas fait reproche."],
    { adjonction: true, urgence: true });

  a("tra-arrimage", "Arrimage et répartition de la charge",
    "Arrimage des marchandises",
    ["Une charge mal arrimée blesse au déchargement, fait verser un véhicule en courbe, et engage le conducteur comme l'entreprise.",
     "",
     "La charge est répartie de façon à respecter la charge à l'essieu et à garder le centre de gravité bas et centré.",
     "",
     "Chaque charge est bloquée ou sanglée : sangles en nombre suffisant, cornières sur les angles vifs, cales et barres de blocage.",
     "",
     "Les sangles usées, coupées ou effilochées sont retirées du service et remplacées : elles se signalent à [NOM OU FONCTION].",
     "",
     "L'arrimage est revérifié après les premiers kilomètres et à chaque rupture de charge.",
     "",
     "Le conducteur reste responsable de l'arrimage même lorsque le chargement est fait par le client : s'il le juge dangereux, il demande la reprise et prévient l'exploitation."],
    { adjonction: true, urgence: true });

  a("tra-documents", "Documents à bord",
    "Documents devant se trouver à bord",
    ["Les documents suivants se trouvent à bord à chaque départ : [LISTE PROPRE À L'ENTREPRISE ET À L'ACTIVITÉ].",
     "",
     "Ils comprennent notamment les documents du véhicule, ceux du transport, et ceux du conducteur.",
     "",
     "Le conducteur vérifie leur présence et leur validité avant de partir : une date dépassée se signale à l'exploitation, pas au contrôle routier.",
     "",
     "Les documents de transport signés au déchargement sont rapportés à [NOM OU FONCTION] au retour de tournée, et au plus tard le [DÉLAI].",
     "",
     "Une réserve du client se porte sur le document au moment du déchargement, en présence de celui qui reçoit : une réserve tardive ne vaut rien.",
     "",
     "Un document perdu se signale le jour même."],
    { adjonction: true });

  a("tra-accident-route", "Accident de la route : conduite à tenir",
    "Accident de la circulation : ce qu'il faut faire",
    ["Protéger, alerter, secourir, dans cet ordre, avant toute autre considération.",
     "",
     "Protéger : gilet enfilé avant de descendre, triangle posé, feux de détresse, personne sur la chaussée.",
     "",
     "Alerter : 15, 18 ou 112 selon la situation, puis l'exploitation au [NUMÉRO], à toute heure.",
     "",
     "Ne jamais déplacer un blessé, sauf danger immédiat.",
     "",
     "Remplir le constat amiable sur place, signé des deux parties, avec les plaques, les assurances, les témoins et des photographies. Ne reconnaître aucune responsabilité.",
     "",
     "Si un tiers refuse le constat, relever la plaque et prévenir les forces de l'ordre.",
     "",
     "Rapporter le constat et le compte rendu à [NOM OU FONCTION] dans les vingt-quatre heures. Un accident, même sans dégât apparent, se déclare toujours."],
    { adjonction: true, urgence: true });

  a("tra-amendes", "Infractions routières et amendes",
    "Infractions routières : désignation et amendes",
    ["Lorsque l'entreprise reçoit un avis de contravention concernant l'un de ses véhicules, la loi l'oblige à désigner le conducteur : elle le fait dans le délai imparti.",
     "",
     "Les amendes pour infraction au code de la route commises par le conducteur restent à sa charge.",
     "",
     "Une contestation se forme par le conducteur lui-même, dans le délai porté sur l'avis. L'entreprise lui remet les éléments dont elle dispose.",
     "",
     "Toute suspension, rétention ou annulation du permis se déclare immédiatement à [NOM OU FONCTION] : conduire sans permis valable engage le conducteur et l'entreprise.",
     "",
     "Le nombre de points n'est demandé à personne ; seule la validité du permis l'est.",
     "",
     "Une infraction due à une consigne de l'exploitation se signale par écrit : ce sont les consignes qui seront corrigées."],
    { adjonction: true });

  a("tra-telephone-volant", "Téléphone au volant",
    "Usage du téléphone pendant la conduite",
    ["Aucun appel, aucun message, aucune consultation d'écran pendant que le véhicule roule, ni en main, ni en kit, ni en oreillette.",
     "",
     "L'exploitation n'appelle pas un conducteur dont elle sait qu'il roule, et n'attend jamais de réponse immédiate.",
     "",
     "Le conducteur rappelle à l'arrêt, sur une aire ou un emplacement sûr, moteur coupé.",
     "",
     "L'itinéraire se programme à l'arrêt, avant le départ.",
     "",
     "Cette règle vaut aussi pour les applications de tournée et les scanners embarqués : leur usage se fait véhicule à l'arrêt.",
     "",
     "Un conducteur ne sera jamais tenu pour responsable d'un appel non décroché en roulant."],
    { adjonction: true, urgence: true });

  a("tra-carburant", "Carburant et carte carburant",
    "Prises de carburant et usage de la carte",
    ["La carte carburant est confiée à [QUI], pour le véhicule [IDENTIFICATION], et ne sert qu'aux véhicules de l'entreprise.",
     "",
     "Son code est personnel et ne se communique à personne ; la carte ne se prête pas.",
     "",
     "Les prises se font, dans la mesure du possible, dans le réseau [RÉSEAU] pour bénéficier des conditions négociées.",
     "",
     "Le kilométrage est saisi exactement à chaque prise : c'est ce qui permet de suivre les consommations et de détecter une panne naissante.",
     "",
     "Les tickets sont rapportés à [NOM OU FONCTION] au retour de tournée.",
     "",
     "Une carte perdue ou volée se signale immédiatement, jour et nuit, au [NUMÉRO], pour opposition."],
    { adjonction: true });

  a("tra-ecoconduite", "Éco-conduite et consommation",
    "Conduite économique",
    ["La consommation moyenne du parc s'établit à [VALEUR] litres aux cent kilomètres. Les gestes suivants la réduisent sans allonger les tournées.",
     "",
     "Anticiper les ralentissements, lever le pied plutôt que freiner, utiliser le frein moteur.",
     "",
     "Rouler au régime préconisé par le constructeur et passer les rapports sans monter dans les tours.",
     "",
     "Couper le moteur dès que l'arrêt dépasse [DURÉE], sauf nécessité liée au groupe frigorifique.",
     "",
     "Vérifier la pression des pneumatiques : une pression basse coûte du carburant et use la gomme.",
     "",
     "Ces consignes ne priment jamais sur la sécurité : on ne retarde pas un freinage pour économiser du gazole."]);

  a("tra-frigo", "Chaîne du froid et températures",
    "Transport sous température dirigée",
    ["Le respect de la chaîne du froid engage la marchandise, la santé du destinataire et la responsabilité de l'entreprise.",
     "",
     "Le groupe est mis en route et la caisse prérefroidie avant le chargement, à [TEMPÉRATURE].",
     "",
     "La température se relève au chargement, en cours de route et au déchargement, et se consigne sur [SUPPORT].",
     "",
     "Les portes restent ouvertes le moins longtemps possible ; le rideau de protection est utilisé.",
     "",
     "Une anomalie de température se signale immédiatement à l'exploitation au [NUMÉRO], avant toute livraison.",
     "",
     "Aucune marchandise dont la température est sortie de la plage prévue n'est livrée sans l'accord de [NOM OU FONCTION].",
     "",
     "Les enregistreurs et les tickets de température sont rapportés avec les documents de tournée."],
    { adjonction: true });

  a("tra-hayon", "Hayon élévateur, transpalette et déchargement chez le client",
    "Déchargement chez le client : hayon et manutention",
    ["Le déchargement est le moment où l'on se blesse : chez le client, personne n'est chez soi, et tout y est différent.",
     "",
     "Le hayon ne s'utilise qu'après avoir vérifié la stabilité du véhicule, calé, frein de parking serré, sur un sol plat et dégagé.",
     "",
     "La charge est centrée sur le plateau, jamais en surplomb ; personne ne monte sur le hayon avec la charge lorsque cela peut être évité.",
     "",
     "La zone au sol est balisée et dégagée avant la manœuvre : ni piéton, ni client, ni enfant à proximité.",
     "",
     "Le transpalette se pousse, ne se tire pas, et jamais dans une pente.",
     "",
     "Un quai, un cheminement ou un sol dangereux se signale à l'exploitation, qui traite avec le client. Le conducteur n'a pas à improviser une manœuvre acrobatique.",
     "",
     "Un hayon dont le fonctionnement est anormal est immédiatement signalé et n'est plus utilisé."],
    { adjonction: true, urgence: true });

  a("tra-stationnement", "Marchandises sensibles, stationnement et vol",
    "Stationnement et protection de la marchandise",
    ["Les vols de fret se produisent à l'arrêt, la nuit, sur des aires non surveillées.",
     "",
     "Les coupures et les repos se prennent sur les aires sécurisées indiquées par l'exploitation : [LISTE OU CRITÈRES].",
     "",
     "Le véhicule est fermé à clé dès que le conducteur le quitte, même pour quelques minutes.",
     "",
     "Les portes arrière sont placées contre un mur ou un autre véhicule lorsque c'est possible.",
     "",
     "La nature de la marchandise ne se commente ni au téléphone en public, ni sur les réseaux sociaux.",
     "",
     "Face à une tentative, ne jamais s'opposer physiquement : se mettre en sécurité, alerter le 17 puis l'exploitation.",
     "",
     "Tout vol ou tentative se déclare le jour même, avec l'heure, le lieu exact et les circonstances."],
    { adjonction: true, urgence: true });

  a("tra-epi-route", "Protections individuelles du conducteur",
    "Équipements de protection sur la route et chez le client",
    ["Les équipements suivants sont fournis à chaque conducteur et portés aux moments indiqués.",
     "",
     "Gilet de haute visibilité : enfilé dans la cabine, avant d'ouvrir la portière, dès que l'on descend en bord de voie ou sur un site.",
     "",
     "Chaussures de sécurité : portées dès que l'on quitte la cabine.",
     "",
     "Gants de manutention : portés pour toute manipulation de charge, de sangle ou de hayon.",
     "",
     "[Casque, lunettes ou protections auditives sur les sites qui l'imposent : SITES CONCERNÉS.]",
     "",
     "Un équipement usé ou perdu se remplace avant le départ suivant : il se demande à [NOM OU FONCTION].",
     "",
     "Les consignes propres au site du client s'ajoutent à celles-ci et se respectent, même pour une livraison de cinq minutes."],
    { adjonction: true, urgence: true });

  a("tra-vigilance", "Vigilance du conducteur : alcool, médicaments, fatigue",
    "Vigilance au volant",
    ["Au volant d'un poids lourd, une vigilance diminuée ne pardonne pas. Les règles suivantes valent pour tous les conducteurs.",
     "",
     "Aucune consommation d'alcool ni de substance psychoactive avant ou pendant le service.",
     "",
     "Un traitement médical susceptible d'altérer la vigilance se signale au médecin du travail, jamais à l'employeur : c'est lui qui apprécie l'aptitude et propose un aménagement.",
     "",
     "Un conducteur qui ne se sent pas en état de conduire le dit et ne part pas. Il ne lui en sera pas fait reproche, et son retour est organisé sans conduite personnelle.",
     "",
     "En cas de somnolence sur la route : s'arrêter sur la première aire, prévenir l'exploitation, se reposer. Aucun délai de livraison ne justifie de continuer.",
     "",
     "L'encadrement qui constate un état inquiétant retire le conducteur du volant sur-le-champ et écrit ce qu'il a constaté. Retirer du volant n'est pas sanctionner.",
     "",
     "Les pots et fins de tournée sont encadrés : personne ne reprend un véhicule après."],
    { adjonction: true, urgence: true });

  a("tra-retour", "Retour de tournée et documents",
    "Retour de tournée : ce qui se rend et à qui",
    ["À chaque retour, les éléments suivants sont remis à [NOM OU FONCTION] : documents de transport signés, fiche de contrôle du véhicule, tickets de carburant et de péage, relevés de température s'il y a lieu.",
     "",
     "Les anomalies de la tournée sont rapportées le jour même : client absent, refus de marchandise, réserve, attente anormale, difficulté d'accès.",
     "",
     "Les temps d'attente chez le client se notent avec leur heure de début et de fin : ils sont du temps de travail et se paient comme tel.",
     "",
     "Le véhicule est rendu propre en cabine, plein fait si la consigne l'exige, sangles rangées.",
     "",
     "La carte conducteur est retirée et les données téléchargées selon la périodicité prévue.",
     "",
     "Rien ne reste dans la cabine d'une tournée à l'autre : ni document, ni marchandise, ni effet personnel de valeur."],
    { adjonction: true });

  a("tra-controle-technique", "Contrôle technique et maintenance du parc",
    "Contrôles réglementaires et entretien du parc",
    ["Le suivi des contrôles et des entretiens du parc est assuré par [NOM OU FONCTION], sur [SUPPORT].",
     "",
     "Aucun véhicule ne circule avec un contrôle échu : la date se vérifie avant l'affectation à une tournée.",
     "",
     "Les échéances des [DOUZE] prochains mois sont affichées à [LIEU] et communiquées aux conducteurs concernés.",
     "",
     "Les immobilisations sont planifiées de façon à ne pas empiéter sur le repos des conducteurs.",
     "",
     "Les rapports de contrôle et les factures d'entretien sont conservés à [LIEU] pendant [DURÉE].",
     "",
     "Un défaut relevé lors d'un contrôle avant départ est repris au carnet du véhicule et suivi jusqu'à sa réparation."],
    { adjonction: true });

  /* ══════════════════════════════════════════════════════════════════════
     LES REMPLACEMENTS : une note générale prend sa version transport quand
     la fiche d'entreprise désigne ce secteur.
     ══════════════════════════════════════════════════════════════════════ */

  NS.VARIANTES = NS.VARIANTES || {};
  NS.VARIANTES["transport et logistique"] = {
    "sst-epi": "tra-epi-route",
    "sst-alcool": "tra-vigilance",
    "dis-telephone": "tra-telephone-volant",
    "mat-vehicule": "tra-controle-depart",
  };
})(window);
