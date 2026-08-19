/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : 2d43af47ec54
   {"obligations":33,"parCategorie":{"instances":6,"documents obligatoires":5,"affichages et informations":7,"registres":3,"négociations":3,"santé-sécurité":3,"formation et entretiens":2,"épargne et protection sociale":4},"articlesLus":34,"articlesNonConfirmes":0,"articlesCites":34,"renvoisModules":12,"itemsConventionnels":2,"itemsGeneriques":2,"questionsOrientation":13,"questionsVerification":54,"conformitesOuSansObjetSurProfilVide":0,"conclusionsConformesInterdites":0,"citationsDArticlesNonConfirmes":0}
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
  var __MANIFESTE = {"domaine":"audit social — le chapeau des obligations de l'employeur","date":"2026-08-19","empreinte":"2d43af47ec54","fichiers":{"audit-social-client.js":"7a478d627254","capturer-textes-social-2.js":"4d61e2c885d8","capturer-textes-social.js":"f79e801d9e31","controles-social.js":"dca44c7025a0","modeles-social.js":"f0d25d41f7e9","moteur-social.js":"6e23710d673f","plan-social.js":"790ea6b6be17","questionnaire-social.js":"71fc9a4ae24a","referentiel-social.js":"ce5126f5ee06","tests-social.js":"f8ba31758c76","textes-social-non-confirmes.json":"4a15a4d57c34","textes-social.json":"5141260645ac","verifier-textes-social.js":"de5da88f7ad0"},"compteurs":{"obligations":33,"parCategorie":{"instances":6,"documents obligatoires":5,"affichages et informations":7,"registres":3,"négociations":3,"santé-sécurité":3,"formation et entretiens":2,"épargne et protection sociale":4},"articlesLus":34,"articlesNonConfirmes":0,"articlesCites":34,"renvoisModules":12,"itemsConventionnels":2,"itemsGeneriques":2,"questionsOrientation":13,"questionsVerification":54,"conformitesOuSansObjetSurProfilVide":0,"conclusionsConformesInterdites":0,"citationsDArticlesNonConfirmes":0},"textesRelus":{"date":"2026-08-19","articles":34,"concordants":33,"ecarts":0,"sansConclusion":1}};
  var __REGISTRE = (function () { var r = null || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

__def("./audit-social-client.js", function(module, exports, require){
/* Le point d'entrée navigateur de l'audit social.

   Ce module est empaqueté par ../commun/empaqueter.js vers docs/moteur-social.js
   (global MoteurSocial). Il n'invente rien : il expose le référentiel, les
   contrôles, le plan et le questionnaire — la page ne fait que les afficher.

   Les trois étages, tels que la page les déroule :
   1. questions(profil) et applicables(profil) — la liste s'ouvre selon le
      profil (effectif, secteur, convention, groupe, établissements) ;
   2. plan(profil, dossier) — d'abord le manquant : les actions concrètes,
      priorisées, avec modèles PRÉ-REMPLIS des données du questionnaire ;
   3. verdicts(profil, dossier) — puis l'existant : la conformité de ce qui
      est déclaré en place, aux cinq états du dépôt.                         */
const R = require("./referentiel-social.js");
const C = require("./controles-social.js");
const P = require("./plan-social.js");
const Q = require("./questionnaire-social.js");

/* La synthèse chiffrée du rapport général : mesurée, jamais recopiée. */
function synthese(profil, dossier) {
  const v = C.verdicts(profil, dossier || {});
  const n = { applicables: 0, nonApplicables: 0, indetermines: 0,
    conformes: 0, nonConformes: 0, risques: 0, manquantes: 0, sansObjet: 0 };
  for (const x of Object.values(v)) {
    if (x.assujetti === true) n.applicables++;
    else if (x.assujetti === false) n.nonApplicables++;
    else n.indetermines++;
    if (x.etat === "conforme") n.conformes++;
    else if (x.etat === "non conforme") n.nonConformes++;
    else if (x.etat === "risque à vérifier") n.risques++;
    else if (x.etat === "donnée manquante") n.manquantes++;
    else if (x.etat === "sans objet") n.sansObjet++;
  }
  return n;
}

module.exports = {
  referentiel: R.REF.map(it => ({ id: it.id, categorie: it.categorie, intitule: it.intitule,
    fondement: it.fondement, module: it.module || null, convention: !!it.convention,
    generique: it.generique || null, articles: it.articles, verifs: it.verifs || [] })),
  categories: R.CATEGORIES,
  textes: R.TEXTES,
  questions: Q.LIGNES,
  applicables: C.applicables,
  verdicts: C.verdicts,
  etats: C.ETATS,
  plan: P.plan,
  synthese,
};

});

__def("./referentiel-social.js", function(module, exports, require){
/* Le référentiel des obligations sociales de l'employeur — l'étage 1 de
   l'audit social chapeau.

   CE QUE CE FICHIER EST : la liste des obligations, chacune avec sa condition
   d'assujettissement (fonction du profil), sa source, ses questions de
   vérification (étage 2) et son plan d'action (étage 3).

   CE QU'IL S'INTERDIT :

   - Citer un article du code du travail qui n'a pas été lu à la source. Les
     articles vivent dans textes-social.json, chacun avec son identifiant
     LEGIARTI et deux lectures concordantes au relais ; un article NON CONFIRMÉ
     (textes-social-non-confirmes.json) n'entre pas ici — l'obligation qui
     voulait le citer se replie sur une formulation prudente, et le dit.
     Le chargement ÉCHOUE si un article cité manque au dépôt de textes.

   - Affirmer quoi que ce soit de précis sur une convention collective : le
     relais ne sert que le code du travail. Les items conventionnels portent
     la mention « selon la convention collective applicable : à vérifier »,
     et leurs contrôles ne rendent jamais « conforme ».

   - Citer une jurisprudence de mémoire : aucune n'est citée ici — la loi
     lue à la source suffit.

   Les items qui renvoient à un module d'audit dédié (CSE, BDESE, NAO, PSE,
   licenciement économique) restent synthétiques : le chapeau dit si
   l'obligation existe et pourquoi ; l'audit détaillé se fait dans le module. */

const M = require("./moteur-social.js");

const TEXTES = require("./textes-social.json");

/* Un article ne se cite que lu. lu() le dit ; art() ÉCHOUE si on tente de
   citer un numéro absent du dépôt — c'est la garde du référentiel. */
const lu = n => !!(TEXTES[n] && TEXTES[n].id && TEXTES[n].texte);
function art(n) {
  if (!lu(n)) throw new Error(
    `référentiel social : l'article ${n} est cité mais absent du dépôt de textes vérifiés (textes-social.json). ` +
    `Un article non confirmé n'entre pas dans le référentiel.`);
  return n;
}
/* La mise en forme d'un numéro : L1311-2 → « L. 1311-2 ». */
const jol = n => n.replace(/^([LRD])/, "$1. ");
/* Le fondement d'un item : les articles confirmés, cités ; les autres,
   consignés — jamais affirmés. */
function fondement(souhaites) {
  const oks = souhaites.filter(lu), non = souhaites.filter(n => !lu(n));
  let s = "";
  if (oks.length) s += "article" + (oks.length > 1 ? "s " : " ") + oks.map(jol).join(", ")
    + " du code du travail (lu" + (oks.length > 1 ? "s" : "") + " à la source : "
    + oks.map(n => TEXTES[n].id).join(", ") + ")";
  if (non.length) s += (s ? " ; " : "") + non.map(jol).join(", ")
    + " : non confirmé" + (non.length > 1 ? "s" : "") + " au relais à la date de capture — consigné à part, rien n'en est affirmé";
  return s || "aucun article du code du travail confirmé pour cet item — formulation prudente";
}

const CATEGORIES = [
  "instances",
  "documents obligatoires",
  "affichages et informations",
  "registres",
  "négociations",
  "santé-sécurité",
  "formation et entretiens",
  "épargne et protection sociale",
];

/* Les conditions les plus courantes, écrites une fois. */
const toutEmployeur = p => {
  const eff = M.nombre(p.effectif);
  if (eff === null) return { du: null, motif: "L'effectif n'est pas renseigné : dites combien de salariés l'entreprise emploie — la plupart des obligations en dépendent." };
  if (eff < 1) return { du: false, motif: "Aucun salarié déclaré : les obligations d'employeur n'ont pas d'objet." };
  return { du: true, motif: `L'entreprise emploie ${eff} salarié(s) : l'obligation vaut pour tout employeur, sans seuil.` };
};
const auSeuil = n => p => {
  const s = M.seuil(p, n);
  if (!s.connu) return { du: null, motif: s.motif };
  return { du: s.atteint, motif: s.motif };
};
const auSeuilDouzeMois = n => p => {
  const s = M.seuilDouzeMois(p, n);
  if (!s.connu) return { du: null, motif: s.motif };
  return { du: s.atteint, motif: s.motif };
};

const REF = [];
const item = o => { REF.push(o); return o; };

/* ══════════════════════════════════════════════════ 1. les instances ══ */

item({
  id: "SOC-INS-CSE", categorie: "instances",
  intitule: "Comité social et économique (CSE) : mise en place et élections",
  articles: ["L2311-2"].filter(lu),
  articlesSouhaites: ["L2311-2"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = M.seuilDouzeMois(p, 11);
    if (!s.connu) return { du: null, motif: s.motif };
    return { du: s.atteint, motif: s.motif + (s.atteint
      ? " La mise en place du comité s'impose, et les élections se renouvellent à l'échéance des mandats."
      : "") };
  },
  verifs: [
    { cle: "electionsFaites", libelle: "Des élections du CSE ont-elles été organisées ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune élection du comité n'est déclarée alors que le seuil est acquis : organisez le processus électoral sans attendre — l'absence de comité sans procès-verbal de carence expose l'employeur." },
    { cle: "dateDernieresElections", libelle: "Date du premier tour des dernières élections", format: "AAAA-MM-JJ", regle: "ageMaxMois", mois: 48,
      motifNC: "Les mandats du comité durent en principe quatre ans : des élections plus anciennes appellent un renouvellement — vérifiez la durée fixée par votre accord, puis engagez le processus." },
  ],
  plan: {
    priorite: 1,
    action: "Mettre en place le comité social et économique : organiser les élections professionnelles.",
    etapes: [
      "Décompter l'effectif mois par mois et dater le franchissement du seuil de onze salariés sur douze mois consécutifs.",
      "Informer le personnel de l'organisation des élections et inviter les organisations syndicales à négocier le protocole d'accord préélectoral.",
      "Organiser le premier tour (et le second s'il y a lieu) ; établir les procès-verbaux — y compris le procès-verbal de carence si aucun candidat ne se présente.",
      "Conduire ensuite l'audit détaillé du fonctionnement dans le module « comité social et économique ».",
    ],
    acteur: "Direction, avec les organisations syndicales pour le protocole",
    delai: "Processus électoral complet : compter environ deux à trois mois",
    risque: "L'absence de comité sans procès-verbal de carence expose l'employeur — délit d'entrave et dommages-intérêts sont retenus par les juridictions ; l'article de sanction n'a pas été vérifié au relais pour cet audit, la formulation reste donc prudente : faites chiffrer le risque par votre conseil.",
    modele: { page: "audit-cse.html", nom: "module d'audit du comité (questionnaire complet)" },
  },
});

item({
  id: "SOC-INS-CSE-ETAB", categorie: "instances",
  intitule: "CSE central et CSE d'établissement (entreprise à établissements distincts)",
  articles: ["L2313-1"].filter(lu),
  articlesSouhaites: ["L2313-1"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    /* L. 2313-1 : « dans les entreprises d'au moins cinquante salariés
       comportant au moins deux établissements distincts ». */
    const s = M.seuil(p, 50);
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.atteint) return { du: false, motif: s.motif + " L'architecture comité central / comités d'établissement vise les entreprises d'au moins cinquante salariés comportant au moins deux établissements distincts (L. 2313-1)." };
    const e = M.ouiNon(p, "etablissementsDistincts", "L'entreprise comporte-t-elle au moins deux établissements distincts ?");
    if (!e.connu) return { du: null, motif: e.motif };
    if (!e.vrai) return { du: false, motif: "L'entreprise ne déclare pas d'établissements distincts : un comité unique suffit." };
    return { du: true, motif: "Entreprise d'au moins cinquante salariés comportant au moins deux établissements distincts : des comités d'établissement et un comité central doivent être constitués (L. 2313-1)." };
  },
  verifs: [
    { cle: "architectureEnPlace", libelle: "Les CSE d'établissement et le CSE central sont-ils en place ?", format: "oui / non", regle: "oui",
      motifNC: "L'architecture comité central / comités d'établissement n'est pas en place : le découpage se fixe par accord, à défaut par décision unilatérale contestable devant l'administration." },
  ],
  plan: {
    priorite: 1,
    action: "Organiser la représentation par établissement : accord fixant le nombre et le périmètre des établissements distincts, puis élections à chaque niveau.",
    etapes: [
      "Recenser les sites et le niveau où se prennent les décisions de gestion du personnel.",
      "Négocier l'accord d'entreprise fixant le nombre et le périmètre des établissements distincts.",
      "Organiser les élections des comités d'établissement, puis la désignation du comité central.",
    ],
    acteur: "Direction et organisations syndicales",
    delai: "À engager sans attendre si le seuil est acquis",
    risque: "Même exposition que l'absence de comité : représentation incomplète du personnel — à faire chiffrer par votre conseil.",
    modele: { page: "audit-cse.html", nom: "module d'audit du comité" },
  },
});

item({
  id: "SOC-INS-CSSCT", categorie: "instances",
  intitule: "Commission santé, sécurité et conditions de travail (CSSCT)",
  articles: ["L2315-36"].filter(lu),
  articlesSouhaites: ["L2315-36"],
  module: { nom: "santé, sécurité et conditions de travail (SST)", page: "audit-sst.html" },
  condition: p => {
    const s = auSeuil(300)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " La commission santé, sécurité et conditions de travail n'est obligatoire qu'à partir de trois cents salariés — l'inspection du travail peut toutefois l'imposer en deçà dans certains cas." };
    return { du: true, motif: s.motif + " Une commission santé, sécurité et conditions de travail doit être créée au sein du comité." };
  },
  verifs: [
    { cle: "cssctCreee", libelle: "La CSSCT est-elle créée au sein du CSE ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune commission santé, sécurité et conditions de travail n'est déclarée alors que le seuil de trois cents salariés est atteint : créez-la par accord, à défaut par le règlement intérieur du comité." },
  ],
  plan: {
    priorite: 2,
    action: "Créer la commission santé, sécurité et conditions de travail au sein du CSE.",
    etapes: [
      "Négocier l'accord fixant le nombre de membres, les missions déléguées et les moyens de la commission.",
      "À défaut d'accord, la définir dans le règlement intérieur du comité.",
      "Désigner les membres parmi les élus du comité et former les membres.",
    ],
    acteur: "Direction et CSE",
    delai: "Dès le franchissement du seuil de trois cents salariés",
    risque: "Le fonctionnement du comité est irrégulier sans la commission due : exposition au contentieux et à l'intervention de l'inspection du travail — audit détaillé dans le module comité.",
    modele: { page: "audit-cse.html", nom: "module d'audit du comité" },
  },
});

item({
  id: "SOC-INS-COMMISSIONS", categorie: "instances",
  intitule: "Autres commissions du CSE (formation, information et aide au logement, égalité professionnelle)",
  articles: [],
  articlesSouhaites: [],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = auSeuil(300)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " Les commissions supplémentaires du comité naissent, pour l'essentiel, à partir de trois cents salariés." };
    return { du: true, motif: s.motif + " Les commissions du comité (formation, information et aide au logement, égalité professionnelle) doivent être constituées — leurs articles précis sont vérifiés dans le module dédié." };
  },
  verifs: [
    { cle: "commissionsConstituees", libelle: "Ces commissions sont-elles constituées ?", format: "oui / non", regle: "oui",
      motifNC: "Les commissions dues à partir de trois cents salariés ne sont pas déclarées constituées : constituez-les, ou vérifiez dans le module comité ce qu'un accord a pu aménager." },
  ],
  plan: {
    priorite: 3,
    action: "Constituer les commissions du comité dues à l'effectif, ou vérifier ce qu'un accord d'entreprise a aménagé.",
    etapes: [
      "Lister les commissions dues à l'effectif dans le module d'audit du comité.",
      "Les constituer par accord ou par le règlement intérieur du comité.",
    ],
    acteur: "Direction et CSE",
    delai: "Dès le franchissement du seuil",
    risque: "Fonctionnement irrégulier du comité — l'audit détaillé et les articles se trouvent dans le module dédié.",
    modele: { page: "audit-cse.html", nom: "module d'audit du comité" },
  },
});

item({
  id: "SOC-INS-GROUPE", categorie: "instances",
  intitule: "Comité de groupe",
  articles: ["L2331-1"].filter(lu),
  articlesSouhaites: ["L2331-1"],
  module: null,
  condition: p => {
    const g = M.ouiNon(p, "groupe", "L'entreprise appartient-elle à un groupe ?");
    if (!g.connu) return { du: null, motif: g.motif };
    if (!g.vrai) return { du: false, motif: "L'entreprise ne déclare pas appartenir à un groupe : le comité de groupe n'a pas d'objet." };
    return { du: true, motif: "L'entreprise appartient à un groupe : un comité de groupe doit exister au niveau de l'entreprise dominante" + (lu("L2331-1") ? " (" + jol("L2331-1") + ")" : " — l'article précis n'a pas été confirmé au relais, vérifiez le texte avec votre conseil") + ". Si c'est la société dominante qui manque à l'obligation, signalez-le-lui." };
  },
  verifs: [
    { cle: "comiteGroupeExiste", libelle: "Un comité de groupe est-il constitué au niveau de l'entreprise dominante ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun comité de groupe n'est déclaré : l'entreprise dominante du groupe doit le constituer — rapprochez-vous d'elle, ou documentez pourquoi le périmètre y échappe." },
  ],
  plan: {
    priorite: 3,
    action: "Faire constituer le comité de groupe au niveau de l'entreprise dominante.",
    etapes: [
      "Identifier l'entreprise dominante et le périmètre du groupe.",
      "Saisir la direction du groupe de la constitution du comité, ou documenter pourquoi le périmètre n'y entre pas.",
    ],
    acteur: "Direction de l'entreprise dominante",
    delai: "À engager dès que le groupe est constitué",
    risque: "Défaut de représentation au niveau du groupe : exposition au contentieux — formulation prudente, l'article de sanction n'a pas été vérifié ici.",
    modele: null,
  },
});

item({
  id: "SOC-INS-REF-HARCELEMENT", categorie: "instances",
  intitule: "Référent chargé de la lutte contre le harcèlement sexuel et les agissements sexistes (entreprise d'au moins 250 salariés)",
  articles: ["L1153-5-1"].filter(lu),
  articlesSouhaites: ["L1153-5-1"],
  module: { nom: "santé, sécurité et conditions de travail (SST)", page: "audit-sst.html" },
  condition: p => {
    const s = auSeuil(250)(p);
    if (s.du === null) return s;
    return { du: s.du, motif: s.motif + (s.du
      ? " Un référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes doit être désigné (" + (lu("L1153-5-1") ? jol("L1153-5-1") : "article à vérifier") + "). Le comité désigne par ailleurs son propre référent parmi ses membres — vérifié dans le module comité." : "") };
  },
  verifs: [
    { cle: "referentDesigne", libelle: "Le référent d'entreprise est-il désigné ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun référent harcèlement sexuel n'est désigné alors que l'entreprise atteint deux cent cinquante salariés : désignez-le et faites-le connaître." },
    { cle: "coordonneesDiffusees", libelle: "Ses coordonnées sont-elles portées à la connaissance des salariés ?", format: "oui / non", regle: "oui",
      motifNC: "Le référent existe mais ses coordonnées ne sont pas diffusées : l'information des salariés fait partie de l'obligation — diffusez-les par tout moyen." },
  ],
  plan: {
    priorite: 2,
    action: "Désigner le référent harcèlement sexuel de l'entreprise et diffuser ses coordonnées.",
    etapes: [
      "Choisir et former le référent (ressources humaines le plus souvent).",
      "Formaliser la désignation et diffuser ses coordonnées avec l'information harcèlement (affichage, intranet, livret).",
    ],
    acteur: "Direction / ressources humaines",
    delai: "Immédiat — la désignation ne demande aucune procédure lourde",
    risque: "Manquement à la prévention du harcèlement : il est retenu contre l'employeur dans tout contentieux de harcèlement — la prévention documentée est votre meilleure défense.",
    modele: { page: "documents.html", nom: "note d'information (modèle « note-rh »)" },
  },
});

/* ══════════════════════════════════ 2. les documents obligatoires ══ */

item({
  id: "SOC-DOC-RI", categorie: "documents obligatoires",
  intitule: "Règlement intérieur : établissement, contenu obligatoire, dépôt et publicité",
  articles: ["L1311-2", "L1321-1", "L1321-2", "L1321-4"].filter(lu),
  articlesSouhaites: ["L1311-2", "L1321-1", "L1321-2", "L1321-4"],
  module: null,
  condition: p => {
    const s = M.seuilDouzeMois(p, 50);
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.atteint) return { du: false, motif: s.motif + " Le règlement intérieur est obligatoire à partir de cinquante salariés (seuil apprécié dans la durée) ; en deçà il reste possible, aux mêmes conditions de fond et de forme." };
    return { du: true, motif: s.motif + " Un règlement intérieur doit être établi, avec son contenu obligatoire (discipline, santé-sécurité, droits de la défense, rappel des dispositions sur les harcèlements et agissements sexistes), soumis au comité, déposé et publié." };
  },
  verifs: [
    { cle: "existe", libelle: "Un règlement intérieur écrit existe-t-il ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun règlement intérieur alors que le seuil est acquis : sans lui, l'échelle des sanctions disciplinaires est fragilisée — une sanction prononcée sans règlement intérieur opposable peut être annulée." },
    { cle: "contenuHarcelement", libelle: "Rappelle-t-il les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ?", format: "oui / non", regle: "oui",
      motifNC: "Le règlement intérieur ne rappelle pas les dispositions relatives aux harcèlements et agissements sexistes : ce contenu est obligatoire — complétez-le à la prochaine révision." },
    { cle: "avisCSE", libelle: "L'avis du CSE a-t-il été recueilli (texte initial et chaque modification) ?", format: "oui / non", regle: "oui",
      motifNC: "L'avis du comité n'est pas établi : sans cette consultation, le règlement intérieur n'est pas opposable — reprenez la procédure." },
    { cle: "depotEtPublicite", libelle: "Dépôt (greffe des prud'hommes, inspection du travail) et publicité faits ?", format: "oui / non", regle: "oui",
      motifNC: "Les formalités de dépôt et de publicité ne sont pas établies : elles conditionnent l'entrée en vigueur du texte — accomplissez-les et conservez les récépissés." },
    { cle: "dateDerniereRevision", libelle: "Date de la dernière révision", format: "AAAA-MM-JJ", regle: "date" },
  ],
  plan: {
    priorite: 2,
    action: "Établir (ou régulariser) le règlement intérieur : contenu obligatoire, avis du CSE, dépôt, publicité.",
    etapes: [
      "Rédiger ou réviser le texte : discipline et échelle des sanctions, santé et sécurité, droits de la défense, rappel des dispositions relatives aux harcèlements et agissements sexistes, protection des lanceurs d'alerte.",
      "Soumettre le projet à l'avis du comité social et économique.",
      "Transmettre à l'inspection du travail avec l'avis du comité, déposer au greffe du conseil de prud'hommes.",
      "Porter le texte à la connaissance des salariés par tout moyen et dater cette publicité ; fixer la date d'entrée en vigueur (un mois après les formalités).",
    ],
    acteur: "Direction / ressources humaines, avis du CSE",
    delai: "Compter six à huit semaines, consultation du comité comprise",
    risque: "Sans règlement intérieur opposable, les sanctions disciplinaires sont contestables et peuvent être annulées ; l'inspection du travail peut exiger l'établissement du texte.",
    modele: { page: "documents.html", nom: "modèle à établir (aucune trame de règlement intérieur dans le générateur à ce jour)" },
  },
});

item({
  id: "SOC-DOC-DUERP", categorie: "documents obligatoires",
  intitule: "Document unique d'évaluation des risques professionnels (DUERP)",
  articles: ["R4121-1", "R4121-2", "R4121-4"].filter(lu),
  articlesSouhaites: ["R4121-1", "R4121-2", "R4121-4"],
  module: { nom: "santé, sécurité et conditions de travail (SST)", page: "audit-sst.html" },
  condition: toutEmployeur,
  verifs: [
    { cle: "existe", libelle: "Le document unique existe-t-il ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun document unique d'évaluation des risques : c'est le socle de toute la prévention — l'établir est la première urgence de ce plan." },
    { cle: "dateMaj", libelle: "Date de la dernière mise à jour", format: "AAAA-MM-JJ", regle: "ageMaxMois", mois: 12, siEffectifAuMoins: 11,
      motifNC: "La dernière mise à jour du document unique date de plus d'un an : mettez-le à jour — R. 4121-2 impose une mise à jour au moins annuelle dans les entreprises d'au moins onze salariés, et à chaque aménagement important ou information nouvelle.",
      motifSousSeuil: "La dernière mise à jour date de plus d'un an. Sous onze salariés, le rythme annuel n'est pas exigé (R. 4121-2) — mais la mise à jour s'impose à chaque aménagement important et à chaque information nouvelle : vérifiez qu'aucun ne s'est produit depuis." },
    { cle: "accessible", libelle: "Le document et ses versions successives sont-ils tenus à la disposition des travailleurs (et anciens travailleurs), du CSE et des services de prévention ?", format: "oui / non", regle: "oui",
      motifNC: "Le document unique n'est pas tenu à disposition : R. 4121-4 impose de le tenir, avec ses versions antérieures conservées quarante ans, à la disposition des travailleurs, des anciens travailleurs et des services concernés." },
  ],
  plan: {
    priorite: 1,
    action: "Établir le document unique d'évaluation des risques, le tenir à jour et le rendre accessible.",
    etapes: [
      "Inventorier les unités de travail et évaluer les risques de chacune (avec le service de prévention et de santé au travail).",
      "Transcrire les résultats dans le document unique et en déduire les actions de prévention.",
      "Fixer le rythme de mise à jour (au moins annuel à partir de onze salariés, et à chaque changement important).",
      "Porter les modalités d'accès à la connaissance des salariés, du CSE et du service de prévention.",
    ],
    acteur: "Direction, avec le service de prévention et de santé au travail et le CSE",
    delai: "Premier document : quelques semaines ; ne pas attendre un contrôle ou un accident",
    risque: "L'absence ou la carence du document unique est retenue contre l'employeur dans tout contentieux d'accident du travail ou de faute inexcusable, et l'inspection du travail la sanctionne — la formulation du quantum reste prudente : l'article d'amende n'a pas été vérifié ici.",
    modele: { page: "documents.html", nom: "modèle à établir (aucune trame DUERP dans le générateur à ce jour)" },
  },
});

item({
  id: "SOC-DOC-BDESE", categorie: "documents obligatoires",
  intitule: "Base de données économiques, sociales et environnementales (BDESE)",
  articles: [],
  articlesSouhaites: [],
  module: { nom: "base de données (BDESE)", page: "audit-bdese.html" },
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    return { du: s.du, motif: s.motif + (s.du
      ? " Une base de données économiques, sociales et environnementales doit exister et alimenter les consultations du comité — son régime, son contenu et ses rubriques s'auditent dans le module dédié."
      : " La base de données n'est due qu'à partir de cinquante salariés.") };
  },
  verifs: [
    { cle: "bdeseExiste", libelle: "La base existe-t-elle et est-elle tenue à jour ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune base de données déclarée alors que le seuil de cinquante salariés est atteint : sans elle, les consultations du comité sont irrégulières — constituez-la, puis auditez-la dans le module dédié." },
  ],
  plan: {
    priorite: 2,
    action: "Constituer la BDESE et la tenir à jour, puis l'auditer dans le module dédié.",
    etapes: [
      "Choisir le support et les droits d'accès des élus.",
      "Rassembler les rubriques dues (le module dédié en donne la liste exacte selon l'effectif et l'accord éventuel).",
      "Notifier aux élus les modalités d'accès, dater la mise à disposition.",
    ],
    acteur: "Direction / ressources humaines",
    delai: "Avant la prochaine consultation récurrente du comité",
    risque: "Consultations du comité irrégulières, délais de consultation qui ne courent pas : l'exposition précise s'audite dans le module BDESE.",
    modele: { page: "audit-bdese.html", nom: "module d'audit de la base (liste des rubriques dues)" },
  },
});

item({
  id: "SOC-DOC-INDEX", categorie: "documents obligatoires",
  intitule: "Index de l'égalité professionnelle : calcul et publication annuels",
  articles: ["L1142-8"].filter(lu),
  articlesSouhaites: ["L1142-8"],
  module: { nom: "négociation obligatoire (NAO)", page: "audit-nao.html" },
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    return { du: s.du, motif: s.motif + (s.du
      ? " Les indicateurs d'écarts de rémunération entre les femmes et les hommes" + (lu("L1142-8") ? " (" + jol("L1142-8") + ")" : "") + " se calculent et se publient chaque année."
      : " L'index n'est dû qu'à partir de cinquante salariés.") };
  },
  verifs: [
    { cle: "indexPublie", libelle: "L'index de l'année en cours est-il calculé et publié ?", format: "oui / non", regle: "oui",
      motifNC: "L'index de l'égalité professionnelle n'est pas publié : sa non-publication expose, à elle seule, à la pénalité sur l'égalité — le module NAO mesure cette exposition." },
    { cle: "datePublication", libelle: "Date de la dernière publication", format: "AAAA-MM-JJ", regle: "ageMaxMois", mois: 12,
      motifNC: "La dernière publication de l'index date de plus d'un an : la publication est annuelle — recalculez et republiez." },
  ],
  plan: {
    priorite: 2,
    action: "Calculer l'index de l'égalité professionnelle et le publier (site de l'entreprise, télédéclaration).",
    etapes: [
      "Rassembler les données de rémunération par sexe, âge et catégorie sur la période de référence.",
      "Calculer les indicateurs, puis publier la note globale et télédéclarer.",
      "Si la note est sous les seuils réglementaires, définir les mesures de correction et de rattrapage.",
    ],
    acteur: "Ressources humaines / paie",
    delai: "Publication annuelle — au plus tard le 1er mars pour l'année précédente en pratique : vérifiez l'échéance réglementaire en vigueur",
    risque: "La non-publication expose à la pénalité financière sur l'égalité professionnelle ; l'exposition exacte se mesure dans le module NAO (contrôle égalité).",
    modele: { page: "audit-nao.html", nom: "module NAO — contrôle égalité et index" },
  },
});

item({
  id: "SOC-DOC-OETH", categorie: "documents obligatoires",
  intitule: "Obligation d'emploi des travailleurs handicapés (OETH) : emploi et déclaration",
  articles: ["L5212-1", "L5212-2", "L5212-5"].filter(lu),
  articlesSouhaites: ["L5212-1", "L5212-2", "L5212-5"],
  module: null,
  condition: p => {
    const s = auSeuil(20)(p);
    if (s.du === null) return s;
    return { du: s.du, motif: s.motif + (s.du
      ? " L'obligation d'emploi des travailleurs handicapés s'applique : emploi dans la proportion légale de l'effectif, et déclaration annuelle."
      : " L'obligation d'emploi ne s'impose qu'à partir de vingt salariés ; la déclaration d'emploi via la déclaration sociale peut rester due — vérifiez avec votre expert paie.") };
  },
  verifs: [
    { cle: "declarationFaite", libelle: "La déclaration annuelle (via la DSN) est-elle faite ?", format: "oui / non", regle: "oui",
      motifNC: "La déclaration annuelle de l'obligation d'emploi n'est pas établie : régularisez-la — son absence expose à la contribution majorée." },
    { cle: "obligationSatisfaite", libelle: "L'obligation est-elle satisfaite (emploi direct, contribution, accord agréé) ?", format: "oui / non", regle: "oui",
      motifNC: "L'obligation d'emploi n'est pas couverte (ni emploi direct suffisant, ni contribution, ni accord agréé) : chiffrez l'écart et choisissez la voie de régularisation." },
  ],
  plan: {
    priorite: 2,
    action: "Régulariser l'obligation d'emploi des travailleurs handicapés : décompte, déclaration, couverture.",
    etapes: [
      "Décompter les bénéficiaires de l'obligation d'emploi présents dans l'effectif.",
      "Établir la déclaration annuelle via la déclaration sociale nominative.",
      "Couvrir l'écart éventuel : recrutements, accueil de stagiaires, contribution, ou accord agréé.",
    ],
    acteur: "Ressources humaines / paie",
    delai: "Déclaration annuelle — échéance calée sur la DSN d'une échéance de printemps : vérifiez l'échéance en vigueur",
    risque: "Contribution annuelle, majorée en cas de carence prolongée — le chiffrage exact dépend de textes réglementaires non vérifiés ici : faites-le établir par votre expert paie.",
    modele: null,
  },
});

/* ══════════════════════════════ 3. affichages et informations ══ */

item({
  id: "SOC-AFF-HARCELEMENT", categorie: "affichages et informations",
  intitule: "Information sur les harcèlements moral et sexuel (textes, voies de recours, coordonnées)",
  articles: ["L1152-4", "L1153-5"].filter(lu),
  articlesSouhaites: ["L1152-4", "L1153-5"],
  module: { nom: "santé, sécurité et conditions de travail (SST)", page: "audit-sst.html" },
  condition: toutEmployeur,
  verifs: [
    { cle: "informationFaite", libelle: "L'information est-elle faite par tout moyen dans les lieux de travail (et lieux d'embauche pour le harcèlement sexuel) ?", format: "oui / non", regle: "oui",
      motifNC: "L'information sur les harcèlements n'est pas en place : affichez ou diffusez les textes — pour le harcèlement sexuel, l'information précise aussi les actions ouvertes et les coordonnées des autorités et services compétents." },
    { cle: "coordonneesAJour", libelle: "Les coordonnées (médecin du travail, inspection du travail, Défenseur des droits, référents) sont-elles à jour ?", format: "oui / non", regle: "oui",
      motifNC: "L'information existe mais ses coordonnées ne sont pas à jour : une information périmée ne remplit pas l'obligation — mettez-la à jour." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre en place l'information obligatoire sur les harcèlements moral et sexuel.",
    etapes: [
      "Préparer le support : texte des articles applicables, actions ouvertes aux victimes, coordonnées des autorités et services compétents et des référents.",
      "L'afficher ou le diffuser par tout moyen dans les lieux de travail, et dans les lieux d'embauche pour le harcèlement sexuel.",
      "Dater la mise en place et prévoir sa mise à jour à chaque changement de coordonnées.",
    ],
    acteur: "Ressources humaines",
    delai: "Immédiat — une journée suffit",
    risque: "Le défaut d'information est retenu contre l'employeur dans tout contentieux de harcèlement : la prévention documentée conditionne l'exonération de sa responsabilité.",
    modele: { page: "documents.html", nom: "note d'information (modèle « note-rh »)" },
  },
});

item({
  id: "SOC-AFF-EGALITE", categorie: "affichages et informations",
  intitule: "Information sur l'interdiction des discriminations (textes du code pénal, lieux de travail et d'embauche)",
  articles: ["L1142-6"].filter(lu),
  articlesSouhaites: ["L1142-6"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "informationFaite", libelle: "Le texte des articles 225-1 à 225-4 du code pénal est-il porté, par tout moyen, à la connaissance des personnes dans les lieux de travail et les locaux (ou à la porte des locaux) où se fait l'embauche ?", format: "oui / non", regle: "oui",
      motifNC: "Le texte des articles 225-1 à 225-4 du code pénal (interdiction des discriminations) n'est pas porté à la connaissance des salariés et candidats : L. 1142-6 l'impose, par tout moyen, dans les lieux de travail et les lieux d'embauche." },
  ],
  plan: {
    priorite: 3,
    action: "Porter à la connaissance des salariés et des candidats le texte des articles 225-1 à 225-4 du code pénal (interdiction des discriminations).",
    etapes: [
      "Préparer le support reprenant les textes (reproduire les articles en vigueur du code pénal).",
      "Le diffuser par tout moyen dans les lieux de travail et les locaux — ou à la porte des locaux — où se fait l'embauche.",
    ],
    acteur: "Ressources humaines",
    delai: "Immédiat",
    risque: "Manquement d'information retenu dans les contentieux de discrimination — formulation prudente : l'article d'amende n'a pas été vérifié ici.",
    modele: { page: "documents.html", nom: "note d'information (modèle « note-rh »)" },
  },
});

item({
  id: "SOC-AFF-COORDONNEES", categorie: "affichages et informations",
  intitule: "Affichage des coordonnées : inspection du travail, médecin du travail, services de secours d'urgence",
  articles: ["D4711-1"].filter(lu),
  articlesSouhaites: ["D4711-1"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "affichageFait", libelle: "L'affichage est-il en place dans des locaux normalement accessibles aux salariés ?", format: "oui / non", regle: "oui",
      motifNC: "Les coordonnées de l'inspection du travail, du médecin du travail et des secours d'urgence ne sont pas affichées : c'est l'affichage le plus simple à régulariser — faites-le aujourd'hui." },
    { cle: "coordonneesAJour", libelle: "Les coordonnées affichées sont-elles à jour ?", format: "oui / non", regle: "oui",
      motifNC: "L'affichage existe mais ses coordonnées sont périmées : mettez-les à jour — un affichage faux ne remplit pas l'obligation." },
  ],
  plan: {
    priorite: 3,
    action: "Afficher les coordonnées de l'inspection du travail (avec le nom de l'inspecteur), du médecin du travail et des secours d'urgence.",
    etapes: [
      "Rassembler les coordonnées à jour (unité de contrôle de l'inspection, service de prévention et de santé au travail, numéros d'urgence).",
      "Les afficher dans des locaux normalement accessibles aux salariés, et dater l'affichage.",
    ],
    acteur: "Ressources humaines / services généraux",
    delai: "Immédiat — une heure suffit",
    risque: "Contravention en cas de contrôle — le quantum n'a pas été vérifié ici : formulation prudente.",
    modele: { page: "documents.html", nom: "note d'information (modèle « note-rh »)" },
  },
});

item({
  id: "SOC-AFF-CONSIGNE-INCENDIE", categorie: "affichages et informations",
  intitule: "Consigne de sécurité incendie",
  articles: ["R4227-37"].filter(lu),
  articlesSouhaites: ["R4227-37"],
  module: null,
  condition: p => {
    const eff = M.nombre(p.effectif);
    const inflammables = p.matieresInflammables;
    if (eff === null && !M.renseigne(inflammables))
      return { du: null, motif: "Ni l'effectif ni la présence de matières inflammables ne sont renseignés : la consigne de sécurité incendie est due dans les établissements où plus de cinquante personnes sont habituellement réunies, et dans ceux où sont manipulées des matières inflammables — répondez pour conclure." };
    if ((eff !== null && eff >= 50) || M.dit(inflammables))
      return { du: true, motif: (eff !== null && eff >= 50
        ? `Avec ${eff} salariés, plus de cinquante personnes sont habituellement réunies : `
        : "Des matières inflammables sont manipulées : ")
        + "une consigne de sécurité incendie doit être établie et affichée" + (lu("R4227-37") ? " (" + jol("R4227-37") + ")" : "") + "." };
    if (!M.renseigne(inflammables))
      return { du: null, motif: "L'effectif est sous cinquante, mais il n'est pas dit si des matières inflammables sont manipulées : la consigne est due dans ce cas — répondez pour conclure." };
    return { du: false, motif: "Moins de cinquante personnes réunies et pas de matières inflammables déclarées : la consigne formalisée du champ de R. 4227-34 n'est pas exigée — mais R. 4227-37 prévoit que, dans les autres établissements, des instructions permettant d'assurer l'évacuation des personnes sont établies : gardez-les écrites." };
  },
  verifs: [
    { cle: "consigneEtablie", libelle: "La consigne est-elle établie et affichée de manière très apparente ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune consigne de sécurité incendie : établissez-la et affichez-la — matériel, personnes chargées de l'évacuation, appel des secours, essais et exercices." },
    { cle: "exercicesFaits", libelle: "Les essais et exercices périodiques sont-ils réalisés et consignés ?", format: "oui / non", regle: "oui",
      motifNC: "La consigne existe mais les essais et exercices ne sont pas documentés : réalisez-les et consignez-les — c'est ce qu'un contrôle vérifie d'abord." },
  ],
  plan: {
    priorite: 1,
    action: "Établir, afficher et faire vivre la consigne de sécurité incendie.",
    etapes: [
      "Rédiger la consigne : matériel d'extinction et de secours, personnes chargées de l'évacuation, modalités d'alerte, appel des secours.",
      "L'afficher de manière très apparente dans chaque local concerné.",
      "Organiser les essais et exercices périodiques et les consigner (registre de sécurité).",
    ],
    acteur: "Direction / responsable sécurité",
    delai: "Sans délai : la sécurité des personnes est en cause",
    risque: "En cas d'incendie, la carence engage la responsabilité pénale de l'employeur ; en amont, l'inspection du travail peut mettre en demeure — la sécurité des personnes commande de traiter cet item en tête de plan.",
    modele: null,
  },
});

item({
  id: "SOC-AFF-HORAIRES", categorie: "affichages et informations",
  intitule: "Affichage de l'horaire collectif de travail",
  articles: ["L3171-1"].filter(lu),
  articlesSouhaites: ["L3171-1"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "affichageFait", libelle: "L'horaire collectif est-il affiché sur les lieux de travail (ou le décompte individuel organisé pour les salariés hors horaire collectif) ?", format: "oui / non", regle: "oui",
      motifNC: "L'horaire collectif n'est pas affiché : affichez-le daté et signé — et pour les salariés qui n'y sont pas soumis, organisez le décompte individuel de la durée du travail." },
  ],
  plan: {
    priorite: 3,
    action: "Afficher l'horaire collectif, et organiser le décompte du temps de travail des salariés hors horaire collectif.",
    etapes: [
      "Formaliser l'horaire collectif (début, fin, repos) et l'afficher sur les lieux de travail.",
      "Pour les salariés en horaires individualisés ou en forfait : mettre en place le décompte individuel correspondant.",
    ],
    acteur: "Ressources humaines",
    delai: "Immédiat",
    risque: "En litige sur les heures supplémentaires, l'absence d'affichage et de décompte se retourne contre l'employeur : c'est lui qui doit justifier les horaires.",
    modele: null,
  },
});

item({
  id: "SOC-AFF-CONVENTION", categorie: "affichages et informations",
  intitule: "Information des salariés sur la convention collective applicable (avis, exemplaire à disposition)",
  articles: ["R2262-1"].filter(lu),
  articlesSouhaites: ["R2262-1"],
  module: null,
  condition: p => {
    if (!M.renseigne(p.conventionCollective))
      return { du: null, motif: "La convention collective applicable n'est pas renseignée. Identifiez-la (activité réelle de l'entreprise, code APE en indice) : presque toutes les entreprises relèvent d'une branche — et l'information des salariés sur les textes applicables est due." };
    return { du: true, motif: `Convention déclarée : « ${String(p.conventionCollective).trim()} ». Les salariés doivent être informés des textes conventionnels applicables — avis, exemplaire tenu à disposition, mention sur le bulletin de paie.` };
  },
  verifs: [
    { cle: "avisEtAcces", libelle: "L'avis est-il communiqué et un exemplaire à jour tenu à la disposition des salariés (ou sur l'intranet) ?", format: "oui / non", regle: "oui",
      motifNC: "L'information sur la convention collective n'est pas organisée : communiquez l'avis, tenez un exemplaire à jour à disposition (ou en ligne), vérifiez la mention au bulletin de paie." },
  ],
  plan: {
    priorite: 3,
    action: "Organiser l'information des salariés sur la convention collective et les accords applicables.",
    etapes: [
      "Vérifier l'identification de la convention (activité réelle, non le seul code APE).",
      "Communiquer l'avis à chaque salarié (embauche, puis tout changement), tenir un exemplaire à jour à disposition ou en ligne.",
      "Vérifier la mention de la convention sur les bulletins de paie.",
    ],
    acteur: "Ressources humaines",
    delai: "Immédiat",
    risque: "Une convention non portée à la connaissance des salariés leur reste opposable difficilement ; en sens inverse, ses avantages leur restent dus — le défaut d'information ne protège de rien.",
    modele: { page: "documents.html", nom: "note d'information (modèle « note-rh »)" },
  },
});

item({
  id: "SOC-AFF-FUMER", categorie: "affichages et informations",
  intitule: "Signalisation de l'interdiction de fumer et de vapoter",
  articles: [],
  articlesSouhaites: [],
  module: null,
  generique: "Cette obligation relève du code de la santé publique, que le relais de l'application ne sert pas : aucun article n'est cité ni vérifié ici. L'interdiction de fumer dans les lieux de travail fermés et couverts, et sa signalisation apparente, sont à vérifier sur les textes en vigueur.",
  condition: toutEmployeur,
  verifs: [
    { cle: "signalisationFaite", libelle: "La signalisation (interdiction de fumer, et de vapoter dans les locaux concernés) est-elle apparente ?", format: "oui / non", regle: "oui",
      motifNC: "La signalisation de l'interdiction de fumer n'est pas déclarée en place : installez-la — et vérifiez les textes du code de la santé publique, non servis par le relais de cette application." },
  ],
  plan: {
    priorite: 3,
    action: "Mettre en place la signalisation de l'interdiction de fumer et de vapoter, après vérification des textes du code de la santé publique.",
    etapes: [
      "Vérifier les textes en vigueur (code de la santé publique — hors du champ du relais de cette application).",
      "Apposer la signalisation apparente dans les locaux concernés.",
    ],
    acteur: "Services généraux",
    delai: "Immédiat",
    risque: "Amendes prévues par le code de la santé publique — non vérifiées ici : formulation prudente.",
    modele: null,
  },
});

/* ══════════════════════════════════════════════ 4. les registres ══ */

item({
  id: "SOC-REG-PERSONNEL", categorie: "registres",
  intitule: "Registre unique du personnel",
  articles: ["L1221-13"].filter(lu),
  articlesSouhaites: ["L1221-13"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "tenu", libelle: "Le registre est-il tenu dans chaque établissement, à jour des entrées et sorties ?", format: "oui / non", regle: "oui",
      motifNC: "Le registre unique du personnel n'est pas tenu (ou pas à jour) : c'est un incontournable de tout contrôle — reconstituez-le sans attendre, avec les mentions dans l'ordre des embauches." },
  ],
  plan: {
    priorite: 2,
    action: "Tenir le registre unique du personnel, par établissement, à jour des embauches et départs.",
    etapes: [
      "Reconstituer la liste des salariés dans l'ordre des embauches, avec les mentions requises (identité, emploi, qualification, dates, nature du contrat, et pour les salariés étrangers le titre valant autorisation de travail).",
      "Choisir le support (papier ou numérique après information des instances) et le tenir à disposition de l'inspection du travail et des élus.",
      "Mettre à jour à chaque entrée et sortie.",
    ],
    acteur: "Ressources humaines",
    delai: "Immédiat",
    risque: "Amende par salarié concerné en cas de contrôle — le quantum n'a pas été vérifié ici : formulation prudente.",
    modele: null,
  },
});

item({
  id: "SOC-REG-SECURITE", categorie: "registres",
  intitule: "Registres de sécurité : vérifications, contrôles et observations de l'inspection",
  articles: ["L4711-1", "L4711-2", "L4711-5"].filter(lu),
  articlesSouhaites: ["L4711-1", "L4711-2", "L4711-5"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "tenu", libelle: "Les attestations, consignes, résultats et rapports des vérifications et contrôles (L. 4711-1) sont-ils conservés — le cas échéant réunis sur un registre unique ?", format: "oui / non", regle: "oui",
      motifNC: "Les documents des vérifications et contrôles ne sont pas rassemblés : L. 4711-1 les met à la charge de l'employeur, et L. 4711-5 permet de les réunir sur un registre unique — sans eux, impossible de prouver que les contrôles ont eu lieu." },
    { cle: "misesEnDemeure", libelle: "Les observations et mises en demeure de l'inspection du travail (santé-sécurité, médecine du travail, prévention) sont-elles conservées ?", format: "oui / non", regle: "oui",
      motifNC: "Les observations et mises en demeure de l'inspection ne sont pas conservées : L. 4711-2 impose leur conservation par l'employeur." },
  ],
  plan: {
    priorite: 2,
    action: "Rassembler et tenir les documents de vérifications et contrôles au titre de la santé-sécurité.",
    etapes: [
      "Inventorier les vérifications périodiques dues (installations électriques, moyens d'extinction, équipements de travail, aération…).",
      "Rassembler attestations, consignes, résultats et rapports (L. 4711-1) et les observations et mises en demeure de l'inspection (L. 4711-2) — au besoin sur un registre unique (L. 4711-5).",
      "Programmer les vérifications manquantes avec des organismes agréés.",
    ],
    acteur: "Services généraux / responsable sécurité",
    delai: "Inventaire immédiat ; vérifications manquantes sous quelques semaines",
    risque: "Sans preuve des vérifications, tout accident se plaide mal : la carence documentaire se retourne contre l'employeur.",
    modele: null,
  },
});

item({
  id: "SOC-REG-DGI", categorie: "registres",
  intitule: "Registre des alertes en cas de danger grave et imminent",
  articles: ["D4132-1"].filter(lu),
  articlesSouhaites: ["D4132-1"],
  module: null,
  condition: p => {
    const s = M.seuilDouzeMois(p, 11);
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.atteint) return { du: false, motif: s.motif + " Le registre spécial des alertes accompagne le droit d'alerte des représentants du personnel : sans comité, il n'a pas de support — l'obligation renaîtra avec lui." };
    return { du: true, motif: "Le comité étant dû, le registre spécial des alertes en cas de danger grave et imminent doit être ouvert : les alertes des représentants du personnel s'y consignent." };
  },
  verifs: [
    { cle: "ouvert", libelle: "Le registre spécial est-il ouvert et accessible aux représentants du personnel ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun registre spécial des alertes : ouvrez-le — une alerte pour danger grave et imminent doit pouvoir être consignée et datée immédiatement." },
  ],
  plan: {
    priorite: 3,
    action: "Ouvrir le registre spécial des alertes danger grave et imminent et le porter à la connaissance des élus.",
    etapes: [
      "Ouvrir le registre (pages numérotées, authentifié) et fixer son lieu de consultation.",
      "Informer les membres du comité de son existence et de son usage.",
    ],
    acteur: "Direction",
    delai: "Immédiat",
    risque: "En cas d'alerte non consignée puis d'accident, la procédure du danger grave et imminent est inapplicable : l'employeur perd la traçabilité qui le protège aussi.",
    modele: null,
  },
});

/* ══════════════════════════════════════════ 5. les négociations ══ */

item({
  id: "SOC-NEG-NAO", categorie: "négociations",
  intitule: "Négociations obligatoires d'entreprise (rémunération, égalité, gestion des emplois, salariés expérimentés)",
  articles: [],
  articlesSouhaites: [],
  module: { nom: "négociation obligatoire (NAO)", page: "audit-nao.html" },
  condition: p => {
    const s = M.ouiNon(p, "sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?");
    if (!s.connu) return { du: null, motif: s.motif + " C'est elle — pas l'effectif — qui déclenche l'obligation de négocier." };
    if (!s.vrai) return { du: false, motif: "Aucune section syndicale d'organisation représentative déclarée : les négociations obligatoires ne sont pas dues. Le module NAO le documente — un « sans objet » qui se vérifie, pas un feu vert." };
    return { du: true, motif: "Une section syndicale d'organisation représentative est constituée : les négociations obligatoires sont dues — thèmes, périodicités, loyauté et dépôts s'auditent dans le module NAO."
      + (M.dit(p.accordsCollectifs) ? " Des accords collectifs existent par ailleurs : versez-les au module, leurs clauses (méthode, périodicités) peuvent commander le calendrier." : "") };
  },
  verifs: [
    { cle: "negociationsEngagees", libelle: "Les négociations dues ont-elles été engagées aux périodicités applicables ?", format: "oui / non", regle: "oui",
      motifNC: "Les négociations obligatoires ne sont pas déclarées engagées : le module NAO dit lesquelles sont dues, à quelles périodicités, et mesure l'exposition — délit d'entrave et pénalités." },
  ],
  plan: {
    priorite: 1,
    action: "Engager (ou remettre au calendrier) les négociations obligatoires, et auditer leur conduite dans le module NAO.",
    etapes: [
      "Ouvrir le module NAO et décrire l'existant : accord de méthode éventuel, dates d'engagement, issues.",
      "Convoquer la première réunion des négociations en retard : lieu, calendrier, informations remises.",
      "Formaliser chaque issue : accord déposé, ou procès-verbal de désaccord déposé.",
    ],
    acteur: "Direction et délégués syndicaux",
    delai: "Périodicités annuelles ou triennales selon le régime — le module NAO les calcule",
    risque: "Pénalités sur les salaires et sur l'égalité, délit d'entrave : le module NAO mesure cette exposition, contrôle par contrôle.",
    modele: { page: "documents.html", nom: "accord de méthode et PV de désaccord (modèles « accord-methode », « pv-desaccord »)" },
  },
});

item({
  id: "SOC-NEG-EGALITE", categorie: "négociations",
  intitule: "Couverture égalité professionnelle : accord, ou plan d'action unilatéral",
  articles: [],
  articlesSouhaites: [],
  module: { nom: "négociation obligatoire (NAO)", page: "audit-nao.html" },
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    return { du: s.du, motif: s.motif + (s.du
      ? " À partir de cinquante salariés, l'entreprise doit être couverte en matière d'égalité professionnelle — par accord ou, à défaut, par un plan d'action annuel déposé. Le module NAO contrôle cette couverture et l'exposition."
      : " La pénalité de couverture égalité vise les entreprises d'au moins cinquante salariés.") };
  },
  verifs: [
    { cle: "couvertureEnPlace", libelle: "Un accord d'égalité professionnelle ou un plan d'action annuel déposé est-il en vigueur ?", format: "oui / non", regle: "oui",
      motifNC: "Ni accord ni plan d'action égalité déclaré : l'entreprise s'expose à la pénalité sur l'égalité — établissez la couverture, le module NAO mesure l'exposition." },
  ],
  plan: {
    priorite: 2,
    action: "Établir la couverture égalité professionnelle : négocier l'accord ou, à défaut, arrêter et déposer le plan d'action annuel.",
    etapes: [
      "Établir le diagnostic comparé femmes-hommes (données de la BDESE).",
      "Négocier l'accord ; à défaut, arrêter le plan d'action annuel — objectifs de progression, actions chiffrées, coût.",
      "Déposer l'accord ou le plan auprès de l'autorité administrative.",
    ],
    acteur: "Direction, délégués syndicaux, à défaut décision unilatérale après consultation",
    delai: "Couverture continue : toute période non couverte compte",
    risque: "Pénalité financière sur l'égalité professionnelle, assise sur les rémunérations des périodes non couvertes — l'exposition se mesure dans le module NAO.",
    modele: { page: "audit-nao.html", nom: "module NAO — contrôles égalité" },
  },
});

item({
  id: "SOC-NEG-PSE", categorie: "négociations",
  intitule: "Licenciement collectif pour motif économique : procédure et plan de sauvegarde de l'emploi",
  articles: [],
  articlesSouhaites: [],
  module: { nom: "licenciement économique et PSE", page: "audit-pse.html" },
  condition: p => {
    const l = M.ouiNon(p, "projetLicenciementEco", "Un licenciement pour motif économique est-il envisagé ou en cours ?");
    if (!l.connu) return { du: null, motif: l.motif };
    if (!l.vrai) return { du: false, motif: "Aucun projet de licenciement économique déclaré : les obligations de procédure collective n'ont pas d'objet aujourd'hui." };
    return { du: true, motif: "Un licenciement économique est envisagé : la procédure (motif, ordre des licenciements, consultation, et plan de sauvegarde selon les seuils) s'audite dans les modules dédiés — licenciement économique et PSE." };
  },
  verifs: [
    { cle: "proceduresAuditees", libelle: "Le projet a-t-il été passé aux modules d'audit dédiés (motif, procédure, PSE) ?", format: "oui / non", regle: "oui",
      motifNC: "Le projet de licenciement n'a pas été audité : passez-le aux modules dédiés avant toute notification — les vices de procédure se paient après coup." },
  ],
  plan: {
    priorite: 1,
    action: "Auditer le projet de licenciement économique dans les modules dédiés avant toute notification.",
    etapes: [
      "Qualifier le motif dans le module « licenciement économique » (difficultés, mutations, sauvegarde de compétitivité, cessation).",
      "Vérifier les seuils déclenchant le plan de sauvegarde dans le module PSE.",
      "Dérouler la consultation du comité et les notifications aux échéances calculées par les modules.",
    ],
    acteur: "Direction, avec conseil",
    delai: "Avant toute convocation ou notification",
    risque: "Nullité de la procédure, réintégrations et indemnités : l'exposition se mesure dans les modules dédiés.",
    modele: { page: "audit.html", nom: "module d'audit du licenciement économique" },
  },
});

/* ══════════════════════════════════════════ 6. santé-sécurité ══ */

item({
  id: "SOC-SST-SPST", categorie: "santé-sécurité",
  intitule: "Adhésion à un service de prévention et de santé au travail",
  articles: ["L4622-1"].filter(lu),
  articlesSouhaites: ["L4622-1"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "adhesion", libelle: "L'entreprise adhère-t-elle à un service de prévention et de santé au travail (ou dispose-t-elle d'un service autonome) ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune adhésion à un service de prévention et de santé au travail : adhérez sans attendre — sans elle, aucune visite médicale n'est possible et tout le suivi de l'état de santé des salariés est en carence." },
  ],
  plan: {
    priorite: 1,
    action: "Adhérer à un service de prévention et de santé au travail interentreprises.",
    etapes: [
      "Identifier le service compétent pour le secteur géographique et professionnel.",
      "Adhérer, déclarer l'effectif et les risques, planifier les visites en retard.",
    ],
    acteur: "Direction",
    delai: "Immédiat : l'adhésion conditionne toutes les visites médicales",
    risque: "Suivi médical impossible, responsabilité engagée en cas d'accident ou d'inaptitude mal gérée — chaque embauche sans visite aggrave la carence.",
    modele: null,
  },
});

item({
  id: "SOC-SST-VIP", categorie: "santé-sécurité",
  intitule: "Visite d'information et de prévention (et suivi de l'état de santé des salariés)",
  articles: ["R4624-10"].filter(lu),
  articlesSouhaites: ["R4624-10"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "embauchesVues", libelle: "Chaque salarié a-t-il bénéficié de sa visite d'information et de prévention dans le délai suivant la prise de poste ?", format: "oui / non", regle: "oui",
      motifNC: "Des salariés n'ont pas eu leur visite d'information et de prévention : programmez les visites en retard — le délai court à compter de la prise de poste, et certains postes appellent un suivi renforcé ou une visite avant affectation." },
    { cle: "suiviPeriodique", libelle: "Le suivi périodique est-il à jour (périodicité fixée par le médecin du travail) ?", format: "oui / non", regle: "oui",
      motifNC: "Le suivi périodique n'est pas à jour : demandez au service de prévention l'état des visites et reprogrammez les échéances dépassées." },
  ],
  plan: {
    priorite: 2,
    action: "Remettre à jour les visites d'information et de prévention et le suivi périodique.",
    etapes: [
      "Rapprocher le registre du personnel de l'état des visites détenu par le service de prévention.",
      "Programmer les visites manquantes, en commençant par les embauches récentes et les postes à risques (suivi renforcé).",
      "Mettre en place le déclenchement automatique de la visite à chaque embauche.",
    ],
    acteur: "Ressources humaines, avec le service de prévention",
    delai: "Visites en retard : sous quelques semaines",
    risque: "Un salarié non vu par la médecine du travail, puis inapte ou accidenté, se retourne contre l'employeur : le manquement au suivi médical est systématiquement retenu.",
    modele: null,
  },
});

item({
  id: "SOC-SST-FORMATION-SECU", categorie: "santé-sécurité",
  intitule: "Formation pratique et appropriée à la sécurité",
  articles: ["L4141-2"].filter(lu),
  articlesSouhaites: ["L4141-2"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "nouveauxFormes", libelle: "Les nouveaux embauchés, intérimaires et salariés changeant de poste reçoivent-ils une formation à la sécurité ?", format: "oui / non", regle: "oui",
      motifNC: "La formation à la sécurité des nouveaux arrivants n'est pas organisée : mettez-la en place — elle bénéficie aux embauchés, aux intérimaires et à ceux qui changent de poste, et se renouvelle en tant que de besoin." },
    { cle: "tracee", libelle: "Ces formations sont-elles datées et émargées (traçables) ?", format: "oui / non", regle: "oui",
      motifNC: "Les formations existent mais ne sont pas tracées : faites émarger et conservez — une formation non prouvée n'existe pas au contentieux." },
  ],
  plan: {
    priorite: 2,
    action: "Organiser et tracer la formation pratique et appropriée à la sécurité.",
    etapes: [
      "Bâtir le parcours d'accueil sécurité par poste (risques du poste, circulation, conduite en cas d'accident).",
      "Le dérouler à chaque embauche, affectation d'intérimaire et changement de poste ; le renouveler périodiquement.",
      "Dater, faire émarger, conserver.",
    ],
    acteur: "Encadrement / responsable sécurité",
    delai: "Avant chaque prise de poste",
    risque: "En cas d'accident d'un salarié non formé, la faute inexcusable se plaide contre l'employeur — la formation tracée est une pièce de défense de premier rang.",
    modele: null,
  },
});

/* ═══════════════════════════════════ 7. formation et entretiens ══ */

item({
  id: "SOC-FOR-ENTRETIENS", categorie: "formation et entretiens",
  intitule: "Entretiens de parcours professionnel : dans l'année suivant l'embauche, puis tous les quatre ans au plus, et état des lieux tous les huit ans",
  articles: ["L6315-1"].filter(lu),
  articlesSouhaites: ["L6315-1"],
  /* L. 6315-1 dans sa rédaction en vigueur à la date de capture : « entretien
     de parcours professionnel » — premier dans l'année suivant l'embauche,
     puis tous les quatre ans (un accord peut fixer une autre périodicité,
     sans excéder quatre ans) ; état des lieux récapitulatif tous les huit
     ans, le premier pouvant intervenir sept ans après le premier entretien ;
     proposé systématiquement aux retours d'absences longues si aucun
     entretien n'a eu lieu dans les douze mois précédant la reprise. */
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "cycleAJour", libelle: "Chaque salarié a-t-il eu son entretien de parcours professionnel aux échéances — dans l'année suivant l'embauche, puis tous les quatre ans au plus (ou à la périodicité fixée par accord), et aux retours d'absences longues ?", format: "oui / non", regle: "oui",
      motifNC: "Des entretiens de parcours professionnel manquent : rattrapez-les — L. 6315-1 les impose dans l'année suivant l'embauche, puis tous les quatre ans au plus (un accord peut fixer une périodicité différente sans excéder quatre ans), et les propose systématiquement aux retours d'absences longues quand aucun entretien n'a eu lieu dans les douze mois précédant la reprise." },
    { cle: "bilanHuitAns", libelle: "L'état des lieux récapitulatif des huit ans est-il fait pour les salariés concernés (document écrit, copie remise) ?", format: "oui / non", regle: "oui",
      motifNC: "L'état des lieux récapitulatif des huit ans n'est pas établi : L. 6315-1, II, l'impose — et dans les entreprises d'au moins cinquante salariés, un parcours sans les entretiens prévus et sans au moins une formation non obligatoire déclenche l'abondement correctif du compte personnel de formation." },
    { cle: "dateDernierCycle", libelle: "Date de la dernière campagne d'entretiens", format: "AAAA-MM-JJ", regle: "ageMaxMois", mois: 48,
      motifNC: "La dernière campagne d'entretiens date de plus de quatre ans : la périodicité maximale de L. 6315-1 est dépassée — planifiez la campagne de rattrapage." },
  ],
  plan: {
    priorite: 2,
    action: "Remettre à jour les entretiens de parcours professionnel et les états des lieux de huit ans.",
    etapes: [
      "Établir, salarié par salarié, la date du dernier entretien et l'échéance du prochain (année suivant l'embauche, puis quatre ans au plus — vérifier la périodicité qu'un accord aurait fixée).",
      "Conduire la campagne de rattrapage ; formaliser chaque entretien par un document écrit dont copie est remise au salarié — l'entretien ne porte pas sur l'évaluation du travail.",
      "Proposer systématiquement l'entretien aux retours d'absences longues (maternité, parental, proche aidant, arrêt long, mandat syndical…) quand aucun entretien n'a eu lieu dans les douze mois précédant la reprise.",
      "Établir les états des lieux de huit ans et, s'il y a carence dans une entreprise d'au moins cinquante salariés, provisionner l'abondement correctif du compte formation.",
    ],
    acteur: "Ressources humaines et managers",
    delai: "Campagne de rattrapage : un trimestre",
    risque: "À partir de cinquante salariés, la carence sur le cycle de huit ans (entretiens non tenus et aucune formation non obligatoire) déclenche l'abondement correctif du compte personnel de formation (L. 6315-1, II) — et fragilise tout licenciement fondé sur l'insuffisance professionnelle.",
    modele: { page: "documents.html", nom: "modèle à établir (aucune trame d'entretien dans le générateur à ce jour)" },
  },
});

item({
  id: "SOC-FOR-ADAPTATION", categorie: "formation et entretiens",
  intitule: "Adaptation au poste et maintien de la capacité à occuper un emploi (plan de développement des compétences)",
  articles: ["L6321-1"].filter(lu),
  articlesSouhaites: ["L6321-1"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "actionsOrganisees", libelle: "Des actions de formation assurant l'adaptation au poste et le maintien de l'employabilité sont-elles organisées ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune action de formation déclarée : l'obligation d'adapter les salariés à leur poste et de maintenir leur capacité à occuper un emploi pèse sur l'employeur même sans demande des salariés — construisez le plan de développement des compétences." },
  ],
  plan: {
    priorite: 3,
    action: "Construire le plan de développement des compétences : adaptation au poste et maintien de l'employabilité.",
    etapes: [
      "Recenser les besoins (évolutions des métiers et des outils, entretiens professionnels).",
      "Arrêter le plan, consulter le comité s'il existe, dérouler les actions et les tracer.",
    ],
    acteur: "Ressources humaines",
    delai: "Plan annuel",
    risque: "Des salariés jamais formés obtiennent des dommages-intérêts pour manquement à l'obligation de formation, même sans licenciement — la jurisprudence l'admet de longue date ; vérifiez les espèces avec votre conseil.",
    modele: null,
  },
});

/* ═══════════════════════════ 8. épargne et protection sociale ══ */

item({
  id: "SOC-EPA-PARTICIPATION", categorie: "épargne et protection sociale",
  intitule: "Participation des salariés aux résultats de l'entreprise",
  articles: ["L3322-2"].filter(lu),
  articlesSouhaites: ["L3322-2"],
  module: null,
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " La participation n'est obligatoire qu'à partir de cinquante salariés — en deçà, les dispositifs restent possibles à titre volontaire." };
    if (!M.renseigne(p.seuilDepuis12Mois))
      return { du: null, motif: s.motif + " Reste à dater le franchissement : l'obligation de participation s'applique à compter d'un délai suivant le franchissement durable du seuil — dites depuis quand l'effectif s'y maintient." };
    if (M.nie(p.seuilDepuis12Mois))
      return { du: null, motif: "Le seuil de cinquante salariés vient d'être franchi : l'obligation de participation naît après un maintien durable de l'effectif au-dessus du seuil (la loi aménage un différé) — datez le franchissement et faites vérifier l'échéance exacte par votre expert." };
    return { du: true, motif: s.motif + " La participation aux résultats doit être mise en place (accord, régime d'autorité à défaut)" + (lu("L3322-2") ? " — " + jol("L3322-2") + " lu à la source" : "") + ". L'échéance exacte dépend de la durée de maintien au-dessus du seuil : faites-la vérifier." };
  },
  verifs: [
    { cle: "dispositifEnPlace", libelle: "Un accord de participation (ou le régime d'autorité) est-il en place ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun dispositif de participation déclaré alors que le seuil est acquis : négociez l'accord — à défaut d'accord dans les délais, le régime d'autorité s'applique avec ses contraintes." },
    { cle: "depotFait", libelle: "L'accord est-il déposé ?", format: "oui / non", regle: "oui",
      motifNC: "L'accord de participation n'est pas déposé : le dépôt conditionne les exonérations — déposez-le sur la plateforme des accords collectifs." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre en place la participation : calcul de la réserve, accord, dépôt.",
    etapes: [
      "Faire calculer la réserve spéciale de participation sur les exercices concernés.",
      "Négocier l'accord (formule, répartition, gestion) avec le comité ou les syndicats, ou selon les modalités légales.",
      "Déposer l'accord et informer les salariés de leurs droits.",
    ],
    acteur: "Direction, expert-comptable, instances",
    delai: "Échéance liée à la clôture de l'exercice suivant l'assujettissement : faites-la caler par votre expert",
    risque: "À défaut d'accord dans les délais, régime d'autorité (moins favorable à l'employeur) et perte possible d'exonérations — chiffrage à faire établir par votre expert.",
    modele: null,
  },
});

item({
  id: "SOC-EPA-SANTE", categorie: "épargne et protection sociale",
  intitule: "Complémentaire santé collective (couverture minimale, part employeur)",
  articles: [],
  articlesSouhaites: [],
  module: null,
  generique: "Cette obligation relève du code de la sécurité sociale, que le relais de l'application ne sert pas : aucun article n'est cité ni vérifié ici. La généralisation de la couverture santé d'entreprise (panier minimal, financement patronal au moins pour moitié, acte fondateur formalisé) est à vérifier sur les textes en vigueur et votre convention.",
  condition: toutEmployeur,
  verifs: [
    { cle: "contratEnPlace", libelle: "Un contrat collectif santé couvrant tous les salariés (sauf dispenses valables) est-il en place ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune complémentaire santé collective déclarée : mettez-la en place — l'obligation est générale, et la convention collective peut imposer des garanties supérieures." },
    { cle: "acteFondateur", libelle: "L'acte fondateur (accord, référendum ou décision unilatérale écrite) et les dispenses sont-ils formalisés ?", format: "oui / non", regle: "oui",
      motifNC: "Le régime existe mais son acte fondateur ou les dispenses ne sont pas formalisés : régularisez l'écrit — les exonérations sociales en dépendent." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre en place (ou régulariser) la complémentaire santé collective, au regard du code de la sécurité sociale et de la convention de branche.",
    etapes: [
      "Vérifier les exigences de la convention collective (garanties, organismes recommandés) — selon la convention applicable : à vérifier.",
      "Choisir le contrat, formaliser l'acte fondateur, recueillir les dispenses écrites.",
      "Vérifier la part patronale et la conformité du contrat aux exigences des contrats responsables.",
    ],
    acteur: "Direction / ressources humaines, avec l'assureur",
    delai: "Sans attendre : chaque mois sans couverture est un manquement continu",
    risque: "Rappels de cotisations (perte d'exonérations), prise en charge de frais de santé qu'un salarié non couvert aurait dû voir remboursés — textes hors du champ du relais : faites chiffrer par votre conseil.",
    modele: null,
  },
});

item({
  id: "SOC-EPA-PREVOYANCE-CADRES", categorie: "épargne et protection sociale",
  intitule: "Prévoyance des cadres (cotisation patronale dédiée, priorité au risque décès)",
  articles: [],
  articlesSouhaites: [],
  module: null,
  convention: true,
  condition: p => {
    const c = M.ouiNon(p, "cadres", "L'entreprise emploie-t-elle des cadres ?");
    if (!c.connu) return { du: null, motif: c.motif };
    if (!c.vrai) return { du: false, motif: "Aucun cadre déclaré : l'obligation conventionnelle de prévoyance des cadres n'a pas d'objet." };
    return { du: true, motif: "L'entreprise emploie des cadres : la prévoyance des cadres est une obligation d'origine conventionnelle (accord national interprofessionnel et conventions de branche) — selon la convention collective applicable : à vérifier. Le relais de l'application ne sert que le code du travail : rien de précis n'est affirmé ici." };
  },
  verifs: [
    { cle: "contratEnPlace", libelle: "Un contrat de prévoyance couvrant les cadres, avec la cotisation patronale dédiée affectée en priorité au risque décès, est-il en place ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune prévoyance cadres déclarée : c'est le manquement le plus coûteux du domaine — en cas de décès d'un cadre non couvert, l'employeur doit un capital aux ayants droit. Vérifiez la convention et couvrez le risque sans délai." },
  ],
  plan: {
    priorite: 1,
    action: "Souscrire (ou vérifier) la prévoyance des cadres, selon la convention collective applicable.",
    etapes: [
      "Vérifier les stipulations de la convention de branche (assiette, taux, risques couverts) — à vérifier sur le texte conventionnel, non servi par le relais.",
      "Souscrire le contrat, affecter la cotisation patronale en priorité au risque décès.",
      "Vérifier rétroactivement qu'aucune période n'est découverte.",
    ],
    acteur: "Direction, avec l'assureur et le conseil",
    delai: "Sans délai : le risque décès ne se rattrape pas",
    risque: "En cas de décès d'un cadre non couvert, un capital de l'ordre de trois plafonds annuels de sécurité sociale est dû aux ayants droit selon les textes conventionnels — à vérifier : rien n'est affirmé ici sur un texte non lu.",
    modele: null,
  },
});

item({
  id: "SOC-CCN-OBLIGATIONS", categorie: "épargne et protection sociale",
  intitule: "Autres obligations de la convention collective (minima, primes, prévoyance non-cadres, jours conventionnels…)",
  articles: [],
  articlesSouhaites: [],
  module: null,
  convention: true,
  condition: p => {
    if (!M.renseigne(p.conventionCollective))
      return { du: null, motif: "La convention collective n'est pas renseignée : impossible de dire quelles obligations conventionnelles s'ajoutent aux obligations légales" + (M.renseigne(p.secteur) ? ` (secteur déclaré : ${String(p.secteur).trim()})` : "") + ". Identifiez-la d'abord." };
    return { du: true, motif: `La convention « ${String(p.conventionCollective).trim()} » ajoute ses propres obligations : salaires minima, primes, prévoyance, classification, jours conventionnels… Selon la convention collective applicable : à vérifier — le relais de l'application ne sert que le code du travail, rien de précis n'est affirmé ici.` };
  },
  verifs: [
    { cle: "verificationFaite", libelle: "Une vérification de conformité aux obligations de la branche (minima, primes, prévoyance…) a-t-elle été faite récemment ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune vérification de conformité conventionnelle déclarée : faites passer en revue minima, primes, classification et prévoyance de branche — un rappel de prime conventionnelle se prescrit en années, pas en mois." },
    { cle: "dateVerification", libelle: "Date de la dernière vérification", format: "AAAA-MM-JJ", regle: "ageMaxMois", mois: 24,
      motifNC: "La dernière vérification conventionnelle date de plus de deux ans : les avenants de branche tombent chaque année — refaites la revue." },
  ],
  plan: {
    priorite: 3,
    action: "Passer l'entreprise en revue de conformité conventionnelle, sur le texte de la convention.",
    etapes: [
      "Se procurer le texte à jour de la convention et de ses avenants (Légifrance, éditions de branche).",
      "Confronter salaires réels et minima, primes versées et primes dues, classification appliquée et grille.",
      "Corriger les écarts et documenter la revue.",
    ],
    acteur: "Ressources humaines / paie, avec le conseil",
    delai: "Revue annuelle recommandée",
    risque: "Rappels de salaires et de primes sur la période non prescrite — selon la convention applicable : à vérifier, rien n'est affirmé ici sur des textes non lus.",
    modele: null,
  },
});

/* ─── la garde finale : aucun item ne cite un article non lu ─── */
for (const it of REF) {
  for (const n of it.articles) art(n);
  if (!CATEGORIES.includes(it.categorie))
    throw new Error(`référentiel social : catégorie inconnue « ${it.categorie} » (${it.id})`);
  it.fondement = it.module && !it.articles.length
    ? `audit détaillé dans le module « ${it.module.nom} » (${it.module.page})` + (it.articlesSouhaites.length ? " — " + fondement(it.articlesSouhaites) : "")
    : it.convention ? "selon la convention collective applicable : à vérifier — le relais ne sert que le code du travail"
    : it.generique ? it.generique
    : fondement(it.articlesSouhaites);
}

const parCategorie = () => {
  const o = {};
  for (const c of CATEGORIES) o[c] = REF.filter(x => x.categorie === c);
  return o;
};

module.exports = { REF, CATEGORIES, TEXTES, lu, jol, fondement, parCategorie };

if (require.main === module) {
  const pc = parCategorie();
  for (const c of CATEGORIES) console.log(`${c} : ${pc[c].length} obligation(s)`);
  const cites = new Set(REF.flatMap(x => x.articles));
  console.log(`${REF.length} obligations · ${cites.size} articles cités, tous lus à la source`);
}

});

__def("./moteur-social.js", function(module, exports, require){
/* Le socle de l'audit social : lire le profil de l'entreprise, et dire pour
   chaque seuil s'il est atteint, non atteint, ou impossible à apprécier.

   TROIS RÈGLES DE MÉTHODE, les mêmes que partout dans le dépôt :

   1. Une donnée absente ne conclut jamais. Un effectif non renseigné ne rend
      aucune obligation « sans objet » — il rend l'assujettissement
      indéterminé, et le référentiel le dit.

   2. Les seuils d'effectif ne se lisent pas seuls : plusieurs obligations
      naissent d'un effectif atteint PENDANT DOUZE MOIS CONSÉCUTIFS. Le profil
      le demande, et un seuil franchi hier n'est pas un seuil acquis.

   3. Le moteur ne prononce rien : il rend l'assujettissement et ses motifs.
      Les contrôles prononcent, dans controles-social.js.                    */

const nombre = x => (typeof x === "number" && isFinite(x) ? x
  : (typeof x === "string" && x.trim() !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && String(x).trim() !== "";

/* Le seuil d'effectif brut : atteint, pas atteint, ou inconnu. */
function seuil(p, n) {
  const eff = nombre(p.effectif);
  if (eff === null) return { connu: false, atteint: null,
    motif: `L'effectif n'est pas renseigné : le seuil de ${n} salarié(s) ne peut pas être apprécié.` };
  return { connu: true, atteint: eff >= n,
    motif: eff >= n ? `Effectif de ${eff} salariés : le seuil de ${n} est atteint.`
      : `Effectif de ${eff} salariés : le seuil de ${n} n'est pas atteint.` };
}

/* Le seuil durci par la durée : atteint depuis au moins douze mois consécutifs.
   C'est la condition que portent notamment la mise en place du comité et le
   règlement intérieur — un seuil franchi le mois dernier n'y suffit pas. */
function seuilDouzeMois(p, n) {
  const s = seuil(p, n);
  if (!s.connu) return { connu: false, atteint: null, motif: s.motif };
  if (!s.atteint) return s;
  if (!renseigne(p.seuilDepuis12Mois))
    return { connu: false, atteint: null,
      motif: `Effectif de ${nombre(p.effectif)} salariés, mais il n'est pas dit si ce niveau est atteint depuis au moins douze mois consécutifs : l'assujettissement ne peut pas être conclu.` };
  if (nie(p.seuilDepuis12Mois))
    return { connu: true, atteint: false,
      motif: `Le seuil de ${n} salariés est franchi, mais pas depuis douze mois consécutifs : l'obligation n'est pas encore née — elle le sera si l'effectif se maintient. À suivre.` };
  return { connu: true, atteint: true,
    motif: `Effectif de ${nombre(p.effectif)} salariés atteint depuis au moins douze mois consécutifs : le seuil de ${n} est acquis.` };
}

/* Une réponse oui/non du profil, sans jamais deviner. */
function ouiNon(p, cle, question) {
  const v = p[cle];
  if (!renseigne(v)) return { connu: false, vrai: null, motif: `${question} — la réponse n'est pas renseignée : rien ne se conclut.` };
  return { connu: true, vrai: dit(v), motif: null };
}

module.exports = { nombre, dit, nie, renseigne, seuil, seuilDouzeMois, ouiNon };

});

__def("./controles-social.js", function(module, exports, require){
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
      du: a.du, motif: a.motif, verifs: it.verifs || [] };
  });
}

module.exports = { ETATS, verdicts, verdictItem, applicables, peutNC, peutCONF };

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

__def("./plan-social.js", function(module, exports, require){
/* L'étage 3 de l'audit social : le plan d'action.

   Pour chaque obligation applicable non cochée ou en défaut, une action
   précise : les étapes concrètes, qui, sous quel délai indicatif, et le
   risque encouru — formulé prudemment quand l'article de sanction n'a pas été
   lu à la source, ce que le référentiel dit item par item. Le tout consolidé
   en un planning trié : d'abord ce qui expose le plus (sécurité des
   personnes, entrave, pénalités), puis les délais courts, puis le reste.

   Les modèles : quand le générateur de documents de l'application porte une
   trame utile (documents.html), le plan la nomme ; sinon il écrit « modèle à
   établir » — jamais un lien vers ce qui n'existe pas.                      */
const R = require("./referentiel-social.js");
const C = require("./controles-social.js");
const { MODELES } = require("./modeles-social.js");

const NIVEAUX = {
  1: "priorité 1 — exposition forte (sécurité des personnes, entrave, absence d'institution ou de couverture)",
  2: "priorité 2 — pénalités financières et manquements qui se constatent en contrôle",
  3: "priorité 3 — régularisations rapides et mises à niveau",
};

/* Le plan : les items en défaut (non conformes) et à vérifier (risque),
   chacun avec son action complète. Les « donnée manquante » ne sont pas des
   actions : ce sont des réponses à compléter — ils sont rendus à part. */
function plan(p, dossier) {
  const v = C.verdicts(p, dossier);
  const actions = [], aVerifier = [], aCompleter = [];
  for (const it of R.REF) {
    const x = v[it.id];
    if (!x || x.assujetti !== true) continue;
    const base = {
      id: it.id, categorie: it.categorie, intitule: it.intitule,
      etat: x.etat, constat: x.motif, fondement: it.fondement,
      priorite: it.plan.priorite, niveau: NIVEAUX[it.plan.priorite],
      action: it.plan.action, etapes: it.plan.etapes, acteur: it.plan.acteur,
      delai: it.plan.delai, risque: it.plan.risque,
      modele: it.plan.modele || { page: null, nom: "modèle à établir" },
      /* Le modèle ADAPTÉ : une trame pré-remplie avec les données du
         questionnaire — jamais une trame générique quand on peut mieux. */
      modeleAdapte: MODELES[it.id] ? MODELES[it.id](p) : null,
      module: it.module || null,
    };
    if (x.etat === "non conforme") actions.push(base);
    else if (x.etat === "risque à vérifier") aVerifier.push(base);
    else if (x.etat === "donnée manquante") aCompleter.push({ id: it.id, intitule: it.intitule, motif: x.motif });
  }
  const ordre = x => [x.priorite, R.CATEGORIES.indexOf(x.categorie)];
  const tri = (a, b) => { const oa = ordre(a), ob = ordre(b);
    return oa[0] - ob[0] || oa[1] - ob[1] || a.id.localeCompare(b.id); };
  actions.sort(tri); aVerifier.sort(tri);
  return {
    entreprise: p.entreprise || "",
    dateAudit: p.dateAudit || "",
    actions, aVerifier, aCompleter,
    compteurs: { actions: actions.length, aVerifier: aVerifier.length, aCompleter: aCompleter.length },
  };
}

module.exports = { plan, NIVEAUX };

});

__def("./modeles-social.js", function(module, exports, require){
/* Les modèles adaptés du plan d'action — étage 3.

   Pour chaque obligation en défaut, le plan ne renvoie pas à une trame
   générique : il produit un document de départ PRÉ-REMPLI avec les données du
   questionnaire — dénomination, effectif, secteur, convention, seuils — que
   le client imprime, copie et adapte. Un champ que le questionnaire ne
   connaît pas reste un blanc apparent « ______ » : le modèle ne devine rien.

   Ces modèles sont des trames de travail, pas des actes finis : chacun le dit
   en tête. Aucune phrase n'y affirme un texte non lu — les items dont la
   source n'a pas été confirmée au relais gardent des formulations prudentes,
   comme dans le référentiel.                                                */

const B = "______";
const q = v => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v).trim() : B);
const eff = p => (p.effectif !== undefined && p.effectif !== null && String(p.effectif).trim() !== "" ? String(p.effectif).trim() : B);

const h = x => ({ t: "h", x });
const par = x => ({ t: "p", x });
const puce = x => ({ t: "puce", x });
const champ = x => ({ t: "champ", x });

const entete = (p, objet) => [
  par(`${q(p.entreprise)} — effectif déclaré : ${eff(p)} salarié(s)` +
    (q(p.secteur) !== B ? ` — secteur : ${q(p.secteur)}` : "") +
    (q(p.conventionCollective) !== B ? ` — convention : ${q(p.conventionCollective)}` : "")),
  par(`Objet : ${objet}. Établi le ${q(p.dateAudit)}. Trame de travail pré-remplie par l'audit social — à adapter et à faire relire avant usage.`),
];

const MODELES = {

  "SOC-INS-CSE": p => ({
    titre: "Note de lancement du processus électoral (CSE)",
    lignes: [...entete(p, "organisation des élections du comité social et économique"),
      h("1. Constat"),
      par(`L'effectif de ${q(p.entreprise)} (${eff(p)} salariés) atteint le seuil de mise en place du comité social et économique depuis au moins douze mois consécutifs, à la date du ${q(p.dateAudit)}.`),
      h("2. Calendrier à arrêter"),
      puce(`Information du personnel de l'organisation des élections : le ${B}`),
      puce(`Invitation des organisations syndicales à négocier le protocole d'accord préélectoral : le ${B}`),
      puce(`Premier tour : le ${B} — second tour éventuel : le ${B}`),
      h("3. Responsable"),
      champ(`Pilote du processus : ${B} (direction / ressources humaines)`),
      par("En cas d'absence de candidature aux deux tours : établir le procès-verbal de carence et le transmettre. Puis dérouler l'audit complet dans le module « comité social et économique » de l'application.")],
  }),

  "SOC-INS-CSE-ETAB": p => ({
    titre: "Trame d'accord sur les établissements distincts",
    lignes: [...entete(p, "détermination du nombre et du périmètre des établissements distincts"),
      h("Article 1 — Nombre et périmètre"),
      par(`Les parties conviennent que ${q(p.entreprise)} comporte ${B} établissements distincts : ${B}.`),
      h("Article 2 — Représentation"),
      par(`Un comité social et économique est élu dans chacun d'eux ; un comité social et économique central est constitué au niveau de l'entreprise.`),
      h("Article 3 — Dépôt"),
      par("Le présent accord est déposé dans les conditions légales. L'audit détaillé de l'architecture se fait dans le module « comité social et économique ».")],
  }),

  "SOC-INS-CSSCT": p => ({
    titre: "Trame de délibération : création de la CSSCT",
    lignes: [...entete(p, "création de la commission santé, sécurité et conditions de travail"),
      par(`L'effectif de ${eff(p)} salariés impose la création d'une commission santé, sécurité et conditions de travail au sein du comité.`),
      puce(`Nombre de membres : ${B} (dont au moins un représentant du second collège)`),
      puce(`Missions déléguées par le comité : ${B}`),
      puce(`Moyens (heures, formation, réunions par an) : ${B}`),
      par("À fixer par accord d'entreprise ; à défaut, par le règlement intérieur du comité. Audit détaillé dans le module « comité social et économique ».")],
  }),

  "SOC-INS-COMMISSIONS": p => ({
    titre: "Aide-mémoire : commissions du comité à constituer",
    lignes: [...entete(p, "constitution des commissions du comité social et économique"),
      puce(`Commission de la formation : président ${B}, membres ${B}`),
      puce(`Commission d'information et d'aide au logement : ${B}`),
      puce(`Commission de l'égalité professionnelle : ${B}`),
      par("La liste exacte des commissions dues à l'effectif, et ce qu'un accord peut aménager, se vérifient dans le module « comité social et économique ».")],
  }),

  "SOC-INS-GROUPE": p => ({
    titre: "Courrier à l'entreprise dominante : constitution du comité de groupe",
    lignes: [...entete(p, "constitution du comité de groupe"),
      par(`À l'attention de la direction de ${B} (entreprise dominante).`),
      par(`${q(p.entreprise)} appartient au périmètre du groupe. Aucun comité de groupe n'est à notre connaissance constitué. Nous vous saisissons de la constitution de cette instance, ou de la confirmation motivée que le périmètre n'y entre pas.`),
      champ(`Signataire : ${B} — date : ${q(p.dateAudit)}`)],
  }),

  "SOC-INS-REF-HARCELEMENT": p => ({
    titre: "Note de désignation du référent harcèlement sexuel",
    lignes: [...entete(p, "désignation du référent chargé de la lutte contre le harcèlement sexuel et les agissements sexistes"),
      par(`L'effectif de ${q(p.entreprise)} (${eff(p)} salariés) atteint deux cent cinquante salariés : un référent est désigné.`),
      champ(`Référent désigné : ${B} — fonction : ${B} — coordonnées : ${B}`),
      par("Ses coordonnées sont diffusées à l'ensemble du personnel avec l'information sur le harcèlement (affichage, intranet, livret d'accueil). Le comité social et économique désigne par ailleurs son propre référent parmi ses membres.")],
  }),

  "SOC-DOC-RI": p => ({
    titre: "Squelette de règlement intérieur",
    lignes: [...entete(p, "établissement du règlement intérieur"),
      h("I. Santé et sécurité"),
      puce(`Consignes générales et particulières de sécurité applicables dans les locaux de ${q(p.entreprise)} : ${B}`),
      h("II. Discipline"),
      puce(`Échelle des sanctions : ${B}`),
      puce("Garanties de procédure et droits de la défense des salariés"),
      h("III. Rappels obligatoires"),
      puce("Dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes"),
      puce("Dispositions relatives à la protection des lanceurs d'alerte"),
      h("Formalités"),
      puce(`Avis du comité social et économique recueilli le ${B}`),
      puce(`Transmission à l'inspection du travail le ${B} — dépôt au greffe du conseil de prud'hommes le ${B}`),
      puce(`Publicité auprès des salariés le ${B} — entrée en vigueur : un mois après l'accomplissement des formalités`)],
  }),

  "SOC-DOC-DUERP": p => ({
    titre: "Structure type du document unique (DUERP)",
    lignes: [...entete(p, "établissement du document unique d'évaluation des risques professionnels"),
      h("1. Unités de travail"),
      par(`Découpage proposé pour un effectif de ${eff(p)} salarié(s)` + (q(p.secteur) !== B ? ` dans le secteur ${q(p.secteur)}` : "") + ` : ${B} (par site, atelier, service ou métier).`),
      h("2. Pour chaque unité"),
      puce(`Risques identifiés : ${B}`),
      puce(`Gravité / fréquence d'exposition : ${B}`),
      puce(`Mesures de prévention existantes : ${B}`),
      puce(`Actions à engager, responsable, échéance : ${B}`),
      h("3. Vie du document"),
      puce(`Date d'établissement : ${q(p.dateAudit)} — prochaine mise à jour : au plus tard un an après (à partir de onze salariés), et à chaque aménagement important`),
      puce(`Modalités d'accès portées à la connaissance des salariés, du comité et du service de prévention : ${B}`)],
  }),

  "SOC-DOC-BDESE": p => ({
    titre: "Ossature de la BDESE à constituer",
    lignes: [...entete(p, "constitution de la base de données économiques, sociales et environnementales"),
      par(`Support retenu : ${B} — droits d'accès des élus : ${B}`),
      par(`La liste exacte des rubriques dues à ${q(p.entreprise)} (effectif ${eff(p)}, régime avec ou sans accord) se génère dans le module « base de données (BDESE) » de l'application : ouvrez-le pour l'ossature complète, puis datez la mise à disposition.`)],
  }),

  "SOC-DOC-INDEX": p => ({
    titre: "Feuille de route : index de l'égalité professionnelle",
    lignes: [...entete(p, "calcul et publication de l'index de l'égalité professionnelle"),
      puce(`Période de référence retenue : ${B}`),
      puce(`Collecte des rémunérations par sexe, âge, catégorie : responsable ${B}`),
      puce(`Calcul des indicateurs et de la note globale : ${B} / 100`),
      puce(`Publication sur le site de l'entreprise et télédéclaration : le ${B}`),
      par("Si la note est sous les seuils réglementaires : définir mesures de correction et objectifs de progression. L'exposition à la pénalité se mesure dans le module NAO.")],
  }),

  "SOC-DOC-OETH": p => ({
    titre: "Check-list : obligation d'emploi des travailleurs handicapés",
    lignes: [...entete(p, "régularisation de l'obligation d'emploi des travailleurs handicapés"),
      puce(`Effectif d'assujettissement : ${eff(p)} salariés — bénéficiaires à employer : ${B} (proportion légale de l'effectif)`),
      puce(`Bénéficiaires présents dans l'effectif : ${B}`),
      puce(`Déclaration annuelle via la DSN : faite le ${B}`),
      puce(`Couverture de l'écart : recrutements ${B} · contribution ${B} · accord agréé ${B}`),
      par("Chiffrage de la contribution : à faire établir par l'expert paie — les textes de calcul n'ont pas été vérifiés par cette application.")],
  }),

  "SOC-AFF-HARCELEMENT": p => ({
    titre: "Affiche : information sur les harcèlements moral et sexuel",
    lignes: [...entete(p, "information obligatoire des salariés et des candidats"),
      h("Harcèlement moral — harcèlement sexuel et agissements sexistes"),
      par(`Dans l'entreprise ${q(p.entreprise)}, aucun salarié ne doit subir de tels agissements. Texte des articles applicables du code du travail et du code pénal : [reproduire les textes en vigueur].`),
      h("À qui s'adresser"),
      puce(`Référent harcèlement de l'entreprise (si l'effectif l'impose) : ${B}`),
      puce(`Référent du comité social et économique : ${B}`),
      puce(`Médecin du travail : ${B} — Inspection du travail : ${B}`),
      puce(`Défenseur des droits : ${B}`),
      par("Afficher ou diffuser par tout moyen dans les lieux de travail — et, pour le harcèlement sexuel, dans les lieux d'embauche. Dater la mise en place.")],
  }),

  "SOC-AFF-EGALITE": p => ({
    titre: "Affiche : interdiction des discriminations",
    lignes: [...entete(p, "information sur l'interdiction des discriminations (lieux de travail et locaux d'embauche)"),
      par("Texte à reproduire : articles 225-1 à 225-4 du code pénal, dans leur rédaction en vigueur (interdiction et sanction des discriminations)."),
      par(`Porté à la connaissance des personnes, par tout moyen, dans les lieux de travail et les locaux — ou à la porte des locaux — où se fait l'embauche de ${q(p.entreprise)}, le ${B} — responsable : ${B}.`)],
  }),

  "SOC-AFF-COORDONNEES": p => ({
    titre: "Affiche : coordonnées utiles (inspection, médecine du travail, secours)",
    lignes: [...entete(p, "affichage des coordonnées obligatoires"),
      puce(`Inspection du travail compétente : ${B} — nom de l'inspecteur : ${B} — téléphone : ${B}`),
      puce(`Médecin du travail / service de prévention et de santé au travail : ${B}`),
      puce(`Secours d'urgence : SAMU 15 · Pompiers 18 · Numéro d'urgence européen 112`),
      par(`Affiché dans les locaux normalement accessibles aux salariés de ${q(p.entreprise)}, le ${B}.`)],
  }),

  "SOC-AFF-CONSIGNE-INCENDIE": p => ({
    titre: "Consigne de sécurité incendie (trame)",
    lignes: [...entete(p, "établissement et affichage de la consigne de sécurité incendie"),
      puce(`Matériel d'extinction et de secours — emplacement : ${B}`),
      puce(`Personnes chargées de diriger l'évacuation : ${B}`),
      puce(`Point de rassemblement : ${B}`),
      puce(`Appel des secours : 18 ou 112 — personne chargée de l'appel : ${B}`),
      puce(`Essais et exercices : périodicité ${B} — consignés au registre de sécurité`),
      par("À afficher de manière très apparente dans chaque local concerné.")],
  }),

  "SOC-AFF-HORAIRES": p => ({
    titre: "Affiche : horaire collectif de travail",
    lignes: [...entete(p, "affichage de l'horaire collectif"),
      puce(`Du lundi au vendredi : de ${B} à ${B} et de ${B} à ${B}`),
      puce(`Repos hebdomadaire : ${B}`),
      par(`Horaire applicable au personnel de ${q(p.entreprise)} soumis à l'horaire collectif. Salariés hors horaire collectif : décompte individuel organisé par ${B}.`),
      champ(`Daté et signé : le ${B}, par ${B}`)],
  }),

  "SOC-AFF-CONVENTION": p => ({
    titre: "Avis : convention collective applicable",
    lignes: [...entete(p, "information des salariés sur les textes conventionnels"),
      par(`La convention collective applicable au personnel de ${q(p.entreprise)} est : ${q(p.conventionCollective)}.`),
      par(`Un exemplaire à jour est tenu à la disposition du personnel : ${B} (lieu ou adresse intranet).`),
      par(`La convention est également mentionnée sur le bulletin de paie. Avis communiqué le ${B}.`)],
  }),

  "SOC-AFF-FUMER": p => ({
    titre: "Signalisation : interdiction de fumer et de vapoter",
    lignes: [...entete(p, "signalisation dans les locaux"),
      par("Il est interdit de fumer dans les lieux de travail fermés et couverts. L'interdiction de vapoter s'applique dans les locaux concernés."),
      par("Vérifier les textes en vigueur du code de la santé publique (hors du champ du relais de cette application) et apposer la signalisation apparente à l'entrée des locaux."),
      champ(`Mise en place le ${B} — responsable : ${B}`)],
  }),

  "SOC-REG-PERSONNEL": p => ({
    titre: "Registre unique du personnel : colonnes à tenir",
    lignes: [...entete(p, "tenue du registre unique du personnel, par établissement"),
      puce("Nom, prénoms — nationalité — date de naissance — sexe"),
      puce("Emploi — qualification — dates d'entrée et de sortie"),
      puce("Nature du contrat (CDI, CDD, temps partiel, apprentissage, mise à disposition, stagiaire en annexe…)"),
      puce("Pour les salariés étrangers : type et numéro du titre valant autorisation de travail"),
      par(`Tenu dans l'ordre des embauches, à jour, à disposition de l'inspection du travail et des élus. Support retenu par ${q(p.entreprise)} : ${B}.`)],
  }),

  "SOC-REG-SECURITE": p => ({
    titre: "Sommaire du registre de sécurité",
    lignes: [...entete(p, "rassemblement des vérifications et contrôles santé-sécurité"),
      puce(`Installations électriques — dernière vérification : ${B}`),
      puce(`Moyens d'extinction et alarme — dernière vérification : ${B}`),
      puce(`Équipements de travail (levage, machines…) : ${B}`),
      puce(`Aération, aménagements : ${B}`),
      par("Conserver attestations, consignes, résultats et rapports ; programmer les vérifications manquantes avec des organismes agréés.")],
  }),

  "SOC-REG-DGI": p => ({
    titre: "Page de garde : registre des alertes danger grave et imminent",
    lignes: [...entete(p, "ouverture du registre spécial des alertes"),
      par(`Registre spécial des alertes en cas de danger grave et imminent — ${q(p.entreprise)}. Ouvert le ${B}, pages numérotées.`),
      par(`Chaque avis est daté, signé, et indique : les postes de travail concernés, la nature du danger et sa cause, le nom des travailleurs exposés.`),
      champ(`Lieu de consultation : ${B} — porté à la connaissance des membres du comité le ${B}`)],
  }),

  "SOC-NEG-NAO": p => ({
    titre: "Feuille de route : remise au calendrier des négociations obligatoires",
    lignes: [...entete(p, "engagement des négociations obligatoires"),
      puce(`Diagnostic dans le module NAO de l'application : régime (accord de méthode ou supplétif), thèmes dus, retards — fait le ${B}`),
      puce(`Convocation de la première réunion : le ${B} — lieu et calendrier des réunions fixés en séance`),
      puce(`Informations remises aux négociateurs : ${B} — date de remise : ${B}`),
      par("Une trame d'accord de méthode et de procès-verbal de désaccord existe dans le générateur de documents de l'application (documents.html)."),
      par(`Négociateurs pour ${q(p.entreprise)} : direction ${B} — délégués syndicaux ${B}`)],
  }),

  "SOC-NEG-EGALITE": p => ({
    titre: "Squelette de plan d'action égalité professionnelle",
    lignes: [...entete(p, "couverture égalité professionnelle (à défaut d'accord)"),
      puce(`Diagnostic comparé femmes-hommes (données BDESE) : ${B}`),
      puce(`Objectifs de progression pour l'année : ${B}`),
      puce(`Actions qualitatives et quantitatives : ${B}`),
      puce(`Coût évalué des actions : ${B}`),
      puce(`Dépôt auprès de l'autorité administrative : le ${B}`),
      par("Un accord négocié prime le plan unilatéral : la voie négociée s'audite dans le module NAO.")],
  }),

  "SOC-NEG-PSE": p => ({
    titre: "Avant tout licenciement économique : ordre de passage des modules",
    lignes: [...entete(p, "sécurisation d'un projet de licenciement économique"),
      puce("1. Qualifier le motif dans le module « licenciement économique » (audit.html)"),
      puce("2. Vérifier les seuils et le calibrage du plan dans le module « plan de sauvegarde » (audit-pse.html)"),
      puce("3. Dérouler la consultation du comité aux échéances calculées"),
      par(`Aucune convocation ni notification pour ${q(p.entreprise)} avant la fin de ces audits.`)],
  }),

  "SOC-SST-SPST": p => ({
    titre: "Courrier d'adhésion au service de prévention et de santé au travail",
    lignes: [...entete(p, "adhésion à un service de prévention et de santé au travail"),
      par(`À l'attention du service : ${B}.`),
      par(`${q(p.entreprise)} (${eff(p)} salarié(s)` + (q(p.secteur) !== B ? `, secteur ${q(p.secteur)}` : "") + `) sollicite son adhésion. Vous trouverez la liste du personnel et des postes en annexe ; nous vous demandons la programmation des visites d'information et de prévention en attente.`),
      champ(`Signataire : ${B} — date : ${q(p.dateAudit)}`)],
  }),

  "SOC-SST-VIP": p => ({
    titre: "Demande de programmation des visites en retard",
    lignes: [...entete(p, "mise à jour du suivi médical des salariés"),
      par(`Au service de prévention et de santé au travail de ${q(p.entreprise)} : merci de nous communiquer l'état des visites (information et prévention, suivi renforcé, périodiques) et de programmer les visites en retard listées ci-dessous.`),
      puce(`Salarié ${B} — poste ${B} — embauché le ${B} — visite due : ${B}`),
      puce(`Salarié ${B} — poste ${B} — embauché le ${B} — visite due : ${B}`),
      par("Mettre en place le déclenchement automatique de la demande de visite à chaque embauche.")],
  }),

  "SOC-SST-FORMATION-SECU": p => ({
    titre: "Fiche d'accueil sécurité au poste (trame)",
    lignes: [...entete(p, "formation pratique et appropriée à la sécurité"),
      puce(`Salarié : ${B} — poste : ${B} — date : ${B}`),
      puce(`Risques du poste présentés : ${B}`),
      puce("Circulation dans l'établissement, consignes d'évacuation, conduite en cas d'accident"),
      puce(`Formateur : ${B} — émargement du salarié : ${B}`),
      par("À dérouler à chaque embauche, affectation d'intérimaire et changement de poste ; à conserver.")],
  }),

  "SOC-FOR-ENTRETIENS": p => ({
    titre: "Trame d'entretien de parcours professionnel",
    lignes: [...entete(p, "entretien de parcours professionnel (année suivant l'embauche, puis tous les quatre ans au plus, et retours d'absence)"),
      puce(`Salarié : ${B} — date : ${B} — précédent entretien : ${B}`),
      puce(`Compétences et qualifications mobilisées dans l'emploi actuel, et leur évolution possible : ${B}`),
      puce(`Situation et parcours au regard des évolutions des métiers et des perspectives d'emploi : ${B}`),
      puce(`Besoins de formation (activité actuelle, évolution de l'emploi, projet personnel) : ${B}`),
      puce(`Souhaits d'évolution professionnelle (reconversion, transition, bilan de compétences, validation des acquis) : ${B}`),
      puce("Compte personnel de formation : activation, abondements possibles, conseil en évolution professionnelle"),
      par(`L'entretien ne porte pas sur l'évaluation du travail. Document écrit, copie remise au salarié. Tous les huit ans : état des lieux récapitulatif du parcours — dans les entreprises d'au moins cinquante salariés (${q(p.entreprise)} : effectif ${eff(p)}), une carence déclenche l'abondement correctif du compte formation.`)],
  }),

  "SOC-FOR-ADAPTATION": p => ({
    titre: "Squelette de plan de développement des compétences",
    lignes: [...entete(p, "adaptation au poste et maintien de l'employabilité"),
      puce(`Évolutions des métiers et outils identifiées` + (q(p.secteur) !== B ? ` (secteur ${q(p.secteur)})` : "") + ` : ${B}`),
      puce(`Besoins remontés des entretiens professionnels : ${B}`),
      puce(`Actions retenues, bénéficiaires, calendrier, budget : ${B}`),
      par("Consulter le comité s'il existe ; tracer les actions réalisées.")],
  }),

  "SOC-EPA-PARTICIPATION": p => ({
    titre: "Lettre de cadrage : mise en place de la participation",
    lignes: [...entete(p, "mise en place de la participation aux résultats"),
      par(`L'effectif de ${q(p.entreprise)} (${eff(p)} salariés) assujettit l'entreprise à la participation, à l'échéance que l'expert déterminera selon la durée de maintien au-dessus du seuil.`),
      puce(`Calcul de la réserve spéciale par l'expert-comptable : exercices ${B}`),
      puce(`Négociation de l'accord (formule, répartition, gestion) avec : ${B}`),
      puce(`Dépôt de l'accord : le ${B} — information des salariés : le ${B}`)],
  }),

  "SOC-EPA-SANTE": p => ({
    titre: "Trame de décision unilatérale : complémentaire santé collective",
    lignes: [...entete(p, "mise en place de la couverture santé d'entreprise"),
      par(`La direction de ${q(p.entreprise)} institue un régime collectif et obligatoire de remboursement de frais de santé au profit de l'ensemble du personnel, sous réserve des dispenses légales formalisées par écrit.`),
      puce(`Organisme assureur : ${B} — contrat responsable : ${B}`),
      puce(`Part patronale : ${B} % (au moins la moitié — à vérifier sur les textes du code de la sécurité sociale et la convention de branche, hors du champ du relais)`),
      puce(`Date d'effet : ${B} — remise d'une notice à chaque salarié : ${B}`)],
  }),

  "SOC-EPA-PREVOYANCE-CADRES": p => ({
    titre: "Check-list : prévoyance des cadres",
    lignes: [...entete(p, "couverture de prévoyance des cadres — obligation d'origine conventionnelle"),
      puce(`Population cadre de ${q(p.entreprise)} identifiée : ${B} salarié(s)`),
      puce(`Stipulations de la convention de branche vérifiées (assiette, taux, risques) : ${B} — selon la convention applicable : à vérifier`),
      puce(`Contrat souscrit auprès de : ${B} — cotisation patronale affectée en priorité au risque décès : ${B}`),
      puce(`Périodes passées vérifiées (aucune période découverte) : ${B}`),
      par("Le risque décès ne se rattrape pas : traiter sans délai.")],
  }),

  "SOC-CCN-OBLIGATIONS": p => ({
    titre: "Check-list de revue conventionnelle",
    lignes: [...entete(p, "revue de conformité à la convention collective"),
      par(`Convention déclarée : ${q(p.conventionCollective)} — texte à jour et avenants à se procurer (Légifrance, éditions de branche).`),
      puce(`Salaires réels confrontés aux minima : ${B}`),
      puce(`Primes conventionnelles (ancienneté, vacances…) versées : ${B}`),
      puce(`Classification appliquée conforme à la grille : ${B}`),
      puce(`Prévoyance et garanties de branche : ${B}`),
      par("Rien de précis n'est affirmé ici sur le contenu de la convention : le relais de l'application ne sert que le code du travail — la revue se fait sur le texte conventionnel.")],
  }),
};

module.exports = { MODELES };

});

__def("./questionnaire-social.js", function(module, exports, require){
/* Le questionnaire d'orientation de l'audit social, et sa garantie de
   non-divergence dans les deux sens.

   Premier sens : tout champ du profil demandé ici doit être lu quelque part —
   par une condition du référentiel, par le moteur, par les contrôles, le plan
   ou les modèles — sinon on demande une donnée que rien n'exploite.
   Second sens : tout champ du profil que le code lit doit être demandé ici —
   sinon une condition conclurait sur une donnée que personne ne peut saisir.
   Un écart dans l'un ou l'autre sens fait échouer la génération.

   Les champs sont lus dans le code par « p.champ » ou par les auxiliaires
   « ouiNon(p, "champ") » et « p[cle] » des règles typées — l'inspection les
   couvre tous trois.

   Usage : node questionnaire-social.js                                      */

const path = require("path");

/* L'inspection des sources ne vaut qu'à la publication : dans le navigateur,
   où il n'y a pas de disque, elle est simplement sautée — elle a déjà été
   jouée, et un échec y aurait fait échouer l'empaquetage. */
let SOURCES = null;
try {
  SOURCES = ["referentiel-social.js", "moteur-social.js", "controles-social.js",
    "plan-social.js", "modeles-social.js"]
    .map(n => fs.readFileSync(path.join(__dirname, n), "utf8")).join("\n");
} catch (e) { SOURCES = null; }

const LIGNES = [];
const q = (champ, libelle, format, aide) => LIGNES.push({ champ, libelle, format, aide });

q("entreprise", "Dénomination de l'entreprise", "texte",
  "Elle pré-remplit les rapports et les modèles du plan d'action.");
q("dateAudit", "Date à laquelle la situation est décrite", "AAAA-MM-JJ",
  "Les délais (mise à jour du document unique, cycles d'entretiens…) se mesurent à cette date.");
q("effectif", "Effectif de l'entreprise (salariés)", "nombre",
  "C'est lui qui ouvre ou ferme la plupart des obligations : 11 (comité), 20 (emploi des travailleurs handicapés), 50 (règlement intérieur, BDESE, index, participation…), 250 (référent harcèlement), 300 (CSSCT, commissions).");
q("seuilDepuis12Mois", "Ce niveau d'effectif est-il atteint depuis au moins douze mois consécutifs ?", "oui / non",
  "Plusieurs obligations ne naissent qu'après un maintien du seuil dans la durée : un franchissement récent ne les déclenche pas encore.");
q("secteur", "Secteur d'activité", "texte",
  "Il oriente la convention applicable et le contenu des modèles (document unique notamment).");
q("conventionCollective", "Convention collective applicable (intitulé ou IDCC)", "texte",
  "Elle s'identifie par l'activité réelle de l'entreprise. Le relais de l'application ne sert que le code du travail : les obligations conventionnelles sont listées « à vérifier », jamais affirmées.");
q("groupe", "L'entreprise appartient-elle à un groupe ?", "oui / non",
  "Le groupe déclenche le comité de groupe, et pèse sur certains seuils des modules dédiés.");
q("etablissementsDistincts", "L'entreprise comporte-t-elle au moins deux établissements distincts ?", "oui / non",
  "Plusieurs établissements distincts appellent des CSE d'établissement et un CSE central, et des registres par établissement.");
q("sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?", "oui / non",
  "C'est elle — pas l'effectif — qui déclenche les négociations obligatoires.");
q("accordsCollectifs", "Des accords collectifs d'entreprise sont-ils en vigueur ?", "oui / non",
  "Un accord (méthode, égalité, participation…) peut aménager les périodicités et les contenus : versez-les aux modules dédiés.");
q("matieresInflammables", "Des matières inflammables sont-elles manipulées ?", "oui / non",
  "Elles imposent la consigne de sécurité incendie quel que soit l'effectif.");
q("cadres", "L'entreprise emploie-t-elle des cadres ?", "oui / non",
  "La prévoyance des cadres est une obligation conventionnelle au coût de carence très élevé.");
q("projetLicenciementEco", "Un licenciement pour motif économique est-il envisagé ou en cours ?", "oui / non",
  "S'il l'est, les modules licenciement économique et PSE doivent être passés avant toute notification.");

/* ─────────────────────────── la garantie, dans les deux sens ─────────── */
const lusParLeCode = new Set();
for (const m of (SOURCES || "").matchAll(/\bp\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) lusParLeCode.add(m[1]);
for (const m of (SOURCES || "").matchAll(/ouiNon\(\s*p\s*,\s*"([a-zA-Z0-9_]+)"/g)) lusParLeCode.add(m[1]);
/* p[cle] des règles typées : cle vient des verifs, pas du profil — ignoré.
   dateAudit est lu par les règles de délai via p.dateAudit : couvert. */

const demandes = new Set(LIGNES.map(l => l.champ));
const nonLus = SOURCES === null ? [] : [...demandes].filter(c => !lusParLeCode.has(c)).sort();
const nonDemandes = SOURCES === null ? [] : [...lusParLeCode].filter(c => !demandes.has(c)).sort();

module.exports = { LIGNES, nonLus, nonDemandes };

if (require.main === module) {
  console.log(`${LIGNES.length} questions d'orientation`
    + ` · champs demandés jamais lus : ${nonLus.length ? nonLus.join(", ") : "aucun"}`
    + ` · champs lus jamais demandés : ${nonDemandes.length ? nonDemandes.join(", ") : "aucun"}`);
  if (nonLus.length || nonDemandes.length) {
    console.error("Divergence entre le questionnaire et le code : la génération échoue.");
    process.exit(1);
  }
}

});

__def("./textes-social.json", function(module){ module.exports = {
 "L2315-36": {
  "id": "LEGIARTI000035626455",
  "date": "2026-08-19",
  "texte": "Une commission santé, sécurité et conditions de travail est créée au sein du comité social et économique dans : 1° Les entreprises d'au moins trois cent salariés ; 2° Les établissements distincts d'au moins trois cent salariés ; 3° Les établissements mentionnés aux articles L. 4521-1 et suivants."
 },
 "L1153-5-1": {
  "id": "LEGIARTI000037380160",
  "date": "2026-08-19",
  "texte": "Dans toute entreprise employant au moins deux cent cinquante salariés est désigné un référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes."
 },
 "L1152-4": {
  "id": "LEGIARTI000029144897",
  "date": "2026-08-19",
  "texte": "L'employeur prend toutes dispositions nécessaires en vue de prévenir les agissements de harcèlement moral. Les personnes mentionnées à l'article L. 1152-2 sont informées par tout moyen du texte de l'article 222-33-2 du code pénal."
 },
 "L1153-5": {
  "id": "LEGIARTI000037389712",
  "date": "2026-08-19",
  "texte": "L'employeur prend toutes dispositions nécessaires en vue de prévenir les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner. Dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche, les personnes mentionnées à l'article L. 1153-2 sont informées par tout moyen du texte de l' article 222-33 du code pénal ainsi que des actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel et des coordonnées des autorités et services compétents. La liste de ces services est définie par décret."
 },
 "D4711-1": {
  "id": "LEGIARTI000018527636",
  "date": "2026-08-19",
  "texte": "L'employeur affiche, dans des locaux normalement accessibles aux travailleurs, l'adresse et le numéro d'appel : 1° Du médecin du travail ou du service de santé au travail compétent pour l'établissement ; 2° Des services de secours d'urgence ; 3° De l'inspection du travail compétente ainsi que le nom de l'inspecteur compétent."
 },
 "R4227-37": {
  "id": "LEGIARTI000024769379",
  "date": "2026-08-19",
  "texte": "Dans les établissements mentionnés à l'article R. 4227-34 , une consigne de sécurité incendie est établie et affichée de manière très apparente : 1° Dans chaque local pour les locaux dont l'effectif est supérieur à cinq personnes et pour les locaux mentionnés à l'article R. 4227-24 ; 2° Dans chaque local ou dans chaque dégagement desservant un groupe de locaux dans les autres cas. Dans les autres établissements, des instructions sont établies, permettant d'assurer l'évacuation des personnes présentes dans les locaux dans les conditions prévues au 1° de l'article R. 4216-2 ."
 },
 "R2262-1": {
  "id": "LEGIARTI000048288541",
  "date": "2026-08-19",
  "texte": "A défaut d'autres modalités prévues par une convention ou un accord conclu en application de l'article L. 2262-5, l'employeur : 1° Informe le salarié des conventions et accords collectifs applicables dans l'entreprise ou l'établissement dans les conditions prévues par les articles R. 1221-34 et R. 1221-35 ; 2° Tient un exemplaire à jour de ces textes à la disposition des salariés sur le lieu de travail ; 3° Met sur l'intranet, dans les entreprises dotées de ce dernier, un exemplaire à jour des textes."
 },
 "L4711-5": {
  "id": "LEGIARTI000006903389",
  "date": "2026-08-19",
  "texte": "Lorsqu'il est prévu que les informations énumérées aux articles L. 4711-1 et L. 4711-2 figurent dans des registres distincts, l'employeur est autorisé à réunir ces informations dans un registre unique dès lors que cette mesure est de nature à faciliter la conservation et la consultation de ces informations."
 },
 "R4624-10": {
  "id": "LEGIARTI000033769085",
  "date": "2026-08-19",
  "texte": "Tout travailleur bénéficie d'une visite d'information et de prévention, réalisée par l'un des professionnels de santé mentionnés au premier alinéa de l'article L. 4624-1 dans un délai qui n'excède pas trois mois à compter de la prise effective du poste de travail."
 },
 "L2311-2": {
  "id": "LEGIARTI000035609353",
  "date": "2026-08-19",
  "texte": "Un comité social et économique est mis en place dans les entreprises d'au moins onze salariés. Sa mise en place n'est obligatoire que si l'effectif d'au moins onze salariés est atteint pendant douze mois consécutifs. Les modalités de calcul des effectifs sont celles prévues aux articles L. 1111-2 et L. 1251-54 ."
 },
 "L2313-1": {
  "id": "LEGIARTI000036761964",
  "date": "2026-08-19",
  "texte": "Un comité social et économique est mis en place au niveau de l'entreprise. Des comités sociaux et économiques d'établissement et un comité social et économique central d'entreprise sont constitués dans les entreprises d'au moins cinquante salariés comportant au moins deux établissements distincts."
 },
 "L2331-1": {
  "id": "LEGIARTI000006902131",
  "date": "2026-08-19",
  "texte": "I.-Un comité de groupe est constitué au sein du groupe formé par une entreprise appelée entreprise dominante, dont le siège social est situé sur le territoire français, et les entreprises qu'elle contrôle dans les conditions définies à l'article L. 233-1 , aux I et II de l'article L. 233-3 et à l' article L. 233-16 du code de commerce . II.-Est également considérée comme entreprise dominante, pour la constitution d'un comité de groupe, une entreprise exerçant une influence dominante sur une autre entreprise dont elle détient au moins 10 % du capital, lorsque la permanence et l'importance des relations de ces entreprises établissent l'appartenance de l'une et de l'autre à un même ensemble économique. L'existence d'une influence dominante est présumée établie, sans préjudice de la preuve contraire, lorsqu'une entreprise, directement ou indirectement : -peut nommer plus de la moitié des membres des organes d'administration, de direction ou de surveillance d'une autre entreprise ; -ou dispose de la majorité des voix attachées aux parts émises par une autre entreprise ; -ou détient la majorité du capital souscrit d'une autre entreprise. Lorsque plusieurs entreprises satisfont, à l'égard d'une même entreprise dominée, à un ou plusieurs des critères susmentionnés, celle qui peut nommer plus de la moitié des membres des organes de direction, d'administration ou de surveillance de l'entreprise dominée est considérée comme l'entreprise dominante, sans préjudice de la preuve qu'une autre entreprise puisse exercer une influence dominante."
 },
 "L1311-2": {
  "id": "LEGIARTI000038610176",
  "date": "2026-08-19",
  "texte": "L'établissement d'un règlement intérieur est obligatoire dans les entreprises ou établissements employant au moins cinquante salariés. L'obligation prévue au premier alinéa s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil de cinquante salariés a été atteint, conformément à l'article L. 2312-2 . Des dispositions spéciales peuvent être établies pour une catégorie de personnel ou une division de l'entreprise ou de l'établissement."
 },
 "L1321-1": {
  "id": "LEGIARTI000006901432",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur est un document écrit par lequel l'employeur fixe exclusivement : 1° Les mesures d'application de la réglementation en matière de santé et de sécurité dans l'entreprise ou l'établissement, notamment les instructions prévues à l'article L. 4122-1 ; 2° Les conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices de la santé et de la sécurité des salariés, dès lors qu'elles apparaîtraient compromises ; 3° Les règles générales et permanentes relatives à la discipline, notamment la nature et l'échelle des sanctions que peut prendre l'employeur."
 },
 "L1321-2": {
  "id": "LEGIARTI000045391757",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur rappelle : 1° Les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3 ou par la convention collective applicable ; 2° Les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes prévues par le présent code ; 3° L'existence du dispositif de protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique."
 },
 "L1321-4": {
  "id": "LEGIARTI000054140230",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique. Le règlement intérieur indique la date de son entrée en vigueur. Cette date doit être postérieure d'un mois à l'accomplissement des formalités de publicité. En même temps qu'il fait l'objet des mesures de publicité, le règlement intérieur, accompagné de l'avis du comité social et économique, est communiqué à l'inspecteur du travail. Ces dispositions s'appliquent également en cas de modification ou de retrait des clauses du règlement intérieur."
 },
 "R4121-1": {
  "id": "LEGIARTI000023795562",
  "date": "2026-08-19",
  "texte": "L'employeur transcrit et met à jour dans un document unique les résultats de l'évaluation des risques pour la santé et la sécurité des travailleurs à laquelle il procède en application de l'article L. 4121-3 . Cette évaluation comporte un inventaire des risques identifiés dans chaque unité de travail de l'entreprise ou de l'établissement, y compris ceux liés aux ambiances thermiques."
 },
 "R4121-2": {
  "id": "LEGIARTI000045386446",
  "date": "2026-08-19",
  "texte": "La mise à jour du document unique d'évaluation des risques professionnels est réalisée : 1° Au moins chaque année dans les entreprises d'au moins onze salariés ; 2° Lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail ; 3° Lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur. La mise à jour du programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail ou de la liste des actions de prévention et de protection mentionnés au III de l'article L. 4121-3-1 est effectuée à chaque mise à jour du document unique d'évaluation des risques professionnels, si nécessaire."
 },
 "R4121-4": {
  "id": "LEGIARTI000045386451",
  "date": "2026-08-19",
  "texte": "Le document unique d'évaluation des risques professionnels et ses versions antérieures sont tenus, pendant une durée de 40 ans à compter de leur élaboration, à la disposition : 1° Des travailleurs et des anciens travailleurs pour les versions en vigueur durant leur période d'activité dans l'entreprise. La communication des versions du document unique antérieures à celle en vigueur à la date de la demande peut être limitée aux seuls éléments afférents à l'activité du demandeur. Les travailleurs et anciens travailleurs peuvent communiquer les éléments mis à leur disposition aux professionnels de santé en charge de leur suivi médical ; 2° Des membres de la délégation du personnel du comité social et économique ; 3° Du service de prévention et de santé au travail mentionné à l'article L. 4622-1 ; 4° Des agents du système d'inspection du travail ; 5° Des agents des services de prévention des organismes de sécurité sociale ; 6° Des agents des organismes professionnels de santé, de sécurité et des conditions de travail mentionnés à l'article L. 4643-1 ; 7° Des inspecteurs de la radioprotection mentionnés à l' article L. 1333-29 du code de la santé publique et des agents mentionnés à l' article L. 1333-30 du même code , en ce qui concerne les résultats des évaluations liées à l'exposition des travailleurs aux rayonnements ionisants, pour les installations et activités dont ils ont respectivement la charge. Jusqu'à l'entrée en vigueur de l'obligation de dépôt du document unique d'évaluation des risques professionnels sur un portail numérique selon les modalités prévues au B du V de l' article L. 4121-3-1 du code du travail , l'employeur conserve les versions successives du document unique au sein de l'entreprise sous la forme d'un document papier ou dématérialisé. Un avis indiquant les modalités d'accès des travailleurs au document unique est affiché à une place convenable et aisément accessible dans les lieux de travail. Dans les entreprises ou établissements dotés d'un règlement intérieur, cet avis est affiché au même emplacement que celui réservé au règlement intérieur."
 },
 "L1142-6": {
  "id": "LEGIARTI000029144893",
  "date": "2026-08-19",
  "texte": "Dans les lieux de travail ainsi que dans les locaux ou à la porte des locaux où se fait l'embauche, les personnes mentionnées à l'article L. 1132-1 sont informées par tout moyen du texte des articles 225-1 à 225-4 du code pénal."
 },
 "L1221-13": {
  "id": "LEGIARTI000033971569",
  "date": "2026-08-19",
  "texte": "Un registre unique du personnel est tenu dans tout établissement où sont employés des salariés. Les noms et prénoms de tous les salariés sont inscrits dans l'ordre des embauches. Ces mentions sont portées sur le registre au moment de l'embauche et de façon indélébile. Les nom et prénoms des stagiaires et des personnes volontaires en service civique au sens de l' article L. 120-1 du code du service national accueillis dans l'établissement sont inscrits dans l'ordre d'arrivée, dans une partie spécifique du registre unique du personnel. Les indications complémentaires à mentionner sur ce registre, soit pour l'ensemble des salariés, soit pour certaines catégories seulement, soit pour les stagiaires et les personnes volontaires en service civique mentionnés au troisième alinéa, sont définies par voie réglementaire."
 },
 "L6321-1": {
  "id": "LEGIARTI000052437104",
  "date": "2026-08-19",
  "texte": "L'employeur assure l'adaptation des salariés à leur poste de travail. Il veille au maintien de leur capacité à occuper un emploi, au regard notamment de l'évolution des emplois, des technologies et des organisations. Il peut proposer des formations qui participent au développement des compétences, y compris numériques, ainsi qu'à la lutte contre l'illettrisme, notamment des actions d'évaluation et de formation permettant l'accès au socle de connaissances et de compétences défini par décret. Il peut également proposer aux salariés allophones des formations visant à atteindre une connaissance de la langue française au moins égale à un niveau déterminé par décret. Pour les salariés mentionnés à l' article L. 7221-1 et ceux employés par les particuliers employeurs mentionnés à l' article L. 421-1 du code de l'action sociale et des familles , les modalités d'application du troisième alinéa du présent article sont fixées par décret. Les actions de formation mises en oeuvre à ces fins sont prévues, le cas échéant, par le plan de développement des compétences mentionné au 1° de l'article L. 6312-1 , dont l'élaboration peut tenir compte des conclusions des entretiens mentionnés à l' article L. 6315-1 . Elles peuvent permettre d'obtenir une partie identifiée de certification professionnelle, classée au sein du répertoire national des certifications professionnelles et visant à l'acquisition d'un bloc de compétences."
 },
 "L4141-2": {
  "id": "LEGIARTI000006903166",
  "date": "2026-08-19",
  "texte": "L'employeur organise une formation pratique et appropriée à la sécurité au bénéfice : 1° Des travailleurs qu'il embauche ; 2° Des travailleurs qui changent de poste de travail ou de technique ; 3° Des salariés temporaires, à l'exception de ceux auxquels il est fait appel en vue de l'exécution de travaux urgents nécessités par des mesures de sécurité et déjà dotés de la qualification nécessaire à cette intervention ; 4° A la demande du médecin du travail, des travailleurs qui reprennent leur activité après un arrêt de travail d'une durée d'au moins vingt et un jours. Cette formation est répétée périodiquement dans des conditions déterminées par voie réglementaire ou par convention ou accord collectif de travail."
 },
 "L4622-1": {
  "id": "LEGIARTI000043893834",
  "date": "2026-08-19",
  "texte": "Les employeurs relevant du présent titre organisent des services de prévention et de santé au travail."
 },
 "L3322-2": {
  "id": "LEGIARTI000038613208",
  "date": "2026-08-19",
  "texte": "Les entreprises employant au moins cinquante salariés garantissent le droit de leurs salariés à participer aux résultats de l'entreprise. Il en va de même pour les entreprises constituant une unité économique et sociale mentionnée à l'article L. 2313-8 et composée d'au moins cinquante salariés. La base, les modalités de calcul, ainsi que les modalités d'affectation et de gestion de la participation sont fixées par accord dans les conditions prévues par le présent titre. Le salarié d'un groupement d'employeurs peut bénéficier du dispositif de participation mis en place dans chacune des entreprises adhérentes du groupement auprès de laquelle il est mis à disposition dans des conditions fixées par décret."
 },
 "L1142-8": {
  "id": "LEGIARTI000044605453",
  "date": "2026-08-19",
  "texte": "Dans les entreprises d'au moins cinquante salariés, l'employeur publie chaque année l'ensemble des indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer, selon des modalités et une méthodologie définies par décret. Par dérogation aux articles L. 311-6 et L. 312-1-2 du code des relations entre le public et l'administration, l'ensemble de ces indicateurs est rendu public sur le site internet du ministère chargé du travail, dans des conditions déterminées par décret."
 },
 "L5212-1": {
  "id": "LEGIARTI000044982351",
  "date": "2026-08-19",
  "texte": "La mobilisation en faveur de l'emploi des travailleurs handicapés concerne tous les employeurs. A ce titre, ces derniers déclarent l'effectif total des bénéficiaires de l'obligation d'emploi mentionnés à l'article L. 5212-13 qu'ils emploient, selon des modalités fixées par décret. Les articles L. 5212-2 à L. 5212-17 s'appliquent à tout employeur occupant au moins vingt salariés, y compris les établissements publics industriels et commerciaux. Pour l'application des dispositions du présent chapitre, l'effectif salarié et le franchissement de seuil sont déterminés selon les modalités prévues à l'article L. 130-1 du code de la sécurité sociale. Toutefois, dans les entreprises de travail temporaire, les entreprises de portage salarial et les groupements d'employeurs, l'effectif salarié ne prend pas en compte les salariés mis à disposition ou portés. Par dérogation au I de l'article L. 130-1 du code de la sécurité sociale, la période à retenir pour apprécier le nombre de salariés est l'année au titre de laquelle la contribution prévue aux articles L. 5212-9 à L. 5212-11 du présent code est due. Le nombre de bénéficiaires de l'obligation d'emploi est déterminé selon les modalités prévues au même article L. 130-1, sous réserve des dispositions particulières prévues aux articles L. 5212-6 à L. 5212-7-2 du présent code."
 },
 "L5212-5": {
  "id": "LEGIARTI000037388702",
  "date": "2026-08-19",
  "texte": "L'employeur déclare sa situation au regard de l'obligation d'emploi à laquelle il est soumis en application de l'article L. 5212-2 du présent code au moyen de la déclaration prévue à l'article L. 133-5-3 du code de la sécurité sociale. A défaut de toute déclaration, l'employeur est considéré comme ne satisfaisant pas à l'obligation d'emploi. Les informations contenues dans cette déclaration sont confidentielles. Elles ne peuvent être communiquées à un autre employeur auprès duquel un bénéficiaire de l'obligation d'emploi que la déclaration concerne sollicite un emploi."
 },
 "L3171-1": {
  "id": "LEGIARTI000033021067",
  "date": "2026-08-19",
  "texte": "L'employeur affiche les heures auxquelles commence et finit le travail ainsi que les heures et la durée des repos. Lorsque la durée du travail est organisée dans les conditions fixées par l'article L. 3121-44 , l'affichage comprend la répartition de la durée du travail dans le cadre de cette organisation. La programmation individuelle des périodes d'astreinte est portée à la connaissance de chaque salarié dans des conditions déterminées par voie réglementaire."
 },
 "D4132-1": {
  "id": "LEGIARTI000036484010",
  "date": "2026-08-19",
  "texte": "L'avis du représentant du personnel au comité social et économique, prévu à l'article L. 4131-2 , est consigné sur un registre spécial dont les pages sont numérotées et authentifiées par le tampon du comité. Cet avis est daté et signé. Il indique : 1° Les postes de travail concernés par la cause du danger constaté ; 2° La nature et la cause de ce danger ; 3° Le nom des travailleurs exposés."
 },
 "L6315-1": {
  "id": "LEGIARTI000053279288",
  "date": "2026-08-19",
  "texte": "I. ― A l'occasion de son embauche, le salarié est informé qu'il bénéficie d'un entretien de parcours professionnel avec son employeur au cours de la première année suivant son embauche. Tout salarié restant employé dans la même entreprise bénéficie d'un entretien de parcours professionnel tous les quatre ans. Celui-ci est consacré : 1° Aux compétences du salarié et aux qualifications mobilisées dans son emploi actuel ainsi qu'à leur évolution possible au regard des transformations de l'entreprise ; 2° A sa situation et à son parcours professionnels, au regard des évolutions des métiers et des perspectives d'emploi dans l'entreprise ; 3° A ses besoins de formation, qu'ils soient liés à son activité professionnelle actuelle, à l'évolution de son emploi au regard des transformations de l'entreprise ou à un projet personnel ; 4° A ses souhaits d'évolution professionnelle. L'entretien peut ouvrir la voie à une reconversion interne ou externe, à un projet de transition professionnelle, à un bilan de compétences ou à une validation des acquis de l'expérience ; 5° A l'activation par le salarié de son compte personnel de formation, aux abondements de ce compte que l'employeur est susceptible de financer et au conseil en évolution professionnelle. L'entretien de parcours professionnel ne porte pas sur l'évaluation du travail du salarié. Il est organisé par l'employeur et réalisé par un supérieur hiérarchique ou un représentant de la direction de l'entreprise et se déroule pendant le temps de travail. Cet entretien de parcours professionnel, qui donne lieu à la rédaction d'un document dont une copie est remise au salarié, est proposé systématiquement au salarié qui reprend son activité à l'issue des congés de maternité et d'adoption ou, le cas échéant, à l'issue d'un congé supplémentaire de naissance, d'un congé parental d'éducation, d'un congé de proche aidant, d'un congé sabbatique, d'une période de mobilité volontaire sécurisée mentionnée à l'article L. 1222-12 , d'une période d'activité à temps partiel au sens de l'article L. 1225-47 du présent code, d'un arrêt longue maladie prévu à l'article L. 324-1 du code de la sécurité sociale ou à l'issue d'un mandat syndical, si le salarié n'a bénéficié d'aucun entretien de parcours professionnel au cours des douze mois précédant sa reprise d'activité. Cet entretien peut avoir lieu, à l'initiative du salarié, à une date antérieure à la reprise de poste. Dans les entreprises de moins de trois cents salariés, le salarié peut, pour la préparation de cet entretien, bénéficier d'un conseil en évolution professionnelle mentionné à l' article L. 6111-6 du présent code. L'employeur, pour la préparation de ce même entretien, peut bénéficier d'un conseil de proximité assuré par l'opérateur de compétences mentionné à l' article L. 6332-1 dont il relève. L'employeur peut également être accompagné par un organisme externe lorsqu'un accord de branche ou d'entreprise le prévoit. II. ― Tous les huit ans, l'entretien de parcours professionnel mentionné au I du présent article fait un état des lieux récapitulatif du parcours professionnel du salarié. Lorsqu'il s'agit du premier état des lieux après l'embauche, il peut être réalisé sept ans après l'entretien mentionné au premier alinéa du I. Cette durée s'apprécie par référence à l'ancienneté du salarié dans l'entreprise. Cet état des lieux, qui donne lieu à la rédaction d'un document dont une copie est remise au salarié, permet de vérifier que le salarié a bénéficié au cours des huit dernières années des entretiens de parcours professionnels prévus au I et d'apprécier s'il a : 1° Suivi au moins une action de formation ; 2° Acquis des éléments de certification par la formation ou par une validation des acquis de son expérience ; 3° Bénéficié d'une progression salariale ou professionnelle. Dans les entreprises d'au moins cinquante salariés, lorsque, au cours de ces huit années, le salarié n'a pas bénéficié des entretiens prévus et d'au moins une formation autre que celle mentionnée à l'article L. 6321-2 , son compte personnel est abondé dans les conditions définies à l'article L. 6323-13 . Pour l'application du présent article, l'effectif salarié et le franchissement du seuil de cinquante salariés sont déterminés selon les modalités prévues à l'article L. 130-1 du code de la sécurité sociale. III. ― Un accord collectif d'entreprise ou, à défaut, de branche peut définir un cadre, des objectifs et des critères collectifs d'abondement par l'employeur du compte personnel de formation des salariés. Il peut également prévoir d'autres modalités d'appréciation du parcours professionnel du salarié que celles mentionnés aux 1° à 3° du II du présent article ainsi qu'une périodicité des entretiens de parcours professionnels différente de celle définie au I, sans que celle-ci excède quatre ans. IV. ― L'entretien de parcours professionnel mentionné au I est organisé dans un délai de deux mois à compter de la visite médicale de mi-carrière prévue à l' article L. 4624-2-2 . L'employeur ne peut pas avoir accès aux données de santé du salarié. Les mesures proposées, le cas échéant, par le médecin du travail en application de l' article L. 4624-3 sont évoquées au cours de cet entretien. En plus des sujets mentionnés au I du présent article, sont abordés au cours de cet entretien, s'il y a lieu, l'adaptation ou l'aménagement des missions et du poste de travail, la prévention des situations d'usure professionnelle, les besoins en formation et les éventuels souhaits de mobilité ou de reconversion professionnelle du salarié. A l'issue de l'entretien, le document écrit mentionné à l'avant-dernier alinéa du I du présent article récapitule, sous forme de bilan, l'ensemble des éléments abordés en application du présent IV. V. ― Lors du premier entretien de parcours professionnel qui intervient au cours des deux années précédant le soixantième anniversaire du salarié, sont abordées, en plus des sujets mentionnés au I, les conditions de maintien dans l'emploi et les possibilités d'aménagements de fin de carrière, notamment les possibilités de passage au temps partiel ou de retraite progressive."
 },
 "L5212-2": {
  "id": "LEGIARTI000037388717",
  "date": "2026-08-19",
  "texte": "Tout employeur emploie des bénéficiaires de l'obligation d'emploi mentionnés à l'article L. 5212-13 dans la proportion minimale de 6 % de l'effectif total de ses salariés. Ce taux est révisé tous les cinq ans, en référence à la part des bénéficiaires de l'obligation d'emploi dans la population active et à leur situation au regard du marché du travail, après avis du conseil mentionné à l' article L. 146-1 du code de l'action sociale et des familles ."
 },
 "L4711-1": {
  "id": "LEGIARTI000006903383",
  "date": "2026-08-19",
  "texte": "Les attestations, consignes, résultats et rapports relatifs aux vérifications et contrôles mis à la charge de l'employeur au titre de la santé et de la sécurité au travail comportent des mentions obligatoires déterminées par voie réglementaire."
 },
 "L4711-2": {
  "id": "LEGIARTI000006903384",
  "date": "2026-08-19",
  "texte": "Les observations et mises en demeure notifiées par l'inspection du travail en matière de santé et de sécurité, de médecine du travail et de prévention des risques sont conservées par l'employeur."
 }
}; });

  global.MoteurSocial = {
    audit: require("./audit-social-client.js"),

    moteur: require("./moteur-social.js"),
    controles: require("./controles-social.js"),
    manifeste: __MANIFESTE,
    champs: [],
    propositions: {},
    listes: [],
    colonnes: {},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
