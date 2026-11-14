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
  var RE_DT = /^(\d{2}\/\d{2}\/\d{4})\s+\d{1,2}:\d{2}$/;

  function estCorrespondance(textes) {
    return textes.some(function (t) { return /Correspondance des donn[ée]es/i.test(t); });
  }
  function dateDT(s) {
    var m = (s || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    return m ? m[3] + "-" + m[2] + "-" + m[1] : null;
  }
  function nettoyerNom(noms) {
    return noms.join(" ").replace(/\s+/g, " ").trim().split(" ")
      .filter(function (w) { return w && w !== "TEC" && w.length > 1; }).join(" ");
  }
  function parseCorrespondance(txts) {
    var out = [], veh = null, dernier = null, i = 0, n = txts.length;
    function estDT(s) { return RE_DT.test((s || "").trim()); }
    while (i < n) {
      var t = (txts[i] || "").trim(), mp = t.match(RE_PLAQUE);
      if (mp && t.length <= 16) { if (mp[1] !== veh) { veh = mp[1]; dernier = null; } i++; continue; }
      if (estDT(t)) {
        var debut = t, fin = estDT(txts[i + 1]) ? txts[i + 1].trim() : null, j = i + (fin ? 2 : 1), pay = [];
        while (j < n) {
          var u = (txts[j] || "").trim();
          if (estDT(u)) break;
          if (RE_PLAQUE.test(u) && u.length <= 16) break;
          pay.push(u); j++;
        }
        var bloc = pay.join(" ");
        if (/Carte conducteur non ins[eé]r/i.test(bloc)) {
          var km = null;
          for (var k = pay.length - 1; k >= 0; k--) { var mk = pay[k].match(/^(\d{1,4})$/); if (mk) { km = +mk[1]; break; } }
          out.push({ vehicule: veh, conducteur: dernier, date: dateDT(debut), km: km });
        } else {
          var noms = pay.filter(function (s) {
            return /^[A-ZÀ-Ÿ][A-ZÀ-Ÿ' -]+$/.test(s) && !/ERROR|DONN|CARTE|NON|OUTLINE/i.test(s);
          });
          var nom = nettoyerNom(noms); if (nom) dernier = nom;
        }
        i = j; continue;
      }
      i++;
    }
    return out;
  }

  function lire(buf) {
    return charger().then(function (pdfjsLib) {
      var data = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
      return pdfjsLib.getDocument({ data: data, isEvalSupported: false }).promise;
    }).then(function (doc) {
      var pages = [];
      for (var p = 1; p <= doc.numPages; p++) pages.push(p);
      var nom = "", brut = [], textes = [];
      return pages.reduce(function (ch, p) {
        return ch.then(function () {
          return doc.getPage(p).then(function (page) { return page.getTextContent(); })
            .then(function (contenu) {
              var rangs = lignes(contenu.items || []);
              rangs.forEach(function (r) { if (r.texte) textes.push(r.texte); });
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
