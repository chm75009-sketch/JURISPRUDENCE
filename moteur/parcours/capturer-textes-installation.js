/* Capturer à la source les articles du parcours « Installer le CSE :
   la première réunion ».

   Même protocole que capturer-textes-parcours.js, et pour la même raison : le
   relais Légifrance n'est pas fiable sous charge — 502, et parfois un article
   HOMONYME d'une autre partie du code. UNE SEULE LECTURE NE PROUVE RIEN.
   Chaque article est lu jusqu'à quatre fois, requêtes espacées ; on ne conclut
   que sur deux lectures IDENTIQUES entre elles ET dont le CONTENU porte le
   fragment attendu. Le contenu est le seul critère sûr (CLAUDE.md).

   Le filtre est le NOM du code — « Code du travail » —, jamais un LEGITEXT.
   Le relais renvoie en outre un drapeau « elargi » quand il a dû relâcher ce
   filtre pour trouver quelque chose : une lecture élargie est ÉCARTÉE, comme
   une réponse « relaxed » de Judilibre.

   Un article non confirmé N'ENTRE PAS dans le référentiel : il est consigné à
   part dans textes-installation-non-confirmes.json, et l'étape qui voulait le
   citer se replie sur une formulation prudente ou disparaît.

   Usage : node capturer-textes-installation.js [AAAA-MM-JJ] [--tout]        */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = (process.argv[2] && /^\d{4}-\d{2}-\d{2}$/.test(process.argv[2]))
  ? process.argv[2] : new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";   /* le NOM du code — voir CLAUDE.md */

/* Chaque article avec le ou les fragments de contenu qui l'identifient. */
const ARTICLES = {
  /* ---- la documentation économique et financière ---- */
  "L2312-57":  ["documentation économique et financière"],

  /* ---- le bureau, la personnalité civile, le règlement intérieur ---- */
  "L2315-23":  ["personnalité civile"],
  "L2315-24":  ["règlement intérieur"],
  "L2315-32":  ["majorité des membres présents"],

  /* ---- la composition, le référent harcèlement, les heures ---- */
  "L2314-1":   ["référent"],
  "R2314-1":   ["heures de délégation"],
  "L2314-33":  ["quatre ans"],
  "L2315-7":   ["temps nécessaire"],
  "L2315-9":   ["répartir entre eux"],
  "L2315-11":  ["temps de travail effectif"],

  /* ---- les moyens matériels, la visioconférence, la discrétion ---- */
  "L2315-14":  ["circuler librement"],
  "L2315-15":  ["afficher"],
  "L2315-25":  ["local aménagé"],
  "L2315-26":  ["réunions d'information"],
  "L2315-3":   ["secret professionnel"],
  "L2315-4":   ["visioconférence"],

  /* ---- les commissions ---- */
  "L2315-36":  ["santé, sécurité et conditions de travail"],
  "L2315-37":  ["inspecteur du travail"],
  "L2315-38":  ["délégation"],
  "L2315-39":  ["présidée"],
  "L2315-41":  ["mise en place"],
  "L2315-42":  ["délégué syndical"],
  "L2315-43":  ["L. 2315-36"],
  "L2315-44":  ["règlement intérieur"],
  "L2315-44-1":["commission des marchés"],
  "L2315-44-3":["marchés"],
  "L2315-45":  ["commissions supplémentaires"],
  "L2315-46":  ["commission économique"],
  "L2315-47":  ["commission économique"],
  "L2315-49":  ["formation"],
  "L2315-50":  ["logement"],
  "L2315-56":  ["égalité professionnelle"],
  "D2315-29":  ["commission des marchés"],

  /* ---- la représentation au conseil d'administration ou de surveillance ---- */
  "L2312-72":  ["conseil d'administration"],
  "L2312-73":  ["vœux"],
  "L2312-75":  ["administrateur"],
  "L2312-76":  ["actions simplifiées"],

  /* ---- les budgets ---- */
  "L2315-61":  ["subvention de fonctionnement"],
  "L2315-62":  ["budget de fonctionnement"],
  "L2312-81":  ["contribution"],
  "L2312-82":  ["activités sociales et culturelles"],
  "L2312-83":  ["masse salariale brute"],
  "L2312-84":  ["reliquat"],
  "R2312-49":  ["ressources"],
  "R2312-51":  ["reliquat"],
  "R2312-52":  ["cessation définitive"],

  /* ---- la base de données économiques, sociales et environnementales ---- */
  "L2312-18":  ["base de données"],
  "L2312-21":  ["base de données"],
  "L2312-36":  ["base de données"],

  /* ---- les formations ---- */
  "L2315-16":  ["temps de travail"],
  "L2315-17":  ["organisme"],
  "L2315-18":  ["formation"],
  "L2315-63":  ["formation économique"],
  "L2145-11":  ["congé de formation économique"],

  /* ---- les comptes du comité : ce que la transition met en jeu ---- */
  "L2315-64":  ["obligations comptables"],
  "L2315-65":  ["livre"],
  "L2315-68":  ["arrêtés"],
  "L2315-69":  ["rapport"],
  "L2315-70":  ["conventions"],
  "L2315-71":  ["trois jours"],
  "L2315-72":  ["porte à la connaissance"],
  "L2315-73":  ["commissaire aux comptes"],
  "L2315-75":  ["dix ans"],
  "L2315-76":  ["expert-comptable"],
  "D2315-33":  ["seuils"],

  /* ---- la réunion elle-même : ordre du jour, procès-verbal ---- */
  "L2315-27":  ["quatre réunions"],
  "L2315-28":  ["se réunit"],
  "L2315-29":  ["ordre du jour"],
  "L2315-30":  ["ordre du jour"],
  "L2315-34":  ["procès-verbal"],
  "L2315-35":  ["affiché"],
  "D2315-26":  ["procès-verbal"],
  "D2315-27":  ["sténographie"],
  "L2312-8":   ["expression collective"],
  "L2312-15":  ["avis"],
};

/* Numéros cherchés et NON RETENUS, avec le motif. On les consigne : un numéro
   qui n'existe pas doit être documenté, sinon il revient. */
const RETIRES = {
  "R2323-38": {
    motif: "le relais répond « trouvé : faux » sous filtre « Code du travail » à la date du jour : " +
      "l'article du comité d'entreprise qui imposait aux membres du comité sortant de rendre compte " +
      "de leur gestion au nouveau comité et de lui remettre tous les documents n'est plus en vigueur. " +
      "Aucun article du code lu ce jour ne reprend cette obligation pour le comité social et économique.",
    cite: false },
  "D2315-24": { motif: "le relais répond « trouvé : faux » : ce numéro n'existe pas à la date lue", cite: false },
  "D2315-25": { motif: "le relais répond « trouvé : faux » : ce numéro n'existe pas à la date lue", cite: false },
  "D2315-28": { motif: "le relais répond « trouvé : faux » : ce numéro n'existe pas à la date lue", cite: false },
  "D2315-30": { motif: "le relais répond « trouvé : faux » : ce numéro n'existe pas à la date lue", cite: false },
  "D2315-31": { motif: "le relais répond « trouvé : faux » : ce numéro n'existe pas à la date lue", cite: false },
  "D2315-32": { motif: "le relais répond « trouvé : faux » : ce numéro n'existe pas à la date lue", cite: false },
};

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => new Promise(r => setTimeout(r, ms));

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "45", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    if (j.erreur) return { erreur: String(j.erreur) };
    if (j.trouve === false) return { absent: true };
    /* Une lecture « élargie » a perdu le filtre par nom du code : on l'écarte
       comme une réponse relaxée — c'est par là que viennent les homonymes. */
    if (j.elargi) return { elargi: true, id: j.id || null, texte: "" };
    return { id: j.id || null, texte: net(j.texte) };
  } catch (e) { return { erreur: String(e.message).slice(0, 80) }; }
}

const porte = (texte, fragments) =>
  fragments.some(fr => texte.toLowerCase().includes(fr.toLowerCase()));

const REPRENDRE = !process.argv.includes("--tout");
let acquis = {};
if (REPRENDRE) {
  try { acquis = JSON.parse(fs.readFileSync(__dirname + "/textes-installation.json", "utf8")); } catch (_) {}
}

(async function () {
  const confirmes = Object.assign({}, acquis), ecartes = {};
  for (const [numero, fragments] of Object.entries(ARTICLES)) {
    if (confirmes[numero]) { console.log(`${numero.padEnd(11)} déjà confirmé (repris)`); continue; }
    const lues = [];
    let verdict = null;
    for (let essai = 0; essai < 4 && !verdict; essai++) {
      const l = lire(numero);
      await dors(900);
      lues.push(l);
      if (!l.texte) continue;
      const memes = lues.filter(x => x.texte === l.texte);
      if (memes.length >= 2) {
        verdict = porte(l.texte, fragments)
          ? { id: l.id, date: DATE, lectures: memes.length, concordantes: true, texte: l.texte }
          : { homonyme: true, id: l.id, texte: l.texte.slice(0, 200) };
      }
    }
    if (verdict && !verdict.homonyme) {
      confirmes[numero] = verdict;
      console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}  ${verdict.texte.slice(0, 64)}…`);
    } else {
      ecartes[numero] = {
        motif: verdict && verdict.homonyme
          ? "deux lectures stables, mais le contenu ne porte pas le fragment attendu : homonyme probable — l'article n'entre pas au référentiel"
          : "pas deux lectures concordantes en quatre essais : rien n'est conclu",
        lectures: lues.map(x => ({ id: x.id || null, erreur: x.erreur || null,
          absent: x.absent || false, elargi: x.elargi || false,
          debut: (x.texte || "").slice(0, 140) })),
      };
      console.log(`${numero.padEnd(11)} NON CONFIRMÉ`);
    }
  }

  fs.writeFileSync(__dirname + "/textes-installation.json", JSON.stringify(confirmes, null, 1));
  fs.writeFileSync(__dirname + "/textes-installation-non-confirmes.json",
    JSON.stringify({ date: DATE, relais: RELAIS, code: CODE, articles: ecartes,
      note: "Un article non confirmé n'entre pas au référentiel et n'est jamais cité par le parcours d'installation.",
      retiresAvantCapture: RETIRES }, null, 1));
  console.log(`\n${Object.keys(confirmes).length} confirmés · ${Object.keys(ecartes).length} non confirmés (consignés à part)`);
})();
