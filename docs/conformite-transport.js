/* LA CONFORMITÉ TRANSPORT ET LE CONTRÔLE DRIEAT.

   POURQUOI CE FICHIER EXISTE

   Le contrôle de la DRIEAT sur T.E.C., novembre 2025, et la saisine de la
   commission territoriale des sanctions administratives qui a suivi. On en a
   tiré un dossier de défense complet : des observations, un tableau des
   infractions ligne par ligne, une note d'exonération. Ce fichier range ce
   travail dans l'application pour qu'il serve au prochain contrôle, et il
   ajoute ce qui le précède : le dispositif de conformité qui, tenu au jour le
   jour, permet à l'employeur d'établir qu'il a veillé au respect de la
   réglementation par ses conducteurs.

   DEUX ESPACES

   La prévention : les documents que l'entreprise doit tenir (consigne signée,
   journal de téléchargement, registre des anomalies, compte rendu de contrôle
   hebdomadaire), et l'échéancier des téléchargements (carte et véhicule).
   La défense : le rétroplanning des délais de la commission, la note de
   méthode et la liste des moyens, prêts le jour du contrôle.

   LE LIEN AVEC LA FLOTTE ET LE REGISTRE

   Rien ne se saisit deux fois. Les véhicules viennent de la flotte
   (flotte-vehicules), les conducteurs du registre du personnel
   (registre-personnel). L'échéancier des téléchargements se calcule par
   véhicule et par conducteur à partir des dates portées ici, et se range avec
   les autres échéances de l'agenda.

   CE QUI EST FONDÉ, ET COMMENT

   Les articles cités ont été lus à la source par le relais Légifrance de
   l'application le 2 novembre 2026, le code des transports comme le code du
   travail. L'identifiant de version est consigné avec le numéro : un article
   se modifie sans changer de numéro. Les périodicités de vingt-huit et
   quatre-vingt-dix jours viennent du règlement (UE) n° 165/2014, auquel
   R. 3313-7 renvoie ; le rapport de la DRIEAT retient quatre-vingt-quinze
   jours pour le véhicule, repris ici comme la borne de l'administration.      */

(function (window) {
  "use strict";

  /* Les articles, avec l'identifiant de la version lue le 2 novembre 2026. */
  var T = {
    "R3313-7":  { id: "LEGIARTI000033450393", code: "transports",
      objet: "obligation de télécharger les données du tachygraphe et des cartes" },
    "R3452-20": { id: "LEGIARTI000033450703", code: "transports",
      objet: "procédure contradictoire devant la commission des sanctions" },
    "R3452-21": { id: "LEGIARTI000033450705", code: "transports",
      objet: "convocation trois semaines avant la séance, accès au dossier" },
    "L1332-4":  { id: "LEGIARTI000006901450", code: "travail",
      objet: "délai de deux mois pour engager les poursuites disciplinaires" },
  };
  function art(n) { return n.replace(/^([LRD])(\d)/, "$1. $2"); }

  function lire(c, d) {
    try { return JSON.parse(window.localStorage.getItem(c) || "null") || d; }
    catch (e) { return d; }
  }
  function garder(c, v) { try { window.localStorage.setItem(c, JSON.stringify(v)); } catch (e) {} }

  function profil() {
    if (window.Profil && window.Profil.lire) return window.Profil.lire() || {};
    return lire("profil-entreprise", {}) || {};
  }

  /* Transport ? Le secteur de la fiche ou l'IDCC 16 le dit. On réutilise la
     règle de documents-transport.js quand elle est chargée, sinon la nôtre. */
  function estTransport(p) {
    p = p || profil();
    if (window.Transport && window.Transport.estTransport && window.Transport.estTransport(p)) return true;
    var s = String(p.secteur || "").toLowerCase();
    if (s.indexOf("transport") >= 0 || s.indexOf("logistique") >= 0) return true;
    var c = String(p.conventionCollective || p.convention || p.idcc || "");
    if (/transports routiers/i.test(c)) return true;
    /* L'IDCC du transport est 16 : deux chiffres, que le filtre à trois ou
       quatre chiffres manquait. On lit chaque groupe de chiffres et on
       normalise (16, 0016, « IDCC 16 » valent 16 ; 1601 ne vaut pas 16). */
    var nums = (c.match(/\d+/g) || []).map(Number);
    return nums.indexOf(16) >= 0;
  }

  /* ───────────────────────────── les dates ──────────────────────────────── */

  var STORE = "conformite-transport";
  function etat() {
    return lire(STORE, { vehicules: {}, cartes: {}, anomalies: [], controles: [] });
  }
  function garderEtat(e) { garder(STORE, e); }

  function iso(d) { return new Date(d).toISOString().slice(0, 10); }
  function ajouterJours(dateStr, n) {
    var d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + n);
    return iso(d);
  }
  function joursEntre(a, b) {
    return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
  }
  function qualifier(echeanceStr) {
    var j = joursEntre(iso(new Date()), echeanceStr);
    if (j < 0) return { etat: "dépassé", jours: j, fond: "rouge" };
    if (j <= 7) return { etat: "proche", jours: j, fond: "orange" };
    return { etat: "à jour", jours: j, fond: "vert" };
  }

  /* L'ÉCHÉANCIER DES TÉLÉCHARGEMENTS.

     La carte de chaque conducteur se télécharge tous les vingt-huit jours, le
     tachygraphe de chaque véhicule tous les quatre-vingt-dix jours (borne du
     rapport : quatre-vingt-quinze). On lit la dernière date portée ici, on
     ajoute le délai, on qualifie. Pas de date : l'échéance est « à renseigner ». */
  var DELAI_CARTE = 28, DELAI_VEHICULE = 90;

  function vehiculesFlotte() {
    if (window.Flotte && window.Flotte.vehicules) return window.Flotte.vehicules() || [];
    return lire("flotte-vehicules", []) || [];
  }

  /* LES CONDUCTEURS DU REGISTRE. On réutilise la lecture de la flotte quand
     elle est chargée : le registre est un objet { salaries: [...] } où le poste
     (champ emp) dit qui conduit, et où l'on ne garde que les présents. À défaut,
     on relit nous-mêmes la même structure. */
  function net(s) { return String(s == null ? "" : s).trim(); }
  function sansAccent(s) {
    try {
      return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    } catch (e) { return String(s == null ? "" : s).toLowerCase(); }
  }
  var CONDUIT = /conducteur|conductrice|chauffeur|routier|livreur|coursier|cariste|grutier|ambulancier|convoyeur/i;
  var POIDS_LOURD = /poids\s*lourd|p\.?\s*l\b|routier|grand\s*routier|super\s*lourd|spl|pl\b|semi|tracteur|porteur|40\s*t|19\s*t|26\s*t/i;

  function salariesTous() {
    if (window.Flotte && window.Flotte.salaries) return window.Flotte.salaries(true) || [];
    var r = lire("registre-personnel", {}) || {};
    var L = ((r && r.salaries) || []).filter(function (s) { return net(s.nom) || net(s.pre); })
      .map(function (s) {
        var nom = (net(s.nom) + " " + net(s.pre)).trim();
        return { id: sansAccent(nom) || "salarie", nom: nom, emp: net(s.emp),
          ent: net(s.ent), sor: net(s.sor), conduit: CONDUIT.test(net(s.emp)) };
      });
    return L;
  }
  /* Les conducteurs présents, poids lourd et autres : c'est la liste du suivi.
     Si aucun poste ne porte un intitulé de conduite, on rend tous les présents
     plutôt qu'un écran vide, et c'est à l'utilisateur de voir. */
  function salariesRegistre() {
    var L = salariesTous();
    var C = L.filter(function (s) { return s.conduit && !net(s.sor); });
    var base = C.length ? C : L.filter(function (s) { return !net(s.sor); });
    return base.map(function (s) {
      return { id: s.id, nom: s.nom, poste: s.emp || s.poste || "",
        conduit: s.conduit !== false, poidsLourd: POIDS_LOURD.test(net(s.emp || s.poste)) };
    });
  }

  function echeances() {
    var e = etat(), out = [];
    vehiculesFlotte().forEach(function (v) {
      var immat = v.immat || "véhicule sans immatriculation";
      var der = (e.vehicules[immat] || {}).dernier;
      if (!der) { out.push({ quoi: "Téléchargement du véhicule", qui: immat, date: null,
        etat: "à renseigner", jours: null, fond: "gris" }); return; }
      var ech = ajouterJours(der, DELAI_VEHICULE), q = qualifier(ech);
      out.push({ quoi: "Téléchargement du véhicule", qui: immat, date: ech,
        etat: q.etat, jours: q.jours, fond: q.fond, dernier: der });
    });
    salariesRegistre().forEach(function (s) {
      var der = (e.cartes[s.id] || {}).dernier;
      if (!der) { out.push({ quoi: "Téléchargement de la carte", qui: s.nom, date: null,
        etat: "à renseigner", jours: null, fond: "gris" }); return; }
      var ech = ajouterJours(der, DELAI_CARTE), q = qualifier(ech);
      out.push({ quoi: "Téléchargement de la carte", qui: s.nom, date: ech,
        etat: q.etat, jours: q.jours, fond: q.fond, dernier: der });
    });
    return out;
  }

  function porterTelechargementVehicule(immat, dateStr) {
    var e = etat(); e.vehicules[immat] = { dernier: dateStr }; garderEtat(e);
  }
  function porterTelechargementCarte(salarieId, dateStr) {
    var e = etat(); e.cartes[salarieId] = { dernier: dateStr }; garderEtat(e);
  }

  /* L'ÉCHÉANCE DU CERTIFICAT DU CONSEILLER ADR : on porte sa date de fin de
     validité, on qualifie. Il se renouvelle avant cette date. */
  function porterCertificatADR(dateFin) { var e = etat(); e.adr = { fin: dateFin }; garderEtat(e); }
  function echeanceADR() {
    var e = etat(); if (!e.adr || !e.adr.fin) return null;
    var q = qualifier(e.adr.fin);
    return { quoi: "Certificat du conseiller à la sécurité ADR", date: e.adr.fin,
      etat: q.etat, jours: q.jours, fond: q.fond };
  }

  /* LE DÉLAI DISCIPLINAIRE (L. 1332-4). Deux mois à compter de la connaissance
     des faits, sauf poursuites pénales exercées dans ce délai. */
  function delaiDisciplinaire(dateConnaissance) {
    if (!dateConnaissance) return null;
    var d = new Date(dateConnaissance + "T00:00:00");
    d.setMonth(d.getMonth() + 2);
    var ech = iso(d), q = qualifier(ech);
    return { echeance: ech, etat: q.etat, jours: q.jours,
      reserve: "Sauf si ces faits ont donné lieu, dans ce même délai, à l'exercice de " +
        "poursuites pénales : la seule transmission du procès-verbal au procureur ne suffit pas " +
        "(critère de la mise en mouvement de l'action publique, Cass. soc. 13 octobre 2016, " +
        "n° 15-14.006)." };
  }

  /* ───────────────── le suivi par conducteur, poids lourd et autres ─────────

     Chaque conducteur du registre a sa fiche de suivi : les instructions qu'il
     a reçues (encadrement), les anomalies relevées sur lui (contrôle et suivi),
     et les mesures prises en réaction, rangées en trois catégories, correction,
     ajustement, sanction. C'est le lien direct avec la troisième condition de
     l'exonération : quand un manquement se répète, il faut une réaction, et la
     fiche le dit tout de suite quand elle manque. Rien ne s'invente : le nom et
     le poste viennent du registre, les dates sont celles qu'on porte ici.     */

  var CATEGORIES = [
    { cle: "correction", nom: "Correction", sens: "rappeler la règle et corriger l'écart (rappel écrit, consigne resignée)" },
    { cle: "ajustement", nom: "Ajustement", sens: "adapter l'organisation pour que l'écart ne se reproduise pas (planning, formation, changement d'affectation)" },
    { cle: "sanction", nom: "Sanction", sens: "sanction disciplinaire, dans le délai de deux mois de " + art("L1332-4") },
  ];

  function suiviConducteur(id) {
    var e = etat();
    var s = (e.suivi && e.suivi[id]) || {};
    return { anomalies: (s.anomalies || []).slice(), mesures: (s.mesures || []).slice() };
  }
  function garderSuivi(id, s) {
    var e = etat(); e.suivi = e.suivi || {}; e.suivi[id] = s; garderEtat(e);
  }
  function ajouterAnomalie(id, a) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.anomalies = s.anomalies || [];
    s.anomalies.push({ date: a.date || iso(new Date()), type: net(a.type), detail: net(a.detail) });
    e.suivi[id] = s; garderEtat(e);
  }
  function ajouterMesure(id, m) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.mesures = s.mesures || [];
    s.mesures.push({ date: m.date || iso(new Date()), categorie: net(m.categorie),
      objet: net(m.objet), pour: net(m.pour) });
    e.suivi[id] = s; garderEtat(e);
  }
  function supprimerAnomalie(id, i) {
    var e = etat(); var s = (e.suivi && e.suivi[id]) || {};
    if (s.anomalies && s.anomalies[i]) { s.anomalies.splice(i, 1); garderSuivi(id, s); }
  }
  function supprimerMesure(id, i) {
    var e = etat(); var s = (e.suivi && e.suivi[id]) || {};
    if (s.mesures && s.mesures[i]) { s.mesures.splice(i, 1); garderSuivi(id, s); }
  }

  /* L'ÉTAT D'UN CONDUCTEUR. Le point qui décide : un même type d'anomalie
     relevé deux fois ou plus est un manquement répété ; s'il n'a pas appelé de
     mesure postérieure à la deuxième occurrence, la réaction manque, et c'est
     précisément ce qui fait tomber l'exonération. On le signale en rouge. */
  function etatConducteur(id) {
    var s = suiviConducteur(id);
    var anos = s.anomalies, mes = s.mesures;
    if (!anos.length) {
      return { fond: "vert", etat: "aucune anomalie", anomalies: 0, mesures: mes.length,
        repetes: [], message: "Aucune anomalie relevée." };
    }
    /* Regrouper par type, trier les dates. */
    var par = {};
    anos.forEach(function (a) {
      var t = (a.type || "non précisé").toLowerCase();
      (par[t] = par[t] || []).push(a.date || "");
    });
    var repetes = [], sansReaction = [];
    Object.keys(par).forEach(function (t) {
      var dates = par[t].filter(Boolean).sort();
      if (par[t].length < 2) return;
      repetes.push({ type: t, nombre: par[t].length });
      /* La deuxième occurrence (ou la dernière connue) appelle une réaction
         datée au moins de ce jour-là. */
      var seuil = dates[1] || dates[0] || "";
      var reaction = mes.some(function (m) {
        var surLePoint = !net(m.pour) || m.pour.toLowerCase().indexOf(t) >= 0;
        return surLePoint && (!seuil || (m.date || "") >= seuil);
      });
      if (!reaction) sansReaction.push({ type: t, depuis: seuil });
    });
    if (sansReaction.length) {
      return { fond: "rouge", etat: "manquement répété sans réaction", anomalies: anos.length,
        mesures: mes.length, repetes: repetes, sansReaction: sansReaction,
        message: "Manquement répété sans mesure en réaction : " +
          sansReaction.map(function (x) { return x.type; }).join(", ") +
          ". La troisième condition de l'exonération n'est pas tenue tant qu'une mesure n'est pas prise." };
    }
    if (repetes.length) {
      return { fond: "orange", etat: "manquements répétés, réaction prise", anomalies: anos.length,
        mesures: mes.length, repetes: repetes,
        message: "Manquements répétés, mais une mesure a été prise en réaction." };
    }
    return { fond: "orange", etat: "anomalies suivies", anomalies: anos.length, mesures: mes.length,
      repetes: [], message: "Anomalies relevées, sans répétition d'un même type." };
  }

  /* La liste complète pour l'écran : chaque conducteur présent, avec son état. */
  function conducteurs() {
    return salariesRegistre().map(function (s) {
      var et = etatConducteur(s.id);
      return { id: s.id, nom: s.nom, poste: s.poste, poidsLourd: s.poidsLourd,
        etat: et.etat, fond: et.fond, anomalies: et.anomalies, mesures: et.mesures,
        message: et.message };
    });
  }

  /* LA FICHE DE SUIVI EN WORD, à l'en-tête de l'entreprise. */
  function ficheSuiviItems(id) {
    var p = profil();
    var sal = salariesRegistre().filter(function (x) { return x.id === id; })[0]
      || { nom: id, poste: "" };
    var s = suiviConducteur(id), et = etatConducteur(id);
    var sous = [p.adresse || p.siege, p.siret ? "SIRET : " + p.siret : ""].filter(Boolean).join("  ·  ");
    var items = [{ k: "bandeau", t: p.denomination || p.raisonSociale || "[Entreprise]", sous: sous }];
    items.push({ k: "h1", t: "FICHE DE SUIVI DU CONDUCTEUR" });
    items.push({ k: "p", t: sal.nom + (sal.poste ? "  ·  " + sal.poste : "") +
      (sal.poidsLourd ? "  ·  poids lourd" : "") });
    items.push({ k: "p", t: "État au " + iso(new Date()) + " : " + et.message });

    items.push({ k: "h2", t: "Encadrement" });
    items.push({ k: "p", t: "Consigne de conduite avec carte remise et signée le [DATE]. Rappels de la réglementation : [DATES]." });

    items.push({ k: "h2", t: "Contrôle et anomalies relevées" });
    if (s.anomalies.length) {
      items.push({ k: "table", head: ["Date", "Type", "Détail"],
        rows: s.anomalies.map(function (a) { return [a.date || "", a.type || "", a.detail || ""]; }) });
    } else {
      items.push({ k: "p", t: "Aucune anomalie relevée à ce jour." });
    }

    items.push({ k: "h2", t: "Réactions : correction, ajustement, sanction" });
    if (s.mesures.length) {
      items.push({ k: "table", head: ["Date", "Catégorie", "Mesure", "Pour le manquement"],
        rows: s.mesures.map(function (m) {
          var cat = (CATEGORIES.filter(function (c) { return c.cle === (m.categorie || "").toLowerCase(); })[0] || {}).nom || m.categorie || "";
          return [m.date || "", cat, m.objet || "", m.pour || ""]; }) });
    } else {
      items.push({ k: "p", t: "Aucune mesure prise à ce jour." });
    }
    items.push({ k: "note", t: "Une sanction disciplinaire se prend dans les deux mois de la connaissance des faits (" + art("L1332-4") + " du code du travail), sauf poursuites pénales exercées dans ce délai." });

    items.push({ k: "h2", t: "Le droit" });
    items.push({ k: "puce", t: "Exonération de l'employeur : instruire, s'assurer du respect effectif à intervalles réguliers, et réagir en cas de manquements répétés (Cass. crim. 16 janvier 1990, n° 89-82.880)." });
    items.push({ k: "puce", t: "Enregistrement par le chronotachygraphe : " + art("R3313-7") + " du code des transports." });
    return items;
  }

  function enWordSuivi(id) {
    if (!window.AuditExport) return false;
    var sal = salariesRegistre().filter(function (x) { return x.id === id; })[0] || { nom: id };
    window.AuditExport.telecharger(
      window.AuditExport.docx(ficheSuiviItems(id), "Fiche de suivi - " + sal.nom, { sansTitre: false }),
      "suivi-" + id + "-" + iso(new Date()) + ".docx");
    return true;
  }

  /* ─────────────────────── les documents de prévention ──────────────────── */

  function b(k, t) { return { k: k, t: t }; }

  function docConsigne() {
    return {
      cle: "consigne-carte", nom: "Consigne de conduite avec carte",
      sous: "Signée par chaque conducteur, versée à son dossier",
      blocs: [
        b("h1", "CONSIGNE DE CONDUITE AVEC CARTE DE CONDUCTEUR"),
        b("p", "La présente consigne rappelle les règles dont le respect est une obligation professionnelle de chaque conducteur. Elle est signée et versée au dossier individuel."),
        b("h2", "La carte de conducteur"),
        b("p", "La carte est insérée avant tout déplacement du véhicule, y compris une simple manœuvre sur un site ou au dépôt, et retirée à la fin du service. Elle est personnelle et ne se prête pas."),
        b("p", "Aucun déplacement ne se fait carte retirée. Une carte perdue, volée ou défectueuse se déclare immédiatement, et les feuillets manuels sont renseignés en attendant son remplacement."),
        b("h2", "Le sélecteur d'activités"),
        b("p", "Les changements d'activité, conduite, autre travail, disponibilité, repos, sont saisis au moment où ils interviennent. Aucune manipulation destinée à minimiser le temps de travail ou de conduite n'est tolérée."),
        b("h2", "Les temps de conduite et de repos"),
        b("p", "Les durées du règlement (CE) n° 561/2006 se respectent sans exception. Un planning qui paraît impossible à tenir se signale à l'exploitation avant le départ, jamais après. Un retard ne se rattrape ni sur une pause ni sur un repos."),
        b("h2", "Le repos hebdomadaire"),
        b("p", "Le repos hebdomadaire normal ne se prend pas à bord du véhicule : l'hébergement est organisé et pris en charge par l'entreprise."),
        b("sign", "Le conducteur reconnaît avoir reçu et compris la présente consigne."),
      ],
      formalites: [
        "Remettre un exemplaire signé à chaque conducteur et en conserver un au dossier individuel.",
        "La faire signer à l'embauche, puis à chaque rappel.",
        "La tenir à disposition en cas de contrôle : c'est l'instruction écrite que la jurisprudence exige.",
      ],
      droit: [
        "Obligation d'enregistrement par le chronotachygraphe : " + art("R3313-7") + " du code des transports, renvoyant au règlement (UE) n° 165/2014.",
        "Exonération de l'employeur subordonnée à la preuve d'instructions données et de contrôles effectifs : Cass. crim. 16 janvier 1990, n° 89-82.880.",
      ],
    };
  }

  function docJournal() {
    return {
      cle: "journal-telechargement", nom: "Journal de téléchargement",
      sous: "Carte tous les 28 jours, véhicule tous les 90 jours, daté",
      blocs: [
        b("h1", "JOURNAL DE TÉLÉCHARGEMENT DES DONNÉES"),
        b("p", "Ce journal prouve la régularité des téléchargements. Chaque opération y est portée, datée et signée par le responsable désigné."),
        b("p", "Responsable des téléchargements : [NOM OU FONCTION]."),
        b("h2", "Cartes des conducteurs, tous les 28 jours"),
        b("table", "Conducteur | Numéro de carte | Date du téléchargement | Prochaine échéance | Visa"),
        b("h2", "Véhicules, tous les 90 jours"),
        b("table", "Véhicule | Immatriculation | Date du téléchargement | Prochaine échéance | Visa"),
        b("note", "Les données sont conservées de façon à en garantir la sécurité et l'exactitude, et au moins douze mois."),
      ],
      formalites: [
        "Tenir le journal au fil des téléchargements, sans le reconstituer après coup.",
        "Conserver les fichiers téléchargés au moins douze mois.",
        "Les échéances se suivent dans l'application, calculées par conducteur et par véhicule.",
      ],
      droit: [
        art("R3313-7") + " du code des transports : téléchargement des données du tachygraphe de chaque véhicule et de la carte de chaque conducteur, dans les conditions du règlement (UE) n° 165/2014.",
      ],
    };
  }

  function docRegistre() {
    return {
      cle: "registre-anomalies", nom: "Registre des anomalies",
      sous: "Chaque écart détecté, suivi jusqu'à sa clôture",
      blocs: [
        b("h1", "REGISTRE DES ANOMALIES"),
        b("p", "Toute anomalie détectée lors d'un contrôle ou d'un téléchargement y est inscrite, avec la mesure prise et sa date de clôture. C'est la trace du contrôle effectif, et de la réaction aux manquements."),
        b("table", "Date | Conducteur ou véhicule | Anomalie constatée | Mesure prise | Date de clôture"),
        b("note", "Une anomalie qui se répète appelle une mesure propre à éviter qu'elle ne se reproduise : rappel formalisé, formation, changement d'affectation, et le cas échéant sanction disciplinaire dans le délai de deux mois."),
      ],
      formalites: [
        "Inscrire chaque anomalie le jour où elle est constatée.",
        "Suivre chaque ligne jusqu'à sa clôture.",
        "Conserver le registre : il établit la réaction aux manquements répétés.",
      ],
      droit: [
        "Troisième condition de l'exonération : en cas de manquements répétés, prendre les mesures nécessaires pour éviter qu'ils ne se reproduisent (Cass. crim. 16 janvier 1990, n° 89-82.880).",
        "Délai de la sanction disciplinaire : " + art("L1332-4") + " du code du travail, deux mois à compter de la connaissance des faits.",
      ],
    };
  }

  function docControle() {
    return {
      cle: "controle-hebdomadaire", nom: "Compte rendu de contrôle hebdomadaire",
      sous: "Le référent conformité vérifie les temps, daté et signé",
      blocs: [
        b("h1", "CONTRÔLE HEBDOMADAIRE DES TEMPS DE CONDUITE ET DE REPOS"),
        b("p", "Chaque semaine, le référent conformité vérifie les temps de conduite et de repos à partir des données téléchargées, et consigne le résultat."),
        b("p", "Semaine du [DATE] au [DATE]. Référent : [NOM OU FONCTION]."),
        b("table", "Conducteur | Dépassement relevé | Repos insuffisant | Observation | Suite donnée"),
        b("p", "Anomalies reportées au registre des anomalies : [OUI / NON]."),
        b("sign", "Fait le [DATE], [NOM], référent conformité."),
      ],
      formalites: [
        "Établir le compte rendu chaque semaine, daté et signé.",
        "Reporter les anomalies au registre des anomalies.",
        "Conserver les comptes rendus : ils établissent le contrôle à intervalles réguliers.",
      ],
      droit: [
        "Deuxième condition de l'exonération : s'assurer à intervalles réguliers du respect effectif de la réglementation (Cass. crim. 16 janvier 1990, n° 89-82.880).",
      ],
    };
  }

  function docConseiller() {
    return {
      cle: "conseiller-adr", nom: "Conseiller à la sécurité ADR",
      sous: "Désignation, attestation de mission, suivi du certificat",
      blocs: [
        b("h1", "DÉSIGNATION DU CONSEILLER À LA SÉCURITÉ POUR LE TRANSPORT DE MARCHANDISES DANGEREUSES"),
        b("p", "L'entreprise désigne comme conseiller à la sécurité : [NOM], titulaire du certificat n° [NUMÉRO], valable jusqu'au [DATE]."),
        b("p", "Le conseiller accepte la mission à compter du [DATE]. La déclaration dans la base nationale (téléservice CSTMD) est effectuée sans délai."),
        b("note", "La désignation et la télédéclaration sont deux formalités distinctes : le conseiller peut être missionné par un acte interne daté, la déclaration nationale pouvant être postérieure. Les deux pièces se produisent ensemble."),
        b("h2", "Mission"),
        b("p", "Le conseiller examine les pratiques et procédures de l'entreprise, établit le rapport annuel, et conseille sur les opérations d'expédition, d'emballage, de chargement et de déchargement liées au transport de marchandises dangereuses."),
        b("sign", "Fait à [LIEU], le [DATE]."),
      ],
      formalites: [
        "Conserver l'attestation d'acceptation de mission datée et signée, et la facture ou le contrat du conseiller.",
        "Déclarer le conseiller dans la base nationale et conserver l'attestation de déclaration.",
        "Suivre l'échéance du certificat : il se renouvelle avant sa date de fin de validité.",
      ],
      droit: [
        "Obligation de désigner un conseiller à la sécurité : arrêté TMD du 29 mai 2009 modifié, pris pour l'application de l'ADR (section 1.8.3).",
      ],
    };
  }

  function docLettreVoiture() {
    return {
      cle: "documents-bord", nom: "Documents de bord",
      sous: "Lettre de voiture, justificatif de location, livret de contrôle",
      blocs: [
        b("h1", "DOCUMENTS DEVANT SE TROUVER À BORD"),
        b("p", "À chaque départ, le conducteur vérifie la présence et la validité des documents suivants."),
        b("h2", "Lettre de voiture"),
        b("p", "La lettre de voiture accompagne la marchandise : expéditeur, destinataire, nature et poids, lieux de prise en charge et de livraison. Une réserve se porte sur le document au déchargement, en présence de celui qui reçoit."),
        b("h2", "Justificatif de location"),
        b("p", "Pour un véhicule loué, le contrat de location, ou son justificatif, se trouve à bord. [Référence du contrat et durée.]"),
        b("h2", "Livret individuel de contrôle (véhicules de moins de 3,5 tonnes)"),
        b("p", "Pour les véhicules de moins de 3,5 tonnes non équipés de chronotachygraphe, le livret individuel de contrôle enregistre les temps de conduite et de repos. Il est tenu à jour et présenté au contrôle."),
      ],
      formalites: [
        "Doter chaque véhicule de moins de 3,5 tonnes d'un livret individuel de contrôle et en vérifier la tenue.",
        "Conserver à bord le justificatif de location des véhicules loués.",
        "Rapporter les lettres de voiture signées au retour de tournée.",
      ],
      droit: [
        "Documents de transport et livret individuel de contrôle : code des transports et réglementation routière ; à produire au contrôle.",
      ],
    };
  }

  function documents() {
    return [docConsigne(), docJournal(), docRegistre(), docControle(),
      docConseiller(), docLettreVoiture()];
  }

  /* LE TÉLÉCHARGEMENT EN WORD, À L'EN-TÊTE DE L'ENTREPRISE. On réutilise le
     générateur de l'application (AuditExport.docx), en convertissant les blocs
     du document en éléments qu'il connaît, et en plaçant en tête le nom et les
     coordonnées de la fiche d'entreprise. */
  function docItems(d) {
    var p = profil();
    var sous = [p.adresse || p.siege, p.siret ? "SIRET : " + p.siret : ""]
      .filter(Boolean).join("  ·  ");
    var items = [{ k: "bandeau", t: p.denomination || p.raisonSociale || "[Entreprise]", sous: sous }];
    d.blocs.forEach(function (bl) {
      if (bl.k === "table") {
        var cols = bl.t.split(" | ");
        items.push({ k: "table", head: cols, rows: [cols.map(function () { return " "; })] });
      } else if (bl.k === "sign") {
        items.push({ k: "p", t: bl.t });
        items.push({ k: "p", t: "Date et signature :" });
      } else {
        items.push({ k: bl.k, t: bl.t }); /* h1, h2, p, note sont reconnus */
      }
    });
    items.push({ k: "h2", t: "Formalités" });
    d.formalites.forEach(function (f) { items.push({ k: "puce", t: f }); });
    items.push({ k: "h2", t: "Le droit" });
    d.droit.forEach(function (f) { items.push({ k: "puce", t: f }); });
    return items;
  }

  function enWord(cle) {
    if (!window.AuditExport) return false;
    var d = documents().filter(function (x) { return x.cle === cle; })[0];
    if (!d) return false;
    window.AuditExport.telecharger(
      window.AuditExport.docx(docItems(d), d.nom, { sansTitre: false }),
      cle + "-" + iso(new Date()) + ".docx");
    return true;
  }

  /* ─────────────────────────── le kit de défense ────────────────────────── */

  /* Le rétroplanning des délais de la commission, à partir de la date de la
     séance. Les délais viennent de R. 3452-21, lu à la source. */
  function retroplanning(dateSeance) {
    var etapes = [
      { quoi: "Convocation reçue au plus tard", regle: "trois semaines avant la séance", jours: -21 },
      { quoi: "Communication du rapport de présentation au plus tard", regle: "cinq jours avant la séance", jours: -5 },
      { quoi: "Demander la consultation du dossier et l'audition orale", regle: "dès réception de la convocation", jours: -20 },
      { quoi: "Déposer les observations écrites", regle: "avant la séance", jours: -2 },
      { quoi: "Séance de la commission", regle: "", jours: 0 },
    ];
    return etapes.map(function (e) {
      var o = { quoi: e.quoi, regle: e.regle };
      if (dateSeance) o.date = ajouterJours(dateSeance, e.jours);
      return o;
    });
  }

  function noteMethode() {
    return {
      titre: "Note de méthode : l'exonération de l'employeur",
      blocs: [
        b("p", "Devant le juge pénal, l'employeur peut s'exonérer de sa responsabilité. Devant la commission, la sanction est administrative : les mesures de conformité n'exonèrent pas, elles pèsent sur la proportionnalité de la mesure."),
        b("h2", "Les trois conditions de l'exonération pénale"),
        b("p", "Le chef d'entreprise ne s'exonère que s'il a informé ses salariés du contenu de la réglementation et leur a donné instruction de la respecter, s'il s'est assuré à intervalles réguliers du respect effectif, et si, en cas de manquements répétés, il a pris les mesures nécessaires pour éviter qu'ils ne se reproduisent (Cass. crim. 16 janvier 1990, n° 89-82.880, publié)."),
        b("p", "Dire « c'est le chauffeur » ne suffit jamais : il faut produire les instructions et les contrôles (Cass. crim. 31 mars 2026, n° 25-82.051, pour la méthode)."),
        b("h2", "Devant la commission"),
        b("p", "Le juge se prononce comme juge de l'excès de pouvoir : il ne module pas, il confirme ou annule après contrôle de proportionnalité. Il faut faire de la disproportion un moyen de légalité."),
      ],
    };
  }

  function checklistMoyens() {
    return [
      "Prescription disciplinaire : le délai de deux mois de " + art("L1332-4") + " court-il encore ? Les conducteurs ont-ils été poursuivis, et TEC est-elle partie ?",
      "Proportionnalité : la mesure est-elle adaptée au parc et à la période ? Chiffrer les conséquences d'un retrait ou d'une immobilisation.",
      "Qualification : un même défaut de carte ne peut être qualifié tantôt simple, tantôt aggravé, sans élément matériel distinct.",
      "Décompte : vérifier les doublons et les périodes non qualifiées, pièce par pièce.",
      "Maîtrise des opérations et délégation : le gérant est-il lui-même gestionnaire de transport ? Un acte de délégation existe-t-il ?",
      "Procédure : convocation reçue au moins trois semaines avant la séance (" + art("R3452-21") + ") ; demande de communication du dossier et d'audition.",
    ];
  }

  /* LA PROPORTIONNALITÉ. Devant la commission, la mesure se pèse au regard du
     comportement et de la situation de l'entreprise : le parc, l'effectif, le
     nombre de copies conformes. Le parc vient de la flotte ; l'effectif et les
     copies conformes de la fiche quand elle les porte, sinon ils restent à
     compléter. Rien ne s'invente. */
  function proportionnalite() {
    var p = profil();
    var parc = vehiculesFlotte().length;
    var eff = p.effectif || p.effectifTotal || null;
    var copies = p.copiesConformes || null;
    var phrases = [];
    phrases.push(parc
      ? "Parc enregistré dans la flotte : " + parc + " véhicule" + (parc > 1 ? "s" : "") + "."
      : "Parc : à renseigner dans la flotte.");
    phrases.push(eff ? "Effectif : " + eff + " salariés." : "Effectif : à reprendre de la fiche.");
    phrases.push(copies ? "Copies conformes détenues : " + copies + "."
      : "Copies conformes détenues : à renseigner (c'est sur ce total que se mesure un retrait).");
    phrases.push("Un retrait de copies conformes ou une immobilisation prive des conducteurs de travail et met en cause les contrats de sous-traitance : la mesure se rapporte au parc et à la période, non à un volume brut d'infractions.");
    return { parc: parc, effectif: eff, copies: copies, phrases: phrases };
  }

  function defense() {
    return { retroplanning: retroplanning, note: noteMethode(),
      checklist: checklistMoyens(), proportionnalite: proportionnalite() };
  }

  /* LE TABLEAU DES INFRACTIONS, EN CLASSEUR. Une ligne par infraction, avec la
     colonne des mesures prises pour éviter la réitération (et non « preuve de
     sanction » : c'est la réaction aux manquements répétés qui compte). Les
     feuilles de référence reprennent les véhicules de la flotte et les
     conducteurs du registre, pour renseigner sans se tromper d'orthographe. */
  function exportInfractions() {
    if (!window.TableurExport) return false;
    var cols = ["N°", "Section", "Origine / PV", "Date", "Heure début", "Heure fin",
      "Durée / écart", "Distance (km)", "Code NATINF", "Infraction", "Classe / délit",
      "Conducteur", "N° carte", "Véhicule", "Détail / observation",
      "Mesures prises pour éviter la réitération"];
    var veh = vehiculesFlotte().map(function (v) { return [v.immat || "sans immatriculation"]; });
    var cond = salariesRegistre().map(function (s) { return [s.nom]; });
    var feuilles = [
      { titre: "Infractions", lignes: [cols],
        largeurs: [5, 22, 20, 12, 10, 10, 15, 11, 12, 28, 14, 20, 20, 40, 34] },
      { titre: "Véhicules (flotte)", lignes: [["Immatriculation"]].concat(veh.length ? veh : [[""]]) },
      { titre: "Conducteurs (registre)", lignes: [["Conducteur"]].concat(cond.length ? cond : [[""]]) },
      { titre: "Mode d'emploi", lignes: [
        ["Tableau des infractions"],
        ["Une ligne par infraction, non groupée, avec sa date et son auteur."],
        ["La colonne des mesures se remplit après coup, en cas de manquements répétés."],
        ["Les véhicules et les conducteurs sont repris de la flotte et du registre."],
      ], largeurs: [90] },
    ];
    window.TableurExport.telecharger(window.TableurExport.xlsx(feuilles),
      "tableau-infractions-" + iso(new Date()) + ".xlsx");
    return true;
  }

  /* ─────────────────────────────── export ───────────────────────────────── */

  window.ConformiteTransport = {
    TEXTES: T, art: art,
    estTransport: estTransport,
    documents: documents,
    enWord: enWord,
    defense: defense,
    exportInfractions: exportInfractions,
    retroplanning: retroplanning,
    echeances: echeances,
    porterTelechargementVehicule: porterTelechargementVehicule,
    porterTelechargementCarte: porterTelechargementCarte,
    porterCertificatADR: porterCertificatADR,
    echeanceADR: echeanceADR,
    delaiDisciplinaire: delaiDisciplinaire,
    vehicules: vehiculesFlotte,
    salaries: salariesRegistre,
    CATEGORIES: CATEGORIES,
    conducteurs: conducteurs,
    suiviConducteur: suiviConducteur,
    etatConducteur: etatConducteur,
    ajouterAnomalie: ajouterAnomalie,
    ajouterMesure: ajouterMesure,
    supprimerAnomalie: supprimerAnomalie,
    supprimerMesure: supprimerMesure,
    enWordSuivi: enWordSuivi,
    DELAI_CARTE: DELAI_CARTE, DELAI_VEHICULE: DELAI_VEHICULE,
  };
})(window);
