/* Catalogue de la boutique MP Climatisation.
   Les caracteristiques suivent les fiches constructeurs usuelles ; les prix sont
   ceux de la boutique, pose en supplement. */

window.PRODUITS = [
  {
    ref: 'daikin-sensira-35', marque: 'Daikin', nom: 'Sensira FTXF35E',
    type: 'monosplit', couleur: '#dbeafe',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 6.4, scop: 4.0, classeFroid: 'A++', classeChaud: 'A+',
    sonore: 20, wifi: false, fluide: 'R32', garantie: 3,
    prix: 899, prixBarre: 1049, stock: 'En stock', note: 4.4, avis: 212,
    points: ['Le bon rapport prix / prestation', 'Mode nuit silencieux', 'Filtre lavable a l’eau'],
    resume: 'Le monosplit d’entree de gamme de Daikin, celui qu’on installe dans une chambre ou un petit sejour sans se poser de question. Il chauffe l’hiver et rafraichit l’ete, avec une consommation deja tres contenue.'
  },
  {
    ref: 'daikin-perfera-35', marque: 'Daikin', nom: 'Perfera FTXM35R',
    type: 'monosplit', couleur: '#e0f2fe',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 8.65, scop: 5.1, classeFroid: 'A+++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 3,
    prix: 1349, prixBarre: 1549, stock: 'En stock', note: 4.8, avis: 486,
    points: ['A+++ au froid comme au chaud', 'Pilotage par application', 'Capteur de presence'],
    resume: 'Le best-seller de la gamme. Double A+++, 19 dB en vitesse basse, et un capteur qui oriente le flux d’air ailleurs que sur vous. C’est le modele que nous posons le plus souvent en piece de vie.'
  },
  {
    ref: 'daikin-stylish-35', marque: 'Daikin', nom: 'Stylish FTXA35BB',
    type: 'monosplit', couleur: '#1f2937',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 8.5, scop: 5.15, classeFroid: 'A+++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 3,
    prix: 1690, stock: 'En stock', note: 4.7, avis: 173,
    points: ['Unite interieure de 19 cm de profondeur', 'Finition noir mat, blanc ou argent', 'Purificateur Flash Streamer'],
    resume: 'Quand l’unite interieure doit se faire oublier. Dix-neuf centimetres de profondeur, une facade pleine, et le meme rendement que la Perfera.'
  },
  {
    ref: 'mitsubishi-ap25', marque: 'Mitsubishi Electric', nom: 'MSZ-AP25VGK',
    type: 'monosplit', couleur: '#eff6ff',
    froid: 2.5, chaud: 3.2, surfaceMin: 15, surfaceMax: 25,
    seer: 8.6, scop: 4.6, classeFroid: 'A+++', classeChaud: 'A++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 5,
    prix: 1190, stock: 'En stock', note: 4.7, avis: 341,
    points: ['Garantie 5 ans piece et compresseur', 'Wifi integre en serie', 'Reference des chambres'],
    resume: 'Deux kilowatts et demi, c’est ce qu’il faut pour une chambre ou un bureau. La marque a la reputation de durer, et la garantie de cinq ans va dans ce sens.'
  },
  {
    ref: 'mitsubishi-ln35', marque: 'Mitsubishi Electric', nom: 'MSZ-LN35VG2 Kirigamine Style',
    type: 'monosplit', couleur: '#f8fafc',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 9.5, scop: 5.2, classeFroid: 'A+++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 5,
    prix: 1890, stock: 'En stock', note: 4.8, avis: 158,
    points: ['SEER 9,5, un des meilleurs du marche', 'Quatre finitions dont noir onyx', 'Capteur infrarouge de temperature'],
    resume: 'Le haut de gamme de Mitsubishi Electric. Le capteur lit la temperature des murs et du sol piece par piece, ce qui evite les a-coups de soufflage.'
  },
  {
    ref: 'atlantic-takao-35', marque: 'Atlantic Fujitsu', nom: 'Takao M3 ASYG12KMCF',
    type: 'monosplit', couleur: '#f1f5f9',
    froid: 3.4, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 7.4, scop: 4.6, classeFroid: 'A++', classeChaud: 'A++',
    sonore: 20, wifi: false, fluide: 'R32', garantie: 3,
    prix: 1049, stock: 'En stock', note: 4.5, avis: 264,
    points: ['Reseau de service apres-vente francais', 'Mode absence hors gel 10 degres', 'Wifi en option'],
    resume: 'Fabrique par Fujitsu General, distribue par Atlantic. L’interet tient surtout au reseau d’apres-vente, dense en France, quand une panne arrive au mois d’aout.'
  },
  {
    ref: 'lg-dualcool-35', marque: 'LG', nom: 'Dualcool Deluxe DC12RH',
    type: 'monosplit', couleur: '#eef2ff',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 7.6, scop: 4.6, classeFroid: 'A++', classeChaud: 'A++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 10,
    prix: 999, prixBarre: 1149, stock: 'En stock', note: 4.4, avis: 388,
    points: ['Compresseur garanti 10 ans', 'Application ThinQ', 'Nettoyage automatique de l’echangeur'],
    resume: 'Dix ans de garantie sur le compresseur, c’est l’argument de LG et il n’est pas mince. Le sechage automatique de l’echangeur limite les odeurs au redemarrage.'
  },
  {
    ref: 'samsung-windfree-35', marque: 'Samsung', nom: 'Wind-Free Comfort AR12TXFCAWK',
    type: 'monosplit', couleur: '#f5f3ff',
    froid: 3.5, chaud: 3.9, surfaceMin: 25, surfaceMax: 35,
    seer: 8.5, scop: 4.6, classeFroid: 'A+++', classeChaud: 'A++',
    sonore: 16, wifi: true, fluide: 'R32', garantie: 3,
    prix: 1090, stock: 'En stock', note: 4.6, avis: 297,
    points: ['Diffusion par 23 000 micro-perforations', '16 dB, le plus silencieux du catalogue', 'Sans courant d’air direct'],
    resume: 'La facade est percee de milliers de trous minuscules : l’air arrive sans souffle. C’est le choix de ceux qui ne supportent pas le flux d’air sur la nuque.'
  },
  {
    ref: 'toshiba-shorai-35', marque: 'Toshiba', nom: 'Shorai Edge RAS-B13N4KVRG',
    type: 'monosplit', couleur: '#ecfeff',
    froid: 3.5, chaud: 4.2, surfaceMin: 25, surfaceMax: 35,
    seer: 8.6, scop: 5.1, classeFroid: 'A+++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 5,
    prix: 1249, stock: 'En stock', note: 4.6, avis: 141,
    points: ['Chauffe encore a moins 15 degres', 'Compresseur double rotatif', 'Garantie 5 ans'],
    resume: 'Toshiba soigne le fonctionnement par grand froid : la machine tient son chauffage la ou beaucoup de splits s’essoufflent, ce qui compte des qu’on quitte le littoral.'
  },
  {
    ref: 'panasonic-etherea-35', marque: 'Panasonic', nom: 'Etherea Z35ZKE',
    type: 'monosplit', couleur: '#f8fafc',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 35,
    seer: 8.5, scop: 5.1, classeFroid: 'A+++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 5,
    prix: 1420, stock: '2 a 3 semaines', note: 4.7, avis: 126,
    points: ['Traitement d’air nanoe X', 'Facade blanc mat sans grille visible', 'Garantie 5 ans'],
    resume: 'Le nanoe X travaille sur les odeurs et les particules pendant que la machine tourne. Utile dans une piece de vie ouverte sur la cuisine.'
  },
  {
    ref: 'hitachi-takai-25', marque: 'Hitachi', nom: 'Takai RAK-25RPE',
    type: 'monosplit', couleur: '#f0f9ff',
    froid: 2.5, chaud: 3.3, surfaceMin: 15, surfaceMax: 25,
    seer: 8.5, scop: 5.1, classeFroid: 'A+++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 3,
    prix: 1090, stock: 'En stock', note: 4.5, avis: 98,
    points: ['Double A+++ en 2,5 kW', 'Filtre antiallergene', 'Wifi integre'],
    resume: 'Un petit modele qui ne transige pas sur le rendement : double A+++ pour une chambre de 20 metres carres, c’est rare a ce niveau de puissance.'
  },
  {
    ref: 'haier-flexis-35', marque: 'Haier', nom: 'Flexis Plus AS35S2SF2FA',
    type: 'monosplit', couleur: '#fef2f2',
    froid: 3.5, chaud: 3.8, surfaceMin: 25, surfaceMax: 35,
    seer: 8.5, scop: 4.6, classeFroid: 'A+++', classeChaud: 'A++',
    sonore: 20, wifi: true, fluide: 'R32', garantie: 3,
    prix: 899, stock: 'En stock', note: 4.2, avis: 176,
    points: ['A+++ au froid sous 900 euros', 'Finitions blanche, noire ou argent', 'Wifi integre'],
    resume: 'Le meilleur prix du catalogue pour un A+++ au froid. Les finitions sont soignees, le service apres-vente moins dense que chez les japonais.'
  },
  {
    ref: 'mhi-srk25', marque: 'Mitsubishi Heavy', nom: 'SRK25ZS-WF Diamond',
    type: 'monosplit', couleur: '#f1f5f9',
    froid: 2.5, chaud: 3.2, surfaceMin: 15, surfaceMax: 25,
    seer: 8.5, scop: 4.6, classeFroid: 'A+++', classeChaud: 'A++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 3,
    prix: 949, stock: 'En stock', note: 4.4, avis: 132,
    points: ['Reglage de la puissance a 20, 40 ou 60 pour cent', 'Bon comportement au chauffage', 'Wifi integre'],
    resume: 'On peut brider la machine pour ne pas depasser l’abonnement electrique : pratique dans les appartements dont le compteur est deja charge.'
  },
  {
    ref: 'daikin-bisplit-perfera', marque: 'Daikin', nom: 'Bi-split 2MXM50A + 2 Perfera FTXM25R',
    type: 'multisplit', couleur: '#e0f2fe',
    froid: 5.0, chaud: 5.6, surfaceMin: 30, surfaceMax: 50, pieces: 2,
    seer: 8.5, scop: 4.6, classeFroid: 'A+++', classeChaud: 'A++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 3,
    prix: 2490, prixBarre: 2790, stock: 'En stock', note: 4.8, avis: 204,
    points: ['Deux pieces, un seul groupe exterieur', 'Chaque unite se pilote a part', 'Wifi sur les deux unites'],
    resume: 'Un sejour et une chambre, ou deux chambres : un seul groupe dehors, deux unites dedans, reglables separement. La solution classique en appartement.'
  },
  {
    ref: 'mitsubishi-trisplit', marque: 'Mitsubishi Electric', nom: 'Tri-split MXZ-3F54VF + 3 MSZ-AP',
    type: 'multisplit', couleur: '#eff6ff',
    froid: 5.4, chaud: 7.0, surfaceMin: 45, surfaceMax: 75, pieces: 3,
    seer: 7.3, scop: 4.4, classeFroid: 'A++', classeChaud: 'A+',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 5,
    prix: 3290, stock: '2 a 3 semaines', note: 4.7, avis: 87,
    points: ['Trois pieces sur un groupe', 'Garantie 5 ans', 'Liaisons jusqu’a 25 metres au total'],
    resume: 'Pour une maison de plain-pied ou un etage complet. La longueur de liaison disponible laisse de la latitude quand le groupe doit etre pose loin des chambres.'
  },
  {
    ref: 'atlantic-bisplit', marque: 'Atlantic Fujitsu', nom: 'Bi-split AOYG18KBTA2 + 2 ASYG09',
    type: 'multisplit', couleur: '#f1f5f9',
    froid: 5.0, chaud: 6.2, surfaceMin: 30, surfaceMax: 50, pieces: 2,
    seer: 6.7, scop: 4.2, classeFroid: 'A++', classeChaud: 'A+',
    sonore: 20, wifi: false, fluide: 'R32', garantie: 3,
    prix: 2190, stock: 'En stock', note: 4.3, avis: 119,
    points: ['Apres-vente francais', 'Deux unites de 2,5 kW', 'Wifi en option'],
    resume: 'La proposition la plus simple pour equiper deux pieces sans y mettre le prix du japonais haut de gamme.'
  },
  {
    ref: 'daikin-console-35', marque: 'Daikin', nom: 'Perfera Console FVXM35A',
    type: 'console', couleur: '#f8fafc',
    froid: 3.4, chaud: 4.4, surfaceMin: 25, surfaceMax: 35,
    seer: 6.8, scop: 5.0, classeFroid: 'A++', classeChaud: 'A+++',
    sonore: 19, wifi: true, fluide: 'R32', garantie: 3,
    prix: 1590, stock: 'En stock', note: 4.6, avis: 74,
    points: ['Se pose au sol, sous une fenetre', 'Double soufflage haut et bas', 'Excellente au chauffage'],
    resume: 'Quand le mur est vitre ou qu’on remplace un radiateur, la console prend sa place au sol. Elle chauffe mieux qu’un mural parce que l’air part d’en bas.'
  },
  {
    ref: 'daikin-gainable-35', marque: 'Daikin', nom: 'Gainable FDXM35F9 + RXM35R',
    type: 'gainable', couleur: '#e2e8f0',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 40,
    seer: 7.2, scop: 4.6, classeFroid: 'A++', classeChaud: 'A++',
    sonore: 24, wifi: true, fluide: 'R32', garantie: 3,
    prix: 1890, stock: '2 a 3 semaines', note: 4.5, avis: 52,
    points: ['Invisible, cache dans un faux plafond', 'Une seule machine, plusieurs bouches', 'Hauteur de caisson 20 cm'],
    resume: 'Rien ne se voit dans la piece, hormis les grilles. Il faut un faux plafond ou un comble amenage, et une etude de reseau avant de commander.'
  },
  {
    ref: 'mitsubishi-plafonnier', marque: 'Mitsubishi Electric', nom: 'Cassette SLZ-M35FA',
    type: 'gainable', couleur: '#f8fafc',
    froid: 3.5, chaud: 4.0, surfaceMin: 25, surfaceMax: 40,
    seer: 7.0, scop: 4.3, classeFroid: 'A++', classeChaud: 'A+',
    sonore: 25, wifi: true, fluide: 'R32', garantie: 5,
    prix: 2290, stock: 'Sur commande', note: 4.5, avis: 38,
    points: ['Cassette 570 x 570 encastree au plafond', 'Soufflage sur quatre cotes', 'Bureaux et commerces'],
    resume: 'La cassette se glisse dans une dalle de faux plafond et souffle sur quatre cotes. C’est le format des bureaux, des cabinets et des petites surfaces commerciales.'
  },
  {
    ref: 'delonghi-pac-el98', marque: 'De’Longhi', nom: 'Pinguino PAC EL98 Silent',
    type: 'mobile', couleur: '#f8fafc',
    froid: 2.4, chaud: 0, surfaceMin: 12, surfaceMax: 22,
    seer: 0, scop: 0, eer: 2.6, classeFroid: 'A', classeChaud: '',
    sonore: 63, wifi: false, fluide: 'R290', garantie: 2,
    prix: 549, stock: 'En stock', note: 4.3, avis: 512,
    points: ['Aucun travaux, on la branche', 'Kit fenetre fourni', 'Evacuation des condensats automatique'],
    resume: 'La solution du locataire et de la copropriete qui refuse le groupe en facade. On la roule d’une piece a l’autre, on sort la gaine par la fenetre, et c’est tout.'
  },
  {
    ref: 'olimpia-dolceclima', marque: 'Olimpia Splendid', nom: 'Dolceclima Silent 12 A+',
    type: 'mobile', couleur: '#f1f5f9',
    froid: 2.7, chaud: 0, surfaceMin: 15, surfaceMax: 27,
    seer: 0, scop: 0, eer: 3.0, classeFroid: 'A+', classeChaud: '',
    sonore: 62, wifi: true, fluide: 'R290', garantie: 2,
    prix: 799, stock: 'En stock', note: 4.5, avis: 287,
    points: ['La plus silencieuse des mobiles', 'Pilotage par application', 'Classe A+ au froid'],
    resume: 'Une mobile reste bruyante puisque le compresseur est dans la piece, mais celle-ci fait nettement mieux que la moyenne, et son rendement aussi.'
  },
  {
    ref: 'electrolux-chillflex', marque: 'Electrolux', nom: 'ChillFlex Pro EXP26U338CW',
    type: 'mobile', couleur: '#f8fafc',
    froid: 2.6, chaud: 0, surfaceMin: 14, surfaceMax: 25,
    seer: 0, scop: 0, eer: 2.6, classeFroid: 'A', classeChaud: '',
    sonore: 65, wifi: true, fluide: 'R290', garantie: 2,
    prix: 449, prixBarre: 529, stock: 'En stock', note: 4.1, avis: 203,
    points: ['Le prix le plus bas en 2,6 kW', 'Mode deshumidificateur', 'Roulettes et poignees encastrees'],
    resume: 'Pour passer l’ete sans travaux et sans se ruiner. Le bruit est celui d’une mobile d’entree de gamme, il faut le savoir avant de commander.'
  },
  {
    ref: 'trotec-pac2000x', marque: 'Trotec', nom: 'PAC 2000 X',
    type: 'mobile', couleur: '#fef3c7',
    froid: 2.0, chaud: 0, surfaceMin: 10, surfaceMax: 18,
    seer: 0, scop: 0, eer: 2.6, classeFroid: 'A', classeChaud: '',
    sonore: 64, wifi: false, fluide: 'R290', garantie: 2,
    prix: 329, stock: 'En stock', note: 4.0, avis: 164,
    points: ['Compacte, 24 kg', 'Bureau ou petite chambre', 'Minuterie 24 heures'],
    resume: 'Deux kilowatts, c’est peu, mais suffisant pour un bureau ferme de quinze metres carres. Au-dela, elle tournera sans arret sans jamais y arriver.'
  },
  {
    ref: 'kit-pose-4m', marque: 'MP Climatisation', nom: 'Kit de liaison frigorifique 4 m',
    type: 'accessoire', couleur: '#e2e8f0',
    froid: 0, chaud: 0, surfaceMin: 0, surfaceMax: 0,
    seer: 0, scop: 0, classeFroid: '', classeChaud: '',
    sonore: 0, wifi: false, fluide: '', garantie: 2,
    prix: 149, stock: 'En stock', note: 4.6, avis: 91,
    points: ['Cuivre isole 1/4 et 3/8', 'Cable d’interconnexion 4 x 1,5', 'Gaine d’evacuation des condensats'],
    resume: 'Le necessaire entre l’unite interieure et le groupe exterieur, longueur quatre metres. Prevoyez-le si votre installateur ne le fournit pas.'
  },
  {
    ref: 'support-mural', marque: 'MP Climatisation', nom: 'Support mural antivibratile',
    type: 'accessoire', couleur: '#e2e8f0',
    froid: 0, chaud: 0, surfaceMin: 0, surfaceMax: 0,
    seer: 0, scop: 0, classeFroid: '', classeChaud: '',
    sonore: 0, wifi: false, fluide: '', garantie: 2,
    prix: 59, stock: 'En stock', note: 4.5, avis: 143,
    points: ['Acier galvanise, 160 kg', 'Plots caoutchouc fournis', 'Reglable de 40 a 60 cm'],
    resume: 'Les plots de caoutchouc evitent que les vibrations du groupe partent dans le mur, et par le mur chez le voisin.'
  },
  {
    ref: 'cache-groupe', marque: 'MP Climatisation', nom: 'Cache-groupe bois et aluminium',
    type: 'accessoire', couleur: '#fef9c3',
    froid: 0, chaud: 0, surfaceMin: 0, surfaceMax: 0,
    seer: 0, scop: 0, classeFroid: '', classeChaud: '',
    sonore: 0, wifi: false, fluide: '', garantie: 2,
    prix: 129, stock: 'En stock', note: 4.4, avis: 67,
    points: ['Lames ajourees, sans perte de debit', 'Bois traite classe 4', 'Montage sans percer le groupe'],
    resume: 'Pour faire accepter le groupe exterieur par une copropriete, ou simplement pour qu’il ne soit pas la premiere chose qu’on voit sur la terrasse.'
  }
];

/* Prestations de pose proposees a l’ajout au panier. */
window.POSES = {
  monosplit: { nom: 'Pose par un frigoriste certifie', prix: 690 },
  multisplit: { nom: 'Pose multisplit par un frigoriste certifie', prix: 1190 },
  console: { nom: 'Pose console par un frigoriste certifie', prix: 720 },
  gainable: { nom: 'Pose gainable, etude de reseau comprise', prix: 1490 },
  mobile: null,
  accessoire: null
};
