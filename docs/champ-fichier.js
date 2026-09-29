/* LE BOUTON DE DÉPÔT, EN FRANÇAIS ET MIS EN FORME.

   Un « input type=file » laissé nu rend ce que le navigateur veut bien : sur
   Chrome, « Choose File / No file chosen », en anglais, dans une police qui
   n'est celle d'aucun autre bouton de l'application. Relevé le 29 septembre
   2026 sur le contrôle du document unique, et présent au même endroit sur les
   photos de l'équipe, l'import de la flotte, celui des heures et les pièces
   jointes d'une question.

   Trois pages le faisaient déjà bien, à la main : le champ caché derrière une
   étiquette qui porte le libellé. Ce fichier le fait partout, une fois pour
   toutes, et ajoute ce que les trois n'avaient pas, le nom du fichier choisi.

   Deux cas, et la différence compte. Quand le champ est déjà dans une
   étiquette, l'étiquette ouvre le sélecteur toute seule : on ne pose aucun
   écouteur, sans quoi la fenêtre s'ouvrirait deux fois. Sinon, c'est notre
   propre bouton qui l'ouvre.

   Les champs ajoutés après coup, comme la photo d'un affichage, passent par
   l'observateur du bas : il rappelle la même fonction sur ce qui arrive. */
(function (w, d) {
  "use strict";

  function estImage(e) {
    return /image\//.test(e.getAttribute("accept") || "");
  }
  function libelle(e) {
    if (e.multiple) return estImage(e) ? "Choisir des photos" : "Choisir des fichiers";
    return estImage(e) ? "Choisir une photo" : "Choisir un fichier";
  }
  function vide(e) {
    return e.multiple ? "Aucun fichier choisi" : "Aucun fichier choisi";
  }
  function nomDes(e) {
    var f = e.files;
    if (!f || !f.length) return vide(e);
    if (f.length === 1) return f[0].name;
    return f.length + " fichiers choisis";
  }

  function habiller(e) {
    if (!e || e.dataset.habille === "1") return;
    /* Le champ que la page cache déjà porte son propre libellé : on n'y
       touche pas, elle a fait le travail. */
    var style = e.getAttribute("style") || "";
    if (e.hidden || /display\s*:\s*none/.test(style)) { e.dataset.habille = "1"; return; }

    e.dataset.habille = "1";
    var etiquette = e.closest ? e.closest("label") : null;

    var cadre = d.createElement("span");
    cadre.className = "champ-fichier";
    var bouton = d.createElement(etiquette ? "span" : "button");
    if (!etiquette) bouton.type = "button";
    bouton.className = "cf-bouton";
    bouton.textContent = libelle(e);
    var nom = d.createElement("span");
    nom.className = "cf-nom";
    nom.textContent = vide(e);
    cadre.appendChild(bouton);
    cadre.appendChild(nom);

    e.parentNode.insertBefore(cadre, e);
    e.style.display = "none";

    if (!etiquette) bouton.addEventListener("click", function () { e.click(); });
    e.addEventListener("change", function () { nom.textContent = nomDes(e); });
  }

  function appliquer(racine) {
    var r = racine || d;
    if (!r.querySelectorAll) return;
    Array.prototype.forEach.call(r.querySelectorAll('input[type="file"]'), habiller);
  }

  function demarrer() {
    appliquer(d);
    if (!w.MutationObserver) return;
    new w.MutationObserver(function (lots) {
      lots.forEach(function (l) {
        Array.prototype.forEach.call(l.addedNodes, function (n) {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches('input[type="file"]')) habiller(n);
          else appliquer(n);
        });
      });
    }).observe(d.documentElement, { childList: true, subtree: true });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

  w.ChampFichier = { appliquer: appliquer };
})(window, document);
