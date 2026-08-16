/* Ce que chaque question accepte, module base de données.

   Les listes viennent du code qui reconnaît les valeurs, et moteur/commun/
   propositions.js le vérifie dans les deux sens à la publication : une valeur
   proposée doit exister dans le code, un littéral que le code compare doit être
   proposé. Le formulaire ne peut donc pas offrir une réponse que le moteur ne
   saurait pas exploiter. */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");
const CONTENU = require("./contenu-bdese.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles-bdese.js", "regime-bdese.js"].map(lire);

/* Les rubriques que le décret nomme, découpées depuis son texte : celles de
   R. 2312-8 et celles de R. 2312-9, réunies. Elles ne sont pas recopiées. */
const RUBRIQUES = (() => {
  const b = CONTENU.construire().contenu;
  const noms = new Set();
  for (const cle of Object.keys(b)) for (const r of b[cle].rubriques) noms.add(r.titre);
  return [...noms];
})();

const OUI_NON = ["oui", "non"];

const P = {
  accordRecherche: { valeurs: OUI_NON, libre: false,
    aide: "Le régime supplétif ne s'applique pas faute d'avoir cherché : il s'applique en l'absence d'accord, ce qui est un fait à établir. Tant que la recherche n'est pas déclarée faite, le module répond « régime indéterminé » et n'audite aucun contenu." },
  accordEntreprise: { valeurs: OUI_NON, libre: false,
    aide: "Accord d'entreprise, ou, en l'absence de délégué syndical, accord entre l'employeur et le comité adopté à la majorité des titulaires (L. 2312-21, al. 1er)." },
  accordEntrepriseVerse: { valeurs: OUI_NON, libre: false,
    aide: "Un accord déclaré et non versé laisse le régime indéterminé : le contenu exigible est celui qu'il définit, et il ne se devine pas." },
  accordBranche: { valeurs: OUI_NON, libre: false,
    aide: "L'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés, et seulement à défaut d'accord d'entreprise." },
  accordBrancheVerse: { valeurs: OUI_NON, libre: false, aide: "Même règle que pour l'accord d'entreprise : déclaré et non versé, il laisse le régime indéterminé." },
  etablissementsDistincts: { valeurs: OUI_NON, libre: false,
    aide: "Le niveau auquel la base est mise en place se fixe par l'accord de l'article L. 2312-21, 2°." },
  accordPeriodiciteConsultations: { valeurs: OUI_NON, libre: false,
    aide: "Attention : ce n'est PAS l'accord qui définit la base. Celui-ci relève de l'article L. 2312-19 et porte sur le contenu, la périodicité et les modalités des consultations récurrentes. Un accord sur la base ne déplace pas la périodicité des consultations." },
  accordDelaisConsultation: { valeurs: OUI_NON, libre: false,
    aide: "L'accord de l'article L. 2312-19, 4°, fixe les délais dans lesquels les avis sont rendus. À défaut, le délai supplétif de l'article R. 2312-6 s'applique : un mois, deux avec expert, trois lorsque des expertises interviennent au niveau central et d'établissement." },
  "base.informationMiseAJour": { valeurs: OUI_NON, libre: false,
    aide: "C'est cette information — ou la communication des informations — qui fait courir le délai de consultation (R. 2312-5). Sans elle, le délai ne court pas." },
  "base.formePerspectives": {
    valeurs: ["chiffrée", "grandes tendances", "mixte"], libre: true, indicatif: true,
    aide: "Les trois années à venir se présentent sous forme de données chiffrées ou, à défaut, sous forme de GRANDES TENDANCES (R. 2312-10). Les tendances suffisent : exiger des chiffres produirait des non-conformités fausses. L'employeur doit en revanche indiquer, en les motivant, les informations qui ne peuvent recevoir ni chiffres ni tendances." },
  "base.niveau": {
    /* Le contrôle reprend le niveau tel quel dans son motif, sans le comparer à
       une liste : la proposition est indicative, et déclarée telle. */
    valeurs: ["entreprise", "établissement", "les deux"], libre: true, indicatif: true,
    aide: "En l'absence d'accord, la base est constituée au niveau de l'entreprise (R. 2312-11) ; l'accord peut fixer un autre niveau dans les entreprises à établissements distincts." },
  "base.themes.theme": {
    valeurs: RUBRIQUES, libre: true, indicatif: true,
    aide: "Les rubriques que le décret nomme, découpées depuis son texte. Un accord peut en retenir d'autres — mais aucun ne peut descendre sous le plancher des dix thèmes de l'article L. 2312-21, alinéa 3." },
  pieces: { valeurs: ["accord-bdese"], autres: ["accord-branche"], libre: true, multiple: true, indicatif: true,
    aide: "Les pièces versées. Un régime conventionnel se prouve par le texte de son accord." },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS, RUBRIQUES };

if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions · ${RUBRIQUES.length} rubriques du décret`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
