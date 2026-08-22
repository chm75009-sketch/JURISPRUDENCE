/* Moteur d'audit du licenciement économique — version navigateur.

   Ce fichier est produit par moteur/commun/empaqueter.js à partir des sources
   de moteur/economique, et versé au dépôt : le site ne construit rien.
   Ne pas le modifier à la main — rejouer l'empaquetage.

   Empreinte du moteur au moment de l'empaquetage : cf0ada7ce727
   {"articlesLus":32,"themesDuPlancher":10,"versionPlancher":"LEGIARTI000043975329","rubriquesR2312_8":10,"rubriquesR2312_9":10,"couvertureR2312_8":100,"couvertureR2312_9":100,"controles":17,"detection":1,"coherence":1,"donneesDemandees":32,"casRegime":12,"casDates":5,"casDelais":4,"casContradictoires":14,"verdicts":323,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"contenuAuditeSurRegimeIndetermine":0,"preuveConcluantConforme":0}
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
  var __MANIFESTE = {"domaine":"base de données économiques, sociales et environnementales","etatPublication":"réglementaire publiée","catalogueReglementaire":{"exhaustif":true,"seuilDeSortie":100,"couvertures":{"R. 2312-8":100,"R. 2312-9":100},"mention":"Le texte du décret est intégralement consommé par le découpage, ou son reliquat est validé et rattaché à une règle."},"date":"2026-08-22","empreinte":"cf0ada7ce727","perimetre":"Le module prépare, structure, documente et audite la base. Il ne fournit pas une base collaborative accessible simultanément à plusieurs catégories d'utilisateurs, et il n'est pas la base : la mise à disposition reste un acte de l'employeur.","fichiers":{"audit-bdese-client.js":"cb705b6e48fb","cas-regime.js":"2f4cfdd8c433","contenu-bdese.js":"48b4cd8584fa","controles-bdese.js":"a5df2bb4f35f","dates.js":"b6d7e587bec3","fiche-bdese.json":"259cf93a565e","outils.js":"7401cc07f5a6","plancher-bdese.js":"531a1e4147d8","propositions-bdese.js":"976330e09f78","questionnaire-bdese.js":"f11db892d812","recevabilite.js":"62a84856a6f1","regime-bdese.js":"2a10cd8d305e","sonde.js":"ac23bba7af98","tests-bdese.js":"845cca821886","textes-bdese.json":"3e485ff27643","verifier-textes-bdese.js":"b108b69a921d"},"compteurs":{"articlesLus":32,"themesDuPlancher":10,"versionPlancher":"LEGIARTI000043975329","rubriquesR2312_8":10,"rubriquesR2312_9":10,"couvertureR2312_8":100,"couvertureR2312_9":100,"controles":17,"detection":1,"coherence":1,"donneesDemandees":32,"casRegime":12,"casDates":5,"casDelais":4,"casContradictoires":14,"verdicts":323,"exceptions":0,"conformitesOuSansObjetSurFicheVide":0,"contenuAuditeSurRegimeIndetermine":0,"preuveConcluantConforme":0},"manifesteReglementaire":[{"article":"L2312-14","version":"LEGIARTI000036262404","caracteres":519,"relecture":"concordant"},{"article":"L2312-15","version":"LEGIARTI000038791194","caracteres":1157,"relecture":"concordant"},{"article":"L2312-17","version":"LEGIARTI000051559706","caracteres":1079,"relecture":"concordant"},{"article":"L2312-18","version":"LEGIARTI000052437125","caracteres":1599,"relecture":"concordant"},{"article":"L2312-19","version":"LEGIARTI000036262394","caracteres":1109,"relecture":"concordant"},{"article":"L2312-2","version":"LEGIARTI000035650754","caracteres":913,"relecture":"homonyme servi par le relais"},{"article":"L2312-21","version":"LEGIARTI000043975329","caracteres":2045,"relecture":"concordant"},{"article":"L2312-22","version":"LEGIARTI000043975191","caracteres":948,"relecture":"concordant"},{"article":"L2312-25","version":"LEGIARTI000048533627","caracteres":2159,"relecture":"concordant"},{"article":"L2312-26","version":"LEGIARTI000052437222","caracteres":4747,"relecture":"concordant"},{"article":"L2312-34","version":"LEGIARTI000035609830","caracteres":373,"relecture":"concordant"},{"article":"L2312-36","version":"LEGIARTI000048533625","caracteres":2804,"relecture":"concordant"},{"article":"L2312-4","version":"LEGIARTI000035650742","caracteres":203,"relecture":"concordant"},{"article":"L2312-5","version":"LEGIARTI000043893930","caracteres":1417,"relecture":"concordant"},{"article":"L2312-8","version":"LEGIARTI000043975196","caracteres":1567,"relecture":"concordant"},{"article":"L2312-83","version":"LEGIARTI000036761969","caracteres":424,"relecture":"concordant"},{"article":"L2312-84","version":"LEGIARTI000035611325","caracteres":376,"relecture":"concordant"},{"article":"L2316-1","version":"LEGIARTI000043975179","caracteres":872,"relecture":"concordant"},{"article":"L2316-20","version":"LEGIARTI000035633047","caracteres":417,"relecture":"concordant"},{"article":"L2316-22","version":"LEGIARTI000036761997","caracteres":593,"relecture":"concordant"},{"article":"R2312-10","version":"LEGIARTI000036411580","caracteres":592,"relecture":"homonyme servi par le relais"},{"article":"R2312-11","version":"LEGIARTI000036411584","caracteres":466,"relecture":"homonyme servi par le relais"},{"article":"R2312-12","version":"LEGIARTI000036411586","caracteres":675,"relecture":"concordant"},{"article":"R2312-13","version":"LEGIARTI000036411588","caracteres":306,"relecture":"concordant"},{"article":"R2312-14","version":"LEGIARTI000036411590","caracteres":602,"relecture":"concordant"},{"article":"R2312-15","version":"LEGIARTI000036411594","caracteres":372,"relecture":"concordant"},{"article":"R2312-16","version":"LEGIARTI000045680836","caracteres":364,"relecture":"concordant"},{"article":"R2312-5","version":"LEGIARTI000045680873","caracteres":489,"relecture":"illisible"},{"article":"R2312-6","version":"LEGIARTI000036411558","caracteres":1179,"relecture":"concordant"},{"article":"R2312-7","version":"LEGIARTI000047548416","caracteres":847,"relecture":"concordant"},{"article":"R2312-8","version":"LEGIARTI000049905537","caracteres":10993,"relecture":"concordant"},{"article":"R2312-9","version":"LEGIARTI000049905524","caracteres":31803,"relecture":"concordant"}],"textesRelus":{"date":"2026-08-16","articles":32,"concordants":28,"ecarts":0,"sansConclusion":4,"homonymesEcartes":10}};
  var __REGISTRE = (function () { var r = null || {};
    return { construire: function () { return r.construire || []; },
             coherence: function () { return r.coherence || {}; },
             DETECTION: new Set(r.DETECTION || []), COHERENCE: new Set(r.COHERENCE || []) }; })();

__def("./audit-bdese-client.js", function(module, exports, require){
/* Le rapport du module « base de données économiques, sociales et environnementales ».

   Rien n'est affirmé ici : ce fichier met en forme ce que les contrôles ont
   rendu. Il commence par le régime, parce que tout le reste en dépend, et il
   n'affiche le contenu attendu que lorsque le régime est connu.

   La formulation du périmètre est reprise telle quelle, à l'écran et dans le
   Word : le module prépare, structure, documente et audite la base. Il ne la
   met pas à disposition, et il n'est pas la base. */
const O = require("./outils.js");
const R = require("./regime-bdese.js");
const CONTENU = require("./contenu-bdese.js");
const { C, ETATS, DETECTION, COHERENCE, PLANCHER } = require("./controles-bdese.js");
const PL = require("./plancher-bdese.js");

const { CONF, NC, RISQ, MANQ, SO } = ETATS;

function audit(f) {
  const A = O(); const { sur, t1, trait, h1, h2, h3, p, note, puce, enc, tab } = A;

  const V = C.map(c => ({ ...c, v: (() => {
    try { return c.verdict(f); } catch (e) { return { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  })() }));
  const par = e => V.filter(x => x.v.etat === e);
  const nc = par(NC), rq = par(RISQ), mq = par(MANQ), ok = par(CONF), so = par(SO);

  const reg = R.regime(f);
  const exi = R.exigibilite(f);
  const del = R.delaiConsultation(f);
  const B = CONTENU.construire();

  sur("Audit — base de données économiques, sociales et environnementales · articles L. 2312-18 et suivants du code du travail");
  t1(f.entreprise || "Audit de la base de données");
  sur(`${C.length} contrôles · plancher de ${PLANCHER.length} thèmes · contenu du décret découpé depuis son texte`);
  trait();

  const indetermine = reg.regime === R.REGIMES.INDETERMINE;
  const statut = indetermine
      ? { t: "RÉGIME INDÉTERMINÉ", c: "gris", sous: "Le texte qui commande le contenu de la base n'est pas identifié : aucun contenu n'est audité, et c'est délibéré." }
    : nc.length ? { t: "NON CONFORME", c: "rouge", sous: `${nc.length} manquement(s) constaté(s) au regard du régime applicable.` }
    : mq.length ? { t: "À COMPLÉTER", c: "orange", sous: `${mq.length} donnée(s) manquante(s) : la base ne peut pas être appréciée en l'état.` }
    : rq.length ? { t: "RISQUE À VÉRIFIER", c: "orange", sous: `${rq.length} point(s) appellent une vérification hors de portée de l'application.` }
    : { t: "CONFORME AU VU DES PIÈCES", c: "vert", sous: "Aucun écart sur les points contrôlés, au regard du régime applicable." };
  A.D.push({ k: "bandeau", couleur: statut.c, t: statut.t, sous: statut.sous });

  /* L'état du catalogue réglementaire est dit dans le rapport, non seulement au
     manifeste : le lecteur du rapport doit savoir si le découpage du décret est
     intégral, et il ne le saura pas en lisant le code. */
  const cv = [B.contenu["moins300"].couverture, B.contenu["au moins300"].couverture];
  const reste = cv.reduce((n, c) => n + (c.reliquat || 0), 0);
  if (reste)
    enc("État du catalogue réglementaire — développement",
      `Le découpage laisse ${reste} caractère(s) du décret hors de son périmètre. Le critère de sortie est cent pour cent : tant qu'il n'est pas atteint, le catalogue n'est pas exhaustif, et ce rapport ne doit pas être lu comme une vérification de l'intégralité du décret.`);
  else
    enc("État du catalogue réglementaire — complet",
      `Le texte des articles R. 2312-8 et R. 2312-9 est intégralement rendu : chaque caractère est soit extrait comme contenu, soit reconnu comme structure du découpage — marqueur, numérotation, séparateur (${cv[0].structure} et ${cv[1].structure} caractères respectivement). Aucun reliquat. La chaîne de publication échoue si un seul caractère cesse d'être l'un ou l'autre.`);

  enc("Ce que ce module fait, et ce qu'il ne fait pas",
    "Il prépare, structure, documente et audite la base de données. Il ne fournit pas une base collaborative accessible simultanément à plusieurs catégories d'utilisateurs, et il n'est pas la base : la mise à disposition reste un acte de l'employeur, qui se prouve par le support lui-même, ses traces d'accès et l'information donnée aux bénéficiaires.");

  /* --- le régime, d'abord --- */
  h1("Le régime applicable");
  p(reg.motif);
  if (indetermine)
    enc("Pourquoi l'audit du contenu s'arrête ici",
      "Le régime supplétif ne s'applique pas « à défaut d'avoir trouvé » : il s'applique en l'absence d'accord, ce qui est un fait à établir. Auditer un contenu sans savoir quel texte le commande produirait des non-conformités inventées — un accord peut légalement organiser la base autrement, sous la seule réserve du plancher légal. Renseignez la recherche d'accord, joignez l'accord s'il en existe un, et relancez.");

  h2("Les dates d'exigibilité");
  if (exi.attributions) p(exi.attributions.motif);
  if (exi.contenu300) p(exi.contenu300.motif);
  exi.avertissements.forEach(a => note(a));
  if (!exi.attributions && !exi.contenu300) note("Aucune date n'a pu être établie : les dates de franchissement des seuils ne sont pas renseignées.");

  /* --- ce qui bloque --- */
  if (nc.length) {
    h1("Ce qui ne va pas");
    for (const x of nc) A.D.push({ k: "interdit", t: x.objet, pourquoi: x.v.motif, id: x.id });
  }
  if (mq.length) {
    h1("Ce qui manque pour conclure");
    for (const x of mq) puce(`${x.objet} — ${x.v.motif} · ${x.id}`);
  }
  if (rq.length) {
    h1("Ce qui appelle une vérification");
    for (const x of rq)
      A.D.push({ k: "acte", n: rq.indexOf(x) + 1, t: x.objet,
        priorite: DETECTION.includes(x.id) ? "information" : "critique",
        etat: RISQ, pourquoi: x.v.motif, id: x.id });
  }

  /* --- le plancher, qu'aucun accord ne peut descendre --- */
  h1("Le plancher légal — les dix thèmes de l'accord");
  p("Ces thèmes sont ceux du troisième alinéa de l'article L. 2312-21, relevés dans son texte : « la base de données comporte au moins les thèmes suivants ». Aucun accord ne descend en dessous. Ils ne se confondent pas avec les dix thèmes de la consultation de l'article L. 2312-36 : ce sont deux listes de dix qui ne sont pas les mêmes dix.");
  const declares = Array.isArray((f.base || {}).themes) ? f.base.themes.map(x => String(x.theme || x)) : [];
  tab(["Thème du plancher — tel que la loi l'écrit", "Ce que le décret nomme", "Déclaré dans la base ?"],
    PLANCHER.map(t => {
      const c = PL.CORRESPONDANCE.find(x => PL.net(x.plancher) === PL.net(t));
      return [t, c ? c.decret.join(" ; ") : "—", PL.couvert(t, declares) ? "oui" : "non déclaré"];
    }));
  note("Deux thèmes du décret ne figurent pas au plancher — la sous-traitance, que le décret nomme « partenariats », et les transferts intragroupe : un accord peut donc les supprimer, et l'application le dit plutôt que de les réclamer.");

  /* --- le contenu attendu, seulement si le régime est connu --- */
  if (!indetermine) {
    h1("Le contenu attendu");
    if (reg.regime === R.REGIMES.SUPPLETIF) {
      const cle = reg.article === "R. 2312-9" ? "au moins300" : "moins300";
      const arbre = B.contenu[cle];
      const info = arbre.rubriques.reduce((n, r) => n + r.sections.reduce((m, s) =>
        m + s.sujets.reduce((k, j) => k + j.informations.length, 0), 0), 0);
      p(`Aucun accord ne définit la base : le contenu est celui de l'article ${reg.article}, découpé depuis son texte — ${arbre.rubriques.length} rubriques, ${info} informations, couverture du découpage ${arbre.couverture.part} %.`);
      tab(["Rubrique du décret", "Sections", "Informations", "Déclarée ?"],
        arbre.rubriques.map(r => {
          const nbInfo = r.sections.reduce((m, s) => m + s.sujets.reduce((k, j) => k + j.informations.length, 0), 0);
          return [r.titre, String(r.sections.length), String(nbInfo),
            declares.map(PL.net).some(d => d.includes(PL.net(r.titre).slice(0, 20))
              || PL.net(r.titre).includes(d.slice(0, 20))) ? "oui" : "non déclarée"];
        }));
      const an = R.annees(f, Number(String(f.dateAudit || "").slice(0, 4)) || undefined);
      h2("Les années couvertes");
      p(an.motif);
      note(`Concrètement : ${an.passees.join(", ")}, ${an.courante}, puis ${an.suivantes.join(", ")}. Les trois dernières peuvent être données en grandes tendances — l'exiger en chiffres produirait des non-conformités fausses.`);
    } else {
      p(`Le contenu est celui que définit ${reg.regime} (${reg.article}). L'application ne peut pas le vérifier ligne à ligne : elle ne lit pas les stipulations de votre accord. Elle vérifie ce qui s'impose à lui — le plancher de l'article L. 2312-21, alinéa 3 — et la mise à disposition.`);
    }
  }

  /* --- les consultations --- */
  h1("Les consultations");
  p(del.motif);
  note("L'accord qui fixe la périodicité et les délais des consultations est celui de l'article L. 2312-19. Ce n'est pas celui qui définit la base, qui relève de l'article L. 2312-21 : un accord sur la base ne déplace pas la périodicité des consultations, et le module les demande séparément.");

  if (ok.length) {
    h1("Ce qui est acquis au vu des pièces");
    for (const x of ok) A.D.push({ k: "acquis", t: x.objet, base: x.v.motif });
  }

  h1("Ce que cet audit a mesuré");
  tab(["Mesure", "Valeur", "Ce que cela veut dire"], [
    ["Contrôles exécutés", `${C.length}`, "Chacun est fondé sur un article, cité dans son motif."],
    ["Manquements", `${nc.length}`, "Un texte n'est pas respecté, au regard du régime applicable."],
    ["Risques à vérifier", `${rq.length}`, "La règle dépend d'un élément que l'application ne peut pas trancher seule."],
    ["Données manquantes", `${mq.length}`, "Aucune conclusion n'en a été tirée, dans aucun sens."],
    ["Sans objet", `${so.length}`, "L'exigence ne s'applique pas, et une donnée renseignée permet de le dire."],
    ["Régime retenu", reg.regime, indetermine ? "Aucun contenu n'a été audité, et c'est la bonne réponse." : `Fondement : ${reg.article || "L. 2312-21"}.`],
    ["Thèmes du plancher légal", `${PLANCHER.length}`, `Relevés dans le texte de L. 2312-21, al. 3 — version ${B.planchierVersion || "—"}.`],
    ["Couverture du découpage du décret",
      `R. 2312-8 : ${B.contenu["moins300"].couverture.part} % · R. 2312-9 : ${B.contenu["au moins300"].couverture.part} %`,
      "Part du texte du décret que le découpage a consommée. Ce qui n'a pas été reconnu est compté et publié, jamais passé sous silence."],
    ["Contrôles de cohérence", `${COHERENCE.length}`, "Ils ne vérifient pas une donnée mais la relation entre deux."],
    ["Contrôle de preuve", `${DETECTION.length}`, "Il ne conclut jamais à la conformité : l'application constitue le contenu, elle n'atteste pas la mise à disposition."],
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

__def("./regime-bdese.js", function(module, exports, require){
/* Quel régime s'applique à la base de données, et à quelle date il s'impose.

   C'est la pièce sur laquelle tout le reste repose : le contenu exigible n'est
   pas le même selon que l'entreprise est régie par un accord d'entreprise, par
   un accord de branche, ou par le supplétif du décret. Se tromper ici, c'est
   auditer un contenu que la loi ne demande pas.

   TROIS RÈGLES DE MÉTHODE, écrites ici plutôt que dispersées :

   1. Une seule question commande : y a-t-il un accord ? Non — la loi
      s'applique, c'est-à-dire le décret. Oui — on demande l'accord, puisque
      c'est lui qui fixe alors le contenu et qu'on ne peut pas vérifier un
      texte qu'on n'a pas. Le régime n'est INDÉTERMINÉ que dans deux cas :
      la question n'a pas reçu de réponse, ou l'accord annoncé n'est pas joint.
      Un silence n'est pas un « non » : une question sans réponse ne vaut
      aucun régime.

   2. Le seuil qui commande la BDESE n'est pas celui du comité. Le comité se met
      en place à onze salariés ; les attributions récurrentes — dont la base
      relève — s'exercent à cinquante (L. 2312-2). Le contenu supplétif, lui,
      change à trois cents (R. 2312-8 en deçà, R. 2312-9 au-delà).

   3. Deux délais, souvent confondus, et un troisième que le texte ajoute :
      — L. 2312-2 : effectif d'au moins cinquante pendant douze mois consécutifs,
        puis DOUZE MOIS de plus avant que les attributions récurrentes s'exercent.
        Et si, à l'expiration de ce délai, le mandat restant à courir est
        inférieur à un an, le délai court à compter du renouvellement du comité —
        seconde phrase que le module lit, faute de quoi il annoncerait une date
        fausse ;
      — L. 2312-34 : le seuil de trois cents est réputé franchi après douze mois
        consécutifs de dépassement, et l'employeur dispose ensuite d'UN AN pour
        s'y conformer complètement.

   Ce fichier ne conclut sur aucun dossier. Il rend le régime et les dates ; ce
   sont les contrôles qui prononcent. */

const SEUIL_ATTRIBUTIONS = 50;
const SEUIL_CONTENU = 300;

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const renseigne = x => x !== undefined && x !== null && x !== "";

function ajouterMois(iso, mois) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return null;
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return null;
  const j = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + mois);
  if (d.getUTCDate() !== j) d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}
const moisEntre = (a, b) => {
  if (!a || !b) return null;
  const x = new Date(a + "T00:00:00Z"), y = new Date(b + "T00:00:00Z");
  if (isNaN(x) || isNaN(y)) return null;
  return (y.getUTCFullYear() - x.getUTCFullYear()) * 12 + (y.getUTCMonth() - x.getUTCMonth())
    - (y.getUTCDate() < x.getUTCDate() ? 1 : 0);
};

/* ------------------------------------------------------------- le régime */

const REGIMES = {
  ACCORD_ENTREPRISE: "accord d'entreprise",
  ACCORD_BRANCHE: "accord de branche",
  SUPPLETIF: "supplétif du décret",
  INDETERMINE: "indéterminé",
};

function regime(f) {
  const eff = nombre(f.effectif);

  if (dit(f.accordEntreprise)) {
    if (!dit(f.accordEntrepriseVerse))
      return { regime: REGIMES.INDETERMINE, cause: "accord déclaré non versé",
        motif: "Un accord d'entreprise est déclaré mais n'est pas versé. Le contenu exigible est celui qu'il définit : sans son texte, l'application ne peut vérifier ni ce qu'il contient, ni qu'il respecte le plancher de l'article L. 2312-21, alinéa 3. Joignez-le." };
    return { regime: REGIMES.ACCORD_ENTREPRISE, article: "L. 2312-21, al. 1er",
      motif: "Un accord d'entreprise définit l'organisation, l'architecture, le contenu et les modalités de fonctionnement de la base. C'est lui qui commande — sous la réserve du plancher de l'alinéa 3, auquel aucun accord ne peut descendre." };
  }

  if (dit(f.accordBranche)) {
    if (eff === null)
      return { regime: REGIMES.INDETERMINE, cause: "effectif inconnu",
        motif: "Un accord de branche est déclaré, mais l'effectif n'est pas renseigné. Or l'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés, et seulement à défaut d'accord d'entreprise (L. 2312-21, dernier alinéa)." };
    if (eff >= SEUIL_CONTENU)
      return { regime: REGIMES.SUPPLETIF, article: "R. 2312-9",
        motif: `Un accord de branche est déclaré, mais l'entreprise compte ${eff} salariés. L'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés : il ne s'applique pas ici, et le supplétif du décret reprend son empire.` };
    if (!dit(f.accordBrancheVerse))
      return { regime: REGIMES.INDETERMINE, cause: "accord de branche non versé",
        motif: "Un accord de branche est déclaré mais n'est pas versé. Le contenu exigible est celui qu'il définit ; sans son texte, il ne peut pas être vérifié." };
    return { regime: REGIMES.ACCORD_BRANCHE, article: "L. 2312-21, dernier alinéa",
      motif: `À défaut d'accord d'entreprise et l'effectif étant inférieur à trois cents salariés (${eff}), un accord de branche peut définir la base. C'est lui qui commande, sous la même réserve de plancher.` };
  }

  /* Ni accord d'entreprise ni accord de branche. Encore faut-il que la question
     ait reçu une réponse : un silence n'est pas un « non ». */
  if (!renseigne(f.accordEntreprise) && !renseigne(f.accordBranche))
    return { regime: REGIMES.INDETERMINE, cause: "accord non déclaré",
      motif: "Il n'est pas dit si un accord définit la base. Répondez oui ou non : sans accord, c'est le décret qui fixe le contenu ; avec un accord, c'est lui, et il faut alors le joindre." };

  if (eff === null)
    return { regime: REGIMES.INDETERMINE, cause: "effectif inconnu",
      motif: "Aucun accord ne définit la base : c'est le décret qui s'applique. Mais l'effectif n'est pas renseigné, et le contenu dû n'est pas le même de part et d'autre de trois cents salariés (R. 2312-8 en deçà, R. 2312-9 au-delà)." };

  return { regime: REGIMES.SUPPLETIF,
    article: eff >= SEUIL_CONTENU ? "R. 2312-9" : "R. 2312-8",
    seuil: eff >= SEUIL_CONTENU ? "au moins trois cents salariés" : "moins de trois cents salariés",
    motif: `Aucun accord ne définit la base : c'est la loi qui s'applique. Le contenu dû est celui du décret, article ${eff >= SEUIL_CONTENU ? "R. 2312-9" : "R. 2312-8"}, l'entreprise comptant ${eff} salariés.` };
}

/* -------------------------------------------------- les dates d'exigibilité

   Deux calendriers distincts, qui ne se remplacent pas l'un l'autre. */

function exigibilite(f) {
  const eff = nombre(f.effectif);
  const out = { attributions: null, contenu300: null, avertissements: [] };

  /* L. 2312-2 — l'entrée dans les attributions récurrentes. */
  const d50 = f.dateSeuil50Atteint;          /* fin des douze mois consécutifs à cinquante */
  if (renseigne(d50)) {
    let terme = ajouterMois(d50, 12);
    let regle = "L. 2312-2, première phrase";
    const finMandat = f.dateFinMandat;
    if (renseigne(finMandat) && terme) {
      const reste = moisEntre(terme, finMandat);
      if (reste !== null && reste < 12) {
        /* Seconde phrase : le délai court à compter du renouvellement du comité.
           La date du renouvellement n'est pas déductible du reste — elle est
           demandée, et sans elle le module ne donne pas de date. */
        regle = "L. 2312-2, seconde phrase";
        if (renseigne(f.dateRenouvellementCSE)) {
          terme = ajouterMois(f.dateRenouvellementCSE, 12);
        } else {
          terme = null;
          out.avertissements.push("Le mandat du comité restant à courir est inférieur à un an à l'expiration du délai de douze mois : le délai court alors à compter du renouvellement du comité (L. 2312-2, seconde phrase). La date de ce renouvellement n'est pas renseignée — aucune date d'exigibilité n'est annoncée, plutôt qu'une date fausse.");
        }
      }
    } else if (renseigne(f.dateSeuil50Atteint) && !renseigne(finMandat)) {
      out.avertissements.push("La date de fin des mandats en cours n'est pas renseignée. Si, à l'expiration du délai de douze mois, le mandat restant à courir est inférieur à un an, le délai court à compter du renouvellement du comité (L. 2312-2, seconde phrase) : la date ci-dessous serait alors fausse.");
    }
    out.attributions = { date: terme, regle,
      motif: terme
        ? `L'effectif ayant atteint cinquante salariés pendant douze mois consécutifs au ${d50}, les attributions récurrentes — dont la base de données relève — s'exercent à compter du ${terme} (${regle}).`
        : `Le terme ne peut pas être calculé : ${regle} renvoie au renouvellement du comité, dont la date n'est pas connue.` };
  }

  /* L. 2312-34 — le passage au contenu des entreprises de trois cents et plus. */
  const d300 = f.dateSeuil300Franchi;        /* fin des douze mois consécutifs de dépassement */
  if (renseigne(d300)) {
    const terme = ajouterMois(d300, 12);
    out.contenu300 = { date: terme, regle: "L. 2312-34",
      motif: `Le seuil de trois cents salariés est réputé franchi au ${d300}, après douze mois consécutifs de dépassement. L'employeur dispose d'un an à compter de ce franchissement — soit jusqu'au ${terme} — pour se conformer complètement aux obligations qui en découlent, dont le contenu de l'article R. 2312-9.` };
  } else if (eff !== null && eff >= SEUIL_CONTENU) {
    out.avertissements.push("L'effectif atteint trois cents salariés, mais la date de franchissement du seuil n'est pas renseignée. Le seuil n'est réputé franchi qu'après douze mois consécutifs de dépassement, et l'employeur dispose ensuite d'un an (L. 2312-34) : sans cette date, l'application ne sait pas si le contenu de R. 2312-9 est déjà exigible.");
  }

  return out;
}

/* -------------------------------------------- les délais de consultation

   R. 2312-5 donne le point de départ, R. 2312-6 la durée. Ils ne se déduisent
   pas de l'accord BDESE : l'accord de l'article L. 2312-19 est un autre accord,
   et un accord sur la base ne déplace pas la périodicité des consultations. */
const DELAIS_CONSULTATION = { simple: 1, expertise: 2, centralEtEtablissements: 3 };

function delaiConsultation(f) {
  const c = f.consultation || {};
  if (dit(f.accordDelaisConsultation)) {
    return { connu: false, article: "L. 2312-19, 4°",
      motif: "Un accord fixe les délais dans lesquels les avis du comité sont rendus (L. 2312-19, 4°). C'est lui qui commande, non le mois supplétif de l'article R. 2312-6 — et l'application ne peut vérifier que ce qu'elle lit : joignez-le." };
  }
  const expertises = nombre(c.nbExpertises);
  const central = dit(c.centralEtEtablissements);
  let mois = DELAIS_CONSULTATION.simple, cas = "aucune expertise";
  if (central && expertises !== null && expertises >= 1) { mois = DELAIS_CONSULTATION.centralEtEtablissements; cas = "expertises au niveau central et d'établissement"; }
  else if (expertises !== null && expertises >= 1) { mois = DELAIS_CONSULTATION.expertise; cas = "intervention d'un expert"; }
  const depart = c.dateMiseADisposition || c.dateCommunication;
  return { connu: true, mois, cas, depart,
    terme: depart ? ajouterMois(depart, mois) : null,
    article: "R. 2312-5, R. 2312-6",
    motif: `Le délai court de la communication des informations ou de l'information de leur mise à disposition dans la base (R. 2312-5). À défaut d'accord, le comité est réputé consulté et avoir rendu un AVIS NÉGATIF à l'expiration d'un délai de ${mois} mois — ${cas} (R. 2312-6, I)${depart ? `, soit au ${ajouterMois(depart, mois)}` : ""}. Lorsque le comité central et des comités d'établissement sont consultés, l'avis de chaque établissement est rendu au plus tard sept jours avant ce terme, à défaut de quoi il est réputé négatif (R. 2312-6, II).` };
}

/* -------------------------------------------------- les années couvertes

   R. 2312-10 : l'année en cours, les deux précédentes et les trois suivantes.
   Les trois suivantes peuvent être données EN GRANDES TENDANCES, à défaut de
   chiffres — et l'employeur doit indiquer, en les motivant, les informations
   qui ne peuvent recevoir ni chiffres ni tendances. Un contrôle qui exigerait
   six colonnes chiffrées produirait des non-conformités fausses. */
function annees(f, anneeCourante) {
  const n = nombre(anneeCourante) || new Date().getUTCFullYear();
  return {
    passees: [n - 2, n - 1], courante: n, suivantes: [n + 1, n + 2, n + 3],
    article: "R. 2312-10",
    tendancesAdmises: true,
    motif: "En l'absence d'accord, les informations portent sur l'année en cours, les deux précédentes et, telles qu'elles peuvent être envisagées, les trois suivantes. Elles sont présentées sous forme de données chiffrées ou, à défaut et pour les années suivantes seulement, sous forme de grandes tendances. L'employeur indique en outre, en précisant ses raisons, les informations qui ne peuvent faire l'objet ni de chiffres ni de tendances.",
  };
}

module.exports = { regime, exigibilite, delaiConsultation, annees,
  REGIMES, SEUIL_ATTRIBUTIONS, SEUIL_CONTENU, DELAIS_CONSULTATION,
  ajouterMois, moisEntre };

});

__def("./contenu-bdese.js", function(module, exports, require){
/* La base de données économiques, sociales et environnementales : son contenu,
   extrait du texte et non recopié.

   Onze mille caractères en deçà de trois cents salariés, trente et un mille huit
   cents au-delà. Recopier cela à la main, c'est garantir des écarts — et surtout
   des écarts silencieux à la prochaine modification du décret. Le contenu est
   donc découpé depuis le texte lui-même, comme l'a été le tableau de l'article
   R. 2314-1, et la couverture du découpage est mesurée : ce qui n'a pas été
   reconnu est compté et affiché, jamais passé sous silence.

   Trois étages, et l'ordre entre eux commande tout :

   — le plancher de l'article L. 2312-21, troisième alinéa : les thèmes que la
     base comporte « au moins ». Aucun accord ne descend en dessous. Deux thèmes
     du décret n'y figurent pas — la sous-traitance, que le décret nomme
     « partenariats », et les transferts intragroupe : un accord peut donc les
     supprimer, et l'application doit le dire ;
   — l'accord de l'article L. 2312-21, d'entreprise ou, à défaut et en deçà de
     trois cents salariés, de branche ;
   — le supplétif des articles R. 2312-8 et R. 2312-9, qui ne s'applique qu'à
     défaut d'accord.

   Le découpage suit la ponctuation du décret :
     N° Rubrique : A-Section : a) Sujet ; -information ; -information ; b) …

   Usage : node bdese.js            mesure la couverture et publie _bdese.json */

const T = require("./textes-bdese.json");

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const texte = n => { const v = T[n]; if (!v || !v.texte) throw new Error(`Article ${n} non lu à la source.`); return net(v.texte); };

/* Le plancher : les thèmes énumérés au troisième alinéa de L. 2312-21, relevés
   dans le texte même plutôt que recopiés. La phrase les sépare par des virgules
   et se termine par « et les conséquences environnementales… ». */
const PLANCHER = (() => {
  const t = texte("L2312-21");
  const m = t.match(/La base de données comporte au moins les thèmes suivants\s*:\s*([^.]+)\./);
  if (!m) throw new Error("Le plancher de L. 2312-21 n'a pas été retrouvé dans le texte.");
  /* La phrase sépare les thèmes par des virgules, et le dernier par « et ».
     Découper sur tous les « et » couperait « les femmes et les hommes » en deux :
     seul le « et » qui suit la dernière virgule est un séparateur. */
  const brut = m[1];
  const derniere = brut.lastIndexOf(",");
  const morceaux = (derniere < 0 ? [brut] :
    brut.slice(0, derniere).split(",").concat(brut.slice(derniere + 1).split(/\s+et\s+(?=l)/)));
  return morceaux.map(x => net(x).replace(/^l['’]|^les |^la |^le /, "")).filter(Boolean);
})();

/* Chaque rubrique du décret est-elle couverte par le plancher ? Le rattachement
   se fait sur les mots du plancher, non sur un numéro : c'est la seule manière
   de rester juste si l'un des deux textes est modifié. */
const MOTS = {
  1: ["investissement social", "investissement matériel et immatériel"],
  2: ["égalité professionnelle entre les femmes et les hommes au sein de l'entreprise"],
  3: ["fonds propres", "endettement"],
  4: ["ensemble des éléments de la rémunération des salariés et dirigeants"],
  5: ["activités sociales et culturelles"],
  6: ["rémunération des financeurs"],
  7: ["flux financiers à destination de l'entreprise"],
  8: [],
  9: [],
  10: ["conséquences environnementales de l'activité de l'entreprise"],
};
const auPlancher = n => (MOTS[n] || []).filter(m =>
  PLANCHER.some(p => p.toLowerCase().includes(m.toLowerCase().slice(0, 28))));

/* ------------------------------------------------------------- le découpage */
function decouper(brut) {
  /* On retire l'en-tête, qui n'est pas du contenu mais l'énoncé du régime. */
  const t = brut.replace(/^.*?comporte (?:les informations suivantes|les informations prévues dans le tableau ci-dessous\.?)\s*:?\s*/i, "");
  const rubriques = [];
  /* Les rubriques : « 1° … » jusqu'au « 2° … » suivant. */
  /* Le numéro d'une rubrique ressemble à un renvoi : « 2° de l'article
     L. 2312-27 » et « 1° A e et f de l'article R. 2312-8 » en sont, et le décret
     en compte plusieurs. Trois marques distinguent le titre du renvoi — il
     commence par une majuscule, il ne cite pas d'article, et il ne contient pas
     de point avant les deux-points qui le ferment. Sans ces trois marques, le
     découpage prenait un renvoi pour une rubrique et en perdait une. */
  const candidat = m => {
    const suite = t.slice(m.index + m[0].length, m.index + m[0].length + 170);
    if (!/^[A-ZÉÈÀ]/.test(suite)) return false;
    const tete = suite.split(/\s*[:;]/)[0];
    return !/article|\./.test(tete);
  };
  const bornes = [];
  for (const m of t.matchAll(/(?:^|\s)(\d{1,2})°\s+/g)) {
    const attendu = bornes.length ? +bornes[bornes.length - 1][1] + 1 : 1;
    if (+m[1] === attendu && candidat(m)) bornes.push(m);
  }
  bornes.forEach((b, i) => {
    const deb = b.index + b[0].length;
    const fin = i + 1 < bornes.length ? bornes[i + 1].index : t.length;
    const corps = net(t.slice(deb, fin));
    const titre = net((corps.match(/^([^:;]{3,140})\s*[:;]/) || [, corps.slice(0, 90)])[1]);
    rubriques.push({ n: +b[1], titre, corps, sections: [] });
  });
  /* Les sections : « A-… », « B-… ». */
  for (const r of rubriques) {
    /* Trois écritures de section cohabitent dans le décret, et n'en connaître
       qu'une revenait à perdre le contenu des autres : « A-Investissement
       social », « I. Indicateurs sur la situation comparée » et, dans la
       rubrique environnementale, « I-Pour les entreprises soumises… ». La
       mesure l'a dit — trois mille sept cent quarante-neuf caractères du seul
       10° de R. 2312-9 tombaient hors du découpage. */
    const sb = [...r.corps.matchAll(/(?:^|\s)((?:[A-Z]|I{1,3}|IV|V|VI{0,3})\s?[-.]\s?)(?=[A-ZÉÈÀ])/g)]
      .map(m => Object.assign(m, { 1: m[1].replace(/[\s\-.]+$/, "") }));
    const zones = sb.length
      ? sb.map((m, i) => ({ lettre: m[1],
          corps: net(r.corps.slice(m.index + m[0].length, i + 1 < sb.length ? sb[i + 1].index : r.corps.length)) }))
      : [{ lettre: null, corps: r.corps.replace(/^[^:]{0,140}:\s*/, "") }];
    /* Ce qui précède la première section n'est pas perdu : il appartient à la
       rubrique elle-même — « montant de la contribution aux activités sociales
       et culturelles », qui vient avant « A-Représentation du personnel ». */
    if (sb.length && sb[0].index > 0) {
      const tete = net(r.corps.slice(0, sb[0].index)).replace(/^[^:]{0,160}:\s*/, "");
      if (tete.length > 3) zones.unshift({ lettre: null, corps: tete });
    }
    for (const z of zones) {
      const titre = net((z.corps.match(/^([^:;]{3,160})\s*[:;]/) || [, z.corps.slice(0, 90)])[1]);
      const sujets = [];
      /* Les sujets : « a) … », « b) … ». */
      /* Les sujets : « a) … », et les alinéas romains minuscules « i-Identification
         des postes d'émissions… » de la rubrique environnementale. */
      const ab = [...z.corps.matchAll(/(?:^|\s)([a-z]\)|i{1,3}v?-|iv-|vi{0,3}-)\s*/g)]
        .map(m => Object.assign(m, { 1: m[1].replace(/[)\-]$/, "") }));
      const parts = ab.length
        ? ab.map((m, i) => ({ lettre: m[1],
            corps: net(z.corps.slice(m.index + m[0].length, i + 1 < ab.length ? ab[i + 1].index : z.corps.length)) }))
        : [{ lettre: null, corps: z.corps }];
      for (const p of parts) {
        /* Les informations : séparées par « ; - » ou par « ; ». */
        const morceaux = p.corps.split(/\s*;\s*/).map(net).filter(x => x && x !== "-");
        const intitule = net((morceaux[0] || "").replace(/^-\s*/, ""));
        sujets.push({ lettre: p.lettre, intitule,
          informations: morceaux.slice(1).map(x => net(x.replace(/^-\s*/, ""))).filter(Boolean) });
      }
      r.sections.push({ lettre: z.lettre, titre, sujets });
    }
    delete r.corps;
  }
  return rubriques;
}

/* La couverture : quelle part du texte se retrouve dans le découpage. Une
   mesure, non une promesse — c'est elle qui dira si le décret a changé de
   ponctuation et si l'extraction doit être reprise. */
const ENTETE = /^.*?comporte (?:les informations suivantes|les informations prévues dans le tableau ci-dessous\.?)\s*:?\s*/i;
/* R. 2312-9 ne se suffit pas à lui-même : il importe deux sujets de R. 2312-8.
   La phrase n'est pas du contenu, c'est un renvoi — mais ce qu'elle importe en
   est, et l'omettre priverait les entreprises d'au moins trois cents salariés
   de la formation professionnelle et des conditions de travail. */
/* Le renvoi se termine par un numéro d'article — « … de l'article R. 2312-8. » —
   dont le point interne trompait la borne : la phrase était coupée après
   « R. », et « 2312-8. » restait sur le carreau. La borne suit donc le numéro. */
const RENVOI = /Elle comporte également les informations relatives.*?article R\.\s*\d+-\d+(?:-\d+)?\.\s*/i;
/* Ce qui reste entre deux extraits, et qui n'est pas du contenu perdu.

   La première mesure annonçait 96,2 % et 96,6 %, et il fallait comprendre ce
   que valaient les 3,8 % restants avant de promettre cent pour cent. Ils ont été
   sortis un à un : ce sont des marqueurs et de la ponctuation — « ; a) »,
   « ; iii- », « ; 2° », « . II. » — c'est-à-dire l'ossature même du découpage.
   Le plus long trou de R. 2312-9, cent soixante et un caractères, est la phrase
   de renvoi vers R. 2312-8, déjà exécutée ailleurs.

   Autrement dit : rien n'était perdu, la mesure était fausse. Elle comptait
   comme reliquat ce que le découpage consomme en tant que structure — comme si
   l'on reprochait à une table des matières de ne pas contenir ses propres
   numéros de page.

   La règle est donc écrite, et STRICTE : un intervalle non extrait ne compte
   comme structure que s'il ne contient rien d'autre que des séparateurs, des
   numérotations et des lettres de rang. Tout le reste demeure un reliquat, il
   est publié tel quel, et il bloque la publication réglementaire. */
const STRUCTURE = /^[\s;:.,)(°-]*(?:(?:\d+°(?:\s*bis)?|[a-z]\)|[ivxIVX]+-|[A-Z]\.|[A-Z]-|I{1,3}\.|\d+\)|[a-z]-|-)[\s;:.,-]*)*$/;
const estStructure = t => STRUCTURE.test(t);

function couverture(brut, rubriques) {
  const dedans = [];
  for (const r of rubriques) {
    dedans.push(r.titre);
    for (const s of r.sections) {
      if (s.titre) dedans.push(s.titre);
      for (const su of s.sujets) { dedans.push(su.intitule); su.informations.forEach(x => dedans.push(x)); }
    }
  }
  /* Compter la longueur des libellés extraits donnait plus de cent pour cent :
     un titre de rubrique est aussi le début du premier sujet, et se comptait
     deux fois. On mesure donc ce que le découpage couvre du texte, en marquant
     les intervalles réellement consommés — une mesure ne vaut que si elle ne
     peut pas dépasser son maximum. */
  const pris = new Uint8Array(brut.length);
  let curseur = 0;
  for (const x of dedans) {
    if (!x) continue;
    let i = brut.indexOf(x, curseur);
    if (i < 0) i = brut.indexOf(x);          /* un titre repris plus haut */
    if (i < 0) continue;
    pris.fill(1, i, i + x.length);
    curseur = Math.max(curseur, i);
  }
  /* L'en-tête énonce le régime — « En l'absence d'accord prévu à l'article
     L. 2312-21, dans les entreprises de moins de trois cents salariés… » — il
     n'est pas du contenu, et il n'a rien à faire au dénominateur : le mesurer
     comme une perte reviendrait à se reprocher de ne pas l'avoir découpé. */
  const tete = (brut.match(ENTETE) || [""])[0].length;
  const renvoi = brut.match(RENVOI);
  if (renvoi) pris.fill(1, renvoi.index, renvoi.index + renvoi[0].length);
  /* Les intervalles restés hors du découpage, classés un à un : structure
     d'un côté — elle est consommée —, reliquat de l'autre — il ne l'est pas.
     Le classement se fait sur le texte lui-même, jamais sur sa longueur. */
  const structure = [], reliquat = [];
  let debut = -1;
  for (let i = tete; i <= pris.length; i++) {
    if (i < pris.length && !pris[i]) { if (debut < 0) debut = i; continue; }
    if (debut < 0) continue;
    const bout = { i: debut, n: i - debut, t: brut.slice(debut, i) };
    (estStructure(bout.t) ? structure : reliquat).push(bout);
    debut = -1;
  }
  structure.forEach(x => pris.fill(1, x.i, x.i + x.n));

  let couverts = 0;
  for (let i = tete; i < pris.length; i++) if (pris[i]) couverts++;
  const contenu = brut.length - tete;
  const perdus = reliquat.reduce((n, x) => n + x.n, 0);
  return { extraits: dedans.length, couverts, entete: tete, contenu,
    renvoi: renvoi ? net(renvoi[0]) : null,
    structure: structure.reduce((n, x) => n + x.n, 0),
    reliquat: perdus,
    fragments: reliquat.sort((a, b) => b.n - a.n).slice(0, 20).map(x => net(x.t)),
    part: +(100 * couverts / contenu).toFixed(1) };
}

/* Chaque libellé extrait doit se retrouver mot pour mot dans le texte : c'est
   la garantie qu'aucune information n'a été reformulée en chemin. */
function fidelite(brut, rubriques) {
  const manquants = [];
  const voir = x => { if (x && !brut.includes(x)) manquants.push(x.slice(0, 70)); };
  for (const r of rubriques) {
    voir(r.titre);
    for (const s of r.sections) { voir(s.titre);
      for (const su of s.sujets) { voir(su.intitule); su.informations.forEach(voir); } }
  }
  return manquants;
}

function construire() {
  const out = {};
  for (const [cle, art, seuil] of [["moins300", "R2312-8", "moins de trois cents salariés"],
                                   ["au moins300", "R2312-9", "au moins trois cents salariés"]]) {
    const brut = texte(art);
    const rubriques = decouper(brut);
    rubriques.forEach(r => { const p = auPlancher(r.n);
      r.plancher = p.length > 0; r.themesPlancher = p; });
    out[cle] = { article: art, version: T[art].id, seuil, rubriques,
      couverture: couverture(brut, rubriques), infidelites: fidelite(brut, rubriques) };
  }
  /* Le renvoi de R. 2312-9 exécuté : les sujets e) et f) du 1° A de R. 2312-8 —
     la formation professionnelle et les conditions de travail — sont ajoutés au
     régime des entreprises d'au moins trois cents salariés, en portant la marque
     de leur origine. Les citer sans les importer aurait laissé un trou de deux
     sujets dans le contenu du régime le plus exigeant. */
  const source = out["moins300"].rubriques.find(r => r.n === 1);
  const cible = out["au moins300"].rubriques.find(r => r.n === 1);
  if (source && cible) {
    const sA = source.sections.find(s => s.lettre === "A");
    const cA = cible.sections.find(s => s.lettre === "A") || cible.sections[0];
    if (sA && cA) for (const lettre of ["e", "f"]) {
      const su = sA.sujets.find(x => x.lettre === lettre);
      if (su && !cA.sujets.some(x => x.intitule === su.intitule))
        cA.sujets.push({ ...su, renvoi: "R. 2312-8, 1° A " + lettre + ")" });
    }
    out["au moins300"].renvois = ["R. 2312-8, 1° A e) — formation professionnelle",
                                  "R. 2312-8, 1° A f) — conditions de travail"];
  }

  return { plancher: PLANCHER, planchierTexte: "L. 2312-21, al. 3",
    planchierVersion: T["L2312-21"].id, contenu: out };
}

module.exports = { construire, decouper, PLANCHER, auPlancher };

if (require.main === module) {
  const b = construire();
  console.log(`plancher de L. 2312-21, al. 3 — ${b.plancher.length} thèmes énumérés :`);
  b.plancher.forEach(t => console.log("   · " + t));
  let ko = 0;
  for (const [cle, d] of Object.entries(b.contenu)) {
    const info = d.rubriques.reduce((n, r) => n + r.sections.reduce((m, s) =>
      m + s.sujets.reduce((k, su) => k + 1 + su.informations.length, 0), 0), 0);
    const hors = d.rubriques.filter(r => !r.plancher).map(r => r.n + "° " + r.titre.slice(0, 40));
    console.log(`\n${d.article} — ${d.seuil} — version ${d.version}`);
    console.log(`  ${d.rubriques.length} rubriques · ${info} informations · couverture ${d.couverture.part} % du texte`);
    console.log(`  hors du plancher, donc supprimables par accord : ${hors.join(" ; ") || "aucune"}`);
    if (d.infidelites.length) { ko += d.infidelites.length;
      console.log(`  ÉCHEC — ${d.infidelites.length} libellé(s) ne se retrouvent pas mot pour mot dans le texte :`);
      d.infidelites.slice(0, 5).forEach(x => console.log("      " + x)); }
  }
  /* Le seuil de publication. Une couverture inférieure à cent pour cent ne dit
     pas que la BDESE est incomplète : elle dit que le découpage ne rend pas
     tout le texte, et qu'il faut le regarder avant de publier. La règle est de
     gouvernance, non de droit — elle est écrite ici pour ne pas être décidée au
     cas par cas, et ce qui reste hors du découpage est nommé, jamais toléré en
     silence. */
  /* Le critère de sortie est cent pour cent, et il bloque. Tout intervalle du
     texte doit être, soit extrait comme contenu, soit reconnu comme structure —
     marqueur, numérotation, séparateur. Le moindre caractère qui n'est ni l'un
     ni l'autre est un reliquat : il est affiché, et la publication échoue. */
  const bas = Object.values(b.contenu).filter(d => d.couverture.reliquat > 0);
  if (bas.length) {
    console.log("\nÉCHEC — le découpage laisse du texte de côté :");
    for (const d of bas) {
      console.log(`  ${d.article} : ${d.couverture.part} % · ${d.couverture.reliquat} caractère(s) hors du découpage`);
      d.couverture.fragments.forEach(f => console.log(`      · ${JSON.stringify(f.slice(0, 120))}`));
      ko++;
    }
  } else {
    for (const d of Object.values(b.contenu))
      console.log(`  ${d.article} : 100 % — ${d.couverture.couverts} caractères, dont ${d.couverture.structure} de structure (marqueurs, numérotations, séparateurs). Reliquat : aucun.`);
  }
  if (b.contenu["au moins300"].renvois)
    console.log("\nrenvois exécutés vers R. 2312-8 : " + b.contenu["au moins300"].renvois.join(" · "));
  fs.writeFileSync(__dirname + "/_bdese.json", JSON.stringify(b, null, 1));
  console.log("\n_bdese.json écrit.");
  if (ko) process.exit(1);
}

});

__def("./controles-bdese.js", function(module, exports, require){
/* Les contrôles de la base de données économiques, sociales et environnementales.

   Ce que ce module fait, et la formulation est stricte parce qu'elle engage :
   il PRÉPARE, STRUCTURE, DOCUMENTE et AUDITE la base. Il ne fournit pas une
   base collaborative accessible simultanément à plusieurs catégories
   d'utilisateurs, et il n'est pas la base : la mise à disposition reste un acte
   de l'employeur, qui se prouve autrement.

   L'ordre des questions est celui du droit, et il ne se contourne pas :

     1. quel régime s'applique — accord d'entreprise, accord de branche,
        supplétif, ou indéterminé ;
     2. à quelle date le contenu devient exigible ;
     3. ce que ce régime commande, thème par thème ;
     4. ce que l'accord ne pouvait pas retirer — le plancher de L. 2312-21, al. 3 ;
     5. la mise à disposition, son support, son actualisation ;
     6. les délais de consultation, qui relèvent d'un AUTRE accord.

   Tant que le régime est indéterminé, aucun contrôle de contenu ne conclut.
   C'est la règle la plus importante du module : auditer un contenu sans savoir
   quel texte le commande, c'est produire des non-conformités inventées. */
const R = require("./regime-bdese.js");
const CONTENU = require("./contenu-bdese.js");
const PL = require("./plancher-bdese.js");
const REC = require("./recevabilite.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const nb = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Le plancher : les dix thèmes que l'accord ne peut pas descendre, relevés dans
   le troisième alinéa de L. 2312-21 et non recopiés. Ce sont LES DIX THÈMES DU
   PLANCHER DE L'ACCORD — à ne pas confondre avec les dix thèmes de la
   consultation sur les orientations stratégiques, la situation économique et la
   politique sociale (L. 2312-36), qui sont dix autres. Le plancher scinde les
   investissements et les fonds propres/endettement, et il laisse tomber la
   sous-traitance (que le décret nomme « partenariats ») et les transferts
   intragroupe : un accord peut donc les supprimer. */
const PLANCHER = PL.PLANCHER;

const themesDeclares = f => Array.isArray((f.base || {}).themes) ? f.base.themes : null;

/* Le garde commun : rien ne se contrôle sur un régime inconnu. */
function siRegimeConnu(f, suite) {
  const r = R.regime(f);
  if (r.regime === R.REGIMES.INDETERMINE) return { etat: MANQ, motif: r.motif };
  return suite(r);
}

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------------- le régime */

ctl("BDESE-CTL-REG-01", "Régime applicable",
  "Le texte qui commande le contenu de la base est-il identifié ?",
  ["L. 2312-21"],
  f => {
    const r = R.regime(f);
    if (r.regime === R.REGIMES.INDETERMINE) return { etat: MANQ, motif: r.motif };
    return { etat: CONF, motif: r.motif };
  });

ctl("BDESE-CTL-REG-02", "Régime applicable",
  "L'accord de branche invoqué peut-il régir cette entreprise ?",
  ["L. 2312-21, dernier alinéa"],
  f => {
    if (!dit(f.accordBranche)) return { etat: SO, motif: "Aucun accord de branche n'est invoqué." };
    const eff = nb(f.effectif);
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné : l'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés." };
    if (dit(f.accordEntreprise))
      return { etat: NC, motif: "Un accord d'entreprise existe : l'accord de branche ne s'applique qu'à défaut d'accord d'entreprise (L. 2312-21, dernier alinéa)." };
    return eff < R.SEUIL_CONTENU
      ? { etat: CONF, motif: `Effectif de ${eff} salariés, inférieur à trois cents, et aucun accord d'entreprise : l'accord de branche peut définir la base.` }
      : { etat: NC, motif: `Effectif de ${eff} salariés. L'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés : ici, c'est le décret qui s'applique, article R. 2312-9.` };
  });

/* --------------------------------------------------------- l'exigibilité */

ctl("BDESE-CTL-DAT-01", "Dates d'exigibilité",
  "La date à laquelle les attributions récurrentes s'exercent est-elle établie ?",
  ["L. 2312-2"],
  f => {
    const eff = nb(f.effectif);
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné." };
    if (eff < R.SEUIL_ATTRIBUTIONS)
      return { etat: SO, motif: `Effectif de ${eff} salariés : les attributions récurrentes, dont la base de données relève, ne s'exercent qu'à partir de cinquante (L. 2312-2). Le comité, lui, se met en place à onze — les deux seuils sont distincts.` };
    const e = R.exigibilite(f);
    if (!e.attributions) return { etat: MANQ, motif: "La date à laquelle l'effectif a atteint cinquante salariés pendant douze mois consécutifs n'est pas renseignée : le point de départ du délai de douze mois de l'article L. 2312-2 est inconnu." };
    if (!e.attributions.date)
      return { etat: RISQ, motif: e.attributions.motif + " " + e.avertissements.join(" ") };
    return e.avertissements.length
      ? { etat: RISQ, motif: e.attributions.motif + " " + e.avertissements.join(" ") }
      : { etat: CONF, motif: e.attributions.motif };
  });

ctl("BDESE-CTL-DAT-02", "Dates d'exigibilité",
  "Le passage au contenu des entreprises de trois cents salariés est-il daté ?",
  ["L. 2312-34"],
  f => {
    const eff = nb(f.effectif);
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné." };
    if (eff < R.SEUIL_CONTENU)
      return { etat: SO, motif: `Effectif de ${eff} salariés : le contenu applicable est celui des entreprises de moins de trois cents salariés.` };
    const e = R.exigibilite(f);
    if (!e.contenu300)
      return { etat: MANQ, motif: e.avertissements.join(" ") || "La date de franchissement du seuil de trois cents salariés n'est pas renseignée." };
    return { etat: CONF, motif: e.contenu300.motif };
  });

/* ------------------------------------------------------------- le contenu */

ctl("BDESE-CTL-CNT-01", "Contenu",
  "Les thèmes du plancher légal figurent-ils tous dans la base ?",
  ["L. 2312-21, al. 3"],
  f => siRegimeConnu(f, () => {
    const t = themesDeclares(f);
    if (t === null) return { etat: MANQ, motif: "Les thèmes que la base comporte ne sont pas renseignés." };
    /* La loi et le décret ne nomment pas les mêmes choses de la même façon :
       la correspondance est déclarée et vérifiée dans plancher-bdese.js, et
       c'est elle qui décide — non une comparaison de libellés mot à mot, qui
       produisait cinq faux manquements sur un dossier complet. */
    const vus = t.map(x => String(x.theme || x));
    const absents = PL.absents(vus);
    return absents.length
      ? { etat: NC, motif: `${absents.length} thème(s) du plancher de l'article L. 2312-21, alinéa 3, ne figurent pas dans la base : ${absents.join(" ; ")}. Ce plancher s'impose à tout accord : « la base de données comporte au moins les thèmes suivants ». Un accord qui les retire est, sur ce point, sans effet.` }
      : { etat: CONF, motif: `Les ${PLANCHER.length} thèmes du plancher de l'article L. 2312-21, alinéa 3, figurent dans la base. Ce sont les dix thèmes du plancher de l'accord — à ne pas confondre avec les dix thèmes de la consultation de l'article L. 2312-36.` };
  }));

ctl("BDESE-CTL-CNT-02", "Contenu",
  "Le contenu supplétif du décret est-il couvert, rubrique par rubrique ?",
  ["R. 2312-8", "R. 2312-9"],
  f => siRegimeConnu(f, r => {
    if (r.regime !== R.REGIMES.SUPPLETIF)
      return { etat: SO, motif: `Le contenu est défini par ${r.regime} : le supplétif du décret ne s'applique pas. Le plancher de l'article L. 2312-21, alinéa 3, reste dû, et il est vérifié à part.` };
    /* Les deux arbres du décret, tels que le découpage les nomme : « moins300 »
       pour R. 2312-8, « au moins300 » pour R. 2312-9. */
    const attendu = CONTENU.construire().contenu[r.article === "R. 2312-9" ? "au moins300" : "moins300"];
    const t = themesDeclares(f);
    if (t === null) return { etat: MANQ, motif: `Les rubriques renseignées ne sont pas déclarées. Le décret en compte ${attendu.rubriques.length} pour l'article ${r.article}.` };
    const vus = t.map(x => PL.net(String(x.theme || x)));
    const absentes = attendu.rubriques.filter(rub => {
      const n = PL.net(rub.titre);
      return !vus.some(v => v.includes(n.slice(0, 20)) || n.includes(v.slice(0, 20)));
    });
    return absentes.length
      ? { etat: NC, motif: `${absentes.length} rubrique(s) de l'article ${r.article} ne sont pas renseignées : ${absentes.map(x => x.titre).join(" ; ")}. En l'absence d'accord, le décret fixe le contenu : ces rubriques sont dues.` }
      : { etat: CONF, motif: `Les ${attendu.rubriques.length} rubriques de l'article ${r.article} sont renseignées.` };
  }));

ctl("BDESE-CTL-CNT-03", "Contenu",
  "Les années couvertes sont-elles les six que le décret impose ?",
  ["R. 2312-10"],
  f => siRegimeConnu(f, r => {
    if (r.regime !== R.REGIMES.SUPPLETIF)
      return { etat: SO, motif: "L'article R. 2312-10 ne vaut qu'en l'absence d'accord ; l'accord applicable définit lui-même les années couvertes." };
    const b = f.base || {};
    const passees = nb(b.anneesPassees), suivantes = nb(b.anneesSuivantes);
    if (passees === null || suivantes === null)
      return { etat: MANQ, motif: "Le nombre d'années passées et d'années suivantes couvertes n'est pas renseigné. Le décret impose l'année en cours, les deux précédentes et les trois suivantes." };
    if (passees < 2 || suivantes < 3)
      return { etat: NC, motif: `La base couvre ${passees} année(s) passée(s) et ${suivantes} année(s) suivante(s). L'article R. 2312-10 impose l'année en cours, les deux précédentes et les trois suivantes.` };
    return { etat: CONF, motif: "L'année en cours, les deux précédentes et les trois suivantes sont couvertes." };
  }));

ctl("BDESE-CTL-CNT-04", "Contenu",
  "Les années à venir sont-elles renseignées, en chiffres ou en grandes tendances ?",
  ["R. 2312-10"],
  f => siRegimeConnu(f, r => {
    if (r.regime !== R.REGIMES.SUPPLETIF)
      return { etat: SO, motif: "L'article R. 2312-10 ne vaut qu'en l'absence d'accord." };
    const b = f.base || {};
    const forme = String(b.formePerspectives || "").toLowerCase();
    if (!forme) return { etat: MANQ, motif: "La forme sous laquelle les trois années suivantes sont renseignées n'est pas déclarée." };
    /* Les grandes tendances suffisent : c'est le texte, et l'exiger en chiffres
       produirait des non-conformités fausses. Ce que le décret exige en plus,
       c'est que l'employeur DISE, en les motivant, les informations qui ne
       peuvent recevoir ni chiffres ni tendances. */
    const admise = /chiffr|tendance|mixte/.test(forme);
    if (!admise)
      return { etat: NC, motif: `Forme déclarée : « ${b.formePerspectives} ». Les trois années suivantes sont présentées sous forme de données chiffrées ou, à défaut, sous forme de grandes tendances (R. 2312-10). Une absence pure et simple n'est pas une de ces deux formes.` };
    if (vide(b.informationsNonRenseignables))
      return { etat: RISQ, motif: `Les perspectives sont renseignées sous forme ${/tendance/.test(forme) ? "de grandes tendances — ce que le décret admet expressément" : "chiffrée"}. Mais l'article R. 2312-10 ajoute une obligation que l'on oublie : l'employeur indique, POUR CES ANNÉES, les informations qui ne peuvent pas faire l'objet de données chiffrées ou de grandes tendances, ET les raisons qu'il en donne. Rien n'est déclaré à ce titre : soit tout est renseignable, et il faut pouvoir le dire, soit la liste manque.` };
    return { etat: CONF, motif: `Perspectives renseignées sous forme ${/tendance/.test(forme) ? "de grandes tendances, ce que l'article R. 2312-10 admet pour les années suivantes" : "chiffrée"}, et les informations qui ne peuvent recevoir ni chiffres ni tendances sont indiquées avec leurs raisons.` };
  }));

/* -------------------------------------------------- la mise à disposition */

ctl("BDESE-CTL-MAD-01", "Mise à disposition",
  "La base est-elle accessible en permanence aux personnes qui y ont droit ?",
  ["L. 2312-18"],
  f => {
    const b = f.base || {};
    if (vide(b.support)) return { etat: MANQ, motif: "Le support de la base n'est pas renseigné." };
    if (vide(b.beneficiaires)) return { etat: MANQ, motif: "Les personnes ayant accès à la base ne sont pas renseignées." };
    const q = Array.isArray(b.beneficiaires) ? b.beneficiaires.map(x => String(x).toLowerCase()) : [String(b.beneficiaires).toLowerCase()];
    const attendus = [["membres du comité", /comit|élu|titulaire|suppléant/], ["délégués syndicaux", /syndica/]];
    const absents = attendus.filter(a => !q.some(x => a[1].test(x))).map(a => a[0]);
    return absents.length
      ? { etat: RISQ, motif: `L'accès n'est pas déclaré pour : ${absents.join(", ")}. L'article L. 2312-18 met la base à disposition des membres de la délégation du personnel du comité et des délégués syndicaux. L'accord peut organiser les droits d'accès, non les supprimer.` }
      : { etat: CONF, motif: `Base accessible sur support « ${b.support} », aux membres du comité et aux délégués syndicaux.` };
  });

ctl("BDESE-CTL-MAD-02", "Mise à disposition",
  "L'actualisation de la base est-elle organisée et tracée ?",
  ["L. 2312-18", "L. 2312-21, 2°"],
  f => {
    const b = f.base || {};
    if (vide(b.dateDerniereMiseAJour)) return { etat: MANQ, motif: "La date de la dernière mise à jour n'est pas renseignée. Une base est un support permanent : sa fraîcheur est le premier reproche fait en séance." };
    if (vide(f.dateAudit)) return { etat: MANQ, motif: "La date de l'audit n'est pas renseignée : l'ancienneté de la mise à jour ne peut pas être mesurée." };
    const mois = R.moisEntre(b.dateDerniereMiseAJour, f.dateAudit);
    if (mois === null) return { etat: MANQ, motif: "Les dates ne sont pas exploitables." };
    if (mois > 12)
      return { etat: NC, motif: `Dernière mise à jour il y a ${mois} mois (${b.dateDerniereMiseAJour}). Les informations portent sur l'année en cours : une base non actualisée depuis plus d'un an ne les porte plus.` };
    return mois > 6
      ? { etat: RISQ, motif: `Dernière mise à jour il y a ${mois} mois. Aucun texte ne fixe de périodicité générale, mais une base qui n'a pas bougé depuis six mois soutient mal l'affirmation qu'elle porte l'année en cours.` }
      : { etat: CONF, motif: `Base mise à jour le ${b.dateDerniereMiseAJour}, soit il y a ${mois} mois.` };
  });

ctl("BDESE-CTL-MAD-03", "Mise à disposition",
  "L'information des bénéficiaires de chaque mise à jour est-elle prouvée ?",
  ["R. 2312-5", "R. 2312-7"],
  f => {
    const b = f.base || {};
    if (vide(b.informationMiseAJour))
      return { etat: MANQ, motif: "Il n'est pas déclaré si les bénéficiaires sont informés de l'actualisation de la base." };
    if (nie(b.informationMiseAJour))
      return { etat: NC, motif: "Les bénéficiaires ne sont pas informés des mises à jour. C'est cette information qui fait courir le délai de consultation (R. 2312-5) : sans elle, le délai ne court pas, et l'avis ne peut pas être réputé rendu." };
    return { etat: CONF, motif: "Les bénéficiaires sont informés de l'actualisation. C'est cette information — ou la communication des informations — qui fait courir le délai de consultation (R. 2312-5)." };
  });

/* --------------------------------------------------- les consultations */

ctl("BDESE-CTL-CSL-01", "Consultations",
  "L'accord sur la périodicité des consultations est-il distinct de l'accord sur la base ?",
  ["L. 2312-19", "L. 2312-21"],
  f => {
    if (vide(f.accordPeriodiciteConsultations))
      return { etat: MANQ, motif: "Il n'est pas déclaré si un accord fixe le contenu, la périodicité et les modalités des consultations récurrentes. Ce n'est pas le même accord que celui qui définit la base : l'un relève de l'article L. 2312-19, l'autre de l'article L. 2312-21, et un accord sur la base ne déplace pas la périodicité des consultations." };
    if (nie(f.accordPeriodiciteConsultations))
      return { etat: CONF, motif: "Aucun accord ne fixe la périodicité des consultations : les trois consultations récurrentes sont annuelles, selon le régime supplétif." };
    const p = nb(f.periodiciteConsultations);
    if (p === null) return { etat: MANQ, motif: "Un accord est déclaré mais la périodicité qu'il fixe n'est pas renseignée." };
    return p > 3
      ? { etat: NC, motif: `Périodicité de ${p} ans. L'article L. 2312-19, dernier alinéa, la plafonne à trois ans : au-delà, la stipulation est sans effet.` }
      : { etat: CONF, motif: `Périodicité de ${p} an(s), dans la limite de trois ans que fixe l'article L. 2312-19.` };
  });

ctl("BDESE-CTL-CSL-02", "Consultations",
  "Le nombre de réunions annuelles que l'accord prévoit atteint-il le minimum ?",
  ["L. 2312-19, 2°"],
  f => {
    if (!dit(f.accordPeriodiciteConsultations))
      return { etat: SO, motif: "Aucun accord ne fixe le nombre de réunions : le régime supplétif s'applique." };
    const n = nb(f.reunionsAnnuellesAccord);
    if (n === null) return { etat: MANQ, motif: "Le nombre de réunions annuelles prévu par l'accord n'est pas renseigné." };
    return n < 6
      ? { etat: NC, motif: `${n} réunions annuelles. L'accord ne peut en prévoir moins de six (L. 2312-19, 2°).` }
      : { etat: CONF, motif: `${n} réunions annuelles, au moins six comme l'exige l'article L. 2312-19, 2°.` };
  });

ctl("BDESE-CTL-CSL-03", "Consultations",
  "Le délai dans lequel l'avis est réputé rendu est-il connu et tenu ?",
  ["R. 2312-5", "R. 2312-6"],
  f => {
    const d = R.delaiConsultation(f);
    if (!d.connu) return { etat: RISQ, motif: d.motif };
    if (!d.depart)
      return { etat: MANQ, motif: `${d.motif} La date de mise à disposition — ou de communication — n'est pas renseignée : le point de départ du délai est inconnu.` };
    const avis = (f.consultation || {}).dateAvis;
    if (vide(avis))
      return { etat: RISQ, motif: `${d.motif} Aucun avis n'est enregistré : à ce terme, le comité sera réputé consulté ET AVOIR RENDU UN AVIS NÉGATIF — ce qui n'est pas un silence neutre.` };
    return avis <= d.terme
      ? { etat: CONF, motif: `Avis rendu le ${avis}, dans le délai de ${d.mois} mois expirant le ${d.terme}.` }
      : { etat: RISQ, motif: `Avis daté du ${avis}, postérieur au terme du ${d.terme}. Passé ce terme, le comité était déjà réputé avoir rendu un avis négatif (R. 2312-6, I).` };
  });

/* ----------------------------------------------- l'établissement distinct */

ctl("BDESE-CTL-ETB-01", "Établissements distincts",
  "Le niveau auquel la base est mise en place est-il fixé ?",
  ["L. 2312-21, 2°", "L. 2316-1"],
  f => {
    if (vide(f.etablissementsDistincts))
      return { etat: MANQ, motif: "Il n'est pas déclaré si l'entreprise comporte plusieurs établissements distincts. Le niveau de mise en place de la base en dépend." };
    if (nie(f.etablissementsDistincts))
      return { etat: SO, motif: "L'entreprise ne comporte pas d'établissement distinct : la base est mise en place au niveau de l'entreprise." };
    const n = (f.base || {}).niveau;
    if (vide(n))
      return { etat: MANQ, motif: "L'entreprise comporte des établissements distincts, mais le niveau auquel la base est mise en place n'est pas renseigné. C'est l'accord de l'article L. 2312-21 qui le fixe (2° : « le niveau de mise en place de la base dans les entreprises comportant des établissements distincts »)." };
    return { etat: CONF, motif: `Base mise en place au niveau : ${n}. Lorsque la consultation se déroule à la fois au niveau du comité central et de comités d'établissement, l'avis de chaque établissement est rendu au plus tard sept jours avant le terme applicable au comité central (R. 2312-6, II).` };
  });

/* ------------------------------------------------------------ la cohérence */

const COHERENCE = ["BDESE-CTL-COH-01"];
ctl("BDESE-CTL-COH-01", "Cohérence",
  "Le régime déclaré s'accorde-t-il avec les pièces versées ?",
  ["L. 2312-21"],
  f => {
    const r = R.regime(f);
    if (r.regime === R.REGIMES.INDETERMINE) return { etat: MANQ, motif: r.motif };
    const P = Array.isArray(f.pieces) ? f.pieces : [];
    const aAccord = P.some(p => /accord/i.test(String(p.type || p.nom || "")));
    if (r.regime === R.REGIMES.SUPPLETIF && aAccord)
      return { etat: NC, motif: "Le régime retenu est le supplétif du décret, mais un accord figure parmi les pièces versées. L'un des deux est faux : soit l'accord définit la base et le régime n'est pas le supplétif, soit il porte sur autre chose et ne devrait pas être versé ici." };
    if (r.regime !== R.REGIMES.SUPPLETIF && !aAccord)
      return { etat: NC, motif: `Le régime retenu est ${r.regime}, mais aucun accord ne figure parmi les pièces versées. Un régime conventionnel se prouve par son texte.` };
    return { etat: CONF, motif: `Régime retenu : ${r.regime}, et les pièces versées le portent.` };
  });

/* Les contrôles de détection ne concluent jamais à la conformité. Ici, un seul :
   ce que l'application ne peut pas prouver — que la base a effectivement été
   mise à la disposition du comité. Elle constitue le contenu ; la mise à
   disposition est un acte de l'employeur, qui se prouve autrement. */
const DETECTION = ["BDESE-CTL-PRV-01"];
ctl("BDESE-CTL-PRV-01", "Preuve",
  "La mise à disposition effective peut-elle être prouvée ?",
  ["L. 2312-18"],
  f => {
    const b = f.base || {};
    const elements = [
      !vide(b.support) && `support déclaré : ${b.support}`,
      !vide(b.dateDerniereMiseAJour) && `dernière mise à jour : ${b.dateDerniereMiseAJour}`,
      dit(b.informationMiseAJour) && "information des bénéficiaires déclarée",
      !vide(b.preuveAcces) && `trace d'accès : ${b.preuveAcces}`,
    ].filter(Boolean);
    if (!elements.length)
      return { etat: MANQ, motif: "Aucun élément ne documente la mise à disposition." };
    return { etat: RISQ, elements,
      motif: `Éléments réunis : ${elements.join(" ; ")}. Ce module constitue, structure, date et audite le contenu de la base — il ne la met pas à disposition et n'est pas la base. La mise à disposition reste un acte de l'employeur : elle se prouve par le support lui-même, ses traces d'accès et l'information donnée aux bénéficiaires. L'application ne peut pas en attester à votre place, et elle ne le fera pas.` };
  });

REC.surSilence(C, ["BDESE-CTL-REG-01"]);

module.exports = { C, ETATS, DETECTION, COHERENCE, PLANCHER };

if (require.main === module) {
  console.log(`${C.length} contrôles · plancher de ${PLANCHER.length} thèmes`);
  const rub = {};
  for (const c of C) (rub[c.rubrique] = rub[c.rubrique] || []).push(c.id);
  for (const r of Object.keys(rub)) console.log(`  ${r} — ${rub[r].length} : ${rub[r].join(", ")}`);
  const sansTexte = C.filter(c => !c.fondement || !c.fondement.length);
  if (sansTexte.length) { console.error("Contrôles sans fondement : " + sansTexte.map(c => c.id).join(", ")); process.exit(1); }
  console.log(`dont détection ${DETECTION.length}, cohérence ${COHERENCE.length} — tous fondés sur un article`);
}

});

__def("./plancher-bdese.js", function(module, exports, require){
/* Le plancher légal, et la manière dont il se retrouve dans le décret.

   La loi et le décret ne nomment pas les mêmes choses de la même façon, et
   c'est le piège de ce module. Le plancher de l'article L. 2312-21, alinéa 3,
   énumère « l'investissement social » et « l'investissement matériel et
   immatériel » ; le décret, lui, réunit les deux sous une rubrique
   « Investissements » et les distingue en sections. Un contrôle qui
   comparerait les libellés mot à mot conclurait que le plancher n'est pas
   couvert alors qu'il l'est — cinq faux manquements sur un dossier parfait, ce
   qui s'est produit à la première écriture.

   La correspondance est donc déclarée ici, et VÉRIFIÉE : chaque intitulé cité
   comme équivalent doit exister dans le découpage du décret, en rubrique ou en
   section. S'il n'existe pas — parce que le décret a changé —, le module refuse
   de se charger. Une table de correspondance qui dérive en silence est pire que
   pas de table du tout. */
const CONTENU = require("./contenu-bdese.js");

/* Sans accents, sans casse, sans ponctuation : « Egalité » et « égalité »
   désignent la même chose, et le décret écrit les deux. */
const net = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/* Ce que le décret nomme, rubriques et sections réunies. */
const INTITULES = (() => {
  const b = CONTENU.construire().contenu;
  const out = [];
  for (const cle of Object.keys(b))
    for (const r of b[cle].rubriques) {
      out.push({ titre: r.titre, niveau: "rubrique", parent: null, arbre: cle });
      for (const s of r.sections) out.push({ titre: s.titre, niveau: "section", parent: r.titre, arbre: cle });
    }
  return out;
})();

/* La rubrique qui contient un intitulé donné : déclarer « Investissements »
   couvre l'investissement social et l'investissement matériel et immatériel,
   que le décret range en sections sous cette rubrique. La filiation est lue
   dans le découpage, non écrite à la main. */
function parentsDe(intitule) {
  const n = net(intitule);
  return [...new Set(INTITULES
    .filter(x => net(x.titre) === n || net(x.titre).startsWith(n.slice(0, 24)))
    .map(x => x.parent).filter(Boolean))];
}

const existe = intitule => INTITULES.some(x => net(x.titre).startsWith(net(intitule).slice(0, 24))
  || net(intitule).startsWith(net(x.titre).slice(0, 24)));

/* Pour chaque thème du plancher, les intitulés du décret qui le portent. Le
   thème est cité tel que la loi l'écrit ; l'équivalent tel que le décret
   l'écrit. */
const CORRESPONDANCE = [
  { plancher: "investissement social", decret: ["Investissement social"] },
  { plancher: "investissement matériel et immatériel", decret: ["Investissement matériel et immatériel"] },
  { plancher: "égalité professionnelle entre les femmes et les hommes au sein de l'entreprise",
    decret: ["Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise"] },
  { plancher: "fonds propres", decret: ["Fonds propres, endettement et impôts"] },
  { plancher: "endettement", decret: ["Fonds propres, endettement et impôts"] },
  { plancher: "ensemble des éléments de la rémunération des salariés et dirigeants",
    decret: ["Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments"] },
  { plancher: "activités sociales et culturelles", decret: ["Activités sociales et culturelles"] },
  { plancher: "rémunération des financeurs", decret: ["Rémunération des financeurs, en dehors des éléments mentionnés au 4°"] },
  { plancher: "flux financiers à destination de l'entreprise", decret: ["Flux financiers à destination de l'entreprise"] },
  { plancher: "conséquences environnementales de l'activité de l'entreprise", decret: ["Environnement"] },
];

/* La vérification, au chargement : la table ne peut pas mentir longtemps. */
const PLANCHER = CONTENU.PLANCHER;
(() => {
  const ecarts = [];
  for (const t of PLANCHER)
    if (!CORRESPONDANCE.some(c => net(c.plancher) === net(t)))
      ecarts.push(`Le thème « ${t} » du plancher n'a pas de correspondance déclarée.`);
  for (const c of CORRESPONDANCE) {
    if (!PLANCHER.some(t => net(t) === net(c.plancher)))
      ecarts.push(`« ${c.plancher} » est déclaré comme thème du plancher, mais L. 2312-21, al. 3, ne le porte pas.`);
    for (const d of c.decret)
      if (!existe(d)) ecarts.push(`« ${d} » est cité comme intitulé du décret, mais le découpage ne le contient pas.`);
  }
  if (ecarts.length) throw new Error("Plancher et décret ont divergé :\n  " + ecarts.join("\n  "));
})();

/* Un thème du plancher est-il couvert par ce que l'utilisateur a déclaré ? Il
   l'est si le libellé de la loi s'y retrouve, ou celui du décret. */
function couvert(theme, declares) {
  const d = declares.map(net);
  const c = CORRESPONDANCE.find(x => net(x.plancher) === net(theme));
  /* Le thème est couvert par son libellé légal, par l'intitulé du décret qui le
     porte, ou par la rubrique du décret qui contient cet intitulé. */
  const equivalents = c ? c.decret : [];
  const formes = [theme].concat(equivalents).concat(equivalents.flatMap(parentsDe));
  return formes.some(fo => {
    const n = net(fo);
    return d.some(x => x.includes(n) || n.includes(x) || x.startsWith(n.slice(0, 20)));
  });
}

function absents(declares) {
  return PLANCHER.filter(t => !couvert(t, declares || []));
}

module.exports = { PLANCHER, CORRESPONDANCE, couvert, absents, net, INTITULES, parentsDe };

if (require.main === module) {
  console.log(`${PLANCHER.length} thèmes au plancher · ${INTITULES.length} intitulés dans le décret · correspondance vérifiée`);
  for (const c of CORRESPONDANCE) console.log(`  ${c.plancher}\n     → ${c.decret.join(" ; ")}`);
}

});

__def("./recevabilite.js", function(module, exports, require){
/* Un verdict ne se prononce pas sur une donnée qui ne peut pas exister.

   Chaque module valide déjà ses entrées et le dit dans un contrôle dédié. Cela
   ne suffisait pas : le contrôle de recevabilité criait, et les trente-sept
   autres continuaient de conclure. Une notification datée du 30 février
   produisait encore deux conformités ; un effectif de -50, puis de 299,6,
   produisaient encore des verdicts. Le rapport contenait donc, dans la même
   page, l'affirmation que la donnée est impossible et des conclusions tirées
   d'elle.

   La règle appliquée ici est plus simple que les exceptions qu'il faudrait
   écrire sans elle : un contrôle qui a lu un champ illisible n'a rien constaté.
   Son verdict devient « donnée manquante » — la donnée n'est pas absente, elle
   est inexploitable, ce qui revient au même pour la conclusion — et le motif
   dit lequel des champs lus est en cause. Le contrôle de recevabilité, lui,
   garde son « non conforme » : c'est lui qui porte l'anomalie, et il bloque.

   Comment savoir ce qu'un contrôle a lu, sans le deviner ? En l'observant. La
   fiche est enveloppée dans un Proxy le temps de l'exécution, et l'on relève
   les champs réellement touchés — f.nom, f["nom"] et la déstructuration
   comprises. Aucune liste tenue à la main, donc rien qui puisse dériver. */

const MANQ = "donnée manquante", CONF = "conforme", RISQ = "risque à vérifier", SO = "sans objet";
const CONCLUSIFS = new Set([CONF, "non conforme"]);

/* Remplacer la fonction d'un contrôle sans la rendre illisible.

   Le registre et le questionnaire déduisent les champs lus en inspectant le
   texte de la fonction. Une enveloppe qui masque ce texte casserait la
   garantie de non-divergence — la première tentative l'a fait, et trois
   contre-épreuves l'ont dit aussitôt. L'enveloppe rend donc, quand on
   l'imprime, le texte de la fonction qu'elle enveloppe. */
function remplacer(ctl, fn) {
  const brut = ctl.verdict;
  const source = typeof brut.toString === "function" ? brut.toString() : String(brut);
  Object.defineProperty(fn, "toString", { value: () => source, writable: true, configurable: true });
  ctl.brut = ctl.brut || brut;
  ctl.verdict = fn;
  return brut;
}

/* Le champ de premier niveau : « consultation.dateAvis » est lu à travers
   « consultation », qui est le nom que la sonde voit passer. */
const racine = champ => String(champ).split(".")[0];

function envelopper(controles, valider, exemptes) {
  const hors = new Set(exemptes || []);
  for (const ctl of controles) {
    if (hors.has(ctl.id)) continue;
    const brut = remplacer(ctl, function (f) {
      /* Seules les anomalies de lisibilité font taire un contrôle. Une
         contradiction entre deux valeurs bien formées ne l'empêche pas de
         conclure : elle est précisément ce qu'il a pour objet de constater. */
      const anomalies = (() => { try { return (valider(f) || [])
        .filter(a => (a.nature || "lisibilité") === "lisibilité"); } catch (e) { return []; } })();
      if (!anomalies.length) return brut(f);
      const lus = new Set();
      const p = new Proxy(f, {
        get(c, k) { if (typeof k === "string") lus.add(k); return c[k]; },
        has(c, k) { if (typeof k === "string") lus.add(k); return k in c; },
        getOwnPropertyDescriptor(c, k) {
          if (typeof k === "string") lus.add(k);
          return Reflect.getOwnPropertyDescriptor(c, k);
        },
      });
      const v = brut(p);
      if (!v || !CONCLUSIFS.has(v.etat)) return v;
      const touchees = anomalies.filter(a => lus.has(racine(a.champ)));
      if (touchees.length)
        return { etat: MANQ, illisible: true,
          motif: `Ce contrôle a lu ${touchees.length > 1 ? "des données inexploitables" : "une donnée inexploitable"} : `
            + touchees.map(a => `${a.champ} = « ${a.valeur} » — ${a.motif}`).join(" ; ")
            + ". Aucune conclusion n'en est tirée, dans aucun sens. Corrigez la saisie et relancez l'audit ; le constat qu'aurait rendu ce contrôle est sans valeur tant que la donnée n'existe pas." };
      /* Le contrôle n'a lu aucune des données fautives : son constat tient par
         lui-même. Il ne peut pas pour autant valoir conformité — le document
         se lit d'un bloc, et une page qui affirme qu'une donnée est impossible
         ne peut pas en présenter une autre comme acquise. Le manquement
         constaté, lui, reste constaté : une non-conformité n'est pas effacée
         par une erreur de saisie ailleurs dans le dossier. */
      if (v.etat !== CONF) return v;
      return { etat: RISQ, dossierDouteux: true,
        motif: `${v.motif} Ce constat ne dépend d'aucune des ${anomalies.length} donnée(s) impossible(s) que porte le dossier, mais il ne peut pas être tenu pour acquis tant qu'elles n'ont pas été corrigées : un dossier dont une partie des valeurs ne peut pas exister ne se lit pas par morceaux.` };
    });
  }
  return controles;
}

/* ------------------------------------------------------------ le silence

   Un contrôle qui se déclare « sans objet » ferme la question : il affirme que
   l'exigence ne s'applique pas. Or beaucoup se fermaient sur rien — « l'entreprise
   n'appartient à aucun groupe », « aucune élection en cours », « l'entreprise ne
   comporte pas plusieurs établissements distincts » — alors que la fiche ne
   disait rien du groupe, des élections ni des établissements. Sur un dossier
   entièrement vide, quarante-quatre contrôles des deux modules affirmaient ainsi
   des faits que personne n'avait déclarés.

   C'est la règle du dépôt appliquée à un état de plus : une donnée non
   renseignée ne produit jamais « conforme », et elle ne doit pas davantage
   produire « sans objet ». Le silence n'est pas une réponse — ni dans un sens,
   ni dans l'autre.

   La mesure est la même que pour la recevabilité : on observe l'exécution. Si le
   contrôle a conclu « sans objet » sans qu'aucun des champs qu'il a lus ne soit
   déclaré sur la fiche, sa conclusion ne repose sur rien et devient « donnée
   manquante ». S'il a lu ne serait-ce qu'un champ renseigné — un effectif de
   vingt, qui écarte une obligation due à cinquante — le « sans objet » tient. */
function surSilence(controles, exemptes) {
  const hors = new Set(exemptes || []);
  for (const ctl of controles) {
    if (hors.has(ctl.id)) continue;
    const brut = remplacer(ctl, function (f) {
      const lus = new Set();
      const p = new Proxy(f, {
        get(c, k) { if (typeof k === "string") lus.add(k); return c[k]; },
        has(c, k) { if (typeof k === "string") lus.add(k); return k in c; },
        getOwnPropertyDescriptor(c, k) {
          if (typeof k === "string") lus.add(k);
          return Reflect.getOwnPropertyDescriptor(c, k);
        },
      });
      const v = brut(p);
      if (!v || v.etat !== SO) return v;
      const declares = [...lus].filter(k =>
        Object.prototype.hasOwnProperty.call(f, k) && f[k] !== undefined);
      if (declares.length) return v;
      const attendus = [...lus].filter(k => !/^(then|constructor|toJSON|inspect|Symbol)/.test(k));
      return { etat: MANQ, surSilence: true,
        motif: `Ce contrôle s'écarterait de lui-même — « ${v.motif} » — mais aucune des données sur lesquelles il se fonde n'est renseignée${attendus.length ? " : " + attendus.join(", ") : ""}. Le silence n'est pas une réponse : renseignez-les, ou déclarez expressément qu'il n'y a rien à déclarer.` };
    });
  }
  return controles;
}

module.exports = { envelopper, surSilence, remplacer, racine };

});

__def("./textes-bdese.json", function(module){ module.exports = {
 "L2312-2": {
  "id": "LEGIARTI000035650754",
  "texte": "Lorsque, postérieurement à la mise en place du comité social et économique, l'effectif de l'entreprise atteint au moins cinquante salariés pendant douze mois consécutifs, le comité exerce l'ensemble des attributions récurrentes d'information et de consultation définies par la section 3 à l'expiration d'un délai de douze mois à compter de la date à laquelle le seuil de 50 salariés a été atteint pendant douze mois consécutifs. Dans le cas où, à l'expiration de ce délai de douze mois, le mandat du comité restant à courir est inférieur à un an, ce délai court à compter de son renouvellement. Lorsque l'entreprise n'est pas pourvue d'un comité social et économique, dans le cas où l'effectif de l'entreprise atteint au moins cinquante salariés pendant douze mois consécutifs, le comité exerce l'ensemble des attributions définies par la section 3 à l'expiration d'un délai d'un an à compter de sa mise en place.",
  "elargi": true
 },
 "L2312-8": {
  "id": "LEGIARTI000043975196",
  "texte": "I. - Le comité social et économique a pour mission d'assurer une expression collective des salariés permettant la prise en compte permanente de leurs intérêts dans les décisions relatives à la gestion et à l'évolution économique et financière de l'entreprise, à l'organisation du travail, à la formation professionnelle et aux techniques de production, notamment au regard des conséquences environnementales de ces décisions. II. - Le comité est informé et consulté sur les questions intéressant l'organisation, la gestion et la marche générale de l'entreprise, notamment sur: 1° Les mesures de nature à affecter le volume ou la structure des effectifs ; 2° La modification de son organisation économique ou juridique ; 3° Les conditions d'emploi, de travail, notamment la durée du travail, et la formation professionnelle ; 4° L'introduction de nouvelles technologies, tout aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail ; 5° Les mesures prises en vue de faciliter la mise, la remise ou le maintien au travail des accidentés du travail, des invalides de guerre, des invalides civils, des personnes atteintes de maladies chroniques évolutives et des travailleurs handicapés, notamment sur l'aménagement des postes de travail. III. - Le comité est informé et consulté sur les conséquences environnementales des mesures mentionnées au II du présent article. IV. - Le comité social et économique mis en place dans les entreprises d'au moins cinquante salariés exerce également les attributions prévues à la section 2.",
  "elargi": true
 },
 "L2312-14": {
  "id": "LEGIARTI000036262404",
  "texte": "Les décisions de l'employeur sont précédées de la consultation du comité social et économique, sauf, en application de l'article L. 2312-49 , avant le lancement d'une offre publique d'acquisition. Les projets d'accord collectif, leur révision ou leur dénonciation ne sont pas soumis à la consultation du comité. Les entreprises ayant conclu un accord relatif à la gestion prévisionnelle des emplois et des compétences ne sont pas soumises, dans ce domaine, à l'obligation de consultation du comité social et économique.",
  "elargi": true
 },
 "L2312-15": {
  "id": "LEGIARTI000038791194",
  "texte": "Le comité social et économique émet des avis et des vœux dans l'exercice de ses attributions consultatives. Il dispose à cette fin d'un délai d'examen suffisant et d'informations précises et écrites transmises ou mises à disposition par l'employeur, et de la réponse motivée de l'employeur à ses propres observations. Il a également accès à l'information utile détenue par les administrations publiques et les organismes agissant pour leur compte, conformément aux dispositions légales relatives à l'accès aux documents administratifs. Le comité peut, s'il estime ne pas disposer d'éléments suffisants, saisir le président du tribunal judiciaire statuant selon la procédure accélérée au fond, pour qu'il ordonne la communication par l'employeur des éléments manquants. Cette saisine n'a pas pour effet de prolonger le délai dont dispose le comité pour rendre son avis. Toutefois, en cas de difficultés particulières d'accès aux informations nécessaires à la formulation de l'avis motivé du comité, le juge peut décider la prolongation du délai prévu au deuxième alinéa. L'employeur rend compte, en la motivant, de la suite donnée aux avis et vœux du comité.",
  "elargi": true
 },
 "L2312-17": {
  "id": "LEGIARTI000051559706",
  "texte": "Le comité social et économique est consulté dans les conditions définies à la présente section sur : 1° Les orientations stratégiques de l'entreprise ; 2° La situation économique et financière de l'entreprise ; 3° La politique sociale de l'entreprise, les conditions de travail et l'emploi. Au cours de ces consultations, le comité est informé des conséquences environnementales de l'activité de l'entreprise. Au cours de l'une au moins de ces consultations, au choix de l'employeur, le comité est consulté sur les informations en matière de durabilité prévues aux articles L. 232-6-3 et L. 233-28-4 du code du commerce et sur les moyens de les obtenir et de les vérifier, dès lors que l'entreprise remplit l'une des conditions suivantes : 1° Elle est soumise à l'obligation prévue au I de l' article L. 232-6-3 du code du commerce ou dispensée son application conformément au second alinéa du V de ce même article ; 2° Elle est soumise à l'obligation prévue au I de l' article L. 233-28-4 du code du commerce ou dispensée de son application conformément au V de ce même article.",
  "elargi": true
 },
 "L2312-18": {
  "id": "LEGIARTI000052437125",
  "texte": "Une base de données économiques, sociales et environnementales rassemble l'ensemble des informations nécessaires aux consultations et informations récurrentes que l'employeur met à disposition du comité social et économique. Ces informations comportent en particulier l'ensemble des indicateurs relatifs à l'égalité professionnelle entre les femmes et les hommes, notamment sur les écarts de rémunération et de répartition entre les femmes et les hommes parmi les cadres dirigeants et les membres des instances dirigeantes définies à l' article L. 23-12-1 du code de commerce , et les informations sur la méthodologie et le contenu des indicateurs prévus à l'article L. 1142-8 du présent code. Ces informations comportent également un bilan de la mise en œuvre des actions de formation entreprises à l'issue des entretiens mentionnés à l' article L. 6315-1 ou des périodes de reconversion mentionnées à l' article L. 6324-1 . Les éléments d'information transmis de manière récurrente au comité sont mis à la disposition de leurs membres dans la base de données et cette mise à disposition actualisée vaut communication des rapports et informations au comité, dans les conditions et limites fixées par un décret en Conseil d'Etat. Lorsque les dispositions du présent code prévoient également la transmission à l'autorité administrative des rapports et informations mentionnés au troisième alinéa, les éléments d'information qu'ils contiennent sont mis à la disposition de l'autorité administrative à partir de la base de données et la mise à disposition actualisée vaut transmission à cette autorité.",
  "elargi": true
 },
 "L2312-19": {
  "id": "LEGIARTI000036262394",
  "texte": "Un accord d'entreprise, conclu dans les conditions prévues au premier alinéa de l'article L. 2232-12 ou, en l'absence de délégué syndical, un accord entre l'employeur et le comité social et économique, adopté à la majorité des membres titulaires de la délégation du personnel du comité, peut définir : 1° Le contenu, la périodicité et les modalités des consultations récurrentes du comité social et économique mentionnées à l'article L. 2312-17 ainsi que la liste et le contenu des informations nécessaires à ces consultations ; 2° Le nombre de réunions annuelles du comité prévues à l'article L. 2315-27 , qui ne peut être inférieur à six ; 3° Les niveaux auxquels les consultations sont conduites et, le cas échéant, leur articulation ; 4° Les délais mentionnés à l'article L. 2312-15 dans lesquels les avis du comité sont rendus. Il peut également prévoir la possibilité pour le comité social et économique d'émettre un avis unique portant sur tout ou partie des thèmes de consultation prévus à l'article L. 2312-17. La périodicité des consultations prévue par l'accord ne peut être supérieure à trois ans.",
  "elargi": true
 },
 "L2312-21": {
  "id": "LEGIARTI000043975329",
  "texte": "Un accord d'entreprise conclu dans les conditions prévues au premier alinéa de l'article L. 2232-12 ou, en l'absence de délégué syndical, un accord entre l'employeur et le comité social et économique, adopté à la majorité des membres titulaires de la délégation du personnel du comité, définit : 1° L'organisation, l'architecture et le contenu de la base de données économiques, sociales et environnementales ; 2° Les modalités de fonctionnement de la base de données économiques, sociales et environnementales, notamment les droits d'accès et le niveau de mise en place de la base dans les entreprises comportant des établissements distincts, son support, ses modalités de consultation et d'utilisation. La base de données comporte au moins les thèmes suivants : l'investissement social, l'investissement matériel et immatériel, l'égalité professionnelle entre les femmes et les hommes au sein de l'entreprise, les fonds propres, l'endettement, l'ensemble des éléments de la rémunération des salariés et dirigeants, les activités sociales et culturelles, la rémunération des financeurs, les flux financiers à destination de l'entreprise et les conséquences environnementales de l'activité de l'entreprise. L'accord peut également intégrer dans la base de données les informations nécessaires aux négociations obligatoires prévues à l'article L. 2242-1 , au 1° de l'article L. 2242-11 ou à l'article L. 2242-13 et aux consultations ponctuelles du comité social et économique prévues à l'article L. 2312-8 et à la sous-section 4. L'organisation, l'architecture, le contenu et les modalités de fonctionnement de la base de données sont tels qu'ils permettent au comité social et économique et, le cas échéant, aux délégués syndicaux d'exercer utilement leurs compétences. A défaut d'accord prévu à l'alinéa premier, un accord de branche peut définir l'organisation, l'architecture, le contenu et les modalités de fonctionnement de la base de données économiques, sociales et environnementales dans les entreprises de moins de trois cents salariés.",
  "elargi": true
 },
 "L2312-22": {
  "id": "LEGIARTI000043975191",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-19 , le comité social et économique est consulté chaque année sur : 1° Les orientations stratégiques de l'entreprise dans les conditions définies au sous-paragraphe 1er ; 2° La situation économique et financière de l'entreprise dans les conditions définies au sous-paragraphe 2 ; 3° La politique sociale de l'entreprise, les conditions de travail et l'emploi dans les conditions définies au sous-paragraphe 3. Au cours de ces consultations, le comité est informé des conséquences environnementales de l'activité de l'entreprise. Les consultations prévues aux 1° et 2° sont conduites au niveau de l'entreprise, sauf si l'employeur en décide autrement et sous réserve de l'accord de groupe prévu à l'article L. 2312-20 . La consultation prévue au 3° est conduite à la fois au niveau central et au niveau des établissements lorsque sont prévues des mesures d'adaptation spécifiques à ces établissements.",
  "elargi": true
 },
 "L2312-25": {
  "id": "LEGIARTI000048533627",
  "texte": "I.-La consultation annuelle sur la situation économique et financière de l'entreprise porte également sur la politique de recherche et de développement technologique de l'entreprise, y compris sur l'utilisation du crédit d'impôt pour les dépenses de recherche. II.-En vue de cette consultation, l'employeur met à la disposition du comité, dans les conditions prévues par l'accord mentionné à l' article L. 2312-21 ou à défaut d'accord au sous-paragraphe 4 : 1° Les informations sur l'activité et sur la situation économique et financière de l'entreprise ainsi que sur ses perspectives pour l'année à venir. Ces informations sont tenues à la disposition de l'autorité administrative ; 2° Pour toutes les sociétés commerciales, les documents obligatoirement transmis annuellement à l'assemblée générale des actionnaires ou à l'assemblée des associés, les communications et les copies transmises aux actionnaires dans les conditions prévues aux articles L. 225-100 à L. 225-102 , L. 225-108 et L. 225-115 à L. 225-118 du code de commerce , ainsi que le rapport des commissaires aux comptes et le cas échéant le rapport de certification des informations en matière de durabilité. Le conseil peut convoquer les commissaires aux comptes pour recevoir leurs explications sur les différents postes des documents communiqués ainsi que sur la situation financière de l'entreprise ; 3° Pour les sociétés commerciales mentionnées à l' article L. 232-2 du code de commerce et les groupements d'intérêt économique mentionnés à l' article L. 251-13 du même code , les documents établis en application du même article L. 251-13 et des articles L. 232-3 et L. 232-4 dudit code . Ces documents sont réputés confidentiels, au sens de l' article L. 2315-3 du présent code ; 4° Pour les entreprises ne revêtant pas la forme de société commerciale, les documents comptables qu'elles établissent ; 5° Les informations relatives à la politique de recherche et de développement technologique de l'entreprise. Le cas échéant, les documents mentionnés au 2° comprennent également le rapport sur les enjeux de durabilité prévu aux articles L. 232-6-4 et L. 233-28-5 du code de commerce .",
  "elargi": true
 },
 "L2312-26": {
  "id": "LEGIARTI000052437222",
  "texte": "I.-La consultation annuelle sur la politique sociale de l'entreprise, les conditions de travail et l'emploi porte sur l'évolution de l'emploi, les qualifications, le programme pluriannuel de formation, les actions de formation envisagées par l'employeur, les périodes de reconversion mentionnées à l' article L. 6324-1 , l'apprentissage, les conditions d'accueil en stage, les actions de prévention en matière de santé et de sécurité, les conditions de travail, les congés et l'aménagement du temps de travail, la durée du travail, l'égalité professionnelle entre les femmes et les hommes et les modalités d'exercice du droit d'expression des salariés dans les entreprises non couvertes par un accord sur l'égalité professionnelle et la qualité de vie et des conditions de travail contenant des dispositions sur ce droit. Le comité peut se prononcer par un avis unique portant sur l'ensemble des thèmes énoncés au premier alinéa ou par des avis séparés organisés au cours de consultations propres à chacun de ces thèmes. II.-A cette fin, l'employeur met à la disposition du comité, dans les conditions prévues par l'accord mentionné à l'article L. 2312-21 ou à défaut d'accord au sous-paragraphe 4 : 1° Les informations sur l'évolution de l'emploi, des qualifications, de la formation et des salaires, sur les actions en faveur de l'emploi des travailleurs handicapés, sur le nombre et les conditions d'accueil des stagiaires, sur l'apprentissage et sur le recours aux contrats de travail à durée déterminée, aux contrats de mission conclus avec une entreprise de travail temporaire ou aux contrats conclus avec une entreprise de portage salarial ; 2° Les informations et les indicateurs chiffrés sur la situation comparée des femmes et des hommes au sein de l'entreprise, mentionnés au 2° de l'article L. 2312-36 , ainsi que l'accord relatif à l'égalité professionnelle entre les femmes et les hommes issu de la négociation mentionnée au 2° de l'article L. 2242-1 ou, à défaut, le plan d'action mentionné à l'article L. 2242-3 ; 3° Les informations sur le plan de développement des compétences du personnel de l'entreprise ; 4° Les informations sur la mise en œuvre des contrats de professionnalisation et du compte personnel de formation ; 4° bis Les informations sur la mise en œuvre des entretiens professionnels et de l'état des lieux récapitulatifs prévus à l'article L. 6315-1 ; 4° ter Les informations sur la mise en œuvre des périodes de reconversion mentionnées à l'article L. 6324-1 ; 5° Les informations sur la durée du travail portant sur : a) Les heures supplémentaires accomplies dans la limite et au-delà du contingent annuel applicable dans l'entreprise ; b) A défaut de détermination du contingent annuel d'heures supplémentaires par voie conventionnelle, les modalités de son utilisation et de son éventuel dépassement dans les conditions prévues aux articles L. 3121-28 à L. 3121-39 ; c) Le bilan du travail à temps partiel réalisé dans l'entreprise ; d) Le nombre de demandes individuelles formulées par les salariés à temps partiel pour déroger à la durée hebdomadaire minimale prévue au premier alinéa de l'article L. 3123-7 et aux articles L. 3123-19 et L. 3123-27 ; e) La durée, l'aménagement du temps de travail, la période de prise des congés payés prévue aux articles L. 3141-13 à L. 3141-16 , les conditions d'application des aménagements de la durée et des horaires prévus à l'article L. 3121-44 lorsqu'ils s'appliquent à des salariés à temps partiel, le recours aux conventions de forfait et les modalités de suivi de la charge de travail des salariés concernés ; 6° Les informations sur les mesures prises en vue de faciliter l'emploi des accidentés du travail, des invalides de guerre et assimilés, des invalides civils et des travailleurs handicapés, notamment celles relatives à l'application de l'obligation d'emploi des travailleurs handicapés ; 7° Les informations sur l'affectation de la contribution sur les salaires au titre de l'effort de construction ainsi que sur les conditions de logement des travailleurs étrangers que l'entreprise se propose de recruter ; 8° Les informations sur les modalités d'exercice du droit d'expression des salariés prévues à l'article L. 2281-11 ; 9° Les informations relatives aux contrats de mise à disposition conclus avec les entreprises de travail temporaires, aux contrats d'accompagnement dans l'emploi, aux contrats initiative emploi et les éléments qui l'ont conduit à faire appel, au titre de l'année écoulée, et qui pourraient le conduire à faire appel pour l'année à venir, à des contrats de travail à durée déterminée, à des contrats de mission conclus avec une entreprise de travail temporaire ou à des contrats conclus avec une entreprise de portage salarial.",
  "elargi": true
 },
 "L2312-34": {
  "id": "LEGIARTI000035609830",
  "texte": "Le seuil de trois cents salariés mentionné au présent chapitre est réputé franchi lorsque l'effectif de l'entreprise dépasse ce seuil pendant douze mois consécutifs. L'employeur dispose d'un délai d'un an à compter du franchissement de ce seuil pour se conformer complètement aux obligations d'information et de consultation du comité social et économique qui en découlent.",
  "elargi": true
 },
 "L2312-36": {
  "id": "LEGIARTI000048533625",
  "texte": "En l'absence d'accord prévu à l' article L. 2312-21 , une base de données économiques, sociales et environnementales, mise régulièrement à jour, rassemble un ensemble d'informations que l'employeur met à disposition du comité social et économique. La base de données est accessible en permanence aux membres de la délégation du personnel du comité social et économique ainsi qu'aux membres de la délégation du personnel du comité social et économique central d'entreprise, et aux délégués syndicaux. Les informations contenues dans la base de données portent sur les thèmes suivants : 1° Investissements : investissement social (emploi, évolution et répartition des contrats précaires, des stages et des emplois à temps partiel, formation professionnelle, évolution professionnelle et conditions de travail), investissement matériel et immatériel ; 2° Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise : diagnostic et analyse de la situation comparée des femmes et des hommes pour chacune des catégories professionnelles de l'entreprise en matière d'embauche, de formation, de promotion professionnelle, de qualification, de classification, de conditions de travail, de sécurité et de santé au travail, de rémunération effective et d'articulation entre l'activité professionnelle et la vie personnelle et familiale, analyse des écarts de salaires et de déroulement de carrière en fonction de l'âge, de la qualification et de l'ancienneté, évolution des taux de promotion respectifs des femmes et des hommes par métiers dans l'entreprise, part des femmes et des hommes dans le conseil d'administration ; 3° Fonds propres et endettement ; 4° Ensemble des éléments de la rémunération des salariés et dirigeants ; 5° Activités sociales et culturelles ; 6° Rémunération des financeurs ; 7° Flux financiers à destination de l'entreprise, notamment aides publiques et crédits d'impôts ; 8° Sous-traitance ; 9° Le cas échéant, transferts commerciaux et financiers entre les entités du groupe ; 10° Conséquences environnementales de l'activité de l'entreprise. Ces informations portent sur les deux années précédentes et l'année en cours et intègrent des perspectives sur les trois années suivantes. Le contenu de ces informations ainsi que les modalités de fonctionnement de la base sont déterminés par un décret en Conseil d'Etat, le contenu pouvant varier selon que l'effectif de l'entreprise est inférieur ou au moins égal à trois cents salariés. Les membres de la délégation du personnel du comité social et économique, du comité social et économique central d'entreprise et les délégués syndicaux sont tenus à une obligation de discrétion à l'égard des informations contenues dans la base de données revêtant un caractère confidentiel et présentées comme telles par l'employeur.",
  "elargi": true
 },
 "L2312-83": {
  "id": "LEGIARTI000036761969",
  "texte": "Pour l'application du présent paragraphe, la masse salariale brute est constituée par l'ensemble des gains et rémunérations soumis à cotisations de sécurité sociale en application des dispositions de l'article L. 242-1 du code de la sécurité sociale ou de l' article L. 741-10 du code rural et de la pêche maritime , à l'exception des indemnités versées à l'occasion de la rupture du contrat de travail à durée indéterminée.",
  "elargi": true
 },
 "L2312-84": {
  "id": "LEGIARTI000035611325",
  "texte": "En cas de reliquat budgétaire les membres de la délégation du personnel du comité social et économique peuvent décider, par une délibération, de transférer tout ou partie du montant de l'excédent annuel du budget destiné aux activités sociales et culturelles au budget de fonctionnement ou à des associations dans des conditions et limites fixées par décret en Conseil d'Etat.",
  "elargi": true
 },
 "L2312-4": {
  "id": "LEGIARTI000035650742",
  "texte": "Les dispositions du présent chapitre ne font pas obstacle aux dispositions plus favorables relatives aux attributions du comité social et économique résultant d'accords collectifs de travail ou d'usages.",
  "elargi": true
 },
 "L2312-5": {
  "id": "LEGIARTI000043893930",
  "texte": "La délégation du personnel au comité social et économique a pour mission de présenter à l'employeur les réclamations individuelles ou collectives relatives aux salaires, à l'application du code du travail et des autres dispositions légales concernant notamment la protection sociale, ainsi que des conventions et accords applicables dans l'entreprise. Elle contribue à promouvoir la santé, la sécurité et l'amélioration des conditions de travail dans l'entreprise et réalise des enquêtes en matière d'accidents du travail ou de maladies professionnelles ou à caractère professionnel. L'employeur lui présente la liste des actions de prévention et de protection prévue au 2° du III de l'article L. 4121-3-1 . Elle exerce le droit d'alerte dans les conditions prévues aux articles L. 2312-59 et L. 2312-60 . Dans une entreprise en société anonyme, lorsque les membres de la délégation du personnel du comité social et économique présentent des réclamations auxquelles il ne pourrait être donné suite qu'après délibération du conseil d'administration, ils sont reçus par celui-ci, sur leur demande, en présence du directeur ou de son représentant ayant connaissance des réclamations présentées. Les membres de la délégation du personnel du comité peuvent saisir l'inspection du travail de toutes les plaintes et observations relatives à l'application des dispositions légales dont elle est chargée d'assurer le contrôle.",
  "elargi": true
 },
 "R2312-5": {
  "id": "LEGIARTI000045680873",
  "texte": "Pour l'ensemble des consultations mentionnées au présent code pour lesquelles la loi n'a pas fixé de délai spécifique, le délai de consultation du comité social et économique court à compter de la communication par l'employeur des informations prévues par le code du travail pour la consultation ou de l'information par l'employeur de leur mise à disposition dans la base de données économiques, sociales et environnementales dans les conditions prévues aux articles R. 2312-7 et suivants.",
  "elargi": true
 },
 "R2312-6": {
  "id": "LEGIARTI000036411558",
  "texte": "I.-Pour les consultations mentionnées à l'article R. 2312-5 , à défaut d'accord, le comité social et économique est réputé avoir été consulté et avoir rendu un avis négatif à l'expiration d'un délai d'un mois à compter de la date prévue à cet article. En cas d'intervention d'un expert, le délai mentionné au premier alinéa est porté à deux mois. Ce délai est porté à trois mois en cas d'intervention d'une ou plusieurs expertises dans le cadre de consultation se déroulant à la fois au niveau du comité social et économique central et d'un ou plusieurs comités sociaux économiques d'établissement. II.-Lorsqu'il y a lieu de consulter à la fois le comité social et économique central et un ou plusieurs comités d'établissement en application du second alinéa de l'article L. 2316-22 , les délais prévus au I s'appliquent au comité social et économique central. Dans ce cas, l'avis de chaque comité d'établissement est rendu et transmis au comité social et économique central au plus tard sept jours avant la date à laquelle ce dernier est réputé avoir été consulté et avoir rendu un avis négatif en application du I. A défaut, l'avis du comité d'établissement est réputé négatif.",
  "elargi": true
 },
 "R2312-7": {
  "id": "LEGIARTI000047548416",
  "texte": "La base de données prévue à l'article L. 2312-18 permet la mise à disposition des informations nécessaires aux trois consultations récurrentes prévues à l'article L. 2312-17 . L'ensemble des informations de la base de données contribue à donner une vision claire et globale de la formation et de la répartition de la valeur créée par l'activité de l'entreprise. Elle comporte également les indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer mentionnés à l'article L. 1142-8 ainsi que, pour les entreprises mentionnées au premier alinéa de l'article L. 1142-11 , les écarts de répartition entre les femmes et les hommes parmi les cadres dirigeants définis à l'article L. 3111-2 et les membres des instances dirigeantes définies à l'article L. 23-12-1 du code de commerce.",
  "elargi": true
 },
 "R2312-8": {
  "id": "LEGIARTI000049905537",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-21 , dans les entreprises de moins de trois cents salariés, la base de données prévue à l'article L. 2312-18 comporte les informations suivantes : 1° Investissements : A-Investissement social : a) Evolution des effectifs par type de contrat, par âge, par ancienneté ; -évolution des effectifs retracée mois par mois ; -nombre de salariés titulaires d'un contrat de travail à durée indéterminée ; -nombre de salariés titulaires d'un contrat de travail à durée déterminée ; -nombre de salariés temporaires ; -nombre de salariés appartenant à une entreprise extérieure ; -nombre des journées de travail réalisées au cours des douze derniers mois par les salariés temporaires ; -nombre de contrats d'insertion et de formation en alternance ouverts aux jeunes de moins de vingt-six ans ; -motifs ayant conduit l'entreprise à recourir aux contrats de travail à durée déterminée, aux contrats de travail temporaire, aux contrats de travail à temps partiel, ainsi qu'à des salariés appartenant à une entreprise extérieure ; b) Evolution des emplois par catégorie professionnelle ; -répartition des effectifs par sexe et par qualification ; -indication des actions de prévention et de formation que l'employeur envisage de mettre en œuvre, notamment au bénéfice des salariés âgés, peu qualifiés ou présentant des difficultés sociales particulières ; c) Evolution de l'emploi des personnes handicapées et mesures prises pour le développer ; -Actions entreprises ou projetées en matière d'embauche, d'adaptation, de réadaptation ou de formation professionnelle ; -Déclaration annuelle prévue à l'article L. 5212-5 à l'exclusion des informations mentionnées à l'article D. 5212-4 ; d) Evolution du nombre de stagiaires de plus de 16 ans ; e) Formation professionnelle : investissements en formation, publics concernés ; -les orientations de la formation professionnelle dans l'entreprise telles qu'elles résultent de la consultation prévue à l'article L. 2312-24 ; -le résultat éventuel des négociations prévues à l'article L. 2241-6 ; -les conclusions éventuelles des services de contrôle faisant suite aux vérifications effectuées en application des articles L. 6361-1 , L. 6323-13 et L. 6362-4 ; -le bilan des actions comprises dans le plan de formation de l'entreprise pour l'année antérieure et pour l'année en cours comportant la liste des actions de formation, des bilans de compétences et des validations des acquis de l'expérience réalisés, rapportés aux effectifs concernés répartis par catégorie socioprofessionnelle et par sexe ; -les informations, pour l'année antérieure et l'année en cours, relatives aux congés individuels de formation, aux congés de bilan de compétences, aux congés de validation des acquis de l'expérience et aux congés pour enseignement accordés ; notamment leur objet, leur durée et leur coût, aux conditions dans lesquelles ces congés ont été accordés ou reportés ainsi qu'aux résultats obtenus ; -le nombre des salariés bénéficiaires de l'abondement mentionné à l'avant-dernier alinéa du II de l'article L. 6315-1 ainsi que les sommes versées à ce titre ; -le nombre des salariés bénéficiaires de l'entretien professionnel mentionné au I de l'article L. 6315-1. Le bilan, pour l'année antérieure et l'année en cours, des conditions de mise en œuvre des contrats d'alternance : -les emplois occupés pendant et à l'issue de leur action ou de leur période de professionnalisation ; -les effectifs intéressés par âge, sexe et niveau initial de formation ; -les résultats obtenus en fin d'action ou de période de professionnalisation ainsi que les conditions d'appréciation et de validation. Le bilan de la mise en œuvre du compte personnel de formation ; f) Conditions de travail : durée du travail dont travail à temps partiel et aménagement du temps de travail ; Données sur le travail à temps partiel : -nombre, sexe et qualification des salariés travaillant à temps partiel ; -horaires de travail à temps partiel pratiqués dans l'entreprise ; Le programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail prévu au 2° de l'article L. 2312-27 établi à partir des analyses mentionnées à l'article L. 2312-9 et fixant la liste détaillée des mesures devant être prises au cours de l'année à venir dans les mêmes domaines afin de satisfaire, notamment : i-Aux principes généraux de prévention prévus aux articles L. 4121-1 à L. 4121-5 et L. 4221-1 ; ii-A l'information et à la formation des travailleurs prévues aux articles L. 4141-1 à L. 4143-1 ; iii-A l'information et à la formation des salariés titulaires d'un contrat de travail à durée déterminée et des salariés temporaires prévues aux articles L. 4154-2 et L. 4154-4 ; iv-A la coordination de la prévention prévue aux articles L. 4522-1 et L. 4522-2 ; B-Investissement matériel et immatériel : a) Evolution des actifs nets d'amortissement et de dépréciations éventuelles (immobilisations) ; b) Le cas échéant, dépenses de recherche et développement ; c) Mesures envisagées en ce qui concerne l'amélioration, le renouvellement ou la transformation des méthodes de production et d'exploitation ; et incidences de ces mesures sur les conditions de travail et l'emploi ; 2° Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise : A-Analyse des données chiffrées : Analyse des données chiffrées par catégorie professionnelle de la situation respective des femmes et des hommes en matière d'embauche, de formation, de promotion professionnelle, de qualification, de classification, de conditions de travail, de santé et de sécurité au travail, de rémunération effective et d'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale analyse des écarts de salaires et de déroulement de carrière en fonction de leur âge, de leur qualification et de leur ancienneté ; description de l'évolution des taux de promotion respectifs des femmes et des hommes par métiers dans l'entreprise ; B-Stratégie d'action : A partir de l'analyse des données chiffrées mentionnées au A du 2°, la stratégie comprend les éléments suivants : -mesures prises au cours de l'année écoulée en vue d'assurer l'égalité professionnelle. Bilan des actions de l'année écoulée et, le cas échéant, de l'année précédente. Evaluation du niveau de réalisation des objectifs sur la base des indicateurs retenus. Explications sur les actions prévues non réalisées ; -objectifs de progression pour l'année à venir et indicateurs associés. Définition qualitative et quantitative des mesures permettant de les atteindre conformément à l'article R. 2242-2. Evaluation de leur coût. Echéancier des mesures prévues ; 3° Fonds propres, endettement et impôts : a) Capitaux propres de l'entreprise ; b) Emprunts et dettes financières dont échéances et charges financières ; c) Impôts et taxes, notamment, le cas échéant, les informations contenues dans le rapport relatif à l'impôt sur les bénéfices prévu par l' article L. 232-6 du code de commerce ; 4° Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments : A-Evolution des rémunérations salariales : a) Frais de personnel y compris cotisations sociales, évolutions salariales par catégorie et par sexe, salaire de base minimum, salaire moyen ou médian, par sexe et par catégorie professionnelle ; b) Pour les entreprises soumises aux dispositions de l' article L. 225-115 du code de commerce , montant global des rémunérations visées au 4° de cet article ; c) Epargne salariale : intéressement, participation ; 5° Activités sociales et culturelles : montant de la contribution aux activités sociales et culturelles Du comité social et économique, mécénat ; 6° Rémunération des financeurs, en dehors des éléments mentionnés au 4° : A-Rémunération des actionnaires (revenus distribués) ; B-Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus) ; 7° Flux financiers à destination de l'entreprise : A-Aides publiques : Aides ou avantages financiers consentis à l'entreprise par l'Union européenne, l'Etat, une collectivité territoriale, un de leurs établissements publics ou un organisme privé chargé d'une mission de service public, et leur utilisation. Pour chacune de ces aides, il est indiqué la nature de l'aide, son objet, son montant, les conditions de versement et d'emploi fixées, le cas échéant, par la personne publique qui l'attribue et son emploi ; B-Réductions d'impôts ; C-Exonérations et réductions de cotisations sociales ; D-Crédits d'impôts ; E-Mécénat ; F-Résultats financiers : a) Chiffre d'affaires, bénéfices ou pertes constatés ; b) Résultats d'activité en valeur et en volume ; c) Affectation des bénéfices réalisés ; 8° Partenariats : A-Partenariats conclus pour produire des services ou des produits pour une autre entreprise ; B-Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise ; 9° Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe : A-Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative, notamment transferts de capitaux importants entre la société mère et les filiales ; B-Cessions, fusions, et acquisitions réalisées. 10° Environnement (1) A-Politique générale en matière environnementale : Organisation de l'entreprise pour prendre en compte les questions environnementales et, le cas échéant, les démarches d'évaluation ou de certification en matière d'environnement ; B-Economie circulaire : a) Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l' article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l' article R. 541-45 du même code ; b) Utilisation durable des ressources : consommation d'eau et consommation d'énergie ; C-Changement climatique : a) Identification des postes d'émissions directes de gaz à effet de serre produites par les sources fixes et mobiles nécessaires aux activités de l'entreprise (communément appelées \" émissions du scope 1 \") et, lorsque l'entreprise dispose de cette information, évaluation du volume de ces émissions de gaz à effet de serre ; b) Bilan des émissions de gaz à effet de serre prévu par l' article L. 229-25 du code de l'environnement ou bilan simplifié prévu par l' article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces différents bilans. Notes : (1) Lorsque les données et informations environnementales transmises dans le cadre de cette rubrique ne sont pas éditées au niveau de l'entreprise (i. e. par exemple, au niveau du groupe ou des établissements distincts, le cas échéant), elles doivent être accompagnées d'informations supplémentaires pertinentes pour être mises en perspective à ce niveau.",
  "elargi": true
 },
 "R2312-9": {
  "id": "LEGIARTI000049905524",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-21 , dans les entreprises d'au moins trois cents salariés, la base de données économiques, sociales et environnementales prévue à l'article L. 2312-18 comporte les informations prévues dans le tableau ci-dessous. Elle comporte également les informations relatives à la formation professionnelle et aux conditions de travail prévues au 1° A e et f de l'article R. 2312-8. 1° Investissements : A-Investissement social : a) Evolution des effectifs par type de contrat, par âge, par ancienneté ; i-Effectif : Effectif total au 31/12 (1) (I) ; Effectif permanent (2) (I) ; Nombre de salariés titulaires d'un contrat de travail à durée déterminée au 31/12 (I) ; Effectif mensuel moyen de l'année considérée (3) (I) ; Répartition par sexe de l'effectif total au 31/12 (I) ; Répartition par âge de l'effectif total au 31/12 (4) (I) ; Répartition de l'effectif total au 31/12 selon l'ancienneté (5) (I) ; Répartition de l'effectif total au 31/12 selon la nationalité (I) : français/ étrangers ; Répartition de l'effectif total au 31/12 selon une structure de qualification détaillée (II) ; ii-Travailleurs extérieurs : Nombre de salariés (6) appartenant à une entreprise extérieure (23) ; Nombre de stagiaires (écoles, universités …) (7) ; Nombre moyen mensuel de salariés temporaires (8) ; Durée moyenne des contrats de travail temporaire ; Nombre de salariés de l'entreprise détachés ; Nombre de salariés détachés accueillis ; b) Evolution des emplois, notamment, par catégorie professionnelle ; i-Embauches : Nombre d'embauches par contrats de travail à durée indéterminée ; Nombre d'embauches par contrats de travail à durée déterminée (dont Nombre de contrats de travailleurs saisonniers) (I) ; Nombre d'embauches de salariés de moins de vingt-cinq ans ; ii-Départs : Total des départs (I) ; Nombre de démissions (I) ; Nombre de licenciements pour motif économique, dont départs en retraite et préretraite (I) ; Nombre de licenciements pour d'autres causes (I) ; Nombre de fins de contrats de travail à durée déterminée (I) ; Nombre de départs au cours de la période d'essai (9) (I) ; Nombre de mutations d'un établissement à un autre (I) ; Nombre de départs volontaires en retraite et préretraite (10) (I) ; Nombre de décès (I) ; iii-Promotions : Nombre de salariés promus dans l'année dans une catégorie supérieure (11) ; iv-Chômage : Nombre de salariés mis en chômage partiel pendant l'année considérée (I) ; Nombre total d'heures de chômage partiel pendant l'année considérée (12) (I) : -indemnisées ; -non indemnisées ; Nombre de salariés mis en chômage intempéries pendant l'année considérée (I) ; Nombre total d'heures de chômage intempéries pendant l'année considérée (I) : -indemnisées ; -non indemnisées ; c) Evolution de l'emploi des personnes handicapées et mesures prises pour le développer ; Nombre de travailleurs handicapés employés sur l'année considérée (13) ; Nombre de travailleurs handicapés à la suite d'accidents du travail intervenus dans l'entreprise, employés sur l'année considérée ; d) Evolution du nombre de stagiaires ; e) Formation professionnelle : investissements en formation, publics concernés ; i-Formation professionnelle continue (44) : Pourcentage de la masse salariale afférent à la formation continue ; Montant consacré à la formation continue : Formation interne ; formation effectuée en application de conventions ; versement aux organismes de recouvrement ; versement auprès d'organismes agréés ; autres ; total ; Nombre de stagiaires (II) ; Nombre d'heures de stage (II) : -rémunérées ; -non rémunérées. Décomposition par type de stages à titre d'exemple : adaptation, formation professionnelle, entretien ou perfectionnement des connaissances ; ii-Congés formation : Nombre de salariés ayant bénéficié d'un congé formation rémunéré ; Nombre de salariés ayant bénéficié d'un congé formation non rémunéré ; Nombre de salariés auxquels a été refusé un congé formation ; iii-Apprentissage : Nombre de contrats d'apprentissage conclus dans l'année ; f) Conditions de travail : Durée du travail dont travail à temps partiel et aménagement du temps de travail, les données sur l'exposition aux risques et aux facteurs de pénibilité, (accidents du travail, maladies professionnelles, absentéisme, dépenses en matière de sécurité) i-Accidents du travail et de trajet : Taux de fréquence des accidents du travail (I) Nombre d'accidents avec arrêts de travail divisé par nombre d'heures travaillées ; Nombre d'accidents de travail avec arrêt × 106 divisé par nombre d'heures travaillées ; Taux de gravité des accidents du travail (I) ; Nombre des journées perdues divisé par nombre d'heures travaillées ; Nombre des journées perdues × 10 ³ divisé par nombre d'heures travaillées ; Nombre d'incapacités permanentes (partielles et totales) notifiées à l'entreprise au cours de l'année considérée (distinguer français et étrangers) ; Nombre d'accidents mortels : de travail, de trajet ; Nombre d'accidents de trajet ayant entraîné un arrêt de travail ; Nombre d'accidents dont sont victimes les salariés temporaires ou de prestations de services dans l'entreprise ; Taux et montant de la cotisation sécurité sociale d'accidents de travail ; ii-Répartition des accidents par éléments matériels (28) : Nombre d'accidents liés à l'existence de risques graves-codes 32 à 40 ; Nombre d'accidents liés à des chutes avec dénivellation-code 02 ; Nombre d'accidents occasionnés par des machines (à l'exception de ceux liés aux risques ci-dessus)-codes 09 à 30 ; Nombre d'accidents de circulation-manutention-stockage-codes 01,03,04 et 06,07,08 ; Nombre d'accidents occasionnés par des objets, masses, particules en mouvement accidentel-code 05 ; Autres cas ; iii-Maladies professionnelles : Nombre et dénomination des maladies professionnelles déclarées à la sécurité sociale au cours de l'année ; Nombre de salariés atteints par des affections pathologiques à caractère professionnel et caractérisation de celles-ci ; Nombre de déclarations par l'employeur de procédés de travail susceptibles de provoquer des maladies professionnelles (29) ; iv-Dépenses en matière de sécurité : Effectif formé à la sécurité dans l'année ; Montant des dépenses de formation à la sécurité réalisées dans l'entreprise ; Taux de réalisation du programme de sécurité présenté l'année précédente ; Existence et nombre de plans spécifiques de sécurité ; v-Durée et aménagement du temps de travail : Horaire hebdomadaire moyen affiché des ouvriers et employés ou catégories assimilées (30) (I) ; Nombre de salariés ayant bénéficié d'un repos compensateur (I) : -au titre du présent code (31) ; -au titre d'un régime conventionne (I) ; Nombre de salariés bénéficiant d'un système d'horaires individualisés (32) (I) ; Nombre de salariés employés à temps partiel (I) : -entre 20 et 30 heures (33) ; -autres formes de temps partiel ; Nombre de salariés ayant bénéficié tout au long de l'année considérée de deux jours de repos hebdomadaire consécutifs (I) ; Nombre moyen de jours de congés annuels (non compris le repos compensateur) (34) (I) ; Nombre de jours fériés payés (35) (I) ; vi-Absentéisme (14) : Nombre de journées d'absence (15) (I) ; Nombre de journées théoriques travaillées ; Nombre de journées d'absence pour maladie (I) ; Répartition des absences pour maladie selon leur durée (16) (I) ; Nombre de journées d'absence pour accidents du travail et de trajet ou maladies professionnelles (I) ; Nombre de journées d'absence pour maternité (I) ; Nombre de journées d'absence pour congés autorisés (événements familiaux, congés spéciaux pour les femmes …) (I) ; Nombre de journées d'absence imputables à d'autres causes (I) ; vii-Organisation et contenu du travail : Nombre de personnes occupant des emplois à horaires alternant ou de nuit ; Nombre de personnes occupant des emplois à horaires alternant ou de nuit de plus de cinquante ans ; Salarié affecté à des tâches répétitives au sens de l'article D. 4163-2 (36) (distinguer femmes-hommes) ; viii-Conditions physiques de travail : Nombre de personnes exposées de façon habituelle et régulière à plus de 80 à 85 db à leur poste de travail (37) ; Nombre de salariés exposés au froid et à la chaleur au sens des articles R. 4223-13 à R. 4223-15 ; Nombre de salariés exposés aux températures extrêmes au sens de l'article D. 4163-2 (38) ; Nombre de salariés travaillant aux intempéries de façon habituelle et régulière, de l'article L. 5424-8 (39) ; Nombre de prélèvements, d'analyses de produits toxiques et mesures (40) ; ix-Transformation de l'organisation du travail : Expériences de transformation de l'organisation du travail en vue d'en améliorer le contenu (41) ; x-Dépenses d'amélioration de conditions de travail : Montant des dépenses consacrées à l'amélioration des conditions de travail dans l'entreprise (42) ; Taux de réalisation du programme d'amélioration des conditions de travail dans l'entreprise l'année précédente ; xi-Médecine du travail (43) : Nombre de visites d'information et de prévention et nombre d'examens médicaux (distinguer les travailleurs en suivi de droit commun et ceux en suivi individuel renforcé) ; Nombre d'examens complémentaires (distinguer les travailleurs soumis à surveillance et les autres) ; Part du temps consacré par le médecin du travail à l'analyse et à l'intervention en milieu de travail ; xii-Travailleurs inaptes : Nombre de salariés déclarés définitivement inaptes à leur emploi par le médecin du travail ; Nombre de salariés reclassés dans l'entreprise à la suite d'une inaptitude ; B-Investissement matériel et immatériel : a) Evolution des actifs nets d'amortissement et de dépréciations éventuelles (immobilisations) ; b) Le cas échéant, dépenses de recherche et développement ; c) L'évolution de la productivité et le taux d'utilisation des capacités de production, lorsque ces éléments sont mesurables dans l'entreprise ; 2° Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise : I. Indicateurs sur la situation comparée des femmes et des hommes dans l'entreprise : A-Conditions générales d'emploi : a) Effectifs : Données chiffrées par sexe : -Répartition par catégorie professionnelle selon les différents contrats de travail (CDI ou CDD) ; b) Durée et organisation du travail : Données chiffrées par sexe : -Répartition des effectifs selon la durée du travail : temps complet, temps partiel (compris entre 20 et 30 heures et autres formes de temps partiel) ; -Répartition des effectifs selon l'organisation du travail : travail posté, travail de nuit, horaires variables, travail atypique dont travail durant le week-end ; c) Données sur les congés : Données chiffrées par sexe : -Répartition par catégorie professionnelle ; -Selon le nombre et le type de congés dont la durée est supérieure à six mois : compte épargne-temps, congé parental, congé sabbatique ; d) Données sur les embauches et les départs : Données chiffrées par sexe : -répartition des embauches par catégorie professionnelle et type de contrat de travail ; -répartition des départs par catégorie professionnelle et motifs : retraite, démission, fin de contrat de travail à durée déterminée, licenciement ; e) Positionnement dans l'entreprise : Données chiffrées par sexe : -répartition des effectifs par catégorie professionnelle ; -répartition des effectifs par niveau ou coefficient hiérarchique ; B-Rémunérations et déroulement de carrière : a) Promotion : Données chiffrées par sexe : -nombre et taux de promotions par catégorie professionnelle ; -durée moyenne entre deux promotions ; b) Ancienneté : Données chiffrées par sexe : -ancienneté moyenne par catégorie professionnelle ; -ancienneté moyenne dans la catégorie professionnelle ; -ancienneté moyenne par niveau ou coefficient hiérarchique ; -ancienneté moyenne dans le niveau ou le coefficient hiérarchique ; c) Age : Données chiffrées par sexe : -âge moyen par catégorie professionnelle ; -âge moyen par niveau ou coefficient hiérarchique ; d) Rémunérations : Données chiffrées par sexe : -rémunération moyenne ou médiane mensuelle par catégorie professionnelle ; -rémunération moyenne ou médiane mensuelle par niveau ou coefficient hiérarchique. Cet indicateur n'a pas à être renseigné lorsque sa mention est de nature à porter atteinte à la confidentialité des données correspondantes, compte tenu notamment du nombre réduit d'individus dans un niveau ou coefficient hiérarchique ; -rémunération moyenne ou médiane mensuelle par tranche d'âge ; -nombre de femmes dans les dix plus hautes rémunérations ; C-Formation : Données chiffrées par sexe : Répartition par catégorie professionnelle selon : -le nombre moyen d'heures d'actions de formation par salarié et par an ; -la répartition par type d'action : adaptation au poste, maintien dans l'emploi, développement des compétences ; D-Conditions de travail, santé et sécurité au travail : Données générales par sexe : -répartition par poste de travail selon : -l'exposition à des risques professionnels ; -la pénibilité, dont le caractère répétitif des tâches ; Données chiffrées par sexe : -accidents de travail, accidents de trajet et maladies professionnelles : -nombre d'accidents de travail ayant entraîné un arrêt de travail ; -nombre d'accidents de trajet ayant entraîné un arrêt de travail ; -répartition des accidents par éléments matériels (28) -nombre et dénomination des maladies professionnelles déclarées à la Sécurité sociale au cours de l'année ; -nombre de journée d'absence pour accidents de travail, accidents de trajet ou maladies professionnelles ; -maladies : -nombre d'arrêts de travail ; -nombre de journées d'absence ; -maladies ayant donné lieu à un examen de reprise du travail en application du 3° de l'article R. 4624-31 : -nombre d'arrêts de travail ; -nombre de journées d'absence ; II. Indicateurs relatifs à l'articulation entre l'activité professionnelle et l'exercice de la responsabilité familiale : A-Congés : a) Existence d'un complément de salaire versé par l'employeur pour le congé de paternité, le congé de maternité, le congé d'adoption ; b) Données chiffrées par catégorie professionnelle : nombre de jours de congés de paternité pris par le salarié par rapport au nombre de jours de congés théoriques ; B-Organisation du temps de travail dans l'entreprise. a) Existence de formules d'organisation du travail facilitant l'articulation de la vie familiale et de la vie professionnelle ; b) Données chiffrées par sexe et par catégorie professionnelle : -nombre de salariés ayant accédé au temps partiel choisi ; -nombre de salariés à temps partiel choisi ayant repris un travail à temps plein ; c) Services de proximité : -participation de l'entreprise et du comité social et économique aux modes d'accueil de la petite enfance ; -évolution des dépenses éligibles au crédit d'impôt famille. Concernant la notion de catégorie professionnelle, il peut s'agir de fournir des données distinguant : a) Les ouvriers, les employés, techniciens, agents de maîtrise et les cadres ; b) Ou les catégories d'emplois définies par la classification ; c) Ou toute catégorie pertinente au sein de l'entreprise. Toutefois, l'indicateur relatif à la rémunération moyenne ou médiane mensuelle comprend au moins deux niveaux de comparaison dont celui mentionné au a ci-dessus. III. Stratégie d'action : A partir de l'analyse des indicateurs mentionnés aux I et II, la stratégie d'action comprend les éléments suivants : -mesures prises au cours de l'année écoulée en vue d'assurer l'égalité professionnelle. Bilan des actions de l'année écoulée et, le cas échéant, de l'année précédente. Evaluation du niveau de réalisation des objectifs sur la base des indicateurs retenus. Explications sur les actions prévues non réalisées ; -objectifs de progression pour l'année à venir et indicateurs associés. Définition qualitative et quantitative des mesures permettant de les atteindre conformément à l'article R. 2242-2 . Evaluation de leur coût. Echéancier des mesures prévues ; 3° Fonds propres, endettement et impôts : a) Capitaux propres de l'entreprise ; b) Emprunts et dettes financières dont échéances et charges financières ; c) Impôts et taxes, notamment, le cas échéant, les informations contenues dans le rapport relatif à l'impôt sur les bénéfices prévu par l'article L. 232-6 du code de commerce ; 4° Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments : A-Evolution des rémunérations salariales : a) Frais de personnel (24) y compris cotisations sociales, évolutions salariales par catégorie et par sexe, salaire de base minimum, salaire moyen ou médian, par sexe et par catégorie professionnelle ; i-Montant des rémunérations (17) : Choix de deux indicateurs dans l'un des groupes suivants : -rapport entre la masse salariale annuelle (18) (II) et l'effectif mensuel moyen ; -rémunération moyenne du mois de décembre (effectif permanent) hors primes à périodicité non mensuelle ― base 35 heures (II) ; OU -rémunération mensuelle moyenne (19) (II) ; -part des primes à périodicité non mensuelle dans la déclaration de salaire (II) ; -grille des rémunérations (20) ; ii-Hiérarchie des rémunérations : Choix d'un des deux indicateurs suivants : -rapport entre la moyenne des rémunérations des 10 % des salariés touchant les rémunérations les plus élevées et celle correspondant au 10 % des salariés touchant les rémunérations les moins élevées ; OU -rapport entre la moyenne des rémunérations des cadres ou assimilés (y compris cadres supérieurs et dirigeants) et la moyenne des rémunérations des ouvriers non qualifiés ou assimilés (21) ; -montant global des dix rémunérations les plus élevées. iii-Mode de calcul des rémunérations : Pourcentage des salariés dont le salaire dépend, en tout ou partie, du rendement (22). Pourcentage des ouvriers et employés payés au mois sur la base de l'horaire affiché. iv-Charge salariale globale b) Pour les entreprises soumises aux dispositions de l'article L. 225-115 du code de commerce, montant global des rémunérations visées au 4° de cet article ; B-Epargne salariale : intéressement, participation : Montant global de la réserve de participation (25) ; Montant moyen de la participation et/ ou de l'intéressement par salarié bénéficiaire (26) (I) ; Part du capital détenu par les salariés (27) grâce à un système de participation (participation aux résultats, intéressement, actionnariat …) ; C-Rémunérations accessoires : primes par sexe et par catégorie professionnelle, avantages en nature, régimes de prévoyance et de retraite complémentaire ; Avantages sociaux dans l'entreprise : pour chaque avantage préciser le niveau de garantie pour les catégories retenues pour les effectifs (I) ; D-Rémunération des dirigeants mandataires sociaux telles que présentées dans le rapport de gestion en application des trois premiers alinéas de l'article L. 225-102-1 du code de commerce, pour les entreprises soumises à l'obligation de présenter le rapport visé à l'article L. 225-102 du même code ; 5° Représentation du personnel et Activités sociales et culturelles : montant de la contribution aux activités sociales et culturelles du comité social et économique, mécénat : A-Représentation du personnel : a) Représentants du personnel et délégués syndicaux : Composition des comités sociaux et économiques et/ ou d'établissement avec indication, s'il y a lieu, de l'appartenance syndicale ; Participation aux élections (par collège) par catégories de représentants du personnel ; Volume global des crédits d'heures utilisés pendant l'année considérée ; Nombre de réunions avec les représentants du personnel et les délégués syndicaux pendant l'année considérée ; Dates et signatures et objet des accords conclus dans l'entreprise pendant l'année considérée ; Nombre de personnes bénéficiaires d'un congé d'éducation ouvrière (45) ; b) Information et communication : Nombre d'heures consacrées aux différentes formes de réunion du personnel (46) ; Eléments caractéristiques du système d'accueil ; Eléments caractéristiques du système d'information ascendante ou descendante et niveau d'application ; Eléments caractéristiques du système d'entretiens individuels (47) ; c) Différends concernant l'application du droit du travail (48) ; B-Activités sociales et culturelles : a) Activités sociales : Contributions au financement, le cas échéant, du comité social et économique et des comités sociaux économiques d'établissement ; Autres dépenses directement supportées par l'entreprise : logement, transport, restauration, loisirs, vacances, divers, total (49) ; b) Autres charges sociales : Coût pour l'entreprise des prestations complémentaires (maladie, décès) (50) ; Coût pour l'entreprise des prestations complémentaires (vieillesse) (51) ; Equipements réalisés par l'entreprise et touchant aux conditions de vie des salariés à l'occasion de l'exécution du travail ; 6° Rémunération des financeurs, en dehors des éléments mentionnés au 4° : A-Rémunération des actionnaires (revenus distribués) ; B-Rémunération de l'actionnariat salarié (montant des actions détenues dans le cadre de l'épargne salariale, part dans le capital, dividendes reçus) ; 7° Flux financiers à destination de l'entreprise : A-Aides publiques : Les aides ou avantages financiers consentis à l'entreprise par l'Union européenne, l'Etat, une collectivité territoriale, un de leurs établissements publics ou un organisme privé chargé d'une mission de service public, et leur utilisation ; Pour chacune de ces aides, l'employeur indique la nature de l'aide, son objet, son montant, les conditions de versement et d'emploi fixées, le cas échéant, par la personne publique qui l'attribue et son utilisation ; B-Réductions d'impôts ; C-Exonérations et réductions de cotisations sociales ; D-Crédits d'impôts ; E-Mécénat ; F-Résultats financiers a) Le chiffre d'affaires ; b) Les bénéfices ou pertes constatés ; c) Les résultats globaux de la production en valeur et en volume ; d) L'affectation des bénéfices réalisés ; 8° Partenariats : A-Partenariats conclus pour produire des services ou des produits pour une autre entreprise ; B-Partenariats conclus pour bénéficier des services ou des produits d'une autre entreprise ; 9° Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe : A-Transferts de capitaux tels qu'ils figurent dans les comptes individuels des sociétés du groupe lorsqu'ils présentent une importance significative ; B-Cessions, fusions, et acquisitions réalisées. 10° Environnement (52) : I-Pour les entreprises soumises à la déclaration prévue à l'article R. 225-105 du code de commerce : A-Politique générale en matière environnementale : Informations environnementales présentées en application du 2° du A du II de l'article R. 225-105 du code de commerce ; B-Economie circulaire : Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l'article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l'article R. 541-45 du même code ; C-Changement climatique : Bilan des émissions de gaz à effet de serre prévu par l'article L. 229-25 du code de l'environnement ou bilan simplifié prévu par l'article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces différents bilans ; II-Pour les entreprises non soumises à la déclaration prévue à l'article R. 225-105 du code de commerce : A-Politique générale en matière environnementale : Organisation de l'entreprise pour prendre en compte les questions environnementales et, le cas échéant, les démarches d'évaluation ou de certification en matière d'environnement ; B-Economie circulaire : i-Prévention et gestion de la production de déchets : évaluation de la quantité de déchets dangereux définis à l'article R. 541-8 du code de l'environnement et faisant l'objet d'une émission du bordereau mentionné à l'article R. 541-45 du même code ; ii-Utilisation durable des ressources : consommation d'eau et consommation d'énergie ; C-Changement climatique : i-Identification des postes d'émissions directes de gaz à effet de serre produites par les sources fixes et mobiles nécessaires aux activités de l'entreprise (communément appelées \" émissions du scope 1 \") et, lorsque l'entreprise dispose de cette information, évaluation du volume de ces émissions de gaz à effet de serre ; ii-Bilan des émissions de gaz à effet de serre prévu par l'article L. 229-25 du code de l'environnement ou le bilan simplifié prévu par l'article 244 de la loi n° 2020-1721 du 29 décembre 2020 de finances pour 2021 pour les entreprises tenues d'établir ces bilans. Notes : I.-Une structure de qualification détaillée, en trois ou quatre postes minimum, est requise. Il est souhaitable de faire référence à la classification de la convention collective, de l'accord d'entreprise et aux pratiques habituellement retenues dans l'entreprise. A titre d'exemple la répartition suivante peut être retenue : cadres ; employés, techniciens et agents de maîtrise (ETAM) ; et ouvriers. II.-Une structure de qualification détaillée en cinq ou six postes minimum est requise. Il est souhaitable de faire référence à la classification de la convention collective, de l'accord d'entreprise et aux pratiques habituellement retenues dans l'entreprise. A titre d'exemple, la répartition suivante des postes peut être retenue : cadres ; techniciens ; agents de maîtrise ; employés qualifiés ; employés non qualifiés ; ouvriers qualifiés ; ouvriers non qualifiés. Doivent en outre être distinguées les catégories femmes et hommes. (1) Effectif total : tout salarié inscrit à l'effectif au 31/12 quelle que soit la nature de son contrat de travail. (2) Effectif permanent : les salariés à temps plein, inscrits à l'effectif pendant toute l'année considérée et titulaires d'un contrat de travail à durée indéterminée. (3) Somme des effectifs totaux mensuels divisée par 12 (on entend par effectif total tout salarié inscrit à l'effectif au dernier jour du mois considéré). (4) La répartition retenue est celle habituellement utilisée dans l'entreprise à condition de distinguer au moins quatre catégories, dont les jeunes de moins de vingt-cinq ans. (5) La répartition selon l'ancienneté est celle habituellement retenue dans l'entreprise. (6) Il s'agit des catégories de travailleurs extérieurs dont l'entreprise connaît le nombre, soit parce qu'il figure dans le contrat signé avec l'entreprise extérieure, soit parce que ces travailleurs sont inscrits aux effectifs. Exemple : démonstrateurs dans le commerce … (7) Stages supérieurs à une semaine. (8) Est considérée comme salarié temporaire toute personne mise à la disposition de l'entreprise, par une entreprise de travail temporaire. (9) A ne remplir que si ces départs sont comptabilisés dans le total des départs. (10) Distinguer les différents systèmes légaux et conventionnels de toute nature. (11) Utiliser les catégories de la nomenclature détaillée II. (12) Y compris les heures indemnisées au titre du chômage total en cas d'arrêt de plus de quatre semaines consécutives. (13) Tel qu'il résulte de la déclaration obligatoire prévue à l'article L. 5212-5. (14) Possibilités de comptabiliser tous les indicateurs de la rubrique absentéisme, au choix, en journées, 1/2 journées ou heures. (15) Ne sont pas comptés parmi les absences : les diverses sortes de congés, les conflits et le service national. (16) Les tranches choisies sont laissées au choix des entreprises. (17) On entend par rémunération la somme des salaires effectivement perçus pendant l'année par le salarié (au sens de la déclaration sociale nominative). (18) Masse salariale annuelle totale, au sens de la déclaration annuelle de salaire. (19) Rémunération mensuelle moyenne : 1/2 ∑ (masse salariale du mois i) (effectif du mois i). (20) Faire une grille des rémunérations en distinguant au moins six tranches. (21) Pour être prises en compte, les catégories concernées doivent comporter au minimum dix salariés. (22) Distinguer les primes individuelles et les primes collectives. (23) Prestataires de services. (24) Frais de personnel : ensemble des rémunérations et des cotisations sociales mises légalement ou conventionnellement à la charge de l'entreprise. (25) Le montant global de la réserve de participation est le montant de la réserve dégagée-ou de la provision constituée-au titre de la participation sur les résultats de l'exercice considéré. (26) La participation est envisagée ici au sens du titre II du livre III de la partie III. (27) Non compris les dirigeants. (28) Faire référence aux codes de classification des éléments matériels des accidents (arrêté du 10 octobre 1974). (29) En application de l'article L. 461-4 du code de la sécurité sociale. (30) Il est possible de remplacer cet indicateur par la somme des heures travaillées durant l'année. (31) Au sens des dispositions du présent code et du code rural et de la pêche maritime instituant un repos compensateur en matière d'heures supplémentaires. (32) Au sens de l'article L. 3121-48. (33) Au sens de l'article L. 3123-1. (34) Cet indicateur peut être calculé sur la dernière période de référence. (35) Préciser, le cas échéant, les conditions restrictives. (36) Seuils associés aux facteurs de risques professionnels pour le travail répétitif : Travail répétitif caractérisé par la réalisation de travaux impliquant l'exécution de mouvements répétés, sollicitant tout ou partie du membre supérieur, à une fréquence élevée et sous cadence contrainte : -Temps de cycle inférieur ou égal à 30 secondes : 15 actions techniques ou plus pour minimum 900 heures par an -Temps de cycle supérieur à 30 secondes, temps de cycle variable ou absence de temps de cycle : 30 actions techniques ou plus par minute pour minimum 900 heures par an.. (37) Les valeurs limites d'exposition et les valeurs d'exposition déclenchant une action de prévention qui sont fixées dans le tableau prévu à l'article R. 4431-2. (38) Température inférieure ou égale à 5 degrés Celsius ou au moins égale à 30 degrés Celsius pour minimum 900 heures par an. (39) Sont considérées comme intempéries, les conditions atmosphériques et les inondations lorsqu'elles rendent dangereux ou impossible l'accomplissement du travail eu égard soit à la santé ou à la sécurité des salariés, soit à la nature ou à la technique du travail à accomplir. (40) Renseignements tirés du rapport du directeur du service de prévention et de santé au travail interentreprises (41) Pour l'explication de ces expériences d'amélioration du contenu du travail, donner le nombre de salariés concernés. (42) Non compris l'évaluation des dépenses en matière de santé et de sécurité. (43) Renseignements tirés du rapport du directeur du service de prévention et de santé au travail interentreprises. (44) Conformément aux données relatives aux contributions de formation professionnelle de la déclaration sociale nominative. (45) Au sens des articles L. 2145-5 et suivants. (46) On entend par réunion du personnel, les réunions régulières de concertation, concernant les relations et conditions de travail organisées par l'entreprise. (47) Préciser leur périodicité. (48) Avec indication de la nature du différend et, le cas échéant, de la solution qui y a mis fin. (49) Dépenses consolidées de l'entreprise. La répartition est indiquée ici à titre d'exemple. (50) (51) Versements directs ou par l'intermédiaire d'assurances. (52) Lorsque les données et informations environnementales transmises dans le cadre de cette rubrique ne sont pas éditées au niveau de l'entreprise (i. e. par exemple, au niveau du groupe ou des établissements distincts, le cas échéant), elles doivent être accompagnées d'informations supplémentaires pertinentes pour être mises en perspective à ce niveau.",
  "elargi": true
 },
 "R2312-10": {
  "id": "LEGIARTI000036411580",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-21 , les informations figurant dans la base de données portent sur l'année en cours, sur les deux années précédentes et, telles qu'elles peuvent être envisagées, sur les trois années suivantes. Ces informations sont présentées sous forme de données chiffrées ou, à défaut, pour les années suivantes, sous forme de grandes tendances. L'employeur indique, pour ces années, les informations qui, eu égard à leur nature ou aux circonstances, ne peuvent pas faire l'objet de données chiffrées ou de grandes tendances, pour les raisons qu'il précise.",
  "elargi": true
 },
 "R2312-11": {
  "id": "LEGIARTI000036411584",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-21 , la base de données prévue à l'article L. 2312-18 est constituée au niveau de l'entreprise. Dans les entreprises dotées d'un comité social et économique central, la base de données comporte les informations que l'employeur met à disposition de ce comité et des comités d'établissement. Les éléments d'information sont régulièrement mis à jour, au moins dans le respect des périodicités prévues par le présent code.",
  "elargi": true
 },
 "R2312-12": {
  "id": "LEGIARTI000036411586",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-21 , la base de données est tenue à la disposition des personnes mentionnées au dernier alinéa de l'article L. 2312-36 sur un support informatique pour les entreprises d'au moins trois cents salariés, et sur un support informatique ou papier pour les entreprises de moins de trois cents salariés. L'employeur informe ces personnes de l'actualisation de la base de données selon des modalités qu'il détermine et fixe les modalités d'accès, de consultation et d'utilisation de la base. Ces modalités permettent aux personnes mentionnées au dernier alinéa de l'article L. 2312-36 d'exercer utilement leurs compétences respectives.",
  "elargi": true
 },
 "R2312-13": {
  "id": "LEGIARTI000036411588",
  "texte": "Les informations figurant dans la base de données qui revêtent un caractère confidentiel doivent être présentées comme telles par l'employeur qui indique la durée du caractère confidentiel de ces informations que les personnes mentionnées au dernier alinéa de l'article L. 2312-36 sont tenues de respecter.",
  "elargi": true
 },
 "R2312-14": {
  "id": "LEGIARTI000036411590",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-21 , la mise à disposition actualisée dans la base de données des éléments d'information contenus dans les rapports et des informations transmis de manière récurrente au comité social et économique vaut communication à celui-ci des rapports et informations lorsque les conditions cumulatives suivantes sont remplies : 1° La condition fixée au second alinéa de l'article R. 2312-11 est remplie ; 2° L'employeur met à disposition des membres du comité social et économique les éléments d'analyse ou d'explication lorsqu'ils sont prévus par le présent code.",
  "elargi": true
 },
 "R2312-15": {
  "id": "LEGIARTI000036411594",
  "texte": "Sans préjudice de l'obligation de mise en place d'une base de données au niveau de l'entreprise, une convention ou un accord de groupe peut prévoir la constitution d'une base de données au niveau du groupe. La convention ou l'accord détermine notamment les personnes ayant accès à cette base ainsi que les modalités d'accès, de consultation et d'utilisation de cette base.",
  "elargi": true
 },
 "R2312-16": {
  "id": "LEGIARTI000045680836",
  "texte": "En l'absence d'accord prévu à l'article L. 2312-19 , dans les entreprises de moins de trois cents salariés, l'employeur met à la disposition du comité social et économique en vue de la consultation sur la situation économique et financière de l'entreprise les informations prévues aux rubriques 1° B, 7° A et 7° F, 8°, 9° et 10° du tableau de l'article R. 2312-8 .",
  "elargi": true
 },
 "L2316-1": {
  "id": "LEGIARTI000043975179",
  "texte": "Le comité social et économique central d'entreprise exerce les attributions qui concernent la marche générale de l'entreprise et qui excèdent les limites des pouvoirs des chefs d'établissement. Il est seul consulté sur : 1° Les projets décidés au niveau de l'entreprise qui ne comportent pas de mesures d'adaptation spécifiques à un ou plusieurs établissements. Dans ce cas, son avis accompagné des documents relatifs au projet est transmis, par tout moyen, aux comités sociaux et économiques d'établissement ; 2° Les projets et consultations récurrentes décidés au niveau de l'entreprise lorsque leurs éventuelles mesures de mise en œuvre, qui feront ultérieurement l'objet d'une consultation spécifique au niveau approprié, ne sont pas encore définies ; 3° Les mesures d'adaptation communes à plusieurs établissements des projets prévus au 4° du II de l'article 2312-8 .",
  "elargi": true
 },
 "L2316-20": {
  "id": "LEGIARTI000035633047",
  "texte": "Le comité social et économique d'établissement a les mêmes attributions que le comité social et économique d'entreprise, dans la limite des pouvoirs confiés au chef de cet établissement. Le comité social et économique d'établissement est consulté sur les mesures d'adaptation des décisions arrêtées au niveau de l'entreprise spécifiques à l'établissement et qui relèvent de la compétence du chef de cet établissement.",
  "elargi": true
 },
 "L2316-22": {
  "id": "LEGIARTI000036761997",
  "texte": "Lorsqu'il y a lieu de consulter à la fois le comité social et économique central et un ou plusieurs comités sociaux et économiques d'établissement, un accord peut définir l'ordre et les délais dans lesquels le comité social et économique central et le ou les comités sociaux et économiques d'établissement rendent et transmettent leurs avis. A défaut d'accord, l'avis de chaque comité social et économique d'établissement est rendu et transmis au comité social et économique central et l'avis du comité social et économique central est rendu dans des délais fixés par décret en Conseil d'Etat.",
  "elargi": true
 }
}; });

  global.MoteurBDESE = {
    audit: require("./audit-bdese-client.js"),

    controles: require("./controles-bdese.js"),
    manifeste: __MANIFESTE,
    champs: [["Identité",[["entreprise","Dénomination sociale","texte"],["dateAudit","Date à laquelle la situation est décrite","AAAA-MM-JJ"],["effectif","Effectif de l'entreprise au sens de l'article L. 1111-2","nombre"],["etablissementsDistincts","L'entreprise comporte-t-elle plusieurs établissements distincts ?","oui / non"]]],["Le régime applicable",[["accordEntreprise","Avez-vous un accord d'entreprise sur la base de données ?","oui / non"],["accordEntrepriseVerse","Si oui, l'avez-vous joint ?","oui / non"],["accordBranche","Sinon, avez-vous un accord de branche sur la base ?","oui / non"],["accordBrancheVerse","Si oui, l'avez-vous joint ?","oui / non"],["pieces","Pièces versées au dossier","liste d'objets"]]],["Les dates",[["dateSeuil50Atteint","Date à laquelle l'effectif a atteint cinquante salariés pendant douze mois consécutifs","AAAA-MM-JJ"],["dateFinMandat","Date de fin des mandats en cours","AAAA-MM-JJ"],["dateRenouvellementCSE","Date de renouvellement du comité, si elle est arrêtée","AAAA-MM-JJ"],["dateSeuil300Franchi","Date à laquelle le seuil de trois cents salariés est réputé franchi, après douze mois consécutifs de dépassement","AAAA-MM-JJ"]]],["Le contenu",[["base.themes","Les thèmes et rubriques que la base comporte, un par ligne","liste d'objets"],["base.anneesPassees","Nombre d'années passées couvertes","nombre"],["base.anneesSuivantes","Nombre d'années à venir couvertes","nombre"],["base.formePerspectives","Forme sous laquelle les années à venir sont renseignées : chiffrée, grandes tendances, ou mixte","texte"],["base.informationsNonRenseignables","Informations qui ne peuvent recevoir ni chiffres ni tendances, avec les raisons données","liste"]]],["La mise à disposition",[["base.support","Support de la base : informatique, papier, ou autre","texte"],["base.beneficiaires","Personnes ayant accès à la base","liste"],["base.niveau","Niveau auquel la base est mise en place : entreprise, établissement, ou les deux","texte"],["base.dateDerniereMiseAJour","Date de la dernière mise à jour","AAAA-MM-JJ"],["base.informationMiseAJour","Les bénéficiaires sont-ils informés de chaque actualisation ?","oui / non"],["base.preuveAcces","Trace des accès ou de la remise : journal, accusés, émargements","texte"]]],["Les consultations",[["accordPeriodiciteConsultations","Un accord fixe-t-il le contenu, la périodicité et les modalités des consultations récurrentes ?","oui / non"],["periodiciteConsultations","Périodicité que cet accord fixe, en années","nombre"],["reunionsAnnuellesAccord","Nombre de réunions annuelles que cet accord prévoit","nombre"],["accordDelaisConsultation","Un accord fixe-t-il les délais dans lesquels les avis sont rendus ?","oui / non"],["consultation.dateMiseADisposition","Date de mise à disposition des informations dans la base, ou de leur communication","AAAA-MM-JJ"],["consultation.nbExpertises","Nombre d'expertises en cours sur cette consultation","nombre"],["consultation.centralEtEtablissements","La consultation se déroule-t-elle à la fois au niveau central et d'établissement ?","oui / non"],["consultation.dateAvis","Date à laquelle l'avis a été rendu","AAAA-MM-JJ"]]]],
    propositions: {"accordEntreprise":{"valeurs":["oui","non"],"libre":false,"aide":"Un accord signé avec les syndicats — ou, s'il n'y a pas de délégué syndical, avec le comité à la majorité de ses membres titulaires. Si vous n'en avez pas, répondez non : c'est alors la loi qui fixe le contenu de la base."},"accordEntrepriseVerse":{"valeurs":["oui","non"],"libre":false,"aide":"Joignez-le. C'est lui qui dit ce que votre base doit contenir : sans son texte, l'application n'a rien à vérifier."},"accordBranche":{"valeurs":["oui","non"],"libre":false,"aide":"À poser seulement si vous n'avez pas d'accord d'entreprise. Un accord de branche ne vaut que dans les entreprises de moins de 300 salariés."},"accordBrancheVerse":{"valeurs":["oui","non"],"libre":false,"aide":"Joignez-le, comme l'accord d'entreprise."},"etablissementsDistincts":{"valeurs":["oui","non"],"libre":false,"aide":"Une entreprise à plusieurs sites peut tenir sa base au niveau de l'entreprise, de chaque établissement, ou des deux. C'est l'accord qui le dit."},"accordPeriodiciteConsultations":{"valeurs":["oui","non"],"libre":false,"aide":"Attention, ce n'est pas le même accord que celui sur la base de données. Celui-ci dit tous les combien vous consultez le comité. Un accord sur la base ne change pas ce rythme."},"accordDelaisConsultation":{"valeurs":["oui","non"],"libre":false,"aide":"Un accord peut fixer le temps laissé au comité pour rendre son avis. Sans accord : un mois, deux s'il y a un expert, trois si l'expertise porte à la fois sur le comité central et sur des établissements."},"base.informationMiseAJour":{"valeurs":["oui","non"],"libre":false,"aide":"Prévenez-vous les élus à chaque mise à jour ? C'est ce message qui déclenche le délai de consultation. Sans lui, le délai ne commence jamais à courir."},"base.formePerspectives":{"valeurs":["chiffrée","grandes tendances","mixte"],"libre":true,"indicatif":true,"aide":"Pour les trois années à venir, vous pouvez donner des chiffres — ou, si vous ne les avez pas, de grandes tendances. Les deux sont admis. En revanche, ce que vous ne pouvez donner ni en chiffres ni en tendances, il faut le dire et expliquer pourquoi."},"base.niveau":{"valeurs":["entreprise","établissement","les deux"],"libre":true,"indicatif":true,"aide":"Sans accord, la base se tient au niveau de l'entreprise. Un accord peut en décider autrement si vous avez plusieurs établissements."},"base.themes.theme":{"valeurs":["Investissements","Egalité professionnelle entre les femmes et les hommes au sein de l'entreprise","Fonds propres, endettement et impôts","Rémunération des salariés et dirigeants, dans l'ensemble de leurs éléments","Activités sociales et culturelles","Rémunération des financeurs, en dehors des éléments mentionnés au 4°","Flux financiers à destination de l'entreprise","Partenariats","Pour les entreprises appartenant à un groupe, transferts commerciaux et financiers entre les entités du groupe","Environnement (1) A-Politique générale en matière environnementale","Représentation du personnel et Activités sociales et culturelles","Environnement (52)"],"libre":true,"indicatif":true,"aide":"Les rubriques que le décret prévoit. Un accord peut en choisir d'autres, mais dix thèmes restent obligatoires quoi qu'il arrive."},"pieces":{"valeurs":["accord-bdese"],"autres":["accord-branche"],"libre":true,"multiple":true,"indicatif":true,"aide":"Les documents que vous joignez. Un accord ne se prouve que par son texte."}},
    listes: [],
    colonnes: {},
    piecesAppelees: {},
  };
})(typeof window !== "undefined" ? window : this);
