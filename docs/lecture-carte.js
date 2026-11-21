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
   dans les octets du fichier.

   UNE CARTE NE CONTIENT PAS TOUJOURS TOUT. Quand une session est mal clôturée,
   l'activité de cette session manque sur la carte, alors que le véhicule l'a
   enregistrée. Ces périodes, que l'appareil note lui-même sur la carte, ne sont
   pas comptées ; la conduite du jour se reprend du fichier du véhicule quand il
   a été lu, et sinon elle n'est pas calculée.                                 */

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
  };
  function nommerCode(c) {
    if (CODES[c] != null) return CODES[c];
    /* 0x0A à 0x0F : réservés dans l'annexe 1B, définis depuis par l'annexe 1C,
       qui n'a pas pu être relue : rendus par leur numéro plutôt que nommés. */
    if (c >= 0x0a && c <= 0x0f) return "Événement général (code 0x" + hex(c) + ")";
    if (c >= 0x10 && c <= 0x1f) return "Tentative d'atteinte à la sécurité (code 0x" + hex(c) + ")";
    /* Annexe 1B du règlement (CE) n° 1360/2002, appendice 1, point 2.54 :
       0x30 à 0x3f, défauts de l'appareil de contrôle ; 0x40 à 0x4f, défauts de carte. */
    if (c >= 0x30 && c <= 0x3f) return "Défaut de l'appareil de contrôle (code 0x" + hex(c) + ")";
    if (c >= 0x40 && c <= 0x4f) return "Défaut de carte (code 0x" + hex(c) + ")";
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
    if (!s || s === 0xffffffff) return null;    /* vide : session non close, par exemple */
    return new Date(s * 1000).toISOString().slice(0, 10);
  }
  function secondes(a, o) { var s = u32(a, o); return (!s || s === 0xffffffff) ? null : s; }
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
    return { slot: (mot >> 15) & 1, carteAbsente: (mot >> 13) & 1, activite: (mot >> 11) & 3, minute: mot & 0x07ff };
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
      var finConnue = fin !== 0xffffff;          /* compteur de fin vide : session non close */
      out.push({ immat: immat, premier: premier, dernier: dernier,
        kmDebut: debut, kmFin: finConnue ? fin : null, km: (finConnue && fin >= debut ? fin - debut : null) });
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
      out.push({ code: type, nom: nommerCode(type), debut: debut, fin: fin, immat: immat,
        debutS: secondes(a, p + 1), finS: secondes(a, p + 5) });
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

  /* LA PLUS LONGUE CONDUITE SANS PAUSE SUFFISANTE. Règlement (CE) n° 561/2006,
     article 7, version consolidée du 22 mai 2024, lue sur EUR-Lex : « Après un
     temps de conduite de quatre heures et demie, un conducteur observe une pause
     ininterrompue d'au moins quarante-cinq minutes, à moins qu'il ne prenne un
     temps de repos. Cette pause peut être remplacée par une pause d'au moins
     quinze minutes suivie d'une pause d'au moins trente minutes ». On cumule
     donc la conduite, et on repart de zéro après un repos d'un seul tenant de
     45 minutes, ou après un repos d'au moins 15 minutes suivi, plus tard, d'un
     repos d'au moins 30 minutes, dans cet ordre. Le travail et la disponibilité
     ne sont pas une pause et interrompent le repos en cours. Une minute dont
     l'activité n'est pas connue remet tout à zéro : le résultat reste un
     minimum. lire(m) rend l'activité de la minute m (0 repos, 1 disponibilité,
     2 travail, 3 conduite), ou un nombre négatif si elle n'est pas connue. */
  function plusLongueConduite(lire) {
    var cumul = 0, max = 0, repos = 0, premiere = false, servi = false;
    function clore() { if (!servi && repos >= 15) premiere = true; repos = 0; servi = false; }
    for (var m = 0; m < 1440; m++) {
      var a = lire(m);
      if (a < 0) { cumul = 0; repos = 0; premiere = false; servi = false; continue; }
      if (a === 0) {
        repos++;
        if (repos >= 45) { cumul = 0; premiere = false; servi = true; }
        else if (premiere && repos >= 30) { cumul = 0; premiere = false; servi = true; }
        continue;
      }
      clore();
      if (a === 3) { cumul++; if (cumul > max) max = cumul; }
    }
    return max;
  }

  function conduiteContinueMax(jour) { return calculJour(jour, [], false, 0).continueMax; }

  /* LES SESSIONS MAL CLÔTURÉES.

     Quand une carte est retirée sans que l'appareil ait pu clore la session, la
     carte ne reçoit pas l'activité de cette session : il y manque de la conduite
     réellement faite, ou bien la dernière ligne écrite reste ouverte et paraît
     courir jusqu'à l'insertion suivante. L'appareil le note sur la carte par
     l'événement « dernière session de carte mal clôturée », dont le début est
     l'insertion de la session perdue et la fin l'insertion suivante. Entre ces
     deux instants, ce que la carte porte n'est pas l'activité réelle : on ne le
     compte pas, ni en conduite ni en pause. Mesuré sur une carte réelle,
     comparée au fichier du véhicule : 1 h 05 de conduite sur la carte pour
     4 h 59 enregistrées par le véhicule un jour, 15 h 58 calculées pour 6 h 17
     réelles un autre. */
  function sessionsMalCloses(carte) {
    return (carte.evenements || []).filter(function (e) { return e.code === 0x06 && e.debutS; })
      .map(function (e) { return { de: e.debutS, a: e.finS || Infinity, immat: e.immat }; });
  }

  function hm(min) { return (min < 600 ? "0" : "") + Math.floor(min / 60) + ":" + (min % 60 < 10 ? "0" : "") + (min % 60); }

  /* Le calcul d'un jour sur une ligne de 1440 minutes. exclus : les périodes
     des sessions mal clôturées. dernierJour : la carte s'arrête ce jour-là, on
     ne prolonge pas sa dernière ligne ouverte jusqu'à minuit. */
  function calculJour(jour, exclus, dernierJour, debutDouteux) {
    var jour0 = jour.date ? Date.parse(jour.date + "T00:00:00Z") / 1000 : 0;
    var ch = jour.changements.slice().sort(function (x, y) { return x.minute - y.minute; });
    var act = new Int8Array(1440), i, m;
    for (m = 0; m < 1440; m++) act[m] = -1;                    /* -1 : rien d'enregistré */
    for (i = 0; i < ch.length; i++) {
      var deb = ch[i].minute, fin = (i + 1 < ch.length) ? ch[i + 1].minute : 1440;
      if (i + 1 >= ch.length && dernierJour && !ch[i].carteAbsente) fin = deb;   /* ligne ouverte, fin de carte */
      for (m = deb; m < fin && m < 1440; m++) act[m] = ch[i].activite;
    }
    var inconnues = 0, periodes = [], debP = -1;
    for (m = 0; m <= 1440; m++) {
      var hors = m < (debutDouteux || 0);
      if (m < 1440 && !hors) for (i = 0; i < exclus.length; i++) {
        var s = jour0 + m * 60;
        if (s >= Math.floor(exclus[i].de / 60) * 60 && s < Math.floor(exclus[i].a / 60) * 60) { hors = true; break; }
      }
      if (hors) { act[m] = -2; inconnues++; if (debP < 0) debP = m; }
      else if (debP >= 0) { periodes.push({ de: hm(debP), a: m === 1440 ? "24:00" : hm(m) }); debP = -1; }
    }
    var min = { conduite: 0, travail: 0, "disponibilité": 0, repos: 0 };
    for (m = 0; m < 1440; m++) if (act[m] >= 0) min[ACTIVITE[act[m]]]++;
    /* Une période non enregistrée ne s'ajoute à rien et coupe la conduite
       cumulée : ce qui est calculé reste un minimum, jamais un excès. */
    var runMax = plusLongueConduite(function (k) { return act[k]; });
    return { minutes: min, continueMax: runMax, inconnues: inconnues, periodes: periodes };
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
  /* UNE JOURNÉE QUI COMMENCE CARTE INSÉRÉE ALORS QUE LA VEILLE FINIT CARTE
     RETIRÉE. La première ligne d'une journée dit l'état à minuit. Si elle dit
     « carte insérée » alors que la journée précédente se termine carte retirée,
     ou n'existe pas, cette première ligne n'est pas l'activité réelle : mesuré
     sur une carte, elle portait 7 h 25 de conduite depuis minuit, quand le
     véhicule n'en avait enregistré que 3 h 19, à partir de 04:06. On ne compte
     pas cette première période. Rend la minute où elle finit, ou 0. */
  function debutDouteux(bruts, k, parDate) {
    if (k === 0 || !bruts[k].date) return 0;
    var ch = bruts[k].changements.slice().sort(function (x, y) { return x.minute - y.minute; });
    if (!ch.length || ch[0].minute !== 0 || ch[0].carteAbsente) return 0;
    var veille = parDate[new Date(Date.parse(bruts[k].date + "T00:00:00Z") - 86400000).toISOString().slice(0, 10)];
    if (veille) {
      var dern = veille.changements.slice().sort(function (x, y) { return x.minute - y.minute; }).pop();
      if (dern && !dern.carteAbsente) return 0;       /* la carte est bien restée insérée */
    }
    return ch.length > 1 ? ch[1].minute : 1440;
  }

  function analyser(carte, reference) {
    /* reference, facultatif : ce que les fichiers des véhicules ont enregistré
       pour cette carte, par date : { conduite, continueMax, vehicules }. */
    var exclus = sessionsMalCloses(carte), bruts = carte.jours || [], parDate = {};
    bruts.forEach(function (j) { if (j.date) parDate[j.date] = j; });
    var jours = bruts.map(function (j, k) {
      var douteux = debutDouteux(bruts, k, parDate);
      var c = calculJour(j, exclus, k === bruts.length - 1, douteux);
      return { date: j.date, distance: j.distance, minutes: c.minutes, continueMax: c.continueMax,
        nonClose: c.inconnues > 0, periodes: c.periodes, debutDouteux: douteux > 0, source: "carte" };
    });
    var anomalies = [];

    /* Au delà de treize heures, la journée n'est pas exploitable : on ne calcule
       alors aucune conduite pour ce jour, et on le dit, plutôt que d'inventer
       une journée de quinze heures. Filet de sécurité : les périodes que la
       carte n'a pas réellement enregistrées sont déjà écartées plus haut. */
    var SEUIL_ILLISIBLE = 780;
    jours.forEach(function (j) {
      if (!j.date) return;
      var dapres = "", ref = reference && reference[j.date];
      /* Le véhicule a enregistré plus de conduite avec cette carte que la carte
         n'en porte : la carte est incomplète ce jour-là, même sans autre signe
         (une carte insérée en roulant, par exemple). */
      var vehiculeEnPlus = !!ref && ref.conduite > j.minutes.conduite + 2;
      if (j.nonClose || vehiculeEnPlus) {
        var motifs = [];
        if (j.nonClose) motifs.push("de " + j.periodes.map(function (p) { return p.de + " à " + p.a; }).join(", de ") +
          " (temps universel), la carte ne porte pas l'activité réelle (" +
          (j.debutDouteux ? "elle commence la journée carte insérée alors que la veille finit carte retirée" : "session mal clôturée, notée par l'appareil") + ")");
        if (vehiculeEnPlus) motifs.push("le véhicule " + ref.vehicules.join(", ") + " a enregistré " + hhmm(ref.conduite) +
          " de conduite avec cette carte, la carte " + hhmm(j.minutes.conduite));
        var surCarte = j.minutes.conduite;
        j.nonClose = true;
        if (ref && ref.conduite >= surCarte) {
          j.minutes.conduite = ref.conduite; j.continueMax = Math.max(j.continueMax, ref.continueMax);
          j.source = "véhicule"; j.vehicules = ref.vehicules || [];
          dapres = " d'après le fichier du véhicule " + j.vehicules.join(", ");
          anomalies.push({ date: j.date, source: "lecture", type: "carte incomplète ce jour",
            detail: "Le " + j.date + ", " + motifs.join(" ; ") + ". La conduite retenue pour ce jour est celle du fichier du véhicule : " + hhmm(ref.conduite) + "." });
        } else {
          dapres = " au moins, hors période non enregistrée";
          anomalies.push({ date: j.date, source: "lecture", type: "carte incomplète ce jour",
            detail: "Le " + j.date + ", " + motifs.join(" ; ") + ". Ce que la carte donne pour ce jour (" + hhmm(surCarte) +
              " de conduite) est un minimum. Pour le chiffre réel, lisez le fichier du tachygraphe du véhicule dans l'échéancier, puis relisez la carte." });
        }
      }
      if (j.minutes.conduite > SEUIL_ILLISIBLE || j.continueMax > SEUIL_ILLISIBLE) {
        anomalies.push({ date: j.date, source: "lecture", type: "journée non exploitable",
          detail: "Les données du " + j.date + " ne sont pas exploitables (carte retirée en roulant ou session non fermée) : la conduite de ce jour n'est pas calculée. À vérifier sur le relevé complet." });
        return;
      }
      if (j.minutes.conduite > 600) {
        anomalies.push({ date: j.date, source: "calcul", type: "dépassement de la conduite journalière",
          detail: "Conduite calculée de " + hhmm(j.minutes.conduite) + " le " + j.date + dapres +
            " (maximum dix heures, et seulement deux fois par semaine). Indicatif, à confirmer sur le relevé." });
      }
      if (j.continueMax > 270) {
        anomalies.push({ date: j.date, source: "calcul", type: "conduite continue sans pause suffisante",
          detail: "Conduite cumulée de " + hhmm(j.continueMax) + " sans pause suffisante le " + j.date + dapres +
            " (après 4 h 30 de conduite, pause de 45 minutes, ou de 15 puis 30 minutes : article 7 du règlement (CE) n° 561/2006). Calculé sur la journée en temps universel, à confirmer sur le relevé." });
      }
    });

    (carte.evenements || []).forEach(function (e) {
      anomalies.push({ date: e.debut || "", source: "appareil", type: e.nom.toLowerCase(),
        detail: "Événement enregistré par l'appareil : " + e.nom +
          (e.debut ? ", le " + e.debut : "") + (e.immat ? ", véhicule " + e.immat : "") + "." });
    });
    (carte.defauts || []).forEach(function (e) {
      anomalies.push({ date: e.debut || "", source: "appareil", type: e.nom.toLowerCase(),
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
      nonCloses: jours.filter(function (j) { return j.nonClose; }),
      hhmm: hhmm,
    };
  }

  var API = { lire: lire, analyser: analyser, calculJour: calculJour, sessionsMalCloses: sessionsMalCloses, minutesJour: minutesJour,
    conduiteContinueMax: conduiteContinueMax, hhmm: hhmm, EF: EF, CODES: CODES };

  if (root) root.LectureCarte = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
