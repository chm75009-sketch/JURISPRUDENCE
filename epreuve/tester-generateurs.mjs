/* Épreuve des générateurs de documents : node epreuve/tester-generateurs.mjs docs/documents-sst.js
   Charge documents-produits.js puis le fichier donné, fait produire chaque
   document pour les cinq secteurs et pour une fiche vide, et vérifie :
   - aucune exception ;
   - aucun tiret cadratin ni demi-cadratin dans la sortie ni dans le fichier ;
   - la sortie commence par l'exemple (bandeau EXEMPLE), puis « À COMPLÉTER »,
     puis « LES RÈGLES », dans cet ordre ;
   - au moins un tableau en colonnes (lignes avec « | ») ;
   - la section « Pour aller plus loin » quand des liens existent pour le thème.
   Sort en code 1 si quelque chose manque, avec le détail. */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const fichiers = process.argv.slice(2);
if (!fichiers.length) { console.error("usage : node epreuve/tester-generateurs.mjs docs/documents-x.js [...]"); process.exit(2); }
const racine = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "docs");

const SECTEURS = ["transport et logistique", "industrie", "bâtiment et travaux publics", "commerce", "services"];
function contexte(secteur, vide) {
  if (vide) return { profil: {}, fiche: {}, donnees: {}, aujourdhui: new Date("2026-09-09T10:00:00") };
  return {
    profil: { denomination: "BLU BLU SARL", adresse: "12 rue des Lilas, 95100 Argenteuil", siret: "123 456 789 00012",
      effectif: 62, secteur: secteur, conventionCollective: "1979 - Hôtels, cafés, restaurants", responsable: "Madame Léa MARTIN, gérante" },
    fiche: {}, donnees: {}, aujourdhui: new Date("2026-09-09T10:00:00"),
  };
}

let fautes = 0;
function faute(msg) { fautes++; console.log("  FAUTE " + msg); }

for (const f of fichiers) {
  const sandbox = { window: {}, console };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(racine, "documents-produits.js"), "utf8"), sandbox, { filename: "documents-produits.js" });
  const src = fs.readFileSync(path.resolve(f), "utf8");
  if (/[—–]/.test(src)) faute(f + " : tiret cadratin ou demi-cadratin dans le fichier (" + (src.match(/[—–]/g) || []).length + ")");
  const avant = Object.keys(sandbox.window.DocumentsProduits.tous);
  try { vm.runInContext(src, sandbox, { filename: path.basename(f) }); }
  catch (e) { faute(f + " : ne se charge pas : " + e.message); continue; }
  const ids = Object.keys(sandbox.window.DocumentsProduits.tous).filter((id) => !avant.includes(id));
  console.log(f + " : " + ids.length + " générateurs");
  for (const id of ids) {
    const gen = sandbox.window.DocumentsProduits.pour(id);
    const cas = SECTEURS.map((s) => [s, contexte(s, false)]).concat([["fiche vide", contexte("", true)]]);
    for (const [nom, ctx] of cas) {
      let t;
      try { t = gen.produire(ctx); } catch (e) { faute(id + " (" + nom + ") : exception " + e.message); continue; }
      if (typeof t !== "string") { faute(id + " (" + nom + ") : produire ne rend pas une chaîne"); continue; }
      if (/[—–]/.test(t)) faute(id + " (" + nom + ") : tiret cadratin dans la sortie");
      const iEx = t.search(/^EXEMPLE/m), iVo = t.search(/À COMPLÉTER/), iRe = t.search(/^LES RÈGLES/m);
      if (iEx < 0) faute(id + " (" + nom + ") : pas de bandeau EXEMPLE en tête de ligne");
      if (iVo < 0) faute(id + " (" + nom + ") : pas de section « À COMPLÉTER »");
      if (iRe < 0) faute(id + " (" + nom + ") : pas de section « LES RÈGLES »");
      if (iEx >= 0 && iVo >= 0 && iRe >= 0 && !(iEx < iVo && iVo < iRe)) faute(id + " (" + nom + ") : ordre attendu EXEMPLE, À COMPLÉTER, LES RÈGLES");
      const lignesTable = t.split("\n").filter((l) => l.indexOf(" | ") >= 0);
      if (lignesTable.length < 2) faute(id + " (" + nom + ") : aucun tableau en colonnes (lignes avec « | »)");
      if (nom !== "fiche vide" && !/Pour aller plus loin/.test(t)) faute(id + " (" + nom + ") : pas de « Pour aller plus loin »");
      if (t.length > 60000) faute(id + " (" + nom + ") : sortie de " + t.length + " caractères, trop longue");
      if (typeof gen.tableur === "function") {
        try { const L = gen.tableur(ctx); if (!Array.isArray(L) || !L.length) faute(id + " : tableur vide"); }
        catch (e) { faute(id + " : tableur lève " + e.message); }
      }
    }
  }
}
console.log(fautes ? fautes + " faute(s)" : "aucune faute");
process.exit(fautes ? 1 : 0);
