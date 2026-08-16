/* Le moteur : tout ce qui se calcule est calculé ici, jamais rédigé.
   Un seuil, un délai, un régime de procédure sont des opérations — les confier
   à la rédaction, c'est accepter qu'ils soient parfois faux. */

/* --- seuil trimestriel de l'article L. 1233-3, 1° --- */
const seuilTrimestres = e =>
  e < 11 ? 1 : e < 50 ? 2 : e < 300 ? 3 : 4;
const trancheEffectif = e =>
  e < 11 ? "moins de 11 salariés" : e < 50 ? "de 11 à 49 salariés"
  : e < 300 ? "de 50 à 299 salariés" : "300 salariés et plus";

/* --- le décompte des trente jours ---
   Le seuil de dix n'est pas celui du projet mais celui d'« une même période de
   trente jours » (L. 1233-28, L. 1233-61) : les licenciements économiques déjà
   prononcés dans cette fenêtre s'y ajoutent. Le refus de modification obéit à
   une autre règle : l'article L. 1233-25 exige qu'au moins dix salariés aient
   refusé — ces refus ne s'additionnent pas aux autres licenciements, ils
   déclenchent le régime collectif par eux-mêmes. */
function comptes30j(f) {
  const nb = x => typeof x === "number" ? x : 0;
  const projet = nb(f.nbLicenciements), recents = nb(f.licenciementsRecents30j);
  const refus = nb(f.refusModification);
  /* Les trois termes s'additionnent, et la raison est dans le texte que le
     seuil sert à appliquer. L. 1233-61 vise « le projet de licenciement [qui]
     concerne au moins dix salariés dans une même période de trente jours » ;
     L. 1233-28 et L. 1233-8, « le licenciement collectif de moins de dix / d'au
     moins dix salariés dans une même période de trente jours ». L'unité comptée
     est le salarié dont le licenciement est envisagé, sans distinction selon le
     chemin qui y mène. Le salarié qui refuse la modification d'un élément
     essentiel de son contrat pour motif économique et dont le licenciement est
     envisagé est un salarié dont le licenciement est envisagé : il compte.

     L'article L. 1233-25 ne dit pas le contraire. Il règle le cas où les refus
     atteignent dix à eux seuls, et les soumet alors au régime collectif ; il
     n'écarte pas ces salariés du décompte général lorsqu'ils s'ajoutent à
     d'autres licenciements. La base a d'abord lu ce texte comme une exclusion —
     8 + 2 ne déclenchait alors aucun plan, ce qui revenait à faire dépendre le
     régime de la manière dont l'employeur a présenté deux ruptures. Une
     contre-épreuve extérieure a relevé l'erreur ; la relecture des quatre
     articles à la source lui donne raison.

     Reste le risque de double compte, et il se règle au questionnaire, non
     ici : la question posée est celle des refus « non compris dans le nombre de
     licenciements envisagés ». */
  const total30j = projet + recents + refus;
  const termes = [`${projet} licenciement(s) envisagé(s)`];
  if (recents) termes.push(`${recents} déjà prononcé(s) dans la même période`);
  if (refus) termes.push(`${refus} salarié(s) dont le licenciement est envisagé après refus d'une modification du contrat`);
  return { projet, recents, refus, total30j,
    refusDeclencheur: refus >= 10,
    /* ce qui fait franchir le seuil, dit explicitement */
    motif: termes.length > 1
      ? `${termes.join(", ")} — soit ${total30j} salariés sur une même période de trente jours.`
      : `${projet} licenciement(s) envisagé(s) sur trente jours.`,
    motifRefus: refus >= 10
      ? `${refus} salariés ont refusé la modification d'un élément essentiel de leur contrat : leur licenciement est à lui seul soumis au régime du licenciement collectif (L. 1233-25), quand bien même aucun autre licenciement ne serait envisagé.`
      : (refus ? `${refus} refus de modification suivis d'un licenciement envisagé. En deçà de dix, l'article L. 1233-25 ne joue pas comme déclencheur autonome, mais ces salariés entrent dans le décompte des trente jours : le projet les concerne.` : null),
    textes: ["L. 1233-8", "L. 1233-28", "L. 1233-61", "L. 1233-25"] };
}

/* --- régime de procédure du licenciement économique --- */
function regimeEco(f) {
  const c = comptes30j(f), e = f.effectif;
  /* Le seuil se lit sur la fenêtre de trente jours ; le délai d'avis, lui, se
     lit sur le nombre de licenciements du projet consulté (L. 1233-30, II). */
  const n = (c.total30j >= 10 || c.refusDeclencheur) ? Math.max(c.total30j, 10) : c.total30j;
  if (n <= 1) return {
    code: "INDIVIDUEL", libelle: "licenciement individuel",
    consultationCSE: false, reunions: 0, delaiAvis: null, pse: false,
    documents: null, textes: ["L. 1233-11 à L. 1233-16"], comptes: c,
    note: "L'article L. 1233-8 vise le licenciement collectif de moins de dix salariés : un licenciement isolé n'ouvre pas de consultation sur le projet." };
  if (n < 10) return {
    code: "PETIT_COLLECTIF", libelle: "licenciement collectif de moins de 10 salariés sur 30 jours",
    consultationCSE: e >= 11, reunions: 1, delaiAvis: "un mois au plus à compter de la première réunion",
    pse: false, documents: "les sept renseignements de L. 1233-10",
    textes: ["L. 1233-8", "L. 1233-10"], comptes: c };
  if (e < 50) return {
    code: "GRAND_PETITE_ENTREPRISE", libelle: "10 licenciements ou plus, entreprise de moins de 50 salariés",
    consultationCSE: true, reunions: 2, delaiAvis: "deux réunions séparées d'un délai qui ne peut être supérieur à quatorze jours",
    pse: false, documents: "les sept renseignements de L. 1233-31, plus les mesures pour éviter ou limiter les licenciements",
    textes: ["L. 1233-28", "L. 1233-29", "L. 1233-31", "L. 1233-32"], comptes: c };
  return {
    code: "GRAND_COLLECTIF", libelle: "10 licenciements ou plus, entreprise d'au moins 50 salariés",
    consultationCSE: true, reunions: "au moins deux, espacées d'au moins quinze jours",
    delaiAvis: c.projet < 100 ? "deux mois" : c.projet < 250 ? "trois mois" : "quatre mois",
    pse: true, documents: "les sept renseignements de L. 1233-31, plus le plan de sauvegarde de l'emploi",
    textes: ["L. 1233-28", "L. 1233-30", "L. 1233-31", "L. 1233-32", "L. 1233-61", "L. 1233-57-3"], comptes: c };
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
/* Le périmètre dépend de la date de notification, non de la date d'aujourd'hui.
   La limitation au territoire national est née de l'ordonnance du 22 septembre
   2017 : l'appliquer à un licenciement antérieur, c'est écarter des sociétés
   étrangères que la jurisprudence d'alors comprenait dans le périmètre. */
function perimetre(f) {
  if (!f.groupe) return { niveau: "l'entreprise", texte: "L. 1233-3",
    motif: "L'entreprise n'appartient à aucun groupe." };
  const d = f.dateNotification;
  const etrangeres = (f.societes || []).filter(s => s.etranger).map(s => s.nom);
  if (!d) return { niveau: "le secteur d'activité commun à l'entreprise et aux entreprises du groupe établies sur le territoire national",
    texte: "L. 1233-3", dateInconnue: true,
    motif: "La date de notification n'est pas renseignée : le périmètre est donné dans sa version en vigueur depuis le 24 septembre 2017. Pour un licenciement antérieur, il serait différent.",
    exclusions: etrangeres };
  if (d >= "2017-09-24") return { niveau: "le secteur d'activité commun à l'entreprise et aux entreprises du groupe établies sur le territoire national",
    texte: "L. 1233-3", version: "depuis le 24 septembre 2017",
    motif: `Notification du ${d} : le secteur est limité au territoire national depuis le 24 septembre 2017.`,
    exclusions: etrangeres };
  return { niveau: "le secteur d'activité du groupe, sans limitation au territoire national",
    texte: "L. 1233-3", version: d >= "2016-12-01" ? "1er décembre 2016 au 23 septembre 2017" : "avant le 1er décembre 2016",
    motif: `Notification du ${d}, antérieure à l'ordonnance du 22 septembre 2017 : la limitation du périmètre au territoire national n'existait pas. Les sociétés étrangères du même secteur entrent dans le périmètre d'appréciation.`,
    exclusions: [], societesEtrangeresIncluses: etrangeres };
}

/* L'entretien préalable n'est pas toujours dû : l'article L. 1233-38 en dispense
   l'employeur qui licencie au moins dix salariés sur trente jours dans une
   entreprise dotée d'un comité. Imposer alors un calendrier individuel, c'est
   appliquer une règle là où la loi l'écarte. */
function entretienDu(f) {
  const c = comptes30j(f);
  const cse = f.cseExistant;
  if (c.total30j >= 10 && cse === true)
    return { du: false, texte: "L. 1233-38",
      motif: `${c.total30j} licenciements sur trente jours et un comité social et économique en place : la procédure d'entretien préalable ne s'applique pas.` };
  if (c.total30j >= 10 && cse === undefined)
    return { du: null, texte: "L. 1233-38",
      motif: `${c.total30j} licenciements sur trente jours. L'existence d'un comité n'est pas renseignée : la dispense d'entretien préalable ne peut pas être établie.` };
  return { du: true, texte: "L. 1233-11",
    motif: c.total30j >= 10
      ? `${c.total30j} licenciements sur trente jours, mais aucun comité : l'entretien préalable reste dû.`
      : `Moins de dix licenciements sur trente jours : l'entretien préalable est dû pour chaque salarié.` };
}

/* --- état du texte L. 1233-3 applicable à une date --- */
function etatTexte(d) {
  if (d >= "2017-09-24") return { etat: "depuis le 24 septembre 2017", contenu: "indicateurs, seuils et périmètre du secteur d'activité du groupe" };
  if (d >= "2016-12-01") return { etat: "1er décembre 2016 au 23 septembre 2017", contenu: "indicateurs et seuils, sans périmètre défini" };
  return { etat: "avant le 1er décembre 2016", contenu: "« difficultés économiques », sans définition ni indicateur" };
}

/* --- jours ouvrables : samedi compté, dimanche et jours fériés exclus --- */
const ajouteJours = (iso, n) => { const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

/* Onze jours fériés, dont trois mobiles — et les trois tombent entre mars et
   juin, c'est-à-dire en pleine saison de ces procédures. Les oublier raccourcit
   le délai de cinq jours ouvrables entre la convocation et l'entretien, et fait
   sortir une convocation irrégulière en conforme. Pâques par l'algorithme de
   Butcher, valable pour tout le calendrier grégorien. */
function paques(an) {
  const a = an % 19, b = Math.floor(an / 100), c = an % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31);
  const jour = ((h + l - 7 * m + 114) % 31) + 1;
  return `${an}-${String(mois).padStart(2,"0")}-${String(jour).padStart(2,"0")}`;
}
const FIXES = ["01-01","05-01","05-08","07-14","08-15","11-01","11-11","12-25"];
/* L'Alsace-Moselle ajoute le Vendredi saint et le 26 décembre : le drapeau est
   porté par la fiche, non deviné. */
const ALSACE_MOSELLE = ["12-26"];
const mobiles = an => {
  const p = paques(an);
  return { lundiPaques: ajouteJours(p, 1), ascension: ajouteJours(p, 39),
    lundiPentecote: ajouteJours(p, 50), vendrediSaint: ajouteJours(p, -2), paques: p };
};
const CACHE_FERIES = {};
function feriesDe(an, alsaceMoselle) {
  const cle = an + (alsaceMoselle ? "-AM" : "");
  if (CACHE_FERIES[cle]) return CACHE_FERIES[cle];
  const m = mobiles(an);
  const l = FIXES.map(d => `${an}-${d}`).concat([m.lundiPaques, m.ascension, m.lundiPentecote]);
  if (alsaceMoselle) l.push(m.vendrediSaint, ...ALSACE_MOSELLE.map(d => `${an}-${d}`));
  return (CACHE_FERIES[cle] = new Set(l));
}
const FERIES = (d, alsaceMoselle) => feriesDe(Number(d.slice(0, 4)), alsaceMoselle).has(d);
/* Ajoute n mois de quantième à quantième. Le 31 mars + 1 mois donne le 30 avril :
   on retient le dernier jour du mois lorsque le quantième n'existe pas. */
function ajouteMois(iso, n) {
  const [a, m, j] = iso.split("-").map(Number);
  const total = (m - 1) + n;
  const an = a + Math.floor(total / 12), mois = (total % 12 + 12) % 12;
  const dernier = new Date(Date.UTC(an, mois + 1, 0)).getUTCDate();
  const jour = Math.min(j, dernier);
  return `${an}-${String(mois + 1).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}
/* Le délai d'avis, en mois, tel que le régime le fixe. Null quand le régime
   n'exprime pas le délai en mois — deux réunions séparées de quatorze jours. */
function delaiAvisMois(r) {
  const d = String(r.delaiAvis || "");
  if (/quatre mois/.test(d)) return 4;
  if (/trois mois/.test(d)) return 3;
  if (/deux mois/.test(d)) return 2;
  if (/un mois/.test(d)) return 1;
  return null;
}

function ajouteJoursOuvrables(iso, n, alsaceMoselle) {
  const d = new Date(iso + "T12:00:00Z"); let reste = n;
  while (reste > 0) { d.setUTCDate(d.getUTCDate() + 1);
    const s = d.toISOString().slice(0, 10);
    if (d.getUTCDay() !== 0 && !FERIES(s, alsaceMoselle)) reste--; }
  return d.toISOString().slice(0, 10);
}

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
  etatTexte, calendrier, baisseTrimestrielle, ajouteJoursOuvrables, ajouteJours, comptes30j,
  ajouteMois, delaiAvisMois, paques, feriesDe, FERIES, entretienDu };

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
