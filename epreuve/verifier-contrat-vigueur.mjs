/* LE MONTANT PORTÉ À LA MAIN ARRIVE-T-IL JUSQU'AU CONTRAT ?

   verifier-ccn-vigueur.mjs essaie le magasin : ce qui est saisi s'y garde et
   s'en ressort. Il ne dit rien du contrat. Or c'est là que le risque est : un
   champ rempli par l'utilisateur et que le générateur ne lit pas donne le plus
   mauvais des deux mondes, un écran qui promet un montant à jour et un
   document qui sort l'ancien. La faute existait déjà pour la prime de nuit,
   « 20 % » écrit en clair à côté de la donnée qui le portait.

   Ce contrôle prend le profil du grand routier, parce qu'il porte à lui seul
   les quatre familles de montants : la garantie annuelle, les frais de
   déplacement, la prime de nuit et la garantie d'amplitude. Il écrit le
   contrat sans rien saisir, note les montants du code, puis saisit les onze
   montants sous la référence d'un avenant, réécrit le contrat, et vérifie
   pour chacun que le nouveau montant est là, que l'ancien n'y est plus, et
   que la référence de l'avenant accompagne le montant.

     node epreuve/verifier-contrat-vigueur.mjs                              */
let chromium;
try {
  ({ chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs"));
} catch (e) {
  try { ({ chromium } = await import("playwright")); }
  catch (e2) { console.log("Playwright est introuvable : " + e2.message); process.exit(2); }
}

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const RACINE = "http://127.0.0.1:8133";
const AVENANT = "avenant n° 82 du 3 décembre 2026";

const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  responsable: "Chadi EL SAFADI, gérant", responsableNom: "Chadi EL SAFADI",
  responsableQualite: "gérant", siret: "53845047900034", effectif: "82",
  secteur: "transport et logistique", ville: "Argenteuil",
  conventionCollective: "0016 - transports routiers",
};
/* Des montants volontairement éloignés de ceux du code : si l'un d'eux
   ressort inchangé, c'est que le générateur ne l'a pas lu. */
const SAISIE = {
  garantieAnnuelle: "41000", repas: "17,40", repasUnique: "11,05",
  repasUniqueNuit: "10,60", casseCroute: "9,15", speciale: "4,30",
  grandDeplacement1: "63,20", grandDeplacement2: "79,40",
  nuitTaux: "22", amplitudePart: "80", amplitudePlafond: "3",
};

const nav = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const ctx = await nav.newContext({ viewport: { width: 390, height: 844 },
  serviceWorkers: "block" });
const page = await ctx.newPage();
let erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));

let fautes = 0;
function faute(m) { console.log("FAUTE " + m); fautes++; }

await page.goto(RACINE + "/index.html");
await page.evaluate((f) => localStorage.setItem("profil-entreprise", JSON.stringify(f)), FICHE);

/* Le contrat du grand routier, écrit deux fois : avant et après la saisie. */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1400);
const r = await page.evaluate(async ([saisie, avenant]) => {
  const bouton = document.querySelector('#profils button[data-p="grand"]')
    || document.querySelector("#profils button[data-p]");
  if (!bouton) return { sansProfil: true };
  const cle = bouton.dataset.p;
  bouton.click();
  await new Promise((x) => setTimeout(x, 900));
  const V = window.CcnVigueur;
  if (!V) return { sansModule: true };

  function contrat() {
    let v = {};
    try { v = JSON.parse(localStorage.getItem("contrats-transport") || "{}") || {}; } catch (e) {}
    v.profil = cle;
    v.entreprise = JSON.parse(localStorage.getItem("profil-entreprise") || "{}");
    const B = window.ContratsTransport.ecrire(v) || [];
    return B.map((b) => {
      if (b.k === "table")
        return (b.head || []).join(" | ") + "\n" +
          (b.rows || []).map((l) => l.join(" | ")).join("\n");
      return String(b.t || "");
    }).join("\n");
  }

  /* Rien de saisi : on part du magasin vide, sans quoi un essai précédent du
     même navigateur fausserait la comparaison. */
  V.CHAMPS.forEach((c) => V.poser(c.c, "", ""));
  V.poserSource("");
  const avant = contrat();

  V.poserSource(avenant);
  Object.keys(saisie).forEach((k) => V.poser(k, saisie[k]));
  const apres = contrat();
  const combien = V.combien();

  /* Et une fois tout effacé, le contrat doit redevenir exactement le premier :
     la saisie ne laisse pas de trace quand on la retire. */
  V.CHAMPS.forEach((c) => V.poser(c.c, "", ""));
  V.poserSource("");
  const rendu = contrat();

  return { cle: cle, avant: avant, apres: apres, rendu: rendu, combien: combien };
}, [SAISIE, AVENANT]);

if (r.sansProfil) faute("aucun poste à choisir sur l'écran des contrats");
else if (r.sansModule) faute("window.CcnVigueur est absent de l'écran des contrats");
else {
  console.log("  profil essayé : " + r.cle + " · contrat de " + r.avant.length +
    " caractères, puis " + r.apres.length);

  /* 1. ce qui est saisi doit figurer au contrat ---------------------------- */
  const ATTENDU = [
    ["la garantie annuelle", "41 000,00"],
    ["l'indemnité de repas", "17,40"],
    ["le repas unique", "11,05"],
    ["le repas unique de nuit", "10,60"],
    ["le casse-croûte", "9,15"],
    ["l'indemnité spéciale", "4,30"],
    ["le grand déplacement, 1 repas", "63,20"],
    ["le grand déplacement, 2 repas", "79,40"],
    ["le taux de la prime de nuit", "égale à 22 %"],
    ["la part des amplitudes", "inférieure à 80 %"],
    ["le plafond des amplitudes", "plus de 3 heures"],
  ];
  ATTENDU.forEach(([quoi, texte]) => {
    if (r.apres.indexOf(texte) === -1)
      faute(quoi + " n'arrive pas au contrat : « " + texte + " » introuvable");
  });

  /* 1 bis. la garantie saisie s'explique, même sans coefficient ------------

     Sans coefficient renseigné, le salaire était relevé au douzième du montant
     saisi et la phrase qui dit de quelle garantie il s'agit n'était pas écrite.
     Elle doit l'être, avec la référence de l'avenant, et sans coefficient vide
     laissé en plan. */
  const phraseGar = r.apres.split("\n").filter(
    (l) => /garantie annuelle de rémunération/.test(l))[0] || "";
  if (!phraseGar)
    faute("la garantie saisie relève le salaire sans que le contrat dise laquelle");
  else {
    if (phraseGar.indexOf("41 000,00") === -1)
      faute("la phrase de la garantie ne porte pas le montant saisi : « " +
        phraseGar.slice(0, 130) + " »");
    if (phraseGar.indexOf(AVENANT) === -1)
      faute("la phrase de la garantie ne porte pas la référence de l'avenant : « " +
        phraseGar.slice(0, 130) + " »");
  }
  if (/coefficient\s*[.,]/.test(r.apres))
    faute("un coefficient vide reste en plan au contrat : « " +
      (r.apres.match(/.{0,60}coefficient\s*[.,].{0,30}/) || [""])[0] + " »");

  /* 2. les montants du code ne doivent plus y être ------------------------- */
  const PARTIS = [
    ["l'indemnité de repas du code", "16,36"],
    ["le taux de nuit du code", "égale à 20 %"],
    ["la part d'amplitude du code", "inférieure à 75 %"],
    ["le plafond d'amplitude du code", "plus de 63 heures"],
  ];
  PARTIS.forEach(([quoi, texte]) => {
    if (r.avant.indexOf(texte) === -1)
      faute(quoi + " n'était pas au contrat avant la saisie : « " + texte +
        " ». Le repère a changé, l'épreuve est à reprendre.");
    else if (r.apres.indexOf(texte) !== -1)
      faute(quoi + " survit à la saisie : « " + texte + " » est encore au contrat");
  });

  /* 3. la référence de l'avenant accompagne chaque montant saisi ----------- */
  const combien = (t, m) => t.split(m).length - 1;
  const n = combien(r.apres, AVENANT);
  console.log("  la référence de l'avenant paraît " + n + " fois");
  if (n < 9)
    faute("la référence de l'avenant n'accompagne que " + n + " montants sur onze");
  /* Et la source du code ne doit plus signer un montant qu'elle ne porte plus. */
  const ligneRepas = r.apres.split("\n").filter((l) => /^Repas \|/.test(l))[0] || "";
  if (!/avenant n° 82/.test(ligneRepas))
    faute("la ligne du repas ne porte pas la référence saisie : « " + ligneRepas + " »");
  if (/Avenant n° 81/.test(ligneRepas))
    faute("la ligne du repas porte encore la référence du code : « " + ligneRepas + " »");
  /* Le casse-croûte est saisi lui aussi : sa ligne doit suivre. */
  const ligneCasse = r.apres.split("\n").filter((l) => /^Casse-croûte \|/.test(l))[0] || "";
  if (!/avenant n° 82/.test(ligneCasse))
    faute("la ligne du casse-croûte ne suit pas la saisie : « " + ligneCasse + " »");

  /* 4. tout effacé, le contrat redevient le premier ----------------------- */
  if (r.rendu !== r.avant) {
    const l1 = r.avant.split("\n"), l2 = r.rendu.split("\n");
    let ou = "longueurs " + l1.length + " et " + l2.length;
    for (let i = 0; i < Math.max(l1.length, l2.length); i++)
      if (l1[i] !== l2[i]) { ou = "ligne " + (i + 1) + " : « " + String(l2[i]).slice(0, 110) + " »"; break; }
    faute("la saisie effacée laisse une trace au contrat (" + ou + ")");
  }
  if (r.combien !== 11)
    faute("les onze montants saisis ne sont pas comptés : " + r.combien);
}
if (erreurs.length) faute("erreur JavaScript : " + erreurs[0].slice(0, 120));

/* ---- 5. la garantie saisie plus basse que le calcul horaire --------------

   L'autre branche de la même phrase, celle qui rappelle la garantie sans
   relever le salaire. Elle citait l'accord du 11 octobre 2023 même quand le
   montant venait d'une saisie : le contrat attribuait à un accord un chiffre
   qui n'y est pas. Le 1er octobre 2026.                                     */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1300);
erreurs = [];
const bas = await page.evaluate(async (avenant) => {
  const bouton = document.querySelector('#profils button[data-p="grand"]')
    || document.querySelector("#profils button[data-p]");
  if (!bouton) return { sansProfil: true };
  bouton.click();
  await new Promise((x) => setTimeout(x, 900));
  const V = window.CcnVigueur;
  V.CHAMPS.forEach((c) => V.poser(c.c, "", ""));
  V.poserSource(avenant);
  V.poser("garantieAnnuelle", "20000");
  let v = {};
  try { v = JSON.parse(localStorage.getItem("contrats-transport") || "{}") || {}; } catch (e) {}
  v.profil = bouton.dataset.p;
  v.entreprise = JSON.parse(localStorage.getItem("profil-entreprise") || "{}");
  const T = (window.ContratsTransport.ecrire(v) || []).map((b) => String(b.t || "")).join("\n");
  V.CHAMPS.forEach((c) => V.poser(c.c, "", ""));
  V.poserSource("");
  return { phrase: T.split("\n").filter((l) => /ne peut être inférieure à la garantie/.test(l))[0] || "",
    releve: /qui est le montant de la garantie annuelle rapporté au mois/.test(T) };
}, AVENANT);

if (bas.sansProfil) faute("aucun poste à choisir au cinquième essai");
else {
  if (bas.releve)
    faute("une garantie plus basse que le calcul horaire relève quand même le salaire");
  if (!bas.phrase)
    faute("une garantie saisie plus basse que le calcul horaire n'est pas rappelée au contrat");
  else {
    console.log("  le rappel : « " + bas.phrase.slice(0, 120) + "… »");
    if (bas.phrase.indexOf("20 000,00") === -1)
      faute("le rappel ne porte pas la garantie saisie : « " + bas.phrase.slice(0, 130) + " »");
    if (bas.phrase.indexOf(AVENANT) === -1)
      faute("le rappel ne porte pas la référence de l'avenant : « " + bas.phrase.slice(0, 140) + " »");
    if (/accord du 11 octobre 2023/.test(bas.phrase))
      faute("le rappel attribue la garantie saisie à l'accord du 11 octobre 2023 : « " +
        bas.phrase.slice(0, 140) + " »");
  }
}
if (erreurs.length) faute("erreur JavaScript au cinquième essai : " + erreurs[0].slice(0, 120));

/* ---- 6. un seul des deux chiffres de l'amplitude porté à la main --------

   La phrase de l'amplitude porte deux chiffres, le pourcentage et le plafond
   d'heures, et une seule parenthèse pour les deux. Quand un seul est saisi,
   l'autre reste celui du code : la parenthèse unique attribuait alors à
   l'avenant saisi un chiffre qui n'y figure pas.                            */
await page.goto(RACINE + "/contrats-transport.html");
await page.waitForTimeout(1300);
erreurs = [];
const amp = await page.evaluate(async (avenant) => {
  const bouton = document.querySelector('#profils button[data-p="grand"]');
  if (!bouton) return { sansProfil: true };
  bouton.click();
  await new Promise((x) => setTimeout(x, 900));
  const V = window.CcnVigueur;
  function phrase() {
    let v = {};
    try { v = JSON.parse(localStorage.getItem("contrats-transport") || "{}") || {}; } catch (e) {}
    v.profil = "grand";
    v.entreprise = JSON.parse(localStorage.getItem("profil-entreprise") || "{}");
    return (window.ContratsTransport.ecrire(v) || []).map((b) => String(b.t || ""))
      .filter((l) => /amplitudes journalières cumulées/.test(l))[0] || "";
  }
  V.CHAMPS.forEach((c) => V.poser(c.c, "", ""));
  V.poserSource(avenant);
  V.poser("amplitudePart", "80");
  const seul = phrase();
  V.poser("amplitudePlafond", "3");
  const deux = phrase();
  V.CHAMPS.forEach((c) => V.poser(c.c, "", ""));
  V.poserSource("");
  return { seul: seul, deux: deux };
}, AVENANT);

if (amp.sansProfil) faute("le profil du grand routier a disparu au sixième essai");
else {
  if (!amp.seul) faute("la phrase de l'amplitude est introuvable");
  else {
    if (amp.seul.indexOf("80 %") === -1)
      faute("le pourcentage saisi n'arrive pas à la phrase de l'amplitude");
    if (amp.seul.indexOf("63 heures") === -1)
      faute("le plafond du code devrait rester : « " + amp.seul.slice(-120) + " »");
    if (amp.seul.indexOf("pour le pourcentage") === -1 ||
        amp.seul.indexOf("pour le plafond") === -1)
      faute("un seul chiffre saisi : les deux origines ne sont pas distinguées · « " +
        amp.seul.slice(-150) + " »");
    if (!/accord/i.test(amp.seul))
      faute("un seul chiffre saisi : l'accord d'origine du plafond n'est plus cité · « " +
        amp.seul.slice(-150) + " »");
  }
  /* Les deux saisis sous le même avenant : une seule mention, pas deux. */
  if (amp.deux) {
    if (amp.deux.indexOf("pour le pourcentage") !== -1)
      faute("les deux chiffres saisis sous le même avenant : la mention est dédoublée · « " +
        amp.deux.slice(-140) + " »");
    if (amp.deux.split(AVENANT).length - 1 !== 1)
      faute("les deux chiffres saisis : l'avenant n'est pas cité une fois et une seule");
  }
}
if (erreurs.length) faute("erreur JavaScript au sixième essai : " + erreurs[0].slice(0, 120));

await nav.close();
console.log("contrat et montants en vigueur : fautes " + fautes);
process.exit(fautes ? 1 : 0);
