/* Les dossiers contradictoires de l'audit social.

   Ce que la chaîne vérifie ici, et fait échouer la publication sinon :

   1. Les profils types génèrent la bonne liste — les items dus sont dus, les
      items non dus sont exclus, aux bons seuils (8, 12, 60, 260, 320
      salariés, groupe, multi-établissements).
   2. Le profil vide ne produit AUCUN « conforme » ni « sans objet » : tout y
      est « donnée manquante », documenté.
   3. Tout item capable de constater une non-conformité l'a constatée au moins
      une fois ; les items conventionnels ou génériques, qui ne peuvent pas
      (texte non lu), ne rendent JAMAIS « non conforme » — ni « conforme ».
   4. Cocher « je l'ai » sans détail vérifiable rend « risque à vérifier »,
      jamais « conforme ».
   5. Les items renvoyés à un module dédié ne rendent jamais « conforme ».
   6. Une chronologie impossible ne valide aucun délai.
   7. Le plan d'action est trié par priorité et chaque action est complète
      (étapes, acteur, délai, risque, modèle).

   Usage : node tests-social.js                                              */
const R = require("./referentiel-social.js");
const C = require("./controles-social.js");
const P = require("./plan-social.js");

const { CONF, NC, RISQ, MANQ, SO } = C.ETATS;
const echecs = [];
const ok = (cond, msg) => { if (!cond) echecs.push(msg); };

/* ─────────────────────────────────── les profils types ─────────────── */
const BASE = {
  entreprise: "SOCIÉTÉ D'ÉPREUVE SAS", dateAudit: "2026-08-19",
  seuilDepuis12Mois: "oui", groupe: "non", etablissementsDistincts: "non",
  secteur: "services", conventionCollective: "convention test (IDCC 0000)",
  accordsCollectifs: "non", sectionSyndicale: "non", matieresInflammables: "non",
  cadres: "non", projetLicenciementEco: "non",
};
const profil = (effectif, mod) => Object.assign({}, BASE, { effectif }, mod || {});

/* Pour chaque profil : les items attendus dus, et les items attendus non dus.
   Tout item absent des deux listes doit avoir un assujettissement CONNU
   (du === true ou false), jamais indéterminé sur un profil complet. */
const ATTENDUS = [
  { nom: "8 salariés", p: profil(8), dus: ["SOC-DOC-DUERP", "SOC-AFF-HARCELEMENT", "SOC-REG-PERSONNEL", "SOC-SST-SPST", "SOC-SST-VIP", "SOC-FOR-ENTRETIENS", "SOC-AFF-CONVENTION", "SOC-CCN-OBLIGATIONS"],
    nonDus: ["SOC-INS-CSE", "SOC-INS-CSSCT", "SOC-DOC-RI", "SOC-DOC-BDESE", "SOC-DOC-INDEX", "SOC-DOC-OETH", "SOC-REG-DGI", "SOC-EPA-PARTICIPATION", "SOC-AFF-CONSIGNE-INCENDIE", "SOC-INS-REF-HARCELEMENT", "SOC-NEG-NAO", "SOC-EPA-PREVOYANCE-CADRES"] },
  { nom: "12 salariés", p: profil(12), dus: ["SOC-INS-CSE", "SOC-REG-DGI", "SOC-DOC-DUERP"],
    nonDus: ["SOC-DOC-RI", "SOC-DOC-BDESE", "SOC-DOC-OETH", "SOC-EPA-PARTICIPATION", "SOC-INS-CSSCT"] },
  { nom: "60 salariés", p: profil(60), dus: ["SOC-INS-CSE", "SOC-DOC-RI", "SOC-DOC-BDESE", "SOC-DOC-INDEX", "SOC-DOC-OETH", "SOC-EPA-PARTICIPATION", "SOC-NEG-EGALITE", "SOC-AFF-CONSIGNE-INCENDIE"],
    nonDus: ["SOC-INS-CSSCT", "SOC-INS-COMMISSIONS", "SOC-INS-REF-HARCELEMENT"] },
  { nom: "260 salariés", p: profil(260), dus: ["SOC-INS-REF-HARCELEMENT", "SOC-DOC-RI"],
    nonDus: ["SOC-INS-CSSCT", "SOC-INS-COMMISSIONS"] },
  { nom: "320 salariés", p: profil(320), dus: ["SOC-INS-CSSCT", "SOC-INS-COMMISSIONS", "SOC-INS-CSE", "SOC-DOC-BDESE"],
    nonDus: [] },
  { nom: "groupe", p: profil(60, { groupe: "oui" }), dus: ["SOC-INS-GROUPE"], nonDus: ["SOC-INS-CSE-ETAB"] },
  { nom: "multi-établissements", p: profil(60, { etablissementsDistincts: "oui" }), dus: ["SOC-INS-CSE-ETAB"], nonDus: ["SOC-INS-GROUPE"] },
  { nom: "section syndicale", p: profil(60, { sectionSyndicale: "oui" }), dus: ["SOC-NEG-NAO"], nonDus: [] },
  { nom: "seuil non acquis dans la durée", p: profil(60, { seuilDepuis12Mois: "non" }),
    dus: ["SOC-DOC-DUERP"], nonDus: ["SOC-INS-CSE", "SOC-DOC-RI"] },
];

for (const cas of ATTENDUS) {
  const a = Object.fromEntries(C.applicables(cas.p).map(x => [x.id, x]));
  for (const id of cas.dus) ok(a[id] && a[id].du === true,
    `${cas.nom} : ${id} devrait être dû, rend ${a[id] && a[id].du}`);
  for (const id of cas.nonDus) ok(a[id] && a[id].du === false,
    `${cas.nom} : ${id} devrait être non dû, rend ${a[id] && a[id].du}`);
}

/* Le profil « participation au seuil tout juste franchi » ne conclut pas :
   l'échéance dépend d'une durée de maintien que le référentiel ne tranche pas. */
{
  const a = Object.fromEntries(C.applicables(profil(60, { seuilDepuis12Mois: "non" })).map(x => [x.id, x]));
  ok(a["SOC-EPA-PARTICIPATION"].du === null,
    "participation au seuil récent : l'assujettissement devrait rester indéterminé (différé légal), rend " + a["SOC-EPA-PARTICIPATION"].du);
}

/* ─────────────── 2. le profil vide : rien de conforme, rien d'écarté ── */
{
  const v = C.verdicts({}, {});
  for (const [id, x] of Object.entries(v))
    ok(x.etat !== CONF && x.etat !== SO, `profil vide : ${id} rend « ${x.etat} »`);
  ok(Object.values(v).every(x => x.etat === MANQ),
    "profil vide : tout devrait être « donnée manquante »");
}

/* Le profil MAXIMAL : tout est dû. Il sert de socle aux contradictoires. */
const MAX = profil(320, { groupe: "oui", etablissementsDistincts: "oui", sectionSyndicale: "oui",
  matieresInflammables: "oui", cadres: "oui", projetLicenciementEco: "oui", accordsCollectifs: "oui" });
{
  const a = C.applicables(MAX);
  for (const x of a) ok(x.du === true, `profil maximal : ${x.id} devrait être dû, rend ${x.du}`);
}

/* ────────── 3. déclaré absent : NC quand la source le permet, sinon RISQ ── */
let aDitNC = 0;
for (const it of R.REF) {
  const v = C.verdictItem(it, MAX, { coches: { [it.id]: "non" } });
  if (C.peutNC(it)) { ok(v.etat === NC, `${it.id} déclaré absent : attendu « non conforme », rend « ${v.etat} »`); aDitNC++; }
  else ok(v.etat === RISQ, `${it.id} déclaré absent (source non lue) : attendu « risque à vérifier », rend « ${v.etat} »`);
}

/* ────────────── 4. coché sans détail vérifiable : risque, jamais conforme ── */
for (const it of R.REF) {
  const v = C.verdictItem(it, MAX, { coches: { [it.id]: "oui" }, reponses: {} });
  ok(v.etat === RISQ, `${it.id} coché sans détail : attendu « risque à vérifier », rend « ${v.etat} »`);
}

/* ──────── 5. coché et vérifié : conforme si articles lus, sinon jamais ── */
const reponsesPleines = it => {
  const r = {};
  for (const vf of it.verifs || []) {
    if (vf.regle === "oui") r[vf.cle] = "oui";
    else if (vf.regle === "ageMaxMois") r[vf.cle] = "2026-06-01";
    else if (vf.regle === "date") r[vf.cle] = "2026-06-01";
  }
  return r;
};
for (const it of R.REF) {
  const v = C.verdictItem(it, MAX, { coches: { [it.id]: "oui" }, reponses: { [it.id]: reponsesPleines(it) } });
  ok(v.etat !== NC, `${it.id} tout vérifié : ne devrait pas être non conforme (${v.motif})`);
  if (C.peutCONF(it)) ok(v.etat === CONF, `${it.id} tout vérifié : attendu « conforme », rend « ${v.etat} »`);
  else ok(v.etat === RISQ, `${it.id} (module/convention/générique) tout vérifié : attendu « risque à vérifier » (jamais de blanc-seing), rend « ${v.etat} »`);
  if (it.module) ok(v.etat !== CONF && / module /.test(v.motif),
    `${it.id} renvoyé à un module : le verdict doit porter le renvoi (rend « ${v.etat} » : ${v.motif.slice(0, 80)})`);
}

/* ──────────────── 6. les règles de délai, et la chronologie impossible ── */
{
  const it = R.REF.find(x => x.id === "SOC-DOC-DUERP");
  const rep = reponsesPleines(it);
  rep.dateMaj = "2024-01-05"; /* plus d'un an avant l'audit */
  let v = C.verdictItem(it, MAX, { coches: { "SOC-DOC-DUERP": "oui" }, reponses: { "SOC-DOC-DUERP": rep } });
  ok(v.etat === NC, `DUERP mis à jour il y a plus d'un an : attendu « non conforme », rend « ${v.etat} »`);
  rep.dateMaj = "2026-12-31"; /* postérieur à la date d'audit : chronologie impossible */
  v = C.verdictItem(it, MAX, { coches: { "SOC-DOC-DUERP": "oui" }, reponses: { "SOC-DOC-DUERP": rep } });
  ok(v.etat === MANQ, `DUERP daté après l'audit : chronologie impossible, attendu « donnée manquante », rend « ${v.etat} »`);
}

/* ──────────────────────── 7. le plan d'action : trié, complet, adapté ── */
{
  const p60 = profil(60, { sectionSyndicale: "oui" });
  const dossier = { coches: {
    "SOC-DOC-DUERP": "non", "SOC-DOC-RI": "non", "SOC-NEG-NAO": "non",
    "SOC-AFF-HARCELEMENT": "oui", "SOC-REG-PERSONNEL": "oui",
  }, reponses: { "SOC-REG-PERSONNEL": { tenu: "oui" } } };
  const pl = P.plan(p60, dossier);
  ok(pl.actions.length >= 3, `plan : au moins trois actions attendues, rend ${pl.actions.length}`);
  for (let i = 1; i < pl.actions.length; i++)
    ok(pl.actions[i - 1].priorite <= pl.actions[i].priorite, "plan : le tri par priorité est rompu");
  for (const a of pl.actions) {
    ok(Array.isArray(a.etapes) && a.etapes.length >= 2, `plan ${a.id} : étapes incomplètes`);
    ok(!!a.acteur && !!a.delai && !!a.risque && !!a.action, `plan ${a.id} : action incomplète`);
    ok(!!a.modele && !!a.modele.nom, `plan ${a.id} : modèle absent (au moins « modèle à établir »)`);
  }
  /* Le modèle adapté est pré-rempli avec les données du questionnaire. */
  const duerp = pl.actions.find(a => a.id === "SOC-DOC-DUERP");
  ok(duerp && duerp.modeleAdapte && JSON.stringify(duerp.modeleAdapte).includes("SOCIÉTÉ D'ÉPREUVE"),
    "plan DUERP : le modèle adapté devrait porter la dénomination du questionnaire");
  ok(duerp && JSON.stringify(duerp.modeleAdapte).includes("60"),
    "plan DUERP : le modèle adapté devrait porter l'effectif du questionnaire");
  /* Le registre coché et vérifié n'apparaît pas dans les actions. */
  ok(!pl.actions.some(a => a.id === "SOC-REG-PERSONNEL"),
    "plan : un item vérifié conforme ne doit pas produire d'action");
  /* L'affichage coché sans détail va en « à vérifier ». */
  ok(pl.aVerifier.some(a => a.id === "SOC-AFF-HARCELEMENT"),
    "plan : un item coché sans détail doit aller en « à vérifier »");
}

/* ─────────────────── 8. l'hygiène du référentiel lui-même ───────────── */
for (const it of R.REF) {
  ok(!!it.fondement, `${it.id} : fondement absent`);
  for (const vf of it.verifs || [])
    if (vf.regle === "oui" || vf.regle === "ageMaxMois")
      ok(!!vf.motifNC, `${it.id}/${vf.cle} : motif de non-conformité absent`);
  ok(it.plan && it.plan.priorite >= 1 && it.plan.priorite <= 3, `${it.id} : priorité de plan invalide`);
}
/* Chaque article cité existe dans le dépôt de textes, avec identifiant. */
for (const it of R.REF) for (const n of it.articles)
  ok(R.TEXTES[n] && R.TEXTES[n].id, `${it.id} : article ${n} cité sans texte vérifié`);

/* ─────────── 9. les modèles du plan : complets, chiffrés, sans coquille ── */
/* Né d'un retour d'usage (profil type : 7509 salariés, transport routier) :
   un modèle dont le contenu principal est un renvoi, ou une trame de blancs,
   n'est pas un livrable. Chaque modèle doit porter sa structure intégrale,
   un exemple fictif marqué, et la liste des champs à personnaliser. */
{
  const { MODELES } = require("./modeles-social.js");
  const RTH = profil(7509, { entreprise: "RTH NETGOCE", secteur: "transport routier",
    conventionCollective: "Transports routiers et activités auxiliaires (IDCC 16)",
    groupe: "oui", etablissementsDistincts: "oui", sectionSyndicale: "oui",
    matieresInflammables: "oui", cadres: "oui", projetLicenciementEco: "oui" });
  for (const it of R.REF) {
    ok(!!MODELES[it.id], `${it.id} : aucun modèle adapté`);
    if (!MODELES[it.id]) continue;
    const m = MODELES[it.id](RTH);
    const texte = [m.titre, ...m.lignes.map(l => l.x)].join("\n");
    ok(texte.length >= 900, `${it.id} : modèle trop court (${texte.length} caractères) — une coquille n'est pas un livrable`);
    ok(!texte.includes("______"), `${it.id} : le modèle porte encore des blancs sans valeur d'exemple`);
    ok(texte.includes("[exemple]"), `${it.id} : aucune valeur d'exemple marquée`);
    ok(texte.includes("À personnaliser"), `${it.id} : la liste des champs à personnaliser manque`);
    ok(texte.includes("RTH NETGOCE"), `${it.id} : le modèle n'est pas pré-rempli de la dénomination`);
    /* Le renvoi au module ne peut pas être le contenu principal : le corps du
       modèle, hors lignes de renvoi, reste substantiel. */
    const corps = m.lignes.filter(l => !/module «|Pour aller plus loin/.test(l.x)).map(l => l.x).join("\n");
    ok(corps.length >= 800, `${it.id} : hors renvoi au module, le modèle est creux (${corps.length} caractères)`);
  }
  /* La BDESE : la structure intégrale des rubriques de l'effectif déclaré. */
  const b = MODELES["SOC-DOC-BDESE"](RTH);
  const tb = b.lignes.map(l => l.x).join("\n");
  for (const attendu of ["Investissements", "Egalité professionnelle", "Fonds propres", "R2312-9"])
    ok(tb.replace(/[.\s]/g, "").includes(attendu.replace(/[.\s]/g, "")) || tb.includes(attendu),
      `modèle BDESE : la rubrique « ${attendu} » manque à la structure`);
  ok((tb.match(/^Rubrique \d/gm) || b.lignes.filter(l => /^Rubrique \d/.test(l.x))).length >= 10,
    "modèle BDESE : les dix rubriques du décret ne sont pas toutes rendues");
  ok(tb.length >= 4000, `modèle BDESE : structure incomplète (${tb.length} caractères)`);
  /* À 7509 salariés, c'est le régime des trois cents et plus qui s'affiche. */
  ok(tb.includes("R2312-9") || tb.includes("R. 2312-9") || tb.includes("au moins trois cents"),
    "modèle BDESE : le régime des entreprises d'au moins trois cents salariés devrait s'appliquer à 7509 salariés");
  /* Les chiffres s'adaptent à l'effectif : l'obligation d'emploi à 6 %. */
  const o = MODELES["SOC-DOC-OETH"](RTH);
  ok(o.lignes.some(l => l.x.includes("450")), "modèle OETH : la cible de 6 % (450 bénéficiaires pour 7509 salariés) n'est pas chiffrée");
  /* La CSSCT propose une taille plausible pour un tel effectif. */
  const c = MODELES["SOC-INS-CSSCT"](RTH);
  ok(c.lignes.some(l => /8/.test(l.x) && /\[exemple\]/.test(l.x)), "modèle CSSCT : l'exemple de composition ne s'adapte pas à l'effectif");
  /* Le vocabulaire suit le secteur déclaré. */
  const d = MODELES["SOC-DOC-DUERP"](RTH);
  ok(d.lignes.some(l => /roulants|Conduite/i.test(l.x)), "modèle DUERP : les unités de travail n'épousent pas le secteur transport");
}

const nbCONFcapables = R.REF.filter(C.peutCONF).length;
console.log(`${R.REF.length} obligations · ${ATTENDUS.length} profils types · items capables de « non conforme » : ${R.REF.filter(C.peutNC).length}, éprouvés ${aDitNC}`);
console.log(`items pouvant atteindre « conforme » (articles lus, sans renvoi) : ${nbCONFcapables} · conventionnels/génériques plafonnés à « risque » : ${R.REF.filter(x => !C.peutCONF(x) && !x.module).length}`);
if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
console.log("tout est vert");
