/* LIRE UN TABLEAU DÉPOSÉ, QUEL QUE SOIT SON FORMAT.

   POURQUOI CE FICHIER EXISTE

   Demande du 15 septembre 2026 : « dans oui il faut pouvoir insérer un
   registre du personnel ». L'écran ne savait que recevoir du texte collé. Or
   un registre du personnel circule en classeur, en Word ou en PDF, et
   personne n'a envie d'ouvrir son fichier ailleurs pour en recopier le
   contenu à la main.

   CE QU'IL REND

   Un texte tabulé : une ligne par ligne du tableau, les colonnes séparées par
   une tabulation. C'est exactement ce que les écrans attendent déjà d'un
   collage, donc rien d'autre ne change chez eux.

   CE QU'IL SAIT LIRE

   - .csv, .tsv, .txt : rendus tels quels ;
   - .xlsx : la première feuille, chaînes partagées comprises ;
   - .docx : les tableaux du document, cellule par cellule ;
   - .pdf : par lire-pdf.js s'il est chargé, sinon le format est refusé.

   Tout se passe dans le navigateur : aucun fichier ne sort du poste. */

(function (window) {
  "use strict";

  function u16(vue, i) { return vue.getUint16(i, true); }
  function u32(vue, i) { return vue.getUint32(i, true); }

  /* Les entrées d'une archive zip, par leur nom. Le répertoire central est lu
     depuis la fin, comme le veut le format. */
  function entrees(buf) {
    var vue = new DataView(buf), n = buf.byteLength, fin = -1;
    for (var i = n - 22; i >= 0 && i > n - 65558; i--)
      if (u32(vue, i) === 0x06054b50) { fin = i; break; }
    if (fin < 0) throw new Error("Ce fichier n'est pas une archive lisible.");
    var nb = u16(vue, fin + 10), pos = u32(vue, fin + 16);
    var dec = new TextDecoder("utf-8"), out = {};
    for (var k = 0; k < nb; k++) {
      if (u32(vue, pos) !== 0x02014b50) throw new Error("Répertoire de l'archive illisible.");
      var methode = u16(vue, pos + 10), taille = u32(vue, pos + 20);
      var lnom = u16(vue, pos + 28), lextra = u16(vue, pos + 30), lcom = u16(vue, pos + 32);
      var debut = u32(vue, pos + 42);
      var nom = dec.decode(new Uint8Array(buf, pos + 46, lnom));
      var ln = u16(vue, debut + 26), lx = u16(vue, debut + 28);
      out[nom] = { methode: methode, data: new Uint8Array(buf, debut + 30 + ln + lx, taille) };
      pos += 46 + lnom + lextra + lcom;
    }
    return out;
  }

  function inflater(u8) {
    if (typeof DecompressionStream !== "function")
      return Promise.reject(new Error("Ce navigateur ne sait pas décomprimer le fichier. Collez le tableau à la place."));
    var flux = new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Response(flux).arrayBuffer();
  }

  function texteEntree(e) {
    if (!e) return Promise.resolve("");
    if (e.methode === 0) return Promise.resolve(new TextDecoder("utf-8").decode(e.data));
    if (e.methode !== 8) return Promise.reject(new Error("Compression inconnue dans ce fichier."));
    return inflater(e.data).then(function (b) {
      return new TextDecoder("utf-8").decode(new Uint8Array(b));
    });
  }

  var deXml = function (s) {
    return String(s == null ? "" : s)
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&#(\d+);/g, function (_, n) {
        return String.fromCharCode(Number(n)); })
      .replace(/&amp;/g, "&");
  };

  /* ────────────────────────────────────────────────────────────── le .xlsx */
  function colonneDe(ref) {
    var m = String(ref || "").match(/^([A-Z]+)/);
    if (!m) return 0;
    var n = 0, s = m[1];
    for (var i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64);
    return n - 1;
  }
  function chainesPartagees(xml) {
    var out = [];
    (xml.match(/<si[\s>][\s\S]*?<\/si>|<si\/>/g) || []).forEach(function (si) {
      var t = (si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(function (x) {
        return deXml(x.replace(/<[^>]+>/g, ""));
      }).join("");
      out.push(t);
    });
    return out;
  }
  function feuilleEnLignes(xml, partagees) {
    var lignes = [];
    (xml.match(/<row[\s>][\s\S]*?<\/row>|<row[^>]*\/>/g) || []).forEach(function (row) {
      var cells = row.match(/<c[\s>][\s\S]*?<\/c>|<c[^>]*\/>/g) || [];
      var ligne = [];
      cells.forEach(function (c) {
        var ref = (c.match(/r="([A-Z]+\d+)"/) || [])[1];
        var type = (c.match(/t="([^"]+)"/) || [])[1] || "";
        var val = "";
        if (type === "inlineStr") {
          val = (c.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(function (x) {
            return deXml(x.replace(/<[^>]+>/g, "")); }).join("");
        } else {
          var v = (c.match(/<v[^>]*>([\s\S]*?)<\/v>/) || [])[1];
          if (v != null) {
            val = type === "s" ? (partagees[Number(v)] || "") : deXml(v);
            /* Une date d'un classeur arrive en nombre de jours depuis 1900.
               On la rend telle quelle : la deviner ferait entrer une date
               fausse dans un registre. L'écran dira qu'elle est illisible. */
          }
        }
        var j = ref ? colonneDe(ref) : ligne.length;
        while (ligne.length < j) ligne.push("");
        ligne[j] = String(val).replace(/\t/g, " ").trim();
      });
      lignes.push(ligne);
    });
    return lignes;
  }
  function lireXlsx(buf) {
    var z = entrees(buf);
    var nomFeuille = Object.keys(z).filter(function (n) {
      return /^xl\/worksheets\/sheet\d+\.xml$/.test(n); }).sort()[0];
    if (!nomFeuille) throw new Error("Ce classeur ne contient aucune feuille lisible.");
    return texteEntree(z["xl/sharedStrings.xml"]).then(function (sst) {
      var partagees = sst ? chainesPartagees(sst) : [];
      return texteEntree(z[nomFeuille]).then(function (xml) {
        return feuilleEnLignes(xml, partagees);
      });
    });
  }

  /* ────────────────────────────────────────────────────────────── le .docx */
  function lireDocx(buf) {
    var z = entrees(buf);
    return texteEntree(z["word/document.xml"]).then(function (xml) {
      var lignes = [];
      /* D'abord les tableaux : un registre en Word en est presque toujours un. */
      (xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g) || []).forEach(function (tbl) {
        (tbl.match(/<w:tr[\s>][\s\S]*?<\/w:tr>/g) || []).forEach(function (tr) {
          var cellules = (tr.match(/<w:tc>[\s\S]*?<\/w:tc>/g) || []).map(function (tc) {
            return deXml(tc.replace(/<w:tab[^>]*\/>/g, " ").replace(/<[^>]+>/g, " "))
              .replace(/\s+/g, " ").trim();
          });
          if (cellules.some(function (c) { return c; })) lignes.push(cellules);
        });
      });
      if (lignes.length) return lignes;
      /* Pas de tableau : les paragraphes, séparés par leurs tabulations. */
      var txt = xml.replace(/<w:tab[^>]*\/>/g, "\t").replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, "");
      return deXml(txt).split(/\n/).map(function (l) { return l.split("\t"); })
        .filter(function (l) { return l.join("").trim(); });
    });
  }

  /* ────────────────────────────────────────────────────────────────── le PDF

     UN TABLEAU DE PDF SE LIT PAR SES COLONNES, PAS PAR SES LIGNES.

     Mesuré le 15 septembre 2026 sur le registre du personnel d'un client,
     cinq pages : chaque cellule sortait sur sa propre ligne, si bien que le
     rapprochement ne reconnaissait plus rien et annonçait dix rubriques
     absentes alors que le registre les portait toutes, à commencer par le nom
     et les prénoms. La règle du dépôt le disait déjà, écrite le 9 septembre :
     quand la position décide du sens, on lit les coordonnées, pas le texte à
     plat.

     La méthode : regrouper les mots par bande horizontale, relever les
     abscisses qui reviennent d'une bande à l'autre, en faire les colonnes,
     puis y ranger chaque mot. Une bande sans rien dans la première colonne
     continue la précédente : c'est ainsi que « (travailleur étranger) »
     rejoint sa ligne au lieu d'en former une. */
  function motsDe(contenu) {
    return (contenu.items || []).filter(function (it) {
      return typeof it.str === "string" && it.str.trim();
    }).map(function (it) {
      var t = it.transform || [];
      return { s: it.str.trim(), x: t[4] || 0, y: t[5] || 0 };
    });
  }
  function bandes(mots) {
    var L = [];
    mots.slice().sort(function (a, b) { return b.y - a.y || a.x - b.x; })
      .forEach(function (m) {
        var d = L.length ? L[L.length - 1] : null;
        if (d && Math.abs(d.y - m.y) <= 3) { d.mots.push(m); return; }
        L.push({ y: m.y, mots: [m] });
      });
    L.forEach(function (b) { b.mots.sort(function (a, c) { return a.x - c.x; }); });
    return L;
  }
  function colonnesDe(L) {
    var compte = {}, pleines = 0;
    L.forEach(function (b) {
      if (b.mots.length < 4) return;
      pleines++;
      var vus = {};
      b.mots.forEach(function (m) {
        var k = Math.round(m.x / 4) * 4;
        if (vus[k]) return;
        vus[k] = 1;
        compte[k] = (compte[k] || 0) + 1;
      });
    });
    if (!pleines) return [];
    var seuil = Math.max(2, Math.round(pleines * 0.3));
    var xs = Object.keys(compte).map(Number).filter(function (k) { return compte[k] >= seuil; })
      .sort(function (a, b) { return a - b; });
    /* Deux abscisses à moins de douze points l'une de l'autre sont la même
       colonne, décalée par un chiffre plus étroit ou un mot centré. */
    var out = [];
    xs.forEach(function (x) {
      if (!out.length || x - out[out.length - 1] > 12) out.push(x);
    });
    return out;
  }
  function enColonnes(L, cols) {
    var lignes = [];
    L.forEach(function (b) {
      var ligne = cols.map(function () { return []; });
      var dehors = [];
      b.mots.forEach(function (m) {
        /* La colonne la plus proche, et non la dernière franchie : un
           intitulé centré ou un nombre aligné à droite déborde de quelques
           points sur la colonne voisine. */
        var j = -1, ecart = 1e9;
        for (var i = 0; i < cols.length; i++) {
          var d = Math.abs(m.x - cols[i]);
          if (d < ecart) { ecart = d; j = i; }
        }
        if (j < 0 || (m.x < cols[0] - 12)) { dehors.push(m.s); return; }
        ligne[j].push(m.s);
      });
      var cells = ligne.map(function (c) { return c.join(" ").trim(); });
      if (dehors.length) cells[0] = (dehors.join(" ") + " " + cells[0]).trim();
      if (!cells.some(function (c) { return c; })) return;
      /* La suite d'une cellule : rien dans la première colonne, et une ligne
         au-dessus à qui la rattacher. */
      var prec = lignes[lignes.length - 1];
      if (prec && !cells[0] && cells.some(function (c) { return c; })) {
        cells.forEach(function (c, i) {
          if (!c) return;
          /* Une cellule dont la suite répète ce qu'elle dit déjà, comme
             « CDI temps partiel » suivi de « temps partiel », ne le dit pas
             deux fois. */
          var a = prec[i] || "";
          if (a && (a === c || a.slice(-c.length) === c)) return;
          prec[i] = (a ? a + " " : "") + c;
        });
        return;
      }
      lignes.push(cells);
    });
    return lignes;
  }
  function lirePdf(f) {
    if (!window.LirePdf || !window.LirePdf.charger)
      return Promise.reject(new Error("La lecture des PDF n'est pas chargée sur cet écran."));
    return window.LirePdf.charger().then(function (pdfjsLib) {
      return f.arrayBuffer().then(function (buf) {
        return pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
      });
    }).then(function (doc) {
      var suite = Promise.resolve([]);
      for (var i = 1; i <= doc.numPages; i++) {
        (function (n) {
          suite = suite.then(function (acc) {
            return doc.getPage(n).then(function (page) { return page.getTextContent(); })
              .then(function (c) { acc.push(motsDe(c)); return acc; });
          });
        })(i);
      }
      return suite;
    }).then(function (pages) {
      /* Les colonnes se cherchent sur tout le document : une page qui ne
         porte que trois lignes profite de celles des autres. */
      var toutes = [];
      pages.forEach(function (mots) { toutes = toutes.concat(bandes(mots)); });
      var cols = colonnesDe(toutes);
      if (cols.length < 2) {
        return toutes.map(function (b) {
          return [b.mots.map(function (m) { return m.s; }).join(" ")];
        });
      }
      var out = [];
      pages.forEach(function (mots) { out = out.concat(enColonnes(bandes(mots), cols)); });
      return out;
    });
  }

  function enTexte(lignes) {
    return lignes.map(function (l) {
      return l.map(function (c) { return String(c == null ? "" : c); }).join("\t");
    }).join("\n");
  }

  /* L'entrée publique : un fichier, un texte tabulé. */
  function depuisFichier(f) {
    var nom = String(f && f.name ? f.name : "").toLowerCase();
    if (/\.(csv|tsv|txt)$/.test(nom))
      return f.text().then(function (t) { return t.replace(/^﻿/, ""); });
    if (/\.pdf$/.test(nom)) return lirePdf(f).then(enTexte);
    if (/\.xlsx$/.test(nom))
      return f.arrayBuffer().then(lireXlsx).then(enTexte);
    if (/\.docx$/.test(nom))
      return f.arrayBuffer().then(lireDocx).then(enTexte);
    return Promise.reject(new Error("Format non lu ici : déposez un .xlsx, un .csv, un .docx ou un .pdf."));
  }

  window.LireTableau = { depuisFichier: depuisFichier, enTexte: enTexte };
})(window);
