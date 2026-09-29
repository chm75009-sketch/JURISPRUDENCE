/* LES FICHIERS WORD DES PARCOURS, OUVERTS POUR DE BON.

   verifier-docx.mjs fait ce travail pour les documents du quotidien. Les
   parcours guidés, eux, produisent leurs fichiers autrement : le texte vient
   des parties du document, et c'est parcours.js qui en retire l'exemple avant
   de le passer au générateur Word. Personne n'avait rouvert ces fichiers-là.

   La contre-vérification du 29 septembre 2026 y a trouvé, sous l'en-tête du
   client, l'entreprise fictive au complet : « TRANSPORTS EXEMPLE SARL »,
   « Madame Isabelle PONS », « Monsieur Éric DUVAL, gérant », et un document
   unique signé « Fait à Lagny-sur-Marne » avec vingt occurrences de FERRAND.
   Le bandeau « À ADAPTER » et les titres « - EXEMPLE » survivaient aussi.

   Ce contrôle ouvre les quinze parcours, produit le Word de chaque document,
   et rouvre chaque fichier avec python-docx : l'archive, ses parties, les
   propriétés, et le texte du corps, où rien de l'exemple ne doit rester.

     node epreuve/verifier-docx-parcours.mjs              (tous)
     node epreuve/verifier-docx-parcours.mjs ri nao       (ceux-là)          */
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

const TOUS = ["ri", "duerp", "affichages", "registre", "bdese", "nao", "index",
  "installation", "reunion", "commissions", "sanction", "embauche", "entretiens",
  "conges", "findecontrat"];
const demandes = process.argv.slice(2).filter((x) => TOUS.indexOf(x) >= 0);
const PARCOURS = demandes.length ? demandes : TOUS;

const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  responsable: "Chadi EL SAFADI, gérant", responsableNom: "Chadi EL SAFADI",
  responsableQualite: "gérant", siret: "53845047900034", effectif: "82",
  secteur: "transport et logistique", ville: "Argenteuil", orgPrudhommes: "Argenteuil",
  orgInspection: "Unité de contrôle 95-02, 13 boulevard Gambetta, 95100 Argenteuil",
  orgSanteTravail: "AMETIF Santé au travail, 9 rue de la Gare, 95100 Argenteuil",
  conventionCollective: "0016 - transports routiers",
  cseExiste: "non, procès-verbal de carence", cseCarence: "2025-03-10",
  delegueSyndical: "non",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin", qua: "150 M", nais: "1985-03-12", nat: "Française",
    adr: "5 rue des Acacias, 95100 Argenteuil" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin", qua: "Employée", nais: "1990-01-20", nat: "Française",
    adr: "18 rue de Paris, 95100 Argenteuil" }] };

const dossier = fs.mkdtempSync(path.join(os.tmpdir(), "docxp-"));
const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block", acceptDownloads: true });
const page = await ctx.newPage();

await page.goto(RACINE + "/index.html");
await page.evaluate(([f, r]) => {
  localStorage.setItem("profil-entreprise", JSON.stringify(f));
  localStorage.setItem("registre-personnel", JSON.stringify(r));
}, [FICHE, REGISTRE]);

const fichiers = [];
let fautes = 0, eteints = 0;
for (const cle of PARCOURS) {
  await page.goto(RACINE + "/parcours.html?p=" + cle);
  await page.waitForTimeout(1200);
  /* L'aperçu s'interpose entre le bouton et le fichier : ici, on veut le
     fichier, comme dans verifier-docx.mjs. */
  await page.evaluate(() => { window.Apercu = null; });
  const boutons = await page.evaluate(() => Array.prototype.map.call(
    document.querySelectorAll("[data-courrier], button[data-doc]"),
    (b) => b.getAttribute("data-courrier") || ("doc:" + b.getAttribute("data-doc"))));
  console.log("  " + cle + " : " + boutons.length + " documents");
  for (const id of boutons) {
    const ouvert = await page.evaluate(async (k) => {
      const b = k.indexOf("doc:") === 0
        ? document.querySelector('button[data-doc="' + k.slice(4) + '"]')
        : document.querySelector('[data-courrier="' + k + '"]');
      if (!b) return false;
      b.click();
      await new Promise((r) => setTimeout(r, 2200));
      const w = document.getElementById("dt-word") || document.getElementById("btn-word");
      return !!(w && !w.disabled && !w.hidden);
    }, id);
    if (!ouvert) { eteints++; await page.goto(RACINE + "/parcours.html?p=" + cle);
      await page.waitForTimeout(800);
      await page.evaluate(() => { window.Apercu = null; }); continue; }
    const quel = await page.evaluate(() =>
      document.getElementById("dt-word") ? "#dt-word" : "#btn-word");
    const attente = page.waitForEvent("download", { timeout: 9000 }).catch(() => null);
    await page.click(quel);
    const dl = await attente;
    if (!dl) {
      console.log("FAUTE " + cle + " · " + id + " : le bouton Word ne produit aucun fichier");
      fautes++;
    } else {
      const nom = path.join(dossier, (cle + "-" + id).replace(/[^A-Za-z0-9-]/g, "_") + ".docx");
      await dl.saveAs(nom);
      fichiers.push([cle + " · " + id, nom]);
    }
    await page.goto(RACINE + "/parcours.html?p=" + cle);
    await page.waitForTimeout(800);
    await page.evaluate(() => { window.Apercu = null; });
  }
}
await nav.close();

const script = `
import sys, zipfile, json, re
from xml.etree import ElementTree
import docx

OUTIL = re.compile(r"claude|anthropic|juris.?expert|openpyxl|python-docx|github", re.I)
# Les gens et les lieux de l'exemple : ils appartiennent a une entreprise
# fictive, et rien d'eux ne doit survivre sous l'en-tete du client.
FICTIONS = re.compile(
    r"TRANSPORTS EXEMPLE|EXEMPLE SARL|Isabelle PONS|Eric DUVAL|\\u00c9ric DUVAL|Marc TISSIER|"
    r"FERRAND|Lagny-sur-Marne|Seine-et-Marne|transports-exemple", re.I)
BANDEAU = re.compile(r"^\\s*(\\u00c0 ADAPTER|A ADAPTER|EXEMPLE\\b)", re.M)
TITRE_EX = re.compile(r"- EXEMPLE\\s*$", re.M)

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
        t = OUTIL.search(core) or OUTIL.search(app)
        if t:
            sortie.append([cle, "marque d'outil dans les proprietes : " + t.group(0)]); continue
        d = docx.Document(chemin)
        textes = [p.text for p in d.paragraphs]
        textes += [c.text for tb in d.tables for r in tb.rows for c in r.cells]
        corps = "\\n".join(textes)
        t = OUTIL.search(corps)
        if t:
            sortie.append([cle, "marque d'outil dans le corps : " + t.group(0)]); continue
        t = FICTIONS.search(corps)
        if t:
            sortie.append([cle, "l'exemple fictif est dans le fichier : " + t.group(0)]); continue
        t = BANDEAU.search(corps)
        if t:
            sortie.append([cle, "bandeau de l'exemple : " + corps[t.start():t.start()+90].replace(chr(10)," ")]); continue
        t = TITRE_EX.search(corps)
        if t:
            sortie.append([cle, "titre de l'exemple : " + t.group(0).strip()]); continue
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
console.log("parcours : " + PARCOURS.length + " | fichiers Word produits et relus : " +
  fichiers.length + " | boutons éteints : " + eteints + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
