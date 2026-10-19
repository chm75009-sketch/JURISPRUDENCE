/* Contrôle URSSAF de TEC. Tout se calcule et se garde sur le poste.
   Pas de réseau, pas d'envoi. Les cases et le mandat vivent dans le
   stockage local du navigateur. */
"use strict";
(function () {

  var VISITE = new Date(2026, 10, 17, 9, 30); // 17 novembre 2026, 9h30

  function $(s, r) { return (r || document).querySelector(s); }
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  function get(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---- en-tête entreprise ---- */
  try {
    var prof = JSON.parse(get("profil-entreprise", "null"));
    if (prof && (prof.denomination || prof.entreprise)) $("#ent").textContent = prof.denomination || prof.entreprise;
  } catch (e) {}

  /* ---- compte à rebours ---- */
  (function () {
    var jour = 24 * 3600 * 1000;
    var n = Math.ceil((VISITE - new Date()) / jour);
    var cj = $("#cpt-jours"), ct = $("#cpt-txt");
    if (n > 1) { cj.textContent = n; ct.textContent = "jours avant la visite de l'inspectrice."; }
    else if (n === 1) { cj.textContent = "1"; ct.textContent = "jour avant la visite de l'inspectrice."; }
    else if (n === 0) { cj.textContent = "0"; ct.textContent = "la visite est aujourd'hui."; }
    else { cj.textContent = "✓"; ct.textContent = "la visite a eu lieu. La période contradictoire est ce qui compte désormais."; }
  })();

  /* ---- rétroplanning ---- */
  var ETAPES = [
    ["1 oct. 2026", "Avis de contrôle reçu, au moins 30 jours avant la visite (article R. 243-59 du code de la sécurité sociale)."],
    ["17 nov. 2026", "Visite de l'inspectrice à 9h30. Contrôle sur place des cotisations depuis le 1er janvier 2023."],
    ["Après la visite", "Lettre d'observations. Elle ouvre la période contradictoire."],
    ["+ 30 jours", "Délai pour répondre, point par point. Porté à 60 jours sur simple demande."],
    ["Ensuite", "Mise en demeure, puis commission de recours amiable dans les deux mois, puis pôle social du tribunal judiciaire."]
  ];
  (function () {
    var box = $("#retro");
    ETAPES.forEach(function (e) {
      var l = el("div", "etape");
      l.appendChild(el("span", "d", e[0]));
      l.appendChild(el("span", "t", e[1]));
      box.appendChild(l);
    });
  })();

  /* ---- pièces à réunir (les trois blocs de l'avis) ---- */
  var BLOCS = [
    ["Documents sociaux", [
      "Dossiers de départ : ruptures conventionnelles, accords transactionnels, jugements prud'homaux",
      "Contrats de travail, notamment ceux ouvrant droit à une exonération de cotisations",
      "Convention collective applicable (transports routiers, IDCC 16)",
      "Conventions de stages",
      "Avantages en nature : calculs détaillés et justificatifs",
      "Contrats de retraite et de prévoyance, acte fondateur",
      "Frais professionnels et déduction forfaitaire spécifique : états détaillés et pièces justificatives",
      "États justificatifs des exonérations et réductions, dont la réduction générale",
      "Déclarations sociales nominatives (DSN)",
      "DAS2 : honoraires et commissions",
      "Documents permettant de reconstituer les éléments de paie, livre de paie détaillé",
      "Registre unique du personnel",
      "Réponse France Travail au questionnaire sur l'assurance chômage du mandataire social ou du conjoint de l'exploitant",
      "Documents relatifs à l'obligation d'emploi des travailleurs handicapés"
    ]],
    ["Documents comptables et financiers", [
      "Balances générales, bilans et comptes de résultats",
      "Grands livres de comptabilité générale",
      "Fichier des écritures comptables (FEC) dématérialisé, article L. 47 A du livre des procédures fiscales",
      "Factures clients, fournisseurs et sous-traitance, selon sélection comptable",
      "Comptabilité du comité social et économique",
      "Liasses fiscales"
    ]],
    ["Documents administratifs et juridiques", [
      "Conclusions du dernier contrôle fiscal et du dernier contrôle de l'inspection du travail",
      "Contrats et accords d'épargne salariale : participation, intéressement, PEE, PPESV",
      "Extrait d'inscription au registre du commerce ou au répertoire des métiers",
      "Rapports du commissaire aux comptes",
      "Statuts et registres des délibérations"
    ]]
  ];

  (function () {
    var box = $("#pieces"), total = 0, n = 0, inputs = [];
    BLOCS.forEach(function (bloc, bi) {
      var b = el("div", "bloc-p");
      b.appendChild(el("h3", null, bloc[0]));
      bloc[1].forEach(function (txt, pi) {
        total++;
        var id = "p-" + bi + "-" + pi;
        var row = el("div", "piece");
        var cb = el("input"); cb.type = "checkbox"; cb.id = id;
        var coche = get("urssaf-" + id, "") === "1";
        if (coche) { cb.checked = true; row.className = "piece ok"; n++; }
        var lab = el("label", null, txt); lab.setAttribute("for", id);
        cb.addEventListener("change", function () {
          set("urssaf-" + id, cb.checked ? "1" : "0");
          row.className = cb.checked ? "piece ok" : "piece";
          maj();
        });
        row.appendChild(cb); row.appendChild(lab); b.appendChild(row);
        inputs.push(cb);
      });
      box.appendChild(b);
    });
    function maj() {
      var faits = inputs.filter(function (c) { return c.checked; }).length;
      var pc = total ? Math.round(faits * 100 / total) : 0;
      $("#avance-barre").style.width = pc + "%";
      $("#avance-txt").textContent = faits + " sur " + total + " pièces prêtes (" + pc + " %).";
    }
    maj();
  })();

  /* ---- désignation du mandataire ---- */
  function modeleMandat() {
    var prof = null;
    try { prof = JSON.parse(get("profil-entreprise", "null")); } catch (e) {}
    var rep = (prof && prof.responsableNom) || "Chadi EL SAFADI";
    var qual = (prof && prof.responsableQualite) || "gérant";
    return [
      "DÉSIGNATION DES PERSONNES HABILITÉES",
      "à transmettre les documents et informations utiles à l'agent chargé du contrôle",
      "",
      "Mon entreprise, la SARL TEC (SIREN 538 450 479), fait l'objet d'un contrôle par l'URSSAF Île-de-France (référence 8326324-AC-110).",
      "",
      "Je soussigné " + rep + ", agissant en qualité de " + qual + " et représentant légal de l'entreprise,",
      "",
      "déclare donner mandat, pour transmettre à l'agent chargé du contrôle les documents et informations nécessaires à l'exercice de sa mission, à :",
      "",
      "Nom et prénom : .......................................................",
      "Fonction : .............................................................",
      "Courriel et téléphone : ................................................",
      "",
      "La ou les personnes mandatées deviennent les interlocuteurs de l'agent de contrôle. Elles peuvent communiquer les documents demandés, recevoir et signer tout document engageant la société dans le cadre de la procédure, assister aux entretiens et échanger les informations utiles dans les délais impartis.",
      "",
      "Fait à Argenteuil, le ............................",
      "",
      "Le représentant légal,",
      rep + ", " + qual,
      "",
      "(signature et cachet de l'entreprise)"
    ].join("\n");
  }
  (function () {
    var ta = $("#mandat-txt");
    ta.value = get("urssaf-mandat", "") || modeleMandat();
    ta.addEventListener("input", function () { set("urssaf-mandat", ta.value); });
    $("#btn-mandat-dl").addEventListener("click", function () {
      var blob = new Blob([ta.value], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Designation-mandataire-controle-URSSAF-TEC.txt";
      a.setAttribute("data-sans-base", "1");
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
    $("#btn-mandat-print").addEventListener("click", function () {
      var w = window.open("", "_blank");
      if (!w) return;
      var pre = w.document.createElement("pre");
      pre.style.cssText = "font:14px/1.6 system-ui;white-space:pre-wrap;padding:24px";
      pre.textContent = ta.value;
      w.document.body.appendChild(pre);
      w.document.title = "Désignation du mandataire";
      w.focus(); w.print();
    });
    $("#btn-mandat-reset").addEventListener("click", function () {
      ta.value = modeleMandat(); set("urssaf-mandat", ta.value);
    });
  })();

  /* ---- les sept rubriques ---- */
  var RUBRIQUES = [
    ["Pièges à éviter",
      "<ul>" +
      "<li>Répondre à l'oral et dans l'improvisation : tout passe par le mandataire désigné, par écrit.</li>" +
      "<li>Remettre des originaux : ne donner que des copies ; les pièces ne sortent de l'entreprise qu'avec votre accord (R. 243-59 II).</li>" +
      "<li>Laisser filer les 15 jours pour s'opposer au traitement automatisé sur le matériel du contrôleur.</li>" +
      "<li>Laisser passer les 30 jours (60 sur demande) pour répondre à la lettre d'observations : c'est la fenêtre décisive.</li>" +
      "<li>Reconnaître trop vite un chef de redressement : chaque point se discute, pièce à l'appui.</li>" +
      "<li>Sortir du périmètre : le contrôle porte sur 2023 à 2025, rien au-delà de la prescription de trois ans.</li>" +
      "</ul>"],
    ["Points les plus contrôlés et les plus sanctionnés, en transport",
      "<ul>" +
      "<li>La déduction forfaitaire spécifique des chauffeurs : le poste le plus redressé. Elle ne tient que pour les salariés dont l'activité réelle la justifie, avec leur consentement et des frais réellement engagés.</li>" +
      "<li>Les indemnités de déplacement et de grand déplacement : justificatifs et plafonds.</li>" +
      "<li>Les avantages en nature : véhicule, repas, logement.</li>" +
      "<li>La réduction générale de cotisations : l'avis annonce son recalcul.</li>" +
      "<li>Les primes et les temps de coupure requalifiés en salaire.</li>" +
      "<li>Le travail dissimulé et la requalification de sous-traitants ou de faux indépendants.</li>" +
      "</ul>" +
      "<p>Appuis, lus à la source : la déduction est liée à l'activité réelle du salarié, pas à l'étiquette de l'entreprise (<span class=\"ref\">Cass. 2e civ. 4 avril 2018, n° 17-16.244</span>) ; elle ne s'applique pas indistinctement à tous les chauffeurs sans distinguer la nature de leur activité (<span class=\"ref\">Cass. 2e civ. 14 février 2013, n° 11-27.032</span>).</p>"],
    ["Points de vigilance",
      "<ul>" +
      "<li>Cohérence entre DSN, bulletins de paie et comptabilité sur toute la période.</li>" +
      "<li>Convention collective réellement appliquée (transports routiers, IDCC 16) et contrats de travail.</li>" +
      "<li>Registre unique du personnel à jour.</li>" +
      "<li>Tracer chaque pièce remise : date, intitulé, destinataire, et en garder copie.</li>" +
      "</ul>"],
    ["Causes d'annulation du contrôle",
      "<p>Vérifiées à la source, jurisprudence de la deuxième chambre civile de la Cour de cassation.</p>" +
      "<ul>" +
      "<li>Avis de contrôle absent ou irrégulier : c'est une formalité substantielle, dont le défaut entraîne la nullité du contrôle et de tous les actes qui suivent, dont la mise en demeure (<span class=\"ref\">Cass. 2e civ. 6 novembre 2014, n° 13-23.433</span>).</li>" +
      "<li>Charte du cotisant contrôlé : l'avis doit informer de son existence et de l'adresse où la consulter ; sa remise reste une formalité substantielle (<span class=\"ref\">Cass. 2e civ. 20 décembre 2018, n° 17-20.041</span> ; R. 243-59 I). La charte est opposable à l'URSSAF.</li>" +
      "<li>Échantillonnage et extrapolation irréguliers : les éléments ainsi recueillis ne peuvent fonder un redressement, même dans la limite des bases réellement vérifiées (<span class=\"ref\">Cass. 2e civ. 15 mars 2018, n° 17-11.891</span>).</li>" +
      "<li>Non-respect du contradictoire : lettre d'observations non datée ou non signée, délai non tenu, absence de réponse motivée de l'inspecteur (R. 243-59 III).</li>" +
      "<li>Pièces exploitées hors de l'entreprise sans votre autorisation, ou audition irrégulière (R. 243-59 II).</li>" +
      "</ul>" +
      "<p>La nullité propre au dépassement de trois mois ne vise que les entreprises de moins de 11 salariés : elle ne concerne pas TEC, qui en compte 82.</p>"],
    ["Recours",
      "<ul>" +
      "<li>Pendant : répondre à la lettre d'observations point par point, dans les 30 jours, portés à 60 sur demande.</li>" +
      "<li>Après la mise en demeure : saisir la commission de recours amiable de l'URSSAF dans les deux mois de la notification (R. 142-1).</li>" +
      "<li>En cas de rejet : le pôle social du tribunal judiciaire, puis la cour d'appel et la deuxième chambre civile de la Cour de cassation.</li>" +
      "</ul>" +
      "<p>La prescription des cotisations est de trois ans ; elle est suspendue pendant la période contradictoire (L. 244-3).</p>"],
    ["Comment construire son dossier",
      "<ul>" +
      "<li>Un classeur par bloc de l'avis : documents sociaux ; comptables et financiers ; administratifs et juridiques.</li>" +
      "<li>Pour chaque pièce : l'intitulé exact de l'avis, la période couverte, le format numérique demandé.</li>" +
      "<li>Un onglet réduction générale avec les calculs et les justificatifs, puisque l'avis vise son recalcul.</li>" +
      "<li>Un onglet frais et déduction forfaitaire spécifique, le point le plus sensible.</li>" +
      "<li>Le mandat de désignation signé, la charte du cotisant, et un journal des échanges avec le contrôleur.</li>" +
      "</ul>"],
    ["Conseils divers",
      "<ul>" +
      "<li>Désigner tôt l'expert-comptable ou un conseil comme interlocuteur unique.</li>" +
      "<li>Faire un pré-audit avant le 17 novembre et régulariser spontanément ce qui est clairement dû : cela réduit les majorations.</li>" +
      "<li>Demander la charte du cotisant, elle est opposable à l'URSSAF.</li>" +
      "<li>Rester coopératif et courtois, mais ne rien concéder sans vérification.</li>" +
      "<li>Tout garder par écrit.</li>" +
      "</ul>"]
  ];
  (function () {
    var box = $("#rubriques");
    RUBRIQUES.forEach(function (r) {
      var d = el("details", "rub");
      var s = el("summary", null, r[0]);
      var c = el("div", "corps"); c.innerHTML = r[1];
      d.appendChild(s); d.appendChild(c); box.appendChild(d);
    });
  })();

})();
