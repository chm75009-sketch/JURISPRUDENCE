/* CE QUI S'OUVRE HORS CONNEXION, ET CE QUI NE S'OUVRE PAS.

   Le service worker garde une liste de fichiers pris au moment de
   l'installation. La stratégie étant « réseau d'abord, cache en secours »,
   tout ce qui a été visité en ligne y entre ensuite de lui-même : une page
   absente de la liste s'ouvre quand même hors connexion, à condition d'avoir
   été ouverte une fois. Celle qu'on n'a jamais ouverte, elle, ne s'ouvre pas.

   Relevé le 28 septembre 2026 : vingt-cinq fichiers manquaient, dont huit
   écrans entiers, les visites médicales et les notes de service parmi eux, et
   le lecteur de PDF sans lequel un dépôt échoue sans dire pourquoi.

   Ce contrôle regarde les deux sens : un fichier de docs/ qui n'est pas dans
   la liste, et une entrée de la liste qui ne désigne aucun fichier. Il ne
   demande ni navigateur ni réseau.

     node epreuve/verifier-cache.mjs                                         */
import fs from "node:fs";
import path from "node:path";

const racine = path.resolve("docs");
const sw = fs.readFileSync(path.join(racine, "sw.js"), "utf8");
const listes = new Set((sw.match(/"\.\/[^"]*"/g) || [])
  .map((x) => x.slice(3, -1)).filter(Boolean));

/* Ce qui n'a pas à être pris : le service worker lui-même, et les fichiers de
   travail qui ne sont pas servis à l'utilisateur. */
const HORS = new Set(["sw.js"]);
const SERVIS = /\.(html|js|css|json)$/;

const fautes = [];
for (const f of fs.readdirSync(racine).sort()) {
  if (f.startsWith(".") || HORS.has(f)) continue;
  if (fs.statSync(path.join(racine, f)).isDirectory()) continue;
  if (!SERVIS.test(f)) continue;
  if (!listes.has(f))
    fautes.push(f + " : servi par l'application, absent de la liste du cache");
}
for (const e of listes) {
  if (!e || e.endsWith("/")) continue;
  if (!fs.existsSync(path.join(racine, e)))
    fautes.push(e + " : inscrit au cache, mais le fichier n'existe pas");
}

fautes.forEach((f) => console.log("FAUTE " + f));
console.log("cache : " + listes.size + " entrées | fautes : " + fautes.length);
process.exit(fautes.length ? 1 : 0);
