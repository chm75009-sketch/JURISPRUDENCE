/* Source unique. Le registre est déduit du code exécuté, jamais saisi à la main :
   l'identifiant, l'objet, les champs lus, la pièce exigée, les états possibles et
   le cas de test proviennent tous de l'inspection des fonctions elles-mêmes.
   C'est ce qui interdit au document de se contredire. */
const fs = require("fs");
const { C, PIECE_ATTENDUE } = require("./controles.js");
const G = require("./grille.js");

/* Les contrôles qui ne concluent jamais à la conformité : ils détectent une
   situation qui appelle un examen extérieur à la base. */
const DETECTION = new Set(["CTL-COE-01","CTL-USA-01","CTL-CTX-01","CTL-IND-01","CTL-ECO-03","CTL-CSE-09","CTL-FRA-01"]);

const src = x => String(x.verdict);
/* les champs de la fiche réellement lus par la fonction */
function entrees(x) {
  const s = src(x); const out = new Set();
  for (const m of s.matchAll(/\bf\.([A-Za-z_][A-Za-z0-9_]*)/g)) out.add(m[1]);
  for (const m of s.matchAll(/PC\.get\(f,\s*"([^"]+)"/g)) out.add("pièce " + m[1]);
  if (/PC\.norm\(f\)/.test(s)) out.add("pieces");
  if (/M\.regimeEco\(f\)/.test(s)) out.add("effectif, nbLicenciements (par le moteur)");
  return [...out];
}
function etats(x) {
  const s = src(x); const e = [];
  for (const [k, l] of [["CONF","conforme"],["NC","non conforme"],["RISQ","risque à vérifier"],
                        ["MANQ","donnée manquante"],["SO","sans objet"]])
    if (new RegExp("\\b" + k + "\\b").test(s)) e.push(l);
  return e;
}
/* les cas de test qui visent ce contrôle */
function casDeTest() {
  const t = fs.readFileSync("tests-contradictoires.js", "utf8"); const m = {};
  for (const c of t.matchAll(/\["([^"]+)","(CTL-[A-Z]+-\d+)","([^"]+)"/g))
    (m[c[2]] = m[c[2]] || []).push(c[1]);
  return m;
}
function construire() {
  const T = casDeTest();
  return C.map(x => ({
    id: x.id, rubrique: x.rubrique, objet: x.objet,
    type: DETECTION.has(x.id) ? "détection — conclut au risque, jamais à la conformité" : "conformité",
    entrees: entrees(x),
    piece: PIECE_ATTENDUE[x.id] || "—",
    etats: etats(x),
    fondement: (x.fondement || []).join(" · ") || "—",
    tests: T[x.id] || [],
  }));
}
/* contrôle de cohérence : tout contrôle doit avoir un cas de test, sauf ceux de
   détection, qui n'ont rien à détecter d'autre qu'une déclaration. */
function coherence() {
  const R = construire();
  return {
    total: R.length,
    identifiantsUniques: new Set(R.map(r => r.id)).size === R.length,
    sansTest: R.filter(r => !r.tests.length && r.type === "conformité").map(r => r.id),
    sansEntree: R.filter(r => !r.entrees.length).map(r => r.id),
    detection: R.filter(r => r.type !== "conformité").map(r => r.id),
    regles: G.length,
  };
}
module.exports = { construire, coherence, DETECTION };
