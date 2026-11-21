/* LE SUIVI TACHYGRAPHE D'UN CONDUCTEUR, EN QUATRE ÉTAPES.

   POURQUOI CE FICHIER EXISTE

   La fiche du conducteur tenait tout sur une seule colonne : profil,
   documents, lecture de carte, anomalies, mesures. On y lisait, on n'y
   avançait pas. Elle est maintenant découpée selon ce que l'employeur doit
   pouvoir prouver, dans l'ordre où il le fait :

     1. Instructions : les documents remis au conducteur, imprimés, signés,
        avec la date de signature et la date de versement au dossier.
     2. Contrôle et suivi : la lecture de la carte du conducteur et du fichier
        du tachygraphe du camion, plus ce qui arrive par ailleurs (compte
        rendu, procès-verbal, signalement).
     3. Réaction : le passé disciplinaire du salarié, les faits retenus, la
        date où l'employeur en a eu connaissance, la sanction et son courrier.
     4. Coffre-fort : ce qui a été signé, les contrôles effectués, les
        sanctions.

   Dès que des faits sont portés à la fiche, l'écran passe à la réaction ; on
   revient au contrôle d'un geste.

   CE QUE L'ÉCRAN NE DÉCIDE JAMAIS

   Il propose une sanction, il ne la choisit pas. Il compte les délais, il ne
   dit pas qui conduisait sans carte : le fichier du camion dit seulement
   quelle carte a été insérée ce jour-là.

   LES DÉLAIS, LUS À LA SOURCE

   Article L. 1332-4 du code du travail : « Aucun fait fautif ne peut donner
   lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un
   délai de deux mois à compter du jour où l'employeur en a eu connaissance, à
   moins que ce fait ait donné lieu dans le même délai à l'exercice de
   poursuites pénales. » Le délai part de la connaissance, pas des faits :
   chaque groupe de faits porte donc sa date de connaissance, et l'écran la
   demande.

   Article L. 1332-2 : « La sanction ne peut intervenir moins de deux jours
   ouvrables, ni plus d'un mois après le jour fixé pour l'entretien. »

   Article L. 1332-5 : « Aucune sanction antérieure de plus de trois ans à
   l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui
   d'une nouvelle sanction. »

   Tout reste sur l'appareil : rien n'est envoyé.                             */

(function (window) {
  "use strict";

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  var ETAPES = ["Instructions", "Contrôle et suivi", "Réaction", "Coffre-fort"];
  var RUBRIQUE = "suivi-tachygraphe";

  /* ───────────────────────────── les dates ──────────────────────────────── */

  function deux(n) { return (n < 10 ? "0" : "") + n; }
  function isoDe(d) { return d.getFullYear() + "-" + deux(d.getMonth() + 1) + "-" + deux(d.getDate()); }
  function aujourdhui() { return isoDe(new Date()); }
  function versDate(s) { return new Date(s + "T12:00:00"); }
  function jj(s) { return s ? s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4) : ""; }
  function enLettres(s) { var d = versDate(s); return d.getDate() + " " + MOIS[d.getMonth()] + " " + d.getFullYear(); }
  function horodatage(isoDT) { var d = new Date(isoDT); return jj(isoDe(d)) + " à " + deux(d.getHours()) + " h " + deux(d.getMinutes()); }
  function plusJours(s, n) { var d = versDate(s); d.setDate(d.getDate() + n); return isoDe(d); }
  /* De quantième à quantième ; s'il n'existe pas dans le mois d'arrivée, le dernier jour de ce mois. */
  function plusMois(s, n) {
    var d = versDate(s), jour = d.getDate();
    d.setDate(1); d.setMonth(d.getMonth() + n);
    var dernier = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(jour, dernier));
    return isoDe(d);
  }
  function ecart(a, b) { return Math.round((versDate(b) - versDate(a)) / 86400000); }
  /* Le premier jour possible après n jours ouvrables pleins, du lundi au
     samedi. Les jours fériés ne sont pas pris en compte : l'écran le dit. */
  function apresOuvrables(s, n) {
    var d = versDate(s), k = 0;
    while (k < n) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) k++; }
    d.setDate(d.getDate() + 1); if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return isoDe(d);
  }
  /* LE DÉLAI ENTRE LA CONVOCATION ET L'ENTRETIEN. Défaut relevé le 21 novembre
     2026 : une convocation datée du jour acceptait un entretien le jour même.

     Consigne du même jour : toute convocation à un entretien préalable suit la
     règle du droit commun, celle du licenciement, quelle que soit la sanction
     que l'employeur retiendra ensuite. La lettre vise « une mesure
     disciplinaire pouvant aller jusqu'au licenciement » : le salarié ne sait
     pas, en la recevant, laquelle sera prise.

     Le texte : « L'entretien préalable ne peut avoir lieu moins de cinq jours
     ouvrables après la présentation de la lettre recommandée ou la remise en
     main propre de la lettre de convocation » (L. 1232-2,
     LEGIARTI000006901000). Le délai qui expire un samedi, un dimanche ou un
     jour férié est prorogé « jusqu'au premier jour ouvrable suivant »
     (R. 1231-1, LEGIARTI000018537730).

     Les jours fériés ne sont pas comptés : l'écran le dit. */
  function premierEntretien(remise) {
    var d = versDate(remise), k = 0;
    while (k < 5) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) k++; }
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);          /* expire un samedi : prorogé au lundi */
    d.setDate(d.getDate() + 1); if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return isoDe(d);
  }
  var REGLE_ENTRETIEN = "L'entretien ne peut avoir lieu moins de cinq jours ouvrables après la remise en main propre de la convocation, ou la présentation de la lettre recommandée (L. 1232-2). La règle vaut pour toute convocation, quelle que soit la sanction retenue ensuite. Si la convocation part par la poste, comptez à partir du jour où elle est présentée. Les jours fériés ne sont pas comptés ici.";
  /* Une heure du tachygraphe (temps universel) rendue en heure de Paris. */
  function heureParis(jour, hm) {
    try {
      var base = new Date(jour + "T00:00:00Z").getTime();
      var p = hm.split(":"), t = new Date(base + (+p[0] * 60 + +p[1]) * 60000);
      return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(t);
    } catch (e) { return hm; }
  }
  function duree(min) { var h = Math.floor(min / 60), m = min % 60; return h + " h" + (m ? " " + deux(m) : ""); }

  function ech(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  function pluriel(n, mot) { return n + " " + mot + (n > 1 ? "s" : ""); }
  function majuscule(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
  function mots(s) {
    return String(s || "").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Z]+/g, " ").trim().split(" ").filter(function (w) { return w.length >= 2; });
  }
  function memeImmat(x, y) {
    function n(s) { return String(s || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase(); }
    return !!n(x) && n(x) === n(y);
  }

  /* ───────────────────────────── le montage ─────────────────────────────── */

  function monter(opts) {
    var CT = window.ConformiteTransport, cont = opts.cont;
    var S = { id: null, etape: 0, decoches: {}, reac: { cle: null, penal: false, entretien: "" } };

    /* la fenêtre et le message bref, créés une fois */
    var ovl = document.createElement("div"); ovl.className = "st-ovl";
    ovl.innerHTML = '<div class="st-modale"><div class="st-mtop"><b></b><button type="button" aria-label="Fermer">&times;</button></div><div class="st-mc"></div><div class="st-ma"></div></div>';
    document.body.appendChild(ovl);
    var mt = ovl.querySelector(".st-mtop b"), mc = ovl.querySelector(".st-mc"), ma = ovl.querySelector(".st-ma");
    ovl.querySelector(".st-mtop button").onclick = fermer;
    ovl.addEventListener("click", function (e) { if (e.target === ovl) fermer(); });
    var bulle = document.createElement("div"); bulle.className = "st-toast"; document.body.appendChild(bulle);
    function fermer() { ovl.classList.remove("on"); mc.innerHTML = ""; ma.innerHTML = ""; }
    function ouvrir(titre, html) { mt.textContent = titre; mc.innerHTML = html; ma.innerHTML = ""; ovl.classList.add("on"); mc.scrollTop = 0; }
    function bouton(texte, principal, action) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = texte;
      if (principal) b.className = "pri"; b.onclick = action; ma.appendChild(b); return b;
    }
    function dire(m) { bulle.textContent = m; bulle.classList.add("on"); setTimeout(function () { bulle.classList.remove("on"); }, 2600); }
    function prevenirPage() { if (opts.apresChangement) opts.apresChangement(); }

    /* ─────────────────────── ce que la fiche sait ───────────────────────── */

    function conducteur() { return CT.conducteurs().filter(function (x) { return x.id === S.id; })[0]; }

    /* Les faits non traités, regroupés par nature, par source et par date de
       connaissance : ce sont les lignes de la réaction. */
    function groupes(tous) {
      var L = CT.suiviConducteur(S.id).anomalies, par = {}, ordre = [];
      L.forEach(function (a, i) {
        if (a.traite && !tous) return;
        var cle = (a.type || "").toLowerCase() + "|" + (a.src || "") + "|" + (a.connu || "") + "|" + (a.traite || "");
        if (!par[cle]) { par[cle] = { cle: cle, t: majuscule(a.type || "fait non précisé"), src: a.src || "saisi à la main", connu: a.connu || "", traite: a.traite || "", rangs: [], faits: [] }; ordre.push(cle); }
        par[cle].rangs.push(i); par[cle].faits.push({ date: a.date || "", detail: a.detail || "", rang: i });
      });
      return ordre.map(function (c) { par[c].faits.sort(function (x, y) { return x.date < y.date ? -1 : 1; }); return par[c]; });
    }
    function delai(g) {
      if (!g.connu) return { inconnu: true, prescrit: false };
      var lim = plusMois(g.connu, 2), j = ecart(aujourdhui(), lim);
      return { limite: lim, jours: j, prescrit: j < 0 && !S.reac.penal };
    }
    function retenus() {
      return groupes().filter(function (g) { var d = delai(g); return !S.decoches[g.cle] && !d.prescrit && !d.inconnu; });
    }
    function sanctionDe(cle) { return CT.SANCTIONS.filter(function (x) { return x.cle === cle; })[0]; }

    /* Le passé disciplinaire : les sanctions notifiées, celles de plus de trois
       ans écartées, celles qui portent sur des faits de même nature. Un rappel
       à l'ordre et une convocation restée sans suite ne sont pas des sanctions. */
    function passe() {
      var limite = plusMois(aujourdhui(), -36);
      var enCours = groupes().map(function (g) { return g.t.toLowerCase(); });
      var L = [];
      CT.suiviConducteur(S.id).mesures.forEach(function (m, i) {
        var s = m.cle ? sanctionDe(m.cle) : null;
        if (!m.cle && (m.categorie || "").toLowerCase() !== "sanction") return;
        var natures = (m.natures && m.natures.length ? m.natures : [m.pour || ""]).map(function (n) { return String(n).toLowerCase(); });
        L.push({ m: m, rang: i, nom: m.objet || (s ? s.nom : "Sanction"),
          compte: !m.convocation && (!s || s.disciplinaire),
          ancienne: (m.date || "") < limite,
          meme: natures.some(function (n) { return enCours.some(function (e) { return e && (n.indexOf(e) >= 0 || e.indexOf(n) >= 0) && n; }); }) });
      });
      L.sort(function (x, y) { return (x.m.date || "") < (y.m.date || "") ? 1 : -1; });
      var valables = L.filter(function (x) { return x.compte && !x.ancienne; });
      return { liste: L, valables: valables.length, meme: valables.filter(function (x) { return x.meme; }).length,
        ecartees: L.filter(function (x) { return x.compte && x.ancienne; }).length, enCours: enCours.length };
    }
    function phrasePasse(p) {
      if (!p.valables) return "Première fois : aucune sanction au dossier sur les trois dernières années.";
      return "Récidive : " + pluriel(p.valables, "sanction") + " sur les trois dernières années" +
        (!p.enCours ? "." : p.meme ? ", dont " + p.meme + " pour des faits de même nature." : ", pour des faits d'une autre nature.");
    }

    /* Les échéances de téléchargement qui regardent ce conducteur : sa carte, et
       les camions où sa carte a été vue. */
    function echeanceCarte(c) {
      return CT.echeances().filter(function (x) { return x.quoi.indexOf("carte") >= 0 && x.qui === c.nom; })[0] || null;
    }
    function camionsDuConducteur() {
      var carte = CT.carteDe(S.id); if (!carte || !carte.numero) return [];
      var vus = {}, J = CT.joursVehiculePourCarte(carte.numero);
      Object.keys(J).forEach(function (d) { J[d].vehicules.forEach(function (v) { vus[v] = 1; }); });
      return CT.echeances().filter(function (x) { return x.quoi.indexOf("carte") < 0 && Object.keys(vus).some(function (v) { return memeImmat(v, x.qui); }); });
    }
    function etatEcheance(x) {
      if (!x || !x.dernier) return { niveau: "orange", badge: '<span class="st-badge orange">Jamais lu</span>', txt: "aucun téléchargement enregistré", alerte: "Aucun téléchargement enregistré." };
      var j = x.jours;
      return { niveau: j < 0 ? "rouge" : j <= 7 ? "orange" : "vert",
        badge: j < 0 ? '<span class="st-badge rouge">Dépassé de ' + (-j) + ' j</span>' : j <= 7 ? '<span class="st-badge orange">Dans ' + j + ' j</span>' : '<span class="st-badge vert">À jour</span>',
        txt: "téléchargement du " + jj(x.dernier) + ", prochaine limite le " + jj(x.date),
        alerte: j < 0 ? "Limite du " + jj(x.date) + " dépassée de " + pluriel(-j, "jour") + "." : "À faire avant le " + jj(x.date) + ", dans " + pluriel(j, "jour") + "." };
    }
    function alertes(c) {
      var L = [], ec = etatEcheance(echeanceCarte(c));
      if (ec.niveau !== "vert") L.push({ niveau: ec.niveau, etape: 1, titre: "Carte du conducteur à télécharger", txt: ec.alerte });
      camionsDuConducteur().forEach(function (v) {
        var ev = etatEcheance(v);
        if (ev.niveau !== "vert") L.push({ niveau: ev.niveau, etape: 1, titre: "Tachygraphe du camion " + v.qui + " à télécharger", txt: ev.alerte });
      });
      var G = groupes(), perdus = G.filter(function (g) { return delai(g).prescrit; });
      var sansDate = G.filter(function (g) { return delai(g).inconnu; });
      var vivants = G.filter(function (g) { var d = delai(g); return !d.prescrit && !d.inconnu; })
        .sort(function (x, y) { return delai(x).limite < delai(y).limite ? -1 : 1; });
      if (sansDate.length) L.unshift({ niveau: "orange", etape: 2, titre: "Date de connaissance à préciser", txt: "Pour " + sansDate.map(function (g) { return g.t.toLowerCase(); }).join(", ") + " : c'est elle qui fait courir les deux mois." });
      if (perdus.length) L.unshift({ niveau: "rouge", etape: 2, titre: "Faits prescrits", txt: majuscule(perdus.map(function (g) { return g.t.toLowerCase(); }).join(", ")) + " : plus de deux mois depuis que vous en avez connaissance." });
      if (vivants.length && !S.reac.penal && delai(vivants[0]).jours <= 15) {
        var d = delai(vivants[0]);
        L.unshift({ niveau: d.jours <= 5 ? "rouge" : "orange", etape: 2, titre: "Sanction à engager avant le " + jj(d.limite),
          txt: (d.jours === 0 ? "Dernier jour aujourd'hui" : "Plus que " + pluriel(d.jours, "jour")) + " pour " + vivants[0].t.toLowerCase() + "." });
      }
      return L;
    }

    /* ───────────────────────────── le rendu ─────────────────────────────── */

    function peindre() {
      var L = CT.conducteurs();
      if (!L.length) { cont.innerHTML = '<p class="vide">Le registre du personnel ne porte encore aucun conducteur.</p>'; return; }
      if (!S.id || !L.some(function (x) { return x.id === S.id; })) { S.id = L[0].id; S.etape = 0; S.decoches = {}; }
      var c = conducteur(), A = alertes(c), es = CT.essaiEnCours();
      var h = (es ? '<div class="st-essai"><b>Mode essai' + (es.demonstration ? ' : démonstration' : '') + '</b>' +
          (es.demonstration ? 'Conducteur et camion fictifs, parcours déjà déroulé. Touchez à tout : rien n\'est gardé.' : 'Ce que vous faites depuis le début de l\'essai peut être effacé d\'un geste.') +
          '<div class="st-btns"><button type="button" class="st-btn pri" data-st="essai-annuler">Annuler l\'essai et tout remettre comme avant</button>' +
          (es.demonstration ? '' : '<button type="button" class="st-btn" data-st="essai-garder">Garder ce que j\'ai fait</button>') + '</div></div>' : '') +
        '<div class="choixcond"><label>Salarié (fichier du personnel)<select id="sel-cond">' +
        L.map(function (x) { return '<option value="' + ech(x.id) + '"' + (x.id === S.id ? ' selected' : '') + '>' + ech(x.nom) + (x.fond === "rouge" ? " (à traiter)" : "") + '</option>'; }).join("") +
        '</select></label>' + (es ? '' : '<button type="button" class="st-lien" data-st="essai">Faire un essai, sans rien modifier</button>') + '</div>';
      h += '<div class="st"><div class="st-entete"><div><div class="st-nom">' + ech(c.nom) + (c.poidsLourd ? ' <span class="st-pl">poids lourd</span>' : '') + '</div>' +
        '<div class="st-sub">' + ech(c.poste || "poste non précisé") + '</div></div>' +
        '<button type="button" class="st-lien" data-st="fiche">Fiche en Word</button></div>';
      h += A.map(function (x) { return '<button type="button" class="st-bandeau' + (x.niveau === "orange" ? ' orange' : '') + '" data-st="aller" data-v="' + x.etape + '"><b>' + ech(x.titre) + '</b>' + ech(x.txt) + '</button>'; }).join("");
      var fait = etapesFaites();
      h += '<div class="st-etapes">' + ETAPES.map(function (nom, i) {
        var X = A.filter(function (x) { return x.etape === i; }), ok = fait[i] && i !== S.etape;
        return '<button type="button" class="' + (i === S.etape ? 'on' : '') + '" data-st="etape" data-v="' + i + '"><span class="num' + (ok ? ' ok' : '') + '">' + (ok ? '✓' : (i + 1)) + '</span><span class="lb">' + nom + '</span>' +
          (X.length ? '<span class="point' + (X.some(function (x) { return x.niveau === "rouge"; }) ? '' : ' orange') + '"></span>' : '') + '</button>';
      }).join("") + '</div>';
      h += '<div class="st-panneau">' + (S.etape === 0 ? panInstructions() : S.etape === 1 ? panControle(c) : S.etape === 2 ? panReaction() : panCoffre()) + '</div></div>';
      cont.innerHTML = h;
    }
    function etapesFaites() {
      var d = CT.docsRemis(S.id), s = CT.suiviConducteur(S.id);
      return [Object.keys(d).some(function (k) { return d[k].etat === "signe"; }), CT.journalControles(S.id).length > 0,
        s.mesures.some(function (m) { return m.cle; }), false];
    }

    /* ─────────────────────── 1. les instructions ────────────────────────── */

    function listeDocs() {
      var pr = CT.profilConducteur(S.id), E = CT.docsRemis(S.id);
      return CT.docsARemettre(pr).map(function (it) { var e = E[it[0]] || {}; return { cle: it[0], nom: it[1], etat: e.etat || "afaire", e: e }; });
    }
    function panInstructions() {
      var h = '<h2 class="st-h2">Instructions - documents remis et signés</h2>';
      h += listeDocs().map(function (d) {
        var badge = d.etat === "afaire" ? '<span class="st-badge gris">À faire</span>' : d.etat === "imprime" ? '<span class="st-badge orange">À signer</span>' : '<span class="st-badge vert">Signé</span>';
        var sous = d.etat === "afaire" ? "non remis" : d.etat === "imprime" ? "imprimé le " + jj(d.e.imprimeLe) + ", en attente de signature"
          : "signé le " + jj(d.e.signeLe) + (d.e.mode === "ecran" ? " à l'écran" : " sur papier") + ", versé le " + jj((d.e.verseLe || "").slice(0, 10));
        var b = d.etat === "afaire" ? '<button type="button" class="st-btn" data-st="voir-doc" data-v="' + d.cle + '">Voir</button><button type="button" class="st-btn pri" data-st="imprimer" data-v="' + d.cle + '">Imprimer</button>'
          : d.etat === "imprime" ? '<button type="button" class="st-btn" data-st="importer" data-v="' + d.cle + '">Importer la copie signée</button><button type="button" class="st-btn pri" data-st="signer" data-v="' + d.cle + '">Signer à l\'écran</button>'
          : '<button type="button" class="st-btn" data-st="voir-doc" data-v="' + d.cle + '">Voir le document signé</button>';
        return '<div class="st-carte"><div class="st-tete"><div><div class="st-nom2">' + ech(d.nom) + '</div><div class="st-sub">' + ech(sous) + '</div></div>' + badge + '</div><div class="st-btns">' + b + '</div></div>';
      }).join("");
      /* le profil et ce que le conducteur doit détenir : inchangés, repliés */
      var pr = CT.profilConducteur(S.id), eds = CT.echeancesDoc(S.id);
      function seg(champ, val) {
        return '<div class="seg">' + [["1", champ === "pl" ? "Poids lourd" : "Oui"], ["0", champ === "pl" ? "Léger" : "Non"]].map(function (o) {
          return '<button type="button" data-st="profil" data-v="' + champ + '" data-val="' + o[0] + '"' + (o[0] === val ? ' class="on"' : '') + '>' + o[1] + '</button>'; }).join("") + '</div>';
      }
      h += '<details class="st-repli"><summary>Profil et documents à détenir</summary>' +
        '<div class="ctl"><span class="lb">Type de véhicule</span>' + seg("pl", pr.pl ? "1" : "0") + '</div>' +
        '<div class="ctl"><span class="lb">Matière dangereuse (ADR)</span>' + seg("adr", pr.adr ? "1" : "0") + '</div>' +
        CT.docsADetenir(pr).map(function (it) {
          var val = eds[it[0]] || '', st = CT.statutDoc(val);
          return '<div class="fitem"><div class="ti"><b>' + ech(it[1]) + '</b><span>' + ech(it[2]) + '</span></div><div class="co"><span class="lab">valable jusqu\'au</span>' +
            '<input type="date" data-st-ech="' + it[0] + '" value="' + val + '"><span class="pastille f-' + st.fond + '">' + ech(st.txt) + '</span></div></div>';
        }).join("") + '</details>';
      return h;
    }
    /* Les blocs d'un document Word, rendus à l'écran pour l'aperçu. */
    function rendre(items) {
      return '<div class="st-doc">' + (items || []).map(function (i) {
        if (i.k === "bandeau") return '<p class="ent">' + ech(i.t) + (i.sous ? '<small>' + ech(i.sous) + '</small>' : '') + '</p>';
        if (i.k === "h1") return '<h3>' + ech(i.t) + '</h3>';
        if (i.k === "h2") return '<h4>' + ech(i.t) + '</h4>';
        if (i.k === "note") return '<p class="q">' + ech(i.t) + '</p>';
        if (i.k === "puce") return '<p>- ' + ech(i.t) + '</p>';
        if (i.k === "table") return '<table><thead><tr>' + (i.head || []).map(function (x) { return '<th>' + ech(x) + '</th>'; }).join("") + '</tr></thead><tbody>' +
          (i.rows || []).map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + ech(x) + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table>';
        return '<p>' + ech(i.t) + '</p>';
      }).join("") + '</div>';
    }
    function voirDoc(cle) {
      var d = listeDocs().filter(function (x) { return x.cle === cle; })[0]; if (!d) return;
      var h = rendre(CT.docConducteurItems(S.id, cle));
      if (d.etat === "signe") {
        h += '<div class="st-res"><p class="t">Signé le ' + jj(d.e.signeLe) + (d.e.mode === "ecran" ? " à l'écran" : " sur papier") + '</p><p>Versé au dossier le ' + horodatage(d.e.verseLe) + '.</p>' +
          (d.e.sig ? '<img class="st-sig" alt="Signature du conducteur" src="' + d.e.sig + '">' : '') +
          (d.e.docId ? '<p><button type="button" class="st-btn" id="st-copie">Ouvrir la copie signée</button></p>' : '') + '</div>';
      }
      ouvrir(d.nom, h);
      var bc = document.getElementById("st-copie");
      if (bc) bc.onclick = function () {
        if (!window.Documents) { dire("La base des documents n'est pas disponible."); return; }
        window.Documents.lire(d.e.docId).then(function (x) {
          if (!x || !x.contenu) { dire("La copie n'a pas été retrouvée sur cet appareil."); return; }
          var u = URL.createObjectURL(x.contenu); window.open(u, "_blank");
        }).catch(function () { dire("La copie n'a pas pu être ouverte."); });
      };
      bouton("Télécharger en Word", false, function () { if (!CT.enWordDocConducteur(S.id, cle)) dire("Le générateur Word n'est pas disponible."); });
      if (d.etat !== "afaire") bouton("Reprendre à zéro", false, function () {
        if (!window.confirm("Remettre ce document à l'état « à faire » ? La signature enregistrée sera retirée de la fiche.")) return;
        CT.porterDocRemis(S.id, cle, { etat: "afaire", imprimeLe: "", signeLe: "", verseLe: "", mode: "", sig: "", docId: "" }); fermer(); peindre();
      });
    }
    function imprimer(cle) {
      if (!CT.enWordDocConducteur(S.id, cle)) { dire("Le générateur Word n'est pas disponible."); return; }
      CT.porterDocRemis(S.id, cle, { etat: "imprime", imprimeLe: aujourdhui() });
      peindre(); dire("Document produit : à imprimer et à faire signer");
    }
    function importerCopie(cle) {
      var d = listeDocs().filter(function (x) { return x.cle === cle; })[0];
      ouvrir("Importer la copie signée", '<p class="st-aide">Photographiez ou scannez le document signé, puis indiquez la date qui figure dessus : c\'est elle qui compte, pas celle d\'aujourd\'hui.</p>' +
        '<div class="st-champ"><label>La copie signée (photo ou PDF)</label><input type="file" id="st-f" accept="image/*,application/pdf"></div>' +
        '<div class="st-champ"><label>Date de signature, lue sur le document</label><input type="date" id="st-d" max="' + aujourdhui() + '"></div>');
      var b = bouton("Enregistrer", true, function () {
        var f = document.getElementById("st-f").files[0], dv = document.getElementById("st-d").value;
        if (!f) { dire("Choisissez la copie signée"); return; }
        if (!dv) { dire("Indiquez la date de signature"); return; }
        if (dv > aujourdhui()) { dire("La date de signature ne peut pas être dans l'avenir"); return; }
        function finir(docId) {
          CT.porterDocRemis(S.id, cle, { etat: "signe", signeLe: dv, verseLe: new Date().toISOString(), mode: "papier", sig: "", docId: docId || "", copie: f.name });
          fermer(); peindre(); dire("Signé le " + jj(dv) + ", versé au dossier aujourd'hui");
        }
        b.disabled = true;
        if (window.Documents) window.Documents.enregistrer(RUBRIQUE, { nom: d.nom + " - " + f.name, sorte: "depose", type: f.type, contenu: f })
          .then(function (l) { if (l && l.id != null) CT.noterDocEssai(l.id); finir(l && l.id); }).catch(function () { finir(""); });
        else finir("");
      });
    }
    function signerEcran(cle) {
      var d = listeDocs().filter(function (x) { return x.cle === cle; })[0];
      ouvrir("Signer à l'écran", '<p class="st-aide">Le conducteur signe dans le cadre, après avoir lu le document. La date est celle d\'aujourd\'hui.</p>' +
        '<div class="st-champ"><canvas id="st-pad"></canvas></div>');
      var cv = document.getElementById("st-pad"), ctx = cv.getContext("2d"), trace = false, vide = true;
      var r = cv.getBoundingClientRect(); cv.width = Math.round(r.width); cv.height = Math.round(r.height);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.lineWidth = 2.3; ctx.lineCap = "round"; ctx.strokeStyle = "#1c3a8a";
      function pos(e) { var b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
      cv.addEventListener("pointerdown", function (e) { e.preventDefault(); trace = true; vide = false; var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
      cv.addEventListener("pointermove", function (e) { if (!trace) return; e.preventDefault(); var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
      cv.addEventListener("pointerup", function () { trace = false; });
      cv.addEventListener("pointerleave", function () { trace = false; });
      bouton("Effacer", false, function () { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height); vide = true; });
      bouton("Valider", true, function () {
        if (vide) { dire("Faites signer dans le cadre"); return; }
        CT.porterDocRemis(S.id, cle, { etat: "signe", signeLe: aujourdhui(), verseLe: new Date().toISOString(), mode: "ecran", sig: cv.toDataURL("image/png"), docId: "" });
        fermer(); peindre(); dire(d.nom + " : signé à l'écran et versé au dossier");
      });
    }

    /* ─────────────────────── 2. contrôle et suivi ───────────────────────── */

    function ligneGroupe(g) {
      var n = g.faits.length;
      return '<div class="st-lig"><span><span class="st-lab">' + ech(g.t) + (n > 1 ? ' (' + n + ')' : '') + '</span><br><span class="st-dates">' + ech(g.src) + ' · ' +
        g.faits.map(function (f) { return jj(f.date); }).join(", ") + '</span><br><button type="button" class="st-lien" data-st="detail" data-v="' + ech(g.cle) + '">Voir le détail</button></span>' +
        (g.traite ? '<span class="st-badge vert">traitée</span>' : '<span class="st-badge gris">à traiter</span>') + '</div>';
    }
    function panControle(c) {
      var ec = etatEcheance(echeanceCarte(c));
      var h = '<h2 class="st-h2">Contrôle et suivi - lire les deux fichiers</h2>' +
        '<div class="st-carte"><div class="st-tete"><div><div class="st-nom2">Carte du conducteur</div><div class="st-sub">à télécharger tous les ' + CT.DELAI_CARTE + ' jours · ' + ech(ec.txt) + '</div></div>' + ec.badge + '</div>' +
        '<div class="st-btns"><label class="st-btn pri">Lire la carte (.ddd, .C1B)<input type="file" hidden data-st-fichier="carte" accept=".ddd,.DDD,.c1b,.C1B,.tgd,.TGD,.pdf,application/pdf,application/octet-stream"></label></div>' +
        '<div class="st-sub">Le rapport d\'analyse en PDF se lit aussi ici.</div></div>';
      var camions = camionsDuConducteur();
      h += '<div class="st-carte"><div class="st-tete"><div><div class="st-nom2">Tachygraphe du camion</div><div class="st-sub">à télécharger tous les ' + CT.DELAI_VEHICULE + ' jours</div></div></div>' +
        camions.map(function (v) { var e = etatEcheance(v); return '<div class="st-lig"><span><span class="st-lab">' + ech(v.qui) + '</span><br><span class="st-dates">' + ech(e.txt) + '</span></span>' + e.badge + '</div>'; }).join("") +
        '<div class="st-btns"><label class="st-btn pri">Lire le fichier du camion (.V1B)<input type="file" hidden data-st-fichier="camion" accept=".V1B,.v1b,.ddd,.DDD,.tgd,.TGD,application/octet-stream"></label></div>' +
        (camions.length ? '' : '<div class="st-sub">L\'immatriculation est lue dans le fichier. Les camions conduits par ce conducteur s\'afficheront ici.</div>') + '</div>';
      h += '<div class="st-carte"><h2 class="st-h2">Autres voies</h2><div class="st-btns col">' +
        '<button type="button" class="st-btn" data-st="saisir" data-v="Compte rendu reçu">Saisir depuis un compte rendu</button>' +
        '<button type="button" class="st-btn" data-st="signalement">Signalement du conducteur</button>' +
        '<button type="button" class="st-btn" data-st="saisir" data-v="Procès-verbal reçu">Autre (procès-verbal reçu, courrier de l\'administration…)</button></div></div>';
      var G = groupes(true);
      h += '<div class="st-carte"><h2 class="st-h2">Anomalies relevées</h2>' + (G.length ? G.map(ligneGroupe).join("") : '<p class="st-vide">Aucune anomalie : rien à faire.</p>') + '</div>';
      return h;
    }
    function versReaction(msg) { S.etape = 2; peindre(); prevenirPage(); window.scrollTo(0, cont.getBoundingClientRect().top + window.pageYOffset - 12); dire(msg + " : à vous de réagir"); }

    /* La date du téléchargement de la carte. Le nom du fichier la donne quand il
       suit la convention courante (il finit par AAMMJJHHMM). Sinon on prend le
       dernier jour d'activité lu sur la carte : il ne peut pas être postérieur
       au téléchargement, l'alerte ne sera donc jamais en retard. La date du
       fichier sur l'appareil n'est pas utilisée : une copie la change. */
    function dateDuFichier(f, dernierJour) {
      var m = String(f.name || "").match(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\.[A-Za-z0-9]+$/);
      if (m && +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31 && +m[4] < 24 && +m[5] < 60) {
        var s = "20" + m[1] + "-" + m[2] + "-" + m[3];
        if (s <= aujourdhui() && s >= "2006-01-01" && (!dernierJour || s >= dernierJour)) return { date: s, sure: true };
      }
      return { date: dernierJour || aujourdhui(), sure: false };
    }
    function lireFichier(f, suite) {
      var fr = new FileReader();
      fr.onload = function () { suite(fr.result); };
      fr.onerror = function () { window.alert("Le fichier n'a pas pu être ouvert."); };
      fr.readAsArrayBuffer(f);
    }

    /* LECTURE DE LA CARTE DU CONDUCTEUR */
    function lireCarte(f) {
      lireFichier(f, function (buf) {
        var tete = new Uint8Array(buf.slice(0, 5));
        var pdf = /\.pdf$/i.test(f.name) || (tete[0] === 0x25 && tete[1] === 0x50 && tete[2] === 0x44 && tete[3] === 0x46);
        if (pdf) { if (opts.lirePdf) opts.lirePdf(S.id, f); return; }
        if (window.LectureVehicule && window.LectureVehicule.estVehicule(buf)) {
          window.alert("Ce fichier est celui d'un camion (.V1B), pas une carte de conducteur. Utilisez le bouton « Lire le fichier du camion », juste en dessous."); return; }
        if (!window.LectureCarte) { window.alert("Le lecteur de carte n'est pas disponible."); return; }
        var carte, seule, an;
        try {
          carte = window.LectureCarte.lire(buf);
          if (!carte.identification) { window.alert("Ce fichier n'est pas une carte de conducteur lisible. Déposez le fichier .ddd ou .C1B de la carte."); return; }
          seule = window.LectureCarte.analyser(carte);
          an = window.LectureCarte.analyser(carte, CT.joursVehiculePourCarte(carte.identification.numero));
        } catch (err) { window.alert("Fichier illisible : " + (err && err.message || err)); return; }
        montrerCarte(f, carte, seule, an);
      });
    }
    function montrerCarte(f, carte, seule, an) {
      var c = conducteur(), id = an.identification || {};
      var autre = CT.matchConducteur(an), mauvais = autre && autre !== S.id, inconnu = !autre;
      var ret = CT.anomaliesRetenues(an.anomalies), par = {}, ordre = [];
      ret.forEach(function (a) { var t = majuscule(a.type); if (!par[t]) { par[t] = []; ordre.push(t); } par[t].push(a.date); });
      var surCarte = {}; (seule.jours || []).forEach(function (j) { surCarte[j.date] = j.minutes.conduite; });
      var indicatifs = an.anomalies.filter(function (a) { return a.source === "calcul"; }).length;
      var dlF = dateDuFichier(f, an.periode && an.periode.au), dl = dlF.date;
      var h = '<div class="st-res"><p class="t">' + ech(id.titulaire || "titulaire non lu") + '</p>' +
        '<p>Carte n° ' + ech(id.numero || "non lu") + (id.expiration ? ', valable jusqu\'au ' + jj(id.expiration) : '') + '.</p>' +
        (an.periode ? '<p>Activités du ' + jj(an.periode.du) + ' au ' + jj(an.periode.au) + ' : ' + pluriel(an.nbJours, "journée") + '.</p>' : '');
      if (mauvais) h += '<div class="st-note rouge"><b>Cette carte n\'est pas celle de ' + ech(c.nom) + '.</b> Elle est au nom de ' + ech(id.titulaire) + ' : choisissez ce conducteur en haut de l\'écran, puis relisez la carte. Rien n\'est porté à la fiche.</div>';
      else if (inconnu) h += '<div class="st-note"><b>Le nom lu sur la carte ne correspond à aucun conducteur du registre.</b> Vérifiez qu\'il s\'agit bien de la carte de ' + ech(c.nom) + ' avant de porter les faits à sa fiche.</div>';
      h += '<h4>Relevé par l\'appareil : ' + pluriel(ret.length, "fait") + '</h4>';
      h += ret.length ? '<table class="st-tb"><tbody>' + ordre.map(function (t) { return '<tr><td>' + ech(t) + (par[t].length > 1 ? ' (' + par[t].length + ')' : '') + '<div class="st-dates">' + par[t].map(jj).join(", ") + '</div></td></tr>'; }).join("") + '</tbody></table>'
        : '<p class="st-vide">Aucun fait de conduite relevé par l\'appareil sur cette carte.</p>';
      if (an.nonCloses.length) {
        var repris = an.nonCloses.filter(function (j) { return j.source === "véhicule"; }).length;
        h += '<div class="st-note"><b>Sur ' + pluriel(an.nonCloses.length, "journée") + ', la carte n\'a pas tout enregistré.</b> ' +
          (repris ? 'La conduite est reprise du fichier du camion pour ' + (repris === an.nonCloses.length ? 'toutes.' : repris + ' d\'entre elles.') : 'Elle ne donne qu\'un minimum : lisez aussi le fichier du camion, puis relisez la carte.') + '</div>' +
          '<table class="st-tb"><thead><tr><th>Journée</th><th>Sur la carte</th><th>Camion</th></tr></thead><tbody>' +
          an.nonCloses.map(function (j) { return '<tr><td class="n">' + jj(j.date) + '</td><td class="n">' + duree(surCarte[j.date] || 0) + '</td><td class="n">' + (j.source === "véhicule" ? '<b>' + duree(j.minutes.conduite) + '</b>' : 'non lu') + '</td></tr>'; }).join("") + '</tbody></table>';
      }
      if (indicatifs) h += '<p class="st-dates" style="margin-top:10px">Calcul indicatif, non porté à la fiche : ' + pluriel(indicatifs, "alerte") + ' sur la durée de conduite ou les pauses (45 minutes, ou 15 puis 30), à confirmer sur le relevé.</p>';
      h += '<div class="st-champ serre"><label>Date du téléchargement de la carte' + (dlF.sure ? '' : ' (le fichier ne la donne pas : c\'est le dernier jour d\'activité lu, corrigez-la si vous la connaissez)') + '</label><input type="date" id="st-dl" value="' + dl + '" max="' + aujourdhui() + '"></div></div>';
      ouvrir("Carte lue", h);
      if (mauvais) { bouton("Fermer", false, fermer); return; }
      bouton(ret.length ? "Porter " + (ret.length > 1 ? "les " + ret.length + " faits" : "le fait") + " à sa fiche" : "Enregistrer la lecture", true, function () {
        var date = document.getElementById("st-dl").value || dl;
        var n = CT.importerAnomalies(S.id, an.anomalies, { src: "carte du conducteur", connu: aujourdhui() });
        CT.porterTelechargementCarte(S.id, date);
        CT.porterCarte(S.id, { numero: id.numero, titulaire: id.titulaire, expiration: id.expiration });
        CT.ajouterControle(S.id, { lib: "Carte du conducteur lue",
          resume: (id.titulaire || "") + ", carte n° " + (id.numero || "") + ". " + (an.periode ? "Activités du " + jj(an.periode.du) + " au " + jj(an.periode.au) + ", " + pluriel(an.nbJours, "journée") + ". " : "") +
            pluriel(ret.length, "fait") + " relevé" + (ret.length > 1 ? "s" : "") + " par l'appareil, " + n + " porté" + (n > 1 ? "s" : "") + " à la fiche." +
            (an.nonCloses.length ? " " + pluriel(an.nonCloses.length, "journée") + " incomplète" + (an.nonCloses.length > 1 ? "s" : "") + " sur la carte." : "") + " Téléchargement du " + jj(date) + "." });
        fermer();
        if (n) versReaction("Carte lue, " + pluriel(n, "fait") + " porté" + (n > 1 ? "s" : "") + " à sa fiche");
        else { peindre(); prevenirPage(); dire(ret.length ? "Carte lue : ces faits étaient déjà à sa fiche" : "Carte lue : rien à signaler"); }
      });
    }

    /* LECTURE DU FICHIER DU CAMION */
    function lireCamion(f) {
      lireFichier(f, function (buf) {
        if (!window.LectureVehicule) { window.alert("Le lecteur de fichier véhicule n'est pas disponible."); return; }
        if (!window.LectureVehicule.estVehicule(buf)) { window.alert("Ce fichier n'est pas celui d'un camion. Déposez le fichier .V1B tiré du tachygraphe du véhicule ; la carte du conducteur se lit avec le bouton du dessus."); return; }
        var a;
        try { a = window.LectureVehicule.analyser(window.LectureVehicule.lire(buf)); }
        catch (err) { window.alert("Fichier illisible : " + (err && err.message || err)); return; }
        if (!a) { window.alert("Fichier véhicule illisible."); return; }
        montrerCamion(f, a);
      });
    }
    /* Le ou les numéros de carte de ce conducteur dans le fichier du camion : la
       carte déjà lue, sinon le nom du titulaire rapproché du registre. */
    function sesCartes(a) {
      var connue = CT.carteDe(S.id), c = conducteur(), mc2 = mots(c.nom);
      return (a.cartes || []).filter(function (x) {
        if (connue && connue.numero && x.numero === connue.numero) return true;
        var t = mots(x.titulaire);
        return t.filter(function (w) { return mc2.indexOf(w) >= 0; }).length >= 2;
      }).map(function (x) { return x.numero; });
    }
    function montrerCamion(f, a) {
      var c = conducteur(), immat = a.immatriculation || "";
      var flotte = (CT.vehicules() || []).filter(function (v) { return memeImmat(v.immat, immat); })[0];
      var miens = sesCartes(a), cartesDuJour = {};
      Object.keys(a.parCarte || {}).forEach(function (num) { Object.keys(a.parCarte[num]).forEach(function (d) { (cartesDuJour[d] = cartesDuJour[d] || []).push(num); }); });
      var siens = (a.sansCarte || []).filter(function (j) {
        var L = cartesDuJour[j.date] || [];
        return L.length > 0 && L.every(function (n) { return miens.indexOf(n) >= 0; });
      });
      var faits = siens.map(function (j) {
        var heures = j.segments.map(function (s) { return heureParis(j.date, s.de) + " à " + heureParis(j.date, s.a); }).join(", ");
        return { date: j.date, duree: j.conduiteSansCarte, heures: heures, source: "appareil", type: "conduite sans carte",
          detail: "Véhicule " + immat + " : " + duree(j.conduiteSansCarte) + ", de " + heures + " (heure de Paris)." };
      });
      var autres = (a.sansCarte || []).length - siens.length;
      var h = '<div class="st-res"><p class="t">' + ech(immat || "immatriculation non lue") + '</p>' + (a.vin ? '<p>Châssis ' + ech(a.vin) + '.</p>' : '') +
        '<p>Téléchargé le ' + jj(a.telechargement) + (a.telechargementPrecedent && a.telechargementPrecedent.date ? ' (précédent : ' + jj(a.telechargementPrecedent.date) + ')' : '') + '. ' +
        (a.activite ? pluriel(a.nbJours, "journée") + ', du ' + jj(a.activite.du) + ' au ' + jj(a.activite.au) + '.' : '') + '</p>';
      if (a.lecture && !a.lecture.complete) h += '<div class="st-note rouge"><b>Lecture incomplète.</b> ' + a.lecture.reserves.map(ech).join(" ") + ' Ce qui suit ne vaut que pour la partie lue.</div>';
      if (!flotte) h += '<div class="st-note">Ce véhicule n\'est pas dans la flotte de l\'application : la date de son téléchargement ne sera pas portée à l\'échéancier.</div>';
      h += '<h4>Conduite sans carte : ' + pluriel((a.sansCarte || []).length, "journée") + ', ' + duree(a.totalSansCarte || 0) + '</h4>';
      if (!miens.length) h += '<p>La carte de ' + ech(c.nom) + ' n\'apparaît pas dans ce fichier : aucun fait ne peut lui être rattaché.</p>';
      else if (faits.length) h += '<p>Sur ' + pluriel(faits.length, "journée") + ', seule la carte de ' + ech(c.nom) + ' a été insérée dans le camion ce jour-là :</p>' +
        '<table class="st-tb"><thead><tr><th>Date</th><th>Durée</th><th>Heures</th></tr></thead><tbody>' +
        faits.map(function (x) { return '<tr><td class="n">' + jj(x.date) + '</td><td class="n">' + duree(x.duree) + '</td><td>' + ech(x.heures) + '</td></tr>'; }).join("") + '</tbody></table>' +
        '<div class="st-note">Le camion ne dit pas qui roulait sans carte : il dit seulement quelle carte a été insérée ce jour-là. À vérifier avec le conducteur avant toute sanction.</div>';
      else h += '<p class="st-vide">Aucune journée de conduite sans carte ne se rattache à ce conducteur.</p>';
      if (autres > 0) h += '<p class="st-dates">' + pluriel(autres, "autre journée") + ' (autre conducteur ou aucune carte) ' + (flotte ? 'rest' + (autres > 1 ? 'ent' : 'e') + ' au registre du camion.' : 'ne se rattache' + (autres > 1 ? 'nt' : '') + ' pas à lui.') + '</p>';
      h += '<p class="st-dates">Heures données en heure de Paris. Seules les journées d\'au moins ' + a.seuil + ' minutes sont retenues.</p></div>';
      ouvrir("Fichier du camion lu", h);
      bouton(faits.length ? "Porter " + (faits.length > 1 ? "ces " + faits.length + " faits" : "ce fait") + " à sa fiche" : "Enregistrer la lecture", true, function () {
        var cle = flotte ? flotte.immat : immat;
        if (flotte && a.telechargement) CT.porterTelechargementVehicule(flotte.immat, a.telechargement);
        if (cle) CT.porterJoursVehicule(cle, a.parCarte);
        if (flotte) { var pris = {}; faits.forEach(function (x) { pris[x.date] = 1; });
          CT.importerAnomaliesVehicule(flotte.immat, (a.anomalies || []).filter(function (x) { return !pris[x.date]; })); }
        var n = CT.importerAnomalies(S.id, faits, { src: "camion " + immat, connu: aujourdhui() });
        CT.ajouterControle(S.id, { lib: "Fichier du camion " + immat + " lu",
          resume: "Téléchargement du " + jj(a.telechargement) + (a.activite ? ", " + pluriel(a.nbJours, "journée") + " du " + jj(a.activite.du) + " au " + jj(a.activite.au) : "") +
            ". Conduite sans carte : " + pluriel((a.sansCarte || []).length, "journée") + ", " + duree(a.totalSansCarte || 0) + ". " + n + " fait" + (n > 1 ? "s" : "") + " porté" + (n > 1 ? "s" : "") + " à la fiche de " + c.nom + "." });
        fermer();
        if (n) versReaction("Fichier lu, " + pluriel(n, "fait") + " porté" + (n > 1 ? "s" : "") + " à sa fiche");
        else { peindre(); prevenirPage(); dire(faits.length ? "Fichier lu : ces faits étaient déjà à sa fiche" : "Fichier du camion lu"); }
      });
    }

    /* LES AUTRES VOIES : un compte rendu, un procès-verbal, un signalement */
    var NATURES = ["Conduite sans carte", "Carte non insérée", "Insertion de la carte pendant la conduite", "Dépassement de la conduite journalière",
      "Conduite continue sans pause suffisante", "Repos insuffisant", "Document de bord manquant"];
    /* Le véhicule se choisit dans la flotte, en menu déroulant (demande du
       21 novembre 2026) : une immatriculation tapée à la main s'écrit de dix
       façons. Sans flotte enregistrée, le champ reste une saisie libre. */
    function champVehicule() {
      var L = (CT.vehicules() || []).map(function (v) { return (v && v.immat) || ""; }).filter(Boolean);
      if (!L.length) return '<div class="st-champ"><label>Véhicule</label><input type="text" id="st-veh" placeholder="immatriculation"></div>';
      return '<div class="st-champ"><label>Véhicule</label><select id="st-veh"><option value="">Choisir le véhicule</option>' +
        L.map(function (i) { return '<option>' + ech(i) + '</option>'; }).join("") + '</select></div>';
    }
    function saisir(source) {
      var SRC = ["Compte rendu reçu", "Procès-verbal reçu", "Courrier de l'administration", "Contrôle sur route", "Autre"];
      ouvrir("Saisir une infraction", '<p class="st-aide">Deux dates à ne pas confondre : celle des faits, et celle où l\'entreprise en a eu connaissance. C\'est la seconde qui fait courir les deux mois pour réagir.</p>' +
        '<div class="st-champ"><label>Source de l\'information</label><select id="st-src">' + SRC.map(function (s) { return '<option' + (s === source ? ' selected' : '') + '>' + s + '</option>'; }).join("") + '</select></div>' +
        '<div class="st-champ"><label>Infraction</label><select id="st-type">' + NATURES.map(function (s) { return '<option>' + s + '</option>'; }).join("") + '<option value="">Autre (à préciser ci-dessous)</option></select></div>' +
        '<div class="st-champ"><label>Date des faits</label><input type="date" id="st-date" max="' + aujourdhui() + '"></div>' +
        '<div class="st-champ"><label>Date où l\'entreprise en a eu connaissance (réception du document)</label><input type="date" id="st-connu" value="' + aujourdhui() + '" max="' + aujourdhui() + '"></div>' +
        champVehicule() +
        '<div class="st-champ"><label>Précision</label><input type="text" id="st-det" placeholder="ce qui a été constaté"></div>');
      bouton("Ajouter l'infraction", true, function () {
        var v = function (i) { return document.getElementById(i).value.trim(); };
        var type = v("st-type") || v("st-det");
        if (!type) { dire("Précisez l'infraction"); return; }
        if (!v("st-date")) { dire("Indiquez la date des faits"); return; }
        if (!v("st-connu")) { dire("Indiquez la date de connaissance"); return; }
        if (v("st-connu") < v("st-date")) { dire("La connaissance ne peut pas précéder les faits"); return; }
        var det = [v("st-veh") ? "Véhicule " + v("st-veh") : "", v("st-type") ? v("st-det") : ""].filter(Boolean).join(" : ");
        CT.ajouterAnomalie(S.id, { date: v("st-date"), type: type.toLowerCase(), detail: det, src: v("st-src").toLowerCase(), connu: v("st-connu") });
        CT.ajouterControle(S.id, { lib: v("st-src"), resume: majuscule(type) + " du " + jj(v("st-date")) + ", connu le " + jj(v("st-connu")) + (det ? ". " + det : "") + "." });
        fermer(); versReaction("Infraction ajoutée");
      });
    }
    function signalement() {
      var P = ["Oubli de la carte", "Carte défectueuse", "Carte perdue ou volée", "Panne du tachygraphe"];
      ouvrir("Signalement du conducteur", '<p class="st-aide">Ce que le conducteur vous déclare lui-même. Le signalement est gardé au dossier, avec sa date.</p>' +
        '<div class="st-champ"><label>Ce qu\'il signale</label><select id="st-pb">' + P.map(function (s) { return '<option>' + s + '</option>'; }).join("") + '</select></div>' +
        '<div class="st-champ"><label>Date des faits</label><input type="date" id="st-date" value="' + aujourdhui() + '" max="' + aujourdhui() + '"></div>' +
        champVehicule() +
        '<div class="st-champ"><label>Précision</label><input type="text" id="st-det" placeholder="ce qu\'il a fait : direction prévenue, relevé manuscrit…"></div>');
      bouton("Enregistrer le signalement", true, function () {
        var v = function (i) { return document.getElementById(i).value.trim(); };
        if (!v("st-date")) { dire("Indiquez la date des faits"); return; }
        var det = [v("st-veh") ? "Véhicule " + v("st-veh") : "", v("st-det")].filter(Boolean).join(" : ");
        CT.ajouterAnomalie(S.id, { date: v("st-date"), type: "signalement : " + v("st-pb").toLowerCase(), detail: det, src: "déclaré par le conducteur", connu: aujourdhui() });
        CT.ajouterControle(S.id, { lib: "Signalement du conducteur reçu", resume: v("st-pb") + " le " + jj(v("st-date")) + (det ? ". " + det : "") + "." });
        fermer(); versReaction("Signalement enregistré");
      });
    }
    function detail(cle) {
      var g = groupes(true).filter(function (x) { return x.cle === cle; })[0]; if (!g) return;
      ouvrir(g.t, '<div class="st-res"><p>Source : ' + ech(g.src) + '.' + (g.connu ? ' Connu de l\'employeur le ' + jj(g.connu) + '.' : '') + (g.traite ? ' Traité le ' + jj(g.traite) + '.' : '') + '</p>' +
        '<table class="st-tb"><thead><tr><th>Date</th><th>Ce qui a été relevé</th><th></th></tr></thead><tbody>' +
        g.faits.map(function (x) { return '<tr><td class="n">' + jj(x.date) + '</td><td>' + ech(x.detail || "sans précision") + '</td><td>' +
          (g.traite ? '' : '<button type="button" class="st-sup" data-rang="' + x.rang + '" title="Retirer ce fait">&times;</button>') + '</td></tr>'; }).join("") + '</tbody></table>' +
        (g.traite ? '' : '<p class="st-dates">La croix retire un fait porté par erreur.</p>') + '</div>');
      mc.onclick = function (e) {
        var b = e.target.closest("[data-rang]"); if (!b) return;
        if (!window.confirm("Retirer ce fait de la fiche ?")) return;
        CT.supprimerAnomalie(S.id, +b.getAttribute("data-rang")); mc.onclick = null; fermer(); peindre(); dire("Fait retiré de la fiche");
      };
      bouton("Fermer", false, function () { mc.onclick = null; fermer(); });
    }

    /* ─────────────────────────── 3. la réaction ─────────────────────────── */

    function proposee(p, nb) { return p.valables > 0 ? "miseapied" : nb >= 3 ? "avertissement" : "rappel"; }
    function panReaction() {
      var G = groupes(), p = passe(), nb = G.reduce(function (s, g) { return s + g.faits.length; }, 0);
      var h = '<button type="button" class="st-retour" data-st="etape" data-v="1">&larr; Revenir au contrôle et suivi</button><h2 class="st-h2">Réaction - choisir et notifier la sanction</h2>';
      h += '<div class="st-carte' + (p.valables ? ' recidive' : '') + '"><div class="st-nom2">Passé disciplinaire du salarié</div>' +
        '<p class="st-etat' + (p.valables ? ' oui' : '') + '">' + ech(phrasePasse(p)) + '</p>' +
        p.liste.map(function (x) {
          var m = x.m, badge = m.convocation ? '<span class="st-badge orange">en cours</span>' : !x.compte ? '<span class="st-badge gris">non disciplinaire</span>'
            : x.ancienne ? '<span class="st-badge gris">plus de 3 ans</span>' : !p.enCours ? '' : x.meme ? '<span class="st-badge rouge">même nature</span>' : '<span class="st-badge orange">autre nature</span>';
          return '<div class="st-lig"><span><span class="st-lab">' + ech(x.nom) + '</span><br><span class="st-dates">' + jj(m.date) + (m.pour ? ' · ' + ech(m.pour) : '') + (m.ancienne ? ' · saisie après coup' : '') + '</span>' +
            (m.convocation ? '<br><button type="button" class="st-lien" data-st="suite" data-v="' + x.rang + '">Enregistrer la suite de l\'entretien</button>' : '') + '</span>' + badge + '</div>';
        }).join("") +
        (p.ecartees ? '<p class="st-dates">' + pluriel(p.ecartees, "sanction") + ' de plus de trois ans : ' + (p.ecartees > 1 ? 'elles ne peuvent plus être invoquées' : 'elle ne peut plus être invoquée') + ' (L. 1332-5).</p>' : '') +
        '<div class="st-btns"><button type="button" class="st-btn" data-st="ancienne">Ajouter une sanction ancienne</button><button type="button" class="st-btn" data-st="compte-rendu">Compte rendu en Word</button></div></div>';
      if (G.length) {
        var cle = S.reac.cle || proposee(p, nb), s = sanctionDe(cle), R = retenus();
        h += '<div class="st-carte"><div class="st-nom2">Faits retenus</div>' +
          '<div class="st-note"><b>Depuis quand le savez-vous ?</b> Vous avez deux mois pour engager les poursuites, à compter du jour où vous avez eu connaissance des faits (L. 1332-4). Vérifiez la date de chaque ligne : c\'est celle de la lecture du fichier, de la réception du procès-verbal ou du signalement, pas celle des faits.</div>' +
          G.map(function (g) {
            var d = delai(g), k = g.faits.length;
            var etat = d.inconnu ? '<span class="st-badge orange">Date à préciser</span>' : d.prescrit ? '<span class="st-badge rouge">Prescrit</span>'
              : S.reac.penal && d.jours < 0 ? '<span class="st-badge orange">Poursuites pénales</span>' : d.jours <= 15 ? '<span class="st-badge orange">' + (d.jours === 0 ? "Dernier jour" : "Plus que " + d.jours + " j") + '</span>' : '<span class="st-badge vert">' + d.jours + ' j</span>';
            var suite = d.inconnu ? "Indiquez le jour où vous avez eu connaissance de ces faits : sans lui, le délai ne peut pas être compté."
              : d.prescrit ? "Prescrit depuis le " + jj(d.limite) + " : ce fait ne peut plus, à lui seul, fonder une sanction."
              : S.reac.penal && d.jours < 0 ? "Deux mois écoulés depuis le " + jj(d.limite) + ", mais poursuites pénales déclarées." : "À engager au plus tard le " + jj(d.limite) + ".";
            var bloque = d.prescrit || d.inconnu;
            return '<div class="st-grp"><label class="st-coche"><input type="checkbox" data-st-coche="' + ech(g.cle) + '"' + (!S.decoches[g.cle] && !bloque ? ' checked' : '') + (bloque ? ' disabled' : '') + '><span><span class="st-lab">' + ech(g.t) + (k > 1 ? ' (' + k + ')' : '') + '</span>' +
              '<div class="st-dates">' + ech(g.src) + ' · ' + g.faits.map(function (f) { return jj(f.date); }).join(", ") + '</div></span></label>' +
              '<div class="st-connu"><label>Connu de l\'employeur le <input type="date" data-st-connu="' + ech(g.cle) + '" value="' + g.connu + '" max="' + aujourdhui() + '"></label>' + etat + '</div>' +
              '<div class="st-dates suite">' + ech(suite) + '</div><button type="button" class="st-lien decale" data-st="detail" data-v="' + ech(g.cle) + '">Voir le détail des faits</button></div>';
          }).join("") +
          '<label class="st-coche petit"><input type="checkbox" data-st-penal="1"' + (S.reac.penal ? ' checked' : '') + '><span>Ces faits ont donné lieu à des poursuites pénales dans ce délai : le délai de deux mois ne joue alors pas.</span></label>' +
          '<div class="st-sub" style="margin-top:10px">Sanction à notifier' + (S.reac.cle ? '' : p.valables ? ' (récidive : mesure plus ferme proposée)' : nb >= 3 ? ' (faits répétés : avertissement proposé)' : '') + '</div>' +
          '<select id="st-sanction">' + CT.SANCTIONS.map(function (x) { return '<option value="' + x.cle + '"' + (x.cle === cle ? ' selected' : '') + '>' + ech(x.nom) + '</option>'; }).join("") + '</select>' +
          '<div class="st-dates" style="margin-top:6px">' + ech(s.note) + '</div>';
        if (R.length) {
          var premier = R.slice().sort(function (x, y) { return delai(x).limite < delai(y).limite ? -1 : 1; })[0], dp = delai(premier);
          h += '<div class="st-ech">' + (S.reac.penal && dp.jours < 0 ? 'Poursuites pénales déclarées : le délai de deux mois ne bloque pas.'
            : 'Poursuites à engager au plus tard le <b>' + enLettres(dp.limite) + '</b> (' + (dp.jours === 0 ? "aujourd'hui" : "dans " + pluriel(dp.jours, "jour")) + ').') + '</div>';
        } else h += '<div class="st-alerte">Aucun fait retenu : tout est décoché, prescrit, ou sans date de connaissance.</div>';
        if (s.entretien) {
          var tot = premierEntretien(aujourdhui());
          if (S.reac.entretien && S.reac.entretien < tot) S.reac.entretien = "";
          h += '<div class="st-connu bloc"><label>Jour fixé pour l\'entretien préalable <input type="date" data-st-entretien="1" value="' + S.reac.entretien + '" min="' + tot + '"></label></div>';
          h += '<div class="st-ech">Convocation remise aujourd\'hui : entretien <b>au plus tôt le ' + enLettres(tot) + '</b>. ' + REGLE_ENTRETIEN + '</div>';
          h += S.reac.entretien ? '<div class="st-ech">La sanction se notifie <b>au plus tôt le ' + jj(apresOuvrables(S.reac.entretien, 2)) + '</b> et <b>au plus tard le ' + jj(plusMois(S.reac.entretien, 1)) + '</b> : ni moins de deux jours ouvrables, ni plus d\'un mois après le jour de l\'entretien (L. 1332-2). Les jours fériés ne sont pas comptés ici.</div>'
            : '<div class="st-ech">Après l\'entretien, la sanction ne peut intervenir ni moins de deux jours ouvrables, ni plus d\'un mois après (L. 1332-2). Indiquez le jour de l\'entretien pour avoir les deux dates.</div>';
        }
        h += '<button type="button" class="st-btn pri large" data-st="courrier"' + (R.length ? '' : ' disabled') + '>' + (s.entretien ? "Préparer la convocation" : "Préparer le courrier") + '</button></div>';
      } else h += '<div class="st-carte"><p class="st-vide">Aucun fait à traiter.</p></div>';
      /* les autres mesures, qui ne sont pas des sanctions : inchangées, repliées */
      var mes = CT.suiviConducteur(S.id).mesures;
      h += '<details class="st-repli"><summary>Autres mesures : correction, ajustement</summary>' +
        mes.map(function (m, i) { return m.cle || (m.categorie || "").toLowerCase() === "sanction" ? '' :
          '<div class="st-lig"><span><span class="st-lab">' + ech(m.objet) + '</span><br><span class="st-dates">' + jj(m.date) + ' · ' + ech(m.categorie) + (m.pour ? ' · pour ' + ech(m.pour) : '') + '</span></span><button type="button" class="st-sup" data-st="sup-mesure" data-v="' + i + '" title="Supprimer">&times;</button></div>'; }).join("") +
        '<div class="st-champ serre"><label>Mesure prise</label><input type="text" id="st-mobjet" placeholder="formation, changement de planning, consigne resignée…"></div>' +
        '<div class="st-champ serre"><label>Catégorie</label><select id="st-mcat"><option value="correction">Correction</option><option value="ajustement">Ajustement</option></select></div>' +
        '<div class="st-champ serre"><label>Pour quel manquement</label><input type="text" id="st-mpour" placeholder="le type de manquement visé"></div>' +
        '<div class="st-btns"><button type="button" class="st-btn" data-st="mesure">Ajouter la mesure</button></div></details>';
      return h;
    }
    function lignesRetenues(R) {
      var L = [];
      R.forEach(function (g) { g.faits.forEach(function (f) { L.push([jj(f.date), g.t, f.detail || ""]); }); });
      return L.sort(function (x, y) { return x[0].split("/").reverse().join("") < y[0].split("/").reverse().join("") ? -1 : 1; });
    }
    function courrier() {
      var R = retenus(); if (!R.length) { dire("Aucun fait retenu"); return; }
      var p = passe(), nb = R.reduce(function (s, g) { return s + g.faits.length; }, 0);
      var cle = S.reac.cle || proposee(p, groupes().reduce(function (s, g) { return s + g.faits.length; }, 0)), s = sanctionDe(cle);
      if (s.entretien && !S.reac.entretien) { dire("Indiquez d'abord le jour de l'entretien"); return; }
      if (s.entretien && S.reac.entretien < premierEntretien(aujourdhui())) { dire("Entretien au plus tôt le " + jj(premierEntretien(aujourdhui())) + " : il faut un délai après la convocation"); return; }
      var lignes = lignesRetenues(R), entretien = s.entretien ? S.reac.entretien : "";
      ouvrir(s.entretien ? "Convocation à entretien préalable" : s.nom, rendre(CT.sanctionItems(S.id, cle, lignes, entretien)));
      bouton("Télécharger en Word", false, function () { if (!CT.enWordSanction(S.id, cle, lignes, entretien)) dire("Le générateur Word n'est pas disponible."); });
      bouton("Enregistrer et archiver", true, function () {
        var natures = R.map(function (g) { return g.t.toLowerCase(); }), rangs = [];
        R.forEach(function (g) { rangs = rangs.concat(g.rangs); });
        CT.ajouterMesure(S.id, { date: aujourdhui(), categorie: s.disciplinaire ? "sanction" : "correction",
          objet: s.entretien ? "Convocation à entretien préalable (" + s.nom.toLowerCase() + " envisagé" + (cle === "miseapied" ? "e" : "") + ")" : s.nom,
          pour: pluriel(nb, "fait") + " : " + natures.join(", "), cle: cle, natures: natures, nb: nb, lignes: lignes, convocation: s.entretien, entretien: entretien });
        CT.majAnomalies(S.id, rangs, { traite: aujourdhui() });
        S.reac = { cle: null, penal: false, entretien: "" }; S.decoches = {};
        fermer(); peindre(); prevenirPage(); dire(s.entretien ? "Convocation archivée : pensez à enregistrer la suite de l'entretien" : "Courrier archivé au dossier");
      });
    }
    /* Après l'entretien : la sanction réellement notifiée, ou l'absence de suite. */
    function suiteEntretien(rang) {
      var m = CT.suiviConducteur(S.id).mesures[rang]; if (!m) return;
      var tot = m.entretien ? apresOuvrables(m.entretien, 2) : "", tard = m.entretien ? plusMois(m.entretien, 1) : "";
      ouvrir("Suite de l'entretien", (m.entretien ? '<p class="st-aide">Entretien fixé au ' + jj(m.entretien) + '. La sanction se notifie au plus tôt le ' + jj(tot) + ' et au plus tard le ' + jj(tard) + ' (L. 1332-2 ; jours fériés non comptés).</p>' : '') +
        '<div class="st-champ"><label>Ce qui a été décidé</label><select id="st-issue">' + CT.SANCTIONS.map(function (x) { return '<option value="' + x.cle + '"' + (x.cle === m.cle ? ' selected' : '') + '>' + ech(x.nom) + '</option>'; }).join("") + '<option value="">Aucune sanction</option></select></div>' +
        '<div class="st-champ"><label>Date de la notification</label><input type="date" id="st-notif" value="' + aujourdhui() + '" max="' + aujourdhui() + '"></div>');
      bouton("Enregistrer", true, function () {
        var issue = document.getElementById("st-issue").value, dn = document.getElementById("st-notif").value;
        if (!dn) { dire("Indiquez la date"); return; }
        if (issue && tard && dn > tard && !window.confirm("Cette date dépasse le mois qui suit l'entretien (limite : " + jj(tard) + "). Enregistrer quand même ?")) return;
        if (issue && tot && dn < tot && !window.confirm("Cette date tombe moins de deux jours ouvrables après l'entretien (au plus tôt : " + jj(tot) + "). Enregistrer quand même ?")) return;
        var s = issue ? sanctionDe(issue) : null;
        CT.majMesure(S.id, rang, issue ? { date: dn, cle: issue, objet: s.nom, categorie: s.disciplinaire ? "sanction" : "correction", convocation: null }
          : { date: dn, cle: "rappel", objet: "Entretien du " + jj(m.entretien || dn) + " : aucune sanction", categorie: "correction", convocation: null });
        fermer(); peindre(); dire("Suite de l'entretien enregistrée");
      });
    }
    function sanctionAncienne() {
      ouvrir("Sanction ancienne", '<p class="st-aide">Une sanction notifiée avant la mise en place du suivi : elle compte pour la récidive si elle a moins de trois ans.</p>' +
        '<div class="st-champ"><label>Sanction notifiée</label><select id="st-atype">' + CT.SANCTIONS.filter(function (x) { return x.disciplinaire; }).map(function (x) { return '<option value="' + x.cle + '">' + ech(x.nom) + '</option>'; }).join("") + '</select></div>' +
        '<div class="st-champ"><label>Date de notification</label><input type="date" id="st-adate" max="' + aujourdhui() + '"></div>' +
        '<div class="st-champ"><label>Nature des faits sanctionnés</label><select id="st-anat">' + NATURES.map(function (x) { return '<option>' + x + '</option>'; }).join("") + '<option>Autre</option></select></div>' +
        '<div class="st-champ"><label>Précision</label><input type="text" id="st-adet" placeholder="ce qui avait été reproché"></div>');
      bouton("Ajouter au dossier", true, function () {
        var v = function (i) { return document.getElementById(i).value.trim(); };
        if (!v("st-adate")) { dire("Indiquez la date de notification"); return; }
        var s = sanctionDe(v("st-atype")), nat = v("st-anat").toLowerCase();
        CT.ajouterMesure(S.id, { date: v("st-adate"), categorie: "sanction", objet: s.nom, pour: nat + (v("st-adet") ? " : " + v("st-adet") : ""), cle: s.cle, natures: [nat], ancienne: true });
        fermer(); peindre(); dire("Sanction ancienne ajoutée au dossier");
      });
    }
    function compteRendu() {
      var c = conducteur(), p = passe(), G = groupes();
      var items = [{ k: "h1", t: "PASSÉ DISCIPLINAIRE - COMPTE RENDU" }, { k: "p", t: c.nom + (c.poste ? ", " + c.poste : "") }, { k: "p", t: "Établi le " + enLettres(aujourdhui()) + "." }, { k: "p", t: phrasePasse(p) }];
      if (p.liste.length) items.push({ k: "table", head: ["Date", "Mesure", "Faits", "Observation"], rows: p.liste.map(function (x) {
        return [jj(x.m.date), x.nom, x.m.pour || "", x.m.convocation ? "procédure en cours" : !x.compte ? "non disciplinaire" : x.ancienne ? "plus de trois ans, non invocable" : x.meme ? "faits de même nature" : ""]; }) });
      else items.push({ k: "p", t: "Aucune sanction au dossier." });
      if (G.length) {
        items.push({ k: "h2", t: "Faits en cours d'examen" });
        items.push({ k: "table", head: ["Faits", "Dates", "Connus le", "Poursuites à engager"], rows: G.map(function (g) { var d = delai(g);
          return [g.t + " (" + g.faits.length + ")", g.faits.map(function (f) { return jj(f.date); }).join(", "), g.connu ? jj(g.connu) : "à préciser",
            d.inconnu ? "date de connaissance à préciser" : d.prescrit ? "prescrits depuis le " + jj(d.limite) : "au plus tard le " + jj(d.limite)]; }) });
      }
      items.push({ k: "note", t: "Article L. 1332-4 du code du travail : aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales." });
      items.push({ k: "note", t: "Article L. 1332-5 du code du travail : aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction." });
      if (!CT.telechargerWord(items, "Passé disciplinaire - " + c.nom, "passe-disciplinaire-" + S.id + "-" + aujourdhui() + ".docx")) dire("Le générateur Word n'est pas disponible.");
    }

    /* ─────────────────────────── 4. le coffre-fort ──────────────────────── */

    function panCoffre() {
      function liste(L) { return L.length ? '<ul class="st-cf">' + L.join("") + '</ul>' : '<p class="st-vide">Rien pour l\'instant.</p>'; }
      var docs = listeDocs().filter(function (d) { return d.etat === "signe"; }).sort(function (x, y) { return (x.e.verseLe || "") < (y.e.verseLe || "") ? 1 : -1; })
        .map(function (d) { return '<li><button type="button" data-st="voir-doc" data-v="' + d.cle + '"><span class="l">' + ech(d.nom) + '</span><span class="d">signé le ' + jj(d.e.signeLe) + (d.e.mode === "ecran" ? " à l'écran" : " sur papier") + ' · versé le ' + horodatage(d.e.verseLe) + '</span></button></li>'; });
      var ctrl = CT.journalControles(S.id).map(function (x, i) { return { x: x, i: i }; }).reverse()
        .sort(function (x, y) { return (x.x.quand || "") < (y.x.quand || "") ? 1 : (x.x.quand || "") > (y.x.quand || "") ? -1 : 0; })
        .map(function (o) { return '<li><button type="button" data-st="voir-controle" data-v="' + o.i + '"><span class="l">' + ech(o.x.lib) + '</span><span class="d">' + horodatage(o.x.quand) + '</span></button></li>'; });
      var sanc = CT.suiviConducteur(S.id).mesures.map(function (m, i) { return { m: m, i: i }; }).filter(function (o) { return o.m.cle || (o.m.categorie || "").toLowerCase() === "sanction"; })
        .sort(function (x, y) { return (x.m.date || "") < (y.m.date || "") ? 1 : -1; })
        .map(function (o) { return '<li><button type="button" data-st="voir-sanction" data-v="' + o.i + '"><span class="l">' + ech(o.m.objet) + '</span><span class="d">' + jj(o.m.date) + (o.m.pour ? ' · ' + ech(o.m.pour) : '') + '</span></button></li>'; });
      return '<h2 class="st-h2">Coffre-fort - documents signés</h2><div class="st-carte">' + liste(docs) + '</div>' +
        '<h2 class="st-h2">Coffre-fort - contrôles effectués</h2><div class="st-carte">' + liste(ctrl) + '</div>' +
        '<h2 class="st-h2">Coffre-fort - sanctions</h2><div class="st-carte">' + liste(sanc) + '</div>';
    }
    function voirControle(i) {
      var x = CT.journalControles(S.id)[i]; if (!x) return;
      ouvrir(x.lib, '<div class="st-res"><p class="t">' + ech(x.lib) + '</p><p>' + ech(x.resume) + '</p><p class="st-dates">Contrôle fait le ' + horodatage(x.quand) + '.</p></div>');
      bouton("Fermer", false, fermer);
    }
    function voirSanction(i) {
      var m = CT.suiviConducteur(S.id).mesures[i]; if (!m) return;
      var h = (m.lignes && m.cle) ? rendre(CT.sanctionItems(S.id, m.cle, m.lignes, m.entretien)) : '';
      h += '<div class="st-res"><p class="t">' + ech(m.objet) + '</p><p>' + (m.ancienne ? 'Notifiée le ' : 'Enregistrée le ') + jj(m.date) + (m.pour ? ' pour ' + ech(m.pour) : '') + '.</p>' +
        (m.ancienne ? '<p class="st-dates">Sanction saisie après coup : l\'original est à joindre au dossier.</p>' : '') + '</div>';
      ouvrir(m.objet, h);
      if (m.lignes && m.cle) bouton("Télécharger en Word", false, function () { if (!CT.enWordSanction(S.id, m.cle, m.lignes, m.entretien)) dire("Le générateur Word n'est pas disponible."); });
      bouton("Retirer du dossier", false, function () {
        if (!window.confirm("Retirer cette ligne du dossier disciplinaire ? À ne faire que pour une saisie erronée.")) return;
        CT.supprimerMesure(S.id, i); fermer(); peindre();
      });
    }

    /* ───────────────────────────── le mode essai ────────────────────────── */

    function proposerEssai() {
      ouvrir("Faire un essai", '<div class="st-res"><p>Un essai ne laisse aucune trace. Au départ, l\'état des fiches, de l\'échéancier et des registres des véhicules est mis de côté ; « Annuler l\'essai » le remet exactement comme il était.</p>' +
        '<p><b>Sur mes conducteurs</b> : vous lisez de vrais fichiers, vous préparez un courrier, puis vous annulez.</p>' +
        '<p><b>Une démonstration</b> : un conducteur et un camion fictifs, avec un parcours déjà fait de la première à la dernière étape, pour voir chaque écran rempli.</p></div>');
      bouton("Sur mes conducteurs", false, function () {
        if (!CT.commencerEssai({})) { dire("L'essai n'a pas pu démarrer : la copie de l'état n'a pas pu être faite."); return; }
        fermer(); peindre(); dire("Essai commencé : rien n'est définitif");
      });
      bouton("Voir une démonstration", true, function () { fermer(); demonstration(); });
    }
    function finEssai(garder) {
      if (garder) { CT.garderEssai(); peindre(); prevenirPage(); dire("Essai terminé : ce qui a été fait est gardé"); return; }
      if (!window.confirm("Annuler l'essai ? Tout ce qui a été fait depuis son début sera effacé, et l'état d'avant sera remis.")) return;
      var r = CT.annulerEssai();
      if (!r) { window.alert("L'état d'avant l'essai n'a pas été retrouvé sur cet appareil : rien n'a été effacé."); return; }
      if (window.Documents) (r.docIds || []).forEach(function (id) { try { window.Documents.supprimer(id); } catch (e) {} });
      S.id = null; S.etape = 0; S.decoches = {}; S.reac = { cle: null, penal: false, entretien: "" };
      peindre(); prevenirPage(); dire("Essai annulé : tout est comme avant");
    }
    /* LA DÉMONSTRATION : un parcours complet, joué sur un conducteur et un camion
       qui n'existent pas. Un premier cycle est allé jusqu'au bout (documents
       signés, lecture, avertissement, coffre-fort) ; un second est en cours,
       avec des faits de même nature et un délai qui approche. */
    function signatureFictive() {
      var cv = document.createElement("canvas"); cv.width = 300; cv.height = 110;
      var x = cv.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, 300, 110);
      x.strokeStyle = "#1c3a8a"; x.lineWidth = 2.4; x.lineCap = "round"; x.beginPath();
      x.moveTo(18, 74); x.bezierCurveTo(48, 12, 66, 96, 96, 56); x.bezierCurveTo(118, 26, 132, 92, 160, 62);
      x.bezierCurveTo(182, 40, 204, 84, 232, 44); x.bezierCurveTo(246, 30, 262, 60, 284, 50); x.stroke();
      return cv.toDataURL("image/png");
    }
    function demonstration() {
      var ID = "conducteur-d-essai", NOM = "MARTIN Paul (fictif)", IMMAT = "ES-000-AI", CARTE = "ESSAI00000000001";
      if (!CT.commencerEssai({ demonstration: true, conducteur: { id: ID, nom: NOM, poste: "Conducteur poids lourd" }, vehicule: { immat: IMMAT } })) {
        dire("La démonstration n'a pas pu démarrer : la copie de l'état n'a pas pu être faite."); return; }
      var J = function (n) { return plusJours(aujourdhui(), -n); };
      var H = function (n, h) { return new Date(versDate(J(n)).getTime() + (h - 12) * 3600000).toISOString(); };
      /* 1. les instructions */
      CT.porterDocRemis(ID, "consigne", { etat: "signe", imprimeLe: J(41), signeLe: J(40), verseLe: H(40, 9), mode: "ecran", sig: signatureFictive(), docId: "" });
      CT.porterDocRemis(ID, "formation", { etat: "signe", imprimeLe: J(40), signeLe: J(38), verseLe: H(36, 15), mode: "papier", sig: "", docId: "" });
      CT.porterDocRemis(ID, "note", { etat: "imprime", imprimeLe: J(3) });
      /* 2. le contrôle : premier cycle, il y a un mois */
      CT.porterCarte(ID, { numero: CARTE, titulaire: "MARTIN PAUL", expiration: plusJours(aujourdhui(), 520) });
      CT.ajouterControle(ID, { quand: H(30, 10), lib: "Fichier du camion " + IMMAT + " lu", resume: "Téléchargement du " + jj(J(30)) + ". Conduite sans carte : 2 journées, 0 h 41. 2 faits portés à la fiche de " + NOM + "." });
      CT.importerAnomalies(ID, [
        { date: J(44), source: "appareil", type: "conduite sans carte", detail: "Véhicule " + IMMAT + " : 0 h 23, de 13:36 à 13:59 (heure de Paris)." },
        { date: J(37), source: "appareil", type: "conduite sans carte", detail: "Véhicule " + IMMAT + " : 0 h 18, de 14:02 à 14:20 (heure de Paris)." }], { src: "camion " + IMMAT, connu: J(30) });
      /* 3. la réaction du premier cycle : un avertissement, deux jours plus tard */
      var lignes1 = [[jj(J(44)), "Conduite sans carte", "Véhicule " + IMMAT + " : 0 h 23, de 13:36 à 13:59 (heure de Paris)."], [jj(J(37)), "Conduite sans carte", "Véhicule " + IMMAT + " : 0 h 18, de 14:02 à 14:20 (heure de Paris)."]];
      CT.ajouterMesure(ID, { date: J(28), categorie: "sanction", objet: "Avertissement", pour: "2 faits : conduite sans carte", cle: "avertissement", natures: ["conduite sans carte"], nb: 2, lignes: lignes1 });
      CT.majAnomalies(ID, [0, 1], { traite: J(28) });
      /* le second cycle : lecture de la carte et du camion il y a neuf jours */
      CT.porterTelechargementCarte(ID, J(25));
      CT.porterTelechargementVehicule(IMMAT, J(9));
      var jours = {}; [44, 37, 20, 18, 12].forEach(function (n) { jours[J(n)] = { conduite: 380, continueMax: 250 }; });
      var parCarte = {}; parCarte[CARTE] = jours; CT.porterJoursVehicule(IMMAT, parCarte);
      CT.ajouterControle(ID, { quand: H(9, 11), lib: "Carte du conducteur lue", resume: "MARTIN PAUL, carte n° " + CARTE + ". Activités sur 96 journées. 1 fait relevé par l'appareil, 1 porté à la fiche. Téléchargement du " + jj(J(25)) + "." });
      CT.ajouterControle(ID, { quand: H(9, 11.2), lib: "Fichier du camion " + IMMAT + " lu", resume: "Téléchargement du " + jj(J(9)) + ". Conduite sans carte : 3 journées, 1 h 02. 3 faits portés à la fiche de " + NOM + "." });
      CT.importerAnomalies(ID, [{ date: J(15), source: "appareil", type: "insertion de la carte pendant la conduite", detail: "Événement enregistré par l'appareil, véhicule " + IMMAT + "." }], { src: "carte du conducteur", connu: J(9) });
      CT.importerAnomalies(ID, [
        { date: J(20), source: "appareil", type: "conduite sans carte", detail: "Véhicule " + IMMAT + " : 0 h 27, de 13:51 à 14:18 (heure de Paris)." },
        { date: J(18), source: "appareil", type: "conduite sans carte", detail: "Véhicule " + IMMAT + " : 0 h 21, de 13:46 à 14:07 (heure de Paris)." },
        { date: J(12), source: "appareil", type: "conduite sans carte", detail: "Véhicule " + IMMAT + " : 0 h 14, de 14:13 à 14:27 (heure de Paris)." }], { src: "camion " + IMMAT, connu: J(9) });
      /* un procès-verbal reçu il y a cinquante jours : le délai approche */
      CT.ajouterAnomalie(ID, { date: J(70), type: "dépassement de la conduite journalière", detail: "Véhicule " + IMMAT + " : 10 h 40 de conduite relevées au contrôle.", src: "procès-verbal reçu", connu: J(50) });
      CT.ajouterControle(ID, { quand: H(50, 16), lib: "Procès-verbal reçu", resume: "Dépassement de la conduite journalière du " + jj(J(70)) + ", connu le " + jj(J(50)) + "." });
      S.id = ID; S.etape = 0; S.decoches = {}; S.reac = { cle: null, penal: false, entretien: "" };
      peindre(); prevenirPage(); window.scrollTo(0, cont.getBoundingClientRect().top + window.pageYOffset - 12);
      dire("Démonstration chargée : parcourez les quatre étapes");
    }

    /* ───────────────────────────── les gestes ───────────────────────────── */

    cont.addEventListener("click", function (e) {
      var b = e.target.closest("[data-st]"); if (!b || !cont.contains(b)) return;
      var a = b.getAttribute("data-st"), v = b.getAttribute("data-v");
      if (a === "etape" || a === "aller") { S.etape = +v; peindre(); if (a === "aller") window.scrollTo(0, cont.getBoundingClientRect().top + window.pageYOffset - 12); return; }
      if (a === "fiche") { if (!CT.enWordSuivi(S.id)) dire("Le générateur Word n'est pas disponible."); return; }
      if (a === "essai") return proposerEssai();
      if (a === "essai-annuler") return finEssai(false);
      if (a === "essai-garder") return finEssai(true);
      if (a === "voir-doc") return voirDoc(v);
      if (a === "imprimer") return imprimer(v);
      if (a === "importer") return importerCopie(v);
      if (a === "signer") return signerEcran(v);
      if (a === "profil") { CT.setProfilConducteur(S.id, v, b.getAttribute("data-val") === "1"); peindre(); var r = cont.querySelector(".st-repli"); if (r) r.open = true; return; }
      if (a === "saisir") return saisir(v);
      if (a === "signalement") return signalement();
      if (a === "detail") return detail(v);
      if (a === "ancienne") return sanctionAncienne();
      if (a === "compte-rendu") return compteRendu();
      if (a === "suite") return suiteEntretien(+v);
      if (a === "courrier") return courrier();
      if (a === "voir-controle") return voirControle(+v);
      if (a === "voir-sanction") return voirSanction(+v);
      if (a === "sup-mesure") { if (window.confirm("Supprimer cette mesure ?")) { CT.supprimerMesure(S.id, +v); peindre(); } return; }
      if (a === "mesure") {
        var objet = document.getElementById("st-mobjet").value.trim();
        if (!objet) { dire("Indiquez la mesure prise"); return; }
        CT.ajouterMesure(S.id, { date: aujourdhui(), categorie: document.getElementById("st-mcat").value, objet: objet, pour: document.getElementById("st-mpour").value.trim() });
        peindre(); dire("Mesure ajoutée"); return;
      }
    });
    cont.addEventListener("change", function (e) {
      var x = e.target, g;
      if (x.id === "sel-cond") { S.id = x.value; S.etape = 0; S.decoches = {}; S.reac = { cle: null, penal: false, entretien: "" }; peindre(); return; }
      if (x.hasAttribute("data-st-fichier")) { var f = x.files && x.files[0], quoi = x.getAttribute("data-st-fichier"); x.value = ""; if (f) { if (quoi === "carte") lireCarte(f); else lireCamion(f); } return; }
      if (x.hasAttribute("data-st-ech")) { CT.porterEcheanceDoc(S.id, x.getAttribute("data-st-ech"), x.value); peindre(); var r = cont.querySelector(".st-repli"); if (r) r.open = true; return; }
      if (x.hasAttribute("data-st-connu")) {
        g = groupes().filter(function (y) { return y.cle === x.getAttribute("data-st-connu"); })[0];
        if (g) {
          if (x.value && x.value > aujourdhui()) { dire("La date de connaissance ne peut pas être dans l'avenir"); peindre(); return; }
          var etait = !!S.decoches[g.cle]; delete S.decoches[g.cle];
          CT.majAnomalies(S.id, g.rangs, { connu: x.value });
          if (etait) { var neuf = groupes().filter(function (y) { return y.rangs.join() === g.rangs.join(); })[0]; if (neuf) S.decoches[neuf.cle] = true; }
          peindre();
        }
        return;
      }
      if (x.hasAttribute("data-st-coche")) { if (x.checked) delete S.decoches[x.getAttribute("data-st-coche")]; else S.decoches[x.getAttribute("data-st-coche")] = true; peindre(); return; }
      if (x.hasAttribute("data-st-penal")) { S.reac.penal = x.checked; peindre(); return; }
      if (x.hasAttribute("data-st-entretien")) {
        var tot = premierEntretien(aujourdhui());
        if (x.value && x.value < tot) { S.reac.entretien = ""; peindre(); dire("Entretien au plus tôt le " + jj(tot) + " : il faut un délai après la convocation"); return; }
        S.reac.entretien = x.value; peindre(); return;
      }
      if (x.id === "st-sanction") { S.reac.cle = x.value; peindre(); return; }
    });

    return {
      peindre: peindre,
      choisir: function (id) { if (id && id !== S.id) { S.id = id; S.decoches = {}; S.reac = { cle: null, penal: false, entretien: "" }; } },
      versReaction: function (id, msg) { if (id) S.id = id; versReaction(msg); },
      etat: function () { return { id: S.id, etape: S.etape }; },
    };
  }

  window.SuiviTachygraphe = { monter: monter };
})(window);
