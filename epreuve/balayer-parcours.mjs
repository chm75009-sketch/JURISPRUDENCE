/* LES PARCOURS GUIDÉS, REMPLIS PUIS LUS.

   Le « non » de l'audit mène ici : une question fermée, puis le document qui
   se construit. Les balayages du dépôt ouvraient les pages au repos, les
   documents du quotidien et les écrans de contrôle avec leur pièce ; les
   parcours, eux, n'étaient regardés qu'à l'arrêt, avant toute réponse.

   Celui-ci répond à toutes les questions d'un parcours, ouvre chacun de ses
   documents et refuse ce qui ne doit pas en sortir : le crochet d'une donnée
   que la fiche porte, la marque d'outil, la date au format informatique, le
   « undefined » d'un calcul qui n'a pas eu lieu, et le débordement au-delà de
   trois cent quatre-vingt-dix points.

     node epreuve/balayer-parcours.mjs                 (tous les parcours)
     node epreuve/balayer-parcours.mjs ri duerp        (ceux-là seulement)   */
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
  orgSanteTravail: "CMIE, 9 rue de la Gare, 95100 Argenteuil",
  orgOpco: "OPCO Mobilités", conventionCollective: "0016 - transports routiers",
  cseExiste: "oui, élu", cseElections: "2023-06-15", delegueSyndical: "oui",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin", qua: "150 M", nais: "1985-03-12", nat: "Française",
    adr: "5 rue des Acacias, 95100 Argenteuil" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin", qua: "Employée", nais: "1990-01-20", nat: "Française",
    adr: "18 rue de Paris, 95100 Argenteuil" }] };

const INTERDITS = [
  [/\bundefined\b/, "« undefined » dans le document"],
  [/\bNaN\b/, "« NaN » dans le document"],
  [/\b20\d\d-\d\d-\d\d\b/, "date au format informatique"],
  [/Fait à \[(lieu|LIEU|VILLE)\]/, "« Fait à [lieu] » alors que la fiche porte la ville"],
  [/\[VILLE\]|\[département\]|\[DÉNOMINATION/, "crochet d'une donnée que la fiche porte"],
  [/\[nom et qualité du (signataire|représentant)/i, "crochet du signataire"],
  [/Juris Expert|JURISTE-EXPERT|github\.io/i, "marque d'outil ou lien vers le dépôt"],
  [/\bce module\b/i, "le document parle du module"],
  [/ne vaut pas (consultation|avis) juridique/i, "avertissement d'origine"],
  [/\bÀ ADAPTER\b/, "bandeau « À ADAPTER »"],
  [/={6,}/, "bandeau de signes égal"],
  [/(?:^|[^\d])1 (?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|janv|févr|avr|juil|sept|oct|nov|déc)\b/, "le premier du mois écrit « 1 » au lieu de « 1er »"],
];

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block" });
const page = await ctx.newPage();
let erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));

await page.goto(RACINE + "/index.html");
await page.evaluate(([f, r]) => {
  localStorage.setItem("profil-entreprise", JSON.stringify(f));
  localStorage.setItem("registre-personnel", JSON.stringify(r));
}, [FICHE, REGISTRE]);

let fautes = 0, docs = 0;
for (const cle of PARCOURS) {
  erreurs = [];
  /* Sans « faire=1 » : ce paramètre vient de l'audit et replie la procédure
     derrière le document qu'il produit aussitôt. Ici on veut la procédure
     entière, ses questions et tous ses documents. */
  await page.goto(RACINE + "/parcours.html?p=" + cle);
  await page.waitForTimeout(1200);

  /* Toutes les questions reçoivent une réponse : « non » aux questions
     fermées, une date d'aujourd'hui aux dates, un nombre aux nombres, et le
     premier choix aux listes. « Non », parce que c'est lui qui construit : un
     « oui » dit que la pièce existe déjà, et le parcours n'a plus de document
     à produire. Ce qui compte n'est pas la justesse de la réponse mais que le
     document se construise sur des données présentes. */
  const remplis = await page.evaluate(() => {
    const jour = new Date().toISOString().slice(0, 10);
    let n = 0;
    document.querySelectorAll("[data-champ]").forEach((e) => {
      if (e.tagName === "SELECT") {
        const opts = Array.prototype.map.call(e.options, (o) => o.value)
          .filter((v) => v && v !== "__autre" && v !== "autre" && v !== "en cours");
        if (!opts.length) return;
        e.value = opts.indexOf("non") >= 0 ? "non" : opts[0];
      } else if (e.type === "date") {
        e.value = jour;
      } else if (e.type === "number") {
        e.value = "2";
      } else {
        if (String(e.value || "").trim()) return;
        e.value = "à préciser";
      }
      e.dispatchEvent(new Event("input", { bubbles: true }));
      e.dispatchEvent(new Event("change", { bubbles: true }));
      n++;
    });
    return n;
  });
  await page.waitForTimeout(900);
  if (erreurs.length) {
    console.log("FAUTE " + cle + " : à la saisie · " + erreurs.slice(0, 2).join(" / "));
    fautes++;
    erreurs = [];
  }

  /* Deux façons d'ouvrir un document selon le parcours : le bouton d'un
     courrier, ou celui d'une pièce du registre des documents produits. Les
     parcours des affichages, du registre et de l'index n'ont que le second, et
     le balayage les disait sans document. Relevé le 28 septembre 2026. */
  const boutons = await page.evaluate(() => Array.prototype.map.call(
    document.querySelectorAll("[data-courrier], button[data-doc]"),
    (b) => b.getAttribute("data-courrier") || ("doc:" + b.getAttribute("data-doc"))));
  /* Le compte rendu se donne au fil de l'eau : un balayage muet pendant dix
     minutes ne dit pas s'il avance ou s'il est arrêté. */
  console.log("  " + cle + " : " + remplis + " réponses, " + boutons.length + " documents");
  if (!boutons.length) {
    console.log("FAUTE " + cle + " : aucun document à produire après " + remplis + " réponses");
    fautes++;
    continue;
  }
  for (const id of boutons) {
    erreurs = [];
    const r = await Promise.race([
      page.evaluate(async (k) => {
      const b = k.indexOf("doc:") === 0
        ? document.querySelector('button[data-doc="' + k.slice(4) + '"]')
        : document.querySelector('[data-courrier="' + k + '"]');
      if (!b) return { absent: true };
      b.click();
      await new Promise((r) => setTimeout(r, 2400));
      const corps = document.getElementById("dt-corps");
      const d = document.getElementById("dlg-courrier");
      const t = corps ? corps.innerText : "";
      if (d && d.close) d.close();
        return { texte: t, signes: t.trim().length,
          large: document.documentElement.scrollWidth };
      }, id),
      new Promise((r) => setTimeout(() => r({ lent: true }), 15000)),
    ]);
    if (r.lent) {
      console.log("FAUTE " + cle + " · " + id + " : la fenêtre ne rend rien en quinze secondes");
      fautes++;
      await page.goto(RACINE + "/parcours.html?p=" + cle);
      await page.waitForTimeout(900);
      continue;
    }
    docs++;
    if (r.absent) continue;
    if (erreurs.length) {
      console.log("FAUTE " + cle + " · " + id + " : " + erreurs.slice(0, 2).join(" / "));
      fautes++;
    }
    if (r.signes < 300) {
      console.log("FAUTE " + cle + " · " + id + " : " + r.signes + " signes produits");
      fautes++;
    }
    if (r.large > 390) {
      console.log("FAUTE " + cle + " · " + id + " : débordement, " + r.large + " points");
      fautes++;
    }
    for (const [re, quoi] of INTERDITS) {
      const m = (r.texte || "").match(re);
      if (!m) continue;
      console.log("FAUTE " + cle + " · " + id + " : " + quoi + " · « " +
        String(m[0]).trim().slice(0, 60) + " »");
      fautes++;
    }
    await page.waitForTimeout(250);
  }
}

await nav.close();
console.log("parcours : " + PARCOURS.length + " | documents ouverts : " + docs +
  " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
