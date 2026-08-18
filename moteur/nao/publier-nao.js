/* Publier le module « négociation obligatoire » : rejouer la chaîne, mesurer,
   estampiller.

   Aucun chiffre n'est recopié : les compteurs sont ceux que les scripts
   rendent, et les empreintes celles des fichiers sur le disque. La publication
   échoue si l'un des maillons échoue.

   Usage : node publier-nao.js      */
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

etape(1, "dossiers contradictoires sur les contrôles", "tests-nao.js");
etape(2, "questionnaire et non-divergence, dans les deux sens", "questionnaire-nao.js");
etape(3, "propositions du formulaire, vérifiées dans les deux sens", "propositions-nao.js");

const { C, DETECTION, COHERENCE } = require("./controles-nao.js");
const { CAS, BASE, verdicts } = require("./tests-nao.js");
const { LIGNES } = require("./questionnaire-nao.js");
const M = require("./moteur-nao.js");
const T = JSON.parse(fs.readFileSync(path.join(ICI, "textes-nao.json"), "utf8"));

/* La mesure de ce que la chaîne a réellement exercé. */
const tous = [{ nom: "référence", f: BASE }, ...CAS, { nom: "vide", f: {} }];
let nbVerdicts = 0, exceptions = 0, conformitesSurVide = 0, expositionConforme = 0;
for (const cas of tous) {
  const v = verdicts(cas.f);
  for (const [id, x] of Object.entries(v)) {
    nbVerdicts++;
    if (/non exécutable/.test(x.motif || "")) exceptions++;
    if (cas.nom === "vide" && (x.etat === "conforme" || x.etat === "sans objet")) conformitesSurVide++;
    if (DETECTION.includes(id) && x.etat === "conforme") expositionConforme++;
  }
}

const FICHIERS = fs.readdirSync(ICI)
  .filter(x => /\.js$/.test(x) && x !== "publier-nao.js" || /^(textes-nao|fiche-nao)\.json$/.test(x))
  .sort();
const empreintes = {};
for (const f of FICHIERS)
  empreintes[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(ICI, f))).digest("hex").slice(0, 12);
const empreinte = crypto.createHash("sha256")
  .update(FICHIERS.map(f => f + ":" + empreintes[f]).join("\n")).digest("hex").slice(0, 12);

const manifeste = {
  domaine: "négociation obligatoire en entreprise",
  date: new Date().toISOString().slice(0, 10),
  empreinte,
  fichiers: empreintes,
  compteurs: {
    articlesLus: Object.values(T).filter(v => v && v.texte).length,
    themes: Object.keys(M.THEMES).length,
    mentionsAccordMethode: M.MENTIONS.length,
    controles: C.length,
    exposition: DETECTION.length,
    coherence: COHERENCE.length,
    donneesDemandees: LIGNES.length,
    casContradictoires: CAS.length,
    verdicts: nbVerdicts,
    exceptions,
    conformitesOuSansObjetSurFicheVide: conformitesSurVide,
    expositionConcluantConforme: expositionConforme,
  },
};

if (exceptions || conformitesSurVide || expositionConforme) {
  console.error("ÉCHEC — la chaîne a produit ce qu'elle interdit :",
    JSON.stringify({ exceptions, conformitesSurVide, expositionConforme }));
  process.exit(1);
}

/* La relecture des textes à la source. */
try {
  const V = JSON.parse(fs.readFileSync(path.join(ICI, "verification-textes-nao.json"), "utf8"));
  manifeste.textesRelus = { date: V.date, articles: V.articles, concordants: V.concordants,
    ecarts: V.ecarts, sansConclusion: V.douteux };
  if (V.ecarts) { console.error(`ÉCHEC — ${V.ecarts} article(s) du dépôt s'écartent de la source.`); process.exit(1); }
} catch (e) {
  manifeste.textesRelus = null;
  console.log("   (les textes n'ont pas été relus à la source : node verifier-textes-nao.js)");
}

fs.writeFileSync(path.join(ICI, "manifeste-nao.json"), JSON.stringify(manifeste, null, 1));

console.log(`4. manifeste écrit — empreinte ${empreinte}`);
console.log("   " + JSON.stringify(manifeste.compteurs));

etape(5, "empaquetage pour le navigateur", "../commun/empaqueter.js",
  path.join(ICI, "../../docs/moteur-nao.js"), "audit-nao-client.js", "MoteurNAO");
console.log("publication du module NAO : tout est vert");
