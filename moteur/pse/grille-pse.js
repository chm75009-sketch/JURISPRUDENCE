/* La grille de jurisprudence du module.

   Vingt arrêts publiés de la chambre sociale, tous versés au dépôt dans
   pse_corpus.json avec leur sommaire intégral : rien n'est cité de mémoire, et
   chaque règle renvoie au numéro de pourvoi qui la porte. Le sommaire est
   reproduit dans le rapport, sous la règle, pour que le lecteur juge lui-même
   si la règle dit bien ce que l'arrêt dit.

   Une règle ne s'affiche que si sa condition est remplie par le dossier. Celles
   qui ne le sont pas ne disent rien — ni dans un sens ni dans l'autre — et leur
   nombre est publié : c'est la mesure honnête de ce que la grille n'a pas eu à
   dire.

   Ce que cette grille ne fait pas : elle ne tranche pas. Un arrêt de la chambre
   sociale ne lie pas l'autorité administrative, et le contentieux du contenu du
   plan relève du juge administratif depuis la loi du 14 juin 2013 — plusieurs
   des arrêts retenus le disent expressément. La grille signale ; elle ne
   conclut jamais à la conformité. */
const fs = require("fs");
const CORPUS = JSON.parse(fs.readFileSync(__dirname + "/pse_corpus.json", "utf8"));

const nb = x => (typeof x === "number" && isFinite(x) ? x : null);
const oui = x => x === true || x === "oui";
const mesures = f => Array.isArray((f.plan || {}).mesures) ? f.plan.mesures : [];
const planDu = f => {
  const e = nb(f.effectif), n = nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
  return e !== null && n !== null && e >= 50 && n >= 10;
};

const G = [];
const r = (id, sujet, si, dit, arrets) => G.push({ id, sujet, si, dit, arrets });

r("PSE-JUR-01", "Calibrage",
  f => planDu(f) && oui(f.groupe),
  "La pertinence du plan s'apprécie en fonction des moyens dont disposent l'entreprise et le groupe pour maintenir les emplois ou faciliter le reclassement. S'agissant des possibilités de reclassement dans le groupe, elle s'apprécie parmi les entreprises dont les activités, l'organisation ou le lieu d'exploitation permettent la permutation de tout ou partie du personnel.",
  ["15-15.190"]);

r("PSE-JUR-02", "Sanction",
  f => planDu(f),
  "La nullité de la procédure ne peut être prononcée qu'en cas d'absence ou d'insuffisance du plan — non pour un défaut tenant à la cause du licenciement. L'indemnité allouée à ce titre répare intégralement le préjudice résultant du caractère illicite du licenciement.",
  ["11-20.741", "16-11.563"]);

r("PSE-JUR-03", "Égalité de traitement",
  f => mesures(f).length > 1,
  "Un plan peut contenir des mesures réservées à certains salariés, à la condition que tous les salariés placés dans une situation identique au regard de l'avantage en cause puissent en bénéficier, à moins qu'une différence de traitement soit justifiée par des raisons objectives et pertinentes, et que les règles d'attribution soient préalablement définies et contrôlables.",
  ["14-16.009", "09-15.182"]);

r("PSE-JUR-04", "Seuils",
  f => oui(f.groupe) || nb(f.effectifEtablissement) !== null,
  "Les conditions d'effectif et de nombre qui imposent l'établissement d'un plan s'apprécient au niveau de l'entreprise que dirige l'employeur — non au niveau de l'unité économique et sociale ou du groupement d'intérêt économique.",
  ["07-45.481"]);

r("PSE-JUR-05", "Seuils",
  f => nb(f.effectif) !== null && f.effectif < 50 && mesures(f).length > 0,
  "Un plan mis en place volontairement par un employeur employant moins de cinquante salariés n'a pas à satisfaire aux exigences des articles L. 1233-61 et L. 1233-62. Les contrôles de contenu de ce module sont donc sans objet sur votre dossier — mais l'engagement pris, lui, oblige.",
  ["14-10.031"]);

r("PSE-JUR-06", "Priorité de réembauche",
  f => (f.plan || {}).dateRupture || f.dateNotification,
  "L'obligation d'informer le salarié de tout emploi devenu disponible et compatible avec sa qualification n'est pas limitée aux emplois pourvus par contrat à durée indéterminée : les contrats à durée déterminée sont concernés.",
  ["08-40.125"]);

r("PSE-JUR-07", "Priorité de réembauche",
  f => (f.plan || {}).dateRupture || f.dateNotification,
  "L'employeur qui établit qu'aucun emploi disponible en rapport avec les compétences des salariés n'existait — ni avant le prononcé des licenciements, ni ensuite dans le cadre de la priorité de réembauche, au besoin après une formation d'adaptation — échappe à la nullité du plan.",
  ["14-10.766"]);

r("PSE-JUR-08", "Contrat de sécurisation professionnelle",
  f => /sécurisation/i.test(String((f.plan || {}).accompagnement || "")),
  "La rupture résultant de l'acceptation d'un contrat de sécurisation professionnelle doit avoir une cause économique réelle et sérieuse. L'employeur doit énoncer cette cause dans un écrit remis ou adressé au salarié au cours de la procédure et au plus tard au moment de l'acceptation ; à défaut, la rupture est sans cause réelle et sérieuse.",
  ["18-24.531", "20-17.360"]);

r("PSE-JUR-09", "Congé de reclassement",
  f => /reclassement/i.test(String((f.plan || {}).accompagnement || "")),
  "Pendant la période du congé de reclassement qui dépasse la durée du préavis, le salarié ne peut prétendre au maintien des avantages en nature dont il bénéficiait durant le préavis, mais seulement au versement de l'indemnité prévue par le texte.",
  ["23-22.756"]);

r("PSE-JUR-10", "Séparation des pouvoirs",
  f => planDu(f),
  "Le contenu du plan et la régularité de la procédure ne peuvent faire l'objet d'un litige distinct de celui relatif à la décision de validation ou d'homologation : leur vérification relève de l'administration, sous le contrôle du juge administratif. Le juge judiciaire reste compétent pour l'obligation individuelle de reclassement, sans méconnaître l'autorité de la chose décidée par l'administration.",
  ["18-23.692", "23-18.987", "17-16.766", "18-26.229"]);

r("PSE-JUR-11", "Calendrier",
  f => planDu(f),
  "La réorganisation peut être mise en œuvre par l'employeur avant la date d'homologation du plan : le comité doit être saisi en temps utile du projet de restructuration, mais l'homologation ne conditionne pas la mise en œuvre de la réorganisation elle-même. La notification des licenciements, elle, reste subordonnée à la décision administrative.",
  ["20-15.370"]);

r("PSE-JUR-12", "Départs volontaires",
  f => mesures(f).some(m => /volontaire|départ|rupture amiable/i.test(String(m.intitule || "") + " " + String(m.detail || ""))),
  "Lorsque la rupture résulte d'un accord amiable conclu dans le cadre d'un plan assorti d'un plan de départs volontaires, et qu'une décision administrative l'a autorisée puis est devenue définitive, le juge judiciaire ne peut apprécier le caractère réel et sérieux du motif au regard de la cause économique ni le respect de l'obligation de reclassement.",
  ["23-15.533", "23-15.498"]);

r("PSE-JUR-13", "Catégories professionnelles",
  f => planDu(f),
  "La notion de catégorie professionnelle, qui sert de base à l'ordre des licenciements et que le plan doit désigner, concerne l'ensemble des salariés qui exercent dans l'entreprise des fonctions de même nature supposant une formation professionnelle commune.",
  ["95-16.648"]);

function retenues(f) {
  return G.filter(x => { try { return !!x.si(f); } catch (e) { return false; } });
}
function arret(num) { return CORPUS[num] || null; }

module.exports = { G, retenues, arret, CORPUS };

if (require.main === module) {
  const manquants = G.flatMap(x => x.arrets).filter(n => !CORPUS[n]);
  console.log(`${G.length} règles · ${Object.keys(CORPUS).length} arrêts au corpus`);
  if (manquants.length) { console.error("Arrêts cités mais absents du corpus : " + manquants.join(", ")); process.exit(1); }
  const cites = new Set(G.flatMap(x => x.arrets));
  const inutilises = Object.keys(CORPUS).filter(n => !cites.has(n));
  if (inutilises.length) console.log(`arrêts versés au corpus mais qu'aucune règle ne cite : ${inutilises.join(", ")}`);
  const { BASE } = require("./tests-pse.js");
  console.log(`sur le dossier de référence : ${retenues(BASE).length} règles retenues, ${G.length - retenues(BASE).length} sans objet`);
}
