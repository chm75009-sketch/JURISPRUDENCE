/* Ce que chaque question accepte, module santé, sécurité et conditions de
   travail.

   Les listes viennent du code qui reconnaît les valeurs, et moteur/commun/
   propositions.js le vérifie dans les deux sens à la publication : une valeur
   proposée doit exister dans le code, un littéral que le code compare doit être
   proposé. Le formulaire ne peut donc pas offrir une réponse que le moteur ne
   saurait pas exploiter.

   Usage : node propositions-sst.js      */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles-sst.js", "moteur-sst.js"].map(lire);

const OUI_NON = ["oui", "non"];

const P = {
  "cse.existe": { valeurs: OUI_NON, libre: false,
    aide: "Le comité social et économique. S'il n'existe pas, ce module ne juge pas cette absence — le module « comité » de l'application le fait — mais les contrôles qui le supposent deviennent sans objet." },
  "duerp.existe": { valeurs: OUI_NON, libre: false,
    aide: "Le document unique d'évaluation des risques professionnels (DUERP) est dû par tout employeur, dès le premier salarié. Son absence est une infraction pénale (contravention de 5e classe)." },
  "duerp.unitesTravail": { valeurs: OUI_NON, libre: false,
    aide: "L'évaluation doit comporter un inventaire des risques identifiés dans chaque unité de travail : atelier, chantier, service, poste — y compris les ambiances thermiques." },
  "duerp.versionsConservees": { valeurs: OUI_NON, libre: false,
    aide: "Chaque version du document doit être conservée quarante ans au moins et rester consultable — par les salariés, les anciens salariés, le comité, le médecin du travail, l'inspection." },
  "duerp.avisAffiche": { valeurs: OUI_NON, libre: false,
    aide: "Un avis indiquant comment consulter le document unique doit être affiché à une place aisément accessible — au même endroit que le règlement intérieur s'il en existe un." },
  "duerp.consultationCSE": { valeurs: OUI_NON, libre: false,
    aide: "Le comité est consulté sur le document unique et sur chacune de ses mises à jour : il contribue à l'évaluation des risques." },
  "duerp.transmisSPST": { valeurs: OUI_NON, libre: false,
    aide: "À chaque mise à jour, le document est transmis au service de prévention et de santé au travail (la « médecine du travail ») auquel l'entreprise adhère." },
  "evenement.survenu": { valeurs: OUI_NON, libre: false,
    aide: "Un déménagement, une nouvelle machine, une réorganisation, un accident ou une alerte qui éclaire un risque : chacun de ces événements impose une mise à jour, quel que soit l'effectif." },
  "evenement.majFaite": { valeurs: OUI_NON, libre: false,
    aide: "Si un tel événement est survenu, la mise à jour du document unique n'attend pas l'échéance annuelle." },
  "programmeAnnuel.existe": { valeurs: OUI_NON, libre: false,
    aide: "À partir de cinquante salariés, l'évaluation débouche sur un programme annuel : mesures de l'année à venir, conditions d'exécution, indicateurs, coût, calendrier, ressources." },
  "programmeAnnuel.presenteCSE": { valeurs: OUI_NON, libre: false,
    aide: "Le programme est présenté au comité avec le rapport annuel, dans la consultation sur la politique sociale. Le comité peut proposer un ordre de priorité et des mesures supplémentaires." },
  "listeActions.consignee": { valeurs: OUI_NON, libre: false,
    aide: "Sous cinquante salariés, pas de programme formel : une liste d'actions de prévention et de protection, consignée dans le document unique lui-même." },
  etablissementDistinct300: { valeurs: OUI_NON, libre: false,
    aide: "La commission santé-sécurité est due dans chaque établissement distinct d'au moins trois cents salariés, même si l'entreprise entière n'atteint pas ce seuil ailleurs." },
  etablissementRisqueParticulier: { valeurs: OUI_NON, libre: false,
    aide: "Sites nucléaires, installations Seveso seuil haut, stockages souterrains : la commission y est due quel que soit l'effectif." },
  cssctImposeeInspection: { valeurs: OUI_NON, libre: false,
    aide: "Sous trois cents salariés, l'inspecteur du travail peut imposer la commission quand la nature des activités ou l'agencement des locaux le rend nécessaire." },
  "cssct.existe": { valeurs: OUI_NON, libre: false,
    aide: "La commission santé, sécurité et conditions de travail du comité. Obligatoire à partir de trois cents salariés ; possible partout par accord." },
  "cssct.presideeEmployeur": { valeurs: OUI_NON, libre: false,
    aide: "La commission est présidée par l'employeur ou son représentant, qui peut se faire assister — sans dépasser en nombre les représentants du personnel titulaires." },
  "cssct.membreSecondCollege": { valeurs: OUI_NON, libre: false,
    aide: "Au moins un des trois membres minimum vient du second collège (agents de maîtrise et techniciens) ou, le cas échéant, du troisième (cadres)." },
  "cssct.designesParCSE": { valeurs: OUI_NON, libre: false,
    aide: "Les membres de la commission sont désignés par le comité, parmi ses membres, par résolution, pour la durée du mandat." },
  "cssct.modalitesFixees": {
    valeurs: ["accord d'entreprise", "accord avec le comité", "règlement intérieur", "aucune"], libre: false,
    aide: "Nombre de membres, missions déléguées, fonctionnement, heures de délégation, formation, moyens : un accord d'entreprise les fixe ; sans délégué syndical, un accord avec le comité ; à défaut d'accord, le règlement intérieur du comité doit le faire." },
  "cssct.delegationConforme": { valeurs: OUI_NON, libre: false,
    aide: "Deux choses ne se délèguent jamais à la commission : le recours à un expert, et les attributions consultatives du comité. Une consultation rendue par la seule commission serait irrégulière." },
  formationSSCT: { valeurs: OUI_NON, libre: false,
    aide: "Cinq jours au moins au premier mandat, trois au renouvellement — cinq pour les membres de la commission à partir de trois cents salariés. L'employeur finance." },
  referentEmployeur: { valeurs: OUI_NON, libre: false,
    aide: "À partir de deux cent cinquante salariés, un référent oriente, informe et accompagne les salariés contre le harcèlement sexuel et les agissements sexistes. Ses coordonnées font partie de l'affichage obligatoire." },
  referentCSE: { valeurs: OUI_NON, libre: false,
    aide: "Quel que soit l'effectif, le comité désigne parmi ses membres un référent harcèlement sexuel, pour la durée du mandat. Ses coordonnées aussi font partie de l'information due." },
  infoHarcelementMoral: { valeurs: OUI_NON, libre: false,
    aide: "Le texte de l'article 222-33-2 du code pénal (harcèlement moral) doit être porté à la connaissance des salariés par tout moyen : affichage, intranet, livret d'accueil." },
  infoHarcelementSexuel: { valeurs: OUI_NON, libre: false,
    aide: "Dans les lieux de travail et les locaux d'embauche : le texte de l'article 222-33 du code pénal, les actions civiles et pénales ouvertes, et les coordonnées des autorités compétentes." },
  infoCoordonnees: { valeurs: OUI_NON, libre: false,
    aide: "Adresse et numéro du médecin du travail, de l'inspection du travail (avec le nom de l'inspecteur), du Défenseur des droits, du référent employeur (à partir de 250) et du référent du comité." },
  risquesHarcelementEvalues: { valeurs: OUI_NON, libre: false,
    aide: "La planification de la prévention intègre expressément les risques de harcèlement moral, de harcèlement sexuel et d'agissements sexistes — leur place naturelle est le document unique." },
  mesuresPreventionHarcelement: { valeurs: OUI_NON, libre: false,
    aide: "Procédure de signalement, sensibilisation, rappel au règlement intérieur : l'employeur prend toutes dispositions nécessaires pour prévenir — et, pour le harcèlement sexuel, y mettre un terme et sanctionner." },
  "signalement.recu": { valeurs: OUI_NON, libre: false,
    aide: "Un signalement reçu — par la victime, un témoin, un élu — déclenche l'obligation de réagir : ne rien faire est le seul choix toujours fautif." },
  "signalement.enqueteMenee": { valeurs: OUI_NON, libre: false,
    aide: "Une enquête proportionnée aux faits signalés. Sa valeur probante relève de l'appréciation souveraine des juges du fond (Soc., 18 juin 2025, n° 23-19.022) : documentez-la." },
  "signalement.mesuresPrises": { valeurs: OUI_NON, libre: false,
    aide: "Mesures conservatoires, éloignement, sanction si les faits sont établis : l'obligation est de mettre un terme aux agissements, pas seulement de les constater." },
  pieces: { valeurs: [], autres: ["duerp", "programme-annuel", "procedure-signalement", "rapport-enquete"], libre: true, multiple: true, indicatif: true,
    aide: "Les documents que vous joignez. Un document unique ne se prouve que par son texte." },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS };

if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
