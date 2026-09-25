/* Le document unique, sur deux écrans qui partagent ce fichier.

   duerp.html, sur « non » : le document seul, déjà écrit pour le métier
   déduit de la fiche d'entreprise. Trois champs en tête (date de la version,
   responsable, établissement) qui se glissent dans le texte à mesure. Un
   bouton Télécharger en Word, un bouton Imprimer, le texte de loi replié.
   Aucune question, aucun exposé avant le document.

   controler-duerp.html, sur « oui » : le dépôt du document existant en
   premier, puis le diagnostic risque par risque (trouvé, cité ; ou manquant,
   écrit), puis la version corrigée, le texte déposé suivi des compléments,
   prête en Word. La recherche est lexicale : elle voit qu'un sujet est
   traité, elle ne dit jamais qu'il l'est bien. Rien ici n'est dit conforme.

   Le fichier déposé est lu dans le navigateur ; aucun octet ne sort du poste.

   LES ARTICLES cités ont été lus à la source par le relais Légifrance de
   l'application le 7 septembre 2026, trois lectures concordantes, et relus le
   8 septembre 2026, deux lectures espacées, même identifiant de version et
   même texte. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var ech = function (s) { return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var DM = window.DuerpMetiers;
  var LU = "lus les 7 et 8 septembre 2026, les textes ajoutés le 25 septembre 2026";

  /* Les textes, avec leur identifiant de version. Rien n'est réécrit de
     mémoire : ce qui suit est ce que le relais a rendu. */
  var TEXTES = [
    { n: "L. 4121-1", id: "LEGIARTI000035640828",
      t: "L'employeur prend les mesures nécessaires pour assurer la sécurité et protéger la santé physique et mentale des travailleurs. Ces mesures comprennent : 1° Des actions de prévention des risques professionnels, y compris ceux mentionnés à l'article L. 4161-1 ; 2° Des actions d'information et de formation ; 3° La mise en place d'une organisation et de moyens adaptés. L'employeur veille à l'adaptation de ces mesures pour tenir compte du changement des circonstances et tendre à l'amélioration des situations existantes." },
    { n: "L. 4121-2", id: "LEGIARTI000033019913",
      t: "L'employeur met en oeuvre les mesures prévues à l'article L. 4121-1 sur le fondement des principes généraux de prévention suivants : 1° Eviter les risques ; 2° Evaluer les risques qui ne peuvent pas être évités ; 3° Combattre les risques à la source ; 4° Adapter le travail à l'homme [...] ; 5° Tenir compte de l'état d'évolution de la technique ; 6° Remplacer ce qui est dangereux par ce qui n'est pas dangereux ou par ce qui est moins dangereux ; 7° Planifier la prévention en y intégrant, dans un ensemble cohérent, la technique, l'organisation du travail, les conditions de travail, les relations sociales et l'influence des facteurs ambiants, notamment les risques liés au harcèlement moral et au harcèlement sexuel [...] ainsi que ceux liés aux agissements sexistes [...] ; 8° Prendre des mesures de protection collective en leur donnant la priorité sur les mesures de protection individuelle ; 9° Donner les instructions appropriées aux travailleurs." },
    { n: "L. 4121-3", id: "LEGIARTI000043893923",
      t: "L'employeur, compte tenu de la nature des activités de l'établissement, évalue les risques pour la santé et la sécurité des travailleurs [...]. Cette évaluation des risques tient compte de l'impact différencié de l'exposition au risque en fonction du sexe. Apportent leur contribution à l'évaluation des risques professionnels dans l'entreprise : 1° [...] le comité social et économique et sa commission santé, sécurité et conditions de travail, s'ils existent [...]. Le comité social et économique est consulté sur le document unique d'évaluation des risques professionnels et sur ses mises à jour ; 2° Le ou les salariés mentionnés au premier alinéa du I de l'article L. 4644-1, s'ils ont été désignés ; 3° Le service de prévention et de santé au travail auquel l'employeur adhère." },
    { n: "L. 4121-3-1, III", id: "LEGIARTI000043893919",
      t: "Les résultats de cette évaluation débouchent : 1° Pour les entreprises dont l'effectif est supérieur ou égal à cinquante salariés, sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail qui : a) Fixe la liste détaillée des mesures devant être prises au cours de l'année à venir [...] ainsi que, pour chaque mesure, ses conditions d'exécution, des indicateurs de résultat et l'estimation de son coût ; b) Identifie les ressources de l'entreprise pouvant être mobilisées ; c) Comprend un calendrier de mise en œuvre ; 2° Pour les entreprises dont l'effectif est inférieur à cinquante salariés, sur la définition d'actions de prévention des risques et de protection des salariés. La liste de ces actions est consignée dans le document unique d'évaluation des risques professionnels et ses mises à jour." },
    { n: "L. 4121-3-1, VI", id: "LEGIARTI000043893919",
      t: "Le document unique d'évaluation des risques professionnels est transmis par l'employeur à chaque mise à jour au service de prévention et de santé au travail auquel il adhère." },
    { n: "R. 4121-1", id: "LEGIARTI000023795562",
      t: "L'employeur transcrit et met à jour dans un document unique les résultats de l'évaluation des risques pour la santé et la sécurité des travailleurs à laquelle il procède en application de l'article L. 4121-3. Cette évaluation comporte un inventaire des risques identifiés dans chaque unité de travail de l'entreprise ou de l'établissement, y compris ceux liés aux ambiances thermiques." },
    { n: "R. 4121-2", id: "LEGIARTI000045386446",
      t: "La mise à jour du document unique d'évaluation des risques professionnels est réalisée : 1° Au moins chaque année dans les entreprises d'au moins onze salariés ; 2° Lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail ; 3° Lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur." },
    { n: "R. 4121-3", id: "LEGIARTI000045386448",
      t: "Dans les établissements dotés d'un comité social et économique, le document unique d'évaluation des risques professionnels est utilisé pour l'établissement du rapport annuel prévu au 1° de l'article L. 2312-27." },
    { n: "R. 4121-4", id: "LEGIARTI000045386451",
      t: "Le document unique d'évaluation des risques professionnels et ses versions antérieures sont tenus, pendant une durée de 40 ans à compter de leur élaboration, à la disposition : 1° Des travailleurs et des anciens travailleurs pour les versions en vigueur durant leur période d'activité [...] ; 2° Des membres de la délégation du personnel du comité social et économique ; 3° Du service de prévention et de santé au travail [...] ; 4° Des agents du système d'inspection du travail ; 5° Des agents des services de prévention des organismes de sécurité sociale ; 6° Des agents des organismes professionnels de santé, de sécurité et des conditions de travail [...] ; 7° Des inspecteurs de la radioprotection [...]. Un avis indiquant les modalités d'accès des travailleurs au document unique est affiché à une place convenable et aisément accessible dans les lieux de travail. Dans les entreprises ou établissements dotés d'un règlement intérieur, cet avis est affiché au même emplacement que celui réservé au règlement intérieur." },
    /* Ajoutés le 25 septembre 2026, après les deux relectures : ils étaient
       cités dans le corps du document sans figurer dans cette liste. */
    { n: "L. 4121-3-1, V, B", id: "LEGIARTI000043893919",
      t: "Pour la mise en œuvre des obligations mentionnées au A du présent V, le document unique d'évaluation des risques professionnels et ses mises à jour font l'objet d'un dépôt dématérialisé sur un portail numérique déployé et administré par un organisme géré par les organisations professionnelles d'employeurs représentatives au niveau national et interprofessionnel. [...] L'obligation de dépôt dématérialisé [...] est applicable : a) A compter du 1er juillet 2023, aux entreprises dont l'effectif est supérieur ou égal à cent cinquante salariés ; b) A compter de dates fixées par décret, en fonction des effectifs des entreprises, et au plus tard à compter du 1er juillet 2024 aux entreprises dont l'effectif est inférieur à cent cinquante salariés." },
    { n: "L. 3122-11", id: "LEGIARTI000033020153",
      t: "Tout travailleur de nuit bénéficie d'un suivi individuel régulier de son état de santé dans les conditions fixées à l'article L. 4624-1." },
    { n: "L. 2314-9", id: "LEGIARTI000035651143",
      t: "Lorsque le comité social et économique n'a pas été mis en place ou renouvelé, un procès-verbal de carence est établi par l'employeur. L'employeur porte à la connaissance des salariés par tout moyen permettant de donner date certaine à cette information, le procès-verbal dans l'entreprise et le transmet dans les quinze jours [...] à l'agent de contrôle de l'inspection du travail [...]." },
    { n: "R. 4624-17", id: "LEGIARTI000033769059",
      t: "Tout travailleur dont l'état de santé, l'âge, les conditions de travail ou les risques professionnels auxquels il est exposé le nécessitent, notamment [...] les travailleurs de nuit mentionnés à l'article L. 3122-5, bénéficie, à l'issue de la visite d'information et de prévention, de modalités de suivi adaptées déterminées dans le cadre du protocole écrit prévu au troisième alinéa de l'article L. 4624-1, selon une périodicité qui n'excède pas une durée de trois ans." },
    { n: "R. 4624-18", id: "LEGIARTI000033769047",
      t: "Tout travailleur de nuit mentionné à l'article L. 3122-5 et tout travailleur âgé de moins de dix-huit ans bénéficie d'une visite d'information et de prévention réalisée par un professionnel de santé mentionné au premier alinéa de l'article L. 4624-1 préalablement à son affectation sur le poste." },
    { n: "R. 4624-23, III", id: "LEGIARTI000053786012",
      t: "S'il le juge nécessaire, l'employeur complète la liste des postes entrant dans les catégories mentionnées au I. par des postes présentant des risques particuliers [...], après avis du ou des médecins concernés et du comité social et économique s'il existe, en cohérence avec l'évaluation des risques prévue à l'article L. 4121-3 [...]." },
    { n: "R. 4741-1", id: "LEGIARTI000018527390",
      t: "Le fait de ne pas transcrire ou de ne pas mettre à jour les résultats de l'évaluation des risques, dans les conditions prévues aux articles R. 4121-1 et R. 4121-2, est puni de l'amende prévue pour les contraventions de cinquième classe. La récidive est réprimée conformément aux articles 132-11 et 132-15 du code pénal." },
  ];

  /* ------------------------------------------------------------------ */
  /* La fiche d'entreprise : sans elle, rien à écrire. */
  var P = (window.Profil && window.Profil.lire) ? window.Profil.lire() : {};
  if (!P.denomination) { location.replace("index.html"); return; }

  /* L'état, sur ce poste : les trois champs, le texte déposé, les blocs
     retenus dans la version corrigée. */
  var CLE = "controler-duerp";
  var E = (function () {
    try { return JSON.parse(localStorage.getItem(CLE) || "null") || {}; } catch (_) { return {}; }
  })();
  E.v = E.v || {};
  E.ins = E.ins || {};
  E.trouve = E.trouve || {};
  if (typeof E.depot !== "string") E.depot = "";
  function garder() { try { localStorage.setItem(CLE, JSON.stringify(E)); } catch (_) {} }
  function v(c) { return String(E.v[c] == null ? "" : E.v[c]).trim(); }

  var aujourdhui = new Date().toISOString().slice(0, 10);
  if (!v("dateVersion")) E.v.dateVersion = aujourdhui;
  if (!v("responsable") && P.responsable) E.v.responsable = String(P.responsable);
  if (!v("etablissement") && P.adresse) E.v.etablissement = String(P.adresse);
  /* LA VILLE DE SIGNATURE N'EST PAS L'ADRESSE DE L'ÉTABLISSEMENT.

     Le document sortait « Fait à 23 avenue du Château, 95100 Argenteuil » :
     relevé le 25 septembre 2026. La ville se tire du code postal de l'adresse,
     comme ailleurs dans l'application ; à défaut, elle reste en rouge. */
  if (!v("ville")) {
    var mVille = String(P.ville || P.adresse || "").match(/\d{5}\s+(.+)$/);
    E.v.ville = mVille ? mVille[1].trim() : String(P.ville || "").trim();
  }

  function effectif() {
    var n = Number(P.effectif);
    return isFinite(n) && n > 0 ? n : null;
  }
  function dateFr(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
  /* L'échéance de chaque action court depuis la date de la version. */
  function plusMois(iso, n) {
    var d = new Date((iso || aujourdhui) + "T12:00:00");
    if (isNaN(d)) d = new Date();
    d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 10);
  }
  function slug(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "entreprise";
  }

  /* Le métier : déduit de la fiche, jamais demandé. « ?metier= » permet de
     forcer un jeu d'unités depuis un lien. */
  var cleMetier = new URLSearchParams(location.search).get("metier") || DM.deduire(P);
  var M = DM.pour(cleMetier);

  function idRisque(u, i) { return M.cle + "." + u.cle + "." + i; }

  /* Tous les risques du métier, avec leur cotation et leur échéance. */
  function inventaire(filtre) {
    var out = [];
    M.unites.forEach(function (u) {
      var l = [];
      u.risques.forEach(function (r, i) {
        var id = idRisque(u, i);
        if (filtre && !filtre(id)) return;
        l.push({ id: id, r: r, pr: DM.priorite(r.g, r.f), ech: plusMois(v("dateVersion"), r.mois) });
      });
      if (l.length) out.push({ u: u, liste: l });
    });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* LE DOCUMENT, en HTML pour l'écran et en éléments pour le Word. */
  var TITRE = "Document unique d'évaluation des risques professionnels";

  var INTRO = "L'évaluation comporte un inventaire des risques identifiés dans chaque unité de " +
    "travail, y compris ceux liés aux ambiances thermiques (R. 4121-1). Pour chaque risque : la " +
    "situation de travail, une cotation de 1 à 16 (gravité multipliée par fréquence), les mesures " +
    "de prévention retenues, un responsable et une échéance.";

  /* L'IMPACT DIFFÉRENCIÉ SELON LE SEXE, QUE LA LOI IMPOSE DE PRENDRE EN COMPTE.

     L. 4121-3 (LEGIARTI000043893923, lu le 25 septembre 2026) : « Cette
     évaluation des risques tient compte de l'impact différencié de
     l'exposition au risque en fonction du sexe. » Le document n'en disait
     rien, relevé le 25 septembre 2026. La phrase dit ce que la loi exige et
     laisse en rouge ce que l'entreprise seule peut constater : le texte ne
     désigne pas de risque, il impose de regarder. */
  var SEXE = "L'évaluation tient compte de l'impact différencié de l'exposition au risque en " +
    "fonction du sexe (L. 4121-3) : composition des équipes par poste, charges et hauteurs de " +
    "travail rapportées aux personnes réelles, équipements de protection disponibles dans les " +
    "tailles et les formes qui conviennent aux femmes comme aux hommes, vestiaires et sanitaires " +
    "séparés, et situation des salariées enceintes ou allaitantes. [ Ce que cet examen a fait " +
    "apparaître dans l'entreprise, poste par poste, et ce qui en a été tiré ]";

  /* LES UNITÉS SONT DÉDUITES DE L'ACTIVITÉ, PAS CONSTATÉES SUR LE SITE.

     Le document de TEC décrivait un atelier mécanique intégré, une citerne et
     une fosse, et écrivait même « Fosse, si elle existe » : la relecture du
     25 septembre 2026 a eu raison d'y voir la marque d'un modèle non
     confronté au terrain. L'application ne peut pas savoir ce qu'il y a dans
     la cour : elle le dit, en rouge, au lieu de laisser croire qu'elle sait. */
  var UNITES_A_CONFIRMER = "Les unités de travail qui suivent sont celles que l'activité " +
    "déclarée implique d'ordinaire. [ À confronter au site avant signature : un atelier intégré, " +
    "une fosse, une citerne, un poste de lavage ou une cuve de carburant n'existent pas partout. " +
    "Supprimez l'unité ou le risque qui ne vous concerne pas, et ajoutez ce que l'application ne " +
    "pouvait pas deviner ]";

  /* La seconde branche de la phrase du comité, celle de l'entreprise qui a
     organisé les élections sans trouver de candidat. Elle sort en rouge, et
     l'employeur supprime celle des deux phrases qui ne le concerne pas. */
  var POSTES_BLANC = "[ Confirmez et nommez les postes réellement concernés, un par un, avec le " +
    "nombre de salariés qui les tiennent : conduite d'un véhicule ou d'un engin, travail en hauteur, " +
    "point chaud, machine dangereuse, travail isolé, manœuvre sur le quai. Retirez ceux qui " +
    "n'existent pas dans l'entreprise, ajoutez ceux qui manquent. Cette liste est reprise telle " +
    "quelle par le règlement intérieur ]";

  var CARENCE = "[ Si aucun comité n'est en place : les élections ont été organisées et un " +
    "procès-verbal de carence a été établi le [DATE], porté à la connaissance des salariés et " +
    "transmis à l'inspection du travail (L. 2314-9) ; le document est alors tenu à disposition " +
    "dans les conditions de l'article R. 4121-4. Supprimez celle des deux phrases qui ne vous " +
    "concerne pas. ]";
  function marque(c, quoi) {
    var x = v(c);
    return x ? "<mark>" + ech(x) + "</mark>" : "<mark>[ " + ech(quoi) + " ]</mark>";
  }
  function ou(c, quoi) { return v(c) || "[ " + quoi + " ]"; }

  function enTeteHtml() {
    var eff = effectif();
    return "<h2>" + ech(TITRE) + "</h2>" +
      '<p class="ent">' + ech(P.denomination) + "</p>" +
      "<p>Établissement : " + marque("etablissement", "établissement") + ". Effectif : " +
      (eff === null ? "[ effectif ]" : eff + " salarié" + (eff > 1 ? "s" : "")) +
      ". Activité : " + ech(M.nom) + ".</p>" +
      "<p>Version du " + (v("dateVersion") ? "<mark>" + ech(dateFr(v("dateVersion"))) + "</mark>" : marque("dateVersion", "date")) +
      ", établie par " + marque("responsable", "responsable") + ".</p>";
  }

  function risqueHtml(x, num) {
    return "<p><b>" + ech(num) + " " + ech(x.r.n) + ".</b> " + ech(x.r.s) +
      ' <span class="cot">Gravité ' + x.r.g + ", fréquence " + x.r.f + ", priorité " + x.pr.p + " : " + ech(x.pr.mot) + ".</span></p>" +
      "<ul>" + x.r.mes.map(function (m) { return "<li>" + ech(m) + "</li>"; }).join("") + "</ul>" +
      '<p class="qui">Responsable : ' + ech(x.r.r) + ". Échéance : " + ech(dateFr(x.ech)) + ".</p>";
  }

  function unitesHtml(groupes, depart) {
    var h = "";
    groupes.forEach(function (g, ig) {
      var n = depart + ig;
      h += "<h3>" + n + ". " + ech(g.u.nom) + "</h3>" + '<p class="qui">' + ech(g.u.qui) + "</p>";
      g.liste.forEach(function (x, ix) { h += risqueHtml(x, n + "." + (ix + 1)); });
    });
    return h;
  }

  function planTitre() {
    var eff = effectif();
    return eff !== null && eff >= 50 ? "Programme annuel de prévention" : "Actions de prévention et de protection";
  }
  function planPhrase() {
    var eff = effectif();
    if (eff === null)
      return "[ effectif non renseigné : à partir de cinquante salariés, programme annuel de prévention ; en deçà, liste d'actions consignée dans le document unique (L. 4121-3-1, III) ]";
    if (eff >= 50)
      return "L'effectif étant de " + eff + " salariés, les résultats de l'évaluation débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail : la liste des mesures de l'année à venir avec, pour chacune, ses conditions d'exécution, un indicateur de résultat et l'estimation de son coût, les ressources mobilisables et un calendrier (L. 4121-3-1, III, 1°). Les conditions d'exécution, l'indicateur et le coût de chaque mesure restent à écrire à la main." +
        " Ressources de l'entreprise mobilisables : [ budget de prévention de l'année, heures d'encadrement, personnes désignées, concours du service de prévention et de santé au travail, aide de la branche ou de la Carsat : à écrire ]." +
        " Calendrier : les échéances portées au tableau ci-dessous en tiennent lieu, revues à chaque mise à jour.";
    return "L'effectif étant de " + eff + " salarié" + (eff > 1 ? "s" : "") + ", les résultats de l'évaluation débouchent sur la liste des actions de prévention des risques et de protection des salariés, consignée dans le présent document (L. 4121-3-1, III, 2°).";
  }
  function planTrie(groupes) {
    var plan = [];
    groupes.forEach(function (g) { g.liste.forEach(function (x) { plan.push({ u: g.u.nom, x: x }); }); });
    plan.sort(function (a, b) { return b.x.pr.p - a.x.pr.p; });
    return plan;
  }

  function planHtml(groupes, num) {
    var plan = planTrie(groupes);
    var h = "<h3>" + num + ". " + planTitre() + "</h3><p>" + ech(planPhrase()) + "</p>";
    h += "<ol>" + plan.map(function (p) {
      return "<li>" + ech(p.u) + " : " + ech(p.x.r.n) + ". Priorité " + p.x.pr.p + ", " + ech(p.x.pr.mot) +
        ". " + ech(p.x.r.r) + ", pour le " + ech(dateFr(p.x.ech)) + "." + "</li>";
    }).join("") + "</ol>";
    return h;
  }


  /* LA LISTE DES POSTES OÙ LA VIGILANCE COMPTE.

     Le règlement intérieur fonde ses contrôles d'alcool et de stupéfiants sur
     les postes « dont le document unique établit qu'une atteinte à la
     vigilance y exposerait le salarié ou autrui à un danger ». Le document
     unique disait de dresser cette liste sans la dresser : relevé le
     25 septembre 2026, et c'est ce qui tenait les deux documents ensemble.
     Elle est donc écrite ici, déduite des unités qui portent le risque, et
     l'employeur la confirme poste par poste. Le même examen sert à compléter,
     s'il y a lieu, la liste des postes à risques particuliers de R. 4624-23,
     III, qui se fait « en cohérence avec l'évaluation des risques ». */
  function postesVigilance(groupes) {
    var out = [];
    groupes.forEach(function (g) {
      var a = (g.liste || []).some(function (x) { return x.r.cle === "vigilance"; });
      if (a) out.push({ u: g.u.nom, qui: g.u.qui });
    });
    return out;
  }
  function postesTexte() {
    return "Les postes énumérés ci-dessous sont ceux où une vigilance diminuée expose le salarié " +
      "ou autrui à un danger. C'est cette liste que vise l'article du règlement intérieur qui " +
      "autorise un contrôle, et elle n'a d'effet que si elle désigne des postes réels.";
  }
  function postesHtml(num, groupes) {
    var L = postesVigilance(groupes);
    var h = "<h3>" + num + ". Postes exposés à une vigilance diminuée</h3><p>" + ech(postesTexte()) + "</p>";
    h += "<ul>" + L.map(function (x) {
      return "<li><b>" + ech(x.u) + "</b> : " + ech(x.qui) + "</li>";
    }).join("") + "</ul>";
    h += "<p><mark>" + ech(POSTES_BLANC) + "</mark></p>";
    return h;
  }
  function postesItems(num, groupes, items) {
    items.push({ k: "h2", t: num + ". Postes exposés à une vigilance diminuée" });
    items.push({ k: "p", t: postesTexte() });
    postesVigilance(groupes).forEach(function (x) {
      items.push({ k: "p", t: "- " + x.u + " : " + x.qui });
    });
    items.push({ k: "p", t: POSTES_BLANC });
  }

  function tenueHtml(num) {
    return "<h3>" + num + ". Tenue du document</h3>" +
      "<p>Mise à jour au moins chaque année à partir de onze salariés, lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur (R. 4121-2).</p>" +
      "<p>Le document et ses versions antérieures sont conservés quarante ans à compter de leur élaboration et tenus à la disposition des personnes que désigne l'article R. 4121-4. Un avis indiquant les modalités d'accès des travailleurs au document est affiché à une place convenable et aisément accessible, et au même emplacement que le règlement intérieur là où il en existe un (R. 4121-4).</p>" +
      "<p>Le document est transmis à chaque mise à jour au service de prévention et de santé au travail (L. 4121-3-1, VI).</p>" +
      /* LE COMITÉ : DEUX BRANCHES, UNE SEULE À GARDER.

         L. 4121-3 dit « Le comité social et économique est consulté sur le
         document unique et sur ses mises à jour », sans condition. La formule
         « s'il existe » a été retirée le 25 septembre 2026 : elle dispensait
         d'écrire quoi que ce soit là où un comité existe. À sa place, la date
         de l'avis, ou celle du procès-verbal de carence pour l'entreprise qui
         a organisé les élections sans candidat. Demande de l'utilisatrice, le
         cas de TEC, dont les élections sont en cours. */
      "<p>Le comité social et économique est consulté sur le présent document et sur ses mises à jour (L. 4121-3). Avis rendu le " +
      marque("dateAvisCse", "date de l'avis") + ".</p>" +
      "<p><mark>" + ech(CARENCE) + "</mark></p>" +
      /* Le dépôt dématérialisé de L. 4121-3-1, V, B suppose un portail que les
         organisations patronales n'ont pas ouvert : vérifié le 25 septembre
         2026. On l'écrit, parce qu'un lecteur qui connaît le texte se demande
         pourquoi le document n'en parle pas. */
      "<p>Le dépôt dématérialisé du document sur un portail numérique, prévu par l'article L. 4121-3-1, V, B, suppose que ce portail soit déployé et administré par les organisations professionnelles d'employeurs. Tant qu'il ne l'est pas, il n'y a rien à y déposer ; son ouverture est à vérifier à chaque mise à jour. La conservation pendant quarante ans et la mise à disposition restent dues, sur le support de l'entreprise.</p>" +
      "<p>La cotation par gravité et fréquence est une aide au classement des actions : aucun des textes cités ne l'impose.</p>";
  }

  function signatureHtml() {
    return "<p>Fait à " + marque("ville", "lieu") + ", le " +
      (v("dateVersion") ? "<mark>" + ech(dateFr(v("dateVersion"))) + "</mark>" : marque("dateVersion", "date")) +
      ".<br>" + marque("responsable", "responsable") + ", signature :</p>" +
      '<p class="qui">Textes : ' + TEXTES.map(function (t) { return ech(t.n) + " (" + ech(t.id) + ")"; }).join(", ") +
      " du code du travail, " + LU + ".</p>";
  }

  /* ─────── LE REGISTRE DU PERSONNEL, CONFRONTÉ AUX UNITÉS DE TRAVAIL ───────

     Les unités de travail sont déduites de l'activité ; les emplois réels,
     eux, sont écrits dans le registre du personnel. Quand un emploi du
     registre ne correspond à aucune unité, le document le dit au lieu de
     l'ignorer : il ne l'évalue pas à la place de l'employeur, il signale
     qu'il reste à évaluer. Demande du 16 septembre 2026, relier les modules
     chaque fois que c'est possible.                                        */
  function motsDe(t) {
    var x = String(t || "");
    try { x = x.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) {}
    return x.toLowerCase().split(/[^a-z0-9]+/).filter(function (m) { return m.length > 3; });
  }
  function emploisDuRegistre() {
    var E = null;
    try { E = JSON.parse(localStorage.getItem("registre-personnel") || "null"); } catch (e) { E = null; }
    var L = (E && E.salaries) || [];
    var compte = {};
    L.forEach(function (s) {
      if (String(s.sor || "").trim()) return;          /* les présents seulement */
      var e = String(s.emp || "").trim();
      if (!e) return;
      compte[e] = (compte[e] || 0) + 1;
    });
    return Object.keys(compte).map(function (k) { return { emp: k, n: compte[k] }; });
  }
  function emploisNonCouverts(groupes) {
    var emplois = emploisDuRegistre();
    if (!emplois.length) return null;
    var mots = [];
    groupes.forEach(function (g) {
      mots = mots.concat(motsDe(g.u.nom)).concat(motsDe(g.u.qui));
    });
    var manquants = emplois.filter(function (x) {
      var m = motsDe(x.emp);
      if (!m.length) return false;
      return !m.some(function (w) { return mots.indexOf(w) >= 0; });
    });
    return { emplois: emplois, manquants: manquants };
  }
  function registrePhrase(groupes) {
    var r = emploisNonCouverts(groupes);
    if (!r) return "";
    var total = r.emplois.reduce(function (n, x) { return n + x.n; }, 0);
    var t = "Le registre du personnel porte " + total + " salarié" + (total > 1 ? "s" : "") +
      " présent" + (total > 1 ? "s" : "") + ", sur " + r.emplois.length + " emploi" +
      (r.emplois.length > 1 ? "s" : "") + " : " +
      r.emplois.map(function (x) { return x.emp + " (" + x.n + ")"; }).join(", ") + ". ";
    t += r.manquants.length
      ? "Aucune unité de travail de ce document ne correspond à : " +
        r.manquants.map(function (x) { return x.emp; }).join(", ") +
        ". Ces emplois restent à évaluer, et leurs risques à ajouter ici."
      : "Chacun se retrouve dans une unité de travail ci-dessus.";
    return t;
  }

  function documentHtml() {
    var groupes = inventaire();
    return enTeteHtml() +
      "<p>" + ech(INTRO) + "</p>" +
      "<p>" + ech(SEXE) + "</p>" +
      "<p>" + ech(UNITES_A_CONFIRMER) + "</p>" +
      unitesHtml(groupes, 1) +
      (registrePhrase(groupes) ? "<p>" + ech(registrePhrase(groupes)) + "</p>" : "") +
      planHtml(groupes, groupes.length + 1) +
      postesHtml(groupes.length + 2, groupes) +
      tenueHtml(groupes.length + 3) +
      signatureHtml();
  }

  /* Les mêmes contenus, dans le vocabulaire du générateur Word. Les puces
     sont des paragraphes précédés d'un trait d'union. */
  function risqueItems(x, num, items) {
    items.push({ k: "h3", t: num + " " + x.r.n });
    items.push({ k: "p", t: x.r.s + " Gravité " + x.r.g + ", fréquence " + x.r.f + ", priorité " + x.pr.p + " : " + x.pr.mot + "." });
    x.r.mes.forEach(function (m) { items.push({ k: "p", t: "- " + m }); });
    items.push({ k: "note", t: "Responsable : " + x.r.r + ". Échéance : " + dateFr(x.ech) + "." });
  }
  function unitesItems(groupes, depart, items) {
    groupes.forEach(function (g, ig) {
      var n = depart + ig;
      items.push({ k: "h2", t: n + ". " + g.u.nom });
      items.push({ k: "note", t: g.u.qui });
      g.liste.forEach(function (x, ix) { risqueItems(x, n + "." + (ix + 1), items); });
    });
  }
  function tenueItems(num, items) {
    items.push({ k: "h2", t: num + ". Tenue du document" });
    var tenue = document.createElement("div");
    tenue.innerHTML = tenueHtml(num);
    Array.prototype.forEach.call(tenue.querySelectorAll("p"), function (p) { items.push({ k: "p", t: p.textContent }); });
  }
  function documentItems() {
    var groupes = inventaire(), items = [], eff = effectif();
    items.push({ k: "sur", t: P.denomination + " · établissement : " + ou("etablissement", "établissement") +
      " · effectif : " + (eff === null ? "[ effectif ]" : eff + " salarié" + (eff > 1 ? "s" : "")) + " · activité : " + M.nom });
    items.push({ k: "p", t: "Version du " + (dateFr(v("dateVersion")) || "[ date ]") + ", établie par " + ou("responsable", "responsable") + "." });
    items.push({ k: "p", t: INTRO });
    items.push({ k: "p", t: SEXE });
    items.push({ k: "p", t: UNITES_A_CONFIRMER });
    unitesItems(groupes, 1, items);
    var phraseReg = registrePhrase(groupes);
    if (phraseReg) items.push({ k: "p", t: phraseReg });
    var plan = planTrie(groupes);
    items.push({ k: "h2", t: (groupes.length + 1) + ". " + planTitre() });
    items.push({ k: "p", t: planPhrase() });
    /* Sept colonnes ne tiennent pas en portrait : le tableau demande sa page
       en paysage quand le programme annuel est dû. Posé le 25 septembre 2026. */
    items.push({ k: "table", paysage: eff !== null && eff >= 50,
      head: eff !== null && eff >= 50
        ? ["Priorité", "Unité", "Action", "Conditions d'exécution", "Responsable", "Échéance", "Indicateur", "Coût"]
        : ["Priorité", "Unité", "Action", "Responsable", "Échéance"],
      rows: plan.map(function (p) {
        if (eff !== null && eff >= 50) {
          return [p.x.pr.p + " " + p.x.pr.mot, p.u, p.x.r.n, "[ comment, par qui, avec quoi ]",
            p.x.r.r, dateFr(p.x.ech), "[ à définir ]", "[ à estimer ]"];
        }
        return [p.x.pr.p + " " + p.x.pr.mot, p.u, p.x.r.n, p.x.r.r, dateFr(p.x.ech)];
      }) });
    postesItems(groupes.length + 2, groupes, items);
    tenueItems(groupes.length + 3, items);
    items.push({ k: "p", t: "Fait à " + ou("ville", "lieu") + ", le " + (dateFr(v("dateVersion")) || "[ date ]") + "." });
    items.push({ k: "p", t: ou("responsable", "responsable") + ", signature :" });
    items.push({ k: "note", t: "Textes : " + TEXTES.map(function (t) { return t.n + " (" + t.id + ")"; }).join(", ") + " du code du travail, " + LU + "." });
    return items;
  }

  function telechargerDocx(items, titre, suffixe) {
    /* Le pied de page porte l'entreprise et la version : un document conservé
       quarante ans et imprimé pour signature doit dire, sur chaque feuille, de
       quelle version il s'agit. Posé le 25 septembre 2026. */
    window.AuditExport.telecharger(
      window.AuditExport.docx(items, titre, {
        /* L'auteur du fichier est celui qui signe, non la raison sociale :
           demande de la relecture du 25 septembre 2026. */
        auteur: v("responsable") || P.responsable || P.denomination || "",
        pied: (P.denomination || "") + ", document unique, version du " +
          (dateFr(v("dateVersion")) || dateFr(aujourdhui)),
      }),
      "document-unique" + (suffixe || "") + "-" + slug(P.denomination) + "-" + aujourdhui + ".docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  }

  function textesHtml() {
    return TEXTES.map(function (t) {
      return "<p><b>" + ech(t.n) + "</b> du code du travail, version " + ech(t.id) + ", " + LU + ". " + ech(t.t) + "</p>";
    }).join("");
  }

  /* ------------------------------------------------------------------ */
  /* ÉCRAN « NON » : le document seul, trois champs en tête. */
  function ecranDocument() {
    var feuille = $("#feuille");
    function rendre() { feuille.innerHTML = documentHtml(); }
    ["dateVersion", "responsable", "etablissement"].forEach(function (c) {
      var el = $("#d-" + c);
      if (!el) return;
      el.value = v(c);
      el.addEventListener("input", function () { E.v[c] = el.value; garder(); rendre(); });
    });
    rendre();
    if ($("#textes")) $("#textes").innerHTML = textesHtml();
    if ($("#dl-docx")) $("#dl-docx").addEventListener("click", function () { telechargerDocx(documentItems(), TITRE, ""); });
    if ($("#imprimer")) $("#imprimer").addEventListener("click", function () { window.print(); });
    garder();
  }

  /* ------------------------------------------------------------------ */
  /* ÉCRAN « OUI » : le dépôt, le diagnostic, la version corrigée. */
  function u16(vue, i) { return vue.getUint16(i, true); }
  function u32(vue, i) { return vue.getUint32(i, true); }
  function entreeZip(buf, nomVoulu) {
    var vue = new DataView(buf), n = buf.byteLength, fin = -1;
    for (var i = n - 22; i >= 0 && i > n - 65558; i--) if (u32(vue, i) === 0x06054b50) { fin = i; break; }
    if (fin < 0) throw new Error("Ce fichier n'est pas une archive lisible.");
    var nb = u16(vue, fin + 10), pos = u32(vue, fin + 16), dec = new TextDecoder("utf-8");
    for (var k = 0; k < nb; k++) {
      if (u32(vue, pos) !== 0x02014b50) throw new Error("Répertoire de l'archive illisible.");
      var methode = u16(vue, pos + 10), taille = u32(vue, pos + 20);
      var lnom = u16(vue, pos + 28), lextra = u16(vue, pos + 30), lcom = u16(vue, pos + 32);
      var debut = u32(vue, pos + 42);
      var nom = dec.decode(new Uint8Array(buf, pos + 46, lnom));
      if (nom === nomVoulu) {
        var ln = u16(vue, debut + 26), lx = u16(vue, debut + 28);
        return { methode: methode, data: new Uint8Array(buf, debut + 30 + ln + lx, taille) };
      }
      pos += 46 + lnom + lextra + lcom;
    }
    throw new Error("Le fichier ne contient pas de document Word (word/document.xml).");
  }
  function inflater(u8) {
    if (typeof DecompressionStream !== "function")
      return Promise.reject(new Error("Ce navigateur ne sait pas décomprimer le fichier. Collez le texte à la place."));
    var flux = new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Response(flux).arrayBuffer();
  }
  function texteDeXml(xml) {
    return xml.replace(/<w:tab[^>]*\/>/g, "\t").replace(/<w:br[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n").replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&amp;/g, "&")
      .replace(/\n{3,}/g, "\n\n").trim();
  }
  function lireDocx(f) {
    return f.arrayBuffer().then(function (buf) {
      var e = entreeZip(buf, "word/document.xml");
      if (e.methode === 0) return new TextDecoder("utf-8").decode(e.data);
      if (e.methode !== 8) throw new Error("Compression inconnue dans ce .docx.");
      return inflater(e.data).then(function (b) { return new TextDecoder("utf-8").decode(new Uint8Array(b)); });
    }).then(texteDeXml);
  }
  function normaliser(s) {
    return String(s || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
  }

  function comparer(t) {
    var n = normaliser(t);
    E.trouve = {};
    M.unites.forEach(function (u) {
      u.risques.forEach(function (r, i) {
        var id = idRisque(u, i);
        var mots = (r.m || "").split("|").concat((r.n || "").toLowerCase());
        var vu = null;
        mots.forEach(function (mot) {
          if (vu) return;
          mot = normaliser(mot);
          if (mot.length < 4) return;
          var k = n.indexOf(mot);
          if (k >= 0) vu = t.substr(Math.max(0, k - 60), 190).replace(/\s+/g, " ").trim();
        });
        if (vu) E.trouve[id] = vu;
        if (E.ins[id] === undefined) E.ins[id] = !vu;
      });
    });
    garder();
  }

  function dit(html, classe) {
    var l = $("#lecture");
    if (l) l.innerHTML = html ? '<div class="avis ' + (classe || "info") + '">' + html + "</div>" : "";
  }

  /* ══════════════════════════════════════════════════════════════════════
     CE QUE LE DOCUMENT DÉPOSÉ CONTIENT, ET CE QU'IL N'A PAS

     Demande du 14 septembre 2026 : « l'application fera l'analyse détaillée
     avec un compte rendu ». Jusqu'ici, déposer un document unique de
     quarante-quatre pages ne produisait qu'une liste de risques manquants :
     rien sur ce que le document dit, rien sur sa date, rien sur les mentions
     que le code du travail impose de porter. On lui répondait par un
     catalogue, pas par une lecture.

     Les huit points ci-dessous sont ceux que les articles lus à la source
     imposent au document lui-même. Le repérage reste lexical : trouver un
     mot ne prouve pas que la mention est bien rédigée, et ne pas le trouver
     ne prouve pas qu'elle manque. C'est écrit à l'écran, comme partout
     ailleurs dans cette application.                                      */
  var MENTIONS = [
    { cle: "unites", nom: "Inventaire par unité de travail",
      fond: "R. 4121-1", m: "unite de travail|unites de travail|par unite|poste de travail",
      quoi: "L'évaluation comporte un inventaire des risques par unité de travail." },
    { cle: "cotation", nom: "Cotation ou hiérarchisation des risques",
      fond: "aucune obligation de forme", m: "gravite|frequence|probabilite|criticite|cotation|priorite|niveau de risque",
      quoi: "Classer les risques n'est imposé par aucun texte, mais sans classement le programme d'actions n'a pas d'ordre." },
    { cle: "mesures", nom: "Mesures de prévention existantes et à prendre",
      fond: "L. 4121-2", m: "mesure de prevention|mesures de prevention|action de prevention|moyens de prevention|equipement de protection",
      quoi: "Les mesures répondent aux neuf principes généraux de prévention." },
    { cle: "plan", nom: "Programme annuel ou liste d'actions",
      fond: "L. 4121-3-1, III", m: "programme annuel|plan d action|plan d actions|programme de prevention|actions a mener|echeancier",
      quoi: "À partir de cinquante salariés, les résultats débouchent sur un programme annuel de prévention ; en dessous, sur une liste d'actions consignée dans le document." },
    { cle: "responsables", nom: "Responsable et échéance par action",
      fond: "L. 4121-3-1, III", m: "responsable|pilote|echeance|delai de realisation|date de realisation|cout estime",
      quoi: "Le programme précise pour chaque mesure ses conditions d'exécution, l'indicateur de résultat, le coût estimé et la personne qui en répond." },
    { cle: "maj", nom: "Mise à jour du document",
      fond: "R. 4121-2", m: "mise a jour|mis a jour|actualisation|revision annuelle|version du",
      quoi: "Mise à jour au moins chaque année à partir de onze salariés, et à chaque aménagement important ou information nouvelle." },
    { cle: "acces", nom: "Mise à disposition et avis d'affichage",
      fond: "R. 4121-4", m: "tenu a la disposition|mise a disposition|avis indiquant les modalites|affiche|consultation du document",
      quoi: "Le document est tenu à la disposition des travailleurs et des personnes désignées ; un avis affiché dit comment y accéder." },
    { cle: "spst", nom: "Transmission au service de prévention et de santé au travail",
      fond: "L. 4121-3-1, VI", m: "service de prevention et de sante au travail|medecine du travail|spst|sist|transmis au service",
      quoi: "Le document est transmis au service de prévention et de santé au travail à chaque mise à jour." },
  ];

  /* LA DATE DU DOCUMENT. Un millésime trouvé n'importe où ne prouve rien : le
     document unique de TEC, rédigé en 2016, cite 2026 dans un renvoi de texte
     et paraissait ainsi à jour. On cherche donc les dates complètes, jour,
     mois, année, et la plus récente fait foi ; les millésimes isolés ne
     servent qu'à défaut, et sont donnés comme tels. Mesuré le 14 septembre
     2026. */
  function datesDocument(t) {
    var jours = [], m;
    var re = /\b(0?[1-9]|[12]\d|3[01])[\/.\-](0?[1-9]|1[0-2])[\/.\-](19[89]\d|20[0-4]\d)\b/g;
    while ((m = re.exec(t)) !== null) {
      var iso = m[3] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2);
      if (jours.indexOf(iso) < 0) jours.push(iso);
    }
    jours.sort();
    var annees = [], a;
    var ra = /\b(19[89]\d|20[0-4]\d)\b/g;
    while ((a = ra.exec(t)) !== null) if (annees.indexOf(a[1]) < 0) annees.push(a[1]);
    annees.sort();
    return { jours: jours, annees: annees,
      derniere: jours.length ? Number(jours[jours.length - 1].slice(0, 4))
                             : (annees.length ? Number(annees[annees.length - 1]) : null),
      precise: jours.length > 0 };
  }
  function analyseMentions(t) {
    var n = normaliser(t);
    return MENTIONS.map(function (x) {
      var vu = null;
      (x.m || "").split("|").forEach(function (mot) {
        if (vu) return;
        mot = normaliser(mot);
        if (mot.length < 4) return;
        var k = n.indexOf(mot);
        if (k >= 0) vu = t.substr(Math.max(0, k - 70), 200).replace(/\s+/g, " ").trim();
      });
      return { x: x, vu: vu };
    });
  }

  function analyseHtml(t) {
    var mentions = analyseMentions(t);
    var absentes = mentions.filter(function (m) { return !m.vu; });
    var dates = datesDocument(t);
    var derniere = dates.derniere;
    var anneeCourante = new Date().getFullYear();
    var vieux = derniere !== null && (anneeCourante - derniere) >= 1;
    var eff = effectif();

    var manques = 0, total = 0;
    M.unites.forEach(function (u) {
      u.risques.forEach(function (r, i) { total++; if (!E.trouve[idRisque(u, i)]) manques++; });
    });
    var unitesVues = M.unites.filter(function (u) {
      return u.risques.some(function (r, i) { return E.trouve[idRisque(u, i)]; });
    });

    var rouge = manques + absentes.length + (vieux ? 1 : 0);
    var h = '<div class="verdict">' +
      '<div class="v ko' + (rouge ? "" : " vide") + '"><span class="n">' + rouge + "</span>" +
      '<span class="q">' + (rouge ? "ce qui ne va pas" : "rien à corriger") + "</span>" +
      '<span class="d">' +
        (absentes.length ? absentes.length + " mention" + (absentes.length > 1 ? "s" : "") + " du code du travail introuvable" + (absentes.length > 1 ? "s" : "") + ". " : "") +
        (manques ? manques + " risque" + (manques > 1 ? "s" : "") + " du métier non traité" + (manques > 1 ? "s" : "") + ". " : "") +
        (vieux ? "Document daté de " + derniere + "." : "") +
      "</span></div>" +
      '<div class="v ok"><span class="n">' + (total - manques + (MENTIONS.length - absentes.length)) + "</span>" +
      '<span class="q">ce qui va</span>' +
      '<span class="d">' + (MENTIONS.length - absentes.length) + " mention" +
        ((MENTIONS.length - absentes.length) > 1 ? "s" : "") + " sur " + MENTIONS.length + " et " +
        (total - manques) + " risque" + ((total - manques) > 1 ? "s" : "") + " sur " + total +
        " se retrouvent dans votre document.</span></div></div>";

    h += '<p class="bloc-t r"><span class="pastille"></span>La tenue du document</p>';
    if (derniere !== null) {
      var quoi = dates.precise
        ? "Dates portées par le document : " + ech(dates.jours.map(function (j) { return dateFr(j); }).join(", ")) + "."
        : "Aucune date complète. Millésimes cités : " + ech(dates.annees.join(", ")) + ".";
      h += '<div class="avis ' + (vieux ? "non" : "info") + '"><b>' + quoi + "</b>" +
        (vieux
          ? "La plus récente remonte à " + derniere + ", soit " + (anneeCourante - derniere) +
            " an" + ((anneeCourante - derniere) > 1 ? "s" : "") +
            ". La mise à jour est due au moins chaque année à partir de onze salariés" +
            (eff !== null ? ", et votre effectif est de " + eff + " salariés" : "") +
            " (R. 4121-2). Un document unique qui n'a pas été mis à jour ne protège personne, et son absence de mise à jour est punie de l'amende prévue pour les contraventions de cinquième classe (R. 4741-1)."
          : "La plus récente est de " + derniere + ".") + "</div>";
    } else {
      h += '<div class="avis att"><b>Aucune date n\'a été trouvée dans le document.</b>' +
        "Un document unique sans date d'élaboration ni de mise à jour ne permet pas de vérifier la mise à jour annuelle (R. 4121-2).</div>";
    }

    h += '<p class="bloc-t ' + (absentes.length ? "r" : "v") + '"><span class="pastille"></span>' +
      "Les mentions que le code du travail impose</p>";
    mentions.forEach(function (m) {
      h += '<div class="ligne' + (m.vu ? " deja" : "") + '"><span class="nom">' +
        '<b class="etat ' + (m.vu ? "ok" : "ko") + '">' + (m.vu ? "présent" : "introuvable") + "</b> " +
        ech(m.x.nom) + '<span class="du">' + ech(m.x.quoi) + " (" + ech(m.x.fond) + ")" +
        (m.vu ? '</span><span class="du">Dans votre document : « ' + ech(m.vu) + ' »' : "") +
        "</span></span></div>";
    });

    h += '<p class="bloc-t ' + (unitesVues.length === M.unites.length ? "v" : "r") + '"><span class="pastille"></span>' +
      "Les unités de travail de votre métier</p>" +
      '<p class="bloc-s">Métier retenu d\'après votre fiche : ' + ech(M.nom) + ". " +
      unitesVues.length + " unité" + (unitesVues.length > 1 ? "s" : "") + " sur " + M.unites.length +
      " trouve" + (unitesVues.length > 1 ? "nt" : "") + " un écho dans votre document.</p>";
    M.unites.forEach(function (u) {
      var vues = u.risques.filter(function (r, i) { return E.trouve[idRisque(u, i)]; }).length;
      h += '<div class="ligne' + (vues ? " deja" : "") + '"><span class="nom">' +
        '<b class="etat ' + (vues ? "ok" : "ko") + '">' + vues + "/" + u.risques.length + "</b> " +
        ech(u.nom) + '<span class="du">' + ech(u.qui) + "</span></span></div>";
    });
    return h;
  }

  function diagnosticHtml() {
    var manques = 0, total = 0, h = "";
    M.unites.forEach(function (u) {
      h += '<p class="groupe">' + ech(u.nom) + "</p>";
      u.risques.forEach(function (r, i) {
        var id = idRisque(u, i), vu = E.trouve[id];
        total++;
        if (!vu) manques++;
        h += '<div class="ligne' + (vu ? " deja" : "") + '"><span class="nom">' + ech(r.n) +
          (vu ? '<span class="du">Dans votre document : « ' + ech(vu) + ' »</span>' : "") + "</span>" +
          (vu
            ? '<label class="ajout"><input type="checkbox" data-ins="' + ech(id) + '"' + (E.ins[id] ? " checked" : "") + "> Ajouter quand même</label>"
            : '<label class="ajout manque"><input type="checkbox" data-ins="' + ech(id) + '"' + (E.ins[id] !== false ? " checked" : "") + "> Ajouter</label>") +
          "</div>";
      });
    });
    return '<div class="avis ' + (manques ? "att" : "ok") + '"><b>' +
      (manques ? manques + " risque" + (manques > 1 ? "s" : "") + " du métier sur " + total + " introuvable" + (manques > 1 ? "s" : "") + " dans votre document"
               : "Les " + total + " risques du métier sont traités dans votre document") + "</b>" +
      "La recherche est faite sur les mots : un risque rédigé autrement sera dit introuvable, et un risque trouvé n'est pas pour autant bien traité. Ce qui est coché part dans la version corrigée, ci-dessous.</div>" + h;
  }

  /* UN DOCUMENT SCANNÉ NE SE RECOPIE PAS. Relevé le 14 septembre 2026 : le
     document unique de TEC, scanné, était reproduit ici tel que la
     reconnaissance l'avait lu, colonnes mêlées, pages retournées, en-têtes du
     cabinet au milieu des phrases. Ce charabia n'est pas un document unique,
     et l'imprimer sous le nom de l'entreprise serait pire que de ne rien
     produire. Quand le texte vient d'une reconnaissance de caractères, la
     version corrigée ne le reproduit donc pas : elle renvoie au document
     d'origine, qui reste la référence, et ne porte que ce que l'application
     ajoute, les compléments, le programme d'actions et les règles de tenue.
     Un texte saisi ou lu dans un fichier bureautique continue, lui, d'être
     repris mot pour mot. */
  var MENTION_SCAN = "Votre document a été lu par reconnaissance de caractères, à partir d'un " +
    "PDF scanné. Son texte n'est pas reproduit ici : la reconnaissance d'un scan mêle les " +
    "colonnes et les en-têtes, et ce qui en sort n'a pas la valeur de votre document. Le " +
    "document d'origine reste la référence ; les pages qui suivent le complètent et se " +
    "joignent à lui.";
  function corpsDepose() {
    if (E.scan) return '<div class="avis att">' + ech(MENTION_SCAN) + "</div>";
    return '<div class="depose">' +
      E.depot.split(/\n/).map(function (l) { return l.trim() ? "<p>" + ech(l) + "</p>" : ""; }).join("") +
      "</div>";
  }

  function corrigeHtml() {
    var groupes = inventaire(function (id) { return E.ins[id] !== false && (E.ins[id] || !E.trouve[id]); });
    var h = "<h2>" + ech(TITRE) + ", version corrigée</h2>" +
      '<p class="ent">' + ech(P.denomination) + "</p>" +
      "<p>Votre document, complété le " + ech(dateFr(aujourdhui)) + ".</p>" +
      corpsDepose();
    if (groupes.length) {
      h += "<h3>Compléments</h3><p>Les unités de travail et les risques qui suivent ne figuraient pas dans le document déposé. Chacun porte sa situation de travail, sa cotation, ses mesures, un responsable et une échéance.</p>" +
        unitesHtml(groupes, 1) + planHtml(groupes, groupes.length + 1);
    } else {
      h += "<h3>Compléments</h3><p>Aucun complément retenu.</p>";
    }
    h += tenueHtml(groupes.length + 2) + signatureHtml() + compteRenduHtml();
    return h;
  }

  /* LE COMPTE RENDU, À LA FIN. Ce qui a été trouvé, ce qui a été ajouté, ce
     qui reste à faire. Demande du 14 septembre 2026 : l'analyse détaillée
     « avec un compte rendu ». Il ferme l'écran et le fichier Word : celui qui
     rouvre le document trois mois plus tard doit retrouver l'essentiel sans
     revenir à l'application. */
  function compteRendu() {
    var dates = datesDocument(E.depot || "");
    var mentions = analyseMentions(E.depot || "");
    var absentes = mentions.filter(function (m) { return !m.vu; });
    var groupes = inventaire(function (id) { return E.ins[id] !== false && (E.ins[id] || !E.trouve[id]); });
    var ajoutes = 0;
    groupes.forEach(function (g) { ajoutes += g.liste.length; });
    var total = 0, trouves = 0;
    M.unites.forEach(function (u) {
      u.risques.forEach(function (r, i) { total++; if (E.trouve[idRisque(u, i)]) trouves++; });
    });
    var an = new Date().getFullYear();
    var L = [];
    L.push("Document déposé : " + (dates.derniere ? "daté de " + dates.derniere : "sans date trouvée") +
      (dates.derniere && (an - dates.derniere) >= 1
        ? ", soit " + (an - dates.derniere) + " an" + ((an - dates.derniere) > 1 ? "s" : "") + " sans mise à jour visible" : "") + ".");
    L.push(trouves + " risque" + (trouves > 1 ? "s" : "") + " sur " + total + " du métier « " + M.nom +
      " » trouvent un écho dans votre document.");
    L.push(absentes.length
      ? absentes.length + " mention" + (absentes.length > 1 ? "s" : "") + " imposée" + (absentes.length > 1 ? "s" : "") +
        " par le code du travail n'" + (absentes.length > 1 ? "ont" : "a") + " pas été trouvée" + (absentes.length > 1 ? "s" : "") +
        " : " + absentes.map(function (m) { return m.x.nom.toLowerCase(); }).join(", ") + "."
      : "Les huit mentions imposées par le code du travail se retrouvent dans votre document.");
    L.push(ajoutes + " risque" + (ajoutes > 1 ? "s" : "") + " ajouté" + (ajoutes > 1 ? "s" : "") +
      " ci-dessus, avec leurs mesures, un responsable et une échéance.");
    return L;
  }
  function compteRenduHtml() {
    var eff = effectif();
    return '<div class="cr"><h3>Le compte rendu</h3><ul>' +
      compteRendu().map(function (l) { return "<li>" + ech(l) + "</li>"; }).join("") +
      "</ul>" +
      '<p class="suite"><b>Ce qui reste à faire, et dans cet ordre.</b> Reprendre poste par poste les ' +
      "risques ajoutés, corriger les cotations qui ne correspondent pas à votre réalité, dater et " +
      "signer le document" +
      (eff !== null && eff >= 50
        ? ", en tirer le programme annuel de prévention que votre effectif de " + eff + " salariés impose (L. 4121-3-1, III)"
        : ", y consigner la liste des actions de prévention (L. 4121-3-1, III)") +
      ", consulter le comité social et économique s'il existe (L. 4121-3), transmettre la nouvelle " +
      "version au service de prévention et de santé au travail (L. 4121-3-1, VI), et afficher l'avis " +
      "d'accès au même emplacement que le règlement intérieur (R. 4121-4).</p></div>";
  }

  function corrigeItems() {
    var groupes = inventaire(function (id) { return E.ins[id] !== false && (E.ins[id] || !E.trouve[id]); });
    var items = [];
    items.push({ k: "sur", t: P.denomination + " · votre document, complété le " + dateFr(aujourdhui) });
    if (E.scan) {
      items.push({ k: "note", t: MENTION_SCAN });
    } else {
      E.depot.split(/\n/).forEach(function (l) { if (l.trim()) items.push({ k: "p", t: l.trim() }); });
    }
    items.push({ k: "saut" });
    items.push({ k: "h1", t: "Compléments" });
    if (!groupes.length) items.push({ k: "p", t: "Aucun complément retenu." });
    else {
      items.push({ k: "p", t: "Les unités de travail et les risques qui suivent ne figuraient pas dans le document déposé. Chacun porte sa situation de travail, sa cotation, ses mesures, un responsable et une échéance." });
      unitesItems(groupes, 1, items);
      var plan = planTrie(groupes);
      items.push({ k: "h2", t: (groupes.length + 1) + ". " + planTitre() + " : les actions ajoutées" });
      items.push({ k: "table", head: ["Priorité", "Unité", "Action", "Responsable", "Échéance"],
        rows: plan.map(function (p) { return [p.x.pr.p + " " + p.x.pr.mot, p.u, p.x.r.n, p.x.r.r, dateFr(p.x.ech)]; }) });
    }
    postesItems(groupes.length + 2, groupes, items);
    tenueItems(groupes.length + 3, items);
    items.push({ k: "p", t: "Fait à " + ou("ville", "lieu") + ", le " + dateFr(aujourdhui) + "." });
    items.push({ k: "p", t: ou("responsable", "responsable") + ", signature :" });
    /* Le compte rendu ferme le fichier comme il ferme l'écran. */
    items.push({ k: "trait" }, { k: "h1", t: "Le compte rendu" });
    compteRendu().forEach(function (l) { items.push({ k: "puce", t: l }); });
    var eff2 = effectif();
    items.push({ k: "p", t: "Ce qui reste à faire, et dans cet ordre. Reprendre poste par poste les " +
      "risques ajoutés, corriger les cotations qui ne correspondent pas à votre réalité, dater et signer " +
      "le document" +
      (eff2 !== null && eff2 >= 50
        ? ", en tirer le programme annuel de prévention que votre effectif de " + eff2 + " salariés impose (L. 4121-3-1, III)"
        : ", y consigner la liste des actions de prévention (L. 4121-3-1, III)") +
      ", consulter le comité social et économique s'il existe (L. 4121-3), transmettre la nouvelle version " +
      "au service de prévention et de santé au travail (L. 4121-3-1, VI), et afficher l'avis d'accès au " +
      "même emplacement que le règlement intérieur (R. 4121-4)." });
    items.push({ k: "note", t: "Textes : " + TEXTES.map(function (t) { return t.n + " (" + t.id + ")"; }).join(", ") + " du code du travail, " + LU + "." });
    return items;
  }

  function rendreControle() {
    var diag = $("#diagnostic"), corr = $("#corrige");
    if (!E.depot) { diag.innerHTML = ""; corr.hidden = true; return; }
    /* L'analyse du document déposé passe DEVANT la liste des risques à
       ajouter : on dit d'abord ce que le document contient et ce qui lui
       manque, on propose ensuite. Demande du 14 septembre 2026. */
    diag.innerHTML = analyseHtml(E.depot) +
      '<p class="bloc-t r"><span class="pastille"></span>Les risques à ajouter</p>' +
      diagnosticHtml();
    diag.querySelectorAll("[data-ins]").forEach(function (i) {
      i.addEventListener("change", function () {
        E.ins[i.getAttribute("data-ins")] = i.checked; garder();
        $("#feuille").innerHTML = corrigeHtml();
      });
    });
    $("#feuille").innerHTML = corrigeHtml();
    corr.hidden = false;
  }

  function ecranControle() {
    if (new URLSearchParams(location.search).get("depart") === "non") { location.replace("duerp.html"); return; }
    ["responsable", "etablissement"].forEach(function (c) {
      var el = $("#d-" + c);
      if (!el) return;
      el.value = v(c);
      el.addEventListener("input", function () { E.v[c] = el.value; garder(); if (E.depot) $("#feuille").innerHTML = corrigeHtml(); });
    });
    $("#fichier").addEventListener("change", function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      dit("Lecture de <b>" + ech(f.name) + "</b>.");
      var suite = (window.LirePdf && window.LirePdf.estPdf(f)) ? window.LirePdf.texte(f)
      : (/\.docx$/i.test(f.name) ? lireDocx(f) : f.text());
      suite.then(function (t) {
        if (t.trim().length < 200) {
          dit("<b>" + ech(f.name) + " est trop court pour être un document unique</b> (" + t.length + " caractères). Déposez le document entier.", "att");
          return;
        }
        /* D'où vient ce texte : un scan lu par reconnaissance, ou un fichier
           qui porte son texte. La version corrigée n'en fait pas le même usage. */
        E.scan = !!(window.LirePdf && window.LirePdf.venaitDuScan);
        E.depot = t; E.ins = {}; comparer(t);
        dit("<b>" + ech(f.name) + "</b> lu, " + t.length.toLocaleString("fr-FR") + " caractères. Le fichier n'est pas sorti de ce poste.");
        rendreControle();
      }).catch(function (e) {
        dit("<b>Ce fichier n'a pas pu être lu.</b> " + ech(e.message) + " Ouvrez le document, copiez son texte et collez-le ci-dessous.", "att");
        $("#coller").open = true;
      });
    });
    $("#controler").addEventListener("click", function () {
      var t = $("#depot").value.trim();
      if (t.length < 200) {
        dit("<b>Le texte collé est trop court pour être un document unique</b> (" + t.length + " caractères). Collez le document entier.", "att");
        return;
      }
      E.scan = false;
      E.depot = t; E.ins = {}; comparer(t);
      dit("Texte collé lu, " + t.length.toLocaleString("fr-FR") + " caractères.");
      rendreControle();
    });
    if ($("#textes")) $("#textes").innerHTML = textesHtml();
    $("#dl-docx").addEventListener("click", function () { telechargerDocx(corrigeItems(), TITRE + ", version corrigée", "-corrige"); });
    $("#imprimer").addEventListener("click", function () { window.print(); });
    if (E.depot) { $("#depot").value = E.depot; comparer(E.depot); }
    rendreControle();
  }

  if ($("#fichier")) ecranControle(); else ecranDocument();
})();
