/* Le moteur du comité social et économique : tout ce qui se calcule.
   Aucune phrase de droit ici — seulement des nombres, des seuils et des dates,
   tirés d'articles lus à la source le 15 août 2026. Le tableau de l'article
   R. 2314-1 n'a pas été recopié : il est extrait du texte même de l'article. */
const fs = require("fs");
/* [effectifMin, effectifMax|null, titulaires, heures] — 54 tranches, extraites
   de R. 2314-1 et vérifiées : titulaires × heures = total annoncé par le texte. */
const R2314_1 = JSON.parse(fs.readFileSync(__dirname + "/_r2314_1.json", "utf8"));

const tranche = e => R2314_1.find(t => e >= t[0] && (t[1] === null || e <= t[1]));
function delegation(effectif) {
  if (typeof effectif !== "number") return null;
  if (effectif < 11) return { du: false, motif: "Aucun comité n'est obligatoire en deçà de onze salariés.", texte: "L. 2311-2" };
  const t = tranche(effectif);
  if (!t) return { du: true, titulaires: null, heures: null, texte: "R. 2314-1",
    motif: "Effectif hors des tranches du tableau réglementaire." };
  return { du: true, titulaires: t[2], heures: t[3], total: t[2] * t[3],
    tranche: t[1] === null ? `${t[0]} et plus` : `${t[0]} à ${t[1]}`,
    texte: "R. 2314-1", supplétif: true };
}

/* Le seuil ne se franchit pas un jour donné : il se franchit sur douze mois. */
function seuilAtteint(mois, seuil) {
  if (!Array.isArray(mois)) return null;
  let suite = 0, max = 0;
  for (const m of mois) { suite = m >= seuil ? suite + 1 : 0; max = Math.max(max, suite); }
  return { consecutifs: max, atteint: max >= 12, texte: "L. 2311-2" };
}

/* L'effectif déclaré, confronté aux relevés mensuels.

   Tout le régime du comité — nombre de réunions, commission santé et sécurité,
   subvention, attributions — se calcule sur un seul nombre, « effectif », que
   l'employeur déclare. Les relevés mensuels ne servaient qu'au seuil de onze.
   Un dossier déclarant 299 salariés et produisant quatorze relevés compris
   entre 312 et 317 obtenait donc six réunions par an au lieu de douze et une
   absence de commission déclarée régulière : la contradiction était dans le
   dossier lui-même, et personne ne la lisait.

   Les seuils ne se franchissent pas de la même manière selon le chapitre : les
   articles L. 2311-2, L. 2312-2 et L. 2312-34 posent chacun leur règle des
   douze mois consécutifs, mais les chapitres du fonctionnement — réunion
   mensuelle de L. 2315-28, commission de L. 2315-36 — n'en posent aucune. Le
   moteur dit ce que chaque texte prévoit et ne complète pas le silence des
   autres. */
const SEUILS_EFFECTIF = [
 { seuil: 11,   texte: "L. 2311-2",  douzeMois: true,
   effet: "la mise en place du comité social et économique" },
 { seuil: 50,   texte: "L. 2312-2",  douzeMois: true,
   effet: "les attributions récurrentes d'information et de consultation, la subvention de fonctionnement (L. 2315-61) et la contribution aux activités sociales (L. 2312-81)" },
 { seuil: 300,  texte: "L. 2312-34", douzeMois: true,
   effet: "les obligations d'information et de consultation du chapitre II ; s'y ajoutent, sans que leur chapitre fixe de règle propre de franchissement, la réunion mensuelle (L. 2315-28) et la commission santé, sécurité et conditions de travail (L. 2315-36)" },
 { seuil: 1000, texte: "L. 2312-63", douzeMois: false,
   effet: "l'établissement du rapport d'alerte économique par la commission économique" },
 { seuil: 2000, texte: "L. 2315-61", douzeMois: false,
   effet: "le taux de la subvention de fonctionnement, porté à 0,22 % de la masse salariale brute" },
];

function coherenceEffectif(f = {}) {
  const e = f.effectif, mois = f.effectifsMensuels;
  if (typeof e !== "number" || !Array.isArray(mois) || !mois.length) return null;
  const nombres = mois.filter(x => typeof x === "number" && Number.isFinite(x));
  if (nombres.length !== mois.length)
    return { lisible: false, releves: mois.length, exploitables: nombres.length,
      motif: "Un ou plusieurs relevés mensuels ne sont pas des nombres : la cohérence de l'effectif déclaré ne peut pas être vérifiée." };
  const min = Math.min(...nombres), max = Math.max(...nombres);
  const moyenne = Math.round(nombres.reduce((a, b) => a + b, 0) / nombres.length);
  /* Les seuils que les relevés atteignent alors que l'effectif déclaré est en
     dessous. Ce sont les seuls qui changent le régime appliqué au dossier. */
  const franchis = [];
  for (const s of SEUILS_EFFECTIF) {
    if (e >= s.seuil) continue;
    const d = seuilAtteint(nombres, s.seuil);
    const atteint = s.douzeMois ? d.atteint : nombres.some(m => m >= s.seuil);
    if (!atteint) continue;
    franchis.push({ ...s, consecutifs: d.consecutifs,
      regle: s.douzeMois
        ? `${s.texte} répute le seuil franchi lorsqu'il est atteint pendant douze mois consécutifs : les relevés en comptent ${d.consecutifs}.`
        : `${s.texte} ne fixe pas de règle de franchissement propre : ${nombres.filter(m => m >= s.seuil).length} relevé(s) atteignent ce seuil.` });
  }
  return { lisible: true, effectifDeclare: e, releves: nombres.length,
    min, max, moyenne, dans: e >= min && e <= max,
    ecart: e < min ? min - e : (e > max ? e - max : 0),
    seuilsFranchis: franchis };
}

const ATTRIBUTIONS = [
 { min: 0,    max: 10,   regime: "aucun comité obligatoire", texte: "L. 2311-2" },
 { min: 11,   max: 49,   regime: "réclamations, santé et sécurité, enquêtes", texte: "L. 2312-5" },
 { min: 50,   max: 299,  regime: "attributions générales, consultations récurrentes et ponctuelles", texte: "L. 2312-8" },
 { min: 300,  max: 999,  regime: "attributions générales, réunion mensuelle, commission santé et sécurité obligatoire", texte: "L. 2312-8, L. 2315-28, L. 2315-36" },
 { min: 1000, max: null, regime: "attributions générales, commission économique pour le droit d'alerte", texte: "L. 2312-63" },
];
const attributions = e => typeof e === "number"
  ? ATTRIBUTIONS.find(a => e >= a.min && (a.max === null || e <= a.max)) : null;

/* Délai de consultation, à défaut d'accord. R. 2312-6. */
function delaiConsultation(o = {}) {
  const jours = o.expertisesCentraleEtEtablissement ? 90 : (o.expertise ? 60 : 30);
  return { mois: jours / 30, jours,
    motif: o.expertisesCentraleEtEtablissement
      ? "Trois mois : expertises menées à la fois au niveau central et au niveau d'établissements."
      : (o.expertise ? "Deux mois : intervention d'un expert." : "Un mois : cas général."),
    effet: "À l'expiration, le comité est réputé avoir été consulté et avoir rendu un avis négatif.",
    depart: "La communication des informations, ou l'information de leur mise à disposition dans la base de données.",
    texte: "R. 2312-6", depart_texte: "R. 2312-5", suppletif: true };
}

/* Budgets. L. 2315-61 pour le fonctionnement, L. 2312-81 pour les activités. */
function budgetFonctionnement(effectif, masseSalariale) {
  if (typeof effectif !== "number") return null;
  if (effectif < 50) return { du: false, motif: "La subvention de fonctionnement n'est due qu'à partir de cinquante salariés.", texte: "L. 2315-61" };
  const taux = effectif >= 2000 ? 0.0022 : 0.0020;
  return { du: true, taux, tauxTexte: (taux * 100).toFixed(2).replace(".", ",") + " %",
    montant: typeof masseSalariale === "number" ? Math.round(masseSalariale * taux) : null,
    assiette: "Ensemble des gains et rémunérations soumis à cotisations de sécurité sociale, hors indemnités de rupture du contrat à durée indéterminée.",
    assiette_texte: "L. 2312-83", texte: "L. 2315-61" };
}

/* Commission santé, sécurité et conditions de travail. L. 2315-36 et L. 2315-37. */
function cssct(o = {}) {
  const e = o.effectif;
  if (typeof e !== "number") return null;
  if (o.seveso) return { obligatoire: true, motif: "Établissement mentionné aux articles L. 4521-1 et suivants.", texte: "L. 2315-36, 3°" };
  if (e >= 300) return { obligatoire: true, motif: "Effectif d'au moins trois cents salariés.", texte: "L. 2315-36, 1° et 2°" };
  return { obligatoire: false, texte: "L. 2315-36",
    motif: "Non obligatoire en deçà de trois cents salariés.",
    reserve: "L'inspecteur du travail peut toutefois l'imposer, notamment en raison de la nature des activités ou de l'agencement des locaux (L. 2315-37)." };
}

/* Réunions. L. 2315-27 et L. 2315-28. */
function reunions(o = {}) {
  const e = o.effectif;
  if (typeof e !== "number") return null;
  if (o.accordPeriodicite) {
    const n = o.reunionsAccord;
    return { parAn: n ?? null, sourceAccord: true, texte: "L. 2312-19, 2°",
      licite: typeof n === "number" ? n >= 6 : null,
      motif: typeof n === "number"
        ? (n >= 6 ? `${n} réunions par an prévues par l'accord : le plancher légal de six est respecté.`
                  : `${n} réunions par an : l'accord ne peut descendre en dessous de six.`)
        : "Le nombre de réunions prévu par l'accord n'est pas renseigné." };
  }
  const parAn = e >= 300 ? 12 : 6;
  return { parAn, sourceAccord: false, texte: "L. 2315-28", suppletif: true,
    motif: e >= 300 ? "Au moins une réunion par mois à partir de trois cents salariés."
                    : "Au moins une réunion tous les deux mois en deçà de trois cents salariés.",
    sante: 4, sante_texte: "L. 2315-27",
    sante_motif: "Au moins quatre de ces réunions portent annuellement, en tout ou partie, sur la santé, la sécurité et les conditions de travail." };
}

/* Troisième collège. L. 2314-11. */
function colleges(o = {}) {
  const e = o.effectif, c = o.nbCadres;
  if (typeof e !== "number") return null;
  const troisieme = (typeof c === "number" && c >= 25);
  return { nombre: troisieme ? 3 : 2, texte: "L. 2314-11",
    motif: troisieme
      ? "Un troisième collège est constitué : le nombre d'ingénieurs, chefs de service et cadres est d'au moins vingt-cinq."
      : (typeof c === "number"
         ? "Deux collèges : le nombre de cadres est inférieur à vingt-cinq."
         : "Deux collèges par défaut — le nombre de cadres n'est pas renseigné, la vérification du troisième collège n'a pas pu être faite."),
    inconnu: typeof c !== "number",
    cadre501: e >= 501 ? "Dans les entreprises d'au moins cinq cent un salariés, les ingénieurs et cadres ont au moins un délégué titulaire au sein du second collège." : null };
}

/* La composition d'une liste au regard de L. 2314-30. C'est le calcul le plus
   utile du moteur : il applique la proportion, l'arrondi et l'alternance. */
function listeParitaire(o = {}) {
  const { femmes, hommes } = o;
  /* La proportion se calcule sur le nombre de candidats que la liste comporte,
     non sur le nombre de sièges : une liste peut être incomplète. */
  const n = typeof o.candidats === "number" ? o.candidats : o.sieges;
  if (![femmes, hommes, n].every(x => typeof x === "number")) return null;
  const inscrits = femmes + hommes;
  if (!inscrits) return { applicable: false, texte: "L. 2314-30",
    motif: "Aucun inscrit sur la liste électorale du collège." };
  if (n < 2) return { applicable: false, texte: "L. 2314-30",
    motif: "La règle ne s'applique qu'aux listes comportant plusieurs candidats." };
  const brutF = n * femmes / inscrits, brutH = n * hommes / inscrits;
  /* Arrondi de L. 2314-30 : décimale ≥ 5 à l'entier supérieur, sinon inférieur. */
  const arrondi = x => { const d = +(x - Math.floor(x)).toFixed(10);
    return d >= 0.5 ? Math.ceil(x) : Math.floor(x); };
  const nF = arrondi(brutF), nH = arrondi(brutH);
  const egaliteStricte = femmes === hommes;
  /* Le quatrième alinéa n'est pas indexé sur le nombre de candidats mais sur le
     nombre de **sièges à pourvoir** : « En cas de nombre impair de sièges à
     pourvoir et de stricte égalité entre les femmes et les hommes inscrits… ».
     La distinction n'est pas théorique — une liste incomplète comporte moins de
     candidats que le collège n'a de sièges. Le moteur lisait le nombre de
     candidats, ce qui ouvrait l'alinéa 4 dans des cas qu'il ne couvre pas et le
     fermait dans des cas qu'il couvre. */
  const sieges = typeof o.sieges === "number" ? o.sieges : null;
  const base = { applicable: true, candidats: n, sieges,
    inscrits, femmes, hommes,
    partF: +(100 * femmes / inscrits).toFixed(2), partH: +(100 * hommes / inscrits).toFixed(2),
    brutF: +brutF.toFixed(4), brutH: +brutH.toFixed(4), texte: "L. 2314-30",
    sanction: "Le non-respect de la proportion entraîne l'annulation de l'élection des derniers élus du sexe surreprésenté, en suivant l'ordre inverse de la liste ; le non-respect de l'alternance entraîne l'annulation de l'élection de tout élu dont le positionnement est irrégulier (L. 2314-32).",
    portee: "La règle s'applique séparément à la liste des titulaires et à celle des suppléants (L. 2314-30, dernier alinéa)." };

  if (nF + nH !== n) {
    /* Cas expressément réglé par le quatrième alinéa : sièges à pourvoir en
       nombre impair, et stricte égalité entre les inscrits des deux sexes. */
    if (egaliteStricte && sieges !== null && sieges % 2 === 1)
      return { ...base, indifferent: true, candidatsFemmes: null, candidatsHommes: null,
        motif: `${sieges} sièges à pourvoir — nombre impair — et stricte égalité entre les femmes et les hommes inscrits : la liste comprend ${Math.floor(n / 2)} candidat${Math.floor(n / 2) > 1 ? "s" : ""} de chaque sexe et, indifféremment, un homme ou une femme supplémentaire.`,
        texte_al: "L. 2314-30, al. 4" };
    /* Stricte égalité, mais le nombre de sièges à pourvoir n'est pas connu :
       l'alinéa 4 ne peut ni être appliqué, ni être écarté. La donnée manque, et
       le dire vaut mieux que de la remplacer par le nombre de candidats. */
    if (egaliteStricte && sieges === null)
      return { ...base, siegesInconnus: true, aVerifier: true,
        candidatsFemmes: null, candidatsHommes: null,
        motif: `L'arrondi arithmétique donne ${nF} femme(s) et ${nH} homme(s), soit ${nF + nH} candidats pour une liste qui en comporte ${n}. Les inscrits des deux sexes étant en stricte égalité, l'issue dépend du nombre de sièges à pourvoir dans le collège, seul critère retenu par le quatrième alinéa — et il n'est pas renseigné. L'indiquer tranchera le cas.`,
        texte_al: "L. 2314-30, al. 4" };
    /* Cas où l'arrondi arithmétique des deux sexes ne retombe pas sur le nombre
       de candidats, hors l'hypothèse du quatrième alinéa. Le texte ne le règle
       pas et aucun arrêt du corpus ne le tranche : la base le signale au lieu
       de choisir. */
    return { ...base, conflit: true, candidatsFemmes: null, candidatsHommes: null,
      motif: `L'arrondi arithmétique donne ${nF} femme(s) et ${nH} homme(s), soit ${nF + nH} candidats pour une liste qui en comporte ${n}${sieges !== null ? ` et ${sieges} siège(s) à pourvoir` : ""}. Le quatrième alinéa ne couvre pas ce cas${!egaliteStricte ? " — les inscrits des deux sexes ne sont pas en stricte égalité" : " — le nombre de sièges à pourvoir est pair"}, et aucun arrêt publié du corpus ne le tranche : la composition doit être arrêtée avec un conseil avant le dépôt de la liste.`,
      aVerifier: true };
  }

  const exclusion = (nF === 0 || nH === 0)
    ? "L'application de la règle exclut totalement la représentation d'un sexe. La liste peut alors comporter un candidat du sexe qui, à défaut, ne serait pas représenté ; ce candidat ne peut être en première position (L. 2314-30, al. 5)."
    : null;
  /* L'alternance : un candidat de chaque sexe jusqu'à épuisement des candidats
     de l'un des sexes. Le premier n'a pas à être du sexe majoritaire. */
  const maj = nF >= nH ? "F" : "H", min = maj === "F" ? "H" : "F";
  const nMin = Math.min(nF, nH);
  const ordre = [];
  for (let i = 0; i < n; i++) ordre.push(i < 2 * nMin ? (i % 2 === 0 ? maj : min) : maj);
  return { ...base, candidatsFemmes: nF, candidatsHommes: nH,
    alternance: ordre.join(" · "), exclusion,
    motif: `Sur ${n} candidats, la liste doit comporter ${nF} femme(s) et ${nH} homme(s).`,
    alternance_note: "L'alternance s'examine candidat par candidat ; hors le cas du dernier alinéa de l'article L. 2314-30, elle n'impose pas que le premier de la liste soit du sexe majoritaire (Cass. soc. 4 juin 2025, n° 24-16.515)." };
}

/* Financement de l'expertise. L. 2315-80 et L. 2315-81. */
const EXPERTISES = {
 "situation économique et financière": { employeur: 100, texte: "L. 2315-88", finance: "L. 2315-80, 1°" },
 "politique sociale": { employeur: 100, texte: "L. 2315-91", finance: "L. 2315-80, 1°" },
 "risque grave": { employeur: 100, texte: "L. 2315-94, 1°", finance: "L. 2315-80, 1°" },
 "licenciement collectif pour motif économique": { employeur: 100, texte: "L. 2315-92, I, 3°", finance: "L. 2315-80, 1°" },
 "orientations stratégiques": { employeur: 80, comite: 20, texte: "L. 2315-87", finance: "L. 2315-80, 2°" },
 "consultation ponctuelle": { employeur: 80, comite: 20, texte: "L. 2312-8", finance: "L. 2315-80, 2°" },
 "expertise libre": { comite: 100, texte: "L. 2315-81", finance: "L. 2315-81" },
};
const financementExpertise = cas => EXPERTISES[cas] || null;

/* Contestation de l'expertise par l'employeur : dix jours, point de départ
   variable selon l'objet. L. 2315-86 et R. 2315-49. */
const DEPART_EXPERTISE = {
 "nécessité": { depart: "la délibération du comité décidant le recours à l'expertise", texte: "L. 2315-86, 1°" },
 "choix de l'expert": { depart: "la désignation de l'expert par le comité", texte: "L. 2315-86, 2°" },
 "coût prévisionnel, étendue ou durée": { depart: "la notification à l'employeur du cahier des charges et des informations", texte: "L. 2315-86, 3°" },
 "coût final": { depart: "la notification à l'employeur de ce coût", texte: "L. 2315-86, 4°" },
};
function contestationExpertise(objet) {
  const d = DEPART_EXPERTISE[objet];
  if (!d) return null;
  return { jours: 10, texte: "R. 2315-49", depart: d.depart, depart_texte: d.texte,
    computation: "Le délai exprimé en jours ne commence à courir que le lendemain de l'acte qui le fait courir (articles 641 et 642 du code de procédure civile).",
    saisine: "La date de saisine du président du tribunal judiciaire statuant selon la procédure accélérée au fond s'entend de celle de l'assignation." };
}

/* Contestations électorales. R. 2314-24. */
const CONTESTATIONS = {
 "électorat": { jours: 3, depart: "la publication de la liste électorale" },
 "régularité de l'élection": { jours: 15, depart: "l'élection" },
 "désignation d'un représentant syndical": { jours: 15, depart: "la désignation" },
 "désignation des membres de la commission santé et sécurité": { jours: 15, depart: "la désignation" },
};
const delaiContestation = o => CONTESTATIONS[o] ? { ...CONTESTATIONS[o], texte: "R. 2314-24" } : null;

/* Durée des mandats. L. 2314-33 et L. 2314-34. */
function mandat(o = {}) {
  const d = o.dureeAccord;
  if (typeof d !== "number") return { annees: 4, texte: "L. 2314-33", suppletif: true,
    motif: "Quatre ans, à défaut d'accord fixant une durée plus courte." };
  return { annees: d, texte: "L. 2314-34", suppletif: false,
    licite: d >= 2 && d <= 4,
    motif: d >= 2 && d <= 4
      ? `Durée de ${d} ans fixée par accord : elle est comprise entre deux et quatre ans.`
      : `Durée de ${d} ans : un accord ne peut fixer qu'une durée comprise entre deux et quatre ans.` };
}

/* Élections partielles. L. 2314-10. */
function electionsPartielles(o = {}) {
  const { titulairesInitiaux, titulairesRestants, collegeVide, moisAvantTerme } = o;
  if (typeof titulairesInitiaux !== "number" || typeof titulairesRestants !== "number")
    return null;
  const moitie = titulairesRestants <= titulairesInitiaux / 2;
  const cas = collegeVide || moitie;
  const exception = typeof moisAvantTerme === "number" && moisAvantTerme < 6;
  return { dues: cas && !exception, texte: "L. 2314-10",
    motif: !cas ? "Ni collège non représenté, ni réduction de moitié ou plus du nombre de titulaires."
      : (exception ? "Le cas est constitué, mais l'événement survient moins de six mois avant le terme des mandats : les élections partielles ne sont pas dues."
      : (collegeVide ? "Un collège n'est plus représenté." : "Le nombre de titulaires est réduit de moitié ou plus.")),
    portee: "Les élections partielles pourvoient tous les sièges vacants dans les collèges intéressés, sur la base des dispositions en vigueur lors de l'élection précédente ; les candidats sont élus pour la durée du mandat restant à courir." };
}

module.exports = { R2314_1, tranche, delegation, seuilAtteint, attributions, ATTRIBUTIONS,
  SEUILS_EFFECTIF, coherenceEffectif,
  delaiConsultation, budgetFonctionnement, cssct, reunions, colleges, listeParitaire,
  financementExpertise, EXPERTISES, contestationExpertise, delaiContestation, mandat,
  electionsPartielles };
