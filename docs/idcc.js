/* Le sélecteur de convention collective.

   Un champ texte reste un champ texte — les brouillons existants s'affichent
   tels quels — mais il gagne une liste filtrante : on tape un numéro IDCC ou
   quelques lettres de l'intitulé, la liste se resserre, on touche une ligne et
   le champ se remplit. En fin de liste, toujours : « Autre / pas dans la
   liste », qui rend la saisie libre — un dossier réel comporte toujours le cas
   qu'on n'avait pas prévu.

   La liste vient de docs/idcc.json — extraite de la ressource « Liste des
   conventions collectives » du jeu de données KALI de la DILA sur data.gouv.fr,
   conventions en vigueur seulement (la source et la date sont consignées dans
   le fichier). Hors connexion ou si le fichier manque, le champ fonctionne en
   saisie libre : rien ne casse.

   Usage : window.IDCC.attacher(input, { stocker: "libelle" | "code", zeros: bool })
     - "libelle" (défaut) : le champ reçoit « 1486 — Convention collective … »
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
      ".idcc-liste .idcc-vide{padding:10px 12px;color:#5f6874}";
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
      return c.idcc + " — " + c.intitule;
    }
    function choisir(c) {
      input.value = valeurDe(c);
      fermer();
      /* Un choix referme la liste, il ne verrouille pas le champ : reprendre
         la saisie ensuite — sans repasser par un focus — doit la rouvrir.
         Seul l'évènement synthétique ci-dessous, écho immédiat du choix, ne
         doit pas la rouvrir tout seul ; ignorerProchaineSaisie ne vaut que
         pour lui, une fois. */
      ignorerProchaineSaisie = true;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    function fermer() { boite.hidden = true; }

    function montrer(liste, q) {
      var qs = plat(q).split(/\s+/).filter(Boolean);
      var mots = (input._idccMots || []).map(plat).filter(Boolean);
      var priorite = !qs.length && mots.length > 0;
      var retenues = [];
      if (priorite) {
        /* Champ vide, secteur renseigné : on ne filtre rien — 328 conventions
           restent atteignables — mais celles dont l'intitulé porte un mot du
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
        h += '<div class="idcc-vide">Conventions dont l\'intitulé évoque votre secteur, en tête — ' +
          'à vérifier depuis votre activité réelle, pas une affirmation.</div>';
      if (!retenues.length && liste.length)
        h += '<div class="idcc-vide">Aucune convention ne correspond — « Autre » ouvre la saisie libre.</div>';
      retenues.forEach(function (c, i) {
        h += '<button type="button" class="idcc-o" role="option" data-i="' + i + '">' +
          '<span class="idcc-num">' + c.idcc + '</span>' +
          c.intitule.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</button>";
      });
      h += '<button type="button" class="idcc-o idcc-autre" role="option" data-autre="1">Autre / pas dans la liste — saisie libre</button>';
      boite.innerHTML = h;
      boite.hidden = false;
      Array.prototype.forEach.call(boite.querySelectorAll(".idcc-o"), function (b) {
        /* pointerdown : avant le blur du champ, pour que le toucher aboutisse */
        b.addEventListener("pointerdown", function (ev) {
          ev.preventDefault();
          if (b.getAttribute("data-autre")) {
            libre = true; fermer();
            input.focus();
            if (!input.getAttribute("data-garde-placeholder"))
              input.placeholder = "numéro ou intitulé, en saisie libre";
            return;
          }
          choisir(retenues[Number(b.getAttribute("data-i"))]);
        });
      });
    }

    /* Le champ contient-il déjà l'intitulé exact d'une convention choisie —
       à l'instant, ou lors d'une visite précédente, relue depuis la fiche ?
       Si oui, rouvrir la liste en filtrant sur ce texte entier ne retient
       plus qu'elle-même : toutes les autres lignes disparaissent, et rien ne
       dit à l'utilisateur qu'il peut encore taper autre chose. C'est ce qui
       donnait l'impression d'un champ verrouillé après un premier choix. */
    function dejaChoisie(liste, val) {
      var v = String(val || "").trim();
      if (!v) return false;
      for (var i = 0; i < liste.length; i++) if (valeurDe(liste[i]) === v) return true;
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

    input.addEventListener("focus", function () { libre = false; ouvrir(); });
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
     l'intitulé porte un des mots donnés — un secteur choisi ailleurs sur la
     fiche, par exemple. N'écarte rien, ne filtre rien : une suggestion. */
  function definirMots(input, mots) {
    if (input) input._idccMots = mots || [];
  }

  window.IDCC = { attacher: attacher, charger: charger, definirMots: definirMots };
})();
