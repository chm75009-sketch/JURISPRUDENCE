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
