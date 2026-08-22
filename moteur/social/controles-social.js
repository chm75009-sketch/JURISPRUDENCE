/* L'étage 2 de l'audit social : le contrôle de l'existant.

   Le client a coché « je l'ai » ou « je ne l'ai pas » sur chaque obligation
   applicable. Ce fichier confronte la déclaration aux questions de
   vérification de chaque item, et rend un verdict aux cinq états du dépôt :
   conforme, non conforme, risque à vérifier, donnée manquante, sans objet.

   LES RÈGLES, les mêmes que partout :

   - Une donnée absente ne conclut jamais. Profil vide → « donnée manquante »
     partout : rien n'est « conforme » ni « sans objet » sans donnée qui le
     documente.

   - COCHER N'EST PAS PROUVER. « Je l'ai » sans détail vérifiable (date,
     dépôt, affichage effectif…) rend « risque à vérifier », jamais
     « conforme ».

   - Les items renvoyés à un module dédié (CSE, BDESE, NAO, PSE, économique)
     ne rendent JAMAIS « conforme » ici : au mieux « risque à vérifier », avec
     le renvoi — l'audit détaillé se fait dans le module.

   - Les items conventionnels ou hors du champ du relais (convention
     collective, code de la sécurité sociale, code de la santé publique) ne
     rendent JAMAIS « conforme » : rien n'est affirmé sur un texte non lu.

   - « Non conforme » ne se prononce que si l'obligation repose sur un article
     lu à la source ou sur un module dédié qui porte ses propres textes
     vérifiés ; sinon, l'absence déclarée rend « risque à vérifier », dit
     pourquoi, et renvoie à la vérification du texte.                        */
const R = require("./referentiel-social.js");
const D = require("../commun/dates.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && String(x).trim() !== "";

/* Un item peut-il être déclaré « non conforme » ? Oui si son obligation est
   assise sur un article lu ici, ou sur un module dédié dont les textes sont
   vérifiés chez lui. Un item purement conventionnel ou générique, non : on ne
   constate pas la violation d'un texte qu'on n'a pas lu. */
const peutNC = it => (it.articles && it.articles.length > 0) || !!it.module;
/* Un item peut-il être déclaré « conforme » ? Jamais s'il renvoie à un module
   (le chapeau ne blanchit pas ce que le module audite), jamais s'il est
   conventionnel ou générique (texte non lu). */
const peutCONF = it => !it.module && !it.convention && !it.generique
  && it.articles && it.articles.length > 0;

const renvoi = it => it.module
  ? ` L'audit détaillé se fait dans le module « ${it.module.nom} » (${it.module.page}).` : "";

/* Une question de vérification, évaluée. Rend { ok | nc | manque | invalide }. */
function evaluerVerif(v, reponses, p) {
  const val = (reponses || {})[v.cle];
  if (v.regle === "oui") {
    if (!renseigne(val)) return { r: "manque", quoi: v.libelle };
    if (nie(val)) return { r: "nc", motif: v.motifNC };
    if (dit(val)) return { r: "ok" };
    return { r: "manque", quoi: v.libelle };
  }
  if (v.regle === "ageMaxMois") {
    if (!renseigne(val)) return { r: "manque", quoi: v.libelle };
    if (!D.estDateISO(p.dateAudit))
      return { r: "invalide", motif: "La date de l'audit n'est pas renseignée (ou n'est pas une date valide) : aucun délai ne peut être mesuré — renseignez-la dans le profil." };
    const e = D.ecart(String(val), p.dateAudit, `« ${v.libelle} »`, "la date de l'audit");
    if (!e.valide) return { r: "invalide", motif: e.motif };
    const mois = e.jours / 30.4375;
    if (mois > v.mois) {
      /* Certains rythmes ne s'imposent qu'à partir d'un effectif : en deçà,
         un dépassement n'est pas une non-conformité, c'est un point à
         vérifier — le motif propre à l'item le dit. */
      const effectif = typeof p.effectif === "number" ? p.effectif
        : (String(p.effectif || "").trim() !== "" && isFinite(+p.effectif) ? +p.effectif : null);
      if (v.siEffectifAuMoins && effectif !== null && effectif < v.siEffectifAuMoins)
        return { r: "risque", motif: v.motifSousSeuil || v.motifNC };
      return { r: "nc",
        motif: v.motifNC + ` (dernière date : ${val}, soit environ ${Math.round(mois)} mois au ${p.dateAudit}, pour ${v.mois} au plus).` };
    }
    return { r: "ok" };
  }
  if (v.regle === "date") {
    if (!renseigne(val)) return { r: "manque", quoi: v.libelle };
    if (!D.estDateISO(String(val)))
      return { r: "invalide", motif: `« ${v.libelle} » : ${val} n'est pas une date existante au format AAAA-MM-JJ.` };
    return { r: "ok" };
  }
  return { r: "manque", quoi: v.libelle };
}

/* Le verdict d'un item. dossier = { coches: {id: "oui"|"non"}, reponses: {id: {cle: valeur}} } */
function verdictItem(it, p, dossier) {
  const a = it.condition(p);
  if (a.du === null) return { etat: MANQ, motif: a.motif, assujetti: null };
  if (a.du === false) return { etat: SO, motif: a.motif, assujetti: false };

  const coche = (dossier.coches || {})[it.id];
  if (!renseigne(coche))
    return { etat: MANQ, assujetti: true,
      motif: a.motif + " Dites si cette obligation est en place : cochez « je l'ai » ou « je ne l'ai pas » — sans réponse, rien ne se contrôle." };

  if (nie(coche)) {
    if (peutNC(it))
      return { etat: NC, assujetti: true,
        motif: `L'obligation s'applique (${a.motif}) et elle est déclarée absente. ${it.plan.risque}${renvoi(it)}` };
    return { etat: RISQ, assujetti: true,
      motif: `L'obligation paraît s'appliquer et elle est déclarée absente — mais sa source n'a pas pu être lue ici (${it.fondement}) : vérifiez le texte, puis traitez l'écart. ${it.plan.risque}` };
  }

  /* Coché « je l'ai » : les questions de vérification décident. */
  const rep = (dossier.reponses || {})[it.id] || {};
  const griefs = [], manques = [], invalides = [], attentions = [];
  for (const v of it.verifs || []) {
    const r = evaluerVerif(v, rep, p);
    if (r.r === "nc") griefs.push(r.motif);
    else if (r.r === "manque") manques.push(r.quoi);
    else if (r.r === "invalide") invalides.push(r.motif);
    else if (r.r === "risque") attentions.push(r.motif);
  }
  if (griefs.length)
    return { etat: NC, assujetti: true, motif: griefs.join(" ") + renvoi(it) };
  if (invalides.length)
    return { etat: MANQ, assujetti: true, motif: invalides.join(" ") };
  if (attentions.length)
    return { etat: RISQ, assujetti: true, motif: attentions.join(" ") + renvoi(it) };
  if (manques.length)
    return { etat: RISQ, assujetti: true,
      motif: `Vous cochez « je l'ai », mais sans détail vérifiable : ${manques.join(" ; ")}. Une case cochée ne prouve rien — répondez aux questions de vérification pour que l'audit conclue.` + renvoi(it) };

  if (peutCONF(it))
    return { etat: CONF, assujetti: true,
      motif: `Obligation en place et vérifications répondues (${(it.verifs || []).length} point(s)) — fondement : ${it.fondement}.` };
  if (it.module)
    return { etat: RISQ, assujetti: true,
      motif: `En l'état des réponses, rien ne bloque au niveau de ce chapeau — mais ce contrôle ne délivre pas de blanc-seing.${renvoi(it)}` };
  return { etat: RISQ, assujetti: true,
    motif: `Les réponses ne révèlent pas d'écart, mais la source de cette obligation n'a pas pu être lue par l'application (${it.fondement}) : la conformité ne se prononce pas sur un texte non lu — faites vérifier.` };
}

function verdicts(p, dossier) {
  const out = {};
  for (const it of R.REF) {
    try { out[it.id] = verdictItem(it, p, dossier || {}); }
    catch (e) { out[it.id] = { etat: MANQ, motif: "Contrôle non exécutable : " + e.message, assujetti: null }; }
  }
  return out;
}

/* La liste applicable (étage 1) : chaque obligation avec son assujettissement. */
function applicables(p) {
  return R.REF.map(it => {
    let a;
    try { a = it.condition(p); }
    catch (e) { a = { du: null, motif: "Condition non exécutable : " + e.message }; }
    return { id: it.id, categorie: it.categorie, intitule: it.intitule,
      fondement: it.fondement, module: it.module || null,
      convention: !!it.convention, generique: it.generique || null,
      regularisation: it.regularisation || null,
      du: a.du, motif: a.motif, verifs: it.verifs || [] };
  });
}

module.exports = { ETATS, verdicts, verdictItem, applicables, peutNC, peutCONF };
