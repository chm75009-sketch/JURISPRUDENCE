/* L'étage 3 de l'audit social : le plan d'action.

   Pour chaque obligation applicable non cochée ou en défaut, une action
   précise : les étapes concrètes, qui, sous quel délai indicatif, et le
   risque encouru — formulé prudemment quand l'article de sanction n'a pas été
   lu à la source, ce que le référentiel dit item par item. Le tout consolidé
   en un planning trié : d'abord ce qui expose le plus (sécurité des
   personnes, entrave, pénalités), puis les délais courts, puis le reste.

   Les modèles : quand le générateur de documents de l'application porte une
   trame utile (documents.html), le plan la nomme ; sinon il écrit « modèle à
   établir » — jamais un lien vers ce qui n'existe pas.                      */
const R = require("./referentiel-social.js");
const C = require("./controles-social.js");
const { MODELES } = require("./modeles-social.js");

const NIVEAUX = {
  1: "priorité 1 — exposition forte (sécurité des personnes, entrave, absence d'institution ou de couverture)",
  2: "priorité 2 — pénalités financières et manquements qui se constatent en contrôle",
  3: "priorité 3 — régularisations rapides et mises à niveau",
};

/* Le plan : les items en défaut (non conformes) et à vérifier (risque),
   chacun avec son action complète. Les « donnée manquante » ne sont pas des
   actions : ce sont des réponses à compléter — ils sont rendus à part. */
function plan(p, dossier) {
  const v = C.verdicts(p, dossier);
  const actions = [], aVerifier = [], aCompleter = [];
  for (const it of R.REF) {
    const x = v[it.id];
    if (!x || x.assujetti !== true) continue;
    const base = {
      id: it.id, categorie: it.categorie, intitule: it.intitule,
      etat: x.etat, constat: x.motif, fondement: it.fondement,
      priorite: it.plan.priorite, niveau: NIVEAUX[it.plan.priorite],
      action: it.plan.action, etapes: it.plan.etapes, acteur: it.plan.acteur,
      delai: it.plan.delai, risque: it.plan.risque,
      modele: it.plan.modele || { page: null, nom: "modèle à établir" },
      /* Le modèle ADAPTÉ : une trame pré-remplie avec les données du
         questionnaire — jamais une trame générique quand on peut mieux. */
      modeleAdapte: MODELES[it.id] ? MODELES[it.id](p) : null,
      module: it.module || null,
      /* La régularisation : le parcours pas à pas qui conduit l'obligation
         jusqu'à sa validation, et la trame du document qu'il faut produire.
         Déclarés item par item dans le référentiel, vérifiés à la
         publication — jamais un lien vers ce qui n'existe pas. */
      regularisation: it.regularisation || null,
    };
    if (x.etat === "non conforme") actions.push(base);
    else if (x.etat === "risque à vérifier") aVerifier.push(base);
    else if (x.etat === "donnée manquante") aCompleter.push({ id: it.id, intitule: it.intitule, motif: x.motif });
  }
  const ordre = x => [x.priorite, R.CATEGORIES.indexOf(x.categorie)];
  const tri = (a, b) => { const oa = ordre(a), ob = ordre(b);
    return oa[0] - ob[0] || oa[1] - ob[1] || a.id.localeCompare(b.id); };
  actions.sort(tri); aVerifier.sort(tri);
  return {
    entreprise: p.entreprise || "",
    dateAudit: p.dateAudit || "",
    actions, aVerifier, aCompleter,
    compteurs: { actions: actions.length, aVerifier: aVerifier.length, aCompleter: aCompleter.length },
  };
}

/* La carte d'UNE obligation, quel que soit son état.

   Le plan ne rend que ce qui appelle une action ; l'étape « régulariser
   élément par élément » a besoin de la carte complète d'un point choisi —
   fût-il sans réponse, fût-il déjà déclaré fait. C'est la même carte, faite
   de la même matière : rien n'est calculé ici qui ne le soit dans plan().

   Rend null si l'obligation n'existe pas, ou si le profil ne l'assujettit
   pas : on ne guide pas la régularisation d'une obligation qui n'est pas due. */
function action(p, id, dossier) {
  const it = R.REF.find(x => x.id === id);
  if (!it) return null;
  let a;
  try { a = it.condition(p); }
  catch (e) { return null; }
  if (a.du !== true) return null;
  const v = C.verdictItem(it, p, dossier || {});
  return {
    id: it.id, categorie: it.categorie, intitule: it.intitule,
    etat: v.etat, constat: v.motif, fondement: it.fondement,
    priorite: it.plan.priorite, niveau: NIVEAUX[it.plan.priorite],
    action: it.plan.action, etapes: it.plan.etapes, acteur: it.plan.acteur,
    delai: it.plan.delai, risque: it.plan.risque,
    modele: it.plan.modele || { page: null, nom: "modèle à établir" },
    modeleAdapte: MODELES[it.id] ? MODELES[it.id](p) : null,
    module: it.module || null,
    regularisation: it.regularisation || null,
    verifs: it.verifs || [],
  };
}

module.exports = { plan, action, NIVEAUX };
