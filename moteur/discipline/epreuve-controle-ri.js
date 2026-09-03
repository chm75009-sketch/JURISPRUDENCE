/* L'épreuve de la page « contrôler mon règlement intérieur », dans un vrai
   navigateur : le dépôt d'un .docx, le contrôle, et la version corrigée.

   Elle n'entre pas dans la chaîne de publication — celle-ci ne doit dépendre
   ni d'un navigateur ni d'une bibliothèque hors dépôt. Elle se joue à la main,
   quand la page change :

     npm i playwright && npx playwright install chromium
     node epreuve-controle-ri.js

   Le règlement d'épreuve est écrit en .docx par python-docx, comme tous les
   documents Word du dépôt — jamais par la bibliothèque JavaScript « docx »,
   que Word refuse. C'est le fichier que la page lit, décomprime et contrôle :
   l'épreuve porte donc aussi sur la lecture d'un vrai .docx. */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");

const RI_EPREUVE = path.join(require("os").tmpdir(), "ri-epreuve.docx");
execFileSync("python3", ["-c", `
import docx
d = docx.Document()
for l in [
 "RÈGLEMENT INTÉRIEUR DE LA SOCIÉTÉ D'ÉPREUVE",
 "Article 1 — Champ d'application. Le présent règlement s'applique à l'ensemble du personnel de l'entreprise, quel que soit le lieu d'exécution du travail.",
 "Article 2 — Santé et sécurité. Chaque salarié applique les consignes de sécurité affichées et utilise les équipements de protection individuelle mis à sa disposition.",
 "Article 3 — Échelle des sanctions. Les sanctions applicables sont l'avertissement, le blâme et la mise à pied disciplinaire.",
 "Article 4 — Tout manquement aux horaires donnera lieu à une amende forfaitaire de trente euros.",
 "Article 5 — La direction procède à la fouille des vestiaires à tout moment.",
 "Article 6 — Entrée en vigueur. Le présent règlement entrera en vigueur le 1er juin 2026.",
]:
    d.add_paragraph(l)
d.save(${JSON.stringify(RI_EPREUVE)})
`]);

const RACINE = path.join(__dirname, "../../docs");
const TYPES = { ".html": "text/html", ".js": "application/javascript", ".json": "application/json",
                ".css": "text/css", ".ico": "image/x-icon" };

const serveur = http.createServer((req, res) => {
  const p = path.join(RACINE, decodeURIComponent(req.url.split("?")[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});

let echecs = 0;
const verifie = (quoi, ok, detail) => {
  if (ok) console.log("  ok   " + quoi);
  else { echecs++; console.error("  ÉCHEC " + quoi + (detail ? " : " + detail : "")); }
};

(async () => {
  await new Promise(r => serveur.listen(8931, r));
  const nav = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await nav.newPage();
  const erreursJS = [];
  page.on("pageerror", e => erreursJS.push(e.message));
  await page.goto("http://127.0.0.1:8931/controler-ri.html");

  verifie("la page se charge sans erreur JavaScript", erreursJS.length === 0, erreursJS.join(" | "));
  verifie("le module de contrôle est là",
    await page.evaluate(() => !!(window.MoteurDiscipline && window.MoteurDiscipline.audit.controleRI)));

  /* 1 — le garde-fou : un extrait trop court ne se contrôle pas */
  await page.fill("#depot", "Article 1 — Deux lignes ne font pas un règlement.");
  await page.click("#controler");
  verifie("un texte trop court est refusé, avec le motif",
    /trop court/.test(await page.textContent("#erreur")));

  /* 2 — l'exemple fautif */
  await page.click("#exemple");
  await page.click("#controler");
  await page.waitForSelector("#o-diag:not(.cache)");
  const compteurs = await page.textContent("#compteurs");
  verifie("le diagnostic s'ouvre et compte", /matière/.test(compteurs), compteurs);

  const txt = await page.textContent("#points");
  verifie("l'amende est signalée", /amendes et autres sanctions pécuniaires/i.test(txt));
  verifie("la fouille est signalée", /restrictions aux droits des personnes/i.test(txt));
  verifie("les lanceurs d'alerte sont dits absents", /protection des lanceurs d'alerte/i.test(txt));
  /* Le mot « conforme » figure dans la prose de la page — pour dire qu'elle ne
     le prononce jamais. Ce qui doit être vérifié, c'est qu'aucun ÉTAT ne le
     porte : ni la pastille d'un point, ni le motif que le module rend. */
  const etats = await page.$$eval(".etat", n => n.map(x => x.textContent.trim()));
  verifie("aucune pastille ne dit « conforme »",
    etats.length > 0 && !etats.some(e => /conforme/i.test(e)), etats.join(", "));
  verifie("les états rendus sont les trois attendus",
    etats.every(e => ["absent", "à vérifier", "à contrôler", "sans objet"].includes(e)), etats.join(", "));
  verifie("aucun motif ne conclut à la conformité",
    !/est conforme|sont conformes/i.test(await page.textContent("#points")));
  verifie("les articles sont écrits en clair", /L\. 1321-1/.test(txt));

  /* 3 — la version corrigée */
  await page.click("#vers-sortie");
  await page.waitForSelector("#o-sortie:not(.cache)");
  const sortie = await page.textContent("#sortie");
  verifie("le texte d'origine est conservé", /Tout retard non justifié donnera lieu à une amende/.test(sortie));
  verifie("le passage prohibé est signalé à sa place", /\[À CONTRÔLER — RI-CTR-11/.test(sortie));
  verifie("les clauses absentes sont ajoutées", /CLAUSES AJOUTÉES AU TITRE DU CONTRÔLE/.test(sortie));
  verifie("le critère du juge accompagne le passage", /Critère :/.test(sortie));

  /* 4 — décocher retire vraiment */
  await page.click("#retour-diag");
  await page.uncheck('input[data-ins="RI-CTR-06"]');
  await page.click("#vers-sortie");
  const sortie2 = await page.textContent("#sortie");
  verifie("la clause décochée n'est plus insérée",
    !/HARCÈLEMENTS ET AGISSEMENTS SEXISTES/.test(sortie2));

  /* 5 — le dépôt d'un vrai .docx, écrit par python-docx */
  await page.goto("http://127.0.0.1:8931/controler-ri.html");
  await page.setInputFiles("#fichier", RI_EPREUVE);
  await page.waitForFunction(() => document.querySelector("#depot").value.length > 300, null, { timeout: 8000 });
  const lu = await page.inputValue("#depot");
  verifie("le .docx est lu dans le navigateur", /échelle des sanctions/i.test(lu), lu.slice(0, 120));
  await page.click("#controler");
  await page.waitForSelector("#o-diag:not(.cache)");
  verifie("le règlement déposé en .docx se contrôle",
    /à contrôler|absent/i.test(await page.textContent("#compteurs")));

  verifie("aucune erreur JavaScript de bout en bout", erreursJS.length === 0, erreursJS.join(" | "));

  await nav.close(); serveur.close();
  console.log(echecs ? `\n${echecs} échec(s)` : "\nl'épreuve passe");
  process.exit(echecs ? 1 : 0);
})();
