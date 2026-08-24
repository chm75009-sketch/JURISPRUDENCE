/* Publier le module « plan de sauvegarde de l'emploi » : rejouer la chaîne,
   mesurer, estampiller.

   Aucun chiffre n'est recopié : les compteurs sont ceux que les scripts
   rendent, et les empreintes celles des fichiers sur le disque. La publication
   échoue si l'un des maillons échoue — c'est tout l'intérêt.

   Usage : node publier-pse.js      */
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

etape(1, "découpage de l'article L. 1233-62 et mesure de sa couverture", "mesures.js");
etape(2, "dossiers contradictoires sur les contrôles", "tests-pse.js");
etape(3, "questionnaire et non-divergence, dans les deux sens", "questionnaire-pse.js");
etape(4, "propositions du formulaire, vérifiées dans les deux sens", "propositions-pse.js");
etape(5, "grille de jurisprudence et corpus des arrêts", "grille-pse.js");
etape(6, "régularisation : chaque contrôle a son issue, chaque issue son contrôle", "regularisation-pse.js");

const { C, DETECTION, COHERENCE } = require("./controles-pse.js");
const { L1233_62 } = require("./mesures.js");
const GRILLE = require("./grille-pse.js");
const { CAS, BASE, verdicts } = require("./tests-pse.js");
const { LIGNES } = require("./questionnaire-pse.js");
const T = JSON.parse(fs.readFileSync(path.join(ICI, "textes-pse.json"), "utf8"));

/* La mesure de ce que la chaîne a réellement exercé. */
const tous = [{ nom: "référence", f: BASE }, ...CAS, { nom: "vide", f: {} }];
let nbVerdicts = 0, exceptions = 0, conformitesSurVide = 0, calibrageConforme = 0;
for (const cas of tous) {
  const v = verdicts(cas.f);
  for (const [id, x] of Object.entries(v)) {
    nbVerdicts++;
    if (/non exécutable/.test(x.motif || "")) exceptions++;
    if (cas.nom === "vide" && (x.etat === "conforme" || x.etat === "sans objet")) conformitesSurVide++;
    if (DETECTION.includes(id) && x.etat === "conforme") calibrageConforme++;
  }
}

const FICHIERS = fs.readdirSync(ICI)
  .filter(x => /\.js$/.test(x) && x !== "publier-pse.js" || /^(textes-pse|fiche-pse)\.json$/.test(x))
  .sort();
const empreintes = {};
for (const f of FICHIERS)
  empreintes[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(ICI, f))).digest("hex").slice(0, 12);
const empreinte = crypto.createHash("sha256")
  .update(FICHIERS.map(f => f + ":" + empreintes[f]).join("\n")).digest("hex").slice(0, 12);

const manifeste = {
  domaine: "plan de sauvegarde de l'emploi",
  date: new Date().toISOString().slice(0, 10),
  empreinte,
  fichiers: empreintes,
  compteurs: {
    articlesLus: Object.values(T).filter(v => v && v.texte).length,
    rubriquesL1233_62: L1233_62.mesures.length,
    couvertureDecoupage: L1233_62.couverture,
    versionL1233_62: L1233_62.version,
    controles: C.length,
    calibrage: DETECTION.length,
    coherence: COHERENCE.length,
    donneesDemandees: LIGNES.length,
    reglesJurisprudence: GRILLE.G.length,
    arretsAuCorpus: Object.keys(GRILLE.CORPUS).length,
    casContradictoires: CAS.length,
    verdicts: nbVerdicts,
    exceptions,
    conformitesOuSansObjetSurFicheVide: conformitesSurVide,
    calibrageConcluantConforme: calibrageConforme,
  },
};

if (exceptions || conformitesSurVide || calibrageConforme) {
  console.error("ÉCHEC — la chaîne a produit ce qu'elle interdit :",
    JSON.stringify({ exceptions, conformitesSurVide, calibrageConforme }));
  process.exit(1);
}

/* La relecture des textes à la source : son résultat est repris tel quel s'il a
   été produit, et son absence est dite plutôt que tue. */
try {
  const V = JSON.parse(fs.readFileSync(path.join(ICI, "verification-textes-pse.json"), "utf8"));
  manifeste.textesRelus = { date: V.date, articles: V.articles, concordants: V.concordants,
    ecarts: V.ecarts, sansConclusion: V.douteux };
  if (V.ecarts) { console.error(`ÉCHEC — ${V.ecarts} article(s) du dépôt s'écartent de la source.`); process.exit(1); }
} catch (e) {
  manifeste.textesRelus = null;
  console.log("   (les textes n'ont pas été relus à la source : node verifier-textes-pse.js)");
}

fs.writeFileSync(path.join(ICI, "manifeste-pse.json"), JSON.stringify(manifeste, null, 1));

console.log(`7. manifeste écrit — empreinte ${empreinte}`);
console.log("   " + JSON.stringify(manifeste.compteurs));

etape(8, "empaquetage pour le navigateur", "../commun/empaqueter.js",
  path.join(ICI, "../../docs/moteur-pse.js"), "audit-pse-client.js", "MoteurPSE");
console.log("publication du module PSE : tout est vert");
