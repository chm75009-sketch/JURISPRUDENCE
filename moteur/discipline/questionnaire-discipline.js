/* Le questionnaire de la discipline et du règlement intérieur, et sa garantie
   de non-divergence dans les deux sens.

   Premier sens : tout contrôle doit être atteint par au moins une donnée
   demandée, sinon une exigence serait contrôlée sans jamais être renseignée.
   Second sens : tout champ qu'un contrôle lit doit être demandé, sinon le
   contrôle conclut sur du vide. Les deux font échouer la génération.

   Usage : node questionnaire-discipline.js      */
const fs = require("fs");
const { C } = require("./controles-discipline.js");
const SRC = fs.readFileSync(__dirname + "/controles-discipline.js", "utf8");
const MSRC = fs.readFileSync(__dirname + "/moteur-discipline.js", "utf8");

/* Les champs lus par chaque fonction du moteur. */
const CHAMPS_MOTEUR = {};
for (const m of MSRC.matchAll(/function (\w+)\(([^)]*)\)\s*\{/g)) {
  const suite = MSRC.slice(m.index).split(/\n(?=function |const [A-Za-z_]+ = |module\.exports)/)[0];
  CHAMPS_MOTEUR[m[1]] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}
/* riDu() appelle effectif(), entretienDu() appelle qualification() et
   garantieDeFond() : la fermeture transitive évite de croire un champ
   orphelin. */
for (let i = 0; i < 3; i++)
  for (const [nom, champs] of Object.entries(CHAMPS_MOTEUR))
    for (const autre of Object.keys(CHAMPS_MOTEUR))
      if (new RegExp("\\b" + autre + "\\(").test(MSRC.split("function " + nom + "(")[1]?.split(/\nfunction /)[0] || ""))
        CHAMPS_MOTEUR[nom] = [...new Set([...champs, ...CHAMPS_MOTEUR[autre]])];

/* Les auxiliaires du fichier des contrôles — siRI et siSanction lisent la fiche. */
for (const m of SRC.matchAll(/^(?:const (\w+) = \(?f|function (\w+)\(f[,)])/gm)) {
  const nom = m[1] || m[2];
  const suite = SRC.slice(m.index).split(/\n(?=const [A-Za-z_]+ = |function |ctl\()/)[0];
  CHAMPS_MOTEUR[nom] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}

function corpsDe(id) {
  const bloc = SRC.split(`"${id}"`)[1];
  return bloc ? bloc.split(/\nctl\(/)[0] : "";
}

const racine = c => String(c).split(".")[0];

function controlesDe(champ) {
  const r = racine(champ), out = [];
  for (const c of C) {
    const corps = corpsDe(c.id);
    if (!corps) continue;
    let vu = new RegExp(`f\\.${r}\\b`).test(corps) || new RegExp(`"${r}"`).test(corps);
    if (!vu) for (const m of corps.matchAll(/(?:M\.)?(\w+)\(\s*f\s*[,)]/g))
      if ((CHAMPS_MOTEUR[m[1]] || []).includes(r)) { vu = true; break; }
    if (vu) out.push(c.id);
  }
  return out;
}

function champsLusParLesControles() {
  const s = new Set();
  for (const c of C) {
    const corps = corpsDe(c.id);
    for (const m of corps.matchAll(/\bf\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) s.add(m[1]);
    for (const m of corps.matchAll(/(?:M\.)?(\w+)\(\s*f\s*[,)]/g))
      for (const ch of CHAMPS_MOTEUR[m[1]] || []) s.add(ch);
  }
  return s;
}

const LIGNES = [];
const q = (rubrique, champ, libelle, format, piece) => LIGNES.push({ rubrique, champ, libelle, format, piece });
const COMPOSES_LISTE = new Set([]);

q("Identité", "entreprise", "Dénomination sociale", "texte", "extrait Kbis");
q("Identité", "dateAudit", "Date à laquelle la situation est décrite", "AAAA-MM-JJ", "—");
q("Identité", "effectif", "Effectif de l'entreprise", "nombre", "registre du personnel");
q("Identité", "cse.existe", "Un comité social et économique existe-t-il ?", "oui / non", "procès-verbal des dernières élections");

q("Le règlement intérieur", "ri.existe", "L'entreprise s'est-elle dotée d'un règlement intérieur ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.dateFranchissementSeuil", "Date à laquelle le seuil de cinquante salariés a été atteint", "AAAA-MM-JJ", "registre du personnel, déclarations sociales");
q("Le règlement intérieur", "ri.contenuSanteSecurite", "Fixe-t-il les mesures d'application de la réglementation santé-sécurité (L. 1321-1, 1°) ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.contenuParticipation", "Fixe-t-il les conditions de participation des salariés au rétablissement de conditions de travail protectrices (L. 1321-1, 2°) ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.contenuDiscipline", "Fixe-t-il les règles générales et permanentes relatives à la discipline (L. 1321-1, 3°) ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.echelleSanctions", "Fixe-t-il la nature et l'échelle des sanctions que peut prendre l'employeur ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.misePiedDureeMax", "Précise-t-il la durée maximale de la mise à pied disciplinaire ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.misePiedDureeMaxJours", "Cette durée maximale, en jours", "nombre", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.rappelDroitsDefense", "Rappelle-t-il les droits de la défense des salariés (L. 1332-1 à L. 1332-3, ou convention collective) ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.rappelHarcelement", "Rappelle-t-il les dispositions sur les harcèlements moral et sexuel et les agissements sexistes ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.rappelLanceursAlerte", "Rappelle-t-il l'existence du dispositif de protection des lanceurs d'alerte ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.clausesInterdites", "Comporte-t-il des clauses prohibées par L. 1321-3 (contraires aux textes, restrictions non justifiées, discriminations) ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.clauseNeutralite", "Comporte-t-il une clause de neutralité (L. 1321-2-1) ?", "oui / non", "le règlement intérieur lui-même");
q("Le règlement intérieur", "ri.neutraliteJustifieeProportionnee", "Cette clause est-elle justifiée par d'autres libertés ou par les nécessités du bon fonctionnement, et proportionnée ?", "oui / non", "note de justification, fiches de poste");
q("Le règlement intérieur", "ri.redigeFrancais", "Est-il rédigé en français (L. 1321-6) ?", "oui / non", "le règlement intérieur lui-même");

q("Les formalités du règlement intérieur", "ri.avisCSE", "A-t-il été soumis à l'avis du comité social et économique avant son introduction ?", "oui / non", "procès-verbal de la réunion et avis rendu");
q("Les formalités du règlement intérieur", "ri.publicite", "Est-il porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail et d'embauche ?", "oui / non", "photographie de l'affichage, capture intranet");
q("Les formalités du règlement intérieur", "ri.depotGreffe", "A-t-il été déposé au greffe du conseil de prud'hommes du ressort ?", "oui / non", "récépissé de dépôt du greffe");
q("Les formalités du règlement intérieur", "ri.communicationInspection", "A-t-il été communiqué à l'inspecteur du travail, accompagné de l'avis du comité ?", "oui / non", "courrier ou accusé de transmission");
q("Les formalités du règlement intérieur", "ri.communicationDeuxExemplaires", "Cette communication a-t-elle été faite en deux exemplaires (R. 1321-4) ?", "oui / non", "courrier de transmission");
q("Les formalités du règlement intérieur", "ri.dateDerniereFormalite", "Date de la dernière des formalités de publicité et de dépôt", "AAAA-MM-JJ", "récépissé du greffe, preuve d'affichage");
q("Les formalités du règlement intérieur", "ri.dateEntreeVigueur", "Date d'entrée en vigueur inscrite au règlement intérieur", "AAAA-MM-JJ", "le règlement intérieur lui-même");
q("Les formalités du règlement intérieur", "ri.modifieDepuis", "Des clauses ont-elles été modifiées ou retirées depuis l'introduction ?", "oui / non", "avenants au règlement intérieur");
q("Les formalités du règlement intérieur", "ri.modificationsFormalites", "Ces modifications ont-elles suivi les mêmes formalités (avis, publicité, dépôt, inspection) ?", "oui / non", "procès-verbaux, récépissés");
q("Les formalités du règlement intérieur", "ri.notesServiceGenerales", "Existe-t-il des notes de service portant des obligations générales et permanentes (L. 1321-5) ?", "oui / non", "les notes de service elles-mêmes");
q("Les formalités du règlement intérieur", "ri.notesServiceFormalites", "Ces notes de service ont-elles été soumises aux formalités du titre ?", "oui / non", "procès-verbaux, récépissés");
q("Les formalités du règlement intérieur", "ri.demandeInspection", "L'inspecteur du travail a-t-il exigé le retrait ou la modification de dispositions (L. 1322-1) ?", "oui / non", "la décision de l'inspecteur");
q("Les formalités du règlement intérieur", "ri.suiteDemandeInspection", "Cette demande a-t-elle été suivie d'effet ?", "oui / non", "règlement intérieur modifié, recours hiérarchique");

q("La sanction auditée", "sanction.auditee", "Une sanction envisagée ou prononcée est-elle soumise à l'audit ?", "oui / non", "—");
q("La sanction auditée", "sanction.nature", "Nature de la sanction", "liste", "la notification de la sanction");
q("La sanction auditée", "sanction.incidence", "A-t-elle une incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération ?", "oui / non", "la notification, le dossier du salarié");
q("La sanction auditée", "sanction.prevueRI", "Cette sanction figure-t-elle dans l'échelle des sanctions du règlement intérieur ?", "oui / non", "le règlement intérieur lui-même");
q("La sanction auditée", "sanction.dureeMisePiedJours", "Durée de la mise à pied disciplinaire prononcée, en jours", "nombre", "la notification de la sanction");
q("La sanction auditée", "sanction.griefsEcrits", "Le salarié a-t-il été informé par écrit des griefs retenus contre lui ?", "oui / non", "la lettre de notification");
q("La sanction auditée", "sanction.retenueSalaire", "La sanction s'accompagne-t-elle d'une retenue sur la rémunération étrangère à une suspension du contrat ?", "oui / non", "bulletin de paie");
q("La sanction auditée", "sanction.salarieProtege", "Le salarié est-il titulaire d'un mandat représentatif ou syndical ?", "oui / non", "procès-verbal des élections, désignation syndicale");

q("Les dates de la procédure", "sanction.dateConnaissance", "Date à laquelle l'employeur a eu connaissance des faits", "AAAA-MM-JJ", "signalement, rapport, constat");
q("Les dates de la procédure", "sanction.poursuitesPenales", "Les faits ont-ils donné lieu, dans le même délai, à l'exercice de poursuites pénales ?", "oui / non", "plainte, avis à victime, convocation pénale");
q("Les dates de la procédure", "sanction.sanctionsAnterieuresInvoquees", "Des sanctions antérieures sont-elles invoquées à l'appui de la nouvelle sanction ?", "oui / non", "le dossier disciplinaire du salarié");
q("Les dates de la procédure", "sanction.dateSanctionAnterieurePlusAncienne", "Date de la plus ancienne des sanctions antérieures invoquées", "AAAA-MM-JJ", "les notifications antérieures");
q("Les dates de la procédure", "sanction.dateConvocation", "Date d'envoi de la lettre de convocation à l'entretien préalable", "AAAA-MM-JJ", "récépissé ou avis de réception");
q("Les dates de la procédure", "sanction.dateEntretien", "Date de l'entretien préalable", "AAAA-MM-JJ", "compte rendu d'entretien");
q("Les dates de la procédure", "sanction.dateNotification", "Date de notification de la sanction", "AAAA-MM-JJ", "récépissé ou avis de réception");

q("La procédure suivie", "sanction.convocationEnvoyee", "Une lettre de convocation à l'entretien préalable a-t-elle été envoyée ?", "oui / non", "la lettre de convocation");
q("La procédure suivie", "sanction.convocationObjet", "Indique-t-elle l'objet de l'entretien ?", "oui / non", "la lettre de convocation");
q("La procédure suivie", "sanction.convocationDateHeureLieu", "Précise-t-elle la date, l'heure et le lieu de l'entretien ?", "oui / non", "la lettre de convocation");
q("La procédure suivie", "sanction.convocationAssistance", "Rappelle-t-elle que le salarié peut se faire assister par une personne de l'entreprise ?", "oui / non", "la lettre de convocation");
q("La procédure suivie", "sanction.convocationRemise", "Comment la convocation a-t-elle été remise ?", "liste", "récépissé ou avis de réception");
q("La procédure suivie", "sanction.entretienTenu", "L'entretien préalable a-t-il été tenu ?", "oui / non", "compte rendu d'entretien, feuille d'émargement");
q("La procédure suivie", "sanction.notificationEcrite", "La sanction a-t-elle fait l'objet d'une décision écrite ?", "oui / non", "la lettre de notification");
q("La procédure suivie", "sanction.notificationMotivee", "Cette décision est-elle motivée — les griefs y sont-ils énoncés ?", "oui / non", "la lettre de notification");
q("La procédure suivie", "sanction.notificationRemise", "Comment la sanction a-t-elle été notifiée ?", "liste", "récépissé ou avis de réception");
q("La procédure suivie", "sanction.misePiedConservatoire", "Une mise à pied conservatoire à effet immédiat a-t-elle été prononcée ?", "oui / non", "la lettre de mise à pied conservatoire");

q("La garantie de fond", "garantie.procedureApplicable", "Une convention collective ou le règlement intérieur prévoient-ils une procédure particulière avant la sanction ?", "oui / non", "la convention collective, le règlement intérieur");
q("La garantie de fond", "garantie.source", "D'où vient cette procédure ?", "liste", "la convention collective, le règlement intérieur");
q("La garantie de fond", "garantie.nature", "En quoi consiste-t-elle ?", "liste", "la clause elle-même");
q("La garantie de fond", "garantie.suivie", "A-t-elle été suivie avant le prononcé de la sanction ?", "liste", "convocation de l'organisme, avis rendu, procès-verbal");
q("La garantie de fond", "garantie.droitsDefensePrives", "L'irrégularité a-t-elle privé le salarié de la possibilité d'assurer utilement sa défense ?", "oui / non", "chronologie de la procédure, pièces échangées");
q("La garantie de fond", "garantie.influenceDecision", "Est-elle susceptible d'avoir exercé une influence sur la décision finale ?", "oui / non", "avis rendu, motifs de la décision");
q("La garantie de fond", "garantie.licenciementSubordonneSanctions", "Le règlement intérieur ou la convention collective subordonnent-ils le licenciement à l'existence de sanctions antérieures ?", "oui / non", "la clause elle-même");

q("Pièces", "pieces", "Pièces versées au dossier", "liste d'objets", "les pièces elles-mêmes");

/* ------------------------------------------------- la garantie, dans les deux sens */
const CONTEXTE = new Set([]);
const atteints = new Set(LIGNES.flatMap(l => controlesDe(l.champ)));
const orphelins = C.filter(x => !atteints.has(x.id)).map(x => x.id);
const demandes = new Set(LIGNES.map(l => racine(l.champ)));
const nonDemandes = [...champsLusParLesControles()]
  .filter(ch => !demandes.has(ch) && !CONTEXTE.has(ch)).sort();
const sansControle = LIGNES.filter(l => !controlesDe(l.champ).length).map(l => l.champ);

module.exports = { LIGNES, COMPOSES_LISTE, controlesDe };

if (require.main === module) {
  console.log(`${LIGNES.length} données · ${C.length} contrôles · atteints ${atteints.size}`
    + ` · orphelins ${orphelins.length ? orphelins.join(", ") : "aucun"}`
    + ` · champs lus non demandés ${nonDemandes.length ? nonDemandes.join(", ") : "aucun"}`
    + ` · données sans contrôle ${sansControle.length ? sansControle.join(", ") : "aucune"}`);
  if (orphelins.length || nonDemandes.length) {
    console.error("Divergence entre le questionnaire et les contrôles : la génération échoue.");
    process.exit(1);
  }
}
