/* LA LECTURE D'UNE CARTE DE CONDUCTEUR (.ddd / .C1B).

   POURQUOI CE FICHIER EXISTE

   Le module de suivi relève les anomalies à la main. Ici, on lit directement
   le fichier téléchargé de la carte du conducteur et on en tire ce qui sert au
   suivi : qui est le conducteur, sur quelle période, le temps de conduite jour
   par jour, et surtout les événements et défauts que l'appareil a lui-même
   enregistrés (excès de vitesse, conduite sans carte, coupure d'alimentation).
   Ces enregistrements de l'appareil font foi : ce sont des anomalies prêtes à
   porter dans la fiche du conducteur.

   SUR QUOI C'EST ÉCRIT

   Le format n'a pas été deviné : il vient de l'annexe 1B du règlement (le
   règlement (CEE) n° 1360/2002, repris et complété par le règlement (UE)
   n° 165/2014 et son annexe 1C). Un fichier de carte est une suite de blocs,
   chacun précédé de l'identifiant du fichier élémentaire (deux octets), d'un
   octet qui distingue le contenu de sa signature, puis de la longueur sur deux
   octets. Tous les entiers sont en gros-boutiste. Les dates « TimeReal » sont
   le nombre de secondes depuis le 1er janvier 1970.

   CE QUI EST LU, ET CE QUI NE L'EST PAS

   On lit la partie première génération, présente aussi sur les cartes de
   deuxième génération : identification du titulaire, activités journalières,
   véhicules utilisés, événements et défauts. Les blocs propres à la deuxième
   génération (GNSS, données complémentaires) ne sont pas décodés, et la
   signature n'est pas vérifiée : le fichier est lu pour son contenu, la preuve
   de son intégrité reste la carte elle-même. Rien n'est affirmé qui ne se lise
   dans les octets du fichier.                                                 */

(function (root) {
  "use strict";

  /* Les identifiants de fichier élémentaire que l'on sait lire (génération 1,
     reprise telle quelle au début d'un fichier de génération 2). */
  var EF = {
    IDENTIFICATION: 0x0520,
    DRIVER_ACTIVITY: 0x0504,
    VEHICLES_USED:   0x0505,
    EVENTS:          0x0502,
    FAULTS:          0x0503,
    APPLICATION_ID:  0x0501,
    CARD_DOWNLOAD:   0x050E,
  };

  var ACTIVITE = { 0: "repos", 1: "disponibilité", 2: "travail", 3: "conduite" };

  /* Les codes d'événement et de défaut de l'appendice 1 (EventFaultType), dans
     les mots de l'annexe. Ceux qu'on ne nomme pas sont rendus par leur code. */
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
  };
  function nommerCode(c) {
    if (CODES[c] != null) return CODES[c];
    if (c >= 0x10 && c <= 0x1f) return "Tentative d'atteinte à la sécurité (code 0x" + hex(c) + ")";
    if (c >= 0x30 && c <= 0x3f) return "Défaut de carte (code 0x" + hex(c) + ")";
    if (c >= 0x40 && c <= 0x4f) return "Défaut de l'appareil de contrôle (code 0x" + hex(c) + ")";
    return "Événement ou défaut, code 0x" + hex(c);
  }
  function hex(n) { var s = n.toString(16).toUpperCase(); return s.length < 2 ? "0" + s : s; }

  /* ─────────────────────────── lecture bas niveau ───────────────────────── */

  function vue(buf) {
    /* Accepte un ArrayBuffer, un Uint8Array ou un tableau d'octets. */
    if (buf instanceof ArrayBuffer) return new Uint8Array(buf);
    if (buf && buf.buffer instanceof ArrayBuffer) return new Uint8Array(buf.buffer, buf.byteOffset || 0, buf.byteLength);
    return new Uint8Array(buf || []);
  }
  function u16(a, o) { return (a[o] << 8) | a[o + 1]; }
  function u24(a, o) { return (a[o] << 16) | (a[o + 1] << 8) | a[o + 2]; }
  function u32(a, o) { return ((a[o] * 0x1000000) + (a[o + 1] << 16) + (a[o + 2] << 8) + a[o + 3]); }
  function timeReal(a, o) {
    var s = u32(a, o);
    if (!s) return null;
    return new Date(s * 1000).toISOString().slice(0, 10);
  }
  function bcd(x) { return ((x >> 4) & 0x0f) * 10 + (x & 0x0f); }
  function datef(a, o) {
    /* 4 octets DCB : AAAA MM JJ. */
    var an = bcd(a[o]) * 100 + bcd(a[o + 1]), mo = bcd(a[o + 2]), jo = bcd(a[o + 3]);
    if (!an || !mo || !jo) return null;
    return an + "-" + (mo < 10 ? "0" : "") + mo + "-" + (jo < 10 ? "0" : "") + jo;
  }
  function texte(a, o, n) {
    /* Nom ou chaîne : le premier octet est la page de code, on le passe. */
    var s = "";
    for (var i = 1; i < n; i++) {
      var c = a[o + i];
      if (c === 0x00 || c === 0xff) continue;
      s += String.fromCharCode(c);
    }
    return s.replace(/\s+/g, " ").trim();
  }
  function ascii(a, o, n) {
    /* Chaîne sans page de code (le numéro de carte) : tous les octets comptent. */
    var s = "";
    for (var i = 0; i < n; i++) {
      var c = a[o + i];
      if (c === 0x00 || c === 0xff) continue;
      s += String.fromCharCode(c);
    }
    return s.replace(/\s+/g, " ").trim();
  }
  function immatriculation(a, o) {
    /* VehicleRegistrationIdentification : 1 octet nation + 14 octets (dont la
       page de code en tête). */
    return texte(a, o + 1, 14);
  }

  /* ─────────────────────────── découpage en blocs ───────────────────────── */

  function blocs(a) {
    var out = [], o = 0, n = a.length;
    while (o + 5 <= n) {
      var fid = u16(a, o);
      var type = a[o + 2];        /* 0x00/0x02 contenu, 0x01/0x03 signature */
      var len = u16(a, o + 3);
      var deb = o + 5;
      if (deb + len > n) break;   /* longueur incohérente : on s'arrête là */
      if ((type & 1) === 0) out.push({ fid: fid, debut: deb, longueur: len });
      o = deb + len;
    }
    return out;
  }
  function bloc(a, liste, fid) {
    for (var i = 0; i < liste.length; i++) if (liste[i].fid === fid) return liste[i];
    return null;
  }

  /* ─────────────────────────── les fichiers lus ─────────────────────────── */

  function lireIdentification(a, b) {
    if (!b) return null;
    var o = b.debut;
    /* CardIdentification (65 octets) puis DriverCardHolderIdentification. */
    var membre = a[o];
    var numero = ascii(a, o + 1, 16);
    var autorite = texte(a, o + 17, 36);
    var emission = timeReal(a, o + 53);
    var debutValidite = timeReal(a, o + 57);
    var expiration = timeReal(a, o + 61);
    var oh = o + 65;
    var nom = texte(a, oh, 36);
    var prenoms = texte(a, oh + 36, 36);
    var naissance = datef(a, oh + 72);
    return {
      membre: membre, numero: numero, autorite: autorite,
      emission: emission, debutValidite: debutValidite, expiration: expiration,
      nom: nom, prenoms: prenoms, naissance: naissance,
      titulaire: (nom + (prenoms ? " " + prenoms : "")).trim(),
    };
  }

  function decoderChangement(mot) {
    return { slot: (mot >> 15) & 1, activite: (mot >> 11) & 3, minute: mot & 0x07ff };
  }

  function lireActivites(a, b) {
    if (!b) return [];
    var o = b.debut, len = b.longueur;
    if (len < 4) return [];
    var ptrVieux = u16(a, o), ptrRecent = u16(a, o + 2);
    var base = o + 4, taille = len - 4;
    if (taille <= 0) return [];
    function oct(i) { return a[base + (((i % taille) + taille) % taille)]; }
    function r16(i) { return (oct(i) << 8) | oct(i + 1); }
    function r32(i) { return (oct(i) * 0x1000000) + (oct(i + 1) << 16) + (oct(i + 2) << 8) + oct(i + 3); }
    function rDate(i) { var s = r32(i); return s ? new Date(s * 1000).toISOString().slice(0, 10) : null; }

    var jours = [], pos = ptrVieux, garde = 0;
    while (garde++ < 5000) {
      var prevLen = r16(pos);
      var recLen = r16(pos + 2);
      if (recLen < 12) break;
      var date = rDate(pos + 4);
      var distance = r16(pos + 10);
      var changements = [], i = pos + 12;
      while (i + 2 <= pos + recLen) { changements.push(decoderChangement(r16(i))); i += 2; }
      jours.push({ date: date, distance: distance, changements: changements });
      if (pos === ptrRecent) break;
      pos = (pos + recLen) % taille;
      if (prevLen === 0 && recLen === 0) break;
    }
    return jours;
  }

  function lireVehicules(a, b) {
    if (!b) return [];
    var o = b.debut, len = b.longueur;
    if (len < 2) return [];
    var out = [], taille = 31, n = Math.floor((len - 2) / taille);
    for (var k = 0; k < n; k++) {
      var p = o + 2 + k * taille;
      var debut = u24(a, p), fin = u24(a, p + 3);
      var premier = timeReal(a, p + 6), dernier = timeReal(a, p + 10);
      var immat = immatriculation(a, p + 14);
      if (!premier && !dernier && !immat) continue;
      out.push({ immat: immat, premier: premier, dernier: dernier,
        kmDebut: debut, kmFin: fin, km: (fin >= debut ? fin - debut : null) });
    }
    return out;
  }

  function lireEvenements(a, b) {
    if (!b) return [];
    var o = b.debut, len = b.longueur, taille = 24, out = [];
    var n = Math.floor(len / taille);
    for (var k = 0; k < n; k++) {
      var p = o + k * taille;
      var type = a[p];
      var debut = timeReal(a, p + 1), fin = timeReal(a, p + 5);
      var immat = immatriculation(a, p + 9);
      if (type === 0 && !debut) continue;
      out.push({ code: type, nom: nommerCode(type), debut: debut, fin: fin, immat: immat });
    }
    return out;
  }

  /* ─────────────────────────────── lecture ──────────────────────────────── */

  function lire(buf) {
    var a = vue(buf);
    var liste = blocs(a);
    return {
      octets: a.length,
      blocs: liste.map(function (x) { return x.fid; }),
      identification: lireIdentification(a, bloc(a, liste, EF.IDENTIFICATION)),
      jours: lireActivites(a, bloc(a, liste, EF.DRIVER_ACTIVITY)),
      vehicules: lireVehicules(a, bloc(a, liste, EF.VEHICLES_USED)),
      evenements: lireEvenements(a, bloc(a, liste, EF.EVENTS)),
      defauts: lireEvenements(a, bloc(a, liste, EF.FAULTS)),
    };
  }

  /* ─────────────────────── les minutes par activité ─────────────────────── */

  function minutesJour(jour) {
    var m = { conduite: 0, travail: 0, "disponibilité": 0, repos: 0 };
    var ch = jour.changements.slice().sort(function (x, y) { return x.minute - y.minute; });
    for (var i = 0; i < ch.length; i++) {
      var deb = ch[i].minute;
      var finMin = (i + 1 < ch.length) ? ch[i + 1].minute : 1440;
      var duree = finMin - deb; if (duree < 0) duree = 0;
      m[ACTIVITE[ch[i].activite]] += duree;
    }
    return m;
  }

  /* La conduite continue la plus longue, interrompue seulement par des pauses
     de moins de 45 minutes. Indicatif : la règle des pauses fractionnées
     (15 puis 30 minutes) n'est pas tranchée ici, seul le seuil de 45 l'est. */
  function conduiteContinueMax(jour) {
    var ch = jour.changements.slice().sort(function (x, y) { return x.minute - y.minute; });
    var runMax = 0, run = 0, pause = 0;
    for (var i = 0; i < ch.length; i++) {
      var deb = ch[i].minute, finMin = (i + 1 < ch.length) ? ch[i + 1].minute : 1440;
      var duree = finMin - deb; if (duree < 0) duree = 0;
      var act = ch[i].activite;
      if (act === 3) { run += duree; pause = 0; if (run > runMax) runMax = run; }
      else if (act === 0) { pause += duree; if (pause >= 45) run = 0; }
      /* travail et disponibilité n'allongent pas la conduite et ne valent pas
         pause : la conduite continue reste en l'état. */
    }
    return runMax;
  }

  function hhmm(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + " h" + (m ? " " + (m < 10 ? "0" : "") + m : "");
  }

  /* ─────────────────────── l'analyse pour le suivi ──────────────────────── */

  /* On transforme ce qui est lu en anomalies prêtes à porter dans la fiche du
     conducteur. Les événements et défauts enregistrés par l'appareil font foi :
     ils passent tels quels. Le dépassement de conduite journalière au delà de
     dix heures est calculé à partir des activités. La conduite continue au delà
     de quatre heures et demie est signalée comme indicative. */
  function analyser(carte) {
    var jours = (carte.jours || []).map(function (j) {
      var m = minutesJour(j);
      return { date: j.date, distance: j.distance, minutes: m,
        continueMax: conduiteContinueMax(j) };
    });
    var anomalies = [];

    jours.forEach(function (j) {
      if (!j.date) return;
      if (j.minutes.conduite > 600) {
        anomalies.push({ date: j.date, type: "dépassement de la conduite journalière",
          detail: "Conduite de " + hhmm(j.minutes.conduite) + " le " + j.date +
            " (maximum dix heures, et seulement deux fois par semaine)." });
      }
      if (j.continueMax > 270) {
        anomalies.push({ date: j.date, type: "conduite continue sans pause suffisante",
          detail: "Conduite continue d'environ " + hhmm(j.continueMax) + " le " + j.date +
            " (pause de 45 minutes requise au delà de 4 h 30). Indicatif, à confirmer." });
      }
    });

    (carte.evenements || []).forEach(function (e) {
      anomalies.push({ date: e.debut || "", type: e.nom.toLowerCase(),
        detail: "Événement enregistré par l'appareil : " + e.nom +
          (e.debut ? ", le " + e.debut : "") + (e.immat ? ", véhicule " + e.immat : "") + "." });
    });
    (carte.defauts || []).forEach(function (e) {
      anomalies.push({ date: e.debut || "", type: e.nom.toLowerCase(),
        detail: "Défaut enregistré par l'appareil : " + e.nom +
          (e.debut ? ", le " + e.debut : "") + (e.immat ? ", véhicule " + e.immat : "") + "." });
    });

    var dates = jours.map(function (j) { return j.date; }).filter(Boolean).sort();
    return {
      identification: carte.identification,
      periode: dates.length ? { du: dates[0], au: dates[dates.length - 1] } : null,
      nbJours: dates.length,
      jours: jours,
      vehicules: carte.vehicules || [],
      evenements: carte.evenements || [],
      defauts: carte.defauts || [],
      anomalies: anomalies,
      hhmm: hhmm,
    };
  }

  var API = { lire: lire, analyser: analyser, minutesJour: minutesJour,
    conduiteContinueMax: conduiteContinueMax, hhmm: hhmm, EF: EF, CODES: CODES };

  if (root) root.LectureCarte = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
