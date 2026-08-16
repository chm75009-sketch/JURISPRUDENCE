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
   celui de l'inspection du code : l'un rattrape ce que l'autre manque.

   Ce fichier est le noyau, commun aux deux moteurs. Chaque module y ajoute la
   seule chose qui lui soit propre : où trouver ses fiches d'épreuve. */

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

const INTERNES = /^(then|constructor|toJSON|inspect|Symbol|hasOwnProperty|nodeType)/;

/* champsLus() : pour chaque contrôle, l'ensemble des champs de la fiche
   réellement touchés au cours de l'exécution. */
function champsLus(controles, fiches) {
  const out = {};
  for (const ctl of controles) {
    const vus = new Set();
    for (const f of fiches) sonder(ctl.verdict, f, vus);
    out[ctl.id] = [...vus].filter(c => !INTERNES.test(c));
  }
  return out;
}

/* Ce que le corpus de fiches n'a jamais exécuté. Ce n'est pas un défaut en soi
   — une règle attend une cause ou une situation qu'aucune fiche ne décrit —
   mais c'est la mesure exacte de la couverture réelle. */
function reglesJamaisDeclenchees(regles, fiches) {
  return regles.filter(r => !fiches.some(f => { try { return r.si(f); } catch (e) { return false; } }))
    .map(r => ({ id: r.id, rubrique: r.rubrique, question: r.question }));
}
function controlesJamaisConcluants(controles, fiches) {
  return controles.filter(ctl => !fiches.some(f => {
    try { const v = ctl.verdict(f); return v && v.etat !== "sans objet" && v.etat !== "donnée manquante"; }
    catch (e) { return false; } })).map(c => c.id);
}

/* Les fiches d'épreuve d'un module : celles versées au dépôt, une fiche vide et
   une fiche où chaque champ du questionnaire porte une valeur, pour qu'aucune
   branche ne reste fermée faute de donnée. Les cas contradictoires ne sont pas
   chargés : les exécuter aurait un effet de bord. */
function fichesDuRepertoire(dir, champs) {
  const fs = require("fs"), path = require("path");
  const l = [{}];
  for (const nom of fs.readdirSync(dir).filter(x => /^fiche-.*\.json$/.test(x))) {
    try { l.push(JSON.parse(fs.readFileSync(path.join(dir, nom), "utf8"))); } catch (e) {}
  }
  const pleine = {};
  for (const ch of champs || []) pleine[ch] = 1;
  l.push(pleine);
  return l;
}

module.exports = { sonder, champsLus, reglesJamaisDeclenchees, controlesJamaisConcluants,
  fichesDuRepertoire };
