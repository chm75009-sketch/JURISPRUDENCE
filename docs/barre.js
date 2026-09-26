/* LA BARRE DU HAUT : RETOUR, MENU, QUITTER.

   POURQUOI CE FICHIER EXISTE

   Demande du 24 septembre 2026 : « retour en arrière à chaque étape. À chaque
   étape, et le bouton menu », et, la question d'avant, le bouton pour se
   déconnecter.

   L'application avait un retour posé par droits.js sur les pages qui le
   chargent, un lien « Accueil » sur celles qui ne le chargent pas, et rien du
   tout pour passer d'un module à l'autre : il fallait remonter à l'accueil,
   puis redescendre. Quant à quitter, cela n'existait pas.

   CE QU'IL FAIT

   - Il pose un bouton « Retour » là où il n'y en a pas, quelle que soit la
     charpente de la page (le bandeau « header.site » des pages d'audit, la
     rangée « .haut » des pages de gestion).
   - Il pose un bouton « Menu » partout, qui ouvre la liste des modules.
   - Il pose « Quitter » dans ce menu, mais seulement là où il y a une séance à
     quitter, c'est-à-dire sur l'espace d'un client, derrière son mot de passe.
     Sur l'application ouverte, il n'y a rien à quitter et le bouton ne paraît
     pas.

   LE RETOUR À CHAQUE ÉTAPE

   Une page qui avance par écrans successifs sait seule ce qu'est l'écran
   précédent. Elle le dit :

       Barre.avant(function () {
         if (surLEcranDeuxieme) { montrerPremier(); return true; }
         return false;                 // plus d'étape : on quitte la page
       });

   Tant que la fonction rend « true », le bouton reste dans la page et remonte
   les étapes une à une. Quand elle rend « false », le bouton fait ce qu'il a
   toujours fait : l'écran précédent du navigateur si l'on vient de
   l'application, l'accueil sinon.                                          */

"use strict";
(function (window, document) {

  var MODULES = [
    { page: "index.html", nom: "Accueil" },
    { page: "auditer.html", nom: "Audit et conformité" },
    { page: "gerer.html", nom: "Gestion du quotidien" },
    { page: "registre.html", nom: "Registre du personnel" },
    { page: "courriers.html", nom: "Courriers et e-mails" },
    { page: "notes-service.html", nom: "Notes de service" },
    { page: "contrats-transport.html", nom: "Contrats du transport" },
    { page: "heures.html", nom: "Décompte des heures" },
    { page: "forfait.html", nom: "Forfait en jours" },
    { page: "flotte.html", nom: "Flotte et conducteurs" },
    { page: "agenda.html", nom: "Agenda social" },
    { page: "mes-documents.html", nom: "Mes documents" },
    { page: "questions.html", nom: "Mes questions" },
    { page: "recherche.html", nom: "Recherche de jurisprudence" },
  ];

  var AVANT = null;
  var page = location.pathname.split("/").pop() || "index.html";

  function $(s, r) { return (r || document).querySelector(s); }

  /* ─────────────────────────── le retour ────────────────────────────── */
  function interne() {
    try { return !!document.referrer && new URL(document.referrer).origin === location.origin; }
    catch (e) { return false; }
  }

  function retourner(ev) {
    if (AVANT) {
      var reste = false;
      try { reste = AVANT() === true; } catch (e) { reste = false; }
      if (reste) { if (ev) ev.preventDefault(); return; }
    }
    if (interne() && history.length > 1) {
      if (ev) ev.preventDefault();
      history.back();
      return;
    }
    if (ev && ev.currentTarget && ev.currentTarget.getAttribute &&
        ev.currentTarget.getAttribute("href")) return;   /* le lien fait le reste */
    if (ev) ev.preventDefault();
    location.href = "index.html";
  }

  /* ──────────────────────────── le menu ─────────────────────────────── */
  function seance() {
    try { return window.sessionStorage.getItem("seance-ouverte") === "oui"; }
    catch (e) { return false; }
  }

  function fermer() {
    var p = $("#barre-menu");
    if (p) p.remove();
    document.documentElement.style.overflow = "";
  }

  function ouvrir() {
    if ($("#barre-menu")) { fermer(); return; }
    var p = document.createElement("div");
    p.id = "barre-menu";
    var h = '<div class="fond" data-fermer="1"></div><nav class="feuille" aria-label="Menu">' +
      '<div class="tete"><b>Menu</b>' +
      '<button type="button" class="x" data-fermer="1" aria-label="Fermer">Fermer</button></div><ul>';
    MODULES.forEach(function (m) {
      var ici = m.page === page ? ' class="ici" aria-current="page"' : "";
      h += '<li><a href="' + m.page + '"' + ici + '>' + m.nom + "</a></li>";
    });
    h += "</ul>";
    /* L'installation, à portée de doigt : demandé le 25 septembre 2026, « un
       bouton pour l'installer sur PC ou téléphone ». Le détail de ce qu'il
       fait selon le navigateur est dans installer.js. */
    h += '<button type="button" class="installer-app" id="barre-installer">' +
      "Installer l'application</button>";
    /* QUITTER, ET CHANGER SON CODE.

       Deux défauts, relevés le 26 septembre 2026. Le bouton « Quitter »
       renvoyait à « entrer.html », une page qui n'a jamais existé dans ce
       dépôt : le menu conduisait à une erreur. Et un utilisateur connecté ne
       pouvait pas changer son propre code : seul un administrateur le
       pouvait pour lui, ce qui oblige à confier son code à quelqu'un pour en
       changer.

       Le bouton ne s'affiche donc que s'il y a une séance à fermer, c'est-à-
       dire un utilisateur connecté, et il ferme cette séance-là. */
    var u = utilisateurConnecte();
    if (u) {
      h += '<button type="button" class="installer-app" id="barre-moncode">' +
        "Changer mon code d'accès</button>";
      h += '<button type="button" class="quitter" id="barre-quitter">Se déconnecter</button>' +
        '<p class="apres">Vous êtes connecté comme <b>' + ech(u.nom) + "</b>. " +
        "Le code d'accès sera redemandé à la prochaine ouverture. " +
        "Rien de ce qui est sur cet appareil n'est effacé.</p>";
    } else if (seance()) {
      h += '<button type="button" class="quitter" id="barre-quitter">Quitter</button>' +
        '<p class="apres">La séance se referme. ' +
        "Rien de ce qui est sur cet appareil n'est effacé.</p>";
    }
    h += "</nav>";
    p.innerHTML = h;
    document.body.appendChild(p);
    document.documentElement.style.overflow = "hidden";
    p.addEventListener("click", function (ev) {
      if (ev.target.getAttribute && ev.target.getAttribute("data-fermer")) fermer();
    });
    var q = $("#barre-quitter");
    if (q) q.addEventListener("click", quitter);
    var mc = $("#barre-moncode");
    if (mc) mc.addEventListener("click", changerMonCode);
    if (window.Installer) window.Installer.brancher();
  }

  function ech(x) {
    return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function utilisateurConnecte() {
    try {
      return (window.Droits && window.Droits.utilisateur && window.Droits.utilisateur()) || null;
    } catch (e) { return null; }
  }

  /* QUITTER. La séance se referme. Ce qui est sur l'appareil n'est pas
     touché : quitter n'est pas effacer. Quand une équipe est en place, c'est
     la session de l'utilisateur qui se ferme, et l'écran de connexion revient
     là où il est demandé. */
  function quitter() {
    try { window.sessionStorage.removeItem("seance-ouverte"); } catch (e) {}
    var u = utilisateurConnecte();
    if (u && window.Droits && window.Droits.deconnecter) {
      window.Droits.deconnecter().then(function () { location.reload(); })
        .catch(function () { location.reload(); });
      return;
    }
    location.replace("index.html");
  }

  /* CHANGER SON PROPRE CODE. L'ancien code est redemandé : sans lui, il
     suffirait de trouver une session ouverte pour prendre la place de
     quelqu'un. Le changement passe par Droits, qui l'inscrit au journal. */
  function changerMonCode() {
    var u = utilisateurConnecte();
    if (!u || !window.Droits || !window.Droits.changerMonCode) return;
    var ancien = window.prompt("Votre code d'accès actuel :");
    if (ancien === null) return;
    var neuf = window.prompt("Votre nouveau code d'accès, quatre caractères au moins :");
    if (neuf === null) return;
    var encore = window.prompt("Saisissez-le une seconde fois :");
    if (encore === null) return;
    if (String(neuf) !== String(encore)) {
      window.alert("Les deux saisies ne sont pas les mêmes : rien n'a été changé.");
      return;
    }
    window.Droits.changerMonCode(ancien, neuf).then(function () {
      window.alert("Votre code d'accès a été changé. Il sera demandé à la prochaine connexion.");
      fermer();
    }).catch(function (ex) {
      window.alert(ex && ex.message ? ex.message : "Le code n'a pas pu être changé.");
    });
  }

  /* ─────────────────────── la pose dans la page ─────────────────────── */
  function poser() {
    /* Les deux charpentes du dépôt : le bandeau des pages d'audit, la rangée
       des pages de gestion. La première qui existe reçoit les boutons. */
    var outils = $("header.site .outils");
    var bandeau = $("header.site .wrap");
    var haut = $(".haut");
    var ou = outils || haut || bandeau;   /* là où va le retour */
    var la = bandeau || haut;             /* là où va le menu, à droite */
    if (!ou || !la) return;

    var retour = ou.querySelector("a.retour, button.retour, #retour");
    if (!retour && page !== "index.html") {
      retour = document.createElement("a");
      retour.className = "retour";
      retour.href = "index.html";
      retour.textContent = "← Retour";
      retour.addEventListener("click", retourner);
      ou.insertBefore(retour, ou.firstChild);
    }
    /* Le bouton qui existe déjà garde son écouteur : le nôtre passe avant lui
       seulement quand la page a déclaré une étape précédente, et dans ce cas
       il arrête l'événement. */
    if (retour) retour.addEventListener("click", function (ev) {
      if (!AVANT) return;
      var reste = false;
      try { reste = AVANT() === true; } catch (e) { reste = false; }
      if (reste) { ev.preventDefault(); ev.stopImmediatePropagation(); }
    }, true);

    if (!document.getElementById("barre-bouton-menu")) {
      var b = document.createElement("button");
      b.type = "button";
      b.id = "barre-bouton-menu";
      b.className = "menu";
      b.setAttribute("aria-label", "Menu");
      b.textContent = "Menu";
      b.addEventListener("click", ouvrir);
      la.appendChild(b);
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermer();
  });

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", poser);
  else poser();

  /* LES PAGES QUI AVANCENT PAR ÉCRANS.

     Presque toutes les pages du dépôt montrent une section à la fois et
     cachent les autres. Plutôt que de réécrire chacune, on regarde le DOM :
     dès qu'une autre section devient visible, l'écran quitté est empilé. Le
     bouton Retour dépile et rappelle la fonction d'affichage de la page,
     celle qu'elle emploie elle-même, pour que l'écran revienne dans l'état
     que la page attend.

         Barre.ecrans(ecran);        // « ecran » est la fonction de la page

     Le drapeau « revient » évite d'empiler le retour lui-même, ce qui
     enfermerait l'utilisateur dans un va-et-vient entre deux écrans. */
  function ecrans(montrer, selecteur) {
    if (typeof montrer !== "function") return;
    var sel = selecteur || "main > section[id], main > .wrap > section[id], body > main section[id]";
    var vus = [], courant = null, revient = false;

    function visible(s) {
      if (s.hasAttribute("hidden")) return false;
      if (s.classList.contains("cache")) return false;
      var st = window.getComputedStyle(s);
      return st.display !== "none" && st.visibility !== "hidden";
    }
    function lequel() {
      var L = document.querySelectorAll(sel), i;
      for (i = 0; i < L.length; i++) if (visible(L[i])) return L[i].id;
      return null;
    }
    function regarder() {
      var id = lequel();
      if (id === courant) return;
      if (!revient && courant) vus.push(courant);
      courant = id;
    }

    courant = lequel();
    var obs = new window.MutationObserver(regarder);
    document.querySelectorAll(sel).forEach(function (s) {
      obs.observe(s, { attributes: true, attributeFilter: ["hidden", "class", "style"] });
    });

    AVANT = function () {
      if (!vus.length) return false;
      var id = vus.pop();
      revient = true;
      try { montrer(id); } catch (e) {}
      courant = lequel();
      window.setTimeout(function () { revient = false; }, 0);
      window.scrollTo(0, 0);
      return true;
    };
  }

  window.Barre = {
    avant: function (fn) { AVANT = typeof fn === "function" ? fn : null; },
    ecrans: ecrans,
    retour: retourner,
    ouvrirMenu: ouvrir,
    fermerMenu: fermer,
    quitter: quitter,
  };

})(window, document);
