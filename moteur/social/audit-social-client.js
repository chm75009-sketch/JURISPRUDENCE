/* Le point d'entrée navigateur de l'audit social.

   Ce module est empaqueté par ../commun/empaqueter.js vers docs/moteur-social.js
   (global MoteurSocial). Il n'invente rien : il expose le référentiel, les
   contrôles, le plan et le questionnaire — la page ne fait que les afficher.

   Les trois étages, tels que la page les déroule :
   1. questions(profil) et applicables(profil) — la liste s'ouvre selon le
      profil (effectif, secteur, convention, groupe, établissements) ;
   2. plan(profil, dossier) — d'abord le manquant : les actions concrètes,
      priorisées, avec modèles PRÉ-REMPLIS des données du questionnaire ;
   3. verdicts(profil, dossier) — puis l'existant : la conformité de ce qui
      est déclaré en place, aux cinq états du dépôt.                         */
const R = require("./referentiel-social.js");
const C = require("./controles-social.js");
const P = require("./plan-social.js");
const Q = require("./questionnaire-social.js");

/* La synthèse chiffrée du rapport général : mesurée, jamais recopiée. */
function synthese(profil, dossier) {
  const v = C.verdicts(profil, dossier || {});
  const n = { applicables: 0, nonApplicables: 0, indetermines: 0,
    conformes: 0, nonConformes: 0, risques: 0, manquantes: 0, sansObjet: 0 };
  for (const x of Object.values(v)) {
    if (x.assujetti === true) n.applicables++;
    else if (x.assujetti === false) n.nonApplicables++;
    else n.indetermines++;
    if (x.etat === "conforme") n.conformes++;
    else if (x.etat === "non conforme") n.nonConformes++;
    else if (x.etat === "risque à vérifier") n.risques++;
    else if (x.etat === "donnée manquante") n.manquantes++;
    else if (x.etat === "sans objet") n.sansObjet++;
  }
  return n;
}

module.exports = {
  referentiel: R.REF.map(it => ({ id: it.id, categorie: it.categorie, intitule: it.intitule,
    fondement: it.fondement, module: it.module || null, convention: !!it.convention,
    generique: it.generique || null, articles: it.articles, verifs: it.verifs || [],
    regularisation: it.regularisation || null })),
  /* Obligation → parcours guidé → document : les liaisons de l'étape 5,
     déclarées au référentiel et vérifiées à la publication. */
  liaisons: R.LIAISONS,
  parcoursNoms: R.PARCOURS_NOMS,
  categories: R.CATEGORIES,
  textes: R.TEXTES,
  questions: Q.LIGNES,
  applicables: C.applicables,
  verdicts: C.verdicts,
  etats: C.ETATS,
  plan: P.plan,
  action: P.action,
  synthese,
};
