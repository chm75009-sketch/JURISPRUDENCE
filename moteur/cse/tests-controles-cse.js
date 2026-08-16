/* Cas contradictoires : chaque contrôle est confronté à une situation faite pour
   le mettre en défaut. Trois exigences, vérifiées ici :
   1. aucun contrôle ne jette sur une fiche vide ;
   2. sur une fiche vide, aucun contrôle ne conclut à la conformité ;
   3. chaque contrôle qui peut détecter une non-conformité la détecte au moins
      une fois sur les cas ci-dessous — un contrôle jamais mis en défaut est un
      contrôle qui ne contrôle rien. */
const { C, ETATS, DETECTION } = require("./controles-cse.js");
const fs = require("fs");

const CAS = [];
const cas = (titre, f) => CAS.push({ titre, f });

cas("fiche vide", {});
cas("entreprise de 8 salariés", { effectif: 8, effectifsMensuels: Array(13).fill(8) });
cas("seuil franchi, aucun comité, aucune carence", {
  effectif: 24, effectifsMensuels: Array(14).fill(24), comiteExistant: false, pieces: [] });
cas("seuil franchi, carence versée", {
  effectif: 24, effectifsMensuels: Array(14).fill(24), comiteExistant: false, pieces: ["pv-carence"] });
cas("mandat expiré depuis deux ans", {
  effectif: 120, comiteExistant: true, dateDernieresElections: "2020-03-01", dateAudit: "2026-08-15" });
cas("accord fixant un mandat de cinq ans", { effectif: 120, dureeAccord: 5 });
cas("accord fixant un mandat de trois ans", { effectif: 120, dureeAccord: 3 });
cas("représentants de proximité sans accord", {
  effectif: 400, etablissementsMultiples: true, representantsProximite: true, pieces: [] });
cas("découpage unilatéral sans délégations", {
  effectif: 600, etablissementsMultiples: true, sourceDecoupage: "décision unilatérale", pieces: [] });
cas("découpage par accord versé", {
  effectif: 600, etablissementsMultiples: true, sourceDecoupage: "accord",
  pieces: ["accord-decoupage", "delegations-pouvoir"] });
cas("premier tour au-delà de quatre-vingt-dix jours", {
  effectif: 120, electionsEnCours: true, dateInformationPersonnel: "2026-01-10", datePremierTour: "2026-05-30" });
cas("premier tour dans le délai", {
  effectif: 120, electionsEnCours: true, dateInformationPersonnel: "2026-01-10", datePremierTour: "2026-03-30" });
cas("protocole sans double majorité", {
  effectif: 120, electionsEnCours: true,
  protocole: { nbSignataires: 1, nbParticipants: 4, suffragesSignataires: 30, proportionFH: false } });
cas("protocole valable", {
  effectif: 120, electionsEnCours: true, syndicatsInvites: ["A", "B", "C"], pieces: ["invitations-syndicats"],
  protocole: { nbSignataires: 3, nbParticipants: 4, suffragesSignataires: 72, proportionFH: true } });
cas("liste au mauvais nombre de femmes", {
  effectif: 120, electionsEnCours: true, listesDeposees: [
    { nom: "collège 1 · titulaires", femmesInscrites: 60, hommesInscrits: 40,
      candidats: [{ sexe: "H" }, { sexe: "H" }, { sexe: "F" }] }] });
cas("liste dans le mauvais ordre", {
  effectif: 120, electionsEnCours: true, listesDeposees: [
    { nom: "collège 1 · titulaires", femmesInscrites: 60, hommesInscrits: 40,
      candidats: [{ sexe: "F" }, { sexe: "F" }, { sexe: "H" }] }] });
cas("liste régulière", {
  effectif: 120, electionsEnCours: true, listesDeposees: [
    { nom: "collège 1 · titulaires", femmesInscrites: 60, hommesInscrits: 40,
      candidats: [{ sexe: "F" }, { sexe: "H" }, { sexe: "F" }] }] });
cas("liste au conflit d'arrondi", {
  effectif: 120, electionsEnCours: true, listesDeposees: [
    { nom: "collège 1 · titulaires", femmesInscrites: 70, hommesInscrits: 30,
      candidats: [{ sexe: "F" }, { sexe: "H" }, { sexe: "F" }, { sexe: "H" }, { sexe: "F" }] }] });
cas("vote électronique sans support", { effectif: 120, electionsEnCours: true, voteElectronique: true, pieces: [] });
cas("élections partielles dues et non organisées", {
  effectif: 200, titulairesInitiaux: 10, titulairesRestants: 4, partiellesOrganisees: false });
cas("élections partielles dues et organisées", {
  effectif: 200, titulairesInitiaux: 10, titulairesRestants: 4, partiellesOrganisees: true });
cas("consultations récurrentes incomplètes", {
  effectif: 300, consultationsRecurrentes: [{ objet: "orientations stratégiques" }] });
cas("avis rendu après l'expiration du délai", {
  effectif: 300, consultation: { dateRemiseInformations: "2026-01-05", dateAvis: "2026-03-20" } });
cas("avis rendu dans le délai avec expertise", {
  effectif: 300, consultation: { dateRemiseInformations: "2026-01-05", dateAvis: "2026-02-20", expertise: true } });
cas("comité central seul consulté malgré des mesures d'adaptation", {
  effectif: 900, etablissementsMultiples: true, instanceConsultee: "central", mesuresAdaptation: true });
cas("réunions insuffisantes", { effectif: 400, reunionsTenues: 7, reunionsSante: 2 });
cas("réunions suffisantes", { effectif: 400, reunionsTenues: 12, reunionsSante: 4 });
cas("accord réduisant les réunions sous le plancher", {
  effectif: 400, accordPeriodicite: true, reunionsAccord: 4, reunionsTenues: 4 });
cas("heures de délégation sous le minimum", { effectif: 120, heuresAccordees: 100, titulairesElus: 6 });
cas("heures de délégation conformes", { effectif: 120, heuresAccordees: 126, titulairesElus: 6 });
cas("retenue sur les heures de délégation", { effectif: 120, heuresRetenues: true });
cas("aucune formation santé et sécurité", { effectif: 120, formationsDispensees: ["formation économique"] });
cas("formation santé attestée", {
  effectif: 120, formationsDispensees: ["santé, sécurité et conditions de travail"], pieces: ["attestations-formation"] });
cas("commission obligatoire absente", { effectif: 500, cssct: false });
cas("commission Seveso absente", { effectif: 80, seveso: true, cssct: false });
cas("commission sans membre du bon collège", {
  effectif: 700, nbCadres: 40, cssct: true,
  membresCssct: [{ college: 1 }, { college: 1 }, { college: 2 }] });
cas("commission régulière", {
  effectif: 700, nbCadres: 40, cssct: true,
  membresCssct: [{ college: 1 }, { college: 2 }, { college: 3 }] });
cas("subvention de fonctionnement insuffisante", {
  effectif: 800, masseSalariale: 30000000, subventionVersee: 40000 });
cas("subvention de fonctionnement conforme", {
  effectif: 800, masseSalariale: 30000000, subventionVersee: 60000 });
cas("subvention au taux de 0,22 % due", {
  effectif: 2500, masseSalariale: 100000000, subventionVersee: 200000 });
cas("contribution aux activités sociales en recul", {
  effectif: 800, masseSalariale: 30000000, masseSalarialeN1: 28000000,
  ascAnneeN: 150000, ascAnneeN1: 200000 });
cas("condition d'ancienneté sur les activités sociales", { effectif: 800, ancienneteASC: true });
cas("expertise mal financée", {
  effectif: 800, expertise: { cas: "situation économique et financière", partEmployeur: 80 } });
cas("expertise bien financée", {
  effectif: 800, expertise: { cas: "orientations stratégiques", partEmployeur: 80 } });
cas("contestation d'expertise hors délai", {
  effectif: 800, expertise: { cas: "nécessité", dateDepart: "2026-02-01", dateSaisine: "2026-02-20" } });
cas("contestation d'expertise dans le délai", {
  effectif: 800, expertise: { cas: "nécessité", dateDepart: "2026-02-01", dateSaisine: "2026-02-09" } });
cas("expertise décidée en deçà de dix licenciements", {
  effectif: 800, nbLicenciements: 6, expertise: { cas: "licenciement collectif pour motif économique" } });
cas("accords et contentieux signalés", {
  effectif: 800, accordsCse: ["accord sur les consultations"], contentieuxCse: "instance en cours", faitsEntrave: "refus de communiquer" });

cas("effectifs attestés, seuil franchi", {
  effectif: 24, effectifsMensuels: Array(14).fill(24), comiteExistant: true,
  pieces: ["etats-effectifs"], dateDernieresElections: "2024-06-01", dateAudit: "2026-08-15" });
cas("représentants de proximité institués par accord", {
  effectif: 400, etablissementsMultiples: true, representantsProximite: true,
  pieces: ["accord-representants-proximite", "accord-decoupage", "delegations-pouvoir"],
  sourceDecoupage: "accord", instanceConsultee: "établissement", mesuresAdaptation: true });
cas("vote électronique fondé sur un accord", {
  effectif: 120, electionsEnCours: true, voteElectronique: true,
  syndicatsInvites: ["A", "B"], pieces: ["accord-vote-electronique", "invitations-syndicats"] });
cas("trois consultations récurrentes conduites", {
  effectif: 300, consultationsRecurrentes: [
    { objet: "orientations stratégiques" }, { objet: "situation économique et financière" },
    { objet: "politique sociale, conditions de travail et emploi" }],
  consultation: { dateRemiseInformations: "2026-01-05", dateAvis: "2026-01-25" },
  pieces: ["note-information-cse"] });
cas("aucune retenue et activités sociales ouvertes", {
  effectif: 800, heuresRetenues: false, ancienneteASC: false,
  masseSalariale: 30000000, masseSalarialeN1: 28000000, ascAnneeN: 250000, ascAnneeN1: 200000 });
cas("expertise régulière sur un licenciement de vingt salariés", {
  effectif: 800, nbLicenciements: 20,
  expertise: { cas: "licenciement collectif pour motif économique", partEmployeur: 100 } });
cas("titulaires élus au nombre prévu", { effectif: 120, titulairesElus: 6, heuresAccordees: 126 });

/* Recevabilité, cohérence de l'effectif et néant déclaré : les quatre cas qui
   ont motivé le contre-audit du module. */
cas("dates impossibles et dénombrements décimaux", {
  effectif: 120.5, dateDernieresElections: "2023-02-30", dateAudit: "2026-08-15",
  reunionsTenues: 6, reunionsSante: 9, masseSalariale: -1000 });
cas("chronologie inversée sur les élections et la consultation", {
  effectif: 300, electionsEnCours: true,
  dateInformationPersonnel: "2026-05-04", datePremierTour: "2026-01-09",
  consultation: { dateRemiseInformations: "2026-03-10", dateAvis: "2026-01-11" },
  expertise: { cas: "nécessité", dateDepart: "2026-04-01", dateSaisine: "2026-03-20" } });
cas("effectif déclaré à 299 contre quatorze relevés au-dessus de 310", {
  effectif: 299, effectifsMensuels: [312, 313, 314, 315, 316, 317, 312, 313, 314, 315, 316, 317, 313, 314],
  comiteExistant: true, cssct: false, reunionsTenues: 6, reunionsSante: 4,
  titulairesElus: 11, heuresAccordees: 231, masseSalariale: 12000000, subventionVersee: 24000,
  pieces: ["etats-effectifs"] });
cas("effectif déclaré hors de l'intervalle des relevés, sans franchissement de seuil", {
  effectif: 60, effectifsMensuels: Array(14).fill(120), comiteExistant: true });
cas("néant déclaré partout", {
  effectif: 120, electionsEnCours: true, cssct: true,
  syndicatsInvites: [], listesDeposees: [], consultationsRecurrentes: [],
  formationsDispensees: [], membresCssct: [], accordsCse: [], contentieuxCse: "", faitsEntrave: "" });
cas("liste au conflit d'arrondi tranché par un nombre impair de sièges", {
  effectif: 120, electionsEnCours: true, listesDeposees: [
    { nom: "collège 1 · titulaires", femmesInscrites: 50, hommesInscrits: 50, siegesAPourvoir: 3,
      candidats: [{ sexe: "F" }, { sexe: "H" }, { sexe: "F" }] }] });
cas("élections partielles écartées à moins de six mois du terme", {
  effectif: 200, titulairesInitiaux: 10, titulairesRestants: 4, moisAvantTerme: 4,
  collegeVide: false, partiellesOrganisees: false });
cas("collège non représenté", {
  effectif: 200, titulairesInitiaux: 10, titulairesRestants: 8, collegeVide: true,
  moisAvantTerme: 20, partiellesOrganisees: false });

/* ---------------- exécution ---------------- */
const res = [];
let jets = 0, confVide = 0;
for (const k of CAS) {
  const ligne = { cas: k.titre, verdicts: {} };
  for (const ctl of C) {
    let v;
    try { v = ctl.verdict(k.f); }
    catch (e) { v = { etat: "ERREUR", motif: String(e.message) }; jets++; }
    if (!v || !v.etat) { v = { etat: "ERREUR", motif: "verdict sans état" }; jets++; }
    ligne.verdicts[ctl.id] = v.etat;
    if (k.titre === "fiche vide" && v.etat === ETATS.CONF) {
      confVide++; console.log("ÉCHEC : " + ctl.id + " conclut à la conformité sur une fiche vide.");
    }
  }
  res.push(ligne);
}
/* Un contrôle sans branche « non conforme » ne peut pas être mis en défaut :
   c'est un constat, pas un manque. On lit la source pour les distinguer. */
const src = fs.readFileSync(__dirname + "/controles-cse.js", "utf8");
const aBrancheNC = id => { const b = src.split(`c("${id}"`)[1]; return b ? /etat:\s*NC/.test(b.split("\nc(")[0]) : false; };
const sansBrancheNC = C.filter(ctl => !aBrancheNC(ctl.id)).map(x => x.id);
const jamaisNC = C.filter(ctl => aBrancheNC(ctl.id) && !res.some(l => l.verdicts[ctl.id] === ETATS.NC)).map(x => x.id);
/* Chaque contrôle a-t-il pu conclure à la conformité au moins une fois ? */
const jamaisCONF = C.filter(ctl => !res.some(l => l.verdicts[ctl.id] === ETATS.CONF)).map(x => x.id);
/* Un contrôle de détection ne doit jamais sortir « conforme ». */
const detectionConforme = [...DETECTION].filter(id => res.some(l => l.verdicts[id] === ETATS.CONF));

const rapport = {
  cas: CAS.length, controles: C.length, jets, confVide,
  sansBrancheNonConforme: sansBrancheNC,
  jamaisEnDefaut: jamaisNC, jamaisConforme: jamaisCONF, detectionConforme,
  detail: res,
};
fs.writeFileSync("rapport-tests-cse.json", JSON.stringify(rapport, null, 1));
console.log(`${CAS.length} cas × ${C.length} contrôles = ${CAS.length * C.length} verdicts`);
console.log(`exceptions : ${jets} · conformités sur fiche vide : ${confVide}`);
console.log(`sans branche « non conforme » (par construction) : ${sansBrancheNC.length}`);
console.log(`ayant une branche « non conforme » jamais atteinte : ${jamaisNC.length ? jamaisNC.join(", ") : "aucun"}`);
console.log(`jamais conforme : ${jamaisCONF.length ? jamaisCONF.join(", ") : "aucun"}`);
console.log(`détection concluant à la conformité : ${detectionConforme.length ? detectionConforme.join(", ") : "aucun"}`);
if (jets || confVide || detectionConforme.length || jamaisNC.length) process.exit(1);
