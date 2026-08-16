/* Le formulaire d'audit, commun aux deux modules.

   Les deux pages ne diffèrent que par le moteur chargé, le libellé et le
   dossier d'exemple : tout le reste vit ici. Les champs ne sont pas ressaisis,
   ils sont engendrés par le questionnaire du moteur ; les valeurs proposées ne
   sont pas écrites à la main non plus, elles viennent du code des contrôles.
   Le formulaire ne peut donc demander, ni proposer, que ce que la base sait
   exploiter.

   Rien ne quitte le poste : l'audit se calcule dans le navigateur, les fichiers
   déposés sont lus en mémoire, et le brouillon reste dans le stockage local.

   Configuration attendue avant le chargement de ce script :
     window.__MOTEUR   nom de la variable globale du moteur
     window.__CLE      clé du brouillon dans le stockage local
     window.__EXEMPLE  dossier d'exemple                                     */
(function () {
  "use strict";
  var M = window[window.__MOTEUR || "MoteurEco"];
  var PROP = M.propositions || {};
  var form = document.getElementById("formulaire");
  var sortie = document.getElementById("sortie");
  var CLE = window.__CLE || "audit-brouillon";
  var EXEMPLE = window.__EXEMPLE || {};

  var ech = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  /* ---------------------------------------------------- la formule d'usage

     Écrite une fois, à trois endroits : un bouton toujours accessible en tête
     de page, et le pied de tout rapport — à l'écran comme dans le Word et le
     PDF. Un rapport se détache de l'application dès qu'il est exporté ; la
     réserve doit voyager avec lui, sinon elle ne protège rien. */
  var AVERTISSEMENT = [
    "Cet outil vous assiste dans votre démarche. Il ne se substitue pas au conseil d'un avocat, "
      + "ni à celui de votre conseil habituel, ni à la décision de l'autorité administrative ou du juge.",
    "Les constats qu'il produit reposent sur les seules données que vous avez saisies et sur les textes "
      + "en vigueur à la date de l'audit. Ils ne constituent pas une consultation juridique et n'engagent "
      + "pas leur auteur. La décision, et la responsabilité qui l'accompagne, restent les vôtres.",
    "L'application n'apprécie pas ce que la loi confie à l'appréciation du juge, et elle ne lit pas vos "
      + "accords collectifs tant qu'ils ne lui sont pas joints : un résultat « conforme » se lit sous cette "
      + "réserve, qui figure dans le rapport.",
    "Rien ne quitte votre poste : l'audit se calcule dans votre navigateur, et les fichiers déposés sont "
      + "lus en mémoire."
  ];
  var PIED_RAPPORT = [
    { k: "trait" },
    { k: "h2", t: "Avertissement" }
  ].concat(AVERTISSEMENT.map(function (t) { return { k: "note", t: t }; }));

  function poserAvertissement() {
    var d = document.createElement("dialog");
    d.id = "dlg-avertissement";
    d.style.cssText = "max-width:64ch;border:1px solid #d8dbe0;border-radius:12px;padding:22px 24px;"
      + "font:15px/1.55 system-ui;color:#1c2126";
    d.innerHTML = "<h2 style=\"margin:0 0 12px;font:600 19px/1.3 system-ui\">Avertissement d'usage</h2>"
      + AVERTISSEMENT.map(function (t) { return '<p style="margin:0 0 10px">' + ech(t) + "</p>"; }).join("")
      + '<form method="dialog" style="margin-top:14px"><button style="font:inherit;padding:8px 18px;'
      + 'border-radius:8px;border:1px solid #d8dbe0;background:#f6f7f9;cursor:pointer">Fermer</button></form>';
    document.body.appendChild(d);
    var boutons = document.querySelectorAll("[data-avertissement]");
    for (var i = 0; i < boutons.length; i++)
      boutons[i].addEventListener("click", function () {
        if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
      });
  }
  poserAvertissement();

  /* ------------------------------------------------------------------ types */
  function typeDe(format) {
    var f = String(format || "").toLowerCase();
    if (f.indexOf("oui") === 0) return "oui-non";
    if (f.indexOf("aaaa-mm-jj") >= 0) return "date";
    /* Les listes d'abord : « liste de nombres » est une liste, pas un nombre. */
    if (f.indexOf("liste") >= 0 || f.indexOf("objet") >= 0 || f.indexOf("tableau") >= 0) return "json";
    /* Puis les nombres, y compris qualifiés — « nombre de mois », « nombre
       d'années ». Sans cela ils arrivaient au moteur sous forme de chaîne, et
       les contrôles les tenaient pour non renseignés. */
    if (f.indexOf("nombre") === 0 || f === "euros" || f.indexOf("chiffres") >= 0) return "nombre";
    if (f === "1 à 4") return "cause";
    return "texte";
  }
  var AUTRE = "— autre —";

  /* ------------------------------------------------- lecture d'un tableur ou
     d'un document Word.

     Un .xlsx comme un .docx est une archive ZIP contenant du XML. Tout se fait
     ici, sans bibliothèque : le navigateur sait décompresser (DecompressionStream)
     et analyser du XML (DOMParser). C'est la seule façon de tenir la promesse
     de la page — rien ne quitte le poste. Un fichier envoyé à un service tiers
     pour y être converti serait un fichier sorti de l'entreprise. */
  function u16(d, o) { return d[o] | (d[o + 1] << 8); }
  function u32(d, o) { return (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0; }

  function entreesZip(buf) {
    var d = new Uint8Array(buf), i, fin = -1;
    /* Le répertoire central se trouve par la fin : on remonte jusqu'à sa marque. */
    for (i = d.length - 22; i >= 0 && i > d.length - 66000; i--)
      if (u32(d, i) === 0x06054b50) { fin = i; break; }
    if (fin < 0) throw new Error("ce fichier n'est pas une archive lisible");
    var n = u16(d, fin + 10), o = u32(d, fin + 16), out = {};
    for (i = 0; i < n && o + 46 <= d.length; i++) {
      if (u32(d, o) !== 0x02014b50) break;
      var nl = u16(d, o + 28), el = u16(d, o + 30), cl = u16(d, o + 32);
      var nom = new TextDecoder().decode(d.subarray(o + 46, o + 46 + nl));
      out[nom] = { methode: u16(d, o + 10), taille: u32(d, o + 20), local: u32(d, o + 42) };
      o += 46 + nl + el + cl;
    }
    return { d: d, entrees: out };
  }

  function lireEntree(zip, nom) {
    var e = zip.entrees[nom];
    if (!e) return Promise.resolve(null);
    var d = zip.d, o = e.local;
    if (u32(d, o) !== 0x04034b50) return Promise.resolve(null);
    var deb = o + 30 + u16(d, o + 26) + u16(d, o + 28);
    var brut = d.subarray(deb, deb + e.taille);
    if (e.methode === 0) return Promise.resolve(new TextDecoder().decode(brut));
    if (e.methode !== 8 || typeof DecompressionStream === "undefined")
      return Promise.reject(new Error("compression non prise en charge par ce navigateur"));
    var flux = new Blob([brut]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Response(flux).text();
  }

  var xml = function (t) { return new DOMParser().parseFromString(t, "application/xml"); };
  var textes = function (n, sel) {
    return Array.prototype.map.call(n.getElementsByTagName(sel), function (x) { return x.textContent; });
  };

  /* Un classeur : la première feuille, rendue en lignes de cellules. */
  function lireXlsx(buf) {
    var zip = entreesZip(buf);
    var feuille = Object.keys(zip.entrees).filter(function (n) {
      return /^xl\/worksheets\/sheet\d+\.xml$/.test(n);
    }).sort()[0];
    if (!feuille) throw new Error("aucune feuille de calcul dans ce classeur");
    return lireEntree(zip, "xl/sharedStrings.xml").then(function (ss) {
      var partagees = [];
      if (ss) {
        var si = xml(ss).getElementsByTagName("si");
        for (var i = 0; i < si.length; i++) partagees.push(textes(si[i], "t").join(""));
      }
      return lireEntree(zip, feuille).then(function (s) {
        var doc = xml(s), rows = doc.getElementsByTagName("row"), out = [];
        for (var r = 0; r < rows.length; r++) {
          var cs = rows[r].getElementsByTagName("c"), ligne = [];
          for (var k = 0; k < cs.length; k++) {
            var ref = cs[k].getAttribute("r") || "", col = 0;
            var lettres = ref.replace(/\d+/g, "");
            for (var j = 0; j < lettres.length; j++) col = col * 26 + (lettres.charCodeAt(j) - 64);
            col = col ? col - 1 : ligne.length;
            var t = cs[k].getAttribute("t"), v = cs[k].getElementsByTagName("v")[0];
            var val = t === "s" ? (partagees[+(v ? v.textContent : 0)] || "")
              : (t === "inlineStr" ? textes(cs[k], "t").join("") : (v ? v.textContent : ""));
            while (ligne.length < col) ligne.push("");
            ligne[col] = val;
          }
          out.push(ligne);
        }
        return out;
      });
    });
  }

  /* Un document Word : ses tableaux d'abord — c'est là que vivent les données
     structurées — et, à défaut, ses paragraphes, une ligne par paragraphe. */
  function lireDocx(buf) {
    var zip = entreesZip(buf);
    return lireEntree(zip, "word/document.xml").then(function (s) {
      if (!s) throw new Error("document Word illisible");
      var doc = xml(s), tbl = doc.getElementsByTagName("w:tbl");
      if (tbl.length) {
        var out = [], trs = tbl[0].getElementsByTagName("w:tr");
        for (var r = 0; r < trs.length; r++) {
          var tcs = trs[r].getElementsByTagName("w:tc"), l = [];
          for (var c = 0; c < tcs.length; c++) l.push(textes(tcs[c], "w:t").join("").trim());
          out.push(l);
        }
        return out;
      }
      var ps = doc.getElementsByTagName("w:p"), lignes = [];
      for (var i = 0; i < ps.length; i++) {
        var t = textes(ps[i], "w:t").join("").trim();
        if (t) lignes.push([t]);
      }
      return lignes;
    });
  }

  /* Un PDF : le texte qu'il contient, ligne par ligne.

     Un PDF n'est pas un tableau, c'est une mise en page : les colonnes n'y sont
     que des positions. On en tire donc le texte, et l'on retrouve les colonnes
     à la séparation — tabulation, point-virgule, ou deux espaces et plus. C'est
     un secours, jamais aussi sûr qu'un tableur : le résultat est affiché pour
     être relu avant d'être utilisé.

     Deux limites, dites plutôt que contournées. Un PDF scanné ne contient
     aucun texte, seulement une image : rien n'en sortira, et le message le dit
     au lieu de rendre une liste vide. Un PDF dont les polices n'embarquent pas
     leur table de correspondance peut rendre des caractères faux ; on le
     détecte au taux de caractères non imprimables et on refuse plutôt que de
     livrer une bouillie. */
  function inflate(brut, zlib) {
    var f = new Blob([brut]).stream().pipeThrough(new DecompressionStream(zlib ? "deflate" : "deflate-raw"));
    return new Response(f).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }

  function lirePdf(buf) {
    if (typeof DecompressionStream === "undefined")
      return Promise.reject(new Error("ce navigateur ne sait pas décompresser un PDF"));
    var d = new Uint8Array(buf);
    var latin = new TextDecoder("latin1");
    var brut = latin.decode(d);
    /* Les flux : chacun précédé de son dictionnaire. */
    var flux = [], re = /stream\r?\n?/g, m;
    while ((m = re.exec(brut))) {
      var deb = m.index + m[0].length;
      var fin = brut.indexOf("endstream", deb);
      if (fin < 0) continue;
      var dict = brut.slice(Math.max(0, m.index - 900), m.index);
      /* Le dictionnaire annonce la longueur exacte : s'y fier évite de livrer au
         décompresseur le saut de ligne qui précède « endstream », qu'il refuse. */
      var lg = (dict.match(/\/Length\s+(\d+)/) || [])[1];
      var stop = lg ? Math.min(fin, deb + (+lg)) : fin;
      while (stop > deb && (d[stop - 1] === 10 || d[stop - 1] === 13)) stop--;
      flux.push({ dict: dict, octets: d.subarray(deb, stop) });
      re.lastIndex = fin;
    }
    if (!flux.length) return Promise.reject(new Error("aucun flux de contenu : ce PDF est probablement une image scannée"));
    return Promise.all(flux.map(function (f) {
      if (!/\/FlateDecode/.test(f.dict)) return Promise.resolve(latin.decode(f.octets));
      return inflate(f.octets, true).then(function (u) { return latin.decode(u); })
        .catch(function () {
          /* Certains producteurs écrivent un flux brut, sans en-tête zlib. */
          return inflate(f.octets, false).then(function (u) { return latin.decode(u); })
            .catch(function () { return ""; });
        });
    })).then(function (contenus) {
      /* Les tables de correspondance des polices, réunies. Réserve assumée :
         si deux polices se contredisent sur un même code, la dernière lue
         l'emporte — c'est rare, et le résultat reste affiché avant usage. */
      var uni = {};
      contenus.forEach(function (c) {
        if (c.indexOf("beginbfchar") < 0 && c.indexOf("beginbfrange") < 0) return;
        var r1 = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g, x;
        var zonesChar = c.split("beginbfchar").slice(1);
        zonesChar.forEach(function (z) {
          z = z.split("endbfchar")[0];
          while ((x = r1.exec(z))) uni[parseInt(x[1], 16)] = hexVersTexte(x[2]);
        });
        var zonesRange = c.split("beginbfrange").slice(1);
        zonesRange.forEach(function (z) {
          z = z.split("endbfrange")[0];
          var r2 = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g, y;
          while ((y = r2.exec(z))) {
            var a = parseInt(y[1], 16), b = parseInt(y[2], 16), base = parseInt(y[3], 16);
            for (var i = a; i <= b && i - a < 4096; i++)
              uni[i] = String.fromCharCode(base + (i - a));
          }
        });
      });
      var lignes = [];
      contenus.forEach(function (c) {
        if (c.indexOf("Tj") < 0 && c.indexOf("TJ") < 0) return;
        lignes = lignes.concat(texteDuFlux(c, uni));
      });
      if (!lignes.length)
        throw new Error("aucun texte : ce PDF est probablement une image scannée, ou son texte n'est pas extractible");
      var mauvais = lignes.join("").replace(/[^\uFFFD\u0000-\u001F]/g, "").length;
      if (mauvais > lignes.join("").length / 20)
        throw new Error("le texte extrait est illisible — les polices de ce PDF n'embarquent pas leur table de correspondance");
      /* Les colonnes : tabulation, point-virgule, ou deux espaces et plus. */
      return lignes.map(function (l) {
        return l.indexOf("\t") >= 0 ? l.split("\t")
          : (l.indexOf(";") >= 0 ? l.split(";") : l.split(/\s{2,}/));
      }).map(function (r) { return r.map(function (c) { return c.trim(); }); });
    });
  }

  function hexVersTexte(h) {
    var t = "";
    for (var i = 0; i + 3 < h.length + 1; i += 4) t += String.fromCharCode(parseInt(h.substr(i, 4), 16));
    return t;
  }

  /* Le texte d'un flux de contenu : les opérateurs Tj, TJ, ' et " montrent du
     texte ; Td, TD, T* et ET changent de ligne. */
  function texteDuFlux(c, uni) {
    var lignes = [], courante = "", i = 0;
    function litLitteral(k) {
      var prof = 1, out = "";
      for (k++; k < c.length && prof; k++) {
        var ch = c[k];
        if (ch === "\\") {
          var suiv = c[k + 1];
          var codes = { n: "\n", r: "", t: "\t", b: "", f: "", "(": "(", ")": ")", "\\": "\\" };
          if (suiv >= "0" && suiv <= "7") {
            var o = c.substr(k + 1, 3).match(/^[0-7]{1,3}/)[0];
            out += String.fromCharCode(parseInt(o, 8)); k += o.length;
          } else { out += codes[suiv] !== undefined ? codes[suiv] : suiv; k++; }
          continue;
        }
        if (ch === "(") prof++;
        else if (ch === ")") { prof--; if (!prof) break; }
        out += ch;
      }
      return { texte: out, fin: k };
    }
    while (i < c.length) {
      var ch = c[i];
      if (ch === "(") { var r = litLitteral(i); courante += r.texte; i = r.fin + 1; continue; }
      if (ch === "<" && c[i + 1] !== "<") {
        var f = c.indexOf(">", i);
        if (f < 0) break;
        var h = c.slice(i + 1, f).replace(/\s/g, "");
        var t = "";
        for (var k2 = 0; k2 + 1 < h.length; k2 += 2) {
          var code = parseInt(h.substr(k2, 4).length === 4 ? h.substr(k2, 4) : h.substr(k2, 2), 16);
          if (uni[code] !== undefined) { t += uni[code]; k2 += 2; }
          else t += String.fromCharCode(parseInt(h.substr(k2, 2), 16));
        }
        courante += t; i = f + 1; continue;
      }
      if (c.startsWith("Td", i) || c.startsWith("TD", i) || c.startsWith("T*", i) || c.startsWith("ET", i)) {
        if (courante.trim()) lignes.push(courante.replace(/[ \t]+$/, "").trim());
        courante = ""; i += 2; continue;
      }
      i++;
    }
    if (courante.trim()) lignes.push(courante.replace(/[ \t]+$/, "").trim());
    return lignes;
  }

  /* Un CSV : séparateur deviné sur la première ligne, guillemets respectés. */
  function lireCsv(texte) {
    var t = texte.replace(/^﻿/, "");
    var sep = (t.split("\n")[0].match(/;/g) || []).length >= (t.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
    var out = [], ligne = [], champ = "", guill = false, i;
    for (i = 0; i < t.length; i++) {
      var c = t[i];
      if (guill) {
        if (c === '"' && t[i + 1] === '"') { champ += '"'; i++; }
        else if (c === '"') guill = false;
        else champ += c;
      } else if (c === '"') guill = true;
      else if (c === sep) { ligne.push(champ); champ = ""; }
      else if (c === "\n") { ligne.push(champ); out.push(ligne); ligne = []; champ = ""; }
      else if (c !== "\r") champ += c;
    }
    if (champ !== "" || ligne.length) { ligne.push(champ); out.push(ligne); }
    return out.filter(function (l) { return l.some(function (x) { return String(x).trim() !== ""; }); });
  }

  /* Ce qu'une cellule veut dire. Le nombre et le booléen sont reconnus ; la date
     reste une chaîne, parce que le moteur l'attend au format AAAA-MM-JJ et
     qu'un tableur en donne parfois un autre — mieux vaut la laisser visible et
     fausse que la convertir en silence. */
  function cellule(v) {
    var s = String(v == null ? "" : v).trim();
    if (s === "") return "";
    if (/^(oui|vrai|true|x)$/i.test(s)) return true;
    if (/^(non|faux|false)$/i.test(s)) return false;
    var n = Number(s.replace(/ |\s/g, "").replace(",", "."));
    if (s !== "" && !isNaN(n) && /^[-+]?[\d\s .,]+$/.test(s)) return n;
    return s;
  }

  /* Des lignes vers la valeur du champ, selon ce que la question attend. */
  function versValeur(lignes, format) {
    var f = String(format || "").toLowerCase();
    var l = lignes.filter(function (x) { return x.some(function (c) { return String(c).trim() !== ""; }); });
    if (!l.length) throw new Error("aucune ligne exploitable");
    /* Une colonne exportée d'un tableur porte souvent son intitulé en première
       ligne. On ne le devine pas au vu de son texte — on le déduit de la forme :
       si toutes les lignes suivantes sont homogènes, nombres ou dates, et que la
       première ne l'est pas, c'est un en-tête. Sinon on ne retire rien : mieux
       vaut une valeur de trop, visible et corrigible, qu'une valeur perdue. */
    var forme = function (v) {
      var t = String(v).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return "date";
      if (t !== "" && !isNaN(Number(t.replace(/\s/g, "").replace(",", ".")))) return "nombre";
      return "texte";
    };
    var entete = false;
    if (l.length > 2) {
      var suite = l.slice(1).map(function (x) { return forme(x[0]); });
      var f0 = forme(l[0][0]);
      entete = suite.every(function (x) { return x === suite[0]; }) && suite[0] !== "texte" && f0 !== suite[0];
    }
    var corpsListe = entete ? l.slice(1) : l;
    var mention = "première colonne" + (entete ? ", en-tête « " + String(l[0][0]).trim() + " » écarté" : "");
    if (f.indexOf("liste de nombres") >= 0)
      return { valeur: corpsListe.map(function (x) { return cellule(x[0]); })
        .filter(function (x) { return typeof x === "number"; }), note: mention };
    if (f.indexOf("liste d'objets") >= 0 || f.indexOf("objet") >= 0) {
      var entetes = l[0].map(function (x) { return String(x).trim(); });
      var corps = l.slice(1).map(function (x) {
        var o = {};
        entetes.forEach(function (h, i) { if (h) o[h] = cellule(x[i]); });
        return o;
      });
      if (f.indexOf("liste") < 0) return { valeur: corps[0] || {}, note: "en-têtes : " + entetes.join(", ") };
      return { valeur: corps, note: corps.length + " ligne(s) · colonnes : " + entetes.filter(Boolean).join(", ") };
    }
    /* liste simple */
    return { valeur: corpsListe.map(function (x) { return String(x[0]).trim(); }).filter(Boolean),
      note: mention };
  }

  function lireFichier(fichier, format) {
    var nom = fichier.name.toLowerCase();
    var lecture;
    if (/\.csv$|\.txt$/.test(nom)) lecture = fichier.text().then(lireCsv);
    else if (/\.xlsx$|\.xlsm$/.test(nom)) lecture = fichier.arrayBuffer().then(lireXlsx);
    else if (/\.docx$/.test(nom)) lecture = fichier.arrayBuffer().then(lireDocx);
    else if (/\.pdf$/.test(nom)) lecture = fichier.arrayBuffer().then(lirePdf);
    else return Promise.reject(new Error("format non reconnu — déposez un .xlsx, un .csv, un .docx ou un .pdf"));
    return lecture.then(function (lignes) { return versValeur(lignes, format); });
  }

  /* --------------------------------------------------------- le formulaire */
  function options(select, liste, vide) {
    liste.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v === vide ? "" : v;
      o.textContent = v === vide ? "— non renseigné —" : v;
      select.appendChild(o);
    });
  }

  /* Les familles qui désignent un tableau — « pieces » et ses colonnes — sont
     regroupées en un éditeur de lignes. Les composer champ par champ produisait
     un objet unique là où le moteur attend un tableau : les huit cases se
     réunissaient en une pièce imaginaire, et le contrôle des pièces échouait. */
  var LISTES = M.listes || [];
  /* Les champs qui portent un tableau d'objets et dont les colonnes ont pu être
     établies : ils reçoivent le même éditeur de lignes que « pieces », au lieu
     d'une zone de texte réclamant du JSON. */
  var COLONNES = M.colonnes || {};
  /* Une réponse « oui » qui appelle une pièce : le document est demandé à la
     suite de la réponse, et la ligne correspondante est ajoutée au tableau des
     pièces. Sans cela l'utilisateur répond « oui » et rien ne lui dit qu'un
     titre est attendu — c'est exactement ce que le contrôle lui reprochera. */
  var APPELEES = M.piecesAppelees || {};
  var TABLEAUX = LISTES.concat(Object.keys(COLONNES));
  var estColonne = function (cle) {
    return LISTES.some(function (f) { return cle.indexOf(f + ".") === 0; });
  };

  M.champs.forEach(function (rub) {
    var fs = document.createElement("fieldset");
    var lg = document.createElement("legend"); lg.textContent = rub[0]; fs.appendChild(lg);
    var g = document.createElement("div"); g.className = "grille";
    var faits = {};
    rub[1].forEach(function (ch) {
      var cle = ch[0], libelle = ch[1], format = ch[2], t = typeDe(format);
      /* un champ dont les colonnes sont connues : un éditeur de lignes */
      if (COLONNES[cle]) {
        g.appendChild(tableau(cle, COLONNES[cle].map(function (c) {
          return [cle + "." + c[0], c[0], c[1]]; }), libelle));
        return;
      }
      /* une colonne de tableau : l'éditeur est produit une fois pour la famille */
      if (estColonne(cle)) {
        var fam = cle.split(".")[0];
        if (faits[fam]) return;
        faits[fam] = true;
        g.appendChild(tableau(fam, rub[1].filter(function (x) {
          return x[0].indexOf(fam + ".") === 0; })));
        return;
      }
      var p = PROP[cle];
      var lab = document.createElement("label");
      lab.innerHTML = '<span class="nom">' + ech(libelle) +
        ' <span class="cle">' + ech(cle) + "</span></span>";
      var e;

      /* Une question à choix multiple : des cases, et non un tableau JSON à
         composer. C'est le cas des pièces versées et des consultations. */
      if (p && p.multiple) {
        var boite = document.createElement("div"); boite.className = "cases";
        var offertes = (p.valeurs || []).concat(p.autres || []);
        offertes.forEach(function (v) {
          var id = "c-" + cle + "-" + v.replace(/[^a-zA-Z0-9]+/g, "_");
          var l2 = document.createElement("label"); l2.className = "case";
          var cb = document.createElement("input");
          cb.type = "checkbox"; cb.value = v; cb.id = id;
          cb.setAttribute("data-champ", cle);
          l2.appendChild(cb);
          l2.appendChild(document.createTextNode(" " + v));
          boite.appendChild(l2);
        });
        e = document.createElement("input");
        e.type = "text"; e.className = "libre";
        e.placeholder = p.libre ? "autre(s), séparé(s) par des virgules" : "";
        if (!p.libre) e.style.display = "none";
        e.setAttribute("data-multiple", "1");
        lab.appendChild(boite);
        lab.appendChild(e);
        if (p.aide) lab.appendChild(aide(p.aide));
        e.name = cle; e.id = "c-" + cle;
        g.appendChild(lab);
        return;
      }

      /* Une question à valeurs connues : un menu, et « autre » à la fin lorsque
         la base accepte autre chose. */
      if (p && !p.multiple) {
        var offre = (p.valeurs || []).concat(p.autres || []);
        var sel = document.createElement("select");
        sel.id = "s-" + cle;
        var o0 = document.createElement("option");
        o0.value = ""; o0.textContent = "— non renseigné —"; sel.appendChild(o0);
        offre.forEach(function (v) {
          var o = document.createElement("option");
          o.value = v;
          o.textContent = (p.etiquettes && p.etiquettes[v]) || v;
          sel.appendChild(o);
        });
        if (p.libre) {
          var oa = document.createElement("option");
          oa.value = AUTRE; oa.textContent = AUTRE; sel.appendChild(oa);
        }
        e = document.createElement("input");
        e.type = "text"; e.className = "libre"; e.placeholder = "précisez";
        e.style.display = "none";
        sel.addEventListener("change", function () {
          var libre = sel.value === AUTRE;
          e.style.display = libre ? "" : "none";
          if (!libre) e.value = "";
          compter();
        });
        lab.appendChild(sel); lab.appendChild(e);
        if (p.aide) lab.appendChild(aide(p.aide));
        e.name = cle; e.id = "c-" + cle;
        g.appendChild(lab);
        return;
      }

      if (t === "oui-non" || t === "cause") {
        e = document.createElement("select");
        options(e, ["", "oui", "non"], "");
        if (APPELEES[cle]) e.addEventListener("change", function () { majAppel(cle); });
      } else if (t === "json") {
        e = document.createElement("textarea");
        /* Une liste se tape une par ligne. Le format JSON était la seule entrée
           possible, et il tenait lieu de barrière : personne ne compose des
           accolades sur un téléphone. Il reste accepté — un tableau collé depuis
           ailleurs doit continuer de fonctionner — mais il n'est plus demandé. */
        e.placeholder = "une par ligne\nou joignez un fichier ci-dessus";
        e.rows = 3;
      } else {
        e = document.createElement("input");
        e.type = t === "date" ? "date" : (t === "nombre" ? "number" : "text");
        if (t === "nombre") e.step = "any";
        e.placeholder = format;
      }
      e.name = cle; e.id = "c-" + cle;
      /* Le dépôt est offert avant la saisie, non après : placé en dessous, il
         passait sous la barre d'actions collée en bas de l'écran, et l'on
         croyait devoir tout taper à la main. */
      if (t === "json") lab.appendChild(depot(cle, format));
      lab.appendChild(e);
      /* Une question qui demande un document se répond en joignant le document,
         non en tapant son nom. Le fichier ne quitte pas le poste : la base ne
         lit pas son contenu, elle enregistre qu'il a été produit et sous quel
         nom — ce que la question demandait déjà, en plus sûr. */
      if (/fichier/.test(String(format).toLowerCase())) lab.appendChild(piece(cle));
      if (APPELEES[cle]) lab.appendChild(appel(cle, APPELEES[cle]));
      g.appendChild(lab);
    });
    fs.appendChild(g); form.appendChild(fs);
  });

  /* Un éditeur de tableau : une ligne par entrée, les colonnes étant les
     sous-champs déclarés par le questionnaire. Rien n'est inventé ici — ni les
     colonnes, ni les valeurs proposées dans chacune. */
  function tableau(fam, colonnes, libelle) {
    var enveloppe = document.createElement("div");
    enveloppe.className = "tableau-champ";
    enveloppe.setAttribute("data-liste", fam);
    var titre = document.createElement("p");
    titre.className = "nom";
    titre.innerHTML = (libelle ? ech(libelle) + " — une ligne par entrée" : "Une ligne par entrée") +
      ' <span class="cle">' + ech(fam) + "</span>";
    enveloppe.appendChild(titre);

    var tab = document.createElement("table"); tab.className = "saisie";
    var thead = document.createElement("tr");
    colonnes.forEach(function (c) {
      var th = document.createElement("th");
      /* Le nom de la colonne est ce qui suit la famille — et la famille peut
         elle-même être composée : « plan.mesures.rubrique » donne « rubrique »,
         non « mesures ». Pris au deuxième segment, toutes les colonnes d'un
         tableau composé portaient le même nom, et la saisie se perdait. */
      th.textContent = c[0].split(".").pop();
      th.title = c[1];
      thead.appendChild(th);
    });
    thead.appendChild(document.createElement("th"));
    tab.appendChild(thead);
    enveloppe.appendChild(tab);

    function ligne(valeurs) {
      var tr = document.createElement("tr");
      colonnes.forEach(function (c) {
        var sous = c[0].split(".").pop(), p = PROP[c[0]], td = document.createElement("td"), e;
        if (p) {
          e = document.createElement("select");
          var o0 = document.createElement("option"); o0.value = ""; o0.textContent = "—";
          e.appendChild(o0);
          (p.valeurs || []).concat(p.autres || []).forEach(function (v) {
            var o = document.createElement("option"); o.value = v; o.textContent = v; e.appendChild(o);
          });
        } else if (typeDe(c[2]) === "oui-non") {
          e = document.createElement("select");
          ["", "oui", "non"].forEach(function (v) {
            var o = document.createElement("option"); o.value = v; o.textContent = v || "—"; e.appendChild(o);
          });
        } else {
          e = document.createElement("input");
          e.type = typeDe(c[2]) === "date" ? "date" : "text";
          e.placeholder = sous;
        }
        e.setAttribute("data-sous", sous);
        e.setAttribute("data-format", c[2] || "");
        if (valeurs && valeurs[sous] !== undefined && valeurs[sous] !== null)
          e.value = typeof valeurs[sous] === "boolean"
            ? (valeurs[sous] ? "oui" : "non") : String(valeurs[sous]);
        td.appendChild(e); tr.appendChild(td);
      });
      var td2 = document.createElement("td");
      var sup = document.createElement("button");
      sup.type = "button"; sup.className = "fichier retirer"; sup.textContent = "\u00d7";
      sup.title = "retirer cette ligne";
      sup.addEventListener("click", function () {
        memoriser("le retrait d'une ligne de « " + fam + " »");
        tr.remove(); compter(); });
      td2.appendChild(sup); tr.appendChild(td2);
      tab.appendChild(tr);
      return tr;
    }
    enveloppe.ligne = ligne;
    ligne(null);

    var barre = document.createElement("div"); barre.className = "depot";
    var plus = document.createElement("button");
    plus.type = "button"; plus.className = "fichier";
    plus.textContent = "+ Ajouter une ligne";
    plus.addEventListener("click", function () { ligne(null); compter(); });
    barre.appendChild(plus);
    var b = document.createElement("button");
    b.type = "button"; b.className = "fichier"; b.textContent = "Joindre un fichier (Excel, Word, PDF, CSV)";
    var i = document.createElement("input");
    i.type = "file"; i.accept = ".xlsx,.xlsm,.csv,.txt,.docx,.pdf"; i.style.display = "none";
    var etat = document.createElement("span"); etat.className = "etat-depot";
    b.addEventListener("click", function () { i.click(); });
    i.addEventListener("change", function () {
      var fich = i.files && i.files[0];
      if (!fich) return;
      etat.className = "etat-depot"; etat.textContent = "lecture\u2026";
      memoriser("l'import de « " + fich.name + " »");
      lireFichier(fich, "liste d'objets").then(function (r) {
        Array.prototype.slice.call(tab.querySelectorAll("tr")).slice(1)
          .forEach(function (tr) { tr.remove(); });
        var noms = colonnes.map(function (c) { return c[0].split(".")[1]; });
        (r.valeur || []).forEach(function (o) {
          var v = {};
          Object.keys(o).forEach(function (k) {
            var n = noms.filter(function (x) { return x.toLowerCase() === String(k).trim().toLowerCase(); })[0];
            if (n) v[n] = o[k];
          });
          ligne(v);
        });
        if (!tab.querySelectorAll("tr")[1]) ligne(null);
        etat.className = "etat-depot ok";
        etat.textContent = fich.name + " \u2014 " + (r.valeur || []).length +
          " ligne(s) reprise(s). Colonnes reconnues : " + noms.join(", ") + ". Relisez avant de lancer l'audit.";
        compter();
      }).catch(function (err) {
        etat.className = "etat-depot ko";
        etat.textContent = fich.name + " \u2014 " + err.message;
      });
      i.value = "";
    });
    barre.appendChild(b); barre.appendChild(i); barre.appendChild(etat);
    enveloppe.appendChild(barre);
    return enveloppe;
  }

  /* Ce qu'un éditeur de tableau contient : les lignes dont au moins une cellule
     est renseignée. Une ligne vide n'est pas une entrée. */
  function valeurTableau(fam) {
    var env = document.querySelector('[data-liste="' + fam + '"]');
    if (!env) return null;
    var trs = Array.prototype.slice.call(env.querySelectorAll("tr")).slice(1), out = [];
    trs.forEach(function (tr) {
      var o = {}, rempli = false;
      Array.prototype.forEach.call(tr.querySelectorAll("[data-sous]"), function (e) {
        var v = e.value.trim();
        if (v === "") return;
        rempli = true;
        /* La colonne dit ce qu'elle attend : « 2026 » reste une période écrite,
           il n'y a aucune raison d'en faire un nombre parce qu'elle en a l'air. */
        var t = typeDe(e.getAttribute("data-format") || "");
        o[e.getAttribute("data-sous")] = v === "oui" ? true : (v === "non" ? false
          : (t === "nombre" ? cellule(v) : v));
      });
      if (rempli) out.push(o);
    });
    return out.length ? out : null;
  }

  /* Joindre un document à une question qui en demande un. */
  function piece(cle) {
    var d = document.createElement("div"); d.className = "depot";
    var b = document.createElement("button");
    b.type = "button"; b.className = "fichier"; b.textContent = "Joindre le document";
    var i = document.createElement("input");
    i.type = "file"; i.style.display = "none";
    var etat = document.createElement("span"); etat.className = "etat-depot";
    b.addEventListener("click", function () { i.click(); });
    i.addEventListener("change", function () {
      var f = i.files && i.files[0];
      if (!f) { i.value = ""; return; }
      var champ = document.getElementById("c-" + cle);
      champ.value = f.name;
      etat.className = "etat-depot ok";
      etat.textContent = "joint : " + f.name + " (" + Math.round(f.size / 1024) +
        " Ko). Le document reste sur cet appareil ; la base enregistre qu'il est produit, elle n'en lit pas le contenu.";
      i.value = "";
      compter();
    });
    d.appendChild(b); d.appendChild(i); d.appendChild(etat);
    return d;
  }

  /* Le document qu'une réponse « oui » appelle. Caché tant que la réponse ne
     l'est pas ; joint, il ajoute la pièce au tableau des pièces, là où le
     contrôle ira la chercher. */
  function appel(cle, code) {
    var d = document.createElement("div");
    d.className = "depot appel"; d.id = "appel-" + cle; d.style.display = "none";
    var t = document.createElement("p"); t.className = "aide-champ";
    t.textContent = "Cette réponse appelle un document : sans lui, l'audit ne peut pas conclure — une déclaration que rien ne justifie ne vaut pas conformité.";
    var b = document.createElement("button");
    b.type = "button"; b.className = "fichier"; b.textContent = "Joindre l'accord (Excel, Word, PDF…)";
    var i = document.createElement("input"); i.type = "file"; i.style.display = "none";
    var etat = document.createElement("span"); etat.className = "etat-depot";
    b.addEventListener("click", function () { i.click(); });
    i.addEventListener("change", function () {
      var f = i.files && i.files[0];
      if (!f) { i.value = ""; return; }
      var ok = ajouterPiece(code, f.name);
      etat.className = "etat-depot " + (ok ? "ok" : "ko");
      etat.textContent = ok
        ? "joint : " + f.name + " — ajouté au tableau des pièces sous le code « " + code + " ». Complétez sa date et son périmètre."
        : "le tableau des pièces est introuvable sur cette page.";
      i.value = "";
      compter();
    });
    d.appendChild(t); d.appendChild(b); d.appendChild(i); d.appendChild(etat);
    return d;
  }
  function majAppel(cle) {
    var s = document.getElementById("c-" + cle), d = document.getElementById("appel-" + cle);
    if (s && d) d.style.display = s.value === "oui" ? "" : "none";
  }
  /* Ajouter une ligne au tableau des pièces, sans écraser ce qui s'y trouve. */
  function ajouterPiece(code, fichier) {
    var env = document.querySelector('[data-liste="pieces"]');
    if (!env) return false;
    var trs = Array.prototype.slice.call(env.querySelectorAll("tr")).slice(1);
    var vide = trs.filter(function (tr) {
      return Array.prototype.every.call(tr.querySelectorAll("[data-sous]"),
        function (e) { return e.value.trim() === ""; }); })[0];
    var tr = vide || env.ligne(null);
    Array.prototype.forEach.call(tr.querySelectorAll("[data-sous]"), function (e) {
      var n = e.getAttribute("data-sous");
      if (n === "code") e.value = code;
      if (n === "fichier") e.value = fichier;
      if (n === "lue") e.value = "oui";
    });
    return true;
  }

  function aide(texte) {
    var p = document.createElement("p"); p.className = "aide-champ";
    p.textContent = texte; return p;
  }

  function depot(cle, format) {
    var d = document.createElement("div"); d.className = "depot";
    var b = document.createElement("button");
    b.type = "button"; b.className = "fichier";
    b.textContent = "Joindre un fichier (Excel, Word, PDF, CSV)";
    var i = document.createElement("input");
    i.type = "file"; i.accept = ".xlsx,.xlsm,.csv,.txt,.docx,.pdf"; i.style.display = "none";
    var etat = document.createElement("span"); etat.className = "etat-depot";
    b.addEventListener("click", function () { i.click(); });
    i.addEventListener("change", function () {
      var f = i.files && i.files[0];
      if (!f) return;
      etat.className = "etat-depot"; etat.textContent = "lecture…";
      memoriser("l'import de « " + f.name + " »");
      lireFichier(f, format).then(function (r) {
        var champ = document.getElementById("c-" + cle);
        champ.value = Array.isArray(r.valeur)
            && r.valeur.every(function (x) { return x === null || typeof x !== "object"; })
          ? r.valeur.join("\n")
          : JSON.stringify(r.valeur, null, 1);
        etat.className = "etat-depot ok";
        etat.textContent = f.name + " — " + r.note + ". Relisez le résultat avant de lancer l'audit.";
        compter();
      }).catch(function (err) {
        etat.className = "etat-depot ko";
        etat.textContent = f.name + " — " + err.message;
      });
      i.value = "";
    });
    d.appendChild(b); d.appendChild(i); d.appendChild(etat);
    return d;
  }

  /* ------------------------------------------------------------- la fiche */
  function valeurDe(cle) {
    var e = document.getElementById("c-" + cle);
    var p = PROP[cle];
    if (p && p.multiple) {
      var l = Array.prototype.filter.call(
        document.querySelectorAll('[data-champ="' + cle + '"]'),
        function (x) { return x.checked; }).map(function (x) { return x.value; });
      var libre = e && e.value.trim();
      if (libre) libre.split(",").forEach(function (x) { if (x.trim()) l.push(x.trim()); });
      /* Une case décochée n'est pas un néant : le champ n'est renseigné que si
         l'utilisateur a coché ou écrit quelque chose. */
      return l.length ? l : null;
    }
    if (p && !p.multiple) {
      var s = document.getElementById("s-" + cle);
      if (!s) return null;
      if (s.value === AUTRE) return (e && e.value.trim()) || null;
      return s.value || null;
    }
    return e ? e.value.trim() : "";
  }

  function fiche() {
    var f = {}, mauvais = [];
    /* Les familles-tableaux sont lues d'un bloc, non colonne par colonne. */
    TABLEAUX.forEach(function (fam) {
      var v = valeurTableau(fam);
      /* Un tableau peut porter un nom composé — « plan.mesures » : il se range
         sous son objet, comme n'importe quel champ composé. Écrit à plat, il
         créait une clé « plan.mesures » que le moteur ne lit jamais, et sept
         mesures saisies passaient pour un plan vide. */
      if (v) poser(f, fam, v);
    });
    M.champs.forEach(function (rub) {
      rub[1].forEach(function (ch) {
        var cle = ch[0], t = typeDe(ch[2]), p = PROP[cle];
        if (estColonne(cle)) return;
        var v = valeurDe(cle);
        if (v === null || v === "" || v === undefined) return;   /* vide = silence, non néant */
        if (p) { poser(f, cle, p.objet && p.multiple
          ? v.map(function (x) { var o = {}; o[p.objet] = x; return o; }) : v); return; }
        if (t === "oui-non") { poser(f, cle, v === "oui"); return; }
        if (t === "nombre") {
          var n = Number(String(v).replace(/\s/g, "").replace(",", "."));
          poser(f, cle, isNaN(n) ? v : (/chiffres/.test(ch[2]) ? v : n));
          return;
        }
        if (t === "json") {
          var brut = String(v).trim();
          /* Du JSON si c'en est ; sinon une ligne par élément. */
          if (brut[0] === "[" || brut[0] === "{") {
            try { poser(f, cle, JSON.parse(brut)); }
            catch (err) { mauvais.push(cle); }
            return;
          }
          var elements = brut.split("\n").map(function (x) { return x.trim(); })
            .filter(function (x) { return x !== ""; });
          if (!elements.length) return;
          var nombres = /nombre/.test(String(ch[2]).toLowerCase());
          poser(f, cle, elements.map(function (x) {
            return nombres ? cellule(x) : (x === "oui" ? true : (x === "non" ? false : x)); }));
          return;
        }
        poser(f, cle, v);
      });
    });
    return { f: f, mauvais: mauvais };
  }
  /* « pse.voie » désigne un sous-champ : la fiche le reconstitue en objet. */
  function poser(o, cle, val) {
    var p = cle.split(".");
    if (p.length === 1) { o[cle] = val; return; }
    o[p[0]] = o[p[0]] || {};
    o[p[0]][p[1]] = val;
  }

  /* ------------------------------------------------------------ restitution */
  var REND = {
    sur: function (i) { return '<p class="note">' + ech(i.t) + "</p>"; },
    t1: function (i) { return "<h2>" + ech(i.t) + "</h2>"; },
    trait: function () { return "<hr>"; },
    h1: function (i) { return "<h2>" + ech(i.t) + "</h2>"; },
    h2: function (i) { return "<h3>" + ech(i.t) + "</h3>"; },
    h3: function (i) { return "<h3>" + ech(i.t) + "</h3>"; },
    p: function (i) { return "<p>" + ech(i.t) + "</p>"; },
    note: function (i) { return '<p class="note">' + ech(i.t) + "</p>"; },
    puce: function (i) { return '<p class="puce">— ' + ech(i.t) + "</p>"; },
    saut: function () { return ""; },
    enc: function (i) {
      return '<div class="enc"><p class="sh">' + ech(i.titre) + '</p><p style="margin:0">' + ech(i.t) + "</p></div>";
    },
    bandeau: function (i) {
      return '<div class="bandeau b-' + ech(i.couleur) + '"><p class="r">' + ech(i.t) +
        '</p><p class="s">' + ech(i.sous) + "</p></div>";
    },
    etape: function (i) {
      return '<p class="etape">' + ech(i.t) + "<span>" + ech(i.compte || "") + "</span></p>";
    },
    acte: function (i) {
      return '<div class="acte a-' + ech(i.priorite) + '"><p class="t">' + ech(i.n) + ". " + ech(i.t) +
        '<span class="chip c-' + ech(i.priorite) + '">' + ech(i.priorite) + '</span></p><p class="w">' +
        (i.etat ? "<b>" + ech(i.etat) + "</b> — " : "") + ech(i.pourquoi) + " · " + ech(i.id) + "</p></div>";
    },
    interdit: function (i) {
      return '<div class="interdit i-' + ech(i.ton || "certain") + '"><p class="t">' + ech(i.t) +
        '</p><p class="w">' + ech(i.pourquoi) + " · " + ech(i.id) + "</p></div>";
    },
    acquis: function (i) {
      return '<p class="acquis"><b>&#10003;</b> ' + ech(i.t) +
        ' <span class="note">— ' + ech(i.base) + "</span></p>";
    },
    table: function (i) {
      return '<div class="tab"><table><tr>' + i.head.map(function (h) { return "<th>" + ech(h) + "</th>"; }).join("") +
        "</tr>" + i.rows.map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + ech(c) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</table></div>";
    },
  };

  /* ------------------------------------------------------------ revenir en arrière

     Un formulaire long sans retour en arrière est une menace permanente : une
     fausse manœuvre efface une demi-heure de saisie et rien ne la rend. La pile
     ci-dessous garde l'état complet avant chaque geste qui détruit ou remplace
     — tout effacer, charger l'exemple, importer un fichier, retirer une ligne —
     et la frappe est enregistrée par paliers, pour que « revenir en arrière »
     ne défasse pas une lettre à la fois.

     L'état est celui des champs, non la fiche produite : c'est ce que
     l'utilisateur voit, donc ce qu'il s'attend à retrouver. */
  var PILE = [], PROFONDEUR = 40, minuteur = null;

  function instantane() {
    var v = {};
    Array.prototype.forEach.call(form.querySelectorAll("input,select,textarea"), function (e, i) {
      if (e.type === "file") return;          /* un champ de fichier ne se restaure pas */
      /* Les cellules d'un éditeur de tableau sont relevées avec leurs lignes,
         plus bas : les compter deux fois, par un index qui bouge dès qu'une
         ligne est ajoutée ou retirée, écrasait la restauration. */
      if (e.closest("[data-liste]")) return;
      var cle = e.id || (e.name || "") + "#" + i;
      v[cle] = e.type === "checkbox" ? e.checked : e.value;
    });
    var t = {};
    TABLEAUX.forEach(function (fam) {
      var env = document.querySelector('[data-liste="' + fam + '"]');
      if (!env) return;
      t[fam] = Array.prototype.slice.call(env.querySelectorAll("tr")).slice(1).map(function (tr) {
        var o = {};
        Array.prototype.forEach.call(tr.querySelectorAll("[data-sous]"), function (e) {
          o[e.getAttribute("data-sous")] = e.value; });
        return o;
      });
    });
    var a = {};
    Object.keys(APPELEES).forEach(function (c) {
      var d = document.getElementById("appel-" + c);
      if (d) a[c] = d.style.display;
    });
    return { v: v, t: t, a: a };
  }

  function restaurer(e) {
    Array.prototype.forEach.call(form.querySelectorAll("input,select,textarea"), function (el, i) {
      if (el.type === "file" || el.closest("[data-liste]")) return;
      var cle = el.id || (el.name || "") + "#" + i;
      if (!(cle in e.v)) return;
      if (el.type === "checkbox") el.checked = e.v[cle]; else el.value = e.v[cle];
    });
    Object.keys(e.t).forEach(function (fam) {
      var env = document.querySelector('[data-liste="' + fam + '"]');
      if (!env) return;
      Array.prototype.slice.call(env.querySelectorAll("tr")).slice(1)
        .forEach(function (tr) { tr.remove(); });
      e.t[fam].forEach(function (o) { env.ligne(o); });
      if (!env.querySelectorAll("tr")[1]) env.ligne(null);
    });
    Object.keys(e.a || {}).forEach(function (c) {
      var d = document.getElementById("appel-" + c);
      if (d) d.style.display = e.a[c];
    });
    compter();
  }

  function memoriser(quoi) {
    PILE.push({ e: instantane(), quoi: quoi });
    if (PILE.length > PROFONDEUR) PILE.shift();
    majAnnuler();
  }
  /* La frappe : un palier par pause, non par caractère. */
  function memoriserFrappe() {
    if (minuteur) clearTimeout(minuteur);
    var avant = instantane();
    minuteur = setTimeout(function () {
      PILE.push({ e: avant, quoi: "la dernière saisie" });
      if (PILE.length > PROFONDEUR) PILE.shift();
      majAnnuler();
    }, 1200);
  }
  function majAnnuler() {
    var b = document.getElementById("annuler");
    if (!b) return;
    b.disabled = !PILE.length;
    /* « Revenir en arrière » se confondait avec le retour de navigation : on
       croyait quitter la page, alors que ce bouton défait la dernière saisie.
       Deux gestes différents ne peuvent pas porter le même nom. */
    b.textContent = PILE.length ? "Annuler la dernière saisie (" + PILE.length + ")" : "Annuler la dernière saisie";
    b.title = PILE.length ? "Annule : " + PILE[PILE.length - 1].quoi : "Rien à annuler";
  }
  function annuler() {
    if (!PILE.length) return;
    var d = PILE.pop();
    restaurer(d.e);
    majAnnuler();
    signaler("Revenu en arrière — " + d.quoi + " a été annulé.");
  }
  function signaler(texte) {
    var z = document.getElementById("message");
    if (!z) return;
    z.textContent = texte; z.style.display = "";
    clearTimeout(signaler._t);
    signaler._t = setTimeout(function () { z.style.display = "none"; }, 6000);
  }

  function lancer() {
    var r = fiche();
    if (r.mauvais.length) {
      sortie.innerHTML = '<div class="erreur">Ces champs commencent par une accolade ou un crochet, et le JSON n\'a pas pu être lu : ' +
        ech(r.mauvais.join(", ")) + ". Écrivez plutôt un élément par ligne, joignez un fichier, ou laissez-les vides.</div>";
      sortie.scrollIntoView({ behavior: "smooth" });
      return;
    }
    /* Un dossier vide ne produit pas un rapport : il produit une invitation à
       le remplir. Auditer le néant donnait une page entière de tableaux et un
       compte de « non conforme : 0 » qui se lisait comme un satisfecit. */
    if (!Object.keys(r.f).length) {
      sortie.innerHTML = '<div class="erreur">Vous n\'avez renseigné aucune donnée : ' +
        "il n'y a rien à auditer. Décrivez la situation — même partiellement — puis relancez. " +
        'Le bouton « Charger un dossier d\'exemple » montre ce que l\'outil produit.</div>';
      sortie.scrollIntoView({ behavior: "smooth" });
      return;
    }
    var items;
    try { items = M.audit(r.f); }
    catch (e) {
      sortie.innerHTML = '<div class="erreur">L\'audit n\'a pas pu être produit : ' + ech(e.message) +
        ". Rien n'a été perdu — corrigez la saisie et relancez.</div>";
      return;
    }
    items = items.concat(PIED_RAPPORT);
    DERNIER = items;
    sortie.innerHTML = '<div class="retour">' +
      '<button type="button" id="revenir">\u2190 Revenir au formulaire</button>' +
      '<button type="button" class="second" id="word">Télécharger en Word</button>' +
      '<button type="button" class="second" id="pdf">Imprimer / enregistrer en PDF</button>' +
      "</div>" +
      items.map(function (i) { return REND[i.k] ? REND[i.k](i) : ""; }).join("");
    document.getElementById("revenir").addEventListener("click", revenir);
    document.getElementById("word").addEventListener("click", enWord);
    document.getElementById("pdf").addEventListener("click", function () { window.print(); });
    try { localStorage.setItem(CLE, JSON.stringify(r.f)); } catch (e) {}
    /* Le bouton « précédent » du téléphone ramène au formulaire au lieu de
       quitter la page : c'est le geste que tout le monde fait d'abord. */
    try { history.pushState({ audit: true }, "", "#resultat"); } catch (e) {}
    sortie.scrollIntoView({ behavior: "smooth" });
    compter();
  }

  var DERNIER = null;
  function revenir() {
    if (location.hash === "#resultat") { history.back(); return; }
    montrerFormulaire();
  }
  function montrerFormulaire() {
    sortie.innerHTML = "";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  window.addEventListener("popstate", function () {
    if (sortie.innerHTML) montrerFormulaire();
  });

  function enWord() {
    if (!DERNIER || !global_export()) return;
    var titre = (document.querySelector("h1") || {}).textContent || "Audit";
    /* Le nom du fichier est ramené à l'ASCII : les accents font perdre le nom
       proposé au téléchargement — le fichier arrive alors appelé « download ».
       Mesuré, non supposé : « essai.docx » passe, « Audit-économique.docx » non. */
    var nom = titre.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "Audit";
    try {
      var d = window.AuditExport.docx(DERNIER, titre);
      window.AuditExport.telecharger(d, nom + ".docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      signaler("Document Word téléchargé. Ouvrez-le pour vérifier la mise en page.");
    } catch (e) {
      signaler("Le document Word n'a pas pu être produit : " + e.message);
    }
  }
  function global_export() {
    if (window.AuditExport) return true;
    signaler("Le module d'export n'est pas chargé.");
    return false;
  }

  function compter() {
    var n = 0, familles = {};
    M.champs.forEach(function (rub) {
      rub[1].forEach(function (ch) {
        if (estColonne(ch[0])) { familles[ch[0].split(".")[0]] = true; return; }
        if (COLONNES[ch[0]]) { familles[ch[0]] = true; return; }
        var v = valeurDe(ch[0]);
        if (v !== null && v !== "" && v !== undefined) n++;
      });
    });
    Object.keys(familles).forEach(function (fam) { if (valeurTableau(fam)) n++; });
    /* Une famille-tableau compte pour une donnée, non pour ses colonnes. */
    var total = M.champs.reduce(function (s, r) {
      return s + r[1].filter(function (x) {
        return !estColonne(x[0]) && !COLONNES[x[0]]; }).length; }, 0)
      + Object.keys(familles).length;
    document.getElementById("compteur").textContent = n + " donnée(s) renseignée(s) sur " + total;
  }

  /* --------------------------------------------------- remplir et effacer */
  function ecrire(cle, v) {
    var p = PROP[cle], e = document.getElementById("c-" + cle);
    /* Une famille-tableau se remplit ligne à ligne. */
    if (TABLEAUX.indexOf(cle) >= 0) {
      if (typeof v === "string") { try { v = JSON.parse(v); } catch (err) { return; } }
      var env = document.querySelector('[data-liste="' + cle + '"]');
      if (!env || !Array.isArray(v)) return;
      Array.prototype.slice.call(env.querySelectorAll("tr")).slice(1)
        .forEach(function (tr) { tr.remove(); });
      v.forEach(function (o) { env.ligne(typeof o === "string" ? { code: o } : o); });
      if (!env.querySelectorAll("tr")[1]) env.ligne(null);
      return;
    }
    /* Le dossier d'exemple écrit certaines valeurs telles qu'on les taperait,
       c'est-à-dire en JSON. Les cases à cocher attendent la liste elle-même :
       on la lit si c'en est une, sans quoi la valeur passe telle quelle. */
    if (p && p.multiple && typeof v === "string") {
      try { var l = JSON.parse(v); if (Array.isArray(l)) v = l; } catch (err) {}
    }
    if (p && p.multiple) {
      var l = Array.isArray(v) ? v.map(function (x) {
        return p.objet && x && typeof x === "object" ? x[p.objet] : x; }) : [];
      var reste = [];
      l.forEach(function (x) {
        var cb = Array.prototype.filter.call(
          document.querySelectorAll('[data-champ="' + cle + '"]'),
          function (c) { return c.value === x; })[0];
        if (cb) cb.checked = true; else reste.push(x);
      });
      if (e) e.value = reste.join(", ");
      return;
    }
    if (p) {
      var s = document.getElementById("s-" + cle);
      if (!s) return;
      var offre = (p.valeurs || []).concat(p.autres || []);
      if (offre.indexOf(v) >= 0) { s.value = v; if (e) { e.value = ""; e.style.display = "none"; } }
      else if (v !== "" && v != null && p.libre) { s.value = AUTRE; if (e) { e.value = v; e.style.display = ""; } }
      return;
    }
    if (!e) return;
    if (Array.isArray(v) && v.every(function (x) { return x === null || typeof x !== "object"; })) {
      e.value = v.join("\n");                       /* une par ligne, comme à la saisie */
      return;
    }
    e.value = typeof v === "boolean" ? (v ? "oui" : "non")
      : (v && typeof v === "object" ? JSON.stringify(v, null, 1) : String(v));
  }

  document.getElementById("lancer").addEventListener("click", lancer);
  document.getElementById("imprimer").addEventListener("click", function () { window.print(); });
  var bWord = document.getElementById("mot");
  if (bWord) bWord.addEventListener("click", enWord);
  var bAnnuler = document.getElementById("annuler");
  if (bAnnuler) bAnnuler.addEventListener("click", annuler);
  document.getElementById("exemple").addEventListener("click", function () {
    memoriser("le chargement du dossier d'exemple");
    Object.keys(EXEMPLE).forEach(function (k) { ecrire(k, EXEMPLE[k]); });
    Object.keys(APPELEES).forEach(majAppel);
    compter();
  });
  document.getElementById("vider").addEventListener("click", function () {
    memoriser("l'effacement complet");
    form.reset();
    Array.prototype.forEach.call(document.querySelectorAll('.libre'), function (e) {
      e.value = ""; if (e.getAttribute("data-multiple") !== "1") e.style.display = "none";
    });
    TABLEAUX.forEach(function (fam) {
      var env = document.querySelector('[data-liste="' + fam + '"]');
      if (!env) return;
      Array.prototype.slice.call(env.querySelectorAll("tr")).slice(1)
        .forEach(function (tr) { tr.remove(); });
      env.ligne(null);
    });
    Object.keys(APPELEES).forEach(majAppel);
    sortie.innerHTML = ""; compter();
    try { localStorage.removeItem(CLE); } catch (e) {}
    signaler("Tout a été effacé. « Annuler la dernière saisie » rétablit ce que vous aviez écrit.");
  });
  form.addEventListener("input", function () { memoriserFrappe(); compter(); });
  form.addEventListener("change", compter);
  Object.keys(APPELEES).forEach(majAppel);

  /* Le brouillon reste sur le poste : on ne perd pas une saisie longue. */
  try {
    var b = JSON.parse(localStorage.getItem(CLE) || "null");
    if (b) Object.keys(b).forEach(function (k) { ecrire(k, b[k]); });
  } catch (e) {}
  Object.keys(APPELEES).forEach(majAppel);
  compter();
  majAnnuler();

  var m = M.manifeste || {}, c = m.compteurs || {};
  document.getElementById("pied").innerHTML =
    "Moteur " + ech(m.empreinte || "—") + " · " + ech(c.regles || "—") + " règles, " +
    ech(c.controles || "—") + " contrôles dont " + ech(c.coherence || 0) + " de cohérence et " +
    ech(c.detection || 0) + " de détection · articles relus sur Légifrance le 15 août 2026." +
    " Cet audit est une aide à la préparation du dossier : il ne remplace ni l'analyse d'un conseil," +
    " ni la décision qui vous appartient.";
})();
