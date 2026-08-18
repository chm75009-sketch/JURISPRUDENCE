/* Ce que chaque question accepte, module négociation obligatoire.

   Les listes viennent du code qui reconnaît les valeurs, et moteur/commun/
   propositions.js le vérifie dans les deux sens à la publication : une valeur
   proposée doit exister dans le code, un littéral que le code compare doit être
   proposé. Le formulaire ne peut donc pas offrir une réponse que le moteur ne
   saurait pas exploiter.

   Usage : node propositions-nao.js      */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles-nao.js", "moteur-nao.js"].map(lire);

const OUI_NON = ["oui", "non"];

const P = {
  sectionsSyndicales: { valeurs: OUI_NON, libre: false,
    aide: "Une section syndicale existe dès qu'un syndicat représentatif a désigné un délégué syndical ou constitué une section. C'est elle — pas l'effectif — qui oblige à négocier. Sans section syndicale : rien n'est dû." },
  groupe: { valeurs: OUI_NON, libre: false,
    aide: "Le groupe au sens du comité de groupe : une entreprise dominante et celles qu'elle contrôle. Il compte pour le seuil de 300 salariés des négociations triennales." },
  dimensionCommunautaire: { valeurs: OUI_NON, libre: false,
    aide: "Un groupe présent dans plusieurs pays de l'Union. S'il emploie au moins 150 salariés en France, les négociations triennales sont dues." },
  "accordMethode.existe": { valeurs: OUI_NON, libre: false,
    aide: "Un accord peut organiser vos négociations : quels thèmes, tous les combien (au plus tous les 4 ans), avec quelles informations. Sans accord, la loi impose son rythme : rémunération et égalité chaque année, gestion des emplois tous les 3 ans à partir de 300 salariés." },
  "accordMethode.verse": { valeurs: OUI_NON, libre: false,
    aide: "Joignez-le. C'est lui qui fixe votre calendrier : sans son texte, l'audit ne peut pas dire si vous êtes à jour." },
  "accordMethode.mentions": {
    valeurs: ["themes", "contenu", "calendrier", "informations", "suivi"], libre: false, multiple: true,
    aide: "Les cinq mentions que la loi impose à cet accord : les thèmes et leur périodicité, le contenu de chacun, le calendrier et les lieux, les informations remises et leur date, le suivi des engagements. S'il en manque une, l'accord ne fait pas écran et le rythme légal s'applique." },
  "negos.remuneration.issue": { valeurs: ["accord", "PV de désaccord", "en cours", "aucune"], libre: false,
    aide: "Comment la négociation s'est terminée. La loi n'oblige pas à conclure — elle oblige à négocier, et à formaliser l'échec par un procès-verbal de désaccord, déposé." },
  "negos.egalite.issue": { valeurs: ["accord", "PV de désaccord", "en cours", "aucune"], libre: false,
    aide: "Même règle. Attention : sans accord sur l'égalité, un plan d'action annuel devient obligatoire, et il se dépose." },
  "negos.gepp.issue": { valeurs: ["accord", "PV de désaccord", "en cours", "aucune"], libre: false,
    aide: "Même règle, pour la gestion des emplois et des parcours professionnels." },
  "negos.experimentes.issue": { valeurs: ["accord", "PV de désaccord", "en cours", "aucune"], libre: false,
    aide: "Même règle, pour la négociation sur les salariés expérimentés." },
  "negos.remuneration.depot": { valeurs: OUI_NON, libre: false,
    aide: "Accord comme procès-verbal de désaccord se déposent auprès de l'administration. Un texte signé mais non déposé n'est pas en règle." },
  "negos.egalite.depot": { valeurs: OUI_NON, libre: false, aide: "Même règle de dépôt." },
  "negos.gepp.depot": { valeurs: OUI_NON, libre: false, aide: "Même règle de dépôt." },
  "negos.remuneration.pvOuvertureEcarts": { valeurs: OUI_NON, libre: false,
    aide: "Un accord sur les salaires ne peut être déposé qu'accompagné du procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes. Sans lui, le dépôt sera refusé." },
  "negos.remuneration.themesTraites": {
    valeurs: ["salaires", "temps de travail", "épargne salariale", "écarts femmes-hommes"], libre: false, multiple: true,
    aide: "Les quatre thèmes que la loi met sur la table pour cette négociation. Cochez ceux qui y ont réellement été traités." },
  "negos.egalite.themesTraites": {
    valeurs: ["articulation", "écarts femmes-hommes", "discriminations", "handicap", "prévoyance", "déconnexion"], libre: false, multiple: true,
    aide: "Les six thèmes que la loi met sur la table pour cette négociation. Cochez ceux qui y ont réellement été traités." },
  "negos.egalite.planAction.existe": { valeurs: OUI_NON, libre: false,
    aide: "Sans accord sur l'égalité, un plan d'action annuel est obligatoire : objectifs de progression, actions chiffrées, coût." },
  "negos.egalite.planAction.depot": { valeurs: OUI_NON, libre: false,
    aide: "Le plan d'action se dépose auprès de l'administration, comme un accord." },
  "premiereReunion.lieuCalendrierFixes": { valeurs: OUI_NON, libre: false,
    aide: "La première réunion doit fixer le lieu et le calendrier des suivantes. C'est une exigence de loyauté, pas une formalité." },
  "premiereReunion.informationsRemises": { valeurs: OUI_NON, libre: false,
    aide: "Les négociateurs doivent recevoir les informations nécessaires pour négocier en connaissance de cause, et savoir quand ils les recevront." },
  reponsesMotivees: { valeurs: OUI_NON, libre: false,
    aide: "Répondre — et répondre motivé — aux propositions syndicales fait partie de la négociation loyale. Le silence se retient contre l'employeur." },
  "decisionUnilaterale.prise": { valeurs: OUI_NON, libre: false,
    aide: "Pendant qu'une négociation est en cours, l'employeur ne peut pas décider seul dans les matières discutées, sauf urgence justifiée." },
  "decisionUnilaterale.urgence": { valeurs: OUI_NON, libre: false,
    aide: "L'urgence est l'exception que la loi réserve. Elle se prouve : gardez ce qui l'établit." },
  "demandeSyndicale.recue": { valeurs: OUI_NON, libre: false,
    aide: "Quand un syndicat demande l'ouverture d'une négociation en retard, l'employeur transmet la demande aux autres syndicats sous 8 jours et convoque tout le monde sous 15 jours." },
  indexEgalitePublie: { valeurs: OUI_NON, libre: false,
    aide: "L'index de l'égalité professionnelle (écarts de rémunération) doit être publié chaque année à partir de 50 salariés. Sa non-publication expose, à elle seule, à la pénalité de 1 %." },
  pieces: { valeurs: [], autres: ["accord-methode", "pv-desaccord", "plan-action-egalite"], libre: true, multiple: true, indicatif: true,
    aide: "Les documents que vous joignez. Un accord ne se prouve que par son texte." },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS };

if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
