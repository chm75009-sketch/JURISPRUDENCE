/* LES TROIS NUMÉROS DE VERSION DISENT-ILS LA MÊME CHOSE ?

   Trente-deux mises à jour ont été publiées de la 12.46 à la 12.97 sans que le
   numéro affiché à l'accueil bouge : seul CACHE dans sw.js était incrémenté.
   L'utilisatrice lisait donc « Version 12.46, 26 septembre 2026 » sur une
   application qui n'était plus celle-là, et rien ne lui disait si une mise à
   jour était arrivée. Relevé le 28 septembre 2026 par la vérification.

   Ce contrôle se lance avant chaque envoi :
     node epreuve/verifier-version.mjs
   Il rend 0 quand les trois concordent, 1 sinon, et il nomme l'écart. */
import { readFileSync } from "fs";

const lire = (f) => readFileSync(new URL("../docs/" + f, import.meta.url), "utf8");

const version = (lire("version.js").match(/VERSION_APP\s*=\s*"([^"]+)"/) || [])[1] || null;
const date = (lire("version.js").match(/VERSION_DATE\s*=\s*"([^"]+)"/) || [])[1] || null;
const manifeste = (lire("manifest.json").match(/"version"\s*:\s*"([^"]+)"/) || [])[1] || null;
const cache = (lire("sw.js").match(/CACHE\s*=\s*"jurisprudence-([^"]+)"/) || [])[1] || null;

const fautes = [];
if (!version) fautes.push("docs/version.js : VERSION_APP est introuvable.");
if (!date) fautes.push("docs/version.js : VERSION_DATE est introuvable.");
if (!manifeste) fautes.push('docs/manifest.json : "version" est introuvable.');
if (!cache) fautes.push("docs/sw.js : CACHE est introuvable.");
if (version && manifeste && version !== manifeste)
  fautes.push("L'accueil annonce " + version + ", le manifeste " + manifeste + ".");
if (version && cache && version !== cache)
  fautes.push("L'accueil annonce " + version + ", le cache du service worker " + cache + ".");
if (manifeste && cache && manifeste !== cache)
  fautes.push("Le manifeste annonce " + manifeste + ", le cache " + cache + ".");

if (fautes.length) {
  fautes.forEach((f) => console.log("FAUTE : " + f));
  console.log("Les trois se changent ensemble : docs/version.js, docs/manifest.json, docs/sw.js.");
  process.exit(1);
}
console.log("version : " + version + ", " + date + " | manifeste et cache concordent");
