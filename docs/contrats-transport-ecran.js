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
    ["e-profil", "e-champs", "e-contrat", "e-minima"].forEach(function (x) {
      var el = $(x);
      if (el) el.classList.toggle("cache", x !== id);
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
    /* LES DONNÉES DU SALARIÉ PRÉCÉDENT NE RESTENT PAS SUR LE SUIVANT. En
       repassant à la saisie à la main, le formulaire gardait la date d'entrée,
       la naissance et la nationalité de celui d'avant : un nouvel embauché
       sortait « en poste depuis le 5 février 2026 », sans essai ni déclaration
       préalable. Relevé le 26 septembre 2026. */
    if (i === "") {
      ["nom", "naissance", "lieuNaissance", "nationalite", "nir", "adresse", "entree",
       "groupe", "sexe", "emploi"].forEach(function (c) { V[c] = ""; });
      V.entree = iso(new Date());
      rendreChamps();
      return;
    }
    var s = salariesDuRegistre()[Number(i)];
    if (!s) return;
    /* D'un salarié du registre à un autre, ce que le premier avait et que le
       second n'a pas restait à l'écran : l'adresse, le lieu de naissance, le
       numéro de sécurité sociale. On vide d'abord, on remplit ensuite avec ce
       que le registre porte. Relevé le 27 septembre 2026. */
    ["nom", "naissance", "lieuNaissance", "nationalite", "nir", "adresse", "entree",
     "groupe", "sexe", "emploi", "titreTravail", "titreNumero", "titreFin"]
      .forEach(function (c) { V[c] = ""; });
    if (s.adr) V.adresse = s.adr;
    if (s.nir) V.nir = s.nir;
    if (s.naisLieu) V.lieuNaissance = s.naisLieu;
    V.nom = (String(s.nom || "").trim() + " " + String(s.pre || "").trim()).trim();
    if (s.nat) V.nationalite = s.nat;
    if (s.nais) V.naissance = s.nais;
    if (s.emp) V.emploi = s.emp;
    if (s.ent) V.entree = s.ent;
    if (s.qua) V.groupe = s.qua;
    /* Le sexe ne s'affiche pas dans le contrat, mais il l'accorde : sans lui,
       une conductrice sortait « né le » et « désigné le salarié ». */
    if (s.sexe) V.sexe = s.sexe;
    rendreChamps();
    direSiLeProfilNeVaPas(s);
  });

  /* L'EMPLOI DU REGISTRE CONTRE LE PROFIL CHOISI.

     Le profil commande le permis, la FIMO, la FCO, la carte de conducteur et
     le temps de service : posé sur une assistante de direction, il écrit un
     contrat faux de bout en bout. On ne change rien à la place de
     l'utilisateur, on le dit et on propose le bon profil. */
  var CONDUIT = /conducteur|conductrice|chauffeur|routier|livreur|coursier/i;
  function direSiLeProfilNeVaPas(s) {
    var z = $("alerte-profil");
    if (!z) return;
    var emploi = String(s && s.emp || "").trim();
    if (!emploi || !PROFIL) { z.classList.add("cache"); return; }
    var conduit = CONDUIT.test(emploi);
    if (conduit === !!PROFIL.conduite) { z.classList.add("cache"); return; }
    z.textContent = conduit
      ? "Le registre porte « " + emploi + " », qui est un emploi de conduite, alors que le profil "
        + "choisi est « " + PROFIL.nom + " » : le contrat n'écrira ni le temps de service du "
        + "transport, ni les titres de conduite. Changez d'emploi si c'est une erreur."
      : "Le registre porte « " + emploi + " », qui n'est pas un emploi de conduite, alors que le "
        + "profil choisi est « " + PROFIL.nom + " » : le contrat exigera le permis, la FIMO, la FCO "
        + "et la carte de conducteur. Changez d'emploi avec le bouton ci-dessous.";
    z.classList.remove("cache");
  }

  function ouvrirProfil(cle) {
    PROFIL = CT.profil(cle);
    $("titre-haut").textContent = PROFIL.nom;
    V = {};
    if ($("alerte-profil")) $("alerte-profil").classList.add("cache");
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
    /* Le titre de travail ne se demande qu'à qui en a besoin : la liste de
       R. 5221-2 dispense les ressortissants de l'Union, de l'Espace économique
       européen et de la Suisse. Relevé le 27 septembre 2026, où rien ne le
       demandait à personne. */
    if (window.ListesValeurs && window.ListesValeurs.titreDeTravailRequis &&
        window.ListesValeurs.titreDeTravailRequis(V.nationalite) === true) {
      L = L.concat([
        { id: "titreTravail", nom: "Titre autorisant à travailler", t: "text", large: true,
          sous: "sa nature : carte de séjour pluriannuelle, titre de séjour salarié, autorisation de travail" },
        { id: "titreNumero", nom: "Numéro du titre", t: "text" },
        { id: "titreFin", nom: "Valable jusqu'au", t: "date",
          sous: "L. 5221-8 : l'entreprise s'assure de son existence auprès de la préfecture" },
      ]);
    }
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
      sous: "À vérifier : les taux conventionnels appliqués ici datent du 1er décembre 2023, et " +
        "deux grilles leur sont postérieures, du 1er mai 2025 et du 1er avril 2026" });
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
      emploi: PROFIL.emploi || PROFIL.nom,
      coef: PROFIL.coefDefaut,
      mensuel: String(PROFIL.mensuel),
      taux: String(CT.tauxDe(PROFIL.coefDefaut, PROFIL.cle) || ""),
      smic: String(CT.CCN.smic.valeur),
      entree: iso(new Date()),
      dateSignature: iso(new Date()),
      lieu: g.lieu || ent.adresse || "",
      lieuSignature: g.lieuSignature || "",
      zone: "national et européen",
      /* LES ORGANISMES VIENNENT DE LA FICHE, PAS DU CONTRAT.

         Ils ne changent ni d'un salarié à l'autre ni d'un contrat à l'autre :
         ils se saisissent une fois sur la fiche d'entreprise et se reposent
         ici tout seuls. Ce qui a déjà été tapé sur cet appareil l'emporte,
         et ce qui est modifié dans le contrat ne remonte pas à la fiche.
         Demande du 26 septembre 2026. */
      retraite: ent.orgRetraite || "",
      prevoyance: ent.orgPrevoyance || "",
      sante: ent.orgSante || "",
      urssaf: ent.orgUrssaf || "",
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
    verifierPartiel();
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
    if (c === "mensuel" || c === "hebdo") verifierPartiel();
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
  /* UN TEMPS PARTIEL NE PEUT PAS ATTEINDRE LA DURÉE DE LA CATÉGORIE. La case
     « temps partiel » cochée, le contrat sortait avec « 151,67 heures par
     mois », c'est-à-dire la durée légale, et personne ne le disait : un tel
     contrat n'est pas un temps partiel. Relevé le 26 septembre 2026. */
  function verifierPartiel() {
    var b = $("alerte-partiel");
    if (!b) return;
    var m = Number(String(V.mensuel || "").replace(",", ".")) || 0;
    if (!PARTIEL || !m || !PROFIL.mensuel || m < PROFIL.mensuel) { b.classList.add("cache"); return; }
    b.classList.remove("cache");
    b.innerHTML = "<b>Ce n'est plus un temps partiel.</b> Vous avez porté " + ech(CT.fr(m, 2)) +
      " heures par mois, alors que la durée de la catégorie est de " + ech(CT.fr(PROFIL.mensuel, 2)) +
      " heures. Un contrat à temps partiel est celui dont la durée est inférieure à la durée " +
      "légale ou conventionnelle : baissez la durée, ou décochez la case.";
  }
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
    verifierPartiel();
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


  /* CE QU'UNE ALERTE CONDAMNE NE S'ÉCRIT PAS.

     Relevé le 27 septembre 2026 : l'alerte du profil s'affichait, et le contrat
     se produisait quand même, avec le temps de service d'un conducteur pour une
     assistante de direction. Même chose pour un « temps partiel » à la durée
     légale, pour un contrat à durée déterminée sans motif ni terme, et pour un
     contrat à durée déterminée proposé à un salarié que le registre porte en
     contrat à durée indéterminée.

     Ce ne sont pas des avertissements de forme : chacun rend le contrat
     attaquable, et deux d'entre eux le requalifient. Ils empêchent donc
     l'écriture, et le disent en une phrase, avec le texte.

     L. 1242-12 (LEGIARTI000006901206, deux lectures concordantes au relais le
     27 septembre 2026) : le contrat à durée déterminée « est établi par écrit et
     comporte la définition précise de son motif », et « à défaut, il est réputé
     conclu pour une durée indéterminée ». Le même article impose la date du
     terme, ou la durée minimale quand le terme n'est pas précis. */
  function empechements() {
    var E = [];
    var s = salarieDuRegistre();
    var emploi = String((s && s.emp) || V.emploi || "").trim();
    if (emploi && PROFIL) {
      var conduit = CONDUIT.test(emploi);
      if (conduit !== !!PROFIL.conduite)
        E.push(conduit
          ? "L'emploi « " + emploi + "  » est un emploi de conduite, et le profil retenu est « " +
            PROFIL.nom + " » : le contrat n'écrirait ni le temps de service du transport, ni les " +
            "titres de conduite. Choisissez le profil qui correspond."
          : "L'emploi « " + emploi + " » n'est pas un emploi de conduite, et le profil retenu est " +
            "« " + PROFIL.nom + " » : le contrat exigerait le permis, la FIMO, la FCO et la carte " +
            "de conducteur d'une personne qui ne conduit pas. Changez d'emploi ou de profil.");
    }
    var m = Number(String(V.mensuel || "").replace(",", ".")) || 0;
    if (PARTIEL && m && PROFIL && PROFIL.mensuel && m >= PROFIL.mensuel)
      E.push("La durée portée, " + CT.fr(m, 2) + " heures par mois, atteint celle de la catégorie, " +
        CT.fr(PROFIL.mensuel, 2) + " heures : ce n'est pas un temps partiel. Baissez la durée, ou " +
        "décochez la case.");
    if (NATURE === "cdd") {
      if (!String(V.motif || "").trim())
        E.push("Le motif du recours manque. Le contrat à durée déterminée « comporte la définition " +
          "précise de son motif » et, à défaut, « est réputé conclu pour une durée indéterminée » " +
          "(L. 1242-12).");
      if (!V.sansTerme && !String(V.terme || "").trim())
        E.push("La date de fin manque. Le terme se date, sauf dans les cas de L. 1242-7 où le " +
          "contrat est conclu sans terme précis : cochez alors la case et portez la durée minimale " +
          "(L. 1242-12).");
      if (V.sansTerme && !String(V.duree || "").trim())
        E.push("Sans terme précis, la durée minimale est obligatoire (L. 1242-12).");
      if (s && String(s.nature || "").trim() === "cdi")
        E.push("Le registre du personnel porte ce salarié en contrat à durée indéterminée : un " +
          "contrat à durée déterminée ne se conclut pas avec lui sans que le premier ait pris fin. " +
          "Vérifiez le registre.");
    }
    return E;
  }
  /* Le salarié du registre correspondant au nom saisi, s'il y en a un. */
  function salarieDuRegistre() {
    var n = String(V.nom || "").trim().toLowerCase();
    if (!n) return null;
    var out = null;
    (salariesDuRegistre() || []).forEach(function (x) {
      if (out) return;
      var plein = (String(x.nom || "") + " " + String(x.pre || "")).trim().toLowerCase();
      if (plein === n || String(x.nom || "").trim().toLowerCase() === n) out = x;
    });
    return out;
  }

  $("produire").addEventListener("click", function () {
    /* Les empêchements d'abord : un contrat attaquable ne s'écrit pas. */
    var stop = empechements();
    var zone = $("alerte-stop");
    if (stop.length) {
      if (zone) {
        zone.classList.remove("cache");
        zone.innerHTML = "<b>Le contrat n'est pas écrit : " + stop.length +
          (stop.length > 1 ? " points l'empêchent" : " point l'empêche") + ".</b>" +
          "<ul><li>" + stop.map(ech).join("</li><li>") + "</li></ul>";
        zone.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (zone) zone.classList.add("cache");
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
    /* LA CONSIGNE EST À L'ÉCRAN, PAS DANS L'ACTE SIGNÉ.
       « Ne l'antidatez pas » s'adressait à l'employeur et se lisait dans le
       contrat que le salarié signe. Relevé le 27 septembre 2026. */
    $("etat").textContent = dejaEnPoste()
      ? "Contrat de régularisation : il constate la relation en cours et se signe à sa date. " +
        "Ne l'antidatez pas ; c'est l'ancienneté qui remonte, et elle est écrite à l'article 1."
      : "";
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
      if (!lignes.length) {
        d.textContent = REFUS_ORIGINE
          ? "La vérification n'est pas possible depuis cette adresse : le relais de " +
            "l'application la refuse encore. Il n'y a rien à corriger de votre côté. " +
            "Les montants portés au contrat sont ceux des textes cités en pied de page, " +
            "à leur date."
          : "Légifrance n'a rien rendu. Réessayez plus tard.";
        return;
      }
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

  /* LE RELAIS PEUT REFUSER L'ADRESSE, ET CE N'EST PAS UNE PANNE DE LÉGIFRANCE.

     Depuis l'espace client, les trois fonctions répondent « origine refusée » :
     l'écran disait « Légifrance n'a rien rendu, réessayez plus tard », ce qui
     envoie attendre quelque chose qui ne viendra pas. Relevé le 26 septembre
     2026. On distingue le refus d'adresse du silence de Légifrance. */
  var REFUS_ORIGINE = false;
  function lireTexte(id) {
    return window.fetch(RELAIS, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "ccn-texte", id: id }),
    }).then(function (r) {
      if (r.status === 403) {
        return r.json().catch(function () { return null; }).then(function (d) {
          if (d && d.erreur === "ORIGINE_REFUSEE") REFUS_ORIGINE = true;
          return null;
        });
      }
      return r.ok ? r.json() : null;
    }).then(function (j) { return j && j.titre ? j : null; })
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
    /* Le fichier porte l'entreprise en pied de page et son dirigeant comme
       auteur : la case Auteur restait vide, et rien ne disait de qui venait
       le document. Relevé le 26 septembre 2026. */
    var ent = profilEntreprise();
    var octets = window.AuditExport.docx(corps, titre, {
      auteur: String(ent.responsable || ent.denomination || "").trim(),
      pied: String(ent.denomination || ent.entreprise || "").trim() + "  ·  " + titre,
    });
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
    var entN = profilEntreprise();
    var octets = window.AuditExport.docx(
      HORS.filter(function (b) { return b.k !== "saut"; }),
      "Réserve d'usage et observation - " + (PROFIL ? PROFIL.nom : ""),
      { auteur: String(entN.responsable || entN.denomination || "").trim(),
        pied: String(entN.denomination || entN.entreprise || "").trim() + "  ·  note hors contrat" });
    /* Le fichier portait le même nom pour tout le monde : deux notes dans le
       même dossier se recouvraient. Relevé le 27 septembre 2026. */
    var quiN = (V.nom || "salarie").replace(/[^A-Za-zÀ-ÿ0-9]+/g, "-").replace(/^-|-$/g, "");
    window.AuditExport.telecharger(octets, "Note-hors-contrat-" +
      (NATURE === "cdd" ? "CDD" : "CDI") + "-" + quiN + ".docx");
    $("etat").textContent = "Note téléchargée, séparément du contrat.";
  });

  $("imprimer").addEventListener("click", function () { window.print(); });

  /* L'EMBAUCHE ÉCRITE UNE FOIS, REPRISE PARTOUT.

     Le contrat produit ici ne remontait nulle part : le registre du
     personnel, la fiche conducteur et l'agenda ignoraient le nouvel
     embauché, et la déclaration préalable, la visite d'information et la fin
     de la période d'essai n'étaient rappelées nulle part. Relevé le
     26 septembre 2026.

     Le bouton fait les trois, et il dit ce qu'il a fait : une ligne ajoutée
     ou complétée, une fiche ouverte, des échéances posées. Il n'écrase jamais
     une donnée déjà écrite ailleurs. */
  /* Un salarié déjà en poste n'a pas de fin d'essai à poser dans l'agenda :
     le contrat qu'on écrit pour lui est un contrat de régularisation. */
  function dejaEnPoste() {
    if (!V.entree) return false;
    var e = new Date(String(V.entree) + "T12:00:00"), a = new Date();
    a.setHours(0, 0, 0, 0);
    return !isNaN(e) && e < a;
  }
  function finEssai() {
    if (!V.entree || !window.EcheancesSalaries || dejaEnPoste()) return "";
    var d = String(V.essai || "").trim();
    if (!d) d = (PROFIL && PROFIL.annexe === "II") ? CT.CCN.annexeII.essai
      : ((PROFIL && PROFIL.conduite) ? CT.CCN.annexeI.essaiConduite : CT.CCN.annexeI.essaiAutres);
    var m = String(d).match(/(\d+)\s*(mois|semaines?|jours?)/i);
    if (!m) return "";
    var n = parseInt(m[1], 10);
    if (/mois/i.test(m[2])) return window.EcheancesSalaries.plusMois(V.entree, n);
    if (/semaine/i.test(m[2])) return window.EcheancesSalaries.plusJours(V.entree, n * 7);
    return window.EcheancesSalaries.plusJours(V.entree, n);
  }

  $("inscrire").addEventListener("click", function () {
    if (!window.EcheancesSalaries) return;
    var nom = String(V.nom || "").trim();
    if (!nom) { $("etat").textContent = "Le nom du salarié manque : rien n'a été inscrit."; return; }
    var parts = window.EcheancesSalaries.couper(nom);
    var r = window.EcheancesSalaries.inscrire({
      nom: parts.nom, pre: parts.pre,
      nat: V.nationalite, nais: V.naissance, emp: V.emploi, adr: V.adresse,
      qua: V.coef ? "Coefficient " + V.coef
        : (/annexe II\b/.test(String((PROFIL && PROFIL.essaiArticle) || "")) ? "Employé" : "Ouvrier"),
      ent: V.entree,
      nature: NATURE === "cdd" ? "cdd" : "cdi", part: PARTIEL ? "partiel" : "complet",
      essai: finEssai(), terme: NATURE === "cdd" ? V.terme : "",
    });
    /* La durée de service du poste part avec l'embauche : c'est elle que le
       décompte des heures compare au mois compté, et sans elle il retombait
       sur une semaine de bureau. */
    if (r && PROFIL) window.EcheancesSalaries.poser(r.id, {
      heuresSemaine: String(PROFIL.hebdo || ""),
      heuresMois: String(PROFIL.mensuel || ""),
      dureeQuoi: "temps de service du poste " + String(PROFIL.nom || "") +
        ", convention collective des transports routiers",
      /* La catégorie de R. 3312-50 part avec l'embauche : c'est elle qui donne
         au décompte des heures le plafond hebdomadaire du poste, cinquante-six
         heures pour le grand routier, cinquante-deux pour les autres roulants.
         Sans elle, le décompte appliquait les quarante-huit heures du code du
         travail à un conducteur. Relevé le 26 septembre 2026. */
      categorieTransport: PROFIL.roulant ? (PROFIL.grandRoutier ? "grand" : "courte") : "",
      /* Le titre qui autorise à travailler part avec l'embauche : sans sa
         date de fin, personne ne voit venir son échéance. L. 5221-8. */
      titreTravail: V.titreTravail || "",
      titreNumero: V.titreNumero || "",
      titreFin: V.titreFin || "",
    });
    if (!r) { $("etat").textContent = "Rien n'a été inscrit."; return; }
    var dits = [];
    dits.push(r.nouveau ? "inscrit au registre du personnel"
      : (r.complets.length ? "complété au registre (" + r.complets.length + " renseignement" +
          (r.complets.length > 1 ? "s" : "") + ")" : "déjà au registre, rien à compléter"));
    if (r.fiche) dits.push("fiche conducteur ouverte dans Flotte");
    dits.push(dejaEnPoste()
      ? "échéances posées dans l'agenda : entretien de parcours professionnel" +
        (NATURE === "cdd" && V.terme ? ", terme du contrat" : "") +
        ". La déclaration préalable et la visite d'embauche ne sont pas reposées : " +
        "le salarié est en poste depuis le " + CT.dateFr(V.entree)
      : "échéances posées dans l'agenda : déclaration préalable, visite d'information et de prévention, entretien de parcours" +
        (finEssai() ? ", fin de période d'essai" : "") +
        (NATURE === "cdd" && V.terme ? ", terme du contrat" : ""));
    $("etat").textContent = nom + " : " + dits.join(" ; ") + ".";
  });

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

  /* LE CONTRAT ÉCRIT, LE SALARIÉ INSCRIT. Mesuré le 26 septembre 2026 : un
     contrat écrit et gardé n'apparaissait ni au registre, ni au décompte des
     heures, ni dans la flotte, et l'embauche se ressaisissait trois fois.
     Un bouton l'inscrit au registre, d'où les heures et la flotte le lisent.
     Rien ne s'écrit sans ce geste : un contrat en projet n'est pas encore
     une embauche. */
  /* DEUX ÉCOUTEURS SUR LE MÊME BOUTON, ET LE SECOND DÉFAISAIT LE PREMIER.

     Un clic sur « Inscrire au registre » passait dans deux gestionnaires.
     Le premier appelait EcheancesSalaries.inscrire, qui retire la civilité
     et coupe le nom du prénom ; le second recoupait le même nom autrement,
     ne trouvait donc pas la ligne qui venait d'être écrite, et en ajoutait
     une seconde : « MARTIN | Lucie » d'un côté, « MARTIN | Madame Lucie »
     de l'autre, pour un seul contrat. Pire, il écrivait
     « E.salaries.filter(function (s) { return !s.ex; }) » : chaque
     inscription effaçait du registre tous les salariés sortis, que
     L. 1221-13 y fait garder cinq ans après le départ. Relevé le
     28 septembre 2026. Le second gestionnaire est supprimé ; l'adresse
     qu'il portait passe désormais par le premier. */

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


  /* ══════════════════════════════════════════════════════════════════════
     4 · LES MINIMA PAR COEFFICIENT, ET LES SALAIRES VERSÉS

     « Convention collective, minima : aucune comparaison entre les minima et
     les salaires. Table des minima par coefficient, et alerte à chaque
     avenant. » Ligne de la contre-vérification du 26 septembre 2026, faite le
     28.

     La table des minima existait déjà dans le fond du module, avec ses sources
     et ses identifiants, mais elle n'était jamais montrée : elle ne servait
     qu'à écrire un contrat, un salarié à la fois. Cet écran la sort, y range
     les salaires que l'utilisatrice porte elle-même, et dit l'écart.

     CE QU'IL NE FAIT PAS. Le registre du personnel ne porte pas les salaires,
     et rien ici ne les devine : ils se saisissent, et ils sont gardés sur le
     poste sous la clé « minima-salaires ». Un salarié sans salaire porté reste
     sans verdict, il n'est pas réputé conforme.
     ══════════════════════════════════════════════════════════════════════ */

  var CLE_SAL = "minima-salaires";
  function salaires() {
    try { return JSON.parse(window.localStorage.getItem(CLE_SAL) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function garderSalaires(o) {
    try { window.localStorage.setItem(CLE_SAL, JSON.stringify(o)); } catch (e) {}
  }
  function registreSalaries() {
    var R = null;
    try { R = JSON.parse(window.localStorage.getItem("registre-personnel") || "null"); }
    catch (e) { R = null; }
    var L = (R && R.salaries) || [];
    var auj = iso(new Date());
    return L.filter(function (s) {
      if (!s || s.ex) return false;
      var e = String(s.ent || "").trim(), o = String(s.sor || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(e) || e > auj) return false;
      return !(/^\d{4}-\d{2}-\d{2}$/.test(o) && o <= auj);
    });
  }

  /* LE TABLEAU DES MINIMA, DANS L'ORDRE DES COEFFICIENTS.
     Deux grilles, parce que la convention en a deux : les ouvriers de
     l'annexe I, en coefficients M, et les employés de l'annexe II, sans
     lettre. Chaque ligne porte son groupe quand la table des groupes le
     donne, son taux horaire, et la garantie annuelle de la durée retenue. */
  function lignesMinima() {
    var S = CT.CCN.salaires, G = CT.CCN.groupes || { parCoefficient: {} };
    var out = [];
    Object.keys(S.ouvriers).forEach(function (c) {
      out.push({ grille: "Ouvriers, annexe I", coef: c,
        groupe: G.parCoefficient[c] || "",
        taux: S.ouvriers[c],
        gar: (S.gar["151.67"] || {})[c] || null });
    });
    Object.keys(S.employes).forEach(function (c) {
      out.push({ grille: "Employés, annexe II", coef: c, groupe: "",
        taux: S.employes[c],
        gar: (S.garEmployes || {})[c] || null });
    });
    return out;
  }

  function tableauMinima() {
    var S = CT.CCN.salaires;
    var par = {};
    lignesMinima().forEach(function (l) {
      if (!par[l.grille]) par[l.grille] = [];
      par[l.grille].push(l);
    });
    var h = "";
    Object.keys(par).forEach(function (g) {
      h += "<h3>" + ech(g) + "</h3>";
      h += '<div class="min-t"><div class="min-l min-e">' +
        "<span>Coefficient</span><span>Groupe</span><span>Taux horaire</span>" +
        "<span>Garantie annuelle</span></div>";
      par[g].forEach(function (l) {
        h += '<div class="min-l"><span>' + ech(l.coef) + "</span><span>" +
          (l.groupe ? ech(l.groupe) : "&mdash;").replace("&mdash;", "-") + "</span><span>" +
          CT.fr(l.taux, 4) + " &euro;</span><span>" +
          (l.gar ? CT.fr(l.gar, 2) + " &euro;" : "-") + "</span></div>";
      });
      h += "</div>";
    });
    h += '<p class="aide">Garantie annuelle donnée pour 151,67 heures par mois chez les ' +
      "ouvriers. Les garanties de 169 et de 200 heures figurent au contrat de chaque " +
      "salarié concerné, selon son temps de service.</p>";
    h += '<p class="aide">Source : ' + ech(S.source) + ", " + ech(S.article) +
      ", en vigueur au " + ech(CT.dateFr(S.depuis)) + ".</p>";
    return h;
  }

  /* L'ALERTE DES AVENANTS POSTÉRIEURS.
     Le fond du module porte la liste des annexes de taux horaires parues
     depuis la grille recopiée, dont les tableaux n'ont pas été lus. Elle était
     écrite dans un commentaire et dans la réserve d'un contrat ; elle est ici
     en tête de l'écran, parce que c'est elle qui décide si les chiffres
     ci-dessous valent encore. */
  function alerteAvenants() {
    var S = CT.CCN.salaires, p = S.posterieures || [];
    if (!p.length)
      return "<b>Aucun avenant postérieur connu.</b> La grille ci-dessous est la dernière " +
        "lue. Revenez la confronter au texte de la convention avant chaque embauche.";
    return "<b>" + p.length + (p.length > 1 ? " annexes de taux horaires sont parues" :
      " annexe de taux horaires est parue") + " depuis cette grille, et " +
      (p.length > 1 ? "leurs tableaux n'ont pas été lus" : "son tableau n'a pas été lu") +
      " ici : " +
      p.map(function (x) { return ech(x.quand) + " (" + ech(x.id) + ")"; }).join(", ") +
      ". Les chiffres ci-dessous sont ceux du " + ech(CT.dateFr(S.depuis)) +
      " : confrontez-les à " + (p.length > 1 ? "ces annexes" : "cette annexe") +
      " avant de conclure qu'un salaire est au-dessus du minimum. Un écart calculé sur " +
      "une grille dépassée ne prouve rien.";
  }

  /* LA COMPARAISON, SALARIÉ PAR SALARIÉ.
     Le coefficient et le salaire se portent ici. Le minimum retenu est le plus
     élevé du taux conventionnel et du SMIC horaire, quand le SMIC est porté :
     c'est la règle que l'écran du contrat applique déjà. */
  function tauxDuCoef(coef) {
    var S = CT.CCN.salaires;
    if (S.ouvriers[coef] != null) return S.ouvriers[coef];
    if (S.employes[coef] != null) return S.employes[coef];
    return null;
  }
  function tousCoefs() {
    var S = CT.CCN.salaires;
    return Object.keys(S.ouvriers).concat(Object.keys(S.employes));
  }
  function comparaison() {
    var L = registreSalaries(), SAL = salaires();
    if (!L.length)
      return '<p class="aide">Le registre du personnel ne porte aucun salarié présent ce jour : ' +
        "inscrivez-les au registre, et la comparaison se fera ici, nom par nom.</p>";
    var smic = parseFloat(String(SAL.smic || "").replace(",", ".")); // euros par heure
    var h = "<h3>Vos salariés, et l'écart au minimum</h3>";
    h += '<label class="min-smic">SMIC horaire brut en vigueur' +
      '<input type="text" inputmode="decimal" id="min-smic" value="' +
      ech(SAL.smic || "") + '" placeholder="par exemple 11,88"></label>';
    if (!isFinite(smic) || smic <= 0)
      h += '<p class="aide">Sans le SMIC, l\'écart est calculé sur le seul taux conventionnel. ' +
        "Or le SMIC l'emporte quand il est plus élevé : portez-le pour que le verdict soit juste.</p>";
    var enDessous = 0, sans = 0;
    var corps = "";
    L.forEach(function (s) {
      var id = String(s.id || (s.nom + "|" + s.pre));
      var mien = SAL[id] || {};
      var coef = String(mien.coef || "");
      var brut = parseFloat(String(mien.taux || "").replace(",", "."));
      var tc = coef ? tauxDuCoef(coef) : null;
      var mini = null;
      if (tc != null) mini = (isFinite(smic) && smic > tc) ? smic : tc;
      else if (isFinite(smic) && smic > 0) mini = smic;
      var verdict, classe = "";
      if (!coef) { verdict = "coefficient à choisir"; sans++; }
      else if (!isFinite(brut) || brut <= 0) { verdict = "taux horaire à porter"; sans++; }
      else if (mini == null) { verdict = "minimum inconnu pour ce coefficient"; sans++; }
      else if (brut < mini) {
        verdict = "EN DESSOUS de " + CT.fr(mini - brut, 4) + " euros par heure";
        classe = " min-ko"; enDessous++;
      } else {
        verdict = "au-dessus de " + CT.fr(brut - mini, 4) + " euros par heure";
        classe = " min-ok";
      }
      corps += '<div class="min-s' + classe + '">' +
        '<span class="n">' + ech(s.nom + " " + s.pre) + "</span>" +
        '<span class="e">' + ech(String(s.emp || "")) + "</span>" +
        '<div class="deux">' +
        '<label>Coefficient<select data-coef="' + ech(id) + '">' +
        '<option value="">- à choisir -</option>' +
        tousCoefs().map(function (c) {
          return '<option value="' + ech(c) + '"' + (c === coef ? " selected" : "") + ">" +
            ech(c) + "</option>";
        }).join("") + "</select></label>" +
        '<label>Taux horaire versé<input type="text" inputmode="decimal" data-taux="' +
        ech(id) + '" value="' + ech(mien.taux || "") + '" placeholder="euros par heure"></label>' +
        "</div>" +
        '<span class="v">' + (mini != null ? "Minimum applicable : " + CT.fr(mini, 4) +
          " euros. " : "") + ech(verdict) + "</span></div>";
    });
    var tete = "";
    if (enDessous)
      tete = '<div class="alerte">' + "<b>" + enDessous +
        (enDessous > 1 ? " salariés sont payés en dessous du minimum." :
                         " salarié est payé en dessous du minimum.") +
        "</b> Le minimum conventionnel s'impose au contrat : un salaire inférieur ouvre un " +
        "rappel de salaire sur trois ans (L. 3245-1), et la différence se paie avec les " +
        "congés payés et les cotisations qui s'y rattachent. Régularisez, et gardez la trace " +
        "de la date à laquelle vous l'avez fait.</div>";
    else if (!sans)
      tete = '<div class="min-bien"><b>Aucun salarié en dessous du minimum, sur ce qui est ' +
        "porté ici.</b> Le verdict vaut pour la grille lue, et pour les taux que vous avez " +
        "saisis.</div>";
    if (sans)
      tete += '<p class="aide">' + sans +
        (sans > 1 ? " salariés restent sans verdict" : " salarié reste sans verdict") +
        " : ni conforme, ni non conforme. Portez le coefficient et le taux, et le verdict " +
        "s'écrira.</p>";
    /* Le titre et le champ du SMIC étaient bâtis dans « h » et jamais rendus :
       la fonction retournait « tete + corps » seuls. Relevé le 28 septembre 2026
       en écrivant le contrôle. */
    return h + tete + corps;
  }

  function rendreMinima() {
    $("minima-alerte").innerHTML = alerteAvenants();
    $("minima-table").innerHTML = tableauMinima();
    $("minima-compare").innerHTML = comparaison();
    $("minima-droit").innerHTML = [
      "Les taux horaires et les garanties annuelles viennent de l'accord du 11 octobre 2023 " +
      "relatif à la revalorisation des rémunérations (KALIARTI000049067165), en vigueur au " +
      "1er décembre 2023.",
      "Les groupes rattachés aux coefficients des ouvriers viennent de l'avenant n° 72 du " +
      "5 décembre 1990 à l'annexe I (KALIARTI000005850441).",
      "Le SMIC n'est pas un chiffre de la convention : il change par arrêté, et il se porte " +
      "à la main. C'est le plus élevé des deux qui s'applique.",
      "L'action en paiement du salaire se prescrit par trois ans à compter du jour où celui " +
      "qui l'exerce a connu ou aurait dû connaître les faits (L. 3245-1).",
    ].map(function (x) { return "<p>" + ech(x) + "</p>"; }).join("");
  }

  var VM = $("vers-minima");
  if (VM) VM.addEventListener("click", function () {
    $("titre-haut").textContent = "Les minima de la convention";
    rendreMinima();
    ecran("e-minima");
  });
  var RM = $("minima-retour");
  if (RM) RM.addEventListener("click", function () {
    $("titre-haut").textContent = "Contrats du transport";
    ecran("e-profil");
  });

  /* La saisie : chaque frappe est gardée, et le verdict se réécrit à la
     sortie du champ, pour ne pas redessiner sous les doigts. */
  var ZM = $("minima-compare");
  if (ZM) {
    ZM.addEventListener("change", function (ev) {
      var t = ev.target;
      var o = salaires();
      if (t.id === "min-smic") { o.smic = t.value; garderSalaires(o); rendreMinima(); return; }
      var idc = t.getAttribute("data-coef"), idt = t.getAttribute("data-taux");
      var id = idc || idt;
      if (!id) return;
      o[id] = o[id] || {};
      if (idc) o[id].coef = t.value; else o[id].taux = t.value;
      garderSalaires(o);
      rendreMinima();
    });
  }

  /* LE RELEVÉ EN WORD. Ce qui a été comparé, daté, pour le dossier : un écart
     constaté et non écrit est un écart qui se reperd. */
  var WM = $("minima-word");
  if (WM) WM.addEventListener("click", function () {
    if (!window.AuditExport) return;
    var p = profilEntreprise(), S = CT.CCN.salaires;
    var items = [
      { k: "sur", t: [p.denomination || "", p.siret ? "SIRET " + p.siret : ""]
        .filter(Boolean).join(" · ") },
      { k: "t1", t: "Minima conventionnels et salaires versés" },
      { k: "trait" },
      { k: "p", t: "Relevé établi le " + CT.dateFr(iso(new Date())) +
        ". Convention collective des transports routiers, IDCC 16." },
      { k: "p", t: "Grille retenue : " + S.source + " (" + S.article + "), en vigueur au " +
        CT.dateFr(S.depuis) + "." },
    ];
    (S.posterieures || []).forEach(function (x) {
      items.push({ k: "note", t: "Annexe de taux horaires du " + x.quand + " (" + x.id +
        ") : son tableau n'a pas été lu ici. Les chiffres du présent relevé sont ceux de " +
        CT.dateFr(S.depuis) + " et doivent lui être confrontés." });
    });
    items.push({ k: "h1", t: "Les minima par coefficient" });
    items.push({ k: "table", t: [["Grille", "Coefficient", "Groupe", "Taux horaire", "Garantie annuelle"]]
      .concat(lignesMinima().map(function (l) {
        return [l.grille, l.coef, l.groupe || "-", CT.fr(l.taux, 4) + " euros",
          l.gar ? CT.fr(l.gar, 2) + " euros" : "-"];
      })) });
    var SAL = salaires();
    var smic = parseFloat(String(SAL.smic || "").replace(",", "."));
    items.push({ k: "h1", t: "Les salaires versés, et l'écart" });
    items.push({ k: "p", t: isFinite(smic) && smic > 0
      ? "SMIC horaire brut porté au relevé : " + CT.fr(smic, 4) + " euros."
      : "Le SMIC horaire n'a pas été porté : l'écart est calculé sur le seul taux conventionnel." });
    var L = registreSalaries();
    items.push({ k: "table", t: [["Salarié", "Emploi", "Coefficient", "Taux versé", "Minimum", "Écart"]]
      .concat(L.map(function (s) {
        var id = String(s.id || (s.nom + "|" + s.pre));
        var m = SAL[id] || {};
        var tc = m.coef ? tauxDuCoef(m.coef) : null;
        var brut = parseFloat(String(m.taux || "").replace(",", "."));
        var mini = tc != null ? ((isFinite(smic) && smic > tc) ? smic : tc)
                              : ((isFinite(smic) && smic > 0) ? smic : null);
        var ecart = (mini != null && isFinite(brut) && brut > 0)
          ? (brut < mini ? "en dessous de " + CT.fr(mini - brut, 4) + " euros"
                         : "au-dessus de " + CT.fr(brut - mini, 4) + " euros")
          : "sans verdict";
        return [s.nom + " " + s.pre, String(s.emp || ""), String(m.coef || "-"),
          isFinite(brut) && brut > 0 ? CT.fr(brut, 4) + " euros" : "-",
          mini != null ? CT.fr(mini, 4) + " euros" : "-", ecart];
      })) });
    items.push({ k: "note", t: "L'action en paiement du salaire se prescrit par trois ans " +
      "(L. 3245-1). Un salaire inférieur au minimum conventionnel ouvre un rappel, avec les " +
      "congés payés et les cotisations qui s'y rattachent." });
    items.push({ k: "sign", t: (p.responsableNom || "") +
      (p.responsableQualite ? ", " + p.responsableQualite : "") });
    window.AuditExport.telecharger(
      window.AuditExport.docx(items, "Minima conventionnels et salaires versés"),
      "minima-salaires-" + iso(new Date()) + ".docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  });

  rendreProfils();

})(window, document);
