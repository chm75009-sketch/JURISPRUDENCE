/* Quel régime s'applique à la base de données, et à quelle date il s'impose.

   C'est la pièce sur laquelle tout le reste repose : le contenu exigible n'est
   pas le même selon que l'entreprise est régie par un accord d'entreprise, par
   un accord de branche, ou par le supplétif du décret. Se tromper ici, c'est
   auditer un contenu que la loi ne demande pas.

   TROIS RÈGLES DE MÉTHODE, écrites ici plutôt que dispersées :

   1. Le régime est INDÉTERMINÉ tant que l'accord applicable n'a pas été
      recherché ET vérifié. Le supplétif ne s'applique pas « par défaut » au
      sens de « quand on n'a rien trouvé » : il s'applique en l'absence
      d'accord, ce qui est un fait à établir, pas un silence à interpréter.
      Une entreprise qui ignore si un accord existe n'est pas sous le supplétif :
      elle est sous un régime qu'elle n'a pas identifié.

   2. Le seuil qui commande la BDESE n'est pas celui du comité. Le comité se met
      en place à onze salariés ; les attributions récurrentes — dont la base
      relève — s'exercent à cinquante (L. 2312-2). Le contenu supplétif, lui,
      change à trois cents (R. 2312-8 en deçà, R. 2312-9 au-delà).

   3. Deux délais, souvent confondus, et un troisième que le texte ajoute :
      — L. 2312-2 : effectif d'au moins cinquante pendant douze mois consécutifs,
        puis DOUZE MOIS de plus avant que les attributions récurrentes s'exercent.
        Et si, à l'expiration de ce délai, le mandat restant à courir est
        inférieur à un an, le délai court à compter du renouvellement du comité —
        seconde phrase que le module lit, faute de quoi il annoncerait une date
        fausse ;
      — L. 2312-34 : le seuil de trois cents est réputé franchi après douze mois
        consécutifs de dépassement, et l'employeur dispose ensuite d'UN AN pour
        s'y conformer complètement.

   Ce fichier ne conclut sur aucun dossier. Il rend le régime et les dates ; ce
   sont les contrôles qui prononcent. */

const SEUIL_ATTRIBUTIONS = 50;
const SEUIL_CONTENU = 300;

const nombre = x => (typeof x === "number" && isFinite(x) ? x : null);
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && x !== "";

function ajouterMois(iso, mois) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ""))) return null;
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return null;
  const j = d.getUTCDate();
  d.setUTCMonth(d.getUTCMonth() + mois);
  if (d.getUTCDate() !== j) d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}
const moisEntre = (a, b) => {
  if (!a || !b) return null;
  const x = new Date(a + "T00:00:00Z"), y = new Date(b + "T00:00:00Z");
  if (isNaN(x) || isNaN(y)) return null;
  return (y.getUTCFullYear() - x.getUTCFullYear()) * 12 + (y.getUTCMonth() - x.getUTCMonth())
    - (y.getUTCDate() < x.getUTCDate() ? 1 : 0);
};

/* ------------------------------------------------------------- le régime */

const REGIMES = {
  ACCORD_ENTREPRISE: "accord d'entreprise",
  ACCORD_BRANCHE: "accord de branche",
  SUPPLETIF: "supplétif du décret",
  INDETERMINE: "indéterminé",
};

function regime(f) {
  const eff = nombre(f.effectif);

  /* La recherche de l'accord est un fait à établir. Tant qu'elle n'est pas
     déclarée faite, aucun régime n'est retenu — pas même le supplétif. */
  if (!renseigne(f.accordRecherche))
    return { regime: REGIMES.INDETERMINE, cause: "recherche non déclarée",
      motif: "Il n'est pas déclaré si un accord définissant la base a été recherché. Le régime supplétif ne s'applique pas faute d'avoir cherché : il s'applique en l'absence d'accord, ce qui est un fait à établir. Tant que la recherche n'est pas faite, le contenu exigible est inconnu — et l'audit ne peut pas conclure." };
  if (nie(f.accordRecherche))
    return { regime: REGIMES.INDETERMINE, cause: "recherche non faite",
      motif: "Aucune recherche d'accord n'a été conduite. Trois textes peuvent en porter un : un accord d'entreprise (L. 2312-21, al. 1er), un accord conclu avec le comité en l'absence de délégué syndical, ou — en deçà de trois cents salariés et à défaut d'accord d'entreprise — un accord de branche. Conduisez la recherche avant d'auditer le contenu." };

  if (dit(f.accordEntreprise)) {
    if (!dit(f.accordEntrepriseVerse))
      return { regime: REGIMES.INDETERMINE, cause: "accord déclaré non versé",
        motif: "Un accord d'entreprise est déclaré mais n'est pas versé. Le contenu exigible est celui qu'il définit : sans son texte, l'application ne peut vérifier ni ce qu'il contient, ni qu'il respecte le plancher de l'article L. 2312-21, alinéa 3. Joignez-le." };
    return { regime: REGIMES.ACCORD_ENTREPRISE, article: "L. 2312-21, al. 1er",
      motif: "Un accord d'entreprise définit l'organisation, l'architecture, le contenu et les modalités de fonctionnement de la base. C'est lui qui commande — sous la réserve du plancher de l'alinéa 3, auquel aucun accord ne peut descendre." };
  }

  if (dit(f.accordBranche)) {
    if (eff === null)
      return { regime: REGIMES.INDETERMINE, cause: "effectif inconnu",
        motif: "Un accord de branche est déclaré, mais l'effectif n'est pas renseigné. Or l'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés, et seulement à défaut d'accord d'entreprise (L. 2312-21, dernier alinéa)." };
    if (eff >= SEUIL_CONTENU)
      return { regime: REGIMES.SUPPLETIF, article: "R. 2312-9",
        motif: `Un accord de branche est déclaré, mais l'entreprise compte ${eff} salariés. L'accord de branche ne peut définir la base que dans les entreprises de moins de trois cents salariés : il ne s'applique pas ici, et le supplétif du décret reprend son empire.` };
    if (!dit(f.accordBrancheVerse))
      return { regime: REGIMES.INDETERMINE, cause: "accord de branche non versé",
        motif: "Un accord de branche est déclaré mais n'est pas versé. Le contenu exigible est celui qu'il définit ; sans son texte, il ne peut pas être vérifié." };
    return { regime: REGIMES.ACCORD_BRANCHE, article: "L. 2312-21, dernier alinéa",
      motif: `À défaut d'accord d'entreprise et l'effectif étant inférieur à trois cents salariés (${eff}), un accord de branche peut définir la base. C'est lui qui commande, sous la même réserve de plancher.` };
  }

  if (eff === null)
    return { regime: REGIMES.INDETERMINE, cause: "effectif inconnu",
      motif: "Aucun accord n'a été trouvé, mais l'effectif n'est pas renseigné : le contenu supplétif exigible dépend du seuil de trois cents salariés (R. 2312-8 en deçà, R. 2312-9 au-delà)." };

  /* L'absence d'accord se prouve, elle ne se déclare pas.

     La recherche déclarée « faite » est une affirmation ; ce qui l'établit est
     une déclaration datée et signée, disant qui a cherché, où, et à quelle date.
     Sans elle, le supplétif reposerait sur la seule parole de celui qui l'invoque
     — et c'est précisément ce que ce module refuse ailleurs. Tant que la preuve
     manque, le régime reste indéterminé. */
  const preuve = f.preuveAbsenceAccord || {};
  if (!renseigne(preuve.date) || !renseigne(preuve.auteur))
    return { regime: REGIMES.INDETERMINE, cause: "absence d'accord non prouvée",
      motif: "La recherche d'accord est déclarée faite et n'a rien trouvé, mais l'absence d'accord n'est pas établie : il y faut une déclaration datée et signée, disant qui a conduit la recherche et à quelle date. Sans elle, le régime supplétif reposerait sur une simple affirmation — et le contenu exigible resterait, en réalité, inconnu." };

  return { regime: REGIMES.SUPPLETIF,
    preuve: { date: preuve.date, auteur: preuve.auteur },
    article: eff >= SEUIL_CONTENU ? "R. 2312-9" : "R. 2312-8",
    seuil: eff >= SEUIL_CONTENU ? "au moins trois cents salariés" : "moins de trois cents salariés",
    motif: `Aucun accord ne définit la base — absence établie par la déclaration du ${preuve.date}, signée par ${preuve.auteur}. Le contenu est celui du décret, article ${eff >= SEUIL_CONTENU ? "R. 2312-9" : "R. 2312-8"}, l'entreprise comptant ${eff} salariés.` };
}

/* -------------------------------------------------- les dates d'exigibilité

   Deux calendriers distincts, qui ne se remplacent pas l'un l'autre. */

function exigibilite(f) {
  const eff = nombre(f.effectif);
  const out = { attributions: null, contenu300: null, avertissements: [] };

  /* L. 2312-2 — l'entrée dans les attributions récurrentes. */
  const d50 = f.dateSeuil50Atteint;          /* fin des douze mois consécutifs à cinquante */
  if (renseigne(d50)) {
    let terme = ajouterMois(d50, 12);
    let regle = "L. 2312-2, première phrase";
    const finMandat = f.dateFinMandat;
    if (renseigne(finMandat) && terme) {
      const reste = moisEntre(terme, finMandat);
      if (reste !== null && reste < 12) {
        /* Seconde phrase : le délai court à compter du renouvellement du comité.
           La date du renouvellement n'est pas déductible du reste — elle est
           demandée, et sans elle le module ne donne pas de date. */
        regle = "L. 2312-2, seconde phrase";
        if (renseigne(f.dateRenouvellementCSE)) {
          terme = ajouterMois(f.dateRenouvellementCSE, 12);
        } else {
          terme = null;
          out.avertissements.push("Le mandat du comité restant à courir est inférieur à un an à l'expiration du délai de douze mois : le délai court alors à compter du renouvellement du comité (L. 2312-2, seconde phrase). La date de ce renouvellement n'est pas renseignée — aucune date d'exigibilité n'est annoncée, plutôt qu'une date fausse.");
        }
      }
    } else if (renseigne(f.dateSeuil50Atteint) && !renseigne(finMandat)) {
      out.avertissements.push("La date de fin des mandats en cours n'est pas renseignée. Si, à l'expiration du délai de douze mois, le mandat restant à courir est inférieur à un an, le délai court à compter du renouvellement du comité (L. 2312-2, seconde phrase) : la date ci-dessous serait alors fausse.");
    }
    out.attributions = { date: terme, regle,
      motif: terme
        ? `L'effectif ayant atteint cinquante salariés pendant douze mois consécutifs au ${d50}, les attributions récurrentes — dont la base de données relève — s'exercent à compter du ${terme} (${regle}).`
        : `Le terme ne peut pas être calculé : ${regle} renvoie au renouvellement du comité, dont la date n'est pas connue.` };
  }

  /* L. 2312-34 — le passage au contenu des entreprises de trois cents et plus. */
  const d300 = f.dateSeuil300Franchi;        /* fin des douze mois consécutifs de dépassement */
  if (renseigne(d300)) {
    const terme = ajouterMois(d300, 12);
    out.contenu300 = { date: terme, regle: "L. 2312-34",
      motif: `Le seuil de trois cents salariés est réputé franchi au ${d300}, après douze mois consécutifs de dépassement. L'employeur dispose d'un an à compter de ce franchissement — soit jusqu'au ${terme} — pour se conformer complètement aux obligations qui en découlent, dont le contenu de l'article R. 2312-9.` };
  } else if (eff !== null && eff >= SEUIL_CONTENU) {
    out.avertissements.push("L'effectif atteint trois cents salariés, mais la date de franchissement du seuil n'est pas renseignée. Le seuil n'est réputé franchi qu'après douze mois consécutifs de dépassement, et l'employeur dispose ensuite d'un an (L. 2312-34) : sans cette date, l'application ne sait pas si le contenu de R. 2312-9 est déjà exigible.");
  }

  return out;
}

/* -------------------------------------------- les délais de consultation

   R. 2312-5 donne le point de départ, R. 2312-6 la durée. Ils ne se déduisent
   pas de l'accord BDESE : l'accord de l'article L. 2312-19 est un autre accord,
   et un accord sur la base ne déplace pas la périodicité des consultations. */
const DELAIS_CONSULTATION = { simple: 1, expertise: 2, centralEtEtablissements: 3 };

function delaiConsultation(f) {
  const c = f.consultation || {};
  if (dit(f.accordDelaisConsultation)) {
    return { connu: false, article: "L. 2312-19, 4°",
      motif: "Un accord fixe les délais dans lesquels les avis du comité sont rendus (L. 2312-19, 4°). C'est lui qui commande, non le mois supplétif de l'article R. 2312-6 — et l'application ne peut vérifier que ce qu'elle lit : joignez-le." };
  }
  const expertises = nombre(c.nbExpertises);
  const central = dit(c.centralEtEtablissements);
  let mois = DELAIS_CONSULTATION.simple, cas = "aucune expertise";
  if (central && expertises !== null && expertises >= 1) { mois = DELAIS_CONSULTATION.centralEtEtablissements; cas = "expertises au niveau central et d'établissement"; }
  else if (expertises !== null && expertises >= 1) { mois = DELAIS_CONSULTATION.expertise; cas = "intervention d'un expert"; }
  const depart = c.dateMiseADisposition || c.dateCommunication;
  return { connu: true, mois, cas, depart,
    terme: depart ? ajouterMois(depart, mois) : null,
    article: "R. 2312-5, R. 2312-6",
    motif: `Le délai court de la communication des informations ou de l'information de leur mise à disposition dans la base (R. 2312-5). À défaut d'accord, le comité est réputé consulté et avoir rendu un AVIS NÉGATIF à l'expiration d'un délai de ${mois} mois — ${cas} (R. 2312-6, I)${depart ? `, soit au ${ajouterMois(depart, mois)}` : ""}. Lorsque le comité central et des comités d'établissement sont consultés, l'avis de chaque établissement est rendu au plus tard sept jours avant ce terme, à défaut de quoi il est réputé négatif (R. 2312-6, II).` };
}

/* -------------------------------------------------- les années couvertes

   R. 2312-10 : l'année en cours, les deux précédentes et les trois suivantes.
   Les trois suivantes peuvent être données EN GRANDES TENDANCES, à défaut de
   chiffres — et l'employeur doit indiquer, en les motivant, les informations
   qui ne peuvent recevoir ni chiffres ni tendances. Un contrôle qui exigerait
   six colonnes chiffrées produirait des non-conformités fausses. */
function annees(f, anneeCourante) {
  const n = nombre(anneeCourante) || new Date().getUTCFullYear();
  return {
    passees: [n - 2, n - 1], courante: n, suivantes: [n + 1, n + 2, n + 3],
    article: "R. 2312-10",
    tendancesAdmises: true,
    motif: "En l'absence d'accord, les informations portent sur l'année en cours, les deux précédentes et, telles qu'elles peuvent être envisagées, les trois suivantes. Elles sont présentées sous forme de données chiffrées ou, à défaut et pour les années suivantes seulement, sous forme de grandes tendances. L'employeur indique en outre, en précisant ses raisons, les informations qui ne peuvent faire l'objet ni de chiffres ni de tendances.",
  };
}

module.exports = { regime, exigibilite, delaiConsultation, annees,
  REGIMES, SEUIL_ATTRIBUTIONS, SEUIL_CONTENU, DELAIS_CONSULTATION,
  ajouterMois, moisEntre };
