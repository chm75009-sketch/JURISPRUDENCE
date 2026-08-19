/* Troisième passe de capture : les articles qu'exigent les modèles complets
   du plan d'action — plan du règlement intérieur, composition de la CSSCT,
   colonnes du registre unique, calendrier électoral, indicateurs de l'index.

   Mêmes règles que les passes précédentes : filtre par le NOM du code
   (« Code du travail »), deux lectures concordantes espacées, critère de
   CONTENU pour écarter les homonymes. Ce qui ne se confirme pas n'entre pas.

   Usage : node capturer-textes-social-3.js [AAAA-MM-JJ]                     */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";

const ARTICLES = {
  /* règlement intérieur : le plan complet des clauses */
  "L1321-2-1": ["neutralité"],
  "L1321-3":   ["restrictions"],
  "L1321-5":   ["notes de service"],
  "L1321-6":   ["français"],
  /* CSSCT : la délibération rédigée exige la composition et la délégation */
  "L2315-38":  ["délégation"],
  "L2315-39":  ["trois membres"],
  "L2315-41":  ["santé, sécurité"],
  /* registre unique du personnel : les colonnes exactes */
  "D1221-23":  ["registre"],
  /* index égalité : les indicateurs des entreprises de plus de 250 salariés */
  "D1142-2":   ["dix plus hautes rémunérations"],
  /* élections : l'information du personnel et l'invitation des syndicats */
  "L2314-4":   ["quatre-vingt-dixième"],
  "L2314-5":   ["protocole d'accord préélectoral"],
};

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };
function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out); const a = j.article || j;
    return { id: a.id || a.cid || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { erreur: e.message.slice(0, 80) }; }
}
const porte = (t, frs) => frs.some(fr => t.toLowerCase().includes(fr.toLowerCase()));

const T = JSON.parse(fs.readFileSync(__dirname + "/textes-social.json", "utf8"));
const NC = JSON.parse(fs.readFileSync(__dirname + "/textes-social-non-confirmes.json", "utf8"));

for (const [numero, frs] of Object.entries(ARTICLES)) {
  if (T[numero]) { console.log(`${numero.padEnd(11)} déjà confirmé`); continue; }
  const vus = new Map(); let verdict = null; const autres = [];
  for (let essai = 0; essai < 5 && !verdict; essai++) {
    const l = lire(numero); dors(1000);
    if (!l.texte) continue;
    const v = vus.get(l.texte) || { n: 0, id: l.id };
    v.n++; vus.set(l.texte, v);
    if (v.n >= 2 && porte(l.texte, frs)) verdict = { id: v.id, date: DATE, texte: l.texte };
    if (!porte(l.texte, frs) && !autres.includes(l.id)) autres.push(l.id);
  }
  if (verdict) {
    T[numero] = verdict; delete NC.articles[numero];
    console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}  ${verdict.texte.slice(0, 60)}…`);
  } else {
    NC.articles[numero] = { motif: "troisième passe : lectures espacées sans deux lectures concordantes du contenu attendu — rien n'est conclu, l'article n'entre pas au référentiel",
      lectures: [...vus.entries()].map(([t, v]) => ({ id: v.id, fois: v.n, debut: t.slice(0, 120) })) };
    console.log(`${numero.padEnd(11)} NON CONFIRMÉ`);
  }
}
fs.writeFileSync(__dirname + "/textes-social.json", JSON.stringify(T, null, 1));
NC.date = DATE;
fs.writeFileSync(__dirname + "/textes-social-non-confirmes.json", JSON.stringify(NC, null, 1));
console.log(`\n${Object.keys(T).length} confirmés au total · ${Object.keys(NC.articles).length} non confirmés`);
