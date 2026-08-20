/* Quatrième passe de capture : les articles qu'exigent, d'une part, les
   manques signalés par la revue externe (commissions du CSE, commission des
   marchés, formation santé-sécurité des élus, réunions santé-sécurité), et
   d'autre part le crible des quatre domaines (santé au travail, temps de
   travail, égalité professionnelle, épargne salariale).

   Mêmes règles que les passes précédentes : filtre par le NOM du code
   (« Code du travail »), deux lectures concordantes espacées, critère de
   CONTENU pour écarter les homonymes. Ce qui ne se confirme pas n'entre pas.
   Les articles déjà vérifiés dans moteur/cse/textes_cse.json servent de
   contre-lecture : un identifiant différent est signalé.

   Usage : node capturer-textes-social-4.js [AAAA-MM-JJ]                     */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";

const ARTICLES = {
  /* commissions du CSE — à défaut d'accord (revue externe, point 1) */
  "L2315-45":   ["commissions supplémentaires"],
  "L2315-46":   ["commission économique"],
  "L2315-49":   ["commission de la formation"],
  "L2315-50":   ["aide au logement"],
  "L2315-51":   ["accession"],
  "L2315-56":   ["égalité professionnelle"],
  /* commission des marchés — critère : les comptes du comité (point 2) */
  "L2315-44-1": ["commission des marchés"],
  "D2315-29":   ["2315-44-1", "commission des marchés"],
  /* formation santé-sécurité des élus et du référent (point 3) */
  "L2315-18":   ["cinq jours"],
  "L2315-16":   ["heures de délégation"],
  /* quatre réunions annuelles santé-sécurité (point 4) */
  "L2315-27":   ["quatre réunions"],
  /* crible santé au travail : périodicités et suivi renforcé */
  "R4624-16":   ["cinq ans"],
  "R4624-22":   ["suivi individuel renforcé"],
  "R4624-23":   ["amiante"],
  /* crible temps de travail : décompte et documents */
  "L3171-2":    ["décompte"],
  "L3171-3":    ["comptabiliser", "à la disposition"],
  /* crible égalité professionnelle : information sur l'égalité de rémunération */
  "R3221-2":    ["3221-1"],
  /* crible épargne salariale : le livret */
  "L3341-6":    ["livret d'épargne salariale"],
};

/* Les identifiants déjà vérifiés par le module CSE : une contre-lecture. */
let CSE = {};
try { CSE = JSON.parse(fs.readFileSync(__dirname + "/../cse/textes_cse.json", "utf8")); } catch (e) {}

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
  const vus = new Map(); let verdict = null;
  for (let essai = 0; essai < 5 && !verdict; essai++) {
    const l = lire(numero); dors(1000);
    if (!l.texte) continue;
    const v = vus.get(l.texte) || { n: 0, id: l.id };
    v.n++; vus.set(l.texte, v);
    if (v.n >= 2 && porte(l.texte, frs)) verdict = { id: v.id, date: DATE, texte: l.texte };
  }
  if (verdict) {
    T[numero] = verdict; delete NC.articles[numero];
    const cse = CSE[numero];
    const note = cse ? (cse.id === verdict.id ? "  (= module CSE)" : `  ATTENTION : module CSE porte ${cse.id}`) : "";
    console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}${note}  ${verdict.texte.slice(0, 60)}…`);
  } else {
    NC.articles[numero] = { motif: "quatrième passe : lectures espacées sans deux lectures concordantes du contenu attendu — rien n'est conclu, l'article n'entre pas au référentiel",
      lectures: [...vus.entries()].map(([t, v]) => ({ id: v.id, fois: v.n, debut: t.slice(0, 120) })) };
    console.log(`${numero.padEnd(11)} NON CONFIRMÉ`);
  }
}
fs.writeFileSync(__dirname + "/textes-social.json", JSON.stringify(T, null, 1));
NC.date = DATE;
fs.writeFileSync(__dirname + "/textes-social-non-confirmes.json", JSON.stringify(NC, null, 1));
console.log(`\n${Object.keys(T).length} confirmés au total · ${Object.keys(NC.articles).length} non confirmés`);
