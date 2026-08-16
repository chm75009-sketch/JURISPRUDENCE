/* Le questionnaire de la base de données, et sa garantie de non-divergence.

   Même règle que dans les trois autres modules, dans les deux sens : tout
   contrôle doit être atteint par une donnée demandée, et tout champ qu'un
   contrôle lit doit être demandé. Les deux font échouer la génération.

   Usage : node questionnaire-bdese.js      */
const fs = require("fs");
const { C } = require("./controles-bdese.js");
const SRC = fs.readFileSync(__dirname + "/controles-bdese.js", "utf8");
const MSRC = fs.readFileSync(__dirname + "/regime-bdese.js", "utf8");

const CHAMPS_MOTEUR = {};
for (const m of MSRC.matchAll(/function (\w+)\(([^)]*)\)\s*\{/g)) {
  const suite = MSRC.slice(m.index).split(/\n(?=function |const [A-Za-z_]+ = |module\.exports)/)[0];
  CHAMPS_MOTEUR[m[1]] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}
/* Les auxiliaires du fichier des contrôles lisent eux aussi la fiche. */
for (const m of SRC.matchAll(/^(?:const (\w+) = f =>|function (\w+)\(f[,)])/gm)) {
  const nom = m[1] || m[2];
  const suite = SRC.slice(m.index).split(/\n(?=const [A-Za-z_]+ = |function |ctl\()/)[0];
  CHAMPS_MOTEUR[nom] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}

const corpsDe = id => { const b = SRC.split(`ctl("${id}"`)[1]; return b ? b.split("\nctl(")[0] : ""; };
const racine = c => String(c).split(".")[0];

function controlesDe(champ) {
  const r = racine(champ), out = [];
  for (const c of C) {
    const corps = corpsDe(c.id);
    if (!corps) continue;
    let vu = new RegExp(`f\\.${r}\\b`).test(corps) || new RegExp(`"${r}"`).test(corps)
      || (champ.includes(".") && corps.includes(champ.split(".").slice(1).join(".")));
    if (!vu) for (const m of corps.matchAll(/(?:R\.)?(\w+)\(\s*f\s*[,)]/g))
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
    for (const m of corps.matchAll(/(?:R\.)?(\w+)\(\s*f\s*[,)]/g))
      for (const ch of CHAMPS_MOTEUR[m[1]] || []) s.add(ch);
  }
  return s;
}

const LIGNES = [];
const q = (rubrique, champ, libelle, format, piece) => LIGNES.push({ rubrique, champ, libelle, format, piece });
const COMPOSES_LISTE = new Set([]);

q("Identité", "entreprise", "Dénomination sociale", "texte", "extrait Kbis");
q("Identité", "dateAudit", "Date à laquelle la situation est décrite", "AAAA-MM-JJ", "—");
q("Identité", "effectif", "Effectif de l'entreprise au sens de l'article L. 1111-2", "nombre", "registre du personnel");
q("Identité", "etablissementsDistincts", "L'entreprise comporte-t-elle plusieurs établissements distincts ?", "oui / non", "accord ou décision de découpage");

q("Le régime applicable", "accordEntreprise", "Avez-vous un accord d'entreprise sur la base de données ?", "oui / non", "accord d'entreprise");
q("Le régime applicable", "accordEntrepriseVerse", "Si oui, l'avez-vous joint ?", "oui / non", "l'accord lui-même");
q("Le régime applicable", "accordBranche", "Sinon, avez-vous un accord de branche sur la base ?", "oui / non", "accord de branche");
q("Le régime applicable", "accordBrancheVerse", "Si oui, l'avez-vous joint ?", "oui / non", "l'accord lui-même");
q("Le régime applicable", "pieces", "Pièces versées au dossier", "liste d'objets", "les pièces elles-mêmes");

q("Les dates", "dateSeuil50Atteint", "Date à laquelle l'effectif a atteint cinquante salariés pendant douze mois consécutifs", "AAAA-MM-JJ", "états d'effectif mensuels");
q("Les dates", "dateFinMandat", "Date de fin des mandats en cours", "AAAA-MM-JJ", "procès-verbal des dernières élections");
q("Les dates", "dateRenouvellementCSE", "Date de renouvellement du comité, si elle est arrêtée", "AAAA-MM-JJ", "calendrier électoral");
q("Les dates", "dateSeuil300Franchi", "Date à laquelle le seuil de trois cents salariés est réputé franchi, après douze mois consécutifs de dépassement", "AAAA-MM-JJ", "états d'effectif mensuels");

q("Le contenu", "base.themes", "Les thèmes et rubriques que la base comporte, un par ligne", "liste d'objets", "sommaire de la base");
q("Le contenu", "base.anneesPassees", "Nombre d'années passées couvertes", "nombre", "la base elle-même");
q("Le contenu", "base.anneesSuivantes", "Nombre d'années à venir couvertes", "nombre", "la base elle-même");
q("Le contenu", "base.formePerspectives", "Forme sous laquelle les années à venir sont renseignées : chiffrée, grandes tendances, ou mixte", "texte", "la base elle-même");
q("Le contenu", "base.informationsNonRenseignables", "Informations qui ne peuvent recevoir ni chiffres ni tendances, avec les raisons données", "liste", "note de l'employeur");

q("La mise à disposition", "base.support", "Support de la base : informatique, papier, ou autre", "texte", "capture ou description du support");
q("La mise à disposition", "base.beneficiaires", "Personnes ayant accès à la base", "liste", "liste des accès ouverts");
q("La mise à disposition", "base.niveau", "Niveau auquel la base est mise en place : entreprise, établissement, ou les deux", "texte", "accord définissant la base");
q("La mise à disposition", "base.dateDerniereMiseAJour", "Date de la dernière mise à jour", "AAAA-MM-JJ", "journal des mises à jour");
q("La mise à disposition", "base.informationMiseAJour", "Les bénéficiaires sont-ils informés de chaque actualisation ?", "oui / non", "preuves d'envoi, datées");
q("La mise à disposition", "base.preuveAcces", "Trace des accès ou de la remise : journal, accusés, émargements", "texte", "les traces elles-mêmes");

q("Les consultations", "accordPeriodiciteConsultations", "Un accord fixe-t-il le contenu, la périodicité et les modalités des consultations récurrentes ?", "oui / non", "accord de l'article L. 2312-19");
q("Les consultations", "periodiciteConsultations", "Périodicité que cet accord fixe, en années", "nombre", "l'accord lui-même");
q("Les consultations", "reunionsAnnuellesAccord", "Nombre de réunions annuelles que cet accord prévoit", "nombre", "l'accord lui-même");
q("Les consultations", "accordDelaisConsultation", "Un accord fixe-t-il les délais dans lesquels les avis sont rendus ?", "oui / non", "l'accord lui-même");
q("Les consultations", "consultation.dateMiseADisposition", "Date de mise à disposition des informations dans la base, ou de leur communication", "AAAA-MM-JJ", "preuve d'information, datée");
q("Les consultations", "consultation.nbExpertises", "Nombre d'expertises en cours sur cette consultation", "nombre", "délibérations du comité");
q("Les consultations", "consultation.centralEtEtablissements", "La consultation se déroule-t-elle à la fois au niveau central et d'établissement ?", "oui / non", "convocations");
q("Les consultations", "consultation.dateAvis", "Date à laquelle l'avis a été rendu", "AAAA-MM-JJ", "procès-verbal");

const CONTEXTE = new Set(["entreprise"]);
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
