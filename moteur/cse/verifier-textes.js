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

/* Le relais fatigue sous trois cent soixante-huit requêtes d'affilée : il rend
   des 502, et — plus insidieux — il lui arrive de rendre une autre version que
   celle demandée. La première exécution a ainsi signalé dix écarts dont aucun
   n'était réel : réinterrogés un par un, les dix articles rendaient exactement
   la version du dépôt. Un contrôle qui crie au loup une fois sur trente-sept
   ne sert à rien. Un écart n'est donc déclaré qu'après confirmation par une
   seconde lecture espacée, et l'attente entre deux articles laisse au relais
   le temps de respirer. */
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
  const cites = Object.keys(T).filter(k => T[k] && T[k].texte);
  const vides = Object.keys(T).filter(k => !T[k] || !T[k].texte);
  console.log(`${cites.length} articles lus dans le dépôt · ${vides.length} demandés sans réponse · version au ${DATE}`);
  const ecarts = [], confirmes = [];
  for (const num of cites) {
    let a;
    try { a = await lire(num); }
    catch (e) { ecarts.push({ num, quoi: "relais", detail: e.message }); continue; }
    if (!a) { ecarts.push({ num, quoi: "absent", detail: "aucun article rendu par le relais" }); continue; }
    if (a.id !== T[num].id || net(a.texte) !== net(T[num].texte)) {
      /* Confirmation : une seule lecture divergente ne suffit pas à conclure. */
      await pause(2500);
      let b = null;
      try { b = await lire(num); } catch (e) { /* la confirmation a échoué */ }
      if (!b || b.id === T[num].id && net(b.texte) === net(T[num].texte)) {
        confirmes.push(num); process.stdout.write("?"); continue;
      }
      if (b.id !== T[num].id)
        ecarts.push({ num, quoi: "version", detail: `dépôt ${T[num].id} · source ${b.id}` });
      else
        ecarts.push({ num, quoi: "contenu",
          detail: `même version, texte différent (${net(T[num].texte).length} caractères au dépôt, ${net(b.texte).length} à la source)` });
      process.stdout.write("!");
      continue;
    }
    process.stdout.write(".");
    await pause(250);
  }
  console.log();
  if (confirmes.length)
    console.log(`${confirmes.length} lecture(s) divergente(s) non confirmée(s) à la seconde interrogation — le relais avait rendu autre chose que ce qu'il rend : ${confirmes.join(", ")}`);
  if (!ecarts.length) { console.log(`aucun écart : les ${cites.length} articles du dépôt sont ceux de la source.`); return; }
  for (const e of ecarts) console.log(`ÉCART ${e.quoi} · ${e.num} — ${e.detail}`);
  console.log(`${ecarts.length} écart(s). Reprendre la moisson (textes_cse.py) avant toute diffusion.`);
  process.exit(1);
})();
