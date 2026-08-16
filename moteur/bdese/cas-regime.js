/* Les cas d'épreuve du moteur de régime.

   C'est le second livrable que la validation du projet exigeait avant d'écrire
   le reste : la preuve que le régime applicable est déduit correctement, y
   compris dans les cas de franchissement de seuil, et que le module dit
   « indéterminé » là où il ne sait pas — au lieu de retomber sur le supplétif,
   qui est l'erreur que ce module a pour objet de ne pas commettre.

   Chaque cas porte son attendu. Un cas qui échoue fait échouer la publication.

   Usage : node cas-regime.js      */
const R = require("./regime-bdese.js");
const { REGIMES } = R;

const CAS = [
  /* --- ce qui reste indéterminé --- */
  { nom: "Dossier vide", f: {}, regime: REGIMES.INDETERMINE, cause: "recherche non déclarée" },
  { nom: "Recherche d'accord non conduite", f: { accordRecherche: false, effectif: 420 },
    regime: REGIMES.INDETERMINE, cause: "recherche non faite" },
  { nom: "Accord d'entreprise déclaré mais non versé",
    f: { accordRecherche: true, accordEntreprise: true, effectif: 420 },
    regime: REGIMES.INDETERMINE, cause: "accord déclaré non versé" },
  { nom: "Accord de branche déclaré mais non versé",
    f: { accordRecherche: true, accordBranche: true, effectif: 120 },
    regime: REGIMES.INDETERMINE, cause: "accord de branche non versé" },
  { nom: "Aucun accord, effectif inconnu",
    f: { accordRecherche: true, accordEntreprise: false, accordBranche: false },
    regime: REGIMES.INDETERMINE, cause: "effectif inconnu" },

  /* --- les accords --- */
  { nom: "Accord d'entreprise versé",
    f: { accordRecherche: true, accordEntreprise: true, accordEntrepriseVerse: true, effectif: 420 },
    regime: REGIMES.ACCORD_ENTREPRISE },
  { nom: "Accord d'entreprise versé, petite entreprise",
    f: { accordRecherche: true, accordEntreprise: true, accordEntrepriseVerse: true, effectif: 60 },
    regime: REGIMES.ACCORD_ENTREPRISE },
  { nom: "Accord de branche versé, moins de trois cents",
    f: { accordRecherche: true, accordBranche: true, accordBrancheVerse: true, effectif: 120 },
    regime: REGIMES.ACCORD_BRANCHE },

  /* --- le cas qui trompe : l'accord de branche au-delà de trois cents --- */
  { nom: "Accord de branche versé, mais trois cents salariés et plus",
    f: { accordRecherche: true, accordBranche: true, accordBrancheVerse: true, effectif: 340 },
    regime: REGIMES.SUPPLETIF, article: "R. 2312-9" },

  /* --- le supplétif, de part et d'autre du seuil de contenu --- */
  { nom: "Aucun accord, moins de trois cents",
    f: { accordRecherche: true, accordEntreprise: false, accordBranche: false, effectif: 299 },
    regime: REGIMES.SUPPLETIF, article: "R. 2312-8" },
  { nom: "Aucun accord, exactement trois cents",
    f: { accordRecherche: true, accordEntreprise: false, accordBranche: false, effectif: 300 },
    regime: REGIMES.SUPPLETIF, article: "R. 2312-9" },
];

/* Les dates : ce que L. 2312-2 et L. 2312-34 commandent. */
const CAS_DATES = [
  { nom: "Cinquante atteint, mandat lointain",
    f: { effectif: 80, dateSeuil50Atteint: "2025-06-30", dateFinMandat: "2028-05-01" },
    attributions: "2026-06-30", regle: "L. 2312-2, première phrase" },

  { nom: "Cinquante atteint, mandat expirant moins d'un an après le terme",
    f: { effectif: 80, dateSeuil50Atteint: "2025-06-30", dateFinMandat: "2027-01-15",
         dateRenouvellementCSE: "2027-01-15" },
    attributions: "2028-01-15", regle: "L. 2312-2, seconde phrase" },

  { nom: "Mandat court, renouvellement inconnu : aucune date annoncée",
    f: { effectif: 80, dateSeuil50Atteint: "2025-06-30", dateFinMandat: "2027-01-15" },
    attributions: null, regle: "L. 2312-2, seconde phrase", avertissement: true },

  { nom: "Trois cents franchi : un an pour s'y conformer",
    f: { effectif: 340, dateSeuil300Franchi: "2026-02-01" },
    contenu300: "2027-02-01" },

  { nom: "Trois cents atteint sans date de franchissement",
    f: { effectif: 340 }, contenu300: null, avertissement: true },
];

/* Les délais de consultation : R. 2312-6, et l'accord de L. 2312-19 qui les
   déplace — un accord distinct de celui de la base. */
const CAS_DELAIS = [
  { nom: "Aucune expertise", f: { consultation: { nbExpertises: 0, dateMiseADisposition: "2026-03-02" } }, mois: 1, terme: "2026-04-02" },
  { nom: "Un expert", f: { consultation: { nbExpertises: 1, dateMiseADisposition: "2026-03-02" } }, mois: 2, terme: "2026-05-02" },
  { nom: "Central et établissements avec expertises",
    f: { consultation: { nbExpertises: 2, centralEtEtablissements: true, dateMiseADisposition: "2026-03-02" } }, mois: 3, terme: "2026-06-02" },
  { nom: "Accord fixant les délais : le supplétif ne s'applique pas",
    f: { accordDelaisConsultation: true, consultation: { nbExpertises: 0 } }, connu: false },
];

module.exports = { CAS, CAS_DATES, CAS_DELAIS };

if (require.main === module) {
  const echecs = [];

  for (const c of CAS) {
    const r = R.regime(c.f);
    if (r.regime !== c.regime) echecs.push(`${c.nom} : régime « ${r.regime} » au lieu de « ${c.regime} ».`);
    if (c.cause && r.cause !== c.cause) echecs.push(`${c.nom} : cause « ${r.cause} » au lieu de « ${c.cause} ».`);
    if (c.article && r.article !== c.article) echecs.push(`${c.nom} : article ${r.article} au lieu de ${c.article}.`);
  }

  for (const c of CAS_DATES) {
    const e = R.exigibilite(c.f);
    if ("attributions" in c) {
      const d = e.attributions ? e.attributions.date : null;
      if (d !== c.attributions) echecs.push(`${c.nom} : attributions au ${d} au lieu de ${c.attributions}.`);
      if (c.regle && e.attributions && e.attributions.regle !== c.regle)
        echecs.push(`${c.nom} : règle « ${e.attributions.regle} » au lieu de « ${c.regle} ».`);
    }
    if ("contenu300" in c) {
      const d = e.contenu300 ? e.contenu300.date : null;
      if (d !== c.contenu300) echecs.push(`${c.nom} : contenu R. 2312-9 exigible au ${d} au lieu de ${c.contenu300}.`);
    }
    if (c.avertissement && !e.avertissements.length)
      echecs.push(`${c.nom} : aucun avertissement, alors que la date ne peut pas être calculée.`);
  }

  for (const c of CAS_DELAIS) {
    const d = R.delaiConsultation(c.f);
    if ("connu" in c && d.connu !== c.connu) echecs.push(`${c.nom} : délai ${d.connu ? "calculé" : "non calculé"}, contrairement à l'attendu.`);
    if (c.mois && d.mois !== c.mois) echecs.push(`${c.nom} : ${d.mois} mois au lieu de ${c.mois}.`);
    if (c.terme && d.terme !== c.terme) echecs.push(`${c.nom} : terme au ${d.terme} au lieu de ${c.terme}.`);
  }

  /* R. 2312-10 : les trois années suivantes admettent les grandes tendances.
     Ce n'est pas un détail de présentation — un contrôle qui exigerait six
     colonnes chiffrées produirait des non-conformités fausses. */
  const a = R.annees({}, 2026);
  if (!a.tendancesAdmises) echecs.push("R. 2312-10 : les grandes tendances devraient être admises pour les années suivantes.");
  if (a.suivantes.length !== 3 || a.passees.length !== 2)
    echecs.push("R. 2312-10 : la couverture devrait être de deux années passées, l'année en cours et trois années suivantes.");

  console.log(`${CAS.length} cas de régime · ${CAS_DATES.length} cas de dates · ${CAS_DELAIS.length} cas de délais`);
  const indetermines = CAS.filter(c => c.regime === REGIMES.INDETERMINE).length;
  console.log(`dont ${indetermines} cas où le module doit répondre « indéterminé » plutôt que retomber sur le supplétif`);
  if (echecs.length) { console.error("\n" + echecs.join("\n")); process.exit(1); }
  console.log("tout est vert");
}
