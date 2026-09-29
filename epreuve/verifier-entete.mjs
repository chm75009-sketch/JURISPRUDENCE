/* LE RAPPEL DE L'ENTREPRISE, UNE FOIS PAR PAGE.

   barre.js pose « SARL TEC · 82 salariés » en tête des pages qui ne le disent
   pas. Certaines le disaient déjà, à leur façon et mieux, puisqu'elles
   connaissent le registre : « SARL TEC · 85 inscrits · 82 en poste ». Le
   rappel venait alors par-dessus, et la même chose se lisait deux fois.
   Relevé le 29 septembre 2026 sur l'agenda, l'accueil, le registre, deux
   audits, les sept parcours, les modèles et le contrôle des affichages.

   Ce contrôle ouvre les pages et compte, en tête de chacune, les lignes qui
   commencent par la dénomination. Plus d'une, c'est une faute.

     node epreuve/verifier-entete.mjs                                       */
import fs from "node:fs";

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
  secteur: "transport et logistique", ville: "Argenteuil",
  conventionCollective: "0016 - transports routiers", cseExiste: "oui, élu",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin" }] };

const PARCOURS = ["ri", "duerp", "bdese", "nao", "index", "installation", "reunion"];
const pages = fs.readdirSync("docs").filter((f) => /\.html$/.test(f)).sort()
  .map((f) => "/" + f)
  .concat(PARCOURS.map((p) => "/parcours.html?p=" + p));

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block" });
const page = await ctx.newPage();

await page.goto(RACINE + "/index.html");
await page.evaluate(([f, r]) => {
  localStorage.setItem("profil-entreprise", JSON.stringify(f));
  localStorage.setItem("registre-personnel", JSON.stringify(r));
}, [FICHE, REGISTRE]);

let fautes = 0, vues = 0;
for (const u of pages) {
  await page.goto(RACINE + u);
  await page.waitForTimeout(700);
  const n = await page.evaluate((nom) => {
    /* Les lignes de tête : celles du bandeau et les premières du corps. Une
       ligne de tableau ou une carte de salarié n'est pas un rappel. */
    const zones = document.querySelectorAll(
      "header.site p, header.site div, header.site span, main > p, main > div, main > section > p");
    const vus = [];
    for (let i = 0; i < zones.length && i < 40; i++) {
      const e = zones[i];
      if (e.querySelector("p, div, section, table, ul")) continue;
      /* Une section repliée porte son texte sans le montrer : ce qui compte
         est ce que l'utilisatrice lit, pas ce que le document contient. */
      if (!e.offsetParent && getComputedStyle(e).position !== "fixed") continue;
      const t = String(e.textContent || "").trim();
      if (t.length > 200) continue;
      if (t.indexOf(nom) === 0 && /salari|inscrit|effectif/i.test(t)) vus.push(t);
    }
    return vus;
  }, FICHE.denomination);
  vues++;
  if (n.length > 1) {
    console.log("FAUTE " + u + " : le rappel de l'entreprise est écrit " + n.length +
      " fois · « " + n.slice(0, 2).join(" » puis « ") + " »");
    fautes++;
  }
}

await nav.close();
console.log("pages : " + vues + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
