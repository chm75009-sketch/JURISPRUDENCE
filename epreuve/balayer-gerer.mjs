/* TOUS LES DOCUMENTS DE GÉRER, OUVERTS UN PAR UN.

   Une variable nommée « de » masquait la fonction de() dans le contrat : le
   document levait « de is not a function » et ne sortait plus du tout, et
   aucune épreuve ne s'en apercevait parce qu'elles ne couvraient que les
   documents de la veille. Relevé le 28 septembre 2026.

   Ce balayage ouvre chaque entrée de la liste, sous deux conventions et sous
   les quatre réponses possibles sur le comité, et il échoue sur la moindre
   erreur JavaScript ou sur un document qui ne produit rien.

     node epreuve/balayer-gerer.mjs                (convention 16)
     node epreuve/balayer-gerer.mjs 1979           (une autre convention)  */
/* Playwright n'est pas installé dans ce dépôt : il vit dans l'installation de
   node du poste. L'import se fait donc par son chemin, et le balayage le dit
   clairement s'il ne le trouve pas. */
let chromium;
try {
  ({ chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs"));
} catch (e) {
  try {
    ({ chromium } = await import("playwright"));
  } catch (e2) {
    console.log("Playwright est introuvable : " + e2.message);
    console.log("Ce balayage a besoin d'un navigateur ; les autres épreuves tournent sans lui.");
    process.exit(2);
  }
}

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const RACINE = "http://127.0.0.1:8133";
const idcc = process.argv[2] || "0016";

const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  responsable: "Chadi EL SAFADI, gérant", responsableNom: "Chadi EL SAFADI",
  responsableQualite: "gérant", siret: "53845047900034", effectif: "82",
  secteur: "transport et logistique", ville: "Argenteuil", orgPrudhommes: "Argenteuil",
  orgInspection: "Unité de contrôle 95-02, 13 boulevard Gambetta, 95100 Argenteuil",
  orgSanteTravail: "CMIE, 9 rue de la Gare, 95100 Argenteuil",
  orgOpco: "OPCO Mobilités", conventionCollective: idcc + " - convention d'essai",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin", qua: "Groupe 7", nais: "1985-03-12", nat: "Française",
    adr: "5 rue des Acacias, 95100 Argenteuil" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin", nais: "1990-01-20", nat: "Française",
    adr: "18 rue de Paris, 95100 Argenteuil" }] };
const CSE = ["oui, élu", "non, élections en cours d'organisation",
  "non, procès-verbal de carence", "non, aucune élection organisée"];

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
const page = await ctx.newPage();
let erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));

let fautes = 0, vus = 0;
for (const cse of CSE) {
  await page.goto(RACINE + "/index.html");
  await page.evaluate(([f, r, c]) => {
    localStorage.setItem("profil-entreprise", JSON.stringify(Object.assign({}, f, { cseExiste: c })));
    localStorage.setItem("registre-personnel", JSON.stringify(r));
    localStorage.removeItem("gerer-saisie");
  }, [FICHE, REGISTRE, cse]);
  await page.goto(RACINE + "/gerer.html");
  await page.waitForTimeout(1400);
  const cles = await page.evaluate(() => Array.prototype.map.call(
    document.querySelectorAll("#liste button[data-doc]"), (b) => b.getAttribute("data-doc")));
  for (const cle of cles) {
    erreurs = [];
    const r = await page.evaluate(async (k) => {
      const b = document.querySelector('#liste button[data-doc="' + k + '"]');
      if (!b) return { absent: true };
      b.click();
      await new Promise((r) => setTimeout(r, 700));
      const n = document.querySelector('#d-champs [data-ch="nom"]');
      if (n) { n.value = "BENALI Karim"; n.dispatchEvent(new Event("input", { bubbles: true })); }
      await new Promise((r) => setTimeout(r, 700));
      const f = document.getElementById("d-feuille");
      const t = document.getElementById("d-tableau");
      const titre = (document.getElementById("d-titre") || {}).textContent || "";
      const refus = /n'est pas produit/.test((document.getElementById("d-avis") || {}).innerText || "");
      return { titre: titre,
        signes: ((f ? f.innerText : "") + (t && !t.hidden ? t.innerText : "")).trim().length,
        refus: refus, large: document.documentElement.scrollWidth > 390 };
    }, cle);
    vus++;
    if (r.absent) { console.log("FAUTE " + cse + " · " + cle + " : entrée introuvable"); fautes++; continue; }
    if (erreurs.length) {
      console.log("FAUTE " + cse + " · " + cle + " (" + r.titre + ") : " + erreurs.join(" / "));
      fautes++;
    }
    /* Un refus motivé est une réponse, pas une panne : il n'est pas compté. */
    if (!r.refus && r.signes < 200) {
      console.log("FAUTE " + cse + " · " + cle + " (" + r.titre + ") : " + r.signes + " signes produits");
      fautes++;
    }
    if (r.large) {
      console.log("FAUTE " + cse + " · " + cle + " (" + r.titre + ") : débordement horizontal");
      fautes++;
    }
    await page.goto(RACINE + "/gerer.html");
    await page.waitForTimeout(700);
  }
}
await nav.close();
console.log("documents ouverts : " + vus + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
