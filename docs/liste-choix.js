/* LE CHAMP À LISTE, PARTOUT OÙ UNE LISTE EXISTE.

   POURQUOI CE FICHIER EXISTE

   Demande du 14 septembre 2026 : « prévoir toujours et chaque fois que cela
   est possible un menu déroulant avec des choix, comme ici par exemple pour
   la nationalité, et puis quand on tape la première lettre remonter tout ce
   qui commence par F, et faire ça partout. » Taper « française » au clavier
   d'un téléphone, dans un champ libre, c'est huit occasions de fautes de
   frappe et une donnée qui ne se recoupe avec rien.

   CE QUE CE CHAMP FAIT

   Il reste un champ texte : ce qui a déjà été saisi s'affiche, et la saisie
   libre demeure possible, parce qu'un dossier réel porte toujours le cas
   qu'on n'avait pas prévu. Mais il ouvre une liste : à la frappe, elle se
   resserre, et ce qui COMMENCE par les lettres tapées passe devant ce qui les
   contient seulement. Sur téléphone, la liste prend l'écran entier avec son
   propre champ de recherche en haut, sans quoi le clavier la recouvrirait :
   c'est la leçon, déjà payée, du sélecteur de convention collective.

   Usage :
     ListeChoix.attacher(input, { valeurs: ["française", "algérienne", …] })
     ListeChoix.attacher(input, { valeurs: LISTE, libelle: "nationalité",
                                  libre: false })

   « libre » à false retire la ligne « Autre » : à ne faire que si la liste
   est vraiment fermée.                                                     */

(function (window) {
  "use strict";
  if (window.ListeChoix) return;
  var doc = window.document;

  function plat(s) {
    return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var STYLE = false;
  function poserStyle() {
    if (STYLE) return; STYLE = true;
    var st = doc.createElement("style");
    st.textContent = [
      ".lc-liste{position:absolute;left:0;right:0;z-index:60;margin-top:2px;max-height:264px;",
      "  overflow-y:auto;background:#fff;border:1px solid #b9bfc8;border-radius:6px;",
      "  box-shadow:0 6px 18px rgba(22,24,29,.14);font-size:15px}",
      ".lc-liste[hidden]{display:none}",
      ".lc-liste .lc-o{display:block;width:100%;text-align:left;padding:11px 13px;border:none;",
      "  border-bottom:1px solid #eef0f3;background:#fff;color:#16181d;font:inherit;line-height:1.35;",
      "  cursor:pointer;border-radius:0}",
      ".lc-liste .lc-o:hover,.lc-liste .lc-o:focus{background:#f1f3f6}",
      ".lc-liste .lc-autre{color:#5f6874;font-style:italic}",
      ".lc-liste .lc-vide{padding:10px 12px;color:#5f6874}",
      ".lc-liste b{font-weight:700}",
      ".lc-voile{position:fixed;inset:0;z-index:1000;background:#fff;display:flex;flex-direction:column}",
      ".lc-voile[hidden]{display:none}",
      ".lc-voile-tete{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid #dcdfe4;background:#fff}",
      ".lc-voile-champ{flex:1;min-width:0;font:17px system-ui;padding:12px 14px;min-height:48px;",
      "  border:1px solid #b9bfc8;border-radius:10px;color:#16181d;background:#fff}",
      ".lc-voile-fermer{font:600 16px system-ui;padding:0 14px;min-height:48px;border:1px solid #dcdfe4;",
      "  border-radius:10px;background:#f4f5f7;color:#16181d}",
      ".lc-liste-voile{position:static;flex:1;max-height:none;overflow-y:auto;border:0;box-shadow:none;",
      "  border-radius:0;font-size:16.5px;-webkit-overflow-scrolling:touch}",
      ".lc-liste-voile .lc-o{min-height:48px;padding:13px 14px;touch-action:manipulation}",
      ".lc-liste-voile{overscroll-behavior:contain}",
    ].join("\n");
    doc.head.appendChild(st);
  }

  /* LE TRI DEMANDÉ : ce qui commence par les lettres tapées vient d'abord,
     le reste ensuite. « f » remonte France, française, finlandaise, avant
     « allemande » qui ne contient un f nulle part. */
  function filtrer(valeurs, q, max) {
    var s = plat(q).trim();
    if (!s) return valeurs.slice(0, max);
    var debut = [], dedans = [];
    for (var i = 0; i < valeurs.length; i++) {
      var p = plat(valeurs[i]);
      if (p.indexOf(s) === 0) debut.push(valeurs[i]);
      else if (p.indexOf(s) > 0) dedans.push(valeurs[i]);
    }
    return debut.concat(dedans).slice(0, max);
  }

  function surligne(valeur, q) {
    var s = plat(q).trim();
    if (!s) return ech(valeur);
    var p = plat(valeur), i = p.indexOf(s);
    if (i < 0) return ech(valeur);
    return ech(valeur.slice(0, i)) + "<b>" + ech(valeur.slice(i, i + s.length)) + "</b>" +
      ech(valeur.slice(i + s.length));
  }

  function attacher(input, opts) {
    if (!input || input.getAttribute("data-lc")) return;
    opts = opts || {};
    var valeurs = opts.valeurs || [];
    if (!valeurs.length) return;
    input.setAttribute("data-lc", "1");
    var libre = opts.libre !== false;
    var libelle = opts.libelle || "la liste";
    var MAX = opts.max || 120;
    poserStyle();

    var parent = input.parentNode;
    if (parent && getComputedStyle(parent).position === "static") parent.style.position = "relative";
    var boite = doc.createElement("div");
    boite.className = "lc-liste"; boite.hidden = true;
    boite.setAttribute("role", "listbox");
    input.insertAdjacentElement("afterend", boite);

    var enLibre = false, ignorer = false, cadre = boite, retourLibre = false;
    var voile = null, champVoile = null, listeVoile = null;

    function fermer() { boite.hidden = true; }
    function etroit() { return window.innerWidth < 700; }

    function choisir(v) {
      input.value = v;
      fermer(); fermerVoile();
      ignorer = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function placer() {
      if (!etroit()) { boite.style.position = ""; boite.style.top = ""; boite.style.left = "";
        boite.style.right = ""; boite.style.maxHeight = ""; return; }
      var r = input.getBoundingClientRect();
      var vv = window.visualViewport;
      var haut = vv ? vv.height + vv.offsetTop : window.innerHeight;
      boite.style.position = "fixed";
      boite.style.left = Math.max(6, r.left) + "px";
      boite.style.right = Math.max(6, window.innerWidth - r.right) + "px";
      boite.style.top = (r.bottom + 4) + "px";
      boite.style.maxHeight = Math.max(140, haut - r.bottom - 14) + "px";
    }

    function ouvrirVoile() {
      if (!voile) {
        voile = doc.createElement("div");
        voile.className = "lc-voile";
        voile.innerHTML = '<div class="lc-voile-tete"><input type="text" class="lc-voile-champ" ' +
          'placeholder="' + ech(libelle) + '" autocomplete="off" autocorrect="off" autocapitalize="off">' +
          '<button type="button" class="lc-voile-fermer">Fermer</button></div>' +
          '<div class="lc-liste lc-liste-voile" role="listbox"></div>';
        doc.body.appendChild(voile);
        champVoile = voile.querySelector(".lc-voile-champ");
        listeVoile = voile.querySelector(".lc-liste-voile");
        voile.querySelector(".lc-voile-fermer").addEventListener("click", fermerVoile);
        champVoile.addEventListener("input", function () { montrer(champVoile.value); });
        champVoile.addEventListener("keydown", function (ev) {
          if (ev.key !== "Enter" || !libre) return;
          var autre = listeVoile.querySelector(".lc-autre");
          if (autre && String(champVoile.value || "").trim()) { ev.preventDefault(); autre.click(); }
        });
      }
      voile.hidden = false;
      doc.body.style.overflow = "hidden";
      cadre = listeVoile;
      champVoile.value = "";
      montrer("");
      setTimeout(function () { try { champVoile.focus(); } catch (e) {} }, 50);
    }
    function fermerVoile() {
      if (!voile || voile.hidden) return;
      voile.hidden = true;
      doc.body.style.overflow = "";
      cadre = boite;
    }

    function montrer(q) {
      var retenues = filtrer(valeurs, q, MAX);
      var h = "";
      if (!retenues.length)
        h += '<div class="lc-vide">Rien dans la liste ne correspond' +
          (libre ? " ; vous pouvez écrire librement." : ".") + "</div>";
      retenues.forEach(function (v, i) {
        h += '<button type="button" class="lc-o" role="option" data-i="' + i + '">' +
          surligne(v, q) + "</button>";
      });
      if (libre)
        h += '<button type="button" class="lc-o lc-autre" role="option" data-autre="1">' +
          (String(q || "").trim() && cadre === listeVoile
            ? "Garder « " + ech(String(q).trim()) + " »" : "Autre, saisie libre") + "</button>";
      cadre.innerHTML = h;
      cadre.hidden = false;
      if (cadre === boite) placer();
      /* CHOISIR SANS EMPÊCHER DE FAIRE DÉFILER.

         La petite liste posée sous un champ écoute « pointerdown » et annule
         l'événement : sans cela, le champ perd le focus avant le clic et le
         toucher n'aboutit jamais.

         Mais la liste en plein écran, elle, est longue : sur un téléphone,
         annuler « pointerdown » annule aussi le geste de défilement. Le doigt
         qui voulait faire défiler choisissait le nom qu'il avait touché, et
         la liste ne bougeait pas d'un pixel. Signalé le 16 septembre 2026 sur
         une liste de salariés : « je n'arrive pas à sélectionner et à faire
         défiler ».

         Dans le plein écran, on écoute donc « click », qui ne se déclenche pas
         après un défilement, et le champ y est déjà sans focus. */
      var plein = (cadre === listeVoile);
      Array.prototype.forEach.call(cadre.querySelectorAll(".lc-o"), function (b) {
        var prendre = function (ev) {
          if (!plein) ev.preventDefault();
          if (b.getAttribute("data-autre")) {
            /* LA SAISIE LIBRE, SUR TÉLÉPHONE AUSSI.

               Mesuré le 26 septembre 2026 : sur un écran étroit, « Autre,
               saisie libre » rendait le focus au champ, et le focus rouvrait
               aussitôt la liste en plein écran. Le nom d'un nouvel embauché
               ne pouvait pas s'écrire, et ce qui avait été tapé dans la
               recherche se perdait. Ce qui a été tapé devient la valeur du
               champ, et le retour au champ n'ouvre plus la liste. */
            var tape = (plein && champVoile) ? String(champVoile.value || "").trim() : "";
            if (tape) {
              input.value = tape;
              ignorer = true;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
            enLibre = true; retourLibre = true; fermer(); fermerVoile();
            try { input.focus(); } catch (e) {}
            return;
          }
          choisir(retenues[Number(b.getAttribute("data-i"))]);
        };
        b.addEventListener(plein ? "click" : "pointerdown", prendre);
      });
    }

    function ouvrir() {
      if (enLibre) return;
      if (doc.activeElement !== input) return;
      /* Une valeur déjà choisie ne doit pas filtrer la liste sur elle-même :
         sans cela, le champ paraît verrouillé après le premier choix. */
      var q = input.value;
      for (var i = 0; i < valeurs.length; i++) if (valeurs[i] === q) { q = ""; break; }
      montrer(q);
    }

    input.addEventListener("focus", function () {
      if (retourLibre) { retourLibre = false; return; }
      enLibre = false;
      if (etroit()) { input.blur(); ouvrirVoile(); return; }
      try { input.select(); } catch (e) {}
      ouvrir();
    });
    input.addEventListener("input", function () {
      if (ignorer) { ignorer = false; return; }
      ouvrir();
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { enLibre = true; fermer(); }
    });
    input.addEventListener("blur", function () { setTimeout(fermer, 150); });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () { if (!boite.hidden) placer(); });
      window.visualViewport.addEventListener("scroll", function () { if (!boite.hidden) placer(); });
    }
  }

  /* Attache la liste à tous les champs d'un écran d'un seul appel : une carte
     { "nom du champ" : "nom de la liste" } et la page n'a plus à s'en
     occuper. Les listes elles-mêmes vivent dans listes-valeurs.js. */
  function attacherTous(racine, carte) {
    if (!racine || !carte) return;
    Object.keys(carte).forEach(function (sel) {
      var L = window.ListesValeurs && window.ListesValeurs[carte[sel]];
      if (!L) return;
      Array.prototype.forEach.call(racine.querySelectorAll(sel), function (el) {
        attacher(el, { valeurs: L, libelle: carte[sel] });
      });
    });
  }

  window.ListeChoix = { attacher: attacher, attacherTous: attacherTous, filtrer: filtrer };
})(window);
