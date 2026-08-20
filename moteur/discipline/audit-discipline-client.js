/* Le rapport du module « discipline et règlement intérieur ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Toute phrase juridique vient d'un contrôle, qui la tient d'un article
   lu à la source ou d'une décision lue dans la base Judilibre. */
const O = require("./outils.js");
const M = require("./moteur-discipline.js");
const { C, ETATS, DETECTION, COHERENCE, ARRETS } = require("./controles-discipline.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;
const dit = x => x === true || x === "oui";
const vide = x => x === undefined || x === null || x === "";

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF), so = par(SO);

  sur("Audit — discipline et règlement intérieur · sanction, procédure, garanties de fond");
  t1(f.entreprise ? `Discipline et règlement intérieur — ${f.entreprise}` : "Discipline et règlement intérieur");
  trait();

  /* --- le règlement intérieur : dû ou non --- */
  const d = M.riDu(f);
  h1("Ce que l'effectif commande");
  p(d.motif);
  note("Le règlement intérieur est le siège du pouvoir disciplinaire : il fixe la nature et l'échelle des sanctions (L. 1321-1, 3°). Une sanction autre que le licenciement ne peut être prononcée que si elle y est prévue, chez l'employeur tenu d'en établir un, et une mise à pied disciplinaire n'est licite que si le règlement en précise la durée maximale.");

  /* --- la mesure auditée --- */
  const q = M.qualification(f);
  const e = M.entretienDu(f);
  h1("La mesure auditée");
  if (!(f.sanction || {}).auditee)
    p("Aucune sanction n'est soumise à l'audit, ou la question n'est pas renseignée : seul le règlement intérieur est examiné.");
  else if (!q.connu) p(q.motif);
  else {
    p(`Nature déclarée : ${q.nature}. ${q.motifNature}`);
    if (e.motif) p(e.motif);
  }
  if (dit((f.sanction || {}).salarieProtege))
    enc("Le salarié est titulaire d'un mandat — ce module ne l'audite pas",
      "Un statut protecteur s'ajoute à tout ce qui suit : la sanction, et à plus forte raison le licenciement, obéissent alors à une procédure spéciale que cette page ne vérifie pas et sur laquelle elle ne conclut rien. Faites-la vérifier avant toute décision : ce rapport ne dit rien de sa régularité.");
  else if (vide((f.sanction || {}).salarieProtege))
    note("Il n'est pas indiqué si le salarié est titulaire d'un mandat représentatif ou syndical. Si c'est le cas, un statut protecteur s'ajoute, que ce module n'audite pas.");

  /* --- les verdicts, ce qui bloque d'abord --- */
  const bloc = (titre, liste, explication) => {
    if (!liste.length) return;
    h1(`${titre} (${liste.length})`);
    if (explication) note(explication);
    for (const x of liste) {
      h2(`${x.id} — ${x.objet}`);
      note("Fondement : " + x.fondement.join(", "));
      p(x.v.motif);
    }
  };
  bloc("Non conforme", nc, "Un texte n'est pas respecté, ou une garantie de fond a été méconnue. Le motif dit lequel, et pourquoi.");
  bloc("Risque à vérifier", rq, "La règle dépend d'une appréciation que l'application ne fait pas à votre place.");
  bloc("Donnée manquante", mq, "Aucune conclusion n'en est tirée, dans aucun sens : complétez, puis relancez.");
  bloc("Conforme", ok, null);
  bloc("Sans objet", so, "L'exigence ne s'applique pas, et une donnée renseignée permet de le dire.");

  /* --- la garantie de fond, rappelée telle qu'elle a été lue --- */
  h1("La garantie de fond, dans les termes de la Cour de cassation");
  note("Ces décisions ont été lues à la source dans la base Judilibre. Elles sont citées pour ce qu'elles disent, et rien de plus.");
  p(ARRETS.garantieFond);
  p(ARRETS.avertissementRI);
  p(ARRETS.avertissementCCN);
  p(ARRETS.avisTardif);
  p(ARRETS.tousLesTermes);
  p(ARRETS.sanctionPrevueRI);
  p(ARRETS.sanctionPrevueRI2);
  p(ARRETS.carenceInspection);

  /* --- la mesure du travail fait --- */
  h1("Ce que cet audit a mesuré");
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
    ["Contrôles exécutés", `${C.length}`, "Chacun est fondé sur un article lu à la source, ou sur une décision lue dans Judilibre, cités dans son motif."],
    ["Non-conformités", `${nc.length}`, "Un texte n'est pas respecté."],
    ["Risques à vérifier", `${rq.length}`, "Une appréciation reste à faire."],
    ["Données manquantes", `${mq.length}`, "Aucune conclusion n'en a été tirée."],
    ["Sans objet", `${so.length}`, "L'exigence ne s'applique pas ici."],
    ["Contrôles d'exposition", `${DETECTION.length}`, "Ils mesurent ce à quoi l'employeur s'expose ; ils ne délivrent jamais de blanc-seing."],
    ["Contrôles de cohérence", `${COHERENCE.length}`, "Ils comparent les données entre elles."],
  ]);
  note("Ce que cette page ne fait pas : elle n'apprécie ni la réalité des faits, ni leur caractère fautif, ni la proportionnalité de la sanction à la faute. Le conseil de prud'hommes apprécie la régularité de la procédure et si les faits sont de nature à justifier une sanction ; si un doute subsiste, il profite au salarié (L. 1333-1). Il peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée (L. 1333-2).");

  return A.D;
}

module.exports = audit;
