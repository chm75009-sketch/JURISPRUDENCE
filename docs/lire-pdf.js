/* LIRE UN PDF DANS LE NAVIGATEUR.

   POURQUOI CE FICHIER EXISTE

   Demande du 13 septembre 2026 : « il faut qu'il lise les pdf aussi ». Les
   écrans de contrôle acceptaient le .docx, le .xlsx, le .csv et le .txt ;
   devant un PDF, ils demandaient d'ouvrir le document ailleurs, d'en copier le
   texte et de le coller. Or un règlement intérieur déposé au greffe, une base
   de données envoyée au comité, un document unique communiqué à l'inspection
   circulent presque toujours en PDF.

   CE QUE CE FICHIER SAIT FAIRE

   Il rend le texte du PDF, page après page, dans l'ordre de lecture, et il
   retire au passage les en-têtes et les pieds de page répétés d'une page à
   l'autre. Un PDF scanné, qui n'a pas de couche texte, ne l'arrête plus : la
   reconnaissance de caractères de lire-ocr.js prend le relais, dans le
   navigateur également.

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

  /* LES EN-TÊTES ET LES PIEDS DE PAGE, RETIRÉS.

     Demande du 14 septembre 2026, sur un document de quarante-quatre pages
     dont chaque page portait « ADR CONSEIL TRANSPORT, 112 bis avenue
     Salengro, 94500 Champigny-sur-Marne, téléphone, page 15 sur 44 ». Ces
     lignes ne font pas partie du document : elles sont imprimées sur chaque
     page, elles reviennent quarante-quatre fois dans le texte contrôlé et se
     retrouvent au milieu de la version corrigée.

     La règle est prudente, parce qu'effacer du contenu réel serait pire que
     de laisser un pied de page. Une ligne n'est retirée que si elle réunit
     tout ceci : se trouver dans les trois premières ou les trois dernières
     lignes de sa page, sur une page d'au moins huit lignes ; être courte,
     cent quarante caractères au plus ; et revenir, pagination neutralisée,
     sur la moitié au moins des pages, trois pages au minimum. Un document de
     une ou deux pages n'est donc jamais touché. Les numéros de page isolés
     partent aussi.

     Mesuré sur trois documents réels après cette règle : 3,3 % du registre du
     personnel de huit pages, 0,2 % d'une liste d'experts de cent pages, 0,2 %
     d'une brochure de prévention, et sur un règlement d'essai, huit titres
     d'articles sur huit conservés.  */
  /* L'empreinte garde les chiffres. Les effacer tous ferait de « Article 1 »
     et « Article 2 » la même ligne, et les titres d'articles d'un règlement
     intérieur disparaîtraient avec les pieds de page : mesuré le 14 septembre
     2026 sur un document d'essai, huit titres effacés sur huit. Seule la
     pagination est neutralisée, parce qu'elle seule varie par construction,
     y compris au milieu d'une ligne qui porte aussi le nom du cabinet. */
  function empreinte(l) {
    return String(l)
      .replace(/\bpages?\s*\d+\s*(?:\/|sur|of|de)\s*\d+/gi, " ")
      .replace(/\bpage\s*\d+\b/gi, " ")
      .replace(/\s+/g, " ").trim().toLowerCase();
  }
  var NUM_SEUL = /^[-–—\s]*(?:page\s*)?\d+(?:\s*(?:\/|sur|of|de)\s*\d+)?[-–—\s.]*$/i;

  function sansEnTetes(pages) {
    if (!pages || pages.length < 3) return pages || [];
    /* La zone est étroite, deux lignes en haut et deux en bas, et une page
       trop courte n'est pas touchée du tout : sur une page de cinq lignes,
       une zone large avalerait le contenu lui-même. Mesuré le 14 septembre
       2026 sur un document d'essai, où la première règle avait tout effacé. */
    var ZONE = 3, MIN_LIGNES = 8, MAX_LONG = 140;
    var compte = {};
    pages.forEach(function (p) {
      var L = String(p).split("\n");
      if (L.length < MIN_LIGNES) return;
      var vues = {};
      var bords = L.slice(0, ZONE).concat(L.slice(Math.max(ZONE, L.length - ZONE)));
      bords.forEach(function (l) {
        var e = empreinte(l);
        if (!e || e.length < 3 || e.length > MAX_LONG || vues[e]) return;
        vues[e] = true;
        compte[e] = (compte[e] || 0) + 1;
      });
    });
    var seuil = Math.max(3, Math.ceil(pages.length / 2));
    var retirees = 0;
    var out = pages.map(function (p) {
      var L = String(p).split("\n");
      if (L.length < MIN_LIGNES) return String(p);
      var garde = L.filter(function (l, i) {
        var bord = i < ZONE || i >= L.length - ZONE;
        if (!bord) return true;
        if (String(l).trim().length > MAX_LONG) return true;
        var e = empreinte(l);
        if (!e) return true;
        if (NUM_SEUL.test(l.trim())) { retirees++; return false; }
        if ((compte[e] || 0) >= seuil) { retirees++; return false; }
        return true;
      });
      return garde.join("\n").replace(/^\n+|\n+$/g, "");
    });
    sansEnTetes.derniereCoupe = retirees;
    return out;
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
        pages = sansEnTetes(pages);
        var t = pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
        /* PAS DE TEXTE : C'EST UN SCAN, ON LE LIT QUAND MÊME. Jusqu'au
           14 septembre 2026, l'application renvoyait ici l'utilisateur
           chercher ailleurs « la version d'origine ». C'était lui rendre son
           problème : la moitié des pièces d'un dossier social sont des scans.
           La reconnaissance de caractères prend le relais, dans le navigateur,
           sans que rien ne sorte du poste. */
        if (!t) {
          if (!window.LireOCR) throw new Error(
            "Ce PDF ne contient pas de texte : c'est un document scanné, une image, " +
            "et le module de reconnaissance n'est pas chargé sur cet écran.");
          return window.LireOCR.texte(fichier, {
            surProgres: options && options.surProgres,
            pages: (options && options.pages) || 20,
          }).then(function (t2) {
            if (options && options.surOCR) options.surOCR(t2);
            return t2;
          });
        }
        return t;
      });
    });
  }

  window.LirePdf = { texte: texte, charger: charger, sansEnTetes: sansEnTetes,
    estPdf: function (f) {
      return !!f && (/\.pdf$/i.test(f.name || "") || f.type === "application/pdf");
    } };
})(window);
