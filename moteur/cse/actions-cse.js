/* Ce qu'il faut faire, contrôle par contrôle, et avant quel acte.
   Aucune règle de droit nouvelle : seulement l'impératif correspondant. */
const NOW = "Immédiatement";
const AV_ELE = "Avant d'engager les élections";
const AV_LIS = "Avant le dépôt des listes";
const AV_CON = "Avant de convoquer le comité";
const AV_AVI = "Avant de recueillir l'avis";
const AV_DEC = "Avant de décider";
const ORDRE = [NOW, AV_ELE, AV_LIS, AV_CON, AV_AVI, AV_DEC];

const A = {
"CSE-CTL-REC-01": { faire: "Corriger les données impossibles listées au constat : une date qui n'existe pas ou un dénombrement décimal ne peuvent pas être audités.", quand: NOW },
"CSE-CTL-COH-01": { faire: "Rétablir l'effectif de l'entreprise au sens de l'article L. 1111-2, en le calculant sur les relevés mensuels versés, et relancer l'audit.", quand: NOW },
"CSE-CTL-COH-02": { faire: "Appliquer le régime du seuil que les relevés mensuels franchissent — réunions, commission santé et sécurité, budgets, attributions — ou établir pourquoi l'effectif au sens de L. 1111-2 reste en deçà.", quand: NOW },
"CSE-CTL-MEP-01": { faire: "Produire les états mensuels d'effectif des douze derniers mois, calculés selon l'article L. 1111-2.", quand: AV_ELE },
"CSE-CTL-MEP-02": { faire: "Mettre en place le comité, ou verser le procès-verbal de carence établi à l'issue des élections.", quand: AV_ELE },
"CSE-CTL-MEP-03": { faire: "Engager le renouvellement du comité : informer le personnel et fixer la date du premier tour.", quand: NOW },
"CSE-CTL-MEP-04": { faire: "Ramener la durée conventionnelle des mandats dans la fourchette de deux à quatre ans.", quand: AV_ELE },
"CSE-CTL-PER-01": { faire: "Verser l'accord de découpage ou, à défaut, la décision unilatérale datée et sa notification.", quand: AV_ELE },
"CSE-CTL-PER-02": { faire: "Verser les délégations de pouvoir écrites des responsables d'établissement, qui établissent leur autonomie de gestion.", quand: AV_ELE },
"CSE-CTL-PER-03": { faire: "Verser l'accord d'entreprise majoritaire instituant les représentants de proximité, ou cesser de les faire fonctionner.", quand: NOW },
"CSE-CTL-ELE-01": { faire: "Inviter toutes les organisations visées par l'article L. 2314-5 et conserver la preuve d'envoi de chaque invitation.", quand: AV_ELE },
"CSE-CTL-ELE-02": { faire: "Fixer le premier tour au plus tard le quatre-vingt-dixième jour suivant l'information du personnel.", quand: AV_ELE },
"CSE-CTL-ELE-03": { faire: "Recueillir les signatures nécessaires à la double majorité, ou constater l'absence d'accord et fixer les modalités du scrutin.", quand: AV_ELE },
"CSE-CTL-ELE-04": { faire: "Faire figurer au protocole la proportion de femmes et d'hommes de chaque collège et la porter à la connaissance des salariés.", quand: AV_LIS },
"CSE-CTL-ELE-05": { faire: "Faire recomposer les listes irrégulières avant leur dépôt : proportion, puis alternance.", quand: AV_LIS },
"CSE-CTL-ELE-06": { faire: "Verser l'accord ou la décision unilatérale ouvrant le vote électronique, et le cahier des charges du prestataire.", quand: AV_ELE },
"CSE-CTL-ELE-07": { faire: "Organiser les élections partielles pour pourvoir les sièges vacants dans les collèges intéressés.", quand: NOW },
"CSE-CTL-CON-01": { faire: "Conduire les consultations récurrentes manquantes, ou verser l'accord qui en modifie la périodicité.", quand: AV_DEC },
"CSE-CTL-CON-02": { faire: "Dater la remise des informations au comité et faire courir le délai depuis cette date, non depuis la convocation.", quand: AV_AVI },
"CSE-CTL-CON-03": { faire: "Remettre au comité une note d'information écrite et précise, et répondre par écrit à ses observations.", quand: AV_CON },
"CSE-CTL-CON-04": { faire: "Consulter l'instance compétente : comité central pour ce qui excède les pouvoirs des chefs d'établissement, comités d'établissement pour les mesures d'adaptation.", quand: AV_CON },
"CSE-CTL-CON-05": { faire: "Tenir le nombre de réunions dû, et convoquer les séances manquantes.", quand: AV_DEC },
"CSE-CTL-CON-06": { faire: "Consacrer au moins quatre réunions annuelles, en tout ou partie, à la santé, la sécurité et les conditions de travail.", quand: AV_DEC },
"CSE-CTL-MOY-01": { faire: "Porter le volume global d'heures de délégation au minimum du tableau de l'article R. 2314-1.", quand: NOW },
"CSE-CTL-MOY-02": { faire: "Établir la cause de l'écart entre le nombre de titulaires élus et celui du tableau : protocole modifiant les sièges, ou sièges non pourvus.", quand: AV_DEC },
"CSE-CTL-MOY-03": { faire: "Rétablir le paiement des heures de délégation à l'échéance normale, et saisir le juge si l'usage est contesté.", quand: NOW },
"CSE-CTL-MOY-04": { faire: "Organiser la formation en santé, sécurité et conditions de travail, cinq jours au minimum, et verser les attestations.", quand: AV_DEC },
"CSE-CTL-SST-01": { faire: "Mettre en place la commission santé, sécurité et conditions de travail.", quand: AV_CON },
"CSE-CTL-SST-02": { faire: "Compléter la commission : trois membres au minimum, dont au moins un du second ou du troisième collège. Là où un troisième collège est institué, le siège lui revient (Soc., 26 février 2025, n° 24-12.295).", quand: AV_CON },
"CSE-CTL-SST-03": { faire: "Faire désigner les membres de la commission par une résolution du comité adoptée à la majorité des membres présents, et en conserver le procès-verbal. Aucune résolution préalable fixant les modalités de l'élection n'est requise (Soc., 27 novembre 2019, n° 19-14.224).", quand: AV_CON },
"CSE-CTL-SST-04": { faire: "Rétablir les membres de la commission initialement désignés : hors les fins anticipées de mandat de L. 2314-33, aucun remplacement n'est possible avant le terme du mandat des élus, et aucun accord n'y déroge (Soc., 28 mai 2026, n° 24-22.914).", quand: NOW },
"CSE-CTL-SST-05": { faire: "Ramener la délégation dans les limites de L. 2315-38 : les attributions consultatives et le recours à l'expert restent au comité, quelles que soient les stipulations de l'accord.", quand: AV_CON },
"CSE-CTL-SST-06": { faire: "Fixer les modalités de la commission — les six points de L. 2315-41 — par accord, ou à défaut par le règlement intérieur du comité.", quand: AV_CON },
"CSE-CTL-SST-07": { faire: "Compléter la formation santé, sécurité et conditions de travail des membres de la commission jusqu'à la durée minimale applicable, aux frais de l'employeur.", quand: AV_DEC },
"CSE-CTL-COM-01": { faire: "Constituer, à défaut d'accord L. 2315-45, les commissions de la formation, d'information et d'aide au logement et de l'égalité professionnelle, par délibération du comité.", quand: AV_DEC },
"CSE-CTL-COM-02": { faire: "Créer la commission économique au sein du comité ou du comité central, avec cinq membres au plus dont un représentant des cadres, à défaut d'accord L. 2315-45.", quand: AV_DEC },
"CSE-CTL-COM-03": { faire: "Créer la commission des marchés au sein du comité, dont les comptes dépassent au moins deux des trois seuils de D. 2315-29.", quand: AV_DEC },
"CSE-CTL-EXP-04": { faire: "Faire délibérer le comité lui-même sur le recours à l'expertise : la commission peut la proposer, elle ne peut pas la décider.", quand: AV_DEC },
"CSE-CTL-BUD-01": { faire: "Régulariser la subvention de fonctionnement au taux légal, sur l'assiette de l'article L. 2312-83.", quand: NOW },
"CSE-CTL-BUD-02": { faire: "Ramener la contribution aux activités sociales au moins au rapport de l'année précédente, ou verser l'accord qui la fixe.", quand: NOW },
"CSE-CTL-BUD-03": { faire: "Supprimer la condition d'ancienneté qui restreint l'accès aux activités sociales et culturelles.", quand: NOW },
"CSE-CTL-EXP-01": { faire: "Rétablir la répartition légale du coût de l'expertise selon le cas de recours.", quand: AV_DEC },
"CSE-CTL-EXP-02": { faire: "Saisir le juge dans les dix jours du point de départ propre à l'objet de la contestation, par assignation.", quand: NOW },
"CSE-CTL-EXP-03": { faire: "Vérifier le fondement de l'expertise : aucune n'est prévue en deçà de dix licenciements sur trente jours.", quand: AV_DEC },
"CSE-CTL-DET-01": { faire: "Faire lire les accords collectifs applicables au comité par un professionnel, pour vérifier qu'aucune clause ne le prive d'une prérogative légale.", quand: AV_DEC },
"CSE-CTL-DET-02": { faire: "Signaler le contentieux en cours à la direction et au conseil juridique de l'entreprise.", quand: NOW },
"CSE-CTL-DET-03": { faire: "Faire examiner par un professionnel les faits signalés, l'entrave étant une infraction pénale.", quand: NOW },
};
const de = id => A[id] || { faire: "Reprendre ce point avec votre conseil.", quand: AV_DEC };
const rangQuand = q => { const i = ORDRE.indexOf(q); return i < 0 ? ORDRE.length : i; };

/* Deux registres : l'écart constaté affirme, la donnée manquante suspend. */
const INTERDITS = {
"CSE-CTL-REC-01": "Ne lisez pas le reste du rapport comme un résultat : une partie des contrôles a conclu sur des données impossibles.",
"CSE-CTL-COH-01": "Ne vous fondez sur aucune conformité tirée de l'effectif : le dossier le dément lui-même.",
"CSE-CTL-COH-02": "N'appliquez pas le régime déduit de l'effectif déclaré : vos propres relevés en franchissent un autre.",
"CSE-CTL-MEP-02": "N'engagez aucune consultation : il n'y a ni comité, ni procès-verbal de carence.",
"CSE-CTL-CON-04": "Ne poursuivez pas : l'instance consultée n'est pas celle que la loi désigne.",
"CSE-CTL-SST-01": "Ne tenez pas les réunions santé et sécurité sans avoir mis en place la commission obligatoire.",
"CSE-CTL-ELE-03": "Ne tenez pas le scrutin sur ce protocole : il ne remplit pas la condition de double majorité.",
"CSE-CTL-ELE-05": "Ne déposez pas ces listes : leur composition entraînerait l'annulation d'élections, sans remplacement possible.",
"CSE-CTL-PER-03": "Ne faites plus fonctionner les représentants de proximité : aucun accord ne les institue.",
"CSE-CTL-SST-05": "Ne recueillez pas l'avis du comité auprès de la seule commission, et ne lui laissez pas décider de l'expertise : L. 2315-38 est d'ordre public.",
"CSE-CTL-EXP-04": "Ne poursuivez pas l'expertise sur cette délibération : la décision de recourir à l'expert appartient au comité.",
};
const SUSPENS = {
"CSE-CTL-REC-01": "Ne concluez rien tant que la lisibilité des données n'a pas été vérifiée.",
"CSE-CTL-COH-01": "Ne vous fondez sur aucune conformité tirée de l'effectif tant qu'il n'a pas été rapproché des relevés mensuels.",
"CSE-CTL-COH-02": "N'appliquez pas le régime déduit de l'effectif déclaré tant que les relevés mensuels n'ont pas été produits.",
"CSE-CTL-MEP-02": "N'engagez aucune consultation tant que l'existence d'un comité ou d'un procès-verbal de carence n'a pas été vérifiée.",
"CSE-CTL-CON-04": "Ne poursuivez pas tant que l'instance compétente n'a pas été vérifiée.",
"CSE-CTL-SST-01": "Ne tenez pas les réunions santé et sécurité tant que l'existence de la commission n'a pas été vérifiée.",
"CSE-CTL-ELE-03": "Ne tenez pas le scrutin tant que la validité du protocole n'a pas été vérifiée.",
"CSE-CTL-ELE-05": "Ne déposez pas les listes tant que leur composition n'a pas été vérifiée.",
"CSE-CTL-PER-03": "Ne faites pas fonctionner de représentants de proximité tant que l'accord qui les institue n'a pas été vérifié.",
"CSE-CTL-SST-05": "Ne recueillez pas l'avis du comité tant que l'étendue de la délégation consentie à la commission n'a pas été vérifiée.",
"CSE-CTL-EXP-04": "Ne poursuivez pas l'expertise tant que l'auteur de la délibération n'a pas été vérifié.",
};
const interdit = (id, etat) => etat === "non conforme"
  ? (INTERDITS[id] || "Ne poursuivez pas avant correction de ce point.")
  : (SUSPENS[id] || "Ne franchissez pas l'étape correspondante tant que ce point n'a pas été vérifié.");

/* La gravité : « bloquant » ne veut pas dire « grave », mais qu'un texte
   s'oppose à la poursuite tant que le point n'est pas réglé. */
const B = "bloquant", CR = "critique", IM = "important", IN = "information";
const GRAVITE = {
 "CSE-CTL-MEP-02": B, "CSE-CTL-ELE-03": B, "CSE-CTL-ELE-05": B, "CSE-CTL-CON-04": B,
 "CSE-CTL-SST-01": B, "CSE-CTL-PER-03": B,
 /* Recevabilité et cohérence : bloquants, non parce qu'un texte interdit de
    poursuivre, mais parce qu'un résultat calculé sur une donnée impossible ou
    démentie par le dossier n'est pas un résultat. Rien ne doit s'y appuyer. */
 "CSE-CTL-REC-01": B, "CSE-CTL-COH-01": B, "CSE-CTL-COH-02": B,
 "CSE-CTL-MEP-03": CR, "CSE-CTL-ELE-02": CR, "CSE-CTL-ELE-04": CR, "CSE-CTL-CON-01": CR,
 "CSE-CTL-CON-02": CR, "CSE-CTL-MOY-01": CR, "CSE-CTL-MOY-03": CR, "CSE-CTL-BUD-01": CR,
 "CSE-CTL-EXP-02": CR, "CSE-CTL-SST-02": CR, "CSE-CTL-ELE-07": CR,
 /* Les commissions. Deux d'entre elles sont bloquantes parce qu'un texte
    d'ordre public s'oppose à la poursuite : une délégation qui empiète sur
    l'avis ou sur l'expert vicie la consultation elle-même (L. 2315-38), et une
    expertise décidée par la commission est nulle. */
 "CSE-CTL-SST-05": B, "CSE-CTL-EXP-04": B,
 "CSE-CTL-SST-03": CR, "CSE-CTL-SST-04": CR,
 "CSE-CTL-SST-06": IM, "CSE-CTL-SST-07": IM,
 "CSE-CTL-COM-01": IM, "CSE-CTL-COM-02": IM, "CSE-CTL-COM-03": IM,
 "CSE-CTL-MEP-01": IM, "CSE-CTL-MEP-04": IM, "CSE-CTL-PER-01": IM, "CSE-CTL-PER-02": IM,
 "CSE-CTL-ELE-01": IM, "CSE-CTL-ELE-06": IM, "CSE-CTL-CON-03": IM, "CSE-CTL-CON-05": IM,
 "CSE-CTL-CON-06": IM, "CSE-CTL-MOY-02": IM, "CSE-CTL-MOY-04": IM, "CSE-CTL-BUD-02": IM,
 "CSE-CTL-BUD-03": IM, "CSE-CTL-EXP-01": IM, "CSE-CTL-EXP-03": IM,
 "CSE-CTL-DET-01": IN, "CSE-CTL-DET-02": IN, "CSE-CTL-DET-03": IN,
};
const DEF = [[B, "La procédure ne doit pas être poursuivie avant correction : un texte s'y oppose."],
 [CR, "Risque élevé de contestation ou d'irrégularité, sans interdiction expresse de poursuivre."],
 [IM, "Une pièce ou une vérification manque avant de décider."],
 [IN, "Point à documenter ou à faire examiner, hors du champ automatisable."]];
const gr = id => GRAVITE[id] || IM;
const RANG = { [B]: 0, [CR]: 1, [IM]: 2, [IN]: 3 };

const STATUTS = ["BLOQUÉ", "REVUE PROFESSIONNELLE OBLIGATOIRE", "À COMPLÉTER", "RISQUE ÉLEVÉ", "CONFORME AU VU DES PIÈCES"];
function statutNormalise(verdicts, f) {
  const nc = verdicts.filter(v => v.v.etat === "non conforme");
  const bloq = nc.filter(v => gr(v.id) === B);
  const risq = verdicts.filter(v => v.v.etat === "risque à vérifier");
  const manq = verdicts.filter(v => v.v.etat === "donnée manquante");
  const conf = verdicts.filter(v => v.v.etat === "conforme");
  const pro = [];
  if (f.etablissementsMultiples) pro.push("plusieurs établissements distincts");
  if (f.ues) pro.push("une unité économique et sociale");
  if (!vide(f.accordsCse)) pro.push("des accords collectifs à articuler avec la loi");
  if (!vide(f.contentieuxCse)) pro.push("un contentieux en cours");
  if (!vide(f.faitsEntrave)) pro.push("des faits susceptibles de caractériser une entrave");
  if (bloq.length) return { statut: "BLOQUÉ", pro,
    motif: `${bloq.length} non-conformité(s) bloquante(s) : ${bloq.map(v => v.id).join(", ")}.`,
    action: "Corriger ces points avant tout acte suivant. Les contrôles conformes ne les neutralisent pas." };
  if (nc.length) return { statut: "RISQUE ÉLEVÉ", pro,
    motif: `${nc.length} non-conformité(s) sans caractère bloquant : ${nc.map(v => v.id).join(", ")}.`,
    action: "Aucune n'interdit formellement de poursuivre ; chacune expose la procédure à contestation." };
  if (!conf.length || manq.length >= risq.length + conf.length) return { statut: "À COMPLÉTER", pro,
    motif: `${manq.length} donnée(s) manquante(s) et ${risq.length} risque(s) à vérifier. Le dossier n'est pas assez renseigné pour qu'un écart puisse être caractérisé.`,
    action: "Produire les pièces demandées, puis relancer l'audit. L'absence de non-conformité ne vaut pas conformité." };
  if (risq.length) return { statut: "À COMPLÉTER", pro,
    motif: `${risq.length} risque(s) à vérifier, aucune non-conformité.`,
    action: "Verser les pièces manquantes pour lever les réserves." };
  return { statut: "CONFORME AU VU DES PIÈCES", pro,
    motif: `Aucun écart sur les ${verdicts.length} contrôles exécutés, au vu des pièces lues.`,
    action: "Cela ne vaut pas validation juridique du fonctionnement du comité." };
}
const vide = x => x === undefined || x === null || x === "" || (Array.isArray(x) && !x.length);

module.exports = { A, de, ORDRE, rangQuand, INTERDITS, SUSPENS, interdit,
  GRAVITE, DEF, gr, RANG, B, CR, IM, IN, STATUTS, statutNormalise };
