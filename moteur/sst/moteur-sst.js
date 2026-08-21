/* Le régime de la santé, de la sécurité et des conditions de travail, côté
   employeur : ce que les textes commandent, et rien d'autre.

   TROIS RÈGLES DE MÉTHODE :

   1. L'évaluation des risques est due par TOUT employeur, sans seuil
      d'effectif (L. 4121-1, L. 4121-3, R. 4121-1). L'effectif ne commande que
      des modalités : la mise à jour au moins annuelle du document unique à
      partir de onze salariés (R. 4121-2, 1° — en dessous, elle peut être
      moins fréquente sous réserve d'un niveau équivalent de protection,
      L. 4121-3, dernier alinéa), le programme annuel de prévention à partir
      de cinquante (L. 4121-3-1, III, 1°), la commission santé, sécurité et
      conditions de travail à partir de trois cents (L. 2315-36), le référent
      harcèlement sexuel de l'employeur à partir de deux cent cinquante
      (L. 1153-5-1).

   2. Le moteur rend les seuils et les échéances ; il ne prononce rien. Les
      contrôles prononcent, et une donnée absente ne produit jamais une
      conformité.

   3. Chaque règle écrite ici l'est sur un article lu à la source
      (textes-sst.json, identifiants LEGIARTI). Ce qui n'a pas pu être lu
      n'est pas codé.                                                        */
const D = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

/* Les seuils que les textes fixent, chacun avec son article. */
const SEUILS = {
  majAnnuelleDuerp: { seuil: 11, article: "R. 4121-2, 1°",
    objet: "mise à jour au moins annuelle du document unique" },
  programmeAnnuel: { seuil: 50, article: "L. 4121-3-1, III, 1°",
    objet: "programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail" },
  referentEmployeur: { seuil: 250, article: "L. 1153-5-1",
    objet: "référent employeur chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes" },
  cssct: { seuil: 300, article: "L. 2315-36",
    objet: "commission santé, sécurité et conditions de travail" },
};

/* L'effectif, apprécié tel qu'il est déclaré. */
function effectif(f) {
  const e = nombre(f.effectif);
  if (e === null) return { connu: false, valeur: null,
    motif: "L'effectif de l'entreprise n'est pas renseigné : les seuils de onze, cinquante, deux cent cinquante et trois cents salariés ne peuvent pas être appréciés." };
  return { connu: true, valeur: e, motif: `Effectif déclaré : ${e} salariés.` };
}

/* Les suites que l'évaluation des risques doit produire : le régime dépend du
   seuil de cinquante salariés (L. 4121-3-1, III). */
function suitesEvaluation(f) {
  const e = effectif(f);
  if (!e.connu) return { connu: false, regime: null, motif: e.motif };
  if (e.valeur >= 50)
    return { connu: true, regime: "programme annuel",
      motif: `Effectif de ${e.valeur} salariés (au moins cinquante) : les résultats de l'évaluation débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail — liste détaillée des mesures de l'année à venir avec conditions d'exécution, indicateurs de résultat et estimation du coût, ressources mobilisables, calendrier (L. 4121-3-1, III, 1°). Ce programme est présenté au comité social et économique dans le cadre de la consultation sur la politique sociale (L. 2312-27, 2°).` };
  return { connu: true, regime: "liste d'actions",
    motif: `Effectif de ${e.valeur} salariés (moins de cinquante) : les résultats de l'évaluation débouchent sur la définition d'actions de prévention des risques et de protection des salariés, dont la liste est consignée dans le document unique et ses mises à jour (L. 4121-3-1, III, 2°).` };
}

/* La mise à jour du document unique : annuelle à partir de onze salariés, et
   dans tous les cas lors d'un aménagement important ou d'une information
   nouvelle (R. 4121-2). */
function majDuerp(f) {
  const e = effectif(f);
  const du = f.duerp || {};
  const out = { effectif: e, annuelleDue: e.connu ? e.valeur >= 11 : null };
  if (!renseigne(du.dateDerniereMaj)) {
    out.etat = "date de mise à jour non renseignée";
    return out;
  }
  const ec = D.ecart(du.dateDerniereMaj, f.dateAudit,
    "la dernière mise à jour du document unique", "la date de l'audit");
  if (!ec.valide) { out.etat = "dates inexploitables"; out.motif = ec.motif; return out; }
  out.jours = ec.jours;
  out.moisEcoules = Math.round((ec.jours / 30.4375) * 10) / 10;
  out.etat = ec.jours <= 366 ? "moins d'un an" : "plus d'un an";
  return out;
}

/* La commission santé, sécurité et conditions de travail : due dans les
   entreprises d'au moins trois cents salariés, les établissements distincts
   d'au moins trois cents salariés et les établissements mentionnés aux
   articles L. 4521-1 et suivants (L. 2315-36) ; l'inspecteur du travail peut
   l'imposer en dessous (L. 2315-37) ; en dehors de ces cas, un accord peut la
   créer (L. 2315-43). */
function cssctDue(f) {
  const e = effectif(f);
  const etab300 = f.etablissementDistinct300;
  const risqueParticulier = f.etablissementRisqueParticulier;
  const imposee = f.cssctImposeeInspection;
  if (dit(risqueParticulier))
    return { connu: true, due: true, fondement: "L. 2315-36, 3°",
      motif: "L'entreprise comporte un établissement mentionné aux articles L. 4521-1 et suivants (installations à hauts risques industriels) : la commission santé, sécurité et conditions de travail y est obligatoire quel que soit l'effectif (L. 2315-36, 3°)." };
  if (dit(imposee))
    return { connu: true, due: true, fondement: "L. 2315-37",
      motif: "L'inspecteur du travail a imposé la création d'une commission santé, sécurité et conditions de travail (L. 2315-37) : elle est due, quel que soit l'effectif." };
  if (e.connu && e.valeur >= 300)
    return { connu: true, due: true, fondement: "L. 2315-36, 1°",
      motif: `Effectif de ${e.valeur} salariés (au moins trois cents) : la commission santé, sécurité et conditions de travail est obligatoire (L. 2315-36, 1°).` };
  if (dit(etab300))
    return { connu: true, due: true, fondement: "L. 2315-36, 2°",
      motif: "Un établissement distinct d'au moins trois cents salariés est déclaré : la commission santé, sécurité et conditions de travail y est obligatoire (L. 2315-36, 2°)." };
  if (!e.connu) return { connu: false, due: null, motif: e.motif };
  if (!renseigne(etab300) || !renseigne(risqueParticulier) || !renseigne(imposee))
    return { connu: false, due: null,
      motif: "L'effectif est sous trois cents, mais il n'est pas répondu aux trois autres cas qui rendent la commission obligatoire — établissement distinct d'au moins trois cents salariés (L. 2315-36, 2°), établissement à hauts risques industriels (L. 2315-36, 3°), création imposée par l'inspecteur du travail (L. 2315-37)." };
  return { connu: true, due: false, fondement: "L. 2315-36",
    motif: `Effectif de ${e.valeur} salariés, aucun établissement distinct d'au moins trois cents salariés, aucun établissement à hauts risques, aucune décision de l'inspecteur : la commission n'est pas obligatoire. Un accord d'entreprise — ou, sans délégué syndical, un accord avec le comité — peut néanmoins en créer une (L. 2315-43).` };
}

/* Le référent harcèlement sexuel de l'employeur : à partir de deux cent
   cinquante salariés (L. 1153-5-1). */
function referentEmployeurDu(f) {
  const e = effectif(f);
  if (!e.connu) return { connu: false, du: null, motif: e.motif };
  if (e.valeur >= 250)
    return { connu: true, du: true,
      motif: `Effectif de ${e.valeur} salariés (au moins deux cent cinquante) : un référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes doit être désigné (L. 1153-5-1).` };
  return { connu: true, du: false,
    motif: `Effectif de ${e.valeur} salariés (moins de deux cent cinquante) : le référent employeur de L. 1153-5-1 n'est pas obligatoire. Le référent du comité social et économique (L. 2314-1), lui, ne dépend pas de ce seuil.` };
}

/* Les causes de fin anticipée du mandat. L. 2314-33, deuxième phrase : « Les
   fonctions de ces membres prennent fin par le décès, la démission, la rupture
   du contrat de travail, la perte des conditions requises pour être éligible. »
   Elles seules autorisent le comité à remplacer un membre de la commission
   avant le terme du mandat des élus, et aucun accord n'y déroge. */
const FINS_ANTICIPEES = ["décès", "démission", "rupture du contrat de travail",
  "perte des conditions requises pour être éligible"];
const finAnticipeeMandat = cause => FINS_ANTICIPEES.includes(cause);

module.exports = { SEUILS, effectif, suitesEvaluation, majDuerp, cssctDue, referentEmployeurDu,
  FINS_ANTICIPEES, finAnticipeeMandat };
