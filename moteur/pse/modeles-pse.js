/* Les modèles de régularisation — étape 5 du parcours client.

   Chaque contrôle non conforme ou à vérifier a droit à mieux qu'un rappel de
   texte : une note chiffrée sur le dossier remis — l'effectif déclaré, les
   dates de réunion, le budget saisi mesure par mesure, les seuils de 50/10 et
   de mille salariés. Rien n'est une coquille générique : quand une donnée
   manque pour calculer, la note le dit et pose un exemple marqué
   « [exemple] », jamais une valeur inventée présentée comme celle du client.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de régime (moteur-pse.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit, pour
   que ce modèle s'imprime exactement comme le reste du module.

   Les seuls textes, délais et rubriques cités sont ceux déjà lus et posés par
   moteur-pse.js, mesures.js et controles-pse.js : ce fichier ne capture aucun
   article, il met en chiffres ce qui l'est déjà. Deux contrôles n'ont pas de
   modèle — PSE-CTL-CAL-01 et PSE-CTL-CAL-02, qui calculent un rapport et
   l'affichent sans rien constater — comme regularisation-pse.js les laisse à
   null. */
const O = require("./outils.js");
const M = require("./moteur-pse.js");
const { L1233_62, SUIVI } = require("./mesures.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const euros = n => (n === null || n === undefined ? "—" : n.toLocaleString("fr-FR") + " €");
const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const mesures = f => Array.isArray((f.plan || {}).mesures) ? f.plan.mesures : [];
const n30j = f => nb(f.total30j !== undefined ? f.total30j : f.nbLicenciements);

/* ═══════════════════════════════════════════════════ le contenu du plan ═══ */

function modeleCon01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Les sept rubriques de l'article L. 1233-62, sur ce dossier — " + nomE(f));
  const L = mesures(f);
  h1("Ce que le dossier rattache à chaque rubrique");
  const vues = new Map();
  for (const m of L) { const k = String(m.rubrique || "").trim(); if (!k) continue; if (!vues.has(k)) vues.set(k, []); vues.get(k).push(m); }
  const absentes = [];
  tab(["Rubrique", "Ce que l'article vise", "Mesures saisies"],
    L1233_62.mesures.map(m => {
      const s = vues.get(m.marque) || [];
      if (!s.length) absentes.push(m.marque);
      return [m.marque, m.intitule, s.length ? s.map(x => q(x.intitule) || "sans intitulé").join(" ; ") : "aucune"];
    }));
  if (absentes.length)
    p(`${absentes.length} rubrique(s) sur ${L1233_62.mesures.length} ne sont rattachées à aucune mesure : ${absentes.join(", ")}. La liste de l'article n'est pas limitative — il énonce « des mesures telles que » — mais chacune doit avoir été examinée, et son écartement motivé s'il y a lieu.`);
  else p("Les sept rubriques sont toutes rattachées à au moins une mesure.");
  note(`Version de l'article lue à la source : ${L1233_62.version}.`);
  return A.D;
}

function modeleCon02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le plan de reclassement interne et les salariés les plus exposés — " + nomE(f));
  const L = mesures(f);
  const rec = L.filter(m => String(m.rubrique || "").trim() === "1°");
  const exposes = Array.isArray((f.plan || {}).salariesExposes) ? f.plan.salariesExposes : [];
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Actions de reclassement interne (rubrique 1°)", rec.length ? rec.length + " action(s)" : "aucune"],
    ["Bénéficiaires visés par ces actions", rec.length ? String(rec.reduce((n, m) => n + (nb(m.beneficiaires) || 0), 0)) : "—"],
    ["Salariés à réinsertion particulièrement difficile identifiés", exposes.length ? String(exposes.length) : "non identifiés"],
  ]);
  if (exposes.length) { h1("Les salariés identifiés"); exposes.forEach(x => A.D.push({ k: "puce", t: q(x) || "—" })); }
  if (!rec.length) p("Aucune action de reclassement interne n'est saisie : l'article L. 1233-61 fait de ce plan le cœur du plan de sauvegarde, non une mesure parmi d'autres.");
  else if (!exposes.length) p("Les actions existent, mais aucun salarié à réinsertion particulièrement difficile — âge, caractéristiques sociales, qualification — n'est identifié. L'article les vise nommément.");
  note("Version de l'article L. 1233-61 lue à la source citée dans mesures.js.");
  return A.D;
}

function modeleCon03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Localisation des offres de reclassement — territoire national — " + nomE(f));
  const L = mesures(f);
  h1("Ce que le dossier laisse voir");
  const suspects = L.filter(m => /étranger|hors de France|international|filiale étrangère/i.test(String(m.intitule || "") + " " + String(m.detail || "")));
  tab(["Mesure", "Rubrique", "Bénéficiaires"], L.map(m => [q(m.intitule) || "sans intitulé", q(m.rubrique) || "—", m.beneficiaires != null ? String(m.beneficiaires) : "—"]));
  if (suspects.length)
    p(`${suspects.length} mesure(s) paraissent porter sur des emplois situés hors du territoire national, d'après leur intitulé : ${suspects.map(m => q(m.intitule) || m.rubrique).join(" ; ")}. Seules les offres situées sur le territoire national comptent dans l'obligation de reclassement (L. 1233-61).`);
  else p("Aucune mesure ne laisse deviner, d'après son intitulé, un emploi situé hors du territoire national.");
  note("Ce repérage est indicatif, sur les mots employés dans le dossier : c'est la localisation réelle des postes qui décide, pas la formulation.");
  return A.D;
}

/* ═══════════════════════════════════════════════════════════ le chiffrage ═══ */

function modeleChf01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le chiffrage de chaque mesure, une par une — " + nomE(f));
  const L = mesures(f);
  h1(`Les ${L.length} mesure(s) saisie(s)`);
  const incomplets = [];
  tab(["Mesure", "Bénéficiaires", "Budget", "Durée"], L.map(m => {
    const ok = nb(m.beneficiaires) !== null && nb(m.budget) !== null && q(m.duree);
    if (!ok) incomplets.push(m);
    return [q(m.intitule) || m.rubrique || "sans intitulé",
      m.beneficiaires != null ? String(m.beneficiaires) : "—",
      m.budget != null ? euros(nb(m.budget)) : "—",
      q(m.duree) || "—"];
  }));
  if (incomplets.length)
    p(`${incomplets.length} mesure(s) sur ${L.length} ne portent pas à la fois un budget, un nombre de bénéficiaires et une durée. Une mesure non chiffrée ne pèse rien dans l'appréciation que l'administration porte sur les moyens du groupe (L. 1233-57-3, 2°).`);
  else if (L.length) p("Les mesures saisies portent toutes un budget, un nombre de bénéficiaires et une durée.");
  else p("Aucune mesure n'est saisie.");
  note("Le coût unitaire — budget divisé par bénéficiaires — se lit directement de ce tableau : il est la première question posée en séance.");
  return A.D;
}

function modeleChf02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le rapprochement du budget total et du détail des mesures — " + nomE(f));
  const L = mesures(f);
  const annonce = nb((f.plan || {}).budgetTotal);
  const somme = L.reduce((n, m) => n + (nb(m.budget) || 0), 0);
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Montant"], [
    ["Budget total annoncé du plan", euros(annonce)],
    ["Somme des budgets de mesures", euros(somme)],
    ["Écart", annonce !== null ? euros(Math.abs(somme - annonce)) : "—"],
  ]);
  if (annonce !== null && somme && Math.abs(somme - annonce) / annonce > 0.02)
    p(`L'écart représente ${Math.round((Math.abs(somme - annonce) / annonce) * 1000) / 10} % du total annoncé. C'est la première vérification faite en séance : elle se retourne contre celui qui la présente.`);
  else if (annonce !== null && somme) p("Le total et le détail concordent, à moins de 2 % près.");
  note("Corriger la source de l'écart, pas le total ajusté à la main : un total corrigé sur un détail faux se voit à la ligne suivante.");
  return A.D;
}

/* ════════════════════════════════════════════════════════════ le calibrage ═══ */

function modeleCal03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Les comptes du groupe versés au dossier — " + nomE(f));
  const P = Array.isArray(f.pieces) ? f.pieces : [];
  const versee = P.some(x => /comptes.?groupe|consolid/i.test(String(x.type || x.nom || "")));
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Appartenance à un groupe", dit(f.groupe) ? "oui" : nie(f.groupe) ? "non" : "non renseignée"],
    ["Résultat consolidé du groupe saisi", nb((f.plan || {}).resultatGroupe) !== null ? euros(nb((f.plan || {}).resultatGroupe)) : "non renseigné"],
    ["Comptes consolidés versés au dossier", versee ? "oui" : "non"],
    ["Pièces versées, au total", String(P.length)],
  ]);
  if (dit(f.groupe) && !versee)
    p("L'article L. 1233-57-3 fait des moyens du groupe le premier critère d'appréciation : à défaut de comptes, l'administration apprécie ce qu'elle a, et l'employeur perd la main sur ce qui est retenu contre lui.");
  note("« Produire le document » ne dispense pas de joindre les comptes eux-mêmes : c'est une note d'accompagnement, pas la pièce.");
  return A.D;
}

/* ═════════════════════════════════════════════ l'accompagnement individuel ═══ */

function modeleAcc01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le dispositif d'accompagnement dû, sur les effectifs déclarés — " + nomE(f));
  const a = M.accompagnement(f);
  const choisi = q((f.plan || {}).accompagnement);
  h1("Les effectifs, au regard du seuil de mille salariés (L. 1233-71 / L. 1233-66)");
  tab(["Niveau", "Effectif déclaré"], [
    ["Entreprise", nb(f.effectif) !== null ? nb(f.effectif) + " salarié(s)" : "non renseigné"],
    ["Établissement concerné", nb(f.effectifEtablissement) !== null ? nb(f.effectifEtablissement) + " salarié(s)" : "non renseigné"],
    ["Groupe", dit(f.groupe) ? (nb(f.effectifGroupe) !== null ? nb(f.effectifGroupe) + " salarié(s)" : "non renseigné") : "sans objet — pas de groupe déclaré"],
  ]);
  h1("Le dispositif que ces effectifs commandent");
  p(a.motif);
  tab(["Point", "Valeur"], [
    ["Dispositif calculé sur l'effectif", a.dispositif || "indéterminé"],
    ["Dispositif retenu dans le plan", choisi || "non renseigné"],
  ]);
  if (a.dispositif && choisi && String(choisi).toLowerCase().indexOf(a.dispositif.slice(0, 6).toLowerCase()) < 0 && choisi !== a.dispositif)
    p(`Le plan retient « ${choisi} », alors que l'effectif déclaré commande « ${a.dispositif} ». Les deux dispositifs ne se cumulent pas et ne se choisissent pas.`);
  note("Le seuil se lit au niveau où il est atteint le premier : entreprise, établissement ou groupe.");
  return A.D;
}

function modeleAcc02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("La durée du congé de reclassement, au regard du plafond de L. 1233-71 — " + nomE(f));
  const d = nb((f.plan || {}).dureeConge);
  const reconversion = dit((f.plan || {}).formationReconversion);
  const max = reconversion ? 24 : 12;
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Durée du congé de reclassement retenue", d !== null ? d + " mois" : "non renseignée"],
    ["Formation de reconversion professionnelle", reconversion ? "oui — plafond porté à 24 mois" : "non — plafond de 12 mois"],
    ["Plafond applicable", max + " mois"],
  ]);
  if (d !== null && d > max)
    p(`${d} mois excèdent le plafond de ${max} mois applicable en l'état du dossier. Sans formation de reconversion documentée, le plafond reste douze mois (L. 1233-71).`);
  else if (d !== null) p(`${d} mois, dans la limite de ${max}.`);
  note("Le congé est pris pendant le préavis, dont le terme est reporté jusqu'à la fin du congé lorsqu'il l'excède (L. 1233-72).");
  return A.D;
}

function modeleAcc03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le moment de la proposition du contrat de sécurisation professionnelle — L. 1233-66 — " + nomE(f));
  const dateProp = q((f.plan || {}).dateProposition);
  const dateDec = q((f.pse || {}).dateDecisionAdmin);
  const r = M.planDu(f);
  h1("Ce que le dossier déclare");
  tab(["Étape", "Date"], [
    ["Décision administrative de validation ou d'homologation", dateDec || "non renseignée"],
    ["Proposition du contrat de sécurisation professionnelle", dateProp || "non renseignée"],
  ]);
  if (r.du === true && dateProp && dateDec)
    p(dateProp >= dateDec
      ? `Proposition du ${dateProp}, postérieure à la décision du ${dateDec} : l'ordre est respecté.`
      : `Proposition du ${dateProp}, antérieure à la décision du ${dateDec}. Un plan étant dû, la proposition doit intervenir après la notification de la décision.`);
  note("À défaut de proposition, l'employeur doit à l'assurance chômage deux mois de salaire brut par salarié, portés à trois si le salarié adhère sur proposition de France Travail (L. 1233-66).");
  return A.D;
}

/* ═════════════════════════════════════════════════════ la voie et l'instruction ═══ */

function modeleVoi01(f) {
  const A = O(); const { t1, h1, tab, note } = A;
  t1("La voie retenue et le calendrier qu'elle ouvre — " + nomE(f));
  const v = q((f.pse || {}).voie);
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Voie retenue", v === "accord" ? "accord collectif majoritaire" : v === "unilateral" ? "document unilatéral" : "non arrêtée"],
    ["Délai d'instruction correspondant", v === "accord" ? "quinze jours (validation)" : v === "unilateral" ? "vingt et un jours (homologation)" : "indéterminé tant que la voie n'est pas arrêtée"],
  ]);
  note("La voie se choisit avant la première réunion du comité : elle commande le calendrier entier, et le moment où le document unilatéral, s'il est retenu, est élaboré (après la dernière réunion, L. 1233-24-4).");
  return A.D;
}

function modeleVoi02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("La condition de représentativité de l'accord majoritaire — L. 1233-24-1 — " + nomE(f));
  const s = nb((f.pse || {}).suffrages);
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Voie retenue", q((f.pse || {}).voie) || "non renseignée"],
    ["Suffrages recueillis par les organisations signataires", s !== null ? s + " %" : "non renseigné"],
    ["Seuil requis", "50 %"],
  ]);
  if (s !== null)
    p(s >= 50
      ? `${s} % : la condition est remplie, l'accord existe comme accord majoritaire.`
      : `${s} % : en deçà de 50 %, l'accord n'existe pas comme accord majoritaire au sens de L. 1233-24-1, et la voie bascule sur le document unilatéral, dont le délai d'instruction est de vingt et un jours et non de quinze.`);
  note("Le nombre de votants au premier tour est indifférent : c'est le pourcentage des suffrages exprimés en faveur d'organisations représentatives qui compte.");
  return A.D;
}

function modeleVoi03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le délai d'instruction, calculé sur la date de dépôt — L. 1233-57-4 — " + nomE(f));
  const i = M.instruction(f);
  h1("Le calcul, sur ce dossier");
  if (!i.connu) { p(i.motif); return A.D; }
  tab(["Étape", "Date"], [
    ["Voie retenue", i.quoi],
    ["Délai d'instruction", i.jours + " jours"],
    ["Dossier déposé le", i.depot || "non renseigné"],
    ["Échéance calculée", i.echeance || "—"],
    ["Décision notifiée le", q((f.pse || {}).dateDecisionAdmin) || "non renseignée à ce jour"],
  ]);
  p(i.motif);
  note("Passé ce terme, le silence vaut acceptation, et l'employeur transmet alors au comité une copie de la demande accompagnée de son accusé de réception.");
  return A.D;
}

function modeleVoi04(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("L'ordre entre la décision administrative et la notification — L. 1233-39 — " + nomE(f));
  const d = q((f.pse || {}).dateDecisionAdmin);
  const not = q(f.dateNotification);
  h1("Ce que le dossier déclare");
  tab(["Étape", "Date"], [
    ["Décision de validation ou d'homologation", d || "non renseignée"],
    ["Notification des licenciements", not || "non renseignée"],
  ]);
  if (d && not)
    p(not > d
      ? `Décision du ${d}, notification du ${not} : l'ordre est respecté.`
      : `Notification du ${not}, décision du ${d} : la notification ne peut intervenir qu'après la décision, à peine de nullité de la rupture (L. 1233-39).`);
  note("La nullité frappe la rupture elle-même : elle ne se couvre pas par un courrier rectificatif.");
  return A.D;
}

/* ══════════════════════════════════════════════════════════════════ le suivi ═══ */

function modeleSui01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Les trois obligations de suivi de l'article L. 1233-63 — " + nomE(f));
  const s = (f.plan || {}).suivi || {};
  h1("Ce que le dossier déclare");
  tab(["Obligation (L. 1233-63)", "État déclaré"],
    SUIVI.exige.map(x => [x.intitule, q(s[x.cle]) || "non renseignée"]));
  const absents = SUIVI.exige.filter(x => !q(s[x.cle]));
  if (absents.length) p(`${absents.length} obligation(s) sur ${SUIVI.exige.length} ne sont pas renseignées dans le plan.`);
  else p("Les trois obligations sont renseignées.");
  note("L'autorité administrative est associée au suivi et reçoit le bilan que l'employeur établit : un plan muet sur ce point est incomplet au regard du texte.");
  return A.D;
}

/* ═══════════════════════════════════════════════ la priorité de réembauche ═══ */

function modeleRem01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("La priorité de réembauche, sur la date de rupture déclarée — L. 1233-45 — " + nomE(f));
  const pr = M.priorite(f);
  const demandes = Array.isArray((f.plan || {}).demandesReembauche) ? f.plan.demandesReembauche : [];
  const info = (f.plan || {}).informationElusPostes;
  h1("Le calcul, sur ce dossier");
  if (!pr.connu) { p(pr.motif); }
  else tab(["Point", "Valeur"], [
    ["Date de rupture retenue", pr.depuis],
    ["Priorité due jusqu'au", pr.jusqu],
    ["Demandes de priorité recensées", String(demandes.length)],
    ["Représentants du personnel informés des postes disponibles", dit(info) ? "oui" : nie(info) ? "non" : "non renseigné"],
  ]);
  if (nie(info)) p("L'information des représentants du personnel sur les postes disponibles ne dépend d'aucune demande d'un salarié : elle est due par elle-même.");
  note("La priorité court un an à compter de la rupture ; le salarié qui a acquis une nouvelle qualification en bénéficie aussi à ce titre s'il en informe l'employeur.");
  return A.D;
}

/* ═══════════════════════════════════════════════════ la consultation du comité ═══ */

function modeleCse01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("L'espacement des réunions du comité — au moins quinze jours — L. 1233-30, I — " + nomE(f));
  const r = Array.isArray(f.datesReunionsCSE) ? f.datesReunionsCSE.filter(Boolean).slice().sort() : [];
  h1(`Les ${r.length} date(s) de réunion déclarée(s)`);
  if (r.length < 2) { p(r.length ? "Une seule réunion est renseignée : le comité en tient au moins deux (L. 1233-30, I)." : "Aucune date de réunion n'est renseignée."); return A.D; }
  const ecarts = r.slice(1).map((d, i) => ({ de: r[i], a: d, jours: M.joursEntre(r[i], d) }));
  tab(["De", "À", "Écart (jours)"], ecarts.map(e => [e.de, e.a, String(e.jours)]));
  const courts = ecarts.filter(e => e.jours < M.ESPACEMENT_MINIMAL);
  if (courts.length) p(`${courts.length} écart(s) sur ${ecarts.length} sont inférieurs au minimum de ${M.ESPACEMENT_MINIMAL} jours.`);
  else p(`Tous les écarts atteignent le minimum de ${M.ESPACEMENT_MINIMAL} jours.`);
  note("Une réunion trop rapprochée ne se déplace pas : c'est une nouvelle réunion, tenue au bon espacement, qui reprend la consultation.");
  return A.D;
}

function modeleCse02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le délai des deux avis du comité — L. 1233-30, II — " + nomE(f));
  const c = M.consultation(f);
  h1("Le calcul, sur ce dossier");
  if (!c.connu) { p(c.motif); return A.D; }
  const avis = q((f.pse || {}).dateAvisCSE) || q(f.dateAvisCSE);
  tab(["Point", "Valeur"], [
    ["Nombre de licenciements envisagés", n30j(f) !== null ? String(n30j(f)) : "non renseigné"],
    ["Tranche applicable", c.tranche],
    ["Délai maximal d'avis", c.mois + " mois"],
    ["Première réunion", c.premiere || "non renseignée"],
    ["Échéance calculée", c.echeance || "—"],
    ["Avis rendu le", avis || "non renseigné à ce jour"],
  ]);
  if (avis && c.echeance) p(avis <= c.echeance ? `Avis du ${avis}, dans le délai qui expirait le ${c.echeance}.` : `Avis du ${avis}, postérieur au terme du ${c.echeance} : passé ce terme, le comité était déjà réputé consulté.`);
  note("Une convention ou un accord collectif peut prévoir des délais différents ; sans qu'il soit versé au dossier, seul le plafond légal est opposable.");
  return A.D;
}

function modeleCse03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le calendrier de l'expertise décidée par le comité — L. 1233-34 et L. 1233-35 — " + nomE(f));
  const c = M.consultation(f);
  const d = q((f.pse || {}).dateDesignationExpert);
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Expertise décidée par le comité", dit(f.expertisePSE) ? "oui" : nie(f.expertisePSE) ? "non" : "non renseignée"],
    ["Date de désignation de l'expert", d || "non renseignée"],
    ["Date de la première réunion", c.premiere || "non renseignée"],
  ]);
  if (d && c.premiere)
    p(d > c.premiere ? `Désignation du ${d}, postérieure à la première réunion du ${c.premiere}. L'article L. 1233-34 place cette décision à la première réunion : une désignation postérieure expose la procédure, sans prolonger le délai d'avis.` : `Désignation du ${d}, à la première réunion du ${c.premiere} ou avant : le calendrier de l'article est respecté.`);
  note("Le rapport de l'expert est dû au plus tard quinze jours avant l'expiration du délai d'avis, lequel n'est pas prolongé par l'expertise.");
  return A.D;
}

/* ══════════════════════════════════════════════════════════════ la cohérence ═══ */

function modeleCoh01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Le décompte des licenciements et les bénéficiaires des mesures individuelles — " + nomE(f));
  const L = mesures(f);
  const n = n30j(f);
  const INDIVIDUELLES = new Set(["1°", "4°", "5°"]);
  const visees = L.filter(x => INDIVIDUELLES.has(String(x.rubrique || "").trim()));
  h1("Le calcul, sur ce dossier");
  tab(["Point", "Valeur"], [
    ["Licenciements envisagés (30 jours)", n !== null ? String(n) : "non renseigné"],
    ["Mesures individuelles (rubriques 1°, 4°, 5°)", String(visees.length)],
  ]);
  if (visees.length) tab(["Mesure", "Rubrique", "Bénéficiaires"], visees.map(m => [q(m.intitule) || "sans intitulé", m.rubrique, m.beneficiaires != null ? String(m.beneficiaires) : "—"]));
  const max = visees.reduce((m, x) => Math.max(m, nb(x.beneficiaires) || 0), 0);
  if (n !== null && max)
    p(max > n
      ? `Une mesure individuelle vise ${max} bénéficiaires alors que ${n} licenciements sont envisagés : soit le décompte des licenciements est faux, soit le chiffrage l'est.`
      : `Le nombre de bénéficiaires le plus élevé (${max}) n'excède pas les ${n} licenciements envisagés.`);
  note("Les mesures collectives — reprise d'activité, création d'activités nouvelles, bassin d'emploi, temps de travail — ne sont pas comparées à ce nombre : elles peuvent légitimement viser au-delà.");
  return A.D;
}

const MODELES = {
  "PSE-CTL-CON-01": modeleCon01,
  "PSE-CTL-CON-02": modeleCon02,
  "PSE-CTL-CON-03": modeleCon03,
  "PSE-CTL-CHF-01": modeleChf01,
  "PSE-CTL-CHF-02": modeleChf02,
  "PSE-CTL-CAL-03": modeleCal03,
  "PSE-CTL-ACC-01": modeleAcc01,
  "PSE-CTL-ACC-02": modeleAcc02,
  "PSE-CTL-ACC-03": modeleAcc03,
  "PSE-CTL-VOI-01": modeleVoi01,
  "PSE-CTL-VOI-02": modeleVoi02,
  "PSE-CTL-VOI-03": modeleVoi03,
  "PSE-CTL-VOI-04": modeleVoi04,
  "PSE-CTL-SUI-01": modeleSui01,
  "PSE-CTL-REM-01": modeleRem01,
  "PSE-CTL-CSE-01": modeleCse01,
  "PSE-CTL-CSE-02": modeleCse02,
  "PSE-CTL-CSE-03": modeleCse03,
  "PSE-CTL-COH-01": modeleCoh01,
};

module.exports = { MODELES };

if (require.main === module) {
  const { R } = require("./regularisation-pse.js");
  const attendus = Object.keys(R).filter(id => R[id] !== null);
  const manquants = attendus.filter(id => typeof MODELES[id] !== "function");
  const surplus = Object.keys(MODELES).filter(id => !attendus.includes(id));
  console.log(`${Object.keys(MODELES).length} modèle(s) sur ${attendus.length} contrôle(s) régularisables`);
  if (manquants.length || surplus.length) {
    if (manquants.length) console.error("ÉCART — modèle manquant pour : " + manquants.join(", "));
    if (surplus.length) console.error("ÉCART — modèle sans contrôle régularisable : " + surplus.join(", "));
    process.exit(1);
  }
  const { BASE } = require("./tests-pse.js");
  for (const id of Object.keys(MODELES)) MODELES[id](BASE);
  console.log("chaque modèle s'exécute sur le dossier de référence sans exception");
}
