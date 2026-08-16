/* Les dossiers construits pour mettre les contrôles en défaut.

   La règle du dépôt : tout contrôle capable de constater une non-conformité
   doit la constater au moins une fois sur ces dossiers, sans quoi la
   publication échoue. Un contrôle qui n'a jamais dit « non » n'a jamais été
   éprouvé — il peut être écrit à l'envers sans que rien ne le révèle.

   S'y ajoutent deux épreuves de principe, qui valent pour tout le module :
   sur un dossier vide, aucun contrôle ne rend « conforme » ni « sans objet » ;
   et aucun contrôle de calibrage ne rend jamais « conforme », parce qu'aucun
   texte ne fixe le montant d'un plan.

   Usage : node tests-pse.js      */
const { C, ETATS, DETECTION } = require("./controles-pse.js");
const { CONF, NC, RISQ, MANQ, SO } = ETATS;

const BASE = {
  effectif: 320, effectifEtablissement: 320, groupe: true, effectifGroupe: 640,
  nbLicenciements: 22, total30j: 22,
  pieces: [{ type: "comptes-groupe", date: "2026-05-02" }],
  plan: {
    mesures: [
      { rubrique: "1°", intitule: "Reclassement interne", beneficiaires: 22, budget: 180000, duree: "6 mois" },
      { rubrique: "1° bis", intitule: "Reprise partielle d'activité", beneficiaires: 4, budget: 40000, duree: "12 mois" },
      { rubrique: "2°", intitule: "Création d'une activité de maintenance", beneficiaires: 6, budget: 120000, duree: "18 mois" },
      { rubrique: "3°", intitule: "Antenne emploi et bassin", beneficiaires: 22, budget: 90000, duree: "9 mois" },
      { rubrique: "4°", intitule: "Aide à la création d'entreprise", beneficiaires: 5, budget: 60000, duree: "12 mois" },
      { rubrique: "5°", intitule: "Formations de reconversion", beneficiaires: 18, budget: 240000, duree: "12 mois" },
      { rubrique: "6°", intitule: "Réduction des heures supplémentaires", beneficiaires: 40, budget: 0, duree: "permanent" },
    ],
    budgetTotal: 730000, resultatGroupe: 9200000,
    salariesExposes: ["3 salariés de plus de 55 ans", "2 sans qualification"],
    suivi: { modalites: "commission de suivi trimestrielle", consultation: "quatre réunions par an", bilan: "bilan annuel à la DREETS" },
    accompagnement: "contrat de sécurisation professionnelle",
    dateProposition: "2026-07-10", dateRupture: "2026-07-20",
    demandesReembauche: [], informationElusPostes: true,
  },
  pse: { voie: "unilateral", suffrages: null, dateDepotAdmin: "2026-06-01", dateDecisionAdmin: "2026-06-18",
         dateDesignationExpert: "2026-03-23" },
  datesReunionsCSE: ["2026-03-23", "2026-04-14"], dateAvisCSE: "2026-04-14",
  accordDelaisConsultation: false, expertisePSE: true,
  dateNotification: "2026-06-25",
};

const clone = o => JSON.parse(JSON.stringify(o));
function avec(mod) { const f = clone(BASE); mod(f); return f; }

const CAS = [
  { nom: "Aucune action de reclassement interne", attendu: ["PSE-CTL-CON-02"],
    f: avec(f => { f.plan.mesures = f.plan.mesures.filter(m => m.rubrique !== "1°"); }) },
  { nom: "Budget total en désaccord avec le détail", attendu: ["PSE-CTL-CHF-02"],
    f: avec(f => { f.plan.budgetTotal = 1200000; }) },
  { nom: "Congé de reclassement retenu en deçà de mille salariés", attendu: ["PSE-CTL-ACC-01"],
    f: avec(f => { f.plan.accompagnement = "congé de reclassement"; }) },
  { nom: "Congé de reclassement de dix-huit mois sans reconversion", attendu: ["PSE-CTL-ACC-02"],
    f: avec(f => { f.effectif = 1400; f.plan.accompagnement = "congé de reclassement";
                   f.plan.dureeConge = 18; f.plan.formationReconversion = false; }) },
  { nom: "Contrat de sécurisation proposé avant la décision administrative", attendu: ["PSE-CTL-ACC-03"],
    f: avec(f => { f.plan.dateProposition = "2026-06-02"; }) },
  { nom: "Accord signé à 38 % des suffrages", attendu: ["PSE-CTL-VOI-02"],
    f: avec(f => { f.pse.voie = "accord"; f.pse.suffrages = 38; }) },
  { nom: "Notification antérieure à la décision administrative", attendu: ["PSE-CTL-VOI-04"],
    f: avec(f => { f.dateNotification = "2026-06-10"; }) },
  { nom: "Suivi sans bilan à l'administration", attendu: ["PSE-CTL-SUI-01"],
    f: avec(f => { delete f.plan.suivi.bilan; }) },
  { nom: "Élus non informés des postes disponibles", attendu: ["PSE-CTL-REM-01"],
    f: avec(f => { f.plan.informationElusPostes = false; }) },
  { nom: "Mesure visant plus de bénéficiaires qu'il n'est licencié", attendu: ["PSE-CTL-COH-01"],
    f: avec(f => { f.plan.mesures[0].beneficiaires = 60; }) },
  { nom: "Une seule réunion du comité", attendu: ["PSE-CTL-CSE-01"],
    f: avec(f => { f.datesReunionsCSE = ["2026-03-23"]; }) },
  { nom: "Deux réunions espacées de six jours", attendu: ["PSE-CTL-CSE-01"],
    f: avec(f => { f.datesReunionsCSE = ["2026-03-23", "2026-03-29"]; f.dateAvisCSE = "2026-03-29"; }) },

  /* Les dossiers ci-dessous n'attendent pas de non-conformité : ils vérifient
     qu'un contrôle rend bien l'état intermédiaire prévu là où le texte ne
     tranche pas — un risque, jamais un feu vert et jamais un couperet. */
  { nom: "Avis rendu après le terme de deux mois", attendu: [], risque: ["PSE-CTL-CSE-02"],
    f: avec(f => { f.datesReunionsCSE = ["2026-03-23", "2026-04-14"]; f.dateAvisCSE = "2026-06-30"; }) },
  { nom: "Accord de méthode déclaré mais non versé", attendu: [], risque: ["PSE-CTL-CSE-02"],
    f: avec(f => { f.accordDelaisConsultation = true; }) },
  { nom: "Expert désigné après la première réunion", attendu: [], risque: ["PSE-CTL-CSE-03"],
    f: avec(f => { f.pse.dateDesignationExpert = "2026-04-10"; }) },
  { nom: "Comptes du groupe non versés", attendu: [], risque: ["PSE-CTL-CAL-03"],
    f: avec(f => { f.pieces = []; }) },
];

const tousLesDossiers = [BASE, ...CAS.map(c => c.f), {},
  /* deux dossiers de bord, qui n'attendent aucun verdict particulier mais font
     passer la grille de jurisprudence par ses branches restées froides */
  { effectif: 30, nbLicenciements: 12, total30j: 12, plan: { mesures: [{ rubrique: "1°", intitule: "aide au départ volontaire", beneficiaires: 3, budget: 30000, duree: "3 mois" }] } },
  { effectif: 2400, effectifEtablissement: 900, groupe: true, effectifGroupe: 2400, nbLicenciements: 260, total30j: 260,
    plan: { accompagnement: "congé de reclassement", dureeConge: 12, mesures: [
      { rubrique: "1°", intitule: "reclassement", beneficiaires: 200, budget: 900000, duree: "12 mois" },
      { rubrique: "4°", intitule: "plan de départs volontaires", beneficiaires: 60, budget: 600000, duree: "6 mois" }] },
    datesReunionsCSE: ["2026-02-02", "2026-03-02", "2026-04-06"] }];

function verdicts(f) {
  const o = {};
  for (const c of C) {
    try { o[c.id] = c.verdict(f); }
    catch (e) { o[c.id] = { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  }
  return o;
}

module.exports = { CAS, BASE, verdicts };

if (require.main === module) {
  let echecs = [];
  for (const cas of CAS) {
    const v = verdicts(cas.f);
    for (const id of cas.attendu)
      if (!v[id] || v[id].etat !== NC)
        echecs.push(`${cas.nom} : ${id} rend « ${v[id] ? v[id].etat : "rien"} » au lieu de « non conforme ».`);
    for (const id of cas.risque || [])
      if (!v[id] || v[id].etat !== RISQ)
        echecs.push(`${cas.nom} : ${id} rend « ${v[id] ? v[id].etat : "rien"} » au lieu de « risque à vérifier ».`);
  }

  /* Tout contrôle capable de dire non doit l'avoir dit au moins une fois. */
  const peutDireNon = C.filter(c => /etat: NC/.test(String(c.brut || c.verdict))).map(c => c.id);
  const ontDitNon = new Set(CAS.flatMap(c => c.attendu));
  const jamais = peutDireNon.filter(id => !ontDitNon.has(id));

  /* Le dossier vide : ni conforme, ni sans objet. */
  const vide = verdicts({});
  const surVide = Object.entries(vide).filter(([, v]) => v.etat === CONF || v.etat === SO)
    .map(([id, v]) => `${id} → ${v.etat}`);

  /* Le calibrage ne conclut jamais à la conformité, sur aucun dossier. */
  const calibrageConforme = [];
  for (const cas of [{ nom: "référence", f: BASE }, ...CAS]) {
    const v = verdicts(cas.f);
    for (const id of DETECTION) if (v[id] && v[id].etat === CONF) calibrageConforme.push(`${cas.nom} : ${id}`);
  }

  /* La grille de jurisprudence : aucune règle ne doit citer un arrêt absent du
     corpus, et chaque règle doit être atteinte par au moins un dossier — une
     règle qu'aucun dossier ne déclenche n'a jamais été exercée. */
  const GR = require("./grille-pse.js");
  const horsCorpus = GR.G.flatMap(x => x.arrets).filter(n => !GR.CORPUS[n]);
  const jamaisRetenues = GR.G.filter(x => !tousLesDossiers.some(f => { try { return !!x.si(f); } catch (e) { return false; } })).map(x => x.id);

  console.log(`${CAS.length} dossiers contradictoires · ${C.length} contrôles · ${GR.G.length} règles de jurisprudence`);
  console.log(`contrôles capables de constater une non-conformité : ${peutDireNon.length}, éprouvés ${ontDitNon.size}`);
  console.log(`sur un dossier vide : ${surVide.length} verdict(s) « conforme » ou « sans objet »`);
  console.log(`calibrage rendu « conforme » : ${calibrageConforme.length} fois`);
  echecs = echecs
    .concat(horsCorpus.map(n => `La grille cite l'arrêt ${n}, absent du corpus versé au dépôt.`))
    .concat(jamaisRetenues.map(id => `${id} : aucun dossier d'épreuve ne déclenche cette règle de jurisprudence.`))
    .concat(jamais.map(id => `${id} peut constater une non-conformité, mais aucun dossier ne le lui fait dire.`))
    .concat(surVide.map(x => `Sur un dossier vide, ${x} : le silence n'est pas une réponse.`))
    .concat(calibrageConforme.map(x => `${x} : un contrôle de calibrage ne peut pas conclure à la conformité.`));
  if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
  console.log("tout est vert");
}
