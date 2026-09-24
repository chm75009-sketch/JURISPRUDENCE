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
    if (seance()) h += '<button type="button" class="quitter" id="barre-quitter">Quitter</button>' +
      '<p class="apres">Le mot de passe sera redemandé à la prochaine ouverture. ' +
      "Rien de ce qui est sur cet appareil n'est effacé.</p>";
    h += "</nav>";
    p.innerHTML = h;
    document.body.appendChild(p);
    document.documentElement.style.overflow = "hidden";
    p.addEventListener("click", function (ev) {
      if (ev.target.getAttribute && ev.target.getAttribute("data-fermer")) fermer();
    });
    var q = $("#barre-quitter");
    if (q) q.addEventListener("click", quitter);
  }

  /* QUITTER. La séance se referme, donc verrou.js renvoie à la porte à la
     page suivante. Ce qui est sur l'appareil n'est pas touché : quitter n'est
     pas effacer. */
  function quitter() {
    try { window.sessionStorage.removeItem("seance-ouverte"); } catch (e) {}
    location.replace("entrer.html");
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
