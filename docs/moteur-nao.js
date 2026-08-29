/* Moteur d'audit « nao » — version navigateur (MoteurNAO).

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/nao, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : b7b9b737d240
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
  var __MANIFESTE = {"domaine":"négociation obligatoire en entreprise","date":"2026-08-29","empreinte":"b7b9b737d240","fichiers":{"audit-nao-client.js":"603e28ffbdac","capturer-textes-nao.js":"bcd982d41682","controles-nao.js":"c2382c72e67d","dates.js":"5d945470174f","fiche-nao.json":"024305b6b0ab","modeles-nao.js":"89e498d43a4a","moteur-nao.js":"7bb1df1b203e","outils.js":"6defb2be2a2b","propositions-nao.js":"6b34f8a501b8","questionnaire-nao.js":"95b08d4cec5d","regularisation-nao.js":"e121df124842","tests-nao.js":"47348a66d9a8","textes-nao.json":"c1d78ef830d2","verifier-textes-nao.js":"ab8c5ba9fb97"},"compteurs":{"articlesLus":25,"themes":4,"mentionsAccordMethode":5,"controles":17,"exposition":1,"coherence":0,"donneesDemandees":31,"casContradictoires":15,"verdicts":289,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0},"textesRelus":{"date":"2026-08-21","articles":25,"concordants":25,"ecarts":0,"sansConclusion":0}};
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
const { R } = require("./regularisation-nao.js");
const { MODELES } = require("./modeles-nao.js");
const DT = require("../commun/parcours-deux-temps.js");

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
   modeles-nao.js. Rend null si aucun modèle n'est écrit pour cet id. */
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

/* Les décisions, citées telles qu'elles ont été lues.

   Chacune a été lue à la source dans la base Judilibre de la Cour de cassation
   le 21 août 2026, réponse non relaxée, et n'est citée que pour ce qu'elle dit.
   Le sommaire publié, quand il existe, fixe la limite de ce qu'on lui fait
   dire : rien n'est étendu au-delà. */
const ARRETS = {
  finDesNegociations: "Soc., 15 avril 2026, n° 24-15.653, publié : « Il résulte des articles L. 2242-1, L. 2242-4 et L. 2242-5 du code du travail que les négociations obligatoires ne peuvent être considérées comme ayant pris fin avant l'établissement d'un procès-verbal de désaccord. » La Cour censure la cour d'appel qui avait tenu la négociation pour close alors que le procès-verbal de désaccord avait été établi le 16 avril quand le syndicat avait accepté la dernière proposition le 12 : à cette date, les négociations étaient toujours en cours.",
  niveauxParAccord: "Soc., 3 avril 2024, n° 22-15.784, publié : « Il résulte de l'article L. 2242-1 du code du travail […] et de l'article L. 2242-10 du même code qu'un accord collectif négocié et signé aux conditions de droit commun peut définir, dans les entreprises comportant des établissements distincts, les niveaux auxquels la négociation obligatoire visée à l'article L. 2242-1 du code du travail est conduite. » L'accord en cause, intitulé accord de méthode, identifiait trois périmètres de négociation et les sujets de chacun.",
  gepp: "Soc., 11 septembre 2024, n° 23-14.333, publié : « Il résulte des articles L. 2242-2, L. 2242-20 du code du travail et L. 2312-22 du même code […] que l'obligation de négociation sur la gestion des emplois et des parcours professionnels est subordonnée à l'existence d'une ou plusieurs organisations syndicales représentatives au niveau de l'entreprise. » Une désignation limitée à un établissement ne suffit donc pas à faire courir le délai.",
  engagerNonConclure: "2e Civ., 7 novembre 2019, n° 18-21.499, publié : « L'employeur est seulement tenu, pour bénéficier de la réduction des cotisations à sa charge sur les bas salaires prévue par l'article L. 241-13, III, du code de la sécurité sociale, d'engager la négociation annuelle obligatoire prévue par l'article L. 2242-8, 1°, du code du travail, et non de parvenir à la conclusion d'un accord. » L'arrêt approuve la cour d'appel qui avait retenu que l'ouverture des négociations en 2014 justifiait l'exonération de cette année-là, peu important que l'accord n'ait été conclu qu'en janvier 2015.",
};

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------------- le régime */

ctl("NAO-CTL-REG-01", "Régime applicable",
  "L'assujettissement à l'obligation de négocier est-il établi ?",
  ["L. 2242-1", "L. 2242-2", "Soc., 11 septembre 2024, n° 23-14.333"],
  f => siAssujetti(f, a => ({ etat: CONF, motif: a.motif +
    " La représentativité s'apprécie au niveau de l'entreprise, non d'un seul établissement : " + ARRETS.gepp })));

ctl("NAO-CTL-REG-02", "Régime applicable",
  "Le calendrier qui s'impose à l'entreprise est-il identifié — accord de méthode conforme, ou régime supplétif ?",
  ["L. 2242-10", "L. 2242-11", "L. 2242-13", "Soc., 3 avril 2024, n° 22-15.784"],
  f => siRegimeConnu(f, r => {
    if (r.accordInvalide) return { etat: NC, motif: r.motif + " " + ARRETS.niveauxParAccord };
    return { etat: CONF, motif: r.motif +
      (r.regime === "accord de méthode"
        ? " Ce que l'accord de L. 2242-11 peut régler dépasse la seule périodicité : " + ARRETS.niveauxParAccord
        : " Rien n'interdit d'ouvrir la négociation de L. 2242-10 : elle peut être engagée à l'initiative de l'employeur comme à la demande d'une organisation syndicale représentative, et l'accord qui en sort peut aussi fixer les niveaux de négociation. " + ARRETS.niveauxParAccord) };
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
  ["L. 2242-4", "L. 2242-5", "Soc., 15 avril 2026, n° 24-15.653"],
  f => siAssujetti(f, () => {
    const d = f.decisionUnilaterale || {};
    if (vide(d.prise)) return { etat: MANQ, motif: "Il n'est pas indiqué si des décisions unilatérales concernant la collectivité des salariés ont été arrêtées pendant une négociation en cours. La question de la date compte autant que celle du contenu : " + ARRETS.finDesNegociations };
    if (nie(d.prise)) return { etat: CONF, motif: "Aucune décision unilatérale n'a été arrêtée dans les matières en cours de négociation : L. 2242-4 est respecté. Le terme de la négociation ne se décrète pas : " + ARRETS.finDesNegociations };
    if (dit(d.urgence)) return { etat: RISQ, motif: `Une décision unilatérale a été prise pendant la négociation${vide(d.matiere) ? "" : " (" + d.matiere + ")"}, l'urgence étant invoquée. L. 2242-4 la réserve au cas où « l'urgence le justifie » : cette justification s'apprécie au fond, elle doit pouvoir être documentée. ` + ARRETS.finDesNegociations };
    return { etat: NC, motif: `Une décision unilatérale concernant la collectivité des salariés a été arrêtée pendant la négociation${vide(d.matiere) ? "" : " (" + d.matiere + ")"}, sans urgence justifiée : L. 2242-4 l'interdit tant que la négociation est en cours. Une clôture annoncée par l'employeur ne suffit pas à faire courir de nouveau sa liberté de décider : ` + ARRETS.finDesNegociations };
  }));

/* -------------------------------------------------------------- l'issue */

ctl("NAO-CTL-ISS-01", "Issue des négociations",
  "Chaque négociation terminée s'est-elle conclue par un accord déposé ou un procès-verbal de désaccord déposé ?",
  ["L. 2242-5", "R. 2242-1", "Soc., 15 avril 2026, n° 24-15.653", "2e Civ., 7 novembre 2019, n° 18-21.499"],
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
    if (!vus.length) return { etat: MANQ, motif: "Aucune négociation n'est déclarée terminée (accord ou procès-verbal de désaccord) : l'issue ne peut pas être contrôlée. Le procès-verbal de désaccord n'est pas une formalité de classement — il marque le terme de la négociation. " + ARRETS.finDesNegociations };
    if (griefs.length) return { etat: NC, motif: griefs.join(" ; ") + ". " + ARRETS.finDesNegociations };
    return { etat: CONF, motif: `Chaque négociation terminée a son issue formalisée et déposée (${vus.length} négociation(s)). L'obligation porte sur la négociation, non sur sa conclusion : ${ARRETS.engagerNonConclure} Mais l'échec doit être constaté : ${ARRETS.finDesNegociations}` };
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
  ["L. 2242-7", "L. 2242-8", "L. 2243-1", "L. 2243-2", "2e Civ., 7 novembre 2019, n° 18-21.499"],
  f => siRegimeConnu(f, () => {
    const e = M.echeances(f);
    const retards = Object.values(e.themes).filter(t => t.etat === "en retard");
    const inconnus = Object.values(e.themes).filter(t => /jamais engagée|inexploitables/.test(t.etat) && t.du === true);
    if (retards.length) {
      const l = retards.map(t => `« ${t.titre} »`).join(", ");
      return { etat: NC, motif: `Négociation(s) hors périodicité : ${l}. L'exposition est triple — le délit d'entrave de L. 2243-1 et L. 2243-2 (un an d'emprisonnement, 3 750 € d'amende), la pénalité salaires de L. 2242-7 s'agissant de la rémunération, la pénalité de 1 % de L. 2242-8 s'agissant de l'égalité. Le montant en est fixé par l'administration selon les efforts constatés : c'est une exposition, pas un chiffrage. Ce qui est reproché ici est de n'avoir pas engagé la négociation, non de n'avoir pas conclu : ${ARRETS.engagerNonConclure}` };
    }
    if (inconnus.length) return { etat: MANQ, motif: "Des négociations dues n'ont pas de date d'engagement renseignée : l'exposition ne peut pas être appréciée." };
    return { etat: RISQ, motif: "Aucun manquement de périodicité constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : la loyauté de chaque négociation (L. 2242-6, L. 2242-14) et la couverture égalité (L. 2242-8) s'apprécient en continu — ce contrôle ne prononce jamais un blanc-seing. " + ARRETS.engagerNonConclure };
  }));

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["NAO-CTL-PEN-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE, ITEMS_REMUNERATION, ITEMS_EGALITE };

});

__def("./regularisation-nao.js", function(module, exports, require){
/* Ce qu'il faut faire quand un contrôle de la négociation obligatoire ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas des contrôles
   qui ne constatent rien à corriger (l'assujettissement, l'exposition aux
   sanctions), et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, chiffré et fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-nao.json, et publier-nao.js confronte les deux. */

const { C } = require("./controles-nao.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — l'accord ou la décision peut tomber",
  4: "Régularisation rapide",
};

const R = {

  /* Le contrôle constate un régime, il ne relève aucun manquement : rien à
     régulariser, et c'est écrit. */
  "NAO-CTL-REG-01": null,

  "NAO-CTL-REG-02": {
    gravite: 3,
    quoiFaire: "Établir le calendrier qui s'impose : soit conclure l'accord de méthode de L. 2242-11, soit constater que le régime supplétif annuel et triennal de L. 2242-13 s'applique.",
    risque: "Sans calendrier identifié, aucun retard ne se mesure — et l'employeur ne peut opposer aucune périodicité aménagée à une organisation syndicale qui demande l'ouverture d'une négociation.",
    delai: "Une réunion pour constater le régime ; trois à six mois si un accord de méthode est négocié.",
    document: "Accord de méthode sur la périodicité des négociations obligatoires (L. 2242-11)",
    etapes: [
      "Rechercher un accord de méthode en vigueur : l'accord de L. 2242-11 fixe la périodicité, les thèmes, le calendrier et le contenu des négociations.",
      "S'il existe, vérifier qu'il respecte les bornes de L. 2242-12 — la périodicité d'un thème ne peut excéder quatre ans — et que ses stipulations sont respectées : leur non-respect fait retomber l'entreprise dans le régime supplétif (L. 2242-13).",
      "S'il n'existe pas, ou s'il n'est pas respecté, appliquer L. 2242-13 : négociation annuelle sur la rémunération, négociation annuelle sur l'égalité professionnelle, et à partir de trois cents salariés, négociation triennale sur la gestion des emplois et négociation triennale sur les salariés expérimentés.",
      "Consigner le régime retenu par écrit, avec sa source, et le porter au dossier : c'est lui qui datera tous les retards.",
    ],
    verifs: [
      { cle: "regimeSource", question: "Sur quoi repose le calendrier que vous appliquez — un accord de méthode, ou le régime supplétif ?", attendu: "L'accord daté et déposé, ou la mention expresse du régime supplétif de L. 2242-13." },
      { cle: "regimeBornes", question: "Si un accord de méthode existe, aucune périodicité qu'il fixe ne dépasse-t-elle quatre ans ?", attendu: "L. 2242-12 plafonne à quatre ans ; au-delà, la stipulation ne tient pas." },
    ],
  },

  "NAO-CTL-PER-01": {
    gravite: 1,
    quoiFaire: "Engager la négociation sur la rémunération, le temps de travail et le partage de la valeur ajoutée.",
    risque: "Un an d'emprisonnement et 3 750 € d'amende (L. 2243-1). La pénalité de L. 2242-7 s'y ajoute : jusqu'à 10 % des exonérations de cotisations pour les périodes non couvertes.",
    delai: "Compter deux à trois mois entre la convocation et le procès-verbal.",
    document: "Convocation des organisations syndicales représentatives à la négociation annuelle",
    etapes: [
      "Recenser les organisations syndicales représentatives dans l'entreprise : toutes doivent être convoquées, sans exception.",
      "Les convoquer par écrit, en indiquant l'objet de la négociation, le lieu et la date de la première réunion.",
      "Lors de la première réunion, fixer le lieu et le calendrier des réunions, la liste des informations qui seront remises et la date de leur remise (L. 2242-14). Ce point est distinct : il est contrôlé pour lui-même.",
      "Remettre les informations à la date annoncée, et répondre de manière motivée aux propositions syndicales — c'est la condition de la loyauté (L. 2242-6).",
      "Conclure : accord signé et déposé, ou procès-verbal de désaccord établi et déposé (L. 2242-5, R. 2242-1).",
    ],
    verifs: [
      { cle: "per01Convocation", question: "À quelle date les organisations syndicales représentatives ont-elles été convoquées, et lesquelles ?", attendu: "La date et la liste ; une seule organisation oubliée suffit à vicier la négociation." },
      { cle: "per01Reunions", question: "Combien de réunions se sont tenues, et à quelles dates ?", attendu: "Les dates, avec les feuilles d'émargement ou les convocations." },
      { cle: "per01Issue", question: "Quelle a été l'issue — accord ou procès-verbal de désaccord — et à quelle date a-t-elle été déposée ?", attendu: "Le récépissé de dépôt. Sans dépôt, la négociation n'est pas achevée." },
    ],
  },

  "NAO-CTL-PER-02": {
    gravite: 1,
    quoiFaire: "Engager la négociation sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail.",
    risque: "Un an d'emprisonnement et 3 750 € d'amende (L. 2243-1), et la pénalité de L. 2242-8 — jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes.",
    delai: "Deux à trois mois.",
    document: "Convocation des organisations syndicales représentatives à la négociation sur l'égalité professionnelle",
    etapes: [
      "Convoquer toutes les organisations syndicales représentatives.",
      "Réunir les données de la base de données économiques, sociales et environnementales : L. 2242-17, 2° impose que la négociation s'appuie sur elles.",
      "Couvrir les thèmes énumérés par L. 2242-17, et non seulement les salaires : articulation des temps, suppression des écarts de rémunération, accès à l'emploi et à la formation, promotion, conditions de travail, droit à la déconnexion.",
      "À défaut d'accord, établir le plan d'action annuel de L. 2242-3 et le déposer : c'est ce plan qui couvre l'entreprise au regard de la pénalité.",
      "Déposer l'accord ou le procès-verbal de désaccord.",
    ],
    verifs: [
      { cle: "per02Convocation", question: "À quelle date les organisations syndicales ont-elles été convoquées ?", attendu: "La date et la liste des organisations." },
      { cle: "per02Themes", question: "Quels thèmes de L. 2242-17 la négociation a-t-elle couverts ?", attendu: "La liste ; un thème non abordé se constate sur le procès-verbal." },
      { cle: "per02Couverture", question: "L'entreprise est-elle couverte par un accord, ou par un plan d'action déposé ?", attendu: "L'accord déposé ou le plan d'action déposé — l'un des deux, jamais rien." },
    ],
  },

  "NAO-CTL-PER-03": {
    gravite: 1,
    quoiFaire: "Engager la négociation triennale sur la gestion des emplois et des parcours professionnels.",
    risque: "Un an d'emprisonnement et 3 750 € d'amende (L. 2243-2), l'obligation étant due dans les entreprises d'au moins trois cents salariés (L. 2242-2).",
    delai: "Trois à six mois : la négociation porte sur des engagements pluriannuels.",
    document: "Convocation à la négociation sur la gestion des emplois et des parcours professionnels",
    etapes: [
      "Vérifier le seuil : la négociation est due à partir de trois cents salariés (L. 2242-2), et tous les trois ans (L. 2242-13, 3°).",
      "Convoquer toutes les organisations syndicales représentatives.",
      "Préparer les données d'emploi : pyramide des âges, métiers en tension, projets de mutation technologique — la négociation porte sur la mise en place d'un dispositif de gestion prévisionnelle et sur les mesures d'accompagnement.",
      "Déposer l'accord ou le procès-verbal de désaccord.",
    ],
    verifs: [
      { cle: "per03Seuil", question: "L'entreprise atteint-elle trois cents salariés, et depuis quand ?", attendu: "L'effectif et sa date d'atteinte." },
      { cle: "per03Derniere", question: "À quelle date la précédente négociation triennale a-t-elle été engagée ?", attendu: "La date ; au-delà de trente-six mois, une organisation syndicale peut en imposer l'ouverture." },
      { cle: "per03Issue", question: "Quelle en a été l'issue, et à quelle date a-t-elle été déposée ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-PER-04": {
    gravite: 1,
    quoiFaire: "Engager la négociation triennale sur l'emploi, le travail et l'amélioration des conditions de travail des salariés expérimentés.",
    risque: "Même exposition que la négociation sur la gestion des emplois : un an d'emprisonnement et 3 750 € d'amende, la pénalité de L. 2242-7 pouvant s'y ajouter.",
    delai: "Trois à six mois.",
    document: "Convocation à la négociation sur les salariés expérimentés",
    etapes: [
      "Vérifier le seuil de trois cents salariés (L. 2242-2-1) et la périodicité triennale (L. 2242-13, 4°).",
      "Convoquer toutes les organisations syndicales représentatives.",
      "Documenter la situation des salariés expérimentés : effectifs par tranche d'âge, pénibilité des postes, accès à la formation, aménagements de fin de carrière.",
      "Déposer l'accord ou le procès-verbal de désaccord.",
    ],
    verifs: [
      { cle: "per04Seuil", question: "L'entreprise atteint-elle trois cents salariés ?", attendu: "L'effectif." },
      { cle: "per04Derniere", question: "À quelle date la précédente négociation a-t-elle été engagée ?", attendu: "La date." },
      { cle: "per04Issue", question: "Quelle en a été l'issue, et quand a-t-elle été déposée ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-DEM-01": {
    gravite: 1,
    quoiFaire: "Traiter la demande syndicale d'ouverture dans les deux délais qu'impose le dernier alinéa de L. 2242-13 : transmission aux autres organisations sous huit jours, convocation des parties sous quinze.",
    risque: "Se soustraire à la convocation des parties est puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1). Les deux délais sont courts et se comptent en jours.",
    delai: "Quinze jours, pas un de plus, à compter de la demande.",
    document: "Transmission de la demande syndicale aux autres organisations, et convocation des parties",
    etapes: [
      "Dater la réception de la demande : c'est de cette date que courent les deux délais.",
      "Dans les huit jours, transmettre la demande aux autres organisations syndicales représentatives — toutes, y compris celles qui n'ont pas demandé l'ouverture.",
      "Dans les quinze jours de la demande, convoquer les parties à la négociation, par écrit, en indiquant l'objet, le lieu et la date.",
      "Conserver les preuves d'envoi des deux actes : ce sont elles qui établiront le respect des délais.",
    ],
    verifs: [
      { cle: "dem01Recue", question: "À quelle date la demande syndicale a-t-elle été reçue ?", attendu: "La date, avec le courrier ou le courriel." },
      { cle: "dem01Transmise", question: "À quelle date a-t-elle été transmise aux autres organisations, et à quelles organisations ?", attendu: "La date — au plus huit jours après la demande — et la liste." },
      { cle: "dem01Convocation", question: "À quelle date les parties ont-elles été convoquées ?", attendu: "La date — au plus quinze jours après la demande — et la preuve d'envoi." },
    ],
  },

  "NAO-CTL-LOY-01": {
    gravite: 3,
    quoiFaire: "Faire figurer au procès-verbal de la première réunion les quatre mentions de L. 2242-14 : le lieu, le calendrier, les informations que l'employeur remettra, et la date de cette remise.",
    risque: "Sans ces mentions, la loyauté de la négociation n'est pas établie : un accord sur les salaires effectifs ne peut alors pas être valablement déposé (L. 2242-6), et le juge peut annuler une décision unilatérale prise dans le champ négocié.",
    delai: "Une réunion. La régularisation tient en un procès-verbal.",
    document: "Procès-verbal de première réunion — lieu, calendrier, informations et date de remise",
    etapes: [
      "Reprendre le procès-verbal de la première réunion et vérifier qu'il porte les quatre mentions.",
      "S'il en manque une, convoquer une réunion de cadrage et l'y arrêter avec les organisations syndicales : le calendrier et la liste des informations se fixent contradictoirement.",
      "Notifier le procès-verbal à toutes les organisations convoquées.",
      "Remettre les informations à la date annoncée : une date annoncée et non tenue vaut manquement à la loyauté.",
    ],
    verifs: [
      { cle: "loy01Lieu", question: "Le procès-verbal de première réunion précise-t-il le lieu et le calendrier des réunions ?", attendu: "Le procès-verbal lui-même, avec ces mentions." },
      { cle: "loy01Infos", question: "Précise-t-il la liste des informations remises et la date de leur remise ?", attendu: "La liste et la date." },
      { cle: "loy01Remise", question: "Les informations ont-elles été remises à la date annoncée ?", attendu: "La preuve de remise, datée." },
    ],
  },

  "NAO-CTL-LOY-02": {
    gravite: 3,
    quoiFaire: "Réunir les conditions de dépôt d'un accord sur les salaires effectifs : le procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes, et les réponses motivées aux propositions syndicales.",
    risque: "L'accord sur les salaires effectifs ne peut pas être déposé sans ce procès-verbal (L. 2242-6). Sans dépôt, il n'est pas opposable, et la période n'est pas couverte au regard des pénalités.",
    delai: "Deux semaines si les négociations ont eu lieu ; sinon, il faut les rouvrir.",
    document: "Procès-verbal d'ouverture des négociations sur les écarts de rémunération femmes-hommes",
    etapes: [
      "Établir le procès-verbal d'ouverture : il consigne les propositions respectives des parties et atteste que l'employeur a engagé sérieusement et loyalement les négociations.",
      "Vérifier les quatre éléments que L. 2242-6 exige de cet engagement : toutes les organisations représentatives convoquées, lieu et calendrier fixés, informations nécessaires communiquées, réponses motivées apportées aux propositions syndicales.",
      "Reprendre chaque proposition syndicale restée sans réponse et y répondre par écrit, en motivant : un refus non motivé est un manquement à la loyauté.",
      "Déposer l'accord accompagné du procès-verbal, dans les conditions de L. 2231-6.",
    ],
    verifs: [
      { cle: "loy02Pv", question: "Le procès-verbal d'ouverture des négociations sur les écarts de rémunération existe-t-il, et que consigne-t-il ?", attendu: "Le procès-verbal, portant les propositions respectives des parties." },
      { cle: "loy02Reponses", question: "Chaque proposition syndicale a-t-elle reçu une réponse écrite et motivée ?", attendu: "Les réponses, datées. Un silence se constate." },
      { cle: "loy02Depot", question: "L'accord sur les salaires effectifs a-t-il été déposé, accompagné de ce procès-verbal ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-UNI-01": {
    gravite: 2,
    quoiFaire: "Retirer, ou suspendre, toute décision unilatérale prise dans une matière en cours de négociation, tant que la négociation n'est pas achevée.",
    risque: "L. 2242-4 interdit à l'employeur de prendre des décisions unilatérales dans les matières traitées tant que la négociation est en cours, sauf urgence. La décision est annulable, et le manquement nourrit l'entrave.",
    delai: "Immédiat : c'est la décision elle-même qu'il faut reprendre.",
    document: "Note de retrait de la décision unilatérale et information des organisations syndicales",
    etapes: [
      "Identifier les décisions prises depuis l'ouverture de la négociation qui touchent à l'une des matières négociées.",
      "Pour chacune, vérifier si l'urgence était caractérisée : c'est la seule réserve que L. 2242-4 admet, et elle se démontre, elle ne se déclare pas.",
      "Retirer ou suspendre celles qui ne le sont pas, et en informer les organisations syndicales par écrit.",
      "Rouvrir le point en négociation, et faire figurer au procès-verbal que la décision a été retirée.",
    ],
    verifs: [
      { cle: "uni01Decisions", question: "Quelles décisions unilatérales ont été prises depuis l'ouverture de la négociation, et dans quelles matières ?", attendu: "La liste, datée." },
      { cle: "uni01Urgence", question: "Pour celles qui touchent aux matières négociées, l'urgence est-elle établie, et par quoi ?", attendu: "Les éléments de fait. Une affirmation d'urgence ne suffit pas." },
    ],
  },

  "NAO-CTL-ISS-01": {
    gravite: 2,
    quoiFaire: "Clore chaque négociation achevée par un accord déposé, ou par un procès-verbal de désaccord déposé.",
    risque: "Aucun texte n'oblige à conclure — mais l'absence de toute issue formalisée laisse la période non couverte, et expose aux pénalités de L. 2242-7 et L. 2242-8. Le procès-verbal de désaccord doit être déposé (L. 2242-5, R. 2242-1), à défaut de quoi il ne produit aucun effet.",
    delai: "Quinze jours après la dernière réunion.",
    document: "Procès-verbal de désaccord — propositions en leur dernier état et mesures unilatérales",
    etapes: [
      "Pour chaque négociation achevée sans accord, établir le procès-verbal de désaccord.",
      "Y consigner, en leur dernier état, les propositions respectives des parties — et non un simple constat d'échec.",
      "Y consigner les mesures que l'employeur entend appliquer unilatéralement : L. 2242-5 l'exige, et c'est ce qui fonde ensuite leur opposabilité.",
      "Le déposer dans les conditions de D. 2231-2, à l'initiative de la partie la plus diligente — l'employeur ne peut pas attendre que les syndicats s'en chargent.",
      "Conserver le récépissé : c'est lui, et non le procès-verbal, qui prouve le dépôt.",
    ],
    verifs: [
      { cle: "iss01Liste", question: "Pour chaque négociation achevée, quelle en a été l'issue — accord ou procès-verbal de désaccord ?", attendu: "L'issue, négociation par négociation." },
      { cle: "iss01Contenu", question: "Le procès-verbal de désaccord consigne-t-il les propositions en leur dernier état et les mesures unilatérales de l'employeur ?", attendu: "Les deux mentions. Un procès-verbal qui ne les porte pas est incomplet au sens de L. 2242-5." },
      { cle: "iss01Depot", question: "À quelle date le dépôt a-t-il été effectué, et où est le récépissé ?", attendu: "La date et le récépissé." },
    ],
  },

  "NAO-CTL-EGA-01": {
    gravite: 2,
    quoiFaire: "À défaut d'accord sur l'égalité professionnelle, établir le plan d'action annuel de L. 2242-3, et le déposer auprès de l'autorité administrative.",
    risque: "Sans accord ni plan d'action déposé, l'entreprise d'au moins cinquante salariés encourt la pénalité de L. 2242-8 : jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes.",
    delai: "Un mois : l'évaluation de l'année écoulée en est le préalable.",
    document: "Plan d'action annuel pour l'égalité professionnelle entre les femmes et les hommes",
    etapes: [
      "Évaluer les objectifs fixés et les mesures prises au cours de l'année écoulée : L. 2242-3 en fait le préalable exprès du plan.",
      "Fixer les objectifs de progression de l'année à venir, sur des critères clairs, précis et opérationnels.",
      "Définir les actions qualitatives et quantitatives qui permettent de les atteindre.",
      "Évaluer le coût de chacune : le texte l'exige, et un plan sans chiffrage est incomplet.",
      "Déposer le plan auprès de l'autorité administrative, et conserver le récépissé.",
    ],
    verifs: [
      { cle: "ega01Bilan", question: "Le plan évalue-t-il les objectifs et les mesures de l'année écoulée ?", attendu: "La partie « bilan » du plan." },
      { cle: "ega01Objectifs", question: "Fixe-t-il des objectifs de progression chiffrés pour l'année à venir ?", attendu: "Les objectifs, avec leurs indicateurs." },
      { cle: "ega01Cout", question: "Chaque action est-elle chiffrée ?", attendu: "Le coût, action par action." },
      { cle: "ega01Depot", question: "À quelle date le plan a-t-il été déposé ?", attendu: "Le récépissé de dépôt." },
    ],
  },

  "NAO-CTL-EGA-02": {
    gravite: 2,
    quoiFaire: "Couvrir l'entreprise d'au moins cinquante salariés par un accord ou un plan d'action, et publier l'index de l'égalité professionnelle de L. 1142-8.",
    risque: "La pénalité de L. 2242-8 va jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes. Le défaut de publication de l'index l'expose à ce seul titre.",
    delai: "Publication de l'index : au plus tard le 1er mars de chaque année.",
    document: "Publication de l'index de l'égalité professionnelle et déclaration à l'administration",
    etapes: [
      "Vérifier la couverture : un accord d'égalité professionnelle en vigueur, ou un plan d'action déposé. L'un des deux, jamais rien.",
      "Calculer les indicateurs de l'index sur la période de référence retenue.",
      "Publier le résultat de manière visible et lisible sur le site internet de l'entreprise, ou à défaut le porter à la connaissance des salariés par tout moyen.",
      "Le déclarer à l'administration et au comité social et économique.",
      "Si le résultat est inférieur au seuil réglementaire, définir les mesures de correction — leur absence est un manquement distinct.",
    ],
    verifs: [
      { cle: "ega02Couverture", question: "L'entreprise est-elle couverte par un accord ou par un plan d'action, et depuis quelle date ?", attendu: "L'accord ou le plan, daté et déposé." },
      { cle: "ega02Index", question: "L'index a-t-il été publié, à quelle date, et où ?", attendu: "La date et l'adresse de publication, ou le mode de diffusion retenu." },
      { cle: "ega02Correction", question: "Si le résultat est inférieur au seuil, quelles mesures de correction ont été définies ?", attendu: "Les mesures et leur calendrier." },
    ],
  },

  "NAO-CTL-CON-01": {
    gravite: 3,
    quoiFaire: "Couvrir, dans la négociation sur la rémunération, tous les thèmes que L. 2242-15 énumère.",
    risque: "Une négociation qui laisse un thème de côté n'est pas complète : le manquement se constate sur le procès-verbal, et nourrit le grief de négociation déloyale.",
    delai: "Une réunion supplémentaire par thème omis.",
    document: "Ordre du jour de la négociation sur la rémunération — les thèmes de L. 2242-15",
    etapes: [
      "Reprendre le procès-verbal et pointer, thème par thème, ceux que L. 2242-15 énumère : salaires effectifs, durée effective et organisation du temps de travail, intéressement, participation et épargne salariale, suivi de la mise en œuvre des mesures de suppression des écarts de rémunération.",
      "Pour chaque thème omis, inscrire le point à l'ordre du jour d'une réunion complémentaire.",
      "Remettre aux organisations syndicales les informations propres à ce thème, avant la réunion.",
      "Consigner au procès-verbal que le thème a été abordé, et ce qui s'y est dit.",
    ],
    verifs: [
      { cle: "con01Themes", question: "Quels thèmes de L. 2242-15 le procès-verbal montre-t-il abordés ?", attendu: "La liste, pointée sur le procès-verbal." },
      { cle: "con01Ecarts", question: "Le suivi des mesures de suppression des écarts de rémunération a-t-il été abordé ?", attendu: "La mention au procès-verbal ; c'est un thème distinct des salaires effectifs." },
    ],
  },

  "NAO-CTL-CON-02": {
    gravite: 3,
    quoiFaire: "Couvrir, dans la négociation sur l'égalité professionnelle, tous les thèmes que L. 2242-17 énumère.",
    risque: "Même constat que pour la négociation sur la rémunération, avec en outre l'exposition à la pénalité de L. 2242-8 si la période n'est pas valablement couverte.",
    delai: "Une réunion supplémentaire par thème omis.",
    document: "Ordre du jour de la négociation sur l'égalité professionnelle — les thèmes de L. 2242-17",
    etapes: [
      "Pointer sur le procès-verbal les thèmes de L. 2242-17 : articulation entre vie personnelle et vie professionnelle, suppression des écarts de rémunération, accès à l'emploi, à la formation et à la promotion, conditions de travail et d'emploi, insertion et maintien dans l'emploi des travailleurs handicapés, régimes de prévoyance et de complémentaire santé, droit à la déconnexion.",
      "Pour chaque thème omis, l'inscrire à l'ordre du jour d'une réunion complémentaire.",
      "Verser les données correspondantes issues de la base de données économiques, sociales et environnementales.",
      "Consigner au procès-verbal.",
    ],
    verifs: [
      { cle: "con02Themes", question: "Quels thèmes de L. 2242-17 le procès-verbal montre-t-il abordés ?", attendu: "La liste, pointée sur le procès-verbal." },
      { cle: "con02Deconnexion", question: "Le droit à la déconnexion a-t-il été abordé, et avec quelle issue ?", attendu: "La mention au procès-verbal ; à défaut d'accord, la charte de l'employeur." },
    ],
  },

  "NAO-CTL-CON-03": {
    gravite: 4,
    quoiFaire: "Appuyer la négociation sur l'égalité professionnelle sur les données de la base de données économiques, sociales et environnementales, comme L. 2242-17, 2° l'impose.",
    risque: "Une négociation menée sans ces données est contestable dans sa loyauté : les organisations syndicales n'ont pas pu négocier en connaissance de cause au sens de L. 2242-6.",
    delai: "Quelques jours si la base existe ; sinon, c'est la base qu'il faut d'abord constituer.",
    document: "Extraction de la base de données pour la négociation sur l'égalité professionnelle",
    etapes: [
      "Vérifier que la base existe et qu'elle est à jour : si elle ne l'est pas, le module « base de données » traite ce point pour lui-même.",
      "En extraire les données relatives à l'égalité professionnelle : effectifs par sexe et par catégorie, rémunérations comparées, promotions, formation, embauches et départs.",
      "Les remettre aux organisations syndicales avant la réunion, et en consigner la remise au procès-verbal.",
      "Faire figurer au procès-verbal que la négociation s'est appuyée sur ces données.",
    ],
    verifs: [
      { cle: "con03Extraction", question: "Quelles données de la base ont été remises aux organisations syndicales, et à quelle date ?", attendu: "L'extraction et sa date de remise." },
      { cle: "con03Pv", question: "Le procès-verbal mentionne-t-il que la négociation s'est appuyée sur ces données ?", attendu: "La mention au procès-verbal." },
    ],
  },

  /* Ce contrôle mesure l'exposition résultant des autres : il ne se régularise
     pas pour lui-même — on régularise ce qui la cause. */
  "NAO-CTL-PEN-01": null,
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
for (const [id, r] of Object.entries(R)) {
  if (r === null) continue;
  for (const champ of ["gravite", "quoiFaire", "risque", "delai", "etapes", "verifs"])
    if (r[champ] === undefined || r[champ] === null || r[champ] === "")
      ECARTS.push(`${id} : le champ « ${champ} » manque`);
  if (!GRAVITES[r.gravite]) ECARTS.push(`${id} : gravité « ${r.gravite} » inconnue`);
  if (Array.isArray(r.etapes) && r.etapes.length < 2)
    ECARTS.push(`${id} : une procédure d'une seule étape n'accompagne personne`);
  if (Array.isArray(r.verifs))
    for (const v of r.verifs)
      if (!v.cle || !v.question || !v.attendu)
        ECARTS.push(`${id} : une vérification est incomplète (clé, question, attendu)`);
}
/* L'unicité des clés de vérification. Deux clés identiques feraient répondre
   une question à la place d'une autre : la réponse de la seconde écraserait
   silencieusement celle de la première, et le verdict porterait sur autre chose
   que ce qui a été demandé. Le garde vient des modules PSE, discipline, BDESE
   et santé-sécurité, où il a été posé avant d'exister ici. */
{
  const vues = new Map();
  for (const [id, r] of Object.entries(R)) {
    if (!r || !Array.isArray(r.verifs)) continue;
    for (const v of r.verifs) {
      if (vues.has(v.cle)) ECARTS.push(`${id} : la clé « ${v.cle} » est déjà employée par ${vues.get(v.cle)}`);
      else vues.set(v.cle, id);
    }
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

__def("./modeles-nao.js", function(module, exports, require){
/* Les modèles de régularisation — étape 5 du parcours client.

   Chaque contrôle non conforme ou à vérifier a droit à mieux qu'un rappel de
   texte : une note chiffrée sur le dossier remis — les délais de convocation,
   la périodicité de chaque négociation, le seuil de trois cents salariés, les
   dates réellement déclarées. Rien n'est une coquille générique : quand une
   donnée manque pour calculer, la note le dit et pose un exemple marqué
   « [exemple] », jamais une valeur inventée présentée comme celle du client.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de régime (moteur-nao.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit, pour
   que ce modèle s'imprime exactement comme le reste du module.

   Les seuls textes, délais et thèmes cités sont ceux déjà lus et posés par
   moteur-nao.js et controles-nao.js : ce fichier ne capture aucun article, il
   met en chiffres ce qui l'est déjà. Deux contrôles n'ont pas de modèle —
   NAO-CTL-REG-01 (l'assujettissement, qui ne se régularise pas) et
   NAO-CTL-PEN-01 (l'exposition, qui mesure les autres et ne se régularise pas
   pour elle-même) — comme regularisation-nao.js les laisse à null. */
const O = require("./outils.js");
const D = require("./dates.js");
const M = require("./moteur-nao.js");
const { ITEMS_REMUNERATION, ITEMS_EGALITE } = require("./controles-nao.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const ex = v => v + " [exemple]";
const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const jour0 = f => (D.estDateISO(f.dateAudit) ? f.dateAudit : new Date().toISOString().slice(0, 10));
const nego = (f, cle) => (f.negos || {})[cle] || {};

/* Un mois après, en respectant les fins de mois — même règle que les autres
   modules du dépôt. */
function moisApres(iso, n) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const an = a + Math.floor((m - 1 + n) / 12), mo = ((m - 1 + n) % 12) + 1;
  const dernier = new Date(Date.UTC(an, mo, 0)).getUTCDate();
  return `${an}-${String(mo).padStart(2, "0")}-${String(Math.min(j, dernier)).padStart(2, "0")}`;
}
function joursApres(iso, n) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const t = Date.UTC(a, m - 1, j) + n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════════════ le régime applicable ═══ */

function modeleReg02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le calendrier des négociations — accord de méthode ou régime supplétif — " + nomE(f));
  const r = M.regime(f);
  h1("Le régime, calculé sur ce dossier");
  p(r.motif);
  const acc = f.accordMethode || {};
  if (dit(acc.existe)) {
    const mentions = Array.isArray(acc.mentions) ? acc.mentions : [];
    h1("Les cinq mentions de L. 2242-11, sur ce que le dossier déclare");
    tab(["Mention", "Déclarée"], M.MENTIONS.map(([cle, lib]) => [lib, mentions.includes(cle) ? "présente" : "absente"]));
    const duree = nb(acc.dureeAns);
    p(`Durée déclarée de l'accord : ${duree === null ? "non renseignée" : duree + " an(s)"} — le plafond légal est de quatre ans (L. 2242-11).`);
  }
  if (r.regime === "accord de méthode" && r.periodicites) {
    h1("Les périodicités que cet accord fixe, thème par thème");
    tab(["Négociation", "Périodicité retenue"], Object.values(M.THEMES).map(t => [t.titre, (r.periodicites[t.cle] || 4) + " an(s)"]));
  }
  note("Un accord qui ne porte pas les cinq mentions, dont la durée excède quatre ans, ou qui n'est pas tenu, ne fait pas écran : le régime supplétif de L. 2242-13 reprend sa place sans qu'il soit besoin de le dénoncer.");
  return A.D;
}

/* ═══════════════════════════════════════════════ les quatre périodicités ═══ */

function noteEcheance(f, cle) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  const t = M.THEMES[cle];
  t1(`Calcul de la périodicité — ${t.titre} — ` + nomE(f));
  const e = M.echeances(f).themes[cle];
  if (e.du === false) { A.D.push({ k: "p", t: "Sans objet en l'état de l'effectif déclaré : cette négociation triennale n'est pas due en deçà de trois cents salariés (" + t.fondement + ")." }); return A.D; }
  if (e.du === null) { A.D.push({ k: "p", t: "Donnée manquante pour calculer : l'assujettissement ou le seuil de trois cents salariés n'est pas établi sur ce dossier." }); return A.D; }
  const ans = e.periodiciteMois / 12;
  h1("Le calcul, sur les dates déclarées");
  if (/jamais engagée|inexploitables/.test(e.etat)) {
    const depart = jour0(f);
    const limiteEx = moisApres(depart, e.periodiciteMois);
    p(`Aucune date d'engagement exploitable n'est renseignée pour cette négociation. À titre d'illustration, si elle était engagée à la date de situation du dossier, ${ex(depart)}, le terme de la périodicité de ${ans} an(s) serait le ${ex(limiteEx)}.`);
    note("Si la négociation n'a réellement jamais été engagée, le manquement est déjà constitué : le calcul ci-dessus n'est qu'une illustration du rythme à tenir, non la date qui s'applique à ce dossier.");
    return A.D;
  }
  const limite = moisApres(e.nego.dateEngagement, e.periodiciteMois);
  tab(["Étape", "Date"], [
    ["Dernière négociation engagée", e.nego.dateEngagement],
    [`Terme de la périodicité de ${ans} an(s) (${t.fondement})`, limite],
    ["Situation décrite au", jour0(f)],
  ]);
  p(e.etat === "en retard"
    ? `La périodicité de ${ans} an(s) est dépassée d'environ ${e.retardMois} mois : son terme du ${limite} est déjà passé à la date de situation du dossier (${jour0(f)}).`
    : `La périodicité de ${ans} an(s) est tenue : son terme du ${limite} n'est pas encore atteint à la date de situation du dossier (${jour0(f)}).`);
  return A.D;
}
const modelePer01 = f => noteEcheance(f, "remuneration");
const modelePer02 = f => noteEcheance(f, "egalite");
const modelePer03 = f => noteEcheance(f, "gepp");
const modelePer04 = f => noteEcheance(f, "experimentes");

/* ═══════════════════════════════════════════════════ la demande syndicale ═══ */

function modeleDem01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul des deux délais de la demande syndicale — L. 2242-13, dernier alinéa — " + nomE(f));
  const d = M.demandeSyndicale(f);
  h1("Le calcul, sur ce dossier");
  if (!d.connue || !d.recue) { p(d.motif); return A.D; }
  const ds = f.demandeSyndicale || {};
  const limiteTransmission = joursApres(ds.date, 8);
  const limiteConvocation = joursApres(ds.date, 15);
  tab(["Étape", "Date", "Délai légal"], [
    ["Demande syndicale reçue", ds.date, "point de départ"],
    ["Terme des huit jours (transmission aux autres organisations)", ds.date ? limiteTransmission : "—", "8 jours"],
    ["Transmission déclarée", q(ds.dateTransmissionAutresOS) || "non renseignée", d.transmission && d.transmission.jours != null ? d.transmission.jours + " jour(s) après la demande" : "—"],
    ["Terme des quinze jours (convocation des parties)", ds.date ? limiteConvocation : "—", "15 jours"],
    ["Convocation déclarée", q(ds.dateConvocation) || "non renseignée", d.convocation && d.convocation.jours != null ? d.convocation.jours + " jour(s) après la demande" : "—"],
  ]);
  const griefs = [];
  if (d.transmission && d.transmission.fait === false) griefs.push("la transmission aux autres organisations n'est pas dans les huit jours");
  if (d.convocation && d.convocation.fait === false) griefs.push("la convocation des parties n'est pas dans les quinze jours");
  if (griefs.length) p("Écart constaté : " + griefs.join(" ; ") + ".");
  note("Se soustraire à la convocation des parties dans ce délai est puni d'un an d'emprisonnement et de 3 750 € d'amende (L. 2243-1) : ces deux délais se comptent en jours, pas en jours ouvrés.");
  return A.D;
}

/* ═══════════════════════════════════════════════════ la loyauté ═══ */

function modeleLoy01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  t1("Grille des quatre mentions de la première réunion — L. 2242-14 — " + nomE(f));
  const r = f.premiereReunion || {};
  h1("Ce que le dossier déclare");
  tab(["Mention (L. 2242-14)", "État déclaré"], [
    ["Date de la première réunion", q(r.date) || "non renseignée"],
    ["Lieu et calendrier des réunions fixés", dit(r.lieuCalendrierFixes) ? "oui" : nie(r.lieuCalendrierFixes) ? "non" : "non renseigné"],
    ["Informations remises aux négociateurs", dit(r.informationsRemises) ? "oui" : nie(r.informationsRemises) ? "non" : "non renseigné"],
    ["Date de remise de ces informations", q(r.dateRemiseInformations) || "non renseignée"],
  ]);
  note("Ces quatre mentions établissent l'engagement sérieux et loyal de la négociation : leur absence prive un accord sur les salaires effectifs de toute possibilité de dépôt régulier (L. 2242-6).");
  return A.D;
}

function modeleLoy02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des conditions de dépôt — accord sur les salaires effectifs — L. 2242-6 — " + nomE(f));
  const n = nego(f, "remuneration");
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Issue de la négociation sur les salaires effectifs", q(n.issue) || "non renseignée"],
    ["Procès-verbal d'ouverture des négociations sur les écarts femmes-hommes", dit(n.pvOuvertureEcarts) ? "oui" : nie(n.pvOuvertureEcarts) ? "non" : "non renseigné"],
    ["Réponses motivées apportées aux propositions syndicales", dit(f.reponsesMotivees) ? "oui" : nie(f.reponsesMotivees) ? "non" : "non renseigné"],
  ]);
  if (n.issue === "accord" && (!dit(n.pvOuvertureEcarts) || !dit(f.reponsesMotivees)))
    p("L'accord sur les salaires effectifs ne peut pas être régulièrement déposé tant que ces deux conditions ne sont pas réunies (L. 2242-6) : sans dépôt, la période n'est pas couverte au regard des pénalités.");
  note("« Produire le document » écrit le procès-verbal d'ouverture, prêt à compléter des propositions réellement échangées — jamais devinées par l'application.");
  return A.D;
}

function modeleUni01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de retrait — décision unilatérale pendant négociation — L. 2242-4 — " + nomE(f));
  const d = f.decisionUnilaterale || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Décision unilatérale prise pendant une négociation en cours", dit(d.prise) ? "oui" : nie(d.prise) ? "non" : "non renseigné"],
    ["Matière concernée", q(d.matiere) || "non renseignée"],
    ["Urgence invoquée", dit(d.urgence) ? "oui — à documenter" : nie(d.urgence) ? "non" : "non renseigné"],
  ]);
  if (dit(d.prise) && !dit(d.urgence))
    p("Sans urgence établie, L. 2242-4 interdit cette décision tant que la négociation est en cours dans la matière concernée : elle est annulable, et son maintien nourrit le grief d'entrave.");
  note("Le terme de la négociation ne se décrète pas : elle reste en cours tant qu'aucun procès-verbal de désaccord n'est établi (Soc., 15 avril 2026, n° 24-15.653).");
  return A.D;
}

/* ═══════════════════════════════════════════════════ l'issue ═══ */

function modeleIss01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  t1("Grille des issues et des dépôts, négociation par négociation — L. 2242-5 — " + nomE(f));
  h1("Ce que le dossier déclare");
  const rows = Object.values(M.THEMES).map(t => {
    const n = nego(f, t.cle);
    return [t.titre, q(n.issue) || "non renseignée", dit(n.depot) ? "oui" : nie(n.depot) ? "non" : "—"];
  });
  tab(["Négociation", "Issue déclarée", "Dépôt déclaré"], rows);
  note("Le procès-verbal de désaccord n'est complet que s'il consigne les propositions respectives des parties en leur dernier état et les mesures que l'employeur entend appliquer unilatéralement (L. 2242-5) ; sans dépôt dans les conditions de D. 2231-2, il ne produit aucun effet (R. 2242-1).");
  return A.D;
}

/* ═══════════════════════════════════════════════════ l'égalité professionnelle ═══ */

function modeleEga01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille du plan d'action annuel — égalité professionnelle — L. 2242-3 — " + nomE(f));
  const n = nego(f, "egalite");
  const pl = n.planAction || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Issue de la négociation sur l'égalité professionnelle", q(n.issue) || "non renseignée"],
    ["Plan d'action existant", dit(pl.existe) ? "oui" : nie(pl.existe) ? "non" : "non renseigné"],
    ["Plan d'action déposé auprès de l'autorité administrative", dit(pl.depot) ? "oui" : nie(pl.depot) ? "non" : "non renseigné"],
  ]);
  if (!dit(pl.existe) || !dit(pl.depot))
    p("Sans accord ni plan d'action déposé, aucune pièce ne couvre l'entreprise au regard de la pénalité de L. 2242-8.");
  note("Sans accord, ce plan est la seule pièce qui couvre l'entreprise : sa rédaction ne se contente pas d'énoncer des objectifs, elle en chiffre le coût, condition que L. 2242-3 pose expressément.");
  return A.D;
}

function modeleEga02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la couverture et de la publication de l'index — L. 2242-8 — " + nomE(f));
  const eff = nb(f.effectif);
  const n = nego(f, "egalite");
  const couvert = n.issue === "accord" || dit((n.planAction || {}).existe);
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", eff === null ? "non renseigné" : eff + " salarié(s)"],
    ["Seuil de cinquante salariés (L. 2242-8)", eff === null ? "non apprécié faute d'effectif" : (eff >= 50 ? "atteint" : "non atteint — sans objet")],
    ["Couverture par un accord ou un plan d'action", couvert ? "oui" : "non établie en l'état"],
    ["Index de L. 1142-8 publié", dit(f.indexEgalitePublie) ? "oui" : nie(f.indexEgalitePublie) ? "non" : "non renseigné"],
  ]);
  if (eff !== null && eff >= 50 && (!couvert || !dit(f.indexEgalitePublie)))
    p("La pénalité de L. 2242-8 va jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes : la couverture et la publication de l'index sont deux manquements distincts, qui s'apprécient séparément.");
  note("Le montant de la pénalité est fixé par l'administration selon les efforts constatés : cette note dit l'exposition sur ce dossier, jamais un chiffrage.");
  return A.D;
}

/* ═══════════════════════════════════════════════════ le contenu des négociations ═══ */

function noteContenu(f, cle, items, fondement, titre) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1(`Grille du contenu — ${titre} — ${fondement} — ` + nomE(f));
  const n = nego(f, cle);
  h1("Ce que le dossier déclare");
  const traites = Array.isArray(n.themesTraites) ? n.themesTraites : [];
  tab([`Thème (${fondement})`, "Rattaché à la négociation"],
    items.map(([marque, lib]) => [lib, traites.includes(marque) ? "oui" : "non déclaré"]));
  const absents = items.filter(([marque]) => !traites.includes(marque));
  if (absents.length)
    p(`${absents.length} thème(s) sur ${items.length} ne sont pas rattachés à la négociation : un thème légal laissé hors de la table doit l'être en connaissance de cause, et se répare en l'inscrivant à l'ordre du jour d'une réunion complémentaire.`);
  note("L'obligation porte sur la négociation de chaque thème, non sur sa conclusion : un thème abordé et resté sans accord n'est pas un manquement pour autant.");
  return A.D;
}
const modeleCon01 = f => noteContenu(f, "remuneration", ITEMS_REMUNERATION, "L. 2242-15", "rémunération, temps de travail et partage de la valeur ajoutée");
const modeleCon02 = f => noteContenu(f, "egalite", ITEMS_EGALITE, "L. 2242-17", "égalité professionnelle et qualité de vie et des conditions de travail");

function modeleCon03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note d'appui sur la base de données — négociation égalité — L. 2242-17, 2° — " + nomE(f));
  const n = nego(f, "egalite");
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Négociation égalité engagée", q(n.dateEngagement) || "non renseignée"],
    ["Appui sur les données de la base de données économiques, sociales et environnementales", dit(n.appuiBDESE) ? "oui" : nie(n.appuiBDESE) ? "non" : "non renseigné"],
  ]);
  if (nie(n.appuiBDESE))
    p("Des négociateurs privés du diagnostic comparé femmes-hommes de la base ne négocient pas en connaissance de cause : c'est un grief de loyauté autant que de contenu. Le module « base de données (BDESE) » de cette application audite la tenue de cette base pour elle-même.");
  note("L. 2242-17, 2° impose que cette négociation s'appuie sur les données mentionnées au 2° de l'article L. 2312-36.");
  return A.D;
}

const MODELES = {
  "NAO-CTL-REG-02": modeleReg02,
  "NAO-CTL-PER-01": modelePer01,
  "NAO-CTL-PER-02": modelePer02,
  "NAO-CTL-PER-03": modelePer03,
  "NAO-CTL-PER-04": modelePer04,
  "NAO-CTL-DEM-01": modeleDem01,
  "NAO-CTL-LOY-01": modeleLoy01,
  "NAO-CTL-LOY-02": modeleLoy02,
  "NAO-CTL-UNI-01": modeleUni01,
  "NAO-CTL-ISS-01": modeleIss01,
  "NAO-CTL-EGA-01": modeleEga01,
  "NAO-CTL-EGA-02": modeleEga02,
  "NAO-CTL-CON-01": modeleCon01,
  "NAO-CTL-CON-02": modeleCon02,
  "NAO-CTL-CON-03": modeleCon03,
};

module.exports = { MODELES };

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
