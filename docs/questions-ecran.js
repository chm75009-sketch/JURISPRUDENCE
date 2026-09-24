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

  function adresse() {
    return (Q.reglage().adresse || "").trim();
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

  function montrerApres(q) {
    $("e-apres").classList.remove("cache");
    var h = "<b>Question " + ech(q.id) + " envoyée à " + ech(adresse()) + ".</b>" +
      "Votre messagerie s'est ouverte avec l'objet et le texte : il reste à appuyer sur envoyer.";
    if (q.pieces.length) {
      h += '<div class="rappel">Joignez au message ' +
        (q.pieces.length > 1 ? "les " + q.pieces.length + " pièces" : "la pièce") + " : " +
        q.pieces.map(ech).join(", ") + ". Elles sont aussi gardées dans « Mes documents ».</div>";
    }
    $("txt-apres").innerHTML = h;
  }

  /* ───────────────────────── le journal du mois ─────────────────────── */
  function rendreJournal() {
    var mois = Q.moisDe(new Date());
    var L = Q.duMois(mois).slice().reverse();
    var h = "<h2>Vos questions de " + ech(Q.moisEnFrancais(mois)) + "</h2>";
    if (!L.length) {
      h += '<div class="vide">Aucune question posée ce mois-ci.</div>';
    } else {
      h += L.map(function (q) {
        return '<div class="q"><div class="h"><span class="r">' + ech(q.id) + "</span>" +
          '<span class="d">' + ech(Q.jourEnFrancais(q.date)) + "</span></div>" +
          '<div class="o">' + ech(q.objet) + "</div>" +
          '<div class="t">' + ech(q.texte) + "</div>" +
          (q.pieces.length ? '<div class="p">Pièces : ' + q.pieces.map(ech).join(", ") + "</div>" : "") +
          "</div>";
      }).join("");
    }
    $("journal").innerHTML = h;
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
    $("adr").value = adresse();
    rendreTout();
  })();

})(window, document);
