/* Les dossiers construits pour mettre les contrôles « discipline et règlement
   intérieur » en défaut.

   La règle du dépôt : tout contrôle capable de constater une non-conformité
   doit la constater au moins une fois sur ces dossiers, sans quoi la
   publication échoue. Sur un dossier vide, aucun contrôle ne rend « conforme »
   ni « sans objet » ; et le contrôle d'exposition (DIS-CTL-EXP-01) ne rend
   jamais « conforme », parce que la régularité d'une sanction se juge et qu'un
   blanc-seing serait faux.

   Le dossier pivot du module — celui que la page d'audit sert d'exemple de
   manquement — est « Avertissement notifié sans l'entretien que le règlement
   intérieur impose » : le règlement subordonne le licenciement à l'existence de
   sanctions antérieures, ce qui institue une garantie de fond et rend
   l'entretien préalable obligatoire alors même que L. 1332-2 ne l'imposerait
   pas (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204).

   Usage : node tests-discipline.js      */
const { C, ETATS, DETECTION } = require("./controles-discipline.js");
const { CONF, NC, RISQ, MANQ, SO } = ETATS;
const fs = require("fs");

const BASE = JSON.parse(fs.readFileSync(__dirname + "/fiche-discipline.json", "utf8"));

const clone = o => JSON.parse(JSON.stringify(o));
function avec(mod) { const f = clone(BASE); mod(f); return f; }

const CAS = [
  /* ------------------------------------------- le règlement intérieur */
  { nom: "Deux cent quarante salariés sans règlement intérieur",
    attendu: ["DIS-CTL-RI-01", "DIS-CTL-SAN-03", "DIS-CTL-SAN-04", "DIS-CTL-EXP-01"],
    f: avec(f => { f.ri.existe = "non"; }) },
  { nom: "Règlement intérieur muet sur la discipline", attendu: ["DIS-CTL-RI-02"],
    f: avec(f => { f.ri.contenuDiscipline = "non"; }) },
  { nom: "Aucune échelle des sanctions, aucune durée maximale de mise à pied",
    attendu: ["DIS-CTL-RI-03", "DIS-CTL-SAN-04"],
    f: avec(f => { f.ri.echelleSanctions = "non"; f.ri.misePiedDureeMax = "non"; }) },
  { nom: "Aucun rappel des droits de la défense ni du dispositif d'alerte",
    attendu: ["DIS-CTL-RI-04"],
    f: avec(f => { f.ri.rappelDroitsDefense = "non"; f.ri.rappelLanceursAlerte = "non"; }) },
  { nom: "Clauses prohibées par L. 1321-3", attendu: ["DIS-CTL-RI-05"],
    f: avec(f => { f.ri.clausesInterdites = "oui"; }) },
  { nom: "Clause de neutralité ni justifiée ni proportionnée", attendu: ["DIS-CTL-RI-05"],
    f: avec(f => { f.ri.clauseNeutralite = "oui"; f.ri.neutraliteJustifieeProportionnee = "non"; }) },
  { nom: "Règlement intérieur introduit sans l'avis du comité", attendu: ["DIS-CTL-RI-06"],
    f: avec(f => { f.ri.avisCSE = "non"; }) },
  { nom: "Aucune publicité du règlement intérieur", attendu: ["DIS-CTL-RI-07"],
    f: avec(f => { f.ri.publicite = "non"; }) },
  { nom: "Entrée en vigueur moins d'un mois après la dernière formalité",
    attendu: ["DIS-CTL-RI-07"],
    f: avec(f => { f.ri.dateDerniereFormalite = "2019-09-02"; f.ri.dateEntreeVigueur = "2019-09-20"; }) },
  { nom: "Règlement intérieur jamais déposé au greffe du conseil de prud'hommes",
    attendu: ["DIS-CTL-RI-08"],
    f: avec(f => { f.ri.depotGreffe = "non"; }) },
  { nom: "Règlement intérieur jamais communiqué à l'inspection du travail",
    attendu: ["DIS-CTL-RI-09"],
    f: avec(f => { f.ri.communicationInspection = "non"; }) },
  { nom: "Règlement intérieur communiqué en un seul exemplaire", attendu: ["DIS-CTL-RI-09"],
    f: avec(f => { f.ri.communicationDeuxExemplaires = "non"; }) },
  { nom: "Règlement intérieur rédigé dans une autre langue", attendu: ["DIS-CTL-RI-10"],
    f: avec(f => { f.ri.redigeFrancais = "non"; }) },
  { nom: "Clauses modifiées sans reprendre les formalités", attendu: ["DIS-CTL-RI-11"],
    f: avec(f => { f.ri.modifieDepuis = "oui"; f.ri.modificationsFormalites = "non"; }) },
  { nom: "Notes de service générales et permanentes hors formalités",
    attendu: ["DIS-CTL-RI-11"],
    f: avec(f => { f.ri.notesServiceGenerales = "oui"; f.ri.notesServiceFormalites = "non"; }) },
  { nom: "Demande de retrait de l'inspecteur du travail restée sans suite",
    attendu: ["DIS-CTL-RI-12"],
    f: avec(f => { f.ri.demandeInspection = "oui"; f.ri.suiteDemandeInspection = "non"; }) },

  /* ------------------------------------------------ la sanction auditée */
  { nom: "Sanction prise sans griefs écrits", attendu: ["DIS-CTL-SAN-01", "DIS-CTL-EXP-01"],
    f: avec(f => { f.sanction.griefsEcrits = "non"; }) },
  { nom: "Amende prononcée contre le salarié",
    attendu: ["DIS-CTL-SAN-02", "DIS-CTL-EXP-01"],
    f: avec(f => { f.sanction.nature = "sanction pécuniaire ou amende";
      f.sanction.dureeMisePiedJours = ""; }) },
  { nom: "Retenue sur salaire étrangère à toute suspension du contrat",
    attendu: ["DIS-CTL-SAN-02"],
    f: avec(f => { f.sanction.retenueSalaire = "oui"; }) },
  { nom: "Sanction non prévue par l'échelle du règlement intérieur",
    attendu: ["DIS-CTL-SAN-03"],
    f: avec(f => { f.sanction.prevueRI = "non"; }) },
  { nom: "Mise à pied de dix jours quand le règlement en fixe cinq",
    attendu: ["DIS-CTL-SAN-04"],
    f: avec(f => { f.sanction.dureeMisePiedJours = 10; }) },
  { nom: "Poursuites engagées plus de deux mois après la connaissance des faits",
    attendu: ["DIS-CTL-SAN-05", "DIS-CTL-EXP-01"],
    f: avec(f => { f.sanction.dateConnaissance = "2026-03-01"; }) },
  { nom: "Sanction antérieure de plus de trois ans invoquée", attendu: ["DIS-CTL-SAN-06"],
    f: avec(f => { f.sanction.sanctionsAnterieuresInvoquees = "oui";
      f.sanction.dateSanctionAnterieurePlusAncienne = "2022-01-05"; }) },

  /* Le dossier pivot : l'avertissement notifié sans l'entretien que le
     règlement intérieur impose — garantie de fond. */
  { nom: "Avertissement notifié sans l'entretien que le règlement intérieur impose",
    attendu: ["DIS-CTL-SAN-07", "DIS-CTL-SAN-08", "DIS-CTL-EXP-01"],
    f: avec(f => {
      f.sanction.nature = "avertissement";
      f.sanction.incidence = "non";
      f.sanction.prevueRI = "oui";
      f.sanction.dureeMisePiedJours = "";
      f.sanction.convocationEnvoyee = "non";
      f.sanction.dateConvocation = "";
      f.sanction.convocationObjet = ""; f.sanction.convocationDateHeureLieu = "";
      f.sanction.convocationAssistance = ""; f.sanction.convocationRemise = "";
      f.sanction.entretienTenu = "non";
      f.sanction.dateEntretien = "";
      f.sanction.dateNotification = "2026-07-06";
      f.garantie.licenciementSubordonneSanctions = "oui";
      f.garantie.source = "le règlement intérieur";
    }) },

  { nom: "Mise à pied disciplinaire prononcée sans entretien préalable",
    attendu: ["DIS-CTL-SAN-07", "DIS-CTL-SAN-08", "DIS-CTL-EXP-01"],
    f: avec(f => { f.sanction.convocationEnvoyee = "non"; f.sanction.dateConvocation = "";
      f.sanction.convocationObjet = ""; f.sanction.convocationDateHeureLieu = "";
      f.sanction.convocationAssistance = ""; f.sanction.convocationRemise = "";
      f.sanction.entretienTenu = "non"; f.sanction.dateEntretien = ""; }) },
  { nom: "Convocation muette sur le droit d'être assisté", attendu: ["DIS-CTL-SAN-08"],
    f: avec(f => { f.sanction.convocationAssistance = "non"; }) },
  { nom: "Convocation remise par un autre mode que le récépissé ou la recommandée",
    attendu: ["DIS-CTL-SAN-08"],
    f: avec(f => { f.sanction.convocationRemise = "autre mode"; }) },
  { nom: "Sanction notifiée le lendemain de l'entretien", attendu: ["DIS-CTL-SAN-09"],
    f: avec(f => { f.sanction.dateNotification = "2026-07-01"; }) },
  { nom: "Sanction notifiée plus d'un mois après l'entretien",
    attendu: ["DIS-CTL-SAN-09", "DIS-CTL-EXP-01"],
    f: avec(f => { f.sanction.dateNotification = "2026-08-10"; }) },
  { nom: "Décision de sanction non motivée", attendu: ["DIS-CTL-SAN-10"],
    f: avec(f => { f.sanction.notificationMotivee = "non"; }) },
  { nom: "Notification par un autre mode que le récépissé ou la recommandée",
    attendu: ["DIS-CTL-SAN-10"],
    f: avec(f => { f.sanction.notificationRemise = "autre mode"; }) },
  { nom: "Mise à pied conservatoire suivie d'une sanction sans procédure",
    attendu: ["DIS-CTL-SAN-11", "DIS-CTL-SAN-07"],
    f: avec(f => { f.sanction.misePiedConservatoire = "oui";
      f.sanction.convocationEnvoyee = "non"; f.sanction.dateConvocation = "";
      f.sanction.convocationObjet = ""; f.sanction.convocationDateHeureLieu = "";
      f.sanction.convocationAssistance = ""; f.sanction.convocationRemise = "";
      f.sanction.entretienTenu = "non"; f.sanction.dateEntretien = ""; }) },

  /* ------------------------------------------------- la garantie de fond */
  { nom: "Organisme conventionnel jamais consulté avant la sanction",
    attendu: ["DIS-CTL-SAN-12", "DIS-CTL-EXP-01"],
    f: avec(f => { f.garantie.suivie = "non"; }) },
  { nom: "Licenciement prononcé sans consulter l'organisme prévu par le règlement intérieur",
    attendu: ["DIS-CTL-SAN-12", "DIS-CTL-EXP-01"],
    f: avec(f => { f.sanction.nature = "licenciement disciplinaire";
      f.sanction.dureeMisePiedJours = "";
      f.garantie.source = "le règlement intérieur"; f.garantie.suivie = "non"; }) },
  { nom: "Avis rendu tardivement, ayant privé le salarié de sa défense",
    attendu: ["DIS-CTL-SAN-12"],
    f: avec(f => { f.garantie.suivie = "tardivement ou imparfaitement";
      f.garantie.droitsDefensePrives = "oui"; f.garantie.influenceDecision = "non"; }) },
];

/* Les dossiers où une donnée décisive manque : les contrôles concernés ne
   concluent dans aucun sens. */
const INDETERMINES = [
  { nom: "Effectif non renseigné", ctl: ["DIS-CTL-RI-01", "DIS-CTL-SAN-03"],
    f: avec(f => { delete f.effectif; }) },
  { nom: "Existence du règlement intérieur non renseignée",
    ctl: ["DIS-CTL-RI-02", "DIS-CTL-RI-05", "DIS-CTL-RI-07", "DIS-CTL-RI-11", "DIS-CTL-RI-12"],
    f: avec(f => { f.ri.existe = ""; }) },
  { nom: "Sanction auditée non renseignée",
    ctl: ["DIS-CTL-SAN-01", "DIS-CTL-SAN-05", "DIS-CTL-SAN-09", "DIS-CTL-SAN-12"],
    f: avec(f => { f.sanction.auditee = ""; }) },
  { nom: "Nature de la sanction non renseignée",
    ctl: ["DIS-CTL-SAN-02", "DIS-CTL-SAN-04"],
    f: avec(f => { f.sanction.nature = ""; }) },
  { nom: "Existence du comité non renseignée", ctl: ["DIS-CTL-RI-06"],
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
        echecs.push(`${cas.nom} : ${id} rend « ${v[id].etat} » au lieu de « non conforme » — ${(v[id].motif || "").slice(0, 160)}`);
  }

  /* 2. Tout contrôle capable de dire non doit l'avoir dit au moins une fois. */
  const aDitNon = new Set();
  for (const cas of CAS) {
    const v = verdicts(cas.f);
    for (const [id, x] of Object.entries(v)) if (x.etat === NC) aDitNon.add(id);
  }
  const jamais = C.map(c => c.id).filter(id => !aDitNon.has(id));
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

  /* 6. Le dossier pivot : la non-conformité doit être MOTIVÉE par la garantie
        de fond, décision à l'appui. Un module qui constaterait l'irrégularité
        sans dire d'où elle vient n'apprendrait rien à personne. */
  const pivot = CAS.find(c => /garantie|règlement intérieur impose/.test(c.nom) && /Avertissement/.test(c.nom));
  if (!pivot) echecs.push("Le dossier pivot « avertissement sans entretien » est absent des cas.");
  else {
    const m = verdicts(pivot.f)["DIS-CTL-SAN-07"].motif || "";
    if (!/garantie de fond/i.test(m)) echecs.push("Dossier pivot : le motif de DIS-CTL-SAN-07 ne parle pas de garantie de fond.");
    if (!/10-14\.104/.test(m)) echecs.push("Dossier pivot : le motif de DIS-CTL-SAN-07 ne cite pas Soc., 3 mai 2011, n° 10-14.104.");
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
