/* Constituer le dépôt de textes du module « discipline et règlement intérieur »
   depuis le relais Légifrance.

   La règle du dépôt (CLAUDE.md) est appliquée à la capture même : le relais
   n'est pas fiable sous charge — il rend des 502 et parfois un article
   homonyme d'une autre partie du code, voire d'un autre code. Chaque article
   est donc lu DEUX fois, les lectures espacées, et n'est retenu que si :
     1. les deux lectures sont identiques (texte et identifiant), et
     2. le CONTENU parle de ce qu'on cherche — un mot-clé propre à l'article,
        déclaré ci-dessous, doit figurer dans le texte lu. C'est le texte qui
        décide, pas l'identifiant.
   Un article qui ne satisfait pas ces deux conditions n'est PAS écrit : il est
   consigné dans textes-discipline-non-confirmes.json et ne sera pas cité.

   Le filtre du relais attend le NOM du code (« Code du travail »), jamais un
   identifiant LEGITEXT : avec un LEGITEXT le filtre ne porte pas, et la
   recherche par pertinence sert des homonymes d'autres codes.

   Les articles du règlement intérieur déjà lus et relus à la source par le
   module social (L. 1311-2, L. 1321-1 à L. 1321-6) ne sont pas recapturés :
   ils sont repris de moteur/social/textes-social.json, et leur provenance est
   marquée sur chaque entrée. Ils sont de toute façon relus à la source par
   verifier-textes-discipline.js, comme tous les autres.

   Usage : node capturer-textes-discipline.js [AAAA-MM-JJ]                   */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";
const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };

/* Chaque article et son critère de contenu : un fragment que l'article cherché
   porte nécessairement, et qu'un homonyme d'une autre partie du code — ou d'un
   autre code — n'aurait pas. */
const NUMEROS = {
  /* Le règlement intérieur : publicité, dépôt, contrôle de l'administration */
  "R1321-1": /règlement intérieur/i,
  "R1321-2": /règlement intérieur/i,
  /* Ces trois-là ne prononcent pas les mots « règlement intérieur » : ils
     renvoient à l'article dont ils fixent le délai ou l'application. Le critère
     de contenu est donc ce renvoi, qui n'appartient qu'au code du travail. Une
     première capture, au critère « règlement intérieur », les avait classés
     « homonymes servis » — la correction porte sur le critère, pas sur la
     règle : deux lectures concordantes restent exigées. */
  "R1321-3": /L\. ?1321-4/i,
  "R1321-4": /règlement intérieur/i,
  "R1321-5": /L\. ?1311-2/i,
  "L1322-1": /inspecteur du travail/i,
  "L1322-2": /règlement intérieur|inspecteur du travail/i,
  "L1322-3": /règlement intérieur|décision/i,
  /* La discipline : définition, interdictions, procédure, prescription */
  "L1331-1": /sanction/i,
  "L1331-2": /amendes|sanctions pécuniaires/i,
  "L1332-1": /griefs/i,
  "L1332-2": /convoque le salarié/i,
  "L1332-3": /mise à pied/i,
  "L1332-4": /fait fautif/i,
  "L1332-5": /sanction antérieure/i,
  "R1332-1": /convocation|entretien/i,
  "R1332-2": /sanction|notifi/i,
  "R1332-3": /L\. ?1332-2/i,
  /* Le contrôle du juge */
  "L1333-1": /conseil de prud'hommes|juge/i,
  "L1333-2": /annuler une sanction|sanction/i,
  "L1333-3": /licenciement|sanction/i,

  /* Les textes répressifs, ajoutés le 24 août 2026. Le corpus n'en portait
     aucun : le module ne cotait donc aucun manquement en gravité 1, faute
     d'avoir lu la peine. Ces trois-là existent, et ils se lisent.
     — R. 1323-1 est le texte pénal du règlement intérieur : il punit la
       méconnaissance des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à
       R. 1321-5. Son énumération s'arrête à L. 1322-4 : elle ne touche PAS la
       procédure disciplinaire des articles L. 1332-1 et suivants.
     — L. 1334-1 est le texte pénal de la sanction pécuniaire, et lui seul :
       il ne vise que l'article L. 1331-2.
     — L. 2317-1 punit l'entrave au comité social et économique ; le règlement
       intérieur ne peut être introduit qu'après son avis (L. 1321-4).
     Le relais sert, sous ces numéros, des homonymes d'autres codes : L. 1334-1
     ramène le saturnisme du code de la santé publique, L. 1323-1 l'aptitude
     des personnes chargées de la conduite. Le critère de contenu ci-dessous
     est écrit pour eux. */
  "R1323-1": /contraventions de la quatrième classe/i,
  "L1334-1": /amende ou une sanction pécuniaire/i,
  "L2317-1": /entrave.{0,80}comité social et économique/i,
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

const CHEMIN = __dirname + "/textes-discipline.json";
const T = fs.existsSync(CHEMIN) ? JSON.parse(fs.readFileSync(CHEMIN, "utf8")) : {};
const refus = [];

for (const [n, critere] of Object.entries(NUMEROS)) {
  if (T[n] && T[n].texte) { console.log(`${n} — déjà capturé (${T[n].id})`); continue; }
  const valables = [], homonymes = [];
  for (let essai = 0; essai < 8; essai++) {
    const a = lire(n); dors(1500);
    if (!a.texte) continue;                            /* relais muet : on réessaie */
    if (!critere.test(a.texte)) {
      if (!homonymes.some(h => h.id === a.id)) homonymes.push({ id: a.id, apercu: a.texte.slice(0, 140) });
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

/* Les articles du règlement intérieur repris du module social : déjà lus deux
   fois à la source, et relus par verifier-textes-discipline.js comme les
   autres. On ne les recapture pas ; leur provenance est marquée. */
const REPRIS = ["L1311-2", "L1321-1", "L1321-2", "L1321-2-1", "L1321-3", "L1321-4", "L1321-5", "L1321-6"];
const SOC = JSON.parse(fs.readFileSync(__dirname + "/../social/textes-social.json", "utf8"));
for (const n of REPRIS) {
  if (!SOC[n] || !SOC[n].texte) { console.error(`ÉCHEC — ${n} absent de textes-social.json.`); process.exit(1); }
  T[n] = { id: SOC[n].id, date: SOC[n].date || DATE, texte: net(SOC[n].texte),
    source: "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js" };
}
fs.writeFileSync(CHEMIN, JSON.stringify(T, null, 1));

fs.writeFileSync(__dirname + "/textes-discipline-non-confirmes.json",
  JSON.stringify({ date: DATE, nonConfirmes: refus }, null, 1));
console.log(`\n${Object.keys(T).length} articles retenus (dont ${REPRIS.length} repris du module social) · ${refus.length} non confirmés`);
