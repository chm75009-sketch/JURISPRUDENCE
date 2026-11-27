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

  /* LE MODE ESSAI. Demande du 21 novembre 2026 : pouvoir faire des simulations
     pour voir comment l'écran se comporte, puis les annuler. Au début d'un
     essai, tout l'état du module (fiches, échéancier, registres des véhicules)
     est mis de côté, tel qu'il est écrit. Annuler l'essai le remet à
     l'identique : rien de ce qui a été fait entre-temps ne reste. Une
     démonstration ajoute, le temps de l'essai, un conducteur et un véhicule
     fictifs, qui disparaissent avec lui. */
  var AVANT_ESSAI = "conformite-transport-avant-essai";
  function essaiEnCours() { return etat().essai || null; }
  function commencerEssai(o) {
    if (essaiEnCours()) return false;
    var brut = null;
    try {
      brut = window.localStorage.getItem(STORE);
      window.localStorage.setItem(AVANT_ESSAI, brut == null ? "__vide__" : brut);
      if (window.localStorage.getItem(AVANT_ESSAI) !== (brut == null ? "__vide__" : brut)) return false;
    } catch (err) { return false; }      /* sans copie sûre, pas d'essai */
    var e = etat();
    e.essai = { depuis: new Date().toISOString(), demonstration: !!(o && o.demonstration),
      conducteur: (o && o.conducteur) || null, vehicule: (o && o.vehicule) || null, docIds: [] };
    garderEtat(e);
    return true;
  }
  /* Un fichier rangé dans la base des documents pendant l'essai : on retient son
     numéro pour le retirer si l'essai est annulé. */
  function noterDocEssai(id) { var e = etat(); if (e.essai && id != null) { e.essai.docIds.push(id); garderEtat(e); } }
  function annulerEssai() {
    var e = etat(); if (!e.essai) return null;
    var ids = e.essai.docIds || [], avant = null;
    try { avant = window.localStorage.getItem(AVANT_ESSAI); } catch (err) {}
    if (avant == null) return null;      /* la copie a disparu : on ne détruit rien */
    try {
      if (avant === "__vide__") window.localStorage.removeItem(STORE); else window.localStorage.setItem(STORE, avant);
      window.localStorage.removeItem(AVANT_ESSAI);
    } catch (err) { return null; }
    return { docIds: ids };
  }
  function garderEssai() {
    var e = etat(); if (!e.essai) return;
    delete e.essai; garderEtat(e);
    try { window.localStorage.removeItem(AVANT_ESSAI); } catch (err) {}
  }

  /* LA DATE DU JOUR EN HEURE DE FRANCE (27 novembre 2026). iso() passait par
     l'heure universelle : à Paris, une date prise à minuit sortait la veille,
     une séance du 18/12 s'affichait au 17/12 et le délai pour sanctionner
     perdait un jour. On lit désormais le jour, le mois et l'année locaux ; une
     date déjà écrite « AAAA-MM-JJ » est rendue telle quelle. */
  function iso(d) {
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    var x = new Date(d);
    if (isNaN(x.getTime())) return "";
    return x.getFullYear() + "-" + (x.getMonth() < 9 ? "0" : "") + (x.getMonth() + 1) + "-" + (x.getDate() < 10 ? "0" : "") + x.getDate();
  }
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
    var L = (window.Flotte && window.Flotte.vehicules) ? (window.Flotte.vehicules() || []) : (lire("flotte-vehicules", []) || []);
    var es = essaiEnCours();
    return (es && es.vehicule) ? L.concat([es.vehicule]) : L;
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
    var out = base.map(function (s) {
      return { id: s.id, nom: s.nom, poste: s.emp || s.poste || "",
        conduit: s.conduit !== false, poidsLourd: POIDS_LOURD.test(net(s.emp || s.poste)) };
    });
    var es = essaiEnCours();
    if (es && es.conducteur) out.push({ id: es.conducteur.id, nom: es.conducteur.nom, poste: es.conducteur.poste || "", conduit: true, poidsLourd: true });
    return out;
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
      /* La date d'un fichier de carte lu, ou celle portée sur sa fiche (par le
         salarié dans son questionnaire, ou par T.E.C) : la plus récente des
         deux (27 novembre 2026). Sans fichier lu, le voyant part de la fiche. */
      var lu = net((e.cartes[s.id] || {}).dernier), fi = net(ficheC(s.id).telecCarte);
      var der = lu && (!fi || lu >= fi) ? lu : fi;
      if (!der) { out.push({ quoi: "Téléchargement de la carte", qui: s.nom, date: null,
        etat: "à renseigner", jours: null, fond: "gris" }); return; }
      var ech = ajouterJours(der, DELAI_CARTE), q = qualifier(ech);
      out.push({ quoi: "Téléchargement de la carte", qui: s.nom, date: ech,
        etat: q.etat, jours: q.jours, fond: q.fond, dernier: der, deFiche: der !== lu });
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
  /* Une anomalie porte, en plus de sa date et de sa nature : sa source (carte,
     véhicule, compte rendu…), le jour où l'employeur en a eu connaissance, qui
     fait courir les deux mois de l'article L. 1332-4, et la date de la mesure
     qui l'a traitée. */
  function ligneAnomalie(a, defauts) {
    defauts = defauts || {};
    var x = { date: a.date || iso(new Date()), type: net(a.type), detail: net(a.detail) };
    var src = net(a.src || defauts.src), connu = net(a.connu || defauts.connu);
    if (src) x.src = src;
    if (connu) x.connu = connu;
    return x;
  }
  function ajouterAnomalie(id, a) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.anomalies = s.anomalies || [];
    s.anomalies.push(ligneAnomalie(a));
    e.suivi[id] = s; garderEtat(e);
  }
  /* Modifier des anomalies repérées par leur rang : la date de connaissance
     (champ connu) ou le traitement (champ traite). */
  function majAnomalies(id, rangs, champs) {
    var e = etat(); var s = (e.suivi && e.suivi[id]) || {};
    (rangs || []).forEach(function (i) {
      var a = s.anomalies && s.anomalies[i]; if (!a) return;
      Object.keys(champs).forEach(function (k) { if (champs[k] == null || champs[k] === "") delete a[k]; else a[k] = champs[k]; });
    });
    garderSuivi(id, s);
  }
  function ajouterMesure(id, m) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.mesures = s.mesures || [];
    var x = { date: m.date || iso(new Date()), categorie: net(m.categorie),
      objet: net(m.objet), pour: net(m.pour) };
    /* Pour une sanction : sa clé dans l'échelle, la nature des faits visés, leur
       nombre, et le fait qu'elle a été saisie après coup. */
    if (m.cle) x.cle = m.cle;
    if (m.natures && m.natures.length) x.natures = m.natures.slice();
    if (m.nb) x.nb = m.nb;
    if (m.ancienne) x.ancienne = true;
    /* Les faits visés, pour pouvoir rééditer le même courrier ; et, quand un
       entretien préalable est requis, le fait que seule la convocation est
       partie : la sanction n'existe qu'une fois notifiée. */
    if (m.lignes && m.lignes.length) x.lignes = m.lignes.slice();
    if (m.convocation) x.convocation = true;
    if (m.entretien) x.entretien = m.entretien;
    s.mesures.push(x);
    e.suivi[id] = s; garderEtat(e);
  }
  function majMesure(id, i, champs) {
    var e = etat(); var s = (e.suivi && e.suivi[id]) || {};
    var m = s.mesures && s.mesures[i]; if (!m) return;
    Object.keys(champs).forEach(function (k) { if (champs[k] == null || champs[k] === "") delete m[k]; else m[k] = champs[k]; });
    garderSuivi(id, s);
  }

  /* CE QUE LA FICHE GARDE EN PLUS, PAR CONDUCTEUR : l'état des documents remis
     (imprimé, signé, avec les deux dates et la signature faite à l'écran), le
     journal des contrôles effectués, qui prouve le suivi, et l'identité de sa
     carte une fois lue. */
  function champSuivi(id, champ, defaut) {
    var e = etat(), s = (e.suivi && e.suivi[id]) || {};
    return s[champ] == null ? defaut : s[champ];
  }
  function poserSuivi(id, champ, valeur) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s[champ] = valeur; e.suivi[id] = s; garderEtat(e);
  }
  function docsRemis(id) { return champSuivi(id, "docs", {}); }
  function porterDocRemis(id, cle, champs) {
    var d = docsRemis(id); d[cle] = d[cle] || {};
    Object.keys(champs).forEach(function (k) { d[cle][k] = champs[k]; });
    poserSuivi(id, "docs", d);
  }
  function journalControles(id) { return champSuivi(id, "controles", []).slice(); }
  function ajouterControle(id, c) {
    var L = champSuivi(id, "controles", []);
    L.push({ quand: c.quand || new Date().toISOString(), lib: net(c.lib), resume: net(c.resume) });
    poserSuivi(id, "controles", L);
  }
  function carteDe(id) {
    var c = champSuivi(id, "carte", null);
    if (c && net(c.numero)) return c;
    var f = ficheC(id);
    if (!net(f.carteNum)) return c;
    var o = {}; if (c) Object.keys(c).forEach(function (k) { o[k] = c[k]; });
    o.numero = net(f.carteNum); if (!net(o.expiration) && net(f.carteCond)) o.expiration = net(f.carteCond);
    return o;
  }
  function porterCarte(id, c) { poserSuivi(id, "carte", { numero: net(c.numero), titulaire: net(c.titulaire), expiration: net(c.expiration) }); }
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

  /* Une date ISO écrite en toutes lettres : 2026-11-27 devient 27 novembre 2026. */
  function enLettres(s) {
    if (!s) return "";
    try { return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(String(s).slice(0, 10) + "T12:00:00")); }
    catch (e) { return String(s).slice(0, 10); }
  }

  /* Une date ISO en chiffres à la française : 2026-11-27 devient 27/11/2026
     (27 novembre 2026, pour les tableaux de la fiche en Word). */
  function jjmm(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || ""));
    return m ? m[3] + "/" + m[2] + "/" + m[1] : String(s || "");
  }

  /* L'ENCADREMENT, TEL QUE LA FICHE LE CONNAÎT. Relevé le 27 novembre 2026 : la
     fiche en Word portait « signée le [DATE] » et « Rappels : [DATES] » même
     une fois la consigne signée à l'écran. Les dates viennent maintenant de
     l'étape Instructions : la consigne, et la note de service qui rappelle la
     réglementation. Ce qui n'est pas encore signé le dit en clair. */
  function phraseEncadrement(id) {
    var d = docsRemis(id), pr = profilConducteur(id);
    var nomConsigne = "Consigne de conduite" + (pr.pl ? " avec carte" : "");
    function etat(cle, signe, imprime, rien) {
      var x = d[cle] || {};
      if (x.etat === "signe" && x.signeLe) return signe + " le " + enLettres(x.signeLe);
      if (x.etat === "imprime" && x.imprimeLe) return imprime + " le " + enLettres(x.imprimeLe) + ", pas encore signée";
      return rien;
    }
    return etat("consigne", nomConsigne + " remise et signée", nomConsigne + " imprimée", nomConsigne + " : pas encore remise au conducteur") + ". " +
      "Rappels de la réglementation : " + etat("note", "note de service signée", "note de service imprimée", "aucun rappel signé à ce jour") + ".";
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
    items.push({ k: "p", t: "État au " + enLettres(iso(new Date())) + " : " + et.message });

    items.push({ k: "h2", t: "Encadrement" });
    items.push({ k: "p", t: phraseEncadrement(id) });

    items.push({ k: "h2", t: "Contrôle et anomalies relevées" });
    if (s.anomalies.length) {
      items.push({ k: "table", head: ["Date", "Type", "Détail"],
        rows: s.anomalies.map(function (a) { return [jjmm(a.date), a.type || "", a.detail || ""]; }) });
    } else {
      items.push({ k: "p", t: "Aucune anomalie relevée à ce jour." });
    }

    items.push({ k: "h2", t: "Réactions : correction, ajustement, sanction" });
    if (s.mesures.length) {
      items.push({ k: "table", head: ["Date", "Catégorie", "Mesure", "Pour le manquement"],
        rows: s.mesures.map(function (m) {
          var cat = (CATEGORIES.filter(function (c) { return c.cle === (m.categorie || "").toLowerCase(); })[0] || {}).nom || m.categorie || "";
          return [jjmm(m.date), cat, m.objet || "", m.pour || ""]; }) });
    } else {
      items.push({ k: "p", t: "Aucune mesure prise à ce jour." });
    }
    items.push({ k: "note", t: "Une sanction disciplinaire se prend dans les deux mois de la connaissance des faits (" + art("L1332-4") + " du code du travail), sauf poursuites pénales exercées dans ce délai." });

    items.push({ k: "h2", t: "Le droit" });
    items.push({ k: "puce", t: "Exonération de l'employeur : instruire, s'assurer du respect effectif à intervalles réguliers, et réagir en cas de manquements répétés (Cass. crim. 16 janvier 1990, n° 89-82.880)." });
    items.push({ k: "puce", t: "Enregistrement par le chronotachygraphe : " + art("R3313-7") + " du code des transports." });
    return items;
  }

  /* RELIER UNE CARTE LUE À UN CONDUCTEUR DU REGISTRE. On rapproche le nom du
     titulaire de la carte des conducteurs du registre : d'abord le nom complet
     normalisé, sinon le seul nom de famille. Rien n'est forcé : si rien ne
     correspond, on rend une liste vide et l'utilisateur choisit. */
  function normal(s) { return sansAccent(s); }
  function matchConducteur(analyse) {
    var ident = (analyse && analyse.identification) || {};
    var cible = normal(ident.titulaire || "");
    var nomSeul = normal(ident.nom || "");
    var L = salariesRegistre();
    var exact = L.filter(function (s) { return normal(s.nom) === cible && cible; })[0];
    if (exact) return exact.id;
    if (nomSeul) {
      var parNom = L.filter(function (s) { return normal(s.nom).indexOf(nomSeul) >= 0; })[0];
      if (parNom) return parNom.id;
    }
    return "";
  }

  /* Un fait relève-t-il de la conduite du salarié ? On n'inscrit pas au suivi
     disciplinaire une coupure d'alimentation ou un chevauchement horaire, qui
     sont techniques, ni une journée illisible, ni un calcul seulement indicatif. */
  function faitDeConduite(a) {
    var t = (a.type || "").toLowerCase();
    return /sans carte|insertion de la carte|mal cl|non cl|retir|dépassement de la conduite|conduite continue/.test(t);
  }

  /* Porter au suivi les anomalies tirées de la carte ou du rapport, sans doublon :
     une même date et un même type ne se réinscrivent pas. Rend le nombre ajouté.
     Les anomalies issues de la lecture de carte portent une source (appareil,
     calcul, lecture) : on n'inscrit alors que les faits de conduite du salarié,
     pour ne pas noyer le suivi avec le technique, l'indicatif ou l'illisible. Les
     anomalies d'un rapport (sans source) sont déjà des infractions : on les garde. */
  /* Ce qui s'inscrit au suivi, parmi ce qui a été lu : sert aussi au message
     de lecture, pour ne pas dire « déjà présentes » des lignes écartées. */
  function seRetient(a) { return !(a.source && (a.source !== "appareil" || !faitDeConduite(a))); }
  function anomaliesRetenues(anomalies) { return (anomalies || []).filter(seRetient); }

  function importerAnomalies(id, anomalies, defauts) {
    if (!id || !anomalies || !anomalies.length) return 0;
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.anomalies = s.anomalies || [];
    var n = 0;
    anomalies.forEach(function (a) {
      if (!seRetient(a)) return;
      var existe = s.anomalies.some(function (x) {
        return (x.date || "") === (a.date || "") && (x.type || "") === (a.type || "");
      });
      if (existe) return;
      s.anomalies.push(ligneAnomalie(a, defauts));
      n++;
    });
    e.suivi[id] = s; garderEtat(e);
    return n;
  }

  /* LE REGISTRE DU VÉHICULE. La conduite sans carte lue dans le fichier du
     tachygraphe n'est imputable à aucun conducteur tant qu'on n'a pas établi qui
     roulait : elle se range donc sous le véhicule, par immatriculation, et non
     dans la fiche d'un salarié. Sans doublon : une même date et un même détail
     ne se réinscrivent pas. Rend le nombre ajouté. */
  function anomaliesVehicule(immat) {
    var e = etat(); var s = (e.suiviVehicules || {})[immat] || {};
    return (s.anomalies || []).slice();
  }
  function importerAnomaliesVehicule(immat, anomalies) {
    if (!immat || !anomalies || !anomalies.length) return 0;
    var e = etat(); e.suiviVehicules = e.suiviVehicules || {};
    var s = e.suiviVehicules[immat] || {}; s.anomalies = s.anomalies || [];
    var n = 0;
    anomalies.forEach(function (a) {
      var existe = s.anomalies.some(function (x) {
        return (x.date || "") === (a.date || "") && (x.detail || "") === net(a.detail);
      });
      if (existe) return;
      s.anomalies.push({ date: a.date || iso(new Date()), type: net(a.type), detail: net(a.detail) });
      n++;
    });
    s.anomalies.sort(function (x, y) { return (x.date || "") < (y.date || "") ? -1 : (x.date || "") > (y.date || "") ? 1 : 0; });
    e.suiviVehicules[immat] = s; garderEtat(e);
    return n;
  }
  function supprimerAnomalieVehicule(immat, i) {
    var e = etat(); var s = (e.suiviVehicules || {})[immat];
    if (s && s.anomalies && s.anomalies[i]) { s.anomalies.splice(i, 1); garderEtat(e); }
  }
  function viderAnomaliesVehicule(immat) {
    var e = etat(); if (e.suiviVehicules && e.suiviVehicules[immat]) { delete e.suiviVehicules[immat]; garderEtat(e); }
  }

  /* CE QUE LES VÉHICULES ONT ENREGISTRÉ POUR CHAQUE CARTE. Quand le fichier du
     tachygraphe d'un véhicule est lu, on garde, par numéro de carte et par
     jour, la conduite et la plus longue conduite continue faites dans ce
     véhicule. Une carte dont une session a été mal clôturée ne porte pas cette
     activité : c'est ici qu'on la retrouve. */
  function porterJoursVehicule(immat, parCarte) {
    if (!immat || !parCarte) return;
    var e = etat(); e.vuCartes = e.vuCartes || {};
    Object.keys(parCarte).forEach(function (num) {
      var c = e.vuCartes[num] || (e.vuCartes[num] = {});
      Object.keys(parCarte[num]).forEach(function (date) {
        var j = parCarte[num][date];
        (c[date] || (c[date] = {}))[immat] = [j.conduite, j.continueMax];
      });
    });
    garderEtat(e);
  }
  function joursVehiculePourCarte(numero) {
    var c = (etat().vuCartes || {})[numero] || {}, out = {};
    Object.keys(c).forEach(function (date) {
      var r = { conduite: 0, continueMax: 0, vehicules: [] };
      Object.keys(c[date]).forEach(function (immat) {
        r.conduite += c[date][immat][0]; r.continueMax = Math.max(r.continueMax, c[date][immat][1]); r.vehicules.push(immat);
      });
      out[date] = r;
    });
    return out;
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
        b("h2", "Les temps de conduite et de repos à respecter"),
        b("p", "Conduite continue : 4 h 30 au maximum, puis une pause de 45 minutes. Cette pause peut se prendre en deux fois, 15 minutes puis 30 minutes, dans cet ordre."),
        b("p", "Conduite dans la journée : 9 heures au maximum. Elle peut monter à 10 heures, mais deux fois par semaine seulement."),
        b("p", "Conduite dans la semaine : 56 heures au maximum, et 90 heures au maximum sur deux semaines qui se suivent."),
        b("p", "Repos chaque jour : 11 heures d'affilée. Il peut descendre à 9 heures, trois fois au plus entre deux repos de fin de semaine, ou se couper en deux, 3 heures d'abord puis au moins 9 heures."),
        b("p", "Repos de fin de semaine : 45 heures. Une semaine sur deux, il peut descendre à 24 heures, à condition de rattraper le temps manquant plus tard. On ne roule pas plus de six journées de suite avant de prendre ce repos."),
        b("p", "Un planning qui paraît impossible à tenir se signale à l'exploitation avant le départ, jamais après. Un retard ne se rattrape ni sur une pause ni sur un repos."),
        b("h2", "Le repos de fin de semaine"),
        b("p", "Le repos de fin de semaine normal, celui de 45 heures, ne se prend pas à bord du véhicule : l'hébergement est organisé et pris en charge par l'entreprise."),
        b("sign", "Le conducteur reconnaît avoir reçu et compris la présente consigne."),
      ],
      formalites: [
        "Remettre un exemplaire signé à chaque conducteur et en conserver un au dossier individuel.",
        "La faire signer à l'embauche, puis à chaque rappel.",
        "La tenir à disposition en cas de contrôle : c'est l'instruction écrite que la jurisprudence exige.",
      ],
      droit: [
        "Temps de conduite, pauses et repos : articles 6, 7 et 8 du règlement (CE) n° 561/2006.",
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
    /* Dans l'ordre du temps (27 novembre 2026) : « dès réception de la
       convocation », à J-20, venait après l'étape de J-5. */
    etapes.sort(function (x, y) { return x.jours - y.jours; });
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
    /* LES INFRACTIONS SAISIES. Relevé le 27 novembre 2026 : la feuille ne
       portait que sa ligne de titres, même après l'ajout d'une infraction à la
       fiche d'un conducteur. Chaque fait porté à une fiche y fait maintenant
       sa ligne, du plus ancien au plus récent. Le véhicule se lit dans le
       détail quand celui-ci le nomme ; la date est écrite jj/mm/aaaa, en texte,
       pour qu'une infraction passée ne s'affiche pas en rouge comme une
       échéance dépassée. Les colonnes que la fiche ne connaît pas restent
       vides, à compléter depuis le procès-verbal. */
    var e = etat(), noms = {};
    salariesRegistre().forEach(function (s) { noms[s.id] = s.nom; });
    var faits = [];
    Object.keys(e.suivi || {}).forEach(function (id) {
      var carte = carteDe(id) || {};
      ((e.suivi[id] || {}).anomalies || []).forEach(function (a) {
        var m = String(a.detail || "").match(/v[ée]hicule\s+([A-Z0-9][A-Z0-9 -]*[A-Z0-9])/i);
        faits.push({ date: a.date || "", src: a.src || "", type: a.type || "", nom: noms[id] || id,
          carte: carte.numero || "", veh: m ? m[1] : "", detail: a.detail || "" });
      });
    });
    /* Les faits du registre des véhicules (conduite sans carte lue dans le
       fichier du tachygraphe) y figurent aussi, sous leur immatriculation, avec
       le conducteur à établir (ajouté le 27 novembre 2026). */
    Object.keys(e.suiviVehicules || {}).forEach(function (immat) {
      ((e.suiviVehicules[immat] || {}).anomalies || []).forEach(function (a) {
        faits.push({ date: a.date || "", src: "Fichier du véhicule", type: a.type || "",
          nom: "à établir", carte: "", veh: immat, detail: a.detail || "" });
      });
    });
    faits.sort(function (x, y) { return x.date < y.date ? -1 : x.date > y.date ? 1 : (x.nom < y.nom ? -1 : x.nom > y.nom ? 1 : 0); });
    var lignes = faits.map(function (f, i) {
      var jma = /^\d{4}-\d{2}-\d{2}/.test(f.date) ? f.date.slice(8, 10) + "/" + f.date.slice(5, 7) + "/" + f.date.slice(0, 4) : f.date;
      var typ = f.type ? f.type.charAt(0).toUpperCase() + f.type.slice(1) : "";
      return [String(i + 1), "", f.src, jma, "", "", "", "", "", typ, "", f.nom, f.carte, f.veh, f.detail, ""];
    });
    var feuilles = [
      { titre: "Infractions", lignes: [cols].concat(lignes),
        largeurs: [5, 14, 22, 12, 10, 10, 15, 11, 12, 30, 14, 22, 20, 14, 44, 34] },
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

  /* ───────────── les documents disciplinaires, à partir des infractions ─────

     De la fiche d'un conducteur, on sort le rapport qui lui est remis à signer,
     qui liste ses infractions et vaut mise en garde ; puis, si la répétition ou
     la gravité l'exige, une sanction choisie dans une échelle, du plus léger au
     plus lourd. Les sanctions qui touchent au contrat (mise à pied, licenciement)
     ne se notifient pas sans entretien préalable : pour celles-là, le document
     produit est la convocation, pas la sanction. */
  var SANCTIONS = [
    { cle: "rappel", nom: "Rappel à l'ordre (mise en garde)", entretien: false, disciplinaire: false,
      note: "Mesure non disciplinaire, rappel écrit sans incidence sur le contrat. Peut être remise sans délai." },
    { cle: "avertissement", nom: "Avertissement", entretien: false, disciplinaire: true,
      note: "Sanction notifiée par écrit, dans les deux mois de la connaissance des faits (" + art("L1332-4") + ")." },
    { cle: "blame", nom: "Blâme", entretien: false, disciplinaire: true,
      note: "Sanction notifiée par écrit, dans les deux mois de la connaissance des faits (" + art("L1332-4") + ")." },
    { cle: "miseapied", nom: "Mise à pied disciplinaire", entretien: true, disciplinaire: true,
      note: "Sanction notifiée après l'entretien préalable, ni moins de deux jours ouvrables ni plus d'un mois après le jour fixé (L. 1332-2)." },
    { cle: "licenciement", nom: "Licenciement pour faute", entretien: true, disciplinaire: true,
      note: "Licenciement disciplinaire notifié après l'entretien préalable, ni moins de deux jours ouvrables ni plus d'un mois après le jour fixé (L. 1332-2)." },
  ];

  function lignesInfractions(id) {
    return suiviConducteur(id).anomalies.map(function (a) {
      return [a.date || "", a.type || "", a.detail || ""];
    });
  }
  function bandeauEntreprise() {
    var p = profil();
    var sous = [p.adresse || p.siege, p.siret ? "SIRET : " + p.siret : ""].filter(Boolean).join("  ·  ");
    return { k: "bandeau", t: p.denomination || p.raisonSociale || "[Entreprise]", sous: sous };
  }
  function salDe(id) {
    return salariesRegistre().filter(function (x) { return x.id === id; })[0] || { nom: id, poste: "" };
  }
  /* La ville, tirée de la fiche d'entreprise : après le code postal de
     l'adresse, sinon le dernier segment. */
  function ville() {
    var p = profil();
    if (p.ville) return p.ville;
    var a = String(p.adresse || p.siege || "");
    var m = a.match(/\d{5}\s+(.+?)\s*$/);
    if (m) return m[1].trim();
    var parts = a.split(",");
    var der = parts.length ? parts[parts.length - 1].replace(/\d{5}/, "").trim() : "";
    return der || "[LIEU]";
  }
  function dateFr() {
    try { return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date()); }
    catch (e) { return iso(new Date()); }
  }

  /* LE RAPPORT AU CONDUCTEUR, VALANT MISE EN GARDE. */
  function enWordRapport(id) {
    if (!window.AuditExport) return false;
    var sal = salDe(id), ls = lignesInfractions(id);
    var items = [bandeauEntreprise(),
      { k: "h1", t: "MISE EN GARDE" },
      { k: "p", t: sal.nom + (sal.poste ? ", " + sal.poste : "") },
      { k: "p", t: "Les relevés de votre tachygraphe (carte de conducteur et unité véhicule) font apparaître les infractions suivantes :" }];
    if (ls.length) items.push({ k: "table", head: ["Date", "Infraction", "Détail"], rows: ls });
    else items.push({ k: "p", t: "Aucune infraction relevée à ce jour." });
    items.push({ k: "p", t: "Il vous est demandé de ne pas réitérer ces manquements. Pour mémoire, les règles à respecter : conduite continue de 4 h 30 au plus, suivie de 45 minutes de pause ; conduite journalière de 9 heures, 10 heures deux fois par semaine au plus ; repos journalier de 11 heures et repos de fin de semaine de 45 heures, hors cabine ; carte de conducteur insérée à tout déplacement." });
    items.push({ k: "p", t: "En cas de nouvelle infraction, une sanction disciplinaire pourra être prononcée." });
    items.push({ k: "p", t: "Le conducteur reconnaît avoir reçu la présente mise en garde." });
    items.push({ k: "p", t: "Fait à " + ville() + ", le " + dateFr() + "." });
    items.push({ k: "p", t: "Signature du conducteur :" });
    window.AuditExport.telecharger(
      window.AuditExport.docx(items, "Mise en garde - " + sal.nom, { sansTitre: false }),
      "mise-en-garde-" + id + "-" + iso(new Date()) + ".docx");
    return true;
  }

  /* LA SANCTION CHOISIE, OU LA CONVOCATION QUAND L'ENTRETIEN EST REQUIS. */
  /* lignes, facultatif : les seuls faits retenus, quand l'employeur en a écarté
     ou que certains sont prescrits. Sans lui, tous les faits de la fiche. */
  /* LA CONVOCATION À L'ENTRETIEN PRÉALABLE, ET L'ASSISTANCE DU SALARIÉ.

     Consignes du 21 novembre 2026. La convocation est celle du droit commun,
     quelle que soit la sanction que l'employeur retiendra ensuite : elle vise
     « une mesure disciplinaire pouvant aller jusqu'au licenciement », et le
     salarié ne sait pas, en la recevant, laquelle sera prise. Elle dit qu'il
     peut se faire assister, et donne les adresses où se trouve la liste des
     conseillers.

     Les textes : « La lettre de convocation à l'entretien préalable adressée au
     salarié mentionne la possibilité de recourir à un conseiller du salarié et
     précise l'adresse des services dans lesquels la liste de ces conseillers
     est tenue à sa disposition » (L. 1232-4, LEGIARTI000006901002). Cette
     liste est tenue « dans chaque section d'inspection du travail et dans
     chaque mairie » (D. 1232-5, LEGIARTI000018537714). Les deux adresses sont
     dues : « l'omission d'une de ces adresses constitue une irrégularité de
     procédure » (Cass. soc., 29 avril 2003, n° 01-41.364 ; 21 janvier 2009,
     n° 07-42.985).

     La rédaction est celle de la convocation envoyée le 15 novembre 2026,
     reprise mot pour mot, avec ses deux adresses : la mairie d'Argenteuil et
     l'inspection du travail du Val-d'Oise. Pour un autre département,
     l'inspection est celle que porte la fiche d'entreprise (orgInspection) ; à
     défaut, et pour une autre commune, l'adresse reste à compléter, entre
     crochets : une lettre ne part pas avec un crochet. */
  var MAIRIES_CONSEILLERS = { "argenteuil": "12-14 Bd Léon Feix, 95100 Argenteuil" };
  var INSPECTIONS_TRAVAIL = { "95": "Immeuble Atrium, 3, boulevard de l'Oise, CS 20305, 95014 Cergy-Pontoise Cedex" };
  function assistanceEntretien() {
    var p = profil(), adr = String(p.adresse || p.siege || "");
    var cp = (adr.match(/\b(\d{5})\b/) || [])[1] || "";
    var commune = ville().toLowerCase().replace(/\s+cedex.*$/, "").trim();
    var mairie = MAIRIES_CONSEILLERS[commune] || "[adresse de la mairie]";
    var inspection = INSPECTIONS_TRAVAIL[cp.slice(0, 2)] || net(p.orgInspection) || "[adresse de l'inspection du travail]";
    return [
      { k: "p", t: "Lors de cet entretien, vous pourrez vous faire assister par une personne de votre choix appartenant au personnel de l'entreprise, ou, à défaut de représentants du personnel, par un conseiller du salarié figurant sur la liste départementale" },
      { k: "puce", t: "liste disponible à la mairie : " + mairie },
      { k: "puce", t: "l'inspection du travail : " + inspection }
    ];
  }
  /* Le courrier d'une étape de la procédure. « convocation » rend la
     convocation à l'entretien préalable, la même quelle que soit la suite
     (consigne du 21 novembre 2026 : la sanction se choisit après l'entretien).
     Une sanction rend sa lettre de notification quand l'application sait
     l'écrire : rappel à l'ordre, avertissement, blâme. Pour la mise à pied et
     le licenciement, la lettre n'est pas produite ici : la fonction rend null,
     et l'écran le dit. */
  function sanctionItems(id, cle, lignes, entretien) {
    var convocation = cle === "convocation";
    var s = convocation ? null : SANCTIONS.filter(function (x) { return x.cle === cle; })[0];
    if (!convocation && (!s || s.entretien)) return null;
    var sal = salDe(id), ls = lignes || lignesInfractions(id);
    var items = [bandeauEntreprise()];
    if (convocation) {
      items.push({ k: "h1", t: "CONVOCATION À ENTRETIEN PRÉALABLE" });
      items.push({ k: "p", t: sal.nom + (sal.poste ? ", " + sal.poste : "") });
      items.push({ k: "p", t: "Objet : Convocation à un entretien préalable à une éventuelle sanction disciplinaire" });
      items.push({ k: "p", t: "Nous vous informons que nous envisageons de prendre à votre encontre une mesure disciplinaire pouvant aller jusqu'au licenciement." });
      if (ls.length) {
        items.push({ k: "p", t: "Les faits suivants ont été relevés sur les données de votre tachygraphe :" });
        items.push({ k: "table", head: ["Date", "Infraction", "Détail"], rows: ls });
      }
      var jourEntretien = "[DATE]";
      if (entretien) { try { jourEntretien = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(entretien + "T12:00:00")); } catch (err) { jourEntretien = entretien; } }
      var locaux = net(profil().adresse || profil().siege) || "[LIEU]";
      items.push({ k: "p", t: "Conformément aux dispositions de l'article L.1232-2 du Code du travail, nous vous convoquons à un entretien préalable, destiné à recueillir vos explications." });
      items.push({ k: "p", t: "Cet entretien se tiendra le " + jourEntretien + " à [HEURE], dans nos locaux situés " + locaux + "." });
      assistanceEntretien().forEach(function (x) { items.push(x); });
      items.push({ k: "p", t: "Fait à " + ville() + ", le " + dateFr() + "." });
      items.push({ k: "p", t: "Pour l'entreprise :" });
    } else {
      items.push({ k: "h1", t: s.nom.toUpperCase() });
      items.push({ k: "p", t: sal.nom + (sal.poste ? ", " + sal.poste : "") });
      items.push({ k: "p", t: "Les faits suivants, relevés sur les données de votre tachygraphe, vous sont reprochés :" });
      if (ls.length) items.push({ k: "table", head: ["Date", "Infraction", "Détail"], rows: ls });
      else items.push({ k: "p", t: "Aucune infraction relevée." });
      items.push({ k: "p", t: "En conséquence, nous vous notifions " +
        (s.cle === "rappel" ? "un rappel à l'ordre" : "un " + s.nom.toLowerCase()) + "." });
      items.push({ k: "note", t: s.note });
      items.push({ k: "p", t: "Le conducteur reconnaît avoir reçu la présente notification." });
      items.push({ k: "p", t: "Fait à " + ville() + ", le " + dateFr() + "." });
      items.push({ k: "p", t: "Signature du conducteur :" });
    }
    return items;
  }
  function enWordSanction(id, cle, lignes, entretien) {
    if (!window.AuditExport) return false;
    var convocation = cle === "convocation";
    var s = convocation ? { entretien: true, nom: "Convocation" } : SANCTIONS.filter(function (x) { return x.cle === cle; })[0], items = sanctionItems(id, cle, lignes, entretien);
    if (!s || !items) return false;
    var sal = salDe(id);
    /* Le nom du fichier d'une convocation ne dit pas la sanction envisagée :
       le salarié qui le reçoit ne doit pas la lire dans le nom. */
    window.AuditExport.telecharger(
      window.AuditExport.docx(items, (s.entretien ? "Convocation - " : s.nom + " - ") + sal.nom, { sansTitre: false }),
      (s.entretien ? "convocation-entretien-prealable" : "sanction-" + cle) + "-" + id + "-" + iso(new Date()) + ".docx");
    return true;
  }
  /* Un document Word quelconque à l'en-tête de l'entreprise : sert au compte
     rendu du passé disciplinaire. */
  function telechargerWord(items, titre, fichier) {
    if (!window.AuditExport) return false;
    window.AuditExport.telecharger(window.AuditExport.docx([bandeauEntreprise()].concat(items), titre, { sansTitre: false }), fichier);
    return true;
  }

  /* La sanction proposée d'office, d'après les infractions du conducteur : un
     rappel s'il n'y a rien de grave ni de répété, sinon une sanction. */
  function sanctionProposee(id) {
    var anos = suiviConducteur(id).anomalies;
    if (!anos.length) return "rappel";
    var grave = anos.some(function (a) { return /grave|plus grave|excès de vitesse|sans carte|alcool/i.test(a.type + " " + a.detail); });
    var par = {};
    anos.forEach(function (a) { var t = (a.type || "").toLowerCase(); par[t] = (par[t] || 0) + 1; });
    var recidive = Object.keys(par).some(function (t) { return par[t] >= 2; });
    if (grave) return "miseapied";
    if (recidive) return "avertissement";
    return "rappel";
  }

  /* ───────── la fiche du conducteur : profil, documents à détenir et à remettre

     Le profil (poids lourd ou léger, marchandises dangereuses) commande les
     listes : ce que le conducteur doit détenir lui-même, avec la date de
     validité et l'alerte, et ce qu'on lui remet à signer. Le profil par défaut
     suit le poste du registre ; il reste modifiable. */
  /* LA FICHE QUE LE CONDUCTEUR A REMPLIE (27 novembre 2026). Le profil
     poids lourd, les dates de ses papiers et le numéro de sa carte étaient
     redemandés ici alors qu'il les avait donnés dans sa fiche : ils en
     viennent désormais, tant que rien n'a été saisi sur cet écran. */
  function ficheC(id) {
    var T = lire("flotte-conducteurs", {}) || {};
    return T[id] || {};
  }
  function profilConducteur(id) {
    var e = etat(), s = (e.suivi && e.suivi[id]) || {}, pr = s.profil || {};
    var sal = salDe(id), pf = net(ficheC(id).profil);
    var defaut = pf === "pl" ? true : (pf === "leger" ? false : !!sal.poidsLourd);
    return { pl: (pr.pl != null) ? pr.pl : defaut, adr: !!pr.adr };
  }
  function setProfilConducteur(id, champ, val) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.profil = s.profil || {};
    if (s.profil.pl == null) s.profil.pl = !!salDe(id).poidsLourd;
    s.profil[champ] = val; e.suivi[id] = s; garderEtat(e);
  }
  function echeancesDoc(id) {
    var e = etat(), s = (e.suivi && e.suivi[id]) || {}, d = s.docsEch || {}, f = ficheC(id), out = {};
    Object.keys(d).forEach(function (k) { out[k] = d[k]; });
    [["permis", "permisFin"], ["qualif", "carteQualif"], ["carte", "carteCond"], ["medical", "visitePermisFin"]].forEach(function (x) {
      if (!out[x[0]] && net(f[x[1]])) out[x[0]] = net(f[x[1]]);
    });
    return out;
  }
  function porterEcheanceDoc(id, cle, date) {
    var e = etat(); e.suivi = e.suivi || {}; var s = e.suivi[id] || {};
    s.docsEch = s.docsEch || {}; s.docsEch[cle] = date; e.suivi[id] = s; garderEtat(e);
  }
  function statutDoc(dateStr) {
    if (!dateStr) return { fond: "gris", txt: "à renseigner" };
    var q = qualifier(dateStr);
    var txt = q.etat === "dépassé" ? "expiré"
      : q.etat === "proche" ? "échoit dans " + q.jours + " j" : "valable (" + q.jours + " j)";
    return { fond: q.fond, txt: txt };
  }
  function docsADetenir(pr) {
    var L = [["permis", "Permis de conduire valide", pr.pl ? "catégorie C ou CE" : "catégorie B ou C"],
      ["qualif", "Carte de qualification (FIMO/FCO)", "à renouveler tous les 5 ans"]];
    if (pr.pl) L.push(["carte", "Carte de conducteur (tachygraphe)", "personnelle, valable 5 ans"]);
    if (pr.adr) L.push(["adrcert", "Certificat de formation ADR", "en cours de validité"]);
    L.push(["medical", "Visite médicale d'aptitude", "à jour"]);
    return L;
  }
  function docsARemettre(pr) {
    var L = [["consigne", "Consigne de conduite" + (pr.pl ? " avec carte" : "")],
      ["note", "Note de service, rappel de la réglementation"],
      ["formation", "Attestation de formation"]];
    if (pr.adr) L.push(["adrform", "Attestation de formation ADR (1.3)"]);
    L.push(["memo", "Mémo des documents à bord"]);
    if (!pr.pl) L.push(["livret", "Livret individuel de contrôle"]);
    return L;
  }

  /* LE DOCUMENT NOMINATIF À REMETTRE, à l'en-tête de l'entreprise. */
  function docConducteurItems(id, kind) {
    var sal = salDe(id), nom = sal.nom;
    var items = [bandeauEntreprise()];
    if (kind === "consigne") {
      items.push({ k: "h1", t: "CONSIGNE DE CONDUITE AVEC CARTE" });
      items.push({ k: "p", t: "Remise à " + nom + ", à signer et à verser au dossier individuel." });
      items.push({ k: "h2", t: "La carte de conducteur" });
      items.push({ k: "p", t: "Insérée avant tout déplacement, y compris une manœuvre au dépôt, retirée en fin de service. Personnelle, elle ne se prête pas. Aucun déplacement carte retirée." });
      items.push({ k: "h2", t: "Les temps de conduite et de repos" });
      items.push({ k: "p", t: "Conduite continue 4 h 30 au plus, puis 45 minutes de pause. Par jour 9 heures, 10 heures deux fois par semaine. Repos 11 heures par jour, repos de fin de semaine 45 heures, hors cabine." });
      items.push({ k: "h2", t: "Le sélecteur d'activités" });
      items.push({ k: "p", t: "Activités saisies au moment où elles changent. Aucune manipulation du dispositif." });
      items.push({ k: "p", t: "Le conducteur reconnaît avoir reçu et compris la présente consigne." });
    } else if (kind === "note") {
      items.push({ k: "h1", t: "NOTE DE SERVICE" });
      items.push({ k: "p", t: "À l'attention de " + nom + ". Rappel des règles à respecter, dont le respect est une obligation professionnelle." });
      items.push({ k: "h2", t: "Carte de conducteur" });
      items.push({ k: "p", t: "Insérée avant tout déplacement, y compris une manœuvre au dépôt, retirée en fin de service. Personnelle, elle ne se prête pas. Aucun déplacement carte retirée." });
      items.push({ k: "h2", t: "Temps de conduite" });
      items.push({ k: "p", t: "Conduite continue : 4 h 30 au maximum, puis une pause de 45 minutes (ou 15 puis 30 minutes). Par jour : 9 heures, portées à 10 heures deux fois par semaine au plus. Par semaine : 56 heures, et 90 heures sur deux semaines consécutives." });
      items.push({ k: "h2", t: "Temps de repos" });
      items.push({ k: "p", t: "Repos journalier : 11 heures d'affilée, réductible à 9 heures trois fois au plus entre deux repos de fin de semaine. Repos de fin de semaine : 45 heures, réductible à 24 heures une semaine sur deux avec compensation, et pris hors du véhicule." });
      items.push({ k: "h2", t: "Téléchargements" });
      items.push({ k: "p", t: "La carte de conducteur est relevée tous les 28 jours, le tachygraphe du véhicule tous les 90 jours." });
      items.push({ k: "h2", t: "Sélecteur d'activités" });
      items.push({ k: "p", t: "Les changements d'activité sont saisis au moment où ils interviennent. Aucune manipulation du dispositif n'est tolérée." });
      if (profilConducteur(id).adr) {
        items.push({ k: "h2", t: "Marchandises dangereuses (ADR)" });
        items.push({ k: "p", t: "Consignes écrites à bord, équipements de sécurité conformes (dont extincteur), colis correctement marqués et étiquetés, chargement arrimé et calé, et certificat de formation ADR (sensibilisation 1.3) à jour." });
      }
    } else if (kind === "formation") {
      items.push({ k: "h1", t: "ATTESTATION DE FORMATION" });
      items.push({ k: "p", t: "Atteste que " + nom + " a reçu la formation à la réglementation sociale, émargée et datée, à l'embauche puis en rappel." });
      items.push({ k: "p", t: "La formation a porté sur : l'usage de la carte de conducteur et du sélecteur d'activités ; les temps de conduite (4 h 30 en continu avec pause de 45 minutes, 9 heures par jour, 10 heures deux fois par semaine, 56 heures par semaine) ; les temps de repos (11 heures par jour, 45 heures en fin de semaine, hors cabine) ; et les téléchargements périodiques de la carte et du véhicule." });
    } else if (kind === "adrform") {
      items.push({ k: "h1", t: "ATTESTATION DE FORMATION ADR" });
      items.push({ k: "p", t: "Atteste que " + nom + " a suivi la formation de sensibilisation générale au transport de marchandises dangereuses (chapitre 1.3 de l'ADR), émargée et datée." });
      items.push({ k: "p", t: "La formation a porté sur : les dispositions générales de l'ADR, les principaux types de dangers, la prévention et la sécurité, les mesures à prendre en cas d'accident (premiers secours, sécurité routière, usage des équipements de protection), le marquage, l'étiquetage et la signalisation, et les documents de transport à détenir à bord." });
    } else if (kind === "memo") {
      items.push({ k: "h1", t: "DOCUMENTS À BORD" });
      items.push({ k: "p", t: "À vérifier à chaque départ par " + nom + " : permis, carte de conducteur ou livret, carte de qualification (FIMO/FCO), certificat d'immatriculation et contrôle technique, assurance, lettre de voiture, justificatif de location. Pour l'ADR : consignes écrites, certificat de formation, document de transport." });
    } else if (kind === "livret") {
      items.push({ k: "h1", t: "LIVRET INDIVIDUEL DE CONTRÔLE" });
      items.push({ k: "p", t: "Ouvert au nom de " + nom + ". Pour un véhicule léger non équipé de chronotachygraphe, le conducteur y inscrit, jour par jour : l'heure de début et de fin de service, les temps de conduite, les autres travaux, les pauses et les repos, et le total de la semaine." });
      items.push({ k: "p", t: "Les mêmes limites s'appliquent : conduite journalière, pauses après 4 h 30 de conduite continue, et repos. Le livret est tenu à jour chaque jour et présenté à tout contrôle." });
    } else { return null; }
    items.push({ k: "p", t: "Fait à " + ville() + ", le " + dateFr() + "." });
    items.push({ k: "p", t: "Signature du conducteur :" });
    return items;
  }
  function enWordDocConducteur(id, kind) {
    if (!window.AuditExport) return false;
    var sal = salDe(id), nom = sal.nom, d = jour(), items = docConducteurItems(id, kind);
    if (!items) return false;
    window.AuditExport.telecharger(
      window.AuditExport.docx(items, kind + " - " + nom, { sansTitre: false }),
      "doc-" + kind + "-" + id + "-" + d + ".docx");
    return true;
  }
  function jour() { return iso(new Date()); }

  window.ConformiteTransport = {
    SANCTIONS: SANCTIONS,
    enWordRapport: enWordRapport,
    enWordSanction: enWordSanction,
    sanctionItems: sanctionItems,
    telechargerWord: telechargerWord,
    docConducteurItems: docConducteurItems,
    essaiEnCours: essaiEnCours,
    commencerEssai: commencerEssai,
    annulerEssai: annulerEssai,
    garderEssai: garderEssai,
    noterDocEssai: noterDocEssai,
    majAnomalies: majAnomalies,
    majMesure: majMesure,
    docsRemis: docsRemis,
    porterDocRemis: porterDocRemis,
    journalControles: journalControles,
    ajouterControle: ajouterControle,
    carteDe: carteDe,
    porterCarte: porterCarte,
    sanctionProposee: sanctionProposee,
    profilConducteur: profilConducteur,
    setProfilConducteur: setProfilConducteur,
    echeancesDoc: echeancesDoc,
    porterEcheanceDoc: porterEcheanceDoc,
    statutDoc: statutDoc,
    docsADetenir: docsADetenir,
    docsARemettre: docsARemettre,
    enWordDocConducteur: enWordDocConducteur,
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
    /* Tous les salariés du registre, conducteurs ou non : la page des
       salariés en a besoin, le suivi tachygraphe non. */
    tousSalaries: salariesTous,
    CATEGORIES: CATEGORIES,
    conducteurs: conducteurs,
    suiviConducteur: suiviConducteur,
    etatConducteur: etatConducteur,
    ajouterAnomalie: ajouterAnomalie,
    ajouterMesure: ajouterMesure,
    supprimerAnomalie: supprimerAnomalie,
    supprimerMesure: supprimerMesure,
    matchConducteur: matchConducteur,
    importerAnomalies: importerAnomalies,
    anomaliesRetenues: anomaliesRetenues,
    porterJoursVehicule: porterJoursVehicule,
    joursVehiculePourCarte: joursVehiculePourCarte,
    anomaliesVehicule: anomaliesVehicule,
    importerAnomaliesVehicule: importerAnomaliesVehicule,
    supprimerAnomalieVehicule: supprimerAnomalieVehicule,
    viderAnomaliesVehicule: viderAnomaliesVehicule,
    enWordSuivi: enWordSuivi,
    DELAI_CARTE: DELAI_CARTE, DELAI_VEHICULE: DELAI_VEHICULE,
  };
})(window);
