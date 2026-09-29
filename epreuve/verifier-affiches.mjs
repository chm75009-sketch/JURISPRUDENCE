/* LES ONZE AFFICHES, PRODUITES ET RELUES.

   Une affiche se pose au mur : ce qu'elle porte, tout le personnel le lit, et
   l'inspection du travail aussi. Elle mérite donc d'être regardée avant d'être
   imprimée, et personne ne le faisait.

   La contre-vérification du 29 septembre 2026 y a trouvé « Fondement :
   R. 4227-38 du code du travail (undefined, lu le 7 septembre 2026) » sur la
   consigne de sécurité incendie : les deux numéros manquaient à la table des
   identifiants, et le mot « undefined » partait au mur.

   Ce contrôle ouvre le relevé des onze affiches, les produit toutes, et refuse
   dans leur texte le mot d'un calcul qui n'a pas eu lieu, la marque d'outil,
   la date au format informatique et le crochet d'une donnée que la fiche
   porte. Il vérifie aussi que chaque article cité porte son identifiant de
   version : un fondement sans LEGIARTI ne prouve rien.

     node epreuve/verifier-affiches.mjs                                     */
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
  orgSanteTravail: "AMETIF Santé au travail, 9 rue de la Gare, 95100 Argenteuil",
  conventionCollective: "0016 - transports routiers", cseExiste: "oui, élu",
};

const INTERDITS = [
  [/\bundefined\b/, "« undefined » sur l'affiche"],
  [/\bNaN\b/, "« NaN » sur l'affiche"],
  [/\b20\d\d-\d\d-\d\d\b/, "date au format informatique"],
  [/Juris Expert|JURISTE-EXPERT|github\.io|claude|anthropic/i, "marque d'outil"],
  [/\[ ?dénomination ?\]|\[VILLE\]|\[DÉNOMINATION/i, "crochet d'une donnée que la fiche porte"],
  [/\bce module\b/i, "l'affiche parle du module"],
];

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block" });
const page = await ctx.newPage();
let erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));

await page.goto(RACINE + "/index.html");
await page.evaluate((f) => localStorage.setItem("profil-entreprise", JSON.stringify(f)), FICHE);
await page.goto(RACINE + "/controler-affichages.html");
await page.waitForTimeout(1300);
/* L'écran s'ouvre sur deux portes : les onze affiches, et le relevé daté.
   C'est la première qui pose les affiches au mur. */
await page.evaluate(() => {
  const b = Array.prototype.filter.call(document.querySelectorAll("button, a"),
    (x) => /onze affiches/i.test(x.textContent || ""))[0];
  if (b) b.click();
});
await page.waitForTimeout(1200);

let fautes = 0;
const r = await page.evaluate(async () => {
  document.querySelectorAll("details").forEach((d) => { d.open = true; });
  await new Promise((r) => setTimeout(r, 400));
  return { texte: document.body.innerText, large: document.documentElement.scrollWidth };
});
if (erreurs.length) {
  console.log("FAUTE relevé : " + erreurs.slice(0, 2).join(" / "));
  fautes++;
}
if (r.large > 390) {
  console.log("FAUTE relevé : débordement horizontal, " + r.large + " points");
  fautes++;
}

/* Chaque affiche est rendue en place, dans son bloc : c'est son texte qu'on
   lit, une par une, pour dire laquelle est en faute. */
const affiches = await page.evaluate(() => Array.prototype.map.call(
  document.querySelectorAll("[data-aff]"),
  (d) => [d.getAttribute("data-aff"), d.innerText]));

for (const [id, t] of affiches) {
  for (const [re, quoi] of INTERDITS) {
    const m = String(t).match(re);
    if (!m) continue;
    console.log("FAUTE " + id + " : " + quoi + " · « " + String(m[0]).trim().slice(0, 60) + " »");
    fautes++;
  }
  /* Un fondement cité sans son identifiant de version ne se retrouve pas. */
  const nus = (String(t).match(/Fondement :[^\n]*/g) || []).filter((l) =>
    /[LRD]\.\s?\d/.test(l) && !/LEGIARTI\d+/.test(l));
  if (nus.length) {
    console.log("FAUTE " + id + " : fondement sans identifiant de version · « " +
      nus[0].slice(0, 100) + " »");
    fautes++;
  }
}

await nav.close();
console.log("affiches produites et relues : " + affiches.length + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
