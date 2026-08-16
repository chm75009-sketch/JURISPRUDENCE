/* Le régime du plan de sauvegarde de l'emploi : ce que les seuils commandent.

   Trois bascules, et rien d'autre n'est décidé ici :

   — le plan est dû : cinquante salariés dans l'entreprise et dix licenciements
     envisagés dans une même période de trente jours (L. 1233-61) ;
   — l'accompagnement individuel bascule à mille salariés : congé de reclassement
     au-dessus (L. 1233-71), contrat de sécurisation professionnelle en deçà
     (L. 1233-66, qui vise « les entreprises non soumises à l'article
     L. 1233-71 ») — les deux ne se cumulent pas, et l'un des deux est toujours
     dû dès lors qu'un licenciement économique est envisagé ;
   — le délai d'instruction dépend de la voie : quinze jours pour la validation
     d'un accord, vingt et un pour l'homologation d'un document unilatéral
     (L. 1233-57-4), le silence valant acceptation.

   Ce fichier ne conclut sur aucun dossier : il rend le régime. Les contrôles
   s'en servent, et ce sont eux qui prononcent. */
const ECART = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);

/* Le plan est-il dû ? Le décompte des dix licenciements sur trente jours est
   celui du module économique — il intègre les licenciements déjà prononcés et
   les refus de modification du contrat. Il n'est pas refait ici. */
function planDu(f) {
  const eff = nombre(f.effectif);
  const n = nombre(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
  if (eff === null || n === null) return { du: null, motif: "L'effectif ou le nombre de licenciements n'est pas renseigné." };
  if (eff < 50) return { du: false, motif: `Effectif de ${eff} salariés : le plan n'est dû qu'à partir de cinquante (L. 1233-61).` };
  if (n < 10) return { du: false, motif: `${n} licenciement(s) envisagé(s) sur trente jours : le plan n'est dû qu'à partir de dix (L. 1233-61).` };
  return { du: true, motif: `Effectif de ${eff} salariés et ${n} licenciements envisagés sur une même période de trente jours : le plan est dû (L. 1233-61).` };
}

/* Congé de reclassement ou contrat de sécurisation professionnelle.

   Le seuil de mille se lit à l'échelle de l'entreprise ou de l'établissement,
   et aussi du groupe lorsque l'entreprise appartient à un groupe au sens de
   l'article L. 2331-1 ou à un groupe de dimension communautaire. L'effectif du
   groupe est donc regardé quand il est renseigné. */
const SEUIL_MILLE = 1000;
function accompagnement(f) {
  const eff = nombre(f.effectif), etab = nombre(f.effectifEtablissement), grp = nombre(f.effectifGroupe);
  const atteint = [eff, etab, f.groupe ? grp : null].filter(x => x !== null && x >= SEUIL_MILLE);
  if (eff === null && etab === null && grp === null)
    return { dispositif: null, motif: "Aucun effectif n'est renseigné : le dispositif d'accompagnement ne peut pas être déterminé." };
  if (atteint.length)
    return { dispositif: "congé de reclassement", seuil: SEUIL_MILLE, article: "L. 1233-71",
      motif: `Au moins mille salariés (${Math.max(...atteint)}) : le congé de reclassement est dû, d'une durée qui ne peut excéder douze mois, portés à vingt-quatre en cas de formation de reconversion, financé en totalité par l'employeur.` };
  return { dispositif: "contrat de sécurisation professionnelle", seuil: SEUIL_MILLE, article: "L. 1233-66",
    motif: "En deçà de mille salariés : le contrat de sécurisation professionnelle doit être proposé à chaque salarié dont le licenciement est envisagé. À défaut de proposition, l'employeur doit deux mois de salaire brut à l'assurance chômage, trois si le salarié adhère sur proposition de France Travail." };
}

/* Le délai d'instruction administrative, et la date à laquelle le silence vaut
   acceptation. Le délai court de la réception de la demande complète. */
const INSTRUCTION = {
  accord: { jours: 15, article: "L. 1233-57-4", quoi: "validation de l'accord collectif majoritaire" },
  unilateral: { jours: 21, article: "L. 1233-57-4", quoi: "homologation du document unilatéral" },
};
function instruction(f) {
  const voie = (f.pse || {}).voie;
  if (!voie || !INSTRUCTION[voie]) return { connu: false, motif: "La voie retenue n'est pas arrêtée : le délai d'instruction ne peut pas être calculé." };
  const r = INSTRUCTION[voie];
  const depot = (f.pse || {}).dateDepotAdmin;
  if (!depot) return { connu: true, ...r, motif: `Délai de ${r.jours} jours pour la ${r.quoi}, à compter de la réception du dossier complet. La date de dépôt n'est pas renseignée.` };
  const echeance = ajouter(depot, r.jours);
  return { connu: true, ...r, depot, echeance,
    motif: `Dossier déposé le ${depot} : la décision doit être notifiée au plus tard le ${echeance}. Passé ce terme, le silence vaut acceptation, et l'employeur transmet alors au comité une copie de la demande accompagnée de son accusé de réception.` };
}
function ajouter(iso, jours) {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() + jours);
  return d.toISOString().slice(0, 10);
}

/* La consultation du comité sur le projet, article L. 1233-30.

   Deux choses distinctes, et le module les distingue parce que les confondre
   est l'erreur ordinaire :

   — le comité tient AU MOINS DEUX RÉUNIONS espacées d'au moins quinze jours ;
   — il rend ses deux avis dans un délai qui, à compter de la première réunion,
     ne peut excéder deux, trois ou quatre mois selon le nombre de licenciements.

   Le second est un plafond légal supplétif : une convention ou un accord
   collectif peut prévoir des délais différents — plus longs comme plus courts.
   Le moteur le dit et refuse de conclure quand un accord est déclaré sans être
   versé. À défaut d'avis dans le délai, le comité est réputé consulté. */
const DELAIS_AVIS = [
  { seuil: 0, mois: 2, texte: "moins de cent licenciements" },
  { seuil: 100, mois: 3, texte: "au moins cent et moins de deux cent cinquante" },
  { seuil: 250, mois: 4, texte: "au moins deux cent cinquante" },
];
const ESPACEMENT_MINIMAL = 15;   /* jours, entre deux réunions */

function consultation(f) {
  const n = nombre(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
  if (n === null) return { connu: false, motif: "Le nombre de licenciements n'est pas renseigné : le délai maximal d'avis ne peut pas être déterminé." };
  const t = [...DELAIS_AVIS].reverse().find(x => n >= x.seuil);
  const reunions = Array.isArray(f.datesReunionsCSE) ? f.datesReunionsCSE.filter(Boolean).slice().sort() : [];
  return { connu: true, mois: t.mois, tranche: t.texte, reunions,
    premiere: reunions[0] || null,
    echeance: reunions[0] ? ajouterMois(reunions[0], t.mois) : null,
    motif: `${n} licenciements — ${t.texte} : le comité rend ses deux avis dans un délai qui ne peut excéder ${t.mois} mois à compter de sa première réunion. Une convention ou un accord collectif peut prévoir des délais différents. À défaut d'avis dans le délai, le comité est réputé avoir été consulté.` };
}
function ajouterMois(iso, mois) {
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return null;
  const j = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + mois);
  /* Le 31 mai plus trois mois n'est pas le 31 août pour tout le monde : quand le
     mois d'arrivée est plus court, on retient son dernier jour. */
  if (d.getUTCDate() !== j) d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}
const joursEntre = (a, b) => Math.round((new Date(b + "T00:00:00Z") - new Date(a + "T00:00:00Z")) / 86400000);

/* La priorité de réembauche : un an à compter de la rupture, et seulement si le
   salarié la demande dans ce même délai (L. 1233-45). L'obligation d'information
   des représentants du personnel, elle, ne dépend d'aucune demande. */
function priorite(f) {
  const d = (f.pse || {}).dateRupture || f.dateNotification;
  if (!d) return { connu: false, motif: "La date de rupture n'est pas renseignée." };
  return { connu: true, depuis: d, jusqu: ajouter(d, 365),
    motif: `La priorité de réembauche court jusqu'au ${ajouter(d, 365)} pour le salarié qui en fait la demande dans ce même délai.` };
}

module.exports = { planDu, accompagnement, instruction, priorite, consultation,
  INSTRUCTION, SEUIL_MILLE, DELAIS_AVIS, ESPACEMENT_MINIMAL, ajouter, ajouterMois, joursEntre, ECART };
