/* LES FICHIERS WORD, OUVERTS POUR DE BON.

   La consigne du dépôt est ancienne : « les fichiers produits par la
   bibliothèque JavaScript docx sont refusés par Microsoft Word », et c'est
   pourquoi les .docx du cabinet se fabriquent avec python-docx. Ceux que
   l'application produit, eux, sont écrits à la main dans audit-export.js :
   personne ne les avait jamais ouverts autrement qu'en les regardant à
   l'écran. La contre-vérification du 26 septembre 2026 le dit d'ailleurs en
   toutes lettres, dans « non vérifié ou non testable » : « l'ouverture dans
   Word et Excel réels ».

   Ce contrôle produit les documents du quotidien dans le navigateur, capte les
   fichiers téléchargés, et les rouvre avec python-docx, qui lit le même format
   que Word : l'archive, ses parties obligatoires, et le texte du corps. Un
   fichier que python-docx refuse est un fichier que Word refusera.

     node epreuve/verifier-docx.mjs            (tous les documents)
     node epreuve/verifier-docx.mjs 12         (les douze premiers)          */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

let chromium;
try {
  ({ chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs"));
} catch (e) {
  try {
    ({ chromium } = await import("playwright"));
  } catch (e2) {
    console.log("Playwright est introuvable : " + e2.message);
    process.exit(2);
  }
}

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const RACINE = "http://127.0.0.1:8133";
const combien = parseInt(process.argv[2] || "0", 10) || 0;

const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  responsable: "Chadi EL SAFADI, gérant", responsableNom: "Chadi EL SAFADI",
  responsableQualite: "gérant", siret: "53845047900034", effectif: "82",
  secteur: "transport et logistique", ville: "Argenteuil", orgPrudhommes: "Argenteuil",
  orgInspection: "Unité de contrôle 95-02, 13 boulevard Gambetta, 95100 Argenteuil",
  orgSanteTravail: "CMIE, 9 rue de la Gare, 95100 Argenteuil",
  conventionCollective: "0016 - transports routiers", cseExiste: "oui, élu",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin", qua: "150 M", nais: "1985-03-12",
    adr: "5 rue des Acacias, 95100 Argenteuil" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin", qua: "Employée", nais: "1990-01-20",
    adr: "18 rue de Paris, 95100 Argenteuil" }] };

const dossier = fs.mkdtempSync(path.join(os.tmpdir(), "docx-"));
const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block", acceptDownloads: true });
const page = await ctx.newPage();

await page.goto(RACINE + "/index.html");
await page.evaluate(([f, r]) => {
  localStorage.setItem("profil-entreprise", JSON.stringify(f));
  localStorage.setItem("registre-personnel", JSON.stringify(r));
  localStorage.removeItem("gerer-saisie");
}, [FICHE, REGISTRE]);

await page.goto(RACINE + "/gerer.html");
await page.waitForTimeout(1400);
let cles = await page.evaluate(() => Array.prototype.map.call(
  document.querySelectorAll("#liste button[data-doc]"), (b) => b.getAttribute("data-doc")));
if (combien) cles = cles.slice(0, combien);

const fichiers = [];
let fautes = 0, eteints = 0;
for (const cle of cles) {
  await page.goto(RACINE + "/gerer.html");
  await page.waitForTimeout(700);
  /* L'aperçu s'interpose entre le bouton et le fichier : ici, on veut le
     fichier. */
  await page.evaluate(() => { window.Apercu = null; });
  const pret = await page.evaluate(async (k) => {
    const b = document.querySelector('#liste button[data-doc="' + k + '"]');
    if (!b) return false;
    b.click();
    await new Promise((r) => setTimeout(r, 700));
    const n = document.querySelector('#d-champs [data-ch="nom"]');
    if (n) { n.value = "BENALI Karim"; n.dispatchEvent(new Event("input", { bubbles: true })); }
    await new Promise((r) => setTimeout(r, 600));
    const w = document.getElementById("btn-word");
    return !!(w && !w.disabled && !w.hidden);
  }, cle);
  /* Un bouton éteint n'est pas une panne : c'est le cas des lettres de
     procédure tant qu'il leur manque une date ou un lieu, et c'est voulu. */
  if (!pret) { eteints++; continue; }
  const attente = page.waitForEvent("download", { timeout: 8000 }).catch(() => null);
  await page.click("#btn-word");
  const dl = await attente;
  if (!dl) {
    console.log("FAUTE " + cle + " : le bouton Word ne produit aucun fichier");
    fautes++;
    continue;
  }
  const nom = path.join(dossier, cle.replace(/[^A-Za-z0-9-]/g, "_") + ".docx");
  await dl.saveAs(nom);
  fichiers.push([cle, nom]);
}
await nav.close();

/* LA LECTURE PAR PYTHON-DOCX. C'est le même format que Word : l'archive, le
   document principal, ses relations, et le texte des paragraphes. */
const script = `
import sys, zipfile, json, re
from xml.etree import ElementTree
import docx

# Ce qui ne doit jamais figurer dans un fichier qui sort du cabinet, corps et
# proprietes comprises : « un document sort du cabinet, rien n'y indique par
# quoi il est passe ».
INTERDITS = re.compile(r"claude|anthropic|juris.?expert|openpyxl|python-docx|github", re.I)

sortie = []
for cle, chemin in json.load(sys.stdin):
    try:
        z = zipfile.ZipFile(chemin)
        mauvais = z.testzip()
        if mauvais:
            sortie.append([cle, "archive abimee : " + mauvais]); continue
        noms = z.namelist()
        manque = [a for a in ("[Content_Types].xml", "word/document.xml", "_rels/.rels",
                              "docProps/core.xml", "docProps/app.xml") if a not in noms]
        if manque:
            sortie.append([cle, "piece manquante : " + ", ".join(manque)]); continue
        ElementTree.fromstring(z.read("word/document.xml"))
        core = z.read("docProps/core.xml").decode("utf-8", "replace")
        app = z.read("docProps/app.xml").decode("utf-8", "replace")
        trouve = INTERDITS.search(core) or INTERDITS.search(app)
        if trouve:
            sortie.append([cle, "marque d'outil dans les proprietes : " + trouve.group(0)])
            continue
        if "<dc:creator></dc:creator>" in core or "<dc:creator/>" in core:
            sortie.append([cle, "aucun auteur dans les proprietes"]); continue
        if "<Company></Company>" in app or "<Company/>" in app:
            sortie.append([cle, "aucune societe dans les proprietes"]); continue
        d = docx.Document(chemin)
        textes = [p.text for p in d.paragraphs]
        textes += [c.text for t in d.tables for r in t.rows for c in r.cells]
        corps = "\\n".join(textes)
        trouve = INTERDITS.search(corps)
        if trouve:
            sortie.append([cle, "marque d'outil dans le corps : " + trouve.group(0)]); continue
        if len(corps) < 120:
            sortie.append([cle, "document presque vide : %d signes" % len(corps)]); continue
        sortie.append([cle, ""])
    except Exception as e:
        sortie.append([cle, type(e).__name__ + " : " + str(e)[:120]])
print(json.dumps(sortie))
`;
let lus = [];
try {
  const brut = execFileSync("python3", ["-c", script], {
    input: JSON.stringify(fichiers), encoding: "utf8" });
  lus = JSON.parse(brut.trim().split("\n").pop());
} catch (e) {
  console.log("FAUTE : python-docx n'a pas pu lire les fichiers · " +
    String(e.message).slice(0, 200));
  process.exit(2);
}
for (const [cle, dit] of lus) {
  if (!dit) continue;
  console.log("FAUTE " + cle + " : " + dit);
  fautes++;
}
fs.rmSync(dossier, { recursive: true, force: true });
console.log("documents : " + cles.length + " | fichiers Word produits et relus : " +
  fichiers.length + " | boutons éteints : " + eteints + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
