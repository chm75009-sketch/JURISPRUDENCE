/* LES ÉCRANS DE CONTRÔLE, AVEC UNE PIÈCE DÉPOSÉE.

   Les balayages du dépôt ouvrent les pages au repos (epreuve/balayer-pages) et
   les documents du quotidien (epreuve/balayer-gerer). Restait ce qui
   ne se voit qu'après un dépôt : le « Oui » des modules, c'est-à-dire l'écran
   qui lit la pièce de l'entreprise et rend son diagnostic, sa version corrigée
   et ses courriers.

   C'est là que se logeaient trois défauts relevés le 28 septembre 2026 : le
   procès-verbal de désaccord affiché en texte à chasse fixe, le protocole
   préélectoral rendu en un seul pavé avec ses tableaux dessinés au tiret, et
   une colonne de grille qui poussait la page à 578 points de large. Ce
   balayage dépose une pièce dans chaque écran de contrôle, appuie sur le
   bouton, et refuse ce qui ne doit pas sortir.

     node epreuve/balayer-controles.mjs                                      */
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

const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  responsable: "Chadi EL SAFADI, gérant", responsableNom: "Chadi EL SAFADI",
  responsableQualite: "gérant", siret: "53845047900034", effectif: "82",
  secteur: "transport et logistique", ville: "Argenteuil", orgPrudhommes: "Argenteuil",
  orgInspection: "Unité de contrôle 95-02, 13 boulevard Gambetta, 95100 Argenteuil",
  orgSanteTravail: "CMIE, 9 rue de la Gare, 95100 Argenteuil",
  conventionCollective: "0016 - transports routiers", cseExiste: "oui, élu",
  cseElections: "2023-06-15", delegueSyndical: "oui",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin", qua: "150 M", nais: "1985-03-12" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Exploitante", ent: "2021-06-01",
    nature: "cdi", sexe: "Féminin", qua: "Employée", nais: "1990-01-20" }] };

/* Une pièce par écran, courte mais plausible : c'est le texte que le module
   lit, et chacun attend le sien. */
const COMMUN = [
  "SARL TEC, 23 avenue du Château, 95100 Argenteuil.",
  "Document établi le 12 janvier 2026 par Chadi EL SAFADI, gérant.",
  ""].join("\n");
const PIECES = {
  "controler-ri.html": COMMUN + [
    "RÈGLEMENT INTÉRIEUR",
    "",
    "Article 1. Le présent règlement s'applique à l'ensemble du personnel.",
    "Article 2. Les horaires de travail sont affichés dans chaque service.",
    "Article 3. Il est interdit de se présenter au travail en état d'ivresse.",
    "Article 4. Les sanctions applicables sont l'avertissement, la mise à pied,",
    "la mutation, la rétrogradation et le licenciement.",
    "Article 5. Aucun salarié ne peut être sanctionné sans entretien préalable.",
    "Article 6. Le harcèlement moral et le harcèlement sexuel sont interdits.",
    "Article 7. Les équipements de protection individuelle sont obligatoires."].join("\n"),
  "controler-bdese.html": COMMUN + [
    "BASE DE DONNÉES ÉCONOMIQUES, SOCIALES ET ENVIRONNEMENTALES",
    "",
    "1. Investissement social : effectif au 31 décembre 2025, 82 salariés.",
    "2. Investissement matériel et immatériel : parc de 30 poids lourds.",
    "3. Égalité professionnelle entre les femmes et les hommes.",
    "4. Fonds propres et endettement : capitaux propres de 199 000 euros.",
    "5. Rémunération des salariés et des dirigeants.",
    "6. Activités sociales et culturelles.",
    "7. Rémunération des financeurs.",
    "8. Flux financiers à destination de l'entreprise.",
    "9. Conséquences environnementales de l'activité."].join("\n"),
  "controler-duerp.html": COMMUN + [
    "DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS",
    "Version du 12 janvier 2026.",
    "",
    "UNITÉ DE TRAVAIL : QUAI DE CHARGEMENT",
    "Risque : chute de plain-pied. Mesure : sol dégagé et éclairé.",
    "Risque : manutention manuelle. Mesure : transpalette électrique.",
    "",
    "UNITÉ DE TRAVAIL : CONDUITE",
    "Risque : accident de circulation. Mesure : plan de prévention routier.",
    "Risque : vibrations. Mesure : sièges suspendus vérifiés chaque année.",
    "",
    "Le document a été présenté au comité social et économique le 20 janvier 2026."].join("\n"),
  "controler-nao.html": COMMUN + [
    "PROCÈS-VERBAL DE DÉSACCORD",
    "",
    "Négociation annuelle sur la rémunération, réunions des 12 janvier et",
    "3 février 2026. Les salaires effectifs ont été examinés coefficient par",
    "coefficient. La direction a proposé une augmentation générale de 1,5 % au",
    "1er mars 2026 ; la délégation syndicale a demandé 3,2 %.",
    "L'employeur a répondu de manière motivée aux propositions des organisations.",
    "La direction appliquera une mesure unilatérale de +2 % au 1er avril 2026."].join("\n"),
  "controler-cse.html": COMMUN + [
    "PROTOCOLE D'ACCORD PRÉÉLECTORAL",
    "",
    "Entre la société TEC, représentée par son gérant, et les organisations",
    "syndicales représentatives invitées à négocier, il a été convenu ce qui suit.",
    "",
    "Article 1. Le présent protocole règle l'organisation des élections du comité",
    "social et économique de l'entreprise.",
    "Article 2. Le premier tour se tiendra le 12 mai 2026, de 9 heures à 17 heures,",
    "au siège de l'entreprise, et le second tour le 26 mai 2026 aux mêmes heures.",
    "Article 3. Les listes de candidats sont déposées au plus tard le 28 avril 2026.",
    "Article 4. Le vote a lieu à bulletin secret, sous enveloppe.",
    "Article 5. Le dépouillement est public et se tient à la fermeture du scrutin."].join("\n"),
  "controler-egalite.html": COMMUN + [
    "PLAN D'ACTION POUR L'ÉGALITÉ PROFESSIONNELLE",
    "",
    "Domaine 1 : embauche. Objectif : porter à 20 % la part des femmes parmi les",
    "recrutements de conducteurs au 31 décembre 2026.",
    "Domaine 2 : formation. Objectif : ramener à deux points l'écart des taux",
    "d'accès à la formation.",
    "Domaine 3 : rémunération effective. Objectif : supprimer les écarts non",
    "expliqués, enveloppe de 12 000 euros."].join("\n"),
  "controler-discipline.html": COMMUN + [
    "LETTRE DE LICENCIEMENT",
    "",
    "Monsieur, nous vous avons convoqué le 6 octobre 2026 à un entretien préalable",
    "qui s'est tenu le 16 octobre 2026. Nous vous notifions votre licenciement pour",
    "les motifs suivants : trois retards non justifiés les 2, 3 et 4 septembre 2026,",
    "malgré un avertissement du 20 août 2026.",
    "Votre préavis de deux mois commencera à la première présentation de ce",
    "courrier."].join("\n"),
  "controler-mutuelle.html": COMMUN + [
    "DÉCISION UNILATÉRALE DE L'EMPLOYEUR",
    "",
    "L'employeur met en place un régime de remboursement complémentaire de frais",
    "de santé au bénéfice de l'ensemble du personnel, à compter du 1er février 2026.",
    "La cotisation est prise en charge à hauteur de 50 % par l'employeur.",
    "Le régime est collectif et obligatoire. Les dispenses d'adhésion sont celles",
    "prévues par la réglementation."].join("\n"),
  "controler-affichages.html": COMMUN + [
    "RELEVÉ DES AFFICHAGES",
    "",
    "Sont affichés sur le panneau du quai : les horaires de travail, les consignes",
    "de sécurité incendie, l'ordre des départs en congés, la convention collective",
    "applicable, les coordonnées de l'inspection du travail et du service de santé",
    "au travail, ainsi que le texte sur l'égalité de rémunération."].join("\n"),
};

/* CE QUI NE DOIT PAS SORTIR D'UN ÉCRAN DE CONTRÔLE. Les mêmes interdits que
   pour les documents du quotidien, plus ceux qui ne se voient qu'ici. */
const INTERDITS = [
  [/\bundefined\b/, "« undefined » à l'écran"],
  [/\bNaN\b/, "« NaN » à l'écran"],
  [/Fait à \[(lieu|LIEU|VILLE)\]/, "« Fait à [lieu] » alors que la fiche porte la ville"],
  [/\[VILLE\]|\[département\]/, "crochet d'une donnée que la fiche porte"],
  [/\[nom et qualité du (signataire|représentant)/i, "crochet du signataire"],
  [/Juris Expert|JURISTE-EXPERT|github\.io/i, "marque d'outil ou lien vers le dépôt"],
  [/ne vaut pas (consultation|avis) juridique/i, "avertissement d'origine"],
  [/\bÀ ADAPTER\b/, "bandeau « À ADAPTER »"],
  [/={6,}/, "bandeau de signes égal"],
  [/-{12,}/, "règle de tirets au milieu d'un document"],
  [/\ble 1 [a-zéû]/, "« le 1 » au lieu de « le 1er »"],
  [/(?:^|[^A-Za-zÀ-ÿ'’])de [AEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜ]/, "élision manquée après « de »"],
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

let fautes = 0, vus = 0;
for (const [fichier, piece] of Object.entries(PIECES)) {
  erreurs = [];
  vus++;
  await page.goto(RACINE + "/" + fichier);
  await page.waitForTimeout(900);
  const depose = await page.evaluate((txt) => {
    const t = document.querySelector("textarea");
    if (!t) return false;
    t.value = txt;
    t.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }, piece);
  if (!depose) {
    console.log("FAUTE " + fichier + " : aucun champ de dépôt");
    fautes++;
    continue;
  }
  /* Le bouton qui lance le contrôle, et non l'onglet du dépôt : « 1 · Déposer »
     est un onglet, il porte le même mot et il vient avant dans la page. Les
     onglets se reconnaissent à leur « data-o ». */
  const lance = await page.evaluate(() => {
    const cand = Array.prototype.filter.call(document.querySelectorAll("button"),
      (x) => !x.disabled && !x.hasAttribute("data-o") &&
        /^(contrôler|controler|analyser|lire la pièce|déposer)/i.test(
          String(x.textContent || "").trim()));
    if (!cand.length) return "";
    cand[0].click();
    return cand[0].id || cand[0].textContent.trim();
  });
  if (!lance) {
    console.log("FAUTE " + fichier + " : aucun bouton de contrôle");
    fautes++;
    continue;
  }
  await page.waitForTimeout(1400);
  /* Ce qui assemble le document final, là où il faut le demander. */
  await page.evaluate(() => {
    const b = Array.prototype.filter.call(document.querySelectorAll("button"),
      (x) => !x.disabled && /voir le document|assembler|voir la version/i.test(
        String(x.textContent || "")))[0];
    if (b) b.click();
  });
  await page.waitForTimeout(900);
  /* Chaque onglet est visité, et son contenu compte : un écran qui se lit en
     trois onglets ne se juge pas sur le dernier. Les replis s'ouvrent. */
  const onglets = await page.evaluate(() => Array.prototype.map.call(
    document.querySelectorAll("[data-o]"), (b, i) => i).length);
  let texte = "", large = 0;
  for (let i = 0; i <= onglets; i++) {
    if (i > 0) {
      await page.evaluate((k) => {
        const b = document.querySelectorAll("[data-o]")[k - 1];
        if (b && !b.disabled) b.click();
      }, i);
      await page.waitForTimeout(600);
    }
    await page.evaluate(() => {
      document.querySelectorAll("details").forEach((d) => { d.open = true; });
    });
    await page.waitForTimeout(250);
    const bout = await page.evaluate(() => ({
      t: document.body.innerText, l: document.documentElement.scrollWidth }));
    texte += "\n" + bout.t;
    large = Math.max(large, bout.l);
  }
  const r = { texte: texte, large: large };
  if (erreurs.length) {
    console.log("FAUTE " + fichier + " : " + erreurs.slice(0, 2).join(" / "));
    fautes++;
  }
  if (r.large > 390) {
    console.log("FAUTE " + fichier + " : débordement horizontal, " + r.large + " points");
    fautes++;
  }
  if (r.texte.trim().length < 400) {
    console.log("FAUTE " + fichier + " : " + r.texte.trim().length + " signes après le dépôt");
    fautes++;
  }
  for (const [re, quoi] of INTERDITS) {
    const m = r.texte.match(re);
    if (!m) continue;
    console.log("FAUTE " + fichier + " : " + quoi + " · « " +
      String(m[0]).trim().slice(0, 60) + " »");
    fautes++;
  }
}

await nav.close();
console.log("écrans de contrôle : " + vus + " | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
