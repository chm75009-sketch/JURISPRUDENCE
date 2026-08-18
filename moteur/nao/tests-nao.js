/* Les dossiers construits pour mettre les contrôles NAO en défaut.

   La règle du dépôt : tout contrôle capable de constater une non-conformité
   doit la constater au moins une fois sur ces dossiers, sans quoi la
   publication échoue. Sur un dossier vide, aucun contrôle ne rend « conforme »
   ni « sans objet » ; et le contrôle d'exposition (NAO-CTL-PEN-01) ne rend
   jamais « conforme », parce qu'aucun audit ne délivre de blanc-seing sur des
   sanctions dont l'administration fixe le montant.

   Usage : node tests-nao.js      */
const { C, ETATS, DETECTION } = require("./controles-nao.js");
const { CONF, NC, RISQ, MANQ, SO } = ETATS;

const BASE = {
  entreprise: "SOCIÉTÉ D'EXEMPLE SAS", dateAudit: "2026-08-18",
  effectif: 420, groupe: false, effectifGroupe: null, dimensionCommunautaire: false,
  sectionsSyndicales: "oui",
  accordMethode: { existe: "non" },
  negos: {
    remuneration: { dateEngagement: "2026-02-10", issue: "accord", depot: "oui",
      pvOuvertureEcarts: "oui",
      themesTraites: ["salaires", "temps de travail", "épargne salariale", "écarts femmes-hommes"] },
    egalite: { dateEngagement: "2026-03-05", issue: "PV de désaccord", depot: "oui", appuiBDESE: "oui",
      planAction: { existe: "oui", depot: "oui" },
      themesTraites: ["articulation", "écarts femmes-hommes", "discriminations", "handicap", "prévoyance", "déconnexion"] },
    gepp: { dateEngagement: "2024-06-01", issue: "accord", depot: "oui", themesTraites: [] },
    experimentes: { dateEngagement: "2026-01-15", issue: "en cours" },
  },
  indexEgalitePublie: "oui",
  demandeSyndicale: { recue: "oui", date: "2026-01-05", dateTransmissionAutresOS: "2026-01-08",
    dateConvocation: "2026-01-14" },
  premiereReunion: { date: "2026-02-10", lieuCalendrierFixes: "oui", informationsRemises: "oui",
    dateRemiseInformations: "2026-02-03" },
  decisionUnilaterale: { prise: "non" },
  reponsesMotivees: "oui",
  pieces: [],
};

const clone = o => JSON.parse(JSON.stringify(o));
function avec(mod) { const f = clone(BASE); mod(f); return f; }

const CAS = [
  { nom: "Accord de méthode de six ans", attendu: ["NAO-CTL-REG-02"],
    f: avec(f => { f.accordMethode = { existe: "oui", verse: "oui", dureeAns: 6,
      mentions: ["themes", "contenu", "calendrier", "informations", "suivi"] }; }) },
  { nom: "Accord de méthode sans les mentions de L. 2242-11", attendu: ["NAO-CTL-REG-02"],
    f: avec(f => { f.accordMethode = { existe: "oui", verse: "oui", dureeAns: 3,
      mentions: ["themes"] }; }) },
  { nom: "Rémunération négociée il y a deux ans sous le supplétif", attendu: ["NAO-CTL-PER-01", "NAO-CTL-PEN-01"],
    f: avec(f => { f.negos.remuneration.dateEngagement = "2024-05-01"; }) },
  { nom: "Égalité hors périodicité", attendu: ["NAO-CTL-PER-02"],
    f: avec(f => { f.negos.egalite.dateEngagement = "2024-02-01"; }) },
  { nom: "Gestion des emplois jamais négociée à quatre cents salariés", attendu: ["NAO-CTL-PER-03"],
    f: avec(f => { f.negos.gepp.dateEngagement = "2022-01-10"; }) },
  { nom: "Salariés expérimentés hors périodicité", attendu: ["NAO-CTL-PER-04"],
    f: avec(f => { f.negos.experimentes.dateEngagement = "2022-03-01"; }) },
  { nom: "Demande syndicale transmise en douze jours, convocation en vingt", attendu: ["NAO-CTL-DEM-01"],
    f: avec(f => { f.demandeSyndicale = { recue: "oui", date: "2026-01-05",
      dateTransmissionAutresOS: "2026-01-17", dateConvocation: "2026-01-25" }; }) },
  { nom: "Première réunion sans calendrier ni informations", attendu: ["NAO-CTL-LOY-01"],
    f: avec(f => { f.premiereReunion = { date: "2026-02-10", lieuCalendrierFixes: "non",
      informationsRemises: "non", dateRemiseInformations: "" }; }) },
  { nom: "Accord salaires sans procès-verbal d'ouverture sur les écarts", attendu: ["NAO-CTL-LOY-02"],
    f: avec(f => { f.negos.remuneration.pvOuvertureEcarts = "non"; }) },
  { nom: "Décision unilatérale pendant la négociation, sans urgence", attendu: ["NAO-CTL-UNI-01"],
    f: avec(f => { f.decisionUnilaterale = { prise: "oui", matiere: "salaires effectifs", urgence: "non" }; }) },
  { nom: "Procès-verbal de désaccord non déposé", attendu: ["NAO-CTL-ISS-01"],
    f: avec(f => { f.negos.egalite.depot = "non"; }) },
  { nom: "Ni accord égalité ni plan d'action", attendu: ["NAO-CTL-EGA-01", "NAO-CTL-EGA-02"],
    f: avec(f => { f.negos.egalite.planAction = { existe: "non" }; }) },
  { nom: "Plan d'action égalité non déposé", attendu: ["NAO-CTL-EGA-01"],
    f: avec(f => { f.negos.egalite.planAction = { existe: "oui", depot: "non" }; }) },
  { nom: "Négociation égalité conduite sans s'appuyer sur la base", attendu: ["NAO-CTL-CON-03"],
    f: avec(f => { f.negos.egalite.appuiBDESE = "non"; }) },
  { nom: "Index égalité non publié", attendu: ["NAO-CTL-EGA-02"],
    f: avec(f => { f.indexEgalitePublie = "non"; }) },
];

/* Les dossiers dont le régime est indéterminé : aucun contrôle de périodicité
   n'y conclut, dans aucun sens. */
const REGIME_INCONNU = [
  { nom: "Sections syndicales non renseignées", f: avec(f => { delete f.sectionsSyndicales; }) },
  { nom: "Accord de méthode déclaré mais non versé",
    f: avec(f => { f.accordMethode = { existe: "oui" }; }) },
];
const PERIODICITE_CTL = ["NAO-CTL-PER-01", "NAO-CTL-PER-02", "NAO-CTL-PER-03", "NAO-CTL-PER-04", "NAO-CTL-PEN-01"];

function verdicts(f) {
  const out = {};
  for (const c of C) {
    try { out[c.id] = c.verdict(f); }
    catch (e) { out[c.id] = { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  }
  return out;
}

module.exports = { BASE, CAS, verdicts };

if (require.main === module) {
  const echecs = [];

  /* 1. Chaque cas doit produire la non-conformité attendue. */
  for (const cas of CAS) {
    const v = verdicts(cas.f);
    for (const id of cas.attendu)
      if (v[id].etat !== NC)
        echecs.push(`${cas.nom} : ${id} rend « ${v[id].etat} » au lieu de « non conforme » — ${v[id].motif.slice(0, 120)}`);
  }

  /* 2. Tout contrôle capable de dire non doit l'avoir dit au moins une fois. */
  const aDitNon = new Set();
  for (const cas of CAS) {
    const v = verdicts(cas.f);
    for (const [id, x] of Object.entries(v)) if (x.etat === NC) aDitNon.add(id);
  }
  const jamais = C.map(c => c.id).filter(id => !aDitNon.has(id) && !DETECTION.includes(id)
    && !["NAO-CTL-REG-01", "NAO-CTL-CON-01", "NAO-CTL-CON-02"].includes(id));
  /* REG-01 et CON-0x ne connaissent pas la non-conformité : l'assujettissement
     se constate, il ne se viole pas ; et le contenu incomplet est un risque,
     jamais une non-conformité — l'obligation est de négocier le thème. */
  if (jamais.length) echecs.push(`Contrôles jamais éprouvés en non-conformité : ${jamais.join(", ")}.`);

  /* 3. Sur une fiche vide : ni conforme ni sans objet. */
  const videf = verdicts({});
  let survide = 0;
  for (const [id, x] of Object.entries(videf))
    if (x.etat === CONF || x.etat === SO) { survide++; echecs.push(`Fiche vide : ${id} rend « ${x.etat} ».`); }

  /* 4. Le contrôle d'exposition ne rend jamais conforme. */
  let penConforme = 0;
  for (const cas of [{ nom: "référence", f: BASE }, ...CAS, ...REGIME_INCONNU]) {
    const v = verdicts(cas.f);
    for (const id of DETECTION) if (v[id].etat === CONF) { penConforme++;
      echecs.push(`${cas.nom} : ${id} rend « conforme », ce qu'il s'interdit.`); }
  }

  /* 5. Régime indéterminé : aucun contrôle de périodicité ne conclut. */
  let indetermine = 0;
  for (const cas of REGIME_INCONNU) {
    const v = verdicts(cas.f);
    for (const id of PERIODICITE_CTL)
      if (v[id].etat !== MANQ) { indetermine++;
        echecs.push(`${cas.nom} : ${id} rend « ${v[id].etat} » sur un régime indéterminé.`); }
  }

  const capables = C.filter(c => aDitNon.has(c.id)).length;
  console.log(`${CAS.length + REGIME_INCONNU.length} dossiers contradictoires · ${C.length} contrôles`);
  console.log(`contrôles capables de constater une non-conformité : ${capables}, éprouvés ${capables}`);
  console.log(`sur un dossier vide : ${survide} verdict(s) « conforme » ou « sans objet »`);
  console.log(`sur un régime indéterminé : ${indetermine} contrôle(s) de périodicité ont conclu`);
  console.log(`contrôle d'exposition rendu « conforme » : ${penConforme} fois`);
  if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
  console.log("tout est vert");
}
