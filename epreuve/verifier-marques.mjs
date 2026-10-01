/* CE QUI NE DOIT PAS SORTIR DU CABINET, CHERCHÉ DANS TOUS LES DOCUMENTS.

   La contre-vérification du 26 septembre 2026 relève, ligne après ligne, les
   mêmes fautes dans des modules différents : une marque d'outil, une phrase qui
   parle du module au lieu de parler au client, un crochet resté là où la fiche
   porte la donnée, une élision manquée, un « undefined » dans un document
   produit au nom de l'entreprise.

   Les relever à la main dans deux cent vingt-quatre générateurs ne tient pas :
   ce contrôle produit chaque document deux fois, sur une fiche complète puis
   sur une fiche vide, et refuse les tournures qui n'ont rien à y faire. Il ne
   juge pas le fond : il cherche des chaînes, et chacune vient d'une ligne de la
   liste.

     node epreuve/verifier-marques.mjs
     node epreuve/verifier-marques.mjs --lister     (les documents concernés)  */
import fs from "fs";
import path from "path";
import vm from "vm";

const racine = path.resolve("docs");
const lister = process.argv.includes("--lister");

/* La fiche d'une entreprise réelle, complète : sur celle-là, aucun crochet de
   donnée connue n'est admis. */
const FICHE = {
  denomination: "SARL TEC", adresse: "23 avenue du Château, 95100 Argenteuil",
  siret: "53845047900034", effectif: "82", secteur: "transport et logistique",
  conventionCollective: "0016 - transports routiers",
  responsableNom: "Chadi EL SAFADI", responsableQualite: "gérant",
  courriel: "direction@tec.example", telephone: "01 39 00 00 00", ville: "Argenteuil",
  cseExiste: "oui, élu", cseElections: "2024-03-12", delegueSyndical: "non",
  orgPrudhommes: "Argenteuil", orgInspection: "unité de contrôle du Val-d'Oise, cité administrative, 95000 Cergy",
  orgSanteTravail: "SPSTI du Val-d'Oise, 12 rue de la Gare, 95100 Argenteuil",
  orgRetraite: "AG2R, 14 rue Auber, 75009 Paris", orgPrevoyance: "Klesia, 4 rue Marx Dormoy, 75018 Paris",
  orgSante: "Malakoff Humanis, 21 rue Laffitte, 75009 Paris",
  orgUrssaf: "URSSAF Île-de-France, 93518 Montreuil Cedex",
  orgOpco: "OPCO Mobilités, 34 avenue de l'Opéra, 75002 Paris",
  transRegistreNum: "2026951234567", transLicenceType: "licence communautaire",
  transLicenceNum: "2026/95/000123", transLicenceFin: "2030-06-30", transCopies: "30",
  transGestionnaire: "Chadi EL SAFADI", transGestionnaireLien: "dirigeant",
  transAttestation: "95-2019-000456", transCapitaux: "199000", transExercice: "2025-12-31",
};

/* Chaque interdit porte la ligne de la liste qui l'a fait inscrire. Les
   exceptions sont nommées, jamais devinées : un document qui a une raison de
   porter la tournure est cité avec son motif. */
const INTERDITS = [
  { re: /\bundefined\b/, quoi: "« undefined » dans un document produit",
    dit: "Affichages : la consigne incendie citait « (undefined, lu le 7 septembre 2026) »." },
  { re: /\bNaN\b/, quoi: "« NaN » dans un document produit", dit: "Un calcul sans donnée." },
  { re: /Juris Expert|JURISTE-EXPERT|juris-expert/i, quoi: "nom d'un autre outil",
    dit: "Marques d'outil : le lien github, le nom Juris Expert." },
  { re: /github\.io|github\.com/i, quoi: "lien vers le dépôt",
    dit: "Liens vers l'extérieur : des renvois vers le dépôt." },
  { re: /\bce module\b/i, quoi: "le document parle du module",
    dit: "Marques d'outil : « n'ont pas été lus à la source par ce module »." },
  /* « pris pour l'application de L. 2315-54 » est du français juste : ce qui est
     interdit, c'est que le document parle de lui-même. Relevé le 28 septembre
     2026 en écrivant ce contrôle. */
  { re: /cette application|l'application (ne |n'|sait|propose|écrit|lit|calcule|produit)/i,
    quoi: "le document parle de l'application",
    dit: "BDESE, avis d'actualisation : le mot « l'application » y figure." },
  { re: /ne vaut pas (consultation|avis) juridique/i, quoi: "avertissement d'origine",
    dit: "Marques d'outil : l'avertissement sur la valeur du document." },
  { re: /\bÀ ADAPTER\b/, quoi: "bandeau « À ADAPTER » dans un document",
    dit: "Documents égalité, NAO, CSE : le bandeau « À ADAPTER »." },
  /* Le participe s'accorde : « lue », « lues », « lus ». La première version
     ne refusait que « lu » et « lus », et « n'ont pas été lues à la source »
     passait. Relevé le 28 septembre 2026. */
  { re: /lue?s? à la source/i, quoi: "« lu à la source » dans un document",
    dit: "Marques d'outil : la mention de la lecture à la source." },
  /* Le « \b » de l'expression régulière ne vaut rien devant une lettre
     accentuée : « procède en » contient « de en », et la première version de ce
     contrôle relevait « de l'article » dans une phrase juste. Il faut refuser
     explicitement toute lettre avant le « de ». Relevé le 28 septembre 2026 en
     écrivant ce contrôle. */
  /* « de onze salariés » ne s'élide pas, et « AAAAA » est le nom de l'entreprise
     fictive des exemples. Relevé le 28 septembre 2026 en écrivant ce contrôle. */
  { re: /(?:^|[^A-Za-zÀ-ÿ'’])de (?!onze\b|onzième|un\b|une\b|huit\b|AAAAA)([AEIOUYÀÂÄÉÈÊËÎÏÔÖÙÛÜaeiouyàâäéèêëîïôöùûü])/,
    quoi: "élision manquée après « de »",
    dit: "Lettres : « de Argenteuil », « de Assistante »." },
  { re: /(?:^|[^\d])1 (?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|janv|févr|avr|juil|sept|oct|nov|déc)\b/, quoi: "le premier du mois écrit « 1 » au lieu de « 1er »",
    dit: "Heures, divers : on lit « le 1 » au lieu de « le 1er »." },
  { re: /\bdocument\(s\)|\bsalarié\(s\)|\bligne\(s\)/, quoi: "pluriel entre parenthèses",
    dit: "Mes documents : on lit « 2 document(s) »." },
  /* « Des dates au format informatique » : le reproche revient trois fois dans
     la liste, sur le registre en Word, sur les classeurs et sur l'agenda. Une
     date se lit « 28 septembre 2026 » ou « 28/09/2026 », jamais « 2026-09-28 ».
     Ajouté le 28 septembre 2026 ; aucun générateur n'en portait, et c'est
     précisément ce qu'il faut tenir. */
  { re: /\b20\d\d-\d\d-\d\d\b/, quoi: "date au format informatique",
    dit: "Registre, Word : « des dates au format informatique »." },
  { re: /HUISSIER DE JUSTICE|huissier de justice/, quoi: "« huissier de justice »",
    dit: "Courriers : « huissier de justice » au lieu de commissaire de justice." },
];

/* LES CROCHETS QUE LA FICHE COMPLÈTE REMPLIT.

   Attention à ce qu'on interdit : « à [lieu] » dans une convocation désigne la
   salle de réunion, que la fiche ne connaît pas, et c'est un crochet légitime.
   Ce qui ne l'est pas, c'est le lieu de SIGNATURE, « Fait à [lieu] » et
   « [lieu], le », qui est la ville de l'entreprise. La première version de ce
   contrôle confondait les deux. Relevé le 28 septembre 2026 en l'écrivant.

   Chaque motif vient d'une ligne de la liste : « Fiche, organismes et
   interlocuteurs », « Règlement intérieur, Word », « Règlement intérieur,
   lettres », « Kit élections », « Affichages, contenu ». */
const CROCHETS_DUS = [
  { re: /Fait à \[(lieu|LIEU|VILLE)\]/, quoi: "« Fait à [lieu] » alors que la fiche porte la ville" },
  { re: /^\s*\[(lieu|LIEU|VILLE)\], le/m, quoi: "« [lieu], le » alors que la fiche porte la ville" },
  { re: /\[VILLE\]/, quoi: "le crochet [VILLE]" },
  { re: /\[DÉNOMINATION( SOCIALE)?\]/, quoi: "le crochet de la dénomination" },
  { re: /\[adresse du siège\]/, quoi: "le crochet de l'adresse du siège" },
  { re: /\[SIRET\]/, quoi: "le crochet du SIRET" },
  { re: /\[COORDONNÉES\]/, quoi: "le crochet des coordonnées d'un organisme" },
  { re: /\[nom du service\]/, quoi: "le crochet du service de santé au travail" },
  { re: /\[NUMÉRO D'INSCRIPTION\]/, quoi: "le crochet du numéro au registre des transporteurs" },
  { re: /\[ ?numéro à indiquer ?\]/, quoi: "le crochet du numéro IDCC" },
  { re: /\[ ?unité de contrôle (à indiquer|compétente) ?\]/i, quoi: "le crochet de l'unité de contrôle" },
  { re: /\[nom,? (et )?qualité du (représentant|signataire)[^\]]*\]/i, quoi: "le crochet du signataire" },
  { re: /\[NOM ET QUALITÉ DU SIGNATAIRE\]/, quoi: "le crochet du signataire" },
];

/* LES PERSONNES DE L'EXEMPLE, QUI NE DOIVENT PAS SURVIVRE À SON RETRAIT.

   « CSE, Non : des personnes inventées restent dans le Word, sous l'en-tête
   SARL TEC, Julie ROUX, Marc TISSIER, 01 99 00 12 35 ». Les écrans emportent le
   document après DocumentsProduits.sansExemple : ce contrôle refait le même
   geste et cherche ce qui aurait dû partir avec l'exemple. Une entreprise
   fictive, ses salariés, sa ville et ses numéros de téléphone n'ont rien à
   faire dans une pièce signée au nom du client. */
const FICTIONS = [
  /Marc TISSIER/, /Julie ROUX/, /Aïcha BENALI/, /Sofiane KHELIF/, /Fatou NDIAYE/,
  /Éric DUVAL/, /Nadia FERRAND/, /Claire BONNET/, /Sylvie MARTEAU/, /Isabelle PONS/,
  /Lagny-sur-Marne/, /01 99 00 \d\d \d\d/, /TRANSPORTS EXEMPLE/, /INSTITUT EXEMPLE/,
  /transports-exemple\.example/,
];

/* Un générateur peut avoir une raison de porter une tournure : elle est écrite
   ici, avec son motif, et nulle part ailleurs. */
const TOLERE = {
  /* Les avertissements d'usage des modules de contrôle s'adressent à
     l'utilisatrice sur l'écran, non au destinataire d'un document. */
};

function sandbox() {
  const s = {
    window: {}, document: undefined, localStorage: undefined,
    console: { log() {}, warn() {}, error() {} },
    setTimeout, clearTimeout, Promise, Date, Math, JSON, RegExp, String, Number,
    Array, Object, Boolean, isFinite, isNaN, parseInt, parseFloat, encodeURIComponent,
    decodeURIComponent, Intl, Error, TypeError, Map, Set, WeakMap,
  };
  s.window.window = s.window;
  s.globalThis = s;
  s.self = s.window;
  return s;
}

const boite = sandbox();
vm.createContext(boite);
const charger = (f) => {
  const p = path.join(racine, f);
  if (!fs.existsSync(p)) return;
  try { vm.runInContext(fs.readFileSync(p, "utf8"), boite, { filename: f }); }
  catch (e) { console.log("NOTE : " + f + " ne se charge pas ici (" + e.message + ")"); }
};
charger("documents-produits.js");
for (const f of fs.readdirSync(racine).filter((x) => /^documents-.*\.js$/.test(x) && x !== "documents-produits.js"))
  charger(f);

const DP = boite.window.DocumentsProduits;
if (!DP || !DP.tous) {
  console.log("FAUTE : le registre des documents ne s'est pas chargé.");
  process.exit(2);
}

/* Le texte d'un générateur, quelle que soit la forme qu'il rend. */
function aplatir(x) {
  if (typeof x === "string") return x;
  if (!Array.isArray(x)) return "";
  return x.map(function (y) {
    if (typeof y === "string") return y;
    if (!y || typeof y !== "object") return "";
    const bouts = [y.t, y.titre, y.nom, y.sur].filter(Boolean);
    if (Array.isArray(y.head)) bouts.push(y.head.join(" "));
    if (Array.isArray(y.rows)) bouts.push(y.rows.map((r) => (r || []).join(" ")).join(" "));
    return bouts.join(" ");
  }).join("\n");
}

const fautes = [];
const vus = {};
let nDocs = 0, nCas = 0;

/* DEUX CAS, ET CE QU'ON REGARDE DANS CHACUN.

   Sur une fiche complète, aucun crochet de donnée connue n'est admis, et
   aucune tournure interdite. Sur une fiche vide, les crochets sont normaux :
   c'est ce qu'ils sont faits pour dire. Ce qui ne l'est pas, c'est qu'un
   document se brise faute de données : « undefined » et « NaN » sont refusés
   là aussi, et une exception compte comme une faute. Le second cas avait
   disparu du contrôle ; il revient le 28 septembre 2026, limité à ce qu'il
   peut dire. */
const CAS = [
  ["fiche complète", { profil: FICHE, fiche: {}, donnees: {}, aujourdhui: new Date(2026, 8, 28) },
    { tout: true }],
  ["fiche vide", { profil: {}, fiche: {}, donnees: {}, aujourdhui: new Date(2026, 8, 28) },
    { tout: false }],
];
/* Les seules tournures refusées sur une fiche vide. */
const SUR_FICHE_VIDE = /^(« undefined »|« NaN »)/;

for (const id of Object.keys(DP.tous)) {
  const g = DP.tous[id];
  if (!g || typeof g.produire !== "function") continue;
  nDocs++;
  for (const [nomCas, ctx, regle] of CAS) {
    nCas++;
    let t;
    try { t = aplatir(g.produire(ctx)); }
    catch (e) { fautes.push(id + " (" + nomCas + ") : exception " + e.message); continue; }
    /* L'exemple parle d'une entreprise fictive : ses crochets et ses tournures
       ne sont pas ceux du client. On ne regarde que le document à compléter. */
    const m = /\n(VOS |VOTRE |VOS PIÈCES)/.exec(t);
    const propre = m ? t.slice(m.index) : t;
    /* LE TEXTE TEL QU'IL SE LIT, LIGNES RECOLLÉES.

       Les générateurs écrivent en lignes courtes ; la feuille et le fichier
       Word les recollent en paragraphes. « aucun texte capté par ce » suivi de
       « module n'attache » se lit donc « ce module », que ce contrôle ne
       voyait pas, faute de regarder le texte comme il s'affiche. Relevé le
       28 septembre 2026, en balayant les parcours. */
    const recolle = propre.replace(/([^\s.!?:;»)\]])\n(?![\n\s])(?=[a-zà-ÿ0-9(«"])/g, "$1 ");
    for (const x of INTERDITS) {
      if ((TOLERE[id] || []).indexOf(x.quoi) >= 0) continue;
      if (!regle.tout && !SUR_FICHE_VIDE.test(x.quoi)) continue;
      const trouve = propre.match(x.re) || recolle.match(x.re);
      if (!trouve) continue;
      const cle = id + "|" + x.quoi;
      if (vus[cle]) continue;
      vus[cle] = true;
      const ligne = (recolle.split("\n").filter((l) => x.re.test(l))[0] || trouve[0] || "").trim();
      fautes.push(id + " : " + x.quoi + " · « " + ligne.slice(0, 110) + " »");
    }
    if (!regle.tout) continue;
    for (const c of CROCHETS_DUS) {
      const trouve = propre.match(c.re);
      if (!trouve) continue;
      const cle = id + "|" + c.quoi;
      if (vus[cle]) continue;
      vus[cle] = true;
      fautes.push(id + " : " + c.quoi + " · « " + trouve[0].trim().slice(0, 70) + " »");
    }
    /* Le document tel qu'il s'emporte : l'exemple retiré, comme le font les
       écrans avant le téléchargement. */
    const emporte = typeof DP.sansExemple === "function" ? DP.sansExemple(t) : t;
    for (const re of FICTIONS) {
      const trouve = emporte.match(re);
      if (!trouve) continue;
      const cle = id + "|fiction";
      if (vus[cle]) continue;
      vus[cle] = true;
      fautes.push(id + " : une personne ou un lieu de l'exemple survit au retrait de " +
        "l'exemple · « " + trouve[0] + " »");
    }
  }
}

if (lister) {
  console.log(nDocs + " générateurs, " + nCas + " productions.");
  fautes.forEach((f) => console.log("  " + f));
}
if (fautes.length) {
  if (!lister) fautes.forEach((f) => console.log("FAUTE : " + f));
  console.log(fautes.length + " faute(s) sur " + nDocs + " générateurs.");
  console.log("Chaque interdit vient d'une ligne de la contre-vérification du 26 septembre 2026.");
  process.exit(1);
}
console.log("marques : " + nDocs + " générateurs, aucune tournure interdite, aucun crochet dû, " +
  "aucune personne de l'exemple.");
