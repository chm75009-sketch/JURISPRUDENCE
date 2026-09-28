/* DEUX RÈGLES SUR LES TIRETS, ET ELLES SE SONT CONTREDITES.

   La première : aucun tiret cadratin ni demi-cadratin dans ce qui sort du
   cabinet. La seconde : les expressions qui LISENT un registre repris d'un PDF
   doivent reconnaître ces deux signes, parce qu'un registre les emploie pour
   dire « rien ».

   Un nettoyage appliqué à la lettre a remplacé les tirets longs jusque dans ces
   expressions : une case portant un tiret long n'était plus lue comme vide mais
   comme une donnée, et les vingt-quatre nationalités absentes du registre de
   TEC auraient effacé, au dépôt suivant, ce qui avait été saisi à la main.
   Relevé le 28 septembre 2026 par la vérification.

   Les deux règles tiennent ensemble à une condition : que ces expressions
   écrivent les signes en échappement Unicode. Ce contrôle vérifie les deux.

     node epreuve/verifier-tirets.mjs                                        */
import { readFileSync, readdirSync } from "fs";

const DOCS = new URL("../docs/", import.meta.url);
const CADRATIN = String.fromCharCode(0x2014);
const DEMI = String.fromCharCode(0x2013);
const ECHAPPE = ["u2014", "u2013"];

/* Le moteur PDF est une bibliothèque tierce, reprise telle quelle : on ne la
   corrige pas, et ce qu'elle contient ne nous est pas imputable. */
const TIERS = ["pdfjs.worker.js", "pdfjs.js", "pdf.worker.js"];

/* Les endroits qui doivent reconnaître les deux signes, et le nom de
   l'expression qui le fait. Chacun a été cassé une fois. */
const LECTEURS = [
  ["registre.html", "RIEN"],
  ["registre.html", "PRESENT"],
  ["lire-pdf.js", "NUM_SEUL"],
  ["idcc.js", "v2"],
  ["controler-ri.html", "re"],
  ["audit-cse.html", "replace"],
];

const fautes = [];

/* 1. Aucun des deux signes en clair, nulle part. */
for (const f of readdirSync(DOCS)) {
  if (TIERS.indexOf(f) >= 0) continue;
  if (!/\.(js|html|json|css|md)$/.test(f)) continue;
  let t;
  try { t = readFileSync(new URL(f, DOCS), "utf8"); } catch (e) { continue; }
  const n = t.split(CADRATIN).length - 1 + (t.split(DEMI).length - 1);
  if (n) fautes.push("docs/" + f + " : " + n + " tiret(s) cadratin ou demi-cadratin en clair.");
}

/* 2. Les expressions de lecture portent bien les échappements. */
for (const [f, nom] of LECTEURS) {
  let t;
  try { t = readFileSync(new URL(f, DOCS), "utf8"); } catch (e) {
    fautes.push("docs/" + f + " est illisible."); continue;
  }
  const lignes = t.split("\n").filter((l) => l.indexOf(nom) >= 0 &&
    ECHAPPE.some((e) => l.indexOf(e) >= 0));
  if (!lignes.length)
    fautes.push("docs/" + f + " : l'expression « " + nom + " » ne porte plus " +
      "les deux signes en échappement Unicode. Un registre qui écrit un tiret long " +
      "pour une case vide serait relu comme portant une donnée.");
}

if (fautes.length) {
  fautes.forEach((f) => console.log("FAUTE : " + f));
  console.log("Les deux règles tiennent ensemble si les signes sont écrits en échappement.");
  process.exit(1);
}
console.log("tirets : aucun en clair | les " + LECTEURS.length +
  " expressions de lecture portent les échappements");
