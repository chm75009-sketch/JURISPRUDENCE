/* Moteur d'audit « sst » — version navigateur (MoteurSST).

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/sst, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : fbc9ced431e3
   {"articlesLus":35,"articlesReprisDuModuleCSE":14,"seuils":4,"controles":20,"exposition":1,"coherence":0,"donneesDemandees":40,"casContradictoires":25,"verdicts":540,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0}
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
  var __MANIFESTE = {"domaine":"santé, sécurité et conditions de travail","date":"2026-08-29","empreinte":"fbc9ced431e3","fichiers":{"audit-sst-client.js":"bf6fa6cb1f01","capturer-textes-sst.js":"340314f6b97d","controles-sst.js":"f8bcbcda721f","dates.js":"5d945470174f","fiche-sst.json":"53b3c1bcc029","modeles-sst.js":"3b280588ebd6","moteur-sst.js":"26a0813dc4b0","outils.js":"6defb2be2a2b","propositions-sst.js":"c76cdd6a592b","questionnaire-sst.js":"718105a89609","regularisation-sst.js":"20abf01c8876","tests-sst.js":"bd9530ab3d9f","textes-sst.json":"dbc0ad855c9c","verifier-textes-sst.js":"888058562548"},"compteurs":{"articlesLus":35,"articlesReprisDuModuleCSE":14,"seuils":4,"controles":20,"exposition":1,"coherence":0,"donneesDemandees":40,"casContradictoires":25,"verdicts":540,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0},"textesRelus":{"date":"2026-08-24","articles":35,"concordants":35,"ecarts":0,"sansConclusion":0}};
  var __REGISTRE = (function () { var r = null || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

__def("./audit-sst-client.js", function(module, exports, require){
/* Le rapport du module « santé, sécurité et conditions de travail ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Toute phrase juridique vient d'un contrôle, qui la tient d'un
   article. */
const O = require("./outils.js");
const M = require("./moteur-sst.js");
const { C, ETATS, DETECTION, COHERENCE } = require("./controles-sst.js");
const { R } = require("./regularisation-sst.js");
const { MODELES } = require("./modeles-sst.js");
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

/* Le modèle concret d'un point de régularisation — étape 5 du parcours.
   Chiffré sur le dossier remis, jamais sur un exemple figé : voir
   modeles-sst.js. Rend null si aucun modèle n'est écrit pour cet id
   (SST-CTL-PEN-01, qui mesure l'exposition résultant des autres). */
function modele(f, id) {
  return typeof MODELES[id] === "function" ? MODELES[id](f) : null;
}

module.exports = audit;
module.exports.verdicts = verdicts;
module.exports.parcours = parcours;
module.exports.regularisation = R;
module.exports.controles = C;
module.exports.modele = modele;
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

__def("./moteur-sst.js", function(module, exports, require){
/* Le régime de la santé, de la sécurité et des conditions de travail, côté
   employeur : ce que les textes commandent, et rien d'autre.

   TROIS RÈGLES DE MÉTHODE :

   1. L'évaluation des risques est due par TOUT employeur, sans seuil
      d'effectif (L. 4121-1, L. 4121-3, R. 4121-1). L'effectif ne commande que
      des modalités : la mise à jour au moins annuelle du document unique à
      partir de onze salariés (R. 4121-2, 1° — en dessous, elle peut être
      moins fréquente sous réserve d'un niveau équivalent de protection,
      L. 4121-3, dernier alinéa), le programme annuel de prévention à partir
      de cinquante (L. 4121-3-1, III, 1°), la commission santé, sécurité et
      conditions de travail à partir de trois cents (L. 2315-36), le référent
      harcèlement sexuel de l'employeur à partir de deux cent cinquante
      (L. 1153-5-1).

   2. Le moteur rend les seuils et les échéances ; il ne prononce rien. Les
      contrôles prononcent, et une donnée absente ne produit jamais une
      conformité.

   3. Chaque règle écrite ici l'est sur un article lu à la source
      (textes-sst.json, identifiants LEGIARTI). Ce qui n'a pas pu être lu
      n'est pas codé.                                                        */
const D = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

/* Les seuils que les textes fixent, chacun avec son article. */
const SEUILS = {
  majAnnuelleDuerp: { seuil: 11, article: "R. 4121-2, 1°",
    objet: "mise à jour au moins annuelle du document unique" },
  programmeAnnuel: { seuil: 50, article: "L. 4121-3-1, III, 1°",
    objet: "programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail" },
  referentEmployeur: { seuil: 250, article: "L. 1153-5-1",
    objet: "référent employeur chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes" },
  cssct: { seuil: 300, article: "L. 2315-36",
    objet: "commission santé, sécurité et conditions de travail" },
};

/* L'effectif, apprécié tel qu'il est déclaré. */
function effectif(f) {
  const e = nombre(f.effectif);
  if (e === null) return { connu: false, valeur: null,
    motif: "L'effectif de l'entreprise n'est pas renseigné : les seuils de onze, cinquante, deux cent cinquante et trois cents salariés ne peuvent pas être appréciés." };
  return { connu: true, valeur: e, motif: `Effectif déclaré : ${e} salariés.` };
}

/* Les suites que l'évaluation des risques doit produire : le régime dépend du
   seuil de cinquante salariés (L. 4121-3-1, III). */
function suitesEvaluation(f) {
  const e = effectif(f);
  if (!e.connu) return { connu: false, regime: null, motif: e.motif };
  if (e.valeur >= 50)
    return { connu: true, regime: "programme annuel",
      motif: `Effectif de ${e.valeur} salariés (au moins cinquante) : les résultats de l'évaluation débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail — liste détaillée des mesures de l'année à venir avec conditions d'exécution, indicateurs de résultat et estimation du coût, ressources mobilisables, calendrier (L. 4121-3-1, III, 1°). Ce programme est présenté au comité social et économique dans le cadre de la consultation sur la politique sociale (L. 2312-27, 2°).` };
  return { connu: true, regime: "liste d'actions",
    motif: `Effectif de ${e.valeur} salariés (moins de cinquante) : les résultats de l'évaluation débouchent sur la définition d'actions de prévention des risques et de protection des salariés, dont la liste est consignée dans le document unique et ses mises à jour (L. 4121-3-1, III, 2°).` };
}

/* La mise à jour du document unique : annuelle à partir de onze salariés, et
   dans tous les cas lors d'un aménagement important ou d'une information
   nouvelle (R. 4121-2). */
function majDuerp(f) {
  const e = effectif(f);
  const du = f.duerp || {};
  const out = { effectif: e, annuelleDue: e.connu ? e.valeur >= 11 : null };
  if (!renseigne(du.dateDerniereMaj)) {
    out.etat = "date de mise à jour non renseignée";
    return out;
  }
  const ec = D.ecart(du.dateDerniereMaj, f.dateAudit,
    "la dernière mise à jour du document unique", "la date de l'audit");
  if (!ec.valide) { out.etat = "dates inexploitables"; out.motif = ec.motif; return out; }
  out.jours = ec.jours;
  out.moisEcoules = Math.round((ec.jours / 30.4375) * 10) / 10;
  out.etat = ec.jours <= 366 ? "moins d'un an" : "plus d'un an";
  return out;
}

/* La commission santé, sécurité et conditions de travail : due dans les
   entreprises d'au moins trois cents salariés, les établissements distincts
   d'au moins trois cents salariés et les établissements mentionnés aux
   articles L. 4521-1 et suivants (L. 2315-36) ; l'inspecteur du travail peut
   l'imposer en dessous (L. 2315-37) ; en dehors de ces cas, un accord peut la
   créer (L. 2315-43). */
function cssctDue(f) {
  const e = effectif(f);
  const etab300 = f.etablissementDistinct300;
  const risqueParticulier = f.etablissementRisqueParticulier;
  const imposee = f.cssctImposeeInspection;
  if (dit(risqueParticulier))
    return { connu: true, due: true, fondement: "L. 2315-36, 3°",
      motif: "L'entreprise comporte un établissement mentionné aux articles L. 4521-1 et suivants (installations à hauts risques industriels) : la commission santé, sécurité et conditions de travail y est obligatoire quel que soit l'effectif (L. 2315-36, 3°)." };
  if (dit(imposee))
    return { connu: true, due: true, fondement: "L. 2315-37",
      motif: "L'inspecteur du travail a imposé la création d'une commission santé, sécurité et conditions de travail (L. 2315-37) : elle est due, quel que soit l'effectif." };
  if (e.connu && e.valeur >= 300)
    return { connu: true, due: true, fondement: "L. 2315-36, 1°",
      motif: `Effectif de ${e.valeur} salariés (au moins trois cents) : la commission santé, sécurité et conditions de travail est obligatoire (L. 2315-36, 1°).` };
  if (dit(etab300))
    return { connu: true, due: true, fondement: "L. 2315-36, 2°",
      motif: "Un établissement distinct d'au moins trois cents salariés est déclaré : la commission santé, sécurité et conditions de travail y est obligatoire (L. 2315-36, 2°)." };
  if (!e.connu) return { connu: false, due: null, motif: e.motif };
  if (!renseigne(etab300) || !renseigne(risqueParticulier) || !renseigne(imposee))
    return { connu: false, due: null,
      motif: "L'effectif est sous trois cents, mais il n'est pas répondu aux trois autres cas qui rendent la commission obligatoire — établissement distinct d'au moins trois cents salariés (L. 2315-36, 2°), établissement à hauts risques industriels (L. 2315-36, 3°), création imposée par l'inspecteur du travail (L. 2315-37)." };
  return { connu: true, due: false, fondement: "L. 2315-36",
    motif: `Effectif de ${e.valeur} salariés, aucun établissement distinct d'au moins trois cents salariés, aucun établissement à hauts risques, aucune décision de l'inspecteur : la commission n'est pas obligatoire. Un accord d'entreprise — ou, sans délégué syndical, un accord avec le comité — peut néanmoins en créer une (L. 2315-43).` };
}

/* Le référent harcèlement sexuel de l'employeur : à partir de deux cent
   cinquante salariés (L. 1153-5-1). */
function referentEmployeurDu(f) {
  const e = effectif(f);
  if (!e.connu) return { connu: false, du: null, motif: e.motif };
  if (e.valeur >= 250)
    return { connu: true, du: true,
      motif: `Effectif de ${e.valeur} salariés (au moins deux cent cinquante) : un référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes doit être désigné (L. 1153-5-1).` };
  return { connu: true, du: false,
    motif: `Effectif de ${e.valeur} salariés (moins de deux cent cinquante) : le référent employeur de L. 1153-5-1 n'est pas obligatoire. Le référent du comité social et économique (L. 2314-1), lui, ne dépend pas de ce seuil.` };
}

/* Les causes de fin anticipée du mandat. L. 2314-33, deuxième phrase : « Les
   fonctions de ces membres prennent fin par le décès, la démission, la rupture
   du contrat de travail, la perte des conditions requises pour être éligible. »
   Elles seules autorisent le comité à remplacer un membre de la commission
   avant le terme du mandat des élus, et aucun accord n'y déroge. */
const FINS_ANTICIPEES = ["décès", "démission", "rupture du contrat de travail",
  "perte des conditions requises pour être éligible"];
const finAnticipeeMandat = cause => FINS_ANTICIPEES.includes(cause);

module.exports = { SEUILS, effectif, suitesEvaluation, majDuerp, cssctDue, referentEmployeurDu,
  FINS_ANTICIPEES, finAnticipeeMandat };

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

__def("./controles-sst.js", function(module, exports, require){
/* Les contrôles de la santé, de la sécurité et des conditions de travail,
   côté employeur.

   L'objet du module : vérifier que l'évaluation des risques existe, vit et
   produit ses suites (document unique, programme ou liste d'actions), que la
   commission santé, sécurité et conditions de travail est en place là où elle
   est due, que les obligations de prévention du harcèlement sont tenues — et
   mesurer ce à quoi l'employeur s'expose quand elles ne le sont pas.

   Ce qui ne se contrôle pas, et qu'il faut dire ici : la SUFFISANCE des
   mesures de prévention s'apprécie au fond, pas sur une case cochée. Quand des
   mesures existent, le contrôle le constate ; il ne dit jamais qu'elles
   suffisent. Et le contrôle d'exposition (SST-CTL-PEN-01) ne rend JAMAIS
   « conforme » : l'obligation de sécurité s'apprécie en continu, un
   blanc-seing serait faux.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ». */
const M = require("./moteur-sst.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Les décisions, citées telles qu'elles ont été lues.

   Chacune a été lue à la source dans la base Judilibre de la Cour de cassation
   le 21 août 2026, réponse non relaxée, et n'est citée que pour ce qu'elle dit.
   Elles portent toutes sur la commission santé, sécurité et conditions de
   travail, et elles disent la même chose sous quatre angles : les articles
   L. 2315-38 et L. 2315-39 sont d'ordre public, et l'accord qui organise la
   commission ne peut ni élargir sa délégation ni changer les règles de sa
   composition. */
const ARRETS = {
  designation: "Soc., 27 novembre 2019, n° 19-14.224, publié : « la désignation des membres d'une CSSCT, que sa mise en place soit obligatoire ou conventionnelle, résulte d'un vote des membres du CSE à la majorité des voix des membres présents lors du vote, sans qu'il soit besoin d'une résolution préalable fixant les modalités de l'élection » — solution tirée de L. 2315-39 combiné à L. 2315-32, alinéa 1.",
  designationOrdrePublic: "Soc., 11 février 2026, n° 24-16.408 : les dispositions de L. 2315-39 sont d'ordre public ; une stipulation d'accord attribuant « un siège à chaque organisation syndicale représentée au CSE, par ordre de représentativité » ne peut pas s'entendre comme imposant une désignation proportionnelle au résultat électoral de chaque syndicat, une telle lecture étant contraire à L. 2315-32 et L. 2315-39.",
  troisiemeCollege: "Soc., 26 février 2025, n° 24-12.295, publié : « Il résulte de l'article L. 2315-39 du code du travail dont les dispositions sont d'ordre public que, dans les entreprises ou établissements où est institué, en application de l'article L. 2314-11 du code du travail, un troisième collège électoral, un siège au moins à la commission santé, sécurité et conditions de travail doit être attribué à un élu au comité social et économique représentant le troisième collège. »",
  remplacement: "Soc., 28 mai 2026, n° 24-22.914, publié : « Sauf dans les cas de fin anticipée de mandat énumérés à l'article L. 2314-33 du code du travail, le comité social et économique ne peut procéder au remplacement des membres d'une commission santé, sécurité et conditions de travail initialement désignés avant le terme du mandat des membres élus du comité » — et sans qu'un accord d'entreprise puisse y déroger. Les causes de fin anticipée sont le décès, la démission, la rupture du contrat de travail et la perte des conditions requises pour être éligible.",
  delegation: "Soc., 13 mai 2026, n° 25-12.560 : « Aux termes de l'article L. 2315-38 du même code, dont les dispositions sont d'ordre public, la commission santé, sécurité et conditions de travail se voit confier, par délégation du comité social et économique, tout ou partie des attributions du comité relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert prévu à la sous-section 10 et des attributions consultatives du comité. »",
  expertise: "Soc., 18 mars 2026, n° 23-22.270, publié : le comité peut décider d'une expertise « le cas échéant sur proposition des commissions constituées en son sein » (L. 1233-34). La proposition appartient donc aux commissions ; la décision reste au comité.",
};

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------ le document unique */

ctl("SST-CTL-DUE-01", "Document unique",
  "Les risques ont-ils été évalués et transcrits dans un document unique ?",
  ["L. 4121-1", "L. 4121-3", "L. 4121-3-1", "R. 4121-1"],
  f => {
    const du = f.duerp || {};
    if (vide(du.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un document unique d'évaluation des risques professionnels existe. L'évaluation des risques et sa transcription sont dues par tout employeur, sans seuil d'effectif (L. 4121-3, R. 4121-1)." };
    if (nie(du.existe)) return { etat: NC, motif: "Aucun document unique d'évaluation des risques professionnels : l'employeur doit évaluer les risques (L. 4121-3) et en transcrire les résultats dans un document unique (R. 4121-1), qui répertorie l'ensemble des risques et assure la traçabilité collective des expositions (L. 4121-3-1, I). L'absence de transcription est punie de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1)." };
    return { etat: CONF, motif: "Un document unique d'évaluation des risques professionnels existe : la transcription exigée par R. 4121-1 est faite. Son contenu, sa mise à jour et ses suites sont contrôlés par ailleurs." };
  });

ctl("SST-CTL-DUE-02", "Document unique",
  "L'évaluation comporte-t-elle un inventaire des risques par unité de travail ?",
  ["R. 4121-1"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : son contenu n'a pas d'objet — l'absence du document, elle, est constatée par SST-CTL-DUE-01." };
    if (vide(du.existe) || vide(du.unitesTravail)) return { etat: MANQ, motif: "Il n'est pas indiqué si l'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail de l'entreprise ou de l'établissement, comme R. 4121-1 l'impose." };
    if (nie(du.unitesTravail)) return { etat: NC, motif: "Le document unique ne comporte pas d'inventaire des risques par unité de travail : R. 4121-1 impose que l'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail, y compris ceux liés aux ambiances thermiques." };
    return { etat: CONF, motif: "L'évaluation comporte un inventaire des risques par unité de travail, conformément à R. 4121-1." };
  });

ctl("SST-CTL-DUE-03", "Document unique",
  "Le document unique a-t-il été mis à jour dans l'année (entreprises d'au moins onze salariés) ?",
  ["R. 4121-2, 1°", "L. 4121-3, dernier alinéa"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa mise à jour n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUE-01." };
    const m = M.majDuerp(f);
    if (!m.effectif.connu) return { etat: MANQ, motif: m.effectif.motif };
    if (m.etat === "date de mise à jour non renseignée")
      return { etat: MANQ, motif: "La date de la dernière mise à jour du document unique n'est pas renseignée. À partir de onze salariés, la mise à jour est au moins annuelle (R. 4121-2, 1°) ; si le document n'a réellement jamais été mis à jour, le manquement est constitué, et il est puni de l'amende des contraventions de la cinquième classe (R. 4741-1)." };
    if (m.etat === "dates inexploitables") return { etat: MANQ, motif: m.motif };
    if (!m.annuelleDue) {
      if (m.etat === "plus d'un an")
        return { etat: RISQ, motif: `Dernière mise à jour il y a environ ${m.moisEcoules} mois. Dans les entreprises de moins de onze salariés, la mise à jour peut être moins fréquente qu'annuelle, sous réserve que soit garanti un niveau équivalent de protection (L. 4121-3, dernier alinéa) — et elle reste due lors de tout aménagement important ou de toute information nouvelle (R. 4121-2). Cette garantie s'apprécie au fond : documentez-la.` };
      return { etat: CONF, motif: `Dernière mise à jour il y a environ ${m.moisEcoules} mois : moins d'un an au ${f.dateAudit}.` };
    }
    if (m.etat === "plus d'un an")
      return { etat: NC, motif: `Dernière mise à jour du document unique le ${(f.duerp || {}).dateDerniereMaj}, soit environ ${m.moisEcoules} mois au ${f.dateAudit} : dans une entreprise d'au moins onze salariés, la mise à jour est au moins annuelle (R. 4121-2, 1°). Le défaut de mise à jour est puni de l'amende des contraventions de la cinquième classe (R. 4741-1).` };
    return { etat: CONF, motif: `Dernière mise à jour il y a environ ${m.moisEcoules} mois : la périodicité annuelle de R. 4121-2, 1°, est tenue au ${f.dateAudit}.` };
  });

ctl("SST-CTL-DUE-04", "Document unique",
  "Le document unique a-t-il été mis à jour lors du dernier aménagement important ou de la dernière information nouvelle ?",
  ["R. 4121-2, 2° et 3°"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa mise à jour n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUE-01." };
    const ev = f.evenement || {};
    if (vide(ev.survenu)) return { etat: MANQ, motif: "Il n'est pas indiqué si, depuis la dernière mise à jour, est survenu un aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, ou si une information supplémentaire intéressant l'évaluation d'un risque a été portée à la connaissance de l'employeur (R. 4121-2, 2° et 3°)." };
    if (nie(ev.survenu)) return { etat: CONF, motif: "Aucun aménagement important ni information nouvelle déclarés depuis la dernière mise à jour : les cas de mise à jour de R. 4121-2, 2° et 3°, ne se sont pas présentés." };
    if (vide(ev.majFaite)) return { etat: MANQ, motif: "Un aménagement important ou une information nouvelle est déclaré, mais il n'est pas dit si le document unique a été mis à jour en conséquence (R. 4121-2, 2° et 3°)." };
    if (nie(ev.majFaite)) return { etat: NC, motif: "Un aménagement important ou une information nouvelle est survenu sans mise à jour du document unique : R. 4121-2 impose la mise à jour lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur. Ce défaut est puni de l'amende des contraventions de la cinquième classe (R. 4741-1)." };
    return { etat: CONF, motif: "Le document unique a été mis à jour à la suite de l'aménagement important ou de l'information nouvelle déclarés, conformément à R. 4121-2." };
  });

ctl("SST-CTL-DUE-05", "Suites de l'évaluation",
  "Les résultats de l'évaluation débouchent-ils sur ce que le seuil de cinquante salariés commande — programme annuel de prévention, ou liste d'actions consignée ?",
  ["L. 4121-3-1, III", "L. 2312-27, 2°"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : ses suites n'ont pas d'objet — l'absence du document est constatée par SST-CTL-DUE-01." };
    const s = M.suitesEvaluation(f);
    if (!s.connu) return { etat: MANQ, motif: s.motif };
    
    if (s.regime === "programme annuel") {
      const p = f.programmeAnnuel || {};
      if (vide(p.existe)) return { etat: MANQ, motif: "Effectif d'au moins cinquante salariés : il n'est pas indiqué si un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail a été établi (L. 4121-3-1, III, 1°)." };
      if (nie(p.existe)) return { etat: NC, motif: s.motif + " Ce programme n'est pas établi : le manquement est constitué." };
      const cse = f.cse || {};
      if (vide(cse.existe))
        return { etat: MANQ, motif: "Le programme annuel existe, mais il n'est pas indiqué si un comité social et économique existe : le programme lui est présenté dans le cadre de la consultation sur la politique sociale (L. 2312-27, 2°)." };
      if (dit(cse.existe) && vide(p.presenteCSE))
        return { etat: MANQ, motif: "Le programme annuel existe, mais il n'est pas indiqué s'il est présenté au comité social et économique (L. 2312-27, 2°)." };
      if (dit(cse.existe) && nie(p.presenteCSE))
        return { etat: NC, motif: "Le programme annuel de prévention existe, mais il n'est pas présenté au comité social et économique dans le cadre de la consultation sur la politique sociale, comme L. 2312-27, 2°, l'impose — le comité peut proposer un ordre de priorité et des mesures supplémentaires." };
      return { etat: CONF, motif: "Effectif d'au moins cinquante salariés et programme annuel de prévention établi" + (dit(cse.existe) ? ", présenté au comité social et économique (L. 2312-27, 2°)" : "") + " : L. 4121-3-1, III, 1°, est respecté." };
    }
    const l = f.listeActions || {};
    if (vide(l.consignee)) return { etat: MANQ, motif: "Effectif de moins de cinquante salariés : il n'est pas indiqué si la liste des actions de prévention et de protection est consignée dans le document unique et ses mises à jour (L. 4121-3-1, III, 2°)." };
    if (nie(l.consignee)) return { etat: NC, motif: s.motif + " Cette liste n'est pas consignée : le manquement est constitué." };
    return { etat: CONF, motif: "Effectif de moins de cinquante salariés et liste d'actions de prévention consignée dans le document unique : L. 4121-3-1, III, 2°, est respecté." };
  });

ctl("SST-CTL-DUE-06", "Document unique",
  "Les versions successives sont-elles conservées, et l'avis sur les modalités d'accès est-il affiché ?",
  ["L. 4121-3-1, V", "R. 4121-4"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa conservation n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUE-01." };
    if (vide(du.existe) || vide(du.versionsConservees) || vide(du.avisAffiche))
      return { etat: MANQ, motif: "Il n'est pas indiqué si les versions successives du document unique sont conservées (quarante ans au moins — L. 4121-3-1, V ; R. 4121-4) et si un avis indiquant les modalités d'accès des travailleurs au document est affiché à une place convenable et aisément accessible (R. 4121-4, dernier alinéa)." };
    const griefs = [];
    if (nie(du.versionsConservees)) griefs.push("les versions successives ne sont pas conservées, alors qu'elles doivent l'être pendant quarante ans au moins et rester tenues à la disposition des travailleurs, des anciens travailleurs, des membres de la délégation du personnel du comité, du service de prévention et de santé au travail et des agents de contrôle (L. 4121-3-1, V ; R. 4121-4)");
    if (nie(du.avisAffiche)) griefs.push("l'avis indiquant les modalités d'accès des travailleurs au document unique n'est pas affiché à une place convenable et aisément accessible — au même emplacement que le règlement intérieur lorsqu'il en existe un (R. 4121-4, dernier alinéa)");
    if (griefs.length) return { etat: NC, motif: griefs.join(" ; ") + "." };
    return { etat: CONF, motif: "Versions successives conservées et avis d'accès affiché : L. 4121-3-1, V, et R. 4121-4 sont respectés en l'état déclaré." };
  });

ctl("SST-CTL-DUE-07", "Document unique",
  "Le comité social et économique est-il consulté sur le document unique et sur ses mises à jour ?",
  ["L. 4121-3, 1°"],
  f => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe dans l'entreprise : la consultation de L. 4121-3, 1°, ne peut pas être contrôlée." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique déclaré : la consultation sur le document unique (L. 4121-3, 1°) n'a pas d'objet ici — la régularité de cette absence relève du module « comité social et économique » de l'application." };
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa consultation n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUE-01." };
    if (vide(du.consultationCSE)) return { etat: MANQ, motif: "Il n'est pas indiqué si le comité social et économique est consulté sur le document unique et sur ses mises à jour, comme L. 4121-3, 1°, l'impose." };
    if (nie(du.consultationCSE)) return { etat: NC, motif: "Le comité social et économique n'est pas consulté sur le document unique et ses mises à jour : L. 4121-3, 1°, l'impose — le comité et sa commission santé, sécurité et conditions de travail, s'ils existent, apportent leur contribution à l'évaluation des risques." };
    return { etat: CONF, motif: "Le comité social et économique est consulté sur le document unique et ses mises à jour, conformément à L. 4121-3, 1°." };
  });

ctl("SST-CTL-DUE-08", "Document unique",
  "Le document unique est-il transmis au service de prévention et de santé au travail à chaque mise à jour ?",
  ["L. 4121-3-1, VI"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa transmission n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUE-01." };
    if (vide(du.existe) || vide(du.transmisSPST)) return { etat: MANQ, motif: "Il n'est pas indiqué si le document unique est transmis, à chaque mise à jour, au service de prévention et de santé au travail auquel l'employeur adhère (L. 4121-3-1, VI)." };
    if (nie(du.transmisSPST)) return { etat: NC, motif: "Le document unique n'est pas transmis au service de prévention et de santé au travail à chaque mise à jour : L. 4121-3-1, VI, l'impose." };
    return { etat: CONF, motif: "Le document unique est transmis au service de prévention et de santé au travail à chaque mise à jour, conformément à L. 4121-3-1, VI." };
  });

/* ----------------------------------------------------------------- la CSSCT */

ctl("SST-CTL-CSS-01", "Commission santé, sécurité et conditions de travail",
  "La commission santé, sécurité et conditions de travail est-elle créée là où elle est due ?",
  ["L. 2315-36", "L. 2315-37", "L. 2315-43"],
  f => {
    const d = M.cssctDue(f);
    if (d.due === null) return { etat: MANQ, motif: d.motif };
    if (d.due === false) return { etat: SO, motif: d.motif };
    const c = f.cssct || {};
    if (vide(c.existe)) return { etat: MANQ, motif: d.motif + " Il n'est pas indiqué si elle est effectivement créée." };
    if (nie(c.existe)) return { etat: NC, motif: d.motif + " Elle n'est pas créée : le manquement est constitué." };
    return { etat: CONF, motif: d.motif + " Elle est créée." };
  });

/* Le garde des contrôles qui portent sur une commission : sans commission,
   rien ne se contrôle d'elle — son absence, elle, relève de SST-CTL-CSS-01. */
function siCommission(f, suite) {
  const c = f.cssct || {};
  if (vide(c.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si une commission santé, sécurité et conditions de travail existe." };
  if (nie(c.existe)) return { etat: SO, motif: "Aucune commission santé, sécurité et conditions de travail : ce contrôle n'a pas d'objet — l'obligation de la créer, elle, est contrôlée par SST-CTL-CSS-01." };
  return suite(c);
}

ctl("SST-CTL-CSS-02", "Commission santé, sécurité et conditions de travail",
  "La composition de la commission respecte-t-elle L. 2315-39 — présidence, trois membres au moins dont un du second collège, désignation par le comité ?",
  ["L. 2315-39", "Soc., 27 novembre 2019, n° 19-14.224", "Soc., 26 février 2025, n° 24-12.295",
   "Soc., 11 février 2026, n° 24-16.408"],
  f => siCommission(f, c => {
    if (vide(c.presideeEmployeur) && vide(c.nbMembres) && vide(c.membreSecondCollege) && vide(c.designesParCSE))
      return { etat: MANQ, motif: "La composition de la commission n'est pas décrite : L. 2315-39 impose la présidence par l'employeur ou son représentant, au minimum trois membres représentants du personnel dont au moins un du second collège (ou du troisième), désignés par le comité parmi ses membres. " + ARRETS.designation };
    const griefs = [], manques = [];
    if (vide(c.presideeEmployeur)) manques.push("la présidence"); else if (nie(c.presideeEmployeur)) griefs.push("la commission n'est pas présidée par l'employeur ou son représentant");
    const n = typeof c.nbMembres === "number" ? c.nbMembres : (c.nbMembres ? Number(c.nbMembres) : null);
    if (n === null || !isFinite(n)) manques.push("le nombre de membres"); else if (n < 3) griefs.push(`elle ne comprend que ${n} membre(s) représentant(s) du personnel, pour trois au minimum`);
    if (vide(c.membreSecondCollege)) manques.push("la présence d'un membre du second collège"); else if (nie(c.membreSecondCollege)) griefs.push("aucun membre du second collège (ou, le cas échéant, du troisième) n'y siège");
    if (vide(c.designesParCSE)) manques.push("le mode de désignation"); else if (nie(c.designesParCSE)) griefs.push("ses membres ne sont pas désignés par le comité parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32");
    if (griefs.length) {
      const collegeEnCause = nie(c.membreSecondCollege), designationEnCause = nie(c.designesParCSE);
      return { etat: NC, motif: `La composition de la commission ne respecte pas L. 2315-39 : ${griefs.join(" ; ")}.` +
        (collegeEnCause ? " Là où un troisième collège est institué, le siège lui revient. " + ARRETS.troisiemeCollege : "") +
        (designationEnCause ? " " + ARRETS.designation + " " + ARRETS.designationOrdrePublic : "") };
    }
    if (manques.length) return { etat: MANQ, motif: `La composition de la commission est incomplètement décrite — il manque : ${manques.join(" ; ")} (L. 2315-39).` };
    return { etat: CONF, motif: "Présidence par l'employeur ou son représentant, au moins trois membres dont un du second collège, désignés par le comité parmi ses membres : la composition respecte L. 2315-39. Ces dispositions sont d'ordre public — un accord ne peut ni les écarter ni les réécrire. " + ARRETS.designationOrdrePublic };
  }));

const MODALITES_CSSCT = ["accord d'entreprise", "accord avec le comité", "règlement intérieur"];
ctl("SST-CTL-CSS-03", "Commission santé, sécurité et conditions de travail",
  "Les modalités de mise en place et de fonctionnement de la commission sont-elles fixées — accord d'entreprise, accord avec le comité, ou règlement intérieur à défaut ?",
  ["L. 2315-41", "L. 2315-42", "L. 2315-44"],
  f => siCommission(f, c => {
    if (vide(f.cssct.modalitesFixees)) return { etat: MANQ, motif: "Il n'est pas indiqué ce qui fixe les modalités de la commission — nombre de membres, missions déléguées, fonctionnement, heures de délégation, formation, moyens (L. 2315-41) : un accord d'entreprise (L. 2315-41), un accord entre l'employeur et le comité en l'absence de délégué syndical (L. 2315-42), ou, à défaut d'accord, le règlement intérieur du comité (L. 2315-44)." };
    if (f.cssct.modalitesFixees === "aucune") return { etat: NC, motif: "Rien ne fixe les modalités de la commission : à défaut d'accord d'entreprise (L. 2315-41) ou d'accord avec le comité (L. 2315-42), c'est le règlement intérieur du comité qui doit définir le nombre de membres, les missions déléguées, les modalités de fonctionnement, les heures de délégation, la formation et, le cas échéant, les moyens (L. 2315-44). Une commission sans règles écrites ne permet d'établir ni ses missions ni ses moyens." };
    if (!MODALITES_CSSCT.includes(f.cssct.modalitesFixees)) return { etat: MANQ, motif: `La source des modalités déclarée (« ${f.cssct.modalitesFixees} ») n'est pas reconnue : répondez « accord d'entreprise », « accord avec le comité », « règlement intérieur » — ou « aucune ».` };
    return { etat: CONF, motif: `Les modalités de la commission sont fixées par ${f.cssct.modalitesFixees === "règlement intérieur" ? "le règlement intérieur du comité (L. 2315-44)" : f.cssct.modalitesFixees === "accord avec le comité" ? "un accord entre l'employeur et le comité, adopté à la majorité des membres titulaires (L. 2315-42)" : "un accord d'entreprise (L. 2315-41)"}.` };
  }));

ctl("SST-CTL-CSS-04", "Commission santé, sécurité et conditions de travail",
  "La délégation confiée à la commission respecte-t-elle ses limites — jamais le recours à l'expert ni les attributions consultatives du comité ?",
  ["L. 2315-38", "Soc., 13 mai 2026, n° 25-12.560", "Soc., 18 mars 2026, n° 23-22.270"],
  f => siCommission(f, c => {
    if (vide(c.delegationConforme)) return { etat: MANQ, motif: "Il n'est pas indiqué si la délégation confiée à la commission exclut le recours à un expert et les attributions consultatives du comité, que L. 2315-38 interdit de déléguer. " + ARRETS.delegation };
    if (nie(c.delegationConforme)) return { etat: NC, motif: "La délégation confiée à la commission empiète sur ce que L. 2315-38 interdit de déléguer : le recours à un expert et les attributions consultatives restent au comité social et économique lui-même. Une consultation rendue par la seule commission serait irrégulière. Ce texte est d'ordre public : les stipulations de l'accord qui organise la commission ne peuvent pas en disposer autrement. " + ARRETS.delegation + " La commission n'est pas pour autant hors du chemin de l'expertise : " + ARRETS.expertise };
    return { etat: CONF, motif: "La délégation confiée à la commission exclut le recours à l'expert et les attributions consultatives du comité, conformément à L. 2315-38. " + ARRETS.delegation + " " + ARRETS.expertise };
  }));

ctl("SST-CTL-CSS-05", "Commission santé, sécurité et conditions de travail",
  "Les élus bénéficient-ils de la formation santé, sécurité et conditions de travail — cinq jours au premier mandat, trois au renouvellement, cinq pour la commission à partir de trois cents salariés ?",
  ["L. 2315-18", "L. 2315-41, 4°"],
  f => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe : la formation de L. 2315-18 bénéficie aux membres de la délégation du personnel et au référent harcèlement du comité." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique déclaré : la formation de ses membres n'a pas d'objet ici — la régularité de cette absence relève du module « comité social et économique »." };
    if (vide(f.formationSSCT)) return { etat: MANQ, motif: "Il n'est pas indiqué si les membres de la délégation du personnel et le référent harcèlement du comité ont bénéficié de la formation nécessaire à leurs missions en santé, sécurité et conditions de travail (L. 2315-18) — cinq jours au moins au premier mandat, trois jours au renouvellement, cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés. Son financement est pris en charge par l'employeur." };
    if (nie(f.formationSSCT)) return { etat: NC, motif: "Les membres de la délégation du personnel n'ont pas bénéficié de la formation santé, sécurité et conditions de travail : L. 2315-18 l'impose — cinq jours au moins au premier mandat, trois jours au renouvellement (cinq pour les membres de la commission dans les entreprises d'au moins trois cents salariés), financée par l'employeur." };
    return { etat: CONF, motif: "La formation santé, sécurité et conditions de travail des élus est assurée, conformément à L. 2315-18." };
  });

ctl("SST-CTL-CSS-06", "Commission santé, sécurité et conditions de travail",
  "Des membres de la commission ont-ils été remplacés avant le terme du mandat des élus ?",
  ["L. 2315-39", "L. 2314-33", "Soc., 28 mai 2026, n° 24-22.914"],
  f => siCommission(f, c => {
    if (vide(c.remplacementEnCoursDeMandat))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le comité a remplacé des membres de la commission depuis leur désignation initiale. Leur mandat prend fin avec celui des membres élus du comité (L. 2315-39). " + ARRETS.remplacement };
    if (nie(c.remplacementEnCoursDeMandat))
      return { etat: CONF, motif: "Aucun remplacement depuis la désignation initiale : les mandats des membres de la commission courent jusqu'au terme de celui des élus du comité (L. 2315-39). " + ARRETS.remplacement };
    if (vide(c.causeRemplacement))
      return { etat: MANQ, motif: "Un remplacement est déclaré, mais sa cause n'est pas renseignée : seules les fins anticipées de mandat de L. 2314-33 l'autorisent — décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible. " + ARRETS.remplacement };
    if (M.finAnticipeeMandat(c.causeRemplacement))
      return { etat: CONF, motif: `Le remplacement est intervenu pour une cause de fin anticipée du mandat au sens de L. 2314-33 — ${c.causeRemplacement}. ` + ARRETS.remplacement };
    return { etat: NC, motif: `Un membre de la commission a été remplacé pour une cause — ${c.causeRemplacement} — qui ne figure pas parmi les fins anticipées de mandat de L. 2314-33. La délibération de remplacement encourt l'annulation, et aucun accord d'entreprise ne peut y déroger. ` + ARRETS.remplacement };
  }));

/* ------------------------------------------------------------ le harcèlement */

ctl("SST-CTL-HAR-01", "Harcèlement",
  "Le référent employeur « harcèlement sexuel et agissements sexistes » est-il désigné (entreprises d'au moins deux cent cinquante salariés) ?",
  ["L. 1153-5-1"],
  f => {
    const d = M.referentEmployeurDu(f);
    if (d.du === null) return { etat: MANQ, motif: d.motif };
    if (d.du === false) return { etat: SO, motif: d.motif };
    if (vide(f.referentEmployeur)) return { etat: MANQ, motif: d.motif + " Il n'est pas indiqué s'il est désigné." };
    if (nie(f.referentEmployeur)) return { etat: NC, motif: d.motif + " Il n'est pas désigné : le manquement est constitué, et les coordonnées de ce référent font partie de l'information obligatoire de D. 1151-1." };
    return { etat: CONF, motif: d.motif + " Il est désigné." };
  });

ctl("SST-CTL-HAR-02", "Harcèlement",
  "Le référent harcèlement du comité social et économique est-il désigné ?",
  ["L. 2314-1"],
  f => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe : le référent de L. 2314-1 est désigné par le comité parmi ses membres." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique déclaré : le référent de L. 2314-1 n'a pas d'objet ici — la régularité de cette absence relève du module « comité social et économique »." };
    if (vide(f.referentCSE)) return { etat: MANQ, motif: "Il n'est pas indiqué si le comité a désigné, parmi ses membres, un référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes (L. 2314-1, dernier alinéa)." };
    if (nie(f.referentCSE)) return { etat: NC, motif: "Aucun référent harcèlement n'est désigné au sein du comité : L. 2314-1 impose sa désignation par le comité, parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32, pour la durée du mandat. La désignation appartient au comité — mais ses coordonnées font partie de l'information que l'employeur doit délivrer (D. 1151-1, 5°) : invitez le comité à y procéder et consignez la démarche." };
    return { etat: CONF, motif: "Le référent harcèlement du comité est désigné, conformément à L. 2314-1." };
  });

ctl("SST-CTL-HAR-03", "Harcèlement",
  "L'information obligatoire est-elle délivrée — textes pénaux, actions ouvertes, coordonnées des autorités et des référents ?",
  ["L. 1152-4", "L. 1153-5", "D. 1151-1"],
  f => {
    if (vide(f.infoHarcelementMoral) && vide(f.infoHarcelementSexuel) && vide(f.infoCoordonnees))
      return { etat: MANQ, motif: "Rien n'est renseigné sur l'information délivrée : L. 1152-4 impose d'informer par tout moyen du texte de l'article 222-33-2 du code pénal (harcèlement moral) ; L. 1153-5 impose, dans les lieux de travail et les locaux d'embauche, l'information sur le texte de l'article 222-33 du code pénal, sur les actions contentieuses civiles et pénales ouvertes et sur les coordonnées des autorités et services compétents, dont la liste est fixée par D. 1151-1." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(f.infoHarcelementMoral, "le texte de l'article 222-33-2 du code pénal (harcèlement moral) n'est pas porté à la connaissance des personnes de L. 1152-2, comme L. 1152-4 l'impose", "l'information sur le harcèlement moral (L. 1152-4)");
    point(f.infoHarcelementSexuel, "le texte de l'article 222-33 du code pénal et les actions contentieuses ouvertes ne sont pas affichés ou diffusés dans les lieux de travail et les locaux d'embauche, comme L. 1153-5 l'impose", "l'information sur le harcèlement sexuel (L. 1153-5)");
    point(f.infoCoordonnees, "les coordonnées exigées par D. 1151-1 ne sont pas délivrées : médecin du travail ou service de prévention et de santé au travail, inspection du travail et nom de l'inspecteur, Défenseur des droits, référent employeur à partir de deux cent cinquante salariés, référent du comité s'il existe", "les coordonnées des autorités et services compétents (D. 1151-1)");
    if (griefs.length) return { etat: NC, motif: `L'information obligatoire n'est pas délivrée : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `L'information est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Textes pénaux, actions ouvertes et coordonnées des autorités et des référents sont portés à la connaissance des salariés et des candidats : L. 1152-4, L. 1153-5 et D. 1151-1 sont respectés en l'état déclaré." };
  });

ctl("SST-CTL-HAR-04", "Harcèlement",
  "La prévention du harcèlement est-elle organisée — risques intégrés à l'évaluation, dispositions de prévention prises ?",
  ["L. 1152-4", "L. 1153-5", "L. 4121-2, 7°"],
  f => {
    if (vide(f.risquesHarcelementEvalues) && vide(f.mesuresPreventionHarcelement))
      return { etat: MANQ, motif: "Rien n'est renseigné sur la prévention du harcèlement : l'employeur prend toutes dispositions nécessaires en vue de prévenir les agissements de harcèlement moral (L. 1152-4) et les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner (L. 1153-5) ; la planification de la prévention intègre les risques liés aux harcèlements et aux agissements sexistes (L. 4121-2, 7°)." };
    const griefs = [], manques = [];
    if (vide(f.risquesHarcelementEvalues)) manques.push("l'intégration des risques de harcèlement à l'évaluation des risques");
    else if (nie(f.risquesHarcelementEvalues)) griefs.push("les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes ne sont pas intégrés à la planification de la prévention, alors que L. 4121-2, 7°, l'impose expressément");
    if (vide(f.mesuresPreventionHarcelement)) manques.push("les dispositions de prévention prises");
    else if (nie(f.mesuresPreventionHarcelement)) griefs.push("aucune disposition de prévention n'est prise, alors que L. 1152-4 et L. 1153-5 imposent à l'employeur de prendre toutes dispositions nécessaires");
    if (griefs.length) return { etat: NC, motif: `La prévention du harcèlement n'est pas organisée : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `La prévention du harcèlement est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: RISQ, motif: "Des dispositions de prévention existent et les risques de harcèlement sont intégrés à l'évaluation. Leur suffisance s'apprécie au fond — ce contrôle constate l'existence des mesures, il ne dit jamais qu'elles suffisent : documentez leur contenu et leur mise en œuvre effective." };
  });

ctl("SST-CTL-HAR-05", "Harcèlement",
  "Un signalement de harcèlement a-t-il été suivi d'une réaction — enquête, mesures pour y mettre un terme ?",
  ["L. 1153-5", "L. 4121-1"],
  f => {
    const s = f.signalement || {};
    if (vide(s.recu)) return { etat: MANQ, motif: "Il n'est pas indiqué si un signalement de harcèlement moral ou sexuel a été reçu. La question conditionne l'obligation de réaction : l'employeur doit y mettre un terme et le sanctionner (L. 1153-5), au titre de son obligation de sécurité (L. 4121-1)." };
    if (nie(s.recu)) return { etat: SO, motif: "Aucun signalement de harcèlement déclaré : l'obligation de réaction n'a pas d'objet — la prévention, elle, est contrôlée par ailleurs." };
    const griefs = [], manques = [];
    if (vide(s.enqueteMenee)) manques.push("la conduite d'une enquête");
    else if (nie(s.enqueteMenee)) griefs.push("aucune enquête n'a été menée sur le signalement");
    if (vide(s.mesuresPrises)) manques.push("les mesures prises");
    else if (nie(s.mesuresPrises)) griefs.push("aucune mesure n'a été prise pour mettre un terme aux faits signalés");
    if (griefs.length) return { etat: NC, motif: `Un signalement de harcèlement est resté sans réaction : ${griefs.join(" ; ")}. L. 1153-5 impose de prévenir les faits, d'y mettre un terme et de les sanctionner, et L. 4121-1 impose à l'employeur de prendre les mesures nécessaires pour protéger la santé physique et mentale des travailleurs.` };
    if (manques.length) return { etat: MANQ, motif: `La réaction au signalement est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: RISQ, motif: "Le signalement a été suivi d'une enquête et de mesures. Leur qualité s'apprécie au fond : la valeur probante d'une enquête interne relève de l'appréciation souveraine des juges du fond, au regard le cas échéant des autres éléments de preuve (Soc., 18 juin 2025, n° 23-19.022, publié). Conservez le dossier d'enquête — saisine, auditions, rapport, suites." };
  });

/* ------------------------------------------------------------- l'exposition */

ctl("SST-CTL-PEN-01", "Exposition aux sanctions",
  "À quoi l'employeur s'expose-t-il en l'état du dossier ?",
  ["R. 4741-1", "L. 4741-1", "L. 1155-2"],
  f => {
    const du = f.duerp || {};
    const griefs = [];
    if (nie(du.existe)) griefs.push("l'absence de document unique — le défaut de transcription de l'évaluation des risques est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1)");
    const m = M.majDuerp(f);
    if (dit(du.existe) && m.annuelleDue === true && m.etat === "plus d'un an")
      griefs.push("le défaut de mise à jour du document unique — puni de la même amende (R. 4741-1)");
    const ev = f.evenement || {};
    if (dit(ev.survenu) && nie(ev.majFaite))
      griefs.push("l'absence de mise à jour après un aménagement important ou une information nouvelle (R. 4121-2 ; R. 4741-1)");
    const s = f.signalement || {};
    if (dit(s.recu) && (nie(s.enqueteMenee) || nie(s.mesuresPrises)))
      griefs.push("un signalement de harcèlement resté sans réaction — outre la responsabilité civile de l'employeur au titre de son obligation de sécurité (L. 4121-1), les discriminations commises à la suite d'un harcèlement sont punies d'un an d'emprisonnement et de 3 750 € d'amende (L. 1155-2)");
    if (griefs.length)
      return { etat: NC, motif: `L'exposition est constituée en l'état du dossier : ${griefs.join(" ; ")}. S'y ajoute, pour les règles techniques de santé et de sécurité qu'il énumère, l'article L. 4741-1 — 10 000 € d'amende, appliqués autant de fois qu'il y a de travailleurs concernés, et 30 000 € avec un an d'emprisonnement en récidive.` };
    if (vide(du.existe) || !m.effectif.connu)
      return { etat: MANQ, motif: "L'existence du document unique ou l'effectif ne sont pas renseignés : l'exposition ne peut pas être appréciée." };
    return { etat: RISQ, motif: "Aucun des manquements que ce module mesure n'est constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : l'obligation de sécurité de L. 4121-1 s'apprécie en continu et au fond, l'amende de L. 4741-1 sanctionne les règles techniques qu'il énumère (10 000 € par travailleur concerné), et les suites d'un harcèlement peuvent tomber sous L. 1155-2. Ce contrôle ne prononce jamais un blanc-seing." };
  });

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["SST-CTL-PEN-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE, MODALITES_CSSCT };

});

__def("./regularisation-sst.js", function(module, exports, require){
/* Ce qu'il faut faire quand un contrôle de la santé, de la sécurité et des
   conditions de travail ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger (l'exposition aux sanctions, qui ne se
   régularise pas pour elle-même), et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Une précaution propre à ce module : aucune sanction n'est annoncée qui ne
   soit dans un texte lu. R. 4741-1 punit le défaut de transcription et le
   défaut de mise à jour de l'évaluation des risques, dans les conditions des
   articles R. 4121-1 et R. 4121-2 — et rien d'autre. L'amende de L. 4741-1 vise
   les livres et titres que ce texte énumère, non les principes généraux de
   prévention : elle n'est donc pas invoquée ici pour le document unique.
   Aucune pénalité financière n'est prévue par les textes captés pour ce
   domaine : le degré 2 ne sert pas dans ce fichier, et c'est délibéré.

   CE QUI A CHANGÉ LE 24 AOÛT 2026. Le corpus a été complété par deux textes
   répressifs qui manquaient, lus à la source, deux lectures concordantes
   chacun, et versés dans textes-sst.json :
     L. 2317-1 (LEGIARTI000035634273) — l'entrave au comité social et
       économique. « Le fait d'apporter une entrave à leur fonctionnement
       régulier est puni d'une amende de 7 500 €. » Deux contrôles de ce
       module portent sur le comité et passent au degré 1 : la consultation
       sur le document unique (SST-CTL-DUE-07) et la commission santé,
       sécurité et conditions de travail qui n'est pas créée là où elle est
       due (SST-CTL-CSS-01). Le module CSE cite le même texte dans les mêmes
       termes, et cote ces deux points au même degré.
     R. 4741-3 (LEGIARTI000020398000) — les documents et affichages
       obligatoires. Il n'est invoqué nulle part : il est capté parce que son
       intitulé pouvait laisser croire qu'il atteignait l'avis d'accès au
       document unique de R. 4121-4, et la lecture montre qu'il ne l'atteint
       pas. Un texte capté pour fermer une hypothèse vaut un texte capté pour
       en ouvrir une.
   Ce qui n'a pas bougé n'a pas bougé par défaut de texte, et non par
   prudence : trois commentaires de bloc, devant SST-CTL-DUE-05,
   SST-CTL-CSS-02 et SST-CTL-HAR-01, disent article par article ce que les
   textes répressifs captés n'atteignent pas. Ils sont là pour qu'on ne
   « corrige » pas ces degrés sans avoir relu.

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-sst.json, et publier-sst.js confronte les deux. */

const { C } = require("./controles-sst.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

const R = {

  /* ------------------------------------------------------ le document unique */

  "SST-CTL-DUE-01": {
    gravite: 1,
    quoiFaire: "Évaluer les risques pour la santé et la sécurité des travailleurs, et en transcrire les résultats dans un document unique.",
    risque: "Le fait de ne pas transcrire les résultats de l'évaluation des risques dans les conditions prévues à R. 4121-1 est puni de l'amende prévue pour les contraventions de la cinquième classe, la récidive étant réprimée conformément aux articles 132-11 et 132-15 du code pénal (R. 4741-1). Le document unique est dû par tout employeur, sans seuil d'effectif.",
    delai: "Un à trois mois : l'évaluation se conduit unité de travail par unité de travail, et elle ne se rattrape pas en une journée.",
    document: "Document unique d'évaluation des risques professionnels — inventaire par unité de travail",
    etapes: [
      "Recenser les unités de travail de l'entreprise ou de l'établissement : c'est la maille que R. 4121-1 impose à l'inventaire, et c'est elle qui commande tout le reste.",
      "Évaluer, pour chacune, les risques pour la santé et la sécurité des travailleurs — y compris dans le choix des procédés de fabrication, des équipements de travail, des substances ou préparations chimiques, dans l'aménagement des lieux et des installations, dans l'organisation du travail et dans la définition des postes (L. 4121-3) — en tenant compte de l'impact différencié de l'exposition au risque en fonction du sexe.",
      "Appeler les contributions que L. 4121-3 prévoit : celle du comité social et économique et de sa commission santé, sécurité et conditions de travail s'ils existent, celle du ou des salariés désignés pour s'occuper des activités de protection et de prévention s'ils ont été désignés, celle du service de prévention et de santé au travail auquel l'employeur adhère.",
      "Transcrire les résultats dans le document unique : il répertorie l'ensemble des risques professionnels auxquels les travailleurs sont exposés et assure la traçabilité collective de ces expositions (L. 4121-3-1, I et II).",
      "En tirer les suites que le III de L. 4121-3-1 commande — programme annuel de prévention à partir de cinquante salariés, liste d'actions consignée en deçà — puis consulter le comité (L. 4121-3, 1°), transmettre le document au service de prévention et de santé au travail (L. 4121-3-1, VI) et le conserver (L. 4121-3-1, V) : chacun de ces points est contrôlé pour lui-même.",
    ],
    verifs: [
      { cle: "due01Piece", question: "Où se trouve le document unique, et de quand date la version en vigueur ?", attendu: "Le document lui-même, daté. Un projet, un modèle vierge ou un document de branche non repris ne vaut pas transcription." },
      { cle: "due01Perimetre", question: "Quels établissements et quelles unités de travail ce document couvre-t-il ?", attendu: "La liste des unités couvertes, confrontée à l'organisation réelle de l'entreprise." },
      { cle: "due01Contributions", question: "Quelles contributions ont nourri l'évaluation — comité, salarié désigné, service de prévention et de santé au travail ?", attendu: "Les avis, comptes rendus ou échanges, datés (L. 4121-3)." },
    ],
  },

  "SST-CTL-DUE-02": {
    gravite: 1,
    quoiFaire: "Reprendre le document unique pour qu'il comporte l'inventaire des risques identifiés dans chaque unité de travail.",
    risque: "R. 4741-1 punit de l'amende prévue pour les contraventions de la cinquième classe le fait de ne pas transcrire les résultats de l'évaluation dans les conditions prévues aux articles R. 4121-1 et R. 4121-2 — et l'inventaire par unité de travail est l'une de ces conditions. Un document global, sans maille, ne vaut pas transcription.",
    delai: "Deux à six semaines si le document existe déjà : c'est la maille qu'il faut reprendre, non l'évaluation entière.",
    document: "Inventaire des risques par unité de travail, annexé au document unique",
    etapes: [
      "Arrêter la liste des unités de travail : postes, ateliers, services, sites — la découpe doit refléter les situations d'exposition réelles, non l'organigramme.",
      "Pour chaque unité, identifier les risques et les consigner distinctement, sans renvoyer à un inventaire commun : R. 4121-1 exige un inventaire dans chaque unité.",
      "Ne pas omettre les risques liés aux ambiances thermiques, que R. 4121-1 mentionne expressément, ni les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes, que L. 4121-2, 7°, fait entrer dans la planification de la prévention.",
      "Tenir compte de l'impact différencié de l'exposition au risque en fonction du sexe (L. 4121-3).",
      "Réintégrer l'inventaire au document unique, dater la nouvelle version et conserver la précédente (L. 4121-3-1, V).",
    ],
    verifs: [
      { cle: "due02Unites", question: "Quelles sont les unités de travail retenues, et sur quoi repose ce découpage ?", attendu: "La liste des unités et la logique du découpage, confrontées aux situations de travail réelles." },
      { cle: "due02Inventaire", question: "Chaque unité a-t-elle son propre inventaire de risques dans le document ?", attendu: "Le document, ouvert à la section d'une unité prise au hasard." },
      { cle: "due02Thermiques", question: "Les risques liés aux ambiances thermiques figurent-ils à l'inventaire ?", attendu: "La mention dans les unités concernées ; R. 4121-1 les vise expressément." },
    ],
  },

  "SST-CTL-DUE-03": {
    gravite: 1,
    quoiFaire: "Mettre à jour le document unique et dater la nouvelle version.",
    risque: "Le fait de ne pas mettre à jour les résultats de l'évaluation des risques dans les conditions prévues aux articles R. 4121-1 et R. 4121-2 est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1). Dans les entreprises d'au moins onze salariés, la mise à jour est due au moins chaque année (R. 4121-2, 1°).",
    delai: "Deux à quatre semaines : le retard se compte à partir de la date de la dernière version, et il ne cesse qu'avec la version nouvelle.",
    document: "Mise à jour du document unique — version datée et suites revues",
    etapes: [
      "Relever la date de la version en vigueur : c'est d'elle que court l'année de R. 4121-2, 1°.",
      "Reprendre l'inventaire unité par unité, en intégrant ce qui a changé depuis — postes, équipements, procédés, effectifs, organisation.",
      "Dans une entreprise de moins de onze salariés, où la mise à jour peut être moins fréquente qu'annuelle, écrire ce qui garantit un niveau équivalent de protection de la santé et de la sécurité des travailleurs (L. 4121-3, dernier alinéa) : cette garantie s'apprécie au fond, elle ne se présume pas.",
      "Mettre à jour, si nécessaire, le programme annuel de prévention ou la liste des actions de prévention et de protection : R. 4121-2 impose que cette révision se fasse à chaque mise à jour du document unique.",
      "Dater la nouvelle version sans écraser la précédente (L. 4121-3-1, V), consulter le comité social et économique (L. 4121-3, 1°) et transmettre le document au service de prévention et de santé au travail (L. 4121-3-1, VI).",
    ],
    verifs: [
      { cle: "due03DateMaj", question: "À quelle date la dernière mise à jour du document unique a-t-elle été faite ?", attendu: "La date portée sur la version elle-même, et non celle d'une réunion ou d'un courriel." },
      { cle: "due03Effectif", question: "Quel est l'effectif de l'entreprise, et depuis quand ?", attendu: "L'effectif : à partir de onze salariés, la mise à jour est au moins annuelle (R. 4121-2, 1°)." },
      { cle: "due03Suites", question: "Le programme annuel de prévention ou la liste des actions a-t-il été revu à cette occasion ?", attendu: "La version revue, ou la raison écrite pour laquelle la révision n'était pas nécessaire (R. 4121-2, dernier alinéa)." },
    ],
  },

  "SST-CTL-DUE-04": {
    gravite: 1,
    quoiFaire: "Mettre à jour le document unique à la suite de l'aménagement important ou de l'information nouvelle survenus.",
    risque: "R. 4121-2 impose la mise à jour lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur. Le défaut de mise à jour dans ces conditions est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1).",
    delai: "Deux à quatre semaines à compter de la décision ou de l'information : ce cas de mise à jour ne suit pas le calendrier annuel, il suit l'événement.",
    document: "Mise à jour événementielle du document unique — décision ou information à l'origine",
    etapes: [
      "Dater et qualifier l'événement : décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail (R. 4121-2, 2°), ou information supplémentaire intéressant l'évaluation d'un risque portée à la connaissance de l'employeur (R. 4121-2, 3°).",
      "Identifier les unités de travail que l'événement touche, et n'en réévaluer que ce qui a changé : la mise à jour n'est pas la réécriture du document.",
      "Reprendre l'inventaire de ces unités et le transcrire dans une version nouvelle et datée.",
      "Réviser en conséquence le programme annuel de prévention ou la liste des actions de prévention et de protection (R. 4121-2, dernier alinéa).",
      "Consulter le comité social et économique sur cette mise à jour (L. 4121-3, 1°) et la transmettre au service de prévention et de santé au travail (L. 4121-3-1, VI).",
    ],
    verifs: [
      { cle: "due04Evenement", question: "Quel aménagement important ou quelle information nouvelle est survenu, et à quelle date ?", attendu: "La nature de l'événement et sa date — décision d'investissement, réorganisation, accident, alerte, signalement." },
      { cle: "due04MajFaite", question: "À quelle date la version du document unique postérieure à cet événement a-t-elle été établie ?", attendu: "La version datée après l'événement. Une version antérieure ne peut pas en tenir compte." },
      { cle: "due04Portee", question: "Quelles unités de travail cette mise à jour a-t-elle touchées ?", attendu: "Les sections modifiées, comparées à la version précédente." },
    ],
  },

  /* CE QUE LES TEXTES RÉPRESSIFS CAPTÉS N'ATTEIGNENT PAS, DANS CE BLOC.
     R. 4741-1 ne punit qu'une chose : le défaut de transcription et le défaut
     de mise à jour « dans les conditions prévues aux articles R. 4121-1 et
     R. 4121-2 ». Il ne va pas plus loin. Ne sont donc atteints ni le III de
     L. 4121-3-1 (programme annuel ou liste d'actions, SST-CTL-DUE-05), ni son
     V et R. 4121-4 (conservation des versions et avis d'accès affiché,
     SST-CTL-DUE-06), ni son VI (transmission au service de prévention et de
     santé au travail, SST-CTL-DUE-08).
     L. 4741-1 ne les rattrape pas non plus : son énumération vise, pour le
     livre Ier de la quatrième partie, les « Titres Ier, III et IV » — le titre
     II, celui des principes généraux de prévention où vivent L. 4121-1 à
     L. 4121-3-1, en est absent. C'est la lecture qu'un auteur du module avait
     déjà faite ; elle a été refaite à la source le 24 août 2026 et elle tient.
     R. 4741-3 ne les rattrape pas davantage, quoique son objet — « les
     documents et affichages obligatoires » — puisse le laisser croire. Son
     énumération, lue à la source le 24 août 2026 et versée telle quelle dans
     textes-sst.json, est close : « les articles L. 4711-1 à L. 4711-5 ainsi
     que […] les articles D. 4711-1 à D. 4711-3 ». R. 4121-4, qui porte l'avis
     d'accès au document unique, n'y est pas, et aucun de ces numéros n'est
     celui d'un article du titre II du livre Ier. Le contenu de ces huit
     articles n'a pas été capté ici : il n'a pas à l'être, puisque c'est
     l'énumération, et elle seule, qui décide de la portée du texte pénal.
     Ces trois contrôles restent donc au degré 3 ou 4. Ce n'est pas un oubli :
     c'est le résultat de la lecture. */

  "SST-CTL-DUE-05": {
    gravite: 3,
    quoiFaire: "Faire déboucher l'évaluation sur ce que le seuil commande : programme annuel de prévention à partir de cinquante salariés, liste d'actions consignée dans le document unique en deçà.",
    risque: "Sans programme ni liste d'actions, l'évaluation ne débouche sur rien et le III de L. 4121-3-1 n'est pas satisfait. Dans les entreprises d'au moins cinquante salariés, le procès-verbal de la réunion du comité consacrée à l'examen du rapport et du programme annuels est joint à toute demande présentée en vue d'obtenir des marchés publics, des participations publiques, des subventions, des primes de toute nature ou des avantages sociaux ou fiscaux (L. 2312-27) : sans programme examiné, ces demandes sont incomplètes.",
    delai: "Un mois : le programme suppose de chiffrer chaque mesure et de la caler dans un calendrier.",
    document: "Programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail (à partir de cinquante salariés), ou liste des actions de prévention consignée au document unique",
    etapes: [
      "Vérifier l'effectif : à partir de cinquante salariés, c'est le programme annuel du 1° du III de L. 4121-3-1 ; en deçà, c'est la définition d'actions de prévention des risques et de protection des salariés, dont la liste est consignée dans le document unique et ses mises à jour (2° du même III).",
      "Pour le programme : fixer la liste détaillée des mesures devant être prises au cours de l'année à venir, y compris les mesures de prévention des effets de l'exposition aux facteurs de risques professionnels, et pour chaque mesure ses conditions d'exécution, des indicateurs de résultat et l'estimation de son coût.",
      "Y identifier les ressources de l'entreprise pouvant être mobilisées et y joindre un calendrier de mise en œuvre : L. 4121-3-1, III, 1°, exige les trois éléments ensemble.",
      "Le présenter au comité social et économique dans le cadre de la consultation sur la politique sociale, avec le rapport annuel écrit faisant le bilan de la situation générale de la santé, de la sécurité et des conditions de travail (L. 2312-27) — le comité peut proposer un ordre de priorité et l'adoption de mesures supplémentaires.",
      "Si des mesures prévues par l'employeur ou demandées par le comité n'ont pas été prises au cours de l'année concernée, en énoncer les motifs en annexe au rapport annuel (L. 2312-27).",
      "Pour la liste d'actions, en deçà de cinquante salariés : la consigner dans le document unique lui-même et dans chacune de ses mises à jour, et non dans un document séparé.",
    ],
    verifs: [
      { cle: "due05Regime", question: "Quel est l'effectif, et quel régime en découle — programme annuel ou liste d'actions consignée ?", attendu: "L'effectif, et la pièce correspondante." },
      { cle: "due05Contenu", question: "Le programme fixe-t-il, mesure par mesure, ses conditions d'exécution, ses indicateurs de résultat et l'estimation de son coût ?", attendu: "Le programme, ouvert sur une mesure prise au hasard : les trois éléments doivent y figurer." },
      { cle: "due05Calendrier", question: "Le programme identifie-t-il les ressources mobilisables et comporte-t-il un calendrier de mise en œuvre ?", attendu: "Les deux sections ; L. 4121-3-1, III, 1°, les exige au même titre que la liste des mesures." },
      { cle: "due05Cse", question: "À quelle date le programme a-t-il été présenté au comité social et économique, et quel avis a-t-il rendu ?", attendu: "Le procès-verbal de la réunion consacrée à l'examen du rapport et du programme annuels (L. 2312-27)." },
    ],
  },

  "SST-CTL-DUE-06": {
    gravite: 3,
    quoiFaire: "Conserver les versions successives du document unique et afficher l'avis indiquant les modalités d'accès des travailleurs.",
    risque: "Les versions successives doivent être conservées et tenues à la disposition des travailleurs, des anciens travailleurs et de toute personne ou instance pouvant justifier d'un intérêt à y avoir accès, pendant une durée qui ne peut être inférieure à quarante ans à compter de leur élaboration (L. 4121-3-1, V ; R. 4121-4). Sans elles, la traçabilité collective des expositions que le document unique doit assurer est perdue, et l'employeur ne peut répondre ni à la demande d'un ancien salarié ni à celle d'un agent de contrôle.",
    delai: "Quelques jours pour l'avis d'affichage ; un mois pour organiser la conservation.",
    document: "Avis d'affichage des modalités d'accès au document unique, et protocole de conservation des versions successives",
    etapes: [
      "Rassembler les versions successives du document unique et les conserver, sur papier ou sous forme dématérialisée, sans écraser les précédentes : chacune doit rester lisible pendant quarante ans au moins à compter de son élaboration (R. 4121-4).",
      "Organiser leur mise à disposition au profit des personnes et instances que R. 4121-4 énumère : travailleurs et anciens travailleurs pour les versions en vigueur durant leur période d'activité, membres de la délégation du personnel du comité social et économique, service de prévention et de santé au travail, agents du système d'inspection du travail, agents des services de prévention des organismes de sécurité sociale, agents des organismes professionnels de santé, de sécurité et des conditions de travail, inspecteurs de la radioprotection pour ce qui concerne l'exposition aux rayonnements ionisants.",
      "Prévoir que la communication des versions antérieures à un travailleur ou à un ancien travailleur peut être limitée aux seuls éléments afférents à son activité, et qu'il peut communiquer ces éléments aux professionnels de santé chargés de son suivi médical (R. 4121-4, 1°).",
      "Afficher l'avis indiquant les modalités d'accès des travailleurs au document unique, à une place convenable et aisément accessible dans les lieux de travail — au même emplacement que le règlement intérieur lorsqu'il en existe un (R. 4121-4, dernier alinéa).",
      "Consigner par écrit où se trouvent les versions, qui en donne l'accès et sous quel délai une demande est traitée.",
    ],
    verifs: [
      { cle: "due06Versions", question: "Quelles versions successives du document unique sont conservées, et depuis quelle année ?", attendu: "La liste des versions, chacune datée et consultable." },
      { cle: "due06Duree", question: "Comment la conservation pendant quarante ans au moins est-elle assurée ?", attendu: "Le support, le lieu et le responsable — une sauvegarde écrasée à chaque mise à jour ne satisfait pas R. 4121-4." },
      { cle: "due06Avis", question: "Où l'avis indiquant les modalités d'accès est-il affiché, et depuis quand ?", attendu: "L'emplacement — celui du règlement intérieur là où il en existe un — et la date." },
      { cle: "due06Demande", question: "Comment une demande d'accès d'un ancien travailleur serait-elle traitée aujourd'hui ?", attendu: "La procédure écrite, et le nom de la personne qui la met en œuvre." },
    ],
  },

  "SST-CTL-DUE-07": {
    gravite: 1,
    quoiFaire: "Consulter le comité social et économique sur le document unique et sur chacune de ses mises à jour.",
    risque: "L. 4121-3, 1°, impose que le comité social et économique soit consulté sur le document unique d'évaluation des risques professionnels et sur ses mises à jour. Faute de consultation, le comité et sa commission sont privés de la contribution à l'évaluation des risques que le texte leur reconnaît, et le document adopté sans avis est contestable. Le manquement n'est pas seulement civil : « le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1). La consultation que la loi impose et qui n'a pas eu lieu expose l'employeur à cette qualification, qu'il appartient au juge de retenir ou d'écarter.",
    delai: "Le temps d'une réunion, convoquée selon les règles propres au comité.",
    document: "Ordre du jour et procès-verbal de la consultation du comité sur le document unique",
    etapes: [
      "Transmettre aux membres du comité le document unique — ou la mise à jour soumise — avant la réunion, de manière qu'ils puissent en prendre connaissance.",
      "Inscrire la consultation à l'ordre du jour, en la distinguant de la présentation du rapport et du programme annuels de L. 2312-27 : ce sont deux points différents.",
      "Recueillir l'avis du comité et le consigner au procès-verbal, avec la date de la réunion et la version soumise.",
      "Recommencer à chaque mise à jour : L. 4121-3, 1°, vise le document unique « et ses mises à jour », sans distinguer.",
      "Conserver les procès-verbaux avec les versions correspondantes du document.",
    ],
    verifs: [
      { cle: "due07Date", question: "À quelle date le comité a-t-il été consulté sur la version en vigueur du document unique ?", attendu: "La date de la réunion et l'ordre du jour la portant." },
      { cle: "due07Avis", question: "Quel avis le comité a-t-il rendu, et où figure-t-il ?", attendu: "Le procès-verbal. Une simple information portée au comité n'est pas une consultation." },
      { cle: "due07MisesAJour", question: "Les mises à jour successives ont-elles chacune été soumises au comité ?", attendu: "La correspondance entre la liste des versions et la liste des consultations." },
    ],
  },

  "SST-CTL-DUE-08": {
    gravite: 4,
    quoiFaire: "Transmettre le document unique au service de prévention et de santé au travail auquel l'entreprise adhère, à chaque mise à jour.",
    risque: "L. 4121-3-1, VI, impose cette transmission à chaque mise à jour. Sans elle, le service ne dispose pas de la pièce sur laquelle repose la contribution à l'évaluation des risques que L. 4121-3 lui reconnaît.",
    delai: "Quelques jours : un envoi, et la preuve de cet envoi.",
    document: "Bordereau de transmission du document unique au service de prévention et de santé au travail",
    etapes: [
      "Identifier le service de prévention et de santé au travail auquel l'employeur adhère, et le canal de transmission qu'il accepte.",
      "Lui transmettre la version en vigueur du document unique, et conserver la preuve de l'envoi et sa date.",
      "Inscrire cette transmission dans la procédure de mise à jour du document, pour qu'elle se répète à chaque nouvelle version sans qu'il faille y penser (L. 4121-3-1, VI).",
    ],
    verifs: [
      { cle: "due08Service", question: "À quel service de prévention et de santé au travail l'entreprise adhère-t-elle ?", attendu: "Le nom du service et la preuve de l'adhésion." },
      { cle: "due08DerniereTransmission", question: "À quelle date la dernière version du document unique lui a-t-elle été transmise ?", attendu: "La date et la preuve de l'envoi, comparées à la date de la version." },
      { cle: "due08Systematique", question: "Qu'est-ce qui garantit que la transmission se refera à la prochaine mise à jour ?", attendu: "La procédure écrite, ou la personne nommément chargée de l'envoi." },
    ],
  },

  /* ----------------------------------------------------------------- la CSSCT */

  "SST-CTL-CSS-01": {
    gravite: 1,
    quoiFaire: "Créer la commission santé, sécurité et conditions de travail au sein du comité social et économique.",
    risque: "La commission est créée dans les entreprises et les établissements distincts d'au moins trois cents salariés ainsi que dans les établissements mentionnés aux articles L. 4521-1 et suivants (L. 2315-36) ; en deçà de trois cents salariés, l'inspecteur du travail peut en imposer la création lorsque cette mesure est nécessaire, notamment en raison de la nature des activités, de l'agencement ou de l'équipement des locaux (L. 2315-37). Là où elle est due et n'existe pas, les attributions du comité en matière de santé, de sécurité et de conditions de travail ne sont pas organisées et l'obligation reste ouverte. « Le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1) : la commission absente là où elle est due expose l'employeur à cette qualification. Le module CSE cote le même manquement au même degré, dans les mêmes termes (CSE-CTL-SST-01).",
    delai: "Deux à trois mois : il faut d'abord ce qui fixe les modalités, puis la résolution de désignation.",
    document: "Accord de mise en place de la commission santé, sécurité et conditions de travail, et résolution de désignation de ses membres",
    etapes: [
      "Établir sur quel fondement la commission est due : effectif d'au moins trois cents salariés dans l'entreprise ou dans un établissement distinct, établissement mentionné aux articles L. 4521-1 et suivants (L. 2315-36), ou décision de l'inspecteur du travail (L. 2315-37).",
      "Fixer les modalités de mise en place : accord d'entreprise (L. 2315-41), accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus en l'absence de délégué syndical (L. 2315-42), ou, à défaut d'accord, règlement intérieur du comité (L. 2315-44). Hors des cas où elle est due, l'accord peut aussi en fixer le nombre et le périmètre (L. 2315-43).",
      "Faire désigner les membres par le comité, parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32 — à la majorité des membres présents, le président ne participant pas au vote.",
      "Respecter la composition de L. 2315-39 : présidence par l'employeur ou son représentant, trois membres représentants du personnel au minimum, dont au moins un représentant du second collège ou, le cas échéant, du troisième.",
      "Arrêter par écrit la délégation confiée à la commission, dans les limites de L. 2315-38, et réunir la commission.",
    ],
    verifs: [
      { cle: "css01Fondement", question: "Sur quel fondement la commission est-elle due ici — effectif, établissement à hauts risques, décision de l'inspecteur ?", attendu: "L'effectif de l'entreprise et de chaque établissement distinct, ou la décision de l'inspecteur du travail." },
      { cle: "css01Creation", question: "À quelle date la commission a-t-elle été mise en place ?", attendu: "L'accord ou le règlement intérieur qui la crée, et la résolution de désignation." },
      { cle: "css01Perimetre", question: "Combien de commissions existent, et sur quel périmètre chacune ?", attendu: "Le périmètre retenu, confronté à la liste des établissements distincts d'au moins trois cents salariés." },
    ],
  },

  /* CE QUE L. 2317-1 N'ATTEINT PAS, DANS CE BLOC.
     L. 2317-1 punit deux choses, et deux seulement : l'entrave à la
     constitution du comité ou à la libre désignation de ses membres, et
     l'entrave à son fonctionnement régulier. La commission qui n'est pas
     créée là où elle est due relève du second cas — c'est SST-CTL-CSS-01, coté
     1. Les cinq contrôles qui suivent portent sur autre chose : la composition
     de la commission (CSS-02), les modalités fixées par accord ou par le
     règlement intérieur du comité (CSS-03), les limites de la délégation
     (CSS-04), la formation des élus (CSS-05), le remplacement des membres
     avant terme (CSS-06). Ce sont des irrégularités que le juge annule, non
     des faits que le texte pénal désigne, et l'employeur n'en est même pas
     toujours l'auteur : la désignation et le remplacement des membres
     appartiennent au comité. Ils restent au degré 3 ou 4 — c'est aussi la
     cotation que le module CSE retient pour les mêmes points. */

  "SST-CTL-CSS-02": {
    gravite: 3,
    quoiFaire: "Rétablir la composition de la commission telle que L. 2315-39 l'impose, et refaire la désignation si elle est irrégulière.",
    risque: "Les dispositions de L. 2315-39 sont d'ordre public : un accord ne peut ni les écarter ni les réécrire, et une stipulation attribuant un siège à chaque organisation syndicale par ordre de représentativité ne peut s'entendre comme imposant une désignation proportionnelle au résultat électoral (Soc., 11 février 2026, n° 24-16.408). Là où un troisième collège est institué en application de L. 2314-11, un siège au moins doit revenir à un élu du comité qui le représente (Soc., 26 février 2025, n° 24-12.295). La désignation qui méconnaît ces règles encourt l'annulation.",
    delai: "Le temps d'une réunion du comité : la désignation se refait par résolution.",
    document: "Résolution du comité désignant les membres de la commission — composition conforme à L. 2315-39",
    etapes: [
      "Vérifier la présidence : la commission est présidée par l'employeur ou son représentant, qui peut se faire assister de collaborateurs appartenant à l'entreprise et choisis en dehors du comité, sans qu'ensemble ils soient en nombre supérieur à celui des représentants du personnel titulaires (L. 2315-39).",
      "Vérifier le nombre : trois membres représentants du personnel au minimum, désignés par le comité parmi ses membres.",
      "Vérifier les collèges : au moins un représentant du second collège ou, le cas échéant, du troisième collège prévu à L. 2314-11 ; là où un troisième collège est institué, un siège au moins lui revient (Soc., 26 février 2025, n° 24-12.295).",
      "Refaire la désignation par une résolution du comité adoptée selon les modalités de L. 2315-32 : un vote des membres présents à la majorité, sans qu'il soit besoin d'une résolution préalable fixant les modalités de l'élection (Soc., 27 novembre 2019, n° 19-14.224).",
      "Écarter toute stipulation d'accord qui imposerait une répartition des sièges proportionnelle au résultat électoral de chaque syndicat : une telle lecture est contraire à L. 2315-32 et L. 2315-39 (Soc., 11 février 2026, n° 24-16.408).",
      "Rappeler par écrit aux membres, et aux collaborateurs qui assistent l'employeur, le secret professionnel et l'obligation de discrétion que L. 2315-39 leur rend applicables.",
    ],
    verifs: [
      { cle: "css02Presidence", question: "Qui préside la commission, et à quel titre ?", attendu: "L'employeur ou son représentant, avec l'acte qui donne cette qualité." },
      { cle: "css02Nombre", question: "Combien de représentants du personnel siègent à la commission ?", attendu: "Le nombre : trois au minimum (L. 2315-39)." },
      { cle: "css02College", question: "Quel membre représente le second collège — ou le troisième là où il est institué ?", attendu: "Le nom et le collège d'élection, tirés des résultats des dernières élections." },
      { cle: "css02Resolution", question: "Où figure la résolution du comité désignant les membres, et à quelle date a-t-elle été adoptée ?", attendu: "Le procès-verbal portant la résolution et le décompte des voix (L. 2315-32)." },
    ],
  },

  "SST-CTL-CSS-03": {
    gravite: 4,
    quoiFaire: "Faire fixer par écrit les modalités de mise en place et de fonctionnement de la commission — accord d'entreprise, accord avec le comité, ou règlement intérieur du comité à défaut.",
    risque: "En l'absence d'accord d'entreprise (L. 2315-41) et d'accord entre l'employeur et le comité (L. 2315-42), c'est au règlement intérieur du comité de définir les six points énumérés par L. 2315-41 (L. 2315-44). Tant que rien ne les fixe, ni les missions déléguées, ni les heures de délégation, ni la formation des membres ne sont établies, et la commission ne peut démontrer ce qu'elle est en droit de faire.",
    delai: "Une réunion du comité pour un règlement intérieur ; deux à trois mois si un accord est négocié.",
    document: "Accord d'entreprise, accord avec le comité ou règlement intérieur fixant les six points de L. 2315-41",
    etapes: [
      "Choisir la source : accord d'entreprise défini à L. 2313-2 (L. 2315-41) ; à défaut de délégué syndical, accord entre l'employeur et le comité adopté à la majorité des membres titulaires élus de la délégation du personnel (L. 2315-42) ; à défaut d'accord, règlement intérieur du comité (L. 2315-44).",
      "Y définir les six points de L. 2315-41 : le nombre de membres ; les missions déléguées par le comité et leurs modalités d'exercice ; les modalités de fonctionnement, notamment le nombre d'heures de délégation ; les modalités de formation conformément aux articles L. 2315-16 à L. 2315-18 ; le cas échéant, les moyens alloués ; le cas échéant, les conditions d'une formation spécifique correspondant aux risques ou facteurs de risques particuliers en rapport avec l'activité de l'entreprise.",
      "Vérifier que les missions déléguées restent dans les limites de L. 2315-38 : ni le recours à un expert, ni les attributions consultatives du comité.",
      "Notifier le texte aux membres de la commission et le verser au dossier : c'est lui qui prouvera l'étendue de la délégation.",
    ],
    verifs: [
      { cle: "css03Source", question: "Qu'est-ce qui fixe les modalités de la commission — accord d'entreprise, accord avec le comité, ou règlement intérieur ?", attendu: "Le texte lui-même, daté et signé ou adopté." },
      { cle: "css03Points", question: "Ce texte couvre-t-il les six points de L. 2315-41 ?", attendu: "Le texte, point par point : nombre de membres, missions déléguées, fonctionnement, formation, moyens, formation spécifique." },
      { cle: "css03Heures", question: "Quel nombre d'heures de délégation les membres de la commission ont-ils pour l'exercice de leurs missions ?", attendu: "Le nombre écrit, tel que L. 2315-41, 3°, le fait fixer." },
    ],
  },

  "SST-CTL-CSS-04": {
    gravite: 3,
    quoiFaire: "Ramener la délégation confiée à la commission dans les limites de L. 2315-38.",
    risque: "L. 2315-38 est d'ordre public : la commission reçoit, par délégation du comité, tout ou partie des attributions relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert et des attributions consultatives du comité (Soc., 13 mai 2026, n° 25-12.560). Un avis rendu par la seule commission, ou une expertise qu'elle aurait décidée, est irrégulier — et l'accord qui l'aurait prévu ne peut pas y suppléer.",
    delai: "Le temps de reprendre l'accord ou le règlement intérieur : une réunion.",
    document: "Avenant à l'accord, ou modification du règlement intérieur, ramenant la délégation dans les limites de L. 2315-38",
    etapes: [
      "Relire ligne à ligne la délégation écrite et en retirer ce que L. 2315-38 interdit de déléguer : le recours à un expert et les attributions consultatives du comité.",
      "Faire adopter la modification par la voie qui a fixé les modalités — avenant à l'accord, ou délibération modifiant le règlement intérieur du comité.",
      "Réorganiser le circuit : la commission instruit et propose, le comité consulte et décide. Le comité peut décider d'une expertise, le cas échéant sur proposition des commissions constituées en son sein — la proposition appartient à la commission, la décision reste au comité (Soc., 18 mars 2026, n° 23-22.270).",
      "Reprendre, s'il y a lieu, les avis déjà rendus par la seule commission en les faisant délibérer par le comité, afin qu'ils ne soient pas discutés plus tard pour ce motif.",
    ],
    verifs: [
      { cle: "css04Texte", question: "Que dit exactement le texte qui fixe les missions déléguées à la commission ?", attendu: "La clause de délégation, lue mot à mot." },
      { cle: "css04Expert", question: "Qui a décidé des expertises intervenues depuis la mise en place de la commission ?", attendu: "Les délibérations : la décision doit émaner du comité (L. 2315-38)." },
      { cle: "css04Avis", question: "Les avis rendus en matière de santé, de sécurité et de conditions de travail l'ont-ils été par le comité lui-même ?", attendu: "Les procès-verbaux du comité portant ces avis, et non ceux de la commission." },
    ],
  },

  "SST-CTL-CSS-05": {
    gravite: 3,
    quoiFaire: "Faire bénéficier les élus, et le référent harcèlement du comité, de la formation santé, sécurité et conditions de travail.",
    risque: "L. 2315-18 impose la formation nécessaire à l'exercice des missions en matière de santé, de sécurité et de conditions de travail : cinq jours au minimum lors du premier mandat, trois jours en cas de renouvellement pour chaque membre quelle que soit la taille de l'entreprise, cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés. Son financement est pris en charge par l'employeur. Un élu non formé exerce des missions pour lesquelles la loi le veut préparé, et l'entreprise se prive de l'apport que le texte organise.",
    delai: "Une à deux sessions à programmer : compter le délai d'inscription auprès de l'organisme.",
    document: "Plan de formation santé, sécurité et conditions de travail des élus et du référent harcèlement",
    etapes: [
      "Recenser les bénéficiaires : les membres de la délégation du personnel du comité social et économique et le référent prévu au dernier alinéa de L. 2314-1 (L. 2315-18).",
      "Déterminer la durée due, élu par élu : cinq jours au minimum lors du premier mandat ; en cas de renouvellement, trois jours pour chaque membre de la délégation du personnel quelle que soit la taille de l'entreprise, et cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés.",
      "Programmer les sessions et en assurer le financement, qui est pris en charge par l'employeur (L. 2315-18).",
      "Vérifier ce que l'accord ou le règlement intérieur prévoit sur les modalités de formation des membres de la commission (L. 2315-41, 4°), et sur la formation spécifique correspondant aux risques particuliers de l'activité (L. 2315-41, 6°).",
      "Conserver les attestations de formation, élu par élu : c'est la seule pièce qui établira la durée suivie.",
    ],
    verifs: [
      { cle: "css05Beneficiaires", question: "Quels élus ont suivi la formation, et lesquels ne l'ont pas suivie ?", attendu: "La liste nominative, confrontée à la composition du comité." },
      { cle: "css05Durees", question: "Quelle durée chacun a-t-il suivie, et s'agissait-il d'un premier mandat ou d'un renouvellement ?", attendu: "Le nombre de jours par élu, rapporté au minimum applicable (L. 2315-18)." },
      { cle: "css05Commission", question: "Les membres de la commission ont-ils reçu la durée qui leur est propre dans les entreprises d'au moins trois cents salariés ?", attendu: "Cinq jours en cas de renouvellement, attestations à l'appui." },
      { cle: "css05Referent", question: "Le référent harcèlement du comité a-t-il été formé ?", attendu: "Son attestation ; L. 2315-18 le vise expressément." },
    ],
  },

  "SST-CTL-CSS-06": {
    gravite: 3,
    quoiFaire: "Reprendre tout remplacement de membre de la commission intervenu hors des cas de fin anticipée de mandat.",
    risque: "Sauf dans les cas de fin anticipée de mandat énumérés à L. 2314-33 — décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible — le comité ne peut pas remplacer les membres de la commission initialement désignés avant le terme du mandat des membres élus du comité, et aucun accord d'entreprise ne peut y déroger (Soc., 28 mai 2026, n° 24-22.914). La délibération de remplacement encourt l'annulation.",
    delai: "Immédiat : c'est la délibération elle-même qu'il faut reprendre.",
    document: "Délibération du comité rapportant le remplacement irrégulier et rétablissant le membre désigné",
    etapes: [
      "Reprendre chaque remplacement intervenu depuis la désignation initiale et en identifier la cause exacte, telle qu'elle figure au procès-verbal.",
      "Confronter cette cause aux fins anticipées de mandat de L. 2314-33 : décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible. Toute autre cause — perte de confiance, changement d'équipe, arrangement entre organisations — ne permet pas le remplacement.",
      "Pour un remplacement sans cause admise, faire rapporter la délibération par le comité et rétablir le membre initialement désigné : son mandat court jusqu'au terme de celui des membres élus du comité (L. 2315-39).",
      "Écarter la stipulation d'accord qui autoriserait ces remplacements : elle ne peut pas déroger à la règle (Soc., 28 mai 2026, n° 24-22.914).",
      "Faire consigner au procès-verbal, pour chaque remplacement à venir, la cause invoquée et la pièce qui l'établit.",
    ],
    verifs: [
      { cle: "css06Liste", question: "Quels membres de la commission ont été remplacés depuis la désignation initiale, et à quelles dates ?", attendu: "La liste des délibérations de remplacement." },
      { cle: "css06Cause", question: "Pour chacun, quelle cause a été retenue, et quelle pièce l'établit ?", attendu: "La cause et sa pièce : lettre de démission, rupture du contrat, perte d'éligibilité, acte de décès (L. 2314-33)." },
      { cle: "css06Composition", question: "La composition actuelle correspond-elle à la désignation initiale, corrigée des seules fins anticipées de mandat ?", attendu: "La composition, rapprochée de la résolution initiale." },
    ],
  },

  /* ------------------------------------------------------------ le harcèlement */

  /* CE QUE L. 1155-2 N'ATTEINT PAS, DANS CE BLOC.
     Le seul texte répressif du corpus en matière de harcèlement punit « les
     faits de discriminations commis à la suite d'un harcèlement moral ou
     sexuel définis aux articles L. 1152-2, L. 1153-2 et L. 1153-3 » : il vise
     les représailles, non l'organisation de la prévention. Il fonde donc
     SST-CTL-HAR-05, où un signalement est resté sans réaction, et lui seul.
     La désignation des référents (HAR-01, HAR-02), l'information obligatoire
     (HAR-03) et l'organisation de la prévention (HAR-04) ne sont visées par
     aucun texte répressif capté : le harcèlement moral et le harcèlement
     sexuel sont eux-mêmes punis par les articles 222-33-2 et 222-33 du code
     pénal, que L. 1152-4 et L. 1153-5 obligent à afficher, mais le relais
     Légifrance du dépôt ne sert que le code du travail et le dépôt interdit
     de citer un autre code sans l'avoir lu à la source. Ces quatre contrôles
     restent donc au degré 3 ou 4. */

  "SST-CTL-HAR-01": {
    gravite: 4,
    quoiFaire: "Désigner le référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes.",
    risque: "Dans toute entreprise employant au moins deux cent cinquante salariés, ce référent est désigné (L. 1153-5-1). Son adresse et son numéro d'appel font partie de l'information obligatoire que D. 1151-1 énumère : sans référent désigné, cette information est incomplète, et le manquement se constate à deux titres.",
    delai: "Quelques jours : la désignation est un acte de l'employeur, elle ne dépend de personne d'autre.",
    document: "Décision de désignation du référent harcèlement sexuel et agissements sexistes",
    etapes: [
      "Vérifier le seuil : au moins deux cent cinquante salariés (L. 1153-5-1).",
      "Désigner le référent par écrit, en énonçant sa mission telle que le texte la définit : orienter, informer et accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes.",
      "Lui donner le temps, la formation et l'accès aux interlocuteurs que sa mission suppose, et le faire connaître dans l'entreprise.",
      "Porter son adresse et son numéro d'appel dans l'information délivrée aux salariés et aux candidats (D. 1151-1, 4°).",
    ],
    verifs: [
      { cle: "har01Decision", question: "Qui est le référent, et par quel acte a-t-il été désigné ?", attendu: "La décision écrite, datée et nominative." },
      { cle: "har01Coordonnees", question: "Son adresse et son numéro d'appel figurent-ils dans l'information affichée ou diffusée ?", attendu: "Le support d'information, où D. 1151-1, 4°, veut les trouver." },
      { cle: "har01Moyens", question: "De quels moyens dispose-t-il pour orienter, informer et accompagner les salariés ?", attendu: "Le temps alloué, la formation suivie, la procédure de saisine." },
    ],
  },

  "SST-CTL-HAR-02": {
    gravite: 4,
    quoiFaire: "Faire désigner par le comité social et économique, parmi ses membres, le référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes.",
    risque: "L. 2314-1 impose cette désignation par le comité, parmi ses membres, sous la forme d'une résolution adoptée selon les modalités de L. 2315-32, pour une durée qui prend fin avec celle du mandat des membres élus. La désignation appartient au comité — mais les coordonnées du référent font partie de l'information que l'employeur doit délivrer (D. 1151-1, 5°) : à défaut, c'est cette information qui est incomplète.",
    delai: "La prochaine réunion du comité.",
    document: "Inscription à l'ordre du jour du comité de la désignation du référent harcèlement",
    etapes: [
      "Inscrire la désignation à l'ordre du jour de la prochaine réunion du comité et en informer les élus par écrit : c'est la démarche que l'employeur peut accomplir, et elle se prouve.",
      "Faire adopter la résolution selon les modalités de L. 2315-32 — à la majorité des membres présents, le président ne participant pas au vote.",
      "Consigner la désignation au procès-verbal, en rappelant que le mandat du référent prend fin avec celui des membres élus du comité (L. 2314-1).",
      "Porter l'adresse et le numéro d'appel du référent dans l'information délivrée aux salariés (D. 1151-1, 5°).",
      "Inscrire le référent parmi les bénéficiaires de la formation santé, sécurité et conditions de travail, que L. 2315-18 lui reconnaît expressément.",
    ],
    verifs: [
      { cle: "har02Resolution", question: "Qui est le référent du comité, et par quelle résolution a-t-il été désigné ?", attendu: "Le procès-verbal portant la résolution et son décompte de voix (L. 2315-32)." },
      { cle: "har02Demarche", question: "Si le comité n'a pas désigné, quelle démarche a été accomplie pour l'y inviter ?", attendu: "L'ordre du jour ou le courrier aux élus, daté." },
      { cle: "har02Information", question: "Ses coordonnées figurent-elles dans l'information délivrée aux salariés ?", attendu: "Le support d'information (D. 1151-1, 5°)." },
    ],
  },

  "SST-CTL-HAR-03": {
    gravite: 3,
    quoiFaire: "Délivrer l'information obligatoire sur le harcèlement moral, le harcèlement sexuel et les coordonnées des autorités et des référents.",
    risque: "L. 1152-4 impose d'informer par tout moyen du texte de l'article 222-33-2 du code pénal les personnes mentionnées à L. 1152-2 ; L. 1153-5 impose, dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche, l'information sur le texte de l'article 222-33 du code pénal, sur les actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel et sur les coordonnées des autorités et services compétents, dont D. 1151-1 fixe la liste. Une information absente ou incomplète se constate sur place, et elle nourrit le manquement à l'obligation de prévention.",
    delai: "Une semaine : l'information se rédige, s'affiche et se date.",
    document: "Affichage et note d'information — harcèlement moral, harcèlement sexuel et agissements sexistes",
    etapes: [
      "Reprendre le texte de l'article 222-33-2 du code pénal et le porter par tout moyen à la connaissance des personnes mentionnées à L. 1152-2 (L. 1152-4).",
      "Reprendre le texte de l'article 222-33 du code pénal, ainsi que les actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel, et les afficher dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche (L. 1153-5) : le lieu d'embauche est visé pour lui-même, il est souvent oublié.",
      "Y joindre l'adresse et le numéro d'appel que D. 1151-1 énumère : du médecin du travail ou du service de santé au travail compétent pour l'établissement ; de l'inspection du travail compétente, avec le nom de l'inspecteur ; du Défenseur des droits ; du référent de L. 1153-5-1 dans les entreprises d'au moins deux cent cinquante salariés ; du référent de L. 2314-1 lorsqu'un comité social et économique existe.",
      "Dater l'affichage et en conserver une trace — photographie, note de diffusion, accusé de réception — puis prévoir sa mise à jour dès qu'un nom, une adresse ou un numéro change.",
    ],
    verifs: [
      { cle: "har03Moral", question: "Par quel moyen le texte de l'article 222-33-2 du code pénal est-il porté à la connaissance des salariés ?", attendu: "Le support et sa date de diffusion (L. 1152-4)." },
      { cle: "har03Sexuel", question: "Où l'information sur le harcèlement sexuel et sur les actions contentieuses ouvertes est-elle affichée ?", attendu: "Les emplacements : lieux de travail, et locaux ou porte des locaux d'embauche (L. 1153-5)." },
      { cle: "har03Coordonnees", question: "Les cinq coordonnées de D. 1151-1 y figurent-elles, avec le nom de l'inspecteur du travail compétent ?", attendu: "Le support, lu ligne à ligne : médecin du travail ou service de santé au travail, inspection du travail et nom de l'inspecteur, Défenseur des droits, référent employeur, référent du comité." },
      { cle: "har03MiseAJour", question: "À quelle date ce support a-t-il été vérifié pour la dernière fois ?", attendu: "La date, et le nom de la personne qui en a la charge." },
    ],
  },

  "SST-CTL-HAR-04": {
    gravite: 3,
    quoiFaire: "Organiser la prévention du harcèlement : intégrer le risque à l'évaluation et prendre les dispositions de prévention.",
    risque: "L'employeur prend toutes dispositions nécessaires en vue de prévenir les agissements de harcèlement moral (L. 1152-4) et les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner (L. 1153-5) ; la planification de la prévention intègre, dans un ensemble cohérent, les risques liés au harcèlement moral et au harcèlement sexuel ainsi que ceux liés aux agissements sexistes (L. 4121-2, 7°). Ce module constate l'existence des mesures ; leur suffisance s'apprécie au fond, et c'est au fond qu'elle sera discutée.",
    delai: "Un à deux mois : l'évaluation du risque précède les mesures, et les mesures ne valent que mises en œuvre.",
    document: "Volet « harcèlement et agissements sexistes » du document unique, et dispositif de prévention",
    etapes: [
      "Intégrer les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes à l'évaluation des risques et à sa transcription dans le document unique, unité de travail par unité de travail (L. 4121-2, 7° ; R. 4121-1).",
      "Définir les dispositions de prévention : information des salariés, formation de l'encadrement, procédure de signalement et de traitement, rappel des sanctions disciplinaires encourues par l'auteur des faits.",
      "Faire connaître ces dispositions et le rôle des référents — celui de l'employeur à partir de deux cent cinquante salariés (L. 1153-5-1), celui du comité (L. 2314-1).",
      "Documenter la mise en œuvre effective : dates, destinataires, contenus, participants. C'est elle qui sera discutée, non l'existence d'un document.",
      "Réexaminer le dispositif à chaque mise à jour du document unique, et après tout signalement.",
    ],
    verifs: [
      { cle: "har04Duerp", question: "Dans quelles unités de travail le risque de harcèlement est-il inscrit au document unique ?", attendu: "Les sections du document où il figure ; une mention générale en préambule ne vaut pas inventaire." },
      { cle: "har04Dispositif", question: "Quelles dispositions de prévention ont été prises, et par quel acte ?", attendu: "Le dispositif écrit : procédure de signalement, actions d'information, actions de formation." },
      { cle: "har04MiseEnOeuvre", question: "Quand ces dispositions ont-elles été mises en œuvre, et auprès de qui ?", attendu: "Les dates, les destinataires et les feuilles de présence ou preuves de diffusion." },
      { cle: "har04Encadrement", question: "L'encadrement a-t-il été formé à repérer et à traiter ces situations ?", attendu: "Le programme suivi et la liste des participants." },
    ],
  },

  "SST-CTL-HAR-05": {
    gravite: 1,
    quoiFaire: "Réagir au signalement : faire cesser les faits allégués, conduire une enquête et en tirer les suites.",
    risque: "L. 1153-5 impose de prévenir les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner, et L. 4121-1 impose de prendre les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs. Outre la responsabilité civile de l'employeur au titre de cette obligation, les faits de discrimination commis à la suite d'un harcèlement moral ou sexuel sont punis d'un an d'emprisonnement et de 3 750 € d'amende (L. 1155-2), la juridiction pouvant en outre ordonner l'affichage et la publication du jugement.",
    delai: "Immédiat pour les mesures conservatoires ; l'enquête se conduit en quelques semaines, pas en quelques mois.",
    document: "Dossier d'enquête interne — saisine, mesures conservatoires, auditions, rapport et suites",
    etapes: [
      "Dater la réception du signalement, et prendre sans attendre les mesures propres à faire cesser les faits allégués et à protéger la personne qui les signale.",
      "Diligenter une enquête : en fixer par écrit l'auteur, le périmètre et le calendrier, entendre la personne qui signale, la personne mise en cause et les témoins utiles, et consigner chaque audition.",
      "Établir un rapport écrit et daté, qui expose ce qui a été recherché, ce qui a été constaté et ce qui ne l'a pas été.",
      "En tirer les suites : mesures pour mettre un terme aux faits et, s'ils sont établis, sanction — L. 1153-5 exige les trois temps, prévenir, mettre un terme, sanctionner.",
      "Veiller à ce qu'aucune mesure ne soit prise contre la personne ayant subi ou refusé de subir les faits, ni contre celle qui, de bonne foi, les a relatés ou en a témoigné : L. 1152-2 et L. 1153-2 la protègent.",
      "Conserver le dossier entier — saisine, mesures conservatoires, auditions, rapport, suites : sa valeur probante s'apprécie au fond, au regard le cas échéant des autres éléments de preuve.",
    ],
    verifs: [
      { cle: "har05Reception", question: "À quelle date le signalement a-t-il été reçu, et par qui ?", attendu: "La date et la pièce : courriel, courrier, note du référent, procès-verbal du comité." },
      { cle: "har05Conservatoire", question: "Quelles mesures immédiates ont été prises pour faire cesser les faits allégués et protéger la personne qui les signale ?", attendu: "Les mesures et leur date, rapportées à celle du signalement." },
      { cle: "har05Enquete", question: "Qui a conduit l'enquête, quelles personnes ont été entendues et où se trouve le rapport ?", attendu: "Le rapport daté et les comptes rendus d'audition." },
      { cle: "har05Suites", question: "Quelles suites ont été données — mesures pour mettre un terme aux faits, et sanction s'ils sont établis ?", attendu: "Les décisions écrites et leurs dates (L. 1153-5)." },
      { cle: "har05Protection", question: "La personne qui a signalé ou témoigné a-t-elle fait l'objet d'une mesure défavorable depuis le signalement ?", attendu: "L'absence de toute mesure de cette nature ; L. 1152-2 et L. 1153-2 l'interdisent." },
    ],
  },

  /* ------------------------------------------------------------- l'exposition */

  /* Ce contrôle mesure l'exposition résultant des autres — défaut de document
     unique, défaut de mise à jour, signalement resté sans réaction. Il ne se
     régularise pas pour lui-même : on régularise ce qui la cause, et il s'éteint
     de lui-même. */
  "SST-CTL-PEN-01": null,
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
      /* Deux clés identiques, et les réponses de la page se mélangent : la
         grille du second temps est indexée par la clé, pas par le contrôle. */
      if (v.cle && CLES.has(v.cle))
        ECARTS.push(`${id} : la clé « ${v.cle} » est déjà utilisée par ${CLES.get(v.cle)}`);
      else if (v.cle) CLES.set(v.cle, id);
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

__def("./modeles-sst.js", function(module, exports, require){
/* Les modèles de régularisation — étape 5 du parcours client, module santé,
   sécurité et conditions de travail.

   Chaque contrôle régularisable a droit à mieux qu'un rappel de texte : une
   note chiffrée sur le dossier remis — l'effectif déclaré, la date de la
   dernière mise à jour du document unique et le nombre de mois écoulés, le
   régime que ce seuil commande, la composition de la commission telle que
   déclarée. Rien n'est une coquille générique : quand une donnée manque pour
   calculer, la note le dit, elle n'invente pas de chiffre.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de seuils (moteur-sst.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit.

   Un seul contrôle n'a pas de modèle : SST-CTL-PEN-01, qui mesure
   l'exposition résultant des autres et ne se régularise pas pour lui-même —
   comme regularisation-sst.js le laisse à null. Les dix-neuf autres en ont
   un. Aucun texte, seuil ou délai cité ici n'est capturé pour l'occasion :
   tous viennent de moteur-sst.js et controles-sst.js, déjà lus à la
   source. */
const O = require("./outils.js");
const M = require("./moteur-sst.js");
const D = require("./dates.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const etatTxt = x => (dit(x) ? "oui" : nie(x) ? "non" : "non renseigné");
const nomE = f => q(f.entreprise) || "l'entreprise auditée";

/* La même échéance annuelle que celle que le contrôle vérifie (R. 4121-2,
   1°) — un an après la date de dernière mise à jour, jour pour jour. */
function echeanceUnAn(iso) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(a + 1, m - 1, j));
  return d.toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════════════ le document unique ═══ */

function modeleDue01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Ce que l'effectif commande, sur ce dossier — " + nomE(f));
  const e = M.effectif(f);
  h1("Les seuils de ce module, confrontés à votre effectif");
  if (!e.connu) p("L'effectif n'est pas renseigné : aucun seuil ne peut être confronté au dossier. Le document unique, lui, est dû dès le premier salarié — la question ne se pose donc pas pour lui.");
  else tab(["Obligation", "Seuil", "Article", "Ici"],
    Object.values(M.SEUILS).map(s => [s.objet, s.seuil + " salariés", s.article,
      e.valeur >= s.seuil ? `due (${e.valeur} ≥ ${s.seuil})` : `non due à ce seuil (${e.valeur} < ${s.seuil})`]));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Document unique existant", etatTxt((f.duerp || {}).existe)],
  ]);
  note("Le document unique est dû par tout employeur, sans seuil d'effectif (L. 4121-3, R. 4121-1) : aucune ligne du tableau ci-dessus ne le concerne, ce qui commande son existence, c'est l'emploi d'un premier salarié.");
  return A.D;
}

function modeleDue02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  const du = f.duerp || {};
  t1("L'inventaire par unité de travail, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  p("Document unique : " + etatTxt(du.existe) + ". Inventaire par unité de travail : " + etatTxt(du.unitesTravail) + ".");
  if (nie(du.unitesTravail))
    p("Sans inventaire par unité de travail, le document ne répond pas à la maille que R. 4121-1 impose : un document global, qui ne distingue ni les postes ni les ateliers, ne vaut pas transcription des risques identifiés dans chaque unité.");
  note("Aucun texte lu ne fixe de nombre minimal d'unités : c'est l'organisation réelle de l'entreprise qui commande le découpage, pas un chiffre.");
  return A.D;
}

function modeleDue03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  const du = f.duerp || {};
  t1("La mise à jour annuelle, sur ce dossier — " + nomE(f));
  const e = M.effectif(f);
  const m = M.majDuerp(f);
  h1("Le calcul, sur ce dossier");
  const rows = [
    ["Effectif déclaré", e.connu ? e.valeur + " salariés" : "non renseigné"],
    ["Mise à jour au moins annuelle due (≥ 11 salariés) ?", e.connu ? (e.valeur >= 11 ? "oui (R. 4121-2, 1°)" : "non — périodicité libre sous réserve d'un niveau équivalent de protection (L. 4121-3, dernier alinéa)") : "ne peut pas être établi"],
    ["Date de la dernière mise à jour déclarée", q(du.dateDerniereMaj) || "non renseignée"],
    ["Date de l'audit", q(f.dateAudit) || "non renseignée"],
    ["Mois écoulés depuis la dernière mise à jour", m.moisEcoules != null ? String(m.moisEcoules) + " mois" : "ne peut pas être calculé"],
  ];
  if (q(du.dateDerniereMaj) && D.estDateISO(du.dateDerniereMaj)) {
    const ech = echeanceUnAn(du.dateDerniereMaj);
    rows.push(["Échéance de l'année en cours (jour pour jour)", ech || "—"]);
  }
  tab(["Point", "Valeur"], rows);
  if (m.etat === "plus d'un an" && e.connu && e.valeur >= 11)
    p(`Le dossier montre un dépassement d'environ ${m.moisEcoules} mois par rapport à la périodicité annuelle de R. 4121-2, 1°. Le retard se compte depuis la date de la dernière version, et il ne cesse qu'avec la version nouvelle.`);
  else if (m.etat === "moins d'un an") p(`Le dossier montre une mise à jour il y a environ ${m.moisEcoules} mois : la périodicité annuelle est tenue en l'état déclaré.`);
  else note("Le calcul suppose une date de dernière mise à jour et une date d'audit renseignées toutes les deux, au format AAAA-MM-JJ.");
  return A.D;
}

function modeleDue04(f) {
  const A = O(); const { t1, h1, p, tab } = A;
  const ev = f.evenement || {};
  t1("La mise à jour événementielle, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Aménagement important ou information nouvelle survenu depuis la dernière mise à jour", etatTxt(ev.survenu)],
    ["Document unique mis à jour en conséquence", etatTxt(ev.majFaite)],
  ]);
  if (dit(ev.survenu) && nie(ev.majFaite))
    p("Un événement déclencheur est déclaré sans mise à jour correspondante : R. 4121-2, 2° et 3°, impose la mise à jour lors de toute décision d'aménagement important ou de toute information nouvelle intéressant l'évaluation d'un risque, indépendamment du calendrier annuel.");
  else if (nie(ev.survenu)) p("Aucun événement déclencheur n'est déclaré : ce cas de mise à jour ne s'est pas présenté en l'état du dossier.");
  return A.D;
}

function modeleDue05(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le régime que le seuil de cinquante salariés commande, sur ce dossier — " + nomE(f));
  const s = M.suitesEvaluation(f);
  h1("Le calcul, sur ce dossier");
  if (!s.connu) { p(s.motif); return A.D; }
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", M.effectif(f).valeur + " salariés"],
    ["Régime applicable", s.regime === "programme annuel" ? "programme annuel de prévention (L. 4121-3-1, III, 1°)" : "liste d'actions consignée au document unique (L. 4121-3-1, III, 2°)"],
  ]);
  if (s.regime === "programme annuel") {
    const p1 = f.programmeAnnuel || {};
    tab(["Sous-point", "État déclaré"], [
      ["Programme établi", etatTxt(p1.existe)],
      ["Présenté au comité (L. 2312-27, 2°)", (f.cse || {}).existe === undefined ? "comité non renseigné" : etatTxt(p1.presenteCSE)],
    ]);
  } else {
    tab(["Sous-point", "État déclaré"], [["Liste d'actions consignée dans le document unique", etatTxt((f.listeActions || {}).consignee)]]);
  }
  note(s.motif);
  return A.D;
}

function modeleDue06(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const du = f.duerp || {};
  t1("Conservation des versions et avis d'accès, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Versions successives conservées (quarante ans au moins — L. 4121-3-1, V ; R. 4121-4)", etatTxt(du.versionsConservees)],
    ["Avis des modalités d'accès affiché (R. 4121-4, dernier alinéa)", etatTxt(du.avisAffiche)],
  ]);
  const griefs = [];
  if (nie(du.versionsConservees)) griefs.push("les versions successives ne sont pas conservées");
  if (nie(du.avisAffiche)) griefs.push("l'avis d'accès n'est pas affiché");
  if (griefs.length) p("Sur ce dossier : " + griefs.join(" ; ") + ".");
  return A.D;
}

function modeleDue07(f) {
  const A = O(); const { t1, h1, tab } = A;
  const du = f.duerp || {}, cse = f.cse || {};
  t1("La consultation du comité sur le document unique, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Comité social et économique existant", etatTxt(cse.existe)],
    ["Comité consulté sur le document unique et ses mises à jour (L. 4121-3, 1°)", etatTxt(du.consultationCSE)],
  ]);
  return A.D;
}

function modeleDue08(f) {
  const A = O(); const { t1, h1, tab } = A;
  const du = f.duerp || {};
  t1("La transmission au service de prévention et de santé au travail, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Document unique transmis au service de prévention et de santé au travail à chaque mise à jour (L. 4121-3-1, VI)", etatTxt(du.transmisSPST)],
  ]);
  return A.D;
}

/* ─────────────────────────────────────────── la commission (CSSCT) ─────── */

function modeleCss01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Pourquoi la commission est due — ou ne l'est pas —, sur ce dossier — " + nomE(f));
  const d = M.cssctDue(f);
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", M.effectif(f).connu ? M.effectif(f).valeur + " salariés" : "non renseigné"],
    ["Établissement distinct d'au moins trois cents salariés", etatTxt(f.etablissementDistinct300)],
    ["Établissement à hauts risques (L. 4521-1 et suivants)", etatTxt(f.etablissementRisqueParticulier)],
    ["Création imposée par l'inspecteur du travail", etatTxt(f.cssctImposeeInspection)],
    ["Commission due", d.due === null ? "ne peut pas être établi" : (d.due ? "oui" + (d.fondement ? " — " + d.fondement : "") : "non à ce seuil")],
    ["Commission existante", etatTxt((f.cssct || {}).existe)],
  ]);
  note(d.motif);
  return A.D;
}

function modeleCss02(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const c = f.cssct || {};
  t1("La composition de la commission, sur ce dossier — " + nomE(f));
  h1("Le calcul, article L. 2315-39, sur ce dossier");
  const n = typeof c.nbMembres === "number" ? c.nbMembres : (c.nbMembres ? Number(c.nbMembres) : null);
  tab(["Exigence de L. 2315-39", "Déclaré", "Résultat"], [
    ["Présidence par l'employeur ou son représentant", etatTxt(c.presideeEmployeur), dit(c.presideeEmployeur) ? "conforme" : (nie(c.presideeEmployeur) ? "manquant" : "à compléter")],
    ["Au moins trois membres représentants du personnel", n === null ? "non renseigné" : String(n), n === null ? "à compléter" : (n >= 3 ? "conforme" : "insuffisant (" + n + " < 3)")],
    ["Au moins un membre du second collège (ou du troisième)", etatTxt(c.membreSecondCollege), dit(c.membreSecondCollege) ? "conforme" : (nie(c.membreSecondCollege) ? "manquant" : "à compléter")],
    ["Désignation par le comité parmi ses membres", etatTxt(c.designesParCSE), dit(c.designesParCSE) ? "conforme" : (nie(c.designesParCSE) ? "manquant" : "à compléter")],
  ]);
  p("Ces quatre exigences sont d'ordre public (L. 2315-39) : aucun accord ne peut ni les écarter ni les réécrire, et une désignation qui les méconnaît encourt l'annulation.");
  return A.D;
}

function modeleCss03(f) {
  const A = O(); const { t1, h1, tab } = A;
  const c = f.cssct || {};
  t1("Ce qui fixe les modalités de la commission, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [["Source des modalités", q(c.modalitesFixees) || "non renseignée"]]);
  return A.D;
}

function modeleCss04(f) {
  const A = O(); const { t1, h1, tab } = A;
  const c = f.cssct || {};
  t1("Les limites de la délégation, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Délégation excluant le recours à l'expert et les attributions consultatives (L. 2315-38)", etatTxt(c.delegationConforme)],
  ]);
  return A.D;
}

function modeleCss05(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const d = M.cssctDue(f);
  t1("La formation santé, sécurité et conditions de travail des élus, sur ce dossier — " + nomE(f));
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Comité social et économique existant", etatTxt((f.cse || {}).existe)],
    ["Commission due (≥ trois cents, ou fondement particulier)", d.due === null ? "ne peut pas être établi" : (d.due ? "oui" : "non")],
    ["Durée due pour les membres de la commission (renouvellement)", d.due ? "cinq jours (L. 2315-18, effectif ≥ 300)" : "trois jours (L. 2315-18, hors commission ou < 300)"],
    ["Formation santé-sécurité assurée", etatTxt(f.formationSSCT)],
  ]);
  p("La durée du premier mandat — cinq jours au minimum — est la même quel que soit l'effectif ; c'est seulement au renouvellement que la commission d'au moins trois cents salariés se distingue (cinq jours au lieu de trois).");
  return A.D;
}

function modeleCss06(f) {
  const A = O(); const { t1, h1, tab, p, note } = A;
  const c = f.cssct || {};
  t1("Le remplacement des membres de la commission, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Remplacement intervenu en cours de mandat", etatTxt(c.remplacementEnCoursDeMandat)],
    ["Cause invoquée", q(c.causeRemplacement) || "non renseignée"],
  ]);
  if (q(c.causeRemplacement)) {
    const ok = M.finAnticipeeMandat(c.causeRemplacement);
    p(`La cause déclarée — « ${c.causeRemplacement} » — ${ok ? "figure" : "ne figure pas"} parmi les fins anticipées de mandat de L. 2314-33 : ${M.FINS_ANTICIPEES.join(", ")}.`);
  }
  note("Ces quatre causes sont les seules qui autorisent le remplacement ; aucun accord d'entreprise n'y déroge (Soc., 28 mai 2026, n° 24-22.914).");
  return A.D;
}

/* ─────────────────────────────────────────────────────── le harcèlement ─── */

function modeleHar01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  const d = M.referentEmployeurDu(f);
  t1("Le référent employeur, sur ce dossier — " + nomE(f));
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", M.effectif(f).connu ? M.effectif(f).valeur + " salariés" : "non renseigné"],
    ["Référent employeur dû (≥ 250 salariés — L. 1153-5-1)", d.du === null ? "ne peut pas être établi" : (d.du ? "oui" : "non à ce seuil")],
    ["Référent désigné", etatTxt(f.referentEmployeur)],
  ]);
  note(d.motif);
  return A.D;
}

function modeleHar02(f) {
  const A = O(); const { t1, h1, tab } = A;
  t1("Le référent du comité, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Comité social et économique existant", etatTxt((f.cse || {}).existe)],
    ["Référent harcèlement du comité désigné (L. 2314-1)", etatTxt(f.referentCSE)],
  ]);
  return A.D;
}

function modeleHar03(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  t1("L'information obligatoire, sur ce dossier — " + nomE(f));
  h1("Le calcul, point par point");
  tab(["Composante de D. 1151-1 et des articles cités", "État déclaré"], [
    ["Texte de l'article 222-33-2 du code pénal — harcèlement moral (L. 1152-4)", etatTxt(f.infoHarcelementMoral)],
    ["Texte de l'article 222-33 du code pénal et actions ouvertes — harcèlement sexuel (L. 1153-5)", etatTxt(f.infoHarcelementSexuel)],
    ["Coordonnées des autorités et des référents (D. 1151-1)", etatTxt(f.infoCoordonnees)],
  ]);
  const manquants = [];
  if (nie(f.infoHarcelementMoral)) manquants.push("harcèlement moral");
  if (nie(f.infoHarcelementSexuel)) manquants.push("harcèlement sexuel");
  if (nie(f.infoCoordonnees)) manquants.push("coordonnées");
  if (manquants.length) p("Sur ce dossier, l'information fait défaut sur : " + manquants.join(", ") + ".");
  return A.D;
}

function modeleHar04(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  t1("L'organisation de la prévention, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Risques de harcèlement intégrés à l'évaluation (L. 4121-2, 7°)", etatTxt(f.risquesHarcelementEvalues)],
    ["Dispositions de prévention prises (L. 1152-4, L. 1153-5)", etatTxt(f.mesuresPreventionHarcelement)],
  ]);
  p("Ce module constate l'existence des mesures déclarées ; leur suffisance s'apprécie au fond — ce tableau n'en tient jamais lieu.");
  return A.D;
}

function modeleHar05(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const s = f.signalement || {};
  t1("La réaction au signalement, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Signalement reçu", etatTxt(s.recu)],
    ["Enquête menée", etatTxt(s.enqueteMenee)],
    ["Mesures prises pour mettre un terme aux faits", etatTxt(s.mesuresPrises)],
  ]);
  if (dit(s.recu) && (nie(s.enqueteMenee) || nie(s.mesuresPrises)))
    p("Un signalement est déclaré reçu sans que la réaction complète — enquête et mesures — soit établie : L. 1153-5 impose les trois temps, prévenir, mettre un terme, sanctionner.");
  return A.D;
}

const MODELES = {
  "SST-CTL-DUE-01": modeleDue01, "SST-CTL-DUE-02": modeleDue02, "SST-CTL-DUE-03": modeleDue03,
  "SST-CTL-DUE-04": modeleDue04, "SST-CTL-DUE-05": modeleDue05, "SST-CTL-DUE-06": modeleDue06,
  "SST-CTL-DUE-07": modeleDue07, "SST-CTL-DUE-08": modeleDue08,
  "SST-CTL-CSS-01": modeleCss01, "SST-CTL-CSS-02": modeleCss02, "SST-CTL-CSS-03": modeleCss03,
  "SST-CTL-CSS-04": modeleCss04, "SST-CTL-CSS-05": modeleCss05, "SST-CTL-CSS-06": modeleCss06,
  "SST-CTL-HAR-01": modeleHar01, "SST-CTL-HAR-02": modeleHar02, "SST-CTL-HAR-03": modeleHar03,
  "SST-CTL-HAR-04": modeleHar04, "SST-CTL-HAR-05": modeleHar05,
  "SST-CTL-PEN-01": null,
};

module.exports = { MODELES };

if (require.main === module) {
  const { C } = require("./controles-sst.js");
  const manquants = C.filter(c => !Object.prototype.hasOwnProperty.call(MODELES, c.id)).map(c => c.id);
  const orphelins = Object.keys(MODELES).filter(id => !C.some(c => c.id === id));
  if (manquants.length || orphelins.length) {
    if (manquants.length) console.error("ÉCART — contrôle sans entrée de modèle : " + manquants.join(", "));
    if (orphelins.length) console.error("ÉCART — entrée de modèle sans contrôle : " + orphelins.join(", "));
    process.exit(1);
  }
  const aModele = Object.values(MODELES).filter(x => typeof x === "function").length;
  console.log(`${C.length} contrôle(s) · ${aModele} modèle(s) de régularisation chiffrés`);
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
      /* Achevé veut dire : plus rien à corriger. Un refus du second temps
         rejoint la liste du premier — le compteur le dit déjà — et il doit
         donc empêcher l'achèvement, sans quoi le compte rendu annonçait
         « tous les manquements sont déclarés corrigés » juste au-dessous de
         la liste de ceux qui reviennent refusés. */
      acheve: restantsA.length === 0 && refuses.length === 0,
    },
    tempsB: {
      points: jugesB,
      valides: valides.length,
      refuses: refuses.length,
      enAttente: enAttente.length,
      /* Le second temps ne s'ouvre qu'une fois relevés tous les manquements
         du premier : c'est l'ordre qui a été arrêté, et la page le fait
         respecter. Il reste ouvert, en revanche, quand un point en revient
         refusé — sinon le client serait renvoyé corriger sans pouvoir faire
         revérifier ce qu'il a corrigé. */
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

  global.MoteurSST = {
    audit: require("./audit-sst-client.js"),

    moteur: require("./moteur-sst.js"),
    controles: require("./controles-sst.js"),
    manifeste: __MANIFESTE,
    champs: [["Identité",[["entreprise","Dénomination sociale","texte"],["dateAudit","Date à laquelle la situation est décrite","AAAA-MM-JJ"],["effectif","Effectif de l'entreprise","nombre"],["cse.existe","Un comité social et économique existe-t-il ?","oui / non"]]],["Le document unique",[["duerp.existe","Un document unique d'évaluation des risques professionnels existe-t-il ?","oui / non"],["duerp.dateDerniereMaj","Date de sa dernière mise à jour (ou de son établissement)","AAAA-MM-JJ"],["duerp.unitesTravail","L'évaluation comporte-t-elle un inventaire des risques par unité de travail ?","oui / non"],["duerp.versionsConservees","Les versions successives sont-elles conservées (quarante ans au moins) ?","oui / non"],["duerp.avisAffiche","L'avis indiquant les modalités d'accès au document est-il affiché ?","oui / non"],["duerp.consultationCSE","Le comité est-il consulté sur le document unique et ses mises à jour ?","oui / non"],["duerp.transmisSPST","Le document est-il transmis au service de prévention et de santé au travail à chaque mise à jour ?","oui / non"]]],["Les mises à jour",[["evenement.survenu","Depuis la dernière mise à jour, un aménagement important ou une information nouvelle intéressant un risque sont-ils survenus ?","oui / non"],["evenement.majFaite","Si oui, le document unique a-t-il été mis à jour en conséquence ?","oui / non"]]],["Les suites de l'évaluation",[["programmeAnnuel.existe","À partir de cinquante salariés : un programme annuel de prévention est-il établi ?","oui / non"],["programmeAnnuel.presenteCSE","Ce programme est-il présenté au comité (consultation politique sociale) ?","oui / non"],["listeActions.consignee","Moins de cinquante salariés : la liste d'actions de prévention est-elle consignée dans le document unique ?","oui / non"]]],["La commission santé-sécurité (CSSCT)",[["etablissementDistinct300","Un établissement distinct atteint-il trois cents salariés ?","oui / non"],["etablissementRisqueParticulier","Un établissement relève-t-il des articles L. 4521-1 et suivants (hauts risques industriels) ?","oui / non"],["cssctImposeeInspection","L'inspecteur du travail a-t-il imposé la création d'une commission ?","oui / non"],["cssct.existe","Une commission santé, sécurité et conditions de travail existe-t-elle ?","oui / non"],["cssct.presideeEmployeur","Est-elle présidée par l'employeur ou son représentant ?","oui / non"],["cssct.nbMembres","Nombre de membres représentants du personnel","nombre"],["cssct.membreSecondCollege","Au moins un membre du second collège (ou du troisième) y siège-t-il ?","oui / non"],["cssct.designesParCSE","Ses membres sont-ils désignés par le comité parmi ses membres ?","oui / non"],["cssct.modalitesFixees","Qu'est-ce qui fixe ses modalités — accord d'entreprise, accord avec le comité, règlement intérieur, ou rien ?","liste"],["cssct.delegationConforme","La délégation confiée exclut-elle le recours à l'expert et les attributions consultatives ?","oui / non"],["cssct.remplacementEnCoursDeMandat","Des membres de la commission ont-ils été remplacés depuis leur désignation initiale ?","oui / non"],["cssct.causeRemplacement","Si oui, pour quelle cause ?","texte"],["formationSSCT","Les élus (et le référent harcèlement du comité) ont-ils reçu la formation santé, sécurité et conditions de travail ?","oui / non"]]],["Le harcèlement",[["referentEmployeur","À partir de deux cent cinquante salariés : le référent employeur harcèlement sexuel est-il désigné ?","oui / non"],["referentCSE","Le comité a-t-il désigné son référent harcèlement sexuel et agissements sexistes ?","oui / non"],["infoHarcelementMoral","Le texte de l'article 222-33-2 du code pénal (harcèlement moral) est-il porté à la connaissance des salariés ?","oui / non"],["infoHarcelementSexuel","Le texte de l'article 222-33 du code pénal et les actions ouvertes sont-ils affichés dans les lieux de travail et d'embauche ?","oui / non"],["infoCoordonnees","Les coordonnées du médecin du travail, de l'inspection du travail, du Défenseur des droits et des référents sont-elles délivrées ?","oui / non"],["risquesHarcelementEvalues","Les risques de harcèlement et d'agissements sexistes sont-ils intégrés à l'évaluation des risques ?","oui / non"],["mesuresPreventionHarcelement","Des dispositions de prévention du harcèlement sont-elles prises (procédure de signalement, sensibilisation, règlement intérieur) ?","oui / non"],["signalement.recu","Un signalement de harcèlement moral ou sexuel a-t-il été reçu ?","oui / non"],["signalement.enqueteMenee","Si oui, une enquête a-t-elle été menée ?","oui / non"],["signalement.mesuresPrises","Si oui, des mesures ont-elles été prises pour y mettre un terme ?","oui / non"]]],["Pièces",[["pieces","Pièces versées au dossier","liste d'objets"]]]],
    propositions: {"cse.existe":{"valeurs":["oui","non"],"libre":false,"aide":"Le comité social et économique. S'il n'existe pas, ce module ne juge pas cette absence — le module « comité » de l'application le fait — mais les contrôles qui le supposent deviennent sans objet."},"duerp.existe":{"valeurs":["oui","non"],"libre":false,"aide":"Le document unique d'évaluation des risques professionnels (DUERP) est dû par tout employeur, dès le premier salarié. Son absence est une infraction pénale (contravention de 5e classe)."},"duerp.unitesTravail":{"valeurs":["oui","non"],"libre":false,"aide":"L'évaluation doit comporter un inventaire des risques identifiés dans chaque unité de travail : atelier, chantier, service, poste — y compris les ambiances thermiques."},"duerp.versionsConservees":{"valeurs":["oui","non"],"libre":false,"aide":"Chaque version du document doit être conservée quarante ans au moins et rester consultable — par les salariés, les anciens salariés, le comité, le médecin du travail, l'inspection."},"duerp.avisAffiche":{"valeurs":["oui","non"],"libre":false,"aide":"Un avis indiquant comment consulter le document unique doit être affiché à une place aisément accessible — au même endroit que le règlement intérieur s'il en existe un."},"duerp.consultationCSE":{"valeurs":["oui","non"],"libre":false,"aide":"Le comité est consulté sur le document unique et sur chacune de ses mises à jour : il contribue à l'évaluation des risques."},"duerp.transmisSPST":{"valeurs":["oui","non"],"libre":false,"aide":"À chaque mise à jour, le document est transmis au service de prévention et de santé au travail (la « médecine du travail ») auquel l'entreprise adhère."},"evenement.survenu":{"valeurs":["oui","non"],"libre":false,"aide":"Un déménagement, une nouvelle machine, une réorganisation, un accident ou une alerte qui éclaire un risque : chacun de ces événements impose une mise à jour, quel que soit l'effectif."},"evenement.majFaite":{"valeurs":["oui","non"],"libre":false,"aide":"Si un tel événement est survenu, la mise à jour du document unique n'attend pas l'échéance annuelle."},"programmeAnnuel.existe":{"valeurs":["oui","non"],"libre":false,"aide":"À partir de cinquante salariés, l'évaluation débouche sur un programme annuel : mesures de l'année à venir, conditions d'exécution, indicateurs, coût, calendrier, ressources."},"programmeAnnuel.presenteCSE":{"valeurs":["oui","non"],"libre":false,"aide":"Le programme est présenté au comité avec le rapport annuel, dans la consultation sur la politique sociale. Le comité peut proposer un ordre de priorité et des mesures supplémentaires."},"listeActions.consignee":{"valeurs":["oui","non"],"libre":false,"aide":"Sous cinquante salariés, pas de programme formel : une liste d'actions de prévention et de protection, consignée dans le document unique lui-même."},"etablissementDistinct300":{"valeurs":["oui","non"],"libre":false,"aide":"La commission santé-sécurité est due dans chaque établissement distinct d'au moins trois cents salariés, même si l'entreprise entière n'atteint pas ce seuil ailleurs."},"etablissementRisqueParticulier":{"valeurs":["oui","non"],"libre":false,"aide":"Sites nucléaires, installations Seveso seuil haut, stockages souterrains : la commission y est due quel que soit l'effectif."},"cssctImposeeInspection":{"valeurs":["oui","non"],"libre":false,"aide":"Sous trois cents salariés, l'inspecteur du travail peut imposer la commission quand la nature des activités ou l'agencement des locaux le rend nécessaire."},"cssct.existe":{"valeurs":["oui","non"],"libre":false,"aide":"La commission santé, sécurité et conditions de travail du comité. Obligatoire à partir de trois cents salariés ; possible partout par accord."},"cssct.presideeEmployeur":{"valeurs":["oui","non"],"libre":false,"aide":"La commission est présidée par l'employeur ou son représentant, qui peut se faire assister — sans dépasser en nombre les représentants du personnel titulaires."},"cssct.membreSecondCollege":{"valeurs":["oui","non"],"libre":false,"aide":"Au moins un des trois membres minimum vient du second collège (agents de maîtrise et techniciens) ou, le cas échéant, du troisième (cadres)."},"cssct.designesParCSE":{"valeurs":["oui","non"],"libre":false,"aide":"Les membres de la commission sont désignés par le comité, parmi ses membres, par résolution, pour la durée du mandat."},"cssct.remplacementEnCoursDeMandat":{"valeurs":["oui","non"],"libre":false,"aide":"Les membres de la commission sont désignés pour une durée qui prend fin avec le mandat des élus du comité (L. 2315-39). Hors les fins anticipées de mandat de L. 2314-33, le comité ne peut pas les remplacer — et aucun accord d'entreprise n'y déroge (Soc., 28 mai 2026, n° 24-22.914)."},"cssct.causeRemplacement":{"valeurs":["décès","démission","rupture du contrat de travail","perte des conditions requises pour être éligible"],"libre":true,"aide":"Seules les causes de L. 2314-33 autorisent le remplacement : décès, démission, rupture du contrat de travail, perte des conditions requises pour être éligible. Toute autre cause — perte de confiance, réorganisation, nouvel équilibre syndical — expose la délibération à l'annulation."},"cssct.modalitesFixees":{"valeurs":["accord d'entreprise","accord avec le comité","règlement intérieur","aucune"],"libre":false,"aide":"Nombre de membres, missions déléguées, fonctionnement, heures de délégation, formation, moyens : un accord d'entreprise les fixe ; sans délégué syndical, un accord avec le comité ; à défaut d'accord, le règlement intérieur du comité doit le faire."},"cssct.delegationConforme":{"valeurs":["oui","non"],"libre":false,"aide":"Deux choses ne se délèguent jamais à la commission : le recours à un expert, et les attributions consultatives du comité. Une consultation rendue par la seule commission serait irrégulière."},"formationSSCT":{"valeurs":["oui","non"],"libre":false,"aide":"Cinq jours au moins au premier mandat, trois au renouvellement — cinq pour les membres de la commission à partir de trois cents salariés. L'employeur finance."},"referentEmployeur":{"valeurs":["oui","non"],"libre":false,"aide":"À partir de deux cent cinquante salariés, un référent oriente, informe et accompagne les salariés contre le harcèlement sexuel et les agissements sexistes. Ses coordonnées font partie de l'affichage obligatoire."},"referentCSE":{"valeurs":["oui","non"],"libre":false,"aide":"Quel que soit l'effectif, le comité désigne parmi ses membres un référent harcèlement sexuel, pour la durée du mandat. Ses coordonnées aussi font partie de l'information due."},"infoHarcelementMoral":{"valeurs":["oui","non"],"libre":false,"aide":"Le texte de l'article 222-33-2 du code pénal (harcèlement moral) doit être porté à la connaissance des salariés par tout moyen : affichage, intranet, livret d'accueil."},"infoHarcelementSexuel":{"valeurs":["oui","non"],"libre":false,"aide":"Dans les lieux de travail et les locaux d'embauche : le texte de l'article 222-33 du code pénal, les actions civiles et pénales ouvertes, et les coordonnées des autorités compétentes."},"infoCoordonnees":{"valeurs":["oui","non"],"libre":false,"aide":"Adresse et numéro du médecin du travail, de l'inspection du travail (avec le nom de l'inspecteur), du Défenseur des droits, du référent employeur (à partir de 250) et du référent du comité."},"risquesHarcelementEvalues":{"valeurs":["oui","non"],"libre":false,"aide":"La planification de la prévention intègre expressément les risques de harcèlement moral, de harcèlement sexuel et d'agissements sexistes — leur place naturelle est le document unique."},"mesuresPreventionHarcelement":{"valeurs":["oui","non"],"libre":false,"aide":"Procédure de signalement, sensibilisation, rappel au règlement intérieur : l'employeur prend toutes dispositions nécessaires pour prévenir — et, pour le harcèlement sexuel, y mettre un terme et sanctionner."},"signalement.recu":{"valeurs":["oui","non"],"libre":false,"aide":"Un signalement reçu — par la victime, un témoin, un élu — déclenche l'obligation de réagir : ne rien faire est le seul choix toujours fautif."},"signalement.enqueteMenee":{"valeurs":["oui","non"],"libre":false,"aide":"Une enquête proportionnée aux faits signalés. Sa valeur probante relève de l'appréciation souveraine des juges du fond (Soc., 18 juin 2025, n° 23-19.022) : documentez-la."},"signalement.mesuresPrises":{"valeurs":["oui","non"],"libre":false,"aide":"Mesures conservatoires, éloignement, sanction si les faits sont établis : l'obligation est de mettre un terme aux agissements, pas seulement de les constater."},"pieces":{"valeurs":[],"autres":["duerp","programme-annuel","procedure-signalement","rapport-enquete"],"libre":true,"multiple":true,"indicatif":true,"aide":"Les documents que vous joignez. Un document unique ne se prouve que par son texte."}},
    listes: [],
    colonnes: {},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
