/* LE CONTRAT DU TRANSPORT, D'UN SALARIÉ À L'AUTRE.

   C'est le document que le client vient chercher le plus souvent, et c'est
   celui qui porte le plus de données : le poste, le coefficient, le taux
   conventionnel, la durée d'équivalence, l'accord au féminin, le titre de
   travail. Il se remplit depuis le registre, et il se remplit aussi à la
   main. Les deux chemins n'étaient jamais essayés l'un après l'autre.

   La contre-vérification du 29 septembre 2026 y a trouvé qu'après avoir
   choisi COULIBALY, entré en 2004, le formulaire repassé « à la main »
   gardait sa date d'entrée : le contrat d'un nouvel embauché sortait « à
   compter du 1er mars 2004 ». Le vidage existait, il n'était pas enregistré.

   Ce contrôle choisit un poste, passe d'un salarié à l'autre, revient à la
   saisie à la main, et vérifie qu'aucune donnée du précédent ne survit, dans
   l'écran comme sur le poste. Il refuse aussi toute erreur JavaScript : le
   même écran en jetait une quand on choisissait un salarié avant le poste.

     node epreuve/verifier-contrats-transport.mjs                          */
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
  { id: "s1", nom: "COULIBALY", pre: "Siramana", emp: "Conducteur poids lourd",
    ent: "2004-03-01", nature: "cdi", sexe: "Masculin", qua: "150 M",
    nais: "1975-02-02", nat: "Française", adr: "5 rue des Acacias, 95100 Argenteuil" },
  { id: "s2", nom: "ZENNADI", pre: "Naïma", emp: "Conductrice poids lourd",
    ent: "2021-06-01", nature: "cdi", sexe: "Féminin", qua: "138 M",
    nais: "1988-02-26", nat: "Française" }] };

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

let fautes = 0;
function faute(m) { console.log("FAUTE " + m); fautes++; }

/* ---- 1. un salarié choisi avant le poste ne casse rien ---------------- */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1400);
erreurs = [];
await page.evaluate(async () => {
  const sel = document.getElementById("salarie");
  if (sel) { sel.value = "0"; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  await new Promise((r) => setTimeout(r, 600));
});
if (erreurs.length) faute("un salarié choisi avant le poste : " + erreurs[0].slice(0, 90));

/* ---- 2. le poste, puis un salarié, puis la saisie à la main ----------- */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1200);
erreurs = [];
const r = await page.evaluate(async () => {
  const p = document.querySelectorAll("#profils button");
  if (!p.length) return { sansProfil: true };
  p[0].click();
  await new Promise((x) => setTimeout(x, 900));
  const sel = document.getElementById("salarie");
  if (!sel) return { sansListe: true };
  const val = (c) => {
    const e = document.querySelector('[data-c="' + c + '"]');
    return e ? String(e.value || "") : "";
  };
  sel.value = "0"; sel.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((x) => setTimeout(x, 800));
  const un = { nom: val("nom"), entree: val("entree"), naissance: val("naissance") };
  sel.value = "1"; sel.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((x) => setTimeout(x, 800));
  const deux = { nom: val("nom"), entree: val("entree"), naissance: val("naissance"),
    adresse: val("adresse") };
  sel.value = ""; sel.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((x) => setTimeout(x, 800));
  const main = { nom: val("nom"), entree: val("entree"), naissance: val("naissance") };
  let garde = null;
  for (const k of Object.keys(localStorage)) {
    if (!/contrat/i.test(k)) continue;
    try {
      const o = JSON.parse(localStorage.getItem(k));
      if (o && typeof o === "object" && ("entree" in o || "nom" in o)) garde = o;
    } catch (e) {}
  }
  return { un: un, deux: deux, main: main, garde: garde };
});

if (r.sansProfil) faute("aucun poste à choisir sur l'écran des contrats");
else if (r.sansListe) faute("aucune liste de salariés sur l'écran des contrats");
else {
  const jour = new Date().toISOString().slice(0, 10);
  console.log("  COULIBALY : " + r.un.nom + " · entrée " + r.un.entree);
  console.log("  ZENNADI   : " + r.deux.nom + " · entrée " + r.deux.entree);
  console.log("  à la main : « " + r.main.nom + " » · entrée " + r.main.entree);
  if (r.un.entree !== "2004-03-01")
    faute("la date d'entrée de COULIBALY n'est pas reprise du registre : " + r.un.entree);
  /* ZENNADI n'a pas d'adresse au registre : celle de COULIBALY ne doit pas
     rester sur sa fiche. */
  if (r.deux.adresse) faute("l'adresse du salarié précédent reste sur le suivant : « " +
    r.deux.adresse + " »");
  if (r.deux.entree !== "2021-06-01")
    faute("la date d'entrée de ZENNADI n'est pas reprise : " + r.deux.entree);
  if (r.main.nom) faute("le nom du salarié précédent reste sur la saisie à la main : « " +
    r.main.nom + " »");
  if (r.main.naissance)
    faute("la naissance du salarié précédent reste sur la saisie à la main");
  if (r.main.entree !== jour)
    faute("la saisie à la main garde une date d'entrée du salarié précédent : " + r.main.entree);
  if (r.garde && r.garde.entree && r.garde.entree !== jour)
    faute("ce qui est enregistré sur le poste garde la date d'avant : " + r.garde.entree);
  if (r.garde && r.garde.nom)
    faute("ce qui est enregistré sur le poste garde le nom d'avant : « " + r.garde.nom + " »");
}
if (erreurs.length) faute("erreur JavaScript : " + erreurs[0].slice(0, 110));

/* ---- 3. une entrée passée, hors registre : retard, pas régularisation ----

   Un nouvel embauché saisi à la main, entré la veille, recevait un « contrat de
   régularisation » et s'entendait dire qu'il n'y avait « ni période d'essai, ni
   déclaration préalable à l'embauche ». Hors du registre, la date passée est un
   retard de formalités : l'écran le dit, le contrat ne l'écrit pas.           */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1200);
erreurs = [];
const h = await page.evaluate(async () => {
  const p = document.querySelectorAll("#profils button");
  if (!p.length) return { sansProfil: true };
  p[0].click();
  await new Promise((x) => setTimeout(x, 900));
  const sel = document.getElementById("salarie");
  if (sel) { sel.value = ""; sel.dispatchEvent(new Event("change", { bubbles: true })); }
  await new Promise((x) => setTimeout(x, 700));
  const pose = (c, v) => {
    const e = document.querySelector('[data-c="' + c + '"]');
    if (!e) return false;
    e.value = v;
    e.dispatchEvent(new Event("input", { bubbles: true }));
    e.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };
  const hier = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  pose("nom", "MARTIN Lucie");
  pose("entree", hier);
  await new Promise((x) => setTimeout(x, 700));
  const a = document.getElementById("alerte-dpae");
  const CT = window.ContratsTransport;
  /* Le titre se lit sur les blocs du contrat, tel que le module l'écrirait :
     l'écran ne le montre qu'après le bouton, et c'est le titre qui dit si
     l'acte ouvre la relation ou la régularise. */
  let v = {};
  try { v = JSON.parse(localStorage.getItem("contrats-transport") || "{}") || {}; } catch (e) {}
  v.profil = (document.querySelector("#profils button[data-p]") || {}).dataset
    ? document.querySelector("#profils button[data-p]").dataset.p : "";
  v.entreprise = JSON.parse(localStorage.getItem("profil-entreprise") || "{}");
  const sur = (CT.ecrire(v) || [])
    .filter((b) => b.k === "sur").map((b) => b.t).join(" ");
  return {
    alerte: a && !a.classList.contains("cache") ? (a.textContent || "").trim() : "",
    titre: sur,
  };
});
if (h.sansProfil) faute("aucun poste à choisir au troisième essai");
else {
  if (!/Contrat de travail/i.test(h.titre))
    faute("le contrat n'a pas de titre au troisième essai : « " + h.titre + " »");
  if (!/déclaration préalable à l'embauche est en retard/i.test(h.alerte))
    faute("entrée passée hors registre : aucune alerte sur la déclaration préalable");
  if (/régularisation d'une relation de travail en cours/i.test(h.titre))
    faute("entrée passée hors registre : le contrat s'intitule « régularisation » (" +
      h.titre.slice(0, 90) + ")");
}
if (erreurs.length) faute("erreur JavaScript au troisième essai : " + erreurs[0].slice(0, 110));

/* ---- 4. le salarié du registre, entré en 2004, reste une régularisation -- */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1200);
const q = await page.evaluate(async () => {
  const p = document.querySelectorAll("#profils button");
  if (!p.length) return { sansProfil: true };
  p[0].click();
  await new Promise((x) => setTimeout(x, 900));
  const sel = document.getElementById("salarie");
  if (!sel) return { sansListe: true };
  sel.value = "0"; sel.dispatchEvent(new Event("change", { bubbles: true }));
  await new Promise((x) => setTimeout(x, 900));
  const a = document.getElementById("alerte-dpae");
  const CT = window.ContratsTransport;
  /* Le titre se lit sur les blocs du contrat, tel que le module l'écrirait :
     l'écran ne le montre qu'après le bouton, et c'est le titre qui dit si
     l'acte ouvre la relation ou la régularise. */
  let v = {};
  try { v = JSON.parse(localStorage.getItem("contrats-transport") || "{}") || {}; } catch (e) {}
  v.profil = (document.querySelector("#profils button[data-p]") || {}).dataset
    ? document.querySelector("#profils button[data-p]").dataset.p : "";
  v.entreprise = JSON.parse(localStorage.getItem("profil-entreprise") || "{}");
  const sur = (CT.ecrire(v) || [])
    .filter((b) => b.k === "sur").map((b) => b.t).join(" ");
  return { alerte: a && !a.classList.contains("cache"), titre: sur };
});
if (!q.sansProfil && !q.sansListe) {
  if (q.alerte)
    faute("un salarié du registre entré en 2004 reçoit l'alerte de déclaration préalable");
  if (!/régularisation d'une relation de travail en cours/i.test(q.titre))
    faute("un salarié du registre entré en 2004 ne sort plus en régularisation (" +
      q.titre.slice(0, 90) + ")");
}

/* ---- 5. les tournures interdites, dans le contrat lui-même ---------------

   verifier-marques.mjs passe les 224 générateurs de documents-*.js ; le module
   du transport n'en fait pas partie, et c'est lui qui écrit le contrat le plus
   souvent produit. « Taux conventionnels appliqués ci-dessus : ceux de Accord
   du 11 octobre 2023 » a donc traversé tous les contrôles. Relevé le
   29 septembre 2026. Le contrat, son annexe et la note hors contrat passent
   désormais les mêmes interdits.                                           */
const INTERDITS = [
  [/\bundefined\b/, "« undefined » dans le contrat"],
  [/\bNaN\b/, "« NaN » dans le contrat"],
  [/Juris Expert|JURISTE-EXPERT|juris-expert/i, "nom d'un autre outil"],
  [/github\.(io|com)/i, "lien vers le dépôt"],
  [/\bce module\b/i, "le contrat parle du module"],
  [/cette application/i, "le contrat parle de l'application"],
  [/lue?s? à la source/i, "« lu à la source » dans le contrat"],
  [/\bÀ ADAPTER\b/, "bandeau « À ADAPTER »"],
  [/[\u2013\u2014]/, "tiret cadratin ou demi-cadratin"],
  [/\b20\d\d-\d\d-\d\d\b/, "date au format informatique"],
  [/(?:^|[^A-Za-zÀ-ÿ'’])de (?!onze\b|onzième|un\b|une\b|huit\b)([AEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜaeiouyàâäéèêëîïôöùûü])/,
    "élision manquée après « de »"],
  [/\bdocument\(s\)|\bsalarié\(s\)|\bligne\(s\)/, "pluriel entre parenthèses"],
];
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1200);
const textes = await page.evaluate(async () => {
  const CT = window.ContratsTransport;
  const out = [];
  let v = {};
  try { v = JSON.parse(localStorage.getItem("contrats-transport") || "{}") || {}; } catch (e) {}
  v.entreprise = JSON.parse(localStorage.getItem("profil-entreprise") || "{}");
  /* Chaque profil de poste, en contrat à durée indéterminée puis déterminée :
     les clauses changent d'un profil à l'autre, et la note hors contrat
     aussi. */
  for (const p of CT.PROFILS) {
    for (const nature of ["cdi", "cdd"]) {
      const w = Object.assign({}, v, { profil: p.cle, nature: nature,
        motif: "accroissement temporaire d'activité", terme: "2027-01-15" });
      const bouts = [];
      const lis = (B) => (B || []).forEach((b) => {
        if (b && typeof b.t === "string") bouts.push(b.t);
        if (b && b.titre) bouts.push(b.titre);
        if (b && b.head) bouts.push(b.head.join(" "));
        if (b && b.rows) b.rows.forEach((r) => bouts.push(r.join(" ")));
      });
      try { lis(CT.ecrire(w)); } catch (e) { bouts.push("ERREUR ecrire : " + e.message); }
      try { lis(CT.reserve ? CT.reserve(w) : []); } catch (e) {}
      try { lis(CT.formalites ? CT.formalites(w) : []); } catch (e) {}
      out.push([p.cle + "/" + nature, bouts.join("\n")]);
    }
  }
  return out;
});
let vus = {};
for (const [quoi, texte] of textes) {
  if (/^ERREUR ecrire/m.test(texte)) {
    faute(quoi + " : " + (texte.match(/^ERREUR ecrire.*/m) || [])[0]);
    continue;
  }
  for (const [re, dit] of INTERDITS) {
    const m = texte.match(re);
    if (!m) continue;
    if (vus[dit]) continue;
    vus[dit] = true;
    const ligne = (texte.split("\n").filter((l) => re.test(l))[0] || m[0]).trim();
    faute(quoi + " : " + dit + " · « " + ligne.slice(0, 110) + " »");
  }
}
console.log("  contrats relus : " + textes.length);

await nav.close();
console.log("contrats du transport : fautes " + fautes);
process.exit(fautes ? 1 : 0);
