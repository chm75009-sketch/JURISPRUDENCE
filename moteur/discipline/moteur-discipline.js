/* Le régime de la discipline et du règlement intérieur, côté employeur : ce que
   les textes commandent, et rien d'autre.

   QUATRE RÈGLES DE MÉTHODE :

   1. Le règlement intérieur est obligatoire à partir de cinquante salariés
      (L. 1311-2), au terme d'un délai de douze mois à compter du franchissement
      du seuil (L. 1311-2, second alinéa ; R. 1321-5). En dessous, il reste
      facultatif — mais s'il existe, il obéit aux mêmes règles de contenu et aux
      mêmes formalités : L. 1321-1 à L. 1321-6 ne posent aucun seuil.

   2. La procédure disciplinaire de L. 1332-2 n'est pas due pour « un
      avertissement ou une sanction de même nature n'ayant pas d'incidence,
      immédiate ou non, sur la présence dans l'entreprise, la fonction, la
      carrière ou la rémunération du salarié ». Le critère est donc l'INCIDENCE,
      pas l'étiquette. Certaines sanctions la portent par construction — une
      mise à pied disciplinaire suspend le contrat et la rémunération, une
      rétrogradation change la fonction — et le moteur le dit avec son motif ;
      pour l'avertissement, le blâme et les sanctions non nommées, l'incidence
      est demandée, jamais devinée.

   3. Une garantie de fond conventionnelle ou de règlement intérieur déplace la
      règle. La Cour de cassation l'a jugé deux fois dans les termes que le
      module reprend :
        — Soc., 8 septembre 2021, n° 19-15.039 (publié) : « La consultation d'un
          organisme chargé, en vertu d'une disposition conventionnelle ou d'un
          règlement intérieur, de donner son avis sur un licenciement envisagé
          par un employeur constitue une garantie de fond, en sorte que le
          licenciement prononcé sans que cet organisme ait été consulté ne peut
          avoir de cause réelle et sérieuse. L'irrégularité commise dans le
          déroulement de la procédure disciplinaire prévue par une disposition
          conventionnelle ou un règlement intérieur, est assimilée à la
          violation d'une garantie de fond et rend le licenciement sans cause
          réelle et sérieuse lorsqu'elle a privé le salarié de droits de sa
          défense ou lorsqu'elle est susceptible d'avoir exercé en l'espèce une
          influence sur la décision finale de licenciement par l'employeur. »
        — Soc., 3 mai 2011, n° 10-14.104 (publié) : « L'employeur qui n'est pas
          tenu en principe de convoquer un salarié avant de lui notifier un
          avertissement, est tenu de le faire dès lors qu'au regard d'un
          règlement intérieur l'avertissement peut avoir une influence sur le
          maintien du salarié dans l'entreprise. Tel est le cas lorsque le
          règlement intérieur, instituant ainsi une garantie de fond, subordonne
          le licenciement d'un salarié à l'existence de deux sanctions
          antérieures pouvant être constituées notamment par un avertissement. »
          Même solution au regard d'une convention collective : Soc.,
          22 septembre 2021, n° 18-22.204 (publié).

   4. Le moteur rend les qualifications, les seuils et les échéances ; il ne
      prononce rien. Les contrôles prononcent, et une donnée absente ne produit
      jamais une conformité.

   Chaque règle écrite ici l'est sur un article lu à la source
   (textes-discipline.json, identifiants LEGIARTI) ou sur une décision lue à la
   source dans la base Judilibre. Ce qui n'a pas pu être lu n'est pas codé.   */
const D = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x
  : (typeof x === "string" && x.trim() !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

/* ------------------------------------------------------------ les natures

   L'étiquette ne décide pas : c'est l'incidence sur la présence, la fonction,
   la carrière ou la rémunération qui commande l'entretien préalable
   (L. 1332-2). Trois natures la portent par construction, et le motif dit
   pourquoi ; les autres la font demander. */
const NATURES = {
  "avertissement": { incidence: null,
    motif: "L'avertissement est nommément visé par l'exception de L. 1332-2 : la convocation n'est pas due s'il n'a aucune incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération." },
  "blâme": { incidence: null,
    motif: "Le blâme n'est pas nommé par L. 1332-2 : il relève de l'exception s'il est « une sanction de même nature » que l'avertissement, c'est-à-dire sans incidence sur la présence, la fonction, la carrière ou la rémunération. L'incidence est déclarée, jamais présumée." },
  "mise à pied disciplinaire": { incidence: true, misePied: true,
    motif: "La mise à pied disciplinaire suspend le contrat et la rémunération pendant sa durée : elle a une incidence immédiate sur la présence dans l'entreprise et sur la rémunération, de sorte que l'exception de L. 1332-2 ne peut pas la couvrir." },
  "mutation disciplinaire": { incidence: true,
    motif: "La mutation prononcée à titre disciplinaire change le poste ou le lieu de travail : elle a une incidence sur la fonction, de sorte que l'exception de L. 1332-2 ne peut pas la couvrir." },
  "rétrogradation": { incidence: true,
    motif: "La rétrogradation modifie la qualification et, le plus souvent, la rémunération : elle a une incidence sur la fonction et la carrière, de sorte que l'exception de L. 1332-2 ne peut pas la couvrir." },
  "licenciement disciplinaire": { incidence: true, licenciement: true,
    motif: "Le licenciement met fin au contrat : il a par définition une incidence sur la présence dans l'entreprise. Sa procédure n'est toutefois pas celle de L. 1332-2 mais celle du licenciement, et sa contestation relève, non du chapitre III du titre III du livre III, mais des règles du licenciement (L. 1333-3)." },
  "sanction pécuniaire ou amende": { incidence: true, pecuniaire: true,
    motif: "Une amende ou toute autre sanction pécuniaire est interdite, et toute disposition ou stipulation contraire est réputée non écrite (L. 1331-2)." },
  "autre sanction": { incidence: null,
    motif: "La sanction n'est pas nommée : son incidence sur la présence, la fonction, la carrière ou la rémunération est déclarée, jamais présumée." },
};

/* L'effectif, apprécié tel qu'il est déclaré. */
function effectif(f) {
  const e = nombre(f.effectif);
  if (e === null) return { connu: false, valeur: null,
    motif: "L'effectif de l'entreprise n'est pas renseigné : le seuil de cinquante salariés de l'article L. 1311-2 ne peut pas être apprécié." };
  return { connu: true, valeur: e, motif: `Effectif déclaré : ${e} salariés.` };
}

/* Le règlement intérieur est-il obligatoire ? (L. 1311-2, R. 1321-5) */
function riDu(f) {
  const e = effectif(f);
  if (!e.connu) return { connu: false, du: null, motif: e.motif };
  if (e.valeur < 50) return { connu: true, du: false,
    motif: `Effectif de ${e.valeur} salariés (moins de cinquante) : l'établissement d'un règlement intérieur n'est pas obligatoire (L. 1311-2). S'il en existe un, il obéit néanmoins à toutes les règles de contenu et à toutes les formalités des articles L. 1321-1 à L. 1321-6, qui ne posent aucun seuil.` };
  const ri = f.ri || {};
  const delai = { atteint: null, mois: null };
  if (renseigne(ri.dateFranchissementSeuil)) {
    const ec = D.ecart(ri.dateFranchissementSeuil, f.dateAudit,
      "la date à laquelle le seuil de cinquante salariés a été atteint", "la date de l'audit");
    if (ec.valide) { delai.mois = Math.round((ec.jours / 30.4375) * 10) / 10; delai.atteint = ec.jours >= 365; }
  }
  return { connu: true, du: true, delai,
    motif: `Effectif de ${e.valeur} salariés (au moins cinquante) : l'établissement d'un règlement intérieur est obligatoire (L. 1311-2, premier alinéa). L'obligation s'applique au terme d'un délai de douze mois à compter de la date à laquelle le seuil a été atteint (L. 1311-2, second alinéa ; R. 1321-5)` +
      (delai.mois === null ? ", date que le dossier ne renseigne pas."
        : `. Le seuil est déclaré atteint depuis environ ${delai.mois} mois.`) };
}

/* La qualification de la mesure auditée (L. 1331-1) et son incidence
   (L. 1332-2). */
function qualification(f) {
  const s = f.sanction || {};
  if (!renseigne(s.nature)) return { connu: false, motif:
    "La nature de la mesure n'est pas renseignée : constitue une sanction toute mesure, autre que les observations verbales, prise par l'employeur à la suite d'un agissement du salarié considéré comme fautif, qu'elle affecte ou non immédiatement la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération (L. 1331-1)." };
  const n = NATURES[s.nature];
  if (!n) return { connu: false, nature: s.nature, motif:
    `La nature déclarée (« ${s.nature} ») n'est pas une de celles que le module sait qualifier : aucune conséquence n'en est tirée.` };
  const out = { connu: true, nature: s.nature, licenciement: !!n.licenciement,
    misePied: !!n.misePied, pecuniaire: !!n.pecuniaire, motifNature: n.motif };
  if (n.incidence === true) { out.incidence = true; out.incidenceDeclaree = false; return out; }
  if (!renseigne(s.incidence)) { out.incidence = null; out.incidenceDeclaree = true; return out; }
  out.incidence = dit(s.incidence); out.incidenceDeclaree = true;
  return out;
}

/* La garantie de fond : ce que le règlement intérieur ou la convention
   collective ajoutent à la loi.

   Deux figures distinctes, et le module les tient séparées :
     — une procédure conventionnelle ou de règlement intérieur (consultation
       d'un conseil de discipline, d'une commission paritaire, entretien imposé,
       autre formalité) : Soc., 8 septembre 2021, n° 19-15.039 ;
     — un règlement intérieur ou une convention collective qui subordonne le
       licenciement à l'existence de sanctions antérieures, ce qui donne à
       l'avertissement lui-même une influence sur le maintien dans l'entreprise
       et impose l'entretien préalable : Soc., 3 mai 2011, n° 10-14.104 ;
       Soc., 22 septembre 2021, n° 18-22.204.                                 */
function garantieDeFond(f) {
  const g = f.garantie || {};
  const out = {};
  out.procedure = renseigne(g.procedureApplicable) ? (dit(g.procedureApplicable) ? "oui" : "non") : null;
  out.suivie = renseigne(g.suivie) ? g.suivie : null;
  out.nature = renseigne(g.nature) ? g.nature : null;
  out.subordination = renseigne(g.licenciementSubordonneSanctions)
    ? (dit(g.licenciementSubordonneSanctions) ? "oui" : "non") : null;
  out.source = renseigne(g.source) ? g.source : null;
  return out;
}

/* L'entretien préalable est-il dû ? (L. 1332-2, et la garantie de fond) */
function entretienDu(f) {
  const q = qualification(f);
  const g = garantieDeFond(f);
  if (!q.connu) return { connu: false, du: null, motif: q.motif };
  if (q.licenciement) return { connu: true, du: null, licenciement: true,
    motif: "La mesure auditée est un licenciement disciplinaire : la procédure applicable n'est pas celle de L. 1332-2 mais celle du licenciement pour motif personnel, que ce module n'audite pas. La prescription des faits (L. 1332-4), l'interdiction des sanctions pécuniaires (L. 1331-2) et les garanties de fond conventionnelles ou de règlement intérieur, elles, s'appliquent au licenciement disciplinaire, et sont contrôlées ici." };
  if (q.incidence === true) return { connu: true, du: true, fondement: "L. 1332-2",
    motif: `La sanction a une incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération : l'exception de L. 1332-2 ne joue pas, la convocation et l'entretien préalable sont dus. ${q.motifNature}` };
  if (g.subordination === "oui") return { connu: true, du: true, fondement: "garantie de fond",
    motif: "Le règlement intérieur ou la convention collective subordonne le licenciement à l'existence de sanctions antérieures : la sanction, fût-elle un avertissement, peut avoir une influence sur le maintien du salarié dans l'entreprise. Cette stipulation institue une garantie de fond, et l'entretien préalable est dû alors même que L. 1332-2 ne l'imposerait pas (Soc., 3 mai 2011, n° 10-14.104, publié ; Soc., 22 septembre 2021, n° 18-22.204, publié)." };
  if (q.incidence === null || g.subordination === null)
    return { connu: false, du: null, motif:
      "L'entretien préalable ne peut pas être apprécié : il faut savoir si la sanction a une incidence sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération (L. 1332-2), et si le règlement intérieur ou la convention collective subordonne le licenciement à l'existence de sanctions antérieures — auquel cas l'entretien est dû même pour un avertissement (Soc., 3 mai 2011, n° 10-14.104)." };
  return { connu: true, du: false, fondement: "L. 1332-2",
    motif: `La sanction est déclarée sans incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération, et ni le règlement intérieur ni la convention collective ne subordonnent le licenciement à des sanctions antérieures : la convocation n'est pas due (L. 1332-2). ${q.motifNature}` };
}

/* La date à laquelle les poursuites disciplinaires ont été engagées.

   R. 1332-1 le dit : la lettre de convocation est adressée « dans le délai de
   deux mois fixé à l'article L. 1332-4 ». C'est donc l'envoi de la convocation
   qui engage les poursuites ; à défaut de convocation, c'est la notification de
   la sanction elle-même. */
function dateEngagement(f) {
  const s = f.sanction || {};
  if (renseigne(s.dateConvocation)) return { date: s.dateConvocation, quoi: "l'envoi de la lettre de convocation (R. 1332-1)" };
  if (renseigne(s.dateNotification)) return { date: s.dateNotification, quoi: "la notification de la sanction, aucune convocation n'ayant été envoyée" };
  return { date: null, quoi: null };
}

/* Le même quantième, n mois plus tard — la règle de R. 1332-3, appliquée aussi
   au délai de deux mois de L. 1332-4, qui se compte de la même façon. */
function moisApres(iso, n) {
  if (!D.estDateISO(iso)) return null;
  const [a, m, j] = iso.split("-").map(Number);
  const an = a + Math.floor((m - 1 + n) / 12), mo = ((m - 1 + n) % 12) + 1;
  const dernier = new Date(Date.UTC(an, mo, 0)).getUTCDate();
  const jour = Math.min(j, dernier);
  return `${an}-${String(mo).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}
const jourSemaine = iso => new Date(iso + "T12:00:00Z").getUTCDay();   /* 0 = dimanche */

/* La prorogation de R. 1332-3 : « Lorsque le dernier jour de ce délai est un
   samedi, un dimanche ou un jour férié ou chômé, le délai est prorogé jusqu'au
   premier jour ouvrable suivant. » L'application ne tient pas le calendrier des
   jours fériés — elle proroge donc le samedi et le dimanche, et signale que le
   report peut aller au-delà. */
function prorogerOuvrable(iso) {
  if (!D.estDateISO(iso)) return null;
  let d = iso, tours = 0;
  while (tours < 3) {
    const s = jourSemaine(d);
    if (s !== 0 && s !== 6) return d;
    const t = new Date(d + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + 1);
    d = t.toISOString().slice(0, 10); tours++;
  }
  return d;
}

/* La prescription des faits fautifs : deux mois à compter du jour où
   l'employeur en a eu connaissance (L. 1332-4). */
function prescriptionFaits(f) {
  const s = f.sanction || {};
  const eng = dateEngagement(f);
  if (!renseigne(s.dateConnaissance) || !eng.date)
    return { connu: false, motif: "La date à laquelle l'employeur a eu connaissance des faits, ou la date d'engagement des poursuites (envoi de la convocation, à défaut notification de la sanction), n'est pas renseignée : le délai de deux mois de L. 1332-4 ne peut pas être vérifié." };
  const ec = D.ecart(s.dateConnaissance, eng.date,
    "la date de connaissance des faits par l'employeur", "la date d'engagement des poursuites disciplinaires");
  if (!ec.valide) return { connu: false, motif: ec.motif };
  const limite = moisApres(s.dateConnaissance, 2);
  return { connu: true, jours: ec.jours, limite, engagement: eng,
    depasse: eng.date > limite,
    penales: renseigne(s.poursuitesPenales) ? dit(s.poursuitesPenales) : null };
}

/* La prescription des sanctions antérieures : trois ans (L. 1332-5). */
function sanctionsAnterieures(f) {
  const s = f.sanction || {};
  if (!renseigne(s.sanctionsAnterieuresInvoquees))
    return { connu: false, motif: "Il n'est pas indiqué si des sanctions antérieures sont invoquées à l'appui de la nouvelle sanction (L. 1332-5)." };
  if (nie(s.sanctionsAnterieuresInvoquees)) return { connu: true, invoquees: false };
  const eng = dateEngagement(f);
  if (!renseigne(s.dateSanctionAnterieurePlusAncienne) || !eng.date)
    return { connu: false, invoquees: true, motif: "Des sanctions antérieures sont invoquées, mais la date de la plus ancienne d'entre elles, ou la date d'engagement des poursuites, n'est pas renseignée : le délai de trois ans de L. 1332-5 ne peut pas être vérifié." };
  const ec = D.ecart(s.dateSanctionAnterieurePlusAncienne, eng.date,
    "la date de la sanction antérieure la plus ancienne invoquée", "la date d'engagement des poursuites disciplinaires");
  if (!ec.valide) return { connu: false, invoquees: true, motif: ec.motif };
  const limite = moisApres(s.dateSanctionAnterieurePlusAncienne, 36);
  return { connu: true, invoquees: true, jours: ec.jours, limite,
    depasse: eng.date > limite, engagement: eng };
}

/* Le délai entre l'entretien et la notification : « La sanction ne peut
   intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour
   fixé pour l'entretien » (L. 1332-2), le mois se comptant selon R. 1332-3.

   Les jours ouvrables sont tous les jours de la semaine sauf le dimanche et les
   jours fériés. L'application ne tient pas le calendrier des jours fériés :
   elle compte les jours non dominicaux, et le dit. Quand le compte tombe
   exactement sur le minimum, un jour férié dans l'intervalle suffirait à le
   faire passer en dessous : le contrôle rend alors « risque à vérifier », et
   non « conforme ». */
function joursOuvrables(depuis, jusqu) {
  if (!D.estDateISO(depuis) || !D.estDateISO(jusqu)) return null;
  let n = 0;
  const t = new Date(depuis + "T12:00:00Z"), fin = new Date(jusqu + "T12:00:00Z");
  while (t < fin) { t.setUTCDate(t.getUTCDate() + 1); if (t.getUTCDay() !== 0) n++; }
  return n;
}

function delaiNotification(f) {
  const s = f.sanction || {};
  if (!renseigne(s.dateEntretien) || !renseigne(s.dateNotification))
    return { connu: false, motif: "La date de l'entretien ou la date de notification de la sanction n'est pas renseignée : les délais de L. 1332-2 — au moins deux jours ouvrables, au plus un mois — ne peuvent pas être vérifiés." };
  const ec = D.ecart(s.dateEntretien, s.dateNotification,
    "la date de l'entretien préalable", "la date de notification de la sanction");
  if (!ec.valide) return { connu: false, motif: ec.motif };
  const ouvrables = joursOuvrables(s.dateEntretien, s.dateNotification);
  const limite = moisApres(s.dateEntretien, 1);
  const limiteProrogee = prorogerOuvrable(limite);
  const depassement = D.ecart(limiteProrogee, s.dateNotification).valide
    ? D.ecart(limiteProrogee, s.dateNotification).jours : 0;
  return { connu: true, jours: ec.jours, ouvrables, limite, limiteProrogee,
    trop: s.dateNotification > limiteProrogee, depassement,
    prorogee: limiteProrogee !== limite };
}

/* L'entrée en vigueur du règlement intérieur : postérieure d'un mois à
   l'accomplissement des formalités de publicité (L. 1321-4), le délai courant
   à compter de la dernière en date des formalités de publicité et de dépôt
   (R. 1321-3). */
function entreeVigueurRI(f) {
  const ri = f.ri || {};
  if (!renseigne(ri.dateDerniereFormalite) || !renseigne(ri.dateEntreeVigueur))
    return { connu: false, motif: "La date de la dernière des formalités de publicité et de dépôt, ou la date d'entrée en vigueur inscrite au règlement intérieur, n'est pas renseignée : le délai d'un mois de L. 1321-4 ne peut pas être vérifié." };
  const ec = D.ecart(ri.dateDerniereFormalite, ri.dateEntreeVigueur,
    "la dernière des formalités de publicité et de dépôt", "la date d'entrée en vigueur inscrite au règlement intérieur");
  if (!ec.valide) return { connu: false, motif: ec.motif };
  const plancher = moisApres(ri.dateDerniereFormalite, 1);
  return { connu: true, jours: ec.jours, plancher, suffisant: ri.dateEntreeVigueur > plancher };
}

module.exports = { NATURES, effectif, riDu, qualification, garantieDeFond, entretienDu,
  dateEngagement, prescriptionFaits, sanctionsAnterieures, delaiNotification,
  entreeVigueurRI, moisApres, joursOuvrables, prorogerOuvrable };
