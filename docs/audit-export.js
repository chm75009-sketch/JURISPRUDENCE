/* Exporter le rapport : Word, et l'impression pour le PDF.

   Le .docx est écrit ici, à la main, en OOXML minimal. C'est délibéré et c'est
   la consigne du dépôt : les fichiers produits par la bibliothèque JavaScript
   « docx » sont refusés par Word — « des problèmes ont été décelés dans son
   contenu » — et le format conservateur, celui qu'écrit python-docx, passe
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
    entrees.forEach(function (e) {
      var nom = octets(e.nom), data = octets(e.contenu), crc = crc32(data);
      var local = [].concat(u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length), u16(nom.length), u16(0));
      parts.push(new Uint8Array(local), nom, data);
      centre.push({ nom: nom, crc: crc, taille: data.length, offset: offset });
      offset += local.length + nom.length + data.length;
    });
    var debutCentre = offset, centreOctets = [];
    centre.forEach(function (c) {
      var h = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
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
      (o.espaceAvant ? '<w:spacing w:before="' + o.espaceAvant + '" w:after="60"/>' : '<w:spacing w:after="60"/>') +
      (o.puce ? '<w:ind w:left="360" w:hanging="180"/>' : "") +
      (o.cadre ? '<w:pBdr><w:left w:val="single" w:sz="18" w:space="6" w:color="1F3864"/></w:pBdr><w:ind w:left="180"/>' : "") +
      "</w:pPr>";
    var rpr = "<w:rPr>" +
      (o.gras ? "<w:b/>" : "") +
      (o.taille ? '<w:sz w:val="' + o.taille + '"/><w:szCs w:val="' + o.taille + '"/>' : "") +
      (o.couleur ? '<w:color w:val="' + o.couleur + '"/>' : "") +
      "</w:rPr>";
    return "<w:p>" + ppr + "<w:r>" + rpr +
      '<w:t xml:space="preserve">' + ech(texte) + "</w:t></w:r></w:p>";
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
    t1: function (i) { return par(i.t, { gras: true, taille: 32, espaceAvant: 200 }); },
    h1: function (i) { return par(i.t, { gras: true, taille: 28, couleur: "1F3864", espaceAvant: 240 }); },
    h2: function (i) { return par(i.t, { gras: true, taille: 24, couleur: "1F3864", espaceAvant: 200 }); },
    h3: function (i) { return par(i.t, { gras: true, taille: 22, couleur: "1F3864", espaceAvant: 160 }); },
    sur: function (i) { return par(i.t, { taille: 18, couleur: "5F6874" }); },
    p: function (i) { return par(i.t); },
    note: function (i) { return par(i.t, { taille: 18, couleur: "5F6874" }); },
    puce: function (i) { return par("— " + i.t, { puce: true }); },
    trait: function () { return par("________________________________________", { couleur: "DCDFE4" }); },
    saut: function () { return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'; },
    enc: function (i) { return par(i.titre, { gras: true, cadre: true }) + par(i.t, { cadre: true }); },
    etape: function (i) { return par(i.t + (i.compte ? "  ·  " + i.compte : ""), { gras: true, couleur: "1F3864", espaceAvant: 200 }); },
    acte: function (i) { return par(i.n + ". " + i.t + "  [" + i.priorite + "]", { gras: true, cadre: true }) +
      par((i.etat ? i.etat + " — " : "") + i.pourquoi + "  ·  " + i.id, { taille: 18, couleur: "5F6874", cadre: true }); },
    interdit: function (i) { return par(i.t, { gras: true, couleur: "8E1B1B", cadre: true }) +
      par(i.pourquoi + "  ·  " + i.id, { taille: 18, couleur: "5F6874", cadre: true }); },
    acquis: function (i) { return par("✓ " + i.t + " — " + i.base, { puce: true }); },
    table: function (i) { return tableau(i.head, i.rows); },
  };

  function docx(items, titre) {
    var corps = items.map(function (i) {
      return VERS_WORD[i.k] ? VERS_WORD[i.k](i) : "";
    }).join("");
    var doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      "<w:body>" + par(titre, { gras: true, taille: 40 }) + corps +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/>' +
      '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="709" w:footer="709" w:gutter="0"/>' +
      "</w:sectPr></w:body></w:document>";
    return zip([
      { nom: "[Content_Types].xml", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        "</Types>" },
      { nom: "_rels/.rels", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        "</Relationships>" },
      { nom: "word/_rels/document.xml.rels", contenu: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>' },
      { nom: "word/document.xml", contenu: doc },
    ]);
  }

  function telecharger(octetsFichier, nom, type) {
    var b = new Blob([octetsFichier], { type: type });
    var u = URL.createObjectURL(b);
    var a = document.createElement("a");
    a.href = u; a.setAttribute("download", nom); a.rel = "noopener";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 2000);
  }

  global.AuditExport = { docx: docx, telecharger: telecharger };
})(typeof window !== "undefined" ? window : this);
