/* Le questionnaire de la santé, de la sécurité et des conditions de travail,
   et sa garantie de non-divergence dans les deux sens.

   Premier sens : tout contrôle doit être atteint par au moins une donnée
   demandée, sinon une exigence serait contrôlée sans jamais être renseignée.
   Second sens : tout champ qu'un contrôle lit doit être demandé, sinon le
   contrôle conclut sur du vide. Les deux font échouer la génération.

   Usage : node questionnaire-sst.js      */
const fs = require("fs");
const { C } = require("./controles-sst.js");
const SRC = fs.readFileSync(__dirname + "/controles-sst.js", "utf8");
const MSRC = fs.readFileSync(__dirname + "/moteur-sst.js", "utf8");

/* Les champs lus par chaque fonction du moteur. */
const CHAMPS_MOTEUR = {};
for (const m of MSRC.matchAll(/function (\w+)\(([^)]*)\)\s*\{/g)) {
  const suite = MSRC.slice(m.index).split(/\n(?=function |const [A-Za-z_]+ = |module\.exports)/)[0];
  CHAMPS_MOTEUR[m[1]] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}
/* majDuerp() appelle effectif(), cssctDue() aussi, etc. La fermeture
   transitive évite de croire un champ orphelin. */
for (let i = 0; i < 3; i++)
  for (const [nom, champs] of Object.entries(CHAMPS_MOTEUR))
    for (const autre of Object.keys(CHAMPS_MOTEUR))
      if (new RegExp("\\b" + autre + "\\(").test(MSRC.split("function " + nom + "(")[1]?.split(/\nfunction /)[0] || ""))
        CHAMPS_MOTEUR[nom] = [...new Set([...champs, ...CHAMPS_MOTEUR[autre]])];

/* Les auxiliaires du fichier des contrôles — siCommission lit la fiche. */
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

q("Le document unique", "duerp.existe", "Un document unique d'évaluation des risques professionnels existe-t-il ?", "oui / non", "le document unique lui-même");
q("Le document unique", "duerp.dateDerniereMaj", "Date de sa dernière mise à jour (ou de son établissement)", "AAAA-MM-JJ", "page de garde ou historique des versions");
q("Le document unique", "duerp.unitesTravail", "L'évaluation comporte-t-elle un inventaire des risques par unité de travail ?", "oui / non", "le document unique lui-même");
q("Le document unique", "duerp.versionsConservees", "Les versions successives sont-elles conservées (quarante ans au moins) ?", "oui / non", "archivage papier ou dématérialisé");
q("Le document unique", "duerp.avisAffiche", "L'avis indiquant les modalités d'accès au document est-il affiché ?", "oui / non", "photographie de l'affichage");
q("Le document unique", "duerp.consultationCSE", "Le comité est-il consulté sur le document unique et ses mises à jour ?", "oui / non", "ordres du jour et procès-verbaux du comité");
q("Le document unique", "duerp.transmisSPST", "Le document est-il transmis au service de prévention et de santé au travail à chaque mise à jour ?", "oui / non", "courriers ou accusés de transmission");

q("Les mises à jour", "evenement.survenu", "Depuis la dernière mise à jour, un aménagement important ou une information nouvelle intéressant un risque sont-ils survenus ?", "oui / non", "décisions d'aménagement, alertes, rapports");
q("Les mises à jour", "evenement.majFaite", "Si oui, le document unique a-t-il été mis à jour en conséquence ?", "oui / non", "version mise à jour du document");

q("Les suites de l'évaluation", "programmeAnnuel.existe", "À partir de cinquante salariés : un programme annuel de prévention est-il établi ?", "oui / non", "le programme annuel (PAPRIPACT)");
q("Les suites de l'évaluation", "programmeAnnuel.presenteCSE", "Ce programme est-il présenté au comité (consultation politique sociale) ?", "oui / non", "procès-verbal de la réunion du comité");
q("Les suites de l'évaluation", "listeActions.consignee", "Moins de cinquante salariés : la liste d'actions de prévention est-elle consignée dans le document unique ?", "oui / non", "le document unique lui-même");

q("La commission santé-sécurité (CSSCT)", "etablissementDistinct300", "Un établissement distinct atteint-il trois cents salariés ?", "oui / non", "découpage des établissements, registre du personnel");
q("La commission santé-sécurité (CSSCT)", "etablissementRisqueParticulier", "Un établissement relève-t-il des articles L. 4521-1 et suivants (hauts risques industriels) ?", "oui / non", "arrêté de classement, autorisation d'exploiter");
q("La commission santé-sécurité (CSSCT)", "cssctImposeeInspection", "L'inspecteur du travail a-t-il imposé la création d'une commission ?", "oui / non", "décision de l'inspecteur");
q("La commission santé-sécurité (CSSCT)", "cssct.existe", "Une commission santé, sécurité et conditions de travail existe-t-elle ?", "oui / non", "résolution du comité, accord");
q("La commission santé-sécurité (CSSCT)", "cssct.presideeEmployeur", "Est-elle présidée par l'employeur ou son représentant ?", "oui / non", "procès-verbaux de la commission");
q("La commission santé-sécurité (CSSCT)", "cssct.nbMembres", "Nombre de membres représentants du personnel", "nombre", "résolution de désignation");
q("La commission santé-sécurité (CSSCT)", "cssct.membreSecondCollege", "Au moins un membre du second collège (ou du troisième) y siège-t-il ?", "oui / non", "résolution de désignation");
q("La commission santé-sécurité (CSSCT)", "cssct.designesParCSE", "Ses membres sont-ils désignés par le comité parmi ses membres ?", "oui / non", "résolution de désignation");
q("La commission santé-sécurité (CSSCT)", "cssct.modalitesFixees", "Qu'est-ce qui fixe ses modalités — accord d'entreprise, accord avec le comité, règlement intérieur, ou rien ?", "liste", "l'accord ou le règlement intérieur");
q("La commission santé-sécurité (CSSCT)", "cssct.delegationConforme", "La délégation confiée exclut-elle le recours à l'expert et les attributions consultatives ?", "oui / non", "texte de la délégation");
q("La commission santé-sécurité (CSSCT)", "formationSSCT", "Les élus (et le référent harcèlement du comité) ont-ils reçu la formation santé, sécurité et conditions de travail ?", "oui / non", "attestations de formation");

q("Le harcèlement", "referentEmployeur", "À partir de deux cent cinquante salariés : le référent employeur harcèlement sexuel est-il désigné ?", "oui / non", "note de désignation");
q("Le harcèlement", "referentCSE", "Le comité a-t-il désigné son référent harcèlement sexuel et agissements sexistes ?", "oui / non", "résolution du comité");
q("Le harcèlement", "infoHarcelementMoral", "Le texte de l'article 222-33-2 du code pénal (harcèlement moral) est-il porté à la connaissance des salariés ?", "oui / non", "affichage, intranet, livret");
q("Le harcèlement", "infoHarcelementSexuel", "Le texte de l'article 222-33 du code pénal et les actions ouvertes sont-ils affichés dans les lieux de travail et d'embauche ?", "oui / non", "affichage, intranet, livret");
q("Le harcèlement", "infoCoordonnees", "Les coordonnées du médecin du travail, de l'inspection du travail, du Défenseur des droits et des référents sont-elles délivrées ?", "oui / non", "le support d'information lui-même");
q("Le harcèlement", "risquesHarcelementEvalues", "Les risques de harcèlement et d'agissements sexistes sont-ils intégrés à l'évaluation des risques ?", "oui / non", "le document unique lui-même");
q("Le harcèlement", "mesuresPreventionHarcelement", "Des dispositions de prévention du harcèlement sont-elles prises (procédure de signalement, sensibilisation, règlement intérieur) ?", "oui / non", "procédure, supports de sensibilisation");
q("Le harcèlement", "signalement.recu", "Un signalement de harcèlement moral ou sexuel a-t-il été reçu ?", "oui / non", "le signalement lui-même");
q("Le harcèlement", "signalement.enqueteMenee", "Si oui, une enquête a-t-elle été menée ?", "oui / non", "dossier d'enquête — saisine, auditions, rapport");
q("Le harcèlement", "signalement.mesuresPrises", "Si oui, des mesures ont-elles été prises pour y mettre un terme ?", "oui / non", "mesures conservatoires, sanction, réorganisation");

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
