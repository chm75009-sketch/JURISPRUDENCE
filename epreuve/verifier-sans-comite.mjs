/* CE QUE L'APPLICATION NE DOIT PAS PROPOSER QUAND IL N'Y A PAS DE COMITÉ,
   ET LE BOUTON DE DÉPÔT EN FRANÇAIS.

   Quatre défauts relevés le 29 septembre 2026 sur le site du client, et
   quatre contrôles pour qu'ils ne reviennent pas :

     1. l'écran du quotidien offrait « Convocation du CSE », « Ordre du jour »
        et « Procès-verbal » à une entreprise dont la fiche répond « non,
        élections en cours d'organisation » ;
     2. les notes de service proposaient la note « Comité social et
        économique : information », qui nomme les élus et leurs heures de
        délégation, à la même entreprise ;
     3. le contrôle du document unique montrait le champ nu du navigateur,
        « Choose File / No file chosen », en anglais et sans mise en forme ;
     4. le parcours de la sanction citait en exemple la convention collective
        du commerce de détail, alors que la fiche porte le transport.

   Les trois réponses « non » de la fiche sont essayées, puis la réponse
   « oui, élu » pour vérifier qu'on n'a pas tout coupé.

     node epreuve/verifier-sans-comite.mjs                                  */
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
  conventionCollective: "0016 - transports routiers", delegueSyndical: "oui",
};

const SANS = ["non, élections en cours d'organisation", "non, procès-verbal de carence",
  "non, aucune élection organisée"];
const CSE_TITRES = ["Convocation du CSE", "Ordre du jour", "Procès-verbal"];

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block" });
const page = await ctx.newPage();
let fautes = 0;
function faute(m) { console.log("FAUTE " + m); fautes++; }

async function poserFiche(rep) {
  await page.goto(RACINE + "/index.html");
  await page.evaluate((f) => localStorage.setItem("profil-entreprise", JSON.stringify(f)),
    Object.assign({}, FICHE, { cseExiste: rep }));
}

/* ---- 1. l'écran du quotidien ---------------------------------------- */
for (const rep of SANS.concat(["oui, élu"])) {
  await poserFiche(rep);
  await page.goto(RACINE + "/gerer.html");
  await page.waitForTimeout(1100);
  const vus = await page.evaluate(() => Array.prototype.map.call(
    document.querySelectorAll("#liste .doc-ligne"), (b) => b.textContent.trim()));
  const presents = CSE_TITRES.filter((t) => vus.indexOf(t) >= 0);
  const doitEtreLa = rep.indexOf("oui") === 0;
  if (doitEtreLa && presents.length !== CSE_TITRES.length)
    faute("gerer, « " + rep + " » : le comité est en place et il manque " +
      CSE_TITRES.filter((t) => presents.indexOf(t) < 0).join(", "));
  if (!doitEtreLa && presents.length)
    faute("gerer, « " + rep + " » : " + presents.join(", ") + " proposé sans comité");
  if (!vus.length) faute("gerer, « " + rep + " » : la liste est vide");
  console.log("  gerer · " + rep + " : " + vus.length + " documents, " +
    presents.length + " du comité");
}

/* ---- 2. les notes de service ---------------------------------------- */
for (const rep of SANS.concat(["oui, élu"])) {
  await poserFiche(rep);
  await page.goto(RACINE + "/notes-service.html");
  await page.waitForTimeout(1100);
  const r = await page.evaluate(() => {
    const t = Array.prototype.filter.call(document.querySelectorAll("[data-theme], .theme, button"),
      (b) => /Personnel et repr/i.test(b.textContent || ""))[0];
    if (t) t.click();
    return new Promise((res) => setTimeout(() => res(Array.prototype.map.call(
      document.querySelectorAll("#e-notes button, #e-notes .note-ligne"),
      (b) => b.textContent.trim())), 700));
  });
  const cse = r.filter((x) => /Comité social et économique/i.test(x));
  const doitEtreLa = rep.indexOf("oui") === 0;
  if (doitEtreLa && !cse.length)
    faute("notes, « " + rep + " » : le comité est en place et sa note a disparu");
  if (!doitEtreLa && cse.length)
    faute("notes, « " + rep + " » : « " + cse[0] + " » proposée sans comité");
  console.log("  notes · " + rep + " : " + r.length + " entrées, " + cse.length + " du comité");
}

/* ---- 3. le bouton de dépôt ------------------------------------------ */
const PAGES_DEPOT = ["controler-duerp.html", "equipe.html", "flotte.html", "heures.html",
  "questions.html", "controler-ri.html", "controler-cse.html"];
await poserFiche("oui, élu");
for (const p of PAGES_DEPOT) {
  await page.goto(RACINE + "/" + p);
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const nus = Array.prototype.filter.call(document.querySelectorAll('input[type="file"]'),
      (e) => getComputedStyle(e).display !== "none" && !e.hidden);
    return { nus: nus.length, habilles: document.querySelectorAll(".champ-fichier").length,
      champs: document.querySelectorAll('input[type="file"]').length };
  });
  if (r.nus) faute(p + " : " + r.nus + " champ(s) de dépôt laissé(s) nu(s), en anglais");
  console.log("  dépôt · " + p + " : " + r.champs + " champs, " + r.habilles + " habillés, " +
    r.nus + " nus");
}

/* ---- 4. l'exemple du parcours de la sanction ------------------------ */
await page.goto(RACINE + "/index.html");
const mauvais = await page.evaluate(async () => {
  const src = ["documents-produits.js", "documents-discipline.js", "documents-discipline-2.js"];
  for (const f of src) {
    await new Promise((res) => {
      const s = document.createElement("script");
      s.src = f; s.onload = res; s.onerror = res;
      document.head.appendChild(s);
    });
  }
  const DP = window.DocumentsProduits;
  const g = DP && DP.tous && DP.tous["DIS-CTL-SAN-12"];
  if (!g || typeof g.produire !== "function") return { absent: true };
  const ctx = { profil: { denomination: "SARL TEC", effectif: "82",
    conventionCollective: "0016 - transports routiers",
    adresse: "23 avenue du Château, 95100 Argenteuil" }, fiche: {}, donnees: {} };
  const brut = g.produire(ctx);
  const t = Array.isArray(brut) ? brut.join("\n") : String(brut || "");
  return { signes: t.length, commerce: /commerce de d[ée]tail/i.test(t),
    convention: /0016|transports routiers/.test(t) };
});
if (mauvais.absent) faute("sanction : le registre des documents ne s'est pas chargé");
else {
  if (mauvais.commerce) faute("sanction, DIS-CTL-SAN-12 : l'exemple cite le commerce de détail");
  if (!mauvais.convention)
    faute("sanction, DIS-CTL-SAN-12 : la convention de la fiche n'est pas reprise");
  console.log("  sanction · DIS-CTL-SAN-12 : " + mauvais.signes + " signes");
}

await nav.close();
console.log("sans comité, dépôt et exemple : fautes " + fautes);
process.exit(fautes ? 1 : 0);
