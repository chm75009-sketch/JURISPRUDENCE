/* LIRE UN PDF DANS LE NAVIGATEUR.

   POURQUOI CE FICHIER EXISTE

   Demande du 13 septembre 2026 : « il faut qu'il lise les pdf aussi ». Les
   écrans de contrôle acceptaient le .docx, le .xlsx, le .csv et le .txt ;
   devant un PDF, ils demandaient d'ouvrir le document ailleurs, d'en copier le
   texte et de le coller. Or un règlement intérieur déposé au greffe, une base
   de données envoyée au comité, un document unique communiqué à l'inspection
   circulent presque toujours en PDF.

   CE QUE CE FICHIER SAIT FAIRE, ET CE QU'IL NE SAIT PAS

   Il rend le texte du PDF, page après page, dans l'ordre de lecture. Il ne
   sait rien faire d'un PDF SCANNÉ : une photocopie enregistrée en PDF n'a pas
   de couche texte, seulement une image, et aucun texte n'en sortira. Ce cas
   est reconnu et dit à l'utilisateur en clair, plutôt que de rendre une page
   blanche sans explication.

   COMMENT

   Par pdf.js, la bibliothèque de la fondation Mozilla (Apache 2.0), déposée
   ici en deux fichiers, pdfjs.js et pdfjs.worker.js. Elle n'est chargée qu'au
   moment où un PDF est déposé : les écrans qui n'en reçoivent jamais ne paient
   pas ses 1,3 Mo. Rien ne sort du navigateur, comme pour les autres formats.  */

(function (window) {
  "use strict";

  var CHARGEMENT = null;

  /* La bibliothèque, chargée une seule fois, à la demande. */
  function charger() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
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

  /* Les fragments d'une page arrivent dans l'ordre du fichier, avec leur
     position. On recompose les lignes : un saut de ligne quand l'ordonnée
     change, une espace quand deux fragments se suivent sans se toucher. Sans
     cela, un tableau ressort en un seul paragraphe, et le contrôle ne
     retrouve plus ses rubriques. */
  function pageEnTexte(contenu) {
    var lignes = [], y = null, ligne = "", finX = null;
    (contenu.items || []).forEach(function (it) {
      if (typeof it.str !== "string") return;
      var t = it.transform || [];
      var ty = t[5], tx = t[4];
      if (y === null || Math.abs(ty - y) > 2.5) {
        if (ligne.trim()) lignes.push(ligne.trim());
        ligne = it.str; y = ty; finX = tx + (it.width || 0);
        return;
      }
      if (finX !== null && tx - finX > 1.2 && !/\s$/.test(ligne) && !/^\s/.test(it.str)) ligne += " ";
      ligne += it.str;
      finX = tx + (it.width || 0);
      if (it.hasEOL) { if (ligne.trim()) lignes.push(ligne.trim()); ligne = ""; y = null; finX = null; }
    });
    if (ligne.trim()) lignes.push(ligne.trim());
    return lignes.join("\n");
  }

  /* Le texte du PDF entier. « pages » borne la lecture des documents très
     longs ; sans borne, tout est lu. */
  function texte(fichier, options) {
    var max = (options && options.pages) || 0;
    return charger().then(function (pdfjsLib) {
      return fichier.arrayBuffer().then(function (buf) {
        return pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
      });
    }).then(function (doc) {
      var n = max ? Math.min(max, doc.numPages) : doc.numPages;
      var suite = Promise.resolve([]);
      for (var i = 1; i <= n; i++) {
        (function (p) {
          suite = suite.then(function (acc) {
            return doc.getPage(p).then(function (page) { return page.getTextContent(); })
              .then(function (c) { acc.push(pageEnTexte(c)); return acc; });
          });
        })(i);
      }
      return suite.then(function (pages) {
        var t = pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
        if (!t) throw new Error(
          "Ce PDF ne contient pas de texte : c'est un document scanné, une image. " +
          "Déposez la version d'origine (Word, Excel) ou collez le texte.");
        return t;
      });
    });
  }

  window.LirePdf = { texte: texte, charger: charger, estPdf: function (f) {
    return !!f && (/\.pdf$/i.test(f.name || "") || f.type === "application/pdf");
  } };
})(window);
