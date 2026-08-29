/* Les modèles de régularisation — étape 5 du parcours client, module santé,
   sécurité et conditions de travail.

   Chaque contrôle régularisable a droit à mieux qu'un rappel de texte : une
   note chiffrée sur le dossier remis — l'effectif déclaré, la date de la
   dernière mise à jour du document unique et le nombre de mois écoulés, le
   régime que ce seuil commande, la composition de la commission telle que
   déclarée. Rien n'est une coquille générique : quand une donnée manque pour
   calculer, la note le dit, elle n'invente pas de chiffre.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de seuils (moteur-sst.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit.

   Un seul contrôle n'a pas de modèle : SST-CTL-PEN-01, qui mesure
   l'exposition résultant des autres et ne se régularise pas pour lui-même —
   comme regularisation-sst.js le laisse à null. Les dix-neuf autres en ont
   un. Aucun texte, seuil ou délai cité ici n'est capturé pour l'occasion :
   tous viennent de moteur-sst.js et controles-sst.js, déjà lus à la
   source. */
const O = require("./outils.js");
const M = require("./moteur-sst.js");
const D = require("./dates.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const etatTxt = x => (dit(x) ? "oui" : nie(x) ? "non" : "non renseigné");
const nomE = f => q(f.entreprise) || "l'entreprise auditée";

/* La même échéance annuelle que celle que le contrôle vérifie (R. 4121-2,
   1°) — un an après la date de dernière mise à jour, jour pour jour. */
function echeanceUnAn(iso) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(a + 1, m - 1, j));
  return d.toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════════════ le document unique ═══ */

function modeleDue01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Ce que l'effectif commande, sur ce dossier — " + nomE(f));
  const e = M.effectif(f);
  h1("Les seuils de ce module, confrontés à votre effectif");
  if (!e.connu) p("L'effectif n'est pas renseigné : aucun seuil ne peut être confronté au dossier. Le document unique, lui, est dû dès le premier salarié — la question ne se pose donc pas pour lui.");
  else tab(["Obligation", "Seuil", "Article", "Ici"],
    Object.values(M.SEUILS).map(s => [s.objet, s.seuil + " salariés", s.article,
      e.valeur >= s.seuil ? `due (${e.valeur} ≥ ${s.seuil})` : `non due à ce seuil (${e.valeur} < ${s.seuil})`]));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Document unique existant", etatTxt((f.duerp || {}).existe)],
  ]);
  note("Le document unique est dû par tout employeur, sans seuil d'effectif (L. 4121-3, R. 4121-1) : aucune ligne du tableau ci-dessus ne le concerne, ce qui commande son existence, c'est l'emploi d'un premier salarié.");
  return A.D;
}

function modeleDue02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  const du = f.duerp || {};
  t1("L'inventaire par unité de travail, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  p("Document unique : " + etatTxt(du.existe) + ". Inventaire par unité de travail : " + etatTxt(du.unitesTravail) + ".");
  if (nie(du.unitesTravail))
    p("Sans inventaire par unité de travail, le document ne répond pas à la maille que R. 4121-1 impose : un document global, qui ne distingue ni les postes ni les ateliers, ne vaut pas transcription des risques identifiés dans chaque unité.");
  note("Aucun texte lu ne fixe de nombre minimal d'unités : c'est l'organisation réelle de l'entreprise qui commande le découpage, pas un chiffre.");
  return A.D;
}

function modeleDue03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  const du = f.duerp || {};
  t1("La mise à jour annuelle, sur ce dossier — " + nomE(f));
  const e = M.effectif(f);
  const m = M.majDuerp(f);
  h1("Le calcul, sur ce dossier");
  const rows = [
    ["Effectif déclaré", e.connu ? e.valeur + " salariés" : "non renseigné"],
    ["Mise à jour au moins annuelle due (≥ 11 salariés) ?", e.connu ? (e.valeur >= 11 ? "oui (R. 4121-2, 1°)" : "non — périodicité libre sous réserve d'un niveau équivalent de protection (L. 4121-3, dernier alinéa)") : "ne peut pas être établi"],
    ["Date de la dernière mise à jour déclarée", q(du.dateDerniereMaj) || "non renseignée"],
    ["Date de l'audit", q(f.dateAudit) || "non renseignée"],
    ["Mois écoulés depuis la dernière mise à jour", m.moisEcoules != null ? String(m.moisEcoules) + " mois" : "ne peut pas être calculé"],
  ];
  if (q(du.dateDerniereMaj) && D.estDateISO(du.dateDerniereMaj)) {
    const ech = echeanceUnAn(du.dateDerniereMaj);
    rows.push(["Échéance de l'année en cours (jour pour jour)", ech || "—"]);
  }
  tab(["Point", "Valeur"], rows);
  if (m.etat === "plus d'un an" && e.connu && e.valeur >= 11)
    p(`Le dossier montre un dépassement d'environ ${m.moisEcoules} mois par rapport à la périodicité annuelle de R. 4121-2, 1°. Le retard se compte depuis la date de la dernière version, et il ne cesse qu'avec la version nouvelle.`);
  else if (m.etat === "moins d'un an") p(`Le dossier montre une mise à jour il y a environ ${m.moisEcoules} mois : la périodicité annuelle est tenue en l'état déclaré.`);
  else note("Le calcul suppose une date de dernière mise à jour et une date d'audit renseignées toutes les deux, au format AAAA-MM-JJ.");
  return A.D;
}

function modeleDue04(f) {
  const A = O(); const { t1, h1, p, tab } = A;
  const ev = f.evenement || {};
  t1("La mise à jour événementielle, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Aménagement important ou information nouvelle survenu depuis la dernière mise à jour", etatTxt(ev.survenu)],
    ["Document unique mis à jour en conséquence", etatTxt(ev.majFaite)],
  ]);
  if (dit(ev.survenu) && nie(ev.majFaite))
    p("Un événement déclencheur est déclaré sans mise à jour correspondante : R. 4121-2, 2° et 3°, impose la mise à jour lors de toute décision d'aménagement important ou de toute information nouvelle intéressant l'évaluation d'un risque, indépendamment du calendrier annuel.");
  else if (nie(ev.survenu)) p("Aucun événement déclencheur n'est déclaré : ce cas de mise à jour ne s'est pas présenté en l'état du dossier.");
  return A.D;
}

function modeleDue05(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le régime que le seuil de cinquante salariés commande, sur ce dossier — " + nomE(f));
  const s = M.suitesEvaluation(f);
  h1("Le calcul, sur ce dossier");
  if (!s.connu) { p(s.motif); return A.D; }
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", M.effectif(f).valeur + " salariés"],
    ["Régime applicable", s.regime === "programme annuel" ? "programme annuel de prévention (L. 4121-3-1, III, 1°)" : "liste d'actions consignée au document unique (L. 4121-3-1, III, 2°)"],
  ]);
  if (s.regime === "programme annuel") {
    const p1 = f.programmeAnnuel || {};
    tab(["Sous-point", "État déclaré"], [
      ["Programme établi", etatTxt(p1.existe)],
      ["Présenté au comité (L. 2312-27, 2°)", (f.cse || {}).existe === undefined ? "comité non renseigné" : etatTxt(p1.presenteCSE)],
    ]);
  } else {
    tab(["Sous-point", "État déclaré"], [["Liste d'actions consignée dans le document unique", etatTxt((f.listeActions || {}).consignee)]]);
  }
  note(s.motif);
  return A.D;
}

function modeleDue06(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const du = f.duerp || {};
  t1("Conservation des versions et avis d'accès, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Versions successives conservées (quarante ans au moins — L. 4121-3-1, V ; R. 4121-4)", etatTxt(du.versionsConservees)],
    ["Avis des modalités d'accès affiché (R. 4121-4, dernier alinéa)", etatTxt(du.avisAffiche)],
  ]);
  const griefs = [];
  if (nie(du.versionsConservees)) griefs.push("les versions successives ne sont pas conservées");
  if (nie(du.avisAffiche)) griefs.push("l'avis d'accès n'est pas affiché");
  if (griefs.length) p("Sur ce dossier : " + griefs.join(" ; ") + ".");
  return A.D;
}

function modeleDue07(f) {
  const A = O(); const { t1, h1, tab } = A;
  const du = f.duerp || {}, cse = f.cse || {};
  t1("La consultation du comité sur le document unique, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Comité social et économique existant", etatTxt(cse.existe)],
    ["Comité consulté sur le document unique et ses mises à jour (L. 4121-3, 1°)", etatTxt(du.consultationCSE)],
  ]);
  return A.D;
}

function modeleDue08(f) {
  const A = O(); const { t1, h1, tab } = A;
  const du = f.duerp || {};
  t1("La transmission au service de prévention et de santé au travail, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Document unique transmis au service de prévention et de santé au travail à chaque mise à jour (L. 4121-3-1, VI)", etatTxt(du.transmisSPST)],
  ]);
  return A.D;
}

/* ─────────────────────────────────────────── la commission (CSSCT) ─────── */

function modeleCss01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Pourquoi la commission est due — ou ne l'est pas —, sur ce dossier — " + nomE(f));
  const d = M.cssctDue(f);
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", M.effectif(f).connu ? M.effectif(f).valeur + " salariés" : "non renseigné"],
    ["Établissement distinct d'au moins trois cents salariés", etatTxt(f.etablissementDistinct300)],
    ["Établissement à hauts risques (L. 4521-1 et suivants)", etatTxt(f.etablissementRisqueParticulier)],
    ["Création imposée par l'inspecteur du travail", etatTxt(f.cssctImposeeInspection)],
    ["Commission due", d.due === null ? "ne peut pas être établi" : (d.due ? "oui" + (d.fondement ? " — " + d.fondement : "") : "non à ce seuil")],
    ["Commission existante", etatTxt((f.cssct || {}).existe)],
  ]);
  note(d.motif);
  return A.D;
}

function modeleCss02(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const c = f.cssct || {};
  t1("La composition de la commission, sur ce dossier — " + nomE(f));
  h1("Le calcul, article L. 2315-39, sur ce dossier");
  const n = typeof c.nbMembres === "number" ? c.nbMembres : (c.nbMembres ? Number(c.nbMembres) : null);
  tab(["Exigence de L. 2315-39", "Déclaré", "Résultat"], [
    ["Présidence par l'employeur ou son représentant", etatTxt(c.presideeEmployeur), dit(c.presideeEmployeur) ? "conforme" : (nie(c.presideeEmployeur) ? "manquant" : "à compléter")],
    ["Au moins trois membres représentants du personnel", n === null ? "non renseigné" : String(n), n === null ? "à compléter" : (n >= 3 ? "conforme" : "insuffisant (" + n + " < 3)")],
    ["Au moins un membre du second collège (ou du troisième)", etatTxt(c.membreSecondCollege), dit(c.membreSecondCollege) ? "conforme" : (nie(c.membreSecondCollege) ? "manquant" : "à compléter")],
    ["Désignation par le comité parmi ses membres", etatTxt(c.designesParCSE), dit(c.designesParCSE) ? "conforme" : (nie(c.designesParCSE) ? "manquant" : "à compléter")],
  ]);
  p("Ces quatre exigences sont d'ordre public (L. 2315-39) : aucun accord ne peut ni les écarter ni les réécrire, et une désignation qui les méconnaît encourt l'annulation.");
  return A.D;
}

function modeleCss03(f) {
  const A = O(); const { t1, h1, tab } = A;
  const c = f.cssct || {};
  t1("Ce qui fixe les modalités de la commission, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [["Source des modalités", q(c.modalitesFixees) || "non renseignée"]]);
  return A.D;
}

function modeleCss04(f) {
  const A = O(); const { t1, h1, tab } = A;
  const c = f.cssct || {};
  t1("Les limites de la délégation, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Délégation excluant le recours à l'expert et les attributions consultatives (L. 2315-38)", etatTxt(c.delegationConforme)],
  ]);
  return A.D;
}

function modeleCss05(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const d = M.cssctDue(f);
  t1("La formation santé, sécurité et conditions de travail des élus, sur ce dossier — " + nomE(f));
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Comité social et économique existant", etatTxt((f.cse || {}).existe)],
    ["Commission due (≥ trois cents, ou fondement particulier)", d.due === null ? "ne peut pas être établi" : (d.due ? "oui" : "non")],
    ["Durée due pour les membres de la commission (renouvellement)", d.due ? "cinq jours (L. 2315-18, effectif ≥ 300)" : "trois jours (L. 2315-18, hors commission ou < 300)"],
    ["Formation santé-sécurité assurée", etatTxt(f.formationSSCT)],
  ]);
  p("La durée du premier mandat — cinq jours au minimum — est la même quel que soit l'effectif ; c'est seulement au renouvellement que la commission d'au moins trois cents salariés se distingue (cinq jours au lieu de trois).");
  return A.D;
}

function modeleCss06(f) {
  const A = O(); const { t1, h1, tab, p, note } = A;
  const c = f.cssct || {};
  t1("Le remplacement des membres de la commission, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Remplacement intervenu en cours de mandat", etatTxt(c.remplacementEnCoursDeMandat)],
    ["Cause invoquée", q(c.causeRemplacement) || "non renseignée"],
  ]);
  if (q(c.causeRemplacement)) {
    const ok = M.finAnticipeeMandat(c.causeRemplacement);
    p(`La cause déclarée — « ${c.causeRemplacement} » — ${ok ? "figure" : "ne figure pas"} parmi les fins anticipées de mandat de L. 2314-33 : ${M.FINS_ANTICIPEES.join(", ")}.`);
  }
  note("Ces quatre causes sont les seules qui autorisent le remplacement ; aucun accord d'entreprise n'y déroge (Soc., 28 mai 2026, n° 24-22.914).");
  return A.D;
}

/* ─────────────────────────────────────────────────────── le harcèlement ─── */

function modeleHar01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  const d = M.referentEmployeurDu(f);
  t1("Le référent employeur, sur ce dossier — " + nomE(f));
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Effectif déclaré", M.effectif(f).connu ? M.effectif(f).valeur + " salariés" : "non renseigné"],
    ["Référent employeur dû (≥ 250 salariés — L. 1153-5-1)", d.du === null ? "ne peut pas être établi" : (d.du ? "oui" : "non à ce seuil")],
    ["Référent désigné", etatTxt(f.referentEmployeur)],
  ]);
  note(d.motif);
  return A.D;
}

function modeleHar02(f) {
  const A = O(); const { t1, h1, tab } = A;
  t1("Le référent du comité, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Comité social et économique existant", etatTxt((f.cse || {}).existe)],
    ["Référent harcèlement du comité désigné (L. 2314-1)", etatTxt(f.referentCSE)],
  ]);
  return A.D;
}

function modeleHar03(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  t1("L'information obligatoire, sur ce dossier — " + nomE(f));
  h1("Le calcul, point par point");
  tab(["Composante de D. 1151-1 et des articles cités", "État déclaré"], [
    ["Texte de l'article 222-33-2 du code pénal — harcèlement moral (L. 1152-4)", etatTxt(f.infoHarcelementMoral)],
    ["Texte de l'article 222-33 du code pénal et actions ouvertes — harcèlement sexuel (L. 1153-5)", etatTxt(f.infoHarcelementSexuel)],
    ["Coordonnées des autorités et des référents (D. 1151-1)", etatTxt(f.infoCoordonnees)],
  ]);
  const manquants = [];
  if (nie(f.infoHarcelementMoral)) manquants.push("harcèlement moral");
  if (nie(f.infoHarcelementSexuel)) manquants.push("harcèlement sexuel");
  if (nie(f.infoCoordonnees)) manquants.push("coordonnées");
  if (manquants.length) p("Sur ce dossier, l'information fait défaut sur : " + manquants.join(", ") + ".");
  return A.D;
}

function modeleHar04(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  t1("L'organisation de la prévention, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Risques de harcèlement intégrés à l'évaluation (L. 4121-2, 7°)", etatTxt(f.risquesHarcelementEvalues)],
    ["Dispositions de prévention prises (L. 1152-4, L. 1153-5)", etatTxt(f.mesuresPreventionHarcelement)],
  ]);
  p("Ce module constate l'existence des mesures déclarées ; leur suffisance s'apprécie au fond — ce tableau n'en tient jamais lieu.");
  return A.D;
}

function modeleHar05(f) {
  const A = O(); const { t1, h1, tab, p } = A;
  const s = f.signalement || {};
  t1("La réaction au signalement, sur ce dossier — " + nomE(f));
  h1("L'état déclaré");
  tab(["Point", "Réponse"], [
    ["Signalement reçu", etatTxt(s.recu)],
    ["Enquête menée", etatTxt(s.enqueteMenee)],
    ["Mesures prises pour mettre un terme aux faits", etatTxt(s.mesuresPrises)],
  ]);
  if (dit(s.recu) && (nie(s.enqueteMenee) || nie(s.mesuresPrises)))
    p("Un signalement est déclaré reçu sans que la réaction complète — enquête et mesures — soit établie : L. 1153-5 impose les trois temps, prévenir, mettre un terme, sanctionner.");
  return A.D;
}

const MODELES = {
  "SST-CTL-DUE-01": modeleDue01, "SST-CTL-DUE-02": modeleDue02, "SST-CTL-DUE-03": modeleDue03,
  "SST-CTL-DUE-04": modeleDue04, "SST-CTL-DUE-05": modeleDue05, "SST-CTL-DUE-06": modeleDue06,
  "SST-CTL-DUE-07": modeleDue07, "SST-CTL-DUE-08": modeleDue08,
  "SST-CTL-CSS-01": modeleCss01, "SST-CTL-CSS-02": modeleCss02, "SST-CTL-CSS-03": modeleCss03,
  "SST-CTL-CSS-04": modeleCss04, "SST-CTL-CSS-05": modeleCss05, "SST-CTL-CSS-06": modeleCss06,
  "SST-CTL-HAR-01": modeleHar01, "SST-CTL-HAR-02": modeleHar02, "SST-CTL-HAR-03": modeleHar03,
  "SST-CTL-HAR-04": modeleHar04, "SST-CTL-HAR-05": modeleHar05,
  "SST-CTL-PEN-01": null,
};

module.exports = { MODELES };

if (require.main === module) {
  const { C } = require("./controles-sst.js");
  const manquants = C.filter(c => !Object.prototype.hasOwnProperty.call(MODELES, c.id)).map(c => c.id);
  const orphelins = Object.keys(MODELES).filter(id => !C.some(c => c.id === id));
  if (manquants.length || orphelins.length) {
    if (manquants.length) console.error("ÉCART — contrôle sans entrée de modèle : " + manquants.join(", "));
    if (orphelins.length) console.error("ÉCART — entrée de modèle sans contrôle : " + orphelins.join(", "));
    process.exit(1);
  }
  const aModele = Object.values(MODELES).filter(x => typeof x === "function").length;
  console.log(`${C.length} contrôle(s) · ${aModele} modèle(s) de régularisation chiffrés`);
}
