/* Ce que chaque question accepte, module plan de sauvegarde de l'emploi.

   Aucune liste n'est inventée : chacune est tirée du code qui reconnaît les
   valeurs, et moteur/commun/propositions.js le vérifie dans les deux sens —
   une valeur proposée doit exister dans le code, et un littéral que le code
   compare doit être proposé. Le formulaire ne peut donc pas offrir une réponse
   que le moteur ne saurait pas exploiter. */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");
const { L1233_62 } = require("./mesures.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles-pse.js", "moteur-pse.js"].map(lire);

const P = {
  /* Les rubriques du plan : celles de l'article, découpées depuis son texte.
     Elles ne sont pas recopiées ici — elles viennent de mesures.js, qui les
     tient de L. 1233-62. */
  "plan.mesures.rubrique": {
    valeurs: L1233_62.mesures.map(m => m.marque), libre: true, indicatif: true,
    aide: "La rubrique de l'article L. 1233-62 à laquelle la mesure se rattache. L'article énonce « des mesures telles que » : la liste n'est pas limitative, et une mesure peut n'entrer dans aucune rubrique — mais l'administration apprécie le plan au regard de celles-ci.",
  },
  "pse.voie": {
    /* Le code ne teste littéralement que « accord » : le document unilatéral
       est la branche par défaut, et il est déclaré comme telle. */
    valeurs: ["accord"], autres: ["unilateral"], libre: false,
    aide: "Accord collectif majoritaire validé en quinze jours, ou document unilatéral homologué en vingt et un. Le choix commande tout le calendrier et se fait avant la première réunion.",
  },
  "plan.accompagnement": {
    valeurs: ["congé de reclassement", "contrat de sécurisation professionnelle"], libre: false,
    aide: "Le dispositif n'est pas au choix : au moins mille salariés, c'est le congé de reclassement (L. 1233-71) ; en deçà, le contrat de sécurisation professionnelle (L. 1233-66). Les deux ne se cumulent pas.",
  },
  groupe: {
    valeurs: ["oui", "non"], libre: false,
    aide: "L'appartenance à un groupe commande le périmètre d'appréciation des moyens : l'article L. 1233-57-3 fait des moyens du groupe le premier critère.",
  },
  pieces: {
    valeurs: ["comptes-groupe"], libre: true, multiple: true, indicatif: true,
    aide: "Les pièces effectivement versées. Les comptes consolidés du groupe sont la pièce décisive du calibrage : à défaut, l'administration apprécie les moyens sur ce qu'elle a.",
  },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS };

if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
