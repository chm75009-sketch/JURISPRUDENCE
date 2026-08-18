/* Les contrôles de la négociation obligatoire en entreprise.

   L'objet du module : vérifier que l'employeur a engagé, mené et conclu les
   négociations que la loi lui impose — aux périodicités qui s'imposent à lui —
   et mesurer ce à quoi il s'expose quand il ne l'a pas fait.

   Une chose ne se contrôle pas et il faut le dire ici : AUCUN TEXTE N'OBLIGE À
   CONCLURE. L'obligation est de négocier, sérieusement et loyalement
   (L. 2242-6) ; l'échec se constate par un procès-verbal de désaccord
   (L. 2242-5). Aucun contrôle ne rend donc « non conforme » au motif qu'aucun
   accord n'a été signé — mais l'absence de toute issue formalisée, elle, se
   constate.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ». */
const M = require("./moteur-nao.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Le garde commun : sans section syndicale, rien n'est dû ; sans réponse sur
   ce point, rien ne se contrôle. */
function siAssujetti(f, suite) {
  const a = M.assujettissement(f);
  if (a.du === null) return { etat: MANQ, motif: a.motif };
  if (a.du === false) return { etat: SO, motif: a.motif };
  return suite(a);
}

/* Le second garde : un régime indéterminé n'autorise aucun contrôle de
   périodicité — on ne mesure pas un retard sur un calendrier inconnu. */
function siRegimeConnu(f, suite) {
  return siAssujetti(f, () => {
    const r = M.regime(f);
    if (r.regime === "indéterminé") return { etat: MANQ, motif: r.motif };
    return suite(r);
  });
}

const nego = (f, cle) => (f.negos || {})[cle] || {};

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------------- le régime */

ctl("NAO-CTL-REG-01", "Régime applicable",
  "L'assujettissement à l'obligation de négocier est-il établi ?",
  ["L. 2242-1"],
  f => siAssujetti(f, a => ({ etat: CONF, motif: a.motif })));

ctl("NAO-CTL-REG-02", "Régime applicable",
  "Le calendrier qui s'impose à l'entreprise est-il identifié — accord de méthode conforme, ou régime supplétif ?",
  ["L. 2242-10", "L. 2242-11", "L. 2242-13"],
  f => siRegimeConnu(f, r => {
    if (r.accordInvalide) return { etat: NC, motif: r.motif };
    return { etat: CONF, motif: r.motif };
  }));

/* -------------------------------------------------------- les périodicités */

function ctlPeriodicite(id, cle, penalite) {
  const t = M.THEMES[cle];
  ctl(id, "Périodicité des négociations",
    `La négociation « ${t.titre} » a-t-elle été engagée dans la périodicité applicable ?`,
    [t.fondement, "L. 2242-13"],
    f => siRegimeConnu(f, () => {
      const e = M.echeances(f).themes[cle];
      if (e.du === null) return { etat: MANQ, motif: M.seuil300(f).motif };
      if (e.du === false) return { etat: SO, motif: M.seuil300(f).motif };
      if (/jamais engagée/.test(e.etat))
        return { etat: MANQ, motif: `Aucune date d'engagement n'est renseignée pour cette négociation. Si elle n'a réellement jamais été engagée, le manquement est constitué — la périodicité applicable est de ${e.periodiciteMois / 12} an(s)${penalite ? ", et " + penalite : ""}.` };
      if (/inexploitables/.test(e.etat)) return { etat: MANQ, motif: e.etat };
      if (e.etat === "en retard")
        return { etat: NC, motif: `Dernière négociation engagée le ${e.nego.dateEngagement} : la périodicité de ${e.periodiciteMois / 12} an(s) est dépassée d'environ ${e.retardMois} mois au ${f.dateAudit}${penalite ? ". " + penalite : "."}` };
      return { etat: CONF, motif: `Négociation engagée le ${e.nego.dateEngagement} : la périodicité de ${e.periodiciteMois / 12} an(s) est tenue au ${f.dateAudit}.` };
    }));
}
ctlPeriodicite("NAO-CTL-PER-01", "remuneration",
  "le défaut de négociation sur les salaires effectifs expose à la pénalité de L. 2242-7 — jusqu'à 10 % des exonérations de cotisations de L. 241-13 du code de la sécurité sociale, portés à 100 % en cas de manquement réitéré dans les six ans");
ctlPeriodicite("NAO-CTL-PER-02", "egalite",
  "l'absence d'accord ou de plan d'action expose à la pénalité de L. 2242-8 — jusqu'à 1 % des rémunérations");
ctlPeriodicite("NAO-CTL-PER-03", "gepp", "");
ctlPeriodicite("NAO-CTL-PER-04", "experimentes", "");

/* ------------------------------------------------- la demande syndicale */

ctl("NAO-CTL-DEM-01", "Demande syndicale",
  "Une demande syndicale d'ouverture a-t-elle été suivie de la transmission sous huit jours et de la convocation sous quinze ?",
  ["L. 2242-13, dernier alinéa"],
  f => siAssujetti(f, () => {
    const d = M.demandeSyndicale(f);
    if (!d.connue) return { etat: MANQ, motif: d.motif };
    if (!d.recue) return { etat: SO, motif: d.motif };
    const griefs = [];
    if (d.transmission.fait === false) griefs.push(d.transmission.motif || `transmission aux autres organisations en ${d.transmission.jours} jours, pour huit au plus`);
    if (d.transmission.fait === null) return { etat: MANQ, motif: d.transmission.motif };
    if (d.convocation.fait === false) griefs.push(d.convocation.motif || `convocation des parties en ${d.convocation.jours} jours, pour quinze au plus`);
    if (d.convocation.fait === null) return { etat: MANQ, motif: d.convocation.motif };
    if (griefs.length) return { etat: NC, motif: `La demande syndicale n'a pas été traitée dans les délais de L. 2242-13 : ${griefs.join(" ; ")}.` };
    return { etat: CONF, motif: `Demande syndicale transmise aux autres organisations en ${d.transmission.jours} jour(s) et parties convoquées en ${d.convocation.jours} jour(s) : les délais de huit et quinze jours sont tenus.` };
  }));

/* ------------------------------------------------------------ la loyauté */

ctl("NAO-CTL-LOY-01", "Loyauté de la négociation",
  "La première réunion a-t-elle fixé le lieu, le calendrier, les informations remises et la date de leur remise ?",
  ["L. 2242-14"],
  f => siAssujetti(f, () => {
    const r = f.premiereReunion || {};
    if (vide(r.date)) return { etat: MANQ, motif: "La première réunion de négociation n'est pas datée. L. 2242-14 impose d'y fixer le lieu et le calendrier des réunions, les informations remises et la date de cette remise." };
    const manques = [];
    if (!dit(r.lieuCalendrierFixes)) manques.push("le lieu et le calendrier des réunions");
    if (!dit(r.informationsRemises)) manques.push("les informations remises aux négociateurs");
    if (vide(r.dateRemiseInformations)) manques.push("la date de remise de ces informations");
    if (manques.length)
      return { etat: NC, motif: `La première réunion du ${r.date} n'a pas fixé : ${manques.join(" ; ")} (L. 2242-14). Sans ces éléments, l'engagement sérieux et loyal de la négociation n'est pas établi.` };
    return { etat: CONF, motif: `Première réunion du ${r.date} : lieu, calendrier, informations et date de remise fixés, conformément à L. 2242-14.` };
  }));

ctl("NAO-CTL-LOY-02", "Loyauté de la négociation",
  "Les conditions de dépôt d'un accord sur les salaires effectifs sont-elles réunies — procès-verbal d'ouverture des négociations sur les écarts de rémunération, réponses motivées aux propositions syndicales ?",
  ["L. 2242-6"],
  f => siAssujetti(f, () => {
    const n = nego(f, "remuneration");
    if (n.issue !== "accord") return { etat: SO, motif: "Aucun accord sur les salaires effectifs n'est déclaré : les conditions de dépôt de L. 2242-6 n'ont pas d'objet." };
    const manques = [];
    if (!dit(n.pvOuvertureEcarts)) manques.push("le procès-verbal d'ouverture des négociations sur les écarts de rémunération entre les femmes et les hommes, qui doit accompagner le dépôt");
    if (!dit(f.reponsesMotivees)) manques.push("la réponse motivée aux propositions des organisations syndicales, que L. 2242-6 range dans l'engagement sérieux et loyal");
    if (manques.length) return { etat: NC, motif: `L'accord sur les salaires effectifs ne peut pas être régulièrement déposé : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Accord sur les salaires effectifs accompagné du procès-verbal d'ouverture des négociations sur les écarts femmes-hommes, et réponses motivées apportées : les conditions de L. 2242-6 sont réunies." };
  }));

ctl("NAO-CTL-UNI-01", "Loyauté de la négociation",
  "Des décisions unilatérales ont-elles été prises dans les matières en cours de négociation ?",
  ["L. 2242-4"],
  f => siAssujetti(f, () => {
    const d = f.decisionUnilaterale || {};
    if (vide(d.prise)) return { etat: MANQ, motif: "Il n'est pas indiqué si des décisions unilatérales concernant la collectivité des salariés ont été arrêtées pendant une négociation en cours." };
    if (nie(d.prise)) return { etat: CONF, motif: "Aucune décision unilatérale n'a été arrêtée dans les matières en cours de négociation : L. 2242-4 est respecté." };
    if (dit(d.urgence)) return { etat: RISQ, motif: `Une décision unilatérale a été prise pendant la négociation${vide(d.matiere) ? "" : " (" + d.matiere + ")"}, l'urgence étant invoquée. L. 2242-4 la réserve au cas où « l'urgence le justifie » : cette justification s'apprécie au fond, elle doit pouvoir être documentée.` };
    return { etat: NC, motif: `Une décision unilatérale concernant la collectivité des salariés a été arrêtée pendant la négociation${vide(d.matiere) ? "" : " (" + d.matiere + ")"}, sans urgence justifiée : L. 2242-4 l'interdit tant que la négociation est en cours.` };
  }));

/* -------------------------------------------------------------- l'issue */

ctl("NAO-CTL-ISS-01", "Issue des négociations",
  "Chaque négociation terminée s'est-elle conclue par un accord déposé ou un procès-verbal de désaccord déposé ?",
  ["L. 2242-5", "R. 2242-1"],
  f => siAssujetti(f, () => {
    const griefs = [], vus = [];
    for (const t of Object.values(M.THEMES)) {
      const n = nego(f, t.cle);
      if (vide(n.issue) || n.issue === "en cours" || n.issue === "aucune") continue;
      vus.push(t.cle);
      if (n.issue === "accord" && !dit(n.depot))
        griefs.push(`« ${t.titre} » : accord conclu mais dépôt non établi (L. 2231-6)`);
      if (n.issue === "PV de désaccord" && !dit(n.depot))
        griefs.push(`« ${t.titre} » : procès-verbal de désaccord non déposé — L. 2242-5 et R. 2242-1 imposent son dépôt dans les conditions de D. 2231-2, avec les dernières propositions des parties et les mesures que l'employeur entend appliquer unilatéralement`);
    }
    if (!vus.length) return { etat: MANQ, motif: "Aucune négociation n'est déclarée terminée (accord ou procès-verbal de désaccord) : l'issue ne peut pas être contrôlée." };
    if (griefs.length) return { etat: NC, motif: griefs.join(" ; ") + "." };
    return { etat: CONF, motif: `Chaque négociation terminée a son issue formalisée et déposée (${vus.length} négociation(s)).` };
  }));

/* ------------------------------------------------------------- l'égalité */

ctl("NAO-CTL-EGA-01", "Égalité professionnelle",
  "À défaut d'accord sur l'égalité professionnelle, un plan d'action annuel a-t-il été établi et déposé ?",
  ["L. 2242-3"],
  f => siAssujetti(f, () => {
    const n = nego(f, "egalite");
    if (n.issue === "accord") return { etat: SO, motif: "Un accord sur l'égalité professionnelle est déclaré : le plan d'action supplétif de L. 2242-3 n'a pas d'objet." };
    if (vide(n.issue) || n.issue === "en cours") return { etat: MANQ, motif: "L'issue de la négociation sur l'égalité professionnelle n'est pas établie : le besoin d'un plan d'action ne peut pas être apprécié." };
    const p = n.planAction || {};
    if (!dit(p.existe))
      return { etat: NC, motif: "Aucun accord sur l'égalité professionnelle et aucun plan d'action annuel : L. 2242-3 impose ce plan — objectifs de progression, actions qualitatives et quantitatives, coût — et son dépôt auprès de l'autorité administrative. La négociation sur les salaires effectifs doit alors porter aussi sur la programmation des mesures de suppression des écarts." };
    if (!dit(p.depot))
      return { etat: NC, motif: "Le plan d'action égalité existe mais son dépôt auprès de l'autorité administrative n'est pas établi : L. 2242-3 l'impose." };
    return { etat: CONF, motif: "À défaut d'accord, un plan d'action annuel est établi et déposé, conformément à L. 2242-3." };
  }));

ctl("NAO-CTL-EGA-02", "Égalité professionnelle",
  "L'entreprise d'au moins cinquante salariés est-elle couverte — accord ou plan d'action — et l'index de L. 1142-8 est-il publié ?",
  ["L. 2242-8"],
  f => siAssujetti(f, () => {
    const eff = typeof f.effectif === "number" ? f.effectif : null;
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné : la pénalité de L. 2242-8 vise les entreprises d'au moins cinquante salariés." };
    if (eff < 50) return { etat: SO, motif: `Effectif de ${eff} salariés : la pénalité de L. 2242-8 vise les entreprises d'au moins cinquante salariés.` };
    const n = nego(f, "egalite");
    const couvert = n.issue === "accord" || dit((n.planAction || {}).existe);
    const index = f.indexEgalitePublie;
    if (!couvert)
      return { etat: NC, motif: "Ni accord d'égalité professionnelle ni plan d'action : l'entreprise s'expose à la pénalité de L. 2242-8, jusqu'à 1 % des rémunérations versées au titre des périodes non couvertes." };
    if (vide(index)) return { etat: MANQ, motif: "La couverture est acquise (accord ou plan), mais la publication des indicateurs d'écarts de rémunération (L. 1142-8) n'est pas renseignée : son absence expose à la même pénalité (L. 2242-8, quatrième alinéa)." };
    if (nie(index))
      return { etat: NC, motif: "Les indicateurs d'écarts de rémunération de L. 1142-8 ne sont pas publiés : L. 2242-8 permet d'appliquer la pénalité de 1 % à ce seul titre." };
    return { etat: CONF, motif: "Accord ou plan d'action en vigueur et indicateurs de L. 1142-8 publiés : la pénalité de L. 2242-8 est écartée en l'état." };
  }));

/* -------------------------------------------------------------- le contenu */

const ITEMS_REMUNERATION = [
  ["salaires", "les salaires effectifs (1°)"],
  ["temps de travail", "la durée effective et l'organisation du temps de travail (2°)"],
  ["épargne salariale", "l'intéressement, la participation et l'épargne salariale à défaut de dispositif (3°)"],
  ["écarts femmes-hommes", "le suivi des mesures de suppression des écarts de rémunération entre les femmes et les hommes (4°)"],
];
const ITEMS_EGALITE = [
  ["articulation", "l'articulation entre vie personnelle et vie professionnelle (1°)"],
  ["écarts femmes-hommes", "les objectifs et mesures d'égalité professionnelle, dont la suppression des écarts de rémunération (2°)"],
  ["discriminations", "la lutte contre les discriminations (3°)"],
  ["handicap", "l'insertion et le maintien dans l'emploi des travailleurs handicapés (4°), sur le rapport de L. 2242-18"],
  ["prévoyance", "la prévoyance et les remboursements complémentaires à défaut de couverture (5°)"],
  ["déconnexion", "l'exercice du droit à la déconnexion (6°)"],
];
function ctlContenu(id, cle, items, fondement) {
  const t = M.THEMES[cle];
  ctl(id, "Contenu des négociations",
    `La négociation « ${t.titre} » a-t-elle couvert les thèmes que ${fondement} énumère ?`,
    [fondement],
    f => siAssujetti(f, () => {
      const n = nego(f, cle);
      if (vide(n.dateEngagement)) return { etat: SO, motif: "Cette négociation n'est pas déclarée engagée : son contenu n'a pas d'objet — sa périodicité, elle, est contrôlée par ailleurs." };
      const traites = Array.isArray(n.themesTraites) ? n.themesTraites : [];
      if (!traites.length) return { etat: MANQ, motif: "Les thèmes traités ne sont pas renseignés : la couverture du contenu légal ne peut pas être appréciée." };
      const absents = items.filter(([marque]) => !traites.includes(marque));
      if (!absents.length) return { etat: CONF, motif: `Les ${items.length} thèmes de ${fondement} sont couverts.` };
      return { etat: RISQ, motif: `${absents.length} thème(s) de ${fondement} ne sont pas rattachés à la négociation : ${absents.map(x => x[1]).join(" ; ")}. Un thème légal laissé hors de la table doit l'être en connaissance de cause — l'obligation porte sur la négociation du thème, pas sur sa conclusion.` };
    }));
}
ctlContenu("NAO-CTL-CON-01", "remuneration", ITEMS_REMUNERATION, "L. 2242-15");
ctlContenu("NAO-CTL-CON-02", "egalite", ITEMS_EGALITE, "L. 2242-17");

/* ------------------------------------------------------------ l'exposition */

ctl("NAO-CTL-PEN-01", "Exposition aux sanctions",
  "À quoi l'entreprise s'expose-t-elle en l'état du dossier ?",
  ["L. 2242-7", "L. 2242-8", "L. 2243-1", "L. 2243-2"],
  f => siRegimeConnu(f, () => {
    const e = M.echeances(f);
    const retards = Object.values(e.themes).filter(t => t.etat === "en retard");
    const inconnus = Object.values(e.themes).filter(t => /jamais engagée|inexploitables/.test(t.etat) && t.du === true);
    if (retards.length) {
      const l = retards.map(t => `« ${t.titre} »`).join(", ");
      return { etat: NC, motif: `Négociation(s) hors périodicité : ${l}. L'exposition est triple — le délit d'entrave de L. 2243-1 et L. 2243-2 (un an d'emprisonnement, 3 750 € d'amende), la pénalité salaires de L. 2242-7 s'agissant de la rémunération, la pénalité de 1 % de L. 2242-8 s'agissant de l'égalité. Le montant en est fixé par l'administration selon les efforts constatés : c'est une exposition, pas un chiffrage.` };
    }
    if (inconnus.length) return { etat: MANQ, motif: "Des négociations dues n'ont pas de date d'engagement renseignée : l'exposition ne peut pas être appréciée." };
    return { etat: RISQ, motif: "Aucun manquement de périodicité constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : la loyauté de chaque négociation (L. 2242-6, L. 2242-14) et la couverture égalité (L. 2242-8) s'apprécient en continu — ce contrôle ne prononce jamais un blanc-seing." };
  }));

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["NAO-CTL-PEN-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE };
