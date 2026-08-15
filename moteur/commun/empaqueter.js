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

/* Le corpus des arrêts pèse neuf mégaoctets, dont l'essentiel est le texte
   intégral des décisions — que la grille ne lit jamais. Trois champs suffisent :
   l'identifiant, le numéro de pourvoi et le sommaire. Alléger n'est pas ici une
   optimisation mais une condition : nul ne charge neuf mégaoctets pour remplir
   un formulaire. Le retrait est déclaré dans l'en-tête du fichier produit. */
const ALLEGE = {
  "eco_textes.json": (t) => JSON.stringify(JSON.parse(t)
    .map(d => ({ id: d.id, num: d.num, sommaire: d.sommaire }))),
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
  try {
    const q = fs.readFileSync(path.join(ICI, "questionnaire.js"), "utf8");
    const bloc = q.split("const CHAMPS=[")[1].split("\n];")[0];
    return eval("[" + bloc + "]");
  } catch (e) { return []; }
})();

/* --- ce qui doit être calculé ici, puisqu'il ne peut pas l'être là-bas --- */
const MAN = (() => { try { return require(path.join(ICI, "manifeste.js")).construire(); }
  catch (e) { return { empreinte: "—", compteurs: {} }; } })();
const REG = (() => { try { const r = require(path.join(ICI, "registre.js"));
  return { construire: r.construire(), coherence: r.coherence(),
    DETECTION: [...r.DETECTION], COHERENCE: [...(r.COHERENCE || [])] }; }
  catch (e) { return null; } })();

const morceaux = [];
for (const [nom, src] of MODULES) morceaux.push(
  `__def(${JSON.stringify(nom)}, function(module, exports, require){\n${adapter(nom, src)}\n});`);
for (const [nom, txt] of JSONS) morceaux.push(
  `__def(${JSON.stringify("./" + nom)}, function(module){ module.exports = ${txt}; });`);

const sortie = `/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
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
  var __REGISTRE = (function () { var r = ${JSON.stringify(REG)};
    return { construire: function () { return r.construire; },
             coherence: function () { return r.coherence; },
             DETECTION: new Set(r.DETECTION), COHERENCE: new Set(r.COHERENCE) }; })();

${morceaux.join("\n\n")}

  global.MoteurEco = {
    audit: require("./audit-client.js"),
    moteur: require("./moteur.js"),
    grille: require("./grille.js"),
    controles: require("./controles.js"),
    gravite: require("./gravite.js"),
    actions: require("./actions.js"),
    valider: require("./valider.js"),
    manifeste: __MANIFESTE,
    champs: ${JSON.stringify(CHAMPS)},
  };
})(typeof window !== "undefined" ? window : this);
`;
fs.mkdirSync(path.dirname(SORTIE), { recursive: true });
fs.writeFileSync(SORTIE, sortie);
console.log(`${path.relative(ICI, SORTIE)} · ${(sortie.length / 1024 | 0)} Ko · ${MODULES.size} modules, ${JSONS.size} jeux de données · empreinte ${MAN.empreinte}`);
allegements.forEach(a => console.log('  allégé — ' + a));
