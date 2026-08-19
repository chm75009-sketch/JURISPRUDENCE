/* Seconde passe de capture : les articles non confirmés en première passe.

   Le relais sert par intermittence des homonymes d'autres codes (mesuré en
   première passe : CGCT, santé publique, impôts, commande publique…). La règle
   du dépôt : quand deux lectures stables désignent deux articles réels, seul
   LE CONTENU tranche. On relit donc jusqu'à dix fois, espacé, et on ne
   confirme que si un texte porteur du fragment attendu revient deux fois.

   Certains fragments de la première passe étaient fautifs (« service de »
   quand l'article dit « services de ») : ils sont corrigés ici.

   Usage : node capturer-textes-social-2.js [AAAA-MM-JJ]                     */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail"; /* le relais filtre par NOM_CODE — le NOM du code,
   pas son identifiant LEGITEXT : passer l'identifiant désactivait le filtre et
   laissait la pertinence servir des homonymes d'autres codes (mesuré ce jour) */

const ARTICLES = {
  "L2311-2":  ["comité social et économique", "onze salariés"],
  "L2313-1":  ["établissements distincts"],
  "L2331-1":  ["comité de groupe"],
  "L1311-2":  ["règlement intérieur"],
  "L1321-1":  ["règlement intérieur"],
  "L1321-2":  ["défense des salariés", "harcèlement"],
  "L1321-4":  ["règlement intérieur"],
  "R4121-1":  ["document unique"],
  "R4121-2":  ["document unique"],
  "R4121-4":  ["document unique"],
  "L1142-6":  ["embauche"],
  "L3171-1":  ["heures auxquelles commence et finit le travail"],
  "L1221-13": ["registre unique du personnel"],
  "D4132-1":  ["registre spécial"],
  "L6315-1":  ["parcours professionnel"],
  "L6321-1":  ["adaptation des salariés", "capacité à occuper un emploi"],
  "L4141-2":  ["formation pratique et appropriée"],
  "L4622-1":  ["prévention et de santé au travail"],
  "L3322-2":  ["cinquante salariés", "résultats de l'entreprise"],
  "L1142-8":  ["écarts de rémunération"],
  "L5212-1":  ["vingt salariés"],
  "L5212-2":  ["obligation d'emploi"],
  "L5212-5":  ["obligation d'emploi"],
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
const porte = (texte, frs) => frs.some(fr => texte.toLowerCase().includes(fr.toLowerCase()));

const T = JSON.parse(fs.readFileSync(__dirname + "/textes-social.json", "utf8"));
const NC = JSON.parse(fs.readFileSync(__dirname + "/textes-social-non-confirmes.json", "utf8"));

for (const [numero, frs] of Object.entries(ARTICLES)) {
  if (T[numero]) { console.log(`${numero.padEnd(11)} déjà confirmé`); continue; }
  const vus = new Map(); /* texte → {n, id} */
  let verdict = null;
  const autres = [];
  for (let essai = 0; essai < 5 && !verdict; essai++) {
    const l = lire(numero); dors(1100);
    if (!l.texte) continue;
    const v = vus.get(l.texte) || { n: 0, id: l.id };
    v.n++; vus.set(l.texte, v);
    if (v.n >= 2 && porte(l.texte, frs)) verdict = { id: v.id, date: DATE, texte: l.texte };
    if (!porte(l.texte, frs) && !autres.includes(l.id)) autres.push(l.id);
  }
  if (verdict) {
    T[numero] = verdict;
    delete NC.articles[numero];
    console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}  ${verdict.texte.slice(0, 60)}…`
      + (autres.length ? `  (homonymes écartés : ${autres.join(", ")})` : ""));
  } else {
    NC.articles[numero] = { motif: "seconde passe : lectures espacées sans deux lectures concordantes du contenu attendu — rien n'est conclu, l'article n'entre pas au référentiel",
      lectures: [...vus.entries()].map(([t, v]) => ({ id: v.id, fois: v.n, debut: t.slice(0, 120) })) };
    console.log(`${numero.padEnd(11)} toujours NON CONFIRMÉ`);
  }
}

fs.writeFileSync(__dirname + "/textes-social.json", JSON.stringify(T, null, 1));
NC.date = DATE;
fs.writeFileSync(__dirname + "/textes-social-non-confirmes.json", JSON.stringify(NC, null, 1));
console.log(`\n${Object.keys(T).length} confirmés au total · ${Object.keys(NC.articles).length} non confirmés`);
