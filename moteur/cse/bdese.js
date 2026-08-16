/* La base de données économiques, sociales et environnementales : son contenu,
   extrait du texte et non recopié.

   Onze mille caractères en deçà de trois cents salariés, trente et un mille huit
   cents au-delà. Recopier cela à la main, c'est garantir des écarts — et surtout
   des écarts silencieux à la prochaine modification du décret. Le contenu est
   donc découpé depuis le texte lui-même, comme l'a été le tableau de l'article
   R. 2314-1, et la couverture du découpage est mesurée : ce qui n'a pas été
   reconnu est compté et affiché, jamais passé sous silence.

   Trois étages, et l'ordre entre eux commande tout :

   — le plancher de l'article L. 2312-21, troisième alinéa : les thèmes que la
     base comporte « au moins ». Aucun accord ne descend en dessous. Deux thèmes
     du décret n'y figurent pas — la sous-traitance, que le décret nomme
     « partenariats », et les transferts intragroupe : un accord peut donc les
     supprimer, et l'application doit le dire ;
   — l'accord de l'article L. 2312-21, d'entreprise ou, à défaut et en deçà de
     trois cents salariés, de branche ;
   — le supplétif des articles R. 2312-8 et R. 2312-9, qui ne s'applique qu'à
     défaut d'accord.

   Le découpage suit la ponctuation du décret :
     N° Rubrique : A-Section : a) Sujet ; -information ; -information ; b) …

   Usage : node bdese.js            mesure la couverture et publie _bdese.json */
const fs = require("fs");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const texte = n => { const v = T[n]; if (!v || !v.texte) throw new Error(`Article ${n} non lu à la source.`); return net(v.texte); };

/* Le plancher : les thèmes énumérés au troisième alinéa de L. 2312-21, relevés
   dans le texte même plutôt que recopiés. La phrase les sépare par des virgules
   et se termine par « et les conséquences environnementales… ». */
const PLANCHER = (() => {
  const t = texte("L2312-21");
  const m = t.match(/La base de données comporte au moins les thèmes suivants\s*:\s*([^.]+)\./);
  if (!m) throw new Error("Le plancher de L. 2312-21 n'a pas été retrouvé dans le texte.");
  /* La phrase sépare les thèmes par des virgules, et le dernier par « et ».
     Découper sur tous les « et » couperait « les femmes et les hommes » en deux :
     seul le « et » qui suit la dernière virgule est un séparateur. */
  const brut = m[1];
  const derniere = brut.lastIndexOf(",");
  const morceaux = (derniere < 0 ? [brut] :
    brut.slice(0, derniere).split(",").concat(brut.slice(derniere + 1).split(/\s+et\s+(?=l)/)));
  return morceaux.map(x => net(x).replace(/^l['’]|^les |^la |^le /, "")).filter(Boolean);
})();

/* Chaque rubrique du décret est-elle couverte par le plancher ? Le rattachement
   se fait sur les mots du plancher, non sur un numéro : c'est la seule manière
   de rester juste si l'un des deux textes est modifié. */
const MOTS = {
  1: ["investissement social", "investissement matériel et immatériel"],
  2: ["égalité professionnelle entre les femmes et les hommes au sein de l'entreprise"],
  3: ["fonds propres", "endettement"],
  4: ["ensemble des éléments de la rémunération des salariés et dirigeants"],
  5: ["activités sociales et culturelles"],
  6: ["rémunération des financeurs"],
  7: ["flux financiers à destination de l'entreprise"],
  8: [],
  9: [],
  10: ["conséquences environnementales de l'activité de l'entreprise"],
};
const auPlancher = n => (MOTS[n] || []).filter(m =>
  PLANCHER.some(p => p.toLowerCase().includes(m.toLowerCase().slice(0, 28))));

/* ------------------------------------------------------------- le découpage */
function decouper(brut) {
  /* On retire l'en-tête, qui n'est pas du contenu mais l'énoncé du régime. */
  const t = brut.replace(/^.*?comporte (?:les informations suivantes|les informations prévues dans le tableau ci-dessous\.?)\s*:?\s*/i, "");
  const rubriques = [];
  /* Les rubriques : « 1° … » jusqu'au « 2° … » suivant. */
  /* Le numéro d'une rubrique ressemble à un renvoi : « 2° de l'article
     L. 2312-27 » et « 1° A e et f de l'article R. 2312-8 » en sont, et le décret
     en compte plusieurs. Trois marques distinguent le titre du renvoi — il
     commence par une majuscule, il ne cite pas d'article, et il ne contient pas
     de point avant les deux-points qui le ferment. Sans ces trois marques, le
     découpage prenait un renvoi pour une rubrique et en perdait une. */
  const candidat = m => {
    const suite = t.slice(m.index + m[0].length, m.index + m[0].length + 170);
    if (!/^[A-ZÉÈÀ]/.test(suite)) return false;
    const tete = suite.split(/\s*[:;]/)[0];
    return !/article|\./.test(tete);
  };
  const bornes = [];
  for (const m of t.matchAll(/(?:^|\s)(\d{1,2})°\s+/g)) {
    const attendu = bornes.length ? +bornes[bornes.length - 1][1] + 1 : 1;
    if (+m[1] === attendu && candidat(m)) bornes.push(m);
  }
  bornes.forEach((b, i) => {
    const deb = b.index + b[0].length;
    const fin = i + 1 < bornes.length ? bornes[i + 1].index : t.length;
    const corps = net(t.slice(deb, fin));
    const titre = net((corps.match(/^([^:;]{3,140})\s*[:;]/) || [, corps.slice(0, 90)])[1]);
    rubriques.push({ n: +b[1], titre, corps, sections: [] });
  });
  /* Les sections : « A-… », « B-… ». */
  for (const r of rubriques) {
    const sb = [...r.corps.matchAll(/(?:^|\s)([A-Z])\s?-\s?(?=[A-ZÉÈÀ])/g)];
    const zones = sb.length
      ? sb.map((m, i) => ({ lettre: m[1],
          corps: net(r.corps.slice(m.index + m[0].length, i + 1 < sb.length ? sb[i + 1].index : r.corps.length)) }))
      : [{ lettre: null, corps: r.corps.replace(/^[^:]{0,140}:\s*/, "") }];
    for (const z of zones) {
      const titre = net((z.corps.match(/^([^:;]{3,160})\s*[:;]/) || [, z.corps.slice(0, 90)])[1]);
      const sujets = [];
      /* Les sujets : « a) … », « b) … ». */
      const ab = [...z.corps.matchAll(/(?:^|\s)([a-z])\)\s+/g)];
      const parts = ab.length
        ? ab.map((m, i) => ({ lettre: m[1],
            corps: net(z.corps.slice(m.index + m[0].length, i + 1 < ab.length ? ab[i + 1].index : z.corps.length)) }))
        : [{ lettre: null, corps: z.corps }];
      for (const p of parts) {
        /* Les informations : séparées par « ; - » ou par « ; ». */
        const morceaux = p.corps.split(/\s*;\s*/).map(net).filter(x => x && x !== "-");
        const intitule = net((morceaux[0] || "").replace(/^-\s*/, ""));
        sujets.push({ lettre: p.lettre, intitule,
          informations: morceaux.slice(1).map(x => net(x.replace(/^-\s*/, ""))).filter(Boolean) });
      }
      r.sections.push({ lettre: z.lettre, titre, sujets });
    }
    delete r.corps;
  }
  return rubriques;
}

/* La couverture : quelle part du texte se retrouve dans le découpage. Une
   mesure, non une promesse — c'est elle qui dira si le décret a changé de
   ponctuation et si l'extraction doit être reprise. */
function couverture(brut, rubriques) {
  const dedans = [];
  for (const r of rubriques) {
    dedans.push(r.titre);
    for (const s of r.sections) {
      if (s.titre) dedans.push(s.titre);
      for (const su of s.sujets) { dedans.push(su.intitule); su.informations.forEach(x => dedans.push(x)); }
    }
  }
  /* Compter la longueur des libellés extraits donnait plus de cent pour cent :
     un titre de rubrique est aussi le début du premier sujet, et se comptait
     deux fois. On mesure donc ce que le découpage couvre du texte, en marquant
     les intervalles réellement consommés — une mesure ne vaut que si elle ne
     peut pas dépasser son maximum. */
  const pris = new Uint8Array(brut.length);
  let curseur = 0;
  for (const x of dedans) {
    if (!x) continue;
    let i = brut.indexOf(x, curseur);
    if (i < 0) i = brut.indexOf(x);          /* un titre repris plus haut */
    if (i < 0) continue;
    pris.fill(1, i, i + x.length);
    curseur = Math.max(curseur, i);
  }
  let couverts = 0;
  for (let i = 0; i < pris.length; i++) if (pris[i]) couverts++;
  return { extraits: dedans.length, couverts, source: brut.length,
    part: +(100 * couverts / brut.length).toFixed(1) };
}

/* Chaque libellé extrait doit se retrouver mot pour mot dans le texte : c'est
   la garantie qu'aucune information n'a été reformulée en chemin. */
function fidelite(brut, rubriques) {
  const manquants = [];
  const voir = x => { if (x && !brut.includes(x)) manquants.push(x.slice(0, 70)); };
  for (const r of rubriques) {
    voir(r.titre);
    for (const s of r.sections) { voir(s.titre);
      for (const su of s.sujets) { voir(su.intitule); su.informations.forEach(voir); } }
  }
  return manquants;
}

function construire() {
  const out = {};
  for (const [cle, art, seuil] of [["moins300", "R2312-8", "moins de trois cents salariés"],
                                   ["au moins300", "R2312-9", "au moins trois cents salariés"]]) {
    const brut = texte(art);
    const rubriques = decouper(brut);
    rubriques.forEach(r => { const p = auPlancher(r.n);
      r.plancher = p.length > 0; r.themesPlancher = p; });
    out[cle] = { article: art, version: T[art].id, seuil, rubriques,
      couverture: couverture(brut, rubriques), infidelites: fidelite(brut, rubriques) };
  }
  return { plancher: PLANCHER, planchierTexte: "L. 2312-21, al. 3",
    planchierVersion: T["L2312-21"].id, contenu: out };
}

module.exports = { construire, decouper, PLANCHER, auPlancher };

if (require.main === module) {
  const b = construire();
  console.log(`plancher de L. 2312-21, al. 3 — ${b.plancher.length} thèmes énumérés :`);
  b.plancher.forEach(t => console.log("   · " + t));
  let ko = 0;
  for (const [cle, d] of Object.entries(b.contenu)) {
    const info = d.rubriques.reduce((n, r) => n + r.sections.reduce((m, s) =>
      m + s.sujets.reduce((k, su) => k + 1 + su.informations.length, 0), 0), 0);
    const hors = d.rubriques.filter(r => !r.plancher).map(r => r.n + "° " + r.titre.slice(0, 40));
    console.log(`\n${d.article} — ${d.seuil} — version ${d.version}`);
    console.log(`  ${d.rubriques.length} rubriques · ${info} informations · couverture ${d.couverture.part} % du texte`);
    console.log(`  hors du plancher, donc supprimables par accord : ${hors.join(" ; ") || "aucune"}`);
    if (d.infidelites.length) { ko += d.infidelites.length;
      console.log(`  ÉCHEC — ${d.infidelites.length} libellé(s) ne se retrouvent pas mot pour mot dans le texte :`);
      d.infidelites.slice(0, 5).forEach(x => console.log("      " + x)); }
  }
  fs.writeFileSync(__dirname + "/_bdese.json", JSON.stringify(b, null, 1));
  console.log("\n_bdese.json écrit.");
  if (ko) process.exit(1);
}
