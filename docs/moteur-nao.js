/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : b341f552d312
   {"articlesLus":25,"themes":4,"mentionsAccordMethode":5,"controles":17,"exposition":1,"coherence":0,"donneesDemandees":31,"casContradictoires":15,"verdicts":289,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0}
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
  var __MANIFESTE = {"domaine":"négociation obligatoire en entreprise","date":"2026-08-20","empreinte":"b341f552d312","fichiers":{"audit-nao-client.js":"65d55e7e32a0","capturer-textes-nao.js":"287d81d2ea1c","controles-nao.js":"d9315ad2c8b8","dates.js":"5d945470174f","fiche-nao.json":"024305b6b0ab","moteur-nao.js":"7bb1df1b203e","outils.js":"6defb2be2a2b","propositions-nao.js":"6b34f8a501b8","questionnaire-nao.js":"95b08d4cec5d","tests-nao.js":"47348a66d9a8","textes-nao.json":"889bda7d970d","verifier-textes-nao.js":"b44a05c8c286"},"compteurs":{"articlesLus":25,"themes":4,"mentionsAccordMethode":5,"controles":17,"exposition":1,"coherence":0,"donneesDemandees":31,"casContradictoires":15,"verdicts":289,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0},"textesRelus":{"date":"2026-08-18","articles":25,"concordants":15,"ecarts":0,"sansConclusion":10}};
  var __REGISTRE = (function () { var r = null || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

__def("./audit-nao-client.js", function(module, exports, require){
/* Le rapport du module « négociation obligatoire ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Toute phrase juridique vient d'un contrôle, qui la tient d'un
   article. */
const O = require("./outils.js");
const M = require("./moteur-nao.js");
const { C, ETATS, DETECTION, COHERENCE } = require("./controles-nao.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF), so = par(SO);

  sur("Audit — négociation obligatoire en entreprise · articles L. 2242-1 et suivants du code du travail");
  t1(f.entreprise ? `Négociations obligatoires — ${f.entreprise}` : "Négociations obligatoires");
  trait();

  /* --- le régime, dit d'abord --- */
  const r = M.regime(f);
  h1("Le régime qui s'applique");
  p(r.motif);
  if (r.regime === "supplétif" || r.regime === "accord de méthode") {
    const e = M.echeances(f);
    tab(["Négociation", "Périodicité", "Dernier engagement", "État"],
      Object.values(e.themes).map(t => [
        t.titre,
        t.du === false ? "non due" : (t.periodiciteMois / 12) + " an(s)",
        (t.nego || {}).dateEngagement || "—",
        t.etat + (t.etat === "en retard" ? ` (≈ ${t.retardMois} mois)` : ""),
      ]));
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

__def("./moteur-nao.js", function(module, exports, require){
/* Le régime de la négociation obligatoire en entreprise : ce que les textes
   commandent, et rien d'autre.

   TROIS RÈGLES DE MÉTHODE :

   1. L'obligation naît des sections syndicales, pas de l'effectif. L. 2242-1
      vise « les entreprises où sont constituées une ou plusieurs sections
      syndicales d'organisations représentatives ». Sans section syndicale,
      aucune négociation n'est due — tout le module est sans objet. Tant qu'on
      ne sait pas si une section existe, rien ne se contrôle.

   2. Deux régimes, jamais mélangés. Un accord de méthode (L. 2242-10 et
      L. 2242-11) peut fixer les périodicités, dans la limite de quatre ans et
      à condition de porter les cinq mentions que L. 2242-11 énumère. À défaut
      d'accord — ou si l'accord ne respecte pas ses propres stipulations —,
      le régime supplétif de L. 2242-13 s'applique : rémunération chaque
      année, égalité chaque année, gestion des emplois et des parcours tous
      les trois ans à partir de trois cents salariés, salariés expérimentés
      tous les trois ans à partir de trois cents salariés (L. 2242-2-1).

   3. Le moteur rend le régime et les échéances ; il ne prononce rien. Les
      contrôles prononcent, et une donnée absente ne produit jamais une
      conformité.                                                            */
const D = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

/* Les quatre négociations, telles que les textes les nomment. */
const THEMES = {
  remuneration: {
    cle: "remuneration",
    titre: "Rémunération, temps de travail et partage de la valeur ajoutée",
    fondement: "L. 2242-1, 1°", contenu: "L. 2242-15",
    supplAnnees: 1, seuil: null,
  },
  egalite: {
    cle: "egalite",
    titre: "Égalité professionnelle entre les femmes et les hommes et qualité de vie et des conditions de travail",
    fondement: "L. 2242-1, 2°", contenu: "L. 2242-17",
    supplAnnees: 1, seuil: null,
  },
  gepp: {
    cle: "gepp",
    titre: "Gestion des emplois et des parcours professionnels",
    fondement: "L. 2242-2", contenu: "L. 2242-20",
    supplAnnees: 3, seuil: 300,
  },
  experimentes: {
    cle: "experimentes",
    titre: "Emploi, travail et amélioration des conditions de travail des salariés expérimentés",
    fondement: "L. 2242-2-1", contenu: "L. 2242-2-1",
    supplAnnees: 3, seuil: 300,
  },
};

/* L'assujettissement : la section syndicale d'une organisation représentative. */
function assujettissement(f) {
  if (!renseigne(f.sectionsSyndicales))
    return { connu: false, du: null,
      motif: "Il n'est pas indiqué si une section syndicale d'organisation représentative est constituée dans l'entreprise. C'est elle qui déclenche l'obligation de négocier (L. 2242-1) : sans cette réponse, rien ne se contrôle." };
  if (nie(f.sectionsSyndicales))
    return { connu: true, du: false,
      motif: "Aucune section syndicale d'organisation représentative n'est constituée : les négociations obligatoires de L. 2242-1 ne sont pas dues. L'information sur les mises à disposition de salariés reste due aux salariés qui la demandent (L. 2242-16, second alinéa)." };
  return { connu: true, du: true,
    motif: "Une ou plusieurs sections syndicales d'organisations représentatives sont constituées : l'employeur engage les négociations de L. 2242-1 — et, selon l'effectif, celles de L. 2242-2 et L. 2242-2-1." };
}

/* Le seuil de trois cents : entreprise ou groupe (L. 2331-1), ou entreprise de
   dimension communautaire comportant au moins cent cinquante salariés en
   France (L. 2242-2 et L. 2242-2-1). */
function seuil300(f) {
  const eff = nombre(f.effectif), grp = dit(f.groupe) ? nombre(f.effectifGroupe) : null;
  const communautaire = dit(f.dimensionCommunautaire) && nombre(f.effectifFrance) !== null
    && nombre(f.effectifFrance) >= 150;
  if (eff === null && grp === null && !renseigne(f.dimensionCommunautaire))
    return { connu: false, atteint: null, motif: "L'effectif n'est pas renseigné : le seuil de trois cents salariés ne peut pas être apprécié." };
  const atteint = (eff !== null && eff >= 300) || (grp !== null && grp >= 300) || communautaire;
  return { connu: true, atteint,
    motif: atteint
      ? "Le seuil de trois cents salariés est atteint (entreprise, groupe au sens de L. 2331-1, ou dimension communautaire avec au moins cent cinquante salariés en France) : les négociations triennales de L. 2242-2 et L. 2242-2-1 sont dues."
      : "Le seuil de trois cents salariés n'est pas atteint : les négociations de L. 2242-2 et L. 2242-2-1 ne sont pas dues." };
}

/* L'accord de méthode : valable s'il porte les cinq mentions de L. 2242-11,
   si sa durée n'excède pas quatre ans, et si aucune périodicité ne dépasse
   quatre ans. Un accord déclaré mais non versé laisse le régime indéterminé —
   la règle est la même que partout dans le dépôt : on ne conclut pas sur un
   texte qu'on n'a pas. */
const MENTIONS = [
  ["themes", "les thèmes et leur périodicité (1°)"],
  ["contenu", "le contenu de chacun des thèmes (2°)"],
  ["calendrier", "le calendrier et les lieux des réunions (3°)"],
  ["informations", "les informations remises et la date de leur remise (4°)"],
  ["suivi", "les modalités de suivi des engagements (5°)"],
];
function regime(f) {
  const a = assujettissement(f);
  if (a.du !== true) return { regime: a.du === false ? "sans objet" : "indéterminé", motif: a.motif };

  const acc = f.accordMethode || {};
  if (!renseigne(acc.existe))
    return { regime: "indéterminé", cause: "accord de méthode non déclaré",
      motif: "Il n'est pas dit si un accord fixant le calendrier, la périodicité, les thèmes et les modalités des négociations (L. 2242-10) existe. Répondez oui ou non : sans accord, le régime supplétif de L. 2242-13 s'applique ; avec un accord, ce sont ses périodicités qui comptent, et il faut le joindre." };

  if (nie(acc.existe))
    return { regime: "supplétif", article: "L. 2242-13",
      motif: "Aucun accord de méthode : le régime supplétif s'applique — rémunération chaque année, égalité chaque année, et, à partir de trois cents salariés, gestion des emplois et des parcours puis salariés expérimentés tous les trois ans (L. 2242-13)." };

  if (!dit(acc.verse))
    return { regime: "indéterminé", cause: "accord de méthode non versé",
      motif: "Un accord de méthode est déclaré mais n'est pas joint au dossier. C'est lui qui fixe les périodicités : sans son texte, le calendrier exigible est inconnu et l'audit ne peut pas conclure." };

  const duree = nombre(acc.dureeAns);
  if (duree === null)
    return { regime: "indéterminé", cause: "durée de l'accord inconnue",
      motif: "La durée de l'accord de méthode n'est pas renseignée. L. 2242-11 la plafonne à quatre ans : sans elle, la validité de l'accord ne peut pas être appréciée." };
  if (duree > 4)
    return { regime: "supplétif", article: "L. 2242-13", accordInvalide: true,
      motif: `L'accord de méthode affiche une durée de ${duree} ans : L. 2242-11 la plafonne à quatre. Un accord qui ne respecte pas ses conditions ne fait pas écran — le régime supplétif de L. 2242-13 s'applique.` };

  const mentions = Array.isArray(acc.mentions) ? acc.mentions : [];
  const absentes = MENTIONS.filter(([cle]) => !mentions.includes(cle));
  if (absentes.length)
    return { regime: "supplétif", article: "L. 2242-13", accordInvalide: true,
      motif: `L'accord de méthode ne porte pas toutes les mentions de L. 2242-11 — manquent : ${absentes.map(x => x[1]).join(" ; ")}. À défaut d'accord conforme, le régime supplétif de L. 2242-13 s'applique.` };

  const per = {};
  for (const t of Object.values(THEMES)) {
    const p = nombre((acc.periodicites || {})[t.cle]);
    if (p !== null && p > 4)
      return { regime: "supplétif", article: "L. 2242-13", accordInvalide: true,
        motif: `L'accord fixe une périodicité de ${p} ans pour « ${t.titre} » : L. 2242-11 impose que chaque thème soit négocié au moins tous les quatre ans.` };
    per[t.cle] = p !== null ? p : 4; /* l'accord peut être muet sur un thème : au moins tous les quatre ans */
  }
  return { regime: "accord de méthode", article: "L. 2242-11", periodicites: per,
    motif: `Un accord de méthode conforme fixe les périodicités (durée de ${duree} an(s), les cinq mentions présentes) : ce sont elles qui commandent le calendrier.` };
}

/* Les échéances : pour chaque thème dû, la périodicité applicable, la date de
   la dernière négociation engagée et le retard éventuel, comptés en mois. */
function echeances(f) {
  const r = regime(f), s = seuil300(f);
  const dateAudit = f.dateAudit;
  const out = { regime: r, seuil: s, themes: {} };
  for (const t of Object.values(THEMES)) {
    const du = t.seuil === null ? true : (s.connu ? s.atteint : null);
    const mois = r.regime === "accord de méthode"
      ? (r.periodicites[t.cle] || 4) * 12
      : t.supplAnnees * 12;
    const nego = (f.negos || {})[t.cle] || {};
    let etat = null, retardMois = null;
    if (r.regime === "indéterminé" || du === null) etat = "indéterminé";
    else if (du === false) etat = "non dû";
    else if (!renseigne(nego.dateEngagement)) etat = "jamais engagée ou non renseignée";
    else {
      const e = D.ecart(nego.dateEngagement, dateAudit);
      if (!e.valide) etat = "dates inexploitables : " + (e.motif || e.cause);
      else {
        const ecMois = e.jours / 30.4375;
        retardMois = Math.round((ecMois - mois) * 10) / 10;
        etat = ecMois <= mois ? "à jour" : "en retard";
      }
    }
    out.themes[t.cle] = { ...t, du, periodiciteMois: mois, nego, etat, retardMois };
  }
  return out;
}

/* La demande syndicale de L. 2242-13, dernier alinéa : transmission aux autres
   organisations dans les huit jours, convocation dans les quinze jours. */
function demandeSyndicale(f) {
  const d = f.demandeSyndicale || {};
  if (!renseigne(d.recue)) return { connue: false, motif: "Il n'est pas indiqué si une organisation syndicale a demandé l'ouverture d'une négociation." };
  if (nie(d.recue)) return { connue: true, recue: false, motif: "Aucune demande syndicale d'ouverture de négociation n'est déclarée." };
  const out = { connue: true, recue: true };
  const t = D.ecart(d.date, d.dateTransmissionAutresOS);
  out.transmission = !renseigne(d.dateTransmissionAutresOS) ? { fait: false, motif: "La transmission de la demande aux autres organisations représentatives n'est pas datée." }
    : !t.valide ? { fait: null, motif: t.motif || "Dates de transmission inexploitables." }
    : { fait: t.jours <= 8, jours: t.jours };
  const c = D.ecart(d.date, d.dateConvocation);
  out.convocation = !renseigne(d.dateConvocation) ? { fait: false, motif: "La convocation des parties n'est pas datée." }
    : !c.valide ? { fait: null, motif: c.motif || "Dates de convocation inexploitables." }
    : { fait: c.jours <= 15, jours: c.jours };
  return out;
}

module.exports = { THEMES, MENTIONS, assujettissement, seuil300, regime, echeances, demandeSyndicale };

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

__def("./controles-nao.js", function(module, exports, require){
/* Les contrôles de la négociation obligatoire en entreprise.

   L'objet du module : vérifier que l'employeur a engagé, mené et conclu les
   négociations que la loi lui impose — aux périodicités qui s'imposent à lui —
   et mesurer ce à quoi il s'expose quand il ne l'a pas fait.

   Une chose ne se contrôle pas et il faut le dire ici : AUCUN TEXTE N'OBLIGE À
   CONCLURE. L'obligation est de négocier, sérieusement et loyalement
   (L. 2242-6) ; l'échec se constate par un procès-verbal de désaccord
   (L. 2242-5). Aucun contrôle ne rend donc « non conforme » au motif qu'aucun
   accord n'a été signé — mais l'absence de toute issue formalisée, elle, se
   constate.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ». */
const M = require("./moteur-nao.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Le garde commun : sans section syndicale, rien n'est dû ; sans réponse sur
   ce point, rien ne se contrôle. */
function siAssujetti(f, suite) {
  const a = M.assujettissement(f);
  if (a.du === null) return { etat: MANQ, motif: a.motif };
  if (a.du === false) return { etat: SO, motif: a.motif };
  return suite(a);
}

/* Le second garde : un régime indéterminé n'autorise aucun contrôle de
   périodicité — on ne mesure pas un retard sur un calendrier inconnu. */
function siRegimeConnu(f, suite) {
  return siAssujetti(f, () => {
    const r = M.regime(f);
    if (r.regime === "indéterminé") return { etat: MANQ, motif: r.motif };
    return suite(r);
  });
}

const nego = (f, cle) => (f.negos || {})[cle] || {};

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------------- le régime */

ctl("NAO-CTL-REG-01", "Régime applicable",
  "L'assujettissement à l'obligation de négocier est-il établi ?",
  ["L. 2242-1"],
  f => siAssujetti(f, a => ({ etat: CONF, motif: a.motif })));

ctl("NAO-CTL-REG-02", "Régime applicable",
  "Le calendrier qui s'impose à l'entreprise est-il identifié — accord de méthode conforme, ou régime supplétif ?",
  ["L. 2242-10", "L. 2242-11", "L. 2242-13"],
  f => siRegimeConnu(f, r => {
    if (r.accordInvalide) return { etat: NC, motif: r.motif };
    return { etat: CONF, motif: r.motif };
  }));

/* -------------------------------------------------------- les périodicités */

function ctlPeriodicite(id, cle, penalite) {
  const t = M.THEMES[cle];
  ctl(id, "Périodicité des négociations",
    `La négociation « ${t.titre} » a-t-elle été engagée dans la périodicité applicable ?`,
    [t.fondement, "L. 2242-13"],
    f => siRegimeConnu(f, () => {
      const e = M.echeances(f).themes[cle];
      if (e.du === null) return { etat: MANQ, motif: M.seuil300(f).motif };
      if (e.du === false) return { etat: SO, motif: M.seuil300(f).motif };
      if (/jamais engagée/.test(e.etat))
        return { etat: MANQ, motif: `Aucune date d'engagement n'est renseignée pour cette négociation. Si elle n'a réellement jamais été engagée, le manquement est constitué — la périodicité applicable est de ${e.periodiciteMois / 12} an(s)${penalite ? ", et " + penalite : ""}.` };
      if (/inexploitables/.test(e.etat)) return { etat: MANQ, motif: e.etat };
      if (e.etat === "en retard")
        return { etat: NC, motif: `Dernière négociation engagée le ${e.nego.dateEngagement} : la périodicité de ${e.periodiciteMois / 12} an(s) est dépassée d'environ ${e.retardMois} mois au ${f.dateAudit}${penalite ? ". " + penalite : "."}` };
      return { etat: CONF, motif: `Négociation engagée le ${e.nego.dateEngagement} : la périodicité de ${e.periodiciteMois / 12} an(s) est tenue au ${f.dateAudit}.` };
    }));
}
ctlPeriodicite("NAO-CTL-PER-01", "remuneration",
  "le défaut de négociation sur les salaires effectifs expose à la pénalité de L. 2242-7 — jusqu'à 10 % des exonérations de cotisations de L. 241-13 du code de la sécurité sociale, portés à 100 % en cas de manquement réitéré dans les six ans");
ctlPeriodicite("NAO-CTL-PER-02", "egalite",
  "l'absence d'accord ou de plan d'action expose à la pénalité de L. 2242-8 — jusqu'à 1 % des rémunérations");
ctlPeriodicite("NAO-CTL-PER-03", "gepp", "");
ctlPeriodicite("NAO-CTL-PER-04", "experimentes", "");

/* ------------------------------------------------- la demande syndicale */

ctl("NAO-CTL-DEM-01", "Demande syndicale",
  "Une demande syndicale d'ouverture a-t-elle été suivie de la transmission sous huit jours et de la convocation sous quinze ?",
  ["L. 2242-13, dernier alinéa"],
  f => siAssujetti(f, () => {
    const d = M.demandeSyndicale(f);
    if (!d.connue) return { etat: MANQ, motif: d.motif };
    if (!d.recue) return { etat: SO, motif: d.motif };
    const griefs = [];
    if (d.transmission.fait === false) griefs.push(d.transmission.motif || `transmission aux autres organisations en ${d.transmission.jours} jours, pour huit au plus`);
    if (d.transmission.fait === null) return { etat: MANQ, motif: d.transmission.motif };
    if (d.convocation.fait === false) griefs.push(d.convocation.motif || `convocation des parties en ${d.convocation.jours} jours, pour quinze au plus`);
    if (d.convocation.fait === null) return { etat: MANQ, motif: d.convocation.motif };
    if (griefs.length) return { etat: NC, motif: `La demande syndicale n'a pas été traitée dans les délais de L. 2242-13 : ${griefs.join(" ; ")}.` };
    return { etat: CONF, motif: `Demande syndicale transmise aux autres organisations en ${d.transmission.jours} jour(s) et parties convoquées en ${d.convocation.jours} jour(s) : les délais de huit et quinze jours sont tenus.` };
  }));

/* ------------------------------------------------------------ la loyauté */

ctl("NAO-CTL-LOY-01", "Loyauté de la négociation",
  "La première réunion a-t-elle fixé le lieu, le calendrier, les informations remises et la date de leur remise ?",
  ["L. 2242-14"],
  f => siAssujetti(f, () => {
    const r = f.premiereReunion || {};
    if (vide(r.date)) return { etat: MANQ, motif: "La première réunion de négociation n'est pas datée. L. 2242-14 impose d'y fixer le lieu et le calendrier des réunions, les informations remises et la date de cette remise." };
    const manques = [];
    if (!dit(r.lieuCalendrierFixes)) manques.push("le lieu et le calendrier des réunions");
    if (!dit(r.informationsRemises)) manques.push("les informations remises aux négociateurs");
    if (vide(r.dateRemiseInformations)) manques.push("la date de remise de ces informations");
    if (manques.length)
      return { etat: NC, motif: `La première réunion du ${r.date} n'a pas fixé : ${manques.join(" ; ")} (L. 2242-14). Sans ces éléments, l'engagement sérieux et loyal de la négociation n'est pas établi.` };
    return { etat: CONF, motif: `Première réunion du ${r.date} : lieu, calendrier, informations et date de remise fixés, conformément à L. 2242-14.` };
  }));

ctl("NAO-CTL-LOY-02", "Loyauté de la négociation",
  "Les conditions de dépôt d'un accord sur les salaires effectifs sont-elles réunies — procès-verbal d'ouverture des négociations sur les écarts de rémunération, réponses motivées aux propositions syndicales ?",
  ["L. 2242-6"],
  f => siAssujetti(f, () => {
    const n = nego(f, "remuneration");
    if (n.issue !== "accord") return { etat: SO, motif: "Aucun accord sur les salaires effectifs n'est déclaré : les conditions de dépôt de L. 2242-6 n'ont pas d'objet." };
    const manques = [];
    if (!dit(n.pvOuvertureEcarts)) manques.push("le procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes, qui doit accompagner le dépôt");
    if (!dit(f.reponsesMotivees)) manques.push("la réponse motivée aux propositions des organisations syndicales, que L. 2242-6 range dans l'engagement sérieux et loyal");
    if (manques.length) return { etat: NC, motif: `L'accord sur les salaires effectifs ne peut pas être régulièrement déposé : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Accord sur les salaires effectifs accompagné du procès-verbal d'ouverture des négociations sur les écarts femmes-hommes, et réponses motivées apportées : les conditions de L. 2242-6 sont réunies." };
  }));

ctl("NAO-CTL-UNI-01", "Loyauté de la négociation",
  "Des décisions unilatérales ont-elles été prises dans les matières en cours de négociation ?",
  ["L. 2242-4"],
  f => siAssujetti(f, () => {
    const d = f.decisionUnilaterale || {};
    if (vide(d.prise)) return { etat: MANQ, motif: "Il n'est pas indiqué si des décisions unilatérales concernant la collectivité des salariés ont été arrêtées pendant une négociation en cours." };
    if (nie(d.prise)) return { etat: CONF, motif: "Aucune décision unilatérale n'a été arrêtée dans les matières en cours de négociation : L. 2242-4 est respecté." };
    if (dit(d.urgence)) return { etat: RISQ, motif: `Une décision unilatérale a été prise pendant la négociation${vide(d.matiere) ? "" : " (" + d.matiere + ")"}, l'urgence étant invoquée. L. 2242-4 la réserve au cas où « l'urgence le justifie » : cette justification s'apprécie au fond, elle doit pouvoir être documentée.` };
    return { etat: NC, motif: `Une décision unilatérale concernant la collectivité des salariés a été arrêtée pendant la négociation${vide(d.matiere) ? "" : " (" + d.matiere + ")"}, sans urgence justifiée : L. 2242-4 l'interdit tant que la négociation est en cours.` };
  }));

/* -------------------------------------------------------------- l'issue */

ctl("NAO-CTL-ISS-01", "Issue des négociations",
  "Chaque négociation terminée s'est-elle conclue par un accord déposé ou un procès-verbal de désaccord déposé ?",
  ["L. 2242-5", "R. 2242-1"],
  f => siAssujetti(f, () => {
    const griefs = [], vus = [];
    for (const t of Object.values(M.THEMES)) {
      const n = nego(f, t.cle);
      if (vide(n.issue) || n.issue === "en cours" || n.issue === "aucune") continue;
      vus.push(t.cle);
      if (n.issue === "accord" && !dit(n.depot))
        griefs.push(`« ${t.titre} » : accord conclu mais dépôt non établi (L. 2231-6)`);
      if (n.issue === "PV de désaccord" && !dit(n.depot))
        griefs.push(`« ${t.titre} » : procès-verbal de désaccord non déposé — L. 2242-5 et R. 2242-1 imposent son dépôt dans les conditions de D. 2231-2, avec les dernières propositions des parties et les mesures que l'employeur entend appliquer unilatéralement`);
    }
    if (!vus.length) return { etat: MANQ, motif: "Aucune négociation n'est déclarée terminée (accord ou procès-verbal de désaccord) : l'issue ne peut pas être contrôlée." };
    if (griefs.length) return { etat: NC, motif: griefs.join(" ; ") + "." };
    return { etat: CONF, motif: `Chaque négociation terminée a son issue formalisée et déposée (${vus.length} négociation(s)).` };
  }));

/* ------------------------------------------------------------- l'égalité */

ctl("NAO-CTL-EGA-01", "Égalité professionnelle",
  "À défaut d'accord sur l'égalité professionnelle, un plan d'action annuel a-t-il été établi et déposé ?",
  ["L. 2242-3"],
  f => siAssujetti(f, () => {
    const n = nego(f, "egalite");
    if (n.issue === "accord") return { etat: SO, motif: "Un accord sur l'égalité professionnelle est déclaré : le plan d'action supplétif de L. 2242-3 n'a pas d'objet." };
    if (vide(n.issue) || n.issue === "en cours") return { etat: MANQ, motif: "L'issue de la négociation sur l'égalité professionnelle n'est pas établie : le besoin d'un plan d'action ne peut pas être apprécié." };
    const p = n.planAction || {};
    if (!dit(p.existe))
      return { etat: NC, motif: "Aucun accord sur l'égalité professionnelle et aucun plan d'action annuel : L. 2242-3 impose ce plan — objectifs de progression, actions qualitatives et quantitatives, coût — et son dépôt auprès de l'autorité administrative. La négociation sur les salaires effectifs doit alors porter aussi sur la programmation des mesures de suppression des écarts." };
    if (!dit(p.depot))
      return { etat: NC, motif: "Le plan d'action égalité existe mais son dépôt auprès de l'autorité administrative n'est pas établi : L. 2242-3 l'impose." };
    return { etat: CONF, motif: "À défaut d'accord, un plan d'action annuel est établi et déposé, conformément à L. 2242-3." };
  }));

ctl("NAO-CTL-EGA-02", "Égalité professionnelle",
  "L'entreprise d'au moins cinquante salariés est-elle couverte — accord ou plan d'action — et l'index de L. 1142-8 est-il publié ?",
  ["L. 2242-8"],
  f => siAssujetti(f, () => {
    const eff = typeof f.effectif === "number" ? f.effectif : null;
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné : la pénalité de L. 2242-8 vise les entreprises d'au moins cinquante salariés." };
    if (eff < 50) return { etat: SO, motif: `Effectif de ${eff} salariés : la pénalité de L. 2242-8 vise les entreprises d'au moins cinquante salariés.` };
    const n = nego(f, "egalite");
    const couvert = n.issue === "accord" || dit((n.planAction || {}).existe);
    const index = f.indexEgalitePublie;
    if (!couvert)
      return { etat: NC, motif: "Ni accord d'égalité professionnelle ni plan d'action : l'entreprise s'expose à la pénalité de L. 2242-8, jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes." };
    if (vide(index)) return { etat: MANQ, motif: "La couverture est acquise (accord ou plan), mais la publication des indicateurs d'écarts de rémunération (L. 1142-8) n'est pas renseignée : son absence expose à la même pénalité (L. 2242-8, quatrième alinéa)." };
    if (nie(index))
      return { etat: NC, motif: "Les indicateurs d'écarts de rémunération de L. 1142-8 ne sont pas publiés : L. 2242-8 permet d'appliquer la pénalité de 1 % à ce seul titre." };
    return { etat: CONF, motif: "Accord ou plan d'action en vigueur et indicateurs de L. 1142-8 publiés : la pénalité de L. 2242-8 est écartée en l'état." };
  }));

/* -------------------------------------------------------------- le contenu */

const ITEMS_REMUNERATION = [
  ["salaires", "les salaires effectifs (1°)"],
  ["temps de travail", "la durée effective et l'organisation du temps de travail (2°)"],
  ["épargne salariale", "l'intéressement, la participation et l'épargne salariale à défaut de dispositif (3°)"],
  ["écarts femmes-hommes", "le suivi des mesures de suppression des écarts de rémunération entre les femmes et les hommes (4°)"],
];
const ITEMS_EGALITE = [
  ["articulation", "l'articulation entre vie personnelle et vie professionnelle (1°)"],
  ["écarts femmes-hommes", "les objectifs et mesures d'égalité professionnelle, dont la suppression des écarts de rémunération (2°)"],
  ["discriminations", "la lutte contre les discriminations (3°)"],
  ["handicap", "l'insertion et le maintien dans l'emploi des travailleurs handicapés (4°), sur le rapport de L. 2242-18"],
  ["prévoyance", "la prévoyance et les remboursements complémentaires à défaut de couverture (5°)"],
  ["déconnexion", "l'exercice du droit à la déconnexion (6°)"],
];
function ctlContenu(id, cle, items, fondement) {
  const t = M.THEMES[cle];
  ctl(id, "Contenu des négociations",
    `La négociation « ${t.titre} » a-t-elle couvert les thèmes que ${fondement} énumère ?`,
    [fondement],
    f => siAssujetti(f, () => {
      const n = nego(f, cle);
      if (vide(n.dateEngagement)) return { etat: SO, motif: "Cette négociation n'est pas déclarée engagée : son contenu n'a pas d'objet — sa périodicité, elle, est contrôlée par ailleurs." };
      const traites = Array.isArray(n.themesTraites) ? n.themesTraites : [];
      if (!traites.length) return { etat: MANQ, motif: "Les thèmes traités ne sont pas renseignés : la couverture du contenu légal ne peut pas être appréciée." };
      const absents = items.filter(([marque]) => !traites.includes(marque));
      if (!absents.length) return { etat: CONF, motif: `Les ${items.length} thèmes de ${fondement} sont couverts.` };
      return { etat: RISQ, motif: `${absents.length} thème(s) de ${fondement} ne sont pas rattachés à la négociation : ${absents.map(x => x[1]).join(" ; ")}. Un thème légal laissé hors de la table doit l'être en connaissance de cause — l'obligation porte sur la négociation du thème, pas sur sa conclusion.` };
    }));
}
ctlContenu("NAO-CTL-CON-01", "remuneration", ITEMS_REMUNERATION, "L. 2242-15");
ctlContenu("NAO-CTL-CON-02", "egalite", ITEMS_EGALITE, "L. 2242-17");

ctl("NAO-CTL-CON-03", "Contenu des négociations",
  "La négociation sur l'égalité professionnelle s'est-elle appuyée sur les données de la base (BDESE) ?",
  ["L. 2242-17, 2°"],
  f => siAssujetti(f, () => {
    const n = nego(f, "egalite");
    if (vide(n.dateEngagement)) return { etat: SO, motif: "La négociation égalité n'est pas déclarée engagée : l'appui sur la base n'a pas d'objet." };
    if (vide(n.appuiBDESE)) return { etat: MANQ, motif: "Il n'est pas indiqué si la négociation s'est appuyée sur les données de la base de données économiques, sociales et environnementales. L. 2242-17, 2°, l'impose : « cette négociation s'appuie sur les données mentionnées au 2° de l'article L. 2312-36 »." };
    if (nie(n.appuiBDESE))
      return { etat: NC, motif: "La négociation sur l'égalité professionnelle a été conduite sans s'appuyer sur les données de la base : L. 2242-17, 2°, l'impose. Des négociateurs privés du diagnostic comparé femmes-hommes de la base ne négocient pas en connaissance de cause — c'est un grief de loyauté autant que de contenu. Le module « base de données (BDESE) » de cette application audite la rubrique en cause." };
    return { etat: CONF, motif: "La négociation s'est appuyée sur les données de la base, comme L. 2242-17, 2°, l'impose." };
  }));

/* ------------------------------------------------------------ l'exposition */

ctl("NAO-CTL-PEN-01", "Exposition aux sanctions",
  "À quoi l'entreprise s'expose-t-elle en l'état du dossier ?",
  ["L. 2242-7", "L. 2242-8", "L. 2243-1", "L. 2243-2"],
  f => siRegimeConnu(f, () => {
    const e = M.echeances(f);
    const retards = Object.values(e.themes).filter(t => t.etat === "en retard");
    const inconnus = Object.values(e.themes).filter(t => /jamais engagée|inexploitables/.test(t.etat) && t.du === true);
    if (retards.length) {
      const l = retards.map(t => `« ${t.titre} »`).join(", ");
      return { etat: NC, motif: `Négociation(s) hors périodicité : ${l}. L'exposition est triple — le délit d'entrave de L. 2243-1 et L. 2243-2 (un an d'emprisonnement, 3 750 € d'amende), la pénalité salaires de L. 2242-7 s'agissant de la rémunération, la pénalité de 1 % de L. 2242-8 s'agissant de l'égalité. Le montant en est fixé par l'administration selon les efforts constatés : c'est une exposition, pas un chiffrage.` };
    }
    if (inconnus.length) return { etat: MANQ, motif: "Des négociations dues n'ont pas de date d'engagement renseignée : l'exposition ne peut pas être appréciée." };
    return { etat: RISQ, motif: "Aucun manquement de périodicité constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : la loyauté de chaque négociation (L. 2242-6, L. 2242-14) et la couverture égalité (L. 2242-8) s'apprécient en continu — ce contrôle ne prononce jamais un blanc-seing." };
  }));

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["NAO-CTL-PEN-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE };

});

  global.MoteurNAO = {
    audit: require("./audit-nao-client.js"),

    moteur: require("./moteur-nao.js"),
    controles: require("./controles-nao.js"),
    manifeste: __MANIFESTE,
    champs: [["Identité",[["entreprise","Dénomination sociale","texte"],["dateAudit","Date à laquelle la situation est décrite","AAAA-MM-JJ"],["effectif","Effectif de l'entreprise","nombre"],["groupe","L'entreprise appartient-elle à un groupe (L. 2331-1) ?","oui / non"],["effectifGroupe","Effectif total du groupe","nombre"],["dimensionCommunautaire","Le groupe est-il de dimension communautaire ?","oui / non"],["effectifFrance","Effectif employé en France si le groupe est communautaire","nombre"]]],["Le déclencheur",[["sectionsSyndicales","Une ou plusieurs sections syndicales d'organisations représentatives sont-elles constituées ?","oui / non"]]],["L'accord de méthode",[["accordMethode.existe","Un accord fixe-t-il le calendrier, la périodicité, les thèmes et les modalités des négociations ?","oui / non"],["accordMethode.verse","Cet accord est-il joint au dossier ?","oui / non"],["accordMethode.dureeAns","Durée de l'accord, en années","nombre"],["accordMethode.mentions","Mentions que l'accord porte : themes, contenu, calendrier, informations, suivi","liste"],["accordMethode.periodicites","Périodicités fixées par thème, en années","objet"]]],["Les négociations menées",[["negos.remuneration","Rémunération : date d'engagement, issue, dépôt, procès-verbal d'ouverture sur les écarts, thèmes traités","objet"],["negos.egalite","Égalité et qualité de vie : date d'engagement, issue, dépôt, plan d'action, thèmes traités, appui sur la BDESE","objet"],["negos.gepp","Gestion des emplois et des parcours : date d'engagement, issue, dépôt","objet"],["negos.experimentes","Salariés expérimentés : date d'engagement, issue","objet"]]],["La conduite",[["premiereReunion.date","Date de la première réunion","AAAA-MM-JJ"],["premiereReunion.lieuCalendrierFixes","Le lieu et le calendrier des réunions y ont-ils été fixés ?","oui / non"],["premiereReunion.informationsRemises","Les informations ont-elles été remises aux négociateurs ?","oui / non"],["premiereReunion.dateRemiseInformations","Date de remise de ces informations","AAAA-MM-JJ"],["reponsesMotivees","Les propositions syndicales ont-elles reçu une réponse motivée ?","oui / non"],["decisionUnilaterale.prise","Une décision unilatérale a-t-elle été arrêtée dans une matière en cours de négociation ?","oui / non"],["decisionUnilaterale.matiere","Si oui, laquelle","texte"],["decisionUnilaterale.urgence","L'urgence était-elle invoquée ?","oui / non"]]],["La demande syndicale",[["demandeSyndicale.recue","Une organisation syndicale a-t-elle demandé l'ouverture d'une négociation ?","oui / non"],["demandeSyndicale.date","Date de cette demande","AAAA-MM-JJ"],["demandeSyndicale.dateTransmissionAutresOS","Date de transmission aux autres organisations représentatives","AAAA-MM-JJ"],["demandeSyndicale.dateConvocation","Date de convocation des parties","AAAA-MM-JJ"]]],["L'égalité professionnelle",[["indexEgalitePublie","Les indicateurs d'écarts de rémunération (index de L. 1142-8) sont-ils publiés ?","oui / non"]]],["Pièces",[["pieces","Pièces versées au dossier","liste d'objets"]]]],
    propositions: {"sectionsSyndicales":{"valeurs":["oui","non"],"libre":false,"aide":"Une section syndicale existe dès qu'un syndicat représentatif a désigné un délégué syndical ou constitué une section. C'est elle — pas l'effectif — qui oblige à négocier. Sans section syndicale : rien n'est dû."},"groupe":{"valeurs":["oui","non"],"libre":false,"aide":"Le groupe au sens du comité de groupe : une entreprise dominante et celles qu'elle contrôle. Il compte pour le seuil de 300 salariés des négociations triennales."},"dimensionCommunautaire":{"valeurs":["oui","non"],"libre":false,"aide":"Un groupe présent dans plusieurs pays de l'Union. S'il emploie au moins 150 salariés en France, les négociations triennales sont dues."},"accordMethode.existe":{"valeurs":["oui","non"],"libre":false,"aide":"Un accord peut organiser vos négociations : quels thèmes, tous les combien (au plus tous les 4 ans), avec quelles informations. Sans accord, la loi impose son rythme : rémunération et égalité chaque année, gestion des emplois tous les 3 ans à partir de 300 salariés."},"accordMethode.verse":{"valeurs":["oui","non"],"libre":false,"aide":"Joignez-le. C'est lui qui fixe votre calendrier : sans son texte, l'audit ne peut pas dire si vous êtes à jour."},"accordMethode.mentions":{"valeurs":["themes","contenu","calendrier","informations","suivi"],"libre":false,"multiple":true,"aide":"Les cinq mentions que la loi impose à cet accord : les thèmes et leur périodicité, le contenu de chacun, le calendrier et les lieux, les informations remises et leur date, le suivi des engagements. S'il en manque une, l'accord ne fait pas écran et le rythme légal s'applique."},"negos.remuneration.issue":{"valeurs":["accord","PV de désaccord","en cours","aucune"],"libre":false,"aide":"Comment la négociation s'est terminée. La loi n'oblige pas à conclure — elle oblige à négocier, et à formaliser l'échec par un procès-verbal de désaccord, déposé."},"negos.egalite.issue":{"valeurs":["accord","PV de désaccord","en cours","aucune"],"libre":false,"aide":"Même règle. Attention : sans accord sur l'égalité, un plan d'action annuel devient obligatoire, et il se dépose."},"negos.gepp.issue":{"valeurs":["accord","PV de désaccord","en cours","aucune"],"libre":false,"aide":"Même règle, pour la gestion des emplois et des parcours professionnels."},"negos.experimentes.issue":{"valeurs":["accord","PV de désaccord","en cours","aucune"],"libre":false,"aide":"Même règle, pour la négociation sur les salariés expérimentés."},"negos.remuneration.depot":{"valeurs":["oui","non"],"libre":false,"aide":"Accord comme procès-verbal de désaccord se déposent auprès de l'administration. Un texte signé mais non déposé n'est pas en règle."},"negos.egalite.depot":{"valeurs":["oui","non"],"libre":false,"aide":"Même règle de dépôt."},"negos.gepp.depot":{"valeurs":["oui","non"],"libre":false,"aide":"Même règle de dépôt."},"negos.remuneration.pvOuvertureEcarts":{"valeurs":["oui","non"],"libre":false,"aide":"Un accord sur les salaires ne peut être déposé qu'accompagné du procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes. Sans lui, le dépôt sera refusé."},"negos.remuneration.themesTraites":{"valeurs":["salaires","temps de travail","épargne salariale","écarts femmes-hommes"],"libre":false,"multiple":true,"aide":"Les quatre thèmes que la loi met sur la table pour cette négociation. Cochez ceux qui y ont réellement été traités."},"negos.egalite.themesTraites":{"valeurs":["articulation","écarts femmes-hommes","discriminations","handicap","prévoyance","déconnexion"],"libre":false,"multiple":true,"aide":"Les six thèmes que la loi met sur la table pour cette négociation. Cochez ceux qui y ont réellement été traités."},"negos.egalite.appuiBDESE":{"valeurs":["oui","non"],"libre":false,"aide":"La loi impose que cette négociation s'appuie sur les données de la BDESE — le diagnostic comparé femmes-hommes. Remettez ces extraits aux négociateurs, et gardez la preuve de la remise."},"negos.egalite.planAction.existe":{"valeurs":["oui","non"],"libre":false,"aide":"Sans accord sur l'égalité, un plan d'action annuel est obligatoire : objectifs de progression, actions chiffrées, coût."},"negos.egalite.planAction.depot":{"valeurs":["oui","non"],"libre":false,"aide":"Le plan d'action se dépose auprès de l'administration, comme un accord."},"premiereReunion.lieuCalendrierFixes":{"valeurs":["oui","non"],"libre":false,"aide":"La première réunion doit fixer le lieu et le calendrier des suivantes. C'est une exigence de loyauté, pas une formalité."},"premiereReunion.informationsRemises":{"valeurs":["oui","non"],"libre":false,"aide":"Les négociateurs doivent recevoir les informations nécessaires pour négocier en connaissance de cause, et savoir quand ils les recevront."},"reponsesMotivees":{"valeurs":["oui","non"],"libre":false,"aide":"Répondre — et répondre motivé — aux propositions syndicales fait partie de la négociation loyale. Le silence se retient contre l'employeur."},"decisionUnilaterale.prise":{"valeurs":["oui","non"],"libre":false,"aide":"Pendant qu'une négociation est en cours, l'employeur ne peut pas décider seul dans les matières discutées, sauf urgence justifiée."},"decisionUnilaterale.urgence":{"valeurs":["oui","non"],"libre":false,"aide":"L'urgence est l'exception que la loi réserve. Elle se prouve : gardez ce qui l'établit."},"demandeSyndicale.recue":{"valeurs":["oui","non"],"libre":false,"aide":"Quand un syndicat demande l'ouverture d'une négociation en retard, l'employeur transmet la demande aux autres syndicats sous 8 jours et convoque tout le monde sous 15 jours."},"indexEgalitePublie":{"valeurs":["oui","non"],"libre":false,"aide":"L'index de l'égalité professionnelle (écarts de rémunération) doit être publié chaque année à partir de 50 salariés. Sa non-publication expose, à elle seule, à la pénalité de 1 %."},"pieces":{"valeurs":[],"autres":["accord-methode","pv-desaccord","plan-action-egalite"],"libre":true,"multiple":true,"indicatif":true,"aide":"Les documents que vous joignez. Un accord ne se prouve que par son texte."}},
    listes: [],
    colonnes: {},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
