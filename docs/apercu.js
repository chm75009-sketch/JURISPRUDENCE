/* L'APERÇU AVANT L'ENREGISTREMENT.

   POURQUOI CE FICHIER EXISTE

   Demande du 13 septembre 2026, sur un iPhone : « quand je clique sur
   télécharger, il l'enregistre directement dans le drive, sans le visionner,
   sans le voir. Je dois pouvoir l'ouvrir d'abord. » Safari ne montre rien :
   il dépose le fichier dans iCloud Drive, et il faut ressortir de
   l'application, ouvrir Fichiers, trouver le dossier, puis Word ou Excel pour
   savoir ce qu'on a téléchargé.

   Le fichier s'ouvre donc ici, dans la page, avant d'être enregistré : ce que
   le classeur ou le document contient, feuille par feuille, ligne par ligne,
   et deux boutons dessous, enregistrer ou fermer. Rien ne part sur le
   téléphone tant que l'on n'a pas vu.

   COMMENT LES MODULES S'EN SERVENT

   Un producteur de fichier (audit-export.js pour le Word, tableur-export.js
   pour le classeur, la page de la base de données pour le sien) appelle
   « poser » avec les octets qu'il vient d'écrire et le rendu lisible qui leur
   correspond. Au moment d'enregistrer, il demande « pour » : s'il y a un
   rendu, c'est l'aperçu qui s'ouvre, et l'enregistrement n'a lieu qu'au clic
   sur le bouton. Sans ce fichier, tout continue de fonctionner comme avant :
   chacun vérifie que window.Apercu existe.  */

(function (window) {
  "use strict";

  var doc = window.document;
  var MEM = (typeof WeakMap === "function") ? new WeakMap() : null;

  function ech(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* Le rendu est gardé sur les octets eux-mêmes : le producteur n'a rien à
     transporter jusqu'au bouton, et le rendu disparaît avec le fichier. */
  function poser(cle, rendu) {
    if (MEM && cle && typeof cle === "object") { try { MEM.set(cle, rendu); } catch (e) {} }
    return cle;
  }
  function pour(cle) {
    if (!MEM || !cle || typeof cle !== "object") return null;
    try { return MEM.get(cle) || null; } catch (e) { return null; }
  }

  /* Un tableau de lignes rendu en tableau, jamais en texte à chasse fixe :
     sur un téléphone, une colonne vide rejetée à la ligne rend la grille
     illisible. Le tableau défile dans son cadre, la page ne défile pas. */
  function tableHtml(lignes, tete) {
    if (!lignes || !lignes.length) return "";
    var h = '<div class="ap-tab"><table>';
    lignes.forEach(function (l, i) {
      var cel = (i === 0 && tete !== false) ? "th" : "td";
      h += "<tr>";
      (l || []).forEach(function (c) { h += "<" + cel + ">" + ech(c) + "</" + cel + ">"; });
      h += "</tr>";
    });
    return h + "</table></div>";
  }

  function style() {
    if (doc.getElementById("style-apercu")) return;
    var s = doc.createElement("style");
    s.id = "style-apercu";
    s.textContent = [
      /* L'aperçu est lui-même une fenêtre modale : il s'ouvre par-dessus le
         modèle du parcours, qui en est déjà une. Dans un dialogue modal, tout
         ce qui est hors de lui est inerte et ne reçoit plus les clics : posé
         dans la page, le bouton « Enregistrer » de l'aperçu ne répondait pas.
         Mesuré le 13 septembre 2026 sur le document unique. */
      "dialog.ap-fond{position:fixed;inset:0;width:100%;max-width:100%;height:100%;max-height:100%;",
      "  border:0;padding:0;margin:0;background:transparent;overflow:hidden;display:flex;",
      "  align-items:stretch;justify-content:center;z-index:9000}",
      "dialog.ap-fond::backdrop{background:rgba(16,19,23,.55)}",
      ".ap-fond{position:fixed;inset:0;background:rgba(16,19,23,.55);z-index:9000;display:flex;",
      "  align-items:stretch;justify-content:center;padding:0}",
      ".ap-boite{background:#fff;width:100%;max-width:820px;display:flex;flex-direction:column;",
      "  max-height:100%;box-shadow:0 10px 40px rgba(0,0,0,.3)}",
      ".ap-haut{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #dcdfe4;",
      "  background:#f6f7f9}",
      ".ap-haut b{font:600 16px system-ui;color:#1a1d21;flex:1;min-width:0;overflow:hidden;",
      "  text-overflow:ellipsis;white-space:nowrap}",
      ".ap-haut .ap-x{border:1px solid #dcdfe4;background:#fff;border-radius:10px;min-height:40px;",
      "  padding:0 14px;font:600 15px system-ui;cursor:pointer;color:#1a1d21}",
      ".ap-corps{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:16px 14px 24px;",
      "  font:16px/1.55 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1a1d21}",
      ".ap-corps h1{font-size:20px;margin:22px 0 8px;color:#1f3864}",
      ".ap-corps h2{font-size:18px;margin:18px 0 6px;color:#1f3864}",
      ".ap-corps h3{font-size:17px;margin:16px 0 6px;color:#1f3864}",
      ".ap-corps p{margin:0 0 10px}",
      ".ap-corps .ap-note{color:#5f6874;font-size:15px}",
      ".ap-corps .ap-sur{color:#5f6874;font-size:15px;margin-bottom:4px}",
      ".ap-corps ul{margin:0 0 10px;padding-left:20px}",
      ".ap-corps hr{border:0;border-top:1px solid #dcdfe4;margin:16px 0}",
      ".ap-corps .ap-feuille{font:600 16px system-ui;color:#1f3864;margin:20px 0 6px}",
      ".ap-tab{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 0 14px;border:1px solid #dcdfe4;",
      "  border-radius:8px}",
      ".ap-tab table{border-collapse:collapse;min-width:100%;font-size:15px}",
      ".ap-tab th,.ap-tab td{border-bottom:1px solid #eceef1;border-right:1px solid #eceef1;",
      "  padding:8px 10px;text-align:left;vertical-align:top;max-width:320px}",
      ".ap-tab th{background:#f6f7f9;font-weight:600;color:#1f3864;position:sticky;top:0}",
      ".ap-pied{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border-top:1px solid #dcdfe4;",
      "  background:#f6f7f9}",
      ".ap-pied button{min-height:48px;border-radius:10px;font:600 17px system-ui;cursor:pointer;width:100%}",
      ".ap-pied .ap-ok{background:#1f3864;color:#fff;border:2px solid #1f3864}",
      ".ap-pied .ap-non{background:#fff;color:#1f3864;border:2px solid #1f3864}",
      "@media (min-width:560px){.ap-fond,dialog.ap-fond{align-items:center;padding:24px}",
      "  .ap-boite{border-radius:14px;max-height:92vh}",
      "  .ap-pied{flex-direction:row-reverse}.ap-pied button{width:auto;padding:0 22px}}",
    ].join("\n");
    doc.head.appendChild(s);
  }

  /* La fenêtre. « Enregistrer » fait ce que le bouton faisait avant, et rien
     d'autre ne s'enregistre : fermer ne laisse aucun fichier derrière. */
  function montrer(rendu, nom, enregistrer) {
    if (!rendu) { if (enregistrer) enregistrer(); return; }
    style();
    var modale = typeof doc.createElement("dialog").showModal === "function";
    var fond = doc.createElement(modale ? "dialog" : "div");
    fond.className = "ap-fond";
    fond.innerHTML =
      '<div class="ap-boite" role="dialog" aria-modal="true" aria-label="Aperçu du fichier">' +
      '<div class="ap-haut"><b>' + ech(nom || rendu.titre || "Aperçu") + "</b>" +
      '<button type="button" class="ap-x">Fermer</button></div>' +
      '<div class="ap-corps">' + (rendu.html || "") + "</div>" +
      '<div class="ap-pied"><button type="button" class="ap-ok">Enregistrer le fichier</button>' +
      '<button type="button" class="ap-non">Fermer sans enregistrer</button></div></div>';
    function fermer() {
      if (modale && fond.open) { try { fond.close(); } catch (e) {} }
      if (fond.parentNode) fond.parentNode.removeChild(fond);
      doc.removeEventListener("keydown", touche, true);
      if (doc.body) doc.body.style.overflow = avant;
    }
    function touche(ev) { if (!modale && ev.key === "Escape") { ev.preventDefault(); fermer(); } }
    var avant = doc.body ? doc.body.style.overflow : "";
    if (doc.body) doc.body.style.overflow = "hidden";
    fond.querySelector(".ap-x").addEventListener("click", fermer);
    fond.querySelector(".ap-non").addEventListener("click", fermer);
    fond.querySelector(".ap-ok").addEventListener("click", function () {
      fermer();
      if (enregistrer) enregistrer();
    });
    fond.addEventListener("click", function (ev) { if (ev.target === fond) fermer(); });
    doc.addEventListener("keydown", touche, true);
    doc.body.appendChild(fond);
    if (modale) {
      /* Échap ferme le dialogue lui-même : on nettoie alors comme au bouton. */
      fond.addEventListener("cancel", function (ev) { ev.preventDefault(); fermer(); });
      try { fond.showModal(); } catch (e) {}
    }
    var c = fond.querySelector(".ap-corps");
    if (c) c.scrollTop = 0;
  }

  /* Le classeur : une feuille après l'autre, son nom puis son tableau. */
  function htmlFeuilles(feuilles) {
    return (feuilles || []).map(function (f) {
      return '<p class="ap-feuille">' + ech(f.titre || "Feuille") + " · " +
        ((f.lignes || []).length) + " ligne" + ((f.lignes || []).length > 1 ? "s" : "") + "</p>" +
        tableHtml(f.lignes);
    }).join("");
  }

  window.Apercu = {
    poser: poser, pour: pour, montrer: montrer,
    tableHtml: tableHtml, htmlFeuilles: htmlFeuilles, ech: ech,
  };
})(window);
