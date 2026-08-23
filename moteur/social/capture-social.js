/* Le moteur de capture des textes du module social, écrit une fois.

   Les passes 5 et 6 s'en servent : mêmes règles, un seul endroit où elles
   vivent — filtre par le NOM du code (« Code du travail »), jamais un
   LEGITEXT ; DEUX lectures concordantes espacées avant toute conclusion ;
   critère de CONTENU appliqué AVANT le décompte, pour qu'un homonyme relu
   deux fois reste un homonyme ; identifiant de version consigné avec le
   texte. Ce qui ne se confirme pas n'entre pas : il est écrit dans
   textes-social-non-confirmes.json avec ce qui a été lu.

   Les autres dépôts de textes vérifiés du dépôt servent de contre-lecture :
   un identifiant différent est signalé, jamais corrigé en silence.          */
const fs = require("fs");
const { execFile } = require("child_process");

const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";

/* Contre-lecture : tous les dépôts de textes déjà vérifiés du dépôt. */
function contreLecture() {
  const A = {};
  for (const f of ["cse/textes_cse", "sst/textes-sst", "discipline/textes-discipline",
                   "nao/textes-nao", "bdese/textes-bdese", "pse/textes-pse",
                   "economique/textes_eco"]) {
    try {
      const T = JSON.parse(fs.readFileSync(__dirname + "/../" + f + ".json", "utf8"));
      for (const [n, v] of Object.entries(T)) {
        const id = v && (v.id || v.legiarti || v.cid);
        if (id && !A[n]) A[n] = { id, source: f };
      }
    } catch (e) { /* un dépôt absent ne sert simplement pas de contre-lecture */ }
  }
  return A;
}

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => new Promise(r => setTimeout(r, ms));

function lire(numero, date) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date });
  return new Promise(resolve => {
    execFile("curl", ["-s", "--max-time", "45", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps],
      { encoding: "utf8", maxBuffer: 40e6 }, (err, out) => {
        if (err) return resolve({ erreur: String(err.message).slice(0, 80) });
        try {
          const j = JSON.parse(out); const a = j.article || j;
          resolve({ id: a.id || a.cid || null, texte: net(a.texte || a.content || "") });
        } catch (e) { resolve({ erreur: "réponse illisible" }); }
      });
  });
}
const porte = (t, frs) => frs.every(fr => t.toLowerCase().includes(fr.toLowerCase()));

async function capturer(ARTICLES, nomPasse, date) {
  const DATE = date || process.argv[2] || new Date().toISOString().slice(0, 10);
  const AUTRES = contreLecture();
  const T = JSON.parse(fs.readFileSync(__dirname + "/textes-social.json", "utf8"));
  const NC = JSON.parse(fs.readFileSync(__dirname + "/textes-social-non-confirmes.json", "utf8"));
  let confirmes = 0, refuses = 0;

  for (const [numero, frs] of Object.entries(ARTICLES)) {
    if (T[numero]) { console.log(`${numero.padEnd(11)} déjà confirmé`); continue; }
    const vus = new Map(); let verdict = null;
    for (let essai = 0; essai < 6 && !verdict; essai++) {
      const l = await lire(numero, DATE);
      await dors(1100);
      if (!l.texte) continue;
      if (!porte(l.texte, frs)) {
        const v = vus.get(l.texte) || { n: 0, id: l.id, hors: true };
        v.n++; vus.set(l.texte, v);
        continue;
      }
      const v = vus.get(l.texte) || { n: 0, id: l.id };
      v.n++; vus.set(l.texte, v);
      if (v.n >= 2) verdict = { id: v.id, date: DATE, texte: l.texte };
    }
    if (verdict) {
      T[numero] = verdict; delete NC.articles[numero]; confirmes++;
      const a = AUTRES[numero];
      const note = a ? (a.id === verdict.id ? `  (= ${a.source})` : `  ATTENTION : ${a.source} porte ${a.id}`) : "";
      console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}${note}  ${verdict.texte.slice(0, 55)}…`);
    } else {
      refuses++;
      NC.articles[numero] = {
        motif: `${nomPasse} : lectures espacées sans deux lectures concordantes du contenu attendu — rien n'est conclu, l'article n'entre pas au référentiel`,
        attendu: frs,
        lectures: [...vus.entries()].map(([t, v]) => ({ id: v.id, fois: v.n, horsSujet: !!v.hors, debut: t.slice(0, 120) })),
      };
      console.log(`${numero.padEnd(11)} NON CONFIRMÉ`);
    }
  }

  fs.writeFileSync(__dirname + "/textes-social.json", JSON.stringify(T, null, 1));
  NC.date = DATE;
  fs.writeFileSync(__dirname + "/textes-social-non-confirmes.json", JSON.stringify(NC, null, 1));
  console.log(`\n${confirmes} confirmés dans cette passe · ${refuses} refusés`);
  console.log(`${Object.keys(T).length} confirmés au total · ${Object.keys(NC.articles).length} non confirmés`);
}

module.exports = { capturer, lire, porte, contreLecture };
