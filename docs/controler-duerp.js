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
  var LU = "lu le 7 septembre 2026, relu le 8 septembre 2026";

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
      return "L'effectif étant de " + eff + " salariés, les résultats de l'évaluation débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail : la liste des mesures de l'année à venir avec, pour chacune, ses conditions d'exécution, un indicateur de résultat et l'estimation de son coût, les ressources mobilisables et un calendrier (L. 4121-3-1, III, 1°). L'indicateur et le coût de chaque mesure restent à écrire à la main.";
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

  function tenueHtml(num) {
    return "<h3>" + num + ". Tenue du document</h3>" +
      "<p>Mise à jour au moins chaque année à partir de onze salariés, lors de toute décision d'aménagement important modifiant les conditions de santé et de sécurité ou les conditions de travail, et lorsqu'une information supplémentaire intéressant l'évaluation d'un risque est portée à la connaissance de l'employeur (R. 4121-2).</p>" +
      "<p>Le document et ses versions antérieures sont conservés quarante ans à compter de leur élaboration et tenus à la disposition des personnes que désigne l'article R. 4121-4. Un avis indiquant les modalités d'accès des travailleurs au document est affiché à une place convenable et aisément accessible, et au même emplacement que le règlement intérieur là où il en existe un (R. 4121-4).</p>" +
      "<p>Le document est transmis à chaque mise à jour au service de prévention et de santé au travail (L. 4121-3-1, VI). Le comité social et économique, s'il existe, est consulté sur le document et sur ses mises à jour (L. 4121-3).</p>" +
      "<p>La cotation par gravité et fréquence est une aide au classement des actions : aucun des textes cités ne l'impose. Les mesures écrites ci-dessus sont celles que l'employeur retient ; elles ne sont l'énoncé d'aucune obligation particulière.</p>";
  }

  function signatureHtml() {
    return "<p>Fait à " + marque("etablissement", "lieu") + ", le " +
      (v("dateVersion") ? "<mark>" + ech(dateFr(v("dateVersion"))) + "</mark>" : marque("dateVersion", "date")) +
      ".<br>" + marque("responsable", "responsable") + ", signature :</p>" +
      '<p class="qui">Textes : ' + TEXTES.map(function (t) { return ech(t.n) + " (" + ech(t.id) + ")"; }).join(", ") +
      " du code du travail, " + LU + ".</p>";
  }

  function documentHtml() {
    var groupes = inventaire();
    return enTeteHtml() +
      "<p>L'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail (R. 4121-1). Pour chaque risque : la situation de travail, une cotation de 1 à 16 (gravité multipliée par fréquence), les mesures de prévention retenues, un responsable et une échéance.</p>" +
      unitesHtml(groupes, 1) +
      planHtml(groupes, groupes.length + 1) +
      tenueHtml(groupes.length + 2) +
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
    items.push({ k: "p", t: "L'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail (R. 4121-1). Pour chaque risque : la situation de travail, une cotation de 1 à 16 (gravité multipliée par fréquence), les mesures de prévention retenues, un responsable et une échéance." });
    unitesItems(groupes, 1, items);
    var plan = planTrie(groupes);
    items.push({ k: "h2", t: (groupes.length + 1) + ". " + planTitre() });
    items.push({ k: "p", t: planPhrase() });
    items.push({ k: "table",
      head: eff !== null && eff >= 50
        ? ["Priorité", "Unité", "Action", "Responsable", "Échéance", "Indicateur", "Coût"]
        : ["Priorité", "Unité", "Action", "Responsable", "Échéance"],
      rows: plan.map(function (p) {
        var l = [p.x.pr.p + " " + p.x.pr.mot, p.u, p.x.r.n, p.x.r.r, dateFr(p.x.ech)];
        if (eff !== null && eff >= 50) l.push("[ à définir ]", "[ à estimer ]");
        return l;
      }) });
    tenueItems(groupes.length + 2, items);
    items.push({ k: "p", t: "Fait à " + ou("etablissement", "lieu") + ", le " + (dateFr(v("dateVersion")) || "[ date ]") + "." });
    items.push({ k: "p", t: ou("responsable", "responsable") + ", signature :" });
    items.push({ k: "note", t: "Textes : " + TEXTES.map(function (t) { return t.n + " (" + t.id + ")"; }).join(", ") + " du code du travail, " + LU + "." });
    return items;
  }

  function telechargerDocx(items, titre, suffixe) {
    window.AuditExport.telecharger(
      window.AuditExport.docx(items, titre),
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

  function corrigeHtml() {
    var groupes = inventaire(function (id) { return E.ins[id] !== false && (E.ins[id] || !E.trouve[id]); });
    var h = "<h2>" + ech(TITRE) + ", version corrigée</h2>" +
      '<p class="ent">' + ech(P.denomination) + "</p>" +
      "<p>Votre document, complété le " + ech(dateFr(aujourdhui)) + ".</p>" +
      '<div class="depose">' + E.depot.split(/\n/).map(function (l) { return l.trim() ? "<p>" + ech(l) + "</p>" : ""; }).join("") + "</div>";
    if (groupes.length) {
      h += "<h3>Compléments</h3><p>Les unités de travail et les risques qui suivent ne figuraient pas dans le document déposé. Chacun porte sa situation de travail, sa cotation, ses mesures, un responsable et une échéance.</p>" +
        unitesHtml(groupes, 1) + planHtml(groupes, groupes.length + 1);
    } else {
      h += "<h3>Compléments</h3><p>Aucun complément retenu.</p>";
    }
    h += tenueHtml(groupes.length + 2) + signatureHtml();
    return h;
  }

  function corrigeItems() {
    var groupes = inventaire(function (id) { return E.ins[id] !== false && (E.ins[id] || !E.trouve[id]); });
    var items = [];
    items.push({ k: "sur", t: P.denomination + " · votre document, complété le " + dateFr(aujourdhui) });
    E.depot.split(/\n/).forEach(function (l) { if (l.trim()) items.push({ k: "p", t: l.trim() }); });
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
    tenueItems(groupes.length + 2, items);
    items.push({ k: "p", t: "Fait à " + ou("etablissement", "lieu") + ", le " + dateFr(aujourdhui) + "." });
    items.push({ k: "p", t: ou("responsable", "responsable") + ", signature :" });
    items.push({ k: "note", t: "Textes : " + TEXTES.map(function (t) { return t.n + " (" + t.id + ")"; }).join(", ") + " du code du travail, " + LU + "." });
    return items;
  }

  function rendreControle() {
    var diag = $("#diagnostic"), corr = $("#corrige");
    if (!E.depot) { diag.innerHTML = ""; corr.hidden = true; return; }
    diag.innerHTML = diagnosticHtml();
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
      var suite = /\.docx$/i.test(f.name) ? lireDocx(f) : f.text();
      suite.then(function (t) {
        if (t.trim().length < 200) {
          dit("<b>" + ech(f.name) + " est trop court pour être un document unique</b> (" + t.length + " caractères). Déposez le document entier.", "att");
          return;
        }
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
