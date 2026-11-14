/* LA LECTURE D'UN RAPPORT D'ANALYSE EN PDF.

   POURQUOI CE FICHIER EXISTE

   La carte du conducteur se lit en deux formes. Le fichier brut (.ddd), que
   lecture-carte.js décode, et le rapport d'analyse en PDF, déjà produit par un
   logiciel de tachygraphe (TachoSAFE et d'autres), qui liste les infractions en
   toutes lettres, avec leur gravité. Ce fichier lit cette seconde forme, pour
   que l'application accepte les deux.

   CE QU'IL LIT

   La colonne des infractions du rapport : pour chaque ligne, l'intervalle, le
   code, la description, la durée relevée, la norme, l'écart, et la gravité. La
   gravité est marquée par un point dans l'une des quatre colonnes, IM (mineure),
   IG (grave), ITG (très grave) ou IPG (la plus grave) ; les trois autres portent
   un tiret. On repère donc la colonne qui n'a pas de tiret.

   Le rapport répète les mêmes infractions d'une semaine sur l'autre, aux bornes
   des pages. On dédoublonne sur le code, les durées et la description.

   COMMENT

   Par pdf.js, déjà chargé par lire-pdf.js. On ne prend pas le texte à plat : on
   garde la position de chaque fragment, sans quoi la colonne de la gravité se
   perd. Rien ne sort du navigateur.                                           */

(function (window) {
  "use strict";

  var GRAVITE = {
    IM:  { code: "IM",  label: "mineure",        grave: false },
    IG:  { code: "IG",  label: "grave",          grave: true  },
    ITG: { code: "ITG", label: "très grave",     grave: true  },
    IPG: { code: "IPG", label: "la plus grave",  grave: true  },
  };

  /* Charger pdf.js : on réutilise celui de lire-pdf.js s'il est là, sinon on le
     charge nous-mêmes, de la même façon. */
  var CHARGEMENT = null;
  function charger() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (window.LirePdf && window.LirePdf.charger) return window.LirePdf.charger();
    if (CHARGEMENT) return CHARGEMENT;
    CHARGEMENT = new Promise(function (ok, non) {
      var s = document.createElement("script");
      s.src = "pdfjs.js";
      s.onload = function () {
        if (!window.pdfjsLib) { non(new Error("Le lecteur de PDF ne s'est pas chargé.")); return; }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs.worker.js";
        ok(window.pdfjsLib);
      };
      s.onerror = function () { non(new Error("Le lecteur de PDF n'a pas pu être téléchargé.")); };
      document.head.appendChild(s);
    });
    return CHARGEMENT;
  }

  function x(it) { return (it.transform || [])[4]; }
  function y(it) { return (it.transform || [])[5]; }

  /* Grouper les fragments d'une page en lignes (même ordonnée), chaque ligne
     gardant son texte reconstruit et ses fragments avec leur abscisse. */
  function lignes(items) {
    var rangs = [];
    items.forEach(function (it) {
      if (typeof it.str !== "string") return;
      var ty = y(it);
      var r = null;
      for (var i = 0; i < rangs.length; i++) { if (Math.abs(rangs[i].y - ty) <= 2.5) { r = rangs[i]; break; } }
      if (!r) { r = { y: ty, its: [] }; rangs.push(r); }
      r.its.push(it);
    });
    rangs.sort(function (a, b) { return b.y - a.y; }); /* haut vers le bas */
    rangs.forEach(function (r) {
      r.its.sort(function (a, b) { return x(a) - x(b); });
      var t = "", fin = null;
      r.its.forEach(function (it) {
        var tx = x(it);
        if (fin !== null && tx - fin > 1.2 && !/\s$/.test(t) && !/^\s/.test(it.str)) t += " ";
        t += it.str; fin = tx + (it.width || 0);
      });
      r.texte = t.replace(/\s+/g, " ").trim();
    });
    return rangs;
  }

  /* Les abscisses des quatre colonnes de gravité, d'après les en-têtes de la
     page (IM, IG, ITG, IPG). Elles sont constantes dans tout le rapport. */
  function colonnes(rangs) {
    var col = {};
    rangs.forEach(function (r) {
      r.its.forEach(function (it) {
        var s = (it.str || "").trim();
        if (GRAVITE[s] && col[s] == null) col[s] = x(it) + (it.width || 0) / 2;
      });
    });
    return col;
  }

  /* La gravité d'une ligne : la colonne qui ne porte pas de tiret. */
  function graviteDe(rang, col) {
    var ordre = ["IM", "IG", "ITG", "IPG"], tiret = {};
    rang.its.forEach(function (it) {
      if ((it.str || "").trim() !== "-") return;
      var cx = x(it) + (it.width || 0) / 2;
      ordre.forEach(function (k) { if (col[k] != null && Math.abs(col[k] - cx) <= 6) tiret[k] = true; });
    });
    var sans = ordre.filter(function (k) { return col[k] != null && !tiret[k]; });
    /* Une seule colonne sans tiret, c'est la gravité. Si plusieurs, on ne
       tranche pas : la gravité reste inconnue. */
    if (sans.length === 1) return GRAVITE[sans[0]];
    return null;
  }

  var RE_CODE = /\b(\d{2,4}[/_][0-9A-Za-z_]+)\b/;
  var RE_HEURE = /\b(\d{1,2}:\d{2})\b/g;

  function parseLigne(texte) {
    var sansInf = texte.replace(/^Infraction\s*/i, "");
    var mcode = sansInf.match(RE_CODE);
    if (!mcode) return null;
    var code = mcode[1];
    var avant = sansInf.slice(0, mcode.index).trim();           /* l'intervalle */
    var apres = sansInf.slice(mcode.index + code.length).trim();
    /* les trois dernières heures de la ligne sont durée, norme, écart */
    var heures = apres.match(RE_HEURE) || [];
    var duree = null, norme = null, ecart = null, description = apres;
    if (heures.length >= 3) {
      var trois = heures.slice(-3);
      duree = trois[0]; norme = trois[1]; ecart = trois[2];
      var posDuree = apres.lastIndexOf(trois.join(" "));
      if (posDuree < 0) posDuree = apres.indexOf(trois[0]);
      description = apres.slice(0, posDuree).trim();
    }
    return { intervalle: avant, code: code, description: description,
      duree: duree, norme: norme, ecart: ecart };
  }

  function nomConducteur(rangs) {
    for (var i = 0; i < rangs.length; i++) {
      var t = rangs[i].texte || "";
      /* « Carte conducteur : MOHAMED EL MANAA LADHARI 10000007621900 F ... » :
         le nom est la suite de majuscules qui précède le long numéro de carte. */
      var m = t.match(/([A-ZÀ-Ö][A-ZÀ-Ö' -]{3,})\s+\d{10,}/);
      if (m) return m[1].replace(/\s+/g, " ").trim();
    }
    return "";
  }

  /* Les libellés des codes, repris mot pour mot du rapport là où il les donne.
     Servent de secours quand la description manque, parce qu'elle passe à la
     ligne et n'est pas reprise. Un code absent de cette table garde le code. */
  var CODES_LABEL = {
    "561/7_0":  "Dépassement de la durée maximale de conduite continue",
    "561/6_1b": "Dépassement de la durée de conduite journalière de 10 h lorsque l'extension est autorisée",
    "561/8_2a": "Repos journalier insuffisant (moins de 11 h)",
    "561/8_2b": "Repos journalier réduit insuffisant de moins de 9 h lorsqu'un repos journalier réduit est autorisé",
    "561/8_6d": "Compensation insuffisante d'un repos hebdomadaire réduit",
    "15_4b":    "Dépassement de la durée maximale hebdomadaire de travail de 60 h lorsqu'aucune dérogation au titre de l'article 8 n'a été accordée",
    "15_5_1b":  "Pause obligatoire insuffisante lorsque le temps de travail dépasse 9 heures",
  };

  /* Combler les descriptions manquantes : d'abord un même code décrit ailleurs
     dans le rapport, sinon le libellé connu du code. */
  function completerDescriptions(L) {
    var parCode = {};
    L.forEach(function (i) { if (i.description && !parCode[i.code]) parCode[i.code] = i.description; });
    L.forEach(function (i) {
      if (i.description) return;
      i.description = parCode[i.code] || CODES_LABEL[i.code] || "";
    });
    return L;
  }

  /* ─────────────────── le rapport « Correspondance des données » ───────────
     Un autre format, par véhicule : chaque segment est soit une session de
     carte (avec le conducteur nommé), soit une conduite sans carte (carte non
     insérée), avec sa durée et ses kilomètres. La conduite sans carte ne porte
     pas de nom : on la rattache au conducteur de la session qui la précède sur
     le même véhicule. Si aucune session nommée ne précède sur ce véhicule, le
     conducteur reste à confirmer : on ne reporte pas celui d'un autre camion. */
  var RE_PLAQUE = /\b([A-Z]{2}-\d{3}-[A-Z]{2})\b/;
  /* La ligne centrale d'un enregistrement : deux horodatages à la suite, puis,
     pour une conduite sans carte, les durées, l'odomètre et les kilomètres. */
  var RE_PAIRE = /^(\d{2})\/(\d{2})\/(\d{4})\s+\d{1,2}:\d{2}\s+\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}(.*)$/;

  function estCorrespondance(textes) {
    return textes.some(function (t) { return /Correspondance des donn[ée]es/i.test(t); });
  }
  function motsNom(s) {
    return String(s || "").split(" ")
      .filter(function (w) { return w && w !== "TEC" && /[A-Za-zÀ-ÿ]/.test(w); });
  }
  /* pdf.js rend l'enregistrement sur trois lignes : un libellé (nom du
     conducteur et « Données non définitives », ou « Carte conducteur non
     insérée »), puis la ligne des deux horodatages et des données, puis une
     continuation (le nom de famille et une heure, ou « ! »). On lit donc la
     ligne des dates et on classe d'après la ligne qui la précède. La conduite
     sans carte se rattache au conducteur de la dernière session de carte du
     même véhicule ; à défaut, elle reste à confirmer. */
  function parseCorrespondance(txts) {
    var out = [], veh = null, dernier = null;
    for (var i = 0; i < txts.length; i++) {
      var t = (txts[i] || "").trim();
      var mp = t.match(RE_PLAQUE);
      if (mp && t.length <= 18 && !/\d{2}\/\d{2}\/\d{4}/.test(t)) {
        if (mp[1] !== veh) { veh = mp[1]; dernier = null; }
        continue;
      }
      var md = t.match(RE_PAIRE);
      if (!md) continue;
      var date = md[3] + "-" + md[2] + "-" + md[1];
      var reste = (md[4] || "").replace(/ /g, " ");
      var prev = (txts[i - 1] || "").trim();
      var next = (txts[i + 1] || "").trim();
      /* Deux dispositions selon le producteur du PDF. B : tout l'enregistrement
         sur une ligne, « Carte conducteur non insérée » dans la ligne même.
         A : l'enregistrement est éclaté sur trois lignes, le libellé « Carte
         conducteur non insérée » tient seul sur la ligne du dessus, qui ne
         porte pas les deux horodatages. On ne retient prev que s'il n'est pas
         lui-même une ligne d'enregistrement, sans quoi une session suivant une
         conduite sans carte serait prise pour une conduite sans carte. */
      var sansCarte = /Carte conducteur non ins[eé]r/i.test(reste) ||
        (/Carte conducteur non ins[eé]r/i.test(prev) && !RE_PAIRE.test(prev));
      if (sansCarte) {
        /* conduite sans carte : km = dernier entier de la ligne (après avoir
           ôté les durées en H:MM), conducteur = celui de la dernière session de
           carte du même véhicule */
        var nums = reste.replace(/\d{1,2}:\d{2}/g, " ").match(/\d{1,4}/g) || [];
        var km = nums.length ? parseInt(nums[nums.length - 1], 10) : null;
        out.push({ vehicule: veh, conducteur: dernier, date: date, km: km });
      } else {
        /* une session de carte. B : le nom est sur la ligne même, avant
           « Données non définitives ». A : le nom est sur la ligne, ou scindé
           entre la ligne du dessus (prénom, avant « Données ») et celle du
           dessous (nom). */
        var nom = nomSession(reste);
        if (!nom && /Donn[ée]es/i.test(prev)) {
          var prenom = prev.split(/Donn[ée]es|Dernier|error|!/i)[0].trim();
          var suite = next.replace(/\s*\d{1,2}:\d{2}.*$/, "").trim();
          nom = motsNom(prenom + " " + suite).join(" ").trim();
        }
        if (nom && nom.length <= 40 &&
            !/TachoSAFE|Szoft|Developed|Design|Correspondance|Fuseau|Total|Donn[ée]es|Carte/i.test(nom)) {
          dernier = nom;
        }
      }
    }
    return out;
  }
  /* Le nom d'une session, pris avant « Données non définitives » ou la mention
     de dernier téléchargement. */
  function nomSession(s) {
    var base = String(s || "").split(/Donn[ée]es|Dernier t[ée]l[ée]chargement|error|!/i)[0];
    return motsNom(base).join(" ").trim();
  }

  /* ───────────────── le rapport « RAPPORT D'INFRACTIONS » ──────────────────
     Le relevé mensuel produit par TachoSAFE, une section par conducteur. Chaque
     section ouvre sur « Nom du conducteur », « Numéro de carte », « Période
     sélectionnée », puis un tableau récapitulatif par code, puis le détail : une
     ligne par infraction, avec date de début, date de fin parfois, code, durée,
     norme, écart, et la gravité marquée par un point dans l'une des quatre
     colonnes IM, IG, ITG, IPG. Le point est rendu par pdf.js comme un fragment
     vide placé à l'abscisse de sa colonne : on lit donc la colonne, pas le
     texte. Les descriptions des codes sont celles que le rapport imprime
     lui-même, reprises mot pour mot. */

  var CODES_INFRA = {
    "2006/561/6.1a": "Dépassement de la durée de conduite journalière de 9 h lorsque l'extension à 10 h n'est pas autorisée.",
    "2006/561/6.1b": "Dépassement de la durée de conduite journalière de 10 h lorsque l'extension est autorisée.",
    "2006/561/6.2":  "Dépassement de la durée de conduite hebdomadaire.",
    "2006/561/6.3":  "Dépassement de la durée totale de conduite sur deux semaines consécutives.",
    "2006/561/7.0":  "Dépassement de la durée maximale de conduite continue.",
    "2006/561/8.2a": "Repos journalier insuffisant de moins de 11 heures lorsqu'un repos journalier réduit n'est pas autorisé.",
    "2006/561/8.2b": "Repos journalier réduit insuffisant de moins de 9 h lorsqu'un repos journalier réduit est autorisé.",
    "2006/561/8.5":  "Repos journalier insuffisant de moins de 9 h en équipage multiple.",
    "2006/561/8.6a": "Repos hebdomadaire insuffisant de moins de 45 h lorsqu'un repos hebdomadaire réduit n'est pas autorisé.",
    "2006/561/8.6b": "Repos hebdomadaire insuffisant de moins de 45 h lorsqu'un repos hebdomadaire réduit est autorisé.",
    "2006/561/8.6d": "Compensation insuffisante d'un repos hebdomadaire réduit.",
    "2002/15/EC/15.7.1":  "Dépassement de la durée quotidienne de travail de 10 heures sur une période de 24 heures lorsqu'un travail de nuit est effectué et qu'aucune dérogation au titre de l'article 8 n'a été accordée.",
    "2002/15/EC/15.5.1a": "Le temps de travail doit être interrompu par une pause d'au moins 30 minutes lorsque la durée totale du travail est comprise entre six et neuf heures.",
    "2002/15/EC/15.5.1b": "Pause obligatoire insuffisante lorsque le temps de travail dépasse 9 heures.",
    "2002/15/EC/15.4a": "Dépassement de la durée maximale hebdomadaire de travail de 48 h lorsque la possibilité d'extension à 60 h a déjà été utilisée.",
    "2002/15/EC/15.4b": "Dépassement de la durée maximale hebdomadaire de travail de 60 h lorsqu'aucune dérogation au titre de l'article 8 n'a été accordée.",
  };
  function cleCode(c) { return String(c || "").replace(/_/g, "."); }

  function estInfractions(textes) {
    var s = textes.join(" ");
    return /RAPPORT D.?INFRACTIONS/i.test(s) ||
      (/Nom du conducteur/i.test(s) && /L[ée]gislation s[ée]lectionn[ée]e/i.test(s));
  }

  /* Un fragment est une date horodatée « JJ/MM/AAAA HH:MM ». */
  var RE_DATEH = /^(\d{2})\/(\d{2})\/(\d{4})\s+\d{1,2}:\d{2}$/;
  /* Un code de législation : « 2006/561/7.0 » ou « 2002/15/EC/15.7_1 ». */
  function estCodeInfra(s) { return /\/(561|EC)\//.test(s) && /\d/.test(s); }
  /* Une valeur de durée : « 10:00 », « 0:13 », « 40:23 » ou « --:-- ». */
  function estHeure(s) { return /^(--:--|\d{1,3}:\d{2})$/.test(s); }

  /* Les abscisses des quatre colonnes de gravité du tableau de détail
     (en-têtes IM, IG, ITG, IPG), lues sur la ligne d'en-tête. */
  function colonnesInfra(rang) {
    var col = {};
    rang.its.forEach(function (it) {
      var s = (it.str || "").trim();
      if (GRAVITE[s] && col[s] == null) col[s] = x(it) + (it.width || 0) / 2;
    });
    return col;
  }

  /* La gravité d'une ligne de détail : le point (fragment vide) posé à droite
     de la colonne « Différence », dans l'une des quatre colonnes. On prend la
     colonne la plus proche de ce fragment. */
  function graviteInfra(rang, col) {
    if (!col) return null;
    var ordre = ["IM", "IG", "ITG", "IPG"], best = null, bestD = 10;
    rang.its.forEach(function (it) {
      /* le point de gravité est un glyphe d'une police d'icônes, dans la zone à
         usage privé (U+E000 et au delà), et non un espace ou un tiret. */
      var s = it.str || "";
      if (!(s.length >= 1 && s.charCodeAt(0) >= 0xE000)) return;
      var cx = x(it); if (!(cx > 485)) return;
      ordre.forEach(function (k) {
        if (col[k] == null) return;
        var d = Math.abs(col[k] - cx);
        if (d < bestD) { bestD = d; best = k; }
      });
    });
    return best ? GRAVITE[best] : null;
  }

  /* Une ligne de détail, lue par abscisses : les dates à gauche, le code, puis
     les trois durées (durée relevée, norme, écart), puis la gravité. */
  function parseLigneInfra(rang, col) {
    var its = rang.its.slice().sort(function (a, b) { return x(a) - x(b); });
    var dates = [], code = null, heures = [];
    its.forEach(function (it) {
      var s = (it.str || "").trim();
      if (!s) return;
      if (RE_DATEH.test(s)) { dates.push({ x: x(it), s: s }); return; }
      if (!code && estCodeInfra(s)) { code = s; return; }
      if (code && estHeure(s)) heures.push(s);
    });
    if (!code || !dates.length) return null;
    function iso(s) { var m = s.match(RE_DATEH); return m[3] + "-" + m[2] + "-" + m[1]; }
    var debut = iso(dates[0].s);
    var fin = dates.length > 1 ? iso(dates[1].s) : null;
    var duree = heures[0] || null, norme = heures[1] || null, ecart = heures[2] || null;
    return { date: debut, dateFin: fin, code: code,
      duree: duree, norme: norme, ecart: ecart, gravite: graviteInfra(rang, col) };
  }

  function dedoublonnerInfra(L) {
    var vus = {}, out = [];
    L.forEach(function (i) {
      var cle = [i.date, i.dateFin, cleCode(i.code), i.duree].join("|");
      if (vus[cle]) return;
      vus[cle] = true; out.push(i);
    });
    return out;
  }

  /* Le découpage en sections conducteur. Les rangs arrivent dans l'ordre de
     lecture (haut vers le bas, page après page). Une section s'ouvre à
     « Nom du conducteur », et tout le détail qui suit lui revient, jusqu'au
     conducteur suivant. L'en-tête de détail fixe les colonnes de gravité. */
  function parseInfractions(rangs) {
    var conducteurs = [], cur = null, col = null;
    rangs.forEach(function (r) {
      var t = r.texte || "";
      var mn = t.match(/Nom du conducteur\s+(.+)$/i);
      if (mn) { cur = { nom: mn[1].trim(), numero: "", periode: "", infractions: [] };
        conducteurs.push(cur); col = null; return; }
      if (!cur) return;
      var mc = t.match(/Num[ée]ro de carte\s+(\S+)/i);
      if (mc) { cur.numero = mc[1]; return; }
      var mp = t.match(/P[ée]riode s[ée]lectionn[ée]e\s+(.+)$/i);
      if (mp) { cur.periode = mp[1].trim(); return; }
      if (/Date de d[ée]but/i.test(t) && /\bIM\b/.test(t)) { col = colonnesInfra(r); return; }
      if (RE_DATEH.test((t.match(/^\d{2}\/\d{2}\/\d{4}\s+\d{1,2}:\d{2}/) || [""])[0]) ) {
        if (!estCodeInfra(t)) return;
        var inf = parseLigneInfra(r, col);
        if (inf) cur.infractions.push(inf);
      }
    });
    conducteurs.forEach(function (c) { c.infractions = dedoublonnerInfra(c.infractions); });
    return conducteurs.filter(function (c) { return c.infractions.length; });
  }

  function lire(buf) {
    return charger().then(function (pdfjsLib) {
      var data = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
      return pdfjsLib.getDocument({ data: data, isEvalSupported: false }).promise;
    }).then(function (doc) {
      var pages = [];
      for (var p = 1; p <= doc.numPages; p++) pages.push(p);
      var nom = "", brut = [], textes = [], rangsTous = [];
      return pages.reduce(function (ch, p) {
        return ch.then(function () {
          return doc.getPage(p).then(function (page) { return page.getTextContent(); })
            .then(function (contenu) {
              var rangs = lignes(contenu.items || []);
              rangs.forEach(function (r) { if (r.texte) textes.push(r.texte); rangsTous.push(r); });
              if (!nom) nom = nomConducteur(rangs);
              var col = colonnes(rangs), jour = null;
              rangs.forEach(function (r) {
                var dm = (r.texte || "").match(/^(\d{2}\/\d{2}\/\d{4})\b/);
                if (dm) { jour = isoFr(dm[1]); return; }
                if (!/^Infraction\b/i.test(r.texte || "")) return;
                var inf = parseLigne(r.texte);
                if (!inf) return;
                inf.date = jour;
                inf.gravite = graviteDe(r, col);
                brut.push(inf);
              });
            });
        });
      }, Promise.resolve()).then(function () {
        if (estInfractions(textes)) {
          return { source: "pdf-infractions", conducteurs: parseInfractions(rangsTous) };
        }
        if (estCorrespondance(textes)) {
          return { source: "pdf-correspondance", segments: parseCorrespondance(textes) };
        }
        return { source: "pdf-rapport", conducteur: { nom: nom },
          infractions: completerDescriptions(dedoublonner(brut)) };
      });
    });
  }

  function isoFr(jjmmaaaa) {
    var m = jjmmaaaa.split("/");
    return m[2] + "-" + m[1] + "-" + m[0];
  }

  function dedoublonner(L) {
    var vus = {}, out = [];
    L.forEach(function (i) {
      var cle = [i.code, i.duree, i.norme, i.ecart, (i.description || "").slice(0, 40)].join("|");
      if (vus[cle]) return;
      vus[cle] = true; out.push(i);
    });
    return out;
  }

  /* Les infractions mises au format du suivi (comme lecture-carte.js), prêtes à
     porter dans la fiche du conducteur. La description sert de type ; à défaut,
     le code. La gravité suit. */
  function anomalies(rapport) {
    if (rapport && rapport.source === "pdf-infractions") {
      var out = [];
      (rapport.conducteurs || []).forEach(function (c) {
        (c.infractions || []).forEach(function (i) {
          var desc = CODES_INFRA[cleCode(i.code)] || ("infraction " + i.code);
          var g = i.gravite;
          var detail = "Relevé au rapport d'infractions" +
            (i.date ? " le " + i.date : "") +
            (i.dateFin && i.dateFin !== i.date ? " (jusqu'au " + i.dateFin + ")" : "") +
            " : " + desc +
            (i.ecart && i.ecart !== "--:--" ? " Dépassement relevé : " + i.ecart +
              (i.norme ? " (norme " + i.norme + ")" : "") + "." : "") +
            " Code " + i.code + (g ? ", gravité " + g.label : "") + ".";
          out.push({ date: i.date || "", type: desc.toLowerCase().replace(/\.$/, ""),
            detail: detail, grave: !!(g && g.grave), code: i.code, conducteur: c.nom });
        });
      });
      return out;
    }
    if (rapport && rapport.source === "pdf-correspondance") {
      return (rapport.segments || []).map(function (s) {
        var detail = "Conduite sans carte relevée au rapport de correspondance" +
          (s.date ? " le " + s.date : "") + (s.vehicule ? ", véhicule " + s.vehicule : "") +
          (s.km != null ? ", " + s.km + " km" : "") +
          (s.conducteur ? ". Conducteur rattaché : " + s.conducteur + " (sessions encadrantes)."
            : ". Conducteur à confirmer (aucune session de carte encadrante sur ce véhicule).");
        return { date: s.date || "", type: "conduite sans carte",
          detail: detail, grave: false, conducteur: s.conducteur || "", vehicule: s.vehicule || "" };
      });
    }
    return (rapport.infractions || []).map(function (i) {
      var type = (i.description || ("infraction " + i.code)).toLowerCase().replace(/\.$/, "");
      var detail = "Relevé au rapport" + (i.date ? " le " + i.date : "") +
        (i.duree ? " : " + i.duree + " pour une norme de " + (i.norme || "") : "") +
        (i.code ? " (code " + i.code + ")" : "") +
        (i.gravite ? ", gravité " + i.gravite.label : "") + ".";
      return { date: i.date || "", type: type, detail: detail,
        grave: !!(i.gravite && i.gravite.grave), code: i.code };
    });
  }

  window.LectureRapport = { lire: lire, anomalies: anomalies, GRAVITE: GRAVITE, charger: charger };
})(window);
