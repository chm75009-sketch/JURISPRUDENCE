/* Les contrôles de la base de données économiques, sociales et environnementales.

   Ce que ce module fait, et la formulation est stricte parce qu'elle engage :
   il PRÉPARE, STRUCTURE, DOCUMENTE et AUDITE la base. Il ne fournit pas une
   base collaborative accessible simultanément à plusieurs catégories
   d'utilisateurs, et il n'est pas la base : la mise à disposition reste un acte
   de l'employeur, qui se prouve autrement.

   L'ordre des questions est celui du droit, et il ne se contourne pas :

     1. quel régime s'applique — accord d'entreprise, accord de branche,
        supplétif, ou indéterminé ;
     2. à quelle date le contenu devient exigible ;
     3. ce que ce régime commande, thème par thème ;
     4. ce que l'accord ne pouvait pas retirer — le plancher de L. 2312-21, al. 3 ;
     5. la mise à disposition, son support, son actualisation ;
     6. les délais de consultation, qui relèvent d'un AUTRE accord.

   Tant que le régime est indéterminé, aucun contrôle de contenu ne conclut.
   C'est la règle la plus importante du module : auditer un contenu sans savoir
   quel texte le commande, c'est produire des non-conformités inventées. */
const R = require("./regime-bdese.js");
const CONTENU = require("./contenu-bdese.js");
const PL = require("./plancher-bdese.js");
const REC = require("./recevabilite.js");

const CONF = "conforme", NC = "non conforme", RISQ = "risque à vérifier",
      MANQ = "donnée manquante", SO = "sans objet";
const ETATS = { CONF, NC, RISQ, MANQ, SO };

const vide = x => x === undefined || x === null || x === "" ||
  (Array.isArray(x) && !x.length) || (typeof x === "string" && !x.trim());
const nb = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";

/* Le plancher : les dix thèmes que l'accord ne peut pas descendre, relevés dans
   le troisième alinéa de L. 2312-21 et non recopiés. Ce sont LES DIX THÈMES DU
   PLANCHER DE L'ACCORD — à ne pas confondre avec les dix thèmes de la
   consultation sur les orientations stratégiques, la situation économique et la
   politique sociale (L. 2312-36), qui sont dix autres. Le plancher scinde les
   investissements et les fonds propres/endettement, et il laisse tomber la
   sous-traitance (que le décret nomme « partenariats ») et les transferts
   intragroupe : un accord peut donc les supprimer. */
const PLANCHER = PL.PLANCHER;

const themesDeclares = f => Array.isArray((f.base || {}).themes) ? f.base.themes : null;

/* Le garde commun : rien ne se contrôle sur un régime inconnu. */
function siRegimeConnu(f, suite) {
  const r = R.regime(f);
  if (r.regime === R.REGIMES.INDETERMINE) return { etat: MANQ, motif: r.motif };
  return suite(r);
}

const C = [];
const ctl = (id, rubrique, objet, fondement, verdict) => C.push({ id, rubrique, objet, fondement, verdict });

/* ------------------------------------------------------------- le régime */

ctl("BDESE-CTL-REG-01", "Régime applicable",
  "Le texte qui commande le contenu de la base est-il identifié ?",
  ["L. 2312-21"],
  f => {
    const r = R.regime(f);
    if (r.regime === R.REGIMES.INDETERMINE) return { etat: MANQ, motif: r.motif };
    return { etat: CONF, motif: r.motif };
  });

ctl("BDESE-CTL-REG-02", "Régime applicable",
  "L'accord de branche invoqué peut-il régir cette entreprise ?",
  ["L. 2312-21, dernier alinéa"],
  f => {
    if (!dit(f.accordBranche)) return { etat: SO, motif: "Aucun accord de branche n'est invoqué." };
    const eff = nb(f.effectif);
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné : l'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés." };
    if (dit(f.accordEntreprise))
      return { etat: NC, motif: "Un accord d'entreprise existe : l'accord de branche ne s'applique qu'à défaut d'accord d'entreprise (L. 2312-21, dernier alinéa)." };
    return eff < R.SEUIL_CONTENU
      ? { etat: CONF, motif: `Effectif de ${eff} salariés, inférieur à trois cents, et aucun accord d'entreprise : l'accord de branche peut définir la base.` }
      : { etat: NC, motif: `Effectif de ${eff} salariés. L'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés : ici, c'est le décret qui s'applique, article R. 2312-9.` };
  });

/* --------------------------------------------------------- l'exigibilité */

ctl("BDESE-CTL-DAT-01", "Dates d'exigibilité",
  "La date à laquelle les attributions récurrentes s'exercent est-elle établie ?",
  ["L. 2312-2"],
  f => {
    const eff = nb(f.effectif);
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné." };
    if (eff < R.SEUIL_ATTRIBUTIONS)
      return { etat: SO, motif: `Effectif de ${eff} salariés : les attributions récurrentes, dont la base de données relève, ne s'exercent qu'à partir de cinquante (L. 2312-2). Le comité, lui, se met en place à onze — les deux seuils sont distincts.` };
    const e = R.exigibilite(f);
    if (!e.attributions) return { etat: MANQ, motif: "La date à laquelle l'effectif a atteint cinquante salariés pendant douze mois consécutifs n'est pas renseignée : le point de départ du délai de douze mois de l'article L. 2312-2 est inconnu." };
    if (!e.attributions.date)
      return { etat: RISQ, motif: e.attributions.motif + " " + e.avertissements.join(" ") };
    return e.avertissements.length
      ? { etat: RISQ, motif: e.attributions.motif + " " + e.avertissements.join(" ") }
      : { etat: CONF, motif: e.attributions.motif };
  });

ctl("BDESE-CTL-DAT-02", "Dates d'exigibilité",
  "Le passage au contenu des entreprises de trois cents salariés est-il daté ?",
  ["L. 2312-34"],
  f => {
    const eff = nb(f.effectif);
    if (eff === null) return { etat: MANQ, motif: "L'effectif n'est pas renseigné." };
    if (eff < R.SEUIL_CONTENU)
      return { etat: SO, motif: `Effectif de ${eff} salariés : le contenu applicable est celui des entreprises de moins de trois cents salariés.` };
    const e = R.exigibilite(f);
    if (!e.contenu300)
      return { etat: MANQ, motif: e.avertissements.join(" ") || "La date de franchissement du seuil de trois cents salariés n'est pas renseignée." };
    return { etat: CONF, motif: e.contenu300.motif };
  });

/* ------------------------------------------------------------- le contenu */

ctl("BDESE-CTL-CNT-01", "Contenu",
  "Les thèmes du plancher légal figurent-ils tous dans la base ?",
  ["L. 2312-21, al. 3"],
  f => siRegimeConnu(f, () => {
    const t = themesDeclares(f);
    if (t === null) return { etat: MANQ, motif: "Les thèmes que la base comporte ne sont pas renseignés." };
    /* La loi et le décret ne nomment pas les mêmes choses de la même façon :
       la correspondance est déclarée et vérifiée dans plancher-bdese.js, et
       c'est elle qui décide — non une comparaison de libellés mot à mot, qui
       produisait cinq faux manquements sur un dossier complet. */
    const vus = t.map(x => String(x.theme || x));
    const absents = PL.absents(vus);
    return absents.length
      ? { etat: NC, motif: `${absents.length} thème(s) du plancher de l'article L. 2312-21, alinéa 3, ne figurent pas dans la base : ${absents.join(" ; ")}. Ce plancher s'impose à tout accord : « la base de données comporte au moins les thèmes suivants ». Un accord qui les retire est, sur ce point, sans effet.` }
      : { etat: CONF, motif: `Les ${PLANCHER.length} thèmes du plancher de l'article L. 2312-21, alinéa 3, figurent dans la base. Ce sont les dix thèmes du plancher de l'accord — à ne pas confondre avec les dix thèmes de la consultation de l'article L. 2312-36.` };
  }));

ctl("BDESE-CTL-CNT-02", "Contenu",
  "Le contenu supplétif du décret est-il couvert, rubrique par rubrique ?",
  ["R. 2312-8", "R. 2312-9"],
  f => siRegimeConnu(f, r => {
    if (r.regime !== R.REGIMES.SUPPLETIF)
      return { etat: SO, motif: `Le contenu est défini par ${r.regime} : le supplétif du décret ne s'applique pas. Le plancher de l'article L. 2312-21, alinéa 3, reste dû, et il est vérifié à part.` };
    /* Les deux arbres du décret, tels que le découpage les nomme : « moins300 »
       pour R. 2312-8, « au moins300 » pour R. 2312-9. */
    const attendu = CONTENU.construire().contenu[r.article === "R. 2312-9" ? "au moins300" : "moins300"];
    const t = themesDeclares(f);
    if (t === null) return { etat: MANQ, motif: `Les rubriques renseignées ne sont pas déclarées. Le décret en compte ${attendu.rubriques.length} pour l'article ${r.article}.` };
    const vus = t.map(x => PL.net(String(x.theme || x)));
    const absentes = attendu.rubriques.filter(rub => {
      const n = PL.net(rub.titre);
      return !vus.some(v => v.includes(n.slice(0, 20)) || n.includes(v.slice(0, 20)));
    });
    return absentes.length
      ? { etat: NC, motif: `${absentes.length} rubrique(s) de l'article ${r.article} ne sont pas renseignées : ${absentes.map(x => x.titre).join(" ; ")}. En l'absence d'accord, le décret fixe le contenu : ces rubriques sont dues.` }
      : { etat: CONF, motif: `Les ${attendu.rubriques.length} rubriques de l'article ${r.article} sont renseignées.` };
  }));

ctl("BDESE-CTL-CNT-03", "Contenu",
  "Les années couvertes sont-elles les six que le décret impose ?",
  ["R. 2312-10"],
  f => siRegimeConnu(f, r => {
    if (r.regime !== R.REGIMES.SUPPLETIF)
      return { etat: SO, motif: "L'article R. 2312-10 ne vaut qu'en l'absence d'accord ; l'accord applicable définit lui-même les années couvertes." };
    const b = f.base || {};
    const passees = nb(b.anneesPassees), suivantes = nb(b.anneesSuivantes);
    if (passees === null || suivantes === null)
      return { etat: MANQ, motif: "Le nombre d'années passées et d'années suivantes couvertes n'est pas renseigné. Le décret impose l'année en cours, les deux précédentes et les trois suivantes." };
    if (passees < 2 || suivantes < 3)
      return { etat: NC, motif: `La base couvre ${passees} année(s) passée(s) et ${suivantes} année(s) suivante(s). L'article R. 2312-10 impose l'année en cours, les deux précédentes et les trois suivantes.` };
    return { etat: CONF, motif: "L'année en cours, les deux précédentes et les trois suivantes sont couvertes." };
  }));

ctl("BDESE-CTL-CNT-04", "Contenu",
  "Les années à venir sont-elles renseignées, en chiffres ou en grandes tendances ?",
  ["R. 2312-10"],
  f => siRegimeConnu(f, r => {
    if (r.regime !== R.REGIMES.SUPPLETIF)
      return { etat: SO, motif: "L'article R. 2312-10 ne vaut qu'en l'absence d'accord." };
    const b = f.base || {};
    const forme = String(b.formePerspectives || "").toLowerCase();
    if (!forme) return { etat: MANQ, motif: "La forme sous laquelle les trois années suivantes sont renseignées n'est pas déclarée." };
    /* Les grandes tendances suffisent : c'est le texte, et l'exiger en chiffres
       produirait des non-conformités fausses. Ce que le décret exige en plus,
       c'est que l'employeur DISE, en les motivant, les informations qui ne
       peuvent recevoir ni chiffres ni tendances. */
    const admise = /chiffr|tendance|mixte/.test(forme);
    if (!admise)
      return { etat: NC, motif: `Forme déclarée : « ${b.formePerspectives} ». Les trois années suivantes sont présentées sous forme de données chiffrées ou, à défaut, sous forme de grandes tendances (R. 2312-10). Une absence pure et simple n'est pas une de ces deux formes.` };
    if (vide(b.informationsNonRenseignables))
      return { etat: RISQ, motif: `Les perspectives sont renseignées sous forme ${/tendance/.test(forme) ? "de grandes tendances — ce que le décret admet expressément" : "chiffrée"}. Mais l'article R. 2312-10 ajoute une obligation que l'on oublie : l'employeur indique, POUR CES ANNÉES, les informations qui ne peuvent pas faire l'objet de données chiffrées ou de grandes tendances, ET les raisons qu'il en donne. Rien n'est déclaré à ce titre : soit tout est renseignable, et il faut pouvoir le dire, soit la liste manque.` };
    return { etat: CONF, motif: `Perspectives renseignées sous forme ${/tendance/.test(forme) ? "de grandes tendances, ce que l'article R. 2312-10 admet pour les années suivantes" : "chiffrée"}, et les informations qui ne peuvent recevoir ni chiffres ni tendances sont indiquées avec leurs raisons.` };
  }));

/* -------------------------------------------------- la mise à disposition */

ctl("BDESE-CTL-MAD-01", "Mise à disposition",
  "La base est-elle accessible en permanence aux personnes qui y ont droit ?",
  ["L. 2312-18"],
  f => {
    const b = f.base || {};
    if (vide(b.support)) return { etat: MANQ, motif: "Le support de la base n'est pas renseigné." };
    if (vide(b.beneficiaires)) return { etat: MANQ, motif: "Les personnes ayant accès à la base ne sont pas renseignées." };
    const q = Array.isArray(b.beneficiaires) ? b.beneficiaires.map(x => String(x).toLowerCase()) : [String(b.beneficiaires).toLowerCase()];
    const attendus = [["membres du comité", /comit|élu|titulaire|suppléant/], ["délégués syndicaux", /syndica/]];
    const absents = attendus.filter(a => !q.some(x => a[1].test(x))).map(a => a[0]);
    return absents.length
      ? { etat: RISQ, motif: `L'accès n'est pas déclaré pour : ${absents.join(", ")}. L'article L. 2312-18 met la base à disposition des membres de la délégation du personnel du comité et des délégués syndicaux. L'accord peut organiser les droits d'accès, non les supprimer.` }
      : { etat: CONF, motif: `Base accessible sur support « ${b.support} », aux membres du comité et aux délégués syndicaux.` };
  });

ctl("BDESE-CTL-MAD-02", "Mise à disposition",
  "L'actualisation de la base est-elle organisée et tracée ?",
  ["L. 2312-18", "L. 2312-21, 2°"],
  f => {
    const b = f.base || {};
    if (vide(b.dateDerniereMiseAJour)) return { etat: MANQ, motif: "La date de la dernière mise à jour n'est pas renseignée. Une base est un support permanent : sa fraîcheur est le premier reproche fait en séance." };
    if (vide(f.dateAudit)) return { etat: MANQ, motif: "La date de l'audit n'est pas renseignée : l'ancienneté de la mise à jour ne peut pas être mesurée." };
    const mois = R.moisEntre(b.dateDerniereMiseAJour, f.dateAudit);
    if (mois === null) return { etat: MANQ, motif: "Les dates ne sont pas exploitables." };
    if (mois > 12)
      return { etat: NC, motif: `Dernière mise à jour il y a ${mois} mois (${b.dateDerniereMiseAJour}). Les informations portent sur l'année en cours : une base non actualisée depuis plus d'un an ne les porte plus.` };
    return mois > 6
      ? { etat: RISQ, motif: `Dernière mise à jour il y a ${mois} mois. Aucun texte ne fixe de périodicité générale, mais une base qui n'a pas bougé depuis six mois soutient mal l'affirmation qu'elle porte l'année en cours.` }
      : { etat: CONF, motif: `Base mise à jour le ${b.dateDerniereMiseAJour}, soit il y a ${mois} mois.` };
  });

ctl("BDESE-CTL-MAD-03", "Mise à disposition",
  "L'information des bénéficiaires de chaque mise à jour est-elle prouvée ?",
  ["R. 2312-5", "R. 2312-7"],
  f => {
    const b = f.base || {};
    if (vide(b.informationMiseAJour))
      return { etat: MANQ, motif: "Il n'est pas déclaré si les bénéficiaires sont informés de l'actualisation de la base." };
    if (nie(b.informationMiseAJour))
      return { etat: NC, motif: "Les bénéficiaires ne sont pas informés des mises à jour. C'est cette information qui fait courir le délai de consultation (R. 2312-5) : sans elle, le délai ne court pas, et l'avis ne peut pas être réputé rendu." };
    return { etat: CONF, motif: "Les bénéficiaires sont informés de l'actualisation. C'est cette information — ou la communication des informations — qui fait courir le délai de consultation (R. 2312-5)." };
  });

/* --------------------------------------------------- les consultations */

ctl("BDESE-CTL-CSL-01", "Consultations",
  "L'accord sur la périodicité des consultations est-il distinct de l'accord sur la base ?",
  ["L. 2312-19", "L. 2312-21"],
  f => {
    if (vide(f.accordPeriodiciteConsultations))
      return { etat: MANQ, motif: "Il n'est pas déclaré si un accord fixe le contenu, la périodicité et les modalités des consultations récurrentes. Ce n'est pas le même accord que celui qui définit la base : l'un relève de l'article L. 2312-19, l'autre de l'article L. 2312-21, et un accord sur la base ne déplace pas la périodicité des consultations." };
    if (nie(f.accordPeriodiciteConsultations))
      return { etat: CONF, motif: "Aucun accord ne fixe la périodicité des consultations : les trois consultations récurrentes sont annuelles, selon le régime supplétif." };
    const p = nb(f.periodiciteConsultations);
    if (p === null) return { etat: MANQ, motif: "Un accord est déclaré mais la périodicité qu'il fixe n'est pas renseignée." };
    return p > 3
      ? { etat: NC, motif: `Périodicité de ${p} ans. L'article L. 2312-19, dernier alinéa, la plafonne à trois ans : au-delà, la stipulation est sans effet.` }
      : { etat: CONF, motif: `Périodicité de ${p} an(s), dans la limite de trois ans que fixe l'article L. 2312-19.` };
  });

ctl("BDESE-CTL-CSL-02", "Consultations",
  "Le nombre de réunions annuelles que l'accord prévoit atteint-il le minimum ?",
  ["L. 2312-19, 2°"],
  f => {
    if (!dit(f.accordPeriodiciteConsultations))
      return { etat: SO, motif: "Aucun accord ne fixe le nombre de réunions : le régime supplétif s'applique." };
    const n = nb(f.reunionsAnnuellesAccord);
    if (n === null) return { etat: MANQ, motif: "Le nombre de réunions annuelles prévu par l'accord n'est pas renseigné." };
    return n < 6
      ? { etat: NC, motif: `${n} réunions annuelles. L'accord ne peut en prévoir moins de six (L. 2312-19, 2°).` }
      : { etat: CONF, motif: `${n} réunions annuelles, au moins six comme l'exige l'article L. 2312-19, 2°.` };
  });

ctl("BDESE-CTL-CSL-03", "Consultations",
  "Le délai dans lequel l'avis est réputé rendu est-il connu et tenu ?",
  ["R. 2312-5", "R. 2312-6"],
  f => {
    const d = R.delaiConsultation(f);
    if (!d.connu) return { etat: RISQ, motif: d.motif };
    if (!d.depart)
      return { etat: MANQ, motif: `${d.motif} La date de mise à disposition — ou de communication — n'est pas renseignée : le point de départ du délai est inconnu.` };
    const avis = (f.consultation || {}).dateAvis;
    if (vide(avis))
      return { etat: RISQ, motif: `${d.motif} Aucun avis n'est enregistré : à ce terme, le comité sera réputé consulté ET AVOIR RENDU UN AVIS NÉGATIF — ce qui n'est pas un silence neutre.` };
    return avis <= d.terme
      ? { etat: CONF, motif: `Avis rendu le ${avis}, dans le délai de ${d.mois} mois expirant le ${d.terme}.` }
      : { etat: RISQ, motif: `Avis daté du ${avis}, postérieur au terme du ${d.terme}. Passé ce terme, le comité était déjà réputé avoir rendu un avis négatif (R. 2312-6, I).` };
  });

/* ----------------------------------------------- l'établissement distinct */

ctl("BDESE-CTL-ETB-01", "Établissements distincts",
  "Le niveau auquel la base est mise en place est-il fixé ?",
  ["L. 2312-21, 2°", "L. 2316-1"],
  f => {
    if (vide(f.etablissementsDistincts))
      return { etat: MANQ, motif: "Il n'est pas déclaré si l'entreprise comporte plusieurs établissements distincts. Le niveau de mise en place de la base en dépend." };
    if (nie(f.etablissementsDistincts))
      return { etat: SO, motif: "L'entreprise ne comporte pas d'établissement distinct : la base est mise en place au niveau de l'entreprise." };
    const n = (f.base || {}).niveau;
    if (vide(n))
      return { etat: MANQ, motif: "L'entreprise comporte des établissements distincts, mais le niveau auquel la base est mise en place n'est pas renseigné. C'est l'accord de l'article L. 2312-21 qui le fixe (2° : « le niveau de mise en place de la base dans les entreprises comportant des établissements distincts »)." };
    return { etat: CONF, motif: `Base mise en place au niveau : ${n}. Lorsque la consultation se déroule à la fois au niveau du comité central et de comités d'établissement, l'avis de chaque établissement est rendu au plus tard sept jours avant le terme applicable au comité central (R. 2312-6, II).` };
  });

/* ------------------------------------------------------------ la cohérence */

const COHERENCE = ["BDESE-CTL-COH-01"];
ctl("BDESE-CTL-COH-01", "Cohérence",
  "Le régime déclaré s'accorde-t-il avec les pièces versées ?",
  ["L. 2312-21"],
  f => {
    const r = R.regime(f);
    if (r.regime === R.REGIMES.INDETERMINE) return { etat: MANQ, motif: r.motif };
    const P = Array.isArray(f.pieces) ? f.pieces : [];
    const aAccord = P.some(p => /accord/i.test(String(p.type || p.nom || "")));
    if (r.regime === R.REGIMES.SUPPLETIF && aAccord)
      return { etat: NC, motif: "Le régime retenu est le supplétif du décret, mais un accord figure parmi les pièces versées. L'un des deux est faux : soit l'accord définit la base et le régime n'est pas le supplétif, soit il porte sur autre chose et ne devrait pas être versé ici." };
    if (r.regime !== R.REGIMES.SUPPLETIF && !aAccord)
      return { etat: NC, motif: `Le régime retenu est ${r.regime}, mais aucun accord ne figure parmi les pièces versées. Un régime conventionnel se prouve par son texte.` };
    return { etat: CONF, motif: `Régime retenu : ${r.regime}, et les pièces versées le portent.` };
  });

/* Les contrôles de détection ne concluent jamais à la conformité. Ici, un seul :
   ce que l'application ne peut pas prouver — que la base a effectivement été
   mise à la disposition du comité. Elle constitue le contenu ; la mise à
   disposition est un acte de l'employeur, qui se prouve autrement. */
const DETECTION = ["BDESE-CTL-PRV-01"];
ctl("BDESE-CTL-PRV-01", "Preuve",
  "La mise à disposition effective peut-elle être prouvée ?",
  ["L. 2312-18"],
  f => {
    const b = f.base || {};
    const elements = [
      !vide(b.support) && `support déclaré : ${b.support}`,
      !vide(b.dateDerniereMiseAJour) && `dernière mise à jour : ${b.dateDerniereMiseAJour}`,
      dit(b.informationMiseAJour) && "information des bénéficiaires déclarée",
      !vide(b.preuveAcces) && `trace d'accès : ${b.preuveAcces}`,
    ].filter(Boolean);
    if (!elements.length)
      return { etat: MANQ, motif: "Aucun élément ne documente la mise à disposition." };
    return { etat: RISQ, elements,
      motif: `Éléments réunis : ${elements.join(" ; ")}. Ce module constitue, structure, date et audite le contenu de la base — il ne la met pas à disposition et n'est pas la base. La mise à disposition reste un acte de l'employeur : elle se prouve par le support lui-même, ses traces d'accès et l'information donnée aux bénéficiaires. L'application ne peut pas en attester à votre place, et elle ne le fera pas.` };
  });

REC.surSilence(C, ["BDESE-CTL-REG-01"]);

module.exports = { C, ETATS, DETECTION, COHERENCE, PLANCHER };

if (require.main === module) {
  console.log(`${C.length} contrôles · plancher de ${PLANCHER.length} thèmes`);
  const rub = {};
  for (const c of C) (rub[c.rubrique] = rub[c.rubrique] || []).push(c.id);
  for (const r of Object.keys(rub)) console.log(`  ${r} — ${rub[r].length} : ${rub[r].join(", ")}`);
  const sansTexte = C.filter(c => !c.fondement || !c.fondement.length);
  if (sansTexte.length) { console.error("Contrôles sans fondement : " + sansTexte.map(c => c.id).join(", ")); process.exit(1); }
  console.log(`dont détection ${DETECTION.length}, cohérence ${COHERENCE.length} — tous fondés sur un article`);
}
