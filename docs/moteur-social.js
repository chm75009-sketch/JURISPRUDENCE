/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : de209504faf6
   {"obligations":41,"parCategorie":{"instances":10,"documents obligatoires":5,"affichages et informations":9,"registres":3,"négociations":3,"santé-sécurité":4,"formation et entretiens":2,"épargne et protection sociale":5},"articlesLus":62,"articlesNonConfirmes":1,"articlesCites":62,"renvoisModules":16,"itemsConventionnels":2,"itemsGeneriques":2,"questionsOrientation":17,"questionsVerification":70,"conformitesOuSansObjetSurProfilVide":0,"conclusionsConformesInterdites":0,"citationsDArticlesNonConfirmes":0,"parcoursDeRegularisation":12,"obligationsLieesAUnParcours":29,"obligationsLieesAUnDocument":28,"obligationsSansParcours":12,"obligationsAvecModeleComplet":41,"liensDeRegularisationMorts":0}
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
  var __MANIFESTE = {"domaine":"audit social — le chapeau des obligations de l'employeur","date":"2026-08-22","empreinte":"de209504faf6","fichiers":{"audit-social-client.js":"11d7bb8dfbe1","capturer-textes-social-2.js":"4d61e2c885d8","capturer-textes-social-3.js":"ae2db2f3a775","capturer-textes-social-4.js":"5cb24e703a38","capturer-textes-social.js":"f79e801d9e31","controles-social.js":"a96e281768f1","generer-donnees-modeles.js":"f8f64294ce6d","modeles-social.js":"5325269df019","moteur-social.js":"6e23710d673f","plan-social.js":"2ac32fc089ad","questionnaire-social.js":"923723e4ea5d","referentiel-social.js":"6148e99fa8aa","tests-social.js":"7d77207443b3","textes-social-non-confirmes.json":"ff595f9c4875","textes-social.json":"6ed5ebf7af68","verifier-textes-social.js":"de5da88f7ad0"},"compteurs":{"obligations":41,"parCategorie":{"instances":10,"documents obligatoires":5,"affichages et informations":9,"registres":3,"négociations":3,"santé-sécurité":4,"formation et entretiens":2,"épargne et protection sociale":5},"articlesLus":62,"articlesNonConfirmes":1,"articlesCites":62,"renvoisModules":16,"itemsConventionnels":2,"itemsGeneriques":2,"questionsOrientation":17,"questionsVerification":70,"conformitesOuSansObjetSurProfilVide":0,"conclusionsConformesInterdites":0,"citationsDArticlesNonConfirmes":0,"parcoursDeRegularisation":12,"obligationsLieesAUnParcours":29,"obligationsLieesAUnDocument":28,"obligationsSansParcours":12,"obligationsAvecModeleComplet":41,"liensDeRegularisationMorts":0},"obligationsSansParcours":["SOC-INS-GROUPE","SOC-DOC-OETH","SOC-REG-SECURITE","SOC-REG-DGI","SOC-NEG-PSE","SOC-SST-SPST","SOC-SST-VIP","SOC-EPA-PARTICIPATION","SOC-EPA-LIVRET","SOC-EPA-SANTE","SOC-EPA-PREVOYANCE-CADRES","SOC-CCN-OBLIGATIONS"],"textesRelus":{"date":"2026-08-20","articles":62,"concordants":62,"ecarts":0,"sansConclusion":0}};
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
    generique: it.generique || null, articles: it.articles, verifs: it.verifs || [],
    regularisation: it.regularisation || null })),
  /* Obligation → parcours guidé → document : les liaisons de l'étape 5,
     déclarées au référentiel et vérifiées à la publication. */
  liaisons: R.LIAISONS,
  parcoursNoms: R.PARCOURS_NOMS,
  categories: R.CATEGORIES,
  textes: R.TEXTES,
  questions: Q.LIGNES,
  applicables: C.applicables,
  verdicts: C.verdicts,
  etats: C.ETATS,
  plan: P.plan,
  action: P.action,
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
  articles: ["L2311-2", "L2314-4", "L2314-5"].filter(lu),
  articlesSouhaites: ["L2311-2", "L2314-4", "L2314-5"],
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
  articles: ["L2315-36", "L2315-38", "L2315-39", "L2315-41"].filter(lu),
  articlesSouhaites: ["L2315-36", "L2315-38", "L2315-39", "L2315-41"],
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
  intitule: "Commissions du CSE à défaut d'accord : formation, information et aide au logement, égalité professionnelle",
  articles: ["L2315-45", "L2315-49", "L2315-50", "L2315-51", "L2315-56"].filter(lu),
  articlesSouhaites: ["L2315-45", "L2315-49", "L2315-50", "L2315-51", "L2315-56"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = auSeuil(300)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " Les commissions supplétives du comité (formation, information et aide au logement, égalité professionnelle) naissent à partir de trois cents salariés — et seulement en l'absence d'accord d'entreprise prévu à l'article L. 2315-45." };
    return { du: true, motif: s.motif + " Ces commissions ne jouent qu'À DÉFAUT D'ACCORD : un accord d'entreprise (L. 2315-45) peut organiser les commissions autrement. En son absence, le comité constitue une commission de la formation (L. 2315-49), une commission d'information et d'aide au logement (L. 2315-50, missions à L. 2315-51) et une commission de l'égalité professionnelle (L. 2315-56)." };
  },
  verifs: [
    { cle: "commissionsConstituees", libelle: "Un accord d'entreprise (L. 2315-45) organise-t-il les commissions — ou, à défaut d'accord, les trois commissions supplétives (formation, logement, égalité professionnelle) sont-elles constituées ?", format: "oui / non", regle: "oui",
      motifNC: "Ni accord organisant les commissions, ni commissions supplétives constituées : à trois cents salariés et à défaut d'accord L. 2315-45, le comité doit constituer les commissions formation (L. 2315-49), information et aide au logement (L. 2315-50) et égalité professionnelle (L. 2315-56)." },
  ],
  plan: {
    priorite: 3,
    action: "Constituer, à défaut d'accord L. 2315-45, les commissions supplétives du comité : formation, information et aide au logement, égalité professionnelle.",
    etapes: [
      "Vérifier d'abord si un accord d'entreprise (L. 2315-45) organise les commissions : lui seul peut y déroger.",
      "À défaut d'accord, faire constituer les trois commissions par délibération du comité (le modèle joint donne les délibérations complètes).",
      "Doter chaque commission de membres, d'un rythme de réunions et de moyens, et le consigner au règlement intérieur du comité.",
    ],
    acteur: "Direction et CSE",
    delai: "Dès le franchissement du seuil de trois cents salariés",
    risque: "Fonctionnement irrégulier du comité et contestation de ses consultations préparées sans les commissions dues — l'audit détaillé se fait dans le module comité.",
    modele: { page: "audit-cse.html", nom: "délibérations de constitution des commissions (modèle joint au plan)" },
  },
});

item({
  id: "SOC-INS-COMMISSION-ECO", categorie: "instances",
  intitule: "Commission économique du CSE (entreprise d'au moins 1 000 salariés, à défaut d'accord)",
  articles: ["L2315-45", "L2315-46"].filter(lu),
  articlesSouhaites: ["L2315-45", "L2315-46"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = auSeuil(1000)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " La commission économique n'est due, à défaut d'accord L. 2315-45, qu'à partir de mille salariés (L. 2315-46)." };
    return { du: true, motif: s.motif + " À défaut d'accord d'entreprise prévu à l'article L. 2315-45, une commission économique est créée au sein du comité social et économique ou du comité central : elle étudie les documents économiques et financiers recueillis par le comité et toute question qu'il lui soumet (L. 2315-46)." };
  },
  verifs: [
    { cle: "commissionEcoConstituee", libelle: "Un accord organise-t-il les commissions — ou, à défaut, la commission économique est-elle constituée (au niveau du comité ou du comité central) ?", format: "oui / non", regle: "oui",
      motifNC: "Ni accord L. 2315-45, ni commission économique constituée : à mille salariés, L. 2315-46 impose sa création au sein du comité social et économique ou du comité central." },
  ],
  plan: {
    priorite: 3,
    action: "Constituer la commission économique du comité (ou du comité central), à défaut d'accord L. 2315-45.",
    etapes: [
      "Vérifier si un accord d'entreprise organise les commissions — lui seul dispense du régime supplétif.",
      "À défaut, faire adopter la délibération de constitution (le modèle joint la rédige) au bon niveau : comité unique, ou comité central dans une entreprise à établissements.",
      "Organiser le flux des documents économiques et financiers vers la commission, en lien avec la BDESE.",
    ],
    acteur: "Direction et CSE (ou CSE central)",
    delai: "Dès le franchissement du seuil de mille salariés",
    risque: "Consultations économiques du comité fragilisées : la commission due n'a pas préparé les documents — l'audit détaillé se fait dans le module comité.",
    modele: { page: "audit-cse.html", nom: "délibération de constitution de la commission économique (modèle joint au plan)" },
  },
});

item({
  id: "SOC-INS-COMMISSION-MARCHES", categorie: "instances",
  intitule: "Commission des marchés du CSE (critère : les comptes du comité, pas l'effectif de l'entreprise)",
  articles: ["L2315-44-1", "D2315-29"].filter(lu),
  articlesSouhaites: ["L2315-44-1", "D2315-29"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = M.seuilDouzeMois(p, 11);
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.atteint) return { du: false, motif: s.motif + " Sans comité, la commission des marchés n'a pas de support." };
    const c = M.ouiNon(p, "comiteSeuilsComptes", "Le comité dépasse-t-il, pour au moins deux des trois critères tenant à ses propres comptes (cinquante salariés du comité à la clôture d'un exercice, ressources annuelles, total du bilan), les seuils réglementaires ?");
    if (!c.connu) return { du: null, motif: "Le critère de la commission des marchés n'est pas l'effectif de l'entreprise mais les comptes du comité lui-même (L. 2315-44-1, D. 2315-29). " + c.motif };
    if (!c.vrai) return { du: false, motif: "Le comité ne dépasse pas au moins deux des trois seuils de D. 2315-29 (nombre de salariés du comité à la clôture d'un exercice, ressources annuelles, total du bilan) : la commission des marchés n'est pas due — le critère tient aux comptes du comité, pas à l'effectif de l'entreprise ; recontrôlez à chaque clôture des comptes du comité." };
    return { du: true, motif: "Le comité dépasse, pour au moins deux des trois critères, les seuils de D. 2315-29 : une commission des marchés doit être créée en son sein (L. 2315-44-1). Le critère tient aux comptes du comité — pas à l'effectif de l'entreprise ; le seuil de passage en commission des marchés est fixé à 30 000 euros (D. 2315-29, dernier alinéa)." };
  },
  verifs: [
    { cle: "commissionMarchesConstituee", libelle: "La commission des marchés est-elle constituée au sein du comité ?", format: "oui / non", regle: "oui",
      motifNC: "Le comité dépasse les seuils de D. 2315-29 et aucune commission des marchés n'est constituée : L. 2315-44-1 l'impose — les marchés du comité au-delà de 30 000 euros (D. 2315-29) doivent passer par elle." },
  ],
  plan: {
    priorite: 3,
    action: "Faire constituer la commission des marchés au sein du comité — c'est une obligation du comité, que l'employeur a intérêt à signaler.",
    etapes: [
      "Faire vérifier les comptes du comité au regard des trois critères de D. 2315-29 (salariés du comité à la clôture, ressources annuelles, total du bilan) : deux dépassés déclenchent l'obligation.",
      "Faire adopter la délibération de constitution et fixer, dans le règlement intérieur du comité, les modalités de fonctionnement de la commission (le modèle joint donne la trame).",
      "Faire passer par la commission les marchés dont le montant dépasse 30 000 euros (D. 2315-29, dernier alinéa).",
    ],
    acteur: "CSE (l'employeur signale l'obligation ; la commission est celle du comité)",
    delai: "À la clôture des comptes du comité qui révèle le dépassement",
    risque: "Marchés du comité passés hors procédure : responsabilité des élus gestionnaires et contestation des engagements — l'audit détaillé se fait dans le module comité.",
    modele: { page: "audit-cse.html", nom: "délibération et règlement de la commission des marchés (modèle joint au plan)" },
  },
});

item({
  id: "SOC-INS-FORMATION-ELUS", categorie: "instances",
  intitule: "Formation santé, sécurité et conditions de travail des élus du CSE et du référent harcèlement sexuel",
  articles: ["L2315-18", "L2315-16"].filter(lu),
  articlesSouhaites: ["L2315-18", "L2315-16"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = M.seuilDouzeMois(p, 11);
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.atteint) return { du: false, motif: s.motif + " La formation santé-sécurité des élus suit le comité : sans comité dû, elle n'a pas de bénéficiaires — elle naîtra avec lui." };
    return { du: true, motif: s.motif + " Dès qu'un comité existe — donc dès onze salariés, pas seulement à trois cents —, ses membres et le référent harcèlement sexuel du comité bénéficient de la formation nécessaire en santé, sécurité et conditions de travail : cinq jours au moins au premier mandat, trois jours au renouvellement (cinq pour les membres de la CSSCT dans les entreprises d'au moins trois cents salariés) ; le financement est pris en charge par l'employeur (L. 2315-18), et le temps de formation est pris sur le temps de travail, rémunéré comme tel, sans imputation sur les heures de délégation (L. 2315-16)." };
  },
  verifs: [
    { cle: "formationFaite", libelle: "Tous les membres de la délégation du personnel (titulaires et suppléants) et le référent harcèlement du comité ont-ils reçu la formation — cinq jours au premier mandat, trois au renouvellement (cinq pour la CSSCT à partir de 300) ?", format: "oui / non", regle: "oui",
      motifNC: "Des élus du comité (ou le référent harcèlement) n'ont pas reçu leur formation santé-sécurité : L. 2315-18 l'impose dès qu'un comité existe — cinq jours au moins au premier mandat ; programmez les sessions manquantes." },
    { cle: "priseEnCharge", libelle: "Le financement est-il pris en charge par l'employeur, et le temps de formation payé comme temps de travail sans imputation sur les heures de délégation ?", format: "oui / non", regle: "oui",
      motifNC: "La prise en charge n'est pas établie : le financement de la formation incombe à l'employeur (L. 2315-18, dernier alinéa) et le temps de formation est rémunéré comme temps de travail, sans déduction des heures de délégation (L. 2315-16)." },
  ],
  plan: {
    priorite: 2,
    action: "Programmer et financer la formation santé-sécurité de tous les élus du comité et du référent harcèlement.",
    etapes: [
      "Recenser les bénéficiaires : tous les membres de la délégation du personnel (titulaires et suppléants) et le référent harcèlement du comité — et repérer premiers mandats et renouvellements, qui commandent la durée.",
      "Choisir un organisme habilité et arrêter le calendrier (le modèle joint programme les sessions et chiffre le budget).",
      "Payer le temps de formation comme temps de travail, sans l'imputer sur les heures de délégation, et prendre en charge le coût.",
    ],
    acteur: "Direction / ressources humaines, avec le comité",
    delai: "Dès le début de chaque mandat — les élus non formés le restent tout le mandat si personne ne programme",
    risque: "Des élus non formés fragilisent toutes les attributions santé-sécurité du comité, et le refus de prise en charge s'analyse en entrave — l'audit détaillé se fait dans le module comité.",
    modele: { page: "audit-cse.html", nom: "programmation et budget de la formation des élus (modèle joint au plan)" },
  },
});

item({
  id: "SOC-INS-REUNIONS-SST", categorie: "instances",
  intitule: "Quatre réunions annuelles au moins du CSE portant sur la santé, la sécurité et les conditions de travail",
  articles: ["L2315-27"].filter(lu),
  articlesSouhaites: ["L2315-27"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " La règle des quatre réunions annuelles santé-sécurité (L. 2315-27) s'applique au fonctionnement du comité des entreprises d'au moins cinquante salariés." };
    return { du: true, motif: s.motif + " Au moins quatre réunions du comité portent annuellement, en tout ou partie, sur ses attributions en matière de santé, sécurité et conditions de travail — plus souvent en cas de besoin, et le comité est en outre réuni après tout accident grave ou événement grave (L. 2315-27). L'employeur informe chaque année l'inspection du travail, le médecin du travail et l'agent des services de prévention des organismes de sécurité sociale du calendrier de ces réunions, et leur confirme chacune par écrit au moins quinze jours à l'avance." };
  },
  verifs: [
    { cle: "quatreReunions", libelle: "Au moins quatre réunions du comité ont-elles porté, sur les douze derniers mois, en tout ou partie sur la santé, la sécurité et les conditions de travail ?", format: "oui / non", regle: "oui",
      motifNC: "Moins de quatre réunions santé-sécurité sur l'année : L. 2315-27 en impose au moins quatre — inscrivez le point à l'ordre du jour des prochaines réunions et rattrapez le calendrier." },
    { cle: "calendrierCommunique", libelle: "Le calendrier annuel de ces réunions est-il communiqué à l'inspection du travail, au médecin du travail et à l'agent des services de prévention, chaque réunion étant confirmée par écrit quinze jours à l'avance ?", format: "oui / non", regle: "oui",
      motifNC: "Le calendrier des réunions santé-sécurité n'est pas communiqué : L. 2315-27 impose d'informer annuellement l'inspection du travail, le médecin du travail et l'agent des services de prévention, et de confirmer chaque réunion par écrit au moins quinze jours à l'avance." },
  ],
  plan: {
    priorite: 2,
    action: "Caler le calendrier annuel des réunions santé-sécurité du comité et les communications qui l'accompagnent.",
    etapes: [
      "Fixer au moins quatre réunions de l'année portant, en tout ou partie, sur la santé, la sécurité et les conditions de travail (le modèle joint propose un calendrier).",
      "Communiquer ce calendrier à l'inspection du travail, au médecin du travail et à l'agent des services de prévention des organismes de sécurité sociale.",
      "Confirmer chaque réunion par écrit à ces destinataires au moins quinze jours à l'avance, et le tracer.",
    ],
    acteur: "Direction (présidence du comité)",
    delai: "Calendrier à poser en début d'année ou de mandat",
    risque: "Réunions santé-sécurité insuffisantes ou non annoncées : fonctionnement irrégulier du comité — et l'inspection peut convoquer le comité et le présider en cas de défaillance de l'employeur (L. 2315-27).",
    modele: { page: "audit-cse.html", nom: "calendrier annuel et courriers d'information (modèle joint au plan)" },
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
  articles: ["L1311-2", "L1321-1", "L1321-2", "L1321-2-1", "L1321-3", "L1321-4", "L1321-5", "L1321-6"].filter(lu),
  articlesSouhaites: ["L1311-2", "L1321-1", "L1321-2", "L1321-2-1", "L1321-3", "L1321-4", "L1321-5", "L1321-6"],
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
    { cle: "depotGreffe", libelle: "A-t-il été déposé au greffe du conseil de prud'hommes du ressort ?", format: "oui / non", regle: "oui",
      motifNC: "Le dépôt au greffe du conseil de prud'hommes n'est pas établi : il conditionne, avec la publicité, le point de départ du délai d'un mois qui précède l'entrée en vigueur — déposez et conservez le récépissé." },
    { cle: "communicationInspection", libelle: "A-t-il été transmis à l'inspection du travail, accompagné de l'avis du comité ?", format: "oui / non", regle: "oui",
      motifNC: "La transmission à l'inspection du travail, avec l'avis du comité, n'est pas établie : accomplissez-la et conservez la preuve de l'envoi." },
    { cle: "publicite", libelle: "Est-il affiché ou porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail et aux locaux d'embauche ?", format: "oui / non", regle: "oui",
      motifNC: "La publicité auprès des salariés n'est pas établie : elle conditionne, avec le dépôt, l'entrée en vigueur du texte — affichez ou diffusez, et datez cette diffusion." },
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
    { cle: "bdeseExiste", libelle: "Avez-vous une base de données économiques, sociales et environnementales, et a-t-elle été actualisée au cours des douze derniers mois ?", format: "oui / non", regle: "oui",
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
    { cle: "obligationSatisfaite", libelle: "Pour la dernière année, avez-vous employé des bénéficiaires, versé la contribution ou appliqué un accord agréé ?", format: "oui / non", regle: "oui",
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
  id: "SOC-AFF-EGA-REMU", categorie: "affichages et informations",
  intitule: "Information sur les textes d'égalité de rémunération entre les femmes et les hommes (L. 3221-1 à L. 3221-7)",
  articles: ["R3221-2"].filter(lu),
  articlesSouhaites: ["R3221-2"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "informationFaite", libelle: "Le texte des articles L. 3221-1 à L. 3221-7 (et de leurs textes d'application) est-il porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail et des candidats à l'embauche ?", format: "oui / non", regle: "oui",
      motifNC: "Les textes sur l'égalité de rémunération entre les femmes et les hommes ne sont pas portés à la connaissance des salariés et candidats : R. 3221-2 impose cette information, par tout moyen, dans les lieux de travail et à l'embauche." },
  ],
  plan: {
    priorite: 3,
    action: "Porter à la connaissance des salariés et des candidats les textes sur l'égalité de rémunération femmes-hommes.",
    etapes: [
      "Préparer le support reprenant les articles L. 3221-1 à L. 3221-7 en vigueur et leurs textes d'application (le modèle joint donne l'affiche).",
      "Le diffuser par tout moyen aux personnes ayant accès aux lieux de travail et aux candidats à l'embauche, et dater la mise en place.",
    ],
    acteur: "Ressources humaines",
    delai: "Immédiat",
    risque: "Manquement d'information retenu dans les contentieux d'égalité salariale — formulation prudente : l'article d'amende n'a pas été vérifié ici.",
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
  id: "SOC-AFF-DECOMPTE", categorie: "affichages et informations",
  intitule: "Décompte individuel de la durée du travail des salariés hors horaire collectif, et documents tenus à disposition",
  articles: ["L3171-2", "L3171-3"].filter(lu),
  articlesSouhaites: ["L3171-2", "L3171-3"],
  module: null,
  condition: p => {
    const h = M.ouiNon(p, "salariesHorsHoraire", "Des salariés travaillent-ils en dehors d'un horaire collectif uniforme (horaires individualisés, équipes, forfaits, itinérants) ?");
    if (!h.connu) return { du: null, motif: h.motif };
    if (!h.vrai) return { du: false, motif: "Tous les salariés déclarés suivent le même horaire collectif : c'est l'affichage de l'horaire (L. 3171-1) qui en tient lieu — le décompte individuel de L. 3171-2 n'a pas d'objet tant que cette situation dure." };
    return { du: true, motif: "Des salariés ne suivent pas le même horaire collectif : l'employeur établit, pour chacun d'eux, les documents nécessaires au décompte de la durée de travail, des repos compensateurs acquis et de leur prise effective — documents que le comité peut consulter (L. 3171-2) — et tient à la disposition de l'inspection du travail les documents permettant de comptabiliser le temps de travail accompli par chaque salarié (L. 3171-3)." };
  },
  verifs: [
    { cle: "decompteEtabli", libelle: "Les documents de décompte individuels (durée du travail, repos compensateurs acquis et pris) sont-ils établis pour chaque salarié hors horaire collectif ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun décompte individuel établi pour les salariés hors horaire collectif : L. 3171-2 l'impose — et en litige d'heures supplémentaires, l'absence de décompte se retourne contre l'employeur." },
    { cle: "documentsDisponibles", libelle: "Ces documents sont-ils tenus à la disposition de l'inspection du travail, et consultables par le comité ?", format: "oui / non", regle: "oui",
      motifNC: "Les documents de comptabilisation du temps de travail ne sont pas tenus à disposition : L. 3171-3 impose leur mise à disposition de l'agent de contrôle, et L. 3171-2 leur consultation par le comité." },
  ],
  plan: {
    priorite: 2,
    action: "Organiser le décompte individuel du temps de travail des salariés hors horaire collectif et la conservation des documents.",
    etapes: [
      "Recenser les populations hors horaire collectif (horaires individualisés, équipes successives, forfaits, itinérants) et choisir le mode de décompte de chacune.",
      "Établir les documents : durée de travail, repos compensateurs acquis et leur prise effective, salarié par salarié (le modèle joint donne la trame).",
      "Les tenir à la disposition de l'inspection du travail et les rendre consultables par le comité ; définir la durée de conservation avec votre conseil (textes réglementaires non vérifiés ici).",
    ],
    acteur: "Ressources humaines / paie",
    delai: "Sous quelques semaines : chaque mois sans décompte est un mois indéfendable en litige",
    risque: "En litige sur les heures supplémentaires, c'est l'employeur qui doit produire les éléments de décompte : sans documents, les décomptes du salarié l'emportent — et l'inspection peut relever l'absence de documents de L. 3171-3.",
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
    { cle: "avisEtAcces", libelle: "L'avis indiquant la convention applicable et les modalités de sa consultation est-il communiqué aux salariés ?", format: "oui / non", regle: "oui",
      motifNC: "L'avis d'information sur la convention collective n'est pas communiqué : rédigez-le et diffusez-le selon les modalités de l'article R. 2262-1 — ou selon celles que votre accord prévoit." },
    { cle: "exemplaireDisponible", libelle: "Un exemplaire à jour de la convention est-il tenu à la disposition des salariés sur le lieu de travail (ou mis en ligne sur l'intranet) ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun exemplaire à jour n'est tenu à la disposition des salariés : procurez-vous le texte consolidé et ses avenants, et rendez-le consultable sur le lieu de travail ou sur l'intranet." },
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
  articles: ["L1221-13", "D1221-23"].filter(lu),
  articlesSouhaites: ["L1221-13", "D1221-23"],
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
  articles: ["R4624-10", "R4624-16"].filter(lu),
  articlesSouhaites: ["R4624-10", "R4624-16"],
  module: null,
  condition: toutEmployeur,
  verifs: [
    { cle: "embauchesVues", libelle: "Chaque salarié a-t-il bénéficié de sa visite d'information et de prévention dans le délai suivant la prise de poste ?", format: "oui / non", regle: "oui",
      motifNC: "Des salariés n'ont pas eu leur visite d'information et de prévention : programmez les visites en retard — le délai court à compter de la prise de poste, et certains postes appellent un suivi renforcé ou une visite avant affectation." },
    { cle: "suiviPeriodique", libelle: "Chaque salarié a-t-il eu sa dernière visite périodique dans le délai fixé par le médecin du travail (cinq ans au plus, R. 4624-16) ?", format: "oui / non", regle: "oui",
      motifNC: "Le suivi périodique n'est pas à jour : la visite se renouvelle à la périodicité fixée par le médecin du travail, sans pouvoir excéder cinq ans (R. 4624-16) — demandez au service de prévention l'état des visites et reprogrammez les échéances dépassées." },
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
  id: "SOC-SST-POSTES-RISQUES", categorie: "santé-sécurité",
  intitule: "Postes à risques particuliers : suivi individuel renforcé et liste des postes",
  articles: ["R4624-22", "R4624-23"].filter(lu),
  articlesSouhaites: ["R4624-22", "R4624-23"],
  module: null,
  condition: p => {
    const r = M.ouiNon(p, "postesRisquesParticuliers", "Des salariés sont-ils affectés à des postes présentant des risques particuliers (amiante, plomb, agents cancérogènes-mutagènes-reprotoxiques, agents biologiques des groupes 3 et 4, rayonnements ionisants, risque hyperbare, montage-démontage d'échafaudages, ou postes soumis à un examen d'aptitude spécifique) ?");
    if (!r.connu) return { du: null, motif: r.motif };
    if (!r.vrai) return { du: false, motif: "Aucun poste à risques particuliers déclaré au sens de R. 4624-23 : le suivi individuel renforcé n'a pas de bénéficiaires — recontrôlez à chaque évolution des postes, et l'employeur peut aussi compléter la liste de sa propre initiative (R. 4624-23, III)." };
    return { du: true, motif: "Des postes à risques particuliers sont déclarés : chaque travailleur qui y est affecté bénéficie d'un suivi individuel renforcé de son état de santé (R. 4624-22). Si l'employeur complète la liste des postes au-delà des catégories légales, cette liste est motivée par écrit, prise après avis du médecin du travail et du comité s'il existe, transmise au service de prévention et mise à jour tous les ans (R. 4624-23, III)." };
  },
  verifs: [
    { cle: "suiviRenforceEnPlace", libelle: "Chaque salarié affecté à un poste à risques particuliers bénéficie-t-il du suivi individuel renforcé (examen avant affectation, périodicité renforcée) ?", format: "oui / non", regle: "oui",
      motifNC: "Des salariés de postes à risques particuliers n'ont pas leur suivi individuel renforcé : R. 4624-22 l'impose — signalez les postes au service de prévention et programmez les examens manquants." },
    { cle: "listeEtablie", libelle: "La liste des postes concernés est-elle établie avec le service de prévention — et, si l'employeur l'a complétée, motivée par écrit, prise après avis du médecin du travail et du comité, transmise au service et mise à jour annuellement ?", format: "oui / non", regle: "oui",
      motifNC: "La liste des postes à risques n'est pas formalisée : sans elle, le service de prévention ne peut pas classer les salariés en suivi renforcé — établissez-la, et si vous la complétez au-delà des catégories légales, respectez le formalisme de R. 4624-23, III (motivation écrite, avis, transmission, mise à jour annuelle)." },
  ],
  plan: {
    priorite: 2,
    action: "Établir la liste des postes à risques particuliers et mettre en place le suivi individuel renforcé des salariés concernés.",
    etapes: [
      "Recenser les postes entrant dans les catégories de R. 4624-23, I et II (amiante, plomb, CMR, agents biologiques 3 et 4, rayonnements ionisants, hyperbare, échafaudages, examens d'aptitude spécifiques), en cohérence avec le document unique.",
      "Décider des compléments éventuels (R. 4624-23, III) : motivation écrite, avis du médecin du travail et du comité, transmission au service de prévention, mise à jour annuelle.",
      "Transmettre la liste au service de prévention et faire programmer les examens avant affectation et le suivi renforcé.",
    ],
    acteur: "Direction / ressources humaines, avec le médecin du travail et le comité",
    delai: "Avant toute nouvelle affectation à un poste concerné ; régularisation des postes occupés sous quelques semaines",
    risque: "Un salarié d'un poste à risques sans suivi renforcé, puis accidenté ou inapte, se retourne contre l'employeur : le défaut de suivi médical renforcé pèse lourd dans la faute inexcusable.",
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
  id: "SOC-EPA-LIVRET", categorie: "épargne et protection sociale",
  intitule: "Livret d'épargne salariale remis à chaque embauche (entreprise proposant un dispositif)",
  articles: ["L3341-6"].filter(lu),
  articlesSouhaites: ["L3341-6"],
  module: null,
  condition: p => {
    const e = M.ouiNon(p, "epargneSalariale", "Un dispositif d'épargne salariale (intéressement, participation, plan d'épargne d'entreprise ou de retraite) est-il en place ?");
    if (!e.connu) return { du: null, motif: e.motif };
    if (!e.vrai) return { du: false, motif: "Aucun dispositif d'épargne salariale déclaré : le livret d'épargne salariale n'a pas d'objet — il le retrouvera avec le premier dispositif, et la participation devient obligatoire à partir de cinquante salariés maintenus." };
    return { du: true, motif: "Un dispositif d'épargne salariale est en place : tout salarié reçoit, lors de la conclusion de son contrat de travail, un livret d'épargne salariale présentant les dispositifs de l'entreprise, également porté à la connaissance des représentants du personnel — le cas échéant via la BDESE (L. 3341-6)." };
  },
  verifs: [
    { cle: "livretRemis", libelle: "Le livret d'épargne salariale est-il remis à chaque salarié lors de la conclusion de son contrat de travail ?", format: "oui / non", regle: "oui",
      motifNC: "Le livret d'épargne salariale n'est pas remis à l'embauche : L. 3341-6 l'impose à toute entreprise proposant un dispositif — intégrez-le au dossier d'embauche, contre émargement." },
    { cle: "livretElus", libelle: "Le livret est-il porté à la connaissance des représentants du personnel (le cas échéant via la BDESE) ?", format: "oui / non", regle: "oui",
      motifNC: "Le livret n'est pas porté à la connaissance des représentants du personnel : L. 3341-6 le prévoit, le cas échéant comme élément de la BDESE — versez-le." },
  ],
  plan: {
    priorite: 3,
    action: "Établir le livret d'épargne salariale et l'intégrer au parcours d'embauche.",
    etapes: [
      "Rédiger le livret : présentation de chaque dispositif en place (intéressement, participation, plans d'épargne), modalités d'affectation et de déblocage — le modèle joint donne le sommaire complet.",
      "Le remettre à chaque nouvelle embauche, contre émargement, et le porter à la connaissance des représentants du personnel (BDESE le cas échéant).",
      "Le mettre à jour à chaque évolution des dispositifs.",
    ],
    acteur: "Ressources humaines / paie",
    delai: "Avant la prochaine embauche",
    risque: "Un salarié non informé de ses droits d'épargne salariale peut contester les affectations par défaut et les délais qui lui ont été opposés — l'information manquante se retourne contre l'employeur.",
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
    { cle: "contratEnPlace", libelle: "Avez-vous souscrit un contrat collectif santé couvrant l'ensemble des salariés ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune complémentaire santé collective déclarée : mettez-la en place — l'obligation est générale, et la convention collective peut imposer des garanties supérieures." },
    { cle: "acteFondateur", libelle: "L'acte fondateur (accord, référendum ou décision unilatérale) est-il écrit, et les dispenses individuelles recueillies par écrit ?", format: "oui / non", regle: "oui",
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
    { cle: "contratEnPlace", libelle: "Avez-vous souscrit un contrat de prévoyance pour les cadres, et la cotisation patronale dédiée est-elle affectée en priorité au risque décès ?", format: "oui / non", regle: "oui",
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
    { cle: "verificationFaite", libelle: "Avez-vous relevé les obligations de votre branche (minima, primes, prévoyance…) et confronté vos pratiques à ce relevé ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune revue conventionnelle déclarée : faites passer en revue minima, primes, classification et prévoyance de branche — un rappel de prime conventionnelle se prescrit en années, pas en mois." },
    { cle: "dateVerification", libelle: "Date de la dernière revue", format: "AAAA-MM-JJ", regle: "ageMaxMois", mois: 24,
      motifNC: "La dernière revue conventionnelle date de plus de deux ans : les avenants de branche tombent chaque année — refaites-la." },
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

/* ══════════════════ la régularisation : obligation → parcours → modèle ══

   Une obligation manquante n'est utile au client que si l'application lui dit
   AUSSI comment la combler. Deux liens, et deux seulement :

   - LE PARCOURS (parcours.html?p=<clé>) : la procédure pas à pas, étape par
     étape, chacune fondée sur un article lu à la source et se terminant par
     une étape de validation. C'est le « comment ».

   - LE DOCUMENT (documents.html?modele=<clé>) : la trame imprimable et
     pré-remplie du courrier, du procès-verbal ou de la délibération que
     l'étape appelle. C'est le « avec quoi ».

   S'y ajoute, pour les quarante et une obligations sans exception, le MODÈLE
   COMPLET de l'obligation elle-même — structure intégrale, exemple chiffré,
   champs à personnaliser — engendré par modeles-social.js à partir du profil.

   CE QUI N'A PAS DE PARCOURS LE DIT. Une obligation sans procédure guidée
   porte `parcours: null` : le guide de régularisation affiche alors ses
   étapes propres et le renvoi au module d'audit dédié, plutôt qu'un lien qui
   ne mènerait nulle part. Les clés de parcours et de documents sont vérifiées
   à la publication (publier-social.js) contre docs/parcours.js et
   docs/documents.html : un lien mort fait échouer la chaîne.               */
const PARCOURS_NOMS = {
  sanction: "Sanctionner un salarié",
  nao: "Conduire les négociations obligatoires (NAO)",
  commissions: "Constituer les commissions du CSE",
  reunion: "Tenir une réunion du CSE",
  ri: "Établir ou mettre à jour le règlement intérieur",
  duerp: "Mettre à jour le DUERP",
  installation: "Installer le CSE : la première réunion",
  affichages: "Mettre en place les affichages et informations obligatoires",
  registre: "Tenir le registre unique du personnel",
  bdese: "Constituer la base de données (BDESE)",
  index: "Calculer et publier l'index de l'égalité professionnelle",
  entretiens: "Organiser les entretiens de parcours professionnel",
};

const LIAISONS = {
  /* instances */
  "SOC-INS-CSE":                 { parcours: "installation", document: "convocation-installation" },
  "SOC-INS-CSE-ETAB":            { parcours: "installation", document: "convocation-installation" },
  "SOC-INS-CSSCT":               { parcours: "commissions",  document: "designation-commission" },
  "SOC-INS-COMMISSIONS":         { parcours: "commissions",  document: "designation-commission" },
  "SOC-INS-COMMISSION-ECO":      { parcours: "commissions",  document: "designation-commission" },
  "SOC-INS-COMMISSION-MARCHES":  { parcours: "commissions",  document: "designation-commission" },
  "SOC-INS-FORMATION-ELUS":      { parcours: "commissions",  document: "cr-commission" },
  "SOC-INS-REUNIONS-SST":        { parcours: "reunion",      document: "convocation" },
  "SOC-INS-GROUPE":              { parcours: null,           document: null },
  "SOC-INS-REF-HARCELEMENT":     { parcours: "installation", document: "pv-installation" },
  /* documents obligatoires */
  "SOC-DOC-RI":                  { parcours: "ri",           document: "echelle-sanctions" },
  "SOC-DOC-DUERP":               { parcours: "duerp",        document: null },
  "SOC-DOC-BDESE":               { parcours: "bdese",        document: "demande-documentation-eco" },
  "SOC-DOC-INDEX":               { parcours: "index",        document: "note-rh" },
  "SOC-DOC-OETH":                { parcours: null,           document: null },
  /* affichages et informations */
  "SOC-AFF-HARCELEMENT":         { parcours: "affichages",   document: "signalement-harcelement" },
  "SOC-AFF-EGALITE":             { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-EGA-REMU":            { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-COORDONNEES":         { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-CONSIGNE-INCENDIE":   { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-HORAIRES":            { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-DECOMPTE":            { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-CONVENTION":          { parcours: "affichages",   document: "note-rh" },
  "SOC-AFF-FUMER":               { parcours: "affichages",   document: "note-rh" },
  /* registres */
  "SOC-REG-PERSONNEL":           { parcours: "registre",     document: "note-rh" },
  "SOC-REG-SECURITE":            { parcours: null,           document: null },
  "SOC-REG-DGI":                 { parcours: null,           document: "alerte" },
  /* négociations */
  "SOC-NEG-NAO":                 { parcours: "nao",          document: "accord-methode" },
  "SOC-NEG-EGALITE":             { parcours: "nao",          document: "accord-methode" },
  "SOC-NEG-PSE":                 { parcours: null,           document: null },
  /* santé-sécurité */
  "SOC-SST-SPST":                { parcours: null,           document: null },
  "SOC-SST-VIP":                 { parcours: null,           document: null },
  "SOC-SST-POSTES-RISQUES":      { parcours: "duerp",        document: null },
  "SOC-SST-FORMATION-SECU":      { parcours: "duerp",        document: null },
  /* formation et entretiens */
  "SOC-FOR-ENTRETIENS":          { parcours: "entretiens",   document: "note-rh" },
  "SOC-FOR-ADAPTATION":          { parcours: "entretiens",   document: "note-rh" },
  /* épargne et protection sociale */
  "SOC-EPA-PARTICIPATION":       { parcours: null,           document: null },
  "SOC-EPA-LIVRET":              { parcours: null,           document: "note-rh" },
  "SOC-EPA-SANTE":               { parcours: null,           document: null },
  "SOC-EPA-PREVOYANCE-CADRES":   { parcours: null,           document: null },
  "SOC-CCN-OBLIGATIONS":         { parcours: null,           document: null },
};

/* ─── la garde finale : aucun item ne cite un article non lu ─── */
for (const it of REF) {
  for (const n of it.articles) art(n);
  if (!CATEGORIES.includes(it.categorie))
    throw new Error(`référentiel social : catégorie inconnue « ${it.categorie} » (${it.id})`);
  /* La liaison de régularisation : elle doit être DÉCLARÉE pour chaque item,
     fût-ce à null. Un oubli n'est pas une absence de parcours — c'est un
     oubli, et il fait échouer le chargement. */
  if (!Object.prototype.hasOwnProperty.call(LIAISONS, it.id))
    throw new Error(`référentiel social : l'obligation ${it.id} n'a pas de liaison de régularisation déclarée (parcours et document, fût-ce à null).`);
  const L = LIAISONS[it.id];
  if (L.parcours && !PARCOURS_NOMS[L.parcours])
    throw new Error(`référentiel social : ${it.id} renvoie au parcours inconnu « ${L.parcours} ».`);
  it.regularisation = {
    parcours: L.parcours || null,
    parcoursNom: L.parcours ? PARCOURS_NOMS[L.parcours] : null,
    document: L.document || null,
  };
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

module.exports = { REF, CATEGORIES, TEXTES, lu, jol, fondement, parCategorie,
  LIAISONS, PARCOURS_NOMS };

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
      regularisation: it.regularisation || null,
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
      /* La régularisation : le parcours pas à pas qui conduit l'obligation
         jusqu'à sa validation, et la trame du document qu'il faut produire.
         Déclarés item par item dans le référentiel, vérifiés à la
         publication — jamais un lien vers ce qui n'existe pas. */
      regularisation: it.regularisation || null,
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

/* La carte d'UNE obligation, quel que soit son état.

   Le plan ne rend que ce qui appelle une action ; l'étape « régulariser
   élément par élément » a besoin de la carte complète d'un point choisi —
   fût-il sans réponse, fût-il déjà déclaré fait. C'est la même carte, faite
   de la même matière : rien n'est calculé ici qui ne le soit dans plan().

   Rend null si l'obligation n'existe pas, ou si le profil ne l'assujettit
   pas : on ne guide pas la régularisation d'une obligation qui n'est pas due. */
function action(p, id, dossier) {
  const it = R.REF.find(x => x.id === id);
  if (!it) return null;
  let a;
  try { a = it.condition(p); }
  catch (e) { return null; }
  if (a.du !== true) return null;
  const v = C.verdictItem(it, p, dossier || {});
  return {
    id: it.id, categorie: it.categorie, intitule: it.intitule,
    etat: v.etat, constat: v.motif, fondement: it.fondement,
    priorite: it.plan.priorite, niveau: NIVEAUX[it.plan.priorite],
    action: it.plan.action, etapes: it.plan.etapes, acteur: it.plan.acteur,
    delai: it.plan.delai, risque: it.plan.risque,
    modele: it.plan.modele || { page: null, nom: "modèle à établir" },
    modeleAdapte: MODELES[it.id] ? MODELES[it.id](p) : null,
    module: it.module || null,
    regularisation: it.regularisation || null,
    verifs: it.verifs || [],
  };
}

module.exports = { plan, action, NIVEAUX };

});

__def("./modeles-social.js", function(module, exports, require){
/* Les modèles du plan d'action — étage 3.

   LA RÈGLE DE CES MODÈLES, née d'un retour d'usage : une coquille n'est pas
   un livrable. Chaque modèle porte, dans le document lui-même :

   1. LA STRUCTURE INTÉGRALE — pour la BDESE, la liste complète des rubriques,
      sections et sujets dus à l'effectif déclaré, générée depuis le découpage
      des décrets réalisé par le module BDESE (donnees-modeles.json, jamais
      recopiée à la main) ; pour le règlement intérieur, le plan complet des
      clauses de L. 1321-1 à L. 1321-6 ; pour le registre unique, les colonnes
      exactes de L. 1221-13 et D. 1221-23 ; pour la CSSCT, la délibération
      entière avec les règles de L. 2315-38, L. 2315-39 et L. 2315-41 ; etc.
      Le renvoi au module dédié reste — EN NOTE DE FIN, jamais comme contenu.

   2. UN EXEMPLE FICTIF PRÉCIS ET CHIFFRÉ, adapté à l'effectif et au secteur
      déclarés : partout où il y aurait un blanc, une valeur plausible marquée
      « [exemple] » — noms fictifs, dates cohérentes avec la date d'audit,
      nombres réalistes pour l'effectif (membres de CSSCT, bénéficiaires de
      l'obligation d'emploi à 6 %, tranches de R. 2314-1…).

   3. LES CHAMPS À PERSONNALISER, listés à la fin du document.

   Ce qui n'a pas été lu à la source ne s'affirme pas : les valeurs issues de
   la convention collective ou de textes hors du champ du relais sont
   marquées « à compléter selon la convention » ou « à vérifier », jamais
   posées comme des règles.                                                  */

const DM = require("./donnees-modeles.json");

/* ── les briques ──────────────────────────────────────────────────────── */
const h = x => ({ t: "h", x });
const par = x => ({ t: "p", x });
const puce = x => ({ t: "puce", x });
const champ = x => ({ t: "champ", x });

const ex = v => v + " [exemple]";
const q = v => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v).trim() : null);
const effN = p => { const v = p.effectif;
  return typeof v === "number" && isFinite(v) ? v
    : (q(v) !== null && isFinite(+v) ? +v : null); };
const eff = p => { const n = effN(p); return n === null ? ex("120") : String(n); };
const nomE = p => q(p.entreprise) || ex("SOCIÉTÉ NOUVELLE DUMONT");
const ccn = p => q(p.conventionCollective) || "votre convention collective (à identifier)";

/* Les dates de l'exemple : cohérentes avec la date d'audit — à défaut, avec
   le jour où le modèle est produit. */
const jour0 = p => /^\d{4}-\d{2}-\d{2}$/.test(String(p.dateAudit || "")) ? p.dateAudit
  : new Date().toISOString().slice(0, 10);
const plusJours = (p, n) => {
  const [a, m, j] = jour0(p).split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10);
};

/* Le vocabulaire du secteur : les unités de travail et risques de l'exemple
   s'écrivent dans la langue de l'activité déclarée. Rien de juridique ici —
   c'est de l'illustration, marquée comme telle. */
function secteurProfil(p) {
  const s = String(p.secteur || "").toLowerCase();
  if (/transport|routier|logisti|messager/.test(s)) return { nom: "transport routier",
    unites: [["Conduite (personnels roulants)", "risque routier, manutention lors des chargements, troubles musculo-squelettiques, horaires atypiques", "entretien des véhicules, protocoles de chargement, organisation des tournées, prévention de la somnolence"],
      ["Quai et entrepôt", "circulation d'engins, chutes de plain-pied et de hauteur, écrasement, port de charges", "plan de circulation, engins vérifiés, équipements de protection, allées marquées"],
      ["Atelier mécanique", "outils et machines, produits (huiles, solvants), levage de véhicules", "habilitations, fiches de données de sécurité, ponts élévateurs vérifiés"],
      ["Services administratifs et exploitation", "travail sur écran, risques psychosociaux, sédentarité", "aménagement des postes, régulation de la charge, ergonomie"]] };
  if (/industri|usine|product|métallurg|plasturg|chimi/.test(s)) return { nom: "industrie",
    unites: [["Production", "machines, bruit, manutention, produits chimiques", "protecteurs de machines, protections auditives, aides à la manutention, fiches de données de sécurité"],
      ["Maintenance", "interventions sur équipements, travail en hauteur, énergies", "consignation, permis de travail, habilitations"],
      ["Logistique et magasin", "circulation d'engins, gestes répétitifs, chutes", "plan de circulation, rotation des tâches"],
      ["Services administratifs", "travail sur écran, risques psychosociaux", "aménagement des postes, régulation de la charge"]] };
  if (/btp|bâtiment|construction|travaux/.test(s)) return { nom: "bâtiment et travaux publics",
    unites: [["Chantiers", "chutes de hauteur, engins, ensevelissement, coactivité", "échafaudages vérifiés, plans de prévention, port des équipements"],
      ["Atelier et dépôt", "machines, manutention, produits", "protecteurs, stockages conformes"],
      ["Conduite d'engins et livraisons", "risque routier, renversement", "vérifications générales périodiques, formation des conducteurs"],
      ["Bureaux d'études et administratif", "travail sur écran, risques psychosociaux", "ergonomie, organisation du travail"]] };
  if (/commerce|vente|distribution|magasin/.test(s)) return { nom: "commerce",
    unites: [["Surface de vente", "manutention, chutes, contact clientèle (incivilités)", "aides à la manutention, sols entretenus, procédures d'alerte"],
      ["Réserve et réception", "circulation, port de charges, gerbeurs", "plan de circulation, formation aux engins"],
      ["Caisses et accueil", "gestes répétitifs, station assise ou debout prolongée, tensions clientèle", "rotation des postes, aménagement"],
      ["Services administratifs", "travail sur écran", "ergonomie des postes"]] };
  return { nom: q(p.secteur) || "services",
    unites: [["Exploitation / production de services", "charge mentale, déplacements professionnels, travail sur écran", "organisation de la charge, prévention du risque routier en mission"],
      ["Relation clientèle", "tensions et incivilités, amplitude horaire", "procédures d'alerte, régulation des plannings"],
      ["Fonctions support", "travail sur écran, sédentarité", "ergonomie, pauses visuelles"],
      ["Locaux et maintenance", "interventions techniques, produits d'entretien", "consignes, fiches de données de sécurité"]] };
}

/* La table de R. 2314-1 (module CSE) : titulaires et heures pour l'effectif. */
function r2314(p) {
  const n = effN(p); if (n === null) return null;
  const t = DM.r2314_1.tranches;
  for (const [min, max, tit, hres] of t) if (n >= min && n <= max) return { titulaires: tit, heures: hres };
  const dernier = t[t.length - 1];
  return n > dernier[1] ? { titulaires: dernier[2], heures: dernier[3] } : null;
}
/* La CSSCT : trois membres au minimum (L. 2315-39) ; l'exemple propose une
   taille plausible pour l'effectif — c'est l'accord qui fixera le nombre. */
const cssctMembres = p => { const n = effN(p) || 0;
  return n >= 2000 ? 8 : n >= 1000 ? 6 : n >= 500 ? 5 : n >= 300 ? 4 : 3; };

const entete = (p, objet) => [
  par(`${nomE(p)} — effectif déclaré : ${eff(p)} salarié(s)` +
    (q(p.secteur) ? ` — secteur : ${q(p.secteur)}` : "") +
    (q(p.conventionCollective) ? ` — convention : ${q(p.conventionCollective)}` : "")),
  par(`Objet : ${objet}. Établi le ${jour0(p)}.`),
  par("Trame complète avec exemple fictif : les valeurs marquées « [exemple] » sont plausibles pour votre profil, elles ne sont pas les vôtres — remplacez-les avant tout usage, et faites relire."),
];
const aPers = liste => [h("À personnaliser avant usage"),
  ...liste.map(x => puce(x))];
const noteFin = x => par("Pour aller plus loin : " + x);

/* ═══════════════════════════════════════════════════════ les modèles ══ */
const MODELES = {

  /* ─────────────────────────────────────────────── instances ─────────── */

  "SOC-INS-CSE": p => {
    const d = r2314(p);
    return {
    titre: "Note de lancement du processus électoral (CSE)",
    lignes: [...entete(p, "organisation des élections du comité social et économique"),
      h("1. Constat et fondement"),
      par(`L'effectif de ${nomE(p)} (${eff(p)} salariés) atteint le seuil de onze salariés pendant douze mois consécutifs : le comité social et économique doit être mis en place (L. 2311-2). L'information du personnel se fait par tout moyen conférant date certaine, et le premier tour se tient au plus tard le quatre-vingt-dixième jour suivant cette diffusion (L. 2314-4).`),
      d ? par(`Délégation à élire pour cet effectif, selon la table de l'article R. 2314-1 extraite par le module comité : ${d.titulaires} titulaires (et autant de suppléants), ${d.heures} heures de délégation mensuelles par titulaire — sous réserve du protocole d'accord préélectoral.`) : par("Délégation à élire : le nombre de titulaires et d'heures se lit dans la table de l'article R. 2314-1 — renseignez l'effectif pour qu'il se calcule."),
      h("2. Calendrier (exemple cohérent avec la date d'audit)"),
      puce(`Information du personnel de l'organisation des élections, avec la date envisagée du premier tour : le ${ex(plusJours(p, 7))}`),
      puce(`Information et invitation des organisations syndicales à négocier le protocole d'accord préélectoral et à établir leurs listes (L. 2314-5) : le ${ex(plusJours(p, 7))}`),
      puce(`Négociation du protocole d'accord préélectoral (collèges, répartition, modalités de vote) : réunions des ${ex(plusJours(p, 28))} et ${ex(plusJours(p, 42))}`),
      puce(`Dépôt des candidatures : au plus tard le ${ex(plusJours(p, 60))}`),
      puce(`Premier tour : le ${ex(plusJours(p, 75))} (au plus tard le quatre-vingt-dixième jour suivant l'information) — second tour éventuel : le ${ex(plusJours(p, 89))}`),
      puce(`Procès-verbaux établis et transmis ; procès-verbal de carence si aucun candidat ne s'est présenté aux deux tours`),
      h("3. Pilotage"),
      champ(`Pilote du processus : ${ex("Camille MARTIN, directrice des ressources humaines")} — appui juridique : ${ex("cabinet conseil habituel")}`),
      ...aPers(["Les dates du calendrier (l'exemple respecte la borne des 90 jours — recalez-les sur votre réalité)",
        "Le nom du pilote et des négociateurs du protocole",
        "Le nombre de sièges et d'heures si le protocole y déroge",
        "Les modalités de vote (urne, correspondance, électronique)"]),
      noteFin("l'audit complet du fonctionnement (réunions, budgets, consultations, parité) se fait dans le module « comité social et économique » (audit-cse.html).")],
  }; },

  "SOC-INS-CSE-ETAB": p => ({
    titre: "Trame d'accord sur les établissements distincts",
    lignes: [...entete(p, "détermination du nombre et du périmètre des établissements distincts (L. 2313-1)"),
      h("Article 1 — Nombre et périmètre des établissements distincts"),
      par(`Les parties conviennent que ${nomE(p)} comporte ${ex("trois")} établissements distincts, déterminés au regard de l'autonomie de gestion de leurs responsables, notamment en matière de gestion du personnel :`),
      puce(ex("Établissement de Villeneuve-Nord — siège, exploitation et services support — 4 100 salariés")),
      puce(ex("Établissement de Genlis-Sud — agences régionales groupées — 2 300 salariés")),
      puce(ex("Établissement de Roncq-Est — ateliers et plateformes — 1 109 salariés")),
      h("Article 2 — Représentation du personnel"),
      par("Un comité social et économique d'établissement est élu dans chacun des établissements définis à l'article 1. Un comité social et économique central d'entreprise est constitué au niveau de l'entreprise (L. 2313-1) ; la répartition des sièges entre établissements figure en annexe."),
      h("Article 3 — Durée, révision, dépôt"),
      par(`Le présent accord est conclu pour une durée ${ex("indéterminée")}. Il est déposé dans les conditions légales et tenu à la disposition du personnel.`),
      champ(`Signataires : la direction (${ex("Dominique BERNARD, directeur général")}) et les organisations syndicales représentatives — le ${ex(plusJours(p, 30))}`),
      ...aPers(["Le nombre, le nom et le périmètre réels des établissements — c'est l'autonomie de gestion qui les définit, pas la géographie seule",
        "Les effectifs par établissement et la répartition des sièges",
        "La durée de l'accord et les modalités de révision"]),
      noteFin("l'architecture élue (comités d'établissement, comité central, représentants de proximité) s'audite dans le module « comité social et économique ».")],
  }),

  "SOC-INS-CSSCT": p => {
    const m = cssctMembres(p);
    return {
    titre: "Délibération et trame d'accord : création de la CSSCT",
    lignes: [...entete(p, "création de la commission santé, sécurité et conditions de travail (L. 2315-36)"),
      h("1. Le cadre légal, lu à la source"),
      puce("Création obligatoire : entreprises et établissements distincts d'au moins trois cents salariés, et établissements à hauts risques quel que soit l'effectif (L. 2315-36)."),
      puce("Présidence : l'employeur ou son représentant. Composition : au minimum trois membres représentants du personnel, dont au moins un représentant du second collège (ou du troisième le cas échéant), désignés par le comité parmi ses membres, par résolution, pour une durée qui prend fin avec celle du mandat des élus (L. 2315-39)."),
      puce("Attributions : par délégation du comité, tout ou partie de ses attributions relatives à la santé, à la sécurité et aux conditions de travail — à l'exception du recours à un expert et des attributions consultatives (L. 2315-38)."),
      puce("L'accord d'entreprise fixe : le nombre de membres, les missions déléguées et leurs modalités d'exercice, les modalités de fonctionnement dont le nombre d'heures de délégation, les modalités de formation, et le cas échéant les moyens alloués (L. 2315-41)."),
      h("2. Trame d'accord (exemple chiffré pour l'effectif déclaré)"),
      puce(`Article 1 — Nombre de membres : ${ex(String(m))} représentants du personnel, dont au moins un du second collège (minimum légal : trois).`),
      puce(`Article 2 — Missions déléguées : ${ex("analyse des risques, inspections trimestrielles, enquêtes après accident, préparation des consultations santé-sécurité du comité")} — hors expertise et consultations, que la loi réserve au comité.`),
      puce(`Article 3 — Fonctionnement : ${ex("quatre réunions par an au moins, présidées par l'employeur")} ; heures de délégation spécifiques : ${ex("10 heures par mois et par membre")}.`),
      puce(`Article 4 — Formation des membres : dans les conditions des articles L. 2315-16 à L. 2315-18 (renvoi de L. 2315-41, 4°).`),
      puce(`Article 5 — Moyens : ${ex("local, documentation, temps de secrétariat")}.`),
      h("3. Délibération de désignation (à prendre en réunion du comité)"),
      par(`« Le comité social et économique de ${nomE(p)}, réuni le ${ex(plusJours(p, 21))}, désigne par résolution comme membres de la commission santé, sécurité et conditions de travail : ${ex("Sacha LEROY (2e collège), Camille MARTIN, Dominique BERNARD, Andrea COSTA")} — pour une durée prenant fin avec le mandat en cours. »`),
      ...aPers(["Le nombre de membres et les noms des désignés (l'exemple propose " + m + " membres pour votre effectif — c'est l'accord qui décide)",
        "Les missions réellement déléguées, les heures et le nombre de réunions",
        "La date de la réunion de désignation"]),
      noteFin("la composition, les modalités et la formation des membres s'auditent en détail dans le module « santé, sécurité et conditions de travail » (audit-sst.html).")],
  }; },

  "SOC-INS-COMMISSIONS": p => {
    const n = effN(p);
    const membres = k => (n === null ? k : Math.max(3, Math.min(k + 2, Math.round(k + n / 900))));
    return {
    titre: "Délibération de constitution des commissions du comité (régime supplétif)",
    lignes: [...entete(p, "constitution des commissions supplétives du comité : formation, information et aide au logement, égalité professionnelle"),
      h("0. À lire avant tout : ces commissions ne jouent qu'À DÉFAUT D'ACCORD"),
      par("Un accord d'entreprise conclu dans les conditions du premier alinéa de l'article L. 2232-12 peut prévoir la création de commissions supplémentaires pour l'examen de problèmes particuliers (L. 2315-45). Les commissions ci-dessous sont le RÉGIME SUPPLÉTIF : elles s'imposent « en l'absence d'accord prévu à l'article L. 2315-45 ». Première vérification, donc : existe-t-il un accord qui organise les commissions ? S'il existe, c'est lui qui commande, et cette délibération se réécrit sur son plan."),
      puce("Commission de la formation — à défaut d'accord, dans les entreprises d'au moins trois cents salariés (L. 2315-49)."),
      puce("Commission d'information et d'aide au logement — à défaut d'accord, dans les entreprises d'au moins trois cents salariés ; les entreprises de moins de trois cents salariés peuvent se grouper pour la former (L. 2315-50)."),
      puce("Commission de l'égalité professionnelle — à défaut d'accord, dans les entreprises d'au moins trois cents salariés (L. 2315-56)."),
      puce("Les rapports des commissions sont soumis à la délibération du comité ; l'employeur peut leur adjoindre, avec voix consultative, des experts et techniciens de l'entreprise choisis hors du comité, tenus au secret professionnel et à l'obligation de discrétion (L. 2315-45)."),
      h("1. Délibération — préambule (à porter au procès-verbal)"),
      par(`« Le comité social et économique de ${nomE(p)} (${eff(p)} salariés), réuni le ${ex(plusJours(p, 21))} sous la présidence de ${ex("Dominique BERNARD, directeur général")}, constate qu'aucun accord d'entreprise au sens de l'article L. 2315-45 n'organise ses commissions${n !== null && n >= 1000 ? " — l'effectif appelant en outre une commission économique, objet d'une délibération distincte (L. 2315-46)" : ""}. En conséquence, il constitue les commissions ci-après, pour une durée prenant fin avec les mandats en cours. »`),
      h("2. Commission de la formation (L. 2315-49)"),
      par(`« Il est constitué une commission de la formation, composée de ${ex(String(membres(5)) + " membres")}, dont ${ex("Sacha LEROY, rapporteur")}. Elle est chargée : 1° de préparer les délibérations du comité prévues aux 1° et 3° de l'article L. 2312-17 dans les domaines qui relèvent de sa compétence ; 2° d'étudier les moyens permettant de favoriser l'expression des salariés en matière de formation et de participer à leur information dans ce domaine ; 3° d'étudier les problèmes spécifiques concernant l'emploi et le travail des jeunes et des travailleurs handicapés. Réunions : ${ex("deux par an, avant chaque consultation concernée — les " + plusJours(p, 60) + " et " + plusJours(p, 240))}. »`),
      h("3. Commission d'information et d'aide au logement (L. 2315-50, L. 2315-51)"),
      par(`« Il est constitué une commission d'information et d'aide au logement, composée de ${ex(String(membres(3)) + " membres")}, dont ${ex("Andrea COSTA, rapporteure")}. Elle facilite le logement et l'accession des salariés à la propriété et à la location de locaux d'habitation. À cet effet : 1° elle recherche les possibilités d'offre de logements correspondant aux besoins du personnel, en liaison avec les organismes habilités à collecter la participation des employeurs à l'effort de construction ; 2° elle informe les salariés sur leurs conditions d'accès à la propriété ou à la location et les assiste dans les démarches d'obtention des aides financières auxquelles ils peuvent prétendre. Réunions : ${ex("deux par an ; compte rendu annuel au comité")}. »`),
      h("4. Commission de l'égalité professionnelle (L. 2315-56)"),
      par(`« Il est constitué une commission de l'égalité professionnelle, composée de ${ex(String(membres(4)) + " membres")}, dont ${ex("Camille MARTIN, rapporteure")}. Elle est notamment chargée de préparer les délibérations du comité prévues au 3° de l'article L. 2312-17, dans les domaines qui relèvent de sa compétence. Elle travaille à partir des données de la base de données économiques, sociales et environnementales (rubrique égalité professionnelle) et de l'index publié. Réunions : ${ex("deux par an, dont une avant la consultation sur la politique sociale")}. »`),
      h("5. Moyens et fonctionnement communs (exemple)"),
      puce(`Temps de réunion : ${ex("payé comme temps de travail, non imputé sur les heures de délégation")} — à caler sur les règles applicables et sur votre accord éventuel.`),
      puce(`Accès aux informations : ${ex("rubriques utiles de la BDESE ouvertes en lecture aux membres de chaque commission")}.`),
      puce(`Experts et techniciens adjoints avec voix consultative (L. 2315-45) : ${ex("le responsable formation pour la commission formation, le contrôleur de gestion sociale pour l'égalité")} — soumis au secret professionnel et à l'obligation de discrétion.`),
      puce(`Rapports : chaque commission remet un rapport soumis à la délibération du comité — calendrier : ${ex("rapport formation en " + plusJours(p, 75).slice(0, 7) + ", rapport égalité en " + plusJours(p, 200).slice(0, 7))}.`),
      h("6. Cas des entreprises de moins de trois cents salariés"),
      par("Elles ne sont pas tenues par ce régime supplétif ; l'article L. 2315-50 leur ouvre en revanche la possibilité de se grouper entre elles pour former la commission d'information et d'aide au logement — une piste utile aux petits effectifs sur un même bassin."),
      ...aPers(["L'existence (ou non) d'un accord L. 2315-45 : c'est la première question, et elle change tout",
        "Le nombre de membres et les noms, commission par commission",
        "Le rythme de réunions, les moyens et les experts adjoints",
        "Les dates de délibération et de remise des rapports"]),
      noteFin("le fonctionnement complet du comité et de ses commissions (heures, budgets, consultations préparées par les commissions) s'audite dans le module « comité social et économique ».")],
  }; },

  "SOC-INS-COMMISSION-ECO": p => ({
    titre: "Délibération de constitution de la commission économique (1 000 salariés)",
    lignes: [...entete(p, "création de la commission économique du comité, à défaut d'accord (L. 2315-46)"),
      h("1. Le cadre, lu à la source"),
      puce("En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins mille salariés, une commission économique est créée au sein du comité social et économique OU du comité social et économique central (L. 2315-46)."),
      puce("Elle est chargée notamment d'étudier les documents économiques et financiers recueillis par le comité et toute question que ce dernier lui soumet (L. 2315-46)."),
      puce("Première vérification : un accord d'entreprise organise-t-il déjà les commissions (L. 2315-45) ? S'il existe, il commande — cette délibération ne vaut qu'à défaut."),
      h("2. Choisir le niveau : comité unique ou comité central"),
      par(`${nomE(p)} déclare ${eff(p)} salariés. Dans une entreprise à établissements distincts, la commission économique se constitue au niveau du comité central — c'est là que remontent les documents économiques et financiers consolidés ; dans une entreprise à comité unique, au niveau de ce comité. Niveau retenu dans l'exemple : ${ex("comité social et économique central")}.`),
      h("3. Délibération (à porter au procès-verbal)"),
      par(`« Le comité social et économique ${ex("central")} de ${nomE(p)}, réuni le ${ex(plusJours(p, 28))}, constate qu'aucun accord au sens de l'article L. 2315-45 n'organise ses commissions et que l'effectif de l'entreprise atteint mille salariés. En conséquence, il crée en son sein une commission économique, composée de ${ex("cinq membres")} : ${ex("Sacha LEROY (rapporteur), Camille MARTIN, Dominique BERNARD, Andrea COSTA, Paul DURAND")}. La commission étudie les documents économiques et financiers recueillis par le comité et toute question que celui-ci lui soumet. Elle rend compte au comité par un rapport soumis à sa délibération. Durée : celle des mandats en cours. »`),
      h("4. Programme de travail (exemple chiffré)"),
      puce(`Réunions : ${ex("deux par an au moins — les " + plusJours(p, 45) + " et " + plusJours(p, 225))}, dont une en préparation de la consultation sur la situation économique et financière.`),
      puce(`Documents étudiés : ${ex("comptes annuels et rapport de gestion, comptes prévisionnels, situation de trésorerie, rubriques financières de la BDESE, documents remis à l'expert-comptable du comité")}.`),
      puce(`Experts et techniciens adjoints avec voix consultative (L. 2315-45) : ${ex("le directeur administratif et financier, invité sur les points de méthode")} — secret professionnel et obligation de discrétion applicables.`),
      puce(`Questions soumises par le comité : ${ex("effets du plan d'investissement sur l'emploi, structure de l'endettement, comparaison des marges par établissement")}.`),
      h("5. Articulation"),
      puce("Avec la BDESE : la commission travaille d'abord sur les rubriques financières de la base — vérifiez qu'elles sont alimentées avant la première réunion."),
      puce("Avec l'expertise comptable du comité : la commission prépare et exploite, elle ne remplace pas le recours à l'expert lorsque le comité le décide."),
      ...aPers(["L'existence d'un accord L. 2315-45, qui écarte ce régime supplétif",
        "Le niveau retenu (comité unique ou comité central) et les noms des membres",
        "Le calendrier des réunions et la liste des documents réellement remis"]),
      noteFin("les consultations économiques du comité, leurs délais et l'expertise s'auditent dans le module « comité social et économique ».")],
  }),

  "SOC-INS-COMMISSION-MARCHES": p => ({
    titre: "Commission des marchés du comité : délibération et procédure d'achat",
    lignes: [...entete(p, "création de la commission des marchés au sein du comité (L. 2315-44-1, D. 2315-29)"),
      h("1. Le critère : les comptes du comité, pas l'effectif de l'entreprise"),
      puce("Une commission des marchés est créée au sein du comité social et économique qui dépasse, pour au moins deux des trois critères mentionnés au II de l'article L. 2315-64, des seuils fixés par décret (L. 2315-44-1)."),
      puce("Ces seuils sont : 1° le nombre de cinquante salariés du comité à la clôture d'un exercice ; 2° le montant de ressources annuelles prévu au 2° de l'article R. 612-1 du code de commerce, ressources définies à l'article D. 2315-34 ; 3° le montant du total du bilan prévu au 3° de l'article R. 612-1 du code de commerce (D. 2315-29)."),
      puce("Le seuil mentionné à l'article L. 2315-44-2 — celui à partir duquel un marché passe par la commission — est fixé à 30 000 euros (D. 2315-29, dernier alinéa)."),
      puce(`Conséquence pratique : l'effectif de l'entreprise (${eff(p)} salariés ici) n'entre pas dans le test. Ce sont les comptes du comité qui décident — le trésorier et l'expert-comptable du comité les tiennent.`),
      h("2. Le test, à faire à chaque clôture des comptes du comité (exemple chiffré)"),
      puce(`Critère 1 — salariés du comité à la clôture de l'exercice ${ex(String(Number(jour0(p).slice(0, 4)) - 1))} : ${ex("6 salariés — seuil de cinquante NON dépassé")}.`),
      puce(`Critère 2 — ressources annuelles (D. 2315-34) : ${ex("1 920 000 € — seuil du 2° de R. 612-1 du code de commerce dépassé (montant à reprendre du texte en vigueur : il n'a pas été vérifié au relais, R. 612-1 relevant du code de commerce)")}.`),
      puce(`Critère 3 — total du bilan du comité : ${ex("2 400 000 € — seuil du 3° de R. 612-1 dépassé")}.`),
      puce(`Résultat de l'exemple : deux des trois critères dépassés → la commission des marchés est due. Deux suffisent : ce n'est pas un cumul des trois.`),
      h("3. Délibération de constitution (à porter au procès-verbal du comité)"),
      par(`« Le comité social et économique de ${nomE(p)}, réuni le ${ex(plusJours(p, 30))}, constate qu'il dépasse, pour au moins deux des trois critères de l'article D. 2315-29, les seuils réglementaires. En conséquence, il crée en son sein une commission des marchés, composée de ${ex("trois membres : Andrea COSTA (trésorière, rapporteure), Sacha LEROY, Paul DURAND")}. La commission choisit les fournisseurs et prestataires du comité pour les marchés dont le montant dépasse 30 000 euros, et rend compte au comité. Durée : celle des mandats en cours. »`),
      h("4. Procédure d'achat au-delà de 30 000 euros (exemple)"),
      puce(`Expression du besoin et cahier des charges par le comité : ${ex("prestation de voyages et séjours, budget prévisionnel 145 000 €")}.`),
      puce(`Consultation d'au moins ${ex("trois")} prestataires ; ouverture et analyse des offres par la commission le ${ex(plusJours(p, 60))} — critères de choix arrêtés à l'avance et écrits.`),
      puce(`Choix motivé, porté à la délibération du comité, et rapport annuel de la commission joint aux comptes du comité.`),
      puce("Conflits d'intérêts : chaque membre déclare les liens éventuels avec les candidats — la déclaration est consignée."),
      h("5. Qui fait quoi"),
      par("La commission est une obligation DU COMITÉ : c'est lui qui la crée et la fait fonctionner. L'employeur n'en est pas le maître d'œuvre — mais il a intérêt à signaler l'obligation par écrit au comité, car des marchés passés hors procédure fragilisent la gestion des activités sociales et culturelles et alimentent les contentieux internes."),
      ...aPers(["Les chiffres réels des comptes du comité (les trois critères se testent sur eux)",
        "Les montants des seuils du 2° et du 3° de R. 612-1 du code de commerce, à reprendre du texte en vigueur — non vérifiés ici, ce code n'étant pas servi par le relais",
        "Les membres de la commission et les critères de choix des fournisseurs",
        "La procédure interne d'achat et son seuil de déclenchement (30 000 euros au plus tard)"]),
      noteFin("les comptes du comité, leur certification et leur présentation s'auditent dans le module « comité social et économique ».")],
  }),

  "SOC-INS-FORMATION-ELUS": p => {
    const n = effN(p);
    const d = r2314(p);
    const titulaires = d ? d.titulaires : null;
    const benef = titulaires !== null ? titulaires * 2 + 1 : null; /* titulaires + suppléants + référent */
    const cout = benef !== null ? benef * 5 * 400 : null;
    return {
    titre: "Formation santé-sécurité des élus : programmation et budget",
    lignes: [...entete(p, "formation en santé, sécurité et conditions de travail des membres du comité et du référent (L. 2315-18, L. 2315-16)"),
      h("1. Ce que la loi impose, lu à la source"),
      puce("Les membres de la délégation du personnel du comité social et économique ET le référent prévu au dernier alinéa de l'article L. 2314-1 (référent harcèlement du comité) bénéficient de la formation nécessaire à l'exercice de leurs missions en matière de santé, de sécurité et de conditions de travail (L. 2315-18)."),
      puce("Durée minimale : CINQ JOURS lors du premier mandat des membres de la délégation du personnel."),
      puce("En cas de renouvellement du mandat, durée minimale : trois jours pour chaque membre, quelle que soit la taille de l'entreprise ; CINQ jours pour les membres de la commission santé, sécurité et conditions de travail dans les entreprises d'au moins trois cents salariés (L. 2315-18, 1° et 2°)."),
      puce("Le financement de cette formation est pris en charge par l'employeur, dans des conditions prévues par décret en Conseil d'État (L. 2315-18, dernier alinéa)."),
      puce("Le temps consacré aux formations est pris sur le temps de travail et rémunéré comme tel ; il n'est pas déduit des heures de délégation (L. 2315-16)."),
      puce("À retenir : l'obligation naît avec le comité — donc dès onze salariés, et non à trois cents. Le seuil de trois cents ne joue que sur la durée du renouvellement des membres de la CSSCT."),
      h("2. Recensement des bénéficiaires (chiffré pour l'effectif déclaré)"),
      titulaires !== null
        ? puce(`Pour ${eff(p)} salariés, la table de l'article R. 2314-1 (extraite par le module comité) donne ${titulaires} titulaires — et autant de suppléants : ${ex(String(titulaires * 2) + " élus")}, plus le référent harcèlement désigné par le comité, soit ${ex(String(benef) + " personnes à former")}.`)
        : puce("Le nombre d'élus se lit dans la table de l'article R. 2314-1 : renseignez l'effectif pour qu'il se calcule — la formation vise tous les membres de la délégation du personnel et le référent du comité."),
      puce(`Répartition premiers mandats / renouvellements : ${ex(benef !== null ? String(Math.ceil(benef * 0.6)) + " premiers mandats (5 jours) et " + String(benef - Math.ceil(benef * 0.6)) + " renouvellements (3 jours, 5 pour les membres de la CSSCT à partir de trois cents salariés)" : "à établir élu par élu")}.`),
      h("3. Programmation (exemple daté)"),
      puce(`Choix de l'organisme : ${ex("organisme agréé retenu après consultation de trois offres, décision le " + plusJours(p, 20))}.`),
      puce(`Session 1 — premiers mandats, cinq jours : ${ex("du " + plusJours(p, 45) + " au " + plusJours(p, 49))}.`),
      puce(`Session 2 — renouvellements, trois jours : ${ex("du " + plusJours(p, 75) + " au " + plusJours(p, 77))}.`),
      n !== null && n >= 300 ? puce(`Session 3 — membres de la CSSCT en renouvellement, cinq jours (entreprise d'au moins trois cents salariés) : ${ex("du " + plusJours(p, 100) + " au " + plusJours(p, 104))}.`) : puce("Session CSSCT : sans objet sous trois cents salariés — la durée de cinq jours au renouvellement ne vise que les membres de la CSSCT des entreprises d'au moins trois cents salariés."),
      puce(`Convocations envoyées aux élus et au référent, ordre du jour du comité mentionnant la programmation : le ${ex(plusJours(p, 25))}.`),
      h("4. Budget (exemple chiffré — coûts indicatifs à remplacer par vos devis)"),
      puce(cout !== null
        ? `Coût pédagogique : ${ex(String(benef) + " personnes × 5 jours × 400 € = " + cout.toLocaleString("fr-FR") + " €")} — hypothèse haute (tous en premier mandat).`
        : `Coût pédagogique : ${ex("nombre de bénéficiaires × durée × prix journée de l'organisme")}.`),
      puce(`Frais annexes : ${ex("déplacements et repas, 120 € par personne et par session")}.`),
      puce(`Maintien de salaire pendant la formation : ${ex("temps payé comme temps de travail, sans imputation sur les heures de délégation (L. 2315-16) — à provisionner en masse salariale, pas en budget formation")}.`),
      puce("Prise en charge : le financement de la formation santé-sécurité incombe à l'employeur (L. 2315-18) ; les modalités relèvent d'un décret en Conseil d'État, non vérifié ici — faites confirmer le circuit de facturation avant engagement."),
      h("5. Traces à conserver"),
      puce(`Convocations, attestations de présence et attestations de fin de formation, par élu : ${ex("archivées au dossier du comité et au SIRH")}.`),
      puce(`Mention au procès-verbal du comité de la programmation et de sa réalisation : ${ex("réunions des " + plusJours(p, 25) + " et " + plusJours(p, 110))}.`),
      ...aPers(["La liste nominative réelle des élus (titulaires ET suppléants) et du référent du comité",
        "Le partage premiers mandats / renouvellements, qui commande les durées",
        "L'organisme retenu et le prix réel de la journée (l'exemple retient 400 €, à remplacer par vos devis)",
        "Les dates de sessions, compatibles avec l'activité"]),
      noteFin("la formation des élus, ses conditions et le contentieux de la prise en charge s'auditent dans le module « comité social et économique ».")],
  }; },

  "SOC-INS-REUNIONS-SST": p => {
    const an = Number(jour0(p).slice(0, 4));
    return {
    titre: "Calendrier annuel des réunions santé-sécurité du comité et courriers d'information",
    lignes: [...entete(p, "quatre réunions annuelles au moins portant sur la santé, la sécurité et les conditions de travail (L. 2315-27)"),
      h("1. La règle, lue à la source"),
      puce("Au moins quatre réunions du comité portent annuellement, en tout ou partie, sur ses attributions en matière de santé, sécurité et conditions de travail — plus fréquemment en cas de besoin, notamment dans les branches d'activité présentant des risques particuliers."),
      puce("Le comité est en outre réuni à la suite de tout accident ayant entraîné ou ayant pu entraîner des conséquences graves, en cas d'événement grave lié à l'activité ayant porté ou pu porter atteinte à la santé publique ou à l'environnement, ou à la demande motivée de deux de ses membres représentants du personnel sur ces sujets."),
      puce("Lorsque l'employeur est défaillant, et à la demande d'au moins la moitié des membres du comité, celui-ci peut être convoqué par l'agent de contrôle de l'inspection du travail et siéger sous sa présidence."),
      puce("L'employeur INFORME ANNUELLEMENT l'agent de contrôle de l'inspection du travail, le médecin du travail et l'agent des services de prévention des organismes de sécurité sociale du calendrier retenu pour ces réunions, et leur CONFIRME PAR ÉCRIT chaque réunion au moins quinze jours à l'avance."),
      puce("Ces quatre réunions ne s'ajoutent pas aux réunions du comité : ce sont des réunions du comité dont l'ordre du jour porte, en tout ou partie, sur la santé et la sécurité."),
      h("2. Calendrier annuel " + an + " (exemple daté)"),
      puce(`Réunion 1 — ${ex(plusJours(p, 20))} : bilan annuel de la situation générale de santé-sécurité et programme annuel de prévention ; suites du document unique.`),
      puce(`Réunion 2 — ${ex(plusJours(p, 110))} : inspections trimestrielles et suites, accidents et presque-accidents du trimestre, plan d'actions.`),
      puce(`Réunion 3 — ${ex(plusJours(p, 200))} : rapport annuel du médecin du travail et fiche d'entreprise, suivi des postes à risques particuliers.`),
      puce(`Réunion 4 — ${ex(plusJours(p, 290))} : bilan des actions de l'année, priorités de l'année suivante, révision du document unique.`),
      puce(`Réunions supplémentaires prévisibles : ${ex("une réunion après tout accident grave, sous 48 heures ; réunion exceptionnelle sur demande motivée de deux élus")}.`),
      h("3. Courrier annuel d'information (trame)"),
      par(`« À l'agent de contrôle de l'inspection du travail — unité de contrôle ${ex("n° 3")} ; au médecin du travail, ${ex("service AST Prévention")} ; à l'agent des services de prévention de ${ex("la CARSAT")}. Madame, Monsieur, en application de l'article L. 2315-27 du code du travail, ${nomE(p)} (${eff(p)} salariés) vous communique le calendrier des réunions du comité social et économique consacrées, en tout ou partie, aux sujets relevant de la santé, de la sécurité et des conditions de travail pour l'année ${ex(String(an))} : ${ex(plusJours(p, 20) + ", " + plusJours(p, 110) + ", " + plusJours(p, 200) + " et " + plusJours(p, 290))}. Chacune de ces réunions vous sera confirmée par écrit au moins quinze jours à l'avance. Vous êtes invités à y assister. ${ex("Camille MARTIN, directrice des ressources humaines")}, le ${ex(plusJours(p, 5))}. »`),
      h("4. Courrier de confirmation à J-15 (trame)"),
      par(`« Madame, Monsieur, conformément à l'article L. 2315-27, nous vous confirmons la tenue de la réunion du comité social et économique consacrée aux sujets de santé, de sécurité et de conditions de travail, le ${ex(plusJours(p, 20))} à ${ex("14 heures")}, ${ex("salle du conseil, siège de Villeneuve-Nord")}. Ordre du jour joint. ${ex("Camille MARTIN")}, le ${ex(plusJours(p, 5))}. »`),
      h("5. Tenue de la preuve"),
      puce(`Registre des envois : ${ex("courriels avec accusé de réception, archivés au dossier du comité")} — l'information annuelle et chaque confirmation à J-15 doivent pouvoir être produites.`),
      puce(`Ordres du jour et procès-verbaux mentionnant explicitement les points santé-sécurité : ${ex("mention « point santé, sécurité et conditions de travail » en tête d'ordre du jour")} — c'est ce qui prouve que quatre réunions y ont porté.`),
      ...aPers(["Les quatre dates réelles, calées sur le rythme de vos réunions",
        "Les destinataires exacts (unité de contrôle, service de prévention et de santé au travail, organisme de sécurité sociale compétent)",
        "Les ordres du jour et le circuit d'archivage des envois"]),
      noteFin("le nombre total de réunions dues, les délais de consultation et les ordres du jour s'auditent dans le module « comité social et économique » (contrôles CSE-CTL-CON-05 et CSE-CTL-CON-06).")],
  }; },

  "SOC-INS-GROUPE": p => ({
    titre: "Courrier à l'entreprise dominante : constitution du comité de groupe",
    lignes: [...entete(p, "constitution du comité de groupe (L. 2331-1)"),
      par(`À l'attention de la direction de ${ex("HOLDING RTH PARTICIPATIONS")}, entreprise dominante du groupe.`),
      par(`Madame, Monsieur,`),
      par(`${nomE(p)} appartient au périmètre du groupe formé par votre société et les entreprises qu'elle contrôle. L'article L. 2331-1 du code du travail impose la constitution d'un comité de groupe au sein du groupe formé par l'entreprise dominante, dont le siège social est situé sur le territoire français, et les entreprises qu'elle contrôle au sens des articles L. 233-1, L. 233-3 (I et II) et L. 233-16 du code de commerce — le contrôle s'étendant, sous conditions, à la détention d'au moins 10 % du capital lorsque la permanence et l'importance des relations établissent l'appartenance à un même ensemble économique.`),
      par(`À notre connaissance, aucun comité de groupe n'est constitué. Nous vous demandons soit d'engager sa constitution — désignation des entreprises du périmètre, répartition des sièges, première réunion —, soit de nous confirmer, motifs à l'appui, que le périmètre n'y entre pas.`),
      par(`Nous restons à votre disposition pour communiquer les effectifs (${eff(p)} salariés pour notre société au ${jour0(p)}) et les éléments utiles.`),
      champ(`Signataire : ${ex("Dominique BERNARD, directeur général")} — copie : ${ex("directions des filiales du périmètre")} — le ${ex(plusJours(p, 7))}`),
      ...aPers(["Le nom réel de l'entreprise dominante et la liste des sociétés du périmètre",
        "Le signataire et les destinataires en copie",
        "Les effectifs à jour de chaque société"]),
      noteFin("le fonctionnement du comité de groupe une fois constitué (composition, réunions, information) relève des articles L. 2332-1 et suivants — non vérifiés ici : faites-les vérifier avant de rédiger le règlement de l'instance.")],
  }),

  "SOC-INS-REF-HARCELEMENT": p => ({
    titre: "Note de désignation du référent harcèlement sexuel",
    lignes: [...entete(p, "désignation du référent chargé de la lutte contre le harcèlement sexuel et les agissements sexistes (L. 1153-5-1)"),
      h("1. Désignation"),
      par(`L'effectif de ${nomE(p)} (${eff(p)} salariés) atteint deux cent cinquante salariés : un référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes est désigné (L. 1153-5-1).`),
      par(`Est désignée : ${ex("Camille MARTIN, responsable des ressources humaines")} — coordonnées : ${ex("poste 4312, referent-harcelement@societe-exemple.fr, bureau 2.14")}. Suppléance en son absence : ${ex("Sacha LEROY, juriste social")}.`),
      h("2. Missions (telles que la loi les nomme)"),
      puce("Orienter les salariés : vers qui se tourner, en interne et en externe."),
      puce("Informer : textes applicables, actions ouvertes, coordonnées des autorités et services compétents."),
      puce("Accompagner : recueillir la parole, orienter vers la procédure de signalement, suivre les suites."),
      h("3. Diffusion et articulation"),
      puce(`Diffusion de la présente note et des coordonnées à l'ensemble du personnel : ${ex("affichage aux emplacements habituels, intranet, livret d'accueil")} — le ${ex(plusJours(p, 3))}.`),
      puce("Articulation avec le référent désigné par le comité social et économique parmi ses membres, et avec l'information harcèlement affichée (voir le modèle d'affiche du présent plan)."),
      puce(`Formation du référent : ${ex("une journée dédiée, programmée le " + plusJours(p, 45))}.`),
      ...aPers(["Le nom, la fonction et les coordonnées réelles du référent (et de son suppléant)",
        "Les canaux de diffusion effectifs et leur date",
        "La date de formation du référent"]),
      noteFin("les référents, l'information et la réaction au signalement s'auditent dans le module « santé, sécurité et conditions de travail ».")],
  }),

  /* ────────────────────────────────────── documents obligatoires ─────── */

  "SOC-DOC-RI": p => ({
    titre: "Plan complet de règlement intérieur, clause par clause",
    lignes: [...entete(p, "établissement du règlement intérieur (L. 1311-2, L. 1321-1 et suivants)"),
      h("Préambule et champ d'application"),
      par(`Le présent règlement s'applique à l'ensemble des salariés de ${nomE(p)}, en quelque lieu qu'ils travaillent, ainsi qu'aux intérimaires et stagiaires pour les règles de santé, sécurité et discipline générale. Il est rédigé en français (L. 1321-6) ; des dispositions spéciales peuvent viser une catégorie de personnel ou une division (L. 1311-2, dernier alinéa) — ${ex("titre IV propre aux personnels roulants")}.`),
      h("Titre I — Santé et sécurité (L. 1321-1, 1°)"),
      puce(`Mesures d'application de la réglementation santé-sécurité dans l'entreprise, dont les instructions données aux salariés (renvoi de L. 1321-1 à L. 4122-1) : ${ex("port des équipements de protection fournis, respect du plan de circulation, interdiction de neutraliser un dispositif de sécurité, obligation de signaler toute défaillance")}.`),
      puce(`Consignes propres à l'activité (${secteurProfil(p).nom}) : ${ex(secteurProfil(p).unites[0][2])}.`),
      puce("Visites médicales et suivi de l'état de santé : obligation de s'y présenter."),
      h("Titre II — Participation au rétablissement de conditions de travail protectrices (L. 1321-1, 2°)"),
      par("Conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices de la santé et de la sécurité, dès lors qu'elles apparaîtraient compromises."),
      h("Titre III — Discipline (L. 1321-1, 3°)"),
      puce("Règles générales et permanentes de discipline : horaires, accès aux locaux, usage du matériel et des outils numériques, absences et justification."),
      puce(`Nature et échelle des sanctions : ${ex("avertissement ; mise à pied disciplinaire de trois jours au plus ; mutation disciplinaire ; rétrogradation ; licenciement pour faute")}. L'échelle est limitative : aucune sanction non prévue ne peut être prononcée ; aucune amende ni sanction pécuniaire.`),
      h("Titre IV — Droits de la défense (L. 1321-2, 1°)"),
      par("Rappel des dispositions relatives aux droits de la défense des salariés (articles L. 1332-1 à L. 1332-3 : information écrite des griefs, entretien préalable pour toute sanction ayant une incidence sur la présence, la fonction, la carrière ou la rémunération, notification motivée) ou des garanties de la convention collective applicable — " + `${ccn(p)} : à compléter selon la convention.`),
      h("Titre V — Harcèlements et agissements sexistes (L. 1321-2, 2°)"),
      par("Rappel des dispositions du code du travail relatives aux harcèlements moral et sexuel et aux agissements sexistes — reproduire les articles en vigueur, et renvoyer à l'affiche d'information et aux référents désignés."),
      h("Titre VI — Protection des lanceurs d'alerte (L. 1321-2, 3°)"),
      par("Mention de l'existence du dispositif de protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016, et de la procédure interne de recueil des signalements — " + ex("adresse dédiée alerte@societe-exemple.fr") + "."),
      h("Clause facultative — Neutralité (L. 1321-2-1)"),
      par("Le règlement peut contenir des dispositions inscrivant le principe de neutralité et restreignant la manifestation des convictions des salariés, si ces restrictions sont justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, et proportionnées au but recherché. N'insérer la clause que si ce double test est documenté."),
      h("Limites impératives (L. 1321-3)"),
      puce("Aucune disposition contraire aux lois, règlements, conventions et accords applicables ;"),
      puce("aucune restriction aux droits des personnes et aux libertés individuelles et collectives qui ne serait pas justifiée par la nature de la tâche ni proportionnée au but recherché ;"),
      puce("aucune disposition discriminatoire, à capacité professionnelle égale."),
      h("Formalités et vie du texte (L. 1321-4, L. 1321-5)"),
      puce(`Avis du comité social et économique : réunion du ${ex(plusJours(p, 30))} — l'avis accompagne le texte.`),
      puce(`Transmission à l'inspection du travail (deux exemplaires, avec l'avis) et dépôt au greffe du conseil de prud'hommes de ${ex("Villeneuve-Nord")} : le ${ex(plusJours(p, 37))}.`),
      puce(`Publicité auprès des salariés par tout moyen : le ${ex(plusJours(p, 37))} — entrée en vigueur : le ${ex(plusJours(p, 68))}, la date devant être postérieure d'un mois à l'accomplissement des formalités.`),
      puce("Notes de service portant obligations générales et permanentes dans ces matières : adjonctions au règlement, soumises aux mêmes formalités — sauf urgence santé-sécurité, à application immédiate avec communication simultanée au secrétaire du comité et à l'inspection (L. 1321-5)."),
      ...aPers(["Les consignes santé-sécurité propres à vos locaux et métiers",
        "L'échelle des sanctions retenue (l'exemple est une échelle classique — la durée maximale de mise à pied doit être chiffrée)",
        "Les garanties disciplinaires de la convention " + ccn(p) + " (à compléter selon la convention)",
        "L'adresse du dispositif d'alerte interne et les référents",
        "Les dates des formalités et le greffe territorialement compétent"]),
      noteFin("faites relire le projet avant consultation du comité : une clause illicite est inopposable et peut être retirée à tout moment par le juge ou l'inspection.")],
  }),

  "SOC-DOC-DUERP": p => {
    const s = secteurProfil(p);
    return {
    titre: "Document unique (DUERP) : structure intégrale et exemple chiffré",
    lignes: [...entete(p, "établissement du document unique d'évaluation des risques professionnels (R. 4121-1)"),
      h("1. Identification"),
      puce(`Entreprise : ${nomE(p)} — effectif : ${eff(p)} — activité : ${s.nom}.`),
      puce(`Date d'établissement : ${ex(plusJours(p, 30))} — responsable de l'évaluation : ${ex("Dominique BERNARD, responsable QSE")} — avec l'appui du service de prévention et de santé au travail ${ex("AST Prévention")}.`),
      h("2. Unités de travail et inventaire des risques (R. 4121-1 : un inventaire par unité, ambiances thermiques comprises)"),
      ...s.unites.flatMap(([u, r, m], i) => [
        puce(`Unité ${i + 1} — ${u}`),
        puce(`· Risques identifiés : ${ex(r)}`),
        puce(`· Mesures existantes : ${ex(m)}`),
        puce(`· Cotation (gravité × fréquence) : ${ex(i === 0 ? "élevée — priorité 1" : i === 1 ? "moyenne — priorité 2" : "modérée — priorité 3")} ; actions à engager : ${ex(i === 0 ? "programme dédié, échéance " + plusJours(p, 120) : "voir plan d'actions")}`),
      ]),
      h("3. Suites données"),
      par(`À partir de cinquante salariés, les résultats débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail ; en deçà, sur une liste d'actions consignée dans le document — pour ${eff(p)} salariés : ${ex("programme annuel présenté au comité avec la consultation politique sociale")}.`),
      h("4. Vie du document (R. 4121-2, R. 4121-4)"),
      puce("Mise à jour : au moins annuelle à partir de onze salariés ; à chaque aménagement important modifiant les conditions de santé, de sécurité ou de travail ; à chaque information supplémentaire intéressant l'évaluation d'un risque."),
      puce(`Prochaine mise à jour annuelle : au plus tard le ${ex(plusJours(p, 395))}.`),
      puce("Conservation du document et de ses versions successives pendant quarante ans, tenus à la disposition des travailleurs, des anciens travailleurs, du comité et des services compétents (R. 4121-4)."),
      puce(`Modalités d'accès portées à la connaissance du personnel : ${ex("intranet QSE et classeur au bureau du responsable, mentionnés au livret d'accueil")}.`),
      ...aPers(["Le découpage réel en unités de travail (l'exemple découpe une activité " + s.nom + " en " + s.unites.length + " unités)",
        "Les risques, cotations et mesures propres à chaque unité — l'évaluation ne se délègue pas à un modèle",
        "Le nom du responsable et du service de prévention",
        "Les échéances du plan d'actions"]),
      noteFin("les huit contrôles du document unique (existence, inventaire, mises à jour, suites, conservation, consultation du comité, transmission) se passent dans le module « santé, sécurité et conditions de travail ».")],
  }; },

  "SOC-DOC-BDESE": p => {
    const n = effN(p);
    const grand = n !== null && n >= 300;
    const c = grand ? DM.bdese.auMoins300 : DM.bdese.moins300;
    const lignes = [...entete(p, "constitution de la base de données économiques, sociales et environnementales"),
      h("1. Cadrage"),
      puce(`Support : ${ex("espace intranet dédié, accès nominatifs")} — droits d'accès : ${ex("membres du comité et délégués syndicaux, lecture seule, confidentialité marquée rubrique par rubrique")}.`),
      puce(`Responsable de l'alimentation : ${ex("Camille MARTIN, direction financière et DRH conjointement")} — mise à jour : ${ex("trimestrielle, et avant chaque consultation récurrente")}.`),
      puce(`Première mise à disposition notifiée aux élus le ${ex(plusJours(p, 45))}.`),
      h(`2. Structure intégrale — régime supplétif ${c.article} (${c.seuil}), version ${c.version}`),
      par(n === null
        ? "L'effectif n'étant pas renseigné, la structure ci-dessous est celle des entreprises d'au moins trois cents salariés — la plus complète ; en deçà, certaines rubriques s'allègent (R. 2312-8)."
        : `Pour ${eff(p)} salariés, le contenu supplétif est celui de ${c.article} : dix rubriques, détaillées ci-dessous section par section. Un accord d'entreprise peut en adapter l'organisation sans descendre sous le plancher légal.`)];
    for (const r of c.rubriques) {
      lignes.push(h(`Rubrique ${r.n} — ${r.titre}`));
      for (const sec of r.sections) {
        if (sec.titre) lignes.push(puce((sec.lettre ? sec.lettre + " — " : "") + sec.titre));
        for (const su of sec.sujets) lignes.push(puce("· " + su));
      }
    }
    lignes.push(h("3. Le plancher d'ordre public (" + DM.bdese.plancherSource + ")"),
      par("Quel que soit l'accord, la base comporte au moins les thèmes suivants : " + DM.bdese.plancher.join(" ; ") + "."),
      h("4. Exemple de première alimentation (fictif)"),
      puce(`Rubrique 1 (investissement social) : ${ex("effectif au 31 décembre par type de contrat, par âge et par ancienneté — extraction paie de " + jour0(p).slice(0, 4))}.`),
      puce(`Rubrique égalité professionnelle : ${ex("situation comparée femmes-hommes par catégorie — base des entretiens et de l'index")}.`),
      puce(`Rubriques financières : ${ex("liasse fiscale du dernier exercice clos, capitaux propres, endettement")}.`),
      ...aPers(["Le support réel et la liste nominative des accès",
        "Le contenu de chaque sujet : la structure ci-dessus est la liste légale intégrale, les données sont les vôtres",
        "Ce qu'un accord BDESE a pu adapter (organisation, périodicité, confidentialité) — sans descendre sous le plancher"]),
      noteFin("le régime (accord ou supplétif), l'exigibilité rubrique par rubrique et les contrôles se passent dans le module « base de données (BDESE) » (audit-bdese.html), dont le présent découpage est issu."));
    return { titre: "BDESE : ossature intégrale pour l'effectif déclaré", lignes };
  },

  "SOC-DOC-INDEX": p => ({
    titre: "Index de l'égalité professionnelle : feuille de route et exemple chiffré",
    lignes: [...entete(p, "calcul et publication annuels des indicateurs d'écarts de rémunération (L. 1142-8)"),
      h("1. Ce que la loi impose (lu à la source)"),
      par("Dans les entreprises d'au moins cinquante salariés, l'employeur publie chaque année l'ensemble des indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer, selon des modalités et une méthodologie définies par décret ; les indicateurs sont aussi rendus publics sur le site du ministère chargé du travail (L. 1142-8)."),
      par("Les intitulés et barèmes précis des indicateurs relèvent du décret (D. 1142-2), que le relais n'a pas confirmé — consigné à part : reprenez-les du décret en vigueur ou du simulateur officiel avant calcul."),
      h("2. Feuille de route (exemple daté)"),
      puce(`Période de référence retenue : ${ex("l'année civile " + (Number(jour0(p).slice(0, 4)) - 1))}.`),
      puce(`Constitution de la base de calcul (rémunérations par sexe, âge, catégorie ; augmentations ; promotions ; retours de congé maternité ; plus hautes rémunérations) : extraction paie le ${ex(plusJours(p, 15))}, par ${ex("Camille MARTIN, responsable paie")}.`),
      puce(`Calcul des indicateurs sur l'outil officiel et revue par la direction : le ${ex(plusJours(p, 30))}.`),
      puce(`Note globale obtenue : ${ex("84 points sur 100")}.`),
      puce(`Publication sur le site de l'entreprise et télédéclaration : le ${ex(plusJours(p, 40))} — communication au comité avec les données par la BDESE.`),
      h("3. Si la note est sous les seuils réglementaires (exemple)"),
      puce(`Mesures de correction et objectifs de progression : ${ex("enveloppe de rattrapage salarial ciblée de 0,2 % de la masse salariale ; revue des critères de promotion ; garantie d'augmentation au retour de congé maternité")}.`),
      puce("Publication de ces mesures et objectifs dans les conditions réglementaires — à vérifier au décret."),
      ...aPers(["La période de référence et la note réellement obtenue",
        "Les intitulés et barèmes des indicateurs, repris du décret en vigueur (non confirmés au relais)",
        "Les mesures de correction si la note l'exige, et leur budget"]),
      noteFin("l'exposition à la pénalité en cas de non-publication se mesure dans le module « négociation obligatoire (NAO) », contrôle égalité.")],
  }),

  "SOC-DOC-OETH": p => {
    const n = effN(p);
    const cible = n !== null ? Math.floor(n * 0.06) : null;
    return {
    titre: "Obligation d'emploi des travailleurs handicapés : état chiffré et déclaration",
    lignes: [...entete(p, "régularisation de l'obligation d'emploi (L. 5212-1, L. 5212-2, L. 5212-5)"),
      h("1. L'assiette, chiffrée pour l'effectif déclaré"),
      puce(`Effectif d'assujettissement : ${eff(p)} salariés — l'obligation d'emploi s'applique à tout employeur d'au moins vingt salariés (L. 5212-1).`),
      puce(cible !== null
        ? `Proportion minimale : 6 % de l'effectif total (L. 5212-2), soit ${cible} bénéficiaires pour ${eff(p)} salariés.`
        : "Proportion minimale : 6 % de l'effectif total (L. 5212-2) — renseignez l'effectif pour chiffrer la cible."),
      puce(`Bénéficiaires actuellement décomptés : ${ex(cible !== null ? String(Math.max(0, Math.round(cible * 0.6))) : "12")} — écart à couvrir : ${ex(cible !== null ? String(cible - Math.max(0, Math.round(cible * 0.6))) : "8")}.`),
      h("2. La déclaration (L. 5212-5)"),
      puce("La situation se déclare au moyen de la déclaration sociale nominative ; à défaut de toute déclaration, l'employeur est réputé ne pas satisfaire à l'obligation (L. 5212-5)."),
      puce(`Déclaration annuelle établie par ${ex("le service paie, avec l'expert-comptable")} — échéance portée au calendrier DSN : ${ex(jour0(p).slice(0, 4) + "-05-05")} (à caler sur l'échéance réglementaire en vigueur).`),
      h("3. Les voies de couverture de l'écart (exemple de plan)"),
      puce(`Recrutements et maintiens dans l'emploi : ${ex("plan de recrutement de " + (cible !== null ? Math.max(1, Math.round((cible) * 0.1)) : 3) + " bénéficiaires sur deux ans, partenariat Cap emploi")}.`),
      puce(`Accueil de stagiaires et mises en situation professionnelle : ${ex("quatre stagiaires par an")}.`),
      puce(`Sous-traitance au secteur adapté et protégé : ${ex("contrats EA/ESAT — entretien des espaces et numérisation")}.`),
      puce("À défaut : contribution annuelle — son barème relève de textes non vérifiés ici, faites-le chiffrer par l'expert paie ; un accord agréé peut aussi couvrir l'obligation."),
      ...aPers(["Le décompte réel des bénéficiaires présents (attestations à jour)",
        "L'échéance DSN exacte de l'année en cours",
        "Le plan de couverture retenu et son budget — l'exemple mélange les voies possibles"]),
      noteFin("le calcul fin de la contribution et les déductions relèvent de textes réglementaires non servis par le relais : rien n'est affirmé ici sur leur barème.")],
  }; },

  /* ─────────────────────────────── affichages et informations ────────── */

  "SOC-AFF-HARCELEMENT": p => ({
    titre: "Affiche complète : harcèlement moral et sexuel",
    lignes: [...entete(p, "information obligatoire des salariés et des candidats (L. 1152-4, L. 1153-5)"),
      h("Texte de l'affiche — à reproduire tel quel après personnalisation"),
      par(`« Dans l'entreprise ${nomE(p)}, aucun salarié ne doit subir de harcèlement moral ni de harcèlement sexuel. L'employeur prend toutes dispositions nécessaires en vue de prévenir ces agissements, d'y mettre un terme et de les sanctionner.`),
      par("Sont portés à votre connaissance, conformément aux articles L. 1152-4 et L. 1153-5 du code du travail : le texte de l'article 222-33-2 du code pénal (harcèlement moral) et celui de l'article 222-33 du code pénal (harcèlement sexuel) — [reproduire ici les deux articles dans leur rédaction en vigueur : code pénal, hors du champ du relais de cette application] — ainsi que les actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel et les coordonnées des autorités et services compétents :"),
      puce(`Référent harcèlement de l'entreprise : ${ex("Camille MARTIN, poste 4312, referent-harcelement@societe-exemple.fr")}`),
      puce(`Référent du comité social et économique : ${ex("Sacha LEROY, sacha.leroy@societe-exemple.fr")}`),
      puce(`Médecin du travail — service de prévention : ${ex("AST Prévention, 12 rue des Acacias, 01 23 45 67 89")}`),
      puce(`Inspection du travail : ${ex("unité de contrôle territorialement compétente, 01 23 45 67 90")}`),
      puce(`Défenseur des droits : ${ex("formulaire en ligne et délégué départemental — coordonnées à reprendre du site officiel")}`),
      par(`La liste des services figurant sur cette information est celle définie par décret (renvoi de L. 1153-5) : vérifiez-la avant affichage. »`),
      h("Mise en place"),
      puce(`Affichage dans les lieux de travail ET, pour le harcèlement sexuel, dans les locaux ou à la porte des locaux où se fait l'embauche : ${ex("panneaux des trois sites, salle de pause, espace candidats de l'accueil")}.`),
      puce(`Diffusion complémentaire par tout moyen : ${ex("intranet et livret d'accueil")} — datée du ${ex(plusJours(p, 3))}.`),
      ...aPers(["Le texte en vigueur des articles 222-33 et 222-33-2 du code pénal (à reproduire — hors du champ du relais)",
        "Les noms et coordonnées réels des référents, du service de prévention, de l'inspection",
        "La liste des services fixée par décret, à jour",
        "Les emplacements d'affichage effectifs et la date"]),
      noteFin("la prévention, les référents et la réaction au signalement s'auditent dans le module « santé, sécurité et conditions de travail ».")],
  }),

  "SOC-AFF-EGALITE": p => ({
    titre: "Affiche complète : interdiction des discriminations",
    lignes: [...entete(p, "information sur l'interdiction des discriminations (L. 1142-6)"),
      h("Texte de l'affiche"),
      par(`« Dans l'entreprise ${nomE(p)} comme dans le recrutement, toute discrimination est interdite. Conformément à l'article L. 1142-6 du code du travail, le texte des articles 225-1 à 225-4 du code pénal est porté à la connaissance des personnes ayant accès aux lieux de travail et des candidats à l'embauche : [reproduire ici les articles 225-1 à 225-4 du code pénal dans leur rédaction en vigueur — code pénal, hors du champ du relais de cette application]. »`),
      h("Mise en place"),
      puce(`Emplacements : lieux de travail et locaux — ou porte des locaux — où se fait l'embauche : ${ex("accueil du siège, salles d'entretien, panneaux des sites")}.`),
      puce(`Support : ${ex("affiche A3 et page intranet recrutement")} — mise en place datée du ${ex(plusJours(p, 3))}, par ${ex("les services généraux")}.`),
      puce(`Rappel dans les offres et procédures de recrutement : ${ex("mention type au bas des annonces")}.`),
      ...aPers(["Le texte en vigueur des articles 225-1 à 225-4 du code pénal (à reproduire)",
        "Les emplacements réels d'affichage, côté salariés et côté candidats",
        "La date de mise en place et le responsable"])],
  }),

  "SOC-AFF-COORDONNEES": p => ({
    titre: "Affiche complète : coordonnées utiles (D. 4711-1)",
    lignes: [...entete(p, "affichage des coordonnées obligatoires dans des locaux normalement accessibles aux travailleurs"),
      h("Texte de l'affiche — les trois mentions de D. 4711-1"),
      puce(`1° Médecin du travail / service de prévention et de santé au travail compétent : ${ex("AST Prévention, 12 rue des Acacias — 01 23 45 67 89 — accueil du lundi au vendredi 8 h - 17 h")}`),
      puce(`2° Services de secours d'urgence : SAMU 15 · Pompiers 18 · Numéro d'urgence européen 112 · ${ex("centre antipoison régional : 01 23 45 67 91")}`),
      puce(`3° Inspection du travail compétente, avec le nom de l'inspecteur : ${ex("unité de contrôle 3, 8 boulevard de la République — 01 23 45 67 90 — inspectrice : Mme Andrea COSTA")}`),
      h("Mise en place"),
      puce(`Emplacements (locaux normalement accessibles) : ${ex("hall d'accueil, salle de pause, vestiaires, quai — un exemplaire par site")}.`),
      puce(`Mise à jour : à chaque changement d'interlocuteur — vérification portée à l'agenda ${ex("chaque 1er septembre")} ; affichage daté du ${ex(plusJours(p, 1))}.`),
      ...aPers(["Les coordonnées réelles du service de prévention et de l'unité de contrôle (le nom de l'inspecteur change : vérifiez-le)",
        "Les emplacements par site",
        "La routine de mise à jour"])],
  }),

  "SOC-AFF-CONSIGNE-INCENDIE": p => ({
    titre: "Consigne de sécurité incendie complète (R. 4227-37)",
    lignes: [...entete(p, "établissement et affichage de la consigne de sécurité incendie"),
      h("Texte de la consigne — à afficher de manière très apparente"),
      puce(`Matériel d'extinction et de secours — emplacements : ${ex("extincteurs à chaque issue et tous les 15 mètres, RIA au quai, défibrillateur à l'accueil")}.`),
      puce(`Personnes chargées de diriger l'évacuation : ${ex("guides-files : Camille MARTIN (bâtiment A), Sacha LEROY (bâtiment B) ; serre-files : Dominique BERNARD, Andrea COSTA")}.`),
      puce(`Point de rassemblement : ${ex("parking visiteurs, angle nord")} — appel nominatif par ${ex("les guides-files, listes d'émargement du jour")}.`),
      puce(`Alerte : toute personne constatant un début d'incendie donne l'alarme (déclencheurs manuels ${ex("aux issues")}) et appelle les secours : 18 ou 112 — personne chargée de l'appel : ${ex("l'accueil, poste 9")}.`),
      puce(`Consignes particulières : ${ex("coupure des énergies par le responsable de maintenance ; mise en sécurité des quais ; interdiction d'utiliser les monte-charges")}.`),
      puce(`Accueil des secours : ${ex("un serre-file au portail, plans des locaux dans le coffret POI")}.`),
      h("Essais et exercices"),
      puce(`Exercices d'évacuation : ${ex("semestriels — prochains le " + plusJours(p, 60) + " et le " + plusJours(p, 240))} — comptes rendus consignés au registre de sécurité.`),
      puce(`Vérification du matériel : ${ex("annuelle, par l'organisme Vérif-Incendie, dernier passage le " + plusJours(p, -90))} — rapports au registre.`),
      par("Champ d'application : la consigne formalisée est due dans les établissements du champ de R. 4227-34 (plus de cinquante personnes réunies, ou matières inflammables) ; dans les autres, des instructions d'évacuation sont établies (R. 4227-37, dernier alinéa)."),
      ...aPers(["Les noms des guides-files et serre-files, par bâtiment et par équipe",
        "Les emplacements réels du matériel et du point de rassemblement",
        "Le calendrier des exercices et le prestataire de vérification"])],
  }),

  "SOC-AFF-HORAIRES": p => ({
    titre: "Affiche complète : horaire collectif de travail (L. 3171-1)",
    lignes: [...entete(p, "affichage des heures de début et de fin du travail et des repos"),
      h("Texte de l'affiche"),
      par(`« Horaire collectif applicable au personnel de ${nomE(p)} soumis à l'horaire collectif, affiché en application de l'article L. 3171-1 du code du travail (heures auxquelles commence et finit le travail, heures et durée des repos) :`),
      puce(ex("Du lundi au jeudi : 8 h 30 – 12 h 15 et 13 h 45 – 17 h 30")),
      puce(ex("Le vendredi : 8 h 30 – 12 h 15 et 13 h 45 – 16 h 30")),
      puce(ex("Repos : pause méridienne de 1 h 30 ; repos hebdomadaire samedi et dimanche")),
      par(`Affiché le ${ex(plusJours(p, 1))} — ${ex("Camille MARTIN, DRH")}. »`),
      h("Salariés hors horaire collectif"),
      puce(`Horaires individualisés ou aménagés sur l'année : l'affichage comprend la répartition de la durée du travail dans le cadre de cette organisation (L. 3171-1, al. 2) — ${ex("planning cyclique des équipes affiché au quai")}.`),
      puce(`Personnels itinérants, forfaits, roulants : décompte individuel organisé — ${ex("relevés déclaratifs hebdomadaires validés par le manager ; chronotachygraphe pour les conducteurs")}${q(p.secteur) ? ", régime propre au secteur " + q(p.secteur) + " à compléter selon la convention " + ccn(p) : ""}.`),
      puce("Astreintes : la programmation individuelle des périodes d'astreinte est portée à la connaissance de chaque salarié dans les conditions prévues (L. 3171-1, al. 3)."),
      ...aPers(["Les horaires réels par site et par service",
        "La répartition annuelle si le temps de travail est aménagé",
        "Le mode de décompte des salariés hors horaire collectif (et le régime conventionnel des roulants, à compléter selon la convention)"])],
  }),

  "SOC-AFF-DECOMPTE": p => {
    const s = secteurProfil(p);
    const n = effN(p);
    const hors = n !== null ? Math.max(1, Math.round(n * 0.35)) : 40;
    return {
    titre: "Décompte du temps de travail hors horaire collectif : documents et procédure",
    lignes: [...entete(p, "documents de décompte de la durée du travail et des repos compensateurs (L. 3171-2, L. 3171-3)"),
      h("1. Les deux obligations, lues à la source"),
      puce("Lorsque tous les salariés occupés dans un service ou un atelier ne travaillent pas selon le même horaire collectif, l'employeur établit les documents nécessaires au décompte de la durée de travail, des repos compensateurs acquis et de leur prise effective, pour chacun des salariés concernés. Le comité social et économique peut consulter ces documents (L. 3171-2)."),
      puce("L'employeur tient à la disposition de l'agent de contrôle de l'inspection du travail les documents permettant de comptabiliser le temps de travail accompli par chaque salarié ; la nature de ces documents et la durée pendant laquelle ils sont tenus à disposition sont déterminées par voie réglementaire (L. 3171-3)."),
      puce("À noter : L. 3171-3 renvoie à un texte réglementaire pour la nature des documents et la durée de conservation — ce texte n'a pas été vérifié ici, rien n'en est affirmé : faites confirmer la durée par votre conseil."),
      h("2. Cartographie des populations hors horaire collectif (exemple pour une activité " + s.nom + ")"),
      puce(`${ex(s.unites[0][0])} — mode de décompte : ${ex("relevé individuel hebdomadaire validé par le responsable ; chronotachygraphe le cas échéant")} — effectif : ${ex("28 salariés")}.`),
      puce(`Équipes successives / horaires postés : ${ex("planning cyclique nominatif, horodatage des prises de poste")} — effectif : ${ex("15 salariés")}.`),
      puce(`Horaires individualisés (badgeage) : ${ex("compteur individuel de crédit-débit, remis chaque mois au salarié")} — effectif : ${ex("22 salariés")}.`),
      puce(`Forfaits en jours : ${ex("décompte du nombre de jours travaillés, contrôle de la charge et des repos — document mensuel signé")} — effectif : ${ex("9 salariés")}.`),
      puce(`Total hors horaire collectif dans l'exemple : ${ex(String(hors) + " salariés sur " + eff(p))}.`),
      h("3. Le document individuel type (contenu)"),
      puce("Identité du salarié, service, période couverte, mode d'organisation applicable ;"),
      puce("heures de travail accomplies jour par jour, et total hebdomadaire ;"),
      puce("heures supplémentaires accomplies et leur traitement (paiement ou repos compensateur de remplacement) ;"),
      puce("repos compensateurs ACQUIS sur la période et repos EFFECTIVEMENT PRIS, avec les dates — L. 3171-2 exige les deux ;"),
      puce("visa du salarié et du responsable, date d'établissement."),
      h("4. Exemple rempli (fictif)"),
      par(ex("DURAND Paul — exploitation — semaine du " + plusJours(p, -14) + " au " + plusJours(p, -8) + " : lundi 8 h 15, mardi 9 h, mercredi 7 h 45, jeudi 9 h 30, vendredi 8 h — total 42 h 30, dont 7 h 30 supplémentaires ; contrepartie : 3 h payées, 4 h 30 en repos compensateur de remplacement. Repos acquis au compteur : 21 h 15. Repos pris sur la période : 7 h le " + plusJours(p, -10) + ". Visas : le salarié, le responsable d'exploitation.")),
      h("5. Conservation et mise à disposition"),
      puce(`Support : ${ex("module temps du SIRH, extraction PDF mensuelle horodatée et archivée")}.`),
      puce(`Tenue à la disposition de l'agent de contrôle de l'inspection du travail (L. 3171-3) : ${ex("extraction disponible sous 24 heures, procédure écrite communiquée à l'encadrement")} — durée de conservation à confirmer sur le texte réglementaire applicable.`),
      puce(`Consultation par le comité (L. 3171-2) : ${ex("modalités portées au règlement intérieur du comité — consultation sur place, sur demande, en présence du responsable RH")}.`),
      puce(`Remise au salarié : ${ex("récapitulatif mensuel joint au bulletin de paie")} — non exigé par les articles lus ici, mais c'est la meilleure preuve d'un décompte contradictoire.`),
      h("6. Pourquoi ce point se traite avant le contentieux"),
      par("En litige d'heures supplémentaires, le salarié présente des éléments suffisamment précis, et c'est à l'employeur de produire ses propres éléments de décompte. Sans documents, il n'a rien à opposer : l'obligation documentaire de L. 3171-2 et L. 3171-3 est aussi sa première protection."),
      ...aPers(["La cartographie réelle de vos populations et de leurs modes d'organisation",
        "Le support de décompte retenu et son paramétrage (repos acquis ET pris)",
        "La durée de conservation, à caler sur le texte réglementaire en vigueur",
        "Les modalités de consultation par le comité et de remise au salarié"])],
  }; },

  "SOC-AFF-EGA-REMU": p => ({
    titre: "Affiche complète : égalité de rémunération entre les femmes et les hommes (R. 3221-2)",
    lignes: [...entete(p, "information sur les textes d'égalité de rémunération (R. 3221-2)"),
      h("1. Ce que le texte impose, lu à la source"),
      par("Les dispositions des articles L. 3221-1 à L. 3221-7 du code du travail sont portées, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail, ainsi qu'aux candidats à l'embauche. Il en est de même pour les dispositions réglementaires prises pour l'application de ces articles (R. 3221-2)."),
      par("Deux publics, donc : les personnes ayant accès aux lieux de travail — salariés, intérimaires, prestataires — ET les candidats à l'embauche. Une affiche en salle de pause ne couvre pas le second."),
      h("2. Texte de l'affiche"),
      par(`« ${nomE(p)} — Égalité de rémunération entre les femmes et les hommes.`),
      par("Conformément à l'article R. 3221-2 du code du travail, sont portées à votre connaissance les dispositions des articles L. 3221-1 à L. 3221-7 du code du travail relatives à l'égalité de rémunération entre les femmes et les hommes, ainsi que les dispositions réglementaires prises pour leur application : [reproduire ici le texte en vigueur des articles L. 3221-1 à L. 3221-7 — sept articles, à reprendre intégralement de la version en vigueur à la date d'affichage]."),
      par(`Pour toute question ou réclamation sur ce sujet : ${ex("Camille MARTIN, DRH — poste 4312")} ; référent égalité du comité social et économique : ${ex("Sacha LEROY")} ; inspection du travail : ${ex("unité de contrôle 3, 01 23 45 67 90")}. Affiché le ${ex(plusJours(p, 2))}. »`),
      h("3. Mise en place, côté salariés et côté candidats (exemple)"),
      puce(`Lieux de travail : ${ex("panneau d'affichage de chaque site (3), salle de pause, vestiaires")}.`),
      puce(`Candidats à l'embauche : ${ex("affichage à l'accueil et dans les salles d'entretien ; page « nos engagements » du site carrières ; mention et lien dans chaque offre d'emploi et dans l'accusé de réception des candidatures")}.`),
      puce(`Support numérique : ${ex("intranet RH, rubrique « vos droits », et remise avec le livret d'accueil")} — « par tout moyen » autorise le numérique, à condition que l'accès soit effectif pour tous.`),
      h("4. Articulation avec les autres informations obligatoires"),
      puce("Ne pas confondre avec l'information sur les discriminations (L. 1142-6, articles 225-1 à 225-4 du code pénal) ni avec la publication de l'index (L. 1142-8) : trois obligations distinctes, trois supports — le présent modèle ne couvre que R. 3221-2."),
      puce(`Regroupement pratique : ${ex("un panneau « égalité et non-discrimination » réunissant les trois informations, chacune identifiée par son fondement")}.`),
      h("5. Mise à jour"),
      puce(`Vérification annuelle de la version des articles reproduits : ${ex("chaque 1er septembre, responsable : Camille MARTIN")} — un texte périmé ne remplit pas l'obligation.`),
      ...aPers(["Le texte en vigueur des articles L. 3221-1 à L. 3221-7 et de leurs textes d'application (à reproduire intégralement)",
        "Les emplacements réels côté salariés ET côté candidats",
        "Les interlocuteurs mentionnés et la date d'affichage"])],
  }),

  "SOC-AFF-CONVENTION": p => ({
    titre: "Avis complet : convention collective applicable (R. 2262-1)",
    lignes: [...entete(p, "information des salariés sur les textes conventionnels applicables"),
      h("Texte de l'avis"),
      par(`« La convention collective applicable au personnel de ${nomE(p)} est : ${ccn(p)}${q(p.conventionCollective) ? "" : " [à compléter]"} — ainsi que les accords d'entreprise en vigueur : ${ex("accord de méthode du " + plusJours(p, -300) + ", accord télétravail du " + plusJours(p, -500))}.`),
      par(`Conformément à l'article R. 2262-1 du code du travail : chaque salarié est informé des conventions et accords applicables au moment de l'embauche ; un exemplaire à jour de ces textes est tenu à votre disposition sur le lieu de travail : ${ex("bureau RH, bâtiment A, et classeur de chaque site")} ; un exemplaire à jour figure sur l'intranet : ${ex("rubrique RH > textes applicables")}.`),
      par(`Avis affiché le ${ex(plusJours(p, 2))} — ${ex("Camille MARTIN, DRH")}. »`),
      h("Vérifications associées"),
      puce("La convention se détermine par l'activité réelle de l'entreprise — le code APE n'est qu'un indice : confirmez l'identification avant affichage."),
      puce("La convention est mentionnée sur le bulletin de paie : faites vérifier la mention par la paie."),
      puce(`L'information d'embauche (renvoi de R. 2262-1 aux articles R. 1221-34 et R. 1221-35) est intégrée au parcours d'accueil : ${ex("remise contre émargement avec le livret d'accueil")}.`),
      ...aPers(["L'intitulé exact (et l'IDCC) de la convention réellement applicable",
        "La liste de vos accords d'entreprise en vigueur",
        "Les lieux réels de consultation et l'adresse intranet"])],
  }),

  "SOC-AFF-FUMER": p => ({
    titre: "Signalisation complète : interdiction de fumer et de vapoter",
    lignes: [...entete(p, "signalisation dans les locaux (code de la santé publique — hors du champ du relais : à vérifier sur les textes en vigueur)"),
      h("Texte de la signalisation"),
      par(`« Il est interdit de fumer dans les lieux de travail fermés et couverts de ${nomE(p)}. Il est interdit de vapoter dans les locaux recevant des postes de travail, fermés et couverts, à usage collectif. Cette signalisation est apposée en application du code de la santé publique — reportez-vous aux textes en vigueur, non servis par le relais de cette application. »`),
      h("Plan d'implantation (exemple)"),
      puce(`Entrées des bâtiments et halls : ${ex("6 panneaux normalisés")}.`),
      puce(`Salles de réunion, de pause, vestiaires, sanitaires : ${ex("12 panneaux")}.`),
      puce(`Véhicules de service et d'entreprise : ${ex("autocollants sur les 40 véhicules de la flotte")}.`),
      puce(`Emplacement fumeurs extérieur éventuel : ${ex("abri côté parking, à plus de dix mètres des entrées — implantation à valider")}.`),
      h("Mise en œuvre"),
      puce(`Pose datée du ${ex(plusJours(p, 5))} par ${ex("les services généraux")} ; rappel de la règle dans le règlement intérieur et le livret d'accueil.`),
      ...aPers(["Le nombre et l'implantation réels des panneaux",
        "Le sort des véhicules et des locaux particuliers",
        "La vérification des textes du code de la santé publique en vigueur (sanctions comprises)"])],
  }),

  /* ──────────────────────────────────────────────── registres ────────── */

  "SOC-REG-PERSONNEL": p => ({
    titre: "Registre unique du personnel : colonnes exactes et exemple de ligne",
    lignes: [...entete(p, "tenue du registre unique du personnel, par établissement (L. 1221-13, D. 1221-23)"),
      h("1. Les règles de tenue (L. 1221-13)"),
      puce("Un registre par établissement où sont employés des salariés ; les noms et prénoms de tous les salariés, inscrits dans l'ordre des embauches, au moment de l'embauche, de façon indélébile."),
      puce("Les stagiaires et volontaires en service civique figurent, dans leur ordre d'arrivée, dans une partie spécifique."),
      h("2. Les colonnes exactes (D. 1221-23)"),
      puce("Nom et prénoms — puis, pour chaque salarié :"),
      puce("1° nationalité · 2° date de naissance · 3° sexe · 4° emploi · 5° qualification · 6° dates d'entrée et de sortie de l'établissement ;"),
      puce("7° lorsqu'une autorisation d'embauche ou de licenciement est requise : la date de l'autorisation ou de la demande ;"),
      puce("8° pour les travailleurs étrangers assujettis à un titre autorisant l'exercice d'une activité salariée : le type et le numéro d'ordre du titre ;"),
      puce("suite de D. 1221-23 : les mentions propres aux contrats particuliers portées par l'article (contrats à durée déterminée, travail à temps partiel, mise à disposition par un groupement d'employeurs ou une entreprise de travail temporaire…) — reprendre l'énumération de l'article, reproduite dans le dépôt de textes de ce module."),
      h("3. Exemple de ligne (fictif)"),
      par(ex("MARTIN Camille — française — née le 12/03/1991 — F — conductrice routière — coefficient et emploi selon la classification applicable (à compléter selon la convention " + ccn(p) + ") — entrée le " + plusJours(p, -400) + " — CDI")),
      par(ex("OKAFOR Ngozi — nigériane — née le 04/07/1996 — F — préparatrice de commandes — entrée le " + plusJours(p, -60) + " — CDD jusqu'au " + plusJours(p, 120) + " — titre de séjour salarié n° 751234567")),
      h("4. Support et accès"),
      puce(`Support : ${ex("registre numérique tenu sous le SIRH, garanties d'indélébilité et d'horodatage")} — un support numérique suppose l'information préalable des instances : documentez-la.`),
      puce("Tenu à la disposition de l'inspection du travail et des membres du comité ; conservation des mentions à documenter avec votre conseil (durées fixées par des textes non vérifiés ici)."),
      ...aPers(["Le support retenu (papier ou numérique) et la preuve de l'information des instances",
        "Les lignes réelles, par établissement et dans l'ordre des embauches",
        "Les mentions des contrats particuliers, reprises de l'énumération complète de D. 1221-23"])],
  }),

  "SOC-REG-SECURITE": p => ({
    titre: "Registre de sécurité : sommaire complet et exemple tenu",
    lignes: [...entete(p, "conservation des vérifications, contrôles et observations (L. 4711-1, L. 4711-2, L. 4711-5)"),
      h("1. Ce que le registre rassemble"),
      puce("Les attestations, consignes, résultats et rapports des vérifications et contrôles mis à la charge de l'employeur au titre de la santé et de la sécurité (L. 4711-1) ;"),
      puce("les observations et mises en demeure de l'inspection du travail en matière de santé-sécurité, de médecine du travail et de prévention (L. 4711-2) ;"),
      puce("le tout pouvant être réuni en un registre unique dès lors que cela facilite la conservation et la consultation (L. 4711-5)."),
      h("2. Sommaire type, avec exemple d'état"),
      puce(`Installations électriques — vérification annuelle : dernier rapport ${ex("Bureau Contrôle Plus, le " + plusJours(p, -120) + ", trois observations levées le " + plusJours(p, -60))}.`),
      puce(`Moyens d'extinction et alarme incendie : ${ex("vérifiés le " + plusJours(p, -90) + " — conformes")}.`),
      puce(`Équipements de travail et de levage (${ex("ponts, chariots, hayons")}) : vérifications générales périodiques ${ex("semestrielles, dernière le " + plusJours(p, -45))}.`),
      puce(`Aération, assainissement, ambiances : ${ex("contrôle du " + plusJours(p, -200))}.`),
      puce(`Portes et portails automatiques, ascenseurs et monte-charges : ${ex("contrat de maintenance Ascent, visites trimestrielles")}.`),
      puce(`Observations et mises en demeure de l'inspection : ${ex("courrier du " + plusJours(p, -300) + " — plan de mise en conformité soldé")}.`),
      h("3. Tenue"),
      puce(`Responsable du registre : ${ex("Dominique BERNARD, responsable maintenance")} — vérifications manquantes programmées : ${ex("aération bâtiment B, le " + plusJours(p, 30))}.`),
      puce("Consultation : inspection du travail, service de prévention, comité — sur demande."),
      ...aPers(["L'inventaire réel des installations et équipements soumis à vérification",
        "Les organismes, dates et rapports effectifs",
        "Le responsable de la tenue et le calendrier des prochaines échéances"])],
  }),

  "SOC-REG-DGI": p => ({
    titre: "Registre des alertes danger grave et imminent : page de garde et exemple d'avis",
    lignes: [...entete(p, "ouverture du registre spécial des alertes (D. 4132-1)"),
      h("1. Page de garde"),
      par(`« Registre spécial des alertes en cas de danger grave et imminent — ${nomE(p)}. Ouvert le ${ex(plusJours(p, 1))}. Pages numérotées de 1 à ${ex("100")}, authentifiées par le tampon du comité social et économique (D. 4132-1). Tenu à la disposition des représentants du personnel — lieu de consultation : ${ex("secrétariat de direction, bâtiment A")}. »`),
      h("2. Les mentions de chaque avis (D. 4132-1)"),
      puce("L'avis du représentant du personnel est consigné sur le registre, daté et signé ; il indique :"),
      puce("1° les postes de travail concernés par la cause du danger constaté ;"),
      puce("2° la nature et la cause de ce danger ;"),
      puce("3° le nom des travailleurs exposés."),
      h("3. Exemple d'avis consigné (fictif)"),
      par(ex("Avis n° 1 — le " + plusJours(p, 90) + ", 10 h 40 — Sacha LEROY, membre du CSE. Postes concernés : quai de chargement, portique n° 2. Nature et cause du danger : élingue effilochée sur le palonnier, risque de chute de charge. Travailleurs exposés : N. OKAFOR, P. DURAND. Signature.")),
      par(ex("Suites portées en regard : arrêt d'utilisation immédiat, remplacement de l'élingue le jour même, vérification du parc d'accessoires de levage le " + plusJours(p, 97) + " — enquête conjointe employeur/CSE.")),
      h("4. Information des élus"),
      puce(`Communication de l'existence du registre et de son mode d'emploi aux membres du comité : réunion du ${ex(plusJours(p, 15))}, mention au procès-verbal.`),
      ...aPers(["Le nombre de pages et le lieu réel de consultation",
        "Le tampon du comité (authentification des pages)",
        "La procédure interne de suites (qui intervient, qui enquête, qui clôt)"])],
  }),

  /* ────────────────────────────────────────────── négociations ───────── */

  "SOC-NEG-NAO": p => ({
    titre: "Feuille de route complète : remise au calendrier des négociations obligatoires",
    lignes: [...entete(p, "engagement des négociations obligatoires d'entreprise"),
      h("1. État des lieux (exemple)"),
      puce(`Sections syndicales constituées : ${ex("deux organisations représentatives (délégués : A. COSTA, P. DURAND)")}.`),
      puce(`Accord de méthode : ${ex("aucun — le régime supplétif s'applique donc : rémunération et égalité chaque année, gestion des emplois et salariés expérimentés tous les trois ans à partir de trois cents salariés")}.`),
      puce(`Dernières négociations engagées : rémunération ${ex("jamais")} ; égalité ${ex("il y a 26 mois")} — deux retards à traiter en priorité.`),
      h("2. Calendrier de rattrapage (exemple daté)"),
      puce(`Convocation des délégués syndicaux à une première réunion commune : envoyée le ${ex(plusJours(p, 5))} pour le ${ex(plusJours(p, 19))}.`),
      puce(`Première réunion (${ex(plusJours(p, 19))}) : fixer le lieu et le calendrier des réunions, la liste des informations remises aux négociateurs et la date de cette remise — l'exemple retient ${ex("quatre réunions par thème, informations remises dix jours avant chacune, à partir des données de la BDESE")}.`),
      puce(`Négociation rémunération : réunions des ${ex(plusJours(p, 33) + ", " + plusJours(p, 47) + " et " + plusJours(p, 61))} — issue formalisée au plus tard le ${ex(plusJours(p, 75))} : accord déposé, ou procès-verbal de désaccord consignant les dernières propositions des parties et les mesures que l'employeur entend appliquer, déposé.`),
      puce(`Négociation égalité professionnelle et qualité de vie : engagement le ${ex(plusJours(p, 90))}, appuyée sur le diagnostic comparé de la BDESE et l'index publié.`),
      puce(`Envisager un accord de méthode fixant thèmes, périodicités (quatre ans au plus), calendrier, informations et suivi — trame complète dans le générateur de documents (modèle « accord-methode »).`),
      h("3. Conduite loyale (exemple d'engagements internes)"),
      puce(`Réponse motivée à chaque proposition syndicale sous ${ex("quinze jours")} ; aucune décision unilatérale dans les matières en cours de négociation, sauf urgence justifiée et documentée.`),
      puce(`Négociateurs pour la direction : ${ex("Dominique BERNARD (DG), Camille MARTIN (DRH)")} — mandat cadré le ${ex(plusJours(p, 5))}.`),
      ...aPers(["L'état réel de vos sections syndicales et de vos dernières négociations",
        "Le calendrier, le nombre de réunions et les informations réellement remises",
        "Les négociateurs et leur mandat",
        "L'issue de chaque négociation (accord ou procès-verbal de désaccord) et son dépôt"]),
      noteFin("les périodicités exactes qui s'imposent à vous (accord de méthode ou supplétif), les délais de la demande syndicale et l'exposition aux pénalités se calculent dans le module « négociation obligatoire (NAO) » — c'est lui qui fait foi pour les échéances.")],
  }),

  "SOC-NEG-EGALITE": p => ({
    titre: "Plan d'action égalité professionnelle : squelette complet chiffré",
    lignes: [...entete(p, "couverture égalité professionnelle : accord négocié ou, à défaut, plan d'action annuel déposé"),
      h("1. Diagnostic préalable (exemple)"),
      puce(`Situation comparée femmes-hommes établie depuis la BDESE (rubrique égalité professionnelle) le ${ex(plusJours(p, 10))} : ${ex("38 % de femmes dans l'effectif, 21 % dans l'encadrement ; écart de rémunération moyenne de 6,2 % à catégorie équivalente ; index publié : 84/100")}.`),
      h("2. Domaines d'action et objectifs (exemple chiffré — les domaines réglementaires exacts sont à reprendre des textes d'application, non vérifiés ici)"),
      puce(`Embauche : ${ex("porter à 30 % la part de femmes dans les recrutements de conducteurs d'ici deux ans — indicateur : embauches par sexe et par métier")}.`),
      puce(`Promotion et déroulement de carrière : ${ex("revue annuelle des viviers ; 40 % de femmes dans les promotions cadres — indicateur : promotions par sexe")}.`),
      puce(`Rémunération effective : ${ex("enveloppe de rattrapage de 0,2 % de la masse salariale sur trois ans — indicateur : écart résiduel par catégorie")}.`),
      puce(`Articulation vie professionnelle / vie personnelle : ${ex("entretien systématique au retour des congés familiaux ; charte des réunions (9 h 30 - 17 h)")}.`),
      h("3. Coût et suivi"),
      puce(`Coût évalué des actions : ${ex("115 000 € sur l'exercice")} — suivi ${ex("semestriel")} présenté au comité avec les données de la base.`),
      h("4. Adoption et dépôt"),
      puce(`Voie négociée d'abord : proposition d'ouverture aux délégués syndicaux le ${ex(plusJours(p, 15))}. À défaut d'accord à l'issue de la négociation : plan d'action annuel arrêté par l'employeur, après consultation du comité, et déposé auprès de l'autorité administrative le ${ex(plusJours(p, 90))}.`),
      puce("Une période sans accord ni plan déposé est une période d'exposition à la pénalité : ne laissez pas de trou entre deux couvertures."),
      ...aPers(["Le diagnostic réel tiré de votre BDESE et de votre index",
        "Les domaines d'action retenus (leur liste réglementaire exacte est à reprendre des textes d'application) et les objectifs chiffrés",
        "Le coût, le calendrier de suivi et la date de dépôt"]),
      noteFin("la couverture, l'index et l'exposition à la pénalité s'auditent dans le module « négociation obligatoire (NAO) ».")],
  }),

  "SOC-NEG-PSE": p => ({
    titre: "Licenciement économique : check-list complète avant toute notification",
    lignes: [...entete(p, "sécurisation d'un projet de licenciement pour motif économique"),
      h("1. Qualifier le motif — avant tout acte"),
      puce(`Rattacher le projet à l'un des motifs économiques et constituer le dossier de preuve : ${ex("baisse des commandes sur quatre trimestres consécutifs, comptes et carnet de commandes à l'appui")} — la qualification s'éprouve dans le module « licenciement économique », qui confronte le dossier aux textes et à la jurisprudence dépouillée.`),
      h("2. Dimensionner la procédure (exemple)"),
      puce(`Nombre de licenciements envisagés : ${ex("18")} sur ${eff(p)} salariés, sur ${ex("30 jours")} — ce dimensionnement commande la procédure applicable (information-consultation, plan de sauvegarde le cas échéant) : vérifiez les seuils dans le module « plan de sauvegarde ».`),
      puce(`Catégories professionnelles concernées et critères d'ordre : ${ex("grille pondérée — charges de famille, ancienneté, situation sociale, qualités professionnelles — validée avant toute liste nominative")}.`),
      h("3. Dérouler dans l'ordre (exemple de séquence)"),
      puce(`Constitution du dossier économique et du projet : ${ex(plusJours(p, 10))}.`),
      puce(`Information-consultation du comité social et économique : première réunion ${ex(plusJours(p, 24))} — remise du dossier complet avec la convocation.`),
      puce(`Le cas échéant, élaboration du plan de sauvegarde (mesures de reclassement, formation, accompagnement) et échanges avec l'administration : ${ex("à partir du " + plusJours(p, 24))}.`),
      puce(`Recherche individuelle et loyale de reclassement, propositions écrites et précises : ${ex("avant toute notification")}.`),
      puce(`Notifications : seulement une fois la consultation achevée et les délais purgés — dates calculées par les modules dédiés.`),
      h("4. Ce qui fait échouer les procédures (rappel de méthode)"),
      puce("Motif insuffisamment documenté ; consultation escamotée ; critères d'ordre non appliqués ou non documentés ; reclassement de pure forme ; calendrier tenu à rebours. Chaque point se contrôle dans les modules avant d'agir."),
      ...aPers(["Le motif réel et son dossier de preuve",
        "Le nombre de ruptures, la période et les catégories concernées",
        "La grille de critères d'ordre et sa pondération",
        "Le calendrier complet, recalé sur les délais que les modules calculent"]),
      noteFin("les seuils, délais et contrôles complets sont dans les modules « licenciement économique » (audit.html) et « plan de sauvegarde » (audit-pse.html) — ne notifiez rien avant de les avoir passés.")],
  }),

  /* ────────────────────────────────────────────── santé-sécurité ─────── */

  "SOC-SST-SPST": p => ({
    titre: "Courrier complet d'adhésion au service de prévention et de santé au travail",
    lignes: [...entete(p, "adhésion à un service de prévention et de santé au travail (L. 4622-1)"),
      par(`À : ${ex("AST Prévention, service interentreprises — 12 rue des Acacias")}`),
      par("Madame, Monsieur,"),
      par(`En application de l'article L. 4622-1 du code du travail, ${nomE(p)} sollicite son adhésion à votre service. Vous trouverez ci-dessous les éléments d'identification ; nous vous demandons l'ouverture du dossier, la déclaration de nos effectifs et risques, et la programmation des visites en attente.`),
      puce(`Identification : ${nomE(p)} — SIRET ${ex("123 456 789 00012")} — activité : ${secteurProfil(p).nom}${q(p.conventionCollective) ? " — convention : " + q(p.conventionCollective) : ""}.`),
      puce(`Effectif : ${eff(p)} salariés, répartis sur ${ex("trois sites")} — liste nominative et postes en annexe.`),
      puce(`Postes présentant des risques particuliers (suivi renforcé à valider avec votre équipe) : ${ex("conducteurs poids lourds, caristes, techniciens de maintenance habilités électriques")}.`),
      puce(`Visites à programmer en priorité : ${ex("12 embauches des six derniers mois sans visite, et le suivi périodique en retard listé en annexe")}.`),
      puce(`Interlocuteur : ${ex("Camille MARTIN, DRH — 01 23 45 67 88")}.`),
      par(`Nous vous remercions de nous adresser le contrat d'adhésion, le montant de la cotisation et le calendrier proposé. Fait le ${ex(plusJours(p, 2))} — ${ex("Dominique BERNARD, directeur général")}.`),
      ...aPers(["Le service compétent pour votre secteur géographique et professionnel",
        "Le SIRET, les sites et la liste réelle du personnel et des postes",
        "La liste des postes à risques (elle se valide avec le médecin du travail)",
        "Les visites en retard, jointes en annexe"])],
  }),

  "SOC-SST-VIP": p => ({
    titre: "Remise à niveau du suivi médical : courrier et tableau de rattrapage",
    lignes: [...entete(p, "visites d'information et de prévention et suivi de l'état de santé (R. 4624-10)"),
      h("1. Courrier au service de prévention"),
      par(`« Au service ${ex("AST Prévention")} — en application de l'article R. 4624-10 du code du travail (visite d'information et de prévention dans un délai qui n'excède pas trois mois à compter de la prise effective du poste), nous vous demandons l'état complet des visites de nos salariés et la programmation des visites listées ci-dessous. Merci de nous signaler les postes que vous classez en suivi individuel renforcé. »`),
      h("2. Tableau de rattrapage (exemple fictif)"),
      puce(ex("OKAFOR Ngozi — préparatrice de commandes — embauchée le " + plusJours(p, -60) + " — visite due au plus tard le " + plusJours(p, 30) + " — demandée")),
      puce(ex("DURAND Paul — conducteur SPL — embauché le " + plusJours(p, -120) + " — visite dépassée — programmée le " + plusJours(p, 10))),
      puce(ex("COSTA Andrea — technicienne de maintenance — suivi périodique échu depuis le " + plusJours(p, -90) + " — reprogrammé le " + plusJours(p, 21))),
      h("3. Verrouiller le flux pour l'avenir"),
      puce(`Déclenchement automatique de la demande de visite à chaque embauche : ${ex("case bloquante dans le SIRH à la validation du contrat")}.`),
      puce(`Revue trimestrielle du tableau des échéances avec le service : ${ex("chaque premier lundi de trimestre, responsable : Camille MARTIN")}.`),
      puce("Postes à risques : visite avant affectation et périodicité renforcée selon la classification du médecin du travail — faites établir la liste par écrit."),
      ...aPers(["L'état réel des visites, rapproché du registre du personnel",
        "Les noms, postes et dates du tableau de rattrapage",
        "La procédure d'embauche modifiée et son responsable"])],
  }),

  "SOC-SST-POSTES-RISQUES": p => {
    const s = secteurProfil(p);
    const n = effN(p);
    const concernes = n !== null ? Math.max(1, Math.round(n * 0.12)) : 15;
    return {
    titre: "Liste des postes à risques particuliers et suivi individuel renforcé",
    lignes: [...entete(p, "postes à risques particuliers et suivi individuel renforcé (R. 4624-22, R. 4624-23)"),
      h("1. Les catégories légales, lues à la source (R. 4624-23, I)"),
      par("Les postes présentant des risques particuliers mentionnés au premier alinéa de l'article L. 4624-2 sont ceux exposant les travailleurs :"),
      puce("1° à l'amiante ; 2° au plomb ; 3° aux agents cancérogènes, mutagènes ou toxiques pour la reproduction mentionnés à l'article R. 4412-60 ;"),
      puce("4° aux agents biologiques des groupes 3 et 4 mentionnés à l'article R. 4421-3 ; 5° aux rayonnements ionisants ; 6° au risque hyperbare ;"),
      puce("7° au risque de chute de hauteur lors des opérations de montage et de démontage d'échafaudages."),
      puce("Présente également des risques particuliers tout poste dont l'affectation est conditionnée à un examen d'aptitude spécifique prévu par le code du travail (R. 4624-23, II)."),
      puce("Tout travailleur affecté à l'un de ces postes bénéficie d'un suivi individuel renforcé de son état de santé (R. 4624-22)."),
      h("2. Les compléments décidés par l'employeur : un formalisme strict (R. 4624-23, III)"),
      puce("L'employeur peut compléter la liste s'il le juge nécessaire — mais alors : après avis du ou des médecins concernés ET du comité social et économique s'il existe ; en cohérence avec l'évaluation des risques (L. 4121-3) et, le cas échéant, la fiche d'entreprise (R. 4624-46)."),
      puce("La liste est transmise au service de prévention et de santé au travail, tenue à disposition de l'administration du travail et des services de prévention des organismes de sécurité sociale, et MISE À JOUR TOUS LES ANS."),
      puce("L'employeur MOTIVE PAR ÉCRIT l'inscription de tout poste sur cette liste."),
      h("3. Liste des postes de " + nomE(p) + " (exemple pour une activité " + s.nom + ")"),
      puce(`Poste : ${ex(s.unites[1] ? s.unites[1][0] : "Atelier")} — catégorie : ${ex("risque de chute de hauteur lors du montage-démontage d'échafaudages (R. 4624-23, I, 7°)")} — effectif concerné : ${ex("6 salariés")} — motivation : ${ex("interventions programmées sur échafaudages, cotées priorité 1 au document unique")}.`),
      puce(`Poste : ${ex("Atelier peinture / produits")} — catégorie : ${ex("agents CMR de R. 4412-60 (I, 3°)")} — effectif : ${ex("4 salariés")} — motivation : ${ex("fiches de données de sécurité des produits utilisés, mesurages d'exposition du " + plusJours(p, -180))}.`),
      puce(`Poste : ${ex("Maintenance électrique haute tension")} — catégorie : ${ex("poste conditionné à un examen d'aptitude spécifique (II)")} — effectif : ${ex("3 salariés")}.`),
      puce(`Poste complété par l'employeur (III) : ${ex("cariste en zone de coactivité intense")} — motivation écrite : ${ex("densité de circulation et coactivité relevées au document unique ; avis favorable du médecin du travail du " + plusJours(p, -30) + " ; avis du comité recueilli en réunion du " + plusJours(p, -20))}.`),
      puce(`Total exposé dans l'exemple : ${ex(String(concernes) + " salariés sur " + eff(p))}.`),
      h("4. Le suivi renforcé, en pratique (exemple daté)"),
      puce(`Examen médical d'aptitude AVANT affectation pour tout nouveau salarié d'un poste listé : ${ex("blocage de l'affectation dans le SIRH tant que l'avis n'est pas rendu")}.`),
      puce(`Périodicité renforcée fixée par le médecin du travail : ${ex("visite intermédiaire à mi-période, périodicité individualisée notifiée par le service")} — l'exemple retient ${ex("un examen tous les deux ans, visite intermédiaire l'année médiane")}.`),
      puce(`Rattrapage des salariés déjà en poste sans suivi : ${ex("liste de 5 salariés transmise au service le " + plusJours(p, 7) + ", examens programmés avant le " + plusJours(p, 60))}.`),
      h("5. Vie de la liste"),
      puce(`Transmission au service de prévention et de santé au travail : le ${ex(plusJours(p, 10))} — accusé conservé.`),
      puce(`Mise à jour annuelle : portée à l'agenda le ${ex(plusJours(p, 365))} ; révision à chaque création de poste ou changement de procédé.`),
      puce(`Articulation avec le document unique et la fiche d'entreprise : ${ex("les unités de travail cotées priorité 1 sont revues à chaque mise à jour du DUERP")}.`),
      ...aPers(["Les postes réels et les catégories dont ils relèvent — l'évaluation ne se délègue pas à un modèle",
        "La motivation écrite de chaque poste ajouté au titre du III, et les avis recueillis",
        "Les effectifs exposés et l'état réel du suivi médical",
        "La date de transmission au service et l'échéance de mise à jour annuelle"])],
  }; },

  "SOC-SST-FORMATION-SECU": p => {
    const s = secteurProfil(p);
    return {
    titre: "Fiche d'accueil sécurité complète, par poste",
    lignes: [...entete(p, "formation pratique et appropriée à la sécurité (L. 4141-2)"),
      h("1. Qui est formé (L. 4141-2)"),
      puce("Les travailleurs embauchés ; ceux qui changent de poste ou de technique ; les salariés temporaires (hors travaux urgents avec qualification déjà acquise) ; et, à la demande du médecin du travail, ceux qui reprennent après un arrêt — la formation est répétée périodiquement."),
      h("2. Contenu du parcours (exemple pour une activité " + s.nom + ")"),
      puce(`Accueil général : circulation dans l'établissement (${ex("plan remis, zones piétons/engins")}), conduite en cas d'accident ou de sinistre (${ex("consigne incendie, sauveteurs secouristes affichés")}), droit de retrait et registre des alertes.`),
      puce(`Risques du poste et mesures : ${ex(s.unites[0][1] + " — " + s.unites[0][2])}.`),
      puce(`Équipements de protection remis : ${ex("chaussures, gants, gilet — contre émargement")}.`),
      puce(`Démonstration au poste et période d'accompagnement : ${ex("une journée en binôme avec un tuteur désigné")}.`),
      h("3. Fiche à émarger (exemple rempli)"),
      par(ex("Salariée : OKAFOR Ngozi — poste : préparatrice de commandes — date : " + plusJours(p, 1) + " — formateur : Dominique BERNARD — durée : 3 h 30 — supports remis : livret sécurité v4, plan de circulation — émargements : la salariée, le formateur")),
      par(`Renouvellement : ${ex("à chaque changement de poste, et rappel collectif annuel en " + (Number(jour0(p).slice(0, 4)) + 1))} — les fiches sont conservées par ${ex("le service RH")} : une formation non prouvée n'existe pas au contentieux.`),
      ...aPers(["Le contenu par poste réel (l'exemple couvre le premier poste type de votre secteur)",
        "Les tuteurs et formateurs désignés",
        "Le circuit d'archivage des fiches émargées"]),
      noteFin("les obligations de formation renforcée propres à certains métiers (par exemple les personnels roulants) relèvent de textes et de conventions non vérifiés ici — à compléter selon la convention " + ccn(p) + ".")],
  }; },

  /* ─────────────────────────────────────── formation, entretiens ─────── */

  "SOC-FOR-ENTRETIENS": p => ({
    titre: "Entretien de parcours professionnel : trame complète et campagne de rattrapage",
    lignes: [...entete(p, "entretiens de parcours professionnel (L. 6315-1)"),
      h("1. Les échéances (L. 6315-1, rédaction en vigueur)"),
      puce("Un entretien au cours de la première année suivant l'embauche, puis tous les quatre ans (un accord collectif peut fixer une autre périodicité, sans excéder quatre ans)."),
      puce("Proposé systématiquement au retour des absences longues (maternité, adoption, congé parental, proche aidant, sabbatique, mobilité volontaire sécurisée, temps partiel parental, arrêt longue maladie, mandat syndical) si aucun entretien n'a eu lieu dans les douze mois précédant la reprise."),
      puce("Tous les huit ans : état des lieux récapitulatif (le premier possible sept ans après le premier entretien) — document écrit, copie remise ; dans les entreprises d'au moins cinquante salariés, une carence (entretiens non tenus et aucune formation non obligatoire) déclenche l'abondement correctif du compte personnel de formation."),
      puce("Organisé dans les deux mois suivant la visite médicale de mi-carrière ; lors du premier entretien dans les deux ans précédant le soixantième anniversaire : maintien dans l'emploi et aménagements de fin de carrière."),
      h("2. Trame de l'entretien (les cinq points du I)"),
      puce("1° Compétences et qualifications mobilisées, et leur évolution possible au regard des transformations de l'entreprise ;"),
      puce("2° situation et parcours au regard des évolutions des métiers et des perspectives d'emploi ;"),
      puce("3° besoins de formation (activité actuelle, évolution de l'emploi, projet personnel) ;"),
      puce("4° souhaits d'évolution — reconversion interne ou externe, projet de transition, bilan de compétences, validation des acquis ;"),
      puce("5° activation du compte personnel de formation, abondements que l'employeur peut financer, conseil en évolution professionnelle."),
      par("L'entretien ne porte pas sur l'évaluation du travail ; il est conduit par un supérieur hiérarchique ou un représentant de la direction, pendant le temps de travail, et donne lieu à un document écrit dont copie est remise au salarié."),
      h("3. Exemple rempli (fictif)"),
      par(ex("Salarié : DURAND Paul, conducteur SPL, embauché le 15/09/2018 — entretien du " + plusJours(p, 20) + " conduit par Camille MARTIN. Compétences : conduite SPL, ADR ; évolution possible : formateur interne. Souhait : passage à l'exploitation d'ici trois ans. Besoins : formation exploitation transport. CPF : activé, abondement employeur évoqué. Prochain entretien : " + (Number(jour0(p).slice(0, 4)) + 4) + ".")),
      h("4. Campagne de rattrapage (exemple)"),
      puce(`Extraction des dates de dernier entretien pour les ${eff(p)} salariés : le ${ex(plusJours(p, 7))} — salariés hors échéance : ${ex("214")}.`),
      puce(`Vague 1 (retours d'absence et échéances les plus anciennes) : ${ex("du " + plusJours(p, 21) + " au " + plusJours(p, 60))} ; vague 2 : ${ex("le trimestre suivant")}.`),
      puce(`États des lieux de huit ans à établir : ${ex("57")} — provision d'abondement correctif si carence avérée : ${ex("à chiffrer avec l'expert paie")}.`),
      ...aPers(["La périodicité qu'un accord d'entreprise ou de branche a pu fixer (quatre ans au plus)",
        "Les volumes réels de la campagne de rattrapage",
        "Le circuit de remise et d'archivage des documents écrits"])],
  }),

  "SOC-FOR-ADAPTATION": p => {
    const s = secteurProfil(p);
    return {
    titre: "Plan de développement des compétences : squelette complet chiffré",
    lignes: [...entete(p, "adaptation au poste et maintien de la capacité à occuper un emploi (L. 6321-1)"),
      h("1. Le socle légal"),
      par("L'employeur assure l'adaptation des salariés à leur poste de travail et veille au maintien de leur capacité à occuper un emploi, au regard notamment de l'évolution des emplois, des technologies et des organisations (L. 6321-1) — l'obligation pèse sur l'employeur même sans demande des salariés."),
      h("2. Recueil des besoins (exemple)"),
      puce(`Évolutions identifiées pour une activité ${s.nom} : ${ex("numérisation de l'exploitation, nouvelles motorisations, exigences clients qualité")}.`),
      puce(`Besoins remontés des entretiens de parcours professionnel : ${ex("bureautique et outils métier (54 demandes), habilitations à renouveler (23), management de proximité (11)")}.`),
      h("3. Plan (exemple chiffré)"),
      puce(`Adaptation au poste : ${ex("outils d'exploitation — 60 salariés, 1 jour ; habilitations et recyclages — 23 salariés")}.`),
      puce(`Maintien de l'employabilité : ${ex("parcours numérique de base — 40 salariés ; français professionnel — 8 salariés")}.`),
      puce(`Développement : ${ex("management de proximité — 11 salariés ; VAE accompagnées — 4")}.`),
      puce(`Budget : ${ex("310 000 €, dont contributions conventionnelles éventuelles à vérifier auprès de l'opérateur de compétences")} — calendrier : ${ex("plan annuel, revue semestrielle")}.`),
      h("4. Gouvernance"),
      puce(`Consultation du comité social et économique sur le plan : ${ex("avec la consultation politique sociale, réunion du " + plusJours(p, 60))}.`),
      puce(`Traçabilité : ${ex("émargements et attestations archivés au SIRH")} — un salarié jamais formé sur toute une carrière est un risque contentieux avéré.`),
      ...aPers(["Les évolutions réelles de vos métiers et outils",
        "Les actions, effectifs et budget de votre plan",
        "Les obligations de formation propres à votre branche (à compléter selon la convention " + ccn(p) + ")"])],
  }; },

  /* ─────────────────────────────── épargne et protection sociale ─────── */

  "SOC-EPA-PARTICIPATION": p => ({
    titre: "Mise en place de la participation : lettre de cadrage complète",
    lignes: [...entete(p, "participation des salariés aux résultats (L. 3322-2)"),
      h("1. Le cadre"),
      par("Les entreprises employant au moins cinquante salariés garantissent le droit de leurs salariés à participer aux résultats de l'entreprise ; la base, les modalités de calcul, d'affectation et de gestion sont fixées par accord (L. 3322-2). L'échéance exacte de l'obligation dépend de la durée de maintien de l'effectif au-dessus du seuil — faites-la caler par votre expert : la loi aménage un différé, non vérifié ici."),
      h("2. Chiffrage préparatoire (exemple fictif)"),
      puce(`Calcul de la réserve spéciale de participation par l'expert-comptable sur les exercices ${ex(String(Number(jour0(p).slice(0, 4)) - 2) + " et " + String(Number(jour0(p).slice(0, 4)) - 1))} : ${ex("réserve estimée à 1 240 000 € au titre du dernier exercice")}.`),
      puce(`Répartition envisagée : ${ex("50 % uniforme, 50 % proportionnelle au salaire dans la limite des plafonds")} — gestion : ${ex("plan d'épargne d'entreprise, fonds diversifiés")}.`),
      h("3. Calendrier de négociation (exemple)"),
      puce(`Invitation des délégués syndicaux et du comité à négocier l'accord : le ${ex(plusJours(p, 10))} — réunions les ${ex(plusJours(p, 24) + " et " + plusJours(p, 45))}.`),
      puce(`Signature visée : le ${ex(plusJours(p, 60))} — dépôt sur la plateforme des accords collectifs : le ${ex(plusJours(p, 67))} (le dépôt conditionne les exonérations).`),
      puce(`Information des salariés (livret d'épargne salariale, notice) : le ${ex(plusJours(p, 75))}.`),
      h("4. Points de vigilance"),
      puce("À défaut d'accord dans les délais, un régime d'autorité s'applique, moins favorable à l'employeur — l'échéance précise relève de textes non vérifiés ici : faites-la confirmer."),
      puce(`Articulation avec les dispositifs existants (${ex("intéressement en vigueur jusqu'au " + (Number(jour0(p).slice(0, 4)) + 1))}) et avec la convention ${ccn(p)} : à compléter selon la convention.`),
      ...aPers(["Les exercices de référence et la réserve réellement calculée",
        "La formule de répartition et le support de gestion choisis",
        "Les dates de négociation, de signature et de dépôt",
        "L'échéance légale exacte, calée par l'expert"])],
  }),

  "SOC-EPA-LIVRET": p => ({
    titre: "Livret d'épargne salariale : sommaire complet et exemple rempli",
    lignes: [...entete(p, "livret d'épargne salariale remis à la conclusion du contrat de travail (L. 3341-6)"),
      h("1. L'obligation, lue à la source"),
      par("Tout salarié d'une entreprise proposant un dispositif d'intéressement, de participation, un plan d'épargne entreprise, un plan d'épargne interentreprises, un plan d'épargne pour la retraite collectif ou un plan d'épargne retraite d'entreprise collectif reçoit, LORS DE LA CONCLUSION DE SON CONTRAT DE TRAVAIL, un livret d'épargne salariale présentant les dispositifs mis en place au sein de l'entreprise. Le livret est également porté à la connaissance des représentants du personnel, le cas échéant en tant qu'élément de la base de données économiques, sociales et environnementales établie en application de l'article L. 2312-18 (L. 3341-6)."),
      par("Deux points souvent manqués : la remise se fait À LA CONCLUSION DU CONTRAT, pas au premier versement ; et les représentants du personnel en sont destinataires, la BDESE étant le véhicule naturel."),
      h("2. Sommaire du livret de " + nomE(p) + " (structure complète)"),
      puce("Page 1 — Ce qu'est l'épargne salariale : les dispositifs en place dans l'entreprise, en une page, avec la date de leur mise en place et leur échéance."),
      puce(`Fiche A — Intéressement : ${ex("accord du " + plusJours(p, -400) + ", triennal ; formule liée au résultat d'exploitation et à un critère qualité ; prime moyenne versée l'an dernier : 640 €")} ; date de versement, choix perception immédiate / placement, délai de choix.`),
      puce(`Fiche B — Participation : ${ex("accord du " + plusJours(p, -700) + " ; réserve spéciale de participation de 1 240 000 € au titre du dernier exercice ; répartition 50 % uniforme, 50 % proportionnelle au salaire")} ; règles d'indisponibilité et cas de déblocage anticipé.`),
      puce(`Fiche C — Plan d'épargne d'entreprise : ${ex("teneur de compte Épargne Horizon ; abondement employeur de 100 % dans la limite de 800 € par an ; cinq supports de placement, du monétaire à l'actions")} ; frais à la charge de l'entreprise et à la charge du salarié.`),
      puce(`Fiche D — Plan d'épargne retraite d'entreprise collectif : ${ex("mis en place le " + plusJours(p, -300) + " ; abondement 50 % dans la limite de 500 € ; gestion pilotée par horizon de retraite par défaut")} ; modalités de sortie.`),
      puce("Fiche E — Vos choix et vos délais : où et comment exprimer un choix, ce qui se passe à défaut de choix (affectation par défaut), comment modifier une affectation."),
      puce("Fiche F — Déblocages anticipés : la liste des cas applicables à chaque dispositif, et la procédure interne pour les demander."),
      puce("Fiche G — Que devient votre épargne si vous quittez l'entreprise : état récapitulatif remis au départ, frais de tenue de compte après le départ, coordonnées du teneur de compte."),
      puce(`Fiche H — Vos interlocuteurs : ${ex("service paie (poste 4310), teneur de compte Épargne Horizon (0 800 000 000, espace en ligne), et les représentants du personnel")}.`),
      h("3. Circuit de remise (exemple daté)"),
      puce(`Intégration au dossier d'embauche : ${ex("le livret est joint au contrat, remis contre émargement le jour de la signature — case bloquante dans le SIRH")}, à compter du ${ex(plusJours(p, 15))}.`),
      puce(`Salariés déjà présents jamais destinataires : ${ex("campagne de rattrapage, remise avec la paie de " + plusJours(p, 45).slice(0, 7))} — la loi vise la conclusion du contrat, mais un salarié non informé conteste utilement les affectations par défaut.`),
      puce(`Communication aux représentants du personnel : ${ex("versement du livret à la rubrique « rémunération des salariés et dirigeants » de la BDESE le " + plusJours(p, 20) + ", et information en réunion du comité")}.`),
      puce(`Mise à jour : ${ex("à chaque avenant d'accord et au moins une fois par an — version datée en pied de page")}.`),
      h("4. Ce qui ne s'affirme pas ici"),
      par("Les règles de fond de chaque dispositif (plafonds, régime social et fiscal, cas de déblocage, délais de versement) relèvent de textes que le relais de cette application ne sert pas tous : reprenez-les des accords eux-mêmes et des notices du teneur de compte, et faites relire le livret avant diffusion. Seul l'article L. 3341-6, lu à la source, fonde ici l'obligation de remise."),
      ...aPers(["La liste réelle de vos dispositifs et les références de leurs accords",
        "Les chiffres de chaque fiche (formule, abondement, montants versés) — l'exemple est fictif",
        "Le teneur de compte et les interlocuteurs",
        "La date d'entrée en vigueur du circuit de remise et la campagne de rattrapage"])],
  }),

  "SOC-EPA-SANTE": p => ({
    titre: "Complémentaire santé : décision unilatérale complète (trame article par article)",
    lignes: [...entete(p, "mise en place de la couverture santé collective (code de la sécurité sociale — hors du champ du relais : à vérifier)"),
      h("Décision unilatérale de l'employeur — trame"),
      par(`« Article 1 — Objet. La direction de ${nomE(p)} institue un régime collectif et obligatoire de remboursement de frais de santé au profit de l'ensemble du personnel, à effet du ${ex(plusJours(p, 45))}.`),
      par(`Article 2 — Bénéficiaires et dispenses. Sont couverts tous les salariés, sous réserve des cas de dispense d'ordre public et de ceux prévus par le présent acte — ${ex("salariés couverts par ailleurs en tant qu'ayants droit, contrats courts, apprentis")} — chaque dispense étant formalisée par écrit et archivée.`),
      par(`Article 3 — Organisme et garanties. Contrat collectif souscrit auprès de ${ex("Mutuelle Horizon")}, garanties conformes au panier minimal et au cahier des charges des contrats responsables (textes du code de la sécurité sociale, à vérifier), niveau ${ex("base + option famille")}.`),
      par(`Article 4 — Cotisations. Cotisation mensuelle ${ex("de 62 €")}, prise en charge par l'employeur à hauteur de ${ex("50 %")} — la part patronale minimale et son régime social relèvent de textes non vérifiés ici : faites-les confirmer avant signature.`),
      par(`Article 5 — Information. Remise à chaque salarié de la présente décision et de la notice d'information de l'assureur, contre émargement — ${ex("avec la paie du mois prochain")}.`),
      par(`Article 6 — Durée et révision. Durée indéterminée ; révision ou dénonciation selon les règles applicables aux décisions unilatérales, avec information préalable des salariés et du comité. »`),
      h("Vérifications avant signature"),
      puce(`Exigences de la convention ${ccn(p)} (garanties, taux, organisme recommandé éventuel) : à compléter selon la convention.`),
      puce("Consultation du comité social et économique avant mise en place : à documenter."),
      puce(`Rétroactif : vérifier qu'aucune période passée n'est découverte — ${ex("audit paie sur vingt-quatre mois")}.`),
      ...aPers(["L'organisme, les garanties et les cotisations réelles",
        "Les cas de dispense retenus et leur formalisation",
        "Les exigences conventionnelles et le panier minimal en vigueur (textes hors relais, à vérifier)",
        "La date d'effet et la preuve de remise des notices"])],
  }),

  "SOC-EPA-PREVOYANCE-CADRES": p => {
    const n = effN(p);
    const cadres = n !== null ? Math.max(1, Math.round(n * 0.15)) : 18;
    return {
    titre: "Prévoyance des cadres : audit de couverture et courrier complet à l'assureur",
    lignes: [...entete(p, "couverture de prévoyance des cadres — obligation d'origine conventionnelle : à vérifier sur vos textes"),
      h("1. Audit de couverture (exemple chiffré)"),
      puce(`Population cadre et assimilée identifiée : ${ex(String(cadres) + " salariés sur " + eff(p))} — liste extraite de la paie le ${ex(plusJours(p, 5))}.`),
      puce(`Contrat en vigueur : ${ex("aucun contrat décès dédié aux cadres retrouvé — carence présumée depuis le 01/01/" + (Number(jour0(p).slice(0, 4)) - 2))}.`),
      puce(`Ce que prévoient les textes conventionnels (accord national interprofessionnel et convention ${ccn(p)}) — cotisation patronale dédiée sur la tranche A, affectée en priorité au risque décès : à compléter selon la convention, le relais ne servant que le code du travail.`),
      h("2. Courrier à l'assureur (trame complète)"),
      par(`« À ${ex("Prévoyance Mutualiste du Centre")} — Nous souhaitons souscrire sans délai un contrat de prévoyance couvrant notre population cadre (${ex(String(cadres) + " personnes")}, liste jointe) : capital décès, invalidité, incapacité, avec cotisation patronale affectée en priorité au risque décès conformément aux textes conventionnels applicables — que nous vous demandons de viser expressément au contrat. Merci de nous proposer une prise d'effet au ${ex(plusJours(p, 15))} et de nous indiquer si une reprise du passif (décès survenus pendant la période non couverte) est assurable. »`),
      h("3. Pourquoi c'est la première urgence de sa catégorie"),
      par("En cas de décès d'un cadre non couvert, l'employeur s'expose à devoir lui-même le capital aux ayants droit selon les textes conventionnels — un risque à six chiffres qui ne se rattrape pas rétroactivement. Rien n'est affirmé ici sur un texte non lu : faites viser les stipulations exactes (assiette, taux, ordre d'affectation) par votre conseil, textes conventionnels en main."),
      ...aPers(["La liste réelle des cadres et assimilés (les catégories objectives se définissent au regard des textes en vigueur)",
        "Les stipulations exactes de votre convention (assiette, taux, risques) — à compléter selon la convention",
        "La date d'effet et la question du passif",
        "La cohérence avec le régime de prévoyance éventuel des non-cadres"])],
  }; },

  "SOC-CCN-OBLIGATIONS": p => ({
    titre: "Revue de conformité conventionnelle : grille complète avec exemple d'état",
    lignes: [...entete(p, "revue de conformité à la convention collective " + ccn(p)),
      h("1. Se procurer les textes"),
      puce(`Texte consolidé de la convention et de ses avenants (Légifrance, éditions de branche) : version à jour téléchargée le ${ex(plusJours(p, 3))}, référencée ${ex("avec ses avenants salaires les plus récents")}.`),
      par("Rien de précis n'est affirmé ici sur le contenu de la convention : le relais de l'application ne sert que le code du travail — chaque ligne ci-dessous se vérifie SUR le texte conventionnel."),
      h("2. Grille de revue (exemple d'état fictif)"),
      puce(`Classification : chaque salarié rattaché à un emploi et un coefficient de la grille — ${ex("12 salariés sans coefficient au contrat : à régulariser")}.`),
      puce(`Salaires minima : paie confrontée aux minima de branche par coefficient — ${ex("3 écarts détectés sur les embauches récentes, rappels chiffrés à 4 700 €")}.`),
      puce(`Primes et indemnités conventionnelles (ancienneté, vacances, paniers, déplacements…) : ${ex("prime d'ancienneté non versée aux temps partiels — à corriger et rappeler")}.`),
      puce(`Prévoyance et frais de santé de branche : ${ex("taux et garanties du contrat comparés aux minima conventionnels — conforme sous réserve de l'avenant en cours")}.`),
      puce(`Durée du travail et sujétions propres au secteur ${q(p.secteur) || "d'activité"} : ${ex("amplitudes, temps de liaison, indemnisation des découchés — revue avec l'exploitation")}.`),
      puce(`Jours conventionnels (congés supplémentaires, jours fériés garantis, événements familiaux) : ${ex("paramétrage SIRH vérifié")}.`),
      puce(`Maintien de salaire maladie et carences : ${ex("règles de la convention comparées au paramétrage paie")}.`),
      h("3. Suites"),
      puce(`Écarts corrigés et rappels versés : ${ex("paie de " + plusJours(p, 60).slice(0, 7))} — provision : ${ex("18 000 €")}.`),
      puce(`Revue documentée et archivée ; prochaine revue : ${ex("dans douze mois, ou à chaque avenant de branche")} — responsable : ${ex("Camille MARTIN, avec l'expert paie")}.`),
      ...aPers(["L'intitulé exact et la version à jour de votre convention et de ses avenants",
        "Chaque ligne de la grille, vérifiée sur le texte conventionnel — les états ci-dessus sont fictifs",
        "Le chiffrage des rappels et la période de reprise (la prescription se vérifie avec votre conseil)"])],
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
  "C'est lui qui ouvre ou ferme la plupart des obligations : 11 (comité, et formation santé-sécurité de ses élus), 20 (emploi des travailleurs handicapés), 50 (règlement intérieur, BDESE, index, participation, quatre réunions santé-sécurité), 250 (référent harcèlement), 300 (CSSCT, commissions formation/logement/égalité), 1 000 (commission économique). La commission des marchés, elle, ne dépend pas de l'effectif de l'entreprise mais des comptes du comité.");
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
q("salariesHorsHoraire", "Des salariés travaillent-ils en dehors d'un horaire collectif uniforme (horaires individualisés, équipes, forfaits, itinérants) ?", "oui / non",
  "Dès qu'un salarié ne suit pas l'horaire collectif affiché, l'employeur doit établir pour lui les documents de décompte de la durée du travail et des repos compensateurs (L. 3171-2).");
q("postesRisquesParticuliers", "Des salariés occupent-ils des postes à risques particuliers (amiante, plomb, agents cancérogènes, agents biologiques 3 et 4, rayonnements ionisants, hyperbare, échafaudages, postes à examen d'aptitude) ?", "oui / non",
  "Ces postes ouvrent le suivi individuel renforcé de l'état de santé et la liste formalisée des postes (R. 4624-22, R. 4624-23).");
q("comiteSeuilsComptes", "Les comptes du comité dépassent-ils au moins deux des trois critères de l'article D. 2315-29 — cinquante salariés du comité à la clôture d'un exercice, le montant de ressources annuelles et le montant du total de bilan fixés par renvoi à l'article R. 612-1 du code de commerce ?", "oui / non",
  "C'est le critère de la commission des marchés : il tient aux comptes du comité, pas à l'effectif de l'entreprise (L. 2315-44-1, D. 2315-29). Le trésorier du comité ou son expert-comptable a la réponse.");
q("epargneSalariale", "Un dispositif d'épargne salariale (intéressement, participation, plan d'épargne) est-il en place ?", "oui / non",
  "Il déclenche la remise du livret d'épargne salariale à chaque embauche (L. 3341-6).");
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
 },
 "L1321-2-1": {
  "id": "LEGIARTI000033001625",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur peut contenir des dispositions inscrivant le principe de neutralité et restreignant la manifestation des convictions des salariés si ces restrictions sont justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise et si elles sont proportionnées au but recherché."
 },
 "L1321-3": {
  "id": "LEGIARTI000033975667",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur ne peut contenir : 1° Des dispositions contraires aux lois et règlements ainsi qu'aux stipulations des conventions et accords collectifs de travail applicables dans l'entreprise ou l'établissement ; 2° Des dispositions apportant aux droits des personnes et aux libertés individuelles et collectives des restrictions qui ne seraient pas justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché ; 3° Des dispositions discriminant les salariés dans leur emploi ou leur travail, à capacité professionnelle égale, en raison de leur origine, de leur sexe, de leurs mœurs, de leur orientation sexuelle ou identité de genre, de leur âge, de leur situation de famille ou de leur grossesse, de leurs caractéristiques génétiques, de leur appartenance ou de leur non-appartenance, vraie ou supposée, à une ethnie, une nation ou une race, de leurs opinions politiques, de leurs activités syndicales ou mutualistes, de leurs convictions religieuses, de leur apparence physique, de leur nom de famille ou en raison de leur état de santé ou de leur handicap."
 },
 "L1321-5": {
  "id": "LEGIARTI000035653093",
  "date": "2026-08-19",
  "texte": "Les notes de service ou tout autre document comportant des obligations générales et permanentes dans les matières mentionnées aux articles L. 1321-1 et L. 1321-2 sont, lorsqu'il existe un règlement intérieur, considérées comme des adjonctions à celui-ci. Ils sont, en toute hypothèse, soumis aux dispositions du présent titre. Toutefois, lorsque l'urgence le justifie, les obligations relatives à la santé et à la sécurité peuvent recevoir application immédiate. Dans ce cas, ces prescriptions sont immédiatement et simultanément communiquées au secrétaire du comité social et économique ainsi qu'à l'inspection du travail."
 },
 "L1321-6": {
  "id": "LEGIARTI000006901439",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur est rédigé en français. Il peut être accompagné de traductions en une ou plusieurs langues étrangères. Il en va de même pour tout document comportant des obligations pour le salarié ou des dispositions dont la connaissance est nécessaire pour l'exécution de son travail. Ces dispositions ne sont pas applicables aux documents reçus de l'étranger ou destinés à des étrangers."
 },
 "L2315-38": {
  "id": "LEGIARTI000035626459",
  "date": "2026-08-19",
  "texte": "La commission santé, sécurité et conditions de travail se voit confier, par délégation du comité social et économique, tout ou partie des attributions du comité relatives à la santé, à la sécurité et aux conditions de travail, à l'exception du recours à un expert prévu à la sous-section 10 et des attributions consultatives du comité."
 },
 "L2315-39": {
  "id": "LEGIARTI000036262434",
  "date": "2026-08-19",
  "texte": "La commission est présidée par l'employeur ou son représentant. Elle comprend au minimum trois membres représentants du personnel, dont au moins un représentant du second collège, ou le cas échéant du troisième collège prévus à l'article L. 2314-11 . Les membres de la commission santé, sécurité et conditions de travail sont désignés par le comité social et économique parmi ses membres, par une résolution adoptée selon les modalités définies à l'article L. 2315-32 , pour une durée qui prend fin avec celle du mandat des membres élus du comité. Lorsque l'accord confie tout ou partie des attributions du comité social et économique à la commission santé, sécurité et conditions de travail, les dispositions de l' article L. 2314-3 s'appliquent aux réunions de la commission. L'employeur peut se faire assister par des collaborateurs appartenant à l'entreprise et choisis en dehors du comité. Ensemble, ils ne peuvent pas être en nombre supérieur à celui des représentants du personnel titulaires. Les dispositions de l'article L. 2315-3 relatives au secret professionnel et à l'obligation de discrétion leur sont applicables."
 },
 "L2315-41": {
  "id": "LEGIARTI000035626467",
  "date": "2026-08-19",
  "texte": "L'accord d'entreprise défini à l'article L. 2313-2 fixe les modalités de mise en place de la ou des commissions santé, sécurité et conditions de travail en application des articles L. 2315-36 et L. 2315-37 , en définissant : 1° Le nombre de membres de la ou des commissions ; 2° Les missions déléguées à la ou les commissions par le comité social et économique et leurs modalités d'exercice ; 3° Leurs modalités de fonctionnement, notamment le nombre d'heures de délégation dont bénéficient les membres de la ou des commissions pour l'exercice de leurs missions ; 4° Les modalités de leur formation conformément aux articles L. 2315-16 à L. 2315-18 ; 5° Le cas échéant, les moyens qui leur sont alloués ; 6° Le cas échéant, les conditions et modalités dans lesquelles une formation spécifique correspondant aux risques ou facteurs de risques particuliers, en rapport avec l'activité de l'entreprise peut être dispensée aux membres de la commission."
 },
 "D1221-23": {
  "id": "LEGIARTI000018537878",
  "date": "2026-08-19",
  "texte": "Les indications complémentaires portées sur le registre unique du personnel pour chaque salarié, mentionnées au troisième alinéa de l'article L. 1221-13 , sont les suivantes : 1° La nationalité ; 2° La date de naissance ; 3° Le sexe ; 4° L'emploi ; 5° La qualification ; 6° Les dates d'entrée et de sortie de l'établissement ; 7° Lorsqu'une autorisation d'embauche ou de licenciement est requise, la date de cette autorisation ou, à défaut, la date de la demande d'autorisation ; 8° Pour les travailleurs étrangers assujettis à la possession d'un titre autorisant l'exercice d'une activité salariée, le type et le numéro d'ordre du titre valant autorisation de travail ; 9° Pour les travailleurs titulaires d'un contrat de travail à durée déterminée, la mention « contrat à durée déterminée » ; 10° Pour les salariés temporaires, la mention « salarié temporaire » ainsi que le nom et l'adresse de l'entreprise de travail temporaire ; 11° Pour les travailleurs mis à disposition par un groupement d'employeurs, la mention « mis à disposition par un groupement d'employeurs » ainsi que la dénomination et l'adresse de ce dernier ; 12° Pour les salariés à temps partiel, la mention « salarié à temps partiel » ; 13° Pour les jeunes travailleurs titulaires d'un contrat d'apprentissage ou de professionnalisation, la mention « apprenti » ou « contrat de professionnalisation »."
 },
 "L2314-4": {
  "id": "LEGIARTI000035651165",
  "date": "2026-08-19",
  "texte": "Lorsque le seuil de onze salariés a été franchi dans les conditions prévues au deuxième alinéa de l'article L. 2311-2 , l'employeur informe le personnel tous les quatre ans de l'organisation des élections par tout moyen permettant de conférer date certaine à cette information. Le document diffusé précise la date envisagée pour le premier tour. Celui-ci doit se tenir, au plus tard, le quatre-vingt-dixième jour suivant la diffusion."
 },
 "L2314-5": {
  "id": "LEGIARTI000035651159",
  "date": "2026-08-19",
  "texte": "Sont informées, par tout moyen, de l'organisation des élections et invitées à négocier le protocole d'accord préélectoral et à établir les listes de leurs candidats aux fonctions de membre de la délégation du personnel les organisations syndicales qui satisfont aux critères de respect des valeurs républicaines et d'indépendance, légalement constituées depuis au moins deux ans et dont le champ professionnel et géographique couvre l'entreprise ou l'établissement concernés. Les organisations syndicales reconnues représentatives dans l'entreprise ou l'établissement, celles ayant constitué une section syndicale dans l'entreprise ou l'établissement, ainsi que les syndicats affiliés à une organisation syndicale représentative au niveau national et interprofessionnel y sont également invités par courrier. Dans le cas d'un renouvellement de l'institution, cette invitation est effectuée deux mois avant l'expiration du mandat des délégués en exercice. Le premier tour des élections a lieu dans la quinzaine précédant l'expiration de ce mandat. L'invitation à négocier mentionnée au présent article doit parvenir au plus tard quinze jours avant la date de la première réunion de négociation. Par dérogation aux premier et deuxième alinéas, dans les entreprises dont l'effectif est compris entre onze et vingt salariés, l'employeur invite les organisations syndicales mentionnées aux mêmes alinéas à cette négociation à la condition qu'au moins un salarié se soit porté candidat aux élections dans un délai de trente jours à compter de l'information prévue à l'article L. 2314-4 . Le salarié bénéficie de la protection prévue aux articles L. 2411-7 , L. 2412-3 et L. 2413-1 à compter de la date à laquelle l'employeur a eu connaissance de l'imminence de sa candidature."
 },
 "L2315-45": {
  "id": "LEGIARTI000036262551",
  "date": "2026-08-19",
  "texte": "Un accord d'entreprise conclu dans les conditions prévues au premier alinéa de l'article L. 2232-12 peut prévoir la création de commissions supplémentaires pour l'examen de problèmes particuliers. Le cas échéant, l'employeur peut adjoindre à ces commissions avec voix consultative des experts et des techniciens appartenant à l'entreprise et choisis en dehors du comité. Les dispositions de l'article L. 2315-3 relatives au secret professionnel et à l'obligation de discrétion leur sont applicables. Les rapports des commissions sont soumis à la délibération du comité."
 },
 "L2315-46": {
  "id": "LEGIARTI000035626485",
  "date": "2026-08-19",
  "texte": "En l'absence d'accord prévu à l'article L. 2315-45 , dans les entreprises d'au moins mille salariés, une commission économique est créée au sein du comité social et économique ou du comité social et économique central. Cette commission est chargée notamment d'étudier les documents économiques et financiers recueillis par le comité et toute question que ce dernier lui soumet."
 },
 "L2315-49": {
  "id": "LEGIARTI000035626493",
  "date": "2026-08-19",
  "texte": "En l'absence d'accord prévu à l'article L. 2315-45 , dans les entreprises d'au moins trois cents salariés, le comité social et économique constitue une commission de la formation. Cette commission est chargée : 1° De préparer les délibérations du comité prévues aux 1° et 3° de l'article L. 2312-17 dans les domaines qui relèvent de sa compétence ; 2° D'étudier les moyens permettant de favoriser l'expression des salariés en matière de formation et de participer à leur information dans ce domaine ; 3° D'étudier les problèmes spécifiques concernant l'emploi et le travail des jeunes et des travailleurs handicapés."
 },
 "L2315-50": {
  "id": "LEGIARTI000035626497",
  "date": "2026-08-19",
  "texte": "En l'absence d'accord prévu à l'article L. 2315-45 , dans les entreprises d'au moins trois cents salariés, une commission d'information et d'aide au logement des salariés est créée au sein du comité social et économique. Les entreprises de moins de trois cents salariés peuvent se grouper entre elles pour former cette commission."
 },
 "L2315-51": {
  "id": "LEGIARTI000035626499",
  "date": "2026-08-19",
  "texte": "La commission d'information et d'aide au logement facilite le logement et l'accession des salariés à la propriété et à la location des locaux d'habitation. A cet effet, la commission : 1° Recherche les possibilités d'offre de logements correspondant aux besoins du personnel, en liaison avec les organismes habilités à collecter la participation des employeurs à l'effort de construction ; 2° Informe les salariés sur leurs conditions d'accès à la propriété ou à la location d'un logement et les assiste dans les démarches nécessaires pour l'obtention des aides financières auxquelles ils peuvent prétendre."
 },
 "L2315-56": {
  "id": "LEGIARTI000036262545",
  "date": "2026-08-19",
  "texte": "En l'absence d'accord prévu à l'article L. 2315-45 , dans les entreprises d'au moins trois cents salariés, une commission de l'égalité professionnelle est créée au sein du comité social et économique. Cette commission est notamment chargée de préparer les délibérations du comité prévues au 3° de l'article L. 2312-17 , dans les domaines qui relèvent de sa compétence."
 },
 "L2315-44-1": {
  "id": "LEGIARTI000036760263",
  "date": "2026-08-19",
  "texte": "Une commission des marchés est créée au sein du comité social et économique qui dépasse, pour au moins deux des trois critères mentionnés au II de l'article L. 2315-64 , des seuils fixés par décret."
 },
 "D2315-29": {
  "id": "LEGIARTI000037538198",
  "date": "2026-08-19",
  "texte": "Une commission des marchés est créée au sein du comité social et économique qui dépasse, pour au moins deux des trois critères, les seuils suivants : 1° Le nombre de cinquante salariés à la clôture d'un exercice ; 2° Le montant prévu au 2° de l'article R. 612-1 du code de commerce de ressources annuelles définies à l'article D. 2315-34 ; 3° Le montant du total du bilan prévu au 3° de l'article R. 612-1 du code de commerce . Le seuil mentionné à l'article L. 2315-44-2 est fixé à 30 000 euros."
 },
 "L2315-18": {
  "id": "LEGIARTI000043894249",
  "date": "2026-08-19",
  "texte": "Les membres de la délégation du personnel du comité social et économique et le référent prévu au dernier alinéa de l'article L. 2314-1 bénéficient de la formation nécessaire à l'exercice de leurs missions en matière de santé, de sécurité et de conditions de travail prévues au chapitre II du présent titre, dans des conditions déterminées par décret en Conseil d'Etat. La formation est d'une durée minimale de cinq jours lors du premier mandat des membres de la délégation du personnel. En cas de renouvellement de ce mandat, la formation est d'une durée minimale : 1° De trois jours pour chaque membre de la délégation du personnel, quelle que soit la taille de l'entreprise ; 2° De cinq jours pour les membres de la commission santé, sécurité et conditions de travail dans les entreprises d'au moins trois cents salariés. Sans préjudice des dispositions de l'article L. 2315-22-1 , le financement de la formation prévue au premier alinéa du présent article est pris en charge par l'employeur dans des conditions prévues par décret en Conseil d'Etat."
 },
 "L2315-16": {
  "id": "LEGIARTI000035621179",
  "date": "2026-08-19",
  "texte": "Le temps consacré aux formations prévues au présent chapitre est pris sur le temps de travail et est rémunéré comme tel. Il n'est pas déduit des heures de délégation."
 },
 "L2315-27": {
  "id": "LEGIARTI000036761943",
  "date": "2026-08-19",
  "texte": "Au moins quatre réunions du comité social et économique portent annuellement en tout ou partie sur les attributions du comité en matière de santé, sécurité et conditions de travail, plus fréquemment en cas de besoin, notamment dans les branches d'activité présentant des risques particuliers. Le comité est en outre réuni à la suite de tout accident ayant entraîné ou ayant pu entraîner des conséquences graves, ainsi qu'en cas d'événement grave lié à l'activité de l'entreprise, ayant porté atteinte ou ayant pu porter atteinte à la santé publique ou à l'environnement ou à la demande motivée de deux de ses membres représentants du personnel, sur les sujets relevant de la santé, de la sécurité ou des conditions de travail. Lorsque l'employeur est défaillant, et à la demande d'au moins la moitié des membres du comité social et économique, celui-ci peut être convoqué par l'agent de contrôle de l'inspection du travail mentionné à l'article L. 8112-1 et siéger sous sa présidence. L'employeur informe annuellement l'agent de contrôle de l'inspection du travail mentionné à l'article L. 8112-1 , le médecin du travail et l'agent des services de prévention des organismes de sécurité sociale du calendrier retenu pour les réunions consacrées aux sujets relevant de la santé, de la sécurité ou des conditions de travail, et leur confirme par écrit au moins quinze jours à l'avance la tenue de ces réunions."
 },
 "R4624-16": {
  "id": "LEGIARTI000033769063",
  "date": "2026-08-19",
  "texte": "Le travailleur bénéficie d'un renouvellement de la visite d'information et de prévention initiale, réalisée par un professionnel de santé mentionné au premier alinéa de l'article L. 4624-1 , selon une périodicité qui ne peut excéder cinq ans. Ce délai, qui prend en compte les conditions de travail, l'âge et l'état de santé du salarié, ainsi que les risques auxquels il est exposé, est fixé par le médecin du travail dans le cadre du protocole mentionné à l'article L. 4624-1."
 },
 "R4624-22": {
  "id": "LEGIARTI000033769092",
  "date": "2026-08-19",
  "texte": "Tout travailleur affecté à un poste présentant des risques particuliers pour sa santé ou sa sécurité ou pour celles de ses collègues ou des tiers évoluant dans l'environnement immédiat de travail défini à l'article R. 4624-23 bénéficie d'un suivi individuel renforcé de son état de santé selon des modalités définies par la présente sous-section."
 },
 "R4624-23": {
  "id": "LEGIARTI000053786012",
  "date": "2026-08-19",
  "texte": "I.-Les postes présentant des risques particuliers mentionnés au premier alinéa de l'article L. 4624-2 sont ceux exposant les travailleurs : 1° A l'amiante ; 2° Au plomb ; 3° Aux agents cancérogènes, mutagènes ou toxiques pour la reproduction mentionnés à l'article R. 4412-60 ; 4° Aux agents biologiques des groupes 3 et 4 mentionnés à l'article R. 4421-3 ; 5° Aux rayonnements ionisants ; 6° Au risque hyperbare ; 7° Au risque de chute de hauteur lors des opérations de montage et de démontage d'échafaudages. II.-Présente également des risques particuliers tout poste pour lequel l'affectation sur celui-ci est conditionnée à un examen d'aptitude spécifique prévu par le présent code. III.-S'il le juge nécessaire, l'employeur complète la liste des postes entrant dans les catégories mentionnées au I. par des postes présentant des risques particuliers pour la santé ou la sécurité du travailleur ou pour celles de ses collègues ou des tiers évoluant dans l'environnement immédiat de travail mentionnés au premier alinéa de l'article L. 4624-2, après avis du ou des médecins concernés et du comité social et économique s'il existe, en cohérence avec l'évaluation des risques prévue à l'article L. 4121-3 et, le cas échéant, la fiche d'entreprise prévue à l'article R. 4624-46 . Cette liste est transmise au service de prévention et de santé au travail, tenue à disposition du directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi et des services de prévention des organismes de sécurité sociale et mise à jour tous les ans. L'employeur motive par écrit l'inscription de tout poste sur cette liste. IV.-Le Conseil d'orientation des conditions de travail est consulté tous les trois ans sur la mise à jour éventuelle de la liste mentionnée au I du présent article."
 },
 "L3171-2": {
  "id": "LEGIARTI000035653247",
  "date": "2026-08-19",
  "texte": "Lorsque tous les salariés occupés dans un service ou un atelier ne travaillent pas selon le même horaire collectif, l'employeur établit les documents nécessaires au décompte de la durée de travail, des repos compensateurs acquis et de leur prise effective, pour chacun des salariés concernés. Le comité social et économique peut consulter ces documents."
 },
 "L3171-3": {
  "id": "LEGIARTI000033025188",
  "date": "2026-08-19",
  "texte": "L'employeur tient à la disposition de l'agent de contrôle de l'inspection du travail mentionné à l'article L. 8112-1 les documents permettant de comptabiliser le temps de travail accompli par chaque salarié. La nature des documents et la durée pendant laquelle ils sont tenus à disposition sont déterminées par voie réglementaire."
 },
 "R3221-2": {
  "id": "LEGIARTI000033292519",
  "date": "2026-08-19",
  "texte": "Les dispositions des articles L. 3221-1 à L. 3221-7 du code du travail sont portées, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail, ainsi qu'aux candidats à l'embauche. Il en est de même pour les dispositions réglementaires pris pour l'application de ces articles."
 },
 "L3341-6": {
  "id": "LEGIARTI000043975313",
  "date": "2026-08-19",
  "texte": "Tout salarié d'une entreprise proposant un dispositif d'intéressement, de participation, un plan d'épargne entreprise, un plan d'épargne interentreprises, un plan d'épargne pour la retraite collectif ou un plan d'épargne retraite d'entreprise collectif reçoit, lors de la conclusion de son contrat de travail, un livret d'épargne salariale présentant les dispositifs mis en place au sein de l'entreprise. Le livret d'épargne salariale est également porté à la connaissance des représentants du personnel, le cas échéant en tant qu'élément de la base de données économiques, sociales et environnementales établie en application de l'article L. 2312-18 ."
 }
}; });

__def("./donnees-modeles.json", function(module){ module.exports = {
 "bdese": {
  "source": "découpage des décrets par moteur/bdese/contenu-bdese.js, textes lus à la source",
  "plancher": [
   "investissement social",
   "investissement matériel et immatériel",
   "égalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
   "fonds propres",
   "endettement",
   "ensemble des éléments de la rémunération des salariés et dirigeants",
   "activités sociales et culturelles",
   "rémunération des financeurs",
   "flux financiers à destination de l'entreprise",
   "conséquences environnementales de l'activité de l'entreprise"
  ],
  "plancherSource": "L. 2312-21, al. 3 (LEGIARTI000043975329)",
  "moins300": {
   "article": "R2312-8",
   "version": "LEGIARTI000049905537",
   "seuil": "moins de trois cents salariés",
   "rubriques": [
    {
     "n": 1,
     "titre": "Investissements",
     "sections": [
      {
       "lettre": "A",
       "titre": "Investissement social",
       "sujets": [
        "Evolution des effectifs par type de contrat, par âge, par ancienneté",
        "Evolution des emplois par catégorie professionnelle",
        "Evolution de l'emploi des personnes handicapées et mesures prises pour le développer",
        "Evolution du nombre de stagiaires de plus de 16 ans",
        "Formation professionnelle : investissements en formation, publics concernés",
        "Conditions de travail : durée du travail dont travail à temps partiel et aménagement du temps de travail",
        "Aux principes généraux de prévention prévus aux articles L. 4121-1 à L. 4121-5 et L. 4221-1",
        "A l'information et à la formation des travailleurs prévues aux articles L. 4141-1 à L. 4143-1",
        "A l'information et à la formation des salariés titulaires d'un contrat de travail à durée déterminée et des salariés temporaires prévues aux articles L. 4154-2 et L. 4154-4",
        "A la coordination de la prévention prévue aux articles L. 4522-1 et L. 4522-2"
       ]
      },
      {
       "lettre": "B",
       "titre": "Investissement matériel et immatériel",
       "sujets": [
        "Evolution des actifs nets d'amortissement et de dépréciations éventuelles (immobilisations)",
        "Le cas échéant, dépenses de recherche et développement",
        "Mesures envisagées en ce qui concerne l'amélioration, le renouvellement ou la transformation des méthodes de production et d'exploitation"
       ]
      }
     ]
    },
    {
     "n": 2,
     "titre": "Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
     "sections": [
      {
       "lettre": "A",
       "titre": "Analyse des données chiffrées",
       "sujets": [
        "Analyse des données chiffrées : Analyse des données chiffrées par catégorie professionnelle de la situation respective des femmes et des hommes en matière d'embauche, de formation, de promotion professionnelle, de qualification, de classification, de conditions de travail, de santé et de sécurité au travail, de rémunération effective et d'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale analyse des écarts de salaires et de déroulement de carrière en fonction de leur âge, de leur qualification et de leur ancienneté"
       ]
      },
      {
       "lettre": "B",
       "titre": "Stratégie d'action",
       "sujets": [
        "Stratégie d'action : A partir de l'analyse des données chiffrées mentionnées au A du 2°, la stratégie comprend les éléments suivants : -mesures prises au cours de l'année écoulée en vue d'assurer l'égalité professionnelle. Bilan des actions de l'année écoulée et, le cas échéant, de l'année précédente. Evaluation du niveau de réalisation des objectifs sur la base des indicateurs retenus. Explications sur les actions prévues non réalisées"
       ]
      }
     ]
    },
    {
     "n": 3,
     "titre": "Fonds propres, endettement et impôts",
     "sections": [
      {
       "lettre": null,
       "titre": "a) Capitaux propres de l'entreprise",
       "sujets": [
        "Capitaux propres de l'entreprise",
        "Emprunts et dettes financières dont échéances et charges financières",
        "Impôts et taxes, notamment, le cas échéant, les informations contenues dans le rapport relatif à l'impôt sur les bénéfices prévu par l' article L. 232-6 du code de commerce"
       ]
      }
     ]
    },
    {
     "n": 4,
     "titre": "Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments",
     "sections": [
      {
       "lettre": "A",
       "titre": "Evolution des rémunérations salariales",
       "sujets": [
        "Frais de personnel y compris cotisations sociales, évolutions salariales par catégorie et par sexe, salaire de base minimum, salaire moyen ou médian, par sexe et par catégorie professionnelle",
        "Pour les entreprises soumises aux dispositions de l' article L. 225-115 du code de commerce , montant global des rémunérations visées au 4° de cet article",
        "Epargne salariale : intéressement, participation"
       ]
      }
     ]
    },
    {
     "n": 5,
     "titre": "Activités sociales et culturelles",
     "sections": [
      {
       "lettre": null,
       "titre": "montant de la contribution aux activités sociales et culturelles Du comité social et économique, mécénat",
       "sujets": [
        "montant de la contribution aux activités sociales et culturelles Du comité social et économique, mécénat"
       ]
      }
     ]
    },
    {
     "n": 6,
     "titre": "Rémunération des financeurs, en dehors des éléments mentionnés au 4°",
     "sections": [
      {
       "lettre": "A",
       "titre": "Rémunération des actionnaires (revenus distribués)",
       "sujets": [
        "Rémunération des actionnaires (revenus distribués)"
       ]
      },
      {
       "lettre": "B",
       "titre": "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)",
       "sujets": [
        "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)"
       ]
      }
     ]
    },
    {
     "n": 7,
     "titre": "Flux financiers à destination de l'entreprise",
     "sections": [
      {
       "lettre": "A",
       "titre": "Aides publiques",
       "sujets": [
        "Aides publiques : Aides ou avantages financiers consentis à l'entreprise par l'Union européenne, l'Etat, une collectivité territoriale, un de leurs établissements publics ou un organisme privé chargé d'une mission de service public, et leur utilisation. Pour chacune de ces aides, il est indiqué la nature de l'aide, son objet, son montant, les conditions de versement et d'emploi fixées, le cas échéant, par la personne publique qui l'attribue et son emploi"
       ]
      },
      {
       "lettre": "B",
       "titre": "Réductions d'impôts",
       "sujets": [
        "Réductions d'impôts"
       ]
      },
      {
       "lettre": "C",
       "titre": "Exonérations et réductions de cotisations sociales",
       "sujets": [
        "Exonérations et réductions de cotisations sociales"
       ]
      },
      {
       "lettre": "D",
       "titre": "Crédits d'impôts",
       "sujets": [
        "Crédits d'impôts"
       ]
      },
      {
       "lettre": "E",
       "titre": "Mécénat",
       "sujets": [
        "Mécénat"
       ]
      },
      {
       "lettre": "F",
       "titre": "Résultats financiers",
       "sujets": [
        "Chiffre d'affaires, bénéfices ou pertes constatés",
        "Résultats d'activité en valeur et en volume",
        "Affectation des bénéfices réalisés"
       ]
      }
     ]
    },
    {
     "n": 8,
     "titre": "Partenariats",
     "sections": [
      {
       "lettre": "A",
       "titre": "Partenariats conclus pour produire des services ou des produits pour une autre entreprise",
       "sujets": [
        "Partenariats conclus pour produire des services ou des produits pour une autre entreprise"
       ]
      },
      {
       "lettre": "B",
       "titre": "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise",
       "sujets": [
        "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise"
       ]
      }
     ]
    },
    {
     "n": 9,
     "titre": "Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe",
     "sections": [
      {
       "lettre": "A",
       "titre": "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du g",
       "sujets": [
        "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative, notamment transferts de capitaux importants entre la société mère et les filiales"
       ]
      },
      {
       "lettre": "B",
       "titre": "Cessions, fusions, et acquisitions réalisées.",
       "sujets": [
        "Cessions, fusions, et acquisitions réalisées."
       ]
      }
     ]
    },
    {
     "n": 10,
     "titre": "Environnement (1) A-Politique générale en matière environnementale",
     "sections": [
      {
       "lettre": null,
       "titre": "Environnement (1)",
       "sujets": [
        "Environnement (1)"
       ]
      },
      {
       "lettre": "A",
       "titre": "Politique générale en matière environnementale",
       "sujets": [
        "Politique générale en matière environnementale : Organisation de l'entreprise pour prendre en compte les questions environnementales et, le cas échéant, les démarches d'évaluation ou de certification en matière d'environnement"
       ]
      },
      {
       "lettre": "B",
       "titre": "Economie circulaire",
       "sujets": [
        "Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l' article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l' article R. 541-45 du même code",
        "Utilisation durable des ressources : consommation d'eau et consommation d'énergie"
       ]
      },
      {
       "lettre": "C",
       "titre": "Changement climatique",
       "sujets": [
        "Identification des postes d'émissions directes de gaz à effet de serre produites par les sources fixes et mobiles nécessaires aux activités de l'entreprise (communément appelées \" émissions du scope 1 \") et, lorsque l'entreprise dispose de cette information, évaluation du volume de ces émissions de gaz à effet de serre",
        "Bilan des émissions de gaz à effet de serre prévu par l' article L. 229-25 du code de l'environnement ou bilan simplifié prévu par l' article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces différents bilans. Notes : (1) Lorsque les données et informations environnementales transmises dans le cadre de cette rubrique ne sont pas éditées au niveau de l'entreprise (i. e. par exemple, au niveau du groupe ou des établissements distincts, le cas échéant), elles doivent être accompagnées d'informations supplémentaires pertinentes pour être mises en perspective à ce niveau."
       ]
      }
     ]
    }
   ]
  },
  "auMoins300": {
   "article": "R2312-9",
   "version": "LEGIARTI000049905524",
   "seuil": "au moins trois cents salariés",
   "rubriques": [
    {
     "n": 1,
     "titre": "Investissements",
     "sections": [
      {
       "lettre": "A",
       "titre": "Investissement social",
       "sujets": [
        "Evolution des effectifs par type de contrat, par âge, par ancienneté",
        "Effectif : Effectif total au 31/12 (1) (I)",
        "Travailleurs extérieurs : Nombre de salariés (6) appartenant à une entreprise extérieure (23)",
        "Evolution des emplois, notamment, par catégorie professionnelle",
        "Embauches : Nombre d'embauches par contrats de travail à durée indéterminée",
        "Départs : Total des départs (I)",
        "Promotions : Nombre de salariés promus dans l'année dans une catégorie supérieure (11)",
        "Chômage : Nombre de salariés mis en chômage partiel pendant l'année considérée (I)",
        "Evolution de l'emploi des personnes handicapées et mesures prises pour le développer",
        "Evolution du nombre de stagiaires",
        "Formation professionnelle : investissements en formation, publics concernés",
        "Formation professionnelle continue (44) : Pourcentage de la masse salariale afférent à la formation continue",
        "Congés formation : Nombre de salariés ayant bénéficié d'un congé formation rémunéré",
        "Apprentissage : Nombre de contrats d'apprentissage conclus dans l'année",
        "Conditions de travail : Durée du travail dont travail à temps partiel et aménagement du temps de travail, les données sur l'exposition aux risques et aux facteurs de pénibilité, (accidents du travail, maladies professionnelles, absentéisme, dépenses en matière de sécurité)",
        "Accidents du travail et de trajet : Taux de fréquence des accidents du travail (I) Nombre d'accidents avec arrêts de travail divisé par nombre d'heures travaillées",
        "Répartition des accidents par éléments matériels (28) : Nombre d'accidents liés à l'existence de risques graves-codes 32 à 40",
        "Maladies professionnelles : Nombre et dénomination des maladies professionnelles déclarées à la sécurité sociale au cours de l'année",
        "Dépenses en matière de sécurité : Effectif formé à la sécurité dans l'année",
        "Durée et aménagement du temps de travail : Horaire hebdomadaire moyen affiché des ouvriers et employés ou catégories assimilées (30) (I)",
        "Absentéisme (14) : Nombre de journées d'absence (15) (I)",
        "Organisation et contenu du travail : Nombre de personnes occupant des emplois à horaires alternant ou de nuit",
        "Conditions physiques de travail : Nombre de personnes exposées de façon habituelle et régulière à plus de 80 à 85 db à leur poste de travail (37)",
        "Conditions de travail : durée du travail dont travail à temps partiel et aménagement du temps de travail"
       ]
      },
      {
       "lettre": "B",
       "titre": "Investissement matériel et immatériel",
       "sujets": [
        "Evolution des actifs nets d'amortissement et de dépréciations éventuelles (immobilisations)",
        "Le cas échéant, dépenses de recherche et développement",
        "L'évolution de la productivité et le taux d'utilisation des capacités de production, lorsque ces éléments sont mesurables dans l'entreprise"
       ]
      }
     ]
    },
    {
     "n": 2,
     "titre": "Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
     "sections": [
      {
       "lettre": "I",
       "titre": "Indicateurs sur la situation comparée des femmes et des hommes dans l'entreprise",
       "sujets": [
        "Indicateurs sur la situation comparée des femmes et des hommes dans l'entreprise :"
       ]
      },
      {
       "lettre": "A",
       "titre": "Conditions générales d'emploi",
       "sujets": [
        "Effectifs : Données chiffrées par sexe : -Répartition par catégorie professionnelle selon les différents contrats de travail (CDI ou CDD)",
        "Durée et organisation du travail : Données chiffrées par sexe : -Répartition des effectifs selon la durée du travail : temps complet, temps partiel (compris entre 20 et 30 heures et autres formes de temps partiel)",
        "Données sur les congés : Données chiffrées par sexe : -Répartition par catégorie professionnelle",
        "Données sur les embauches et les départs : Données chiffrées par sexe : -répartition des embauches par catégorie professionnelle et type de contrat de travail",
        "Positionnement dans l'entreprise : Données chiffrées par sexe : -répartition des effectifs par catégorie professionnelle"
       ]
      },
      {
       "lettre": "B",
       "titre": "Rémunérations et déroulement de carrière",
       "sujets": [
        "Promotion : Données chiffrées par sexe : -nombre et taux de promotions par catégorie professionnelle",
        "Ancienneté : Données chiffrées par sexe : -ancienneté moyenne par catégorie professionnelle",
        "Age : Données chiffrées par sexe : -âge moyen par catégorie professionnelle",
        "Rémunérations : Données chiffrées par sexe : -rémunération moyenne ou médiane mensuelle par catégorie professionnelle"
       ]
      },
      {
       "lettre": "C",
       "titre": "Formation",
       "sujets": [
        "Formation : Données chiffrées par sexe : Répartition par catégorie professionnelle selon : -le nombre moyen d'heures d'actions de formation par salarié et par an"
       ]
      },
      {
       "lettre": "D",
       "titre": "Conditions de travail, santé et sécurité au travail",
       "sujets": [
        "Conditions de travail, santé et sécurité au travail : Données générales par sexe : -répartition par poste de travail selon : -l'exposition à des risques professionnels"
       ]
      },
      {
       "lettre": "II",
       "titre": "Indicateurs relatifs à l'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale",
       "sujets": [
        "Indicateurs relatifs à l'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale :"
       ]
      },
      {
       "lettre": "A",
       "titre": "Congés",
       "sujets": [
        "Existence d'un complément de salaire versé par l'employeur pour le congé de paternité, le congé de maternité, le congé d'adoption",
        "Données chiffrées par catégorie professionnelle : nombre de jours de congés de paternité pris par le salarié par rapport au nombre de jours de congés théoriques"
       ]
      },
      {
       "lettre": "B",
       "titre": "Organisation du temps de travail dans l'entreprise. a) Existence de formules d'organisatio",
       "sujets": [
        "Existence de formules d'organisation du travail facilitant l'articulation de la vie familiale et de la vie professionnelle",
        "Données chiffrées par sexe et par catégorie professionnelle : -nombre de salariés ayant accédé au temps partiel choisi",
        "Services de proximité : -participation de l'entreprise et du comité social et économique aux modes d'accueil de la petite enfance",
        "Les ouvriers, les employés, techniciens, agents de maîtrise et les cadres",
        "Ou les catégories d'emplois définies par la classification",
        "Ou toute catégorie pertinente au sein de l'entreprise. Toutefois, l'indicateur relatif à la rémunération moyenne ou médiane mensuelle comprend au moins deux niveaux de comparaison dont celui mentionné au a ci-dessus."
       ]
      },
      {
       "lettre": "III",
       "titre": "Stratégie d'action",
       "sujets": [
        "Stratégie d'action : A partir de l'analyse des indicateurs mentionnés aux I et II, la stratégie d'action comprend les éléments suivants : -mesures prises au cours de l'année écoulée en vue d'assurer l'égalité professionnelle. Bilan des actions de l'année écoulée et, le cas échéant, de l'année précédente. Evaluation du niveau de réalisation des objectifs sur la base des indicateurs retenus. Explications sur les actions prévues non réalisées"
       ]
      }
     ]
    },
    {
     "n": 3,
     "titre": "Fonds propres, endettement et impôts",
     "sections": [
      {
       "lettre": null,
       "titre": "a) Capitaux propres de l'entreprise",
       "sujets": [
        "Capitaux propres de l'entreprise",
        "Emprunts et dettes financières dont échéances et charges financières",
        "Impôts et taxes, notamment, le cas échéant, les informations contenues dans le rapport relatif à l'impôt sur les bénéfices prévu par l'article L. 232-6 du code de commerce"
       ]
      }
     ]
    },
    {
     "n": 4,
     "titre": "Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments",
     "sections": [
      {
       "lettre": "A",
       "titre": "Evolution des rémunérations salariales",
       "sujets": [
        "Frais de personnel (24) y compris cotisations sociales, évolutions salariales par catégorie et par sexe, salaire de base minimum, salaire moyen ou médian, par sexe et par catégorie professionnelle",
        "Montant des rémunérations (17) : Choix de deux indicateurs dans l'un des groupes suivants : -rapport entre la masse salariale annuelle (18) (II) et l'effectif mensuel moyen",
        "Hiérarchie des rémunérations : Choix d'un des deux indicateurs suivants : -rapport entre la moyenne des rémunérations des 10 % des salariés touchant les rémunérations les plus élevées et celle correspondant au 10 % des salariés touchant les rémunérations les moins élevées",
        "Mode de calcul des rémunérations : Pourcentage des salariés dont le salaire dépend, en tout ou partie, du rendement (22). Pourcentage des ouvriers et employés payés au mois sur la base de l'horaire affiché.",
        "Charge salariale globale",
        "Pour les entreprises soumises aux dispositions de l'article L. 225-115 du code de commerce, montant global des rémunérations visées au 4° de cet article"
       ]
      },
      {
       "lettre": "B",
       "titre": "Epargne salariale",
       "sujets": [
        "Epargne salariale : intéressement, participation : Montant global de la réserve de participation (25)"
       ]
      },
      {
       "lettre": "C",
       "titre": "Rémunérations accessoires",
       "sujets": [
        "Rémunérations accessoires : primes par sexe et par catégorie professionnelle, avantages en nature, régimes de prévoyance et de retraite complémentaire"
       ]
      },
      {
       "lettre": "D",
       "titre": "Rémunération des dirigeants mandataires sociaux telles que présentées dans le rapport de g",
       "sujets": [
        "Rémunération des dirigeants mandataires sociaux telles que présentées dans le rapport de gestion en application des trois premiers alinéas de l'article L. 225-102-1 du code de commerce, pour les entreprises soumises à l'obligation de présenter le rapport visé à l'article L. 225-102 du même code"
       ]
      }
     ]
    },
    {
     "n": 5,
     "titre": "Représentation du personnel et Activités sociales et culturelles",
     "sections": [
      {
       "lettre": null,
       "titre": "montant de la contribution aux activités sociales et culturelles du comité social et économique, mécénat",
       "sujets": [
        "montant de la contribution aux activités sociales et culturelles du comité social et économique, mécénat :"
       ]
      },
      {
       "lettre": "A",
       "titre": "Représentation du personnel",
       "sujets": [
        "Représentants du personnel et délégués syndicaux : Composition des comités sociaux et économiques et/ ou d'établissement avec indication, s'il y a lieu, de l'appartenance syndicale",
        "Information et communication : Nombre d'heures consacrées aux différentes formes de réunion du personnel (46)",
        "Différends concernant l'application du droit du travail (48)"
       ]
      },
      {
       "lettre": "B",
       "titre": "Activités sociales et culturelles",
       "sujets": [
        "Activités sociales : Contributions au financement, le cas échéant, du comité social et économique et des comités sociaux économiques d'établissement",
        "Autres charges sociales : Coût pour l'entreprise des prestations complémentaires (maladie, décès) (50)"
       ]
      }
     ]
    },
    {
     "n": 6,
     "titre": "Rémunération des financeurs, en dehors des éléments mentionnés au 4°",
     "sections": [
      {
       "lettre": "A",
       "titre": "Rémunération des actionnaires (revenus distribués)",
       "sujets": [
        "Rémunération des actionnaires (revenus distribués)"
       ]
      },
      {
       "lettre": "B",
       "titre": "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)",
       "sujets": [
        "Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus)"
       ]
      }
     ]
    },
    {
     "n": 7,
     "titre": "Flux financiers à destination de l'entreprise",
     "sections": [
      {
       "lettre": "A",
       "titre": "Aides publiques",
       "sujets": [
        "Aides publiques : Les aides ou avantages financiers consentis à l'entreprise par l'Union européenne, l'Etat, une collectivité territoriale, un de leurs établissements publics ou un organisme privé chargé d'une mission de service public, et leur utilisation"
       ]
      },
      {
       "lettre": "B",
       "titre": "Réductions d'impôts",
       "sujets": [
        "Réductions d'impôts"
       ]
      },
      {
       "lettre": "C",
       "titre": "Exonérations et réductions de cotisations sociales",
       "sujets": [
        "Exonérations et réductions de cotisations sociales"
       ]
      },
      {
       "lettre": "D",
       "titre": "Crédits d'impôts",
       "sujets": [
        "Crédits d'impôts"
       ]
      },
      {
       "lettre": "E",
       "titre": "Mécénat",
       "sujets": [
        "Mécénat"
       ]
      },
      {
       "lettre": "F",
       "titre": "Résultats financiers a) Le chiffre d'affaires",
       "sujets": [
        "Le chiffre d'affaires",
        "Les bénéfices ou pertes constatés",
        "Les résultats globaux de la production en valeur et en volume",
        "L'affectation des bénéfices réalisés"
       ]
      }
     ]
    },
    {
     "n": 8,
     "titre": "Partenariats",
     "sections": [
      {
       "lettre": "A",
       "titre": "Partenariats conclus pour produire des services ou des produits pour une autre entreprise",
       "sujets": [
        "Partenariats conclus pour produire des services ou des produits pour une autre entreprise"
       ]
      },
      {
       "lettre": "B",
       "titre": "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise",
       "sujets": [
        "Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise"
       ]
      }
     ]
    },
    {
     "n": 9,
     "titre": "Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe",
     "sections": [
      {
       "lettre": "A",
       "titre": "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative",
       "sujets": [
        "Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative"
       ]
      },
      {
       "lettre": "B",
       "titre": "Cessions, fusions, et acquisitions réalisées.",
       "sujets": [
        "Cessions, fusions, et acquisitions réalisées."
       ]
      }
     ]
    },
    {
     "n": 10,
     "titre": "Environnement (52)",
     "sections": [
      {
       "lettre": "I",
       "titre": "Pour les entreprises soumises à la déclaration prévue à l'article R. 225-105 du code de commerce",
       "sujets": [
        "Pour les entreprises soumises à la déclaration prévue à l'article R. 225-105 du code de commerce :"
       ]
      },
      {
       "lettre": "A",
       "titre": "Politique générale en matière environnementale",
       "sujets": [
        "Politique générale en matière environnementale : Informations environnementales présentées en application du 2° du A du II de l'article R. 225-105 du code de commerce"
       ]
      },
      {
       "lettre": "B",
       "titre": "Economie circulaire",
       "sujets": [
        "Economie circulaire : Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l'article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l'article R. 541-45 du même code"
       ]
      },
      {
       "lettre": "C",
       "titre": "Changement climatique",
       "sujets": [
        "Changement climatique : Bilan des émissions de gaz à effet de serre prévu par l'article L. 229-25 du code de l'environnement ou bilan simplifié prévu par l'article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces différents bilans"
       ]
      },
      {
       "lettre": "II",
       "titre": "Pour les entreprises non soumises à la déclaration prévue à l'article R. 225-105 du code de commerce",
       "sujets": [
        "Pour les entreprises non soumises à la déclaration prévue à l'article R. 225-105 du code de commerce :"
       ]
      },
      {
       "lettre": "A",
       "titre": "Politique générale en matière environnementale",
       "sujets": [
        "Politique générale en matière environnementale : Organisation de l'entreprise pour prendre en compte les questions environnementales et, le cas échéant, les démarches d'évaluation ou de certification en matière d'environnement"
       ]
      },
      {
       "lettre": "B",
       "titre": "Economie circulaire",
       "sujets": [
        "Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l'article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l'article R. 541-45 du même code",
        "Utilisation durable des ressources : consommation d'eau et consommation d'énergie"
       ]
      },
      {
       "lettre": "C",
       "titre": "Changement climatique",
       "sujets": [
        "Identification des postes d'émissions directes de gaz à effet de serre produites par les sources fixes et mobiles nécessaires aux activités de l'entreprise (communément appelées \" émissions du scope 1 \") et, lorsque l'entreprise dispose de cette information, évaluation du volume de ces émissions de gaz à effet de serre",
        "Bilan des émissions de gaz à effet de serre prévu par l'article L. 229-25 du code de l'environnement ou le bilan simplifié prévu par l'article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces bilans. Notes : I.-Une structure de qualification détaillée, en trois ou quatre postes minimum, est requise. Il est souhaitable de faire référence à la classification de la convention collective, de l'accord d'entreprise et aux pratiques habituellement retenues dans l'entreprise. A titre d'exemple la répartition suivante peut être retenue : cadres",
        "(effectif du mois",
        ". (20) Faire une grille des rémunérations en distinguant au moins six tranches. (21) Pour être prises en compte, les catégories concernées doivent comporter au minimum dix salariés. (22) Distinguer les primes individuelles et les primes collectives. (23) Prestataires de services. (24) Frais de personnel : ensemble des rémunérations et des cotisations sociales mises légalement ou conventionnellement à la charge de l'entreprise. (25) Le montant global de la réserve de participation est le montant de la réserve dégagée-ou de la provision constituée-au titre de la participation sur les résultats de l'exercice considéré. (26) La participation est envisagée ici au sens du titre II du livre III de la partie III. (27) Non compris les dirigeants. (28) Faire référence aux codes de classification des éléments matériels des accidents (arrêté du 10 octobre 1974). (29) En application de l'article L. 461-4 du code de la sécurité sociale. (30) Il est possible de remplacer cet indicateur par la somme des heures travaillées durant l'année. (31) Au sens des dispositions du présent code et du code rural et de la pêche maritime instituant un repos compensateur en matière d'heures supplémentaires. (32) Au sens de l'article L. 3121-48. (33) Au sens de l'article L. 3123-1. (34) Cet indicateur peut être calculé sur la dernière période de référence. (35) Préciser, le cas échéant, les conditions restrictives. (36) Seuils associés aux facteurs de risques professionnels pour le travail répétitif : Travail répétitif caractérisé par la réalisation de travaux impliquant l'exécution de mouvements répétés, sollicitant tout ou partie du membre supérieur, à une fréquence élevée et sous cadence contrainte : -Temps de cycle inférieur ou égal à 30 secondes : 15 actions techniques ou plus pour minimum 900 heures par an -Temps de cycle supérieur à 30 secondes, temps de cycle variable ou absence de temps de cycle : 30 actions techniques ou plus par minute pour minimum 900 heures par an.. (37) Les valeurs limites d'exposition et les valeurs d'exposition déclenchant une action de prévention qui sont fixées dans le tableau prévu à l'article R. 4431-2. (38) Température inférieure ou égale à 5 degrés Celsius ou au moins égale à 30 degrés Celsius pour minimum 900 heures par an. (39) Sont considérées comme intempéries, les conditions atmosphériques et les inondations lorsqu'elles rendent dangereux ou impossible l'accomplissement du travail eu égard soit à la santé ou à la sécurité des salariés, soit à la nature ou à la technique du travail à accomplir. (40) Renseignements tirés du rapport du directeur du service de prévention et de santé au travail interentreprises (41) Pour l'explication de ces expériences d'amélioration du contenu du travail, donner le nombre de salariés concernés. (42) Non compris l'évaluation des dépenses en matière de santé et de sécurité. (43) Renseignements tirés du rapport du directeur du service de prévention et de santé au travail interentreprises. (44) Conformément aux données relatives aux contributions de formation professionnelle de la déclaration sociale nominative. (45) Au sens des articles L. 2145-5 et suivants. (46) On entend par réunion du personnel, les réunions régulières de concertation, concernant les relations et conditions de travail organisées par l'entreprise. (47) Préciser leur périodicité. (48) Avec indication de la nature du différend et, le cas échéant, de la solution qui y a mis fin. (49) Dépenses consolidées de l'entreprise. La répartition est indiquée ici à titre d'exemple. (50) (51) Versements directs ou par l'intermédiaire d'assurances. (52) Lorsque les données et informations environnementales transmises dans le cadre de cette rubrique ne sont pas éditées au niveau de l'entreprise (i. e. par exemple, au niveau du groupe ou des établissements distincts, le cas échéant), elles doivent être accompagnées d'informations supplémentaires pertinentes pour être mises en perspective à ce niveau."
       ]
      }
     ]
    }
   ]
  }
 },
 "r2314_1": {
  "source": "table de R. 2314-1 extraite par le module CSE (moteur/cse/_r2314_1.json)",
  "tranches": [
   [
    11,
    24,
    1,
    10
   ],
   [
    25,
    49,
    2,
    10
   ],
   [
    50,
    74,
    4,
    18
   ],
   [
    75,
    99,
    5,
    19
   ],
   [
    100,
    124,
    6,
    21
   ],
   [
    125,
    149,
    7,
    21
   ],
   [
    150,
    174,
    8,
    21
   ],
   [
    175,
    199,
    9,
    21
   ],
   [
    200,
    249,
    10,
    22
   ],
   [
    250,
    299,
    11,
    22
   ],
   [
    300,
    399,
    11,
    22
   ],
   [
    400,
    499,
    12,
    22
   ],
   [
    500,
    599,
    13,
    24
   ],
   [
    600,
    699,
    14,
    24
   ],
   [
    700,
    799,
    14,
    24
   ],
   [
    800,
    899,
    15,
    24
   ],
   [
    900,
    999,
    16,
    24
   ],
   [
    1000,
    1249,
    17,
    24
   ],
   [
    1250,
    1499,
    18,
    24
   ],
   [
    1500,
    1749,
    20,
    26
   ],
   [
    1750,
    1999,
    21,
    26
   ],
   [
    2000,
    2249,
    22,
    26
   ],
   [
    2250,
    2499,
    23,
    26
   ],
   [
    2500,
    2749,
    24,
    26
   ],
   [
    2750,
    2999,
    24,
    26
   ],
   [
    3000,
    3249,
    25,
    26
   ],
   [
    3250,
    3499,
    25,
    26
   ],
   [
    3500,
    3749,
    26,
    27
   ],
   [
    3750,
    3999,
    26,
    27
   ],
   [
    4000,
    4249,
    26,
    28
   ],
   [
    4250,
    4499,
    27,
    28
   ],
   [
    4500,
    4749,
    27,
    28
   ],
   [
    4750,
    4999,
    28,
    28
   ],
   [
    5000,
    5249,
    29,
    29
   ],
   [
    5250,
    5499,
    29,
    29
   ],
   [
    5500,
    5749,
    29,
    29
   ],
   [
    5750,
    5999,
    30,
    29
   ],
   [
    6000,
    6249,
    31,
    29
   ],
   [
    6250,
    6499,
    31,
    29
   ],
   [
    6500,
    6749,
    31,
    29
   ],
   [
    6750,
    6999,
    31,
    30
   ],
   [
    7000,
    7249,
    32,
    30
   ],
   [
    7250,
    7499,
    32,
    30
   ],
   [
    7500,
    7749,
    32,
    31
   ],
   [
    7750,
    7999,
    32,
    32
   ],
   [
    8000,
    8249,
    32,
    32
   ],
   [
    8250,
    8499,
    33,
    32
   ],
   [
    8500,
    8749,
    33,
    32
   ],
   [
    8750,
    8999,
    33,
    32
   ],
   [
    9000,
    9249,
    34,
    32
   ],
   [
    9250,
    9499,
    34,
    32
   ],
   [
    9500,
    9749,
    34,
    32
   ],
   [
    9750,
    9999,
    34,
    34
   ],
   [
    10000,
    null,
    35,
    34
   ]
  ]
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
