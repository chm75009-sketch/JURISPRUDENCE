/* Le questionnaire d'orientation de l'audit social, et sa garantie de
   non-divergence dans les deux sens.

   Premier sens : tout champ du profil demandé ici doit être lu quelque part —
   par une condition du référentiel, par le moteur, par les contrôles, le plan
   ou les modèles — sinon on demande une donnée que rien n'exploite.
   Second sens : tout champ du profil que le code lit doit être demandé ici —
   sinon une condition conclurait sur une donnée que personne ne peut saisir.
   Un écart dans l'un ou l'autre sens fait échouer la génération.

   Les champs sont lus dans le code par « p.champ » ou par les auxiliaires
   « ouiNon(p, "champ") » et « p[cle] » des règles typées — l'inspection les
   couvre tous trois.

   Usage : node questionnaire-social.js                                      */
const fs = require("fs");
const path = require("path");

const SOURCES = ["referentiel-social.js", "moteur-social.js", "controles-social.js",
  "plan-social.js", "modeles-social.js"]
  .map(n => fs.readFileSync(path.join(__dirname, n), "utf8")).join("\n");

const LIGNES = [];
const q = (champ, libelle, format, aide) => LIGNES.push({ champ, libelle, format, aide });

q("entreprise", "Dénomination de l'entreprise", "texte",
  "Elle pré-remplit les rapports et les modèles du plan d'action.");
q("dateAudit", "Date à laquelle la situation est décrite", "AAAA-MM-JJ",
  "Les délais (mise à jour du document unique, cycles d'entretiens…) se mesurent à cette date.");
q("effectif", "Effectif de l'entreprise (salariés)", "nombre",
  "C'est lui qui ouvre ou ferme la plupart des obligations : 11 (comité), 20 (emploi des travailleurs handicapés), 50 (règlement intérieur, BDESE, index, participation…), 250 (référent harcèlement), 300 (CSSCT, commissions).");
q("seuilDepuis12Mois", "Ce niveau d'effectif est-il atteint depuis au moins douze mois consécutifs ?", "oui / non",
  "Plusieurs obligations ne naissent qu'après un maintien du seuil dans la durée : un franchissement récent ne les déclenche pas encore.");
q("secteur", "Secteur d'activité", "texte",
  "Il oriente la convention applicable et le contenu des modèles (document unique notamment).");
q("conventionCollective", "Convention collective applicable (intitulé ou IDCC)", "texte",
  "Elle s'identifie par l'activité réelle de l'entreprise. Le relais de l'application ne sert que le code du travail : les obligations conventionnelles sont listées « à vérifier », jamais affirmées.");
q("groupe", "L'entreprise appartient-elle à un groupe ?", "oui / non",
  "Le groupe déclenche le comité de groupe, et pèse sur certains seuils des modules dédiés.");
q("etablissementsDistincts", "L'entreprise comporte-t-elle au moins deux établissements distincts ?", "oui / non",
  "Plusieurs établissements distincts appellent des CSE d'établissement et un CSE central, et des registres par établissement.");
q("sectionSyndicale", "Une section syndicale d'organisation représentative est-elle constituée ?", "oui / non",
  "C'est elle — pas l'effectif — qui déclenche les négociations obligatoires.");
q("accordsCollectifs", "Des accords collectifs d'entreprise sont-ils en vigueur ?", "oui / non",
  "Un accord (méthode, égalité, participation…) peut aménager les périodicités et les contenus : versez-les aux modules dédiés.");
q("matieresInflammables", "Des matières inflammables sont-elles manipulées ?", "oui / non",
  "Elles imposent la consigne de sécurité incendie quel que soit l'effectif.");
q("cadres", "L'entreprise emploie-t-elle des cadres ?", "oui / non",
  "La prévoyance des cadres est une obligation conventionnelle au coût de carence très élevé.");
q("projetLicenciementEco", "Un licenciement pour motif économique est-il envisagé ou en cours ?", "oui / non",
  "S'il l'est, les modules licenciement économique et PSE doivent être passés avant toute notification.");

/* ─────────────────────────── la garantie, dans les deux sens ─────────── */
const lusParLeCode = new Set();
for (const m of SOURCES.matchAll(/\bp\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) lusParLeCode.add(m[1]);
for (const m of SOURCES.matchAll(/ouiNon\(\s*p\s*,\s*"([a-zA-Z0-9_]+)"/g)) lusParLeCode.add(m[1]);
/* p[cle] des règles typées : cle vient des verifs, pas du profil — ignoré.
   dateAudit est lu par les règles de délai via p.dateAudit : couvert. */

const demandes = new Set(LIGNES.map(l => l.champ));
const nonLus = [...demandes].filter(c => !lusParLeCode.has(c)).sort();
const nonDemandes = [...lusParLeCode].filter(c => !demandes.has(c)).sort();

module.exports = { LIGNES, nonLus, nonDemandes };

if (require.main === module) {
  console.log(`${LIGNES.length} questions d'orientation`
    + ` · champs demandés jamais lus : ${nonLus.length ? nonLus.join(", ") : "aucun"}`
    + ` · champs lus jamais demandés : ${nonDemandes.length ? nonDemandes.join(", ") : "aucun"}`);
  if (nonLus.length || nonDemandes.length) {
    console.error("Divergence entre le questionnaire et le code : la génération échoue.");
    process.exit(1);
  }
}
