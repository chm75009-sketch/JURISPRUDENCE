/* Les modèles de régularisation — étape 5 du parcours client.

   Chaque contrôle non conforme ou à vérifier a droit à mieux qu'un rappel de
   texte : une note chiffrée sur le dossier remis — les dates de la procédure,
   les délais qui en découlent, l'effectif déclaré, le contenu du règlement
   intérieur tel qu'il est décrit. Rien n'est une coquille générique : quand une
   donnée manque pour calculer, la note le dit et pose un exemple marqué
   « [exemple] », jamais une valeur inventée présentée comme celle du client.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de régime (moteur-discipline.js), et rend un classeur de pièces
   (moteur/commun/outils.js) — la même fabrique que le rapport d'audit, pour
   que ce modèle s'imprime exactement comme le reste du module.

   Les seuls textes et délais cités sont ceux déjà lus et posés par
   moteur-discipline.js, controles-discipline.js et regularisation-discipline.js :
   ce fichier ne capture aucun article, il met en chiffres ce qui l'est déjà. */
const O = require("./outils.js");
const D = require("./dates.js");
const M = require("./moteur-discipline.js");

const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const ex = v => v + " [exemple]";
const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const jour0 = f => (D.estDateISO(f.dateAudit) ? f.dateAudit : new Date().toISOString().slice(0, 10));
const natureDeclaree = f => q((f.sanction || {}).nature);

/* ═══════════════════════════════════ le règlement intérieur — obligation ═══ */

function modeleRi01(f) {
  const A = O(); const { t1, h1, h2, p, puce, note, tab } = A;
  t1("Note d'obligation — règlement intérieur — " + nomE(f));
  const d = M.riDu(f);
  h1("Le calcul, sur ce dossier");
  p(d.motif);
  if (d.connu && d.du) {
    const ri = f.ri || {};
    const seuilDeclare = q(ri.dateFranchissementSeuil);
    const seuil = seuilDeclare || jour0(f);
    const terme = M.moisApres(seuil, 12);
    h2("Le calendrier de l'obligation, calculé sur ces dates");
    tab(["Étape", "Date"], [
      ["Franchissement du seuil de cinquante salariés" + (seuilDeclare ? "" : " — exemple, faute de date déclarée"), seuilDeclare ? seuil : ex(seuil)],
      ["Terme du délai de douze mois (L. 1311-2, second alinéa ; R. 1321-5)", terme ? (seuilDeclare ? terme : ex(terme)) : "—"],
      ["Situation décrite au", jour0(f)],
    ]);
    if (seuilDeclare && d.delai && d.delai.mois !== null)
      puce(d.delai.atteint
        ? `Le délai de douze mois est écoulé depuis environ ${d.delai.mois} mois : l'obligation est pleinement due, avec ou sans règlement en l'état.`
        : `Il reste environ ${Math.max(0, Math.round((12 - d.delai.mois) * 10) / 10)} mois avant le terme du délai de douze mois.`);
  } else if (d.connu && !d.du) {
    p("Sans objet en l'état de l'effectif déclaré : ce modèle vaudrait le jour où l'entreprise franchirait le seuil de cinquante salariés, ou déciderait de se doter volontairement d'un règlement.");
    return A.D;
  } else return A.D;
  h2("Les quatre formalités qui suivent la rédaction");
  puce("Avis du comité social et économique (L. 1321-4) — note DIS-CTL-RI-06.");
  puce("Publicité auprès du personnel (R. 1321-1) — note DIS-CTL-RI-07.");
  puce("Dépôt au greffe du conseil de prud'hommes (R. 1321-2) — note DIS-CTL-RI-08.");
  puce("Communication à l'inspecteur du travail en deux exemplaires (L. 1321-4 ; R. 1321-4) — note DIS-CTL-RI-09.");
  note("« Produire le document », ci-dessous, écrit le projet de règlement intérieur en entier, avec ses trois courriers d'accompagnement.");
  return A.D;
}

function modeleRi02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille du contenu — les trois matières de L. 1321-1 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare, matière par matière");
  const etat = v => (dit(v) ? "présente" : nie(v) ? "absente" : "non renseignée");
  tab(["Matière (L. 1321-1)", "Déclarée dans le règlement"], [
    ["1° Santé et sécurité, dont les instructions de L. 4122-1", etat(ri.contenuSanteSecurite)],
    ["2° Participation au rétablissement de conditions de travail protectrices", etat(ri.contenuParticipation)],
    ["3° Discipline — nature et échelle des sanctions", etat(ri.contenuDiscipline)],
  ]);
  const absentes = ["contenuSanteSecurite", "contenuParticipation", "contenuDiscipline"].filter(c => nie(ri[c])).length;
  if (absentes) p(`${absentes} matière(s) sur trois déclarée(s) absente(s) : c'est ce qu'un avenant doit compléter avant toute nouvelle formalité, pour éviter de les répéter.`);
  note("L. 1321-1 réserve ces trois matières « exclusivement » : une clause étrangère à elles n'y a pas sa place, pas plus qu'une matière manquante ne s'y devine.");
  return A.D;
}

function modeleRi03(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille de l'échelle des sanctions — " + nomE(f));
  const ri = f.ri || {};
  const max = nb(ri.misePiedDureeMaxJours);
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Nature et échelle des sanctions fixées (L. 1321-1, 3°)", dit(ri.echelleSanctions) ? "oui" : nie(ri.echelleSanctions) ? "non" : "non renseigné"],
    ["Durée maximale de la mise à pied précisée", dit(ri.misePiedDureeMax) ? (max !== null ? `oui — ${max} jour(s)` : "oui, mais le nombre de jours n'est pas renseigné") : nie(ri.misePiedDureeMax) ? "non" : "non renseigné"],
  ]);
  if (nie(ri.echelleSanctions) || nie(ri.misePiedDureeMax))
    p("Ce défaut est celui qui fait tomber les sanctions déjà prises : voir les notes DIS-CTL-SAN-03 (sanction non prévue) et DIS-CTL-SAN-04 (durée excessive), qui recalculent l'exposition sur la sanction auditée.");
  note("Une sanction absente de la liste ne peut pas être prononcée (Soc., 26 octobre 2010, n° 09-42.740) ; une mise à pied sans plafond écrit n'est pas licite, quelle que soit sa durée effective.");
  return A.D;
}

function modeleRi04(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des trois rappels de L. 1321-2 — " + nomE(f));
  const ri = f.ri || {};
  const etat = v => (dit(v) ? "présent" : nie(v) ? "absent" : "non renseigné");
  h1("Ce que le dossier déclare");
  tab(["Rappel (L. 1321-2)", "État déclaré"], [
    ["1° Droits de la défense (L. 1332-1 à L. 1332-3, ou convention collective)", etat(ri.rappelDroitsDefense)],
    ["2° Harcèlements moral et sexuel, agissements sexistes", etat(ri.rappelHarcelement)],
    ["3° Dispositif de protection des lanceurs d'alerte", etat(ri.rappelLanceursAlerte)],
  ]);
  const manquants = ["rappelDroitsDefense", "rappelHarcelement", "rappelLanceursAlerte"].filter(c => nie(ri[c])).length;
  if (manquants) p(`${manquants} rappel(s) sur trois déclaré(s) absent(s) : L. 1321-2 est rédigé à l'impératif, et « Produire le document » écrit les trois paragraphes prêts à insérer.`);
  note("Ces rappels renvoient à des dispositions que le règlement n'a pas à reproduire in extenso : leur existence suffit, leur absence ne se devine pas sur un règlement non lu par l'application.");
  return A.D;
}

function modeleRi05(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Note de revue des clauses — L. 1321-3 et L. 1321-2-1 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  puce(`Clauses prohibées par L. 1321-3 relevées à la relecture : ${dit(ri.clausesInterdites) ? "oui — à retirer" : nie(ri.clausesInterdites) ? "non" : "non renseigné"}.`);
  puce(`Clause de neutralité (L. 1321-2-1) : ${dit(ri.clauseNeutralite) ? "oui" : nie(ri.clauseNeutralite) ? "non" : "non renseigné"}.`);
  if (dit(ri.clauseNeutralite))
    puce(`Justification et proportionnalité de cette clause consignées par écrit : ${dit(ri.neutraliteJustifieeProportionnee) ? "oui, déclaré" : nie(ri.neutraliteJustifieeProportionnee) ? "non — la clause n'est pas licite en l'état" : "non renseigné"}.`);
  note("La double condition de L. 1321-2-1 — justification et proportionnalité — s'apprécie clause par clause et poste par poste : le contrôle constate la déclaration, il ne juge pas la clause elle-même.");
  return A.D;
}

function modeleRi06(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de consultation du comité — L. 1321-4 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Comité social et économique existant", dit((f.cse || {}).existe) ? "oui" : nie((f.cse || {}).existe) ? "non" : "non renseigné"],
    ["Règlement intérieur soumis à son avis avant introduction", dit(ri.avisCSE) ? "oui" : nie(ri.avisCSE) ? "non" : "non renseigné"],
  ]);
  if (nie(ri.avisCSE)) p("Cette consultation doit précéder — et non suivre — l'introduction du règlement : « Produire le document » écrit l'ordre du jour et le modèle de procès-verbal à faire adopter par le comité.");
  note("L'avis est en outre la pièce qui doit accompagner le règlement communiqué à l'inspecteur du travail (L. 1321-4) — voir la note DIS-CTL-RI-09.");
  return A.D;
}

function modeleRi07(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calendrier de publicité et d'entrée en vigueur — " + nomE(f));
  const ri = f.ri || {};
  const v = M.entreeVigueurRI(f);
  h1("Le calcul, sur les dates déclarées");
  if (v.connu) {
    tab(["Étape", "Date"], [
      ["Dernière des formalités de publicité et de dépôt (R. 1321-3)", ri.dateDerniereFormalite],
      ["Plancher légal — un mois après (L. 1321-4)", v.plancher],
      ["Entrée en vigueur inscrite au règlement", ri.dateEntreeVigueur],
    ]);
    p(v.suffisant
      ? `L'entrée en vigueur déclarée est ${v.jours} jour(s) après la dernière formalité : le délai d'un mois est tenu.`
      : `L'entrée en vigueur déclarée est ${v.jours} jour(s) après la dernière formalité, avant le plancher du ${v.plancher} : le délai d'un mois n'est pas tenu, et toute sanction fondée sur le règlement avant cette date est sans support.`);
  } else {
    const der = q(ri.dateDerniereFormalite) || ex(jour0(f));
    const plancher = M.moisApres(q(ri.dateDerniereFormalite) || jour0(f), 1);
    p("Donnée manquante pour calculer : " + v.motif + ` À titre d'illustration, avec une dernière formalité au ${der}, l'entrée en vigueur la plus proche possible serait le ${q(ri.dateDerniereFormalite) ? plancher : ex(plancher)} (exclu).`);
  }
  note("La publicité elle-même — affichage, intranet, remise contre émargement — se prouve par une pièce datée : photographie, capture, liste d'émargement, jamais par la seule affirmation.");
  return A.D;
}

function modeleRi08(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de dépôt au greffe — R. 1321-2 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  p(`Dépôt au greffe du conseil de prud'hommes du ressort : ${dit(ri.depotGreffe) ? "déclaré fait" : nie(ri.depotGreffe) ? "déclaré non fait" : "non renseigné"}.`);
  if (nie(ri.depotGreffe)) p("Tant que ce dépôt n'est pas fait, le délai d'un mois de R. 1321-3 n'a pas commencé de courir, quelle que soit la date de publicité par ailleurs — voir la note DIS-CTL-RI-07.");
  note("« Produire le document » écrit la lettre de dépôt, à adresser au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement.");
  return A.D;
}

function modeleRi09(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de communication à l'inspection du travail — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Communication à l'inspecteur du travail (L. 1321-4)", dit(ri.communicationInspection) ? "oui" : nie(ri.communicationInspection) ? "non" : "non renseigné"],
    ["Communication en deux exemplaires (R. 1321-4)", dit(ri.communicationDeuxExemplaires) ? "oui" : nie(ri.communicationDeuxExemplaires) ? "non" : "non renseigné"],
  ]);
  note("Cette carence, seule du chapitre, ne prive pas le salarié de se prévaloir du règlement (Soc., 28 mars 2000, n° 97-43.411) — elle reste néanmoins punie au même titre que les autres (R. 1323-1) : elle se répare par un simple envoi, sans attendre.");
  return A.D;
}

function modeleRi10(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de langue — L. 1321-6 — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  p(`Règlement intérieur rédigé en français : ${dit(ri.redigeFrancais) ? "oui" : nie(ri.redigeFrancais) ? "non" : "non renseigné"}.`);
  note("L'exigence s'étend à tout document comportant des obligations pour le salarié ou dont la connaissance est nécessaire à l'exécution de son travail — pas seulement au règlement lui-même.");
  return A.D;
}

function modeleRi11(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Récapitulatif des modifications et notes de service — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Modifications ou retraits de clauses depuis l'introduction", dit(ri.modifieDepuis) ? "oui" : nie(ri.modifieDepuis) ? "non" : "non renseigné"],
    ["Formalités refaites pour ces modifications", dit(ri.modifieDepuis) ? (dit(ri.modificationsFormalites) ? "oui" : nie(ri.modificationsFormalites) ? "non" : "non renseigné") : "sans objet"],
    ["Notes de service à obligations générales et permanentes", dit(ri.notesServiceGenerales) ? "oui" : nie(ri.notesServiceGenerales) ? "non" : "non renseigné"],
    ["Formalités suivies pour ces notes", dit(ri.notesServiceGenerales) ? (dit(ri.notesServiceFormalites) ? "oui" : nie(ri.notesServiceFormalites) ? "non" : "non renseigné") : "sans objet"],
  ]);
  note("L. 1321-5 traite une note de service à obligations générales et permanentes comme une adjonction au règlement intérieur : elle suit ses formalités en toute hypothèse, sauf l'urgence réservée aux seules obligations de santé et de sécurité.");
  return A.D;
}

function modeleRi12(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Suivi de la demande de l'inspecteur du travail — " + nomE(f));
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Demande de retrait ou de modification (L. 1322-1)", dit(ri.demandeInspection) ? "oui" : nie(ri.demandeInspection) ? "non" : "non renseigné"],
    ["Suivie d'effet, ou recours hiérarchique formé (L. 1322-3)", dit(ri.demandeInspection) ? (dit(ri.suiteDemandeInspection) ? "oui" : nie(ri.suiteDemandeInspection) ? "non" : "non renseigné") : "sans objet"],
  ]);
  if (dit(ri.demandeInspection) && nie(ri.suiteDemandeInspection))
    p("Deux voies seulement s'ouvrent devant une décision motivée : l'exécuter, ou former le recours hiérarchique. Rester sans réponse laisse subsister la disposition que l'inspecteur a désignée par écrit.");
  note("La décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité (L. 1322-2).");
  return A.D;
}

/* ═════════════════════════════════════════════════ la sanction auditée ═══ */

function modeleSan01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note d'énonciation écrite des griefs — L. 1332-1 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  p(`Sanction déclarée : ${natureDeclaree(f) || "non renseignée"}. Griefs portés par écrit au salarié, dans le même temps que la sanction : ${dit(s.griefsEcrits) ? "oui" : nie(s.griefsEcrits) ? "non" : "non renseigné"}.`);
  if (nie(s.griefsEcrits)) p("L. 1332-1 ne connaît pas l'exception réservée à l'avertissement par L. 1332-2 : l'écrit simultané est dû pour toute sanction, avertissement compris.");
  note("« Produire le document » écrit l'énonciation des griefs, prête à compléter des faits datés et circonstanciés — jamais devinés par l'application.");
  return A.D;
}

function modeleSan02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de retrait — sanction pécuniaire — L. 1331-2 — " + nomE(f));
  const s = f.sanction || {};
  const q2 = M.qualification(f);
  h1("Ce que le dossier déclare");
  if (q2.connu && q2.pecuniaire) p(`La sanction déclarée (« ${q2.nature} ») est par nature pécuniaire : l'interdiction de L. 1331-2 est absolue, elle ne se négocie ni par le contrat ni par le règlement intérieur.`);
  else p(`Retenue sur rémunération étrangère à une suspension du contrat : ${dit(s.retenueSalaire) ? "oui — c'est une sanction pécuniaire déguisée" : nie(s.retenueSalaire) ? "non" : "non renseigné"}.`);
  note("« Le fait d'infliger une amende ou une sanction pécuniaire en méconnaissance de l'article L. 1331-2 est puni d'une amende de 3 750 euros » (L. 1334-1) : c'est le seul texte répressif de ce chapitre qui vise la procédure disciplinaire, et non le seul règlement intérieur.");
  return A.D;
}

function modeleSan03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note de conformité à l'échelle du règlement intérieur — " + nomE(f));
  const s = f.sanction || {};
  const ri = f.ri || {};
  h1("Ce que le dossier déclare");
  p(`Sanction déclarée : ${natureDeclaree(f) || "non renseignée"}. Prévue par l'échelle du règlement intérieur : ${dit(s.prevueRI) ? "oui" : nie(s.prevueRI) ? "non" : "non renseigné"} (règlement lui-même déclaré : ${dit(ri.existe) ? "existant" : nie(ri.existe) ? "inexistant" : "non renseigné"}).`);
  if (nie(s.prevueRI) || nie(ri.existe)) p("Vérifiez la version du règlement en vigueur à la date de la sanction, et non celle d'aujourd'hui : une échelle complétée depuis ne rétroagit pas sur une sanction déjà prononcée.");
  note("Une sanction autre que le licenciement ne peut être prononcée que si elle est prévue par le règlement intérieur, chez l'employeur tenu d'en établir un (Soc., 23 mars 2017, n° 15-23.090 ; Soc., 26 octobre 2010, n° 09-42.740).");
  return A.D;
}

function modeleSan04(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la durée de la mise à pied disciplinaire — " + nomE(f));
  const s = f.sanction || {};
  const ri = f.ri || {};
  const q2 = M.qualification(f);
  if (!q2.connu || !q2.misePied) { A.D.push({ k: "p", t: "Sans objet en l'état : la sanction déclarée n'est pas une mise à pied disciplinaire." }); return A.D; }
  const duree = nb(s.dureeMisePiedJours), max = nb(ri.misePiedDureeMaxJours);
  h1("Le calcul, sur les chiffres déclarés");
  tab(["Point", "Valeur"], [
    ["Durée de la mise à pied prononcée", duree === null ? "non renseignée" : duree + " jour(s)"],
    ["Durée maximale fixée par le règlement intérieur", max === null ? "non renseignée" : max + " jour(s)"],
    ["Écart", (duree !== null && max !== null) ? (duree - max > 0 ? `+${duree - max} jour(s) au-delà du plafond` : `${max - duree} jour(s) de marge sous le plafond`) : "non calculable"],
  ]);
  if (duree !== null && max !== null && duree > max)
    p(`La mise à pied excède l'échelle du règlement intérieur de ${duree - max} jour(s) : la rémunération de ces jours reste due, et la sanction est annulable comme irrégulière en la forme (L. 1333-2).`);
  note("Une mise à pied disciplinaire n'est licite que si le règlement intérieur en précise la durée maximale (Soc., 26 octobre 2010, n° 09-42.740).");
  return A.D;
}

function modeleSan05(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la prescription des faits — L. 1332-4 — " + nomE(f));
  const s = f.sanction || {};
  const pr = M.prescriptionFaits(f);
  h1("Le calcul, sur les dates déclarées");
  if (pr.connu) {
    tab(["Étape", "Date"], [
      ["Connaissance des faits par l'employeur", s.dateConnaissance],
      ["Engagement des poursuites — " + pr.engagement.quoi, pr.engagement.date],
      ["Terme du délai de deux mois (L. 1332-4)", pr.limite],
    ]);
    p(pr.depasse
      ? `Les poursuites ont été engagées ${pr.jours} jour(s) après la connaissance des faits, au-delà du terme du ${pr.limite}` +
        (pr.penales === true ? " ; le dossier déclare des poursuites pénales dans le même délai — seule réserve que L. 1332-4 admet, à vérifier qu'elles ont bien été exercées dans ce délai." :
         pr.penales === null ? " ; il n'est pas indiqué si des poursuites pénales ont été exercées dans le même délai, seule réserve du texte." :
         " ; aucune poursuite pénale n'est déclarée dans ce délai : les faits sont prescrits.")
      : `Les poursuites ont été engagées ${pr.jours} jour(s) après la connaissance des faits, dans le délai de deux mois qui expirait le ${pr.limite}.`);
  } else {
    const conn = q(s.dateConnaissance) || ex(jour0(f));
    const limiteEx = M.moisApres(q(s.dateConnaissance) || jour0(f), 2);
    p("Donnée manquante pour calculer : " + pr.motif + ` À titre d'illustration, avec une connaissance des faits au ${conn}, le délai de deux mois expirerait le ${q(s.dateConnaissance) ? limiteEx : ex(limiteEx)}.`);
  }
  note("Le délai est de prescription : passé le terme, le fait ne peut plus fonder une sanction, quelle que soit sa gravité, hors la seule réserve de poursuites pénales exercées dans le même délai.");
  return A.D;
}

function modeleSan06(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul de la prescription des sanctions antérieures — L. 1332-5 — " + nomE(f));
  const s = f.sanction || {};
  const a = M.sanctionsAnterieures(f);
  h1("Le calcul, sur les dates déclarées");
  if (a.connu && a.invoquees && a.limite) {
    tab(["Étape", "Date"], [
      ["Sanction antérieure la plus ancienne invoquée", s.dateSanctionAnterieurePlusAncienne],
      ["Engagement des poursuites de la nouvelle sanction — " + a.engagement.quoi, a.engagement.date],
      ["Terme des trois ans (L. 1332-5)", a.limite],
    ]);
    p(a.depasse
      ? `Cette sanction antérieure date de plus de trois ans avant l'engagement des poursuites (terme le ${a.limite}) : L. 1332-5 en interdit l'invocation, sans exception.`
      : `Cette sanction antérieure date de moins de trois ans avant l'engagement des poursuites (terme le ${a.limite}) : elle peut être invoquée.`);
  } else if (a.connu && !a.invoquees) {
    p("Aucune sanction antérieure n'est invoquée à l'appui de la nouvelle sanction : ce modèle n'a pas d'objet en l'état.");
  } else {
    p("Donnée manquante pour calculer : " + a.motif);
  }
  note("Une sanction retirée de la motivation pour cause de prescription doit l'être de la lettre de notification elle-même, et des dossiers individuels qui la mentionnent encore.");
  return A.D;
}

function modeleSan07(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note sur l'entretien préalable — L. 1332-2 — " + nomE(f));
  const s = f.sanction || {};
  const e = M.entretienDu(f);
  h1("Le calcul, sur ce dossier");
  p(e.motif || "Donnée manquante pour conclure sur l'entretien préalable.");
  if (e.connu) {
    tab(["Point", "État déclaré"], [
      ["Entretien dû", e.du ? "oui" + (e.fondement === "garantie de fond" ? " — au titre d'une garantie de fond" : " — L. 1332-2") : "non, en l'état déclaré"],
      ["Entretien tenu", dit(s.entretienTenu) ? "oui" : nie(s.entretienTenu) ? "non" : "non renseigné"],
    ]);
    if (e.du === true && nie(s.entretienTenu))
      p("La sanction a été prise sans l'entretien qui était dû : « Produire le document » écrit la lettre de convocation et la trame de compte rendu, pour toute procédure encore engageable dans le délai de deux mois.");
  }
  note("L'employeur qui choisit de convoquer alors que l'entretien n'était pas dû est tenu d'en respecter tous les termes (Soc., 16 avril 2008, n° 06-41.999).");
  return A.D;
}

function modeleSan08(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille des quatre mentions de la convocation — R. 1332-1 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  const etat = v => (dit(v) ? "présente" : nie(v) ? "absente" : "non renseignée");
  tab(["Mention (R. 1332-1)", "État déclaré"], [
    ["Objet de l'entretien", etat(s.convocationObjet)],
    ["Date, heure et lieu", etat(s.convocationDateHeureLieu)],
    ["Rappel du droit d'assistance", etat(s.convocationAssistance)],
    ["Mode de remise", q(s.convocationRemise) || "non renseigné"],
  ]);
  if (q(s.convocationRemise) && s.convocationRemise !== "récépissé" && s.convocationRemise !== "lettre recommandée")
    p(`Le mode de remise déclaré (« ${s.convocationRemise} ») n'est ni le récépissé ni la lettre recommandée : R. 1332-1 n'ouvre que ces deux voies.`);
  note("Une convocation privée de la mention d'assistance prive le salarié de sa défense avant même l'entretien.");
  return A.D;
}

function modeleSan09(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Calcul des deux bornes de L. 1332-2 — R. 1332-3 — " + nomE(f));
  const s = f.sanction || {};
  const dn = M.delaiNotification(f);
  h1("Le calcul, sur les dates déclarées");
  if (dn.connu) {
    tab(["Étape", "Valeur"], [
      ["Entretien", s.dateEntretien],
      ["Borne basse — deux jours ouvrables au moins", dn.ouvrables + " jour(s) ouvrable(s) écoulé(s)"],
      ["Terme du mois, compté selon R. 1332-3" + (dn.prorogee ? " (prorogé)" : ""), dn.limiteProrogee],
      ["Notification", s.dateNotification],
    ]);
    p(dn.trop
      ? `La notification est intervenue ${dn.depassement} jour(s) après le terme du ${dn.limiteProrogee} : hors délai.`
      : dn.ouvrables < 2
        ? `La notification est intervenue ${dn.ouvrables} jour(s) ouvrable(s) après l'entretien : sous le minimum de deux jours ouvrables.`
        : `Les deux bornes sont tenues : ${dn.ouvrables} jour(s) ouvrable(s) après l'entretien, et avant le terme du ${dn.limiteProrogee}.`);
    if (dn.ouvrables === 2 || (dn.trop && dn.depassement <= 2))
      note("L'application compte les jours ouvrables hors dimanche et ne tient pas le calendrier des jours fériés : sur un résultat à la limite, un jour férié dans l'intervalle peut faire basculer la conclusion. Vérifiez le calendrier avant de conclure.");
  } else {
    p("Donnée manquante pour calculer : " + dn.motif);
  }
  return A.D;
}

function modeleSan10(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille de la décision écrite et motivée — R. 1332-2 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  const etat = v => (dit(v) ? "oui" : nie(v) ? "non" : "non renseigné");
  tab(["Point (L. 1332-2 ; R. 1332-2)", "État déclaré"], [
    ["Décision écrite", etat(s.notificationEcrite)],
    ["Décision motivée", etat(s.notificationMotivee)],
    ["Mode de notification", q(s.notificationRemise) || "non renseigné"],
  ]);
  note("Une notification qui n'énonce pas les griefs ne met pas le salarié en mesure de les discuter : « Produire le document » écrit la lettre entière, motifs entre crochets pour que rien ne soit deviné à sa place.");
  return A.D;
}

function modeleSan11(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note sur la mise à pied conservatoire — L. 1332-3 — " + nomE(f));
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Mise à pied conservatoire prononcée", dit(s.misePiedConservatoire) ? "oui" : nie(s.misePiedConservatoire) ? "non" : "non renseigné"],
    ["Entretien tenu ensuite", dit(s.entretienTenu) ? "oui" : nie(s.entretienTenu) ? "non" : "non renseigné"],
    ["Convocation envoyée", dit(s.convocationEnvoyee) ? "oui" : nie(s.convocationEnvoyee) ? "non" : "non renseigné"],
  ]);
  if (dit(s.misePiedConservatoire) && (nie(s.entretienTenu) || nie(s.convocationEnvoyee)))
    p("Aucune sanction définitive relative à ces faits ne peut être prise tant que la procédure de L. 1332-2 n'a pas été respectée (L. 1332-3) : le délai de deux mois de L. 1332-4 continue de courir depuis la connaissance des faits — voir la note DIS-CTL-SAN-05.");
  note("La mise à pied conservatoire n'est pas une sanction : elle attend la décision, elle ne la remplace pas.");
  return A.D;
}

function modeleSan12(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Note de garantie de fond — procédure conventionnelle — " + nomE(f));
  const g = f.garantie || {};
  const s = f.sanction || {};
  h1("Ce que le dossier déclare");
  tab(["Point", "État déclaré"], [
    ["Procédure prévue par la convention collective ou le règlement intérieur", dit(g.procedureApplicable) ? "oui" : nie(g.procedureApplicable) ? "non" : "non renseigné"],
    ["Source", q(g.source) || "non renseignée"],
    ["Nature de la procédure", q(g.nature) || "non renseignée"],
    ["Suivie avant la sanction", q(g.suivie) || "non renseignée"],
  ]);
  if (dit(g.procedureApplicable) && g.suivie === "tardivement ou imparfaitement") {
    tab(["Critère du juge (Soc., 8 sept. 2021, n° 19-15.039)", "Déclaré"], [
      ["Droits de la défense privés", dit(g.droitsDefensePrives) ? "oui" : nie(g.droitsDefensePrives) ? "non" : "non renseigné"],
      ["Influence sur la décision finale", dit(g.influenceDecision) ? "oui" : nie(g.influenceDecision) ? "non" : "non renseigné"],
    ]);
  }
  p("Le dossier ne porte pas de champ dédié à la date de saisine de l'organisme conventionnel : rapprochez, sur les pièces, cette date de la date de notification de la sanction (" +
    (q(s.dateNotification) || "non renseignée") + ") — c'est ce rapprochement qui établit le caractère tardif visé par Soc., 20 mars 2024, n° 22-17.292.");
  note("C'est le manquement le plus coûteux du module : une garantie de fond méconnue ne se répare pas après coup, seule une procédure reprise dès l'origine — sous réserve du délai de deux mois de L. 1332-4 — l'écarte.");
  return A.D;
}

const MODELES = {
  "DIS-CTL-RI-01": modeleRi01,
  "DIS-CTL-RI-02": modeleRi02,
  "DIS-CTL-RI-03": modeleRi03,
  "DIS-CTL-RI-04": modeleRi04,
  "DIS-CTL-RI-05": modeleRi05,
  "DIS-CTL-RI-06": modeleRi06,
  "DIS-CTL-RI-07": modeleRi07,
  "DIS-CTL-RI-08": modeleRi08,
  "DIS-CTL-RI-09": modeleRi09,
  "DIS-CTL-RI-10": modeleRi10,
  "DIS-CTL-RI-11": modeleRi11,
  "DIS-CTL-RI-12": modeleRi12,
  "DIS-CTL-SAN-01": modeleSan01,
  "DIS-CTL-SAN-02": modeleSan02,
  "DIS-CTL-SAN-03": modeleSan03,
  "DIS-CTL-SAN-04": modeleSan04,
  "DIS-CTL-SAN-05": modeleSan05,
  "DIS-CTL-SAN-06": modeleSan06,
  "DIS-CTL-SAN-07": modeleSan07,
  "DIS-CTL-SAN-08": modeleSan08,
  "DIS-CTL-SAN-09": modeleSan09,
  "DIS-CTL-SAN-10": modeleSan10,
  "DIS-CTL-SAN-11": modeleSan11,
  "DIS-CTL-SAN-12": modeleSan12,
};

module.exports = { MODELES };
