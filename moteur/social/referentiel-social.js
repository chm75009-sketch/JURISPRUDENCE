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
const fs = require("fs");
const M = require("./moteur-social.js");

const TEXTES = JSON.parse(fs.readFileSync(__dirname + "/textes-social.json", "utf8"));

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
