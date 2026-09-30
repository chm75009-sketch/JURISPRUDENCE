/* La fiche client, le tout premier écran du parcours, et la seule source du
   profil d'entreprise partagé par toutes les pages.

   POURQUOI CE FICHIER EXISTE. Trois pages écrivaient ou lisaient la clé
   « profil-entreprise » avec chacune sa liste de champs : les parcours
   guidés l'écrivaient, le générateur de documents et l'audit social la
   lisaient, l'assistant la joignait à son contexte. Personne ne demandait
   l'adresse, le SIRET, le courriel, le responsable ni le téléphone, les
   données qui identifient le client et permettent d'orienter l'application
   vers une interface adaptée à sa taille, à son secteur et à sa convention.

   CE QU'IL GARANTIT. La clé reste la même, les noms de champs existants
   restent les mêmes, et les alias historiques continuent d'être lus
   (« denominationSociale », « entreprise », « nom » pour la dénomination ;
   « convention », « idcc » pour la convention ; « activite » pour le
   secteur). Une page qui lisait le profil avant ce fichier le lit encore
   après : rien n'est renommé, tout est ajouté.

   OÙ VIVENT LES DONNÉES. Dans le stockage local du navigateur, et nulle part
   ailleurs. Aucune requête n'est faite, aucun champ n'est envoyé. Le SIRET,
   le courriel et le téléphone d'un client sont des données personnelles :
   elles ne quittent pas le poste, et l'utilisateur peut tout effacer d'un
   bouton sur la page d'audit.                                               */
"use strict";
(function () {

  var CLE = "profil-entreprise";

  var SECTEURS = ["transport et logistique", "industrie",
    "bâtiment et travaux publics", "commerce", "services"];

  /* LA FORME JURIDIQUE COMMANDE CE QUI EST DÛ, ELLE AUSSI.

     Ajoutée le 25 septembre 2026, après une relecture de la base de données
     économiques et sociales : la rubrique 4° b) de R. 2312-8 ne vaut que
     « pour les entreprises soumises aux dispositions de l'article L. 225-115
     du code de commerce », et rien dans la fiche ne disait si l'entreprise
     l'était. L. 225-115 (LEGIARTI000038610196) ouvre un droit à « tout
     actionnaire » dans le chapitre des sociétés anonymes ; L. 226-1
     (LEGIARTI000047591354) l'étend aux sociétés en commandite par actions,
     et L. 227-1 (LEGIARTI000048535177) l'écarte pour la société par actions
     simplifiée, qui n'applique pas les articles L. 225-103 à L. 225-126. Une
     SARL relève de L. 223-26 (LEGIARTI000048535091), qui n'y renvoie pas.
     Laissée vide, la fiche ne conclut rien : la rubrique reste due. */
  var FORMES = ["SARL", "EURL", "SAS", "SASU", "SA", "SCA (commandite par actions)",
    "SNC", "société civile", "association", "entreprise individuelle"];

  /* LA FICHE S'OUVRE VIDE. Demande du 15 septembre 2026 : « on ne met pas TEC
     par défaut ; dans les documents, sur tout le site, partout, seules les
     coordonnées saisies dans la page d'accueil apparaîtront ». Jusqu'ici la
     fiche s'ouvrait sur les valeurs d'un client, écrites ici : sur le poste
     d'un autre, elles se seraient retrouvées en tête de ses documents tant
     qu'il n'avait rien saisi.
     Le courriel et le téléphone ne sont pas demandés ici non plus : le dépôt
     est public, et une adresse personnelle comme un numéro de portable y
     resteraient dans l'historique. Ils se saisissent sur le poste, où ils ne
     bougent plus. */
  var DEFAUT = {};

  /* Mots probables de l'intitulé d'une convention collective pour chaque
     secteur, pas une correspondance officielle : une convention s'identifie
     par l'activité réelle de l'entreprise (le champ le rappelle), jamais par
     ce menu. Sert uniquement à faire remonter des candidats plausibles en
     tête d'une liste de 328, avant que l'utilisateur ne cherche par lui-même. */
  var MOTS_SECTEUR = {
    "transport et logistique": ["transport", "logistique", "routier", "manutention",
      "messagerie", "déménagement", "transit", "ferroviaire", "aérien", "fluvial"],
    "industrie": ["industrie", "industrielle", "métallurgie", "chimie", "chimique",
      "textile", "plasturgie", "papier", "carton", "métallurgique", "sidérurgie",
      "pharmaceutique", "automobile"],
    "bâtiment et travaux publics": ["bâtiment", "travaux publics", "btp", "construction",
      "génie civil", "maçonnerie", "travaux", "chantier"],
    "commerce": ["commerce", "commerciale", "vente", "distribution", "grande distribution",
      "détail", "gros", "négoce", "magasin"],
    "services": ["services", "prestations", "conseil", "bureaux d'études",
      "nettoyage", "propreté", "gardiennage", "sécurité", "restauration", "hôtellerie"],
  };

  /* La fiche d'inscription : ce que l'on demande au client avant tout audit.
     L'ordre est celui d'une fiche que l'on remplit, l'entreprise, puis qui
     la représente, puis ce qui commande les obligations. */
  var IDENTITE = [
    { c: "denomination", nom: "Dénomination sociale", t: "text", pleine: true,
      aide: "Telle qu'elle figure au Kbis. Elle pré-remplit tous les rapports, courriers et modèles de l'application." },
    { c: "siret", nom: "SIRET (14 chiffres)", t: "text",
      aide: "Il identifie l'établissement. L'application ne l'envoie nulle part : il sert à nommer le dossier et à en-tête des documents produits." },
    { c: "formeJuridique", nom: "Forme juridique", t: "select", options: FORMES, autre: true,
      aide: "Elle écarte ce qui ne concerne pas l'entreprise : la base de données économiques et sociales ne demande le montant global des plus hautes rémunérations (L. 225-115 du code de commerce) qu'aux sociétés anonymes et aux sociétés en commandite par actions." },
    { c: "adresse", nom: "Adresse du siège", t: "text", pleine: true,
      aide: "Elle figure en tête des courriers produits (convocations, notifications, dépôts)." },
    /* LE NOM ET LA QUALITÉ NE SONT PAS LA MÊME CHOSE.

       Un seul champ « nom, qualité » donnait « Chadi EL SAFADI » sans qualité,
       et ce nom partait tel quel dans chaque document signé et dans les
       métadonnées. Relevé le 26 septembre 2026. Les deux se saisissent
       séparément ; le champ « responsable », que quatre-vingts endroits du
       dépôt lisent, est recomposé à l'enregistrement, « nom, qualité ». */
    { c: "responsableNom", nom: "Représentant légal (nom et prénom)", t: "text",
      aide: "La personne qui signe les documents. Elle apparaît en bas de chaque courrier et dans les propriétés des fichiers produits." },
    { c: "responsableQualite", nom: "Sa qualité", t: "select", autre: true,
      options: ["gérant", "gérante", "président", "présidente", "directeur général",
        "directrice générale", "directeur des ressources humaines",
        "directrice des ressources humaines", "responsable du personnel"],
      aide: "Elle se lit dans les statuts ou le Kbis. Elle suit le nom dans la signature : « Monsieur Untel, gérant »." },
    { c: "courriel", nom: "Courriel de contact", t: "email",
      aide: "Sert de coordonnée sur les documents produits. Il reste sur ce poste." },
    { c: "telephone", nom: "Téléphone", t: "tel" },
    { c: "effectif", nom: "Effectif de l'entreprise (salariés)", t: "number",
      aide: "C'est lui qui ouvre ou ferme la plupart des obligations : 11, 20, 50, 250, 300, 1 000 sont des seuils du code du travail. Laissé vide, rien n'est conclu, l'application ne devine pas." },
    { c: "secteur", nom: "Secteur d'activité", t: "select", options: SECTEURS, autre: true,
      aide: "Il oriente la convention applicable et le contenu des modèles (unités de travail du document unique, risques types)." },
    { c: "conventionCollective", nom: "Convention collective applicable (IDCC)", t: "idcc",
      aide: "Elle s'identifie par l'activité réelle. L'application lit à la source les conventions qu'elle sert, la 16 des transports routiers aujourd'hui ; pour les autres, elle signale l'endroit où la vôtre peut ajouter une obligation, et n'affirme jamais ce qu'elle contient." },
    /* Le comité social et économique, dans la fiche elle-même. Demandé le
       26 septembre 2026 : la question n'était posée que dans les parcours,
       si bien que l'accueil, l'agenda, Gérer et l'audit proposaient les
       réunions et les consultations d'un comité que l'entreprise n'a pas. */
    /* QUATRE RÉPONSES, PARCE QU'IL Y A QUATRE SITUATIONS. Demande du
       27 septembre 2026 : « si organisation des élections faute alors pv de
       carence, et à ce moment demander la date pour faire une alerte 4 ans
       après et relancer à nouveau l'organisation des élections ; si jamais
       organisation des élections inciter à le faire ». Et, le même jour, la
       quatrième : les élections en cours d'organisation, qui est la situation
       de l'entreprise le jour où elle envoie ses lettres. Répondre « aucune
       élection organisée » quand elles sont en cours était inexact. */
    { c: "cseExiste", nom: "Un comité social et économique est-il en place ?", t: "select",
      options: ["oui, élu", "non, élections en cours d'organisation",
        "non, procès-verbal de carence", "non, aucune élection organisée"],
      aide: "À partir de onze salariés pendant douze mois consécutifs, le comité est dû (L. 2311-2). Quand les élections n'ont donné aucun candidat, c'est un procès-verbal de carence qui le constate (L. 2314-9) ; l'information du personnel se refait tous les quatre ans (L. 2314-4). Sans comité, le procès-verbal de carence remplace son avis, et ses réunions et consultations ne sont plus proposées." },
    { c: "groupe", nom: "L'entreprise appartient-elle à un groupe ?", t: "oui-non",
      aide: "Le groupe déclenche le comité de groupe et pèse sur certains seuils des modules dédiés." },
    { c: "etablissementsDistincts", nom: "L'entreprise comporte-t-elle au moins deux établissements distincts ?", t: "oui-non",
      aide: "Plusieurs établissements appellent des comités d'établissement et un comité central, et des registres par établissement." },
    { c: "nbEtablissements", nom: "Nombre d'établissements", t: "number",
      aide: "Facultatif. Le registre unique du personnel se tient dans chaque établissement (art. L. 1221-13)." },
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     CE QUI NE CHANGE JAMAIS NE SE SAISIT QU'UNE FOIS.

     Demande du 26 septembre 2026, sur l'article 11 d'un contrat de conducteur :
     « pourquoi on ne saisit pas les documents à compléter quelque part, comme
     ça ça apparaîtra automatiquement dans tous les contrats, ça évitera à
     chaque fois de les saisir, et généraliser ce principe à chaque fois où on
     doit compléter des informations constantes ».

     Ce sont les organismes et les interlocuteurs de l'entreprise : ils ne
     dépendent ni du salarié, ni de la date, ni du document. Ils étaient
     redemandés à chaque contrat, et laissés en rouge dans les courriers de
     dépôt. Saisis ici une fois, ils entrent d'eux-mêmes partout où le document
     les appelle ; laissés vides, le crochet rouge reste, et rien n'est deviné.

     Ce qui n'est PAS ici : tout ce qui change d'un document à l'autre, un
     nom de salarié, une date, un motif, un montant. La règle de partage est
     celle-là, et elle se vérifie avant d'ajouter un champ : si la réponse
     peut différer d'un document à l'autre, elle n'a rien à faire dans la
     fiche.                                                                 */
  /* ═══════════════════════════════════════════════════════════════════════
     QUI REPRÉSENTE LE PERSONNEL, ET DEPUIS QUAND.

     La fiche ne posait aucune question sur le comité : ni son existence, ni
     un procès-verbal de carence, ni un délégué syndical. Les modules du
     règlement intérieur, de la base de données, du document unique, du
     collectif, de l'agenda et des notes de service supposaient tous un comité
     en place, et le cas sans comité était inatteignable. Relevé le
     26 septembre 2026, sur une entreprise de quatre-vingt-deux salariés, où
     le comité est dû (L. 2311-2) ou son absence constatée par un procès-verbal
     de carence (L. 2314-9).

     Ces trois réponses ne changent ni d'un document à l'autre ni d'un jour à
     l'autre : elles sont à leur place ici, et chaque module les reprend.
     ══════════════════════════════════════════════════════════════════════ */
  var REPRESENTATION = [
    { c: "cseElections", nom: "Date des dernières élections", t: "date",
      aide: "Le mandat dure quatre ans (L. 2314-33) : c'est cette date qui dit quand recommencer." },
    { c: "cseCarence", nom: "Date du procès-verbal de carence", t: "date",
      aide: "À renseigner si aucun candidat ne s'est présenté : le procès-verbal se transmet à l'inspection du travail. C'est elle qui ouvre les six mois pendant lesquels aucune demande d'élections n'est recevable (L. 2314-8), et les quatre ans au terme desquels l'information du personnel se refait (L. 2314-4)." },
    /* LES DEUX DATES DES ÉLECTIONS EN COURS. Demande du 27 septembre 2026 :
       la fiche ne disait pas que les élections étaient en cours, et rien ne
       calculait les deux délais qui commandent l'envoi des lettres. */
    { c: "cseInfoPersonnel", nom: "Information du personnel sur l'organisation des élections, le", t: "date",
      aide: "À renseigner quand les élections sont en cours. Le premier tour se tient au plus tard le quatre-vingt-dixième jour suivant cette diffusion (L. 2314-4)." },
    { c: "cseReunionNego", nom: "Première réunion de négociation du protocole, le", t: "date",
      aide: "L'invitation des organisations syndicales doit leur parvenir au plus tard quinze jours avant cette date (L. 2314-5)." },
    /* LA QUESTION EST CELLE QUE LE TEXTE POSE.

       L. 2242-1 (LEGIARTI000043893962, deux lectures concordantes le
       28 septembre 2026) : « Dans les entreprises où sont constituées une ou
       plusieurs sections syndicales d'organisations représentatives, l'employeur
       engage AU MOINS UNE FOIS TOUS LES QUATRE ANS : 1° Une négociation sur la
       rémunération [...] ; 2° Une négociation sur l'égalité professionnelle
       [...]. » La fiche demandait si un délégué syndical était désigné, et son
       aide parlait de négociation « annuelle » : ni le fait déclencheur, ni la
       périodicité n'étaient les bons. Corrigé le 28 septembre 2026 sur la
       contre-vérification du 26.

       La clé garde son nom, « delegueSyndical » : elle est déjà écrite dans les
       dossiers des clients, et la renommer effacerait leur réponse. Ce que la
       fiche demande, en revanche, est bien la section syndicale. */
    { c: "delegueSyndical",
      nom: "Une section syndicale d'organisation représentative est-elle constituée ?",
      t: "oui-non",
      aide: "C'est elle, et non la désignation d'un délégué, qui ouvre la négociation obligatoire : " +
        "l'employeur l'engage au moins une fois tous les quatre ans (L. 2242-1). En pratique, la " +
        "désignation d'un délégué syndical suppose une telle section." },
  ];

  var ORGANISMES = [
    { c: "orgRetraite", nom: "Retraite complémentaire (AGIRC-ARRCO)", t: "text", pleine: true,
      aide: "Nom et adresse de l'institution dont relève l'entreprise. Portée à l'article Protection sociale des contrats de travail." },
    { c: "orgPrevoyance", nom: "Prévoyance", t: "text", pleine: true,
      aide: "Nom et adresse de l'organisme. Le transport routier a un régime de branche : l'organisme reste celui que l'entreprise a rejoint." },
    { c: "orgSante", nom: "Frais de santé (complémentaire)", t: "text", pleine: true,
      aide: "Nom et adresse de l'organisme, et intitulé de la couverture." },
    { c: "orgUrssaf", nom: "Caisse d'affiliation (URSSAF ou MSA)", t: "text", pleine: true,
      aide: "Celle qui reçoit les cotisations : maladie, accidents du travail, allocations familiales." },
    { c: "orgSanteTravail", nom: "Service de prévention et de santé au travail", t: "text", pleine: true,
      aide: "Nom et adresse. C'est lui qui reçoit le document unique à chaque mise à jour (L. 4121-3-1, VI) et qui assure les visites." },
    { c: "orgOpco", nom: "Opérateur de compétences (OPCO)", t: "text", pleine: true,
      aide: "Celui dont relève la branche : il finance l'alternance et le plan de développement des compétences." },
    { c: "orgInspection", nom: "Inspection du travail : unité de contrôle et adresse", t: "text", pleine: true,
      aide: "L'adresse où partent le règlement intérieur, les notes de service et les courriers de l'employeur." },
    { c: "orgPrudhommes", nom: "Conseil de prud'hommes du ressort (ville)", t: "text",
      aide: "Son greffe reçoit le dépôt du règlement intérieur (R. 1321-2)." },
    /* L'ADRESSE DU CABINET EST AU DOSSIER, PAS DANS UN CHAMP LIBRE.

       L'écran des questions la demandait à chaque fois, vide, et acceptait
       n'importe quoi : une question pouvait partir n'importe où. Elle est
       ici, saisie une fois, avec le reste de ce qui ne change pas. Relevé le
       26 septembre 2026. */
    { c: "cabinetCourriel", nom: "Adresse de votre conseil, pour vos questions", t: "text", pleine: true,
      aide: "C'est à cette adresse que partent les questions de l'écran « Mes questions ». Elle est saisie une fois ici." },
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     CE QUI TIENT À LA PROFESSION, ET QUE LA FICHE NE DEMANDAIT NULLE PART.

     Une entreprise de transport routier de marchandises ne vit pas de son
     seul code du travail : elle vit d'une autorisation d'exercer, d'une
     inscription à un registre, d'une licence, de copies conformes numérotées,
     d'un gestionnaire de transport et de capitaux propres qui se vérifient
     chaque année. L'audit du 26 septembre 2026 a relevé qu'aucun de ces
     éléments n'était demandé, et que les échéances qui les accompagnent
     n'étaient donc nulle part.

     Les textes, code des transports, lus à la source le 26 septembre 2026,
     deux lectures concordantes chacun :

       R. 3211-9   LEGIARTI000033449967  l'inscription au registre électronique
                   national des entreprises de transport par route, par le
                   préfet de la région du siège ;
       R. 3211-12  LEGIARTI000046177442  cette inscription donne lieu à la
                   licence communautaire au-delà de 3,5 tonnes, à la licence
                   de transport intérieur en deçà pour le seul territoire
                   national, et à la licence communautaire portant la mention
                   « inférieur ou égal à 3,5 tonnes » pour l'international
                   au-dessus de 2,5 tonnes ; « délivrée pour une durée
                   maximale de dix ans renouvelable », « accompagnée de copies
                   certifiées conformes numérotées dont le nombre correspond à
                   celui des véhicules » ;
       R. 3211-32  LEGIARTI000046177267  la capacité financière : 9 000 € pour
                   le premier véhicule de plus de 3,5 tonnes et 5 000 € pour
                   chacun des suivants ; 1 800 € pour le premier véhicule qui
                   n'excède pas 3,5 tonnes et 900 € pour chacun des suivants ;
                   en parc mixte, 9 000 € pour le premier, 5 000 € par véhicule
                   lourd suivant et 900 € par véhicule léger ;
       R. 3211-43  LEGIARTI000033450051  le gestionnaire de transport, personne
                   physique qui « dirige effectivement et en permanence »
                   l'activité de transport ;
       R. 3211-44  LEGIARTI000033450053  son lien effectif avec l'entreprise :
                   employé, directeur, propriétaire, actionnaire, dirigeant ou
                   entrepreneur individuel ;
       R. 3211-45  LEGIARTI000033450055  à défaut de gestionnaire en son sein,
                   la désignation par contrat d'habilitation.

     Rien ici ne se devine : le montant exigé se calcule sur le parc de la
     flotte, et il est mis en face des capitaux saisis. Quand le parc est vide,
     le calcul le dit au lieu de conclure.
     ══════════════════════════════════════════════════════════════════════ */
  var TRANSPORT = [
    { c: "transRegistreNum", nom: "Numéro d'inscription au registre des transporteurs", t: "text", pleine: true,
      aide: "Le registre électronique national des entreprises de transport par route, tenu par le préfet de région du siège (R. 3211-9)." },
    { c: "transLicenceType", nom: "Licence détenue", t: "select",
      options: ["licence communautaire", "licence communautaire « inférieur ou égal à 3,5 tonnes »",
        "licence de transport intérieur"],
      aide: "Au-delà de 3,5 tonnes, la licence communautaire ; en deçà et sur le seul territoire national, la licence de transport intérieur (R. 3211-12)." },
    { c: "transLicenceNum", nom: "Numéro de la licence", t: "text" },
    { c: "transLicenceFin", nom: "Licence valable jusqu'au", t: "date",
      aide: "Dix ans au plus, renouvelable (R. 3211-12). L'original reste dans l'établissement." },
    { c: "transCopies", nom: "Copies conformes de cette licence", t: "number",
      aide: "Leur nombre correspond à celui des véhicules que cette licence couvre (R. 3211-12) : la flotte donne le compte en face." },
    /* DEUX LICENCES, PARCE QU'UN PARC MIXTE EN DEMANDE DEUX.
       R. 3211-12 (LEGIARTI000046177442, lu à la source le 28 septembre 2026,
       deux lectures concordantes) énumère trois licences, chacune commandée par
       sa propre condition : « 1° Une licence communautaire lorsque l'entreprise
       utilise un ou plusieurs véhicules dont le poids maximum autorisé excède
       3,5 tonnes ; 2° Une licence de transport intérieur lorsque l'entreprise
       utilise pour des opérations de transport exclusivement réalisées sur le
       territoire national un ou plusieurs véhicules n'excédant pas cette
       limite ». Trente poids lourds et cinquante véhicules légers en appellent
       donc deux, et la fiche n'en acceptait qu'une. Relevé le 26 septembre
       2026. La seconde ligne reste vide quand une seule licence suffit. */
    { c: "transLicence2Type", nom: "Seconde licence, s'il en faut une", t: "select",
      options: ["", "licence communautaire", "licence communautaire « inférieur ou égal à 3,5 tonnes »",
        "licence de transport intérieur"],
      aide: "Un parc mixte en demande deux : la communautaire pour les véhicules de plus de 3,5 tonnes, la licence de transport intérieur pour les véhicules en deçà qui ne roulent qu'en France (R. 3211-12)." },
    { c: "transLicence2Num", nom: "Numéro de la seconde licence", t: "text" },
    { c: "transLicence2Fin", nom: "Seconde licence valable jusqu'au", t: "date" },
    { c: "transCopies2", nom: "Copies conformes de la seconde licence", t: "number",
      aide: "Comptées sur les véhicules que cette seconde licence couvre." },
    { c: "transGestionnaire", nom: "Gestionnaire de transport", t: "text", pleine: true,
      aide: "La personne physique qui dirige effectivement et en permanence l'activité de transport (R. 3211-43)." },
    { c: "transGestionnaireLien", nom: "Son lien avec l'entreprise", t: "select",
      options: ["employé", "directeur", "propriétaire ou actionnaire", "dirigeant",
        "entrepreneur individuel", "habilité par contrat"],
      aide: "R. 3211-44 pour le lien interne ; R. 3211-45 pour la personne habilitée par contrat, à défaut de gestionnaire en interne." },
    { c: "transAttestation", nom: "Attestation de capacité professionnelle, numéro", t: "text", pleine: true },
    { c: "transCapitaux", nom: "Capitaux et réserves du dernier exercice, en euros", t: "number",
      aide: "C'est ce montant que la capacité financière met en face du parc, chaque année (R. 3211-32)." },
    { c: "transExercice", nom: "Exercice clos le", t: "date" },
  ];

  /* LE MONTANT EXIGÉ SE CALCULE SUR LE PARC, IL NE SE DEMANDE PAS.
     Les véhicules viennent de la flotte, et c'est leur genre qui dit de quel
     côté des 3,5 tonnes ils tombent : poids lourd et tracteur routier
     au-dessus, voiture et utilitaire léger en dessous. Une remorque n'est pas
     un véhicule à moteur : elle ne compte ni pour la capacité financière ni
     pour les copies conformes. Un genre qui ne dit pas le poids n'est pas
     rangé d'office : il est nommé, et le calcul le signale. */
  var LOURDS = { pl: 1, tracteur: 1 };
  var LEGERS = { vl: 1, vul: 1 };
  function parcTransport() {
    var L = [];
    try { L = JSON.parse(window.localStorage.getItem("flotte-vehicules") || "[]") || []; }
    catch (e) { L = []; }
    if (!L || !L.length || !L.forEach) return { lignes: 0, lourds: 0, legers: 0, remorques: 0, sansPoids: [] };
    var lourds = 0, legers = 0, remorques = 0, sansPoids = [];
    L.forEach(function (v) {
      var g = String((v && v.genre) || "").trim();
      var nom = String((v && (v.immat || v.marque)) || "véhicule sans immatriculation").trim();
      if (g === "remorque") { remorques++; return; }
      if (LOURDS[g]) { lourds++; return; }
      if (LEGERS[g]) { legers++; return; }
      sansPoids.push(nom);
    });
    return { lignes: L.length, lourds: lourds, legers: legers, remorques: remorques, sansPoids: sansPoids };
  }

  /* L'ÉCHÉANCE DE LA LICENCE ENTRE DANS LA LISTE DE LA SEMAINE.
     Elle est délivrée pour dix ans au plus (R. 3211-12) et, passée sa date,
     l'entreprise n'a plus de titre à faire monter dans ses véhicules. Elle
     se range avec les échéances de la flotte et des salariés, au même
     format : ni source à part, ni écran à part. */
  /* LES TROIS TITRES D'EXERCER, ET UN PRÉAVIS QUI SERT À QUELQUE CHOSE.

     La licence n'entrait dans l'agenda que par sa première ligne, trente jours
     avant son terme : une licence est délivrée pour dix ans et se renouvelle
     auprès du préfet de région, ce qui ne se fait pas en un mois. Les copies
     conformes manquantes et la justification annuelle de la capacité financière
     n'y entraient pas du tout. Relevé le 26 septembre 2026.

     Le préavis est donc de six mois, et les trois échéances sont là :
       - chaque licence saisie, avec son terme (R. 3211-12) ;
       - les copies conformes qui manquent au parc, dès qu'il en manque
         (R. 3211-12) ;
       - la capacité financière, à la clôture de l'exercice : « l'entreprise
         démontre (…) qu'elle dispose chaque année de capitaux et de réserves »
         (R. 3211-32, LEGIARTI000046177267), et « après la clôture de chaque
         exercice comptable, le service territorial compétent de l'État vérifie
         que l'entreprise dispose de la capacité financière requise, au regard
         des comptes annuels » (R. 3211-35, LEGIARTI000046177261). Les deux lus à
         la source le 28 septembre 2026, deux lectures concordantes. */
  function echeancesTransport(aujourdhui) {
    var f = lire() || {};
    var d0 = aujourdhui instanceof Date ? aujourdhui : new Date();
    var minuit = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate(), 12, 0, 0).getTime();
    var qui = String(f.denomination || "l'entreprise");
    var out = [];
    var jours = function (iso) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
      var d = new Date(iso + "T12:00:00");
      if (isNaN(d.getTime())) return null;
      return Math.round((d.getTime() - minuit) / 864e5);
    };
    /* Six mois de préavis : c'est le temps d'une demande de renouvellement. */
    var etatDe = function (n) {
      return n < 0 ? "passe" : (n <= 60 ? "rouge" : (n <= 180 ? "ambre" : "vert"));
    };
    [["transLicenceFin", "transLicenceType", "transLicenceNum"],
     ["transLicence2Fin", "transLicence2Type", "transLicence2Num"]].forEach(function (c) {
      var fin = String(f[c[0]] || "").trim();
      var n = jours(fin);
      if (n === null) return;
      var type = String(f[c[1]] || "").trim() || "licence de transport";
      var num = String(f[c[2]] || "").trim();
      out.push({ quoi: "Licence de transport à renouveler",
        qui: qui + " : " + type + (num ? ", n° " + num : ""),
        date: fin, jours: n, etat: etatDe(n),
        fond: "R. 3211-12 : la licence est délivrée pour une durée maximale de dix ans renouvelable ; l'original reste dans l'établissement et se restitue au préfet de région à la fin de sa validité",
        faire: "la demande de renouvellement au préfet de région, six mois avant le terme, et les copies conformes à jour",
        prov: "transport" });
    });

    /* Les copies conformes qui manquent : elles ne sont pas datées, elles sont
       dues aujourd'hui, parce qu'un véhicule qui roule sans sa copie roule sans
       titre à bord. */
    var c;
    try { c = capaciteTransport(); } catch (e) { c = null; }
    if (c && c.parc && c.parc.lignes) {
      var moteurs = c.parc.lourds + c.parc.legers;
      var typees = (c.licences || []).filter(function (x) { return x.type; });
      var manquantes = 0, dit = [];
      /* Une licence typée compte sur son propre périmètre, seule ou non : avec
         la seule communautaire saisie, l'agenda comparait ses copies au parc
         entier et demandait dix copies quand cette licence n'en appelle que
         trente pour trente véhicules. Relevé le 29 septembre 2026. */
      if (typees.length >= 1) {
        typees.forEach(function (x) {
          if (!x.du) return;
          var tenues = isFinite(x.copies) ? x.copies : 0;
          if (tenues < x.du) {
            manquantes += x.du - tenues;
            dit.push((x.du - tenues) + " pour la " + x.type);
          }
        });
      } else {
        var tenues = isFinite(c.copies) ? c.copies : 0;
        if (tenues < moteurs) { manquantes = moteurs - tenues; dit.push(manquantes + " pour le parc"); }
      }
      if (manquantes)
        out.push({ quoi: "Copies conformes de licence à demander", qui: qui,
          date: jourIso(d0), jours: 0, etat: "rouge",
          fond: "R. 3211-12 : la licence est accompagnée de copies certifiées conformes numérotées dont le nombre correspond à celui des véhicules",
          faire: "la demande de " + manquantes + " copie" + (manquantes > 1 ? "s" : "") +
            " au préfet de région (" + dit.join(", ") + ") : un véhicule sans sa copie à bord roule sans titre",
          prov: "transport" });

      /* La capacité financière, un an après la clôture du dernier exercice
         saisi : c'est à chaque clôture que le service de l'État vérifie. */
      var clos = String(f.transExercice || "").trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(clos) && c.exige) {
        var d = new Date(clos + "T12:00:00");
        if (!isNaN(d.getTime())) {
          d.setFullYear(d.getFullYear() + 1);
          var suiv = jourIso(d), n2 = jours(suiv);
          out.push({ quoi: "Capacité financière à justifier pour l'exercice suivant", qui: qui,
            date: suiv, jours: n2, etat: etatDe(n2),
            fond: "R. 3211-32 : l'entreprise démontre qu'elle dispose chaque année de capitaux et de réserves d'un montant au moins égal au barème du parc ; R. 3211-35 : après la clôture de chaque exercice comptable, le service territorial compétent de l'État le vérifie au regard des comptes annuels",
            faire: "les comptes annuels certifiés, visés ou attestés, et le montant exigé au vu du parc" +
              (c.manque > 0 ? " ; au dernier exercice saisi, il manquait " +
                Math.round(c.manque) + " euros" : ""),
            prov: "transport" });
        }
      }
    }
    return out;
  }
  function jourIso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" + ("0" + d.getDate()).slice(-2);
  }

  /* Les montants du barème se lisent d'un bloc : « 9 000 € » se coupait en fin
     de ligne sur un téléphone. Relevé le 26 septembre 2026. */
  var INSEC_P = String.fromCharCode(0x00a0);
  function euroFr(n) {
    return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, INSEC_P) +
      INSEC_P + "\u20ac";
  }
  function capaciteTransport() {
    var p = parcTransport(), exige = 0, dit = "";
    /* « chacun des 1 suivants » ne s'écrit pas : au singulier, c'est le
       second véhicule, et rien d'autre. */
    var suivants = function (n, un, plusieurs) {
      return n === 1 ? "pour le second " + un : "pour chacun des " + n + " " + plusieurs + " suivants";
    };
    if (p.lourds) {
      exige = 9000 + (p.lourds - 1) * 5000 + p.legers * 900;
      dit = euroFr(9000) + " pour le premier véhicule de plus de 3,5 tonnes" +
        (p.lourds > 1 ? ", " + euroFr(5000) + " " + suivants(p.lourds - 1, "véhicule de plus de 3,5 tonnes",
          "véhicules de plus de 3,5 tonnes") : "") +
        (p.legers ? ", " + euroFr(900) + " " + (p.legers === 1 ? "pour le véhicule qui n'excède pas 3,5 tonnes"
          : "pour chacun des " + p.legers + " véhicules qui n'excèdent pas 3,5 tonnes") : "");
    } else if (p.legers) {
      exige = 1800 + (p.legers - 1) * 900;
      dit = euroFr(1800) + " pour le premier véhicule" +
        (p.legers > 1 ? ", " + euroFr(900) + " " + suivants(p.legers - 1, "véhicule", "véhicules") : "");
    }
    var f = lire() || {};
    var saisi = parseFloat(String(f.transCapitaux == null ? "" : f.transCapitaux).replace(/[^\d.,-]/g, "").replace(",", "."));
    var nb = function (v) { return parseFloat(String(v == null ? "" : v).replace(",", ".")); };
    /* LES COPIES SE COMPTENT PAR LICENCE, NON EN BLOC. Une seule somme était
       comparée au parc entier : une entreprise qui tient trente copies de
       licence communautaire pour trente poids lourds et rien pour ses cinquante
       véhicules légers était déclarée en règle. Relevé le 26 septembre 2026.
       On rapproche chaque licence des véhicules qu'elle couvre, et le total ne
       sert plus que de repli quand une seule licence est saisie. */
    var licences = [
      { type: String(f.transLicenceType || "").trim(), num: String(f.transLicenceNum || "").trim(),
        fin: String(f.transLicenceFin || "").trim(), copies: nb(f.transCopies) },
      { type: String(f.transLicence2Type || "").trim(), num: String(f.transLicence2Num || "").trim(),
        fin: String(f.transLicence2Fin || "").trim(), copies: nb(f.transCopies2) },
    ].filter(function (x) { return x.type || x.num || isFinite(x.copies); });
    licences.forEach(function (x) {
      /* La licence de transport intérieur couvre les véhicules qui n'excèdent
         pas 3,5 tonnes ; la communautaire, ceux qui la dépassent ; celle qui
         porte la mention « inférieur ou égal à 3,5 tonnes » couvre les légers
         en transport international. */
      x.legere = /int[ée]rieur|inf[ée]rieur ou [ée]gal/i.test(x.type);
      x.du = x.legere ? p.legers : p.lourds;
    });
    /* Ce que les deux licences couvrent ensemble : si aucune n'est typée, on
       retombe sur le parc entier, comme avant. */
    var typees = licences.filter(function (x) { return x.type; });
    return { parc: p, exige: exige, dit: dit,
      capitaux: isFinite(saisi) ? saisi : null,
      copies: nb(f.transCopies),
      licences: licences,
      /* Vrai quand le parc appelle une seconde licence et qu'elle manque. */
      secondeDue: !!(p.lourds && p.legers && typees.length < 2),
      manque: exige && isFinite(saisi) ? Math.max(0, exige - saisi) : null };
  }

  /* ═══════════════════════════════════════════════════════════════════════
     L'EFFECTIF SE CALCULE, IL NE SE DÉCLARE PAS.

     Il était saisi à la main et jamais rapproché du registre : l'agenda
     affichait « Effectif retenu : 41 » et « 85 salariés au registre » sur le
     même écran, et tous les seuils reposaient sur un chiffre libre. Relevé le
     26 septembre 2026.

     L'article L. 1111-2 (LEGIARTI000019353569, lu à la source le
     26 septembre 2026, deux lectures concordantes) pose trois règles :
       1° le contrat à durée indéterminée à temps plein compte pour un ;
       2° le contrat à durée déterminée compte « à due proportion de [son]
          temps de présence au cours des douze mois précédents », et il est
          exclu lorsqu'il remplace un salarié absent ;
       3° le temps partiel compte « en divisant la somme totale des horaires
          inscrits dans leurs contrats de travail par la durée légale ou la
          durée conventionnelle du travail ».

     Ce qui se calcule ici se calcule ; ce qui manque au registre est nommé,
     jamais deviné : un temps partiel sans horaire écrit n'est pas compté
     pour une moitié au hasard. */
  function effectifRegistre(aujourdhui) {
    var reg = null;
    try { reg = JSON.parse(localStorage.getItem("registre-personnel") || "null"); } catch (_) {}
    var refs = null;
    try { refs = JSON.parse(localStorage.getItem("heures-reference") || "null"); } catch (_) {}
    var L = (reg && reg.salaries) || [];
    var d0 = aujourdhui instanceof Date ? aujourdhui : new Date();
    var ilYaUnAn = new Date(d0.getFullYear() - 1, d0.getMonth(), d0.getDate());
    var out = { total: 0, plein: 0, cdd: 0, partiel: 0, sansHoraire: [], remplacement: 0,
      apprentis: 0, pro: 0, temporaires: 0,
      lignes: L.length, date: d0 };

    function jourDe(v) {
      var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v == null ? "" : v).trim());
      if (!m) return null;
      var x = new Date(+m[1], +m[2] - 1, +m[3], 12);
      return isNaN(x) ? null : x;
    }
    function heuresSemaine(s) {
      /* L'HORAIRE DU CONTRAT D'ABORD, LE RELEVÉ D'HEURES ENSUITE.
         L. 1111-2, 3° parle des « horaires inscrits dans leurs contrats de
         travail » : c'est le contrat qui compte, et le registre le porte
         désormais sous « hcSem ». Le relevé d'heures ne reste qu'un repli, pour
         les fiches où l'horaire du contrat n'a pas encore été saisi. Relevé le
         26 septembre 2026, corrigé le 28. */
      var duContrat = parseFloat(String(s.hcSem == null ? "" : s.hcSem).replace(",", "."));
      if (isFinite(duContrat) && duContrat > 0) return duContrat;
      var id = sansAccentSimple((String(s.nom || "") + " " + String(s.pre || "")).trim());
      var r = refs && refs[id];
      if (!r || !r.sem) return null;
      var total = 0, vu = false;
      for (var j = 0; j < 7; j++) {
        var c = r.sem[j];
        if (!c) continue;
        var paires = [[c.d1, c.f1], [c.d2, c.f2]];
        paires.forEach(function (x) {
          var a = minutes(x[0]), b = minutes(x[1]);
          if (a === null || b === null) return;
          if (b <= a) b += 1440;
          total += b - a; vu = true;
        });
        total -= parseInt(c.p, 10) || 0;
      }
      return vu && total > 0 ? total / 60 : null;
    }
    function minutes(t) {
      var m = /^(\d{1,2})[:hH.]?(\d{2})?$/.exec(String(t == null ? "" : t).trim());
      return m ? parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0) : null;
    }

    L.forEach(function (s) {
      if (s.ex) return;
      var ent = jourDe(s.ent), sor = jourDe(s.sor);
      if (sor && sor < d0) return;                    /* parti : hors effectif */
      if (String(s.remplacement || "").trim() === "oui") { out.remplacement++; return; }
      /* CE QUE LA LOI EXCLUT DU DÉCOMPTE. « Ne sont pas pris en compte dans le
         calcul des effectifs de l'entreprise : 1° Les apprentis ; (…) 6° Les
         titulaires d'un contrat de professionnalisation jusqu'au terme prévu
         par le contrat » (L. 1111-3, LEGIARTI000031565369, lu à la source le
         27 septembre 2026, deux lectures concordantes). L'un et l'autre
         comptaient pour un. Relevé le 26 septembre 2026. */
      var nature = String(s.nature || "").trim();
      if (nature === "apprenti") { out.apprentis++; return; }
      if (nature === "pro") { out.pro++; return; }
      var partiel = String(s.part || "").trim() === "partiel";
      /* Les salariés temporaires et ceux qu'un groupement met à disposition se
         comptent au prorata de leur présence sur les douze mois précédents,
         comme les contrats à durée déterminée (L. 1111-2, 2°), et non pour un
         chacun. */
      var cdd = nature === "cdd" || nature === "temporaire" || nature === "groupement";
      if (nature === "temporaire" || nature === "groupement") out.temporaires++;
      if (partiel) {
        var h = heuresSemaine(s);
        if (h === null) { out.sansHoraire.push((String(s.nom || "") + " " + String(s.pre || "")).trim()); return; }
        out.partiel += h / 35;
        out.total += h / 35;
        return;
      }
      if (cdd) {
        /* À due proportion du temps de présence sur les douze mois
           précédents : on compte les jours effectivement passés. */
        var debut = ent && ent > ilYaUnAn ? ent : ilYaUnAn;
        var fin = sor && sor < d0 ? sor : d0;
        var jours = Math.max(0, Math.round((fin - debut) / 86400000));
        var part = Math.min(1, jours / 365);
        out.cdd += part;
        out.total += part;
        return;
      }
      out.plein++; out.total++;
    });
    out.total = Math.round(out.total * 100) / 100;
    out.partiel = Math.round(out.partiel * 100) / 100;
    out.cdd = Math.round(out.cdd * 100) / 100;
    return out;
  }
  function sansAccentSimple(x) {
    try {
      return String(x == null ? "" : x).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    } catch (_) { return String(x == null ? "" : x).toLowerCase(); }
  }

  /* Les quatre valeurs de toute réponse fermée de l'application.

     « oui » et « non » concluent. « en cours » et « autre » NE CONCLUENT
     JAMAIS : ils sont remis aux moteurs comme une donnée absente, et le
     contrôle rend au mieux « risque à vérifier », jamais « conforme ». C'est
     la règle du dépôt, cocher n'est pas prouver, étendue aux réponses
     nuancées : une régularisation commencée n'est pas une régularisation
     faite, et une réponse hors cadre n'est pas une réponse. */
  var VALEURS = ["oui", "non", "en cours", "autre"];
  var CONCLUANTES = { oui: true, non: true };
  function conclut(v) { return CONCLUANTES[String(v || "").trim()] === true; }

  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ------------------------------------------------------------- lecture --- */
  /* Les alias historiques sont lus, jamais réécrits à la place des nouveaux :
     un profil enregistré par une version antérieure s'ouvre tel quel. */
  function lire() {
    var p, brut = null;
    try { brut = localStorage.getItem(CLE); } catch (_) {}
    try { p = JSON.parse(brut || "null"); } catch (_) { p = null; }
    if (!p || typeof p !== "object") {
      /* Rien n'a jamais été enregistré ici : on ouvre sur les valeurs par
         défaut. Une fiche enregistrée, fût-elle vide, passe par la branche
         ci-dessus et garde ce que l'utilisateur y a mis. */
      p = {};
      for (var d in DEFAUT) if (Object.prototype.hasOwnProperty.call(DEFAUT, d)) p[d] = DEFAUT[d];
    }
    if (!p.denomination) p.denomination = p.denominationSociale || p.entreprise || p.nom || "";
    if (!p.conventionCollective) p.conventionCollective = p.convention || p.idcc || "";
    if (!p.secteur) p.secteur = p.activite || "";
    if (!p.adresse) p.adresse = p.siege || "";
    /* Une fiche écrite avant la séparation porte « nom, qualité » dans un
       seul champ : on le coupe à la première virgule, sans rien réécrire sur
       le poste. */
    if (!p.responsableNom && p.responsable) {
      var v = String(p.responsable), i = v.indexOf(",");
      p.responsableNom = (i < 0 ? v : v.slice(0, i)).trim();
      p.responsableQualite = i < 0 ? "" : v.slice(i + 1).trim();
    }
    return p;
  }

  /* L'écriture est une FUSION : une page qui ne connaît que trois champs
     n'efface pas les huit autres. « entreprise » est tenu à jour à côté de
     « denomination » parce que l'audit social et le générateur de documents
     le lisent sous ce nom depuis le début. */
  function ecrire(patch) {
    var p = lire();
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) p[k] = patch[k];
    if (p.denomination) p.entreprise = p.denomination;
    /* « responsable » reste la signature composée : c'est elle que les
       documents lisent depuis le début. */
    if (p.responsableNom || p.responsableQualite) {
      p.responsable = [String(p.responsableNom || "").trim(),
        String(p.responsableQualite || "").trim()].filter(Boolean).join(", ");
    }
    try { localStorage.setItem(CLE, JSON.stringify(p)); } catch (_) {}
    return p;
  }

  function effacer() { try { localStorage.removeItem(CLE); } catch (_) {} }

  /* Un organisme de la fiche, ou la chaîne vide : c'est au document d'écrire
     son propre crochet quand il n'a rien, avec les mots qu'il veut. */
  function organisme(cle) {
    var p = lire();
    return String(p[cle] == null ? "" : p[cle]).trim();
  }

  /* La fiche par défaut est ÉCRITE, pas seulement rendue à la lecture : une
     douzaine de pages du dépôt relisent la clé « profil-entreprise »
     directement, sans passer par lire(), et n'auraient rien vu. Écrire une
     fois, au chargement de ce fichier, les sert toutes. Ensuite la clé
     existe et cette fonction ne fait plus rien : ce que l'utilisateur a
     enregistré n'est jamais recouvert. */
  function semer() {
    try {
      if (localStorage.getItem(CLE) !== null) return;
      var p = {};
      for (var d in DEFAUT) if (Object.prototype.hasOwnProperty.call(DEFAUT, d)) p[d] = DEFAUT[d];
      if (p.denomination) p.entreprise = p.denomination;
      localStorage.setItem(CLE, JSON.stringify(p));
    } catch (_) {}
  }
  semer();

  /* ------------------------------------------------------- échange --- */
  /* LE FORMAT COMMUN AUX DEUX APPLICATIONS DE LA JURISTE.

     Les deux applications posent les mêmes questions d'entreprise, et les
     posaient deux fois. Le client saisissait sa dénomination, son SIRET, son
     effectif et sa convention ici, puis les ressaisissait là-bas. Le format
     ci-dessous met fin à ce doublon sans serveur, sans compte et sans
     synchronisation : un fichier JSON descend d'un côté, remonte de l'autre.

     LE SCHÉMA, « profil-entreprise », version 1. Il est documenté au fichier
     PROFIL-PARTAGE.md, à la racine des deux dépôts, et il ne change pas sans
     changer de numéro de version.

       { "format": "profil-entreprise",
         "version": 1,
         "emisPar": "…",              nom de l'application émettrice
         "emisLe": "2026-08-22T…Z",   date d'émission, ISO 8601
         "entreprise": { … } }        les treize champs ci-dessous

     LES TREIZE CHAMPS. denomination, siret, formeJuridique, adresse,
     responsable, courriel, telephone, effectif, secteur,
     conventionCollective, groupe, etablissementsDistincts, nbEtablissements.
     Ce sont exactement les clés de IDENTITE : le format n'invente rien, il
     expose ce que l'application tient déjà. La forme juridique est venue en
     dernier, le 25 septembre 2026 ; facultative, elle ne change pas le numéro
     de version, comme le prévoit PROFIL-PARTAGE.md.

     CE QUI EST INTERDIT. Un import n'efface jamais un champ renseigné avec
     une valeur vide : la fusion ne retient d'un fichier que ce qu'il porte
     réellement. Et rien n'est deviné, un champ absent du fichier reste
     absent, il ne prend pas de valeur par défaut.

     CE QUI NE VOYAGE PAS. Les réponses d'audit, les brouillons de documents,
     l'avancement des parcours : ils restent sur leur poste. Le format ne
     transporte que l'identité de l'entreprise. */
  var FORMAT = "profil-entreprise";
  var VERSION_FORMAT = 1;
  var APPLICATION = "JURISPRUDENCE, audits et parcours";

  /* Les organismes voyagent avec la fiche : ils en font partie, et une fiche
     exportée qui les laisserait derrière obligerait à les ressaisir de
     l'autre côté. Champs facultatifs, la version du format ne change pas,
     comme le prévoit PROFIL-PARTAGE.md. 26 septembre 2026. */
  function champsEchanges() {
    return IDENTITE.concat(REPRESENTATION).concat(ORGANISMES).concat(TRANSPORT)
      .map(function (ch) { return ch.c; });
  }

  /* L'objet à écrire dans le fichier. Un champ vide n'y figure pas : on
     n'exporte pas du vide qui écraserait du plein à l'arrivée. */
  function exporter() {
    var p = lire(), e = {};
    champsEchanges().forEach(function (c) {
      var v = p[c];
      if (v === undefined || v === null || String(v).trim() === "") return;
      e[c] = String(v).trim();
    });
    return { format: FORMAT, version: VERSION_FORMAT, emisPar: APPLICATION,
      emisLe: new Date().toISOString(), entreprise: e };
  }

  /* Le nom du fichier : la dénomination si on l'a, la date sinon. */
  function nomFichier() {
    var p = lire();
    var d = String(p.denomination || "").trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
    return "profil-entreprise" + (d ? "-" + d : "") + "-" +
      new Date().toISOString().slice(0, 10) + ".json";
  }

  /* Le téléchargement. Aucune requête : le fichier est fabriqué dans la page
     et remis au navigateur. */
  function telecharger() {
    var texte = JSON.stringify(exporter(), null, 1);
    var url = URL.createObjectURL(new Blob([texte], { type: "application/json" }));
    var a = document.createElement("a");
    a.href = url; a.download = nomFichier();
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return true;
  }

  /* La lecture d'un fichier reçu. Rend { ok, message, champs }, jamais une
     exception : un fichier illisible n'est pas une panne de l'application.
     Le format et la version sont vérifiés ; un fichier d'une version
     inconnue est refusé plutôt qu'interprété au jugé. */
  function importer(objet) {
    if (!objet || typeof objet !== "object")
      return { ok: false, message: "Fichier illisible : ce n'est pas du JSON." };
    if (objet.format !== FORMAT)
      return { ok: false, message: "Ce fichier n'est pas un profil d'entreprise (" +
        'champ « format » attendu : « ' + FORMAT + ' »).' };
    if (objet.version !== VERSION_FORMAT)
      return { ok: false, message: "Version de format inconnue (" + JSON.stringify(objet.version) +
        ") : cette page lit la version " + VERSION_FORMAT + "." };
    var src = objet.entreprise;
    if (!src || typeof src !== "object")
      return { ok: false, message: "Le fichier ne porte aucune entreprise." };
    var patch = {}, pris = [];
    champsEchanges().forEach(function (c) {
      var v = src[c];
      if (v === undefined || v === null || String(v).trim() === "") return;
      patch[c] = String(v).trim();
      pris.push(c);
    });
    if (!pris.length)
      return { ok: false, message: "Le fichier ne porte aucun champ renseigné." };
    ecrire(patch);
    return { ok: true, champs: pris,
      message: pris.length + " champ(s) repris" +
        (objet.emisPar ? " du profil émis par " + String(objet.emisPar) : "") + "." };
  }

  /* Le fichier choisi dans un <input type="file">. */
  function importerFichier(fichier, apres) {
    var lecteur = new FileReader();
    lecteur.onload = function () {
      var o = null;
      try { o = JSON.parse(String(lecteur.result)); } catch (_) { o = null; }
      apres(importer(o));
    };
    lecteur.onerror = function () {
      apres({ ok: false, message: "Le fichier n'a pas pu être lu." });
    };
    lecteur.readAsText(fichier);
  }

  /* La fiche est-elle assez remplie pour ouvrir un audit ? La dénomination et
     l'effectif suffisent, le reste enrichit, il ne bloque pas. */
  function suffisante(p) {
    p = p || lire();
    var eff = String(p.effectif == null ? "" : p.effectif).trim();
    return String(p.denomination || "").trim() !== "" && eff !== "" && isFinite(+eff);
  }
  function manquants(p) {
    p = p || lire();
    return IDENTITE.filter(function (ch) {
      var v = p[ch.c];
      return v === undefined || v === null || String(v).trim() === "";
    }).map(function (ch) { return ch.nom; });
  }

  /* ------------------------------------------------------------- rendu --- */
  /* Un champ. Les réponses fermées portent les quatre valeurs ; « autre »
     ouvre une saisie libre dont le texte est la valeur enregistrée, précédée
     de « autre : » pour que rien ne la confonde avec un « oui ». */
  function champHtml(ch, valeur, prefixe) {
    var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
    var aide = ch.aide ? '<p class="aide-champ">' + e(ch.aide) + "</p>" : "";
    var val = valeur == null ? "" : String(valeur);
    var dedans;
    if (ch.t === "oui-non") {
      var libre = val && VALEURS.indexOf(val) < 0;
      var choisi = libre ? "autre" : val;
      dedans = '<select id="' + id + '" data-champ="' + e(ch.c) + '" data-ouinon="1">' +
        '<option value=""></option>' +
        VALEURS.map(function (o) {
          return '<option value="' + o + '"' + (choisi === o ? " selected" : "") + ">" + o + "</option>";
        }).join("") + "</select>" +
        '<input type="text" id="' + id + '-libre" data-libre="' + e(ch.c) + '" placeholder="précisez" ' +
        'style="margin-top:6px' + (libre ? "" : ";display:none") + '" value="' + (libre ? e(val) : "") + '">';
    } else if (ch.t === "select") {
      var connu = (ch.options || []).indexOf(val) >= 0;
      dedans = '<select id="' + id + '" data-champ="' + e(ch.c) + '"><option value=""></option>' +
        (ch.options || []).map(function (o) {
          return '<option' + (val === o ? " selected" : "") + ">" + e(o) + "</option>";
        }).join("") +
        (ch.autre ? '<option value="__autre"' + (val && !connu ? " selected" : "") + ">Autre, saisie libre</option>" : "") +
        "</select>" +
        (ch.autre ? '<input type="text" id="' + id + '-libre" data-libre="' + e(ch.c) + '" ' +
          'placeholder="précisez" style="margin-top:6px' + (val && !connu ? "" : ";display:none") +
          '" value="' + (connu ? "" : e(val)) + '">' : "");
    } else if (ch.t === "idcc") {
      /* Sur iOS, un champ texte vide dans un formulaire ouvre le menu système
         « Coller / Remplir / Format », qui recouvre le début de la liste
         juste en dessous. autocomplete="off" ne suffit pas à lui seul à
         l'écarter : ces quatre attributs, ensemble, réduisent nettement sa
         fréquence, Safari ne le supprime jamais tout à fait. */
      dedans = '<input id="' + id + '" data-champ="' + e(ch.c) + '" type="text" value="' + e(val) +
        '" placeholder="numéro IDCC ou intitulé, la liste s\'ouvre à la saisie" ' +
        'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">';
    } else {
      dedans = '<input id="' + id + '" data-champ="' + e(ch.c) + '" type="' + e(ch.t) + '"' +
        (ch.t === "number" ? ' min="0" step="1"' : "") +
        (ch.t === "tel" ? ' inputmode="tel"' : "") +
        ' value="' + e(val) + '">';
    }
    return '<label' + (ch.pleine ? ' class="pleine"' : "") + '><span class="nom">' + e(ch.nom) +
      "</span>" + dedans + aide + "</label>";
  }

  /* Lire un champ rendu par champHtml : le menu, ou la saisie libre qu'il
     ouvre. Rend la chaîne à enregistrer, jamais une valeur devinée. */
  function lireChamp(ch, prefixe, racine) {
    racine = racine || document;
    var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
    var el = racine.querySelector("#" + CSS.escape(id));
    if (!el) return undefined;
    var v = el.value;
    if ((ch.t === "select" && v === "__autre") || (ch.t === "oui-non" && v === "autre")) {
      var l = racine.querySelector("#" + CSS.escape(id + "-libre"));
      v = l ? l.value.trim() : "";
    }
    return v;
  }

  /* Rendre la fiche complète dans un conteneur, et tenir le profil à jour à
     chaque frappe. `onChange` est appelé après chaque enregistrement. */
  function rendre(conteneur, options) {
    options = options || {};
    var prefixe = options.prefixe || "fc";
    var champs = options.champs || IDENTITE;
    var p = lire();
    conteneur.innerHTML = "<fieldset><legend>" +
      e(options.legende || "Fiche client, l'entreprise auditée") + "</legend>" +
      (options.aide ? '<p class="aide-champ" style="margin:0 0 12px">' + e(options.aide) + "</p>" : "") +
      '<div class="grille">' +
      champs.map(function (ch) { return champHtml(ch, p[ch.c], prefixe); }).join("") +
      "</div>" +
      /* L'échange avec l'autre application de la juriste. Deux boutons, un
         fichier, rien d'autre : ni serveur, ni compte, ni synchronisation.
         `options.echange: false` les retire, une page qui ne veut pas de
         cette sortie n'a pas à l'afficher. */
      (options.echange === false ? "" :
        '<div class="echange-profil" style="margin:14px 0 0;padding-top:12px;' +
        'border-top:1px solid #dcdfe4">' +
        '<p class="aide-champ" style="margin:0 0 8px">Cette fiche s\'emporte : ' +
        'un fichier <b>.json</b> qui se télécharge ici et se relit dans Juris Expert, ' +
        'et réciproquement. Il ne contient que l\'identité de l\'entreprise, ni réponses ' +
        'd\'audit, ni brouillons, ni avancement, et ne part sur aucun réseau.</p>' +
        '<button type="button" id="' + e(prefixe) + '-exporter">Télécharger la fiche (.json)</button> ' +
        '<button type="button" id="' + e(prefixe) + '-importer-ouvrir">Importer une fiche…</button>' +
        '<input type="file" accept="application/json,.json" id="' + e(prefixe) + '-importer" ' +
        'style="display:none">' +
        '<p class="aide-champ" id="' + e(prefixe) + '-echange-etat" style="margin:8px 0 0"></p>' +
        "</div>") +
      "</fieldset>";

    /* Les saisies libres : celles des menus «, autre, » et « autre ». */
    champs.forEach(function (ch) {
      var id = prefixe + "-" + String(ch.c).replace(/\./g, "_");
      var sel = conteneur.querySelector("#" + CSS.escape(id));
      var libre = conteneur.querySelector("#" + CSS.escape(id + "-libre"));
      if (!sel || !libre) return;
      sel.addEventListener("change", function () {
        var ouvert = sel.value === "__autre" || sel.value === "autre";
        libre.style.display = ouvert ? "" : "none";
        if (!ouvert) libre.value = "";
        majorer();
      });
      libre.addEventListener("input", majorer);
    });

    /* « Nombre d'établissements » n'a de sens que si l'entreprise en compte
       plusieurs, sinon la question qui vient de répondre « non » à « au
       moins deux » se voit aussitôt suivie d'une question sur leur nombre,
       ce qui ne se tient pas. Masqué tant que la réponse n'est pas « oui ». */
    var etabSel = conteneur.querySelector("#" + CSS.escape(prefixe + "-etablissementsDistincts"));
    var nbEtabInput = conteneur.querySelector("#" + CSS.escape(prefixe + "-nbEtablissements"));
    var nbEtabLabel = nbEtabInput ? nbEtabInput.closest("label") : null;
    if (etabSel && nbEtabLabel) {
      var majNbEtab = function () {
        var visible = etabSel.value === "oui";
        nbEtabLabel.style.display = visible ? "" : "none";
        if (!visible) nbEtabInput.value = "";
      };
      majNbEtab();
      etabSel.addEventListener("change", majNbEtab);
    }

    /* CHAQUE DATE SOUS SA RÉPONSE, ET PAS SOUS LES AUTRES.

       Les quatre dates de la représentation du personnel s'affichaient toutes,
       quelle que soit la réponse : on pouvait enregistrer « oui, élu » avec une
       date de procès-verbal de carence, et une entreprise sans comité se voyait
       demander la date de ses dernières élections. Relevé le 26 septembre 2026.

       Une date déjà saisie n'est jamais effacée : elle est seulement masquée, et
       l'écran dit qu'elle ne correspond plus à la réponse. C'est l'employeur qui
       tranche, comme partout ailleurs. */
    /* La réponse sur le comité est dans la partie du haut de la fiche, les
       quatre dates dans celle de la représentation : la question et ses dates
       ne sont pas dans le même conteneur. On cherche donc le menu partout dans
       la page, et on se rabat sur la fiche enregistrée. Relevé le 28 septembre
       2026 en écrivant le contrôle. */
    var cseSel = conteneur.querySelector("#" + CSS.escape(prefixe + "-cseExiste")) ||
      document.querySelector('[id$="-cseExiste"]');
    var aDesDates = champs.some(function (ch) { return ch.c === "cseElections"; });
    if (cseSel || aDesDates) {
      var SOUS_REPONSE = {
        cseElections: function (r) { return r.indexOf("oui") === 0; },
        cseCarence: function (r) { return /^non.*(proc[eè]s-verbal|carence)/.test(r); },
        cseInfoPersonnel: function (r) { return /^non.*(en cours|organisation)/.test(r); },
        cseReunionNego: function (r) { return /^non.*(en cours|organisation)/.test(r); },
      };
      var NOM_REPONSE = {
        cseElections: "un comité élu",
        cseCarence: "un procès-verbal de carence",
        cseInfoPersonnel: "des élections en cours d'organisation",
        cseReunionNego: "des élections en cours d'organisation",
      };
      var reponseCse = function () {
        if (cseSel && String(cseSel.value || "").trim()) return String(cseSel.value).trim().toLowerCase();
        var p = lire() || {};
        return String(p.cseExiste || "").trim().toLowerCase();
      };
      var majDatesCse = function () {
        var r = reponseCse();
        Object.keys(SOUS_REPONSE).forEach(function (c) {
          var champ = conteneur.querySelector("#" + CSS.escape(prefixe + "-" + c));
          var etiq = champ ? champ.closest("label") : null;
          if (!etiq) return;
          var due = SOUS_REPONSE[c](r);
          etiq.style.display = due ? "" : "none";
          /* La date gardée qui ne va plus avec la réponse : on le dit, sous le
             menu, et on ne touche pas à la valeur. */
          var dit = conteneur.querySelector("#" + CSS.escape(prefixe + "-" + c + "-reste"));
          if (!due && String(champ.value || "").trim()) {
            if (!dit) {
              dit = document.createElement("p");
              dit.className = "aide-champ";
              dit.id = prefixe + "-" + c + "-reste";
              dit.style.margin = "4px 0 8px";
              if (cseSel.closest("label") && cseSel.closest("label").parentNode)
                cseSel.closest("label").parentNode.insertBefore(dit, cseSel.closest("label").nextSibling);
            }
            dit.textContent = "Votre fiche garde une date pour « " +
              (NOM_REPONSE[c] || c) + " » (" + champ.value +
              "), qui ne correspond plus à votre réponse. Elle n'est pas effacée : " +
              "changez la réponse pour la revoir, ou laissez-la, elle ne sert à rien.";
            dit.hidden = false;
            /* Le menu peut être dans une autre partie de la fiche : la phrase
               se pose alors au-dessus des dates, là où on la lira. */
            if (!dit.parentNode && conteneur.firstChild)
              conteneur.insertBefore(dit, conteneur.firstChild);
          } else if (dit) {
            dit.hidden = true;
            dit.textContent = "";
          }
        });
      };
      majDatesCse();
      if (cseSel) cseSel.addEventListener("change", majDatesCse);
      /* Le menu vit ailleurs dans la page : tout changement de la fiche le
         répercute ici, ce qui ne coûte qu'une lecture. */
      document.addEventListener("change", majDatesCse);
    }

    var cc = conteneur.querySelector("#" + CSS.escape(prefixe + "-conventionCollective"));
    var secteurSel = conteneur.querySelector("#" + CSS.escape(prefixe + "-secteur"));
    if (cc && window.IDCC && window.IDCC.attacher) {
      window.IDCC.attacher(cc);
      if (window.IDCC.definirMots) {
        var majMots = function () {
          var s = secteurSel ? secteurSel.value : "";
          window.IDCC.definirMots(cc, MOTS_SECTEUR[s] || []);
        };
        majMots();
        if (secteurSel) secteurSel.addEventListener("change", majMots);
      }
    }

    function majorer() {
      var patch = {};
      champs.forEach(function (ch) {
        var v = lireChamp(ch, prefixe, conteneur);
        if (v === undefined) return;
        patch[ch.c] = v;
      });
      var np = ecrire(patch);
      if (typeof options.onChange === "function") options.onChange(np);
    }

    /* Les deux boutons de l'échange. Un import réussi redessine la fiche :
       les champs repris doivent apparaître sans que l'on recharge la page. */
    var bExp = conteneur.querySelector("#" + CSS.escape(prefixe + "-exporter"));
    var bImp = conteneur.querySelector("#" + CSS.escape(prefixe + "-importer-ouvrir"));
    var fImp = conteneur.querySelector("#" + CSS.escape(prefixe + "-importer"));
    var etat = conteneur.querySelector("#" + CSS.escape(prefixe + "-echange-etat"));
    function dire(msg, ok) {
      if (!etat) return;
      etat.textContent = msg;
      etat.style.color = ok ? "#2a6b4f" : "#8a2b2b";
    }
    if (bExp) bExp.addEventListener("click", function () {
      try { telecharger(); dire("Fiche téléchargée. Importez-la dans Juris Expert.", true); }
      catch (_) { dire("Le téléchargement n'a pas abouti sur ce navigateur.", false); }
    });
    if (bImp && fImp) {
      bImp.addEventListener("click", function () { fImp.value = ""; fImp.click(); });
      fImp.addEventListener("change", function () {
        var f = fImp.files && fImp.files[0];
        if (!f) return;
        importerFichier(f, function (r) {
          dire(r.message, r.ok);
          if (r.ok) {
            rendre(conteneur, options);
            if (typeof options.onChange === "function") options.onChange(lire());
          }
        });
      });
    }

    conteneur.addEventListener("input", majorer);
    conteneur.addEventListener("change", majorer);
    return { majorer: majorer };
  }

  window.Profil = {
    CLE: CLE, IDENTITE: IDENTITE, REPRESENTATION: REPRESENTATION,
    ORGANISMES: ORGANISMES, TRANSPORT: TRANSPORT, SECTEURS: SECTEURS,
    parcTransport: parcTransport, capaciteTransport: capaciteTransport,
    echeancesTransport: echeancesTransport,
    organisme: organisme, effectifRegistre: effectifRegistre,
    VALEURS: VALEURS, conclut: conclut,
    lire: lire, ecrire: ecrire, effacer: effacer,
    suffisante: suffisante, manquants: manquants,
    champHtml: champHtml, lireChamp: lireChamp, rendre: rendre,
    /* L'échange avec Juris Expert, format « profil-entreprise », version 1.
       Documenté dans PROFIL-PARTAGE.md, à la racine des deux dépôts. */
    FORMAT: FORMAT, VERSION_FORMAT: VERSION_FORMAT, APPLICATION: APPLICATION,
    champsEchanges: champsEchanges, exporter: exporter, importer: importer,
    nomFichier: nomFichier, telecharger: telecharger, importerFichier: importerFichier,
  };
})();
