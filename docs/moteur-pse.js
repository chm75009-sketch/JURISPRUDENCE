/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : 2ddca7e6fad9
   {"articlesLus":12,"rubriquesL1233_62":7,"couvertureDecoupage":98.1,"versionL1233_62":"LEGIARTI000036261725","controles":18,"calibrage":2,"coherence":1,"donneesDemandees":24,"casContradictoires":10,"verdicts":216,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"calibrageConcluantConforme":0}
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
  var __MANIFESTE = {"domaine":"plan de sauvegarde de l'emploi","date":"2026-08-16","empreinte":"2ddca7e6fad9","fichiers":{"audit-pse-client.js":"92589e40b86a","controles-pse.js":"fec14800924e","dates.js":"b6d7e587bec3","fiche-pse.json":"a59799a54950","mesures.js":"5dd166061596","moteur-pse.js":"074fb8a1994c","outils.js":"7401cc07f5a6","propositions-pse.js":"8e8aabf771be","questionnaire-pse.js":"b91e4d8ecfea","recevabilite.js":"62a84856a6f1","sonde.js":"e23b90b65ecb","tests-pse.js":"7e9dc3c377d7","textes-pse.json":"05145f9f7b1c"},"compteurs":{"articlesLus":12,"rubriquesL1233_62":7,"couvertureDecoupage":98.1,"versionL1233_62":"LEGIARTI000036261725","controles":18,"calibrage":2,"coherence":1,"donneesDemandees":24,"casContradictoires":10,"verdicts":216,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"calibrageConcluantConforme":0}};
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
    ["Rubriques de L. 1233-62 découpées depuis le texte", `${L1233_62.mesures.length}`,
      `Couverture du découpage : ${L1233_62.couverture} % du texte de l'énumération. Version lue : ${L1233_62.version}.`],
  ]);

  return A.D;
}

module.exports = audit;

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

/* La priorité de réembauche : un an à compter de la rupture, et seulement si le
   salarié la demande dans ce même délai (L. 1233-45). L'obligation d'information
   des représentants du personnel, elle, ne dépend d'aucune demande. */
function priorite(f) {
  const d = (f.pse || {}).dateRupture || f.dateNotification;
  if (!d) return { connu: false, motif: "La date de rupture n'est pas renseignée." };
  return { connu: true, depuis: d, jusqu: ajouter(d, 365),
    motif: `La priorité de réembauche court jusqu'au ${ajouter(d, 365)} pour le salarié qui en fait la demande dans ce même délai.` };
}

module.exports = { planDu, accompagnement, instruction, priorite, INSTRUCTION, SEUIL_MILLE, ajouter, ECART };

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
 }
}; });

  global.MoteurPSE = {
    audit: require("./audit-pse-client.js"),

    moteur: require("./moteur-pse.js"),
    controles: require("./controles-pse.js"),
    manifeste: __MANIFESTE,
    champs: [["Reprises de l'audit économique",[["effectif","Effectif de l'entreprise","nombre"],["effectifEtablissement","Effectif de l'établissement concerné","nombre"],["groupe","L'entreprise appartient-elle à un groupe ?","oui / non"],["effectifGroupe","Effectif total du groupe","nombre"],["nbLicenciements","Nombre de licenciements envisagés sur trente jours","nombre"],["total30j","Décompte des trente jours retenu par l'audit économique, refus de modification et licenciements déjà prononcés compris","nombre"],["dateNotification","Date de notification des licenciements","AAAA-MM-JJ"],["pieces","Pièces versées au dossier","liste d'objets"]]],["Le plan",[["plan.mesures","Les mesures du plan, une par ligne : rubrique de l'article L. 1233-62, intitulé, détail, nombre de bénéficiaires, budget, durée","liste d'objets"],["plan.budgetTotal","Budget total annoncé du plan","euros"],["plan.salariesExposes","Salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification","liste"],["plan.resultatGroupe","Résultat consolidé du groupe sur le dernier exercice clos","euros"],["plan.suivi","Modalités de suivi : suivi des mesures, consultation du comité, bilan à l'administration","objet"]]],["Accompagnement individuel",[["plan.accompagnement","Dispositif retenu : congé de reclassement ou contrat de sécurisation professionnelle","texte"],["plan.dureeConge","Durée du congé de reclassement","nombre de mois"],["plan.formationReconversion","Le congé comporte-t-il une formation de reconversion professionnelle ?","oui / non"],["plan.dateProposition","Date de proposition du contrat de sécurisation professionnelle","AAAA-MM-JJ"]]],["Voie et instruction",[["pse.voie","Voie retenue : accord majoritaire ou document unilatéral","texte"],["pse.suffrages","Part des suffrages recueillie par les organisations signataires au premier tour des dernières élections","nombre"],["pse.dateDepotAdmin","Date de réception par l'administration du dossier complet","AAAA-MM-JJ"],["pse.dateDecisionAdmin","Date de la décision de validation ou d'homologation","AAAA-MM-JJ"]]],["Après le licenciement",[["plan.dateRupture","Date de rupture des contrats","AAAA-MM-JJ"],["plan.demandesReembauche","Demandes de priorité de réembauche reçues","liste"],["plan.informationElusPostes","Les représentants du personnel sont-ils informés des postes devenus disponibles ?","oui / non"]]]],
    propositions: {"plan.mesures.rubrique":{"valeurs":["1°","1° bis","2°","3°","4°","5°","6°"],"libre":true,"indicatif":true,"aide":"La rubrique de l'article L. 1233-62 à laquelle la mesure se rattache. L'article énonce « des mesures telles que » : la liste n'est pas limitative, et une mesure peut n'entrer dans aucune rubrique — mais l'administration apprécie le plan au regard de celles-ci."},"pse.voie":{"valeurs":["accord"],"autres":["unilateral"],"libre":false,"aide":"Accord collectif majoritaire validé en quinze jours, ou document unilatéral homologué en vingt et un. Le choix commande tout le calendrier et se fait avant la première réunion."},"plan.accompagnement":{"valeurs":["congé de reclassement","contrat de sécurisation professionnelle"],"libre":false,"aide":"Le dispositif n'est pas au choix : au moins mille salariés, c'est le congé de reclassement (L. 1233-71) ; en deçà, le contrat de sécurisation professionnelle (L. 1233-66). Les deux ne se cumulent pas."},"groupe":{"valeurs":["oui","non"],"libre":false,"aide":"L'appartenance à un groupe commande le périmètre d'appréciation des moyens : l'article L. 1233-57-3 fait des moyens du groupe le premier critère."},"pieces":{"valeurs":["comptes-groupe"],"libre":true,"multiple":true,"indicatif":true,"aide":"Les pièces effectivement versées. Les comptes consolidés du groupe sont la pièce décisive du calibrage : à défaut, l'administration apprécie les moyens sur ce qu'elle a."}},
    listes: [],
    colonnes: {"pieces":[["type","texte"],["date","AAAA-MM-JJ"]],"plan.mesures":[["rubrique","texte"],["intitule","texte"],["beneficiaires","nombre"],["budget","nombre"],["duree","texte"],["detail","texte"]]},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
