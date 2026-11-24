/* LE MICRO DANS CHAQUE CHAMP DE RECHERCHE.

   POURQUOI CE FICHIER EXISTE

   Demande du 23 novembre 2026, devant l'écran « Flotte et conducteurs » :
   « elle est où la recherche vocale ? », puis « oui, et partout où on peut ».
   La dictée existait sur l'accueil (recherche-rapide.js) et sur le tableau du
   chef de parc (recherche-parc.js), chacune avec son propre micro. Les autres
   champs de recherche de l'application n'en avaient pas : la flotte, le
   registre du personnel, la liste des salariés, les documents, la recherche
   de jurisprudence et ses filtres.

   CE QU'IL FAIT

   Il pose un bouton micro au bout de chaque champ « input type=search », et de
   chaque champ marqué data-micro. On touche le micro, on parle, le texte
   s'écrit dans le champ en direct et la liste se filtre comme si on l'avait
   tapé : le champ reçoit l'évènement « input » que la page écoute déjà. Rien
   d'autre n'est à brancher, page par page.

   Il est chargé par barre.js, présent sur toutes les pages : un champ ajouté
   demain aura son micro sans qu'on y pense. Un champ qui ne doit pas en avoir
   porte data-micro="non".

   SANS RECONNAISSANCE VOCALE

   Le navigateur qui ne la propose pas garde le micro : il met le curseur
   dans le champ et rappelle le micro du clavier du téléphone, qui dicte
   partout. Rien ne quitte l'appareil par ce fichier : c'est le navigateur qui
   reconnaît la voix. */

(function (window, document) {
  "use strict";
  if (window.MicroChamp) return;

  /* CHROME, FIREFOX OU EDGE SUR IPHONE NE DICTENT PAS. Relevé le
     24 novembre 2026 : « la commande vocale ne fonctionne pas sur Chrome ».
     Sur iPhone, seul Safari donne la reconnaissance vocale aux pages ; les
     autres navigateurs annoncent l'outil, mais il ne démarre jamais, sans un
     message (bogue WebKit 239816). On les reconnaît à leur nom, et le micro
     renvoie alors au micro du clavier. Et partout ailleurs, une écoute qui
     n'a pas démarré au bout de huit secondes est abandonnée avec le même
     message, plutôt que de laisser croire qu'elle écoute. */
  var IOS_AUTRE = /(CriOS|FxiOS|EdgiOS|OPiOS|GSA)\//.test(navigator.userAgent || "");
  var SR = IOS_AUTRE ? null : (window.SpeechRecognition || window.webkitSpeechRecognition);

  var MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" ' +
    'height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>';
  var STOP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" ' +
    'width="12" height="12" rx="2"/></svg>';

  var CSS =
    ".mc-boite{position:relative;max-width:100%}" +
    ".mc-boite[hidden]{display:none!important}" +
    /* Les boutons de l'application ont une hauteur, un cadre et un fond
       imposés (style.css) : sans les « !important », le micro sortait en
       ovale bleu marine. */
    ".mc-boite .mc-micro{position:absolute;right:5px;top:50%;transform:translateY(-50%);" +
    "width:36px!important;height:36px!important;min-width:0!important;min-height:0!important;" +
    "border-radius:50%!important;border:0!important;margin:0!important;padding:7px!important;" +
    "background:var(--accent-clair,#e9edf5)!important;color:var(--accent,#1F3864)!important;cursor:pointer;" +
    "box-shadow:none;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent}" +
    ".mc-boite .mc-micro svg{width:20px;height:20px;display:block;flex:0 0 auto}" +
    ".mc-micro:focus-visible{outline:2px solid var(--accent,#1F3864);outline-offset:2px}" +
    ".mc-boite .mc-micro.mc-on{background:var(--rouge,#8E1B1B)!important;color:#fff!important;animation:mc-pouls 1.2s ease-in-out infinite}" +
    ".mc-petit .mc-micro{width:28px!important;height:28px!important;padding:5px!important;right:3px}" +
    ".mc-petit .mc-micro svg{width:16px!important;height:16px!important}" +
    "@keyframes mc-pouls{0%,100%{box-shadow:0 0 0 0 rgba(142,27,27,.35)}50%{box-shadow:0 0 0 6px rgba(142,27,27,0)}}" +
    ".mc-msg{display:block;margin:6px 2px 0;font:500 13px/1.35 system-ui,sans-serif;color:var(--texte-2,#5f6874)}" +
    ".mc-msg[hidden]{display:none}" +
    "@media (prefers-reduced-motion:reduce){.mc-micro.mc-on{animation:none}}";

  function poserStyle() {
    if (document.getElementById("mc-style")) return;
    var s = document.createElement("style");
    s.id = "mc-style";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function px(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }

  /* Le champ est-il cible ? Les deux barres qui ont déjà leur micro
     (accueil, chef de parc) ne sont pas des « type=search » et ne sont donc
     pas touchées ; le test les écarte quand même, par précaution. */
  function cible(inp) {
    if (!inp || inp.tagName !== "INPUT") return false;
    if (inp.getAttribute("data-mc")) return false;
    var dm = inp.getAttribute("data-micro");
    if (dm === "non") return false;
    if (inp.closest && inp.closest("#recherche-rapide, #recherche-parc")) return false;
    return (inp.type === "search") || (dm !== null);
  }

  var enCours = null;   // une seule écoute à la fois dans la page

  function equiper(inp) {
    inp.setAttribute("data-mc", "1");
    var cs = window.getComputedStyle(inp);

    /* La boîte prend la place du champ : ses marges passent à la boîte, pour
       que le micro reste centré sur le champ et non sur la marge. Un champ
       large (barre pleine largeur) donne une boîte en bloc ; un champ étroit
       (« filtrer dans ce texte… », 200 pixels) garde sa largeur. */
    var boite = document.createElement("span");
    boite.className = "mc-boite";
    var parent = inp.parentNode;
    var large = true;
    var inline = inp.style.width;
    if (inline && !/%$/.test(inline)) large = false;
    else if (inp.offsetWidth && parent && parent.clientWidth) {
      large = inp.offsetWidth >= parent.clientWidth * 0.8;
    }
    boite.style.display = large ? "block" : "inline-block";
    if (large) boite.style.width = "100%";
    boite.style.margin = cs.marginTop + " " + cs.marginRight + " " + cs.marginBottom + " " + cs.marginLeft;
    boite.style.verticalAlign = cs.verticalAlign;
    var flex = cs.flex;
    if (flex && flex !== "0 1 auto") boite.style.flex = flex;
    parent.insertBefore(boite, inp);
    boite.appendChild(inp);
    inp.style.margin = "0";
    /* La place du micro se prend dans le champ, pas à côté : un champ étroit
       garde sa largeur d'origine (un « filtrer dans ce texte… » de 200
       pixels s'élargissait de trente). */
    var largeurAvant = inp.offsetWidth;
    if (large) { inp.style.width = "100%"; inp.style.boxSizing = "border-box"; }
    else if (inline) { inp.style.boxSizing = "border-box"; }
    else if (largeurAvant) { inp.style.width = largeurAvant + "px"; inp.style.boxSizing = "border-box"; }

    var haut = inp.offsetHeight || px(cs.height) || 40;
    if (haut && haut < 38) boite.classList.add("mc-petit");
    var place = boite.classList.contains("mc-petit") ? 34 : 46;
    inp.style.paddingRight = (Math.max(px(cs.paddingRight), 8) + place - 8) + "px";

    var mic = document.createElement("button");
    mic.type = "button";
    mic.className = "mc-micro";
    mic.innerHTML = MIC;
    mic.setAttribute("aria-label", "Dicter la recherche");
    mic.title = "Dicter la recherche";
    boite.appendChild(mic);

    var msg = document.createElement("span");
    msg.className = "mc-msg";
    msg.hidden = true;
    msg.setAttribute("role", "status");
    boite.insertAdjacentElement("afterend", msg);

    /* Le champ masqué par la page (la liste des salariés ne montre sa
       recherche qu'à partir de huit personnes) masque aussi sa boîte. */
    function suivreMasque() {
      boite.hidden = !!inp.hidden || inp.style.display === "none";
      if (boite.hidden) msg.hidden = true;
    }
    suivreMasque();
    if (window.MutationObserver) {
      new MutationObserver(suivreMasque).observe(inp, { attributes: true, attributeFilter: ["hidden", "style"] });
    }

    var minuteMsg = null;
    function dire(t, duree) {
      msg.textContent = t;
      msg.hidden = false;
      if (minuteMsg) window.clearTimeout(minuteMsg);
      minuteMsg = window.setTimeout(function () { msg.hidden = true; }, duree || 4500);
    }
    function taire() { msg.hidden = true; if (minuteMsg) window.clearTimeout(minuteMsg); }

    function ecrire(t) {
      inp.value = t;
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function clavier() {
      try { inp.focus(); } catch (e) {}
      dire(IOS_AUTRE
        ? "Sur iPhone, seul Safari sait dicter ici. Touchez le micro de votre clavier pour dicter, ou ouvrez l'application dans Safari."
        : "Touchez le micro de votre clavier pour dicter, ou écrivez votre recherche.", 7000);
    }

    if (!SR) { mic.addEventListener("click", clavier); return; }

    var reco = null, actif = false, minuterie = null, ancienPh = null, guet = null;

    function fin() {
      actif = false;
      if (enCours === arreter) enCours = null;
      mic.classList.remove("mc-on");
      mic.innerHTML = MIC;
      mic.setAttribute("aria-label", "Dicter la recherche");
      if (ancienPh !== null) { inp.placeholder = ancienPh; ancienPh = null; }
      if (minuterie) { window.clearTimeout(minuterie); minuterie = null; }
      if (guet) { window.clearTimeout(guet); guet = null; }
    }
    function arreter() { try { if (reco) reco.stop(); } catch (e) {} }

    mic.addEventListener("click", function () {
      if (actif) { arreter(); return; }
      if (enCours) enCours();
      taire();
      try {
        reco = new SR();
        reco.lang = "fr-FR";
        reco.interimResults = true;
        reco.continuous = false;
        reco.maxAlternatives = 1;
        reco.onstart = function () {
          if (guet) { window.clearTimeout(guet); guet = null; }
          actif = true;
          enCours = arreter;
          mic.classList.add("mc-on");
          mic.innerHTML = STOP;
          mic.setAttribute("aria-label", "Arrêter la dictée");
          ancienPh = inp.placeholder;
          inp.placeholder = "Parlez, je vous écoute…";
          minuterie = window.setTimeout(arreter, 10000);
        };
        reco.onresult = function (e) {
          var t = "";
          for (var k = 0; k < e.results.length; k++) t += e.results[k][0].transcript;
          t = t.replace(/\s+/g, " ").replace(/[.?!]+$/, "").trim();
          if (t) ecrire(t);
        };
        reco.onerror = function (ev) {
          var c = ev && ev.error;
          fin();
          if (c === "not-allowed" || c === "service-not-allowed") dire("Le micro n'est pas autorisé. Autorisez-le dans les réglages, ou écrivez votre recherche.", 7000);
          else if (c === "no-speech") dire("Je n'ai rien entendu. Touchez le micro et parlez, ou écrivez votre recherche.");
          else if (c === "audio-capture") dire("Aucun micro détecté. Écrivez votre recherche.");
          else if (c === "aborted") { /* arrêt demandé : rien à dire */ }
          else clavier();
        };
        reco.onend = function () { fin(); };
        reco.start();
        guet = window.setTimeout(function () {
          guet = null;
          if (actif) return;
          try { reco.abort(); } catch (e) {}
          fin(); clavier();
        }, 8000);
      } catch (e) { fin(); clavier(); }
    });
  }

  function balayer(racine) {
    var r = racine && racine.querySelectorAll ? racine : document;
    var l = r.querySelectorAll("input[type=search], input[data-micro]");
    for (var i = 0; i < l.length; i++) if (cible(l[i])) equiper(l[i]);
  }

  var prevu = false;
  function plusTard() {
    if (prevu) return;
    prevu = true;
    (window.requestAnimationFrame || window.setTimeout)(function () { prevu = false; balayer(document); });
  }

  function demarrer() {
    poserStyle();
    balayer(document);
    /* Les champs écrits après coup par la page (un écran qui se construit
       en JavaScript) reçoivent leur micro au passage suivant. */
    if (window.MutationObserver && document.body) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].addedNodes && muts[i].addedNodes.length) { plusTard(); return; }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.MicroChamp = { balayer: balayer };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})(window, document);
