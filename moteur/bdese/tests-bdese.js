/* Les dossiers construits pour mettre les contrôles en défaut.

   Trois épreuves de principe s'ajoutent aux dossiers contradictoires :

   — sur un dossier vide, aucun contrôle ne rend « conforme » ni « sans objet » ;
   — sur un dossier dont le régime est indéterminé, aucun contrôle de contenu ne
     conclut : c'est la règle propre à ce module, et celle qu'il serait le plus
     coûteux d'oublier — auditer un contenu sans savoir quel texte le commande,
     c'est produire des non-conformités inventées ;
   — le contrôle de preuve ne rend jamais « conforme » : l'application constitue
     le contenu de la base, elle ne la met pas à disposition.

   Usage : node tests-bdese.js      */
const { C, ETATS, DETECTION } = require("./controles-bdese.js");
const R = require("./regime-bdese.js");
const { CONF, NC, RISQ, MANQ, SO } = ETATS;

const BASE = {
  entreprise: "SOCIÉTÉ D'EXEMPLE SAS", dateAudit: "2026-08-16",
  effectif: 420, etablissementsDistincts: false,
  accordRecherche: true, accordEntreprise: false, accordBranche: false,
  pieces: [],
  dateSeuil50Atteint: "2019-03-01", dateFinMandat: "2029-05-01",
  dateSeuil300Franchi: "2024-02-01",
  base: {
    /* Les dix rubriques du supplétif de R. 2312-9, telles que le décret les
       nomme : elles sont reprises du découpage, non recopiées à la main. */
    themes: require("./contenu-bdese.js").construire().contenu["au moins300"]
      .rubriques.map(r => ({ theme: r.titre, renseigne: "oui" })),
    anneesPassees: 2, anneesSuivantes: 3,
    formePerspectives: "grandes tendances",
    informationsNonRenseignables: ["Les investissements immatériels au-delà de N+1 — le plan d'affaires ne va pas plus loin"],
    support: "espace informatique dédié, accès nominatif",
    beneficiaires: ["membres titulaires et suppléants du comité", "délégués syndicaux"],
    niveau: "entreprise",
    dateDerniereMiseAJour: "2026-06-30",
    informationMiseAJour: true,
    preuveAcces: "journal de connexion horodaté",
  },
  accordPeriodiciteConsultations: false,
  accordDelaisConsultation: false,
  consultation: { dateMiseADisposition: "2026-05-04", nbExpertises: 0,
    centralEtEtablissements: false, dateAvis: "2026-05-28" },
};

const clone = o => JSON.parse(JSON.stringify(o));
function avec(mod) { const f = clone(BASE); mod(f); return f; }

const CAS = [
  { nom: "Un thème du plancher retiré de la base", attendu: ["BDESE-CTL-CNT-01"],
    f: avec(f => { /* Le décret écrit « Egalité » sans accent : le filtre doit l'ignorer,
       sinon le dossier n'est pas celui qu'on croit avoir construit. */
      f.base.themes = f.base.themes.filter(t => !/galit. professionnelle/i.test(t.theme)); }) },
  { nom: "Deux rubriques du décret non renseignées", attendu: ["BDESE-CTL-CNT-02"],
    f: avec(f => { f.base.themes = f.base.themes.slice(0, 8); }) },
  { nom: "Base ne couvrant qu'une année passée", attendu: ["BDESE-CTL-CNT-03"],
    f: avec(f => { f.base.anneesPassees = 1; }) },
  { nom: "Aucune perspective renseignée", attendu: ["BDESE-CTL-CNT-04"],
    f: avec(f => { f.base.formePerspectives = "aucune"; }) },
  { nom: "Base non actualisée depuis dix-huit mois", attendu: ["BDESE-CTL-MAD-02"],
    f: avec(f => { f.base.dateDerniereMiseAJour = "2025-01-05"; }) },
  { nom: "Bénéficiaires non informés des mises à jour", attendu: ["BDESE-CTL-MAD-03"],
    f: avec(f => { f.base.informationMiseAJour = false; }) },
  { nom: "Accord de branche invoqué au-delà de trois cents salariés", attendu: ["BDESE-CTL-REG-02"],
    f: avec(f => { f.accordBranche = true; f.accordBrancheVerse = true; f.pieces = [{ type: "accord-branche", date: "2023-01-01" }]; }) },
  { nom: "Périodicité des consultations portée à quatre ans", attendu: ["BDESE-CTL-CSL-01"],
    f: avec(f => { f.accordPeriodiciteConsultations = true; f.periodiciteConsultations = 4; f.reunionsAnnuellesAccord = 6; }) },
  { nom: "Accord prévoyant quatre réunions annuelles", attendu: ["BDESE-CTL-CSL-02"],
    f: avec(f => { f.accordPeriodiciteConsultations = true; f.periodiciteConsultations = 3; f.reunionsAnnuellesAccord = 4; }) },
  { nom: "Supplétif retenu alors qu'un accord est versé", attendu: ["BDESE-CTL-COH-01"],
    f: avec(f => { f.pieces = [{ type: "accord-bdese", date: "2022-09-01" }]; }) },

  /* Les états intermédiaires : ce que le module doit refuser de trancher. */
  { nom: "Perspectives en tendances, sans liste des informations non renseignables",
    attendu: [], risque: ["BDESE-CTL-CNT-04"],
    f: avec(f => { delete f.base.informationsNonRenseignables; }) },
  { nom: "Accord fixant les délais de consultation, non versé",
    attendu: [], risque: ["BDESE-CTL-CSL-03"],
    f: avec(f => { f.accordDelaisConsultation = true; }) },
  { nom: "Accès des délégués syndicaux non déclaré",
    attendu: [], risque: ["BDESE-CTL-MAD-01"],
    f: avec(f => { f.base.beneficiaires = ["membres du comité"]; }) },
  { nom: "Mandat court et renouvellement inconnu",
    attendu: [], risque: ["BDESE-CTL-DAT-01"],
    f: avec(f => { f.dateSeuil50Atteint = "2026-01-15"; f.dateFinMandat = "2027-06-01"; }) },
];

/* Les dossiers dont le régime est indéterminé : aucun contrôle de contenu ne
   doit y conclure, dans aucun sens. */
const REGIME_INCONNU = [
  { nom: "Recherche d'accord non déclarée", f: avec(f => { delete f.accordRecherche; }) },
  { nom: "Recherche non conduite", f: avec(f => { f.accordRecherche = false; }) },
  { nom: "Accord déclaré mais non versé", f: avec(f => { f.accordEntreprise = true; }) },
];
const CONTENU_CTL = ["BDESE-CTL-CNT-01", "BDESE-CTL-CNT-02", "BDESE-CTL-CNT-03", "BDESE-CTL-CNT-04"];

function verdicts(f) {
  const o = {};
  for (const c of C) {
    try { o[c.id] = c.verdict(f); }
    catch (e) { o[c.id] = { etat: MANQ, motif: "Contrôle non exécutable : " + e.message }; }
  }
  return o;
}

module.exports = { CAS, BASE, REGIME_INCONNU, verdicts };

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

  const peutDireNon = C.filter(c => /etat: NC/.test(String(c.brut || c.verdict))).map(c => c.id);
  const ontDitNon = new Set(CAS.flatMap(c => c.attendu));
  const jamais = peutDireNon.filter(id => !ontDitNon.has(id));

  const vide = verdicts({});
  const surVide = Object.entries(vide).filter(([, v]) => v.etat === CONF || v.etat === SO)
    .map(([id, v]) => `${id} → ${v.etat}`);

  /* La règle propre au module. */
  const surRegimeInconnu = [];
  for (const cas of REGIME_INCONNU) {
    if (R.regime(cas.f).regime !== R.REGIMES.INDETERMINE) {
      echecs.push(`${cas.nom} : le régime devrait être indéterminé.`); continue;
    }
    const v = verdicts(cas.f);
    for (const id of CONTENU_CTL)
      if (v[id] && v[id].etat !== MANQ) surRegimeInconnu.push(`${cas.nom} : ${id} → ${v[id].etat}`);
  }

  const preuveConforme = [];
  for (const cas of [{ nom: "référence", f: BASE }, ...CAS]) {
    const v = verdicts(cas.f);
    for (const id of DETECTION) if (v[id] && v[id].etat === CONF) preuveConforme.push(`${cas.nom} : ${id}`);
  }

  console.log(`${CAS.length} dossiers contradictoires · ${C.length} contrôles`);
  console.log(`contrôles capables de constater une non-conformité : ${peutDireNon.length}, éprouvés ${ontDitNon.size}`);
  console.log(`sur un dossier vide : ${surVide.length} verdict(s) « conforme » ou « sans objet »`);
  console.log(`sur un régime indéterminé : ${surRegimeInconnu.length} contrôle(s) de contenu ont conclu`);
  console.log(`contrôle de preuve rendu « conforme » : ${preuveConforme.length} fois`);
  echecs = echecs
    .concat(jamais.map(id => `${id} peut constater une non-conformité, mais aucun dossier ne le lui fait dire.`))
    .concat(surVide.map(x => `Sur un dossier vide, ${x} : le silence n'est pas une réponse.`))
    .concat(surRegimeInconnu.map(x => `${x} : un contenu ne s'audite pas sur un régime indéterminé.`))
    .concat(preuveConforme.map(x => `${x} : l'application ne peut pas attester la mise à disposition.`));
  if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
  console.log("tout est vert");
}
