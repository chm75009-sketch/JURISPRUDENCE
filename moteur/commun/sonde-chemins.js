/* Sonde de chemins : enregistre non plus les champs, mais les chemins
   « parent.enfant » réellement lus par les contrôles, puis les confronte à ce
   que les dossiers fournissent vraiment. Un chemin lu qu'aucun dossier ne
   renseigne produit une « donnée manquante » perpétuelle : l'application
   reproche au client une omission qui n'en est pas une. */
const fs = require("fs");
const mod = process.argv[2] === "cse" ? "cse" : "economique";
const dir = __dirname + "/../" + mod;
const { C } = require(dir + (mod === "cse" ? "/controles-cse.js" : "/controles.js"));
const C2 = mod === "cse" ? [] : require(dir + "/controles2.js").C || [];
const TOUS = [...C, ...(Array.isArray(C2) ? C2 : [])];

const lus = new Set();
function sonde(o, prefixe) {
  return new Proxy(o, {
    get(t, k) {
      if (typeof k !== "string" || /^(then|toJSON|constructor|inspect|length|filter|map|some|every|includes|slice|join|find|forEach|reduce|split|sort|indexOf|concat|push|match|replace|trim|toLowerCase|toUpperCase|padEnd|startsWith|test|getTime|toString|valueOf)$/.test(k) || /^\d+$/.test(k))
        return typeof t[k] === "function" ? t[k].bind(t) : t[k];
      const chemin = prefixe ? prefixe + "." + k : k;
      if (prefixe) lus.add(chemin);
      const v = t[k];
      return (v && typeof v === "object" && !(v instanceof Date)) ? sonde(v, chemin) : v;
    },
  });
}

const dossiers = fs.readdirSync(dir).filter(n => /^(fiche|dossier)-.*\.json$/.test(n));
const fournis = new Set();
function relever(o, prefixe) {
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o)) { o.forEach(x => relever(x, prefixe)); return; }
  for (const k of Object.keys(o)) {
    const chemin = prefixe ? prefixe + "." + k : k;
    if (prefixe) fournis.add(chemin);
    relever(o[k], chemin);
  }
}

const charges = [];
for (const n of dossiers) {
  let f; try { f = JSON.parse(fs.readFileSync(dir + "/" + n, "utf8")); } catch (e) { continue; }
  charges.push(n); relever(f, "");
  for (const c of TOUS) { try { c.verdict(sonde(f, "")); } catch (e) {} }
}

const jamaisFournis = [...lus].filter(c => !fournis.has(c) && !/^_/.test(c)).sort();
console.log(`module ${mod} — ${charges.length} dossier(s) : ${charges.join(", ")}`);
console.log(`chemins lus par les contrôles : ${lus.size} · chemins présents dans les dossiers : ${fournis.size}`);
console.log(`\nchemins lus qu'aucun dossier ne renseigne : ${jamaisFournis.length}`);
jamaisFournis.forEach(c => console.log("   " + c));
