/* Publier le module « base de données » : rejouer la chaîne, mesurer, estampiller.

   Usage : node publier-bdese.js      */
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

etape(1, "découpage du décret et mesure de sa couverture", "contenu-bdese.js");
etape(2, "correspondance entre le plancher légal et les intitulés du décret", "plancher-bdese.js");
etape(3, "cas d'épreuve du moteur de régime", "cas-regime.js");
etape(4, "dossiers contradictoires sur les contrôles", "tests-bdese.js");
etape(5, "questionnaire et non-divergence, dans les deux sens", "questionnaire-bdese.js");
etape(6, "propositions du formulaire, vérifiées dans les deux sens", "propositions-bdese.js");

const { C, DETECTION, COHERENCE } = require("./controles-bdese.js");
const CONTENU = require("./contenu-bdese.js");
const PL = require("./plancher-bdese.js");
const R = require("./regime-bdese.js");
const { CAS, BASE, REGIME_INCONNU, verdicts } = require("./tests-bdese.js");
const { CAS: CAS_REG, CAS_DATES, CAS_DELAIS } = require("./cas-regime.js");
const { LIGNES } = require("./questionnaire-bdese.js");
const T = JSON.parse(fs.readFileSync(path.join(ICI, "textes-bdese.json"), "utf8"));

const B = CONTENU.construire();
const tous = [{ nom: "référence", f: BASE }, ...CAS, ...REGIME_INCONNU, { nom: "vide", f: {} }];
let nbVerdicts = 0, exceptions = 0, surVide = 0, preuveConforme = 0, contenuSurRegimeInconnu = 0;
const CONTENU_CTL = ["BDESE-CTL-CNT-01", "BDESE-CTL-CNT-02", "BDESE-CTL-CNT-03", "BDESE-CTL-CNT-04"];
for (const cas of tous) {
  const v = verdicts(cas.f);
  const inconnu = R.regime(cas.f).regime === R.REGIMES.INDETERMINE;
  for (const [id, x] of Object.entries(v)) {
    nbVerdicts++;
    if (/non exécutable/.test(x.motif || "")) exceptions++;
    if (cas.nom === "vide" && (x.etat === "conforme" || x.etat === "sans objet")) surVide++;
    if (DETECTION.includes(id) && x.etat === "conforme") preuveConforme++;
    if (inconnu && CONTENU_CTL.includes(id) && x.etat !== "donnée manquante") contenuSurRegimeInconnu++;
  }
}

const FICHIERS = fs.readdirSync(ICI)
  .filter(x => (/\.js$/.test(x) && x !== "publier-bdese.js") || /^(textes-bdese|fiche-bdese)\.json$/.test(x))
  .sort();
const empreintes = {};
for (const f of FICHIERS)
  empreintes[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(ICI, f))).digest("hex").slice(0, 12);
const empreinte = crypto.createHash("sha256")
  .update(FICHIERS.map(f => f + ":" + empreintes[f]).join("\n")).digest("hex").slice(0, 12);

const manifeste = {
  domaine: "base de données économiques, sociales et environnementales",
  date: new Date().toISOString().slice(0, 10),
  empreinte,
  perimetre: "Le module prépare, structure, documente et audite la base. Il ne fournit pas une base collaborative accessible simultanément à plusieurs catégories d'utilisateurs, et il n'est pas la base : la mise à disposition reste un acte de l'employeur.",
  fichiers: empreintes,
  compteurs: {
    articlesLus: Object.values(T).filter(v => v && v.texte).length,
    themesDuPlancher: PL.PLANCHER.length,
    versionPlancher: B.planchierVersion || null,
    rubriquesR2312_8: B.contenu["moins300"].rubriques.length,
    rubriquesR2312_9: B.contenu["au moins300"].rubriques.length,
    couvertureR2312_8: B.contenu["moins300"].couverture.part,
    couvertureR2312_9: B.contenu["au moins300"].couverture.part,
    controles: C.length,
    detection: DETECTION.length,
    coherence: COHERENCE.length,
    donneesDemandees: LIGNES.length,
    casRegime: CAS_REG.length,
    casDates: CAS_DATES.length,
    casDelais: CAS_DELAIS.length,
    casContradictoires: CAS.length,
    verdicts: nbVerdicts,
    exceptions,
    conformitesOuSansObjetSurFicheVide: surVide,
    contenuAuditeSurRegimeIndetermine: contenuSurRegimeInconnu,
    preuveConcluantConforme: preuveConforme,
  },
};

if (exceptions || surVide || preuveConforme || contenuSurRegimeInconnu) {
  console.error("ÉCHEC — la chaîne a produit ce qu'elle interdit :",
    JSON.stringify({ exceptions, surVide, preuveConforme, contenuSurRegimeInconnu }));
  process.exit(1);
}

/* Le manifeste réglementaire : la liste des articles retenus, avec pour chacun
   son identifiant de version et le résultat de sa relecture à la source. C'est
   le livrable que la validation du projet exigeait avant d'écrire le lot B. */
manifeste.manifesteReglementaire = Object.keys(T).sort().map(n => ({
  article: n, version: T[n].id || null, caracteres: (T[n].texte || "").length }));
try {
  const V = JSON.parse(fs.readFileSync(path.join(ICI, "verification-textes-bdese.json"), "utf8"));
  manifeste.textesRelus = { date: V.date, articles: V.articles, concordants: V.concordants,
    ecarts: V.ecarts, sansConclusion: V.douteux, homonymesEcartes: V.homonymesEcartes };
  const lu = {};
  for (const d of V.detail) lu[d.numero] = d.etat;
  manifeste.manifesteReglementaire.forEach(a => { a.relecture = lu[a.article] || "non relu"; });
  if (V.ecarts) { console.error(`ÉCHEC — ${V.ecarts} article(s) du dépôt s'écartent de la source.`); process.exit(1); }
} catch (e) {
  manifeste.textesRelus = null;
  console.log("   (les textes n'ont pas été relus à la source : node verifier-textes-bdese.js)");
}

fs.writeFileSync(path.join(ICI, "manifeste-bdese.json"), JSON.stringify(manifeste, null, 1));
console.log(`7. manifeste écrit — empreinte ${empreinte}`);
console.log("   " + JSON.stringify(manifeste.compteurs));

etape(8, "empaquetage pour le navigateur", "../commun/empaqueter.js",
  path.join(ICI, "../../docs/moteur-bdese.js"), "audit-bdese-client.js", "MoteurBDESE");
console.log("publication du module BDESE : tout est vert");
