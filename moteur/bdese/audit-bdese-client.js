/* Le rapport du module « base de données économiques, sociales et environnementales ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Il commence par le régime, parce que tout le reste en dépend, et il
   n'affiche le contenu attendu que lorsque le régime est connu.

   La formulation du périmètre est reprise telle quelle, à l'écran et dans le
   Word : le module prépare, structure, documente et audite la base. Il ne la
   met pas à disposition, et il n'est pas la base. */
const O = require("./outils.js");
const R = require("./regime-bdese.js");
const CONTENU = require("./contenu-bdese.js");
const { C, ETATS, DETECTION, COHERENCE, PLANCHER } = require("./controles-bdese.js");
const PL = require("./plancher-bdese.js");
const { R: REG } = require("./regularisation-bdese.js");
const { MODELES } = require("./modeles-bdese.js");
const DT = require("../commun/parcours-deux-temps.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, h3, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF), so = par(SO);

  const reg = R.regime(f);
  const exi = R.exigibilite(f);
  const del = R.delaiConsultation(f);
  const B = CONTENU.construire();

  sur("Audit — base de données économiques, sociales et environnementales · articles L. 2312-18 et suivants du code du travail");
  t1(f.entreprise || "Audit de la base de données");
  sur(`${C.length} contrôles · plancher de ${PLANCHER.length} thèmes · contenu du décret découpé depuis son texte`);
  trait();

  const indetermine = reg.regime === R.REGIMES.INDETERMINE;
  const statut = indetermine
      ? { t: "RÉGIME INDÉTERMINÉ", c: "gris", sous: "Le texte qui commande le contenu de la base n'est pas identifié : aucun contenu n'est audité, et c'est délibéré." }
    : nc.length ? { t: "NON CONFORME", c: "rouge", sous: `${nc.length} manquement(s) constaté(s) au regard du régime applicable.` }
    : mq.length ? { t: "À COMPLÉTER", c: "orange", sous: `${mq.length} donnée(s) manquante(s) : la base ne peut pas être appréciée en l'état.` }
    : rq.length ? { t: "RISQUE À VÉRIFIER", c: "orange", sous: `${rq.length} point(s) appellent une vérification hors de portée de l'application.` }
    : { t: "CONFORME AU VU DES PIÈCES", c: "vert", sous: "Aucun écart sur les points contrôlés, au regard du régime applicable." };
  A.D.push({ k: "bandeau", couleur: statut.c, t: statut.t, sous: statut.sous });

  /* L'état du catalogue réglementaire est dit dans le rapport, non seulement au
     manifeste : le lecteur du rapport doit savoir si le découpage du décret est
     intégral, et il ne le saura pas en lisant le code. */
  const cv = [B.contenu["moins300"].couverture, B.contenu["au moins300"].couverture];
  const reste = cv.reduce((n, c) => n + (c.reliquat || 0), 0);
  if (reste)
    enc("État du catalogue réglementaire — développement",
      `Le découpage laisse ${reste} caractère(s) du décret hors de son périmètre. Le critère de sortie est cent pour cent : tant qu'il n'est pas atteint, le catalogue n'est pas exhaustif, et ce rapport ne doit pas être lu comme une vérification de l'intégralité du décret.`);
  else
    enc("État du catalogue réglementaire — complet",
      `Le texte des articles R. 2312-8 et R. 2312-9 est intégralement rendu : chaque caractère est soit extrait comme contenu, soit reconnu comme structure du découpage — marqueur, numérotation, séparateur (${cv[0].structure} et ${cv[1].structure} caractères respectivement). Aucun reliquat. La chaîne de publication échoue si un seul caractère cesse d'être l'un ou l'autre.`);

  enc("Ce que ce module fait, et ce qu'il ne fait pas",
    "Il prépare, structure, documente et audite la base de données. Il ne fournit pas une base collaborative accessible simultanément à plusieurs catégories d'utilisateurs, et il n'est pas la base : la mise à disposition reste un acte de l'employeur, qui se prouve par le support lui-même, ses traces d'accès et l'information donnée aux bénéficiaires.");

  /* --- le régime, d'abord --- */
  h1("Le régime applicable");
  p(reg.motif);
  if (indetermine)
    enc("Pourquoi l'audit du contenu s'arrête ici",
      "Le régime supplétif ne s'applique pas « à défaut d'avoir trouvé » : il s'applique en l'absence d'accord, ce qui est un fait à établir. Auditer un contenu sans savoir quel texte le commande produirait des non-conformités inventées — un accord peut légalement organiser la base autrement, sous la seule réserve du plancher légal. Renseignez la recherche d'accord, joignez l'accord s'il en existe un, et relancez.");

  h2("Les dates d'exigibilité");
  if (exi.attributions) p(exi.attributions.motif);
  if (exi.contenu300) p(exi.contenu300.motif);
  exi.avertissements.forEach(a => note(a));
  if (!exi.attributions && !exi.contenu300) note("Aucune date n'a pu être établie : les dates de franchissement des seuils ne sont pas renseignées.");

  /* --- ce qui bloque --- */
  if (nc.length) {
    h1("Ce qui ne va pas");
    for (const x of nc) A.D.push({ k: "interdit", t: x.objet, pourquoi: x.v.motif, id: x.id });
  }
  if (mq.length) {
    h1("Ce qui manque pour conclure");
    for (const x of mq) puce(`${x.objet} — ${x.v.motif} · ${x.id}`);
  }
  if (rq.length) {
    h1("Ce qui appelle une vérification");
    for (const x of rq)
      A.D.push({ k: "acte", n: rq.indexOf(x) + 1, t: x.objet,
        priorite: DETECTION.includes(x.id) ? "information" : "critique",
        etat: RISQ, pourquoi: x.v.motif, id: x.id });
  }

  /* --- le plancher, qu'aucun accord ne peut descendre --- */
  h1("Le plancher légal — les dix thèmes de l'accord");
  p("Ces thèmes sont ceux du troisième alinéa de l'article L. 2312-21, relevés dans son texte : « la base de données comporte au moins les thèmes suivants ». Aucun accord ne descend en dessous. Ils ne se confondent pas avec les dix thèmes de la consultation de l'article L. 2312-36 : ce sont deux listes de dix qui ne sont pas les mêmes dix.");
  const declares = Array.isArray((f.base || {}).themes) ? f.base.themes.map(x => String(x.theme || x)) : [];
  tab(["Thème du plancher — tel que la loi l'écrit", "Ce que le décret nomme", "Déclaré dans la base ?"],
    PLANCHER.map(t => {
      const c = PL.CORRESPONDANCE.find(x => PL.net(x.plancher) === PL.net(t));
      return [t, c ? c.decret.join(" ; ") : "—", PL.couvert(t, declares) ? "oui" : "non déclaré"];
    }));
  note("Deux thèmes du décret ne figurent pas au plancher — la sous-traitance, que le décret nomme « partenariats », et les transferts intragroupe : un accord peut donc les supprimer, et l'application le dit plutôt que de les réclamer.");

  /* --- le contenu attendu, seulement si le régime est connu --- */
  if (!indetermine) {
    h1("Le contenu attendu");
    if (reg.regime === R.REGIMES.SUPPLETIF) {
      const cle = reg.article === "R. 2312-9" ? "au moins300" : "moins300";
      const arbre = B.contenu[cle];
      const info = arbre.rubriques.reduce((n, r) => n + r.sections.reduce((m, s) =>
        m + s.sujets.reduce((k, j) => k + j.informations.length, 0), 0), 0);
      p(`Aucun accord ne définit la base : le contenu est celui de l'article ${reg.article}, découpé depuis son texte — ${arbre.rubriques.length} rubriques, ${info} informations, couverture du découpage ${arbre.couverture.part} %.`);
      tab(["Rubrique du décret", "Sections", "Informations", "Déclarée ?"],
        arbre.rubriques.map(r => {
          const nbInfo = r.sections.reduce((m, s) => m + s.sujets.reduce((k, j) => k + j.informations.length, 0), 0);
          return [r.titre, String(r.sections.length), String(nbInfo),
            declares.map(PL.net).some(d => d.includes(PL.net(r.titre).slice(0, 20))
              || PL.net(r.titre).includes(d.slice(0, 20))) ? "oui" : "non déclarée"];
        }));
      const an = R.annees(f, Number(String(f.dateAudit || "").slice(0, 4)) || undefined);
      h2("Les années couvertes");
      p(an.motif);
      note(`Concrètement : ${an.passees.join(", ")}, ${an.courante}, puis ${an.suivantes.join(", ")}. Les trois dernières peuvent être données en grandes tendances — l'exiger en chiffres produirait des non-conformités fausses.`);
    } else {
      p(`Le contenu est celui que définit ${reg.regime} (${reg.article}). L'application ne peut pas le vérifier ligne à ligne : elle ne lit pas les stipulations de votre accord. Elle vérifie ce qui s'impose à lui — le plancher de l'article L. 2312-21, alinéa 3 — et la mise à disposition.`);
    }
  }

  /* --- les consultations --- */
  h1("Les consultations");
  p(del.motif);
  note("L'accord qui fixe la périodicité et les délais des consultations est celui de l'article L. 2312-19. Ce n'est pas celui qui définit la base, qui relève de l'article L. 2312-21 : un accord sur la base ne déplace pas la périodicité des consultations, et le module les demande séparément.");

  if (ok.length) {
    h1("Ce qui est acquis au vu des pièces");
    for (const x of ok) A.D.push({ k: "acquis", t: x.objet, base: x.v.motif });
  }

  h1("Ce que cet audit a mesuré");
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
    ["Contrôles exécutés", `${C.length}`, "Chacun est fondé sur un article, cité dans son motif."],
    ["Manquements", `${nc.length}`, "Un texte n'est pas respecté, au regard du régime applicable."],
    ["Risques à vérifier", `${rq.length}`, "La règle dépend d'un élément que l'application ne peut pas trancher seule."],
    ["Données manquantes", `${mq.length}`, "Aucune conclusion n'en a été tirée, dans aucun sens."],
    ["Sans objet", `${so.length}`, "L'exigence ne s'applique pas, et une donnée renseignée permet de le dire."],
    ["Régime retenu", reg.regime, indetermine ? "Aucun contenu n'a été audité, et c'est la bonne réponse." : `Fondement : ${reg.article || "L. 2312-21"}.`],
    ["Thèmes du plancher légal", `${PLANCHER.length}`, `Relevés dans le texte de L. 2312-21, al. 3 — version ${B.planchierVersion || "—"}.`],
    ["Couverture du découpage du décret",
      `R. 2312-8 : ${B.contenu["moins300"].couverture.part} % · R. 2312-9 : ${B.contenu["au moins300"].couverture.part} %`,
      "Part du texte du décret que le découpage a consommée. Ce qui n'a pas été reconnu est compté et publié, jamais passé sous silence."],
    ["Contrôles de cohérence", `${COHERENCE.length}`, "Ils ne vérifient pas une donnée mais la relation entre deux."],
    ["Contrôle de preuve", `${DETECTION.length}`, "Il ne conclut jamais à la conformité : l'application constitue le contenu, elle n'atteste pas la mise à disposition."],
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
  return DT.parcours(C, REG, verdicts(f), etat);
}

/* La grille due, et les six millésimes.

   L'audit dit si la base est complète ; la page « ma base de données » la fait
   remplir. Elle a donc besoin du découpage du décret, que contenu-bdese.js
   produit déjà — il n'est pas refait ici, il est simplement rendu accessible.

   La grille ne se choisit pas au hasard : elle dépend de l'effectif, et elle
   n'est due qu'À DÉFAUT d'accord. Un accord d'entreprise définit l'organisation,
   l'architecture et le contenu de la base (L. 2312-21) et il prime. La fonction
   rend donc null quand un accord existe, et null quand l'effectif est inconnu :
   elle refuse de servir une grille que rien ne commande. */
function grilleDue(effectif, accordExiste) {
  if (accordExiste === true) return null;
  /* Number(null) vaut zéro, et zéro est un effectif : sans ce garde, une fiche
     muette recevait la grille des petites entreprises comme si elle en avait
     une. Le silence n'est pas une réponse, ici comme ailleurs. */
  if (effectif === null || effectif === undefined || String(effectif).trim() === "") return null;
  const e = Number(effectif);
  if (!Number.isFinite(e) || e < 0) return null;
  const B = CONTENU.construire();
  return e >= 300 ? B.contenu["au moins300"] : B.contenu["moins300"];
}

/* Les six années de chaque ligne. L. 2312-36 : les informations « portent sur
   les deux années précédentes et l'année en cours et intègrent des perspectives
   sur les trois années suivantes ». Une base à une seule colonne est le premier
   oubli du terrain — elle ne montre ni l'évolution passée ni la trajectoire. */
function millesimes(anneeEnCours) {
  const a = Number(anneeEnCours);
  if (!Number.isFinite(a)) return [];
  return [
    { annee: a - 2, nature: "réalisé" },
    { annee: a - 1, nature: "réalisé" },
    { annee: a, nature: "année en cours" },
    { annee: a + 1, nature: "perspective" },
    { annee: a + 2, nature: "perspective" },
    { annee: a + 3, nature: "perspective" },
  ];
}

/* Le modèle concret d'un point de régularisation — étape 5 du parcours.
   Chiffré sur le dossier remis, jamais sur un exemple figé : voir
   modeles-bdese.js. Rend null si aucun modèle n'est écrit pour cet id. */
function modele(f, id) {
  return typeof MODELES[id] === "function" ? MODELES[id](f) : null;
}

module.exports = audit;
module.exports.verdicts = verdicts;
module.exports.parcours = parcours;
module.exports.regularisation = REG;
module.exports.controles = C;
module.exports.modele = modele;
module.exports.mots = { DECLARE: DT.DECLARE, REGLE: DT.REGLE, DEGRES: DT.DEGRES };
module.exports.contenu = () => CONTENU.construire();
module.exports.grilleDue = grilleDue;
module.exports.millesimes = millesimes;
module.exports.plancher = PLANCHER;
