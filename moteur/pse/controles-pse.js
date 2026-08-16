/* Les contrôles du plan de sauvegarde de l'emploi.

   Ce module est distinct du module économique parce que son objet l'est : le
   module économique vérifie qu'un licenciement peut être prononcé ; celui-ci
   vérifie qu'un plan tient devant l'administration. Il travaille néanmoins sur
   la même fiche — l'effectif, le nombre de licenciements et le calendrier ne se
   ressaisissent pas — et le régime du plan est calculé par moteur-pse.js.

   Une chose ne peut pas être contrôlée et il faut le dire ici plutôt que dans
   une note : AUCUN TEXTE NE FIXE LE MONTANT D'UN PLAN. La proportionnalité aux
   moyens de l'entreprise, de l'unité économique et sociale et du groupe est
   appréciée par l'autorité administrative, puis par le juge administratif
   (L. 1233-57-3). Les contrôles de calibrage calculent donc des rapports, les
   affichent, et rendent « risque à vérifier ». Aucun ne rend « conforme » sur
   le montant. Un feu vert sur ce point serait faux, et il serait le plus
   coûteux de tous.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ». */
const M = require("./moteur-pse.js");
const { L1233_62, RECLASSEMENT, SUIVI } = require("./mesures.js");
const REC = require("./recevabilite.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const nb = x => (typeof x === "number" && isFinite(x) ? x : null);
const euros = n => n === null ? "—" : n.toLocaleString("fr-FR") + " €";

/* Le garde commun : tant que le plan n'est pas dû, aucun contrôle du module
   n'a d'objet ; et tant que l'on ne sait pas s'il est dû, aucun ne conclut. */
function siPlanDu(f, suite) {
  const r = M.planDu(f);
  if (r.du === null) return { etat: MANQ, motif: r.motif };
  if (r.du === false) return { etat: SO, motif: r.motif };
  return suite(r);
}

/* La liste des mesures saisies. Le formulaire la remplit sous forme de tableau
   — une ligne par mesure — importable depuis Excel ou Word. */
const lignes = f => Array.isArray((f.plan || {}).mesures) ? (f.plan || {}).mesures : null;

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------- le contenu du plan */

ctl("PSE-CTL-CON-01", "Contenu du plan",
  "Les sept rubriques de l'article L. 1233-62 ont-elles été examinées ?",
  ["L. 1233-62"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie : le contenu du plan ne peut pas être examiné." };
    const vues = new Set(L.map(m => String(m.rubrique || "").trim()).filter(Boolean));
    const absentes = L1233_62.mesures.filter(m => !vues.has(m.marque));
    if (!absentes.length)
      return { etat: CONF, motif: `Les ${L1233_62.mesures.length} rubriques de l'article sont toutes rattachées à au moins une mesure du plan.` };
    /* La liste n'est pas limitative — « des mesures telles que » — et l'absence
       d'une rubrique n'est donc pas une non-conformité par elle-même. Mais
       l'administration contrôle le plan au regard de ces rubriques : une
       rubrique laissée vide sans explication est un motif de refus ordinaire. */
    return { etat: RISQ, motif: `${absentes.length} rubrique(s) de l'article L. 1233-62 ne sont rattachées à aucune mesure : ${absentes.map(m => m.marque).join(", ")}. La liste de l'article n'est pas limitative — il énonce « des mesures telles que » — mais l'administration apprécie le plan au regard de ces rubriques. Une rubrique écartée doit l'être en connaissance de cause, et le motif de son écartement doit pouvoir être donné.` };
  }));

ctl("PSE-CTL-CON-02", "Contenu du plan",
  "Le plan de reclassement interne est-il intégré et vise-t-il les salariés les plus exposés ?",
  ["L. 1233-61"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie." };
    const rec = L.filter(m => String(m.rubrique || "").trim() === "1°");
    if (!rec.length)
      return { etat: NC, motif: `Aucune action de reclassement interne n'est saisie. ${RECLASSEMENT.texte} Le plan de reclassement n'est pas une mesure parmi d'autres : l'article en fait le cœur du plan.` };
    if (vide((f.plan || {}).salariesExposes))
      return { etat: MANQ, motif: "Les salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification — ne sont pas identifiés. L'article les vise nommément." };
    return { etat: CONF, motif: `${rec.length} action(s) de reclassement interne saisie(s), et les salariés dont la réinsertion est particulièrement difficile sont identifiés.` };
  }));

ctl("PSE-CTL-CON-03", "Contenu du plan",
  "Le reclassement interne est-il limité au territoire national ?",
  ["L. 1233-61", "L. 1233-62, 1°"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie." };
    const hors = L.filter(m => /étranger|hors de France|international|filiale étrangère/i.test(String(m.intitule || "") + " " + String(m.detail || "")));
    return hors.length
      ? { etat: RISQ, motif: `${hors.length} mesure(s) paraissent porter sur des emplois situés hors du territoire national. Le plan de reclassement de l'article L. 1233-61 vise le reclassement sur le territoire national : une offre étrangère ne compte pas dans l'obligation, même si rien n'interdit de la proposer en sus.` }
      : { etat: CONF, motif: "Aucune mesure de reclassement ne paraît porter hors du territoire national." };
  }));

/* ---------------------------------------------------------- le chiffrage */

ctl("PSE-CTL-CHF-01", "Chiffrage",
  "Chaque mesure porte-t-elle un budget, un nombre de bénéficiaires et une durée ?",
  ["L. 1233-57-3"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    if (L === null) return { etat: MANQ, motif: "Aucune mesure n'est saisie." };
    const incomplets = L.filter(m => nb(m.budget) === null || nb(m.beneficiaires) === null || vide(m.duree));
    return incomplets.length
      ? { etat: RISQ, motif: `${incomplets.length} mesure(s) sur ${L.length} ne portent pas à la fois un budget, un nombre de bénéficiaires et une durée : ${incomplets.slice(0, 5).map(m => m.intitule || m.rubrique || "sans intitulé").join(" ; ")}${incomplets.length > 5 ? " …" : ""}. L'administration apprécie la proportionnalité des moyens : une mesure non chiffrée n'est pas appréciable, et elle ne pèse rien dans cette appréciation.` }
      : { etat: CONF, motif: `Les ${L.length} mesures du plan portent un budget, un nombre de bénéficiaires et une durée.` };
  }));

ctl("PSE-CTL-CHF-02", "Chiffrage",
  "Le budget total du plan est-il cohérent avec le détail des mesures ?",
  ["L. 1233-62"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    const annonce = nb((f.plan || {}).budgetTotal);
    if (L === null || annonce === null) return { etat: MANQ, motif: "Le budget total annoncé ou le détail des mesures n'est pas renseigné." };
    const somme = L.reduce((n, m) => n + (nb(m.budget) || 0), 0);
    const ecart = Math.abs(somme - annonce);
    if (!somme) return { etat: MANQ, motif: "Aucune mesure n'est chiffrée : la somme ne peut pas être comparée au total annoncé." };
    if (ecart / annonce > 0.02)
      return { etat: NC, motif: `Budget total annoncé : ${euros(annonce)}. Somme des mesures : ${euros(somme)}. Écart de ${euros(ecart)}. Un plan dont le total ne correspond pas au détail se retourne contre celui qui le produit : c'est la première vérification faite en séance.` };
    return { etat: CONF, motif: `Budget total de ${euros(annonce)}, conforme à la somme des mesures.` };
  }));

/* --------------------------------------------------------- le calibrage

   Rien ici ne conclut à la conformité. Les rapports sont calculés et affichés ;
   l'appréciation appartient à l'administration puis au juge. */

ctl("PSE-CTL-CAL-01", "Calibrage",
  "À combien revient le plan par salarié licencié ?",
  ["L. 1233-57-3, 2°"],
  f => siPlanDu(f, r => {
    const annonce = nb((f.plan || {}).budgetTotal);
    const n = nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
    if (annonce === null || n === null || !n) return { etat: MANQ, motif: "Le budget total du plan ou le nombre de licenciements n'est pas renseigné : le coût par salarié ne peut pas être calculé." };
    const parTete = Math.round(annonce / n);
    return { etat: RISQ, calcul: { budget: annonce, licenciements: n, parTete },
      motif: `Budget de ${euros(annonce)} pour ${n} licenciements, soit ${euros(parTete)} par salarié. Ce chiffre n'est pas un verdict : aucun texte ne fixe de montant. L'administration apprécie les mesures d'accompagnement au regard de l'importance du projet et des moyens du groupe (L. 1233-57-3, 1° et 2°). Le chiffre est donné pour être comparé aux plans du même secteur et aux précédents de l'entreprise.` };
  }));

ctl("PSE-CTL-CAL-02", "Calibrage",
  "Le plan est-il rapporté aux moyens du groupe, et non à ceux de la seule filiale ?",
  ["L. 1233-57-3, 1°"],
  f => siPlanDu(f, () => {
    if (vide(f.groupe) ) return { etat: MANQ, motif: "L'appartenance à un groupe n'est pas renseignée : le périmètre d'appréciation des moyens ne peut pas être déterminé." };
    if (f.groupe === false || f.groupe === "non")
      return { etat: RISQ, motif: "L'entreprise n'appartient à aucun groupe : les moyens appréciés sont ceux de l'entreprise et, s'il en existe une, de l'unité économique et sociale. L'appréciation reste celle de l'administration." };
    const annonce = nb((f.plan || {}).budgetTotal);
    const res = nb((f.plan || {}).resultatGroupe);
    if (annonce === null || res === null)
      return { etat: MANQ, motif: "Le budget du plan ou le résultat consolidé du groupe n'est pas renseigné. Un plan calibré sur les seuls moyens de la filiale est le motif de refus d'homologation le plus fréquent : le rapport doit pouvoir être présenté." };
    const part = res > 0 ? Math.round((annonce / res) * 1000) / 10 : null;
    return { etat: RISQ, calcul: { budget: annonce, resultatGroupe: res, part },
      motif: `Budget du plan : ${euros(annonce)}. Résultat consolidé du groupe : ${euros(res)}${part !== null ? `, soit ${part} % de celui-ci` : ""}. L'article L. 1233-57-3 fait des moyens du groupe le premier critère d'appréciation. Le rapport est calculé et affiché ; il n'est pas jugé ici — aucun seuil n'existe.` };
  }));

ctl("PSE-CTL-CAL-03", "Calibrage",
  "Les comptes du groupe sont-ils versés au dossier ?",
  ["L. 1233-57-3, 1°"],
  f => siPlanDu(f, () => {
    if (vide(f.groupe)) return { etat: MANQ, motif: "L'appartenance à un groupe n'est pas renseignée." };
    if (f.groupe === false || f.groupe === "non") return { etat: SO, motif: "L'entreprise n'appartient à aucun groupe." };
    const P = Array.isArray(f.pieces) ? f.pieces : [];
    return P.some(p => /comptes.?groupe|consolid/i.test(String(p.type || p.nom || "")))
      ? { etat: CONF, motif: "Les comptes consolidés du groupe sont versés : l'administration peut apprécier la proportionnalité des mesures." }
      : { etat: RISQ, motif: "Les comptes du groupe ne sont pas versés. L'administration apprécie les moyens du groupe ; à défaut de comptes, elle apprécie ce qu'elle a, et l'employeur perd la main sur ce qui est retenu contre lui." };
  }));

/* -------------------------------------------------- l'accompagnement individuel */

ctl("PSE-CTL-ACC-01", "Accompagnement individuel",
  "Le dispositif d'accompagnement dû est-il celui que l'effectif commande ?",
  ["L. 1233-66", "L. 1233-71"],
  f => {
    const a = M.accompagnement(f);
    if (!a.dispositif) return { etat: MANQ, motif: a.motif };
    const choisi = (f.plan || {}).accompagnement;
    if (vide(choisi)) return { etat: MANQ, motif: `${a.motif} Le dispositif retenu n'est pas renseigné.` };
    return String(choisi).toLowerCase().indexOf(a.dispositif.slice(0, 6).toLowerCase()) >= 0 || String(choisi) === a.dispositif
      ? { etat: CONF, motif: `Dispositif retenu : ${choisi}. ${a.motif}` }
      : { etat: NC, motif: `Dispositif retenu : « ${choisi} ». Or ${a.motif} Les deux dispositifs ne se cumulent pas, et ne se choisissent pas : l'effectif les commande.` };
  });

ctl("PSE-CTL-ACC-02", "Accompagnement individuel",
  "Le congé de reclassement respecte-t-il sa durée maximale et son financement ?",
  ["L. 1233-71", "L. 1233-72"],
  f => {
    const a = M.accompagnement(f);
    if (!a.dispositif) return { etat: MANQ, motif: a.motif };
    if (a.dispositif !== "congé de reclassement") return { etat: SO, motif: a.motif };
    const d = nb((f.plan || {}).dureeConge);
    if (d === null) return { etat: MANQ, motif: "La durée du congé de reclassement n'est pas renseignée." };
    const reconversion = (f.plan || {}).formationReconversion === true || (f.plan || {}).formationReconversion === "oui";
    const max = reconversion ? 24 : 12;
    if (d > max)
      return { etat: NC, motif: `Congé de ${d} mois. La durée ne peut excéder douze mois, portés à vingt-quatre en cas de formation de reconversion professionnelle${reconversion ? "" : " — que le dossier ne mentionne pas"} (L. 1233-71).` };
    return { etat: CONF, motif: `Congé de ${d} mois, dans la limite de ${max}. Il est pris pendant le préavis, que le salarié est dispensé d'exécuter ; lorsqu'il excède le préavis, le terme de celui-ci est reporté jusqu'à la fin du congé, et la rémunération de la période excédentaire est celle de l'allocation de conversion (L. 1233-72). L'employeur finance l'ensemble des actions.` };
  });

ctl("PSE-CTL-ACC-03", "Accompagnement individuel",
  "Le contrat de sécurisation professionnelle est-il proposé au bon moment ?",
  ["L. 1233-66"],
  f => {
    const a = M.accompagnement(f);
    if (!a.dispositif) return { etat: MANQ, motif: a.motif };
    if (a.dispositif !== "contrat de sécurisation professionnelle") return { etat: SO, motif: a.motif };
    const r = M.planDu(f);
    const dateProp = (f.plan || {}).dateProposition;
    const dateDec = (f.pse || {}).dateDecisionAdmin;
    if (vide(dateProp)) return { etat: MANQ, motif: "La date de proposition du contrat de sécurisation professionnelle n'est pas renseignée. À défaut de proposition, l'employeur doit à l'assurance chômage deux mois de salaire brut par salarié, portés à trois si le salarié adhère sur proposition de France Travail." };
    if (r.du === true) {
      if (vide(dateDec)) return { etat: MANQ, motif: "Un plan est dû : la proposition doit être faite après la notification de la décision de validation ou d'homologation, dont la date n'est pas renseignée." };
      return dateProp >= dateDec
        ? { etat: CONF, motif: `Proposition du ${dateProp}, postérieure à la décision administrative du ${dateDec}.` }
        : { etat: NC, motif: `Proposition du ${dateProp}, antérieure à la décision administrative du ${dateDec}. Lorsqu'un plan est dû, la proposition est faite après la notification de la décision (L. 1233-66).` };
    }
    return { etat: CONF, motif: `Proposition du ${dateProp}. Hors plan, elle se fait lors de l'entretien préalable ou à l'issue de la dernière réunion des représentants du personnel.` };
  });

/* ------------------------------------------------------- la voie et l'instruction */

ctl("PSE-CTL-VOI-01", "Voie et instruction",
  "La voie retenue est-elle arrêtée : accord majoritaire ou document unilatéral ?",
  ["L. 1233-24-1", "L. 1233-57-3"],
  f => siPlanDu(f, () => {
    const v = (f.pse || {}).voie;
    if (vide(v)) return { etat: MANQ, motif: "La voie n'est pas arrêtée. Elle détermine tout le calendrier — quinze jours d'instruction contre vingt et un — et se choisit avant la première réunion." };
    return { etat: CONF, motif: v === "accord"
      ? "Accord majoritaire : signature par des syndicats ayant recueilli au moins 50 % des suffrages exprimés au premier tour des dernières élections, puis validation administrative dans les quinze jours."
      : "Document unilatéral soumis à homologation dans les vingt et un jours : l'administration vérifie le contenu, la régularité de la consultation et le respect des articles L. 1233-61 à L. 1233-63." };
  }));

ctl("PSE-CTL-VOI-02", "Voie et instruction",
  "L'accord majoritaire remplit-il la condition de représentativité ?",
  ["L. 1233-24-1"],
  f => siPlanDu(f, () => {
    if ((f.pse || {}).voie !== "accord") return { etat: SO, motif: "Voie du document unilatéral : la condition de représentativité ne s'applique pas." };
    const s = nb((f.pse || {}).suffrages);
    if (s === null) return { etat: MANQ, motif: "Le pourcentage de suffrages recueilli par les organisations signataires n'est pas renseigné." };
    return s >= 50
      ? { etat: CONF, motif: `${s} % des suffrages exprimés au premier tour des dernières élections : la condition est remplie.` }
      : { etat: NC, motif: `${s} % des suffrages. L'accord doit être signé par des organisations ayant recueilli au moins 50 % des suffrages exprimés au premier tour des dernières élections des titulaires au comité (L. 1233-24-1). En deçà, il n'existe pas comme accord majoritaire, et la voie bascule sur le document unilatéral.` };
  }));

ctl("PSE-CTL-VOI-03", "Voie et instruction",
  "Le délai d'instruction est-il tenu, et l'échéance du silence connue ?",
  ["L. 1233-57-4"],
  f => siPlanDu(f, () => {
    const i = M.instruction(f);
    if (!i.connu) return { etat: MANQ, motif: i.motif };
    if (!i.echeance) return { etat: MANQ, motif: i.motif };
    const dec = (f.pse || {}).dateDecisionAdmin;
    if (vide(dec)) return { etat: RISQ, motif: `${i.motif} Aucune décision n'est enregistrée à ce jour.` };
    return dec <= i.echeance
      ? { etat: CONF, motif: `Décision notifiée le ${dec}, dans le délai de ${i.jours} jours expirant le ${i.echeance}.` }
      : { etat: RISQ, motif: `Décision datée du ${dec}, postérieure à l'échéance du ${i.echeance}. Le silence gardé pendant le délai vaut acceptation : une décision notifiée après ce terme intervient sur une demande déjà acceptée, ce qui n'est pas neutre. Vérifiez la date de réception du dossier complet, qui seule fait courir le délai.` };
  }));

ctl("PSE-CTL-VOI-04", "Voie et instruction",
  "La notification des licenciements intervient-elle après la décision administrative ?",
  ["L. 1233-39"],
  f => siPlanDu(f, () => {
    const d = (f.pse || {}).dateDecisionAdmin;
    if (vide(d)) return { etat: MANQ, motif: "La date de la décision de validation ou d'homologation n'est pas renseignée." };
    if (vide(f.dateNotification)) return { etat: MANQ, motif: "La date de notification des licenciements n'est pas renseignée." };
    return f.dateNotification > d
      ? { etat: CONF, motif: `Décision du ${d}, notification du ${f.dateNotification} : l'ordre est respecté.` }
      : { etat: NC, motif: `Notification prévue le ${f.dateNotification}, décision administrative le ${d} : la notification ne peut intervenir qu'après la décision (L. 1233-39).` };
  }));

/* ---------------------------------------------------------------- le suivi */

ctl("PSE-CTL-SUI-01", "Suivi",
  "Le plan détermine-t-il les modalités de suivi de sa mise en œuvre ?",
  ["L. 1233-63"],
  f => siPlanDu(f, () => {
    const s = (f.plan || {}).suivi || {};
    const absents = SUIVI.exige.filter(x => vide(s[x.cle]));
    if (absents.length === SUIVI.exige.length) return { etat: MANQ, motif: "Les modalités de suivi ne sont pas renseignées." };
    return absents.length
      ? { etat: NC, motif: `Le suivi est incomplet. Manque : ${absents.map(x => x.intitule).join(" ; ")}. L'article L. 1233-63 met ces trois obligations à la charge de l'employeur, et l'administration est associée au suivi.` }
      : { etat: CONF, motif: "Les modalités de suivi sont déterminées, la consultation du comité est prévue et le bilan destiné à l'administration l'est aussi." };
  }));

/* -------------------------------------------------- la priorité de réembauche */

ctl("PSE-CTL-REM-01", "Priorité de réembauche",
  "La priorité de réembauche est-elle mise en œuvre et les élus informés ?",
  ["L. 1233-45"],
  f => {
    const p = M.priorite(f);
    if (!p.connu) return { etat: MANQ, motif: p.motif };
    const d = (f.plan || {}).demandesReembauche;
    const info = (f.plan || {}).informationElusPostes;
    if (vide(info)) return { etat: MANQ, motif: `${p.motif} L'information des représentants du personnel sur les postes disponibles n'est pas renseignée : elle ne dépend, elle, d'aucune demande du salarié.` };
    if (info === false || info === "non")
      return { etat: NC, motif: "Les représentants du personnel ne sont pas informés des postes disponibles. L'article L. 1233-45 met cette information à la charge de l'employeur sans la subordonner à la demande d'un salarié." };
    if (vide(d)) return { etat: RISQ, motif: `${p.motif} Les demandes reçues ne sont pas recensées : la preuve du respect de la priorité repose sur ce recensement et sur la traçabilité des postes devenus disponibles.` };
    return { etat: CONF, motif: `${p.motif} Les demandes reçues sont recensées et les élus sont informés des postes disponibles.` };
  });

/* ------------------------------------------------------------ la cohérence */

const COHERENCE = ["PSE-CTL-COH-01"];
ctl("PSE-CTL-COH-01", "Cohérence",
  "Le nombre de bénéficiaires des mesures dépasse-t-il le nombre de licenciements ?",
  ["L. 1233-62"],
  f => siPlanDu(f, () => {
    const L = lignes(f);
    const n = nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);
    if (L === null || n === null) return { etat: MANQ, motif: "Les mesures ou le nombre de licenciements ne sont pas renseignés." };
    /* Toutes les rubriques ne visent pas les seuls salariés licenciés, et le
       contrôle serait faux s'il l'ignorait. Le reclassement interne (1°), l'aide
       à la création d'activité (4°) et la formation de reconversion (5°) sont
       proposés aux salariés dont le licenciement est envisagé. La reprise
       d'activité (1° bis), la création d'activités nouvelles (2°), la
       réactivation du bassin d'emploi (3°) et la réduction du temps de travail
       ou des heures supplémentaires (6°) peuvent concerner tout l'effectif —
       la dernière n'a même de sens que si elle le dépasse largement. */
    const INDIVIDUELLES = new Set(["1°", "4°", "5°"]);
    const visees = L.filter(x => INDIVIDUELLES.has(String(x.rubrique || "").trim()));
    const max = visees.reduce((m, x) => Math.max(m, nb(x.beneficiaires) || 0), 0);
    if (!max) return { etat: MANQ, motif: "Aucune mesure de reclassement, d'aide à la création ou de formation ne porte de nombre de bénéficiaires." };
    return max > n
      ? { etat: NC, motif: `Une mesure individuelle vise ${max} bénéficiaires alors que ${n} licenciements sont envisagés. Le reclassement interne, l'aide à la création d'activité et la formation de reconversion s'adressent aux salariés dont le licenciement est envisagé : soit le décompte des licenciements est faux, soit le chiffrage l'est — et l'un comme l'autre se voient en séance.` }
      : { etat: CONF, motif: `Le nombre de bénéficiaires le plus élevé parmi les mesures individuelles (${max}) n'excède pas les ${n} licenciements envisagés. Les mesures collectives — reprise d'activité, création d'activités nouvelles, bassin d'emploi, temps de travail — ne sont pas comparées à ce nombre : elles peuvent légitimement viser au-delà.` };
  }));

/* Les contrôles de détection ne concluent jamais à la conformité : ils
   signalent une situation et s'arrêtent, parce que le sujet excède ce qu'une
   base peut trancher. Le calibrage en fait partie par nature. */
const DETECTION = ["PSE-CTL-CAL-01", "PSE-CTL-CAL-02"];

REC.surSilence(C, []);

module.exports = { C, ETATS, DETECTION, COHERENCE };

if (require.main === module) {
  console.log(`${C.length} contrôles`);
  const rub = {};
  for (const c of C) (rub[c.rubrique] = rub[c.rubrique] || []).push(c.id);
  for (const r of Object.keys(rub)) console.log(`  ${r} — ${rub[r].length} : ${rub[r].join(", ")}`);
  const sansTexte = C.filter(c => !c.fondement || !c.fondement.length);
  if (sansTexte.length) { console.error("Contrôles sans fondement : " + sansTexte.map(c => c.id).join(", ")); process.exit(1); }
  console.log(`dont détection ${DETECTION.length}, cohérence ${COHERENCE.length} — tous fondés sur un article`);
}
