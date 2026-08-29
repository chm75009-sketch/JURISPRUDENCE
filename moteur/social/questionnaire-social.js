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

/* L'inspection des sources ne vaut qu'à la publication : dans le navigateur,
   où il n'y a pas de disque, elle est simplement sautée — elle a déjà été
   jouée, et un échec y aurait fait échouer l'empaquetage. */
let SOURCES = null;
try {
  SOURCES = ["referentiel-social.js", "moteur-social.js", "controles-social.js",
    "plan-social.js", "modeles-social.js"]
    .map(n => fs.readFileSync(path.join(__dirname, n), "utf8")).join("\n");
} catch (e) { SOURCES = null; }

const LIGNES = [];
const q = (champ, libelle, format, aide) => LIGNES.push({ champ, libelle, format, aide });

q("entreprise", "Dénomination de l'entreprise", "texte",
  "Elle pré-remplit les rapports et les modèles du plan d'action.");
q("dateAudit", "Date à laquelle la situation est décrite", "AAAA-MM-JJ",
  "Les délais (mise à jour du document unique, cycles d'entretiens…) se mesurent à cette date.");
q("effectif", "Effectif de l'entreprise (salariés)", "nombre",
  "C'est lui qui ouvre ou ferme la plupart des obligations : 11 (comité, et formation santé-sécurité de ses élus), 20 (emploi des travailleurs handicapés), 50 (règlement intérieur, BDESE, index, participation, quatre réunions santé-sécurité), 250 (référent harcèlement), 300 (CSSCT, commissions formation/logement/égalité), 1 000 (commission économique). La commission des marchés, elle, ne dépend pas de l'effectif de l'entreprise mais des comptes du comité.");
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
q("salariesHorsHoraire", "Des salariés travaillent-ils en dehors d'un horaire collectif uniforme (horaires individualisés, équipes, forfaits, itinérants) ?", "oui / non",
  "Dès qu'un salarié ne suit pas l'horaire collectif affiché, l'employeur doit établir pour lui les documents de décompte de la durée du travail et des repos compensateurs (L. 3171-2).");
q("postesRisquesParticuliers", "Des salariés occupent-ils des postes à risques particuliers (amiante, plomb, agents cancérogènes, agents biologiques 3 et 4, rayonnements ionisants, hyperbare, échafaudages, postes à examen d'aptitude) ?", "oui / non",
  "Ces postes ouvrent le suivi individuel renforcé de l'état de santé et la liste formalisée des postes (R. 4624-22, R. 4624-23).");
q("comiteInstalle", "Le comité social et économique (CSE) a-t-il été effectivement mis en place (élections organisées) ?", "oui / non",
  "Ce n'est pas la même chose que « l'effectif l'exige » : un comité peut être dû sans avoir été mis en place. Six obligations — commission santé-sécurité, commissions supplétives, commission économique, commission des marchés, formation des élus, réunions santé-sécurité — vivent au sein du comité et n'ont pas de support tant qu'il n'existe pas réellement ; répondez « non » si les élections n'ont pas eu lieu, même si le seuil est atteint. La page ne pose la question suivante, sur les comptes du comité, que si vous répondez « oui » ici — un comité qui n'existe pas n'a pas de comptes.");
q("comiteSeuilsComptes", "Les comptes du comité social et économique (CSE) dépassent-ils au moins deux des trois critères de l'article D. 2315-29 — cinquante salariés du comité à la clôture d'un exercice, le montant de ressources annuelles et le montant du total de bilan fixés par renvoi à l'article R. 612-1 du code de commerce ?", "oui / non",
  "C'est le critère de la commission des marchés : il tient aux comptes du CSE, pas à l'effectif de l'entreprise (L. 2315-44-1, D. 2315-29). Le trésorier du CSE ou son expert-comptable a la réponse. Cette question ne se pose que si le comité est effectivement en place — sans comité, elle n'a pas de sens.");
q("epargneSalariale", "Un dispositif d'épargne salariale (intéressement, participation, plan d'épargne) est-il en place ?", "oui / non",
  "Il déclenche la remise du livret d'épargne salariale à chaque embauche (L. 3341-6).");
q("cadres", "L'entreprise emploie-t-elle des cadres ?", "oui / non",
  "La prévoyance des cadres est une obligation conventionnelle au coût de carence très élevé.");
q("projetLicenciementEco", "Un licenciement pour motif économique est-il envisagé ou en cours ?", "oui / non",
  "S'il l'est, les modules licenciement économique et PSE doivent être passés avant toute notification.");

/* Les neuf questions ajoutées avec les matières venues de l'audit voisin :
   durée du travail, contrats courts, santé au travail au poste. Chacune
   commande des obligations qui, sans elle, resteraient indéterminées — le
   référentiel ne suppose jamais qu'une situation existe ou n'existe pas. */
q("heuresSupplementaires", "Des heures supplémentaires sont-elles accomplies ?", "oui / non",
  "Elles ouvrent le contingent annuel et, au-delà, la contrepartie obligatoire en repos (L. 3121-30, L. 3121-33, D. 3121-24, L. 3121-38).");
q("forfaitJours", "Des salariés sont-ils soumis à un forfait annuel en jours ?", "oui / non",
  "Le forfait suppose un accord collectif, une convention individuelle écrite, un document de contrôle des journées et un suivi de la charge de travail (L. 3121-64, L. 3121-65, L. 3121-60). Sans accord conforme, il est privé d'effet.");
q("tempsPartiel", "L'entreprise emploie-t-elle des salariés à temps partiel ?", "oui / non",
  "Le temps partiel appelle un contrat écrit portant la durée et sa répartition, une durée minimale, la majoration de toutes les heures complémentaires et une priorité d'accès aux emplois à temps complet.");
q("contratsCourts", "L'entreprise recourt-elle à des contrats à durée déterminée, à l'intérim ou à des stagiaires ?", "oui / non",
  "Les contrats courts appellent l'écrit et son motif précis, le délai de transmission, le délai de carence, l'indemnité de fin de contrat — et, sur les postes à risques, une formation renforcée à la sécurité.");
q("travailNuit", "Des salariés travaillent-ils la nuit ?", "oui / non",
  "Le recours au travail de nuit est exceptionnel et justifié ; il suppose un accord ou une autorisation, des contreparties et un suivi médical régulier (L. 3122-1, L. 3122-2).");
q("jeunesTravailleurs", "L'entreprise emploie-t-elle ou accueille-t-elle des travailleurs de moins de dix-huit ans (apprentis, stagiaires, jeunes en contrat) ?", "oui / non",
  "Certains travaux leur sont interdits, et toute dérogation suit une procédure encadrée (L. 4153-8, L. 4153-9, R. 4153-40).");
q("entreprisesExterieures", "Des entreprises extérieures interviennent-elles dans vos locaux, ou des opérations de chargement ou de déchargement y sont-elles réalisées par un transporteur ?", "oui / non",
  "L'inspection commune préalable et le plan de prévention écrit sont dus (R. 4512-6) ; les opérations de chargement ou de déchargement font l'objet d'un protocole de sécurité (R. 4515-4).");
q("postesEcran", "Des salariés travaillent-ils habituellement sur écran de visualisation ?", "oui / non",
  "L'information et la formation à l'utilisation du poste sont dues avant la première affectation et à chaque modification importante (R. 4542-16), avec un examen approprié des yeux et de la vue.");
q("agentsChimiques", "Des agents chimiques dangereux (produits d'entretien industriels, solvants, carburants, peintures, gaz) sont-ils utilisés ou stockés ?", "oui / non",
  "Ils appellent les fiches de données de sécurité, l'information des travailleurs et du comité (R. 4412-38) et une notice de poste par situation de travail exposante (R. 4412-39). Les produits d'entretien en relèvent souvent : ne répondez « non » qu'après vérification.");

/* ─────────────────────────── la garantie, dans les deux sens ─────────── */
const lusParLeCode = new Set();
for (const m of (SOURCES || "").matchAll(/\bp\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) lusParLeCode.add(m[1]);
for (const m of (SOURCES || "").matchAll(/ouiNon\(\s*p\s*,\s*"([a-zA-Z0-9_]+)"/g)) lusParLeCode.add(m[1]);
/* p[cle] des règles typées : cle vient des verifs, pas du profil — ignoré.
   dateAudit est lu par les règles de délai via p.dateAudit : couvert. */

const demandes = new Set(LIGNES.map(l => l.champ));
const nonLus = SOURCES === null ? [] : [...demandes].filter(c => !lusParLeCode.has(c)).sort();
const nonDemandes = SOURCES === null ? [] : [...lusParLeCode].filter(c => !demandes.has(c)).sort();

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
