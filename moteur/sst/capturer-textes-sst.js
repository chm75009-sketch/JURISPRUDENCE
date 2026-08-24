/* Constituer le dépôt de textes du module SST depuis le relais Légifrance.

   La règle du dépôt (CLAUDE.md) est appliquée à la capture même : le relais
   n'est pas fiable sous charge — il rend des 502 et parfois un article
   homonyme d'une autre partie du code. Chaque article est donc lu DEUX fois,
   les lectures espacées, et n'est retenu que si :
     1. les deux lectures sont identiques (texte et identifiant), et
     2. le CONTENU parle de ce qu'on cherche — un mot-clé propre à l'article,
        déclaré ci-dessous, doit figurer dans le texte lu. C'est le texte qui
        décide, pas l'identifiant : les homonymes stables existent (mesuré sur
        R. 2312-13 et R. 2312-14 le 16 août 2026).
   Un article qui ne satisfait pas ces deux conditions n'est PAS écrit : il est
   consigné dans textes-sst-non-confirmes.json et ne sera pas cité.

   Les articles de la CSSCT (L. 2315-36 et suivants, L. 2315-18, L. 2314-1) ne
   sont pas recapturés : ils sont repris de moteur/cse/textes_cse.json, déjà
   vérifiés à la source par verifier-textes.js (relecture du 15 août 2026,
   368 articles, aucun écart). La provenance est marquée sur chaque entrée.

   Usage : node capturer-textes-sst.js [AAAA-MM-JJ]                          */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
/* Mesuré à cette capture (19 août 2026) : le filtre NOM_CODE du relais attend
   le NOM du code, pas l'identifiant LEGITEXT. Avec « LEGITEXT000006072050 »,
   le filtre ne retient rien, le relais élargit sans restriction, et la
   recherche par pertinence sert l'homonyme d'un autre code — systématiquement
   pour L. 4121-1 (code général de la propriété des personnes publiques) ou
   L. 1152-1 (code de la santé publique). Avec « Code du travail », l'article
   cherché revient du premier coup. Le critère de contenu reste appliqué :
   c'est le texte qui décide. */
const CODE = "Code du travail";
const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };

/* Chaque article et son critère de contenu : un fragment que l'article cherché
   porte nécessairement, et qu'un homonyme d'une autre partie du code n'aurait
   pas. */
const NUMEROS = {
  /* Le document unique et l'évaluation des risques */
  "L4121-1":   /santé physique et mentale des travailleurs/i,
  "L4121-2":   /principes généraux de prévention/i,
  "L4121-3":   /évalue les risques pour la santé et la sécurité|évaluation des risques pour la santé et la sécurité/i,
  "L4121-3-1": /document unique d'évaluation des risques/i,
  "R4121-1":   /document unique.*évaluation des risques|résultats de l'évaluation des risques/i,
  "R4121-2":   /mise à jour du document unique/i,
  "R4121-3":   /risques|évaluation/i,
  "R4121-4":   /document unique/i,
  /* Les sanctions */
  "L4741-1":   /amende/i,
  "R4741-1":   /cinquième classe/i,
  "L1155-2":   /harcèlement/i,
  /* Ajoutés le 24 août 2026, pour que le module cesse de taire des peines qui
     existent. Deux textes, et deux frontières à tenir :
     — R. 4741-3 punit la méconnaissance des articles L. 4711-1 à L. 4711-5 et
       D. 4711-1 à D. 4711-3, « relatives aux documents et affichages
       obligatoires ». Son énumération est close, et R. 4121-4 — l'avis d'accès
       au document unique — n'y figure pas. Le texte est capté pour que cette
       frontière soit vérifiable sur pièce, non pour être invoqué sur le
       document unique : il n'est cité nulle part dans la régularisation.
     — L. 2317-1 punit l'entrave au comité social et économique. Il est capté
       ici parce que deux contrôles de ce module portent sur le comité : la
       consultation sur le document unique, et la commission santé, sécurité et
       conditions de travail. Le module CSE le cite déjà dans les mêmes termes. */
  "R4741-3":   /documents et affichages obligatoires/i,
  "L2317-1":   /entrave.{0,80}comité social et économique/i,
  /* Le harcèlement : définitions, protection, prévention, référents */
  "L1152-1":   /harcèlement moral/i,
  "L1152-2":   /harcèlement moral/i,
  "L1152-4":   /harcèlement moral/i,
  "L1153-1":   /harcèlement sexuel/i,
  "L1153-2":   /harcèlement sexuel|agissements/i,
  "L1153-5":   /harcèlement sexuel/i,
  "L1153-5-1": /harcèlement sexuel/i,
  "D1151-1":   /médecin du travail|Défenseur des droits/i,
};

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    const a = j.article || j;
    return { id: a.id || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { id: null, texte: "" }; }
}

const CHEMIN = __dirname + "/textes-sst.json";
const T = fs.existsSync(CHEMIN) ? JSON.parse(fs.readFileSync(CHEMIN, "utf8")) : {};
const refus = [];

/* Le relais peut servir plusieurs fois de suite un homonyme d'un AUTRE code
   (mesuré à cette capture même : L. 4121-1 rendu depuis le code général de la
   propriété des personnes publiques, L. 1152-1 depuis le code de la santé
   publique) avant de rendre l'article du code du travail — le module NAO
   avait rencontré exactement cela sur R. 2242-1. On lit donc jusqu'à dix fois,
   en espaçant : une lecture homonyme est écartée sans conclure, et l'article
   n'est retenu que sur DEUX lectures concordantes entre elles (même
   identifiant, même texte) qui satisfont le critère de contenu. */
for (const [n, critere] of Object.entries(NUMEROS)) {
  if (T[n] && T[n].texte) { console.log(`${n} — déjà capturé (${T[n].id})`); continue; }
  const valables = [], homonymes = [];
  for (let essai = 0; essai < 10; essai++) {
    const a = lire(n); dors(1800);
    if (!a.texte) continue;                            /* relais muet : on réessaie */
    if (!critere.test(a.texte)) {
      if (!homonymes.some(h => h.id === a.id)) homonymes.push({ id: a.id, apercu: a.texte.slice(0, 120) });
      continue;                                        /* homonyme : écarté, sans conclure */
    }
    const deja = valables.find(v => v.id === a.id && v.texte === a.texte);
    if (deja) { deja.fois++; } else valables.push({ id: a.id, texte: a.texte, fois: 1 });
    if (valables.some(v => v.fois >= 2)) break;
  }
  const retenu = valables.find(v => v.fois >= 2);
  if (retenu) {
    T[n] = { id: retenu.id, date: DATE, lectures: retenu.fois, concordantes: true, texte: retenu.texte };
    console.log(`${n} — ${retenu.id} — ${retenu.texte.length} car.`
      + (homonymes.length ? ` (homonymes écartés : ${homonymes.map(h => h.id).join(", ")})` : ""));
  } else {
    refus.push({ numero: n,
      motif: valables.length
        ? `une seule lecture au critère de contenu (${valables.map(v => v.id).join(", ")}), jamais confirmée — une seule lecture ne prouve rien`
        : (homonymes.length ? `seuls des homonymes ont été servis : ${homonymes.map(h => `${h.id} « ${h.apercu}… »`).join(" ; ")}`
                            : "relais muet ou lectures inexploitables") });
    console.log(`${n} — NON CONFIRMÉ`);
  }
  fs.writeFileSync(CHEMIN, JSON.stringify(T, null, 1));
}

/* Les articles de la CSSCT et des référents du comité, repris du module CSE :
   déjà lus et relus à la source (moteur/cse/verifier-textes.js, relecture du
   15 août 2026, 368 articles, aucun écart). On ne les recapture pas ; leur
   provenance est marquée sur chaque entrée. */
const REPRIS = ["L2315-36", "L2315-37", "L2315-38", "L2315-39", "L2315-41", "L2315-42",
  "L2315-43", "L2315-44", "L2315-18", "L2314-1", "L2312-27"];
const CSE = JSON.parse(fs.readFileSync(__dirname + "/../cse/textes_cse.json", "utf8"));
for (const n of REPRIS) {
  if (!CSE[n] || !CSE[n].texte) { console.error(`ÉCHEC — ${n} absent de textes_cse.json.`); process.exit(1); }
  T[n] = { id: CSE[n].id, texte: net(CSE[n].texte),
    source: "moteur/cse/textes_cse.json — vérifié à la source par moteur/cse/verifier-textes.js (relecture du 15 août 2026, aucun écart)" };
}
fs.writeFileSync(CHEMIN, JSON.stringify(T, null, 1));

fs.writeFileSync(__dirname + "/textes-sst-non-confirmes.json",
  JSON.stringify({ date: DATE, nonConfirmes: refus }, null, 1));
console.log(`\n${Object.keys(T).length} articles retenus (dont ${REPRIS.length} repris du module CSE) · ${refus.length} non confirmés`);
