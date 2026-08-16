/* Publier le module comité : rejouer toute la chaîne, mesurer, estampiller.

   Le manifeste était tenu à la main. Il n'y a pas de garantie dans un chiffre
   recopié : celui-ci est produit par l'exécution, et la publication échoue si
   l'un des maillons échoue. Les compteurs sont ceux que les scripts rendent,
   les empreintes celles des fichiers sur le disque.

   Usage : node publier-cse.js   */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const { execFileSync } = require("child_process");

const ICI = __dirname;
const etape = (n, quoi, fichier, ...args) => {
  process.stdout.write(`${n}. ${quoi}\n`);
  try { execFileSync(process.execPath, [path.join(ICI, fichier), ...args], { cwd: ICI, stdio: "pipe" }); }
  catch (e) {
    console.error(`ÉCHEC — ${fichier} :\n${(e.stdout || "").toString()}${(e.stderr || "").toString()}`);
    process.exit(1);
  }
};

etape(1, "cas de contrôle du moteur", "tests-cse.js");
etape(2, "cas contradictoires sur les contrôles", "tests-controles-cse.js");
etape(3, "questionnaire et contrôle de non-divergence, dans les deux sens", "questionnaire-cse.js");
etape(4, "propositions du formulaire, vérifiées dans les deux sens", "propositions-cse.js");
etape(5, "audit du dossier de référence", "audit-cse.js", "fiche-cse.json");

const rapport = JSON.parse(fs.readFileSync(path.join(ICI, "rapport-tests-cse.json"), "utf8"));
const T = JSON.parse(fs.readFileSync(path.join(ICI, "textes_cse.json"), "utf8"));
const CORPUS = JSON.parse(fs.readFileSync(path.join(ICI, "cse_corpus.json"), "utf8"));
const { C, DETECTION, COHERENCE } = require("./controles-cse.js");
const GRILLE = require("./grille-cse.js");
const CAS_MOTEUR = require("./tests-cse.js");
const SONDE = require("./sonde.js");

/* La couverture réelle : quelles règles aucune fiche du dépôt ne déclenche.
   Ce n'est pas un défaut en soi — une règle attend une situation que nul
   dossier ne décrit — mais c'est la seule mesure honnête de ce qui n'a jamais
   été exécuté, et elle est publiée plutôt que tue. */
const jamais = SONDE.reglesJamaisDeclenchees(GRILLE);

const FICHIERS = fs.readdirSync(ICI)
  .filter(x => /^(moteur|grille|controles|actions|audit|questionnaire|valider|sonde|dates|tests|tests-controles|publier)-?(cse)?\.js$/.test(x)
            || /^(textes_cse|cse_corpus|_r2314_1)\.json$/.test(x))
  .sort();
const empreintes = {};
for (const f of FICHIERS)
  empreintes[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(ICI, f))).digest("hex").slice(0, 12);
const empreinte = crypto.createHash("sha256")
  .update(FICHIERS.map(f => f + ":" + empreintes[f]).join("\n")).digest("hex").slice(0, 12);

const manifeste = {
  domaine: "comité social et économique",
  date: new Date().toISOString().slice(0, 10),
  empreinte,
  fichiers: empreintes,
  compteurs: {
    articlesLus: Object.values(T).filter(v => v && v.texte).length,
    articlesSansReponse: Object.values(T).filter(v => !v || !v.texte).length,
    arrets: Object.keys(CORPUS).length,
    regles: GRILLE.length,
    reglesJamaisDeclenchees: jamais.length,
    controles: C.length,
    detection: DETECTION.size,
    coherence: COHERENCE.size,
    casMoteur: CAS_MOTEUR.length,
    casContradictoires: rapport.cas,
    verdicts: rapport.cas * rapport.controles,
    exceptions: rapport.jets,
    conformitesSurFicheVide: rapport.confVide,
    sansBrancheNonConforme: rapport.sansBrancheNonConforme.length,
    branchesNonConformeJamaisAtteintes: rapport.jamaisEnDefaut.length,
    detectionConcluantConforme: rapport.detectionConforme.length,
  },
  reglesJamaisDeclenchees: jamais.map(r => r.id),
};
fs.writeFileSync(path.join(ICI, "manifeste-cse.json"), JSON.stringify(manifeste, null, 1) + "\n");

console.log("6. manifeste");
console.log(`empreinte : ${empreinte}`);
console.log("compteurs : " + JSON.stringify(manifeste.compteurs));
if (jamais.length) console.log(`règles jamais déclenchées par les fiches du dépôt : ${jamais.map(r => r.id).join(", ")}`);
const ko = rapport.jets || rapport.confVide || rapport.detectionConforme.length || rapport.jamaisEnDefaut.length;
if (ko) { console.error("ÉCHEC — la chaîne de contrôle n'est pas verte."); process.exit(1); }
