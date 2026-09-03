/* Le parcours « règlement intérieur » doit poser la question fermée AVANT
   la construction, et son « oui » doit mener à une page qui s'ouvre.

   Hors chaîne de publication, comme l'autre épreuve de navigateur :
     npm i playwright && npx playwright install chromium
     node epreuve-parcours-ri.js                                          */
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const RACINE = path.join(__dirname, "../../docs");
const TYPES = { ".html": "text/html", ".js": "application/javascript", ".json": "application/json", ".ico": "image/x-icon", ".png": "image/png" };
const serveur = http.createServer((req, res) => {
  const p = path.join(RACINE, decodeURIComponent(req.url.split("?")[0].split("#")[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  res.end(fs.readFileSync(p));
});
let echecs = 0;
const verifie = (q, ok, d) => { if (ok) console.log("  ok   " + q);
  else { echecs++; console.error("  ÉCHEC " + q + (d ? " : " + d : "")); } };

(async () => {
  await new Promise(r => serveur.listen(8932, r));
  const nav = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await nav.newPage();
  const erreurs = [];
  page.on("pageerror", e => erreurs.push(e.message));
  await page.goto("http://127.0.0.1:8932/parcours.html?p=ri");
  await page.waitForTimeout(1200);

  verifie("la page des parcours se charge sans erreur", erreurs.length === 0, erreurs.join(" | "));

  const bloc = await page.$(".controle-existant");
  verifie("la question fermée est posée", !!bloc);
  if (bloc) {
    const t = await bloc.textContent();
    verifie("elle porte les deux issues", /Oui\./.test(t) && /Non\./.test(t), t.slice(0, 90));
    verifie("le « oui » ouvre le contrôle de l'existant", /Contrôler le règlement existant/.test(t));
    const href = await page.getAttribute(".controle-existant a", "href");
    verifie("le lien pointe la page du contrôle", href === "controler-ri.html", href);
    /* La question doit précéder le préalable : sinon on lit la construction avant. */
    const avant = await page.evaluate(() => {
      const q = document.querySelector(".controle-existant");
      const h = document.querySelector("#zone-prealable h2.titre-zone");
      return !!(q && h) && (q.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    });
    verifie("elle est posée avant la liste de ce qu'il faut réunir", avant);
  }

  /* Le lien doit aboutir. */
  await page.click(".controle-existant a");
  await page.waitForLoadState("load");
  verifie("la page du contrôle s'ouvre", /controler-ri/.test(page.url()), page.url());
  verifie("elle demande le dépôt", !!(await page.$("#depot")));

  /* Aucun autre parcours ne doit avoir hérité du bloc. */
  await page.goto("http://127.0.0.1:8932/parcours.html?p=sanction");
  await page.waitForTimeout(900);
  verifie("un parcours sans branche « oui » n'affiche rien",
    (await page.$$(".controle-existant")).length === 0);
  verifie("aucune erreur JavaScript", erreurs.length === 0, erreurs.join(" | "));

  await nav.close(); serveur.close();
  console.log(echecs ? `\n${echecs} échec(s)` : "\nl'épreuve passe");
  process.exit(echecs ? 1 : 0);
})();
