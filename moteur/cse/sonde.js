/* La sonde du module comité : le noyau est commun aux deux moteurs (voir
   moteur/commun/sonde.js), seul le jeu de fiches d'épreuve est propre au
   module. Ici, la fiche « tout renseigné » est construite sur les appels
   q(rubrique, champ, …) du questionnaire, qui en est la seule source. */
const noyau = require("../commun/sonde.js");

function champsDuQuestionnaire() {
  const fs = require("fs"), path = require("path");
  try {
    const q = fs.readFileSync(path.join(__dirname, "questionnaire-cse.js"), "utf8");
    return [...q.matchAll(/^q\(".*?",\s*"([a-zA-Z_][a-zA-Z0-9_]*)"/gm)].map(m => m[1]);
  } catch (e) { return []; }
}
const fichesDEpreuve = () => noyau.fichesDuRepertoire(__dirname, champsDuQuestionnaire());

module.exports = {
  sonder: noyau.sonder,
  champsDuQuestionnaire,
  fichesDEpreuve,
  champsLus: (controles, fiches) => noyau.champsLus(controles, fiches || fichesDEpreuve()),
  reglesJamaisDeclenchees: (regles, fiches) => noyau.reglesJamaisDeclenchees(regles, fiches || fichesDEpreuve()),
  controlesJamaisConcluants: (controles, fiches) => noyau.controlesJamaisConcluants(controles, fiches || fichesDEpreuve()),
};
