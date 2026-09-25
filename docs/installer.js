/* INSTALLER L'APPLICATION, DEPUIS L'APPLICATION.

   POURQUOI CE FICHIER EXISTE

   Demande du 25 septembre 2026 : « règle-moi ça, sur l'application un bouton
   pour l'installer sur PC ou téléphone ». Jusqu'ici il fallait chercher dans
   le menu du navigateur, et l'entrée n'est ni au même endroit ni sous le même
   nom selon Chrome, Edge, Firefox ou Safari. Sur un iPhone, elle n'existe même
   pas : l'installation passe par le bouton Partager.

   CE QU'IL FAIT

   Un bouton, qui fait ce qu'il peut faire là où il est :

   - Chrome, Edge et les navigateurs Android posent l'invite d'installation du
     système. Un clic, et c'est installé.
   - Safari sur iPhone et iPad n'a pas cette invite : le bouton explique le
     geste, Partager puis « Sur l'écran d'accueil », en deux lignes.
   - Firefox et les autres : le bouton dit où trouver l'entrée du menu.
   - Quand l'application est déjà installée, ou qu'on la regarde depuis sa
     fenêtre installée, le bouton disparaît.

   COMMENT LE POSER SUR UNE PAGE

   Charger ce fichier, et mettre où l'on veut :

       <button type="button" id="installer-app">Installer l'application</button>

   S'il n'y a pas de bouton dans la page, le script n'écrit rien. La barre du
   haut en pose un dans son menu, sur toutes les pages.                     */

"use strict";
(function (window, document) {

  var invite = null;      /* l'événement du navigateur, s'il vient */
  var BOUTONS = [];

  function estInstallee() {
    try {
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) return true;
      if (window.navigator && window.navigator.standalone) return true;  /* iOS */
    } catch (e) {}
    return false;
  }

  var ua = String(window.navigator.userAgent || "");
  var iOS = /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1);
  var safari = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
  var edge = /Edg\//.test(ua);
  var firefox = /Firefox/.test(ua);

  /* Ce qu'il faut dire quand le navigateur ne pose pas l'invite lui-même. */
  function marcheASuivre() {
    if (iOS) {
      return "Sur iPhone et iPad : touchez le bouton Partager, en bas de l'écran, " +
        "puis « Sur l'écran d'accueil ». L'application s'installe avec son icône.";
    }
    if (edge) {
      /* Chemin donné par la documentation de Microsoft, lue le 25 septembre
         2026 : l'icône « Application disponible » dans la barre d'adresse,
         et la liste des applications sous « Plus d'outils ». */
      return "Dans Edge : l'icône « Application disponible » apparaît à droite de " +
        "l'adresse, cliquez dessus puis sur Installer. Si elle n'y est pas, " +
        "les trois points en haut à droite, « Plus d'outils », puis « Applications ».";
    }
    if (firefox) {
      return "Firefox n'installe pas les applications web sur ordinateur. Ouvrez cette " +
        "adresse dans Edge : l'icône « Application disponible » apparaît à droite de " +
        "l'adresse, un clic et c'est installé.";
    }
    if (safari) {
      return "Dans Safari : menu Fichier, puis « Ajouter au Dock ».";
    }
    return "Dans Chrome : les trois points en haut à droite, « Enregistrer et partager », " +
      "puis « Installer la page en tant qu'application ». Sur Android, « Installer " +
      "l'application » apparaît directement dans le menu.";
  }

  /* OÙ LE MOT SE POSE.

     Sur l'accueil, les cinq boutons sont en ligne au-dessus de 700 pixels.
     Un paragraphe glissé au milieu d'eux devient une sixième colonne de deux
     centimètres, et la phrase sort de l'écran, coupée au milieu des mots :
     mesuré le 25 septembre 2026, sur la capture envoyée depuis Firefox.

     La règle est donc celle-ci : si le bouton est dans une rangée, le mot se
     met sous la rangée entière, pas à côté du bouton. Ailleurs, dans le menu
     par exemple, il se met simplement sous le bouton.                       */
  function rangee(b) {
    var h = b.parentNode;
    if (!h || !h.parentNode || !window.getComputedStyle) return null;
    var s = window.getComputedStyle(h);
    var d = String(s.display || "");
    /* Une colonne n'est pas une rangée : le menu est un empilement vertical,
       et un mot posé après lui sortirait du panneau, sur la page du dessous.
       Mesuré le 25 septembre 2026. */
    if (d === "flex" || d === "inline-flex") {
      return /^row/.test(String(s.flexDirection || "row")) ? h : null;
    }
    if (d === "grid" || d === "inline-grid") {
      return String(s.gridTemplateColumns || "").split(/\s+/).length > 1 ? h : null;
    }
    return null;
  }

  function dire(b, texte) {
    var p = b.__mot;
    if (!p || !p.parentNode) {
      p = document.createElement("p");
      p.className = "installer-mot";
      p.style.cssText = "box-sizing:border-box;max-width:100%;" +
        "margin:12px 0 0;padding:13px 15px;border-radius:10px;background:#eef1f6;" +
        "border-left:3px solid #1f3a68;font:400 15px/1.55 system-ui;color:#3d4757;" +
        "text-align:left";
      var r = rangee(b);
      if (r) r.parentNode.insertBefore(p, r.nextSibling);
      else b.parentNode.insertBefore(p, b.nextSibling);
      b.__mot = p;
    }
    p.textContent = texte;
    if (p.scrollIntoView) { try { p.scrollIntoView({ block: "nearest" }); } catch (e) {} }
  }

  function cliquer(ev) {
    var b = ev.currentTarget;
    if (invite) {
      invite.prompt();
      invite.userChoice.then(function (r) {
        if (r && r.outcome === "accepted") {
          cacher();
        } else {
          dire(b, "Installation refusée. Le bouton reste là si vous changez d'avis.");
        }
        invite = null;
      }).catch(function () { invite = null; });
      return;
    }
    dire(b, marcheASuivre());
  }

  function cacher() {
    BOUTONS.forEach(function (b) { b.style.display = "none"; });
  }

  function brancher() {
    var L = document.querySelectorAll("#installer-app, .installer-app");
    if (!L.length) return;
    BOUTONS = Array.prototype.slice.call(L);
    if (estInstallee()) { cacher(); return; }
    BOUTONS.forEach(function (b) {
      if (b.getAttribute("data-installer")) return;
      b.setAttribute("data-installer", "1");
      b.addEventListener("click", cliquer);
    });
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    invite = e;
    brancher();
  });

  window.addEventListener("appinstalled", function () { cacher(); });

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", brancher);
  else brancher();

  window.Installer = { brancher: brancher, possible: function () { return !!invite; } };

})(window, document);
