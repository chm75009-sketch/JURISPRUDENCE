/* Vérifier que les articles embarqués sont toujours ceux de Légifrance.

   Motif, tiré d'un contre-audit externe. Un auditeur a reproché à la base
   d'avoir tronqué l'article L. 2314-33 : il y manquait la limite de trois
   mandats successifs et ses deux exceptions. La base avait raison — la version
   LEGIARTI000036761951, longue de 1 189 caractères, a cessé d'être en vigueur
   entre le 1er octobre et le 1er novembre 2025, remplacée par la version
   LEGIARTI000052437191, longue de 334 caractères, qui est celle du dépôt. Mais
   il a fallu quatre requêtes datées pour l'établir, parce que rien, dans le
   dépôt, ne disait de quelle version il s'agissait.

   Deux conséquences, l'une et l'autre appliquées :
   — l'identifiant de version est désormais reproduit dans le rapport, à côté
     de chaque article ;
   — ce script rejoue la lecture à la source et signale tout écart, de version
     comme de contenu. Il a besoin du réseau : il n'est donc pas dans la chaîne
     de tests, qui doit rester exécutable hors connexion.

   Usage : node verifier-textes.js [AAAA-MM-JJ]   */
const fs = require("fs");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "LEGITEXT000006072050";
const DATE = process.argv[2] || "2026-08-15";

const net = s => String(s || "").replace(/\s+/g, " ").trim();
function extraire(o, out) {
  if (Array.isArray(o)) { o.forEach(x => extraire(x, out)); return out; }
  if (o && typeof o === "object") {
    if (typeof o.texte === "string" && o.num) out.push({ id: o.id, num: o.num, texte: o.texte });
    Object.values(o).forEach(x => extraire(x, out));
  }
  return out;
}

async function lire(numero) {
  const r = await fetch(RELAIS, { method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "article", numero, code: CODE, date: DATE }) });
  if (!r.ok) throw new Error(`relais : ${r.status}`);
  const l = extraire(await r.json(), []);
  const attendu = numero.replace(/^([LRD])(\d)/, "$1$2");
  return l.find(x => x.num.replace(/[.\s]/g, "") === attendu.replace(/[.\s]/g, "")) || l[0] || null;
}

(async () => {
  const cites = Object.keys(T).filter(k => T[k] && T[k].texte);
  const vides = Object.keys(T).filter(k => !T[k] || !T[k].texte);
  console.log(`${cites.length} articles lus dans le dépôt · ${vides.length} demandés sans réponse · version au ${DATE}`);
  const ecarts = [];
  for (const num of cites) {
    let a;
    try { a = await lire(num); }
    catch (e) { ecarts.push({ num, quoi: "relais", detail: e.message }); continue; }
    if (!a) { ecarts.push({ num, quoi: "absent", detail: "aucun article rendu par le relais" }); continue; }
    if (a.id !== T[num].id)
      ecarts.push({ num, quoi: "version", detail: `dépôt ${T[num].id} · source ${a.id}` });
    else if (net(a.texte) !== net(T[num].texte))
      ecarts.push({ num, quoi: "contenu",
        detail: `même version, texte différent (${net(T[num].texte).length} caractères au dépôt, ${net(a.texte).length} à la source)` });
    process.stdout.write(".");
  }
  console.log();
  if (!ecarts.length) { console.log("aucun écart : les 368 articles du dépôt sont ceux de la source."); return; }
  for (const e of ecarts) console.log(`ÉCART ${e.quoi} · ${e.num} — ${e.detail}`);
  console.log(`${ecarts.length} écart(s). Reprendre la moisson (textes_cse.py) avant toute diffusion.`);
  process.exit(1);
})();
