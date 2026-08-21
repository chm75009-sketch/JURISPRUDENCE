/* Capturer à la source les articles que les parcours guidés citent.

   La règle du dépôt, telle quelle : le relais Légifrance n'est pas fiable sous
   charge — 502, et parfois un article HOMONYME d'une autre partie du code.
   UNE SEULE LECTURE NE PROUVE RIEN. Chaque article est donc lu deux fois au
   moins, les requêtes espacées ; on ne conclut que sur deux lectures
   identiques entre elles ET dont le CONTENU porte le fragment attendu — le
   contenu est le seul critère sûr, l'identifiant ne tranche rien (CLAUDE.md).

   Le filtre est le NOM du code, « Code du travail », jamais un LEGITEXT : un
   LEGITEXT désactive le filtre et la recherche par pertinence sert alors des
   homonymes d'autres codes. C'est la cause première des homonymes du dépôt :
   au jour de cette capture, moteur/nao/textes-nao.json en portait encore deux —
   L. 2242-1 servi comme un article du code général des collectivités
   territoriales (LEGIARTI000006390466, « Le conseil municipal statue sur
   l'acceptation des dons et legs »), L. 2242-10 comme un article d'un autre
   code. Cette capture-ci les redemande sous le bon filtre et obtient
   LEGIARTI000043893962 et LEGIARTI000035627827.

   Un article non confirmé N'ENTRE PAS dans le référentiel : il est consigné à
   part dans textes-parcours-non-confirmes.json, et l'étape qui voulait le
   citer se replie sur une formulation prudente ou disparaît.

   Usage : node capturer-textes-parcours.js [AAAA-MM-JJ]                      */
const fs = require("fs");
const { execFileSync } = require("child_process");

const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";
const CODE = "Code du travail";   /* le NOM du code — voir CLAUDE.md */

/* Chaque article avec le ou les fragments de contenu qui l'identifient. Le
   fragment est choisi discriminant : un mot que seul l'article cherché porte
   dans son voisinage. C'est lui qui écarte les homonymes. */
const ARTICLES = {
  /* ---- parcours « sanctionner un salarié » ---- */
  "L1331-1":   ["observations verbales"],
  "L1331-2":   ["amendes"],
  "L1332-1":   ["griefs retenus"],
  "L1332-2":   ["entretien"],
  "L1332-3":   ["mise à pied"],
  "L1332-4":   ["deux mois"],
  "L1332-5":   ["trois ans"],
  "R1332-1":   ["convocation"],
  "R1332-2":   ["motivée"],
  "R1332-3":   ["quantième"],
  "L1333-1":   ["conseil de prud'hommes"],
  "L1333-2":   ["annuler"],

  /* ---- parcours « règlement intérieur » ---- */
  "L1311-2":   ["règlement intérieur"],
  "L1321-1":   ["règlement intérieur"],
  "L1321-2":   ["rappelle"],
  "L1321-2-1": ["neutralité"],
  "L1321-3":   ["ne peut contenir"],
  "L1321-4":   ["comité social et économique"],
  "L1321-5":   ["notes de service"],
  "L1321-6":   ["français"],
  "L1322-1":   ["inspecteur du travail"],
  "L1322-2":   ["inspecteur du travail"],
  "L1322-3":   ["recours"],
  "R1321-1":   ["par tout moyen"],
  "R1321-2":   ["greffe"],
  "R1321-3":   ["délai"],
  "R1321-4":   ["inspecteur du travail"],
  "R1321-5":   ["douze mois"],

  /* ---- parcours « tenir une réunion du CSE » ---- */
  "L2312-5":   ["réclamations"],
  "L2312-8":   ["expression collective"],
  "L2312-14":  ["consultation"],
  "L2312-15":  ["avis"],
  "L2312-16":  ["avis"],
  "L2312-22":  ["orientations stratégiques"],
  "R2312-6":   ["délai"],
  "L2315-22":  ["note écrite"],
  "L2315-27":  ["quatre réunions"],
  "L2315-28":  ["se réunit"],
  "L2315-29":  ["ordre du jour"],
  "L2315-30":  ["ordre du jour"],
  "L2315-31":  ["ordre du jour"],
  "L2315-32":  ["majorité des membres présents"],
  "L2315-34":  ["procès-verbal"],
  "L2315-35":  ["affiché"],
  "D2315-26":  ["procès-verbal"],

  /* ---- parcours « constituer les commissions du CSE » ---- */
  "L2315-36":  ["santé, sécurité et conditions de travail"],
  "L2315-37":  ["inspecteur du travail"],
  "L2315-38":  ["délégation"],
  "L2315-39":  ["présidée"],
  "L2315-41":  ["mise en place"],
  "L2315-42":  ["délégué syndical"],
  "L2315-43":  ["L. 2315-36"],
  "L2315-44":  ["règlement intérieur"],
  "L2315-44-1":["commission des marchés"],
  "L2315-44-2":["commission des marchés"],
  "L2315-44-3":["marchés"],
  "L2315-45":  ["commissions supplémentaires"],
  "L2315-46":  ["commission économique"],
  "L2315-47":  ["commission économique"],
  "L2315-48":  ["commission économique"],
  "L2315-49":  ["formation"],
  "L2315-50":  ["logement"],
  "L2315-51":  ["logement"],
  "L2315-52":  ["logement"],
  "L2315-53":  ["logement"],
  "L2315-56":  ["égalité professionnelle"],
  "D2315-29":  ["commission des marchés"],
  "L2315-18":  ["formation"],
  "L2314-33":  ["quatre ans"],
  "L2315-78":  ["expert"],
  "L2315-81":  ["expert"],

  /* ---- parcours « conduire les NAO » ---- */
  "L2242-1":   ["sections syndicales"],
  "L2242-2":   ["trois cents salariés"],
  "L2242-2-1": ["négociation"],
  "L2242-3":   ["égalité professionnelle"],
  "L2242-4":   ["décisions unilatérales"],
  "L2242-5":   ["procès-verbal de désaccord"],
  "L2242-8":   ["pénalité"],
  "L2242-10":  ["négociation"],
  "L2242-11":  ["périodicité"],
  "L2242-12":  ["renégociation"],
  "L2242-13":  ["A défaut d'accord"],
  "L2242-15":  ["salaires effectifs"],
  "L2242-17":  ["égalité professionnelle"],
  "L2242-14":  ["première réunion"],
  "L2242-16":  ["mises à disposition"],
  "L1142-8":   ["écarts de rémunération"],
  "R2242-1":   ["procès-verbal de désaccord"],
  "D2231-2":   ["dépôt"],
  "D2231-4":   ["dépôt"],
  "L2232-12":  ["50 %"],
  "L2243-1":   ["amende"],
  "L2243-2":   ["emprisonnement"],

  /* ---- modèles propres aux parcours : alerte, expertise, commissions ---- */
  "L4131-1":   ["danger grave et imminent"],
  "L4131-2":   ["danger grave et imminent"],
  "L4132-2":   ["enquête"],
  "D4132-1":   ["registre"],
  "L2312-59":  ["atteinte aux droits des personnes"],
  "L2312-60":  ["danger grave et imminent"],
  "L2312-63":  ["préoccupante"],
  "L2312-64":  ["rapport"],
  "L2312-65":  ["avis"],
  "L2315-79":  ["expert"],
  "L2315-80":  ["expert"],
  "L2315-87":  ["expert"],
  "L2315-88":  ["expert"],
  "L2315-94":  ["expert habilité"],
  "R2315-45":  ["expert"],
  "R2315-46":  ["expert"],

  /* ---- parcours « mettre à jour le DUERP » ---- */
  "L4121-1":   ["mesures nécessaires"],
  "L4121-2":   ["principes généraux de prévention"],
  "L4121-3":   ["évalue les risques"],
  "L4121-3-1": ["document unique"],
  "R4121-1":   ["document unique"],
  "R4121-2":   ["mise à jour"],
  "R4121-3":   ["document unique"],
  "R4121-4":   ["document unique"],
  "L2312-27":  ["rapport annuel"],
  "L4741-1":   ["amende"],
  "R4741-1":   ["évaluation des risques"],
};

/* Numéros écartés de la liste AVANT capture, et pourquoi. On les consigne :
   un numéro qui n'existe pas doit être documenté, sinon il revient. */
const RETIRES = {
  "L2315-40": { motif: "le relais répond « trouve : false » à deux lectures espacées (21 août 2026) — ce numéro n'existe pas dans le code du travail à la date lue", cite: false },
};

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const dors = ms => new Promise(r => setTimeout(r, ms));

function lire(numero) {
  const corps = JSON.stringify({ action: "article", numero, code: CODE, date: DATE });
  try {
    const out = execFileSync("curl", ["-s", "--max-time", "40", "-X", "POST", RELAIS,
      "-H", "content-type: application/json", "-d", corps], { encoding: "utf8", maxBuffer: 40e6 });
    const j = JSON.parse(out);
    const a = j.article || j;
    return { id: a.id || a.cid || null, texte: net(a.texte || a.content || "") };
  } catch (e) { return { erreur: String(e.message).slice(0, 80) }; }
}

const porte = (texte, fragments) =>
  fragments.some(fr => texte.toLowerCase().includes(fr.toLowerCase()));

/* Reprise : une capture interrompue, ou un ajout d'articles, ne redemande pas
   au relais ce qui est déjà confirmé — moins de charge, donc moins d'homonymes
   servis. `node capturer-textes-parcours.js AAAA-MM-JJ --tout` reprend tout. */
const REPRENDRE = !process.argv.includes("--tout");
let acquis = {}, acquisEcartes = {};
if (REPRENDRE) {
  try { acquis = JSON.parse(fs.readFileSync(__dirname + "/textes-parcours.json", "utf8")); } catch (_) {}
  try { acquisEcartes = JSON.parse(fs.readFileSync(__dirname + "/textes-parcours-non-confirmes.json", "utf8")).articles || {}; } catch (_) {}
}

(async function () {
  const confirmes = Object.assign({}, acquis), ecartes = {};
  for (const [numero, fragments] of Object.entries(ARTICLES)) {
    if (confirmes[numero]) { console.log(`${numero.padEnd(11)} déjà confirmé (repris)`); continue; }
    /* Jusqu'à quatre lectures espacées ; on conclut sur deux lectures
       identiques entre elles ET porteuses du fragment attendu. */
    const lues = [];
    let verdict = null;
    for (let essai = 0; essai < 4 && !verdict; essai++) {
      const l = lire(numero);
      await dors(700);
      lues.push(l);
      if (!l.texte) continue;
      const memes = lues.filter(x => x.texte === l.texte);
      if (memes.length >= 2) {
        verdict = porte(l.texte, fragments)
          ? { id: l.id, date: DATE, lectures: memes.length, concordantes: true, texte: l.texte }
          : { homonyme: true, id: l.id, texte: l.texte.slice(0, 200) };
      }
    }
    if (verdict && !verdict.homonyme) {
      confirmes[numero] = verdict;
      console.log(`${numero.padEnd(11)} confirmé  ${verdict.id}  ${verdict.texte.slice(0, 70)}…`);
    } else {
      ecartes[numero] = {
        motif: verdict && verdict.homonyme
          ? "deux lectures stables, mais le contenu ne porte pas le fragment attendu : homonyme probable — l'article n'entre pas au référentiel"
          : "pas deux lectures concordantes en quatre essais : rien n'est conclu",
        lectures: lues.map(x => ({ id: x.id || null, erreur: x.erreur || null,
          debut: (x.texte || "").slice(0, 140) })),
      };
      console.log(`${numero.padEnd(11)} NON CONFIRMÉ — ${ecartes[numero].motif.slice(0, 60)}…`);
    }
  }

  fs.writeFileSync(__dirname + "/textes-parcours.json", JSON.stringify(confirmes, null, 1));
  fs.writeFileSync(__dirname + "/textes-parcours-non-confirmes.json",
    JSON.stringify({ date: DATE, relais: RELAIS, code: CODE, articles: ecartes,
      note: "Un article non confirmé n'entre pas au référentiel et n'est jamais cité par les parcours.",
      retiresAvantCapture: RETIRES }, null, 1));
  console.log(`\n${Object.keys(confirmes).length} confirmés · ${Object.keys(ecartes).length} non confirmés (consignés à part)`);
})();
