/* Le régime de la négociation obligatoire en entreprise : ce que les textes
   commandent, et rien d'autre.

   TROIS RÈGLES DE MÉTHODE :

   1. L'obligation naît des sections syndicales, pas de l'effectif. L. 2242-1
      vise « les entreprises où sont constituées une ou plusieurs sections
      syndicales d'organisations représentatives ». Sans section syndicale,
      aucune négociation n'est due — tout le module est sans objet. Tant qu'on
      ne sait pas si une section existe, rien ne se contrôle.

   2. Deux régimes, jamais mélangés. Un accord de méthode (L. 2242-10 et
      L. 2242-11) peut fixer les périodicités, dans la limite de quatre ans et
      à condition de porter les cinq mentions que L. 2242-11 énumère. À défaut
      d'accord — ou si l'accord ne respecte pas ses propres stipulations —,
      le régime supplétif de L. 2242-13 s'applique : rémunération chaque
      année, égalité chaque année, gestion des emplois et des parcours tous
      les trois ans à partir de trois cents salariés, salariés expérimentés
      tous les trois ans à partir de trois cents salariés (L. 2242-2-1).

   3. Le moteur rend le régime et les échéances ; il ne prononce rien. Les
      contrôles prononcent, et une donnée absente ne produit jamais une
      conformité.                                                            */
const D = require("./dates.js");

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

/* Les quatre négociations, telles que les textes les nomment. */
const THEMES = {
  remuneration: {
    cle: "remuneration",
    titre: "Rémunération, temps de travail et partage de la valeur ajoutée",
    fondement: "L. 2242-1, 1°", contenu: "L. 2242-15",
    supplAnnees: 1, seuil: null,
  },
  egalite: {
    cle: "egalite",
    titre: "Égalité professionnelle entre les femmes et les hommes et qualité de vie et des conditions de travail",
    fondement: "L. 2242-1, 2°", contenu: "L. 2242-17",
    supplAnnees: 1, seuil: null,
  },
  gepp: {
    cle: "gepp",
    titre: "Gestion des emplois et des parcours professionnels",
    fondement: "L. 2242-2", contenu: "L. 2242-20",
    supplAnnees: 3, seuil: 300,
  },
  experimentes: {
    cle: "experimentes",
    titre: "Emploi, travail et amélioration des conditions de travail des salariés expérimentés",
    fondement: "L. 2242-2-1", contenu: "L. 2242-2-1",
    supplAnnees: 3, seuil: 300,
  },
};

/* L'assujettissement : la section syndicale d'une organisation représentative. */
function assujettissement(f) {
  if (!renseigne(f.sectionsSyndicales))
    return { connu: false, du: null,
      motif: "Il n'est pas indiqué si une section syndicale d'organisation représentative est constituée dans l'entreprise. C'est elle qui déclenche l'obligation de négocier (L. 2242-1) : sans cette réponse, rien ne se contrôle." };
  if (nie(f.sectionsSyndicales))
    return { connu: true, du: false,
      motif: "Aucune section syndicale d'organisation représentative n'est constituée : les négociations obligatoires de L. 2242-1 ne sont pas dues. L'information sur les mises à disposition de salariés reste due aux salariés qui la demandent (L. 2242-16, second alinéa)." };
  return { connu: true, du: true,
    motif: "Une ou plusieurs sections syndicales d'organisations représentatives sont constituées : l'employeur engage les négociations de L. 2242-1 — et, selon l'effectif, celles de L. 2242-2 et L. 2242-2-1." };
}

/* Le seuil de trois cents : entreprise ou groupe (L. 2331-1), ou entreprise de
   dimension communautaire comportant au moins cent cinquante salariés en
   France (L. 2242-2 et L. 2242-2-1). */
function seuil300(f) {
  const eff = nombre(f.effectif), grp = dit(f.groupe) ? nombre(f.effectifGroupe) : null;
  const communautaire = dit(f.dimensionCommunautaire) && nombre(f.effectifFrance) !== null
    && nombre(f.effectifFrance) >= 150;
  if (eff === null && grp === null && !renseigne(f.dimensionCommunautaire))
    return { connu: false, atteint: null, motif: "L'effectif n'est pas renseigné : le seuil de trois cents salariés ne peut pas être apprécié." };
  const atteint = (eff !== null && eff >= 300) || (grp !== null && grp >= 300) || communautaire;
  return { connu: true, atteint,
    motif: atteint
      ? "Le seuil de trois cents salariés est atteint (entreprise, groupe au sens de L. 2331-1, ou dimension communautaire avec au moins cent cinquante salariés en France) : les négociations triennales de L. 2242-2 et L. 2242-2-1 sont dues."
      : "Le seuil de trois cents salariés n'est pas atteint : les négociations de L. 2242-2 et L. 2242-2-1 ne sont pas dues." };
}

/* L'accord de méthode : valable s'il porte les cinq mentions de L. 2242-11,
   si sa durée n'excède pas quatre ans, et si aucune périodicité ne dépasse
   quatre ans. Un accord déclaré mais non versé laisse le régime indéterminé —
   la règle est la même que partout dans le dépôt : on ne conclut pas sur un
   texte qu'on n'a pas. */
const MENTIONS = [
  ["themes", "les thèmes et leur périodicité (1°)"],
  ["contenu", "le contenu de chacun des thèmes (2°)"],
  ["calendrier", "le calendrier et les lieux des réunions (3°)"],
  ["informations", "les informations remises et la date de leur remise (4°)"],
  ["suivi", "les modalités de suivi des engagements (5°)"],
];
function regime(f) {
  const a = assujettissement(f);
  if (a.du !== true) return { regime: a.du === false ? "sans objet" : "indéterminé", motif: a.motif };

  const acc = f.accordMethode || {};
  if (!renseigne(acc.existe))
    return { regime: "indéterminé", cause: "accord de méthode non déclaré",
      motif: "Il n'est pas dit si un accord fixant le calendrier, la périodicité, les thèmes et les modalités des négociations (L. 2242-10) existe. Répondez oui ou non : sans accord, le régime supplétif de L. 2242-13 s'applique ; avec un accord, ce sont ses périodicités qui comptent, et il faut le joindre." };

  if (nie(acc.existe))
    return { regime: "supplétif", article: "L. 2242-13",
      motif: "Aucun accord de méthode : le régime supplétif s'applique — rémunération chaque année, égalité chaque année, et, à partir de trois cents salariés, gestion des emplois et des parcours puis salariés expérimentés tous les trois ans (L. 2242-13)." };

  if (!dit(acc.verse))
    return { regime: "indéterminé", cause: "accord de méthode non versé",
      motif: "Un accord de méthode est déclaré mais n'est pas joint au dossier. C'est lui qui fixe les périodicités : sans son texte, le calendrier exigible est inconnu et l'audit ne peut pas conclure." };

  const duree = nombre(acc.dureeAns);
  if (duree === null)
    return { regime: "indéterminé", cause: "durée de l'accord inconnue",
      motif: "La durée de l'accord de méthode n'est pas renseignée. L. 2242-11 la plafonne à quatre ans : sans elle, la validité de l'accord ne peut pas être appréciée." };
  if (duree > 4)
    return { regime: "supplétif", article: "L. 2242-13", accordInvalide: true,
      motif: `L'accord de méthode affiche une durée de ${duree} ans : L. 2242-11 la plafonne à quatre. Un accord qui ne respecte pas ses conditions ne fait pas écran — le régime supplétif de L. 2242-13 s'applique.` };

  const mentions = Array.isArray(acc.mentions) ? acc.mentions : [];
  const absentes = MENTIONS.filter(([cle]) => !mentions.includes(cle));
  if (absentes.length)
    return { regime: "supplétif", article: "L. 2242-13", accordInvalide: true,
      motif: `L'accord de méthode ne porte pas toutes les mentions de L. 2242-11 — manquent : ${absentes.map(x => x[1]).join(" ; ")}. À défaut d'accord conforme, le régime supplétif de L. 2242-13 s'applique.` };

  const per = {};
  for (const t of Object.values(THEMES)) {
    const p = nombre((acc.periodicites || {})[t.cle]);
    if (p !== null && p > 4)
      return { regime: "supplétif", article: "L. 2242-13", accordInvalide: true,
        motif: `L'accord fixe une périodicité de ${p} ans pour « ${t.titre} » : L. 2242-11 impose que chaque thème soit négocié au moins tous les quatre ans.` };
    per[t.cle] = p !== null ? p : 4; /* l'accord peut être muet sur un thème : au moins tous les quatre ans */
  }
  return { regime: "accord de méthode", article: "L. 2242-11", periodicites: per,
    motif: `Un accord de méthode conforme fixe les périodicités (durée de ${duree} an(s), les cinq mentions présentes) : ce sont elles qui commandent le calendrier.` };
}

/* Les échéances : pour chaque thème dû, la périodicité applicable, la date de
   la dernière négociation engagée et le retard éventuel, comptés en mois. */
function echeances(f) {
  const r = regime(f), s = seuil300(f);
  const dateAudit = f.dateAudit;
  const out = { regime: r, seuil: s, themes: {} };
  for (const t of Object.values(THEMES)) {
    const du = t.seuil === null ? true : (s.connu ? s.atteint : null);
    const mois = r.regime === "accord de méthode"
      ? (r.periodicites[t.cle] || 4) * 12
      : t.supplAnnees * 12;
    const nego = (f.negos || {})[t.cle] || {};
    let etat = null, retardMois = null;
    if (r.regime === "indéterminé" || du === null) etat = "indéterminé";
    else if (du === false) etat = "non dû";
    else if (!renseigne(nego.dateEngagement)) etat = "jamais engagée ou non renseignée";
    else {
      const e = D.ecart(nego.dateEngagement, dateAudit);
      if (!e.valide) etat = "dates inexploitables : " + (e.motif || e.cause);
      else {
        const ecMois = e.jours / 30.4375;
        retardMois = Math.round((ecMois - mois) * 10) / 10;
        etat = ecMois <= mois ? "à jour" : "en retard";
      }
    }
    out.themes[t.cle] = { ...t, du, periodiciteMois: mois, nego, etat, retardMois };
  }
  return out;
}

/* La demande syndicale de L. 2242-13, dernier alinéa : transmission aux autres
   organisations dans les huit jours, convocation dans les quinze jours. */
function demandeSyndicale(f) {
  const d = f.demandeSyndicale || {};
  if (!renseigne(d.recue)) return { connue: false, motif: "Il n'est pas indiqué si une organisation syndicale a demandé l'ouverture d'une négociation." };
  if (nie(d.recue)) return { connue: true, recue: false, motif: "Aucune demande syndicale d'ouverture de négociation n'est déclarée." };
  const out = { connue: true, recue: true };
  const t = D.ecart(d.date, d.dateTransmissionAutresOS);
  out.transmission = !renseigne(d.dateTransmissionAutresOS) ? { fait: false, motif: "La transmission de la demande aux autres organisations représentatives n'est pas datée." }
    : !t.valide ? { fait: null, motif: t.motif || "Dates de transmission inexploitables." }
    : { fait: t.jours <= 8, jours: t.jours };
  const c = D.ecart(d.date, d.dateConvocation);
  out.convocation = !renseigne(d.dateConvocation) ? { fait: false, motif: "La convocation des parties n'est pas datée." }
    : !c.valide ? { fait: null, motif: c.motif || "Dates de convocation inexploitables." }
    : { fait: c.jours <= 15, jours: c.jours };
  return out;
}

module.exports = { THEMES, MENTIONS, assujettissement, seuil300, regime, echeances, demandeSyndicale };
