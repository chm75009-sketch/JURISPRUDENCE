/* L'écran du document unique : la question fermée, puis le document.

   RÈGLE QUI COMMANDE TOUT CE FICHIER. Quand l'utilisateur répond « non »,
   aucune autre question ne lui est posée. Il tombe directement sur son
   document unique, écrit, rempli avec ce que porte la fiche d'entreprise, le
   métier déduit du secteur et de la convention. Les questions viennent après,
   et seulement pour ce qui reste vide : elles s'affichent À CÔTÉ du document,
   dans le panneau « à compléter », et chaque frappe remplit le document sous
   les yeux de l'utilisateur. Un champ rempli disparaît du panneau.

   LE « OUI » dépose le document existant. Il est lu dans le navigateur, sans
   requête. Chaque unité et chaque risque du métier y sont cherchés ; ce que la
   recherche ne retrouve pas est présenté rédigé, prêt à insérer. La recherche
   est lexicale : elle voit qu'un sujet est traité, elle ne dit jamais qu'il
   est bien traité. C'est pourquoi rien ici n'est jamais dit « conforme ».

   LES ARTICLES cités ont été lus à la source le 7 septembre 2026 par le relais
   Légifrance de l'application, trois lectures concordantes chacun, identifiant
   de version noté à côté. */
(function () {
  "use strict";
  var $ = function (s) { return document.querySelector(s); };
  var ech = function (s) { return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  var DM = window.DuerpMetiers;
  var LU = "lu le 7 septembre 2026";

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
  /* L'état. */
  var CLE = "controler-duerp";
  var E = (function () {
    try { return JSON.parse(localStorage.getItem(CLE) || "null") || {}; } catch (_) { return {}; }
  })();
  E.v = E.v || {};          /* les champs de l'en-tête et de la tenue */
  E.pris = E.pris || {};    /* les risques retenus, par identifiant */
  E.resp = E.resp || {};    /* le responsable, modifié ligne à ligne */
  E.ech = E.ech || {};      /* l'échéance, modifiée ligne à ligne */
  E.trouve = E.trouve || {};/* ce que le document déposé contenait déjà */
  function garder() { try { localStorage.setItem(CLE, JSON.stringify(E)); } catch (_) {} }
  function v(c) { return String(E.v[c] == null ? "" : E.v[c]).trim(); }

  var P = (window.Profil && window.Profil.lire) ? window.Profil.lire() : {};
  function reprendre(c, x) { if (!E.v[c] && x) E.v[c] = String(x); }
  reprendre("denomination", P.denomination || P.entreprise);
  reprendre("siret", P.siret);
  reprendre("adresse", P.adresse);
  reprendre("responsable", P.responsable);
  reprendre("effectif", P.effectif);
  if (!E.v.dateVersion) E.v.dateVersion = new Date().toISOString().slice(0, 10);

  function effectif() {
    var n = Number(v("effectif"));
    return isFinite(n) && n > 0 ? n : null;
  }

  function dateFr(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }
  function dansNMois(n) {
    var d = new Date();
    d.setMonth(d.getMonth() + n);
    return d.toISOString().slice(0, 10);
  }

  /* ------------------------------------------------------------------ */
  /* LE MÉTIER : déduit, jamais demandé d'abord.

     Le code NAF ne figure pas sur la fiche d'entreprise. Le secteur et
     l'intitulé de la convention y figurent : c'est de là que le métier est
     déduit. La déduction se corrige d'un menu, à côté du document. */
  function deduire() {
    var texte = [P.secteur, P.conventionCollective, P.activite, v("naf")]
      .join(" ").toLowerCase();
    var trouve = null;
    DM.METIERS.forEach(function (m) {
      if (trouve) return;
      if (new RegExp(m.mots, "i").test(texte)) trouve = m.cle;
    });
    if (trouve) return trouve;
    /* Le secteur seul, quand aucun mot ne parle. */
    var s = String(P.secteur || "").toLowerCase();
    var parSecteur = null;
    DM.METIERS.forEach(function (m) {
      if (parSecteur) return;
      if ((m.secteurs || []).indexOf(s) >= 0) parSecteur = m.cle;
    });
    return parSecteur || "bureau";
  }
  if (!E.v.metier) E.v.metier = deduire();
  function metier() {
    var c = v("metier");
    var m = null;
    DM.METIERS.forEach(function (x) { if (x.cle === c) m = x; });
    return m || DM.METIERS[0];
  }

  function idRisque(u, i) { return metier().cle + "." + u.cle + "." + i; }

  /* Tout est pris par défaut : le « non » ouvre le document entier. */
  function initialiser() {
    metier().unites.forEach(function (u) {
      u.risques.forEach(function (r, i) {
        var id = idRisque(u, i);
        if (E.pris[id] === undefined) E.pris[id] = true;
        if (!E.resp[id]) E.resp[id] = r.r;
        if (!E.ech[id]) E.ech[id] = dansNMois(r.mois);
      });
    });
    garder();
  }
  initialiser();

  /* ------------------------------------------------------------------ */
  /* Les onglets. */
  function onglet(nom) {
    ["depart", "blocs", "sortie"].forEach(function (o) {
      $("#o-" + o).classList.toggle("cache", o !== nom);
    });
    Array.prototype.forEach.call($("#onglets").children, function (b) {
      b.classList.toggle("actif", b.dataset.o === nom);
    });
    if (nom === "blocs") { rendreCompleter("#a-completer"); rendreBlocs(); }
    if (nom === "sortie") { rendreCompleter("#a-completer-2"); assembler(); }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  Array.prototype.forEach.call($("#onglets").children, function (b) {
    b.addEventListener("click", function () { onglet(b.dataset.o); });
  });

  /* ------------------------------------------------------------------ */
  /* LE PANNEAU « À COMPLÉTER ».

     Il ne s'affiche jamais avant le document, et il ne montre que ce qui
     manque. Le métier fait exception : il est toujours proposé, parce que
     c'est lui qui commande les unités affichées et qu'une déduction se
     corrige. */
  var A_REMPLIR = [
    { c: "denomination", n: "Dénomination de l'entreprise", ph: "raison sociale, telle qu'au Kbis", large: true },
    { c: "etablissement", n: "Établissement concerné", ph: "le site, s'il y en a plusieurs" },
    { c: "effectif", n: "Effectif", t: "number",
      sous: "Il ne change pas le document unique. Il décide de ce que les résultats produisent : programme annuel à partir de cinquante salariés, liste d'actions en deçà." },
    { c: "adresse", n: "Adresse", ph: "n°, rue, code postal, ville", large: true },
    { c: "siret", n: "SIRET", ph: "14 chiffres" },
    { c: "responsable", n: "Rédacteur du document", ph: "nom et qualité" },
    { c: "dateVersion", n: "Date de cette version", t: "date" },
    { c: "spst", n: "Service de prévention et de santé au travail", ph: "nom du service auquel l'entreprise adhère", large: true },
    { c: "avisLieu", n: "Où sera affiché l'avis d'accès au document", ph: "le lieu exact", large: true },
  ];

  function champHtml(ch) {
    return '<label class="ch' + (ch.large ? " large" : "") + '"><span class="nom">' + ech(ch.n) + "</span>" +
      '<input id="d-' + ech(ch.c) + '" data-c="' + ech(ch.c) + '" type="' + (ch.t || "text") +
      '" placeholder="' + ech(ch.ph || "") + '" value="' + ech(v(ch.c)) + '">' +
      (ch.sous ? '<span class="sous">' + ech(ch.sous) + "</span>" : "") + "</label>";
  }

  function rendreCompleter(ou) {
    var cible = $(ou);
    if (!cible) return;
    var manquants = A_REMPLIR.filter(function (ch) { return !v(ch.c); });

    var choixMetier = '<label class="ch large"><span class="nom">Activité de référence</span>' +
      '<select id="d-metier" data-c="metier">' +
      DM.METIERS.map(function (m) {
        return '<option value="' + ech(m.cle) + '"' + (m.cle === v("metier") ? " selected" : "") + ">" +
          ech(m.nom) + " (" + ech(m.naf) + ")</option>";
      }).join("") + "</select>" +
      '<span class="sous">Déduite de votre secteur et de votre convention. Elle commande les unités de travail affichées ; changez-en si elle ne colle pas.</span></label>';

    cible.innerHTML = '<div class="completer' + (manquants.length ? "" : " rien") + '"><b>' +
      (manquants.length
        ? "Il reste " + manquants.length + " chose" + (manquants.length > 1 ? "s" : "") + " à compléter"
        : "Rien ne manque dans l'en-tête") + "</b>" +
      "<p>" + (manquants.length
        ? "Chaque réponse remplit le document ci-dessous, à mesure que vous tapez. Ce qui reste vide y sort entre crochets."
        : "Le document ci-dessous est complet. L'activité reste modifiable : c'est elle qui commande les unités de travail.") + "</p>" +
      '<div class="champs">' + choixMetier + manquants.map(champHtml).join("") + "</div></div>";

    cible.querySelectorAll("[data-c]").forEach(function (el) {
      el.addEventListener("input", function () {
        E.v[el.dataset.c] = el.value; garder();
        if (el.dataset.c === "metier") { initialiser(); rendreBlocs(); }
        rafraichir(ou);
      });
      el.addEventListener("change", function () {
        E.v[el.dataset.c] = el.value; garder();
        if (el.dataset.c === "metier") { initialiser(); rendreBlocs(); rendreCompleter(ou); }
        rafraichir(ou);
      });
    });
  }

  /* Rafraîchir le document sans redessiner le panneau : sinon le champ que
     l'on est en train de remplir disparaît sous les doigts dès la première
     lettre. Le panneau se recompose au changement d'onglet. */
  function rafraichir(ou) {
    if (!$("#o-sortie").classList.contains("cache")) assembler();
    if (!$("#o-blocs").classList.contains("cache")) majCompteurs();
  }

  /* ------------------------------------------------------------------ */
  /* LE DÉPÔT DU DOCUMENT EXISTANT : un .docx est une archive zip, et le
     texte vit dans word/document.xml. Aucun octet ne quitte la page. */
  function u16(v2, i) { return v2.getUint16(i, true); }
  function u32(v2, i) { return v2.getUint32(i, true); }

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

  function dit(html, classe) {
    $("#lecture").innerHTML = html ? '<div class="avis ' + (classe || "info") + '">' + html + "</div>" : "";
  }

  $("#coller").addEventListener("click", function () {
    $("#depot").classList.remove("cache");
    $("#depot").focus();
  });

  $("#fichier").addEventListener("change", function (ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    dit("Lecture de <b>" + ech(f.name) + "</b>…");
    var suite = /\.docx$/i.test(f.name) ? lireDocx(f) : f.text();
    suite.then(function (t) {
      $("#depot").classList.remove("cache");
      $("#depot").value = t;
      dit("<b>" + ech(f.name) + "</b> lu : " + t.length.toLocaleString("fr-FR") + " caractères.");
    }).catch(function (e) {
      dit("<b>Ce fichier n'a pas pu être lu.</b>" + ech(e.message) +
          " Ouvrez le document, copiez son texte et collez-le ci-dessous.", "att");
    });
  });

  function normaliser(s) {
    return String(s || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ");
  }

  $("#controler").addEventListener("click", function () {
    var t = $("#depot").value.trim();
    if (t.length < 200) {
      dit("<b>Le texte déposé est trop court pour être un document unique.</b>Il compte " + t.length +
          " caractères. Déposez le document entier : la comparaison sur un extrait vous proposerait " +
          "tout ce que l'extrait ne contient pas.", "att");
      return;
    }
    var n = normaliser(t);
    E.trouve = {};
    metier().unites.forEach(function (u) {
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
        if (vu) { E.trouve[id] = vu; E.pris[id] = false; }
        else { E.pris[id] = true; }
      });
    });
    garder();
    dit("Comparaison faite. Ce que la recherche a retrouvé dans votre document vous est montré, " +
        "cité ; le reste vous est proposé rédigé. Trouver un sujet ne prouve pas qu'il est bien " +
        "traité : c'est pourquoi rien ici n'est dit conforme.", "info");
    onglet("blocs");
  });

  $("#je-nai-pas").addEventListener("click", function () {
    E.trouve = {};
    metier().unites.forEach(function (u) {
      u.risques.forEach(function (r, i) { E.pris[idRisque(u, i)] = true; });
    });
    garder();
    onglet("blocs");
  });

  /* ------------------------------------------------------------------ */
  /* LES BLOCS. */
  function majCompteurs() {
    var pris = 0, total = 0, dej = 0, urgents = 0;
    metier().unites.forEach(function (u) {
      u.risques.forEach(function (r, i) {
        var id = idRisque(u, i);
        total++;
        if (E.pris[id]) pris++;
        if (E.trouve[id]) dej++;
        if (E.pris[id] && DM.priorite(r.g, r.f).rang >= 3) urgents++;
      });
    });
    $("#compteurs").innerHTML =
      '<span class="c ins">' + pris + " risque" + (pris > 1 ? "s" : "") + " dans le document</span>" +
      '<span class="c">' + metier().unites.length + " unités de travail proposées</span>" +
      (dej ? '<span class="c dej">' + dej + " déjà traité" + (dej > 1 ? "s" : "") + " dans votre document</span>" : "") +
      (urgents ? '<span class="c urg">' + urgents + " en priorité haute</span>" : "") +
      '<span class="c">' + (total - pris) + " retiré" + (total - pris > 1 ? "s" : "") + "</span>";
  }

  function blocRisque(u, r, i) {
    var id = idRisque(u, i), pr = DM.priorite(r.g, r.f);
    var h = '<div class="risque' + (E.pris[id] ? " insere" : "") + '" data-r="' + ech(id) + '">' +
      '<div class="h"><b>' + ech(r.n) + "</b>" +
      '<label style="display:flex;gap:7px;align-items:center;font-size:13px;white-space:nowrap">' +
      '<input type="checkbox" data-pris="' + ech(id) + '"' + (E.pris[id] ? " checked" : "") + "> dans le document</label></div>";

    if (E.trouve[id])
      h += '<div class="trouve"><b>Votre document en parle déjà.</b> <q>' + ech(E.trouve[id]) +
        "</q> Relisez ce passage : la recherche voit qu'un sujet est traité, elle ne dit pas qu'il l'est bien. " +
        "Cochez la case ci-dessus pour insérer quand même le bloc rédigé.</div>";

    h += '<p class="sit"><i>La situation de travail</i>' + ech(r.s) + "</p>" +
      '<div class="cot"><span>Gravité ' + r.g + "</span><span>Fréquence " + r.f + "</span>" +
      '<span class="p' + pr.rang + '">Priorité ' + pr.p + " · " + ech(pr.mot) + "</span></div>" +
      "<ul>" + r.mes.map(function (m) { return "<li>" + ech(m) + "</li>"; }).join("") + "</ul>" +
      '<div class="pied">' +
      '<label><span class="nom">Responsable</span><input data-resp="' + ech(id) + '" value="' + ech(E.resp[id] || r.r) + '"></label>' +
      '<label><span class="nom">Échéance</span><input type="date" data-ech="' + ech(id) + '" value="' + ech(E.ech[id] || "") + '"></label>' +
      "</div></div>";
    return h;
  }

  function rendreBlocs() {
    var m = metier();
    $("#blocs").innerHTML = m.unites.map(function (u) {
      return '<div class="unite"><div class="tt"><span><b>' + ech(u.nom) + "</b>" +
        '<span class="qui">' + ech(u.qui) + "</span></span>" +
        '<span><button class="btn second petit" data-unite-on="' + ech(u.cle) + '">Toute l\'unité</button> ' +
        '<button class="btn second petit" data-unite-off="' + ech(u.cle) + '">Retirer l\'unité</button></span></div>' +
        '<div class="corps">' + u.risques.map(function (r, i) { return blocRisque(u, r, i); }).join("") +
        "</div></div>";
    }).join("");

    $("#blocs").querySelectorAll("[data-pris]").forEach(function (el) {
      el.addEventListener("change", function () {
        E.pris[el.dataset.pris] = el.checked; garder();
        var c = el.closest(".risque"); if (c) c.classList.toggle("insere", el.checked);
        majCompteurs();
      });
    });
    $("#blocs").querySelectorAll("[data-resp]").forEach(function (el) {
      el.addEventListener("input", function () { E.resp[el.dataset.resp] = el.value; garder(); });
    });
    $("#blocs").querySelectorAll("[data-ech]").forEach(function (el) {
      el.addEventListener("input", function () { E.ech[el.dataset.ech] = el.value; garder(); });
    });
    $("#blocs").querySelectorAll("[data-unite-on]").forEach(function (b) {
      b.addEventListener("click", function () { basculerUnite(b.dataset.uniteOn, true); });
    });
    $("#blocs").querySelectorAll("[data-unite-off]").forEach(function (b) {
      b.addEventListener("click", function () { basculerUnite(b.dataset.uniteOff, false); });
    });
    majCompteurs();
  }

  function basculerUnite(cleUnite, etat) {
    metier().unites.forEach(function (u) {
      if (u.cle !== cleUnite) return;
      u.risques.forEach(function (r, i) { E.pris[idRisque(u, i)] = etat; });
    });
    garder(); rendreBlocs();
  }

  function toutes(etat) {
    metier().unites.forEach(function (u) {
      u.risques.forEach(function (r, i) { E.pris[idRisque(u, i)] = etat; });
    });
    garder(); rendreBlocs();
  }
  $("#tout-cocher").addEventListener("click", function () { toutes(true); });
  $("#tout-decocher").addEventListener("click", function () { toutes(false); });
  $("#vers-sortie").addEventListener("click", function () { onglet("sortie"); });
  $("#vers-sortie-2").addEventListener("click", function () { onglet("sortie"); });
  $("#retour-blocs").addEventListener("click", function () { onglet("blocs"); });

  /* ------------------------------------------------------------------ */
  /* LE DOCUMENT. */
  function ou(c, quoi) { return v(c) || "[ " + quoi + " ]"; }

  function retenus() {
    var out = [];
    metier().unites.forEach(function (u) {
      var l = [];
      u.risques.forEach(function (r, i) {
        var id = idRisque(u, i);
        if (E.pris[id]) l.push({ id: id, r: r, pr: DM.priorite(r.g, r.f),
          resp: E.resp[id] || r.r, ech: E.ech[id] || "" });
      });
      if (l.length) out.push({ u: u, liste: l });
    });
    return out;
  }

  function texteDocument() {
    var m = metier(), eff = effectif(), L = [];
    var tiret = "----------------------------------------------------------------------";
    L.push("DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS");
    L.push(ou("denomination", "dénomination de l'entreprise").toUpperCase());
    L.push(tiret);
    L.push("Établissement : " + ou("etablissement", "établissement concerné"));
    L.push("Adresse : " + ou("adresse", "adresse"));
    L.push("SIRET : " + ou("siret", "SIRET"));
    L.push("Effectif : " + (eff === null ? "[ effectif ]" : eff + " salariés"));
    L.push("Activité de référence : " + m.nom + " (" + m.naf + ")");
    L.push("Version du " + (dateFr(v("dateVersion")) || "[ date de la version ]") +
      ", établie par " + ou("responsable", "nom et qualité du rédacteur"));
    L.push("");

    L.push("1. CE QUE CE DOCUMENT CONTIENT");
    L.push(tiret);
    L.push("L'évaluation comporte un inventaire des risques identifiés dans chaque unité de travail " +
      "de l'entreprise ou de l'établissement, y compris ceux liés aux ambiances thermiques " +
      "(R. 4121-1). Le découpage retenu ci-dessous suit les postes réels de l'activité, et non une " +
      "nomenclature : c'est le rattachement à une unité que le texte exige, pas une méthode.");
    L.push("Ont contribué à cette évaluation, chacun pour ce qui le concerne : le comité social et " +
      "économique et sa commission santé, sécurité et conditions de travail s'ils existent, le ou " +
      "les salariés désignés au titre de l'article L. 4644-1 s'ils ont été désignés, et le service " +
      "de prévention et de santé au travail auquel l'entreprise adhère (L. 4121-3).");
    L.push("Service de prévention et de santé au travail : " + ou("spst", "nom du service"));
    L.push("");

    L.push("2. LA MÉTHODE DE COTATION RETENUE");
    L.push(tiret);
    L.push("Aucun texte n'impose de coter un risque. Ni L. 4121-3 ni R. 4121-1 ne prescrivent de " +
      "multiplier une gravité par une fréquence : la cotation ci-dessous est une aide au classement " +
      "des actions, elle n'a aucune valeur réglementaire, et un document sans cotation n'est pas " +
      "irrégulier pour autant.");
    L.push("Gravité : " + [1, 2, 3, 4].map(function (k) { return DM.GRAVITE[k]; }).join(" ; ") + ".");
    L.push("Fréquence : " + [1, 2, 3, 4].map(function (k) { return DM.FREQUENCE[k]; }).join(" ; ") + ".");
    L.push("Priorité : produit de la gravité par la fréquence. De 1 à 3, à surveiller ; de 4 à 6, " +
      "à programmer ; de 8 à 9, prioritaire ; de 12 à 16, action immédiate.");
    L.push("");

    L.push("3. LES UNITÉS DE TRAVAIL ET LES RISQUES IDENTIFIÉS");
    L.push(tiret);
    var groupes = retenus();
    if (!groupes.length) L.push("[ aucun risque retenu : revenez à l'écran précédent et cochez ce qui vous concerne ]");
    groupes.forEach(function (g, ig) {
      L.push("");
      L.push("UNITÉ DE TRAVAIL " + (ig + 1) + " : " + g.u.nom.toUpperCase());
      L.push("Qui y travaille : " + g.u.qui);
      g.liste.forEach(function (x, ix) {
        L.push("");
        L.push("  " + (ig + 1) + "." + (ix + 1) + " " + x.r.n);
        L.push("  Situation de travail : " + x.r.s);
        L.push("  Gravité " + x.r.g + " · Fréquence " + x.r.f + " · Priorité " + x.pr.p + " (" + x.pr.mot + ")");
        L.push("  Mesures de prévention :");
        x.r.mes.forEach(function (mm) { L.push("   - " + mm); });
        L.push("  Responsable : " + (x.resp || "[ responsable ]"));
        L.push("  Échéance : " + (dateFr(x.ech) || "[ échéance ]"));
      });
    });
    L.push("");

    var titre4 = eff !== null && eff >= 50
      ? "4. LE PROGRAMME ANNUEL DE PRÉVENTION"
      : "4. LA LISTE DES ACTIONS DE PRÉVENTION ET DE PROTECTION";
    L.push(titre4);
    L.push(tiret);
    if (eff === null) {
      L.push("[ effectif non renseigné : au-delà de cinquante salariés les résultats débouchent sur " +
        "un programme annuel de prévention, en deçà sur une liste d'actions de prévention et de " +
        "protection consignée dans le document unique (L. 4121-3-1, III). Renseignez l'effectif " +
        "pour que la bonne forme soit produite. ]");
    } else if (eff >= 50) {
      L.push("L'effectif étant de " + eff + " salariés, les résultats de l'évaluation débouchent sur " +
        "un programme annuel de prévention des risques professionnels et d'amélioration des " +
        "conditions de travail. Il fixe la liste détaillée des mesures à prendre au cours de " +
        "l'année à venir et, pour chaque mesure, ses conditions d'exécution, des indicateurs de " +
        "résultat et l'estimation de son coût ; il identifie les ressources mobilisables et " +
        "comprend un calendrier de mise en œuvre (L. 4121-3-1, III, 1°).");
      L.push("Les colonnes « indicateur » et « coût » restent à compléter mesure par mesure : elles " +
        "ne se devinent pas depuis cet outil.");
    } else {
      L.push("L'effectif étant de " + eff + " salariés, les résultats de l'évaluation débouchent sur " +
        "la définition d'actions de prévention des risques et de protection des salariés, dont la " +
        "liste est consignée dans le présent document et dans ses mises à jour " +
        "(L. 4121-3-1, III, 2°).");
    }
    L.push("");
    L.push("Actions retenues, classées par priorité décroissante :");
    var plan = [];
    groupes.forEach(function (g) {
      g.liste.forEach(function (x) { plan.push({ u: g.u.nom, x: x }); });
    });
    plan.sort(function (a, b) { return b.x.pr.p - a.x.pr.p; });
    if (!plan.length) L.push("  [ aucune action retenue ]");
    plan.forEach(function (p, i) {
      L.push("  " + (i + 1) + ". [" + p.x.pr.p + " " + p.x.pr.mot + "] " + p.u + " : " + p.x.r.n +
        " · responsable " + (p.x.resp || "[ à désigner ]") +
        " · échéance " + (dateFr(p.x.ech) || "[ à fixer ]") +
        (eff !== null && eff >= 50 ? " · indicateur [ à définir ] · coût [ à estimer ]" : ""));
    });
    L.push("");

    L.push("5. LA TENUE DU DOCUMENT");
    L.push(tiret);
    L.push("Mise à jour. Au moins chaque année dans les entreprises d'au moins onze salariés ; lors " +
      "de toute décision d'aménagement important modifiant les conditions de santé et de sécurité " +
      "ou les conditions de travail ; et lorsqu'une information supplémentaire intéressant " +
      "l'évaluation d'un risque est portée à la connaissance de l'employeur (R. 4121-2). Ces trois " +
      "cas s'ajoutent, ils ne se remplacent pas.");
    L.push("Conservation. Le document et ses versions antérieures sont tenus, pendant une durée de " +
      "quarante ans à compter de leur élaboration, à la disposition des travailleurs et anciens " +
      "travailleurs, des membres de la délégation du personnel du comité social et économique, du " +
      "service de prévention et de santé au travail, des agents du système d'inspection du travail, " +
      "des agents des services de prévention des organismes de sécurité sociale, des agents des " +
      "organismes professionnels de santé, de sécurité et des conditions de travail, et des " +
      "inspecteurs de la radioprotection (R. 4121-4). Une version n'est jamais écrasée par la " +
      "suivante.");
    L.push("Avis d'accès. Un avis indiquant les modalités d'accès des travailleurs au document " +
      "unique est affiché à une place convenable et aisément accessible dans les lieux de travail ; " +
      "dans les entreprises dotées d'un règlement intérieur, au même emplacement que celui réservé " +
      "au règlement intérieur (R. 4121-4).");
    L.push("Emplacement retenu pour cet avis : " + ou("avisLieu", "lieu exact de l'affichage"));
    L.push("Transmission. Le document est transmis à chaque mise à jour au service de prévention et " +
      "de santé au travail auquel l'employeur adhère (L. 4121-3-1, VI).");
    L.push("Consultation. Le comité social et économique est consulté sur le document unique et sur " +
      "ses mises à jour (L. 4121-3). Dans les établissements qui en sont dotés, le document est " +
      "utilisé pour l'établissement du rapport annuel prévu au 1° de l'article L. 2312-27 " +
      "(R. 4121-3).");
    L.push("Sanction. Ne pas transcrire ou ne pas mettre à jour les résultats de l'évaluation dans " +
      "les conditions des articles R. 4121-1 et R. 4121-2 est puni de l'amende prévue pour les " +
      "contraventions de cinquième classe (R. 4741-1).");
    L.push("");

    L.push("6. LES TEXTES SUR LESQUELS CE DOCUMENT SE FONDE");
    L.push(tiret);
    TEXTES.forEach(function (t) { L.push("  - " + t.n + " du code du travail, version " + t.id + ", " + LU + "."); });
    L.push("");
    L.push("Les mesures de prévention énoncées ci-dessus sont des mesures retenues par l'employeur. " +
      "Elles ne sont l'énoncé d'aucune obligation légale particulière : seuls les articles ci-dessus " +
      "sont cités comme tels.");
    L.push("");
    L.push("Fait à " + ou("adresse", "lieu") + ", le " + (dateFr(v("dateVersion")) || "[ date ]"));
    L.push(ou("responsable", "nom et qualité") + ", signature :");
    return L.join("\n");
  }

  function assembler() {
    var groupes = retenus(), n = 0;
    groupes.forEach(function (g) { n += g.liste.length; });
    var eff = effectif();
    $("#resume").innerHTML = '<div class="avis info"><b>' + groupes.length + " unité" +
      (groupes.length > 1 ? "s" : "") + " de travail, " + n + " risque" + (n > 1 ? "s" : "") + " inventorié" +
      (n > 1 ? "s" : "") + "</b>" +
      (eff === null
        ? "L'effectif n'est pas renseigné : la section 4 sort entre crochets, parce que c'est lui, et lui seul, qui décide entre le programme annuel et la liste d'actions."
        : (eff >= 50 ? "Effectif de " + eff + " salariés : les résultats débouchent sur un programme annuel de prévention."
                     : "Effectif de " + eff + " salariés : les résultats débouchent sur une liste d'actions de prévention et de protection.")) +
      " Relisez avant diffusion, complétez les crochets, puis affichez l'avis d'accès et transmettez " +
      "le document au service de prévention et de santé au travail.</div>";
    $("#sortie").textContent = texteDocument();
  }

  /* ------------------------------------------------------------- sorties */
  function nomFichier(ext) {
    return "document-unique-" + new Date().toISOString().slice(0, 10) + "." + ext;
  }

  $("#dl-txt").addEventListener("click", function () {
    window.AuditExport.telecharger($("#sortie").textContent, nomFichier("txt"), "text/plain;charset=utf-8");
  });

  $("#copier").addEventListener("click", function () {
    var t = $("#sortie").textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(t);
    else { var a = document.createElement("textarea"); a.value = t; document.body.appendChild(a);
           a.select(); document.execCommand("copy"); a.remove(); }
    $("#copier").textContent = "Copié";
    setTimeout(function () { $("#copier").textContent = "Copier"; }, 1600);
  });

  $("#imprimer").addEventListener("click", function () { window.print(); });

  $("#dl-docx").addEventListener("click", function () {
    var m = metier(), eff = effectif(), items = [];
    items.push({ k: "sur", t: ou("denomination", "dénomination") + " · " + m.nom +
      " · version du " + (dateFr(v("dateVersion")) || "[ date ]") });
    items.push({ k: "p", t: "Établissement : " + ou("etablissement", "établissement") +
      "  ·  Adresse : " + ou("adresse", "adresse") + "  ·  SIRET : " + ou("siret", "SIRET") +
      "  ·  Effectif : " + (eff === null ? "[ effectif ]" : eff + " salariés") });
    items.push({ k: "p", t: "Rédacteur : " + ou("responsable", "nom et qualité") +
      "  ·  Service de prévention et de santé au travail : " + ou("spst", "nom du service") });

    items.push({ k: "h1", t: "La méthode de cotation retenue" });
    items.push({ k: "p", t: "Aucun texte n'impose de coter un risque : la cotation est une aide au classement des actions, sans valeur réglementaire." });
    items.push({ k: "puce", t: "Gravité : " + [1, 2, 3, 4].map(function (k) { return DM.GRAVITE[k]; }).join(" ; ") });
    items.push({ k: "puce", t: "Fréquence : " + [1, 2, 3, 4].map(function (k) { return DM.FREQUENCE[k]; }).join(" ; ") });
    items.push({ k: "puce", t: "Priorité : gravité multipliée par fréquence. 1 à 3 à surveiller, 4 à 6 à programmer, 8 à 9 prioritaire, 12 à 16 action immédiate." });

    items.push({ k: "h1", t: "Les unités de travail et les risques identifiés" });
    var groupes = retenus(), plan = [];
    groupes.forEach(function (g) {
      items.push({ k: "h2", t: "Unité de travail : " + g.u.nom });
      items.push({ k: "note", t: g.u.qui });
      items.push({ k: "table",
        head: ["Risque", "Gravité", "Fréquence", "Priorité", "Responsable", "Échéance"],
        rows: g.liste.map(function (x) {
          plan.push({ u: g.u.nom, x: x });
          return [x.r.n, String(x.r.g), String(x.r.f), x.pr.p + " " + x.pr.mot,
            x.resp || "[ à désigner ]", dateFr(x.ech) || "[ à fixer ]"];
        }) });
      g.liste.forEach(function (x) {
        items.push({ k: "h3", t: x.r.n });
        items.push({ k: "p", t: "Situation de travail : " + x.r.s });
        x.r.mes.forEach(function (mm) { items.push({ k: "puce", t: mm }); });
        items.push({ k: "note", t: "Responsable : " + (x.resp || "[ à désigner ]") +
          "  ·  Échéance : " + (dateFr(x.ech) || "[ à fixer ]") });
      });
    });

    items.push({ k: "saut" });
    items.push({ k: "h1", t: eff !== null && eff >= 50
      ? "Le programme annuel de prévention" : "La liste des actions de prévention et de protection" });
    if (eff === null)
      items.push({ k: "p", t: "[ effectif non renseigné : au-delà de cinquante salariés, programme annuel de prévention ; en deçà, liste d'actions consignée dans le document unique (L. 4121-3-1, III) ]" });
    else if (eff >= 50)
      items.push({ k: "p", t: "Effectif de " + eff + " salariés : les résultats débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail, avec pour chaque mesure ses conditions d'exécution, des indicateurs de résultat et l'estimation de son coût, les ressources mobilisables et un calendrier de mise en œuvre (L. 4121-3-1, III, 1°)." });
    else
      items.push({ k: "p", t: "Effectif de " + eff + " salariés : les résultats débouchent sur la définition d'actions de prévention des risques et de protection des salariés, consignée dans le présent document (L. 4121-3-1, III, 2°)." });
    plan.sort(function (a, b) { return b.x.pr.p - a.x.pr.p; });
    items.push({ k: "table",
      head: eff !== null && eff >= 50
        ? ["Priorité", "Unité", "Action", "Responsable", "Échéance", "Indicateur", "Coût"]
        : ["Priorité", "Unité", "Action", "Responsable", "Échéance"],
      rows: plan.map(function (p) {
        var l = [p.x.pr.p + " " + p.x.pr.mot, p.u, p.x.r.n,
          p.x.resp || "[ à désigner ]", dateFr(p.x.ech) || "[ à fixer ]"];
        if (eff !== null && eff >= 50) l.push("[ à définir ]", "[ à estimer ]");
        return l;
      }) });

    items.push({ k: "h1", t: "La tenue du document" });
    items.push({ k: "puce", t: "Mise à jour : au moins chaque année à partir de onze salariés, lors de toute décision d'aménagement important, et à chaque information nouvelle intéressant l'évaluation d'un risque (R. 4121-2)." });
    items.push({ k: "puce", t: "Conservation : quarante ans à compter de l'élaboration, à la disposition des sept catégories énumérées par R. 4121-4. Une version n'est jamais écrasée par la suivante." });
    items.push({ k: "puce", t: "Avis d'accès affiché à une place convenable et aisément accessible, et au même emplacement que le règlement intérieur là où il en existe un (R. 4121-4). Emplacement retenu : " + ou("avisLieu", "lieu à fixer") + "." });
    items.push({ k: "puce", t: "Transmission au service de prévention et de santé au travail à chaque mise à jour (L. 4121-3-1, VI)." });
    items.push({ k: "puce", t: "Consultation du comité social et économique sur le document et ses mises à jour (L. 4121-3)." });
    items.push({ k: "puce", t: "Ne pas transcrire ou ne pas mettre à jour est puni de l'amende prévue pour les contraventions de cinquième classe (R. 4741-1)." });

    items.push({ k: "h1", t: "Les textes sur lesquels ce document se fonde" });
    TEXTES.forEach(function (t) {
      items.push({ k: "puce", t: t.n + " du code du travail, version " + t.id + ", " + LU + "." });
    });
    items.push({ k: "note", t: "Les mesures de prévention énoncées sont des mesures retenues par l'employeur ; elles ne sont l'énoncé d'aucune obligation légale particulière." });
    items.push({ k: "p", t: "Fait le " + (dateFr(v("dateVersion")) || "[ date ]") + ", " +
      ou("responsable", "nom et qualité") + ", signature :" });

    window.AuditExport.telecharger(
      window.AuditExport.docx(items, "Document unique d'évaluation des risques professionnels"),
      nomFichier("docx"),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  });

  /* ------------------------------------------------------------------ */
  /* Les textes, à disposition sur l'écran de départ. */
  $("#textes").innerHTML = TEXTES.map(function (t) {
    return "<p><b>" + ech(t.n) + "</b> (version " + ech(t.id) + ", " + LU + "). " + ech(t.t) + "</p>";
  }).join("");

  /* ------------------------------------------------------------------ */
  /* L'ENTRÉE. « non » ouvre le document, sans une question de plus. */
  var depart = new URLSearchParams(location.search).get("depart");
  if (depart === "non") {
    E.trouve = {};
    metier().unites.forEach(function (u) {
      u.risques.forEach(function (r, i) { E.pris[idRisque(u, i)] = true; });
    });
    garder();
    onglet("blocs");
  }
})();
