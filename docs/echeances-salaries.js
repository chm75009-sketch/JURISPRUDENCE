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

  function echeances(aujourdhui) {
    var d0 = aujourdhui instanceof Date ? aujourdhui : new Date();
    var conducteurs = lire(CLE_CONDUCTEURS, {});
    var out = [];
    salaries().forEach(function (s) {
      if (net(s.sor)) return;                 /* parti : plus rien à suivre */
      var id = idDe(s), nom = (net(s.nom) + " " + net(s.pre)).trim();
      var su = suite(id), f = conducteurs[id] || {};
      var ent = net(s.ent);

      function pose(quoi, date, fond, quoiFaire) {
        if (!date) return;
        var n = joursEntre(date, d0);
        out.push({ quoi: quoi, qui: nom, date: date, jours: n, etat: etatDe(n),
          fond: fond, faire: quoiFaire || "", prov: "salaries" });
      }

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
          "la convocation du service de prévention et de santé au travail, et l'attestation de suivi");

      /* L'entretien de parcours professionnel : la première année, puis tous
         les quatre ans. On ne propose que la prochaine échéance. */
      if (ent) {
        var dernier = net(su.entretien);
        pose("Entretien de parcours professionnel",
          dernier ? plusMois(dernier, 48) : plusMois(ent, 12),
          "L. 6315-1, I : au cours de la première année suivant l'embauche, puis tous les quatre ans",
          "le compte rendu daté et signé, dont copie est remise au salarié");
      }

      /* La fin de la période d'essai et le terme du contrat à durée
         déterminée viennent du contrat écrit ici : ils ne se déduisent pas. */
      pose("Fin de la période d'essai", net(su.essai),
        "L. 1221-25 : la rupture pendant l'essai suppose un délai de prévenance, qui doit être tenu AVANT ce terme",
        "la décision, et la lettre de rupture s'il y a lieu, envoyée dans le délai de prévenance");
      pose("Terme du contrat à durée déterminée", net(su.terme) || (s.nature === "cdd" ? net(s.sor) : ""),
        "L. 1243-5 : le contrat cesse de plein droit à l'échéance du terme (l'indemnité de fin de contrat relève de L. 1243-8)",
        "le solde de tout compte, le certificat de travail, l'attestation d'assurance chômage");
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
