/* LES ÉCHÉANCES QUI SUIVENT UN SALARIÉ, RAMASSÉES AU MÊME ENDROIT.

   Une relecture du 26 septembre 2026 : « l'agenda ne montre ni fin d'essai,
   ni fin de CDD, ni visites médicales, ni entretiens professionnels ; le
   dirigeant n'a aucune liste à faire cette semaine ». Et, le même jour :
   « un contrat écrit ne remonte nulle part, chaque embauche est ressaisie
   trois fois ».

   Ce fichier tient les deux bouts. Il lit le registre du personnel, y ajoute
   ce que le contrat a écrit sur l'appareil (fin de période d'essai, terme du
   contrat à durée déterminée), et rend une liste d'échéances datées que
   l'agenda et l'accueil affichent comme celles de la flotte.

   CE QU'IL NE FAIT PAS : deviner. Aucune date n'est calculée à partir d'une
   règle conventionnelle non lue, et une période d'essai n'est jamais déduite :
   elle vient du contrat écrit ici, ou elle n'est pas affichée.

   LES TEXTES, lus à la source le 26 septembre 2026, deux lectures
   concordantes chacun :
     - R. 1221-4 (LEGIARTI000024214323) : « La déclaration préalable à
       l'embauche est adressée au plus tôt dans les huit jours précédant la
       date prévisible de l'embauche. » Elle se fait donc avant l'entrée ;
     - R. 4624-10 (LEGIARTI000033769085) : la visite d'information et de
       prévention a lieu « dans un délai qui n'excède pas trois mois à compter
       de la prise effective du poste de travail » ;
     - R. 4624-16 (LEGIARTI000033769063) : son renouvellement suit une
       périodicité « qui ne peut excéder cinq ans », fixée par le médecin du
       travail ;
     - L. 6315-1, I (LEGIARTI000053279288) : l'entretien de parcours
       professionnel a lieu « au cours de la première année suivant son
       embauche », puis « tous les quatre ans ». Le texte a changé : ce n'est
       plus tous les deux ans.                                              */
"use strict";
(function (global) {

  var CLE_REG = "registre-personnel";
  var CLE_SUITES = "suites-embauche";
  var CLE_CONDUCTEURS = "flotte-conducteurs";

  function lire(cle, defaut) {
    try { return JSON.parse(global.localStorage.getItem(cle) || "null") || defaut; }
    catch (e) { return defaut; }
  }
  function garder(cle, v) {
    try { global.localStorage.setItem(cle, JSON.stringify(v)); } catch (e) {}
  }
  function net(s) { return String(s == null ? "" : s).trim(); }
  function sansAccent(s) {
    try {
      return net(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    } catch (e) { return net(s).toLowerCase(); }
  }

  /* L'identifiant d'un salarié est celui de la flotte : le même nom donne la
     même clé, et les deux écrans parlent de la même personne. */
  function idDe(s) {
    return sansAccent((net(s.nom) + " " + net(s.pre)).trim()) || "salarie";
  }

  function jour(d) {
    var x = new Date(d);
    return isNaN(x) ? null : x.toISOString().slice(0, 10);
  }
  function plusJours(iso, n) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return "";
    d.setDate(d.getDate() + n);
    return jour(d);
  }
  function plusMois(iso, n) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return "";
    var j = d.getDate();
    d.setMonth(d.getMonth() + n);
    if (d.getDate() < j) d.setDate(0);
    return jour(d);
  }
  function joursEntre(iso, aujourdhui) {
    var a = new Date(iso + "T12:00:00"), b = new Date(jour(aujourdhui) + "T12:00:00");
    if (isNaN(a) || isNaN(b)) return null;
    return Math.round((a - b) / 86400000);
  }
  /* Les quatre états sont ceux de la flotte : un écran qui mélange les deux
     ne doit pas avoir deux codes de couleur. */
  function etatDe(n) {
    if (n === null) return "";
    if (n < 0) return "passe";
    if (n <= 30) return "rouge";
    if (n <= 60) return "ambre";
    return "vert";
  }

  /* ------------------------------------------------------- ce que le contrat écrit --- */
  /* Une suite d'embauche : ce que le contrat sait et que le registre ne porte
     pas. Rien n'est écrasé par du vide. */
  function poser(id, suite) {
    var t = lire(CLE_SUITES, {});
    var d = t[id] || {};
    for (var k in suite) {
      if (!Object.prototype.hasOwnProperty.call(suite, k)) continue;
      if (net(suite[k])) d[k] = net(suite[k]);
    }
    t[id] = d;
    garder(CLE_SUITES, t);
    return d;
  }
  function suite(id) { return lire(CLE_SUITES, {})[id] || {}; }

  /* ------------------------------------------------------------- les échéances --- */
  function salaries() {
    var r = lire(CLE_REG, {});
    return ((r && r.salaries) || []).filter(function (s) {
      return (net(s.nom) || net(s.pre)) && !s.ex;
    });
  }

  /* Les dépassements relevés dans le décompte des heures, sur les quatre
     derniers mois. Au-delà, ils n'ont plus à encombrer l'agenda : ils restent
     dans le décompte, qui est la pièce. */
  function depassementsDesHeures(id, nom, d0) {
    var t = lire("heures-decompte", {}), out = [];
    Object.keys(t).forEach(function (cle) {
      var coupe = cle.split("|");
      if (coupe[0] !== id || !/^\d{4}-\d{2}$/.test(coupe[1] || "")) return;
      var m = t[cle], a = m && m.alertes;
      if (!a) return;
      var annee = parseInt(coupe[1].slice(0, 4), 10), mois = parseInt(coupe[1].slice(5, 7), 10);
      var fin = jour(new Date(annee, mois, 0));          /* dernier jour du mois */
      var depuis = joursEntre(fin, d0);
      /* Le mois en cours compte aussi : sa fin est devant nous, mais le
         dépassement, lui, est déjà là. */
      if (depuis === null || depuis < -124 || depuis > 31) return;
      var dits = [];
      if (a.jours) dits.push(a.jours + " journée" + (a.jours > 1 ? "s" : "") + " au-delà de " +
        a.jour + " heures");
      if (a.nuit) dits.push(a.nuit + " journée" + (a.nuit > 1 ? "s" : "") + " au-delà de dix heures " +
        "avec du travail entre minuit et cinq heures");
      if (a.semaines) dits.push(a.semaines + " semaine" + (a.semaines > 1 ? "s" : "") + " au-delà de " +
        a.sem + " heures");
      if (a.pauses) dits.push(a.pauses + " journée" + (a.pauses > 1 ? "s" : "") + " sans la pause due");
      out.push({ quoi: "Dépassements de durée relevés sur " + MOIS_NOM[mois - 1] + " " + annee,
        qui: nom, date: fin, jours: depuis, etat: "rouge",
        fond: "R. 3312-50 et R. 3312-51 du code des transports pour un roulant, L. 3121-18 et " +
          "L. 3121-20 du code du travail sinon ; L. 3312-1 pour les dix heures de nuit et " +
          "L. 3312-2 pour les pauses",
        faire: dits.join(", ") + ". À reprendre dans le décompte du mois : le motif de chaque " +
          "dépassement s'écrit, et le repos qui en découle se pose",
        prov: "salaries" });
    });
    return out;
  }
  var MOIS_NOM = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];

  /* LA CLÔTURE DU MOIS DE DÉCOMPTE EST UNE ÉCHÉANCE.

     Relevé le 27 septembre 2026 : l'écran des heures annonce « clôture prévue
     le 5 » du mois suivant, et l'agenda n'en savait rien. Un mois tenu et non
     clos est un décompte que personne n'a arrêté : c'est lui qu'on produira en
     cas de litige. On ne remonte pas au-delà de trois mois : au-delà, le
     rappel n'apporte plus rien, et le décompte reste la pièce. */
  function cloturesDesHeures(id, nom, d0) {
    var t = lire("heures-decompte", {}), out = [];
    Object.keys(t).forEach(function (cle) {
      var coupe = cle.split("|");
      if (coupe[0] !== id || !/^\d{4}-\d{2}$/.test(coupe[1] || "")) return;
      var m = t[cle];
      if (!m || (m.clos && m.clos.le)) return;
      var tenu = (m.jours && Object.keys(m.jours).length) || (m.rectifs || []).length ||
        (m.recl || []).length || net(m.motif) || net(m.retenu);
      if (!tenu) return;
      var annee = parseInt(coupe[1].slice(0, 4), 10), mois = parseInt(coupe[1].slice(5, 7), 10);
      /* Le 5 du mois qui suit celui du décompte. */
      var d = jour(new Date(annee, mois, 5));
      var depuis = joursEntre(d, d0);
      if (depuis === null || depuis < -93 || depuis > 40) return;
      out.push({ quoi: "Clôture du décompte des heures de " + MOIS_NOM[mois - 1] + " " + annee,
        qui: nom, date: d, jours: depuis, etat: etatDe(depuis),
        fond: "L. 3171-2 et D. 3171-8 : l'employeur établit les documents nécessaires au décompte de la durée de travail",
        faire: "clore le mois dans le décompte des heures, le faire signer au salarié, et le conserver",
        prov: "salaries" });
    });
    return out;
  }

  function echeances(aujourdhui) {
    var d0 = aujourdhui instanceof Date ? aujourdhui : new Date();
    var conducteurs = lire(CLE_CONDUCTEURS, {});
    var out = [];
    salaries().forEach(function (s) {
      /* UNE SORTIE LAISSE DEUX CHOSES À FAIRE, ET PERSONNE NE LES RAPPELAIT.

         L. 911-8 du code de la sécurité sociale (LEGIARTI000027549338, deux
         lectures concordantes au relais le 27 septembre 2026), 6° :
         « L'employeur signale le maintien de ces garanties dans le certificat
         de travail et informe l'organisme assureur de la cessation du contrat de
         travail. » La portabilité ne se déclenchait depuis aucune sortie du
         registre. Relevé le 27 septembre 2026. Elle s'inscrit à la date de la
         sortie, et reste visible deux mois : passé ce délai, elle n'a plus à
         encombrer l'agenda, mais elle a été dite. */
      if (net(s.sor)) {
        var depuis = joursEntre(net(s.sor), d0);
        if (depuis !== null && depuis >= -62 && depuis <= 1)
          out.push({ quoi: "Portabilité des couvertures santé et prévoyance",
            qui: (net(s.nom) + " " + net(s.pre)).trim(), date: net(s.sor),
            jours: depuis, etat: etatDe(depuis),
            fond: "L. 911-8 du code de la sécurité sociale, 6° : l'employeur signale le maintien des garanties dans le certificat de travail et informe l'organisme assureur de la cessation du contrat de travail",
            faire: "la mention du maintien sur le certificat de travail, et le courrier à l'organisme assureur ; le maintien est gratuit, pour une durée égale à celle de l'indemnisation du chômage, dans la limite de celle du dernier contrat et de douze mois",
            prov: "salaries" });
        return;                               /* parti : rien d'autre à suivre */
      }
      var id = idDe(s), nom = (net(s.nom) + " " + net(s.pre)).trim();
      var su = suite(id), f = conducteurs[id] || {};
      var ent = net(s.ent);

      function pose(quoi, date, fond, quoiFaire, inconnu) {
        if (!date) return;
        var n = joursEntre(date, d0);
        /* UNE ÉCHÉANCE CALCULÉE SUR UNE DATE QU'ON N'A PAS N'EST PAS UN RETARD.
           Pour les salariés entrés en 2004, l'agenda affichait cent vingt-trois
           cartes « en retard » : la visite et l'entretien étaient comptés depuis
           l'embauche, faute de connaître la dernière date réelle. Relevé le
           26 septembre 2026. Quand la référence manque et que le calcul tombe
           dans le passé, la ligne demande la date au lieu d'annoncer un
           manquement. */
        if (inconnu && n < 0) {
          out.push({ quoi: quoi, qui: nom, date: d0, jours: 0, etat: "rouge", inconnu: true,
            fond: fond, faire: "la date de la dernière " + inconnu + ", à saisir sur la fiche du salarié : " +
              "tant qu'elle manque, l'échéance ne peut pas être calculée",
            prov: "salaries" });
          return;
        }
        out.push({ quoi: quoi, qui: nom, date: date, jours: n, etat: etatDe(n),
          fond: fond, faire: quoiFaire || "", prov: "salaries" });
      }

      /* CE QU'UN DÉPASSEMENT D'HORAIRE DOIT À L'AGENDA.

         Relevé le 27 septembre 2026 : les dépassements de durée se lisaient
         dans l'écran des heures, et nulle part ailleurs. Un dirigeant qui
         n'ouvre pas le décompte d'un conducteur ne pouvait pas savoir qu'une
         journée avait dépassé douze heures, qu'une semaine avait dépassé son
         plafond, qu'une nuit avait dépassé dix heures ou qu'une pause
         manquait. L'écran des heures garde le compte sur le mois ; l'agenda
         le reprend, daté du dernier jour du mois, avec son motif. */
      depassementsDesHeures(id, nom, d0).forEach(function (e) { out.push(e); });
      cloturesDesHeures(id, nom, d0).forEach(function (e) { out.push(e); });

      /* LE TITRE QUI AUTORISE À TRAVAILLER A UNE DATE DE FIN.

         L. 5221-8 met à la charge de l'employeur de s'assurer de l'existence
         du titre. Un titre expiré, c'est un salarié qui ne peut plus être
         employé, et personne ne voyait venir la date. Elle vient du contrat
         écrit ici. Relevé le 27 septembre 2026. */
      if (net(su.titreFin))
        pose("Titre de séjour ou de travail à renouveler", net(su.titreFin),
          "L. 5221-8 : l'employeur s'assure auprès des administrations territorialement compétentes de l'existence du titre autorisant l'étranger à exercer une activité salariée en France",
          "la copie du titre renouvelé, et la vérification auprès de la préfecture" +
            (net(su.titreNumero) ? " ; titre en cours : " + net(su.titreNumero) : ""));

      /* La déclaration préalable ne se rappelle que si l'embauche est devant
         nous ou d'hier : passé ce délai, elle est faite ou elle ne se
         rattrape plus par un rappel. */
      if (ent) {
        var av = joursEntre(ent, d0);
        if (av !== null && av >= -1 && !net(su.dpae))
          pose("Déclaration préalable à l'embauche", ent,
            "R. 1221-4 : adressée au plus tôt dans les huit jours précédant la date prévisible de l'embauche",
            "la déclaration à l'URSSAF, et son accusé de réception conservé");
      }

      /* La visite d'information et de prévention : trois mois au plus à
         compter de la prise de poste. Quand la fiche conducteur porte déjà la
         date de la visite, c'est l'écran de la flotte qui suit le
         renouvellement, et la ligne ne se répète pas ici. */
      if (ent && !net(f.visiteTravail) && !net(su.visite))
        pose("Visite d'information et de prévention", plusMois(ent, 3),
          "R. 4624-10 : dans un délai qui n'excède pas trois mois à compter de la prise effective du poste",
          "la convocation du service de prévention et de santé au travail, et l'attestation de suivi",
          "visite médicale");

      /* L'entretien de parcours professionnel : la première année, puis tous
         les quatre ans. On ne propose que la prochaine échéance. */
      if (ent) {
        var dernier = net(su.entretien);
        pose("Entretien de parcours professionnel",
          dernier ? plusMois(dernier, 48) : plusMois(ent, 12),
          "L. 6315-1, I : au cours de la première année suivant l'embauche, puis tous les quatre ans",
          "le compte rendu daté et signé, dont copie est remise au salarié",
          dernier ? null : "entretien de parcours professionnel");
      }

      /* La fin de la période d'essai et le terme du contrat à durée
         déterminée viennent du contrat écrit ici : ils ne se déduisent pas. */
      pose("Fin de la période d'essai", net(su.essai),
        "L. 1221-25 : la rupture pendant l'essai suppose un délai de prévenance, qui doit être tenu AVANT ce terme",
        "la décision, et la lettre de rupture s'il y a lieu, envoyée dans le délai de prévenance");
      pose("Terme du contrat à durée déterminée", net(su.terme) || (s.nature === "cdd" ? net(s.sor) : ""),
        "L. 1243-5 : le contrat cesse de plein droit à l'échéance du terme (l'indemnité de fin de contrat relève de L. 1243-8)",
        "le solde de tout compte, le certificat de travail, l'attestation d'assurance chômage");

      /* LE TITRE DE TRAVAIL QUI EXPIRE. L. 8251-1 (LEGIARTI000024197709, deux
         lectures concordantes au relais le 27 septembre 2026) interdit de
         « conserver à son service » un étranger non muni du titre l'autorisant
         à exercer une activité salariée. La date de fin n'est pas une mention
         du registre : elle s'y saisit pour que l'échéance se voie venir, à
         soixante jours comme les autres. Relevé le 27 septembre 2026. */
      if (s.etr === "oui")
        pose("Fin de validité du titre de travail", net(s.titFin),
          "L. 8251-1 : il est interdit de conserver à son service un étranger non muni du titre l'autorisant à exercer une activité salariée en France",
          "le justificatif de renouvellement, ou le récépissé de demande de renouvellement, et la copie annexée au registre (D. 1221-24)");
    });
    out.sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });
    return out;
  }

  /* --------------------------------------------------- l'embauche, d'un seul geste --- */
  /* LE CONTRAT ÉCRIT INSCRIT LE SALARIÉ.

     Jusqu'au 26 septembre 2026, un contrat produit ici ne remontait ni au
     registre, ni à la fiche conducteur, ni à l'agenda : la même embauche se
     ressaisissait trois fois. `inscrire` fait les trois, sans jamais écraser
     ce qui est déjà écrit ailleurs : un salarié déjà au registre y est
     complété, non dupliqué. Rend ce qui a été fait, pour que l'écran le dise
     à l'utilisateur plutôt que d'agir en silence. */
  function inscrire(d) {
    d = d || {};
    var nom = net(d.nom), pre = net(d.pre);
    if (!nom && !pre) return null;
    var id = idDe({ nom: nom, pre: pre });
    var r = lire(CLE_REG, {});
    if (!r || typeof r !== "object") r = {};
    if (!r.salaries) r.salaries = [];
    var ligne = null;
    for (var i = 0; i < r.salaries.length; i++) {
      var x = r.salaries[i];
      if (idDe(x) === id && !x.ex) { ligne = x; break; }
    }
    var neuf = !ligne;
    if (neuf) { ligne = {}; r.salaries.push(ligne); }
    var champs = { nom: nom, pre: pre, nat: d.nat, nais: d.nais, sexe: d.sexe,
      emp: d.emp, qua: d.qua, ent: d.ent, nature: d.nature, part: d.part };
    var complets = [];
    for (var c in champs) {
      if (!Object.prototype.hasOwnProperty.call(champs, c)) continue;
      if (net(champs[c]) && !net(ligne[c])) { ligne[c] = net(champs[c]); complets.push(c); }
    }
    if (neuf && !net(ligne.insc)) ligne.insc = net(d.ent) || jour(new Date());
    garder(CLE_REG, r);

    /* La fiche conducteur : ouverte vide, elle fait apparaître le salarié
       dans l'écran de la flotte avec ses dates à renseigner, en rouge tant
       qu'il n'y en a aucune. */
    var conduit = /conducteur|conductrice|chauffeur|routier|livreur|coursier|cariste/i.test(net(d.emp));
    var C = lire(CLE_CONDUCTEURS, {});
    var ficheNeuve = false;
    if (conduit && !C[id]) { C[id] = {}; garder(CLE_CONDUCTEURS, C); ficheNeuve = true; }

    poser(id, { essai: d.essai, terme: d.terme });

    return { id: id, nouveau: neuf, complets: complets, fiche: ficheNeuve };
  }

  /* NOM ET PRÉNOM : QUI EST QUI.

     « Madame Lucie MARTIN » était coupé au premier espace : Lucie devenait le
     nom et MARTIN le prénom. Le nom de famille s'écrit presque toujours en
     capitales dans un registre ; quand rien ne le distingue, le premier mot
     fait le nom, comme avant. La civilité, elle, ne fait partie ni de l'un ni
     de l'autre. Relevé le 26 septembre 2026. */
  function couper(entier) {
    var t = net(entier).replace(/^\s*(madame|mademoiselle|monsieur|mme|mlle|m\.)\s+/i, "");
    var mots = t.split(/\s+/).filter(function (x) { return x; });
    if (!mots.length) return { nom: "", pre: "" };
    var capitales = mots.filter(function (m) {
      return m.length > 1 && m === m.toUpperCase() && /[A-ZÀ-Ý]/.test(m);
    });
    if (capitales.length && capitales.length < mots.length) {
      return { nom: capitales.join(" "),
        pre: mots.filter(function (m) { return capitales.indexOf(m) < 0; }).join(" ") };
    }
    return { nom: mots[0], pre: mots.slice(1).join(" ") };
  }

  global.EcheancesSalaries = {
    couper: couper,
    CLE: CLE_SUITES, idDe: idDe, poser: poser, suite: suite,
    echeances: echeances, inscrire: inscrire, plusMois: plusMois, plusJours: plusJours,
  };
})(typeof window !== "undefined" ? window : this);
