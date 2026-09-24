/* LES CONTRATS DE TRAVAIL DU TRANSPORT ROUTIER DE MARCHANDISES.

   POURQUOI CE FICHIER EXISTE

   Demande du 24 septembre 2026 : « mettre des modèles de contrats de travail
   conformes, précis, adaptés au secteur transport ».

   Le contrat de travail que l'application produisait était celui de n'importe
   quelle entreprise : un emploi, un horaire, un salaire. Dans le transport
   routier, rien de cela ne suffit. La durée du travail n'est pas la durée
   légale mais le temps de service, avec ses équivalences et ses majorations ;
   le conducteur doit détenir un permis, une qualification et une carte ; le
   chronotachygraphe enregistre ce qu'il fait ; les repas et les découchés
   sont indemnisés au forfait par la branche ; et les maxima ne sont pas ceux
   du code du travail.

   CE QUI A ÉTÉ REPRIS APRÈS RELECTURE, LE 24 SEPTEMBRE 2026

   Deux relectures complètes des seize modèles ont relevé des défauts de fond.
   Ils sont corrigés ici, et chacun est nommé pour qu'il ne revienne pas.

   - Le salaire était écrit au taux conventionnel du coefficient, passé sous
     le SMIC : le SMIC est maintenant dans le fichier, daté et sourcé, et
     c'est le plus élevé des deux qui est porté au contrat.
   - Les heures de temps de service étaient payées au taux simple : les
     majorations de l'accord du 23 avril 2002 sont appliquées, 25 % de la
     153e à la 186e heure, 50 % au-delà.
   - Le CDD s'écrivait « sans terme précis » quel que soit le motif : le terme
     est daté par défaut, et l'absence de terme n'est ouverte qu'aux cas de
     l'article L. 1242-7.
   - Les mentions de l'article L. 1242-12 manquaient : la convention est
     nommée, la caisse de retraite et l'organisme de prévoyance aussi.
   - La clause sur le permis faisait de la suspension une impossibilité
     d'exécuter : elle suit maintenant l'accord du 13 novembre 1992,
     information, concertation, reclassement.
   - Un seul modèle « sédentaire » couvrait des ouvriers et des employés, qui
     ne relèvent pas de la même annexe : ils sont séparés.
   - Le temps partiel ignorait la durée minimale de vingt-quatre heures, la
     limite et la majoration des heures complémentaires, et le prorata de la
     garantie annuelle.
   - Les notes explicatives étaient dans le corps du contrat, et partaient
     avec lui : elles sont hors contrat.

   CE QUI EST ÉCRIT ICI, ET D'OÙ CELA VIENT

   Chaque valeur porte sa source, et chaque source a été lue le 24 septembre
   2026, avec l'identifiant de la version lue. Rien n'est écrit de mémoire.

   - Code des transports : D. 3312-45 (LEGIARTI000033450327), D. 3312-46
     (LEGIARTI000033450329), R. 3312-47 (LEGIARTI000033450331), R. 3312-48
     (LEGIARTI000033450333), R. 3312-50 (LEGIARTI000033450337), R. 3312-51
     (LEGIARTI000033450339), L. 3312-1 (LEGIARTI000033021297), R. 3314-10
     (LEGIARTI000044326235).
   - Code du travail : L. 1221-19 (LEGIARTI000019071113), L. 1221-21
     (LEGIARTI000019071109), L. 1242-7 (LEGIARTI000033024651), L. 1242-12
     (LEGIARTI000006901206), L. 1242-13 (LEGIARTI000006901207), L. 3123-6
     (LEGIARTI000033020080), L. 3123-7 (LEGIARTI000047453545), L. 3123-9
     (LEGIARTI000033020058), L. 3123-27 (LEGIARTI000033019953), L. 3123-28
     (LEGIARTI000033019950), L. 3123-29 (LEGIARTI000033019947), L. 1221-10
     (LEGIARTI000006900849), R. 1221-4 (LEGIARTI000024214323), L. 1221-13
     (LEGIARTI000033971569), R. 4624-10 (LEGIARTI000033769085).
   - SMIC : 12,31 euros de l'heure depuis le 1er juin 2026, arrêté du 22 mai
     2026 (JORFTEXT000054126589), lu sur Légifrance.
   - Convention collective IDCC 16 (KALICONT000005635624) :
     essai des ouvriers, annexe I article 3 (KALIARTI000005849363) ;
     préavis des ouvriers, annexe I article 5 (KALIARTI000045968978) ;
     mentions de la lettre d'embauche et adresses des caisses, annexe I
     article 3 bis (KALIARTI000005849365) ;
     visites médicales, annexe I article 11 bis (KALIARTI000005849396) ;
     rémunération globale garantie, annexe I article 12 (KALIARTI000005849403) ;
     essai des employés, annexe II article 11 (KALIARTI000005849507) ;
     préavis des employés, annexe II article 13 (KALIARTI000005849509) ;
     majorations du temps de service, accord du 23 avril 2002, article 2
     (KALIARTI000023750163) ;
     taux horaires et garanties annuelles, accord du 11 octobre 2023
     (KALIARTI000049067165), en vigueur depuis le 1er décembre 2023 ;
     frais de déplacement « marchandises », avenant n° 81 du 2 décembre 2025
     (KALIARTI000053715771), en vigueur depuis le 1er janvier 2026 ;
     frais à l'étranger, protocole du 30 avril 1974 article 13
     (KALIARTI000005849475) ;
     travail de nuit, accord du 14 novembre 2001, articles 1 et 3
     (KALIARTI000005850112, KALIARTI000032302217) ;
     garantie d'amplitude des grands routiers, accord du 12 novembre 1998
     article 3 (KALIARTI000005850018) ;
     permis de conduire, accord du 13 novembre 1992 article 2
     (KALIARTI000005849772).

   CE QUI N'EST PAS ÉCRIT ICI

   La règle des six repos journaliers hors du domicile, qui sert à reconnaître
   le grand routier, n'a pas été retrouvée dans les textes lus par le relais :
   elle est donc présentée comme un critère de fait à vérifier, sans référence
   inventée. Et le SMIC change par arrêté : le module le porte avec sa date et
   le redemande.                                                              */

"use strict";
(function (window) {

  function net(v) { return String(v == null ? "" : v).trim(); }

  /* ══════════════════ 1 · CE QUE DIT LE DROIT ═══════════════════════ */

  var SMIC = {
    valeur: 12.31,
    depuis: "2026-06-01",
    source: "arrêté du 22 mai 2026",
    id: "JORFTEXT000054126589",
  };

  var CCN = {
    idcc: "16",
    nom: "Convention collective nationale des transports routiers et activités " +
      "auxiliaires du transport du 21 décembre 1950",
    id: "KALICONT000005635624",
    lu: "2026-09-24",
    smic: SMIC,

    /* Les majorations du temps de service, décompte mensuel. Accord du
       23 avril 2002, article 2 : 25 % de la 153e à la 186e heure, 50 % au
       delà. Elles valent pour les grands routiers comme pour les autres
       personnels roulants. */
    majorations: {
      source: "Accord du 23 avril 2002 relatif aux salaires des personnels roulants",
      article: "KALIARTI000023750163",
      normalesJusqua: 152,
      majore25Jusqua: 186,
      taux25: 0.25,
      taux50: 0.50,
    },

    /* Taux horaires « marchandises », accord du 11 octobre 2023, en vigueur au
       1er décembre 2023. Les coefficients en M sont ceux des ouvriers ; les
       coefficients sans lettre, ceux des employés de l'annexe II. */
    salaires: {
      source: "Accord du 11 octobre 2023 relatif à la revalorisation des rémunérations",
      article: "KALIARTI000049067165",
      depuis: "2023-12-01",
      ouvriers: {
        "110 M": 12.09, "115 M": 12.09, "118 M": 12.09, "120 M": 12.09,
        "128 M": 12.12, "138 M": 12.14, "150 M": 12.43,
      },
      employes: {
        "105": 12.09, "110": 12.09, "115": 12.09, "120": 12.09,
        "125": 12.10, "132,5": 12.12, "140": 12.15, "148,5": 12.43,
      },
      /* Garanties annuelles de rémunération des ouvriers, mêmes source et
         date. Elles ne valent que pour la durée qu'elles visent. */
      gar: {
        "151.67": { "110 M": 22664.41, "115 M": 22664.41, "118 M": 22664.41, "120 M": 22664.41,
          "128 M": 22720.65, "138 M": 22758.14, "150 M": 23301.79 },
        "169": { "115 M": 25901.12, "118 M": 25901.12, "120 M": 25901.12,
          "128 M": 25965.39, "138 M": 26008.24, "150 M": 26629.52 },
        "200": { "115 M": 32202.68, "118 M": 32202.68, "120 M": 32202.68,
          "128 M": 32282.59, "138 M": 32335.86, "150 M": 33108.30 },
      },
      dimanche: { court: 12.45, long: 28.94 },
    },

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
      etranger: "majorés de 18 % (protocole du 30 avril 1974, article 13)",
    },

    nuit: {
      source: "Accord du 14 novembre 2001 relatif au travail de nuit",
      article: "KALIARTI000032302217",
      periode: "de 21 heures à 6 heures",
      taux: 0.20,
      reference: "150 M",
    },

    amplitude: {
      source: "Accord national professionnel du 12 novembre 1998",
      article: "KALIARTI000005850018",
      part: 0.75,
      plafondHeures: 63,
    },

    permis: {
      source: "Accord du 13 novembre 1992 sur le permis à points",
      article: "KALIARTI000005849772",
    },

    /* Deux annexes, deux régimes. Les ouvriers relèvent de l'annexe I, les
       employés de l'annexe II : ni le même essai, ni le même préavis, ni la
       même grille. */
    annexeI: {
      nom: "annexe I, ouvriers",
      essaiConduite: "1 mois",
      essaiAutres: "2 semaines",
      essaiArticle: "annexe I, article 3",
      essaiId: "KALIARTI000005849363",
      preavisArticle: "annexe I, article 5",
      preavisId: "KALIARTI000045968978",
      demission: "2 semaines dans le transport routier de marchandises et les activités auxiliaires",
      licenciement: [
        "moins de 6 mois d'ancienneté, période d'essai comprise : 1 semaine",
        "de 6 mois à 2 ans : 1 mois",
        "2 ans et au-delà : 2 mois",
      ],
      rechercheEmploi: "deux heures par jour pendant le préavis, payées dans la limite de douze heures",
    },
    annexeII: {
      nom: "annexe II, employés",
      essai: "1 mois",
      essaiArticle: "annexe II, article 11",
      essaiId: "KALIARTI000005849507",
      preavisArticle: "annexe II, article 13",
      preavisId: "KALIARTI000005849509",
      demission: "1 mois, quelle que soit l'ancienneté",
      licenciement: [
        "de 1 mois à moins de 2 ans d'ancienneté : 1 mois",
        "2 ans et au-delà : 2 mois",
      ],
      rechercheEmploi: "deux heures par jour pendant le préavis, dans la limite d'un mois",
    },

    caisses: {
      article: "annexe I, article 3 bis",
      id: "KALIARTI000005849365",
    },
  };

  /* ══════════════════ 2 · LES CINQ PROFILS ══════════════════════════ */

  var PROFILS = [
    {
      cle: "pl",
      nom: "Conducteur marchandises PL ou SPL",
      sous: "Courte distance, retour quotidien au domicile",
      roulant: true, annexe: "I", conduite: true,
      equivalence: "39 heures par semaine, 169 heures par mois",
      mensuel: 169, hebdo: 39,
      maxSemaine: "52 heures sur une semaine isolée, 50 heures en moyenne sur trois mois " +
        "quand tous les transports sont faits avec des véhicules de plus de 3,5 tonnes " +
        "(R. 3312-50)",
      coefs: ["128 M", "138 M", "150 M"],
      coefDefaut: "138 M",
      permis: "C ou CE en cours de validité",
      titres: ["FIMO ou titre équivalent", "FCO en cours de validité (R. 3314-10)",
        "carte de conducteur pour le chronotachygraphe"],
      clauses: ["chronotachygraphe", "nuit", "frais"],
    },
    {
      cle: "grand",
      nom: "Conducteur grand routier ou longue distance",
      sous: "Découchés, deux repas hors du domicile",
      roulant: true, annexe: "I", conduite: true, grandRoutier: true,
      equivalence: "43 heures par semaine, 186 heures par mois",
      mensuel: 186, hebdo: 43,
      maxSemaine: "56 heures sur une semaine isolée, 53 heures en moyenne sur trois mois " +
        "quand tous les transports sont faits avec des véhicules de plus de 3,5 tonnes " +
        "(R. 3312-50)",
      coefs: ["138 M", "150 M"],
      coefDefaut: "150 M",
      permis: "CE en cours de validité",
      titres: ["FIMO ou titre équivalent", "FCO en cours de validité (R. 3314-10)",
        "carte de conducteur pour le chronotachygraphe"],
      clauses: ["chronotachygraphe", "nuit", "frais", "decouche", "amplitude"],
    },
    {
      cle: "adr",
      nom: "Conducteur ADR ou température dirigée",
      sous: "Matières dangereuses, ou transport sous température dirigée",
      roulant: true, annexe: "I", conduite: true,
      equivalence: "39 heures par semaine, 169 heures par mois",
      mensuel: 169, hebdo: 39,
      maxSemaine: "52 heures sur une semaine isolée, 50 heures en moyenne sur trois mois " +
        "quand tous les transports sont faits avec des véhicules de plus de 3,5 tonnes " +
        "(R. 3312-50)",
      coefs: ["138 M", "150 M"],
      coefDefaut: "150 M",
      permis: "C ou CE en cours de validité",
      titres: ["FIMO ou titre équivalent", "FCO en cours de validité (R. 3314-10)",
        "carte de conducteur pour le chronotachygraphe",
        "certificat de formation ADR du conducteur, en cours de validité"],
      clauses: ["chronotachygraphe", "nuit", "frais", "adr"],
    },
    {
      cle: "ouvrier",
      nom: "Ouvrier sédentaire : quai, atelier",
      sous: "Agent de quai, cariste, mécanicien, laveur",
      roulant: false, annexe: "I", conduite: false,
      equivalence: "durée légale, 35 heures par semaine, 151,67 heures par mois",
      mensuel: 151.67, hebdo: 35,
      maxSemaine: "48 heures sur une semaine isolée et 44 heures en moyenne sur douze " +
        "semaines (code du travail, L. 3121-20 et L. 3121-22)",
      coefs: ["110 M", "115 M", "118 M", "120 M", "128 M", "138 M", "150 M"],
      coefDefaut: "120 M",
      permis: "", titres: [],
      clauses: ["nuit"],
    },
    {
      cle: "employe",
      nom: "Employé : exploitation, administratif",
      sous: "Exploitant, agent de facturation, assistant, employé administratif",
      roulant: false, annexe: "II", conduite: false,
      equivalence: "durée légale, 35 heures par semaine, 151,67 heures par mois",
      mensuel: 151.67, hebdo: 35,
      maxSemaine: "48 heures sur une semaine isolée et 44 heures en moyenne sur douze " +
        "semaines (code du travail, L. 3121-20 et L. 3121-22)",
      coefs: ["105", "110", "115", "120", "125", "132,5", "140", "148,5"],
      coefDefaut: "120",
      permis: "", titres: [],
      clauses: ["nuit"],
    },
  ];

  /* ══════════════════ 3 · LES OUTILS DE CALCUL ══════════════════════ */

  /* Les milliers se séparent dans la partie entière, jamais dans les
     décimales : le taux horaire sortait « 12,4 300 euros ». Mesuré le
     24 septembre 2026. */
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

  function grille(p) {
    return p && p.annexe === "II" ? CCN.salaires.employes : CCN.salaires.ouvriers;
  }
  function tauxDe(coef, cleProfil) {
    var g = grille(cleProfil ? profil(cleProfil) : null);
    if (g[coef] !== undefined) return g[coef];
    if (CCN.salaires.ouvriers[coef] !== undefined) return CCN.salaires.ouvriers[coef];
    if (CCN.salaires.employes[coef] !== undefined) return CCN.salaires.employes[coef];
    return null;
  }

  /* LE SALAIRE DU MOIS, MAJORATIONS COMPRISES.

     Pour un roulant, les heures ne se paient pas toutes au même taux : au
     delà de la 152e, elles portent 25 %, au delà de la 186e, 50 % (accord du
     23 avril 2002). Multiplier le taux par 169 ou par 186, c'est payer en
     dessous du dû. Défaut relevé à la relecture du 24 septembre 2026. */
  function salaire(p, heures, taux) {
    var M = CCN.majorations;
    if (!p.roulant) {
      return { base: heures, m25: 0, m50: 0, total: heures * taux };
    }
    var base = Math.min(heures, M.normalesJusqua);
    var m25 = Math.max(0, Math.min(heures, M.majore25Jusqua) - M.normalesJusqua);
    var m50 = Math.max(0, heures - M.majore25Jusqua);
    return {
      base: base, m25: m25, m50: m50,
      total: base * taux + m25 * taux * (1 + M.taux25) + m50 * taux * (1 + M.taux50),
    };
  }

  function garantie(p, coef, heures) {
    if (p.annexe === "II") return null;
    var cles = { "151.67": 151.67, "169": 169, "200": 200 };
    for (var k in cles) {
      if (Math.abs(cles[k] - heures) < 0.5 && CCN.salaires.gar[k] && CCN.salaires.gar[k][coef])
        return { montant: CCN.salaires.gar[k][coef], pour: k === "151.67" ? "151,67" : k };
    }
    return null;
  }

  /* ══════════════════ 4 · LE CONTRAT, ARTICLE PAR ARTICLE ═══════════ */

  function ecrire(v) {
    var p = profil(v.profil);
    var B = [];
    var ent = v.entreprise || {};
    var cdd = v.nature === "cdd";
    var partiel = !!v.partiel;
    var heures = Number(v.mensuel) || p.mensuel;
    var taux = Number(v.taux) || tauxDe(v.coef, p.cle) || 0;
    var smic = Number(v.smic) || CCN.smic.valeur;
    var retenu = smic > taux ? smic : taux;
    var annexe = p.annexe === "II" ? CCN.annexeII : CCN.annexeI;
    var motif = net(v.motif) || "[MOTIF DU RECOURS]";
    var n = 0;
    function art(titre) { n++; B.push({ k: "h2", t: "Article " + n + " - " + titre }); }

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

    /* ── 1 · engagement ─────────────────────────────────────────────── */
    art(cdd ? "Engagement et motif du recours" : "Engagement");
    if (cdd) {
      B.push({ k: "p", t: "L'entreprise engage le salarié à durée déterminée, à compter du " +
        dateFr(v.entree) + ", pour le motif suivant : " + motif + "." });
      if (net(v.remplace)) {
        B.push({ k: "p", t: "Le salarié remplacé est " + net(v.remplace) + ", " +
          (net(v.remplaceQualif) || "[QUALIFICATION DE LA PERSONNE REMPLACÉE]") + "." });
      }
      B.push({ k: "p", t: v.sansTerme
        ? "Le contrat ne comporte pas de terme précis, le motif ci-dessus étant au nombre de " +
          "ceux que vise l'article L. 1242-7 du code du travail. Il prendra fin à la réalisation " +
          "de son objet, et il est conclu pour une durée minimale de " +
          (net(v.duree) || "[DURÉE MINIMALE]") + "."
        : "Le contrat prend fin le " + dateFr(v.terme) + ". Il est conclu pour ce motif et pour " +
          "lui seul, et cesse de plein droit à cette date sans qu'il y ait lieu à préavis." });
      if (!v.sansTerme) {
        B.push({ k: "p", t: "Il pourra être renouvelé " +
          (net(v.renouvellement) || "deux fois au plus, dans la limite de la durée maximale légale") +
          ", par avenant signé avant le terme." });
      }
    } else {
      B.push({ k: "p", t: "L'entreprise engage le salarié à durée indéterminée à compter du " +
        dateFr(v.entree) + "." });
    }
    B.push({ k: "p", t: "L'engagement est subordonné au résultat de la visite d'information et de " +
      "prévention, ou de l'examen médical d'aptitude lorsque le poste le commande." });

    /* ── 2 · emploi et classification ───────────────────────────────── */
    art("Emploi, qualification et classification");
    B.push({ k: "p", t: "Le salarié est engagé en qualité de " + (net(v.emploi) || p.nom) +
      ", groupe " + (net(v.groupe) || "[GROUPE]") + ", coefficient " + (net(v.coef) || "[COEFFICIENT]") +
      " de la nomenclature des emplois de l'" + annexe.nom + " de la convention collective" +
      (cdd ? ", pour les besoins qui tiennent au motif ci-dessus" : "") + "." });
    B.push({ k: "p", t: "La convention collective applicable est la " + CCN.nom +
      ", IDCC " + CCN.idcc + "." });
    B.push({ k: "p", t: "Il exerce ses fonctions sous l'autorité de l'entreprise et selon les " +
      "instructions qui lui sont données" +
      (p.roulant ? ", dans le respect de la réglementation sociale européenne applicable au " +
        "transport routier" : "") + "." });

    /* ── 3 · titres de conduite ─────────────────────────────────────── */
    if (p.conduite) {
      art("Titres et qualifications exigés");
      B.push({ k: "p", t: "Le salarié déclare détenir, et s'engage à maintenir en cours de validité " +
        "pendant toute l'exécution du contrat :" });
      B.push({ k: "puce", t: "le permis de conduire " + p.permis });
      p.titres.forEach(function (t) { B.push({ k: "puce", t: t }); });
      B.push({ k: "puce", t: "l'attestation d'aptitude médicale liée au permis" });
      B.push({ k: "p", t: "Il informe l'entreprise, au plus tard le premier jour de travail qui suit " +
        "la notification, de toute mesure de suspension, de rétention ou d'invalidation de son " +
        "permis, ainsi que de l'expiration prochaine de l'un de ces titres." });
      /* La clause d'hier faisait de la suspension une impossibilité d'exécuter
         le contrat. L'accord du 13 novembre 1992 dit le contraire : elle
         n'entraîne pas par elle-même la rupture, et ouvre une concertation
         puis une recherche de reclassement. */
      B.push({ k: "p", t: "La suspension ou l'invalidation du permis n'entraîne pas par elle-même " +
        "la rupture du contrat. Une concertation s'engage entre l'entreprise et le salarié pour " +
        "examiner la situation, le salarié pouvant se faire assister par une personne de son choix " +
        "appartenant à l'entreprise ; si un emploi de reclassement est disponible, il lui est " +
        "proposé (" + CCN.permis.source + ", article 2)." });
      B.push({ k: "p", t: "Le coût des visites médicales obligatoires et le temps qu'elles prennent " +
        "sont à la charge de l'entreprise, ainsi que, après un an d'ancienneté, les visites de " +
        "renouvellement du permis (" + CCN.annexeI.nom + ", article 11 bis)." });
    }

    /* ── 4 · lieu de travail ────────────────────────────────────────── */
    art("Lieu de travail et rattachement");
    B.push({ k: "p", t: "Le salarié est rattaché à l'établissement " +
      de(net(v.lieu) || ent.adresse || "[LIEU DE RATTACHEMENT]") + ", où il prend et quitte son service." });
    if (p.roulant) {
      B.push({ k: "p", t: "Par la nature même de l'emploi, le salarié exerce son activité sur " +
        "l'ensemble du territoire " + (net(v.zone) || "national et, le cas échéant, européen") +
        ". Ces déplacements sont inhérents à la fonction et ne constituent pas une modification " +
        "du contrat de travail." });
    }
    if (p.grandRoutier) {
      B.push({ k: "p", t: "L'emploi est un emploi de grand routier ou longue distance : le service " +
        "conduit le salarié à prendre régulièrement ses repos journaliers hors de son domicile, " +
        "au moins six fois par mois." });
    }

    /* ── 5 · durée du travail ───────────────────────────────────────── */
    art("Durée du travail" + (partiel ? ", à temps partiel" : ""));
    if (partiel) {
      var parSemaine = heures * 12 / 52;
      B.push({ k: "p", t: "Le salarié est engagé à temps partiel pour une durée de " + fr(heures, 2) +
        " heures par mois" + (p.roulant ? ", décomptée en temps de service" : "") +
        ", soit environ " + fr(parSemaine, 2) + " heures par semaine, répartie comme suit : " +
        (net(v.repartition) || "[RÉPARTITION ENTRE LES JOURS DE LA SEMAINE]") + "." });
      /* SOUS VINGT-QUATRE HEURES, IL FAUT UNE DÉROGATION, ET ELLE S'ÉCRIT.
         Demande du 24 septembre 2026 : « pour temps partiel précise si
         inférieur à 24 heures par semaine, dérogation demande expresse du
         salarié si autorisé par la loi et la convention collective, avec
         modèle précis en annexe ». Le modèle est l'annexe 1 du contrat, et le
         contrat y renvoie. */
      if (parSemaine < 24 - 0.01) {
        B.push({ k: "p", t: "Cette durée est inférieure à la durée minimale de vingt-quatre heures " +
          "par semaine fixée par l'article L. 3123-27 du code du travail. Elle est fixée à la " +
          "demande écrite et motivée du salarié, qui figure en annexe 1 du présent contrat et en " +
          "fait partie intégrante, " + (net(v.motifPartiel)
            ? "pour le motif suivant : " + net(v.motifPartiel)
            : "[MOTIF DE LA DEMANDE : CONTRAINTES PERSONNELLES, OU CUMUL D'ACTIVITÉS]") +
          " (L. 3123-7 du code du travail)." });
        B.push({ k: "p", t: "L'entreprise s'engage à regrouper les horaires du salarié sur des " +
          "journées ou des demi-journées régulières ou complètes." });
      }
      B.push({ k: "p", t: "Cette répartition peut être modifiée dans les cas suivants : " +
        (net(v.modification) || "[CAS DE MODIFICATION : ABSENCE D'UN SALARIÉ, SURCROÎT DE COMMANDES]") +
        ". Toute modification est notifiée au salarié en respectant un délai de prévenance de sept " +
        "jours ouvrés." });
      B.push({ k: "p", t: "Les horaires de chaque journée travaillée sont communiqués au salarié par " +
        (net(v.communication) || "[PLANNING REMIS OU AFFICHÉ, ET SELON QUELLE PÉRIODICITÉ]") + "." });
      B.push({ k: "p", t: "Des heures complémentaires peuvent être demandées dans la limite du dixième " +
        "de la durée prévue au contrat. Elles sont majorées de 10 % (L. 3123-28 et L. 3123-29 du " +
        "code du travail). Elles ne peuvent avoir pour effet de porter la durée du travail au niveau " +
        "de la durée légale ou, si elle est inférieure, de la durée fixée conventionnellement " +
        "(L. 3123-9)." });
      B.push({ k: "p", t: "Le salarié bénéficie d'une priorité pour occuper un emploi à temps complet " +
        "ressortissant à sa catégorie professionnelle, ou un emploi équivalent." });
    } else if (p.roulant) {
      B.push({ k: "p", t: "La durée du travail du personnel roulant est décomptée en temps de service. " +
        "Pour l'emploi occupé, la durée réputée équivalente à la durée légale est fixée à " +
        p.equivalence + " (code des transports, D. 3312-45)." });
      B.push({ k: "p", t: "Le temps de service mensuel du salarié est fixé à " + fr(heures, 2) +
        " heures." });
    } else {
      B.push({ k: "p", t: "La durée du travail est fixée à " + fr(heures, 2) + " heures par mois, " +
        "soit " + fr(p.hebdo, 0) + " heures par semaine, selon l'horaire affiché dans " +
        "l'établissement." });
    }
    if (p.roulant) {
      B.push({ k: "p", t: "Les heures de temps de service sont rémunérées, au-delà de la 152e heure " +
        "du mois, avec une majoration de 25 % jusqu'à la 186e heure incluse, et de 50 % à compter " +
        "de la 187e heure (" + CCN.majorations.source + ", article 2). Au-delà de la durée " +
        "d'équivalence, elles sont des heures supplémentaires (R. 3312-47) et ouvrent droit à la " +
        "compensation obligatoire en repos de l'article R. 3312-48, dont le décompte est " +
        "trimestriel." });
      B.push({ k: "p", t: "Le temps de service ne peut excéder douze heures par jour (R. 3312-51), ni " +
        p.maxSemaine + ". Lorsque le salarié est travailleur de nuit, ou accomplit une partie de " +
        "son travail entre 24 heures et 5 heures, sa durée quotidienne ne peut excéder dix heures " +
        "(L. 3312-1)." });
      B.push({ k: "p", t: "Le temps de service est enregistré par le chronotachygraphe et par la carte " +
        "de conducteur. Le salarié s'engage à introduire sa carte, à la conserver en état de " +
        "fonctionnement, à saisir manuellement les périodes non enregistrées et à remettre les " +
        "données à l'entreprise selon la périodicité qu'elle fixe." });
    } else {
      B.push({ k: "p", t: "La durée du travail ne peut excéder " + p.maxSemaine + "." });
    }

    /* ── 6 · rémunération ───────────────────────────────────────────── */
    art("Rémunération");
    var s = salaire(p, heures, retenu);
    if (p.roulant && s.m25 + s.m50 > 0) {
      B.push({ k: "p", t: "Le salarié perçoit un salaire mensuel brut calculé sur la base de " +
        fr(heures, 2) + " heures de temps de service au taux horaire de " + fr(retenu, 4) +
        " euros, soit " + fr(s.base, 2) + " heures au taux normal, " + fr(s.m25, 2) +
        " heures majorées de 25 %" +
        (s.m50 > 0 ? " et " + fr(s.m50, 2) + " heures majorées de 50 %" : "") +
        ", représentant " + fr(s.total, 2) + " euros bruts par mois." });
    } else {
      B.push({ k: "p", t: "Le salarié perçoit un salaire mensuel brut calculé sur la base de " +
        fr(heures, 2) + " heures au taux horaire de " + fr(retenu, 4) + " euros, soit " +
        fr(s.total, 2) + " euros bruts par mois." });
    }
    var g = garantie(p, net(v.coef), heures);
    if (g && !partiel) {
      B.push({ k: "p", t: "La rémunération annuelle du salarié ne peut être inférieure à la garantie " +
        "annuelle de rémunération attachée au coefficient " + net(v.coef) + " pour " + g.pour +
        " heures, soit " + fr(g.montant, 2) + " euros (" + CCN.salaires.source + ", en vigueur " +
        "depuis le " + dateFr(CCN.salaires.depuis) + ")." });
    } else if (g && partiel) {
      var pro = g.montant * heures / (g.pour === "151,67" ? 151.67 : Number(g.pour));
      B.push({ k: "p", t: "La garantie annuelle de rémunération du coefficient " + net(v.coef) +
        " est de " + fr(g.montant, 2) + " euros pour " + g.pour + " heures ; ramenée à la durée du " +
        "présent contrat, elle s'établit à " + fr(pro, 2) + " euros." });
    }
    if (p.clauses.indexOf("nuit") >= 0) {
      B.push({ k: "p", t: "Tout travail effectif accompli " + CCN.nuit.periode + " donne lieu à une " +
        "prime horaire égale à 20 % du taux horaire conventionnel à l'embauche du coefficient " +
        CCN.nuit.reference + ", qui s'ajoute à la rémunération et entre dans l'assiette des " +
        "majorations pour heures supplémentaires (" + CCN.nuit.source + ", article 3)." });
    }
    if (p.clauses.indexOf("amplitude") >= 0) {
      B.push({ k: "p", t: "La rémunération mensuelle ne peut être inférieure à 75 % des amplitudes " +
        "journalières cumulées du mois, sans que l'application de ce pourcentage puisse réduire ces " +
        "amplitudes de plus de 63 heures. Le nombre d'heures d'amplitude et le montant " +
        "correspondant figurent distinctement sur le bulletin de paie (" + CCN.amplitude.source +
        ", article 3)." });
    }
    B.push({ k: "p", t: "S'ajoutent, le cas échéant, l'indemnisation du travail du dimanche et des " +
      "jours fériés et les autres majorations prévues par la convention collective. La rémunération " +
      "est versée mensuellement, à terme échu." });

    /* ── 7 · frais de déplacement ───────────────────────────────────── */
    if (p.clauses.indexOf("frais") >= 0) {
      art("Frais de déplacement");
      B.push({ k: "p", t: "Lorsque le service du salarié l'oblige à prendre un repas ou à découcher hors " +
        "de son domicile, l'entreprise lui verse les indemnités forfaitaires prévues par le " +
        "protocole du 30 avril 1974 annexé à la convention collective, aux taux en vigueur. Ces " +
        "indemnités remboursent des frais : elles ne sont pas du salaire et n'entrent pas dans la " +
        "rémunération garantie." });
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
      B.push({ k: "p", t: "À défaut d'accord d'entreprise, les frais de déplacement à l'étranger sont " +
        "réglés sur la base de ces mêmes indemnités, " + CCN.frais.etranger + ". Les frais de change " +
        "sont à la charge de l'entreprise." });
    }

    /* ── 8 · essai ──────────────────────────────────────────────────── */
    art("Période d'essai");
    if (cdd) {
      B.push({ k: "p", t: "Le contrat comporte une période d'essai de " +
        (net(v.essai) || "[DURÉE]") + ", calculée à raison d'un jour par semaine de contrat, dans la " +
        "limite de deux semaines lorsque la durée initiale est au plus égale à six mois, et d'un " +
        "mois au-delà." });
    } else {
      B.push({ k: "p", t: "Le contrat comporte une période d'essai de " +
        (net(v.essai) || (p.annexe === "II" ? CCN.annexeII.essai
          : (p.conduite ? CCN.annexeI.essaiConduite : CCN.annexeI.essaiAutres))) +
        ", pendant laquelle chacune des parties peut rompre le contrat sans préavis ni indemnité, " +
        "sous réserve du délai de prévenance légal (" +
        (p.annexe === "II" ? CCN.annexeII.essaiArticle : CCN.annexeI.essaiArticle) + ")." });
    }

    /* ── 9 · congés ─────────────────────────────────────────────────── */
    art("Congés payés");
    B.push({ k: "p", t: "Le salarié bénéficie des congés payés dans les conditions légales et " +
      "conventionnelles. Les dates sont fixées par l'entreprise en tenant compte des nécessités " +
      "du service." });

    /* ── 10 · rupture ───────────────────────────────────────────────── */
    if (!cdd) {
      art("Rupture du contrat");
      B.push({ k: "p", t: "Après la période d'essai, le contrat peut être rompu dans les conditions " +
        "légales, sous réserve du préavis fixé par la convention collective (" +
        (p.annexe === "II" ? CCN.annexeII.preavisArticle : CCN.annexeI.preavisArticle) + ") :" });
      B.push({ k: "puce", t: "démission : " +
        (p.annexe === "II" ? CCN.annexeII.demission : CCN.annexeI.demission) });
      (p.annexe === "II" ? CCN.annexeII.licenciement : CCN.annexeI.licenciement)
        .forEach(function (l) { B.push({ k: "puce", t: "licenciement, " + l }); });
      B.push({ k: "p", t: "Pendant le préavis, quelle que soit la partie qui a pris l'initiative de " +
        "la rupture, le salarié peut s'absenter " +
        (p.annexe === "II" ? CCN.annexeII.rechercheEmploi : CCN.annexeI.rechercheEmploi) +
        " pour chercher un autre emploi." });
    }

    /* ── 11 · protection sociale ────────────────────────────────────── */
    art("Protection sociale");
    B.push({ k: "p", t: "Le salarié est affilié aux organismes suivants :" });
    B.push({ k: "puce", t: "retraite complémentaire : " +
      (net(v.retraite) || "[NOM ET ADRESSE DE LA CAISSE DE RETRAITE COMPLÉMENTAIRE]") });
    B.push({ k: "puce", t: "prévoyance : " +
      (net(v.prevoyance) || "[NOM ET ADRESSE DE L'ORGANISME DE PRÉVOYANCE]") });
    B.push({ k: "puce", t: "frais de santé : " +
      (net(v.sante) || "[NOM ET ADRESSE DE L'ORGANISME, COUVERTURE OBLIGATOIRE DE LA BRANCHE]") });
    B.push({ k: "puce", t: "assurance maladie et accidents du travail, allocations familiales : " +
      (net(v.urssaf) || "[CAISSE D'AFFILIATION]") });

    /* ── 12 · obligations de conduite ───────────────────────────────── */
    if (p.conduite) {
      art("Obligations particulières de conduite");
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

    /* ── 13 · documents remis ───────────────────────────────────────── */
    art("Documents remis");
    B.push({ k: "p", t: "Le salarié reconnaît avoir reçu un exemplaire du présent contrat, ainsi que " +
      "l'information sur la convention collective applicable, le règlement intérieur lorsqu'il " +
      "existe, et la notice des régimes de protection sociale." });

    B.push({ k: "p", t: "Fait à " + (net(v.lieuSignature) || "[LIEU]") + ", le " +
      dateFr(v.dateSignature) + ", en deux exemplaires." });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "Pour l'entreprise\t\t\tLe salarié" });
    B.push({ k: "p", t: "Signature précédée de la mention « lu et approuvé »." });

    return B;
  }

  /* ══════════════════ 5 · L'ANNEXE, QUAND ELLE EST DUE ══════════════ */

  /* LA DEMANDE DU SALARIÉ, SOUS VINGT-QUATRE HEURES PAR SEMAINE.

     Demandé le 24 septembre 2026. Sans cette demande, écrite, motivée et
     signée du salarié, un temps partiel de moins de vingt-quatre heures par
     semaine n'est pas licite, sauf dans les cas que la loi écarte d'elle-même
     et sauf accord de branche étendu abaissant le minimum. Le modèle est donc
     produit avec le contrat, et le contrat y renvoie : ce n'est pas une pièce
     facultative, c'est ce qui fonde la durée retenue.

     Ce que la loi permet (L. 3123-7) : la demande du salarié pour faire face
     à des contraintes personnelles, ou pour cumuler plusieurs activités et
     atteindre au moins vingt-quatre heures au total. S'y ajoutent, de droit,
     l'étudiant de moins de vingt-six ans et le salarié en retraite
     progressive. La durée minimale peut aussi être abaissée par un accord de
     branche étendu (L. 3123-19) ; il faut alors viser cet accord, et non la
     demande du salarié.                                                     */
  function annexeDemande(v) {
    var p = profil(v.profil);
    var ent = (v && v.entreprise) || {};
    var heures = Number(v.mensuel) || p.mensuel;
    var parSemaine = heures * 12 / 52;
    var B = [];

    B.push({ k: "saut" });
    B.push({ k: "sur", t: "Annexe 1 au contrat de travail - fait partie du contrat" });
    B.push({ k: "t1", t: "Demande du salarié d'une durée inférieure à vingt-quatre heures par semaine" });
    B.push({ k: "trait" });

    B.push({ k: "p", t: (net(v.nom) || "[NOM ET PRÉNOM DU SALARIÉ]") });
    B.push({ k: "p", t: (net(v.adresse) || "[ADRESSE DU SALARIÉ]") });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "À l'attention de " + (ent.denomination || "[DÉNOMINATION]") +
      ", " + (ent.adresse || "[ADRESSE DU SIÈGE]") });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: (net(v.lieuSignature) || "[LIEU]") + ", le " + dateFr(v.dateSignature) });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "Objet : demande d'une durée de travail inférieure à vingt-quatre heures " +
      "par semaine" });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "Madame, Monsieur," });
    B.push({ k: "p", t: "Je suis engagé à temps partiel en qualité de " +
      (net(v.emploi) || p.nom) + " à compter du " + dateFr(v.entree) + "." });
    B.push({ k: "p", t: "Je demande que ma durée de travail soit fixée à " + fr(heures, 2) +
      " heures par mois, soit environ " + fr(parSemaine, 2) + " heures par semaine, c'est-à-dire " +
      "en dessous de la durée minimale de vingt-quatre heures par semaine prévue par l'article " +
      "L. 3123-27 du code du travail." });
    B.push({ k: "p", t: "Cette demande est motivée par ce qui suit : " +
      (net(v.motifPartiel) || "[EXPOSER LE MOTIF, EN FAIT ET PRÉCISÉMENT]") + "." });
    B.push({ k: "p", t: "Je vous indique le cas dans lequel je me trouve :" });
    B.push({ k: "puce", t: "des contraintes personnelles qui ne me permettent pas de travailler " +
      "davantage (L. 3123-7)" });
    B.push({ k: "puce", t: "le cumul de plusieurs activités, afin d'atteindre une durée globale " +
      "d'au moins vingt-quatre heures par semaine ou un temps plein ; j'exerce par ailleurs " +
      "[EMPLOYEUR ET DURÉE DE L'AUTRE ACTIVITÉ] (L. 3123-7)" });
    B.push({ k: "puce", t: "je poursuis des études et j'ai moins de vingt-six ans : la durée " +
      "compatible avec mes études m'est acquise de droit, à ma demande (L. 3123-7)" });
    B.push({ k: "puce", t: "j'ai atteint l'âge ouvrant droit à la retraite progressive (L. 3123-7)" });
    B.push({ k: "p", t: "[Rayer les mentions inutiles, ou ne garder que la ligne qui correspond.]" });
    B.push({ k: "p", t: "Je vous demande de bien vouloir regrouper mes horaires sur des journées ou " +
      "des demi-journées régulières ou complètes." });
    B.push({ k: "p", t: "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations " +
      "distinguées." });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "Signature du salarié, précédée de la mention « lu et approuvé »" });
    B.push({ k: "p", t: "" });
    B.push({ k: "p", t: "Reçue le " + "[DATE DE RÉCEPTION]" + " par l'entreprise." });
    return B;
  }

  /* L'annexe n'est due que sous vingt-quatre heures par semaine. Au-dessus,
     le contrat se suffit à lui-même. */
  function annexeDue(v) {
    if (!v || !v.partiel) return false;
    var p = profil(v.profil);
    var heures = Number(v.mensuel) || p.mensuel;
    return (heures * 12 / 52) < 24 - 0.01;
  }

  /* ══════════ 6 · CE QUI NE FAIT PAS PARTIE DU CONTRAT ══════════════ */

  /* LA RÉSERVE D'USAGE, ET L'OBSERVATION.

     Demande du 24 septembre 2026 : « tu mets une réserve d'usage, avec une
     observation hors contrat qui dit le juge confronte après ce qui est écrit
     par rapport à la réalité ».

     Les deux sont hors du contrat, et le disent. Les explications de droit qui
     traînaient dans le corps des articles ont été déplacées ici : elles
     partaient chez le salarié avec le contrat.                              */
  function reserve(v) {
    var p = profil(v.profil);
    var cdd = v && v.nature === "cdd";
    var partiel = v && v.partiel;
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
    B.push({ k: "puce", t: "Le taux horaire retenu est le plus élevé du SMIC, " +
      fr(CCN.smic.valeur, 2) + " euros depuis le " + dateFr(CCN.smic.depuis) + " (" +
      CCN.smic.source + "), et du minimum conventionnel du coefficient. Le SMIC change par " +
      "arrêté : il se vérifie au jour de l'embauche." });
    B.push({ k: "puce", t: "Les montants conventionnels, frais de déplacement, taux horaires et " +
      "garanties annuelles, changent par avenant. Vérifier qu'aucun avenant postérieur n'est " +
      "intervenu, et lequel vise le transport de marchandises : un avenant plus récent peut ne " +
      "viser que les voyageurs ou le transport sanitaire." });
    if (p.roulant) {
      B.push({ k: "puce", t: "Les majorations du temps de service, 25 % de la 153e à la 186e heure " +
        "et 50 % au-delà, sont calculées dans le contrat. Elles doivent se retrouver sur le " +
        "bulletin de paie, avec la prime de nuit et, pour un grand routier, la garantie " +
        "d'amplitude." });
    }
    if (p.grandRoutier) {
      B.push({ k: "puce", t: "La qualité de grand routier suppose que le service conduise " +
        "effectivement le salarié à prendre au moins six repos journaliers hors de son domicile " +
        "par mois. Si ce n'est pas le cas, c'est la durée d'équivalence de 169 heures qui " +
        "s'applique, et non 186." });
    }
    if (cdd) {
      B.push({ k: "puce", t: "Le motif doit correspondre à un cas de recours de l'article L. 1242-2. " +
        "Le terme doit être daté, sauf dans les cas de l'article L. 1242-7, remplacement, attente " +
        "d'une entrée en service, emploi saisonnier ou d'usage : un accroissement temporaire " +
        "d'activité appelle un terme daté. Le contrat doit être remis au salarié dans les deux " +
        "jours ouvrables suivant l'embauche (L. 1242-13)." });
    }
    if (partiel) {
      B.push({ k: "puce", t: "La durée minimale est de vingt-quatre heures par semaine, soit environ " +
        "104 heures par mois (L. 3123-27). En dessous, il faut une demande écrite et motivée du " +
        "salarié, annexée au contrat (L. 3123-7). La répartition entre les jours doit être écrite : " +
        "tant qu'elle ne l'est pas, le contrat est présumé à temps complet (L. 3123-6)." });
    }
    B.push({ k: "puce", t: "L'essai et le préavis suivent l'" + (p.annexe === "II" ? CCN.annexeII.nom
      : CCN.annexeI.nom) + ". Un ouvrier de quai et un exploitant administratif ne relèvent pas de " +
      "la même annexe, ni de la même grille de coefficients." });

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
    B.push({ k: "p", t: "D'où la règle pratique : ce qu'on écrit, on le tient ; ce qu'on ne tient " +
      "pas, on ne l'écrit pas." });
    return B;
  }

  /* ══════════════════ 7 · LES FORMALITÉS, ET LE DROIT ═══════════════ */

  function formalites(v) {
    var p = profil(v.profil);
    var cdd = v && v.nature === "cdd";
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
        quand: cdd ? "dans les deux jours ouvrables suivant l'embauche" : "à la signature",
        ou: "au salarié", loi: cdd ? "L. 1242-13 du code du travail" : "" },
      { quoi: "Affiliation aux caisses, et remise de leurs coordonnées",
        quand: "à l'embauche", ou: "retraite complémentaire, prévoyance, frais de santé",
        loi: "convention collective, annexe I, article 3 bis" },
    ];
    if (p.conduite) {
      L.push({ quoi: "Vérification du permis, de la FIMO ou FCO et de la carte de conducteur",
        quand: "avant la prise de poste, puis à chaque échéance",
        ou: "dans l'entreprise", loi: "R. 3314-10 du code des transports" });
      L.push({ quoi: "Remise de la carte de conducteur et consigne d'enregistrement",
        quand: "à la prise de poste", ou: "au salarié",
        loi: "règlement (UE) n° 165/2014" });
    }
    if (v && v.partiel) {
      L.push({ quoi: "Demande écrite et motivée du salarié, si la durée est inférieure à 24 heures",
        quand: "avant la signature", ou: "annexée au contrat",
        loi: "L. 3123-7 du code du travail" });
    }
    return L;
  }

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
      ["L. 1221-19", "période d'essai : deux mois au plus pour un ouvrier ou un employé", "LEGIARTI000019071113"],
      ["L. 1242-7", "cas dans lesquels le CDD peut ne pas comporter de terme précis", "LEGIARTI000033024651"],
      ["L. 1242-12", "mentions obligatoires du CDD, dont la convention collective et la caisse de retraite", "LEGIARTI000006901206"],
      ["L. 1242-13", "remise du contrat dans les deux jours ouvrables", "LEGIARTI000006901207"],
      ["L. 3123-6", "mentions obligatoires du contrat à temps partiel", "LEGIARTI000033020080"],
      ["L. 3123-7", "dérogation à la durée minimale, sur demande écrite et motivée", "LEGIARTI000047453545"],
      ["L. 3123-9", "les heures complémentaires ne portent pas au niveau de la durée légale ou conventionnelle", "LEGIARTI000033020058"],
      ["L. 3123-27", "durée minimale de vingt-quatre heures par semaine", "LEGIARTI000033019953"],
      ["L. 3123-28", "heures complémentaires dans la limite du dixième", "LEGIARTI000033019950"],
      ["L. 3123-29", "majoration de 10 % des heures complémentaires", "LEGIARTI000033019947"],
    ] },
    { t: "SMIC", a: [
      ["12,31 euros", "depuis le 1er juin 2026, arrêté du 22 mai 2026", "JORFTEXT000054126589"],
    ] },
    { t: "Convention collective IDCC 16", a: [
      ["Annexe I, art. 3", "essai des ouvriers : un mois pour le personnel de conduite, deux semaines pour les autres", "KALIARTI000005849363"],
      ["Annexe I, art. 3 bis", "mentions de la lettre d'embauche et adresses des caisses", "KALIARTI000005849365"],
      ["Annexe I, art. 5", "préavis des ouvriers, et démission de deux semaines dans le transport de marchandises", "KALIARTI000045968978"],
      ["Annexe I, art. 11 bis", "visites médicales à la charge de l'entreprise, temps payé", "KALIARTI000005849396"],
      ["Annexe II, art. 11", "essai des employés : un mois", "KALIARTI000005849507"],
      ["Annexe II, art. 13", "préavis des employés : un mois, deux mois après deux ans", "KALIARTI000005849509"],
      ["Accord du 23 avril 2002, art. 2", "majorations du temps de service : 25 % de la 153e à la 186e heure, 50 % au-delà", "KALIARTI000023750163"],
      ["Accord du 11 octobre 2023", "taux horaires et garanties annuelles des ouvriers et des employés", "KALIARTI000049067165"],
      ["Avenant n° 81 du 2 décembre 2025", "frais de déplacement des ouvriers marchandises au 1er janvier 2026", "KALIARTI000053715771"],
      ["Protocole du 30 avril 1974, art. 13", "frais à l'étranger majorés de 18 %", "KALIARTI000005849475"],
      ["Accord du 14 novembre 2001, art. 1 et 3", "période nocturne de 21 h à 6 h, prime de 20 % du coefficient 150 M", "KALIARTI000032302217"],
      ["Accord du 12 novembre 1998, art. 3", "garantie d'amplitude des grands routiers : 75 % des amplitudes cumulées", "KALIARTI000005850018"],
      ["Accord du 13 novembre 1992, art. 2", "la suspension du permis n'entraîne pas par elle-même la rupture", "KALIARTI000005849772"],
    ] },
  ];

  window.ContratsTransport = {
    CCN: CCN, PROFILS: PROFILS, DROIT: DROIT,
    profil: profil, tauxDe: tauxDe, salaire: salaire, garantie: garantie,
    ecrire: ecrire, reserve: reserve, formalites: formalites,
    annexeDemande: annexeDemande, annexeDue: annexeDue,
    fr: fr, dateFr: dateFr,
  };

})(window);
