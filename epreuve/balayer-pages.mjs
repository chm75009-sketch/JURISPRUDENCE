/* TOUTES LES PAGES, OUVERTES SUR UN TÉLÉPHONE ET SUR UN ÉCRAN.

   Le balayage le plus simple, et celui qui attrape le plus : chaque page de
   docs/ est ouverte deux fois, à trois cent quatre-vingt-dix points puis à
   mille deux cent quatre-vingts, sur une fiche remplie et un registre de vingt
   salariés. Trois défauts sont refusés : une erreur JavaScript, une erreur
   dans la console, et une page plus large que l'écran.

   Il vivait hors du dépôt, dans un fichier de passage, alors que c'est lui
   qu'on relance après chaque modification : il entre ici le 28 septembre 2026,
   avec les autres.

   Une page qui affiche une date au format informatique est refusée aussi :
   « des dates au format informatique » revient trois fois dans la
   contre-vérification du 26 septembre 2026, et se voit d'un coup d'œil.

     node epreuve/balayer-pages.mjs                                          */
import fs from "node:fs";
import path from "node:path";

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
const racine = path.resolve("docs");
const pages = fs.readdirSync(racine).filter((f) => f.endsWith(".html")).sort();

const FICHE = {
  denomination: "SARL TEC", siret: "53845047900034",
  adresse: "23 avenue du Château, 95100 Argenteuil", ville: "Argenteuil",
  responsableNom: "Chadi EL SAFADI", responsableQualite: "gérant",
  responsable: "Chadi EL SAFADI, gérant", courriel: "direction@tec.example",
  effectif: "82", secteur: "transport et logistique",
  conventionCollective: "0016 - transports routiers", cseExiste: "oui, élu",
  cseElections: "2023-06-15", delegueSyndical: "non",
  orgPrudhommes: "Argenteuil",
  orgInspection: "Unité de contrôle 95-02, 13 boulevard Gambetta, 95100 Argenteuil",
  orgSanteTravail: "CMIE, 9 rue de la Gare, 95100 Argenteuil",
};
const SALARIES = [];
for (let i = 0; i < 20; i++)
  SALARIES.push({ id: "s" + i, nom: "NOM" + i, pre: "Prénom" + i,
    emp: i % 3 ? "Conducteur poids lourd" : "Assistante administrative",
    qua: i % 3 ? "150 M" : "Employée", ent: "2021-05-06", nat: "Française",
    nais: "1990-01-01", nature: "cdi", sexe: i % 2 ? "Masculin" : "Féminin" });

/* Une date au format informatique dans ce qui se lit à l'écran. Les valeurs
   des champs de saisie n'en sont pas : un « input type=date » s'écrit ainsi et
   s'affiche à la française. */
const ISO = /\b20\d\d-\d\d-\d\d\b/;

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
let fautes = 0;
for (const large of [390, 1280]) {
  const ctx = await nav.newContext({ viewport: { width: large, height: 900 },
    serviceWorkers: "block" });
  const p = await ctx.newPage();
  await p.goto(RACINE + "/index.html");
  await p.evaluate(([f, s]) => {
    localStorage.setItem("profil-entreprise", JSON.stringify(f));
    localStorage.setItem("registre-personnel", JSON.stringify({ salaries: s }));
  }, [FICHE, SALARIES]);
  for (const f of pages) {
    const err = [];
    p.removeAllListeners("pageerror");
    p.removeAllListeners("console");
    p.on("pageerror", (e) => err.push("JS : " + e.message));
    p.on("console", (m) => {
      if (m.type() === "error" && !/favicon|404|Failed to load resource/i.test(m.text()))
        err.push("console : " + m.text());
    });
    try {
      await p.goto(RACINE + "/" + f, { waitUntil: "load", timeout: 15000 });
    } catch (e) {
      console.log("FAUTE " + f + " : " + e.message.slice(0, 70));
      fautes++;
      continue;
    }
    await p.waitForTimeout(400);
    const vu = await p.evaluate(() => ({
      deborde: document.documentElement.scrollWidth > window.innerWidth + 2,
      texte: document.body.innerText,
    }));
    if (err.length) {
      console.log("FAUTE " + large + "px " + f + " : " + err.slice(0, 2).join(" ~ ").slice(0, 200));
      fautes++;
    }
    if (vu.deborde) {
      console.log("FAUTE " + large + "px " + f + " : débordement horizontal");
      fautes++;
    }
    const iso = vu.texte.match(ISO);
    if (iso) {
      console.log("FAUTE " + large + "px " + f + " : date au format informatique · « " +
        iso[0] + " »");
      fautes++;
    }
  }
  await ctx.close();
}
await nav.close();
console.log("pages : " + pages.length + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
