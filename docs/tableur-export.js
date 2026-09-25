/* Un classeur Excel écrit à la main, en OOXML minimal, avec ses cadres.

   Pourquoi ce fichier existe : le 8 septembre 2026, le classeur de la base de
   données sortait sans feuille de style, « c'est de la merde, il faut mettre
   les cadres, séparer colonnes et lignes ». Le 9 septembre, le registre du
   personnel sortait en texte, « il est où le modèle en Excel bien fait, clair,
   opérationnel ». Le classeur est donc écrit ici une fois pour toutes, et
   chaque page qui produit un tableau s'en sert.

   Une feuille = { titre, lignes, largeurs }. Dans lignes, la première ligne
   qui porte au moins quatre cellules pleines est l'en-tête : en gras sur fond
   gris, figée. Les lignes d'avant sont des titres ; celles d'après sont le
   tableau, chaque cellule cadrée. Une ligne d'une seule cellule après
   l'en-tête est une note, non cadrée.

   Pas de bibliothèque : les fichiers de la bibliothèque JavaScript « docx »
   sont refusés par Word, et le même conservatisme vaut pour Excel. Les
   entrées de l'archive sont stockées telles quelles, sans compression. */
(function (global) {
  "use strict";

  var TABLE = (function () {
    var t = new Uint32Array(256), c, n, k;
    for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(u) { var c = 0xFFFFFFFF; for (var i = 0; i < u.length; i++) c = TABLE[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function octets(s) { return new TextEncoder().encode(s); }
  function zip(entrees) {
    var parts = [], centre = [], offset = 0;
    function w16(v) { return [v & 255, (v >> 8) & 255]; }
    function w32(v) { return [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255]; }
    entrees.forEach(function (e) {
      var nom = octets(e.nom), data = octets(e.contenu), crc = crc32(data);
      var local = [].concat(w32(0x04034b50), w16(20), w16(0), w16(0), w16(0), w16(0), w32(crc), w32(data.length), w32(data.length), w16(nom.length), w16(0));
      parts.push(new Uint8Array(local), nom, data);
      centre.push({ nom: nom, crc: crc, taille: data.length, offset: offset });
      offset += local.length + nom.length + data.length;
    });
    var debutCentre = offset, centreOctets = [];
    centre.forEach(function (c) {
      var h = [].concat(w32(0x02014b50), w16(20), w16(20), w16(0), w16(0), w16(0), w16(0), w32(c.crc), w32(c.taille), w32(c.taille), w16(c.nom.length), w16(0), w16(0), w16(0), w16(0), w32(0), w32(c.offset));
      centreOctets.push(new Uint8Array(h), c.nom);
      offset += h.length + c.nom.length;
    });
    var fin = new Uint8Array([].concat(w32(0x06054b50), w16(0), w16(0), w16(centre.length), w16(centre.length), w32(offset - debutCentre), w32(debutCentre), w16(0)));
    var tout = parts.concat(centreOctets, [fin]);
    var total = tout.reduce(function (n, x) { return n + x.length; }, 0);
    var out = new Uint8Array(total), p = 0;
    tout.forEach(function (x) { out.set(x, p); p += x.length; });
    return out;
  }

  var ech = function (s) {
    return String(s == null ? "" : s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  function colonne(n) { var s = ""; while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; } return s; }
  /* Les onglets d'Excel tiennent en trente et un caractères. Une coupure
     brute donnait « 5 Activités sociales et », « 6 Rémunération des »,
     « 7 Flux financiers à » : un titre qui s'arrête sur une conjonction ou une
     préposition ne dit plus rien. Relevé le 25 septembre 2026 sur la base de
     données. On coupe donc au dernier mot plein. */
  var MOTS_CREUX = ["et", "de", "des", "du", "à", "au", "aux", "la", "le", "les",
    "en", "dans", "pour", "par", "sur", "d", "l", "un", "une"];
  function nomOnglet(t, pris) {
    var s = String(t || "Feuille").replace(/[\\\/\?\*\[\]:]/g, " ").replace(/\s+/g, " ").trim();
    if (s.length > 31) {
      s = s.slice(0, 31);
      var e = s.lastIndexOf(" ");
      if (e > 12) s = s.slice(0, e);
      /* Tant que le dernier mot est creux, on l'enlève : « Activités sociales
         et » devient « Activités sociales ». */
      var mots = s.split(" ");
      while (mots.length > 2 &&
             MOTS_CREUX.indexOf(mots[mots.length - 1].toLowerCase().replace(/['’]$/, "")) >= 0) {
        mots.pop();
      }
      s = mots.join(" ");
    }
    var base = s, i = 2;
    while (pris[s.toLowerCase()]) s = base.slice(0, 25) + " " + (i++);
    pris[s.toLowerCase()] = true;
    return s;
  }
  function pleines(l) { return (l || []).filter(function (c) { return c !== null && c !== undefined && c !== ""; }).length; }

  /* Styles : 1 = titre, 2 = en-tête, 3 = cellule cadrée, 4 = note,
     5 = cellule cadrée d'une ligne paire.

     LES CADRES SONT EN GRAS. Demande du 15 septembre 2026, « tous les
     documents Excel de l'application doivent avoir la bordure » : ce sont les
     mêmes cadres que ceux validés sur le classeur de la base de données, un
     trait moyen gris ardoise autour de chaque cellule du tableau, et une
     ligne sur deux très légèrement teintée pour suivre une ligne longue de
     l'œil sans la perdre. Les titres et les notes, qui ne sont pas des
     cellules de tableau, restent sans cadre : les encadrer ferait un
     quadrillage et non un tableau. */
  var STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="13"/><color rgb="FF1F3864"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="4"><fill><patternFill patternType="none"/></fill>' +
    '<fill><patternFill patternType="gray125"/></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFE7EAF0"/><bgColor indexed="64"/></patternFill></fill>' +
    '<fill><patternFill patternType="solid"><fgColor rgb="FFF7F8FB"/><bgColor indexed="64"/></patternFill></fill></fills>' +
    '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>' +
    '<border><left style="medium"><color rgb="FF4A5568"/></left><right style="medium"><color rgb="FF4A5568"/></right>' +
    '<top style="medium"><color rgb="FF4A5568"/></top><bottom style="medium"><color rgb="FF4A5568"/></bottom>' +
    '<diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="6">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
    '<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
    '<xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>' +
    '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

  /* La ligne d'en-tête d'une feuille : la première qui porte au moins quatre
     cellules pleines. La même règle sert à figer le volet, à styler la ligne
     et à la répéter à l'impression. */
  function ligneEntete(lignes) {
    var tete = -1;
    (lignes || []).forEach(function (l, i) { if (tete < 0 && pleines(l) >= 4) tete = i; });
    return tete;
  }
  function feuilleXml(lignes, largeurs) {
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>';
    var tete = ligneEntete(lignes);
    if (tete >= 0) x += '<sheetViews><sheetView workbookViewId="0"><pane ySplit="' + (tete + 1) + '" topLeftCell="A' + (tete + 2) + '" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
    x += '<sheetFormatPr defaultRowHeight="15"/>';
    var nbCol = Math.max.apply(null, lignes.map(function (l) { return (l || []).length; }).concat([1]));
    if (!largeurs || !largeurs.length) {
      largeurs = [];
      for (var j = 0; j < nbCol; j++) {
        var w = 10;
        lignes.forEach(function (l, i) { if (i >= tete && l && l[j] != null && pleines(l) > 1) w = Math.max(w, Math.min(48, String(l[j]).length + 2)); });
        largeurs.push(w);
      }
    }
    x += "<cols>" + largeurs.map(function (w, j) { return '<col min="' + (j + 1) + '" max="' + (j + 1) + '" width="' + w + '" customWidth="1"/>'; }).join("") + "</cols>";
    x += "<sheetData>";
    lignes.forEach(function (ligne, i) {
      ligne = ligne || [];
      if (!pleines(ligne)) { x += '<row r="' + (i + 1) + '"/>'; return; }
      var titre = i < tete || tete < 0 ? (pleines(ligne) === 1 && i === 0 ? 1 : 4) : 0;
      var numero = /^\d+$/.test(String(ligne[0] == null ? "" : ligne[0]));
      var note = tete >= 0 && i > tete && pleines(ligne) === 1 && !numero;
      var enTete = i === tete || (tete >= 0 && i > tete && pleines(ligne) >= 4 && !numero);
      var style = titre ? titre : (enTete ? 2 : (note ? 4 : 3));
      /* Une ligne de données sur deux, très légèrement teintée. */
      if (style === 3 && tete >= 0 && (i - tete) % 2 === 0) style = 5;
      var largeur = (style === 3 || style === 2) ? nbCol : ligne.length;
      x += '<row r="' + (i + 1) + '"' + (style === 1 ? ' ht="22" customHeight="1"' : "") + '>';
      for (var j = 0; j < largeur; j++) {
        var cel = ligne[j], ref = colonne(j + 1) + (i + 1);
        if (cel === null || cel === undefined || cel === "") { x += '<c r="' + ref + '" s="' + style + '"/>'; continue; }
        x += '<c r="' + ref + '" s="' + style + '" t="inlineStr"><is><t xml:space="preserve">' + ech(cel) + "</t></is></c>";
      }
      x += "</row>";
    });
    x += "</sheetData>";
    /* LA MISE EN PAGE POUR L'IMPRESSION.

       Le classeur n'en avait aucune : dix colonnes sur du papier en portrait,
       sans répétition de l'en-tête, donc illisible dès la seconde page.
       Relevé le 25 septembre 2026. Paysage, ajusté à la largeur d'une page, et
       la ligne d'en-tête répétée en haut de chaque feuille imprimée. */
    x += '<printOptions horizontalCentered="0"/>' +
      '<pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>' +
      '<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0" paperSize="9"/>';
    return x + "</worksheet>";
  }

  /* LES PROPRIÉTÉS DU CLASSEUR.

     Le fichier n'en portait aucune : ni titre, ni auteur, ni date. Un lecteur
     qui l'ouvre avec un outil tiers y voit alors le nom de cet outil, et une
     relecture du 25 septembre 2026 a cru y lire « openpyxl » en auteur. On
     écrit donc les nôtres, comme pour les documents Word. */
  function proprietes(o) {
    var d = new Date().toISOString().slice(0, 19) + "Z";
    var qui = (o && o.auteur) || "";
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"' +
      ' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"' +
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      "<dc:title>" + ech((o && o.titre) || "") + "</dc:title>" +
      "<dc:creator>" + ech(qui) + "</dc:creator>" +
      "<cp:lastModifiedBy>" + ech(qui) + "</cp:lastModifiedBy>" +
      '<dcterms:created xsi:type="dcterms:W3CDTF">' + d + "</dcterms:created>" +
      '<dcterms:modified xsi:type="dcterms:W3CDTF">' + d + "</dcterms:modified>" +
      "</cp:coreProperties>";
  }

  function xlsx(feuilles, opts) {
    opts = opts || {};
    var pris = {};
    var noms = feuilles.map(function (f) { return nomOnglet(f.titre, pris); });
    var entrees = [
      { nom: "[Content_Types].xml", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        feuilles.map(function (f, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join("") +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>' },
      { nom: "_rels/.rels", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>' },
      { nom: "xl/workbook.xml", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
        feuilles.map(function (f, i) { return '<sheet name="' + ech(noms[i]) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join("") + "</sheets>" +
        /* La ligne d'en-tête se répète en haut de chaque page imprimée : sans
           elle, la seconde page d'une rubrique n'a plus de colonnes nommées. */
        '<definedNames>' + feuilles.map(function (f, i) {
          var t = ligneEntete(f.lignes);
          if (t < 0) return "";
          return '<definedName name="_xlnm.Print_Titles" localSheetId="' + i + '">' +
            "'" + ech(String(noms[i]).replace(/'/g, "''")) + "'!$" + (t + 1) + ":$" + (t + 1) +
            "</definedName>";
        }).join("") + "</definedNames></workbook>" },
      { nom: "xl/_rels/workbook.xml.rels", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        feuilles.map(function (f, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join("") +
        '<Relationship Id="rId' + (feuilles.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { nom: "xl/styles.xml", contenu: STYLES },
      { nom: "docProps/core.xml", contenu: proprietes(opts) },
    ];
    feuilles.forEach(function (f, i) { entrees.push({ nom: "xl/worksheets/sheet" + (i + 1) + ".xml", contenu: feuilleXml(f.lignes, f.largeurs) }); });
    var octets = zip(entrees);
    /* Le classeur garde avec lui son rendu lisible : l'aperçu le montre,
       feuille par feuille, avant que le fichier ne parte sur le téléphone.
       Demande du 13 septembre 2026 : « je dois pouvoir l'ouvrir d'abord ». */
    if (global.Apercu)
      global.Apercu.poser(octets, { titre: (feuilles[0] && feuilles[0].titre) || "Classeur",
        html: global.Apercu.htmlFeuilles(feuilles) });
    return octets;
  }

  function telecharger(bytes, nom) {
    var vu = global.Apercu ? global.Apercu.pour(bytes) : null;
    if (vu) { global.Apercu.montrer(vu, nom, function () { enregistrer(bytes, nom); }); return; }
    enregistrer(bytes, nom);
  }
  function enregistrer(bytes, nom) {
    var b = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    var u = URL.createObjectURL(b), a = document.createElement("a");
    a.href = u; a.download = nom; a.rel = "noopener";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 2000);
  }

  global.TableurExport = { xlsx: xlsx, telecharger: telecharger, nomOnglet: nomOnglet };
})(typeof window !== "undefined" ? window : this);
