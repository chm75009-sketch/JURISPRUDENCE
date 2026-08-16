/* Ce que chaque question accepte, module comité.

   Les listes ne sont pas inventées : chacune est tirée du code qui reconnaît
   les valeurs, et moteur/commun/propositions.js le vérifie dans les deux sens à
   la publication. Voir l'en-tête de ce fichier pour la règle. */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");
const M = require("./moteur-cse.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles-cse.js", "moteur-cse.js"].map(lire);
const CTL = SOURCES[0];

/* Les codes de pièces que les contrôles savent chercher, relevés dans leur
   source : piece(f, "…"). Aucune liste tenue à la main. */
const CODES_PIECES = [...new Set([...CTL.matchAll(/piece\(f,\s*"([^"]+)"/g)].map(m => m[1]))].sort();

/* Les trois consultations récurrentes que le contrôle recherche, relevées dans
   sa source plutôt que recopiées. */
const RECURRENTES = (() => {
  const m = CTL.match(/const dues = \[([^\]]+)\]/);
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]) : [];
})();

const P = {
  sourceDecoupage: { valeurs: ["accord"], autres: ["décision unilatérale", "décision administrative"], libre: true,
    aide: "L'ordre des sources est strict : accord d'entreprise majoritaire d'abord, décision de l'employeur à défaut, décision administrative en dernier lieu." },
  instanceConsultee: { valeurs: ["central"], autres: ["établissement", "les deux"], libre: true,
    aide: "Le comité central pour ce qui excède les pouvoirs des chefs d'établissement ; les comités d'établissement pour les mesures d'adaptation qui leur sont propres." },
  "expertise.cas": { valeurs: Object.keys(M.EXPERTISES), libre: false,
    aide: "Le cas de recours commande la répartition du coût : la base ne connaît que ceux-là, et refuse de conclure sur un autre." },
  pieces: { valeurs: CODES_PIECES, libre: true, multiple: true,
    aide: "Les pièces effectivement versées. Une déclaration sans pièce ne produit jamais « conforme » : elle produit « risque à vérifier »." },
  consultationsRecurrentes: { valeurs: RECURRENTES, libre: true, multiple: true, objet: "objet",
    aide: "À défaut d'accord en aménageant la périodicité, les trois sont annuelles." },
  formationsDispensees: { valeurs: ["santé, sécurité et conditions de travail", "formation économique"],
    libre: true, multiple: true, indicatif: true,
    aide: "La formation en santé, sécurité et conditions de travail est due à tous les membres de la délégation du personnel ; le contrôle la reconnaît à sa mention, quelle qu'en soit la formulation exacte." },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS, CODES_PIECES, RECURRENTES };
if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions · ${CODES_PIECES.length} codes de pièces · ${RECURRENTES.length} consultations récurrentes`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
