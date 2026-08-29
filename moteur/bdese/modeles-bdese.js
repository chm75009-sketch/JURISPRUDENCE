/* Les modèles de régularisation — étape 5 du parcours client.

   Chaque contrôle qui n'est pas conforme a droit à mieux qu'un rappel de
   texte : une note concrète, écrite avec les chiffres du dossier — l'effectif
   déclaré, le régime retenu, les thèmes réellement absents de la base, les
   dates calculées à partir de celles que le client a saisies. Rien n'est une
   coquille générique : quand une donnée manque pour calculer, la note le dit
   et affiche un exemple marqué « [exemple] », jamais une valeur inventée
   présentée comme la sienne.

   Chaque fonction reçoit le même dossier `f` que les contrôles et le moteur
   de régime — celui que `profil-entreprise` et le questionnaire de l'étape 2
   composent ensemble — et rend un classeur de pièces (moteur/commun/outils.js) :
   la même fabrique que le rapport d'audit et l'export Word, pour que ce
   modèle s'imprime et s'exporte exactement comme le reste du module.

   Aucun contrôle ne cite ici un article qui n'a pas été lu à la source :
   les seuls chiffres cités (11, 50, 300, 1 an, 3 ans, 1/2/3 mois) sont ceux
   déjà portés par regime-bdese.js et controles-bdese.js, jamais réécrits. */
const O = require("./outils.js");
const R = require("./regime-bdese.js");
const CONTENU = require("./contenu-bdese.js");
const PL = require("./plancher-bdese.js");

const nb = x => (typeof x === "number" && isFinite(x) ? x : (x !== undefined && x !== null && x !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const q = x => (x !== undefined && x !== null && String(x).trim() !== "" ? String(x).trim() : null);
const ex = v => v + " [exemple]";

const nomE = f => q(f.entreprise) || "l'entreprise auditée";
const eff = f => nb(f.effectif);
const effTxte = f => eff(f) === null ? ex("120") : String(eff(f));
const jour0 = f => /^\d{4}-\d{2}-\d{2}$/.test(String(f.dateAudit || "")) ? f.dateAudit
  : new Date().toISOString().slice(0, 10);
const declares = f => Array.isArray((f.base || {}).themes)
  ? f.base.themes.map(x => String((x && x.theme) || x)) : [];

/* ─────────────────────────────── BDESE-CTL-REG-01 et REG-02 : le régime ─── */

function modeleRegime(f, rectificatif) {
  const A = O(); const { t1, h1, h2, p, puce, note, tab } = A;
  t1((rectificatif ? "Note de régime rectificative" : "Note de régime") + " — " + nomE(f));
  const reg = R.regime(f);
  h1("Ce que dit le dossier, aujourd'hui");
  p(reg.motif);
  h2("L'effectif retenu");
  puce(`Effectif déclaré : ${effTxte(f)} salarié(s)${eff(f) === null ? " — donnée absente, exemple posé pour illustrer le calcul" : ""}.`);
  puce(`Seuil de trois cents salariés : ${eff(f) === null ? "indéterminé, faute d'effectif"
    : eff(f) >= 300 ? "franchi — c'est R. 2312-9 qui s'applique à défaut d'accord" : "non atteint — c'est R. 2312-8 qui s'applique à défaut d'accord"}.`);
  h2("Les pièces à joindre pour clore ce point");
  if (dit(f.accordEntreprise)) puce("L'accord d'entreprise lui-même, signé et daté — c'est son texte, non son résumé, qui fixe la grille.");
  else if (dit(f.accordBranche)) puce("L'accord de branche lui-même, signé et daté, et la preuve que l'entreprise entre dans son champ.");
  else puce("Aucune pièce d'accord à joindre : à défaut d'accord, c'est le décret qui s'applique — " + (eff(f) === null ? "R. 2312-8 ou R. 2312-9 selon l'effectif à confirmer." : (eff(f) >= 300 ? "R. 2312-9." : "R. 2312-8.")));
  note("Cette note reprend le dossier tel qu'il est saisi à ce jour : elle se recalcule à chaque modification du questionnaire de l'étape 2.");
  return A.D;
}

/* ─────────────────────────────────── BDESE-CTL-DAT-01 et DAT-02 : dates ─── */

function modeleDates(f) {
  const A = O(); const { t1, h1, h2, p, puce, note } = A;
  t1("Note d'exigibilité — " + nomE(f));
  const exi = R.exigibilite(f);
  h1("Le point de départ des attributions récurrentes (L. 2312-2)");
  if (exi.attributions) {
    p(exi.attributions.motif);
  } else {
    const d50 = q(f.dateSeuil50Atteint) || ex(jour0(f));
    const terme = R.ajouterMois(d50, 12);
    p(`Donnée manquante à ce jour : la date à laquelle l'effectif a atteint cinquante salariés pendant douze mois consécutifs. À titre d'illustration, avec un franchissement au ${d50}, le terme de douze mois se situerait au ${terme || "—"}.`);
  }
  exi.avertissements.forEach(a => note(a));
  h2("Le passage au contenu des entreprises de trois cents salariés et plus (L. 2312-34)");
  if (exi.contenu300) {
    p(exi.contenu300.motif);
  } else if (eff(f) !== null && eff(f) >= 300) {
    const d300 = ex(jour0(f));
    puce(`Effectif déclaré au-dessus du seuil (${eff(f)}), mais la date de franchissement n'est pas renseignée : sans elle, impossible de dire si l'année de mise en conformité de l'article R. 2312-9 est déjà écoulée. Exemple de calcul avec un franchissement fictif au ${d300} : terme au ${R.ajouterMois(d300, 12)}.`);
  } else {
    puce("Sans objet en l'état : l'effectif déclaré n'atteint pas trois cents salariés.");
  }
  note("Consignez la date retenue et la pièce qui la porte (relevé d'effectif mensuel) : c'est elle qui fait courir tous les délais du module.");
  return A.D;
}

/* ───────────────────────────────── BDESE-CTL-CNT-01 : le plancher légal ─── */

function modeleCnt01(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille du plancher légal — " + nomE(f));
  const d = declares(f);
  const abs = PL.absents(d);
  h1("Ce que la base comporte déjà, et ce qui lui manque");
  p(`${d.length} thème(s) déclaré(s) dans la base. Sur les ${PL.PLANCHER.length} thèmes du plancher de l'article L. 2312-21, alinéa 3, ${abs.length} n'y sont pas retrouvés.`);
  if (abs.length)
    tab(["Thème du plancher, absent de la base", "Ce que le décret nomme"],
      abs.map(t => {
        const c = PL.CORRESPONDANCE.find(x => PL.net(x.plancher) === PL.net(t));
        return [t, c ? c.decret.join(" ; ") : "—"];
      }));
  else p("Les dix thèmes du plancher sont tous retrouvés dans la base, sur le seul rapprochement des intitulés déclarés.");
  note("Un thème « retrouvé » l'est sur le rapprochement des intitulés : cela ne dit rien du contenu effectivement renseigné derrière lui, que ce module ne lit pas.");
  return A.D;
}

/* ────────────────────── BDESE-CTL-CNT-02 : la grille du décret, complète ─── */

function modeleCnt02(f) {
  const A = O(); const { t1, h1, p, tab, note } = A;
  t1("Grille du contenu supplétif — " + nomE(f));
  const reg = R.regime(f);
  if (reg.regime !== R.REGIMES.SUPPLETIF) {
    A.D.push({ k: "p", t: reg.regime === R.REGIMES.INDETERMINE
      ? "Le régime n'est pas encore établi : ce modèle de grille ne peut être servi tant que le décret n'est pas confirmé comme texte applicable — voir la note de régime."
      : `Un accord définit la base (${reg.regime}) : c'est sa grille qui prévaut, non celle du décret. Ce modèle ne s'applique pas ici.` });
    return A.D;
  }
  const cle = reg.article === "R. 2312-9" ? "au moins300" : "moins300";
  const B = CONTENU.construire(); const arbre = B.contenu[cle];
  const d = declares(f);
  h1(`La grille due — article ${reg.article}, entreprise de ${effTxte(f)} salarié(s)`);
  p(`${arbre.rubriques.length} rubrique(s), découpées depuis le texte de l'article (couverture du découpage : ${arbre.couverture.part} %).`);
  tab(["Rubrique du décret", "Sections", "Retrouvée dans la base ?"],
    arbre.rubriques.map(r => {
      const nRub = PL.net(r.titre);
      const trouvee = d.map(PL.net).some(x => x.includes(nRub.slice(0, 20)) || nRub.includes(x.slice(0, 20)));
      return [r.titre, String(r.sections.length), trouvee ? "oui" : "non retrouvée"];
    }));
  if (reg.article === "R. 2312-9")
    note("R. 2312-9 ajoute expressément à son tableau la formation professionnelle et les conditions de travail du 1° A, e et f de R. 2312-8 : elles doivent figurer dans la liste ci-dessus, sans quoi la grille est incomplète.");
  return A.D;
}

/* ───────────────── BDESE-CTL-CNT-03 et CNT-04 : les six années, R. 2312-10 ─ */

function modeleAnnees(f) {
  const A = O(); const { t1, h1, h2, p, tab, puce, note } = A;
  t1("Tableau des six années dues — " + nomE(f));
  const annee = nb(String(jour0(f)).slice(0, 4));
  const an = R.annees(f, annee);
  h1("Les millésimes attendus, calculés depuis la date d'audit");
  p(an.motif);
  tab(["Millésime", "Nature", "Forme admise"],
    an.passees.map(a => [String(a), "réalisé", "chiffrée"])
      .concat([[String(an.courante), "année en cours", "chiffrée"]])
      .concat(an.suivantes.map(a => [String(a), "perspective", "chiffrée ou grandes tendances"])));
  h2("Ce que le dossier déclare aujourd'hui");
  puce(`Années passées couvertes, selon la base : ${q(((f.base || {}).anneesPassees)) || "non renseigné"}.`);
  puce(`Années suivantes couvertes, selon la base : ${q(((f.base || {}).anneesSuivantes)) || "non renseigné"}.`);
  puce(`Forme retenue pour les perspectives : ${q(((f.base || {}).formePerspectives)) || "non renseignée"}.`);
  const nr = q(((f.base || {}).informationsNonRenseignables));
  if (nr) puce(`Informations déclarées ni chiffrables ni tendancielles, avec leurs raisons : ${nr}`);
  else note("Aucune information n'est déclarée comme ne pouvant recevoir ni chiffres ni grandes tendances : si certaines rubriques sont dans ce cas, l'article R. 2312-10 impose de les lister avec leurs raisons, dans la base elle-même.");
  return A.D;
}

/* ──────────────────────── BDESE-CTL-MAD-01 : l'accès permanent ─────────── */

function modeleMad01(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Liste des accès à la base — " + nomE(f));
  const benef = q(((f.base || {}).beneficiaires));
  h1("Ce qui est dû, au vu de l'effectif déclaré");
  puce("Membres de la délégation du personnel du comité social et économique.");
  if (String(f.etablissementsDistincts) === "oui") puce("Membres du comité social et économique central, l'entreprise comportant des établissements distincts.");
  puce("Délégués syndicaux.");
  h1("Ce que le dossier déclare");
  if (benef) puce("Bénéficiaires déclarés à ce jour : " + benef);
  else puce("Aucun bénéficiaire n'est encore listé dans le dossier.");
  const support = q(((f.base || {}).support));
  p(`Support de la base déclaré : ${support || "non renseigné"}. ${eff(f) !== null && eff(f) >= 300
    ? "Au-delà de trois cents salariés et à défaut d'accord, R. 2312-12 impose le support informatique."
    : "En deçà de trois cents salariés et à défaut d'accord, R. 2312-12 admet le support informatique ou papier."}`);
  note("L'accès doit être permanent, non limité aux périodes de consultation : conservez la date d'ouverture de chaque accès et sa trace hors réunion.");
  return A.D;
}

/* ────────────────────────── BDESE-CTL-MAD-02 : l'actualisation ─────────── */

function modeleMad02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calendrier d'actualisation — " + nomE(f));
  const date = q(((f.base || {}).dateDerniereMiseAJour));
  h1("L'ancienneté de la dernière mise à jour déclarée");
  if (date) {
    const mois = R.moisEntre(date, jour0(f));
    p(`Dernière mise à jour déclarée le ${date}, soit ${mois === null ? "un délai qui n'a pas pu être calculé" : mois + " mois avant la date d'audit"}.`);
    if (mois !== null && mois > 12)
      note(`Ce délai dépasse un an : une base qui n'a pas bougé depuis si longtemps ne porte plus l'année en cours qu'exige l'article R. 2312-10, quoi qu'en dise son sommaire.`);
  } else {
    p("Aucune date de dernière mise à jour n'est déclarée : sans elle, impossible d'établir que la base porte l'année en cours.");
  }
  note("Fixez, rubrique par rubrique, une périodicité d'actualisation et le service qui en répond — une date globale ne dit rien de la rubrique qui n'a pas bougé.");
  return A.D;
}

/* ───────────────────────── BDESE-CTL-MAD-03 : l'information des accès ──── */

function modeleMad03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Modèle d'information des bénéficiaires — " + nomE(f));
  const info = f.base && f.base.informationMiseAJour;
  const preuve = q(((f.base || {}).preuveAcces));
  h1("Objet — actualisation de la base de données économiques, sociales et environnementales");
  p(`${nomE(f)} informe les personnes ayant accès à la base que celle-ci a été actualisée le ${q(((f.base || {}).dateDerniereMiseAJour)) || "[date de la mise à jour]"}. Les rubriques mises à jour sont les suivantes : [à préciser].`);
  p("Cette information vaut communication des rapports et informations au comité, au sens de l'article L. 2312-18, et fait courir le délai de consultation de l'article R. 2312-5 lorsqu'elle porte sur une consultation récurrente.");
  h1("Ce que le dossier déclare");
  p(`Information systématique des bénéficiaires à chaque actualisation : ${info === "oui" ? "déclarée oui." : info === "non" ? "déclarée non — c'est un manquement direct à établir en priorité." : "non renseignée."}`);
  p(`Trace conservée de la mise à disposition : ${preuve || "non renseignée"}.`);
  note("Conservez la preuve d'envoi datée : c'est elle qui fixe le point de départ du délai de consultation, pas la date de la réunion.");
  return A.D;
}

/* ───────────────────────── BDESE-CTL-CSL-01 : la périodicité, 3 ans max ─── */

function modeleCsl01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Avenant sur la périodicité des consultations récurrentes — " + nomE(f));
  const per = nb(f.periodiciteConsultations);
  h1("Ce que l'accord de l'article L. 2312-19 fixe");
  if (dit(f.accordPeriodiciteConsultations) && per !== null) {
    p(`Périodicité déclarée : ${per} an(s). Le dernier alinéa de L. 2312-19 plafonne cette périodicité à trois ans.`);
    if (per > 3) note(`Cette périodicité dépasse le plafond de trois ans : la stipulation est sans effet au-delà, et les consultations restent dues tous les trois ans au maximum. Un avenant doit ramener la périodicité à ${ex("3")} ans au plus.`);
    else p("Cette périodicité respecte le plafond légal de trois ans : pas d'avenant à prévoir sur ce point.");
  } else {
    p(`Aucun accord de périodicité n'est déclaré, ou la périodicité n'est pas chiffrée. À défaut d'accord valable, les consultations récurrentes suivent leur échéance annuelle légale.`);
  }
  note("Vérifiez que l'accord invoqué porte bien sur la périodicité des consultations (L. 2312-19) et non sur le contenu de la base (L. 2312-21) : ce sont deux accords distincts.");
  return A.D;
}

/* ─────────────────────── BDESE-CTL-CSL-02 : six réunions au moins ──────── */

function modeleCsl02(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Calendrier annuel des réunions du comité — " + nomE(f));
  const n = nb(f.reunionsAnnuellesAccord);
  h1("Le nombre de réunions annuelles, au regard du plancher légal");
  if (n !== null) {
    p(`Nombre de réunions annuelles déclaré par l'accord : ${n}. Le 2° de l'article L. 2312-19 fixe un plancher de six réunions par an, que l'accord ne peut pas descendre.`);
    if (n < 6) note(`Il manque ${6 - n} réunion(s) par an pour atteindre le plancher légal : programmez-les sur l'année en cours, avant l'avenant qui corrigera la stipulation.`);
    else p("Ce nombre respecte le plancher légal de six réunions annuelles.");
  } else {
    p("Le nombre de réunions annuelles que l'accord prévoit n'est pas renseigné.");
  }
  note("Le nombre effectivement tenu compte autant que le nombre stipulé : relevez les dates des réunions des douze derniers mois et comparez-les au plancher.");
  return A.D;
}

/* ───────────────────────── BDESE-CTL-CSL-03 : le délai de consultation ─── */

function modeleCsl03(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Fiche de délai de consultation — " + nomE(f));
  const del = R.delaiConsultation(f);
  h1("Le délai applicable, calculé sur le dossier");
  p(del.motif);
  if (del.connu && !del.depart) note("La date de mise à disposition des informations n'est pas renseignée : sans elle, le terme du délai ne peut pas être daté, seule sa durée l'est.");
  return A.D;
}

/* ──────────────────────── BDESE-CTL-ETB-01 : établissements distincts ──── */

function modeleEtb01(f) {
  const A = O(); const { t1, h1, p, note } = A;
  t1("Note sur le niveau de mise en place de la base — " + nomE(f));
  if (String(f.etablissementsDistincts) !== "oui") {
    A.D.push({ k: "p", t: "Sans objet en l'état du dossier : l'entreprise n'est pas déclarée comme comportant des établissements distincts." });
    return A.D;
  }
  const niveau = q(((f.base || {}).niveau));
  h1("Ce que le dossier déclare");
  p(`Niveau de mise en place déclaré : ${niveau || "non renseigné"}. Le 2° de l'article L. 2312-21 range ce niveau parmi ce qu'un accord peut fixer ; à défaut d'accord, R. 2312-11 retient le niveau de l'entreprise et fait comporter à la base les informations mises à disposition du comité central et des comités d'établissement.`);
  note("Écrivez le niveau retenu et les droits d'accès de chaque comité d'établissement, puis notifiez-les et conservez la trace de cette notification.");
  return A.D;
}

/* ───────────────────────────── BDESE-CTL-COH-01 : la cohérence ─────────── */

function modeleCoh01(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Bordereau des pièces — " + nomE(f));
  const reg = R.regime(f);
  const pieces = Array.isArray(f.pieces) ? f.pieces : [];
  h1("Le régime déclaré, au regard des pièces versées");
  p(`Régime retenu par le dossier : ${reg.regime}${reg.article ? " (" + reg.article + ")" : ""}.`);
  if (pieces.length) puce(`${pieces.length} pièce(s) versée(s) au dossier.`);
  else puce("Aucune pièce n'est versée au dossier à ce jour.");
  if (reg.regime === R.REGIMES.ACCORD_ENTREPRISE || reg.regime === R.REGIMES.ACCORD_BRANCHE) {
    if (!pieces.length) note("Un régime conventionnel est déclaré, mais aucune pièce n'est versée : produisez l'accord lui-même — un régime conventionnel se prouve par son texte, jamais par sa seule déclaration.");
  } else if (pieces.length) {
    note("Le régime déclaré est le supplétif du décret, alors que des pièces sont versées au dossier : vérifiez qu'aucune d'elles n'est en réalité l'accord qui définirait la base, auquel cas c'est lui qui devrait commander le régime.");
  }
  return A.D;
}

/* ────────────────────────────── BDESE-CTL-PRV-01 : la preuve ───────────── */

function modelePrv01(f) {
  const A = O(); const { t1, h1, p, puce, note } = A;
  t1("Dossier de preuve de la mise à disposition — " + nomE(f));
  h1("Ce que le dossier réunit à ce jour");
  puce(`Support : ${q(((f.base || {}).support)) || "non renseigné"}.`);
  puce(`Traces d'accès : ${q(((f.base || {}).preuveAcces)) || "non renseignées"}.`);
  puce(`Bénéficiaires déclarés : ${q(((f.base || {}).beneficiaires)) || "non renseignés"}.`);
  note("Ce module prépare, structure, documente et audite la base ; il n'atteste pas, lui-même, la mise à disposition. Ce dossier de preuve — support, traces d'accès, notifications datées — reste un acte propre de l'employeur, distinct du rapport d'audit.");
  return A.D;
}

const MODELES = {
  "BDESE-CTL-REG-01": f => modeleRegime(f, false),
  "BDESE-CTL-REG-02": f => modeleRegime(f, true),
  "BDESE-CTL-DAT-01": modeleDates,
  "BDESE-CTL-DAT-02": modeleDates,
  "BDESE-CTL-CNT-01": modeleCnt01,
  "BDESE-CTL-CNT-02": modeleCnt02,
  "BDESE-CTL-CNT-03": modeleAnnees,
  "BDESE-CTL-CNT-04": modeleAnnees,
  "BDESE-CTL-MAD-01": modeleMad01,
  "BDESE-CTL-MAD-02": modeleMad02,
  "BDESE-CTL-MAD-03": modeleMad03,
  "BDESE-CTL-CSL-01": modeleCsl01,
  "BDESE-CTL-CSL-02": modeleCsl02,
  "BDESE-CTL-CSL-03": modeleCsl03,
  "BDESE-CTL-ETB-01": modeleEtb01,
  "BDESE-CTL-COH-01": modeleCoh01,
  "BDESE-CTL-PRV-01": modelePrv01,
};

module.exports = { MODELES };
