/* Capturer à la source les articles que le référentiel social cite.

   La règle du dépôt, telle quelle : le relais Légifrance n'est pas fiable sous
   charge — 502, et parfois un article HOMONYME d'une autre partie du code, ou
   d'un autre code. UNE SEULE LECTURE NE PROUVE RIEN. Chaque article est donc lu
   deux fois, les requêtes espacées ; en cas de discordance, une troisième
   lecture départage — et le seul critère sûr est LE CONTENU : un texte qui ne
   porte pas le fragment attendu n'est pas une autre version de l'article, c'est
   un autre article, et il ne conclut rien.

   Un article non confirmé N'ENTRE PAS dans le référentiel : il est consigné à
   part dans textes-social-non-confirmes.json, et l'obligation qui voulait le
   citer se replie sur une formulation prudente ou disparaît.

   Usage : node capturer-textes-social.js [AAAA-MM-JJ]                        */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "LEGITEXT000006072050"; /* code du travail — le relais ne sert que lui */

/* Chaque article avec le fragment de contenu qui l'identifie : c'est lui qui
   écarte les homonymes. Le fragment est choisi discriminant — un mot que seul
   l'article cherché porte dans son voisinage. */
const ARTICLES = {
  /* instances */
  "L2311-2":   ["comité social et économique"],
  "L2313-1":   ["établissements distincts"],
  "L2315-36":  ["santé, sécurité et conditions de travail"],
  "L2331-1":   ["comité de groupe"],
  "L1153-5-1": ["harcèlement sexuel"],
  /* règlement intérieur */
  "L1311-2":   ["règlement intérieur"],
  "L1321-1":   ["règlement intérieur"],
  "L1321-2":   ["défense des salariés", "harcèlement"],
  "L1321-4":   ["règlement intérieur"],
  /* document unique */
  "R4121-1":   ["document unique"],
  "R4121-2":   ["mise à jour"],
  "R4121-4":   ["document unique"],
  /* affichages et informations */
  "L1152-4":   ["harcèlement moral"],
  "L1153-5":   ["harcèlement sexuel"],
  "L1142-6":   ["embauche"],
  "D4711-1":   ["inspection du travail"],
  "R4227-37":  ["consigne"],
  "L3171-1":   ["horaire collectif"],
  "R2262-1":   ["convention"],
  /* registres */
  "L1221-13":  ["registre unique du personnel"],
  "L4711-5":   ["registre"],
  "D4132-1":   ["danger grave"],
  /* formation et entretiens */
  "L6315-1":   ["entretien professionnel"],
  "L6321-1":   ["adaptation"],
  "L4141-2":   ["sécurité"],
  /* santé au travail */
  "L4622-1":   ["service de prévention et de santé au travail"],
  "R4624-10":  ["visite d'information et de prévention"],
  /* épargne, égalité, emploi */
  "L3322-2":   ["participation"],
  "L1142-8":   ["écarts"],
  "L5212-1":   ["vingt salariés"],
  "L5212-2":   ["travailleurs handicapés"],
  "L5212-5":   ["déclaration"],
};

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => { const t = Date.now(); while (Date.now() - t < ms); };

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    const a = j.article || j;
    return { id: a.id || a.cid || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { erreur: e.message.slice(0, 80) }; }
}

const porte = (texte, fragments) => fragments.some(fr => texte.toLowerCase().includes(fr.toLowerCase()));

const confirmes = {}, ecartes = {};
for (const [numero, fragments] of Object.entries(ARTICLES)) {
  /* Jusqu'à quatre lectures espacées ; on conclut sur deux lectures identiques
     entre elles ET porteuses du fragment attendu. */
  const lues = [];
  let verdict = null;
  for (let essai = 0; essai < 4 && !verdict; essai++) {
    const l = lire(numero);
    dors(900);
    if (!l.texte) { lues.push(l); continue; }
    lues.push(l);
    const memes = lues.filter(x => x.texte === l.texte);
    if (memes.length >= 2) {
      if (porte(l.texte, fragments)) verdict = { id: l.id, date: DATE, texte: l.texte };
      else verdict = { homonyme: true, id: l.id, texte: l.texte.slice(0, 160) };
    }
  }
  if (verdict && !verdict.homonyme) {
    confirmes[numero] = verdict;
    console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}  ${verdict.texte.slice(0, 60)}…`);
  } else {
    ecartes[numero] = { motif: verdict && verdict.homonyme
        ? "deux lectures stables, mais le contenu ne porte pas le fragment attendu : homonyme probable — l'article n'entre pas au référentiel"
        : "pas deux lectures concordantes en quatre essais : rien n'est conclu",
      lectures: lues.map(x => ({ id: x.id || null, erreur: x.erreur || null,
        debut: (x.texte || "").slice(0, 120) })) };
    console.log(`${numero.padEnd(11)} NON CONFIRMÉ — ${ecartes[numero].motif}`);
  }
}

fs.writeFileSync(__dirname + "/textes-social.json", JSON.stringify(confirmes, null, 1));
fs.writeFileSync(__dirname + "/textes-social-non-confirmes.json",
  JSON.stringify({ date: DATE, relais: RELAIS, articles: ecartes }, null, 1));
console.log(`\n${Object.keys(confirmes).length} confirmés · ${Object.keys(ecartes).length} non confirmés (consignés à part)`);
