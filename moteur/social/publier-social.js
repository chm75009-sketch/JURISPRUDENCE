/* Publier le module « audit social » : rejouer la chaîne, mesurer,
   estampiller, empaqueter.

   Aucun chiffre n'est recopié : les compteurs sont mesurés sur le code et les
   données au moment de la publication. La publication échoue si un maillon
   échoue, si une fiche vide produit une conformité ou un « sans objet », si
   un item conventionnel ou renvoyé à un module conclut « conforme », ou si le
   référentiel cite un article non lu à la source.

   Usage : node publier-social.js                                            */
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

etape(1, "données des modèles, régénérées depuis les modules BDESE et CSE", "generer-donnees-modeles.js");
etape(2, "chargement du référentiel — un article cité non lu fait échouer", "referentiel-social.js");
etape(3, "dossiers contradictoires, profils types et qualité des modèles", "tests-social.js");
etape(4, "questionnaire et non-divergence, dans les deux sens", "questionnaire-social.js");

const R = require("./referentiel-social.js");
const C = require("./controles-social.js");
const P = require("./plan-social.js");
const Q = require("./questionnaire-social.js");
const { MODELES: MODELES_SOC } = require("./modeles-social.js");
const T = JSON.parse(fs.readFileSync(path.join(ICI, "textes-social.json"), "utf8"));
const NC = JSON.parse(fs.readFileSync(path.join(ICI, "textes-social-non-confirmes.json"), "utf8"));

/* La mesure de ce que la chaîne interdit. */
let conformitesSurVide = 0, conclusionsInterdites = 0;
const vVide = C.verdicts({}, {});
for (const x of Object.values(vVide))
  if (x.etat === "conforme" || x.etat === "sans objet") conformitesSurVide++;

const MAX = { entreprise: "X", dateAudit: "2026-08-19", effectif: 320, seuilDepuis12Mois: "oui",
  groupe: "oui", etablissementsDistincts: "oui", secteur: "industrie", conventionCollective: "test",
  accordsCollectifs: "oui", sectionSyndicale: "oui", matieresInflammables: "oui", cadres: "oui",
  projetLicenciementEco: "oui" };
for (const it of R.REF) {
  const rep = {};
  for (const vf of it.verifs || []) rep[vf.cle] = vf.regle === "oui" ? "oui" : "2026-06-01";
  const v = C.verdictItem(it, MAX, { coches: { [it.id]: "oui" }, reponses: { [it.id]: rep } });
  if (!C.peutCONF(it) && v.etat === "conforme") conclusionsInterdites++;
}

/* Aucun article non confirmé ne doit être cité par un item. */
let citationsInterdites = 0;
for (const it of R.REF) for (const n of it.articles)
  if (NC.articles && NC.articles[n]) citationsInterdites++;

/* Les liens de régularisation : un lien mort est un mensonge fait au client.
   Chaque clé de parcours doit exister dans docs/parcours.js, chaque clé de
   document dans docs/documents.html — mesuré sur les fichiers eux-mêmes, non
   sur une liste tenue à la main. */
const PARCOURS_SRC = fs.readFileSync(path.join(ICI, "../../docs/parcours.js"), "utf8");
const DOCS_SRC = fs.readFileSync(path.join(ICI, "../../docs/documents.html"), "utf8");
const clesPresentes = (src, motif) =>
  new Set([...src.matchAll(motif)].map(m => m[1]));
const CLES_PARCOURS = clesPresentes(PARCOURS_SRC, /^\s{4}cle:\s*"([a-z0-9-]+)"/gm);
const CLES_DOCS = clesPresentes(DOCS_SRC, /^\s{4}cle:\s*"([a-z0-9-]+)"/gm);
/* Les outils de Juris Expert : mesurés sur docs/juris-expert.js, pas sur une
   liste recopiée. Un renvoi vers un outil qui n'existe pas est un lien mort
   comme un autre — et il envoie le client chez le voisin pour rien. */
const JX_SRC = fs.readFileSync(path.join(ICI, "../../docs/juris-expert.js"), "utf8");
const CLES_JX = clesPresentes(JX_SRC, /^\s{4}"([a-z0-9-]+)":\s*\{$/gm);

let liensMorts = [], obligationsAvecParcours = 0, obligationsAvecDocument = 0,
    obligationsSansParcours = [], obligationsAvecOutilJX = 0;
for (const it of R.REF) {
  const g = it.regularisation || {};
  if (g.parcours) {
    obligationsAvecParcours++;
    if (!CLES_PARCOURS.has(g.parcours)) liensMorts.push(`${it.id} → parcours « ${g.parcours} »`);
  } else obligationsSansParcours.push(it.id);
  if (g.document) {
    obligationsAvecDocument++;
    if (!CLES_DOCS.has(g.document)) liensMorts.push(`${it.id} → document « ${g.document} »`);
  }
  if (g.jx) {
    obligationsAvecOutilJX++;
    if (!CLES_JX.has(g.jx)) liensMorts.push(`${it.id} → outil Juris Expert « ${g.jx} »`);
  }
}
if (!CLES_JX.size) liensMorts.push("docs/juris-expert.js ne déclare aucun outil : la table n'a pas été lue");
/* Les parcours nommés par le référentiel mais absents de la page, et
   l'inverse : le référentiel ne doit pas promettre un parcours qui n'existe
   pas, et un parcours ajouté doit être nommé quelque part. */
for (const cle of Object.keys(R.PARCOURS_NOMS))
  if (!CLES_PARCOURS.has(cle)) liensMorts.push(`table des noms → parcours « ${cle} » absent de docs/parcours.js`);

const FICHIERS = fs.readdirSync(ICI)
  .filter(x => /\.js$/.test(x) && x !== "publier-social.js"
    || /^(textes-social|textes-social-non-confirmes)\.json$/.test(x))
  .sort();
const empreintes = {};
for (const f of FICHIERS)
  empreintes[f] = crypto.createHash("sha256").update(fs.readFileSync(path.join(ICI, f))).digest("hex").slice(0, 12);
const empreinte = crypto.createHash("sha256")
  .update(FICHIERS.map(f => f + ":" + empreintes[f]).join("\n")).digest("hex").slice(0, 12);

const parCat = {};
for (const c of R.CATEGORIES) parCat[c] = R.REF.filter(x => x.categorie === c).length;

const manifeste = {
  domaine: "audit social — le chapeau des obligations de l'employeur",
  date: new Date().toISOString().slice(0, 10),
  empreinte,
  fichiers: empreintes,
  compteurs: {
    obligations: R.REF.length,
    parCategorie: parCat,
    articlesLus: Object.keys(T).length,
    articlesNonConfirmes: Object.keys((NC.articles) || {}).length,
    articlesCites: [...new Set(R.REF.flatMap(x => x.articles))].length,
    renvoisModules: R.REF.filter(x => x.module).length,
    itemsConventionnels: R.REF.filter(x => x.convention).length,
    itemsGeneriques: R.REF.filter(x => x.generique).length,
    questionsOrientation: Q.LIGNES.length,
    questionsVerification: R.REF.reduce((s, x) => s + (x.verifs || []).length, 0),
    conformitesOuSansObjetSurProfilVide: conformitesSurVide,
    conclusionsConformesInterdites: conclusionsInterdites,
    citationsDArticlesNonConfirmes: citationsInterdites,
    parcoursDeRegularisation: CLES_PARCOURS.size,
    obligationsLieesAUnParcours: obligationsAvecParcours,
    obligationsLieesAUnDocument: obligationsAvecDocument,
    obligationsSansParcours: obligationsSansParcours.length,
    outilsJurisExpert: CLES_JX.size,
    obligationsLieesAUnOutilJurisExpert: obligationsAvecOutilJX,
    obligationsAvecModeleComplet: R.REF.filter(x => !!MODELES_SOC[x.id]).length,
    liensDeRegularisationMorts: liensMorts.length,
  },
  obligationsSansParcours,
};

if (conformitesSurVide || conclusionsInterdites || citationsInterdites || liensMorts.length) {
  console.error("ÉCHEC — la chaîne a produit ce qu'elle interdit :",
    JSON.stringify({ conformitesSurVide, conclusionsInterdites, citationsInterdites, liensMorts }));
  process.exit(1);
}

/* La relecture des textes à la source, si elle a été jouée. */
try {
  const V = JSON.parse(fs.readFileSync(path.join(ICI, "verification-textes-social.json"), "utf8"));
  manifeste.textesRelus = { date: V.date, articles: V.articles, concordants: V.concordants,
    ecarts: V.ecarts, sansConclusion: V.douteux };
  if (V.ecarts) { console.error(`ÉCHEC — ${V.ecarts} article(s) du dépôt s'écartent de la source.`); process.exit(1); }
} catch (e) {
  manifeste.textesRelus = null;
  console.log("   (les textes n'ont pas été relus à la source : node verifier-textes-social.js)");
}

fs.writeFileSync(path.join(ICI, "manifeste-social.json"), JSON.stringify(manifeste, null, 1));
console.log(`5. manifeste écrit — empreinte ${empreinte}`);
console.log("   " + JSON.stringify(manifeste.compteurs));

etape(6, "empaquetage pour le navigateur", "../commun/empaqueter.js",
  path.join(ICI, "../../docs/moteur-social.js"), "audit-social-client.js", "MoteurSocial");
console.log("publication du module social : tout est vert");
