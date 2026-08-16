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
    else return Promise.reject(new Error("format non reconnu — déposez un .xlsx, un .csv ou un .docx"));
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
      } else if (t === "json") {
        e = document.createElement("textarea");
        e.placeholder = format + " — au format JSON, par exemple [] ou [{…}]";
      } else {
        e = document.createElement("input");
        e.type = t === "date" ? "date" : (t === "nombre" ? "number" : "text");
        if (t === "nombre") e.step = "any";
        e.placeholder = format;
      }
      e.name = cle; e.id = "c-" + cle;
      lab.appendChild(e);
      /* Un tableau se dépose au lieu de se retaper. */
      if (t === "json") lab.appendChild(depot(cle, format));
      g.appendChild(lab);
    });
    fs.appendChild(g); form.appendChild(fs);
  });

  /* Un éditeur de tableau : une ligne par entrée, les colonnes étant les
     sous-champs déclarés par le questionnaire. Rien n'est inventé ici — ni les
     colonnes, ni les valeurs proposées dans chacune. */
  function tableau(fam, colonnes) {
    var enveloppe = document.createElement("div");
    enveloppe.className = "tableau-champ";
    enveloppe.setAttribute("data-liste", fam);
    var titre = document.createElement("p");
    titre.className = "nom";
    titre.innerHTML = "Une ligne par entrée <span class=\"cle\">" + ech(fam) + "</span>";
    enveloppe.appendChild(titre);

    var tab = document.createElement("table"); tab.className = "saisie";
    var thead = document.createElement("tr");
    colonnes.forEach(function (c) {
      var th = document.createElement("th");
      th.textContent = c[0].split(".")[1];
      th.title = c[1];
      thead.appendChild(th);
    });
    thead.appendChild(document.createElement("th"));
    tab.appendChild(thead);
    enveloppe.appendChild(tab);

    function ligne(valeurs) {
      var tr = document.createElement("tr");
      colonnes.forEach(function (c) {
        var sous = c[0].split(".")[1], p = PROP[c[0]], td = document.createElement("td"), e;
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
      sup.addEventListener("click", function () { tr.remove(); compter(); });
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
    b.type = "button"; b.className = "fichier"; b.textContent = "Importer un tableau ou un document";
    var i = document.createElement("input");
    i.type = "file"; i.accept = ".xlsx,.xlsm,.csv,.txt,.docx"; i.style.display = "none";
    var etat = document.createElement("span"); etat.className = "etat-depot";
    b.addEventListener("click", function () { i.click(); });
    i.addEventListener("change", function () {
      var fich = i.files && i.files[0];
      if (!fich) return;
      etat.className = "etat-depot"; etat.textContent = "lecture\u2026";
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

  function aide(texte) {
    var p = document.createElement("p"); p.className = "aide-champ";
    p.textContent = texte; return p;
  }

  function depot(cle, format) {
    var d = document.createElement("div"); d.className = "depot";
    var b = document.createElement("button");
    b.type = "button"; b.className = "fichier";
    b.textContent = "Importer un tableau ou un document";
    var i = document.createElement("input");
    i.type = "file"; i.accept = ".xlsx,.xlsm,.csv,.txt,.docx"; i.style.display = "none";
    var etat = document.createElement("span"); etat.className = "etat-depot";
    b.addEventListener("click", function () { i.click(); });
    i.addEventListener("change", function () {
      var f = i.files && i.files[0];
      if (!f) return;
      etat.className = "etat-depot"; etat.textContent = "lecture…";
      lireFichier(f, format).then(function (r) {
        document.getElementById("c-" + cle).value = JSON.stringify(r.valeur, null, 1);
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
    LISTES.forEach(function (fam) {
      var v = valeurTableau(fam);
      if (v) f[fam] = v;
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
          try { poser(f, cle, JSON.parse(v)); }
          catch (err) { mauvais.push(cle); }
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

  function lancer() {
    var r = fiche();
    if (r.mauvais.length) {
      sortie.innerHTML = '<div class="erreur">Ces champs attendent du JSON et n\'ont pas pu être lus : ' +
        ech(r.mauvais.join(", ")) + ". Corrigez-les, importez un tableau, ou laissez-les vides.</div>";
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
    sortie.innerHTML = items.map(function (i) { return REND[i.k] ? REND[i.k](i) : ""; }).join("");
    try { localStorage.setItem(CLE, JSON.stringify(r.f)); } catch (e) {}
    sortie.scrollIntoView({ behavior: "smooth" });
    compter();
  }

  function compter() {
    var n = 0, familles = {};
    M.champs.forEach(function (rub) {
      rub[1].forEach(function (ch) {
        if (estColonne(ch[0])) { familles[ch[0].split(".")[0]] = true; return; }
        var v = valeurDe(ch[0]);
        if (v !== null && v !== "" && v !== undefined) n++;
      });
    });
    Object.keys(familles).forEach(function (fam) { if (valeurTableau(fam)) n++; });
    /* Une famille-tableau compte pour une donnée, non pour ses colonnes. */
    var total = M.champs.reduce(function (s, r) {
      return s + r[1].filter(function (x) { return !estColonne(x[0]); }).length; }, 0)
      + Object.keys(familles).length;
    document.getElementById("compteur").textContent = n + " donnée(s) renseignée(s) sur " + total;
  }

  /* --------------------------------------------------- remplir et effacer */
  function ecrire(cle, v) {
    var p = PROP[cle], e = document.getElementById("c-" + cle);
    /* Une famille-tableau se remplit ligne à ligne. */
    if (LISTES.indexOf(cle) >= 0) {
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
    e.value = typeof v === "boolean" ? (v ? "oui" : "non")
      : (v && typeof v === "object" ? JSON.stringify(v) : String(v));
  }

  document.getElementById("lancer").addEventListener("click", lancer);
  document.getElementById("imprimer").addEventListener("click", function () { window.print(); });
  document.getElementById("exemple").addEventListener("click", function () {
    Object.keys(EXEMPLE).forEach(function (k) { ecrire(k, EXEMPLE[k]); });
    compter();
  });
  document.getElementById("vider").addEventListener("click", function () {
    form.reset();
    Array.prototype.forEach.call(document.querySelectorAll('.libre'), function (e) {
      e.value = ""; if (e.getAttribute("data-multiple") !== "1") e.style.display = "none";
    });
    sortie.innerHTML = ""; compter();
    try { localStorage.removeItem(CLE); } catch (e) {}
  });
  form.addEventListener("input", compter);
  form.addEventListener("change", compter);

  /* Le brouillon reste sur le poste : on ne perd pas une saisie longue. */
  try {
    var b = JSON.parse(localStorage.getItem(CLE) || "null");
    if (b) Object.keys(b).forEach(function (k) { ecrire(k, b[k]); });
  } catch (e) {}
  compter();

  var m = M.manifeste || {}, c = m.compteurs || {};
  document.getElementById("pied").innerHTML =
    "Moteur " + ech(m.empreinte || "—") + " · " + ech(c.regles || "—") + " règles, " +
    ech(c.controles || "—") + " contrôles dont " + ech(c.coherence || 0) + " de cohérence et " +
    ech(c.detection || 0) + " de détection · articles relus sur Légifrance le 15 août 2026." +
    " Cet audit est une aide à la préparation du dossier : il ne remplace ni l'analyse d'un conseil," +
    " ni la décision qui vous appartient.";
})();
