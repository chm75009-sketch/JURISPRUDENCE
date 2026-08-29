/* Les modèles de régularisation — étape 5 du parcours client.

   Même principe que moteur/bdese/modeles-bdese.js, transposé au comité : pour
   chaque contrôle qui n'est pas conforme, une note chiffrée sur le dossier
   réel — effectif, dates, montants, compositions déclarées — jamais un exemple
   figé. Quand une donnée manque pour calculer, la note le dit et affiche un
   exemple marqué « [exemple] ».

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   (moteur-cse.js) et rend un classeur de pièces (moteur/commun/outils.js) : la
   même fabrique que le rapport d'audit, pour que le modèle s'imprime et
   s'exporte comme le reste du module.

   Aucun chiffre n'est inventé ici : les seuils, taux et délais cités sont ceux
   déjà portés par moteur-cse.js et controles-cse.js, jamais réécrits. Le seul
   contrôle sans entrée est CSE-CTL-DET-02 : sa régularisation est `null` dans
   regularisation-cse.js (rien à corriger, un contentieux se rapporte, il ne se
   régularise pas), et parcours-deux-temps.js l'exclut déjà du guide. */
const O = require("./outils.js");
const M = require("./moteur-cse.js");

const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const dit = x => x === true;
const ex = v => v + " [exemple]";
const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const eff = f => nb(f.effectif);
const effTxte = f => eff(f) === null ? ex("120") : String(eff(f));
const jour0 = f => /^\d{4}-\d{2}-\d{2}$/.test(String(f.dateAudit || "")) ? f.dateAudit : new Date().toISOString().slice(0, 10);
const euros = n => n === null || n === undefined ? "—" : n.toLocaleString("fr-FR") + " €";

/* Une addition de jours calendaires simple : elle ne sert qu'à illustrer un
   délai, jamais à trancher une échéance légale à la place du client. */
function ajouterJours(dateISO, n) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateISO || ""))) return null;
  const d = new Date(dateISO + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/* ──────────────────────── CSE-CTL-REC-01 : recevabilité des données ─────── */
function modeleRec01(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  const V = require("./valider-cse.js");
  t1("Relevé des anomalies de saisie — " + nomE(f));
  const anomalies = V.valider(f);
  h1(`${anomalies.length} anomalie(s) détectée(s) sur ${V.examines(f)} donnée(s) examinée(s)`);
  if (anomalies.length) anomalies.forEach(x => puce(`${x.champ} = « ${x.valeur} » — ${x.motif} (attendu : ${x.attendu || "—"}).`));
  else p("Aucune anomalie n'est détectée sur les données actuellement examinables.");
  note("Cette liste se recalcule à chaque modification du questionnaire de l'étape 2 : corrigez un champ, elle se met à jour.");
  return A.D;
}

/* ──────────────────── CSE-CTL-COH-01 et COH-02 : cohérence d'effectif ────── */
function modeleCoherence(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de cohérence de l'effectif — " + nomE(f));
  const co = M.coherenceEffectif({ effectif: f.effectif, effectifsMensuels: f.effectifsMensuels });
  h1("Ce que déclare le dossier, confronté aux relevés mensuels");
  if (!co) { p("Effectif ou relevés mensuels non renseignés à ce jour : rien à confronter."); return A.D; }
  if (!co.lisible) { p(co.motif); return A.D; }
  tab(["Donnée", "Valeur"], [
    ["Effectif déclaré", String(co.effectifDeclare)],
    ["Relevés mensuels exploités", String(co.releves)],
    ["Minimum / maximum des relevés", `${co.min} / ${co.max}`],
    ["Moyenne des relevés", String(co.moyenne)],
    ["Effectif déclaré dans l'intervalle des relevés ?", co.dans ? "oui" : `non — écart de ${co.ecart}`],
  ]);
  if (co.seuilsFranchis.length) {
    h1("Seuils franchis par les relevés, non par l'effectif déclaré");
    co.seuilsFranchis.forEach(s => p(`Seuil de ${s.seuil} salariés — ${s.regle} Ce que le franchissement ouvre : ${s.effet}.`));
  } else p("Aucun seuil n'est franchi par les relevés sans l'être par l'effectif déclaré.");
  note("Rétablissez l'effectif sur les états mensuels avant de relancer l'audit : tout le régime du comité s'y recalcule.");
  return A.D;
}

/* ──────────────────────────── CSE-CTL-MEP-01 : seuil de onze salariés ───── */
function modeleMep01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de franchissement du seuil de onze salariés — " + nomE(f));
  h1("Ce que disent les relevés mensuels");
  const mois = Array.isArray(f.effectifsMensuels) ? f.effectifsMensuels : null;
  if (!mois) { p(`Aucun relevé mensuel n'est renseigné. À titre d'illustration, une série de douze mois à ${ex("11")} salariés ou plus établirait le franchissement.`); return A.D; }
  const s = M.seuilAtteint(mois, 11);
  p(`${mois.length} relevé(s) fourni(s) : ${s.consecutifs} mois consécutifs à onze salariés ou plus, sur les douze exigés par ${s.texte}.`);
  note(s.atteint ? "Le seuil est atteint : c'est de cette date que court l'obligation d'informer le personnel de l'organisation des élections." : "Le seuil n'est pas encore atteint sur douze mois consécutifs : aucune obligation n'est encore née.");
  return A.D;
}

/* ────────────────────── CSE-CTL-MEP-02 : mise en place ou carence ───────── */
function modeleMep02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calendrier de mise en place du comité — " + nomE(f));
  h1("Ce que déclare le dossier");
  p(`Comité existant : ${f.comiteExistant === true ? "oui" : (f.comiteExistant === false ? "non" : "non renseigné")}.`);
  const info = q(f.dateInformationPersonnel);
  if (info) {
    const limite = ajouterJours(info, 90);
    p(`Information du personnel diffusée le ${info} : le premier tour doit se tenir au plus tard le ${limite || "—"} (quatre-vingt-dix jours, L. 2314-4).`);
  } else {
    const ex0 = ex(jour0(f));
    p(`Date de diffusion non renseignée. À titre d'illustration, une diffusion le ${ex0} donnerait une limite de premier tour au ${ajouterJours(ex0.replace(" [exemple]", ""), 90)} [exemple].`);
  }
  note("À défaut de comité et à l'issue du scrutin, le procès-verbal de carence doit être transmis à l'inspection du travail dans les quinze jours de son établissement.");
  return A.D;
}

/* ─────────────────── CSE-CTL-MEP-03 et MEP-04 : mandat et son terme ─────── */
function modeleMandat(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de durée et de terme du mandat — " + nomE(f));
  const m = M.mandat(f);
  h1("La durée retenue");
  p(m.motif);
  const derniere = q(f.dateDernieresElections);
  if (derniere) {
    const terme = new Date(derniere + "T00:00:00Z");
    terme.setUTCFullYear(terme.getUTCFullYear() + Math.round(m.annees));
    p(`Dernières élections le ${derniere} : sur cette durée, le terme du mandat en cours se situe au ${terme.toISOString().slice(0, 10)}.`);
  } else p(`Date des dernières élections non renseignée : le terme ne peut pas être calculé. À titre d'illustration, des élections au ${ex(jour0(f))} donneraient un terme quatre ans plus tard.`);
  if (typeof f.dureeAccord === "number" && !m.licite) note(`La durée conventionnelle de ${f.dureeAccord} an(s) sort de la fourchette de deux à quatre ans de L. 2314-34 : elle ne tient pas, et c'est la durée légale de quatre ans qui s'applique.`);
  return A.D;
}

/* ─────────────── CSE-CTL-PER-01, PER-02, PER-03 : périmètre et sources ──── */
function modelePerimetre(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Note sur le périmètre et sa source — " + nomE(f));
  h1("Ce que déclare le dossier");
  puce(`Établissements distincts : ${f.etablissementsMultiples === true ? "oui" : (f.etablissementsMultiples === false ? "non" : "non renseigné")}.`);
  if (f.etablissementsMultiples === true) puce(`Source du découpage déclarée : ${q(f.sourceDecoupage) || "non renseignée"}.`);
  puce(`Représentants de proximité : ${f.representantsProximite === true ? "déclarés" : "non déclarés"}.`);
  note("L'accord d'entreprise doit être recherché avant toute décision unilatérale : c'est l'ordre des sources que L. 2313-4 impose, et il commande la procédure ci-dessous.");
  return A.D;
}

/* ────────────────────────── CSE-CTL-ELE-01 : invitation des syndicats ───── */
function modeleEle01(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Bordereau d'invitation des organisations syndicales — " + nomE(f));
  const liste = Array.isArray(f.syndicatsInvites) ? f.syndicatsInvites : [];
  h1(`${liste.length} organisation(s) invitée(s), selon le dossier`);
  if (liste.length) liste.forEach(s => puce(String(s)));
  else p("Aucune organisation n'est encore listée comme invitée.");
  note("L'invitation doit parvenir au plus tard quinze jours avant la première réunion de négociation (L. 2314-5) : conservez la date d'envoi de chaque invitation, organisation par organisation.");
  return A.D;
}

/* ───────────────── CSE-CTL-ELE-02 : délai de quatre-vingt-dix jours ─────── */
function modeleEle02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calcul du délai de quatre-vingt-dix jours — " + nomE(f));
  const info = q(f.dateInformationPersonnel), tour = q(f.datePremierTour);
  h1("Le calcul, sur les dates du dossier");
  if (info) {
    const limite = ajouterJours(info, 90);
    p(`Information diffusée le ${info} : limite légale du premier tour au ${limite} (L. 2314-4).`);
    if (tour) p(`Premier tour déclaré au ${tour} — ${tour <= limite ? "dans le délai." : "au-delà de la limite calculée : le processus doit être repris par une nouvelle information."}`);
  } else p(`Date de diffusion non renseignée. Exemple : une diffusion au ${ex(jour0(f))} placerait la limite quatre-vingt-dix jours plus tard.`);
  return A.D;
}

/* ───────────────────── CSE-CTL-ELE-03 : double majorité ─────────────────── */
function modeleEle03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Vérification de la double majorité du protocole — " + nomE(f));
  const pr = f.protocole || {};
  h1("Le calcul sur les chiffres déclarés");
  if (typeof pr.nbSignataires === "number" && typeof pr.nbParticipants === "number" && typeof pr.suffragesSignataires === "number") {
    const majOrg = pr.nbSignataires > pr.nbParticipants / 2;
    const majSuf = pr.suffragesSignataires > 50;
    tab(["Condition", "Chiffre", "Réunie ?"], [
      ["Majorité des organisations ayant négocié", `${pr.nbSignataires} signataire(s) sur ${pr.nbParticipants} participant(s)`, majOrg ? "oui" : "non"],
      ["Majorité des suffrages des organisations représentatives signataires", `${pr.suffragesSignataires} %`, majSuf ? "oui" : "non"],
    ]);
    note(majOrg && majSuf ? "La double majorité de L. 2314-6 est réunie." : "La double majorité n'est pas réunie : le protocole ne purge rien, il faut rouvrir la négociation ou appliquer les règles légales.");
  } else p(`Chiffres incomplets. Exemple : ${ex("3")} signataires sur ${ex("4")} participants, représentant ${ex("62")} % des suffrages, réuniraient la double majorité.`);
  return A.D;
}

/* ─────────────────────── CSE-CTL-ELE-04 : proportion F/H au protocole ───── */
function modeleEle04(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur la mention de la proportion femmes-hommes — " + nomE(f));
  const v = f.protocole && f.protocole.proportionFH;
  h1("Ce que déclare le dossier");
  p(`Mention de la proportion par collège au protocole : ${v === true ? "présente" : (v === false ? "absente" : "non renseignée")}.`);
  note("Sans cette mention, les listes ne peuvent pas être composées selon L. 2314-30 : elle doit être établie collège par collège, sur la liste électorale, avant l'ouverture du dépôt des listes.");
  return A.D;
}

/* ─────────── CSE-CTL-ELE-05 : composition paritaire des listes déposées ─── */
function modeleEle05(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille de composition paritaire des listes — " + nomE(f));
  const listes = Array.isArray(f.listesDeposees) ? f.listesDeposees : [];
  h1(`${listes.length} liste(s) déposée(s), selon le dossier`);
  if (!listes.length) { p(`Aucune liste n'est encore décrite. Exemple : un collège de ${ex("60")} femmes et ${ex("40")} hommes inscrits, pour trois sièges, imposerait deux femmes et un homme.`); return A.D; }
  tab(["Liste", "Résultat du calcul"], listes.map(l => {
    const r = M.listeParitaire({ femmes: l.femmesInscrites, hommes: l.hommesInscrits,
      candidats: (l.candidats || []).length, sieges: l.siegesAPourvoir });
    return [l.nom || "—", r ? r.motif : "données insuffisantes pour calculer la composition due"];
  }));
  note("La règle s'applique séparément à la liste des titulaires et à celle des suppléants (L. 2314-30, dernier alinéa).");
  return A.D;
}

/* ─────────────────── CSE-CTL-ELE-06 : support du vote électronique ──────── */
function modeleEle06(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur le support du vote électronique — " + nomE(f));
  h1("Ce que déclare le dossier");
  p(`Vote électronique utilisé : ${f.voteElectronique === true ? "oui" : "non"}.`);
  note("Le recours doit reposer sur un accord d'entreprise ou de groupe, et sur une décision de l'employeur seulement à défaut d'accord (R. 2314-5) : recherchez l'accord d'abord, établissez le cahier des charges ensuite, et tenez-le à la disposition des salariés.");
  return A.D;
}

/* ────────────────────── CSE-CTL-ELE-07 : élections partielles ───────────── */
function modeleEle07(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur l'obligation d'élections partielles — " + nomE(f));
  const e = M.electionsPartielles(f);
  h1("Le calcul sur les chiffres déclarés");
  if (e) p(e.motif);
  else p(`Nombre de titulaires initiaux ou restants non renseigné. Exemple : ${ex("12")} titulaires à l'origine et ${ex("5")} restants déclencheraient l'obligation, la moitié étant franchie.`);
  return A.D;
}

/* ──────────────────── CSE-CTL-CON-01 : trois consultations récurrentes ──── */
function modeleCon01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Suivi des trois consultations récurrentes — " + nomE(f));
  const dues = ["orientations stratégiques", "situation économique et financière", "politique sociale"];
  const conduites = Array.isArray(f.consultationsRecurrentes) ? f.consultationsRecurrentes.map(x => (x.objet || "")) : [];
  h1("Ce que le dossier établit, exercice par exercice");
  tab(["Consultation due", "Conduite selon le dossier ?"], dues.map(d =>
    [d, conduites.some(c => c.toLowerCase().includes(d.split(" ")[0])) ? "oui" : "non établi"]));
  note("À défaut d'accord de L. 2312-19, les trois consultations sont annuelles (L. 2312-22) : datez chacune, avec son ordre du jour et son avis.");
  return A.D;
}

/* ───────────────────── CSE-CTL-CON-02 : délai de consultation ───────────── */
function modeleCon02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calcul du délai de consultation — " + nomE(f));
  const c = f.consultation || {};
  const d = M.delaiConsultation(c);
  h1("Le délai applicable, et son terme sur les dates du dossier");
  p(`${d.motif} (${d.jours} jours, ${d.texte}).`);
  const remise = q(c.dateRemiseInformations);
  if (remise) {
    const limite = ajouterJours(remise, d.jours);
    p(`Informations remises le ${remise} : le comité est réputé avoir rendu un avis négatif à défaut d'avis rendu au plus tard le ${limite || "—"}.`);
  } else p(`Date de remise non renseignée. Exemple : une remise au ${ex(jour0(f))} placerait le terme ${d.jours} jours plus tard.`);
  return A.D;
}

/* ───────────────── CSE-CTL-CON-03 : informations précises et écrites ────── */
function modeleCon03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note d'information au comité — modèle de bordereau — " + nomE(f));
  h1("Objet");
  p(`${nomE(f)} remet au comité social et économique la présente note, précise et écrite, sur le sujet soumis à consultation, en application de l'article L. 2312-15. Elle est mise à disposition dans la base de données économiques, sociales et environnementales à la date du [date de mise à disposition].`);
  note("Datez la remise : c'est elle, et non la réunion, qui fait courir le délai de consultation (R. 2312-5).");
  return A.D;
}

/* ─────────────────────── CSE-CTL-CON-04 : instance consultée ────────────── */
function modeleCon04(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur le niveau de consultation — " + nomE(f));
  h1("Ce que déclare le dossier");
  p(`Instance consultée : ${q(f.instanceConsultee) || "non renseignée"}. Mesures d'adaptation spécifiques à un ou plusieurs établissements : ${f.mesuresAdaptation === true ? "oui" : (f.mesuresAdaptation === false ? "non" : "non renseigné")}.`);
  note("Si le projet comporte de telles mesures, les comités d'établissement doivent être consultés en plus du comité central (L. 2316-1, L. 2316-20).");
  return A.D;
}

/* ────────────────────────── CSE-CTL-CON-05 : nombre de réunions ─────────── */
function modeleCon05(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Décompte des réunions annuelles — " + nomE(f));
  const u = M.reunions(f);
  h1("Le nombre dû, sur l'effectif et l'accord déclarés");
  if (u) p(`${u.motif} Réunions tenues, selon le dossier : ${typeof f.reunionsTenues === "number" ? f.reunionsTenues : "non renseigné"}.`);
  else p(`Effectif non renseigné : le plancher légal ne peut pas être fixé. À titre d'illustration, un effectif de ${ex("420")} salariés imposerait douze réunions par an.`);
  return A.D;
}

/* ──────────────────── CSE-CTL-CON-06 : réunions santé-sécurité ──────────── */
function modeleCon06(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Décompte des réunions portant sur la santé et la sécurité — " + nomE(f));
  h1("Le calcul sur le dossier");
  const n = nb(f.reunionsSante);
  p(n === null ? `Nombre non renseigné. Le plancher légal est de quatre réunions par an (L. 2315-27).`
    : `${n} réunion(s) déclarée(s) sur les quatre exigées par L. 2315-27${n < 4 ? ` — il en manque ${4 - n}` : ""}.`);
  return A.D;
}

/* ───────────────────────── CSE-CTL-MOY-01 : crédit d'heures ─────────────── */
function modeleMoy01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calcul du crédit d'heures minimal — " + nomE(f));
  const d = M.delegation(eff(f));
  h1(`Le minimum légal, pour ${effTxte(f)} salarié(s)`);
  if (d && d.du) {
    p(`${d.titulaires} titulaire(s) × ${d.heures} heures = ${d.total} heures mensuelles au total (tranche ${d.tranche}, ${d.texte}).`);
    p(`Volume accordé, selon le dossier : ${typeof f.heuresAccordees === "number" ? f.heuresAccordees + " heures" : "non renseigné"}${typeof f.heuresAccordees === "number" && f.heuresAccordees < d.total ? ` — il manque ${d.total - f.heuresAccordees} heure(s)` : ""}.`);
  } else p(d ? d.motif : "Effectif non renseigné : le minimum ne peut pas être calculé.");
  return A.D;
}

/* ─────────────────── CSE-CTL-MOY-02 : nombre de titulaires ──────────────── */
function modeleMoy02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Comparaison au tableau réglementaire — " + nomE(f));
  const d = M.delegation(eff(f));
  h1(`Le nombre dû, pour ${effTxte(f)} salarié(s)`);
  if (d && d.du) p(`${d.titulaires} titulaire(s) prévu(s) par R. 2314-1 (tranche ${d.tranche}). Titulaires élus selon le dossier : ${typeof f.titulairesElus === "number" ? f.titulairesElus : "non renseigné"}.`);
  else p(d ? d.motif : "Effectif non renseigné : le tableau ne peut pas être appliqué.");
  note("Un écart peut résulter d'un protocole modifiant le nombre de sièges, ou de sièges non pourvus faute de candidats : la cause doit être établie et versée au dossier.");
  return A.D;
}

/* ───────────────── CSE-CTL-MOY-03 : paiement des heures de délégation ───── */
function modeleMoy03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur le paiement des heures de délégation — " + nomE(f));
  h1("Ce que déclare le dossier");
  p(`Retenue opérée sur les heures de délégation : ${f.heuresRetenues === true ? "oui" : (f.heuresRetenues === false ? "non" : "non renseigné")}.`);
  note("Le temps de délégation est de plein droit payé à l'échéance normale (L. 2315-10) : l'employeur qui conteste l'usage qui en a été fait doit payer d'abord, et saisir le juge ensuite.");
  return A.D;
}

/* ────────────────────── CSE-CTL-MOY-04 : formations obligatoires ────────── */
function modeleMoy04(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Suivi des formations obligatoires des élus — " + nomE(f));
  const l = Array.isArray(f.formationsDispensees) ? f.formationsDispensees : [];
  h1(`${l.length} formation(s) déclarée(s)`);
  if (l.length) l.forEach(x => puce(String(x)));
  else p("Aucune formation n'est encore déclarée.");
  note("La formation en santé, sécurité et conditions de travail est due à tous les membres de la délégation, pour cinq jours au minimum lors du premier mandat (L. 2315-18).");
  return A.D;
}

/* ───────────────────────── CSE-CTL-SST-01 : commission obligatoire ──────── */
function modeleSst01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur l'obligation de la commission santé, sécurité et conditions de travail — " + nomE(f));
  const s = M.cssct({ effectif: eff(f), seveso: f.seveso });
  h1(`Situation pour ${effTxte(f)} salarié(s)`);
  if (s) { p(s.motif + " " + (s.reserve || "")); p(`Commission déclarée en place : ${f.cssct === true ? "oui" : (f.cssct === false ? "non" : "non renseigné")}.`); }
  else p("Effectif non renseigné : l'obligation ne peut pas être établie.");
  return A.D;
}

/* ───────────────────────── CSE-CTL-SST-02 : composition de la commission ── */
function modeleSst02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille de composition de la commission — " + nomE(f));
  const membres = Array.isArray(f.membresCssct) ? f.membresCssct : [];
  const col = M.colleges({ effectif: eff(f), nbCadres: nb(f.nbCadres) });
  h1(`${membres.length} membre(s) déclaré(s)`);
  if (col) p(col.motif);
  const troisieme = !!(col && col.nombre === 3);
  const attendu = troisieme ? 3 : 2;
  tab(["Membre", "Collège"], membres.map((m, i) => [`Membre ${i + 1}`, m.college !== undefined ? String(m.college) : "—"]));
  note(`Au moins un membre du ${troisieme ? "troisième" : "second"} collège (n° ${attendu}) est requis, sur un minimum de trois membres (L. 2315-39).`);
  return A.D;
}

/* ─────────────────────── CSE-CTL-SST-03 : désignation par résolution ────── */
function modeleSst03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Vérification des conditions de désignation — " + nomE(f));
  const d = f.designationCssct || {};
  h1("Ce que déclare le dossier");
  p(`Désignation par résolution du comité : ${d.resolution === true ? "oui" : (d.resolution === false ? "non" : "non renseigné")}.`);
  p(`Résolution adoptée à la majorité des membres présents : ${d.majoriteMembresPresents === true ? "oui" : (d.majoriteMembresPresents === false ? "non" : "non renseigné")}.`);
  note("Les deux conditions sont cumulatives et d'ordre public (L. 2315-39, L. 2315-32) : sans l'une ou l'autre, la désignation est irrégulière.");
  return A.D;
}

/* ────────────────────── CSE-CTL-SST-04 : remplacement d'un membre ───────── */
function modeleSst04(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur le remplacement d'un membre de la commission — " + nomE(f));
  const r = f.remplacementCssct || {};
  h1("Ce que déclare le dossier");
  p(`Remplacement intervenu : ${r.effectue === true ? "oui" : (r.effectue === false ? "non" : "non renseigné")}.`);
  if (r.effectue === true) {
    p(`Cause déclarée : ${q(r.cause) || "non renseignée"}.`);
    note(M.finAnticipeeMandat(r.cause) ? "Cette cause figure parmi les fins anticipées de mandat de L. 2314-33 : le remplacement est régulier." : `Seules ces causes autorisent le remplacement : ${M.FINS_ANTICIPEES.join(", ")}.`);
  }
  return A.D;
}

/* ───────────────── CSE-CTL-SST-05 : étendue de la délégation ────────────── */
function modeleSst05(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur l'étendue de la délégation consentie à la commission — " + nomE(f));
  const d = f.delegationCssct || {};
  h1("Ce que déclare le dossier");
  p(`Attributions consultatives déléguées à la commission : ${d.avisDelegue === true ? "oui — irrégulier" : (d.avisDelegue === false ? "non" : "non renseigné")}.`);
  p(`Décision de recourir à l'expert déléguée à la commission : ${d.expertDelegue === true ? "oui — irrégulier" : (d.expertDelegue === false ? "non" : "non renseigné")}.`);
  note("L. 2315-38 exclut ces deux attributions de ce qui peut être délégué à la commission, texte d'ordre public.");
  return A.D;
}

/* ──────────────────── CSE-CTL-SST-06 : source des modalités ─────────────── */
function modeleSst06(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur la source des modalités de la commission — " + nomE(f));
  h1("Ce que déclare le dossier");
  const s = q(f.sourceModalitesCssct);
  const src = s ? M.SOURCES_MODALITES_CSSCT[s] : null;
  p(s ? (src ? `Source déclarée : ${src.libelle} (${src.texte}).` : `Source déclarée non reconnue : « ${s} ».`) : "Aucune source n'est encore déclarée.");
  note("À défaut d'accord d'entreprise ou d'accord avec le comité, c'est le règlement intérieur du comité qui doit fixer les six points de L. 2315-41.");
  return A.D;
}

/* ──────────────────── CSE-CTL-SST-07 : durée de formation ───────────────── */
function modeleSst07(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calcul de la durée de formation santé, sécurité et conditions de travail — " + nomE(f));
  const d = M.dureeFormationSSCT({ mandatRenouvele: f.mandatRenouvele === true, effectif: eff(f) });
  h1("Le minimum applicable, sur le dossier");
  p(`${d.motif} (${d.jours} jours, ${d.texte}).`);
  p(`Jours dispensés selon le dossier : ${typeof f.joursFormationSSCT === "number" ? f.joursFormationSSCT : "non renseigné"}${typeof f.joursFormationSSCT === "number" && f.joursFormationSSCT < d.jours ? ` — il en manque ${d.jours - f.joursFormationSSCT}` : ""}.`);
  return A.D;
}

/* ────────────────── CSE-CTL-COM-01 : commissions supplétives à 300 ──────── */
function modeleCom01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des trois commissions supplétives — " + nomE(f));
  const s = M.commissionsSuppletives({ effectif: eff(f) });
  h1(`Situation pour ${effTxte(f)} salarié(s)`);
  p(s.motif);
  if (s.du) {
    const constituees = Array.isArray(f.commissionsConstituees) ? f.commissionsConstituees : [];
    tab(["Commission", "Constituée ?"], M.COMMISSIONS_300.map(c =>
      [`${c.libelle} (${c.texte})`, constituees.includes(c.cle) ? "oui" : "non"]));
    p(`Accord de l'article L. 2315-45 organisant les commissions : ${f.accordCommissions === true ? "déclaré" : "non déclaré"}.`);
  }
  return A.D;
}

/* ───────────────────── CSE-CTL-COM-02 : commission économique ───────────── */
function modeleCom02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur la commission économique — " + nomE(f));
  const e = M.commissionEconomique({ effectif: eff(f) });
  h1(`Situation pour ${effTxte(f)} salarié(s)`);
  p(e.motif);
  if (e.du) {
    const membres = Array.isArray(f.membresCommissionEconomique) ? f.membresCommissionEconomique : [];
    const cadres = membres.filter(m => m && m.cadre === true).length;
    p(`Membres déclarés : ${membres.length} (maximum cinq, L. 2315-47), dont ${cadres} représentant(s) de la catégorie des cadres (au moins un requis).`);
  }
  return A.D;
}

/* ─────────────────────── CSE-CTL-COM-03 : commission des marchés ────────── */
function modeleCom03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur la commission des marchés — " + nomE(f));
  h1("Ce que déclare le dossier");
  p(`Les comptes du comité dépassent-ils au moins deux des trois seuils de D. 2315-29 : ${f.seuilsComptesComite === true ? "oui" : (f.seuilsComptesComite === false ? "non" : "non renseigné")}.`);
  if (f.seuilsComptesComite === true) p(`Commission des marchés créée : ${f.commissionMarches === true ? "oui" : "non"}.`);
  note("Le critère tient aux comptes du comité lui-même — nombre de salariés du comité, ressources annuelles, total du bilan — non à l'effectif de l'entreprise : recontrôlez ce point à chaque clôture des comptes du comité.");
  return A.D;
}

/* ─────────────────────── CSE-CTL-BUD-01 : subvention de fonctionnement ──── */
function modeleBud01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calcul de la subvention de fonctionnement — " + nomE(f));
  const ms = nb(f.masseSalariale);
  const b = M.budgetFonctionnement(eff(f), ms);
  h1(`Le minimum légal, pour ${effTxte(f)} salarié(s)`);
  if (b && b.du) {
    p(`Taux applicable : ${b.tauxTexte} (${b.texte}). Masse salariale brute déclarée : ${ms === null ? "non renseignée" : euros(ms)}.`);
    if (b.montant !== null) p(`Minimum légal : ${euros(b.montant)}. Subvention versée selon le dossier : ${typeof f.subventionVersee === "number" ? euros(f.subventionVersee) : "non renseignée"}${typeof f.subventionVersee === "number" && f.subventionVersee < b.montant ? ` — il manque ${euros(b.montant - f.subventionVersee)}` : ""}.`);
    else p(`Masse salariale non renseignée : le montant minimal ne peut pas être chiffré. Exemple, sur une masse de ${ex("16 800 000")} euros : ${euros(Math.round(16800000 * b.taux))}.`);
  } else p(b ? b.motif : "Effectif non renseigné : le taux ne peut pas être déterminé.");
  return A.D;
}

/* ─────────────────── CSE-CTL-BUD-02 : contribution aux activités sociales ─ */
function modeleBud02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Comparaison du rapport de contribution aux activités sociales — " + nomE(f));
  h1("Le calcul sur les deux derniers exercices déclarés");
  const asN = nb(f.ascAnneeN), asN1 = nb(f.ascAnneeN1), msN = nb(f.masseSalariale), msN1 = nb(f.masseSalarialeN1);
  if (asN !== null && asN1 !== null && msN !== null && msN1 !== null && msN > 0 && msN1 > 0) {
    const rN = asN / msN, rN1 = asN1 / msN1;
    p(`Exercice en cours : ${euros(asN)} sur une masse salariale de ${euros(msN)}, soit ${(rN * 100).toFixed(3)} %.`);
    p(`Exercice précédent : ${euros(asN1)} sur une masse salariale de ${euros(msN1)}, soit ${(rN1 * 100).toFixed(3)} %.`);
    note(rN < rN1 ? "Le rapport baisse : à défaut d'accord, il ne peut être inférieur à celui de l'année précédente (L. 2312-81)." : "Le rapport est maintenu ou en hausse : le plancher légal est respecté.");
  } else p(`Données incomplètes pour comparer les deux exercices. Exemple : ${ex("130 000")} euros sur ${ex("16 800 000")} euros de masse salariale donnerait un rapport de ${(130000 / 16800000 * 100).toFixed(3)} %.`);
  return A.D;
}

/* ─────────────── CSE-CTL-BUD-03 : ancienneté et accès aux ASC ───────────── */
function modeleBud03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur la condition d'ancienneté aux activités sociales — " + nomE(f));
  h1("Ce que déclare le dossier");
  p(`Condition d'ancienneté conditionnant l'accès : ${f.ancienneteASC === true ? "oui — non conforme" : (f.ancienneteASC === false ? "non" : "non renseigné")}.`);
  note("L'ouverture du droit ne peut pas être subordonnée à une ancienneté : tous les salariés et les stagiaires y ont vocation (L. 2312-78, R. 2312-35).");
  return A.D;
}

/* ─────────────────────── CSE-CTL-EXP-01 : financement de l'expertise ────── */
function modeleExp01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de financement de l'expertise — " + nomE(f));
  const ex0 = f.expertise || {};
  const e = ex0.cas ? M.financementExpertise(ex0.cas) : null;
  h1("Ce que déclare le dossier");
  if (e) {
    p(`Cas de recours : ${ex0.cas}. Financement légal : ${e.finance} (${e.employeur ?? 0} % à la charge de l'employeur).`);
    p(`Part employeur déclarée : ${typeof ex0.partEmployeur === "number" ? ex0.partEmployeur + " %" : "non renseignée"}.`);
  } else p(`Cas de recours non renseigné ou non reconnu. Exemple : « risque grave » impose ${ex("100")} % à la charge de l'employeur.`);
  return A.D;
}

/* ───────────────────── CSE-CTL-EXP-02 : délai de contestation ───────────── */
function modeleExp02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calcul du délai de contestation de l'expertise — " + nomE(f));
  const ex0 = f.expertise || {};
  h1("Le calcul, sur les dates du dossier");
  const depart = q(ex0.dateDepart);
  if (depart) {
    const limite = ajouterJours(depart, 10);
    p(`Point de départ le ${depart} : la saisine du juge doit intervenir au plus tard le ${limite} (dix jours, L. 2315-86).`);
    if (q(ex0.dateSaisine)) p(`Saisine déclarée le ${ex0.dateSaisine} — ${ex0.dateSaisine <= limite ? "dans le délai." : "hors délai."}`);
  } else p(`Point de départ non renseigné. Exemple : un point de départ au ${ex(jour0(f))} donnerait une limite dix jours plus tard.`);
  return A.D;
}

/* ────────────────── CSE-CTL-EXP-03 : cas de recours à l'expertise ───────── */
function modeleExp03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur le cas de recours à l'expertise — " + nomE(f));
  const ex0 = f.expertise || {};
  const n = nb(f.nbLicenciements);
  h1("Ce que déclare le dossier");
  p(`Cas invoqué : ${q(ex0.cas) || "non renseigné"}. Licenciements envisagés sur trente jours : ${n === null ? "non renseigné" : n}.`);
  if (n !== null) note(n < 10 ? "En deçà de dix licenciements sur trente jours, aucune expertise n'est prévue sur le fondement de L. 1233-34." : "Le seuil de dix licenciements est atteint : vérifiez que le fondement invoqué correspond bien au projet en cause.");
  return A.D;
}

/* ─────────────────── CSE-CTL-EXP-04 : auteur de la décision ─────────────── */
function modeleExp04(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur l'auteur de la décision de recourir à l'expertise — " + nomE(f));
  const ex0 = f.expertise || {};
  h1("Ce que déclare le dossier");
  p(`Décision attribuée à : ${q(ex0.decideePar) || "non renseigné"}.`);
  note("Seul le comité social et économique peut décider de recourir à un expert — le cas échéant sur proposition d'une commission — jamais la commission santé, sécurité et conditions de travail ni l'employeur (L. 1233-34, L. 2315-38).");
  return A.D;
}

/* ──────────────── CSE-CTL-DET-01 et DET-03 : détection, sans conclusion ─── */
function modeleDetection(champ, titre, phrase) {
  return f => {
    const A = O(); const { t1, h1, p, puce, note } = A;
    t1(titre + " — " + nomE(f));
    const l = Array.isArray(f[champ]) ? f[champ] : (q(f[champ]) ? [f[champ]] : []);
    h1(`${l.length || (q(f[champ]) ? 1 : 0)} élément(s) signalé(s)`);
    if (l.length) l.forEach(x => puce(String(x)));
    else if (q(f[champ])) p(String(f[champ]));
    else p("Aucun élément n'est encore décrit.");
    note(phrase);
    return A.D;
  };
}

const MODELES = {
  "CSE-CTL-REC-01": modeleRec01,
  "CSE-CTL-COH-01": modeleCoherence,
  "CSE-CTL-COH-02": modeleCoherence,
  "CSE-CTL-MEP-01": modeleMep01,
  "CSE-CTL-MEP-02": modeleMep02,
  "CSE-CTL-MEP-03": modeleMandat,
  "CSE-CTL-MEP-04": modeleMandat,
  "CSE-CTL-PER-01": modelePerimetre,
  "CSE-CTL-PER-02": modelePerimetre,
  "CSE-CTL-PER-03": modelePerimetre,
  "CSE-CTL-ELE-01": modeleEle01,
  "CSE-CTL-ELE-02": modeleEle02,
  "CSE-CTL-ELE-03": modeleEle03,
  "CSE-CTL-ELE-04": modeleEle04,
  "CSE-CTL-ELE-05": modeleEle05,
  "CSE-CTL-ELE-06": modeleEle06,
  "CSE-CTL-ELE-07": modeleEle07,
  "CSE-CTL-CON-01": modeleCon01,
  "CSE-CTL-CON-02": modeleCon02,
  "CSE-CTL-CON-03": modeleCon03,
  "CSE-CTL-CON-04": modeleCon04,
  "CSE-CTL-CON-05": modeleCon05,
  "CSE-CTL-CON-06": modeleCon06,
  "CSE-CTL-MOY-01": modeleMoy01,
  "CSE-CTL-MOY-02": modeleMoy02,
  "CSE-CTL-MOY-03": modeleMoy03,
  "CSE-CTL-MOY-04": modeleMoy04,
  "CSE-CTL-SST-01": modeleSst01,
  "CSE-CTL-SST-02": modeleSst02,
  "CSE-CTL-SST-03": modeleSst03,
  "CSE-CTL-SST-04": modeleSst04,
  "CSE-CTL-SST-05": modeleSst05,
  "CSE-CTL-SST-06": modeleSst06,
  "CSE-CTL-SST-07": modeleSst07,
  "CSE-CTL-COM-01": modeleCom01,
  "CSE-CTL-COM-02": modeleCom02,
  "CSE-CTL-COM-03": modeleCom03,
  "CSE-CTL-BUD-01": modeleBud01,
  "CSE-CTL-BUD-02": modeleBud02,
  "CSE-CTL-BUD-03": modeleBud03,
  "CSE-CTL-EXP-01": modeleExp01,
  "CSE-CTL-EXP-02": modeleExp02,
  "CSE-CTL-EXP-03": modeleExp03,
  "CSE-CTL-EXP-04": modeleExp04,
  "CSE-CTL-DET-01": modeleDetection("accordsCse", "Relevé des accords collectifs applicables au comité",
    "La base ne lit pas les stipulations de ces accords : ce relevé appelle l'examen d'un professionnel avant toute décision qui s'appuierait dessus."),
  "CSE-CTL-DET-03": modeleDetection("faitsEntrave", "Relevé des faits signalés au titre de l'entrave",
    "L'entrave est une infraction pénale que la base ne qualifie pas : ce relevé appelle l'examen d'un professionnel avant toute décision."),
};

module.exports = { MODELES };
