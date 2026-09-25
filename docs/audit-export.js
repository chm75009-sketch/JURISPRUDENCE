/* Exporter le rapport : Word, et l'impression pour le PDF.

   Le .docx est écrit ici, à la main, en OOXML minimal. C'est délibéré et c'est
   la consigne du dépôt : les fichiers produits par la bibliothèque JavaScript
   « docx » sont refusés par Word, « des problèmes ont été décelés dans son
   contenu », et le format conservateur, celui qu'écrit python-docx, passe
   toujours. On s'en tient donc au strict nécessaire : des paragraphes, une mise
   en forme directe sans feuille de styles, des tableaux bordés, et une archive
   dont les entrées sont stockées telles quelles, sans compression.

   Le PDF n'est pas fabriqué ici : l'impression du navigateur le fait mieux, et
   sur téléphone « Imprimer » ouvre justement le choix « Enregistrer au format
   PDF ». Un PDF écrit à la main serait moins fidèle que la page elle-même. */
(function (global) {
  "use strict";

  /* ---------------------------------------------------------------- ZIP */
  var TABLE = (function () {
    var t = new Uint32Array(256), c, n, k;
    for (n = 0; n < 256; n++) {
      c = n;
      for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(u) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < u.length; i++) c = TABLE[(c ^ u[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function octets(s) { return new TextEncoder().encode(s); }

  /* Une archive aux entrées stockées : pas de compression, donc pas de
     dépendance, et un fichier que tout lecteur ouvre. */
  function zip(entrees) {
    var parts = [], centre = [], offset = 0;
    function u16(v) { return [v & 255, (v >> 8) & 255]; }
    function u32(v) { return [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255]; }
    /* LA DATE DES ENTRÉES DE L'ARCHIVE.

       Elles étaient laissées à zéro, ce que les lecteurs affichent comme
       1980 : une relecture y a vu, le 25 septembre 2026, la marque d'un
       fichier bricolé. La date du jour est écrite au format MS-DOS, deux mots
       de seize bits, celui des heures et celui des jours. */
    var d = new Date();
    var heureDos = ((d.getHours() & 31) << 11) | ((d.getMinutes() & 63) << 5) | ((d.getSeconds() / 2) & 31);
    var jourDos = (((d.getFullYear() - 1980) & 127) << 9) | (((d.getMonth() + 1) & 15) << 5) | (d.getDate() & 31);
    entrees.forEach(function (e) {
      var nom = octets(e.nom), data = octets(e.contenu), crc = crc32(data);
      var local = [].concat(u32(0x04034b50), u16(20), u16(0), u16(0), u16(heureDos), u16(jourDos),
        u32(crc), u32(data.length), u32(data.length), u16(nom.length), u16(0));
      parts.push(new Uint8Array(local), nom, data);
      centre.push({ nom: nom, crc: crc, taille: data.length, offset: offset });
      offset += local.length + nom.length + data.length;
    });
    var debutCentre = offset, centreOctets = [];
    centre.forEach(function (c) {
      var h = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(heureDos), u16(jourDos),
        u32(c.crc), u32(c.taille), u32(c.taille), u16(c.nom.length),
        u16(0), u16(0), u16(0), u16(0), u32(0), u32(c.offset));
      centreOctets.push(new Uint8Array(h), c.nom);
      offset += h.length + c.nom.length;
    });
    var fin = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0),
      u16(centre.length), u16(centre.length), u32(offset - debutCentre), u32(debutCentre), u16(0)));
    var tout = parts.concat(centreOctets, [fin]);
    var total = tout.reduce(function (n, x) { return n + x.length; }, 0);
    var out = new Uint8Array(total), p = 0;
    tout.forEach(function (x) { out.set(x, p); p += x.length; });
    return out;
  }

  /* -------------------------------------------------------------- OOXML */
  var ech = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/\x00-\x08\x0B\x0C\x0E-\x1F/g, "");
  };
  function par(texte, o) {
    o = o || {};
    var ppr = "<w:pPr>" +
      /* LE STYLE DE TITRE, EN PLUS DE LA MISE EN FORME.
         Les titres n'étaient que du gras : Word n'y voyait pas de plan, donc
         ni volet de navigation, ni sommaire, ni signets pour un document que
         la loi fait conserver quarante ans. Relevé le 25 septembre 2026 sur
         le document unique. La mise en forme directe est gardée telle quelle,
         pour que l'aspect ne bouge pas. */
      (o.style ? '<w:pStyle w:val="' + o.style + '"/>' : "") +
      (o.espaceAvant ? '<w:spacing w:before="' + o.espaceAvant + '" w:after="60"/>' : '<w:spacing w:after="60"/>') +
      /* Le bloc destinataire et la date d'une lettre se posent à droite : sur
         le papier, c'est là qu'ils sont, et un courrier dont l'adresse du
         destinataire est à gauche ne ressemble pas à un courrier. */
      (o.droite ? '<w:jc w:val="right"/>' : "") +
      (o.puce ? '<w:ind w:left="360" w:hanging="180"/>' : "") +
      (o.cadre ? '<w:pBdr><w:left w:val="single" w:sz="18" w:space="6" w:color="1F3864"/></w:pBdr><w:ind w:left="180"/>' : "") +
      "</w:pPr>";
    var rpr = "<w:rPr>" +
      (o.gras ? "<w:b/>" : "") +
      (o.taille ? '<w:sz w:val="' + o.taille + '"/><w:szCs w:val="' + o.taille + '"/>' : "") +
      (o.couleur ? '<w:color w:val="' + o.couleur + '"/>' : "") +
      "</w:rPr>";
    return "<w:p>" + ppr + runs(texte, rpr, o) + "</w:p>";
  }

  /* Un paragraphe fait normalement un seul segment. Il en fait plusieurs dès
     qu'il porte un blanc à remplir : ce qui est entre crochets sort en rouge,
     comme à l'écran, pour que l'employeur le voie avant de déposer son
     document. Demande du 12 septembre 2026.

     Rien n'est coloré là où une couleur est déjà imposée : un en-tête de
     tableau est en blanc sur fond bleu, et du rouge y serait illisible. */
  var ROUGE_BLANC = "B3261E";
  function runs(texte, rpr, o) {
    var s = String(texte == null ? "" : texte);
    if (o.couleur || s.indexOf("[") < 0)
      return "<w:r>" + rpr + '<w:t xml:space="preserve">' + ech(s) + "</w:t></w:r>";
    /* La longueur admise entre crochets est passée de 200 à 400 caractères le
       25 septembre 2026 : le blanc de l'article 27 du règlement intérieur en
       compte 223 et celui de l'article 7.3 en compte 230. Ils sortaient en
       noir, au milieu de blancs rouges, et repartaient donc non remplis. Une
       borne reste nécessaire : sans elle, deux crochets éloignés dans un long
       paragraphe se recolleraient en un seul. */
    var re = /\[[^\[\]\n]{1,400}\]/g, out = "", i = 0, m;
    var rprRouge = rpr.replace("</w:rPr>", '<w:color w:val="' + ROUGE_BLANC + '"/><w:b/></w:rPr>');
    function seg(t, r) {
      return t ? "<w:r>" + r + '<w:t xml:space="preserve">' + ech(t) + "</w:t></w:r>" : "";
    }
    while ((m = re.exec(s))) {
      out += seg(s.slice(i, m.index), rpr) + seg(m[0], rprRouge);
      i = m.index + m[0].length;
    }
    return out + seg(s.slice(i), rpr);
  }
  function cellule(texte, entete) {
    return "<w:tc><w:tcPr><w:tcW w:w=\"0\" w:type=\"auto\"/>" +
      (entete ? '<w:shd w:val="clear" w:fill="1F3864"/>' : "") + "</w:tcPr>" +
      par(texte, { gras: !!entete, taille: 18, couleur: entete ? "FFFFFF" : null }) + "</w:tc>";
  }
  function tableau(entetes, lignes) {
    var x = '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>' +
      ["top", "left", "bottom", "right", "insideH", "insideV"].map(function (b) {
        return "<w:" + b + ' w:val="single" w:sz="4" w:color="DCDFE4"/>'; }).join("") +
      "</w:tblBorders></w:tblPr>";
    /* La grille des colonnes est obligatoire : sans elle Word refuse le
       tableau, et le fichier entier avec lui. C'est le genre d'omission que
       seule une relecture du document produit met en évidence. */
    x += "<w:tblGrid>" + entetes.map(function () {
      return '<w:gridCol w:w="' + Math.floor(9638 / Math.max(1, entetes.length)) + '"/>'; }).join("") +
      "</w:tblGrid>";
    x += "<w:tr>" + entetes.map(function (h) { return cellule(h, true); }).join("") + "</w:tr>";
    lignes.forEach(function (l) {
      x += "<w:tr>" + l.map(function (c) { return cellule(c, false); }).join("") + "</w:tr>";
    });
    return x + "</w:tbl>" + par("");
  }

  /* Les éléments du rapport, dans le vocabulaire du moteur, vers le document. */
  var VERS_WORD = {
    bandeau: function (i) { return par(i.t, { gras: true, taille: 36, couleur: "1F3864", espaceAvant: 120 }) + par(i.sous, { taille: 20 }); },
    t1: function (i) { return par(i.t, { gras: true, taille: 32, espaceAvant: 200, style: "Titre1" }); },
    h1: function (i) { return par(i.t, { gras: true, taille: 28, couleur: "1F3864", espaceAvant: 240, style: "Titre1" }); },
    h2: function (i) { return par(i.t, { gras: true, taille: 24, couleur: "1F3864", espaceAvant: 200, style: "Titre2" }); },
    h3: function (i) { return par(i.t, { gras: true, taille: 22, couleur: "1F3864", espaceAvant: 160, style: "Titre3" }); },
    sur: function (i) { return par(i.t, { taille: 18, couleur: "5F6874" }); },
    dest: function (i) { return par(i.t, { droite: true }); },
    p: function (i) { return par(i.t); },
    note: function (i) { return par(i.t, { taille: 18, couleur: "5F6874" }); },
    puce: function (i) { var t = String(i.t || ""); return par(/^[-•]/.test(t) ? t : "- " + t, { puce: true }); },
    trait: function () { return par("________________________________________", { couleur: "DCDFE4" }); },
    saut: function () { return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'; },
    enc: function (i) { return par(i.titre, { gras: true, cadre: true }) + par(i.t, { cadre: true }); },
    etape: function (i) { return par(i.t + (i.compte ? "  ·  " + i.compte : ""), { gras: true, couleur: "1F3864", espaceAvant: 200 }); },
    acte: function (i) { return par(i.n + ". " + i.t + "  [" + i.priorite + "]", { gras: true, cadre: true }) +
      par((i.etat ? i.etat + ", " : "") + i.pourquoi + "  ·  " + i.id, { taille: 18, couleur: "5F6874", cadre: true }); },
    interdit: function (i) { return par(i.t, { gras: true, couleur: "8E1B1B", cadre: true }) +
      par(i.pourquoi + "  ·  " + i.id, { taille: 18, couleur: "5F6874", cadre: true }); },
    acquis: function (i) { return par("✓ " + i.t + ", " + i.base, { puce: true }); },
    rouge: function (i) { return '<p style="color:#C00000">' + ech(i.t) + "</p>"; },
    table: function (i) { return tableau(i.head, i.rows); },
    /* Ce qui a été ajouté ou corrigé après coup, et qui doit se voir. */
    rouge: function (i) { return par(i.t, { couleur: "C00000" }); },
  };

  /* Un troisième argument, facultatif : { paysage: true } pour un tableau
     large, comme le modèle de registre et ses onze colonnes. Les appels qui ne
     le passent pas gardent le portrait. */
  /* CE QUE LE FICHIER PORTAIT, ET CE QU'IL LUI MANQUAIT.

     Le document sortait en quatre parties : les types, les deux fichiers de
     relations et le corps. Ni feuille de styles, ni propriétés, ni pied de
     page, donc aucun plan dans Word, aucun titre dans les informations du
     fichier, et pas un numéro de page. Pour un document unique que la loi
     fait conserver quarante ans, et qu'on imprime pour le faire signer, c'est
     éliminatoire. Relevé le 25 septembre 2026.

     Les trois parties ajoutées sont les plus ordinaires qui soient : styles,
     core.xml et un pied de page avec le champ PAGE. */
  var STYLES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>' +
    '<w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
    ["Titre1", "Titre2", "Titre3"].map(function (id, n) {
      return '<w:style w:type="paragraph" w:styleId="' + id + '">' +
        '<w:name w:val="heading ' + (n + 1) + '"/><w:basedOn w:val="Normal"/>' +
        '<w:qFormat/><w:pPr><w:outlineLvl w:val="' + n + '"/></w:pPr>' +
        '<w:rPr><w:b/><w:color w:val="1F3864"/><w:sz w:val="' + (30 - n * 4) + '"/></w:rPr></w:style>';
    }).join("") +
    "</w:styles>";

  /* Les paramètres du document. Word en écrit toujours un ; son absence se
     voit quand on ouvre le fichier au chantier. On y met le strict utile :
     la langue, et la mise à jour des champs à l'ouverture, pour que le numéro
     de page du pied se calcule. Posé le 25 septembre 2026. */
  var REGLAGES =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
    '<w:updateFields w:val="true"/>' +
    '<w:themeFontLang w:val="fr-FR"/>' +
    "</w:settings>";

  function pied(titre, opts) {
    var bas = (opts && opts.pied) || titre || "";
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:p><w:pPr><w:jc w:val="center"/></w:pPr>' +
      '<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="5F6874"/></w:rPr>' +
      '<w:t xml:space="preserve">' + ech(bas) + "  ·  page </w:t></w:r>" +
      '<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="5F6874"/></w:rPr>' +
      '<w:fldChar w:fldCharType="begin"/></w:r>' +
      '<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="5F6874"/></w:rPr>' +
      '<w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>' +
      '<w:r><w:rPr><w:sz w:val="16"/><w:color w:val="5F6874"/></w:rPr>' +
      '<w:fldChar w:fldCharType="end"/></w:r>' +
      "</w:p></w:ftr>";
  }

  function proprietes(titre, opts) {
    var d = new Date().toISOString().slice(0, 19) + "Z";
    var qui = (opts && opts.auteur) || "";
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"' +
      ' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"' +
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      "<dc:title>" + ech(titre || "") + "</dc:title>" +
      "<dc:creator>" + ech(qui) + "</dc:creator>" +
      "<cp:lastModifiedBy>" + ech(qui) + "</cp:lastModifiedBy>" +
      '<dcterms:created xsi:type="dcterms:W3CDTF">' + d + "</dcterms:created>" +
      '<dcterms:modified xsi:type="dcterms:W3CDTF">' + d + "</dcterms:modified>" +
      "</cp:coreProperties>";
  }

  /* UN TABLEAU LARGE PASSE EN PAYSAGE, LE RESTE N'Y PASSE PAS.

     Le programme annuel de prévention tient sept colonnes ; en portrait, il
     sortait en neuf points sur une largeur de quinze centimètres, illisible.
     Relevé le 25 septembre 2026. Un tableau marqué « paysage » est donc
     encadré de deux sauts de section : celui qui le précède ferme la partie
     en portrait, celui qui le suit ferme la partie en paysage, et la suite du
     document revient au portrait. C'est la mécanique ordinaire d'OOXML, où un
     sectPr décrit la section qui se termine avec lui.                        */
  function sautSection(paysage, opts) {
    return "<w:p><w:pPr><w:sectPr>" + sectionXml(paysage, opts) + "</w:sectPr></w:pPr></w:p>";
  }
  function sectionXml(paysage, opts) {
    return '<w:footerReference w:type="default" r:id="rIdPied"/>' +
      (paysage
        ? '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>'
        : '<w:pgSz w:w="11906" w:h="16838"/>') +
      '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/>';
  }

  function docx(items, titre, opts) {
    var large = !!(opts && opts.paysage);
    var corps = items.map(function (i) {
      if (i.k === "table" && i.paysage && !large) {
        return sautSection(false, opts) + tableau(i.head, i.rows) + sautSection(true, opts);
      }
      return VERS_WORD[i.k] ? VERS_WORD[i.k](i) : "";
    }).join("");
    var section = '<w:footerReference w:type="default" r:id="rIdPied"/>' +
      ((opts && opts.paysage)
        ? '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>'
        : '<w:pgSz w:w="11906" w:h="16838"/>') +
      '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/>';
    var doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"' +
      ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      "<w:body>" + par(titre, { gras: true, taille: 40, style: "Titre1" }) + corps +
      "<w:sectPr>" + section + "</w:sectPr></w:body></w:document>";
    var octets = zip([
      { nom: "[Content_Types].xml", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
        '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>' +
        '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>' +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
        "</Types>" },
      { nom: "_rels/.rels", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
        "</Relationships>" },
      { nom: "word/_rels/document.xml.rels", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '<Relationship Id="rIdReglages" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>' +
        '<Relationship Id="rIdPied" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>' +
        "</Relationships>" },
      { nom: "word/styles.xml", contenu: STYLES },
      { nom: "word/settings.xml", contenu: REGLAGES },
      { nom: "word/footer1.xml", contenu: pied(titre, opts) },
      { nom: "docProps/core.xml", contenu: proprietes(titre, opts) },
      { nom: "word/document.xml", contenu: doc },
    ]);
    /* Les octets écrits gardent avec eux le rendu qui leur correspond : c'est
       lui que l'aperçu montrera au moment d'enregistrer. */
    if (window.Apercu) window.Apercu.poser(octets, { titre: titre, html: htmlApercu(items, titre) });
    return octets;
  }

  /* L'APERÇU AVANT L'ENREGISTREMENT. Le même document, rendu en page : sur
     un téléphone, Safari dépose le fichier dans iCloud Drive sans rien
     montrer, et il faut sortir de l'application pour savoir ce qu'on vient
     de télécharger. Demande du 13 septembre 2026. Le rendu suit VERS_WORD
     item par item, pour que ce qui s'affiche soit ce qui s'enregistre. */
  var VERS_HTML = {
    bandeau: function (i) { return "<h1>" + ech(i.t) + "</h1>" + (i.sous ? '<p class="ap-sur">' + ech(i.sous) + "</p>" : ""); },
    t1: function (i) { return "<h1>" + ech(i.t) + "</h1>"; },
    h1: function (i) { return "<h1>" + ech(i.t) + "</h1>"; },
    h2: function (i) { return "<h2>" + ech(i.t) + "</h2>"; },
    h3: function (i) { return "<h3>" + ech(i.t) + "</h3>"; },
    sur: function (i) { return '<p class="ap-sur">' + ech(i.t) + "</p>"; },
    dest: function (i) { return '<p style="text-align:right">' + ech(i.t) + "</p>"; },
    p: function (i) { return "<p>" + ech(i.t) + "</p>"; },
    note: function (i) { return '<p class="ap-note">' + ech(i.t) + "</p>"; },
    puce: function (i) { return "<ul><li>" + ech(String(i.t || "").replace(/^[-•]\s*/, "")) + "</li></ul>"; },
    trait: function () { return "<hr>"; },
    saut: function () { return "<hr>"; },
    enc: function (i) { return "<p><b>" + ech(i.titre) + "</b></p><p>" + ech(i.t) + "</p>"; },
    etape: function (i) { return "<h2>" + ech(i.t) + (i.compte ? " · " + ech(i.compte) : "") + "</h2>"; },
    acte: function (i) { return "<p><b>" + ech(i.n + ". " + i.t + "  [" + i.priorite + "]") + "</b></p>" +
      '<p class="ap-note">' + ech((i.etat ? i.etat + ", " : "") + i.pourquoi + "  ·  " + i.id) + "</p>"; },
    interdit: function (i) { return "<p><b>" + ech(i.t) + "</b></p>" +
      '<p class="ap-note">' + ech(i.pourquoi + "  ·  " + i.id) + "</p>"; },
    acquis: function (i) { return "<ul><li>" + ech("✓ " + i.t + ", " + i.base) + "</li></ul>"; },
    rouge: function (i) { return '<p style="color:#C00000">' + ech(i.t) + "</p>"; },
    table: function (i) {
      var lignes = [].concat(i.head ? [i.head] : [], i.rows || []);
      return window.Apercu ? window.Apercu.tableHtml(lignes, !!i.head) : "";
    },
  };
  function htmlApercu(items, titre) {
    return "<h1>" + ech(titre) + "</h1>" + (items || []).map(function (i) {
      return VERS_HTML[i.k] ? VERS_HTML[i.k](i) : "";
    }).join("");
  }

  function telecharger(octetsFichier, nom, type) {
    var vu = window.Apercu ? window.Apercu.pour(octetsFichier) : null;
    if (vu) {
      window.Apercu.montrer(vu, nom, function () { enregistrer(octetsFichier, nom, type); });
      return;
    }
    enregistrer(octetsFichier, nom, type);
  }
  function enregistrer(octetsFichier, nom, type) {
    var b = new Blob([octetsFichier], { type: type });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u; a.setAttribute("download", nom); a.rel = "noopener";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 2000);
  }

  global.AuditExport = { docx: docx, telecharger: telecharger };
})(typeof window !== "undefined" ? window : this);
