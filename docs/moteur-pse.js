/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : 3e24dd0eeca6
   {"articlesLus":22,"rubriquesL1233_62":7,"couvertureDecoupage":98.1,"versionL1233_62":"LEGIARTI000036261725","controles":21,"calibrage":2,"coherence":1,"donneesDemandees":29,"reglesJurisprudence":13,"arretsAuCorpus":20,"casContradictoires":16,"verdicts":378,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"calibrageConcluantConforme":0}
*/
(function (global) {
  "use strict";
  var __sources = {}, __cache = {};
  function __def(nom, fn) { __sources[nom] = fn; }
  function require(nom) {
    if (nom === "fs" || nom === "crypto" || nom === "path") return {};
    nom = "./" + nom.split("/").pop();
    if (__cache[nom]) return __cache[nom].exports;
    var src = __sources[nom];
    if (!src) throw new Error("module absent de l'empaquetage : " + nom);
    var mod = __cache[nom] = { exports: {} };
    src(mod, mod.exports, require);
    return mod.exports;
  }
  var __MANIFESTE = {"domaine":"plan de sauvegarde de l'emploi","date":"2026-08-24","empreinte":"3e24dd0eeca6","fichiers":{"audit-pse-client.js":"1789b4e0bdae","controles-pse.js":"6d03b8daafc5","dates.js":"b6d7e587bec3","fiche-pse.json":"70b94774f5ff","grille-pse.js":"aa5acbc21302","mesures.js":"5dd166061596","moteur-pse.js":"a6e15d88385d","outils.js":"7401cc07f5a6","propositions-pse.js":"55a3494acac4","questionnaire-pse.js":"a91c7dd25e09","recevabilite.js":"62a84856a6f1","regularisation-pse.js":"5c1e3f72e4f1","sonde.js":"e23b90b65ecb","tests-pse.js":"f8c992547e17","textes-pse.json":"0d0d30238eb2","verifier-textes-pse.js":"01173b76e310"},"compteurs":{"articlesLus":22,"rubriquesL1233_62":7,"couvertureDecoupage":98.1,"versionL1233_62":"LEGIARTI000036261725","controles":21,"calibrage":2,"coherence":1,"donneesDemandees":29,"reglesJurisprudence":13,"arretsAuCorpus":20,"casContradictoires":16,"verdicts":378,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"calibrageConcluantConforme":0},"textesRelus":{"date":"2026-08-16","articles":22,"concordants":22,"ecarts":0,"sansConclusion":0}};
  var __REGISTRE = (function () { var r = null || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

__def("./audit-pse-client.js", function(module, exports, require){
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
const { R } = require("./regularisation-pse.js");
const DT = require("../commun/parcours-deux-temps.js");

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

});

__def("./outils.js", function(module, exports, require){
/* Fabrique d'éléments pour les classeurs de pièces. */
module.exports=function(){
 const D=[];
 const api={D,
  sur:t=>(D.push({k:"sur",t}),api), t1:t=>(D.push({k:"t1",t}),api), trait:()=>(D.push({k:"trait"}),api),
  h1:t=>(D.push({k:"h1",t}),api), h2:t=>(D.push({k:"h2",t}),api), h3:t=>(D.push({k:"h3",t}),api),
  p:t=>(D.push({k:"p",t}),api), note:t=>(D.push({k:"note",t}),api), puce:t=>(D.push({k:"puce",t}),api),
  enc:(titre,t)=>(D.push({k:"enc",titre,t}),api),
  tab:(head,rows)=>(D.push({k:"table",head,rows}),api),
  /* en-tête normalisé d'une pièce du dossier */
  piece:(num,titre,o)=>(D.push({k:"piece",num,titre,nature:o.nature,emetteur:o.emetteur,
    date:o.date,prouve:o.prouve,texte:o.texte}),api),
  /* corps d'un document reproduit : lettre, procès-verbal, attestation */
  doc:(lignes)=>(D.push({k:"doc",lignes}),api),
  sign:t=>(D.push({k:"sign",t}),api),
 };
 return api;
};

});

__def("./moteur-pse.js", function(module, exports, require){
/* Le régime du plan de sauvegarde de l'emploi : ce que les seuils commandent.

   Trois bascules, et rien d'autre n'est décidé ici :

   — le plan est dû : cinquante salariés dans l'entreprise et dix licenciements
     envisagés dans une même période de trente jours (L. 1233-61) ;
   — l'accompagnement individuel bascule à mille salariés : congé de reclassement
     au-dessus (L. 1233-71), contrat de sécurisation professionnelle en deçà
     (L. 1233-66, qui vise « les entreprises non soumises à l'article
     L. 1233-71 ») — les deux ne se cumulent pas, et l'un des deux est toujours
     dû dès lors qu'un licenciement économique est envisagé ;
   — le délai d'instruction dépend de la voie : quinze jours pour la validation
     d'un accord, vingt et un pour l'homologation d'un document unilatéral
     (L. 1233-57-4), le silence valant acceptation.

   Ce fichier ne conclut sur aucun dossier : il rend le régime. Les contrôles
   s'en servent, et ce sont eux qui prononcent. */
const ECART = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);

/* Le plan est-il dû ? Le décompte des dix licenciements sur trente jours est
   celui du module économique — il intègre les licenciements déjà prononcés et
   les refus de modification du contrat. Il n'est pas refait ici. */
function planDu(f) {
  const eff = nombre(f.effectif);
  const n = nombre(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
  if (eff === null || n === null) return { du: null, motif: "L'effectif ou le nombre de licenciements n'est pas renseigné." };
  if (eff < 50) return { du: false, motif: `Effectif de ${eff} salariés : le plan n'est dû qu'à partir de cinquante (L. 1233-61).` };
  if (n < 10) return { du: false, motif: `${n} licenciement(s) envisagé(s) sur trente jours : le plan n'est dû qu'à partir de dix (L. 1233-61).` };
  return { du: true, motif: `Effectif de ${eff} salariés et ${n} licenciements envisagés sur une même période de trente jours : le plan est dû (L. 1233-61).` };
}

/* Congé de reclassement ou contrat de sécurisation professionnelle.

   Le seuil de mille se lit à l'échelle de l'entreprise ou de l'établissement,
   et aussi du groupe lorsque l'entreprise appartient à un groupe au sens de
   l'article L. 2331-1 ou à un groupe de dimension communautaire. L'effectif du
   groupe est donc regardé quand il est renseigné. */
const SEUIL_MILLE = 1000;
function accompagnement(f) {
  const eff = nombre(f.effectif), etab = nombre(f.effectifEtablissement), grp = nombre(f.effectifGroupe);
  const atteint = [eff, etab, f.groupe ? grp : null].filter(x => x !== null && x >= SEUIL_MILLE);
  if (eff === null && etab === null && grp === null)
    return { dispositif: null, motif: "Aucun effectif n'est renseigné : le dispositif d'accompagnement ne peut pas être déterminé." };
  if (atteint.length)
    return { dispositif: "congé de reclassement", seuil: SEUIL_MILLE, article: "L. 1233-71",
      motif: `Au moins mille salariés (${Math.max(...atteint)}) : le congé de reclassement est dû, d'une durée qui ne peut excéder douze mois, portés à vingt-quatre en cas de formation de reconversion, financé en totalité par l'employeur.` };
  return { dispositif: "contrat de sécurisation professionnelle", seuil: SEUIL_MILLE, article: "L. 1233-66",
    motif: "En deçà de mille salariés : le contrat de sécurisation professionnelle doit être proposé à chaque salarié dont le licenciement est envisagé. À défaut de proposition, l'employeur doit deux mois de salaire brut à l'assurance chômage, trois si le salarié adhère sur proposition de France Travail." };
}

/* Le délai d'instruction administrative, et la date à laquelle le silence vaut
   acceptation. Le délai court de la réception de la demande complète. */
const INSTRUCTION = {
  accord: { jours: 15, article: "L. 1233-57-4", quoi: "validation de l'accord collectif majoritaire" },
  unilateral: { jours: 21, article: "L. 1233-57-4", quoi: "homologation du document unilatéral" },
};
function instruction(f) {
  const voie = (f.pse || {}).voie;
  if (!voie || !INSTRUCTION[voie]) return { connu: false, motif: "La voie retenue n'est pas arrêtée : le délai d'instruction ne peut pas être calculé." };
  const r = INSTRUCTION[voie];
  const depot = (f.pse || {}).dateDepotAdmin;
  if (!depot) return { connu: true, ...r, motif: `Délai de ${r.jours} jours pour la ${r.quoi}, à compter de la réception du dossier complet. La date de dépôt n'est pas renseignée.` };
  const echeance = ajouter(depot, r.jours);
  return { connu: true, ...r, depot, echeance,
    motif: `Dossier déposé le ${depot} : la décision doit être notifiée au plus tard le ${echeance}. Passé ce terme, le silence vaut acceptation, et l'employeur transmet alors au comité une copie de la demande accompagnée de son accusé de réception.` };
}
function ajouter(iso, jours) {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() + jours);
  return d.toISOString().slice(0, 10);
}

/* La consultation du comité sur le projet, article L. 1233-30.

   Deux choses distinctes, et le module les distingue parce que les confondre
   est l'erreur ordinaire :

   — le comité tient AU MOINS DEUX RÉUNIONS espacées d'au moins quinze jours ;
   — il rend ses deux avis dans un délai qui, à compter de la première réunion,
     ne peut excéder deux, trois ou quatre mois selon le nombre de licenciements.

   Le second est un plafond légal supplétif : une convention ou un accord
   collectif peut prévoir des délais différents — plus longs comme plus courts.
   Le moteur le dit et refuse de conclure quand un accord est déclaré sans être
   versé. À défaut d'avis dans le délai, le comité est réputé consulté. */
const DELAIS_AVIS = [
  { seuil: 0, mois: 2, texte: "moins de cent licenciements" },
  { seuil: 100, mois: 3, texte: "au moins cent et moins de deux cent cinquante" },
  { seuil: 250, mois: 4, texte: "au moins deux cent cinquante" },
];
const ESPACEMENT_MINIMAL = 15;   /* jours, entre deux réunions */

function consultation(f) {
  const n = nombre(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
  if (n === null) return { connu: false, motif: "Le nombre de licenciements n'est pas renseigné : le délai maximal d'avis ne peut pas être déterminé." };
  const t = [...DELAIS_AVIS].reverse().find(x => n >= x.seuil);
  const reunions = Array.isArray(f.datesReunionsCSE) ? f.datesReunionsCSE.filter(Boolean).slice().sort() : [];
  return { connu: true, mois: t.mois, tranche: t.texte, reunions,
    premiere: reunions[0] || null,
    echeance: reunions[0] ? ajouterMois(reunions[0], t.mois) : null,
    motif: `${n} licenciements — ${t.texte} : le comité rend ses deux avis dans un délai qui ne peut excéder ${t.mois} mois à compter de sa première réunion. Une convention ou un accord collectif peut prévoir des délais différents. À défaut d'avis dans le délai, le comité est réputé avoir été consulté.` };
}
function ajouterMois(iso, mois) {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return null;
  const j = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + mois);
  /* Le 31 mai plus trois mois n'est pas le 31 août pour tout le monde : quand le
     mois d'arrivée est plus court, on retient son dernier jour. */
  if (d.getUTCDate() !== j) d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}
const joursEntre = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);

/* La priorité de réembauche : un an à compter de la rupture, et seulement si le
   salarié la demande dans ce même délai (L. 1233-45). L'obligation d'information
   des représentants du personnel, elle, ne dépend d'aucune demande. */
function priorite(f) {
  const d = (f.pse || {}).dateRupture || f.dateNotification;
  if (!d) return { connu: false, motif: "La date de rupture n'est pas renseignée." };
  return { connu: true, depuis: d, jusqu: ajouter(d, 365),
    motif: `La priorité de réembauche court jusqu'au ${ajouter(d, 365)} pour le salarié qui en fait la demande dans ce même délai.` };
}

module.exports = { planDu, accompagnement, instruction, priorite, consultation,
  INSTRUCTION, SEUIL_MILLE, DELAIS_AVIS, ESPACEMENT_MINIMAL, ajouter, ajouterMois, joursEntre, ECART };

});

__def("./dates.js", function(module, exports, require){
/* Les dates, et le refus de conclure sur une chronologie impossible.

   Le défaut corrigé ici était le même dans les deux moteurs et se lisait sur la
   page de résultat : un contrôle soustrayait deux dates, obtenait un nombre
   négatif, constatait qu'il n'excédait pas le délai légal et prononçait la
   conformité. « Avis rendu -58 jours après la remise des informations » a été
   imprimé tel quel. Un écart négatif ne signifie jamais que le délai est tenu :
   il signifie que les deux dates sont dans le mauvais ordre, donc que l'une
   d'elles est fausse. C'est une donnée à corriger, pas un délai à valider.

   Une seule fonction en tire les conséquences, et les deux moteurs l'appellent :
   ecart() ne rend un nombre de jours que si les deux dates existent et se
   suivent. Sinon elle dit pourquoi, et l'appelant ne peut pas conclure. */

/* Le 30 février tombe ici : new Date("2026-02-30") ne jette pas, il décale. */
const estDateISO = s => {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [a, m, j] = s.split("-").map(Number);
  if (m < 1 || m > 12) return false;
  const dernier = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return j >= 1 && j <= dernier;
};

const JOUR = 86400000;
const jour = s => Date.UTC(...s.split("-").map((x, i) => i === 1 ? +x - 1 : +x));

/* ecart(depuis, jusqu) — le nombre de jours écoulés du premier au second.
   Rend { valide: true, jours } si, et seulement si, les deux dates existent et
   sont dans cet ordre. Sinon { valide: false, cause, motif } : « format » quand
   une date n'existe pas, « ordre » quand la chronologie est inversée. */
function ecart(depuis, jusqu, nomDepuis, nomJusqu) {
  const nd = nomDepuis || "la première date", nj = nomJusqu || "la seconde date";
  if (!estDateISO(depuis)) return { valide: false, cause: "format", jours: null,
    motif: `${nd} (${depuis === undefined || depuis === null || depuis === "" ? "non renseignée" : "« " + depuis + " »"}) n'est pas une date existante au format AAAA-MM-JJ.` };
  if (!estDateISO(jusqu)) return { valide: false, cause: "format", jours: null,
    motif: `${nj} (${jusqu === undefined || jusqu === null || jusqu === "" ? "non renseignée" : "« " + jusqu + " »"}) n'est pas une date existante au format AAAA-MM-JJ.` };
  const j = Math.round((jour(jusqu) - jour(depuis)) / JOUR);
  if (j < 0) return { valide: false, cause: "ordre", jours: j,
    motif: `${nj} (${jusqu}) est antérieure de ${-j} jour(s) à ${nd} (${depuis}). La chronologie est impossible : l'une des deux dates est erronée. Aucun délai ne peut être vérifié tant qu'elle n'est pas corrigée.` };
  return { valide: true, cause: null, jours: j, motif: null };
}

/* Le même écart exprimé en années, pour les durées de mandat. */
function ecartAnnees(depuis, jusqu, nomDepuis, nomJusqu) {
  const e = ecart(depuis, jusqu, nomDepuis, nomJusqu);
  return e.valide ? { ...e, annees: +(e.jours / 365.2425).toFixed(2) } : { ...e, annees: null };
}

module.exports = { estDateISO, ecart, ecartAnnees, JOUR };

});

__def("./controles-pse.js", function(module, exports, require){
/* Les contrôles du plan de sauvegarde de l'emploi.

   Ce module est distinct du module économique parce que son objet l'est : le
   module économique vérifie qu'un licenciement peut être prononcé ; celui-ci
   vérifie qu'un plan tient devant l'administration. Il travaille néanmoins sur
   la même fiche — l'effectif, le nombre de licenciements et le calendrier ne se
   ressaisissent pas — et le régime du plan est calculé par moteur-pse.js.

   Une chose ne peut pas être contrôlée et il faut le dire ici plutôt que dans
   une note : AUCUN TEXTE NE FIXE LE MONTANT D'UN PLAN. La proportionnalité aux
   moyens de l'entreprise, de l'unité économique et sociale et du groupe est
   appréciée par l'autorité administrative, puis par le juge administratif
   (L. 1233-57-3). Les contrôles de calibrage calculent donc des rapports, les
   affichent, et rendent « risque à vérifier ». Aucun ne rend « conforme » sur
   le montant. Un feu vert sur ce point serait faux, et il serait le plus
   coûteux de tous.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ». */
const M = require("./moteur-pse.js");
const { L1233_62, RECLASSEMENT, SUIVI } = require("./mesures.js");
const REC = require("./recevabilite.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const nb = x => (typeof x === "number" && isFinite(x) ? x : null);
const euros = n => n === null ? "—" : n.toLocaleString("fr-FR") + " €";

/* Le garde commun : tant que le plan n'est pas dû, aucun contrôle du module
   n'a d'objet ; et tant que l'on ne sait pas s'il est dû, aucun ne conclut. */
function siPlanDu(f, suite) {
  const r = M.planDu(f);
  if (r.du === null) return { etat: MANQ, motif: r.motif };
  if (r.du === false) return { etat: SO, motif: r.motif };
  return suite(r);
}

/* La liste des mesures saisies. Le formulaire la remplit sous forme de tableau
   — une ligne par mesure — importable depuis Excel ou Word. */
const lignes = f => Array.isArray((f.plan || {}).mesures) ? (f.plan || {}).mesures : null;

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------- le contenu du plan */

ctl("PSE-CTL-CON-01", "Contenu du plan",
  "Les sept rubriques de l'article L. 1233-62 ont-elles été examinées ?",
  ["L. 1233-62"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie : le contenu du plan ne peut pas être examiné." };
    const vues = new Set(L.map(m => String(m.rubrique || "").trim()).filter(Boolean));
    const absentes = L1233_62.mesures.filter(m => !vues.has(m.marque));
    if (!absentes.length)
      return { etat: CONF, motif: `Les ${L1233_62.mesures.length} rubriques de l'article sont toutes rattachées à au moins une mesure du plan.` };
    /* La liste n'est pas limitative — « des mesures telles que » — et l'absence
       d'une rubrique n'est donc pas une non-conformité par elle-même. Mais
       l'administration contrôle le plan au regard de ces rubriques : une
       rubrique laissée vide sans explication est un motif de refus ordinaire. */
    return { etat: RISQ, motif: `${absentes.length} rubrique(s) de l'article L. 1233-62 ne sont rattachées à aucune mesure : ${absentes.map(m => m.marque).join(", ")}. La liste de l'article n'est pas limitative — il énonce « des mesures telles que » — mais l'administration apprécie le plan au regard de ces rubriques. Une rubrique écartée doit l'être en connaissance de cause, et le motif de son écartement doit pouvoir être donné.` };
  }));

ctl("PSE-CTL-CON-02", "Contenu du plan",
  "Le plan de reclassement interne est-il intégré et vise-t-il les salariés les plus exposés ?",
  ["L. 1233-61"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie." };
    const rec = L.filter(m => String(m.rubrique || "").trim() === "1°");
    if (!rec.length)
      return { etat: NC, motif: `Aucune action de reclassement interne n'est saisie. ${RECLASSEMENT.texte} Le plan de reclassement n'est pas une mesure parmi d'autres : l'article en fait le cœur du plan.` };
    if (vide((f.plan || {}).salariesExposes))
      return { etat: MANQ, motif: "Les salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification — ne sont pas identifiés. L'article les vise nommément." };
    return { etat: CONF, motif: `${rec.length} action(s) de reclassement interne saisie(s), et les salariés dont la réinsertion est particulièrement difficile sont identifiés.` };
  }));

ctl("PSE-CTL-CON-03", "Contenu du plan",
  "Le reclassement interne est-il limité au territoire national ?",
  ["L. 1233-61", "L. 1233-62, 1°"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie." };
    const hors = L.filter(m => /étranger|hors de France|international|filiale étrangère/i.test(String(m.intitule || "") + " " + String(m.detail || "")));
    return hors.length
      ? { etat: RISQ, motif: `${hors.length} mesure(s) paraissent porter sur des emplois situés hors du territoire national. Le plan de reclassement de l'article L. 1233-61 vise le reclassement sur le territoire national : une offre étrangère ne compte pas dans l'obligation, même si rien n'interdit de la proposer en sus.` }
      : { etat: CONF, motif: "Aucune mesure de reclassement ne paraît porter hors du territoire national." };
  }));

/* ---------------------------------------------------------- le chiffrage */

ctl("PSE-CTL-CHF-01", "Chiffrage",
  "Chaque mesure porte-t-elle un budget, un nombre de bénéficiaires et une durée ?",
  ["L. 1233-57-3"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie." };
    const incomplets = L.filter(m => nb(m.budget) === null || nb(m.beneficiaires) === null || vide(m.duree));
    return incomplets.length
      ? { etat: RISQ, motif: `${incomplets.length} mesure(s) sur ${L.length} ne portent pas à la fois un budget, un nombre de bénéficiaires et une durée : ${incomplets.slice(0, 5).map(m => m.intitule || m.rubrique || "sans intitulé").join(" ; ")}${incomplets.length > 5 ? " …" : ""}. L'administration apprécie la proportionnalité des moyens : une mesure non chiffrée n'est pas appréciable, et elle ne pèse rien dans cette appréciation.` }
      : { etat: CONF, motif: `Les ${L.length} mesures du plan portent un budget, un nombre de bénéficiaires et une durée.` };
  }));

ctl("PSE-CTL-CHF-02", "Chiffrage",
  "Le budget total du plan est-il cohérent avec le détail des mesures ?",
  ["L. 1233-62"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    const annonce = nb((f.plan || {}).budgetTotal);
    if (L === null || annonce === null) return { etat: MANQ, motif: "Le budget total annoncé ou le détail des mesures n'est pas renseigné." };
    const somme = L.reduce((n, m) => n + (nb(m.budget) || 0), 0);
    const ecart = Math.abs(somme - annonce);
    if (!somme) return { etat: MANQ, motif: "Aucune mesure n'est chiffrée : la somme ne peut pas être comparée au total annoncé." };
    if (ecart / annonce > 0.02)
      return { etat: NC, motif: `Budget total annoncé : ${euros(annonce)}. Somme des mesures : ${euros(somme)}. Écart de ${euros(ecart)}. Un plan dont le total ne correspond pas au détail se retourne contre celui qui le produit : c'est la première vérification faite en séance.` };
    return { etat: CONF, motif: `Budget total de ${euros(annonce)}, conforme à la somme des mesures.` };
  }));

/* --------------------------------------------------------- le calibrage

   Rien ici ne conclut à la conformité. Les rapports sont calculés et affichés ;
   l'appréciation appartient à l'administration puis au juge. */

ctl("PSE-CTL-CAL-01", "Calibrage",
  "À combien revient le plan par salarié licencié ?",
  ["L. 1233-57-3, 2°"],
  f => siPlanDu(f, r => {
    const annonce = nb((f.plan || {}).budgetTotal);
    const n = nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
    if (annonce === null || n === null || !n) return { etat: MANQ, motif: "Le budget total du plan ou le nombre de licenciements n'est pas renseigné : le coût par salarié ne peut pas être calculé." };
    const parTete = Math.round(annonce / n);
    return { etat: RISQ, calcul: { budget: annonce, licenciements: n, parTete },
      motif: `Budget de ${euros(annonce)} pour ${n} licenciements, soit ${euros(parTete)} par salarié. Ce chiffre n'est pas un verdict : aucun texte ne fixe de montant. L'administration apprécie les mesures d'accompagnement au regard de l'importance du projet et des moyens du groupe (L. 1233-57-3, 1° et 2°). Le chiffre est donné pour être comparé aux plans du même secteur et aux précédents de l'entreprise.` };
  }));

ctl("PSE-CTL-CAL-02", "Calibrage",
  "Le plan est-il rapporté aux moyens du groupe, et non à ceux de la seule filiale ?",
  ["L. 1233-57-3, 1°"],
  f => siPlanDu(f, () => {
    if (vide(f.groupe) ) return { etat: MANQ, motif: "L'appartenance à un groupe n'est pas renseignée : le périmètre d'appréciation des moyens ne peut pas être déterminé." };
    if (f.groupe === false || f.groupe === "non")
      return { etat: RISQ, motif: "L'entreprise n'appartient à aucun groupe : les moyens appréciés sont ceux de l'entreprise et, s'il en existe une, de l'unité économique et sociale. L'appréciation reste celle de l'administration." };
    const annonce = nb((f.plan || {}).budgetTotal);
    const res = nb((f.plan || {}).resultatGroupe);
    if (annonce === null || res === null)
      return { etat: MANQ, motif: "Le budget du plan ou le résultat consolidé du groupe n'est pas renseigné. Un plan calibré sur les seuls moyens de la filiale est le motif de refus d'homologation le plus fréquent : le rapport doit pouvoir être présenté." };
    const part = res > 0 ? Math.round((annonce / res) * 1000) / 10 : null;
    return { etat: RISQ, calcul: { budget: annonce, resultatGroupe: res, part },
      motif: `Budget du plan : ${euros(annonce)}. Résultat consolidé du groupe : ${euros(res)}${part !== null ? `, soit ${part} % de celui-ci` : ""}. L'article L. 1233-57-3 fait des moyens du groupe le premier critère d'appréciation. Le rapport est calculé et affiché ; il n'est pas jugé ici — aucun seuil n'existe.` };
  }));

ctl("PSE-CTL-CAL-03", "Calibrage",
  "Les comptes du groupe sont-ils versés au dossier ?",
  ["L. 1233-57-3, 1°"],
  f => siPlanDu(f, () => {
    if (vide(f.groupe)) return { etat: MANQ, motif: "L'appartenance à un groupe n'est pas renseignée." };
    if (f.groupe === false || f.groupe === "non") return { etat: SO, motif: "L'entreprise n'appartient à aucun groupe." };
    const P = Array.isArray(f.pieces) ? f.pieces : [];
    return P.some(p => /comptes.?groupe|consolid/i.test(String(p.type || p.nom || "")))
      ? { etat: CONF, motif: "Les comptes consolidés du groupe sont versés : l'administration peut apprécier la proportionnalité des mesures." }
      : { etat: RISQ, motif: "Les comptes du groupe ne sont pas versés. L'administration apprécie les moyens du groupe ; à défaut de comptes, elle apprécie ce qu'elle a, et l'employeur perd la main sur ce qui est retenu contre lui." };
  }));

/* -------------------------------------------------- l'accompagnement individuel */

ctl("PSE-CTL-ACC-01", "Accompagnement individuel",
  "Le dispositif d'accompagnement dû est-il celui que l'effectif commande ?",
  ["L. 1233-66", "L. 1233-71"],
  f => {
    const a = M.accompagnement(f);
    if (!a.dispositif) return { etat: MANQ, motif: a.motif };
    const choisi = (f.plan || {}).accompagnement;
    if (vide(choisi)) return { etat: MANQ, motif: `${a.motif} Le dispositif retenu n'est pas renseigné.` };
    return String(choisi).toLowerCase().indexOf(a.dispositif.slice(0, 6).toLowerCase()) >= 0 || String(choisi) === a.dispositif
      ? { etat: CONF, motif: `Dispositif retenu : ${choisi}. ${a.motif}` }
      : { etat: NC, motif: `Dispositif retenu : « ${choisi} ». Or ${a.motif} Les deux dispositifs ne se cumulent pas, et ne se choisissent pas : l'effectif les commande.` };
  });

ctl("PSE-CTL-ACC-02", "Accompagnement individuel",
  "Le congé de reclassement respecte-t-il sa durée maximale et son financement ?",
  ["L. 1233-71", "L. 1233-72"],
  f => {
    const a = M.accompagnement(f);
    if (!a.dispositif) return { etat: MANQ, motif: a.motif };
    if (a.dispositif !== "congé de reclassement") return { etat: SO, motif: a.motif };
    const d = nb((f.plan || {}).dureeConge);
    if (d === null) return { etat: MANQ, motif: "La durée du congé de reclassement n'est pas renseignée." };
    const reconversion = (f.plan || {}).formationReconversion === true || (f.plan || {}).formationReconversion === "oui";
    const max = reconversion ? 24 : 12;
    if (d > max)
      return { etat: NC, motif: `Congé de ${d} mois. La durée ne peut excéder douze mois, portés à vingt-quatre en cas de formation de reconversion professionnelle${reconversion ? "" : " — que le dossier ne mentionne pas"} (L. 1233-71).` };
    return { etat: CONF, motif: `Congé de ${d} mois, dans la limite de ${max}. Il est pris pendant le préavis, que le salarié est dispensé d'exécuter ; lorsqu'il excède le préavis, le terme de celui-ci est reporté jusqu'à la fin du congé, et la rémunération de la période excédentaire est celle de l'allocation de conversion (L. 1233-72). L'employeur finance l'ensemble des actions.` };
  });

ctl("PSE-CTL-ACC-03", "Accompagnement individuel",
  "Le contrat de sécurisation professionnelle est-il proposé au bon moment ?",
  ["L. 1233-66"],
  f => {
    const a = M.accompagnement(f);
    if (!a.dispositif) return { etat: MANQ, motif: a.motif };
    if (a.dispositif !== "contrat de sécurisation professionnelle") return { etat: SO, motif: a.motif };
    const r = M.planDu(f);
    const dateProp = (f.plan || {}).dateProposition;
    const dateDec = (f.pse || {}).dateDecisionAdmin;
    if (vide(dateProp)) return { etat: MANQ, motif: "La date de proposition du contrat de sécurisation professionnelle n'est pas renseignée. À défaut de proposition, l'employeur doit à l'assurance chômage deux mois de salaire brut par salarié, portés à trois si le salarié adhère sur proposition de France Travail." };
    if (r.du === true) {
      if (vide(dateDec)) return { etat: MANQ, motif: "Un plan est dû : la proposition doit être faite après la notification de la décision de validation ou d'homologation, dont la date n'est pas renseignée." };
      return dateProp >= dateDec
        ? { etat: CONF, motif: `Proposition du ${dateProp}, postérieure à la décision administrative du ${dateDec}.` }
        : { etat: NC, motif: `Proposition du ${dateProp}, antérieure à la décision administrative du ${dateDec}. Lorsqu'un plan est dû, la proposition est faite après la notification de la décision (L. 1233-66).` };
    }
    return { etat: CONF, motif: `Proposition du ${dateProp}. Hors plan, elle se fait lors de l'entretien préalable ou à l'issue de la dernière réunion des représentants du personnel.` };
  });

/* ------------------------------------------------------- la voie et l'instruction */

ctl("PSE-CTL-VOI-01", "Voie et instruction",
  "La voie retenue est-elle arrêtée : accord majoritaire ou document unilatéral ?",
  ["L. 1233-24-1", "L. 1233-57-3"],
  f => siPlanDu(f, () => {
    const v = (f.pse || {}).voie;
    if (vide(v)) return { etat: MANQ, motif: "La voie n'est pas arrêtée. Elle détermine tout le calendrier — quinze jours d'instruction contre vingt et un — et se choisit avant la première réunion." };
    return { etat: CONF, motif: v === "accord"
      ? "Accord majoritaire : signature par des syndicats ayant recueilli au moins 50 % des suffrages exprimés au premier tour des dernières élections, puis validation administrative dans les quinze jours."
      : "Document unilatéral soumis à homologation dans les vingt et un jours : l'administration vérifie le contenu, la régularité de la consultation et le respect des articles L. 1233-61 à L. 1233-63." };
  }));

ctl("PSE-CTL-VOI-02", "Voie et instruction",
  "L'accord majoritaire remplit-il la condition de représentativité ?",
  ["L. 1233-24-1"],
  f => siPlanDu(f, () => {
    if ((f.pse || {}).voie !== "accord") return { etat: SO, motif: "Voie du document unilatéral : la condition de représentativité ne s'applique pas." };
    const s = nb((f.pse || {}).suffrages);
    if (s === null) return { etat: MANQ, motif: "Le pourcentage de suffrages recueilli par les organisations signataires n'est pas renseigné." };
    return s >= 50
      ? { etat: CONF, motif: `${s} % des suffrages exprimés au premier tour des dernières élections : la condition est remplie.` }
      : { etat: NC, motif: `${s} % des suffrages. L'accord doit être signé par des organisations ayant recueilli au moins 50 % des suffrages exprimés au premier tour des dernières élections des titulaires au comité (L. 1233-24-1). En deçà, il n'existe pas comme accord majoritaire, et la voie bascule sur le document unilatéral.` };
  }));

ctl("PSE-CTL-VOI-03", "Voie et instruction",
  "Le délai d'instruction est-il tenu, et l'échéance du silence connue ?",
  ["L. 1233-57-4"],
  f => siPlanDu(f, () => {
    const i = M.instruction(f);
    if (!i.connu) return { etat: MANQ, motif: i.motif };
    if (!i.echeance) return { etat: MANQ, motif: i.motif };
    const dec = (f.pse || {}).dateDecisionAdmin;
    if (vide(dec)) return { etat: RISQ, motif: `${i.motif} Aucune décision n'est enregistrée à ce jour.` };
    return dec <= i.echeance
      ? { etat: CONF, motif: `Décision notifiée le ${dec}, dans le délai de ${i.jours} jours expirant le ${i.echeance}.` }
      : { etat: RISQ, motif: `Décision datée du ${dec}, postérieure à l'échéance du ${i.echeance}. Le silence gardé pendant le délai vaut acceptation : une décision notifiée après ce terme intervient sur une demande déjà acceptée, ce qui n'est pas neutre. Vérifiez la date de réception du dossier complet, qui seule fait courir le délai.` };
  }));

ctl("PSE-CTL-VOI-04", "Voie et instruction",
  "La notification des licenciements intervient-elle après la décision administrative ?",
  ["L. 1233-39"],
  f => siPlanDu(f, () => {
    const d = (f.pse || {}).dateDecisionAdmin;
    if (vide(d)) return { etat: MANQ, motif: "La date de la décision de validation ou d'homologation n'est pas renseignée." };
    if (vide(f.dateNotification)) return { etat: MANQ, motif: "La date de notification des licenciements n'est pas renseignée." };
    return f.dateNotification > d
      ? { etat: CONF, motif: `Décision du ${d}, notification du ${f.dateNotification} : l'ordre est respecté.` }
      : { etat: NC, motif: `Notification prévue le ${f.dateNotification}, décision administrative le ${d} : la notification ne peut intervenir qu'après la décision (L. 1233-39).` };
  }));

/* ---------------------------------------------------------------- le suivi */

ctl("PSE-CTL-SUI-01", "Suivi",
  "Le plan détermine-t-il les modalités de suivi de sa mise en œuvre ?",
  ["L. 1233-63"],
  f => siPlanDu(f, () => {
    const s = (f.plan || {}).suivi || {};
    const absents = SUIVI.exige.filter(x => vide(s[x.cle]));
    if (absents.length === SUIVI.exige.length) return { etat: MANQ, motif: "Les modalités de suivi ne sont pas renseignées." };
    return absents.length
      ? { etat: NC, motif: `Le suivi est incomplet. Manque : ${absents.map(x => x.intitule).join(" ; ")}. L'article L. 1233-63 met ces trois obligations à la charge de l'employeur, et l'administration est associée au suivi.` }
      : { etat: CONF, motif: "Les modalités de suivi sont déterminées, la consultation du comité est prévue et le bilan destiné à l'administration l'est aussi." };
  }));

/* -------------------------------------------------- la priorité de réembauche */

ctl("PSE-CTL-REM-01", "Priorité de réembauche",
  "La priorité de réembauche est-elle mise en œuvre et les élus informés ?",
  ["L. 1233-45"],
  f => {
    const p = M.priorite(f);
    if (!p.connu) return { etat: MANQ, motif: p.motif };
    const d = (f.plan || {}).demandesReembauche;
    const info = (f.plan || {}).informationElusPostes;
    if (vide(info)) return { etat: MANQ, motif: `${p.motif} L'information des représentants du personnel sur les postes disponibles n'est pas renseignée : elle ne dépend, elle, d'aucune demande du salarié.` };
    if (info === false || info === "non")
      return { etat: NC, motif: "Les représentants du personnel ne sont pas informés des postes disponibles. L'article L. 1233-45 met cette information à la charge de l'employeur sans la subordonner à la demande d'un salarié." };
    if (vide(d)) return { etat: RISQ, motif: `${p.motif} Les demandes reçues ne sont pas recensées : la preuve du respect de la priorité repose sur ce recensement et sur la traçabilité des postes devenus disponibles.` };
    return { etat: CONF, motif: `${p.motif} Les demandes reçues sont recensées et les élus sont informés des postes disponibles.` };
  });

/* --------------------------------------- la consultation du comité sur le projet */

ctl("PSE-CTL-CSE-01", "Consultation du comité",
  "Le comité a-t-il tenu au moins deux réunions espacées d'au moins quinze jours ?",
  ["L. 1233-30, I"],
  f => siPlanDu(f, () => {
    const r = Array.isArray(f.datesReunionsCSE) ? f.datesReunionsCSE.filter(Boolean).slice().sort() : [];
    if (!r.length) return { etat: MANQ, motif: "Les dates des réunions du comité ne sont pas renseignées." };
    if (r.length < 2)
      return { etat: NC, motif: `Une seule réunion est renseignée (${r[0]}). Le comité tient au moins deux réunions (L. 1233-30, I) : la seconde n'est pas une formalité, c'est celle où l'avis se rend.` };
    const ecarts = r.slice(1).map((d, i) => ({ de: r[i], a: d, jours: M.joursEntre(r[i], d) }));
    const courts = ecarts.filter(e => e.jours < M.ESPACEMENT_MINIMAL);
    return courts.length
      ? { etat: NC, motif: `Deux réunions sont espacées de moins de quinze jours : ${courts.map(e => `${e.de} → ${e.a}, ${e.jours} jour(s)`).join(" ; ")}. L'article L. 1233-30, I impose un espacement d'au moins quinze jours.` }
      : { etat: CONF, motif: `${r.length} réunions, espacées d'au moins quinze jours (${ecarts.map(e => e.jours + " j").join(", ")}).` };
  }));

ctl("PSE-CTL-CSE-02", "Consultation du comité",
  "L'avis est-il rendu dans le délai que le nombre de licenciements commande ?",
  ["L. 1233-30, II"],
  f => siPlanDu(f, () => {
    const c = M.consultation(f);
    if (!c.connu) return { etat: MANQ, motif: c.motif };
    if (!c.premiere) return { etat: MANQ, motif: `${c.motif} La date de la première réunion n'est pas renseignée.` };
    /* Un accord peut prévoir d'autres délais. Tant qu'il est déclaré sans être
       versé, la règle légale ne peut pas être opposée avec certitude : le
       contrôle le dit au lieu de conclure sur un texte qu'il n'a pas lu. */
    if (f.accordDelaisConsultation === true || f.accordDelaisConsultation === "oui") {
      const P = Array.isArray(f.pieces) ? f.pieces : [];
      if (!P.some(p => /accord.?d[ée]lais|accord.?m[ée]thode/i.test(String(p.type || p.nom || ""))))
        return { etat: RISQ, motif: `Un accord fixant des délais différents est déclaré mais n'est pas versé. Le plafond légal de ${c.mois} mois n'est donc pas opposable en l'état, et l'application ne peut pas vérifier celui que vous appliquez : joignez l'accord.` };
    }
    const avis = (f.pse || {}).dateAvisCSE || f.dateAvisCSE;
    if (vide(avis)) return { etat: RISQ, motif: `${c.motif} Aucun avis n'est enregistré : à défaut d'avis rendu au ${c.echeance}, le comité sera réputé consulté — ce qui ne dispense pas d'avoir tenu les réunions.` };
    return avis <= c.echeance
      ? { etat: CONF, motif: `Première réunion le ${c.premiere}, avis du ${avis} : le délai de ${c.mois} mois, qui expirait le ${c.echeance}, est tenu.` }
      : { etat: RISQ, motif: `Avis du ${avis}, postérieur au terme du ${c.echeance} (${c.mois} mois après la première réunion du ${c.premiere}). Passé ce terme, le comité était déjà réputé consulté : l'avis tardif n'a pas d'effet sur la régularité, mais un calendrier qui déborde le délai légal signale que le dossier n'a pas suivi le rythme prévu.` };
  }));

ctl("PSE-CTL-CSE-03", "Consultation du comité",
  "L'expertise décidée par le comité tient-elle dans le calendrier ?",
  ["L. 1233-34", "L. 1233-35"],
  f => siPlanDu(f, () => {
    if (vide(f.expertisePSE)) return { etat: MANQ, motif: "Le recours à une expertise n'est pas renseigné. Le comité peut la décider lors de la première réunion, et elle pèse sur tout le calendrier." };
    if (f.expertisePSE === false || f.expertisePSE === "non")
      return { etat: SO, motif: "Aucune expertise n'a été décidée par le comité." };
    const c = M.consultation(f);
    const d = (f.pse || {}).dateDesignationExpert;
    if (vide(d)) return { etat: MANQ, motif: "La date de désignation de l'expert n'est pas renseignée." };
    if (c.premiere && d > c.premiere && M.joursEntre(c.premiere, d) > 0 && f.datesReunionsCSE && f.datesReunionsCSE.length && d > f.datesReunionsCSE.slice().sort()[0])
      return { etat: RISQ, motif: `Expert désigné le ${d}, après la première réunion du ${c.premiere}. L'article L. 1233-34 place la décision de recourir à l'expertise à la première réunion : une désignation postérieure expose la procédure à la contestation, sans que le délai d'avis en soit prolongé.` };
    return { etat: CONF, motif: `Expert désigné le ${d}. Il demande à l'employeur, dans les dix jours de sa désignation, les informations qu'il juge nécessaires ; l'employeur répond dans les huit jours (L. 1233-35). Le délai d'avis, lui, reste celui de ${c.mois} mois.` };
  }));

/* ------------------------------------------------------------ la cohérence */

const COHERENCE = ["PSE-CTL-COH-01"];
ctl("PSE-CTL-COH-01", "Cohérence",
  "Le nombre de bénéficiaires des mesures dépasse-t-il le nombre de licenciements ?",
  ["L. 1233-62"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    const n = nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
    if (L === null || n === null) return { etat: MANQ, motif: "Les mesures ou le nombre de licenciements ne sont pas renseignés." };
    /* Toutes les rubriques ne visent pas les seuls salariés licenciés, et le
       contrôle serait faux s'il l'ignorait. Le reclassement interne (1°), l'aide
       à la création d'activité (4°) et la formation de reconversion (5°) sont
       proposés aux salariés dont le licenciement est envisagé. La reprise
       d'activité (1° bis), la création d'activités nouvelles (2°), la
       réactivation du bassin d'emploi (3°) et la réduction du temps de travail
       ou des heures supplémentaires (6°) peuvent concerner tout l'effectif —
       la dernière n'a même de sens que si elle le dépasse largement. */
    const INDIVIDUELLES = new Set(["1°", "4°", "5°"]);
    const visees = L.filter(x => INDIVIDUELLES.has(String(x.rubrique || "").trim()));
    const max = visees.reduce((m, x) => Math.max(m, nb(x.beneficiaires) || 0), 0);
    if (!max) return { etat: MANQ, motif: "Aucune mesure de reclassement, d'aide à la création ou de formation ne porte de nombre de bénéficiaires." };
    return max > n
      ? { etat: NC, motif: `Une mesure individuelle vise ${max} bénéficiaires alors que ${n} licenciements sont envisagés. Le reclassement interne, l'aide à la création d'activité et la formation de reconversion s'adressent aux salariés dont le licenciement est envisagé : soit le décompte des licenciements est faux, soit le chiffrage l'est — et l'un comme l'autre se voient en séance.` }
      : { etat: CONF, motif: `Le nombre de bénéficiaires le plus élevé parmi les mesures individuelles (${max}) n'excède pas les ${n} licenciements envisagés. Les mesures collectives — reprise d'activité, création d'activités nouvelles, bassin d'emploi, temps de travail — ne sont pas comparées à ce nombre : elles peuvent légitimement viser au-delà.` };
  }));

/* Les contrôles de détection ne concluent jamais à la conformité : ils
   signalent une situation et s'arrêtent, parce que le sujet excède ce qu'une
   base peut trancher. Le calibrage en fait partie par nature. */
const DETECTION = ["PSE-CTL-CAL-01", "PSE-CTL-CAL-02"];

REC.surSilence(C, []);

module.exports = { C, ETATS, DETECTION, COHERENCE };

if (require.main === module) {
  console.log(`${C.length} contrôles`);
  const rub = {};
  for (const c of C) (rub[c.rubrique] = rub[c.rubrique] || []).push(c.id);
  for (const r of Object.keys(rub)) console.log(`  ${r} — ${rub[r].length} : ${rub[r].join(", ")}`);
  const sansTexte = C.filter(c => !c.fondement || !c.fondement.length);
  if (sansTexte.length) { console.error("Contrôles sans fondement : " + sansTexte.map(c => c.id).join(", ")); process.exit(1); }
  console.log(`dont détection ${DETECTION.length}, cohérence ${COHERENCE.length} — tous fondés sur un article`);
}

});

__def("./mesures.js", function(module, exports, require){
/* Les mesures du plan de sauvegarde de l'emploi, extraites de l'article et non
   recopiées.

   Le module économique tenait cinq rubriques écrites à la main. L'article
   L. 1233-62 en énumère sept — le 1° bis, introduit pour la reprise d'activité,
   ne s'y trouvait pas, et le 3° (reclassement externe, réactivation du bassin
   d'emploi) et le 6° (réduction ou aménagement du temps de travail) non plus.
   Une liste recopiée dérive à la première modification du texte ; celle-ci est
   découpée depuis le texte lui-même, et la couverture du découpage est mesurée.

   L'énumération suit la ponctuation de l'article :
     « Le plan prévoit des mesures telles que : 1° … ; 1° bis … ; 2° … ; 6° … »

   Le « telles que » est décisif et il est rendu tel quel : la liste n'est pas
   limitative — un plan peut comporter d'autres mesures — mais l'administration
   contrôle le plan au regard de ces rubriques. L'absence d'une rubrique n'est
   donc pas une non-conformité en soi ; c'est un point que le plan doit avoir
   examiné et, s'il l'écarte, avoir motivé.

   Usage : node mesures.js          mesure la couverture du découpage          */

/* Le dépôt de textes du module : les douze articles dont il a besoin, repris du
   dépôt économique avec leur identifiant de version. Un article peut être
   modifié sans changer de numéro — c'est LEGIARTI… qui dit laquelle des
   versions successives a été lue. */
const T = require("./textes-pse.json");

const net = s => String(s || "").replace(/\s+/g, " ").trim();
function texte(n) {
  const v = T[n];
  if (!v || !v.texte) throw new Error(`Article ${n} non lu à la source.`);
  return net(v.texte);
}
const version = n => (T[n] && T[n].id) || null;

/* Le découpage. Les marqueurs sont ceux de l'article : un chiffre suivi du
   signe degré, éventuellement suivi de « bis ». On coupe dessus, on garde le
   marqueur avec son texte, et l'on retient l'intervalle consommé pour pouvoir
   mesurer ce qui a été laissé de côté. */
const MARQUEUR = /(\d+°(?:\s+bis)?)\s+/g;

function decouper(article) {
  const t = texte(article);
  const debut = t.indexOf("telles que :");
  const corps = debut >= 0 ? t.slice(debut + "telles que :".length) : t;
  const decalage = debut >= 0 ? debut + "telles que :".length : 0;

  const bornes = [];
  let m;
  MARQUEUR.lastIndex = 0;
  while ((m = MARQUEUR.exec(corps)) !== null) bornes.push({ marque: net(m[1]), i: m.index, apres: m.index + m[0].length });

  const mesures = [];
  for (let k = 0; k < bornes.length; k++) {
    const fin = k + 1 < bornes.length ? bornes[k + 1].i : corps.length;
    const brut = net(corps.slice(bornes[k].apres, fin).replace(/[;.]\s*$/, ""));
    if (!brut) continue;
    mesures.push({
      cle: bornes[k].marque.replace(/\s+/g, "-").replace("°", ""),
      marque: bornes[k].marque,
      texte: brut,
      /* Le libellé court : la première proposition, jusqu'à la première virgule
         suivie d'un mot de liaison, ou les quatre-vingts premiers caractères.
         Il sert d'intitulé de champ ; le texte intégral reste sous les yeux. */
      intitule: brut.length <= 88 ? brut : net(brut.slice(0, 85)) + "…",
      debut: decalage + bornes[k].apres,
      finTexte: decalage + fin,
    });
  }

  /* La couverture : ce que le découpage a consommé, rapporté au texte de
     l'énumération. L'en-tête (« Le plan … prévoit des mesures telles que : »)
     n'est pas une mesure et n'entre pas au dénominateur. */
  const total = t.length - decalage;
  const consomme = mesures.reduce((n, x) => n + (x.finTexte - x.debut), 0);
  return {
    article,
    version: version(article),
    limitative: !/telles que/.test(t),
    mesures,
    couverture: total ? Math.round((consomme / total) * 1000) / 10 : 0,
    caracteres: { total, consomme, reste: total - consomme },
  };
}

const L1233_62 = decouper("L1233-62");

/* Le plan de reclassement de l'article L. 1233-61 n'est pas une mesure parmi
   les autres : le texte en fait le cœur du plan (« Ce plan intègre un plan de
   reclassement »), et il vise nommément les salariés dont la réinsertion est
   particulièrement difficile. Il est donc traité à part, avec son texte. */
const RECLASSEMENT = {
  article: "L1233-61",
  version: version("L1233-61"),
  texte: (() => {
    const t = texte("L1233-61");
    const i = t.indexOf("Ce plan intègre");
    const j = t.indexOf("Lorsque le plan de sauvegarde");
    return net(t.slice(i >= 0 ? i : 0, j > 0 ? j : t.length));
  })(),
};

/* Le suivi, article L. 1233-63 : trois obligations distinctes que le plan doit
   porter, et que l'employeur doit exécuter. Elles sont relevées dans le texte
   et non résumées. */
const SUIVI = {
  article: "L1233-63",
  version: version("L1233-63"),
  texte: texte("L1233-63"),
  exige: [
    { cle: "modalites", intitule: "Le plan détermine les modalités de suivi de la mise en œuvre effective des mesures du plan de reclassement" },
    { cle: "consultation", intitule: "Le suivi fait l'objet d'une consultation régulière et détaillée du comité, dont l'avis est transmis à l'autorité administrative" },
    { cle: "bilan", intitule: "L'autorité administrative reçoit un bilan, établi par l'employeur, de la mise en œuvre effective du plan" },
  ],
};

module.exports = { L1233_62, RECLASSEMENT, SUIVI, decouper };

if (require.main === module) {
  const d = L1233_62;
  console.log(`L. 1233-62 — version ${d.version}`);
  console.log(`${d.mesures.length} mesures énumérées, liste ${d.limitative ? "limitative" : "non limitative (« telles que »)"}`);
  for (const m of d.mesures) console.log(`  ${m.marque.padEnd(7)} ${m.intitule}`);
  console.log(`couverture ${d.couverture} % — ${d.caracteres.consomme}/${d.caracteres.total} caractères, reste ${d.caracteres.reste}`);
  if (d.couverture < 95) { console.error("Couverture insuffisante : le découpage laisse du texte de côté."); process.exit(1); }
  console.log(`\nL. 1233-61 — plan de reclassement (version ${RECLASSEMENT.version})\n  ${RECLASSEMENT.texte}`);
  console.log(`\nL. 1233-63 — suivi (version ${SUIVI.version}) : ${SUIVI.exige.length} obligations`);
}

});

__def("./recevabilite.js", function(module, exports, require){
/* Un verdict ne se prononce pas sur une donnée qui ne peut pas exister.

   Chaque module valide déjà ses entrées et le dit dans un contrôle dédié. Cela
   ne suffisait pas : le contrôle de recevabilité criait, et les trente-sept
   autres continuaient de conclure. Une notification datée du 30 février
   produisait encore deux conformités ; un effectif de -50, puis de 299,6,
   produisaient encore des verdicts. Le rapport contenait donc, dans la même
   page, l'affirmation que la donnée est impossible et des conclusions tirées
   d'elle.

   La règle appliquée ici est plus simple que les exceptions qu'il faudrait
   écrire sans elle : un contrôle qui a lu un champ illisible n'a rien constaté.
   Son verdict devient « donnée manquante » — la donnée n'est pas absente, elle
   est inexploitable, ce qui revient au même pour la conclusion — et le motif
   dit lequel des champs lus est en cause. Le contrôle de recevabilité, lui,
   garde son « non conforme » : c'est lui qui porte l'anomalie, et il bloque.

   Comment savoir ce qu'un contrôle a lu, sans le deviner ? En l'observant. La
   fiche est enveloppée dans un Proxy le temps de l'exécution, et l'on relève
   les champs réellement touchés — f.nom, f["nom"] et la déstructuration
   comprises. Aucune liste tenue à la main, donc rien qui puisse dériver. */

const MANQ = "donnée manquante", CONF = "conforme", RISQ = "risque à vérifier", SO = "sans objet";
const CONCLUSIFS = new Set([CONF, "non conforme"]);

/* Remplacer la fonction d'un contrôle sans la rendre illisible.

   Le registre et le questionnaire déduisent les champs lus en inspectant le
   texte de la fonction. Une enveloppe qui masque ce texte casserait la
   garantie de non-divergence — la première tentative l'a fait, et trois
   contre-épreuves l'ont dit aussitôt. L'enveloppe rend donc, quand on
   l'imprime, le texte de la fonction qu'elle enveloppe. */
function remplacer(ctl, fn) {
  const brut = ctl.verdict;
  const source = typeof brut.toString === "function" ? brut.toString() : String(brut);
  Object.defineProperty(fn, "toString", { value: () => source, writable: true, configurable: true });
  ctl.brut = ctl.brut || brut;
  ctl.verdict = fn;
  return brut;
}

/* Le champ de premier niveau : « consultation.dateAvis » est lu à travers
   « consultation », qui est le nom que la sonde voit passer. */
const racine = champ => String(champ).split(".")[0];

function envelopper(controles, valider, exemptes) {
  const hors = new Set(exemptes || []);
  for (const ctl of controles) {
    if (hors.has(ctl.id)) continue;
    const brut = remplacer(ctl, function (f) {
      /* Seules les anomalies de lisibilité font taire un contrôle. Une
         contradiction entre deux valeurs bien formées ne l'empêche pas de
         conclure : elle est précisément ce qu'il a pour objet de constater. */
      const anomalies = (() => { try { return (valider(f) || [])
        .filter(a => (a.nature || "lisibilité") === "lisibilité"); } catch (e) { return []; } })();
      if (!anomalies.length) return brut(f);
      const lus = new Set();
      const p = new Proxy(f, {
        get(c, k) { if (typeof k === "string") lus.add(k); return c[k]; },
        has(c, k) { if (typeof k === "string") lus.add(k); return k in c; },
        getOwnPropertyDescriptor(c, k) {
          if (typeof k === "string") lus.add(k);
          return Reflect.getOwnPropertyDescriptor(c, k);
        },
      });
      const v = brut(p);
      if (!v || !CONCLUSIFS.has(v.etat)) return v;
      const touchees = anomalies.filter(a => lus.has(racine(a.champ)));
      if (touchees.length)
        return { etat: MANQ, illisible: true,
          motif: `Ce contrôle a lu ${touchees.length > 1 ? "des données inexploitables" : "une donnée inexploitable"} : `
            + touchees.map(a => `${a.champ} = « ${a.valeur} » — ${a.motif}`).join(" ; ")
            + ". Aucune conclusion n'en est tirée, dans aucun sens. Corrigez la saisie et relancez l'audit ; le constat qu'aurait rendu ce contrôle est sans valeur tant que la donnée n'existe pas." };
      /* Le contrôle n'a lu aucune des données fautives : son constat tient par
         lui-même. Il ne peut pas pour autant valoir conformité — le document
         se lit d'un bloc, et une page qui affirme qu'une donnée est impossible
         ne peut pas en présenter une autre comme acquise. Le manquement
         constaté, lui, reste constaté : une non-conformité n'est pas effacée
         par une erreur de saisie ailleurs dans le dossier. */
      if (v.etat !== CONF) return v;
      return { etat: RISQ, dossierDouteux: true,
        motif: `${v.motif} Ce constat ne dépend d'aucune des ${anomalies.length} donnée(s) impossible(s) que porte le dossier, mais il ne peut pas être tenu pour acquis tant qu'elles n'ont pas été corrigées : un dossier dont une partie des valeurs ne peut pas exister ne se lit pas par morceaux.` };
    });
  }
  return controles;
}

/* ------------------------------------------------------------ le silence

   Un contrôle qui se déclare « sans objet » ferme la question : il affirme que
   l'exigence ne s'applique pas. Or beaucoup se fermaient sur rien — « l'entreprise
   n'appartient à aucun groupe », « aucune élection en cours », « l'entreprise ne
   comporte pas plusieurs établissements distincts » — alors que la fiche ne
   disait rien du groupe, des élections ni des établissements. Sur un dossier
   entièrement vide, quarante-quatre contrôles des deux modules affirmaient ainsi
   des faits que personne n'avait déclarés.

   C'est la règle du dépôt appliquée à un état de plus : une donnée non
   renseignée ne produit jamais « conforme », et elle ne doit pas davantage
   produire « sans objet ». Le silence n'est pas une réponse — ni dans un sens,
   ni dans l'autre.

   La mesure est la même que pour la recevabilité : on observe l'exécution. Si le
   contrôle a conclu « sans objet » sans qu'aucun des champs qu'il a lus ne soit
   déclaré sur la fiche, sa conclusion ne repose sur rien et devient « donnée
   manquante ». S'il a lu ne serait-ce qu'un champ renseigné — un effectif de
   vingt, qui écarte une obligation due à cinquante — le « sans objet » tient. */
function surSilence(controles, exemptes) {
  const hors = new Set(exemptes || []);
  for (const ctl of controles) {
    if (hors.has(ctl.id)) continue;
    const brut = remplacer(ctl, function (f) {
      const lus = new Set();
      const p = new Proxy(f, {
        get(c, k) { if (typeof k === "string") lus.add(k); return c[k]; },
        has(c, k) { if (typeof k === "string") lus.add(k); return k in c; },
        getOwnPropertyDescriptor(c, k) {
          if (typeof k === "string") lus.add(k);
          return Reflect.getOwnPropertyDescriptor(c, k);
        },
      });
      const v = brut(p);
      if (!v || v.etat !== SO) return v;
      const declares = [...lus].filter(k =>
        Object.prototype.hasOwnProperty.call(f, k) && f[k] !== undefined);
      if (declares.length) return v;
      const attendus = [...lus].filter(k => !/^(then|constructor|toJSON|inspect|Symbol)/.test(k));
      return { etat: MANQ, surSilence: true,
        motif: `Ce contrôle s'écarterait de lui-même — « ${v.motif} » — mais aucune des données sur lesquelles il se fonde n'est renseignée${attendus.length ? " : " + attendus.join(", ") : ""}. Le silence n'est pas une réponse : renseignez-les, ou déclarez expressément qu'il n'y a rien à déclarer.` };
    });
  }
  return controles;
}

module.exports = { envelopper, surSilence, remplacer, racine };

});

__def("./grille-pse.js", function(module, exports, require){
/* La grille de jurisprudence du module.

   Vingt arrêts publiés de la chambre sociale, tous versés au dépôt dans
   pse_corpus.json avec leur sommaire intégral : rien n'est cité de mémoire, et
   chaque règle renvoie au numéro de pourvoi qui la porte. Le sommaire est
   reproduit dans le rapport, sous la règle, pour que le lecteur juge lui-même
   si la règle dit bien ce que l'arrêt dit.

   Une règle ne s'affiche que si sa condition est remplie par le dossier. Celles
   qui ne le sont pas ne disent rien — ni dans un sens ni dans l'autre — et leur
   nombre est publié : c'est la mesure honnête de ce que la grille n'a pas eu à
   dire.

   Ce que cette grille ne fait pas : elle ne tranche pas. Un arrêt de la chambre
   sociale ne lie pas l'autorité administrative, et le contentieux du contenu du
   plan relève du juge administratif depuis la loi du 14 juin 2013 — plusieurs
   des arrêts retenus le disent expressément. La grille signale ; elle ne
   conclut jamais à la conformité. */

const CORPUS = require("./pse_corpus.json");

const nb = x => (typeof x === "number" && isFinite(x) ? x : null);
const oui = x => x === true || x === "oui";
const mesures = f => Array.isArray((f.plan || {}).mesures) ? f.plan.mesures : [];
const planDu = f => {
  const e = nb(f.effectif), n = nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
  return e !== null && n !== null && e >= 50 && n >= 10;
};

const G = [];
const r = (id, sujet, si, dit, arrets) => G.push({ id, sujet, si, dit, arrets });

r("PSE-JUR-01", "Calibrage",
  f => planDu(f) && oui(f.groupe),
  "La pertinence du plan s'apprécie en fonction des moyens dont disposent l'entreprise et le groupe pour maintenir les emplois ou faciliter le reclassement. S'agissant des possibilités de reclassement dans le groupe, elle s'apprécie parmi les entreprises dont les activités, l'organisation ou le lieu d'exploitation permettent la permutation de tout ou partie du personnel.",
  ["15-15.190"]);

r("PSE-JUR-02", "Sanction",
  f => planDu(f),
  "La nullité de la procédure ne peut être prononcée qu'en cas d'absence ou d'insuffisance du plan — non pour un défaut tenant à la cause du licenciement. L'indemnité allouée à ce titre répare intégralement le préjudice résultant du caractère illicite du licenciement.",
  ["11-20.741", "16-11.563"]);

r("PSE-JUR-03", "Égalité de traitement",
  f => mesures(f).length > 1,
  "Un plan peut contenir des mesures réservées à certains salariés, à la condition que tous les salariés placés dans une situation identique au regard de l'avantage en cause puissent en bénéficier, à moins qu'une différence de traitement soit justifiée par des raisons objectives et pertinentes, et que les règles d'attribution soient préalablement définies et contrôlables.",
  ["14-16.009", "09-15.182"]);

r("PSE-JUR-04", "Seuils",
  f => oui(f.groupe) || nb(f.effectifEtablissement) !== null,
  "Les conditions d'effectif et de nombre qui imposent l'établissement d'un plan s'apprécient au niveau de l'entreprise que dirige l'employeur — non au niveau de l'unité économique et sociale ou du groupement d'intérêt économique.",
  ["07-45.481"]);

r("PSE-JUR-05", "Seuils",
  f => nb(f.effectif) !== null && f.effectif < 50 && mesures(f).length > 0,
  "Un plan mis en place volontairement par un employeur employant moins de cinquante salariés n'a pas à satisfaire aux exigences des articles L. 1233-61 et L. 1233-62. Les contrôles de contenu de ce module sont donc sans objet sur votre dossier — mais l'engagement pris, lui, oblige.",
  ["14-10.031"]);

r("PSE-JUR-06", "Priorité de réembauche",
  f => (f.plan || {}).dateRupture || f.dateNotification,
  "L'obligation d'informer le salarié de tout emploi devenu disponible et compatible avec sa qualification n'est pas limitée aux emplois pourvus par contrat à durée indéterminée : les contrats à durée déterminée sont concernés.",
  ["08-40.125"]);

r("PSE-JUR-07", "Priorité de réembauche",
  f => (f.plan || {}).dateRupture || f.dateNotification,
  "L'employeur qui établit qu'aucun emploi disponible en rapport avec les compétences des salariés n'existait — ni avant le prononcé des licenciements, ni ensuite dans le cadre de la priorité de réembauche, au besoin après une formation d'adaptation — échappe à la nullité du plan.",
  ["14-10.766"]);

r("PSE-JUR-08", "Contrat de sécurisation professionnelle",
  f => /sécurisation/i.test(String((f.plan || {}).accompagnement || "")),
  "La rupture résultant de l'acceptation d'un contrat de sécurisation professionnelle doit avoir une cause économique réelle et sérieuse. L'employeur doit énoncer cette cause dans un écrit remis ou adressé au salarié au cours de la procédure et au plus tard au moment de l'acceptation ; à défaut, la rupture est sans cause réelle et sérieuse.",
  ["18-24.531", "20-17.360"]);

r("PSE-JUR-09", "Congé de reclassement",
  f => /reclassement/i.test(String((f.plan || {}).accompagnement || "")),
  "Pendant la période du congé de reclassement qui dépasse la durée du préavis, le salarié ne peut prétendre au maintien des avantages en nature dont il bénéficiait durant le préavis, mais seulement au versement de l'indemnité prévue par le texte.",
  ["23-22.756"]);

r("PSE-JUR-10", "Séparation des pouvoirs",
  f => planDu(f),
  "Le contenu du plan et la régularité de la procédure ne peuvent faire l'objet d'un litige distinct de celui relatif à la décision de validation ou d'homologation : leur vérification relève de l'administration, sous le contrôle du juge administratif. Le juge judiciaire reste compétent pour l'obligation individuelle de reclassement, sans méconnaître l'autorité de la chose décidée par l'administration.",
  ["18-23.692", "23-18.987", "17-16.766", "18-26.229"]);

r("PSE-JUR-11", "Calendrier",
  f => planDu(f),
  "La réorganisation peut être mise en œuvre par l'employeur avant la date d'homologation du plan : le comité doit être saisi en temps utile du projet de restructuration, mais l'homologation ne conditionne pas la mise en œuvre de la réorganisation elle-même. La notification des licenciements, elle, reste subordonnée à la décision administrative.",
  ["20-15.370"]);

r("PSE-JUR-12", "Départs volontaires",
  f => mesures(f).some(m => /volontaire|départ|rupture amiable/i.test(String(m.intitule || "") + " " + String(m.detail || ""))),
  "Lorsque la rupture résulte d'un accord amiable conclu dans le cadre d'un plan assorti d'un plan de départs volontaires, et qu'une décision administrative l'a autorisée puis est devenue définitive, le juge judiciaire ne peut apprécier le caractère réel et sérieux du motif au regard de la cause économique ni le respect de l'obligation de reclassement.",
  ["23-15.533", "23-15.498"]);

r("PSE-JUR-13", "Catégories professionnelles",
  f => planDu(f),
  "La notion de catégorie professionnelle, qui sert de base à l'ordre des licenciements et que le plan doit désigner, concerne l'ensemble des salariés qui exercent dans l'entreprise des fonctions de même nature supposant une formation professionnelle commune.",
  ["95-16.648"]);

function retenues(f) {
  return G.filter(x => { try { return !!x.si(f); } catch (e) { return false; } });
}
function arret(num) { return CORPUS[num] || null; }

module.exports = { G, retenues, arret, CORPUS };

if (require.main === module) {
  const manquants = G.flatMap(x => x.arrets).filter(n => !CORPUS[n]);
  console.log(`${G.length} règles · ${Object.keys(CORPUS).length} arrêts au corpus`);
  if (manquants.length) { console.error("Arrêts cités mais absents du corpus : " + manquants.join(", ")); process.exit(1); }
  const cites = new Set(G.flatMap(x => x.arrets));
  const inutilises = Object.keys(CORPUS).filter(n => !cites.has(n));
  if (inutilises.length) console.log(`arrêts versés au corpus mais qu'aucune règle ne cite : ${inutilises.join(", ")}`);
  const { BASE } = require("./tests-pse.js");
  console.log(`sur le dossier de référence : ${retenues(BASE).length} règles retenues, ${G.length - retenues(BASE).length} sans objet`);
}

});

__def("./tests-pse.js", function(module, exports, require){
/* Les dossiers construits pour mettre les contrôles en défaut.

   La règle du dépôt : tout contrôle capable de constater une non-conformité
   doit la constater au moins une fois sur ces dossiers, sans quoi la
   publication échoue. Un contrôle qui n'a jamais dit « non » n'a jamais été
   éprouvé — il peut être écrit à l'envers sans que rien ne le révèle.

   S'y ajoutent deux épreuves de principe, qui valent pour tout le module :
   sur un dossier vide, aucun contrôle ne rend « conforme » ni « sans objet » ;
   et aucun contrôle de calibrage ne rend jamais « conforme », parce qu'aucun
   texte ne fixe le montant d'un plan.

   Usage : node tests-pse.js      */
const { C, ETATS, DETECTION } = require("./controles-pse.js");
const { CONF, NC, RISQ, MANQ, SO } = ETATS;

const BASE = {
  effectif: 320, effectifEtablissement: 320, groupe: true, effectifGroupe: 640,
  nbLicenciements: 22, total30j: 22,
  pieces: [{ type: "comptes-groupe", date: "2026-05-02" }],
  plan: {
    mesures: [
      { rubrique: "1°", intitule: "Reclassement interne", beneficiaires: 22, budget: 180000, duree: "6 mois" },
      { rubrique: "1° bis", intitule: "Reprise partielle d'activité", beneficiaires: 4, budget: 40000, duree: "12 mois" },
      { rubrique: "2°", intitule: "Création d'une activité de maintenance", beneficiaires: 6, budget: 120000, duree: "18 mois" },
      { rubrique: "3°", intitule: "Antenne emploi et bassin", beneficiaires: 22, budget: 90000, duree: "9 mois" },
      { rubrique: "4°", intitule: "Aide à la création d'entreprise", beneficiaires: 5, budget: 60000, duree: "12 mois" },
      { rubrique: "5°", intitule: "Formations de reconversion", beneficiaires: 18, budget: 240000, duree: "12 mois" },
      { rubrique: "6°", intitule: "Réduction des heures supplémentaires", beneficiaires: 40, budget: 0, duree: "permanent" },
    ],
    budgetTotal: 730000, resultatGroupe: 9200000,
    salariesExposes: ["3 salariés de plus de 55 ans", "2 sans qualification"],
    suivi: { modalites: "commission de suivi trimestrielle", consultation: "quatre réunions par an", bilan: "bilan annuel à la DREETS" },
    accompagnement: "contrat de sécurisation professionnelle",
    dateProposition: "2026-07-10", dateRupture: "2026-07-20",
    demandesReembauche: [], informationElusPostes: true,
  },
  pse: { voie: "unilateral", suffrages: null, dateDepotAdmin: "2026-06-01", dateDecisionAdmin: "2026-06-18",
         dateDesignationExpert: "2026-03-23" },
  datesReunionsCSE: ["2026-03-23", "2026-04-14"], dateAvisCSE: "2026-04-14",
  accordDelaisConsultation: false, expertisePSE: true,
  dateNotification: "2026-06-25",
};

const clone = o => JSON.parse(JSON.stringify(o));
function avec(mod) { const f = clone(BASE); mod(f); return f; }

const CAS = [
  { nom: "Aucune action de reclassement interne", attendu: ["PSE-CTL-CON-02"],
    f: avec(f => { f.plan.mesures = f.plan.mesures.filter(m => m.rubrique !== "1°"); }) },
  { nom: "Budget total en désaccord avec le détail", attendu: ["PSE-CTL-CHF-02"],
    f: avec(f => { f.plan.budgetTotal = 1200000; }) },
  { nom: "Congé de reclassement retenu en deçà de mille salariés", attendu: ["PSE-CTL-ACC-01"],
    f: avec(f => { f.plan.accompagnement = "congé de reclassement"; }) },
  { nom: "Congé de reclassement de dix-huit mois sans reconversion", attendu: ["PSE-CTL-ACC-02"],
    f: avec(f => { f.effectif = 1400; f.plan.accompagnement = "congé de reclassement";
                   f.plan.dureeConge = 18; f.plan.formationReconversion = false; }) },
  { nom: "Contrat de sécurisation proposé avant la décision administrative", attendu: ["PSE-CTL-ACC-03"],
    f: avec(f => { f.plan.dateProposition = "2026-06-02"; }) },
  { nom: "Accord signé à 38 % des suffrages", attendu: ["PSE-CTL-VOI-02"],
    f: avec(f => { f.pse.voie = "accord"; f.pse.suffrages = 38; }) },
  { nom: "Notification antérieure à la décision administrative", attendu: ["PSE-CTL-VOI-04"],
    f: avec(f => { f.dateNotification = "2026-06-10"; }) },
  { nom: "Suivi sans bilan à l'administration", attendu: ["PSE-CTL-SUI-01"],
    f: avec(f => { delete f.plan.suivi.bilan; }) },
  { nom: "Élus non informés des postes disponibles", attendu: ["PSE-CTL-REM-01"],
    f: avec(f => { f.plan.informationElusPostes = false; }) },
  { nom: "Mesure visant plus de bénéficiaires qu'il n'est licencié", attendu: ["PSE-CTL-COH-01"],
    f: avec(f => { f.plan.mesures[0].beneficiaires = 60; }) },
  { nom: "Une seule réunion du comité", attendu: ["PSE-CTL-CSE-01"],
    f: avec(f => { f.datesReunionsCSE = ["2026-03-23"]; }) },
  { nom: "Deux réunions espacées de six jours", attendu: ["PSE-CTL-CSE-01"],
    f: avec(f => { f.datesReunionsCSE = ["2026-03-23", "2026-03-29"]; f.dateAvisCSE = "2026-03-29"; }) },

  /* Les dossiers ci-dessous n'attendent pas de non-conformité : ils vérifient
     qu'un contrôle rend bien l'état intermédiaire prévu là où le texte ne
     tranche pas — un risque, jamais un feu vert et jamais un couperet. */
  { nom: "Avis rendu après le terme de deux mois", attendu: [], risque: ["PSE-CTL-CSE-02"],
    f: avec(f => { f.datesReunionsCSE = ["2026-03-23", "2026-04-14"]; f.dateAvisCSE = "2026-06-30"; }) },
  { nom: "Accord de méthode déclaré mais non versé", attendu: [], risque: ["PSE-CTL-CSE-02"],
    f: avec(f => { f.accordDelaisConsultation = true; }) },
  { nom: "Expert désigné après la première réunion", attendu: [], risque: ["PSE-CTL-CSE-03"],
    f: avec(f => { f.pse.dateDesignationExpert = "2026-04-10"; }) },
  { nom: "Comptes du groupe non versés", attendu: [], risque: ["PSE-CTL-CAL-03"],
    f: avec(f => { f.pieces = []; }) },
];

const tousLesDossiers = [BASE, ...CAS.map(c => c.f), {},
  /* deux dossiers de bord, qui n'attendent aucun verdict particulier mais font
     passer la grille de jurisprudence par ses branches restées froides */
  { effectif: 30, nbLicenciements: 12, total30j: 12, plan: { mesures: [{ rubrique: "1°", intitule: "aide au départ volontaire", beneficiaires: 3, budget: 30000, duree: "3 mois" }] } },
  { effectif: 2400, effectifEtablissement: 900, groupe: true, effectifGroupe: 2400, nbLicenciements: 260, total30j: 260,
    plan: { accompagnement: "congé de reclassement", dureeConge: 12, mesures: [
      { rubrique: "1°", intitule: "reclassement", beneficiaires: 200, budget: 900000, duree: "12 mois" },
      { rubrique: "4°", intitule: "plan de départs volontaires", beneficiaires: 60, budget: 600000, duree: "6 mois" }] },
    datesReunionsCSE: ["2026-02-02", "2026-03-02", "2026-04-06"] }];

function verdicts(f) {
  const o = {};
  for (const c of C) {
    try { o[c.id] = c.verdict(f); }
    catch (e) { o[c.id] = { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  }
  return o;
}

module.exports = { CAS, BASE, verdicts };

if (require.main === module) {
  let echecs = [];
  for (const cas of CAS) {
    const v = verdicts(cas.f);
    for (const id of cas.attendu)
      if (!v[id] || v[id].etat !== NC)
        echecs.push(`${cas.nom} : ${id} rend « ${v[id] ? v[id].etat : "rien"} » au lieu de « non conforme ».`);
    for (const id of cas.risque || [])
      if (!v[id] || v[id].etat !== RISQ)
        echecs.push(`${cas.nom} : ${id} rend « ${v[id] ? v[id].etat : "rien"} » au lieu de « risque à vérifier ».`);
  }

  /* Tout contrôle capable de dire non doit l'avoir dit au moins une fois. */
  const peutDireNon = C.filter(c => /etat: NC/.test(String(c.brut || c.verdict))).map(c => c.id);
  const ontDitNon = new Set(CAS.flatMap(c => c.attendu));
  const jamais = peutDireNon.filter(id => !ontDitNon.has(id));

  /* Le dossier vide : ni conforme, ni sans objet. */
  const vide = verdicts({});
  const surVide = Object.entries(vide).filter(([, v]) => v.etat === CONF || v.etat === SO)
    .map(([id, v]) => `${id} → ${v.etat}`);

  /* Le calibrage ne conclut jamais à la conformité, sur aucun dossier. */
  const calibrageConforme = [];
  for (const cas of [{ nom: "référence", f: BASE }, ...CAS]) {
    const v = verdicts(cas.f);
    for (const id of DETECTION) if (v[id] && v[id].etat === CONF) calibrageConforme.push(`${cas.nom} : ${id}`);
  }

  /* La grille de jurisprudence : aucune règle ne doit citer un arrêt absent du
     corpus, et chaque règle doit être atteinte par au moins un dossier — une
     règle qu'aucun dossier ne déclenche n'a jamais été exercée. */
  const GR = require("./grille-pse.js");
  const horsCorpus = GR.G.flatMap(x => x.arrets).filter(n => !GR.CORPUS[n]);
  const jamaisRetenues = GR.G.filter(x => !tousLesDossiers.some(f => { try { return !!x.si(f); } catch (e) { return false; } })).map(x => x.id);

  console.log(`${CAS.length} dossiers contradictoires · ${C.length} contrôles · ${GR.G.length} règles de jurisprudence`);
  console.log(`contrôles capables de constater une non-conformité : ${peutDireNon.length}, éprouvés ${ontDitNon.size}`);
  console.log(`sur un dossier vide : ${surVide.length} verdict(s) « conforme » ou « sans objet »`);
  console.log(`calibrage rendu « conforme » : ${calibrageConforme.length} fois`);
  echecs = echecs
    .concat(horsCorpus.map(n => `La grille cite l'arrêt ${n}, absent du corpus versé au dépôt.`))
    .concat(jamaisRetenues.map(id => `${id} : aucun dossier d'épreuve ne déclenche cette règle de jurisprudence.`))
    .concat(jamais.map(id => `${id} peut constater une non-conformité, mais aucun dossier ne le lui fait dire.`))
    .concat(surVide.map(x => `Sur un dossier vide, ${x} : le silence n'est pas une réponse.`))
    .concat(calibrageConforme.map(x => `${x} : un contrôle de calibrage ne peut pas conclure à la conformité.`));
  if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
  console.log("tout est vert");
}

});

__def("./regularisation-pse.js", function(module, exports, require){
/* Ce qu'il faut faire quand un contrôle du plan de sauvegarde de l'emploi ne
   passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   de calibrage, qui calculent un rapport et l'affichent sans rien constater, et
   ce null doit être écrit.

   UNE PARTICULARITÉ DE CE MODULE, ET IL FAUT LA DIRE D'EMBLÉE. Beaucoup
   d'irrégularités du plan ne se régularisent pas après coup : elles imposent de
   reprendre la procédure à un point donné. Le comité est consulté sur les
   mesures sociales d'accompagnement prévues par le plan (L. 1233-30, I, 2°) —
   une mesure ajoutée après la dernière réunion n'a donc pas été soumise à lui.
   L'administration vérifie la régularité de la procédure d'information et de
   consultation et le respect des articles L. 1233-61 à L. 1233-63
   (L. 1233-57-3) — ce qu'elle a sous les yeux est le dossier tel qu'il a été
   déposé. Et l'employeur ne peut procéder à la rupture des contrats, à peine de
   nullité, avant la décision (L. 1233-39). Là où c'est le cas, l'entrée le dit
   dans « quoiFaire » et fait commencer les étapes par le point de reprise.
   Aucune entrée n'écrit qu'une chose se rattrape lorsque le texte ne le permet
   pas.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé sur un article lu
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la saisine ou la décision
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-pse.json. Aucun montant de plan n'est indiqué nulle part ici :
   aucun texte n'en fixe, et l'appréciation appartient à l'administration puis au
   juge administratif (L. 1233-57-3). */

const { C } = require("./controles-pse.js");

/* Les quatre degrés, nommés une fois pour toutes. Le troisième est celui du
   module : dans un dossier de plan, l'irrégularité se paie devant
   l'administration avant de se payer devant le juge. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — la validation ou l'homologation peut être refusée ou annulée",
  4: "Régularisation rapide",
};

const R = {

  "PSE-CTL-CON-01": {
    gravite: 3,
    quoiFaire: "Rattacher une mesure à chaque rubrique de l'article L. 1233-62, ou porter au dossier le motif pour lequel une rubrique est écartée — et, si la dernière réunion du comité a déjà eu lieu, soumettre le plan complété à une nouvelle réunion avant de saisir l'administration.",
    risque: "L'administration vérifie le respect par le plan des articles L. 1233-61 à L. 1233-63 (L. 1233-57-3). La liste de L. 1233-62 n'est pas limitative — l'article énonce « des mesures telles que » — mais une rubrique laissée vide sans explication est un motif de refus ordinaire, et le refus renvoie tout le dossier au point de départ.",
    delai: "Une à deux semaines pour compléter le plan ; une réunion supplémentaire du comité si le plan a déjà été présenté en dernière réunion.",
    document: "Tableau des mesures du plan, rubrique par rubrique de l'article L. 1233-62",
    etapes: [
      "Reprendre les sept rubriques du texte et pointer celles qui ne portent aucune mesure : reclassement interne sur le territoire national (1°), reprise de tout ou partie des activités pour éviter la fermeture d'un établissement (1° bis), créations d'activités nouvelles par l'entreprise (2°), reclassement externe et soutien à la réactivation du bassin d'emploi (3°), soutien à la création ou à la reprise d'activités par les salariés (4°), formation, validation des acquis et reconversion (5°), réduction ou aménagement du temps de travail et des heures supplémentaires régulières (6°).",
      "Pour chaque rubrique vide, décider : soit une mesure y est rattachée, soit le motif de son écartement est écrit au dossier. Un silence n'est ni l'un ni l'autre.",
      "Si la dernière réunion du comité a déjà eu lieu, ne pas ajouter la mesure au dossier sans la lui soumettre : le comité est consulté sur les mesures sociales d'accompagnement prévues par le plan (L. 1233-30, I, 2°). Convoquer une réunion sur le plan complété.",
      "Ne saisir l'administration qu'une fois le plan complété et le comité consulté sur sa version définitive.",
    ],
    verifs: [
      { cle: "con01Rubriques", question: "Quelles rubriques de L. 1233-62 portent au moins une mesure, et lesquelles n'en portent aucune ?", attendu: "Le tableau rubrique par rubrique, avec la marque (1°, 1° bis, 2°, 3°, 4°, 5°, 6°)." },
      { cle: "con01Motifs", question: "Pour chaque rubrique écartée, où est écrit le motif de son écartement ?", attendu: "La pièce du dossier qui le porte, et sa page." },
      { cle: "con01DerniereReunion", question: "À quelle date le comité a-t-il été consulté sur la version du plan qui a été déposée ?", attendu: "La date de la réunion, et le procès-verbal portant sur cette version-là." },
    ],
  },

  "PSE-CTL-CON-02": {
    gravite: 3,
    quoiFaire: "Intégrer au plan un véritable plan de reclassement interne et y identifier nommément les catégories de salariés dont la réinsertion professionnelle est particulièrement difficile — puis, la dernière réunion du comité ayant déjà eu lieu le cas échéant, reprendre la consultation sur ce plan.",
    risque: "L'article L. 1233-61 fait du plan de reclassement le cœur du plan de sauvegarde de l'emploi : le plan « intègre un plan de reclassement visant à faciliter le reclassement sur le territoire national des salariés dont le licenciement ne pourrait être évité, notamment celui des salariés âgés ou présentant des caractéristiques sociales ou de qualification rendant leur réinsertion professionnelle particulièrement difficile ». L'administration vérifie le respect de cet article (L. 1233-57-3) : un plan sans reclassement interne n'est pas un plan incomplet, c'est un plan qui n'a pas son objet.",
    delai: "Trois à quatre semaines : le recensement des postes disponibles dans l'entreprise et, s'il y a lieu, dans le groupe, en est le préalable.",
    document: "Plan de reclassement interne — postes recensés, catégories visées, salariés à réinsertion difficile",
    etapes: [
      "Recenser les postes disponibles relevant de la même catégorie d'emplois ou équivalents à ceux qu'occupent les salariés concernés, et ceux de catégorie inférieure, ces derniers ne pouvant être proposés que sous réserve de l'accord exprès du salarié (L. 1233-62, 1°).",
      "Identifier les salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification — et écrire ce qui leur est spécifiquement proposé : l'article les vise nommément.",
      "Chiffrer chaque action de reclassement : nombre de postes, nombre de bénéficiaires attendus, durée de la période de recherche, budget.",
      "Soumettre le plan ainsi complété au comité social et économique, la consultation portant sur les mesures sociales d'accompagnement prévues par le plan (L. 1233-30, I, 2°).",
      "Ne déposer la demande de validation ou d'homologation qu'ensuite.",
    ],
    verifs: [
      { cle: "con02Postes", question: "Combien de postes de reclassement interne sont recensés, et à quelle date ce recensement a-t-il été arrêté ?", attendu: "La liste des postes et sa date d'arrêté." },
      { cle: "con02Exposes", question: "Quelles catégories de salariés à réinsertion particulièrement difficile sont identifiées, et où le sont-elles ?", attendu: "La partie du plan qui les nomme — âge, caractéristiques sociales, qualification." },
      { cle: "con02Consultation", question: "À quelle date le comité a-t-il été consulté sur le plan de reclassement dans sa version déposée ?", attendu: "La date de la réunion et le procès-verbal." },
    ],
  },

  "PSE-CTL-CON-03": {
    gravite: 4,
    quoiFaire: "Distinguer dans le plan les offres de reclassement situées sur le territoire national de celles qui ne le sont pas, et ne faire compter que les premières au titre de l'obligation.",
    risque: "Le plan de reclassement de l'article L. 1233-61 vise le reclassement sur le territoire national, et l'article L. 1233-62, 1° vise les actions de reclassement interne sur ce même territoire. Une offre située hors de France ne compte pas dans l'obligation : un plan qui l'y compte affiche un volume de reclassement qu'il n'a pas, et l'écart se voit dès l'instruction.",
    delai: "Quelques jours : c'est un travail de tri sur les mesures déjà écrites.",
    document: "Ventilation des offres de reclassement — territoire national et hors territoire national",
    etapes: [
      "Reprendre chaque mesure de reclassement et localiser les emplois qu'elle vise.",
      "Séparer les deux colonnes : ce qui est sur le territoire national, ce qui ne l'est pas. Rien n'interdit de proposer en sus des postes situés à l'étranger, mais ils s'ajoutent, ils ne remplacent pas.",
      "Recalculer le nombre de bénéficiaires et le budget de l'obligation sur la seule colonne nationale.",
      "Si le retrait des offres étrangères vide la rubrique du reclassement interne, le plan est à compléter avant toute saisine — le point est traité par le contrôle du plan de reclassement.",
    ],
    verifs: [
      { cle: "con03Localisation", question: "Pour chaque mesure de reclassement, où sont situés les emplois visés ?", attendu: "La localisation, mesure par mesure." },
      { cle: "con03NationalSeul", question: "Combien de postes de reclassement le plan offre-t-il sur le seul territoire national ?", attendu: "Le nombre, après retrait des postes situés hors de France." },
    ],
  },

  "PSE-CTL-CHF-01": {
    gravite: 3,
    quoiFaire: "Doter chaque mesure du plan d'un budget, d'un nombre de bénéficiaires et d'une durée, avant la saisine de l'administration.",
    risque: "L'administration apprécie les mesures d'accompagnement au regard de l'importance du projet de licenciement et des moyens dont disposent l'entreprise, l'unité économique et sociale et le groupe (L. 1233-57-3, 1° et 2°). Une mesure non chiffrée n'est pas appréciable : elle ne pèse rien dans cette appréciation, et le plan est jugé sur ce qui reste.",
    delai: "Une à deux semaines si les données de gestion existent ; davantage si les coûts unitaires sont à établir.",
    document: "Tableau de chiffrage des mesures — budget, bénéficiaires, durée",
    etapes: [
      "Lister les mesures dépourvues de l'un des trois éléments : budget, nombre de bénéficiaires, durée.",
      "Pour chacune, établir le coût unitaire et le nombre de bénéficiaires attendus, et en déduire le budget. Une enveloppe globale sans base de calcul n'est pas un chiffrage.",
      "Fixer la durée de chaque mesure : la période pendant laquelle elle est ouverte, et non la durée d'un entretien.",
      "Reporter les totaux dans le budget du plan et vérifier que la somme des mesures et le total annoncé coïncident.",
      "Si le plan a déjà été présenté en dernière réunion, soumettre la version chiffrée au comité avant de déposer.",
    ],
    verifs: [
      { cle: "chf01Complet", question: "Combien de mesures le plan compte-t-il, et combien portent à la fois un budget, un nombre de bénéficiaires et une durée ?", attendu: "Les deux nombres, et le tableau qui les porte." },
      { cle: "chf01Unitaire", question: "Sur quelle base unitaire chaque budget est-il calculé ?", attendu: "Le coût unitaire et le nombre de bénéficiaires, mesure par mesure." },
    ],
  },

  "PSE-CTL-CHF-02": {
    gravite: 3,
    quoiFaire: "Faire coïncider le budget total annoncé et la somme des mesures, en corrigeant celui des deux qui est faux, puis présenter la version corrigée au comité.",
    risque: "Un plan dont le total ne correspond pas au détail se retourne contre celui qui le produit : c'est la première vérification faite en séance, et l'écart nourrit la contestation du chiffrage tout entier devant l'administration, qui apprécie les mesures d'accompagnement au regard de l'importance du projet (L. 1233-57-3, 2°).",
    delai: "Quelques jours pour le rapprochement ; une réunion si le plan doit être représenté.",
    document: "Rapprochement du budget total et du détail des mesures",
    etapes: [
      "Poser côte à côte le total annoncé et la somme ligne à ligne des budgets de mesures, et isoler l'écart.",
      "Déterminer d'où vient l'écart : une mesure oubliée dans le détail, une mesure comptée deux fois, une provision non ventilée, ou un total arrêté avant la dernière version du plan.",
      "Corriger la source de l'écart — et non le total, si c'est le détail qui est faux : un total ajusté à la main sur un détail erroné se voit à la ligne suivante.",
      "Republier le tableau des mesures et le total dans une même pièce, et la soumettre au comité si le plan avait déjà été présenté.",
    ],
    verifs: [
      { cle: "chf02Total", question: "Quel est le budget total annoncé du plan, et quelle est la somme des budgets de mesures ?", attendu: "Les deux montants, et leur écart s'il en subsiste un." },
      { cle: "chf02Origine", question: "Si un écart existait, d'où venait-il et comment a-t-il été corrigé ?", attendu: "L'explication, et la pièce corrigée." },
    ],
  },

  /* Le coût par salarié est une mesure, pas un verdict : aucun texte ne fixe le
     montant d'un plan, et le contrôle le dit lui-même. Il n'y a donc rien à
     régulariser au titre de ce contrôle — ce qui se corrige, c'est le chiffrage
     des mesures et les pièces versées, traités pour eux-mêmes. */
  "PSE-CTL-CAL-01": null,

  /* Même raison : le rapport entre le budget du plan et les moyens du groupe est
     calculé et affiché, il n'est jugé par aucun seuil. L'acte qui se fait
     — verser les comptes du groupe — relève du contrôle suivant. */
  "PSE-CTL-CAL-02": null,

  "PSE-CTL-CAL-03": {
    gravite: 4,
    quoiFaire: "Verser au dossier les comptes consolidés du groupe, avant le dépôt de la demande de validation ou d'homologation.",
    risque: "L'article L. 1233-57-3 fait des moyens dont disposent l'entreprise, l'unité économique et sociale et le groupe le premier critère d'appréciation du plan. À défaut de comptes, l'administration apprécie ces moyens sur ce dont elle dispose : l'employeur perd la main sur ce qui est retenu contre lui, sans pouvoir le reprocher à personne.",
    delai: "Quelques jours si les comptes sont publiés ; deux à trois semaines s'ils doivent être obtenus de la société mère.",
    document: "Comptes consolidés du groupe versés au dossier de demande",
    etapes: [
      "Identifier le périmètre : entreprise, unité économique et sociale s'il en existe une, groupe — ce sont les trois niveaux que l'article énumère.",
      "Réunir les comptes consolidés du dernier exercice clos et, s'ils existent, les comptes intermédiaires plus récents.",
      "Les joindre à la demande adressée à l'administration, et les mettre à disposition du comité social et économique dans le cadre de sa consultation.",
      "Écrire, dans une note du dossier, le rapport entre le budget du plan et ces moyens : le calcul appartient à l'employeur, l'appréciation à l'administration.",
    ],
    verifs: [
      { cle: "cal03Comptes", question: "Quels comptes du groupe sont versés au dossier, et sur quel exercice portent-ils ?", attendu: "La pièce et l'exercice, avec la date de clôture." },
      { cle: "cal03Perimetre", question: "Le dossier identifie-t-il l'entreprise, l'unité économique et sociale et le groupe ?", attendu: "Les trois niveaux, ou la mention expresse qu'il n'en existe pas." },
    ],
  },

  "PSE-CTL-ACC-01": {
    gravite: 3,
    quoiFaire: "Substituer au dispositif retenu celui que l'effectif commande — congé de reclassement à partir de mille salariés (L. 1233-71), contrat de sécurisation professionnelle en deçà (L. 1233-66) — et soumettre le plan ainsi corrigé au comité.",
    risque: "L'administration s'assure que l'employeur a prévu le recours au contrat de sécurisation professionnelle mentionné à l'article L. 1233-65 ou la mise en place du congé de reclassement mentionné à l'article L. 1233-71 (L. 1233-57-3, dernier alinéa). Les deux dispositifs ne se cumulent pas et ne se choisissent pas : le mauvais dispositif dans le plan est un motif de refus, et il ne se corrige pas par une note en séance.",
    delai: "Deux à trois semaines : le dispositif change le coût du plan et son calendrier.",
    document: "Volet accompagnement individuel du plan — dispositif dû et modalités",
    etapes: [
      "Arrêter l'effectif au niveau où le seuil se lit : l'entreprise, l'établissement, et le groupe lorsque l'entreprise en relève.",
      "En déduire le dispositif dû, et le seul : congé de reclassement au-dessus de mille salariés, contrat de sécurisation professionnelle en deçà.",
      "Réécrire le volet accompagnement du plan sur ce dispositif — durée, financement, moment de la proposition — et en tirer les conséquences sur le budget.",
      "Soumettre le plan corrigé au comité social et économique avant toute saisine de l'administration : le dispositif d'accompagnement fait partie des mesures sociales sur lesquelles il est consulté (L. 1233-30, I, 2°).",
    ],
    verifs: [
      { cle: "acc01Effectif", question: "Quel est l'effectif de l'entreprise, celui de l'établissement et, s'il y a lieu, celui du groupe, et à quelle date sont-ils arrêtés ?", attendu: "Les trois nombres et leur date d'arrêté." },
      { cle: "acc01Dispositif", question: "Quel dispositif le plan prévoit-il, et dans quelle page ?", attendu: "Le dispositif nommé, et un seul des deux." },
    ],
  },

  "PSE-CTL-ACC-02": {
    gravite: 3,
    quoiFaire: "Ramener la durée du congé de reclassement dans la limite de l'article L. 1233-71 — douze mois, vingt-quatre en cas de formation de reconversion professionnelle — ou verser au dossier la formation de reconversion qui justifie la durée retenue.",
    risque: "L'article L. 1233-71 plafonne la durée du congé : « La durée du congé de reclassement ne peut excéder douze mois, pouvant être portés à vingt-quatre mois en cas de formation de reconversion professionnelle. » Une durée annoncée hors de cette limite, sans la formation qui la justifie, est une stipulation que le plan ne peut pas tenir, et l'administration vérifie le respect des articles L. 1233-61 à L. 1233-63 comme la mise en place du congé (L. 1233-57-3).",
    delai: "Une semaine si la formation de reconversion existe et n'est que non documentée ; trois à quatre semaines s'il faut réécrire le parcours de formation.",
    document: "Volet congé de reclassement — durée, bilan de compétences, actions de formation, financement",
    etapes: [
      "Vérifier si le plan prévoit une formation de reconversion professionnelle : c'est elle, et elle seule, qui porte le plafond de douze à vingt-quatre mois.",
      "Si elle existe, la décrire au dossier — nature, organisme, durée, coût — et rattacher la durée du congé à cette formation.",
      "Si elle n'existe pas, ramener la durée à douze mois au plus et recalculer le budget du volet.",
      "Écrire les modalités que le texte attache au congé : il débute si nécessaire par un bilan de compétences, l'employeur finance l'ensemble des actions (L. 1233-71) ; il est pris pendant le préavis, que le salarié est dispensé d'exécuter, et lorsqu'il excède le préavis, le terme de celui-ci est reporté jusqu'à la fin du congé (L. 1233-72).",
      "Soumettre la version corrigée au comité avant la saisine.",
    ],
    verifs: [
      { cle: "acc02Duree", question: "Quelle durée de congé de reclassement le plan retient-il ?", attendu: "La durée en mois, telle qu'elle est écrite au plan." },
      { cle: "acc02Reconversion", question: "Si la durée dépasse douze mois, quelle formation de reconversion professionnelle la justifie ?", attendu: "La formation décrite au dossier — nature, organisme, durée." },
      { cle: "acc02Preavis", question: "Le plan prévoit-il que le congé est pris pendant le préavis et que le terme de celui-ci est reporté lorsque le congé l'excède ?", attendu: "La clause du plan reprenant L. 1233-72." },
    ],
  },

  "PSE-CTL-ACC-03": {
    gravite: 2,
    quoiFaire: "Refaire la proposition du contrat de sécurisation professionnelle après la notification de la décision de validation ou d'homologation : une proposition faite avant cette notification, lorsqu'un plan est dû, n'est pas celle que le texte prévoit et ne se rétrodate pas.",
    risque: "À défaut de proposition, France Travail propose le contrat au salarié, et l'employeur verse à l'organisme de gestion du régime d'assurance chômage une contribution égale à deux mois de salaire brut, portée à trois mois lorsque l'ancien salarié adhère sur proposition de cette institution (L. 1233-66). La contribution est due par salarié, et elle se recouvre comme les contributions d'assurance chômage.",
    delai: "Immédiat après la notification de la décision : la proposition précède la notification du licenciement.",
    document: "Proposition de contrat de sécurisation professionnelle — remise contre décharge datée",
    etapes: [
      "Attendre la notification par l'autorité administrative de sa décision de validation ou d'homologation : lorsque le licenciement donne lieu à un plan dans les conditions des articles L. 1233-24-2 et L. 1233-24-4, la proposition est faite après cette notification (L. 1233-66).",
      "Remettre à chaque salarié dont le licenciement est envisagé le document de proposition, contre décharge datée — c'est la décharge qui prouvera la proposition, pas le courrier type.",
      "Tenir le tableau nominatif des propositions : salarié, date de remise, date de réponse.",
      "Ne notifier les licenciements qu'après la décision administrative, l'article L. 1233-39 le commandant par ailleurs.",
      "Conserver les décharges : c'est sur elles que se règle la question de la contribution due à l'assurance chômage.",
    ],
    verifs: [
      { cle: "acc03DateDecision", question: "À quelle date l'autorité administrative a-t-elle notifié sa décision de validation ou d'homologation ?", attendu: "La date exacte, et la décision elle-même." },
      { cle: "acc03DateProposition", question: "À quelle date le contrat de sécurisation professionnelle a-t-il été proposé à chaque salarié ?", attendu: "Le tableau des dates, toutes postérieures à celle de la décision." },
      { cle: "acc03Decharges", question: "Où sont les décharges datées de remise du document de proposition ?", attendu: "Les décharges signées, salarié par salarié." },
    ],
  },

  "PSE-CTL-VOI-01": {
    gravite: 3,
    quoiFaire: "Arrêter la voie — accord collectif majoritaire ou document unilatéral — avant la première réunion du comité, et écrire ce choix au dossier.",
    risque: "La voie commande tout le calendrier : quinze jours d'instruction pour la validation de l'accord, vingt et un pour l'homologation du document unilatéral (L. 1233-57-4). Elle commande aussi ce que l'administration contrôle et le moment où le document est élaboré, celui-ci l'étant après la dernière réunion du comité (L. 1233-24-4). Une voie non arrêtée est un calendrier non arrêté, et la procédure se déroule alors sans échéance connue.",
    delai: "Une décision, prise avant l'ouverture de la procédure ; l'information de l'administration sur l'ouverture d'une négociation est due sans délai.",
    document: "Note de choix de la voie et calendrier prévisionnel de la procédure",
    etapes: [
      "Apprécier si un accord majoritaire est atteignable : il doit être signé par une ou plusieurs organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité, quel que soit le nombre de votants, ou par le conseil d'entreprise (L. 1233-24-1).",
      "Si la voie de l'accord est retenue, informer l'administration sans délai de l'ouverture de la négociation, comme le dernier alinéa de L. 1233-24-1 l'impose.",
      "Si la voie du document unilatéral est retenue, retenir qu'il est élaboré après la dernière réunion du comité et qu'il fixe le contenu du plan en précisant les éléments des 1° à 5° de l'article L. 1233-24-2 (L. 1233-24-4).",
      "Écrire le calendrier qui en découle : dates des réunions du comité, date de dépôt de la demande, échéance d'instruction de quinze ou vingt et un jours.",
    ],
    verifs: [
      { cle: "voi01Voie", question: "Quelle voie a été retenue, et à quelle date la décision a-t-elle été prise ?", attendu: "La voie nommée et la date, antérieure à la première réunion du comité." },
      { cle: "voi01InfoAdmin", question: "Si la voie de l'accord a été retenue, à quelle date l'administration a-t-elle été informée de l'ouverture de la négociation ?", attendu: "La date de l'information, due sans délai (L. 1233-24-1)." },
      { cle: "voi01Calendrier", question: "Quelles sont les dates prévues de première réunion, de dernière réunion et de dépôt de la demande ?", attendu: "Les trois dates." },
    ],
  },

  "PSE-CTL-VOI-02": {
    gravite: 3,
    quoiFaire: "Constater que l'accord signé en deçà de 50 % des suffrages n'existe pas comme accord majoritaire — il ne se complète pas après coup — et choisir : recueillir la signature d'organisations portant le total à 50 %, ou basculer sur le document unilatéral et reprendre la procédure à ce point.",
    risque: "L'article L. 1233-24-1 subordonne l'accord à la signature d'organisations ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité. En deçà, il n'y a pas d'accord au sens du texte : la demande de validation est sans objet, et le dossier repart sur la voie de l'homologation, dont le délai d'instruction est de vingt et un jours et non de quinze (L. 1233-57-4).",
    delai: "Deux à quatre semaines : le temps de reprendre la négociation, ou d'élaborer le document unilatéral après la dernière réunion du comité.",
    document: "Relevé des suffrages du premier tour des dernières élections et acte de choix de la voie",
    etapes: [
      "Reprendre le procès-verbal du premier tour des dernières élections des titulaires au comité et calculer le total des suffrages recueillis par les organisations signataires, le nombre de votants étant indifférent.",
      "Si le total est en deçà de 50 %, ne pas déposer la demande de validation : elle porterait sur un accord qui n'en est pas un.",
      "Soit rouvrir la négociation pour recueillir la signature d'une organisation qui porte le total à 50 % ou plus, soit, à défaut, élaborer le document unilatéral prévu à l'article L. 1233-24-4, qui se fait après la dernière réunion du comité et précise les éléments des 1° à 5° de l'article L. 1233-24-2.",
      "Refaire le calendrier sur le délai d'instruction de la voie retenue : quinze jours pour la validation, vingt et un pour l'homologation.",
      "Déposer la demande correspondant à la voie effectivement retenue, et à elle seule.",
    ],
    verifs: [
      { cle: "voi02Suffrages", question: "Quel pourcentage de suffrages les organisations signataires ont-elles recueilli au premier tour des dernières élections des titulaires ?", attendu: "Le pourcentage, et le procès-verbal des élections qui l'établit." },
      { cle: "voi02Signataires", question: "Quelles organisations ont signé, et à quelle date ?", attendu: "La liste des signataires et la date de signature." },
      { cle: "voi02VoieFinale", question: "Quelle demande a finalement été déposée — validation ou homologation — et à quelle date ?", attendu: "La demande déposée et sa date, cohérente avec la voie retenue." },
    ],
  },

  "PSE-CTL-VOI-03": {
    gravite: 3,
    quoiFaire: "Établir la date de réception du dossier complet, en déduire l'échéance d'instruction, et, si le silence a couru jusqu'à son terme, accomplir les actes que l'article L. 1233-57-4 met alors à la charge de l'employeur — le silence vaut acceptation, il ne dispense de rien.",
    risque: "Le délai est de quinze jours pour la validation à compter de la réception de l'accord, de vingt et un jours pour l'homologation à compter de la réception du document complet (L. 1233-57-4). Le silence gardé pendant ce délai vaut décision d'acceptation ; l'employeur transmet alors au comité — et, si la demande portait sur un accord, aux organisations syndicales représentatives signataires — une copie de la demande accompagnée de son accusé de réception. La décision, ou à défaut ces documents, ainsi que les voies et délais de recours, sont portés à la connaissance des salariés par affichage sur les lieux de travail ou par tout autre moyen conférant date certaine. Rien de tout cela ne se présume : ce sont ces actes qui font courir les recours.",
    delai: "Quinze ou vingt et un jours d'instruction selon la voie ; les actes qui suivent l'échéance se font dans les jours qui la suivent.",
    document: "Transmission au comité de la demande et de son accusé de réception, et affichage aux salariés",
    etapes: [
      "Retrouver l'accusé de réception du dossier : c'est la réception de la demande — de l'accord, ou du document complet — qui fait courir le délai, et non la date d'envoi.",
      "Calculer l'échéance : quinze jours pour la validation, vingt et un pour l'homologation.",
      "Si une décision a été notifiée, vérifier qu'elle l'a été dans ce délai, qu'elle est motivée, et qu'elle a été notifiée dans les mêmes délais au comité et, s'il y a lieu, aux organisations syndicales signataires.",
      "Si le délai s'est écoulé sans décision, transmettre au comité — et aux organisations signataires si la demande portait sur un accord — une copie de la demande accompagnée de son accusé de réception par l'administration.",
      "Porter à la connaissance des salariés la décision ou, à défaut, ces documents, ainsi que les voies et délais de recours, par affichage sur les lieux de travail ou par tout moyen conférant date certaine — et conserver la preuve de cette date.",
    ],
    verifs: [
      { cle: "voi03Reception", question: "À quelle date l'administration a-t-elle accusé réception du dossier complet ?", attendu: "L'accusé de réception et sa date." },
      { cle: "voi03Echeance", question: "Quelle est l'échéance du délai d'instruction, et de quinze ou de vingt et un jours s'agit-il ?", attendu: "La date d'échéance et le délai applicable à la voie retenue." },
      { cle: "voi03Decision", question: "Une décision a-t-elle été notifiée, à quelle date, et est-elle motivée ?", attendu: "La décision datée et motivée, ou la mention que le délai s'est écoulé sans décision." },
      { cle: "voi03Affichage", question: "À quelle date la décision — ou, à défaut, la demande et son accusé de réception — a-t-elle été portée à la connaissance des salariés, et par quel moyen ?", attendu: "La date certaine et le moyen employé, avec sa preuve." },
    ],
  },

  "PSE-CTL-VOI-04": {
    gravite: 3,
    quoiFaire: "Ne pas notifier, et suspendre toute notification déjà programmée, jusqu'à la notification de la décision administrative ou l'expiration du délai d'instruction — une lettre de licenciement déjà envoyée avant cette date ne se régularise pas : le texte frappe la rupture de nullité.",
    risque: "Dans les entreprises de cinquante salariés ou plus, lorsque le projet concerne dix salariés ou plus dans une même période de trente jours, l'employeur notifie le licenciement après la notification par l'autorité administrative de la décision de validation ou d'homologation, ou à l'expiration des délais prévus à l'article L. 1233-57-4. « Il ne peut procéder, à peine de nullité, à la rupture des contrats de travail avant la notification de cette décision d'homologation ou de validation ou l'expiration des délais » (L. 1233-39). La nullité n'est pas une irrégularité que l'on couvre : elle atteint la rupture elle-même.",
    delai: "Immédiat : c'est l'envoi qu'il faut arrêter, avant qu'il ne parte.",
    document: "Note de suspension des notifications et calendrier de notification postérieur à la décision",
    etapes: [
      "Arrêter sur-le-champ toute notification programmée et retirer les lettres du circuit d'envoi : le point de départ est la décision administrative, pas la fin de la consultation.",
      "Pour les lettres déjà expédiées avant la décision, ne pas tenter de les régulariser par un courrier rectificatif : constater la situation, ne pas exécuter la rupture, et arrêter avec le conseil de l'entreprise la conduite à tenir salarié par salarié.",
      "Attendre la notification de la décision de validation ou d'homologation, ou l'expiration des délais de l'article L. 1233-57-4.",
      "Ne notifier qu'ensuite, par lettre recommandée avec avis de réception, en respectant l'ordre : décision d'abord, proposition d'accompagnement individuel ensuite lorsqu'elle est due après la décision, notification enfin.",
      "Conserver, pour chaque salarié, la date de la décision et la date d'envoi de la lettre : c'est la comparaison de ces deux dates qui sera faite.",
    ],
    verifs: [
      { cle: "voi04DateDecision", question: "À quelle date la décision de validation ou d'homologation a-t-elle été notifiée à l'employeur, ou à quelle date le délai d'instruction a-t-il expiré ?", attendu: "La date, avec la décision ou l'accusé de réception de la demande." },
      { cle: "voi04DateEnvoi", question: "À quelle date la première lettre de notification de licenciement a-t-elle été expédiée ?", attendu: "La date d'expédition, avec la preuve de dépôt." },
      { cle: "voi04Aucune", question: "Aucune rupture n'a-t-elle été exécutée avant la date de la décision ou l'expiration des délais ?", attendu: "Le tableau des notifications, dates à l'appui." },
    ],
  },

  "PSE-CTL-SUI-01": {
    gravite: 3,
    quoiFaire: "Compléter le plan sur les trois obligations de l'article L. 1233-63 — modalités de suivi, consultation du comité, bilan à l'administration — avant la saisine, le suivi faisant partie de ce que l'administration contrôle.",
    risque: "L'article L. 1233-63 met trois obligations distinctes à la charge de l'employeur : le plan détermine les modalités de suivi de la mise en œuvre effective des mesures du plan de reclassement ; ce suivi fait l'objet d'une consultation régulière et détaillée du comité, dont l'avis est transmis à l'autorité administrative ; l'autorité administrative est associée au suivi et reçoit un bilan, établi par l'employeur, de la mise en œuvre effective du plan. L'administration vérifie le respect des articles L. 1233-61 à L. 1233-63 (L. 1233-57-3) : un plan muet sur son suivi est incomplet au regard du texte.",
    delai: "Une semaine : il s'agit d'écrire une clause et un calendrier, non de créer un dispositif.",
    document: "Clause de suivi du plan — commission, périodicité, avis du comité, bilan à l'administration",
    etapes: [
      "Écrire dans le plan les modalités de suivi de la mise en œuvre effective des mesures du plan de reclassement : qui suit, sur quels indicateurs, à quelle fréquence.",
      "Fixer le calendrier des consultations du comité sur ce suivi — le texte les veut régulières et détaillées — et prévoir la transmission de son avis à l'autorité administrative.",
      "Prévoir le bilan de la mise en œuvre effective du plan que l'employeur établit et que l'administration reçoit, et arrêter la date à laquelle il sera transmis.",
      "Soumettre la clause de suivi au comité avec le reste du plan, puis la verser au dossier de demande.",
    ],
    verifs: [
      { cle: "sui01Modalites", question: "Quelle clause du plan détermine les modalités de suivi, et que prévoit-elle ?", attendu: "La clause, avec les indicateurs et la périodicité." },
      { cle: "sui01Consultation", question: "À quelles dates le comité est-il consulté sur le suivi, et comment son avis est-il transmis à l'administration ?", attendu: "Le calendrier des consultations et le mode de transmission de l'avis." },
      { cle: "sui01Bilan", question: "À quelle date le bilan de la mise en œuvre effective du plan sera-t-il transmis à l'autorité administrative ?", attendu: "La date prévue, et l'auteur du bilan." },
    ],
  },

  "PSE-CTL-REM-01": {
    gravite: 4,
    quoiFaire: "Informer les représentants du personnel des postes disponibles et tenir le registre des demandes de priorité de réembauche — étant entendu qu'un poste déjà pourvu sans avoir été proposé au salarié qui avait demandé le bénéfice de la priorité ne se rattrape pas.",
    risque: "L'article L. 1233-45 met deux obligations distinctes à la charge de l'employeur : informer le salarié qui a demandé le bénéfice de la priorité de tout emploi devenu disponible et compatible avec sa qualification, et informer les représentants du personnel des postes disponibles. La seconde ne dépend d'aucune demande d'un salarié : elle est due par elle-même. La priorité court un an à compter de la rupture, et le salarié qui a acquis une nouvelle qualification en bénéficie aussi au titre de celle-ci s'il en informe l'employeur.",
    delai: "Immédiat pour l'information des élus ; le registre se tient ensuite au fil des postes, pendant l'année qui suit chaque rupture.",
    document: "Registre des demandes de priorité de réembauche et information périodique des représentants du personnel",
    etapes: [
      "Recenser les salariés licenciés dont la rupture remonte à moins d'un an, et parmi eux ceux qui ont demandé le bénéfice de la priorité au cours de ce délai.",
      "Ouvrir le registre : nom, date de rupture, date de la demande, qualification, et nouvelle qualification acquise si le salarié l'a signalée.",
      "Informer sans attendre les représentants du personnel des postes actuellement disponibles, et fixer la périodicité à laquelle cette information leur sera faite ensuite.",
      "Pour chaque poste devenu disponible, vérifier sa compatibilité avec la qualification des salariés inscrits au registre et informer ceux qui sont concernés, par écrit et de manière datée.",
      "Pour les postes déjà pourvus sans que cette information ait été faite, ne rien antidater : consigner la situation telle qu'elle est et arrêter la conduite à tenir avec le conseil de l'entreprise.",
    ],
    verifs: [
      { cle: "rem01Registre", question: "Combien de demandes de priorité de réembauche ont été reçues, et à quelles dates ?", attendu: "Le registre, avec les dates de rupture et les dates de demande." },
      { cle: "rem01Elus", question: "À quelle date les représentants du personnel ont-ils été informés des postes disponibles pour la dernière fois, et selon quelle périodicité le sont-ils ?", attendu: "La date et la périodicité, avec la pièce transmise." },
      { cle: "rem01Postes", question: "Quels postes sont devenus disponibles depuis la première rupture, et lesquels ont été proposés aux salariés inscrits au registre ?", attendu: "La liste des postes et, pour chacun, la proposition datée ou le motif d'incompatibilité." },
    ],
  },

  "PSE-CTL-CSE-01": {
    gravite: 3,
    quoiFaire: "Reprendre la consultation au point où l'exigence n'a pas été tenue : tenir la seconde réunion, ou la réunion qui rétablit l'espacement d'au moins quinze jours — un espacement trop court ne se corrige pas sur le procès-verbal, il se corrige en tenant la réunion.",
    risque: "L'article L. 1233-30, I impose que le comité tienne au moins deux réunions espacées d'au moins quinze jours. L'administration vérifie la régularité de la procédure d'information et de consultation du comité (L. 1233-57-3) : une consultation qui n'a pas respecté ce rythme est irrégulière, et la décision qui l'homologue ou la valide encourt l'annulation. C'est l'irrégularité la plus visible du dossier, parce qu'elle se lit sur deux dates.",
    delai: "Au moins quinze jours : c'est l'espacement lui-même qu'il faut laisser courir.",
    document: "Convocation à la réunion de reprise et procès-verbaux des réunions du comité",
    etapes: [
      "Poser les dates des réunions déjà tenues et mesurer l'écart entre chacune : c'est l'écart qui est en cause, pas le nombre de points à l'ordre du jour.",
      "Si une seule réunion s'est tenue, convoquer la seconde — celle où l'avis se rend — en respectant l'espacement d'au moins quinze jours depuis la première.",
      "Si deux réunions ont été tenues à moins de quinze jours d'intervalle, tenir une nouvelle réunion à plus de quinze jours de la précédente et y reprendre la consultation sur les points concernés : la première réunion trop rapprochée ne se déplace pas.",
      "Mettre à l'étude les suggestions relatives aux mesures sociales envisagées et les propositions alternatives formulées par le comité, et y donner une réponse motivée (L. 1233-33) : c'est ce qui donne son objet à l'espacement.",
      "Ne saisir l'administration qu'une fois ce rythme rétabli, et joindre les procès-verbaux datés.",
    ],
    verifs: [
      { cle: "cse01Dates", question: "À quelles dates exactes les réunions du comité sur le projet se sont-elles tenues ?", attendu: "La liste des dates, dans l'ordre." },
      { cle: "cse01Ecarts", question: "Quel est l'écart en jours entre chaque réunion et la précédente ?", attendu: "Les écarts, tous d'au moins quinze jours." },
      { cle: "cse01Reponses", question: "Quelles suggestions et propositions alternatives le comité a-t-il formulées, et où sont les réponses motivées ?", attendu: "Les propositions et les réponses écrites, datées (L. 1233-33)." },
    ],
  },

  "PSE-CTL-CSE-02": {
    gravite: 3,
    quoiFaire: "Arrêter la date d'expiration du délai d'avis à partir de la date de la première réunion, et verser au dossier l'accord qui fixe des délais différents lorsqu'il en existe un — à défaut, c'est le plafond légal qui s'applique.",
    risque: "Le comité rend ses deux avis dans un délai qui ne peut excéder, à compter de la date de sa première réunion, deux mois lorsque le nombre de licenciements est inférieur à cent, trois mois lorsqu'il est au moins égal à cent et inférieur à deux cent cinquante, quatre mois lorsqu'il est au moins égal à deux cent cinquante ; une convention ou un accord collectif peut prévoir des délais différents, et à défaut d'avis dans le délai le comité est réputé avoir été consulté (L. 1233-30, II). Un accord invoqué mais non versé n'est opposable à personne : ni l'administration ni l'application ne peuvent vérifier le délai que l'employeur applique.",
    delai: "Quelques jours pour verser l'accord et poser le calendrier ; le délai d'avis lui-même court de la première réunion.",
    document: "Calendrier de consultation — première réunion, délai applicable, date d'expiration",
    etapes: [
      "Fixer la date de la première réunion au cours de laquelle le comité est consulté sur l'opération projetée et sur le projet de licenciement collectif : c'est d'elle que court le délai.",
      "Déterminer le délai applicable au nombre de licenciements envisagés — deux, trois ou quatre mois selon les tranches de L. 1233-30, II.",
      "Si un accord ou une convention fixe des délais différents, le verser au dossier et y renvoyer expressément ; sans cette pièce, le plafond légal reste la seule référence.",
      "Écrire la date d'expiration du délai et la porter au calendrier remis au comité.",
      "Recueillir les deux avis avant ce terme ; à défaut, constater que le comité est réputé consulté, ce qui ne dispense pas d'avoir tenu les réunions ni d'avoir répondu à ses propositions.",
    ],
    verifs: [
      { cle: "cse02Premiere", question: "À quelle date exacte s'est tenue la première réunion au cours de laquelle le comité a été consulté sur l'opération et sur le projet de licenciement ?", attendu: "La date, avec la convocation et le procès-verbal." },
      { cle: "cse02Delai", question: "Quel délai d'avis s'applique, et pourquoi — nombre de licenciements envisagés, ou accord fixant un délai différent ?", attendu: "Le délai en mois et sa source ; si c'est un accord, l'accord versé au dossier." },
      { cle: "cse02Avis", question: "À quelles dates les deux avis du comité ont-ils été rendus ?", attendu: "Les dates des avis, ou le constat daté qu'ils n'ont pas été rendus dans le délai." },
    ],
  },

  "PSE-CTL-CSE-03": {
    gravite: 3,
    quoiFaire: "Verser au dossier la délibération du comité désignant l'expert avec sa date, et tenir les délais d'échange que l'article L. 1233-35 impose — une désignation postérieure à la première réunion ne se rétrodate pas, et le délai d'avis n'en est pas prolongé.",
    risque: "L'article L. 1233-34 place la décision de recourir à l'expertise à la première réunion prévue à l'article L. 1233-30. Une désignation postérieure expose la procédure à la contestation devant l'administration, qui vérifie la régularité de l'information et de la consultation du comité (L. 1233-57-3), sans que le délai d'avis en soit allongé pour autant : le calendrier reste celui de L. 1233-30, II. Le rapport de l'expert est remis au comité — et, le cas échéant, aux organisations syndicales — au plus tard quinze jours avant l'expiration de ce délai.",
    delai: "Dix jours pour la demande d'informations de l'expert, huit jours pour la réponse de l'employeur ; le rapport est dû quinze jours avant l'expiration du délai d'avis.",
    document: "Délibération de désignation de l'expert et journal des échanges d'informations",
    etapes: [
      "Verser au dossier la délibération du comité et sa date, ainsi que le procès-verbal de la réunion au cours de laquelle elle a été prise : la date est ce qu'elle est, et elle sera lue.",
      "Répondre dans les huit jours à la demande d'informations que l'expert adresse dans les dix jours de sa désignation, puis dans les huit jours à toute demande complémentaire formulée dans les dix jours (L. 1233-35).",
      "Tenir le journal daté de ces échanges : demande, date, réponse, date — c'est lui qui établira que les délais ont été tenus.",
      "Arrêter la date à laquelle le rapport doit être remis : au plus tard quinze jours avant l'expiration du délai de l'article L. 1233-30, et la porter au calendrier.",
      "Ne pas différer la saisine de l'administration au motif de l'expertise : le délai d'avis n'est pas prolongé par elle.",
    ],
    verifs: [
      { cle: "cse03Designation", question: "À quelle date le comité a-t-il décidé de recourir à l'expertise, et à quelle réunion ?", attendu: "La date de la délibération et le procès-verbal de la réunion correspondante." },
      { cle: "cse03Echanges", question: "À quelles dates l'expert a-t-il demandé des informations et à quelles dates l'employeur a-t-il répondu ?", attendu: "Le journal daté des demandes et des réponses — dix jours pour demander, huit pour répondre." },
      { cle: "cse03Rapport", question: "À quelle date le rapport de l'expert a-t-il été remis au comité, et le cas échéant aux organisations syndicales ?", attendu: "La date de remise, au plus tard quinze jours avant l'expiration du délai d'avis." },
    ],
  },

  "PSE-CTL-COH-01": {
    gravite: 3,
    quoiFaire: "Reprendre le décompte des licenciements envisagés et le nombre de bénéficiaires des mesures individuelles jusqu'à ce que les deux soient cohérents, puis corriger celle des deux pièces qui est fausse.",
    risque: "Le reclassement interne (L. 1233-62, 1°), le soutien à la création ou à la reprise d'activités par les salariés (4°) et la formation ou la reconversion (5°) s'adressent aux salariés dont le licenciement est envisagé. Une mesure individuelle qui vise plus de bénéficiaires qu'il n'y a de licenciements signale que l'un des deux chiffres est faux — et les deux emportent des conséquences : le nombre de licenciements commande le délai d'avis du comité (L. 1233-30, II), et le chiffrage commande l'appréciation des mesures d'accompagnement au regard de l'importance du projet (L. 1233-57-3, 2°).",
    delai: "Une semaine : c'est un rapprochement de deux décomptes, mais il peut déplacer le calendrier.",
    document: "Rapprochement du décompte des licenciements et des bénéficiaires des mesures individuelles",
    etapes: [
      "Reprendre le décompte des licenciements envisagés sur une même période de trente jours, en y intégrant, s'il y a lieu, les refus de modification d'un élément essentiel du contrat proposée pour un motif économique (L. 1233-25) et la règle des licenciements successifs de l'article L. 1233-26.",
      "Reprendre le nombre de bénéficiaires de chaque mesure relevant des rubriques 1°, 4° et 5°, qui visent les salariés dont le licenciement est envisagé.",
      "Corriger le chiffre qui est faux — et non celui qui est le plus commode : si c'est le décompte des licenciements, tout le calendrier de consultation s'en trouve déplacé et doit être refait.",
      "Vérifier ensuite que les mesures collectives — reprise d'activité, création d'activités nouvelles, bassin d'emploi, temps de travail — restent identifiées comme telles : elles peuvent légitimement viser au-delà du nombre de licenciements.",
      "Reporter les corrections dans le tableau des mesures, dans le budget total et dans le calendrier, puis présenter la version corrigée au comité si elle intervient après une réunion.",
    ],
    verifs: [
      { cle: "coh01Licenciements", question: "Combien de licenciements sont envisagés sur une même période de trente jours, et sur quelle période exactement ?", attendu: "Le nombre et les deux dates qui bornent la période." },
      { cle: "coh01Beneficiaires", question: "Pour chaque mesure des rubriques 1°, 4° et 5°, combien de bénéficiaires sont annoncés ?", attendu: "Le nombre, mesure par mesure, aucun n'excédant le nombre de licenciements." },
      { cle: "coh01Calendrier", question: "Si le décompte des licenciements a changé, le délai d'avis du comité et le calendrier ont-ils été refaits ?", attendu: "Le calendrier corrigé, avec la nouvelle date d'expiration du délai." },
    ],
  },
};

/* La règle du dépôt : l'oubli se voit. Tout contrôle doit avoir une entrée,
   fût-elle null, et toute entrée doit correspondre à un contrôle. */
const ECARTS = [];
for (const c of C)
  if (!Object.prototype.hasOwnProperty.call(R, c.id))
    ECARTS.push(`le contrôle ${c.id} n'a pas d'entrée de régularisation (fût-ce à null)`);
for (const id of Object.keys(R))
  if (!C.some(c => c.id === id))
    ECARTS.push(`l'entrée de régularisation ${id} ne correspond à aucun contrôle`);
const CLES = new Map();
for (const [id, r] of Object.entries(R)) {
  if (r === null) continue;
  for (const champ of ["gravite", "quoiFaire", "risque", "delai", "etapes", "verifs"])
    if (r[champ] === undefined || r[champ] === null || r[champ] === "")
      ECARTS.push(`${id} : le champ « ${champ} » manque`);
  if (!GRAVITES[r.gravite]) ECARTS.push(`${id} : gravité « ${r.gravite} » inconnue`);
  if (Array.isArray(r.etapes) && r.etapes.length < 2)
    ECARTS.push(`${id} : une procédure d'une seule étape n'accompagne personne`);
  if (Array.isArray(r.verifs))
    for (const v of r.verifs) {
      if (!v.cle || !v.question || !v.attendu)
        ECARTS.push(`${id} : une vérification est incomplète (clé, question, attendu)`);
      /* Une clé qui sert deux fois écrase la réponse de l'autre : la page range
         les réponses par clé, et rien ne l'avertirait. */
      else if (CLES.has(v.cle))
        ECARTS.push(`${id} : la clé « ${v.cle} » sert déjà dans ${CLES.get(v.cle)}`);
      else CLES.set(v.cle, id);
    }
}

module.exports = { R, GRAVITES, ECARTS };

if (require.main === module) {
  const aRegulariser = Object.values(R).filter(x => x !== null).length;
  const verifs = Object.values(R).filter(x => x).reduce((n, x) => n + x.verifs.length, 0);
  console.log(`${C.length} contrôle(s) · ${aRegulariser} régularisation(s) · ${verifs} vérification(s)`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("chaque contrôle a son issue, et chaque issue son contrôle");
}

});

__def("./parcours-deux-temps.js", function(module, exports, require){
/* Le parcours du client, en deux temps.

   L'audit dit où en est l'entreprise. Ce module dit ce qu'elle en fait, et
   dans quel ordre. L'ordre n'est pas un détail de présentation : il a été
   arrêté explicitement, et il commande la logique.

   PREMIER TEMPS — ce qu'elle n'a pas fait.
   On liste les manquements, du plus grave au moins grave ; pour chacun on
   donne l'acte à accomplir, le modèle et la procédure ; puis on vérifie la
   correction. Le temps se termine quand tout ce qui manquait est validé.

   SECOND TEMPS — ce qu'elle dit avoir fait.
   Et seulement alors. Les contrôles que l'audit a rendus « conformes » ne le
   sont que sur la parole du client : ils sont ici marqués « déclaré », repris
   un par un avec la grille du texte, et validés — ou refusés, auquel cas ils
   retournent au premier temps comme manquements.

   La règle qui tient tout : UN « OUI » N'EST PAS UNE PREUVE. Rien ne passe de
   « déclaré » à « en règle » sans être passé par le second temps. C'est
   pourquoi ce module renomme l'état « conforme » plutôt que de le recopier :
   le mot « conforme » ne doit pas apparaître avant sa vérification. */

const DECLARE = "déclaré — à vérifier";
const REGLE = "en règle — vérifié";

/* Les quatre degrés de gravité, dans l'ordre où le guide les présente. Ils
   sont communs à tous les modules : un délit d'entrave se traite avant une
   contravention, quel que soit le module qui l'a constaté. */
const DEGRES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

/* Ce qu'un état de contrôle devient dans le parcours.
   « conforme » ne devient jamais « en règle » ici : il devient « déclaré ». */
function etatParcours(etat) {
  if (etat === "conforme") return DECLARE;
  return etat;
}

/* Le premier temps : ce qui manque.

   Sont retenus les contrôles « non conforme » — le texte n'est pas respecté —
   et « risque à vérifier » — l'application ne tranche pas, mais quelque chose
   est à faire. Les « donnée manquante » ne sont pas des manquements : ce sont
   des questions sans réponse, et elles retournent au questionnaire. */
function premierTemps(C, R, verdicts, faits) {
  const points = [];
  for (const c of C) {
    const v = verdicts[c.id];
    if (!v) continue;
    if (v.etat !== "non conforme" && v.etat !== "risque à vérifier") continue;
    const r = R[c.id];
    if (!r) continue;                       /* rien à régulariser : mesuré ailleurs */
    points.push({
      id: c.id,
      rubrique: c.rubrique,
      objet: c.objet,
      fondement: c.fondement || [],
      etat: v.etat,
      constat: v.motif,
      gravite: r.gravite,
      degre: DEGRES[r.gravite],
      quoiFaire: r.quoiFaire,
      risque: r.risque,
      delai: r.delai,
      document: r.document || null,
      etapes: r.etapes,
      verifs: r.verifs,
      fait: !!(faits || {})[c.id],
    });
  }
  points.sort((a, b) => a.gravite - b.gravite || a.id.localeCompare(b.id));
  return points;
}

/* Le second temps : ce que le client dit avoir.

   Un contrôle « conforme » l'est parce que le client a déclaré la pièce, la
   date ou l'acte. Le second temps le reprend et demande de le montrer. Un
   contrôle sans grille de vérification ne peut pas être vérifié : il reste
   « déclaré », et le dit — plutôt que de passer pour vérifié. */
function secondTemps(C, R, verdicts, controles) {
  const points = [];
  for (const c of C) {
    const v = verdicts[c.id];
    if (!v || v.etat !== "conforme") continue;
    const r = R[c.id];
    const grille = (r && r.verifs) || [];
    const rep = (controles || {})[c.id] || {};
    points.push({
      id: c.id,
      rubrique: c.rubrique,
      objet: c.objet,
      fondement: c.fondement || [],
      etat: DECLARE,
      declare: v.motif,
      gravite: r ? r.gravite : 4,
      degre: r ? DEGRES[r.gravite] : DEGRES[4],
      verifs: grille,
      verifiable: grille.length > 0,
      reponses: rep,
    });
  }
  points.sort((a, b) => a.gravite - b.gravite || a.id.localeCompare(b.id));
  return points;
}

/* Le verdict du second temps, point par point.

   Trois issues, et une seule règle : cocher n'est pas prouver. Une grille
   dont une réponse manque ne se conclut pas ; une grille dont une réponse est
   « non » est refusée et le point retourne au premier temps. */
function verdictVerification(point) {
  if (!point.verifiable)
    return { issue: "non vérifiable", motif:
      "Aucune grille de vérification n'est écrite pour ce contrôle : il reste déclaré, et n'est pas tenu pour acquis." };
  const manquantes = [], refusees = [];
  for (const v of point.verifs) {
    const rep = point.reponses[v.cle];
    const val = rep && typeof rep === "object" ? rep.valeur : rep;
    if (val === undefined || val === null || String(val).trim() === "" ||
        val === "en cours" || val === "autre" || val === "je ne sais pas") {
      manquantes.push(v); continue;
    }
    if (val === "non" || val === false) refusees.push(v);
  }
  if (refusees.length)
    return { issue: "refusé", refusees, motif:
      "Ce que vous déclariez en place ne l'est pas : " +
      refusees.map(v => "« " + v.question + " » — attendu : " + v.attendu).join(" ; ") +
      ". Ce point retourne au premier temps." };
  if (manquantes.length)
    return { issue: "ne conclut pas", manquantes, motif:
      "La vérification n'est pas achevée : " +
      manquantes.map(v => "« " + v.question + " »").join(" ; ") +
      ". Une réponse « en cours », « autre » ou absente ne vaut ni oui ni non." };
  return { issue: "validé", motif:
    "Vérifié point par point : ce qui était déclaré est établi. Cette obligation passe de « déclaré » à « en règle »." };
}

/* Le parcours entier, tel qu'une page l'affiche.

   `faits` porte ce que le client déclare avoir corrigé au premier temps ;
   `controles` porte ses réponses à la grille du second. Les deux viennent de
   la page, jamais du moteur. */
function parcours(C, R, verdicts, etat) {
  const e = etat || {};
  const A = premierTemps(C, R, verdicts, e.faits);
  const B = secondTemps(C, R, verdicts, e.controles);
  const jugesB = B.map(p => ({ ...p, verdict: verdictVerification(p) }));

  const refuses = jugesB.filter(p => p.verdict.issue === "refusé");
  const valides = jugesB.filter(p => p.verdict.issue === "validé");
  const enAttente = jugesB.filter(p => p.verdict.issue !== "refusé" && p.verdict.issue !== "validé");

  const restantsA = A.filter(p => !p.fait);
  return {
    tempsA: {
      points: A,
      /* Un refus du second temps est un manquement de plus : il rejoint la
         liste du premier, et le compteur le dit. */
      refusesDuSecond: refuses,
      restants: restantsA.length + refuses.length,
      acheve: restantsA.length === 0,
    },
    tempsB: {
      points: jugesB,
      valides: valides.length,
      refuses: refuses.length,
      enAttente: enAttente.length,
      /* Le second temps ne s'ouvre qu'une fois le premier achevé : c'est
         l'ordre qui a été arrêté, et la page le fait respecter. */
      ouvert: restantsA.length === 0,
    },
    compteurs: {
      manquants: A.length,
      declares: B.length,
      enRegle: valides.length,
    },
    mots: { DECLARE, REGLE },
  };
}

module.exports = { parcours, premierTemps, secondTemps, verdictVerification,
                   etatParcours, DEGRES, DECLARE, REGLE };

});

__def("./textes-pse.json", function(module){ module.exports = {
 "L1233-61": {
  "id": "LEGIARTI000036261733",
  "texte": "Dans les entreprises d'au moins cinquante salariés, lorsque le projet de licenciement concerne au moins dix salariés dans une même période de trente jours, l'employeur établit et met en oeuvre un plan de sauvegarde de l'emploi pour éviter les licenciements ou en limiter le nombre. Ce plan intègre un plan de reclassement visant à faciliter le reclassement sur le territoire national des salariés dont le licenciement ne pourrait être évité, notamment celui des salariés âgés ou présentant des caractéristiques sociales ou de qualification rendant leur réinsertion professionnelle particulièrement difficile. Lorsque le plan de sauvegarde de l'emploi comporte, en vue d'éviter la fermeture d'un ou de plusieurs établissements, le transfert d'une ou de plusieurs entités économiques nécessaire à la sauvegarde d'une partie des emplois et lorsque ces entreprises souhaitent accepter une offre de reprise les dispositions de l'article L. 1224-1 relatives au transfert des contrats de travail ne s'appliquent que dans la limite du nombre des emplois qui n'ont pas été supprimés à la suite des licenciements, à la date d'effet de ce transfert.",
  "elargi": true
 },
 "L1233-62": {
  "id": "LEGIARTI000036261725",
  "texte": "Le plan de sauvegarde de l'emploi prévoit des mesures telles que : 1° Des actions en vue du reclassement interne sur le territoire national, des salariés sur des emplois relevant de la même catégorie d'emplois ou équivalents à ceux qu'ils occupent ou, sous réserve de l'accord exprès des salariés concernés, sur des emplois de catégorie inférieure ; 1° bis Des actions favorisant la reprise de tout ou partie des activités en vue d'éviter la fermeture d'un ou de plusieurs établissements ; 2° Des créations d'activités nouvelles par l'entreprise ; 3° Des actions favorisant le reclassement externe à l'entreprise, notamment par le soutien à la réactivation du bassin d'emploi ; 4° Des actions de soutien à la création d'activités nouvelles ou à la reprise d'activités existantes par les salariés ; 5° Des actions de formation, de validation des acquis de l'expérience ou de reconversion de nature à faciliter le reclassement interne ou externe des salariés sur des emplois équivalents ; 6° Des mesures de réduction ou d'aménagement du temps de travail ainsi que des mesures de réduction du volume des heures supplémentaires réalisées de manière régulière lorsque ce volume montre que l'organisation du travail de l'entreprise est établie sur la base d'une durée collective manifestement supérieure à trente-cinq heures hebdomadaires ou 1 600 heures par an et que sa réduction pourrait préserver tout ou partie des emplois dont la suppression est envisagée.",
  "elargi": true
 },
 "L1233-63": {
  "id": "LEGIARTI000035652729",
  "texte": "Le plan de sauvegarde de l'emploi détermine les modalités de suivi de la mise en oeuvre effective des mesures contenues dans le plan de reclassement prévu à l'article L. 1233-61 . Ce suivi fait l'objet d'une consultation régulière et détaillée du                comité social et économique dont l'avis est  transmis à l'autorité administrative. L'autorité administrative est associée au suivi de ces mesures et reçoit un bilan, établi par l'employeur, de la mise en œuvre effective du plan de sauvegarde de l'emploi.",
  "elargi": true
 },
 "L1233-45": {
  "id": "LEGIARTI000029144908",
  "texte": "Le salarié licencié pour motif économique bénéficie d'une priorité de réembauche durant un délai d'un an à compter de la date de rupture de son contrat s'il en fait la demande au cours de ce même délai. Dans ce cas, l'employeur informe le salarié de tout emploi devenu disponible et compatible avec sa qualification. En outre, l'employeur informe les représentants du personnel des postes disponibles. Le salarié ayant acquis une nouvelle qualification bénéficie également de la priorité de réembauche au titre de celle-ci, s'il en informe l'employeur.",
  "elargi": true
 },
 "L1233-57-3": {
  "id": "LEGIARTI000036431884",
  "texte": "En l'absence d'accord collectif ou en cas d'accord ne portant pas sur l'ensemble des points mentionnés aux 1° à 5° de l'article L. 1233-24-2 , l'autorité administrative homologue le document élaboré par l'employeur mentionné à l'article L. 1233-24-4 , après avoir vérifié la conformité de son contenu aux dispositions législatives et aux stipulations conventionnelles relatives aux éléments mentionnés aux 1° à 5° de l'article L. 1233-24-2, la régularité de la procédure d'information et de consultation du comité social et économique, le respect, le cas échéant, des obligations prévues aux articles L. 1233-57-9 à L. 1233-57-16 , L. 1233-57-19 et L. 1233-57-20 et le respect par le plan de sauvegarde de l'emploi des articles L. 1233-61 à L. 1233-63 en fonction des critères suivants : 1° Les moyens dont disposent l'entreprise, l'unité économique et sociale et le groupe ; 2° Les mesures d'accompagnement prévues au regard de l'importance du projet de licenciement ; 3° Les efforts de formation et d'adaptation tels que mentionnés aux articles L. 1233-4 et L. 6321-1 . Elle s'assure que l'employeur a prévu le recours au contrat de sécurisation professionnelle mentionné à l'article L. 1233-65 ou la mise en place du congé de reclassement mentionné à l'article L. 1233-71 .",
  "elargi": true
 },
 "L1233-57-4": {
  "id": "LEGIARTI000035652911",
  "texte": "L'autorité administrative notifie à l'employeur la décision de validation dans un délai de quinze jours à compter de la réception de l'accord collectif mentionné à l'article L. 1233-24-1 et la décision d'homologation dans un délai de vingt et un jours à compter de la réception du document complet élaboré par l'employeur mentionné à l'article L. 1233-24-4 . Elle la notifie, dans les mêmes délais, au comité social et économique et, si elle porte sur un accord collectif, aux organisations syndicales représentatives signataires. La décision prise par l'autorité administrative est motivée. Le silence gardé par l'autorité administrative pendant les délais prévus au premier alinéa vaut décision d'acceptation de validation ou d'homologation. Dans ce cas, l'employeur transmet une copie de la demande de validation ou d'homologation, accompagnée de son accusé de réception par l'administration, au comité social et économique et, si elle porte sur un accord collectif, aux organisations syndicales représentatives signataires. La décision de validation ou d'homologation ou, à défaut, les documents mentionnés au troisième alinéa et les voies et délais de recours sont portés à la connaissance des salariés par voie d'affichage sur leurs lieux de travail ou par tout autre moyen permettant de conférer date certaine à cette information.",
  "elargi": true
 },
 "L1233-65": {
  "id": "LEGIARTI000024422267",
  "texte": "Le contrat de sécurisation professionnelle a pour objet l'organisation et le déroulement d'un parcours de retour à l'emploi, le cas échéant au moyen d'une reconversion ou d'une création ou reprise d'entreprise. Ce parcours débute par une phase de prébilan, d'évaluation des compétences et d'orientation professionnelle en vue de l'élaboration d'un projet professionnel. Ce projet tient compte, au plan territorial, de l'évolution des métiers et de la situation du marché du travail. Ce parcours comprend des mesures d'accompagnement, notamment d'appui au projet professionnel, ainsi que des périodes de formation et de travail.",
  "elargi": true
 },
 "L1233-66": {
  "id": "LEGIARTI000031013988",
  "texte": "Dans les entreprises non soumises à l'article L. 1233-71 , l'employeur est tenu de proposer, lors de l'entretien préalable ou à l'issue de la dernière réunion des représentants du personnel, le bénéfice du contrat de sécurisation professionnelle à chaque salarié dont il envisage de prononcer le licenciement pour motif économique. Lorsque le licenciement pour motif économique donne lieu à un plan de sauvegarde de l'emploi dans les conditions prévues aux articles L. 1233-24-2 et L. 1233-24-4 , cette proposition est faite après la notification par l'autorité administrative de sa décision de validation ou d'homologation prévue à l'article L. 1233-57-4 . A défaut d'une telle proposition, l'institution mentionnée à l'article L. 5312-1 propose le contrat de sécurisation professionnelle au salarié. Dans ce cas, l'employeur verse à l'organisme chargé de la gestion du régime d'assurance chômage mentionné à l'article L. 5427-1 une contribution égale à deux mois de salaire brut, portée à trois mois lorsque son ancien salarié adhère au contrat de sécurisation professionnelle sur proposition de l'institution mentionnée au même article L. 5312-1. La détermination du montant de cette contribution et son recouvrement, effectué selon les règles et sous les garanties et sanctions mentionnées au premier alinéa de l'article L. 5422-16 , sont assurés par l'institution mentionnée à l'article L. 5312-1. Les conditions d'exigibilité de cette contribution sont précisées par décret en Conseil d'Etat.",
  "elargi": true
 },
 "L1233-71": {
  "id": "LEGIARTI000042683537",
  "texte": "Dans les entreprises ou les établissements d'au moins mille salariés, ainsi que dans les entreprises mentionnées à l'article L. 2331-1 et celles répondant aux conditions mentionnées aux articles L. 2341-1 et L. 2341-2 , dès lors qu'elles emploient au total au moins mille salariés, l'employeur propose à chaque salarié dont il envisage de prononcer le licenciement pour motif économique un congé de reclassement qui a pour objet de permettre au salarié de bénéficier d'actions de formation et des prestations d'une cellule d'accompagnement des démarches de recherche d'emploi. La durée du congé de reclassement ne peut excéder douze mois, pouvant être portés à vingt-quatre mois en cas de formation de reconversion professionnelle. Ce congé débute, si nécessaire, par un bilan de compétences qui a vocation à permettre au salarié de définir un projet professionnel et, le cas échéant, de déterminer les actions de formation nécessaires à son reclassement. Celles-ci sont mises en oeuvre pendant la période prévue au premier alinéa. L'employeur finance l'ensemble de ces actions.",
  "elargi": true
 },
 "L1233-72": {
  "id": "LEGIARTI000042683528",
  "texte": "Le congé de reclassement est pris pendant le préavis, que le salarié est dispensé d'exécuter. Lorsque la durée du congé de reclassement excède la durée du préavis, le terme de ce dernier est reporté jusqu'à la fin du congé de reclassement. Le montant de la rémunération qui excède la durée du préavis est égal au montant de l'allocation de conversion mentionnée au 3° de l'article L. 5123-2 . Les dispositions de l'article L. 5122-4 sont applicables à cette rémunération.",
  "elargi": true
 },
 "L1233-24-1": {
  "id": "LEGIARTI000036261836",
  "texte": "Dans les entreprises de cinquante salariés et plus, un accord collectif peut déterminer le contenu du plan de sauvegarde de l'emploi mentionné aux articles L. 1233-61 à L. 1233-63 ainsi que les modalités de consultation du comité social et économique et de mise en œuvre des licenciements. Cet accord est signé par une ou plusieurs organisations syndicales représentatives ayant recueilli au moins 50 % des suffrages exprimés en faveur d'organisations reconnues représentatives au premier tour des dernières élections des titulaires au comité social et économique, quel que soit le nombre de votants, ou par le conseil d'entreprise dans les conditions prévues à l' article L. 2321-9 . L'administration est informée sans délai de l'ouverture d'une négociation en vue de l'accord précité.",
  "elargi": true
 },
 "L1233-39": {
  "id": "LEGIARTI000027566048",
  "texte": "Dans les entreprises de moins de cinquante salariés, l'employeur notifie au salarié le licenciement pour motif économique par lettre recommandée avec avis de réception. La lettre de notification ne peut être adressée avant l'expiration d'un délai courant à compter de la notification du projet de licenciement à l'autorité administrative. Ce délai ne peut être inférieur à trente jours. Une convention ou un accord collectif de travail peut prévoir des délais plus favorables aux salariés. Dans les entreprises de cinquante salariés ou plus, lorsque le projet de licenciement concerne dix salariés ou plus dans une même période de trente jours, l'employeur notifie le licenciement selon les modalités prévues au premier alinéa du présent article, après la notification par l'autorité administrative de la décision de validation mentionnée à l'article L. 1233-57-2 ou de la décision d'homologation mentionnée à l'article L. 1233-57-3 , ou à l'expiration des délais prévus à l'article L. 1233-57-4 . Il ne peut procéder, à peine de nullité, à la rupture des contrats de travail avant la notification de cette décision d'homologation ou de validation ou l'expiration des délais prévus à l'article L. 1233-57-4.",
  "elargi": true
 },
 "L1233-30": {
  "id": "LEGIARTI000035643899",
  "texte": "I.-Dans les entreprises ou établissements employant habituellement au moins cinquante salariés, l'employeur réunit et consulte le comité social et économique sur : 1° L'opération projetée et ses modalités d'application, conformément à l'article L. 2323-31 ; 2° Le projet de licenciement collectif : le nombre de suppressions d'emploi, les catégories professionnelles concernées, les critères d'ordre et le calendrier prévisionnel des licenciements, les mesures sociales d'accompagnement prévues par le plan de sauvegarde de l'emploi et, le cas échéant, les conséquences des licenciements projetés en matière de santé, de sécurité ou de conditions de travail. Les éléments mentionnés au 2° du présent I qui font l'objet de l'accord mentionné à l'article L. 1233-24-1 ne sont pas soumis à la consultation du comité social et économique prévue au présent article. Le comité social et économique tient au moins deux réunions espacées d'au moins quinze jours. II.-Le comité social et économique rend ses deux avis dans un délai qui ne peut être supérieur, à compter de la date de sa première réunion au cours de laquelle il est consulté sur les 1° et 2° du I, à : 1° Deux mois lorsque le nombre des licenciements est inférieur à cent ; 2° Trois mois lorsque le nombre des licenciements est au moins égal à cent et inférieur à deux cent cinquante ; 3° Quatre mois lorsque le nombre des licenciements est au moins égal à deux cent cinquante. Une convention ou un accord collectif de travail peut prévoir des délais différents. En l'absence d'avis du comité social et économique dans ces délais, celui-ci est réputé avoir été consulté.",
  "elargi": true
 },
 "L1233-33": {
  "id": "LEGIARTI000035652923",
  "texte": "L'employeur met à l'étude, dans le délai prévu à l'article L. 1233-30 , les suggestions relatives aux mesures sociales envisagées et les propositions alternatives au projet de restructuration mentionné à l'article L. 2323-31 formulées par le   comité social et économique. Il leur donne une réponse motivée.",
  "elargi": true
 },
 "L1233-34": {
  "id": "LEGIARTI000036762068",
  "texte": "Dans les entreprises d'au moins cinquante salariés, lorsque le projet de licenciement concerne au moins dix salariés dans une même période de trente jours, le comité social et économique peut, le cas échéant sur proposition des commissions constituées en son sein, décider, lors de la première réunion prévue à l' article L. 1233-30 , de recourir à une expertise pouvant porter sur les domaines économique et comptable ainsi que sur la santé, la sécurité ou les effets potentiels du projet sur les conditions de travail. Les modalités et conditions de réalisation de l'expertise, lorsqu'elle porte sur un ou plusieurs des domaines cités au premier alinéa, sont déterminées par un décret en Conseil d'Etat. L'expert peut être assisté dans les conditions prévues à l' article L. 2315-81 . Le comité social et économique peut également mandater un expert afin qu'il apporte toute analyse utile aux organisations syndicales pour mener la négociation prévue à l' article L. 1233-24-1 . Le rapport de l'expert est remis au comité social et économique et, le cas échéant, aux organisations syndicales, au plus tard quinze jours avant l'expiration du délai mentionné à l'article L. 1233-30.",
  "elargi": true
 },
 "L1233-35": {
  "id": "LEGIARTI000036261799",
  "texte": "L'expert désigné par le comité social et économique demande à l'employeur, dans les dix jours à compter de sa désignation, toutes les informations qu'il juge nécessaires à la réalisation de sa mission. L'employeur répond à cette demande dans les huit jours. Le cas échéant, l'expert demande, dans les dix jours, des informations complémentaires à l'employeur, qui répond à cette demande dans les huit jours à compter de la date à laquelle la demande de l'expert est formulée.",
  "elargi": true
 },
 "L1233-24-2": {
  "id": "LEGIARTI000036261824",
  "texte": "L'accord collectif mentionné à l'article L. 1233-24-1 porte sur le contenu du plan de sauvegarde de l'emploi mentionné aux articles L. 1233-61 à L. 1233-63 . Il peut également porter sur : 1° Les modalités d'information et de consultation du comité social et économique, en particulier les conditions dans lesquelles ces modalités peuvent être aménagées en cas de projet de transfert d'une ou de plusieurs entités économiques prévu à l' article L. 1233-61 , nécessaire à la sauvegarde d'une partie des emplois ; 2° La pondération et le périmètre d'application des critères d'ordre des licenciements mentionnés à l'article L. 1233-5 ; 3° Le calendrier des licenciements ; 4° Le nombre de suppressions d'emploi et les catégories professionnelles concernées ; 5° Les modalités de mise en œuvre des mesures de formation, d'adaptation et de reclassement prévues à l'article L. 1233-4 .",
  "elargi": true
 },
 "L1233-24-4": {
  "id": "LEGIARTI000035652928",
  "texte": "A défaut d'accord mentionné à l'article L. 1233-24-1 , un document élaboré par l'employeur après la dernière réunion du   comité social et économique fixe le contenu du plan de sauvegarde de l'emploi et précise les éléments prévus aux 1° à 5° de l'article L. 1233-24-2 , dans le cadre des dispositions légales et conventionnelles en vigueur.",
  "elargi": true
 },
 "L1233-32": {
  "id": "LEGIARTI000025579021",
  "texte": "Outre les renseignements prévus à l'article L. 1233-31 , dans les entreprises de moins de cinquante salariés, l'employeur adresse aux représentants du personnel les mesures qu'il envisage de mettre en oeuvre pour éviter les licenciements ou en limiter le nombre et pour faciliter le reclassement du personnel dont le licenciement ne pourrait être évité. Dans les entreprises d'au moins cinquante salariés, l'employeur adresse le plan de sauvegarde de l'emploi concourant aux mêmes objectifs.",
  "elargi": true
 },
 "L1233-26": {
  "id": "LEGIARTI000035643922",
  "texte": "Lorsqu'une entreprise ou un établissement employant habituellement au moins cinquante salariés a procédé pendant trois mois consécutifs à des licenciements économiques de plus de dix salariés au total, sans atteindre dix salariés dans une même période de trente jours, tout nouveau licenciement économique envisagé au cours des trois mois suivants est soumis aux dispositions du présent chapitre.",
  "elargi": true
 },
 "L1233-25": {
  "id": "LEGIARTI000006901037",
  "texte": "Lorsqu'au moins dix salariés ont refusé la modification d'un élément essentiel de leur contrat de travail, proposée par leur employeur pour l'un des motifs économiques énoncés à l'article L. 1233-3 et que leur licenciement est envisagé, celui-ci est soumis aux dispositions applicables en cas de licenciement collectif pour motif économique.",
  "elargi": true
 },
 "L1233-28": {
  "id": "LEGIARTI000035652699",
  "texte": "L'employeur qui envisage de procéder à un licenciement collectif pour motif économique d'au moins dix salariés dans une même période de trente jours réunit et consulte le comité social et économique dans les conditions prévues par le présent paragraphe.",
  "elargi": true
 }
}; });

__def("./pse_corpus.json", function(module){ module.exports = {
 "14-16.009": {
  "id": "6079c7ab9ba5988459c57588",
  "num": "14-16.009",
  "date": "2015-07-09",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Si un plan de sauvegarde de l'emploi peut contenir des mesures réservées à certains salariés, c'est à la condition que tous les salariés de l'entreprise placés dans une situation identique au regard de l'avantage en cause puissent bénéficier de cet avantage, à moins qu'une différence de traitement soit justifiée par des raisons objectives et pertinentes et que les règles déterminant les conditions d'attribution de cet avantage soient préalablement définies et contrôlables. Ayant constaté d'une part, qu'un salarié avait refusé une mesure de cessation anticipée d'activité et que le plan de sauvegarde de l'emploi prévoyait que, de ce fait, les avantages dont il bénéficiait étaient moins importants que ceux des autres salariés licenciés qui ne remplissaient pas les conditions pour prétendre à un départ anticipé et d'autre part, que cette différence de traitement ne pouvait être justifiée par",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "contenu",
   "mesures réservées à certains salariés",
   "avantage",
   "egalité de traitement",
   "conditions",
   "détermination",
   "atteinte au principe",
   "cas",
   "dispositions introduisant une différence de traitement entre les salariés éligibles à un mécanisme de cessation anticipée d'activité et les autres",
   "raisons objectives et pertinentes justifiant la différence de traitement (non)",
   "portée"
  ]
 },
 "16-11.563": {
  "id": "5fd8f97f3202718e5d749d89",
  "num": "16-11.563",
  "date": "2017-09-14",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "L'indemnité allouée en application des articles L. 1235-10 et L. 1235-11 du code du travail lorsque la procédure de licenciement est nulle en raison d'une absence ou d'une insuffisance de plan de sauvegarde de l'emploi répare intégralement le préjudice résultant du caractère illicite du licenciement. Viole dès lors ces textes et le principe de réparation intégrale du préjudice la cour d'appel qui, après avoir condamné l'employeur au paiement de cette indemnité, alloue par ailleurs aux salariés des dommages-intérêts pour privation des mesures du plan de sauvegarde de l'emploi",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "absence ou insuffisance du plan",
   "sanction",
   "indemnité de l'article l. 1235-11",
   "cumul avec des dommages et intérêts pour privation des mesures du plan",
   "possibilité (non)"
  ]
 },
 "07-45.481": {
  "id": "6079b5b99ba5988459c56dbf",
  "num": "07-45.481",
  "date": "2009-01-28",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "Les conditions d'effectif et de nombre des salariées qui imposent l'établissement et la mise en oeuvre d'un plan de sauvegarde de l'emploi s'apprécient au niveau de l'entreprise que dirige l'employeur. Manque en conséquence de base légale au regard de l'article L. 1233-61 du code du travail l'arrêt d'une cour d'appel qui retient que les membres d'un GIE, constituant une unité économique et sociale, doivent être considérés comme formant une seule entreprise, pour la vérification des conditions déterminant l'établissement d'un plan de sauvegarde de l'emploi, sans rechercher si l'ensemble des personnes morales qui composent ce groupement avaient la qualité d'employeur",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "mise en oeuvre",
   "conditions",
   "effectif à prendre en compte",
   "appréciation",
   "cadre",
   "détermination"
  ]
 },
 "08-40.125": {
  "id": "6079b6689ba5988459c56e12",
  "num": "08-40.125",
  "date": "2009-04-08",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "L'obligation pour l'employeur, dans le cadre de la priorité de réembauche, d'informer le salarié de tout emploi devenu disponible et compatible avec sa qualification n'est pas limitée aux emplois pourvus par des contrats de travail à durée indéterminée. Justifie légalement sa décision la cour d'appel qui, pour condamner un employeur à payer à un salarié, ingénieur du son, une indemnité pour violation de la priorité de réembauche, retient qu'il a régulièrement recouru, pendant la période couvrant cette priorité, à plusieurs ingénieurs du son, ou chefs opérateurs prise de son, correspondant à une fonction identique, sous la forme de contrats à durée déterminée",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "priorité de réembauchage",
   "conditions",
   "emploi disponible",
   "information du salarié",
   "obligation de l'employeur",
   "etendue",
   "cas",
   "emploi à pourvoi par contrat à durée déterminée",
   "condition"
  ]
 },
 "20-17.360": {
  "id": "629702197c2a1fa9d4442267",
  "num": "20-17.360",
  "date": "2022-06-01",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "Selon l'article 5 de la convention Unédic relative au contrat de sécurisation professionnelle du 19 juillet 2011, agréée par arrêté du 6 octobre 2011, lorsque la rupture du contrat de travail résulte de l'acceptation par le salarié d'un contrat de sécurisation professionnelle, l'employeur doit en énoncer le motif économique soit dans le document écrit d'information sur le contrat de sécurisation professionnelle remis obligatoirement au salarié concerné par le projet de licenciement, soit dans la lettre qu'il est tenu d'adresser, en application de ce texte, au salarié lorsque le délai dont ce dernier dispose pour faire connaître sa réponse à la proposition de contrat de sécurisation professionnelle expire après le délai d'envoi de la lettre de licenciement imposé par les articles L. 1233-15 et L. 1233-39 du code du travail. Lorsque le salarié adhère au contrat de sécurisation professionne",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "formalités légales",
   "lettre de licenciement",
   "notification",
   "délai",
   "respect par l'employeur",
   "contrat de sécurisation professionnelle",
   "mention des motifs de la rupture",
   "enonciation par écrit",
   "portée"
  ]
 },
 "23-22.756": {
  "id": "67d12fa1a74c455c1adcabad",
  "num": "23-22.756",
  "date": "2025-03-12",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Il résulte des articles L. 1233-72 du code du travail, dans sa rédaction antérieure à la loi n° 2020-1576 du 14 décembre 2020, et R. 1233-32 du même code, que lorsqu'un salarié se trouve en congé de reclassement, au cours de la période dépassant la durée de son préavis, il ne peut prétendre au maintien des avantages en nature dont il bénéficiait durant le préavis, mais seulement au versement de l'indemnité prévue au 3° de l'article L. 5123-2 du code du travail",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "mesures d'accompagnement",
   "congé de reclassement",
   "période excédant le préavis",
   "cas",
   "maintien des avantages en nature",
   "exclusion",
   "détermination",
   "portée"
  ]
 },
 "18-26.229": {
  "id": "5fca56f2fa41e51ef42e20d9",
  "num": "18-26.229",
  "date": "2020-06-10",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Si, selon l'article L. 1235-7-1 du code du travail, le contenu du plan de sauvegarde de l'emploi et la régularité de la procédure de licenciement collectif ne peuvent faire l'objet d'un litige distinct de celui relatif à la décision de validation de l'accord collectif déterminant le contenu du plan de sauvegarde de l'emploi, le juge judiciaire demeure compétent pour connaître de l'action exercée par les salariés licenciés aux fins de voir constater une violation des dispositions de l'article L. 1224-1 du code du travail de nature à priver d'effet leurs licenciements",
  "themes": [
   "separation des pouvoirs",
   "compétence judiciaire",
   "domaine d'application",
   "licenciement économique",
   "plan de sauvegarde de l'emploi",
   "action ultérieure en violation des dispositions de l'article l. 1224-1 du code du travail exercée par les salariés licenciés",
   "office du juge judiciaire",
   "détermination",
   "portée"
  ]
 },
 "14-10.766": {
  "id": "6079c78f9ba5988459c5757c",
  "num": "14-10.766",
  "date": "2015-05-27",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Ayant constaté qu'une société ne comportait aucun emploi disponible, tant avant le prononcé des licenciements qu'après dans le cadre de la priorité de réembauche, en rapport avec les compétences des salariés, au besoin en les faisant bénéficier d'une formation d'adaptation, la cour d'appel justifie sa décision de rejet de la demande des salariés en nullité du plan de sauvegarde de l'emploi",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "validité",
   "emploi disponible",
   "critères",
   "appréciation",
   "portée"
  ]
 },
 "95-16.648": {
  "id": "6079b1829ba5988459c52650",
  "num": "95-16.648",
  "date": "1997-02-13",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Aux termes de l'article L. 321-4 du Code du travail, l'employeur doit indiquer au comité d'entreprise saisi d'un projet de licenciement collectif les catégories professionnelles concernées. Une cour d'appel a exactement retenu que la notion de catégories professionnelles, qui sert de base à l'établissement de l'ordre des licenciements, concerne l'ensemble des salariés qui exercent au sein de l'entreprise des fonctions de même nature supposant une formation professionnelle commune.",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "consultation du comité d'entreprise",
   "projet de licenciement",
   "catégories professionnelles concernées",
   "définition",
   "representation des salaries",
   "comité d'entreprise",
   "attributions",
   "attributions consultatives",
   "communications par l'employeur",
   "contrat de travail, execution",
   "employeur",
   "obligations",
   "communication au comité d'entreprise",
   "plan social",
   "contenu",
   "mesures énoncées à l'article l. 321",
   "4",
   "1 du code du travail",
   "plan de reclassement",
   "mesures spéciales et concrètes",
   "absence",
   "effet",
   "mesures précises et concrètes",
   "nécessité",
   "eléments constitutifs",
   "nullité",
   "etendue"
  ]
 },
 "17-16.766": {
  "id": "5fca7fe75ad83e6f5d80d442",
  "num": "17-16.766",
  "date": "2018-11-21",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin Publié au Rapport",
  "sommaire": "Il résulte de l'article L. 1235-7-1 du code du travail, issu de la loi n° 2013-504 du 14 juin 2013, que, si le juge judiciaire demeure compétent pour apprécier le respect par l'employeur de l'obligation individuelle de reclassement, cette appréciation ne peut méconnaître l'autorité de la chose décidée par l'autorité administrative ayant homologué le document élaboré par l'employeur par lequel a été fixé le contenu du plan de reclassement intégré au plan de sauvegarde de l'emploi. Viole dès lors ces dispositions ainsi que la loi des 16-24 août 1790, le décret du 16 fructidor an III et le principe de la séparation des pouvoirs, une cour d'appel qui, pour juger des licenciements dénués de cause réelle et sérieuse, se fonde sur une insuffisance du plan de sauvegarde de l'emploi alors que le contrôle du contenu de ce plan relève de la compétence exclusive de la juridiction administrative",
  "themes": [
   "separation des pouvoirs",
   "compétence judiciaire",
   "domaine d'application",
   "licenciement économique",
   "reclassement",
   "obligation de l'employeur",
   "contrôle",
   "office du juge judiciaire",
   "limites",
   "détermination",
   "portée"
  ]
 },
 "11-20.741": {
  "id": "6079beae9ba5988459c571a8",
  "num": "11-20.741",
  "date": "2012-05-03",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "La nullité de la procédure de licenciement pour motif économique ne pouvant être prononcée, en vertu de l'article L. 1235-10 du code du travail, qu'en cas d'absence ou d'insuffisance du plan de sauvegarde de l'emploi, doit être cassée la décision d'une cour d'appel qui, pour annuler une procédure de licenciement, se prononce sur la cause du licenciement",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "motif économique",
   "appréciation",
   "office du juge",
   "exclusion",
   "portée",
   "nullité",
   "action en nullité",
   "fondement",
   "cause",
   "limites",
   "détermination"
  ]
 },
 "18-24.531": {
  "id": "5fca57e1c23d672238d0a68e",
  "num": "18-24.531",
  "date": "2020-05-27",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "La rupture du contrat de travail résultant de l'acceptation par le salarié d'un contrat de sécurisation professionnelle doit avoir une cause économique réelle et sérieuse. L'employeur est en conséquence tenu d'énoncer la cause économique de la rupture du contrat dans un écrit remis ou adressé au salarié au cours de la procédure de licenciement et au plus tard au moment de l'acceptation du contrat de sécurisation professionnelle par le salarié, afin qu'il soit informé des raisons de la rupture lors de son acceptation. Une cour d'appel qui constate qu'aucun écrit énonçant la cause économique de la rupture n'avait été remis ou adressé au salarié au cours de la procédure de licenciement, peu important les écrits adressés lors de la procédure spécifique de modification du contrat de travail, en déduit exactement que l'employeur n'avait pas satisfait à son obligation légale d'informer le salar",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "mesures d'accompagnement",
   "contrat de sécurisation professionnelle",
   "mention des motifs de la rupture",
   "enonciation dans un écrit",
   "moment",
   "détermination",
   "portée"
  ]
 },
 "15-15.190": {
  "id": "5fd9187091d093b422ebe710",
  "num": "15-15.190",
  "date": "2016-11-16",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin Publié au Rapport",
  "sommaire": "La pertinence d'un plan de sauvegarde de l'emploi doit être appréciée en fonction des moyens dont disposent l'entreprise et le groupe dont elle fait partie pour maintenir les emplois ou faciliter le reclassement. S'agissant des possibilités de reclassement au sein du groupe, cette pertinence doit s'apprécier parmi les entreprises dont les activités, l'organisation ou le lieu d'exploitation leur permettent la permutation de tout ou partie du personnel. En revanche, s'agissant des moyens financiers du groupe, la pertinence doit s'apprécier compte tenu des moyens de l'ensemble des entreprises unies par le contrôle ou l'influence d'une entreprise dominante dans les conditions définies à l'article L. 2331-1 du code du travail, sans qu'il y ait lieu de réduire le groupe aux entreprises situées sur le territoire national",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "contenu",
   "appréciation",
   "périmètre",
   "groupe de sociétés",
   "critères",
   "moyens financiers du groupe",
   "périmètre du groupe",
   "détermination"
  ]
 },
 "18-23.692": {
  "id": "5fca5943aa4c3b2dde12015d",
  "num": "18-23.692",
  "date": "2020-03-25",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "Le respect du principe de la séparation des pouvoirs s'oppose à ce que le juge judiciaire se prononce sur le respect par l'employeur de stipulations conventionnelles dont il est soutenu qu'elles s'imposaient au stade de l'élaboration du plan de sauvegarde de l'emploi, dès lors qu'en application de l'article L. 1233-57-3 du code du travail la vérification du contenu dudit plan relève de l'administration sous le contrôle du juge administratif. Par suite, le juge judiciaire n'est pas compétent pour statuer sur des demandes de salariés, qui, sous le couvert de demandes tendant à obtenir l'exécution des engagements énoncés dans le cadre d'un accord de méthode conclu dans l'entreprise antérieurement à l'élaboration du plan de sauvegarde de l'emploi, contestent la conformité du contenu du plan de sauvegarde de l'emploi aux stipulations de cet accord",
  "themes": [
   "separation des pouvoirs",
   "compétence judiciaire",
   "exclusion",
   "cas",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "contenu",
   "conformité aux stipulations d'un accord de méthode conclu antérieurement",
   "vérification",
   "compétence du juge administratif",
   "détermination",
   "portée"
  ]
 },
 "09-15.182": {
  "id": "6079bb4e9ba5988459c57032",
  "num": "09-15.182",
  "date": "2010-07-12",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Si un plan de sauvegarde de l'emploi peut contenir des mesures réservées à certains salariés, c'est à la condition que tous les salariés de l'entreprise placés dans une situation identique au regard de l'avantage en cause puissent bénéficier de cet avantage, à moins qu'une différence de traitement soit justifiée par des raisons objectives et pertinentes, et que les règles déterminant les conditions d'attribution de cet avantage soient préalablement définies et contrôlables. Doit dès lors être rejeté le pourvoi reprochant à une cour d'appel d'avoir jugé qu'un plan de sauvegarde de l'emploi emportait rupture de l'égalité de traitement entre salariés des divers établissements d'une entreprise, et de l'avoir annulé, après avoir constaté que ce plan prévoyait, d'une part, des mesures incitant à des départs volontaires réservées aux seuls salariés d'un établissement et, d'autre part, qu'au cas",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "contenu",
   "mesures réservées à certains salariés",
   "avantage",
   "egalité de traitement",
   "nécessité",
   "portée",
   "appréciation",
   "critères",
   "mesures de reclassement",
   "priorité donnée au salarié à reclasser",
   "reclassement",
   "obligation de l'employeur",
   "périmètre de l'obligation",
   "groupe de sociétés"
  ]
 },
 "23-15.533": {
  "id": "667baf23eee23a0a3f11d256",
  "num": "23-15.533",
  "date": "2024-06-26",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "Le juge judiciaire ne peut, sans violer le principe de séparation des pouvoirs, en l'état d'une décision administrative autorisant la rupture amiable dans le cadre de la mise en oeuvre d'un plan de sauvegarde de l'emploi assorti d'un plan de départs volontaires devenue définitive, apprécier le caractère réel et sérieux du motif de la rupture au regard de la cause économique ou du respect par l'employeur de son obligation de reclassement. Doit en conséquence être censuré l'arrêt qui déclare la rupture du contrat de travail d'un salarié protégé sans cause réelle et sérieuse et lui alloue des dommages-intérêts à ce titre, alors que par une décision devenue définitive cette rupture amiable avait été autorisée par l'inspection du travail",
  "themes": [
   "contrat de travail, rupture"
  ]
 },
 "20-15.370": {
  "id": "623ac744804402057638eae0",
  "num": "20-15.370",
  "date": "2022-03-23",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "Si, en application de l'article L. 2323-31 du code du travail, dans sa version en vigueur du 1er janvier 2016 au 1er janvier 2018, le comité d'entreprise doit être saisi en temps utile des projets de restructuration et de compression des effectifs, la réorganisation peut être mise en oeuvre par l'employeur avant la date d'homologation du plan de sauvegarde de l'emploi par l'autorité administrative. Dès lors, encourt la cassation l'arrêt qui, pour prononcer la résiliation judiciaire du contrat de travail du salarié aux torts de l'employeur pour manquement à son obligation de fournir un travail, retient que le document unilatéral établi par la société, portant projet de réorganisation et plan de sauvegarde de l'emploi, ne pouvait être mis en oeuvre avant son homologation par l'administration et qu'il en résultait que le salarié avait vocation à travailler sur le site dont la fermeture avai",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "homologation par l'autorité administrative",
   "demande",
   "effets",
   "réorganisation de l'entreprise antérieure à la décision de l'autorité administrative",
   "possibilité",
   "conditions",
   "détermination",
   "portée"
  ]
 },
 "23-18.987": {
  "id": "67593248db845b438efc6e0e",
  "num": "23-18.987",
  "date": "2024-12-11",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Il résulte des dispositions des articles L. 1235-7-1, L. 1233-24-2 et L. 1233-57-3 du code du travail, d'une part, que le juge judiciaire ne peut, sans violer le principe de séparation des pouvoirs, en l'état d'une décision de validation d'un accord collectif majoritaire fixant le plan de sauvegarde de l'emploi devenue définitive, apprécier la légalité des mesures figurant dans ce plan et déterminant les catégories professionnelles concernées par le licenciement et, d'autre part, qu'il appartient à l'autorité administrative sous le contrôle du juge administratif de vérifier si les stipulations de l'accord collectif majoritaire qui déterminent les catégories professionnelles sont entachées de nullité, en raison notamment de ce qu'elles revêtiraient un caractère discriminatoire",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "plan de sauvegarde de l'emploi fixé par accord collectif",
   "décision définitive de validation de l'accord collectif",
   "contestation de la légalité des mesures du plan de sauvegarde de l'emploi",
   "mesures déterminant les catégories professionnelles concernées par le licenciement",
   "examen par le juge judiciaire",
   "possibilité (non)"
  ]
 },
 "23-15.498": {
  "id": "667baf1deee23a0a3f11d252",
  "num": "23-15.498",
  "date": "2024-06-26",
  "ch": "Chambre sociale",
  "sol": "Cassation",
  "pub": "Publié au Bulletin",
  "sommaire": "Il résulte des articles 1101 et 1103 du code civil et L. 1221-1 et L. 1233-3 du code du travail, ce dernier dans sa rédaction issue de l'ordonnance n° 2017-1387 du 22 septembre 2017, que lorsque la rupture du contrat de travail résulte de la conclusion d'un accord amiable intervenu dans le cadre de la mise en oeuvre d'un plan de sauvegarde de l'emploi assorti d'un plan de départs volontaires, soumis aux représentants du personnel, la cause de la rupture ne peut être contestée, sauf fraude ou vice du consentement",
  "themes": [
   "contrat de travail, rupture",
   "rupture d'un commun accord",
   "domaine d'application",
   "départ volontaire",
   "départ dans le cadre d'un plan de sauvegarde de l'emploi",
   "cause",
   "contestation",
   "possibilité (non)"
  ]
 },
 "14-10.031": {
  "id": "6079c7fa9ba5988459c575ab",
  "num": "14-10.031",
  "date": "2015-06-10",
  "ch": "Chambre sociale",
  "sol": "Rejet",
  "pub": "Publié au Bulletin",
  "sommaire": "Justifie sa décision la cour d'appel qui, ayant constaté que l'entreprise comportait moins de cinquante salariés au jour de l'engagement de la procédure de licenciement, retient que le \"plan de sauvegarde de l'emploi\" volontairement mis en place par l'employeur, n'avait pas à satisfaire aux exigences des articles L. 1233-61 et L. 1233-62 du code du travail",
  "themes": [
   "contrat de travail, rupture",
   "licenciement économique",
   "licenciement collectif",
   "plan de sauvegarde de l'emploi",
   "contenu",
   "mesures énoncées à l'article l. 1233",
   "61 du code du travail",
   "nécessité",
   "exclusion",
   "cas",
   "entreprise comportant moins de cinquante salariés au jour de l'engagement de la procédure de licenciement",
   "62 du code du travail",
   "entreprise comportant moins de cinquante salariés au jour de l'engagement de la procédure de licenciement contrat de travail, rupture",
   "mise en oeuvre",
   "conditions",
   "effectif à prendre en compte",
   "appréciation",
   "moment",
   "détermination",
   "portée"
  ]
 }
}; });

  global.MoteurPSE = {
    audit: require("./audit-pse-client.js"),

    moteur: require("./moteur-pse.js"),
    grille: require("./grille-pse.js"),
    controles: require("./controles-pse.js"),
    manifeste: __MANIFESTE,
    champs: [["Reprises de l'audit économique",[["effectif","Effectif de l'entreprise","nombre"],["effectifEtablissement","Effectif de l'établissement concerné","nombre"],["groupe","L'entreprise appartient-elle à un groupe ?","oui / non"],["effectifGroupe","Effectif total du groupe","nombre"],["nbLicenciements","Nombre de licenciements envisagés sur trente jours","nombre"],["total30j","Décompte des trente jours retenu par l'audit économique, refus de modification et licenciements déjà prononcés compris","nombre"],["dateNotification","Date de notification des licenciements","AAAA-MM-JJ"],["pieces","Pièces versées au dossier","liste d'objets"]]],["Le plan",[["plan.mesures","Les mesures du plan, une par ligne : rubrique de l'article L. 1233-62, intitulé, détail, nombre de bénéficiaires, budget, durée","liste d'objets"],["plan.budgetTotal","Budget total annoncé du plan","euros"],["plan.salariesExposes","Salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification","liste"],["plan.resultatGroupe","Résultat consolidé du groupe sur le dernier exercice clos","euros"],["plan.suivi","Modalités de suivi : suivi des mesures, consultation du comité, bilan à l'administration","objet"]]],["Accompagnement individuel",[["plan.accompagnement","Dispositif retenu : congé de reclassement ou contrat de sécurisation professionnelle","texte"],["plan.dureeConge","Durée du congé de reclassement","nombre de mois"],["plan.formationReconversion","Le congé comporte-t-il une formation de reconversion professionnelle ?","oui / non"],["plan.dateProposition","Date de proposition du contrat de sécurisation professionnelle","AAAA-MM-JJ"]]],["Voie et instruction",[["pse.voie","Voie retenue : accord majoritaire ou document unilatéral","texte"],["pse.suffrages","Part des suffrages recueillie par les organisations signataires au premier tour des dernières élections","nombre"],["pse.dateDepotAdmin","Date de réception par l'administration du dossier complet","AAAA-MM-JJ"],["pse.dateDecisionAdmin","Date de la décision de validation ou d'homologation","AAAA-MM-JJ"]]],["Consultation du comité",[["datesReunionsCSE","Dates des réunions du comité sur le projet, dans l'ordre","liste de dates"],["dateAvisCSE","Date à laquelle le comité a rendu son avis","AAAA-MM-JJ"],["accordDelaisConsultation","Un accord fixe-t-il des délais de consultation différents de ceux de la loi ?","oui / non"],["expertisePSE","Le comité a-t-il décidé de recourir à une expertise ?","oui / non"],["pse.dateDesignationExpert","Date de désignation de l'expert","AAAA-MM-JJ"]]],["Après le licenciement",[["plan.dateRupture","Date de rupture des contrats","AAAA-MM-JJ"],["plan.demandesReembauche","Demandes de priorité de réembauche reçues","liste"],["plan.informationElusPostes","Les représentants du personnel sont-ils informés des postes devenus disponibles ?","oui / non"]]]],
    propositions: {"plan.mesures.rubrique":{"valeurs":["1°","1° bis","2°","3°","4°","5°","6°"],"libre":true,"indicatif":true,"aide":"La rubrique de l'article L. 1233-62 à laquelle la mesure se rattache. L'article énonce « des mesures telles que » : la liste n'est pas limitative, et une mesure peut n'entrer dans aucune rubrique — mais l'administration apprécie le plan au regard de celles-ci."},"pse.voie":{"valeurs":["accord"],"autres":["unilateral"],"libre":false,"aide":"Accord collectif majoritaire validé en quinze jours, ou document unilatéral homologué en vingt et un. Le choix commande tout le calendrier et se fait avant la première réunion."},"plan.accompagnement":{"valeurs":["congé de reclassement","contrat de sécurisation professionnelle"],"libre":false,"aide":"Le dispositif n'est pas au choix : au moins mille salariés, c'est le congé de reclassement (L. 1233-71) ; en deçà, le contrat de sécurisation professionnelle (L. 1233-66). Les deux ne se cumulent pas."},"groupe":{"valeurs":["oui","non"],"libre":false,"aide":"L'appartenance à un groupe commande le périmètre d'appréciation des moyens : l'article L. 1233-57-3 fait des moyens du groupe le premier critère."},"accordDelaisConsultation":{"valeurs":["oui","non"],"libre":false,"aide":"Le plafond de deux, trois ou quatre mois de l'article L. 1233-30 est supplétif : une convention ou un accord collectif peut prévoir des délais différents. S'il en existe un, joignez-le — sans lui, l'application ne peut vérifier ni la règle légale ni la vôtre."},"expertisePSE":{"valeurs":["oui","non"],"libre":false,"aide":"Le comité décide du recours à l'expertise lors de la première réunion (L. 1233-34). L'expertise ne prolonge pas le délai d'avis."},"pieces":{"valeurs":["comptes-groupe"],"libre":true,"multiple":true,"indicatif":true,"aide":"Les pièces effectivement versées. Les comptes consolidés du groupe sont la pièce décisive du calibrage : à défaut, l'administration apprécie les moyens sur ce qu'elle a."}},
    listes: [],
    colonnes: {"pieces":[["type","texte"],["date","AAAA-MM-JJ"]],"plan.mesures":[["rubrique","texte"],["intitule","texte"],["beneficiaires","nombre"],["budget","nombre"],["duree","texte"]]},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
