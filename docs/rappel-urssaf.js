/* Le rappel du contrôle URSSAF, à l'ouverture de l'accueil et à la connexion.
   Une bulle avec le compte à rebours et un accès direct au module. Elle ne
   s'affiche que pour TEC (ou là où la page la force), et disparaît après la
   période contradictoire. Tout se calcule sur le poste. */
"use strict";
(function () {

  var VISITE = new Date(2026, 10, 17, 9, 30);   // 17 novembre 2026, 9h30
  var FIN = new Date(2026, 11, 31, 23, 59);      // on cesse de rappeler fin décembre

  function digits(s) { return (s || "").replace(/\D/g, ""); }

  function estTec() {
    try {
      var p = JSON.parse(localStorage.getItem("profil-entreprise") || "null");
      if (!p) return false;
      if (digits(p.siret || p.siren || "").indexOf("538450479") === 0) return true;
      return /\bTEC\b/i.test(p.denomination || p.entreprise || "");
    } catch (e) { return false; }
  }

  function message(n) {
    if (n > 1) return "Contrôle URSSAF : plus que " + n + " jours (visite le 17 novembre 2026).";
    if (n === 1) return "Contrôle URSSAF : plus qu'un jour (visite le 17 novembre 2026).";
    if (n === 0) return "Contrôle URSSAF : la visite est aujourd'hui, 17 novembre 2026.";
    return "Contrôle URSSAF : la visite a eu lieu. La période contradictoire court.";
  }

  function style() {
    if (document.getElementById("ru-style")) return;
    var s = document.createElement("style"); s.id = "ru-style";
    s.textContent =
      ".rappel-urssaf-bulle{display:flex;align-items:center;gap:10px;max-width:980px;margin:8px auto;" +
      "padding:10px 14px;background:var(--ambre-clair,#fdf3e2);border:1px solid var(--ambre,#c0892d);" +
      "border-radius:11px;font:600 14px/1.35 system-ui;color:var(--ambre,#8a5a12)}" +
      ".rappel-urssaf-bulle .ru-t{flex:1}" +
      ".rappel-urssaf-bulle .ru-a{flex:none;text-decoration:none;background:var(--ambre,#c0892d);color:#fff;" +
      "padding:6px 12px;border-radius:8px;font-weight:600}" +
      ".rappel-urssaf-bulle .ru-x{flex:none;border:0;background:transparent;font-size:20px;line-height:1;" +
      "cursor:pointer;color:inherit;padding:0 4px}";
    document.head.appendChild(s);
  }

  function demarrer() {
    var mode = (document.body && document.body.getAttribute("data-rappel-urssaf")) || "";
    var force = mode !== "";          // la page force l'affichage (connexion)
    var avecLien = mode !== "texte";  // "texte" : le message seul, sans bouton
    if (!force && !estTec()) return;
    var now = new Date();
    if (now > FIN) return;
    var n = Math.ceil((VISITE - now) / (24 * 3600 * 1000));

    var hote = document.getElementById("rappel-urssaf");
    if (!hote) {
      hote = document.createElement("div"); hote.id = "rappel-urssaf";
      document.body.insertBefore(hote, document.body.firstChild);
    }
    hote.textContent = "";
    style();

    var b = document.createElement("div"); b.className = "rappel-urssaf-bulle";
    var t = document.createElement("span"); t.className = "ru-t"; t.textContent = message(n);
    b.appendChild(t);
    if (avecLien) {
      var a = document.createElement("a"); a.className = "ru-a"; a.href = "controle-urssaf.html"; a.textContent = "Préparer";
      b.appendChild(a);
    }
    var x = document.createElement("button"); x.type = "button"; x.className = "ru-x";
    x.setAttribute("aria-label", "Fermer"); x.textContent = "×";
    x.addEventListener("click", function () { hote.remove(); });
    b.appendChild(x);
    hote.appendChild(b);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})();
