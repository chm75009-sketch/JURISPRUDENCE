/* LIRE UN PDF SCANNÉ : LA RECONNAISSANCE DE TEXTE.

   POURQUOI CE FICHIER EXISTE

   Le 14 septembre 2026, un document déposé a reçu cette réponse : « Ce PDF ne
   contient pas de texte : c'est un document scanné, une image. Déposez la
   version d'origine ou collez le texte. » Demande du même jour : « peux-tu
   faire le nécessaire pour régler ça définitivement ». Dire à quelqu'un
   d'aller chercher ailleurs la version d'origine, c'est lui rendre son
   problème : la moitié des pièces d'un dossier social sont des scans, un
   règlement intérieur signé, une lettre reçue, un registre imprimé puis
   photographié.

   CE QUE FAIT CE FICHIER

   Il lit l'image. Chaque page du PDF est rendue en image par pdf.js, puis
   déchiffrée par Tesseract, moteur de reconnaissance de caractères compilé en
   WebAssembly (Apache 2.0), déposé ici avec ses données françaises. Tout se
   passe dans le navigateur : aucune page, aucune image, aucun texte ne sort
   du poste, ce qui n'aurait pas été le cas d'un service en ligne.

   CE QU'IL FAUT EN ATTENDRE, ET CE QU'IL NE FAUT PAS

   La reconnaissance n'est pas la lecture d'un fichier texte : un scan net et
   droit se lit presque sans faute, un scan penché, taché ou photographié de
   travers rend un texte approximatif. Le texte obtenu est donc TOUJOURS
   rendu à l'utilisateur pour relecture avant contrôle, jamais utilisé en
   silence. C'est lent, aussi : quelques secondes par page sur un ordinateur,
   davantage sur un téléphone ; la progression s'affiche page par page.

   Les cinq mégaoctets du moteur ne se chargent qu'au premier scan déposé.  */

(function (window) {
  "use strict";
  var CHARGEMENT = null;

  function charger() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (CHARGEMENT) return CHARGEMENT;
    CHARGEMENT = new Promise(function (ok, non) {
      var s = document.createElement("script");
      s.src = "ocr/tesseract.min.js";
      s.onload = function () {
        if (!window.Tesseract) { non(new Error("Le moteur de reconnaissance ne s'est pas chargé.")); return; }
        ok(window.Tesseract);
      };
      s.onerror = function () { non(new Error("Le moteur de reconnaissance n'a pas pu être téléchargé.")); };
      document.head.appendChild(s);
    });
    return CHARGEMENT;
  }

  /* Une page de PDF rendue en image. La résolution compte : trop basse, les
     lettres se confondent ; trop haute, le téléphone peine. Deux fois la
     taille naturelle est le compromis retenu, avec un plafond en pixels pour
     ne pas dépasser ce qu'un canvas de téléphone accepte. */
  function pageEnImage(page, echelle) {
    var vue = page.getViewport({ scale: echelle || 2 });
    var max = 2400;
    if (vue.width > max || vue.height > max) {
      var k = max / Math.max(vue.width, vue.height);
      vue = page.getViewport({ scale: (echelle || 2) * k });
    }
    var toile = document.createElement("canvas");
    toile.width = Math.ceil(vue.width);
    toile.height = Math.ceil(vue.height);
    var ctx = toile.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, toile.width, toile.height);
    return page.render({ canvasContext: ctx, viewport: vue }).promise.then(function () { return toile; });
  }

  /* Le texte d'un PDF scanné, page après page. « surProgres » reçoit
     (page, total, étape) pour que l'écran dise où l'on en est : sans cela,
     l'utilisateur croit que rien ne se passe. */
  /* LE BANDEAU DE PROGRESSION. La reconnaissance prend des secondes par page :
     sans rien à l'écran, on croit que l'application a planté et on ferme.
     L'écran qui veut afficher la progression lui-même passe « surProgres » ;
     les autres, c'est-à-dire tous les écrans de dépôt existants, reçoivent ce
     bandeau sans avoir rien à changer. */
  var BANDEAU = null;
  function bandeau(texte, fini) {
    if (!BANDEAU) {
      BANDEAU = document.createElement("div");
      BANDEAU.setAttribute("role", "status");
      BANDEAU.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:9500;" +
        "background:#1f3864;color:#fff;border-radius:12px;padding:14px 16px;" +
        "font:600 15px/1.4 system-ui;box-shadow:0 8px 24px rgba(0,0,0,.25);text-align:center";
      document.body.appendChild(BANDEAU);
    }
    BANDEAU.textContent = texte;
    if (fini) {
      var b = BANDEAU; BANDEAU = null;
      setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 1800);
    }
  }

  function texte(fichier, options) {
    var o = options || {};
    var dire = o.surProgres || function (p, n, etape) {
      bandeau("Document scanné : lecture de l'image. " + etape + ".",
        etape === "Terminé");
    };
    var maxPages = o.pages || 20;
    var T = null, ouvrier = null, doc = null;

    dire(0, 0, "Chargement du moteur de reconnaissance");
    return charger().then(function (Tesseract) {
      T = Tesseract;
      if (!window.LirePdf) throw new Error("Le lecteur de PDF n'est pas chargé.");
      return window.LirePdf.charger();
    }).then(function (pdfjsLib) {
      return fichier.arrayBuffer().then(function (buf) {
        return pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
      });
    }).then(function (d) {
      doc = d;
      dire(0, doc.numPages, "Préparation");
      return T.createWorker("fra", 1, {
        workerPath: "ocr/worker.min.js",
        corePath: "ocr/tesseract-core-simd.wasm.js",
        langPath: "ocr",
        gzip: true,
      });
    }).then(function (w) {
      ouvrier = w;
      var n = Math.min(doc.numPages, maxPages);
      var suite = Promise.resolve([]);
      for (var i = 1; i <= n; i++) {
        (function (p) {
          suite = suite.then(function (acc) {
            dire(p, n, "Lecture de la page " + p + " sur " + n);
            return doc.getPage(p)
              .then(function (page) { return pageEnImage(page, 2); })
              .then(function (toile) { return ouvrier.recognize(toile); })
              .then(function (r) {
                acc.push(((r && r.data && r.data.text) || "").replace(/[ \t]+\n/g, "\n").trim());
                return acc;
              });
          });
        })(i);
      }
      return suite;
    }).then(function (pages) {
      if (ouvrier) ouvrier.terminate();
      var t = pages.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
      dire(pages.length, pages.length, "Terminé");
      if (!t) throw new Error("La reconnaissance n'a rien pu lire sur ce document : " +
        "l'image est peut-être trop pâle, de travers ou de trop faible résolution.");
      return t;
    }).catch(function (e) {
      if (ouvrier) { try { ouvrier.terminate(); } catch (x) {} }
      throw e;
    });
  }

  window.LireOCR = { texte: texte, charger: charger };
})(window);
