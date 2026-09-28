/* LES QUATRE RÉPONSES SUR LE COMITÉ, SUR TOUS LES ÉCRANS QUI EN DÉPENDENT.

   La contre-vérification du 26 septembre 2026 revient sur ce point module après
   module : « Les quatre parcours sortent identiques avec ou sans CSE », « Page
   du comité sans CSE : elle propose encore convocations, ordres du jour,
   procès-verbaux et règlement intérieur du comité », « BDESE, bouton Non :
   aucune question sur le CSE », « Affichages, sans CSE : la ligne Référent du
   comité social et économique est maintenue », « Sans CSE, la lettre garde
   l'avis du comité ».

   La fiche répond quatre choses, et ce contrôle les essaie toutes sur chaque
   écran concerné :
     - « oui, élu » ;
     - « non, procès-verbal de carence » ;
     - « non, élections en cours d'organisation » ;
     - « non, aucune élection organisée ».

   Ce qu'il refuse, sans comité : un document qui suppose une instance élue, et
   une phrase qui promet un avis ou un procès-verbal que l'entreprise n'a pas.

     node epreuve/verifier-comite.mjs                                        */
let chromium;
try {
  ({ chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs"));
} catch (e) {
  try { ({ chromium } = await import("playwright")); }
  catch (e2) {
    console.log("Playwright est introuvable : " + e2.message);
    process.exit(2);
  }
}

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const RACINE = "http://127.0.0.1:8133";

const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  responsableNom: "Chadi EL SAFADI", responsableQualite: "gérant",
  siret: "53845047900034", effectif: "82", secteur: "transport et logistique",
  conventionCollective: "0016 - transports routiers", ville: "Argenteuil",
  orgPrudhommes: "Argenteuil", delegueSyndical: "non",
  orgInspection: "unité de contrôle du Val-d'Oise, cité administrative, 95000 Cergy",
  orgSanteTravail: "SPSTI du Val-d'Oise, 12 rue de la Gare, 95100 Argenteuil",
};
const REGISTRE = { salaries: [
  { id: "s1", nom: "BENALI", pre: "Karim", emp: "Conducteur poids lourd", ent: "2019-04-02",
    nature: "cdi", sexe: "Masculin", part: "complet" },
  { id: "s2", nom: "KAMARA", pre: "Awa", emp: "Agente de quai", ent: "2020-01-06",
    nature: "cdi", sexe: "Féminin", part: "complet" }] };

/* Les quatre réponses, avec les dates que chacune appelle. */
const REPONSES = [
  { v: "oui, élu", dates: { cseElections: "2024-03-12" }, elu: true },
  { v: "non, procès-verbal de carence", dates: { cseCarence: "2025-11-20" }, elu: false },
  { v: "non, élections en cours d'organisation",
    dates: { cseInfoPersonnel: "2026-09-16", cseReunionNego: "2026-10-05" }, elu: false },
  { v: "non, aucune élection organisée", dates: {}, elu: false },
];

/* Les écrans qui dépendent de la réponse, et ce qu'on y regarde. */
const ECRANS = [
  "audit-cse.html", "auditer.html", "audit-bdese.html", "audit-sst.html",
  "controler-affichages.html", "notes-service.html", "agenda.html", "gerer.html",
];

/* Sans comité, ces tournures ne doivent pas paraître : elles promettent une
   instance, un avis ou un procès-verbal que l'entreprise n'a pas. */
const SANS_COMITE_INTERDIT = [
  [/avis du comité social et économique(?!\s*(?:n'|ne |reste|manque|est impossible))/i,
   "un avis du comité est annoncé"],
];
/* Et ces libellés désignent des documents qui supposent une instance élue. */
const DOCS_DU_COMITE = [
  /^Convocation des réunions/i, /^Ordre du jour/i, /^Procès-verbal des réunions/i,
  /Règlement intérieur du comité/i,
];

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" });
const page = await ctx.newPage();
let erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));

let fautes = 0, vus = 0;
for (const rep of REPONSES) {
  await page.goto(RACINE + "/index.html");
  await page.evaluate(([f, r, c, d]) => {
    localStorage.setItem("profil-entreprise",
      JSON.stringify(Object.assign({}, f, { cseExiste: c }, d)));
    localStorage.setItem("registre-personnel", JSON.stringify(r));
    localStorage.removeItem("gerer-saisie");
  }, [FICHE, REGISTRE, rep.v, rep.dates]);

  for (const ecran of ECRANS) {
    erreurs = [];
    await page.goto(RACINE + "/" + ecran);
    await page.waitForTimeout(1300);
    vus++;
    const r = await page.evaluate(() => ({
      texte: document.body.innerText,
      /* Les libellés proposés : boutons, liens et lignes cliquables. */
      libelles: Array.prototype.map.call(
        document.querySelectorAll("button, a, [data-doc], [data-cle]"),
        (x) => (x.textContent || "").trim()).filter(Boolean),
      large: document.documentElement.scrollWidth > 390,
    }));
    if (erreurs.length) {
      console.log("FAUTE " + rep.v + " · " + ecran + " : erreur JavaScript · " + erreurs.join(" / "));
      fautes++;
    }
    if (r.large) {
      console.log("FAUTE " + rep.v + " · " + ecran + " : débordement horizontal à 390 px");
      fautes++;
    }
    if (rep.elu) continue;
    for (const [re, quoi] of SANS_COMITE_INTERDIT) {
      const m = r.texte.match(re);
      if (!m) continue;
      /* La phrase qui dit qu'il n'y a PAS d'avis est justement ce qu'on veut. */
      const ligne = r.texte.split("\n").filter((l) => re.test(l))[0] || "";
      if (/aucun|sans avis|pas de comité|n'existe pas|carence|à recueillir|impossible|restant/i.test(ligne))
        continue;
      console.log("FAUTE " + rep.v + " · " + ecran + " : " + quoi + " · « " +
        ligne.trim().slice(0, 100) + " »");
      fautes++;
    }
    /* GÉRER GARDE CES DOCUMENTS À DESSEIN : on prépare une première réunion
       avant de l'avoir, et l'écran dit d'où il faut partir. Décision du
       27 septembre 2026, écrite dans gerer.html. Ce qui serait fautif, c'est de
       les proposer SANS le dire : le contrôle vérifie donc l'avertissement, au
       lieu d'interdire la ligne. Ailleurs, la ligne ne doit pas paraître. */
    if (ecran === "gerer.html") {
      const proposes = DOCS_DU_COMITE.filter((re) => r.libelles.some((x) => re.test(x)));
      /* La note prend la forme de la réponse : « aucun comité n'est en place »,
         « votre fiche porte un procès-verbal de carence du … », « vos élections
         sont en cours d'organisation ». Les trois disent la même chose, et la
         première version de ce contrôle n'en connaissait qu'une. Relevé le
         28 septembre 2026 en l'écrivant. */
      const dit = /aucun comité n'est en place|qui n'a pas d'instance|procès-verbal de carence|élections sont en cours d'organisation/i;
      if (proposes.length && !dit.test(r.texte)) {
        console.log("FAUTE " + rep.v + " · " + ecran +
          " : des documents du comité sont proposés sans que l'écran le dise.");
        fautes++;
      }
      continue;
    }
    for (const re of DOCS_DU_COMITE) {
      const l = r.libelles.filter((x) => re.test(x))[0];
      if (!l) continue;
      console.log("FAUTE " + rep.v + " · " + ecran +
        " : un document du comité est proposé sans comité · « " + l.slice(0, 60) + " »");
      fautes++;
    }
  }
}
await nav.close();
console.log("écrans ouverts : " + vus + " (quatre réponses) | fautes : " + fautes);
process.exit(fautes ? 1 : 0);
