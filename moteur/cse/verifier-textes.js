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

   Réserve sur le relais, mesurée et non supposée. Interrogé trois cent
   soixante-huit fois d'affilée, il rend des 502 — et, plus insidieux, il rend
   parfois un article homonyme d'une autre partie du code : R. 2312-9 est tantôt
   le tableau de la base de données économiques et sociales, 31 803 caractères,
   tantôt un renvoi de 53 caractères à l'article R. 2112-8. Une seule lecture ne
   prouve donc rien, ni dans un sens ni dans l'autre. La règle appliquée ici :
   une divergence est reprise jusqu'à quatre fois ; si la version du dépôt
   reparaît ne serait-ce qu'une fois, il n'y a pas d'écart ; l'écart n'est
   déclaré que si toutes les lectures divergent et s'accordent sur la même
   version. Les divergences non confirmées sont comptées à part, parce que les
   taire masquerait que la source n'est pas fiable sous charge.

   Usage : node verifier-textes.js [AAAA-MM-JJ] [article…]
   Sans article, les 368 sont relus ; avec, seuls ceux-là.   */
const fs = require("fs");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes_cse.json", "utf8"));
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "LEGITEXT000006072050";
const DATE = /^\d{4}-\d{2}-\d{2}$/.test(process.argv[2] || "") ? process.argv[2] : "2026-08-15";
const CIBLES = process.argv.slice(2).filter(x => /^[LRD]\d/.test(x));

const net = s => String(s || "").replace(/\s+/g, " ").trim();
function extraire(o, out) {
  if (Array.isArray(o)) { o.forEach(x => extraire(x, out)); return out; }
  if (o && typeof o === "object") {
    if (typeof o.texte === "string" && o.num) out.push({ id: o.id, num: o.num, texte: o.texte });
    Object.values(o).forEach(x => extraire(x, out));
  }
  return out;
}

const pause = ms => new Promise(r => setTimeout(r, ms));

async function lireUneFois(numero) {
  const r = await fetch(RELAIS, { method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "article", numero, code: CODE, date: DATE }) });
  if (!r.ok) throw new Error(`relais : ${r.status}`);
  const l = extraire(await r.json(), []);
  const attendu = numero.replace(/^([LRD])(\d)/, "$1$2");
  return l.find(x => x.num.replace(/[.\s]/g, "") === attendu.replace(/[.\s]/g, "")) || l[0] || null;
}

/* Une lecture, c'est jusqu'à trois tentatives : le relais rend des 502 sous
   charge, et un échec de transport n'est pas un écart de texte. */
async function lire(numero, essais = 3) {
  let dernier = null;
  for (let i = 0; i < essais; i++) {
    try { const a = await lireUneFois(numero); if (a) return a; dernier = new Error("aucun article rendu"); }
    catch (e) { dernier = e; }
    await pause(1500 * (i + 1));
  }
  throw dernier || new Error("lecture impossible");
}

(async () => {
  const cites = Object.keys(T).filter(k => T[k] && T[k].texte)
    .filter(k => !CIBLES.length || CIBLES.includes(k));
  const vides = Object.keys(T).filter(k => !T[k] || !T[k].texte);
  console.log(`${cites.length} articles lus dans le dépôt · ${vides.length} demandés sans réponse · version au ${DATE}`);
  const ecarts = [], confirmes = [];
  for (const num of cites) {
    let a;
    try { a = await lire(num); }
    catch (e) { ecarts.push({ num, quoi: "relais", detail: e.message }); continue; }
    if (!a) { ecarts.push({ num, quoi: "absent", detail: "aucun article rendu par le relais" }); continue; }
    const concorde = x => x && x.id === T[num].id && net(x.texte) === net(T[num].texte);
    if (!concorde(a)) {
      /* Une lecture divergente ne prouve rien : on reprend jusqu'à quatre fois.
         Si la version du dépôt reparaît une seule fois, il n'y a pas d'écart. */
      const vues = [a];
      let reparue = false;
      for (let i = 0; i < 4 && !reparue; i++) {
        await pause(2500);
        let b = null;
        try { b = await lire(num); } catch (e) { continue; }
        vues.push(b);
        if (concorde(b)) reparue = true;
      }
      if (reparue) { confirmes.push(num); process.stdout.write("?"); continue; }
      const ids = [...new Set(vues.filter(Boolean).map(x => x.id))];
      if (ids.length !== 1) {
        /* La source ne s'accorde pas avec elle-même : rien ne peut être conclu. */
        confirmes.push(`${num} (source instable : ${ids.join(", ")})`);
        process.stdout.write("?"); continue;
      }
      const b = vues.filter(Boolean).pop();
      ecarts.push(b.id !== T[num].id
        ? { num, quoi: "version", detail: `dépôt ${T[num].id} · source ${b.id}, ${vues.length} lectures concordantes` }
        : { num, quoi: "contenu",
            detail: `même version, texte différent (${net(T[num].texte).length} caractères au dépôt, ${net(b.texte).length} à la source)` });
      process.stdout.write("!");
      continue;
    }
    process.stdout.write(".");
    await pause(250);
  }
  console.log();
  if (confirmes.length)
    console.log(`${confirmes.length} lecture(s) divergente(s) que les interrogations suivantes n'ont pas confirmée(s) — le relais avait rendu autre chose que ce qu'il rend : ${confirmes.join(", ")}`);
  if (!ecarts.length) { console.log(`aucun écart : les ${cites.length} articles du dépôt sont ceux de la source.`); return; }
  for (const e of ecarts) console.log(`ÉCART ${e.quoi} · ${e.num} — ${e.detail}`);
  console.log(`${ecarts.length} écart(s). Reprendre la moisson (textes_cse.py) avant toute diffusion.`);
  process.exit(1);
})();
