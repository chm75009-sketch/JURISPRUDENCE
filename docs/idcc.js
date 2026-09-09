/* Le sélecteur de convention collective.

   Un champ texte reste un champ texte, les brouillons existants s'affichent
   tels quels, mais il gagne une liste filtrante : on tape un numéro IDCC ou
   quelques lettres de l'intitulé, la liste se resserre, on touche une ligne et
   le champ se remplit. En fin de liste, toujours : « Autre / pas dans la
   liste », qui rend la saisie libre, un dossier réel comporte toujours le cas
   qu'on n'avait pas prévu.

   La liste vient de docs/idcc.json, extraite de la ressource « Liste des
   conventions collectives » du jeu de données KALI de la DILA sur data.gouv.fr,
   conventions en vigueur seulement (la source et la date sont consignées dans
   le fichier). Hors connexion ou si le fichier manque, le champ fonctionne en
   saisie libre : rien ne casse.

   Usage : window.IDCC.attacher(input, { stocker: "libelle" | "code", zeros: bool })
     - "libelle" (défaut) : le champ reçoit « 1486, Convention collective ... »
     - "code"             : le champ ne reçoit que le numéro (« 0016 », ou
                            « 16 » si zeros vaut false).                       */
(function () {
  "use strict";
  if (window.IDCC) return;

  var promesse = null;
  function charger() {
    if (!promesse) {
      promesse = fetch("idcc.json")
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) { return (d && d.conventions) || []; })
        .catch(function () { return []; });   /* hors connexion : saisie libre */
    }
    return promesse;
  }

  /* Comparaison sans accents ni casse : « metallurgie » trouve « métallurgie ». */
  function plat(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  var STYLE_POSE = false;
  function poserStyle() {
    if (STYLE_POSE) return; STYLE_POSE = true;
    var st = document.createElement("style");
    st.textContent =
      ".idcc-liste{position:absolute;left:0;right:0;z-index:60;margin-top:2px;" +
      "max-height:264px;overflow-y:auto;background:#fff;border:1px solid #b9bfc8;" +
      "border-radius:4px;box-shadow:0 6px 18px rgba(22,24,29,.14);font-size:14px}" +
      ".idcc-liste[hidden]{display:none}" +
      ".idcc-liste .idcc-o{display:block;width:100%;text-align:left;padding:10px 12px;" +
      "border:none;border-bottom:1px solid #eef0f3;background:#fff;color:#16181d;" +
      "font:inherit;line-height:1.35;cursor:pointer;border-radius:0}" +
      ".idcc-liste .idcc-o:hover,.idcc-liste .idcc-o:focus{background:#f1f3f6}" +
      ".idcc-liste .idcc-num{font-weight:600;white-space:nowrap;margin-right:6px}" +
      ".idcc-liste .idcc-autre{color:#5f6874;font-style:italic}" +
      ".idcc-liste .idcc-vide{padding:10px 12px;color:#5f6874}" +
      ".idcc-voile{position:fixed;inset:0;z-index:1000;background:#fff;display:flex;flex-direction:column}" +
      ".idcc-voile[hidden]{display:none}" +
      ".idcc-voile-tete{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid #dcdfe4;background:#fff}" +
      ".idcc-voile-champ{flex:1;min-width:0;font:17px system-ui;padding:12px 14px;min-height:48px;" +
      "border:1px solid #b9bfc8;border-radius:10px;color:#16181d;background:#fff}" +
      ".idcc-voile-fermer{font:600 16px system-ui;padding:0 14px;min-height:48px;border:1px solid #dcdfe4;" +
      "border-radius:10px;background:#f4f5f7;color:#16181d}" +
      ".idcc-liste-voile{position:static;flex:1;max-height:none;overflow-y:auto;border:0;box-shadow:none;" +
      "border-radius:0;font-size:16px;-webkit-overflow-scrolling:touch}" +
      ".idcc-liste-voile .idcc-o{min-height:48px;padding:12px 14px}";
    document.head.appendChild(st);
  }

  function attacher(input, opts) {
    if (!input || input.getAttribute("data-idcc")) return;
    input.setAttribute("data-idcc", "1");
    opts = opts || {};
    var stocker = opts.stocker || "libelle";
    var zeros = opts.zeros !== false;
    poserStyle();

    var parent = input.parentNode;
    if (parent && getComputedStyle(parent).position === "static")
      parent.style.position = "relative";
    var boite = document.createElement("div");
    boite.className = "idcc-liste"; boite.hidden = true;
    boite.setAttribute("role", "listbox");
    /* Sous l'input, dans son conteneur : la liste suit le champ partout. */
    input.insertAdjacentElement("afterend", boite);

    var libre = false;      /* « Autre » choisi : la liste se tait jusqu'au prochain focus */
    var ignorerProchaineSaisie = false;  /* le seul évènement « input » émis par choisir() */

    function valeurDe(c) {
      if (stocker === "code") return zeros ? c.idcc : String(Number(c.idcc));
      return c.idcc + " - " + c.intitule;
    }
    function choisir(c) {
      input.value = valeurDe(c);
      fermer(); fermerVoile();
      /* Un choix referme la liste, il ne verrouille pas le champ : reprendre
         la saisie ensuite, sans repasser par un focus, doit la rouvrir.
         Seul l'évènement synthétique ci-dessous, écho immédiat du choix, ne
         doit pas la rouvrir tout seul ; ignorerProchaineSaisie ne vaut que
         pour lui, une fois. */
      ignorerProchaineSaisie = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function fermer() { boite.hidden = true; }

    /* SUR TÉLÉPHONE, LA LISTE PASSAIT SOUS LE CLAVIER. Le champ est en bas de
       l'écran, la liste s'ouvre dessous, le clavier monte par-dessus : on ne
       voit rien, on croit qu'on ne peut pas changer de convention (capture du
       8 septembre 2026, 22 h 29). Sous 700 px, la liste est donc posée en
       position fixe juste sous le champ, avec la hauteur que laisse le clavier
       (visualViewport), et le champ est remonté en haut de l'écran. */
    function etroit() { return window.innerWidth < 700; }

    /* SUR TÉLÉPHONE, UN VOILE PLEIN ÉCRAN. Poser la liste sous le champ ne
       suffisait pas : sur iPhone le champ reste en bas de l'écran et le clavier
       recouvre tout (capture du 9 septembre 2026, 9 h 18). Le voile prend
       l'écran entier, son champ de recherche est en haut, la liste défile
       dessous : le clavier ne cache plus que le bas de la liste. */
    var voile = null, champVoile = null, listeVoile = null;
    function ouvrirVoile() {
      if (!voile) {
        voile = document.createElement("div");
        voile.className = "idcc-voile";
        voile.innerHTML = '<div class="idcc-voile-tete"><input type="text" class="idcc-voile-champ" ' +
          'placeholder="numéro ou intitulé de la convention" autocomplete="off" autocorrect="off" autocapitalize="off">' +
          '<button type="button" class="idcc-voile-fermer">Fermer</button></div>' +
          '<div class="idcc-liste idcc-liste-voile" role="listbox"></div>';
        document.body.appendChild(voile);
        champVoile = voile.querySelector(".idcc-voile-champ");
        listeVoile = voile.querySelector(".idcc-liste-voile");
        voile.querySelector(".idcc-voile-fermer").addEventListener("click", fermerVoile);
        champVoile.addEventListener("input", function () {
          charger().then(function (liste) { if (voile && !voile.hidden) montrer(liste, champVoile.value); });
        });
      }
      voile.hidden = false;
      document.body.style.overflow = "hidden";
      cadre = listeVoile;
      champVoile.value = "";
      charger().then(function (liste) {
        if (!liste.length) { fermerVoile(); return; }
        montrer(liste, "");
        setTimeout(function () { try { champVoile.focus(); } catch (_) {} }, 50);
      });
    }
    function fermerVoile() {
      if (!voile || voile.hidden) return;
      voile.hidden = true;
      document.body.style.overflow = "";
      cadre = boite;
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
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", function () { if (!boite.hidden) placer(); });
      window.visualViewport.addEventListener("scroll", function () { if (!boite.hidden) placer(); });
    }

    var cadre = boite;   /* où la liste se dessine : sous le champ, ou dans le voile */
    function montrer(liste, q) {
      var qs = plat(q).split(/\s+/).filter(Boolean);
      var mots = (input._idccMots || []).map(plat).filter(Boolean);
      var priorite = !qs.length && mots.length > 0;
      var retenues = [];
      if (priorite) {
        /* Champ vide, secteur renseigné : on ne filtre rien, 328 conventions
           restent atteignables, mais celles dont l'intitulé porte un mot du
           secteur remontent en tête. Une suggestion à vérifier depuis
           l'activité réelle, jamais une affirmation : le champ reste, comme
           toujours, une saisie libre assistée. */
        retenues = liste.slice().sort(function (a, b) {
          return score(b) - score(a);
        }).slice(0, 80);
      } else {
        for (var i = 0; i < liste.length && retenues.length < 80; i++) {
          var c = liste[i];
          var cible = c.idcc + " " + String(Number(c.idcc)) + " " + plat(c.intitule);
          var ok = true;
          for (var k = 0; k < qs.length; k++) if (cible.indexOf(qs[k]) < 0) { ok = false; break; }
          if (ok) retenues.push(c);
        }
      }
      function score(c) {
        var t = plat(c.intitule);
        var s = 0;
        for (var j = 0; j < mots.length; j++) if (t.indexOf(mots[j]) >= 0) s++;
        return s;
      }
      /* Un numéro tapé en entier remonte sa convention en tête de liste. */
      if (/^\d+$/.test(q.trim())) {
        var n = Number(q.trim());
        retenues.sort(function (a, b) {
          return (Number(b.idcc) === n ? 1 : 0) - (Number(a.idcc) === n ? 1 : 0);
        });
      }
      var h = "";
      if (priorite && retenues.length && score(retenues[0]) > 0)
        h += '<div class="idcc-vide">Conventions dont l\'intitulé évoque votre secteur, en tête : ' +
          'à vérifier depuis votre activité réelle, pas une affirmation.</div>';
      if (!retenues.length && liste.length)
        h += '<div class="idcc-vide">Aucune convention ne correspond ; « Autre » ouvre la saisie libre.</div>';
      retenues.forEach(function (c, i) {
        h += '<button type="button" class="idcc-o" role="option" data-i="' + i + '">' +
          '<span class="idcc-num">' + c.idcc + '</span>' +
          c.intitule.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</button>";
      });
      h += '<button type="button" class="idcc-o idcc-autre" role="option" data-autre="1">Autre / pas dans la liste, saisie libre</button>';
      cadre.innerHTML = h;
      cadre.hidden = false;
      if (cadre === boite) placer();
      Array.prototype.forEach.call(cadre.querySelectorAll(".idcc-o"), function (b) {
        /* pointerdown : avant le blur du champ, pour que le toucher aboutisse */
        b.addEventListener("pointerdown", function (ev) {
          ev.preventDefault();
          if (b.getAttribute("data-autre")) {
            libre = true; fermer(); fermerVoile();
            input.focus();
            if (!input.getAttribute("data-garde-placeholder"))
              input.placeholder = "numéro ou intitulé, en saisie libre";
            return;
          }
          choisir(retenues[Number(b.getAttribute("data-i"))]);
        });
      });
    }

    /* Le champ contient-il déjà l'intitulé exact d'une convention choisie -
       à l'instant, ou lors d'une visite précédente, relue depuis la fiche ?
       Si oui, rouvrir la liste en filtrant sur ce texte entier ne retient
       plus qu'elle-même : toutes les autres lignes disparaissent, et rien ne
       dit à l'utilisateur qu'il peut encore taper autre chose. C'est ce qui
       donnait l'impression d'un champ verrouillé après un premier choix. */
    function dejaChoisie(liste, val) {
      var v = String(val || "").trim();
      if (!v) return false;
      /* L'ancien séparateur, le tiret long, peut encore être dans une fiche
         enregistrée avant le 8 septembre 2026 : on l'accepte à la lecture. */
      var v2 = v.replace(/\s[\u2014\u2013]\s/, " - ");
      for (var i = 0; i < liste.length; i++) if (valeurDe(liste[i]) === v2) return true;
      return false;
    }
    function ouvrir() {
      if (libre) return;
      charger().then(function (liste) {
        if (!liste.length) return;          /* pas de fichier : saisie libre */
        if (document.activeElement !== input) return;
        montrer(liste, dejaChoisie(liste, input.value) ? "" : input.value);
      });
    }

    input.addEventListener("focus", function () {
      libre = false;
      if (etroit()) {
        /* Le champ rend la main tout de suite : c'est le voile qui prend la
           saisie, avec son propre champ en haut de l'écran. */
        input.blur();
        ouvrirVoile();
        return;
      }
      /* Le texte est sélectionné en entier : taper remplace la convention
         enregistrée au lieu de s'ajouter à la fin de son intitulé. */
      try { input.select(); } catch (_) {}
      ouvrir();
    });
    input.addEventListener("input", function () {
      if (ignorerProchaineSaisie) { ignorerProchaineSaisie = false; return; }
      ouvrir();
    });
    input.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { libre = true; fermer(); }
    });
    input.addEventListener("blur", function () {
      setTimeout(fermer, 150);              /* laisse aboutir un toucher en cours */
    });
  }

  /* Fait remonter, dans la liste ouverte à champ vide, les conventions dont
     l'intitulé porte un des mots donnés, un secteur choisi ailleurs sur la
     fiche, par exemple. N'écarte rien, ne filtre rien : une suggestion. */
  function definirMots(input, mots) {
    if (input) input._idccMots = mots || [];
  }

  window.IDCC = { attacher: attacher, charger: charger, definirMots: definirMots };
})();
