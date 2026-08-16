/* Ce que chaque question accepte, module économique.

   Les listes ne sont pas inventées : chacune est tirée du code qui reconnaît
   les valeurs, et moteur/commun/propositions.js le vérifie dans les deux sens à
   la publication. Voir l'en-tête de ce fichier pour la règle. */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles.js", "controles2.js", "moteur.js", "pieces.js"].map(lire);

/* Les codes de pièces que les contrôles savent chercher. Déduits, non listés :
   PIECE_ATTENDUE rattache un code à un contrôle, et les contrôles en cherchent
   d'autres directement par PC.get(f, "…"). */
const CODES_PIECES = (() => {
  const s = new Set(Object.values(require("./controles.js").PIECE_ATTENDUE));
  for (const src of SOURCES)
    for (const m of src.matchAll(/PC\.get\(f,\s*"([^"]+)"/g)) s.add(m[1]);
  return [...s].sort();
})();

/* Les consultations récurrentes que le contrôle recherche, tirées de sa source. */
const P = {
  cause: { valeurs: ["1", "2", "3", "4"], libre: false,
    etiquettes: { "1": "1 — difficultés économiques", "2": "2 — mutations technologiques",
      "3": "3 — sauvegarde de la compétitivité", "4": "4 — cessation d'activité" },
    aide: "Les quatre cas de l'article L. 1233-3. Il n'en existe pas d'autre." },
  typeProcedure: { valeurs: ["sauvegarde", "redressement", "liquidation"], libre: false,
    aide: "La nature de la procédure collective ouverte par le tribunal." },
  qualiteAuteur: { valeurs: ["employeur", "administrateur", "liquidateur"], libre: true, indicatif: true,
    aide: "Qui met en œuvre le plan de licenciement. Repris tel quel dans le rapport : aucun contrôle ne discrimine sur cette valeur, seule son absence est relevée." },
  perimetreOrdre: { valeurs: ["entreprise", "établissement"], libre: true, indicatif: true,
    aide: "Le périmètre d'application des critères d'ordre. Hors accord collectif, il est celui de l'entreprise." },
  "pieces.code": { valeurs: CODES_PIECES, libre: true, multiple: true,
    aide: "Les pièces effectivement versées. Chacune peut être déclarée par son seul code, ou décrite — fichier, date, période, auteur, version, périmètre — ce qui permet de la contrôler au lieu de la croire." },
};

/* Une réponse « oui » qui appelle une pièce.

   « Un accord collectif fixe-t-il ce périmètre ? — oui » et rien ne suivait :
   la déclaration restait sans titre, et le contrôle concluait sur elle. Il
   exige désormais l'accord ; le formulaire doit donc le demander à la suite de
   la réponse, non laisser l'utilisateur deviner qu'une pièce l'attend ailleurs.

   Le lien est déclaré ici et vérifié : le code doit être une pièce que les
   contrôles savent chercher, et le contrôle qui l'attend doit bien lire le
   champ. Sans quoi le formulaire réclamerait un document dont nul ne fait rien. */
const PIECES_APPELEES = {
  accordPerimetreOrdre: "accord-perimetre-ordre",
};
const ECARTS_PIECES = (() => {
  const out = [];
  const { PIECE_ATTENDUE, C } = require("./controles.js");
  for (const [champ, code] of Object.entries(PIECES_APPELEES)) {
    if (!CODES_PIECES.includes(code)) {
      out.push(`${champ} : la pièce « ${code} » n'est attendue par aucun contrôle.`); continue;
    }
    const ids = Object.keys(PIECE_ATTENDUE).filter(id => PIECE_ATTENDUE[id] === code);
    const lit = ids.some(id => {
      const ctl = C.find(x => x.id === id);
      return ctl && new RegExp("f\\." + champ + "\\b").test(String(ctl.verdict));
    });
    if (!lit) out.push(`${champ} : le contrôle qui attend « ${code} » ne lit pas ce champ.`);
  }
  return out;
})();

const ECARTS = V.verifier(P, SOURCES).concat(ECARTS_PIECES);
module.exports = { P, ECARTS, CODES_PIECES, PIECES_APPELEES };
if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions · ${CODES_PIECES.length} codes de pièces`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
