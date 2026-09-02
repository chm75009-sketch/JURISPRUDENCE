/* ENGENDRER LA GRILLE DE LA BASE, DÉPLOYÉE LIGNE À LIGNE
   =====================================================

   Le module porte le découpage du décret, vérifié rubrique par rubrique
   (contenu-bdese.js). Ce script le met à plat : une ligne par information que
   la base doit porter. C'est ce qui permet de sortir un tableur que le client
   remplit, au lieu d'une liste de dix thèmes qu'il devrait déployer lui-même.

   Deux arbres : R. 2312-8 en deçà de trois cents salariés, R. 2312-9 au-delà.

   Usage :  node moteur/bdese/engendrer-grille.js                            */
const fs = require("fs");
const path = require("path");
const C = require(path.join(__dirname, "contenu-bdese.js")).construire().contenu;

function lignes(arbre) {
  const out = [];
  arbre.rubriques.forEach(function (r) {
    const sections = r.sections || [];
    sections.forEach(function (s) {
      (s.sujets || []).forEach(function (su) {
        const infos = (su.informations && su.informations.length) ? su.informations : [su.intitule];
        infos.forEach(function (i) {
          out.push([
            r.titre,
            (s.lettre ? s.lettre + ". " : "") + s.titre,
            (su.lettre ? su.lettre + ") " : "") + su.intitule,
            i,
          ]);
        });
      });
    });
    if (!sections.length) out.push([r.titre, "", "", r.titre]);
  });
  return out;
}

const G = { moins300: lignes(C["moins300"]), plus300: lignes(C["au moins300"]) };
const entete = [
  "/* LA GRILLE DE LA BASE DE DONNÉES, DÉPLOYÉE LIGNE À LIGNE",
  "",
  "   Engendré depuis moteur/bdese/contenu-bdese.js. Une ligne par information",
  "   que la base doit porter. Deux arbres : R. 2312-8 en deçà de trois cents",
  "   salariés, R. 2312-9 au-delà.",
  "",
  "   NE PAS MODIFIER À LA MAIN — regénérer avec :",
  "   node moteur/bdese/engendrer-grille.js                                   */",
  "window.GRILLE_BDESE = " + JSON.stringify(G) + ";",
  "",
].join("\n");
fs.writeFileSync(path.join(__dirname, "..", "..", "docs", "bdese-grille.js"), entete);
console.log("grille écrite — moins de 300 : " + G.moins300.length +
            " lignes · au moins 300 : " + G.plus300.length + " lignes");
