/* LA FLOTTE ET LES CONDUCTEURS.

   Le pourquoi, et ce que l'écran affirme ou n'affirme pas, sont en tête de
   flotte.html. Ici, la mécanique.

   Tout tient dans une seule idée : une échéance est une date, et une date a
   une couleur. Passée, elle clignote en rouge ; dans les trente jours, elle
   est rouge ; dans les soixante, ambre ; au-delà, verte. Le compteur du haut
   additionne ces couleurs sur les deux fichiers.

   Ce qui est gardé sur le poste :

     flotte-vehicules     les véhicules et leurs dates
     flotte-conducteurs   par salarié du registre, ses titres et ses visites
     registre-personnel   les noms, écrits ailleurs, seulement lus ici        */

"use strict";
(function (window, document) {

  var CLE_V = "flotte-vehicules";
  var CLE_C = "flotte-conducteurs";
  var CLE_REG = "registre-personnel";
  var CLE_IMP = "flotte-import-dernier";   /* ce que la dernière importation a ajouté */

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];

  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lire(c, d) {
    try { return JSON.parse(window.localStorage.getItem(c) || "null") || d; }
    catch (e) { return d; }
  }
  function garder(c, v) { try { window.localStorage.setItem(c, JSON.stringify(v)); } catch (e) {} }
  function net(v) { return String(v == null ? "" : v).trim(); }

  /* RIEN NE S'EFFACE SUR UN SEUL GESTE. Demande du 10 novembre 2026, « colle
     pour tout le reste » : toute action qui efface demande d'abord confirmation.
     Les plus lourdes, qui effacent plusieurs choses ou un véhicule entier,
     demandent en plus de taper un mot. */
  function confirmerDur(message, mot) {
    if (!window.confirm(message)) return false;
    var r = window.prompt("Dernière confirmation. Pour confirmer, tapez " + mot + " en majuscules.");
    if (r === null) return false;
    if (net(r).toUpperCase() !== mot) {
      window.alert("Action annulée : la confirmation ne correspond pas.");
      return false;
    }
    return true;
  }
  function enFrancais(isoDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    if (!m) return "";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  /* Une date, plus un nombre de jours. */
  function plusJours(isoDate, jours) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(net(isoDate));
    if (!m) return "";
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    if (isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + jours);
    return iso(d);
  }
  function nbJours(v, defaut) {
    var n = parseInt(String(v == null ? "" : v).replace(/[^0-9]/g, ""), 10);
    return isFinite(n) && n > 0 ? n : defaut;
  }
  function plusMois(isoDate, mois) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    var n = parseInt(mois, 10);
    if (!m || !n) return "";
    var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    var j = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    d.setDate(Math.min(j, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
    return iso(d);
  }
  function joursAvant(isoDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    if (!m) return null;
    var d = new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    var n = new Date(); n.setHours(0, 0, 0, 0);
    return Math.round((d - n) / 86400000);
  }
  /* La couleur d'une échéance. Le délai d'alerte, en jours, vient des
     paramètres du parc quand il y est réglé (assurance, contrôle technique,
     etc.) ; sinon trente jours par défaut, comme avant. Rouge dès qu'on entre
     dans ce délai, ambre dans les trente jours qui le précèdent. */
  function etat(isoDate, delai) {
    var j = joursAvant(isoDate);
    if (j === null) return "";
    if (j < 0) return "passe";
    var d = delai || 30;
    if (j <= d) return "rouge";
    if (j <= d + 30) return "ambre";
    return "vert";
  }
  /* LE DÉLAI D'ALERTE PAR TYPE D'ÉCHÉANCE. Demande du 10 novembre 2026 :
     « n'oublie surtout pas les alertes ». Les délais réglés dans les
     paramètres du parc commandent enfin les couleurs. Le rapprochement se fait
     sur le mot-clé du type d'échéance. */
  var ALERTE_MOT = {
    "Contrôle technique": "controle technique", "Assurance": "assurance",
    "Copie conforme": "copie conforme", "Chronotachygraphe": "chronotachygraphe",
    "Extincteur": "extincteur",
  };
  function delaiAlerte(quoi) {
    var mot = ALERTE_MOT[quoi];
    if (!mot) return 30;
    var params = null;
    try { params = JSON.parse(window.localStorage.getItem("parc-parametres") || "null"); } catch (e) { params = null; }
    var A = (params && params.alertes) || [];
    for (var i = 0; i < A.length; i++) {
      if (sansAccent(A[i].nom).replace(/-/g, " ").indexOf(mot) >= 0) {
        var n = parseInt(A[i].jours, 10);
        if (isFinite(n) && n > 0) return n;
      }
    }
    return 30;
  }
  function dit(j) {
    if (j === null) return "";
    if (j < 0) return "dépassée de " + (-j) + " jour" + (-j > 1 ? "s" : "");
    if (j === 0) return "aujourd'hui";
    if (j === 1) return "demain";
    return "dans " + j + " jours";
  }

  /* ─────────────────────────── les deux fichiers ────────────────────────── */

  var GENRES = [
    ["vl", "Voiture particulière"],
    ["vul", "Véhicule utilitaire léger, jusqu'à 3,5 t"],
    ["pl", "Poids lourd, plus de 3,5 t"],
    ["tracteur", "Tracteur routier"],
    ["remorque", "Remorque ou semi-remorque"],
    ["public10", "Transport public de personnes, moins de 10 places"],
    ["commun", "Transport en commun de personnes"],
    ["autre", "Autre"],
  ];
  /* La périodicité du contrôle technique, en mois, telle que le code de la
     route la fixe, lu à la source le 15 septembre 2026 (deux lectures
     concordantes chacun) : deux ans pour un véhicule léger, R. 323-22
     (LEGIARTI000034075672) ; un an au-dessus de 3,5 tonnes, R. 323-25
     (LEGIARTI000034075679) ; un an pour le transport public de personnes de
     moins de dix places, R. 323-24 (LEGIARTI000006841864) ; six mois pour le
     transport en commun, R. 323-23 (LEGIARTI000037676165). Le champ reste
     modifiable : c'est la date obtenue qui commande l'alerte. */
  var CT_DEFAUT = { vl: 24, vul: 24, pl: 12, tracteur: 12, remorque: 12,
    public10: 12, commun: 6, autre: 12 };

  var CHAMPS_V = [
    { c: "immat", lib: "Immatriculation", t: "text", maj: true, large: false },
    { c: "genre", lib: "Genre", t: "select", opts: GENRES },
    { c: "marque", lib: "Marque et modèle", t: "text" },
    { c: "conducteur", lib: "Chauffeur attitré", t: "salarie" },
    { c: "mec", lib: "1re mise en circulation", t: "date" },
    { c: "km", lib: "Kilométrage", t: "num" },
    { c: "kmLe", lib: "Relevé le", t: "date" },
    { c: "ct", lib: "Dernier contrôle technique", t: "date" },
    { c: "ctMois", lib: "Périodicité du contrôle, en mois", t: "num" },
    { c: "lim", lib: "Dernier contrôle du limiteur", t: "date" },
    { c: "limMois", lib: "Périodicité du limiteur, en mois", t: "num" },
    { c: "chrono", lib: "Dernier contrôle du chronotachygraphe", t: "date" },
    { c: "chronoMois", lib: "Périodicité du chronotachygraphe, en mois", t: "num" },
    { c: "telecUnite", lib: "Dernier téléchargement de l'unité embarquée", t: "date" },
    { c: "telecUniteJours", lib: "Périodicité du téléchargement, en jours", t: "num" },
    { c: "assur", lib: "Échéance de l'assurance", t: "date" },
    { c: "licence", lib: "Copie conforme de licence, numéro", t: "text" },
    { c: "licenceFin", lib: "Échéance de la copie conforme", t: "date" },
    { c: "revision", lib: "Prochaine révision, au plus tard le", t: "date" },
    { c: "revisionKm", lib: "ou au kilométrage", t: "num" },
    { c: "extincteur", lib: "Échéance de l'extincteur", t: "date" },
    /* LES CHAMPS DU SUIVI DE PARC. Demande du 10 novembre 2026, d'après le
       modèle Avrios : le carburant, le nombre de places, la date d'achat, le
       numéro de contrat d'assurance et le mode de financement. Le financement
       reprend la liste des paramètres du parc. */
    { c: "carburant", lib: "Carburant", t: "select", vals: null, carbs: true },
    { c: "places", lib: "Nombre de places", t: "num" },
    { c: "dateAchat", lib: "Date d'achat", t: "date" },
    { c: "assurContrat", lib: "Numéro de contrat d'assurance", t: "text" },
    { c: "financementType", lib: "Mode de financement", t: "select", parc: "financement" },
    { c: "financement", lib: "Financement, soldé ou échéance", t: "text" },
    { c: "note", lib: "Observations", t: "textarea", large: true },
  ];

  /* Le carburant est une liste figée, courte et stable. Les autres listes, plus
     mouvantes, viennent des paramètres du parc. */
  var CARBURANTS = ["Gazole", "Essence", "Électrique", "GPL", "GNV, bioGNV", "Hybride", "Hydrogène"];

  var SUIVIS = [
    ["", "- à préciser -"],
    ["vip", "Visite d'information et de prévention (5 ans au plus)"],
    ["sir", "Suivi individuel renforcé (4 ans au plus, intermédiaire à 2 ans)"],
  ];

  var CHAMPS_C = [
    { c: "permisNum", lib: "Permis, numéro", t: "text" },
    { c: "permisCat", lib: "Catégories", t: "text" },
    { c: "permisFin", lib: "Validité du permis jusqu'au", t: "date" },
    { c: "points", lib: "Points restants", t: "num" },
    { c: "retraitLe", lib: "Retrait ou suspension, le", t: "date" },
    { c: "retraitFin", lib: "Jusqu'au", t: "date" },
    { c: "retraitMotif", lib: "Motif du retrait ou de la suspension", t: "text", large: true },
    { c: "fco", lib: "Dernière FIMO ou FCO", t: "date" },
    { c: "fcoMois", lib: "Périodicité de la FCO, en mois", t: "num" },
    { c: "carteCond", lib: "Carte de conducteur, échéance", t: "date" },
    { c: "carteQualif", lib: "Carte de qualification, échéance", t: "date" },
    /* LE TÉLÉCHARGEMENT DES DONNÉES, QUE RIEN NE SUIVAIT.

       Relevé le 27 septembre 2026 : aucune échéance de téléchargement, ni pour
       la carte de conducteur, ni pour l'unité embarquée. Ce sont pourtant les
       données que l'inspection demande, et elles s'effacent. La périodicité
       usuelle est de vingt-huit jours pour la carte et de quatre-vingt-dix
       pour l'unité embarquée ; elle vient d'un arrêté que l'application n'a
       pas lu, comme la périodicité du chronotachygraphe : c'est un champ que
       l'entreprise corrige. */
    { c: "telecCarte", lib: "Dernier téléchargement de la carte conducteur", t: "date" },
    { c: "telecCarteJours", lib: "Périodicité du téléchargement, en jours", t: "num" },
    { c: "visitePermisFin", lib: "Visite médicale du permis, valable jusqu'au", t: "date" },
    { c: "suivi", lib: "Suivi médical du travail", t: "select", opts: SUIVIS, large: true },
    { c: "visiteTravail", lib: "Dernière visite avec le médecin du travail", t: "date" },
    { c: "visiteInter", lib: "Dernière visite intermédiaire", t: "date" },
    { c: "attestConduite", lib: "Attestation médicale de conduite, délivrée le", t: "date" },
    { c: "vehicule", lib: "Véhicule habituel", t: "vehicule" },
    { c: "note", lib: "Observations", t: "textarea", large: true },
  ];

  /* LES PIÈCES QUI SE DÉPOSENT VÉHICULE PAR VÉHICULE.

     Le certificat d'immatriculation et le procès-verbal du contrôle technique
     ne sont pas des dates : ce sont des papiers, que le conducteur doit
     présenter à toute réquisition des agents, avec son titre de conduite,
     article R. 233-1 du code de la route, I, 1°, 2° et 7°
     (LEGIARTI000053304279, deux lectures concordantes le 16 septembre 2026).
     Les avoir dans l'application, c'est pouvoir les renvoyer au chauffeur le
     jour où il les a laissés au dépôt. Le fichier entre dans la base des
     documents, rubrique flotte, sous le nom de la pièce et l'immatriculation. */
  var PIECES = [
    { c: "grise", lib: "Carte grise" },
    { c: "pvct", lib: "Procès-verbal du contrôle technique" },
    { c: "assurance", lib: "Attestation d'assurance" },
  ];

  var DU_FICHIER = "date portée au fichier de la flotte, à vérifier sur le justificatif";

  /* L'ENTRETIEN ET CE QU'IL COÛTE.

     Demande du 10 novembre 2026, pour le chef de parc : noter, camion par
     camion, ce qui a été fait, par qui, et le coût. La main d'oeuvre, quand
     elle est faite en interne par les salariés de l'entreprise, se compte en
     heures passées, multipliées par un taux horaire que le chef de parc fixe ;
     s'y ajoutent le coût des pièces et celui de la sous-traitance. Chaque
     intervention porte son total, et chaque véhicule son cumul, pour qu'on
     voie d'un coup d'oeil ce que coûte un camion. Les interventions voyagent
     avec le véhicule, dans son propre enregistrement. */
  /* Le petit camion de la carte, posé dans le rond d'icône. */
  var ICONE_VEH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h11v11H1z"/>' +
    '<path d="M12 8h5l4 4v3h-9V8z"/><circle cx="5.5" cy="18" r="1.9"/><circle cx="16.5" cy="18" r="1.9"/></svg>';

  var CHAMPS_I = [
    { c: "date", lib: "Date de l'intervention", t: "date" },
    { c: "km", lib: "Kilométrage", t: "num" },
    { c: "objet", lib: "Nature des travaux", t: "liste", parc: "typeDepense", large: true },
    { c: "par", lib: "Fait par (atelier interne ou prestataire)", t: "liste", parc: "entreprises", avant: ["Atelier interne"], large: true },
    { c: "piece", lib: "Pièce posée", t: "liste", parc: "typePiece", large: true },
    { c: "heures", lib: "Main d'oeuvre interne, nombre d'heures", t: "heures" },
    { c: "taux", lib: "Taux horaire, en euros", t: "dec" },
    { c: "pieces", lib: "Coût des pièces, en euros", t: "dec" },
    { c: "sous", lib: "Sous-traitance, en euros", t: "dec" },
  ];
  var CLE_TAUX = "flotte-taux-defaut";

  /* Un nombre saisi à la française (virgule, espaces) devient un nombre. */
  function fnum(x) {
    var n = parseFloat(String(x == null ? "" : x).replace(/\s/g, "").replace(",", "."));
    return isFinite(n) ? n : 0;
  }
  /* Un montant en euros, à la française : « 1 234,50 € ». */
  function euros(n) {
    var s = (Math.round(n * 100) / 100).toFixed(2).replace(".", ",");
    var p = s.split(",");
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return p.join(",") + " €";
  }
  function coutInter(it) {
    var mo = fnum(it.heures) * fnum(it.taux);
    return { h: fnum(it.heures), mo: mo, pieces: fnum(it.pieces), sous: fnum(it.sous),
      total: mo + fnum(it.pieces) + fnum(it.sous) };
  }
  function cumulVehicule(v) {
    return (v.interventions || []).reduce(function (s, it) { return s + coutInter(it).total; }, 0);
  }

  function vehicules() { return lire(CLE_V, []); }
  function garderVehicules(L) { garder(CLE_V, L); }

  function sansAccent(s) {
    try {
      return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    } catch (e) { return String(s == null ? "" : s).toLowerCase(); }
  }
  /* QUI CONDUIT, ET QUI NE CONDUIT PAS.

     L'onglet « Conducteurs » listait tout le registre, mécaniciens et
     assistante de direction compris : on y suivait un permis et une carte
     conducteur pour des gens qui ne prennent pas le volant, et les manques
     de ceux qui conduisent se perdaient dans la masse. Relevé le 26 septembre
     2026. Le poste écrit au registre décide ; ceux qui sortis de l'entreprise
     ne comptent plus. Celui dont le poste ne dit rien reste visible, avec les
     autres, quand on demande la liste entière : l'application ne retire
     personne sans le dire.                                                  */
  var CONDUIT = /conducteur|conductrice|chauffeur|routier|livreur|coursier|cariste|grutier|ambulancier|convoyeur/i;
  function salaries(tous) {
    var r = lire(CLE_REG, {});
    var L = ((r && r.salaries) || []).filter(function (s) {
      return net(s.nom) || net(s.pre);
    }).map(function (s) {
      var nom = (net(s.nom) + " " + net(s.pre)).trim();
      return { id: sansAccent(nom) || "salarie", nom: nom, emp: net(s.emp), ent: net(s.ent), sor: net(s.sor),
        conduit: CONDUIT.test(net(s.emp)) };
    });
    if (tous) return L;
    var C = L.filter(function (s) { return s.conduit && !net(s.sor); });
    /* Aucun poste ne porte un intitulé de conduite : plutôt qu'un écran vide,
       la liste entière, et c'est à l'utilisateur de voir. */
    return C.length ? C : L.filter(function (s) { return !net(s.sor); });
  }
  function fiche(id) {
    var t = lire(CLE_C, {});
    return t[id] || {};
  }
  function garderFiche(id, f) {
    var t = lire(CLE_C, {});
    t[id] = f;
    garder(CLE_C, t);
  }

  /* ───────────────────────────── les échéances ──────────────────────────── */

  function echeancesVehicule(v) {
    var L = [];
    /* Le fondement accompagne l'échéance : c'est lui que l'agenda social
       affiche sous la carte, et il dit d'où vient la date. */
    function pose(quoi, date, fond) {
      if (!net(date)) return;
      L.push({ quoi: quoi, date: date, etat: etat(date, delaiAlerte(quoi)), jours: joursAvant(date), fond: fond || DU_FICHIER });
    }
    pose("Contrôle technique", v.ct ? plusMois(v.ct, v.ctMois || CT_DEFAUT[v.genre] || 12) : "",
      "R. 323-22 à R. 323-25 du code de la route, selon le genre du véhicule, à compter du dernier contrôle");
    pose("Limiteur", v.lim ? plusMois(v.lim, v.limMois || 24) : "");
    pose("Chronotachygraphe", v.chrono ? plusMois(v.chrono, v.chronoMois || 24) : "");
    pose("Téléchargement de l'unité embarquée",
      v.telecUnite ? plusJours(v.telecUnite, nbJours(v.telecUniteJours, 90)) : "",
      "périodicité usuelle de quatre-vingt-dix jours, fixée par arrêté, non relue par l'application : corrigez-la si votre protocole diffère");
    pose("Assurance", v.assur);
    pose("Copie conforme", v.licenceFin);
    pose("Révision", v.revision);
    pose("Extincteur", v.extincteur);
    /* La révision au kilométrage n'a pas de date : elle se compare au dernier
       relevé, et se dit en kilomètres. */
    var seuil = parseInt(v.revisionKm, 10), km = parseInt(v.km, 10);
    if (seuil && !isNaN(km)) {
      var reste = seuil - km;
      L.push({
        quoi: "Révision", km: true, reste: reste,
        etat: reste < 0 ? "passe" : (reste <= 1000 ? "rouge" : (reste <= 3000 ? "ambre" : "vert")),
      });
    }
    return L;
  }

  function echeancesConducteur(f) {
    var L = [];
    function pose(quoi, date, fond) {
      if (!net(date)) return;
      L.push({ quoi: quoi, date: date, etat: etat(date, delaiAlerte(quoi)), jours: joursAvant(date), fond: fond || DU_FICHIER });
    }
    pose("Permis", f.permisFin);
    pose("Fin de suspension", f.retraitFin);
    pose("FCO", f.fco ? plusMois(f.fco, f.fcoMois || 60) : "");
    pose("Carte conducteur", f.carteCond);
    pose("Téléchargement de la carte conducteur",
      f.telecCarte ? plusJours(f.telecCarte, nbJours(f.telecCarteJours, 28)) : "",
      "périodicité usuelle de vingt-huit jours, fixée par arrêté, non relue par l'application : corrigez-la si votre protocole diffère");
    pose("Carte de qualification", f.carteQualif);
    pose("Visite du permis", f.visitePermisFin);
    /* Le code du travail, lui, est lu à la source : cinq ans au plus pour le
       renouvellement de la visite d'information et de prévention (R. 4624-16),
       quatre ans au plus en suivi renforcé, avec une visite intermédiaire à
       deux ans au plus tard (R. 4624-28). */
    if (f.suivi === "vip") pose("Visite de prévention", f.visiteTravail ? plusMois(f.visiteTravail, 60) : "",
      "R. 4624-16 du code du travail : renouvellement selon une périodicité qui ne peut excéder cinq ans");
    if (f.suivi === "sir") {
      pose("Visite du médecin", f.visiteTravail ? plusMois(f.visiteTravail, 48) : "",
        "R. 4624-28 du code du travail : périodicité qui ne peut être supérieure à quatre ans");
      pose("Visite intermédiaire", f.visiteTravail
        ? plusMois(f.visiteInter || f.visiteTravail, f.visiteInter ? 48 : 24) : "",
        "R. 4624-28 du code du travail : visite intermédiaire deux ans au plus tard après celle du médecin du travail");
    }
    /* L'attestation d'absence de contre-indication à la conduite d'un
       équipement à risques particuliers vaut cinq ans, et sans elle
       l'autorisation de conduite ne vaut plus : R. 4323-56
       (LEGIARTI000051500371), lu à la source le 15 septembre 2026. */
    pose("Attestation de conduite", f.attestConduite ? plusMois(f.attestConduite, 60) : "",
      "R. 4323-56 du code du travail : attestation d'une validité de cinq ans, sans laquelle l'autorisation de conduite ne vaut plus");
    var pts = parseInt(f.points, 10);
    if (!isNaN(pts)) {
      L.push({
        quoi: "Points", points: true, valeur: pts,
        etat: pts <= 0 ? "passe" : (pts <= 3 ? "rouge" : (pts <= 6 ? "ambre" : "vert")),
      });
    }
    return L;
  }

  /* UNE DATE QUI MANQUE N'EST PAS UNE SITUATION SAINE.

     « Aucune date encore renseignée » s'écrivait en gris, et le compteur du
     haut annonçait « Aucune échéance proche » : quatre-vingt-sept véhicules
     sans contrôle technique connu passaient pour en règle. Relevé le
     26 septembre 2026. Ce qui manque s'affiche donc en rouge, et il est
     compté à part. */
  function pastilles(L) {
    if (!L.length) return '<span class="p vide">À compléter : aucune date renseignée</span>';
    return L.map(function (e) {
      var texte;
      if (e.km) {
        texte = e.reste < 0 ? "<b>Révision</b> dépassée de " + (-e.reste) + " km"
          : "<b>Révision</b> dans " + e.reste + " km";
      } else if (e.points) {
        texte = "<b>Points</b> " + e.valeur;
      } else {
        texte = "<b>" + ech(e.quoi) + "</b> " + ech(enFrancais(e.date)) + ", " + ech(dit(e.jours));
      }
      return '<span class="p ' + e.etat + '">' + texte + "</span>";
    }).join("");
  }

  function pire(L) {
    if (L.some(function (e) { return e.etat === "passe"; })) return "passe";
    if (L.some(function (e) { return e.etat === "rouge"; })) return "rouge";
    if (L.some(function (e) { return e.etat === "ambre"; })) return "ambre";
    return L.length ? "vert" : "";
  }

  /* ──────────────────────────────── les formes ──────────────────────────── */

  /* Une liste de paramètres du parc, lue là où elle est gardée. Les fiches des
     véhicules s'en servent pour le financement, et plus tard pour d'autres
     champs ; si elle n'existe pas encore, la liste est simplement vide. */
  function parcListe(key) {
    try {
      if (window.ParcParametres && window.ParcParametres.lire) {
        var e = window.ParcParametres.lire(); return (e && e[key]) || [];
      }
      var j = JSON.parse(window.localStorage.getItem("parc-parametres") || "null");
      return (j && j[key]) || [];
    } catch (e) { return []; }
  }
  function optsDe(ch) {
    if (ch.opts) return ch.opts;
    var L = ch.carbs ? CARBURANTS : (ch.parc ? parcListe(ch.parc) : (ch.vals || []));
    return [["", "- à préciser -"]].concat((L || []).map(function (s) { return [String(s), String(s)]; }));
  }

  function champHtml(ch, valeur, prefixe) {
    var id = prefixe + "-" + ch.c;
    var h = '<label' + (ch.large ? ' class="large"' : "") + '><span>' + ech(ch.lib) + "</span>";
    if (ch.t === "select") {
      h += '<select id="' + id + '" data-ch="' + ch.c + '">' + optsDe(ch).map(function (o) {
        return '<option value="' + ech(o[0]) + '"' + (o[0] === net(valeur) ? " selected" : "") +
          ">" + ech(o[1]) + "</option>";
      }).join("") + "</select>";
    } else if (ch.t === "vehicule") {
      var L = vehicules();
      h += '<select id="' + id + '" data-ch="' + ch.c + '"><option value="">- aucun -</option>' +
        L.map(function (v) {
          return '<option value="' + ech(v.id) + '"' + (v.id === net(valeur) ? " selected" : "") +
            ">" + ech(v.immat || "sans immatriculation") + "</option>";
        }).join("") + "</select>";
    } else if (ch.t === "salarie") {
      /* Le nom ne se retape pas : il vient du registre du personnel, comme
         partout ailleurs dans l'application. */
      var G = salaries(true);
      h += '<select id="' + id + '" data-ch="' + ch.c + '"><option value="">- aucun -</option>' +
        G.map(function (s) {
          return '<option value="' + ech(s.id) + '"' + (s.id === net(valeur) ? " selected" : "") +
            ">" + ech(s.nom) + "</option>";
        }).join("") + "</select>";
      if (!G.length) h += '<small class="aide">Le registre du personnel ne porte encore aucun salarié.</small>';
    } else if (ch.t === "textarea") {
      h += '<textarea id="' + id + '" data-ch="' + ch.c + '">' + ech(valeur) + "</textarea>";
    } else {
      var type = ch.t === "date" ? "date" : "text";
      h += '<input type="' + type + '" id="' + id + '" data-ch="' + ch.c + '" value="' + ech(valeur) + '"' +
        (ch.t === "num" ? ' inputmode="numeric"' : "") +
        (ch.t === "dec" ? ' inputmode="decimal"' : "") +
        (ch.maj ? ' style="text-transform:uppercase"' : "") + ">";
    }
    return h + "</label>";
  }

  function brancher(cadre, prefixe, lit, ecrit, apres) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-ch]"), function (el) {
      var quand = (el.tagName === "SELECT" || el.type === "date") ? "change" : "input";
      el.addEventListener(quand, function () {
        var o = lit(), c = el.getAttribute("data-ch");
        var v = el.value;
        if (c === "immat") v = v.toUpperCase();
        var avant = o[c];
        o[c] = v;
        ecrit(o);
        if (apres) apres(c, v, avant, o);
        rendre();
      });
    });
  }

  /* LE CHAUFFEUR ATTITRÉ ET SON VÉHICULE, LES DEUX FACES DU MÊME LIEN.

     Le véhicule porte son chauffeur, le conducteur porte son véhicule : si
     les deux se saisissent séparément, ils finissent par se contredire. Ce
     qui est écrit d'un côté s'écrit de l'autre, et le conducteur qui perd
     son véhicule le perd des deux côtés. */
  function lierVehiculeConducteur(idVehicule, idSalarie, idSalarieAvant) {
    if (idSalarieAvant && idSalarieAvant !== idSalarie) {
      var a = fiche(idSalarieAvant);
      if (a.vehicule === idVehicule) { a.vehicule = ""; garderFiche(idSalarieAvant, a); }
    }
    if (!idSalarie) return;
    var f = fiche(idSalarie);
    if (f.vehicule !== idVehicule) { f.vehicule = idVehicule; garderFiche(idSalarie, f); }
  }

  function lierConducteurVehicule(idSalarie, idVehicule, idVehiculeAvant) {
    var L = vehicules(), change = false;
    L.forEach(function (v) {
      if (v.id === idVehiculeAvant && v.conducteur === idSalarie) { v.conducteur = ""; change = true; }
      if (idVehicule && v.id === idVehicule && v.conducteur !== idSalarie) { v.conducteur = idSalarie; change = true; }
    });
    if (change) garderVehicules(L);
  }

  /* ─────────────────────────────── les écrans ───────────────────────────── */

  var ouvert = {};           /* les fiches dépliées, par identifiant         */
  var vtabActif = {};        /* l'onglet actif d'une fiche ouverte           */

  /* RECHERCHE, FILTRES, TRI. Demande du 10 novembre 2026, pour quatre-vingt-sept
     véhicules. */
  var fRecherche = "", fGenre = "", fEtat = "", fTri = "immat";

  /* LA FICHE D'UN CAMION EN ONGLETS, pour qu'elle soit simple et non une page
     interminable. Demande du 10 novembre 2026 : « une application simple et
     ergonomique ». Les dates d'échéance vont dans l'onglet Échéances, le reste
     dans Infos ; l'entretien et les pièces ont chacun le leur. */
  var GR_ECH = { ct: 1, ctMois: 1, lim: 1, limMois: 1, chrono: 1, chronoMois: 1,
    telecUnite: 1, telecUniteJours: 1, assur: 1, assurContrat: 1, licence: 1, licenceFin: 1,
    revision: 1, revisionKm: 1, extincteur: 1 };
  var VTABS = [["infos", "Infos"], ["ech", "Échéances"], ["entretien", "Entretien"], ["pieces", "Documents"]];

  var tabParDefaut = "";   /* l'onglet sur lequel ouvrir une fiche, venu de la recherche */
  function corpsVehicule(v) {
    var tab = vtabActif[v.id] || tabParDefaut || "infos";
    function champsDe(groupe) {
      return '<div class="gr">' + CHAMPS_V.filter(function (ch) {
        return (GR_ECH[ch.c] ? "ech" : "infos") === groupe;
      }).map(function (ch) {
        var val = v[ch.c];
        if (val == null || val === "") {
          if (ch.c === "ctMois") val = CT_DEFAUT[v.genre] || 12;
          if (ch.c === "limMois") val = 24;
          if (ch.c === "chronoMois") val = 24;
        }
        return champHtml(ch, val, "v" + v.id);
      }).join("") + "</div>";
    }
    var onglets = '<div class="vtabs" role="tablist">' + VTABS.map(function (t) {
      return '<button type="button" data-vtab="' + ech(v.id) + "|" + t[0] + '"' +
        (t[0] === tab ? ' aria-selected="true"' : "") + ">" + ech(t[1]) + "</button>";
    }).join("") + "</div>";
    var pan = "";
    if (tab === "infos") pan = champsDe("infos");
    else if (tab === "ech") pan = champsDe("ech");
    else if (tab === "entretien") pan = interventionsHtml(v);
    else pan = piecesHtml(v) + '<div class="actions"><button type="button" class="second" data-sup="' +
      ech(v.id) + '">Retirer ce véhicule</button></div>';
    return '<div class="corps">' + photoHtml(v) + onglets + '<div class="vpan">' + pan + "</div></div>";
  }

  function prochaineEch(v) {
    var J = echeancesVehicule(v).map(function (e) { return e.jours; })
      .filter(function (j) { return j != null; });
    return J.length ? Math.min.apply(null, J) : 1e9;
  }
  function filtrer(L) {
    var q = net(fRecherche).toLowerCase();
    var nomDe = {}; salaries(true).forEach(function (s) { nomDe[s.id] = s.nom; });
    var out = L.filter(function (v) {
      if (fGenre && (v.genre || "autre") !== fGenre) return false;
      if (fEtat) {
        var m = manque(v).length, p = pire(echeancesVehicule(v));
        if (fEtat === "complet" && m) return false;
        if (fEtat === "incomplet" && !m) return false;
        if (fEtat === "proche" && !(p === "rouge" || p === "ambre")) return false;
        if (fEtat === "depasse" && p !== "passe") return false;
        if (fEtat === "sanskm" && net(v.km)) return false;
        if (fEtat === "libre" && (v.genre === "remorque" || net(v.conducteur))) return false;
        if (fEtat === "affecte" && !net(v.conducteur)) return false;
      }
      if (q) {
        /* L'IMMATRICULATION SE CHERCHE PAR SON DÉBUT. « B » doit rendre les
           plaques qui commencent par B, pas celles qui contiennent un B au
           milieu. On compare la plaque sans tirets ni espaces. La marque et le
           nom du conducteur, eux, se cherchent n'importe où dans le mot.
           Demande du 11 novembre 2026. */
        var qn = q.replace(/[^a-z0-9]/g, "");
        var immat = net(v.immat).toLowerCase().replace(/[^a-z0-9]/g, "");
        var marque = net(v.marque).toLowerCase();
        var cond = net(nomDe[v.conducteur] || "").toLowerCase();
        /* Une seule lettre : le début de la plaque, et rien d'autre, pour ne pas
           ramener une marque qui contient cette lettre. Dès deux caractères, on
           cherche aussi le milieu de la plaque, la marque et le conducteur. */
        var ok = qn && immat.indexOf(qn) === 0;
        if (!ok && q.length >= 2) {
          ok = (qn && immat.indexOf(qn) >= 0) ||
            (marque && marque.indexOf(q) >= 0) ||
            (cond && cond.indexOf(q) >= 0);
        }
        if (!ok) return false;
      }
      return true;
    });
    if (fTri === "immat") out.sort(function (a, b) { return net(a.immat).localeCompare(net(b.immat)); });
    else if (fTri === "km") out.sort(function (a, b) { return (parseInt(b.km, 10) || 0) - (parseInt(a.km, 10) || 0); });
    else if (fTri === "echeance") out.sort(function (a, b) { return prochaineEch(a) - prochaineEch(b); });
    return out;
  }
  function majCount(montres, total) {
    var c = $("f-count"); if (!c) return;
    c.textContent = (montres === total)
      ? total + " véhicule" + (total > 1 ? "s" : "")
      : montres + " sur " + total + " véhicule" + (total > 1 ? "s" : "");
  }

  function rendreVehicules() {
    var tous = vehicules(), hote = $("vehicules");
    var fb = $("fbar"); if (fb) fb.hidden = tous.length < 2;
    if (!tous.length) {
      hote.innerHTML = '<p class="rien">Aucun véhicule. Le bouton ci-dessous en ajoute un, ' +
        "ou reprenez l'état de parc du client : il suffit de l'immatriculation pour commencer.</p>";
      majCount(0, 0);
      return;
    }
    var L = filtrer(tous);
    majCount(L.length, tous.length);
    if (!L.length) {
      hote.innerHTML = '<p class="rien">Aucun véhicule ne correspond. Changez la recherche ou les filtres.</p>';
      return;
    }
    var rappel = tabParDefaut === "entretien"
      ? '<p class="rappel-faire">Choisissez le camion concerné : sa fiche s\'ouvre sur l\'onglet Entretien, prête pour une intervention.</p>'
      : "";
    hote.innerHTML = rappel + L.map(function (v) {
      var E = echeancesVehicule(v), p = pire(E);
      var genre = "";
      GENRES.forEach(function (g) { if (g[0] === v.genre) genre = g[1]; });
      var cum = cumulVehicule(v);
      var sous = [genre, v.marque, v.km ? v.km + " km" : "", cum ? "entretien " + euros(cum) : ""]
        .filter(Boolean).join(" · ");
      var est = !!ouvert["v" + v.id];
      return '<div class="carte-v' + (p === "passe" ? " urgent" : "") + (est ? " ouverte" : "") +
        '" data-v="' + ech(v.id) + '">' +
        '<div class="tt" data-plier="v' + ech(v.id) + '">' +
        '<span class="ico' + (v.photo && v.photo.vignette ? " aphoto" : "") + '">' +
        (v.photo && v.photo.vignette ? '<img src="' + ech(v.photo.vignette) + '" alt="">' : ICONE_VEH) + "</span>" +
        '<span class="nom">' + ech(v.immat || "Immatriculation à saisir") +
        '<span class="sous">' + ech(sous || "à compléter") + "</span></span>" +
        '<span class="fl">' + (est ? "&#8963;" : "&#8964;") + "</span></div>" +
        '<div class="ech">' + pastilles(E) + "</div>" +
        (est ? corpsVehicule(v) : "") +
        "</div>";
    }).join("");

    L.forEach(function (v) {
      var cadre = hote.querySelector('[data-v="' + v.id + '"]');
      if (!cadre || !ouvert["v" + v.id]) return;
      brancher(cadre, "v" + v.id,
        function () {
          var T = vehicules(), o = null;
          T.forEach(function (x) { if (x.id === v.id) o = x; });
          return o || v;
        },
        function (o) {
          var T = vehicules();
          garderVehicules(T.map(function (x) { return x.id === o.id ? o : x; }));
        },
        function (c, val, avant) {
          if (c === "conducteur") lierVehiculeConducteur(v.id, val, avant);
        });
      brancherPieces(cadre, v.id);
      brancherPhoto(cadre, v.id);
      brancherInterventions(cadre, v.id);
    });
  }

  /* ─────────────────────────── les pièces du véhicule ───────────────────── */

  function piecesHtml(v) {
    var p = v.pieces || {};
    return '<div class="pieces"><p class="pt">Documents du véhicule</p>' +
      PIECES.map(function (x) {
        var d = p[x.c];
        return '<div class="piece"><span class="pl">' + ech(x.lib) + "</span>" +
          (d ? '<span class="pok">' + ech(d.nom) + ", déposée le " + ech(enFrancais(d.le)) + "</span>" +
            '<button type="button" class="lien" data-piece-sup="' + ech(v.id) + "|" + x.c + '">Retirer</button>'
            : '<span class="pnon">à déposer</span>') +
          '<input type="file" data-sans-base="1" data-piece="' + ech(v.id) + "|" + x.c + '" ' +
          'accept="image/*,.pdf,.jpg,.jpeg,.png,.heic" aria-label="' + ech(x.lib) + '"></div>';
      }).join("") +
      '<p class="doux">Les documents déposés se retrouvent dans <a href="mes-documents.html">Mes documents</a>, ' +
      "rubrique Flotte.</p></div>";
  }

  /* LA PHOTO DU VÉHICULE. Le fichier plein va dans « Mes documents », comme
     les pièces ; une petite vignette compressée reste sur la fiche et sert
     d'image à la carte, sans alourdir le stockage. Demande du 11 novembre
     2026 : « on peut ajouter la photo du camion à insérer ». */
  function vignette(file, cb) {
    try {
      var r = new FileReader();
      r.onload = function () {
        var img = new Image();
        img.onload = function () {
          var max = 420, w = img.width || 1, h = img.height || 1;
          var sc = Math.min(1, max / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * sc)), ch = Math.max(1, Math.round(h * sc));
          try {
            var cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
            cv.getContext("2d").drawImage(img, 0, 0, cw, ch);
            cb(cv.toDataURL("image/jpeg", 0.72));
          } catch (e) { cb(""); }
        };
        img.onerror = function () { cb(""); };
        img.src = r.result;
      };
      r.onerror = function () { cb(""); };
      r.readAsDataURL(file);
    } catch (e) { cb(""); }
  }

  function photoHtml(v) {
    var ph = v.photo;
    return '<div class="vphoto">' +
      (ph && ph.vignette
        ? '<img class="vph-img" src="' + ech(ph.vignette) + '" alt="Photo du véhicule">'
        : '<div class="vph-vide">' + ICONE_VEH + "</div>") +
      '<div class="vph-act">' +
      '<span class="vph-t">' + (ph ? "Photo ajoutée le " + ech(enFrancais(ph.le)) : "Photo du véhicule") + "</span>" +
      '<div class="vph-boutons">' +
      '<input type="file" data-sans-base="1" data-sans-nom="1" data-photo="' + ech(v.id) + '" ' +
      'accept="image/*" capture="environment" data-libelle="Prendre une photo" ' +
      'aria-label="Prendre une photo du véhicule">' +
      '<input type="file" data-sans-base="1" data-sans-nom="1" data-photo="' + ech(v.id) + '" ' +
      'accept="image/*,.jpg,.jpeg,.png,.heic" data-libelle="Choisir dans la galerie" ' +
      'aria-label="Choisir une photo du véhicule dans la galerie">' +
      "</div>" +
      (ph ? '<button type="button" class="lien" data-photo-sup="' + ech(v.id) + '">Retirer la photo</button>' : "") +
      "</div></div>";
  }

  function brancherPhoto(cadre, idV) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-photo]"), function (el) {
      el.addEventListener("change", function () {
        var f = el.files && el.files[0];
        if (!f) return;
        var v = null; vehicules().forEach(function (x) { if (x.id === idV) v = x; });
        vignette(f, function (vig) {
          function poser(idDoc) {
            var T = vehicules();
            T.forEach(function (x) {
              if (x.id === idV) x.photo = { nom: f.name, le: iso(new Date()), doc: idDoc || 0, vignette: vig || "" };
            });
            garderVehicules(T);
            rendre();
          }
          if (window.Documents && window.Documents.disponible()) {
            window.Documents.enregistrer("flotte", { nom: f.name, sorte: "depose", type: f.type || "",
              contenu: f, note: "Photo du véhicule - " + ((v && v.immat) || "véhicule sans immatriculation") })
              .then(function (l) { poser(l.id); }, function () { poser(0); });
          } else poser(0);
        });
      });
    });
  }

  function brancherPieces(cadre, idV) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-piece]"), function (el) {
      el.addEventListener("change", function () {
        var f = el.files && el.files[0];
        if (!f) return;
        var cle = el.getAttribute("data-piece").split("|")[1];
        var lib = ""; PIECES.forEach(function (x) { if (x.c === cle) lib = x.lib; });
        var L = vehicules(), v = null;
        L.forEach(function (x) { if (x.id === idV) v = x; });
        if (!v) return;
        function poser(idDoc) {
          var T = vehicules();
          T.forEach(function (x) {
            if (x.id !== idV) return;
            x.pieces = x.pieces || {};
            x.pieces[cle] = { nom: f.name, le: iso(new Date()), doc: idDoc || 0 };
          });
          garderVehicules(T);
          rendre();
        }
        if (window.Documents && window.Documents.disponible()) {
          window.Documents.enregistrer("flotte", { nom: f.name, sorte: "depose", type: f.type || "",
            contenu: f, note: lib + " - " + (v.immat || "véhicule sans immatriculation") })
            .then(function (l) { poser(l.id); }, function () { poser(0); });
        } else poser(0);
      });
    });
  }

  /* ────────────────── L'ENTRETIEN ET LES COÛTS DU VÉHICULE ───────────────── */

  /* « 1 h 30 » plutôt que « 1,5 » : le temps passé se dit en heures et demies. */
  function labelH(x) {
    if (x === 0) return "0";
    var ent = Math.floor(x), demi = (x - ent) >= 0.5;
    if (ent === 0) return "30 min";
    return ent + " h" + (demi ? " 30" : "");
  }

  function champIHtml(ch, valeur, pref) {
    var id = pref + "-" + ch.c, v = net(valeur);
    var h = '<label' + (ch.large ? ' class="large"' : "") + '><span>' + ech(ch.lib) + "</span>";
    if (ch.t === "heures") {
      /* Le nombre d'heures : une liste par demi-heures, de 30 min à 12 h, et
         « Autres » pour une durée hors palier. Demande du 11 novembre 2026. */
      var pas = []; for (var hh = 0; hh <= 12.00001; hh += 0.5) pas.push(Math.round(hh * 2) / 2);
      var vn = v === "" ? null : fnum(v);
      var dansH = vn != null && pas.indexOf(vn) >= 0, autreH = vn != null && !dansH;
      h += '<select data-chi-sel="' + ch.c + '" id="' + id + '-sel">' +
        '<option value="">- à préciser -</option>' +
        pas.map(function (s) {
          return '<option value="' + s + '"' + (dansH && s === vn ? " selected" : "") + ">" + ech(labelH(s)) + "</option>";
        }).join("") +
        '<option value="__autre"' + (autreH ? " selected" : "") + ">Autres</option></select>" +
        '<input type="text" inputmode="decimal" data-chi-txt="' + ch.c + '" id="' + id + '" ' +
        'placeholder="Nombre d\'heures" value="' + ech(autreH ? v : "") + '"' + (autreH ? "" : " hidden") +
        ' style="margin-top:8px">';
    } else if (ch.t === "liste") {
      /* Une liste déroulante tirée des paramètres du parc, plus « Autres » qui
         ouvre un champ libre. Demande du 10 novembre 2026. */
      var opts = (ch.avant || []).concat(parcListe(ch.parc) || []);
      var dans = v && opts.indexOf(v) >= 0, autre = v && !dans;
      h += '<select data-chi-sel="' + ch.c + '" id="' + id + '-sel">' +
        '<option value="">- à préciser -</option>' +
        opts.map(function (o) { return '<option value="' + ech(o) + '"' + (o === v ? " selected" : "") + ">" + ech(o) + "</option>"; }).join("") +
        '<option value="__autre"' + (autre ? " selected" : "") + ">Autres</option></select>" +
        '<input type="text" data-chi-txt="' + ch.c + '" id="' + id + '" placeholder="Préciser" value="' +
        ech(autre ? v : "") + '"' + (autre ? "" : " hidden") + ' style="margin-top:8px">';
    } else if (ch.t === "textarea") {
      h += '<textarea id="' + id + '" data-chi="' + ch.c + '">' + ech(valeur) + "</textarea>";
    } else {
      var type = ch.t === "date" ? "date" : "text";
      h += '<input type="' + type + '" id="' + id + '" data-chi="' + ch.c + '" value="' + ech(valeur) + '"' +
        (ch.t === "num" ? ' inputmode="numeric"' : "") +
        (ch.t === "dec" ? ' inputmode="decimal"' : "") + ">";
    }
    return h + "</label>";
  }

  function detailCout(c) {
    var p = [];
    if (c.h) p.push("main d'oeuvre " + euros(c.mo) + " (" + String(c.h).replace(".", ",") + " h)");
    if (c.pieces) p.push("pièces " + euros(c.pieces));
    if (c.sous) p.push("sous-traitance " + euros(c.sous));
    return p.length ? " (" + p.join(", ") + ")" : "";
  }

  function interventionsHtml(v) {
    var L = v.interventions || [];
    var rows = L.map(function (it, idx) {
      var c = coutInter(it);
      var pref = "i-" + v.id + "-" + idx;
      return '<div class="it-carte" data-itc="' + ech(v.id) + "|" + idx + '">' +
        '<div class="gr">' + CHAMPS_I.map(function (ch) { return champIHtml(ch, it[ch.c], pref); }).join("") + "</div>" +
        '<div class="it-total">Coût de l\'intervention : <b>' + euros(c.total) + "</b>" + ech(detailCout(c)) + "</div>" +
        '<div class="actions"><button type="button" class="lien" data-it-sup="' + ech(v.id) + "|" + idx + '">Retirer cette intervention</button></div>' +
        "</div>";
    }).join("");
    var cum = cumulVehicule(v);
    return '<div class="inter"><p class="pt">Entretien et interventions</p>' +
      (L.length ? rows : '<p class="pnon2">Aucune intervention enregistrée pour ce véhicule.</p>') +
      '<div class="barre2"><button type="button" class="second" data-it-add="' + ech(v.id) + '">+ Ajouter une intervention</button></div>' +
      (L.length ? '<div class="it-cumul">Total dépensé sur ce véhicule : <b>' + euros(cum) + "</b>, sur " +
        L.length + " intervention" + (L.length > 1 ? "s" : "") + "</div>" : "") +
      '<p class="doux">La main d\'oeuvre interne est comptée en heures passées par vos équipes, ' +
      "multipliées par le taux horaire que vous indiquez. Le taux de la dernière intervention est repris par défaut.</p></div>";
  }

  function majCout(cadre, idV) {
    var L = vehicules(), v = null;
    L.forEach(function (x) { if (x.id === idV) v = x; });
    if (!v) return;
    Array.prototype.forEach.call(cadre.querySelectorAll(".it-carte"), function (el) {
      var idx = parseInt(el.getAttribute("data-itc").split("|")[1], 10);
      var it = (v.interventions || [])[idx];
      if (!it) return;
      var c = coutInter(it);
      var t = el.querySelector(".it-total");
      if (t) t.innerHTML = "Coût de l'intervention : <b>" + euros(c.total) + "</b>" + ech(detailCout(c));
    });
    var cu = cadre.querySelector(".it-cumul");
    if (cu) cu.innerHTML = "Total dépensé sur ce véhicule : <b>" + euros(cumulVehicule(v)) + "</b>, sur " +
      (v.interventions || []).length + " intervention" + ((v.interventions || []).length > 1 ? "s" : "");
    var sousTitre = cadre.querySelector(".tt .sous");
    if (sousTitre) {
      var genre = "";
      GENRES.forEach(function (g) { if (g[0] === v.genre) genre = g[1]; });
      var cum = cumulVehicule(v);
      sousTitre.textContent = [genre, v.marque, v.km ? v.km + " km" : "", cum ? "entretien " + euros(cum) : ""]
        .filter(Boolean).join(" · ") || "à compléter";
    }
  }

  /* Les champs d'intervention ne redessinent pas toute la liste à chaque
     frappe : on garde le curseur, et seuls le total et le cumul se recalculent
     en direct. */
  function brancherInterventions(cadre, idV) {
    function setVal(idx, key, value) {
      var T = vehicules();
      T.forEach(function (x) {
        if (x.id !== idV) return;
        x.interventions = x.interventions || [];
        if (!x.interventions[idx]) return;
        x.interventions[idx][key] = value;
        if (key === "taux" && net(value)) garder(CLE_TAUX, value);
      });
      garderVehicules(T);
    }
    Array.prototype.forEach.call(cadre.querySelectorAll(".it-carte"), function (carte) {
      var idx = parseInt(carte.getAttribute("data-itc").split("|")[1], 10);
      /* Les champs simples : date, kilométrage, heures, montants. */
      Array.prototype.forEach.call(carte.querySelectorAll("[data-chi]"), function (el) {
        var quand = (el.type === "date") ? "change" : "input";
        el.addEventListener(quand, function () { setVal(idx, el.getAttribute("data-chi"), el.value); majCout(cadre, idV); });
      });
      /* Les listes déroulantes, et leur « Autres » qui ouvre le champ libre. */
      Array.prototype.forEach.call(carte.querySelectorAll("[data-chi-sel]"), function (sel) {
        var key = sel.getAttribute("data-chi-sel");
        var txt = carte.querySelector('[data-chi-txt="' + key + '"]');
        sel.addEventListener("change", function () {
          if (sel.value === "__autre") { if (txt) { txt.hidden = false; txt.focus(); } setVal(idx, key, txt ? net(txt.value) : ""); }
          else { if (txt) { txt.hidden = true; txt.value = ""; } setVal(idx, key, sel.value); }
          majCout(cadre, idV);
        });
      });
      Array.prototype.forEach.call(carte.querySelectorAll("[data-chi-txt]"), function (txt) {
        txt.addEventListener("input", function () { setVal(idx, txt.getAttribute("data-chi-txt"), txt.value); majCout(cadre, idV); });
      });
    });
  }

  /* LES CONDUCTEURS D'ABORD, ET SANS LES SORTIS. Mesuré le 26 septembre
     2026 : la liste mêlait aux conducteurs le mécanicien, le responsable
     d'atelier et l'assistante de direction, et gardait les salariés sortis.
     Les sortis ne sont plus suivis ; les conducteurs viennent en tête, les
     autres salariés suivent, pour leurs seules visites médicales. */
  var CONDUIT = /chauffeur|conducteur|livreur|convoyeur|routier/i;
  function rendreConducteurs() {
    var G = salaries().filter(function (s) { return !s.sor; });
    G = G.filter(function (s) { return CONDUIT.test(s.emp); })
      .concat(G.filter(function (s) { return !CONDUIT.test(s.emp); }));
    var hote = $("conducteurs");
    $("con-vide").hidden = !!G.length;
    if (!G.length) { hote.innerHTML = ""; return; }
    hote.innerHTML = G.map(function (s) {
      var f = fiche(s.id), E = echeancesConducteur(f), p = pire(E);
      var est = !!ouvert["c" + s.id];
      var sous = [s.emp, f.permisCat ? "permis " + f.permisCat : "",
        CONDUIT.test(s.emp) ? "" : "sédentaire : visites médicales"].filter(Boolean).join(" · ");
      return '<div class="carte-v' + (p === "passe" ? " urgent" : "") + '" data-c="' + ech(s.id) + '">' +
        '<div class="tt" data-plier="c' + ech(s.id) + '">' +
        '<span class="nom">' + ech(s.nom) +
        '<span class="sous">' + ech(sous || "à compléter") + "</span></span>" +
        '<span class="fl">' + (est ? "&#8963;" : "&#8964;") + "</span></div>" +
        '<div class="ech">' + pastilles(E) + "</div>" +
        (est ? '<div class="corps"><div class="gr">' +
          CHAMPS_C.map(function (ch) {
            var val = f[ch.c];
            if ((val == null || val === "") && ch.c === "fcoMois") val = 60;
            return champHtml(ch, val, "c" + s.id);
          }).join("") + "</div></div>" : "") +
        "</div>";
    }).join("");

    G.forEach(function (s) {
      var cadre = hote.querySelector('[data-c="' + s.id + '"]');
      if (!cadre || !ouvert["c" + s.id]) return;
      brancher(cadre, "c" + s.id,
        function () { return fiche(s.id); },
        function (o) { garderFiche(s.id, o); },
        function (c, val, avant) {
          if (c === "vehicule") lierConducteurVehicule(s.id, val, avant);
        });
    });
  }

  /* ─────────────────── CE QUI MANQUE, VÉHICULE PAR VÉHICULE ───────────────

     Un état de parc repris chez le client donne quatre colonnes : une
     immatriculation, une marque, un genre, une mention de financement. Tout
     le reste manque, et personne ne va ouvrir quatre-vingt-dix fiches pour
     voir laquelle est incomplète. L'écran le dit lui-même, et chaque manque
     ouvre la fiche à l'endroit voulu.
     Demande du 16 septembre 2026 : « une fois le parc importé il faudrait que
     l'application rajoute toutes informations qui lui sont indispensables,
     contrôle technique, carte grise (à importer si besoin est), prochain
     contrôle, chauffeur attitré, etc. » */
  function manque(v) {
    var M = [], p = v.pieces || {};
    var roule = v.genre !== "remorque";
    var lourd = v.genre === "pl" || v.genre === "tracteur" ||
      v.genre === "commun" || v.genre === "public10";
    if (!net(v.immat)) M.push("immatriculation");
    if (!net(v.genre) || v.genre === "autre") M.push("genre du véhicule");
    if (!net(v.ct)) M.push("date du dernier contrôle technique");
    if (!p.grise) M.push("carte grise");
    if (roule && !net(v.assur)) M.push("échéance de l'assurance");
    if (roule && !net(v.conducteur)) M.push("chauffeur attitré");
    if (lourd && !net(v.chrono)) M.push("contrôle du chronotachygraphe");
    if (lourd && !net(v.lim)) M.push("contrôle du limiteur");
    if (lourd && !net(v.licenceFin)) M.push("copie conforme de licence");
    if (!net(v.km)) M.push("kilométrage");
    return M;
  }

  /* LA JAUGE D'AVANCEMENT. Sur quatre-vingt-sept véhicules, le chef de parc a
     besoin de voir d'un coup où il en est : combien sont complets, combien
     restent, et de pouvoir attaquer les suivants sans les chercher. */
  function rendreJauge() {
    var hote = $("jauge");
    if (!hote) return;
    var tous = vehicules();
    if (!tous.length) { hote.innerHTML = ""; return; }
    var reste = tous.filter(function (v) { return manque(v).length; }).length;
    var complets = tous.length - reste;
    var pct = Math.round(complets / tous.length * 100);
    var cls = pct >= 100 ? "pleine" : (pct < 50 ? "basse" : "");
    hote.innerHTML = '<div class="jauge-c">' +
      '<div class="jr"><span class="jt"><b>' + complets + "</b> sur " + tous.length +
      " véhicule" + (tous.length > 1 ? "s" : "") + " complet" + (complets > 1 ? "s" : "") + "</span>" +
      '<span class="jp">' + pct + " %</span></div>" +
      '<div class="jb"><i class="' + cls + '" style="width:' + pct + '%"></i></div>' +
      (reste
        ? '<button type="button" class="jcompleter" data-completer="1">Compléter les ' + reste +
          " véhicule" + (reste > 1 ? "s" : "") + " restant" + (reste > 1 ? "s" : "") + "</button>"
        : "") + "</div>";
  }

  function rendreACompleter() {
    var hote = $("acompleter");
    if (!hote) return;
    var L = vehicules().map(function (v) { return { v: v, m: manque(v) }; })
      .filter(function (x) { return x.m.length; });
    if (!L.length) {
      hote.innerHTML = vehicules().length
        ? '<p class="complet">Chaque véhicule porte ce qu\'il faut : contrôle technique, carte grise, ' +
          "assurance, chauffeur attitré.</p>" : "";
      return;
    }
    /* Le plus incomplet d'abord : c'est par lui qu'on commence. */
    L.sort(function (a, b) { return b.m.length - a.m.length; });
    var visibles = L.slice(0, 12);
    hote.innerHTML =
      '<details class="repli" id="manques"' + (ouvert.manques ? " open" : "") + '>' +
      "<summary>À compléter : " + L.length + " véhicule" + (L.length > 1 ? "s" : "") + "</summary>" +
      '<div class="corps"><p class="doux">Ce que l\'application attend de chaque véhicule pour ' +
      "suivre ses échéances. Touchez une ligne : la fiche s'ouvre dessous.</p>" +
      visibles.map(function (x) {
        return '<button type="button" class="manque" data-ouvrir="' + ech(x.v.id) + '">' +
          "<b>" + ech(x.v.immat || "Immatriculation à saisir") + "</b>" +
          '<span class="mq">' + x.m.map(function (t) {
            return '<span class="pu">' + ech(t) + "</span>";
          }).join("") + "</span></button>";
      }).join("") +
      (L.length > visibles.length
        ? '<p class="doux">et ' + (L.length - visibles.length) + " autre" +
          (L.length - visibles.length > 1 ? "s" : "") + ", qui viendront quand ceux-ci seront faits.</p>"
        : "") +
      "</div></details>";
    var d = $("manques");
    if (d) d.addEventListener("toggle", function () { ouvert.manques = d.open; });
  }

  /* UN COMPTEUR PAR ONGLET.

     Relevé le 27 septembre 2026 : le compteur additionnait les échéances des
     véhicules et celles des conducteurs, et affichait « 87 véhicules » sur
     l'onglet des conducteurs. Chaque onglet compte maintenant ce qu'il
     montre, et rien d'autre. */
  var SUR_VEHICULES = true;
  function rendreCompte() {
    var veh = SUR_VEHICULES;
    var n = { passe: 0, rouge: 0, ambre: 0 };
    if (veh) {
      vehicules().forEach(function (v) {
        echeancesVehicule(v).forEach(function (e) { if (n[e.etat] !== undefined) n[e.etat]++; });
      });
    } else {
      salaries().forEach(function (s) {
        echeancesConducteur(fiche(s.id)).forEach(function (e) { if (n[e.etat] !== undefined) n[e.etat]++; });
      });
    }
    var h = "";
    if (n.passe) h += '<span class="c rouge">' + n.passe + " dépassée" + (n.passe > 1 ? "s" : "") + "</span>";
    if (n.rouge) h += '<span class="c rouge">' + n.rouge + " dans les 30 jours</span>";
    if (n.ambre) h += '<span class="c ambre">' + n.ambre + " dans les 60 jours</span>";
    /* « Aucune échéance proche » ne se dit que de ce qui a une date.
       Mesuré le 26 septembre 2026 : quatre-vingt-sept véhicules sans aucune
       date affichaient cette pastille verte, qui rassurait à tort. */
    var sansVeh = vehicules().filter(function (v) { return !echeancesVehicule(v).length; }).length;
    var sansCond = salaries().filter(function (x) {
      return !x.sor && CONDUIT.test(x.emp) && !echeancesConducteur(fiche(x.id)).length; }).length;
    if (veh && sansVeh) h += '<span class="c rouge">' + sansVeh + " véhicule" + (sansVeh > 1 ? "s" : "") + " sans date</span>";
    if (!veh && sansCond) h += '<span class="c rouge">' + sansCond + " conducteur" + (sansCond > 1 ? "s" : "") + " sans date</span>";
    if (!h) h = '<span class="c vert">Aucune échéance proche</span>';
    if (veh) {
      var nv = vehicules().length;
      h += '<span class="c">' + nv + " véhicule" + (nv > 1 ? "s" : "") + "</span>";
    } else {
      var nc = salaries().filter(function (x) { return !x.sor && CONDUIT.test(x.emp); }).length;
      h += '<span class="c">' + nc + " conducteur" + (nc > 1 ? "s" : "") + "</span>";
    }
    $("compte").innerHTML = h;
  }

  function rendre() {
    rendreCompte();
    rendreJauge();
    rendreACompleter();
    rendreVehicules();
    rendreConducteurs();
    /* Le repli qui porte « Vider la flotte » ne s'affiche que s'il y a
       quelque chose à vider. */
    var b = $("repli-vider");
    if (b) b.hidden = !vehicules().length;
    var a = $("v-annuler"), der = lire(CLE_IMP, null);
    if (a) {
      var reste = der ? der.ids.filter(function (i) {
        return vehicules().some(function (v) { return v.id === i; });
      }).length : 0;
      a.hidden = !reste;
      if (reste) a.textContent = "Annuler la dernière importation (" + reste + ")";
    }
  }

  /* ─────────────── REPRENDRE L'ÉTAT DE PARC DU CLIENT ───────────────────

     Le classeur arrive comme il est, souvent sans ligne d'en-tête : celui de
     TEC, le 16 septembre 2026, porte quatre-vingt-dix véhicules en quatre
     colonnes muettes. Les colonnes se reconnaissent donc sur leur contenu,
     une immatriculation à la forme du numéro, un genre à ses mots. Rien n'est
     ajouté avant que le tableau ait été montré et les colonnes confirmées.  */

  var COLONNES_IMPORT = [
    ["", "- ne pas importer -"],
    ["immat", "Immatriculation"],
    ["marque", "Marque et modèle"],
    ["genre", "Genre du véhicule"],
    ["financement", "Financement, soldé ou échéance"],
    ["mec", "1re mise en circulation"],
    ["ct", "Dernier contrôle technique"],
    ["km", "Kilométrage"],
    ["note", "Observations"],
  ];

  var IMMAT = /^[A-Z]{2}[- ]?\d{3}[- ]?[A-Z]{2}$|^\d{1,4}[- ]?[A-Z]{1,3}[- ]?\d{2}$/i;
  var GENRES_MOTS = [
    [/tracteur/i, "tracteur"],
    [/semi|remorque/i, "remorque"],
    [/camionnette|utilitaire|fourgon|vul/i, "vul"],
    [/camion|porteur|poids/i, "pl"],
    [/voiture|particuli|berline|vp\b/i, "vl"],
    [/autocar|autobus|commun/i, "commun"],
  ];
  function genreDe(t) {
    var x = String(t || "");
    for (var i = 0; i < GENRES_MOTS.length; i++) if (GENRES_MOTS[i][0].test(x)) return GENRES_MOTS[i][1];
    return "";
  }
  function dateDe(t) {
    var x = net(t);
    var m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/.exec(x);
    if (m) {
      var a = m[3].length === 2 ? (parseInt(m[3], 10) > 50 ? "19" + m[3] : "20" + m[3]) : m[3];
      return a + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(x)) return x;
    return "";
  }

  var LU = [];              /* le tableau lu, en attente de confirmation     */

  function deviner(lignes) {
    var nb = 0;
    lignes.forEach(function (l) { nb = Math.max(nb, l.length); });
    var choix = [];
    for (var c = 0; c < nb; c++) {
      var vals = lignes.map(function (l) { return net(l[c]); }).filter(Boolean);
      var immats = vals.filter(function (v) { return IMMAT.test(v); }).length;
      var genres = vals.filter(function (v) { return genreDe(v); }).length;
      var dates = vals.filter(function (v) { return dateDe(v); }).length;
      var annees = vals.filter(function (v) { return /^(SOLDE|\d{4})$/i.test(v); }).length;
      var nombres = vals.filter(function (v) { return /^\d{4,7}$/.test(v); }).length;
      var seuil = Math.max(1, vals.length * 0.6);
      if (immats >= seuil) choix.push("immat");
      else if (genres >= seuil) choix.push("genre");
      else if (dates >= seuil) choix.push("mec");
      else if (annees >= seuil) choix.push("financement");
      else if (nombres >= seuil) choix.push("km");
      else if (vals.length) choix.push("marque");
      else choix.push("");
    }
    /* Une seule colonne de marque : la première suffit, les autres deviennent
       des observations. */
    var vues = {};
    return choix.map(function (c) {
      if (!c) return "";
      if (vues[c] && c !== "note") return "note";
      vues[c] = true;
      return c;
    });
  }

  /* Les colonnes entièrement vides ne sont pas des colonnes : celle de TEC en
     comptait deux avant l'immatriculation, et sur un téléphone elles seules
     tenaient l'écran. */
  function serrer(lignes) {
    var nb = 0;
    lignes.forEach(function (l) { nb = Math.max(nb, l.length); });
    var garder = [];
    for (var c = 0; c < nb; c++) {
      var pleine = lignes.some(function (l) { return net(l[c]); });
      if (pleine) garder.push(c);
    }
    return lignes.map(function (l) {
      return garder.map(function (c) { return net(l[c]); });
    });
  }

  function montrerApercu() {
    var hote = $("i-apercu");
    LU = serrer(LU.filter(function (l) { return l.some(function (c) { return net(c); }); }));
    if (!LU.length) { hote.innerHTML = '<p class="dit mal">Rien de lisible dans ce tableau.</p>'; return; }
    var choix = deviner(LU);
    var nb = choix.length;
    var h = '<div class="apercu-tab"><table><thead><tr>';
    for (var c = 0; c < nb; c++) {
      h += "<th><select data-col=\"" + c + "\">" + COLONNES_IMPORT.map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === choix[c] ? " selected" : "") + ">" + ech(o[1]) + "</option>";
      }).join("") + "</select></th>";
    }
    h += "</tr></thead><tbody>";
    LU.slice(0, 4).forEach(function (l) {
      h += "<tr>";
      for (var c = 0; c < nb; c++) h += "<td>" + ech(l[c] || "") + "</td>";
      h += "</tr>";
    });
    h += "</tbody></table></div>";
    h += '<p class="dit">' + LU.length + " ligne" + (LU.length > 1 ? "s" : "") +
      " lue" + (LU.length > 1 ? "s" : "") + ". Les quatre premières sont montrées ; " +
      "vérifiez l'intitulé de chaque colonne.</p>";
    h += '<div class="barre"><button type="button" id="i-ajouter">Valider l\'importation de ' +
      LU.length + " ligne" + (LU.length > 1 ? "s" : "") + "</button></div>";
    hote.innerHTML = h;
    $("i-ajouter").addEventListener("click", importer);
  }

  function importer() {
    var choix = [];
    Array.prototype.forEach.call($("i-apercu").querySelectorAll("[data-col]"), function (sel) {
      choix[parseInt(sel.getAttribute("data-col"), 10)] = sel.value;
    });
    if (choix.indexOf("immat") < 0) {
      $("i-apercu").insertAdjacentHTML("beforeend",
        '<p class="dit mal">Aucune colonne n\'est désignée comme l\'immatriculation : ' +
        "sans elle, un véhicule ne peut pas être identifié.</p>");
      return;
    }
    var L = vehicules(), connus = {};
    L.forEach(function (v) { connus[net(v.immat).toUpperCase()] = true; });
    var ajoutes = 0, doublons = 0, sans = 0, nes = [];
    LU.forEach(function (ligne) {
      var o = {};
      choix.forEach(function (c, i) {
        if (!c) return;
        var val = net(ligne[i]);
        if (!val) return;
        if (c === "immat") o.immat = val.toUpperCase();
        else if (c === "genre") o.genre = genreDe(val) || "autre";
        else if (c === "mec" || c === "ct") o[c] = dateDe(val);
        else if (c === "note") o.note = (o.note ? o.note + " " : "") + val;
        else o[c] = val;
      });
      if (!o.immat || !IMMAT.test(o.immat)) { sans++; return; }
      if (connus[o.immat]) { doublons++; return; }
      connus[o.immat] = true;
      o.id = "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      if (!o.genre) o.genre = "autre";
      o.ctMois = CT_DEFAUT[o.genre] || 12;
      o.limMois = 24;
      o.chronoMois = 24;
      L.push(o);
      nes.push(o.id);
      ajoutes++;
    });
    garderVehicules(L);
    /* Une importation se défait : on retient ce qu'elle a ajouté, elle seule. */
    if (nes.length) garder(CLE_IMP, { le: iso(new Date()), ids: nes });
    LU = [];
    $("i-texte").value = "";
    $("i-fichier").value = "";
    /* On montre le résultat là où il se voit : la liste, juste dessous. */
    if (ajoutes) {
      $("import").open = false;
      var premier = $("vehicules");
      if (premier && premier.scrollIntoView) premier.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    $("i-apercu").innerHTML = '<p class="dit">' + ajoutes + " véhicule" + (ajoutes > 1 ? "s" : "") +
      " ajouté" + (ajoutes > 1 ? "s" : "") +
      (doublons ? ", " + doublons + " déjà présent" + (doublons > 1 ? "s" : "") : "") +
      (sans ? ", " + sans + " ligne" + (sans > 1 ? "s" : "") + " sans immatriculation lisible" : "") +
      ". Ce qui manque à chacun est listé sous « À compléter », juste dessous.</p>";
    ouvert.manques = true;
    rendre();
  }

  /* ──────────────────────────────── le classeur ─────────────────────────── */

  /* UNE DATE DANS UN CLASSEUR EST UNE DATE.

     Relevé le 27 septembre 2026 : le classeur de la flotte écrivait ses dates
     en toutes lettres, « 15 novembre 2026 ». Elles ne se triaient pas, ne se
     filtraient pas, et aucune ne pouvait être comparée à aujourd'hui. Le
     tableur reçoit maintenant de vraies dates, et il les met en rouge quand
     elles sont passées. */
  function dateExcel(isoDate) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(net(isoDate));
    if (!m) return "";
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? "" : d;
  }

  function classeur() {
    if (!window.TableurExport) return;
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    p = p || {};

    var V = [["Immatriculation", "Genre", "Marque et modèle", "Chauffeur attitré",
      "1re mise en circulation",
      "Kilométrage", "Relevé le", "Dernier contrôle technique", "Prochain contrôle",
      "Prochain limiteur", "Prochain chronotachygraphe", "Assurance", "Copie conforme",
      "Prochaine révision", "Extincteur", "Pièces déposées", "Ce qui manque", "Observations"]];
    var nomDe = {};
    salaries(true).forEach(function (s) { nomDe[s.id] = s.nom; });
    vehicules().forEach(function (v) {
      var genre = "";
      GENRES.forEach(function (g) { if (g[0] === v.genre) genre = g[1]; });
      var pi = [];
      PIECES.forEach(function (x) { if (v.pieces && v.pieces[x.c]) pi.push(x.lib); });
      V.push([
        v.immat || "", genre, v.marque || "", nomDe[v.conducteur] || "",
        dateExcel(v.mec), v.km || "", dateExcel(v.kmLe),
        dateExcel(v.ct), dateExcel(v.ct ? plusMois(v.ct, v.ctMois || CT_DEFAUT[v.genre] || 12) : ""),
        dateExcel(v.lim ? plusMois(v.lim, v.limMois || 24) : ""),
        dateExcel(v.chrono ? plusMois(v.chrono, v.chronoMois || 24) : ""),
        dateExcel(v.assur), dateExcel(v.licenceFin),
        dateExcel(v.revision) || (v.revisionKm ? v.revisionKm + " km" : ""),
        dateExcel(v.extincteur), pi.join(", "), manque(v).join(", "), v.note || "",
      ]);
    });
    if (V.length === 1) V.push(V[0].map(function () { return ""; }));

    var C = [["Conducteur", "Emploi", "Permis", "Catégories", "Validité du permis", "Points",
      "Suspension jusqu'au", "Dernière FCO", "Prochaine FCO", "Carte conducteur",
      "Carte de qualification", "Visite du permis", "Attestation de conduite", "Suivi médical",
      "Dernière visite", "Prochaine visite", "Véhicule", "Observations"]];
    var parId = {};
    vehicules().forEach(function (v) { parId[v.id] = v.immat || ""; });
    salaries().forEach(function (s) {
      var f = fiche(s.id), suivi = "";
      SUIVIS.forEach(function (o) { if (o[0] === f.suivi) suivi = o[1]; });
      var prochaine = "";
      if (f.suivi === "vip" && f.visiteTravail) prochaine = plusMois(f.visiteTravail, 60);
      if (f.suivi === "sir" && f.visiteTravail) prochaine = plusMois(f.visiteTravail, 48);
      C.push([
        s.nom, s.emp, f.permisNum || "", f.permisCat || "", dateExcel(f.permisFin),
        f.points == null ? "" : f.points, dateExcel(f.retraitFin), dateExcel(f.fco),
        dateExcel(f.fco ? plusMois(f.fco, f.fcoMois || 60) : ""),
        dateExcel(f.carteCond), dateExcel(f.carteQualif), dateExcel(f.visitePermisFin),
        dateExcel(f.attestConduite ? plusMois(f.attestConduite, 60) : ""),
        suivi, dateExcel(f.visiteTravail), dateExcel(prochaine),
        parId[f.vehicule] || "", f.note || "",
      ]);
    });
    if (C.length === 1) C.push(C[0].map(function () { return ""; }));

    var alertes = [["Échéance", "Qui ou quoi", "Date", "Où l'on en est"]];
    /* « DANS 11 JOURS » NE VAUT QUE LE JOUR OÙ ON L'A ÉCRIT.

       La colonne « Où l'on en est » sortait en texte figé : le classeur rouvert
       une semaine plus tard annonçait encore onze jours, et la personne qui le
       lit n'a aucun moyen de le savoir. Relevé le 29 septembre 2026. Quand la
       ligne porte une date, la colonne devient une formule qui compte depuis le
       jour où le classeur est ouvert ; les lignes en kilomètres et en points de
       permis, elles, n'ont pas de date et gardent leur texte. */
    function ouLonEnEst(rang, jours, texte) {
      var c = "C" + rang;
      return { f: 'IF(' + c + '="","",IF(' + c + '<TODAY(),"dépassée de "&TEXT(TODAY()-' + c +
        ',"0")&" jours",IF(' + c + '=TODAY(),"aujourd\'hui","dans "&TEXT(' + c +
        '-TODAY(),"0")&" jours")))',
        v: texte };
    }
    vehicules().forEach(function (v) {
      echeancesVehicule(v).forEach(function (e) {
        if (e.etat !== "passe" && e.etat !== "rouge" && e.etat !== "ambre") return;
        var rang = alertes.length + 1;
        alertes.push([e.quoi, v.immat || "", e.km ? "" : dateExcel(e.date),
          e.km ? (e.reste < 0 ? "dépassée de " + (-e.reste) + " km" : "dans " + e.reste + " km")
               : ouLonEnEst(rang, e.jours, dit(e.jours))]);
      });
    });
    salaries().forEach(function (s) {
      echeancesConducteur(fiche(s.id)).forEach(function (e) {
        if (e.etat !== "passe" && e.etat !== "rouge" && e.etat !== "ambre") return;
        var rangC = alertes.length + 1;
        alertes.push([e.quoi, s.nom, e.points ? "" : dateExcel(e.date),
          e.points ? e.valeur + " points restants" : ouLonEnEst(rangC, e.jours, dit(e.jours))]);
      });
    });
    if (alertes.length === 1) alertes.push(["Aucune échéance dépassée ni proche", "", "", ""]);

    /* L'entretien, intervention par intervention, avec le coût et le cumul par
       véhicule. Les montants sortent en nombres, qui s'additionnent et se
       trient dans le tableur. */
    var INT = [["Immatriculation", "Date", "Kilométrage", "Nature des travaux", "Fait par",
      "Heures", "Taux horaire", "Main d'oeuvre", "Pièces", "Sous-traitance", "Total"]];
    var totalParc = 0;
    vehicules().forEach(function (v) {
      var L = v.interventions || [];
      if (!L.length) return;
      var cumV = 0;
      L.forEach(function (it) {
        var c = coutInter(it);
        cumV += c.total; totalParc += c.total;
        INT.push([v.immat || "", dateExcel(it.date), it.km ? fnum(it.km) : "", it.objet || "", it.par || "",
          c.h || "", fnum(it.taux) || "", c.mo, c.pieces, c.sous, c.total]);
      });
      INT.push(["", "", "", "Total " + (v.immat || "véhicule"), "", "", "", "", "", "", cumV]);
    });
    if (INT.length === 1) INT.push(["", "", "", "Aucune intervention enregistrée", "", "", "", "", "", "", ""]);
    else INT.push(["", "", "", "TOTAL DU PARC", "", "", "", "", "", "", totalParc]);

    var nom = "flotte-et-conducteurs-" + iso(new Date()) + ".xlsx";
    window.TableurExport.telecharger(window.TableurExport.xlsx([
      { titre: "Véhicules", lignes: V },
      { titre: "Conducteurs", lignes: C },
      { titre: "À surveiller", lignes: alertes, largeurs: [28, 30, 22, 26] },
      { titre: "Entretien", lignes: INT, largeurs: [16, 12, 12, 36, 24, 8, 12, 14, 12, 14, 14] },
      { titre: "Mode d'emploi", lignes: [
        ["Flotte et conducteurs"],
        ["Entreprise", p.denomination || ""],
        /* UNE DATE ÉCRITE EN TEXTE NE SE TRIE PAS ET NE SE CALCULE PAS : le
         tableur la range au format jour/mois/année quand on lui donne une
         vraie date, et la laisse telle quelle quand on lui donne une chaîne.
         Relevé le 28 septembre 2026, en rouvrant les classeurs. */
      ["Édité le", new Date()],
        [],
        ["Les périodicités du contrôle technique, du limiteur, du chronotachygraphe et des titres " +
         "de conduite relèvent du code de la route et de la réglementation des transports : " +
         "l'application ne les affirme pas, elle reprend les dates que vous avez saisies."],
        ["Le suivi médical du travail suit le code du travail : visite d'information et de prévention " +
         "dans les trois mois de la prise de poste (R. 4624-10), renouvelée tous les cinq ans au plus " +
         "(R. 4624-16) ; sur un poste à risques particuliers, suivi individuel renforcé tous les quatre " +
         "ans au plus, avec une visite intermédiaire deux ans au plus tard (R. 4624-22, R. 4624-28)."],
      ], largeurs: [26, 80] },
    ]), nom);
  }

  /* ──────────────────────────────── branchements ────────────────────────── */

  /* CE QUE LES AUTRES ÉCRANS PEUVENT LIRE. L'agenda social ramasse ces
     échéances avec les siennes : une visite médicale et un contrôle technique
     se préparent au même endroit. Demande du 15 septembre 2026. */
  function toutesEcheances() {
    var out = [];
    vehicules().forEach(function (v) {
      echeancesVehicule(v).forEach(function (e) {
        if (!e.date) return;
        out.push({ quoi: e.quoi, qui: v.immat || "véhicule sans immatriculation",
          date: e.date, etat: e.etat, jours: e.jours, fond: e.fond });
      });
    });
    salaries().forEach(function (s) {
      echeancesConducteur(fiche(s.id)).forEach(function (e) {
        if (!e.date) return;
        out.push({ quoi: e.quoi, qui: s.nom, date: e.date, etat: e.etat, jours: e.jours, fond: e.fond });
      });
    });
    return out;
  }
  window.Flotte = { echeances: toutesEcheances };

  function demarrer() {
    /* Le fichier est aussi chargé par l'agenda, qui n'a aucun de ces écrans :
       sans cette garde, il s'y planterait au premier identifiant manquant. */
    if (!$("compte")) return;
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    if ($("ent")) $("ent").textContent = (p && p.denomination) || "";

    $("o-veh").addEventListener("click", function () { onglet(true); });
    $("o-con").addEventListener("click", function () { onglet(false); });
    function onglet(veh) {
      SUR_VEHICULES = veh;
      $("o-veh").setAttribute("aria-selected", veh ? "true" : "false");
      $("o-con").setAttribute("aria-selected", veh ? "false" : "true");
      $("e-veh").hidden = !veh;
      $("e-con").hidden = veh;
      rendreCompte();
      window.scrollTo(0, 0);
    }

    $("v-ajouter").addEventListener("click", function () {
      var L = vehicules();
      var id = "v" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      L.push({ id: id, immat: "", genre: "pl", ctMois: CT_DEFAUT.pl, limMois: 24, chronoMois: 24 });
      garderVehicules(L);
      ouvert["v" + id] = true;
      rendre();
      var e = document.getElementById("v" + id + "-immat");
      if (e) { e.focus(); e.scrollIntoView({ behavior: "smooth", block: "center" }); }
    });

    /* VIDER LA FLOTTE, ET DÉFAIRE LA DERNIÈRE IMPORTATION.

       Un état de parc repris de travers ne se rattrape pas à la main sur
       quatre-vingt-dix fiches. Deux gestes, donc : tout retirer, ou retirer
       seulement ce que la dernière importation a ajouté, ce qui laisse en
       place les véhicules saisis avant elle.
       Demande du 16 septembre 2026 : « quand on importe une flotte on peut la
       supprimer aussi, je n'ai pas cette faculté sur l'application ». */
    /* VIDER LA FLOTTE DEMANDE DEUX CONFIRMATIONS. Relevé le 10 novembre 2026 :
       un seul « oui » suffisait à effacer quatre-vingts véhicules, sans retour.
       La première confirmation prévient ; la seconde fait écrire le mot, pour
       qu'un geste malheureux ne vide pas le parc. */
    $("v-vider").addEventListener("click", function () {
      var n = vehicules().length;
      if (!n) return;
      if (!confirmerDur("Vider la flotte : retirer les " + n + " véhicule" + (n > 1 ? "s" : "") +
        " de cet appareil ? Les fiches des conducteurs et les pièces déposées sont gardées. " +
        "Cette action ne se rattrape pas.", "VIDER")) return;
      garderVehicules([]);
      garder(CLE_IMP, null);
      ouvert = {};
      rendre();
      window.scrollTo(0, 0);
    });

    $("v-annuler").addEventListener("click", function () {
      var der = lire(CLE_IMP, null);
      if (!der || !der.ids || !der.ids.length) return;
      var dedans = {};
      der.ids.forEach(function (i) { dedans[i] = true; });
      var reste = vehicules().filter(function (v) { return !dedans[v.id]; });
      var n = vehicules().length - reste.length;
      if (!n) return;
      if (!confirmerDur("Retirer les " + n + " véhicule" + (n > 1 ? "s" : "") +
        " ajouté" + (n > 1 ? "s" : "") + " par l'importation du " + enFrancais(der.le) +
        " ? Cette action ne se rattrape pas.", "ANNULER")) return;
      garderVehicules(reste);
      garder(CLE_IMP, null);
      rendre();
      window.scrollTo(0, 0);
    });

    /* Un seul écouteur pour tout l'écran : les fiches se redessinent sans
       cesse, des écouteurs posés sur chaque titre disparaîtraient avec elles. */
    document.addEventListener("click", function (ev) {
      /* COMPLÉTER : on passe la liste en mode « à compléter », et on ouvre le
         plus incomplet, celui par qui commencer. */
      var comp = ev.target.closest ? ev.target.closest("[data-completer]") : null;
      if (comp) {
        fEtat = "incomplet"; if ($("f-etat")) $("f-etat").value = "incomplet";
        fRecherche = ""; if ($("f-rech")) $("f-rech").value = "";
        var manq = vehicules().map(function (v) { return { v: v, m: manque(v) }; })
          .filter(function (x) { return x.m.length; });
        manq.sort(function (a, b) { return b.m.length - a.m.length; });
        if (manq.length) ouvert["v" + manq[0].v.id] = true;
        rendre();
        if (manq.length) {
          var k = document.querySelector('[data-v="' + manq[0].v.id + '"]');
          if (k && k.scrollIntoView)
            window.setTimeout(function () { k.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
        }
        return;
      }
      var o = ev.target.closest ? ev.target.closest("[data-ouvrir]") : null;
      if (o) {
        var vid = o.getAttribute("data-ouvrir");
        ouvert["v" + vid] = true;
        rendre();
        var carte = document.querySelector('[data-v="' + vid + '"]');
        if (carte && carte.scrollIntoView) carte.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      var pph = ev.target.closest ? ev.target.closest("[data-photo-sup]") : null;
      if (pph) {
        if (!window.confirm("Retirer la photo de ce véhicule ?")) return;
        var idph = pph.getAttribute("data-photo-sup");
        var Tph = vehicules();
        Tph.forEach(function (x) { if (x.id === idph) delete x.photo; });
        garderVehicules(Tph);
        rendre();
        return;
      }
      var ps = ev.target.closest ? ev.target.closest("[data-piece-sup]") : null;
      if (ps) {
        if (!window.confirm("Retirer cette pièce du véhicule ?")) return;
        var duo = ps.getAttribute("data-piece-sup").split("|");
        var T = vehicules();
        T.forEach(function (x) { if (x.id === duo[0] && x.pieces) delete x.pieces[duo[1]]; });
        garderVehicules(T);
        rendre();
        return;
      }
      var iadd = ev.target.closest ? ev.target.closest("[data-it-add]") : null;
      if (iadd) {
        var vida = iadd.getAttribute("data-it-add");
        var Ta = vehicules();
        Ta.forEach(function (x) {
          if (x.id !== vida) return;
          x.interventions = x.interventions || [];
          x.interventions.push({ date: iso(new Date()), taux: lire(CLE_TAUX, "") });
        });
        garderVehicules(Ta);
        rendre();
        return;
      }
      var isup = ev.target.closest ? ev.target.closest("[data-it-sup]") : null;
      if (isup) {
        var duoi = isup.getAttribute("data-it-sup").split("|");
        if (!window.confirm("Retirer cette intervention ?")) return;
        var Ti = vehicules();
        Ti.forEach(function (x) {
          if (x.id === duoi[0] && x.interventions) x.interventions.splice(parseInt(duoi[1], 10), 1);
        });
        garderVehicules(Ti);
        rendre();
        return;
      }
      var vt = ev.target.closest ? ev.target.closest("[data-vtab]") : null;
      if (vt) {
        var d = vt.getAttribute("data-vtab").split("|");
        vtabActif[d[0]] = d[1];
        rendre();
        var c = document.querySelector('[data-v="' + d[0] + '"]');
        if (c && c.scrollIntoView) c.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      var t = ev.target.closest ? ev.target.closest("[data-plier]") : null;
      if (t) {
        var cle = t.getAttribute("data-plier");
        ouvert[cle] = !ouvert[cle];
        rendre();
        return;
      }
      var s = ev.target.closest ? ev.target.closest("[data-sup]") : null;
      if (s) {
        var id = s.getAttribute("data-sup");
        var L = vehicules(), v = null;
        L.forEach(function (x) { if (x.id === id) v = x; });
        if (!confirmerDur("Retirer " + ((v && v.immat) || "ce véhicule") + " du fichier ? Son suivi, " +
          "ses échéances et ses interventions seront perdus. Cette action ne se rattrape pas.", "SUPPRIMER")) return;
        if (v && v.conducteur) lierVehiculeConducteur(id, "", v.conducteur);
        garderVehicules(L.filter(function (x) { return x.id !== id; }));
        delete ouvert["v" + id];
        rendre();
      }
    });

    $("i-lire").addEventListener("click", function () {
      var f = $("i-fichier").files && $("i-fichier").files[0];
      var colle = net($("i-texte").value);
      if (colle) { LU = window.LireClasseur.texte(colle); montrerApercu(); return; }
      if (!f) {
        $("i-apercu").innerHTML = '<p class="dit mal">Choisissez un fichier, ou collez le tableau.</p>';
        return;
      }
      if (/\.(csv|txt|tsv)$/i.test(f.name)) {
        f.text().then(function (t) { LU = window.LireClasseur.texte(t); montrerApercu(); });
        return;
      }
      if (!window.LireClasseur.possible()) {
        $("i-apercu").innerHTML = '<p class="dit mal">Ce navigateur ne sait pas ouvrir un .xlsx. ' +
          "Ouvrez le classeur, copiez les colonnes, et collez-les ci-dessus.</p>";
        return;
      }
      $("i-apercu").innerHTML = '<p class="dit">Lecture du classeur...</p>';
      window.LireClasseur.fichier(f).then(function (lignes) {
        LU = lignes.filter(function (l) { return l.some(function (c) { return net(c); }); });
        montrerApercu();
      }, function () {
        $("i-apercu").innerHTML = '<p class="dit mal">Ce fichier n\'a pas pu être lu. ' +
          "Enregistrez-le en .csv, ou collez les colonnes ci-dessus.</p>";
      });
    });

    $("b-excel").addEventListener("click", classeur);

    /* RECHERCHE, FILTRES, TRI. */
    if ($("f-genre")) {
      $("f-genre").innerHTML = '<option value="">Tous les types</option>' +
        GENRES.map(function (g) { return '<option value="' + ech(g[0]) + '">' + ech(g[1]) + "</option>"; }).join("");
    }
    /* UN FILTRE VENU DU TABLEAU DE BORD. Un clic sur un chiffre du tableau de
       bord ouvre la liste déjà filtrée, par l'adresse (?etat=, ?genre=, ?q=). */
    var viserImmat = "", viserTab = "";
    try {
      var pr = new URLSearchParams(location.search);
      if (pr.get("etat")) { fEtat = pr.get("etat"); if ($("f-etat")) $("f-etat").value = fEtat; }
      if (pr.get("genre")) { fGenre = pr.get("genre"); if ($("f-genre")) $("f-genre").value = fGenre; }
      if (pr.get("q")) { fRecherche = pr.get("q"); if ($("f-rech")) $("f-rech").value = fRecherche; }
      /* VENU DE LA RECHERCHE « FAIRE UN ENTRETIEN ». On ne peut pas saisir un
         entretien sans savoir sur quel camion : la liste s'ouvre donc en « mode
         entretien », un rappel en tête, et toute fiche ouverte tombe d'emblée
         sur son onglet Entretien. */
      if (pr.get("faire") === "entretien") tabParDefaut = "entretien";
      /* VENU DES DÉPENSES : OUVRIR UNE FICHE PRÉCISE. Un clic sur une dépense
         mène ici avec l'immatriculation, et l'onglet à montrer. On filtre sur
         cette immatriculation, on déplie sa fiche sur l'onglet voulu, et on y
         amène l'écran. */
      if (pr.get("immat")) {
        viserImmat = net(pr.get("immat"));
        viserTab = net(pr.get("tab")) || "infos";
        fRecherche = viserImmat;
        if ($("f-rech")) $("f-rech").value = fRecherche;
        vehicules().forEach(function (v) {
          if (net(v.immat).toUpperCase() === viserImmat.toUpperCase()) {
            ouvert["v" + v.id] = true;
            vtabActif[v.id] = viserTab;
          }
        });
      }
    } catch (e) {}
    var brech = $("f-rech"); if (brech) brech.addEventListener("input", function () { fRecherche = this.value; rendreVehicules(); });
    var bg = $("f-genre"); if (bg) bg.addEventListener("change", function () { fGenre = this.value; rendreVehicules(); });
    var be = $("f-etat"); if (be) be.addEventListener("change", function () { fEtat = this.value; rendreVehicules(); });
    var bt = $("f-tri"); if (bt) bt.addEventListener("change", function () { fTri = this.value; rendreVehicules(); });
    var br = $("f-reduire"); if (br) br.addEventListener("click", function () {
      Object.keys(ouvert).forEach(function (k) { if (k.charAt(0) === "v") delete ouvert[k]; });
      rendreVehicules();
    });

    rendre();

    /* On amène l'écran sur la fiche ouverte depuis les dépenses. */
    if (viserImmat) {
      var cible = null;
      vehicules().forEach(function (v) {
        if (net(v.immat).toUpperCase() === viserImmat.toUpperCase()) cible = v;
      });
      if (cible) {
        var carte = document.querySelector('[data-v="' + cible.id + '"]');
        if (carte && carte.scrollIntoView)
          window.setTimeout(function () { carte.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
      }
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
