/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : 8c6d427c67d8
   {"obligations":90,"parCategorie":{"instances":12,"documents obligatoires":5,"affichages et informations":9,"registres":3,"négociations":5,"santé-sécurité":20,"formation et entretiens":4,"épargne et protection sociale":5,"durée du travail et repos":7,"congés et jours":4,"embauche et contrat":5,"fin du contrat":4,"égalité et non-discrimination":7},"articlesLus":172,"articlesNonConfirmes":1,"articlesCites":170,"renvoisModules":20,"itemsConventionnels":4,"itemsGeneriques":2,"questionsOrientation":26,"questionsVerification":196,"conformitesOuSansObjetSurProfilVide":0,"conclusionsConformesInterdites":0,"citationsDArticlesNonConfirmes":0,"parcoursDeRegularisation":15,"obligationsLieesAUnParcours":55,"obligationsLieesAUnDocument":77,"obligationsSansParcours":35,"outilsJurisExpert":14,"obligationsLieesAUnOutilJurisExpert":21,"obligationsAvecModeleComplet":90,"liensDeRegularisationMorts":0}
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
  var __MANIFESTE = {"domaine":"audit social — le chapeau des obligations de l'employeur","date":"2026-08-23","empreinte":"8c6d427c67d8","fichiers":{"audit-social-client.js":"11d7bb8dfbe1","capture-social.js":"d3d65a65713b","capturer-textes-social-2.js":"4d61e2c885d8","capturer-textes-social-3.js":"ae2db2f3a775","capturer-textes-social-4.js":"5cb24e703a38","capturer-textes-social-5.js":"115f14c3e26e","capturer-textes-social-6.js":"67b93643e93a","capturer-textes-social-7.js":"86e7efab177f","capturer-textes-social-8.js":"f4eea7de7b5c","capturer-textes-social.js":"f79e801d9e31","controles-social.js":"a96e281768f1","generer-donnees-modeles.js":"f8f64294ce6d","modeles-social.js":"8a61ed942add","moteur-social.js":"6e23710d673f","plan-social.js":"2ac32fc089ad","questionnaire-social.js":"a7186da93796","referentiel-social.js":"f44505512582","tests-social.js":"804771b063ba","textes-social-non-confirmes.json":"3528ca5e5f07","textes-social.json":"a1477ffbae0c","verifier-textes-social.js":"de5da88f7ad0"},"compteurs":{"obligations":90,"parCategorie":{"instances":12,"documents obligatoires":5,"affichages et informations":9,"registres":3,"négociations":5,"santé-sécurité":20,"formation et entretiens":4,"épargne et protection sociale":5,"durée du travail et repos":7,"congés et jours":4,"embauche et contrat":5,"fin du contrat":4,"égalité et non-discrimination":7},"articlesLus":172,"articlesNonConfirmes":1,"articlesCites":170,"renvoisModules":20,"itemsConventionnels":4,"itemsGeneriques":2,"questionsOrientation":26,"questionsVerification":196,"conformitesOuSansObjetSurProfilVide":0,"conclusionsConformesInterdites":0,"citationsDArticlesNonConfirmes":0,"parcoursDeRegularisation":15,"obligationsLieesAUnParcours":55,"obligationsLieesAUnDocument":77,"obligationsSansParcours":35,"outilsJurisExpert":14,"obligationsLieesAUnOutilJurisExpert":21,"obligationsAvecModeleComplet":90,"liensDeRegularisationMorts":0},"obligationsSansParcours":["SOC-INS-GROUPE","SOC-DOC-OETH","SOC-REG-SECURITE","SOC-REG-DGI","SOC-NEG-PSE","SOC-SST-SPST","SOC-SST-VIP","SOC-EPA-PARTICIPATION","SOC-EPA-LIVRET","SOC-EPA-SANTE","SOC-EPA-PREVOYANCE-CADRES","SOC-CCN-OBLIGATIONS","SOC-DUR-MAXIMA","SOC-DUR-PAUSE","SOC-DUR-REPOS","SOC-DUR-CONTINGENT","SOC-DUR-FORFAIT","SOC-DUR-TPARTIEL","SOC-DUR-PAIE","SOC-EGA-DISCRIMINATION","SOC-EGA-HANDICAP","SOC-EGA-REFERENT-HANDICAP","SOC-EGA-RECRUTEURS","SOC-EGA-ALERTE","SOC-SST-ACCIDENT-GRAVE","SOC-SST-SUIVI-CONTRAT","SOC-SST-FICHE-ENTREPRISE","SOC-SST-EXTERIEURES","SOC-SST-NUIT","SOC-SST-JEUNES","SOC-SST-LOCAUX","SOC-SST-ECRAN","SOC-FOR-CONTRIBUTION","SOC-INS-SECTION-SYNDICALE","SOC-INS-PROTEGES"],"textesRelus":{"date":"2026-08-23","articles":172,"concordants":172,"ecarts":0,"sansConclusion":0}};
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
  "durée du travail et repos",
  "congés et jours",
  "embauche et contrat",
  "fin du contrat",
  "égalité et non-discrimination",
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

/* ═══════════════════════════════ 9. durée du travail et repos ══ */

item({
  id: "SOC-DUR-MAXIMA", categorie: "durée du travail et repos",
  intitule: "Durées maximales de travail : quotidienne, hebdomadaire, et moyenne sur douze semaines",
  articles: ["L3121-18", "L3121-20", "L3121-22"].filter(lu),
  articlesSouhaites: ["L3121-18", "L3121-20", "L3121-22"],
  condition: toutEmployeur,
  verifs: [
    { cle: "plafondsRespectes", libelle: "Les plafonds de dix heures par jour, quarante-huit heures par semaine et quarante-quatre heures en moyenne sur douze semaines consécutives sont-ils respectés pour tous les salariés ?", format: "oui / non", regle: "oui",
      motifNC: "Un dépassement des durées maximales est déclaré : reprenez les plannings de la période, identifiez les salariés et les semaines concernés, corrigez l'organisation, et vérifiez si une dérogation existe — la convention collective ou une autorisation administrative peut aménager certains plafonds, ce que cette application ne peut pas affirmer." },
    { cle: "controleDure", libelle: "Un contrôle des durées est-il fait avant chaque paie (plannings, badgeage, relevés) ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun contrôle périodique des durées n'est déclaré : sans relevé, un dépassement ne se voit qu'au contentieux. Mettez en place un contrôle mensuel documenté." },
  ],
  plan: {
    priorite: 1,
    action: "Contrôler les durées maximales de travail et documenter ce contrôle.",
    etapes: [
      "Recenser les organisations du travail en place (horaire collectif, équipes, forfaits, itinérants, astreintes) et le mode de décompte de chacune.",
      "Extraire, sur les douze dernières semaines, les durées quotidiennes et hebdomadaires par salarié.",
      "Traiter les dépassements : réorganisation, embauche, recours encadré aux dérogations — et vérifier si votre convention collective en ouvre.",
      "Instituer un contrôle mensuel avant paie, avec trace écrite du contrôle et de ses suites.",
    ],
    acteur: "Direction, encadrement d'exploitation et paie",
    delai: "Contrôle à instituer sous un mois ; régularisation des dépassements immédiate",
    risque: "Le dépassement des durées maximales est une infraction constatée par l'inspection du travail et nourrit les demandes de dommages-intérêts ; l'article de sanction n'a pas été lu au relais pour cet audit — faites chiffrer le risque par votre conseil.",
    modele: { page: "documents.html", nom: "tableau de contrôle des durées maximales" },
  },
});

item({
  id: "SOC-DUR-PAUSE", categorie: "durée du travail et repos",
  intitule: "Temps de pause : vingt minutes consécutives dès six heures de travail quotidien",
  articles: ["L3121-16"].filter(lu),
  articlesSouhaites: ["L3121-16"],
  convention: true,
  condition: toutEmployeur,
  verifs: [
    { cle: "pauseAccordee", libelle: "Une pause d'au moins vingt minutes consécutives est-elle accordée dès que le temps de travail quotidien atteint six heures ?", format: "oui / non", regle: "oui",
      motifNC: "La pause n'est pas assurée : organisez-la et tracez-la dans les plannings. Votre convention collective peut prévoir des dispositions plus favorables — vérifiez-les, cette application ne lit que le code du travail." },
    { cle: "pauseTracee", libelle: "La pause figure-t-elle dans les plannings ou les relevés de temps ?", format: "oui / non", regle: "oui",
      motifNC: "La pause n'est pas tracée : en cas de litige, c'est à l'employeur de démontrer qu'il l'a accordée. Faites-la apparaître au relevé." },
  ],
  plan: {
    priorite: 2,
    action: "Organiser et tracer la pause de vingt minutes.",
    etapes: [
      "Repérer les postes dont la journée atteint ou dépasse six heures.",
      "Inscrire la pause dans les plannings, en précisant si elle est rémunérée ou non selon votre convention et vos usages.",
      "Informer l'encadrement : la pause ne se cumule pas avec des interruptions de quelques minutes — elle est consécutive.",
    ],
    acteur: "Encadrement d'exploitation, avec la paie",
    delai: "Immédiat",
    risque: "L'absence de pause donne lieu à des rappels de salaire et à des dommages-intérêts distincts ; le régime de rémunération de la pause relève de la convention collective, à vérifier.",
    modele: { page: "documents.html", nom: "note de service — organisation des pauses" },
  },
});

item({
  id: "SOC-DUR-REPOS", categorie: "durée du travail et repos",
  intitule: "Repos quotidien de onze heures et repos hebdomadaire",
  articles: ["L3131-1", "L3132-1", "L3132-2"].filter(lu),
  articlesSouhaites: ["L3131-1", "L3132-1", "L3132-2"],
  condition: toutEmployeur,
  verifs: [
    { cle: "reposQuotidien", libelle: "Le repos quotidien de onze heures consécutives est-il assuré entre deux journées de travail ?", format: "oui / non", regle: "oui",
      motifNC: "Le repos quotidien n'est pas assuré : reprenez les enchaînements de services (fermeture puis ouverture, astreintes, déplacements) et corrigez les plannings. Les dérogations sont encadrées : ne les supposez pas, vérifiez-les." },
    { cle: "reposHebdomadaire", libelle: "Aucun salarié ne travaille plus de six jours par semaine, et le repos hebdomadaire est-il assuré ?", format: "oui / non", regle: "oui",
      motifNC: "Le repos hebdomadaire n'est pas assuré : c'est l'une des irrégularités les plus lourdement sanctionnées, et elle se lit directement sur les plannings. Corrigez sans attendre." },
  ],
  plan: {
    priorite: 1,
    action: "Garantir les repos quotidien et hebdomadaire, et en conserver la preuve.",
    etapes: [
      "Contrôler, sur les plannings réels et non théoriques, l'intervalle entre la fin d'un service et la reprise du suivant.",
      "Contrôler le nombre de jours travaillés par semaine civile, salarié par salarié.",
      "Traiter les situations à risque : astreintes, dépannages, déplacements longs, remplacements de dernière minute.",
      "Documenter le contrôle et ses suites — la preuve du respect des repos incombe à l'employeur.",
    ],
    acteur: "Direction et encadrement d'exploitation",
    delai: "Immédiat",
    risque: "Le non-respect des repos est constaté par l'inspection du travail et ouvre des dommages-intérêts sans que le salarié ait à démontrer un préjudice ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "tableau de contrôle des repos" },
  },
});

item({
  id: "SOC-DUR-CONTINGENT", categorie: "durée du travail et repos",
  intitule: "Contingent annuel d'heures supplémentaires et contrepartie obligatoire en repos",
  articles: ["L3121-30", "L3121-33", "D3121-24", "L3121-38"].filter(lu),
  articlesSouhaites: ["L3121-30", "L3121-33", "D3121-24", "L3121-38"],
  condition: p => {
    const s = M.ouiNon(p, "heuresSupplementaires", "Des heures supplémentaires sont-elles accomplies ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucune heure supplémentaire n'est déclarée : le contingent annuel et la contrepartie obligatoire en repos n'ont pas d'objet. Si des heures sont accomplies sans être déclarées, c'est ce point-là qu'il faut traiter d'abord." };
    return { du: true, motif: "Des heures supplémentaires sont accomplies : le contingent annuel s'applique, et son dépassement ouvre la contrepartie obligatoire en repos." };
  },
  verifs: [
    { cle: "contingentConnu", libelle: "Le contingent annuel applicable est-il identifié (accord d'entreprise ou de branche, à défaut deux cent vingt heures) ?", format: "oui / non", regle: "oui",
      motifNC: "Le contingent applicable n'est pas identifié : cherchez d'abord l'accord d'entreprise ou d'établissement, à défaut l'accord de branche ; à défaut d'accord, le contingent réglementaire de deux cent vingt heures par salarié s'applique (D. 3121-24)." },
    { cle: "suiviIndividuel", libelle: "Un décompte individuel des heures supplémentaires imputées sur le contingent est-il tenu ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun décompte individuel n'est tenu : sans lui, ni le contingent ni la contrepartie en repos ne peuvent être suivis, et le salarié qui réclame est en position favorable." },
    { cle: "contrepartieRepos", libelle: "La contrepartie obligatoire en repos due au-delà du contingent est-elle calculée et ouverte aux salariés concernés ?", format: "oui / non", regle: "oui",
      motifNC: "La contrepartie obligatoire en repos n'est pas ouverte : elle est due de plein droit au-delà du contingent, elle se cumule avec la majoration salariale, et son absence se rattrape en indemnité." },
    { cle: "avisComite", libelle: "Le comité social et économique a-t-il été consulté ou informé sur le recours aux heures supplémentaires, lorsqu'un comité existe ?", format: "oui / non", regle: "oui",
      motifNC: "Le comité n'a pas été associé : lorsqu'un comité existe, le recours aux heures supplémentaires entre dans les sujets qu'il examine — l'audit du comité (module dédié) précise les cas de consultation." },
  ],
  plan: {
    priorite: 2,
    action: "Identifier le contingent applicable, tenir le décompte individuel et ouvrir la contrepartie obligatoire en repos.",
    etapes: [
      "Rechercher l'accord d'entreprise ou de branche fixant le contingent ; à défaut, retenir le contingent réglementaire.",
      "Ouvrir un compteur individuel d'heures supplémentaires imputées sur le contingent, alimenté chaque mois.",
      "Calculer la contrepartie obligatoire en repos due aux salariés qui ont dépassé le contingent, et la porter au bulletin ou à une annexe d'information.",
      "Rattraper les périodes passées : reconstituer les compteurs sur la période non prescrite, avec votre conseil.",
    ],
    acteur: "Paie et direction, avec l'expert-comptable ou le conseil",
    delai: "Compteur ouvert sous un mois ; rattrapage à chiffrer",
    risque: "Le dépassement non compensé se transforme en rappels d'indemnité, en dommages-intérêts et, si les heures ne sont pas déclarées, en travail dissimulé — un chef de demande lourd. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "tableau du contingent et de la contrepartie en repos" },
  },
});

item({
  id: "SOC-DUR-FORFAIT", categorie: "durée du travail et repos",
  intitule: "Forfait annuel en jours : accord collectif, convention individuelle, décompte et suivi de la charge",
  articles: ["L3121-64", "L3121-65", "L3121-60"].filter(lu),
  articlesSouhaites: ["L3121-64", "L3121-65", "L3121-60"],
  condition: p => {
    const s = M.ouiNon(p, "forfaitJours", "Des salariés sont-ils soumis à un forfait annuel en jours ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun salarié n'est déclaré en forfait annuel en jours : les obligations propres au forfait n'ont pas d'objet." };
    return { du: true, motif: "Des salariés sont en forfait annuel en jours : l'accord collectif, la convention individuelle écrite, le décompte des journées et le suivi de la charge de travail sont dus." };
  },
  verifs: [
    { cle: "accordForfait", libelle: "Un accord collectif autorise-t-il le forfait annuel en jours, et fixe-t-il ses garanties (suivi de la charge, droit à la déconnexion, entretien) ?", format: "oui / non", regle: "oui",
      motifNC: "Sans accord collectif conforme, la convention individuelle de forfait est privée d'effet : le salarié peut réclamer le paiement de ses heures supplémentaires sur toute la période non prescrite. C'est le risque financier le plus lourd de cette rubrique." },
    { cle: "conventionIndividuelle", libelle: "Chaque salarié concerné a-t-il signé une convention individuelle de forfait écrite ?", format: "oui / non", regle: "oui",
      motifNC: "La convention individuelle écrite manque pour tout ou partie des salariés concernés : le forfait ne se présume pas, il se signe. Régularisez par avenant." },
    { cle: "decompteJours", libelle: "Un document de contrôle faisant apparaître le nombre et la date des journées ou demi-journées travaillées est-il établi ?", format: "oui / non", regle: "oui",
      motifNC: "Le document de contrôle n'est pas établi : c'est l'une des garanties du forfait, et son absence fragilise l'ensemble du dispositif." },
    { cle: "entretienCharge", libelle: "Un entretien sur la charge de travail, l'organisation, l'articulation vie professionnelle et vie personnelle et la rémunération est-il tenu chaque année ?", format: "oui / non", regle: "oui",
      motifNC: "L'entretien annuel de charge n'est pas tenu : l'employeur doit s'assurer régulièrement que la charge de travail est raisonnable et permet une bonne répartition dans le temps (L. 3121-60). Programmez-le et documentez-le." },
  ],
  plan: {
    priorite: 1,
    action: "Sécuriser les forfaits annuels en jours : accord, conventions individuelles, décompte, entretiens.",
    etapes: [
      "Vérifier que l'accord collectif applicable prévoit bien les garanties exigées ; s'il est ancien ou muet, le renégocier ou le compléter.",
      "Recenser les salariés en forfait et vérifier l'existence d'une convention individuelle écrite pour chacun.",
      "Mettre en place le document de contrôle mensuel des journées travaillées, renseigné par le salarié et validé par l'employeur.",
      "Programmer l'entretien annuel de charge, en conserver le compte rendu écrit, et tracer les suites données aux alertes.",
    ],
    acteur: "Direction des ressources humaines, avec les managers concernés",
    delai: "Conventions et décompte sous deux mois ; entretien dans les douze mois",
    risque: "Un forfait privé d'effet fait basculer le salarié au décompte horaire de droit commun : rappels d'heures supplémentaires, congés et repos sur la période non prescrite. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "convention individuelle de forfait et document de contrôle" },
  },
});

item({
  id: "SOC-DUR-TPARTIEL", categorie: "durée du travail et repos",
  intitule: "Temps partiel : contrat écrit et ses mentions, durée minimale, heures complémentaires, priorité d'accès",
  articles: ["L3123-6", "L3123-7", "L3123-27", "L3123-8", "L3123-3"].filter(lu),
  articlesSouhaites: ["L3123-6", "L3123-7", "L3123-27", "L3123-8", "L3123-3"],
  condition: p => {
    const s = M.ouiNon(p, "tempsPartiel", "L'entreprise emploie-t-elle des salariés à temps partiel ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun salarié à temps partiel n'est déclaré : les obligations propres au temps partiel n'ont pas d'objet." };
    return { du: true, motif: "L'entreprise emploie des salariés à temps partiel : le contrat écrit et ses mentions, la durée minimale, la majoration des heures complémentaires et la priorité d'accès s'appliquent." };
  },
  verifs: [
    { cle: "contratEcrit", libelle: "Chaque salarié à temps partiel a-t-il un contrat écrit portant la durée du travail et sa répartition ?", format: "oui / non", regle: "oui",
      motifNC: "Le contrat écrit manque, ou ne porte pas la durée et sa répartition : à défaut, le contrat est présumé à temps complet, et c'est à l'employeur de renverser la présomption. Régularisez par avenant sans attendre." },
    { cle: "dureeMinimale", libelle: "La durée minimale de travail est-elle respectée, ou une dérogation régulière est-elle documentée (demande écrite et motivée du salarié, accord de branche étendu) ?", format: "oui / non", regle: "oui",
      motifNC: "La durée minimale n'est pas respectée et aucune dérogation n'est documentée : la durée minimale se fixe par convention ou accord de branche étendu (L. 3123-7) et, à défaut d'accord, à vingt-quatre heures par semaine (L. 3123-27). Vérifiez votre branche avant toute conclusion." },
    { cle: "majorationHC", libelle: "Toutes les heures complémentaires sont-elles majorées ?", format: "oui / non", regle: "oui",
      motifNC: "Des heures complémentaires ne sont pas majorées : chacune d'elles ouvre droit à majoration (L. 3123-8). Le taux peut être aménagé par accord de branche étendu — vérifiez-le, il n'est pas affirmé ici." },
    { cle: "prioriteAcces", libelle: "Les salariés à temps partiel sont-ils informés des emplois à temps complet disponibles et leur priorité est-elle respectée ?", format: "oui / non", regle: "oui",
      motifNC: "La priorité d'accès n'est pas mise en œuvre : les salariés à temps partiel ont priorité pour l'attribution d'un emploi à temps complet ressortissant à leur catégorie professionnelle, et l'employeur porte à leur connaissance la liste des emplois disponibles." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre en conformité les contrats à temps partiel et le traitement des heures complémentaires.",
    etapes: [
      "Recenser les contrats à temps partiel et vérifier, un par un, l'écrit et ses mentions obligatoires.",
      "Confronter les durées contractuelles à la durée minimale applicable dans votre branche, et documenter chaque dérogation.",
      "Vérifier en paie la majoration de toutes les heures complémentaires, sur la période non prescrite.",
      "Organiser l'information des salariés à temps partiel sur les emplois à temps complet disponibles.",
    ],
    acteur: "Ressources humaines et paie",
    delai: "Recensement sous un mois ; régularisations à suivre",
    risque: "Le défaut d'écrit fait présumer le temps complet : requalification et rappels de salaire sur la période non prescrite. Le défaut de majoration se rattrape en rappels. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "avenant de régularisation d'un contrat à temps partiel" },
  },
});

item({
  id: "SOC-DUR-PAIE", categorie: "durée du travail et repos",
  intitule: "Mensualisation de la rémunération et acompte de quinzaine",
  articles: ["L3242-1"].filter(lu),
  articlesSouhaites: ["L3242-1"],
  condition: toutEmployeur,
  verifs: [
    { cle: "paiementMensuel", libelle: "La rémunération est-elle versée une fois par mois, à date fixe ?", format: "oui / non", regle: "oui",
      motifNC: "Le paiement mensuel n'est pas assuré : la rémunération des salariés est mensuelle et indépendante, pour un horaire de travail effectif déterminé, du nombre de jours travaillés dans le mois. Fixez une date de paie et tenez-la." },
    { cle: "acompteQuinzaine", libelle: "Un acompte correspondant, pour une quinzaine, à la moitié de la rémunération mensuelle est-il versé au salarié qui le demande ?", format: "oui / non", regle: "oui",
      motifNC: "L'acompte de quinzaine n'est pas servi sur demande : il est dû au salarié qui le demande, et son refus est une irrégularité simple à établir." },
  ],
  plan: {
    priorite: 3,
    action: "Assurer le paiement mensuel à date fixe et le service de l'acompte de quinzaine.",
    etapes: [
      "Fixer et annoncer la date de paie, et s'y tenir.",
      "Instituer une procédure écrite de demande d'acompte, accessible à tous les salariés.",
      "Vérifier que les bulletins portent bien les acomptes versés.",
    ],
    acteur: "Paie",
    delai: "Sous un mois",
    risque: "Le retard de paiement du salaire ouvre des dommages-intérêts et, réitéré, peut justifier une prise d'acte de rupture aux torts de l'employeur — faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "procédure d'acompte et calendrier de paie" },
  },
});

/* ═══════════════════════════════════════ 10. congés et jours ══ */

item({
  id: "SOC-CON-ACQUISITION", categorie: "congés et jours",
  intitule: "Acquisition des congés payés : deux jours et demi ouvrables par mois de travail",
  articles: ["L3141-3"].filter(lu),
  articlesSouhaites: ["L3141-3"],
  convention: true,
  condition: toutEmployeur,
  verifs: [
    { cle: "compteurCP", libelle: "Un compteur de congés payés est-il tenu pour chaque salarié et porté au bulletin de paie ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun compteur individuel n'est tenu : sans lui, ni l'acquisition ni la prise ne se prouvent, et le contentieux se règle au détriment de l'employeur. Ouvrez un compteur par salarié." },
    { cle: "acquisitionMaladie", libelle: "L'acquisition de congés pendant les périodes d'arrêt de travail a-t-elle été revue avec votre conseil ?", format: "oui / non", regle: "oui",
      motifNC: "Le traitement des arrêts de travail au regard de l'acquisition des congés n'a pas été revu : le sujet a évolué et il est financièrement lourd. Cette application ne tranche pas — faites-le vérifier par votre conseil sur les textes en vigueur." },
  ],
  plan: {
    priorite: 2,
    action: "Tenir le compteur de congés payés de chaque salarié et faire vérifier le traitement des absences.",
    etapes: [
      "Ouvrir ou fiabiliser le compteur individuel : acquis, pris, solde, période de rattachement.",
      "Porter le compteur au bulletin de paie.",
      "Faire vérifier par votre conseil, sur les textes en vigueur, l'acquisition pendant les arrêts de travail et l'information due au salarié à la reprise.",
      "Comparer avec votre convention collective : elle peut être plus favorable — cette application ne la lit pas.",
    ],
    acteur: "Paie, avec le conseil de l'entreprise",
    delai: "Compteur sous un mois",
    risque: "Un compteur absent ou faux se solde en rappels d'indemnité de congés payés sur la période non prescrite, majorés des congés sur rappels. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "état individuel des congés payés" },
  },
});

item({
  id: "SOC-CON-PERIODE", categorie: "congés et jours",
  intitule: "Période de prise des congés payés et information des salariés",
  articles: ["L3141-13", "D3141-5"].filter(lu),
  articlesSouhaites: ["L3141-13", "D3141-5"],
  condition: toutEmployeur,
  verifs: [
    { cle: "periodeFixee", libelle: "La période de prise des congés est-elle fixée, et comprend-elle en tout état de cause la période du 1er mai au 31 octobre de chaque année ?", format: "oui / non", regle: "oui",
      motifNC: "La période de prise n'est pas fixée, ou ne couvre pas le 1er mai au 31 octobre : fixez-la — par accord s'il en existe un, à défaut par décision de l'employeur après avis du comité." },
    { cle: "informationDeuxMois", libelle: "La période de prise est-elle portée à la connaissance des salariés au moins deux mois avant son ouverture ?", format: "oui / non", regle: "oui",
      motifNC: "L'information n'est pas donnée deux mois avant l'ouverture de la période (D. 3141-5) : c'est un délai simple à tenir et simple à prouver — affichez et datez." },
  ],
  plan: {
    priorite: 3,
    action: "Fixer la période de prise des congés et l'annoncer deux mois avant son ouverture.",
    etapes: [
      "Rechercher l'accord d'entreprise ou de branche qui fixe la période ; à défaut, arrêter la période après avis du comité social et économique.",
      "Vérifier qu'elle comprend le 1er mai au 31 octobre.",
      "Diffuser l'information au moins deux mois avant l'ouverture, par affichage et par écrit individuel, et conserver la preuve de la diffusion.",
    ],
    acteur: "Ressources humaines",
    delai: "Au plus tard deux mois avant l'ouverture de la période",
    risque: "L'employeur qui n'a pas mis le salarié en mesure de prendre ses congés en doit l'indemnité : le défaut d'information a un coût direct.",
    modele: { page: "documents.html", nom: "note d'information — période de prise des congés" },
  },
});

item({
  id: "SOC-CON-ORDRE", categorie: "congés et jours",
  intitule: "Ordre des départs en congé : critères, communication et délai de modification",
  articles: ["L3141-15", "L3141-16", "D3141-6"].filter(lu),
  articlesSouhaites: ["L3141-15", "L3141-16", "D3141-6"],
  condition: toutEmployeur,
  verifs: [
    { cle: "criteresDefinis", libelle: "Les critères de l'ordre des départs sont-ils définis (situation de famille, ancienneté, activité chez d'autres employeurs) ?", format: "oui / non", regle: "oui",
      motifNC: "Les critères de l'ordre des départs ne sont pas définis : à défaut de stipulation conventionnelle, l'employeur les fixe après avis du comité, en tenant compte notamment de la situation de famille, de l'ancienneté et de l'activité éventuelle chez d'autres employeurs (L. 3141-16)." },
    { cle: "ordreCommunique", libelle: "L'ordre des départs est-il communiqué à chaque salarié au moins un mois avant son départ ?", format: "oui / non", regle: "oui",
      motifNC: "L'ordre des départs n'est pas communiqué un mois avant (D. 3141-6) : la communication se fait par tout moyen, elle se date, et elle se prouve." },
    { cle: "delaiModification", libelle: "L'ordre et les dates sont-ils tenus dès lors qu'on est à moins d'un mois de la date prévue, sauf circonstances exceptionnelles ?", format: "oui / non", regle: "oui",
      motifNC: "Des modifications sont opérées à moins d'un mois de la date prévue hors circonstances exceptionnelles : la modification tardive engage l'employeur et se paie en dommages-intérêts. Formalisez la règle et l'exception." },
  ],
  plan: {
    priorite: 3,
    action: "Formaliser l'ordre des départs, le communiquer un mois avant et respecter le délai de modification.",
    etapes: [
      "Rechercher les stipulations conventionnelles sur l'ordre des départs ; à défaut, arrêter les critères après avis du comité.",
      "Établir le tableau des départs par service et le communiquer individuellement, un mois au moins avant chaque départ.",
      "Écrire la procédure de modification exceptionnelle : qui décide, sur quel motif, avec quelle trace.",
    ],
    acteur: "Ressources humaines et encadrement",
    delai: "Avant l'ouverture de la période de prise",
    risque: "Une modification tardive ou un refus non motivé se traduisent par des dommages-intérêts et détériorent le dialogue social ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "tableau de l'ordre des départs et note de communication" },
  },
});

item({
  id: "SOC-CON-SOLIDARITE", categorie: "congés et jours",
  intitule: "Journée de solidarité : modalités fixées et travail accompli dans la limite de sept heures",
  articles: ["L3133-7", "L3133-8"].filter(lu),
  articlesSouhaites: ["L3133-7", "L3133-8"],
  condition: toutEmployeur,
  verifs: [
    { cle: "modalitesFixees", libelle: "Les modalités d'accomplissement de la journée de solidarité sont-elles fixées (accord, ou à défaut décision de l'employeur après avis du comité) ?", format: "oui / non", regle: "oui",
      motifNC: "Les modalités ne sont pas fixées : la journée de solidarité ne s'improvise pas au fil de l'année. Fixez-les par accord, à défaut par décision unilatérale après consultation du comité, et informez les salariés." },
    { cle: "limiteSeptHeures", libelle: "Le travail accompli au titre de la journée de solidarité reste-t-il dans la limite de sept heures, non rémunéré, et proratisé pour les temps partiels ?", format: "oui / non", regle: "oui",
      motifNC: "La limite de sept heures n'est pas tenue, ou le prorata des temps partiels n'est pas fait : au-delà de la limite, les heures sont des heures de travail à rémunérer normalement." },
  ],
  plan: {
    priorite: 3,
    action: "Fixer et documenter les modalités de la journée de solidarité.",
    etapes: [
      "Rechercher l'accord applicable ; à défaut, consulter le comité social et économique puis arrêter la décision.",
      "Informer les salariés par écrit, en précisant la date ou le mode d'accomplissement retenu.",
      "Vérifier le paramétrage en paie, notamment le prorata des salariés à temps partiel.",
    ],
    acteur: "Ressources humaines et paie",
    delai: "Avant l'échéance retenue",
    risque: "Des heures accomplies au-delà de la limite sans rémunération donnent lieu à rappels de salaire ; l'absence de modalités fixées fragilise toute retenue opérée.",
    modele: { page: "documents.html", nom: "décision et note d'information — journée de solidarité" },
  },
});

/* ═══════════════════════════════════ 11. embauche et contrat ══ */

item({
  id: "SOC-EMB-DPAE", categorie: "embauche et contrat",
  intitule: "Déclaration préalable à l'embauche (DPAE)",
  articles: ["L1221-10", "L1221-11"].filter(lu),
  articlesSouhaites: ["L1221-10", "L1221-11"],
  condition: toutEmployeur,
  verifs: [
    { cle: "dpaeSystematique", libelle: "Une déclaration préalable à l'embauche est-elle faite avant l'entrée de chaque salarié, sans exception ?", format: "oui / non", regle: "oui",
      motifNC: "La déclaration préalable n'est pas systématique : l'embauche ne peut intervenir qu'après déclaration nominative auprès de l'organisme de recouvrement. C'est l'irrégularité la plus lourdement traitée, parce qu'elle ouvre la qualification de travail dissimulé." },
    { cle: "accusesConserves", libelle: "Les accusés de réception de l'organisme sont-ils archivés et rapprochables du registre du personnel ?", format: "oui / non", regle: "oui",
      motifNC: "Les accusés ne sont pas archivés : sans eux, la déclaration ne se prouve pas. Archivez-les et rapprochez-les nominativement du registre unique du personnel." },
  ],
  plan: {
    priorite: 1,
    action: "Rendre la déclaration préalable à l'embauche systématique et prouvable.",
    etapes: [
      "Rapprocher, salarié par salarié, le registre unique du personnel et les accusés de déclaration.",
      "Traiter sans délai les embauches sans déclaration retrouvée, avec votre conseil.",
      "Instituer un point de contrôle avant chaque entrée : pas de déclaration, pas d'entrée.",
      "Archiver les accusés dans un dossier unique, accessible en cas de contrôle.",
    ],
    acteur: "Ressources humaines, avec la paie",
    delai: "Contrôle immédiat ; régularisation sans délai",
    risque: "L'omission ouvre la qualification de travail dissimulé, avec ses conséquences pénales, sociales et prud'homales (indemnité forfaitaire) ; l'article de sanction n'a pas été lu au relais pour cet audit — faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "procédure d'embauche et liste de contrôle" },
  },
});

item({
  id: "SOC-EMB-INFORMATION", categorie: "embauche et contrat",
  intitule: "Documents d'information sur la relation de travail remis au salarié",
  articles: ["L1221-5-1", "R1221-34", "R1221-35"].filter(lu),
  articlesSouhaites: ["L1221-5-1", "R1221-34", "R1221-35"],
  condition: toutEmployeur,
  verifs: [
    { cle: "documentsRemis", libelle: "Chaque salarié reçoit-il, dans les délais, un ou plusieurs documents portant les informations principales relatives à la relation de travail ?", format: "oui / non", regle: "oui",
      motifNC: "Les documents d'information ne sont pas remis : l'employeur remet au salarié un ou plusieurs documents écrits contenant les informations principales relatives à la relation de travail (L. 1221-5-1). Un contrat de travail complet peut y suffire — encore faut-il vérifier qu'il porte bien toutes les rubriques de R. 1221-34." },
    { cle: "rubriquesCompletes", libelle: "Les rubriques réglementaires sont-elles toutes couvertes (identité des parties, lieu, poste, dates, durée du travail, rémunération, congés, procédures de rupture, convention collective, protection sociale, formation) ?", format: "oui / non", regle: "oui",
      motifNC: "Les rubriques ne sont pas toutes couvertes : reprenez l'énumération de l'article R. 1221-34 et complétez le document ou le contrat type. Une remise partielle ne vaut pas remise." },
    { cle: "preuveRemise", libelle: "La remise est-elle datée et prouvable (récépissé, signature, envoi horodaté) ?", format: "oui / non", regle: "oui",
      motifNC: "La remise n'est pas prouvable : datez-la et faites-en accuser réception. La charge de la preuve pèse sur l'employeur." },
  ],
  plan: {
    priorite: 2,
    action: "Établir le document d'information sur la relation de travail et le remettre contre récépissé.",
    etapes: [
      "Comparer votre contrat type à l'énumération de l'article R. 1221-34, rubrique par rubrique.",
      "Compléter le contrat, ou établir un document d'information distinct pour les rubriques manquantes.",
      "Organiser la remise et la preuve de la remise dès l'entrée du salarié.",
      "Traiter le cas des salariés en poste qui en font la demande.",
    ],
    acteur: "Ressources humaines",
    delai: "Contrat type révisé sous un mois",
    risque: "Le défaut de remise expose à une mise en demeure puis à une action du salarié ; le sujet est récent et contrôlé — faites relire votre contrat type par votre conseil.",
    modele: { page: "documents.html", nom: "document d'information sur la relation de travail" },
  },
});

item({
  id: "SOC-EMB-ESSAI", categorie: "embauche et contrat",
  intitule: "Période d'essai : durée, renouvellement et délai de prévenance",
  articles: ["L1221-19", "L1221-21", "L1221-25", "L1221-26"].filter(lu),
  articlesSouhaites: ["L1221-19", "L1221-21", "L1221-25", "L1221-26"],
  condition: toutEmployeur,
  verifs: [
    { cle: "dureeConforme", libelle: "La durée de la période d'essai stipulée aux contrats respecte-t-elle les maxima légaux selon la catégorie du salarié ?", format: "oui / non", regle: "oui",
      motifNC: "Une durée d'essai excède les maxima : la stipulation excessive est privée d'effet, et la rupture intervenue au-delà s'analyse en licenciement sans cause réelle et sérieuse. Corrigez le contrat type." },
    { cle: "renouvellementEncadre", libelle: "Le renouvellement, lorsqu'il est pratiqué, est-il prévu par un accord de branche étendu, stipulé au contrat et accepté par écrit par le salarié pendant l'essai ?", format: "oui / non", regle: "oui",
      motifNC: "Le renouvellement n'est pas encadré : il suppose un accord de branche étendu qui en fixe les conditions et les durées, une stipulation expresse au contrat ou à la lettre d'engagement, et l'accord exprès du salarié recueilli pendant l'essai." },
    { cle: "prevenanceRespectee", libelle: "Le délai de prévenance est-il respecté lorsque l'employeur met fin à l'essai, et par le salarié lorsqu'il en prend l'initiative ?", format: "oui / non", regle: "oui",
      motifNC: "Le délai de prévenance n'est pas respecté : sa méconnaissance par l'employeur ouvre une indemnité compensatrice, calculée sur la période non exécutée. Intégrez le délai au processus de rupture d'essai." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre le contrat type et le processus de rupture d'essai en conformité.",
    etapes: [
      "Confronter les durées d'essai du contrat type aux maxima légaux, par catégorie.",
      "Vérifier dans la convention de branche l'existence et les conditions du renouvellement.",
      "Écrire le processus de rupture d'essai : qui décide, avec quel délai de prévenance, avec quelle lettre.",
      "Recenser les essais en cours pour vérifier qu'aucun n'est irrégulier.",
    ],
    acteur: "Ressources humaines",
    delai: "Contrat type révisé sous un mois",
    risque: "Une rupture d'essai irrégulière s'analyse en licenciement sans cause réelle et sérieuse ; le défaut de prévenance ouvre une indemnité. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "clause d'essai et lettre de rupture d'essai" },
  },
});

item({
  id: "SOC-EMB-RECRUTEMENT", categorie: "embauche et contrat",
  intitule: "Information du candidat sur les méthodes de recrutement et du salarié sur les dispositifs de collecte",
  articles: ["L1221-8", "L1221-9", "L1222-4"].filter(lu),
  articlesSouhaites: ["L1221-8", "L1221-9", "L1222-4"],
  condition: toutEmployeur,
  verifs: [
    { cle: "candidatInforme", libelle: "Le candidat est-il expressément informé, préalablement à leur mise en œuvre, des méthodes et techniques d'aide au recrutement utilisées ?", format: "oui / non", regle: "oui",
      motifNC: "Le candidat n'est pas informé des méthodes et techniques employées : l'information est préalable et expresse. Elle se pose en une phrase dans l'annonce et la convocation à l'entretien." },
    { cle: "pertinence", libelle: "Les informations demandées au candidat ont-elles pour seule finalité d'apprécier son aptitude à occuper l'emploi, et présentent-elles un lien direct et nécessaire avec celui-ci ?", format: "oui / non", regle: "oui",
      motifNC: "Des informations sans lien direct et nécessaire avec l'emploi sont recueillies : réduisez le questionnaire de recrutement à ce qui apprécie l'aptitude professionnelle." },
    { cle: "dispositifsAnnonces", libelle: "Les salariés sont-ils informés préalablement des dispositifs de collecte d'informations les concernant personnellement (badgeage, géolocalisation, vidéo, outils de suivi) ?", format: "oui / non", regle: "oui",
      motifNC: "Un dispositif de collecte n'a pas été porté préalablement à la connaissance des salariés : une information recueillie par un dispositif non annoncé est inopposable au salarié, et la sanction fondée sur elle tombe avec elle. Informez, et faites-le par écrit." },
  ],
  plan: {
    priorite: 2,
    action: "Écrire et diffuser l'information due aux candidats et aux salariés sur les méthodes et les dispositifs.",
    etapes: [
      "Recenser les méthodes d'aide au recrutement employées (tests, mises en situation, entretiens structurés, outils automatisés) et les annoncer dans l'annonce et la convocation.",
      "Revoir le questionnaire de recrutement pour n'y laisser que ce qui apprécie l'aptitude professionnelle.",
      "Recenser les dispositifs de collecte en place et vérifier, pour chacun, la preuve de l'information préalable des salariés et de la consultation du comité lorsqu'il existe.",
      "Faire le lien avec vos obligations en matière de données personnelles, hors du champ du code du travail — cette application ne les vérifie pas.",
    ],
    acteur: "Ressources humaines, avec le référent données personnelles s'il en existe un",
    delai: "Sous deux mois",
    risque: "Une preuve obtenue par un dispositif non annoncé est écartée, et la mesure qu'elle fondait tombe. Le sujet croise la réglementation sur les données personnelles, qui n'est pas lue par cette application.",
    modele: { page: "documents.html", nom: "note d'information — méthodes de recrutement et dispositifs de collecte" },
  },
});

item({
  id: "SOC-EMB-CDD", categorie: "embauche et contrat",
  intitule: "Contrat à durée déterminée : écrit et motif, transmission, délai de carence, indemnité de fin de contrat",
  articles: ["L1242-12", "L1242-2", "L1242-13", "L1244-3", "L1244-3-1", "L1243-8"].filter(lu),
  articlesSouhaites: ["L1242-12", "L1242-2", "L1242-13", "L1244-3", "L1244-3-1", "L1243-8"],
  condition: p => {
    const s = M.ouiNon(p, "contratsCourts", "L'entreprise recourt-elle à des contrats à durée déterminée, à l'intérim ou à des stagiaires ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun recours aux contrats courts n'est déclaré : les obligations propres au contrat à durée déterminée n'ont pas d'objet." };
    return { du: true, motif: "L'entreprise recourt à des contrats courts : l'écrit et son motif, le délai de transmission, le délai de carence et l'indemnité de fin de contrat s'appliquent." };
  },
  verifs: [
    { cle: "ecritMotif", libelle: "Chaque contrat à durée déterminée est-il écrit et porte-t-il la définition précise de son motif ?", format: "oui / non", regle: "oui",
      motifNC: "Un contrat n'est pas écrit, ou son motif n'est pas précis : à défaut d'écrit comportant la définition précise du motif, le contrat est réputé conclu à durée indéterminée. C'est la requalification la plus fréquente." },
    { cle: "casRecours", libelle: "Chaque contrat correspond-il à l'un des cas de recours autorisés, et non à un emploi lié à l'activité normale et permanente de l'entreprise ?", format: "oui / non", regle: "oui",
      motifNC: "Un contrat ne correspond pas à un cas de recours autorisé : un contrat à durée déterminée ne peut avoir ni pour objet ni pour effet de pourvoir durablement un emploi lié à l'activité normale et permanente de l'entreprise." },
    { cle: "transmission", libelle: "Le contrat est-il transmis au salarié au plus tard dans les deux jours ouvrables suivant l'embauche ?", format: "oui / non", regle: "oui",
      motifNC: "Le contrat n'est pas transmis dans les deux jours ouvrables suivant l'embauche (L. 1242-13) : datez la transmission et conservez-en la preuve." },
    { cle: "carence", libelle: "Le délai de carence entre deux contrats sur le même poste est-il calculé et respecté ?", format: "oui / non", regle: "oui",
      motifNC: "Le délai de carence n'est pas respecté : il se calcule sur la durée du contrat précédent, renouvellement inclus, selon les règles de la convention ou de l'accord de branche étendu ; à défaut d'accord, selon l'article L. 1244-3-1. Les cas où il ne s'applique pas sont limitativement énumérés — ne les supposez pas." },
    { cle: "precarite", libelle: "L'indemnité de fin de contrat est-elle versée lorsqu'elle est due ?", format: "oui / non", regle: "oui",
      motifNC: "L'indemnité de fin de contrat n'est pas versée : elle est due lorsque la relation ne se poursuit pas par un contrat à durée indéterminée, sauf les cas d'exclusion prévus par la loi. Vérifiez la période non prescrite." },
  ],
  plan: {
    priorite: 1,
    action: "Mettre en conformité le recours aux contrats à durée déterminée.",
    etapes: [
      "Recenser les contrats en cours et des vingt-quatre derniers mois : motif, date de signature, date de transmission, poste.",
      "Repérer les successions de contrats sur un même poste et vérifier le délai de carence appliqué.",
      "Vérifier en paie le versement de l'indemnité de fin de contrat, cas d'exclusion compris.",
      "Réviser le contrat type et instituer un contrôle avant chaque signature.",
    ],
    acteur: "Ressources humaines et paie, avec le conseil de l'entreprise",
    delai: "Recensement sous un mois",
    risque: "La requalification en contrat à durée indéterminée emporte indemnité de requalification, indemnités de rupture et, le cas échéant, licenciement sans cause réelle et sérieuse. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "grille de contrôle des contrats à durée déterminée" },
  },
});

/* ══════════════════════════════════════ 12. fin du contrat ══ */

item({
  id: "SOC-FIN-DOCUMENTS", categorie: "fin du contrat",
  intitule: "Documents de fin de contrat : certificat de travail, reçu pour solde de tout compte, attestation destinée à l'assurance chômage",
  articles: ["L1234-19", "D1234-6", "L1234-20", "R1234-9"].filter(lu),
  articlesSouhaites: ["L1234-19", "D1234-6", "L1234-20", "R1234-9"],
  condition: toutEmployeur,
  verifs: [
    { cle: "certificat", libelle: "Un certificat de travail portant les mentions réglementaires est-il délivré à l'expiration de chaque contrat ?", format: "oui / non", regle: "oui",
      motifNC: "Le certificat de travail n'est pas délivré systématiquement : il est dû à l'expiration du contrat, quelle qu'en soit la cause, et ses mentions sont fixées par l'article D. 1234-6." },
    { cle: "soldeToutCompte", libelle: "Un reçu pour solde de tout compte détaillant les sommes versées est-il établi et remis en double exemplaire ?", format: "oui / non", regle: "oui",
      motifNC: "Le reçu pour solde de tout compte n'est pas établi ou n'est pas détaillé : le reçu fait l'inventaire des sommes versées, et sa mention doit être conforme — un reçu irrégulier ne produit pas l'effet libératoire que l'employeur en attend." },
    { cle: "attestation", libelle: "L'attestation destinée à l'organisme d'assurance chômage est-elle délivrée au salarié et transmise à l'organisme ?", format: "oui / non", regle: "oui",
      motifNC: "L'attestation n'est pas délivrée ou n'est pas transmise : son défaut retarde l'indemnisation du salarié et se répare en dommages-intérêts, sans qu'il ait à démontrer un préjudice particulier." },
  ],
  plan: {
    priorite: 1,
    action: "Établir la liasse de fin de contrat et la remettre systématiquement.",
    etapes: [
      "Constituer une liasse type : certificat de travail, reçu pour solde de tout compte en double exemplaire, attestation destinée à l'assurance chômage, information sur la portabilité des couvertures.",
      "Vérifier les mentions du certificat au regard de l'article D. 1234-6.",
      "Instituer un contrôle de sortie : aucun départ sans liasse remise et datée.",
      "Rattraper les sorties récentes pour lesquelles un document manque.",
    ],
    acteur: "Ressources humaines et paie",
    delai: "Liasse type sous quinze jours",
    risque: "La remise tardive ou incomplète ouvre des dommages-intérêts et prive le reçu de son effet libératoire ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "liasse de fin de contrat" },
  },
});

item({
  id: "SOC-FIN-LICENCIEMENT", categorie: "fin du contrat",
  intitule: "Licenciement pour motif personnel : convocation, entretien, notification et précision des motifs",
  articles: ["L1232-2", "L1232-4", "L1232-6", "L1235-2", "R1232-13"].filter(lu),
  articlesSouhaites: ["L1232-2", "L1232-4", "L1232-6", "L1235-2", "R1232-13"],
  module: { nom: "discipline et règlement intérieur", page: "audit-discipline.html" },
  condition: toutEmployeur,
  verifs: [
    { cle: "convocationConforme", libelle: "La lettre de convocation à l'entretien préalable indique-t-elle l'objet, la date, l'heure et le lieu, et rappelle-t-elle la faculté de se faire assister ?", format: "oui / non", regle: "oui",
      motifNC: "La convocation n'est pas conforme : elle indique l'objet de l'entretien, précise la date, l'heure et le lieu, et rappelle la faculté pour le salarié de se faire assister — par une personne de l'entreprise ou, en l'absence d'institutions représentatives, par un conseiller extérieur inscrit sur la liste départementale." },
    { cle: "delaiCinqJours", libelle: "L'entretien se tient-il au moins cinq jours ouvrables après la présentation de la lettre de convocation ?", format: "oui / non", regle: "oui",
      motifNC: "Le délai de cinq jours ouvrables n'est pas respecté : le délai court de la présentation de la lettre, non de son envoi. Un entretien tenu trop tôt est une irrégularité de procédure indemnisée." },
    { cle: "notificationMotivee", libelle: "La lettre de licenciement énonce-t-elle le ou les motifs invoqués, et est-elle envoyée dans les délais ?", format: "oui / non", regle: "oui",
      motifNC: "La lettre n'énonce pas les motifs, ou n'est pas envoyée dans les délais : la lettre fixe les limites du litige — un motif qui n'y figure pas ne pourra pas être invoqué devant le juge." },
    { cle: "precisionMotifs", libelle: "La procédure de précision des motifs, dans les quinze jours de la notification, est-elle connue et suivie ?", format: "oui / non", regle: "oui",
      motifNC: "La procédure de précision des motifs n'est pas suivie : l'employeur peut préciser les motifs après la notification, dans les conditions et délais de l'article R. 1232-13 ; à défaut, l'insuffisance de motivation ne prive pas nécessairement le licenciement de cause, mais elle ouvre une indemnité." },
  ],
  plan: {
    priorite: 1,
    action: "Écrire et tenir la procédure de licenciement pour motif personnel, du premier courrier à la précision des motifs.",
    etapes: [
      "Établir les trames de convocation et de notification, et les faire relire par votre conseil.",
      "Écrire le calendrier type : présentation de la convocation, entretien à cinq jours ouvrables au moins, notification, fenêtre de précision des motifs.",
      "Former l'encadrement à la conduite de l'entretien : indiquer le motif, recueillir les explications, ne rien décider à l'entretien.",
      "Conduire l'audit détaillé de la matière disciplinaire dans le module « discipline et règlement intérieur ».",
    ],
    acteur: "Direction et ressources humaines, avec le conseil de l'entreprise",
    delai: "Trames et calendrier avant toute nouvelle procédure",
    risque: "Une procédure irrégulière ouvre une indemnité distincte ; une lettre insuffisamment motivée fragilise le fond du licenciement. Faites chiffrer par votre conseil.",
    modele: { page: "audit-discipline.html", nom: "module d'audit de la discipline (questionnaire complet)" },
  },
});

item({
  id: "SOC-FIN-RUPTURE-CONV", categorie: "fin du contrat",
  intitule: "Rupture conventionnelle individuelle : entretiens, indemnité, rétractation et homologation",
  articles: ["L1237-11", "L1237-13", "L1237-14"].filter(lu),
  articlesSouhaites: ["L1237-11", "L1237-13", "L1237-14"],
  condition: toutEmployeur,
  verifs: [
    { cle: "entretiens", libelle: "La convention est-elle précédée d'un ou plusieurs entretiens, et le salarié est-il informé de la faculté de se faire assister ?", format: "oui / non", regle: "oui",
      motifNC: "Les entretiens ne sont pas organisés, ou l'information sur l'assistance n'est pas donnée : la rupture conventionnelle résulte d'une convention signée par les parties, qui garantit la liberté du consentement — les entretiens en sont la trace." },
    { cle: "indemnite", libelle: "L'indemnité spécifique de rupture conventionnelle est-elle au moins égale à l'indemnité légale de licenciement ?", format: "oui / non", regle: "oui",
      motifNC: "L'indemnité est inférieure au minimum : le montant ne peut être inférieur à celui de l'indemnité légale de licenciement. Recalculez-le, et vérifiez si votre convention collective impose davantage." },
    { cle: "retractation", libelle: "Le délai de rétractation de quinze jours calendaires est-il respecté avant l'envoi de la demande d'homologation ?", format: "oui / non", regle: "oui",
      motifNC: "Le délai de rétractation n'est pas respecté : chacune des parties dispose de quinze jours calendaires à compter de la signature. Une demande envoyée trop tôt vicie la procédure." },
    { cle: "homologation", libelle: "La demande d'homologation est-elle adressée à l'autorité administrative et sa décision conservée ?", format: "oui / non", regle: "oui",
      motifNC: "La demande d'homologation n'est pas adressée, ou la décision n'est pas conservée : sans homologation, la convention ne produit pas d'effet et la rupture reste sans cause." },
  ],
  plan: {
    priorite: 2,
    action: "Sécuriser le processus de rupture conventionnelle individuelle.",
    etapes: [
      "Établir la trame de convocation à l'entretien, avec la mention de la faculté d'assistance.",
      "Calculer l'indemnité, en comparant l'indemnité légale et, le cas échéant, l'indemnité conventionnelle — cette application ne lit pas la convention collective.",
      "Tenir le calendrier : signature, quinze jours calendaires de rétractation, demande d'homologation, décision.",
      "Archiver la convention, les preuves de remise et la décision d'homologation.",
    ],
    acteur: "Ressources humaines, avec le conseil de l'entreprise",
    delai: "Trames disponibles avant toute nouvelle rupture",
    risque: "Un consentement vicié ou un délai non tenu fait requalifier la rupture en licenciement sans cause réelle et sérieuse. Faites apprécier chaque dossier par votre conseil.",
    modele: { page: "documents.html", nom: "calendrier et trames de rupture conventionnelle" },
  },
});

item({
  id: "SOC-FIN-INAPTITUDE", categorie: "fin du contrat",
  intitule: "Inaptitude constatée par le médecin du travail : recherche de reclassement et reprise du paiement du salaire",
  articles: ["L1226-2", "L1226-4"].filter(lu),
  articlesSouhaites: ["L1226-2", "L1226-4"],
  condition: toutEmployeur,
  verifs: [
    { cle: "reclassementRecherche", libelle: "En cas d'inaptitude, une recherche de reclassement est-elle menée et documentée, en tenant compte des conclusions écrites du médecin du travail et de ses indications ?", format: "oui / non", regle: "oui",
      motifNC: "La recherche de reclassement n'est pas menée ou n'est pas documentée : l'employeur propose un autre emploi approprié aux capacités du salarié, au vu des conclusions écrites du médecin du travail. Une recherche non tracée équivaut à une recherche non faite." },
    { cle: "avisComite", libelle: "Le comité social et économique est-il consulté sur les propositions de reclassement lorsqu'un comité existe ?", format: "oui / non", regle: "oui",
      motifNC: "Le comité n'est pas consulté sur le reclassement : la consultation est une étape à part entière, et son omission se répare en dommages-intérêts." },
    { cle: "repriseSalaire", libelle: "Le salaire est-il repris au terme d'un mois si le salarié n'est ni reclassé ni licencié ?", format: "oui / non", regle: "oui",
      motifNC: "Le salaire n'est pas repris au terme du délai d'un mois à compter de la date de l'examen médical de reprise : la reprise est automatique et se rattrape en rappels de salaire, sans faute à établir." },
  ],
  plan: {
    priorite: 1,
    action: "Écrire la procédure d'inaptitude : reclassement documenté, consultation du comité, reprise du salaire au terme du mois.",
    etapes: [
      "Instituer une alerte à la date de l'avis d'inaptitude, avec l'échéance du délai d'un mois.",
      "Constituer le dossier de recherche de reclassement : postes examinés, échanges avec le médecin du travail, réponses reçues.",
      "Consulter le comité social et économique sur les propositions, et en conserver le procès-verbal.",
      "Faire relire par votre conseil chaque dossier avant toute notification de licenciement pour inaptitude.",
    ],
    acteur: "Ressources humaines, avec le service de prévention et de santé au travail et le conseil de l'entreprise",
    delai: "Alerte dès la réception de l'avis ; échéance à un mois",
    risque: "Le défaut de reclassement documenté prive le licenciement de cause réelle et sérieuse ; l'absence de reprise du salaire ouvre des rappels immédiats. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "dossier de reclassement après inaptitude" },
  },
});

/* ═══════════════════════════ 13. égalité et non-discrimination ══ */

item({
  id: "SOC-EGA-REMUNERATION", categorie: "égalité et non-discrimination",
  intitule: "Égalité de rémunération entre les femmes et les hommes pour un même travail ou un travail de valeur égale",
  articles: ["L3221-2"].filter(lu),
  articlesSouhaites: ["L3221-2"],
  condition: toutEmployeur,
  verifs: [
    { cle: "comparaisonFaite", libelle: "Une comparaison des rémunérations à emploi et ancienneté comparables a-t-elle été faite entre les femmes et les hommes ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune comparaison n'est faite : sans elle, un écart injustifié ne se voit pas, et il se découvre au contentieux. Conduisez la comparaison poste par poste." },
    { cle: "ecartsTraites", libelle: "Les écarts constatés sont-ils expliqués par des éléments objectifs et matériellement vérifiables, ou corrigés ?", format: "oui / non", regle: "oui",
      motifNC: "Des écarts subsistent sans explication objective : l'employeur assure, pour un même travail ou un travail de valeur égale, l'égalité de rémunération. Corrigez, ou documentez l'élément objectif qui justifie l'écart." },
  ],
  plan: {
    priorite: 1,
    action: "Comparer les rémunérations à travail de valeur égale et traiter les écarts.",
    etapes: [
      "Constituer les groupes de comparaison : même emploi, ou emplois de valeur égale au regard des connaissances, de l'expérience, des responsabilités et de la charge physique ou nerveuse.",
      "Calculer les écarts et rechercher, pour chacun, l'élément objectif et matériellement vérifiable qui l'expliquerait.",
      "Corriger les écarts injustifiés et documenter la correction.",
      "Rapprocher ce travail de l'index de l'égalité professionnelle et de la négociation sur l'égalité, si l'entreprise y est tenue.",
    ],
    acteur: "Ressources humaines et direction",
    delai: "Comparaison sous trois mois",
    risque: "Un écart injustifié se rattrape en rappels de salaire sur la période non prescrite, majorés des congés payés afférents ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "grille de comparaison des rémunérations" },
  },
});

item({
  id: "SOC-EGA-DISCRIMINATION", categorie: "égalité et non-discrimination",
  intitule: "Interdiction des discriminations dans les décisions de gestion du personnel",
  articles: ["L1132-1", "L1132-4"].filter(lu),
  articlesSouhaites: ["L1132-1", "L1132-4"],
  condition: toutEmployeur,
  verifs: [
    { cle: "criteresObjectifs", libelle: "Les décisions de recrutement, d'affectation, de rémunération, de formation et de promotion reposent-elles sur des critères objectifs, écrits et traçables ?", format: "oui / non", regle: "oui",
      motifNC: "Les décisions ne reposent pas sur des critères écrits et traçables : en matière de discrimination, le salarié présente des éléments de fait, et c'est à l'employeur de prouver que sa décision est justifiée par des éléments objectifs étrangers à toute discrimination. Sans trace, la preuve est impossible." },
    { cle: "encadrementForme", libelle: "L'encadrement qui décide en matière de recrutement et de gestion des carrières est-il sensibilisé aux critères prohibés ?", format: "oui / non", regle: "oui",
      motifNC: "L'encadrement n'est pas sensibilisé : les décisions litigieuses se prennent au niveau des managers, et c'est l'entreprise qui répond. Organisez une sensibilisation et gardez-en la trace." },
  ],
  plan: {
    priorite: 1,
    action: "Documenter les critères de décision et sensibiliser ceux qui décident.",
    etapes: [
      "Écrire les critères de recrutement, d'augmentation et de promotion, et les rendre opposables en interne.",
      "Conserver, pour chaque décision, la trace du critère appliqué.",
      "Sensibiliser l'encadrement aux critères prohibés et à la charge de la preuve.",
      "Rapprocher ce travail des affichages d'information sur les discriminations, dus par ailleurs.",
    ],
    acteur: "Direction et ressources humaines",
    delai: "Critères écrits sous deux mois",
    risque: "Toute disposition ou tout acte discriminatoire est nul, et la réparation intégrale du préjudice est due ; les demandes se cumulent avec celles tirées du harcèlement. Faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "note de critères objectifs de décision" },
  },
});

item({
  id: "SOC-EGA-SEXISME", categorie: "égalité et non-discrimination",
  intitule: "Interdiction des agissements sexistes",
  articles: ["L1142-2-1"].filter(lu),
  articlesSouhaites: ["L1142-2-1"],
  condition: toutEmployeur,
  verifs: [
    { cle: "regleEcrite", libelle: "L'interdiction des agissements sexistes est-elle écrite et diffusée (règlement intérieur lorsqu'il en existe un, note de service, livret d'accueil) ?", format: "oui / non", regle: "oui",
      motifNC: "L'interdiction n'est pas écrite ni diffusée : nul ne doit subir d'agissement sexiste, défini comme tout agissement lié au sexe d'une personne, ayant pour objet ou pour effet de porter atteinte à sa dignité ou de créer un environnement intimidant, hostile, dégradant, humiliant ou offensant." },
    { cle: "traitementSignalements", libelle: "Une voie de signalement existe-t-elle, et les signalements reçus sont-ils traités et tracés ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune voie de signalement identifiée n'existe, ou les signalements ne sont pas tracés : l'inaction de l'employeur après signalement est le grief le plus fréquemment retenu contre lui." },
  ],
  plan: {
    priorite: 2,
    action: "Écrire l'interdiction, ouvrir une voie de signalement et traiter les signalements.",
    etapes: [
      "Faire figurer l'interdiction dans le règlement intérieur s'il en existe un, sinon dans une note de service diffusée.",
      "Désigner la voie de signalement et la faire connaître, en articulation avec les référents harcèlement lorsqu'ils existent.",
      "Écrire la procédure de traitement : accusé de réception, enquête, mesures, information du signalant.",
      "Rapprocher ce travail de l'évaluation des risques, qui inclut les agissements sexistes.",
    ],
    acteur: "Direction, ressources humaines et référents harcèlement",
    delai: "Sous deux mois",
    risque: "L'agissement sexiste non traité nourrit les demandes au titre du manquement à l'obligation de sécurité et du harcèlement ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "note de service — interdiction des agissements sexistes" },
  },
});

item({
  id: "SOC-EGA-HANDICAP", categorie: "égalité et non-discrimination",
  intitule: "Mesures appropriées pour l'accès à l'emploi et le maintien dans l'emploi des travailleurs handicapés",
  articles: ["L5213-6"].filter(lu),
  articlesSouhaites: ["L5213-6"],
  condition: toutEmployeur,
  verifs: [
    { cle: "mesuresExaminees", libelle: "Les mesures appropriées d'aménagement du poste et de l'organisation sont-elles examinées pour chaque situation connue de handicap ?", format: "oui / non", regle: "oui",
      motifNC: "L'examen n'est pas fait : l'employeur prend, en fonction des besoins dans une situation concrète, les mesures appropriées pour permettre aux travailleurs handicapés d'accéder à un emploi, de le conserver, de l'exercer et d'y progresser. Le refus de prendre ces mesures peut être constitutif d'une discrimination." },
    { cle: "refusMotives", libelle: "Lorsqu'une mesure n'est pas prise, la charge disproportionnée invoquée est-elle documentée, aides publiques comprises ?", format: "oui / non", regle: "oui",
      motifNC: "Le refus n'est pas documenté : la charge doit être disproportionnée, appréciée en tenant compte des aides qui peuvent compenser tout ou partie des dépenses. Écrivez l'analyse, chiffres à l'appui." },
  ],
  plan: {
    priorite: 2,
    action: "Instituer l'examen des mesures appropriées et documenter chaque décision.",
    etapes: [
      "Recenser les situations connues, en lien avec le médecin du travail et dans le respect du secret médical.",
      "Examiner, pour chacune, les aménagements possibles : poste, horaires, outils, télétravail, accessibilité.",
      "Chiffrer le coût net après aides mobilisables avant d'invoquer une charge disproportionnée.",
      "Conserver la trace écrite de l'examen et de la décision.",
    ],
    acteur: "Ressources humaines, avec le service de prévention et de santé au travail",
    delai: "Examen à instituer sous deux mois",
    risque: "Le refus non justifié de mesures appropriées est traité comme une discrimination, avec nullité de la mesure et réparation intégrale ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "fiche d'examen des mesures appropriées" },
  },
});

item({
  id: "SOC-EGA-REFERENT-HANDICAP", categorie: "égalité et non-discrimination",
  intitule: "Référent handicap chargé d'orienter, d'informer et d'accompagner (entreprise d'au moins deux cent cinquante salariés)",
  articles: ["L5213-6-1"].filter(lu),
  articlesSouhaites: ["L5213-6-1"],
  condition: p => {
    const s = auSeuil(250)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " Le référent handicap est exigé dans les entreprises d'au moins deux cent cinquante salariés — rien n'interdit d'en désigner un en deçà." };
    return { du: true, motif: s.motif + " Un référent chargé d'orienter, d'informer et d'accompagner les personnes en situation de handicap doit être désigné." };
  },
  verifs: [
    { cle: "referentDesigne", libelle: "Un référent handicap est-il désigné ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun référent handicap n'est désigné alors que le seuil est atteint : la désignation est écrite, et le référent est identifiable par les salariés." },
    { cle: "referentConnu", libelle: "Son nom et ses coordonnées sont-ils portés à la connaissance des salariés ?", format: "oui / non", regle: "oui",
      motifNC: "Le référent n'est pas connu des salariés : un référent que personne ne peut nommer ne remplit pas sa fonction. Diffusez son identité et ses coordonnées." },
  ],
  plan: {
    priorite: 3,
    action: "Désigner le référent handicap et le faire connaître.",
    etapes: [
      "Choisir le référent et écrire sa lettre de mission : orienter, informer, accompagner.",
      "Lui donner le temps et la formation nécessaires.",
      "Diffuser son identité et ses coordonnées, et les tenir à jour.",
    ],
    acteur: "Direction et ressources humaines",
    delai: "Sous un mois",
    risque: "L'absence de référent est relevée en contrôle et affaiblit la défense de l'entreprise sur les dossiers d'aménagement de poste ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "lettre de mission du référent handicap" },
  },
});

item({
  id: "SOC-EGA-RECRUTEURS", categorie: "égalité et non-discrimination",
  intitule: "Formation à la non-discrimination à l'embauche des personnes chargées du recrutement (entreprise d'au moins trois cents salariés)",
  articles: ["L1131-2"].filter(lu),
  articlesSouhaites: ["L1131-2"],
  condition: p => {
    const s = auSeuil(300)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " La formation obligatoire des personnes chargées du recrutement vise les entreprises d'au moins trois cents salariés — rien n'interdit de la conduire en deçà." };
    return { du: true, motif: s.motif + " Les salariés chargés des missions de recrutement doivent recevoir une formation à la non-discrimination à l'embauche." };
  },
  verifs: [
    { cle: "recruteursIdentifies", libelle: "Les salariés chargés des missions de recrutement sont-ils identifiés ?", format: "oui / non", regle: "oui",
      motifNC: "Les personnes chargées du recrutement ne sont pas identifiées : la liste est le préalable de la formation. Recensez-les, y compris les managers qui recrutent occasionnellement." },
    { cle: "formationSuivie", libelle: "Ont-ils suivi une formation à la non-discrimination à l'embauche, à une périodicité au moins quinquennale ?", format: "oui / non", regle: "oui",
      motifNC: "La formation n'est pas suivie : elle est due au moins une fois tous les cinq ans, et son attestation se conserve." },
  ],
  plan: {
    priorite: 3,
    action: "Recenser les recruteurs et organiser leur formation à la non-discrimination.",
    etapes: [
      "Établir la liste des personnes qui participent aux décisions de recrutement.",
      "Programmer la formation et conserver les attestations.",
      "Tenir un échéancier des renouvellements.",
    ],
    acteur: "Ressources humaines",
    delai: "Programmation sous trois mois",
    risque: "L'absence de formation est un élément relevé au soutien des demandes fondées sur la discrimination à l'embauche ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "plan de formation à la non-discrimination à l'embauche" },
  },
});

item({
  id: "SOC-EGA-ALERTE", categorie: "égalité et non-discrimination",
  intitule: "Protection du salarié qui signale ou témoigne de faits constitutifs d'un délit ou d'un crime",
  articles: ["L1132-3-3"].filter(lu),
  articlesSouhaites: ["L1132-3-3"],
  condition: toutEmployeur,
  verifs: [
    { cle: "procedureSignalement", libelle: "Une procédure de recueil et de traitement des signalements existe-t-elle, et est-elle portée à la connaissance des salariés ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune procédure de signalement n'est connue des salariés : sans voie identifiée, les signalements arrivent par des canaux qui exposent l'entreprise, et la protection du signalant se plaide contre elle." },
    { cle: "aucuneMesure", libelle: "Est-il assuré qu'aucune mesure défavorable n'est prise à raison d'un signalement ou d'un témoignage ?", format: "oui / non", regle: "oui",
      motifNC: "La règle n'est pas assurée : aucune personne ne peut faire l'objet d'une mesure défavorable pour avoir signalé ou témoigné de faits constitutifs d'un délit ou d'un crime. La mesure prise en méconnaissance de cette règle est nulle." },
  ],
  plan: {
    priorite: 2,
    action: "Ouvrir une voie de signalement, la faire connaître et protéger le signalant.",
    etapes: [
      "Écrire la procédure : qui reçoit, sous quelle forme, avec quelle confidentialité, dans quels délais.",
      "La diffuser par tout moyen, et l'articuler avec le règlement intérieur s'il en existe un.",
      "Instituer un contrôle des décisions prises à l'égard d'un salarié ayant signalé, pendant la période sensible.",
      "Faire vérifier par votre conseil l'articulation avec le dispositif général de protection des lanceurs d'alerte, qui n'est pas lu par cette application.",
    ],
    acteur: "Direction, ressources humaines et conseil de l'entreprise",
    delai: "Sous trois mois",
    risque: "La mesure prise à raison d'un signalement est nulle, avec réintégration possible et réparation intégrale ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "procédure de recueil et de traitement des signalements" },
  },
});

/* ── suite de la catégorie « santé-sécurité » : ce que l'audit voisin
      couvrait et que le chapeau ignorait ─────────────────────────────── */

item({
  id: "SOC-SST-INFO-RISQUES", categorie: "santé-sécurité",
  intitule: "Information des travailleurs sur les risques pour leur santé et leur sécurité",
  articles: ["L4141-1"].filter(lu),
  articlesSouhaites: ["L4141-1"],
  condition: toutEmployeur,
  verifs: [
    { cle: "informationOrganisee", libelle: "Une information sur les risques et les mesures prises pour y remédier est-elle organisée et dispensée à chaque travailleur ?", format: "oui / non", regle: "oui",
      motifNC: "L'information sur les risques n'est pas organisée : l'employeur organise et dispense une information des travailleurs sur les risques pour la santé et la sécurité et sur les mesures prises pour y remédier (L. 4141-1). Elle se distingue de la formation à la sécurité : c'est l'information, en amont." },
    { cle: "informationTracee", libelle: "Cette information est-elle datée et traçable pour chaque salarié (émargement, livret d'accueil remis, support conservé) ?", format: "oui / non", regle: "oui",
      motifNC: "L'information n'est pas traçable : en cas d'accident, l'employeur doit démontrer qu'il l'a délivrée. Faites émarger, conservez les supports." },
  ],
  plan: {
    priorite: 2,
    action: "Organiser et tracer l'information des travailleurs sur les risques.",
    etapes: [
      "Reprendre le document unique et en tirer, par unité de travail, les risques à porter à la connaissance des salariés.",
      "Écrire un support d'information par unité de travail, et le remettre à l'entrée puis à chaque changement.",
      "Faire émarger la remise et conserver les supports datés.",
      "Articuler cette information avec la formation pratique à la sécurité, qui reste due par ailleurs.",
    ],
    acteur: "Direction, encadrement et salarié compétent en prévention",
    delai: "Sous deux mois",
    risque: "Le défaut d'information nourrit la faute inexcusable en cas d'accident et le manquement à l'obligation de sécurité ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "support d'information sur les risques par unité de travail" },
  },
});

item({
  id: "SOC-SST-FORMATION-RENFORCEE", categorie: "santé-sécurité",
  intitule: "Formation renforcée à la sécurité des salariés en contrat court affectés à des postes à risques, et liste de ces postes",
  articles: ["L4154-2"].filter(lu),
  articlesSouhaites: ["L4154-2"],
  condition: p => {
    const s = M.ouiNon(p, "contratsCourts", "L'entreprise recourt-elle à des contrats à durée déterminée, à l'intérim ou à des stagiaires ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun recours aux contrats courts n'est déclaré : la formation renforcée qui leur est propre n'a pas d'objet." };
    return { du: true, motif: "L'entreprise recourt à des contrats courts : ceux qui sont affectés à des postes présentant des risques particuliers bénéficient d'une formation renforcée à la sécurité, et la liste de ces postes doit être établie." };
  },
  verifs: [
    { cle: "listePostes", libelle: "La liste des postes présentant des risques particuliers pour la santé ou la sécurité est-elle établie et tenue à jour ?", format: "oui / non", regle: "oui",
      motifNC: "La liste des postes à risques particuliers n'est pas établie : elle conditionne la formation renforcée, elle s'établit après avis du médecin du travail et du comité, et elle se tient à jour." },
    { cle: "formationDispensee", libelle: "Les salariés en contrat court affectés à ces postes reçoivent-ils une formation renforcée à la sécurité, ainsi qu'un accueil et une information adaptés ?", format: "oui / non", regle: "oui",
      motifNC: "La formation renforcée n'est pas dispensée : c'est précisément sur ces postes et ces contrats que la sinistralité est la plus forte, et l'omission pèse lourd en cas d'accident." },
  ],
  plan: {
    priorite: 1,
    action: "Établir la liste des postes à risques particuliers et dispenser la formation renforcée.",
    etapes: [
      "Établir la liste des postes à risques particuliers, après avis du médecin du travail et du comité social et économique lorsqu'il existe.",
      "Recenser les salariés en contrat court affectés à ces postes.",
      "Organiser la formation renforcée, l'accueil et l'information adaptés, et en conserver la trace.",
      "Transmettre la liste à l'entreprise de travail temporaire lorsque des intérimaires sont concernés.",
    ],
    acteur: "Direction, salarié compétent en prévention et service de prévention et de santé au travail",
    delai: "Liste sous un mois ; formation avant toute nouvelle affectation",
    risque: "En cas d'accident sur un poste à risques sans formation renforcée, la faute inexcusable est fréquemment retenue ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "liste des postes à risques et programme de formation renforcée" },
  },
});

item({
  id: "SOC-SST-SECOURS", categorie: "santé-sécurité",
  intitule: "Matériel de premiers secours, secouristes formés et protocole écrit des soins d'urgence",
  articles: ["R4224-14", "R4224-15", "R4224-16"].filter(lu),
  articlesSouhaites: ["R4224-14", "R4224-15", "R4224-16"],
  condition: toutEmployeur,
  verifs: [
    { cle: "materielPresent", libelle: "Les lieux de travail sont-ils équipés d'un matériel de premiers secours adapté, accessible et signalé ?", format: "oui / non", regle: "oui",
      motifNC: "Le matériel de premiers secours manque, n'est pas adapté ou n'est pas signalé : les lieux de travail en sont équipés, le matériel fait l'objet d'une signalisation par panneaux, et il doit être accessible." },
    { cle: "secouristeForme", libelle: "Au moins un membre du personnel a-t-il reçu la formation de secouriste, dans les ateliers où sont accomplis des travaux dangereux et sur les chantiers concernés ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun secouriste formé n'est déclaré là où il est exigé : un membre du personnel reçoit la formation nécessaire pour donner les premiers secours en cas d'urgence, et ces salariés ne peuvent remplacer les infirmiers." },
    { cle: "protocoleEcrit", libelle: "Les mesures d'organisation des soins d'urgence sont-elles fixées par écrit, prises après avis du médecin du travail, et adaptées à la nature des risques ?", format: "oui / non", regle: "oui",
      motifNC: "Le protocole écrit des soins d'urgence manque : en l'absence d'infirmier, ou lorsque leur nombre ne permet pas d'assurer une présence permanente, l'employeur prend, après avis du médecin du travail, les mesures nécessaires — consignées dans un document tenu à disposition de l'inspection du travail." },
  ],
  plan: {
    priorite: 1,
    action: "Équiper, former et écrire l'organisation des secours.",
    etapes: [
      "Recenser les lieux de travail et vérifier la présence, le contenu, l'accessibilité et la signalisation du matériel de premiers secours.",
      "Programmer la formation de secouristes, en couvrant les horaires et les sites réels.",
      "Écrire le protocole des soins d'urgence après avis du médecin du travail, et le tenir à disposition de l'inspection du travail.",
      "Afficher les coordonnées des services de secours — obligation distincte, également due.",
    ],
    acteur: "Direction, salarié compétent en prévention, service de prévention et de santé au travail",
    delai: "Sous deux mois",
    risque: "L'absence d'organisation écrite des secours est relevée en contrôle et pèse lourdement en cas d'accident ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "protocole d'organisation des secours" },
  },
});

item({
  id: "SOC-SST-INCENDIE-MOYENS", categorie: "santé-sécurité",
  intitule: "Moyens de lutte contre l'incendie : extincteurs, dégagements et vérification",
  articles: ["R4227-29", "R4227-4"].filter(lu),
  articlesSouhaites: ["R4227-29", "R4227-4"],
  condition: toutEmployeur,
  verifs: [
    { cle: "extincteurs", libelle: "Le premier secours contre l'incendie est-il assuré par des extincteurs en nombre suffisant, maintenus en bon état et appropriés aux risques ?", format: "oui / non", regle: "oui",
      motifNC: "Les moyens de premier secours contre l'incendie sont insuffisants ou ne sont pas maintenus : le nombre, l'implantation et la nature des extincteurs se déterminent au regard des risques présents — appareils électriques, liquides inflammables, matières combustibles." },
    { cle: "degagements", libelle: "Les dégagements sont-ils libres de tout obstacle et jamais encombrés ?", format: "oui / non", regle: "oui",
      motifNC: "Des dégagements sont encombrés : les dégagements doivent être toujours libres — aucun matériel ne doit y faire obstacle. C'est le constat le plus immédiat que fait un contrôleur, et le plus dangereux en cas de sinistre." },
    { cle: "verificationPeriodique", libelle: "Les moyens de lutte contre l'incendie sont-ils vérifiés périodiquement et les rapports conservés au registre de sécurité ?", format: "oui / non", regle: "oui",
      motifNC: "Les vérifications ne sont pas faites ou ne sont pas conservées : elles se rangent au registre de sécurité, avec les suites données aux observations." },
  ],
  plan: {
    priorite: 1,
    action: "Mettre à niveau les moyens de lutte contre l'incendie et libérer les dégagements.",
    etapes: [
      "Faire l'inventaire des extincteurs par bâtiment et par risque, et compléter le parc.",
      "Faire une tournée des dégagements et supprimer tout encombrement, puis instituer un contrôle périodique.",
      "Contractualiser la vérification périodique et ranger les rapports au registre de sécurité.",
      "Articuler avec la consigne de sécurité incendie et les exercices, dus par ailleurs.",
    ],
    acteur: "Services généraux et salarié compétent en prévention",
    delai: "Tournée immédiate ; mise à niveau sous deux mois",
    risque: "L'encombrement d'un dégagement et l'insuffisance des moyens sont retenus au premier chef en cas de sinistre ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "inventaire des moyens de secours et tournée des dégagements" },
  },
});

item({
  id: "SOC-SST-ACCIDENT-GRAVE", categorie: "santé-sécurité",
  intitule: "Information de l'inspection du travail en cas d'accident du travail mortel",
  articles: ["R4121-5"].filter(lu),
  articlesSouhaites: ["R4121-5"],
  condition: toutEmployeur,
  verifs: [
    { cle: "procedureConnue", libelle: "La procédure d'information immédiate de l'inspection du travail en cas d'accident mortel est-elle écrite et connue de l'encadrement d'astreinte ?", format: "oui / non", regle: "oui",
      motifNC: "La procédure n'est pas écrite ni connue : l'information de l'agent de contrôle de l'inspection du travail est due immédiatement, et au plus tard dans les douze heures suivant le décès du travailleur — sauf à établir que l'employeur n'a pu en avoir connaissance dans ce délai. Douze heures se comptent aussi la nuit et le week-end : la procédure doit vivre en dehors des heures de bureau." },
    { cle: "coordonneesDisponibles", libelle: "Les coordonnées de l'inspection du travail compétente sont-elles immédiatement disponibles pour ceux qui devraient l'appeler ?", format: "oui / non", regle: "oui",
      motifNC: "Les coordonnées ne sont pas disponibles là où il faudrait : mettez-les dans la procédure d'astreinte, pas seulement sur le panneau d'affichage." },
  ],
  plan: {
    priorite: 1,
    action: "Écrire la procédure d'alerte en cas d'accident mortel et la mettre entre les mains de l'astreinte.",
    etapes: [
      "Écrire la chaîne d'alerte : qui constate, qui prévient, dans quel ordre, avec quels numéros.",
      "Y faire figurer le délai de douze heures et les coordonnées de l'agent de contrôle compétent.",
      "Diffuser la procédure à l'encadrement et à l'astreinte, et la réviser chaque année.",
      "Prévoir la préservation des lieux et la conduite à tenir avec le comité social et économique.",
    ],
    acteur: "Direction et encadrement d'astreinte",
    delai: "Sous quinze jours",
    risque: "Le défaut d'information dans le délai est une infraction distincte, qui s'ajoute aux suites de l'accident lui-même ; l'article de sanction n'a pas été lu au relais pour cet audit — faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "procédure d'alerte en cas d'accident grave ou mortel" },
  },
});

item({
  id: "SOC-SST-SUIVI-CONTRAT", categorie: "santé-sécurité",
  intitule: "Suivi médical au fil du contrat : visite de reprise, visite de mi-carrière, information du médecin, suites données aux avis",
  articles: ["R4624-31", "R4624-29", "R4624-33", "L4624-2-2", "L4624-6"].filter(lu),
  articlesSouhaites: ["R4624-31", "R4624-29", "R4624-33", "L4624-2-2", "L4624-6"],
  condition: toutEmployeur,
  verifs: [
    { cle: "visiteReprise", libelle: "Une visite de reprise est-elle organisée dans les cas où elle est due (congé de maternité, absence pour maladie professionnelle, absence d'au moins trente jours pour accident du travail, maladie ou accident non professionnel) ?", format: "oui / non", regle: "oui",
      motifNC: "La visite de reprise n'est pas organisée : elle incombe à l'employeur, elle se déclenche à la reprise et non à la demande du salarié, et son omission fait obstacle à la reprise effective du travail." },
    { cle: "informationMedecin", libelle: "Le médecin du travail est-il informé de tout arrêt de travail d'une durée inférieure à trente jours pour cause d'accident du travail ?", format: "oui / non", regle: "oui",
      motifNC: "Le médecin du travail n'est pas informé des arrêts courts pour accident du travail : cette information lui permet d'apprécier l'opportunité d'une visite de reprise et d'un aménagement de poste." },
    { cle: "miCarriere", libelle: "La visite de mi-carrière est-elle organisée pour les salariés concernés ?", format: "oui / non", regle: "oui",
      motifNC: "La visite de mi-carrière n'est pas organisée : elle a pour objet d'établir un état des lieux de l'adéquation entre le poste et l'état de santé, d'évaluer les risques de désinsertion professionnelle et de sensibiliser au vieillissement au travail." },
    { cle: "suitesAvis", libelle: "Les avis, propositions et indications du médecin du travail sont-ils pris en considération, et tout refus est-il motivé par écrit au salarié et au médecin ?", format: "oui / non", regle: "oui",
      motifNC: "Les suites données aux avis du médecin du travail ne sont pas formalisées : l'employeur prend en considération l'avis et les indications du médecin ; en cas de refus, il fait connaître par écrit au travailleur et au médecin du travail les motifs qui s'opposent à ce qu'il y soit donné suite. Un refus silencieux est un manquement." },
  ],
  plan: {
    priorite: 1,
    action: "Instituer le suivi médical au fil du contrat, du signalement de l'arrêt à la réponse écrite aux avis.",
    etapes: [
      "Brancher la gestion des absences sur le déclenchement automatique des visites de reprise dues.",
      "Instituer l'information systématique du médecin du travail pour les arrêts courts liés à un accident du travail.",
      "Repérer les salariés concernés par la visite de mi-carrière et les convoquer.",
      "Écrire le circuit des avis du médecin : réception, décision, réponse écrite motivée en cas de refus, archivage.",
    ],
    acteur: "Ressources humaines, avec le service de prévention et de santé au travail",
    delai: "Circuit en place sous deux mois",
    risque: "L'absence de visite de reprise et le silence gardé sur un avis médical sont des manquements à l'obligation de sécurité, régulièrement sanctionnés ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "circuit du suivi médical et réponse aux avis du médecin du travail" },
  },
});

item({
  id: "SOC-SST-FICHE-ENTREPRISE", categorie: "santé-sécurité",
  intitule: "Fiche d'entreprise établie par le service de prévention et de santé au travail, et document annuel qui lui est adressé",
  articles: ["R4624-46", "R4624-47", "D4622-22"].filter(lu),
  articlesSouhaites: ["R4624-46", "R4624-47", "D4622-22"],
  condition: toutEmployeur,
  verifs: [
    { cle: "ficheEtablie", libelle: "La fiche d'entreprise a-t-elle été établie par le service de prévention et de santé au travail, et est-elle à jour ?", format: "oui / non", regle: "oui",
      motifNC: "La fiche d'entreprise n'est pas établie ou n'est pas à jour : elle identifie les risques et les effectifs exposés. Elle est établie par le service auquel vous adhérez — relancez-le par écrit, et conservez la relance." },
    { cle: "fichePresentee", libelle: "La fiche est-elle transmise à l'employeur, tenue à disposition de l'agent de contrôle et présentée au comité social et économique lorsqu'il existe ?", format: "oui / non", regle: "oui",
      motifNC: "La fiche n'est pas diffusée comme elle doit l'être : transmise à l'employeur, tenue à disposition de l'agent de contrôle de l'inspection du travail et du médecin inspecteur, présentée au comité en même temps que le bilan annuel." },
    { cle: "documentAnnuel", libelle: "Le document annuel demandé par le service de prévention et de santé au travail lui est-il adressé ?", format: "oui / non", regle: "oui",
      motifNC: "Le document annuel n'est pas adressé au service : c'est lui qui permet au service de connaître les effectifs, les risques et les postes, et son défaut désorganise le suivi médical de vos salariés." },
  ],
  plan: {
    priorite: 2,
    action: "Obtenir et diffuser la fiche d'entreprise, et adresser le document annuel au service de santé au travail.",
    etapes: [
      "Demander par écrit au service la fiche d'entreprise ou sa mise à jour, et conserver la demande.",
      "À réception, la porter à l'ordre du jour du comité et la ranger avec les documents tenus à disposition de l'inspection.",
      "Instituer l'envoi du document annuel au service, à date fixe.",
      "Rapprocher les risques de la fiche de ceux du document unique : un écart entre les deux se remarque.",
    ],
    acteur: "Direction, avec le service de prévention et de santé au travail",
    delai: "Demande écrite sous quinze jours",
    risque: "L'absence de fiche d'entreprise prive l'employeur d'un élément de preuve de sa démarche de prévention et signale un suivi défaillant ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "demande de fiche d'entreprise et document annuel au service de santé" },
  },
});

item({
  id: "SOC-SST-SALARIE-COMPETENT", categorie: "santé-sécurité",
  intitule: "Salarié compétent désigné pour s'occuper des activités de protection et de prévention des risques",
  articles: ["L4644-1"].filter(lu),
  articlesSouhaites: ["L4644-1"],
  condition: toutEmployeur,
  verifs: [
    { cle: "salarieDesigne", libelle: "Un ou plusieurs salariés compétents sont-ils désignés pour s'occuper des activités de protection et de prévention des risques professionnels ?", format: "oui / non", regle: "oui",
      motifNC: "Aucun salarié compétent n'est désigné : l'employeur désigne un ou plusieurs salariés compétents pour s'occuper des activités de protection et de prévention des risques professionnels de l'entreprise. La désignation est écrite et, lorsqu'un comité existe, elle intervient après avis de celui-ci." },
    { cle: "moyensDonnes", libelle: "Dispose-t-il du temps, de la formation et des moyens nécessaires à sa mission ?", format: "oui / non", regle: "oui",
      motifNC: "Le salarié compétent n'a ni temps ni moyens identifiés : une désignation sans moyens est une désignation de façade, et elle se retourne contre l'employeur." },
  ],
  plan: {
    priorite: 2,
    action: "Désigner le salarié compétent en prévention et lui donner les moyens de sa mission.",
    etapes: [
      "Recueillir l'avis du comité social et économique lorsqu'il existe.",
      "Écrire la désignation et la lettre de mission : périmètre, temps alloué, rattachement, moyens.",
      "Organiser sa formation en prévention des risques.",
      "À défaut de compétences internes, faire appel aux intervenants extérieurs prévus par l'article L. 4644-1, sans que cela dispense de la désignation.",
    ],
    acteur: "Direction, après avis du comité",
    delai: "Sous deux mois",
    risque: "L'absence de désignation est relevée en contrôle et affaiblit la démonstration d'une organisation de la prévention ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "désignation et lettre de mission du salarié compétent" },
  },
});

item({
  id: "SOC-SST-EPI", categorie: "santé-sécurité",
  intitule: "Équipements de protection individuelle : fourniture gratuite, entretien et remplacement",
  articles: ["R4323-95", "R4323-91"].filter(lu),
  articlesSouhaites: ["R4323-95", "R4323-91"],
  condition: toutEmployeur,
  verifs: [
    { cle: "fournitureGratuite", libelle: "Les équipements de protection individuelle et les vêtements de travail sont-ils fournis gratuitement par l'employeur ?", format: "oui / non", regle: "oui",
      motifNC: "Les équipements ne sont pas fournis gratuitement : ils le sont, ainsi que leur entretien et leur remplacement — aucune participation du salarié n'est admise, ni directe ni par retenue." },
    { cle: "entretienRemplacement", libelle: "Leur entretien, leurs réparations et leur remplacement sont-ils assurés en bon état de fonctionnement et d'hygiène ?", format: "oui / non", regle: "oui",
      motifNC: "L'entretien et le remplacement ne sont pas assurés : un équipement usé ne protège plus. Instituez un contrôle périodique et un circuit de remplacement à la demande." },
    { cle: "portEffectif", libelle: "Le port effectif est-il contrôlé et la consigne rappelée par écrit ?", format: "oui / non", regle: "oui",
      motifNC: "Le port effectif n'est pas contrôlé : l'employeur doit non seulement fournir, mais veiller à l'utilisation effective. Écrivez la consigne, contrôlez, et tracez le contrôle." },
  ],
  plan: {
    priorite: 1,
    action: "Assurer la fourniture gratuite, l'entretien et le port effectif des équipements de protection.",
    etapes: [
      "Reprendre le document unique et déterminer, par unité de travail, les équipements nécessaires — après avoir vérifié que la protection collective a bien été privilégiée.",
      "Vérifier qu'aucune participation financière n'est demandée au salarié.",
      "Instituer la dotation contre émargement, l'entretien et le remplacement à la demande.",
      "Écrire la consigne de port et contrôler son application, avec trace du contrôle.",
    ],
    acteur: "Direction, encadrement et salarié compétent en prévention",
    delai: "Sous deux mois",
    risque: "Le défaut de fourniture ou de contrôle du port est retenu au titre de la faute inexcusable en cas d'accident ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "dotation d'équipements de protection et consigne de port" },
  },
});

item({
  id: "SOC-SST-EXTERIEURES", categorie: "santé-sécurité",
  intitule: "Entreprises extérieures : plan de prévention, et protocole de sécurité des opérations de chargement ou de déchargement",
  articles: ["R4512-6", "R4515-4"].filter(lu),
  articlesSouhaites: ["R4512-6", "R4515-4"],
  condition: p => {
    const s = M.ouiNon(p, "entreprisesExterieures", "Des entreprises extérieures interviennent-elles dans vos locaux, ou des opérations de chargement ou de déchargement y sont-elles réalisées par un transporteur ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucune intervention d'entreprise extérieure ni opération de chargement ou de déchargement n'est déclarée : le plan de prévention et le protocole de sécurité n'ont pas d'objet." };
    return { du: true, motif: "Des entreprises extérieures interviennent ou des opérations de chargement et de déchargement sont réalisées : l'inspection commune préalable, le plan de prévention et le protocole de sécurité s'imposent." };
  },
  verifs: [
    { cle: "inspectionCommune", libelle: "Une inspection commune préalable des lieux est-elle organisée avec chaque entreprise extérieure avant le début des travaux ?", format: "oui / non", regle: "oui",
      motifNC: "L'inspection commune préalable n'est pas organisée : c'est elle qui recueille les informations dont le plan de prévention est tiré. Sans elle, le plan n'est qu'un formulaire." },
    { cle: "planPrevention", libelle: "Un plan de prévention écrit est-il arrêté avant le début des travaux, définissant les mesures prises par chaque entreprise ?", format: "oui / non", regle: "oui",
      motifNC: "Le plan de prévention écrit manque : il est arrêté avant le commencement des travaux et définit les mesures prises par chaque entreprise en vue de prévenir les risques liés à l'interférence entre les activités, les installations et les matériels." },
    { cle: "protocoleSecurite", libelle: "Les opérations de chargement ou de déchargement font-elles l'objet d'un protocole de sécurité écrit ?", format: "oui / non", regle: "oui",
      motifNC: "Le protocole de sécurité manque : les opérations de chargement ou de déchargement font l'objet d'un document écrit, échangé entre l'entreprise d'accueil et le transporteur." },
  ],
  plan: {
    priorite: 1,
    action: "Organiser l'inspection commune, écrire le plan de prévention et le protocole de sécurité.",
    etapes: [
      "Recenser les entreprises extérieures intervenantes et les transporteurs habituels.",
      "Organiser l'inspection commune préalable avec chacune, et en dresser le compte rendu.",
      "Arrêter le plan de prévention écrit avant le début des travaux, et le tenir à jour à chaque évolution.",
      "Établir le protocole de sécurité type des opérations de chargement et de déchargement, et l'échanger avec chaque transporteur.",
    ],
    acteur: "Direction, exploitation et salarié compétent en prévention",
    delai: "Avant toute nouvelle intervention",
    risque: "L'absence de plan de prévention ou de protocole est constatée en contrôle et pèse lourd en cas d'accident de coactivité, y compris à l'égard du salarié d'une autre entreprise ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "plan de prévention et protocole de sécurité" },
  },
});

item({
  id: "SOC-SST-NUIT", categorie: "santé-sécurité",
  intitule: "Travail de nuit : recours exceptionnel, justifié, et suivi des travailleurs de nuit",
  articles: ["L3122-1", "L3122-2"].filter(lu),
  articlesSouhaites: ["L3122-1", "L3122-2"],
  condition: p => {
    const s = M.ouiNon(p, "travailNuit", "Des salariés travaillent-ils la nuit ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun travail de nuit n'est déclaré : les obligations propres au travail de nuit n'ont pas d'objet." };
    return { du: true, motif: "Des salariés travaillent la nuit : le recours doit être exceptionnel, justifié, mis en place par accord ou à défaut par autorisation, et les travailleurs de nuit bénéficient d'un suivi et de contreparties." };
  },
  verifs: [
    { cle: "justification", libelle: "Le recours au travail de nuit est-il justifié par la nécessité d'assurer la continuité de l'activité économique ou des services d'utilité sociale, et cette justification est-elle écrite ?", format: "oui / non", regle: "oui",
      motifNC: "La justification n'est pas écrite : le recours au travail de nuit est exceptionnel ; il prend en compte les impératifs de protection de la santé et de la sécurité et est justifié par la nécessité d'assurer la continuité de l'activité économique ou des services d'utilité sociale. Un recours non justifié est contestable dans son principe." },
    { cle: "cadreCollectif", libelle: "Le travail de nuit est-il mis en place par un accord collectif, ou à défaut par autorisation de l'inspection du travail ?", format: "oui / non", regle: "oui",
      motifNC: "Le cadre collectif manque : sans accord ni autorisation, le recours au travail de nuit est irrégulier, et les salariés concernés peuvent en demander la cessation et réparation." },
    { cle: "contrepartiesSuivi", libelle: "Les contreparties et le suivi médical régulier des travailleurs de nuit sont-ils assurés ?", format: "oui / non", regle: "oui",
      motifNC: "Les contreparties et le suivi ne sont pas assurés : le travailleur de nuit bénéficie de contreparties, notamment sous forme de repos compensateur, et d'un suivi individuel régulier de son état de santé. Les modalités relèvent de l'accord et des textes réglementaires — vérifiez-les." },
  ],
  plan: {
    priorite: 1,
    action: "Régulariser le cadre du travail de nuit et assurer contreparties et suivi.",
    etapes: [
      "Écrire la justification du recours, activité par activité.",
      "Vérifier l'existence d'un accord de branche ou d'entreprise ; à défaut, engager la négociation ou solliciter l'autorisation.",
      "Identifier les travailleurs de nuit au sens de la définition légale, et vérifier leurs contreparties.",
      "Organiser le suivi médical régulier avec le service de prévention et de santé au travail.",
    ],
    acteur: "Direction, avec les organisations syndicales et le service de santé au travail",
    delai: "Sous trois mois",
    risque: "Un recours irrégulier au travail de nuit ouvre des dommages-intérêts et peut être interrompu en référé ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "note de justification et suivi du travail de nuit" },
  },
});

item({
  id: "SOC-SST-JEUNES", categorie: "santé-sécurité",
  intitule: "Jeunes travailleurs de moins de dix-huit ans : travaux interdits et procédure de dérogation",
  articles: ["L4153-8", "L4153-9", "R4153-40"].filter(lu),
  articlesSouhaites: ["L4153-8", "L4153-9", "R4153-40"],
  condition: p => {
    const s = M.ouiNon(p, "jeunesTravailleurs", "L'entreprise emploie-t-elle ou accueille-t-elle des travailleurs de moins de dix-huit ans (apprentis, stagiaires, jeunes en contrat) ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun travailleur de moins de dix-huit ans n'est déclaré : les règles propres aux jeunes travailleurs n'ont pas d'objet." };
    return { du: true, motif: "L'entreprise emploie ou accueille des travailleurs de moins de dix-huit ans : l'interdiction des travaux les exposant à des risques pour leur santé ou leur sécurité s'applique, et toute dérogation suit une procédure encadrée." };
  },
  verifs: [
    { cle: "travauxRecenses", libelle: "Les travaux confiés aux jeunes de moins de dix-huit ans ont-ils été confrontés à la liste des travaux interdits ?", format: "oui / non", regle: "oui",
      motifNC: "La confrontation n'a pas été faite : il est interdit d'employer des travailleurs de moins de dix-huit ans à certaines catégories de travaux les exposant à des risques pour leur santé, leur sécurité, leur moralité ou excédant leurs forces. Faites l'inventaire poste par poste." },
    { cle: "derogationRegulieres", libelle: "Lorsque des travaux réglementés sont confiés, la procédure de dérogation est-elle suivie (avis médical, information de l'inspection du travail, encadrement, formation) ?", format: "oui / non", regle: "oui",
      motifNC: "La procédure de dérogation n'est pas suivie : la dérogation ne se présume pas et ne s'obtient pas oralement. Reprenez la procédure réglementaire avant toute affectation." },
  ],
  plan: {
    priorite: 1,
    action: "Recenser les travaux confiés aux jeunes et régulariser les dérogations.",
    etapes: [
      "Recenser les jeunes accueillis et les tâches réellement confiées, tuteurs compris.",
      "Confronter ces tâches aux catégories de travaux interdits et réglementés.",
      "Suspendre immédiatement les affectations irrégulières.",
      "Engager, pour les travaux réglementés qui restent nécessaires, la procédure de dérogation avec l'avis médical et l'information de l'inspection du travail.",
    ],
    acteur: "Direction, tuteurs et service de prévention et de santé au travail",
    delai: "Recensement immédiat",
    risque: "L'accident d'un mineur sur un travail interdit engage la responsabilité de l'employeur au plus haut niveau ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "recensement des travaux confiés aux jeunes travailleurs" },
  },
});

item({
  id: "SOC-SST-LOCAUX", categorie: "santé-sécurité",
  intitule: "Locaux : sanitaires, vestiaires et restauration",
  articles: ["R4228-10", "R4228-19"].filter(lu),
  articlesSouhaites: ["R4228-10", "R4228-19"],
  condition: toutEmployeur,
  verifs: [
    { cle: "sanitaires", libelle: "Les cabinets d'aisances, lavabos et vestiaires sont-ils en nombre suffisant, séparés pour le personnel féminin et masculin, et tenus en état de propreté ?", format: "oui / non", regle: "oui",
      motifNC: "Les installations sanitaires sont insuffisantes ou ne sont pas conformes : le nombre, la séparation et l'entretien sont réglementés, et le constat se fait à l'œil nu lors d'un contrôle." },
    { cle: "restauration", libelle: "L'interdiction de prendre les repas dans les locaux affectés au travail est-elle respectée, et un emplacement ou un local de restauration est-il mis à disposition ?", format: "oui / non", regle: "oui",
      motifNC: "Les salariés prennent leurs repas dans les locaux de travail sans emplacement dédié : la mise à disposition d'un emplacement ou d'un local de restauration est réglementée, et les conditions dépendent du nombre de salariés souhaitant y prendre leur repas — vérifiez le seuil applicable dans le texte." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre les installations sanitaires et de restauration en conformité.",
    etapes: [
      "Faire l'état des lieux des sanitaires, vestiaires et lavabos, site par site.",
      "Vérifier le nombre, la séparation et l'entretien, et programmer les travaux nécessaires.",
      "Déterminer le nombre de salariés souhaitant prendre leur repas sur place et en tirer les conséquences sur le local ou l'emplacement de restauration.",
      "Consulter le comité social et économique sur les aménagements projetés.",
    ],
    acteur: "Services généraux, avec le comité social et économique",
    delai: "État des lieux sous un mois",
    risque: "Les installations sanitaires et de restauration sont un point de contrôle immédiat de l'inspection du travail, susceptible de mise en demeure ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "état des lieux des installations sanitaires et de restauration" },
  },
});

item({
  id: "SOC-SST-ECRAN", categorie: "santé-sécurité",
  intitule: "Travail sur écran de visualisation : information, formation et examen des yeux",
  articles: ["R4542-16"].filter(lu),
  articlesSouhaites: ["R4542-16"],
  condition: p => {
    const s = M.ouiNon(p, "postesEcran", "Des salariés travaillent-ils habituellement sur écran de visualisation ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun poste sur écran n'est déclaré : les obligations propres au travail sur écran n'ont pas d'objet." };
    return { du: true, motif: "Des salariés travaillent habituellement sur écran : l'information, la formation à l'utilisation du poste et l'examen approprié des yeux et de la vue sont dus." };
  },
  verifs: [
    { cle: "formationPoste", libelle: "Les salariés reçoivent-ils une information et une formation sur les modalités d'utilisation de l'écran et de l'équipement, avant leur première affectation et à chaque modification importante du poste ?", format: "oui / non", regle: "oui",
      motifNC: "L'information et la formation à l'utilisation du poste sur écran ne sont pas dispensées : elles sont dues avant la première affectation et lors de toute modification importante du poste." },
    { cle: "examenYeux", libelle: "Un examen approprié des yeux et de la vue est-il proposé aux salariés concernés ?", format: "oui / non", regle: "oui",
      motifNC: "L'examen des yeux et de la vue n'est pas organisé : il se conduit avec le service de prévention et de santé au travail. Sollicitez-le par écrit." },
  ],
  plan: {
    priorite: 3,
    action: "Informer, former et faire examiner les salariés sur écran.",
    etapes: [
      "Recenser les postes sur écran et les salariés qui les occupent habituellement.",
      "Établir un support d'information sur l'aménagement du poste, les pauses et les postures, et le remettre contre émargement.",
      "Solliciter le service de prévention et de santé au travail pour l'examen des yeux et de la vue.",
      "Reprendre le poste après chaque modification importante.",
    ],
    acteur: "Ressources humaines et service de prévention et de santé au travail",
    delai: "Sous trois mois",
    risque: "Les troubles liés au travail sur écran alimentent les demandes au titre du manquement à l'obligation de sécurité ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "information et suivi des postes sur écran" },
  },
});

item({
  id: "SOC-SST-CHIMIQUE", categorie: "santé-sécurité",
  intitule: "Agents chimiques : fiches de données de sécurité et notice de poste",
  articles: ["R4412-38", "R4412-39"].filter(lu),
  articlesSouhaites: ["R4412-38", "R4412-39"],
  condition: p => {
    const s = M.ouiNon(p, "agentsChimiques", "Des agents chimiques dangereux (produits d'entretien industriels, solvants, carburants, peintures, gaz) sont-ils utilisés ou stockés ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucun agent chimique dangereux n'est déclaré : les obligations propres au risque chimique n'ont pas d'objet. Vérifiez tout de même les produits d'entretien : ils en relèvent souvent." };
    return { du: true, motif: "Des agents chimiques dangereux sont utilisés ou stockés : les fiches de données de sécurité et la notice de poste sont dues, et l'évaluation du risque chimique s'impose." };
  },
  verifs: [
    { cle: "fdsRassemblees", libelle: "Les fiches de données de sécurité de tous les produits présents sont-elles rassemblées, à jour et accessibles ?", format: "oui / non", regle: "oui",
      motifNC: "Les fiches de données de sécurité ne sont pas rassemblées ou ne sont pas à jour : elles sont fournies par le fournisseur, elles conditionnent l'évaluation du risque, et leur absence rend cette évaluation impossible à démontrer." },
    { cle: "noticePoste", libelle: "Une notice de poste est-elle établie pour chaque poste exposé, informant des risques et des précautions à prendre ?", format: "oui / non", regle: "oui",
      motifNC: "La notice de poste n'est pas établie : l'employeur établit une notice pour chaque poste ou situation de travail exposant à des agents chimiques dangereux, destinée à informer des risques et des dispositions prises pour les éviter." },
  ],
  plan: {
    priorite: 1,
    action: "Rassembler les fiches de données de sécurité et établir les notices de poste.",
    etapes: [
      "Inventorier tous les produits présents, y compris ceux des services généraux et de l'entretien.",
      "Réclamer aux fournisseurs les fiches de données de sécurité manquantes ou obsolètes.",
      "Établir une notice par poste exposé, après avis du médecin du travail, et la remettre aux salariés.",
      "Reporter les risques chimiques dans le document unique et, le cas échéant, dans l'annexe des facteurs de risques.",
    ],
    acteur: "Salarié compétent en prévention, avec le médecin du travail",
    delai: "Inventaire sous un mois",
    risque: "L'exposition chimique non évaluée est le terrain d'élection de la faute inexcusable et des maladies professionnelles ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "inventaire des produits et notice de poste" },
  },
});

item({
  id: "SOC-SST-DUERP-ANNEXE", categorie: "santé-sécurité",
  intitule: "Annexe du document unique : données collectives d'exposition et proportion de salariés exposés",
  articles: ["R4121-1-1"].filter(lu),
  articlesSouhaites: ["R4121-1-1"],
  condition: toutEmployeur,
  verifs: [
    { cle: "annexeEtablie", libelle: "L'annexe du document unique consignant les données collectives d'exposition aux facteurs de risques professionnels est-elle établie ?", format: "oui / non", regle: "oui",
      motifNC: "L'annexe du document unique n'est pas établie : elle consigne les données collectives utiles à l'évaluation des expositions individuelles aux facteurs de risques professionnels, et elle est distincte du corps du document." },
    { cle: "proportionChiffree", libelle: "La proportion de salariés exposés au-delà des seuils y est-elle chiffrée et actualisée ?", format: "oui / non", regle: "oui",
      motifNC: "La proportion de salariés exposés n'est pas chiffrée : c'est précisément ce que l'annexe doit porter, et c'est ce qui est confronté à vos déclarations sociales." },
  ],
  plan: {
    priorite: 2,
    action: "Établir l'annexe du document unique et y chiffrer les expositions.",
    etapes: [
      "Identifier, par unité de travail, les facteurs de risques professionnels présents.",
      "Mesurer ou estimer les expositions et déterminer la proportion de salariés au-delà des seuils.",
      "Consigner ces données en annexe du document unique, et les actualiser à chaque mise à jour.",
      "Rapprocher l'annexe de vos déclarations sociales : un écart entre les deux se remarque.",
    ],
    acteur: "Salarié compétent en prévention, avec la paie et le service de santé au travail",
    delai: "Sous trois mois",
    risque: "Une annexe absente ou en écart avec les déclarations expose à un redressement au titre de la prévention de l'exposition et fragilise la défense en cas de maladie professionnelle ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "annexe du document unique — données collectives d'exposition" },
  },
});

/* ── suite de « formation et entretiens » ──────────────────────────── */

item({
  id: "SOC-FOR-CONTRIBUTION", categorie: "formation et entretiens",
  intitule: "Contribution au développement de la formation professionnelle et de l'alternance",
  articles: ["L6131-1"].filter(lu),
  articlesSouhaites: ["L6131-1"],
  condition: toutEmployeur,
  verifs: [
    { cle: "contributionVersee", libelle: "Les contributions dues au titre de la formation professionnelle et de l'alternance sont-elles déclarées et versées aux échéances ?", format: "oui / non", regle: "oui",
      motifNC: "Les contributions ne sont pas déclarées ou pas versées : les employeurs concourent au développement de la formation professionnelle et de l'alternance par le financement direct d'actions et par le versement d'une contribution. Le recouvrement est contrôlé, et le retard se majore." },
    { cle: "assietteVerifiee", libelle: "L'assiette et les taux appliqués ont-ils été vérifiés avec votre expert-comptable au regard de l'effectif ?", format: "oui / non", regle: "oui",
      motifNC: "L'assiette et les taux n'ont pas été vérifiés : ils varient selon l'effectif et la nature des contrats. Faites-les revoir — une erreur d'assiette se répète mois après mois." },
  ],
  plan: {
    priorite: 3,
    action: "Vérifier l'assiette, les taux et le versement des contributions formation et alternance.",
    etapes: [
      "Rapprocher l'effectif retenu pour les contributions de l'effectif réel.",
      "Vérifier avec l'expert-comptable les taux appliqués et les éventuelles contributions supplémentaires.",
      "Contrôler les versements des douze derniers mois et régulariser les écarts.",
    ],
    acteur: "Paie et expert-comptable",
    delai: "Sous deux mois",
    risque: "Un défaut ou une insuffisance de versement se redresse avec majorations ; faites chiffrer par votre expert-comptable.",
    modele: { page: "documents.html", nom: "note de contrôle des contributions formation" },
  },
});

item({
  id: "SOC-FOR-ABONDEMENT", categorie: "formation et entretiens",
  intitule: "Abondement correctif du compte personnel de formation (entreprise d'au moins cinquante salariés)",
  articles: ["L6323-13"].filter(lu),
  articlesSouhaites: ["L6323-13"],
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " L'abondement correctif du compte personnel de formation vise les entreprises d'au moins cinquante salariés." };
    return { du: true, motif: s.motif + " Le salarié qui n'a pas bénéficié des entretiens prévus et d'au moins une formation autre que celle conditionnant l'exercice de son activité ouvre droit à un abondement correctif de son compte personnel de formation." };
  },
  verifs: [
    { cle: "etatDesLieuxFait", libelle: "L'état des lieux récapitulatif du parcours professionnel a-t-il été fait pour chaque salarié à l'échéance des six ans ?", format: "oui / non", regle: "oui",
      motifNC: "L'état des lieux récapitulatif n'est pas fait : c'est lui qui déclenche, ou écarte, l'abondement correctif. Sans lui, l'entreprise ne sait pas ce qu'elle doit." },
    { cle: "abondementVerse", libelle: "L'abondement correctif a-t-il été versé pour les salariés qui y ont droit ?", format: "oui / non", regle: "oui",
      motifNC: "L'abondement correctif n'a pas été versé : il est dû lorsque les conditions de l'article L. 6323-13 sont réunies, et son défaut est régularisé auprès de l'organisme, avec les suites financières que cela comporte." },
  ],
  plan: {
    priorite: 2,
    action: "Faire l'état des lieux à six ans et verser l'abondement correctif dû.",
    etapes: [
      "Recenser les salariés atteignant six ans de présence et vérifier la tenue des entretiens.",
      "Vérifier, pour chacun, s'il a suivi au moins une formation autre que celle conditionnant l'exercice de son activité.",
      "Établir l'état des lieux écrit et en remettre une copie au salarié.",
      "Déclarer et verser l'abondement correctif dû, avec l'expert-comptable.",
    ],
    acteur: "Ressources humaines et paie",
    delai: "À chaque échéance de six ans",
    risque: "L'abondement non versé se régularise avec pénalité, et le défaut d'entretien alimente les demandes de dommages-intérêts pour manquement à l'obligation d'employabilité ; faites chiffrer par votre conseil.",
    modele: { page: "documents.html", nom: "état des lieux récapitulatif à six ans" },
  },
});

/* ── suite de « instances » : la section syndicale ─────────────────── */

item({
  id: "SOC-INS-SECTION-SYNDICALE", categorie: "instances",
  intitule: "Moyens de la section syndicale : affichage des communications, diffusion des tracts, local",
  articles: ["L2142-3", "L2142-4", "L2142-8"].filter(lu),
  articlesSouhaites: ["L2142-3", "L2142-4", "L2142-8"],
  condition: p => {
    const s = M.ouiNon(p, "sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucune section syndicale n'est déclarée : les moyens qui lui sont dus n'ont pas d'objet. Ils naîtront le jour où une section sera constituée." };
    return { du: true, motif: "Une section syndicale est constituée : les panneaux d'affichage distincts, la libre diffusion des publications et tracts et, selon l'effectif, la mise à disposition d'un local sont dus." };
  },
  verifs: [
    { cle: "panneaux", libelle: "Des panneaux d'affichage distincts de ceux du comité social et économique sont-ils mis à la disposition de chaque section syndicale ?", format: "oui / non", regle: "oui",
      motifNC: "Les panneaux syndicaux manquent, ou ne sont pas distincts de ceux du comité : l'affichage des communications syndicales s'effectue librement sur des panneaux réservés à cet usage, distincts de ceux affectés aux communications des délégués du personnel et du comité." },
    { cle: "tracts", libelle: "La diffusion des publications et tracts est-elle libre dans les conditions prévues par la loi ?", format: "oui / non", regle: "oui",
      motifNC: "La diffusion des publications et tracts est entravée : elle peut être librement opérée dans l'enceinte de l'entreprise, aux heures d'entrée et de sortie du travail. Une entrave se poursuit comme telle." },
    { cle: "local", libelle: "Le local dû selon l'effectif est-il mis à disposition (local commun à partir de deux cents salariés, local propre à chaque section représentative à partir de mille) ?", format: "oui / non", regle: "oui",
      motifNC: "Le local dû n'est pas mis à disposition : dans les entreprises ou établissements d'au moins deux cents salariés, l'employeur met un local commun à la disposition des sections syndicales ; dans celles d'au moins mille salariés, un local convenable, aménagé et doté du matériel nécessaire, à la disposition de chaque section syndicale d'organisation représentative." },
  ],
  plan: {
    priorite: 2,
    action: "Mettre à disposition les moyens dus à la section syndicale.",
    etapes: [
      "Installer les panneaux d'affichage réservés, distincts de ceux du comité, et en informer les organisations.",
      "Écrire, avec les organisations, les modalités pratiques de diffusion des tracts, dans le respect de la liberté qu'elles tiennent de la loi.",
      "Selon l'effectif, affecter le local dû, l'aménager et le doter du matériel nécessaire.",
      "Formaliser l'accord ou la décision par un écrit remis aux délégués syndicaux.",
    ],
    acteur: "Direction, avec les délégués syndicaux",
    delai: "Sous un mois",
    risque: "Le refus des moyens dus est constitutif d'entrave, poursuivie comme telle ; faites apprécier par votre conseil.",
    modele: { page: "documents.html", nom: "note de mise à disposition des moyens syndicaux" },
  },
});

item({
  id: "SOC-INS-PROTEGES", categorie: "instances",
  intitule: "Salariés protégés : autorisation de l'inspection du travail avant toute rupture",
  articles: ["L2411-3"].filter(lu),
  articlesSouhaites: ["L2411-3"],
  module: { nom: "comité social et économique", page: "audit-cse.html" },
  condition: p => {
    const s = M.ouiNon(p, "sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?");
    if (!s.connu) return { du: null, motif: s.motif };
    if (!s.vrai) return { du: false, motif: "Aucune section syndicale n'est déclarée : la protection propre au délégué syndical n'a pas d'objet ici. Attention : les élus du comité sont protégés indépendamment de ce point — l'audit du comité le traite." };
    return { du: true, motif: "Une section syndicale est constituée : le licenciement d'un délégué syndical ne peut intervenir qu'après autorisation de l'inspecteur du travail. La protection des élus du comité relève, elle, du module dédié." };
  },
  verifs: [
    { cle: "listeTenue", libelle: "La liste à jour des salariés protégés est-elle tenue, avec la date de fin de la période de protection de chacun ?", format: "oui / non", regle: "oui",
      motifNC: "La liste des salariés protégés n'est pas tenue : c'est elle qui évite la rupture irrégulière. Elle inclut les mandats en cours, les anciens mandats encore protégés et les candidats." },
    { cle: "procedureConnue", libelle: "La procédure d'autorisation préalable est-elle connue de ceux qui décident des ruptures ?", format: "oui / non", regle: "oui",
      motifNC: "La procédure d'autorisation n'est pas connue : une rupture prononcée sans autorisation est nulle, et la réintégration peut être demandée avec les salaires de la période d'éviction." },
  ],
  plan: {
    priorite: 1,
    action: "Tenir la liste des salariés protégés et faire connaître la procédure d'autorisation.",
    etapes: [
      "Établir la liste des mandats en cours, des anciens mandats encore protégés et des candidats, avec les dates de fin de protection.",
      "Instituer un contrôle obligatoire de cette liste avant toute rupture, quelle qu'en soit la forme.",
      "Écrire la procédure : consultation du comité lorsqu'elle est requise, demande d'autorisation, délais, décision.",
      "Conduire l'audit détaillé de la protection des élus dans le module « comité social et économique ».",
    ],
    acteur: "Direction et ressources humaines, avec le conseil de l'entreprise",
    delai: "Liste sous quinze jours",
    risque: "Une rupture sans autorisation est nulle : réintégration et salaires de la période d'éviction, outre les suites pénales de l'entrave. Faites chiffrer par votre conseil.",
    modele: { page: "audit-cse.html", nom: "module d'audit du comité (protection des élus)" },
  },
});

/* ── suite de « négociations » ─────────────────────────────────────── */

item({
  id: "SOC-NEG-DECONNEXION", categorie: "négociations",
  intitule: "Droit à la déconnexion : accord, ou à défaut charte élaborée après avis du comité",
  articles: ["L2242-17"].filter(lu),
  articlesSouhaites: ["L2242-17"],
  module: { nom: "négociation obligatoire (NAO)", page: "audit-nao.html" },
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " Le droit à la déconnexion figure parmi les thèmes de la négociation obligatoire, laquelle suppose un effectif d'au moins cinquante salariés et une section syndicale d'organisation représentative." };
    const d = M.ouiNon(p, "sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?");
    if (!d.connu) return { du: null, motif: d.motif };
    if (!d.vrai) return { du: false, motif: "Aucune section syndicale d'organisation représentative n'est déclarée : la négociation obligatoire n'est pas due, et avec elle le thème de la déconnexion. Rien n'interdit d'établir une charte." };
    return { du: true, motif: s.motif + " Une section syndicale est constituée : le droit à la déconnexion entre dans la négociation obligatoire ; à défaut d'accord, l'employeur élabore une charte après avis du comité." };
  },
  verifs: [
    { cle: "accordOuCharte", libelle: "Un accord traite-t-il des modalités du plein exercice du droit à la déconnexion, ou une charte a-t-elle été élaborée après avis du comité ?", format: "oui / non", regle: "oui",
      motifNC: "Ni accord ni charte : le thème doit être traité dans la négociation obligatoire ; à défaut d'accord, l'employeur élabore une charte, après avis du comité social et économique, définissant ces modalités et prévoyant des actions de formation et de sensibilisation." },
    { cle: "actionsSensibilisation", libelle: "Des actions de formation et de sensibilisation à un usage raisonnable des outils numériques sont-elles prévues ?", format: "oui / non", regle: "oui",
      motifNC: "Aucune action de formation ou de sensibilisation n'est prévue : la charte doit en prévoir, à destination des salariés et du personnel d'encadrement et de direction." },
  ],
  plan: {
    priorite: 3,
    action: "Traiter le droit à la déconnexion dans la négociation, ou à défaut par charte.",
    etapes: [
      "Porter le thème à l'ordre du jour de la négociation obligatoire.",
      "À défaut d'accord, préparer une charte : plages de déconnexion, règles d'usage de la messagerie, articulation avec le forfait en jours.",
      "Recueillir l'avis du comité social et économique sur la charte.",
      "Programmer les actions de formation et de sensibilisation, encadrement compris.",
    ],
    acteur: "Direction, avec les délégués syndicaux et le comité",
    delai: "À la prochaine négociation obligatoire",
    risque: "L'absence de traitement du thème s'ajoute au grief de manquement à l'obligation de sécurité en cas de contentieux sur la charge de travail ; faites apprécier par votre conseil.",
    modele: { page: "audit-nao.html", nom: "module d'audit de la négociation obligatoire" },
  },
});

item({
  id: "SOC-NEG-PARTAGE-VALEUR", categorie: "négociations",
  intitule: "Négociation sur les conséquences d'une augmentation exceptionnelle du bénéfice",
  articles: ["L3346-1"].filter(lu),
  articlesSouhaites: ["L3346-1"],
  module: { nom: "négociation obligatoire (NAO)", page: "audit-nao.html" },
  condition: p => {
    const s = auSeuil(50)(p);
    if (s.du === null) return s;
    if (!s.du) return { du: false, motif: s.motif + " L'obligation d'engager une négociation sur les conséquences d'une augmentation exceptionnelle du bénéfice vise les entreprises tenues de mettre en place un régime de participation." };
    const d = M.ouiNon(p, "sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?");
    if (!d.connu) return { du: null, motif: d.motif };
    if (!d.vrai) return { du: false, motif: "Aucune section syndicale d'organisation représentative n'est déclarée : la négociation prévue par l'article L. 3346-1 suppose la présence d'un délégué syndical. Faites vérifier votre situation par votre conseil." };
    return { du: true, motif: s.motif + " L'entreprise est tenue de mettre en place un régime de participation et un délégué syndical est présent : la négociation sur les conséquences d'une augmentation exceptionnelle du bénéfice est due." };
  },
  verifs: [
    { cle: "definitionNegociee", libelle: "La définition de l'augmentation exceptionnelle du bénéfice a-t-elle été négociée, et les conséquences de son constat prévues ?", format: "oui / non", regle: "oui",
      motifNC: "La négociation n'a pas été engagée : l'entreprise tenue de mettre en place un régime de participation doit engager une négociation sur la définition d'une augmentation exceptionnelle de son bénéfice et sur les conséquences à en tirer pour les salariés." },
    { cle: "traceNegociation", libelle: "La négociation est-elle tracée par un accord ou un procès-verbal de désaccord ?", format: "oui / non", regle: "oui",
      motifNC: "La négociation n'est pas tracée : accord ou procès-verbal de désaccord, il faut un écrit — c'est lui qui prouve que l'obligation a été remplie." },
  ],
  plan: {
    priorite: 3,
    action: "Engager la négociation sur les conséquences d'une augmentation exceptionnelle du bénéfice.",
    etapes: [
      "Vérifier avec l'expert-comptable si l'entreprise est tenue de mettre en place un régime de participation.",
      "Convoquer les délégués syndicaux et porter le thème à l'ordre du jour.",
      "Négocier la définition de l'augmentation exceptionnelle et les conséquences pour les salariés.",
      "Conclure par un accord ou, à défaut, par un procès-verbal de désaccord, et le déposer.",
    ],
    acteur: "Direction, avec les délégués syndicaux et l'expert-comptable",
    delai: "À rapprocher du calendrier de la négociation obligatoire",
    risque: "L'omission d'un thème de négociation obligatoire expose aux mêmes suites que l'absence de négociation ; l'audit détaillé se fait dans le module « négociation obligatoire ».",
    modele: { page: "audit-nao.html", nom: "module d'audit de la négociation obligatoire" },
  },
});

/* ══════════════════ la régularisation : obligation → parcours → modèle ══

   Une obligation manquante n'est utile au client que si l'application lui dit
   AUSSI comment la combler. Trois liens, et trois seulement :

   - LE PARCOURS (parcours.html?p=<clé>) : la procédure pas à pas, étape par
     étape, chacune fondée sur un article lu à la source et se terminant par
     une étape de validation. C'est le « comment ».

   - LE DOCUMENT (documents.html?modele=<clé>) : la trame imprimable et
     pré-remplie du courrier, du procès-verbal ou de la délibération que
     l'étape appelle. C'est le « avec quoi ».

   - L'OUTIL DE JURIS EXPERT (docs/juris-expert.js) : là où le document final,
     complet et prêt à imprimer, se fabrique. Le partage entre les deux
     applications de la juriste a été arrêté ainsi — celle-ci diagnostique et
     fonde, Juris Expert produit. Une obligation ne porte ce lien que si Juris
     Expert produit RÉELLEMENT le document correspondant : les élections
     professionnelles, le règlement intérieur, le registre unique du personnel,
     le plan de sauvegarde de l'emploi, les documents de la négociation, ceux
     du comité et la procédure de signalement du harcèlement. Partout ailleurs
     le lien est `null`, et le client reste dans cette application.

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
  embauche: "Embaucher : les formalités obligatoires",
  conges: "Organiser les congés payés",
  findecontrat: "Établir les documents de fin de contrat",
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
  /* durée du travail et repos */
  "SOC-DUR-MAXIMA":              { parcours: null,          document: "note-rh" },
  "SOC-DUR-PAUSE":               { parcours: null,          document: "note-rh" },
  "SOC-DUR-REPOS":               { parcours: null,          document: "note-rh" },
  "SOC-DUR-CONTINGENT":          { parcours: null,          document: "note-rh" },
  "SOC-DUR-FORFAIT":             { parcours: null,          document: "note-rh" },
  "SOC-DUR-TPARTIEL":            { parcours: null,          document: "note-rh" },
  "SOC-DUR-PAIE":                { parcours: null,          document: "note-rh" },
  /* congés et jours */
  "SOC-CON-ACQUISITION":         { parcours: "conges",       document: "note-rh" },
  "SOC-CON-PERIODE":             { parcours: "conges",       document: "note-rh" },
  "SOC-CON-ORDRE":               { parcours: "conges",       document: "note-rh" },
  "SOC-CON-SOLIDARITE":          { parcours: "conges",       document: "note-rh" },
  /* embauche et contrat */
  "SOC-EMB-DPAE":                { parcours: "embauche",     document: "note-rh" },
  "SOC-EMB-INFORMATION":         { parcours: "embauche",     document: "note-rh" },
  "SOC-EMB-ESSAI":               { parcours: "embauche",     document: "note-rh" },
  "SOC-EMB-RECRUTEMENT":         { parcours: "embauche",     document: "note-rh" },
  "SOC-EMB-CDD":                 { parcours: "embauche",     document: "note-rh" },
  /* fin du contrat */
  "SOC-FIN-DOCUMENTS":           { parcours: "findecontrat", document: "note-rh" },
  "SOC-FIN-LICENCIEMENT":        { parcours: "sanction",     document: "convocation-sanction" },
  "SOC-FIN-RUPTURE-CONV":        { parcours: "findecontrat", document: "note-rh" },
  "SOC-FIN-INAPTITUDE":          { parcours: "findecontrat", document: "note-rh" },
  /* égalité et non-discrimination */
  "SOC-EGA-REMUNERATION":        { parcours: "index",        document: "note-rh" },
  "SOC-EGA-DISCRIMINATION":      { parcours: null,           document: "note-rh" },
  "SOC-EGA-SEXISME":             { parcours: "affichages",   document: "signalement-harcelement" },
  "SOC-EGA-HANDICAP":            { parcours: null,           document: "note-rh" },
  "SOC-EGA-REFERENT-HANDICAP":   { parcours: null,           document: "note-rh" },
  "SOC-EGA-RECRUTEURS":          { parcours: null,           document: "note-rh" },
  "SOC-EGA-ALERTE":              { parcours: null,           document: "alerte" },
  /* santé-sécurité (suite) */
  "SOC-SST-INFO-RISQUES":        { parcours: "duerp",        document: "note-rh" },
  "SOC-SST-FORMATION-RENFORCEE": { parcours: "duerp",        document: "note-rh" },
  "SOC-SST-SECOURS":             { parcours: "affichages",   document: "note-rh" },
  "SOC-SST-INCENDIE-MOYENS":     { parcours: "affichages",   document: "note-rh" },
  "SOC-SST-ACCIDENT-GRAVE":      { parcours: null,           document: "note-rh" },
  "SOC-SST-SUIVI-CONTRAT":       { parcours: null,           document: "note-rh" },
  "SOC-SST-FICHE-ENTREPRISE":    { parcours: null,           document: "note-rh" },
  "SOC-SST-SALARIE-COMPETENT":   { parcours: "duerp",        document: "note-rh" },
  "SOC-SST-EPI":                 { parcours: "duerp",        document: "note-rh" },
  "SOC-SST-EXTERIEURES":         { parcours: null,           document: "note-rh" },
  "SOC-SST-NUIT":                { parcours: null,           document: "note-rh" },
  "SOC-SST-JEUNES":              { parcours: null,           document: "note-rh" },
  "SOC-SST-LOCAUX":              { parcours: null,           document: "note-rh" },
  "SOC-SST-ECRAN":               { parcours: null,           document: "note-rh" },
  "SOC-SST-CHIMIQUE":            { parcours: "duerp",        document: "note-rh" },
  "SOC-SST-DUERP-ANNEXE":        { parcours: "duerp",        document: "note-rh" },
  /* formation et entretiens (suite) */
  "SOC-FOR-CONTRIBUTION":        { parcours: null,           document: "note-rh" },
  "SOC-FOR-ABONDEMENT":          { parcours: "entretiens",   document: "note-rh" },
  /* instances (suite) */
  "SOC-INS-SECTION-SYNDICALE":   { parcours: null,           document: "note-rh" },
  "SOC-INS-PROTEGES":            { parcours: null,           document: "note-rh" },
  /* négociations (suite) */
  "SOC-NEG-DECONNEXION":         { parcours: "nao",          document: "note-rh" },
  "SOC-NEG-PARTAGE-VALEUR":      { parcours: "nao",          document: "pv-desaccord" },
};

/* ─── l'outil de Juris Expert qui produit le document final ───────────────

   Une clé de docs/juris-expert.js, ou `null`. `null` n'est pas un oubli :
   c'est la réponse « Juris Expert ne produit pas ce document-là », et alors
   le client reste ici, avec le modèle interne et le parcours.

   La règle de remplissage est étroite, à dessein : on ne renvoie que là où
   Juris Expert imprime RÉELLEMENT la pièce — vérifié dans son code, pas
   supposé d'après un titre de page. Les élections professionnelles relèvent
   entièrement de Juris Expert, par décision de l'utilisatrice ; le règlement
   intérieur, le registre unique du personnel, le plan de sauvegarde de
   l'emploi, les documents de la négociation obligatoire, ceux de la réunion
   du comité et la procédure de signalement du harcèlement y ont chacun leur
   générateur.

   Ce qui n'y est pas ne s'y trouve pas : le document unique, la base de
   données, l'index de l'égalité, l'obligation d'emploi, les affichages, les
   registres de sécurité, les visites médicales, les entretiens de parcours,
   l'épargne salariale. Pour ceux-là, le modèle interne reste le seul. */
const JX = {
  /* instances */
  "SOC-INS-CSE":                 "elections",
  "SOC-INS-CSE-ETAB":            "elections",
  "SOC-INS-CSSCT":               null,
  "SOC-INS-COMMISSIONS":         null,
  "SOC-INS-COMMISSION-ECO":      null,
  "SOC-INS-COMMISSION-MARCHES":  null,
  "SOC-INS-FORMATION-ELUS":      null,
  "SOC-INS-REUNIONS-SST":        "cse-reunion",
  "SOC-INS-GROUPE":              null,
  "SOC-INS-REF-HARCELEMENT":     "harcelement",
  /* documents obligatoires */
  "SOC-DOC-RI":                  "ri",
  "SOC-DOC-DUERP":               null,
  "SOC-DOC-BDESE":               null,
  "SOC-DOC-INDEX":               null,
  "SOC-DOC-OETH":                null,
  /* affichages et informations */
  "SOC-AFF-HARCELEMENT":         "harcelement",
  "SOC-AFF-EGALITE":             null,
  "SOC-AFF-EGA-REMU":            null,
  "SOC-AFF-COORDONNEES":         null,
  "SOC-AFF-CONSIGNE-INCENDIE":   null,
  "SOC-AFF-HORAIRES":            null,
  "SOC-AFF-DECOMPTE":            null,
  "SOC-AFF-CONVENTION":          null,
  "SOC-AFF-FUMER":               null,
  /* registres */
  "SOC-REG-PERSONNEL":           "registre",
  "SOC-REG-SECURITE":            null,
  "SOC-REG-DGI":                 null,
  /* négociations */
  "SOC-NEG-NAO":                 "nego",
  "SOC-NEG-EGALITE":             "nego",
  "SOC-NEG-PSE":                 "pse",
  /* santé-sécurité */
  "SOC-SST-SPST":                null,
  "SOC-SST-VIP":                 null,
  "SOC-SST-POSTES-RISQUES":      null,
  "SOC-SST-FORMATION-SECU":      null,
  /* formation et entretiens */
  "SOC-FOR-ENTRETIENS":          null,
  "SOC-FOR-ADAPTATION":          null,
  /* épargne et protection sociale */
  "SOC-EPA-PARTICIPATION":       null,
  "SOC-EPA-LIVRET":              null,
  "SOC-EPA-SANTE":               null,
  "SOC-EPA-PREVOYANCE-CADRES":   null,
  "SOC-CCN-OBLIGATIONS":         null,
  /* durée du travail et repos */
  "SOC-DUR-MAXIMA":              null,
  "SOC-DUR-PAUSE":               null,
  "SOC-DUR-REPOS":               null,
  "SOC-DUR-CONTINGENT":          null,
  "SOC-DUR-FORFAIT":             null,
  "SOC-DUR-TPARTIEL":            null,
  "SOC-DUR-PAIE":                null,
  /* congés et jours */
  "SOC-CON-ACQUISITION":         null,
  "SOC-CON-PERIODE":             null,
  "SOC-CON-ORDRE":               null,
  "SOC-CON-SOLIDARITE":          null,
  /* embauche et contrat */
  "SOC-EMB-DPAE":                "embauche",
  "SOC-EMB-INFORMATION":         "embauche",
  "SOC-EMB-ESSAI":               "embauche",
  "SOC-EMB-RECRUTEMENT":         "embauche",
  "SOC-EMB-CDD":                 "embauche",
  /* fin du contrat */
  "SOC-FIN-DOCUMENTS":           "discipline",
  "SOC-FIN-LICENCIEMENT":        "discipline",
  "SOC-FIN-RUPTURE-CONV":        "discipline",
  "SOC-FIN-INAPTITUDE":          null,
  /* égalité et non-discrimination */
  "SOC-EGA-REMUNERATION":        null,
  "SOC-EGA-DISCRIMINATION":      null,
  "SOC-EGA-SEXISME":             "harcelement",
  "SOC-EGA-HANDICAP":            null,
  "SOC-EGA-REFERENT-HANDICAP":   null,
  "SOC-EGA-RECRUTEURS":          null,
  "SOC-EGA-ALERTE":              null,
  /* santé-sécurité (suite) */
  "SOC-SST-INFO-RISQUES":        null,
  "SOC-SST-FORMATION-RENFORCEE": null,
  "SOC-SST-SECOURS":             null,
  "SOC-SST-INCENDIE-MOYENS":     null,
  "SOC-SST-ACCIDENT-GRAVE":      null,
  "SOC-SST-SUIVI-CONTRAT":       null,
  "SOC-SST-FICHE-ENTREPRISE":    null,
  "SOC-SST-SALARIE-COMPETENT":   null,
  "SOC-SST-EPI":                 null,
  "SOC-SST-EXTERIEURES":         null,
  "SOC-SST-NUIT":                null,
  "SOC-SST-JEUNES":              null,
  "SOC-SST-LOCAUX":              null,
  "SOC-SST-ECRAN":               null,
  "SOC-SST-CHIMIQUE":            null,
  "SOC-SST-DUERP-ANNEXE":        null,
  /* formation et entretiens (suite) */
  "SOC-FOR-CONTRIBUTION":        null,
  "SOC-FOR-ABONDEMENT":          null,
  /* instances (suite) */
  "SOC-INS-SECTION-SYNDICALE":   null,
  "SOC-INS-PROTEGES":            null,
  /* négociations (suite) */
  "SOC-NEG-DECONNEXION":         "nego",
  "SOC-NEG-PARTAGE-VALEUR":      "nego",
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
  /* Même règle pour l'outil de Juris Expert : déclaré pour chaque item,
     fût-ce à null. La clé elle-même est confrontée à docs/juris-expert.js à
     la publication — ici on ne vérifie que la déclaration. */
  if (!Object.prototype.hasOwnProperty.call(JX, it.id))
    throw new Error(`référentiel social : l'obligation ${it.id} n'a pas d'outil Juris Expert déclaré (fût-ce à null).`);
  it.regularisation = {
    parcours: L.parcours || null,
    parcoursNom: L.parcours ? PARCOURS_NOMS[L.parcours] : null,
    document: L.document || null,
    jx: JX[it.id] || null,
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
  LIAISONS, PARCOURS_NOMS, JX };

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

  /* ──────────────────────────────── durée du travail et repos ───────── */

  "SOC-DUR-MAXIMA": p => ({
    titre: "Tableau de contrôle des durées maximales de travail",
    lignes: [...entete(p, "contrôle des durées maximales (L. 3121-18, L. 3121-20, L. 3121-22)"),
      h("1. Les plafonds contrôlés"),
      puce("Durée quotidienne : dix heures de travail effectif au plus par salarié (L. 3121-18), sauf dérogation prévue par le texte."),
      puce("Durée hebdomadaire absolue : quarante-huit heures au cours d'une même semaine (L. 3121-20)."),
      puce("Durée hebdomadaire moyenne : quarante-quatre heures sur une période quelconque de douze semaines consécutives (L. 3121-22), sauf accord ou autorisation en disposant autrement."),
      h("2. Périmètre du contrôle (exemple)"),
      puce(`Unités contrôlées : ${ex(secteurProfil(p).unites.map(u => u[0]).join(", "))}.`),
      puce(`Source des données : ${ex("badgeage et feuilles de route, extraction mensuelle du logiciel de gestion des temps")}.`),
      puce(`Effectif couvert : ${eff(p)} salariés — dont ${ex("48 conducteurs et 12 personnels de quai en horaires décalés")}.`),
      h("3. Tableau type (une ligne par salarié et par semaine)"),
      par("Colonnes : salarié · semaine (année-numéro) · heures par jour (lundi à dimanche) · maximum quotidien atteint · total hebdomadaire · moyenne glissante sur douze semaines · dépassement constaté (oui/non) · suite donnée · visa du responsable."),
      par(ex("MARTIN Camille — semaine 2026-24 — 9 / 10 / 9,5 / 10 / 8 / 0 / 0 — maximum quotidien 10 h — total 46,5 h — moyenne douze semaines 42,1 h — dépassement : non")),
      par(ex("OKAFOR Ngozi — semaine 2026-24 — 11 / 10 / 10 / 10 / 9 / 4 / 0 — maximum quotidien 11 h — total 54 h — DÉPASSEMENT quotidien et hebdomadaire — suite : réorganisation de la tournée du lundi, entretien avec l'exploitation le " + plusJours(p, 3))),
      h("4. Rythme et traces"),
      puce(`Contrôle mensuel avant paie, le ${ex("cinquième jour ouvré du mois")} ; responsable : ${ex("Dominique BERNARD, responsable d'exploitation")}.`),
      puce("Chaque dépassement est daté, motivé, et sa suite écrite. Le tableau est conservé et tenu à disposition de l'inspection du travail."),
      puce(`Dérogations éventuelles : ${ex("aucune à ce jour")} — une dérogation se lit dans un accord ou une autorisation, elle ne se suppose pas : vérifiez ${ccn(p)}.`),
      ...aPers(["Les unités de travail et la source réelle des relevés",
        "Les lignes du tableau, remplies sur vos données",
        "Le responsable du contrôle et sa date mensuelle",
        "Les dérogations applicables, vérifiées sur l'accord ou l'autorisation"])],
  }),

  "SOC-DUR-PAUSE": p => ({
    titre: "Note de service : organisation de la pause de vingt minutes",
    lignes: [...entete(p, "organisation et traçabilité du temps de pause (L. 3121-16)"),
      h("1. La règle"),
      par(`Dès que le temps de travail quotidien atteint six heures, le salarié bénéficie d'un temps de pause d'une durée minimale de vingt minutes consécutives (L. 3121-16). « Consécutives » se prend au mot : deux interruptions de dix minutes ne valent pas une pause. Des dispositions conventionnelles ou un accord peuvent être plus favorables — reportez-vous à ${ccn(p)}, que cette application ne lit pas.`),
      h("2. Organisation retenue par unité (exemple)"),
      ...secteurProfil(p).unites.slice(0, 3).map(u => puce(`${u[0]} : pause de ${ex("20 minutes")} prise ${ex("entre la quatrième et la sixième heure de service, par roulement")}.`)),
      puce(`Salariés en déplacement : ${ex("pause prise sur l'aire de repos, tracée sur la feuille de route")}.`),
      h("3. Rémunération"),
      par(`Le caractère rémunéré ou non de la pause dépend de la convention collective, des accords applicables et des usages de l'entreprise : ${ex("à compléter selon " + ccn(p))}. Rien n'est affirmé ici — vérifiez le texte conventionnel avant d'écrire la règle.`),
      h("4. Traçabilité"),
      puce(`La pause figure au planning et au relevé de temps : ${ex("colonne « pause » du logiciel de gestion des temps, alimentée par le badgeage")}.`),
      puce(`Contrôle par sondage : ${ex("dix relevés par mois et par unité")} — responsable : ${ex("Dominique BERNARD")}.`),
      puce(`Diffusion de la présente note : affichage et remise individuelle le ${ex(plusJours(p, 7))}.`),
      ...aPers(["Les horaires de pause réellement retenus par unité",
        "Le régime de rémunération, vérifié sur votre convention collective",
        "Le support de traçabilité et le responsable du contrôle"])],
  }),

  "SOC-DUR-REPOS": p => ({
    titre: "Tableau de contrôle des repos quotidien et hebdomadaire",
    lignes: [...entete(p, "contrôle des repos (L. 3131-1, L. 3132-1, L. 3132-2)"),
      h("1. Les règles contrôlées"),
      puce("Repos quotidien : onze heures consécutives au moins entre deux journées de travail (L. 3131-1)."),
      puce("Repos hebdomadaire : il est interdit de faire travailler un même salarié plus de six jours par semaine (L. 3132-1)."),
      puce("Durée du repos hebdomadaire : vingt-quatre heures consécutives au minimum, auxquelles s'ajoutent les heures consécutives de repos quotidien (L. 3132-2). L'addition des deux — trente-cinq heures — n'est pas une citation du texte : c'est un calcul, à refaire selon le repos quotidien effectivement pris."),
      h("2. Situations à risque dans l'activité déclarée (exemple)"),
      puce(`${ex("Fermeture tardive suivie d'une ouverture matinale")} — intervalle réel mesuré : ${ex("9 h 30, insuffisant")}.`),
      puce(`${ex("Astreintes et interventions de nuit")} — l'intervention pendant l'astreinte n'est pas du repos : recalculez l'intervalle.`),
      puce(`${ex("Remplacements de dernière minute le samedi")} — septième jour travaillé : interdit.`),
      h("3. Tableau type"),
      par("Colonnes : salarié · semaine · fin de service J · reprise J+1 · intervalle · jours travaillés dans la semaine · repos hebdomadaire pris (date, durée) · anomalie · suite donnée."),
      par(ex("MARTIN Camille — semaine 2026-24 — fin mardi 21 h 00 / reprise mercredi 5 h 30 — intervalle 8 h 30 — ANOMALIE repos quotidien — suite : décalage de la prise de service au " + plusJours(p, 2) + ", note à l'exploitation")),
      par(ex("OKAFOR Ngozi — semaine 2026-24 — 6 jours travaillés, repos hebdomadaire dimanche 0 h – 24 h, précédé de 11 h de repos quotidien — conforme")),
      h("4. Tenue"),
      puce(`Contrôle hebdomadaire, le ${ex("lundi matin")}, par ${ex("l'exploitation")} ; anomalies remontées à la direction sous 48 heures.`),
      puce("Le tableau est conservé : la preuve du respect des repos incombe à l'employeur."),
      ...aPers(["Les situations à risque propres à votre organisation",
        "Les lignes du tableau, remplies sur vos plannings réels",
        "Le rythme du contrôle et son responsable"])],
  }),

  "SOC-DUR-CONTINGENT": p => ({
    titre: "Tableau du contingent d'heures supplémentaires et de la contrepartie obligatoire en repos",
    lignes: [...entete(p, "suivi du contingent annuel et de la contrepartie obligatoire en repos"),
      h("1. Le contingent applicable"),
      puce(`Accord d'entreprise ou d'établissement fixant le contingent : ${ex("aucun")} — à rechercher en premier (L. 3121-33).`),
      puce(`À défaut, accord de branche : ${ex("à vérifier dans " + ccn(p))} — cette application ne lit pas la convention collective.`),
      puce("À défaut d'accord, le contingent est de deux cent vingt heures par salarié et par an (D. 3121-24)."),
      puce(`Contingent retenu pour le suivi : ${ex("220 heures")} — à confirmer sur le texte applicable.`),
      h("2. Le compteur individuel (exemple)"),
      par("Colonnes : salarié · heures supplémentaires du mois · imputées sur le contingent · cumul annuel · solde de contingent · heures hors contingent · contrepartie obligatoire en repos acquise · repos pris · solde."),
      par(ex("MARTIN Camille — juin : 14 h — cumul 196 h — solde 24 h — hors contingent 0 — contrepartie 0")),
      par(ex("OKAFOR Ngozi — juin : 22 h — cumul 238 h — contingent dépassé de 18 h — contrepartie obligatoire en repos acquise sur ces 18 h — repos à ouvrir avant le " + plusJours(p, 60))),
      h("3. La contrepartie obligatoire en repos"),
      par("À défaut d'accord, la contrepartie obligatoire sous forme de repos due au titre des heures accomplies au-delà du contingent est fixée par l'article L. 3121-38 ; son taux dépend de l'effectif de l'entreprise. Vérifiez le taux applicable au vôtre avant de l'annoncer aux salariés : il n'est pas affirmé ici."),
      puce(`Information des salariés : ${ex("mention au bulletin de paie et note annexée, dès l'ouverture du droit")}.`),
      h("4. Consultation et rattrapage"),
      puce(`Comité social et économique : ${ex("point porté à l'ordre du jour de la réunion du " + plusJours(p, 30))} — lorsqu'un comité existe.`),
      puce(`Reconstitution des compteurs sur la période non prescrite : ${ex("exercices 2024 et 2025, avec l'expert-comptable")} — provision estimée ${ex("11 000 €")}.`),
      ...aPers(["Le contingent réellement applicable, lu dans l'accord ou la convention",
        "Le taux de la contrepartie obligatoire en repos pour votre effectif",
        "Les compteurs individuels, remplis sur vos données de paie",
        "L'étendue du rattrapage, arrêtée avec votre conseil"])],
  }),

  "SOC-DUR-FORFAIT": p => ({
    titre: "Convention individuelle de forfait annuel en jours et document de contrôle",
    lignes: [...entete(p, "sécurisation des forfaits annuels en jours (L. 3121-64, L. 3121-65, L. 3121-60)"),
      h("1. L'accord collectif — le préalable"),
      par("L'accord prévoyant la conclusion de conventions individuelles de forfait en heures ou en jours sur l'année détermine les catégories de salariés susceptibles d'en conclure, la période de référence, le nombre d'heures ou de jours compris dans le forfait, les conditions de prise en compte des absences, des arrivées et des départs, et les caractéristiques principales des conventions (L. 3121-64)."),
      puce(`Accord applicable : ${ex("accord de branche du secteur " + (q(p.secteur) || "d'activité") + " — à vérifier, cette application ne lit pas la convention collective")}.`),
      puce("Si l'accord est muet sur le suivi de la charge, le droit à la déconnexion ou l'entretien, l'article L. 3121-65 impose à l'employeur d'y suppléer lui-même : document de contrôle, contrôle de la charge, entretien annuel."),
      h("2. Trame de convention individuelle (exemple)"),
      par(ex("Entre " + nomE(p) + " et Monsieur Alex DUVAL, responsable d'exploitation, statut cadre. — Article 1 : autonomie dans l'organisation de son emploi du temps, sans que la nature de ses fonctions permette de le soumettre à l'horaire collectif. — Article 2 : forfait de 216 jours travaillés par an, journée de solidarité incluse, sur la période du 1er janvier au 31 décembre. — Article 3 : rémunération annuelle brute de 52 000 €, en contrepartie du forfait. — Article 4 : document de contrôle mensuel, entretien annuel de charge, droit à la déconnexion. Fait à … le " + plusJours(p, 10) + ", en deux exemplaires.")),
      h("3. Document de contrôle mensuel"),
      par("Colonnes : date · journée ou demi-journée travaillée · repos hebdomadaire · congé · jour de repos du forfait · absence · observation du salarié sur sa charge · visa du salarié · visa de l'employeur."),
      par(ex("Juin 2026 — 20 journées travaillées, 2 demi-journées, 8 jours de repos hebdomadaire, 1 jour de repos du forfait. Observation du salarié : « charge tenable, hors semaine 24 ». Visa employeur le " + plusJours(p, 5))),
      h("4. Entretien annuel de charge"),
      puce(`Date programmée : ${ex(plusJours(p, 45))} — porte sur la charge de travail, l'organisation, l'articulation entre l'activité professionnelle et la vie personnelle, et la rémunération.`),
      puce("L'employeur s'assure régulièrement que la charge de travail est raisonnable et permet une bonne répartition dans le temps (L. 3121-60) : l'entretien annuel n'y suffit pas s'il ignore les alertes de l'année."),
      ...aPers(["L'accord collectif réellement applicable et ses stipulations",
        "Les salariés concernés, leur nombre de jours et leur rémunération",
        "Le support du document de contrôle et son circuit de visa",
        "Le calendrier des entretiens et le traitement des alertes"])],
  }),

  "SOC-DUR-TPARTIEL": p => ({
    titre: "Avenant de régularisation d'un contrat à temps partiel et grille de contrôle",
    lignes: [...entete(p, "mise en conformité des contrats à temps partiel"),
      h("1. Les mentions du contrat (L. 3123-6)"),
      puce("Le contrat du salarié à temps partiel est un contrat écrit."),
      puce("Il mentionne la qualification, les éléments de la rémunération, la durée hebdomadaire ou mensuelle prévue et, sauf pour les salariés des associations et entreprises d'aide à domicile et les salariés relevant d'un accord d'aménagement du temps de travail, la répartition de la durée entre les jours de la semaine ou les semaines du mois."),
      puce("Il mentionne les cas dans lesquels une modification éventuelle de cette répartition peut intervenir, ainsi que la nature de cette modification ; les modalités de communication des horaires de travail pour chaque journée travaillée ; les limites dans lesquelles peuvent être accomplies des heures complémentaires."),
      h("2. Grille de contrôle (exemple)"),
      par("Colonnes : salarié · durée contractuelle · répartition écrite (oui/non) · durée minimale respectée · dérogation documentée · heures complémentaires du mois · majoration appliquée · priorité d'accès notifiée."),
      par(ex("MARTIN Camille — 24 h/semaine — répartition écrite : oui — durée minimale : conforme — heures complémentaires juin : 3 h — majorées : oui")),
      par(ex("OKAFOR Ngozi — 18 h/semaine — répartition écrite : NON — dérogation à la durée minimale : demande écrite du salarié absente — heures complémentaires juin : 6 h — majoration : NON. Deux régularisations à conduire.")),
      h("3. Trame d'avenant"),
      par(ex("Avenant au contrat de travail de Madame Ngozi OKAFOR, préparatrice de commandes. — Article 1 : la durée de travail est fixée à 18 heures par semaine, réparties comme suit : lundi 8 h – 12 h, mardi 8 h – 12 h, jeudi 8 h – 13 h, vendredi 8 h – 13 h. — Article 2 : la répartition ne peut être modifiée que dans les cas suivants : remplacement d'un salarié absent, surcroît temporaire d'activité, réorganisation d'un service ; la modification est notifiée sept jours au moins à l'avance. — Article 3 : les heures complémentaires ne peuvent excéder la limite prévue par le texte applicable et donnent lieu à majoration. — Article 4 : la salariée bénéficie d'une priorité pour l'attribution d'un emploi à temps complet ressortissant à sa catégorie professionnelle. Fait le " + plusJours(p, 12) + ".")),
      h("4. Durée minimale et priorité d'accès"),
      puce(`Durée minimale applicable : fixée par convention ou accord de branche étendu (L. 3123-7) ; à défaut d'accord, vingt-quatre heures par semaine (L. 3123-27). Vérifiez ${ccn(p)} avant de conclure.`),
      puce(`Liste des emplois disponibles portée à la connaissance des salariés à temps partiel : ${ex("affichage mensuel et envoi individuel, le premier lundi du mois")}.`),
      ...aPers(["Les contrats réellement concernés et les régularisations à conduire",
        "La durée minimale applicable dans votre branche",
        "Le taux de majoration des heures complémentaires applicable",
        "Les modalités d'information sur les emplois disponibles"])],
  }),

  "SOC-DUR-PAIE": p => ({
    titre: "Calendrier de paie et procédure d'acompte de quinzaine",
    lignes: [...entete(p, "mensualisation de la rémunération et acompte (L. 3242-1)"),
      h("1. La règle"),
      par("La rémunération des salariés est mensuelle et indépendante, pour un horaire de travail effectif déterminé, du nombre de jours travaillés dans le mois. Le paiement de la rémunération est effectué une fois par mois. Un acompte correspondant, pour une quinzaine, à la moitié de la rémunération mensuelle, est versé au salarié qui en fait la demande (L. 3242-1)."),
      h("2. Calendrier de paie (exemple)"),
      puce(`Date de virement : ${ex("le dernier jour ouvré du mois")} — annoncée aux salariés et tenue.`),
      puce(`Clôture des éléments variables : ${ex("le 20 du mois")} ; contrôle des durées et des heures supplémentaires : ${ex("le 21")}.`),
      puce(`Édition et remise des bulletins : ${ex("dématérialisée, coffre-fort numérique, le jour du virement")}.`),
      h("3. Procédure d'acompte"),
      puce(`Demande : ${ex("formulaire interne ou courriel au service paie, avant le 10 du mois")} — aucune motivation n'est exigée du salarié.`),
      puce(`Montant : la moitié de la rémunération mensuelle pour une quinzaine — exemple : ${ex("salaire mensuel brut 2 100 €, acompte 1 050 € brut")}.`),
      puce(`Versement : ${ex("le 15 du mois, par virement")} ; l'acompte figure au bulletin du mois et est déduit du solde.`),
      puce(`Responsable : ${ex("Dominique BERNARD, gestionnaire de paie")} ; délai de réponse : ${ex("deux jours ouvrés")}.`),
      h("4. Diffusion"),
      puce(`La procédure est portée à la connaissance de tous les salariés : ${ex("livret d'accueil, intranet et affichage, mise à jour le " + plusJours(p, 7))}.`),
      ...aPers(["Votre date de virement et le calendrier de clôture",
        "Le circuit et le délai de traitement des demandes d'acompte",
        "Le responsable désigné et le support de diffusion"])],
  }),

  /* ────────────────────────────────────────── congés et jours ───────── */

  "SOC-CON-ACQUISITION": p => ({
    titre: "État individuel des congés payés et points à faire vérifier",
    lignes: [...entete(p, "acquisition et suivi des congés payés (L. 3141-3)"),
      h("1. La règle d'acquisition"),
      par(`Le salarié a droit à un congé de deux jours et demi ouvrables par mois de travail effectif chez le même employeur ; la durée totale du congé exigible ne peut excéder trente jours ouvrables (L. 3141-3). ${ccn(p)} peut être plus favorable : vérifiez-le, cette application ne lit que le code du travail.`),
      h("2. État individuel (exemple)"),
      par("Colonnes : salarié · période de référence · jours acquis · jours pris · solde · jours reportés · observations."),
      par(ex("MARTIN Camille — période du 1er juin 2025 au 31 mai 2026 — acquis 30 jours ouvrables — pris 22 — solde 8 — à solder avant le " + plusJours(p, 120))),
      par(ex("OKAFOR Ngozi — entrée le " + plusJours(p, -400) + " — acquis 27,5 jours — pris 10 — solde 17,5 — arrêt de travail du 3 au 28 mars : traitement à faire vérifier")),
      h("3. Le point à faire vérifier — et qui n'est pas tranché ici"),
      par("Le traitement des périodes d'arrêt de travail au regard de l'acquisition des congés, et l'information due au salarié à sa reprise, ont évolué et emportent des conséquences financières importantes. Cette application ne tranche pas : faites vérifier par votre conseil, sur les textes en vigueur à la date de votre audit, la période à reprendre et le mode de calcul."),
      h("4. Tenue et information"),
      puce(`Compteur porté au bulletin de paie : ${ex("oui, acquis / pris / solde, à jour au mois précédent")}.`),
      puce(`Information annuelle des salariés sur leur solde et la date limite de prise : ${ex("courriel individuel le " + plusJours(p, 30))}.`),
      puce(`Responsable du compteur : ${ex("Dominique BERNARD, gestionnaire de paie")}.`),
      ...aPers(["Les périodes de référence et les compteurs réels",
        "Le traitement des arrêts de travail, arrêté avec votre conseil",
        "Les règles conventionnelles plus favorables, vérifiées sur le texte"])],
  }),

  "SOC-CON-PERIODE": p => ({
    titre: "Note d'information : période de prise des congés payés",
    lignes: [...entete(p, "fixation et annonce de la période de prise (L. 3141-13, D. 3141-5)"),
      h("1. La règle"),
      par("Les congés sont pris dans une période qui comprend dans tous les cas la période du 1er mai au 31 octobre de chaque année (L. 3141-13). La période de prise est portée par l'employeur à la connaissance des salariés au moins deux mois avant l'ouverture de cette période (D. 3141-5)."),
      h("2. Décision (exemple)"),
      puce(`Période de prise retenue : ${ex("du 1er mai 2026 au 30 avril 2027")} — elle comprend bien la période du 1er mai au 31 octobre.`),
      puce(`Fondement de la décision : ${ex("aucun accord d'entreprise ni de branche ne fixe la période ; décision de l'employeur après avis du comité social et économique du " + plusJours(p, -30))}.`),
      puce(`Contraintes d'activité prises en compte : ${ex("pic saisonnier de juillet et août sur l'exploitation, fermeture technique de l'atelier la première semaine d'août")}.`),
      h("3. Texte de la note"),
      par(ex("« " + nomE(p) + " informe l'ensemble du personnel que la période de prise des congés payés est fixée du 1er mai 2026 au 30 avril 2027. Les demandes de congé sont déposées auprès du responsable hiérarchique, au plus tard le 15 mars 2026 pour les congés d'été. L'ordre des départs sera communiqué à chacun un mois au moins avant son départ. Fait le " + plusJours(p, 5) + ". »")),
      h("4. Diffusion et preuve"),
      puce(`Affichage sur les panneaux du personnel, le ${ex(plusJours(p, 5))} — photographie de l'affichage conservée.`),
      puce(`Envoi individuel : ${ex("courriel professionnel et remise en main propre pour les salariés sans accès numérique, émargement conservé")}.`),
      puce(`Contrôle du délai : la diffusion intervient au moins deux mois avant l'ouverture — ici ${ex("le 5 février au plus tard pour une période ouvrant le 1er mai")}.`),
      ...aPers(["La période réellement retenue et son fondement (accord ou décision après avis)",
        "La date d'avis du comité social et économique",
        "Les dates de dépôt des demandes et les contraintes d'activité",
        "Le support de diffusion et la preuve conservée"])],
  }),

  "SOC-CON-ORDRE": p => ({
    titre: "Tableau de l'ordre des départs en congé et note de communication",
    lignes: [...entete(p, "ordre des départs : critères, communication, modification (L. 3141-15, L. 3141-16, D. 3141-6)"),
      h("1. Les critères"),
      par("À défaut de stipulation dans la convention ou l'accord, l'employeur définit l'ordre des départs après avis du comité social et économique, en tenant compte de la situation de famille des bénéficiaires — notamment des possibilités de congé du conjoint ou du partenaire, et de la présence au foyer d'un enfant ou d'un adulte handicapé ou d'une personne âgée en perte d'autonomie —, de la durée de leurs services chez l'employeur, et de leur activité éventuelle chez un ou plusieurs autres employeurs (L. 3141-16)."),
      puce(`Critères retenus et leur ordre : ${ex("1. contraintes de service — 2. situation de famille — 3. ancienneté — 4. rotation par rapport à l'année précédente")}.`),
      h("2. Tableau des départs (exemple)"),
      par("Colonnes : service · salarié · dates demandées · dates retenues · critère décisif · date de communication · observations."),
      par(ex("Exploitation — MARTIN Camille — 13/07 au 02/08 — retenu — situation de famille (enfant scolarisé) — communiqué le " + plusJours(p, 20))),
      par(ex("Exploitation — OKAFOR Ngozi — 13/07 au 02/08 — reporté au 03/08 au 23/08 — contrainte de service (deux départs simultanés impossibles), rotation : la salariée était prioritaire l'an dernier — communiqué le " + plusJours(p, 20))),
      h("3. Communication"),
      puce("L'ordre des départs est communiqué, par tout moyen, à chaque salarié un mois au moins avant son départ (D. 3141-6)."),
      puce(`Mode retenu : ${ex("courriel individuel et affichage du tableau par service")} — preuve de la communication conservée.`),
      h("4. Modification"),
      par("Sauf circonstances exceptionnelles, l'ordre et les dates de départ ne peuvent être modifiés dans le délai d'un mois avant la date prévue (L. 3141-16)."),
      puce(`Procédure interne : ${ex("toute demande de modification à moins d'un mois est soumise à la direction, qui écrit la circonstance exceptionnelle invoquée et en informe le salarié par écrit")}.`),
      ...aPers(["Les critères retenus et l'avis du comité qui les précède",
        "Le tableau réel des départs, par service",
        "Le mode de communication et la preuve conservée",
        "La procédure interne de modification exceptionnelle"])],
  }),

  "SOC-CON-SOLIDARITE": p => ({
    titre: "Décision et note d'information : journée de solidarité",
    lignes: [...entete(p, "modalités de la journée de solidarité (L. 3133-7, L. 3133-8)"),
      h("1. La règle"),
      par("La journée de solidarité, instituée en vue d'assurer le financement d'actions en faveur de l'autonomie des personnes âgées ou handicapées, prend la forme d'une journée supplémentaire de travail non rémunérée pour les salariés et d'une contribution pour les employeurs (L. 3133-7). Le travail accompli, dans la limite de sept heures, durant cette journée ne donne pas lieu à rémunération ; pour les salariés à temps partiel, cette limite est réduite proportionnellement à la durée contractuelle (L. 3133-8)."),
      h("2. Modalités retenues (exemple)"),
      puce(`Fondement : ${ex("aucun accord d'entreprise ni de branche ne fixe les modalités ; décision de l'employeur après consultation du comité social et économique du " + plusJours(p, -20))}.`),
      puce(`Modalité retenue : ${ex("travail d'un jour de réduction du temps de travail, fixé au lundi de Pentecôte")}.`),
      puce(`Salariés à temps partiel : ${ex("limite proratisée — pour un contrat de 24 h par semaine, 4 h 48 au lieu de 7 h")}.`),
      puce(`Forfaits en jours : ${ex("la journée de solidarité est incluse dans le nombre de jours du forfait")}.`),
      h("3. Texte de la note"),
      par(ex("« " + nomE(p) + " informe le personnel que la journée de solidarité pour l'année 2026 sera accomplie le lundi 25 mai. Les salariés à temps partiel accompliront une durée proportionnelle à leur durée contractuelle. Ce travail ne donne pas lieu à rémunération dans la limite légale. Fait le " + plusJours(p, 6) + ". »")),
      h("4. Paie et traçabilité"),
      puce(`Paramétrage en paie : ${ex("code absence dédié, contrôle du prorata des temps partiels avant la paie du mois concerné")}.`),
      puce(`Conservation : décision, avis du comité, note diffusée et preuve de diffusion, dans le dossier « durée du travail ».`),
      ...aPers(["La modalité réellement retenue et son fondement",
        "La date d'avis ou de consultation du comité",
        "Le prorata appliqué aux temps partiels et le paramétrage en paie"])],
  }),

  /* ─────────────────────────────────────── embauche et contrat ──────── */

  "SOC-EMB-DPAE": p => ({
    titre: "Procédure d'embauche et liste de contrôle avant l'entrée du salarié",
    lignes: [...entete(p, "déclaration préalable à l'embauche et formalités d'entrée (L. 1221-10, L. 1221-11)"),
      h("1. La règle"),
      par("L'embauche d'un salarié ne peut intervenir qu'après déclaration nominative accomplie par l'employeur auprès des organismes de protection sociale désignés à cet effet (L. 1221-10). Le non-respect de cette obligation entraîne les conséquences prévues par l'article L. 1221-11."),
      h("2. Liste de contrôle avant l'entrée (exemple)"),
      puce(`Déclaration préalable adressée et accusé reçu : ${ex("le " + plusJours(p, -2) + ", accusé n° 2026-XXXX archivé")}.`),
      puce(`Contrat de travail signé ou, à défaut, remis dans le délai applicable au type de contrat.`),
      puce(`Document d'information sur la relation de travail remis contre récépissé.`),
      puce(`Inscription au registre unique du personnel, au moment de l'embauche et de façon indélébile.`),
      puce(`Adhésion au service de prévention et de santé au travail et demande de visite d'information et de prévention : ${ex("demande adressée le jour de l'entrée")}.`),
      puce(`Formation à la sécurité au poste, information sur les risques, remise des équipements de protection : ${ex("le premier jour, émargement conservé")}.`),
      puce(`Livret d'épargne salariale si un dispositif existe ; information sur la complémentaire santé et la prévoyance.`),
      h("3. Rapprochement de contrôle"),
      par(`Tous les ${ex("trimestres")}, le registre unique du personnel est rapproché des accusés de déclaration : une ligne du registre sans accusé correspondant est une alerte à traiter immédiatement avec votre conseil.`),
      par(ex("Rapprochement du " + plusJours(p, -10) + " : " + eff(p) + " lignes de registre, " + eff(p) + " accusés retrouvés — aucun écart.")),
      h("4. Responsabilités"),
      puce(`Responsable des déclarations : ${ex("Dominique BERNARD, gestionnaire de paie")} ; suppléant : ${ex("Camille MARTIN")}.`),
      puce("Règle interne : pas de déclaration, pas d'entrée. Aucune exception, y compris pour un remplacement urgent."),
      ...aPers(["Les étapes réellement applicables à votre organisation",
        "Le rythme du rapprochement registre / accusés",
        "Les personnes responsables et leur suppléance"])],
  }),

  "SOC-EMB-INFORMATION": p => ({
    titre: "Document d'information sur la relation de travail",
    lignes: [...entete(p, "informations principales relatives à la relation de travail (L. 1221-5-1, R. 1221-34, R. 1221-35)"),
      h("1. La règle"),
      par("L'employeur remet au salarié un ou plusieurs documents écrits contenant les informations principales relatives à la relation de travail (L. 1221-5-1). L'article R. 1221-34 en fixe le contenu et l'article R. 1221-35 les délais de communication selon les rubriques. Un contrat de travail complet peut valoir document d'information — à condition qu'il porte réellement toutes les rubriques."),
      h("2. Les rubriques, et leur couverture par votre contrat type (exemple)"),
      puce(`Identité des parties : ${ex("couverte par le contrat type")}.`),
      puce(`Lieu de travail et, à défaut de lieu fixe, principe d'affectation en divers lieux : ${ex("couverte")}.`),
      puce(`Intitulé du poste, fonctions, catégorie d'emploi : ${ex("couverte")}.`),
      puce(`Date d'embauche ; pour un contrat à durée déterminée, date de fin ou durée prévue : ${ex("couverte")}.`),
      puce(`Durée du travail et modalités relatives aux heures supplémentaires : ${ex("PARTIELLE — la mention des heures supplémentaires manque au contrat type")}.`),
      puce(`Éléments constitutifs de la rémunération, périodicité et mode de versement : ${ex("couverte")}.`),
      puce(`Congés payés et autres congés ; durée de la période d'essai : ${ex("couverte")}.`),
      puce(`Procédure à observer en cas de cessation de la relation de travail : ${ex("MANQUANTE")}.`),
      puce(`Droit à la formation assuré par l'employeur : ${ex("MANQUANTE")}.`),
      puce(`Conventions et accords collectifs applicables : ${ex("couverte — " + ccn(p))}.`),
      puce(`Organismes de protection sociale et protections en matière de sécurité sociale : ${ex("MANQUANTE")}.`),
      h("3. Modèle de complément à remettre"),
      par(ex("« Complément d'information à la relation de travail — " + nomE(p) + " — Madame Ngozi OKAFOR. En complément de votre contrat du " + plusJours(p, -60) + " : les heures supplémentaires sont accomplies à la demande écrite de la hiérarchie et rémunérées selon les taux légaux et conventionnels ; la cessation de la relation de travail obéit aux règles de préavis et de procédure du code du travail et de la convention collective applicable ; vous bénéficiez du plan de développement des compétences de l'entreprise ; l'entreprise cotise auprès des organismes de retraite et de prévoyance mentionnés en annexe. Remis le " + plusJours(p, 3) + ", contre récépissé. »")),
      h("4. Remise et preuve"),
      puce(`Remise contre récépissé signé, ou envoi horodaté : ${ex("récépissé archivé au dossier individuel")}.`),
      puce(`Salariés déjà en poste : le document est remis à ceux qui en font la demande — ${ex("procédure de demande annoncée par note du " + plusJours(p, 7))}.`),
      ...aPers(["La couverture réelle de chaque rubrique par votre contrat type",
        "Le texte du complément, adapté à votre organisation",
        "Le circuit de remise et la conservation des récépissés"])],
  }),

  "SOC-EMB-ESSAI": p => ({
    titre: "Clause de période d'essai et lettre de rupture d'essai",
    lignes: [...entete(p, "période d'essai : durée, renouvellement, prévenance (L. 1221-19, L. 1221-21, L. 1221-25, L. 1221-26)"),
      h("1. Les règles"),
      puce("Le contrat à durée indéterminée peut comporter une période d'essai dont la durée maximale varie selon la catégorie professionnelle du salarié (L. 1221-19)."),
      puce("La période d'essai peut être renouvelée une fois si un accord de branche étendu le prévoit ; cet accord fixe les conditions et les durées de renouvellement (L. 1221-21). Le renouvellement suppose en outre une stipulation au contrat et l'accord exprès du salarié, recueilli pendant l'essai."),
      puce("Lorsque l'employeur met fin à l'essai, un délai de prévenance est dû, dont la durée croît avec la présence du salarié (L. 1221-25) ; lorsque le salarié y met fin, un délai plus court s'impose à lui (L. 1221-26)."),
      h("2. Clause type (exemple)"),
      par(ex("« Le présent contrat est conclu sous réserve d'une période d'essai de quatre mois, à compter du " + plusJours(p, 10) + ". Cette période pourra être renouvelée une fois, pour une durée de quatre mois au plus, dans les conditions prévues par la convention collective applicable et sous réserve de l'accord exprès et écrit du salarié recueilli avant le terme de la période initiale. Chacune des parties pourra mettre fin à l'essai dans le respect du délai de prévenance légal. »")),
      h("3. Lettre de rupture d'essai (exemple)"),
      par(ex("« Madame, Nous vous informons qu'il est mis fin à votre période d'essai, débutée le " + plusJours(p, -70) + ". Compte tenu de votre présence dans l'entreprise, un délai de prévenance de deux semaines s'applique : votre contrat prendra donc fin le " + plusJours(p, 14) + ". Votre certificat de travail, votre reçu pour solde de tout compte et votre attestation destinée à l'assurance chômage vous seront remis à cette date. Fait le " + plusJours(p, 0) + ". »")),
      h("4. Contrôle des essais en cours"),
      par("Colonnes : salarié · catégorie · début d'essai · durée initiale · terme · renouvellement (fondement, accord écrit) · délai de prévenance applicable."),
      par(ex("MARTIN Camille — cadre — début " + plusJours(p, -100) + " — 4 mois — terme " + plusJours(p, 20) + " — renouvellement envisagé : accord de branche à vérifier")),
      ...aPers(["Les durées d'essai par catégorie, confrontées aux maxima légaux",
        "Les conditions de renouvellement, lues dans l'accord de branche étendu",
        "Les délais de prévenance appliqués selon la présence du salarié",
        "La liste des essais en cours et leurs termes"])],
  }),

  "SOC-EMB-RECRUTEMENT": p => ({
    titre: "Note d'information : méthodes de recrutement et dispositifs de collecte",
    lignes: [...entete(p, "information des candidats et des salariés (L. 1221-8, L. 1221-9, L. 1222-4)"),
      h("1. Les règles"),
      puce("Le candidat à un emploi est expressément informé, préalablement à leur mise en œuvre, des méthodes et techniques d'aide au recrutement utilisées à son égard (L. 1221-8). Les informations demandées ne peuvent avoir comme finalité que d'apprécier sa capacité à occuper l'emploi proposé ou ses aptitudes professionnelles, et elles doivent présenter un lien direct et nécessaire avec l'emploi."),
      puce("Aucune information concernant personnellement un candidat ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance (L. 1221-9)."),
      puce("Aucune information concernant personnellement un salarié ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance (L. 1222-4)."),
      h("2. Méthodes employées, à annoncer (exemple)"),
      puce(`${ex("Entretien structuré avec grille d'évaluation commune")} — annoncé dans la convocation.`),
      puce(`${ex("Mise en situation professionnelle d'une heure sur le poste de préparation de commandes")} — annoncée dans l'annonce et la convocation.`),
      puce(`${ex("Vérification des références professionnelles, avec l'accord du candidat")} — annoncée et recueillie par écrit.`),
      h("3. Dispositifs de collecte en place, à annoncer aux salariés (exemple)"),
      puce(`${ex("Badgeage d'entrée et de sortie")} — information par note de service et mention au règlement intérieur lorsqu'il en existe un.`),
      puce(`${ex("Géolocalisation des véhicules de service, active pendant le temps de service uniquement")} — information individuelle écrite, avis du comité social et économique du ${ex(plusJours(p, -40))}.`),
      puce(`${ex("Vidéosurveillance des quais, sans visualisation des postes de travail")} — panneaux d'information et note aux salariés.`),
      h("4. Texte de la note aux salariés"),
      par(ex("« " + nomE(p) + " informe les salariés des dispositifs de collecte d'informations les concernant : badgeage, géolocalisation des véhicules pendant le temps de service, vidéosurveillance des zones de quai. Chacun de ces dispositifs poursuit une finalité déterminée, exposée en annexe, et ses données sont conservées pour une durée limitée. Aucune information recueillie par un dispositif non porté à votre connaissance ne pourra vous être opposée. Fait le " + plusJours(p, 5) + ". »")),
      par("Le sujet croise la réglementation sur les données personnelles, qui n'est pas du code du travail et n'est donc pas vérifiée par cette application : faites-la traiter par ailleurs."),
      ...aPers(["Les méthodes de recrutement réellement employées",
        "L'inventaire des dispositifs de collecte et leurs finalités",
        "Les dates d'avis du comité social et économique",
        "Le traitement des données personnelles, à conduire hors de cette application"])],
  }),

  "SOC-EMB-CDD": p => ({
    titre: "Grille de contrôle des contrats à durée déterminée",
    lignes: [...entete(p, "conformité du recours aux contrats à durée déterminée"),
      h("1. Les règles contrôlées"),
      puce("Le contrat est établi par écrit et comporte la définition précise de son motif ; à défaut, il est réputé conclu à durée indéterminée (L. 1242-12)."),
      puce("Le recours n'est ouvert que dans les cas énumérés par l'article L. 1242-2, et le contrat ne peut avoir ni pour objet ni pour effet de pourvoir durablement un emploi lié à l'activité normale et permanente de l'entreprise."),
      puce("Le contrat est transmis au salarié au plus tard dans les deux jours ouvrables suivant l'embauche (L. 1242-13)."),
      puce("À l'expiration d'un contrat, il ne peut être recouru, pour pourvoir le poste, à un nouveau contrat à durée déterminée avant l'expiration d'un délai de carence (L. 1244-3) ; à défaut d'accord, ce délai est calculé selon l'article L. 1244-3-1."),
      puce("Une indemnité de fin de contrat est due lorsque la relation ne se poursuit pas par un contrat à durée indéterminée (L. 1243-8), sauf les cas d'exclusion prévus par la loi."),
      h("2. Grille (exemple)"),
      par("Colonnes : salarié · poste · motif écrit · cas de recours · date d'embauche · date de transmission · contrat précédent sur le poste · délai de carence appliqué · indemnité de fin de contrat versée."),
      par(ex("OKAFOR Ngozi — préparatrice de commandes — motif : remplacement de M. DURAND, absent pour maladie — cas de recours : remplacement — embauche le " + plusJours(p, -60) + " — transmission le " + plusJours(p, -59) + " — conforme")),
      par(ex("LEROY Sacha — préparateur de commandes — motif : « surcroît d'activité » sans autre précision — TROISIÈME contrat consécutif sur le même poste en dix mois — carence non appliquée — deux griefs : motif imprécis et recours pour pourvoir durablement un emploi permanent")),
      h("3. Suites"),
      puce(`Contrats à régulariser immédiatement : ${ex("2")} ; dossiers à faire chiffrer par le conseil : ${ex("1")}.`),
      puce(`Contrôle institué avant chaque signature : ${ex("visa du responsable des ressources humaines sur la grille, obligatoire")}.`),
      puce(`Vérification en paie de l'indemnité de fin de contrat sur ${ex("les vingt-quatre derniers mois")}.`),
      ...aPers(["La liste réelle des contrats et leurs motifs",
        "Les successions de contrats sur un même poste",
        "Les cas d'exclusion de l'indemnité, vérifiés au cas par cas",
        "L'étendue de la reprise, arrêtée avec votre conseil"])],
  }),

  /* ────────────────────────────────────────── fin du contrat ────────── */

  "SOC-FIN-DOCUMENTS": p => ({
    titre: "Liasse de fin de contrat : certificat, reçu pour solde de tout compte, attestation",
    lignes: [...entete(p, "documents remis à l'expiration du contrat (L. 1234-19, D. 1234-6, L. 1234-20, R. 1234-9)"),
      h("1. Certificat de travail"),
      par("À l'expiration du contrat de travail, l'employeur délivre au salarié un certificat dont le contenu est déterminé par voie réglementaire (L. 1234-19). L'article D. 1234-6, dans sa version lue à la source, énonce que le certificat contient EXCLUSIVEMENT la date d'entrée du salarié et celle de sa sortie, et la nature de l'emploi ou des emplois successivement occupés avec les périodes pendant lesquelles ils l'ont été. Les deux autres mentions qu'il portait autrefois sont abrogées : n'ajoutez rien au certificat que ce que ce texte énumère."),
      par(ex("« Certificat de travail — " + nomE(p) + " certifie que Madame Ngozi OKAFOR a été employée du " + plusJours(p, -400) + " au " + plusJours(p, -1) + " en qualité de préparatrice de commandes, puis de cheffe d'équipe à compter du " + plusJours(p, -120) + ". Fait le " + plusJours(p, 0) + " pour servir et valoir ce que de droit. »")),
      h("2. Reçu pour solde de tout compte"),
      par("Le reçu pour solde de tout compte, délivré par l'employeur et dont le salarié lui donne reçu, fait l'inventaire des sommes versées lors de la rupture du contrat (L. 1234-20). Il est établi en double exemplaire, mention en étant faite sur le reçu."),
      par(ex("« Inventaire des sommes versées : salaire du mois 1 620,00 € brut — indemnité compensatrice de congés payés (17,5 jours) 1 134,00 € brut — indemnité de préavis 0,00 € (préavis effectué) — indemnité légale de licenciement 1 890,00 € — total brut 4 644,00 €, net à payer 3 810,25 €. Reçu en double exemplaire le " + plusJours(p, 0) + ". »")),
      h("3. Attestation destinée à l'assurance chômage"),
      par("L'employeur délivre au salarié, au moment de l'expiration ou de la rupture du contrat, les attestations et justifications lui permettant d'exercer ses droits aux prestations, et les transmet à l'organisme dans les conditions de l'article R. 1234-9."),
      puce(`Transmission : ${ex("dématérialisée depuis le logiciel de paie, le jour du départ, accusé conservé")}.`),
      h("4. Contrôle de sortie"),
      puce(`Aucun départ sans liasse remise et datée : ${ex("liste de contrôle signée par le gestionnaire de paie et le responsable hiérarchique")}.`),
      puce(`Rattrapage des sorties des ${ex("douze")} derniers mois : ${ex("3 attestations manquantes, régularisées le " + plusJours(p, 7))}.`),
      ...aPers(["Les mentions du certificat, vérifiées sur l'article D. 1234-6",
        "L'inventaire réel des sommes versées",
        "Le circuit de transmission de l'attestation et sa preuve",
        "La liste des sorties à rattraper"])],
  }),

  "SOC-FIN-LICENCIEMENT": p => ({
    titre: "Calendrier et trames de la procédure de licenciement pour motif personnel",
    lignes: [...entete(p, "procédure de licenciement pour motif personnel (L. 1232-2, L. 1232-4, L. 1232-6, L. 1235-2, R. 1232-13)"),
      h("1. Le calendrier"),
      puce(`Convocation à l'entretien préalable, remise en main propre contre décharge ou envoyée en recommandé : ${ex("le " + plusJours(p, 0))}.`),
      puce(`Présentation de la lettre : ${ex("le " + plusJours(p, 2))} — c'est de cette date que court le délai, non de l'envoi.`),
      puce(`Entretien préalable, cinq jours ouvrables au moins après la présentation : ${ex("le " + plusJours(p, 10))}.`),
      puce(`Notification, ni trop tôt ni trop tard selon les délais applicables : ${ex("le " + plusJours(p, 14))}.`),
      puce(`Fenêtre de précision des motifs : dans les quinze jours suivant la notification, dans les conditions de l'article R. 1232-13 — ${ex("jusqu'au " + plusJours(p, 29))}.`),
      h("2. Trame de convocation"),
      par(ex("« Madame, Nous vous convoquons à un entretien préalable à une éventuelle mesure de licenciement, qui se tiendra le " + plusJours(p, 10) + " à 10 heures, au siège de " + nomE(p) + ", bureau de la direction. Vous pouvez vous faire assister par une personne de votre choix appartenant au personnel de l'entreprise. [En l'absence d'institutions représentatives du personnel : vous pouvez vous faire assister par un conseiller de votre choix inscrit sur la liste dressée par l'autorité administrative, dont l'adresse et les modalités de consultation sont les suivantes : …] Fait le " + plusJours(p, 0) + ". »")),
      h("3. Trame de notification"),
      par(ex("« Madame, À la suite de notre entretien du " + plusJours(p, 10) + ", au cours duquel vous étiez assistée de Monsieur Sacha LEROY, nous vous notifions votre licenciement pour les motifs suivants : [énoncé précis, daté et circonstancié de chaque grief — la lettre fixe les limites du litige]. Votre préavis, d'une durée de …, débutera à la date de première présentation de la présente. Fait le " + plusJours(p, 14) + ". »")),
      h("4. Points de vigilance"),
      puce("Un motif absent de la lettre ne pourra pas être invoqué devant le juge : l'énoncé est écrit avant l'envoi, jamais après."),
      puce(`Salarié protégé : vérifier la liste avant toute convocation — ${ex("contrôle systématique par le service des ressources humaines")}.`),
      puce("Matière disciplinaire : les délais de la procédure disciplinaire s'ajoutent — l'audit détaillé se fait dans le module dédié."),
      ...aPers(["Les dates réelles du calendrier",
        "L'énoncé des motifs, précis et daté, relu par votre conseil",
        "La mention d'assistance adaptée à la présence ou non d'institutions représentatives"]),
      noteFin("l'audit complet de la matière disciplinaire se fait dans le module « discipline et règlement intérieur » (audit-discipline.html).")],
  }),

  "SOC-FIN-RUPTURE-CONV": p => ({
    titre: "Calendrier et trames de la rupture conventionnelle individuelle",
    lignes: [...entete(p, "rupture conventionnelle individuelle (L. 1237-11, L. 1237-13, L. 1237-14)"),
      h("1. Les règles"),
      puce("L'employeur et le salarié peuvent convenir en commun des conditions de la rupture du contrat à durée indéterminée qui les lie ; la rupture conventionnelle résulte d'une convention signée par les parties et garantit la liberté du consentement (L. 1237-11)."),
      puce("La convention définit les conditions de la rupture, notamment le montant de l'indemnité spécifique, qui ne peut être inférieur à celui de l'indemnité légale de licenciement, et la date de rupture. À compter de la signature, chaque partie dispose d'un délai de quinze jours calendaires pour se rétracter (L. 1237-13)."),
      puce("À l'issue du délai de rétractation, la partie la plus diligente adresse une demande d'homologation à l'autorité administrative (L. 1237-14)."),
      h("2. Calendrier (exemple)"),
      puce(`Convocation au premier entretien, avec mention de la faculté d'assistance : ${ex("le " + plusJours(p, 0))}.`),
      puce(`Premier entretien : ${ex("le " + plusJours(p, 7))} ; second entretien : ${ex("le " + plusJours(p, 12))}.`),
      puce(`Signature de la convention, un exemplaire remis à chaque partie : ${ex("le " + plusJours(p, 12))}.`),
      puce(`Fin du délai de rétractation de quinze jours calendaires : ${ex("le " + plusJours(p, 27))}.`),
      puce(`Demande d'homologation adressée : ${ex("le " + plusJours(p, 28))} ; décision attendue à l'issue du délai d'instruction.`),
      puce(`Date de rupture envisagée, postérieure à l'homologation : ${ex("le " + plusJours(p, 50))}.`),
      h("3. Trame de convocation"),
      par(ex("« Madame, Faisant suite à votre demande, nous vous proposons un entretien en vue d'examiner ensemble les conditions d'une éventuelle rupture conventionnelle de votre contrat de travail. Cet entretien se tiendra le " + plusJours(p, 7) + " à 14 heures. Vous pouvez vous y faire assister par une personne de votre choix appartenant au personnel de l'entreprise. Fait le " + plusJours(p, 0) + ". »")),
      h("4. Calcul de l'indemnité"),
      par(ex("Ancienneté : 6 ans et 4 mois — salaire de référence retenu : 2 250 € — indemnité légale de licenciement calculée : 3 750 € — indemnité conventionnelle éventuellement plus favorable : à vérifier sur " + ccn(p) + " — indemnité spécifique retenue : 3 900 €.")),
      par("Le montant conventionnel n'est pas affirmé ici : cette application ne lit que le code du travail. Comparez les deux avant de signer."),
      ...aPers(["Les dates réelles du calendrier",
        "Le calcul de l'indemnité et la comparaison avec l'indemnité conventionnelle",
        "La date de rupture retenue, postérieure à l'homologation"])],
  }),

  "SOC-FIN-INAPTITUDE": p => ({
    titre: "Dossier de reclassement après avis d'inaptitude",
    lignes: [...entete(p, "inaptitude : reclassement et reprise du salaire (L. 1226-2, L. 1226-4)"),
      h("1. Les règles"),
      puce("Lorsque le salarié victime d'une maladie ou d'un accident non professionnel est déclaré inapte par le médecin du travail à reprendre l'emploi qu'il occupait, l'employeur lui propose un autre emploi approprié à ses capacités, au vu des conclusions écrites du médecin du travail et des indications qu'il formule (L. 1226-2)."),
      puce("Lorsque, à l'issue d'un délai d'un mois à compter de la date de l'examen médical de reprise, le salarié n'est pas reclassé dans l'entreprise ou s'il n'est pas licencié, l'employeur lui verse, dès l'expiration de ce délai, le salaire correspondant à l'emploi qu'il occupait avant la suspension de son contrat (L. 1226-4)."),
      h("2. Chronologie du dossier (exemple)"),
      puce(`Examen médical de reprise : ${ex("le " + plusJours(p, 0))} — avis d'inaptitude notifié le même jour.`),
      puce(`Échéance du délai d'un mois : ${ex("le " + plusJours(p, 30))} — alerte posée dans l'agenda du service.`),
      puce(`Échanges écrits avec le médecin du travail sur les postes envisageables : ${ex("courriers des " + plusJours(p, 3) + " et " + plusJours(p, 12))}.`),
      puce(`Consultation du comité social et économique sur les propositions : ${ex("réunion du " + plusJours(p, 18) + ", procès-verbal conservé")}.`),
      h("3. Registre des postes examinés"),
      par("Colonnes : poste examiné · site · compatibilité avec les indications du médecin · aménagement envisagé · réponse du salarié · motif du rejet."),
      par(ex("Agent administratif exploitation — siège — compatible sous réserve d'un siège ergonomique et d'une limitation du port de charges — proposé le " + plusJours(p, 20) + " — refusé par la salariée le " + plusJours(p, 24))),
      par(ex("Préparateur de commandes poste allégé — plateforme nord — incompatible : port de charges supérieur aux limitations — écarté, avis du médecin du " + plusJours(p, 12))),
      h("4. Suites"),
      puce(`Reprise du paiement du salaire au ${ex(plusJours(p, 30))} si ni reclassement ni licenciement — paramétrage en paie fait le ${ex(plusJours(p, 25))}.`),
      puce("Aucune notification de licenciement pour inaptitude sans relecture du dossier par votre conseil."),
      ...aPers(["Les dates réelles de l'examen et du délai d'un mois",
        "La liste des postes examinés, site par site",
        "Les échanges avec le médecin du travail et l'avis du comité"])],
  }),

  /* ─────────────────────────── égalité et non-discrimination ───────── */

  "SOC-EGA-REMUNERATION": p => ({
    titre: "Grille de comparaison des rémunérations à travail de valeur égale",
    lignes: [...entete(p, "égalité de rémunération entre les femmes et les hommes (L. 3221-2)"),
      h("1. La règle"),
      par("Tout employeur assure, pour un même travail ou pour un travail de valeur égale, l'égalité de rémunération entre les femmes et les hommes (L. 3221-2). Sont considérés comme de valeur égale les travaux qui exigent des salariés un ensemble comparable de connaissances professionnelles consacrées par un titre, un diplôme ou une pratique professionnelle, de capacités découlant de l'expérience acquise, de responsabilités et de charge physique ou nerveuse."),
      h("2. Groupes de comparaison (exemple)"),
      ...secteurProfil(p).unites.slice(0, 3).map(u => puce(`${u[0]} : ${ex("emplois regroupés par niveau de responsabilité et de qualification, indépendamment de l'intitulé du poste")}.`)),
      puce(`Attention aux emplois différents mais de valeur égale : ${ex("cheffe d'équipe administrative et chef d'équipe de quai, mêmes niveaux de responsabilité et de qualification")} — c'est là que les écarts se logent.`),
      h("3. Grille"),
      par("Colonnes : groupe · salarié · sexe · ancienneté · coefficient · rémunération annuelle brute · écart à la moyenne du groupe · élément objectif invoqué · suite donnée."),
      par(ex("Groupe « encadrement d'exploitation » — MARTIN Camille — F — 6 ans — coefficient 150 — 34 200 € — écart −7,4 % — élément objectif invoqué : aucun — CORRECTION à opérer")),
      par(ex("Groupe « encadrement d'exploitation » — DUVAL Alex — H — 6 ans — coefficient 150 — 36 900 € — écart +2,1 % — sans objet")),
      h("4. Suites"),
      puce(`Écarts injustifiés corrigés à la paie de ${ex(plusJours(p, 40).slice(0, 7))} ; enveloppe : ${ex("9 200 € en année pleine")}.`),
      puce(`Rapprochement avec l'index de l'égalité professionnelle et la négociation sur l'égalité : ${ex("résultats croisés lors de la réunion du " + plusJours(p, 60))}, lorsque l'entreprise y est tenue.`),
      puce(`Revue reconduite chaque année, avant la négociation annuelle — responsable : ${ex("Camille MARTIN")}.`),
      ...aPers(["Les groupes de comparaison, construits sur vos emplois réels",
        "Les rémunérations et les écarts, calculés sur vos données",
        "Les éléments objectifs invoqués, écrits et vérifiables",
        "L'enveloppe de correction et son calendrier"])],
  }),

  "SOC-EGA-DISCRIMINATION": p => ({
    titre: "Note de critères objectifs de décision en gestion du personnel",
    lignes: [...entete(p, "décisions fondées sur des critères objectifs (L. 1132-1, L. 1132-4)"),
      h("1. La règle"),
      par("Aucune personne ne peut être écartée d'une procédure de recrutement ou de nomination, ni faire l'objet d'une mesure discriminatoire, directe ou indirecte, en raison de l'un des critères énumérés par l'article L. 1132-1. Toute disposition ou tout acte pris à l'égard d'un salarié en méconnaissance de ces dispositions est nul (L. 1132-4)."),
      par("En contentieux, le salarié présente des éléments de fait laissant supposer l'existence d'une discrimination ; il incombe alors à l'employeur de prouver que sa décision est justifiée par des éléments objectifs étrangers à toute discrimination. Sans trace écrite, cette preuve est impossible."),
      h("2. Critères écrits (exemple)"),
      puce(`Recrutement : ${ex("grille d'évaluation commune à tous les candidats — expérience sur poste équivalent, habilitations détenues, disponibilité aux horaires du poste, résultat de la mise en situation")}.`),
      puce(`Augmentation individuelle : ${ex("tenue des objectifs de l'année, polyvalence acquise, contribution à la sécurité — pondération 40/30/30")}.`),
      puce(`Promotion : ${ex("réussite au poste actuel depuis douze mois au moins, formation d'encadrement suivie, avis motivé du responsable de service")}.`),
      puce(`Attribution des heures supplémentaires et des astreintes : ${ex("rotation documentée, hors contrainte médicale")}.`),
      h("3. Traçabilité"),
      par("Colonnes : décision · salarié · date · critère appliqué · pièce justificative · signataire."),
      par(ex("Augmentation refusée — LEROY Sacha — " + plusJours(p, -30) + " — objectifs atteints à 62 %, seuil interne 80 % — fiche d'évaluation annuelle — visa D. BERNARD")),
      h("4. Sensibilisation"),
      puce(`Encadrement sensibilisé aux critères prohibés et à la charge de la preuve : ${ex("session de deux heures le " + plusJours(p, 30) + ", émargement conservé")}.`),
      puce("Rappel : l'affichage d'information sur les discriminations est une obligation distincte, également due."),
      ...aPers(["Les critères réellement appliqués dans votre entreprise",
        "Le support de traçabilité des décisions",
        "Le programme et la date de la sensibilisation de l'encadrement"])],
  }),

  "SOC-EGA-SEXISME": p => ({
    titre: "Note de service : interdiction des agissements sexistes et voie de signalement",
    lignes: [...entete(p, "interdiction des agissements sexistes (L. 1142-2-1)"),
      h("1. La règle, telle qu'elle doit être écrite"),
      par("Nul ne doit subir d'agissement sexiste, défini comme tout agissement lié au sexe d'une personne, ayant pour objet ou pour effet de porter atteinte à sa dignité ou de créer un environnement intimidant, hostile, dégradant, humiliant ou offensant (L. 1142-2-1)."),
      h("2. Ce que la note précise (exemple)"),
      puce(`Exemples d'agissements visés : ${ex("propos ou plaisanteries fondés sur le sexe, remarques sur l'apparence, attribution systématique des tâches subalternes selon le sexe, mise à l'écart de réunions")}.`),
      puce(`Champ : ${ex("l'ensemble des lieux et des temps de travail, y compris les déplacements, les repas d'équipe et les échanges numériques professionnels")}.`),
      puce(`Suites possibles : ${ex("mesures disciplinaires selon l'échelle du règlement intérieur")} — lorsqu'un règlement intérieur existe, l'interdiction y figure.`),
      h("3. Voie de signalement"),
      puce(`Destinataires : ${ex("le référent harcèlement du comité, la référente désignée par l'employeur, ou la direction des ressources humaines — au choix de la personne")}.`),
      puce(`Forme : ${ex("écrit, courriel ou entretien dont il est dressé compte rendu")} ; accusé de réception sous ${ex("quarante-huit heures")}.`),
      puce(`Traitement : ${ex("entretien avec la personne signalante sous une semaine, enquête contradictoire, mesures conservatoires si nécessaire, retour écrit au signalant")}.`),
      puce(`Confidentialité : ${ex("dossier tenu à part, accès limité aux personnes chargées de l'enquête")}.`),
      h("4. Texte de la note"),
      par(ex("« " + nomE(p) + " rappelle que nul ne doit subir d'agissement sexiste. Toute personne s'estimant victime ou témoin peut saisir la référente harcèlement, le référent du comité social et économique ou la direction. Chaque signalement fait l'objet d'un accusé de réception, d'un examen et d'une réponse écrite. Aucune mesure défavorable ne sera prise à l'encontre d'une personne ayant signalé de bonne foi. Fait le " + plusJours(p, 5) + ". »")),
      ...aPers(["Les exemples adaptés à votre activité",
        "Les destinataires réels du signalement et leurs coordonnées",
        "Les délais de traitement que vous vous engagez à tenir"])],
  }),

  "SOC-EGA-HANDICAP": p => ({
    titre: "Fiche d'examen des mesures appropriées d'aménagement",
    lignes: [...entete(p, "mesures appropriées pour les travailleurs handicapés (L. 5213-6)"),
      h("1. La règle"),
      par("Afin de garantir le respect du principe d'égalité de traitement, l'employeur prend, en fonction des besoins dans une situation concrète, les mesures appropriées pour permettre aux travailleurs handicapés d'accéder à un emploi ou de conserver un emploi correspondant à leur qualification, de l'exercer et d'y progresser, ou pour qu'une formation adaptée à leurs besoins leur soit dispensée. Le refus de prendre ces mesures peut être constitutif d'une discrimination, sauf si les charges consécutives à leur mise en œuvre sont disproportionnées, compte tenu des aides qui peuvent compenser en tout ou partie les dépenses supportées (L. 5213-6)."),
      h("2. Fiche d'examen (exemple)"),
      puce(`Salarié : ${ex("Monsieur Alex DUVAL, préparateur de commandes, reconnaissance de la qualité de travailleur handicapé")}.`),
      puce(`Situation concrète et besoins : ${ex("limitation du port de charges à 10 kg, alternance des postures, pas de travail en hauteur — indications du médecin du travail du " + plusJours(p, -20))}.`),
      puce(`Mesures examinées : ${ex("aide à la manutention sur le poste, réaménagement de la zone de picking, adaptation du plan de charge, transfert partiel sur poste administratif")}.`),
      puce(`Coût brut estimé : ${ex("14 500 €")} — aides mobilisables : ${ex("8 000 €")} — coût net : ${ex("6 500 €")}.`),
      puce(`Décision : ${ex("mesures retenues, mise en œuvre au " + plusJours(p, 45))} — motivation écrite conservée.`),
      h("3. Si une mesure n'est pas retenue"),
      par(`La charge disproportionnée s'apprécie APRÈS aides. Écrivez l'analyse : coût brut, aides sollicitées et réponses obtenues, coût net, capacité de l'entreprise, solutions alternatives examinées. ${ex("Un refus non chiffré est traité comme un refus non justifié.")}`),
      h("4. Suivi"),
      puce(`Revue des aménagements en place : ${ex("annuelle, avec le médecin du travail")} ; interlocuteur interne : ${ex("le référent handicap lorsqu'il en existe un")}.`),
      puce("Le secret médical est respecté : la fiche porte les limitations fonctionnelles, jamais le diagnostic."),
      ...aPers(["Les situations réellement examinées et les indications du médecin",
        "Les coûts et les aides effectivement chiffrés",
        "La motivation écrite de chaque décision"])],
  }),

  "SOC-EGA-REFERENT-HANDICAP": p => ({
    titre: "Lettre de mission du référent handicap",
    lignes: [...entete(p, "désignation du référent handicap (L. 5213-6-1)"),
      h("1. La règle"),
      par(`Dans toute entreprise employant au moins deux cent cinquante salariés est désigné un référent chargé d'orienter, d'informer et d'accompagner les personnes en situation de handicap (L. 5213-6-1). L'effectif déclaré de ${nomE(p)} est de ${eff(p)} salariés.`),
      h("2. Lettre de mission (exemple)"),
      par(ex("« Madame Camille MARTIN, Vous êtes désignée référente handicap de " + nomE(p) + " à compter du " + plusJours(p, 10) + ". Votre mission est d'orienter, d'informer et d'accompagner les personnes en situation de handicap. Elle comprend : l'accueil et l'orientation des salariés qui vous sollicitent ; l'information sur les démarches de reconnaissance et sur les aides mobilisables ; l'appui aux services dans l'examen des mesures d'aménagement ; le lien avec le médecin du travail et les organismes compétents ; le suivi des aménagements en place. Vous disposez de deux journées par mois pour cette mission et d'une formation de trois jours financée par l'entreprise. Vos coordonnées seront portées à la connaissance de l'ensemble du personnel. »")),
      h("3. Publicité de la désignation"),
      puce(`Affichage sur les panneaux du personnel et publication à l'intranet : ${ex("le " + plusJours(p, 12))}.`),
      puce(`Mention au livret d'accueil et dans la note d'entrée des nouveaux embauchés : ${ex("mise à jour le " + plusJours(p, 20))}.`),
      puce(`Information du comité social et économique : ${ex("point à l'ordre du jour de la réunion du " + plusJours(p, 25))}.`),
      h("4. Articulation"),
      puce("Le référent handicap n'est ni le médecin du travail ni le référent harcèlement : les rôles se distinguent et se disent."),
      puce(`Rendez-vous de suivi de la mission : ${ex("semestriel, avec la direction des ressources humaines")}.`),
      ...aPers(["Le nom du référent et le temps réellement alloué",
        "Le contenu de la formation prévue",
        "Les supports et dates de publicité de la désignation"])],
  }),

  "SOC-EGA-RECRUTEURS": p => ({
    titre: "Plan de formation à la non-discrimination à l'embauche",
    lignes: [...entete(p, "formation des personnes chargées du recrutement (L. 1131-2)"),
      h("1. La règle"),
      par(`Dans toute entreprise employant au moins trois cents salariés, les salariés chargés des missions de recrutement reçoivent une formation à la non-discrimination à l'embauche au moins une fois tous les cinq ans (L. 1131-2). L'effectif déclaré de ${nomE(p)} est de ${eff(p)} salariés.`),
      h("2. Recensement des personnes concernées (exemple)"),
      puce(`Ressources humaines : ${ex("3 personnes — chargée de recrutement, responsable RH, assistante RH")}.`),
      puce(`Encadrement qui participe aux décisions de recrutement : ${ex("11 responsables de service et chefs d'équipe")}.`),
      puce(`Direction : ${ex("2 personnes participant aux entretiens finaux")}.`),
      puce(`Total : ${ex("16 personnes")} — le recensement inclut ceux qui recrutent occasionnellement, souvent oubliés.`),
      h("3. Programme et calendrier"),
      puce(`Contenu : ${ex("les critères prohibés, la charge de la preuve, la conduite de l'entretien, la grille d'évaluation commune, les pièges des critères indirects (mobilité, disponibilité, apparence)")}.`),
      puce(`Format : ${ex("une demi-journée par groupe de huit, deux sessions")} — dates : ${ex(plusJours(p, 40) + " et " + plusJours(p, 47))}.`),
      puce(`Organisme : ${ex("prestataire externe")} ; attestations individuelles conservées au dossier.`),
      h("4. Échéancier des renouvellements"),
      par("Colonnes : personne · fonction · date de la dernière formation · échéance quinquennale · statut."),
      par(ex("MARTIN Camille — responsable RH — formation du " + plusJours(p, 40) + " — échéance quinquennale : cinq ans après cette date — à jour")),
      ...aPers(["La liste réelle des personnes qui participent aux recrutements",
        "Le programme, l'organisme et les dates retenues",
        "L'échéancier des renouvellements et son responsable"])],
  }),

  "SOC-EGA-ALERTE": p => ({
    titre: "Procédure de recueil et de traitement des signalements",
    lignes: [...entete(p, "protection de la personne qui signale ou témoigne (L. 1132-3-3)"),
      h("1. La règle"),
      par("Aucune personne ayant témoigné, de bonne foi, de faits constitutifs d'un délit ou d'un crime dont elle aurait eu connaissance dans l'exercice de ses fonctions, ou les ayant relatés, ne peut faire l'objet des mesures défavorables énumérées par l'article L. 1132-3-3. Toute mesure prise en méconnaissance de ces dispositions est nulle."),
      h("2. La voie de signalement (exemple)"),
      puce(`Destinataires : ${ex("la direction des ressources humaines, ou à défaut la direction générale, ou le référent désigné")} — le choix appartient à la personne qui signale.`),
      puce(`Forme : ${ex("écrit remis en main propre, courriel dédié, ou entretien dont il est dressé un compte rendu signé")}.`),
      puce(`Accusé de réception : ${ex("sous quarante-huit heures ouvrées, par écrit")}.`),
      puce(`Confidentialité : ${ex("identité du signalant connue des seules personnes chargées du traitement ; dossier conservé à part")}.`),
      h("3. Le traitement"),
      puce(`Examen de recevabilité et premiers actes : ${ex("sous une semaine")}.`),
      puce(`Enquête : ${ex("contradictoire, écrite, conduite par deux personnes dont une extérieure au service concerné")}.`),
      puce(`Retour écrit au signalant sur les suites : ${ex("sous trois mois")}.`),
      puce(`Mesures conservatoires si nécessaire : ${ex("éloignement de la personne mise en cause, jamais du signalant")}.`),
      h("4. La protection, en pratique"),
      par(ex("« Pendant les douze mois suivant un signalement, toute décision défavorable envisagée à l'égard du signalant — sanction, mutation, refus d'augmentation, non-renouvellement — est soumise au visa préalable de la direction des ressources humaines, qui vérifie et écrit son motif. »")),
      par("Le dispositif général de protection des lanceurs d'alerte, qui n'est pas du code du travail, s'articule avec la présente procédure : faites-le vérifier par votre conseil — cette application ne le lit pas."),
      ...aPers(["Les destinataires réels et leurs coordonnées",
        "Les délais que vous vous engagez à tenir",
        "L'articulation avec le dispositif général de protection des lanceurs d'alerte"])],
  }),

  /* ─────────────────────── santé-sécurité (suite) ───────────────────── */

  "SOC-SST-INFO-RISQUES": p => ({
    titre: "Support d'information sur les risques, par unité de travail",
    lignes: [...entete(p, "information des travailleurs sur les risques (L. 4141-1)"),
      h("1. La règle"),
      par("L'employeur organise et dispense une information des travailleurs sur les risques pour la santé et la sécurité et sur les mesures prises pour y remédier (L. 4141-1). Cette information se distingue de la formation pratique à la sécurité, qui reste due par ailleurs : l'une explique le risque, l'autre apprend le geste."),
      h("2. Le support, unité par unité (exemple, tiré du document unique)"),
      ...secteurProfil(p).unites.map(u => puce(`${u[0]} — risques : ${u[1]} ; mesures prises : ${u[2]}.`)),
      h("3. Ce que le support dit à chaque salarié"),
      puce(`Les risques de SON poste, nommés et expliqués — ${ex("pas la liste générale de l'entreprise")}.`),
      puce(`Les mesures de prévention en place et ce qu'elles attendent de lui : ${ex("port des équipements, respect du plan de circulation, signalement des anomalies")}.`),
      puce(`La conduite à tenir en cas d'incident : ${ex("qui alerter, où se trouve le matériel de premiers secours, comment évacuer")}.`),
      puce(`Ses droits : ${ex("droit d'alerte et de retrait en cas de danger grave et imminent, registre spécial et coordonnées des élus")}.`),
      h("4. Quand et comment"),
      puce(`À l'entrée du salarié, à chaque changement de poste, et lors de toute évolution du document unique : ${ex("remise contre émargement, support daté et versionné")}.`),
      puce(`Responsable : ${ex("le salarié compétent en prévention, avec l'encadrement de l'unité")} ; archivage : ${ex("dossier « prévention » et dossier individuel")}.`),
      ...aPers(["Les unités et les risques réellement issus de votre document unique",
        "Le contenu du support pour chaque poste",
        "Le circuit de remise et d'émargement"])],
  }),

  "SOC-SST-FORMATION-RENFORCEE": p => ({
    titre: "Liste des postes à risques particuliers et programme de formation renforcée",
    lignes: [...entete(p, "formation renforcée des salariés en contrat court (L. 4154-2)"),
      h("1. La règle"),
      par("Les salariés titulaires d'un contrat de travail à durée déterminée, les salariés temporaires et les stagiaires affectés à des postes de travail présentant des risques particuliers pour leur santé ou leur sécurité bénéficient d'une formation renforcée à la sécurité ainsi que d'un accueil et d'une information adaptés dans l'entreprise. La liste de ces postes est établie par l'employeur, après avis du médecin du travail et du comité social et économique lorsqu'il existe (L. 4154-2)."),
      h("2. Liste des postes (exemple)"),
      ...secteurProfil(p).unites.slice(0, 3).map(u => puce(`${u[0]} : ${ex("poste retenu au titre des risques suivants — " + u[1])}.`)),
      puce(`Avis du médecin du travail recueilli le ${ex(plusJours(p, -25))} ; avis du comité social et économique du ${ex(plusJours(p, -15))}.`),
      puce(`Mise à jour : ${ex("annuelle, et à chaque création ou modification de poste")}.`),
      h("3. Programme de formation renforcée"),
      puce(`Durée : ${ex("une journée avant toute prise de poste, contre une demi-journée pour l'accueil général")}.`),
      puce(`Contenu : ${ex("risques du poste, gestes et postures, consignes de sécurité, équipements de protection, conduite à tenir en cas d'incident, droit d'alerte et de retrait")}.`),
      puce(`Formateur : ${ex("le salarié compétent en prévention, assisté du chef d'équipe")} ; évaluation en fin de session, émargement conservé.`),
      h("4. Cas des salariés temporaires"),
      puce(`La liste des postes est transmise à l'entreprise de travail temporaire : ${ex("envoi du " + plusJours(p, 5) + ", accusé conservé")}.`),
      puce(`Le contrat de mise à disposition mentionne le caractère à risques du poste : ${ex("clause type révisée")}.`),
      ...aPers(["La liste réelle des postes à risques et les avis qui la précèdent",
        "Le contenu et la durée de la formation renforcée",
        "Le circuit de transmission aux entreprises de travail temporaire"])],
  }),

  "SOC-SST-SECOURS": p => ({
    titre: "Protocole d'organisation des secours et inventaire du matériel",
    lignes: [...entete(p, "premiers secours et organisation des soins d'urgence (R. 4224-14, R. 4224-15, R. 4224-16)"),
      h("1. Les règles"),
      puce("Les lieux de travail sont équipés d'un matériel de premiers secours adapté à la nature des risques et facilement accessible (R. 4224-14). Ce matériel fait l'objet d'une signalisation."),
      puce("Un membre du personnel reçoit la formation de secouriste nécessaire pour donner les premiers secours en cas d'urgence, dans les ateliers où sont accomplis des travaux dangereux et sur les chantiers employant du personnel effectuant des travaux dangereux (R. 4224-15). Ces salariés ne peuvent remplacer les infirmiers."),
      puce("En l'absence d'infirmiers, ou lorsque leur nombre ne permet pas d'assurer une présence permanente, l'employeur prend, après avis du médecin du travail, les mesures nécessaires pour assurer les premiers secours aux accidentés et aux malades ; ces mesures, consignées dans un document tenu à disposition de l'agent de contrôle de l'inspection du travail, sont adaptées à la nature des risques (R. 4224-16)."),
      h("2. Inventaire du matériel (exemple)"),
      puce(`Trousses de premiers secours : ${ex("6 — accueil, quai, atelier, bureaux, 2 véhicules d'intervention")} ; contenu défini avec le médecin du travail, vérifié ${ex("tous les trimestres")}.`),
      puce(`Défibrillateur : ${ex("1, hall d'accueil, contrat de maintenance annuel")} ; signalisation par panneaux normalisés.`),
      puce(`Point de rassemblement et accès pompiers : ${ex("parking nord, plan affiché aux trois issues")}.`),
      h("3. Secouristes"),
      par("Colonnes : nom · site · horaire couvert · date de formation · date de recyclage."),
      par(ex("LEROY Sacha — plateforme — équipe du matin — formé le " + plusJours(p, -300) + " — recyclage prévu le " + plusJours(p, 60))),
      par(ex("DUVAL Alex — atelier — équipe d'après-midi — formé le " + plusJours(p, -200) + " — à jour")),
      puce(`Couverture des horaires : ${ex("matin et après-midi couverts ; équipe de nuit NON couverte — formation à programmer")}.`),
      h("4. Le protocole écrit"),
      par(ex("« En l'absence d'infirmier, les premiers secours sont assurés par les secouristes désignés. En cas d'urgence : 1. protéger et alerter le secouriste de service ; 2. appeler le 15 ou le 112 depuis le poste d'accueil ; 3. prévenir la direction et le membre du comité social et économique ; 4. guider les secours depuis l'entrée principale ; 5. renseigner le registre et, s'il y a lieu, déclarer l'accident. Protocole établi après avis du médecin du travail du " + plusJours(p, -25) + ", tenu à la disposition de l'inspection du travail. »")),
      ...aPers(["L'inventaire réel du matériel et son emplacement",
        "La liste des secouristes et la couverture de tous les horaires",
        "Le protocole, arrêté après avis de votre médecin du travail"])],
  }),

  "SOC-SST-INCENDIE-MOYENS": p => ({
    titre: "Inventaire des moyens de lutte contre l'incendie et tournée des dégagements",
    lignes: [...entete(p, "moyens de secours contre l'incendie et dégagements (R. 4227-29, R. 4227-4)"),
      h("1. Les règles"),
      puce("Le premier secours contre l'incendie est assuré par des extincteurs en nombre suffisant et maintenus en bon état de fonctionnement (R. 4227-29). Il en existe au moins un par niveau, et leur nature est appropriée aux risques."),
      puce("Les établissements comportent des dégagements tels que dégagements, escaliers, chemins de circulation, répartis de manière à permettre une évacuation rapide, et toujours libres (R. 4227-4)."),
      h("2. Inventaire (exemple)"),
      par("Colonnes : bâtiment · niveau · emplacement · type d'extincteur · risque couvert · date de vérification · état."),
      par(ex("Bâtiment A — rez-de-chaussée — hall — eau pulvérisée 6 L — matières combustibles — vérifié le " + plusJours(p, -120) + " — conforme")),
      par(ex("Bâtiment A — atelier — près du tableau électrique — CO2 5 kg — risque électrique — vérifié le " + plusJours(p, -120) + " — conforme")),
      par(ex("Bâtiment B — quai — deux points — poudre polyvalente 9 kg — stockage et engins — VÉRIFICATION ÉCHUE, à programmer avant le " + plusJours(p, 20))),
      h("3. Tournée des dégagements"),
      par("Colonnes : dégagement · encombrement constaté · action · date · visa."),
      par(ex("Issue de secours quai nord — palettes stockées devant la porte — dégagement immédiat et marquage au sol de la zone interdite — " + plusJours(p, 1) + " — visa services généraux")),
      puce(`Tournée instituée : ${ex("hebdomadaire, le vendredi, par le responsable des services généraux")} ; anomalie traitée le jour même.`),
      h("4. Traces"),
      puce("Rapports de vérification et comptes rendus de tournée rangés au registre de sécurité, avec les suites données."),
      puce(`Articulation : consigne de sécurité incendie, exercices et signalisation sont des obligations distinctes — ${ex("exercice semestriel programmé le " + plusJours(p, 45))}.`),
      ...aPers(["L'inventaire réel des moyens, bâtiment par bâtiment",
        "Le contrat de vérification et son échéancier",
        "Le rythme de la tournée des dégagements et son responsable"])],
  }),

  "SOC-SST-ACCIDENT-GRAVE": p => ({
    titre: "Procédure d'alerte en cas d'accident grave ou mortel",
    lignes: [...entete(p, "information de l'inspection du travail en cas d'accident mortel (R. 4121-5)"),
      h("1. La règle"),
      par("Lorsqu'un travailleur est victime d'un accident du travail ayant entraîné son décès, l'employeur en informe l'agent de contrôle de l'inspection du travail immédiatement et au plus tard dans les douze heures qui suivent le décès, sauf s'il établit qu'il n'a pu avoir connaissance du décès que postérieurement à ce délai (R. 4121-5). Douze heures se comptent aussi la nuit, le samedi et le dimanche : la procédure doit vivre hors des heures de bureau."),
      h("2. La chaîne d'alerte (exemple)"),
      puce(`1. Le témoin ou le secouriste alerte les secours (15 ou 112) et le responsable de site : ${ex("appel immédiat")}.`),
      puce(`2. Le responsable de site prévient le cadre d'astreinte : ${ex("Dominique BERNARD, 06 XX XX XX XX")}.`),
      puce(`3. Le cadre d'astreinte prévient la direction et informe l'agent de contrôle de l'inspection du travail : ${ex("unité de contrôle territorialement compétente — téléphone et courriel figurant en annexe de la présente procédure")}.`),
      puce(`4. Le cadre d'astreinte informe le secrétaire du comité social et économique et convoque une réunion : ${ex("dans les vingt-quatre heures")}.`),
      puce(`5. Les lieux sont préservés en l'état, sauf nécessité de secours : ${ex("périmètre balisé, photographies datées")}.`),
      h("3. Les traces à constituer"),
      puce(`Main courante horodatée de tous les appels : ${ex("heure du décès constaté, heure d'appel à l'inspection, interlocuteur")}.`),
      puce(`Déclaration d'accident du travail dans les délais qui lui sont propres, et copie conservée cinq ans avec les autres documents de sécurité.`),
      puce(`Enquête conjointe employeur / comité social et économique : ${ex("engagée sous 48 heures, compte rendu écrit")}.`),
      h("4. Diffusion et révision"),
      puce(`Procédure remise à ${ex("l'ensemble des responsables de site et des cadres d'astreinte")}, contre émargement, le ${ex(plusJours(p, 7))}.`),
      puce(`Révision annuelle des coordonnées : ${ex("chaque janvier")} — une inspection dont le numéro a changé est une procédure morte.`),
      ...aPers(["Les noms et numéros réels de la chaîne d'astreinte",
        "Les coordonnées à jour de votre unité de contrôle",
        "Le circuit d'information du comité social et économique"])],
  }),

  "SOC-SST-SUIVI-CONTRAT": p => ({
    titre: "Circuit du suivi médical et réponse écrite aux avis du médecin du travail",
    lignes: [...entete(p, "visites de reprise et de mi-carrière, information du médecin, suites des avis"),
      h("1. Les règles"),
      puce("Le travailleur bénéficie d'un examen de reprise du travail par le médecin du travail dans les cas énumérés par l'article R. 4624-31, à l'initiative de l'employeur."),
      puce("En vue de favoriser le maintien dans l'emploi, une visite de préreprise peut être organisée dans les conditions de l'article R. 4624-29."),
      puce("Le médecin du travail est informé par l'employeur de tout arrêt de travail d'une durée inférieure à trente jours pour cause d'accident du travail (R. 4624-33)."),
      puce("Le travailleur est examiné par le médecin du travail au cours d'une visite de mi-carrière, dans les conditions de l'article L. 4624-2-2."),
      puce("L'employeur est tenu de prendre en considération l'avis et les indications ou les propositions émis par le médecin du travail ; en cas de refus, il fait connaître par écrit au travailleur et au médecin du travail les motifs qui s'opposent à ce qu'il y soit donné suite (L. 4624-6)."),
      h("2. Le circuit (exemple)"),
      puce(`Déclenchement automatique : ${ex("le logiciel de gestion des absences signale, dès la saisie de la reprise, tout arrêt entrant dans les cas de l'article R. 4624-31")}.`),
      puce(`Demande de visite adressée au service de prévention et de santé au travail : ${ex("le jour de la reprise, par le portail du service")}.`),
      puce(`Information du médecin pour les arrêts courts liés à un accident du travail : ${ex("envoi hebdomadaire de la liste, tous les lundis")}.`),
      puce(`Visites de mi-carrière : ${ex("liste des salariés concernés extraite chaque trimestre, convocations envoyées")}.`),
      h("3. La réponse écrite à un avis (exemple)"),
      par(ex("« Docteur, Nous avons bien reçu votre avis du " + plusJours(p, -10) + " concernant Monsieur Alex DUVAL, préconisant une limitation du port de charges à 10 kg et l'alternance des postures. Nous mettons en œuvre la première préconisation à compter du " + plusJours(p, 5) + " par la mise à disposition d'une aide à la manutention. La seconde ne peut être suivie en l'état sur le poste actuel : l'organisation de la ligne ne permet pas l'alternance demandée sans réorganisation complète, dont le coût net après aides est estimé à 42 000 €. Nous examinons un reclassement sur le poste de … et vous en tiendrons informé. Copie de la présente est adressée au salarié. »")),
      h("4. Traces"),
      puce("Chaque avis reçoit une décision écrite, datée, adressée au salarié et au médecin — y compris lorsqu'elle est positive."),
      puce(`Registre des avis et des suites : ${ex("tenu par le service des ressources humaines, revu chaque trimestre")}.`),
      ...aPers(["Le mode de déclenchement des visites dans votre outil de gestion",
        "Le rythme d'information du médecin pour les arrêts courts",
        "Le texte de la réponse, adapté à chaque avis"])],
  }),

  "SOC-SST-FICHE-ENTREPRISE": p => ({
    titre: "Demande de fiche d'entreprise et document annuel au service de santé au travail",
    lignes: [...entete(p, "fiche d'entreprise et document annuel (R. 4624-46, R. 4624-47, D. 4622-22)"),
      h("1. Les règles"),
      puce("Pour chaque entreprise ou établissement, le médecin du travail ou, dans les conditions de l'article R. 4624-46, un membre de l'équipe pluridisciplinaire, établit et met à jour une fiche d'entreprise sur laquelle figurent notamment les risques professionnels et les effectifs de salariés qui y sont exposés."),
      puce("Pour les entreprises adhérentes à un service de prévention et de santé au travail interentreprises, la fiche est établie dans les conditions et les délais de l'article R. 4624-47 ; elle est transmise à l'employeur et tenue à la disposition des agents de contrôle."),
      puce("Les droits et obligations réciproques du service de prévention et de santé au travail et de l'employeur adhérent sont fixés dans les conditions de l'article D. 4622-22, qui prévoit notamment le document que l'employeur adresse au service."),
      h("2. Lettre de demande (exemple)"),
      par(ex("« Madame, Monsieur, " + nomE(p) + ", adhérente à votre service, n'a pas reçu de fiche d'entreprise à jour. Notre effectif est de " + eff(p) + " salariés, répartis sur " + (p.etablissementsDistincts === "oui" ? "plusieurs établissements" : "un établissement") + ", dans le secteur " + (q(p.secteur) || "d'activité déclaré") + ". Nous vous prions de bien vouloir établir ou actualiser cette fiche et de nous la transmettre. Nous tenons à votre disposition notre document unique dans sa version du " + plusJours(p, -60) + " et la liste de nos unités de travail. Fait le " + plusJours(p, 3) + ". »")),
      h("3. Le document annuel adressé au service"),
      puce(`Contenu type : ${ex("effectifs par catégorie et par site, mouvements de l'année, postes à risques particuliers, produits utilisés, accidents et maladies déclarés, évolutions d'organisation")}.`),
      puce(`Date d'envoi retenue : ${ex("chaque année avant le 31 mars")} ; responsable : ${ex("Camille MARTIN")}.`),
      h("4. À réception de la fiche"),
      puce(`Présentation au comité social et économique en même temps que le bilan annuel : ${ex("réunion du " + plusJours(p, 60))}.`),
      puce(`Rangement avec les documents tenus à disposition de l'inspection du travail et du médecin inspecteur.`),
      puce(`Rapprochement avec le document unique : ${ex("tout risque figurant à la fiche et absent du document unique est repris dans la mise à jour suivante")}.`),
      ...aPers(["Le nom et les coordonnées de votre service de prévention et de santé au travail",
        "Le contenu et la date d'envoi du document annuel",
        "La date de présentation de la fiche au comité"])],
  }),

  "SOC-SST-SALARIE-COMPETENT": p => ({
    titre: "Désignation et lettre de mission du salarié compétent en prévention",
    lignes: [...entete(p, "salarié compétent en prévention des risques (L. 4644-1)"),
      h("1. La règle"),
      par("L'employeur désigne un ou plusieurs salariés compétents pour s'occuper des activités de protection et de prévention des risques professionnels de l'entreprise (L. 4644-1). Le ou les salariés ainsi désignés disposent du temps nécessaire et des moyens requis. À défaut, si les compétences dans l'entreprise ne permettent pas d'organiser ces activités, l'employeur peut faire appel aux intervenants extérieurs prévus par ce texte — sans que cela le dispense de la désignation."),
      h("2. Décision de désignation (exemple)"),
      par(ex("« Après avis du comité social et économique recueilli le " + plusJours(p, -20) + ", " + nomE(p) + " désigne Monsieur Sacha LEROY, responsable maintenance, en qualité de salarié compétent pour s'occuper des activités de protection et de prévention des risques professionnels, à compter du " + plusJours(p, 10) + ". »")),
      h("3. Lettre de mission"),
      puce(`Périmètre : ${ex("l'ensemble des sites de l'entreprise")} ; rattachement : ${ex("direction générale, pour l'exercice de la mission")}.`),
      puce(`Missions : ${ex("tenue et mise à jour du document unique et de son annexe ; animation du programme de prévention ; suivi des vérifications périodiques et du registre de sécurité ; préparation des points santé-sécurité du comité ; accueil sécurité des nouveaux entrants ; suivi des accidents et des presque-accidents")}.`),
      puce(`Temps alloué : ${ex("une journée par semaine, dégagée du planning d'exploitation")}.`),
      puce(`Moyens : ${ex("formation initiale de cinq jours en prévention des risques, budget matériel annuel de 6 000 €, accès aux données d'accidentologie")}.`),
      puce(`Recours extérieur complémentaire : ${ex("intervenant en prévention des risques professionnels du service de santé au travail, sollicité sur le risque chimique")}.`),
      h("4. Information"),
      puce(`Le nom du salarié compétent est porté à la connaissance du personnel : ${ex("affichage et note du " + plusJours(p, 12))}, et communiqué au service de prévention et de santé au travail.`),
      puce(`Point de suivi de la mission avec la direction : ${ex("trimestriel")}.`),
      ...aPers(["Le nom du salarié désigné et la date d'avis du comité",
        "Le périmètre, les missions et le temps réellement alloués",
        "La formation prévue et son financement"])],
  }),

  "SOC-SST-EPI": p => ({
    titre: "Dotation d'équipements de protection individuelle et consigne de port",
    lignes: [...entete(p, "équipements de protection individuelle (R. 4323-91, R. 4323-95)"),
      h("1. Les règles"),
      puce("Les équipements de protection individuelle sont appropriés aux risques à prévenir et aux conditions dans lesquelles le travail est accompli ; ils ne doivent pas être eux-mêmes source de risques supplémentaires (R. 4323-91)."),
      puce("Les équipements de protection individuelle et les vêtements de travail sont fournis gratuitement par l'employeur, qui assure leur bon fonctionnement et leur maintien dans un état hygiénique satisfaisant par les entretiens, réparations et remplacements nécessaires (R. 4323-95)."),
      puce("La protection collective prime : l'équipement individuel n'intervient que lorsque le risque n'a pu être évité ni traité collectivement — cette justification s'écrit dans le document unique."),
      h("2. Dotation par unité (exemple)"),
      ...secteurProfil(p).unites.slice(0, 3).map(u => puce(`${u[0]} — risques : ${u[1]} — dotation : ${ex("équipements adaptés à ces risques, choisis avec le médecin du travail et les élus")}.`)),
      puce(`Dotation individuelle remise contre émargement, avec explication d'usage : ${ex("fiche de dotation signée, conservée au dossier")}.`),
      h("3. Entretien et remplacement"),
      puce(`Entretien : ${ex("nettoyage des vêtements de travail pris en charge par l'entreprise — prestataire externe, ramassage hebdomadaire")}. Aucune participation du salarié, ni directe ni par retenue.`),
      puce(`Remplacement : ${ex("sur simple demande auprès du chef d'équipe, sans justification, stock tampon au magasin")}.`),
      puce(`Contrôle périodique de l'état : ${ex("mensuel, par le chef d'équipe, tracé sur la fiche d'unité")}.`),
      h("4. Consigne de port"),
      par(ex("« Le port des équipements remis est obligatoire dans les zones signalées et pour les tâches listées en annexe. Tout équipement détérioré est remplacé sans délai, sur simple demande. Le non-port constaté fait l'objet d'un rappel écrit, puis relève de l'échelle des sanctions du règlement intérieur. Consigne diffusée le " + plusJours(p, 6) + ". »")),
      ...aPers(["Les équipements réellement nécessaires, unité par unité",
        "Le circuit d'entretien et de remplacement",
        "Le rythme du contrôle du port et sa traçabilité"])],
  }),

  "SOC-SST-EXTERIEURES": p => ({
    titre: "Plan de prévention et protocole de sécurité",
    lignes: [...entete(p, "entreprises extérieures et opérations de chargement (R. 4512-6, R. 4515-4)"),
      h("1. Les règles"),
      puce("Au vu des informations et éléments recueillis au cours de l'inspection commune préalable, les chefs des entreprises utilisatrice et extérieures arrêtent d'un commun accord, avant le début des travaux, un plan de prévention définissant les mesures prises par chaque entreprise en vue de prévenir les risques pouvant résulter de l'interférence entre les activités, les installations et matériels (R. 4512-6). Ce plan est établi par écrit dans les cas que ce texte prévoit."),
      puce("Les opérations de chargement ou de déchargement font l'objet d'un document écrit, dit protocole de sécurité, échangé entre l'entreprise d'accueil et le transporteur (R. 4515-4)."),
      h("2. Inspection commune préalable (exemple)"),
      puce(`Date : ${ex(plusJours(p, 3))} — participants : ${ex("responsable de site, salarié compétent en prévention, chef de l'entreprise extérieure, un membre du comité social et économique")}.`),
      puce(`Périmètre reconnu : ${ex("atelier, quai nord, local technique, voies de circulation empruntées")}.`),
      puce(`Compte rendu écrit et signé : ${ex("annexé au plan de prévention")}.`),
      h("3. Plan de prévention — sommaire type"),
      puce(`Identification des entreprises, des travaux, des dates et des effectifs concernés : ${ex("réfection de la toiture du bâtiment B, du " + plusJours(p, 10) + " au " + plusJours(p, 40) + ", 4 intervenants")}.`),
      puce(`Risques d'interférence identifiés : ${ex("circulation d'engins sous la zone de travail, chute d'objets, coactivité avec le quai")}.`),
      puce(`Mesures arrêtées par chaque entreprise : ${ex("balisage de la zone au sol, interdiction de circulation sous nacelle, horaires décalés, consignation électrique")}.`),
      puce(`Organisation des secours et des alertes communes ; liste des travaux dangereux ; personnes chargées du suivi de chaque côté.`),
      h("4. Protocole de sécurité — sommaire type"),
      puce(`Renseignements de l'entreprise d'accueil : ${ex("consignes de sécurité du site, plan de circulation, lieu de livraison, matériels de manutention, moyens de secours")}.`),
      puce(`Renseignements du transporteur : ${ex("caractéristiques du véhicule, nature des marchandises, modalités de manutention")}.`),
      puce(`Protocole établi une fois pour les opérations à caractère répétitif : ${ex("protocole type signé avec les 6 transporteurs habituels, révision annuelle")}.`),
      ...aPers(["La liste des entreprises extérieures et des transporteurs concernés",
        "Les risques d'interférence propres à votre site",
        "Les mesures arrêtées et les personnes chargées du suivi"])],
  }),

  "SOC-SST-NUIT": p => ({
    titre: "Note de justification et suivi du travail de nuit",
    lignes: [...entete(p, "recours au travail de nuit (L. 3122-1, L. 3122-2)"),
      h("1. Les règles"),
      puce("Le recours au travail de nuit est exceptionnel. Il prend en compte les impératifs de protection de la santé et de la sécurité des travailleurs et est justifié par la nécessité d'assurer la continuité de l'activité économique ou des services d'utilité sociale (L. 3122-1)."),
      puce("Tout travail effectué au cours d'une période d'au moins neuf heures consécutives comprenant l'intervalle entre minuit et cinq heures est considéré comme du travail de nuit, dans les conditions de l'article L. 3122-2."),
      h("2. Justification écrite (exemple)"),
      par(ex("« L'activité de " + nomE(p) + " impose une exploitation nocturne : les tournées de distribution doivent être chargées entre 2 h et 5 h pour permettre la livraison des clients à l'ouverture. L'arrêt de cette plage entraînerait la rupture de la chaîne de livraison et la perte du service rendu. Le recours au travail de nuit est donc justifié par la nécessité d'assurer la continuité de l'activité économique. Cette justification est réexaminée chaque année. »")),
      h("3. Cadre collectif et périmètre"),
      puce(`Accord applicable : ${ex("à vérifier dans " + ccn(p) + " — cette application ne lit pas la convention collective")}. À défaut d'accord, l'autorisation de l'inspection du travail est requise dans les conditions prévues par les textes.`),
      puce(`Salariés concernés : ${ex("12 conducteurs et 4 agents de quai")} ; qualification de « travailleur de nuit » examinée individuellement selon la définition légale.`),
      puce(`Contreparties : ${ex("repos compensateur et majoration prévus par l'accord applicable — à vérifier sur le texte, non affirmés ici")}.`),
      h("4. Suivi et prévention"),
      puce(`Suivi individuel régulier de l'état de santé, organisé avec le service de prévention et de santé au travail : ${ex("liste transmise le " + plusJours(p, 5) + ", visites programmées")}.`),
      puce(`Mesures de prévention propres à la nuit : ${ex("éclairage renforcé des quais, pause allongée, encadrement présent, transport de retour organisé")}.`),
      puce(`Point annuel avec le comité social et économique : ${ex("réunion du " + plusJours(p, 60))}.`),
      ...aPers(["La justification réelle du recours, activité par activité",
        "L'accord ou l'autorisation qui fonde le cadre collectif",
        "Les contreparties applicables, lues dans le texte",
        "Le calendrier du suivi médical"])],
  }),

  "SOC-SST-JEUNES": p => ({
    titre: "Recensement des travaux confiés aux travailleurs de moins de dix-huit ans",
    lignes: [...entete(p, "jeunes travailleurs : travaux interdits et dérogations (L. 4153-8, L. 4153-9, R. 4153-40)"),
      h("1. Les règles"),
      puce("Il est interdit d'employer des travailleurs de moins de dix-huit ans à certaines catégories de travaux les exposant à des risques pour leur santé, leur sécurité, leur moralité ou excédant leurs forces (L. 4153-8)."),
      puce("Par dérogation, certains de ces travaux peuvent être accomplis par des jeunes en formation professionnelle, dans les conditions fixées par l'article L. 4153-9 et les textes pris pour son application."),
      puce("L'employeur ou le responsable de l'établissement mentionné à l'article L. 4111-1 peut affecter des jeunes aux travaux réglementés dans les conditions et sous les garanties de l'article R. 4153-40."),
      h("2. Recensement (exemple)"),
      par("Colonnes : jeune · âge · statut (apprenti, stagiaire, contrat) · unité · tâches réellement confiées · travail interdit ou réglementé · décision."),
      par(ex("MOREAU Louis — 17 ans — apprenti mécanicien — atelier — dépose de roues, vidanges, utilisation du pont élévateur — travail réglementé (utilisation d'équipements de levage) — dérogation à formaliser")),
      par(ex("PETIT Inès — 16 ans — stagiaire — quai — conduite d'un transpalette électrique autoporté — TRAVAIL RÉGLEMENTÉ, affectation suspendue le " + plusJours(p, 0) + " dans l'attente de la procédure")),
      h("3. La procédure de dérogation"),
      puce(`Évaluation des risques préalable, actualisée, couvrant le poste du jeune : ${ex("mise à jour du document unique du " + plusJours(p, -30))}.`),
      puce(`Avis médical d'aptitude délivré chaque année : ${ex("visites programmées le " + plusJours(p, 15))}.`),
      puce(`Information de l'agent de contrôle de l'inspection du travail, dans les formes et délais prévus par les textes : ${ex("courrier du " + plusJours(p, 10) + ", accusé conservé")}.`),
      puce(`Encadrement par une personne compétente et formation à la sécurité du poste : ${ex("tuteur désigné, formation d'une journée avant reprise du poste")}.`),
      h("4. Tenue"),
      puce(`Recensement revu à chaque arrivée et au moins ${ex("deux fois par an")} ; responsable : ${ex("le salarié compétent en prévention, avec les tuteurs")}.`),
      puce("Les tâches réellement confiées, et non celles du référentiel de formation, sont ce qui se recense : c'est l'écart entre les deux qui crée le risque."),
      ...aPers(["La liste réelle des jeunes accueillis et des tâches confiées",
        "Les avis médicaux et leur date de renouvellement",
        "La forme et le destinataire exacts de l'information à l'inspection du travail"])],
  }),

  "SOC-SST-LOCAUX": p => ({
    titre: "État des lieux des installations sanitaires et de restauration",
    lignes: [...entete(p, "sanitaires, vestiaires et restauration (R. 4228-10, R. 4228-19)"),
      h("1. Les règles"),
      puce("Il existe au moins un cabinet d'aisance et un urinoir pour vingt hommes et deux cabinets pour vingt femmes, dans les conditions fixées par l'article R. 4228-10 ; les cabinets d'aisance réservés aux femmes comportent un récipient pour garnitures périodiques."),
      puce("Il est interdit de laisser les travailleurs prendre leur repas dans les locaux affectés au travail (R. 4228-19). La mise à disposition d'un emplacement ou d'un local de restauration obéit aux conditions fixées par les textes, dont le seuil dépend du nombre de travailleurs souhaitant y prendre leur repas — vérifiez-le sur le texte applicable."),
      h("2. État des lieux (exemple)"),
      par("Colonnes : site · effectif · cabinets hommes · urinoirs · cabinets femmes · lavabos · vestiaires · état · écart constaté."),
      par(ex("Siège — 48 salariés dont 20 femmes — 2 cabinets hommes, 2 urinoirs, 2 cabinets femmes, 6 lavabos, vestiaires séparés — conforme")),
      par(ex("Plateforme — 62 salariés dont 12 femmes — 3 cabinets hommes, 3 urinoirs, 1 cabinet femmes — ÉCART : deux cabinets requis pour les femmes — travaux à programmer avant le " + plusJours(p, 90))),
      h("3. Restauration"),
      puce(`Nombre de salariés souhaitant prendre leur repas sur place : ${ex("recensé par sondage — 34 sur la plateforme, 12 au siège")}.`),
      puce(`Existant : ${ex("salle de pause de 24 m² équipée de deux micro-ondes, d'un réfrigérateur et de tables — insuffisante aux heures de pointe")}.`),
      puce(`Constat de repas pris au poste : ${ex("observé sur le quai — à faire cesser, avec la mise à disposition d'un emplacement conforme")}.`),
      h("4. Suites"),
      puce(`Consultation du comité social et économique sur les aménagements projetés : ${ex("réunion du " + plusJours(p, 30))}.`),
      puce(`Budget et calendrier : ${ex("28 000 €, travaux au troisième trimestre")} ; responsable : ${ex("services généraux")}.`),
      puce(`Propreté et entretien : ${ex("nettoyage quotidien, contrôle hebdomadaire tracé")}.`),
      ...aPers(["L'état des lieux réel, site par site",
        "Le nombre de salariés souhaitant se restaurer sur place",
        "Le seuil et les conditions applicables, vérifiés sur le texte",
        "Le budget et le calendrier des travaux"])],
  }),

  "SOC-SST-ECRAN": p => ({
    titre: "Information et suivi des postes de travail sur écran",
    lignes: [...entete(p, "travail sur écran de visualisation (R. 4542-16)"),
      h("1. La règle"),
      par("L'employeur assure l'information et la formation des travailleurs sur les modalités d'utilisation de l'écran et de l'équipement de travail dans lequel cet écran est intégré, dans les conditions de l'article R. 4542-16 : avant la première affectation à un travail sur écran de visualisation et à chaque modification importante du poste."),
      h("2. Recensement (exemple)"),
      puce(`Postes concernés : ${ex("22 postes — administration, exploitation, comptabilité, accueil")}.`),
      puce(`Durée quotidienne moyenne sur écran : ${ex("de 4 à 7 heures selon les postes")}.`),
      puce(`Postes en télétravail partiel : ${ex("6 — l'information porte aussi sur l'installation à domicile")}.`),
      h("3. Contenu de l'information"),
      puce(`Réglage du siège, de la hauteur de l'écran, de la distance et de l'éclairage : ${ex("fiche illustrée remise à chaque poste")}.`),
      puce(`Organisation de la journée : ${ex("interruption de la tâche sur écran par une autre activité toutes les deux heures, ou pause visuelle")}.`),
      puce(`Signes à signaler : ${ex("fatigue visuelle, céphalées, douleurs cervicales ou du poignet — qui prévenir et comment")}.`),
      puce(`Remise contre émargement, à l'affectation et à chaque modification importante : ${ex("dernière campagne le " + plusJours(p, -180))}.`),
      h("4. Examen des yeux et de la vue"),
      puce(`Sollicitation du service de prévention et de santé au travail : ${ex("courrier du " + plusJours(p, 5) + " demandant l'examen approprié pour les 22 salariés concernés")}.`),
      puce(`Suites : ${ex("prise en charge des dispositifs de correction spéciaux lorsque le médecin les préconise et que les textes le prévoient — à vérifier")}.`),
      puce(`Aménagements réalisés : ${ex("8 sièges ergonomiques, 12 supports d'écran, 4 souris verticales — budget 6 400 €")}.`),
      ...aPers(["Le recensement réel des postes sur écran",
        "Le contenu de la fiche d'information et sa remise",
        "La demande d'examen adressée à votre service de santé au travail"])],
  }),

  "SOC-SST-CHIMIQUE": p => ({
    titre: "Inventaire des produits chimiques et notice de poste",
    lignes: [...entete(p, "agents chimiques : information et notice de poste (R. 4412-38, R. 4412-39)"),
      h("1. Les règles"),
      puce("L'employeur veille à ce que les travailleurs ainsi que le comité social et économique reçoivent des informations sur les agents chimiques dangereux présents, dans les conditions de l'article R. 4412-38 : identification, risques, valeurs limites, précautions, accès aux fiches de données de sécurité."),
      puce("L'employeur établit une notice, dénommée notice de poste, pour chaque poste de travail ou situation de travail exposant les travailleurs à des agents chimiques dangereux (R. 4412-39). Elle les informe des risques encourus et des dispositions prises pour les éviter."),
      h("2. Inventaire (exemple)"),
      par("Colonnes : produit · unité · usage · quantité stockée · fiche de données de sécurité (date) · mentions de danger · substitution examinée."),
      par(ex("Dégraissant industriel — atelier — nettoyage des pièces — 40 L — fiche du " + plusJours(p, -400) + " — H315, H319 — substitution examinée : produit aqueux testé, à généraliser")),
      par(ex("Carburant gazole — cuve extérieure — approvisionnement de la flotte — 5 000 L — fiche du " + plusJours(p, -200) + " — H226, H351 — substitution : sans objet")),
      par(ex("Produit d'entretien sanitaires — services généraux — nettoyage — 20 L — FICHE MANQUANTE, à réclamer au fournisseur")),
      h("3. Notice de poste (exemple)"),
      par(ex("« Notice de poste — Nettoyage des pièces, atelier. Produit : dégraissant industriel. Risques : irritation cutanée et oculaire. Mesures collectives : aspiration à la source, local ventilé. Équipements individuels : gants nitrile, lunettes de protection. Interdictions : ne jamais transvaser dans un contenant non étiqueté ; ne jamais mélanger avec un autre produit. Conduite à tenir en cas de projection : rincer 15 minutes à l'eau, consulter, prévenir le chef d'équipe. Fiche de données de sécurité consultable au classeur du magasin et sur l'intranet. Établie après avis du médecin du travail du " + plusJours(p, -25) + ". »")),
      h("4. Suites"),
      puce(`Fiches manquantes réclamées aux fournisseurs : ${ex("3 relances envoyées le " + plusJours(p, 4))}.`),
      puce(`Risques chimiques reportés au document unique et, le cas échéant, à son annexe : ${ex("mise à jour du " + plusJours(p, 30))}.`),
      puce(`Information du comité social et économique : ${ex("point à l'ordre du jour du " + plusJours(p, 45))}.`),
      ...aPers(["L'inventaire réel de tous les produits, entretien compris",
        "Les notices de poste, établies après avis du médecin du travail",
        "Les relances aux fournisseurs pour les fiches manquantes"])],
  }),

  "SOC-SST-DUERP-ANNEXE": p => ({
    titre: "Annexe du document unique : données collectives d'exposition",
    lignes: [...entete(p, "annexe du document unique (R. 4121-1-1)"),
      h("1. La règle"),
      par("L'employeur consigne, en annexe du document unique, les données collectives utiles à l'évaluation des expositions individuelles aux facteurs de risques professionnels, ainsi que la proportion de salariés exposés au-delà des seuils, dans les conditions de l'article R. 4121-1-1. L'annexe est distincte du corps du document et se met à jour avec lui."),
      h("2. Tableau des données collectives (exemple)"),
      par("Colonnes : unité de travail · facteur de risque · mode de mesure ou d'estimation · effectif de l'unité · effectif exposé au-delà du seuil · proportion · période de référence."),
      ...secteurProfil(p).unites.slice(0, 3).map(u => par(ex(u[0] + " — facteur identifié à partir des risques suivants : " + u[1] + " — estimation fondée sur les plannings et les mesures d'ambiance — effectif de l'unité et effectif exposé à renseigner sur vos données"))),
      par(ex("Quai et entrepôt — travail de nuit — plannings de l'exercice — 62 salariés — 16 exposés au-delà du seuil — 25,8 % — période du 1er janvier au 31 décembre")),
      h("3. Concordance avec les déclarations sociales"),
      puce(`Rapprochement fait le ${ex(plusJours(p, -15))} entre l'annexe et les déclarations : ${ex("écart de 2 salariés sur le facteur « travail de nuit », corrigé")}.`),
      puce("Un écart entre l'annexe et la déclaration se remarque : traitez-le avant qu'il ne soit relevé."),
      h("4. Tenue"),
      puce(`Mise à jour à chaque mise à jour du document unique, et au moins ${ex("chaque année")} ; responsable : ${ex("le salarié compétent en prévention, avec la paie")}.`),
      puce(`Présentation au comité social et économique en même temps que le document unique : ${ex("réunion du " + plusJours(p, 40))}.`),
      puce(`Conservation avec le document unique et ses versions antérieures, dans les mêmes conditions.`),
      ...aPers(["Les facteurs de risques réellement présents, unité par unité",
        "Les effectifs exposés et la proportion, calculés sur vos données",
        "Le rapprochement avec vos déclarations sociales"])],
  }),

  /* ─────────────────── formation et entretiens (suite) ──────────────── */

  "SOC-FOR-CONTRIBUTION": p => ({
    titre: "Note de contrôle des contributions formation et alternance",
    lignes: [...entete(p, "contribution au développement de la formation et de l'alternance (L. 6131-1)"),
      h("1. La règle"),
      par("Les employeurs concourent au développement de la formation professionnelle et de l'alternance, notamment par le financement direct d'actions et par le versement des contributions prévues par l'article L. 6131-1. Les taux et les assiettes varient selon l'effectif et la nature des contrats : ils se vérifient chaque année."),
      h("2. Effectif retenu (exemple)"),
      puce(`Effectif déclaré à l'audit : ${eff(p)} salariés.`),
      puce(`Effectif retenu pour les contributions : ${ex("calculé selon les règles de décompte propres à chaque contribution — à confirmer avec l'expert-comptable")}.`),
      puce(`Franchissement de seuil dans l'année : ${ex("non")} — un franchissement modifie les taux et se signale.`),
      h("3. Contrôle des versements (exemple)"),
      par("Colonnes : période · assiette déclarée · taux appliqué · montant versé · date · écart constaté."),
      par(ex("Janvier à juin — masse salariale 1 240 000 € — taux appliqués selon la déclaration sociale nominative — versé mensuellement — aucun écart")),
      par(ex("Exercice précédent — REGULARISATION : 3 apprentis non intégrés à l'assiette, incidence 1 850 € — corrigée sur la déclaration du " + plusJours(p, 30))),
      h("4. Suites"),
      puce(`Revue annuelle avec l'expert-comptable, avant la clôture : ${ex("prévue le " + plusJours(p, 60))}.`),
      puce(`Conservation des justificatifs de versement et des dépenses de formation imputables : ${ex("dossier « formation » de l'exercice")}.`),
      puce(`Articulation avec le plan de développement des compétences et, lorsqu'un comité existe, avec sa consultation sur la formation.`),
      ...aPers(["L'effectif retenu pour chaque contribution",
        "Les taux et assiettes applicables à votre situation",
        "Les écarts constatés et leur régularisation"])],
  }),

  "SOC-FOR-ABONDEMENT": p => ({
    titre: "État des lieux récapitulatif à six ans et abondement correctif",
    lignes: [...entete(p, "abondement correctif du compte personnel de formation (L. 6323-13)"),
      h("1. La règle"),
      par(`Dans les entreprises d'au moins cinquante salariés, lorsque le salarié n'a pas bénéficié des entretiens prévus et d'au moins une formation autre que celle qui conditionne l'exercice de son activité, son compte personnel de formation est abondé dans les conditions de l'article L. 6323-13. L'effectif déclaré de ${nomE(p)} est de ${eff(p)} salariés.`),
      h("2. Recensement des échéances (exemple)"),
      par("Colonnes : salarié · date d'entrée · échéance des six ans · entretiens tenus (dates) · formation non obligatoire suivie · abondement dû."),
      par(ex("MARTIN Camille — entrée le 12/09/2020 — échéance 12/09/2026 — entretiens : 2021, 2023, 2025 — formation « conduite de réunion » en 2024 — abondement non dû")),
      par(ex("LEROY Sacha — entrée le 03/03/2020 — échéance 03/03/2026 — entretiens : 2022 seulement — aucune formation hors habilitations obligatoires — ABONDEMENT DÛ")),
      h("3. L'état des lieux écrit"),
      par(ex("« État des lieux récapitulatif du parcours professionnel de Monsieur Sacha LEROY, au terme de six années de présence. Entretiens professionnels tenus : un seul, le 14/04/2022. Formations suivies : renouvellement des habilitations électriques (2021, 2024) — formations conditionnant l'exercice de l'activité. Progression salariale ou professionnelle : passage au coefficient 140 en 2023. Certification obtenue : aucune. Conclusion : les conditions de l'article L. 6323-13 ne sont pas remplies ; un abondement correctif est dû. Copie remise au salarié le " + plusJours(p, 10) + ". »")),
      h("4. Suites"),
      puce(`Abondement déclaré et versé : ${ex("2 salariés concernés, déclaration du " + plusJours(p, 20) + ", avec l'expert-comptable")}.`),
      puce(`Prévention : ${ex("alerte automatique posée à 5 ans et 6 mois de présence, pour tenir les entretiens avant l'échéance")}.`),
      puce(`Rattrapage du cycle d'entretiens : ${ex("12 entretiens programmés au dernier trimestre")}.`),
      ...aPers(["Les dates d'entrée et les échéances réelles",
        "La liste des entretiens tenus et des formations suivies",
        "Le calcul et la déclaration de l'abondement, avec votre expert-comptable"])],
  }),

  /* ────────────────────────────── instances (suite) ─────────────────── */

  "SOC-INS-SECTION-SYNDICALE": p => ({
    titre: "Note de mise à disposition des moyens de la section syndicale",
    lignes: [...entete(p, "moyens de la section syndicale (L. 2142-3, L. 2142-4, L. 2142-8)"),
      h("1. Les règles"),
      puce("L'affichage des communications syndicales s'effectue librement sur des panneaux réservés à cet usage, distincts de ceux affectés aux communications des délégués du personnel et du comité social et économique ; un exemplaire des communications est transmis à l'employeur simultanément à l'affichage (L. 2142-3)."),
      puce("Les publications et tracts de nature syndicale peuvent être librement diffusés aux travailleurs de l'entreprise dans l'enceinte de celle-ci, aux heures d'entrée et de sortie du travail (L. 2142-4)."),
      puce("Dans les entreprises ou établissements d'au moins deux cents salariés, l'employeur met à la disposition des sections syndicales un local commun ; dans ceux d'au moins mille salariés, un local convenable, aménagé et doté du matériel nécessaire à leur fonctionnement, à la disposition de chaque section syndicale d'organisation représentative (L. 2142-8)."),
      h("2. Ce qui est mis à disposition (exemple)"),
      puce(`Panneaux : ${ex("un panneau par organisation représentative, format A0, hall d'accueil et salle de pause de la plateforme — distincts de ceux du comité")}.`),
      puce(`Local : ${ex("selon l'effectif de " + eff(p) + " salariés — local commun de 18 m², bâtiment A, équipé d'une table, de six chaises, d'une armoire fermant à clé, d'un poste informatique et d'une ligne téléphonique")}.`),
      puce(`Accès : ${ex("clé remise à chaque délégué syndical, accès libre pendant les heures d'ouverture du site")}.`),
      puce(`Diffusion des tracts : ${ex("aux heures d'entrée et de sortie, aux trois accès du site — aucune autorisation préalable n'est requise")}.`),
      h("3. Texte de la note"),
      par(ex("« " + nomE(p) + " met à la disposition des sections syndicales, à compter du " + plusJours(p, 10) + " : des panneaux d'affichage réservés, distincts de ceux du comité social et économique, dans le hall d'accueil et la salle de pause ; un local commun situé bâtiment A, aménagé et doté du matériel nécessaire. La diffusion des publications et tracts s'effectue librement dans l'enceinte de l'entreprise aux heures d'entrée et de sortie du travail. Fait le " + plusJours(p, 5) + ". »")),
      h("4. Traces"),
      puce(`Note remise à chaque délégué syndical contre récépissé, et copie au dossier « relations sociales ».`),
      puce(`Un exemplaire des communications affichées est transmis à l'employeur simultanément à l'affichage : ${ex("boîte aux lettres dédiée à la direction")}.`),
      ...aPers(["Le nombre et l'emplacement réels des panneaux",
        "Le local affecté, sa surface et son équipement, selon votre effectif",
        "Les modalités d'accès convenues avec les délégués syndicaux"])],
  }),

  "SOC-INS-PROTEGES": p => ({
    titre: "Liste des salariés protégés et procédure d'autorisation préalable",
    lignes: [...entete(p, "protection des représentants du personnel (L. 2411-3)"),
      h("1. La règle"),
      par("Le licenciement d'un délégué syndical ne peut intervenir qu'après autorisation de l'inspecteur du travail (L. 2411-3). La même exigence, dans les conditions qui leur sont propres, protège les autres représentants du personnel : l'audit détaillé se fait dans le module « comité social et économique »."),
      h("2. La liste (exemple)"),
      par("Colonnes : salarié · mandat · date de désignation ou d'élection · fin de mandat · fin de la période de protection · observations."),
      par(ex("COSTA Ana — déléguée syndicale — désignée le 12/02/2025 — mandat en cours — protection en cours")),
      par(ex("DURAND Pierre — ancien membre titulaire du comité — mandat expiré le 30/06/2025 — protection prolongée après la fin du mandat, durée à vérifier au cas par cas")),
      par(ex("LEROY Sacha — candidat non élu aux dernières élections — protection à durée limitée après le scrutin, à vérifier")),
      h("3. La procédure interne"),
      puce(`Contrôle obligatoire de la liste avant TOUTE rupture, quelle qu'en soit la forme : ${ex("licenciement, rupture conventionnelle, rupture de période d'essai, non-renouvellement d'un contrat à durée déterminée, transfert")}.`),
      puce(`Visa du responsable des ressources humaines attestant du contrôle : ${ex("case obligatoire du formulaire interne de rupture")}.`),
      puce(`En cas de mandat : consultation du comité lorsqu'elle est requise, puis demande motivée d'autorisation à l'inspecteur du travail, avec l'assistance de votre conseil.`),
      h("4. Tenue de la liste"),
      puce(`Mise à jour à chaque élection, désignation, démission ou fin de mandat : ${ex("responsable — Camille MARTIN, mise à jour du " + plusJours(p, -5))}.`),
      puce("Les durées de protection après la fin d'un mandat ne sont pas affirmées ici : elles se vérifient au cas par cas avec votre conseil."),
      ...aPers(["La liste réelle des mandats, anciens mandats et candidatures",
        "Les durées de protection applicables, vérifiées au cas par cas",
        "Le point de contrôle inséré dans votre processus de rupture"]),
      noteFin("l'audit complet de la protection des élus se fait dans le module « comité social et économique » (audit-cse.html).")],
  }),

  /* ───────────────────────────── négociations (suite) ───────────────── */

  "SOC-NEG-DECONNEXION": p => ({
    titre: "Charte du droit à la déconnexion et sa mise en négociation",
    lignes: [...entete(p, "droit à la déconnexion (L. 2242-17)"),
      h("1. La règle"),
      par("La négociation obligatoire porte notamment sur les modalités du plein exercice par le salarié de son droit à la déconnexion et sur la mise en place par l'entreprise de dispositifs de régulation de l'utilisation des outils numériques, en vue d'assurer le respect des temps de repos et de congé ainsi que de la vie personnelle et familiale. À défaut d'accord, l'employeur élabore une charte, après avis du comité social et économique, définissant ces modalités et prévoyant la mise en œuvre d'actions de formation et de sensibilisation à un usage raisonnable des outils numériques (L. 2242-17)."),
      h("2. État des lieux (exemple)"),
      puce(`Thème porté à la négociation : ${ex("oui, réunion du " + plusJours(p, -60) + " — sans accord à ce jour")}.`),
      puce(`Pratiques constatées : ${ex("courriels envoyés après 21 h par l'encadrement, notifications actives sur les téléphones professionnels le week-end")}.`),
      puce(`Populations les plus exposées : ${ex("cadres au forfait en jours et encadrement d'exploitation")}.`),
      h("3. Texte de la charte (exemple)"),
      par(ex("« Article 1 — Plages de déconnexion. Aucun salarié n'est tenu de répondre à un courriel, un message ou un appel professionnel entre 20 h et 7 h, ni pendant ses repos hebdomadaires et ses congés. Article 2 — Envois différés. L'encadrement utilise l'envoi différé pour tout message rédigé en dehors de ces plages. Article 3 — Astreintes. Seules les astreintes formalisées dérogent au présent article ; elles sont rémunérées comme telles. Article 4 — Réunions. Aucune réunion n'est programmée avant 8 h 30 ni après 18 h. Article 5 — Absences. Un message d'absence indiquant l'interlocuteur de remplacement est activé à chaque congé. Article 6 — Suivi. Un point annuel est fait avec le comité social et économique. Charte élaborée après avis du comité du " + plusJours(p, 20) + ". »")),
      h("4. Formation et sensibilisation"),
      puce(`Encadrement et direction : ${ex("session d'une demi-journée sur la charge de travail et l'usage des outils, le " + plusJours(p, 50))}.`),
      puce(`Ensemble des salariés : ${ex("note d'information et rappel annuel")}.`),
      puce(`Articulation avec le forfait annuel en jours : la charte est un élément du suivi de la charge de travail.`),
      ...aPers(["L'état réel de la négociation sur ce thème",
        "Les plages et règles retenues, adaptées à votre activité",
        "La date d'avis du comité et le programme de sensibilisation"]),
      noteFin("l'audit complet de la négociation obligatoire se fait dans le module « négociation obligatoire (NAO) » (audit-nao.html).")],
  }),

  "SOC-NEG-PARTAGE-VALEUR": p => ({
    titre: "Ouverture de la négociation sur l'augmentation exceptionnelle du bénéfice",
    lignes: [...entete(p, "conséquences d'une augmentation exceptionnelle du bénéfice (L. 3346-1)"),
      h("1. La règle"),
      par("Lorsqu'une entreprise qui est tenue de mettre en place un régime de participation dispose d'un ou plusieurs délégués syndicaux, elle engage une négociation sur la définition d'une augmentation exceptionnelle de son bénéfice et sur les conséquences à en tirer pour les salariés, dans les conditions de l'article L. 3346-1."),
      h("2. Vérification préalable (exemple)"),
      puce(`Entreprise tenue de mettre en place un régime de participation : ${ex("oui — effectif de " + eff(p) + " salariés, condition de durée vérifiée avec l'expert-comptable")}.`),
      puce(`Délégués syndicaux présents : ${ex("deux — A. COSTA et P. DURAND")}.`),
      puce(`Négociation déjà engagée : ${ex("non — à ouvrir")}.`),
      h("3. Lettre d'invitation à négocier"),
      par(ex("« Mesdames, Messieurs les délégués syndicaux, " + nomE(p) + " vous invite à ouvrir la négociation prévue à l'article L. 3346-1 du code du travail, portant sur la définition d'une augmentation exceptionnelle de son bénéfice et sur les conséquences à en tirer pour les salariés. Une première réunion se tiendra le " + plusJours(p, 21) + " à 14 heures, au siège. Les informations suivantes vous seront remises au plus tard huit jours avant : comptes des trois derniers exercices, résultat net et son évolution, éléments de contexte du secteur, données de la participation et de l'intéressement en vigueur. Fait le " + plusJours(p, 5) + ". »")),
      h("4. Points à traiter et sortie"),
      puce(`Définition retenue de l'augmentation exceptionnelle : ${ex("critère chiffré, par exemple un résultat net supérieur d'un pourcentage défini à la moyenne des trois exercices précédents — à négocier, rien n'est imposé ici")}.`),
      puce(`Conséquences envisagées : ${ex("supplément de participation ou d'intéressement, abondement d'un plan d'épargne, prime de partage de la valeur — le choix appartient à la négociation")}.`),
      puce(`Sortie : accord signé et déposé, ou procès-verbal de désaccord consignant les dernières propositions de chaque partie.`),
      puce(`Calendrier retenu : ${ex("trois réunions, les " + plusJours(p, 21) + ", " + plusJours(p, 42) + " et " + plusJours(p, 63))}.`),
      ...aPers(["La vérification que l'entreprise est tenue de mettre en place la participation",
        "Les délégués syndicaux réellement présents",
        "Les informations remises et le calendrier des réunions"]),
      noteFin("l'audit complet de la négociation obligatoire se fait dans le module « négociation obligatoire (NAO) » (audit-nao.html).")],
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

/* Les neuf questions ajoutées avec les matières venues de l'audit voisin :
   durée du travail, contrats courts, santé au travail au poste. Chacune
   commande des obligations qui, sans elle, resteraient indéterminées — le
   référentiel ne suppose jamais qu'une situation existe ou n'existe pas. */
q("heuresSupplementaires", "Des heures supplémentaires sont-elles accomplies ?", "oui / non",
  "Elles ouvrent le contingent annuel et, au-delà, la contrepartie obligatoire en repos (L. 3121-30, L. 3121-33, D. 3121-24, L. 3121-38).");
q("forfaitJours", "Des salariés sont-ils soumis à un forfait annuel en jours ?", "oui / non",
  "Le forfait suppose un accord collectif, une convention individuelle écrite, un document de contrôle des journées et un suivi de la charge de travail (L. 3121-64, L. 3121-65, L. 3121-60). Sans accord conforme, il est privé d'effet.");
q("tempsPartiel", "L'entreprise emploie-t-elle des salariés à temps partiel ?", "oui / non",
  "Le temps partiel appelle un contrat écrit portant la durée et sa répartition, une durée minimale, la majoration de toutes les heures complémentaires et une priorité d'accès aux emplois à temps complet.");
q("contratsCourts", "L'entreprise recourt-elle à des contrats à durée déterminée, à l'intérim ou à des stagiaires ?", "oui / non",
  "Les contrats courts appellent l'écrit et son motif précis, le délai de transmission, le délai de carence, l'indemnité de fin de contrat — et, sur les postes à risques, une formation renforcée à la sécurité.");
q("travailNuit", "Des salariés travaillent-ils la nuit ?", "oui / non",
  "Le recours au travail de nuit est exceptionnel et justifié ; il suppose un accord ou une autorisation, des contreparties et un suivi médical régulier (L. 3122-1, L. 3122-2).");
q("jeunesTravailleurs", "L'entreprise emploie-t-elle ou accueille-t-elle des travailleurs de moins de dix-huit ans (apprentis, stagiaires, jeunes en contrat) ?", "oui / non",
  "Certains travaux leur sont interdits, et toute dérogation suit une procédure encadrée (L. 4153-8, L. 4153-9, R. 4153-40).");
q("entreprisesExterieures", "Des entreprises extérieures interviennent-elles dans vos locaux, ou des opérations de chargement ou de déchargement y sont-elles réalisées par un transporteur ?", "oui / non",
  "L'inspection commune préalable et le plan de prévention écrit sont dus (R. 4512-6) ; les opérations de chargement ou de déchargement font l'objet d'un protocole de sécurité (R. 4515-4).");
q("postesEcran", "Des salariés travaillent-ils habituellement sur écran de visualisation ?", "oui / non",
  "L'information et la formation à l'utilisation du poste sont dues avant la première affectation et à chaque modification importante (R. 4542-16), avec un examen approprié des yeux et de la vue.");
q("agentsChimiques", "Des agents chimiques dangereux (produits d'entretien industriels, solvants, carburants, peintures, gaz) sont-ils utilisés ou stockés ?", "oui / non",
  "Ils appellent les fiches de données de sécurité, l'information des travailleurs et du comité (R. 4412-38) et une notice de poste par situation de travail exposante (R. 4412-39). Les produits d'entretien en relèvent souvent : ne répondez « non » qu'après vérification.");

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
 },
 "L3121-18": {
  "id": "LEGIARTI000033020428",
  "date": "2026-08-23",
  "texte": "La durée quotidienne de travail effectif par salarié ne peut excéder dix heures, sauf : 1° En cas de dérogation accordée par l'inspecteur du travail dans des conditions déterminées par décret ; 2° En cas d'urgence, dans des conditions déterminées par décret ; 3° Dans les cas prévus à l'article L. 3121-19 ."
 },
 "L3121-20": {
  "id": "LEGIARTI000033020414",
  "date": "2026-08-23",
  "texte": "Au cours d'une même semaine, la durée maximale hebdomadaire de travail est de quarante-huit heures."
 },
 "L3121-22": {
  "id": "LEGIARTI000033020402",
  "date": "2026-08-23",
  "texte": "La durée hebdomadaire de travail calculée sur une période quelconque de douze semaines consécutives ne peut dépasser quarante-quatre heures, sauf dans les cas prévus aux articles L. 3121-23 à L. 3121-25 ."
 },
 "L3121-16": {
  "id": "LEGIARTI000033020444",
  "date": "2026-08-23",
  "texte": "Dès que le temps de travail quotidien atteint six heures, le salarié bénéficie d'un temps de pause d'une durée minimale de vingt minutes consécutives."
 },
 "L3131-1": {
  "id": "LEGIARTI000033020918",
  "date": "2026-08-23",
  "texte": "Tout salarié bénéficie d'un repos quotidien d'une durée minimale de onze heures consécutives, sauf dans les cas prévus aux articles L. 3131-2 et L. 3131-3 ou en cas d'urgence, dans des conditions déterminées par décret."
 },
 "L3132-1": {
  "id": "LEGIARTI000006902580",
  "date": "2026-08-23",
  "texte": "Il est interdit de faire travailler un même salarié plus de six jours par semaine."
 },
 "L3121-30": {
  "id": "LEGIARTI000033020367",
  "date": "2026-08-23",
  "texte": "Des heures supplémentaires peuvent être accomplies dans la limite d'un contingent annuel. Les heures effectuées au delà de ce contingent annuel ouvrent droit à une contrepartie obligatoire sous forme de repos. Les heures prises en compte pour le calcul du contingent annuel d'heures supplémentaires sont celles accomplies au delà de la durée légale. Les heures supplémentaires ouvrant droit au repos compensateur équivalent mentionné à l'article L. 3121-28 et celles accomplies dans les cas de travaux urgents énumérés à l'article L. 3132-4 ne s'imputent pas sur le contingent annuel d'heures supplémentaires."
 },
 "L3121-33": {
  "id": "LEGIARTI000038610166",
  "date": "2026-08-23",
  "texte": "I.-Une convention ou un accord collectif d'entreprise ou d'établissement ou, à défaut, une convention ou un accord de branche : 1° Prévoit le ou les taux de majoration des heures supplémentaires accomplies au-delà de la durée légale ou de la durée considérée comme équivalente. Ce taux ne peut être inférieur à 10 % ; 2° Définit le contingent annuel prévu à l'article L. 3121-30 ; 3° Fixe l'ensemble des conditions d'accomplissement d'heures supplémentaires au-delà du contingent annuel ainsi que la durée, les caractéristiques et les conditions de prise de la contrepartie obligatoire sous forme de repos prévue au même article L. 3121-30. Cette contrepartie obligatoire ne peut être inférieure à 50 % des heures supplémentaires accomplies au-delà du contingent annuel mentionné audit article L. 3121-30 pour les entreprises de vingt salariés au plus, et à 100 % de ces mêmes heures pour les entreprises de plus de vingt salariés. L'effectif salarié et le franchissement du seuil de vingt salariés sont déterminés selon les modalités prévues à l'article L. 130-1 du code de la sécurité sociale . Les heures supplémentaires sont accomplies, dans la limite du contingent annuel applicable dans l'entreprise, après information du comité social et économique. Les heures supplémentaires sont accomplies, au-delà du contingent annuel applicable dans l'entreprise, après avis du comité social et économique. II.-Une convention ou un accord collectif d'entreprise ou d'établissement ou, à défaut, une convention ou un accord de branche peut également : 1° Prévoir qu'une contrepartie sous forme de repos est accordée au titre des heures supplémentaires accomplies dans la limite du contingent ; 2° Prévoir le remplacement de tout ou partie du paiement des heures supplémentaires, ainsi que des majorations, par un repos compensateur équivalent. III.-Une convention ou un accord d'entreprise peut adapter les conditions et les modalités d'attribution et de prise du repos compensateur de remplacement."
 },
 "D3121-24": {
  "id": "LEGIARTI000033509251",
  "date": "2026-08-23",
  "texte": "A défaut d'accord prévu au I de l'article L. 3121-33 , le contingent annuel d'heures supplémentaires est fixé à deux cent vingt heures par salarié. Le premier alinéa ne s'applique pas aux salariés mentionnés à l'article L. 3121-56 qui ont conclu une convention de forfait en heures sur l'année."
 },
 "L3121-65": {
  "id": "LEGIARTI000036262800",
  "date": "2026-08-23",
  "texte": "I.-A défaut de stipulations conventionnelles prévues aux 1° et 2° du II de l'article L. 3121-64 , une convention individuelle de forfait en jours peut être valablement conclue sous réserve du respect des dispositions suivantes : 1° L'employeur établit un document de contrôle faisant apparaître le nombre et la date des journées ou demi-journées travaillées. Sous la responsabilité de l'employeur, ce document peut être renseigné par le salarié ; 2° L'employeur s'assure que la charge de travail du salarié est compatible avec le respect des temps de repos quotidiens et hebdomadaires ; 3° L'employeur organise une fois par an un entretien avec le salarié pour évoquer sa charge de travail, qui doit être raisonnable, l'organisation de son travail, l'articulation entre son activité professionnelle et sa vie personnelle ainsi que sa rémunération. II.-A défaut de stipulations conventionnelles prévues au 3° du II de l'article L. 3121-64, les modalités d'exercice par le salarié de son droit à la déconnexion sont définies par l'employeur et communiquées par tout moyen aux salariés concernés. Dans les entreprises d'au moins cinquante salariés, ces modalités sont conformes à la charte mentionnée au 7° de l'article L. 2242-17 ."
 },
 "L3121-60": {
  "id": "LEGIARTI000033003246",
  "date": "2026-08-23",
  "texte": "L'employeur s'assure régulièrement que la charge de travail du salarié est raisonnable et permet une bonne répartition dans le temps de son travail."
 },
 "D3171-16": {
  "id": "LEGIARTI000033515983",
  "date": "2026-08-23",
  "texte": "L'employeur tient à la disposition de l'inspection du travail : 1° Pendant une durée d'un an, y compris dans le cas d'horaires individualisés, ou pendant une durée équivalente à la période de référence en cas d'aménagement du temps de travail sur une période supérieure à l'année, les documents existant dans l'entreprise ou l'établissement permettant de comptabiliser les heures de travail accomplies par chaque salarié ; 2° Pendant une durée d'un an, le document récapitulant le nombre d'heures d'astreinte accompli chaque mois par le salarié ainsi que la compensation correspondante ; 3° Pendant une durée de trois ans, les documents existant dans l'entreprise ou l'établissement permettant de comptabiliser le nombre de jours de travail accomplis par les salariés intéressés par des conventions de forfait."
 },
 "L3123-6": {
  "id": "LEGIARTI000033020080",
  "date": "2026-08-23",
  "texte": "Le contrat de travail du salarié à temps partiel est un contrat écrit. Il mentionne : 1° La qualification du salarié, les éléments de la rémunération, la durée hebdomadaire ou mensuelle prévue et, sauf pour les salariés des associations et entreprises d'aide à domicile et les salariés relevant d'un accord collectif conclu en application de l'article L. 3121-44 , la répartition de la durée du travail entre les jours de la semaine ou les semaines du mois ; 2° Les cas dans lesquels une modification éventuelle de cette répartition peut intervenir ainsi que la nature de cette modification ; 3° Les modalités selon lesquelles les horaires de travail pour chaque journée travaillée sont communiqués par écrit au salarié. Dans les associations et entreprises d'aide à domicile, les horaires de travail sont communiqués par écrit chaque mois au salarié ; 4° Les limites dans lesquelles peuvent être accomplies des heures complémentaires au delà de la durée de travail fixée par le contrat. L'avenant au contrat de travail prévu à l'article L. 3123-22 mentionne les modalités selon lesquelles des compléments d'heures peuvent être accomplis au delà de la durée fixée par le contrat."
 },
 "L3123-8": {
  "id": "LEGIARTI000033020061",
  "date": "2026-08-23",
  "texte": "Chacune des heures complémentaires accomplies donne lieu à une majoration de salaire."
 },
 "L3123-7": {
  "id": "LEGIARTI000047453545",
  "date": "2026-08-23",
  "texte": "Le salarié à temps partiel bénéficie d'une durée minimale de travail hebdomadaire déterminée selon les modalités fixées aux articles L. 3123-19 et L. 3123-27 . Le premier alinéa du présent article n'est pas applicable : 1° Aux contrats d'une durée au plus égale à sept jours ; 2° Aux contrats à durée déterminée conclus au titre du 1° de l'article L. 1242-2 ; 3° Aux contrats de travail temporaire conclus au titre du 1° de l'article L. 1251-6 pour le remplacement d'un salarié absent. 4° Aux contrats de travail à durée indéterminée conclus dans le cadre d'un cumul avec l'un des contrats prévus aux articles L. 5132-5 , L. 5132-11-1 ou L. 5132-15-1 , afin d'atteindre une durée globale d'activité correspondant à un temps plein ou au moins égale à la durée mentionnée à l'article L. 3123-27. Une durée de travail inférieure à celle prévue au premier alinéa du présent article peut être fixée à la demande du salarié soit pour lui permettre de faire face à des contraintes personnelles, soit pour lui permettre de cumuler plusieurs activités afin d'atteindre une durée globale d'activité correspondant à un temps plein ou au moins égale à la durée mentionnée au même premier alinéa. Cette demande est écrite et motivée. Une durée de travail inférieure à celle prévue audit premier alinéa peut être fixée, à sa demande, au bénéfice du salarié ayant atteint l'âge prévu au premier alinéa de l' article L. 161-22-1-5 du code de la sécurité sociale . Une durée de travail inférieure à celle prévue au premier alinéa, compatible avec ses études, est fixée de droit, à sa demande, au bénéfice du salarié âgé de moins de vingt-six ans poursuivant ses études."
 },
 "L3123-27": {
  "id": "LEGIARTI000033019953",
  "date": "2026-08-23",
  "texte": "A défaut d'accord prévu à l'article L. 3123-19 , la durée minimale de travail du salarié à temps partiel est fixée à vingt-quatre heures par semaine ou, le cas échéant, à l'équivalent mensuel de cette durée ou à l'équivalent calculé sur la période prévue par un accord collectif conclu en application de l'article L. 3121-44 ."
 },
 "L3123-3": {
  "id": "LEGIARTI000036262948",
  "date": "2026-08-23",
  "texte": "Les salariés à temps partiel qui souhaitent occuper ou reprendre un emploi d'une durée au moins égale à celle mentionnée au premier alinéa de l'article L. 3123-7 ou un emploi à temps complet et les salariés à temps complet qui souhaitent occuper ou reprendre un emploi à temps partiel dans le même établissement ou, à défaut, dans la même entreprise ont priorité pour l'attribution d'un emploi ressortissant à leur catégorie professionnelle ou d'un emploi équivalent ou, si une convention ou un accord d'entreprise ou d'établissement ou, à défaut, une convention ou un accord de branche étendu le prévoit, d'un emploi présentant des caractéristiques différentes. L'employeur porte à la connaissance de ces salariés la liste des emplois disponibles correspondants."
 },
 "L3141-3": {
  "id": "LEGIARTI000033020826",
  "date": "2026-08-23",
  "texte": "Le salarié a droit à un congé de deux jours et demi ouvrables par mois de travail effectif chez le même employeur. La durée totale du congé exigible ne peut excéder trente jours ouvrables."
 },
 "L3141-13": {
  "id": "LEGIARTI000033020772",
  "date": "2026-08-23",
  "texte": "Les congés sont pris dans une période qui comprend dans tous les cas la période du 1er mai au 31 octobre de chaque année."
 },
 "L3141-15": {
  "id": "LEGIARTI000033020765",
  "date": "2026-08-23",
  "texte": "Un accord d'entreprise ou d'établissement ou, à défaut, une convention ou un accord de branche fixe : 1° La période de prise des congés ; 2° L'ordre des départs pendant cette période ; 3° Les délais que doit respecter l'employeur s'il entend modifier l'ordre et les dates de départs."
 },
 "L3141-16": {
  "id": "LEGIARTI000035652687",
  "date": "2026-08-23",
  "texte": "A défaut de stipulation dans la convention ou l'accord conclus en application de l'article L. 3141-15 , l'employeur : 1° Définit après avis, le cas échéant, du comité social et économique : a) La période de prise des congés ; b) L'ordre des départs, en tenant compte des critères suivants : -la situation de famille des bénéficiaires, notamment les possibilités de congé, dans le secteur privé ou la fonction publique, du conjoint ou du partenaire lié par un pacte civil de solidarité, ainsi que la présence au sein du foyer d'un enfant ou d'un adulte handicapé ou d'une personne âgée en perte d'autonomie ; -la durée de leurs services chez l'employeur ; -leur activité chez un ou plusieurs autres employeurs ; 2° Ne peut, sauf en cas de circonstances exceptionnelles, modifier l'ordre et les dates de départ moins d'un mois avant la date de départ prévue."
 },
 "D3141-5": {
  "id": "LEGIARTI000033515945",
  "date": "2026-08-23",
  "texte": "La période de prise des congés payés est portée par l'employeur à la connaissance des salariés au moins deux mois avant l'ouverture de cette période."
 },
 "D3141-6": {
  "id": "LEGIARTI000033515942",
  "date": "2026-08-23",
  "texte": "L'ordre des départs en congé est communiqué, par tout moyen, à chaque salarié un mois avant son départ."
 },
 "L3133-7": {
  "id": "LEGIARTI000033020869",
  "date": "2026-08-23",
  "texte": "La journée de solidarité instituée en vue d'assurer le financement des actions en faveur de l'autonomie des personnes âgées ou handicapées prend la forme : 1° D'une journée supplémentaire de travail non rémunérée pour les salariés ; 2° De la contribution prévue au 1° de l'article L. 14-10-4 du code de l'action sociale et des familles pour les employeurs."
 },
 "L3133-8": {
  "id": "LEGIARTI000033020862",
  "date": "2026-08-23",
  "texte": "Le travail accompli, dans la limite de sept heures, durant la journée de solidarité ne donne pas lieu à rémunération : 1° Pour les salariés mensualisés, dans cette limite de sept heures ; 2° Pour les salariés dont la rémunération est calculée par référence à un nombre annuel de jours de travail conformément à l'article L. 3121-58 , dans la limite de la valeur d'une journée de travail. Pour les salariés à temps partiel, la limite de sept heures prévue au 1° du présent article est réduite proportionnellement à la durée contractuelle."
 },
 "L3242-1": {
  "id": "LEGIARTI000006902858",
  "date": "2026-08-23",
  "texte": "La rémunération des salariés est mensuelle et indépendante, pour un horaire de travail effectif déterminé, du nombre de jours travaillés dans le mois. Le paiement mensuel neutralise les conséquences de la répartition inégale des jours entre les douze mois de l'année. Pour un horaire équivalent à la durée légale hebdomadaire, la rémunération mensuelle due au salarié se calcule en multipliant la rémunération horaire par les 52/12 de la durée légale hebdomadaire. Le paiement de la rémunération est effectué une fois par mois. Un acompte correspondant, pour une quinzaine, à la moitié de la rémunération mensuelle, est versé au salarié qui en fait la demande. Ces dispositions ne s'appliquent pas aux salariés travaillant à domicile, aux salariés saisonniers, aux salariés intermittents et aux salariés temporaires."
 },
 "L1221-10": {
  "id": "LEGIARTI000006900849",
  "date": "2026-08-23",
  "texte": "L'embauche d'un salarié ne peut intervenir qu'après déclaration nominative accomplie par l'employeur auprès des organismes de protection sociale désignés à cet effet. L'employeur accomplit cette déclaration dans tous les lieux de travail où sont employés des salariés."
 },
 "L1221-11": {
  "id": "LEGIARTI000006900850",
  "date": "2026-08-23",
  "texte": "Le non-respect de l'obligation de déclaration préalable à l'embauche, constaté par les agents mentionnés à l'article L. 8271-7 , entraîne une pénalité dont le montant est égal à trois cents fois le taux horaire du minimum garanti prévu à l'article L. 3231-12 ."
 },
 "L1221-5-1": {
  "id": "LEGIARTI000047285930",
  "date": "2026-08-23",
  "texte": "L'employeur remet au salarié un ou plusieurs documents écrits contenant les informations principales relatives à la relation de travail. Un salarié qui n'a pas reçu les informations mentionnées au premier alinéa ne peut saisir le juge compétent afin de les obtenir qu'après avoir mis en demeure son employeur de lui communiquer les documents requis ou, le cas échéant, de compléter les documents remis. Un décret en Conseil d'Etat fixe les modalités d'application du présent article, notamment la liste des informations devant figurer dans les documents mentionnés au premier alinéa."
 },
 "R1221-34": {
  "id": "LEGIARTI000048288642",
  "date": "2026-08-23",
  "texte": "Les documents mentionnés à l'article L. 1221-5-1 comportent au moins les informations suivantes : 1° L'identité des parties à la relation de travail ; 2° Le lieu ou les lieux de travail et, si elle est distincte, l'adresse de l'employeur ; 3° L'intitulé du poste, les fonctions, la catégorie socioprofessionnelle ou la catégorie d'emploi ; 4° La date d'embauche ; 5° Dans le cas d'une relation de travail à durée déterminée, la date de fin ou la durée prévue de celle-ci ; 6° Dans le cas du salarié temporaire mentionné à l'article L. 1251-1 , l'identité de l'entreprise utilisatrice, lorsqu'elle est connue et aussitôt qu'elle l'est ; 7° Le cas échéant, la durée et les conditions de la période d'essai ; 8° Le droit à la formation assuré par l'employeur conformément à l'article L. 6321-1 ; 9° La durée du congé payé auquel le salarié a droit, ou les modalités de calcul de cette durée ; 10° La procédure à observer par l'employeur et le salarié en cas de cessation de leur relation de travail ; 11° Les éléments constitutifs de la rémunération mentionnés à l'article L. 3221-3 , indiqués séparément, y compris les majorations pour les heures supplémentaires, ainsi que la périodicité et les modalités de paiement de cette rémunération ; 12° La durée de travail quotidienne, hebdomadaire, mensuelle ou ses modalités d'aménagement sur une autre période de référence lorsqu'il est fait application des dispositions des articles L. 3121-41 à L. 3121-47 , les conditions dans lesquelles le salarié peut être conduit à effectuer des heures supplémentaires ou complémentaires, ainsi que, le cas échéant, toute modalité concernant les changements d'équipe en cas d'organisation du travail en équipes successives alternantes ; 13° Les conventions et accords collectifs applicables au salarié dans l'entreprise ou l'établissement ; 14° Les régimes obligatoires auxquels est affilié le salarié, la mention des contrats de protection sociale complémentaire dont les salariés bénéficient collectivement en application d'un accord collectif ou d'une décision unilatérale de l'employeur ainsi que, le cas échéant, les conditions d'ancienneté qui y sont attachées."
 },
 "R1221-35": {
  "id": "LEGIARTI000048288640",
  "date": "2026-08-23",
  "texte": "La communication des informations mentionnées aux 7° à 12° et 14° de l'article R. 1221-34 peut prendre la forme d'un renvoi aux dispositions législatives et réglementaires ou aux stipulations conventionnelles applicables. Les informations mentionnées aux 1° à 5°, 7° et aux 11° et 12° du même article sont communiquées individuellement au salarié au plus tard le septième jour calendaire à compter de la date d'embauche. Les autres informations sont communiquées au plus tard un mois à compter de la même date."
 },
 "L1221-19": {
  "id": "LEGIARTI000019071113",
  "date": "2026-08-23",
  "texte": "Le contrat de travail à durée indéterminée peut comporter une période d'essai dont la durée maximale est : 1° Pour les ouvriers et les employés, de deux mois ; 2° Pour les agents de maîtrise et les techniciens, de trois mois ; 3° Pour les cadres, de quatre mois."
 },
 "L1221-21": {
  "id": "LEGIARTI000019071109",
  "date": "2026-08-23",
  "texte": "La période d'essai peut être renouvelée une fois si un accord de branche étendu le prévoit. Cet accord fixe les conditions et les durées de renouvellement. La durée de la période d'essai, renouvellement compris, ne peut pas dépasser : 1° Quatre mois pour les ouvriers et employés ; 2° Six mois pour les agents de maîtrise et techniciens ; 3° Huit mois pour les cadres."
 },
 "L1221-25": {
  "id": "LEGIARTI000029144958",
  "date": "2026-08-23",
  "texte": "Lorsqu'il est mis fin, par l'employeur, au contrat en cours ou au terme de la période d'essai définie aux articles L. 1221-19 à L. 1221-24 ou à l'article L. 1242-10 pour les contrats stipulant une période d'essai d'au moins une semaine, le salarié est prévenu dans un délai qui ne peut être inférieur à : 1° Vingt-quatre heures en deçà de huit jours de présence ; 2° Quarante-huit heures entre huit jours et un mois de présence ; 3° Deux semaines après un mois de présence ; 4° Un mois après trois mois de présence. La période d'essai, renouvellement inclus, ne peut être prolongée du fait de la durée du délai de prévenance. Lorsque le délai de prévenance n'a pas été respecté, son inexécution ouvre droit pour le salarié, sauf s'il a commis une faute grave, à une indemnité compensatrice. Cette indemnité est égale au montant des salaires et avantages que le salarié aurait perçus s'il avait accompli son travail jusqu'à l'expiration du délai de prévenance, indemnité compensatrice de congés payés comprise."
 },
 "L1221-26": {
  "id": "LEGIARTI000019071093",
  "date": "2026-08-23",
  "texte": "Lorsqu'il est mis fin à la période d'essai par le salarié, celui-ci respecte un délai de prévenance de quarante-huit heures. Ce délai est ramené à vingt-quatre heures si la durée de présence du salarié dans l'entreprise est inférieure à huit jours."
 },
 "L1221-8": {
  "id": "LEGIARTI000006900847",
  "date": "2026-08-23",
  "texte": "Le candidat à un emploi est expressément informé, préalablement à leur mise en oeuvre, des méthodes et techniques d'aide au recrutement utilisées à son égard. Les résultats obtenus sont confidentiels. Les méthodes et techniques d'aide au recrutement ou d'évaluation des candidats à un emploi doivent être pertinentes au regard de la finalité poursuivie."
 },
 "L1221-9": {
  "id": "LEGIARTI000006900848",
  "date": "2026-08-23",
  "texte": "Aucune information concernant personnellement un candidat à un emploi ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance."
 },
 "L1242-12": {
  "id": "LEGIARTI000006901206",
  "date": "2026-08-23",
  "texte": "Le contrat de travail à durée déterminée est établi par écrit et comporte la définition précise de son motif. A défaut, il est réputé conclu pour une durée indéterminée. Il comporte notamment : 1° Le nom et la qualification professionnelle de la personne remplacée lorsqu'il est conclu au titre des 1°, 4° et 5° de l'article L. 1242-2 ; 2° La date du terme et, le cas échéant, une clause de renouvellement lorsqu'il comporte un terme précis ; 3° La durée minimale pour laquelle il est conclu lorsqu'il ne comporte pas de terme précis ; 4° La désignation du poste de travail en précisant, le cas échéant, si celui-ci figure sur la liste des postes de travail présentant des risques particuliers pour la santé ou la sécurité des salariés prévue à l'article L. 4154-2 , la désignation de l'emploi occupé ou, lorsque le contrat est conclu pour assurer un complément de formation professionnelle au salarié au titre du 2° de l'article L. 1242-3 , la désignation de la nature des activités auxquelles participe le salarié dans l'entreprise ; 5° L'intitulé de la convention collective applicable ; 6° La durée de la période d'essai éventuellement prévue ; 7° Le montant de la rémunération et de ses différentes composantes, y compris les primes et accessoires de salaire s'il en existe ; 8° Le nom et l'adresse de la caisse de retraite complémentaire ainsi que, le cas échéant, ceux de l'organisme de prévoyance."
 },
 "L1242-2": {
  "id": "LEGIARTI000037312980",
  "date": "2026-08-23",
  "texte": "Sous réserve des dispositions de l'article L. 1242-3 , un contrat de travail à durée déterminée ne peut être conclu que pour l'exécution d'une tâche précise et temporaire, et seulement dans les cas suivants : 1° Remplacement d'un salarié en cas : a) D'absence ; b) De passage provisoire à temps partiel, conclu par avenant à son contrat de travail ou par échange écrit entre ce salarié et son employeur ; c) De suspension de son contrat de travail ; d) De départ définitif précédant la suppression de son poste de travail après consultation du comité social et économique, s'il existe ; e) D'attente de l'entrée en service effective du salarié recruté par contrat à durée indéterminée appelé à le remplacer ; 2° Accroissement temporaire de l'activité de l'entreprise ; 3° Emplois à caractère saisonnier, dont les tâches sont appelées à se répéter chaque année selon une périodicité à peu près fixe, en fonction du rythme des saisons ou des modes de vie collectifs ou emplois pour lesquels, dans certains secteurs d'activité définis par décret ou par convention ou accord collectif de travail étendu, il est d'usage constant de ne pas recourir au contrat de travail à durée indéterminée en raison de la nature de l'activité exercée et du caractère par nature temporaire de ces emplois. Lorsque la durée du contrat de travail est inférieure à un mois, un seul bulletin de paie est émis par l'employeur ; 4° Remplacement d'un chef d'entreprise artisanale, industrielle ou commerciale, d'une personne exerçant une profession libérale, de son conjoint participant effectivement à l'activité de l'entreprise à titre professionnel et habituel ou d'un associé non salarié d'une société civile professionnelle, d'une société civile de moyens d'une société d'exercice libéral ou de toute autre personne morale exerçant une profession libérale ; 5° Remplacement du chef d'une exploitation agricole ou d'une entreprise mentionnée aux 1° à 4° de l'article L. 722-1 du code rural et de la pêche maritime , d'un aide familial, d'un associé d'exploitation, ou de leur conjoint mentionné à l'article L. 722-10 du même code dès lors qu'il participe effectivement à l'activité de l'exploitation agricole ou de l'entreprise ; 6° Recrutement d'ingénieurs et de cadres, au sens des conventions collectives, en vue de la réalisation d'un objet défini lorsqu'un accord de branche étendu ou, à défaut, un accord d'entreprise le prévoit et qu'il définit : a) Les nécessités économiques auxquelles ces contrats sont susceptibles d'apporter une réponse adaptée ; b) Les conditions dans lesquelles les salariés sous contrat à durée déterminée à objet défini bénéficient de garanties relatives à l'aide au reclassement, à la validation des acquis de l'expérience, à la priorité de réembauche et à l'accès à la formation professionnelle continue et peuvent, au cours du délai de prévenance, mobiliser les moyens disponibles pour organiser la suite de leur parcours professionnel ; c) Les conditions dans lesquelles les salariés sous contrat à durée déterminée à objet défini ont priorité d'accès aux emplois en contrat à durée indéterminée dans l'entreprise."
 },
 "L1242-13": {
  "id": "LEGIARTI000006901207",
  "date": "2026-08-23",
  "texte": "Le contrat de travail est transmis au salarié, au plus tard, dans les deux jours ouvrables suivant l'embauche."
 },
 "L1244-3": {
  "id": "LEGIARTI000035644007",
  "date": "2026-08-23",
  "texte": "A l'expiration d'un contrat de travail à durée déterminée, il ne peut être recouru, pour pourvoir le poste du salarié dont le contrat a pris fin, ni à un contrat à durée déterminée ni à un contrat de travail temporaire, avant l'expiration d'un délai de carence calculé en fonction de la durée du contrat incluant, le cas échéant, son ou ses renouvellements. Les jours pris en compte pour apprécier le délai devant séparer les deux contrats sont les jours d'ouverture de l'entreprise ou de l'établissement concerné. Sans préjudice des dispositions de l' article L. 1242-1 , une convention ou un accord de branche étendu peut fixer les modalités de calcul de ce délai de carence."
 },
 "L1244-3-1": {
  "id": "LEGIARTI000035639421",
  "date": "2026-08-23",
  "texte": "A défaut de stipulation dans la convention ou l'accord de branche conclu en application de l'article L. 1244-3 , ce délai de carence est égal : 1° Au tiers de la durée du contrat venu à expiration si la durée du contrat incluant, le cas échéant, son ou ses renouvellements, est de quatorze jours ou plus ; 2° A la moitié de la durée du contrat venu à expiration si la durée du contrat incluant, le cas échéant, son ou ses renouvellements, est inférieure à quatorze jours. Les jours pris en compte pour apprécier le délai devant séparer les deux contrats sont les jours d'ouverture de l'entreprise ou de l'établissement concerné."
 },
 "L1243-8": {
  "id": "LEGIARTI000006901219",
  "date": "2026-08-23",
  "texte": "Lorsque, à l'issue d'un contrat de travail à durée déterminée, les relations contractuelles de travail ne se poursuivent pas par un contrat à durée indéterminée, le salarié a droit, à titre de complément de salaire, à une indemnité de fin de contrat destinée à compenser la précarité de sa situation. Cette indemnité est égale à 10 % de la rémunération totale brute versée au salarié. Elle s'ajoute à la rémunération totale brute due au salarié. Elle est versée à l'issue du contrat en même temps que le dernier salaire et figure sur le bulletin de salaire correspondant."
 },
 "D1234-6": {
  "id": "LEGIARTI000029544357",
  "date": "2026-08-23",
  "texte": "Le certificat de travail contient exclusivement les mentions suivantes : 1° La date d'entrée du salarié et celle de sa sortie ; 2° La nature de l'emploi ou des emplois successivement occupés et les périodes pendant lesquelles ces emplois ont été tenus. 3° Abrogé ; 4° Abrogé."
 },
 "L1234-20": {
  "id": "LEGIARTI000019071122",
  "date": "2026-08-23",
  "texte": "Le solde de tout compte, établi par l'employeur et dont le salarié lui donne reçu, fait l'inventaire des sommes versées au salarié lors de la rupture du contrat de travail. Le reçu pour solde de tout compte peut être dénoncé dans les six mois qui suivent sa signature, délai au-delà duquel il devient libératoire pour l'employeur pour les sommes qui y sont mentionnées."
 },
 "R1234-9": {
  "id": "LEGIARTI000049816309",
  "date": "2026-08-23",
  "texte": "L'employeur délivre au salarié, au moment de l'expiration ou de la rupture du contrat de travail, les attestations et justifications qui lui permettent d'exercer ses droits aux prestations mentionnées à l'article L. 5421-2 et transmet sans délai ces mêmes attestations à l'opérateur France Travail. Les employeurs d'au moins onze salariés effectuent cette transmission à l'opérateur France Travail par voie électronique, sauf impossibilité pour une cause qui leur est étrangère, selon des modalités précisées par un arrêté du ministre chargé de l'emploi. (1)"
 },
 "L1232-2": {
  "id": "LEGIARTI000006901000",
  "date": "2026-08-23",
  "texte": "L'employeur qui envisage de licencier un salarié le convoque, avant toute décision, à un entretien préalable. La convocation est effectuée par lettre recommandée ou par lettre remise en main propre contre décharge. Cette lettre indique l'objet de la convocation. L'entretien préalable ne peut avoir lieu moins de cinq jours ouvrables après la présentation de la lettre recommandée ou la remise en main propre de la lettre de convocation."
 },
 "L1232-4": {
  "id": "LEGIARTI000006901002",
  "date": "2026-08-23",
  "texte": "Lors de son audition, le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise. Lorsqu'il n'y a pas d'institutions représentatives du personnel dans l'entreprise, le salarié peut se faire assister soit par une personne de son choix appartenant au personnel de l'entreprise, soit par un conseiller du salarié choisi sur une liste dressée par l'autorité administrative. La lettre de convocation à l'entretien préalable adressée au salarié mentionne la possibilité de recourir à un conseiller du salarié et précise l'adresse des services dans lesquels la liste de ces conseillers est tenue à sa disposition."
 },
 "L1232-6": {
  "id": "LEGIARTI000036762096",
  "date": "2026-08-23",
  "texte": "Lorsque l'employeur décide de licencier un salarié, il lui notifie sa décision par lettre recommandée avec avis de réception. Cette lettre comporte l'énoncé du ou des motifs invoqués par l'employeur. Elle ne peut être expédiée moins de deux jours ouvrables après la date prévue de l'entretien préalable au licenciement auquel le salarié a été convoqué. Un décret en Conseil d'Etat détermine les modalités d'application du présent article. Un arrêté du ministre chargé du travail fixe les modèles que l'employeur peut utiliser pour procéder à la notification du licenciement."
 },
 "L1235-2": {
  "id": "LEGIARTI000036261950",
  "date": "2026-08-23",
  "texte": "Les motifs énoncés dans la lettre de licenciement prévue aux articles L. 1232-6 , L. 1233-16 et L. 1233-42 peuvent, après la notification de celle-ci, être précisés par l'employeur, soit à son initiative soit à la demande du salarié, dans des délais et conditions fixés par décret en Conseil d'Etat. La lettre de licenciement, précisée le cas échéant par l'employeur, fixe les limites du litige en ce qui concerne les motifs de licenciement. A défaut pour le salarié d'avoir formé auprès de l'employeur une demande en application de l'alinéa premier, l'irrégularité que constitue une insuffisance de motivation de la lettre de licenciement ne prive pas, à elle seule, le licenciement de cause réelle et sérieuse et ouvre droit à une indemnité qui ne peut excéder un mois de salaire. En l'absence de cause réelle et sérieuse du licenciement, le préjudice résultant du vice de motivation de la lettre de rupture est réparé par l'indemnité allouée conformément aux dispositions de l' article L. 1235-3 . Lorsqu'une irrégularité a été commise au cours de la procédure, notamment si le licenciement d'un salarié intervient sans que la procédure requise aux articles L. 1232-2, L. 1232-3, L. 1232-4 , L. 1233-11 , L. 1233-12 et L. 1233-13 ait été observée ou sans que la procédure conventionnelle ou statutaire de consultation préalable au licenciement ait été respectée, mais pour une cause réelle et sérieuse, le juge accorde au salarié, à la charge de l'employeur, une indemnité qui ne peut être supérieure à un mois de salaire."
 },
 "R1232-13": {
  "id": "LEGIARTI000036212577",
  "date": "2026-08-23",
  "texte": "Dans les quinze jours suivant la notification du licenciement, le salarié peut, par lettre recommandée avec avis de réception ou remise contre récépissé, demander à l'employeur des précisions sur les motifs énoncés dans la lettre de licenciement. L'employeur dispose d'un délai de quinze jours après la réception de la demande du salarié pour apporter des précisions s'il le souhaite. Il communique ces précisions au salarié par lettre recommandée avec avis de réception ou remise contre récépissé. Dans un délai de quinze jours suivant la notification du licenciement et selon les mêmes formes, l'employeur peut, à son initiative, préciser les motifs du licenciement."
 },
 "L1237-11": {
  "id": "LEGIARTI000019071187",
  "date": "2026-08-23",
  "texte": "L'employeur et le salarié peuvent convenir en commun des conditions de la rupture du contrat de travail qui les lie. La rupture conventionnelle, exclusive du licenciement ou de la démission, ne peut être imposée par l'une ou l'autre des parties. Elle résulte d'une convention signée par les parties au contrat. Elle est soumise aux dispositions de la présente section destinées à garantir la liberté du consentement des parties."
 },
 "L1237-13": {
  "id": "LEGIARTI000019071182",
  "date": "2026-08-23",
  "texte": "La convention de rupture définit les conditions de celle-ci, notamment le montant de l'indemnité spécifique de rupture conventionnelle qui ne peut pas être inférieur à celui de l'indemnité prévue à l'article L. 1234-9 . Elle fixe la date de rupture du contrat de travail, qui ne peut intervenir avant le lendemain du jour de l'homologation. A compter de la date de sa signature par les deux parties, chacune d'entre elles dispose d'un délai de quinze jours calendaires pour exercer son droit de rétractation. Ce droit est exercé sous la forme d'une lettre adressée par tout moyen attestant de sa date de réception par l'autre partie."
 },
 "L1237-14": {
  "id": "LEGIARTI000019071180",
  "date": "2026-08-23",
  "texte": "A l'issue du délai de rétractation, la partie la plus diligente adresse une demande d'homologation à l'autorité administrative, avec un exemplaire de la convention de rupture. Un arrêté du ministre chargé du travail fixe le modèle de cette demande. L'autorité administrative dispose d'un délai d'instruction de quinze jours ouvrables, à compter de la réception de la demande, pour s'assurer du respect des conditions prévues à la présente section et de la liberté de consentement des parties. A défaut de notification dans ce délai, l'homologation est réputée acquise et l'autorité administrative est dessaisie. La validité de la convention est subordonnée à son homologation. L'homologation ne peut faire l'objet d'un litige distinct de celui relatif à la convention. Tout litige concernant la convention, l'homologation ou le refus d'homologation relève de la compétence du conseil des prud'hommes, à l'exclusion de tout autre recours contentieux ou administratif. Le recours juridictionnel doit être formé, à peine d'irrecevabilité, avant l'expiration d'un délai de douze mois à compter de la date d'homologation de la convention."
 },
 "L1226-2": {
  "id": "LEGIARTI000035653236",
  "date": "2026-08-23",
  "texte": "Lorsque le salarié victime d'une maladie ou d'un accident non professionnel est déclaré inapte par le médecin du travail, en application de l'article L. 4624-4 , à reprendre l'emploi qu'il occupait précédemment, l'employeur lui propose un autre emploi approprié à ses capacités, au sein de l'entreprise ou des entreprises du groupe auquel elle appartient le cas échéant, situées sur le territoire national et dont l'organisation, les activités ou le lieu d'exploitation assurent la permutation de tout ou partie du personnel. Pour l'application du présent article, la notion de groupe désigne le groupe formé par une entreprise appelée entreprise dominante et les entreprises qu'elle contrôle dans les conditions définies à l'article L. 233-1 , aux I et II de l'article L. 233-3 et à l'article L. 233-16 du code de commerce. Cette proposition prend en compte, après avis du comité social et économique lorsqu'il existe, les conclusions écrites du médecin du travail et les indications qu'il formule sur les capacités du salarié à exercer l'une des tâches existantes dans l'entreprise. Le médecin du travail formule également des indications sur la capacité du salarié à bénéficier d'une formation le préparant à occuper un poste adapté. L'emploi proposé est aussi comparable que possible à l'emploi précédemment occupé, au besoin par la mise en oeuvre de mesures telles que mutations, aménagements, adaptations ou transformations de postes existants ou aménagement du temps de travail."
 },
 "L1226-4": {
  "id": "LEGIARTI000025560071",
  "date": "2026-08-23",
  "texte": "Lorsque, à l'issue d'un délai d'un mois à compter de la date de l'examen médical de reprise du travail, le salarié déclaré inapte n'est pas reclassé dans l'entreprise ou s'il n'est pas licencié, l'employeur lui verse, dès l'expiration de ce délai, le salaire correspondant à l'emploi que celui-ci occupait avant la suspension de son contrat de travail. Ces dispositions s'appliquent également en cas d'inaptitude à tout emploi dans l'entreprise constatée par le médecin du travail. En cas de licenciement, le préavis n'est pas exécuté et le contrat de travail est rompu à la date de notification du licenciement. Le préavis est néanmoins pris en compte pour le calcul de l'indemnité mentionnée à l'article L. 1234-9 . Par dérogation à l'article L. 1234-5 , l'inexécution du préavis ne donne pas lieu au versement d'une indemnité compensatrice."
 },
 "L3221-2": {
  "id": "LEGIARTI000006902818",
  "date": "2026-08-23",
  "texte": "Tout employeur assure, pour un même travail ou pour un travail de valeur égale, l'égalité de rémunération entre les femmes et les hommes."
 },
 "L1132-1": {
  "id": "LEGIARTI000045391841",
  "date": "2026-08-23",
  "texte": "Aucune personne ne peut être écartée d'une procédure de recrutement ou de nomination ou de l'accès à un stage ou à une période de formation en entreprise, aucun salarié ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire, directe ou indirecte, telle que définie à l'article 1er de la loi n° 2008-496 du 27 mai 2008 portant diverses dispositions d'adaptation au droit communautaire dans le domaine de la lutte contre les discriminations, notamment en matière de rémunération, au sens de l'article L. 3221-3 , de mesures d'intéressement ou de distribution d'actions, de formation, de reclassement, d'affectation, de qualification, de classification, de promotion professionnelle, d'horaires de travail, d'évaluation de la performance, de mutation ou de renouvellement de contrat en raison de son origine, de son sexe, de ses mœurs, de son orientation sexuelle, de son identité de genre, de son âge, de sa situation de famille ou de sa grossesse, de ses caractéristiques génétiques, de la particulière vulnérabilité résultant de sa situation économique, apparente ou connue de son auteur, de son appartenance ou de sa non-appartenance, vraie ou supposée, à une ethnie, une nation ou une prétendue race, de ses opinions politiques, de ses activités syndicales ou mutualistes, de son exercice d'un mandat électif, de ses convictions religieuses, de son apparence physique, de son nom de famille, de son lieu de résidence ou de sa domiciliation bancaire, ou en raison de son état de santé, de sa perte d'autonomie ou de son handicap, de sa capacité à s'exprimer dans une langue autre que le français, de sa qualité de lanceur d'alerte, de facilitateur ou de personne en lien avec un lanceur d'alerte, au sens, respectivement, du I de l'article 6 et des 1° et 2° de l' article 6-1 de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique."
 },
 "L1142-2-1": {
  "id": "LEGIARTI000031072447",
  "date": "2026-08-23",
  "texte": "Nul ne doit subir d'agissement sexiste, défini comme tout agissement lié au sexe d'une personne, ayant pour objet ou pour effet de porter atteinte à sa dignité ou de créer un environnement intimidant, hostile, dégradant, humiliant ou offensant."
 },
 "L5213-6": {
  "id": "LEGIARTI000048589854",
  "date": "2026-08-23",
  "texte": "Afin de garantir le respect du principe d'égalité de traitement à l'égard des travailleurs handicapés, l'employeur prend, en fonction des besoins dans une situation concrète, les mesures appropriées pour permettre aux travailleurs mentionnés aux 1° à 4° et 9° à 11° de l'article L. 5212-13 d'accéder à un emploi ou de conserver un emploi correspondant à leur qualification, de l'exercer ou d'y progresser ou pour qu'une formation adaptée à leurs besoins leur soit dispensée. L'employeur s'assure que les logiciels installés sur le poste de travail des personnes handicapées et nécessaires à leur exercice professionnel sont accessibles. Il s'assure également que le poste de travail des personnes handicapées est accessible en télétravail. En cas de changement d'employeur, la conservation des équipements contribuant à l'adaptation du poste de travail des travailleurs handicapés, lorsqu'il comporte les mêmes caractéristiques dans la nouvelle entreprise, peut être prévue par convention entre les deux entreprises concernées. Cette convention peut également être conclue entre une entreprise privée et un employeur public au sens de l' article L. 131-8 du code général de la fonction publique . Ces mesures sont prises sous réserve que les charges consécutives à leur mise en oeuvre ne soient pas disproportionnées, compte tenu de l'aide prévue à l'article L. 5213-10 qui peut compenser en tout ou partie les dépenses supportées à ce titre par l'employeur. Le refus de prendre des mesures au sens du premier alinéa peut être constitutif d'une discrimination au sens de l'article L. 1133-3."
 },
 "L5213-6-1": {
  "id": "LEGIARTI000043894133",
  "date": "2026-08-23",
  "texte": "Dans toute entreprise employant au moins deux cent cinquante salariés, est désigné un référent chargé d'orienter, d'informer et d'accompagner les personnes en situation de handicap. Pour l'application du présent article, l'effectif salarié et le franchissement du seuil de deux cent cinquante salariés sont déterminés selon les modalités prévues à l' article L. 130-1 du code de la sécurité sociale. A la demande du travailleur concerné, le référent participe au rendez-vous de liaison prévu à l' article L. 1226-1-3 du présent code ainsi qu'aux échanges organisés sur le fondement du dernier alinéa du I de l'article L. 4624-2-2 . Dans les deux cas, il est tenu à une obligation de discrétion à l'égard des informations à caractère personnel qu'il est amené à connaître."
 },
 "L1131-2": {
  "id": "LEGIARTI000033957410",
  "date": "2026-08-23",
  "texte": "Dans toute entreprise employant au moins trois cents salariés et dans toute entreprise spécialisée dans le recrutement, les employés chargés des missions de recrutement reçoivent une formation à la non-discrimination à l'embauche au moins une fois tous les cinq ans."
 },
 "L6131-1": {
  "id": "LEGIARTI000043709709",
  "date": "2026-08-23",
  "texte": "I.-Les employeurs concourent au développement de la formation professionnelle et de l'apprentissage par : 1° Le financement direct des actions de formation de leurs salariés ; 2° Le versement de la contribution unique à la formation professionnelle et à l'alternance mentionnée à l'article L. 6131-2 ; 3° Le versement de la contribution supplémentaire à l'apprentissage mentionnée à l'article L. 6242-1 ; 4° Le versement de la contribution dédiée au financement du compte personnel de formation pour les titulaires d'un contrat à durée déterminée mentionnée à l'article L. 6331-6 ; 5° Le versement, le cas échéant, des contributions supplémentaires ayant pour objet le développement de la formation professionnelle continue prévues par un accord professionnel national conclu en application de l'article L. 6332-1-2 . II.-Le I ne s'applique pas à l'Etat, aux établissements publics de santé, sociaux et médico-sociaux relevant de la fonction publique hospitalière, aux groupements de coopération sanitaire mentionnés aux articles L. 6133-1 et L. 6133-4 du code de la santé publique, aux groupements de coopération sociale et médico-sociale mentionnés à l' article L. 312-7 du code de l'action sociale et des familles , aux collectivités territoriales et à leurs établissements publics à caractère administratif ainsi qu'aux employeurs dont l'entreprise ne comporte pas d'établissement en France mentionnés à l' article L. 243-1-2 du code de la sécurité sociale ."
 },
 "L6323-13": {
  "id": "LEGIARTI000052437094",
  "date": "2026-08-23",
  "texte": "Dans les entreprises d'au moins cinquante salariés, lorsque le salarié n'a pas bénéficié, durant les huit ans précédant l'entretien mentionné au II de l'article L. 6315-1 , des entretiens prévus au même article L. 6315-1 et d'au moins une formation autre que celle mentionnée à l'article L. 6321-2 , un abondement est inscrit à son compte dans des conditions définies par décret en Conseil d'Etat et l'entreprise verse une somme dont le montant, fixé par décret en Conseil d'Etat, ne peut excéder six fois le montant annuel mentionné à l'article L. 6323-11 . Le salarié est informé de ce versement. Dans le cadre des contrôles menés par les agents mentionnés à l'article L. 6361-5 , lorsque l'entreprise n'a pas opéré le versement prévu au premier alinéa du présent article ou a opéré un versement insuffisant, elle est mise en demeure de procéder au versement de l'insuffisance constatée dans le respect de la procédure contradictoire mentionnée à l'article L. 6362-10 . A défaut, l'entreprise verse au Trésor public un montant équivalent à l'insuffisance constatée majorée de 100 %. Ce versement est établi et recouvré selon les modalités ainsi que sous les sûretés, garanties et sanctions applicables aux taxes sur le chiffre d'affaires. Le contrôle et le contentieux de ce versement sont opérés selon les règles applicables en matière de taxe sur le chiffre d'affaires. Pour l'application du premier alinéa du présent article, l'effectif salarié et le franchissement du seuil de cinquante salariés sont déterminés selon les modalités prévues à l'article L. 130-1 du code de la sécurité sociale."
 },
 "L4141-1": {
  "id": "LEGIARTI000027326445",
  "date": "2026-08-23",
  "texte": "L'employeur organise et dispense une information des travailleurs sur les risques pour la santé et la sécurité et les mesures prises pour y remédier. Il organise et dispense également une information des travailleurs sur les risques que peuvent faire peser sur la santé publique ou l'environnement les produits ou procédés de fabrication utilisés ou mis en œuvre par l'établissement ainsi que sur les mesures prises pour y remédier."
 },
 "L4154-2": {
  "id": "LEGIARTI000035653199",
  "date": "2026-08-23",
  "texte": "Les salariés titulaires d'un contrat de travail à durée déterminée, les salariés temporaires et les stagiaires en entreprise affectés à des postes de travail présentant des risques particuliers pour leur santé ou leur sécurité bénéficient d'une formation renforcée à la sécurité ainsi que d'un accueil et d'une information adaptés dans l'entreprise dans laquelle ils sont employés. La liste de ces postes de travail est établie par l'employeur, après avis du médecin du travail et du comité social et économique, s'il existe. Elle est tenue à la disposition de l'agent de contrôle de l'inspection du travail mentionné à l'article L. 8112-1 ."
 },
 "R4224-14": {
  "id": "LEGIARTI000018532205",
  "date": "2026-08-23",
  "texte": "Les lieux de travail sont équipés d'un matériel de premiers secours adapté à la nature des risques et facilement accessible."
 },
 "R4224-15": {
  "id": "LEGIARTI000018532203",
  "date": "2026-08-23",
  "texte": "Un membre du personnel reçoit la formation de secouriste nécessaire pour donner les premiers secours en cas d'urgence dans : 1° Chaque atelier où sont accomplis des travaux dangereux ; 2° Chaque chantier employant vingt travailleurs au moins pendant plus de quinze jours où sont réalisés des travaux dangereux. Les travailleurs ainsi formés ne peuvent remplacer les infirmiers."
 },
 "R4224-16": {
  "id": "LEGIARTI000043128580",
  "date": "2026-08-23",
  "texte": "En l'absence d'infirmiers, ou lorsque leur nombre ne permet pas d'assurer une présence permanente, l'employeur prend, après avis du médecin du travail, les mesures nécessaires pour assurer les premiers secours aux accidentés et aux malades. Ces mesures qui sont prises en liaison notamment avec les services de secours d'urgence extérieurs à l'entreprise sont adaptées à la nature des risques. Ces mesures sont consignées dans un document tenu à la disposition de l'agent de contrôle de l'inspection du travail."
 },
 "R4227-29": {
  "id": "LEGIARTI000018532079",
  "date": "2026-08-23",
  "texte": "Le premier secours contre l'incendie est assuré par des extincteurs en nombre suffisant et maintenus en bon état de fonctionnement. Il existe au moins un extincteur portatif à eau pulvérisée d'une capacité minimale de 6 litres pour 200 mètres carrés de plancher. Il existe au moins un appareil par niveau. Lorsque les locaux présentent des risques d'incendie particuliers, notamment des risques électriques, ils sont dotés d'extincteurs dont le nombre et le type sont appropriés aux risques."
 },
 "R4121-5": {
  "id": "LEGIARTI000047665981",
  "date": "2026-08-23",
  "texte": "Lorsqu'un travailleur est victime d'un accident du travail ayant entraîné son décès, l'employeur informe l'agent de contrôle de l'inspection du travail compétent pour le lieu de survenance de l'accident immédiatement et au plus tard dans les douze heures qui suivent le décès du travailleur, sauf s'il établit qu'il n'a pu avoir connaissance du décès que postérieurement à l'expiration de ce délai. Dans ce cas, le délai de douze heures imparti à l'employeur pour informer l'agent de contrôle de l'inspection du travail court à compter du moment où l'employeur a connaissance du décès du travailleur. Cette information est communiquée par tout moyen permettant de conférer date certaine à cet envoi. Elle comporte les éléments suivants : 1° Le nom ou la raison sociale ainsi que les adresses postale et électronique, les coordonnées téléphoniques de l'entreprise ou de l'établissement qui emploie le travailleur au moment de l'accident ; 2° Le cas échéant, le nom ou la raison sociale ainsi que les adresses postale et électronique, les coordonnées téléphoniques de l'entreprise ou de l'établissement dans lequel l'accident s'est produit si celui-ci est différent de l'entreprise ou établissement employeur ; 3° Les noms, prénoms, date de naissance de la victime ; 4° Les date, heure, lieu et circonstances de l'accident ; 5° L'identité et les coordonnées des témoins, le cas échéant."
 },
 "R4624-33": {
  "id": "LEGIARTI000045371018",
  "date": "2026-08-23",
  "texte": "Le médecin du travail est informé par l'employeur de tout arrêt de travail d'une durée inférieure à trente jours pour cause d'accident du travail afin de pouvoir apprécier, notamment, l'opportunité d'un nouvel examen médical et, avec l'équipe pluridisciplinaire, de préconiser des mesures de prévention des risques professionnels."
 },
 "R4624-31": {
  "id": "LEGIARTI000054250639",
  "date": "2026-08-23",
  "texte": "Le travailleur bénéficie d'un examen de reprise du travail par le médecin du travail : 1° Après un congé de maternité ; 2° Après une absence pour cause de maladie professionnelle ; 3° Après une absence d'au moins trente jours pour cause d'accident du travail ; 4° Après une absence d'au moins soixante jours pour cause de maladie ou d'accident non professionnel. Dès que l'employeur a connaissance de la date de la fin de l'arrêt de travail, il saisit le service de prévention et de santé au travail qui organise l'examen de reprise le jour de la reprise effective du travail par le travailleur, et au plus tard dans un délai de huit jours qui suivent cette reprise. Par dérogation aux dispositions des alinéas précédents, et sauf demande du médecin du travail, de l'employeur ou du travailleur, la visite de reprise n'est pas requise si l'ensemble des conditions suivantes sont réunies : 1° Le travailleur a bénéficié d'une visite de préreprise prévue à l'article L. 4624-2-4 dans les trente jours précédant sa reprise effective du travail ; 2° Lors de cette visite de préreprise, le médecin du travail a conclu qu'aucune mesure individuelle d'aménagement, d'adaptation ou de transformation du poste ni aucune mesure d'aménagement du temps de travail n'était nécessaire en vue de la reprise."
 },
 "L4624-2-2": {
  "id": "LEGIARTI000054527125",
  "date": "2026-08-23",
  "texte": "I. - Le travailleur est examiné par le médecin du travail au cours d'une visite médicale de mi-carrière organisée à une échéance déterminée par accord de branche ou, à défaut, durant l'année civile du quarante-cinquième anniversaire du travailleur. Cet examen médical peut être anticipé et organisé conjointement avec une autre visite médicale lorsque le travailleur doit être examiné par le médecin du travail deux ans avant l'échéance prévue au premier alinéa du présent I. Il peut être réalisé dès le retour à l'emploi du travailleur dès lors qu'il satisfait aux conditions déterminées par l'accord de branche prévu au même premier alinéa ou, à défaut, qu'il est âgé d'au moins quarante-cinq ans. L'examen médical vise à : 1° Etablir un état des lieux de l'adéquation entre le poste de travail et l'état de santé du travailleur, à date, en tenant compte des expositions à des facteurs de risques professionnels auxquelles il a été soumis ; 2° Evaluer les risques de désinsertion professionnelle, en prenant en compte l'évolution des capacités du travailleur en fonction de son parcours professionnel, de son âge et de son état de santé ; 3° Sensibiliser le travailleur aux enjeux du vieillissement au travail et sur la prévention des risques professionnels ; 4° Sensibiliser le travailleur à certains enjeux de santé publique susceptibles d'affecter sa santé au travail, notamment aux facteurs de risques cardio-neuro-vasculaires mentionnés à l'article L. 1411-6-2 du code de la santé publique. Un dépistage précoce des maladies cardio-neuro-vasculaires et des maladies cardiaques structurelles est proposé au travailleur lors de cet examen. Le médecin du travail peut proposer, par écrit et après échange avec le travailleur et l'employeur, les mesures prévues à l' article L. 4624-3 . II. - La visite médicale de mi-carrière peut être réalisée par un infirmier de santé au travail exerçant en pratique avancée. Celui-ci ne peut proposer les mesures mentionnées au dernier alinéa du I. A l'issue de la visite, l'infirmier peut, s'il l'estime nécessaire, orienter sans délai le travailleur vers le médecin du travail."
 },
 "L4624-6": {
  "id": "LEGIARTI000033014760",
  "date": "2026-08-23",
  "texte": "L'employeur est tenu de prendre en considération l'avis et les indications ou les propositions émis par le médecin du travail en application des articles L. 4624-2 à L. 4624-4 . En cas de refus, l'employeur fait connaître par écrit au travailleur et au médecin du travail les motifs qui s'opposent à ce qu'il y soit donné suite."
 },
 "R4624-46": {
  "id": "LEGIARTI000045677119",
  "date": "2026-08-23",
  "texte": "Pour chaque entreprise ou établissement, le médecin du travail ou, dans les services de prévention et de santé au travail interentreprises, l'équipe pluridisciplinaire établit et met à jour une fiche d'entreprise ou d'établissement sur laquelle figurent, notamment, les risques professionnels et les effectifs de salariés qui y sont exposés."
 },
 "R4624-47": {
  "id": "LEGIARTI000045676758",
  "date": "2026-08-23",
  "texte": "Pour les entreprises adhérentes à un service de prévention et de santé au travail interentreprises, la fiche d'entreprise est établie dans l'année qui suit l'adhésion de l'entreprise ou de l'établissement à ce service."
 },
 "L4644-1": {
  "id": "LEGIARTI000043893856",
  "date": "2026-08-23",
  "texte": "I.-L'employeur désigne un ou plusieurs salariés compétents pour s'occuper des activités de protection et de prévention des risques professionnels de l'entreprise. Le ou les salariés ainsi désignés par l'employeur bénéficient d'une formation en matière de santé au travail dans les conditions prévues aux articles L. 2315-16 à L. 2315-18 . A défaut, si les compétences dans l'entreprise ne permettent pas d'organiser ces activités, l'employeur peut faire appel, après avis du comité social et économique, aux intervenants en prévention des risques professionnels appartenant au service de prévention et de santé au travail interentreprises auquel il adhère ou dûment enregistrés auprès de l'autorité administrative disposant de compétences dans le domaine de la prévention des risques professionnels et de l'amélioration des conditions de travail. L'employeur peut aussi faire appel aux services de prévention des caisses de sécurité sociale avec l'appui de l'Institut national de recherche et de sécurité dans le cadre des programmes de prévention mentionnés à l'article L. 422-5 du code de la sécurité sociale, à l'organisme professionnel de prévention du bâtiment et des travaux publics et à l'Agence nationale pour l'amélioration des conditions de travail et son réseau. Cet appel aux compétences est réalisé dans des conditions garantissant les règles d'indépendance des professions médicales et l'indépendance des personnes et organismes mentionnés au présent I. Ces conditions sont déterminées par décret en Conseil d'Etat. II.-Les modalités d'application du présent article sont déterminées par décret."
 },
 "R4323-95": {
  "id": "LEGIARTI000018531306",
  "date": "2026-08-23",
  "texte": "Les équipements de protection individuelle et les vêtements de travail mentionnés à l'article R. 4321-4 sont fournis gratuitement par l'employeur qui assure leur bon fonctionnement et leur maintien dans un état hygiénique satisfaisant par les entretiens, réparations et remplacements nécessaires. Ces dispositions ne font pas obstacle aux conditions de fournitures des équipements de protection individuelle prévues par l'article L. 1251-23 , pour les salariés temporaires."
 },
 "R4512-6": {
  "id": "LEGIARTI000018529785",
  "date": "2026-08-23",
  "texte": "Au vu des informations et éléments recueillis au cours de l'inspection commune préalable, les chefs des entreprises utilisatrice et extérieures procèdent en commun à une analyse des risques pouvant résulter de l'interférence entre les activités, installations et matériels. Lorsque ces risques existent, les employeurs arrêtent d'un commun accord, avant le début des travaux, un plan de prévention définissant les mesures prises par chaque entreprise en vue de prévenir ces risques."
 },
 "R4515-4": {
  "id": "LEGIARTI000018529684",
  "date": "2026-08-23",
  "texte": "Les opérations de chargement ou de déchargement, font l'objet d'un document écrit, dit « protocole de sécurité », remplaçant le plan de prévention."
 },
 "L3122-1": {
  "id": "LEGIARTI000033020190",
  "date": "2026-08-23",
  "texte": "Le recours au travail de nuit est exceptionnel. Il prend en compte les impératifs de protection de la santé et de la sécurité des travailleurs et est justifié par la nécessité d'assurer la continuité de l'activité économique ou des services d'utilité sociale."
 },
 "L3122-2": {
  "id": "LEGIARTI000033020186",
  "date": "2026-08-23",
  "texte": "Tout travail effectué au cours d'une période d'au moins neuf heures consécutives comprenant l'intervalle entre minuit et 5 heures est considéré comme du travail de nuit. La période de travail de nuit commence au plus tôt à 21 heures et s'achève au plus tard à 7 heures."
 },
 "L4153-8": {
  "id": "LEGIARTI000006903187",
  "date": "2026-08-23",
  "texte": "Il est interdit d'employer des travailleurs de moins de dix-huit ans à certaines catégories de travaux les exposant à des risques pour leur santé, leur sécurité, leur moralité ou excédant leurs forces. Ces catégories de travaux sont déterminées par voie réglementaire."
 },
 "L2142-3": {
  "id": "LEGIARTI000035652705",
  "date": "2026-08-23",
  "texte": "L'affichage des communications syndicales s'effectue librement sur des panneaux réservés à cet usage, distincts de ceux affectés aux communications du comité social et économique. Un exemplaire des communications syndicales est transmis à l'employeur, simultanément à l'affichage. Les panneaux sont mis à la disposition de chaque section syndicale suivant des modalités fixées par accord avec l'employeur."
 },
 "L2142-4": {
  "id": "LEGIARTI000006901617",
  "date": "2026-08-23",
  "texte": "Les publications et tracts de nature syndicale peuvent être librement diffusés aux travailleurs de l'entreprise dans l'enceinte de celle-ci aux heures d'entrée et de sortie du travail."
 },
 "L2142-8": {
  "id": "LEGIARTI000025578958",
  "date": "2026-08-23",
  "texte": "Dans les entreprises ou établissements d'au moins deux cents salariés, l'employeur met à la disposition des sections syndicales un local commun convenant à l'exercice de la mission de leurs délégués. Dans les entreprises ou établissements d'au moins mille salariés, l'employeur met en outre à la disposition de chaque section syndicale constituée par une organisation syndicale représentative dans l'entreprise ou l'établissement un local convenable, aménagé et doté du matériel nécessaire à son fonctionnement."
 },
 "L2411-3": {
  "id": "LEGIARTI000006902294",
  "date": "2026-08-23",
  "texte": "Le licenciement d'un délégué syndical ne peut intervenir qu'après autorisation de l'inspecteur du travail. Cette autorisation est également requise pour le licenciement de l'ancien délégué syndical, durant les douze mois suivant la date de cessation de ses fonctions, s'il a exercé ces dernières pendant au moins un an. Elle est également requise lorsque la lettre du syndicat notifiant à l'employeur la désignation du délégué syndical a été reçue par l'employeur ou lorsque le salarié a fait la preuve que l'employeur a eu connaissance de l'imminence de sa désignation comme délégué syndical, avant que le salarié ait été convoqué à l'entretien préalable au licenciement."
 },
 "L3346-1": {
  "id": "LEGIARTI000048488858",
  "date": "2026-08-23",
  "texte": "I.-Lorsqu'une entreprise qui est tenue de mettre en place un régime de participation en application des articles L. 3322-1 à L. 3322-5 et qui dispose d'un ou de plusieurs délégués syndicaux a ouvert une négociation pour mettre en œuvre un dispositif d'intéressement ou de participation, cette négociation porte également sur la définition d'une augmentation exceptionnelle de son bénéfice défini au 1° de l'article L. 3324-1 et sur les modalités de partage de la valeur avec les salariés qui en découlent. Pour l'application du premier alinéa du présent I, la définition de l'augmentation exceptionnelle du bénéfice prend en compte des critères tels que la taille de l'entreprise, le secteur d'activité, la survenance d'une ou de plusieurs opérations de rachat d'actions de l'entreprise suivie de leur annulation dès lors que ces opérations n'ont pas été précédées des attributions aux salariés dans les conditions prévues aux articles L. 225-197-1 à L. 225-197-5 , L. 22-10-59 et L. 22-10-60 du code de commerce, les bénéfices réalisés lors des années précédentes ou les événements exceptionnels externes à l'entreprise intervenus avant la réalisation du bénéfice. Le partage de la valeur mentionné au premier alinéa du présent I peut être mis en œuvre : 1° Soit par le versement du supplément de participation prévu à l'article L. 3324-9 ; 2° Soit par le versement du supplément d'intéressement prévu à l'article L. 3314-10 , lorsqu'un dispositif d'intéressement s'applique dans l'entreprise ; 3° Soit par l'ouverture d'une nouvelle négociation ayant pour objet de mettre en place un dispositif d'intéressement défini à l'article L. 3312-1 lorsqu'il n'existe pas dans l'entreprise, de verser un supplément mentionné aux articles L. 3314-10 et L. 3324-9 si l'accord en application duquel il est versé a donné lieu à un versement, d'abonder un plan d'épargne mentionné aux articles L. 3332-1, L. 3333-2 , L. 3334-2 ou L. 3334-4 du présent code ou à l' article L. 224-13 du code monétaire et financier ou de verser la prime de partage de la valeur mentionnée à l' article 1er de la loi n° 2022-1158 du 16 août 2022 portant mesures d'urgence pour la protection du pouvoir d'achat. II.-Le présent article ne s'applique pas aux entreprises qui ont mis en place un accord de participation ou d'intéressement comprenant déjà une clause spécifique prenant en compte les bénéfices exceptionnels ou un régime de participation comportant une base de calcul conduisant à un résultat plus favorable que la formule prévue à l'article L. 3324-1."
 },
 "L2242-17": {
  "id": "LEGIARTI000043893940",
  "date": "2026-08-23",
  "texte": "La négociation annuelle sur l'égalité professionnelle entre les femmes et les hommes et la qualité de vie et des conditions de travail porte sur : 1° L'articulation entre la vie personnelle et la vie professionnelle pour les salariés ; 2° Les objectifs et les mesures permettant d'atteindre l'égalité professionnelle entre les femmes et les hommes, notamment en matière de suppression des écarts de rémunération, d'accès à l'emploi, de formation professionnelle, de déroulement de carrière et de promotion professionnelle, de conditions de travail et d'emploi, en particulier pour les salariés à temps partiel, et de mixité des emplois. Cette négociation s'appuie sur les données mentionnées au 2° de l'article L. 2312-36 . Cette négociation porte également sur l'application de l'article L. 241-3-1 du code de la sécurité sociale et sur les conditions dans lesquelles l'employeur peut prendre en charge tout ou partie du supplément de cotisations ; 3° Les mesures permettant de lutter contre toute discrimination en matière de recrutement, d'emploi et d'accès à la formation professionnelle, en favorisant notamment les conditions d'accès aux critères définis aux II et III de l'article L. 6315-1 ; 4° Les mesures relatives à l'insertion professionnelle et au maintien dans l'emploi des travailleurs handicapés, notamment les conditions d'accès à l'emploi, à la formation et à la promotion professionnelles, les conditions de travail et d'emploi et les actions de sensibilisation de l'ensemble du personnel au handicap ; 5° Les modalités de définition d'un régime de prévoyance et, dans des conditions au moins aussi favorables que celles prévues à l'article L. 911-7 du code de la sécurité sociale, d'un régime de remboursements complémentaires de frais occasionnés par une maladie, une maternité ou un accident, à défaut de couverture par un accord de branche ou un accord d'entreprise. Dans les entreprises de travaux forestiers mentionnées au 3° de l'article L. 722-1 du code rural et de la pêche maritime, la négociation définie au premier alinéa du présent 5° porte sur l'accès aux garanties collectives mentionnées à l'article L. 911-2 du code de la sécurité sociale ; 6° L'exercice du droit d'expression directe et collective des salariés prévu au chapitre Ier du titre VIII du présent livre, notamment au moyen des outils numériques disponibles dans l'entreprise ; 7° Les modalités du plein exercice par le salarié de son droit à la déconnexion et la mise en place par l'entreprise de dispositifs de régulation de l'utilisation des outils numériques, en vue d'assurer le respect des temps de repos et de congé ainsi que de la vie personnelle et familiale. A défaut d'accord, l'employeur élabore une charte, après avis du comité social et économique. Cette charte définit ces modalités de l'exercice du droit à la déconnexion et prévoit en outre la mise en œuvre, à destination des salariés et du personnel d'encadrement et de direction, d'actions de formation et de sensibilisation à un usage raisonnable des outils numériques. 8° Dans les entreprises mentionnées à l'article L. 2143-3 du présent code et dont cinquante salariés au moins sont employés sur un même site, les mesures visant à améliorer la mobilité des salariés entre leur lieu de résidence habituelle et leur lieu de travail, notamment en réduisant le coût de la mobilité, en incitant à l'usage des modes de transport vertueux ainsi que par la prise en charge des frais mentionnés aux articles L. 3261-3 et L. 3261-3-1 ."
 },
 "L3132-2": {
  "id": "LEGIARTI000006902581",
  "date": "2026-08-23",
  "texte": "Le repos hebdomadaire a une durée minimale de vingt-quatre heures consécutives auxquelles s'ajoutent les heures consécutives de repos quotidien prévu au chapitre Ier."
 },
 "L3121-38": {
  "id": "LEGIARTI000038610163",
  "date": "2026-08-23",
  "texte": "A défaut d'accord, la contrepartie obligatoire sous forme de repos mentionnée à l'article L. 3121-30 est fixée à 50 % des heures supplémentaires accomplies au-delà du contingent annuel mentionné au même article L. 3121-30 pour les entreprises de vingt salariés au plus, et à 100 % de ces mêmes heures pour les entreprises de plus de vingt salariés. Pour l'application du premier alinéa du présent article, l'effectif salarié et le franchissement du seuil de vingt salariés sont déterminés selon les modalités prévues à l'article L. 130-1 du code de la sécurité sociale."
 },
 "L3121-64": {
  "id": "LEGIARTI000036262805",
  "date": "2026-08-23",
  "texte": "I.-L'accord prévoyant la conclusion de conventions individuelles de forfait en heures ou en jours sur l'année détermine : 1° Les catégories de salariés susceptibles de conclure une convention individuelle de forfait, dans le respect des articles L. 3121-56 et L. 3121-58 ; 2° La période de référence du forfait, qui peut être l'année civile ou toute autre période de douze mois consécutifs ; 3° Le nombre d'heures ou de jours compris dans le forfait, dans la limite de deux cent dix-huit jours s'agissant du forfait en jours ; 4° Les conditions de prise en compte, pour la rémunération des salariés, des absences ainsi que des arrivées et départs en cours de période ; 5° Les caractéristiques principales des conventions individuelles, qui doivent notamment fixer le nombre d'heures ou de jours compris dans le forfait. II.-L'accord autorisant la conclusion de conventions individuelles de forfait en jours détermine : 1° Les modalités selon lesquelles l'employeur assure l'évaluation et le suivi régulier de la charge de travail du salarié ; 2° Les modalités selon lesquelles l'employeur et le salarié communiquent périodiquement sur la charge de travail du salarié, sur l'articulation entre son activité professionnelle et sa vie personnelle, sur sa rémunération ainsi que sur l'organisation du travail dans l'entreprise ; 3° Les modalités selon lesquelles le salarié peut exercer son droit à la déconnexion prévu au 7° de l'article L. 2242-17 . L'accord peut fixer le nombre maximal de jours travaillés dans l'année lorsque le salarié renonce à une partie de ses jours de repos en application de l'article L. 3121-59 . Ce nombre de jours doit être compatible avec les dispositions du titre III du présent livre relatives au repos quotidien, au repos hebdomadaire et aux jours fériés chômés dans l'entreprise et avec celles du titre IV relatives aux congés payés."
 },
 "D3171-8": {
  "id": "LEGIARTI000018533970",
  "date": "2026-08-23",
  "texte": "Lorsque les salariés d'un atelier, d'un service ou d'une équipe, au sens de l'article D. 3171-7 , ne travaillent pas selon le même horaire collectif de travail affiché, la durée du travail de chaque salarié concerné est décomptée selon les modalités suivantes : 1° Quotidiennement, par enregistrement, selon tous moyens, des heures de début et de fin de chaque période de travail ou par le relevé du nombre d'heures de travail accomplies ; 2° Chaque semaine, par récapitulation selon tous moyens du nombre d'heures de travail accomplies par chaque salarié."
 },
 "L1222-4": {
  "id": "LEGIARTI000006900861",
  "date": "2026-08-23",
  "texte": "Aucune information concernant personnellement un salarié ne peut être collectée par un dispositif qui n'a pas été porté préalablement à sa connaissance."
 },
 "L1234-19": {
  "id": "LEGIARTI000006901138",
  "date": "2026-08-23",
  "texte": "A l'expiration du contrat de travail, l'employeur délivre au salarié un certificat dont le contenu est déterminé par voie réglementaire."
 },
 "L1132-4": {
  "id": "LEGIARTI000045391813",
  "date": "2026-08-23",
  "texte": "Toute disposition ou tout acte pris à l'égard d'un salarié en méconnaissance des dispositions du présent chapitre ou du II de l'article 10-1 de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique est nul."
 },
 "L1132-3-3": {
  "id": "LEGIARTI000045391816",
  "date": "2026-08-23",
  "texte": "Aucune personne ayant témoigné, de bonne foi, de faits constitutifs d'un délit ou d'un crime dont elle a eu connaissance dans l'exercice de ses fonctions ou ayant relaté de tels faits ne peut faire l'objet des mesures mentionnées à l'article L. 1121-2 . Les personnes mentionnées au premier alinéa du présent article bénéficient des protections prévues aux I et III de l'article 10-1 et aux articles 12 à 13-1 de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique."
 },
 "R4542-16": {
  "id": "LEGIARTI000018528838",
  "date": "2026-08-23",
  "texte": "L'employeur assure l'information et la formation des travailleurs sur les modalités d'utilisation de l'écran et de l'équipement de travail dans lequel cet écran est intégré. Chaque travailleur en bénéficie avant sa première affectation à un travail sur écran de visualisation et chaque fois que l'organisation du poste de travail est modifiée de manière substantielle."
 },
 "R4121-1-1": {
  "id": "LEGIARTI000031818152",
  "date": "2026-08-23",
  "texte": "L'employeur consigne, en annexe du document unique : 1° Les données collectives utiles à l'évaluation des expositions individuelles aux facteurs de risques mentionnés à l'article L. 4161-1 de nature à faciliter la déclaration mentionnée à cet article, le cas échéant à partir de l'identification de postes, métiers ou situations de travail figurant dans un accord collectif étendu ou un référentiel professionnel de branche homologué mentionnés à l'article L. 4161-2 ; 2° La proportion de salariés exposés aux facteurs de risques professionnels mentionnés à l'article L. 4161-1, au-delà des seuils prévus au même article. Cette proportion est actualisée en tant que de besoin lors de la mise à jour du document unique."
 },
 "D4622-22": {
  "id": "LEGIARTI000045676988",
  "date": "2026-08-23",
  "texte": "Les droits et obligations réciproques du service de prévention et de santé au travail interentreprises et de ses adhérents sont déterminés dans les statuts ou le règlement intérieur de celui-ci. Ces statuts et ce règlement sont communiqués à l'entreprise, lors de la demande d'adhésion, avec la grille des cotisations du service de prévention et de santé au travail interentreprises et un document détaillant les contreparties individualisées de l'adhésion. L'employeur adresse au service de prévention et de santé au travail un document précisant le nombre et la catégorie des travailleurs à suivre et les risques professionnels auxquels ils sont exposés, notamment les risques mentionnés à l'article R. 4624-23 , qui permettent au travailleur de bénéficier d'un suivi individuel renforcé de son état de santé. Ce document est établi en cohérence avec l'évaluation des risques prévue à l'article L. 4121-3 et le recensement des postes exposés à des facteurs de risques prévu à l'article R. 4624-46 après avis du ou des médecins du travail concernés ainsi que du comité social et économique s'il existe. Ce document est mis à jour chaque année selon les mêmes modalités. Il est tenu à disposition du directeur régional des entreprises, de la concurrence, de la consommation, du travail et de l'emploi."
 },
 "R4227-4": {
  "id": "LEGIARTI000018532137",
  "date": "2026-08-23",
  "texte": "Les établissements comportent des dégagements tels que portes, couloirs, circulations, escaliers, rampes, répartis de manière à permettre une évacuation rapide de tous les occupants dans des conditions de sécurité maximale. Ces dégagements sont toujours libres. Aucun objet, marchandise ou matériel ne doit faire obstacle à la circulation des personnes ou réduire la largeur des dégagements au-dessous des minima fixés à l'article R. 4227-5 . Ces dégagements sont disposés de manière à éviter les culs-de-sac."
 },
 "R4323-91": {
  "id": "LEGIARTI000018531314",
  "date": "2026-08-23",
  "texte": "Les équipements de protection individuelle sont appropriés aux risques à prévenir et aux conditions dans lesquelles le travail est accompli. Ils ne sont pas eux-mêmes à l'origine de risques supplémentaires. Ils doivent pouvoir être portés, le cas échéant, après ajustement, dans des conditions compatibles avec le travail à accomplir et avec les principes de l'ergonomie."
 },
 "L4153-9": {
  "id": "LEGIARTI000006903188",
  "date": "2026-08-23",
  "texte": "Par dérogation aux dispositions de l'article L. 4153-8 , les travailleurs de moins de dix-huit ans ne peuvent être employés à certaines catégories de travaux mentionnés à ce même article que sous certaines conditions déterminées par voie réglementaire."
 },
 "R4624-29": {
  "id": "LEGIARTI000045371016",
  "date": "2026-08-23",
  "texte": "En vue de favoriser le maintien dans l'emploi, les travailleurs en arrêt de travail d'une durée de plus de trente jours peuvent bénéficier d'une visite de préreprise."
 },
 "R4228-10": {
  "id": "LEGIARTI000018531982",
  "date": "2026-08-23",
  "texte": "Il existe au moins un cabinet d'aisance et un urinoir pour vingt hommes et deux cabinets pour vingt femmes. L'effectif pris en compte est le nombre maximal de travailleurs présents simultanément dans l'établissement. Un cabinet au moins comporte un poste d'eau. Dans les établissements employant un personnel mixte, les cabinets d'aisance sont séparés pour le personnel féminin et masculin. Les cabinets d'aisance réservés aux femmes comportent un récipient pour garnitures périodiques."
 },
 "R4228-19": {
  "id": "LEGIARTI000018531960",
  "date": "2026-08-23",
  "texte": "Il est interdit de laisser les travailleurs prendre leur repas dans les locaux affectés au travail."
 },
 "R4412-38": {
  "id": "LEGIARTI000036483735",
  "date": "2026-08-23",
  "texte": "L'employeur veille à ce que les travailleurs ainsi que le comité social et économique : 1° Reçoivent des informations sous des formes appropriées et périodiquement actualisées sur les agents chimiques dangereux se trouvant sur le lieu de travail, telles que notamment leurs noms, les risques pour la santé et la sécurité qu'ils comportent et, le cas échéant, les valeurs limites d'exposition professionnelle et les valeurs limites biologiques qui leur sont applicables ; 2° Aient accès aux fiches de données de sécurité fournies par le fournisseur des agents chimiques ; 3° Reçoivent une formation et des informations sur les précautions à prendre pour assurer leur protection et celle des autres travailleurs présents sur le lieu de travail. Sont notamment portées à leur connaissance les consignes relatives aux mesures d'hygiène à respecter et à l'utilisation des équipements de protection individuelle."
 },
 "R4412-39": {
  "id": "LEGIARTI000018530861",
  "date": "2026-08-23",
  "texte": "L'employeur établit une notice, dénommée notice de poste, pour chaque poste de travail ou situation de travail exposant les travailleurs à des agents chimiques dangereux. Cette notice, actualisée en tant que de besoin, est destinée à informer les travailleurs des risques auxquels leur travail peut les exposer et des dispositions prises pour les éviter. La notice rappelle les règles d'hygiène applicables ainsi que, le cas échéant, les consignes relatives à l'emploi des équipements de protection collective ou individuelle."
 },
 "R4153-40": {
  "id": "LEGIARTI000033769318",
  "date": "2026-08-23",
  "texte": "L'employeur ou le responsable de l'établissement mentionné à l'article L. 4111-1 et le chef d'établissement mentionné aux articles R. 4153-38 et R. 4153-39 peuvent, pour une durée de trois ans à compter de l'envoi de la déclaration prévue à l'article R. 4153-41 , affecter des jeunes aux travaux interdits susceptibles de dérogation mentionnés à la section 2 du présent chapitre, sous réserve de satisfaire aux conditions suivantes : 1° Avoir procédé à l'évaluation prévue aux articles L. 4121-3 et suivants, comprenant une évaluation des risques existants pour les jeunes et liés à leur travail ; cette évaluation est préalable à l'affectation des jeunes à leurs postes de travail ; 2° Avoir, à la suite de cette évaluation, mis en œuvre les actions de prévention prévues au deuxième alinéa de l'article L. 4121-3 ; 3° Avant toute affectation du jeune à ces travaux : a) Pour l'employeur, en application des articles L. 4141-1 et suivants, avoir informé le jeune sur les risques pour sa santé et sa sécurité et les mesures prises pour y remédier et lui avoir dispensé la formation à la sécurité en s'assurant qu'elle est adaptée à son âge, son niveau de formation et son expérience professionnelle ; b) Pour le chef d'établissement, lui avoir dispensé la formation à la sécurité prévue dans le cadre de la formation professionnelle assurée, adaptée à son âge, son niveau de formation et son expérience professionnelle et en avoir organisé l'évaluation. Dans les établissements mentionnés au 4° de l'article R. 4153-39 , par dérogation aux dispositions qui précèdent, le chef d'établissement doit avoir mis en œuvre l'information et la formation mentionnées au a ou, lorsque la formation assurée conduit à un diplôme technologique ou professionnel, avoir mis en œuvre la formation à la sécurité et son évaluation mentionnées au b. 4° Assurer l'encadrement du jeune en formation par une personne compétente durant l'exécution de ces travaux ; 5° Avoir obtenu, pour chaque jeune, la délivrance d'un avis médical d'aptitude. Cet avis médical est délivré chaque année soit par le médecin du travail pour les salariés, soit par le médecin chargé du suivi médical des élèves et des étudiants, des stagiaires de la formation professionnelle ou des jeunes accueillis dans les établissements mentionnés au 4° de l'article R. 4153-39. Tout jeune affecté aux travaux mentionnés au premier alinéa bénéficie du suivi individuel renforcé de son état de santé prévu aux articles R. 4624-22 à R. 4624-28 en application du II de l'article R. 4624-23 ."
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
