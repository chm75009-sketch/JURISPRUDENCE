/* LES CONTRATS DE TRAVAIL DU TRANSPORT ROUTIER DE MARCHANDISES.

   POURQUOI CE FICHIER EXISTE

   Demande du 24 septembre 2026 : « mettre des modèles de contrats de travail
   conformes, précis, adaptés au secteur transport », pour quatre emplois :
   conducteur marchandises PL/SPL, grand routier ou longue distance,
   conducteur ADR ou frigorifique, et les sédentaires (exploitation, quai,
   atelier, administratif).

   Le contrat de travail que l'application produisait était celui de n'importe
   quelle entreprise : un emploi, un horaire, un salaire. Dans le transport
   routier, rien de cela ne suffit. La durée du travail n'est pas la durée
   légale mais le temps de service, avec ses équivalences ; le conducteur doit
   détenir un permis, une qualification et une carte ; le chronotachygraphe
   enregistre ce qu'il fait ; les repas et les découchés sont indemnisés par
   la convention, au forfait ; et les maxima ne sont pas ceux du code du
   travail.

   CE QUI EST ÉCRIT ICI, ET D'OÙ CELA VIENT

   Chaque valeur porte sa source, et chaque source a été lue le 24 septembre
   2026 par le relais Légifrance, avec l'identifiant de la version lue. Rien
   n'est écrit de mémoire.

   - Code des transports, durée du travail des personnels roulants :
     D. 3312-45 (LEGIARTI000033450327), D. 3312-46 (LEGIARTI000033450329),
     R. 3312-47 (LEGIARTI000033450331), R. 3312-48 (LEGIARTI000033450333),
     R. 3312-50 (LEGIARTI000033450337), R. 3312-51 (LEGIARTI000033450339),
     L. 3312-1 (LEGIARTI000033021297).
   - Formation des conducteurs : R. 3314-8 (LEGIARTI000033450443) et
     R. 3314-10 (LEGIARTI000044326235), formation continue tous les cinq ans.
   - Code du travail : L. 1221-19 (LEGIARTI000019071113) et L. 1221-21
     (LEGIARTI000019071109) pour l'essai, L. 1242-12 (LEGIARTI000006901206)
     pour les mentions du CDD, L. 3123-6 (LEGIARTI000033020080) pour le temps
     partiel.
   - Convention collective nationale des transports routiers et activités
     auxiliaires du transport, IDCC 16 (KALICONT000005635624) :
     essai, annexe I article 3 (KALIARTI000005849363) ;
     préavis, annexe I article 5 (KALIARTI000045968978) ;
     visites médicales, annexe I article 11 bis (KALIARTI000005849396) ;
     rémunération globale garantie, annexe I article 12 (KALIARTI000005849403) ;
     taux horaires et garanties annuelles des ouvriers « marchandises »,
     accord du 11 octobre 2023 (KALIARTI000049067165), en vigueur depuis le
     1er décembre 2023 ;
     frais de déplacement « marchandises », avenant n° 81 du 2 décembre 2025
     (KALIARTI000053715771), en vigueur depuis le 1er janvier 2026.

   CE QUI N'EST PAS ÉCRIT ICI

   Le montant du SMIC. Il est fixé par décret et change sans prévenir ce
   fichier. Les taux conventionnels « marchandises » n'ont pas bougé depuis le
   1er décembre 2023 et sont passés sous le SMIC : le module le dit, demande
   le SMIC en vigueur et retient le plus favorable. Écrire un contrat au taux
   conventionnel sans regarder le SMIC, c'est écrire un contrat illicite.   */

"use strict";
(function (window) {

  /* ══════════════════ 1 · CE QUE DIT LA CONVENTION ═══════════════════ */

  var CCN = {
    idcc: "16",
    nom: "Convention collective nationale des transports routiers et activités " +
      "auxiliaires du transport du 21 décembre 1950",
    id: "KALICONT000005635624",
    lu: "2026-09-24",

    /* Taux horaires des ouvriers « marchandises », accord du 11 octobre 2023,
       en vigueur au 1er décembre 2023. Les groupes sont ceux de la
       nomenclature de l'annexe I. */
    salaires: {
      source: "Accord du 11 octobre 2023 relatif à la revalorisation des rémunérations",
      article: "KALIARTI000049067165",
      depuis: "2023-12-01",
      lignes: [
        { coef: "110 M", embauche: 12.09, ans2: 12.3318, ans5: 12.5736, ans10: 12.8154, ans15: 13.0572 },
        { coef: "115 M", embauche: 12.09, ans2: 12.3318, ans5: 12.5736, ans10: 12.8154, ans15: 13.0572 },
        { coef: "118 M", embauche: 12.09, ans2: 12.3318, ans5: 12.5736, ans10: 12.8154, ans15: 13.0572 },
        { coef: "120 M", embauche: 12.09, ans2: 12.3318, ans5: 12.5736, ans10: 12.8154, ans15: 13.0572 },
        { coef: "128 M", embauche: 12.12, ans2: 12.3624, ans5: 12.6048, ans10: 12.8472, ans15: 13.0896 },
        { coef: "138 M", embauche: 12.14, ans2: 12.3828, ans5: 12.6256, ans10: 12.8684, ans15: 13.1112 },
        { coef: "150 M", embauche: 12.43, ans2: 12.6786, ans5: 12.9272, ans10: 13.1758, ans15: 13.4244 },
      ],
      /* Garanties annuelles de rémunération, mêmes source et date. */
      gar151: { "110 M": 22664.41, "115 M": 22664.41, "118 M": 22664.41, "120 M": 22664.41,
        "128 M": 22720.65, "138 M": 22758.14, "150 M": 23301.79 },
      gar169: { "115 M": 25901.12, "118 M": 25901.12, "120 M": 25901.12,
        "128 M": 25965.39, "138 M": 26008.24, "150 M": 26629.52 },
      gar200: { "115 M": 32202.68, "118 M": 32202.68, "120 M": 32202.68,
        "128 M": 32282.59, "138 M": 32335.86, "150 M": 33108.30 },
      dimanche: { court: 12.45, long: 28.94 },
    },

    /* Frais de déplacement « marchandises », avenant n° 81 du 2 décembre 2025,
       en vigueur au 1er janvier 2026. Ce sont des remboursements de frais, non
       du salaire : ils ne comptent pas dans la rémunération garantie. */
    frais: {
      source: "Avenant n° 81 du 2 décembre 2025 au protocole du 30 avril 1974",
      article: "KALIARTI000053715771",
      depuis: "2026-01-01",
      repas: 16.36,
      repasUnique: 10.07,
      repasUniqueNuit: 9.81,
      speciale: 4.42,
      casseCroute: 8.87,
      grandDeplacement1: 52.31,
      grandDeplacement2: 68.67,
    },

    essai: {
      conduite: "1 mois",
      autres: "2 semaines",
      article: "annexe I, article 3",
      id: "KALIARTI000005849363",
    },

    preavis: {
      article: "annexe I, article 5",
      id: "KALIARTI000045968978",
      demission: "2 semaines dans le transport routier de marchandises et les activités auxiliaires",
      licenciement: [
        "moins de 6 mois d'ancienneté, période d'essai comprise : 1 semaine",
        "de 6 mois à 2 ans : 1 mois",
        "2 ans et au-delà : 2 mois",
      ],
    },
  };

  /* ══════════════════ 2 · LES QUATRE PROFILS ════════════════════════ */

  /* Le temps de service, et non la durée légale. D. 3312-45 fixe la durée
     réputée équivalente à la durée légale : 43 heures par semaine pour les
     grands routiers, 39 pour les autres roulants, 35 pour la messagerie. Au
     mois, D. 3312-46 : 186 heures et 169 heures. Au-delà, heures
     supplémentaires (R. 3312-47). */
  var PROFILS = [
    {
      cle: "pl",
      nom: "Conducteur marchandises PL ou SPL",
      sous: "Courte distance, retour quotidien au domicile",
      roulant: true,
      equivalence: "39 heures par semaine, 169 heures par mois",
      mensuel: 169,
      hebdo: 39,
      maxSemaine: "52 heures sur une semaine isolée, 50 heures en moyenne sur trois mois " +
        "quand tous les transports sont faits avec des véhicules de plus de 3,5 tonnes " +
        "(R. 3312-50)",
      coefs: ["128 M", "138 M", "150 M"],
      coefDefaut: "138 M",
      permis: "C ou CE en cours de validité",
      titres: ["FIMO ou titre équivalent", "FCO en cours de validité (R. 3314-10)",
        "carte de conducteur pour le chronotachygraphe"],
      clauses: ["chronotachygraphe", "vehicule", "amplitude"],
    },
    {
      cle: "grand",
      nom: "Conducteur grand routier ou longue distance",
      sous: "Découchés, deux repas hors du domicile",
      roulant: true,
      equivalence: "43 heures par semaine, 186 heures par mois",
      mensuel: 186,
      hebdo: 43,
      maxSemaine: "56 heures sur une semaine isolée, 53 heures en moyenne sur trois mois " +
        "quand tous les transports sont faits avec des véhicules de plus de 3,5 tonnes " +
        "(R. 3312-50)",
      coefs: ["138 M", "150 M"],
      coefDefaut: "150 M",
      permis: "CE en cours de validité",
      titres: ["FIMO ou titre équivalent", "FCO en cours de validité (R. 3314-10)",
        "carte de conducteur pour le chronotachygraphe"],
      clauses: ["chronotachygraphe", "vehicule", "amplitude", "decouche"],
    },
    {
      cle: "adr",
      nom: "Conducteur ADR ou température dirigée",
      sous: "Matières dangereuses, ou transport sous température dirigée",
      roulant: true,
      equivalence: "39 heures par semaine, 169 heures par mois ; 43 heures et 186 heures " +
        "si le poste est tenu en grand routier",
      mensuel: 169,
      hebdo: 39,
      maxSemaine: "52 heures sur une semaine isolée, 50 heures en moyenne sur trois mois " +
        "quand tous les transports sont faits avec des véhicules de plus de 3,5 tonnes " +
        "(R. 3312-50)",
      coefs: ["138 M", "150 M"],
      coefDefaut: "150 M",
      permis: "C ou CE en cours de validité",
      titres: ["FIMO ou titre équivalent", "FCO en cours de validité (R. 3314-10)",
        "carte de conducteur pour le chronotachygraphe",
        "certificat de formation ADR du conducteur, en cours de validité"],
      clauses: ["chronotachygraphe", "vehicule", "amplitude", "adr"],
    },
    {
      cle: "sedentaire",
      nom: "Sédentaire : exploitation, quai, atelier, administratif",
      sous: "Exploitant, agent de quai, mécanicien, employé administratif",
      roulant: false,
      equivalence: "durée légale, 35 heures par semaine, 151,67 heures par mois",
      mensuel: 151.67,
      hebdo: 35,
      maxSemaine: "48 heures sur une semaine isolée et 44 heures en moyenne sur douze " +
        "semaines (code du travail, L. 3121-20 et L. 3121-22)",
      coefs: ["110 M", "115 M", "118 M", "120 M", "128 M", "138 M", "150 M"],
      coefDefaut: "120 M",
      permis: "",
      titres: [],
      clauses: ["horaire"],
    },
  ];

  /* ══════════════════ 3 · LES ARTICLES DU CONTRAT ═══════════════════ */

  /* Les milliers se séparent dans la partie entière, jamais dans les
     décimales : le taux horaire sortait « 12,4 300 euros ». Mesuré le
     24 septembre 2026 sur les contrats relus. */
  function fr(n, dec) {
    var d = dec === undefined ? 2 : dec;
    var p = Number(n).toFixed(d).split(".");
    return p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (p[1] ? "," + p[1] : "");
  }

  /* « de Argenteuil » ne se dit pas. */
  function de(lieu) {
    var s = net(lieu);
    if (!s) return "";
    return /^[aeiouyàâäéèêëîïôöùûüh]/i.test(s) ? "d'" + s : "de " + s;
  }
  function net(v) { return String(v == null ? "" : v).trim(); }

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];
  function dateFr(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(net(iso));
    if (!m) return net(iso) || "[DATE]";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }

  function profil(cle) {
    var p = null;
    PROFILS.forEach(function (x) { if (x.cle === cle) p = x; });
    return p || PROFILS[0];
  }

  function tauxDe(coef) {
    var t = null;
    CCN.salaires.lignes.forEach(function (l) { if (l.coef === coef) t = l.embauche; });
    return t;
  }

  /* Le contrat, article par article. Chaque bloc est { h2 } ou { p } ou
     { note }, ce que sait rendre AuditExport comme l'écran. */
  function ecrire(v) {
    var p = profil(v.profil);
    var B = [];
    var ent = v.entreprise || {};
    var cdd = v.nature === "cdd";
    var partiel = !!v.partiel;
    var heures = Number(v.mensuel) || p.mensuel;
    var taux = Number(v.taux) || tauxDe(v.coef) || 0;
    var smic = Number(v.smic) || 0;
    var retenu = smic && smic > taux ? smic : taux;

    /* LE MOTIF, PARTOUT DANS LE CDD.
       Demande du 24 septembre 2026 : « tu mets le motif partout pour le CDD ».
       Il ouvre le document, il est l'objet de l'article 1er, il est rappelé à
       l'emploi et au terme. C'est lui qui rend le contrat licite, et c'est la
       première chose que le juge regarde : un motif écrit une fois, au milieu
       d'une page, se perd. */
    var motif = net(v.motif) || "[MOTIF DU RECOURS]";

    B.push({ k: "sur", t: (cdd ? "Contrat de travail à durée déterminée" : "Contrat de travail à durée indéterminée") +
      (partiel ? " à temps partiel" : "") + (cdd ? " - motif : " + motif : "") });
    B.push({ k: "t1", t: p.nom });
    B.push({ k: "trait" });

    B.push({ k: "p", t: "Entre les soussignés :" });
    B.push({ k: "p", t: (ent.denomination || "[DÉNOMINATION]") + ", " +
      (ent.adresse ? "dont le siège est " + ent.adresse : "[ADRESSE DU SIÈGE]") + ", " +
      (ent.siret ? "immatriculée sous le numéro SIRET " + ent.siret : "[SIRET]") +
      ", représentée par " + (ent.responsable || "[REPRÉSENTANT LÉGAL]") +
      ", ci-après désignée « l'entreprise »," });
    B.push({ k: "p", t: "d'une part," });
    B.push({ k: "p", t: (v.nom || "[NOM ET PRÉNOM DU SALARIÉ]") + ", demeurant " +
      (v.adresse || "[ADRESSE DU SALARIÉ]") + ", de nationalité " +
      (v.nationalite || "[NATIONALITÉ]") + ", né le " + dateFr(v.naissance) + " à " +
      (v.lieuNaissance || "[LIEU DE NAISSANCE]") + ", numéro de sécurité sociale " +
      (v.nir || "[NUMÉRO]") + ", ci-après désigné « le salarié »," });
    B.push({ k: "p", t: "d'autre part," });
    B.push({ k: "p", t: "il a été convenu ce qui suit." });

    B.push({ k: "h2", t: cdd ? "Article 1 - Engagement et motif du recours" : "Article 1 - Engagement" });
    if (cdd) {
      B.push({ k: "p", t: "L'entreprise engage le salarié à durée déterminée, à compter du " +
        dateFr(v.entree) + ", pour le motif suivant : " + motif + "." });
      B.push({ k: "p", t: v.terme
        ? "Le contrat prend fin le " + dateFr(v.terme) + ". Il est conclu pour ce motif et pour " +
          "lui seul ; il cesse de plein droit à cette date."
        : "Le contrat est conclu sans terme précis ; il prendra fin à la réalisation de son objet, " +
          "à savoir " + motif + ", et il est conclu pour une durée minimale de " +
          (v.duree || "[DURÉE MINIMALE]") + "." });
      B.push({ k: "note", t: "Le motif doit être précis : c'est lui qui rend le contrat licite, et à défaut " +
        "le contrat est réputé à durée indéterminée (L. 1242-12). Le terme imprécis n'est possible que " +
        "dans les cas de l'article L. 1242-7, remplacement, attente d'une entrée en service, emploi " +
        "saisonnier ou d'usage : un accroissement temporaire d'activité appelle un terme daté." });
    } else {
      B.push({ k: "p", t: "L'entreprise engage le salarié à durée indéterminée à compter du " +
        dateFr(v.entree) + "." });
    }
    B.push({ k: "p", t: "L'engagement est subordonné au résultat de la visite d'information et de " +
      "prévention, ou de l'examen médical d'aptitude lorsque le poste le commande." });

    B.push({ k: "h2", t: "Article 2 - Emploi, qualification et classification" });
    B.push({ k: "p", t: "Le salarié est engagé en qualité de " + (v.emploi || p.nom) +
      ", groupe " + (v.groupe || "[GROUPE]") + ", coefficient " + (v.coef || "[COEFFICIENT]") +
      " de la nomenclature des emplois annexée à la convention collective" +
      (cdd ? ", pour les besoins qui tiennent au motif ci-dessus, " + motif : "") + "." });
    B.push({ k: "p", t: "Il exerce ses fonctions sous l'autorité de l'entreprise et selon les " +
      "instructions qui lui sont données, dans le respect de la réglementation sociale " +
      "européenne applicable au transport routier." });

    if (p.roulant) {
      B.push({ k: "h2", t: "Article 3 - Titres et qualifications exigés" });
      B.push({ k: "p", t: "Le salarié déclare détenir, et s'engage à maintenir en cours de validité " +
        "pendant toute l'exécution du contrat :" });
      B.push({ k: "puce", t: "le permis de conduire " + p.permis });
      p.titres.forEach(function (t) { B.push({ k: "puce", t: t }); });
      B.push({ k: "puce", t: "l'attestation d'aptitude médicale liée au permis" });
      B.push({ k: "p", t: "Il informe l'entreprise sans délai de toute suspension, annulation ou " +
        "restriction de son permis, ainsi que de l'expiration prochaine de l'un de ces titres. " +
        "La perte du permis ou d'une qualification nécessaire à la conduite met le salarié dans " +
        "l'impossibilité d'exécuter son contrat." });
      B.push({ k: "note", t: "La formation continue obligatoire est à renouveler tous les cinq ans " +
        "(R. 3314-10). Son coût et le temps passé sont à la charge de l'entreprise, comme les " +
        "visites médicales obligatoires (convention collective, annexe I, article 11 bis)." });
    }

    var n = p.roulant ? 4 : 3;
    B.push({ k: "h2", t: "Article " + n + " - Lieu de travail et rattachement" });
    B.push({ k: "p", t: "Le salarié est rattaché à l'établissement " +
      de(v.lieu || ent.adresse || "[LIEU DE RATTACHEMENT]") + ", où il prend et quitte son service." });
    if (p.roulant) {
      B.push({ k: "p", t: "Par la nature même de l'emploi, le salarié exerce son activité sur " +
        "l'ensemble du territoire " + (v.zone || "national et, le cas échéant, européen") +
        ". Ces déplacements sont inhérents à la fonction et ne constituent pas une modification " +
        "du contrat de travail." });
    }

    n++;
    B.push({ k: "h2", t: "Article " + n + " - Durée du travail" +
      (partiel ? ", à temps partiel" : "") });
    /* LE TEMPS PARTIEL, Y COMPRIS POUR UN CONDUCTEUR.
       Demande du 24 septembre 2026. Un conducteur peut être à temps partiel :
       il garde son temps de service et ses équivalences, mais le contrat doit
       porter en plus ce qu'exige L. 3123-6, la durée, sa répartition, les cas
       de modification et le délai de prévenance. Sans ces mentions, le contrat
       est présumé à temps complet, et la présomption se paie en rappel de
       salaire. */
    if (partiel) {
      B.push({ k: "p", t: "Le salarié est engagé à temps partiel pour une durée de " + fr(heures, 2) +
        " heures par mois" + (p.roulant ? ", décomptée en temps de service" : "") +
        ", répartie comme suit : " + (net(v.repartition) || "[RÉPARTITION ENTRE LES JOURS DE LA SEMAINE]") + "." });
      B.push({ k: "p", t: "Cette répartition peut être modifiée dans les cas suivants : " +
        (net(v.modification) || "[CAS DE MODIFICATION, PAR EXEMPLE ABSENCE D'UN SALARIÉ, SURCROÎT DE COMMANDES]") +
        ". Toute modification est notifiée au salarié en respectant un délai de prévenance de sept " +
        "jours ouvrés." });
      B.push({ k: "p", t: "Les horaires de chaque journée travaillée sont communiqués au salarié par " +
        (net(v.communication) || "[PLANNING REMIS OU AFFICHÉ, ET SELON QUELLE PÉRIODICITÉ]") + "." });
      B.push({ k: "p", t: "Des heures complémentaires peuvent être demandées dans la limite du dixième " +
        "de la durée prévue au contrat, ou du tiers lorsqu'un accord collectif le permet. Elles ne " +
        "peuvent porter la durée du travail au niveau de la durée légale ou, pour le personnel " +
        "roulant, au niveau de la durée d'équivalence." });
      B.push({ k: "p", t: "Le salarié bénéficie d'une priorité pour occuper un emploi à temps complet " +
        "ressortissant à sa catégorie professionnelle, ou un emploi équivalent." });
      B.push({ k: "note", t: "Le contrat à temps partiel doit mentionner la qualification, les éléments " +
        "de la rémunération, la durée et sa répartition, les cas de modification et la façon dont les " +
        "horaires sont communiqués : à défaut, il est présumé à temps complet (L. 3123-6)." });
    }
    if (p.roulant) {
      B.push({ k: "p", t: "La durée du travail du personnel roulant est décomptée en temps de service. " +
        "Pour l'emploi occupé, la durée réputée équivalente à la durée légale est fixée à " +
        p.equivalence + " (code des transports, D. 3312-45)." });
      B.push({ k: "p", t: (partiel
        ? "Les heures de temps de service accomplies de la trente-sixième heure "
        : "Le temps de service mensuel du salarié est fixé à " + fr(heures, 2) +
          " heures. Les heures de temps de service accomplies de la trente-sixième heure ") +
        "hebdomadaire jusqu'à la durée d'équivalence sont rémunérées selon les taux prévus par " +
        "la convention collective (D. 3312-46) ; au-delà de la durée d'équivalence, elles sont " +
        "des heures supplémentaires (R. 3312-47)." });
      B.push({ k: "p", t: "Le temps de service ne peut excéder douze heures par jour (R. 3312-51), ni " +
        p.maxSemaine + ". Lorsque le salarié est travailleur de nuit, ou accomplit une partie de " +
        "son travail entre 24 heures et 5 heures, sa durée quotidienne ne peut excéder dix heures " +
        "(L. 3312-1)." });
      B.push({ k: "p", t: "Les heures supplémentaires ouvrent droit à la compensation obligatoire en " +
        "repos prévue par l'article R. 3312-48 du code des transports, dont le décompte est " +
        "trimestriel." });
      B.push({ k: "p", t: "Le temps de service est enregistré par le chronotachygraphe et par la carte " +
        "de conducteur. Le salarié s'engage à introduire sa carte, à la conserver en état de " +
        "fonctionnement, à saisir manuellement les périodes non enregistrées et à remettre les " +
        "disques ou les données à l'entreprise selon la périodicité qu'elle fixe." });
    } else if (!partiel) {
      B.push({ k: "p", t: "La durée du travail est fixée à " + fr(heures, 2) + " heures par mois, " +
        "soit " + fr(p.hebdo, 0) + " heures par semaine, selon l'horaire affiché dans " +
        "l'établissement." });
      B.push({ k: "p", t: "La durée du travail ne peut excéder " + p.maxSemaine + "." });
    }

    n++;
    B.push({ k: "h2", t: "Article " + n + " - Rémunération" });
    B.push({ k: "p", t: "Le salarié perçoit un salaire mensuel brut calculé sur la base de " +
      fr(heures, 2) + " heures au taux horaire de " + fr(retenu, 4) + " euros, soit " +
      fr(retenu * heures, 2) + " euros bruts par mois." });
    if (v.coef && CCN.salaires.gar151[v.coef]) {
      var gar = heures >= 200 ? CCN.salaires.gar200[v.coef]
        : (heures >= 169 ? CCN.salaires.gar169[v.coef] : CCN.salaires.gar151[v.coef]);
      if (gar) B.push({ k: "p", t: "La rémunération annuelle du salarié ne peut être inférieure à la " +
        "garantie annuelle de rémunération attachée au coefficient " + v.coef + " pour " +
        (heures >= 200 ? "200" : (heures >= 169 ? "169" : "151,67")) + " heures, soit " +
        fr(gar, 2) + " euros (" + CCN.salaires.source + ", en vigueur depuis le " +
        dateFr(CCN.salaires.depuis) + ")." });
    }
    if (smic && taux && smic > taux) {
      B.push({ k: "note", t: "Le taux conventionnel du coefficient " + (v.coef || "") + " est de " +
        fr(taux, 4) + " euros, inférieur au SMIC horaire de " + fr(smic, 4) +
        " euros : c'est le SMIC qui s'applique, et c'est lui qui est porté au contrat." });
    }
    if (p.roulant) {
      B.push({ k: "p", t: "S'ajoutent, le cas échéant, l'indemnisation du travail du dimanche et des " +
        "jours fériés, et les majorations prévues par la convention collective." });
    }
    B.push({ k: "p", t: "La rémunération est versée mensuellement, à terme échu." });

    if (p.roulant) {
      n++;
      B.push({ k: "h2", t: "Article " + n + " - Frais de déplacement" });
      B.push({ k: "p", t: "Lorsque le service du salarié l'oblige à prendre un repas ou à découcher hors " +
        "de son domicile, l'entreprise lui verse les indemnités forfaitaires prévues par le " +
        "protocole du 30 avril 1974 annexé à la convention collective, aux taux en vigueur." });
      B.push({ k: "p", t: "À la date du présent contrat, ces taux sont les suivants (" + CCN.frais.source +
        ", en vigueur depuis le " + dateFr(CCN.frais.depuis) + ") :" });
      B.push({ k: "table",
        head: ["Indemnité", "Montant"],
        rows: [
          ["Repas", fr(CCN.frais.repas) + " €"],
          ["Repas unique", fr(CCN.frais.repasUnique) + " €"],
          ["Repas unique « nuit »", fr(CCN.frais.repasUniqueNuit) + " €"],
          ["Casse-croûte", fr(CCN.frais.casseCroute) + " €"],
          ["Indemnité spéciale", fr(CCN.frais.speciale) + " €"],
          ["Grand déplacement, 1 repas et 1 découcher", fr(CCN.frais.grandDeplacement1) + " €"],
          ["Grand déplacement, 2 repas et 1 découcher", fr(CCN.frais.grandDeplacement2) + " €"],
        ] });
      B.push({ k: "note", t: "Ces indemnités remboursent des frais : elles ne sont pas du salaire et " +
        "n'entrent pas dans la rémunération garantie (convention collective, annexe I, " +
        "article 12)." });
    }

    n++;
    B.push({ k: "h2", t: "Article " + n + " - Période d'essai" });
    if (cdd) {
      B.push({ k: "p", t: "Le contrat comporte une période d'essai de " + (v.essai || "[DURÉE]") +
        ", calculée à raison d'un jour par semaine de contrat, dans la limite de deux semaines " +
        "lorsque la durée initiale est au plus égale à six mois, et d'un mois au-delà." });
    } else {
      B.push({ k: "p", t: "Le contrat comporte une période d'essai de " +
        (v.essai || (p.roulant ? CCN.essai.conduite : CCN.essai.autres)) +
        ", pendant laquelle chacune des parties peut rompre le contrat sans préavis ni " +
        "indemnité, sous réserve du délai de prévenance légal." });
      B.push({ k: "note", t: "La convention collective fixe l'essai du personnel de conduite à " +
        CCN.essai.conduite + " et celui des autres ouvriers à " + CCN.essai.autres +
        " (" + CCN.essai.article + "). Le maximum légal pour un ouvrier est de deux mois " +
        "(L. 1221-19)." });
    }

    n++;
    B.push({ k: "h2", t: "Article " + n + " - Congés payés" });
    B.push({ k: "p", t: "Le salarié bénéficie des congés payés dans les conditions légales et " +
      "conventionnelles. Les dates sont fixées par l'entreprise en tenant compte des nécessités " +
      "du service." });

    if (!cdd) {
      n++;
      B.push({ k: "h2", t: "Article " + n + " - Rupture du contrat" });
      B.push({ k: "p", t: "Après la période d'essai, le contrat peut être rompu dans les conditions " +
        "légales, sous réserve du préavis fixé par la convention collective (" +
        CCN.preavis.article + ") :" });
      B.push({ k: "puce", t: "démission : " + CCN.preavis.demission });
      CCN.preavis.licenciement.forEach(function (l) { B.push({ k: "puce", t: "licenciement, " + l }); });
    }

    n++;
    B.push({ k: "h2", t: "Article " + n + " - Protection sociale" });
    B.push({ k: "p", t: "Le salarié est affilié aux régimes de retraite complémentaire et de prévoyance " +
      "dont relève l'entreprise, ainsi qu'à la couverture « frais de santé » obligatoire de la " +
      "branche." });

    if (p.roulant) {
      n++;
      B.push({ k: "h2", t: "Article " + n + " - Obligations particulières de conduite" });
      B.push({ k: "puce", t: "respecter les temps de conduite, de pause et de repos fixés par le " +
        "règlement (CE) n° 561/2006 et la réglementation nationale" });
      B.push({ k: "puce", t: "n'exercer aucune autre activité rémunérée susceptible de faire dépasser " +
        "ces durées, sans en informer l'entreprise" });
      B.push({ k: "puce", t: "signaler immédiatement tout accident, avarie, retard ou contrôle" });
      B.push({ k: "puce", t: "prendre soin du véhicule confié, de son chargement, des documents de bord " +
        "et des moyens de paiement remis" });
      B.push({ k: "puce", t: "s'abstenir de toute consommation d'alcool ou de substance psychoactive " +
        "pendant le service" });
      if (p.clauses.indexOf("adr") >= 0) {
        B.push({ k: "puce", t: "respecter les prescriptions de l'accord ADR pour le chargement, " +
          "la signalisation, les documents de transport et les équipements de protection" });
      }
      if (p.clauses.indexOf("decouche") >= 0) {
        B.push({ k: "puce", t: "prendre le repos hebdomadaire normal hors de la cabine, dans les " +
          "conditions prévues par le règlement (CE) n° 561/2006" });
      }
    }

    n++;
    B.push({ k: "h2", t: "Article " + n + " - Documents remis" });
    B.push({ k: "p", t: "Le salarié reconnaît avoir reçu un exemplaire du présent contrat, ainsi que " +
      "l'information sur la convention collective applicable, le règlement intérieur lorsqu'il " +
      "existe, et la notice des régimes de protection sociale." });

    B.push({ k: "p", t: "Fait à " + (v.lieuSignature || "[LIEU]") + ", le " + dateFr(v.dateSignature) +
      ", en deux exemplaires." });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "Pour l'entreprise" + "\t\t\t" + "Le salarié" });
    B.push({ k: "note", t: "Signature précédée de la mention « lu et approuvé », et paraphe de chaque page." });

    return B;
  }

  /* ══════════ 3 bis · CE QUI NE FAIT PAS PARTIE DU CONTRAT ══════════ */

  /* LA RÉSERVE D'USAGE, ET L'OBSERVATION.

     Demande du 24 septembre 2026 : « tu mets une réserve d'usage, avec une
     observation hors contrat qui dit le juge confronte après ce qui est écrit
     par rapport à la réalité, c'est ce que les juges retiennent ».

     Les deux sont hors du contrat, et le disent : une réserve glissée dans un
     acte qu'on signe n'a pas de sens, et le salarié ne signe pas une note
     d'avertissement. Sur le document produit, elles viennent après un saut de
     page, sous un titre qui écarte toute ambiguïté.                        */
  function reserve(v) {
    var p = profil(v.profil);
    var cdd = v && v.nature === "cdd";
    var B = [];
    B.push({ k: "saut" });
    B.push({ k: "sur", t: "Ne fait pas partie du contrat" });
    B.push({ k: "t1", t: "Réserve d'usage et observation" });
    B.push({ k: "trait" });

    B.push({ k: "h2", t: "Réserve d'usage" });
    B.push({ k: "p", t: "Ce document est un modèle. Il a été établi au vu des textes en vigueur " +
      "à la date de sa production, et il doit être relu et adapté au poste réel avant d'être " +
      "signé. Ce qui reste entre crochets n'est pas une formalité : c'est ce que le modèle ne " +
      "peut pas deviner." });
    B.push({ k: "puce", t: "Le taux horaire porté au contrat doit être comparé au SMIC en vigueur " +
      "au jour de l'embauche, et au minimum conventionnel du coefficient : c'est le plus élevé " +
      "des trois qui s'applique." });
    B.push({ k: "puce", t: "Les montants conventionnels, frais de déplacement, taux horaires et " +
      "garanties annuelles, changent par avenant : il faut vérifier qu'aucun avenant postérieur " +
      "n'est intervenu, et lequel vise le transport de marchandises." });
    if (p.roulant) {
      B.push({ k: "puce", t: "Les majorations propres au temps de service, la prime de travail de " +
        "nuit et, pour les grands routiers, la garantie d'amplitude, s'ajoutent au salaire de base " +
        "et doivent être portées sur le bulletin de paie." });
    }
    if (cdd) {
      B.push({ k: "puce", t: "Le motif doit correspondre à un cas de recours de l'article L. 1242-2, " +
        "et le terme être daté sauf dans les cas de l'article L. 1242-7. Le contrat doit être remis " +
        "au salarié dans les deux jours ouvrables suivant l'embauche." });
    }

    B.push({ k: "h2", t: "Observation" });
    B.push({ k: "p", t: "Le juge ne s'arrête pas à ce qui est écrit. Quand il est saisi, il " +
      "confronte le contrat à ce qui s'est réellement passé : les horaires réellement faits, le " +
      "travail réellement confié, le motif réellement à l'origine de l'embauche. C'est la réalité " +
      "qu'il retient, et le contrat ne vaut que s'il la décrit." });
    B.push({ k: "puce", t: "Un CDD dont le motif est écrit mais que les faits démentent est " +
      "requalifié en contrat à durée indéterminée." });
    B.push({ k: "puce", t: "Un temps partiel dont la répartition n'est pas tenue, ou dont les " +
      "horaires changent sans cesse, est requalifié en temps complet." });
    B.push({ k: "puce", t: "Une qualification ou un coefficient portés au contrat ne tiennent pas " +
      "si les fonctions exercées sont d'un autre niveau : c'est le travail fait qui décide." });
    B.push({ k: "puce", t: "Les heures payées doivent être celles qui ont été faites : les relevés " +
      "du chronotachygraphe et les plannings pèsent plus lourd que la clause du contrat." });
    B.push({ k: "note", t: "D'où la règle pratique : ce qu'on écrit, on le tient ; ce qu'on ne tient " +
      "pas, on ne l'écrit pas." });
    return B;
  }

  /* ══════════════════ 4 · LES FORMALITÉS, ET LE DROIT ═══════════════ */

  function formalites(v) {
    var p = profil(v.profil);
    var L = [
      { quoi: "Déclaration préalable à l'embauche (DPAE)",
        quand: "dans les huit jours qui précèdent l'embauche, et avant la prise de poste",
        ou: "URSSAF", loi: "L. 1221-10 et R. 1221-4 du code du travail" },
      { quoi: "Inscription au registre unique du personnel",
        quand: "au moment de l'embauche", ou: "dans l'entreprise",
        loi: "L. 1221-13 et D. 1221-23 du code du travail" },
      { quoi: "Visite d'information et de prévention",
        quand: "dans les trois mois de la prise de poste",
        ou: "service de prévention et de santé au travail",
        loi: "R. 4624-10 du code du travail" },
      { quoi: "Remise de l'exemplaire signé du contrat",
        quand: cddOui(v) ? "dans les deux jours ouvrables suivant l'embauche" : "à la signature",
        ou: "au salarié", loi: cddOui(v) ? "L. 1242-13 du code du travail" : "" },
    ];
    if (p.roulant) {
      L.push({ quoi: "Vérification du permis, de la FIMO ou FCO et de la carte de conducteur",
        quand: "avant la prise de poste, puis à chaque échéance",
        ou: "dans l'entreprise", loi: "R. 3314-10 du code des transports" });
      L.push({ quoi: "Remise de la carte de conducteur et consigne d'enregistrement",
        quand: "à la prise de poste", ou: "au salarié",
        loi: "règlement (UE) n° 165/2014" });
    }
    return L;
  }
  function cddOui(v) { return v && v.nature === "cdd"; }

  var DROIT = [
    { t: "Code des transports", a: [
      ["D. 3312-45", "durée du travail réputée équivalente : 43 heures par semaine pour les grands routiers, 39 heures pour les autres roulants, 35 heures pour la messagerie", "LEGIARTI000033450327"],
      ["D. 3312-46", "heures rémunérées de la 36e heure jusqu'à la durée d'équivalence, 186 ou 169 heures par mois", "LEGIARTI000033450329"],
      ["R. 3312-47", "heures supplémentaires au-delà de la durée d'équivalence", "LEGIARTI000033450331"],
      ["R. 3312-48", "compensation obligatoire en repos, décompte trimestriel", "LEGIARTI000033450333"],
      ["R. 3312-50", "durées maximales hebdomadaires du temps de service", "LEGIARTI000033450337"],
      ["R. 3312-51", "douze heures de temps de service par jour au plus", "LEGIARTI000033450339"],
      ["L. 3312-1", "dix heures par jour pour le travailleur de nuit", "LEGIARTI000033021297"],
      ["R. 3314-10", "formation continue obligatoire tous les cinq ans", "LEGIARTI000044326235"],
    ] },
    { t: "Code du travail", a: [
      ["L. 1221-19", "période d'essai : deux mois au plus pour un ouvrier", "LEGIARTI000019071113"],
      ["L. 1221-21", "renouvellement, quatre mois au plus pour un ouvrier", "LEGIARTI000019071109"],
      ["L. 1242-12", "mentions obligatoires du contrat à durée déterminée", "LEGIARTI000006901206"],
      ["L. 3123-6", "mentions obligatoires du contrat à temps partiel", "LEGIARTI000033020080"],
    ] },
    { t: "Convention collective IDCC 16", a: [
      ["Annexe I, art. 3", "période d'essai : un mois pour le personnel de conduite, deux semaines pour les autres ouvriers", "KALIARTI000005849363"],
      ["Annexe I, art. 5", "préavis, et démission de deux semaines dans le transport de marchandises", "KALIARTI000045968978"],
      ["Annexe I, art. 11 bis", "visites médicales à la charge de l'entreprise, temps payé", "KALIARTI000005849396"],
      ["Annexe I, art. 12", "rémunération globale garantie", "KALIARTI000005849403"],
      ["Accord du 11 octobre 2023", "taux horaires et garanties annuelles des ouvriers marchandises", "KALIARTI000049067165"],
      ["Avenant n° 81 du 2 décembre 2025", "frais de déplacement des ouvriers marchandises au 1er janvier 2026", "KALIARTI000053715771"],
    ] },
  ];

  window.ContratsTransport = {
    CCN: CCN, PROFILS: PROFILS, DROIT: DROIT,
    profil: profil, tauxDe: tauxDe, ecrire: ecrire, reserve: reserve,
    formalites: formalites,
    fr: fr, dateFr: dateFr,
  };

})(window);
