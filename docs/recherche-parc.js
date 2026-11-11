/* LA RECHERCHE DU CHEF DE PARC : une barre, un micro, et on arrive au bon
   endroit.

   Le chef de parc n'a pas tout le menu de l'application : il a son parc, et
   trois gestes qui reviennent, faire un entretien, déclarer une réparation,
   déclarer un sinistre. Il le dit ou il l'écrit, on comprend, et un grand
   bouton l'ouvre. Même principe que la recherche de l'accueil, mais réduit à
   ce qui le concerne.

   Demande du 11 novembre 2026 : « pour le chef de parc, comme on l'a fait pour
   tous les autres, touche recherche, et avec la voix vocale aussi. Il
   recherche faire un entretien, une réparation, déclarer un sinistre. »

   Tout se calcule dans le navigateur, hors ligne, sans serveur et sans
   intelligence artificielle : on normalise le texte et on compte les
   mots-clés. */
(function () {
  "use strict";

  /* Les destinations du parc, et seulement elles : le chef de parc ne sort pas
     de son espace. Chaque entrée mène à une page qui existe pour lui. */
  var DEST = [
    { nom: "Faire un entretien ou une réparation", ou: "Ouvrir un véhicule, onglet Entretien",
      page: "flotte.html?faire=entretien",
      mots: "entretien entretenir reparation reparer vidange revision maintenance intervention panne depanner depannage travaux garage mecanique mecanicien pneu pneumatique frein freins plaquette plaquettes disque embrayage huile filtre courroie batterie ampoule eclairage amortisseur controler faire note cout" },
    { nom: "Déclarer un sinistre", ou: "Accident, bris de glace, vol...",
      page: "parc-sinistres.html",
      mots: "sinistre sinistres accident declarer declaration bris glace vol vole incendie vandalisme choc degat degats dommage collision accrochage assurance constat rayure carrosserie" },
    { nom: "Voir les dépenses du parc", ou: "Coûts d'entretien, par véhicule",
      page: "parc-depenses.html",
      mots: "depense depenses cout couts facture factures combien prix budget argent depenser total somme montant entretien reparation" },
    { nom: "Liste des véhicules", ou: "Chercher un camion, sa fiche",
      page: "flotte.html",
      mots: "vehicule vehicules camion camions voiture fourgon flotte parc liste immatriculation plaque chercher trouver fiche conducteur chauffeur affectation kilometrage photo document carte grise" },
    { nom: "Échéances à surveiller", ou: "Contrôles et assurances qui approchent",
      page: "flotte.html?etat=proche",
      mots: "echeance echeances controle technique assurance alerte date expire expiration bientot prochain prochaine depasse depassee urgent limiteur chronotachygraphe licence copie conforme carte grise extincteur renouveler renouvellement" },
    { nom: "Tableau de bord du parc", ou: "La synthèse du parc",
      page: "parc-tableau.html",
      mots: "tableau bord synthese resume vue ensemble accueil indicateur indicateurs kpi structure surveillance" }
  ];

  /* Quand rien n'est compris, on propose les trois gestes les plus courants. */
  var PLUS = ["flotte.html", "parc-sinistres.html", "parc-depenses.html"];

  var VIDES = { "je": 1, "j": 1, "veux": 1, "veut": 1, "voudrais": 1, "souhaite": 1, "faire": 1,
    "fais": 1, "faut": 1, "un": 1, "une": 1, "des": 1, "le": 1, "la": 1, "les": 1, "de": 1,
    "du": 1, "d": 1, "a": 1, "au": 1, "aux": 1, "pour": 1, "mon": 1, "ma": 1, "mes": 1,
    "ce": 1, "cette": 1, "comment": 1, "ou": 1, "et": 1, "en": 1, "sur": 1, "avec": 1,
    "me": 1, "se": 1, "son": 1, "sa": 1, "il": 1, "elle": 1, "y": 1, "ne": 1, "plus": 1, "pas": 1 };

  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9 ]/g, " ");
  }
  function toks(s) {
    return norm(s).split(/\s+/).filter(function (w) { return w && !VIDES[w]; });
  }
  DEST.forEach(function (d) { d._m = norm(d.nom + " " + d.mots).split(/\s+/).filter(Boolean); });

  function score(d, qs) {
    if (!qs.length) return 0;
    var s = 0;
    qs.forEach(function (q) {
      var hit = 0, i;
      for (i = 0; i < d._m.length; i++) {
        if (d._m[i].indexOf(q) === 0) { hit = (d._m[i] === q ? 3 : 2); break; }
      }
      if (!hit) { for (i = 0; i < d._m.length; i++) { if (d._m[i].indexOf(q) > 0) { hit = 1; break; } } }
      s += hit;
    });
    return s;
  }
  function classer(texte) {
    var qs = toks(texte);
    if (!qs.length) return [];
    return DEST.map(function (d) { return { d: d, s: score(d, qs) }; })
      .filter(function (o) { return o.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
  }
  function parPage(page) { for (var i = 0; i < DEST.length; i++) if (DEST[i].page === page) return DEST[i]; return null; }

  var CSS = '' +
    '.rp-carte{background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:16px;padding:15px 16px;margin:16px 0 0;box-shadow:0 1px 2px rgba(22,24,29,.05)}' +
    '.rp-tete{display:flex;align-items:center;gap:13px;margin:0 2px 12px}' +
    '.rp-mic{flex:0 0 auto;width:52px;height:52px;box-sizing:border-box;padding:0;border:0;border-radius:50%;' +
    'background:#efeefc;color:#4f46e5;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
    '-webkit-appearance:none;appearance:none}' +
    '.rp-mic svg{width:24px;height:24px}' +
    '.rp-mic.rp-indispo{opacity:.55}' +
    '.rp-mic.rp-on{background:#fde7e7;color:var(--rouge,#c0392b);animation:rp-pulse 1s ease-in-out infinite}' +
    '@keyframes rp-pulse{0%,100%{opacity:1}50%{opacity:.45}}' +
    '.rp-titre{font:700 16px/1.2 inherit;color:var(--texte,#16181d)}' +
    '.rp-sous{display:block;color:var(--texte-2,#5f6874);font-size:13px;margin-top:2px}' +
    '.rp-ligne{display:flex;gap:9px}' +
    '.rp-champ{flex:1 1 auto;min-width:0;border:1px solid var(--filet,#cfd6e0);border-radius:12px;' +
    'background:var(--fond-champ,#f7f8fa);color:var(--texte,#16181d);font:inherit;font-size:16px;padding:13px 14px;outline:0}' +
    '.rp-champ:focus{border-color:var(--accent,#1F3864);background:#fff}' +
    '.rp-ok{flex:0 0 auto;border:0;border-radius:12px;background:var(--accent,#1F3864);color:#fff;' +
    'font:700 16px inherit;padding:0 20px;min-height:48px;cursor:pointer;-webkit-appearance:none;appearance:none}' +
    '.rp-ecoute{margin:12px 2px 0;color:var(--rouge,#c0392b);font-size:14px;font-weight:600}' +
    '.rp-res{margin-top:13px;display:flex;flex-direction:column;gap:9px}' +
    '.rp-compris{color:var(--texte-2,#5f6874);font-size:14px}.rp-compris b{color:var(--texte,#16181d)}' +
    '.rp-ouvrir{display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;' +
    'background:var(--accent,#1F3864);color:#fff;border-radius:14px;padding:15px;font:700 16px inherit}' +
    '.rp-pasca{color:var(--texte-2,#5f6874);font-size:13px;margin:3px 2px 0}' +
    '.rp-autres{display:flex;flex-direction:column;gap:8px}' +
    '.rp-item{display:flex;align-items:center;gap:12px;background:var(--surface,#fff);border:1px solid var(--filet,#dcdfe4);' +
    'border-radius:12px;padding:12px 14px;text-decoration:none;color:inherit}' +
    '.rp-nom{font-size:15px;font-weight:600}' +
    '.rp-ou{display:block;color:var(--texte-2,#5f6874);font-size:13px;margin-top:1px}' +
    '.rp-fl{margin-left:auto;color:var(--texte-3,#7b838d);font-size:20px}' +
    '.rp-vide{color:var(--texte-2,#5f6874);font-size:14px;padding:4px 2px}';

  var MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>';
  var STOP = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';

  function construire(hote) {
    if (!document.getElementById("rp-style")) {
      var st = document.createElement("style"); st.id = "rp-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    hote.innerHTML =
      '<div class="rp-carte">' +
      '<div class="rp-tete">' +
      '<button type="button" class="rp-mic" aria-label="Dicter">' + MIC + '</button>' +
      '<div><span class="rp-titre">Que voulez-vous faire ?</span>' +
      '<span class="rp-sous">Dites ou écrivez : un entretien, une réparation, un sinistre...</span></div>' +
      '</div>' +
      '<div class="rp-ligne">' +
      '<input class="rp-champ" type="text" inputmode="search" autocomplete="off" aria-label="Votre demande" ' +
      'placeholder="Ex. : déclarer un sinistre">' +
      '<button type="button" class="rp-ok">OK</button>' +
      '</div>' +
      '<div class="rp-ecoute" hidden>Je vous écoute...</div>' +
      '<div class="rp-res"></div>' +
      '</div>';

    var champ = hote.querySelector(".rp-champ");
    var ok = hote.querySelector(".rp-ok");
    var res = hote.querySelector(".rp-res");
    var ecoute = hote.querySelector(".rp-ecoute");
    var mic = hote.querySelector(".rp-mic");

    function blocAutres(dests) {
      var box = document.createElement("div"); box.className = "rp-autres";
      dests.forEach(function (d) {
        var a = document.createElement("a"); a.className = "rp-item"; a.href = d.page;
        a.innerHTML = '<span><span class="rp-nom"></span><span class="rp-ou"></span></span><span class="rp-fl">›</span>';
        a.querySelector(".rp-nom").textContent = d.nom;
        a.querySelector(".rp-ou").textContent = d.ou;
        box.appendChild(a);
      });
      return box;
    }

    function rendre() {
      res.textContent = "";
      var texte = champ.value.trim();
      if (!texte) return;
      var liste = classer(texte);
      if (liste.length) {
        var best = liste[0].d;
        var c = document.createElement("div"); c.className = "rp-compris";
        c.innerHTML = "✓ J'ai compris : <b></b>";
        c.querySelector("b").textContent = best.nom;
        res.appendChild(c);
        var bouton = document.createElement("a"); bouton.className = "rp-ouvrir"; bouton.href = best.page;
        bouton.innerHTML = "Ouvrir <span>›</span>";
        res.appendChild(bouton);
        var autres = liste.slice(1, 4);
        if (autres.length) {
          var pasca = document.createElement("div"); pasca.className = "rp-pasca"; pasca.textContent = "Pas ça ?";
          res.appendChild(pasca);
          res.appendChild(blocAutres(autres.map(function (o) { return o.d; })));
        }
      } else {
        var v = document.createElement("div"); v.className = "rp-vide";
        v.textContent = "Je n'ai pas compris, vous vouliez peut-être :";
        res.appendChild(v);
        res.appendChild(blocAutres(PLUS.map(parPage).filter(Boolean)));
      }
    }

    var minut = null;
    champ.addEventListener("input", function () {
      if (minut) window.clearTimeout(minut);
      minut = window.setTimeout(rendre, 450);
    });
    champ.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); if (minut) window.clearTimeout(minut); rendre(); }
    });
    ok.addEventListener("click", function () { if (minut) window.clearTimeout(minut); rendre(); champ.focus(); });

    /* LE MICRO : dictée en français, le texte s'écrit en direct, arrêt au bout
       de dix secondes ou à un second appui. Sans reconnaissance vocale, on
       invite à dicter au clavier. */
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    var reco = null, enEcoute = false, minuterie = null;

    function finEcoute() {
      enEcoute = false; mic.classList.remove("rp-on"); mic.innerHTML = MIC; ecoute.hidden = true;
      if (minuterie) { window.clearTimeout(minuterie); minuterie = null; }
    }
    function message(txt) {
      res.textContent = "";
      var v = document.createElement("div"); v.className = "rp-vide"; v.textContent = txt; res.appendChild(v);
    }
    function clavier() { champ.focus(); message("Touchez le micro de votre clavier pour dicter, ou écrivez votre demande."); }

    if (!SR) { mic.classList.add("rp-indispo"); mic.addEventListener("click", clavier); }
    else {
      mic.addEventListener("click", function () {
        if (enEcoute) { try { reco.stop(); } catch (e) {} return; }
        try {
          reco = new SR(); reco.lang = "fr-FR"; reco.interimResults = true; reco.maxAlternatives = 1;
          reco.onstart = function () {
            enEcoute = true; mic.classList.add("rp-on"); mic.innerHTML = STOP; ecoute.hidden = false;
            minuterie = window.setTimeout(function () { try { reco.stop(); } catch (e) {} }, 10000);
          };
          reco.onresult = function (e) {
            var t = ""; for (var k = 0; k < e.results.length; k++) t += e.results[k][0].transcript;
            if (t) { champ.value = t; rendre(); }
          };
          reco.onerror = function (ev) {
            finEcoute();
            var c = ev && ev.error;
            if (c === "not-allowed" || c === "service-not-allowed") message("Le micro n'est pas autorisé. Autorisez-le, ou écrivez votre demande.");
            else if (c === "no-speech") message("Je n'ai rien entendu. Réessayez, ou écrivez votre demande.");
            else if (c === "audio-capture") message("Aucun micro détecté. Écrivez votre demande.");
            else clavier();
          };
          reco.onend = function () { finEcoute(); champ.focus(); };
          reco.start();
        } catch (e) { finEcoute(); clavier(); }
      });
    }
  }

  function demarrer() {
    var hote = document.getElementById("recherche-parc");
    if (hote) construire(hote);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
