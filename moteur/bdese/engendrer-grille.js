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

/* LÀ OÙ LE TABLEAU DU DÉCRET S'ARRÊTE, ET OÙ SES NOTES COMMENCENT.

   Le découpage suit le texte de R. 2312-9 tel qu'il est publié. Or ce texte
   ne s'arrête pas à la dernière ligne du tableau : il enchaîne sur la
   nomenclature des qualifications (note II) puis sur les cinquante-deux notes
   de bas de page, sans rupture typographique que l'extraction puisse voir.
   Résultat mesuré le 12 septembre 2026 dans le classeur livré : la rubrique
   Environnement se terminait par dix lignes qui n'étaient ni des rubriques ni
   des informations — « techniciens », « agents de maîtrise », « (effectif du
   mois », et le bloc des notes (1) à (52). Elles s'affichaient au client comme
   des données à porter.

   La coupure se fait donc ici, sur la première ligne de la nomenclature, qui
   est stable et littérale. Tout ce qui suit, dans ce sujet, est du commentaire
   du décret, non du contenu dû. */
const FIN_DU_TABLEAU = "employés, techniciens et agents de maîtrise (ETAM)";

function lignes(arbre) {
  const out = [];
  arbre.rubriques.forEach(function (r) {
    const sections = r.sections || [];
    sections.forEach(function (s) {
      (s.sujets || []).forEach(function (su) {
        let infos = (su.informations && su.informations.length) ? su.informations : [su.intitule];
        const coupe = infos.indexOf(FIN_DU_TABLEAU);
        if (coupe >= 0) infos = infos.slice(0, coupe);
        /* Deux fragments survivent à la coupure parce qu'ils appartiennent à
           un autre sujet : « (effectif du mois » et « . (20) Faire une grille
           des rémunérations… ». Une information due commence par une lettre ou
           un chiffre ; celle qui commence par une ponctuation est un morceau de
           phrase, jamais une donnée à porter. Mesuré : la règle retire ces deux
           lignes-là et aucune autre, sur les deux arbres. */
        infos = infos.filter(function (i) { return /^[A-Za-zÀ-ÿ0-9]/.test(String(i).trim()); });
        infos.forEach(function (i) {
          /* Une rubrique sans section produit une ligne qui se répète
             elle-même : « Environnement (1) », en section, en sujet et en
             information. Ce n'est pas une donnée à porter, c'est le titre de
             la rubrique revenu trois fois. On l'écarte, sans toucher aux
             rubriques qui n'ont qu'une seule information réelle, comme le
             montant de la contribution aux activités sociales. */
          const secTitre = (s.lettre ? s.lettre + ". " : "") + s.titre;
          if (secTitre === i && String(r.titre).indexOf(i) === 0) return;
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
