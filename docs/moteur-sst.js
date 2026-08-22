/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : 4e54ac68f761
   {"articlesLus":33,"articlesReprisDuModuleCSE":14,"seuils":4,"controles":20,"exposition":1,"coherence":0,"donneesDemandees":40,"casContradictoires":25,"verdicts":540,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0}
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
  var __MANIFESTE = {"domaine":"santé, sécurité et conditions de travail","date":"2026-08-22","empreinte":"4e54ac68f761","fichiers":{"audit-sst-client.js":"36e7824f414c","capturer-textes-sst.js":"3f8f7ed89946","controles-sst.js":"f8bcbcda721f","dates.js":"5d945470174f","fiche-sst.json":"53b3c1bcc029","moteur-sst.js":"26a0813dc4b0","outils.js":"6defb2be2a2b","propositions-sst.js":"c76cdd6a592b","questionnaire-sst.js":"718105a89609","tests-sst.js":"bd9530ab3d9f","textes-sst.json":"7e05a8526f91","verifier-textes-sst.js":"888058562548"},"compteurs":{"articlesLus":33,"articlesReprisDuModuleCSE":14,"seuils":4,"controles":20,"exposition":1,"coherence":0,"donneesDemandees":40,"casContradictoires":25,"verdicts":540,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0},"textesRelus":{"date":"2026-08-21","articles":33,"concordants":33,"ecarts":0,"sansConclusion":0}};
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
