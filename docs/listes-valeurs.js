/* LES LISTES DE VALEURS DES CHAMPS.

   Demande du 14 septembre 2026 : partout où une liste existe, la proposer,
   plutôt que de laisser taper au clavier d'un téléphone une donnée qui ne se
   recoupera avec rien. Chaque liste laisse la saisie libre ouverte : ces
   listes couvrent le courant, pas l'exhaustif, et un dossier réel porte
   toujours le cas qu'on n'avait pas prévu.

   Les nationalités sont écrites au féminin singulier, forme employée sur un
   contrat de travail et dans un registre du personnel (« nationalité :
   française »). Les pays gardent leur nom d'usage.                        */

(function (window) {
  "use strict";

  var NATIONALITES = [
    "française", "afghane", "albanaise", "algérienne", "allemande", "américaine", "andorrane",
    "angolaise", "antiguaise", "argentine", "arménienne", "australienne", "autrichienne",
    "azerbaïdjanaise", "bahamienne", "bahreïnienne", "bangladaise", "barbadienne", "belge",
    "bélizienne", "béninoise", "bhoutanaise", "biélorusse", "birmane", "bissau-guinéenne",
    "bolivienne", "bosnienne", "botswanaise", "brésilienne", "britannique", "brunéienne",
    "bulgare", "burkinabé", "burundaise", "cambodgienne", "camerounaise", "canadienne",
    "cap-verdienne", "centrafricaine", "chilienne", "chinoise", "chypriote", "colombienne",
    "comorienne", "congolaise", "congolaise (RDC)", "costaricaine", "croate", "cubaine",
    "danoise", "djiboutienne", "dominicaine", "dominiquaise", "égyptienne", "émirienne",
    "équatorienne", "érythréenne", "espagnole", "estonienne", "eswatinienne", "éthiopienne",
    "fidjienne", "finlandaise", "gabonaise", "gambienne", "géorgienne", "ghanéenne",
    "grecque", "grenadienne", "guatémaltèque", "guinéenne", "équato-guinéenne", "guyanienne",
    "haïtienne", "hondurienne", "hongroise", "indienne", "indonésienne", "irakienne",
    "iranienne", "irlandaise", "islandaise", "israélienne", "italienne", "ivoirienne",
    "jamaïcaine", "japonaise", "jordanienne", "kazakhe", "kényane", "kirghize", "kiribatienne",
    "kosovare", "koweïtienne", "laotienne", "lettone", "libanaise", "libérienne", "libyenne",
    "liechtensteinoise", "lituanienne", "luxembourgeoise", "macédonienne", "malgache",
    "malaisienne", "malawienne", "maldivienne", "malienne", "maltaise", "marocaine",
    "marshallaise", "mauricienne", "mauritanienne", "mexicaine", "micronésienne", "moldave",
    "monégasque", "mongole", "monténégrine", "mozambicaine", "namibienne", "nauruane",
    "néerlandaise", "néo-zélandaise", "népalaise", "nicaraguayenne", "nigériane", "nigérienne",
    "nord-coréenne", "norvégienne", "omanaise", "ougandaise", "ouzbèke", "pakistanaise",
    "palaosienne", "palestinienne", "panaméenne", "papouasienne", "paraguayenne", "péruvienne",
    "philippine", "polonaise", "portugaise", "qatarienne", "roumaine", "russe", "rwandaise",
    "saint-lucienne", "saint-marinaise", "salomonaise", "salvadorienne", "samoane",
    "santoméenne", "saoudienne", "sénégalaise", "serbe", "seychelloise", "sierra-léonaise",
    "singapourienne", "slovaque", "slovène", "somalienne", "soudanaise", "sud-africaine",
    "sud-coréenne", "sud-soudanaise", "sri-lankaise", "suédoise", "suisse", "surinamaise",
    "syrienne", "tadjike", "tanzanienne", "tchadienne", "tchèque", "thaïlandaise",
    "timoraise", "togolaise", "tonguienne", "trinidadienne", "tunisienne", "turkmène",
    "turque", "tuvaluane", "ukrainienne", "uruguayenne", "vanuatuane", "vaticane",
    "vénézuélienne", "vietnamienne", "yéménite", "zambienne", "zimbabwéenne",
  ];

  var PAYS = [
    "France", "Afghanistan", "Afrique du Sud", "Albanie", "Algérie", "Allemagne", "Andorre",
    "Angola", "Arabie saoudite", "Argentine", "Arménie", "Australie", "Autriche", "Azerbaïdjan",
    "Bahreïn", "Bangladesh", "Belgique", "Bénin", "Biélorussie", "Bolivie", "Bosnie-Herzégovine",
    "Botswana", "Brésil", "Bulgarie", "Burkina Faso", "Burundi", "Cambodge", "Cameroun",
    "Canada", "Cap-Vert", "Chili", "Chine", "Chypre", "Colombie", "Comores", "Congo",
    "Congo (RDC)", "Corée du Sud", "Costa Rica", "Côte d'Ivoire", "Croatie", "Cuba", "Danemark",
    "Djibouti", "Égypte", "Émirats arabes unis", "Équateur", "Érythrée", "Espagne", "Estonie",
    "Éthiopie", "Finlande", "Gabon", "Gambie", "Géorgie", "Ghana", "Grèce", "Guatemala",
    "Guinée", "Guinée-Bissau", "Guinée équatoriale", "Haïti", "Honduras", "Hongrie", "Inde",
    "Indonésie", "Irak", "Iran", "Irlande", "Islande", "Israël", "Italie", "Jamaïque", "Japon",
    "Jordanie", "Kazakhstan", "Kenya", "Kosovo", "Koweït", "Laos", "Lettonie", "Liban",
    "Liberia", "Libye", "Lituanie", "Luxembourg", "Macédoine du Nord", "Madagascar", "Malaisie",
    "Malawi", "Maldives", "Mali", "Malte", "Maroc", "Maurice", "Mauritanie", "Mexique",
    "Moldavie", "Monaco", "Mongolie", "Monténégro", "Mozambique", "Namibie", "Népal",
    "Nicaragua", "Niger", "Nigeria", "Norvège", "Nouvelle-Zélande", "Oman", "Ouganda",
    "Ouzbékistan", "Pakistan", "Panama", "Paraguay", "Pays-Bas", "Pérou", "Philippines",
    "Pologne", "Portugal", "Qatar", "Roumanie", "Royaume-Uni", "Russie", "Rwanda", "Sénégal",
    "Serbie", "Sierra Leone", "Singapour", "Slovaquie", "Slovénie", "Somalie", "Soudan",
    "Sri Lanka", "Suède", "Suisse", "Syrie", "Tchad", "Tchéquie", "Thaïlande", "Togo",
    "Tunisie", "Turquie", "Turkménistan", "Ukraine", "Uruguay", "Venezuela", "Viêt Nam",
    "Yémen", "Zambie", "Zimbabwe",
  ];

  /* Les titres qui autorisent l'activité salariée d'un travailleur étranger,
     tels qu'ils se nomment sur le document lui-même. La colonne du registre
     unique du personnel attend ce libellé, suivi du numéro. */
  var TITRES_SEJOUR = [
    "Carte de résident", "Carte de résident de longue durée UE",
    "Carte de séjour pluriannuelle", "Carte de séjour temporaire salarié",
    "Carte de séjour temporaire travailleur temporaire",
    "Carte de séjour temporaire vie privée et familiale",
    "Carte de séjour temporaire étudiant", "Passeport talent",
    "Autorisation provisoire de travail", "Visa long séjour valant titre de séjour",
    "Récépissé de demande de titre de séjour autorisant à travailler",
    "Ressortissant de l'Union européenne, aucun titre requis",
  ];

  /* Les motifs de recours au contrat à durée déterminée, dans les termes du
     code du travail. La liste sert de choix, elle ne dispense pas de vérifier
     que le cas y entre. */
  var MOTIFS_CDD = [
    "Remplacement d'un salarié absent",
    "Remplacement d'un salarié dont le contrat est suspendu",
    "Attente de l'entrée en service d'un salarié recruté en contrat à durée indéterminée",
    "Remplacement d'un salarié passé provisoirement à temps partiel",
    "Accroissement temporaire de l'activité de l'entreprise",
    "Emploi à caractère saisonnier",
    "Emploi pour lequel il est d'usage de ne pas recourir au contrat à durée indéterminée",
    "Remplacement du chef d'entreprise ou de son conjoint",
    "Contrat conclu au titre d'une politique de l'emploi",
    "Commande exceptionnelle à l'exportation",
    "Travaux urgents nécessités par des mesures de sécurité",
  ];

  /* Les emplois : ceux que l'on rencontre le plus souvent, tous secteurs, et
     ceux du transport et de la logistique, secteur où l'intitulé exact compte
     pour la classification. La saisie libre reste ouverte : aucune liste
     d'emplois n'est complète. */
  var EMPLOIS = [
    "Agent d'entretien", "Agent d'exploitation", "Agent de maintenance", "Agent de quai",
    "Agent de sécurité", "Aide-comptable", "Assistant administratif", "Assistant commercial",
    "Assistant de direction", "Assistant ressources humaines", "Attaché commercial",
    "Cariste", "Chargé de clientèle", "Chargé de recrutement", "Chauffeur livreur",
    "Chauffeur poids lourd", "Chauffeur super poids lourd", "Chauffeur véhicule léger",
    "Chef d'atelier", "Chef d'équipe", "Chef de quai", "Comptable", "Conducteur de travaux",
    "Conducteur receveur", "Conducteur de véhicule jusqu'à 3,5 tonnes",
    "Conducteur de véhicule de 3,5 à 11 tonnes", "Conducteur de véhicule de 11 à 19 tonnes",
    "Conducteur de véhicule de plus de 19 tonnes", "Contrôleur de gestion", "Coursier",
    "Développeur", "Directeur administratif et financier", "Directeur d'exploitation",
    "Employé administratif", "Employé de libre-service", "Exploitant transport",
    "Gestionnaire de paie", "Hôte d'accueil", "Ingénieur", "Juriste", "Magasinier",
    "Manutentionnaire", "Mécanicien", "Mécanicien poids lourd", "Préparateur de commandes",
    "Responsable d'agence", "Responsable d'exploitation", "Responsable de site",
    "Responsable logistique", "Responsable qualité", "Responsable ressources humaines",
    "Secrétaire", "Technicien de maintenance", "Téléconseiller", "Vendeur",
  ];

  var QUALIFICATIONS = ["Ouvrier", "Employé", "Technicien", "Agent de maîtrise", "Cadre",
    "Cadre dirigeant", "Apprenti", "Stagiaire"];

  var CIVILITES = ["Madame", "Monsieur"];

  /* Les villes de plus de cinquante mille habitants, pour les champs de lieu
     (naissance, lieu de signature). Au-delà, la saisie libre. */
  var VILLES = [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg",
    "Bordeaux", "Lille", "Rennes", "Reims", "Toulon", "Saint-Étienne", "Le Havre", "Grenoble",
    "Dijon", "Angers", "Villeurbanne", "Saint-Denis", "Nîmes", "Clermont-Ferrand", "Aix-en-Provence",
    "Le Mans", "Brest", "Tours", "Amiens", "Annecy", "Limoges", "Boulogne-Billancourt",
    "Metz", "Besançon", "Perpignan", "Orléans", "Rouen", "Saint-Denis (La Réunion)", "Argenteuil",
    "Montreuil", "Mulhouse", "Caen", "Nancy", "Saint-Paul", "Roubaix", "Tourcoing", "Nanterre",
    "Vitry-sur-Seine", "Créteil", "Avignon", "Poitiers", "Aubervilliers", "Dunkerque", "Aulnay-sous-Bois",
    "Versailles", "Colombes", "Saint-Pierre", "Asnières-sur-Seine", "Courbevoie", "Cherbourg-en-Cotentin",
    "Le Tampon", "Rueil-Malmaison", "Champigny-sur-Marne", "Béziers", "Pau", "La Rochelle",
    "Fort-de-France", "Saint-Maur-des-Fossés", "Cannes", "Calais", "Antibes", "Mérignac",
    "Saint-Nazaire", "Colmar", "Issy-les-Moulineaux", "Noisy-le-Grand", "Évry-Courcouronnes",
    "Vénissieux", "Cergy", "Pessac", "Valence", "Bourges", "Levallois-Perret", "Ivry-sur-Seine",
    "Quimper", "La Seyne-sur-Mer", "Villeneuve-d'Ascq", "Antony", "Clichy", "Troyes",
    "Montauban", "Neuilly-sur-Seine", "Sarcelles", "Niort", "Chambéry", "Le Blanc-Mesnil",
    "Lorient", "Beauvais", "Hyères", "Saint-Quentin", "Épinay-sur-Seine", "Meaux", "Bondy",
    "Fontenay-sous-Bois", "Clamart", "Narbonne", "Belfort", "Vincennes", "Charleville-Mézières",
    "Sartrouville", "Bobigny", "Maisons-Alfort", "Évreux", "Cholet", "Chalon-sur-Saône",
    "Sevran", "Vannes", "Arles", "Corbeil-Essonnes", "Salon-de-Provence", "Bayonne", "Laval",
    "Albi", "Saint-Ouen-sur-Seine", "Brive-la-Gaillarde", "Massy", "Blois", "Carcassonne",
  ];

  /* LES SALARIÉS DÉJÀ INSCRITS AU REGISTRE. Ce n'est pas une liste écrite
     d'avance : elle se lit dans le registre du personnel tenu sur ce poste,
     et sert à ne pas retaper un nom qu'on a déjà saisi une fois. Registre
     vide, la liste est vide et le champ reste ce qu'il était. */
  function salaries() {
    var E = null;
    try { E = JSON.parse(localStorage.getItem("registre-personnel") || "null"); } catch (e) { return []; }
    if (!E || !E.salaries) return [];
    var out = [];
    E.salaries.forEach(function (s) {
      var n = [String(s.pre || "").trim(), String(s.nom || "").trim()].filter(Boolean).join(" ").trim();
      if (n && out.indexOf(n) < 0) out.push(n);
    });
    return out.sort(function (a, b) { return a.localeCompare(b, "fr"); });
  }

  window.ListesValeurs = {
    salarie: salaries,
    nationalite: NATIONALITES,
    pays: PAYS,
    titreSejour: TITRES_SEJOUR,
    motifCdd: MOTIFS_CDD,
    emploi: EMPLOIS,
    qualification: QUALIFICATIONS,
    civilite: CIVILITES,
    ville: VILLES,
  };
})(window);
