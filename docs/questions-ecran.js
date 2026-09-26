/* L'ÉCRAN DES QUESTIONS DE L'ABONNEMENT.

   Le fond est dans questions.js : le décompte, la mise en forme du courriel.
   Ici, l'écran : le compteur, le formulaire, la fermeture à cinq, le journal
   des questions du mois, et les pièces.

   Les pièces choisies entrent dans la base des documents, rubrique
   « questions », pour que le client les retrouve dans « Mes documents ». Elles
   ne partent pas avec le courriel : le lien mailto ne sait pas attacher de
   fichier, et l'écran le dit clairement plutôt que de laisser croire qu'elles
   sont parties.                                                             */

"use strict";
(function (window, document) {

  var Q = window.QuestionsAbonnement;
  var $ = function (id) { return document.getElementById(id); };
  var ech = function (s) { return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };

  var FICHIERS = [];
  var DERNIERE = null;

  function entreprise() {
    try { return (window.Profil && window.Profil.lire()) || {}; } catch (e) { return {}; }
  }

  /* L'ADRESSE VIENT DU DOSSIER. Elle est saisie une fois sur la fiche
     d'entreprise, avec les autres interlocuteurs ; le champ libre de cet
     écran ne sert plus qu'au dépannage, quand la fiche n'en porte pas.
     Relevé le 26 septembre 2026. */
  function adresseFiche() {
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    return String((p && p.cabinetCourriel) || "").trim();
  }
  function adresse() {
    return adresseFiche() || (Q.reglage().adresse || "").trim();
  }

  /* ───────────────────────────── le compteur ────────────────────────── */
  function rendreCompteur() {
    var mois = Q.moisDe(new Date());
    var reste = Q.reste(mois);
    $("n-reste").textContent = String(reste);
    $("n-reste").classList.toggle("zero", reste === 0);
    $("t-reste").innerHTML = reste === 0
      ? "question restante pour " + ech(Q.moisEnFrancais(mois)) +
        "<small>Vous avez posé vos cinq questions du mois.</small>"
      : (reste > 1 ? "questions restantes" : "question restante") + " pour " +
        ech(Q.moisEnFrancais(mois)) +
        "<small>Sur " + Q.PAR_MOIS + " par mois. Le compteur repart le " +
        ech(Q.premierDuMoisSuivant(mois)) + ".</small>";
    return reste;
  }

  /* ───────────────────────────── les pièces ─────────────────────────── */
  $("fichiers").addEventListener("change", function (ev) {
    var L = ev.target.files ? Array.prototype.slice.call(ev.target.files) : [];
    L.forEach(function (f) {
      if (!FICHIERS.some(function (x) { return x.name === f.name && x.size === f.size; }))
        FICHIERS.push(f);
    });
    rendrePieces();
    verifier();
  });

  function rendrePieces() {
    $("liste-pieces").innerHTML = FICHIERS.map(function (f) {
      return "<li>" + ech(f.name) + "</li>";
    }).join("");
  }

  function garderPieces(q) {
    if (!window.Documents || !FICHIERS.length) return Promise.resolve(0);
    return FICHIERS.reduce(function (avant, f) {
      return avant.then(function (n) {
        return window.Documents.enregistrer("questions", {
          nom: f.name, sorte: "depose", type: f.type || "",
          note: "Pièce de la question " + q.id, contenu: f,
        }).then(function () { return n + 1; }).catch(function () { return n; });
      });
    }, Promise.resolve(0));
  }

  /* ──────────────────────────── le formulaire ───────────────────────── */
  function verifier() {
    var pret = $("objet").value.trim().length > 2 &&
      $("texte").value.trim().length > 15 &&
      !!adresse();
    $("envoyer").disabled = !pret;
    if (!adresse()) {
      $("etat").className = "etat manque";
      $("etat").textContent = "Renseignez d'abord l'adresse du cabinet, en bas de l'écran.";
    } else if ($("etat").textContent.indexOf("adresse du cabinet") >= 0) {
      $("etat").className = "etat";
      $("etat").textContent = "";
    }
    return pret;
  }
  $("objet").addEventListener("input", verifier);
  $("texte").addEventListener("input", verifier);

  $("adr").addEventListener("input", function () {
    Q.reglerAdresse($("adr").value);
    verifier();
  });

  $("envoyer").addEventListener("click", function () {
    if (!verifier()) return;
    var q = Q.poser({
      objet: $("objet").value,
      texte: $("texte").value,
      pieces: FICHIERS.map(function (f) { return f.name; }),
    });
    if (!q) { rendreTout(); return; }
    DERNIERE = q;
    garderPieces(q).then(function () {
      ouvrirCourriel(q);
      $("objet").value = "";
      $("texte").value = "";
      FICHIERS = [];
      $("fichiers").value = "";
      rendrePieces();
      rendreTout();
      montrerApres(q);
    });
  });

  function ouvrirCourriel(q) {
    var l = Q.lien(q, entreprise(), adresse());
    try { window.location.href = l; } catch (e) {}
  }

  $("rouvrir").addEventListener("click", function () {
    if (DERNIERE) ouvrirCourriel(DERNIERE);
  });

  $("envoyee").addEventListener("click", function () {
    if (!DERNIERE) return;
    Q.confirmer(DERNIERE.id);
    $("txt-apres").innerHTML = "<b>Question " + ech(DERNIERE.id) + " notée comme envoyée.</b>" +
      "Elle figure dans le journal du mois, avec ses pièces.";
    DERNIERE = null;
    rendreTout();
  });

  $("pas-envoyee").addEventListener("click", function () {
    if (!DERNIERE) return;
    Q.retirer(DERNIERE.id);
    $("txt-apres").innerHTML = "<b>Question retirée.</b>Elle ne compte pas, et son texte " +
      "n'est plus gardé. Reposez-la quand vous voudrez.";
    DERNIERE = null;
    rendreTout();
  });

  function montrerApres(q) {
    $("e-apres").classList.remove("cache");
    /* « Envoyée » était écrit alors que rien n'était parti : la messagerie
       s'ouvre, et c'est tout. Le texte le dit, et le compteur attend la
       réponse. Relevé le 26 septembre 2026. */
    var h = "<b>Question " + ech(q.id) + " : votre messagerie s'est ouverte, adressée à " +
      ech(adresse()) + ".</b>" +
      "Il reste à appuyer sur envoyer dans votre messagerie. Dites-le ici ensuite : " +
      "tant que vous ne l'avez pas confirmé, cette question ne compte pas dans vos " +
      Q.PAR_MOIS + " du mois.";
    if (q.pieces.length) {
      h += '<div class="rappel">Joignez au message ' +
        (q.pieces.length > 1 ? "les " + q.pieces.length + " pièces" : "la pièce") + " : " +
        q.pieces.map(ech).join(", ") + ". Elles sont aussi gardées dans « Mes documents ».</div>";
    }
    $("txt-apres").innerHTML = h;
  }

  /* ───────────────── le journal, et le fil des réponses ───────────────

     Le journal ne montrait que le mois en cours, et rien de ce que le cabinet
     avait répondu : la question partait, la réponse restait dans la
     messagerie, et six mois plus tard plus rien ne les reliait. L'audit du
     26 septembre 2026 l'a relevé. La réponse se colle sous sa question, avec
     sa date, et le fil se garde ici comme le reste du dossier.

     Rien n'arrive tout seul : l'application n'a pas de serveur. C'est le
     client qui reporte ce qu'il a reçu, et l'écran le dit.                 */
  var VUE = "mois";

  function filtresHtml() {
    return '<div class="filtres">' +
      '<button type="button" data-vue="mois"' + (VUE === "mois" ? ' class="actif"' : "") +
      ">Ce mois-ci</button>" +
      '<button type="button" data-vue="tout"' + (VUE === "tout" ? ' class="actif"' : "") +
      ">Tout le fil</button></div>";
  }

  function reponsesHtml(q) {
    var L = q.reponses || [];
    var h = L.map(function (r, i) {
      return '<div class="rep"><div class="d">Réponse du cabinet, le ' +
        ech(Q.jourEnFrancais(r.le)) + "</div>" +
        '<div class="t">' + ech(r.texte) + "</div>" +
        '<button type="button" data-oter="' + ech(q.id) + '" data-rang="' + i +
        '">Retirer cette réponse</button></div>';
    }).join("");
    if (!L.length && q.etat !== "brouillon")
      h += '<p class="sans">Aucune réponse notée pour cette question.</p>';
    h += '<details class="ajout"><summary>Coller la réponse du cabinet</summary>' +
      '<label class="ch">Date de la réponse' +
      '<input type="date" data-date="' + ech(q.id) + '"></label>' +
      '<label class="ch">Ce que le cabinet a répondu' +
      '<textarea data-texte="' + ech(q.id) + '" placeholder="Collez ici le texte reçu, ou résumez-le."></textarea></label>' +
      '<button type="button" data-noter="' + ech(q.id) + '">Ajouter au fil</button></details>';
    return h;
  }

  function questionHtml(q) {
    return '<div class="q"><div class="h"><span class="r">' + ech(q.id) + "</span>" +
      '<span class="d">' + ech(Q.jourEnFrancais(q.date)) +
      (q.etat === "brouillon" ? " · non confirmée, ne compte pas" : "") + "</span></div>" +
      '<div class="o">' + ech(q.objet) + "</div>" +
      '<div class="t">' + ech(q.texte) + "</div>" +
      (q.pieces.length ? '<div class="p">Pièces : ' + q.pieces.map(ech).join(", ") + "</div>" : "") +
      reponsesHtml(q) + "</div>";
  }

  function rendreJournal() {
    var mois = Q.moisDe(new Date());
    var L = VUE === "tout" ? Q.toutes() : Q.duMois(mois).slice().reverse();
    var attente = Q.sansReponse().length;
    var h = "<h2>" + (VUE === "tout" ? "Toutes vos questions et les réponses du cabinet"
      : "Vos questions de " + ech(Q.moisEnFrancais(mois))) + "</h2>" + filtresHtml();
    if (!L.length) {
      h += '<div class="vide">' + (VUE === "tout"
        ? "Vous n'avez encore posé aucune question."
        : "Aucune question posée ce mois-ci. « Tout le fil » montre les mois précédents.") +
        "</div>";
    } else {
      h += L.map(questionHtml).join("");
      if (attente)
        h += '<p class="sans">' + attente + " question" + (attente > 1 ? "s" : "") +
          " envoyée" + (attente > 1 ? "s" : "") + " sans réponse notée. Les réponses " +
          "n'arrivent pas toutes seules : collez ici celles que vous recevez.</p>";
    }
    $("journal").innerHTML = h;
    cablerJournal();
  }

  function cablerJournal() {
    var z = $("journal");
    Array.prototype.forEach.call(z.querySelectorAll("[data-vue]"), function (b) {
      b.addEventListener("click", function () {
        VUE = b.getAttribute("data-vue");
        rendreJournal();
      });
    });
    Array.prototype.forEach.call(z.querySelectorAll("[data-noter]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-noter");
        var t = z.querySelector('[data-texte="' + id + '"]');
        var d = z.querySelector('[data-date="' + id + '"]');
        if (!t || !t.value.trim()) {
          if (t) t.focus();
          return;
        }
        Q.repondre(id, { le: d ? d.value : "", texte: t.value });
        rendreJournal();
      });
    });
    Array.prototype.forEach.call(z.querySelectorAll("[data-oter]"), function (b) {
      b.addEventListener("click", function () {
        Q.retirerReponse(b.getAttribute("data-oter"), parseInt(b.getAttribute("data-rang"), 10));
        rendreJournal();
      });
    });
  }

  /* ─────────────────────────── l'écran entier ───────────────────────── */
  function rendreTout() {
    var mois = Q.moisDe(new Date());
    var reste = rendreCompteur();
    var ferme = reste <= 0;
    $("e-form").classList.toggle("cache", ferme);
    $("e-ferme").classList.toggle("cache", !ferme);
    if (ferme) {
      $("txt-ferme").innerHTML = "<b>Vos cinq questions de " + ech(Q.moisEnFrancais(mois)) +
        " ont été posées.</b> Vous pourrez en poser de nouvelles à partir du " +
        ech(Q.premierDuMoisSuivant(mois)) + ". D'ici là, cet écran reste ouvert pour relire " +
        "ce que vous avez demandé.";
    }
    rendreJournal();
    verifier();
  }

  (function demarrer() {
    var e = entreprise();
    var bits = [];
    if (e.denomination) bits.push(e.denomination);
    if (e.effectif) bits.push(e.effectif + " salariés");
    $("ent").textContent = bits.join(" · ");
    /* Quand la fiche porte l'adresse du conseil, elle s'affiche et ne se
       ressaisit pas ici. Sinon, le champ reste, et dit où l'inscrire. */
    var deLaFiche = adresseFiche();
    if (deLaFiche) {
      $("adr").hidden = true;
      $("dit-adresse").innerHTML = "Vos questions partent à <b>" + ech(deLaFiche) +
        "</b>, l'adresse de votre conseil inscrite sur la fiche d'entreprise. " +
        '<a href="index.html">La changer sur la fiche</a>.';
    } else {
      $("adr").hidden = false;
      $("adr").value = (Q.reglage().adresse || "").trim();
      $("dit-adresse").textContent = "L'adresse de votre conseil n'est pas inscrite sur la " +
        "fiche d'entreprise : saisissez-la ici pour cet appareil, ou portez-la à la fiche, " +
        "où elle sera gardée avec le reste du dossier.";
    }
    rendreTout();
  })();

})(window, document);
