/* LA LECTURE D'UN TÉLÉCHARGEMENT D'UNITÉ VÉHICULE (.V1B / .ddd véhicule).

   POURQUOI CE FICHIER EXISTE

   Le fichier de la carte dit ce qu'un conducteur a fait. Le fichier du
   tachygraphe du véhicule dit ce que le véhicule a fait, y compris quand il a
   roulé sans aucune carte insérée : c'est le seul endroit où la conduite sans
   carte se lit, puisque, par définition, aucune carte ne l'a enregistrée. On en
   tire ici l'identification du véhicule, la période couverte, les conducteurs et
   les cartes qui l'ont utilisé, l'activité jour par jour, et surtout la conduite
   sans carte par jour. Ce sont des éléments prêts pour le suivi et pour la
   défense en cas de contrôle.

   SUR QUOI C'EST ÉCRIT

   Le format n'a pas été deviné : il vient de l'annexe 1B du règlement (CEE)
   n° 1360/2002, reprise et complétée par le règlement (UE) n° 165/2014 et son
   annexe 1C. Un téléchargement de véhicule est une suite de blocs ; chaque bloc
   commence par l'octet 0x76 suivi de l'identifiant de transfert (TREP). La
   première génération écrit les données sans longueur, chaque bloc étant suivi
   d'une signature de 128 octets. La deuxième génération écrit chaque bloc en
   tableaux d'enregistrements (type sur un octet, taille sur deux, nombre sur
   deux), la signature étant elle-même un de ces tableaux. Tous les entiers sont
   en gros-boutiste ; les dates TimeReal sont le nombre de secondes depuis le
   1er janvier 1970.

   CE QUI EST LU, ET CE QUI NE L'EST PAS

   On lit l'identification (numéro de châssis, immatriculation, pays), la période
   téléchargeable, les cartes et conducteurs enregistrés, l'activité journalière
   et la conduite sans carte. La signature n'est pas vérifiée : le fichier est lu
   pour son contenu, la preuve de son intégrité reste l'unité véhicule et sa
   carte entreprise. Rien n'est affirmé qui ne se lise dans les octets.          */

(function (root) {
  "use strict";

  var ACTIVITE = { 0: "repos", 1: "disponibilité", 2: "travail", 3: "conduite" };

  /* Les codes d'événement et de défaut (EventFaultType, appendice 1), repris des
     mots de l'annexe. Ceux qu'on ne nomme pas sont rendus par leur code. */
  var CODES = {
    0x00: "Renseignement général, pas d'information complémentaire",
    0x01: "Insertion d'une carte non valide",
    0x02: "Conflit de cartes",
    0x03: "Chevauchement horaire",
    0x04: "Conduite sans carte appropriée",
    0x05: "Insertion de la carte pendant la conduite",
    0x06: "Dernière session de carte mal clôturée",
    0x07: "Excès de vitesse",
    0x08: "Coupure de l'alimentation électrique",
    0x09: "Erreur sur les données de mouvement",
    0x0A: "Conflit de mouvement du véhicule",
    0x0B: "Dépassement du temps de conduite",
    0x0C: "Conflit de temps",
  };
  /* Les plages de l'annexe 1C (appendice 1, EventFaultType) : 0x10 à 0x1f
     atteinte à la sécurité côté unité véhicule, 0x20 à 0x2f côté capteur, 0x30 à
     0x3f défaut de l'appareil, 0x40 à 0x4f défaut de carte, 0x80 à 0xff propre au
     constructeur. */
  function nommerCode(c) {
    if (CODES[c] != null) return CODES[c];
    if (c >= 0x10 && c <= 0x1f) return "Tentative d'atteinte à la sécurité, unité véhicule (code 0x" + hex(c) + ")";
    if (c >= 0x20 && c <= 0x2f) return "Tentative d'atteinte à la sécurité, capteur (code 0x" + hex(c) + ")";
    if (c >= 0x30 && c <= 0x3f) return "Défaut de l'appareil de contrôle (code 0x" + hex(c) + ")";
    if (c >= 0x40 && c <= 0x4f) return "Défaut de carte (code 0x" + hex(c) + ")";
    if (c >= 0x80) return "Code propre au constructeur (0x" + hex(c) + ")";
    return "Événement ou défaut, code 0x" + hex(c);
  }
  function hex(n) { var s = n.toString(16).toUpperCase(); return s.length < 2 ? "0" + s : s; }

  /* ─────────────────────────── lecture bas niveau ───────────────────────── */

  function vue(buf) {
    if (buf instanceof ArrayBuffer) return new Uint8Array(buf);
    if (buf && buf.buffer instanceof ArrayBuffer) return new Uint8Array(buf.buffer, buf.byteOffset || 0, buf.byteLength);
    return new Uint8Array(buf || []);
  }
  function u16(a, o) { return (a[o] << 8) | a[o + 1]; }
  function u24(a, o) { return (a[o] << 16) | (a[o + 1] << 8) | a[o + 2]; }
  function u32(a, o) { return (a[o] * 0x1000000) + (a[o + 1] << 16) + (a[o + 2] << 8) + a[o + 3]; }
  function timeReal(a, o) {
    var s = u32(a, o);
    if (!s) return null;
    return new Date(s * 1000).toISOString().slice(0, 10);
  }
  function texte(a, o, n) {
    /* Nom ou chaîne : le premier octet est la page de code, on le passe. */
    var s = "";
    for (var i = 1; i < n; i++) { var c = a[o + i]; if (c === 0x00 || c === 0xff) continue; s += String.fromCharCode(c); }
    return s.replace(/\s+/g, " ").trim();
  }
  function ascii(a, o, n) {
    var s = "";
    for (var i = 0; i < n; i++) { var c = a[o + i]; if (c === 0x00 || c === 0xff) continue; s += String.fromCharCode(c); }
    return s.replace(/\s+/g, " ").trim();
  }

  /* ─────────────────────── un changement d'activité ─────────────────────── */

  /* ActivityChangeInfo, deux octets : « scpaa ttttttttttt ».
     s = emplacement (0 conducteur, 1 convoyeur), c = équipage, p = carte
     (0 insérée, 1 absente), aa = activité, t = minute du changement. */
  function changement(mot) {
    return { slot: (mot >> 15) & 1, equipage: (mot >> 14) & 1,
      carteAbsente: (mot >> 13) & 1, activite: (mot >> 11) & 3, minute: mot & 0x07ff };
  }

  /* La conduite sans carte d'un jour : somme des minutes où l'activité est la
     conduite alors qu'aucune carte n'est insérée dans l'emplacement conducteur. */
  function conduiteSansCarte(mots) {
    var liste = mots.map(changement).filter(function (c) { return c.slot === 0; });
    var total = 0;
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].carteAbsente === 1 && liste[i].activite === 3) {
        var deb = liste[i].minute;
        var fin = (i + 1 < liste.length) ? liste[i + 1].minute : 1440;
        if (fin > deb) total += fin - deb;
      }
    }
    return total;
  }

  function minutesParActivite(mots) {
    var liste = mots.map(changement).filter(function (c) { return c.slot === 0; });
    var m = { conduite: 0, travail: 0, "disponibilité": 0, repos: 0 };
    for (var i = 0; i < liste.length; i++) {
      var deb = liste[i].minute, fin = (i + 1 < liste.length) ? liste[i + 1].minute : 1440;
      var d = fin - deb; if (d < 0) d = 0;
      m[ACTIVITE[liste[i].activite]] += d;
    }
    return m;
  }

  /* ───────────────────────── première génération ────────────────────────── */

  var SIG1 = 128;                 /* signature RSA qui clôt chaque bloc gen1 */
  var IWREC1 = 129;               /* un enregistrement d'insertion-retrait de carte */

  /* Un enregistrement d'insertion-retrait, gen1 : nom (72) + numéro de carte
     (type 1 + pays 1 + numéro 16) + le reste qu'on n'exploite pas ici. */
  function carteIW1(a, o) {
    var nom = texte(a, o, 36), prenoms = texte(a, o + 36, 36);
    var numero = ascii(a, o + 72 + 2, 16);
    return { titulaire: (nom + (prenoms ? " " + prenoms : "")).trim(), numero: numero };
  }

  function jourGen1(a, o) {
    var p = o + 2;
    var date = timeReal(a, p); p += 4;
    p += 3;                                   /* odomètre minuit */
    var niw = u16(a, p); p += 2;
    var cartes = [];
    for (var k = 0; k < niw; k++) { cartes.push(carteIW1(a, p)); p += IWREC1; }
    var nch = u16(a, p); p += 2;
    var mots = [];
    for (var j = 0; j < nch; j++) { mots.push(u16(a, p)); p += 2; }
    var nplace = a[p]; p += 1 + nplace * 28;  /* VuPlaceDailyWorkPeriodRecord */
    var nspec = u16(a, p); p += 2 + nspec * 5;
    return { date: date, cartes: cartes, mots: mots, fin: p };
  }

  function lireGen1(a) {
    var res = { generation: 1, vin: null, immatriculation: null, pays: null,
      periode: null, cartes: [], jours: [], evenements: [], defauts: [], survitesses: [] };
    /* Overview : certificats 194+194, VIN 17, immatriculation (nation 1 + 14),
       currentDateTime 4, période téléchargeable (min 4 + max 4). */
    res.vin = ascii(a, 390, 17);
    res.pays = a[407];
    res.immatriculation = texte(a, 408, 14);
    res.courant = timeReal(a, 422);
    res.periode = { du: timeReal(a, 426), au: timeReal(a, 430) };
    /* Les blocs journaliers : on part du premier 0x7602 et on avance. */
    var o = indexDe(a, 0x02, 0);
    var vus = {};
    while (o >= 0 && o + 2 <= a.length && a[o] === 0x76 && a[o + 1] === 0x02) {
      var j = jourGen1(a, o);
      if (j.date) {
        res.jours.push({ date: j.date, conduiteSansCarte: conduiteSansCarte(j.mots),
          minutes: minutesParActivite(j.mots) });
      }
      j.cartes.forEach(function (c) { if (c.numero && !vus[c.numero]) { vus[c.numero] = 1; res.cartes.push(c); } });
      o = j.fin + SIG1;
    }
    /* Événements et défauts : bloc 0x7603 (rempli par le décodeur dédié). */
    var oe = indexDe(a, 0x03, 0);
    if (oe >= 0) decoderEvenementsGen1(a, oe, res);
    return res;
  }

  function indexDe(a, trep, depuis) {
    for (var o = depuis; o + 1 < a.length; o++) if (a[o] === 0x76 && a[o + 1] === trep) return o;
    return -1;
  }

  /* ───────────────────────── deuxième génération ─────────────────────────── */

  /* Un bloc gen2 est une suite de tableaux d'enregistrements : type (1), taille
     (2), nombre (2), puis les données. On les déroule jusqu'au bout du bloc. */
  function tableaux(a, o) {
    var p = o + 2, out = [];
    while (p + 5 <= a.length) {
      var rt = a[p], rs = u16(a, p + 1), nr = u16(a, p + 3), tot = 5 + rs * nr;
      if (rs === 0 || rs > 4096 || nr > 20000 || p + tot > a.length) break;
      out.push({ rt: rt, rs: rs, nr: nr, debut: p + 5 });
      p += tot;
    }
    return { tableaux: out, fin: p };
  }

  function carteIW2(a, o, rs) {
    /* Nom (72) puis numéro de carte. Le numéro est à la fin du nom. */
    var nom = texte(a, o, 36), prenoms = texte(a, o + 36, 36);
    var numero = ascii(a, o + 72 + 2, 16);
    return { titulaire: (nom + (prenoms ? " " + prenoms : "")).trim(), numero: numero };
  }

  function lireGen2(a, trepOverview) {
    var res = { generation: (trepOverview === 0x31 ? "2v2" : "2"), vin: null, immatriculation: null,
      pays: null, periode: null, cartes: [], jours: [], evenements: [], defauts: [], survitesses: [] };
    var ov = tableaux(a, 0);
    ov.tableaux.forEach(function (t) {
      if (t.rt === 0x0a && t.rs >= 17) res.vin = ascii(a, t.debut, 17);
      if (t.rt === 0x24 && t.rs >= 15) { res.pays = a[t.debut]; res.immatriculation = texte(a, t.debut + 1, 14); }
      if (t.rt === 0x13 && t.rs >= 8) res.periode = { du: timeReal(a, t.debut), au: timeReal(a, t.debut + 4) };
    });
    var trepAct = (trepOverview & 0x0f) === 0x01 ? 0x32 : 0x32;  /* activités = 0x32 */
    var o = indexDe(a, 0x32, ov.fin - 2 < 0 ? 0 : 0);
    var vus = {};
    /* On déroule les blocs activités qui se suivent. */
    o = ov.fin;
    while (o + 2 <= a.length && a[o] === 0x76 && a[o + 1] === 0x32) {
      var bloc = tableaux(a, o);
      var date = null, mots = [];
      bloc.tableaux.forEach(function (t) {
        if (t.rt === 0x06 && t.rs === 4) date = timeReal(a, t.debut);
        if (t.rt === 0x01 && t.rs === 2) { for (var k = 0; k < t.nr; k++) mots.push(u16(a, t.debut + 2 * k)); }
        if (t.rt === 0x0d) { for (var m = 0; m < t.nr; m++) { var c = carteIW2(a, t.debut + m * t.rs, t.rs); if (c.numero && !vus[c.numero]) { vus[c.numero] = 1; res.cartes.push(c); } } }
      });
      if (date) res.jours.push({ date: date, conduiteSansCarte: conduiteSansCarte(mots), minutes: minutesParActivite(mots) });
      o = bloc.fin;
    }
    var oe = indexDe(a, 0x33, 0);
    if (oe >= 0) decoderEvenementsGen2(a, oe, res);
    return res;
  }

  /* ────────────── événements et défauts (complété par agents) ────────────── */

  /* Gen1, bloc 0x7603 : défauts, événements, survitesses. Les compteurs noOf…
     tiennent sur UN octet (vérifié par l'alignement sur la signature de 128
     octets, qui retombe pile sur le bloc 0x7605). */
  function decoderEvenementsGen1(a, o, res) {
    var p = o + 2;
    function ev(code, debut, fin) { return { code: code, nom: nommerCode(code), debut: debut, fin: fin }; }
    var nf = a[p]; p += 1;                       /* VuFaultRecord : 82 octets */
    for (var i = 0; i < nf; i++) { res.defauts.push(ev(a[p], timeReal(a, p + 2), timeReal(a, p + 6))); p += 82; }
    var nv = a[p]; p += 1;                        /* VuEventRecord : 83 octets */
    for (var j = 0; j < nv; j++) { res.evenements.push(ev(a[p], timeReal(a, p + 2), timeReal(a, p + 6))); p += 83; }
    p += 9;                                        /* vuOverSpeedingControlData */
    var ns = a[p]; p += 1;                /* VuOverSpeedingEventRecord : 31 octets */
    for (var k = 0; k < ns; k++) {
      res.survitesses.push({ code: a[p], nom: nommerCode(a[p]), debut: timeReal(a, p + 2), fin: timeReal(a, p + 6),
        vMax: a[p + 10], vMoyenne: a[p + 11] });
      p += 31;
    }
  }
  /* Gen2, bloc 0x7633 : tableaux d'enregistrements. Défauts rt 0x18 (90 o),
     événements rt 0x15 (91 o), survitesses rt 0x1b (32 o). Chaque record commence
     par type(1) + objet(1) + début TimeReal(4) + fin TimeReal(4). */
  function decoderEvenementsGen2(a, o, res) {
    var t = tableaux(a, o).tableaux;
    t.forEach(function (x) {
      var i, p;
      if (x.rt === 0x18 && x.rs >= 10) {
        for (i = 0; i < x.nr; i++) { p = x.debut + i * x.rs; res.defauts.push({ code: a[p], nom: nommerCode(a[p]), debut: timeReal(a, p + 2), fin: timeReal(a, p + 6) }); }
      } else if (x.rt === 0x15 && x.rs >= 10) {
        for (i = 0; i < x.nr; i++) { p = x.debut + i * x.rs; res.evenements.push({ code: a[p], nom: nommerCode(a[p]), debut: timeReal(a, p + 2), fin: timeReal(a, p + 6) }); }
      } else if (x.rt === 0x1b && x.rs >= 12) {
        for (i = 0; i < x.nr; i++) { p = x.debut + i * x.rs; res.survitesses.push({ code: a[p], nom: nommerCode(a[p]), debut: timeReal(a, p + 2), fin: timeReal(a, p + 6), vMax: a[p + 10], vMoyenne: a[p + 11] }); }
      }
    });
  }

  /* ─────────────────────────────── lecture ──────────────────────────────── */

  function estVehicule(a) { return a && a.length > 10 && a[0] === 0x76; }

  function lire(buf) {
    var a = vue(buf);
    if (!estVehicule(a)) return null;      /* ce n'est pas un téléchargement véhicule */
    var trep = a[1];
    if ((trep & 0xf0) === 0x00) return lireGen1(a);
    return lireGen2(a, trep);
  }

  /* ─────────────────────── l'analyse pour le suivi ──────────────────────── */

  function hhmm(min) { var h = Math.floor(min / 60), m = min % 60; return h + " h" + (m ? " " + (m < 10 ? "0" : "") + m : ""); }

  /* On ne retient en anomalie que la conduite sans carte d'au moins deux minutes
     par jour : les segments d'une minute tiennent à la bascule d'insertion et ne
     sont pas des faits exploitables. Seuil indicatif, ajustable. */
  var SEUIL_SANS_CARTE = 2;

  function analyser(vu) {
    if (!vu) return null;
    var anomalies = [];
    (vu.jours || []).forEach(function (j) {
      if (j.conduiteSansCarte >= SEUIL_SANS_CARTE) {
        anomalies.push({ date: j.date, source: "appareil", type: "conduite sans carte",
          detail: "Le véhicule " + (vu.immatriculation || "") + " a roulé " + hhmm(j.conduiteSansCarte) +
            " sans carte insérée le " + j.date + " (enregistrement de l'unité véhicule)." });
      }
    });
    (vu.evenements || []).forEach(function (e) {
      anomalies.push({ date: e.debut || "", source: "appareil", type: (e.nom || "").toLowerCase(),
        detail: "Événement enregistré par l'appareil : " + e.nom + (e.debut ? ", le " + e.debut : "") + "." });
    });
    (vu.defauts || []).forEach(function (e) {
      anomalies.push({ date: e.debut || "", source: "appareil", type: (e.nom || "").toLowerCase(),
        detail: "Défaut enregistré par l'appareil : " + e.nom + (e.debut ? ", le " + e.debut : "") + "." });
    });
    var dates = (vu.jours || []).map(function (j) { return j.date; }).filter(Boolean).sort();
    var totalSC = (vu.jours || []).reduce(function (s, j) { return s + (j.conduiteSansCarte || 0); }, 0);
    return {
      generation: vu.generation, vin: vu.vin, immatriculation: vu.immatriculation, pays: vu.pays,
      periode: vu.periode, telechargement: vu.courant || (vu.periode && vu.periode.au) || null,
      nbJours: dates.length, jours: vu.jours, cartes: vu.cartes || [],
      evenements: vu.evenements || [], defauts: vu.defauts || [], survitesses: vu.survitesses || [],
      joursSansCarte: (vu.jours || []).filter(function (j) { return j.conduiteSansCarte >= SEUIL_SANS_CARTE; }).length,
      totalSansCarte: totalSC, anomalies: anomalies, hhmm: hhmm,
    };
  }

  var API = { lire: lire, analyser: analyser, estVehicule: function (buf) { return estVehicule(vue(buf)); },
    conduiteSansCarte: conduiteSansCarte, hhmm: hhmm, CODES: CODES };

  if (root) root.LectureVehicule = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
