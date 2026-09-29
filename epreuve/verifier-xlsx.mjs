/* LES CLASSEURS, OUVERTS POUR DE BON.

   Même geste que pour les fichiers Word : l'application écrit ses .xlsx à la
   main, dans tableur-export.js, et personne ne les avait rouverts autrement
   qu'en regardant l'aperçu. La contre-vérification du 26 septembre 2026 range
   d'ailleurs « l'ouverture dans Word et Excel réels » parmi ce qu'elle n'a pas
   pu vérifier, et reproche aux classeurs du client leur créateur « openpyxl »,
   leurs dates en texte et leurs onglets tronqués.

   Ce contrôle produit les classeurs des écrans qui en ont un, les capte, et
   les rouvre avec openpyxl : l'archive, les onglets, leurs noms, leur contenu
   et les propriétés du fichier. Un classeur qu'openpyxl refuse est un classeur
   qu'Excel refusera.

     node epreuve/verifier-xlsx.mjs                                          */
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
    adr: "5 rue des Acacias, 95100 Argenteuil", nat: "Française" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin", qua: "Employée", nais: "1990-01-20",
    adr: "18 rue de Paris, 95100 Argenteuil", nat: "Française" }] };

/* Les écrans qui produisent un classeur, et le bouton qui le produit. Chaque
   entrée dit où aller et ce qu'il faut presser ; le reste est commun. */
const ECRANS = [
  { page: "registre.html", bouton: /excel|classeur|tableur/i },
  { page: "flotte.html", bouton: /excel|classeur|tableur/i },
  { page: "forfait.html", bouton: /excel|classeur|tableur/i },
  { page: "heures.html", bouton: /excel|classeur|tableur/i },
  { page: "parcours.html?p=bdese&faire=1", bouton: /excel|classeur|tableur/i,
    avant: '[data-courrier], button[data-doc]' },
  { page: "parcours.html?p=duerp&faire=1", bouton: /excel|classeur|tableur/i,
    avant: '[data-courrier], button[data-doc]' },
  /* LES DEUX CLASSEURS DE LA BASE DE DONNÉES, ET PAS SEULEMENT CELUI DU
     PARCOURS. La contre-vérification du 29 septembre 2026 en a ouvert un
     second, produit par l'audit, dont les propriétés étaient vides : openpyxl
     y lisait alors son propre nom en auteur. */
  { page: "parcours.html?p=registre&faire=1", bouton: /excel|classeur|tableur/i,
    avant: '[data-courrier], button[data-doc]' },
];

const dossier = fs.mkdtempSync(path.join(os.tmpdir(), "xlsx-"));
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
let fautes = 0;
for (const e of ECRANS) {
  await page.goto(RACINE + "/" + e.page);
  await page.waitForTimeout(1800);
  await page.evaluate(() => { window.Apercu = null; });
  if (e.avant) {
    /* Le document d'un parcours se charge à la demande : le bouton du classeur
       n'existe qu'une fois la fenêtre ouverte et le générateur descendu. On
       attend qu'il paraisse plutôt qu'un délai fixe. */
    await page.evaluate((sel) => {
      const b = document.querySelector(sel);
      if (b) b.click();
    }, e.avant);
    await page.waitForFunction(
      (src) => {
        const re = new RegExp(src, "i");
        return Array.prototype.some.call(document.querySelectorAll("button"),
          (x) => !x.disabled && !x.hidden && re.test(String(x.textContent || "")));
      }, e.bouton.source, { timeout: 12000 }).catch(() => null);
    await page.waitForTimeout(700);
  }
  const trouve = await page.evaluate((src) => {
    const re = new RegExp(src, "i");
    const b = Array.prototype.filter.call(document.querySelectorAll("button"),
      (x) => !x.disabled && !x.hidden && re.test(String(x.textContent || "")))[0];
    if (!b) return "";
    b.click();
    return b.textContent.trim();
  }, e.bouton.source);
  if (!trouve) {
    console.log("FAUTE " + e.page + " : aucun bouton de classeur");
    fautes++;
    continue;
  }
  let dl = await page.waitForEvent("download", { timeout: 9000 }).catch(() => null);
  /* UN CLIC TROP TÔT N'EST PAS UN BOUTON EN PANNE.

     Le registre et le forfait construisent leur liste après le chargement :
     le premier clic tombait parfois avant, et le contrôle criait au défaut
     sur une page saine. Relevé le 29 septembre 2026. On laisse la page finir
     et l'on réessaie une fois ; deux échecs, c'est une panne. */
  if (!dl) {
    await page.waitForTimeout(1500);
    const attente = page.waitForEvent("download", { timeout: 9000 }).catch(() => null);
    await page.evaluate((src) => {
      const re = new RegExp(src, "i");
      const b = Array.prototype.filter.call(document.querySelectorAll("button"),
        (x) => !x.disabled && !x.hidden && re.test(String(x.textContent || "")))[0];
      if (b) b.click();
    }, e.bouton.source);
    dl = await attente;
  }
  if (!dl) {
    console.log("FAUTE " + e.page + " : « " + trouve + " » ne produit aucun fichier, deux essais");
    fautes++;
    continue;
  }
  const nom = path.join(dossier, e.page.replace(/[^A-Za-z0-9-]/g, "_") + ".xlsx");
  await dl.saveAs(nom);
  fichiers.push([e.page, nom]);
}
await nav.close();

const script = `
import sys, zipfile, json, re
from openpyxl import load_workbook

INTERDITS = re.compile(r"claude|anthropic|juris.?expert|openpyxl|github", re.I)

sortie = []
for cle, chemin in json.load(sys.stdin):
    try:
        z = zipfile.ZipFile(chemin)
        mauvais = z.testzip()
        if mauvais:
            sortie.append([cle, "archive abimee : " + mauvais]); continue
        manque = [a for a in ("[Content_Types].xml", "xl/workbook.xml", "_rels/.rels",
                              "docProps/core.xml") if a not in z.namelist()]
        if manque:
            sortie.append([cle, "piece manquante : " + ", ".join(manque)]); continue
        core = z.read("docProps/core.xml").decode("utf-8", "replace")
        trouve = INTERDITS.search(core)
        if trouve:
            sortie.append([cle, "marque d'outil dans les proprietes : " + trouve.group(0)])
            continue
        if "<dc:creator></dc:creator>" in core or "<dc:creator/>" in core:
            sortie.append([cle, "aucun auteur dans les proprietes"]); continue
        # UN CLASSEUR SANS STYLE PAR DEFAUT N'EST PAS UN CLASSEUR FINI.
        # openpyxl le dit en toutes lettres a la lecture : « Workbook contains
        # no default style ». Releve le 29 septembre 2026.
        if "xl/styles.xml" not in z.namelist():
            sortie.append([cle, "aucune feuille de styles : Excel applique les siens"]); continue
        styles = z.read("xl/styles.xml").decode("utf-8", "replace")
        if "cellStyleXfs" not in styles:
            sortie.append([cle, "aucun style par defaut dans xl/styles.xml"]); continue
        w = load_workbook(chemin, data_only=True)
        if not w.sheetnames:
            sortie.append([cle, "classeur sans onglet"]); continue
        trop = [n for n in w.sheetnames if len(n) > 31]
        if trop:
            sortie.append([cle, "nom d'onglet trop long : " + trop[0]]); continue
        cases = 0
        # UNE DATE ÉCRITE EN TEXTE NE SE TRIE PAS ET NE SE CALCULE PAS.
        # « Flotte, Excel : dates en texte » : liste du 26 septembre 2026. Une
        # case dont tout le contenu est « 12/01/2026 » est une date perdue ;
        # une phrase qui contient une date n'en est pas une.
        entexte = None
        jour = re.compile(r"^\\s*\\d{1,2}/\\d{1,2}/\\d{4}\\s*$")
        for f in w.worksheets:
            for ligne in f.iter_rows(values_only=True):
                cases += sum(1 for v in ligne if v not in (None, ""))
                for v in ligne:
                    if isinstance(v, str) and jour.match(v) and entexte is None:
                        entexte = f.title + " : " + v
        if entexte:
            sortie.append([cle, "date ecrite en texte, " + entexte]); continue
        if cases < 6:
            sortie.append([cle, "classeur presque vide : %d cases" % cases]); continue
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
  console.log("FAUTE : openpyxl n'a pas pu lire les classeurs · " +
    String(e.message).slice(0, 200));
  process.exit(2);
}
for (const [cle, dit] of lus) {
  if (!dit) continue;
  console.log("FAUTE " + cle + " : " + dit);
  fautes++;
}
fs.rmSync(dossier, { recursive: true, force: true });
console.log("classeurs produits et relus : " + fichiers.length + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
