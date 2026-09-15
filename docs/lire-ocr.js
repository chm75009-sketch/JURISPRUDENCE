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
  /* UNE PAGE À L'ENVERS SE LIT À L'ENVERS. Relevé le 14 septembre 2026 sur un
     document unique de quarante-quatre pages : plusieurs pages avaient été
     numérisées retournées, et la reconnaissance en a tiré « pans 72 ofeq
     LE6P' LE TT 90 », c'est-à-dire le pied de page lu à l'envers, recopié tel
     quel dans la version corrigée.

     Le moteur ne redresse pas tout seul. On mesure donc sa confiance : en
     dessous du seuil, la page est retournée de cent quatre-vingts degrés et
     relue, et le meilleur des deux l'emporte. Une page en largeur, souvent un
     tableau scanné de travers, est en outre essayée à quatre-vingt-dix et à
     deux cent soixante-dix degrés. */
  function tourner(toile, angle) {
    if (!angle) return toile;
    var t2 = document.createElement("canvas");
    var droit = angle === 90 || angle === 270;
    t2.width = droit ? toile.height : toile.width;
    t2.height = droit ? toile.width : toile.height;
    var c = t2.getContext("2d");
    c.fillStyle = "#fff"; c.fillRect(0, 0, t2.width, t2.height);
    c.translate(t2.width / 2, t2.height / 2);
    c.rotate(angle * Math.PI / 180);
    c.drawImage(toile, -toile.width / 2, -toile.height / 2);
    return t2;
  }

  var SEUIL_CONFIANCE = 70;
  function resultat(r) {
    var d = (r && r.data) || {};
    return { texte: d.text || "", conf: d.confidence || 0, data: d };
  }
  function lirePage(ouvrier, toile) {
    return ouvrier.recognize(toile).then(function (r) {
      var best = resultat(r);
      if (best.conf >= SEUIL_CONFIANCE) return best;
      /* Les quatre-vingt-dix degrés n'étaient essayés que sur une page plus
         large que haute. Or un tableau en largeur s'imprime couramment sur
         une page en hauteur, texte tourné d'un quart de tour : c'est le cas
         du registre du personnel imprimé depuis un téléphone, mesuré le
         15 septembre 2026, où l'image est parfaitement lisible mais couchée.
         Les trois rotations sont donc essayées dans tous les cas, et
         seulement quand la confiance est basse. */
      var angles = [180, 90, 270];
      var suite = Promise.resolve(best);
      angles.forEach(function (a) {
        suite = suite.then(function (courant) {
          if (courant.conf >= SEUIL_CONFIANCE) return courant;
          return ouvrier.recognize(tourner(toile, a)).then(function (r2) {
            var autre = resultat(r2);
            return autre.conf > courant.conf ? autre : courant;
          });
        });
      });
      return suite;
    });
  }

  function pageEnImage(page, echelle, maxi) {
    var vue = page.getViewport({ scale: echelle || 2 });
    var max = maxi || 2400;
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
              .then(function (toile) { return lirePage(ouvrier, toile); })
              .then(function (r) {
                acc.push(String(r.texte || "").replace(/[ \t]+\n/g, "\n").trim());
                return acc;
              });
          });
        })(i);
      }
      return suite;
    }).then(function (pages) {
      if (ouvrier) ouvrier.terminate();
      /* Les en-têtes et pieds de page se retirent ici aussi : un scan porte
         les mêmes mentions répétées que l'original. */
      if (window.LirePdf && window.LirePdf.sansEnTetes) pages = window.LirePdf.sansEnTetes(pages);
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


  /* LES MOTS AVEC LEUR PLACE, POUR REBÂTIR UN TABLEAU.

     La reconnaissance ne rend pas qu'un texte : elle rend chaque mot avec sa
     boîte. Un registre du personnel lu en image redevient donc un tableau,
     colonne par colonne, exactement comme un PDF dont la couche texte est
     bonne. Sans cela, l'utilisateur récupérait un paragraphe et devait tout
     retaper. Demande du 15 septembre 2026.

     Les ordonnées sont renvoyées à l'endroit des PDF, croissantes vers le
     haut, pour que le même code de mise en colonnes serve aux deux sources.  */
  function mots(fichier, options) {
    var o = options || {};
    var dire = o.surProgres || function (p, n, etape) {
      bandeau("Document scanné : lecture de l'image. " + etape + ".", etape === "Terminé");
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
              .then(function (page) { return pageEnImage(page, 3, 3600); })
              .then(function (toile) { return lirePage(ouvrier, toile); })
              .then(function (r) {
                /* UNE SECONDE PASSE, PLUS FINE. Mesuré le 15 septembre 2026
                   sur un registre de quatre-vingt-cinq salariés imprimé en
                   PDF : le tableau, en largeur sur une page en hauteur, y est
                   écrit petit. À la définition ordinaire, le moteur rendait
                   « Line cannot be recognized » sur la plupart des lignes et
                   ne ramenait qu'une poignée de mots. On recommence la page
                   en plus grand quand la moisson est maigre, et seulement
                   dans ce cas : c'est long, et inutile ailleurs. */
                var assez = ((r.data && r.data.words) || []).length >= 60;
                if (assez) return r;
                dire(p, n, "Lecture fine de la page " + p + " sur " + n);
                return doc.getPage(p)
                  .then(function (page) { return pageEnImage(page, 5, 5200); })
                  .then(function (grande) { return lirePage(ouvrier, grande); })
                  .then(function (r2) {
                    var a = ((r.data && r.data.words) || []).length;
                    var b2 = ((r2.data && r2.data.words) || []).length;
                    return b2 > a ? r2 : r;
                  });
              })
              .then(function (r) {
                var W = (r.data && r.data.words) || [];
                acc.push(W.filter(function (m) {
                  return m && m.text && m.text.trim() && (m.confidence == null || m.confidence > 30);
                }).map(function (m) {
                  var b = m.bbox || {};
                  return { s: String(m.text).trim(), x: b.x0 || 0, y: -(b.y0 || 0),
                    h: Math.max(1, (b.y1 || 0) - (b.y0 || 0)) };
                }));
                return acc;
              });
          });
        })(i);
      }
      return suite;
    }).then(function (pages) {
      if (ouvrier) ouvrier.terminate();
      dire(pages.length, pages.length, "Terminé");
      var total = pages.reduce(function (n, p) { return n + p.length; }, 0);
      if (!total) throw new Error("La reconnaissance n'a rien pu lire sur ce document : " +
        "l'image est peut-être trop pâle, de travers ou de trop faible résolution.");
      return pages;
    }).catch(function (e) {
      if (ouvrier) { try { ouvrier.terminate(); } catch (x) {} }
      dire(0, 0, "Terminé");
      throw e;
    });
  }

  window.LireOCR = { texte: texte, mots: mots, charger: charger };
})(window);
