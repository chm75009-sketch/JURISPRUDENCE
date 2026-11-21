/* LA LECTURE D'UN TÉLÉCHARGEMENT D'UNITÉ VÉHICULE (.V1B / .ddd véhicule).

   POURQUOI CE FICHIER EXISTE

   Le fichier de la carte dit ce qu'un conducteur a fait. Le fichier du
   tachygraphe du véhicule dit ce que le véhicule a fait, y compris quand il a
   roulé sans aucune carte insérée : c'est le seul endroit où la conduite sans
   carte se lit, puisque, par définition, aucune carte ne l'a enregistrée. On en
   tire ici l'identification du véhicule, la période couverte, le verrouillage
   de l'entreprise, les contrôles enregistrés, les conducteurs et les cartes qui
   ont utilisé le véhicule, l'activité jour par jour, la conduite sans carte, et
   les événements, défauts et excès de vitesse que l'appareil a lui-même notés.

   SUR QUOI C'EST ÉCRIT

   Le format n'a pas été deviné : il vient de l'annexe 1B du règlement (CEE)
   n° 1360/2002, reprise et complétée par le règlement (UE) n° 165/2014 et son
   annexe 1C. Un téléchargement de véhicule est une suite de blocs ; chaque bloc
   commence par l'octet 0x76 suivi de l'identifiant de transfert. La première
   génération écrit les données sans longueur, chaque bloc étant suivi d'une
   signature de 128 octets. La deuxième génération écrit chaque bloc en tableaux
   d'enregistrements (type sur un octet, taille sur deux, nombre sur deux), la
   signature étant elle-même un de ces tableaux. Tous les entiers sont en
   gros-boutiste ; les dates sont le nombre de secondes depuis le 1er janvier
   1970, en temps universel.

   COMMENT LA CONDUITE SANS CARTE EST CALCULÉE

   Chaque ligne d'activité dit si la carte est insérée ou absente. Mais
   l'appareil n'écrit pas de ligne quand une carte est insérée en roulant : la
   ligne « conduite, carte absente » court alors à tort jusqu'au changement
   suivant. On borne donc chaque période par les heures réelles d'insertion et
   de retrait des cartes, que le fichier donne à la seconde. Une minute n'est
   comptée que si la ligne dit « carte absente » ET qu'aucune carte n'est
   insérée à l'emplacement du conducteur. Quand les deux sources du fichier ne
   concordent pas sur un jour, ce jour est signalé.

   CE QUI N'EST PAS FAIT

   La signature n'est pas vérifiée. Le lecteur a été éprouvé sur des fichiers
   réels de première génération et de deuxième génération, version 2 ; la
   version 1 de la deuxième génération est lue sur le même principe mais n'a pas
   été éprouvée, et le lecteur le dit. Quand la lecture ne retombe pas
   exactement sur les blocs attendus, le résultat porte une réserve : on ne
   conclut jamais « rien à signaler » d'un fichier lu à moitié.                */

(function (root) {
  "use strict";

  var ACTIVITE = { 0: "repos", 1: "disponibilité", 2: "travail", 3: "conduite" };

  /* Les codes d'événement et de défaut (EventFaultType), lus à l'annexe 1B du
     règlement (CE) n° 1360/2002, appendice 1, point 2.54 (JO L 207 du 5 août
     2002, pages 70 et 71), et traduits. Les codes 0x0A à 0x0F y sont réservés :
     l'annexe 1C leur a donné un sens depuis, qui n'a pas été relu ici, et ils
     sont donc rendus par leur numéro. */
  var CODES = {
    0x00: "Événement général, sans autre précision",
    0x01: "Insertion d'une carte non valide",
    0x02: "Conflit de cartes",
    0x03: "Chevauchement horaire",
    0x04: "Conduite sans carte appropriée",
    0x05: "Insertion de la carte pendant la conduite",
    0x06: "Dernière session de carte mal clôturée",
    0x07: "Excès de vitesse",
    0x08: "Coupure de l'alimentation électrique",
    0x09: "Erreur sur les données de mouvement",
    0x10: "Tentative d'atteinte à la sécurité de l'unité véhicule, sans autre précision",
    0x11: "Échec d'authentification du capteur de mouvement",
    0x12: "Échec d'authentification de la carte tachygraphique",
    0x13: "Changement non autorisé du capteur de mouvement",
    0x14: "Erreur d'intégrité des données saisies sur la carte",
    0x15: "Erreur d'intégrité des données utilisateur enregistrées",
    0x16: "Erreur de transfert interne des données",
    0x17: "Ouverture non autorisée du boîtier",
    0x18: "Sabotage du matériel",
    0x20: "Tentative d'atteinte à la sécurité du capteur, sans autre précision",
    0x21: "Capteur : échec d'authentification",
    0x22: "Capteur : erreur d'intégrité des données enregistrées",
    0x23: "Capteur : erreur de transfert interne des données",
    0x24: "Capteur : ouverture non autorisée du boîtier",
    0x25: "Capteur : sabotage du matériel",
    0x30: "Défaut de l'appareil de contrôle, sans autre précision",
    0x31: "Défaut interne de l'unité véhicule",
    0x32: "Défaut de l'imprimante",
    0x33: "Défaut de l'affichage",
    0x34: "Défaut de téléchargement",
    0x35: "Défaut du capteur",
    0x40: "Défaut de carte, sans autre précision",
  };
  function nommerCode(c) {
    if (CODES[c] != null) return CODES[c];
    if (c >= 0x0a && c <= 0x0f) return "Événement général (code 0x" + hex(c) + ")";
    if (c >= 0x10 && c <= 0x1f) return "Tentative d'atteinte à la sécurité de l'unité véhicule (code 0x" + hex(c) + ")";
    if (c >= 0x20 && c <= 0x2f) return "Tentative d'atteinte à la sécurité du capteur (code 0x" + hex(c) + ")";
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
  function u32(a, o) { return (a[o] * 0x1000000) + (a[o + 1] << 16) + (a[o + 2] << 8) + a[o + 3]; }
  function vide(s) { return !s || s === 0xffffffff; }
  function deux(n) { return (n < 10 ? "0" : "") + n; }
  function isoJour(s) { return vide(s) ? null : new Date(s * 1000).toISOString().slice(0, 10); }
  function isoHeure(s) { return vide(s) ? null : new Date(s * 1000).toISOString().slice(11, 16); }
  function timeReal(a, o) { return isoJour(u32(a, o)); }
  function hm(min) { return deux(Math.floor(min / 60)) + ":" + deux(min % 60); }
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

  /* ActivityChangeInfo, deux octets : « s c p aa ttttttttttt ».
     s = emplacement (0 conducteur, 1 convoyeur), c = équipage, p = carte
     (0 insérée, 1 absente), aa = activité, t = minute du changement. */
  function changement(mot) {
    return { slot: (mot >> 15) & 1, equipage: (mot >> 14) & 1,
      carteAbsente: (mot >> 13) & 1, activite: (mot >> 11) & 3, minute: mot & 0x07ff };
  }
  function motsValides(mots) {
    for (var i = 0; i < mots.length; i++) if ((mots[i] & 0x07ff) > 1439) return false;
    return true;
  }

  /* Le calcul d'un jour. t0 est la date du jour en secondes ; cartes porte, pour
     chaque carte du jour, l'emplacement et les secondes d'insertion et de
     retrait (null quand le format ne les donne pas). On suit la convention de
     l'appareil : une carte insérée à 04:43:33 compte à partir de la minute
     04:43, une carte retirée à 13:46:20 est absente à partir de 13:46. */
  function calculJour(mots, cartes, t0, courant) {
    var jour0 = Math.floor(t0 / 86400) * 86400, m, i;
    /* Le jour du téléchargement s'arrête à l'heure du téléchargement : la
       dernière ligne ne court pas jusqu'à minuit. */
    var borne = 1440;
    if (!vide(courant) && courant >= jour0 && courant < jour0 + 86400) borne = Math.floor((courant - jour0) / 60);
    var ins = new Uint8Array(1440), heuresConnues = true, insCarte = {};
    (cartes || []).forEach(function (c) {
      if (c.insertion == null) { heuresConnues = false; return; }
      if (c.slot !== 0 || vide(c.insertion)) return;
      var A = Math.max(0, Math.floor((c.insertion - jour0) / 60));
      var B = vide(c.retrait) ? borne : Math.min(borne, Math.floor((c.retrait - jour0) / 60));
      var propre = insCarte[c.numero] || (insCarte[c.numero] = new Uint8Array(1440));
      for (m = A; m < B; m++) { ins[m] = 1; propre[m] = 1; }
    });
    var L = mots.map(changement).filter(function (c) { return c.slot === 0; });
    var absente = new Uint8Array(1440), conduite = new Uint8Array(1440), act = new Int8Array(1440);
    var min = { conduite: 0, travail: 0, "disponibilité": 0, repos: 0 };
    for (i = 0; i < L.length; i++) {
      var deb = L[i].minute, fin = Math.min(borne, (i + 1 < L.length) ? L[i + 1].minute : 1440);
      if (fin <= deb) continue;
      min[ACTIVITE[L[i].activite]] += fin - deb;
      if (L[i].activite !== 3) continue;
      for (m = deb; m < fin; m++) { conduite[m] = 1; if (L[i].carteAbsente) absente[m] = 1; }
    }
    for (i = 0; i < L.length; i++) {
      var d2 = L[i].minute, f2 = Math.min(borne, (i + 1 < L.length) ? L[i + 1].minute : 1440);
      for (m = d2; m < f2; m++) act[m] = L[i].activite;
    }
    /* Ce que chaque carte a fait ce jour-là dans ce véhicule : la conduite, et
       la plus longue conduite continue (une pause est un repos cumulé de 45
       minutes ; hors du véhicule, la carte est tenue pour au repos). Cela sert
       à compléter une carte dont une session a été mal clôturée. */
    var parCarte = {};
    Object.keys(insCarte).forEach(function (num) {
      var p = insCarte[num], c = 0, run = 0, runMax = 0, pause = 0, present = 0;
      for (m = 0; m < 1440; m++) {
        var a = p[m] ? act[m] : 0;
        if (p[m]) present++;
        if (a === 3) { c++; run++; pause = 0; if (run > runMax) runMax = run; }
        else if (a === 0) { pause++; if (pause >= 45) run = 0; }
      }
      if (present) parCarte[num] = { conduite: c, continueMax: runMax };
    });
    /* Retenu : la ligne dit « absente » et aucune carte n'est insérée. L'autre
       mesure, pour contrôle : conduite hors de toute insertion. */
    var total = 0, autre = 0, segments = [], debSeg = -1;
    for (m = 0; m <= 1440; m++) {
      var oui = m < 1440 && absente[m] && !ins[m];
      if (m < 1440 && conduite[m] && !ins[m]) autre++;
      if (oui) { total++; if (debSeg < 0) debSeg = m; }
      else if (debSeg >= 0) { segments.push({ de: hm(debSeg), a: hm(m), minutes: m - debSeg }); debSeg = -1; }
    }
    return { conduiteSansCarte: total, segments: segments, minutes: min, parCarte: parCarte,
      ecart: heuresConnues ? (autre !== total) : false, heuresConnues: heuresConnues };
  }

  function evenement(a, p) {
    var d = u32(a, p + 2), f = u32(a, p + 6);
    return { code: a[p], nom: nommerCode(a[p]), debut: isoJour(d), heure: isoHeure(d), fin: isoJour(f),
      dureeMin: (!vide(d) && !vide(f) && f >= d) ? Math.round((f - d) / 60) : null };
  }

  /* Un contrôle enregistré par l'appareil. Le premier octet (ControlType,
     annexe 1B, point 2.44) dit ce que l'agent a fait : carte téléchargée,
     unité véhicule téléchargée, impression, affichage. */
  function controle(a, p) {
    var t = a[p];
    return { date: timeReal(a, p + 1), heure: isoHeure(u32(a, p + 1)),
      carteTelechargee: !!(t & 0x80), vehiculeTelecharge: !!(t & 0x40), impression: !!(t & 0x20), affichage: !!(t & 0x10) };
  }

  function resultat(generation) {
    return { generation: generation, vin: null, immatriculation: null, pays: null, courant: null,
      periode: null, telechargementPrecedent: null, verrous: [], controles: [], cartes: [], jours: [],
      evenements: [], defauts: [], survitesses: [], parCarte: {}, lecture: { complete: true, reserves: [] } };
  }
  function reserve(res, texteReserve) { res.lecture.complete = false; res.lecture.reserves.push(texteReserve); }
  function ajouterCartes(res, vus, cartes) {
    cartes.forEach(function (c) {
      if (c.numero && !vus[c.numero]) { vus[c.numero] = 1; res.cartes.push({ titulaire: c.titulaire, numero: c.numero }); }
    });
  }
  function ajouterJour(res, t0, mots, cartes) {
    if (vide(t0)) return;
    if (!motsValides(mots)) { reserve(res, "Une journée porte des minutes impossibles : elle n'est pas comptée."); return; }
    var c = calculJour(mots, cartes, t0, res.courantS);
    c.date = isoJour(Math.floor(t0 / 86400) * 86400);
    Object.keys(c.parCarte).forEach(function (num) {
      (res.parCarte[num] || (res.parCarte[num] = {}))[c.date] = c.parCarte[num];
    });
    delete c.parCarte;
    res.jours.push(c);
  }

  /* ───────────────────────── première génération ────────────────────────── */

  var SIG1 = 128;                 /* signature qui clôt chaque bloc */
  var IWREC1 = 129;               /* un enregistrement d'insertion-retrait */

  /* Insertion-retrait, gen1 : nom (72), carte (type 1 + pays 1 + numéro 16),
     expiration (4), insertion (4), compteur (3), emplacement (1), retrait (4),
     compteur (3), véhicule précédent (19), saisie manuelle (1). */
  function carteIW1(a, o) {
    var nom = texte(a, o, 36), prenoms = texte(a, o + 36, 36);
    return { titulaire: (nom + (prenoms ? " " + prenoms : "")).trim(), numero: ascii(a, o + 74, 16),
      insertion: u32(a, o + 94), slot: a[o + 101], retrait: u32(a, o + 102) };
  }

  function lireGen1(a) {
    var res = resultat(1), n, i, p, vus = {};
    /* Bloc d'identification : certificats 194 + 194, châssis 17, immatriculation
       (pays 1 + 14), heure de l'appareil 4, période téléchargeable 4 + 4, état
       des emplacements 1, téléchargement précédent 58, verrous, contrôles. */
    res.vin = ascii(a, 390, 17);
    res.pays = a[407];
    res.immatriculation = texte(a, 408, 14);
    res.courantS = u32(a, 422); res.courant = isoJour(res.courantS);
    res.periode = { du: timeReal(a, 426), au: timeReal(a, 430) };
    if (!vide(u32(a, 435))) res.telechargementPrecedent = { date: timeReal(a, 435), societe: texte(a, 457, 36) };
    p = 493; n = a[p]; p += 1;
    for (i = 0; i < n; i++) {
      res.verrous.push({ du: timeReal(a, p), au: timeReal(a, p + 4), societe: texte(a, p + 8, 36), adresse: texte(a, p + 44, 36) });
      p += 98;
    }
    n = a[p]; p += 1;
    for (i = 0; i < n; i++) { res.controles.push(controle(a, p)); p += 31; }
    var o = p + SIG1;
    if (!/^[A-Z0-9]{11,17}$/.test(res.vin) || o >= a.length || a[o] !== 0x76) {
      reserve(res, "Le bloc d'identification ne se termine pas où il devrait : la suite du fichier n'a pas pu être lue.");
      return res;
    }
    /* Les blocs journaliers se suivent, chacun clos par sa signature. */
    while (o + 2 <= a.length && a[o] === 0x76 && a[o + 1] === 0x02) {
      p = o + 2;
      var t0 = u32(a, p); p += 4;
      p += 3;                                   /* compteur à minuit */
      var niw = u16(a, p); p += 2;
      var cartes = [];
      for (i = 0; i < niw && p + IWREC1 <= a.length; i++) { cartes.push(carteIW1(a, p)); p += IWREC1; }
      var nch = u16(a, p); p += 2;
      if (nch > 2880 || p + 2 * nch > a.length) { reserve(res, "La lecture des journées s'est arrêtée avant la fin."); return res; }
      var mots = [];
      for (i = 0; i < nch; i++) { mots.push(u16(a, p)); p += 2; }
      p += 1 + a[p] * 28;                       /* lieux de début et fin de journée */
      p += 2 + u16(a, p) * 5;                   /* conditions particulières */
      ajouterJour(res, t0, mots, cartes);
      ajouterCartes(res, vus, cartes);
      o = p + SIG1;
    }
    if (o !== a.length && a[o] !== 0x76) { reserve(res, "La lecture des journées ne retombe pas sur le bloc suivant."); return res; }
    /* Événements, défauts, excès de vitesse : bloc 0x7603. Les compteurs
       tiennent sur un octet. */
    if (o + 2 <= a.length && a[o + 1] === 0x03) {
      p = o + 2;
      n = a[p]; p += 1;
      for (i = 0; i < n; i++) { res.defauts.push(evenement(a, p)); p += 82; }
      n = a[p]; p += 1;
      for (i = 0; i < n; i++) { res.evenements.push(evenement(a, p)); p += 83; }
      p += 9;                                   /* dernier contrôle de vitesse */
      n = a[p]; p += 1;
      for (i = 0; i < n; i++) {
        var e = evenement(a, p); e.vMax = a[p + 10]; e.vMoyenne = a[p + 11];
        res.survitesses.push(e); p += 31;
      }
      n = a[p]; p += 1 + n * 98;                /* ajustements d'heure */
      var apres = p + SIG1;
      if (apres !== a.length && a[apres] !== 0x76) reserve(res, "Le bloc des événements ne retombe pas sur le bloc suivant : la liste des événements est à vérifier.");
    }
    if (!res.jours.length) reserve(res, "Aucune journée d'activité n'a été trouvée dans le fichier.");
    return res;
  }

  /* ───────────────────────── deuxième génération ─────────────────────────── */

  /* Un bloc est une suite de tableaux : type (1), taille (2), nombre (2), puis
     les données. Le dernier tableau est la signature (type 0x08). */
  function tableaux(a, o) {
    var p = o + 2, out = [];
    while (p + 5 <= a.length) {
      if (a[p] === 0x76 && out.length && out[out.length - 1].rt === 0x08) break;   /* bloc suivant */
      var rt = a[p], rs = u16(a, p + 1), nr = u16(a, p + 3), tot = 5 + rs * nr;
      if (rs === 0 || p + tot > a.length) break;
      out.push({ rt: rt, rs: rs, nr: nr, debut: p + 5 });
      p += tot;
    }
    return { tableaux: out, fin: p, signe: out.length > 0 && out[out.length - 1].rt === 0x08 };
  }

  /* Insertion-retrait, gen2 version 2 (131 octets) : nom (72), carte (19),
     expiration (4), insertion (4), compteur (3), emplacement (1), retrait (4). */
  function carteIW2(a, o, rs) {
    var nom = texte(a, o, 36), prenoms = texte(a, o + 36, 36);
    var c = { titulaire: (nom + (prenoms ? " " + prenoms : "")).trim(), numero: ascii(a, o + 74, 16),
      insertion: null, slot: null, retrait: null };
    if (rs === 131) { c.insertion = u32(a, o + 95); c.slot = a[o + 102]; c.retrait = u32(a, o + 103); }
    return c;
  }

  function lireGen2(a) {
    var v1 = (a[1] & 0xf0) === 0x20;
    var res = resultat(v1 ? "2v1" : "2v2"), vus = {}, o = 0, sansHeures = false;
    if (v1) reserve(res, "Tachygraphe de deuxième génération, version 1 : ce format n'a pas été éprouvé sur un fichier réel. Les résultats sont à vérifier sur le relevé.");
    while (o + 2 <= a.length) {
      if (a[o] !== 0x76 || (a[o + 1] & 0xf0) !== (a[1] & 0xf0)) {
        reserve(res, "Le fichier contient une partie d'un autre format, qui n'a pas été lue."); break;
      }
      var genre = a[o + 1] & 0x0f, bloc = tableaux(a, o);
      if (!bloc.signe) { reserve(res, "Un bloc du fichier ne se termine pas par sa signature : la lecture s'est arrêtée là."); break; }
      if (genre === 1) lireIdentification2(a, bloc, res);
      else if (genre === 2) {
        var t0 = 0, mots = [], cartes = [];
        bloc.tableaux.forEach(function (t) {
          var k;
          if (t.rt === 0x06 && t.rs === 4 && t.nr) t0 = u32(a, t.debut);
          if (t.rt === 0x01 && t.rs === 2) for (k = 0; k < t.nr; k++) mots.push(u16(a, t.debut + 2 * k));
          if (t.rt === 0x0d) for (k = 0; k < t.nr; k++) cartes.push(carteIW2(a, t.debut + k * t.rs, t.rs));
        });
        if (cartes.some(function (c) { return c.insertion == null; })) sansHeures = true;
        ajouterJour(res, t0, mots, cartes);
        ajouterCartes(res, vus, cartes);
      } else if (genre === 3) lireEvenements2(a, bloc, res);
      o = bloc.fin;
    }
    if (sansHeures) reserve(res, "Les heures d'insertion des cartes n'ont pas pu être lues dans ce format : la conduite sans carte repose sur les seules lignes d'activité et peut être surévaluée.");
    if (!res.jours.length) reserve(res, "Aucune journée d'activité n'a été trouvée dans le fichier.");
    return res;
  }

  function lireIdentification2(a, bloc, res) {
    bloc.tableaux.forEach(function (t) {
      var p = t.debut, k;
      if (t.rt === 0x0a && t.rs >= 17 && t.nr) res.vin = ascii(a, p, 17);
      if (t.rt === 0x24 && t.rs >= 15 && t.nr) { res.pays = a[p]; res.immatriculation = texte(a, p + 1, 14); }
      if (t.rt === 0x03 && t.rs === 4 && t.nr) { res.courantS = u32(a, p); res.courant = isoJour(res.courantS); }
      if (t.rt === 0x13 && t.rs >= 8 && t.nr) res.periode = { du: timeReal(a, p), au: timeReal(a, p + 4) };
      if (t.rt === 0x14 && t.rs === 59 && t.nr && !vide(u32(a, p))) res.telechargementPrecedent = { date: timeReal(a, p), societe: texte(a, p + 23, 36) };
      if (t.rt === 0x10 && t.rs === 99) for (k = 0; k < t.nr; k++) {
        p = t.debut + k * t.rs;
        res.verrous.push({ du: timeReal(a, p), au: timeReal(a, p + 4), societe: texte(a, p + 8, 36), adresse: texte(a, p + 44, 36) });
      }
      if (t.rt === 0x11 && t.rs === 32) for (k = 0; k < t.nr; k++) {
        p = t.debut + k * t.rs; res.controles.push(controle(a, p));
      }
    });
  }

  /* Défauts type 0x18 (90 octets), événements type 0x15 (91), excès de vitesse
     type 0x1b (32). Chaque enregistrement commence par type, objet, début, fin. */
  function lireEvenements2(a, bloc, res) {
    bloc.tableaux.forEach(function (t) {
      var k, p;
      for (k = 0; k < t.nr; k++) {
        p = t.debut + k * t.rs;
        if (t.rt === 0x18 && t.rs >= 10) res.defauts.push(evenement(a, p));
        else if (t.rt === 0x15 && t.rs >= 10) res.evenements.push(evenement(a, p));
        else if (t.rt === 0x1b && t.rs >= 12) { var e = evenement(a, p); e.vMax = a[p + 10]; e.vMoyenne = a[p + 11]; res.survitesses.push(e); }
      }
    });
  }

  /* ─────────────────────────────── lecture ──────────────────────────────── */

  function estVehicule(a) {
    if (!a || a.length < 600 || a[0] !== 0x76) return false;
    var t = a[1];
    return t === 0x01 || t === 0x21 || t === 0x31;
  }

  function lire(buf) {
    var a = vue(buf);
    if (!estVehicule(a)) return null;      /* ce n'est pas un téléchargement véhicule */
    var res;
    try { res = (a[1] === 0x01) ? lireGen1(a) : lireGen2(a); }
    catch (err) { res = resultat(a[1] === 0x01 ? 1 : "2"); reserve(res, "Le fichier n'a pas pu être lu jusqu'au bout."); }
    res.octets = a.length;
    return res;
  }

  /* ─────────────────────── l'analyse pour le suivi ──────────────────────── */

  function hhmm(min) { var h = Math.floor(min / 60), m = min % 60; return h + " h" + (m ? " " + deux(m) : ""); }

  /* On ne retient un jour que s'il porte au moins deux minutes de conduite sans
     carte : une minute isolée tient à la manœuvre d'insertion. */
  var SEUIL_SANS_CARTE = 2;

  function analyser(vu) {
    if (!vu) return null;
    var immat = vu.immatriculation || "";
    var jours = (vu.jours || []).slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; });
    var retenus = jours.filter(function (j) { return j.conduiteSansCarte >= SEUIL_SANS_CARTE; });
    var couverts = {}; jours.forEach(function (j) { couverts[j.date] = 1; });
    /* Les événements « conduite sans carte » que l'appareil garde en mémoire,
       y compris hors des journées téléchargées. */
    var appareil = (vu.evenements || []).filter(function (e) { return e.code === 0x04 && e.debut; });
    var anomalies = [];
    retenus.forEach(function (j) {
      anomalies.push({ date: j.date, source: "appareil", type: "conduite sans carte",
        detail: "Véhicule " + immat + " : " + hhmm(j.conduiteSansCarte) + " de conduite sans carte insérée (" +
          j.segments.map(function (s) { return s.de + " à " + s.a; }).join(", ") + ", heures en temps universel). Lu dans le fichier du tachygraphe." });
    });
    appareil.forEach(function (e) {
      if (couverts[e.debut] || !e.dureeMin) return;
      anomalies.push({ date: e.debut, source: "appareil", type: "conduite sans carte",
        detail: "Véhicule " + immat + " : événement « conduite sans carte appropriée » enregistré par l'appareil à " +
          e.heure + " (temps universel), durée " + hhmm(e.dureeMin) + "." });
    });
    return {
      generation: vu.generation, vin: vu.vin, immatriculation: vu.immatriculation, pays: vu.pays,
      periode: vu.periode, telechargement: vu.courant || (vu.periode && vu.periode.au) || null,
      telechargementPrecedent: vu.telechargementPrecedent, verrous: vu.verrous || [], controles: vu.controles || [],
      nbJours: jours.length, activite: jours.length ? { du: jours[0].date, au: jours[jours.length - 1].date } : null,
      jours: jours, cartes: vu.cartes || [], parCarte: vu.parCarte || {},
      sansCarte: retenus, totalSansCarte: retenus.reduce(function (s, j) { return s + j.conduiteSansCarte; }, 0),
      joursEnEcart: jours.filter(function (j) { return j.ecart; }).map(function (j) { return j.date; }),
      appareilSansCarte: appareil,
      evenements: vu.evenements || [], defauts: vu.defauts || [], survitesses: vu.survitesses || [],
      lecture: vu.lecture, anomalies: anomalies, hhmm: hhmm, seuil: SEUIL_SANS_CARTE,
    };
  }

  var API = { lire: lire, analyser: analyser, estVehicule: function (buf) { return estVehicule(vue(buf)); },
    calculJour: calculJour, hhmm: hhmm, CODES: CODES };

  if (root) root.LectureVehicule = API;
  if (typeof module !== "undefined" && module.exports) module.exports = API;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
