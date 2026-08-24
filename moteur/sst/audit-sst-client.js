/* Le rapport du module « santé, sécurité et conditions de travail ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Toute phrase juridique vient d'un contrôle, qui la tient d'un
   article. */
const O = require("./outils.js");
const M = require("./moteur-sst.js");
const { C, ETATS, DETECTION, COHERENCE } = require("./controles-sst.js");
const { R } = require("./regularisation-sst.js");
const DT = require("../commun/parcours-deux-temps.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF), so = par(SO);

  sur("Audit — santé, sécurité et conditions de travail · document unique, CSSCT, harcèlement");
  t1(f.entreprise ? `Santé, sécurité et conditions de travail — ${f.entreprise}` : "Santé, sécurité et conditions de travail");
  trait();

  /* --- les seuils, dits d'abord --- */
  const e = M.effectif(f);
  h1("Ce que l'effectif commande");
  p(e.motif);
  if (e.connu) {
    tab(["Obligation", "Seuil", "Article", "Ici"],
      Object.values(M.SEUILS).map(s => [
        s.objet, `${s.seuil} salariés`, s.article,
        e.valeur >= s.seuil ? "due" : "non due à ce seuil",
      ]));
    note("Le document unique, lui, est dû par tout employeur, sans seuil (L. 4121-3, R. 4121-1) ; et la commission peut être due sous trois cents salariés — établissement distinct, hauts risques, décision de l'inspecteur.");
  }

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
  bloc("Non conforme", nc, "Un texte n'est pas respecté. Le motif dit lequel, et pourquoi.");
  bloc("Risque à vérifier", rq, "La règle dépend d'une appréciation que l'application ne fait pas à votre place.");
  bloc("Donnée manquante", mq, "Aucune conclusion n'en est tirée, dans aucun sens : complétez, puis relancez.");
  bloc("Conforme", ok, null);
  bloc("Sans objet", so, "L'exigence ne s'applique pas, et une donnée renseignée permet de le dire.");

  /* --- la mesure du travail fait --- */
  h1("Ce que cet audit a mesuré");
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
    ["Contrôles exécutés", `${C.length}`, "Chacun est fondé sur un article, cité dans son motif."],
    ["Non-conformités", `${nc.length}`, "Un texte n'est pas respecté."],
    ["Risques à vérifier", `${rq.length}`, "Une appréciation reste à faire."],
    ["Données manquantes", `${mq.length}`, "Aucune conclusion n'en a été tirée."],
    ["Sans objet", `${so.length}`, "L'exigence ne s'applique pas ici."],
    ["Contrôles d'exposition", `${DETECTION.length}`, "Ils mesurent les sanctions encourues ; ils ne délivrent jamais de blanc-seing."],
  ]);

  return A.D;
}

/* Les verdicts bruts, tels que la page en a besoin pour le parcours : le
   rapport ci-dessus les met en forme, il ne les rend pas. */
function verdicts(f) {
  const v = {};
  for (const c of C) {
    try { v[c.id] = c.verdict(f); }
    catch (e) { v[c.id] = { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  }
  return v;
}

/* Le parcours en deux temps — corriger ce qui manque, puis vérifier ce qui est
   déclaré. `etat` porte ce que la page a recueilli : les corrections déclarées
   faites et les réponses à la grille de vérification. */
function parcours(f, etat) {
  return DT.parcours(C, R, verdicts(f), etat);
}

module.exports = audit;
module.exports.verdicts = verdicts;
module.exports.parcours = parcours;
module.exports.regularisation = R;
module.exports.controles = C;
module.exports.mots = { DECLARE: DT.DECLARE, REGLE: DT.REGLE, DEGRES: DT.DEGRES };
