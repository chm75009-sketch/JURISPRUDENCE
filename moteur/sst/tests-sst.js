/* Les dossiers construits pour mettre les contrôles SST en défaut.

   La règle du dépôt : tout contrôle capable de constater une non-conformité
   doit la constater au moins une fois sur ces dossiers, sans quoi la
   publication échoue. Sur un dossier vide, aucun contrôle ne rend « conforme »
   ni « sans objet » ; et le contrôle d'exposition (SST-CTL-PEN-01) ne rend
   jamais « conforme », parce qu'une obligation de sécurité qui s'apprécie en
   continu et au fond ne se blanchit pas sur un questionnaire.

   Usage : node tests-sst.js      */
const { C, ETATS, DETECTION } = require("./controles-sst.js");
const { CONF, NC, RISQ, MANQ, SO } = ETATS;
const fs = require("fs");

const BASE = JSON.parse(fs.readFileSync(__dirname + "/fiche-sst.json", "utf8"));

const clone = o => JSON.parse(JSON.stringify(o));
function avec(mod) { const f = clone(BASE); mod(f); return f; }

const CAS = [
  { nom: "Aucun document unique", attendu: ["SST-CTL-DUERP-01", "SST-CTL-PEN-01"],
    f: avec(f => { f.duerp.existe = "non"; }) },
  { nom: "Document unique sans inventaire par unité de travail", attendu: ["SST-CTL-DUERP-02"],
    f: avec(f => { f.duerp.unitesTravail = "non"; }) },
  { nom: "Document unique non mis à jour depuis deux ans, à quatre cent vingt salariés",
    attendu: ["SST-CTL-DUERP-03", "SST-CTL-PEN-01"],
    f: avec(f => { f.duerp.dateDerniereMaj = "2024-05-10"; }) },
  { nom: "Aménagement important sans mise à jour", attendu: ["SST-CTL-DUERP-04", "SST-CTL-PEN-01"],
    f: avec(f => { f.evenement = { survenu: "oui", majFaite: "non" }; }) },
  { nom: "Quatre cent vingt salariés sans programme annuel de prévention", attendu: ["SST-CTL-DUERP-05"],
    f: avec(f => { f.suites.programmeAnnuel = { existe: "non" }; }) },
  { nom: "Programme annuel jamais présenté au comité", attendu: ["SST-CTL-DUERP-05"],
    f: avec(f => { f.suites.programmeAnnuel = { existe: "oui", presenteCSE: "non" }; }) },
  { nom: "Quarante salariés sans liste d'actions consignée", attendu: ["SST-CTL-DUERP-05"],
    f: avec(f => { f.effectif = 40; f.suites.programmeAnnuel = { existe: "" };
      f.suites.listeActions = { consignee: "non" };
      f.etablissementDistinct300 = "non"; f.referentEmployeur = ""; }) },
  { nom: "Versions non conservées et avis d'accès non affiché", attendu: ["SST-CTL-DUERP-06"],
    f: avec(f => { f.duerp.versionsConservees = "non"; f.duerp.avisAffiche = "non"; }) },
  { nom: "Comité jamais consulté sur le document unique", attendu: ["SST-CTL-DUERP-07"],
    f: avec(f => { f.duerp.consultationCSE = "non"; }) },
  { nom: "Document unique jamais transmis au service de prévention", attendu: ["SST-CTL-DUERP-08"],
    f: avec(f => { f.duerp.transmisSPST = "non"; }) },
  { nom: "Quatre cent vingt salariés sans commission santé-sécurité", attendu: ["SST-CTL-CSSCT-01"],
    f: avec(f => { f.cssct = { existe: "non" }; }) },
  { nom: "Établissement à hauts risques sans commission, à quatre-vingts salariés", attendu: ["SST-CTL-CSSCT-01"],
    f: avec(f => { f.effectif = 80; f.etablissementRisqueParticulier = "oui";
      f.cssct = { existe: "non" }; f.referentEmployeur = "";
      f.suites.programmeAnnuel = { existe: "oui", presenteCSE: "oui" }; }) },
  { nom: "Commission imposée par l'inspecteur et jamais créée", attendu: ["SST-CTL-CSSCT-01"],
    f: avec(f => { f.effectif = 120; f.cssctImposeeInspection = "oui";
      f.cssct = { existe: "non" }; f.referentEmployeur = ""; }) },
  { nom: "Commission de deux membres, sans second collège, hors désignation par le comité",
    attendu: ["SST-CTL-CSSCT-02"],
    f: avec(f => { f.cssct.presideeEmployeur = "non"; f.cssct.nbMembres = 2;
      f.cssct.membreSecondCollege = "non"; f.cssct.designesParCSE = "non"; }) },
  { nom: "Commission sans accord ni règlement intérieur", attendu: ["SST-CTL-CSSCT-03"],
    f: avec(f => { f.cssct.modalitesFixees = "aucune"; }) },
  { nom: "Délégation empiétant sur l'expertise et les consultations", attendu: ["SST-CTL-CSSCT-04"],
    f: avec(f => { f.cssct.delegationConforme = "non"; }) },
  { nom: "Élus jamais formés à la santé-sécurité", attendu: ["SST-CTL-CSSCT-05"],
    f: avec(f => { f.formationSSCT = "non"; }) },
  { nom: "Quatre cent vingt salariés sans référent employeur", attendu: ["SST-CTL-HAR-01"],
    f: avec(f => { f.referentEmployeur = "non"; }) },
  { nom: "Comité sans référent harcèlement", attendu: ["SST-CTL-HAR-02"],
    f: avec(f => { f.referentCSE = "non"; }) },
  { nom: "Information des salariés jamais délivrée", attendu: ["SST-CTL-HAR-03"],
    f: avec(f => { f.infoHarcelementMoral = "non"; f.infoHarcelementSexuel = "non";
      f.infoCoordonnees = "non"; }) },
  { nom: "Aucune prévention du harcèlement organisée", attendu: ["SST-CTL-HAR-04"],
    f: avec(f => { f.risquesHarcelementEvalues = "non"; f.mesuresPreventionHarcelement = "non"; }) },
  { nom: "Signalement de harcèlement resté sans réaction", attendu: ["SST-CTL-HAR-05", "SST-CTL-PEN-01"],
    f: avec(f => { f.signalement = { recu: "oui", enqueteMenee: "non", mesuresPrises: "non" }; }) },
];

/* Les dossiers où une donnée décisive manque : les contrôles concernés ne
   concluent dans aucun sens. */
const INDETERMINES = [
  { nom: "Effectif non renseigné", ctl: ["SST-CTL-DUERP-03", "SST-CTL-DUERP-05", "SST-CTL-CSSCT-01", "SST-CTL-HAR-01"],
    f: avec(f => { delete f.effectif; }) },
  { nom: "Existence du comité non renseignée", ctl: ["SST-CTL-DUERP-07", "SST-CTL-CSSCT-05", "SST-CTL-HAR-02"],
    f: avec(f => { f.cse = {}; }) },
];

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
        echecs.push(`${cas.nom} : ${id} rend « ${v[id].etat} » au lieu de « non conforme » — ${v[id].motif.slice(0, 140)}`);
  }

  /* 2. Tout contrôle capable de dire non doit l'avoir dit au moins une fois. */
  const aDitNon = new Set();
  for (const cas of CAS) {
    const v = verdicts(cas.f);
    for (const [id, x] of Object.entries(v)) if (x.etat === NC) aDitNon.add(id);
  }
  const jamais = C.map(c => c.id).filter(id => !aDitNon.has(id));
  /* Ici, TOUS les contrôles connaissent la non-conformité — y compris celui
     d'exposition, qui la constate sans jamais rendre l'état inverse. */
  if (jamais.length) echecs.push(`Contrôles jamais éprouvés en non-conformité : ${jamais.join(", ")}.`);

  /* 3. Sur une fiche vide : ni conforme ni sans objet. */
  const videf = verdicts({});
  let survide = 0;
  for (const [id, x] of Object.entries(videf))
    if (x.etat === CONF || x.etat === SO) { survide++; echecs.push(`Fiche vide : ${id} rend « ${x.etat} ».`); }

  /* 4. Le contrôle d'exposition ne rend jamais conforme. */
  let penConforme = 0;
  for (const cas of [{ nom: "référence", f: BASE }, ...CAS, ...INDETERMINES]) {
    const v = verdicts(cas.f);
    for (const id of DETECTION) if (v[id].etat === CONF) { penConforme++;
      echecs.push(`${cas.nom} : ${id} rend « conforme », ce qu'il s'interdit.`); }
  }

  /* 5. Une donnée décisive absente : les contrôles concernés ne concluent pas. */
  let conclus = 0;
  for (const cas of INDETERMINES) {
    const v = verdicts(cas.f);
    for (const id of cas.ctl)
      if (v[id].etat !== MANQ) { conclus++;
        echecs.push(`${cas.nom} : ${id} rend « ${v[id].etat} » sur une donnée décisive absente.`); }
  }

  const capables = C.filter(c => aDitNon.has(c.id)).length;
  console.log(`${CAS.length + INDETERMINES.length} dossiers contradictoires · ${C.length} contrôles`);
  console.log(`contrôles capables de constater une non-conformité : ${C.length}, éprouvés ${capables}`);
  console.log(`sur un dossier vide : ${survide} verdict(s) « conforme » ou « sans objet »`);
  console.log(`sur une donnée décisive absente : ${conclus} contrôle(s) ont conclu`);
  console.log(`contrôle d'exposition rendu « conforme » : ${penConforme} fois`);
  if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
  console.log("tout est vert");
}
