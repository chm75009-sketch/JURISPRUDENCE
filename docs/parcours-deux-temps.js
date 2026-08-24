/* Le parcours du client, en deux temps — l'écran.

   Le moteur (moteur/commun/parcours-deux-temps.js, embarqué dans chaque
   paquet) dit ce qui manque et ce qui n'est que déclaré. Ce fichier le montre,
   et recueille ce que le client répond.

   L'ordre est la règle, et il est tenu par la page : le second temps reste
   fermé tant que le premier n'est pas achevé. Ce n'est pas une préférence de
   présentation — c'est la consigne, et elle a une raison : on ne vérifie pas
   les déclarations de quelqu'un pendant qu'il a encore des manquements ouverts.

   Un seul fichier pour les huit modules. Il se monte tout seul dès que le
   paquet du module expose « audit.parcours » ; les modules qui ne l'exposent
   pas encore ne voient rien changer. */
(function (global) {
  "use strict";

  var ech = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /* Les quatre réponses, partout les mêmes. « En cours », « autre » et « je ne
     sais pas » ne concluent rien : le moteur les traite comme une absence. */
  var REPONSES = ["oui", "non", "en cours", "je ne sais pas", "autre"];

  function Parcours(opts) {
    this.moteur = opts.moteur;                 /* le paquet du module */
    this.cle = opts.cle + "-parcours";         /* le brouillon du parcours */
    this.hote = opts.hote;                     /* où se monter */
    this.fiche = opts.fiche;                   /* () => la fiche saisie */
    this.etat = this.lire();
    this.ouvert = { A: null, B: null };        /* le point déplié, par temps */
  }

  Parcours.prototype.lire = function () {
    try {
      var brut = localStorage.getItem(this.cle);
      var e = brut ? JSON.parse(brut) : {};
      return { faits: e.faits || {}, corrections: e.corrections || {}, controles: e.controles || {} };
    } catch (err) { return { faits: {}, corrections: {}, controles: {} }; }
  };

  Parcours.prototype.enregistrer = function () {
    try { localStorage.setItem(this.cle, JSON.stringify(this.etat)); } catch (err) {}
  };

  Parcours.prototype.calculer = function () {
    return this.moteur.audit.parcours(this.fiche(), this.etat);
  };

  /* ---------------------------------------------------------------- le rendu */

  Parcours.prototype.rendre = function () {
    var p = this.calculer();
    this.hote.innerHTML =
      this.enTete(p) +
      this.rendreTempsA(p) +
      this.rendreTempsB(p);
    this.brancher();
  };

  Parcours.prototype.enTete = function (p) {
    return '<div class="pc-tete">' +
      "<h2>Ce que vous en faites — en deux temps</h2>" +
      "<p>D'abord ce qui manque : on le corrige, et on vérifie chaque correction. " +
      "Ensuite seulement, ce que vous déclarez avoir : on le contrôle pièce par pièce. " +
      "<b>Un « oui » n'est pas une preuve</b> — rien ne passe pour acquis sans être vérifié.</p>" +
      '<div class="pc-compteurs">' +
      '<div><strong>' + p.compteurs.manquants + "</strong><span>manquants</span></div>" +
      '<div><strong>' + p.compteurs.declares + "</strong><span>déclarés — à vérifier</span></div>" +
      '<div><strong>' + p.compteurs.enRegle + "</strong><span>en règle — vérifiés</span></div>" +
      "</div></div>";
  };

  /* --- premier temps : ce qui n'a pas été fait --- */

  Parcours.prototype.rendreTempsA = function (p) {
    var self = this;
    var h = '<section class="pc-temps" id="pc-temps-a">' +
      '<div class="pc-bandeau"><span>Premier temps</span><h3>Ce que vous n\'avez pas fait</h3>' +
      "<p>Du plus grave au moins grave. Chaque point dit l'acte à accomplir, ce qu'on risque " +
      "à ne pas le faire, le modèle à produire et la procédure jusqu'à la validation.</p></div>";

    if (!p.tempsA.points.length && !p.tempsA.refusesDuSecond.length) {
      h += '<p class="pc-vide">Aucun manquement constaté en l\'état de vos réponses. ' +
        "Cela ne vaut pas quitus : les points sur lesquels l'audit n'a pas conclu — " +
        "données manquantes, réponses « en cours » — restent à renseigner au questionnaire.</p>";
    } else {
      h += '<ol class="pc-liste">';
      p.tempsA.points.forEach(function (pt, i) {
        h += self.cartePointA(pt, i + 1);
      });
      h += "</ol>";
    }

    if (p.tempsA.refusesDuSecond.length) {
      h += '<div class="pc-retours"><h4>Revenus du second temps (' +
        p.tempsA.refusesDuSecond.length + ")</h4>" +
        "<p>Ces obligations étaient déclarées en place. La vérification ne les a pas confirmées : " +
        "elles redeviennent des manquements.</p><ul>";
      p.tempsA.refusesDuSecond.forEach(function (pt) {
        h += "<li><b>" + ech(pt.objet) + "</b> — " + ech(pt.verdict.motif) + "</li>";
      });
      h += "</ul></div>";
    }

    h += '<div class="pc-barre">' +
      '<button type="button" class="pc-btn" data-crendu="A">Compte rendu détaillé du premier temps</button>' +
      "</div>";
    return h + "</section>";
  };

  Parcours.prototype.cartePointA = function (pt, rang) {
    var ouvert = this.ouvert.A === pt.id;
    var corr = this.etat.corrections[pt.id] || {};
    var h = '<li class="pc-point' + (pt.fait ? " pc-fait" : "") + '" data-id="' + ech(pt.id) + '">' +
      '<div class="pc-entete" data-ouvrir="A" data-cible="' + ech(pt.id) + '">' +
      '<span class="pc-rang">' + rang + "</span>" +
      '<div class="pc-titre"><b>' + ech(pt.quoiFaire) + "</b>" +
      "<small>" + ech(pt.degre) + " · " + ech(pt.delai) + "</small></div>" +
      '<span class="pc-etiq pc-g' + pt.gravite + '">' + (pt.fait ? "corrigé" : "à faire") + "</span>" +
      "</div>";

    if (!ouvert) return h + "</li>";

    h += '<div class="pc-corps">' +
      '<p class="pc-constat"><b>Ce que l\'audit a constaté.</b> ' + ech(pt.constat) + "</p>" +
      '<p class="pc-risque"><b>Ce que vous risquez.</b> ' + ech(pt.risque) + "</p>";

    /* Le document, PRODUIT et non décrit.

       Dire « le document à produire : règlement intérieur » laisse l'employeur
       devant une page blanche. Quand l'application sait écrire ce document,
       elle l'écrit — au nom de l'entreprise, avec ses courriers et son
       calendrier — et le bouton le donne. Le reste des points garde la mention
       du document attendu, faute de mieux, et c'est ce qui reste à combler. */
    var gen = window.DocumentsProduits && window.DocumentsProduits.pour(pt.id);
    if (gen) {
      h += '<div class="pc-produit"><b>' + ech(gen.nom) + "</b>" +
        "<span>" + ech(gen.detail || "") + "</span>" +
        '<button type="button" class="pc-btn" data-produire="' + ech(pt.id) + '">' +
        "Produire le document</button></div>";
    } else if (pt.document) {
      h += '<p class="pc-doc"><b>Le document à produire.</b> ' + ech(pt.document) +
        ' <i class="pc-apres">— l\'application ne le rédige pas encore.</i></p>';
    }

    h += "<h5>La procédure, dans l'ordre</h5><ol class=\"pc-etapes\">";
    pt.etapes.forEach(function (e) { h += "<li>" + ech(e) + "</li>"; });
    h += "</ol>";

    h += '<p class="pc-fondement">Fondement : ' + ech(pt.fondement.join(" · ")) + "</p>";

    h += '<div class="pc-declare"><label><input type="checkbox" data-fait="' + ech(pt.id) + '"' +
      (pt.fait ? " checked" : "") + "> C'est fait — passer à la vérification</label></div>";

    if (pt.fait) {
      h += '<div class="pc-verif"><h5>La vérification de la correction</h5>' +
        "<p>Cocher n'est pas prouver : ces questions établissent que l'acte a bien été accompli.</p>";
      h += this.grille(pt.verifs, corr, "corrections", pt.id);
      h += this.verdictCorrection(pt, corr);
      h += "</div>";
    }

    return h + "</div></li>";
  };

  /* Le verdict d'une correction : la même règle que le moteur applique au
     second temps, appliquée ici à ce que le client déclare avoir corrigé. */
  Parcours.prototype.verdictCorrection = function (pt, corr) {
    var manquantes = [], refusees = [];
    pt.verifs.forEach(function (v) {
      var val = corr[v.cle];
      if (val === undefined || val === null || String(val).trim() === "" ||
          val === "en cours" || val === "autre" || val === "je ne sais pas") { manquantes.push(v); return; }
      if (val === "non") refusees.push(v);
    });
    if (refusees.length)
      return '<div class="pc-verdict pc-ref"><b>Refusé</b> ' +
        "La correction n'est pas établie : " +
        ech(refusees.map(function (v) { return "« " + v.question + " » — attendu : " + v.attendu; }).join(" ; ")) +
        ". Reprenez la procédure ci-dessus.</div>";
    if (manquantes.length)
      return '<div class="pc-verdict pc-att"><b>Ne conclut pas</b> ' +
        "Il reste à répondre : " +
        ech(manquantes.map(function (v) { return "« " + v.question + " »"; }).join(" ; ")) +
        ". Une réponse « en cours » ou « autre » ne vaut ni oui ni non.</div>";
    return '<div class="pc-verdict pc-val"><b>Validé</b> ' +
      "La correction est établie, pièce par pièce. Ce point sort de la liste des manquements.</div>";
  };

  /* --- second temps : ce qu'il dit avoir fait --- */

  Parcours.prototype.rendreTempsB = function (p) {
    var self = this;
    var h = '<section class="pc-temps' + (p.tempsB.ouvert ? "" : " pc-ferme") + '" id="pc-temps-b">' +
      '<div class="pc-bandeau"><span>Second temps</span><h3>Ce que vous dites avoir fait</h3>' +
      "<p>Les obligations que l'audit a retenues sur votre seule déclaration. Même procédure, " +
      "même logique : on liste, on contrôle avec la grille du texte, on valide — ou on refuse, " +
      "et le point retourne au premier temps.</p></div>";

    if (!p.tempsB.ouvert) {
      h += '<p class="pc-verrou"><b>Ce temps s\'ouvrira quand le premier sera achevé.</b> ' +
        "Il reste " + p.tempsA.restants + " point(s) à corriger et à faire valider. " +
        "L'ordre n'est pas arbitraire : on ne contrôle pas des déclarations pendant que des " +
        "manquements restent ouverts.</p>";
      return h + "</section>";
    }

    if (!p.tempsB.points.length) {
      h += '<p class="pc-vide">Aucune obligation n\'est déclarée en place : il n\'y a rien à vérifier ici.</p>' +
        '<div class="pc-barre"><button type="button" class="pc-btn" data-crendu="B">' +
        "Compte rendu détaillé du second temps</button></div>";
      return h + "</section>";
    }

    h += '<div class="pc-compteurs pc-petits">' +
      "<div><strong>" + p.tempsB.valides + "</strong><span>validés</span></div>" +
      "<div><strong>" + p.tempsB.refuses + "</strong><span>refusés</span></div>" +
      "<div><strong>" + p.tempsB.enAttente + "</strong><span>en attente</span></div></div>";

    h += '<ol class="pc-liste">';
    p.tempsB.points.forEach(function (pt, i) { h += self.cartePointB(pt, i + 1); });
    h += "</ol>";

    h += '<div class="pc-barre">' +
      '<button type="button" class="pc-btn" data-crendu="B">Compte rendu détaillé du second temps</button>' +
      "</div>";
    return h + "</section>";
  };

  Parcours.prototype.cartePointB = function (pt, rang) {
    var ouvert = this.ouvert.B === pt.id;
    var rep = this.etat.controles[pt.id] || {};
    var issue = pt.verdict.issue;
    var classe = issue === "validé" ? "pc-val" : issue === "refusé" ? "pc-ref" : "pc-att";
    var h = '<li class="pc-point" data-id="' + ech(pt.id) + '">' +
      '<div class="pc-entete" data-ouvrir="B" data-cible="' + ech(pt.id) + '">' +
      '<span class="pc-rang">' + rang + "</span>" +
      '<div class="pc-titre"><b>' + ech(pt.objet) + "</b>" +
      "<small>" + ech(pt.rubrique) + " · " + ech(pt.fondement.join(" · ")) + "</small></div>" +
      '<span class="pc-etiq ' + classe + '">' + ech(issue) + "</span>" +
      "</div>";

    if (!ouvert) return h + "</li>";

    h += '<div class="pc-corps">' +
      '<p class="pc-constat"><b>Ce que vous avez déclaré.</b> ' + ech(pt.declare) + "</p>";

    if (!pt.verifiable) {
      h += '<div class="pc-verdict pc-att"><b>Non vérifiable</b> ' + ech(pt.verdict.motif) + "</div>";
      return h + "</div></li>";
    }

    h += "<h5>La grille d'analyse</h5>" +
      "<p>Ce que le texte exige, point par point. Répondez sur pièces.</p>";
    h += this.grille(pt.verifs, rep, "controles", pt.id);
    h += '<div class="pc-verdict ' + classe + '"><b>' +
      ech(issue.charAt(0).toUpperCase() + issue.slice(1)) + "</b> " + ech(pt.verdict.motif) + "</div>";
    return h + "</div></li>";
  };

  /* --- la grille, commune aux deux temps --- */

  Parcours.prototype.grille = function (verifs, reponses, bac, id) {
    var h = '<div class="pc-grille">';
    verifs.forEach(function (v) {
      var val = reponses[v.cle] == null ? "" : String(reponses[v.cle]);
      h += '<div class="pc-q"><p>' + ech(v.question) + "</p>" +
        '<p class="pc-attendu">Attendu : ' + ech(v.attendu) + "</p>" +
        '<select data-bac="' + ech(bac) + '" data-point="' + ech(id) + '" data-cle="' + ech(v.cle) + '">' +
        '<option value="">— répondre —</option>' +
        REPONSES.map(function (r) {
          return '<option value="' + ech(r) + '"' + (val === r ? " selected" : "") + ">" + ech(r) + "</option>";
        }).join("") +
        "</select>" +
        '<input type="text" class="pc-detail" data-bac="' + ech(bac) + '" data-point="' + ech(id) +
        '" data-cle="' + ech(v.cle) + '__detail" placeholder="Date, référence, pièce — ce qui l\'établit" value="' +
        ech(reponses[v.cle + "__detail"] || "") + '">' +
        "</div>";
    });
    return h + "</div>";
  };

  /* ------------------------------------------------------------- les branchements */

  Parcours.prototype.brancher = function () {
    var self = this;

    Array.prototype.forEach.call(this.hote.querySelectorAll("[data-ouvrir]"), function (el) {
      el.addEventListener("click", function () {
        var t = el.getAttribute("data-ouvrir"), id = el.getAttribute("data-cible");
        self.ouvert[t] = self.ouvert[t] === id ? null : id;
        self.rendre();
      });
    });

    Array.prototype.forEach.call(this.hote.querySelectorAll("[data-fait]"), function (el) {
      el.addEventListener("change", function () {
        var id = el.getAttribute("data-fait");
        if (el.checked) self.etat.faits[id] = true;
        else { delete self.etat.faits[id]; delete self.etat.corrections[id]; }
        self.ouvert.A = id;
        self.enregistrer(); self.rendre();
      });
    });

    Array.prototype.forEach.call(this.hote.querySelectorAll("[data-bac]"), function (el) {
      var ev = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(ev, function () {
        var bac = el.getAttribute("data-bac"), pt = el.getAttribute("data-point"),
            cle = el.getAttribute("data-cle");
        self.etat[bac][pt] = self.etat[bac][pt] || {};
        if (el.value === "") delete self.etat[bac][pt][cle];
        else self.etat[bac][pt][cle] = el.value;
        self.enregistrer();
        /* Un champ de détail ne rejoue pas le rendu : on perdrait le curseur. */
        if (el.tagName === "SELECT") { self.ouvert[bac === "corrections" ? "A" : "B"] = pt; self.rendre(); }
      });
    });

    Array.prototype.forEach.call(this.hote.querySelectorAll("[data-crendu]"), function (el) {
      el.addEventListener("click", function () { self.compteRendu(el.getAttribute("data-crendu")); });
    });

    Array.prototype.forEach.call(this.hote.querySelectorAll("[data-produire]"), function (el) {
      el.addEventListener("click", function () { self.produire(el.getAttribute("data-produire")); });
    });
  };

  /* Produire le document d'un point. Il est écrit avec ce que l'application
     sait déjà de l'entreprise — sa fiche —, et rien d'autre n'est demandé :
     ce qui manque sort entre crochets plutôt que d'ouvrir un formulaire de
     plus avant d'avoir rien donné. */
  Parcours.prototype.produire = function (id) {
    var gen = window.DocumentsProduits && window.DocumentsProduits.pour(id);
    if (!gen) return;
    var profil = null;
    try { profil = JSON.parse(localStorage.getItem("profil-entreprise") || "null"); } catch (e) {}
    var f = this.fiche() || {};
    if (!profil) profil = {};
    /* La fiche de l'audit complète le profil : l'une ou l'autre peut être
       remplie, et l'employeur ne doit pas ressaisir ce qu'il a déjà donné. */
    if (!profil.denomination && (f.entreprise || f.denomination))
      profil.denomination = f.entreprise || f.denomination;
    if (profil.effectif == null && f.effectif != null) profil.effectif = f.effectif;
    this.montrerTexte(gen.produire({ profil: profil, fiche: f, aujourdhui: new Date() }));
  };

  /* ------------------------------------------------------ le compte rendu écrit */

  Parcours.prototype.compteRendu = function (temps) {
    var p = this.calculer();
    var f = this.fiche();
    var nom = f.entreprise || "L'entreprise";
    var l = [];

    if (temps === "A") {
      l.push("COMPTE RENDU — PREMIER TEMPS : CE QUI N'A PAS ÉTÉ FAIT");
      l.push("");
      l.push(nom + ". " + p.tempsA.points.length + " manquement(s) relevé(s) par l'audit, " +
        "classés du plus grave au moins grave. Chacun est repris ci-dessous avec l'acte à " +
        "accomplir, ce que coûte l'inaction et l'état de sa correction.");
      l.push("");
      p.tempsA.points.forEach(function (pt, i) {
        l.push((i + 1) + ". " + pt.objet.toUpperCase());
        l.push("Constat de l'audit — " + pt.constat);
        l.push("Fondement — " + pt.fondement.join(" · "));
        l.push("Ce qu'il faut faire — " + pt.quoiFaire);
        l.push("Ce que l'inaction expose — " + pt.risque);
        l.push("Délai à prévoir — " + pt.delai);
        if (pt.document) l.push("Document à produire — " + pt.document);
        l.push("Procédure :");
        pt.etapes.forEach(function (e, k) { l.push("   " + (k + 1) + ") " + e); });
        l.push("État — " + (pt.fait ? "déclaré corrigé" : "à faire"));
        l.push("");
      });
      if (p.tempsA.refusesDuSecond.length) {
        l.push("REVENUS DU SECOND TEMPS");
        p.tempsA.refusesDuSecond.forEach(function (pt) {
          l.push("- " + pt.objet + " — " + pt.verdict.motif);
        });
        l.push("");
      }
      l.push(p.tempsA.acheve
        ? "Le premier temps est achevé : tous les manquements relevés sont déclarés corrigés."
        : "Le premier temps n'est pas achevé : " + p.tempsA.restants + " point(s) restent ouverts. " +
          "Le second temps ne s'ouvrira pas avant.");
    } else {
      l.push("COMPTE RENDU — SECOND TEMPS : CE QUI EST DÉCLARÉ FAIT");
      l.push("");
      l.push(nom + ". " + p.tempsB.points.length + " obligation(s) retenue(s) par l'audit sur la " +
        "seule déclaration du client. Chacune a été reprise avec la grille du texte. " +
        p.tempsB.valides + " validée(s), " + p.tempsB.refuses + " refusée(s), " +
        p.tempsB.enAttente + " en attente de réponse.");
      l.push("");
      p.tempsB.points.forEach(function (pt, i) {
        l.push((i + 1) + ". " + pt.objet.toUpperCase());
        l.push("Fondement — " + pt.fondement.join(" · "));
        l.push("Déclaration — " + pt.declare);
        l.push("Grille d'analyse :");
        pt.verifs.forEach(function (v) {
          var rep = pt.reponses[v.cle] || "sans réponse";
          var det = pt.reponses[v.cle + "__detail"];
          l.push("   - " + v.question + " → « " + rep + " »" + (det ? " (" + det + ")" : ""));
          l.push("     attendu : " + v.attendu);
        });
        l.push("Verdict — " + pt.verdict.issue + ". " + pt.verdict.motif);
        l.push("");
      });
      if (p.tempsB.refuses)
        l.push("Les " + p.tempsB.refuses + " obligation(s) refusée(s) ne sont pas en règle : " +
          "elles rejoignent la liste des manquements du premier temps.");
    }

    l.push("");
    l.push("Ce compte rendu reprend les réponses saisies et les textes lus à la source. " +
      "Il ne vaut pas quitus : il ne dit rien des obligations sur lesquelles l'audit n'a pas conclu.");

    this.montrerTexte(l.join("\n"));
  };

  Parcours.prototype.montrerTexte = function (txt) {
    var d = document.getElementById("pc-dlg");
    if (!d) {
      d = document.createElement("dialog");
      d.id = "pc-dlg";
      d.innerHTML = '<div class="pc-dlg-barre">' +
        '<button type="button" id="pc-copier">Copier le texte</button>' +
        '<button type="button" id="pc-imprimer" class="second">Imprimer</button>' +
        '<button type="button" id="pc-fermer" class="second">Fermer</button></div>' +
        '<pre id="pc-txt"></pre>';
      document.body.appendChild(d);
      d.querySelector("#pc-fermer").addEventListener("click", function () { d.close(); });
      d.querySelector("#pc-imprimer").addEventListener("click", function () { window.print(); });
      d.querySelector("#pc-copier").addEventListener("click", function () {
        var t = document.getElementById("pc-txt").textContent;
        if (navigator.clipboard) navigator.clipboard.writeText(t);
      });
    }
    document.getElementById("pc-txt").textContent = txt;
    if (d.showModal) d.showModal(); else d.setAttribute("open", "open");
  };

  /* Les styles voyagent avec le composant : une seule inclusion par page, et
     rien à recopier dans huit feuilles. Ils sont posés une fois. */
  var CSS = [
    ".pc-tete{margin:28px 0 8px}",
    ".pc-tete h2{margin:0 0 6px}",
    ".pc-compteurs{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}",
    ".pc-compteurs div{flex:1 1 140px;border:1px solid #d8dbe0;border-radius:8px;padding:10px 12px;background:#fff}",
    ".pc-compteurs strong{display:block;font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums}",
    ".pc-compteurs span{font-size:12px;color:#5f6874}",
    ".pc-compteurs.pc-petits strong{font-size:20px}",
    ".pc-temps{margin:26px 0 0}",
    ".pc-bandeau{background:#5C2A54;color:#fff;border-radius:10px;padding:16px 18px;margin:0 0 14px}",
    ".pc-bandeau span{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}",
    ".pc-bandeau h3{margin:4px 0 6px;font-size:21px}",
    ".pc-bandeau p{margin:0;font-size:14px;opacity:.92}",
    ".pc-ferme .pc-bandeau{background:#7c7883}",
    ".pc-verrou{border:1px solid #d8dbe0;border-left:3px solid #7c7883;border-radius:0 8px 8px 0;padding:12px 14px;background:#f7f8fa;font-size:14px}",
    ".pc-vide{border:1px solid #d8dbe0;border-radius:8px;padding:12px 14px;background:#f7f8fa;font-size:14px}",
    ".pc-liste{list-style:none;margin:0;padding:0;display:grid;gap:8px}",
    ".pc-point{border:1px solid #d8dbe0;border-radius:9px;background:#fff;overflow:hidden}",
    ".pc-point.pc-fait{border-color:#bcd6c8}",
    ".pc-entete{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:11px 13px;cursor:pointer}",
    ".pc-entete:hover{background:#f7f8fa}",
    ".pc-rang{width:22px;height:22px;border-radius:50%;background:#f0eaf0;color:#5C2A54;font:600 12px/22px system-ui;text-align:center}",
    ".pc-titre b{display:block;font-size:14.5px;line-height:1.35}",
    ".pc-titre small{display:block;color:#5f6874;font-size:11.5px;margin-top:2px}",
    ".pc-etiq{font:600 11px/1 system-ui;letter-spacing:.04em;text-transform:uppercase;padding:5px 9px;border-radius:5px;white-space:nowrap;background:#eef0f3;color:#5f6874}",
    ".pc-etiq.pc-g1{background:#faeaea;color:#a32c2c}",
    ".pc-etiq.pc-g2{background:#f8efdf;color:#8a5b10}",
    ".pc-etiq.pc-g3{background:#eef0f3;color:#41485a}",
    ".pc-etiq.pc-g4{background:#eef4f0;color:#2e6b4f}",
    ".pc-etiq.pc-val{background:#e8f2ed;color:#2e6b4f}",
    ".pc-etiq.pc-ref{background:#faeaea;color:#a32c2c}",
    ".pc-etiq.pc-att{background:#f8efdf;color:#8a5b10}",
    ".pc-corps{border-top:1px solid #e8eaee;padding:14px 16px 16px;font-size:14px;line-height:1.55}",
    ".pc-corps h5{margin:14px 0 6px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#5C2A54}",
    ".pc-corps p{margin:0 0 8px}",
    ".pc-fondement{color:#5f6874;font-size:12px}",
    ".pc-produit{margin:12px 0;padding:13px 15px;border:1px solid #b9cbe0;border-radius:9px;background:#eef1f7}",
    ".pc-produit b{display:block;font-size:14.5px;color:#1F3864;margin-bottom:2px}",
    ".pc-produit span{display:block;font-size:13px;color:#41485a;line-height:1.5;margin-bottom:10px}",
    ".pc-apres{color:#8a5b10;font-style:normal;font-size:12.5px}",
    ".pc-etapes{margin:0 0 10px;padding-left:20px;display:grid;gap:5px}",
    ".pc-declare{margin:12px 0;padding:10px 12px;border:1px dashed #b9a3b5;border-radius:8px;background:#faf6f9}",
    ".pc-declare label{display:flex;gap:9px;align-items:flex-start;cursor:pointer;font-weight:600}",
    ".pc-verif{margin-top:12px;border-top:1px solid #e8eaee;padding-top:12px}",
    ".pc-grille{display:grid;gap:10px;margin:8px 0 12px}",
    ".pc-q{border:1px solid #e8eaee;border-radius:8px;padding:10px 12px;background:#fbfbfc}",
    ".pc-q p{margin:0 0 4px;font-size:13.5px}",
    ".pc-attendu{color:#5f6874;font-size:12px}",
    ".pc-q select{margin-top:6px;font:inherit;font-size:13.5px;padding:7px 9px;border:1px solid #c9ced6;border-radius:6px;background:#fff}",
    ".pc-detail{display:block;width:100%;margin-top:6px;font:inherit;font-size:13px;padding:7px 9px;border:1px solid #c9ced6;border-radius:6px}",
    ".pc-verdict{border-radius:8px;padding:11px 13px;font-size:13.5px;line-height:1.5;margin:10px 0 0}",
    ".pc-verdict b{display:block;margin-bottom:2px}",
    ".pc-verdict.pc-val{background:#e8f2ed;color:#20503b}",
    ".pc-verdict.pc-ref{background:#faeaea;color:#7d2222}",
    ".pc-verdict.pc-att{background:#f8efdf;color:#6b470c}",
    ".pc-retours{margin:12px 0 0;border:1px solid #e6c9c9;border-radius:9px;padding:12px 14px;background:#fdf5f5}",
    ".pc-retours h4{margin:0 0 4px;font-size:14px;color:#a32c2c}",
    ".pc-retours p,.pc-retours li{font-size:13.5px}",
    ".pc-barre{margin:14px 0 0}",
    ".pc-btn{font:600 14px/1 system-ui;padding:10px 15px;border:1px solid #5C2A54;background:#5C2A54;color:#fff;border-radius:7px;cursor:pointer}",
    "#pc-dlg{max-width:86ch;width:92vw;border:1px solid #d8dbe0;border-radius:12px;padding:16px 18px}",
    "#pc-dlg .pc-dlg-barre{display:flex;gap:8px;margin:0 0 12px}",
    "#pc-dlg button{font:600 13px/1 system-ui;padding:9px 13px;border-radius:6px;border:1px solid #5C2A54;background:#5C2A54;color:#fff;cursor:pointer}",
    "#pc-dlg button.second{background:#fff;color:#41485a;border-color:#c9ced6}",
    "#pc-txt{white-space:pre-wrap;font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;margin:0;max-height:70vh;overflow:auto}",
    "@media print{.pc-entete,.pc-barre,#pc-dlg .pc-dlg-barre{display:none}#pc-dlg{max-width:none;width:auto;border:none}}",
  ].join("\n");

  function poserStyles() {
    if (document.getElementById("pc-styles")) return;
    var s = document.createElement("style");
    s.id = "pc-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Le montage, tel qu'une page l'appelle : un hôte, le moteur, la clé du
     brouillon et de quoi relire la fiche. Rien d'autre. */
  Parcours.monter = function (opts) {
    if (!opts.moteur || !opts.moteur.audit || typeof opts.moteur.audit.parcours !== "function")
      return null;                            /* module pas encore équipé */
    poserStyles();
    var p = new Parcours(opts);
    p.rendre();
    return p;
  };

  global.ParcoursDeuxTemps = Parcours;
})(typeof window !== "undefined" ? window : this);
