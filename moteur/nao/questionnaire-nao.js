/* Le questionnaire de la négociation obligatoire, et sa garantie de
   non-divergence dans les deux sens.

   Premier sens : tout contrôle doit être atteint par au moins une donnée
   demandée, sinon une exigence serait contrôlée sans jamais être renseignée.
   Second sens : tout champ qu'un contrôle lit doit être demandé, sinon le
   contrôle conclut sur du vide. Les deux font échouer la génération.

   Usage : node questionnaire-nao.js      */
const fs = require("fs");
const { C } = require("./controles-nao.js");
const SRC = fs.readFileSync(__dirname + "/controles-nao.js", "utf8");
const MSRC = fs.readFileSync(__dirname + "/moteur-nao.js", "utf8");

/* Les champs lus par chaque fonction du moteur. */
const CHAMPS_MOTEUR = {};
for (const m of MSRC.matchAll(/function (\w+)\(([^)]*)\)\s*\{/g)) {
  const suite = MSRC.slice(m.index).split(/\n(?=function |const [A-Za-z_]+ = |module\.exports)/)[0];
  CHAMPS_MOTEUR[m[1]] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}
/* regime() appelle assujettissement() ; echeances() appelle regime() et
   seuil300(). La fermeture transitive évite de croire un champ orphelin. */
for (let i = 0; i < 3; i++)
  for (const [nom, champs] of Object.entries(CHAMPS_MOTEUR))
    for (const autre of Object.keys(CHAMPS_MOTEUR))
      if (new RegExp("\\b" + autre + "\\(").test(MSRC.split("function " + nom + "(")[1]?.split(/\nfunction /)[0] || ""))
        CHAMPS_MOTEUR[nom] = [...new Set([...champs, ...CHAMPS_MOTEUR[autre]])];

/* Les auxiliaires du fichier des contrôles. */
for (const m of SRC.matchAll(/^(?:const (\w+) = \(?f|function (\w+)\(f[,)])/gm)) {
  const nom = m[1] || m[2];
  const suite = SRC.slice(m.index).split(/\n(?=const [A-Za-z_]+ = |function |ctl\()/)[0];
  CHAMPS_MOTEUR[nom] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}
/* Les gardes appellent le moteur : ils lisent ce qu'il lit. */
CHAMPS_MOTEUR.siAssujetti = [...new Set([...(CHAMPS_MOTEUR.siAssujetti || []), ...(CHAMPS_MOTEUR.assujettissement || [])])];
CHAMPS_MOTEUR.siRegimeConnu = [...new Set([...(CHAMPS_MOTEUR.siRegimeConnu || []), ...(CHAMPS_MOTEUR.regime || [])])];
/* Les fabriques ctlPeriodicite/ctlContenu lisent la fiche via le moteur et via
   nego() : leurs contrôles sont déclarés dans le corps de la fabrique. */
const FABRIQUES = { ctlPeriodicite: ["negos", "dateAudit", "sectionsSyndicales", "accordMethode", "effectif", "groupe", "effectifGroupe", "dimensionCommunautaire", "effectifFrance"],
  ctlContenu: ["negos", "sectionsSyndicales"] };

function corpsDe(id) {
  /* Un contrôle déclaré par fabrique : son corps est celui de la fabrique. */
  const avant = SRC.split(`"${id}"`)[0];
  for (const [nom, champs] of Object.entries(FABRIQUES))
    if (avant.trim().endsWith(nom + "(")) return champs.map(c => `f.${c}`).join(" ");
  const bloc = SRC.split(`"${id}"`)[1];
  return bloc ? bloc.split(/\nctl\(|\nfunction ctl|\nctlPeriodicite\(|\nctlContenu\(/)[0] : "";
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
q("Identité", "groupe", "L'entreprise appartient-elle à un groupe (L. 2331-1) ?", "oui / non", "organigramme du groupe");
q("Identité", "effectifGroupe", "Effectif total du groupe", "nombre", "comptes consolidés");
q("Identité", "dimensionCommunautaire", "Le groupe est-il de dimension communautaire ?", "oui / non", "organigramme du groupe");
q("Identité", "effectifFrance", "Effectif employé en France si le groupe est communautaire", "nombre", "registre du personnel");

q("Le déclencheur", "sectionsSyndicales", "Une ou plusieurs sections syndicales d'organisations représentatives sont-elles constituées ?", "oui / non", "désignations des délégués syndicaux");

q("Les négociations obligatoires", "negosEngagees", "Avez-vous engagé les négociations obligatoires de la période en cours ?", "oui / non", "procès-verbaux d'ouverture, convocations");
q("L'accord de méthode", "accordMethode.existe", "Un accord fixe-t-il le calendrier, la périodicité, les thèmes et les modalités des négociations ?", "oui / non", "accord de méthode");
q("L'accord de méthode", "accordMethode.verse", "Cet accord est-il joint au dossier ?", "oui / non", "l'accord lui-même");
q("L'accord de méthode", "accordMethode.dureeAns", "Durée de l'accord, en années", "nombre", "l'accord lui-même");
q("L'accord de méthode", "accordMethode.mentions", "Mentions que l'accord porte : themes, contenu, calendrier, informations, suivi", "liste", "l'accord lui-même");
q("L'accord de méthode", "accordMethode.periodicites", "Périodicités fixées par thème, en années", "objet", "l'accord lui-même");

q("Les négociations menées", "negos.remuneration", "Rémunération : date d'engagement, issue, dépôt, procès-verbal d'ouverture sur les écarts, thèmes traités", "objet", "convocations, accord ou procès-verbal");
q("Les négociations menées", "negos.egalite", "Égalité et qualité de vie : date d'engagement, issue, dépôt, plan d'action, thèmes traités, appui sur la BDESE", "objet", "convocations, accord ou procès-verbal");
q("Les négociations menées", "negos.gepp", "Gestion des emplois et des parcours : date d'engagement, issue, dépôt", "objet", "convocations, accord ou procès-verbal");
q("Les négociations menées", "negos.experimentes", "Salariés expérimentés : date d'engagement, issue", "objet", "convocations, accord ou procès-verbal");

q("La conduite", "premiereReunion.date", "Date de la première réunion", "AAAA-MM-JJ", "convocation ou relevé de décisions");
q("La conduite", "premiereReunion.lieuCalendrierFixes", "Le lieu et le calendrier des réunions y ont-ils été fixés ?", "oui / non", "relevé de décisions");
q("La conduite", "premiereReunion.informationsRemises", "Les informations ont-elles été remises aux négociateurs ?", "oui / non", "bordereau de remise");
q("La conduite", "premiereReunion.dateRemiseInformations", "Date de remise de ces informations", "AAAA-MM-JJ", "bordereau de remise");
q("La conduite", "reponsesMotivees", "Les propositions syndicales ont-elles reçu une réponse motivée ?", "oui / non", "courriers ou relevés de séance");
q("La conduite", "decisionUnilaterale.prise", "Une décision unilatérale a-t-elle été arrêtée dans une matière en cours de négociation ?", "oui / non", "notes de service");
q("La conduite", "decisionUnilaterale.matiere", "Si oui, laquelle", "texte", "la décision elle-même");
q("La conduite", "decisionUnilaterale.urgence", "L'urgence était-elle invoquée ?", "oui / non", "la décision elle-même");

q("La demande syndicale", "demandeSyndicale.recue", "Une organisation syndicale a-t-elle demandé l'ouverture d'une négociation ?", "oui / non", "courrier reçu");
q("La demande syndicale", "demandeSyndicale.date", "Date de cette demande", "AAAA-MM-JJ", "courrier reçu, daté");
q("La demande syndicale", "demandeSyndicale.dateTransmissionAutresOS", "Date de transmission aux autres organisations représentatives", "AAAA-MM-JJ", "courriers de transmission");
q("La demande syndicale", "demandeSyndicale.dateConvocation", "Date de convocation des parties", "AAAA-MM-JJ", "convocations");

q("L'égalité professionnelle", "indexEgalitePublie", "Les indicateurs d'écarts de rémunération (index de L. 1142-8) sont-ils publiés ?", "oui / non", "publication sur le site ou preuve de mise en ligne");

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
