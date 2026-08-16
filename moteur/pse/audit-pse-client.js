/* Le rapport du module « plan de sauvegarde de l'emploi ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Toute phrase juridique vient d'un contrôle, qui la tient d'un article.

   L'ordre de lecture est celui du dossier : ce qui bloque d'abord, ce qui
   manque ensuite, ce que l'administration appréciera enfin — et le calibrage
   est présenté pour ce qu'il est, une mesure sans seuil légal. */
const O = require("./outils.js");
const M = require("./moteur-pse.js");
const { C, ETATS, DETECTION, COHERENCE } = require("./controles-pse.js");
const { L1233_62 } = require("./mesures.js");
const GRILLE = require("./grille-pse.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;
const euros = n => (typeof n === "number" && isFinite(n) ? n.toLocaleString("fr-FR") + " €" : "—");

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, h3, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF), so = par(SO);

  const regime = M.planDu(f);
  const acc = M.accompagnement(f);

  sur("Audit — plan de sauvegarde de l'emploi · articles L. 1233-61 à L. 1233-63 du code du travail");
  t1(f.entreprise || "Audit du plan");
  sur(`${C.length} contrôles · ${L1233_62.mesures.length} rubriques de l'article L. 1233-62, découpées depuis le texte`);
  trait();

  /* Le statut. Un plan non dû n'est pas un plan conforme, et un dossier
     incomplet n'est pas un dossier propre : les deux se disent. */
  const statut = regime.du === null ? { t: "RÉGIME INDÉTERMINÉ", c: "gris",
      sous: "L'effectif ou le nombre de licenciements n'est pas renseigné : le module ne sait pas si un plan est dû." }
    : regime.du === false ? { t: "AUCUN PLAN DÛ", c: "gris", sous: regime.motif }
    : nc.length ? { t: "BLOQUÉ", c: "rouge", sous: `${nc.length} non-conformité(s) constatée(s). Aucune décision ne se prend avant leur correction.` }
    : mq.length ? { t: "À COMPLÉTER", c: "orange", sous: `${mq.length} donnée(s) manquante(s) : le plan ne peut pas être apprécié en l'état.` }
    : rq.length ? { t: "RISQUE À VÉRIFIER", c: "orange", sous: `${rq.length} point(s) relèvent de l'appréciation de l'administration ou du juge.` }
    : { t: "CONFORME AU VU DES PIÈCES", c: "vert", sous: "Aucun écart sur les points contrôlés. Ce n'est ni une homologation, ni une validation." };
  A.D.push({ k: "bandeau", couleur: statut.c, t: statut.t, sous: statut.sous });

  enc("Ce que ce module ne peut pas dire",
    "Aucun texte ne fixe le montant d'un plan de sauvegarde de l'emploi. L'article L. 1233-57-3 confie à l'autorité administrative — puis au juge administratif — l'appréciation de la proportionnalité des mesures aux moyens de l'entreprise, de l'unité économique et sociale et du groupe. Les contrôles de calibrage calculent des rapports et les affichent ; aucun ne conclut à la conformité sur le montant. Un feu vert sur ce point serait faux.");

  /* --- le régime --- */
  h1("Le régime");
  p(regime.motif);
  if (acc.dispositif) p(acc.motif);
  const inst = M.instruction(f);
  if (inst.connu) p(inst.motif);

  /* --- ce qui bloque --- */
  if (nc.length) {
    h1("Ce qui bloque");
    for (const x of nc) A.D.push({ k: "interdit", t: x.objet, pourquoi: x.v.motif, id: x.id });
  }

  /* --- ce qui manque --- */
  if (mq.length) {
    h1("Ce qui manque pour conclure");
    for (const x of mq) puce(`${x.objet} — ${x.v.motif} · ${x.id}`);
  }

  /* --- ce que l'administration appréciera --- */
  if (rq.length) {
    h1("Ce que l'administration appréciera");
    p("Ces points ne sont pas des manquements. Ils appellent une décision qui n'appartient pas à l'application : le texte ne la tranche pas, ou il la confie expressément à l'administration.");
    for (const x of rq)
      A.D.push({ k: "acte", n: rq.indexOf(x) + 1, t: x.objet,
        priorite: DETECTION.includes(x.id) ? "information" : "critique",
        etat: RISQ, pourquoi: x.v.motif, id: x.id });
  }

  /* --- le contenu du plan, rubrique par rubrique --- */
  h1("Le contenu du plan, rubrique par rubrique");
  p("Les rubriques ci-dessous sont celles de l'article L. 1233-62, découpées depuis son texte et non recopiées. L'article énonce « des mesures telles que » : la liste n'est pas limitative, et une rubrique peut être écartée — mais en connaissance de cause.");
  const L = Array.isArray((f.plan || {}).mesures) ? f.plan.mesures : [];
  tab(["Rubrique", "Ce que l'article vise", "Mesures saisies", "Bénéficiaires", "Budget"],
    L1233_62.mesures.map(m => {
      const s = L.filter(x => String(x.rubrique || "").trim() === m.marque);
      return [m.marque, m.intitule,
        s.length ? s.map(x => x.intitule || "sans intitulé").join(" ; ") : "aucune",
        s.length ? String(s.reduce((n, x) => n + (Number(x.beneficiaires) || 0), 0)) : "—",
        s.length ? euros(s.reduce((n, x) => n + (Number(x.budget) || 0), 0)) : "—"];
    }));

  /* --- ce qui est acquis --- */
  if (ok.length) {
    h1("Ce qui est acquis au vu des pièces");
    for (const x of ok) A.D.push({ k: "acquis", t: x.objet, base: x.v.motif });
  }

  /* --- ce que la Cour de cassation a jugé --- */
  const regles = GRILLE.retenues(f);
  h1("Ce que la Cour de cassation a jugé");
  p(`${regles.length} règle(s) de la grille s'appliquent à votre situation, sur ${GRILLE.G.length}. Chacune renvoie à un arrêt publié, dont le sommaire est reproduit : jugez vous-même si la règle dit bien ce que l'arrêt dit. Une règle dont la condition n'est pas remplie ne dit rien, ni dans un sens ni dans l'autre.`);
  note("Un arrêt de la chambre sociale ne lie pas l'autorité administrative. Depuis la loi du 14 juin 2013, le contenu du plan et la régularité de la procédure relèvent du juge administratif — plusieurs des arrêts ci-dessous le disent expressément.");
  for (const r of regles) {
    h3(`${r.sujet} — ${r.id}`);
    p(r.dit);
    for (const num of r.arrets) {
      const a = GRILLE.arret(num);
      if (!a) continue;
      note(`Cass. ${a.ch || "soc."} ${a.date}, n° ${a.num}${a.sol ? ", " + a.sol : ""}${a.pub ? " — " + a.pub : ""}`);
      if (a.sommaire) note("« " + a.sommaire.replace(/\s+/g, " ").trim() + " »");
    }
  }

  /* --- la mesure du travail fait --- */
  h1("Ce que cet audit a mesuré");
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
    ["Contrôles exécutés", `${C.length}`, "Chacun est fondé sur un article, cité dans son motif."],
    ["Non-conformités", `${nc.length}`, "Un texte n'est pas respecté. Le motif dit lequel."],
    ["Risques à vérifier", `${rq.length}`, "La règle dépend d'une appréciation que l'application ne fait pas à votre place."],
    ["Données manquantes", `${mq.length}`, "Aucune conclusion n'en a été tirée, dans aucun sens."],
    ["Sans objet", `${so.length}`, "L'exigence ne s'applique pas, et une donnée renseignée permet de le dire."],
    ["Contrôles de calibrage", `${DETECTION.length}`, "Ils calculent et affichent ; ils ne concluent jamais à la conformité."],
    ["Contrôles de cohérence", `${COHERENCE.length}`, "Ils ne vérifient pas une donnée mais la relation entre deux."],
    ["Règles de jurisprudence retenues", `${regles.length} sur ${GRILLE.G.length}`,
      "Les autres ne s'appliquent pas à votre situation : elles n'ont rien dit. Le corpus compte " + Object.keys(GRILLE.CORPUS).length + " arrêts publiés, versés au dépôt avec leur sommaire."],
    ["Rubriques de L. 1233-62 découpées depuis le texte", `${L1233_62.mesures.length}`,
      `Couverture du découpage : ${L1233_62.couverture} % du texte de l'énumération. Version lue : ${L1233_62.version}.`],
  ]);

  return A.D;
}

module.exports = audit;
