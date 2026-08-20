/* Les contrôles de la discipline et du règlement intérieur, côté employeur.

   L'objet du module : vérifier qu'un règlement intérieur existe là où il est
   obligatoire, qu'il porte ce que la loi lui impose et rien de ce qu'elle lui
   interdit, qu'il a été soumis aux formalités substantielles — avis du comité,
   publicité, dépôt au greffe du conseil de prud'hommes, communication à
   l'inspection du travail — et qu'une sanction envisagée ou prononcée respecte
   la procédure disciplinaire, ses délais et les garanties de fond que le
   règlement intérieur ou la convention collective ajoutent à la loi.

   CE QUI NE SE CONTRÔLE PAS ICI, ET QU'IL FAUT DIRE :
     — la réalité et la gravité des faits fautifs : elles s'apprécient au fond,
       l'employeur en fournit les éléments et le doute profite au salarié
       (L. 1333-1). Le module ne dit jamais qu'une sanction est justifiée ;
     — la proportionnalité de la sanction à la faute : le conseil de prud'hommes
       peut annuler une sanction disproportionnée (L. 1333-2) — c'est son
       office, pas celui d'un questionnaire ;
     — le statut protecteur du salarié titulaire d'un mandat : le module le
       SIGNALE (contrôle d'exposition) et ne l'audite pas ;
     — la procédure du licenciement disciplinaire elle-même, qui n'est pas celle
       de L. 1332-2 (L. 1333-3) ;
     — le contrôle d'exposition (DIS-CTL-EXP-01) ne rend JAMAIS « conforme » :
       la régularité d'une sanction se juge, et un blanc-seing serait faux.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ».

   Les décisions citées ont été lues à la source dans la base Judilibre de la
   Cour de cassation, et ne sont citées que pour ce qu'elles disent.          */
const M = require("./moteur-discipline.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Les décisions, citées telles qu'elles ont été lues. */
const ARRETS = {
  garantieFond: "Soc., 8 septembre 2021, n° 19-15.039, publié : « La consultation d'un organisme chargé, en vertu d'une disposition conventionnelle ou d'un règlement intérieur, de donner son avis sur un licenciement envisagé par un employeur constitue une garantie de fond, en sorte que le licenciement prononcé sans que cet organisme ait été consulté ne peut avoir de cause réelle et sérieuse. L'irrégularité commise dans le déroulement de la procédure disciplinaire prévue par une disposition conventionnelle ou un règlement intérieur, est assimilée à la violation d'une garantie de fond et rend le licenciement sans cause réelle et sérieuse lorsqu'elle a privé le salarié de droits de sa défense ou lorsqu'elle est susceptible d'avoir exercé en l'espèce une influence sur la décision finale de licenciement par l'employeur. »",
  avisTardif: "Soc., 20 mars 2024, n° 22-17.292, publié : le caractère tardif de la demande d'avis prévue par le règlement intérieur avant le prononcé d'une sanction constitue une irrégularité dans le déroulement de la procédure disciplinaire, et il appartient au juge de rechercher si cette irrégularité a privé le salarié de la possibilité d'assurer utilement sa défense ou est susceptible d'avoir exercé une influence sur la décision finale de sanctionner par l'employeur.",
  avertissementRI: "Soc., 3 mai 2011, n° 10-14.104, publié : « L'employeur qui n'est pas tenu en principe de convoquer un salarié avant de lui notifier un avertissement, est tenu de le faire dès lors qu'au regard d'un règlement intérieur l'avertissement peut avoir une influence sur le maintien du salarié dans l'entreprise. Tel est le cas lorsque le règlement intérieur, instituant ainsi une garantie de fond, subordonne le licenciement d'un salarié à l'existence de deux sanctions antérieures pouvant être constituées notamment par un avertissement. »",
  avertissementCCN: "Soc., 22 septembre 2021, n° 18-22.204, publié : même solution au regard d'une convention collective — si l'employeur n'est en principe pas tenu de convoquer un salarié à un entretien préalable avant de lui notifier un avertissement ou une sanction de même nature, il en va autrement lorsque, au regard des dispositions d'une convention collective, la sanction peut avoir une influence sur le maintien du salarié dans l'entreprise ; tel est le cas lorsque la convention collective, instituant une garantie de fond, subordonne le licenciement à l'existence de deux sanctions antérieures. Il appartient alors à la juridiction prud'homale d'apprécier si ces sanctions, irrégulières en la forme, doivent être annulées (L. 1333-2).",
  tousLesTermes: "Soc., 16 avril 2008, n° 06-41.999, publié : « Dès lors qu'il a choisi de convoquer le salarié selon les modalités de l'article L. 122-41 du code du travail [devenu L. 1332-2], l'employeur est tenu d'en respecter tous les termes, quelle que soit la sanction finalement infligée. » La cour d'appel qui avait annulé des avertissements notifiés plus d'un mois après les entretiens préalables en avait fait une exacte application.",
  sanctionPrevueRI: "Soc., 26 octobre 2010, n° 09-42.740, publié : « Une sanction disciplinaire ne peut être prononcée contre un salarié que si elle est prévue par le règlement intérieur de l'entreprise et une mise à pied disciplinaire prévue par ce règlement intérieur n'est licite que si ce règlement précise sa durée maximale. »",
  sanctionPrevueRI2: "Soc., 23 mars 2017, n° 15-23.090, publié : « Une sanction disciplinaire autre que le licenciement ne peut être prononcée contre un salarié par un employeur employant habituellement au moins vingt salariés que si elle est prévue par le règlement intérieur prescrit par l'article L. 1311-2 du code du travail. » Le seuil auquel cette décision renvoie est celui de L. 1311-2, aujourd'hui de cinquante salariés dans la version lue à la source.",
  carenceInspection: "Soc., 28 mars 2000, n° 97-43.411, publié : « La carence de l'employeur dans l'accomplissement de la formalité de communication du règlement intérieur à l'inspection du Travail ne prive pas le salarié de la possibilité de se prévaloir de ce règlement. »",
};

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* Le garde des contrôles qui portent sur le contenu ou les formalités du
   règlement intérieur : sans règlement intérieur, rien ne s'en contrôle —
   l'obligation d'en établir un, elle, relève de DIS-CTL-RI-01. */
function siRI(f, suite) {
  const ri = f.ri || {};
  if (vide(ri.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si l'entreprise s'est dotée d'un règlement intérieur : ni son contenu ni ses formalités ne peuvent être contrôlés." };
  if (nie(ri.existe)) return { etat: SO, motif: "Aucun règlement intérieur n'existe : ce contrôle n'a pas d'objet — l'obligation d'en établir un, là où elle s'impose, est contrôlée par DIS-CTL-RI-01." };
  return suite(ri);
}

/* Le garde des contrôles qui portent sur une sanction : sans sanction auditée,
   la procédure disciplinaire n'a rien à contrôler. */
function siSanction(f, suite) {
  const s = f.sanction || {};
  if (vide(s.auditee)) return { etat: MANQ, motif: "Il n'est pas indiqué si une sanction envisagée ou prononcée est soumise à l'audit : la procédure disciplinaire ne peut pas être contrôlée." };
  if (nie(s.auditee)) return { etat: SO, motif: "Aucune sanction n'est soumise à l'audit : ce contrôle n'a pas d'objet. Seul le règlement intérieur est examiné." };
  return suite(s);
}

/* ============================================ LE RÈGLEMENT INTÉRIEUR ====== */

ctl("DIS-CTL-RI-01", "Règlement intérieur",
  "Un règlement intérieur a-t-il été établi là où il est obligatoire ?",
  ["L. 1311-2", "R. 1321-5"],
  f => {
    const d = M.riDu(f);
    if (!d.connu) return { etat: MANQ, motif: d.motif };
    if (!d.du) return { etat: SO, motif: d.motif };
    const ri = f.ri || {};
    if (vide(ri.existe)) return { etat: MANQ, motif: d.motif + " Il n'est pas indiqué si un règlement intérieur a été établi." };
    if (dit(ri.existe)) return { etat: CONF, motif: d.motif + " Un règlement intérieur est établi. Son contenu et ses formalités sont contrôlés par ailleurs." };
    if (d.delai && d.delai.atteint === false)
      return { etat: SO, motif: d.motif + ` Le seuil est atteint depuis environ ${d.delai.mois} mois, soit moins de douze : l'obligation ne s'applique pas encore (L. 1311-2, second alinéa ; R. 1321-5). Elle s'appliquera au terme du délai.` };
    if (!d.delai || d.delai.atteint === null)
      return { etat: RISQ, motif: d.motif + " Aucun règlement intérieur n'est établi. L'obligation ne s'applique qu'au terme d'un délai de douze mois à compter du franchissement du seuil, et la date de ce franchissement n'est pas renseignée : renseignez-la pour que le manquement puisse être constaté ou écarté." };
    return { etat: NC, motif: d.motif + " Aucun règlement intérieur n'est établi, alors que le délai de douze mois est écoulé : l'obligation de L. 1311-2 n'est pas tenue." };
  });

ctl("DIS-CTL-RI-02", "Règlement intérieur",
  "Le règlement intérieur porte-t-il les trois matières que L. 1321-1 lui réserve ?",
  ["L. 1321-1"],
  f => siRI(f, ri => {
    if (vide(ri.contenuSanteSecurite) && vide(ri.contenuParticipation) && vide(ri.contenuDiscipline))
      return { etat: MANQ, motif: "Le contenu du règlement intérieur n'est pas décrit. L'employeur y fixe exclusivement : 1° les mesures d'application de la réglementation en matière de santé et de sécurité, notamment les instructions prévues à l'article L. 4122-1 ; 2° les conditions dans lesquelles les salariés peuvent être appelés à participer au rétablissement de conditions de travail protectrices ; 3° les règles générales et permanentes relatives à la discipline, notamment la nature et l'échelle des sanctions (L. 1321-1)." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(ri.contenuSanteSecurite, "les mesures d'application de la réglementation en matière de santé et de sécurité, notamment les instructions prévues à l'article L. 4122-1, n'y figurent pas (L. 1321-1, 1°)", "les mesures de santé et de sécurité (L. 1321-1, 1°)");
    point(ri.contenuParticipation, "les conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices n'y figurent pas (L. 1321-1, 2°)", "les conditions de participation au rétablissement des conditions de travail (L. 1321-1, 2°)");
    point(ri.contenuDiscipline, "les règles générales et permanentes relatives à la discipline n'y figurent pas (L. 1321-1, 3°)", "les règles de discipline (L. 1321-1, 3°)");
    if (griefs.length) return { etat: NC, motif: `Le règlement intérieur est incomplet : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `Le contenu du règlement intérieur est incomplètement décrit — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Le règlement intérieur porte les trois matières de L. 1321-1 : santé et sécurité, participation au rétablissement de conditions de travail protectrices, discipline. Leur suffisance au fond ne se lit pas sur une case cochée — le contrôle constate qu'elles y figurent." };
  }));

ctl("DIS-CTL-RI-03", "Règlement intérieur",
  "L'échelle des sanctions est-elle fixée, et la durée maximale de la mise à pied disciplinaire précisée ?",
  ["L. 1321-1, 3°"],
  f => siRI(f, ri => {
    if (vide(ri.echelleSanctions) && vide(ri.misePiedDureeMax))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur fixe la nature et l'échelle des sanctions que peut prendre l'employeur (L. 1321-1, 3°), ni s'il précise la durée maximale de la mise à pied disciplinaire. " + ARRETS.sanctionPrevueRI };
    const griefs = [], manques = [];
    if (vide(ri.echelleSanctions)) manques.push("la nature et l'échelle des sanctions (L. 1321-1, 3°)");
    else if (nie(ri.echelleSanctions)) griefs.push("la nature et l'échelle des sanctions que peut prendre l'employeur n'y sont pas fixées, alors que L. 1321-1, 3°, les vise expressément — et qu'une sanction non prévue par le règlement intérieur ne peut pas être prononcée");
    if (vide(ri.misePiedDureeMax)) manques.push("la durée maximale de la mise à pied disciplinaire");
    else if (nie(ri.misePiedDureeMax)) griefs.push("la durée maximale de la mise à pied disciplinaire n'y est pas précisée : une mise à pied disciplinaire prévue par le règlement intérieur n'est licite que si ce règlement précise sa durée maximale");
    if (griefs.length) return { etat: NC, motif: `L'échelle des sanctions est défaillante : ${griefs.join(" ; ")}. ${ARRETS.sanctionPrevueRI}` };
    if (manques.length) return { etat: MANQ, motif: `L'échelle des sanctions est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Le règlement intérieur fixe la nature et l'échelle des sanctions (L. 1321-1, 3°) et précise la durée maximale de la mise à pied disciplinaire. " + ARRETS.sanctionPrevueRI };
  }));

ctl("DIS-CTL-RI-04", "Règlement intérieur",
  "Le règlement intérieur rappelle-t-il les trois dispositions que L. 1321-2 lui impose de rappeler ?",
  ["L. 1321-2"],
  f => siRI(f, ri => {
    if (vide(ri.rappelDroitsDefense) && vide(ri.rappelHarcelement) && vide(ri.rappelLanceursAlerte))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur rappelle : 1° les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3 ou par la convention collective applicable ; 2° les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ; 3° l'existence du dispositif de protection des lanceurs d'alerte (L. 1321-2)." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(ri.rappelDroitsDefense, "les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3, ou par la convention collective applicable, ne sont pas rappelées (L. 1321-2, 1°)", "le rappel des droits de la défense (L. 1321-2, 1°)");
    point(ri.rappelHarcelement, "les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes ne sont pas rappelées (L. 1321-2, 2°)", "le rappel des dispositions sur les harcèlements et les agissements sexistes (L. 1321-2, 2°)");
    point(ri.rappelLanceursAlerte, "l'existence du dispositif de protection des lanceurs d'alerte n'est pas rappelée (L. 1321-2, 3°)", "le rappel du dispositif de protection des lanceurs d'alerte (L. 1321-2, 3°)");
    if (griefs.length) return { etat: NC, motif: `Les rappels imposés par L. 1321-2 ne sont pas tous faits : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `Les rappels du règlement intérieur sont incomplètement décrits — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Le règlement intérieur rappelle les droits de la défense, les dispositions sur les harcèlements et les agissements sexistes, et l'existence du dispositif de protection des lanceurs d'alerte : L. 1321-2 est respecté en l'état déclaré." };
  }));

ctl("DIS-CTL-RI-05", "Règlement intérieur",
  "Le règlement intérieur est-il exempt des clauses que L. 1321-3 interdit, et la clause de neutralité éventuelle est-elle justifiée et proportionnée ?",
  ["L. 1321-3", "L. 1321-2-1"],
  f => siRI(f, ri => {
    if (vide(ri.clausesInterdites) && vide(ri.clauseNeutralite))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur comporte des clauses de celles que L. 1321-3 prohibe — dispositions contraires aux lois, règlements, conventions et accords collectifs ; restrictions aux droits des personnes et aux libertés qui ne seraient pas justifiées par la nature de la tâche ni proportionnées au but recherché ; dispositions discriminatoires — ni s'il comporte une clause de neutralité (L. 1321-2-1)." };
    if (dit(ri.clausesInterdites))
      return { etat: NC, motif: "Le règlement intérieur comporte des clauses relevant de L. 1321-3 : dispositions contraires aux lois et règlements ou aux stipulations conventionnelles, restrictions aux droits des personnes et aux libertés individuelles et collectives non justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché, ou dispositions discriminant les salariés. Ces dispositions doivent être retirées ; l'inspecteur du travail peut à tout moment en exiger le retrait ou la modification (L. 1322-1)." };
    if (vide(ri.clausesInterdites))
      return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur comporte des clauses prohibées par L. 1321-3." };
    if (vide(ri.clauseNeutralite))
      return { etat: MANQ, motif: "Aucune clause prohibée par L. 1321-3 n'est déclarée, mais il n'est pas indiqué si le règlement intérieur comporte une clause de neutralité (L. 1321-2-1)." };
    if (nie(ri.clauseNeutralite))
      return { etat: CONF, motif: "Aucune clause prohibée par L. 1321-3 n'est déclarée, et le règlement intérieur ne comporte pas de clause de neutralité. Cette conformité est celle du dossier déclaré : la justification et la proportionnalité d'une restriction s'apprécient clause par clause, et l'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1)." };
    if (vide(ri.neutraliteJustifieeProportionnee))
      return { etat: MANQ, motif: "Le règlement intérieur comporte une clause de neutralité : il n'est pas indiqué si les restrictions qu'elle apporte sont justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, et proportionnées au but recherché (L. 1321-2-1)." };
    if (nie(ri.neutraliteJustifieeProportionnee))
      return { etat: NC, motif: "Le règlement intérieur comporte une clause de neutralité dont les restrictions ne sont ni justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, ni proportionnées au but recherché : L. 1321-2-1 n'autorise la clause qu'à cette double condition, et L. 1321-3, 2°, prohibe les restrictions qui n'y satisfont pas." };
    return { etat: RISQ, motif: "Le règlement intérieur comporte une clause de neutralité déclarée justifiée et proportionnée. Cette double condition de L. 1321-2-1 s'apprécie au fond, clause par clause et au regard du poste concerné : le contrôle constate la déclaration, il ne juge pas la clause. Documentez la justification retenue." };
  }));

ctl("DIS-CTL-RI-06", "Formalités du règlement intérieur",
  "Le règlement intérieur a-t-il été soumis à l'avis du comité social et économique avant son introduction ?",
  ["L. 1321-4"],
  f => siRI(f, ri => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe : la formalité de L. 1321-4 — le règlement intérieur ne peut être introduit qu'après avoir été soumis à son avis — ne peut pas être contrôlée." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique n'est déclaré : l'avis de L. 1321-4 n'a pas d'objet ici. La régularité de cette absence relève du module « comité social et économique » de l'application ; si un comité existe en réalité, son avis conditionne l'introduction du règlement intérieur." };
    if (vide(ri.avisCSE)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur a été soumis à l'avis du comité social et économique (L. 1321-4)." };
    if (nie(ri.avisCSE)) return { etat: NC, motif: "Le règlement intérieur n'a pas été soumis à l'avis du comité social et économique : L. 1321-4 dispose qu'il « ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique », et cette exigence vaut également en cas de modification ou de retrait de ses clauses. L'avis accompagne, en outre, le règlement communiqué à l'inspecteur du travail." };
    return { etat: CONF, motif: "Le règlement intérieur a été soumis à l'avis du comité social et économique avant son introduction, conformément à L. 1321-4." };
  }));

ctl("DIS-CTL-RI-07", "Formalités du règlement intérieur",
  "La publicité a-t-elle été faite, et l'entrée en vigueur est-elle postérieure d'un mois à la dernière formalité ?",
  ["R. 1321-1", "L. 1321-4", "R. 1321-3"],
  f => siRI(f, ri => {
    if (vide(ri.publicite)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur est porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1)." };
    if (nie(ri.publicite)) return { etat: NC, motif: "Le règlement intérieur n'est pas porté, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche : R. 1321-1 l'impose, et le délai d'un mois précédant l'entrée en vigueur court à compter de la dernière en date des formalités de publicité et de dépôt (R. 1321-3)." };
    const v = M.entreeVigueurRI(f);
    if (!v.connu) return { etat: MANQ, motif: "La publicité est faite, mais " + v.motif.charAt(0).toLowerCase() + v.motif.slice(1) };
    if (!v.suffisant) return { etat: NC, motif: `Le règlement intérieur indique une entrée en vigueur au ${(f.ri || {}).dateEntreeVigueur}, soit ${v.jours} jour(s) après la dernière des formalités de publicité et de dépôt (${(f.ri || {}).dateDerniereFormalite}). L. 1321-4 exige que cette date soit postérieure d'un mois à l'accomplissement des formalités de publicité, le délai courant à compter de la dernière en date des formalités de publicité et de dépôt définies aux articles R. 1321-1 et R. 1321-2 (R. 1321-3) : la date la plus proche possible était le ${v.plancher} exclu.` };
    return { etat: CONF, motif: `Le règlement intérieur est porté à la connaissance des personnes ayant accès aux lieux de travail (R. 1321-1), et son entrée en vigueur au ${(f.ri || {}).dateEntreeVigueur} est postérieure de ${v.jours} jour(s) à la dernière des formalités, soit plus d'un mois (L. 1321-4 ; R. 1321-3).` };
  }));

ctl("DIS-CTL-RI-08", "Formalités du règlement intérieur",
  "Le règlement intérieur a-t-il été déposé au greffe du conseil de prud'hommes ?",
  ["R. 1321-2", "R. 1321-3"],
  f => siRI(f, ri => {
    if (vide(ri.depotGreffe)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur a été déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement (R. 1321-2)." };
    if (nie(ri.depotGreffe)) return { etat: NC, motif: "Le règlement intérieur n'a pas été déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement : R. 1321-2 l'impose, et le délai d'un mois précédant l'entrée en vigueur court à compter de la dernière en date des formalités de publicité et de dépôt (R. 1321-3) — tant que le dépôt n'est pas fait, ce délai n'a pas commencé de courir." };
    return { etat: CONF, motif: "Le règlement intérieur est déposé au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement, conformément à R. 1321-2." };
  }));

ctl("DIS-CTL-RI-09", "Formalités du règlement intérieur",
  "Le règlement intérieur, accompagné de l'avis du comité, a-t-il été communiqué à l'inspecteur du travail en deux exemplaires ?",
  ["L. 1321-4", "R. 1321-4"],
  f => siRI(f, ri => {
    if (vide(ri.communicationInspection)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur, accompagné de l'avis du comité social et économique, a été communiqué à l'inspecteur du travail (L. 1321-4), en deux exemplaires (R. 1321-4)." };
    if (nie(ri.communicationInspection)) return { etat: NC, motif: "Le règlement intérieur n'a pas été communiqué à l'inspecteur du travail : L. 1321-4 impose qu'il le soit, accompagné de l'avis du comité social et économique, en même temps qu'il fait l'objet des mesures de publicité, et R. 1321-4 précise qu'il est transmis en deux exemplaires. Cette carence ne fait pas disparaître le règlement pour autant — " + ARRETS.carenceInspection };
    if (vide(ri.communicationDeuxExemplaires))
      return { etat: MANQ, motif: "Le règlement intérieur est communiqué à l'inspecteur du travail, mais il n'est pas indiqué s'il l'a été en deux exemplaires (R. 1321-4)." };
    if (nie(ri.communicationDeuxExemplaires))
      return { etat: NC, motif: "Le règlement intérieur est communiqué à l'inspecteur du travail, mais pas en deux exemplaires, comme R. 1321-4 l'exige. " + ARRETS.carenceInspection };
    return { etat: CONF, motif: "Le règlement intérieur, accompagné de l'avis du comité social et économique, est communiqué à l'inspecteur du travail en deux exemplaires (L. 1321-4 ; R. 1321-4)." };
  }));

ctl("DIS-CTL-RI-10", "Règlement intérieur",
  "Le règlement intérieur est-il rédigé en français ?",
  ["L. 1321-6"],
  f => siRI(f, ri => {
    if (vide(ri.redigeFrancais)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur est rédigé en français (L. 1321-6)." };
    if (nie(ri.redigeFrancais)) return { etat: NC, motif: "Le règlement intérieur n'est pas rédigé en français : L. 1321-6 l'impose. Il peut être accompagné de traductions en une ou plusieurs langues étrangères, mais la version française est celle qui s'impose ; il en va de même pour tout document comportant des obligations pour le salarié ou des dispositions dont la connaissance est nécessaire à l'exécution de son travail." };
    return { etat: CONF, motif: "Le règlement intérieur est rédigé en français, conformément à L. 1321-6." };
  }));

ctl("DIS-CTL-RI-11", "Formalités du règlement intérieur",
  "Les modifications du règlement intérieur et les notes de service générales et permanentes ont-elles suivi les mêmes formalités ?",
  ["L. 1321-4", "L. 1321-5"],
  f => siRI(f, ri => {
    const griefs = [], manques = [];
    if (vide(ri.modifieDepuis)) manques.push("l'existence de modifications ou de retraits de clauses depuis l'introduction du règlement (L. 1321-4, dernier alinéa)");
    else if (dit(ri.modifieDepuis)) {
      if (vide(ri.modificationsFormalites)) manques.push("les formalités accomplies pour ces modifications — avis du comité, publicité, dépôt, communication à l'inspection");
      else if (nie(ri.modificationsFormalites)) griefs.push("des clauses ont été modifiées ou retirées sans que les formalités de L. 1321-4 soient accomplies, alors que ce texte dispose expressément que ses dispositions « s'appliquent également en cas de modification ou de retrait des clauses du règlement intérieur »");
    }
    if (vide(ri.notesServiceGenerales)) manques.push("l'existence de notes de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 (L. 1321-5)");
    else if (dit(ri.notesServiceGenerales)) {
      if (vide(ri.notesServiceFormalites)) manques.push("les formalités accomplies pour ces notes de service");
      else if (nie(ri.notesServiceFormalites)) griefs.push("des notes de service comportant des obligations générales et permanentes dans les matières mentionnées aux articles L. 1321-1 et L. 1321-2 ont été prises sans les formalités du titre, alors que L. 1321-5 les considère comme des adjonctions au règlement intérieur et les y soumet en toute hypothèse — sauf urgence, pour les seules obligations de santé et de sécurité, qui sont alors immédiatement et simultanément communiquées au secrétaire du comité social et économique et à l'inspection du travail");
    }
    if (griefs.length) return { etat: NC, motif: `Les formalités n'ont pas suivi : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `Les modifications et notes de service sont incomplètement décrites — il manque : ${manques.join(" ; ")}.` };
    if (nie(ri.modifieDepuis) && nie(ri.notesServiceGenerales))
      return { etat: SO, motif: "Aucune modification ni retrait de clause depuis l'introduction du règlement intérieur, et aucune note de service comportant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 : les formalités de L. 1321-4 et L. 1321-5 n'ont pas eu à jouer." };
    return { etat: CONF, motif: "Les modifications du règlement intérieur, ou les notes de service comportant des obligations générales et permanentes, ont suivi les formalités du titre — avis du comité, publicité, dépôt, communication à l'inspection (L. 1321-4, dernier alinéa ; L. 1321-5)." };
  }));

ctl("DIS-CTL-RI-12", "Formalités du règlement intérieur",
  "L'inspecteur du travail a-t-il exigé le retrait ou la modification de dispositions, et cette demande a-t-elle été suivie d'effet ?",
  ["L. 1322-1", "L. 1322-2", "L. 1322-3"],
  f => siRI(f, ri => {
    if (vide(ri.demandeInspection)) return { etat: MANQ, motif: "Il n'est pas indiqué si l'inspecteur du travail a exigé le retrait ou la modification de dispositions du règlement intérieur : il peut le faire à tout moment pour les dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1)." };
    if (nie(ri.demandeInspection)) return { etat: SO, motif: "Aucune demande de retrait ou de modification de l'inspecteur du travail n'est déclarée : L. 1322-1 n'a pas eu à jouer. Il peut l'exiger à tout moment ; sa décision est motivée, notifiée à l'employeur et communiquée pour information aux membres du comité social et économique (L. 1322-2), et peut faire l'objet d'un recours hiérarchique (L. 1322-3)." };
    if (vide(ri.suiteDemandeInspection)) return { etat: MANQ, motif: "L'inspecteur du travail a exigé le retrait ou la modification de dispositions du règlement intérieur (L. 1322-1) : il n'est pas indiqué si cette demande a été suivie d'effet, ni si un recours hiérarchique a été formé (L. 1322-3)." };
    if (nie(ri.suiteDemandeInspection)) return { etat: NC, motif: "L'inspecteur du travail a exigé le retrait ou la modification de dispositions du règlement intérieur et cette demande n'a pas été suivie d'effet : L. 1322-1 lui permet de l'exiger à tout moment pour les dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6. Sa décision est motivée et notifiée (L. 1322-2) ; la voie ouverte est le recours hiérarchique (L. 1322-3), non l'inaction." };
    return { etat: CONF, motif: "La demande de retrait ou de modification formée par l'inspecteur du travail (L. 1322-1) a été suivie d'effet." };
  }));

/* ================================================ LA SANCTION AUDITÉE ===== */

ctl("DIS-CTL-SAN-01", "Procédure disciplinaire",
  "Les griefs ont-ils été portés par écrit à la connaissance du salarié ?",
  ["L. 1332-1", "L. 1331-1"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (vide(s.griefsEcrits)) return { etat: MANQ, motif: "Il n'est pas indiqué si le salarié a été informé, par écrit, des griefs retenus contre lui. Aucune sanction ne peut être prise sans que le salarié en soit informé, dans le même temps et par écrit (L. 1332-1) — l'exigence vaut pour toute sanction au sens de L. 1331-1, c'est-à-dire toute mesure autre que les observations verbales." };
    if (nie(s.griefsEcrits)) return { etat: NC, motif: `La mesure déclarée (« ${q.nature} ») a été prise sans que le salarié soit informé, dans le même temps et par écrit, des griefs retenus contre lui : L. 1332-1 l'interdit. Cette exigence ne connaît pas l'exception que L. 1332-2 réserve à l'avertissement : elle porte sur toute sanction au sens de L. 1331-1.` };
    return { etat: CONF, motif: "Le salarié a été informé, dans le même temps et par écrit, des griefs retenus contre lui (L. 1332-1)." };
  }));

ctl("DIS-CTL-SAN-02", "Procédure disciplinaire",
  "La sanction est-elle exempte de tout caractère pécuniaire ?",
  ["L. 1331-2", "L. 1333-2"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (q.pecuniaire) return { etat: NC, motif: "La sanction déclarée est une amende ou une sanction pécuniaire : « Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite » (L. 1331-2). Une telle sanction est encourue devant le conseil de prud'hommes, qui peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée (L. 1333-2). La retenue sur salaire correspondant à une mise à pied disciplinaire régulièrement prononcée n'est pas une sanction pécuniaire : elle est la conséquence de la suspension du contrat." };
    if (vide(s.retenueSalaire)) return { etat: MANQ, motif: "Il n'est pas indiqué si la sanction s'accompagne d'une retenue sur la rémunération autre que celle qui résulterait de la suspension du contrat pendant une mise à pied disciplinaire (L. 1331-2)." };
    if (dit(s.retenueSalaire)) return { etat: NC, motif: "La sanction s'accompagne d'une retenue sur la rémunération qui n'est pas la conséquence d'une suspension du contrat : c'est une sanction pécuniaire, que L. 1331-2 interdit — toute disposition ou stipulation contraire étant réputée non écrite." };
    return { etat: CONF, motif: "La sanction ne comporte ni amende ni retenue sur la rémunération étrangère à une suspension du contrat : l'interdiction de L. 1331-2 est respectée." };
  }));

ctl("DIS-CTL-SAN-03", "Procédure disciplinaire",
  "La sanction prononcée est-elle prévue par le règlement intérieur ?",
  ["L. 1321-1, 3°", "L. 1311-2"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (q.licenciement) return { etat: SO, motif: "La mesure auditée est un licenciement : l'exigence n'a pas d'objet — « Une sanction disciplinaire AUTRE QUE LE LICENCIEMENT ne peut être prononcée contre un salarié par un employeur employant habituellement au moins vingt salariés que si elle est prévue par le règlement intérieur » (" + ARRETS.sanctionPrevueRI2 + ")" };
    const d = M.riDu(f);
    if (!d.connu) return { etat: MANQ, motif: d.motif + " " + ARRETS.sanctionPrevueRI2 };
    if (!d.du) return { etat: SO, motif: d.motif + " L'exigence tirée du règlement intérieur suppose que l'employeur soit tenu d'en établir un : " + ARRETS.sanctionPrevueRI2 };
    const ri = f.ri || {};
    if (nie(ri.existe)) return { etat: NC, motif: "L'employeur est tenu d'établir un règlement intérieur et n'en a aucun : la sanction prononcée ne peut donc pas y être prévue. " + ARRETS.sanctionPrevueRI2 + " " + ARRETS.sanctionPrevueRI };
    if (vide(s.prevueRI)) return { etat: MANQ, motif: "Il n'est pas indiqué si la sanction prononcée figure dans l'échelle des sanctions du règlement intérieur. " + ARRETS.sanctionPrevueRI2 };
    if (nie(s.prevueRI)) return { etat: NC, motif: `La sanction prononcée (« ${q.nature} ») n'est pas prévue par le règlement intérieur, alors que l'employeur est tenu d'en établir un. ${ARRETS.sanctionPrevueRI} ${ARRETS.sanctionPrevueRI2}` };
    return { etat: CONF, motif: `La sanction prononcée (« ${q.nature} ») est prévue par le règlement intérieur. ${ARRETS.sanctionPrevueRI2}` };
  }));

ctl("DIS-CTL-SAN-04", "Procédure disciplinaire",
  "La mise à pied disciplinaire respecte-t-elle la durée maximale que le règlement intérieur doit préciser ?",
  ["L. 1321-1, 3°"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (!q.connu) return { etat: MANQ, motif: q.motif };
    if (!q.misePied) return { etat: SO, motif: `La sanction auditée n'est pas une mise à pied disciplinaire (« ${q.nature} ») : la durée maximale que le règlement intérieur doit préciser n'a pas d'objet ici. ${ARRETS.sanctionPrevueRI}` };
    const ri = f.ri || {};
    if (vide(ri.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un règlement intérieur existe : la licéité de la mise à pied disciplinaire en dépend. " + ARRETS.sanctionPrevueRI };
    if (nie(ri.existe)) return { etat: NC, motif: "Une mise à pied disciplinaire est prononcée alors qu'aucun règlement intérieur n'existe : elle ne peut donc ni y être prévue ni y voir sa durée maximale précisée. " + ARRETS.sanctionPrevueRI };
    if (vide(ri.misePiedDureeMax)) return { etat: MANQ, motif: "Il n'est pas indiqué si le règlement intérieur précise la durée maximale de la mise à pied disciplinaire. " + ARRETS.sanctionPrevueRI };
    if (nie(ri.misePiedDureeMax)) return { etat: NC, motif: "Une mise à pied disciplinaire est prononcée alors que le règlement intérieur ne précise pas sa durée maximale : elle n'est pas licite. " + ARRETS.sanctionPrevueRI };
    const max = Number(ri.misePiedDureeMaxJours), duree = Number(s.dureeMisePiedJours);
    if (!isFinite(max) || !isFinite(duree) || vide(ri.misePiedDureeMaxJours) || vide(s.dureeMisePiedJours))
      return { etat: MANQ, motif: "La durée maximale inscrite au règlement intérieur, ou la durée de la mise à pied prononcée, n'est pas renseignée : la comparaison ne peut pas être faite. " + ARRETS.sanctionPrevueRI };
    if (duree > max) return { etat: NC, motif: `La mise à pied prononcée est de ${duree} jour(s), alors que le règlement intérieur en fixe la durée maximale à ${max} jour(s) : la sanction excède l'échelle que le règlement intérieur fixe (L. 1321-1, 3°). ${ARRETS.sanctionPrevueRI}` };
    return { etat: CONF, motif: `La mise à pied prononcée est de ${duree} jour(s), dans la limite des ${max} jour(s) que le règlement intérieur fixe comme durée maximale. ${ARRETS.sanctionPrevueRI}` };
  }));

ctl("DIS-CTL-SAN-05", "Délais et prescription",
  "Les poursuites disciplinaires ont-elles été engagées dans les deux mois de la connaissance des faits ?",
  ["L. 1332-4", "R. 1332-1"],
  f => siSanction(f, s => {
    const p = M.prescriptionFaits(f);
    if (!p.connu) return { etat: MANQ, motif: p.motif };
    if (!p.depasse)
      return { etat: CONF, motif: `Les poursuites ont été engagées le ${p.engagement.date} — ${p.engagement.quoi} — soit ${p.jours} jour(s) après la connaissance des faits par l'employeur (${(f.sanction || {}).dateConnaissance}), dans le délai de deux mois de L. 1332-4, dont le terme était le ${p.limite}. R. 1332-1 confirme que la lettre de convocation est adressée dans ce délai.` };
    if (p.penales === true)
      return { etat: RISQ, motif: `Les poursuites ont été engagées le ${p.engagement.date}, soit au-delà du délai de deux mois expirant le ${p.limite}. Le dossier déclare toutefois que les faits ont donné lieu à l'exercice de poursuites pénales : L. 1332-4 réserve précisément ce cas — « à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales ». Il reste à vérifier que ces poursuites ont bien été exercées DANS le délai de deux mois : le contrôle ne le fait pas à votre place.` };
    if (p.penales === null)
      return { etat: MANQ, motif: `Les poursuites ont été engagées le ${p.engagement.date}, soit au-delà du délai de deux mois expirant le ${p.limite}. Il n'est pas indiqué si les faits ont donné lieu, dans le même délai, à l'exercice de poursuites pénales — seule réserve que L. 1332-4 prévoit.` };
    return { etat: NC, motif: `Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance (L. 1332-4). Ici, l'employeur déclare avoir eu connaissance des faits le ${(f.sanction || {}).dateConnaissance} et n'a engagé les poursuites que le ${p.engagement.date} — ${p.engagement.quoi} —, soit ${p.jours} jour(s) après, quand le délai expirait le ${p.limite}. Aucune poursuite pénale n'est déclarée : la réserve de L. 1332-4 ne joue pas. Les faits sont prescrits.` };
  }));

ctl("DIS-CTL-SAN-06", "Délais et prescription",
  "Les sanctions antérieures invoquées ont-elles moins de trois ans ?",
  ["L. 1332-5"],
  f => siSanction(f, s => {
    const a = M.sanctionsAnterieures(f);
    if (!a.connu) return { etat: MANQ, motif: a.motif };
    if (!a.invoquees) return { etat: SO, motif: "Aucune sanction antérieure n'est invoquée à l'appui de la nouvelle sanction : la prescription de L. 1332-5 n'a pas d'objet." };
    if (a.depasse) return { etat: NC, motif: `La sanction antérieure la plus ancienne invoquée date du ${(f.sanction || {}).dateSanctionAnterieurePlusAncienne}, soit plus de trois ans avant l'engagement des poursuites (${a.engagement.date} — ${a.engagement.quoi}) : « Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction » (L. 1332-5). Le terme des trois ans était le ${a.limite}.` };
    return { etat: CONF, motif: `La sanction antérieure la plus ancienne invoquée date du ${(f.sanction || {}).dateSanctionAnterieurePlusAncienne}, soit moins de trois ans avant l'engagement des poursuites (${a.engagement.date}) : L. 1332-5 est respecté. Le terme des trois ans était le ${a.limite}.` };
  }));

ctl("DIS-CTL-SAN-07", "Procédure disciplinaire",
  "L'entretien préalable était-il dû, et a-t-il été tenu ?",
  ["L. 1332-2", "Soc., 3 mai 2011, n° 10-14.104", "Soc., 22 septembre 2021, n° 18-22.204"],
  f => siSanction(f, s => {
    const e = M.entretienDu(f);
    if (e.licenciement) return { etat: SO, motif: e.motif + " L'entretien préalable au licenciement et ses délais relèvent du module « licenciement » de l'application." };
    if (!e.connu) return { etat: MANQ, motif: e.motif };
    if (!e.du) return { etat: SO, motif: e.motif + " Si l'employeur a néanmoins choisi de convoquer le salarié, il est tenu de respecter tous les termes de la procédure — " + ARRETS.tousLesTermes };
    const fondeSurGarantie = e.fondement === "garantie de fond";
    if (vide(s.entretienTenu)) return { etat: MANQ, motif: e.motif + " Il n'est pas indiqué si l'entretien a été tenu." };
    if (nie(s.entretienTenu)) return { etat: NC, motif: e.motif +
      (fondeSurGarantie
        ? ` L'entretien n'a pas été tenu : la sanction a été notifiée sans que le salarié ait été convoqué ni entendu, en violation d'une garantie de fond instituée par le règlement intérieur ou la convention collective. ${ARRETS.avertissementRI} ${ARRETS.avertissementCCN} Il appartient à la juridiction prud'homale d'apprécier si la sanction, irrégulière en la forme, doit être annulée (L. 1333-2).`
        : " L'entretien n'a pas été tenu : la sanction a été prise sans que l'employeur ait indiqué au salarié le motif de la sanction envisagée ni recueilli ses explications, comme L. 1332-2 l'impose. La sanction est irrégulière en la forme, et le conseil de prud'hommes peut l'annuler (L. 1333-2).") };
    return { etat: CONF, motif: e.motif + " L'entretien a été tenu : au cours de celui-ci, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié (L. 1332-2)." };
  }));

ctl("DIS-CTL-SAN-08", "Procédure disciplinaire",
  "La lettre de convocation porte-t-elle les mentions de R. 1332-1, et a-t-elle été remise dans les formes ?",
  ["R. 1332-1", "L. 1332-2"],
  f => siSanction(f, s => {
    const e = M.entretienDu(f);
    if (e.licenciement) return { etat: SO, motif: e.motif };
    if (vide(s.convocationEnvoyee) && !e.connu) return { etat: MANQ, motif: e.motif };
    if (vide(s.convocationEnvoyee)) return { etat: MANQ, motif: "Il n'est pas indiqué si une lettre de convocation à l'entretien préalable a été envoyée." };
    if (nie(s.convocationEnvoyee)) {
      if (!e.connu) return { etat: MANQ, motif: e.motif + " Aucune convocation n'a été envoyée." };
      if (e.du) return { etat: NC, motif: e.motif + " Aucune lettre de convocation n'a été envoyée : R. 1332-1 exige une lettre indiquant l'objet de l'entretien, précisant sa date, son heure et son lieu, rappelant que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et remise contre récépissé ou adressée par lettre recommandée dans le délai de deux mois fixé à l'article L. 1332-4." };
      return { etat: SO, motif: e.motif + " Aucune convocation n'a été envoyée, et aucune n'était due : les mentions de R. 1332-1 n'ont pas d'objet." };
    }
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(s.convocationObjet, "elle n'indique pas l'objet de l'entretien entre le salarié et l'employeur", "l'indication de l'objet de l'entretien");
    point(s.convocationDateHeureLieu, "elle ne précise pas la date, l'heure et le lieu de l'entretien", "la date, l'heure et le lieu de l'entretien");
    point(s.convocationAssistance, "elle ne rappelle pas que le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise", "le rappel du droit d'être assisté");
    if (vide(s.convocationRemise)) manques.push("le mode de remise — récépissé ou lettre recommandée");
    else if (s.convocationRemise !== "récépissé" && s.convocationRemise !== "lettre recommandée")
      griefs.push("elle n'a été ni remise contre récépissé ni adressée par lettre recommandée, alors que R. 1332-1 n'ouvre que ces deux voies");
    if (griefs.length) return { etat: NC, motif: `La lettre de convocation ne satisfait pas R. 1332-1 : ${griefs.join(" ; ")}.` +
      (e.du === false ? " La convocation n'était pas due, mais l'employeur qui a choisi de convoquer est tenu de respecter tous les termes de la procédure — " + ARRETS.tousLesTermes : "") };
    if (manques.length) return { etat: MANQ, motif: `La lettre de convocation est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "La lettre de convocation indique l'objet de l'entretien, précise sa date, son heure et son lieu, rappelle le droit du salarié de se faire assister par une personne de son choix appartenant au personnel de l'entreprise, et a été remise contre récépissé ou adressée par lettre recommandée (R. 1332-1 ; L. 1332-2)." +
      (e.du === false ? " La convocation n'était pas due ; l'employeur qui a choisi de convoquer en respecte les termes — " + ARRETS.tousLesTermes : "") };
  }));

ctl("DIS-CTL-SAN-09", "Délais et prescription",
  "La sanction est-elle intervenue au moins deux jours ouvrables et au plus un mois après l'entretien ?",
  ["L. 1332-2", "R. 1332-2", "R. 1332-3"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (q.connu && q.licenciement) return { etat: SO, motif: "La mesure auditée est un licenciement : les délais de L. 1332-2 ne lui sont pas applicables — sa procédure et ses délais sont ceux du licenciement (L. 1333-3)." };
    if (vide(s.entretienTenu)) return { etat: MANQ, motif: "Il n'est pas indiqué si un entretien préalable a été tenu : les délais de L. 1332-2, qui courent du jour fixé pour l'entretien, ne peuvent pas être vérifiés." };
    if (nie(s.entretienTenu)) return { etat: SO, motif: "Aucun entretien préalable n'a été tenu : les délais de L. 1332-2, qui courent du jour fixé pour l'entretien, n'ont pas d'objet — l'absence d'entretien, elle, est appréciée par DIS-CTL-SAN-07." };
    const d = M.delaiNotification(f);
    if (!d.connu) return { etat: MANQ, motif: d.motif };
    const rappel = (M.entretienDu(f).du === false)
      ? " La procédure n'était pas due, mais " + ARRETS.tousLesTermes : "";
    if (d.trop) {
      if (d.depassement <= 2)
        return { etat: RISQ, motif: `La sanction a été notifiée le ${s.dateNotification}, soit ${d.depassement} jour(s) après le ${d.limiteProrogee}, terme du délai d'un mois compté selon R. 1332-3 depuis l'entretien du ${s.dateEntretien}. R. 1332-3 proroge ce terme jusqu'au premier jour ouvrable suivant lorsqu'il tombe un samedi, un dimanche ou un jour férié ou chômé : l'application proroge les samedis et dimanches, mais ne tient pas le calendrier des jours fériés. Un jour férié au terme du délai pourrait le sauver ; vérifiez la date exacte.${rappel}` };
      return { etat: NC, motif: `La sanction ne peut intervenir plus d'un mois après le jour fixé pour l'entretien (L. 1332-2), le délai expirant à vingt-quatre heures le jour du mois suivant qui porte le même quantième que le jour de l'entretien (R. 1332-3). L'entretien s'est tenu le ${s.dateEntretien}, le délai expirait le ${d.limiteProrogee}, et la sanction a été notifiée le ${s.dateNotification}, soit ${d.depassement} jour(s) trop tard. R. 1332-2 impose d'ailleurs que la notification intervienne dans ce délai d'un mois.${rappel}` };
    }
    if (d.ouvrables < 2)
      return { etat: NC, motif: `La sanction ne peut intervenir moins de deux jours ouvrables après le jour fixé pour l'entretien (L. 1332-2). L'entretien s'est tenu le ${s.dateEntretien} et la sanction a été notifiée le ${s.dateNotification}, soit ${d.ouvrables} jour(s) ouvrable(s) après — les jours ouvrables étant ici comptés hors dimanche.${rappel}` };
    if (d.ouvrables === 2)
      return { etat: RISQ, motif: `La sanction a été notifiée ${d.ouvrables} jours ouvrables après l'entretien du ${s.dateEntretien} : c'est exactement le minimum de L. 1332-2. L'application compte les jours ouvrables hors dimanche et ne tient pas le calendrier des jours fériés — un jour férié ou chômé dans l'intervalle ferait passer le délai sous le minimum. Vérifiez le calendrier avant de conclure.${rappel}` };
    return { etat: CONF, motif: `La sanction a été notifiée le ${s.dateNotification}, soit ${d.ouvrables} jours ouvrables après l'entretien du ${s.dateEntretien} et avant le ${d.limiteProrogee}, terme du délai d'un mois compté selon R. 1332-3 : les deux bornes de L. 1332-2 sont tenues.${rappel}` };
  }));

ctl("DIS-CTL-SAN-10", "Procédure disciplinaire",
  "La décision est-elle écrite, motivée et notifiée dans les formes ?",
  ["L. 1332-2", "R. 1332-2"],
  f => siSanction(f, s => {
    const q = M.qualification(f);
    if (q.connu && q.licenciement) return { etat: SO, motif: "La mesure auditée est un licenciement : la forme et la motivation de sa notification relèvent des règles du licenciement, non de R. 1332-2 (L. 1333-3)." };
    if (vide(s.notificationEcrite) && vide(s.notificationMotivee) && vide(s.notificationRemise))
      return { etat: MANQ, motif: "La notification de la sanction n'est pas décrite : elle « fait l'objet d'une décision écrite et motivée » et est notifiée au salarié « soit par lettre remise contre récépissé, soit par lettre recommandée » (R. 1332-2) ; L. 1332-2 le dit dans les mêmes termes — la sanction « est motivée et notifiée à l'intéressé »." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(s.notificationEcrite, "la sanction n'a pas fait l'objet d'une décision écrite, alors que R. 1332-2 l'impose", "le caractère écrit de la décision");
    point(s.notificationMotivee, "la décision n'est pas motivée, alors que L. 1332-2 et R. 1332-2 l'imposent l'un et l'autre — une notification qui n'énonce pas les griefs ne met pas le salarié en mesure de les discuter", "la motivation de la décision");
    if (vide(s.notificationRemise)) manques.push("le mode de notification — récépissé ou lettre recommandée");
    else if (s.notificationRemise !== "récépissé" && s.notificationRemise !== "lettre recommandée")
      griefs.push("la décision n'a été ni remise contre récépissé ni adressée par lettre recommandée, alors que R. 1332-2 n'ouvre que ces deux voies");
    if (griefs.length) return { etat: NC, motif: `La notification de la sanction est irrégulière : ${griefs.join(" ; ")}. Le conseil de prud'hommes peut annuler une sanction irrégulière en la forme (L. 1333-2).` };
    if (manques.length) return { etat: MANQ, motif: `La notification est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "La sanction a fait l'objet d'une décision écrite et motivée, notifiée au salarié contre récépissé ou par lettre recommandée (L. 1332-2 ; R. 1332-2)." };
  }));

ctl("DIS-CTL-SAN-11", "Procédure disciplinaire",
  "La mise à pied conservatoire a-t-elle été suivie de la procédure disciplinaire ?",
  ["L. 1332-3"],
  f => siSanction(f, s => {
    if (vide(s.misePiedConservatoire)) return { etat: MANQ, motif: "Il n'est pas indiqué si les faits reprochés ont rendu indispensable une mesure conservatoire de mise à pied à effet immédiat : dans ce cas, aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure de L. 1332-2 ait été respectée (L. 1332-3)." };
    if (nie(s.misePiedConservatoire)) return { etat: SO, motif: "Aucune mise à pied conservatoire n'a été prononcée : L. 1332-3 n'a pas d'objet ici." };
    if (vide(s.entretienTenu) || vide(s.convocationEnvoyee))
      return { etat: MANQ, motif: "Une mise à pied conservatoire a été prononcée, mais la convocation ou l'entretien ne sont pas renseignés : L. 1332-3 exige que la procédure de L. 1332-2 ait été respectée avant toute sanction définitive relative à ces faits." };
    if (nie(s.entretienTenu) || nie(s.convocationEnvoyee))
      return { etat: NC, motif: "Une mesure conservatoire de mise à pied à effet immédiat a été prononcée, mais la procédure de L. 1332-2 n'a pas été respectée — convocation ou entretien manquants : « aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure prévue à l'article L. 1332-2 ait été respectée » (L. 1332-3). La mise à pied conservatoire n'est pas elle-même une sanction : elle attend la décision, elle ne la remplace pas." };
    return { etat: CONF, motif: "Une mise à pied conservatoire a été prononcée, et la procédure de L. 1332-2 — convocation et entretien — a été suivie avant la sanction définitive (L. 1332-3)." };
  }));

ctl("DIS-CTL-SAN-12", "Garantie de fond",
  "La procédure prévue par la convention collective ou le règlement intérieur a-t-elle été respectée ?",
  ["Soc., 8 septembre 2021, n° 19-15.039", "Soc., 20 mars 2024, n° 22-17.292", "L. 1333-2"],
  f => siSanction(f, s => {
    const g = M.garantieDeFond(f);
    const q = M.qualification(f);
    if (g.procedure === null) return { etat: MANQ, motif: "Il n'est pas indiqué si une convention collective ou le règlement intérieur prévoient, avant le prononcé d'une sanction, une procédure particulière — consultation d'un conseil de discipline ou d'une commission paritaire, entretien imposé, autre formalité. " + ARRETS.garantieFond };
    if (g.procedure === "non") return { etat: SO, motif: "Aucune procédure conventionnelle ni de règlement intérieur n'est déclarée applicable avant le prononcé de la sanction : la garantie de fond n'a pas d'objet ici. Elle demeure la première chose à vérifier dans une convention collective — " + ARRETS.garantieFond };
    if (g.nature === null || g.suivie === null)
      return { etat: MANQ, motif: "Une procédure conventionnelle ou de règlement intérieur est déclarée applicable, mais sa nature ou son accomplissement ne sont pas renseignés. " + ARRETS.garantieFond };
    const quoi = g.source ? `prévue par ${g.source}` : "prévue par la convention collective ou le règlement intérieur";
    const consultation = g.nature === "consultation d'un organisme appelé à donner son avis";
    if (g.suivie === "non") {
      if (consultation && q.connu && q.licenciement)
        return { etat: NC, motif: `L'organisme chargé, en vertu d'une disposition ${quoi}, de donner son avis sur le licenciement envisagé n'a pas été consulté. ${ARRETS.garantieFond} Le licenciement prononcé sans cette consultation ne peut avoir de cause réelle et sérieuse.` };
      return { etat: NC, motif: `La procédure ${quoi} — ${g.nature} — n'a pas été suivie. ${ARRETS.garantieFond} Appliquée à une sanction autre que le licenciement, la même logique conduit le conseil de prud'hommes à apprécier si la sanction, irrégulière en la forme, doit être annulée (L. 1333-2 ; ${ARRETS.avertissementCCN})` };
    }
    if (g.suivie === "tardivement ou imparfaitement") {
      const prives = f.garantie && f.garantie.droitsDefensePrives;
      const influence = f.garantie && f.garantie.influenceDecision;
      if (dit(prives) || dit(influence))
        return { etat: NC, motif: `La procédure ${quoi} — ${g.nature} — a été suivie tardivement ou imparfaitement, et le dossier déclare ${dit(prives) ? "que l'irrégularité a privé le salarié de la possibilité d'assurer utilement sa défense" : ""}${dit(prives) && dit(influence) ? " et " : ""}${dit(influence) ? "qu'elle est susceptible d'avoir exercé une influence sur la décision finale" : ""}. C'est exactement le critère que la Cour de cassation retient. ${ARRETS.garantieFond} ${ARRETS.avisTardif}` };
      if (vide(prives) || vide(influence))
        return { etat: MANQ, motif: `La procédure ${quoi} a été suivie tardivement ou imparfaitement : il faut savoir si cette irrégularité a privé le salarié de la possibilité d'assurer utilement sa défense, et si elle est susceptible d'avoir exercé une influence sur la décision finale — ce sont les deux branches du critère. ${ARRETS.avisTardif}` };
      return { etat: RISQ, motif: `La procédure ${quoi} — ${g.nature} — a été suivie tardivement ou imparfaitement. Le dossier ne déclare ni privation des droits de la défense ni influence sur la décision finale, mais ces deux appréciations appartiennent au juge, non au questionnaire. ${ARRETS.avisTardif} ${ARRETS.garantieFond} Conservez la preuve de la date de saisine, de l'avis rendu et de son contenu.` };
    }
    return { etat: CONF, motif: `La procédure ${quoi} — ${g.nature} — a été suivie avant le prononcé de la sanction. ${ARRETS.garantieFond}` };
  }));

/* ------------------------------------------------------------- l'exposition */

ctl("DIS-CTL-EXP-01", "Exposition",
  "À quoi l'employeur s'expose-t-il en l'état du dossier ?",
  ["L. 1333-1", "L. 1333-2", "L. 1333-3", "L. 1331-2"],
  f => {
    const s = f.sanction || {};
    const ri = f.ri || {};
    const q = M.qualification(f);
    const g = M.garantieDeFond(f);
    const griefs = [];
    if (q.connu && q.pecuniaire)
      griefs.push("une sanction pécuniaire, que L. 1331-2 interdit et dont toute stipulation contraire est réputée non écrite");
    if (nie(s.griefsEcrits))
      griefs.push("des griefs jamais portés par écrit à la connaissance du salarié (L. 1332-1)");
    const p = M.prescriptionFaits(f);
    if (p.connu && p.depasse && p.penales === false)
      griefs.push(`des faits prescrits — poursuites engagées le ${p.engagement.date} quand le délai de deux mois expirait le ${p.limite} (L. 1332-4)`);
    const e = M.entretienDu(f);
    if (e.connu && e.du === true && nie(s.entretienTenu))
      griefs.push("une sanction prise sans l'entretien préalable qui était dû" + (e.fondement === "garantie de fond" ? ", en violation d'une garantie de fond instituée par le règlement intérieur ou la convention collective" : " (L. 1332-2)"));
    if (g.procedure === "oui" && g.suivie === "non")
      griefs.push("une procédure conventionnelle ou de règlement intérieur non suivie : l'irrégularité est assimilée à la violation d'une garantie de fond, et rend le licenciement sans cause réelle et sérieuse lorsqu'elle a privé le salarié de droits de sa défense ou qu'elle est susceptible d'avoir exercé une influence sur la décision finale (Soc., 8 septembre 2021, n° 19-15.039)");
    const d = M.delaiNotification(f);
    if (d.connu && d.trop && d.depassement > 2)
      griefs.push(`une sanction notifiée plus d'un mois après l'entretien (L. 1332-2 ; R. 1332-3) — ${ARRETS.tousLesTermes}`);
    if (nie(ri.existe) && M.riDu(f).du === true)
      griefs.push("l'absence de règlement intérieur là où L. 1311-2 en impose un, dont l'inspecteur du travail peut à tout moment tirer les conséquences (L. 1322-1) et qui prive l'employeur de toute échelle de sanctions opposable");

    const licenciement = q.connu && q.licenciement;
    const cadre = licenciement
      ? "La mesure auditée étant un licenciement, sa contestation ne relève pas du chapitre III du titre III du livre III mais des règles du licenciement : « Lorsque la sanction contestée est un licenciement les dispositions du présent chapitre ne sont pas applicables. Dans ce cas, le conseil de prud'hommes applique les dispositions relatives à la contestation des irrégularités de licenciement » (L. 1333-3)."
      : "En cas de litige, le conseil de prud'hommes apprécie la régularité de la procédure suivie et si les faits reprochés sont de nature à justifier une sanction ; l'employeur lui fournit les éléments retenus, et si un doute subsiste, il profite au salarié (L. 1333-1). Le conseil peut annuler une sanction irrégulière en la forme, injustifiée ou disproportionnée à la faute commise (L. 1333-2).";

    const mandat = s.salarieProtege;
    const protecteur = dit(mandat)
      ? " Le salarié est déclaré titulaire d'un mandat : le statut protecteur s'ajoute alors à tout ce qui précède — ce module ne l'audite pas et n'en tire aucune conclusion ; faites vérifier la procédure spéciale applicable avant toute décision."
      : (vide(mandat) ? " Il n'est pas indiqué si le salarié est titulaire d'un mandat représentatif ou syndical : si c'est le cas, un statut protecteur s'ajoute, que ce module n'audite pas." : "");

    if (griefs.length)
      return { etat: NC, motif: `L'exposition est constituée en l'état du dossier : ${griefs.join(" ; ")}. ${cadre}${protecteur}` };
    if (vide(s.auditee) || !q.connu)
      return { etat: MANQ, motif: "La sanction auditée n'est pas décrite : l'exposition ne peut pas être appréciée." + protecteur };
    return { etat: RISQ, motif: `Aucun des manquements que ce module mesure n'est constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : la réalité des faits, leur caractère fautif et la proportionnalité de la sanction s'apprécient au fond, et ce questionnaire ne les touche pas. ${cadre}${protecteur} Ce contrôle ne prononce jamais un blanc-seing.` };
  });

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["DIS-CTL-EXP-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE, ARRETS };
