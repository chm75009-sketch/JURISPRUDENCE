/* Moteur d'audit « discipline » — version navigateur (MoteurDiscipline).

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/discipline, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : 96fc0791379a
   {"articlesLus":32,"articlesReprisDuModuleSocial":8,"natures":8,"controles":25,"exposition":1,"coherence":0,"donneesDemandees":65,"casContradictoires":35,"verdicts":925,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0}
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
  var __MANIFESTE = {"domaine":"discipline et règlement intérieur","date":"2026-09-03","empreinte":"96fc0791379a","fichiers":{"audit-discipline-client.js":"23dae70c5876","capturer-textes-discipline.js":"d944486c715f","controle-ri.js":"331dbb74419e","controles-discipline.js":"26d0e34547c1","dates.js":"5d945470174f","epreuve-controle-ri.js":"18d48daf6dcf","epreuve-parcours-ri.js":"de5ff42b157a","fiche-discipline.json":"b26efd82ccf5","modeles-discipline.js":"4e72843d7ec7","moteur-discipline.js":"5c8ebf97fed2","outils.js":"6defb2be2a2b","propositions-discipline.js":"1d9fdaeebce4","questionnaire-discipline.js":"acdfd4207fc5","regularisation-discipline.js":"4665227fcaa7","tests-controle-ri.js":"4a7c1f15c77b","tests-discipline.js":"7f7c196f35a8","textes-discipline.json":"2b24f89c0608","verifier-textes-discipline.js":"4b42770e1257"},"compteurs":{"articlesLus":32,"articlesReprisDuModuleSocial":8,"natures":8,"controles":25,"exposition":1,"coherence":0,"donneesDemandees":65,"casContradictoires":35,"verdicts":925,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"expositionConcluantConforme":0},"textesRelus":{"date":"2026-08-24","articles":32,"concordants":32,"ecarts":0,"sansConclusion":0}};
  var __REGISTRE = (function () { var r = null || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

__def("./audit-discipline-client.js", function(module, exports, require){
/* Le rapport du module « discipline et règlement intérieur ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Toute phrase juridique vient d'un contrôle, qui la tient d'un article
   lu à la source ou d'une décision lue dans la base Judilibre. */
const O = require("./outils.js");
const M = require("./moteur-discipline.js");
const { C, ETATS, DETECTION, COHERENCE, ARRETS } = require("./controles-discipline.js");
const { R } = require("./regularisation-discipline.js");
const { MODELES } = require("./modeles-discipline.js");
const DT = require("../commun/parcours-deux-temps.js");
const CR = require("./controle-ri.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;
const dit = x => x === true || x === "oui";
const vide = x => x === undefined || x === null || x === "";

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF);
  /* « Sans objet » recouvrait deux choses opposées, et les disait du même mot.
     Le contrôle qui attend le règlement intérieur — parce que l'entreprise est
     tenue d'en avoir un et n'en a pas — n'est pas écarté : il s'appliquera le
     jour où le règlement existera, c'est-à-dire au terme du travail que le
     rapport demande dans le même souffle. Lui laisser lire « l'exigence ne
     s'applique pas » au moment où il rédige son règlement est le meilleur
     moyen de lui faire écrire un règlement incomplet. Ces contrôles sortent
     donc du bloc « Sans objet » et prennent le leur, juste après les
     non-conformités. */
  const att = V.filter(x => x.v.etat === SO && x.v.enAttente);
  const so = V.filter(x => x.v.etat === SO && !x.v.enAttente);

  sur("Audit — discipline et règlement intérieur · sanction, procédure, garanties de fond");
  t1(f.entreprise ? `Discipline et règlement intérieur — ${f.entreprise}` : "Discipline et règlement intérieur");
  trait();

  /* --- le règlement intérieur : dû ou non --- */
  const d = M.riDu(f);
  h1("Ce que l'effectif commande");
  p(d.motif);
  note("Le règlement intérieur est le siège du pouvoir disciplinaire : il fixe la nature et l'échelle des sanctions (L. 1321-1, 3°). Une sanction autre que le licenciement ne peut être prononcée que si elle y est prévue, chez l'employeur tenu d'en établir un, et une mise à pied disciplinaire n'est licite que si le règlement en précise la durée maximale.");

  /* --- la mesure auditée --- */
  const q = M.qualification(f);
  const e = M.entretienDu(f);
  h1("La mesure auditée");
  if (!(f.sanction || {}).auditee)
    p("Aucune sanction n'est soumise à l'audit, ou la question n'est pas renseignée : seul le règlement intérieur est examiné.");
  else if (!q.connu) p(q.motif);
  else {
    p(`Nature déclarée : ${q.nature}. ${q.motifNature}`);
    if (e.motif) p(e.motif);
  }
  if (dit((f.sanction || {}).salarieProtege))
    enc("Le salarié est titulaire d'un mandat — ce module ne l'audite pas",
      "Un statut protecteur s'ajoute à tout ce qui suit : la sanction, et à plus forte raison le licenciement, obéissent alors à une procédure spéciale que cette page ne vérifie pas et sur laquelle elle ne conclut rien. Faites-la vérifier avant toute décision : ce rapport ne dit rien de sa régularité.");
  else if (vide((f.sanction || {}).salarieProtege))
    note("Il n'est pas indiqué si le salarié est titulaire d'un mandat représentatif ou syndical. Si c'est le cas, un statut protecteur s'ajoute, que ce module n'audite pas.");

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
  bloc("Non conforme", nc, "Un texte n'est pas respecté, ou une garantie de fond a été méconnue. Le motif dit lequel, et pourquoi.");
  bloc("En attente du règlement intérieur", att,
    "Ces exigences ne sont PAS écartées. Elles portent sur le contenu et les formalités d'un règlement intérieur que l'entreprise est tenue d'avoir et n'a pas. Le jour où il existera, elles s'appliqueront toutes, immédiatement et sans autre condition. Elles ne sont donc pas à traiter après la rédaction du règlement : elles SONT le cahier des charges de cette rédaction. Le document que l'application produit sous DIS-CTL-RI-01 porte déjà chacune des clauses vérifiées ici.");
  bloc("Risque à vérifier", rq, "La règle dépend d'une appréciation que l'application ne fait pas à votre place.");
  bloc("Donnée manquante", mq, "Aucune conclusion n'en est tirée, dans aucun sens : complétez, puis relancez.");
  bloc("Conforme", ok, null);
  bloc("Sans objet", so, "L'exigence ne s'applique pas, et une donnée renseignée permet de le dire.");

  /* --- la garantie de fond, rappelée telle qu'elle a été lue --- */
  h1("La garantie de fond, dans les termes de la Cour de cassation");
  note("Ces décisions ont été lues à la source dans la base Judilibre. Elles sont citées pour ce qu'elles disent, et rien de plus.");
  p(ARRETS.garantieFond);
  p(ARRETS.avertissementRI);
  p(ARRETS.avertissementCCN);
  p(ARRETS.avisTardif);
  p(ARRETS.tousLesTermes);
  p(ARRETS.sanctionPrevueRI);
  p(ARRETS.sanctionPrevueRI2);
  p(ARRETS.carenceInspection);

  /* --- la mesure du travail fait --- */
  h1("Ce que cet audit a mesuré");
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
    ["Contrôles exécutés", `${C.length}`, "Chacun est fondé sur un article lu à la source, ou sur une décision lue dans Judilibre, cités dans son motif."],
    ["Non-conformités", `${nc.length}`, "Un texte n'est pas respecté."],
    ["Risques à vérifier", `${rq.length}`, "Une appréciation reste à faire."],
    ["Données manquantes", `${mq.length}`, "Aucune conclusion n'en a été tirée."],
    ["Sans objet", `${so.length}`, "L'exigence ne s'applique pas ici."],
    ["Contrôles d'exposition", `${DETECTION.length}`, "Ils mesurent ce à quoi l'employeur s'expose ; ils ne délivrent jamais de blanc-seing."],
    ["Contrôles de cohérence", `${COHERENCE.length}`, "Ils comparent les données entre elles."],
  ]);
  note("Ce que cette page ne fait pas : elle n'apprécie ni la réalité des faits, ni leur caractère fautif, ni la proportionnalité de la sanction à la faute. Le conseil de prud'hommes apprécie la régularité de la procédure et si les faits sont de nature à justifier une sanction ; si un doute subsiste, il profite au salarié (L. 1333-1). Il peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée (L. 1333-2).");

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
   modeles-discipline.js. Rend null si aucun modèle n'est écrit pour cet id. */
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

/* La branche « oui » : le règlement intérieur existe déjà, on le contrôle.
   Le module rend l'analyse, la version corrigée, et la grille qui les fonde. */
module.exports.controleRI = {
  analyser: CR.analyser, corriger: CR.corriger, texteCorrige: CR.texteCorrige,
  GRILLE: CR.GRILLE, ETATS: CR.ETATS, article: CR.article,
};

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

__def("./moteur-discipline.js", function(module, exports, require){
/* Le régime de la discipline et du règlement intérieur, côté employeur : ce que
   les textes commandent, et rien d'autre.

   QUATRE RÈGLES DE MÉTHODE :

   1. Le règlement intérieur est obligatoire à partir de cinquante salariés
      (L. 1311-2), au terme d'un délai de douze mois à compter du franchissement
      du seuil (L. 1311-2, second alinéa ; R. 1321-5). En dessous, il reste
      facultatif — mais s'il existe, il obéit aux mêmes règles de contenu et aux
      mêmes formalités : L. 1321-1 à L. 1321-6 ne posent aucun seuil.

   2. La procédure disciplinaire de L. 1332-2 n'est pas due pour « un
      avertissement ou une sanction de même nature n'ayant pas d'incidence,
      immédiate ou non, sur la présence dans l'entreprise, la fonction, la
      carrière ou la rémunération du salarié ». Le critère est donc l'INCIDENCE,
      pas l'étiquette. Certaines sanctions la portent par construction — une
      mise à pied disciplinaire suspend le contrat et la rémunération, une
      rétrogradation change la fonction — et le moteur le dit avec son motif ;
      pour l'avertissement, le blâme et les sanctions non nommées, l'incidence
      est demandée, jamais devinée.

   3. Une garantie de fond conventionnelle ou de règlement intérieur déplace la
      règle. La Cour de cassation l'a jugé deux fois dans les termes que le
      module reprend :
        — Soc., 8 septembre 2021, n° 19-15.039 (publié) : « La consultation d'un
          organisme chargé, en vertu d'une disposition conventionnelle ou d'un
          règlement intérieur, de donner son avis sur un licenciement envisagé
          par un employeur constitue une garantie de fond, en sorte que le
          licenciement prononcé sans que cet organisme ait été consulté ne peut
          avoir de cause réelle et sérieuse. L'irrégularité commise dans le
          déroulement de la procédure disciplinaire prévue par une disposition
          conventionnelle ou un règlement intérieur, est assimilée à la
          violation d'une garantie de fond et rend le licenciement sans cause
          réelle et sérieuse lorsqu'elle a privé le salarié de droits de sa
          défense ou lorsqu'elle est susceptible d'avoir exercé en l'espèce une
          influence sur la décision finale de licenciement par l'employeur. »
        — Soc., 3 mai 2011, n° 10-14.104 (publié) : « L'employeur qui n'est pas
          tenu en principe de convoquer un salarié avant de lui notifier un
          avertissement, est tenu de le faire dès lors qu'au regard d'un
          règlement intérieur l'avertissement peut avoir une influence sur le
          maintien du salarié dans l'entreprise. Tel est le cas lorsque le
          règlement intérieur, instituant ainsi une garantie de fond, subordonne
          le licenciement d'un salarié à l'existence de deux sanctions
          antérieures pouvant être constituées notamment par un avertissement. »
          Même solution au regard d'une convention collective : Soc.,
          22 septembre 2021, n° 18-22.204 (publié).

   4. Le moteur rend les qualifications, les seuils et les échéances ; il ne
      prononce rien. Les contrôles prononcent, et une donnée absente ne produit
      jamais une conformité.

   Chaque règle écrite ici l'est sur un article lu à la source
   (textes-discipline.json, identifiants LEGIARTI) ou sur une décision lue à la
   source dans la base Judilibre. Ce qui n'a pas pu être lu n'est pas codé.   */
const D = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x
  : (typeof x === "string" && x.trim() !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

/* ------------------------------------------------------------ les natures

   L'étiquette ne décide pas : c'est l'incidence sur la présence, la fonction,
   la carrière ou la rémunération qui commande l'entretien préalable
   (L. 1332-2). Trois natures la portent par construction, et le motif dit
   pourquoi ; les autres la font demander. */
const NATURES = {
  "avertissement": { incidence: null,
    motif: "L'avertissement est nommément visé par l'exception de L. 1332-2 : la convocation n'est pas due s'il n'a aucune incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération." },
  "blâme": { incidence: null,
    motif: "Le blâme n'est pas nommé par L. 1332-2 : il relève de l'exception s'il est « une sanction de même nature » que l'avertissement, c'est-à-dire sans incidence sur la présence, la fonction, la carrière ou la rémunération. L'incidence est déclarée, jamais présumée." },
  "mise à pied disciplinaire": { incidence: true, misePied: true,
    motif: "La mise à pied disciplinaire suspend le contrat et la rémunération pendant sa durée : elle a une incidence immédiate sur la présence dans l'entreprise et sur la rémunération, de sorte que l'exception de L. 1332-2 ne peut pas la couvrir." },
  "mutation disciplinaire": { incidence: true,
    motif: "La mutation prononcée à titre disciplinaire change le poste ou le lieu de travail : elle a une incidence sur la fonction, de sorte que l'exception de L. 1332-2 ne peut pas la couvrir." },
  "rétrogradation": { incidence: true,
    motif: "La rétrogradation modifie la qualification et, le plus souvent, la rémunération : elle a une incidence sur la fonction et la carrière, de sorte que l'exception de L. 1332-2 ne peut pas la couvrir." },
  "licenciement disciplinaire": { incidence: true, licenciement: true,
    motif: "Le licenciement met fin au contrat : il a par définition une incidence sur la présence dans l'entreprise. Sa procédure n'est toutefois pas celle de L. 1332-2 mais celle du licenciement, et sa contestation relève, non du chapitre III du titre III du livre III, mais des règles du licenciement (L. 1333-3)." },
  "sanction pécuniaire ou amende": { incidence: true, pecuniaire: true,
    motif: "Une amende ou toute autre sanction pécuniaire est interdite, et toute disposition ou stipulation contraire est réputée non écrite (L. 1331-2)." },
  "autre sanction": { incidence: null,
    motif: "La sanction n'est pas nommée : son incidence sur la présence, la fonction, la carrière ou la rémunération est déclarée, jamais présumée." },
};

/* L'effectif, apprécié tel qu'il est déclaré. */
function effectif(f) {
  const e = nombre(f.effectif);
  if (e === null) return { connu: false, valeur: null,
    motif: "L'effectif de l'entreprise n'est pas renseigné : le seuil de cinquante salariés de l'article L. 1311-2 ne peut pas être apprécié." };
  return { connu: true, valeur: e, motif: `Effectif déclaré : ${e} salariés.` };
}

/* Le règlement intérieur est-il obligatoire ? (L. 1311-2, R. 1321-5) */
function riDu(f) {
  const e = effectif(f);
  if (!e.connu) return { connu: false, du: null, motif: e.motif };
  if (e.valeur < 50) return { connu: true, du: false,
    motif: `Effectif de ${e.valeur} salariés (moins de cinquante) : l'établissement d'un règlement intérieur n'est pas obligatoire (L. 1311-2). S'il en existe un, il obéit néanmoins à toutes les règles de contenu et à toutes les formalités des articles L. 1321-1 à L. 1321-6, qui ne posent aucun seuil.` };
  const ri = f.ri || {};
  const delai = { atteint: null, mois: null };
  if (renseigne(ri.dateFranchissementSeuil)) {
    const ec = D.ecart(ri.dateFranchissementSeuil, f.dateAudit,
      "la date à laquelle le seuil de cinquante salariés a été atteint", "la date de l'audit");
    if (ec.valide) { delai.mois = Math.round((ec.jours / 30.4375) * 10) / 10; delai.atteint = ec.jours >= 365; }
  }
  return { connu: true, du: true, delai,
    motif: `Effectif de ${e.valeur} salariés (au moins cinquante) : l'établissement d'un règlement intérieur est obligatoire (L. 1311-2, premier alinéa). L'obligation s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil a été atteint (L. 1311-2, second alinéa ; R. 1321-5)` +
      (delai.mois === null ? ", date que le dossier ne renseigne pas."
        : `. Le seuil est déclaré atteint depuis environ ${delai.mois} mois.`) };
}

/* La qualification de la mesure auditée (L. 1331-1) et son incidence
   (L. 1332-2). */
function qualification(f) {
  const s = f.sanction || {};
  if (!renseigne(s.nature)) return { connu: false, motif:
    "La nature de la mesure n'est pas renseignée : constitue une sanction toute mesure, autre que les observations verbales, prise par l'employeur à la suite d'un agissement du salarié considéré comme fautif, qu'elle affecte ou non immédiatement la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération (L. 1331-1)." };
  const n = NATURES[s.nature];
  if (!n) return { connu: false, nature: s.nature, motif:
    `La nature déclarée (« ${s.nature} ») n'est pas une de celles que le module sait qualifier : aucune conséquence n'en est tirée.` };
  const out = { connu: true, nature: s.nature, licenciement: !!n.licenciement,
    misePied: !!n.misePied, pecuniaire: !!n.pecuniaire, motifNature: n.motif };
  if (n.incidence === true) { out.incidence = true; out.incidenceDeclaree = false; return out; }
  if (!renseigne(s.incidence)) { out.incidence = null; out.incidenceDeclaree = true; return out; }
  out.incidence = dit(s.incidence); out.incidenceDeclaree = true;
  return out;
}

/* La garantie de fond : ce que le règlement intérieur ou la convention
   collective ajoutent à la loi.

   Deux figures distinctes, et le module les tient séparées :
     — une procédure conventionnelle ou de règlement intérieur (consultation
       d'un conseil de discipline, d'une commission paritaire, entretien imposé,
       autre formalité) : Soc., 8 septembre 2021, n° 19-15.039 ;
     — un règlement intérieur ou une convention collective qui subordonne le
       licenciement à l'existence de sanctions antérieures, ce qui donne à
       l'avertissement lui-même une influence sur le maintien dans l'entreprise
       et impose l'entretien préalable : Soc., 3 mai 2011, n° 10-14.104 ;
       Soc., 22 septembre 2021, n° 18-22.204.                                 */
function garantieDeFond(f) {
  const g = f.garantie || {};
  const out = {};
  out.procedure = renseigne(g.procedureApplicable) ? (dit(g.procedureApplicable) ? "oui" : "non") : null;
  out.suivie = renseigne(g.suivie) ? g.suivie : null;
  out.nature = renseigne(g.nature) ? g.nature : null;
  out.subordination = renseigne(g.licenciementSubordonneSanctions)
    ? (dit(g.licenciementSubordonneSanctions) ? "oui" : "non") : null;
  out.source = renseigne(g.source) ? g.source : null;
  return out;
}

/* L'entretien préalable est-il dû ? (L. 1332-2, et la garantie de fond) */
function entretienDu(f) {
  const q = qualification(f);
  const g = garantieDeFond(f);
  if (!q.connu) return { connu: false, du: null, motif: q.motif };
  if (q.licenciement) return { connu: true, du: null, licenciement: true,
    motif: "La mesure auditée est un licenciement disciplinaire : la procédure applicable n'est pas celle de L. 1332-2 mais celle du licenciement pour motif personnel, que ce module n'audite pas. La prescription des faits (L. 1332-4), l'interdiction des sanctions pécuniaires (L. 1331-2) et les garanties de fond conventionnelles ou de règlement intérieur, elles, s'appliquent au licenciement disciplinaire, et sont contrôlées ici." };
  if (q.incidence === true) return { connu: true, du: true, fondement: "L. 1332-2",
    motif: `La sanction a une incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération : l'exception de L. 1332-2 ne joue pas, la convocation et l'entretien préalable sont dus. ${q.motifNature}` };
  if (g.subordination === "oui") return { connu: true, du: true, fondement: "garantie de fond",
    motif: "Le règlement intérieur ou la convention collective subordonne le licenciement à l'existence de sanctions antérieures : la sanction, fût-elle un avertissement, peut avoir une influence sur le maintien du salarié dans l'entreprise. Cette stipulation institue une garantie de fond, et l'entretien préalable est dû alors même que L. 1332-2 ne l'imposerait pas (Soc., 3 mai 2011, n° 10-14.104, publié ; Soc., 22 septembre 2021, n° 18-22.204, publié)." };
  if (q.incidence === null || g.subordination === null)
    return { connu: false, du: null, motif:
      "L'entretien préalable ne peut pas être apprécié : il faut savoir si la sanction a une incidence sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération (L. 1332-2), et si le règlement intérieur ou la convention collective subordonne le licenciement à l'existence de sanctions antérieures — auquel cas l'entretien est dû même pour un avertissement (Soc., 3 mai 2011, n° 10-14.104)." };
  return { connu: true, du: false, fondement: "L. 1332-2",
    motif: `La sanction est déclarée sans incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération, et ni le règlement intérieur ni la convention collective ne subordonnent le licenciement à des sanctions antérieures : la convocation n'est pas due (L. 1332-2). ${q.motifNature}` };
}

/* La date à laquelle les poursuites disciplinaires ont été engagées.

   R. 1332-1 le dit : la lettre de convocation est adressée « dans le délai de
   deux mois fixé à l'article L. 1332-4 ». C'est donc l'envoi de la convocation
   qui engage les poursuites ; à défaut de convocation, c'est la notification de
   la sanction elle-même. */
function dateEngagement(f) {
  const s = f.sanction || {};
  if (renseigne(s.dateConvocation)) return { date: s.dateConvocation, quoi: "l'envoi de la lettre de convocation (R. 1332-1)" };
  if (renseigne(s.dateNotification)) return { date: s.dateNotification, quoi: "la notification de la sanction, aucune convocation n'ayant été envoyée" };
  return { date: null, quoi: null };
}

/* Le même quantième, n mois plus tard — la règle de R. 1332-3, appliquée aussi
   au délai de deux mois de L. 1332-4, qui se compte de la même façon. */
function moisApres(iso, n) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const an = a + Math.floor((m - 1 + n) / 12), mo = ((m - 1 + n) % 12) + 1;
  const dernier = new Date(Date.UTC(an, mo, 0)).getUTCDate();
  const jour = Math.min(j, dernier);
  return `${an}-${String(mo).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}
const jourSemaine = iso => new Date(iso + "T12:00:00Z").getUTCDay();   /* 0 = dimanche */

/* La prorogation de R. 1332-3 : « Lorsque le dernier jour de ce délai est un
   samedi, un dimanche ou un jour férié ou chômé, le délai est prorogé jusqu'au
   premier jour ouvrable suivant. » L'application ne tient pas le calendrier des
   jours fériés — elle proroge donc le samedi et le dimanche, et signale que le
   report peut aller au-delà. */
function prorogerOuvrable(iso) {
  if (!D.estDateISO(iso)) return null;
  let d = iso, tours = 0;
  while (tours < 3) {
    const s = jourSemaine(d);
    if (s !== 0 && s !== 6) return d;
    const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + 1);
    d = t.toISOString().slice(0, 10); tours++;
  }
  return d;
}

/* La prescription des faits fautifs : deux mois à compter du jour où
   l'employeur en a eu connaissance (L. 1332-4). */
function prescriptionFaits(f) {
  const s = f.sanction || {};
  const eng = dateEngagement(f);
  if (!renseigne(s.dateConnaissance) || !eng.date)
    return { connu: false, motif: "La date à laquelle l'employeur a eu connaissance des faits, ou la date d'engagement des poursuites (envoi de la convocation, à défaut notification de la sanction), n'est pas renseignée : le délai de deux mois de L. 1332-4 ne peut pas être vérifié." };
  const ec = D.ecart(s.dateConnaissance, eng.date,
    "la date de connaissance des faits par l'employeur", "la date d'engagement des poursuites disciplinaires");
  if (!ec.valide) return { connu: false, motif: ec.motif };
  const limite = moisApres(s.dateConnaissance, 2);
  return { connu: true, jours: ec.jours, limite, engagement: eng,
    depasse: eng.date > limite,
    penales: renseigne(s.poursuitesPenales) ? dit(s.poursuitesPenales) : null };
}

/* La prescription des sanctions antérieures : trois ans (L. 1332-5). */
function sanctionsAnterieures(f) {
  const s = f.sanction || {};
  if (!renseigne(s.sanctionsAnterieuresInvoquees))
    return { connu: false, motif: "Il n'est pas indiqué si des sanctions antérieures sont invoquées à l'appui de la nouvelle sanction (L. 1332-5)." };
  if (nie(s.sanctionsAnterieuresInvoquees)) return { connu: true, invoquees: false };
  const eng = dateEngagement(f);
  if (!renseigne(s.dateSanctionAnterieurePlusAncienne) || !eng.date)
    return { connu: false, invoquees: true, motif: "Des sanctions antérieures sont invoquées, mais la date de la plus ancienne d'entre elles, ou la date d'engagement des poursuites, n'est pas renseignée : le délai de trois ans de L. 1332-5 ne peut pas être vérifié." };
  const ec = D.ecart(s.dateSanctionAnterieurePlusAncienne, eng.date,
    "la date de la sanction antérieure la plus ancienne invoquée", "la date d'engagement des poursuites disciplinaires");
  if (!ec.valide) return { connu: false, invoquees: true, motif: ec.motif };
  const limite = moisApres(s.dateSanctionAnterieurePlusAncienne, 36);
  return { connu: true, invoquees: true, jours: ec.jours, limite,
    depasse: eng.date > limite, engagement: eng };
}

/* Le délai entre l'entretien et la notification : « La sanction ne peut
   intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour
   fixé pour l'entretien » (L. 1332-2), le mois se comptant selon R. 1332-3.

   Les jours ouvrables sont tous les jours de la semaine sauf le dimanche et les
   jours fériés. L'application ne tient pas le calendrier des jours fériés :
   elle compte les jours non dominicaux, et le dit. Quand le compte tombe
   exactement sur le minimum, un jour férié dans l'intervalle suffirait à le
   faire passer en dessous : le contrôle rend alors « risque à vérifier », et
   non « conforme ». */
function joursOuvrables(depuis, jusqu) {
  if (!D.estDateISO(depuis) || !D.estDateISO(jusqu)) return null;
  let n = 0;
  const t = new Date(depuis + "T12:00:00Z"), fin = new Date(jusqu + "T12:00:00Z");
  while (t < fin) { t.setUTCDate(t.getUTCDate() + 1); if (t.getUTCDay() !== 0) n++; }
  return n;
}

function delaiNotification(f) {
  const s = f.sanction || {};
  if (!renseigne(s.dateEntretien) || !renseigne(s.dateNotification))
    return { connu: false, motif: "La date de l'entretien ou la date de notification de la sanction n'est pas renseignée : les délais de L. 1332-2 — au moins deux jours ouvrables, au plus un mois — ne peuvent pas être vérifiés." };
  const ec = D.ecart(s.dateEntretien, s.dateNotification,
    "la date de l'entretien préalable", "la date de notification de la sanction");
  if (!ec.valide) return { connu: false, motif: ec.motif };
  const ouvrables = joursOuvrables(s.dateEntretien, s.dateNotification);
  const limite = moisApres(s.dateEntretien, 1);
  const limiteProrogee = prorogerOuvrable(limite);
  const depassement = D.ecart(limiteProrogee, s.dateNotification).valide
    ? D.ecart(limiteProrogee, s.dateNotification).jours : 0;
  return { connu: true, jours: ec.jours, ouvrables, limite, limiteProrogee,
    trop: s.dateNotification > limiteProrogee, depassement,
    prorogee: limiteProrogee !== limite };
}

/* L'entrée en vigueur du règlement intérieur : postérieure d'un mois à
   l'accomplissement des formalités de publicité (L. 1321-4), le délai courant
   à compter de la dernière en date des formalités de publicité et de dépôt
   (R. 1321-3). */
function entreeVigueurRI(f) {
  const ri = f.ri || {};
  if (!renseigne(ri.dateDerniereFormalite) || !renseigne(ri.dateEntreeVigueur))
    return { connu: false, motif: "La date de la dernière des formalités de publicité et de dépôt, ou la date d'entrée en vigueur inscrite au règlement intérieur, n'est pas renseignée : le délai d'un mois de L. 1321-4 ne peut pas être vérifié." };
  const ec = D.ecart(ri.dateDerniereFormalite, ri.dateEntreeVigueur,
    "la dernière des formalités de publicité et de dépôt", "la date d'entrée en vigueur inscrite au règlement intérieur");
  if (!ec.valide) return { connu: false, motif: ec.motif };
  const plancher = moisApres(ri.dateDerniereFormalite, 1);
  return { connu: true, jours: ec.jours, plancher, suffisant: ri.dateEntreeVigueur > plancher };
}

module.exports = { NATURES, effectif, riDu, qualification, garantieDeFond, entretienDu,
  dateEngagement, prescriptionFaits, sanctionsAnterieures, delaiNotification,
  entreeVigueurRI, moisApres, joursOuvrables, prorogerOuvrable };

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

__def("./controles-discipline.js", function(module, exports, require){
/* Les contrôles de la discipline et du règlement intérieur, côté employeur.

   L'objet du module : vérifier qu'un règlement intérieur existe là où il est
   obligatoire, qu'il porte ce que la loi lui impose et rien de ce qu'elle lui
   interdit, qu'il a été soumis aux formalités substantielles — avis du comité,
   publicité, dépôt au greffe du conseil de prud'hommes, communication à
   l'inspection du travail — et qu'une sanction envisagée ou prononcée respecte
   la procédure disciplinaire, ses délais et les garanties de fond que le
   règlement intérieur ou la convention collective ajoutent à la loi.

   CE QUI NE SE CONTRÔLE PAS ICI, ET QU'IL FAUT DIRE :
     — la réalité et la gravité des faits fautifs : elles s'apprécient au fond,
       l'employeur en fournit les éléments et le doute profite au salarié
       (L. 1333-1). Le module ne dit jamais qu'une sanction est justifiée ;
     — la proportionnalité de la sanction à la faute : le conseil de prud'hommes
       peut annuler une sanction disproportionnée (L. 1333-2) — c'est son
       office, pas celui d'un questionnaire ;
     — le statut protecteur du salarié titulaire d'un mandat : le module le
       SIGNALE (contrôle d'exposition) et ne l'audite pas ;
     — la procédure du licenciement disciplinaire elle-même, qui n'est pas celle
       de L. 1332-2 (L. 1333-3) ;
     — le contrôle d'exposition (DIS-CTL-EXP-01) ne rend JAMAIS « conforme » :
       la régularité d'une sanction se juge, et un blanc-seing serait faux.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ».

   Les décisions citées ont été lues à la source dans la base Judilibre de la
   Cour de cassation, et ne sont citées que pour ce qu'elles disent.          */
const M = require("./moteur-discipline.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Les décisions, citées telles qu'elles ont été lues. */
const ARRETS = {
  garantieFond: "Soc., 8 septembre 2021, n° 19-15.039, publié : « La consultation d'un organisme chargé, en vertu d'une disposition conventionnelle ou d'un règlement intérieur, de donner son avis sur un licenciement envisagé par un employeur constitue une garantie de fond, en sorte que le licenciement prononcé sans que cet organisme ait été consulté ne peut avoir de cause réelle et sérieuse. L'irrégularité commise dans le déroulement de la procédure disciplinaire prévue par une disposition conventionnelle ou un règlement intérieur, est assimilée à la violation d'une garantie de fond et rend le licenciement sans cause réelle et sérieuse lorsqu'elle a privé le salarié de droits de sa défense ou lorsqu'elle est susceptible d'avoir exercé en l'espèce une influence sur la décision finale de licenciement par l'employeur. »",
  avisTardif: "Soc., 20 mars 2024, n° 22-17.292, publié : le caractère tardif de la demande d'avis prévue par le règlement intérieur avant le prononcé d'une sanction constitue une irrégularité dans le déroulement de la procédure disciplinaire, et il appartient au juge de rechercher si cette irrégularité a privé le salarié de la possibilité d'assurer utilement sa défense ou est susceptible d'avoir exercé une influence sur la décision finale de sanctionner par l'employeur.",
  avertissementRI: "Soc., 3 mai 2011, n° 10-14.104, publié : « L'employeur qui n'est pas tenu en principe de convoquer un salarié avant de lui notifier un avertissement, est tenu de le faire dès lors qu'au regard d'un règlement intérieur l'avertissement peut avoir une influence sur le maintien du salarié dans l'entreprise. Tel est le cas lorsque le règlement intérieur, instituant ainsi une garantie de fond, subordonne le licenciement d'un salarié à l'existence de deux sanctions antérieures pouvant être constituées notamment par un avertissement. »",
  avertissementCCN: "Soc., 22 septembre 2021, n° 18-22.204, publié : même solution au regard d'une convention collective — si l'employeur n'est en principe pas tenu de convoquer un salarié à un entretien préalable avant de lui notifier un avertissement ou une sanction de même nature, il en va autrement lorsque, au regard des dispositions d'une convention collective, la sanction peut avoir une influence sur le maintien du salarié dans l'entreprise ; tel est le cas lorsque la convention collective, instituant une garantie de fond, subordonne le licenciement à l'existence de deux sanctions antérieures. Il appartient alors à la juridiction prud'homale d'apprécier si ces sanctions, irrégulières en la forme, doivent être annulées (L. 1333-2).",
  tousLesTermes: "Soc., 16 avril 2008, n° 06-41.999, publié : « Dès lors qu'il a choisi de convoquer le salarié selon les modalités de l'article L. 122-41 du code du travail [devenu L. 1332-2], l'employeur est tenu d'en respecter tous les termes, quelle que soit la sanction finalement infligée. » La cour d'appel qui avait annulé des avertissements notifiés plus d'un mois après les entretiens préalables en avait fait une exacte application.",
  sanctionPrevueRI: "Soc., 26 octobre 2010, n° 09-42.740, publié : « Une sanction disciplinaire ne peut être prononcée contre un salarié que si elle est prévue par le règlement intérieur de l'entreprise et une mise à pied disciplinaire prévue par ce règlement intérieur n'est licite que si ce règlement précise sa durée maximale. »",
  sanctionPrevueRI2: "Soc., 23 mars 2017, n° 15-23.090, publié : « Une sanction disciplinaire autre que le licenciement ne peut être prononcée contre un salarié par un employeur employant habituellement au moins vingt salariés que si elle est prévue par le règlement intérieur prescrit par l'article L. 1311-2 du code du travail. » Le seuil auquel cette décision renvoie est celui de L. 1311-2, aujourd'hui de cinquante salariés dans la version lue à la source.",
  carenceInspection: "Soc., 28 mars 2000, n° 97-43.411, publié : « La carence de l'employeur dans l'accomplissement de la formalité de communication du règlement intérieur à l'inspection du Travail ne prive pas le salarié de la possibilité de se prévaloir de ce règlement. »",
};

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* Le garde des contrôles qui portent sur le contenu ou les formalités du
   règlement intérieur : sans règlement intérieur, rien ne s'en contrôle —
   l'obligation d'en établir un, elle, relève de DIS-CTL-RI-01.

   MAIS « SANS OBJET » NE VEUT PAS DIRE LA MÊME CHOSE DANS LES DEUX CAS, et
   c'est le défaut que ce garde portait. Deux situations très différentes
   recevaient le même mot :

   - le règlement n'est PAS DÛ (moins de cinquante salariés, ou seuil franchi
     depuis moins de douze mois) et l'entreprise n'en a pas : le contrôle est
     réellement sans objet, il ne s'appliquera pas tant que rien ne change ;

   - le règlement EST DÛ et l'entreprise n'en a pas : le contrôle n'est pas
     sans objet, il est EN ATTENTE. Il s'appliquera intégralement le jour où
     le règlement existera — c'est-à-dire tout de suite, puisque l'employeur
     est en train d'y être contraint par DIS-CTL-RI-01. Lui laisser lire
     « n'a pas d'objet » sur les onze contrôles de contenu revient à lui
     faire croire que le contenu du règlement ne le concerne pas, au moment
     précis où il s'apprête à le rédiger.

   L'état reste « sans objet » — il n'y en a que cinq dans le dépôt, et rien
   ne serait gagné à en inventer un sixième que ni le rapport ni le parcours
   ne sauraient traiter. C'est le motif qui dit la vérité, et il la dit à
   l'endroit où l'employeur la lit. */
function siRI(f, suite) {
  const ri = f.ri || {};
  if (vide(ri.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si l'entreprise s'est dotée d'un règlement intérieur : ni son contenu ni ses formalités ne peuvent être contrôlés." };
  if (nie(ri.existe)) {
    const d = M.riDu(f);
    if (d.connu && d.du) return { etat: SO, enAttente: true, motif:
      "EN ATTENTE DU RÈGLEMENT INTÉRIEUR — ce contrôle n'est pas écarté, il est suspendu. " +
      "L'entreprise est tenue d'établir un règlement intérieur (DIS-CTL-RI-01) et n'en a pas. " +
      "Le jour où il existera, cette exigence s'appliquera intégralement, sans délai supplémentaire " +
      "et sans autre condition : elle est donc à traiter en même temps que la rédaction du règlement, " +
      "non après. L'application rédige ce règlement pour vous — le document produit sous DIS-CTL-RI-01 " +
      "porte déjà la clause que ce contrôle vérifiera." };
    if (!d.connu) return { etat: MANQ, motif:
      "Aucun règlement intérieur n'existe, et le dossier ne permet pas de dire si l'entreprise est " +
      "tenue d'en établir un : " + d.motif + " Tant que ce point n'est pas tranché, ce contrôle ne " +
      "peut être dit ni sans objet ni en attente." };
    return { etat: SO, motif:
      "Aucun règlement intérieur n'existe, et l'entreprise n'est pas tenue d'en établir un : " + d.motif +
      " Ce contrôle est donc réellement sans objet aujourd'hui. Il reprendrait tout son effet si " +
      "l'entreprise se dotait volontairement d'un règlement — les articles L. 1321-1 à L. 1321-6 ne " +
      "posent aucun seuil et s'imposent alors en entier." };
  }
  return suite(ri);
}

/* Le garde des contrôles qui portent sur une sanction : sans sanction auditée,
   la procédure disciplinaire n'a rien à contrôler. */
function siSanction(f, suite) {
  const s = f.sanction || {};
  if (vide(s.auditee)) return { etat: MANQ, motif: "Il n'est pas indiqué si une sanction envisagée ou prononcée est soumise à l'audit : la procédure disciplinaire ne peut pas être contrôlée." };
  if (nie(s.auditee)) return { etat: SO, motif: "Aucune sanction n'est soumise à l'audit : ce contrôle n'a pas d'objet. Seul le règlement intérieur est examiné." };
  return suite(s);
}

/* ============================================ LE RÈGLEMENT INTÉRIEUR ====== */

ctl("DIS-CTL-RI-01", "Règlement intérieur",
  "Un règlement intérieur a-t-il été établi là où il est obligatoire ?",
  ["L. 1311-2", "R. 1321-5"],
  f => {
    const d = M.riDu(f);
    if (!d.connu) return { etat: MANQ, motif: d.motif };
    if (!d.du) return { etat: SO, motif: d.motif };
    const ri = f.ri || {};
    if (vide(ri.existe)) return { etat: MANQ, motif: d.motif + " Il n'est pas indiqué si un règlement intérieur a été établi." };
    if (dit(ri.existe)) return { etat: CONF, motif: d.motif + " Un règlement intérieur est établi. Son contenu et ses formalités sont contrôlés par ailleurs." };
    if (d.delai && d.delai.atteint === false)
      return { etat: SO, motif: d.motif + ` Le seuil est atteint depuis environ ${d.delai.mois} mois, soit moins de douze : l'obligation ne s'applique pas encore (L. 1311-2, second alinéa ; R. 1321-5). Elle s'appliquera au terme du délai.` };
    if (!d.delai || d.delai.atteint === null)
      return { etat: RISQ, motif: d.motif + " Aucun règlement intérieur n'est établi. L'obligation ne s'applique qu'au terme d'un délai de douze mois à compter du franchissement du seuil, et la date de ce franchissement n'est pas renseignée : renseignez-la pour que le manquement puisse être constaté ou écarté." };
    return { etat: NC, motif: d.motif + " Aucun règlement intérieur n'est établi, alors que le délai de douze mois est écoulé : l'obligation de L. 1311-2 n'est pas tenue." };
  });

ctl("DIS-CTL-RI-02", "Règlement intérieur",
  "Le règlement intérieur porte-t-il les trois matières que L. 1321-1 lui réserve ?",
  ["L. 1321-1"],
  f => siRI(f, ri => {
    if (vide(ri.contenuSanteSecurite) && vide(ri.contenuParticipation) && vide(ri.contenuDiscipline))
      return { etat: MANQ, motif: "Le contenu du règlement intérieur n'est pas décrit. L'employeur y fixe exclusivement : 1° les mesures d'application de la réglementation en matière de santé et de sécurité, notamment les instructions prévues à l'article L. 4122-1 ; 2° les conditions dans lesquelles les salariés peuvent être appelés à participer au rétablissement de conditions de travail protectrices ; 3° les règles générales et permanentes relatives à la discipline, notamment la nature et l'échelle des sanctions (L. 1321-1)." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(ri.contenuSanteSecurite, "les mesures d'application de la réglementation en matière de santé et de sécurité, notamment les instructions prévues à l'article L. 4122-1, n'y figurent pas (L. 1321-1, 1°)", "les mesures de santé et de sécurité (L. 1321-1, 1°)");
    point(ri.contenuParticipation, "les conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices n'y figurent pas (L. 1321-1, 2°)", "les conditions de participation au rétablissement des conditions de travail (L. 1321-1, 2°)");
    point(ri.contenuDiscipline, "les règles générales et permanentes relatives à la discipline n'y figurent pas (L. 1321-1, 3°)", "les règles de discipline (L. 1321-1, 3°)");
    if (griefs.length) return { etat: NC, motif: `Le règlement intérieur est incomplet : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `Le contenu du règlement intérieur est incomplètement décrit — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Le règlement intérieur porte les trois matières de L. 1321-1 : santé et sécurité, participation au rétablissement de conditions de travail protectrices, discipline. Leur suffisance au fond ne se lit pas sur une case cochée — le contrôle constate qu'elles y figurent." };
  }));

ctl("DIS-CTL-RI-03", "Règlement intérieur",
  "L'échelle des sanctions est-elle fixée, et la durée maximale de la mise à pied disciplinaire précisée ?",
  ["L. 1321-1, 3°"],
  f => siRI(f, ri => {
    if (vide(ri.echelleSanctions) && vide(ri.misePiedDureeMax))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur fixe la nature et l'échelle des sanctions que peut prendre l'employeur (L. 1321-1, 3°), ni s'il précise la durée maximale de la mise à pied disciplinaire. " + ARRETS.sanctionPrevueRI };
    const griefs = [], manques = [];
    if (vide(ri.echelleSanctions)) manques.push("la nature et l'échelle des sanctions (L. 1321-1, 3°)");
    else if (nie(ri.echelleSanctions)) griefs.push("la nature et l'échelle des sanctions que peut prendre l'employeur n'y sont pas fixées, alors que L. 1321-1, 3°, les vise expressément — et qu'une sanction non prévue par le règlement intérieur ne peut pas être prononcée");
    if (vide(ri.misePiedDureeMax)) manques.push("la durée maximale de la mise à pied disciplinaire");
    else if (nie(ri.misePiedDureeMax)) griefs.push("la durée maximale de la mise à pied disciplinaire n'y est pas précisée : une mise à pied disciplinaire prévue par le règlement intérieur n'est licite que si ce règlement précise sa durée maximale");
    if (griefs.length) return { etat: NC, motif: `L'échelle des sanctions est défaillante : ${griefs.join(" ; ")}. ${ARRETS.sanctionPrevueRI}` };
    if (manques.length) return { etat: MANQ, motif: `L'échelle des sanctions est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Le règlement intérieur fixe la nature et l'échelle des sanctions (L. 1321-1, 3°) et précise la durée maximale de la mise à pied disciplinaire. " + ARRETS.sanctionPrevueRI };
  }));

ctl("DIS-CTL-RI-04", "Règlement intérieur",
  "Le règlement intérieur rappelle-t-il les trois dispositions que L. 1321-2 lui impose de rappeler ?",
  ["L. 1321-2"],
  f => siRI(f, ri => {
    if (vide(ri.rappelDroitsDefense) && vide(ri.rappelHarcelement) && vide(ri.rappelLanceursAlerte))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur rappelle : 1° les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3 ou par la convention collective applicable ; 2° les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ; 3° l'existence du dispositif de protection des lanceurs d'alerte (L. 1321-2)." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(ri.rappelDroitsDefense, "les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3, ou par la convention collective applicable, ne sont pas rappelées (L. 1321-2, 1°)", "le rappel des droits de la défense (L. 1321-2, 1°)");
    point(ri.rappelHarcelement, "les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ne sont pas rappelées (L. 1321-2, 2°)", "le rappel des dispositions sur les harcèlements et les agissements sexistes (L. 1321-2, 2°)");
    point(ri.rappelLanceursAlerte, "l'existence du dispositif de protection des lanceurs d'alerte n'est pas rappelée (L. 1321-2, 3°)", "le rappel du dispositif de protection des lanceurs d'alerte (L. 1321-2, 3°)");
    if (griefs.length) return { etat: NC, motif: `Les rappels imposés par L. 1321-2 ne sont pas tous faits : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `Les rappels du règlement intérieur sont incomplètement décrits — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Le règlement intérieur rappelle les droits de la défense, les dispositions sur les harcèlements et les agissements sexistes, et l'existence du dispositif de protection des lanceurs d'alerte : L. 1321-2 est respecté en l'état déclaré." };
  }));

ctl("DIS-CTL-RI-05", "Règlement intérieur",
  "Le règlement intérieur est-il exempt des clauses que L. 1321-3 interdit, et la clause de neutralité éventuelle est-elle justifiée et proportionnée ?",
  ["L. 1321-3", "L. 1321-2-1"],
  f => siRI(f, ri => {
    if (vide(ri.clausesInterdites) && vide(ri.clauseNeutralite))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur comporte des clauses de celles que L. 1321-3 prohibe — dispositions contraires aux lois, règlements, conventions et accords collectifs ; restrictions aux droits des personnes et aux libertés qui ne seraient pas justifiées par la nature de la tâche ni proportionnées au but recherché ; dispositions discriminatoires — ni s'il comporte une clause de neutralité (L. 1321-2-1)." };
    if (dit(ri.clausesInterdites))
      return { etat: NC, motif: "Le règlement intérieur comporte des clauses relevant de L. 1321-3 : dispositions contraires aux lois et règlements ou aux stipulations conventionnelles, restrictions aux droits des personnes et aux libertés individuelles et collectives non justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché, ou dispositions discriminant les salariés. Ces dispositions doivent être retirées ; l'inspecteur du travail peut à tout moment en exiger le retrait ou la modification (L. 1322-1)." };
    if (vide(ri.clausesInterdites))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur comporte des clauses prohibées par L. 1321-3." };
    if (vide(ri.clauseNeutralite))
      return { etat: MANQ, motif: "Aucune clause prohibée par L. 1321-3 n'est déclarée, mais il n'est pas indiqué si le règlement intérieur comporte une clause de neutralité (L. 1321-2-1)." };
    if (nie(ri.clauseNeutralite))
      return { etat: CONF, motif: "Aucune clause prohibée par L. 1321-3 n'est déclarée, et le règlement intérieur ne comporte pas de clause de neutralité. Cette conformité est celle du dossier déclaré : la justification et la proportionnalité d'une restriction s'apprécient clause par clause, et l'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1)." };
    if (vide(ri.neutraliteJustifieeProportionnee))
      return { etat: MANQ, motif: "Le règlement intérieur comporte une clause de neutralité : il n'est pas indiqué si les restrictions qu'elle apporte sont justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, et proportionnées au but recherché (L. 1321-2-1)." };
    if (nie(ri.neutraliteJustifieeProportionnee))
      return { etat: NC, motif: "Le règlement intérieur comporte une clause de neutralité dont les restrictions ne sont ni justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, ni proportionnées au but recherché : L. 1321-2-1 n'autorise la clause qu'à cette double condition, et L. 1321-3, 2°, prohibe les restrictions qui n'y satisfont pas." };
    return { etat: RISQ, motif: "Le règlement intérieur comporte une clause de neutralité déclarée justifiée et proportionnée. Cette double condition de L. 1321-2-1 s'apprécie au fond, clause par clause et au regard du poste concerné : le contrôle constate la déclaration, il ne juge pas la clause. Documentez la justification retenue." };
  }));

ctl("DIS-CTL-RI-06", "Formalités du règlement intérieur",
  "Le règlement intérieur a-t-il été soumis à l'avis du comité social et économique avant son introduction ?",
  ["L. 1321-4"],
  f => siRI(f, ri => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe : la formalité de L. 1321-4 — le règlement intérieur ne peut être introduit qu'après avoir été soumis à son avis — ne peut pas être contrôlée." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique n'est déclaré : l'avis de L. 1321-4 n'a pas d'objet ici. La régularité de cette absence relève du module « comité social et économique » de l'application ; si un comité existe en réalité, son avis conditionne l'introduction du règlement intérieur." };
    if (vide(ri.avisCSE)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur a été soumis à l'avis du comité social et économique (L. 1321-4)." };
    if (nie(ri.avisCSE)) return { etat: NC, motif: "Le règlement intérieur n'a pas été soumis à l'avis du comité social et économique : L. 1321-4 dispose qu'il « ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique », et cette exigence vaut également en cas de modification ou de retrait de ses clauses. L'avis accompagne, en outre, le règlement communiqué à l'inspecteur du travail." };
    return { etat: CONF, motif: "Le règlement intérieur a été soumis à l'avis du comité social et économique avant son introduction, conformément à L. 1321-4." };
  }));

ctl("DIS-CTL-RI-07", "Formalités du règlement intérieur",
  "La publicité a-t-elle été faite, et l'entrée en vigueur est-elle postérieure d'un mois à la dernière formalité ?",
  ["R. 1321-1", "L. 1321-4", "R. 1321-3"],
  f => siRI(f, ri => {
    if (vide(ri.publicite)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur est porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1)." };
    if (nie(ri.publicite)) return { etat: NC, motif: "Le règlement intérieur n'est pas porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche : R. 1321-1 l'impose, et le délai d'un mois précédant l'entrée en vigueur court à compter de la dernière en date des formalités de publicité et de dépôt (R. 1321-3)." };
    const v = M.entreeVigueurRI(f);
    if (!v.connu) return { etat: MANQ, motif: "La publicité est faite, mais " + v.motif.charAt(0).toLowerCase() + v.motif.slice(1) };
    if (!v.suffisant) return { etat: NC, motif: `Le règlement intérieur indique une entrée en vigueur au ${(f.ri || {}).dateEntreeVigueur}, soit ${v.jours} jour(s) après la dernière des formalités de publicité et de dépôt (${(f.ri || {}).dateDerniereFormalite}). L. 1321-4 exige que cette date soit postérieure d'un mois à l'accomplissement des formalités de publicité, le délai courant à compter de la dernière en date des formalités de publicité et de dépôt définies aux articles R. 1321-1 et R. 1321-2 (R. 1321-3) : la date la plus proche possible était le ${v.plancher} exclu.` };
    return { etat: CONF, motif: `Le règlement intérieur est porté à la connaissance des personnes ayant accès aux lieux de travail (R. 1321-1), et son entrée en vigueur au ${(f.ri || {}).dateEntreeVigueur} est postérieure de ${v.jours} jour(s) à la dernière des formalités, soit plus d'un mois (L. 1321-4 ; R. 1321-3).` };
  }));

ctl("DIS-CTL-RI-08", "Formalités du règlement intérieur",
  "Le règlement intérieur a-t-il été déposé au greffe du conseil de prud'hommes ?",
  ["R. 1321-2", "R. 1321-3"],
  f => siRI(f, ri => {
    if (vide(ri.depotGreffe)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur a été déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement (R. 1321-2)." };
    if (nie(ri.depotGreffe)) return { etat: NC, motif: "Le règlement intérieur n'a pas été déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement : R. 1321-2 l'impose, et le délai d'un mois précédant l'entrée en vigueur court à compter de la dernière en date des formalités de publicité et de dépôt (R. 1321-3) — tant que le dépôt n'est pas fait, ce délai n'a pas commencé de courir." };
    return { etat: CONF, motif: "Le règlement intérieur est déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement, conformément à R. 1321-2." };
  }));

ctl("DIS-CTL-RI-09", "Formalités du règlement intérieur",
  "Le règlement intérieur, accompagné de l'avis du comité, a-t-il été communiqué à l'inspecteur du travail en deux exemplaires ?",
  ["L. 1321-4", "R. 1321-4"],
  f => siRI(f, ri => {
    if (vide(ri.communicationInspection)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur, accompagné de l'avis du comité social et économique, a été communiqué à l'inspecteur du travail (L. 1321-4), en deux exemplaires (R. 1321-4)." };
    if (nie(ri.communicationInspection)) return { etat: NC, motif: "Le règlement intérieur n'a pas été communiqué à l'inspecteur du travail : L. 1321-4 impose qu'il le soit, accompagné de l'avis du comité social et économique, en même temps qu'il fait l'objet des mesures de publicité, et R. 1321-4 précise qu'il est transmis en deux exemplaires. Cette carence ne fait pas disparaître le règlement pour autant — " + ARRETS.carenceInspection };
    if (vide(ri.communicationDeuxExemplaires))
      return { etat: MANQ, motif: "Le règlement intérieur est communiqué à l'inspecteur du travail, mais il n'est pas indiqué s'il l'a été en deux exemplaires (R. 1321-4)." };
    if (nie(ri.communicationDeuxExemplaires))
      return { etat: NC, motif: "Le règlement intérieur est communiqué à l'inspecteur du travail, mais pas en deux exemplaires, comme R. 1321-4 l'exige. " + ARRETS.carenceInspection };
    return { etat: CONF, motif: "Le règlement intérieur, accompagné de l'avis du comité social et économique, est communiqué à l'inspecteur du travail en deux exemplaires (L. 1321-4 ; R. 1321-4)." };
  }));

ctl("DIS-CTL-RI-10", "Règlement intérieur",
  "Le règlement intérieur est-il rédigé en français ?",
  ["L. 1321-6"],
  f => siRI(f, ri => {
    if (vide(ri.redigeFrancais)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur est rédigé en français (L. 1321-6)." };
    if (nie(ri.redigeFrancais)) return { etat: NC, motif: "Le règlement intérieur n'est pas rédigé en français : L. 1321-6 l'impose. Il peut être accompagné de traductions en une ou plusieurs langues étrangères, mais la version française est celle qui s'impose ; il en va de même pour tout document comportant des obligations pour le salarié ou des dispositions dont la connaissance est nécessaire à l'exécution de son travail." };
    return { etat: CONF, motif: "Le règlement intérieur est rédigé en français, conformément à L. 1321-6." };
  }));

ctl("DIS-CTL-RI-11", "Formalités du règlement intérieur",
  "Les modifications du règlement intérieur et les notes de service générales et permanentes ont-elles suivi les mêmes formalités ?",
  ["L. 1321-4", "L. 1321-5"],
  f => siRI(f, ri => {
    const griefs = [], manques = [];
    if (vide(ri.modifieDepuis)) manques.push("l'existence de modifications ou de retraits de clauses depuis l'introduction du règlement (L. 1321-4, dernier alinéa)");
    else if (dit(ri.modifieDepuis)) {
      if (vide(ri.modificationsFormalites)) manques.push("les formalités accomplies pour ces modifications — avis du comité, publicité, dépôt, communication à l'inspection");
      else if (nie(ri.modificationsFormalites)) griefs.push("des clauses ont été modifiées ou retirées sans que les formalités de L. 1321-4 soient accomplies, alors que ce texte dispose expressément que ses dispositions « s'appliquent également en cas de modification ou de retrait des clauses du règlement intérieur »");
    }
    if (vide(ri.notesServiceGenerales)) manques.push("l'existence de notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 (L. 1321-5)");
    else if (dit(ri.notesServiceGenerales)) {
      if (vide(ri.notesServiceFormalites)) manques.push("les formalités accomplies pour ces notes de service");
      else if (nie(ri.notesServiceFormalites)) griefs.push("des notes de service comportant des obligations générales et permanentes dans les matières mentionnées aux articles L. 1321-1 et L. 1321-2 ont été prises sans les formalités du titre, alors que L. 1321-5 les considère comme des adjonctions au règlement intérieur et les y soumet en toute hypothèse — sauf urgence, pour les seules obligations de santé et de sécurité, qui sont alors immédiatement et simultanément communiquées au secrétaire du comité social et économique et à l'inspection du travail");
    }
    if (griefs.length) return { etat: NC, motif: `Les formalités n'ont pas suivi : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `Les modifications et notes de service sont incomplètement décrites — il manque : ${manques.join(" ; ")}.` };
    if (nie(ri.modifieDepuis) && nie(ri.notesServiceGenerales))
      return { etat: SO, motif: "Aucune modification ni retrait de clause depuis l'introduction du règlement intérieur, et aucune note de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 : les formalités de L. 1321-4 et L. 1321-5 n'ont pas eu à jouer." };
    return { etat: CONF, motif: "Les modifications du règlement intérieur, ou les notes de service comportant des obligations générales et permanentes, ont suivi les formalités du titre — avis du comité, publicité, dépôt, communication à l'inspection (L. 1321-4, dernier alinéa ; L. 1321-5)." };
  }));

ctl("DIS-CTL-RI-12", "Formalités du règlement intérieur",
  "L'inspecteur du travail a-t-il exigé le retrait ou la modification de dispositions, et cette demande a-t-elle été suivie d'effet ?",
  ["L. 1322-1", "L. 1322-2", "L. 1322-3"],
  f => siRI(f, ri => {
    if (vide(ri.demandeInspection)) return { etat: MANQ, motif: "Il n'est pas indiqué si l'inspecteur du travail a exigé le retrait ou la modification de dispositions du règlement intérieur : il peut le faire à tout moment pour les dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1)." };
    if (nie(ri.demandeInspection)) return { etat: SO, motif: "Aucune demande de retrait ou de modification de l'inspecteur du travail n'est déclarée : L. 1322-1 n'a pas eu à jouer. Il peut l'exiger à tout moment ; sa décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité social et économique (L. 1322-2), et peut faire l'objet d'un recours hiérarchique (L. 1322-3)." };
    if (vide(ri.suiteDemandeInspection)) return { etat: MANQ, motif: "L'inspecteur du travail a exigé le retrait ou la modification de dispositions du règlement intérieur (L. 1322-1) : il n'est pas indiqué si cette demande a été suivie d'effet, ni si un recours hiérarchique a été formé (L. 1322-3)." };
    if (nie(ri.suiteDemandeInspection)) return { etat: NC, motif: "L'inspecteur du travail a exigé le retrait ou la modification de dispositions du règlement intérieur et cette demande n'a pas été suivie d'effet : L. 1322-1 lui permet de l'exiger à tout moment pour les dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6. Sa décision est motivée et notifiée (L. 1322-2) ; la voie ouverte est le recours hiérarchique (L. 1322-3), non l'inaction." };
    return { etat: CONF, motif: "La demande de retrait ou de modification formée par l'inspecteur du travail (L. 1322-1) a été suivie d'effet." };
  }));

/* ================================================ LA SANCTION AUDITÉE ===== */

ctl("DIS-CTL-SAN-01", "Procédure disciplinaire",
  "Les griefs ont-ils été portés par écrit à la connaissance du salarié ?",
  ["L. 1332-1", "L. 1331-1"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (vide(s.griefsEcrits)) return { etat: MANQ, motif: "Il n'est pas indiqué si le salarié a été informé, par écrit, des griefs retenus contre lui. Aucune sanction ne peut être prise sans que le salarié en soit informé, dans le même temps et par écrit (L. 1332-1) — l'exigence vaut pour toute sanction au sens de L. 1331-1, c'est-à-dire toute mesure autre que les observations verbales." };
    if (nie(s.griefsEcrits)) return { etat: NC, motif: `La mesure déclarée (« ${q.nature} ») a été prise sans que le salarié soit informé, dans le même temps et par écrit, des griefs retenus contre lui : L. 1332-1 l'interdit. Cette exigence ne connaît pas l'exception que L. 1332-2 réserve à l'avertissement : elle porte sur toute sanction au sens de L. 1331-1.` };
    return { etat: CONF, motif: "Le salarié a été informé, dans le même temps et par écrit, des griefs retenus contre lui (L. 1332-1)." };
  }));

ctl("DIS-CTL-SAN-02", "Procédure disciplinaire",
  "La sanction est-elle exempte de tout caractère pécuniaire ?",
  ["L. 1331-2", "L. 1333-2"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (q.pecuniaire) return { etat: NC, motif: "La sanction déclarée est une amende ou une sanction pécuniaire : « Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite » (L. 1331-2). Une telle sanction est encourue devant le conseil de prud'hommes, qui peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée (L. 1333-2). La retenue sur salaire correspondant à une mise à pied disciplinaire régulièrement prononcée n'est pas une sanction pécuniaire : elle est la conséquence de la suspension du contrat." };
    if (vide(s.retenueSalaire)) return { etat: MANQ, motif: "Il n'est pas indiqué si la sanction s'accompagne d'une retenue sur la rémunération autre que celle qui résulterait de la suspension du contrat pendant une mise à pied disciplinaire (L. 1331-2)." };
    if (dit(s.retenueSalaire)) return { etat: NC, motif: "La sanction s'accompagne d'une retenue sur la rémunération qui n'est pas la conséquence d'une suspension du contrat : c'est une sanction pécuniaire, que L. 1331-2 interdit — toute disposition ou stipulation contraire étant réputée non écrite." };
    return { etat: CONF, motif: "La sanction ne comporte ni amende ni retenue sur la rémunération étrangère à une suspension du contrat : l'interdiction de L. 1331-2 est respectée." };
  }));

ctl("DIS-CTL-SAN-03", "Procédure disciplinaire",
  "La sanction prononcée est-elle prévue par le règlement intérieur ?",
  ["L. 1321-1, 3°", "L. 1311-2"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (q.licenciement) return { etat: SO, motif: "La mesure auditée est un licenciement : l'exigence n'a pas d'objet — « Une sanction disciplinaire AUTRE QUE LE LICENCIEMENT ne peut être prononcée contre un salarié par un employeur employant habituellement au moins vingt salariés que si elle est prévue par le règlement intérieur » (" + ARRETS.sanctionPrevueRI2 + ")" };
    const d = M.riDu(f);
    if (!d.connu) return { etat: MANQ, motif: d.motif + " " + ARRETS.sanctionPrevueRI2 };
    if (!d.du) return { etat: SO, motif: d.motif + " L'exigence tirée du règlement intérieur suppose que l'employeur soit tenu d'en établir un : " + ARRETS.sanctionPrevueRI2 };
    const ri = f.ri || {};
    if (nie(ri.existe)) return { etat: NC, motif: "L'employeur est tenu d'établir un règlement intérieur et n'en a aucun : la sanction prononcée ne peut donc pas y être prévue. " + ARRETS.sanctionPrevueRI2 + " " + ARRETS.sanctionPrevueRI };
    if (vide(s.prevueRI)) return { etat: MANQ, motif: "Il n'est pas indiqué si la sanction prononcée figure dans l'échelle des sanctions du règlement intérieur. " + ARRETS.sanctionPrevueRI2 };
    if (nie(s.prevueRI)) return { etat: NC, motif: `La sanction prononcée (« ${q.nature} ») n'est pas prévue par le règlement intérieur, alors que l'employeur est tenu d'en établir un. ${ARRETS.sanctionPrevueRI} ${ARRETS.sanctionPrevueRI2}` };
    return { etat: CONF, motif: `La sanction prononcée (« ${q.nature} ») est prévue par le règlement intérieur. ${ARRETS.sanctionPrevueRI2}` };
  }));

ctl("DIS-CTL-SAN-04", "Procédure disciplinaire",
  "La mise à pied disciplinaire respecte-t-elle la durée maximale que le règlement intérieur doit préciser ?",
  ["L. 1321-1, 3°"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (!q.misePied) return { etat: SO, motif: `La sanction auditée n'est pas une mise à pied disciplinaire (« ${q.nature} ») : la durée maximale que le règlement intérieur doit préciser n'a pas d'objet ici. ${ARRETS.sanctionPrevueRI}` };
    const ri = f.ri || {};
    if (vide(ri.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un règlement intérieur existe : la licéité de la mise à pied disciplinaire en dépend. " + ARRETS.sanctionPrevueRI };
    if (nie(ri.existe)) return { etat: NC, motif: "Une mise à pied disciplinaire est prononcée alors qu'aucun règlement intérieur n'existe : elle ne peut donc ni y être prévue ni y voir sa durée maximale précisée. " + ARRETS.sanctionPrevueRI };
    if (vide(ri.misePiedDureeMax)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur précise la durée maximale de la mise à pied disciplinaire. " + ARRETS.sanctionPrevueRI };
    if (nie(ri.misePiedDureeMax)) return { etat: NC, motif: "Une mise à pied disciplinaire est prononcée alors que le règlement intérieur ne précise pas sa durée maximale : elle n'est pas licite. " + ARRETS.sanctionPrevueRI };
    const max = Number(ri.misePiedDureeMaxJours), duree = Number(s.dureeMisePiedJours);
    if (!isFinite(max) || !isFinite(duree) || vide(ri.misePiedDureeMaxJours) || vide(s.dureeMisePiedJours))
      return { etat: MANQ, motif: "La durée maximale inscrite au règlement intérieur, ou la durée de la mise à pied prononcée, n'est pas renseignée : la comparaison ne peut pas être faite. " + ARRETS.sanctionPrevueRI };
    if (duree > max) return { etat: NC, motif: `La mise à pied prononcée est de ${duree} jour(s), alors que le règlement intérieur en fixe la durée maximale à ${max} jour(s) : la sanction excède l'échelle que le règlement intérieur fixe (L. 1321-1, 3°). ${ARRETS.sanctionPrevueRI}` };
    return { etat: CONF, motif: `La mise à pied prononcée est de ${duree} jour(s), dans la limite des ${max} jour(s) que le règlement intérieur fixe comme durée maximale. ${ARRETS.sanctionPrevueRI}` };
  }));

ctl("DIS-CTL-SAN-05", "Délais et prescription",
  "Les poursuites disciplinaires ont-elles été engagées dans les deux mois de la connaissance des faits ?",
  ["L. 1332-4", "R. 1332-1"],
  f => siSanction(f, s => {
    const p = M.prescriptionFaits(f);
    if (!p.connu) return { etat: MANQ, motif: p.motif };
    if (!p.depasse)
      return { etat: CONF, motif: `Les poursuites ont été engagées le ${p.engagement.date} — ${p.engagement.quoi} — soit ${p.jours} jour(s) après la connaissance des faits par l'employeur (${(f.sanction || {}).dateConnaissance}), dans le délai de deux mois de L. 1332-4, dont le terme était le ${p.limite}. R. 1332-1 confirme que la lettre de convocation est adressée dans ce délai.` };
    if (p.penales === true)
      return { etat: RISQ, motif: `Les poursuites ont été engagées le ${p.engagement.date}, soit au-delà du délai de deux mois expirant le ${p.limite}. Le dossier déclare toutefois que les faits ont donné lieu à l'exercice de poursuites pénales : L. 1332-4 réserve précisément ce cas — « à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales ». Il reste à vérifier que ces poursuites ont bien été exercées DANS le délai de deux mois : le contrôle ne le fait pas à votre place.` };
    if (p.penales === null)
      return { etat: MANQ, motif: `Les poursuites ont été engagées le ${p.engagement.date}, soit au-delà du délai de deux mois expirant le ${p.limite}. Il n'est pas indiqué si les faits ont donné lieu, dans le même délai, à l'exercice de poursuites pénales — seule réserve que L. 1332-4 prévoit.` };
    return { etat: NC, motif: `Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance (L. 1332-4). Ici, l'employeur déclare avoir eu connaissance des faits le ${(f.sanction || {}).dateConnaissance} et n'a engagé les poursuites que le ${p.engagement.date} — ${p.engagement.quoi} —, soit ${p.jours} jour(s) après, quand le délai expirait le ${p.limite}. Aucune poursuite pénale n'est déclarée : la réserve de L. 1332-4 ne joue pas. Les faits sont prescrits.` };
  }));

ctl("DIS-CTL-SAN-06", "Délais et prescription",
  "Les sanctions antérieures invoquées ont-elles moins de trois ans ?",
  ["L. 1332-5"],
  f => siSanction(f, s => {
    const a = M.sanctionsAnterieures(f);
    if (!a.connu) return { etat: MANQ, motif: a.motif };
    if (!a.invoquees) return { etat: SO, motif: "Aucune sanction antérieure n'est invoquée à l'appui de la nouvelle sanction : la prescription de L. 1332-5 n'a pas d'objet." };
    if (a.depasse) return { etat: NC, motif: `La sanction antérieure la plus ancienne invoquée date du ${(f.sanction || {}).dateSanctionAnterieurePlusAncienne}, soit plus de trois ans avant l'engagement des poursuites (${a.engagement.date} — ${a.engagement.quoi}) : « Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction » (L. 1332-5). Le terme des trois ans était le ${a.limite}.` };
    return { etat: CONF, motif: `La sanction antérieure la plus ancienne invoquée date du ${(f.sanction || {}).dateSanctionAnterieurePlusAncienne}, soit moins de trois ans avant l'engagement des poursuites (${a.engagement.date}) : L. 1332-5 est respecté. Le terme des trois ans était le ${a.limite}.` };
  }));

ctl("DIS-CTL-SAN-07", "Procédure disciplinaire",
  "L'entretien préalable était-il dû, et a-t-il été tenu ?",
  ["L. 1332-2", "Soc., 3 mai 2011, n° 10-14.104", "Soc., 22 septembre 2021, n° 18-22.204"],
  f => siSanction(f, s => {
    const e = M.entretienDu(f);
    if (e.licenciement) return { etat: SO, motif: e.motif + " L'entretien préalable au licenciement et ses délais relèvent du module « licenciement » de l'application." };
    if (!e.connu) return { etat: MANQ, motif: e.motif };
    if (!e.du) return { etat: SO, motif: e.motif + " Si l'employeur a néanmoins choisi de convoquer le salarié, il est tenu de respecter tous les termes de la procédure — " + ARRETS.tousLesTermes };
    const fondeSurGarantie = e.fondement === "garantie de fond";
    if (vide(s.entretienTenu)) return { etat: MANQ, motif: e.motif + " Il n'est pas indiqué si l'entretien a été tenu." };
    if (nie(s.entretienTenu)) return { etat: NC, motif: e.motif +
      (fondeSurGarantie
        ? ` L'entretien n'a pas été tenu : la sanction a été notifiée sans que le salarié ait été convoqué ni entendu, en violation d'une garantie de fond instituée par le règlement intérieur ou la convention collective. ${ARRETS.avertissementRI} ${ARRETS.avertissementCCN} Il appartient à la juridiction prud'homale d'apprécier si la sanction, irrégulière en la forme, doit être annulée (L. 1333-2).`
        : " L'entretien n'a pas été tenu : la sanction a été prise sans que l'employeur ait indiqué au salarié le motif de la sanction envisagée ni recueilli ses explications, comme L. 1332-2 l'impose. La sanction est irrégulière en la forme, et le conseil de prud'hommes peut l'annuler (L. 1333-2).") };
    return { etat: CONF, motif: e.motif + " L'entretien a été tenu : au cours de celui-ci, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié (L. 1332-2)." };
  }));

ctl("DIS-CTL-SAN-08", "Procédure disciplinaire",
  "La lettre de convocation porte-t-elle les mentions de R. 1332-1, et a-t-elle été remise dans les formes ?",
  ["R. 1332-1", "L. 1332-2"],
  f => siSanction(f, s => {
    const e = M.entretienDu(f);
    if (e.licenciement) return { etat: SO, motif: e.motif };
    if (vide(s.convocationEnvoyee) && !e.connu) return { etat: MANQ, motif: e.motif };
    if (vide(s.convocationEnvoyee)) return { etat: MANQ, motif: "Il n'est pas indiqué si une lettre de convocation à l'entretien préalable a été envoyée." };
    if (nie(s.convocationEnvoyee)) {
      if (!e.connu) return { etat: MANQ, motif: e.motif + " Aucune convocation n'a été envoyée." };
      if (e.du) return { etat: NC, motif: e.motif + " Aucune lettre de convocation n'a été envoyée : R. 1332-1 exige une lettre indiquant l'objet de l'entretien, précisant sa date, son heure et son lieu, rappelant que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et remise contre récépissé ou adressée par lettre recommandée dans le délai de deux mois fixé à l'article L. 1332-4." };
      return { etat: SO, motif: e.motif + " Aucune convocation n'a été envoyée, et aucune n'était due : les mentions de R. 1332-1 n'ont pas d'objet." };
    }
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(s.convocationObjet, "elle n'indique pas l'objet de l'entretien entre le salarié et l'employeur", "l'indication de l'objet de l'entretien");
    point(s.convocationDateHeureLieu, "elle ne précise pas la date, l'heure et le lieu de l'entretien", "la date, l'heure et le lieu de l'entretien");
    point(s.convocationAssistance, "elle ne rappelle pas que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise", "le rappel du droit d'être assisté");
    if (vide(s.convocationRemise)) manques.push("le mode de remise — récépissé ou lettre recommandée");
    else if (s.convocationRemise !== "récépissé" && s.convocationRemise !== "lettre recommandée")
      griefs.push("elle n'a été ni remise contre récépissé ni adressée par lettre recommandée, alors que R. 1332-1 n'ouvre que ces deux voies");
    if (griefs.length) return { etat: NC, motif: `La lettre de convocation ne satisfait pas R. 1332-1 : ${griefs.join(" ; ")}.` +
      (e.du === false ? " La convocation n'était pas due, mais l'employeur qui a choisi de convoquer est tenu de respecter tous les termes de la procédure — " + ARRETS.tousLesTermes : "") };
    if (manques.length) return { etat: MANQ, motif: `La lettre de convocation est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "La lettre de convocation indique l'objet de l'entretien, précise sa date, son heure et son lieu, rappelle le droit du salarié de se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et a été remise contre récépissé ou adressée par lettre recommandée (R. 1332-1 ; L. 1332-2)." +
      (e.du === false ? " La convocation n'était pas due ; l'employeur qui a choisi de convoquer en respecte les termes — " + ARRETS.tousLesTermes : "") };
  }));

ctl("DIS-CTL-SAN-09", "Délais et prescription",
  "La sanction est-elle intervenue au moins deux jours ouvrables et au plus un mois après l'entretien ?",
  ["L. 1332-2", "R. 1332-2", "R. 1332-3"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (q.connu && q.licenciement) return { etat: SO, motif: "La mesure auditée est un licenciement : les délais de L. 1332-2 ne lui sont pas applicables — sa procédure et ses délais sont ceux du licenciement (L. 1333-3)." };
    if (vide(s.entretienTenu)) return { etat: MANQ, motif: "Il n'est pas indiqué si un entretien préalable a été tenu : les délais de L. 1332-2, qui courent du jour fixé pour l'entretien, ne peuvent pas être vérifiés." };
    if (nie(s.entretienTenu)) return { etat: SO, motif: "Aucun entretien préalable n'a été tenu : les délais de L. 1332-2, qui courent du jour fixé pour l'entretien, n'ont pas d'objet — l'absence d'entretien, elle, est appréciée par DIS-CTL-SAN-07." };
    const d = M.delaiNotification(f);
    if (!d.connu) return { etat: MANQ, motif: d.motif };
    const rappel = (M.entretienDu(f).du === false)
      ? " La procédure n'était pas due, mais " + ARRETS.tousLesTermes : "";
    if (d.trop) {
      if (d.depassement <= 2)
        return { etat: RISQ, motif: `La sanction a été notifiée le ${s.dateNotification}, soit ${d.depassement} jour(s) après le ${d.limiteProrogee}, terme du délai d'un mois compté selon R. 1332-3 depuis l'entretien du ${s.dateEntretien}. R. 1332-3 proroge ce terme jusqu'au premier jour ouvrable suivant lorsqu'il tombe un samedi, un dimanche ou un jour férié ou chômé : l'application proroge les samedis et dimanches, mais ne tient pas le calendrier des jours fériés. Un jour férié au terme du délai pourrait le sauver ; vérifiez la date exacte.${rappel}` };
      return { etat: NC, motif: `La sanction ne peut intervenir plus d'un mois après le jour fixé pour l'entretien (L. 1332-2), le délai expirant à vingt-quatre heures le jour du mois suivant qui porte le même quantième que le jour de l'entretien (R. 1332-3). L'entretien s'est tenu le ${s.dateEntretien}, le délai expirait le ${d.limiteProrogee}, et la sanction a été notifiée le ${s.dateNotification}, soit ${d.depassement} jour(s) trop tard. R. 1332-2 impose d'ailleurs que la notification intervienne dans ce délai d'un mois.${rappel}` };
    }
    if (d.ouvrables < 2)
      return { etat: NC, motif: `La sanction ne peut intervenir moins de deux jours ouvrables après le jour fixé pour l'entretien (L. 1332-2). L'entretien s'est tenu le ${s.dateEntretien} et la sanction a été notifiée le ${s.dateNotification}, soit ${d.ouvrables} jour(s) ouvrable(s) après — les jours ouvrables étant ici comptés hors dimanche.${rappel}` };
    if (d.ouvrables === 2)
      return { etat: RISQ, motif: `La sanction a été notifiée ${d.ouvrables} jours ouvrables après l'entretien du ${s.dateEntretien} : c'est exactement le minimum de L. 1332-2. L'application compte les jours ouvrables hors dimanche et ne tient pas le calendrier des jours fériés — un jour férié ou chômé dans l'intervalle ferait passer le délai sous le minimum. Vérifiez le calendrier avant de conclure.${rappel}` };
    return { etat: CONF, motif: `La sanction a été notifiée le ${s.dateNotification}, soit ${d.ouvrables} jours ouvrables après l'entretien du ${s.dateEntretien} et avant le ${d.limiteProrogee}, terme du délai d'un mois compté selon R. 1332-3 : les deux bornes de L. 1332-2 sont tenues.${rappel}` };
  }));

ctl("DIS-CTL-SAN-10", "Procédure disciplinaire",
  "La décision est-elle écrite, motivée et notifiée dans les formes ?",
  ["L. 1332-2", "R. 1332-2"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (q.connu && q.licenciement) return { etat: SO, motif: "La mesure auditée est un licenciement : la forme et la motivation de sa notification relèvent des règles du licenciement, non de R. 1332-2 (L. 1333-3)." };
    if (vide(s.notificationEcrite) && vide(s.notificationMotivee) && vide(s.notificationRemise))
      return { etat: MANQ, motif: "La notification de la sanction n'est pas décrite : elle « fait l'objet d'une décision écrite et motivée » et est notifiée au salarié « soit par lettre remise contre récépissé, soit par lettre recommandée » (R. 1332-2) ; L. 1332-2 le dit dans les mêmes termes — la sanction « est motivée et notifiée à l'intéressé »." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(s.notificationEcrite, "la sanction n'a pas fait l'objet d'une décision écrite, alors que R. 1332-2 l'impose", "le caractère écrit de la décision");
    point(s.notificationMotivee, "la décision n'est pas motivée, alors que L. 1332-2 et R. 1332-2 l'imposent l'un et l'autre — une notification qui n'énonce pas les griefs ne met pas le salarié en mesure de les discuter", "la motivation de la décision");
    if (vide(s.notificationRemise)) manques.push("le mode de notification — récépissé ou lettre recommandée");
    else if (s.notificationRemise !== "récépissé" && s.notificationRemise !== "lettre recommandée")
      griefs.push("la décision n'a été ni remise contre récépissé ni adressée par lettre recommandée, alors que R. 1332-2 n'ouvre que ces deux voies");
    if (griefs.length) return { etat: NC, motif: `La notification de la sanction est irrégulière : ${griefs.join(" ; ")}. Le conseil de prud'hommes peut annuler une sanction irrégulière en la forme (L. 1333-2).` };
    if (manques.length) return { etat: MANQ, motif: `La notification est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "La sanction a fait l'objet d'une décision écrite et motivée, notifiée au salarié contre récépissé ou par lettre recommandée (L. 1332-2 ; R. 1332-2)." };
  }));

ctl("DIS-CTL-SAN-11", "Procédure disciplinaire",
  "La mise à pied conservatoire a-t-elle été suivie de la procédure disciplinaire ?",
  ["L. 1332-3"],
  f => siSanction(f, s => {
    if (vide(s.misePiedConservatoire)) return { etat: MANQ, motif: "Il n'est pas indiqué si les faits reprochés ont rendu indispensable une mesure conservatoire de mise à pied à effet immédiat : dans ce cas, aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure de L. 1332-2 ait été respectée (L. 1332-3)." };
    if (nie(s.misePiedConservatoire)) return { etat: SO, motif: "Aucune mise à pied conservatoire n'a été prononcée : L. 1332-3 n'a pas d'objet ici." };
    if (vide(s.entretienTenu) || vide(s.convocationEnvoyee))
      return { etat: MANQ, motif: "Une mise à pied conservatoire a été prononcée, mais la convocation ou l'entretien ne sont pas renseignés : L. 1332-3 exige que la procédure de L. 1332-2 ait été respectée avant toute sanction définitive relative à ces faits." };
    if (nie(s.entretienTenu) || nie(s.convocationEnvoyee))
      return { etat: NC, motif: "Une mesure conservatoire de mise à pied à effet immédiat a été prononcée, mais la procédure de L. 1332-2 n'a pas été respectée — convocation ou entretien manquants : « aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure prévue à l'article L. 1332-2 ait été respectée » (L. 1332-3). La mise à pied conservatoire n'est pas elle-même une sanction : elle attend la décision, elle ne la remplace pas." };
    return { etat: CONF, motif: "Une mise à pied conservatoire a été prononcée, et la procédure de L. 1332-2 — convocation et entretien — a été suivie avant la sanction définitive (L. 1332-3)." };
  }));

ctl("DIS-CTL-SAN-12", "Garantie de fond",
  "La procédure prévue par la convention collective ou le règlement intérieur a-t-elle été respectée ?",
  ["Soc., 8 septembre 2021, n° 19-15.039", "Soc., 20 mars 2024, n° 22-17.292", "L. 1333-2"],
  f => siSanction(f, s => {
    const g = M.garantieDeFond(f);
    const q = M.qualification(f);
    if (g.procedure === null) return { etat: MANQ, motif: "Il n'est pas indiqué si une convention collective ou le règlement intérieur prévoient, avant le prononcé d'une sanction, une procédure particulière — consultation d'un conseil de discipline ou d'une commission paritaire, entretien imposé, autre formalité. " + ARRETS.garantieFond };
    if (g.procedure === "non") return { etat: SO, motif: "Aucune procédure conventionnelle ni de règlement intérieur n'est déclarée applicable avant le prononcé de la sanction : la garantie de fond n'a pas d'objet ici. Elle demeure la première chose à vérifier dans une convention collective — " + ARRETS.garantieFond };
    if (g.nature === null || g.suivie === null)
      return { etat: MANQ, motif: "Une procédure conventionnelle ou de règlement intérieur est déclarée applicable, mais sa nature ou son accomplissement ne sont pas renseignés. " + ARRETS.garantieFond };
    const quoi = g.source ? `prévue par ${g.source}` : "prévue par la convention collective ou le règlement intérieur";
    const consultation = g.nature === "consultation d'un organisme appelé à donner son avis";
    if (g.suivie === "non") {
      if (consultation && q.connu && q.licenciement)
        return { etat: NC, motif: `L'organisme chargé, en vertu d'une disposition ${quoi}, de donner son avis sur le licenciement envisagé n'a pas été consulté. ${ARRETS.garantieFond} Le licenciement prononcé sans cette consultation ne peut avoir de cause réelle et sérieuse.` };
      return { etat: NC, motif: `La procédure ${quoi} — ${g.nature} — n'a pas été suivie. ${ARRETS.garantieFond} Appliquée à une sanction autre que le licenciement, la même logique conduit le conseil de prud'hommes à apprécier si la sanction, irrégulière en la forme, doit être annulée (L. 1333-2 ; ${ARRETS.avertissementCCN})` };
    }
    if (g.suivie === "tardivement ou imparfaitement") {
      const prives = f.garantie && f.garantie.droitsDefensePrives;
      const influence = f.garantie && f.garantie.influenceDecision;
      if (dit(prives) || dit(influence))
        return { etat: NC, motif: `La procédure ${quoi} — ${g.nature} — a été suivie tardivement ou imparfaitement, et le dossier déclare ${dit(prives) ? "que l'irrégularité a privé le salarié de la possibilité d'assurer utilement sa défense" : ""}${dit(prives) && dit(influence) ? " et " : ""}${dit(influence) ? "qu'elle est susceptible d'avoir exercé une influence sur la décision finale" : ""}. C'est exactement le critère que la Cour de cassation retient. ${ARRETS.garantieFond} ${ARRETS.avisTardif}` };
      if (vide(prives) || vide(influence))
        return { etat: MANQ, motif: `La procédure ${quoi} a été suivie tardivement ou imparfaitement : il faut savoir si cette irrégularité a privé le salarié de la possibilité d'assurer utilement sa défense, et si elle est susceptible d'avoir exercé une influence sur la décision finale — ce sont les deux branches du critère. ${ARRETS.avisTardif}` };
      return { etat: RISQ, motif: `La procédure ${quoi} — ${g.nature} — a été suivie tardivement ou imparfaitement. Le dossier ne déclare ni privation des droits de la défense ni influence sur la décision finale, mais ces deux appréciations appartiennent au juge, non au questionnaire. ${ARRETS.avisTardif} ${ARRETS.garantieFond} Conservez la preuve de la date de saisine, de l'avis rendu et de son contenu.` };
    }
    return { etat: CONF, motif: `La procédure ${quoi} — ${g.nature} — a été suivie avant le prononcé de la sanction. ${ARRETS.garantieFond}` };
  }));

/* ------------------------------------------------------------- l'exposition */

ctl("DIS-CTL-EXP-01", "Exposition",
  "À quoi l'employeur s'expose-t-il en l'état du dossier ?",
  ["L. 1333-1", "L. 1333-2", "L. 1333-3", "L. 1331-2"],
  f => {
    const s = f.sanction || {};
    const ri = f.ri || {};
    const q = M.qualification(f);
    const g = M.garantieDeFond(f);
    const griefs = [];
    if (q.connu && q.pecuniaire)
      griefs.push("une sanction pécuniaire, que L. 1331-2 interdit et dont toute stipulation contraire est réputée non écrite");
    if (nie(s.griefsEcrits))
      griefs.push("des griefs jamais portés par écrit à la connaissance du salarié (L. 1332-1)");
    const p = M.prescriptionFaits(f);
    if (p.connu && p.depasse && p.penales === false)
      griefs.push(`des faits prescrits — poursuites engagées le ${p.engagement.date} quand le délai de deux mois expirait le ${p.limite} (L. 1332-4)`);
    const e = M.entretienDu(f);
    if (e.connu && e.du === true && nie(s.entretienTenu))
      griefs.push("une sanction prise sans l'entretien préalable qui était dû" + (e.fondement === "garantie de fond" ? ", en violation d'une garantie de fond instituée par le règlement intérieur ou la convention collective" : " (L. 1332-2)"));
    if (g.procedure === "oui" && g.suivie === "non")
      griefs.push("une procédure conventionnelle ou de règlement intérieur non suivie : l'irrégularité est assimilée à la violation d'une garantie de fond, et rend le licenciement sans cause réelle et sérieuse lorsqu'elle a privé le salarié de droits de sa défense ou qu'elle est susceptible d'avoir exercé une influence sur la décision finale (Soc., 8 septembre 2021, n° 19-15.039)");
    const d = M.delaiNotification(f);
    if (d.connu && d.trop && d.depassement > 2)
      griefs.push(`une sanction notifiée plus d'un mois après l'entretien (L. 1332-2 ; R. 1332-3) — ${ARRETS.tousLesTermes}`);
    if (nie(ri.existe) && M.riDu(f).du === true)
      griefs.push("l'absence de règlement intérieur là où L. 1311-2 en impose un, dont l'inspecteur du travail peut à tout moment tirer les conséquences (L. 1322-1) et qui prive l'employeur de toute échelle de sanctions opposable");

    const licenciement = q.connu && q.licenciement;
    const cadre = licenciement
      ? "La mesure auditée étant un licenciement, sa contestation ne relève pas du chapitre III du titre III du livre III mais des règles du licenciement : « Lorsque la sanction contestée est un licenciement les dispositions du présent chapitre ne sont pas applicables. Dans ce cas, le conseil de prud'hommes applique les dispositions relatives à la contestation des irrégularités de licenciement » (L. 1333-3)."
      : "En cas de litige, le conseil de prud'hommes apprécie la régularité de la procédure suivie et si les faits reprochés sont de nature à justifier une sanction ; l'employeur lui fournit les éléments retenus, et si un doute subsiste, il profite au salarié (L. 1333-1). Le conseil peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée à la faute commise (L. 1333-2).";

    const mandat = s.salarieProtege;
    const protecteur = dit(mandat)
      ? " Le salarié est déclaré titulaire d'un mandat : le statut protecteur s'ajoute alors à tout ce qui précède — ce module ne l'audite pas et n'en tire aucune conclusion ; faites vérifier la procédure spéciale applicable avant toute décision."
      : (vide(mandat) ? " Il n'est pas indiqué si le salarié est titulaire d'un mandat représentatif ou syndical : si c'est le cas, un statut protecteur s'ajoute, que ce module n'audite pas." : "");

    if (griefs.length)
      return { etat: NC, motif: `L'exposition est constituée en l'état du dossier : ${griefs.join(" ; ")}. ${cadre}${protecteur}` };
    if (vide(s.auditee) || !q.connu)
      return { etat: MANQ, motif: "La sanction auditée n'est pas décrite : l'exposition ne peut pas être appréciée." + protecteur };
    return { etat: RISQ, motif: `Aucun des manquements que ce module mesure n'est constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : la réalité des faits, leur caractère fautif et la proportionnalité de la sanction s'apprécient au fond, et ce questionnaire ne les touche pas. ${cadre}${protecteur} Ce contrôle ne prononce jamais un blanc-seing.` };
  });

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["DIS-CTL-EXP-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE, ARRETS };

});

__def("./regularisation-discipline.js", function(module, exports, require){
/* Ce qu'il faut faire quand un contrôle de la discipline ne passe pas.

   Le module d'audit dit ce qui manque ; ce fichier dit comment y remédier. Un
   contrôle sans entrée ici fait échouer la publication — l'oubli se voit, il ne
   se devine pas. Une entrée peut valoir « null » : c'est le cas du contrôle
   d'exposition, qui mesure ce que les autres causent et ne se régularise pas
   pour lui-même, et ce null doit être écrit.

   Chaque entrée porte :
     gravite    1 le plus grave, 4 le moins — c'est l'ordre du guide
     quoiFaire  une phrase, à l'infinitif : l'acte à accomplir
     risque     ce que coûte l'inaction, fondé
     delai      le temps qu'il faut y consacrer, en clair
     document   le modèle à produire, ou null
     etapes     la procédure, dans l'ordre, jusqu'à la validation
     verifs     la grille du second temps : ce qu'on redemande à qui déclare
                l'obligation en place, et ce qui est attendu en réponse

   OÙ SONT LES DEGRÉS 1 ET 2, ET POURQUOI LÀ SEULEMENT.
   Jusqu'au 24 août 2026, aucune entrée n'était cotée 1 ni 2, et l'en-tête en
   donnait la raison : le corpus du module ne contenait aucun texte répressif,
   et le dépôt interdit d'annoncer une amende que personne n'a lue. La
   précaution était juste, le constat était incomplet — ces textes existent.
   Trois ont été lus à la source le 24 août 2026, deux lectures concordantes
   chacun, et versés dans textes-discipline.json :
     R. 1323-1 (LEGIARTI000037899552) — « Le fait de méconnaître les
       dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à
       R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue
       pour les contraventions de la quatrième classe. » L'énumération couvre
       tout le chapitre du règlement intérieur : les douze contrôles
       DIS-CTL-RI-01 à DIS-CTL-RI-12 passent au degré 1.
     L. 1334-1 (LEGIARTI000006901456) — « Le fait d'infliger une amende ou une
       sanction pécuniaire en méconnaissance des dispositions de l'article
       L. 1331-2 est puni d'une amende de 3 750 euros. » Il ne vise que
       L. 1331-2 : DIS-CTL-SAN-02, et lui seul, passe au degré 1.
     L. 2317-1 (LEGIARTI000035634273) — l'entrave au comité social et
       économique, « punie d'une amende de 7 500 € » pour ce qui est du
       fonctionnement régulier. Cité en second fondement là où le comité doit
       être consulté sur le règlement intérieur ou sur ses modifications
       (DIS-CTL-RI-06, DIS-CTL-RI-11).
   Le degré 2 — pénalité financière — ne sert toujours pas dans ce fichier, et
   c'est délibéré : aucun texte lu n'attache de pénalité financière à ces
   manquements. Ce qui reste au degré 3 y reste parce qu'aucun texte répressif
   ne l'atteint ; le commentaire placé devant DIS-CTL-SAN-01 dit précisément
   lesquels, et pourquoi. Ce que les textes lus disent là, et qui fonde le
   degré 3 : le conseil de prud'hommes « peut annuler une sanction irrégulière
   en la forme ou injustifiée ou disproportionnée à la faute commise »
   (L. 1333-2), et l'inspecteur du travail « peut à tout moment exiger le
   retrait ou la modification des dispositions contraires aux articles
   L. 1321-1 à L. 1321-3 et L. 1321-6 » (L. 1322-1). C'est la sanction qui
   tombe, ou la clause qui saute : c'est le degré 3.

   CE QUE CE FICHIER NE DIT JAMAIS. Il ne dit pas qu'une sanction est justifiée,
   ni qu'elle est proportionnée : la réalité des faits, leur caractère fautif et
   la mesure de la réponse s'apprécient au fond, l'employeur en fournit les
   éléments et, si un doute subsiste, il profite au salarié (L. 1333-1). Toutes
   les procédures écrites ici sont des procédures de forme.

   Les articles cités ont été lus à la source ; leur identifiant de version est
   dans textes-discipline.json, et publier-discipline.js confronte les deux. Les
   décisions citées sont celles que les contrôles portent en fondement, lues à
   la source dans la base Judilibre. */

const { C } = require("./controles-discipline.js");

/* Les quatre degrés, nommés une fois pour toutes. */
const GRAVITES = {
  1: "Sanction pénale encourue",
  2: "Pénalité financière encourue",
  3: "Irrégularité opposable — la sanction ou le licenciement peut tomber",
  4: "Régularisation rapide",
};

const R = {

  "DIS-CTL-RI-01": {
    gravite: 1,
    quoiFaire: "Établir un règlement intérieur et lui faire suivre les quatre formalités : avis du comité social et économique, publicité, dépôt au greffe du conseil de prud'hommes, communication à l'inspecteur du travail.",
    risque: "L'entreprise d'au moins cinquante salariés est tenue d'en établir un (L. 1311-2). « Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1) : L. 1311-2, qui pose l'obligation même, ouvre cette énumération. Sans règlement intérieur, l'employeur n'a en outre aucune échelle de sanctions à opposer : la nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au règlement, et une sanction qui ne s'y trouve pas ne peut pas être prononcée — le contrôle DIS-CTL-SAN-03 le dit avec la décision qu'il cite.",
    delai: "Deux à trois mois : la rédaction, la consultation du comité, puis le mois qui doit séparer la dernière formalité de l'entrée en vigueur.",
    document: "Règlement intérieur — projet soumis à l'avis du comité social et économique",
    etapes: [
      "Dater le franchissement du seuil de cinquante salariés : l'obligation ne s'applique qu'au terme d'un délai de douze mois à compter de cette date (L. 1311-2, second alinéa ; R. 1321-5). C'est cette date qui dit si le manquement est constitué ou seulement prochain.",
      "Rédiger le projet en n'y mettant que ce que L. 1321-1 y réserve — mesures de santé et de sécurité, conditions de participation au rétablissement de conditions de travail protectrices, règles générales et permanentes de discipline avec la nature et l'échelle des sanctions — et en y portant les trois rappels de L. 1321-2.",
      "Le soumettre à l'avis du comité social et économique : L. 1321-4 interdit son introduction avant cet avis.",
      "Accomplir la publicité (R. 1321-1) et le dépôt au greffe du conseil de prud'hommes du ressort (R. 1321-2), et communiquer le texte accompagné de l'avis du comité à l'inspecteur du travail, en deux exemplaires (L. 1321-4 ; R. 1321-4).",
      "Inscrire dans le règlement une date d'entrée en vigueur postérieure d'un mois à la dernière en date de ces formalités (L. 1321-4 ; R. 1321-3), et ne prononcer aucune sanction tirée du règlement avant cette date.",
    ],
    verifs: [
      { cle: "ri01Seuil", question: "À quelle date l'effectif de cinquante salariés a-t-il été atteint ?", attendu: "La date ; l'obligation de L. 1311-2 ne s'applique qu'au terme d'un délai de douze mois à compter d'elle (R. 1321-5)." },
      { cle: "ri01Dates", question: "Quelle est la date du règlement intérieur en vigueur, et quelle date d'entrée en vigueur porte-t-il ?", attendu: "Les deux dates, lues sur le document : L. 1321-4 impose que le règlement indique sa date d'entrée en vigueur." },
      { cle: "ri01Exemplaire", question: "Où se trouve l'exemplaire applicable aujourd'hui, et de quelle version s'agit-il ?", attendu: "Le document lui-même, dans sa version en vigueur, et non un projet ni une version ancienne." },
    ],
  },

  "DIS-CTL-RI-02": {
    gravite: 1,
    quoiFaire: "Compléter le règlement intérieur pour qu'il porte les trois matières que L. 1321-1 lui réserve, puis refaire les formalités.",
    risque: "L. 1321-1 énumère ce que l'employeur y fixe exclusivement ; un règlement qui laisse une de ces matières de côté est contraire à ce texte. « Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1), et L. 1321-1 est dans cette énumération. L'inspecteur du travail peut en outre à tout moment en exiger la modification (L. 1322-1).",
    delai: "Deux mois : la rédaction de l'avenant, l'avis du comité, puis le mois qui précède l'entrée en vigueur.",
    document: "Avenant au règlement intérieur — les trois matières de L. 1321-1",
    etapes: [
      "Pointer sur le règlement, matière par matière, ce qui y figure : 1° les mesures d'application de la réglementation en matière de santé et de sécurité, notamment les instructions prévues à l'article L. 4122-1 ; 2° les conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices ; 3° les règles générales et permanentes relatives à la discipline.",
      "Rédiger un avenant pour la ou les matières absentes, en restant dans le champ de L. 1321-1 : le texte dit « exclusivement », et une clause étrangère à ces trois matières s'expose au retrait.",
      "Soumettre l'avenant à l'avis du comité social et économique : L. 1321-4 s'applique également en cas de modification des clauses du règlement intérieur.",
      "Refaire pour l'avenant la publicité, le dépôt au greffe et la communication à l'inspecteur du travail, et lui donner une date d'entrée en vigueur postérieure d'un mois à la dernière de ces formalités (R. 1321-3).",
    ],
    verifs: [
      { cle: "ri02SanteSecurite", question: "Quels articles du règlement intérieur portent les mesures d'application de la réglementation en matière de santé et de sécurité (L. 1321-1, 1°) ?", attendu: "Les numéros d'articles ou de pages, pointés sur le document." },
      { cle: "ri02Participation", question: "Quels articles portent les conditions de participation des salariés au rétablissement de conditions de travail protectrices (L. 1321-1, 2°) ?", attendu: "Les articles, pointés sur le document." },
      { cle: "ri02Discipline", question: "Quels articles portent les règles générales et permanentes relatives à la discipline (L. 1321-1, 3°) ?", attendu: "Les articles, pointés sur le document." },
    ],
  },

  "DIS-CTL-RI-03": {
    gravite: 1,
    quoiFaire: "Inscrire au règlement intérieur la nature et l'échelle des sanctions, et y préciser la durée maximale de la mise à pied disciplinaire.",
    risque: "C'est le point qui fait tomber les sanctions. La nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au règlement intérieur ; une sanction qui n'y figure pas ne peut pas être prononcée, et une mise à pied disciplinaire dont le règlement ne précise pas la durée maximale n'est pas licite — les contrôles DIS-CTL-SAN-03 et DIS-CTL-SAN-04 citent les décisions qui le jugent. Le conseil de prud'hommes annule la sanction irrégulière en la forme (L. 1333-2). Le règlement qui ne fixe pas cette échelle méconnaît L. 1321-1, et « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1).",
    delai: "Deux mois, avenant et formalités comprises. Aucune sanction nouvelle ne devrait être prononcée entre-temps sur le fondement d'une échelle absente.",
    document: "Avenant au règlement intérieur — échelle des sanctions et durée maximale de la mise à pied",
    etapes: [
      "Écrire l'échelle : énumérer les sanctions que l'employeur peut prendre, de la moins grave à la plus grave, en les nommant. Une sanction absente de la liste sera une sanction non prévue.",
      "Chiffrer la durée maximale de la mise à pied disciplinaire, en jours, et l'écrire dans le règlement : c'est cette mention qui rend la mise à pied licite.",
      "Vérifier que l'échelle ne comporte aucune amende ni sanction pécuniaire : L. 1331-2 les interdit et répute non écrite toute disposition contraire.",
      "Soumettre l'avenant à l'avis du comité social et économique (L. 1321-4), puis lui faire suivre publicité, dépôt au greffe et communication à l'inspection, avec une entrée en vigueur postérieure d'un mois à la dernière formalité (R. 1321-3).",
    ],
    verifs: [
      { cle: "ri03Echelle", question: "Quelles sanctions l'échelle du règlement intérieur énumère-t-elle, et à quel article ?", attendu: "La liste telle qu'elle est écrite, et l'article : une sanction absente de cette liste ne peut pas être prononcée." },
      { cle: "ri03MisePiedMax", question: "Quelle durée maximale le règlement intérieur assigne-t-il à la mise à pied disciplinaire, et à quel article ?", attendu: "Le nombre de jours et l'article ; L. 1321-1, 3°, réserve au règlement la nature et l'échelle des sanctions." },
      { cle: "ri03Pecuniaire", question: "L'échelle est-elle exempte de toute amende ou sanction pécuniaire ?", attendu: "La lecture de la liste : L. 1331-2 répute non écrite toute disposition contraire." },
    ],
  },

  "DIS-CTL-RI-04": {
    gravite: 1,
    quoiFaire: "Ajouter au règlement intérieur les trois rappels que L. 1321-2 lui impose de faire.",
    risque: "L. 1321-2 est rédigé à l'impératif : le règlement intérieur « rappelle » les droits de la défense des articles L. 1332-1 à L. 1332-3, les dispositions sur les harcèlements moral et sexuel et les agissements sexistes, et l'existence du dispositif de protection des lanceurs d'alerte. Un règlement qui ne les rappelle pas est contraire à ce texte, et « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1) — L. 1321-2 est dans cette énumération. L'inspecteur du travail peut en outre à tout moment en exiger la modification (L. 1322-1).",
    delai: "Deux mois, avenant et formalités comprises.",
    document: "Avenant au règlement intérieur — les rappels de L. 1321-2",
    etapes: [
      "Rappeler les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3, ou celles de la convention collective applicable si elle en prévoit de plus favorables : information écrite des griefs, convocation, entretien, mise à pied conservatoire suivie de la procédure.",
      "Rappeler les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes prévues par le code du travail.",
      "Rappeler l'existence du dispositif de protection des lanceurs d'alerte.",
      "Soumettre l'avenant à l'avis du comité social et économique, puis accomplir publicité, dépôt et communication à l'inspection, avec une entrée en vigueur postérieure d'un mois à la dernière formalité (L. 1321-4 ; R. 1321-3).",
    ],
    verifs: [
      { cle: "ri04Defense", question: "À quel article le règlement intérieur rappelle-t-il les droits de la défense des articles L. 1332-1 à L. 1332-3, ou ceux de la convention collective applicable ?", attendu: "L'article, pointé sur le document." },
      { cle: "ri04Harcelement", question: "À quel article rappelle-t-il les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ?", attendu: "L'article, pointé sur le document." },
      { cle: "ri04Alerte", question: "À quel article rappelle-t-il l'existence du dispositif de protection des lanceurs d'alerte ?", attendu: "L'article, pointé sur le document." },
    ],
  },

  "DIS-CTL-RI-05": {
    gravite: 1,
    quoiFaire: "Retirer du règlement intérieur les clauses que L. 1321-3 prohibe, et documenter la justification et la proportionnalité de toute clause de neutralité qui y demeure.",
    risque: "L. 1321-3 interdit les dispositions contraires aux lois, règlements et stipulations conventionnelles, les restrictions aux droits des personnes et aux libertés qui ne seraient ni justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché, et les dispositions discriminatoires. L'inspecteur du travail peut à tout moment en exiger le retrait ou la modification (L. 1322-1) ; et une sanction prise sur le fondement d'une clause prohibée est une sanction sans support. Le règlement qui porte une telle clause méconnaît L. 1321-3, et « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1).",
    delai: "Un mois pour l'examen clause par clause, deux de plus pour l'avenant et ses formalités.",
    document: "Note de revue des clauses du règlement intérieur au regard de L. 1321-3 et L. 1321-2-1",
    etapes: [
      "Relire le règlement clause par clause et isoler celles qui restreignent un droit ou une liberté : fouille, contrôle d'alcoolémie, tenue, usage des outils numériques, expression, circulation.",
      "Pour chacune, écrire deux choses et non une seule : la nature de la tâche qui la justifie, et pourquoi la restriction ne va pas au-delà du but recherché. L. 1321-3, 2°, exige cette double condition.",
      "Supprimer ce qui ne la remplit pas, ainsi que toute disposition contraire aux lois, aux règlements ou aux stipulations conventionnelles applicables, et toute disposition discriminant les salariés au sens de L. 1321-3, 3°.",
      "Si une clause de neutralité est maintenue, la rattacher à ce que L. 1321-2-1 autorise : l'exercice d'autres libertés et droits fondamentaux ou les nécessités du bon fonctionnement de l'entreprise, et la proportionner au but recherché ; consigner cette justification par écrit, poste par poste.",
      "Soumettre l'avenant à l'avis du comité social et économique, puis accomplir publicité, dépôt et communication à l'inspection (L. 1321-4 ; R. 1321-1 ; R. 1321-2 ; R. 1321-4).",
    ],
    verifs: [
      { cle: "ri05Restrictions", question: "Quelles clauses du règlement intérieur restreignent un droit ou une liberté, et pour quels postes ou quelles tâches ?", attendu: "La liste, article par article, avec la tâche invoquée : L. 1321-3, 2°, n'admet que les restrictions justifiées par la nature de la tâche à accomplir et proportionnées au but recherché." },
      { cle: "ri05Neutralite", question: "Si une clause de neutralité existe, quel écrit daté consigne la justification retenue et le but poursuivi ?", attendu: "L'écrit lui-même — note, délibération, avis. L. 1321-2-1 exige justification et proportionnalité ; une affirmation ne les établit pas." },
    ],
  },

  "DIS-CTL-RI-06": {
    gravite: 1,
    quoiFaire: "Soumettre le règlement intérieur à l'avis du comité social et économique, et ne l'introduire qu'ensuite.",
    risque: "L. 1321-4 dispose que le règlement intérieur « ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique ». Introduit sans cet avis, il l'a été en méconnaissance de la condition que le texte pose ; et l'avis est en outre la pièce qui doit accompagner le règlement communiqué à l'inspecteur du travail. Deux textes répressifs se rencontrent ici. « Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe » (R. 1323-1), et L. 1321-4 est dans cette énumération. Par ailleurs, « le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1) : la consultation qui n'a pas eu lieu expose l'employeur à cette qualification, qu'il appartient au juge de retenir ou d'écarter.",
    delai: "Un mois pour la consultation, un mois de plus avant l'entrée en vigueur de la version régularisée.",
    document: "Ordre du jour et procès-verbal de consultation du comité social et économique sur le règlement intérieur",
    etapes: [
      "Inscrire le règlement intérieur — ou l'avenant — à l'ordre du jour d'une réunion du comité social et économique, et transmettre le projet aux membres avant la réunion : un avis se rend sur un texte, pas sur une annonce.",
      "Tenir la réunion, recueillir l'avis et le consigner au procès-verbal, avec sa date. Le texte exige que le règlement ait été soumis à l'avis, non que l'avis soit favorable.",
      "Conserver le procès-verbal : c'est la pièce qui accompagne le règlement communiqué à l'inspecteur du travail (L. 1321-4).",
      "Ne fixer la date d'entrée en vigueur qu'après cet avis, et postérieure d'un mois à la dernière des formalités de publicité et de dépôt (R. 1321-3).",
    ],
    verifs: [
      { cle: "ri06AvisDate", question: "À quelle date le comité social et économique a-t-il été consulté, et à quelle date a-t-il rendu son avis ?", attendu: "Les deux dates, et le procès-verbal de la réunion." },
      { cle: "ri06AvisAvant", question: "Cette date est-elle antérieure à l'introduction du règlement intérieur ?", attendu: "La comparaison des deux dates : L. 1321-4 interdit l'introduction avant l'avis." },
    ],
  },

  "DIS-CTL-RI-07": {
    gravite: 1,
    quoiFaire: "Porter le règlement intérieur à la connaissance des personnes ayant accès aux lieux de travail, et reporter son entrée en vigueur à un mois au moins après la dernière des formalités de publicité et de dépôt.",
    risque: "R. 1321-1 impose que le règlement soit porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche. L. 1321-4 exige que la date d'entrée en vigueur soit postérieure d'un mois à l'accomplissement des formalités de publicité, ce délai courant de la dernière en date des formalités de publicité et de dépôt (R. 1321-3). Une entrée en vigueur anticipée prive de support toute sanction prise dans l'intervalle sur le fondement du règlement. R. 1321-1, R. 1321-3 et L. 1321-4 sont tous trois dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Quelques jours pour la publicité, puis le mois qu'impose le texte.",
    document: "Attestation de publicité du règlement intérieur et note fixant sa date d'entrée en vigueur",
    etapes: [
      "Choisir le moyen de publicité et l'accomplir : affichage sur les lieux de travail et dans les locaux où se fait l'embauche, mise en ligne accessible, remise contre émargement — R. 1321-1 laisse le moyen libre, mais la preuve incombe à l'employeur.",
      "Dater cet accomplissement, et le documenter : photographie de l'affichage, capture datée, liste d'émargement.",
      "Relever la date de la dernière en date des formalités de publicité et de dépôt : c'est d'elle, et non de la première, que court le délai d'un mois (R. 1321-3).",
      "Inscrire dans le règlement une date d'entrée en vigueur postérieure d'un mois à cette date, et ne l'appliquer qu'à compter de celle-ci.",
    ],
    verifs: [
      { cle: "ri07Publicite", question: "Par quel moyen et à quelle date le règlement intérieur a-t-il été porté à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche ?", attendu: "Le moyen et la date, avec la pièce qui l'établit (R. 1321-1)." },
      { cle: "ri07DerniereFormalite", question: "Quelle est la date de la dernière en date des formalités de publicité et de dépôt ?", attendu: "La date : c'est d'elle que court le délai d'un mois (R. 1321-3)." },
      { cle: "ri07EntreeVigueur", question: "Quelle date d'entrée en vigueur le règlement intérieur indique-t-il ?", attendu: "La date portée sur le document, postérieure d'un mois à celle de la dernière formalité (L. 1321-4)." },
    ],
  },

  "DIS-CTL-RI-08": {
    gravite: 1,
    quoiFaire: "Déposer le règlement intérieur au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement.",
    risque: "R. 1321-2 impose ce dépôt, et R. 1321-3 fait courir de la dernière en date des formalités de publicité et de dépôt le délai d'un mois qui précède l'entrée en vigueur : tant que le dépôt n'est pas fait, ce délai n'a pas commencé de courir, et la date d'entrée en vigueur inscrite au règlement ne vaut pas. Ces deux articles réglementaires sont dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Quelques jours pour le dépôt ; un mois ensuite avant que l'entrée en vigueur puisse être fixée.",
    document: "Lettre de dépôt du règlement intérieur au greffe du conseil de prud'hommes",
    etapes: [
      "Identifier le conseil de prud'hommes du ressort de l'entreprise ou de l'établissement — R. 1321-2 vise le ressort, et non le siège social lorsque les deux diffèrent.",
      "Y déposer le texte du règlement intérieur, en demandant un récépissé ou un accusé de réception daté.",
      "Comparer la date du dépôt à celle de la publicité, et retenir la plus tardive des deux : c'est elle qui fait courir le mois (R. 1321-3).",
      "Rectifier, s'il y a lieu, la date d'entrée en vigueur inscrite au règlement, et refaire pour cette rectification les formalités de L. 1321-4.",
    ],
    verifs: [
      { cle: "ri08DepotDate", question: "À quelle date le règlement intérieur a-t-il été déposé, et auprès de quel conseil de prud'hommes ?", attendu: "La date et le conseil de prud'hommes du ressort de l'entreprise ou de l'établissement (R. 1321-2)." },
      { cle: "ri08DepotPreuve", question: "Quelle pièce établit ce dépôt ?", attendu: "Le récépissé ou l'accusé du greffe. Sans pièce, la date n'est qu'une déclaration." },
    ],
  },

  /* Ce contrôle passe de 4 à 1 le 24 août 2026, et le saut mérite d'être
     expliqué. Civilement, la carence est bénigne : le contrôle relève,
     décision à l'appui, qu'elle ne prive pas le salarié de se prévaloir du
     règlement. Pénalement, elle ne l'est pas : L. 1321-4 et R. 1321-4 sont
     tous deux dans l'énumération de R. 1323-1. Le degré dit la nature de
     l'exposition, non la peine du travail à faire — l'envoi de deux
     exemplaires reste l'affaire d'une heure, et le délai le dit. */
  "DIS-CTL-RI-09": {
    gravite: 1,
    quoiFaire: "Transmettre à l'inspecteur du travail le texte du règlement intérieur en deux exemplaires, accompagné de l'avis du comité social et économique.",
    risque: "L. 1321-4 impose que le règlement, accompagné de l'avis du comité social et économique, soit communiqué à l'inspecteur du travail en même temps qu'il fait l'objet des mesures de publicité, et R. 1321-4 précise qu'il est transmis en deux exemplaires. Cette carence est la seule du chapitre dont le contrôle DIS-CTL-RI-09 relève, décision à l'appui, qu'elle ne prive pas le salarié de se prévaloir du règlement : elle se répare par un envoi, mais elle ouvre la voie à l'exigence de retrait ou de modification de L. 1322-1 sur un texte que l'inspection n'a jamais vu. Sur le terrain pénal, en revanche, elle est traitée comme les autres : L. 1321-4 et R. 1321-4 figurent dans l'énumération de R. 1323-1, aux termes duquel « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Quelques jours : c'est un envoi.",
    document: "Lettre de transmission du règlement intérieur à l'inspecteur du travail, en deux exemplaires",
    etapes: [
      "Réunir les pièces : deux exemplaires du texte du règlement intérieur (R. 1321-4) et l'avis du comité social et économique (L. 1321-4).",
      "Les adresser à l'inspecteur du travail compétent pour l'établissement, par une voie qui laisse une trace datée.",
      "Conserver la preuve d'envoi et sa date : L. 1321-4 veut que la communication soit faite en même temps que les mesures de publicité, et c'est la date qui l'établit.",
      "Traiter sans délai toute observation en retour : l'inspecteur peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1).",
    ],
    verifs: [
      { cle: "ri09Communication", question: "À quelle date le règlement intérieur a-t-il été communiqué à l'inspecteur du travail, et par quelle voie ?", attendu: "La date et la preuve d'envoi ; L. 1321-4 veut qu'elle soit celle des mesures de publicité." },
      { cle: "ri09Exemplaires", question: "L'envoi comportait-il deux exemplaires du texte et l'avis du comité social et économique ?", attendu: "Le bordereau ou la copie de l'envoi (R. 1321-4 pour les deux exemplaires, L. 1321-4 pour l'avis)." },
    ],
  },

  "DIS-CTL-RI-10": {
    gravite: 1,
    quoiFaire: "Rédiger en français le règlement intérieur et tout document comportant des obligations pour le salarié, les traductions n'étant qu'un accompagnement.",
    risque: "L. 1321-6 impose la rédaction en français, et étend l'exigence à tout document comportant des obligations pour le salarié ou des dispositions dont la connaissance est nécessaire à l'exécution de son travail. L'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires à ce texte (L. 1322-1). L. 1321-6 est dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ».",
    delai: "Un mois pour la version française, deux de plus pour les formalités de l'avenant.",
    document: "Version française du règlement intérieur et des documents portant obligations pour le salarié",
    etapes: [
      "Établir la version française du règlement intérieur : c'est elle qui fait foi, la ou les traductions ne venant qu'en accompagnement (L. 1321-6).",
      "Recenser les autres documents visés par le texte — consignes, chartes, procédures, notes — qui comportent des obligations pour le salarié ou dont la connaissance est nécessaire à l'exécution de son travail, et les mettre en français.",
      "Réserver l'exception que le texte prévoit aux seuls documents reçus de l'étranger ou destinés à des étrangers, et ne pas l'étendre au-delà.",
      "Soumettre la version française à l'avis du comité social et économique, puis accomplir publicité, dépôt et communication à l'inspection (L. 1321-4).",
    ],
    verifs: [
      { cle: "ri10Francais", question: "Quelle version du règlement intérieur fait foi, et quelles traductions l'accompagnent ?", attendu: "Le document français, et la liste des traductions éventuelles (L. 1321-6)." },
      { cle: "ri10AutresDocuments", question: "Quels autres documents comportant des obligations pour le salarié sont diffusés, et dans quelle langue ?", attendu: "La liste et la langue : L. 1321-6 étend l'exigence à tout document comportant des obligations pour le salarié ou dont la connaissance est nécessaire à l'exécution de son travail." },
    ],
  },

  "DIS-CTL-RI-11": {
    gravite: 1,
    quoiFaire: "Refaire, pour chaque modification ou retrait de clause et pour chaque note de service à portée générale et permanente, les formalités du titre.",
    risque: "L. 1321-4 dispose que ses dispositions « s'appliquent également en cas de modification ou de retrait des clauses du règlement intérieur », et L. 1321-5 considère les notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 comme des adjonctions au règlement, soumises en toute hypothèse aux dispositions du titre. Une modification introduite sans ces formalités n'a pas été régulièrement introduite ; une note de service prise à leur place n'échappe pas à la règle en changeant de nom. L. 1321-4 et L. 1321-5 sont l'un et l'autre dans l'énumération de R. 1323-1 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ». Et la modification soustraite à l'avis du comité social et économique expose en outre à l'amende de 7 500 € que L. 2317-1 attache à l'entrave au fonctionnement régulier du comité.",
    delai: "Deux mois par vague de modifications : consultation, formalités, puis le mois qui précède l'entrée en vigueur.",
    document: "Récapitulatif daté des modifications et notes de service, avec les formalités accomplies pour chacune",
    etapes: [
      "Recenser, depuis l'introduction du règlement intérieur, toutes les clauses modifiées ou retirées, et toutes les notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2.",
      "Pour chacune, dresser le relevé des quatre formalités et de leurs dates : avis du comité social et économique, publicité, dépôt au greffe, communication à l'inspection.",
      "Reprendre celles dont une formalité manque : les soumettre à l'avis du comité, puis accomplir publicité, dépôt et communication, avec une entrée en vigueur postérieure d'un mois à la dernière formalité (R. 1321-3).",
      "Réserver l'application immédiate à ce que L. 1321-5 permet — les seules obligations relatives à la santé et à la sécurité, lorsque l'urgence le justifie — en communiquant alors immédiatement et simultanément les prescriptions au secrétaire du comité social et économique et à l'inspection du travail.",
    ],
    verifs: [
      { cle: "ri11Modifications", question: "Quelles clauses ont été modifiées ou retirées depuis l'introduction du règlement intérieur, et à quelles dates ?", attendu: "La liste datée des avenants." },
      { cle: "ri11FormalitesModif", question: "Pour chacune, à quelles dates l'avis du comité, la publicité, le dépôt et la communication à l'inspection sont-ils intervenus ?", attendu: "Les quatre dates, modification par modification (L. 1321-4, dernier alinéa)." },
      { cle: "ri11Notes", question: "Quelles notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 sont en vigueur, et quelles formalités ont-elles suivies ?", attendu: "La liste et les dates ; L. 1321-5 les considère comme des adjonctions au règlement intérieur." },
    ],
  },

  "DIS-CTL-RI-12": {
    gravite: 1,
    quoiFaire: "Exécuter la demande de retrait ou de modification formée par l'inspecteur du travail, ou former le recours hiérarchique que L. 1322-3 ouvre.",
    risque: "L. 1322-1 permet à l'inspecteur du travail d'exiger à tout moment le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6. Sa décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité social et économique (L. 1322-2). La seule voie que le texte ouvre contre elle est le recours hiérarchique (L. 1322-3) : ne rien faire n'en est pas une, et laisse en vigueur une disposition dont l'irrégularité est désormais actée par écrit. L'énumération de R. 1323-1 court jusqu'à L. 1322-4 : « le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe ». La décision restée sans effet laisse donc subsister, en même temps que la clause, la disposition méconnue qu'elle désigne.",
    delai: "Quelques semaines pour l'avenant ; le recours hiérarchique, s'il est choisi, se forme sans attendre.",
    document: "Avenant de retrait ou de modification des dispositions visées par l'inspecteur du travail",
    etapes: [
      "Reprendre la décision de l'inspecteur du travail et relever ce qu'elle vise exactement : elle est motivée, et c'est sa motivation qui délimite ce qu'il faut retirer ou modifier (L. 1322-2).",
      "Choisir la voie, et une seule : exécuter, ou former le recours hiérarchique de L. 1322-3. Le choix se date et s'écrit.",
      "Si la voie est l'exécution, rédiger l'avenant de retrait ou de modification, le soumettre à l'avis du comité social et économique, puis accomplir publicité, dépôt au greffe et communication à l'inspection (L. 1321-4).",
      "Informer l'inspecteur du travail de la suite donnée, et conserver la trace de cette information ; vérifier que la décision a bien été communiquée pour information aux membres du comité social et économique (L. 1322-2).",
    ],
    verifs: [
      { cle: "ri12DemandeDate", question: "À quelle date l'inspecteur du travail a-t-il exigé le retrait ou la modification, et sur quelles dispositions ?", attendu: "La décision motivée et notifiée elle-même (L. 1322-1 ; L. 1322-2)." },
      { cle: "ri12SuiteDate", question: "À quelle date le retrait ou la modification a-t-il été opéré, et par quel acte ?", attendu: "L'avenant daté, et les dates des formalités de L. 1321-4 accomplies pour lui." },
      { cle: "ri12Recours", question: "Un recours hiérarchique a-t-il été formé, et à quelle date ?", attendu: "La date et la copie du recours (L. 1322-3), ou la mention expresse qu'aucun n'a été formé." },
    ],
  },

  /* ------------------------------------------------------- les sanctions */

  /* CE QUE R. 1323-1 NE COUVRE PAS, ET QU'IL NE FAUT PAS « CORRIGER ».
     R. 1323-1 punit la méconnaissance des articles « L. 1311-2 à L. 1322-4 et
     R. 1321-1 à R. 1321-5 ». L'énumération s'arrête à L. 1322-4 : elle
     n'atteint ni L. 1331-1, ni les articles L. 1332-1 à L. 1332-5 de la
     procédure disciplinaire, ni les articles R. 1332-1 à R. 1332-3 qui les
     appliquent. Et L. 1334-1, seul autre texte répressif du titre, ne vise
     qu'un article : L. 1331-2.
     Conséquence, tenue article par article : de DIS-CTL-SAN-01 à
     DIS-CTL-SAN-12, seul DIS-CTL-SAN-02 — la sanction pécuniaire — est coté 1.
     Tous les autres restent au degré 3, non par prudence rédactionnelle mais
     parce qu'aucun texte lu ne les punit : ce que risque l'employeur est
     l'annulation de la sanction par le conseil de prud'hommes (L. 1333-2), et
     c'est exactement ce que le degré 3 annonce. Relever l'un d'eux
     reviendrait à annoncer une amende qu'aucun texte ne porte.
     Deux cas frontaliers, notés pour qu'on n'y revienne pas : DIS-CTL-SAN-03
     et DIS-CTL-SAN-04 citent L. 1321-1, 3°, qui est bien dans l'énumération de
     R. 1323-1 — mais ce qu'ils contrôlent n'est pas le contenu du règlement
     intérieur (c'est l'objet de DIS-CTL-RI-03, coté 1) : c'est le fait de
     prononcer une sanction hors de l'échelle que le règlement fixe. Sortir de
     son propre règlement n'est pas méconnaître L. 1321-1, et aucun texte lu ne
     l'érige en infraction. Ils restent au degré 3. */

  "DIS-CTL-SAN-01": {
    gravite: 3,
    quoiFaire: "Informer le salarié, par écrit, des griefs retenus contre lui, avant toute sanction.",
    risque: "« Aucune sanction ne peut être prise à l'encontre du salarié sans que celui-ci soit informé, dans le même temps et par écrit, des griefs retenus contre lui » (L. 1332-1). L'exigence porte sur toute sanction au sens de L. 1331-1 — toute mesure autre que les observations verbales — et ne connaît pas l'exception que L. 1332-2 réserve à l'avertissement. La sanction prise sans cet écrit est irrégulière en la forme, et le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Immédiat pour l'avenir ; pour la sanction déjà prise, c'est elle qu'il faut reprendre.",
    document: "Écrit d'énonciation des griefs retenus contre le salarié",
    etapes: [
      "Reprendre la mesure prononcée et vérifier qu'elle est bien une sanction au sens de L. 1331-1 : toute mesure autre qu'une observation verbale, de nature à affecter immédiatement ou non la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération.",
      "Si aucun écrit n'a énoncé les griefs, retirer la sanction plutôt que de la compléter après coup : L. 1332-1 exige que l'information soit donnée « dans le même temps », et un écrit postérieur ne rétablit pas ce simultané.",
      "Reprendre, s'il y a lieu, une procédure régulière : énonciation écrite des griefs, puis convocation et entretien lorsqu'ils sont dus, en veillant au délai de deux mois de L. 1332-4 qui court de la connaissance des faits.",
      "Conserver l'écrit et la preuve de sa remise : c'est cette pièce, et non le souvenir d'un entretien, qui établit l'information.",
    ],
    verifs: [
      { cle: "san01EcritDate", question: "À quelle date, et par quel écrit, les griefs ont-ils été portés à la connaissance du salarié ?", attendu: "La date et l'écrit lui-même, avec la preuve de sa remise (L. 1332-1)." },
      { cle: "san01Contenu", question: "Quels faits cet écrit énonce-t-il ?", attendu: "Les faits, tels qu'ils y sont écrits : L. 1332-1 veut que le salarié soit informé des griefs retenus contre lui, non de leur existence." },
    ],
  },

  "DIS-CTL-SAN-02": {
    gravite: 1,
    quoiFaire: "Supprimer toute amende ou retenue sur la rémunération qui ne soit pas la conséquence d'une suspension du contrat, et restituer les sommes retenues.",
    risque: "« Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite » (L. 1331-2). L'interdiction est absolue : elle ne se négocie ni par le contrat ni par le règlement intérieur. Elle est en outre la seule du chapitre que le code assortit d'une peine : « le fait d'infliger une amende ou une sanction pécuniaire en méconnaissance des dispositions de l'article L. 1331-2 est puni d'une amende de 3 750 euros » (L. 1334-1). Le conseil de prud'hommes peut par ailleurs annuler la sanction (L. 1333-2), et la somme retenue reste due.",
    delai: "Immédiat : la retenue se répare sur la paie suivante.",
    document: "Note de retrait de la sanction pécuniaire et régularisation de paie",
    etapes: [
      "Identifier la mesure pécuniaire : amende, pénalité, retenue, suppression de prime prononcée à titre de sanction, quelle que soit sa dénomination.",
      "La distinguer de ce qui n'en est pas une : la retenue correspondant à une mise à pied disciplinaire régulièrement prononcée n'est pas une sanction pécuniaire, elle est la conséquence de la suspension du contrat pendant les jours de mise à pied.",
      "Retirer la sanction pécuniaire par écrit, et restituer la somme sur la paie suivante, avec une ligne de régularisation identifiable.",
      "Purger le règlement intérieur, les contrats et les notes de toute stipulation qui la prévoyait : L. 1331-2 la répute non écrite, mais la laisser figurer entretient la pratique.",
    ],
    verifs: [
      { cle: "san02Retenue", question: "La sanction s'accompagne-t-elle d'une retenue sur la rémunération, et de quel montant ?", attendu: "Le montant, ou l'absence de retenue. Seule la retenue correspondant à la suspension du contrat pendant une mise à pied disciplinaire échappe à L. 1331-2." },
      { cle: "san02Bulletin", question: "Quel bulletin de paie porte cette retenue, et pour quelle période ?", attendu: "Le bulletin et la période, à confronter aux jours de mise à pied effectivement prononcés." },
    ],
  },

  "DIS-CTL-SAN-03": {
    gravite: 3,
    quoiFaire: "Ne prononcer que des sanctions figurant dans l'échelle du règlement intérieur, et retirer celle qui n'y figure pas.",
    risque: "La nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au règlement intérieur, que L. 1311-2 rend obligatoire à partir de cinquante salariés. Le contrôle DIS-CTL-SAN-03 cite les décisions qui en tirent la conséquence : chez l'employeur tenu d'établir un règlement intérieur, une sanction autre que le licenciement ne peut être prononcée que si elle y est prévue. À défaut, elle est irrégulière et le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Immédiat pour le retrait de la sanction ; deux mois si l'échelle doit être créée ou complétée.",
    document: "Note de retrait de la sanction non prévue par le règlement intérieur",
    etapes: [
      "Prendre le règlement intérieur dans la version en vigueur à la date de la sanction — et non dans celle d'aujourd'hui — et y chercher la sanction prononcée dans l'échelle.",
      "Si elle n'y figure pas, retirer la sanction par écrit et en informer le salarié : la maintenir laisse prospérer une irrégularité que le juge peut sanctionner par l'annulation (L. 1333-2).",
      "Examiner s'il existe, dans l'échelle telle qu'elle est écrite, une sanction adaptée aux faits, et reprendre le cas échéant une procédure régulière en respectant le délai de deux mois de L. 1332-4.",
      "Compléter l'échelle pour l'avenir par un avenant au règlement intérieur, avec l'avis du comité social et économique et les formalités de L. 1321-4 : une échelle complétée ne rétroagit pas sur une sanction déjà prononcée.",
    ],
    verifs: [
      { cle: "san03Article", question: "Quel article du règlement intérieur prévoit la sanction prononcée ?", attendu: "L'article, cité et pointé sur le document." },
      { cle: "san03Version", question: "Quelle version du règlement intérieur était en vigueur à la date de la sanction ?", attendu: "La version, avec sa date d'entrée en vigueur : c'est elle qui s'applique, non celle d'aujourd'hui." },
    ],
  },

  "DIS-CTL-SAN-04": {
    gravite: 3,
    quoiFaire: "Ramener la mise à pied disciplinaire dans la limite de la durée maximale que le règlement intérieur fixe, ou la retirer.",
    risque: "L. 1321-1, 3°, réserve au règlement intérieur la nature et l'échelle des sanctions, et le contrôle DIS-CTL-SAN-04 cite la décision qui en tire la règle : une mise à pied disciplinaire n'est licite que si le règlement intérieur précise sa durée maximale. Une mise à pied qui excède cette durée excède l'échelle, et la sanction est annulable comme irrégulière en la forme (L. 1333-2). La rémunération des jours retenus en excès reste due.",
    delai: "Immédiat : les jours excédentaires se corrigent avant d'être exécutés, et se paient s'ils l'ont été.",
    document: "Note rectificative de la durée de la mise à pied disciplinaire",
    etapes: [
      "Relever deux nombres : la durée maximale inscrite au règlement intérieur en vigueur à la date de la sanction, et la durée effectivement prononcée.",
      "Si la seconde excède la première, ramener la mise à pied à la durée maximale par une décision écrite notifiée au salarié, et lui rendre les jours retirés en excès.",
      "Régulariser la paie des jours indûment retenus : la retenue sans support disciplinaire n'est plus la conséquence d'une suspension du contrat, et tombe sous l'interdiction des sanctions pécuniaires de L. 1331-2.",
      "Si le règlement intérieur ne précise aucune durée maximale, retirer la mise à pied et traiter le point au niveau du règlement — c'est l'objet de la régularisation de DIS-CTL-RI-03.",
    ],
    verifs: [
      { cle: "san04Duree", question: "Combien de jours la mise à pied disciplinaire prononcée compte-t-elle, et entre quelles dates ?", attendu: "Le nombre de jours et les dates de début et de fin, portés sur la notification." },
      { cle: "san04Plafond", question: "Quelle durée maximale le règlement intérieur en vigueur à cette date fixait-il, et à quel article ?", attendu: "Le nombre de jours et l'article (L. 1321-1, 3°)." },
    ],
  },

  "DIS-CTL-SAN-05": {
    gravite: 3,
    quoiFaire: "Retirer la sanction fondée sur des faits prescrits, et n'engager les poursuites que dans les deux mois de la connaissance des faits.",
    risque: "« Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales » (L. 1332-4). Le délai est de prescription : passé le terme, le fait ne peut plus fonder une sanction, quelle que soit sa gravité. R. 1332-1 impose d'ailleurs que la lettre de convocation soit remise ou adressée dans ce délai de deux mois.",
    delai: "Immédiat : le délai est passé ou il ne l'est pas, et rien ne le rouvre.",
    document: "Note de retrait de la sanction fondée sur des faits prescrits",
    etapes: [
      "Fixer le point de départ : le jour où l'employeur a eu connaissance des faits, et non celui où ils se sont produits ni celui où l'enquête s'est achevée. Documenter cette date par la pièce qui l'établit — signalement, constat, rapport reçu.",
      "Fixer la date d'engagement des poursuites : celle de la lettre de convocation à l'entretien préalable, ou, lorsque aucun entretien n'était dû, celle de la notification. R. 1332-1 rattache expressément la convocation au délai de deux mois de L. 1332-4.",
      "Comparer les deux dates. Si l'écart dépasse deux mois, vérifier la seule réserve que le texte prévoit : les faits ont-ils donné lieu, dans le même délai de deux mois, à l'exercice de poursuites pénales ? La réserve suppose que les poursuites aient été exercées dans le délai, non après.",
      "Hors cette réserve, retirer la sanction par écrit : le fait prescrit ne peut plus la fonder. Pour l'avenir, engager les poursuites dès la connaissance des faits, sans attendre l'issue d'une enquête interne au-delà du terme.",
    ],
    verifs: [
      { cle: "san05Connaissance", question: "À quelle date exacte l'employeur a-t-il eu connaissance des faits, et par quelle pièce ?", attendu: "La date et la pièce qui l'établit : c'est d'elle que court le délai de deux mois (L. 1332-4)." },
      { cle: "san05Engagement", question: "À quelle date les poursuites ont-elles été engagées, et par quel acte ?", attendu: "La date de la lettre de convocation ou, à défaut d'entretien dû, de la notification ; R. 1332-1 veut que la convocation soit remise ou adressée dans ce délai." },
      { cle: "san05Penales", question: "Les faits ont-ils donné lieu à des poursuites pénales, et à quelle date ont-elles été exercées ?", attendu: "La date de l'acte de poursuite : L. 1332-4 ne réserve le cas que si elles ont été exercées dans le même délai de deux mois." },
    ],
  },

  "DIS-CTL-SAN-06": {
    gravite: 3,
    quoiFaire: "Écarter de la motivation de la sanction toute sanction antérieure de plus de trois ans, et réexaminer la mesure sans elle.",
    risque: "« Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction » (L. 1332-5). Une sanction qui ne tient que par un passé disciplinaire prescrit perd son appui : le conseil de prud'hommes peut l'annuler comme irrégulière en la forme, injustifiée ou disproportionnée (L. 1333-2).",
    delai: "Quelques jours : c'est une relecture du dossier et de la lettre de notification.",
    document: "Note rectificative des motifs de la sanction, expurgée des sanctions antérieures prescrites",
    etapes: [
      "Lister les sanctions antérieures invoquées, avec la date de leur notification, et relever la date d'engagement des poursuites en cours.",
      "Écarter celles dont la notification est antérieure de plus de trois ans à cet engagement : L. 1332-5 en interdit l'invocation, sans exception.",
      "Réexaminer la mesure au vu des seuls éléments qui subsistent, et se demander si elle tenait par eux seuls. Si elle ne tenait que par le passé écarté, la retirer.",
      "Reprendre la lettre de notification pour qu'aucune sanction prescrite n'y soit mentionnée, et purger les dossiers individuels des mentions devenues inutilisables.",
    ],
    verifs: [
      { cle: "san06Anterieures", question: "Quelles sanctions antérieures sont invoquées, et à quelles dates ont-elles été notifiées ?", attendu: "La liste datée, avec les notifications." },
      { cle: "san06PlusAncienne", question: "Quelle est la date de la plus ancienne, et quelle est celle de l'engagement des poursuites ?", attendu: "Les deux dates : L. 1332-5 écarte toute sanction antérieure de plus de trois ans à l'engagement des poursuites." },
    ],
  },

  "DIS-CTL-SAN-07": {
    gravite: 3,
    quoiFaire: "Convoquer le salarié et tenir l'entretien préalable avant de prononcer la sanction, chaque fois qu'il est dû.",
    risque: "Lorsque l'employeur envisage une sanction, il convoque le salarié en lui précisant l'objet de la convocation ; au cours de l'entretien, il indique le motif de la sanction envisagée et recueille les explications du salarié (L. 1332-2). L'exception que ce texte réserve à l'avertissement tombe lorsque le règlement intérieur ou la convention collective subordonnent le licenciement à l'existence de sanctions antérieures : la sanction peut alors avoir une influence sur le maintien du salarié dans l'entreprise, et l'entretien devient une garantie de fond (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204). La sanction prise sans l'entretien dû est irrégulière en la forme, et le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Deux à trois semaines, sans jamais sortir du délai de deux mois de L. 1332-4.",
    document: "Lettre de convocation à l'entretien préalable et compte rendu d'entretien",
    etapes: [
      "Déterminer d'abord si l'entretien est dû : il l'est pour toute sanction, sauf l'avertissement ou une sanction de même nature sans incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération (L. 1332-2).",
      "Lire le règlement intérieur et la convention collective avant de conclure que l'entretien n'est pas dû : s'ils subordonnent le licenciement à l'existence de sanctions antérieures, l'avertissement lui-même peut peser sur le maintien du salarié dans l'entreprise, et l'entretien est alors dû au titre d'une garantie de fond (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204).",
      "Convoquer par une lettre portant les mentions de R. 1332-1, remise contre récépissé ou adressée par lettre recommandée, dans le délai de deux mois de L. 1332-4.",
      "Tenir l'entretien : indiquer le motif de la sanction envisagée, recueillir les explications du salarié, laisser jouer l'assistance par une personne de son choix appartenant au personnel de l'entreprise, et consigner le tout dans un compte rendu daté.",
      "Si la sanction a déjà été prononcée sans l'entretien dû, la retirer : un entretien tenu après coup ne répare pas une sanction déjà notifiée.",
    ],
    verifs: [
      { cle: "san07Convocation", question: "À quelle date le salarié a-t-il été convoqué, et à quelle date l'entretien s'est-il tenu ?", attendu: "Les deux dates, avec la convocation et la preuve de sa remise." },
      { cle: "san07Assistance", question: "Le salarié s'est-il fait assister, et par qui ?", attendu: "Le nom et la qualité de la personne, ou la mention qu'il y a renoncé ; L. 1332-2 ouvre l'assistance à une personne du choix du salarié appartenant au personnel de l'entreprise." },
      { cle: "san07Explications", question: "Quel écrit consigne le motif indiqué au salarié et les explications qu'il a données ?", attendu: "Le compte rendu d'entretien, daté : L. 1332-2 impose que l'employeur indique le motif et recueille les explications." },
      { cle: "san07Garantie", question: "Le règlement intérieur ou la convention collective subordonnent-ils le licenciement à l'existence de sanctions antérieures ?", attendu: "La clause, citée : dans ce cas l'entretien est dû même avant un avertissement (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204)." },
    ],
  },

  "DIS-CTL-SAN-08": {
    gravite: 3,
    quoiFaire: "Reprendre la lettre de convocation pour qu'elle porte les quatre exigences de R. 1332-1 et soit remise dans l'une des deux formes qu'il ouvre.",
    risque: "R. 1332-1 exige que la lettre indique l'objet de l'entretien, précise sa date, son heure et son lieu, rappelle que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et soit remise contre récépissé ou adressée par lettre recommandée, dans le délai de deux mois fixé à l'article L. 1332-4. Une convocation privée de la mention d'assistance prive le salarié de sa défense avant même l'entretien ; la sanction qui suit est irrégulière en la forme (L. 1333-2).",
    delai: "Immédiat : c'est une lettre à refaire, avant l'entretien.",
    document: "Lettre de convocation à l'entretien préalable — mentions de R. 1332-1",
    etapes: [
      "Reprendre le modèle de convocation et y vérifier les quatre exigences de R. 1332-1, une par une : l'objet de l'entretien, la date, l'heure et le lieu, le rappel du droit d'assistance, la forme de la remise.",
      "Écrire l'objet en clair — un entretien préalable à une éventuelle sanction — sans le noyer dans une formule vague : L. 1332-2 impose de préciser l'objet de la convocation.",
      "Rappeler mot pour mot la faculté d'assistance par une personne du choix du salarié appartenant au personnel de l'entreprise.",
      "Remettre la lettre contre récépissé ou l'adresser par lettre recommandée : R. 1332-1 n'ouvre que ces deux voies, et la date de cette remise doit tomber dans le délai de deux mois de L. 1332-4.",
      "Si l'entretien s'est déjà tenu sur une convocation irrégulière, ne pas prononcer la sanction sur ce fondement : reconvoquer régulièrement, si le délai de deux mois le permet encore.",
    ],
    verifs: [
      { cle: "san08Objet", question: "Que la lettre de convocation indique-t-elle comme objet de l'entretien ?", attendu: "La mention, telle qu'elle est écrite sur la lettre (R. 1332-1)." },
      { cle: "san08DateHeureLieu", question: "Quels date, heure et lieu la lettre précise-t-elle ?", attendu: "Les trois mentions, portées sur la lettre." },
      { cle: "san08Assistance", question: "La lettre rappelle-t-elle que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise ?", attendu: "La phrase elle-même, telle qu'elle figure sur la lettre." },
      { cle: "san08Remise", question: "Par quelle voie et à quelle date la lettre a-t-elle été remise ou adressée ?", attendu: "Le récépissé daté ou l'avis de recommandé : R. 1332-1 n'ouvre que ces deux voies." },
    ],
  },

  "DIS-CTL-SAN-09": {
    gravite: 3,
    quoiFaire: "Notifier la sanction au moins deux jours ouvrables et au plus un mois après le jour fixé pour l'entretien.",
    risque: "« La sanction ne peut intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour fixé pour l'entretien » (L. 1332-2). R. 1332-3 dit comment se compte le mois : il expire à vingt-quatre heures le jour du mois suivant qui porte le même quantième que le jour fixé pour l'entretien, à défaut de quantième identique le dernier jour du mois suivant, et il est prorogé jusqu'au premier jour ouvrable suivant lorsque son dernier jour est un samedi, un dimanche ou un jour férié ou chômé. R. 1332-2 impose la notification dans ce même délai d'un mois. Hors des deux bornes, la sanction est irrégulière en la forme et peut être annulée (L. 1333-2).",
    delai: "Le délai est celui du texte : entre deux jours ouvrables et un mois après l'entretien.",
    document: "Calendrier de notification — bornes de L. 1332-2 calculées selon R. 1332-3",
    etapes: [
      "Noter le jour fixé pour l'entretien : les deux délais courent de ce jour, et non de celui où la décision a été arrêtée.",
      "Calculer la borne basse : deux jours ouvrables au moins doivent s'écouler, ce qui laisse au salarié le temps de faire valoir ce qu'il a dit à l'entretien.",
      "Calculer la borne haute selon R. 1332-3 : même quantième le mois suivant, à vingt-quatre heures ; à défaut de quantième identique, le dernier jour du mois suivant ; prorogation au premier jour ouvrable suivant si ce jour est un samedi, un dimanche ou un jour férié ou chômé. Vérifier le calendrier des jours fériés à la main : l'application ne le tient pas.",
      "Notifier dans l'intervalle, contre récépissé ou par lettre recommandée (R. 1332-2), et conserver la preuve datée de cette remise — c'est elle qui fixe la date de la sanction.",
      "Si le mois est passé, ne pas notifier : la sanction serait irrégulière. Le cas se traite comme un retrait, non comme un rattrapage.",
    ],
    verifs: [
      { cle: "san09Entretien", question: "Quel jour a été fixé pour l'entretien ?", attendu: "La date, celle que porte la convocation : les deux délais de L. 1332-2 courent de ce jour." },
      { cle: "san09Notification", question: "À quelle date la sanction a-t-elle été notifiée ?", attendu: "La date de la remise contre récépissé ou de l'envoi recommandé." },
      { cle: "san09Feries", question: "Un jour férié ou chômé s'intercale-t-il entre l'entretien et la notification, ou tombe-t-il au terme du délai d'un mois ?", attendu: "Le calendrier : R. 1332-3 proroge le terme au premier jour ouvrable suivant lorsqu'il tombe un samedi, un dimanche ou un jour férié ou chômé, et l'application ne tient pas ce calendrier." },
    ],
  },

  "DIS-CTL-SAN-10": {
    gravite: 3,
    quoiFaire: "Notifier la sanction par une décision écrite et motivée, remise contre récépissé ou adressée par lettre recommandée.",
    risque: "« La sanction prévue à l'article L. 1332-2 fait l'objet d'une décision écrite et motivée. La décision est notifiée au salarié soit par lettre remise contre récépissé, soit par lettre recommandée, dans le délai d'un mois prévu par l'article L. 1332-2 » (R. 1332-2) ; L. 1332-2 le dit dans les mêmes termes — la sanction « est motivée et notifiée à l'intéressé ». Une notification qui n'énonce pas les griefs ne met pas le salarié en mesure de les discuter, et la sanction est irrégulière en la forme : le conseil de prud'hommes peut l'annuler (L. 1333-2).",
    delai: "Immédiat, et en tout cas dans le mois qui suit l'entretien.",
    document: "Lettre de notification de la sanction — décision écrite et motivée",
    etapes: [
      "Écrire la décision : R. 1332-2 exige un écrit, et une sanction annoncée oralement n'en est pas un.",
      "La motiver en énonçant les faits reprochés, datés et circonstanciés, et non par une formule générale : c'est la motivation qui permet au salarié de discuter les griefs et au juge d'apprécier.",
      "Nommer la sanction telle que le règlement intérieur la nomme, et en préciser la portée — pour une mise à pied, les dates de début et de fin.",
      "Remettre la lettre contre récépissé ou l'adresser par lettre recommandée, dans le délai d'un mois prévu par L. 1332-2, et conserver la preuve datée.",
    ],
    verifs: [
      { cle: "san10Ecrit", question: "Quel écrit porte la décision de sanction ?", attendu: "La lettre de notification elle-même (R. 1332-2)." },
      { cle: "san10Motifs", question: "Quels motifs la décision énonce-t-elle ?", attendu: "Les motifs, tels qu'ils y sont écrits : L. 1332-2 et R. 1332-2 imposent l'un et l'autre qu'elle soit motivée." },
      { cle: "san10Remise", question: "Par quelle voie et à quelle date la décision a-t-elle été notifiée ?", attendu: "Le récépissé daté ou l'avis de recommandé (R. 1332-2)." },
    ],
  },

  "DIS-CTL-SAN-11": {
    gravite: 3,
    quoiFaire: "Faire suivre toute mise à pied conservatoire de la procédure de L. 1332-2 avant de prononcer la sanction définitive.",
    risque: "« Lorsque les faits reprochés au salarié ont rendu indispensable une mesure conservatoire de mise à pied à effet immédiat, aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure prévue à l'article L. 1332-2 ait été respectée » (L. 1332-3). La mise à pied conservatoire n'est pas une sanction : elle attend la décision, elle ne la remplace pas. Une sanction définitive prise sans convocation ni entretien est irrégulière en la forme et peut être annulée (L. 1333-2) ; et la mise à pied conservatoire non suivie de la procédure risque d'être requalifiée en sanction, avec la retenue de salaire qui l'accompagne.",
    delai: "Quelques jours : la mise à pied conservatoire est une mesure d'attente, elle ne se prolonge pas.",
    document: "Notification de mise à pied conservatoire et convocation à l'entretien préalable",
    etapes: [
      "Notifier la mise à pied conservatoire par écrit en la qualifiant comme telle, en indiquant qu'elle est prise dans l'attente de la décision et non à titre de sanction.",
      "Engager sans attendre la procédure de L. 1332-2 : convocation portant les mentions de R. 1332-1, remise contre récépissé ou adressée par lettre recommandée.",
      "Tenir l'entretien, y indiquer le motif de la sanction envisagée et recueillir les explications du salarié, puis notifier la décision écrite et motivée dans les bornes de L. 1332-2.",
      "Si la mise à pied conservatoire n'a été suivie d'aucune procédure, ne pas prononcer la sanction définitive sur ces faits : L. 1332-3 l'interdit tant que la procédure de L. 1332-2 n'a pas été respectée, et le délai de deux mois de L. 1332-4 continue de courir.",
    ],
    verifs: [
      { cle: "san11MisePiedDates", question: "Entre quelles dates la mise à pied conservatoire a-t-elle couru, et quel écrit l'a notifiée ?", attendu: "Les dates de début et de fin, et l'écrit qui la qualifie de conservatoire." },
      { cle: "san11Enchainement", question: "À quelles dates la convocation, l'entretien et la notification de la sanction définitive sont-ils intervenus ?", attendu: "Les trois dates : L. 1332-3 exige que la procédure de L. 1332-2 ait été respectée avant toute sanction définitive relative à ces faits." },
    ],
  },

  "DIS-CTL-SAN-12": {
    gravite: 3,
    quoiFaire: "Accomplir, avant le prononcé de la sanction, la procédure que la convention collective ou le règlement intérieur imposent — et l'accomplir à temps.",
    risque: "C'est le manquement le plus coûteux du module, parce qu'il ne se répare pas. « La consultation d'un organisme chargé, en vertu d'une disposition conventionnelle ou d'un règlement intérieur, de donner son avis sur un licenciement envisagé par un employeur constitue une garantie de fond, en sorte que le licenciement prononcé sans que cet organisme ait été consulté ne peut avoir de cause réelle et sérieuse » ; l'irrégularité commise dans le déroulement de la procédure disciplinaire prévue par une telle disposition est assimilée à la violation d'une garantie de fond lorsqu'elle a privé le salarié de droits de sa défense ou qu'elle est susceptible d'avoir exercé une influence sur la décision finale (Soc., 8 septembre 2021, n° 19-15.039). Le caractère tardif de la demande d'avis est lui-même une irrégularité de la procédure disciplinaire (Soc., 20 mars 2024, n° 22-17.292). Pour une sanction autre que le licenciement, le conseil de prud'hommes apprécie si la sanction irrégulière en la forme doit être annulée (L. 1333-2).",
    delai: "Le temps que la clause prévoit, et pas moins : c'est la première chose à regarder, avant même de convoquer.",
    document: "Saisine de l'organisme prévu par la convention collective ou le règlement intérieur, et avis rendu",
    etapes: [
      "Lire la convention collective applicable et le règlement intérieur avant toute convocation, et relever ce qu'ils imposent : consultation d'un conseil de discipline ou d'une commission paritaire, entretien supplémentaire, délai de réflexion, forme particulière de notification.",
      "Relever les délais que la clause fixe : c'est le calendrier conventionnel qui commande, et une saisine tardive est en elle-même une irrégularité de la procédure disciplinaire.",
      "Saisir l'organisme, ou accomplir la formalité, avant le prononcé de la sanction, et conserver la date de saisine, la composition de l'organisme et l'avis rendu.",
      "Ne notifier la sanction qu'après l'avis, en veillant à rester dans les bornes de L. 1332-2 : les délais conventionnels ne suspendent pas le mois qui suit l'entretien.",
      "Si la procédure n'a pas été suivie, ou l'a été tardivement, retirer la sanction plutôt que de la maintenir : l'irrégularité ne se répare pas après coup, et la reprendre régulièrement dès l'origine est la seule voie — sous réserve du délai de deux mois de L. 1332-4.",
    ],
    verifs: [
      { cle: "san12Clause", question: "Quelle stipulation de la convention collective ou quel article du règlement intérieur prévoit la procédure, et que prévoit-il exactement ?", attendu: "Le texte de la clause, cité, avec les délais qu'elle fixe." },
      { cle: "san12Saisine", question: "À quelle date l'organisme a-t-il été saisi, ou la formalité accomplie, et à quelle date la sanction a-t-elle été notifiée ?", attendu: "Les deux dates : le caractère tardif de la demande d'avis est en lui-même une irrégularité de la procédure disciplinaire (Soc., 20 mars 2024, n° 22-17.292)." },
      { cle: "san12Avis", question: "Quel écrit consigne l'avis rendu et son contenu ?", attendu: "L'avis, daté, et la trace de la composition de l'organisme (Soc., 8 septembre 2021, n° 19-15.039)." },
    ],
  },

  /* Ce contrôle mesure l'exposition résultant des autres : il ne se régularise
     pas pour lui-même — on régularise ce qui la cause. Il ne rend d'ailleurs
     jamais « conforme » (il figure dans DETECTION), et n'a donc rien à
     reprendre au second temps non plus. */
  "DIS-CTL-EXP-01": null,
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
      /* Les clés voyagent jusqu'au formulaire de la page : deux clés identiques
         y feraient répondre une question à la place d'une autre. */
      if (v.cle && CLES.has(v.cle))
        ECARTS.push(`${id} : la clé de vérification « ${v.cle} » est déjà utilisée par ${CLES.get(v.cle)}`);
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

__def("./modeles-discipline.js", function(module, exports, require){
/* Les modèles de régularisation — étape 5 du parcours client.

   Chaque contrôle non conforme ou à vérifier a droit à mieux qu'un rappel de
   texte : une note chiffrée sur le dossier remis — les dates de la procédure,
   les délais qui en découlent, l'effectif déclaré, le contenu du règlement
   intérieur tel qu'il est décrit. Rien n'est une coquille générique : quand une
   donnée manque pour calculer, la note le dit et pose un exemple marqué
   « [exemple] », jamais une valeur inventée présentée comme celle du client.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de régime (moteur-discipline.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit, pour
   que ce modèle s'imprime exactement comme le reste du module.

   Les seuls textes et délais cités sont ceux déjà lus et posés par
   moteur-discipline.js, controles-discipline.js et regularisation-discipline.js :
   ce fichier ne capture aucun article, il met en chiffres ce qui l'est déjà. */
const O = require("./outils.js");
const D = require("./dates.js");
const M = require("./moteur-discipline.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const ex = v => v + " [exemple]";
const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const jour0 = f => (D.estDateISO(f.dateAudit) ? f.dateAudit : new Date().toISOString().slice(0, 10));
const natureDeclaree = f => q((f.sanction || {}).nature);

/* ═══════════════════════════════════ le règlement intérieur — obligation ═══ */

function modeleRi01(f) {
  const A = O(); const { t1, h1, h2, p, puce, note, tab } = A;
  t1("Note d'obligation — règlement intérieur — " + nomE(f));
  const d = M.riDu(f);
  h1("Le calcul, sur ce dossier");
  p(d.motif);
  if (d.connu && d.du) {
    const ri = f.ri || {};
    const seuilDeclare = q(ri.dateFranchissementSeuil);
    const seuil = seuilDeclare || jour0(f);
    const terme = M.moisApres(seuil, 12);
    h2("Le calendrier de l'obligation, calculé sur ces dates");
    tab(["Étape", "Date"], [
      ["Franchissement du seuil de cinquante salariés" + (seuilDeclare ? "" : " — exemple, faute de date déclarée"), seuilDeclare ? seuil : ex(seuil)],
      ["Terme du délai de douze mois (L. 1311-2, second alinéa ; R. 1321-5)", terme ? (seuilDeclare ? terme : ex(terme)) : "—"],
      ["Situation décrite au", jour0(f)],
    ]);
    if (seuilDeclare && d.delai && d.delai.mois !== null)
      puce(d.delai.atteint
        ? `Le délai de douze mois est écoulé depuis environ ${d.delai.mois} mois : l'obligation est pleinement due, avec ou sans règlement en l'état.`
        : `Il reste environ ${Math.max(0, Math.round((12 - d.delai.mois) * 10) / 10)} mois avant le terme du délai de douze mois.`);
  } else if (d.connu && !d.du) {
    p("Sans objet en l'état de l'effectif déclaré : ce modèle vaudrait le jour où l'entreprise franchirait le seuil de cinquante salariés, ou déciderait de se doter volontairement d'un règlement.");
    return A.D;
  } else return A.D;
  h2("Les quatre formalités qui suivent la rédaction");
  puce("Avis du comité social et économique (L. 1321-4) — note DIS-CTL-RI-06.");
  puce("Publicité auprès du personnel (R. 1321-1) — note DIS-CTL-RI-07.");
  puce("Dépôt au greffe du conseil de prud'hommes (R. 1321-2) — note DIS-CTL-RI-08.");
  puce("Communication à l'inspecteur du travail en deux exemplaires (L. 1321-4 ; R. 1321-4) — note DIS-CTL-RI-09.");
  note("« Produire le document », ci-dessous, écrit le projet de règlement intérieur en entier, avec ses trois courriers d'accompagnement.");
  return A.D;
}

function modeleRi02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille du contenu — les trois matières de L. 1321-1 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare, matière par matière");
  const etat = v => (dit(v) ? "présente" : nie(v) ? "absente" : "non renseignée");
  tab(["Matière (L. 1321-1)", "Déclarée dans le règlement"], [
    ["1° Santé et sécurité, dont les instructions de L. 4122-1", etat(ri.contenuSanteSecurite)],
    ["2° Participation au rétablissement de conditions de travail protectrices", etat(ri.contenuParticipation)],
    ["3° Discipline — nature et échelle des sanctions", etat(ri.contenuDiscipline)],
  ]);
  const absentes = ["contenuSanteSecurite", "contenuParticipation", "contenuDiscipline"].filter(c => nie(ri[c])).length;
  if (absentes) p(`${absentes} matière(s) sur trois déclarée(s) absente(s) : c'est ce qu'un avenant doit compléter avant toute nouvelle formalité, pour éviter de les répéter.`);
  note("L. 1321-1 réserve ces trois matières « exclusivement » : une clause étrangère à elles n'y a pas sa place, pas plus qu'une matière manquante ne s'y devine.");
  return A.D;
}

function modeleRi03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille de l'échelle des sanctions — " + nomE(f));
  const ri = f.ri || {};
  const max = nb(ri.misePiedDureeMaxJours);
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Nature et échelle des sanctions fixées (L. 1321-1, 3°)", dit(ri.echelleSanctions) ? "oui" : nie(ri.echelleSanctions) ? "non" : "non renseigné"],
    ["Durée maximale de la mise à pied précisée", dit(ri.misePiedDureeMax) ? (max !== null ? `oui — ${max} jour(s)` : "oui, mais le nombre de jours n'est pas renseigné") : nie(ri.misePiedDureeMax) ? "non" : "non renseigné"],
  ]);
  if (nie(ri.echelleSanctions) || nie(ri.misePiedDureeMax))
    p("Ce défaut est celui qui fait tomber les sanctions déjà prises : voir les notes DIS-CTL-SAN-03 (sanction non prévue) et DIS-CTL-SAN-04 (durée excessive), qui recalculent l'exposition sur la sanction auditée.");
  note("Une sanction absente de la liste ne peut pas être prononcée (Soc., 26 octobre 2010, n° 09-42.740) ; une mise à pied sans plafond écrit n'est pas licite, quelle que soit sa durée effective.");
  return A.D;
}

function modeleRi04(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des trois rappels de L. 1321-2 — " + nomE(f));
  const ri = f.ri || {};
  const etat = v => (dit(v) ? "présent" : nie(v) ? "absent" : "non renseigné");
  h1("Ce que le dossier déclare");
  tab(["Rappel (L. 1321-2)", "État déclaré"], [
    ["1° Droits de la défense (L. 1332-1 à L. 1332-3, ou convention collective)", etat(ri.rappelDroitsDefense)],
    ["2° Harcèlements moral et sexuel, agissements sexistes", etat(ri.rappelHarcelement)],
    ["3° Dispositif de protection des lanceurs d'alerte", etat(ri.rappelLanceursAlerte)],
  ]);
  const manquants = ["rappelDroitsDefense", "rappelHarcelement", "rappelLanceursAlerte"].filter(c => nie(ri[c])).length;
  if (manquants) p(`${manquants} rappel(s) sur trois déclaré(s) absent(s) : L. 1321-2 est rédigé à l'impératif, et « Produire le document » écrit les trois paragraphes prêts à insérer.`);
  note("Ces rappels renvoient à des dispositions que le règlement n'a pas à reproduire in extenso : leur existence suffit, leur absence ne se devine pas sur un règlement non lu par l'application.");
  return A.D;
}

function modeleRi05(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Note de revue des clauses — L. 1321-3 et L. 1321-2-1 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  puce(`Clauses prohibées par L. 1321-3 relevées à la relecture : ${dit(ri.clausesInterdites) ? "oui — à retirer" : nie(ri.clausesInterdites) ? "non" : "non renseigné"}.`);
  puce(`Clause de neutralité (L. 1321-2-1) : ${dit(ri.clauseNeutralite) ? "oui" : nie(ri.clauseNeutralite) ? "non" : "non renseigné"}.`);
  if (dit(ri.clauseNeutralite))
    puce(`Justification et proportionnalité de cette clause consignées par écrit : ${dit(ri.neutraliteJustifieeProportionnee) ? "oui, déclaré" : nie(ri.neutraliteJustifieeProportionnee) ? "non — la clause n'est pas licite en l'état" : "non renseigné"}.`);
  note("La double condition de L. 1321-2-1 — justification et proportionnalité — s'apprécie clause par clause et poste par poste : le contrôle constate la déclaration, il ne juge pas la clause elle-même.");
  return A.D;
}

function modeleRi06(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de consultation du comité — L. 1321-4 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Comité social et économique existant", dit((f.cse || {}).existe) ? "oui" : nie((f.cse || {}).existe) ? "non" : "non renseigné"],
    ["Règlement intérieur soumis à son avis avant introduction", dit(ri.avisCSE) ? "oui" : nie(ri.avisCSE) ? "non" : "non renseigné"],
  ]);
  if (nie(ri.avisCSE)) p("Cette consultation doit précéder — et non suivre — l'introduction du règlement : « Produire le document » écrit l'ordre du jour et le modèle de procès-verbal à faire adopter par le comité.");
  note("L'avis est en outre la pièce qui doit accompagner le règlement communiqué à l'inspecteur du travail (L. 1321-4) — voir la note DIS-CTL-RI-09.");
  return A.D;
}

function modeleRi07(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calendrier de publicité et d'entrée en vigueur — " + nomE(f));
  const ri = f.ri || {};
  const v = M.entreeVigueurRI(f);
  h1("Le calcul, sur les dates déclarées");
  if (v.connu) {
    tab(["Étape", "Date"], [
      ["Dernière des formalités de publicité et de dépôt (R. 1321-3)", ri.dateDerniereFormalite],
      ["Plancher légal — un mois après (L. 1321-4)", v.plancher],
      ["Entrée en vigueur inscrite au règlement", ri.dateEntreeVigueur],
    ]);
    p(v.suffisant
      ? `L'entrée en vigueur déclarée est ${v.jours} jour(s) après la dernière formalité : le délai d'un mois est tenu.`
      : `L'entrée en vigueur déclarée est ${v.jours} jour(s) après la dernière formalité, avant le plancher du ${v.plancher} : le délai d'un mois n'est pas tenu, et toute sanction fondée sur le règlement avant cette date est sans support.`);
  } else {
    const der = q(ri.dateDerniereFormalite) || ex(jour0(f));
    const plancher = M.moisApres(q(ri.dateDerniereFormalite) || jour0(f), 1);
    p("Donnée manquante pour calculer : " + v.motif + ` À titre d'illustration, avec une dernière formalité au ${der}, l'entrée en vigueur la plus proche possible serait le ${q(ri.dateDerniereFormalite) ? plancher : ex(plancher)} (exclu).`);
  }
  note("La publicité elle-même — affichage, intranet, remise contre émargement — se prouve par une pièce datée : photographie, capture, liste d'émargement, jamais par la seule affirmation.");
  return A.D;
}

function modeleRi08(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de dépôt au greffe — R. 1321-2 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  p(`Dépôt au greffe du conseil de prud'hommes du ressort : ${dit(ri.depotGreffe) ? "déclaré fait" : nie(ri.depotGreffe) ? "déclaré non fait" : "non renseigné"}.`);
  if (nie(ri.depotGreffe)) p("Tant que ce dépôt n'est pas fait, le délai d'un mois de R. 1321-3 n'a pas commencé de courir, quelle que soit la date de publicité par ailleurs — voir la note DIS-CTL-RI-07.");
  note("« Produire le document » écrit la lettre de dépôt, à adresser au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement.");
  return A.D;
}

function modeleRi09(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de communication à l'inspection du travail — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Communication à l'inspecteur du travail (L. 1321-4)", dit(ri.communicationInspection) ? "oui" : nie(ri.communicationInspection) ? "non" : "non renseigné"],
    ["Communication en deux exemplaires (R. 1321-4)", dit(ri.communicationDeuxExemplaires) ? "oui" : nie(ri.communicationDeuxExemplaires) ? "non" : "non renseigné"],
  ]);
  note("Cette carence, seule du chapitre, ne prive pas le salarié de se prévaloir du règlement (Soc., 28 mars 2000, n° 97-43.411) — elle reste néanmoins punie au même titre que les autres (R. 1323-1) : elle se répare par un simple envoi, sans attendre.");
  return A.D;
}

function modeleRi10(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de langue — L. 1321-6 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  p(`Règlement intérieur rédigé en français : ${dit(ri.redigeFrancais) ? "oui" : nie(ri.redigeFrancais) ? "non" : "non renseigné"}.`);
  note("L'exigence s'étend à tout document comportant des obligations pour le salarié ou dont la connaissance est nécessaire à l'exécution de son travail — pas seulement au règlement lui-même.");
  return A.D;
}

function modeleRi11(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Récapitulatif des modifications et notes de service — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Modifications ou retraits de clauses depuis l'introduction", dit(ri.modifieDepuis) ? "oui" : nie(ri.modifieDepuis) ? "non" : "non renseigné"],
    ["Formalités refaites pour ces modifications", dit(ri.modifieDepuis) ? (dit(ri.modificationsFormalites) ? "oui" : nie(ri.modificationsFormalites) ? "non" : "non renseigné") : "sans objet"],
    ["Notes de service à obligations générales et permanentes", dit(ri.notesServiceGenerales) ? "oui" : nie(ri.notesServiceGenerales) ? "non" : "non renseigné"],
    ["Formalités suivies pour ces notes", dit(ri.notesServiceGenerales) ? (dit(ri.notesServiceFormalites) ? "oui" : nie(ri.notesServiceFormalites) ? "non" : "non renseigné") : "sans objet"],
  ]);
  note("L. 1321-5 traite une note de service à obligations générales et permanentes comme une adjonction au règlement intérieur : elle suit ses formalités en toute hypothèse, sauf l'urgence réservée aux seules obligations de santé et de sécurité.");
  return A.D;
}

function modeleRi12(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Suivi de la demande de l'inspecteur du travail — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Demande de retrait ou de modification (L. 1322-1)", dit(ri.demandeInspection) ? "oui" : nie(ri.demandeInspection) ? "non" : "non renseigné"],
    ["Suivie d'effet, ou recours hiérarchique formé (L. 1322-3)", dit(ri.demandeInspection) ? (dit(ri.suiteDemandeInspection) ? "oui" : nie(ri.suiteDemandeInspection) ? "non" : "non renseigné") : "sans objet"],
  ]);
  if (dit(ri.demandeInspection) && nie(ri.suiteDemandeInspection))
    p("Deux voies seulement s'ouvrent devant une décision motivée : l'exécuter, ou former le recours hiérarchique. Rester sans réponse laisse subsister la disposition que l'inspecteur a désignée par écrit.");
  note("La décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité (L. 1322-2).");
  return A.D;
}

/* ═════════════════════════════════════════════════ la sanction auditée ═══ */

function modeleSan01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note d'énonciation écrite des griefs — L. 1332-1 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  p(`Sanction déclarée : ${natureDeclaree(f) || "non renseignée"}. Griefs portés par écrit au salarié, dans le même temps que la sanction : ${dit(s.griefsEcrits) ? "oui" : nie(s.griefsEcrits) ? "non" : "non renseigné"}.`);
  if (nie(s.griefsEcrits)) p("L. 1332-1 ne connaît pas l'exception réservée à l'avertissement par L. 1332-2 : l'écrit simultané est dû pour toute sanction, avertissement compris.");
  note("« Produire le document » écrit l'énonciation des griefs, prête à compléter des faits datés et circonstanciés — jamais devinés par l'application.");
  return A.D;
}

function modeleSan02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de retrait — sanction pécuniaire — L. 1331-2 — " + nomE(f));
  const s = f.sanction || {};
  const q2 = M.qualification(f);
  h1("Ce que le dossier déclare");
  if (q2.connu && q2.pecuniaire) p(`La sanction déclarée (« ${q2.nature} ») est par nature pécuniaire : l'interdiction de L. 1331-2 est absolue, elle ne se négocie ni par le contrat ni par le règlement intérieur.`);
  else p(`Retenue sur rémunération étrangère à une suspension du contrat : ${dit(s.retenueSalaire) ? "oui — c'est une sanction pécuniaire déguisée" : nie(s.retenueSalaire) ? "non" : "non renseigné"}.`);
  note("« Le fait d'infliger une amende ou une sanction pécuniaire en méconnaissance de l'article L. 1331-2 est puni d'une amende de 3 750 euros » (L. 1334-1) : c'est le seul texte répressif de ce chapitre qui vise la procédure disciplinaire, et non le seul règlement intérieur.");
  return A.D;
}

function modeleSan03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de conformité à l'échelle du règlement intérieur — " + nomE(f));
  const s = f.sanction || {};
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  p(`Sanction déclarée : ${natureDeclaree(f) || "non renseignée"}. Prévue par l'échelle du règlement intérieur : ${dit(s.prevueRI) ? "oui" : nie(s.prevueRI) ? "non" : "non renseigné"} (règlement lui-même déclaré : ${dit(ri.existe) ? "existant" : nie(ri.existe) ? "inexistant" : "non renseigné"}).`);
  if (nie(s.prevueRI) || nie(ri.existe)) p("Vérifiez la version du règlement en vigueur à la date de la sanction, et non celle d'aujourd'hui : une échelle complétée depuis ne rétroagit pas sur une sanction déjà prononcée.");
  note("Une sanction autre que le licenciement ne peut être prononcée que si elle est prévue par le règlement intérieur, chez l'employeur tenu d'en établir un (Soc., 23 mars 2017, n° 15-23.090 ; Soc., 26 octobre 2010, n° 09-42.740).");
  return A.D;
}

function modeleSan04(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la durée de la mise à pied disciplinaire — " + nomE(f));
  const s = f.sanction || {};
  const ri = f.ri || {};
  const q2 = M.qualification(f);
  if (!q2.connu || !q2.misePied) { A.D.push({ k: "p", t: "Sans objet en l'état : la sanction déclarée n'est pas une mise à pied disciplinaire." }); return A.D; }
  const duree = nb(s.dureeMisePiedJours), max = nb(ri.misePiedDureeMaxJours);
  h1("Le calcul, sur les chiffres déclarés");
  tab(["Point", "Valeur"], [
    ["Durée de la mise à pied prononcée", duree === null ? "non renseignée" : duree + " jour(s)"],
    ["Durée maximale fixée par le règlement intérieur", max === null ? "non renseignée" : max + " jour(s)"],
    ["Écart", (duree !== null && max !== null) ? (duree - max > 0 ? `+${duree - max} jour(s) au-delà du plafond` : `${max - duree} jour(s) de marge sous le plafond`) : "non calculable"],
  ]);
  if (duree !== null && max !== null && duree > max)
    p(`La mise à pied excède l'échelle du règlement intérieur de ${duree - max} jour(s) : la rémunération de ces jours reste due, et la sanction est annulable comme irrégulière en la forme (L. 1333-2).`);
  note("Une mise à pied disciplinaire n'est licite que si le règlement intérieur en précise la durée maximale (Soc., 26 octobre 2010, n° 09-42.740).");
  return A.D;
}

function modeleSan05(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la prescription des faits — L. 1332-4 — " + nomE(f));
  const s = f.sanction || {};
  const pr = M.prescriptionFaits(f);
  h1("Le calcul, sur les dates déclarées");
  if (pr.connu) {
    tab(["Étape", "Date"], [
      ["Connaissance des faits par l'employeur", s.dateConnaissance],
      ["Engagement des poursuites — " + pr.engagement.quoi, pr.engagement.date],
      ["Terme du délai de deux mois (L. 1332-4)", pr.limite],
    ]);
    p(pr.depasse
      ? `Les poursuites ont été engagées ${pr.jours} jour(s) après la connaissance des faits, au-delà du terme du ${pr.limite}` +
        (pr.penales === true ? " ; le dossier déclare des poursuites pénales dans le même délai — seule réserve que L. 1332-4 admet, à vérifier qu'elles ont bien été exercées dans ce délai." :
         pr.penales === null ? " ; il n'est pas indiqué si des poursuites pénales ont été exercées dans le même délai, seule réserve du texte." :
         " ; aucune poursuite pénale n'est déclarée dans ce délai : les faits sont prescrits.")
      : `Les poursuites ont été engagées ${pr.jours} jour(s) après la connaissance des faits, dans le délai de deux mois qui expirait le ${pr.limite}.`);
  } else {
    const conn = q(s.dateConnaissance) || ex(jour0(f));
    const limiteEx = M.moisApres(q(s.dateConnaissance) || jour0(f), 2);
    p("Donnée manquante pour calculer : " + pr.motif + ` À titre d'illustration, avec une connaissance des faits au ${conn}, le délai de deux mois expirerait le ${q(s.dateConnaissance) ? limiteEx : ex(limiteEx)}.`);
  }
  note("Le délai est de prescription : passé le terme, le fait ne peut plus fonder une sanction, quelle que soit sa gravité, hors la seule réserve de poursuites pénales exercées dans le même délai.");
  return A.D;
}

function modeleSan06(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la prescription des sanctions antérieures — L. 1332-5 — " + nomE(f));
  const s = f.sanction || {};
  const a = M.sanctionsAnterieures(f);
  h1("Le calcul, sur les dates déclarées");
  if (a.connu && a.invoquees && a.limite) {
    tab(["Étape", "Date"], [
      ["Sanction antérieure la plus ancienne invoquée", s.dateSanctionAnterieurePlusAncienne],
      ["Engagement des poursuites de la nouvelle sanction — " + a.engagement.quoi, a.engagement.date],
      ["Terme des trois ans (L. 1332-5)", a.limite],
    ]);
    p(a.depasse
      ? `Cette sanction antérieure date de plus de trois ans avant l'engagement des poursuites (terme le ${a.limite}) : L. 1332-5 en interdit l'invocation, sans exception.`
      : `Cette sanction antérieure date de moins de trois ans avant l'engagement des poursuites (terme le ${a.limite}) : elle peut être invoquée.`);
  } else if (a.connu && !a.invoquees) {
    p("Aucune sanction antérieure n'est invoquée à l'appui de la nouvelle sanction : ce modèle n'a pas d'objet en l'état.");
  } else {
    p("Donnée manquante pour calculer : " + a.motif);
  }
  note("Une sanction retirée de la motivation pour cause de prescription doit l'être de la lettre de notification elle-même, et des dossiers individuels qui la mentionnent encore.");
  return A.D;
}

function modeleSan07(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note sur l'entretien préalable — L. 1332-2 — " + nomE(f));
  const s = f.sanction || {};
  const e = M.entretienDu(f);
  h1("Le calcul, sur ce dossier");
  p(e.motif || "Donnée manquante pour conclure sur l'entretien préalable.");
  if (e.connu) {
    tab(["Point", "État déclaré"], [
      ["Entretien dû", e.du ? "oui" + (e.fondement === "garantie de fond" ? " — au titre d'une garantie de fond" : " — L. 1332-2") : "non, en l'état déclaré"],
      ["Entretien tenu", dit(s.entretienTenu) ? "oui" : nie(s.entretienTenu) ? "non" : "non renseigné"],
    ]);
    if (e.du === true && nie(s.entretienTenu))
      p("La sanction a été prise sans l'entretien qui était dû : « Produire le document » écrit la lettre de convocation et la trame de compte rendu, pour toute procédure encore engageable dans le délai de deux mois.");
  }
  note("L'employeur qui choisit de convoquer alors que l'entretien n'était pas dû est tenu d'en respecter tous les termes (Soc., 16 avril 2008, n° 06-41.999).");
  return A.D;
}

function modeleSan08(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des quatre mentions de la convocation — R. 1332-1 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  const etat = v => (dit(v) ? "présente" : nie(v) ? "absente" : "non renseignée");
  tab(["Mention (R. 1332-1)", "État déclaré"], [
    ["Objet de l'entretien", etat(s.convocationObjet)],
    ["Date, heure et lieu", etat(s.convocationDateHeureLieu)],
    ["Rappel du droit d'assistance", etat(s.convocationAssistance)],
    ["Mode de remise", q(s.convocationRemise) || "non renseigné"],
  ]);
  if (q(s.convocationRemise) && s.convocationRemise !== "récépissé" && s.convocationRemise !== "lettre recommandée")
    p(`Le mode de remise déclaré (« ${s.convocationRemise} ») n'est ni le récépissé ni la lettre recommandée : R. 1332-1 n'ouvre que ces deux voies.`);
  note("Une convocation privée de la mention d'assistance prive le salarié de sa défense avant même l'entretien.");
  return A.D;
}

function modeleSan09(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul des deux bornes de L. 1332-2 — R. 1332-3 — " + nomE(f));
  const s = f.sanction || {};
  const dn = M.delaiNotification(f);
  h1("Le calcul, sur les dates déclarées");
  if (dn.connu) {
    tab(["Étape", "Valeur"], [
      ["Entretien", s.dateEntretien],
      ["Borne basse — deux jours ouvrables au moins", dn.ouvrables + " jour(s) ouvrable(s) écoulé(s)"],
      ["Terme du mois, compté selon R. 1332-3" + (dn.prorogee ? " (prorogé)" : ""), dn.limiteProrogee],
      ["Notification", s.dateNotification],
    ]);
    p(dn.trop
      ? `La notification est intervenue ${dn.depassement} jour(s) après le terme du ${dn.limiteProrogee} : hors délai.`
      : dn.ouvrables < 2
        ? `La notification est intervenue ${dn.ouvrables} jour(s) ouvrable(s) après l'entretien : sous le minimum de deux jours ouvrables.`
        : `Les deux bornes sont tenues : ${dn.ouvrables} jour(s) ouvrable(s) après l'entretien, et avant le terme du ${dn.limiteProrogee}.`);
    if (dn.ouvrables === 2 || (dn.trop && dn.depassement <= 2))
      note("L'application compte les jours ouvrables hors dimanche et ne tient pas le calendrier des jours fériés : sur un résultat à la limite, un jour férié dans l'intervalle peut faire basculer la conclusion. Vérifiez le calendrier avant de conclure.");
  } else {
    p("Donnée manquante pour calculer : " + dn.motif);
  }
  return A.D;
}

function modeleSan10(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille de la décision écrite et motivée — R. 1332-2 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  const etat = v => (dit(v) ? "oui" : nie(v) ? "non" : "non renseigné");
  tab(["Point (L. 1332-2 ; R. 1332-2)", "État déclaré"], [
    ["Décision écrite", etat(s.notificationEcrite)],
    ["Décision motivée", etat(s.notificationMotivee)],
    ["Mode de notification", q(s.notificationRemise) || "non renseigné"],
  ]);
  note("Une notification qui n'énonce pas les griefs ne met pas le salarié en mesure de les discuter : « Produire le document » écrit la lettre entière, motifs entre crochets pour que rien ne soit deviné à sa place.");
  return A.D;
}

function modeleSan11(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note sur la mise à pied conservatoire — L. 1332-3 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Mise à pied conservatoire prononcée", dit(s.misePiedConservatoire) ? "oui" : nie(s.misePiedConservatoire) ? "non" : "non renseigné"],
    ["Entretien tenu ensuite", dit(s.entretienTenu) ? "oui" : nie(s.entretienTenu) ? "non" : "non renseigné"],
    ["Convocation envoyée", dit(s.convocationEnvoyee) ? "oui" : nie(s.convocationEnvoyee) ? "non" : "non renseigné"],
  ]);
  if (dit(s.misePiedConservatoire) && (nie(s.entretienTenu) || nie(s.convocationEnvoyee)))
    p("Aucune sanction définitive relative à ces faits ne peut être prise tant que la procédure de L. 1332-2 n'a pas été respectée (L. 1332-3) : le délai de deux mois de L. 1332-4 continue de courir depuis la connaissance des faits — voir la note DIS-CTL-SAN-05.");
  note("La mise à pied conservatoire n'est pas une sanction : elle attend la décision, elle ne la remplace pas.");
  return A.D;
}

function modeleSan12(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de garantie de fond — procédure conventionnelle — " + nomE(f));
  const g = f.garantie || {};
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Procédure prévue par la convention collective ou le règlement intérieur", dit(g.procedureApplicable) ? "oui" : nie(g.procedureApplicable) ? "non" : "non renseigné"],
    ["Source", q(g.source) || "non renseignée"],
    ["Nature de la procédure", q(g.nature) || "non renseignée"],
    ["Suivie avant la sanction", q(g.suivie) || "non renseignée"],
  ]);
  if (dit(g.procedureApplicable) && g.suivie === "tardivement ou imparfaitement") {
    tab(["Critère du juge (Soc., 8 sept. 2021, n° 19-15.039)", "Déclaré"], [
      ["Droits de la défense privés", dit(g.droitsDefensePrives) ? "oui" : nie(g.droitsDefensePrives) ? "non" : "non renseigné"],
      ["Influence sur la décision finale", dit(g.influenceDecision) ? "oui" : nie(g.influenceDecision) ? "non" : "non renseigné"],
    ]);
  }
  p("Le dossier ne porte pas de champ dédié à la date de saisine de l'organisme conventionnel : rapprochez, sur les pièces, cette date de la date de notification de la sanction (" +
    (q(s.dateNotification) || "non renseignée") + ") — c'est ce rapprochement qui établit le caractère tardif visé par Soc., 20 mars 2024, n° 22-17.292.");
  note("C'est le manquement le plus coûteux du module : une garantie de fond méconnue ne se répare pas après coup, seule une procédure reprise dès l'origine — sous réserve du délai de deux mois de L. 1332-4 — l'écarte.");
  return A.D;
}

const MODELES = {
  "DIS-CTL-RI-01": modeleRi01,
  "DIS-CTL-RI-02": modeleRi02,
  "DIS-CTL-RI-03": modeleRi03,
  "DIS-CTL-RI-04": modeleRi04,
  "DIS-CTL-RI-05": modeleRi05,
  "DIS-CTL-RI-06": modeleRi06,
  "DIS-CTL-RI-07": modeleRi07,
  "DIS-CTL-RI-08": modeleRi08,
  "DIS-CTL-RI-09": modeleRi09,
  "DIS-CTL-RI-10": modeleRi10,
  "DIS-CTL-RI-11": modeleRi11,
  "DIS-CTL-RI-12": modeleRi12,
  "DIS-CTL-SAN-01": modeleSan01,
  "DIS-CTL-SAN-02": modeleSan02,
  "DIS-CTL-SAN-03": modeleSan03,
  "DIS-CTL-SAN-04": modeleSan04,
  "DIS-CTL-SAN-05": modeleSan05,
  "DIS-CTL-SAN-06": modeleSan06,
  "DIS-CTL-SAN-07": modeleSan07,
  "DIS-CTL-SAN-08": modeleSan08,
  "DIS-CTL-SAN-09": modeleSan09,
  "DIS-CTL-SAN-10": modeleSan10,
  "DIS-CTL-SAN-11": modeleSan11,
  "DIS-CTL-SAN-12": modeleSan12,
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

__def("./controle-ri.js", function(module, exports, require){
/* Le contrôle d'un règlement intérieur déjà en vigueur — la branche « oui ».

   L'architecture de l'application tient en une phrase : une question fermée,
   et un « non » qui construit. « Avez-vous un règlement intérieur ? » — non,
   et le parcours le rédige. Oui, et c'est ici : le règlement existant est
   déposé, ses clauses sont confrontées au texte, et une version corrigée en
   sort. C'était le seul volet qui manquait.

   CE QUE CE MODULE NE FAIT PAS, ET QUI EST ÉCRIT PLUTÔT QUE COMBLÉ.

   Il ne lit pas un règlement intérieur : il cherche, dans un texte, les
   marques des matières que la loi impose et de celles qu'elle interdit. Une
   marque trouvée ne prouve pas que la clause est bien rédigée, et le module ne
   le dit jamais. Il n'existe donc ici aucun état « conforme » — la seule
   chose qu'un repérage lexical établisse, c'est qu'un sujet est traité ou
   qu'il ne l'est pas :

     · ABSENT          — aucune marque du sujet dans le document. C'est le seul
                         constat négatif que le repérage autorise, et il suffit :
                         une matière imposée par L. 1321-1 ou L. 1321-2 qui
                         n'apparaît nulle part n'est pas traitée.
     · À VÉRIFIER      — le sujet est traité ; le passage est rendu à l'écran
                         pour être lu. Ce n'est pas un satisfecit.
     · À CONTRÔLER     — une clause de la famille que L. 1321-3 ou L. 1331-2
                         prohibent apparaît. Le passage est rendu avec le
                         critère que le juge applique. Le module ne tranche pas
                         la proportionnalité : il la pose.

   Aucune phrase de droit n'est écrite ici : chaque point cite un article lu à
   la source, et le chargement échoue si l'article manque au dépôt. */
const { ARRETS } = require("./controles-discipline.js");

/* Les textes lus à la source. La forme de l'appel est celle que l'empaqueteur
   sait transformer en module pour le navigateur — voir commun/empaqueter.js. */

const T = require("./textes-discipline.json");

const ABSENT = "absent";
const AVERIFIER = "à vérifier";
const ACONTROLER = "à contrôler";

/* --------------------------------------------------------------------- */
/* Normalisation : minuscules, accents repliés, apostrophes unifiées.
   Le repérage travaille sur cette forme, l'affichage sur l'originale.    */
function replier(s) {
  return String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘‛]/g, "'").replace(/[“”«»]/g, '"')
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/* Le découpage en phrases. Un règlement intérieur est fait d'articles courts ;
   on coupe sur la ponctuation forte et sur les sauts de ligne, en gardant la
   position d'origine pour pouvoir rendre le passage tel qu'il est écrit. */
function phrases(texte) {
  const P = [];
  const brut = String(texte || "");
  const re = /[^.!?\n]+[.!?]*/g;
  let m;
  while ((m = re.exec(brut)) !== null) {
    const t = m[0].trim();
    if (t.length < 3) continue;
    P.push({ texte: t, debut: m.index, replie: replier(t) });
  }
  return P;
}

/* --------------------------------------------------------------------- */
/* La grille.

   `marqueurs` : les expressions dont la présence signale que le sujet est
   abordé. Elles sont écrites sous forme repliée — sans accent, en minuscules.
   Une entrée exige DEUX marques quand un seul mot serait trop courant : c'est
   `avec`, qui demande qu'une autre expression figure dans la même phrase.   */
const GRILLE = [
  /* ---------------------------- le contenu imposé ---------------------- */
  {
    id: "RI-CTR-01", famille: "contenu obligatoire", fondement: ["L1321-1"],
    objet: "Les mesures d'application de la réglementation en matière de santé et de sécurité",
    exige: "Le règlement intérieur fixe les mesures d'application de la réglementation en matière de santé et de sécurité dans l'entreprise ou l'établissement, notamment les instructions prévues à l'article L. 4122-1 (L. 1321-1, 1°).",
    marqueurs: ["sante et securite", "hygiene et securite", "consignes de securite",
      "equipement de protection", "protection individuelle", "securite au travail",
      "l. 4122-1", "l.4122-1", "accident du travail", "prevention des risques"],
    clause: [
      "SANTÉ ET SÉCURITÉ",
      "Chaque salarié prend soin, en fonction de sa formation et selon ses possibilités, de sa santé et de sa sécurité ainsi que de celles des autres personnes concernées par ses actes ou ses omissions au travail.",
      "Il applique les instructions données par l'employeur en matière de santé et de sécurité, notamment celles qui figurent aux consignes affichées sur les lieux de travail, et utilise les équipements de protection individuelle mis à sa disposition, dans les conditions et pour les usages prévus.",
      "Tout accident, même bénin, et toute situation présentant un danger grave et imminent sont signalés sans délai à l'employeur ou à son représentant.",
    ],
  },
  {
    id: "RI-CTR-02", famille: "contenu obligatoire", fondement: ["L1321-1"],
    objet: "La participation des salariés au rétablissement de conditions de travail protectrices",
    exige: "Le règlement intérieur fixe les conditions dans lesquelles les salariés peuvent être appelés, à la demande de l'employeur, à participer au rétablissement de conditions de travail protectrices de la santé et de la sécurité, dès lors qu'elles apparaîtraient compromises (L. 1321-1, 2°).",
    marqueurs: ["retablissement de conditions de travail", "retablissement des conditions de travail",
      "conditions de travail protectrices", "compromises"],
    clause: [
      "PARTICIPATION AU RÉTABLISSEMENT DE CONDITIONS DE TRAVAIL PROTECTRICES",
      "Lorsque les conditions de travail protectrices de la santé et de la sécurité des salariés apparaissent compromises, les salariés peuvent être appelés, à la demande de l'employeur, à participer à leur rétablissement.",
      "Cette participation s'exerce dans la limite des compétences de chacun et de la formation reçue ; elle ne peut exposer le salarié à un danger grave et imminent, ni faire obstacle à l'exercice du droit de retrait.",
    ],
  },
  {
    id: "RI-CTR-03", famille: "contenu obligatoire", fondement: ["L1321-1", "L1331-1"],
    objet: "La nature et l'échelle des sanctions",
    exige: "Le règlement intérieur fixe les règles générales et permanentes relatives à la discipline, notamment la nature et l'échelle des sanctions que peut prendre l'employeur (L. 1321-1, 3°).",
    jurisprudence: [ARRETS.sanctionPrevueRI, ARRETS.sanctionPrevueRI2],
    marqueurs: ["echelle des sanctions", "avertissement", "blame", "mise a pied",
      "retrogradation", "mutation disciplinaire", "sanction disciplinaire"],
    clause: [
      "NATURE ET ÉCHELLE DES SANCTIONS",
      "Constitue une sanction toute mesure, autre que les observations verbales, prise par l'employeur à la suite d'un agissement du salarié considéré par lui comme fautif, que cette mesure soit de nature à affecter immédiatement ou non la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération.",
      "Selon la gravité des faits reprochés, l'employeur peut prononcer l'une des sanctions suivantes, sans que cet ordre lui impose de les épuiser successivement :",
      "1° l'avertissement ;",
      "2° le blâme ;",
      "3° la mise à pied disciplinaire, sans rémunération, d'une durée maximale de [nombre] jours ouvrés ;",
      "4° la mutation disciplinaire ;",
      "5° la rétrogradation ;",
      "6° le licenciement pour cause réelle et sérieuse ou pour faute grave ou lourde.",
      "La mutation et la rétrogradation emportent modification du contrat de travail : elles ne peuvent être imposées au salarié, qui peut les refuser sans que ce refus constitue par lui-même une faute.",
    ],
  },
  {
    id: "RI-CTR-04", famille: "contenu obligatoire", fondement: ["L1321-1"],
    objet: "La durée maximale de la mise à pied disciplinaire",
    exige: "Une mise à pied disciplinaire prévue par le règlement intérieur n'est licite que si ce règlement précise sa durée maximale.",
    jurisprudence: [ARRETS.sanctionPrevueRI],
    /* Le sujet n'existe que si la mise à pied est prévue : la question posée
       est celle de la DURÉE, et elle se cherche dans la phrase qui la porte. */
    depend: "mise a pied",
    marqueurs: ["duree maximale", "au maximum", "ne peut exceder", "ne pourra exceder", "jours ouvres", "jours ouvrables"],
    clause: [
      "DURÉE MAXIMALE DE LA MISE À PIED DISCIPLINAIRE",
      "La mise à pied disciplinaire ne peut excéder [nombre] jours ouvrés.",
    ],
  },
  {
    id: "RI-CTR-05", famille: "contenu obligatoire", fondement: ["L1321-2", "L1332-1", "L1332-2", "L1332-3"],
    objet: "Le rappel des droits de la défense",
    exige: "Le règlement intérieur rappelle les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3 ou par la convention collective applicable (L. 1321-2, 1°).",
    marqueurs: ["droits de la defense", "entretien prealable", "se faire assister",
      "convocation ecrite", "l. 1332-1", "l. 1332-2", "l.1332-2"],
    clause: [
      "DROITS DE LA DÉFENSE",
      "Aucune sanction ne peut être prise sans que le salarié soit informé, dans le même temps et par écrit, des griefs retenus contre lui.",
      "Lorsque l'employeur envisage une sanction, il convoque le salarié en lui précisant l'objet de la convocation, sauf si la sanction envisagée est un avertissement ou une sanction de même nature n'ayant pas d'incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération.",
      "Lors de son audition, le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise. Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié.",
      "La sanction ne peut intervenir moins de deux jours ouvrables ni plus d'un mois après le jour fixé pour l'entretien ; elle est motivée et notifiée à l'intéressé.",
      "Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales.",
      "Les stipulations plus favorables de la convention collective applicable s'appliquent, notamment lorsqu'elles instituent une procédure disciplinaire particulière.",
    ],
  },
  {
    id: "RI-CTR-06", famille: "contenu obligatoire", fondement: ["L1321-2"],
    objet: "Le rappel des dispositions sur les harcèlements et les agissements sexistes",
    exige: "Le règlement intérieur rappelle les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes prévues par le code du travail (L. 1321-2, 2°).",
    marqueurs: ["harcelement moral", "harcelement sexuel", "agissement sexiste", "agissements sexistes"],
    clause: [
      "HARCÈLEMENTS ET AGISSEMENTS SEXISTES",
      "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale ou de compromettre son avenir professionnel.",
      "Aucun salarié ne doit subir des faits de harcèlement sexuel, constitué par des propos ou comportements à connotation sexuelle ou sexiste répétés qui portent atteinte à sa dignité en raison de leur caractère dégradant ou humiliant, ou créent à son encontre une situation intimidante, hostile ou offensante, ni aucune forme de pression grave dans le but réel ou apparent d'obtenir un acte de nature sexuelle.",
      "Nul ne doit subir d'agissement sexiste, défini comme tout agissement lié au sexe d'une personne, ayant pour objet ou pour effet de porter atteinte à sa dignité ou de créer un environnement intimidant, hostile, dégradant, humiliant ou offensant.",
      "Aucun salarié, aucune personne en formation ou en stage ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi, refusé de subir, témoigné de tels faits ou les avoir relatés.",
      "Ces agissements exposent leur auteur à une sanction disciplinaire.",
    ],
  },
  {
    id: "RI-CTR-07", famille: "contenu obligatoire", fondement: ["L1321-2"],
    objet: "Le rappel du dispositif de protection des lanceurs d'alerte",
    exige: "Le règlement intérieur rappelle l'existence du dispositif de protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016 (L. 1321-2, 3°). Ce rappel a été ajouté à L. 1321-2 : un règlement antérieur ne le porte pas.",
    marqueurs: ["lanceur d'alerte", "lanceurs d'alerte", "loi n° 2016-1691", "loi 2016-1691"],
    clause: [
      "PROTECTION DES LANCEURS D'ALERTE",
      "Il existe un dispositif de protection des lanceurs d'alerte, prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique.",
      "Le salarié qui signale ou divulgue, dans les conditions prévues par ce dispositif, des informations portant sur un crime, un délit, une menace ou un préjudice pour l'intérêt général, une violation ou une tentative de dissimulation d'une violation du droit, ne peut être sanctionné, licencié ni faire l'objet d'une mesure discriminatoire à ce titre.",
      "La procédure de recueil et de traitement des signalements applicable dans l'entreprise est portée à la connaissance des salariés par [préciser le moyen].",
    ],
  },
  {
    id: "RI-CTR-08", famille: "contenu obligatoire", fondement: ["L1321-4", "R1321-3"],
    objet: "La date d'entrée en vigueur",
    exige: "Le règlement intérieur indique la date de son entrée en vigueur. Cette date doit être postérieure d'un mois à l'accomplissement des formalités de publicité ; le délai court à compter de la dernière en date des formalités de publicité et de dépôt (L. 1321-4, R. 1321-3).",
    marqueurs: ["entree en vigueur", "entrera en vigueur", "prend effet le", "applicable a compter du"],
    clause: [
      "ENTRÉE EN VIGUEUR",
      "Le présent règlement intérieur entre en vigueur le [date], soit un mois après la dernière en date des formalités de dépôt au greffe du conseil de prud'hommes et de publicité.",
    ],
  },
  /* ------------------------------ les formalités ----------------------- */
  {
    id: "RI-CTR-09", famille: "formalités", fondement: ["L1321-4"],
    objet: "La mention de l'avis du comité social et économique",
    exige: "Le règlement intérieur ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique (L. 1321-4). La mention de cet avis dans le document n'est pas exigée par le texte, mais son absence prive le règlement de la trace de la formalité.",
    marqueurs: ["comite social et economique", "avis du comite", "cse"],
    clause: [
      "AVIS DU COMITÉ SOCIAL ET ÉCONOMIQUE",
      "Le présent règlement intérieur a été soumis à l'avis du comité social et économique lors de sa réunion du [date].",
    ],
  },
  {
    id: "RI-CTR-10", famille: "formalités", fondement: ["R1321-1", "R1321-2", "R1321-4"],
    objet: "La mention du dépôt au greffe, de la communication à l'inspection du travail et de la publicité",
    exige: "Le règlement intérieur est déposé au greffe du conseil de prud'hommes du ressort (R. 1321-2), transmis à l'inspecteur du travail en deux exemplaires (R. 1321-4) et porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1).",
    marqueurs: ["conseil de prud'hommes", "greffe", "inspecteur du travail", "inspection du travail", "affichage"],
    clause: [
      "DÉPÔT, COMMUNICATION ET PUBLICITÉ",
      "Le présent règlement a été déposé au greffe du conseil de prud'hommes de [ville] le [date], transmis en deux exemplaires à l'inspecteur du travail le [date], et affiché le [date] sur les lieux de travail ainsi que dans les locaux où se fait l'embauche.",
    ],
  },
  /* --------------------------- le contenu prohibé ---------------------- */
  {
    id: "RI-CTR-11", famille: "contenu prohibé", fondement: ["L1331-2"],
    objet: "Les amendes et autres sanctions pécuniaires",
    exige: "Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite (L. 1331-2).",
    prohibe: true,
    marqueurs: ["amende", "sanction pecuniaire", "sanctions pecuniaires", "penalite",
      "retenue sur salaire", "retenue de salaire", "prelevement sur la remuneration"],
    critere: "Une retenue sur salaire n'est licite que si elle correspond à une absence de travail effectif ou à une créance de l'employeur régulièrement établie. Toute somme prélevée à raison d'un comportement fautif est une sanction pécuniaire, quelle que soit la formule employée.",
    remplacement: "Supprimer la clause. Le comportement visé peut être sanctionné par une sanction de l'échelle (avertissement, blâme, mise à pied), jamais par une somme d'argent.",
  },
  {
    id: "RI-CTR-12", famille: "contenu prohibé", fondement: ["L1321-3", "L1321-2-1"],
    objet: "Les restrictions aux droits des personnes et aux libertés",
    exige: "Le règlement intérieur ne peut contenir de dispositions apportant aux droits des personnes et aux libertés individuelles et collectives des restrictions qui ne seraient pas justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché (L. 1321-3, 2°). Le principe de neutralité et la restriction de la manifestation des convictions ne sont admis que s'ils sont justifiés par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, et proportionnés au but recherché (L. 1321-2-1).",
    prohibe: true,
    marqueurs: ["fouille", "controle des sacs", "vestiaire", "ethylotest", "alcootest",
      "test salivaire", "depistage", "videosurveillance", "geolocalisation",
      "telephone portable", "reseaux sociaux", "messagerie", "signe religieux",
      "neutralite", "tenue vestimentaire", "port de la barbe", "voile"],
    critere: "Deux conditions cumulatives, que le juge vérifie l'une après l'autre : la restriction est-elle justifiée par la nature de la tâche à accomplir, et est-elle proportionnée au but recherché ? Une interdiction générale et absolue ne franchit ni l'une ni l'autre. Le règlement doit énoncer les postes et les circonstances visés, les modalités du contrôle et les garanties du salarié.",
    remplacement: "Réécrire la clause en désignant les postes concernés, la circonstance qui la justifie et les garanties offertes — présence d'un tiers, possibilité de s'y opposer, contre-expertise, information préalable.",
  },
  {
    id: "RI-CTR-13", famille: "contenu prohibé", fondement: ["L1321-3"],
    objet: "Les dispositions discriminatoires",
    exige: "Le règlement intérieur ne peut contenir de dispositions discriminant les salariés dans leur emploi ou leur travail, à capacité professionnelle égale, en raison notamment de leur origine, de leur sexe, de leurs mœurs, de leur orientation sexuelle ou identité de genre, de leur âge, de leur situation de famille ou de leur grossesse, de leur appartenance vraie ou supposée à une ethnie, une nation ou une race, de leurs opinions politiques, de leurs activités syndicales ou mutualistes, de leurs convictions religieuses, de leur apparence physique, de leur nom de famille ou de leur état de santé ou handicap (L. 1321-3, 3°).",
    prohibe: true,
    marqueurs: ["grossesse", "maternite", "nationalite", "origine", "religion",
      "appartenance syndicale", "activite syndicale", "etat de sante", "handicap",
      "apparence physique", "orientation sexuelle"],
    critere: "La clause distingue-t-elle entre les salariés à capacité professionnelle égale, sur l'un des motifs énumérés ? Une clause qui mentionne l'un de ces motifs pour l'interdire comme motif de distinction est licite ; celle qui en tire une conséquence sur l'emploi ou le travail ne l'est pas.",
    remplacement: "Supprimer la distinction. Si le motif est mentionné pour rappeler l'interdiction de discriminer, laisser la clause telle quelle.",
  },
  {
    id: "RI-CTR-14", famille: "contenu prohibé", fondement: ["L1321-3"],
    objet: "Les dispositions contraires aux lois, règlements et conventions collectives",
    exige: "Le règlement intérieur ne peut contenir de dispositions contraires aux lois et règlements ainsi qu'aux stipulations des conventions et accords collectifs de travail applicables (L. 1321-3, 1°).",
    prohibe: true,
    marqueurs: ["demission d'office", "considere comme demissionnaire", "rupture automatique",
      "rupture de plein droit", "abandon de poste vaut", "renonce a", "renonciation",
      "interdiction de se syndiquer", "droit de greve", "aucun recours"],
    critere: "Une clause qui fait produire à un comportement du salarié un effet que la loi ne lui donne pas — une démission, une rupture de plein droit, une renonciation à un droit — est contraire à la loi. L'inspecteur du travail peut à tout moment en exiger le retrait ou la modification (L. 1322-1).",
    remplacement: "Supprimer la clause. Le comportement visé relève de la procédure disciplinaire, avec ses garanties, ou du licenciement, avec les siennes.",
  },
  {
    id: "RI-CTR-15", famille: "contenu prohibé", fondement: ["L1321-1"],
    objet: "Les matières étrangères au règlement intérieur",
    exige: "Le règlement intérieur fixe EXCLUSIVEMENT les trois matières de l'article L. 1321-1 : santé et sécurité, participation au rétablissement de conditions protectrices, règles générales et permanentes de discipline. Ce qui n'y entre pas n'a pas sa place dans le règlement, et n'y produit pas d'effet obligatoire.",
    prohibe: true,
    marqueurs: ["clause de non-concurrence", "clause de mobilite", "periode d'essai",
      "remuneration variable", "prime d'anciennete", "conges payes", "duree du travail",
      "forfait jours", "preavis de demission", "frais professionnels"],
    critere: "La disposition entre-t-elle dans l'une des trois matières de L. 1321-1 ? Sinon, elle relève du contrat de travail, d'un accord collectif ou d'une note d'information — et non du règlement intérieur, qui ne peut la rendre obligatoire.",
    remplacement: "Sortir la clause du règlement et la porter dans l'instrument qui lui convient : le contrat de travail, l'accord collectif, ou une note d'information sans portée disciplinaire.",
  },
];

/* Le chargement échoue si un article cité manque au dépôt : la grille ne doit
   jamais renvoyer à un texte qui n'a pas été lu à la source. */
for (const g of GRILLE)
  for (const a of g.fondement)
    if (!T[a]) throw new Error(`controle-ri : l'article ${a} cité par ${g.id} n'est pas au dépôt des textes lus à la source.`);

/* --------------------------------------------------------------------- */
/* Le repérage.

   Une marque cherchée en sous-chaîne se trompe : « amende » se lit dans
   « amendement », « cse » dans un mot qui le contient. La recherche est donc
   bornée aux limites de mot — le caractère qui précède et celui qui suit ne
   doivent pas être alphanumériques. C'est la seule protection que le procédé
   admette, et elle ne le rend pas exact pour autant : voir l'en-tête. */
function estLettre(c) { return c >= "a" && c <= "z" || c >= "0" && c <= "9"; }

function contient(replie, marqueur) {
  let i = replie.indexOf(marqueur);
  while (i !== -1) {
    const avant = i === 0 ? "" : replie[i - 1];
    const apres = replie[i + marqueur.length] || "";
    if (!estLettre(avant) && !estLettre(apres)) return true;
    i = replie.indexOf(marqueur, i + 1);
  }
  return false;
}

/* Rendre les phrases où une marque apparaît, jamais le document entier : ce
   qui est montré doit pouvoir être lu.                                     */
function reperer(P, marqueurs) {
  const trouves = [];
  for (const p of P) {
    const vus = marqueurs.filter(m => contient(p.replie, m));
    if (vus.length) trouves.push({ texte: p.texte, debut: p.debut, marques: vus });
  }
  return trouves;
}

function analyser(texte) {
  const brut = String(texte || "");
  const P = phrases(brut);
  const points = [];

  for (const g of GRILLE) {
    /* Un point conditionnel — la durée maximale de la mise à pied — ne se pose
       que si la sanction dont il fixe la borne est prévue. */
    if (g.depend) {
      const porteuses = P.filter(p => contient(p.replie, g.depend));
      if (!porteuses.length) {
        points.push({ ...vue(g), etat: ABSENT, passages: [],
          motif: "La mise à pied disciplinaire n'apparaît pas dans le document : la durée maximale n'a pas d'objet tant qu'elle n'est pas prévue. Si vous l'ajoutez à l'échelle des sanctions, sa durée maximale devient obligatoire.",
          sansObjet: true });
        continue;
      }
      const avec = porteuses.filter(p => g.marqueurs.some(m => contient(p.replie, m)));
      points.push({ ...vue(g),
        etat: avec.length ? AVERIFIER : ABSENT,
        passages: (avec.length ? avec : porteuses).map(p => ({ texte: p.texte, debut: p.debut })),
        motif: avec.length
          ? "La phrase qui prévoit la mise à pied porte une durée : lisez-la, et vérifiez qu'elle borne bien la sanction et non l'une de ses modalités."
          : "La mise à pied disciplinaire est prévue, sans qu'une durée maximale apparaisse dans la phrase qui la prévoit. Une mise à pied disciplinaire prévue par le règlement intérieur n'est licite que si ce règlement précise sa durée maximale.",
      });
      continue;
    }

    const trouves = reperer(P, g.marqueurs);

    if (g.prohibe) {
      points.push({ ...vue(g),
        etat: trouves.length ? ACONTROLER : ABSENT,
        passages: trouves.map(p => ({ texte: p.texte, debut: p.debut, marques: p.marques })),
        motif: trouves.length
          ? `${trouves.length} passage${trouves.length > 1 ? "s font" : " fait"} apparaître une clause de cette famille. Le module ne conclut pas à son illicéité : il rend le passage et le critère que le juge applique.`
          : "Aucun passage de cette famille n'a été repéré. Cela ne vaut pas quitus : une clause peut être rédigée en termes que ce repérage ne connaît pas.",
      });
      continue;
    }

    points.push({ ...vue(g),
      etat: trouves.length ? AVERIFIER : ABSENT,
      passages: trouves.map(p => ({ texte: p.texte, debut: p.debut, marques: p.marques })),
      motif: trouves.length
        ? "Le sujet est traité dans le document. Lisez le passage : le repérage établit qu'il en est question, jamais que la clause est complète ni bien rédigée."
        : "Aucune trace de cette matière dans le document. Le règlement ne la traite pas.",
    });
  }

  const compte = e => points.filter(p => p.etat === e && !p.sansObjet).length;
  return {
    texte: brut,
    caracteres: brut.length,
    phrases: P.length,
    points,
    compteurs: {
      absents: points.filter(p => p.etat === ABSENT && !p.prohibe && !p.sansObjet).length,
      aVerifier: compte(AVERIFIER),
      aControler: compte(ACONTROLER),
      sansObjet: points.filter(p => p.sansObjet).length,
    },
  };
}

function vue(g) {
  return {
    id: g.id, famille: g.famille, objet: g.objet, fondement: g.fondement,
    exige: g.exige, prohibe: !!g.prohibe,
    clause: g.clause || null, critere: g.critere || null,
    remplacement: g.remplacement || null,
    jurisprudence: g.jurisprudence || [],
  };
}

/* --------------------------------------------------------------------- */
/* La version corrigée.

   Elle ne réécrit pas le document à la place de son auteur : elle l'assemble.
   Le texte d'origine est conservé mot pour mot ; chaque passage à contrôler y
   est signalé à sa place, en clair, avec le critère ; et les clauses des
   matières absentes sont ajoutées à la suite, prêtes à être déplacées à leur
   rang. `choix` porte ce que l'utilisateur a retenu : les identifiants des
   clauses à insérer et ceux des passages à signaler.                       */
function corriger(analyse, choix) {
  const c = choix || {};
  const inserer = c.inserer || analyse.points.filter(p => p.etat === ABSENT && p.clause && !p.sansObjet).map(p => p.id);
  const signaler = c.signaler || analyse.points.filter(p => p.etat === ACONTROLER).map(p => p.id);

  /* Les marques, posées de la fin vers le début pour ne pas décaler les
     positions restantes. */
  const marques = [];
  for (const p of analyse.points) {
    if (!p.prohibe || signaler.indexOf(p.id) === -1) continue;
    for (const q of p.passages) marques.push({ debut: q.debut, fin: q.debut + q.texte.length, id: p.id, objet: p.objet });
  }
  marques.sort((a, b) => b.debut - a.debut);

  let corps = analyse.texte;
  for (const m of marques) {
    corps = corps.slice(0, m.fin) +
      `  [À CONTRÔLER — ${m.id} : ${m.objet}]` +
      corps.slice(m.fin);
  }

  const ajouts = [];
  for (const p of analyse.points) {
    if (inserer.indexOf(p.id) === -1 || !p.clause) continue;
    ajouts.push({ id: p.id, objet: p.objet, fondement: p.fondement, lignes: p.clause });
  }

  const notes = [];
  for (const p of analyse.points) {
    if (!p.prohibe || signaler.indexOf(p.id) === -1) continue;
    notes.push({ id: p.id, objet: p.objet, fondement: p.fondement, critere: p.critere,
      remplacement: p.remplacement, passages: p.passages.map(q => q.texte) });
  }

  return { corps, ajouts, notes,
    resume: `${ajouts.length} clause${ajouts.length > 1 ? "s ajoutées" : " ajoutée"}, ${notes.length} famille${notes.length > 1 ? "s signalées" : " signalée"} à contrôler.` };
}

/* Le texte plat de la version corrigée — celui que la page propose au
   téléchargement lorsque l'utilisateur ne veut pas le composer lui-même. */
function texteCorrige(analyse, choix) {
  const r = corriger(analyse, choix);
  const L = [r.corps.trim(), ""];
  if (r.ajouts.length) {
    L.push("", "— — —", "CLAUSES AJOUTÉES AU TITRE DU CONTRÔLE", "");
    for (const a of r.ajouts) {
      L.push(`[${a.id} — ${a.fondement.map(article).join(", ")}]`);
      for (const l of a.lignes) L.push(l);
      L.push("");
    }
  }
  if (r.notes.length) {
    L.push("", "— — —", "PASSAGES À CONTRÔLER AVANT DIFFUSION", "");
    for (const n of r.notes) {
      L.push(`[${n.id} — ${n.objet} — ${n.fondement.map(article).join(", ")}]`);
      L.push("Critère : " + n.critere);
      L.push("Ce qu'il faut faire : " + n.remplacement);
      for (const p of n.passages) L.push("  « " + p + " »");
      L.push("");
    }
  }
  return L.join("\n");
}

/* « L1321-1 » s'écrit « L. 1321-1 » dans un document. */
function article(a) {
  const m = /^([LRD])(.+)$/.exec(a);
  return m ? `${m[1]}. ${m[2]}` : a;
}

module.exports = { analyser, corriger, texteCorrige, GRILLE, phrases, replier, contient,
                   ETATS: { ABSENT, AVERIFIER, ACONTROLER }, article };

});

__def("./textes-discipline.json", function(module){ module.exports = {
 "R1321-1": {
  "id": "LEGIARTI000033292501",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le règlement intérieur est porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche."
 },
 "R1321-2": {
  "id": "LEGIARTI000018536915",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le règlement intérieur est déposé, en application du deuxième alinéa de l'article L. 1321-4 , au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement."
 },
 "R1321-4": {
  "id": "LEGIARTI000018536911",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le texte du règlement intérieur est transmis à l'inspecteur du travail en deux exemplaires."
 },
 "L1322-2": {
  "id": "LEGIARTI000035653123",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "La décision de l'inspecteur du travail est motivée. Elle est notifiée à l'employeur et communiquée, pour information, aux membres du comité social et économique."
 },
 "L1322-3": {
  "id": "LEGIARTI000035653120",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "La décision de l'inspecteur du travail peut faire l'objet d'un recours hiérarchique, dans des conditions déterminées par voie réglementaire. La décision prise sur ce recours est notifiée à l'employeur et communiquée, pour information, aux membres du comité social et économique."
 },
 "L1331-1": {
  "id": "LEGIARTI000006901445",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Constitue une sanction toute mesure, autre que les observations verbales, prise par l'employeur à la suite d'un agissement du salarié considéré par l'employeur comme fautif, que cette mesure soit de nature à affecter immédiatement ou non la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération."
 },
 "L1331-2": {
  "id": "LEGIARTI000006901446",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite."
 },
 "L1332-1": {
  "id": "LEGIARTI000006901447",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Aucune sanction ne peut être prise à l'encontre du salarié sans que celui-ci soit informé, dans le même temps et par écrit, des griefs retenus contre lui."
 },
 "L1332-2": {
  "id": "LEGIARTI000025560074",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Lorsque l'employeur envisage de prendre une sanction, il convoque le salarié en lui précisant l'objet de la convocation, sauf si la sanction envisagée est un avertissement ou une sanction de même nature n'ayant pas d'incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération du salarié. Lors de son audition, le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise. Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié. La sanction ne peut intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour fixé pour l'entretien. Elle est motivée et notifiée à l'intéressé."
 },
 "L1332-3": {
  "id": "LEGIARTI000006901449",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Lorsque les faits reprochés au salarié ont rendu indispensable une mesure conservatoire de mise à pied à effet immédiat, aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure prévue à l'article L. 1332-2 ait été respectée."
 },
 "L1332-4": {
  "id": "LEGIARTI000006901450",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales."
 },
 "L1332-5": {
  "id": "LEGIARTI000006901451",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction."
 },
 "R1332-1": {
  "id": "LEGIARTI000018536889",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "La lettre de convocation prévue à l'article L. 1332-2 indique l'objet de l'entretien entre le salarié et l'employeur. Elle précise la date, l'heure et le lieu de cet entretien. Elle rappelle que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise. Elle est soit remise contre récépissé, soit adressée par lettre recommandée, dans le délai de deux mois fixé à l'article L. 1332-4 ."
 },
 "R1332-2": {
  "id": "LEGIARTI000018536887",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "La sanction prévue à l'article L. 1332-2 fait l'objet d'une décision écrite et motivée. La décision est notifiée au salarié soit par lettre remise contre récépissé, soit par lettre recommandée, dans le délai d'un mois prévu par l'article L. 1332-2."
 },
 "L1333-1": {
  "id": "LEGIARTI000006901453",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "En cas de litige, le conseil de prud'hommes apprécie la régularité de la procédure suivie et si les faits reprochés au salarié sont de nature à justifier une sanction. L'employeur fournit au conseil de prud'hommes les éléments retenus pour prendre la sanction. Au vu de ces éléments et de ceux qui sont fournis par le salarié à l'appui de ses allégations, le conseil de prud'hommes forme sa conviction après avoir ordonné, en cas de besoin, toutes les mesures d'instruction qu'il estime utiles. Si un doute subsiste, il profite au salarié."
 },
 "L1333-2": {
  "id": "LEGIARTI000006901454",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le conseil de prud'hommes peut annuler une sanction irrégulière en la forme ou injustifiée ou disproportionnée à la faute commise."
 },
 "L1333-3": {
  "id": "LEGIARTI000006901455",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Lorsque la sanction contestée est un licenciement les dispositions du présent chapitre ne sont pas applicables. Dans ce cas, le conseil de prud'hommes applique les dispositions relatives à la contestation des irrégularités de licenciement prévues par le chapitre V du titre III du livre II."
 },
 "L1311-2": {
  "id": "LEGIARTI000038610176",
  "date": "2026-08-19",
  "texte": "L'établissement d'un règlement intérieur est obligatoire dans les entreprises ou établissements employant au moins cinquante salariés. L'obligation prévue au premier alinéa s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil de cinquante salariés a été atteint, conformément à l'article L. 2312-2 . Des dispositions spéciales peuvent être établies pour une catégorie de personnel ou une division de l'entreprise ou de l'établissement.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-1": {
  "id": "LEGIARTI000006901432",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur est un document écrit par lequel l'employeur fixe exclusivement : 1° Les mesures d'application de la réglementation en matière de santé et de sécurité dans l'entreprise ou l'établissement, notamment les instructions prévues à l'article L. 4122-1 ; 2° Les conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices de la santé et de la sécurité des salariés, dès lors qu'elles apparaîtraient compromises ; 3° Les règles générales et permanentes relatives à la discipline, notamment la nature et l'échelle des sanctions que peut prendre l'employeur.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-2": {
  "id": "LEGIARTI000045391757",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur rappelle : 1° Les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3 ou par la convention collective applicable ; 2° Les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes prévues par le présent code ; 3° L'existence du dispositif de protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-2-1": {
  "id": "LEGIARTI000033001625",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur peut contenir des dispositions inscrivant le principe de neutralité et restreignant la manifestation des convictions des salariés si ces restrictions sont justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise et si elles sont proportionnées au but recherché.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-3": {
  "id": "LEGIARTI000033975667",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur ne peut contenir : 1° Des dispositions contraires aux lois et règlements ainsi qu'aux stipulations des conventions et accords collectifs de travail applicables dans l'entreprise ou l'établissement ; 2° Des dispositions apportant aux droits des personnes et aux libertés individuelles et collectives des restrictions qui ne seraient pas justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché ; 3° Des dispositions discriminant les salariés dans leur emploi ou leur travail, à capacité professionnelle égale, en raison de leur origine, de leur sexe, de leurs mœurs, de leur orientation sexuelle ou identité de genre, de leur âge, de leur situation de famille ou de leur grossesse, de leurs caractéristiques génétiques, de leur appartenance ou de leur non-appartenance, vraie ou supposée, à une ethnie, une nation ou une race, de leurs opinions politiques, de leurs activités syndicales ou mutualistes, de leurs convictions religieuses, de leur apparence physique, de leur nom de famille ou en raison de leur état de santé ou de leur handicap.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-4": {
  "id": "LEGIARTI000054140230",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique. Le règlement intérieur indique la date de son entrée en vigueur. Cette date doit être postérieure d'un mois à l'accomplissement des formalités de publicité. En même temps qu'il fait l'objet des mesures de publicité, le règlement intérieur, accompagné de l'avis du comité social et économique, est communiqué à l'inspecteur du travail. Ces dispositions s'appliquent également en cas de modification ou de retrait des clauses du règlement intérieur.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-5": {
  "id": "LEGIARTI000035653093",
  "date": "2026-08-19",
  "texte": "Les notes de service ou tout autre document comportant des obligations générales et permanentes dans les matières mentionnées aux articles L. 1321-1 et L. 1321-2 sont, lorsqu'il existe un règlement intérieur, considérées comme des adjonctions à celui-ci. Ils sont, en toute hypothèse, soumis aux dispositions du présent titre. Toutefois, lorsque l'urgence le justifie, les obligations relatives à la santé et à la sécurité peuvent recevoir application immédiate. Dans ce cas, ces prescriptions sont immédiatement et simultanément communiquées au secrétaire du comité social et économique ainsi qu'à l'inspection du travail.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "L1321-6": {
  "id": "LEGIARTI000006901439",
  "date": "2026-08-19",
  "texte": "Le règlement intérieur est rédigé en français. Il peut être accompagné de traductions en une ou plusieurs langues étrangères. Il en va de même pour tout document comportant des obligations pour le salarié ou des dispositions dont la connaissance est nécessaire pour l'exécution de son travail. Ces dispositions ne sont pas applicables aux documents reçus de l'étranger ou destinés à des étrangers.",
  "source": "moteur/social/textes-social.json — capturé à la source par le module social, relu ici par verifier-textes-discipline.js"
 },
 "R1321-3": {
  "id": "LEGIARTI000018536913",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le délai prévu au deuxième alinéa de l'article L. 1321-4 court à compter de la dernière en date des formalités de publicité et de dépôt définies aux articles R. 1321-1 et R. 1321-2 ."
 },
 "R1321-5": {
  "id": "LEGIARTI000041455669",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "L'obligation prévue au premier alinéa de l'article L. 1311-2 s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil de cinquante salariés a été atteint pendant douze mois consécutifs suivant la création de l'entreprise."
 },
 "L1322-1": {
  "id": "LEGIARTI000006901440",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "L'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 ."
 },
 "R1332-3": {
  "id": "LEGIARTI000018536885",
  "date": "2026-08-19",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le délai d'un mois prévu à l'article L. 1332-2 expire à vingt-quatre heures le jour du mois suivant qui porte le même quantième que le jour fixé pour l'entretien. A défaut d'un quantième identique, le délai expire le dernier jour du mois suivant à vingt-quatre heures. Lorsque le dernier jour de ce délai est un samedi, un dimanche ou un jour férié ou chômé, le délai est prorogé jusqu'au premier jour ouvrable suivant."
 },
 "R1323-1": {
  "id": "LEGIARTI000037899552",
  "date": "2026-08-24",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le fait de méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de l'amende prévue pour les contraventions de la quatrième classe. Est punie de la même peine la méconnaissance des dispositions du quatrième alinéa de l'article R. 1321-6 ."
 },
 "L1334-1": {
  "id": "LEGIARTI000006901456",
  "date": "2026-08-24",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le fait d'infliger une amende ou une sanction pécuniaire en méconnaissance des dispositions de l'article L. 1331-2 est puni d'une amende de 3 750 euros."
 },
 "L2317-1": {
  "id": "LEGIARTI000035634273",
  "date": "2026-08-24",
  "lectures": 2,
  "concordantes": true,
  "texte": "Le fait d'apporter une entrave soit à la constitution d'un comité social et économique, d'un comité social et économique d'établissement ou d'un comité social et économique central, soit à la libre désignation de leurs membres, notamment par la méconnaissance des dispositions des articles L. 2314-1 à L. 2314-9 est puni d'un emprisonnement d'un an et d'une amende de 7 500 €. Le fait d'apporter une entrave à leur fonctionnement régulier est puni d'une amende de 7 500 €."
 }
}; });

  global.MoteurDiscipline = {
    audit: require("./audit-discipline-client.js"),

    moteur: require("./moteur-discipline.js"),
    controles: require("./controles-discipline.js"),
    manifeste: __MANIFESTE,
    champs: [["Le règlement intérieur",[["ri.existe","L'entreprise s'est-elle dotée d'un règlement intérieur ?","oui / non"],["ri.dateFranchissementSeuil","Date à laquelle le seuil de cinquante salariés a été atteint","AAAA-MM-JJ"],["ri.contenuSanteSecurite","Fixe-t-il les mesures d'application de la réglementation santé-sécurité (L. 1321-1, 1°) ?","oui / non"],["ri.contenuParticipation","Fixe-t-il les conditions de participation des salariés au rétablissement de conditions de travail protectrices (L. 1321-1, 2°) ?","oui / non"],["ri.contenuDiscipline","Fixe-t-il les règles générales et permanentes relatives à la discipline (L. 1321-1, 3°) ?","oui / non"],["ri.echelleSanctions","Fixe-t-il la nature et l'échelle des sanctions que peut prendre l'employeur ?","oui / non"],["ri.misePiedDureeMax","Précise-t-il la durée maximale de la mise à pied disciplinaire ?","oui / non"],["ri.misePiedDureeMaxJours","Cette durée maximale, en jours","nombre"],["ri.rappelDroitsDefense","Rappelle-t-il les droits de la défense des salariés (L. 1332-1 à L. 1332-3, ou convention collective) ?","oui / non"],["ri.rappelHarcelement","Rappelle-t-il les dispositions sur les harcèlements moral et sexuel et les agissements sexistes ?","oui / non"],["ri.rappelLanceursAlerte","Rappelle-t-il l'existence du dispositif de protection des lanceurs d'alerte ?","oui / non"],["ri.clausesInterdites","Sa relecture au regard de l'article L. 1321-3 a-t-elle relevé des clauses à retirer — contraires aux lois, règlements ou textes conventionnels, restrictions non justifiées par la nature de la tâche ni proportionnées, dispositions discriminatoires ?","oui / non"],["ri.clauseNeutralite","Comporte-t-il une clause de neutralité (L. 1321-2-1) ?","oui / non"],["ri.neutraliteJustifieeProportionnee","Le texte énonce-t-il ce qui justifie cette clause — autres libertés et droits fondamentaux, ou nécessités du bon fonctionnement — et en limite-t-il la portée au but recherché ?","oui / non"],["ri.redigeFrancais","Est-il rédigé en français (L. 1321-6) ?","oui / non"]]],["Identité",[["entreprise","Dénomination sociale","texte"],["dateAudit","Date à laquelle la situation est décrite","AAAA-MM-JJ"],["effectif","Effectif de l'entreprise","nombre"],["cse.existe","Un comité social et économique existe-t-il ?","oui / non"]]],["Les formalités du règlement intérieur",[["ri.avisCSE","A-t-il été soumis à l'avis du comité social et économique avant son introduction ?","oui / non"],["ri.publicite","Est-il porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail et d'embauche ?","oui / non"],["ri.depotGreffe","A-t-il été déposé au greffe du conseil de prud'hommes du ressort ?","oui / non"],["ri.communicationInspection","A-t-il été communiqué à l'inspecteur du travail, accompagné de l'avis du comité ?","oui / non"],["ri.communicationDeuxExemplaires","Cette communication a-t-elle été faite en deux exemplaires (R. 1321-4) ?","oui / non"],["ri.dateDerniereFormalite","Date de la dernière des formalités de publicité et de dépôt","AAAA-MM-JJ"],["ri.dateEntreeVigueur","Date d'entrée en vigueur inscrite au règlement intérieur","AAAA-MM-JJ"],["ri.modifieDepuis","Des clauses ont-elles été modifiées ou retirées depuis l'introduction ?","oui / non"],["ri.modificationsFormalites","Ces modifications ont-elles suivi les mêmes formalités (avis, publicité, dépôt, inspection) ?","oui / non"],["ri.notesServiceGenerales","Existe-t-il des notes de service portant des obligations générales et permanentes (L. 1321-5) ?","oui / non"],["ri.notesServiceFormalites","Ces notes de service ont-elles été soumises aux formalités du titre ?","oui / non"],["ri.demandeInspection","L'inspecteur du travail a-t-il exigé le retrait ou la modification de dispositions (L. 1322-1) ?","oui / non"],["ri.suiteDemandeInspection","Cette demande a-t-elle été suivie d'effet ?","oui / non"]]],["La sanction auditée",[["sanction.auditee","Une sanction envisagée ou prononcée est-elle soumise à l'audit ?","oui / non"],["sanction.nature","Nature de la sanction","liste"],["sanction.incidence","A-t-elle une incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération ?","oui / non"],["sanction.prevueRI","Cette sanction figure-t-elle dans l'échelle des sanctions du règlement intérieur ?","oui / non"],["sanction.dureeMisePiedJours","Durée de la mise à pied disciplinaire prononcée, en jours","nombre"],["sanction.griefsEcrits","Le salarié a-t-il été informé par écrit des griefs retenus contre lui ?","oui / non"],["sanction.retenueSalaire","La sanction s'accompagne-t-elle d'une retenue sur la rémunération étrangère à une suspension du contrat ?","oui / non"],["sanction.salarieProtege","Le salarié est-il titulaire d'un mandat représentatif ou syndical ?","oui / non"]]],["Les dates de la procédure",[["sanction.dateConnaissance","Date à laquelle l'employeur a eu connaissance des faits","AAAA-MM-JJ"],["sanction.poursuitesPenales","Les faits ont-ils donné lieu, dans le même délai, à l'exercice de poursuites pénales ?","oui / non"],["sanction.sanctionsAnterieuresInvoquees","Des sanctions antérieures sont-elles invoquées à l'appui de la nouvelle sanction ?","oui / non"],["sanction.dateSanctionAnterieurePlusAncienne","Date de la plus ancienne des sanctions antérieures invoquées","AAAA-MM-JJ"],["sanction.dateConvocation","Date d'envoi de la lettre de convocation à l'entretien préalable","AAAA-MM-JJ"],["sanction.dateEntretien","Date de l'entretien préalable","AAAA-MM-JJ"],["sanction.dateNotification","Date de notification de la sanction","AAAA-MM-JJ"]]],["La procédure suivie",[["sanction.convocationEnvoyee","Une lettre de convocation à l'entretien préalable a-t-elle été envoyée ?","oui / non"],["sanction.convocationObjet","Indique-t-elle l'objet de l'entretien ?","oui / non"],["sanction.convocationDateHeureLieu","Précise-t-elle la date, l'heure et le lieu de l'entretien ?","oui / non"],["sanction.convocationAssistance","Rappelle-t-elle que le salarié peut se faire assister par une personne de l'entreprise ?","oui / non"],["sanction.convocationRemise","Comment la convocation a-t-elle été remise ?","liste"],["sanction.entretienTenu","L'entretien préalable a-t-il été tenu ?","oui / non"],["sanction.notificationEcrite","La sanction a-t-elle fait l'objet d'une décision écrite ?","oui / non"],["sanction.notificationMotivee","Cette décision est-elle motivée — les griefs y sont-ils énoncés ?","oui / non"],["sanction.notificationRemise","Comment la sanction a-t-elle été notifiée ?","liste"],["sanction.misePiedConservatoire","Une mise à pied conservatoire à effet immédiat a-t-elle été prononcée ?","oui / non"]]],["La garantie de fond",[["garantie.procedureApplicable","Une convention collective ou le règlement intérieur prévoient-ils une procédure particulière avant la sanction ?","oui / non"],["garantie.source","D'où vient cette procédure ?","liste"],["garantie.nature","En quoi consiste-t-elle ?","liste"],["garantie.suivie","A-t-elle été suivie avant le prononcé de la sanction ?","liste"],["garantie.droitsDefensePrives","En fait, le salarié a-t-il été empêché d'assurer utilement sa défense — informations reçues trop tard, pièces non communiquées, assistance non offerte ?","oui / non"],["garantie.influenceDecision","En fait, cette irrégularité a-t-elle pu peser sur la décision finale — avis non rendu, rendu après coup, ou non pris en compte dans les motifs ?","oui / non"],["garantie.licenciementSubordonneSanctions","Le règlement intérieur ou la convention collective subordonnent-ils le licenciement à l'existence de sanctions antérieures ?","oui / non"]]],["Pièces",[["pieces","Pièces versées au dossier","liste d'objets"]]]],
    propositions: {"cse.existe":{"valeurs":["oui","non"],"libre":false,"aide":"Le comité social et économique. Son avis conditionne l'introduction du règlement intérieur (L. 1321-4) : sans comité, la formalité devient sans objet, mais l'absence de comité relève, elle, du module « comité »."},"ri.existe":{"valeurs":["oui","non"],"libre":false,"aide":"Le règlement intérieur est obligatoire à partir de cinquante salariés (L. 1311-2). En dessous, il est facultatif — mais s'il existe, il obéit aux mêmes règles de contenu et aux mêmes formalités."},"ri.contenuSanteSecurite":{"valeurs":["oui","non"],"libre":false,"aide":"Les mesures d'application de la réglementation santé-sécurité dans l'entreprise, notamment les instructions prévues à l'article L. 4122-1 (L. 1321-1, 1°)."},"ri.contenuParticipation":{"valeurs":["oui","non"],"libre":false,"aide":"Les conditions dans lesquelles les salariés peuvent être appelés, à la demande de l'employeur, à participer au rétablissement de conditions de travail protectrices (L. 1321-1, 2°)."},"ri.contenuDiscipline":{"valeurs":["oui","non"],"libre":false,"aide":"Les règles générales et permanentes relatives à la discipline (L. 1321-1, 3°). C'est le siège du pouvoir disciplinaire : sans elles, aucune sanction n'est prévue."},"ri.echelleSanctions":{"valeurs":["oui","non"],"libre":false,"aide":"La nature et l'échelle des sanctions : avertissement, blâme, mise à pied, mutation, rétrogradation, licenciement. Une sanction non prévue par le règlement intérieur ne peut pas être prononcée (Soc., 26 octobre 2010, n° 09-42.740)."},"ri.misePiedDureeMax":{"valeurs":["oui","non"],"libre":false,"aide":"Une mise à pied disciplinaire n'est licite que si le règlement intérieur précise sa durée maximale (Soc., 26 octobre 2010, n° 09-42.740). « Mise à pied pouvant aller jusqu'à cinq jours » suffit ; « mise à pied » seul, non."},"ri.rappelDroitsDefense":{"valeurs":["oui","non"],"libre":false,"aide":"Le rappel des droits de la défense définis aux articles L. 1332-1 à L. 1332-3, ou par la convention collective applicable (L. 1321-2, 1°)."},"ri.rappelHarcelement":{"valeurs":["oui","non"],"libre":false,"aide":"Le rappel des dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes (L. 1321-2, 2°)."},"ri.rappelLanceursAlerte":{"valeurs":["oui","non"],"libre":false,"aide":"Le rappel de l'existence du dispositif de protection des lanceurs d'alerte de la loi du 9 décembre 2016 (L. 1321-2, 3°)."},"ri.clausesInterdites":{"valeurs":["oui","non"],"libre":false,"aide":"Clauses contraires aux lois, règlements ou conventions collectives ; restrictions aux droits et libertés non justifiées par la nature de la tâche ni proportionnées ; dispositions discriminatoires (L. 1321-3). Fouilles systématiques, interdictions générales, sanctions pécuniaires en font partie."},"ri.clauseNeutralite":{"valeurs":["oui","non"],"libre":false,"aide":"Une clause inscrivant le principe de neutralité et restreignant la manifestation des convictions des salariés (L. 1321-2-1)."},"ri.neutraliteJustifieeProportionnee":{"valeurs":["oui","non"],"libre":false,"aide":"La clause n'est licite qu'à double condition : justifiée par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, ET proportionnée au but recherché (L. 1321-2-1)."},"ri.redigeFrancais":{"valeurs":["oui","non"],"libre":false,"aide":"Le règlement intérieur est rédigé en français ; il peut être accompagné de traductions (L. 1321-6)."},"ri.avisCSE":{"valeurs":["oui","non"],"libre":false,"aide":"Le règlement intérieur « ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique » (L. 1321-4). L'avis accompagne ensuite le texte communiqué à l'inspection."},"ri.publicite":{"valeurs":["oui","non"],"libre":false,"aide":"Porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1) : affichage, intranet, remise individuelle."},"ri.depotGreffe":{"valeurs":["oui","non"],"libre":false,"aide":"Dépôt au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement (R. 1321-2). Le délai d'un mois précédant l'entrée en vigueur court de la dernière des formalités de publicité et de dépôt (R. 1321-3)."},"ri.communicationInspection":{"valeurs":["oui","non"],"libre":false,"aide":"Communication à l'inspecteur du travail, accompagnée de l'avis du comité, en même temps que les mesures de publicité (L. 1321-4)."},"ri.communicationDeuxExemplaires":{"valeurs":["oui","non"],"libre":false,"aide":"R. 1321-4 : le texte est transmis à l'inspecteur du travail en deux exemplaires."},"ri.modifieDepuis":{"valeurs":["oui","non"],"libre":false,"aide":"Toute modification ou tout retrait de clause refait courir les mêmes formalités : avis du comité, publicité, dépôt, communication (L. 1321-4, dernier alinéa)."},"ri.modificationsFormalites":{"valeurs":["oui","non"],"libre":false,"aide":"Une modification introduite sans avis du comité ni publicité n'est pas opposable au salarié."},"ri.notesServiceGenerales":{"valeurs":["oui","non"],"libre":false,"aide":"Les notes de service portant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 sont des adjonctions au règlement intérieur (L. 1321-5) — charte informatique, note sur les fouilles, note sur l'alcool."},"ri.notesServiceFormalites":{"valeurs":["oui","non"],"libre":false,"aide":"Elles suivent en toute hypothèse les formalités du titre. Seule exception : l'urgence, pour les seules obligations de santé et de sécurité, avec communication immédiate au secrétaire du comité et à l'inspection."},"ri.demandeInspection":{"valeurs":["oui","non"],"libre":false,"aide":"L'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1)."},"ri.suiteDemandeInspection":{"valeurs":["oui","non"],"libre":false,"aide":"La décision est motivée, notifiée à l'employeur et communiquée au comité (L. 1322-2). La voie ouverte est le recours hiérarchique (L. 1322-3), non l'inaction."},"sanction.auditee":{"valeurs":["oui","non"],"libre":false,"aide":"Répondez « non » pour n'auditer que le règlement intérieur ; « oui » pour examiner en outre une sanction envisagée ou déjà prononcée."},"sanction.nature":{"valeurs":["avertissement","blâme","mise à pied disciplinaire","mutation disciplinaire","rétrogradation","licenciement disciplinaire","sanction pécuniaire ou amende","autre sanction"],"libre":false,"aide":"Constitue une sanction toute mesure, autre que les observations verbales, prise à la suite d'un agissement considéré comme fautif (L. 1331-1). L'étiquette ne décide pas de la procédure : c'est l'incidence sur la présence, la fonction, la carrière ou la rémunération (L. 1332-2)."},"sanction.incidence":{"valeurs":["oui","non"],"libre":false,"aide":"C'est le critère de L. 1332-2 : l'entretien n'est pas dû pour « un avertissement ou une sanction de même nature n'ayant pas d'incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération »."},"sanction.prevueRI":{"valeurs":["oui","non"],"libre":false,"aide":"Une sanction autre que le licenciement ne peut être prononcée que si elle est prévue par le règlement intérieur, chez l'employeur tenu d'en établir un (Soc., 23 mars 2017, n° 15-23.090 ; Soc., 26 octobre 2010, n° 09-42.740)."},"sanction.griefsEcrits":{"valeurs":["oui","non"],"libre":false,"aide":"« Aucune sanction ne peut être prise à l'encontre du salarié sans que celui-ci soit informé, dans le même temps et par écrit, des griefs retenus contre lui » (L. 1332-1). L'exigence vaut même pour l'avertissement."},"sanction.retenueSalaire":{"valeurs":["oui","non"],"libre":false,"aide":"Les amendes et autres sanctions pécuniaires sont interdites (L. 1331-2). La perte de salaire liée à une mise à pied disciplinaire régulière n'en est pas une : elle résulte de la suspension du contrat."},"sanction.salarieProtege":{"valeurs":["oui","non"],"libre":false,"aide":"Élu, délégué syndical, représentant de proximité, conseiller du salarié, membre d'un conseil d'administration… Le statut protecteur ajoute une procédure spéciale que ce module SIGNALE sans l'auditer."},"sanction.poursuitesPenales":{"valeurs":["oui","non"],"libre":false,"aide":"Seule réserve au délai de deux mois : « à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales » (L. 1332-4)."},"sanction.sanctionsAnterieuresInvoquees":{"valeurs":["oui","non"],"libre":false,"aide":"« Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction » (L. 1332-5)."},"sanction.convocationEnvoyee":{"valeurs":["oui","non"],"libre":false,"aide":"L'employeur qui a choisi de convoquer est tenu de respecter tous les termes de la procédure, quelle que soit la sanction finalement infligée (Soc., 16 avril 2008, n° 06-41.999)."},"sanction.convocationObjet":{"valeurs":["oui","non"],"libre":false,"aide":"R. 1332-1 : la lettre indique l'objet de l'entretien entre le salarié et l'employeur."},"sanction.convocationDateHeureLieu":{"valeurs":["oui","non"],"libre":false,"aide":"R. 1332-1 : elle précise la date, l'heure et le lieu de cet entretien."},"sanction.convocationAssistance":{"valeurs":["oui","non"],"libre":false,"aide":"R. 1332-1 : elle rappelle que le salarié peut se faire assister par une personne de son choix APPARTENANT AU PERSONNEL de l'entreprise — la sanction disciplinaire n'ouvre pas l'assistance par un conseiller extérieur."},"sanction.convocationRemise":{"valeurs":["récépissé","lettre recommandée"],"autres":["autre mode"],"libre":true,"aide":"R. 1332-1 n'ouvre que deux voies : la remise contre récépissé ou la lettre recommandée, dans le délai de deux mois fixé à l'article L. 1332-4."},"sanction.entretienTenu":{"valeurs":["oui","non"],"libre":false,"aide":"Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié (L. 1332-2)."},"sanction.notificationEcrite":{"valeurs":["oui","non"],"libre":false,"aide":"R. 1332-2 : la sanction fait l'objet d'une décision écrite et motivée."},"sanction.notificationMotivee":{"valeurs":["oui","non"],"libre":false,"aide":"La motivation énonce les griefs. Une lettre qui se borne à « votre comportement » ne met pas le salarié en mesure de les discuter."},"sanction.notificationRemise":{"valeurs":["récépissé","lettre recommandée"],"autres":["autre mode"],"libre":true,"aide":"R. 1332-2 : la décision est notifiée soit par lettre remise contre récépissé, soit par lettre recommandée, dans le délai d'un mois prévu par L. 1332-2."},"sanction.misePiedConservatoire":{"valeurs":["oui","non"],"libre":false,"aide":"La mise à pied conservatoire n'est pas une sanction : elle écarte le salarié le temps de la procédure. Aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure de L. 1332-2 ait été respectée (L. 1332-3)."},"garantie.procedureApplicable":{"valeurs":["oui","non"],"libre":false,"aide":"C'est la première chose à vérifier dans une convention collective : conseil de discipline, commission paritaire, avis préalable, entretien imposé. Une procédure conventionnelle non suivie est assimilée à la violation d'une garantie de fond (Soc., 8 septembre 2021, n° 19-15.039)."},"garantie.source":{"valeurs":[],"autres":["la convention collective","le règlement intérieur","les deux"],"libre":true,"indicatif":true,"aide":"La source est reprise telle quelle dans le rapport : le module ne discrimine pas entre convention collective et règlement intérieur — la Cour de cassation les traite de la même façon (Soc., 8 septembre 2021, n° 19-15.039)."},"garantie.nature":{"valeurs":["consultation d'un organisme appelé à donner son avis"],"autres":["entretien imposé avant toute sanction","autre formalité prévue avant la sanction"],"libre":true,"aide":"La consultation d'un organisme chargé de donner son avis sur un licenciement envisagé constitue une garantie de fond : sans elle, le licenciement ne peut avoir de cause réelle et sérieuse (Soc., 8 septembre 2021, n° 19-15.039)."},"garantie.suivie":{"valeurs":["oui","non","tardivement ou imparfaitement"],"libre":false,"aide":"« Tardivement ou imparfaitement » n'est pas « oui » : le caractère tardif de la demande d'avis est une irrégularité, et il appartient au juge de rechercher si elle a privé le salarié de sa défense ou a pu influencer la décision (Soc., 20 mars 2024, n° 22-17.292)."},"garantie.droitsDefensePrives":{"valeurs":["oui","non"],"libre":false,"aide":"Première branche du critère : l'irrégularité a-t-elle privé le salarié de la possibilité d'assurer utilement sa défense ?"},"garantie.influenceDecision":{"valeurs":["oui","non"],"libre":false,"aide":"Seconde branche du critère : l'irrégularité est-elle susceptible d'avoir exercé, en l'espèce, une influence sur la décision finale de sanctionner ?"},"garantie.licenciementSubordonneSanctions":{"valeurs":["oui","non"],"libre":false,"aide":"Si le règlement intérieur ou la convention collective subordonnent le licenciement à l'existence de sanctions antérieures, l'avertissement lui-même peut influer sur le maintien dans l'entreprise : l'entretien préalable devient obligatoire (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204)."},"pieces":{"valeurs":[],"autres":["reglement-interieur","convocation-entretien","notification-sanction","avis-cse","recepisse-greffe","clause-conventionnelle"],"libre":true,"multiple":true,"indicatif":true,"aide":"Les documents que vous joignez. Un règlement intérieur ne se prouve que par son texte, un dépôt que par le récépissé du greffe."}},
    listes: [],
    colonnes: {},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
