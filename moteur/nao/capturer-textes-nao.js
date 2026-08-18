/* Constituer le dépôt de textes du module NAO, une fois, depuis le relais.

   Ce script n'est pas la vérification : il capture. La preuve de fidélité est
   rendue ensuite par verifier-textes-nao.js, qui relit chaque article deux
   fois et ne conclut que sur des lectures concordantes.

   Usage : node capturer-textes-nao.js [AAAA-MM-JJ]                          */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "LEGITEXT000006072050";
const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };

const NUMEROS = ["L2242-1","L2242-2","L2242-2-1","L2242-3","L2242-4","L2242-5","L2242-6",
  "L2242-7","L2242-8","L2242-9","L2242-10","L2242-11","L2242-12","L2242-13","L2242-14",
  "L2242-15","L2242-16","L2242-17","L2242-18","L2242-19","L2242-20","L2242-21",
  "L2243-1","L2243-2","R2242-1"];

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
    "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
  const j = JSON.parse(out);
  const a = j.article || j;
  return { id: a.id || null, texte: net(a.texte || a.content || "") };
}

const T = {};
for (const n of NUMEROS) {
  let a = null;
  for (let e = 0; e < 3 && !(a && a.texte); e++) {
    try { a = lire(n); } catch (err) { a = null; }
    dors(600);
  }
  if (!a || !a.texte) { console.error(`ÉCHEC — ${n} illisible.`); process.exit(1); }
  T[n] = { id: a.id, date: DATE, texte: a.texte };
  console.log(`${n} — ${a.id} — ${a.texte.length} car.`);
}
fs.writeFileSync(__dirname + "/textes-nao.json", JSON.stringify(T, null, 1));
console.log(`${NUMEROS.length} articles écrits dans textes-nao.json`);
