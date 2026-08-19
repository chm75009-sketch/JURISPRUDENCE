/* Les contrôles de la santé, de la sécurité et des conditions de travail,
   côté employeur.

   L'objet du module : vérifier que l'évaluation des risques existe, vit et
   produit ses suites (document unique, programme ou liste d'actions), que la
   commission santé, sécurité et conditions de travail est en place là où elle
   est due, que les obligations de prévention du harcèlement sont tenues — et
   mesurer ce à quoi l'employeur s'expose quand elles ne le sont pas.

   Ce qui ne se contrôle pas, et qu'il faut dire ici : la SUFFISANCE des
   mesures de prévention s'apprécie au fond, pas sur une case cochée. Quand des
   mesures existent, le contrôle le constate ; il ne dit jamais qu'elles
   suffisent. Et le contrôle d'exposition (SST-CTL-PEN-01) ne rend JAMAIS
   « conforme » : l'obligation de sécurité s'apprécie en continu, un
   blanc-seing serait faux.

   Cinq états, comme partout dans le dépôt : conforme, non conforme, risque à
   vérifier, donnée manquante, sans objet. Une donnée non renseignée ne produit
   jamais « conforme ». */
const M = require("./moteur-sst.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------ le document unique */

ctl("SST-CTL-DUERP-01", "Document unique",
  "Les risques ont-ils été évalués et transcrits dans un document unique ?",
  ["L. 4121-1", "L. 4121-3", "L. 4121-3-1", "R. 4121-1"],
  f => {
    const du = f.duerp || {};
    if (vide(du.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un document unique d'évaluation des risques professionnels existe. L'évaluation des risques et sa transcription sont dues par tout employeur, sans seuil d'effectif (L. 4121-3, R. 4121-1)." };
    if (nie(du.existe)) return { etat: NC, motif: "Aucun document unique d'évaluation des risques professionnels : l'employeur doit évaluer les risques (L. 4121-3) et en transcrire les résultats dans un document unique (R. 4121-1), qui répertorie l'ensemble des risques et assure la traçabilité collective des expositions (L. 4121-3-1, I). L'absence de transcription est punie de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1)." };
    return { etat: CONF, motif: "Un document unique d'évaluation des risques professionnels existe : la transcription exigée par R. 4121-1 est faite. Son contenu, sa mise à jour et ses suites sont contrôlés par ailleurs." };
  });

ctl("SST-CTL-DUERP-02", "Document unique",
  "L'évaluation comporte-t-elle un inventaire des risques par unité de travail ?",
  ["R. 4121-1"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : son contenu n'a pas d'objet — l'absence du document, elle, est constatée par SST-CTL-DUERP-01." };
    if (vide(du.existe) || vide(du.unitesTravail)) return { etat: MANQ, motif: "Il n'est pas indiqué si l'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail de l'entreprise ou de l'établissement, comme R. 4121-1 l'impose." };
    if (nie(du.unitesTravail)) return { etat: NC, motif: "Le document unique ne comporte pas d'inventaire des risques par unité de travail : R. 4121-1 impose que l'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail, y compris ceux liés aux ambiances thermiques." };
    return { etat: CONF, motif: "L'évaluation comporte un inventaire des risques par unité de travail, conformément à R. 4121-1." };
  });

ctl("SST-CTL-DUERP-03", "Document unique",
  "Le document unique a-t-il été mis à jour dans l'année (entreprises d'au moins onze salariés) ?",
  ["R. 4121-2, 1°", "L. 4121-3, dernier alinéa"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa mise à jour n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUERP-01." };
    const m = M.majDuerp(f);
    if (!m.effectif.connu) return { etat: MANQ, motif: m.effectif.motif };
    if (m.etat === "date de mise à jour non renseignée")
      return { etat: MANQ, motif: "La date de la dernière mise à jour du document unique n'est pas renseignée. À partir de onze salariés, la mise à jour est au moins annuelle (R. 4121-2, 1°) ; si le document n'a réellement jamais été mis à jour, le manquement est constitué, et il est puni de l'amende des contraventions de la cinquième classe (R. 4741-1)." };
    if (m.etat === "dates inexploitables") return { etat: MANQ, motif: m.motif };
    if (!m.annuelleDue) {
      if (m.etat === "plus d'un an")
        return { etat: RISQ, motif: `Dernière mise à jour il y a environ ${m.moisEcoules} mois. Dans les entreprises de moins de onze salariés, la mise à jour peut être moins fréquente qu'annuelle, sous réserve que soit garanti un niveau équivalent de protection (L. 4121-3, dernier alinéa) — et elle reste due lors de tout aménagement important ou de toute information nouvelle (R. 4121-2). Cette garantie s'apprécie au fond : documentez-la.` };
      return { etat: CONF, motif: `Dernière mise à jour il y a environ ${m.moisEcoules} mois : moins d'un an au ${f.dateAudit}.` };
    }
    if (m.etat === "plus d'un an")
      return { etat: NC, motif: `Dernière mise à jour du document unique le ${(f.duerp || {}).dateDerniereMaj}, soit environ ${m.moisEcoules} mois au ${f.dateAudit} : dans une entreprise d'au moins onze salariés, la mise à jour est au moins annuelle (R. 4121-2, 1°). Le défaut de mise à jour est puni de l'amende des contraventions de la cinquième classe (R. 4741-1).` };
    return { etat: CONF, motif: `Dernière mise à jour il y a environ ${m.moisEcoules} mois : la périodicité annuelle de R. 4121-2, 1°, est tenue au ${f.dateAudit}.` };
  });

ctl("SST-CTL-DUERP-04", "Document unique",
  "Le document unique a-t-il été mis à jour lors du dernier aménagement important ou de la dernière information nouvelle ?",
  ["R. 4121-2, 2° et 3°"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa mise à jour n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUERP-01." };
    const ev = f.evenement || {};
    if (vide(ev.survenu)) return { etat: MANQ, motif: "Il n'est pas indiqué si, depuis la dernière mise à jour, est survenu un aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, ou si une information supplémentaire intéressant l'évaluation d'un risque a été portée à la connaissance de l'employeur (R. 4121-2, 2° et 3°)." };
    if (nie(ev.survenu)) return { etat: CONF, motif: "Aucun aménagement important ni information nouvelle déclarés depuis la dernière mise à jour : les cas de mise à jour de R. 4121-2, 2° et 3°, ne se sont pas présentés." };
    if (vide(ev.majFaite)) return { etat: MANQ, motif: "Un aménagement important ou une information nouvelle est déclaré, mais il n'est pas dit si le document unique a été mis à jour en conséquence (R. 4121-2, 2° et 3°)." };
    if (nie(ev.majFaite)) return { etat: NC, motif: "Un aménagement important ou une information nouvelle est survenu sans mise à jour du document unique : R. 4121-2 impose la mise à jour lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur. Ce défaut est puni de l'amende des contraventions de la cinquième classe (R. 4741-1)." };
    return { etat: CONF, motif: "Le document unique a été mis à jour à la suite de l'aménagement important ou de l'information nouvelle déclarés, conformément à R. 4121-2." };
  });

ctl("SST-CTL-DUERP-05", "Suites de l'évaluation",
  "Les résultats de l'évaluation débouchent-ils sur ce que le seuil de cinquante salariés commande — programme annuel de prévention, ou liste d'actions consignée ?",
  ["L. 4121-3-1, III", "L. 2312-27, 2°"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : ses suites n'ont pas d'objet — l'absence du document est constatée par SST-CTL-DUERP-01." };
    const s = M.suitesEvaluation(f);
    if (!s.connu) return { etat: MANQ, motif: s.motif };
    const su = f.suites || {};
    if (s.regime === "programme annuel") {
      const p = su.programmeAnnuel || {};
      if (vide(p.existe)) return { etat: MANQ, motif: "Effectif d'au moins cinquante salariés : il n'est pas indiqué si un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail a été établi (L. 4121-3-1, III, 1°)." };
      if (nie(p.existe)) return { etat: NC, motif: s.motif + " Ce programme n'est pas établi : le manquement est constitué." };
      const cse = f.cse || {};
      if (vide(cse.existe))
        return { etat: MANQ, motif: "Le programme annuel existe, mais il n'est pas indiqué si un comité social et économique existe : le programme lui est présenté dans le cadre de la consultation sur la politique sociale (L. 2312-27, 2°)." };
      if (dit(cse.existe) && vide(p.presenteCSE))
        return { etat: MANQ, motif: "Le programme annuel existe, mais il n'est pas indiqué s'il est présenté au comité social et économique (L. 2312-27, 2°)." };
      if (dit(cse.existe) && nie(p.presenteCSE))
        return { etat: NC, motif: "Le programme annuel de prévention existe, mais il n'est pas présenté au comité social et économique dans le cadre de la consultation sur la politique sociale, comme L. 2312-27, 2°, l'impose — le comité peut proposer un ordre de priorité et des mesures supplémentaires." };
      return { etat: CONF, motif: "Effectif d'au moins cinquante salariés et programme annuel de prévention établi" + (dit(cse.existe) ? ", présenté au comité social et économique (L. 2312-27, 2°)" : "") + " : L. 4121-3-1, III, 1°, est respecté." };
    }
    const l = su.listeActions || {};
    if (vide(l.consignee)) return { etat: MANQ, motif: "Effectif de moins de cinquante salariés : il n'est pas indiqué si la liste des actions de prévention et de protection est consignée dans le document unique et ses mises à jour (L. 4121-3-1, III, 2°)." };
    if (nie(l.consignee)) return { etat: NC, motif: s.motif + " Cette liste n'est pas consignée : le manquement est constitué." };
    return { etat: CONF, motif: "Effectif de moins de cinquante salariés et liste d'actions de prévention consignée dans le document unique : L. 4121-3-1, III, 2°, est respecté." };
  });

ctl("SST-CTL-DUERP-06", "Document unique",
  "Les versions successives sont-elles conservées, et l'avis sur les modalités d'accès est-il affiché ?",
  ["L. 4121-3-1, V", "R. 4121-4"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa conservation n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUERP-01." };
    if (vide(du.existe) || vide(du.versionsConservees) || vide(du.avisAffiche))
      return { etat: MANQ, motif: "Il n'est pas indiqué si les versions successives du document unique sont conservées (quarante ans au moins — L. 4121-3-1, V ; R. 4121-4) et si un avis indiquant les modalités d'accès des travailleurs au document est affiché à une place convenable et aisément accessible (R. 4121-4, dernier alinéa)." };
    const griefs = [];
    if (nie(du.versionsConservees)) griefs.push("les versions successives ne sont pas conservées, alors qu'elles doivent l'être pendant quarante ans au moins et rester tenues à la disposition des travailleurs, des anciens travailleurs, des membres de la délégation du personnel du comité, du service de prévention et de santé au travail et des agents de contrôle (L. 4121-3-1, V ; R. 4121-4)");
    if (nie(du.avisAffiche)) griefs.push("l'avis indiquant les modalités d'accès des travailleurs au document unique n'est pas affiché à une place convenable et aisément accessible — au même emplacement que le règlement intérieur lorsqu'il en existe un (R. 4121-4, dernier alinéa)");
    if (griefs.length) return { etat: NC, motif: griefs.join(" ; ") + "." };
    return { etat: CONF, motif: "Versions successives conservées et avis d'accès affiché : L. 4121-3-1, V, et R. 4121-4 sont respectés en l'état déclaré." };
  });

ctl("SST-CTL-DUERP-07", "Document unique",
  "Le comité social et économique est-il consulté sur le document unique et sur ses mises à jour ?",
  ["L. 4121-3, 1°"],
  f => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe dans l'entreprise : la consultation de L. 4121-3, 1°, ne peut pas être contrôlée." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique déclaré : la consultation sur le document unique (L. 4121-3, 1°) n'a pas d'objet ici — la régularité de cette absence relève du module « comité social et économique » de l'application." };
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa consultation n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUERP-01." };
    if (vide(du.consultationCSE)) return { etat: MANQ, motif: "Il n'est pas indiqué si le comité social et économique est consulté sur le document unique et sur ses mises à jour, comme L. 4121-3, 1°, l'impose." };
    if (nie(du.consultationCSE)) return { etat: NC, motif: "Le comité social et économique n'est pas consulté sur le document unique et ses mises à jour : L. 4121-3, 1°, l'impose — le comité et sa commission santé, sécurité et conditions de travail, s'ils existent, apportent leur contribution à l'évaluation des risques." };
    return { etat: CONF, motif: "Le comité social et économique est consulté sur le document unique et ses mises à jour, conformément à L. 4121-3, 1°." };
  });

ctl("SST-CTL-DUERP-08", "Document unique",
  "Le document unique est-il transmis au service de prévention et de santé au travail à chaque mise à jour ?",
  ["L. 4121-3-1, VI"],
  f => {
    const du = f.duerp || {};
    if (nie(du.existe)) return { etat: SO, motif: "Le document unique n'existe pas : sa transmission n'a pas d'objet — l'absence du document est constatée par SST-CTL-DUERP-01." };
    if (vide(du.existe) || vide(du.transmisSPST)) return { etat: MANQ, motif: "Il n'est pas indiqué si le document unique est transmis, à chaque mise à jour, au service de prévention et de santé au travail auquel l'employeur adhère (L. 4121-3-1, VI)." };
    if (nie(du.transmisSPST)) return { etat: NC, motif: "Le document unique n'est pas transmis au service de prévention et de santé au travail à chaque mise à jour : L. 4121-3-1, VI, l'impose." };
    return { etat: CONF, motif: "Le document unique est transmis au service de prévention et de santé au travail à chaque mise à jour, conformément à L. 4121-3-1, VI." };
  });

/* ----------------------------------------------------------------- la CSSCT */

ctl("SST-CTL-CSSCT-01", "Commission santé, sécurité et conditions de travail",
  "La commission santé, sécurité et conditions de travail est-elle créée là où elle est due ?",
  ["L. 2315-36", "L. 2315-37", "L. 2315-43"],
  f => {
    const d = M.cssctDue(f);
    if (d.due === null) return { etat: MANQ, motif: d.motif };
    if (d.due === false) return { etat: SO, motif: d.motif };
    const c = f.cssct || {};
    if (vide(c.existe)) return { etat: MANQ, motif: d.motif + " Il n'est pas indiqué si elle est effectivement créée." };
    if (nie(c.existe)) return { etat: NC, motif: d.motif + " Elle n'est pas créée : le manquement est constitué." };
    return { etat: CONF, motif: d.motif + " Elle est créée." };
  });

/* Le garde des contrôles qui portent sur une commission : sans commission,
   rien ne se contrôle d'elle — son absence, elle, relève de SST-CTL-CSSCT-01. */
function siCommission(f, suite) {
  const c = f.cssct || {};
  if (vide(c.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si une commission santé, sécurité et conditions de travail existe." };
  if (nie(c.existe)) return { etat: SO, motif: "Aucune commission santé, sécurité et conditions de travail : ce contrôle n'a pas d'objet — l'obligation de la créer, elle, est contrôlée par SST-CTL-CSSCT-01." };
  return suite(c);
}

ctl("SST-CTL-CSSCT-02", "Commission santé, sécurité et conditions de travail",
  "La composition de la commission respecte-t-elle L. 2315-39 — présidence, trois membres au moins dont un du second collège, désignation par le comité ?",
  ["L. 2315-39"],
  f => siCommission(f, c => {
    if (vide(c.presideeEmployeur) && vide(c.nbMembres) && vide(c.membreSecondCollege) && vide(c.designesParCSE))
      return { etat: MANQ, motif: "La composition de la commission n'est pas décrite : L. 2315-39 impose la présidence par l'employeur ou son représentant, au minimum trois membres représentants du personnel dont au moins un du second collège (ou du troisième), désignés par le comité parmi ses membres." };
    const griefs = [], manques = [];
    if (vide(c.presideeEmployeur)) manques.push("la présidence"); else if (nie(c.presideeEmployeur)) griefs.push("la commission n'est pas présidée par l'employeur ou son représentant");
    const n = typeof c.nbMembres === "number" ? c.nbMembres : (c.nbMembres ? Number(c.nbMembres) : null);
    if (n === null || !isFinite(n)) manques.push("le nombre de membres"); else if (n < 3) griefs.push(`elle ne comprend que ${n} membre(s) représentant(s) du personnel, pour trois au minimum`);
    if (vide(c.membreSecondCollege)) manques.push("la présence d'un membre du second collège"); else if (nie(c.membreSecondCollege)) griefs.push("aucun membre du second collège (ou, le cas échéant, du troisième) n'y siège");
    if (vide(c.designesParCSE)) manques.push("le mode de désignation"); else if (nie(c.designesParCSE)) griefs.push("ses membres ne sont pas désignés par le comité parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32");
    if (griefs.length) return { etat: NC, motif: `La composition de la commission ne respecte pas L. 2315-39 : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `La composition de la commission est incomplètement décrite — il manque : ${manques.join(" ; ")} (L. 2315-39).` };
    return { etat: CONF, motif: "Présidence par l'employeur ou son représentant, au moins trois membres dont un du second collège, désignés par le comité parmi ses membres : la composition respecte L. 2315-39." };
  }));

const MODALITES_CSSCT = ["accord d'entreprise", "accord avec le comité", "règlement intérieur"];
ctl("SST-CTL-CSSCT-03", "Commission santé, sécurité et conditions de travail",
  "Les modalités de mise en place et de fonctionnement de la commission sont-elles fixées — accord d'entreprise, accord avec le comité, ou règlement intérieur à défaut ?",
  ["L. 2315-41", "L. 2315-42", "L. 2315-44"],
  f => siCommission(f, c => {
    if (vide(f.cssct.modalitesFixees)) return { etat: MANQ, motif: "Il n'est pas indiqué ce qui fixe les modalités de la commission — nombre de membres, missions déléguées, fonctionnement, heures de délégation, formation, moyens (L. 2315-41) : un accord d'entreprise (L. 2315-41), un accord entre l'employeur et le comité en l'absence de délégué syndical (L. 2315-42), ou, à défaut d'accord, le règlement intérieur du comité (L. 2315-44)." };
    if (f.cssct.modalitesFixees === "aucune") return { etat: NC, motif: "Rien ne fixe les modalités de la commission : à défaut d'accord d'entreprise (L. 2315-41) ou d'accord avec le comité (L. 2315-42), c'est le règlement intérieur du comité qui doit définir le nombre de membres, les missions déléguées, les modalités de fonctionnement, les heures de délégation, la formation et, le cas échéant, les moyens (L. 2315-44). Une commission sans règles écrites ne permet d'établir ni ses missions ni ses moyens." };
    if (!MODALITES_CSSCT.includes(f.cssct.modalitesFixees)) return { etat: MANQ, motif: `La source des modalités déclarée (« ${f.cssct.modalitesFixees} ») n'est pas reconnue : répondez « accord d'entreprise », « accord avec le comité », « règlement intérieur » — ou « aucune ».` };
    return { etat: CONF, motif: `Les modalités de la commission sont fixées par ${f.cssct.modalitesFixees === "règlement intérieur" ? "le règlement intérieur du comité (L. 2315-44)" : f.cssct.modalitesFixees === "accord avec le comité" ? "un accord entre l'employeur et le comité, adopté à la majorité des membres titulaires (L. 2315-42)" : "un accord d'entreprise (L. 2315-41)"}.` };
  }));

ctl("SST-CTL-CSSCT-04", "Commission santé, sécurité et conditions de travail",
  "La délégation confiée à la commission respecte-t-elle ses limites — jamais le recours à l'expert ni les attributions consultatives du comité ?",
  ["L. 2315-38"],
  f => siCommission(f, c => {
    if (vide(c.delegationConforme)) return { etat: MANQ, motif: "Il n'est pas indiqué si la délégation confiée à la commission exclut le recours à un expert et les attributions consultatives du comité, que L. 2315-38 interdit de déléguer." };
    if (nie(c.delegationConforme)) return { etat: NC, motif: "La délégation confiée à la commission empiète sur ce que L. 2315-38 interdit de déléguer : le recours à un expert et les attributions consultatives restent au comité social et économique lui-même. Une consultation rendue par la seule commission serait irrégulière." };
    return { etat: CONF, motif: "La délégation confiée à la commission exclut le recours à l'expert et les attributions consultatives du comité, conformément à L. 2315-38." };
  }));

ctl("SST-CTL-CSSCT-05", "Commission santé, sécurité et conditions de travail",
  "Les élus bénéficient-ils de la formation santé, sécurité et conditions de travail — cinq jours au premier mandat, trois au renouvellement, cinq pour la commission à partir de trois cents salariés ?",
  ["L. 2315-18"],
  f => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe : la formation de L. 2315-18 bénéficie aux membres de la délégation du personnel et au référent harcèlement du comité." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique déclaré : la formation de ses membres n'a pas d'objet ici — la régularité de cette absence relève du module « comité social et économique »." };
    if (vide(f.formationSSCT)) return { etat: MANQ, motif: "Il n'est pas indiqué si les membres de la délégation du personnel et le référent harcèlement du comité ont bénéficié de la formation nécessaire à leurs missions en santé, sécurité et conditions de travail (L. 2315-18) — cinq jours au moins au premier mandat, trois jours au renouvellement, cinq jours pour les membres de la commission dans les entreprises d'au moins trois cents salariés. Son financement est pris en charge par l'employeur." };
    if (nie(f.formationSSCT)) return { etat: NC, motif: "Les membres de la délégation du personnel n'ont pas bénéficié de la formation santé, sécurité et conditions de travail : L. 2315-18 l'impose — cinq jours au moins au premier mandat, trois jours au renouvellement (cinq pour les membres de la commission dans les entreprises d'au moins trois cents salariés), financée par l'employeur." };
    return { etat: CONF, motif: "La formation santé, sécurité et conditions de travail des élus est assurée, conformément à L. 2315-18." };
  });

/* ------------------------------------------------------------ le harcèlement */

ctl("SST-CTL-HAR-01", "Harcèlement",
  "Le référent employeur « harcèlement sexuel et agissements sexistes » est-il désigné (entreprises d'au moins deux cent cinquante salariés) ?",
  ["L. 1153-5-1"],
  f => {
    const d = M.referentEmployeurDu(f);
    if (d.du === null) return { etat: MANQ, motif: d.motif };
    if (d.du === false) return { etat: SO, motif: d.motif };
    if (vide(f.referentEmployeur)) return { etat: MANQ, motif: d.motif + " Il n'est pas indiqué s'il est désigné." };
    if (nie(f.referentEmployeur)) return { etat: NC, motif: d.motif + " Il n'est pas désigné : le manquement est constitué, et les coordonnées de ce référent font partie de l'information obligatoire de D. 1151-1." };
    return { etat: CONF, motif: d.motif + " Il est désigné." };
  });

ctl("SST-CTL-HAR-02", "Harcèlement",
  "Le référent harcèlement du comité social et économique est-il désigné ?",
  ["L. 2314-1"],
  f => {
    const cse = f.cse || {};
    if (vide(cse.existe)) return { etat: MANQ, motif: "Il n'est pas indiqué si un comité social et économique existe : le référent de L. 2314-1 est désigné par le comité parmi ses membres." };
    if (nie(cse.existe)) return { etat: SO, motif: "Aucun comité social et économique déclaré : le référent de L. 2314-1 n'a pas d'objet ici — la régularité de cette absence relève du module « comité social et économique »." };
    if (vide(f.referentCSE)) return { etat: MANQ, motif: "Il n'est pas indiqué si le comité a désigné, parmi ses membres, un référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes (L. 2314-1, dernier alinéa)." };
    if (nie(f.referentCSE)) return { etat: NC, motif: "Aucun référent harcèlement n'est désigné au sein du comité : L. 2314-1 impose sa désignation par le comité, parmi ses membres, par une résolution adoptée selon les modalités de L. 2315-32, pour la durée du mandat. La désignation appartient au comité — mais ses coordonnées font partie de l'information que l'employeur doit délivrer (D. 1151-1, 5°) : invitez le comité à y procéder et consignez la démarche." };
    return { etat: CONF, motif: "Le référent harcèlement du comité est désigné, conformément à L. 2314-1." };
  });

ctl("SST-CTL-HAR-03", "Harcèlement",
  "L'information obligatoire est-elle délivrée — textes pénaux, actions ouvertes, coordonnées des autorités et des référents ?",
  ["L. 1152-4", "L. 1153-5", "D. 1151-1"],
  f => {
    if (vide(f.infoHarcelementMoral) && vide(f.infoHarcelementSexuel) && vide(f.infoCoordonnees))
      return { etat: MANQ, motif: "Rien n'est renseigné sur l'information délivrée : L. 1152-4 impose d'informer par tout moyen du texte de l'article 222-33-2 du code pénal (harcèlement moral) ; L. 1153-5 impose, dans les lieux de travail et les locaux d'embauche, l'information sur le texte de l'article 222-33 du code pénal, sur les actions contentieuses civiles et pénales ouvertes et sur les coordonnées des autorités et services compétents, dont la liste est fixée par D. 1151-1." };
    const griefs = [], manques = [];
    const point = (champ, grief, manque) => { if (vide(champ)) manques.push(manque); else if (nie(champ)) griefs.push(grief); };
    point(f.infoHarcelementMoral, "le texte de l'article 222-33-2 du code pénal (harcèlement moral) n'est pas porté à la connaissance des personnes de L. 1152-2, comme L. 1152-4 l'impose", "l'information sur le harcèlement moral (L. 1152-4)");
    point(f.infoHarcelementSexuel, "le texte de l'article 222-33 du code pénal et les actions contentieuses ouvertes ne sont pas affichés ou diffusés dans les lieux de travail et les locaux d'embauche, comme L. 1153-5 l'impose", "l'information sur le harcèlement sexuel (L. 1153-5)");
    point(f.infoCoordonnees, "les coordonnées exigées par D. 1151-1 ne sont pas délivrées : médecin du travail ou service de prévention et de santé au travail, inspection du travail et nom de l'inspecteur, Défenseur des droits, référent employeur à partir de deux cent cinquante salariés, référent du comité s'il existe", "les coordonnées des autorités et services compétents (D. 1151-1)");
    if (griefs.length) return { etat: NC, motif: `L'information obligatoire n'est pas délivrée : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `L'information est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: CONF, motif: "Textes pénaux, actions ouvertes et coordonnées des autorités et des référents sont portés à la connaissance des salariés et des candidats : L. 1152-4, L. 1153-5 et D. 1151-1 sont respectés en l'état déclaré." };
  });

ctl("SST-CTL-HAR-04", "Harcèlement",
  "La prévention du harcèlement est-elle organisée — risques intégrés à l'évaluation, dispositions de prévention prises ?",
  ["L. 1152-4", "L. 1153-5", "L. 4121-2, 7°"],
  f => {
    if (vide(f.risquesHarcelementEvalues) && vide(f.mesuresPreventionHarcelement))
      return { etat: MANQ, motif: "Rien n'est renseigné sur la prévention du harcèlement : l'employeur prend toutes dispositions nécessaires en vue de prévenir les agissements de harcèlement moral (L. 1152-4) et les faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner (L. 1153-5) ; la planification de la prévention intègre les risques liés aux harcèlements et aux agissements sexistes (L. 4121-2, 7°)." };
    const griefs = [], manques = [];
    if (vide(f.risquesHarcelementEvalues)) manques.push("l'intégration des risques de harcèlement à l'évaluation des risques");
    else if (nie(f.risquesHarcelementEvalues)) griefs.push("les risques liés au harcèlement moral, au harcèlement sexuel et aux agissements sexistes ne sont pas intégrés à la planification de la prévention, alors que L. 4121-2, 7°, l'impose expressément");
    if (vide(f.mesuresPreventionHarcelement)) manques.push("les dispositions de prévention prises");
    else if (nie(f.mesuresPreventionHarcelement)) griefs.push("aucune disposition de prévention n'est prise, alors que L. 1152-4 et L. 1153-5 imposent à l'employeur de prendre toutes dispositions nécessaires");
    if (griefs.length) return { etat: NC, motif: `La prévention du harcèlement n'est pas organisée : ${griefs.join(" ; ")}.` };
    if (manques.length) return { etat: MANQ, motif: `La prévention du harcèlement est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: RISQ, motif: "Des dispositions de prévention existent et les risques de harcèlement sont intégrés à l'évaluation. Leur suffisance s'apprécie au fond — ce contrôle constate l'existence des mesures, il ne dit jamais qu'elles suffisent : documentez leur contenu et leur mise en œuvre effective." };
  });

ctl("SST-CTL-HAR-05", "Harcèlement",
  "Un signalement de harcèlement a-t-il été suivi d'une réaction — enquête, mesures pour y mettre un terme ?",
  ["L. 1153-5", "L. 4121-1"],
  f => {
    const s = f.signalement || {};
    if (vide(s.recu)) return { etat: MANQ, motif: "Il n'est pas indiqué si un signalement de harcèlement moral ou sexuel a été reçu. La question conditionne l'obligation de réaction : l'employeur doit y mettre un terme et le sanctionner (L. 1153-5), au titre de son obligation de sécurité (L. 4121-1)." };
    if (nie(s.recu)) return { etat: SO, motif: "Aucun signalement de harcèlement déclaré : l'obligation de réaction n'a pas d'objet — la prévention, elle, est contrôlée par ailleurs." };
    const griefs = [], manques = [];
    if (vide(s.enqueteMenee)) manques.push("la conduite d'une enquête");
    else if (nie(s.enqueteMenee)) griefs.push("aucune enquête n'a été menée sur le signalement");
    if (vide(s.mesuresPrises)) manques.push("les mesures prises");
    else if (nie(s.mesuresPrises)) griefs.push("aucune mesure n'a été prise pour mettre un terme aux faits signalés");
    if (griefs.length) return { etat: NC, motif: `Un signalement de harcèlement est resté sans réaction : ${griefs.join(" ; ")}. L. 1153-5 impose de prévenir les faits, d'y mettre un terme et de les sanctionner, et L. 4121-1 impose à l'employeur de prendre les mesures nécessaires pour protéger la santé physique et mentale des travailleurs.` };
    if (manques.length) return { etat: MANQ, motif: `La réaction au signalement est incomplètement décrite — il manque : ${manques.join(" ; ")}.` };
    return { etat: RISQ, motif: "Le signalement a été suivi d'une enquête et de mesures. Leur qualité s'apprécie au fond : la valeur probante d'une enquête interne relève de l'appréciation souveraine des juges du fond, au regard le cas échéant des autres éléments de preuve (Soc., 18 juin 2025, n° 23-19.022, publié). Conservez le dossier d'enquête — saisine, auditions, rapport, suites." };
  });

/* ------------------------------------------------------------- l'exposition */

ctl("SST-CTL-PEN-01", "Exposition aux sanctions",
  "À quoi l'employeur s'expose-t-il en l'état du dossier ?",
  ["R. 4741-1", "L. 4741-1", "L. 1155-2"],
  f => {
    const du = f.duerp || {};
    const griefs = [];
    if (nie(du.existe)) griefs.push("l'absence de document unique — le défaut de transcription de l'évaluation des risques est puni de l'amende prévue pour les contraventions de la cinquième classe (R. 4741-1)");
    const m = M.majDuerp(f);
    if (dit(du.existe) && m.annuelleDue === true && m.etat === "plus d'un an")
      griefs.push("le défaut de mise à jour du document unique — puni de la même amende (R. 4741-1)");
    const ev = f.evenement || {};
    if (dit(ev.survenu) && nie(ev.majFaite))
      griefs.push("l'absence de mise à jour après un aménagement important ou une information nouvelle (R. 4121-2 ; R. 4741-1)");
    const s = f.signalement || {};
    if (dit(s.recu) && (nie(s.enqueteMenee) || nie(s.mesuresPrises)))
      griefs.push("un signalement de harcèlement resté sans réaction — outre la responsabilité civile de l'employeur au titre de son obligation de sécurité (L. 4121-1), les discriminations commises à la suite d'un harcèlement sont punies d'un an d'emprisonnement et de 3 750 € d'amende (L. 1155-2)");
    if (griefs.length)
      return { etat: NC, motif: `L'exposition est constituée en l'état du dossier : ${griefs.join(" ; ")}. S'y ajoute, pour les règles techniques de santé et de sécurité qu'il énumère, l'article L. 4741-1 — 10 000 € d'amende, appliqués autant de fois qu'il y a de travailleurs concernés, et 30 000 € avec un an d'emprisonnement en récidive.` };
    if (vide(du.existe) || !m.effectif.connu)
      return { etat: MANQ, motif: "L'existence du document unique ou l'effectif ne sont pas renseignés : l'exposition ne peut pas être appréciée." };
    return { etat: RISQ, motif: "Aucun des manquements que ce module mesure n'est constaté en l'état du dossier. L'exposition n'est pas nulle pour autant : l'obligation de sécurité de L. 4121-1 s'apprécie en continu et au fond, l'amende de L. 4741-1 sanctionne les règles techniques qu'il énumère (10 000 € par travailleur concerné), et les suites d'un harcèlement peuvent tomber sous L. 1155-2. Ce contrôle ne prononce jamais un blanc-seing." };
  });

/* Les contrôles qui, par construction, ne rendent jamais « conforme ». */
const DETECTION = ["SST-CTL-PEN-01"];
/* Les contrôles de cohérence interne du dossier. */
const COHERENCE = [];

module.exports = { C, ETATS, DETECTION, COHERENCE, MODALITES_CSSCT };
