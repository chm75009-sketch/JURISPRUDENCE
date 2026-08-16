/* Contre-épreuves du module économique.
   Écrites de l'extérieur, sans connaissance de l'implémentation : chacune
   énonce le comportement attendu, pas celui observé. Elles échouent tant que
   le constat correspondant n'est pas corrigé, et passent ensuite — c'est leur
   seule raison d'être.

   Exécution :  node tests-externes.js
   Sortie non nulle si une contre-épreuve échoue.

   Référence : contre-audit du 15 août 2026, constats F-01 à F-19. */

const M = require("./moteur.js");
const { C } = require("./controles.js");
const ctl = id => C.find(x => x.id === id);
const verdict = (id, f) => { try { return ctl(id).verdict(f); } catch (e) { return { etat: "ERREUR", motif: e.message }; } };

let echecs = 0, total = 0;
function epreuve(ref, intitule, fn) {
  total++;
  let ok = false, detail = "";
  try { const r = fn(); ok = r === true; detail = r === true ? "" : String(r); }
  catch (e) { detail = "exception : " + e.message; }
  if (!ok) echecs++;
  console.log(`${ok ? "  ok  " : "ÉCHEC "} ${ref.padEnd(6)} ${intitule}${ok ? "" : "\n         → " + detail}`);
}

/* ------------------------------------------------------------------ F-01 */
epreuve("F-01", "Le seuil de dix se compte sur trente jours, licenciements déjà prononcés compris", () => {
  const r = M.regimeEco({ effectif: 50, nbLicenciements: 9, licenciementsRecents30j: 1, refusModification: 0 });
  return r.pse === true || `9 + 1 sur trente jours donne ${r.code}, plan dû : ${r.pse}`;
});
epreuve("F-01", "Les refus de modification suivis de licenciement entrent dans le total", () => {
  const r = M.regimeEco({ effectif: 50, nbLicenciements: 8, licenciementsRecents30j: 0, refusModification: 2 });
  return r.pse === true || `8 + 2 refus donne ${r.code}, plan dû : ${r.pse}`;
});

/* ------------------------------------------------------------------ F-02 */
epreuve("F-02", "Un refus d'autorisation n'est pas une autorisation", () => {
  const v = verdict("CTL-PRT-01", { salariesProteges: [
    { nom: "A", mandat: "membre du CSE", autorisation: "2026-05-12 — refus de l'inspecteur du travail" }] });
  return v.etat !== "conforme" || `verdict « ${v.etat} » sur un refus : ${v.motif}`;
});
epreuve("F-02", "Une autorisation postérieure à la notification ne vaut pas autorisation", () => {
  const v = verdict("CTL-PRT-01", { dateNotification: "2026-05-16",
    salariesProteges: [{ nom: "B", mandat: "délégué syndical", autorisation: "2026-06-08" }] });
  return v.etat !== "conforme" || `verdict « ${v.etat} » sur une autorisation postérieure de 23 jours`;
});

/* ------------------------------------------------------------------ F-03 */
epreuve("F-03", "Un poste ne peut être à la fois disponible et supprimé", () => {
  const f = { entreprise: "X", postesSupprimes: [{ intitule: "Régleur", avant: 14, apres: 8 }],
    postesDisponibles: [{ societe: "X", intitule: "Régleur", lieu: "Vierzon" }],
    offresFaites: [{ intitule: "Régleur", employeur: "X", salarie: "S1" }] };
  const v = verdict("CTL-REC-07", f);
  return v.etat !== "conforme" || "aucun contrôle ne croise les deux listes";
});

/* ------------------------------------------------------------------ F-04 */
epreuve("F-04", "Un poste unique proposé à cinq salariés ne vaut pas cinq offres", () => {
  const mm = { intitule: "Opérateur", descriptif: "d", employeur: "SŒUR", contrat: "CDI",
    lieu: "Salbris", remuneration: "25 200 €", classification: "N2", dateCertaine: true, delaiReponse: "15 jours" };
  const f = { nbLicenciements: 9, societes: [{ nom: "SŒUR", etranger: false }],
    offresFaites: ["S1","S2","S3","S4","S5"].map(s => ({ ...mm, salarie: s })) };
  const v = verdict("CTL-REC-03", f);
  return v.etat !== "conforme" || "cinq offres portant sur un seul poste sont validées sans réserve";
});

/* ------------------------------------------------------------------ F-05 */
epreuve("F-05", "Un critère d'ordre identique pour tous ne départage personne", () => {
  const cat = n => ({ nom: n, effectif: 9, suppressions: 3, salaries: [
    { nom: n + "1", charges: 0, anciennetePoints: 0, social: 0, qualites: 3 },
    { nom: n + "2", charges: 0, anciennetePoints: 0, social: 0, qualites: 1 }] });
  const v = verdict("CTL-ORD-02", { categories: [cat("A"), cat("B")], salariesProteges: [] });
  return v.etat !== "conforme" || "charges, ancienneté et situation sociale à zéro pour tous : verdict conforme";
});

/* ------------------------------------------------------------------ F-11 */
epreuve("F-11", "Le lundi de Pâques est un jour férié", () => {
  const d = M.ajouteJoursOuvrables("2026-04-01", 5);   /* Pâques 2026 : 5 avril */
  return d === "2026-04-08" || `cinq jours ouvrables depuis le 1er avril donnent ${d}, attendu 2026-04-08`;
});
epreuve("F-11", "L'Ascension est un jour férié", () => {
  const d = M.ajouteJoursOuvrables("2026-05-09", 5);   /* Ascension 2026 : 14 mai */
  return d === "2026-05-16" || `donne ${d}, attendu 2026-05-16`;
});
epreuve("F-11", "Le lundi de Pentecôte est un jour férié", () => {
  const d = M.ajouteJoursOuvrables("2026-05-20", 5);   /* Pentecôte 2026 : 25 mai */
  return d === "2026-05-27" || `donne ${d}, attendu 2026-05-27`;
});

/* ------------------------------------------------------------------ F-12 */
epreuve("F-12", "L'ordre des réunions n'a pas d'influence sur l'expiration du délai", () => {
  const base = { effectif: 200, nbLicenciements: 12, dateInfoCSE: "2026-03-02",
    dateAvisCSE: "avis non rendu", dateNotification: "2026-06-05" };
  const a = verdict("CTL-CSE-04", { ...base, datesReunionsCSE: ["2026-03-16", "2026-03-31"] });
  const b = verdict("CTL-CSE-04", { ...base, datesReunionsCSE: ["2026-03-31", "2026-03-16"] });
  const date = m => (String(m).match(/expire le (\d{4}-\d{2}-\d{2})/) || [])[1] || "?";
  return date(a.motif) === date(b.motif) || `expiration ${date(a.motif)} à l'endroit, ${date(b.motif)} à l'envers`;
});

/* ------------------------------------------------------------------ F-13 */
epreuve("F-13", "La limite territoriale ne s'applique pas avant le 24 septembre 2017", () => {
  const p = M.perimetre({ groupe: true, dateNotification: "2015-06-01",
    societes: [{ nom: "SŒUR ITALIE", etranger: true }] });
  return !(p.exclusions || []).length || `société étrangère exclue sur un dossier de 2015 : ${p.exclusions.join(", ")}`;
});

/* ------------------------------------------------------------------ F-16 */
epreuve("F-16", "Une date impossible ne produit jamais de verdict de conformité", () => {
  const f = { effectif: 60, nbLicenciements: 12, dateNotification: "2026-02-30", dateEntretien: "2026-02-20" };
  const conformes = C.filter(x => { try { return x.verdict(f).etat === "conforme"; } catch (e) { return false; } });
  return !conformes.length || `${conformes.length} conformité(s) sur une date inexistante : ${conformes.map(x => x.id).join(", ")}`;
});
epreuve("F-16", "Un effectif négatif est irrecevable", () => {
  const f = { effectif: -50, nbLicenciements: 12 };
  const rendus = C.filter(x => { try { const e = x.verdict(f).etat; return e === "conforme" || e === "non conforme"; } catch (e) { return false; } });
  return !rendus.length || `${rendus.length} verdict(s) rendus sur un effectif de -50`;
});

/* ------------------------------------------------------------------ F-17 */
epreuve("F-17", "Un néant déclaré se distingue d'une absence de réponse", () => {
  const v = verdict("CTL-EMP-02", { postesSupprimes: [{ intitule: "P", avant: 5, apres: 2 }], precaires: [] });
  return v.etat !== "donnée manquante" || "un tableau vide est traité comme une absence de réponse";
});

/* ------------------------------------------------------------------ F-07/08/09 */
epreuve("F-07", "La cessation d'activité est contrôlée", () => {
  const lit = C.some(x => /cessationComplete/.test(x.verdict.toString()));
  return lit || "aucun contrôle ne lit cessationComplete";
});
epreuve("F-08", "La procédure collective est contrôlée", () => {
  const lit = C.some(x => /procedureCollective/.test(x.verdict.toString()));
  return lit || "aucun contrôle ne lit procedureCollective";
});
epreuve("F-09", "Le transfert d'entité est contrôlé", () => {
  const lit = C.some(x => /transfertEnvisage/.test(x.verdict.toString()));
  return lit || "aucun contrôle ne lit transfertEnvisage";
});

/* ------------------------------------------------------------------ F-10 */
epreuve("F-10", "La reconstitution hors flux intragroupe est vérifiée par le calcul", () => {
  /* Résultat -390, flux déclarés 500, reconstitution annoncée 41 : incohérent. */
  const f = { groupe: true, effectif: 200, nbLicenciements: 12,
    societes: [{ nom: "SŒUR", etranger: false }],
    resultatExploitation: [{ annee: 2025, valeur: -390 }],
    fluxIntragroupe: [{ annee: 2025, total: 500 }],
    resultatHorsFlux: [{ annee: 2025, valeur: 41 }] };
  const v = verdict("CTL-FRA-01", f);
  return /incohér|ne s'accorde|arithmétique/i.test(v.motif || "") ||
    `reconstitution incohérente acceptée : ${(v.motif || "").slice(0, 80)}`;
});

/* ------------------------------------------------------------------ F-18 */
epreuve("F-18", "Le registre voit les champs lus en notation crochets", () => {
  const R = require("./registre.js").construire();
  const sonde = { id: "SONDE", verdict: f => f["champSonde"] ? 1 : 0 };
  const vus = require("./registre.js").construire.length;   /* signature stable */
  /* On ne peut pas injecter dans le registre sans modifier la source :
     l'épreuve porte sur la présence d'un mécanisme d'observation à l'exécution. */
  const fs = require("fs");
  const src = fs.readFileSync(__dirname + "/registre.js", "utf8");
  return /Proxy/.test(src) || "le registre déduit les champs par expression régulière, sans observer les accès";
});

console.log(`\n${total - echecs} contre-épreuve(s) satisfaite(s) sur ${total}.`);
if (echecs) { console.log(`${echecs} en échec — voir le contre-audit du 15 août 2026.`); process.exit(1); }
