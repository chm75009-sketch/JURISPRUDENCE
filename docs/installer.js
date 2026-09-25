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
      return "Dans Edge : les trois points en haut à droite, puis « Applications », " +
        "puis « Installer ce site en tant qu'application ».";
    }
    if (firefox) {
      return "Firefox n'installe pas les applications web sur ordinateur. Ouvrez cette " +
        "adresse dans Chrome ou Edge pour l'installer, ou gardez-la en favori.";
    }
    if (safari) {
      return "Dans Safari : menu Fichier, puis « Ajouter au Dock ».";
    }
    return "Dans Chrome : les trois points en haut à droite, « Enregistrer et partager », " +
      "puis « Installer la page en tant qu'application ». Sur Android, « Installer " +
      "l'application » apparaît directement dans le menu.";
  }

  function dire(b, texte) {
    var p = b.parentNode.querySelector(".installer-mot");
    if (!p) {
      p = document.createElement("p");
      p.className = "installer-mot";
      p.style.cssText = "margin:8px 0 0;font-size:14.5px;line-height:1.5;color:#5f6874";
      b.parentNode.insertBefore(p, b.nextSibling);
    }
    p.textContent = texte;
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
