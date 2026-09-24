/* L'ÉCRAN DES CONTRATS DU TRANSPORT.

   Le fond est dans contrats-transport.js, qui porte les valeurs de la
   convention et écrit le contrat. Ici, les trois écrans, les champs, le rendu,
   le Word, et la relecture de la convention par le relais Légifrance.

   Ce qui est gardé sur l'appareil : la dernière saisie, sous la clé
   « contrats-transport », pour ne pas retaper l'entreprise à chaque contrat.
   Rien n'est envoyé, sauf la relecture de la convention, qui ne demande que
   des textes publics et n'envoie aucune donnée du salarié.                 */

"use strict";
(function (window, document) {

  var CT = window.ContratsTransport;
  var $ = function (id) { return document.getElementById(id); };
  var ech = function (s) { return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };

  var CLE = "contrats-transport";
  var RELAIS = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance";

  var PROFIL = null, NATURE = "cdi", PARTIEL = false, V = {}, BLOCS = [], HORS = [], ANNEXE = [];

  function profilEntreprise() {
    try { return (window.Profil && window.Profil.lire()) || {}; } catch (e) { return {}; }
  }
  function garde() {
    try { return JSON.parse(window.localStorage.getItem(CLE) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function garder() {
    try { window.localStorage.setItem(CLE, JSON.stringify(V)); } catch (e) {}
  }
  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  function ecran(id) {
    ["e-profil", "e-champs", "e-contrat"].forEach(function (x) {
      $(x).classList.toggle("cache", x !== id);
    });
    window.scrollTo(0, 0);
  }

  /* ─────────────────────────── 1 · l'emploi ─────────────────────────── */
  function rendreProfils() {
    $("profils").innerHTML = CT.PROFILS.map(function (p) {
      return '<button type="button" data-p="' + p.cle + '">' +
        '<span class="n">' + ech(p.nom) + "</span>" +
        '<span class="s">' + ech(p.sous) + "</span>" +
        '<span class="d">Temps de service : ' + ech(p.equivalence) + "</span></button>";
    }).join("");
  }
  $("profils").addEventListener("click", function (ev) {
    var b = ev.target.closest("button[data-p]");
    if (b) ouvrirProfil(b.getAttribute("data-p"));
  });

  /* ──────────────── le registre du personnel, à côté ────────────────── */
  /* Demande du 24 septembre 2026 : « lien avec le registre du personnel ».
     Le salarié y est déjà avec sa nationalité, sa naissance, son emploi et sa
     qualification : on le choisit, et le formulaire se remplit. Ce qui n'est
     pas au registre, l'adresse et le numéro de sécurité sociale, reste à
     saisir. Le registre n'est pas modifié. */
  function salariesDuRegistre() {
    var E = null;
    try { E = JSON.parse(window.localStorage.getItem("registre-personnel") || "null"); } catch (e) {}
    var L = (E && E.salaries) || [];
    return L.filter(function (s) {
      return !s.ex && String(s.nom || "").trim() && !String(s.sor || "").trim();
    });
  }

  function rendreRegistre() {
    var L = salariesDuRegistre();
    $("duregistre").classList.toggle("cache", !L.length);
    if (!L.length) return;
    $("salarie").innerHTML = '<option value="">- saisir à la main -</option>' +
      L.map(function (s, i) {
        var nom = (String(s.nom || "").trim() + " " + String(s.pre || "").trim()).trim();
        return '<option value="' + i + '">' + ech(nom) +
          (s.emp ? " · " + ech(s.emp) : "") + "</option>";
      }).join("");
  }

  $("salarie").addEventListener("change", function () {
    var i = $("salarie").value;
    if (i === "") return;
    var s = salariesDuRegistre()[Number(i)];
    if (!s) return;
    V.nom = (String(s.nom || "").trim() + " " + String(s.pre || "").trim()).trim();
    if (s.nat) V.nationalite = s.nat;
    if (s.nais) V.naissance = s.nais;
    if (s.emp) V.emploi = s.emp;
    if (s.ent) V.entree = s.ent;
    if (s.qua) V.groupe = s.qua;
    rendreChamps();
  });

  function ouvrirProfil(cle) {
    PROFIL = CT.profil(cle);
    $("titre-haut").textContent = PROFIL.nom;
    V = {};
    rendreRegistre();
    $("aide-champs").textContent = "Ce qu'il faut savoir pour écrire le contrat. Ce qui reste " +
      "entre crochets sera à compléter à la main.";
    rendreChamps();
    ecran("e-champs");
  }

  /* ─────────────────────── 2 · le salarié et le poste ───────────────── */
  var CHAMPS_COMMUNS = [
    { id: "nom", nom: "Nom et prénom du salarié", t: "text", large: true },
    { id: "adresse", nom: "Adresse du salarié", t: "text", large: true },
    { id: "naissance", nom: "Date de naissance", t: "date" },
    { id: "lieuNaissance", nom: "Lieu de naissance", t: "text" },
    { id: "nationalite", nom: "Nationalité", t: "text" },
    { id: "nir", nom: "Numéro de sécurité sociale", t: "text" },
    { id: "emploi", nom: "Emploi", t: "text" },
    { id: "groupe", nom: "Groupe", t: "text" },
    { id: "entree", nom: "Date d'entrée", t: "date" },
    { id: "lieu", nom: "Lieu de rattachement", t: "text" },
  ];

  /* LE MOTIF ET LE TERME, DEMANDÉS AVANT TOUT LE RESTE POUR UN CDD.
     C'est le motif qui rend le contrat licite, et le terme imprécis n'est
     ouvert qu'aux cas de L. 1242-7 : l'écran met les deux en tête plutôt que
     de les laisser en crochets au milieu du contrat. Demande du 24 septembre
     2026, « tu mets le motif partout pour le CDD ». */
  var CHAMPS_CDD = [
    { id: "motif", nom: "Motif du recours", t: "text", large: true,
      sous: "précis : qui est remplacé, quel surcroît, quelle saison" },
    { id: "remplace", nom: "Personne remplacée", t: "text",
      sous: "si le motif est un remplacement" },
    { id: "remplaceQualif", nom: "Sa qualification", t: "text" },
    { id: "terme", nom: "Date de fin", t: "date",
      sous: "datée par défaut : le terme imprécis n'est ouvert qu'aux cas de L. 1242-7" },
    { id: "sansTerme", nom: "Sans terme précis", t: "case",
      sous: "remplacement, attente d'une entrée en service, saisonnier ou d'usage seulement" },
    { id: "duree", nom: "Durée minimale, si la fin n'est pas datée", t: "text" },
  ];

  /* Les caisses : mentions obligatoires du CDD (L. 1242-12, 8°) et de la
     lettre d'embauche conventionnelle (annexe I, article 3 bis). Elles ne
     changent pas d'un salarié à l'autre : elles sont gardées sur l'appareil
     et reproposées. */
  var CHAMPS_CAISSES = [
    { id: "retraite", nom: "Caisse de retraite complémentaire", t: "text", large: true,
      sous: "nom et adresse" },
    { id: "prevoyance", nom: "Organisme de prévoyance", t: "text", large: true,
      sous: "nom et adresse" },
    { id: "sante", nom: "Organisme frais de santé", t: "text", large: true,
      sous: "couverture obligatoire de la branche" },
    { id: "urssaf", nom: "Caisse d'affiliation maladie et allocations familiales", t: "text", large: true },
  ];

  var CHAMPS_PARTIEL = [
    { id: "repartition", nom: "Répartition entre les jours", t: "text", large: true,
      sous: "par exemple : lundi, mardi et jeudi de 8 h à 15 h" },
    { id: "modification", nom: "Cas de modification de la répartition", t: "text", large: true,
      sous: "absence d'un salarié, surcroît de commandes, intempéries" },
    { id: "communication", nom: "Comment les horaires sont communiqués", t: "text", large: true,
      sous: "planning affiché le vendredi pour la semaine suivante" },
  ];

  function champsDuProfil() {
    var L = CHAMPS_COMMUNS.slice();
    if (NATURE === "cdd") L = CHAMPS_CDD.concat(L);
    if (PARTIEL) L = L.concat(CHAMPS_PARTIEL);
    if (PARTIEL) L.push({ id: "motifPartiel", nom: "Motif de la demande du salarié", t: "text",
      large: true, sous: "exigé si la durée est inférieure à 24 heures par semaine" });
    L.push({ id: "coef", nom: "Coefficient", t: "select", opts: PROFIL.coefs });
    L.push({ id: "mensuel", nom: PARTIEL ? "Heures par mois" : "Temps de service mensuel (heures)",
      t: "number", sous: PARTIEL ? "moins que la durée d'équivalence du poste"
        : (PROFIL.roulant ? "Durée d'équivalence : " + PROFIL.equivalence : "Durée légale : 151,67 heures") });
    L.push({ id: "taux", nom: "Taux horaire brut (euros)", t: "number",
      sous: "Taux conventionnel du coefficient, à confronter au SMIC" });
    L.push({ id: "smic", nom: "SMIC horaire en vigueur (euros)", t: "number",
      sous: "À vérifier : les taux conventionnels marchandises datent du 1er décembre 2023" });
    if (PROFIL.roulant) {
      L.push({ id: "zone", nom: "Zone de conduite", t: "text",
        sous: "par exemple : national et européen" });
    }
    L = L.concat(CHAMPS_CAISSES);
    L.push({ id: "lieuSignature", nom: "Lieu de signature", t: "text" });
    L.push({ id: "dateSignature", nom: "Date de signature", t: "date" });
    return L;
  }

  function rendreChamps() {
    var g = garde(), ent = profilEntreprise();
    var L = champsDuProfil();
    var defauts = {
      emploi: PROFIL.nom,
      coef: PROFIL.coefDefaut,
      mensuel: String(PROFIL.mensuel),
      taux: String(CT.tauxDe(PROFIL.coefDefaut, PROFIL.cle) || ""),
      smic: String(CT.CCN.smic.valeur),
      entree: iso(new Date()),
      dateSignature: iso(new Date()),
      lieu: g.lieu || ent.adresse || "",
      lieuSignature: g.lieuSignature || "",
      zone: "national et européen",
    };
    /* Ce qui a déjà été tapé ne se perd pas quand on coche « temps partiel »
       ou qu'on passe du CDI au CDD : les champs sont refaits, les valeurs
       restent. */
    var avant = V || {};
    var neuf = !avant.emploi;
    V = {};
    L.forEach(function (c) {
      if (avant[c.id] !== undefined && avant[c.id] !== "") { V[c.id] = avant[c.id]; return; }
      V[c.id] = (g[c.id] !== undefined && ["nom", "adresse", "naissance", "lieuNaissance",
        "nationalite", "nir", "motif", "terme", "duree", "repartition", "modification",
        "communication"].indexOf(c.id) < 0) ? g[c.id] : (defauts[c.id] || "");
      if (defauts[c.id] && !V[c.id]) V[c.id] = defauts[c.id];
    });
    if (neuf) {
      V.coef = defauts.coef; V.mensuel = defauts.mensuel; V.taux = defauts.taux;
      V.emploi = defauts.emploi;
    }

    $("champs").innerHTML = L.map(function (c) {
      var v = ech(V[c.id] || "");
      var dedans;
      if (c.t === "select") {
        dedans = '<select data-c="' + c.id + '">' + c.opts.map(function (o) {
          return '<option value="' + ech(o) + '"' + (o === V[c.id] ? " selected" : "") + ">" +
            ech(o) + "</option>";
        }).join("") + "</select>";
      } else if (c.t === "case") {
        dedans = '<input type="checkbox" data-c="' + c.id + '"' + (V[c.id] ? " checked" : "") + ">";
      } else {
        dedans = '<input type="' + (c.t === "number" ? "number" : c.t) + '" data-c="' + c.id +
          '" value="' + v + '"' + (c.t === "number" ? ' step="0.01"' : "") + ">";
      }
      return '<label class="' + (c.large ? "large" : "") + '">' + ech(c.nom) + dedans +
        (c.sous ? '<span class="sous">' + ech(c.sous) + "</span>" : "") + "</label>";
    }).join("");
    verifierSmic();
  }

  $("champs").addEventListener("input", function (ev) {
    var c = ev.target.getAttribute && ev.target.getAttribute("data-c");
    if (!c) return;
    V[c] = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
    if (c === "coef") {
      var t = CT.tauxDe(V.coef, PROFIL.cle);
      if (t) {
        V.taux = String(t);
        var champ = $("champs").querySelector('[data-c="taux"]');
        if (champ) champ.value = V.taux;
      }
    }
    if (c === "taux" || c === "smic" || c === "coef") verifierSmic();
    garder();
  });
  $("champs").addEventListener("change", function (ev) {
    var c = ev.target.getAttribute && ev.target.getAttribute("data-c");
    if (c) {
      V[c] = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
      if (c === "coef") rendreChampsTaux();
      verifierSmic(); garder();
    }
  });
  function rendreChampsTaux() {
    var t = CT.tauxDe(V.coef, PROFIL.cle);
    var champ = $("champs").querySelector('[data-c="taux"]');
    if (t && champ) { V.taux = String(t); champ.value = V.taux; }
  }

  /* LE SMIC PASSE AVANT LE TAUX CONVENTIONNEL.
     Les taux « marchandises » n'ont pas bougé depuis le 1er décembre 2023.
     Écrire un contrat au taux conventionnel sans regarder le SMIC, c'est
     écrire un contrat illicite : l'écran le dit avant, pas après. */
  /* LE SMIC PASSE AVANT LE TAUX CONVENTIONNEL.
     Les taux « marchandises » n'ont pas bougé depuis le 1er décembre 2023 et
     sont passés sous le SMIC. Le module porte le SMIC connu, daté, et écrit
     au contrat le plus élevé des deux. */
  function verifierSmic() {
    var t = Number(V.taux) || 0, s = Number(V.smic) || 0;
    var b = $("alerte-smic");
    if (!s) {
      b.classList.remove("cache");
      b.innerHTML = "<b>Le SMIC n'est pas renseigné.</b> Portez le SMIC horaire en vigueur : " +
        "c'est lui qui s'applique s'il est plus élevé que le taux du coefficient.";
      return;
    }
    if (s > t) {
      b.classList.remove("cache");
      b.innerHTML = "<b>Le SMIC l'emporte.</b> Le taux du coefficient " + ech(V.coef) + " est de " +
        CT.fr(t, 4) + " euros, le SMIC de " + CT.fr(s, 4) + " euros : c'est le SMIC qui sera " +
        "porté au contrat. Vérifiez-le au jour de l'embauche, il change par arrêté.";
      return;
    }
    b.classList.add("cache");
  }

  $("changer-profil").addEventListener("click", function () {
    $("titre-haut").textContent = "Contrats du transport";
    ecran("e-profil");
  });

  Array.prototype.forEach.call(document.querySelectorAll(".nature button"), function (b) {
    b.addEventListener("click", function () {
      NATURE = b.getAttribute("data-n");
      Array.prototype.forEach.call(document.querySelectorAll(".nature button"), function (x) {
        x.classList.toggle("actif", x === b);
      });
      rendreChamps();
    });
  });

  $("partiel").addEventListener("change", function () {
    PARTIEL = $("partiel").checked;
    if (PARTIEL && V.mensuel && Number(V.mensuel) >= PROFIL.mensuel) V.mensuel = "";
    if (!PARTIEL) V.mensuel = String(PROFIL.mensuel);
    rendreChamps();
  });

  /* ─────────────────────────── 3 · le contrat ───────────────────────── */
  function valeurs() {
    var v = {};
    for (var k in V) if (Object.prototype.hasOwnProperty.call(V, k)) v[k] = V[k];
    v.profil = PROFIL.cle;
    v.nature = NATURE;
    v.partiel = PARTIEL;
    v.entreprise = profilEntreprise();
    return v;
  }

  function html(blocs) {
    return blocs.map(function (b) {
      if (b.k === "trait") return '<p class="trait"></p>';
      if (b.k === "h2") return "<h2>" + ech(b.t) + "</h2>";
      if (b.k === "table") {
        return "<table><thead><tr>" + b.head.map(function (h) { return "<th>" + ech(h) + "</th>"; }).join("") +
          "</tr></thead><tbody>" + b.rows.map(function (r) {
            return "<tr>" + r.map(function (c) { return "<td>" + ech(c) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody></table>";
      }
      if (b.k === "puce") return '<p class="puce">- ' + ech(b.t) + "</p>";
      return '<p class="' + (b.k === "sur" || b.k === "t1" || b.k === "note" ? b.k : "") + '">' +
        ech(b.t) + "</p>";
    }).join("");
  }

  $("produire").addEventListener("click", function () {
    var v = valeurs();
    BLOCS = CT.ecrire(v);
    ANNEXE = CT.annexeDue(v) ? CT.annexeDemande(v) : [];
    HORS = CT.reserve(v);
    $("contrat").innerHTML = html(BLOCS);
    $("annexe").classList.toggle("cache", !ANNEXE.length);
    $("annexe").innerHTML = ANNEXE.length
      ? html(ANNEXE.filter(function (b) { return b.k !== "saut"; })) : "";
    $("hors").innerHTML = html(HORS.filter(function (b) { return b.k !== "saut"; }));
    rendreFormalites(v);
    rendreDroit();
    rendreMaj();
    $("etat").textContent = "";
    $("titre-haut").textContent = (NATURE === "cdd" ? "CDD " : "CDI ") + PROFIL.nom.toLowerCase();
    garder();
    ecran("e-contrat");
  });

  $("reprendre").addEventListener("click", function () {
    $("titre-haut").textContent = PROFIL.nom;
    ecran("e-champs");
  });

  function rendreFormalites(v) {
    var L = CT.formalites(v);
    $("formalites").innerHTML = "<h3>Les formalités, et quand</h3>" + L.map(function (f) {
      return '<div class="l"><div class="q">' + ech(f.quoi) + "</div>" +
        '<div class="d">' + ech(f.quand) + (f.ou ? " · " + ech(f.ou) : "") + "</div>" +
        (f.loi ? '<div class="f">' + ech(f.loi) + "</div>" : "") + "</div>";
    }).join("");
  }

  function rendreDroit() {
    $("droit").innerHTML = CT.DROIT.map(function (g) {
      return "<h4>" + ech(g.t) + "</h4>" + g.a.map(function (a) {
        return '<div class="a"><b>' + ech(a[0]) + "</b> - " + ech(a[1]) +
          "<span>" + ech(a[2]) + "</span></div>";
      }).join("");
    }).join("");
  }

  /* LA CONVENTION, RELUE À LA DEMANDE.
     Les montants inscrits ici portent leur date. Ce bouton va les relire sur
     Légifrance, par le même relais que la recherche, et dit si le texte lu est
     toujours celui qui est écrit. Il ne change rien tout seul : il compare et
     il rapporte. */
  function rendreMaj() {
    $("maj").innerHTML = "Convention collective IDCC 16, lue le " + CT.dateFr(CT.CCN.lu) + ". " +
      "Frais de déplacement du " + CT.dateFr(CT.CCN.frais.depuis) + ", taux horaires du " +
      CT.dateFr(CT.CCN.salaires.depuis) + ".<br>" +
      '<button type="button" id="relire">Vérifier la convention sur Légifrance</button>' +
      '<div id="dit-maj" style="margin-top:8px"></div>';
    var b = $("relire");
    if (b) b.addEventListener("click", relire);
  }

  function relire() {
    var d = $("dit-maj");
    d.textContent = "Lecture en cours...";
    Promise.all([
      lireTexte("KALITEXT000053715762"),
      lireTexte("KALITEXT000049067154"),
    ]).then(function (r) {
      var lignes = [];
      if (r[0]) lignes.push("Frais de déplacement : « " + r[0].titre + " », en vigueur depuis le " +
        CT.dateFr(r[0].date) + ".");
      if (r[1]) lignes.push("Rémunérations : « " + r[1].titre + " », en vigueur depuis le " +
        CT.dateFr(r[1].date) + ".");
      if (!lignes.length) { d.textContent = "Légifrance n'a rien rendu. Réessayez plus tard."; return; }
      var memeFrais = r[0] && r[0].date === CT.CCN.frais.depuis;
      var memeSalaire = r[1] && r[1].date === CT.CCN.salaires.depuis;
      lignes.push(memeFrais && memeSalaire
        ? "Ce sont bien les textes portés au contrat."
        : "Un texte a changé de date : signalez-le, les montants du module sont à reprendre.");
      d.innerHTML = lignes.map(ech).join("<br>");
    }).catch(function () {
      d.textContent = "Lecture impossible. Le relais n'a pas répondu.";
    });
  }

  function lireTexte(id) {
    return window.fetch(RELAIS, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "ccn-texte", id: id }),
    }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && j.titre ? j : null; })
      .catch(function () { return null; });
  }

  /* ─────────────────────── le document, à emporter ──────────────────── */
  /* Le contrat est éditable à l'écran : ce qui part en Word est ce qui est
     à l'écran au moment du clic, et non ce qui a été produit. */
  function blocsDeLEcran(zone) {
    var out = [];
    Array.prototype.forEach.call($(zone || "contrat").children, function (n) {
      var t = n.textContent.trim();
      if (n.tagName === "H2") { out.push({ k: "h2", t: t }); return; }
      if (n.tagName === "TABLE") {
        var head = [], rows = [];
        Array.prototype.forEach.call(n.querySelectorAll("thead th"), function (c) { head.push(c.textContent.trim()); });
        Array.prototype.forEach.call(n.querySelectorAll("tbody tr"), function (r) {
          var L = [];
          Array.prototype.forEach.call(r.children, function (c) { L.push(c.textContent.trim()); });
          rows.push(L);
        });
        out.push({ k: "table", head: head, rows: rows });
        return;
      }
      if (n.classList.contains("trait")) { out.push({ k: "trait" }); return; }
      if (!t) { out.push({ k: "p", t: "" }); return; }
      if (n.classList.contains("sur")) { out.push({ k: "sur", t: t }); return; }
      if (n.classList.contains("t1")) { out.push({ k: "t1", t: t }); return; }
      if (n.classList.contains("note")) { out.push({ k: "note", t: t }); return; }
      if (n.classList.contains("puce")) { out.push({ k: "puce", t: t.replace(/^-\s*/, "") }); return; }
      out.push({ k: "p", t: t });
    });
    return out;
  }

  function nomFichier() {
    var qui = (V.nom || "salarie").replace(/[^A-Za-zÀ-ÿ0-9]+/g, "-").replace(/^-|-$/g, "");
    return (NATURE === "cdd" ? "CDD" : "CDI") + (PARTIEL ? "-temps-partiel" : "") + "-" + qui + ".docx";
  }

  $("word").addEventListener("click", function () {
    if (!window.AuditExport) return;
    var titre = (NATURE === "cdd" ? "Contrat à durée déterminée" : "Contrat à durée indéterminée") +
      " - " + (V.nom || "");
    var corps = blocsDeLEcran("contrat");
    if (ANNEXE.length) corps = corps.concat([{ k: "saut" }], blocsDeLEcran("annexe"));
    var octets = window.AuditExport.docx(corps, titre);
    window.AuditExport.telecharger(octets, nomFichier());
    $("etat").textContent = ANNEXE.length
      ? "Contrat et annexe téléchargés. La note hors contrat est dans le second bouton."
      : "Contrat téléchargé. La note hors contrat est dans le second bouton.";
  });

  /* La note hors contrat part dans son propre fichier : dans le même que le
     contrat, elle finissait chez le salarié. Signalé à la relecture du
     24 septembre 2026. */
  $("word-note").addEventListener("click", function () {
    if (!window.AuditExport || !HORS.length) return;
    var octets = window.AuditExport.docx(
      HORS.filter(function (b) { return b.k !== "saut"; }),
      "Réserve d'usage et observation - " + (PROFIL ? PROFIL.nom : ""));
    window.AuditExport.telecharger(octets, "Note-hors-contrat-" +
      (NATURE === "cdd" ? "CDD" : "CDI") + ".docx");
    $("etat").textContent = "Note téléchargée, séparément du contrat.";
  });

  $("imprimer").addEventListener("click", function () { window.print(); });

  $("garder").addEventListener("click", function () {
    if (!window.Documents || !window.AuditExport) return;
    var titre = (NATURE === "cdd" ? "CDD" : "CDI") + " - " + (V.nom || "salarié");
    var corps2 = blocsDeLEcran("contrat");
    if (ANNEXE.length) corps2 = corps2.concat([{ k: "saut" }], blocsDeLEcran("annexe"));
    var octets = window.AuditExport.docx(corps2, titre);
    window.Documents.enregistrer("contrats", {
      nom: nomFichier(), sorte: "produit",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      note: PROFIL.nom + ", " + (V.coef || "") + ", " + (V.entree ? CT.dateFr(V.entree) : ""),
      contenu: new Blob([octets], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }),
    }).then(function () {
      $("etat").textContent = "Gardé dans « Mes documents ».";
    }).catch(function () {
      $("etat").textContent = "Impossible de garder le document sur cet appareil.";
    });
  });

  $("retour").addEventListener("click", function () {
    if (!$("e-contrat").classList.contains("cache")) {
      $("titre-haut").textContent = PROFIL.nom;
      ecran("e-champs");
      return;
    }
    if (!$("e-champs").classList.contains("cache")) {
      $("titre-haut").textContent = "Contrats du transport";
      ecran("e-profil");
      return;
    }
    window.location.href = "gerer.html";
  });

  /* Le rappel de l'entreprise, comme sur les autres écrans. */
  (function entete() {
    var p = profilEntreprise();
    var bits = [];
    if (p.denomination) bits.push(p.denomination);
    if (p.effectif) bits.push(p.effectif + " salariés");
    $("ent").textContent = bits.join(" · ");
  })();

  rendreProfils();

})(window, document);
