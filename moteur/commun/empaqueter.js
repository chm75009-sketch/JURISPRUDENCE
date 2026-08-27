/* Empaqueter un moteur pour le navigateur.

   Le dépôt ne construit rien au déploiement — c'est délibéré, Netlify sert
   docs/ tel quel. L'empaquetage se fait donc ici, à la main, et le fichier
   produit est versé au dépôt comme n'importe quelle source.

   Le travail est mince : les modules sont du CommonJS ordinaire. On les
   concatène dans une petite fabrique de modules, on remplace les lectures de
   fichiers par les données inlinées, et on neutralise ce qui n'a pas de sens
   dans un navigateur — l'empreinte du manifeste, qui hache les fichiers du
   disque, et le registre, qui lit le fichier des cas contradictoires.

   Usage : node ../commun/empaqueter.js  (depuis le répertoire du moteur)   */
const fs = require("fs"), path = require("path");

const ICI = process.cwd();
const SORTIE = process.argv[2] || path.join(ICI, "../../docs/moteur-eco.js");
const ENTREE = process.argv[3] || "audit-client.js";
const GLOBALE = process.argv[4] || "MoteurEco";

/* Le corpus des arrêts pèse neuf mégaoctets, dont l'essentiel est le texte
   intégral des décisions — que la grille ne lit jamais. Trois champs suffisent :
   l'identifiant, le numéro de pourvoi et le sommaire. Alléger n'est pas ici une
   optimisation mais une condition : nul ne charge neuf mégaoctets pour remplir
   un formulaire. Le retrait est déclaré dans l'en-tête du fichier produit. */
const ALLEGE = {
  "eco_textes.json": (t) => JSON.stringify(JSON.parse(t)
    .map(d => ({ id: d.id, num: d.num, sommaire: d.sommaire }))),
  /* Même raison côté comité : la grille lit le numéro, la date, la chambre, la
     solution, le sommaire et la publication — jamais le texte intégral. */
  "cse_corpus.json": (t) => { const D = JSON.parse(t), o = {};
    for (const k of Object.keys(D)) { const d = D[k];
      o[k] = { num: d.num, date: d.date, ch: d.ch, sol: d.sol, sommaire: d.sommaire,
               pub: d.pub, rubrique: d.rubrique, sous: d.sous }; }
    return JSON.stringify(o); },
};
const allegements = [];
function donnees(nom) {
  const brut = fs.readFileSync(path.join(ICI, nom), "utf8");
  if (!ALLEGE[nom]) return brut;
  const mince = ALLEGE[nom](brut);
  allegements.push(`${nom} : ${(brut.length / 1024 | 0)} Ko réduits à ${(mince.length / 1024 | 0)} Ko`);
  return mince;
}

/* --- les modules à embarquer, découverts par les require --- */
const MODULES = new Map();
const JSONS = new Map();
/* Un module partagé est désigné par « ../commun/outils.js » : on le normalise
   sur son nom de base, puisque l'empaquetage est plat. */
const norm = r => "./" + path.basename(r);
function lire(nom, chemin) {
  if (MODULES.has(nom)) return;
  let src = fs.readFileSync(chemin || path.join(ICI, nom), "utf8");
  /* Un module qui n'est qu'un renvoi vers un homonyme partagé — le cas
     d'outils.js — se replierait sur lui-même une fois l'empaquetage aplati :
     on lui substitue directement la source visée. */
  const renvoi = src.match(/module\.exports\s*=\s*require\(["'](\.\.?\/[^"']+)["']\)\s*;?\s*$/m);
  if (renvoi && path.basename(renvoi[1]) === path.basename(nom)) {
    const abs = path.resolve(path.dirname(chemin || path.join(ICI, nom)), renvoi[1]);
    if (fs.existsSync(abs)) { chemin = abs; src = fs.readFileSync(abs, "utf8"); }
  }
  MODULES.set(nom, src);
  for (const m of src.matchAll(/require\(["'](\.\.?\/[^"']+)["']\)/g)) {
    const cible = norm(m[1]);
    if (!MODULES.has(cible)) {
      const abs = path.resolve(path.dirname(chemin || path.join(ICI, nom)), m[1]);
      if (fs.existsSync(abs)) lire(cible, abs);
    }
  }
  for (const m of src.matchAll(/readFileSync\((?:__dirname\s*\+\s*)?["']\/?([\w.-]+\.json)["']/g))
    if (!JSONS.has(m[1])) JSONS.set(m[1], donnees(m[1]));
}
lire("./" + ENTREE, path.join(ICI, ENTREE));

/* --- les adaptations, chacune motivée --- */
function adapter(nom, src) {
  /* Les données JSON deviennent des modules comme les autres. */
  src = src.replace(/JSON\.parse\(fs\.readFileSync\((?:__dirname\s*\+\s*)?["']\/?([\w.-]+\.json)["'][^)]*\)\)/g,
    (_, f) => `require("./${f}")`);
  src = src.replace(/fs\.readFileSync\((?:__dirname\s*\+\s*)?["']\/?([\w.-]+\.json)["'][^)]*\)/g,
    (_, f) => `JSON.stringify(require("./${f}"))`);
  /* Le manifeste hache les fichiers du disque : dans le navigateur, l'empreinte
     est celle qui a été calculée à l'empaquetage, et elle est écrite en clair. */
  if (nom === "./manifeste.js") return `module.exports = { construire: () => __MANIFESTE, verifier: () => ({}) };`;
  /* Le registre lit le fichier des cas contradictoires pour rattacher les tests :
     hors du navigateur. Les entrées sont celles mesurées à l'empaquetage. */
  if (nom === "./registre.js") return `module.exports = __REGISTRE;`;
  /* La sonde inspecte le disque ; elle ne sert qu'aux vérifications de la chaîne. */
  if (nom === "./sonde.js") return `module.exports = { sonder(){}, champsLus:()=>({}), fichesDEpreuve:()=>[], reglesJamaisDeclenchees:()=>[], controlesJamaisConcluants:()=>[] };`;
  src = src.replace(/const fs\s*=\s*require\(["']fs["']\)[,;]?/g, "");
  src = src.replace(/,\s*crypto\s*=\s*require\(["']crypto["']\)/g, "");
  return src;
}

/* Les champs du formulaire ne sont pas ressaisis : ils sont extraits du
   questionnaire, seule source. Le formulaire ne peut donc pas demander autre
   chose que ce que la base sait exploiter — c'est la même garantie de
   non-divergence, prolongée jusqu'à l'écran. */
const CHAMPS = (() => {
  /* Deux questionnaires, deux écritures : le module économique déclare un
     tableau CHAMPS, celui du comité appelle q(rubrique, champ, libellé, format).
     On lit l'une ou l'autre, jamais une liste tenue à la main. */
  for (const nom of ["questionnaire.js", "questionnaire-cse.js", "questionnaire-pse.js", "questionnaire-bdese.js", "questionnaire-nao.js", "questionnaire-sst.js", "questionnaire-discipline.js"]) {
    const chemin = path.join(ICI, nom);
    if (!fs.existsSync(chemin)) continue;
    const src = fs.readFileSync(chemin, "utf8");
    if (src.includes("const CHAMPS=[")) {
      try { return eval("[" + src.split("const CHAMPS=[")[1].split("\n];")[0] + "]"); }
      catch (e) { return []; }
    }
    const par = new Map();
    for (const m of src.matchAll(/^q\((".*?"),\s*(".*?"),\s*(".*?"),\s*(".*?")/gm)) {
      try {
        const [rub, cle, lib, fmt] = [m[1], m[2], m[3], m[4]].map(x => JSON.parse(x));
        if (!par.has(rub)) par.set(rub, []);
        par.get(rub).push([cle, lib, fmt]);
      } catch (e) {}
    }
    if (par.size) return [...par.entries()];
  }
  return [];
})();

/* Les champs composés qui désignent une liste, déclarés par le questionnaire :
   « pieces » est un tableau d'objets — une ligne par pièce — là où « pse » est
   un objet unique. Le formulaire en tire un éditeur de tableau ; sans cette
   distinction il composait un objet là où le moteur attend un tableau, et le
   contrôle des pièces échouait à l'exécution. */
const LISTES = (() => {
  for (const nom of ["questionnaire.js", "questionnaire-cse.js", "questionnaire-pse.js", "questionnaire-bdese.js", "questionnaire-nao.js", "questionnaire-sst.js", "questionnaire-discipline.js"]) {
    const chemin = path.join(ICI, nom);
    if (!fs.existsSync(chemin)) continue;
    const m = fs.readFileSync(chemin, "utf8").match(/const COMPOSES_LISTE\s*=\s*new Set\(\[([^\]]*)\]\)/);
    if (m) return [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
  }
  return [];
})();

/* Les colonnes d'un champ qui porte un tableau d'objets.

   Le formulaire n'avait, pour ces champs, qu'une zone de texte réclamant du
   JSON. Personne ne compose des accolades sur un téléphone, et la question
   « Redevances de marque, management fees et prix de transfert versés aux
   sociétés du groupe, par exercice » n'appelle pas des accolades mais deux
   colonnes : l'exercice et le montant.

   Les colonnes ne sont pas écrites à la main. Elles sont l'union des clés que
   portent les dossiers de référence versés au dépôt — des dossiers que la
   chaîne de tests exécute à chaque publication, donc des clés que le moteur
   consomme réellement — et chacune est ensuite confrontée au code : une clé que
   nul contrôle ne lit n'est pas offerte, et le retrait est déclaré. */
const COLONNES = (() => {
  const out = {};
  /* Le type d'une colonne se lit sur la valeur que portent les dossiers de
     référence : le formulaire offre alors le bon champ de saisie — une date,
     un nombre, un oui/non — plutôt qu'une ligne de texte pour tout. */
  const forme = v => typeof v === "boolean" ? "oui / non"
    : (typeof v === "number" ? "nombre"
    : (/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? "AAAA-MM-JJ" : "texte"));
  const fiches = fs.readdirSync(ICI).filter(x => /^fiche-.*\.json$/.test(x));
  for (const nom of fiches) {
    let f;
    try { f = JSON.parse(fs.readFileSync(path.join(ICI, nom), "utf8")); } catch (e) { continue; }
    /* Les listes ne sont pas toutes de premier niveau : « plan.mesures » vit
       sous « plan ». On descend d'un cran, et la clé retenue est le chemin
       complet — celui que le questionnaire demande. */
    const plat = {};
    for (const [cle, val] of Object.entries(f)) {
      plat[cle] = val;
      if (val && typeof val === "object" && !Array.isArray(val))
        for (const [k2, v2] of Object.entries(val)) plat[cle + "." + k2] = v2;
    }
    for (const [cle, val] of Object.entries(plat)) {
      if (LISTES.indexOf(cle) >= 0) continue;          /* déjà décrit par ses sous-champs */
      if (!Array.isArray(val) || !val.length) continue;
      if (!val.every(x => x && typeof x === "object" && !Array.isArray(x))) continue;
      /* Un tableau ne représente pas une valeur qui est elle-même un tableau :
         « categories » porte la liste de ses salariés. Ces champs gardent la
         zone de texte, où la structure reste visible. */
      if (val.some(o => Object.values(o).some(v => v && typeof v === "object"))) {
        out[cle] = null; continue;
      }
      const cols = out[cle] = out[cle] || [];
      for (const o of val) for (const [k, v] of Object.entries(o)) {
        if (!cols.some(c => c[0] === k)) cols.push([k, forme(v)]);
      }
    }
  }
  const src = [...MODULES.values()].join("\n");
  const retirees = [], imbriques = [];
  for (const cle of Object.keys(out)) {
    if (!out[cle]) { imbriques.push(cle); delete out[cle]; continue; }
    const gardees = out[cle].filter(c => new RegExp("[.\"']" + c[0] + "\\b").test(src));
    out[cle].filter(c => gardees.indexOf(c) < 0).forEach(c => retirees.push(cle + "." + c[0]));
    /* Une seule colonne n'est pas un tableau : la zone de texte suffit. */
    if (gardees.length >= 2) out[cle] = gardees; else delete out[cle];
  }
  if (imbriques.length)
    console.log("  champs laissés en saisie libre — ils portent une valeur imbriquée : " + imbriques.join(", "));
  if (retirees.length)
    console.log("  colonnes écartées — aucun contrôle ne les lit : " + retirees.join(", "));
  return out;
})();

/* Les propositions offertes par le formulaire : les valeurs que la base sait
   exploiter, extraites du code des contrôles et vérifiées dans les deux sens.
   Le formulaire ne peut donc pas proposer autre chose que ce que le moteur
   reconnaît — c'est la garantie de non-divergence, prolongée aux réponses. */
let APPELEES = {};
const PROPOSITIONS = (() => {
  for (const nom of ["propositions.js", "propositions-cse.js", "propositions-pse.js", "propositions-bdese.js", "propositions-nao.js", "propositions-sst.js", "propositions-discipline.js"]) {
    const chemin = path.join(ICI, nom);
    if (!fs.existsSync(chemin)) continue;
    try {
      const m = require(chemin);
      if (m.ECARTS && m.ECARTS.length) {
        console.error("ÉCHEC — propositions et code divergent :\n  " + m.ECARTS.join("\n  "));
        process.exit(1);
      }
      APPELEES = m.PIECES_APPELEES || {};
      return m.P || {};
    } catch (e) { console.error("propositions illisibles : " + e.message); process.exit(1); }
  }
  return {};
})();

/* --- ce qui doit être calculé ici, puisqu'il ne peut pas l'être là-bas --- */
/* L'empreinte et les compteurs : produits par manifeste.js là où il existe,
   lus dans le manifeste déjà publié sinon. Aucun chiffre n'est inventé. */
const MAN = (() => {
  try { return require(path.join(ICI, "manifeste.js")).construire(); } catch (e) {}
  for (const nom of fs.readdirSync(ICI).filter(x => /^manifeste.*\.json$/.test(x))) {
    try { return JSON.parse(fs.readFileSync(path.join(ICI, nom), "utf8")); } catch (e) {}
  }
  return { empreinte: "—", compteurs: {} };
})();
const REG = (() => { try { const r = require(path.join(ICI, "registre.js"));
  return { construire: r.construire(), coherence: r.coherence(),
    DETECTION: [...r.DETECTION], COHERENCE: [...(r.COHERENCE || [])] }; }
  catch (e) { return null; } })();

/* Les modules ne portent pas le même nom d'un moteur à l'autre — moteur.js et
   moteur-cse.js, grille.js et grille-cse.js. On les désigne par leur rôle. */
const MOD = role => {
  for (const nom of MODULES.keys())
    if (new RegExp(`^\\./${role}(-[a-z]+)?\\.js$`).test(nom)) return nom;
  return null;   /* tous les moteurs n'ont pas de grille ni de barème d'actions */
};
/* Un rôle absent n'est pas empaqueté : l'exiger ferait échouer le chargement
   de la page sur un module qui n'en a pas besoin. */
const ROLE = (cle, role) => { const n = MOD(role);
  return n ? `\n    ${cle}: require(${JSON.stringify(n)}),` : ""; };

const morceaux = [];
for (const [nom, src] of MODULES) morceaux.push(
  `__def(${JSON.stringify(nom)}, function(module, exports, require){\n${adapter(nom, src)}\n});`);
for (const [nom, txt] of JSONS) morceaux.push(
  `__def(${JSON.stringify("./" + nom)}, function(module){ module.exports = ${txt}; });`);

/* L'en-tête nommait « licenciement économique » et « moteur/economique » quel
   que soit le module empaqueté : sept fichiers sur huit annonçaient une source
   qui n'était pas la leur, et disaient au lecteur d'aller rejouer l'empaquetage
   au mauvais endroit. Le répertoire courant est la seule source sûre : c'est
   depuis lui que l'empaquetage est lancé. */
const MODULE = path.basename(ICI);

const sortie = `/* Moteur d'audit « ${MODULE} » — version navigateur (${GLOBALE}).

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/${MODULE}, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : ${MAN.empreinte}
   ${JSON.stringify(MAN.compteurs)}
${allegements.length ? "\n   Jeux de données allégés — champs non lus par la grille, retirés :\n" + allegements.map(x => "   · " + x).join("\n") + "\n" : ""}*/
(function (global) {
  "use strict";
  var __sources = {}, __cache = {};
  function __def(nom, fn) { __sources[nom] = fn; }
  function require(nom) {
    if (nom === "fs" || nom === "crypto" || nom === "path") return {};
    nom = "./" + nom.split("/").pop();
    if (__cache[nom]) return __cache[nom].exports;
    var src = __sources[nom];
    if (!src) throw new Error("module absent de l'empaquetage : " + nom);
    var mod = __cache[nom] = { exports: {} };
    src(mod, mod.exports, require);
    return mod.exports;
  }
  var __MANIFESTE = ${JSON.stringify(MAN)};
  var __REGISTRE = (function () { var r = ${JSON.stringify(REG)} || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

${morceaux.join("\n\n")}

  global.${GLOBALE} = {
    audit: require(${JSON.stringify("./" + ENTREE)}),
${ROLE("moteur", "moteur")}${ROLE("grille", "grille")}${ROLE("controles", "controles")}${ROLE("actions", "actions")}
    manifeste: __MANIFESTE,
    champs: ${JSON.stringify(CHAMPS)},
    propositions: ${JSON.stringify(PROPOSITIONS)},
    listes: ${JSON.stringify(LISTES)},
    colonnes: ${JSON.stringify(COLONNES)},
    piecesAppelees: ${JSON.stringify(APPELEES)},
  };
})(typeof window !== "undefined" ? window : this);
`;
fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
fs.writeFileSync(SORTIE, sortie);
console.log(`${path.relative(ICI, SORTIE)} · ${(sortie.length / 1024 | 0)} Ko · ${MODULES.size} modules, ${JSONS.size} jeux de données · ${Object.keys(PROPOSITIONS).length} questions à propositions · empreinte ${MAN.empreinte}`);
allegements.forEach(a => console.log('  allégé — ' + a));
