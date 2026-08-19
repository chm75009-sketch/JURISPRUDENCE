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
      module: it.module || null,
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

module.exports = { plan, NIVEAUX };
