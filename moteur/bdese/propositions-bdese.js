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
  accordEntreprise: { valeurs: OUI_NON, libre: false,
    aide: "Un accord signé avec les syndicats — ou, s'il n'y a pas de délégué syndical, avec le comité à la majorité de ses membres titulaires. Si vous n'en avez pas, répondez non : c'est alors la loi qui fixe le contenu de la base." },
  accordEntrepriseVerse: { valeurs: OUI_NON, libre: false,
    aide: "Joignez-le. C'est lui qui dit ce que votre base doit contenir : sans son texte, l'application n'a rien à vérifier." },
  accordBranche: { valeurs: OUI_NON, libre: false,
    aide: "À poser seulement si vous n'avez pas d'accord d'entreprise. Un accord de branche ne vaut que dans les entreprises de moins de 300 salariés." },
  accordBrancheVerse: { valeurs: OUI_NON, libre: false, aide: "Joignez-le, comme l'accord d'entreprise." },
  etablissementsDistincts: { valeurs: OUI_NON, libre: false,
    aide: "Une entreprise à plusieurs sites peut tenir sa base au niveau de l'entreprise, de chaque établissement, ou des deux. C'est l'accord qui le dit." },
  accordPeriodiciteConsultations: { valeurs: OUI_NON, libre: false,
    aide: "Attention, ce n'est pas le même accord que celui sur la base de données. Celui-ci dit tous les combien vous consultez le comité. Un accord sur la base ne change pas ce rythme." },
  accordDelaisConsultation: { valeurs: OUI_NON, libre: false,
    aide: "Un accord peut fixer le temps laissé au comité pour rendre son avis. Sans accord : un mois, deux s'il y a un expert, trois si l'expertise porte à la fois sur le comité central et sur des établissements." },
  "base.informationMiseAJour": { valeurs: OUI_NON, libre: false,
    aide: "Prévenez-vous les élus à chaque mise à jour ? C'est ce message qui déclenche le délai de consultation. Sans lui, le délai ne commence jamais à courir." },
  "base.formePerspectives": {
    valeurs: ["chiffrée", "grandes tendances", "mixte"], libre: true, indicatif: true,
    aide: "Pour les trois années à venir, vous pouvez donner des chiffres — ou, si vous ne les avez pas, de grandes tendances. Les deux sont admis. En revanche, ce que vous ne pouvez donner ni en chiffres ni en tendances, il faut le dire et expliquer pourquoi." },
  "base.niveau": {
    /* Le contrôle reprend le niveau tel quel dans son motif, sans le comparer à
       une liste : la proposition est indicative, et déclarée telle. */
    valeurs: ["entreprise", "établissement", "les deux"], libre: true, indicatif: true,
    aide: "Sans accord, la base se tient au niveau de l'entreprise. Un accord peut en décider autrement si vous avez plusieurs établissements." },
  "base.themes.theme": {
    valeurs: RUBRIQUES, libre: true, indicatif: true,
    aide: "Les rubriques que le décret prévoit. Un accord peut en choisir d'autres, mais dix thèmes restent obligatoires quoi qu'il arrive." },
  pieces: { valeurs: ["accord-bdese"], autres: ["accord-branche"], libre: true, multiple: true, indicatif: true,
    aide: "Les documents que vous joignez. Un accord ne se prouve que par son texte." },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS, RUBRIQUES };

if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions · ${RUBRIQUES.length} rubriques du décret`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
