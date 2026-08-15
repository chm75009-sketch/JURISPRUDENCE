/* Le moteur : tout ce qui se calcule est calculé ici, jamais rédigé.
   Un seuil, un délai, un régime de procédure sont des opérations — les confier
   à la rédaction, c'est accepter qu'ils soient parfois faux. */

/* --- seuil trimestriel de l'article L. 1233-3, 1° --- */
const seuilTrimestres = e =>
  e < 11 ? 1 : e < 50 ? 2 : e < 300 ? 3 : 4;
const trancheEffectif = e =>
  e < 11 ? "moins de 11 salariés" : e < 50 ? "de 11 à 49 salariés"
  : e < 300 ? "de 50 à 299 salariés" : "300 salariés et plus";

/* --- régime de procédure du licenciement économique --- */
function regimeEco(f) {
  const n = f.nbLicenciements, e = f.effectif;
  if (n <= 1) return {
    code: "INDIVIDUEL", libelle: "licenciement individuel",
    consultationCSE: false, reunions: 0, delaiAvis: null, pse: false,
    documents: null, textes: ["L. 1233-11 à L. 1233-16"],
    note: "L'article L. 1233-8 vise le licenciement collectif de moins de dix salariés : un licenciement isolé n'ouvre pas de consultation sur le projet." };
  if (n < 10) return {
    code: "PETIT_COLLECTIF", libelle: "licenciement collectif de moins de 10 salariés sur 30 jours",
    consultationCSE: e >= 11, reunions: 1, delaiAvis: "un mois au plus à compter de la première réunion",
    pse: false, documents: "les sept renseignements de L. 1233-10",
    textes: ["L. 1233-8", "L. 1233-10"] };
  if (e < 50) return {
    code: "GRAND_PETITE_ENTREPRISE", libelle: "10 licenciements ou plus, entreprise de moins de 50 salariés",
    consultationCSE: true, reunions: 2, delaiAvis: "deux réunions séparées d'un délai qui ne peut être supérieur à quatorze jours",
    pse: false, documents: "les sept renseignements de L. 1233-31, plus les mesures pour éviter ou limiter les licenciements",
    textes: ["L. 1233-28", "L. 1233-29", "L. 1233-31", "L. 1233-32"] };
  return {
    code: "GRAND_COLLECTIF", libelle: "10 licenciements ou plus, entreprise d'au moins 50 salariés",
    consultationCSE: true, reunions: "au moins deux, espacées d'au moins quinze jours",
    delaiAvis: n < 100 ? "deux mois" : n < 250 ? "trois mois" : "quatre mois",
    pse: true, documents: "les sept renseignements de L. 1233-31, plus le plan de sauvegarde de l'emploi",
    textes: ["L. 1233-28", "L. 1233-30", "L. 1233-31", "L. 1233-32", "L. 1233-61", "L. 1233-57-3"] };
}

/* --- accompagnement --- */
/* L'article L. 1233-66 définit lui-même son champ par renvoi : il s'applique
   « dans les entreprises non soumises à l'article L. 1233-71 ». Le seuil de mille
   salariés doit donc être évalué avant de conclure, et le résultat de cette
   évaluation doit être exposé — non pas seulement son issue. */
function accompagnement(f) {
  const eE = f.effectif, eG = f.effectifGroupe;
  const entreprise1000 = eE >= 1000;
  const groupe1000 = typeof eG === "number" ? eG >= 1000 : null;
  const du = entreprise1000 || groupe1000 === true;
  const motif = entreprise1000
    ? `L'effectif de l'entreprise atteint mille salariés (${eE}).`
    : groupe1000 === true
      ? `L'effectif de l'entreprise (${eE}) n'atteint pas mille salariés, mais l'effectif total du groupe l'atteint (${eG}).`
      : groupe1000 === false
        ? `L'effectif de l'entreprise (${eE}) n'atteint pas mille salariés, et l'effectif total du groupe non plus (${eG}).`
        : `L'effectif de l'entreprise (${eE}) n'atteint pas mille salariés. L'effectif total du groupe n'est pas renseigné : à vérifier, car le seuil s'apprécie aussi à ce niveau.`;
  return du
    ? { type: "congé de reclassement", texte: "L. 1233-71", motif,
        ecarte: "L. 1233-66", motifEcart: "Le contrat de sécurisation professionnelle ne vise que les entreprises non soumises à l'article L. 1233-71.",
        incertain: false }
    : { type: "contrat de sécurisation professionnelle", texte: "L. 1233-66", motif,
        ecarte: "L. 1233-71", motifEcart: "Le congé de reclassement n'est dû qu'à partir de mille salariés, au niveau de l'entreprise, de l'établissement ou du groupe.",
        incertain: groupe1000 === null };
}

/* --- périmètre d'appréciation de la cause --- */
function perimetre(f) {
  if (!f.groupe) return { niveau: "l'entreprise", texte: "L. 1233-3",
    motif: "L'entreprise n'appartient à aucun groupe." };
  return { niveau: "le secteur d'activité commun à l'entreprise et aux entreprises du groupe établies sur le territoire national",
    texte: "L. 1233-3", motif: "L'entreprise appartient à un groupe ; le secteur est limité au territoire national depuis le 24 septembre 2017.",
    exclusions: (f.societes || []).filter(s => s.etranger).map(s => s.nom) };
}

/* --- état du texte L. 1233-3 applicable à une date --- */
function etatTexte(d) {
  if (d >= "2017-09-24") return { etat: "depuis le 24 septembre 2017", contenu: "indicateurs, seuils et périmètre du secteur d'activité du groupe" };
  if (d >= "2016-12-01") return { etat: "1er décembre 2016 au 23 septembre 2017", contenu: "indicateurs et seuils, sans périmètre défini" };
  return { etat: "avant le 1er décembre 2016", contenu: "« difficultés économiques », sans définition ni indicateur" };
}

/* --- jours ouvrables : samedi compté, dimanche et jours fériés exclus --- */
const FERIES = d => ["01-01","05-01","05-08","07-14","08-15","11-01","11-11","12-25"].includes(d.slice(5));
function ajouteJoursOuvrables(iso, n) {
  const d = new Date(iso + "T12:00:00Z"); let reste = n;
  while (reste > 0) { d.setUTCDate(d.getUTCDate() + 1);
    const s = d.toISOString().slice(0, 10);
    if (d.getUTCDay() !== 0 && !FERIES(s)) reste--; }
  return d.toISOString().slice(0, 10);
}
const ajouteJours = (iso, n) => { const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

/* --- calendrier individuel --- */
function calendrier(f) {
  const cadre = f.cadreAuSensL1441_13 === true;
  const entretien = f.dateEntretien;
  const notifMin = entretien ? ajouteJoursOuvrables(entretien, cadre ? 15 : 7) : null;
  const convocMax = entretien ? "au moins 5 jours ouvrables avant l'entretien" : null;
  return { convocation: convocMax, entretien,
    notificationAuPlusTot: notifMin,
    delaiApplique: cadre ? "15 jours ouvrables (membre du personnel d'encadrement au sens du 2° de L. 1441-13)" : "7 jours ouvrables",
    textes: ["L. 1233-11", "L. 1233-15"] };
}

/* --- baisse trimestrielle : le seuil est-il atteint ? --- */
function baisseTrimestrielle(f) {
  const t = f.trimestres || [];   // [{libelle, n, n1}]
  const seuil = seuilTrimestres(f.effectif);
  const calc = t.map(x => ({ ...x, ecart: x.n1 ? (x.n - x.n1) / x.n1 : null }));
  let meilleure = 0, courante = 0;
  for (const x of calc) { if (x.ecart !== null && x.ecart < 0) { courante++; meilleure = Math.max(meilleure, courante); } else courante = 0; }
  return { seuilRequis: seuil, tranche: trancheEffectif(f.effectif),
    trimestresConsecutifs: meilleure, atteint: meilleure >= seuil, detail: calc };
}
const _EXPORT_ = { seuilTrimestres, trancheEffectif, regimeEco, accompagnement, perimetre,
  etatTexte, calendrier, baisseTrimestrielle, ajouteJoursOuvrables, ajouteJours };

/* ================= INDEMNITÉS, PRÉAVIS, BARÈME ================= */

/* Salaire de référence — R. 1234-4 : la formule la plus avantageuse. */
function salaireReference(s) {
  const m12 = s.moyenne12 ?? null, t3 = s.tiers3 ?? null;
  if (m12 === null && t3 === null) return null;
  const v = Math.max(m12 ?? -Infinity, t3 ?? -Infinity);
  return { valeur: v, retenue: v === m12 ? "moyenne des douze derniers mois" : "tiers des trois derniers mois",
           texte: "R. 1234-4" };
}

/* Indemnité légale — R. 1234-2, sous condition d'ancienneté de L. 1234-9. */
function indemniteLegale(s) {
  const anc = s.anciennete;                     // en années, décimales admises
  if (anc === undefined) return null;
  if ((s.ancienneteMois ?? anc * 12) < 8)
    return { du: false, motif: "Ancienneté inférieure à huit mois : aucune indemnité légale n'est due.",
             textes: ["L. 1234-9"] };
  const sr = salaireReference(s);
  const jusqua10 = Math.min(anc, 10), audela = Math.max(0, anc - 10);
  const coef = jusqua10 * 0.25 + audela * (1 / 3);
  return { du: true, coefficient: coef,
    montant: sr ? Math.round(coef * sr.valeur) : null,
    salaireReference: sr,
    detail: `${jusqua10.toFixed(2)} année(s) à un quart de mois + ${audela.toFixed(2)} année(s) à un tiers de mois = ${coef.toFixed(3)} mois de salaire`,
    textes: ["L. 1234-9", "R. 1234-2", "R. 1234-4"],
    reserve: "Une indemnité conventionnelle plus favorable prime : la convention doit être vérifiée." };
}

/* Préavis — L. 1234-1, sauf disposition plus favorable. */
function preavis(s) {
  const m = s.ancienneteMois ?? (s.anciennete ?? 0) * 12;
  if (m < 6) return { duree: null, texte: "L. 1234-1, 1°",
    motif: "Ancienneté inférieure à six mois : la durée est fixée par la loi, la convention, l'accord ou, à défaut, les usages de la localité et de la profession." };
  if (m < 24) return { duree: "un mois", texte: "L. 1234-1, 2°", motif: "Ancienneté de six mois à moins de deux ans." };
  return { duree: "deux mois", texte: "L. 1234-1, 3°", motif: "Ancienneté d'au moins deux ans." };
}

/* Barème de l'article L. 1235-3 — indemnité pour licenciement sans cause réelle et sérieuse. */
const BAREME = [[0,null,1],[1,1,2],[2,3,3.5],[3,3,4],[4,3,5],[5,3,6],[6,3,7],[7,3,8],[8,3,8],
  [9,3,9],[10,3,10],[11,3,10.5],[12,3,11],[13,3,11.5],[14,3,12],[15,3,13],[16,3,13.5],[17,3,14],
  [18,3,14.5],[19,3,15],[20,3,15.5],[21,3,16],[22,3,16.5],[23,3,17],[24,3,17.5],[25,3,18],
  [26,3,18.5],[27,3,19],[28,3,19.5],[29,3,20],[30,3,20]];
const BAREME_PETITE = [[0,null],[1,0.5],[2,0.5],[3,1],[4,1],[5,1.5],[6,1.5],[7,2],[8,2],[9,2.5],[10,2.5]];
function bareme(anciennete, effectif) {
  const a = Math.min(Math.floor(anciennete ?? 0), 30);
  const l = BAREME.find(x => x[0] === a);
  let min = l[1], max = l[2], derog = null;
  if (effectif < 11 && a <= 10) {
    const p = BAREME_PETITE.find(x => x[0] === a);
    if (p) { min = p[1]; derog = "Entreprise employant habituellement moins de onze salariés : minimum dérogatoire."; }
  }
  return { anciennete: a, minMois: min, maxMois: max, derogation: derog, texte: "L. 1235-3" };
}

/* Règle des trente jours — L. 1233-25 et calcul du régime. */
function trenteJours(f) {
  const n = (f.nbLicenciements || 0) + (f.licenciementsRecents30j || 0);
  const refus = f.refusModification || 0;
  const alerte = [];
  if (f.licenciementsRecents30j)
    alerte.push(`${f.licenciementsRecents30j} licenciement(s) économique(s) déjà prononcé(s) dans les trente jours : le régime s'apprécie sur le total, soit ${n}.`);
  if (refus >= 10)
    alerte.push(`${refus} salariés ont refusé la modification d'un élément essentiel de leur contrat : le licenciement est soumis aux dispositions du licenciement collectif (L. 1233-25).`);
  return { total: n, alerte };
}

/* Ordre des licenciements — application d'un barème à une catégorie. */
function ordre(cat) {
  if (!cat || !Array.isArray(cat.salaries)) return null;
  const notes = cat.salaries.map(s => ({ ...s,
    total: (s.charges||0)+(s.anciennetePoints||0)+(s.social||0)+(s.qualites||0) }));
  notes.sort((a,b)=> a.total-b.total || (b.anciennetePoints||0)-(a.anciennetePoints||0));
  return { categorie: cat.nom, effectif: notes.length, suppressions: cat.suppressions,
    classement: notes.map((s,i)=>({...s, rang:i+1, licencie: i < cat.suppressions })),
    textes: ["L. 1233-5", "L. 1233-7", "L. 1233-17"] };
}

/* Salariés protégés présents dans le périmètre. */
function proteges(f) {
  const l = f.salariesProteges || [];
  return { nombre: l.length, liste: l,
    consequence: l.length ? "Le licenciement de ces salariés suppose une autorisation de l'inspecteur du travail. Le juge judiciaire ne peut, en présence d'une autorisation devenue définitive, apprécier la cause économique ni le respect de l'obligation de reclassement."
      : "Aucun salarié protégé signalé dans le périmètre.",
    textes: ["L. 2411-1"] };
}
Object.assign(_EXPORT_, { salaireReference, indemniteLegale, preavis, bareme, trenteJours, ordre, proteges });
module.exports = _EXPORT_;
