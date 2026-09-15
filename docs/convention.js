/* LA CONVENTION COLLECTIVE, RAPPELÉE ET TENUE À JOUR.

   POURQUOI CE FICHIER EXISTE

   Demande du 15 septembre 2026 : « dans chaque secteur il faut mettre la
   convention collective et demander à ce qu'elle soit mise à jour ».

   La convention est saisie une fois sur la fiche d'entreprise, puis elle
   disparaît de la vue. Or c'est elle qui commande une bonne part de ce que
   l'application écrit : classification, minima, préavis, période d'essai,
   majorations, indemnités. Et elle bouge : un avenant de classification, un
   avenant de salaires, et le contrat rédigé l'an dernier ne dit plus le droit.

   Rien, dans l'application, ne pouvait dire quand elle avait été regardée
   pour la dernière fois.

   CE QUE CE BLOC FAIT

   Il rappelle, sur les écrans qui travaillent par secteur, quelle convention
   la fiche désigne, depuis quand elle n'a pas été vérifiée, et il propose de
   noter la vérification du jour et le dernier avenant connu. Passé douze
   mois, il le dit en clair.

   CE QU'IL NE FAIT PAS

   Il ne va pas chercher la convention : le relais Légifrance de l'application
   ne sert que le code du travail. Il ne dit donc jamais qu'une convention est
   à jour ou ne l'est pas : il dit quand vous l'avez regardée, et vous laisse
   la regarder.

   USAGE

     Convention.poser(element)     pose le bloc dans cet élément
     Convention.suivi()            { convention, verifiee, avenant, vieille }

   Tout reste sur le poste.                                                  */

"use strict";
(function (window) {

  var CLE = "convention-suivi";
  var MOIS_ALERTE = 12;

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];
  function enFrancais(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
    if (!m) return "";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function aujourdhui() { return new Date().toISOString().slice(0, 10); }
  function moisEcoules(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    var n = new Date();
    return (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth());
  }

  function lire() {
    try { return JSON.parse(window.localStorage.getItem(CLE) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function garder(o) {
    try { window.localStorage.setItem(CLE, JSON.stringify(o)); } catch (e) {}
  }

  function profil() {
    var p = null;
    try { p = JSON.parse(window.localStorage.getItem("profil-entreprise") || "null"); } catch (e) {}
    if ((!p || !p.denomination) && window.Profil && window.Profil.lire) p = window.Profil.lire();
    return p || {};
  }

  function suivi() {
    var p = profil(), s = lire();
    var conv = String(p.conventionCollective || p.convention || p.idcc || "").trim();
    var m = conv ? moisEcoules(s.verifiee) : null;
    return {
      convention: conv,
      secteur: String(p.secteur || ""),
      verifiee: s.verifiee || "",
      avenant: s.avenant || "",
      /* Jamais vérifiée compte comme vieille : c'est le cas le plus fréquent
         et le plus risqué. */
      vieille: !s.verifiee || (m !== null && m >= MOIS_ALERTE),
      mois: m,
    };
  }

  var STYLE = "conv-style";
  function poserStyle(doc) {
    if (doc.getElementById(STYLE)) return;
    var st = doc.createElement("style");
    st.id = STYLE;
    st.textContent = [
      ".conv{margin:var(--e4) 0 0;border:1px solid var(--filet);border-radius:12px;",
      "  background:var(--surface);padding:14px 16px}",
      ".conv.alerte{border-color:var(--ambre);background:var(--ambre-clair)}",
      ".conv .et{font:600 12px/1 system-ui;text-transform:uppercase;letter-spacing:.05em;",
      "  color:var(--texte-3);display:block}",
      ".conv .v{font:600 16px/1.45 system-ui;color:var(--encre);margin:6px 0 0;display:block}",
      ".conv .q{font:400 14px/1.5 system-ui;color:var(--texte-2);margin:6px 0 0;display:block}",
      ".conv.alerte .q{color:var(--ambre)}",
      /* Classe propre au bloc : « champs » existe ailleurs dans la feuille
         commune, en deux colonnes, et écrasait celle-ci au téléphone. */
      ".conv .maj{display:grid;grid-template-columns:1fr;gap:8px;margin:12px 0 0}",
      "@media (min-width:560px){.conv .maj{grid-template-columns:1fr auto}}",
      ".conv input{font-size:16px;padding:10px 12px;min-height:44px;width:100%;box-sizing:border-box;",
      "  border-radius:10px;border:1px solid var(--filet-2);background:var(--surface);color:var(--encre)}",
      ".conv button{min-height:44px;border-radius:10px;font:600 15px system-ui;cursor:pointer;",
      "  padding:0 16px;background:var(--accent);color:#fff;border:2px solid var(--accent);white-space:nowrap}",
      ".conv a{color:var(--accent)}",
    ].join("");
    doc.head.appendChild(st);
  }

  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function html(s) {
    if (!s.convention) {
      return '<div class="conv alerte"><span class="et">Convention collective</span>' +
        '<span class="v">Aucune convention n\'est indiquée sur votre fiche</span>' +
        '<span class="q">C\'est elle qui commande la classification, les minima, le préavis ' +
        'et la période d\'essai. <a href="index.html">Complétez la fiche d\'entreprise</a>.</span></div>';
    }
    var quand = s.verifiee
      ? "Vérifiée le " + enFrancais(s.verifiee) +
        (s.mois !== null && s.mois >= 1 ? ", il y a " + s.mois + " mois" : "")
      : "Jamais vérifiée depuis ce poste";
    var av = s.avenant ? " Dernier avenant noté : " + ech(s.avenant) + "." : "";
    var dit = s.vieille
      ? "Une convention se modifie par avenants, et ses minima changent : regardez si un " +
        "avenant est paru depuis, et notez-le ici."
      : "Pensez à revenir ici dès qu'un avenant paraît.";
    return '<div class="conv' + (s.vieille ? " alerte" : "") + '">' +
      '<span class="et">Convention collective appliquée</span>' +
      '<span class="v">' + ech(s.convention) + "</span>" +
      '<span class="q">' + ech(quand) + "." + av + " " + ech(dit) + "</span>" +
      '<div class="maj">' +
      '<input type="text" id="conv-avenant" placeholder="dernier avenant connu : numéro et date" value="' +
      ech(s.avenant) + '">' +
      '<button type="button" id="conv-ok">Je viens de la vérifier</button>' +
      "</div></div>";
  }

  function poser(el) {
    if (!el) return;
    var doc = el.ownerDocument || window.document;
    poserStyle(doc);
    function rendre() {
      var s = suivi();
      el.innerHTML = html(s);
      var b = doc.getElementById("conv-ok");
      var i = doc.getElementById("conv-avenant");
      if (i) i.addEventListener("input", function () {
        var o = lire(); o.avenant = i.value; garder(o);
      });
      if (b) b.addEventListener("click", function () {
        var o = lire();
        o.verifiee = aujourdhui();
        if (i) o.avenant = i.value;
        garder(o);
        rendre();
      });
    }
    rendre();
  }

  window.Convention = { poser: poser, suivi: suivi };
})(window);
