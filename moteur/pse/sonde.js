/* La sonde du module économique : le noyau est commun aux deux moteurs (voir
   moteur/commun/sonde.js), seul le jeu de fiches d'épreuve est propre au
   module. Ici, la fiche « tout renseigné » est construite sur le tableau CHAMPS
   du questionnaire. */
const noyau = require("../commun/sonde.js");

function champsDuQuestionnaire() {
  const fs = require("fs"), path = require("path");
  try {
    const q = fs.readFileSync(path.join(__dirname, "questionnaire.js"), "utf8");
    const bloc = q.split("const CHAMPS=[")[1].split("\n];")[0];
    return [...bloc.matchAll(/\["([a-zA-Z_][a-zA-Z0-9_]*)","/g)].map(m => m[1]);
  } catch (e) { return []; }
}
const fichesDEpreuve = () => noyau.fichesDuRepertoire(__dirname, champsDuQuestionnaire());

module.exports = {
  sonder: noyau.sonder,
  fichesDEpreuve,
  champsLus: (controles, fiches) => noyau.champsLus(controles, fiches || fichesDEpreuve()),
  reglesJamaisDeclenchees: (regles, fiches) => noyau.reglesJamaisDeclenchees(regles, fiches || fichesDEpreuve()),
  controlesJamaisConcluants: (controles, fiches) => noyau.controlesJamaisConcluants(controles, fiches || fichesDEpreuve()),
};
