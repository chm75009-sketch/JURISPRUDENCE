/* Capture des articles qu'exigent les cinq parcours de régularisation ajoutés
   au module « parcours » : affichages obligatoires, registre unique du
   personnel, base de données économiques sociales et environnementales, index
   de l'égalité professionnelle, entretiens professionnels.

   MÊMES RÈGLES QUE PARTOUT DANS LE DÉPÔT :

   - Filtre par le NOM du code (« Code du travail »), jamais par LEGITEXT : un
     identifiant de texte désactive le filtre et le relais sert alors des
     homonymes d'autres codes.

   - DEUX LECTURES CONCORDANTES au moins, espacées : une seule lecture ne
     prouve rien — ni la concordance, ni l'écart.

   - CRITÈRE DE CONTENU : l'article rendu doit parler de ce qu'on cherche.
     C'est le seul critère sûr lorsque deux articles réels portent le même
     numéro dans deux parties du code.

   - Une réponse « élargie » (elargi: true — le relais a relâché le filtre)
     est écartée, comme une réponse relaxée de Judilibre.

   Ce qui ne se confirme pas n'entre pas dans le fichier des textes : il est
   consigné à part, et AUCUNE étape de parcours ne s'y appuie.

   Usage : node capturer-textes-regularisation.js [AAAA-MM-JJ]               */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";

/* numéro → fragments dont l'un au moins doit figurer dans le texte rendu. */
const ARTICLES = {
  /* ---- affichages et informations obligatoires ---- */
  "L1142-6":  ["225-1", "embauche"],
  "R3221-2":  ["3221-1"],
  "D4711-1":  ["locaux normalement accessibles"],
  "L4711-5":  ["4711-1", "registres"],
  "R4227-37": ["consigne de sécurité incendie"],
  "L3171-1":  ["affiche"],
  "R2262-1":  ["convention", "avis"],
  "L1152-4":  ["harcèlement moral"],
  "L1153-5":  ["harcèlement sexuel"],
  "L2142-3":  ["panneaux", "syndicale"],

  /* ---- registre unique du personnel ---- */
  "L1221-13": ["registre unique du personnel"],
  "L1221-15": ["à la disposition"],
  "D1221-23": ["registre unique du personnel"],
  "D1221-24": ["registre"],
  "D1221-25": ["registre"],
  "D1221-26": ["registre"],
  "D1221-27": ["registre"],

  /* ---- base de données économiques, sociales et environnementales ---- */
  "L2312-18": ["base de données"],
  "L2312-21": ["base de données"],
  "L2312-36": ["base de données"],
  "R2312-8":  ["base de données"],
  "R2312-9":  ["base de données"],

  /* ---- index de l'égalité professionnelle ---- */
  "L1142-8":  ["indicateurs", "écarts de rémunération"],
  "L1142-9":  ["quatre-vingt-quinze", "mesures de correction", "niveau de résultat"],
  "L1142-10": ["pénalité", "trois ans"],
  "L1142-11": ["représentation", "mille salariés"],
  "D1142-2":  ["indicateurs"],
  "D1142-3":  ["indicateurs"],
  "D1142-4":  ["points", "niveau de résultat"],
  "D1142-5":  ["1142-2", "à la disposition"],
  "D1142-6":  ["publi", "site internet"],

  /* ---- entretiens professionnels et formation ---- */
  "L6315-1":  ["entretien de parcours professionnel"],
  "L6321-1":  ["adaptation des salariés à leur poste"],
};

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    const a = j.article || j;
    /* Une réponse « élargie » : le relais a relâché le filtre par nom du code.
       Elle est écartée, comme une réponse relaxée de Judilibre. */
    if (a.elargi === true || j.elargi === true) return { elargi: true };
    if (a.trouve === false || j.trouve === false) return { absent: true };
    return { id: a.id || a.cid || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { erreur: e.message.slice(0, 90) }; }
}
const porte = (t, frs) => frs.some(fr => t.toLowerCase().includes(fr.toLowerCase()));

const CONFIRMES = {}, ECARTES = {};
const journal = [];

for (const [numero, frs] of Object.entries(ARTICLES)) {
  const vus = new Map();
  let verdict = null, lectures = 0, elargis = 0;
  for (let essai = 0; essai < 5 && !verdict; essai++) {
    const l = lire(numero);
    dors(1200);
    if (l.elargi) { elargis++; continue; }
    if (!l.texte) continue;
    lectures++;
    const v = vus.get(l.texte) || { n: 0, id: l.id };
    v.n++; vus.set(l.texte, v);
    /* deux lectures concordantes ET le critère de contenu */
    if (v.n >= 2 && porte(l.texte, frs)) verdict = { id: v.id, date: DATE, texte: l.texte };
  }
  if (verdict) {
    CONFIRMES[numero] = verdict;
    console.log(`${numero.padEnd(10)} confirmé  ${verdict.id}  (${verdict.texte.length} car.)`);
  } else {
    ECARTES[numero] = { date: DATE, lectures, elargis,
      versions: [...vus.entries()].map(([t, v]) => ({ id: v.id, lectures: v.n, extrait: t.slice(0, 160) })) };
    console.log(`${numero.padEnd(10)} NON CONFIRMÉ — ${lectures} lecture(s), ${vus.size} version(s) distincte(s), ${elargis} élargie(s)`);
  }
  journal.push({ numero, confirme: !!verdict, lectures, elargis, versions: vus.size });
}

fs.writeFileSync(__dirname + "/textes-regularisation.json",
  JSON.stringify(CONFIRMES, null, 1));
fs.writeFileSync(__dirname + "/textes-regularisation-non-confirmes.json",
  JSON.stringify({ date: DATE, code: CODE, articles: ECARTES }, null, 1));
fs.writeFileSync(__dirname + "/journal-regularisation.json",
  JSON.stringify({ date: DATE, code: CODE, demandes: Object.keys(ARTICLES).length,
    confirmes: Object.keys(CONFIRMES).length, ecartes: Object.keys(ECARTES).length,
    journal }, null, 1));

console.log(`\n${Object.keys(CONFIRMES).length} confirmé(s) · ${Object.keys(ECARTES).length} écarté(s)`
  + ` sur ${Object.keys(ARTICLES).length} demandé(s) — capture du ${DATE}, filtre « ${CODE} ».`);
