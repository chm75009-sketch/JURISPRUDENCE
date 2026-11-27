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
  var GENRE_LIB = {};
  GENRES.forEach(function (g) { GENRE_LIB[g[0]] = g[1]; });
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
    /* L'APPAREIL LUI-MÊME. Demande du 24 novembre 2026 : le chronotachygraphe
       doit se voir sur la fiche, « avec référence ou modèle, relevé ou pas,
       échéance ». La génération dit ce que l'appareil enregistre ; la marque et
       la référence disent lequel est monté. */
    { c: "chronoType", lib: "Type d'appareil", t: "select", opts: [
      ["", "- à préciser -"],
      ["g2v2", "Intelligent, 2e version (G2V2)"],
      ["g2v1", "Intelligent, 1re version (G2V1)"],
      ["g1", "Numérique, 1re génération"],
      ["analogique", "Analogique, à disques"]] },
    { c: "chronoRef", lib: "Marque, modèle et référence", t: "text", ph: "ex. VDO DTCO 4.1, Stoneridge SE5000" },
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

  /* LES CASES DE LA FICHE, EN DEUX PARTIES (25 novembre 2026). Celles que
     le salarié remplit lui-même depuis le lien des groupes WhatsApp portent
     « sal » : la fiche qu'il envoie s'y range case par case. Les autres
     restent à compléter par T.E.C. Les cases ajoutées ce jour-là sont celles
     du questionnaire qui n'avaient pas leur place dans la fiche. */
  var OUI_NON = [["", "- à préciser -"], ["oui", "Oui"], ["non", "Non"]];
  var CHAMPS_C = [
    { c: "roulant", sal: true, lib: "Personnel roulant (conduit pour T.E.C)", t: "select", opts: OUI_NON },
    /* L'identité que le registre et l'embauche demandent, recueillie par le
       questionnaire depuis le 27 novembre 2026 (D. 1221-23, 1° à 3°, et
       R. 1221-1, 2°, du code du travail). */
    { c: "sexe", sal: true, lib: "Sexe", t: "select", opts: [["", "- à préciser -"], ["F", "Femme"], ["M", "Homme"]] },
    { c: "nais", sal: true, lib: "Date de naissance", t: "date" },
    { c: "naisLieu", sal: true, lib: "Lieu de naissance", t: "text" },
    { c: "adresse", sal: true, lib: "Adresse", t: "text", large: true },
    { c: "tel", sal: true, lib: "Téléphone", t: "text" },
    { c: "courriel", sal: true, lib: "Adresse e-mail", t: "text" },
    { c: "nir", sal: true, lib: "Numéro de sécurité sociale", t: "text" },
    { c: "nat", sal: true, lib: "Nationalité", t: "text" },
    { c: "ue", sal: true, lib: "Ressortissant de l'Union européenne, de l'EEE ou de la Suisse", t: "select", opts: OUI_NON },
    { c: "titreType", sal: true, lib: "Titre de séjour ou de travail", t: "text", large: true },
    { c: "titreNum", sal: true, lib: "Numéro du titre", t: "text" },
    { c: "permisOrigine", sal: true, lib: "Permis délivré", t: "select",
      opts: [["", "- à préciser -"], ["fr", "En France"], ["ue", "Dans l'Union européenne ou l'EEE"], ["etr", "Hors Union européenne"]] },
    { c: "permisEchange", sal: true, lib: "Échange du permis demandé", t: "select", opts: OUI_NON },
    { c: "inter", sal: true, lib: "Fait de l'international ou du cabotage", t: "select", opts: OUI_NON },
    { c: "suspendu", sal: true, lib: "Permis suspendu ou retiré, selon le salarié", t: "select", opts: OUI_NON },
    { c: "code95", sal: true, lib: "Code 95 sur le permis", t: "select", opts: OUI_NON },
    { c: "livret", sal: true, lib: "Livret individuel de contrôle en main", t: "select", opts: OUI_NON },
    { c: "aCarte", sal: true, lib: "A une carte conducteur", t: "select", opts: OUI_NON },
    { c: "permisNum", sal: true, lib: "Permis, numéro", t: "text" },
    { c: "permisCat", sal: true, lib: "Catégories", t: "text" },
    { c: "permisFin", sal: true, lib: "Validité du permis jusqu'au", t: "date" },
    { c: "points", sal: true, lib: "Points restants", t: "num" },
    { c: "retraitLe", sal: true, lib: "Retrait ou suspension, le", t: "date" },
    { c: "retraitFin", sal: true, lib: "Jusqu'au", t: "date" },
    { c: "retraitMotif", sal: true, lib: "Motif du retrait ou de la suspension", t: "text", large: true },
    /* La FIMO et la dernière FCO, deux dates (27 novembre 2026) : la FCO se
       suit tous les cinq ans, la première dans les cinq ans de la FIMO (code
       des transports, R. 3314-10). L'échéance part de la plus récente. Une
       fiche plus ancienne portait sous « fco » la dernière des deux. */
    { c: "fimo", sal: true, lib: "FIMO, le", t: "date" },
    { c: "fco", sal: true, lib: "Dernière FCO, le", t: "date" },
    { c: "carteNum", sal: true, lib: "Carte de conducteur, numéro", t: "text" },
    { c: "fcoMois", lib: "Périodicité de la FCO, en mois", t: "num" },
    { c: "carteCond", sal: true, lib: "Carte de conducteur, échéance", t: "date" },
    { c: "carteQualif", sal: true, lib: "Carte de qualification, échéance", t: "date" },
    /* LE TÉLÉCHARGEMENT DES DONNÉES, QUE RIEN NE SUIVAIT.

       Relevé le 27 septembre 2026 : aucune échéance de téléchargement, ni pour
       la carte de conducteur, ni pour l'unité embarquée. Ce sont pourtant les
       données que l'inspection demande, et elles s'effacent. La périodicité
       usuelle est de vingt-huit jours pour la carte et de quatre-vingt-dix
       pour l'unité embarquée ; elle vient d'un arrêté que l'application n'a
       pas lu, comme la périodicité du chronotachygraphe : c'est un champ que
       l'entreprise corrige. */
    /* Demandé au salarié dans son questionnaire depuis le 27 novembre 2026, et
       saisissable ici : il lance le voyant des vingt-huit jours du suivi de la
       carte, tant qu'aucun fichier de carte n'a été lu. */
    { c: "telecCarte", sal: true, lib: "Dernier téléchargement de la carte, le", t: "date" },
    { c: "telecCarteJours", lib: "Périodicité du téléchargement, en jours", t: "num" },
    { c: "visitePermisFin", sal: true, lib: "Visite médicale du permis, valable jusqu'au", t: "date" },
    /* LE SALARIÉ ÉTRANGER (25 novembre 2026) : la fin de son titre de séjour,
       et, s'il conduit avec un permis étranger, le pays et la date d'arrivée
       en France, qui fixe le délai d'un an de l'article R. 222-3 du code de la
       route (LEGIARTI000035977232, lu à la source le même jour). */
    { c: "titreFin", sal: true, lib: "Titre de séjour, valable jusqu'au", t: "date" },
    { c: "permisPays", sal: true, lib: "Permis étranger, pays de délivrance", t: "text" },
    { c: "arrivee", sal: true, lib: "Arrivée en France le", t: "date" },
    { c: "suivi", lib: "Suivi médical du travail", t: "select", opts: SUIVIS, large: true },
    { c: "visiteTravail", sal: true, lib: "Dernière visite avec le médecin du travail", t: "date" },
    { c: "visiteInter", lib: "Dernière visite intermédiaire", t: "date" },
    { c: "attestConduite", lib: "Attestation médicale de conduite, délivrée le", t: "date" },
    { c: "vehicule", lib: "Camion attribué", t: "vehicule" },
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
  /* La dernière formation suivie : la FCO si elle est datée, sinon la FIMO. */
  function derForm(f) { var a = net(f && f.fco), b = net(f && f.fimo); return a && (!b || a >= b) ? a : b; }
  function salaries(tous) {
    var r = lire(CLE_REG, {}), F = lire(CLE_C, {}) || {};
    var L = ((r && r.salaries) || []).filter(function (s) {
      return net(s.nom) || net(s.pre);
    }).map(function (s) {
      var nom = (net(s.nom) + " " + net(s.pre)).trim(), id = sansAccent(nom) || "salarie";
      /* CE QUE LE SALARIÉ A RÉPONDU L'EMPORTE SUR L'INTITULÉ DU POSTE
         (27 novembre 2026). Roulant ou non se déduisait seulement de l'emploi
         écrit au registre : un conducteur dont le poste ne dit pas
         « chauffeur » disparaissait du suivi tachygraphe, et sa page ne
         montrait pas son permis. La réponse de sa fiche, quand il y en a une,
         décide. */
      var rf = net((F[id] || {}).roulant);
      return { id: id, nom: nom, emp: net(s.emp), ent: net(s.ent), sor: net(s.sor),
        conduit: rf === "oui" ? true : (rf === "non" ? false : CONDUIT.test(net(s.emp))), roulantFiche: rf };
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
    pose("FCO", derForm(f) ? plusMois(derForm(f), f.fcoMois || 60) : "");
    pose("Carte conducteur", f.carteCond);
    /* Le téléchargement de la carte se suit au suivi tachygraphe, et nulle
       part ailleurs (26 novembre 2026) : deux dates pour la même chose
       finissaient par se contredire. */
    pose("Carte de qualification", f.carteQualif);
    pose("Visite du permis", f.visitePermisFin);
    pose("Titre de séjour", f.titreFin);
    pose("Échange du permis étranger", net(f.permisPays) && f.arrivee ? plusMois(f.arrivee, 12) : "",
      "R. 222-3 du code de la route : le permis étranger n'est reconnu qu'un an après l'installation en France");
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
        (ch.ph ? ' placeholder="' + ech(ch.ph) + '"' : "") +
        (ch.maj ? ' style="text-transform:uppercase"' : "") + ">";
    }
    return h + "</label>";
  }

  /* UNE SAISIE NE SE COUPE PAS À LA PREMIÈRE LETTRE. La fiche se redessinait
     à chaque touche : le champ était remplacé, le clavier se fermait, et
     « RENAULT » tapé lettre à lettre s'enregistrait « R ». Relevé le
     24 novembre 2026 en ajoutant la référence du chronotachygraphe. Un champ
     qu'on tape s'enregistre à chaque touche, mais la fiche ne se redessine
     qu'à la sortie du champ. Une liste ou une date, elles, se choisissent
     d'un geste : elles redessinent tout de suite. */
  function brancher(cadre, prefixe, lit, ecrit, apres) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-ch]"), function (el) {
      var choix = el.tagName === "SELECT" || el.type === "date";
      function enregistrer() {
        var o = lit(), c = el.getAttribute("data-ch");
        var v = el.value;
        if (c === "immat") v = v.toUpperCase();
        var avant = o[c];
        o[c] = v;
        ecrit(o);
        if (apres) apres(c, v, avant, o);
      }
      if (choix) {
        el.addEventListener("change", function () { enregistrer(); rendre(); });
      } else {
        el.addEventListener("input", enregistrer);
        el.addEventListener("change", function () { enregistrer(); rendreApresSaisie(); });
      }
    });
  }
  /* En sortant d'un champ, on touche souvent autre chose : un bouton
     (« Relevé aujourd'hui »), ou le champ suivant. Redessiner tout de suite
     faisait disparaître ce bouton sous le doigt, ou fermait le champ suivant.
     La fiche attend donc que le geste soit fini, et que plus aucun champ de
     la fiche ne soit en cours de saisie. */
  var rendreAttente = null;
  function rendreApresSaisie() {
    if (rendreAttente) window.clearTimeout(rendreAttente);
    rendreAttente = window.setTimeout(function () {
      rendreAttente = null;
      var a = document.activeElement;
      if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.hasAttribute("data-ch")) {
        a.addEventListener("blur", rendreApresSaisie, { once: true });
        return;
      }
      rendre();
    }, 350);
  }

  /* LE CHAUFFEUR ATTITRÉ ET SON VÉHICULE, LES DEUX FACES DU MÊME LIEN.

     Le véhicule porte son chauffeur, le conducteur porte son véhicule : si
     les deux se saisissent séparément, ils finissent par se contredire. Ce
     qui est écrit d'un côté s'écrit de l'autre, et le conducteur qui perd
     son véhicule le perd des deux côtés. */
  /* UN CAMION, UN SEUL CHAUFFEUR ATTITRÉ (27 novembre 2026). Choisir pour
     COULIBALY un camion déjà attribué à SOUICI l'écrasait sans rien dire, et
     la fiche de SOUICI gardait ce camion : deux salariés voyaient le même.
     Désormais, celui qui perd un camion le perd des deux côtés, sur la fiche
     du camion comme sur la sienne, et rien ne lui est retiré sans que
     l'utilisateur l'ait confirmé. Les deux fonctions rendent « false » quand
     la confirmation est refusée : rien n'a alors été touché, et l'appelant
     remet le champ comme il était. */
  function nomSalarie(id) {
    var n = "";
    salaries(true).forEach(function (s) { if (s.id === id) n = s.nom; });
    return n || id;
  }
  function immatDe(L, id) {
    var t = "";
    L.forEach(function (v) { if (v.id === id) t = net(v.immat); });
    return t || "un véhicule sans immatriculation";
  }
  function retraitsAccepte(pertes) {
    if (!pertes.length) return true;
    return window.confirm(pertes.map(function (p) {
      return p.immat + " est attribué à " + p.nom + " : il le perdra.";
    }).join("\n") + "\n\nConfirmer ce changement ?");
  }
  /* Le salarié qui tient un camion, d'un côté ou de l'autre du lien. */
  function porteurs(L, idVehicule) {
    var P = {};
    L.forEach(function (v) { if (v.id === idVehicule && net(v.conducteur)) P[v.conducteur] = true; });
    var t = lire(CLE_C, {});
    Object.keys(t).forEach(function (sid) { if (t[sid] && t[sid].vehicule === idVehicule) P[sid] = true; });
    return Object.keys(P);
  }

  function lierVehiculeConducteur(idVehicule, idSalarie, idSalarieAvant, dejaConfirme) {
    var L = vehicules();
    /* Ceux qui perdent ce camion : tout autre que le nouveau chauffeur. */
    var perdV = porteurs(L, idVehicule).filter(function (sid) { return sid !== idSalarie; });
    if (idSalarieAvant && idSalarieAvant !== idSalarie && perdV.indexOf(idSalarieAvant) < 0) perdV.push(idSalarieAvant);
    /* Le nouveau chauffeur perd le camion qu'il avait : sa fiche n'en porte qu'un. */
    var ancienDuNouveau = idSalarie ? net(fiche(idSalarie).vehicule) : "";
    if (ancienDuNouveau === idVehicule) ancienDuNouveau = "";
    var pertes = perdV.map(function (sid) { return { nom: nomSalarie(sid), immat: immatDe(L, idVehicule) }; });
    if (ancienDuNouveau) pertes.push({ nom: nomSalarie(idSalarie), immat: immatDe(L, ancienDuNouveau) });
    if (!dejaConfirme && !retraitsAccepte(pertes)) return false;

    perdV.forEach(function (sid) {
      var a = fiche(sid);
      if (a.vehicule === idVehicule) { a.vehicule = ""; garderFiche(sid, a); }
    });
    L = vehicules();
    L.forEach(function (v) {
      if (v.id === idVehicule) v.conducteur = idSalarie || "";
      else if (idSalarie && v.conducteur === idSalarie && v.id === ancienDuNouveau) v.conducteur = "";
    });
    garderVehicules(L);
    if (idSalarie) {
      var f = fiche(idSalarie);
      if (f.vehicule !== idVehicule) { f.vehicule = idVehicule; garderFiche(idSalarie, f); }
    }
    return true;
  }

  function lierConducteurVehicule(idSalarie, idVehicule, idVehiculeAvant) {
    var L = vehicules();
    var perd = idVehicule ? porteurs(L, idVehicule).filter(function (sid) { return sid !== idSalarie; }) : [];
    if (!retraitsAccepte(perd.map(function (sid) { return { nom: nomSalarie(sid), immat: immatDe(L, idVehicule) }; })))
      return false;
    perd.forEach(function (sid) {
      var a = fiche(sid);
      if (a.vehicule === idVehicule) { a.vehicule = ""; garderFiche(sid, a); }
    });
    L.forEach(function (v) {
      if (v.id === idVehiculeAvant && v.conducteur === idSalarie) v.conducteur = "";
      if (idVehicule && v.id === idVehicule) v.conducteur = idSalarie;
    });
    garderVehicules(L);
    return true;
  }

  /* LE CHEF DE PARC SANS AUTORISATION NE VOIT RIEN DES CONDUCTEURS
     (27 novembre 2026). L'onglet était caché, mais le classeur Excel portait
     encore une feuille « Conducteurs » (permis, points, FCO, suivi médical),
     et le tableau de bord du parc nommait les permis, cartes et visites de
     chacun. Une seule question, posée partout où ces données sortent : la
     séance est-elle celle du chef de parc, et T.E.C lui a-t-elle ouvert les
     fiches conducteur ? */
  function conducteursCaches() {
    try {
      var r = window.sessionStorage.getItem("seance-role") || window.localStorage.getItem("seance-role");
      return r === "parc" && window.localStorage.getItem("parc-conducteurs-visibles") !== "oui";
    } catch (e) { return false; }
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
  var VTABS = [["infos", "Infos"], ["ech", "Échéances"], ["bord", "À bord"], ["entretien", "Entretien"], ["pieces", "Documents"]];

  var tabParDefaut = "";   /* l'onglet sur lequel ouvrir une fiche, venu de la recherche */

  /* LA FICHE EN RUBRIQUES REPLIABLES. Demande du 24 novembre 2026 : « des
     menus intelligents pour ne pas encombrer la fiche ». Chaque onglet se
     découpe en rubriques. Une rubrique fermée tient sur une ligne, qui dit
     l'essentiel (l'échéance, le relevé, le kilométrage) ; on la touche pour
     l'ouvrir. Elle s'ouvre d'elle-même quand il y manque une donnée
     indispensable ou que son échéance est proche ou dépassée. Une rubrique sans
     objet pour le genre du véhicule ne paraît pas (pas de chronotachygraphe sur
     une voiture ni sur une remorque), sauf si elle porte déjà une donnée. */
  var secOuverte = {};     /* rubriques ouvertes ou fermées à la main, « id|clé » */

  function genreLourd(v) {
    return v.genre === "pl" || v.genre === "tracteur" || v.genre === "commun" || v.genre === "public10";
  }
  function genreIncertain(v) { return !net(v.genre) || v.genre === "autre"; }
  function rempli(v, cles) { return cles.some(function (c) { return net(v[c]); }); }

  var SECTIONS_V = {
    infos: [
      { k: "ident", titre: "Identification", fixe: true, champs: ["immat", "genre", "marque", "conducteur"] },
      { k: "chrono", titre: "Chronotachygraphe", ech: ["Chronotachygraphe", "Téléchargement de l'unité embarquée"],
        champs: ["chronoType", "chronoRef", "telecUnite", "telecUniteJours", "chrono", "chronoMois"],
        si: function (v) { return genreLourd(v) || v.genre === "vul" || genreIncertain(v); } },
      { k: "km", titre: "Kilométrage et mise en circulation", champs: ["km", "kmLe", "mec"] },
      { k: "energie", titre: "Carburant et places", champs: ["carburant", "places"],
        si: function (v) { return v.genre !== "remorque"; } },
      { k: "achat", titre: "Achat et financement", champs: ["dateAchat", "financementType", "financement"] },
      { k: "note", titre: "Observations", champs: ["note"] },
    ],
    ech: [
      { k: "ct", titre: "Contrôle technique", ech: ["Contrôle technique"], champs: ["ct", "ctMois"] },
      { k: "chrono", titre: "Chronotachygraphe", ech: ["Chronotachygraphe", "Téléchargement de l'unité embarquée"],
        champs: ["chronoType", "chronoRef", "telecUnite", "telecUniteJours", "chrono", "chronoMois"],
        si: function (v) { return genreLourd(v) || v.genre === "vul" || genreIncertain(v); } },
      { k: "lim", titre: "Limiteur de vitesse", ech: ["Limiteur"], champs: ["lim", "limMois"],
        si: function (v) { return genreLourd(v) || genreIncertain(v); } },
      { k: "assur", titre: "Assurance", ech: ["Assurance"], champs: ["assur", "assurContrat"] },
      { k: "licence", titre: "Copie conforme de licence", ech: ["Copie conforme"], champs: ["licence", "licenceFin"],
        si: function (v) { return v.genre !== "vl"; } },
      { k: "revision", titre: "Révision", ech: ["Révision"], champs: ["revision", "revisionKm"] },
      { k: "extincteur", titre: "Extincteur", ech: ["Extincteur"], champs: ["extincteur"] },
    ],
  };
  /* Le chauffeur attitré n'a pas de sens sur une remorque : il ne paraît pas,
     sauf s'il est déjà saisi. */
  function champVisible(v, c) {
    if (c === "conducteur") return v.genre !== "remorque" || !!net(v.conducteur);
    return true;
  }

  var CHAMP_DE = {};
  CHAMPS_V.forEach(function (ch) { CHAMP_DE[ch.c] = ch; });

  /* Ce qu'indique la ligne d'une rubrique fermée. */
  function resumeSection(v, sec, E, manques) {
    var morceaux = [], etatSec = "";
    function pireEtat(a, b) {
      var rang = { "": 0, vert: 1, ambre: 2, rouge: 3, passe: 4 };
      return (rang[b] || 0) > (rang[a] || 0) ? b : a;
    }
    if (sec.k === "chrono") {
      var type = "";
      (CHAMP_DE.chronoType.opts || []).forEach(function (o) { if (o[0] && o[0] === v.chronoType) type = o[1]; });
      var nomApp = net(v.chronoRef) || (type ? type.replace(/,.*$/, "") : "");
      if (nomApp) morceaux.push(nomApp);
      morceaux.push(net(v.telecUnite) ? "relevé le " + enFrancais(v.telecUnite) : "jamais relevé");
    }
    if (sec.k === "km") {
      if (net(v.km)) morceaux.push(String(v.km).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " km" +
        (net(v.kmLe) ? ", relevé le " + enFrancais(v.kmLe) : ""));
      if (net(v.mec)) morceaux.push("en circulation depuis le " + enFrancais(v.mec));
    }
    if (sec.k === "energie") {
      if (net(v.carburant)) morceaux.push(v.carburant);
      if (net(v.places)) morceaux.push(v.places + " place" + (parseInt(v.places, 10) > 1 ? "s" : ""));
    }
    if (sec.k === "achat") {
      if (net(v.dateAchat)) morceaux.push("acheté le " + enFrancais(v.dateAchat));
      if (net(v.financementType)) morceaux.push(v.financementType);
      if (net(v.financement)) morceaux.push(v.financement);
    }
    if (sec.k === "note" && net(v.note)) {
      var n = net(v.note); morceaux.push(n.length > 48 ? n.slice(0, 46) + "…" : n);
    }
    if (sec.k === "assur" && net(v.assurContrat)) morceaux.push("contrat " + v.assurContrat);
    if (sec.k === "licence" && net(v.licence)) morceaux.push("n° " + v.licence);
    (sec.ech || []).forEach(function (quoi) {
      E.forEach(function (e) {
        if (e.quoi !== quoi) return;
        etatSec = pireEtat(etatSec, e.etat);
        if (e.km) { morceaux.push(e.reste < 0 ? "dépassée de " + (-e.reste) + " km" : "dans " + e.reste + " km"); return; }
        var dite = e.jours < 0 ? dit(e.jours) : "avant le " + enFrancais(e.date);
        if (quoi === "Chronotachygraphe") morceaux.push("contrôle " + dite);
        else if (quoi === "Téléchargement de l'unité embarquée") {
          /* Le prochain relevé ne s'affiche que s'il approche : c'est lui qui
             colore alors la rubrique, il faut dire pourquoi. */
          if (e.etat === "passe") morceaux.push("relevé en retard, " + dit(e.jours));
          else if (e.etat === "rouge" || e.etat === "ambre") morceaux.push("prochain relevé avant le " + enFrancais(e.date));
        }
        else morceaux.push(dite);
      });
    });
    var manqueIci = manques.filter(function (m) { return m.sec === sec.k; });
    if (manqueIci.length) { etatSec = pireEtat(etatSec, "ambre"); morceaux.push("à compléter : " + manqueIci.map(function (m) { return m.quoi; }).join(", ")); }
    return { texte: morceaux.join(" · "), etat: etatSec, manque: manqueIci.length > 0 };
  }

  /* Les manques de la fiche (fonction manque), rattachés à leur rubrique. */
  var MANQUE_SEC = {
    "immatriculation": "ident", "genre du véhicule": "ident", "chauffeur attitré": "ident",
    "date du dernier contrôle technique": "ct", "échéance de l'assurance": "assur",
    "contrôle du chronotachygraphe": "chrono", "contrôle du limiteur": "lim",
    "copie conforme de licence": "licence", "kilométrage": "km",
  };

  function sectionsHtml(v, groupe) {
    var E = echeancesVehicule(v);
    var manques = manque(v).map(function (m) { return { quoi: m, sec: MANQUE_SEC[m] || "" }; });
    return '<div class="secs">' + SECTIONS_V[groupe].filter(function (sec) {
      return !sec.si || sec.si(v) || rempli(v, sec.champs);
    }).map(function (sec) {
      var champs = '<div class="gr">' + sec.champs.filter(function (c) { return champVisible(v, c); }).map(function (c) {
        var ch = CHAMP_DE[c], val = v[c];
        if (val == null || val === "") {
          if (c === "ctMois") val = CT_DEFAUT[v.genre] || 12;
          if (c === "limMois") val = 24;
          if (c === "chronoMois") val = 24;
        }
        return champHtml(ch, val, "v" + v.id);
      }).join("") + "</div>";
      if (sec.k === "chrono") {
        champs += '<div class="sec-act"><button type="button" class="second" data-auj="' + ech(v.id) +
          '|telecUnite">Relevé aujourd\'hui</button></div>';
      }
      if (sec.fixe) return '<div class="sec fixe">' + champs + "</div>";
      var r = resumeSection(v, sec, E, manques);
      var cle = v.id + "|" + sec.k;
      var auto = r.manque || r.etat === "passe" || r.etat === "rouge";
      var ouverte = secOuverte.hasOwnProperty(cle) ? secOuverte[cle] : auto;
      return '<details class="sec' + (r.etat ? " " + r.etat : "") + '" data-sec="' + ech(cle) + '"' + (ouverte ? " open" : "") + ">" +
        '<summary><span class="st">' + ech(sec.titre) + "</span>" +
        '<span class="sr">' + ech(r.texte || "à renseigner") + "</span></summary>" +
        '<div class="sc">' + champs + "</div></details>";
    }).join("") + "</div>";
  }

  /* ─────────────────────────── les papiers à bord ───────────────────────── */

  /* CE QUI DOIT SE TROUVER À BORD, ET LE CONTRÔLE QUI VA AVEC.

     Demande du 25 novembre 2026 : « les papiers que le conducteur doit avoir
     dans son camion », en trois parties (le conducteur, le véhicule, la
     marchandise), poids lourd et pas poids lourd, « de manière à ce qu'on
     puisse contrôler ça aussi ». Chaque véhicule a donc un onglet « À bord » :
     la liste propre à son genre, une case par papier, la date et l'auteur du
     dernier contrôle.

     Tout a été lu à la source le 25 novembre 2026, deux lectures concordantes
     pour chaque article du relais :
     - code de la route, R. 233-1 (LEGIARTI000053304279), R. 221-10
       (LEGIARTI000051682550), R. 323-25 (LEGIARTI000034075679), R. 323-23
       (LEGIARTI000037676165) ;
     - code des transports, R. 3411-13 (LEGIARTI000048629458), R. 3211-12
       (LEGIARTI000046177442), R. 3315-2 (LEGIARTI000044326172), R. 3315-11
       (LEGIARTI000046177527), R. 3312-58 (LEGIARTI000043651176), L. 3314-2
       (LEGIARTI000027473960) ;
     - code des assurances, R. 211-14 (LEGIARTI000048547657), qui ne vise plus
       que les véhicules non immatriculés ;
     - arrêté du 9 novembre 1999 relatif aux documents de transport ou de
       location à bord (LEGITEXT000005628727), lu en entier ;
     - règlement (UE) 165/2014, art. 36, modifié par le règlement (UE)
       2020/1054 (cinquante-six jours), art. 3, et règlement (CE) 561/2006, art. 2,
       version consolidée du 22 mai 2024, lus sur le site des publications de
       l'Union.

     Une ligne « si » ne vaut que dans un cas particulier (camion loué,
     cabotage...) : elle se coche quand elle s'applique, et ne compte jamais
     comme un manque. */
  /* L'oubli de la carte n'ouvre pas le droit de rouler au ticket : seuls la
     carte abîmée, défectueuse, perdue ou volée (art. 29 et 35) et la panne de
     l'appareil (art. 37) le permettent. Lu à la source le 26 novembre 2026,
     règlement (UE) 165/2014, version consolidée du 20 août 2020. */
  var NOTE_OUBLI = "L'oubli de la carte n'est pas un de ces cas : rouler sans pouvoir la présenter est puni de l'amende de 5e classe (code des transports, art. R. 3315-11, 3°, g).";
  function papiersBord(v) {
    var g = v.genre || "";
    var lourd = g === "pl" || g === "tracteur" || !g || g === "autre";
    var leger = g === "vl" || g === "vul";
    var personnes = g === "public10" || g === "commun";
    var G = [];
    if (g === "remorque") {
      G.push({ titre: "La remorque", L: [
        { k: "cg-rem", t: "Sa carte grise, dans le véhicule qui la tire, si elle pèse plus de 500 kg en charge, ou s'il s'agit d'une semi-remorque",
          r: "code de la route, R. 233-1, 2°" },
      ] });
      return G;
    }
    var C = [];
    if (lourd) {
      C.push({ k: "permis", t: "Le permis de conduire C ou CE, en cours de validité, papier ou numérique", r: "code de la route, R. 233-1, 1°", f: "permisFin" });
      C.push({ k: "fimo", t: "La carte de qualification de conducteur (FIMO ou FCO), ou le permis s'il porte le code 95", r: "code des transports, R. 3315-2", f: "carteQualif" });
      C.push({ k: "carte", t: "La carte conducteur du chronotachygraphe", r: "code des transports, R. 3315-11, 3°, g", f: "carteCond" });
      C.push({ k: "tickets", si: true, t: "Si sa carte a été abîmée, a mal fonctionné, a été perdue ou volée dans les 56 derniers jours : les tickets imprimés au début et à la fin de chaque trajet, portant à la main son nom, le numéro de sa carte ou de son permis, ses autres activités et ses repos, et sa signature", r: "règlement (UE) 165/2014, art. 35, 2, et art. 36" });
      C.push({ k: "remplacement", si: true, t: "Dans ce même cas : la preuve qu'il a demandé une nouvelle carte dans les 7 jours, et pour une perte ou un vol, la déclaration faite aux autorités. Sans carte, il ne peut conduire que 15 jours au plus, et seulement s'il justifie ne pas pouvoir présenter ou utiliser sa carte", r: "règlement (UE) 165/2014, art. 29, 2 à 5" });
      C.push({ k: "panne", si: true, t: "Si le chronotachygraphe est tombé en panne dans les 56 derniers jours : la feuille où il a noté son nom, le numéro de son permis ou de sa carte, ses périodes de travail et de repos, signée", r: "règlement (UE) 165/2014, art. 37, 2, et art. 36" });
      C.push({ k: "disques", si: true, t: "S'il a conduit un camion à disques dans les 56 derniers jours : ces disques", r: "règlement (UE) 165/2014, art. 36, 2, iii" });
      C.push({ k: "attest", si: true, t: "S'il n'est pas ressortissant de l'Espace économique européen et fait de l'international ou du cabotage : l'attestation de conducteur", r: "code des transports, R. 3411-13, 4°" });
    } else if (leger) {
      C.push({ k: "permis", t: "Le permis de conduire, en cours de validité, papier ou numérique", r: "code de la route, R. 233-1, 1°", f: "permisFin" });
      if (g === "vul") {
        C.push({ k: "livret", t: "Le livret individuel de contrôle, rempli chaque jour, ou l'horaire de service pour une tournée à horaire fixe avec retour chaque soir", r: "code des transports, R. 3312-58" });
        C.push({ k: "carte25", si: true, t: "Si le véhicule dépasse 2,5 t et fait de l'international ou du cabotage : la carte conducteur, ces transports relevant depuis le 1er juillet 2026 des temps de conduite européens et du tachygraphe", r: "règlement (CE) 561/2006, art. 2, 1, aa ; règlement (UE) 165/2014, art. 3" });
      }
    } else if (personnes) {
      C.push({ k: "permis", t: "Le permis de conduire de la catégorie du véhicule, en cours de validité", r: "code de la route, R. 233-1, 1°", f: "permisFin" });
      if (g === "commun") {
        C.push({ k: "fimo", t: "La carte de qualification de conducteur, ou le permis s'il porte le code 95", r: "code des transports, R. 3315-2", f: "carteQualif" });
        C.push({ k: "carte", t: "La carte conducteur du chronotachygraphe", r: "code des transports, R. 3315-11, 3°, g", f: "carteCond" });
      }
    }
    G.push({ titre: "Le conducteur", L: C, note: lourd ? NOTE_OUBLI : "" });

    var V = [{ k: "cg", t: "La carte grise du véhicule", r: "code de la route, R. 233-1, 2°" },
      { k: "cg-rem", si: true, t: "S'il tire une remorque de plus de 500 kg en charge ou une semi-remorque : la carte grise de celle-ci", r: "code de la route, R. 233-1, 2°" }];
    if (lourd || g === "commun") V.push({ k: "ct", t: "Le procès-verbal du dernier contrôle technique", r: "code de la route, R. 233-1, 7°, et R. 323-23 ou R. 323-25" });
    V.push({ k: "triangle", t: "Le triangle de présignalisation", r: "code de la route, R. 233-1, 8°" });
    V.push({ k: "gilet", t: "Le gilet de haute visibilité", r: "code de la route, R. 233-1, 9°" });
    G.push({ titre: "Le véhicule", L: V,
      note: "L'attestation d'assurance n'a plus à être à bord : le code des assurances ne l'exige que pour les véhicules sans immatriculation (R. 211-14)." +
        (leger ? " Le procès-verbal du contrôle technique n'a pas non plus à être présenté au-dessous de 3,5 t (R. 233-1, 7°)." : "") });

    if (!personnes) {
      var M = [
        { k: "licence", t: lourd ? "La copie conforme de la licence communautaire"
            : "La copie conforme de la licence de transport intérieur, ou de la licence communautaire « inférieur ou égal à 3,5 tonnes » à l'international",
          r: "code des transports, R. 3411-13, 1°, et R. 3211-12" },
        { k: "lv", t: "La lettre de voiture, sur papier ou sur téléphone, et l'état récapitulatif s'il y a plusieurs lots", r: "code des transports, R. 3411-13, 2° ; arrêté du 9 novembre 1999, art. 4 et 5" },
        { k: "loc", si: true, t: "Si le véhicule est loué : le contrat ou la feuille de location", r: "code des transports, R. 3411-13, 3° ; arrêté du 9 novembre 1999, art. 7" },
        { k: "cabotage", si: true, t: "En cabotage : la lettre de voiture du transport international et celle de chaque opération de cabotage", r: "code des transports, R. 3411-13, 5°" },
        { k: "contrat", si: true, t: "Si le véhicule, immatriculé dans un pays de l'Union, est loué dans un autre : le contrat de travail du conducteur, ou une fiche de paie de moins de trois mois", r: "code des transports, R. 3411-13, 6°" },
      ];
      G.push({ titre: "La marchandise (transport pour autrui)", L: M,
        note: "Pour un transport fait pour le compte de l'entreprise elle-même, la lettre de voiture et la licence sont remplacées par la facture, le bon d'enlèvement ou le bon de livraison (arrêté du 9 novembre 1999, art. 2)." });
    }
    return G;
  }

  var QUI_BORD = { tec: "T.E.C", lea: "le cabinet", parc: "le chef de parc" };
  function quiControle() {
    var q = "";
    try { q = window.localStorage.getItem("journal-qui") || ""; } catch (e) {}
    return QUI_BORD[q] || "";
  }
  function bordManquants(v) {
    var c = (v.bord && v.bord.c) || {}, n = 0;
    papiersBord(v).forEach(function (gr) { gr.L.forEach(function (it) { if (!it.si && !c[it.k]) n++; }); });
    return n;
  }

  function bordHtml(v) {
    var b = v.bord || {}, c = b.c || {};
    /* Sans autorisation, ni les dates du permis et des cartes, ni le nom de
       celui à qui elles appartiennent : la case seule. */
    var cache = conducteursCaches();
    var f = net(v.conducteur) && !cache ? fiche(v.conducteur) : {};
    var nomC = "";
    if (net(v.conducteur) && !cache) salaries(true).forEach(function (s) { if (s.id === v.conducteur) nomC = s.nom; });
    var n = bordManquants(v);
    var tete;
    if (b.le) {
      tete = '<div class="bord-etat ' + (n ? "mq" : "ok") + '">Dernier contrôle le ' + ech(enFrancais(b.le)) +
        (b.par ? ", par " + ech(b.par) : "") + " : " +
        (n ? n + " papier" + (n > 1 ? "s" : "") + " manquant" + (n > 1 ? "s" : "") : "tout est à bord") + "</div>";
    } else {
      tete = '<div class="bord-etat jamais">Jamais contrôlé. Cochez ce qui est à bord, puis enregistrez le contrôle.</div>';
    }
    var corps = papiersBord(v).map(function (gr) {
      var lignes = gr.L.map(function (it) {
        var date = "";
        if (it.f && net(f[it.f])) {
          var j = joursAvant(f[it.f]);
          date = '<span class="bd-date' + (j < 0 ? " passe" : (j <= 30 ? " proche" : "")) + '">' +
            (j < 0 ? "Plus valable depuis le " : "Valable jusqu'au ") + ech(enFrancais(f[it.f])) +
            (nomC ? " (" + ech(nomC) + ")" : "") + "</span>";
        }
        return '<label class="bd-l' + (it.si ? " si" : "") + '">' +
          '<input type="checkbox" data-bord="' + ech(v.id) + "|" + ech(it.k) + '"' + (c[it.k] ? " checked" : "") + ">" +
          '<span class="bd-t">' + ech(it.t) + '<span class="bd-r">' + ech(it.r) + "</span>" + date + "</span></label>";
      }).join("");
      return '<div class="bd-g"><p class="pt">' + ech(gr.titre) + "</p>" + lignes +
        (gr.note ? '<p class="doux">' + ech(gr.note) + "</p>" : "") + "</div>";
    }).join("");
    return '<div class="bord">' + tete + corps +
      '<div class="barre2"><button type="button" data-bord-ok="' + ech(v.id) + '">Enregistrer le contrôle d\'aujourd\'hui</button></div>' +
      '<div class="barre2"><button type="button" class="second" data-bord-raz="' + ech(v.id) + '">Nouveau contrôle : tout décocher</button></div>' +
      "</div>";
  }

  function brancherBord(cadre, idV) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-bord]"), function (el) {
      el.addEventListener("change", function () {
        var k = el.getAttribute("data-bord").split("|")[1];
        var T = vehicules();
        T.forEach(function (x) {
          if (x.id !== idV) return;
          x.bord = x.bord || {}; x.bord.c = x.bord.c || {};
          if (el.checked) x.bord.c[k] = true; else delete x.bord.c[k];
        });
        garderVehicules(T);
        var v = null; T.forEach(function (x) { if (x.id === idV) v = x; });
        var e = cadre.querySelector(".bord-etat");
        if (v && e && v.bord && v.bord.le) {
          var n = bordManquants(v);
          e.className = "bord-etat " + (n ? "mq" : "ok");
          e.textContent = "Dernier contrôle le " + enFrancais(v.bord.le) + (v.bord.par ? ", par " + v.bord.par : "") + " : " +
            (n ? n + " papier" + (n > 1 ? "s" : "") + " manquant" + (n > 1 ? "s" : "") : "tout est à bord");
        }
      });
    });
    var ok = cadre.querySelector("[data-bord-ok]");
    if (ok) ok.addEventListener("click", function () {
      var T = vehicules();
      T.forEach(function (x) {
        if (x.id !== idV) return;
        x.bord = x.bord || {}; x.bord.c = x.bord.c || {};
        x.bord.le = iso(new Date()); x.bord.par = quiControle();
      });
      garderVehicules(T);
      rendre();
    });
    var raz = cadre.querySelector("[data-bord-raz]");
    if (raz) raz.addEventListener("click", function () {
      if (!window.confirm("Tout décocher pour commencer un nouveau contrôle ? La date du dernier contrôle est gardée.")) return;
      var T = vehicules();
      T.forEach(function (x) { if (x.id === idV) { x.bord = x.bord || {}; x.bord.c = {}; } });
      garderVehicules(T);
      rendre();
    });
  }

  function corpsVehicule(v) {
    var tab = vtabActif[v.id] || tabParDefaut || "infos";
    var onglets = '<div class="vtabs" role="tablist">' + VTABS.map(function (t) {
      return '<button type="button" data-vtab="' + ech(v.id) + "|" + t[0] + '"' +
        (t[0] === tab ? ' aria-selected="true"' : "") + ">" + ech(t[1]) + "</button>";
    }).join("") + "</div>";
    var pan = "";
    if (tab === "infos") pan = sectionsHtml(v, "infos");
    else if (tab === "ech") pan = sectionsHtml(v, "ech");
    else if (tab === "bord") pan = bordHtml(v);
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
      : (tabParDefaut === "bord"
        ? '<p class="rappel-faire">Choisissez le camion à contrôler : sa fiche s\'ouvre sur l\'onglet À bord, la liste des papiers à cocher.</p>'
        : "");
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
        function (c, val, avant, o) {
          function garderO() {
            var T = vehicules();
            garderVehicules(T.map(function (x) { return x.id === o.id ? o : x; }));
          }
          if (c === "conducteur" && !lierVehiculeConducteur(v.id, val, avant)) {
            /* Retrait refusé : le camion garde son chauffeur. */
            o.conducteur = avant || "";
            garderO();
          }
          /* LA PÉRIODICITÉ DU CONTRÔLE TECHNIQUE SUIT LE GENRE (27 novembre
             2026). Un véhicule ajouté à la main naissait poids lourd, douze
             mois, et le restait devenu utilitaire léger. Quand le genre
             change, la périodicité prend celle du nouveau genre (CT_DEFAUT),
             sauf si l'utilisateur l'a saisie lui-même. Une valeur égale au
             défaut de l'ancien genre est celle que l'application avait posée. */
          if (c === "ctMois") { o.ctMoisSaisi = !!net(val); garderO(); }
          if (c === "genre") {
            var defAvant = CT_DEFAUT[avant] || 12;
            if (!o.ctMoisSaisi && (!net(o.ctMois) || parseInt(o.ctMois, 10) === defAvant)) {
              o.ctMois = CT_DEFAUT[val] || 12;
              garderO();
            }
          }
        });
      Array.prototype.forEach.call(cadre.querySelectorAll("details.sec[data-sec]"), function (d) {
        d.addEventListener("toggle", function () { secOuverte[d.getAttribute("data-sec")] = d.open; });
      });
      Array.prototype.forEach.call(cadre.querySelectorAll("[data-auj]"), function (bt) {
        bt.addEventListener("click", function () {
          var c = bt.getAttribute("data-auj").split("|")[1];
          var T = vehicules();
          T.forEach(function (x) { if (x.id === v.id) x[c] = iso(new Date()); });
          garderVehicules(T);
          rendre();
        });
      });
      brancherPieces(cadre, v.id);
      brancherPhoto(cadre, v.id);
      brancherInterventions(cadre, v.id);
      brancherBord(cadre, v.id);
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
  /* LES PAPIERS PERSONNELS DU CHAUFFEUR, SELON SON PROFIL.

     Demande du 25 novembre 2026 : en tête de la fiche du chauffeur, « poids
     lourd » ou « pas poids lourd », et la liste de ses papiers s'ouvre
     aussitôt, à cocher, avec la date du contrôle. Le profil se déduit des
     catégories du permis quand elles sont saisies (C, C1, CE, C1E), et se
     change d'un geste. Les fondements sont ceux de l'onglet « À bord », lus à
     la source le même jour : R. 233-1 du code de la route ; R. 3315-2,
     R. 3315-11, R. 3411-13 et R. 3312-58 du code des transports ; règlement
     (UE) 165/2014, art. 3 et 36 ; règlement (CE) 561/2006, art. 2. */
  /* Le profil, poids lourd ou pas, est celui que le salarié a choisi dans sa
     fiche (question remise le 26 novembre 2026, à la demande de
     l'utilisatrice). Sans réponse, les catégories le donnent. */
  function profilChauffeur(f) {
    if (f.profil === "pl" || f.profil === "leger") return f.profil;
    var cat = net(f.permisCat).toUpperCase();
    if (!cat) return "";
    return /(^|[^A-Z0-9])C1?E?([^A-Z0-9]|$)/.test(cat) ? "pl" : "leger";
  }
  function finFco(f) {
    if (net(f.carteQualif)) return f.carteQualif;
    return derForm(f) ? plusMois(derForm(f), f.fcoMois || 60) : "";
  }
  function papiersChauffeur(profil, f) {
    if (profil === "pl") return [
      { k: "permis", t: "Le permis de conduire C ou CE, en cours de validité, papier ou numérique", r: "code de la route, R. 233-1, 1°", d: f.permisFin },
      { k: "fimo", t: "La carte de qualification de conducteur (FIMO ou FCO), ou le permis s'il porte le code 95", r: "code des transports, R. 3315-2", d: finFco(f) },
      { k: "carte", t: "La carte conducteur du chronotachygraphe", r: "code des transports, R. 3315-11, 3°, g", d: f.carteCond },
      { k: "tickets", si: true, t: "Si sa carte a été abîmée, a mal fonctionné, a été perdue ou volée dans les 56 derniers jours : les tickets imprimés au début et à la fin de chaque trajet, portant à la main son nom, le numéro de sa carte ou de son permis, ses autres activités et ses repos, et sa signature", r: "règlement (UE) 165/2014, art. 35, 2, et art. 36" },
      { k: "remplacement", si: true, t: "Dans ce même cas : la preuve qu'il a demandé une nouvelle carte dans les 7 jours, et pour une perte ou un vol, la déclaration faite aux autorités. Sans carte, il ne peut conduire que 15 jours au plus, et seulement s'il justifie ne pas pouvoir présenter ou utiliser sa carte", r: "règlement (UE) 165/2014, art. 29, 2 à 5" },
      { k: "panne", si: true, t: "Si le chronotachygraphe est tombé en panne dans les 56 derniers jours : la feuille où il a noté son nom, le numéro de son permis ou de sa carte, ses périodes de travail et de repos, signée", r: "règlement (UE) 165/2014, art. 37, 2, et art. 36" },
      { k: "disques", si: true, t: "S'il a conduit un camion à disques dans les 56 derniers jours : ces disques", r: "règlement (UE) 165/2014, art. 36, 2, iii" },
      { k: "attest", si: true, t: "S'il n'est pas ressortissant de l'Espace économique européen et fait de l'international ou du cabotage : l'attestation de conducteur", r: "code des transports, R. 3411-13, 4°" },
    ];
    return [
      { k: "permis", t: "Le permis de conduire B, en cours de validité, papier ou numérique", r: "code de la route, R. 233-1, 1°", d: f.permisFin },
      { k: "livret", t: "Le livret individuel de contrôle, rempli chaque jour, ou l'horaire de service pour une tournée à horaire fixe avec retour chaque soir", r: "code des transports, R. 3312-58" },
      { k: "carte25", si: true, t: "Si le véhicule dépasse 2,5 t et fait de l'international ou du cabotage : la carte conducteur du chronotachygraphe", r: "règlement (CE) 561/2006, art. 2, 1, aa ; règlement (UE) 165/2014, art. 3" },
    ];
  }
  function papiersEtat(P, c) {
    var n = 0; P.forEach(function (it) { if (!it.si && !c[it.k]) n++; });
    return n;
  }
  function papiersTexte(p, n) {
    return "Dernier contrôle le " + enFrancais(p.le) + (p.par ? ", par " + p.par : "") + " : " +
      (n ? n + " papier" + (n > 1 ? "s" : "") + " manquant" + (n > 1 ? "s" : "") : "il a tout sur lui");
  }

  function papiersChauffeurHtml(s, f) {
    var profil = profilChauffeur(f);
    if (!profil) {
      return '<div class="pap"><p class="doux">Choisissez plus haut s\'il est poids lourd ou pas : la liste de ses papiers s\'affiche aussitôt.</p></div>';
    }
    var P = papiersChauffeur(profil, f), p = f.papiers || {}, c = p.c || {};
    var nb = P.filter(function (it) { return !it.si; }).length;
    var n = papiersEtat(P, c);
    var tete = p.le
      ? '<div class="bord-etat ' + (n ? "mq" : "ok") + '">' + ech(papiersTexte(p, n)) + "</div>"
      : '<div class="bord-etat jamais">Jamais contrôlé. Cochez ce qu\'il a sur lui, puis enregistrez le contrôle.</div>';
    var lignes = P.map(function (it) {
      var date = "";
      return '<label class="bd-l' + (it.si ? " si" : "") + '">' +
        '<input type="checkbox" data-pap="' + ech(s.id) + "|" + ech(it.k) + '"' + (c[it.k] ? " checked" : "") + ">" +
        '<span class="bd-t">' + ech(it.t) + '<span class="bd-r">' + ech(it.r) + "</span>" + date + "</span></label>";
    }).join("");
    return '<div class="pap">' +
      '<p class="pf-nb">' + nb + " documents à avoir sur lui" + "</p>" + tete +
      '<div class="bd-g">' + lignes + (profil === "pl" ? '<p class="doux">' + ech(NOTE_OUBLI) + "</p>" : "") + "</div>" +
      '<div class="barre2"><button type="button" data-pap-ok="' + ech(s.id) + '">Enregistrer le contrôle d\'aujourd\'hui</button></div>' +
      '<div class="barre2"><button type="button" class="second" data-pap-raz="' + ech(s.id) + '">Nouveau contrôle : tout décocher</button></div>' +
      "</div>";
  }

  function brancherPapiers(cadre, sid) {
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-profil]"), function (b) {
      b.addEventListener("click", function () {
        var f = fiche(sid); f.profil = b.getAttribute("data-profil").split("|")[1];
        garderFiche(sid, f); rendre();
      });
    });
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-pap]"), function (el) {
      el.addEventListener("change", function () {
        var k = el.getAttribute("data-pap").split("|")[1];
        var f = fiche(sid); f.papiers = f.papiers || {}; f.papiers.c = f.papiers.c || {};
        if (el.checked) f.papiers.c[k] = true; else delete f.papiers.c[k];
        garderFiche(sid, f);
        var e = cadre.querySelector(".pap .bord-etat");
        if (e && f.papiers.le) {
          var n = papiersEtat(papiersChauffeur(profilChauffeur(f), f), f.papiers.c);
          e.className = "bord-etat " + (n ? "mq" : "ok");
          e.textContent = papiersTexte(f.papiers, n);
        }
      });
    });
    var ok = cadre.querySelector("[data-pap-ok]");
    if (ok) ok.addEventListener("click", function () {
      var f = fiche(sid); f.papiers = f.papiers || {}; f.papiers.c = f.papiers.c || {};
      f.papiers.le = iso(new Date()); f.papiers.par = quiControle();
      garderFiche(sid, f); rendre();
    });
    var raz = cadre.querySelector("[data-pap-raz]");
    if (raz) raz.addEventListener("click", function () {
      if (!window.confirm("Tout décocher pour commencer un nouveau contrôle ? La date du dernier contrôle est gardée.")) return;
      var f = fiche(sid); f.papiers = f.papiers || {}; f.papiers.c = {};
      garderFiche(sid, f); rendre();
    });
  }

  /* LA VALIDATION (26 novembre 2026). Une fiche arrivée est orange tant que
     T.E.C ou le cabinet ne l'a pas validée ; validée, elle passe au vert. Une
     mise à jour dit ce qu'elle a changé, ancienne valeur et nouvelle. */
  function etatFiche(f) {
    if (!f || !f.recue) return "rouge";
    return f.validee && f.validee.id === f.recue.id ? "vert" : "orange";
  }
  function libDe(k) { var l = k; CHAMPS_C.forEach(function (c) { if (c.c === k) l = c.lib; }); return k === "profil" ? "Profil" : l; }
  function valLisible(k, v) {
    if (v == null || v === "") return "vide";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return enFrancais(v);
    if (k === "profil") return v === "pl" ? "poids lourd" : "pas poids lourd";
    if (k === "permisOrigine") return v === "etr" ? "hors Union européenne" : (v === "ue" ? "Union européenne ou EEE" : "en France");
    if (k === "sexe") return v === "F" ? "femme" : (v === "M" ? "homme" : v);
    return v;
  }
  function validationHtml(s, f) {
    var e = etatFiche(f);
    if (e === "vert") return '<p class="fp-ok"><i class="fr-pt"></i>Fiche validée le ' + ech(enFrancais(f.validee.le)) +
      (f.validee.par ? " par " + ech(f.validee.par) : "") + ".</p>";
    var maj = f.maj && f.maj.id === f.recue.id ? f.maj : null, h = '<div class="fp-av"><p><i class="fr-pt"></i><b>' +
      (maj ? "Mise à jour du " : "Nouvelle fiche du ") + ech(enFrancais(f.recue.le)) + "</b>, à vérifier.</p>";
    if (maj) {
      var L = (maj.changes || []).map(function (c) {
        return "<li>" + ech(libDe(c.k)) + " : " + ech(valLisible(c.k, c.avant)) + " → <b>" + ech(valLisible(c.k, c.apres)) + "</b></li>";
      }).concat((maj.ajouts || []).map(function (k) {
        return "<li>" + ech(libDe(k)) + " : complété, <b>" + ech(valLisible(k, f[k])) + "</b></li>";
      }));
      h += L.length ? "<ul>" + L.join("") + "</ul>" : "<p>Rien n'a changé par rapport à la fiche précédente.</p>";
    }
    return h + '<button type="button" class="fp-valider" data-valider="' + ech(s.id) + '">Valider la fiche</button></div>';
  }
  var CONDUIT = /chauffeur|conducteur|livreur|convoyeur|routier/i;

  /* SA FICHE, NETTOYÉE (26 novembre 2026). « Nettoie-moi tout ça,
     harmonise, fais quelque chose de propre. » Ce que le salarié a rempli,
     en quatre cadres : son permis, ses cartes, ce qu'il doit avoir sur lui,
     ses coordonnées. Chaque donnée n'est plus qu'à un endroit : les visites
     médicales, les points et retraits, le camion sont dans son dossier ; le
     téléchargement de la carte au suivi tachygraphe ; les dates d'échéance
     dans ses échéances, sur sa page. */
  var CATS = ["B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE", "A1", "A2", "A"];
  var PL_REG = /(^|[^a-z])(pl|spl|poids lourds?|super ?lourds?)([^a-z]|$)/i;
  function cadreFiche(titre, corps) {
    return '<div class="fn-cadre"><h3 class="fn-t">' + ech(titre) + "</h3>" + corps + "</div>";
  }
  function champsDe(s, f, cles) {
    var C = {};
    CHAMPS_C.forEach(function (c) { C[c.c] = c; });
    return '<div class="gr">' + cles.filter(function (k) { return C[k]; }).map(function (k) {
      var val = f[k];
      if ((val == null || val === "") && k === "fcoMois") val = 60;
      return champHtml(C[k], val, "c" + s.id);
    }).join("") + "</div>";
  }
  function categoriesDe(f) {
    var on = {};
    net(f.permisCat).toUpperCase().split(/[^A-Z0-9]+/).forEach(function (x) { if (x) on[x] = 1; });
    return on;
  }
  function categoriesHtml(s, f) {
    var on = categoriesDe(f);
    return '<p class="fn-l">Catégories</p><div class="fn-cats" role="group" aria-label="Catégories du permis">' +
      CATS.map(function (c) {
        return '<button type="button" data-cat="' + ech(s.id) + "|" + c + '"' + (on[c] ? ' aria-pressed="true"' : "") + ">" + c + "</button>";
      }).join("") + "</div>";
  }
  /* DANS L'ORDRE DU QUESTIONNAIRE (26 novembre 2026). « Il faut être
     cohérent [...] ne coupe pas les informations », et la fiche doit être
     aussi fournie que le questionnaire envoyé par WhatsApp. Elle en reprend
     donc chaque question, dans le même ordre : ses coordonnées, son profil,
     sa nationalité, son permis, ses cartes, ses photos et sa signature. Ce
     qui n'est pas de lui vient après : le contrôle de ce qu'il a sur lui, et
     les observations de T.E.C. */
  function ficheNette(s, f, conduit) {
    var h = f.recue && f.recue.le ? validationHtml(s, f)
      : '<p class="fn-rien">Il n\'a pas encore rempli sa fiche.</p>';
    /* Comme dans le questionnaire, la première question : roulant ou non.
       Tant que personne n'a répondu, la case montre ce que dit le registre
       du personnel (« conduit »), sans l'enregistrer : elle ne s'écrit que si
       quelqu'un la change. Relevé le 27 novembre 2026 : elle disait « à
       préciser » pour un chauffeur que le registre classe roulant. */
    var caseRoulant = champsDe(s, f, ["roulant"]);
    if (!net(f.roulant)) {
      /* Le choix vide prend le libellé du registre ; Oui ou Non l'enregistre. */
      var chR = {};
      CHAMPS_C.forEach(function (c) { if (c.c === "roulant") Object.keys(c).forEach(function (k) { chR[k] = c[k]; }); });
      chR.opts = [["", "D'après le registre : " + (conduit ? "roulant" : "non roulant")]].concat(OUI_NON.slice(1));
      caseRoulant = '<div class="gr">' + champHtml(chR, "", "c" + s.id).replace(/<\/label>$/,
        '<small class="aide selon-reg">Déduit de l\'emploi écrit au registre du personnel. ' +
        "Choisissez Oui ou Non pour l'enregistrer.</small></label>") + "</div>";
    }
    h += cadreFiche("Roulant ou non roulant", caseRoulant);
    /* Nom et prénom, comme en tête du questionnaire : ceux du registre du
       personnel, d'où vient le salarié. Ils se corrigent au registre. */
    var r = null;
    ((lire(CLE_REG, {}) || {}).salaries || []).forEach(function (x) {
      if (sansAccent((net(x.nom) + " " + net(x.pre)).trim()) === s.id) r = x;
    });
    var lu = function (l, v) { return '<div class="fn-lu"><span>' + ech(l) + "</span><b>" + ech(v || "-") + "</b></div>"; };
    h += cadreFiche("Ses coordonnées", lu("Nom", r ? net(r.nom) : s.nom) + lu("Prénoms", r ? net(r.pre) : "") +
      champsDe(s, f, ["sexe", "nais", "naisLieu", "adresse", "tel", "courriel", "nir", "visiteTravail"]));
    var prof = profilChauffeur(f);
    if (conduit) {
      h += cadreFiche("Son profil", '<div class="pf-choix" role="group" aria-label="Profil du chauffeur">' +
        '<button type="button" data-profil="' + ech(s.id) + '|pl"' + (prof === "pl" ? ' aria-pressed="true"' : "") + ">Poids lourd<small>permis C1, C1E, C ou CE</small></button>" +
        '<button type="button" data-profil="' + ech(s.id) + '|leger"' + (prof === "leger" ? ' aria-pressed="true"' : "") + ">Pas poids lourd<small>permis B</small></button></div>");
    }
    var na = ["nat", "ue"];
    if (f.ue === "non") {
      na.push("titreType", "titreNum", "titreFin");
      if (conduit) na.push("inter");
    }
    h += cadreFiche("Nationalité", champsDe(s, f, na));
    if (conduit) {
      var sansC = net(f.permisCat) && !/(^|[^A-Z0-9])C1?E?([^A-Z0-9]|$)/.test(net(f.permisCat).toUpperCase());
      var alerte = sansC && (prof === "pl" || PL_REG.test(s.emp || ""))
        ? '<p class="fn-al">' + (prof === "pl" ? "Poids lourd selon sa fiche" : ech(s.emp) + " au registre") +
          ", mais ses catégories ne portent ni C ni CE.</p>" : "";
      /* Le permis délivré hors Union européenne, quelle que soit la
         nationalité (code de la route, R. 222-3), et le retrait déclaré. */
      var pe = ["permisFin", "points", "permisOrigine"];
      if (f.permisOrigine === "etr" || net(f.permisPays)) pe.push("permisPays", "arrivee", "permisEchange");
      pe.push("suspendu");
      if (f.suspendu === "oui" || net(f.retraitLe)) pe.push("retraitLe", "retraitFin", "retraitMotif");
      h += cadreFiche("Son permis", champsDe(s, f, ["permisNum"]) + '<div style="height:12px"></div>' +
        categoriesHtml(s, f) + alerte + champsDe(s, f, pe));
      /* Une date de poids lourd déjà connue reste visible, même quand le
         profil dit le contraire : on ne cache pas ce qu'il a déclaré. */
      var plConnu = ["visitePermisFin", "fimo", "fco", "carteQualif"].some(function (k) { return net(f[k]); });
      if (prof !== "leger" || plConnu)
        h += cadreFiche("Poids lourd", champsDe(s, f, ["visitePermisFin", "fimo", "fco", "code95", "carteQualif", "carteNum", "carteCond", "telecCarte"]));
      if (prof === "leger")
        h += cadreFiche("Pas poids lourd", champsDe(s, f, ["livret", "aCarte"]
          .concat(!plConnu && (f.aCarte === "oui" || net(f.carteCond)) ? ["carteNum", "carteCond", "telecCarte"] : [])));
    }
    h += cadreFiche("Ses photos et sa signature", '<div class="fn-photos" data-photos="' + ech(s.id) + '"><p class="fn-rien">Recherche...</p></div>');
    h += cadreFiche("Sa signature", '<div data-signature="' + ech(s.id) + '"><p class="fn-rien">Recherche...</p></div>');
    if (conduit) h += '<p class="fn-sep">Contrôle par T.E.C</p>' + cadreFiche("Ce qu'il doit avoir sur lui", papiersChauffeurHtml(s, f));
    h += '<div class="fn-obs">' + cadreFiche("Observations de T.E.C", champsDe(s, f, ["note"])) + "</div>";
    return h;
  }
  /* LA PIÈCE EN GRAND (27 novembre 2026). Toucher une vignette ouvrait son
     coffre fort, où l'aperçu coupait la pièce. Elle s'ouvre désormais par-dessus
     la page, le bouton « Fermer » en haut, et défile en entier. */
  var VOILE = null;
  function fermerGrand() {
    if (!VOILE) return;
    var u = VOILE.getAttribute("data-url");
    if (u) try { URL.revokeObjectURL(u); } catch (e) {}
    VOILE.remove(); VOILE = null;
    document.documentElement.style.overflow = "";
  }
  function ouvrirGrand(id) {
    if (!window.Documents) return;
    window.Documents.lire(id).then(function (d) {
      if (!d || !d.contenu) return;
      fermerGrand();
      var b = d.contenu instanceof Blob ? d.contenu : new Blob([d.contenu], { type: d.type || "" });
      var u = URL.createObjectURL(b), nom = String(d.nom || "").replace(/\.(jpe?g|png)$/i, "");
      VOILE = document.createElement("div");
      VOILE.className = "pe-voile";
      VOILE.setAttribute("role", "dialog");
      VOILE.setAttribute("aria-label", nom);
      VOILE.setAttribute("data-url", u);
      VOILE.innerHTML = '<div class="pe-tete"><button type="button">&larr; Fermer</button><b>' + ech(nom) + "</b></div>" +
        '<div class="pe-corps"><img alt="' + ech(nom) + '" src="' + u + '"></div>';
      VOILE.querySelector("button").addEventListener("click", fermerGrand);
      document.body.appendChild(VOILE);
      document.documentElement.style.overflow = "hidden";
    });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermerGrand(); });
  /* SES PHOTOS ET SA SIGNATURE : les images rangées dans son coffre fort par
     sa fiche, en vignettes. Une vignette ouvre la pièce en grand. */
  function remplirPhotos(hote, sid) {
    var z = hote.querySelector("[data-photos]"), zs = hote.querySelector("[data-signature]");
    if (!z) return;
    var vers = "mes-documents.html?r=" + encodeURIComponent("salarie-" + sid);
    if (!window.Documents) {
      z.innerHTML = '<p class="fn-rien">Les documents ne sont pas disponibles sur cet appareil.</p>';
      if (zs) zs.innerHTML = "";
      return;
    }
    window.Documents.liste("salarie-" + sid).then(function (L) {
      L = L.filter(function (d) { return /^image\//.test(d.type || ""); });
      /* SA SIGNATURE : le bas de sa dernière fiche signée, là où elle est
         dessinée sous la phrase « Je certifie que ces informations sont
         exactes ». Une fiche remplacée ne compte pas. */
      if (zs) {
        var sig = L.filter(function (d) {
          var n = String(d.nom || ""); return /fiche (chauffeur|du gérant) signée/i.test(n) && n.indexOf("remplacée") < 0;
        })[0];
        var fs = fiche(sid), le = fs.recue && fs.recue.le ? fs.recue.le : "";
        zs.innerHTML = sig
          ? '<button type="button" class="fn-sign" data-grand="' + ech(sig.id) + '" aria-label="Voir sa fiche signée en entier"><img alt="" data-img="' + ech(sig.id) + '"></button>' +
            '<p class="fn-sign-dit">' + (le ? "Fiche remplie et signée le " + ech(enFrancais(le)) + ". " : "") + "Touchez la signature pour voir la fiche signée en entier.</p>"
          : '<p class="fn-rien">Pas de fiche signée pour l\'instant.</p>';
      }
      if (!L.length) { z.innerHTML = '<p class="fn-rien">Aucune photo pour l\'instant.</p>'; }
      else z.innerHTML = '<div class="fn-vigs">' + L.map(function (d) {
        return '<a class="fn-vig" href="' + vers + '" data-grand="' + ech(d.id) + '"><img alt="" data-img="' + ech(d.id) + '"><span>' +
          ech(String(d.nom || "").replace(/\s*\([^)]*\)\s*\.(jpe?g|png)$/i, "").replace(/\.(jpe?g|png)$/i, "")) + "</span></a>";
      }).join("") + "</div>";
      [z, zs].forEach(function (q) {
        if (!q) return;
        Array.prototype.forEach.call(q.querySelectorAll("[data-img]"), function (im) {
          window.Documents.lire(im.getAttribute("data-img")).then(function (d) {
            if (d && d.contenu) im.src = URL.createObjectURL(d.contenu instanceof Blob ? d.contenu : new Blob([d.contenu], { type: d.type || "" }));
          });
        });
        Array.prototype.forEach.call(q.querySelectorAll("[data-grand]"), function (a) {
          a.addEventListener("click", function (e) { e.preventDefault(); ouvrirGrand(a.getAttribute("data-grand")); });
        });
      });
    }, function () {
      z.innerHTML = '<p class="fn-rien">Les photos n\'ont pas pu être lues.</p>';
      if (zs) zs.innerHTML = "";
    });
  }
  /* LES VOLETS DE SON DOSSIER, tenus par T.E.C. */
  function partieDossier(s, f, partie, conduit) {
    if (partie === "permis") return champsDe(s, f, ["points", "retraitLe", "retraitFin", "retraitMotif", "fcoMois"]);
    if (partie === "medical") return champsDe(s, f, ["suivi", "visiteTravail"]
      .concat(f.suivi === "sir" ? ["visiteInter"] : []).concat(["attestConduite"]));
    if (partie === "camion") {
      var L = vehicules().filter(function (v) { return v.conducteur === s.id || v.id === f.vehicule; });
      return champsDe(s, f, ["vehicule"]) + (L.length ? L.map(function (v) {
        return '<a class="fn-camion" href="flotte.html?immat=' + encodeURIComponent(net(v.immat)) + '"><b>' +
          ech(v.immat || "sans immatriculation") + "</b><span>" +
          ech([GENRE_LIB[v.genre] || "", net(v.marque)].filter(Boolean).join(" · ") || "ouvrir la fiche du camion") + "</span></a>";
      }).join("") : '<p class="fn-rien">Aucun camion ne lui est attribué. Choisissez-le dans la liste ci-dessus.</p>');
    }
    return "";
  }
  function corpsConducteur(s, f, conduit) {
    return ficheNette(s, f, conduit) +
      '<div class="actions"><button type="button" class="second" data-raz-fiche="' + ech(s.id) + '">Remettre la fiche à zéro</button></div>';
  }
  function brancherConducteur(cadre, s) {
    brancher(cadre, "c" + s.id,
      function () { return fiche(s.id); },
      function (o) { garderFiche(s.id, o); },
      function (c, val, avant, o) {
        if (c === "vehicule" && !lierConducteurVehicule(s.id, val, avant)) {
          /* Retrait refusé : la fiche garde son camion d'avant. */
          o.vehicule = avant || "";
          garderFiche(s.id, o);
        }
      });
    brancherPapiers(cadre, s.id);
    Array.prototype.forEach.call(cadre.querySelectorAll("[data-cat]"), function (b) {
      b.addEventListener("click", function () {
        var c = b.getAttribute("data-cat").split("|")[1], f = fiche(s.id), on = categoriesDe(f);
        if (on[c]) delete on[c]; else on[c] = 1;
        f.permisCat = CATS.filter(function (x) { return on[x]; }).join(", ");
        garderFiche(s.id, f); rendre();
      });
    });
    /* REMETTRE LA FICHE À ZÉRO (26 novembre 2026) : pour une fiche d'essai
       ou une fiche à refaire. Toutes les cases, les deux parties, le
       contrôle des papiers, et les pièces rangées depuis sa fiche
       (photos, fiche signée). Double confirmation : cela ne se rattrape pas. */
    var bz = cadre.querySelector("[data-raz-fiche]");
    if (bz) bz.addEventListener("click", function () {
      if (!confirmerDur("Remettre à zéro la fiche de " + s.nom + " ? Toutes ses cases seront vidées, celles du salarié " +
        "comme celles de T.E.C, ainsi que ses photos et sa fiche signée, et son camion lui sera retiré. " +
        "Cette action ne se rattrape pas.", "ZERO")) return;
      /* Le camion se libère avec la fiche (27 novembre 2026) : il restait au
         nom du salarié, la case disait « aucun » et le camion s'affichait
         dessous. */
      var Tz = vehicules(), libere = false;
      Tz.forEach(function (x) { if (x.conducteur === s.id) { x.conducteur = ""; libere = true; } });
      if (libere) garderVehicules(Tz);
      garderFiche(s.id, {});
      try {
        var R = JSON.parse(window.localStorage.getItem("fiches-rangees") || "[]");
        garder("fiches-rangees", R.filter(function (x) { return x.sid !== s.id; }));
      } catch (e) {}
      var fin = function () { rendre(); };
      if (window.Documents && window.Documents.vider) window.Documents.vider("salarie-" + s.id).then(fin, fin); else fin();
    });
    var bv = cadre.querySelector("[data-valider]");
    if (bv) bv.addEventListener("click", function () {
      var fv = fiche(s.id); if (!fv.recue) return;
      fv.validee = { id: fv.recue.id, le: iso(new Date()), par: quiControle() };
      delete fv.maj;
      garderFiche(s.id, fv); rendre();
    });
  }

  /* LA FICHE DANS LA PAGE « LES SALARIÉS » (26 novembre 2026).
     « Il faut harmoniser et ne pas avoir plusieurs fiches inutiles, pas de
     doublons. » La fiche d'un salarié n'existe plus qu'à un endroit : sa page.
     Cette fonction l'y dessine ; chaque enregistrement la redessine sur place. */
  var EMBARQUE = null;
  function rendreEmbarque() {
    var E = EMBARQUE, hote = E.hote;
    var s = null;
    salaries(true).forEach(function (x) { if (x.id === E.sid) s = x; });
    if (!s) { hote.innerHTML = '<p class="doux">Ce salarié n\'est pas au registre du personnel.</p>'; return; }
    var f = fiche(s.id);
    hote.innerHTML = '<div class="fiche-s" data-c="' + ech(s.id) + '">' +
      (E.partie === "fiche" ? corpsConducteur(s, f, E.conduit)
        : '<div class="fn-cadre">' + partieDossier(s, f, E.partie, E.conduit) + "</div>" +
          (E.partie === "medical" ? '<a class="fn-camion" href="visites.html"><b>Courriers du suivi médical</b><span>demande au service de santé au travail, convocation du salarié</span></a>' : "")) + "</div>";
    brancherConducteur(hote.querySelector("[data-c]"), s);
    remplirPhotos(hote, s.id);
    if (E.apres) try { E.apres(); } catch (e) {}
  }

  function rendreConducteurs() {
    var G = salaries().filter(function (s) { return !s.sor; });
    G = G.filter(function (s) { return CONDUIT.test(s.emp); })
      .concat(G.filter(function (s) { return !CONDUIT.test(s.emp); }));
    var hote = $("conducteurs");
    /* Caché au chef de parc sans autorisation : rien ne s'écrit dans la page,
       pas même dans un onglet masqué. */
    if (conducteursCaches()) { hote.innerHTML = ""; $("con-vide").hidden = true; return; }
    $("con-vide").hidden = !!G.length;
    if (!G.length) { hote.innerHTML = ""; return; }
    hote.innerHTML = G.map(function (s) {
      var f = fiche(s.id), E = echeancesConducteur(f), p = pire(E);
      var est = !!ouvert["c" + s.id];
      var sous = [s.emp, f.permisCat ? "permis " + f.permisCat : "",
        CONDUIT.test(s.emp) ? "" : "sédentaire : visites médicales"].filter(Boolean).join(" · ");
      return '<div class="carte-v' + (p === "passe" ? " urgent" : "") + '" data-c="' + ech(s.id) + '">' +
        '<div class="tt" data-plier="c' + ech(s.id) + '">' +
        '<span class="nom">' + (CONDUIT.test(s.emp) ? '<i class="fr-pt fr-' + etatFiche(f) + '" title="' +
          ({ rouge: "fiche pas encore remplie", orange: "fiche à vérifier", vert: "fiche validée" })[etatFiche(f)] + '"></i>' : "") + ech(s.nom) +
        '<span class="sous">' + ech(sous || "à compléter") + "</span></span>" +
        '<span class="fl">' + (est ? "&#8963;" : "&#8964;") + "</span></div>" +
        '<div class="ech">' + pastilles(E) + "</div>" +
        (est ? '<div class="corps">' + corpsConducteur(s, f, CONDUIT.test(s.emp)) + "</div>" : "") +
        "</div>";
    }).join("");

    G.forEach(function (s) {
      var cadre = hote.querySelector('[data-c="' + s.id + '"]');
      if (!cadre || !ouvert["c" + s.id]) return;
      brancherConducteur(cadre, s);
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
    if (EMBARQUE) { rendreEmbarque(); return; }
    if (!$("compte")) return;
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
    /* LA LIGNE D'EN-TÊTE N'EST PAS UN VÉHICULE (27 novembre 2026). Un
       classeur à six véhicules annonçait « 7 lignes » : son en-tête était
       compté. Une première ligne sans aucune immatriculation, au-dessus de
       lignes qui en portent, est un en-tête : elle est écartée. */
    var entete = false;
    if (LU.length > 1 && !LU[0].some(function (c) { return IMMAT.test(net(c)); }) &&
      LU.slice(1).some(function (l) { return l.some(function (c) { return IMMAT.test(net(c)); }); })) {
      LU = LU.slice(1);
      entete = true;
    }
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
      " lue" + (LU.length > 1 ? "s" : "") + (entete ? ", sans la ligne d'en-tête" : "") +
      ". Les quatre premières sont montrées ; " +
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

    /* Sans autorisation, le chef de parc reçoit le classeur de la flotte
       seule : ni feuille « Conducteurs », ni échéance d'un conducteur dans
       « À surveiller » (27 novembre 2026). */
    var cache = conducteursCaches();
    var C = [["Conducteur", "Emploi", "Permis", "Catégories", "Validité du permis", "Points",
      "Suspension jusqu'au", "Dernière FCO", "Prochaine FCO", "Carte conducteur",
      "Carte de qualification", "Visite du permis", "Attestation de conduite", "Suivi médical",
      "Dernière visite", "Prochaine visite", "Véhicule", "Observations"]];
    var parId = {};
    vehicules().forEach(function (v) { parId[v.id] = v.immat || ""; });
    if (!cache) salaries().forEach(function (s) {
      var f = fiche(s.id), suivi = "";
      SUIVIS.forEach(function (o) { if (o[0] === f.suivi) suivi = o[1]; });
      var prochaine = "";
      if (f.suivi === "vip" && f.visiteTravail) prochaine = plusMois(f.visiteTravail, 60);
      if (f.suivi === "sir" && f.visiteTravail) prochaine = plusMois(f.visiteTravail, 48);
      C.push([
        s.nom, s.emp, f.permisNum || "", f.permisCat || "", dateExcel(f.permisFin),
        f.points == null ? "" : f.points, dateExcel(f.retraitFin), dateExcel(derForm(f)),
        dateExcel(derForm(f) ? plusMois(derForm(f), f.fcoMois || 60) : ""),
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
    if (!cache) salaries().forEach(function (s) {
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

    var nom = (cache ? "flotte-" : "flotte-et-conducteurs-") + iso(new Date()) + ".xlsx";
    var feuilles = [{ titre: "Véhicules", lignes: V }];
    if (!cache) feuilles.push({ titre: "Conducteurs", lignes: C });
    window.TableurExport.telecharger(window.TableurExport.xlsx(feuilles.concat([
      { titre: "À surveiller", lignes: alertes, largeurs: [28, 30, 22, 26] },
      { titre: "Entretien", lignes: INT, largeurs: [16, 12, 12, 36, 24, 8, 12, 14, 12, 14, 14] },
      { titre: "Mode d'emploi", lignes: [
        [cache ? "Flotte" : "Flotte et conducteurs"],
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
    ])), nom);
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
    /* Le chef de parc sans autorisation ne reçoit que les véhicules : c'est
       par ici que le tableau de bord du parc nommait permis et cartes. */
    if (!conducteursCaches()) salaries().forEach(function (s) {
      echeancesConducteur(fiche(s.id)).forEach(function (e) {
        if (!e.date) return;
        out.push({ quoi: e.quoi, qui: s.nom, date: e.date, etat: e.etat, jours: e.jours, fond: e.fond });
      });
    });
    return out;
  }
  /* « rendre » : le module des fiches reçues redessine la liste quand il
     vient de ranger une fiche, sans recharger la page. */
  window.Flotte = { echeances: toutesEcheances, rendre: function () { try { rendre(); } catch (e) {} },
    /* La fiche d'un salarié, dessinée dans sa page. « apres » est appelé à
       chaque nouveau dessin, pour que la page remette à jour ce qui en dépend. */
    ficheSalarie: function (hote, sid, conduit, apres, partie) {
      EMBARQUE = hote ? { hote: hote, sid: sid, conduit: conduit !== false, apres: apres, partie: partie || "fiche" } : null;
      if (EMBARQUE) rendreEmbarque();
    },
    etatFiche: function (sid) { return etatFiche(fiche(sid)); },
    conducteursCaches: conducteursCaches };

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
        if (v && v.conducteur) lierVehiculeConducteur(id, "", v.conducteur, true);
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
      /* De même pour le contrôle des papiers à bord. */
      if (pr.get("faire") === "bord") tabParDefaut = "bord";
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
    /* VENU DE LA RECHERCHE « PAPIERS DU CHAUFFEUR » : la liste des
       conducteurs s'ouvre directement. */
    try {
      var prc = new URLSearchParams(location.search);
      if ((prc.get("vue") === "conducteurs" || prc.get("c")) && !$("o-con").hidden &&
        window.getComputedStyle($("o-con")).display !== "none") {
        /* Venu de la page du salarié : sa fiche s'ouvre directement. */
        if (prc.get("c")) { ouvert["c" + prc.get("c")] = true; rendre(); }
        onglet(false);
        window.scrollTo(0, 0);
      }
    } catch (e) {}

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
