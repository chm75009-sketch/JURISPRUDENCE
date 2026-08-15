/* Mesurer ce qu'un contrôle lit, au lieu de le deviner.
   Le registre déduisait les champs lus en cherchant « f.nom » dans le code
   source. Deux écritures parfaitement valables lui échappaient : la notation
   entre crochets, f["nom"], et la déstructuration, const {nom} = f. Un contrôle
   pouvait donc lire un champ que personne ne peut renseigner sans que rien ne
   le signale — et la garantie de non-divergence ne tenait plus que par la
   discipline de celui qui écrit.

   Une sonde résout le problème à la racine : la fiche est enveloppée dans un
   Proxy qui enregistre chaque accès, quelle que soit la notation. On n'inspecte
   plus le texte du code, on observe son exécution.

   Réserve, et elle est réelle : un Proxy ne voit que le chemin effectivement
   parcouru. Un contrôle qui sort par sa première branche ne lira pas les champs
   des branches suivantes. C'est pourquoi la sonde s'exécute sur un jeu de fiches
   destiné à ouvrir toutes les branches, et pourquoi son résultat est réuni avec
   celui de l'inspection du code : l'un rattrape ce que l'autre manque. */

function sonder(fn, fiche, vus) {
  const p = new Proxy(fiche, {
    get(cible, cle) {
      if (typeof cle === "string") vus.add(cle);
      return cible[cle];
    },
    has(cible, cle) { if (typeof cle === "string") vus.add(cle); return cle in cible; },
    ownKeys(cible) { return Reflect.ownKeys(cible); },
    getOwnPropertyDescriptor(cible, cle) {
      if (typeof cle === "string") vus.add(cle);
      return Reflect.getOwnPropertyDescriptor(cible, cle);
    },
  });
  try { fn(p); } catch (e) { /* un contrôle qui jette a déjà lu ce qu'il a lu */ }
}

/* Les fiches d'épreuve : celles du dépôt, celles des cas contradictoires, et
   deux fiches extrêmes — l'une vide, l'autre où tout est renseigné — pour
   ouvrir les branches que les dossiers réels n'atteignent pas. */
function fichesDEpreuve() {
  const fs = require("fs"), path = require("path");
  const l = [{}];
  for (const nom of fs.readdirSync(__dirname).filter(x => /^fiche-.*\.json$/.test(x))) {
    try { l.push(JSON.parse(fs.readFileSync(path.join(__dirname, nom), "utf8"))); } catch (e) {}
  }
  /* Les cas contradictoires ne sont pas chargés ici : les exécuter aurait un
     effet de bord. Les fiches du dépôt, la fiche vide et la fiche pleine
     suffisent à ouvrir les branches. */
  /* La fiche « tout renseigné » : chaque champ du questionnaire porte une
     valeur, pour que nulle branche ne soit fermée faute de donnée. */
  const pleine = {};
  try {
    const q = fs.readFileSync(path.join(__dirname, "questionnaire.js"), "utf8");
    const bloc = q.split("const CHAMPS=[")[1].split("\n];")[0];
    for (const m of bloc.matchAll(/\["([a-zA-Z_][a-zA-Z0-9_]*)","/g)) pleine[m[1]] = 1;
  } catch (e) {}
  l.push(pleine);
  return l;
}

/* champsLus() : pour chaque contrôle, l'ensemble des champs de la fiche
   réellement touchés au cours de l'exécution. */
function champsLus(controles, fiches) {
  const jeu = fiches || fichesDEpreuve();
  const out = {};
  for (const ctl of controles) {
    const vus = new Set();
    for (const f of jeu) sonder(ctl.verdict, f, vus);
    out[ctl.id] = [...vus].filter(c => !/^(then|constructor|toJSON|inspect|Symbol)/.test(c));
  }
  return out;
}

/* Ce que le corpus de fiches n'a jamais exécuté. Ce n'est pas un défaut en soi
   — une règle attend une cause ou une situation qu'aucune fiche ne décrit —
   mais c'est la mesure exacte de la couverture réelle. C'est là, et seulement
   là, que se cachaient la cause 4 et la procédure collective. */
function reglesJamaisDeclenchees(regles, fiches) {
  const jeu = fiches || fichesDEpreuve();
  return regles.filter(r => !jeu.some(f => { try { return r.si(f); } catch (e) { return false; } }))
    .map(r => ({ id: r.id, rubrique: r.rubrique, question: r.question }));
}
function controlesJamaisConcluants(controles, fiches) {
  const jeu = fiches || fichesDEpreuve();
  return controles.filter(ctl => !jeu.some(f => {
    try { const v = ctl.verdict(f); return v && v.etat !== "sans objet" && v.etat !== "donnée manquante"; }
    catch (e) { return false; } })).map(c => c.id);
}
module.exports = { sonder, champsLus, fichesDEpreuve, reglesJamaisDeclenchees, controlesJamaisConcluants };
