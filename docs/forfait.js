/* LE FORFAIT EN JOURS : CONSTRUIRE, CONTRÔLER, SUIVRE.

   Le détail de ce que l'écran fait et des textes qui le commandent est en tête
   de forfait.html. Ici, la mécanique.

   Ce qui est gardé sur le poste, sous deux clés :

     registre-personnel   les salariés, écrits ailleurs, seulement lus ici
     forfait-jours        { accord, gens : { id : { rep, elig, conv, ctrl,
                            suivi, entretiens, renonces } } }

   Deux règles tiennent le reste. Un mois ne se clôt pas tant qu'un jour
   n'est pas qualifié : le document de contrôle veut le nombre ET la date des
   journées travaillées, pas un total. Et rien ne s'efface après clôture : on
   rouvre, daté et motivé, parce qu'un mois rouvert sans raison doit se voir. */

"use strict";
(function (window, document) {

  var CLE_REG = "registre-personnel";
  var CLE = "forfait-jours";

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];
  var COURT = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

  /* Les états d'une journée. « travaillé » et « demi-journée » sont les seuls
     que le document de contrôle compte ; les autres disent pourquoi le jour
     n'a pas été travaillé, ce que l'article L. 3121-65, I, 1° demande de
     pouvoir lire. */
  var ETATS = [
    ["", "- à qualifier -"],
    ["t", "Travaillé"],
    ["d", "Demi-journée travaillée"],
    ["h", "Repos hebdomadaire"],
    ["r", "Repos du forfait"],
    ["c", "Congé payé"],
    ["f", "Férié chômé"],
    ["m", "Maladie"],
    ["a", "Absence"],
  ];
  var LIB = {};
  ETATS.forEach(function (e) { LIB[e[0]] = e[1]; });

  var $ = function (id) { return document.getElementById(id); };
  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;")
      .replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function lireCle(c, defaut) {
    try { return JSON.parse(window.localStorage.getItem(c) || "null") || defaut; }
    catch (e) { return defaut; }
  }
  function garderCle(c, v) {
    try { window.localStorage.setItem(c, JSON.stringify(v)); } catch (e) {}
  }
  function net(v) { return String(v == null ? "" : v).trim(); }
  function nb(v, defaut) {
    var n = parseInt(String(v == null ? "" : v).replace(/[^0-9-]/g, ""), 10);
    return isNaN(n) ? (defaut == null ? 0 : defaut) : n;
  }
  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" + ("0" + d.getDate()).slice(-2);
  }
  function enFrancais(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ""));
    if (!m) return "";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function plus(isoDate, jours) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(isoDate || ""));
    if (!m) return "";
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    d.setDate(d.getDate() + jours);
    return iso(d);
  }
  function euros(v) {
    var n = parseFloat(String(v == null ? "" : v).replace(/\s/g, "").replace(",", "."));
    if (isNaN(n)) return "";
    return n.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  }

  /* LES JOURS FÉRIÉS DE L'ANNÉE. Pâques par le calcul de Meeus, les trois
     fêtes mobiles qui en dépendent, et les huit dates fixes. Les fériés ne se
     retirent du calcul que s'ils tombent un jour ouvré : un 14 juillet un
     dimanche ne rend aucune journée. */
  function paques(an) {
    var a = an % 19, b = Math.floor(an / 100), c = an % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mois = Math.floor((h + l - 7 * m + 114) / 31);
    var jour = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(an, mois - 1, jour);
  }
  function feries(an) {
    var p = paques(an), L = [];
    function pose(d, nom) { L.push({ d: iso(d), nom: nom }); }
    pose(new Date(an, 0, 1), "1er janvier");
    pose(new Date(p.getFullYear(), p.getMonth(), p.getDate() + 1), "lundi de Pâques");
    pose(new Date(an, 4, 1), "1er mai");
    pose(new Date(an, 4, 8), "8 mai");
    pose(new Date(p.getFullYear(), p.getMonth(), p.getDate() + 39), "Ascension");
    pose(new Date(p.getFullYear(), p.getMonth(), p.getDate() + 50), "lundi de Pentecôte");
    pose(new Date(an, 6, 14), "14 juillet");
    pose(new Date(an, 7, 15), "15 août");
    pose(new Date(an, 10, 1), "1er novembre");
    pose(new Date(an, 10, 11), "11 novembre");
    pose(new Date(an, 11, 25), "25 décembre");
    return L;
  }
  function estFerie(an, isoJour) {
    var L = feries(an);
    for (var i = 0; i < L.length; i++) if (L[i].d === isoJour) return L[i].nom;
    return "";
  }

  /* ───────────────────────── les salariés du registre ───────────────────── */

  function sansAccent(s) {
    try {
      return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    } catch (e) { return String(s == null ? "" : s).toLowerCase(); }
  }
  function salaries() {
    var r = lireCle(CLE_REG, {});
    var L = (r && r.salaries) || [];
    return L.filter(function (s) {
      return net(s.nom) || net(s.pre);
    }).map(function (s) {
      var nom = (net(s.nom) + " " + net(s.pre)).trim();
      return {
        id: sansAccent(nom) || "salarie",
        nom: nom,
        emp: net(s.emp),
        qua: net(s.qua),
        ent: net(s.ent),
        sor: net(s.sor),
      };
    });
  }
  function entreprise() {
    var p = null;
    try {
      p = (window.Profil && window.Profil.lire) ? window.Profil.lire()
        : JSON.parse(window.localStorage.getItem("profil-entreprise") || "null");
    } catch (e) { p = null; }
    return p || {};
  }
  function effectif() {
    var p = entreprise();
    var n = parseInt(String(p.effectif == null ? "" : p.effectif).replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }

  /* ─────────────────────────── ce qui est gardé ─────────────────────────── */

  function base() {
    var t = lireCle(CLE, {});
    t.accord = t.accord || {};
    t.gens = t.gens || {};
    return t;
  }
  function garder(t) { garderCle(CLE, t); }
  function fiche() {
    var t = base();
    var f = t.gens[qui.id] || {};
    f.elig = f.elig || {};
    f.conv = f.conv || {};
    f.ctrl = f.ctrl || {};
    f.suivi = f.suivi || {};
    f.entretiens = f.entretiens || [];
    f.renonces = f.renonces || [];
    return f;
  }
  function garderFiche(f) {
    var t = base();
    t.gens[qui.id] = f;
    garder(t);
  }
  function accord() { return base().accord; }
  function garderAccord(a) {
    var t = base();
    t.accord = a;
    garder(t);
  }

  /* ─────────────────────────── l'état de l'écran ────────────────────────── */

  var GENS = [], qui = null, an, mo;

  /* ═══════════════════ 1. l'éligibilité au forfait en jours ═══════════════ */

  function rendreEligibilite() {
    var f = fiche();
    $("el-cat").value = f.elig.cat || "";
    $("el-auto").value = f.elig.auto || "";
    majEligibilite();
  }
  function majEligibilite() {
    var f = fiche();
    var cat = $("el-cat").value, auto = $("el-auto").value;
    f.elig = { cat: cat, auto: auto };
    garderFiche(f);
    var mauvais = [];
    if (cat === "non") {
      mauvais.push("Il suit un horaire, donc il n'entre dans aucune des deux catégories de " +
        "l'article L. 3121-58.");
    }
    if (auto === "non") {
      mauvais.push("Ses horaires lui sont donnés : l'autonomie réelle dans l'organisation de " +
        "l'emploi du temps, qu'exige l'article L. 3121-58, manque.");
    }
    $("el-stop").hidden = !mauvais.length;
    $("el-stop-d").innerHTML = mauvais.map(ech).join("<br>") +
      (mauvais.length ? "<br><br>Une convention signée quand même serait nulle, et le salarié " +
        "pourrait réclamer ses heures supplémentaires sur trois ans. Le décompte des heures, " +
        "lui, existe : <a href=\"heures.html\">ouvrir le décompte des heures</a>." : "");
    majBlocs();
  }

  /* Ce qui reste ouvert dépend de deux choses seulement : le salarié est-il
     éligible, et l'accord collectif existe-t-il déjà. Le rétroplanning ne
     concerne que la conclusion d'un accord : il ne s'affiche pas quand il y
     en a un. */
  function majBlocs() {
    var f = fiche(), a = accord();
    var bloque = f.elig.cat === "non" || f.elig.auto === "non";
    ["b-accord", "b-jours", "b-conv", "b-pack"].forEach(function (i) {
      if ($(i)) $(i).hidden = bloque;
    });
    if ($("b-plan")) $("b-plan").hidden = bloque || a.source !== "aucun";
  }

  /* ═════════════════════ 2. l'accord collectif qui fonde ═════════════════ */

  /* Les huit clauses que l'accord doit porter : les cinq du I de L. 3121-64,
     puis les trois du II. Les deux premières du II sont celles qui décident
     de la nullité quand le suivi manque (Soc. 10 janvier 2024, n° 22-15.782). */
  var CLAUSES = [
    { c: "i1", t: "Les catégories de salariés qui peuvent conclure un forfait",
      d: "L. 3121-64, I, 1°. Sans elle, on ne sait pas si ce salarié est couvert." },
    { c: "i2", t: "La période de référence de douze mois",
      d: "L. 3121-64, I, 2°. Année civile ou toute autre période de douze mois consécutifs." },
    { c: "i3", t: "Le nombre de jours du forfait, 218 au plus",
      d: "L. 3121-64, I, 3°. Au-delà de 218 sans renonciation écrite, la convention ne tient pas." },
    { c: "i4", t: "Le traitement des absences, des arrivées et des départs en cours de période",
      d: "L. 3121-64, I, 4°. C'est ce qui permet de proratiser sans se tromper." },
    { c: "i5", t: "Les caractéristiques des conventions individuelles",
      d: "L. 3121-64, I, 5°, qui doivent au moins fixer le nombre de jours." },
    { c: "ii1", t: "Comment l'employeur évalue et suit la charge de travail",
      d: "L. 3121-64, II, 1°. Absente, le régime supplétif de L. 3121-65 peut prendre le relais, " +
         "mais à la condition stricte de le respecter en entier.", cle: true },
    { c: "ii2", t: "Comment employeur et salarié communiquent sur la charge, la vie personnelle, " +
         "la rémunération et l'organisation",
      d: "L. 3121-64, II, 2°. Même remarque : le supplétif ne se rattrape pas à moitié.", cle: true },
    { c: "ii3", t: "Les modalités du droit à la déconnexion",
      d: "L. 3121-64, II, 3°. À défaut, l'employeur les définit et les communique (L. 3121-65, II)." },
  ];

  function rendreAccord() {
    var a = accord();
    $("ac-source").value = a.source || "";
    $("ac-ds").value = a.ds || "";
    $("ac-cse").value = a.cse || "";
    $("p-depart").value = a.depart || "";
    $("p-depot").value = a.depot || "";
    $("p-recepisse").value = a.recepisse || "non";

    var aucun = a.source === "aucun";
    $("ac-clauses").hidden = !a.source || aucun;
    $("ac-voie").hidden = !aucun;
    $("ac-boutons").hidden = !aucun;
    majBlocs();

    if (!aucun && a.source) {
      $("ac-liste").innerHTML = CLAUSES.map(function (c) {
        var coche = !!(a.clauses && a.clauses[c.c]);
        return '<div class="cas' + (coche ? "" : " ko") + '" data-c="' + c.c + '">' +
          '<div class="tete"><input type="checkbox" id="cl-' + c.c + '"' + (coche ? " checked" : "") +
          ' aria-label="' + ech(c.t) + '"><label class="lib" for="cl-' + c.c + '">' + ech(c.t) + "</label></div>" +
          (coche ? "" : '<div class="suite">' + ech(c.d) + "</div>") + "</div>";
      }).join("");
      Array.prototype.forEach.call($("ac-liste").querySelectorAll("input"), function (i) {
        i.addEventListener("change", function () {
          var aa = accord();
          aa.clauses = aa.clauses || {};
          aa.clauses[i.id.slice(3)] = i.checked;
          garderAccord(aa);
          rendreAccord();
          rendreControle();
        });
      });
      majVerdictAccord();
    }
    if (aucun) majVoie();
    rendrePlan();
  }

  function clausesManquantes() {
    var a = accord();
    return CLAUSES.filter(function (c) { return !(a.clauses && a.clauses[c.c]); });
  }

  function majVerdictAccord() {
    var manque = clausesManquantes();
    var v = $("ac-verdict");
    v.hidden = false;
    v.className = "verdict " + (!manque.length ? "ok" : (manque.every(function (c) { return c.cle || c.c === "ii3"; }) ? "tiede" : "ko"));
    if (!manque.length) {
      v.querySelector(".t").textContent = "L'accord porte les huit clauses.";
      v.querySelector(".d").textContent = "Il peut fonder des conventions individuelles. " +
        "Reste à les écrire, puis à les suivre.";
      return;
    }
    var dur = manque.filter(function (c) { return !c.cle && c.c !== "ii3"; });
    if (dur.length) {
      v.querySelector(".t").textContent = manque.length + " clause" + (manque.length > 1 ? "s" : "") + " manque" +
        (manque.length > 1 ? "nt" : "") + " : cet accord ne peut pas fonder le forfait.";
      v.querySelector(".d").textContent = "Il faut un accord d'entreprise qui les porte. Choisissez " +
        "« Aucun des deux » au-dessus : l'écran ouvre le projet d'accord et la voie de conclusion " +
        "qui correspond à votre effectif.";
      return;
    }
    v.querySelector(".t").textContent = "Le suivi de la charge n'est pas écrit dans l'accord.";
    v.querySelector(".d").textContent = "Les conventions restent possibles par le régime supplétif de " +
      "l'article L. 3121-65 : document de contrôle daté, charge compatible avec les repos, entretien " +
      "une fois par an. Mais ce régime ne se prend pas à moitié : un seul de ces trois manquements et " +
      "la convention est nulle (Soc. 10 janvier 2024, n° 22-15.782). Le suivi, plus bas, est alors la " +
      "seule chose qui tient le forfait debout.";
  }

  /* LA VOIE DE CONCLUSION. Elle ne se choisit pas : l'effectif, la présence
     d'un délégué syndical et celle d'élus au comité la déterminent. */
  function voie() {
    var a = accord(), eff = effectif();
    if (a.ds === "oui") return "D";
    if (!a.ds) return "";
    if (eff < 11 || (eff <= 20 && a.cse !== "oui")) return "A";
    if (eff < 50) return "B";
    return "C";
  }
  function majVoie() {
    var a = accord(), v = voie(), z = $("ac-quelle");
    if (!v || (!a.cse && a.ds === "non")) { z.hidden = true; return; }
    z.hidden = false;
    var eff = effectif();
    var T = {
      A: ["Ratification par les deux tiers du personnel",
        "Vous écrivez le projet, vous le remettez à chaque salarié contre décharge, et le vote a " +
        "lieu quinze jours au moins après (L. 2232-21 et R. 2232-12). Le seuil est de deux tiers " +
        "du personnel, pas des votants : sur " + (eff || 0) + " salarié" + (eff > 1 ? "s" : "") +
        ", il faut " + Math.ceil((eff || 0) * 2 / 3) + " oui. Un absent compte comme un refus. Le " +
        "dépouillement se fait hors votre présence (R. 2232-10, 3°) et le procès-verbal est annexé " +
        "à l'accord au dépôt."],
      B: ["Signature par les élus du CSE, ou par un salarié mandaté",
        "Entre onze et moins de cinquante salariés sans délégué syndical, l'accord se négocie avec " +
        "des élus titulaires, mandatés ou non, ou avec un salarié mandaté (L. 2232-23-1, I). Signé " +
        "par des élus, il vaut s'ils représentent la majorité des suffrages exprimés aux dernières " +
        "élections ; signé par un mandaté non élu, il doit être approuvé par les salariés à la " +
        "majorité des suffrages exprimés."],
      C: ["Les élus d'abord, le mandatement ensuite, et dans cet ordre",
        "À cinquante salariés et plus sans délégué syndical, vous annoncez votre intention de " +
        "négocier aux élus titulaires par un moyen donnant date certaine, ils ont un mois pour se " +
        "manifester (L. 2232-25-1). Élus mandatés : approbation des salariés. Élus non mandatés : " +
        "signature d'élus représentant la majorité des suffrages, et le forfait en jours entre bien " +
        "dans leur champ puisque L. 3121-63 en fait une mesure subordonnée à un accord collectif. " +
        "Personne ne se manifeste : salarié mandaté et vote (L. 2232-26)."],
      D: ["Négociation avec le délégué syndical",
        "L'accord vaut s'il est signé par des syndicats ayant recueilli plus de 50 % des suffrages " +
        "exprimés en faveur des organisations représentatives au premier tour des dernières " +
        "élections des titulaires au CSE. Entre 30 et 50 %, un signataire peut demander la " +
        "consultation des salariés dans le mois (L. 2232-12)."],
    };
    z.querySelector(".t").textContent = T[v][0];
    z.querySelector(".d").textContent = T[v][1];
  }

  /* ════════════════════ 3. les jours de repos de l'année ═════════════════ */

  function calculJours() {
    var f = fiche();
    var a = nb($("j-an").value, new Date().getFullYear());
    var forfait = nb($("j-nb").value, 218);
    var cp = nb($("j-cp").value, 25);
    var prorata = $("j-prorata").value === "oui";
    $("j-dates").hidden = !prorata;

    /* La période n'est pas toujours l'année civile : quand elle court du
       1er juin au 31 mai, les fériés à retirer ne sont pas les mêmes, et le
       décompte doit suivre la vraie période. */
    var pleineDeb = $("c-periode").value === "juin" ? new Date(a, 5, 1) : new Date(a, 0, 1);
    var pleineFin = $("c-periode").value === "juin" ? new Date(a + 1, 4, 31) : new Date(a, 11, 31);
    var debut = new Date(pleineDeb.getTime()), fin = new Date(pleineFin.getTime());
    if (prorata) {
      if (net($("j-du").value)) {
        var m1 = $("j-du").value.split("-");
        debut = new Date(+m1[0], +m1[1] - 1, +m1[2]);
      }
      if (net($("j-au").value)) {
        var m2 = $("j-au").value.split("-");
        fin = new Date(+m2[0], +m2[1] - 1, +m2[2]);
      }
    }

    var cal = 0, we = 0, fer = 0, d = new Date(debut.getTime());
    var nomsFeries = [];
    while (d <= fin) {
      cal++;
      var js = d.getDay();
      if (js === 0 || js === 6) we++;
      else {
        var n = estFerie(d.getFullYear(), iso(d));
        if (n) { fer++; nomsFeries.push(n); }
      }
      d.setDate(d.getDate() + 1);
    }

    /* La proratisation : le forfait et les congés se réduisent à la part de
       l'année réellement couverte. Le résultat est arrondi à l'entier le plus
       proche, et l'écran le dit au lieu de le cacher. */
    var part = 1;
    if (prorata) {
      var total = (pleineFin - pleineDeb) / 86400000 + 1;
      part = cal / total;
    }
    var forfaitP = Math.round(forfait * part);
    var cpP = Math.round(cp * part);
    var repos = cal - we - fer - cpP - forfaitP;

    var L = [
      ["Jours calendaires de la période", cal],
      ["Samedis et dimanches", -we],
      ["Jours fériés tombant un jour ouvré", -fer],
      ["Congés payés", -cpP],
      ["Jours du forfait", -forfaitP],
      ["Jours de repos du forfait", repos],
    ];
    $("j-compte").innerHTML = L.map(function (x) {
      return '<div class="l"><span>' + ech(x[0]) + '</span><span class="n">' +
        ech(String(x[1])) + "</span></div>";
    }).join("");

    var note = "";
    if (fer) note += "Les " + fer + " fériés retenus : " + nomsFeries.join(", ") + ". ";
    if ($("c-periode").value === "juin")
      note += "Période retenue : du 1er juin " + a + " au 31 mai " + (a + 1) + ". ";
    if (prorata) note += "Période réduite : " + Math.round(part * 100) + " % de la période, " +
      "le forfait est ramené à " + forfaitP + " jours et les congés à " + cpP + ". " +
      "L'accord doit dire comment il proratise (L. 3121-64, I, 4°) : si sa règle diffère, c'est la sienne qui vaut. ";
    if (repos < 0) note += "Le compte est négatif : le nombre de jours du forfait ne tient pas dans " +
      "l'année une fois les congés et les fériés retirés. Reprenez le nombre de jours.";
    $("j-note").textContent = note;

    f.conv = f.conv || {};
    f.conv.an = a; f.conv.jours = forfait; f.conv.cp = cp;
    f.conv.repos = repos; f.conv.prorata = prorata;
    f.conv.du = $("j-du").value; f.conv.au = $("j-au").value;
    garderFiche(f);
    return { an: a, forfait: forfait, forfaitP: forfaitP, cp: cpP, repos: repos, feries: fer };
  }

  function rendreJours() {
    var f = fiche();
    $("j-an").value = f.conv.an || new Date().getFullYear();
    $("j-nb").value = f.conv.jours || 218;
    $("j-cp").value = f.conv.cp == null ? 25 : f.conv.cp;
    $("j-prorata").value = f.conv.prorata ? "oui" : "non";
    $("j-du").value = f.conv.du || "";
    $("j-au").value = f.conv.au || "";
    $("c-periode").value = f.conv.periode || "civile";
    $("c-remun").value = f.conv.remun || "";
    calculJours();
  }

  /* La période de référence et la rémunération sont des chiffres de la
     convention, pas de sa rédaction : ils comptent aussi quand on se contente
     de contrôler une convention déjà signée. */
  function lireParam() {
    var f = fiche();
    f.conv.periode = $("c-periode").value;
    f.conv.remun = $("c-remun").value;
    garderFiche(f);
    calculJours();
    if (!$("br-suivi").hidden) { dessinerJours(); majCompteurs(); }
  }

  /* ═════════════════════════ 4. la convention ════════════════════════════ */

  function rendreConvention() {
    var f = fiche();
    $("c-forme").value = f.conv.forme || "avenant";
    $("c-effet").value = f.conv.effet || "";
    $("c-fonctions").value = f.conv.fonctions || "";
  }
  function lireConvention() {
    var f = fiche();
    f.conv.forme = $("c-forme").value;
    f.conv.effet = $("c-effet").value;
    f.conv.fonctions = $("c-fonctions").value;
    garderFiche(f);
  }

  /* ═════════════════════════ 5. le rétroplanning ═════════════════════════ */

  function rendrePlan() {
    var a = accord(), v = voie(), depart = a.depart;
    if (!depart) { $("p-liste").innerHTML = ""; return; }
    var E = [];
    if (v === "A") {
      E.push(["Remise du projet et des modalités à chaque salarié, contre décharge", depart,
        "Le délai de quinze jours court de cette remise (R. 2232-12). Les modalités doivent dire " +
        "comment le texte est transmis, le lieu, la date, l'heure, le déroulement et la question " +
        "posée (R. 2232-11)."]);
      E.push(["Vote, au plus tôt", plus(depart, 15),
        "Pendant le temps de travail, personnel et secret, dépouillement hors la présence de " +
        "l'employeur (R. 2232-10)."]);
      E.push(["Procès-verbal affiché et annexé à l'accord", plus(depart, 15),
        "Sans lui, le dépôt est incomplet (R. 2232-10, 4°)."]);
      E.push(["Fin du délai de contestation", plus(depart, 30),
        "Quinze jours après la proclamation des résultats, devant le tribunal judiciaire qui " +
        "statue en dernier ressort (R. 2232-13 ; Soc. 5 janvier 2022, n° 20-60.270)."]);
    } else if (v === "C") {
      E.push(["Annonce de l'intention de négocier aux élus titulaires, date certaine", depart,
        "L. 2232-25-1."]);
      E.push(["Fin du délai laissé aux élus pour se manifester", plus(depart, 30),
        "Un mois. Passé ce délai seulement, on sait avec qui on négocie."]);
      E.push(["Ouverture de la négociation", plus(depart, 31), ""]);
    } else if (v === "B") {
      E.push(["Ouverture de la négociation avec les élus ou le mandaté", depart, "L. 2232-23-1, I."]);
      E.push(["Consultation des salariés, si l'accord est signé par un mandaté non élu",
        plus(depart, 60),
        "Dans les deux mois de la conclusion, modalités communiquées quinze jours avant (D. 2232-8)."]);
    } else if (v === "D") {
      E.push(["Ouverture de la négociation avec le délégué syndical", depart, "L. 2232-12."]);
      E.push(["Signature", plus(depart, 30), ""]);
    } else {
      E.push(["Ouverture de la négociation", depart, "Renseignez la présence d'un délégué syndical " +
        "et d'élus au CSE pour que les étapes suivantes se calculent."]);
    }
    var fin = E.length ? E[E.length - 1][1] : depart;
    E.push(["Notification du texte signé aux organisations représentatives", fin,
      "L. 2231-5. Gardez le récépissé : il est exigé au dépôt (D. 2231-7, 1°, b)."]);
    E.push(["Dépôt sur TéléAccords, avec la version publiable anonymisée", plus(fin, 1),
      "D. 2231-4 et L. 2231-5-1."]);
    E.push(["Exemplaire au greffe du conseil de prud'hommes du lieu de conclusion", plus(fin, 1),
      "D. 2231-2, III. C'est la formalité la plus souvent oubliée."]);
    E.push(["Entrée en vigueur", plus(fin, 2),
      "Le lendemain du dépôt, sauf stipulation contraire de l'accord (L. 2261-1)."]);
    E.push(["Signature des conventions individuelles", plus(fin, 2),
      "Pas avant : une convention signée sous un accord qui n'existe pas encore est nulle."]);
    E.push(["Premier document de contrôle mensuel", plus(fin, 32), "L. 3121-65, I, 1°."]);
    E.push(["Entretien annuel", plus(fin, 367), "L. 3121-65, I, 3°."]);

    $("p-liste").innerHTML = E.map(function (e) {
      return '<div class="e"><span class="q">' + ech(e[0]) + '</span><span class="d">' +
        ech(enFrancais(e[1])) + "</span>" +
        (e[2] ? '<span class="p">' + ech(e[2]) + "</span>" : "") + "</div>";
    }).join("");
  }

  /* ══════════════════ la branche « oui » : les huit cases ════════════════ */

  var CONTROLES = [
    { c: "accord", t: "Un accord collectif applicable existe",
      ko: "La convention est nulle. Sans accord d'entreprise ou de branche, le forfait n'a pas de " +
          "fondement (L. 3121-63). Le salarié peut réclamer ses heures supplémentaires sur trois ans.",
      grave: true, faire: "non" },
    { c: "clauses", t: "Cet accord porte les clauses de l'article L. 3121-64",
      ko: "Si les clauses du II, 1° et 2° manquent, la convention ne tient que par le régime " +
          "supplétif de L. 3121-65, et seulement s'il est respecté en entier.", faire: "non" },
    { c: "ecrit", t: "Une convention individuelle écrite est signée par le salarié",
      ko: "La convention est nulle : la forfaitisation exige l'accord du salarié et un écrit " +
          "(L. 3121-55). Une mention au bulletin de paie ne suffit pas.",
      grave: true, faire: "conv" },
    { c: "nombre", t: "Le nombre de jours est conforme, 218 au plus",
      ko: "Au-delà, il faut une renonciation écrite avec majoration d'au moins 10 %, et le plafond " +
          "de l'accord ou, à défaut, 235 jours (L. 3121-59 et L. 3121-66).",
      grave: true, faire: "renonce" },
    { c: "elig", t: "Le salarié est réellement autonome dans l'organisation de ses journées",
      ko: "La convention est nulle : il n'entre dans aucune des deux catégories de L. 3121-58. " +
          "Le forfait ne se rattrape pas par son montant.",
      grave: true, faire: "heures" },
    { c: "entretien", t: "L'entretien annuel a été tenu, et ce qu'il a dit est écrit",
      ko: "La convention est privée d'effet : les heures redeviennent dues. Un entretien tardif ne " +
          "vaut pas mieux qu'aucun (Soc. 10 janvier 2024, n° 22-13.200).", faire: "entretien" },
    { c: "doc", t: "Le document de contrôle est tenu, jour par jour",
      ko: "La convention est privée d'effet. Le document doit faire apparaître le nombre et la date " +
          "des journées ou demi-journées travaillées (L. 3121-65, I, 1°), et c'est à l'employeur " +
          "d'en rapporter la preuve (Soc. 19 décembre 2018, n° 17-18.725).", faire: "suivi" },
    { c: "charge", t: "La charge a été suivie, et ce que le salarié a signalé a été traité",
      ko: "La convention est privée d'effet. L'article L. 3121-60 est d'ordre public : informé " +
          "d'une charge excessive, l'employeur doit y remédier en temps utile.", faire: "suivi" },
  ];

  function rendreControle() {
    var f = fiche();
    $("ct-liste").innerHTML = CONTROLES.map(function (c) {
      var coche = !!f.ctrl[c.c];
      var bouton = "";
      if (!coche) {
        var lib = { non: "Construire l'accord", conv: "Écrire la convention",
          renonce: "Faire l'avenant de renonciation", heures: "Ouvrir le décompte des heures",
          entretien: "Tenir l'entretien", suivi: "Ouvrir le document de contrôle" }[c.faire];
        if (lib) bouton = '<button type="button" class="second" data-faire="' + c.faire + '">' +
          ech(lib) + "</button>";
      }
      return '<div class="cas' + (coche ? "" : " ko") + '">' +
        '<div class="tete"><input type="checkbox" id="ct-' + c.c + '"' + (coche ? " checked" : "") +
        ' aria-label="' + ech(c.t) + '"><label class="lib" for="ct-' + c.c + '">' + ech(c.t) + "</label></div>" +
        (coche ? "" : '<div class="suite"><b>' + ech(c.ko) + "</b>" + bouton + "</div>") + "</div>";
    }).join("");

    Array.prototype.forEach.call($("ct-liste").querySelectorAll("input"), function (i) {
      i.addEventListener("change", function () {
        var ff = fiche();
        ff.ctrl[i.id.slice(3)] = i.checked;
        garderFiche(ff);
        rendreControle();
        majSuiviVisible();
      });
    });
    Array.prototype.forEach.call($("ct-liste").querySelectorAll("[data-faire]"), function (b) {
      b.addEventListener("click", function () {
        var ou = b.getAttribute("data-faire");
        if (ou === "heures") { window.location.href = "heures.html"; return; }
        if (ou === "non") { poserReponse("non"); return; }
        if (ou === "conv") { poserReponse("non"); setTimeout(function () {
          $("b-conv").scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); return; }
        var cible = { renonce: "br-suivi", entretien: "br-suivi", suivi: "br-suivi" }[ou];
        if (cible && $(cible)) {
          $(cible).hidden = false;
          $(cible).scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
    majVerdictControle();
  }

  /* LE VERDICT. Il ne pondère rien : chaque manquement a sa conséquence, et
     elles ne se compensent pas. Nulle d'un côté, privée d'effet de l'autre. */
  function majVerdictControle() {
    var f = fiche(), c = f.ctrl;
    var v = $("ct-verdict");
    var nulle = [];
    if (!c.accord) nulle.push("aucun accord collectif ne la fonde (L. 3121-63)");
    if (!c.ecrit) nulle.push("il n'y a pas d'écrit signé (L. 3121-55)");
    if (!c.elig) nulle.push("le salarié n'est pas autonome au sens de L. 3121-58");
    if (!c.nombre) nulle.push("le nombre de jours dépasse ce qui est permis");
    var suivi = [];
    if (!c.entretien) suivi.push("l'entretien annuel");
    if (!c.doc) suivi.push("le document de contrôle");
    if (!c.charge) suivi.push("le suivi de la charge");

    if (nulle.length) {
      v.className = "verdict ko";
      v.querySelector(".t").textContent = "Convention nulle.";
      v.querySelector(".d").textContent = "Motif" + (nulle.length > 1 ? "s" : "") + " : " +
        nulle.join(" ; ") + ". Le salarié relève alors de la durée légale, et peut réclamer ses " +
        "heures supplémentaires sur trois ans. Reprenez ce qui manque case par case, ci-dessus.";
      return;
    }
    if (!c.clauses && suivi.length) {
      v.className = "verdict ko";
      v.querySelector(".t").textContent = "Convention nulle.";
      v.querySelector(".d").textContent = "L'accord ne porte pas le suivi de la charge, et le régime " +
        "supplétif de L. 3121-65 n'est pas respecté non plus : il manque " + suivi.join(", ") + ". " +
        "L'employeur ne peut alors pas s'en prévaloir, et la convention est nulle " +
        "(Soc. 10 janvier 2024, n° 22-15.782).";
      return;
    }
    if (suivi.length) {
      v.className = "verdict tiede";
      v.querySelector(".t").textContent = "Convention valable, mais privée d'effet.";
      v.querySelector(".d").textContent = "Il manque " + suivi.join(", ") + ". Le forfait ne " +
        "produit plus ses effets tant que c'est le cas : les heures redeviennent dues, et il " +
        "appartient à l'employeur de prouver qu'il a respecté ce que l'accord promet " +
        "(Soc. 19 décembre 2018, n° 17-18.725). Cela se répare, et cela se répare maintenant : " +
        "le suivi est ouvert plus bas.";
      return;
    }
    v.className = "verdict ok";
    v.querySelector(".t").textContent = "Convention valable et suivie.";
    v.querySelector(".d").textContent = "Rien ne manque à ce jour. Ce qui la tient debout, c'est le " +
      "suivi du mois en cours et l'entretien de l'année : les deux sont plus bas.";
  }

  /* ══════════════════════════ le suivi mensuel ═══════════════════════════ */

  function clePeriode(annee) { return String(annee); }
  function cleMois(a, m) { return a + "-" + ("0" + (m + 1)).slice(-2); }

  function moisDe(a, m) {
    var f = fiche();
    var x = f.suivi[cleMois(a, m)] || {};
    x.j = x.j || {};
    x.ouvertures = x.ouvertures || [];
    return x;
  }
  function garderMois(a, m, x) {
    var f = fiche();
    f.suivi[cleMois(a, m)] = x;
    garderFiche(f);
  }

  function dessinerJours() {
    var x = moisDe(an, mo), verrou = !!(x.clos && x.clos.le);
    var dernier = new Date(an, mo + 1, 0).getDate();
    var hote = $("jours");
    hote.textContent = "";
    var sem = { du: 1, travail: 0 };

    for (var j = 1; j <= dernier; j++) {
      (function (j) {
        var d = new Date(an, mo, j), js = d.getDay();
        var val = x.j[String(j)] == null ? "" : x.j[String(j)];
        var ferie = estFerie(an, iso(d));

        var ligne = document.createElement("div");
        ligne.className = "jour" + (val === "" ? " vide" : "") +
          (val && val !== "t" && val !== "d" ? " fin" : "") + (verrou ? " verrou" : "");

        var q = document.createElement("div");
        q.className = "quand";
        q.textContent = j + " " + COURT[js];
        if (ferie) q.textContent += " *";
        ligne.appendChild(q);

        var s = document.createElement("select");
        s.setAttribute("aria-label", "Qualification du " + j + " " + MOIS[mo]);
        ETATS.forEach(function (e) {
          var o = document.createElement("option");
          o.value = e[0]; o.textContent = e[1];
          if (e[0] === val) o.selected = true;
          s.appendChild(o);
        });
        s.disabled = verrou;
        s.addEventListener("change", function () {
          var xx = moisDe(an, mo);
          if (s.value === "") delete xx.j[String(j)];
          else xx.j[String(j)] = s.value;
          garderMois(an, mo, xx);
          dessinerJours();
          majCompteurs();
        });
        ligne.appendChild(s);
        hote.appendChild(ligne);

        if (val === "t") sem.travail += 1;
        if (val === "d") sem.travail += 0.5;

        if (js === 0 || j === dernier) {
          var b = document.createElement("div");
          b.className = "sem-bar" + (sem.travail > 6 ? " trop" : "");
          b.innerHTML = "<span>Semaine du " + sem.du + " au " + j + " " + MOIS[mo] +
            "</span><b>" + String(sem.travail).replace(".", ",") + " j</b>";
          hote.appendChild(b);
          sem = { du: j + 1, travail: 0 };
        }
      })(j);
    }
    $("s-clore").disabled = verrou || !!premierNonQualifie();
    $("s-clore").textContent = verrou ? "Mois clos" : "Clore le mois de " + MOIS[mo];
    $("s-rouvrir").hidden = !verrou;
    $("mois-nom").textContent = MOIS[mo] + " " + an;
    var nq = premierNonQualifie();
    $("mois-sous").textContent = verrou ? "clos le " + enFrancais(x.clos.le)
      : (nq ? "le " + nq + " " + MOIS[mo] + " n'est pas qualifié" : "prêt à clore");
  }

  function premierNonQualifie() {
    var x = moisDe(an, mo), dernier = new Date(an, mo + 1, 0).getDate();
    var aujourdhui = new Date();
    for (var j = 1; j <= dernier; j++) {
      var d = new Date(an, mo, j);
      if (d > aujourdhui) return 0;
      if (x.j[String(j)] == null) return j;
    }
    return 0;
  }

  /* Remplir le mois d'un geste : travaillé du lundi au vendredi, repos
     hebdomadaire le samedi et le dimanche, férié chômé quand la date en est
     un. Les jours déjà qualifiés à la main ne bougent pas. */
  function remplirMois() {
    var x = moisDe(an, mo);
    if (x.clos && x.clos.le) return;
    var dernier = new Date(an, mo + 1, 0).getDate();
    for (var j = 1; j <= dernier; j++) {
      if (x.j[String(j)] != null) continue;
      var d = new Date(an, mo, j), js = d.getDay();
      if (estFerie(an, iso(d))) x.j[String(j)] = "f";
      else if (js === 0 || js === 6) x.j[String(j)] = "h";
      else x.j[String(j)] = "t";
    }
    garderMois(an, mo, x);
    dessinerJours();
    majCompteurs();
  }

  /* LE COMPTE DE L'ANNÉE. La période de référence est celle de la convention :
     année civile, ou du 1er juin au 31 mai. Tout se compte sur elle, pas sur
     le mois affiché. */
  function bornesPeriode() {
    var f = fiche();
    if (f.conv.periode === "juin") {
      var a = mo >= 5 ? an : an - 1;
      return { a: a, deb: { an: a, mo: 5 }, fin: { an: a + 1, mo: 4 },
        dit: "du 1er juin " + a + " au 31 mai " + (a + 1) };
    }
    return { a: an, deb: { an: an, mo: 0 }, fin: { an: an, mo: 11 },
      dit: "année " + an };
  }

  function compterPeriode() {
    var f = fiche(), b = bornesPeriode();
    var t = { travail: 0, repos: 0, conge: 0, maladie: 0, absence: 0, vides: 0, suite: 0, pire: 0 };
    var a = b.deb.an, m = b.deb.mo, courante = 0;
    var aujourdhui = new Date();
    while (a < b.fin.an || (a === b.fin.an && m <= b.fin.mo)) {
      var x = f.suivi[cleMois(a, m)] || { j: {} };
      var dernier = new Date(a, m + 1, 0).getDate();
      for (var j = 1; j <= dernier; j++) {
        var d = new Date(a, m, j);
        var v = x.j[String(j)];
        if (v === "t") { t.travail += 1; courante++; }
        else if (v === "d") { t.travail += 0.5; courante++; }
        else {
          if (courante > t.pire) t.pire = courante;
          courante = 0;
          if (v === "r") t.repos++;
          else if (v === "c") t.conge++;
          else if (v === "m") t.maladie++;
          else if (v === "a") t.absence++;
          else if (v == null && d <= aujourdhui) t.vides++;
        }
      }
      m++; if (m > 11) { m = 0; a++; }
    }
    if (courante > t.pire) t.pire = courante;
    t.suite = courante;
    return t;
  }

  function majCompteurs() {
    var f = fiche(), b = bornesPeriode(), t = compterPeriode();
    var forfait = nb(f.conv.jours, 218);
    var reposDus = nb(f.conv.repos, 0);
    var renonce = (f.renonces || []).reduce(function (s, r) {
      return s + (String(r.an) === String(b.a) ? nb(r.nb, 0) : 0); }, 0);
    var plafond = forfait + renonce;
    var restant = plafond - t.travail;
    var reposRestants = reposDus - t.repos;

    var tuiles = [
      { et: "Jours travaillés, " + b.dit, n: String(t.travail).replace(".", ","),
        etat: t.travail > plafond ? "froid" : (restant <= 5 ? "chaud" : "") },
      { et: "Restant au forfait de " + plafond, n: String(restant).replace(".", ","),
        etat: restant < 0 ? "froid" : (restant <= 5 ? "chaud" : "") },
      { et: "Repos du forfait pris sur " + reposDus, n: t.repos + " / " + reposDus,
        etat: reposRestants < 0 ? "froid" : "" },
      { et: "Congés payés pris", n: String(t.conge) },
      { et: "Jours non qualifiés", n: String(t.vides), etat: t.vides ? "froid" : "" },
      { et: "Plus longue suite de jours travaillés", n: String(t.pire),
        etat: t.pire > 6 ? "froid" : "" },
    ];
    $("compteurs").innerHTML = tuiles.map(function (x) {
      return '<div class="tuile ' + (x.etat || "") + '"><span class="et">' + ech(x.et) +
        '</span><div class="n">' + ech(x.n) + "</div></div>";
    }).join("");

    majAlertes(t, plafond, restant, reposDus, reposRestants);
    majRenonce();
  }

  /* LES ALERTES. Chacune porte son bouton : on ne montre pas un problème sans
     ce qui le règle. */
  function majAlertes(t, plafond, restant, reposDus, reposRestants) {
    var f = fiche(), b = bornesPeriode(), A = [];
    var aujourdhui = new Date();

    if (t.vides) {
      A.push({ grave: true, t: t.vides + " jour" + (t.vides > 1 ? "s" : "") + " ne sont pas qualifiés",
        c: "Le document de contrôle doit faire apparaître le nombre et la date des journées " +
           "travaillées. Un trou dans la grille, et il ne prouve plus rien.",
        b: "Aller au premier mois incomplet", f: "trou" });
    }
    if (restant < 0) {
      A.push({ grave: true, t: "Le forfait est dépassé de " + String(-restant).replace(".", ",") + " jours",
        c: "Au-delà du forfait, il faut un avenant de renonciation écrit et une majoration d'au " +
           "moins 10 % (L. 3121-59). Le dépassement répété a suffi à faire condamner un employeur " +
           "qui n'y avait pas remédié (Soc. 10 janvier 2024, n° 22-13.200).",
        b: "Faire l'avenant de renonciation", f: "renonce" });
    } else if (restant <= 5) {
      A.push({ t: "Il ne reste que " + String(restant).replace(".", ",") + " jours au forfait",
        c: "Soit le salarié s'arrête, soit un avenant de renonciation est signé avant le dépassement.",
        b: "Faire l'avenant", f: "renonce" });
    }
    if (t.pire > 6) {
      A.push({ grave: true, t: t.pire + " jours travaillés d'affilée",
        c: "Le forfait dispense des durées maximales, pas des repos : vingt-quatre heures " +
           "consécutives au minimum par semaine, auxquelles s'ajoute le repos quotidien de onze " +
           "heures (L. 3132-2 et L. 3131-1).",
        b: "Courrier de rappel des repos", f: "rappel" });
    }
    /* Les repos qui ne se prennent pas. Regardé aux trois quarts de la
       période : passé ce point, ce qui reste ne se rattrape plus. */
    var ecoules = (aujourdhui.getFullYear() - b.deb.an) * 12 +
      (aujourdhui.getMonth() - b.deb.mo) + 1;
    if (ecoules > 12) ecoules = 12;
    if (reposDus > 0 && ecoules >= 9 && reposRestants > reposDus / 2) {
      A.push({ t: reposRestants + " jours de repos du forfait restent à prendre",
        c: "Plus de la moitié, au " + ecoules + "e mois de la période. Ces jours ne se paient pas : " +
           "ils se prennent, ou ils font la preuve d'une charge excessive.",
        b: "Courrier de rappel des repos", f: "rappel" });
    }
    var dernierEnt = (f.entretiens || [])[0];
    if (!dernierEnt) {
      A.push({ grave: true, t: "Aucun entretien annuel n'est enregistré",
        c: "L'entretien sur la charge, l'organisation, l'articulation avec la vie personnelle et la " +
           "rémunération est dû une fois par an (L. 3121-65, I, 3°). Sans lui, la convention est " +
           "privée d'effet.",
        b: "Tenir l'entretien", f: "entretien" });
    } else {
      var ecart = (new Date() - new Date(dernierEnt.le)) / 86400000;
      if (ecart > 335) {
        A.push({ t: "L'entretien annuel arrive à échéance",
          c: "Le dernier a eu lieu le " + enFrancais(dernierEnt.le) + ". Une convocation envoyée " +
             "après la date n'a pas été jugée suffisante (Soc. 10 janvier 2024, n° 22-13.200).",
          b: "Convoquer", f: "entretien" });
      }
      if (dernierEnt.charge === "excessive" && !net(dernierEnt.mesures)) {
        A.push({ grave: true, t: "Une charge excessive a été signalée sans mesure décidée",
          c: "L'article L. 3121-60 est d'ordre public : informé, l'employeur doit y remédier en " +
             "temps utile. C'est cette inaction, et non la surcharge elle-même, qui fait tomber le " +
             "forfait.",
          b: "Écrire les mesures", f: "entretien" });
      }
    }
    (f.renonces || []).forEach(function (r) {
      if (String(r.an) !== String(b.a - 1)) return;
      A.push({ t: "La renonciation de " + r.an + " ne se reconduit pas",
        c: "L'avenant vaut pour la seule année en cours et ne peut pas être reconduit tacitement " +
           "(L. 3121-59). Il en faut un nouveau, signé.",
        b: "Nouvel avenant", f: "renonce" });
    });

    if (!A.length) {
      $("alertes").innerHTML = '<p class="calme">Rien à traiter. Le mois est complet, les repos ' +
        "suivent, l'entretien est à jour.</p>";
      return;
    }
    $("alertes").innerHTML = A.map(function (a, i) {
      return '<div class="al' + (a.grave ? " grave" : "") + '"><div class="t">' + ech(a.t) +
        '</div><div class="c">' + ech(a.c) + "</div>" +
        '<button type="button" class="second" data-al="' + i + '" data-f="' + a.f + '">' +
        ech(a.b) + "</button></div>";
    }).join("");
    Array.prototype.forEach.call($("alertes").querySelectorAll("[data-f]"), function (b) {
      b.addEventListener("click", function () {
        var f2 = b.getAttribute("data-f");
        if (f2 === "rappel") { docRappelRepos(); return; }
        if (f2 === "renonce") { $("r-nb").focus();
          $("r-nb").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
        if (f2 === "entretien") { $("e-date").focus();
          $("e-date").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
        if (f2 === "trou") { allerAuTrou(); }
      });
    });
  }

  function allerAuTrou() {
    var f = fiche(), b = bornesPeriode();
    var a = b.deb.an, m = b.deb.mo, aujourdhui = new Date();
    while (a < b.fin.an || (a === b.fin.an && m <= b.fin.mo)) {
      var x = f.suivi[cleMois(a, m)] || { j: {} };
      var dernier = new Date(a, m + 1, 0).getDate();
      for (var j = 1; j <= dernier; j++) {
        var d = new Date(a, m, j);
        if (d > aujourdhui) break;
        if (x.j[String(j)] == null) {
          an = a; mo = m;
          dessinerJours(); majCompteurs();
          $("jours").scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      m++; if (m > 11) { m = 0; a++; }
    }
  }

  /* ═════════════════════════ entretien et renonciation ═══════════════════ */

  function rendreEntretiens() {
    var f = fiche();
    $("entretiens").innerHTML = (f.entretiens || []).map(function (e) {
      var dit = { raisonnable: "charge raisonnable", lourde: "charge lourde mais tenable",
        excessive: "charge excessive" }[e.charge] || "";
      return '<div class="item"><div class="t">Entretien du ' + ech(enFrancais(e.le)) + "</div>" +
        '<div class="meta">' + ech(dit) + (net(e.mesures) ? ", mesures écrites" : ", aucune mesure écrite") +
        "</div>" + '<div class="corps">' + ech(e.dit || "") +
        (net(e.mesures) ? "\n\nMesures : " + ech(e.mesures) : "") + "</div></div>";
    }).join("");
  }

  function majRenonce() {
    var f = fiche(), b = bornesPeriode();
    var forfait = nb(f.conv.jours, 218);
    var n = nb($("r-nb").value, 0);
    var taux = nb($("r-taux").value, 10);
    var plafond = nb($("r-plafond").value, 0) || 235;
    var total = forfait + n;
    var txt = "";
    if (n > 0) {
      txt = "Le forfait passerait à " + total + " jours. ";
      if (total > plafond) {
        txt += "C'est au-dessus du plafond de " + plafond + " : la renonciation ne peut pas aller " +
          "jusque-là. Ramenez-la à " + Math.max(0, plafond - forfait) + " jours au plus.";
      } else {
        txt += "Sous le plafond de " + plafond + ". ";
        var r = parseFloat(String(f.conv.remun || "").replace(/\s/g, "").replace(",", "."));
        if (!isNaN(r) && r > 0 && forfait > 0) {
          var jour = r / forfait;
          var du = jour * n * (1 + taux / 100);
          txt += "À " + euros(jour) + " la journée, " + n + " jour" + (n > 1 ? "s" : "") +
            " majoré" + (n > 1 ? "s" : "") + " de " + taux + " % représentent " + euros(du) + ".";
        } else {
          txt += "La majoration ne peut pas être inférieure à 10 % (L. 3121-59).";
        }
      }
    }
    $("r-calcul").textContent = txt;
    $("renonces").innerHTML = (f.renonces || []).map(function (x) {
      return '<div class="item"><div class="t">Renonciation de ' + ech(String(x.an)) + " : " +
        ech(String(x.nb)) + " jour" + (x.nb > 1 ? "s" : "") + '</div><div class="meta">Majoration ' +
        ech(String(x.taux)) + " %, signée le " + ech(enFrancais(x.le)) +
        ". Valable pour cette seule année, sans reconduction tacite.</div></div>";
    }).join("");
  }

  /* ═══════════════════════════════ documents ═════════════════════════════ */

  function sortir(items, titre, nomFichier, opts) {
    if (!window.AuditExport) return;
    window.AuditExport.telecharger(window.AuditExport.docx(items, titre, opts), nomFichier,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  }
  function entete() {
    var p = entreprise();
    return { k: "sur", t: (p.denomination || "") + (p.adresse ? " - " + p.adresse : "") };
  }
  function signature() {
    var p = entreprise();
    return [
      { k: "p", t: " " },
      { k: "p", t: "Fait à ........................, le ........................" },
      { k: "p", t: "en deux exemplaires originaux." },
      { k: "p", t: " " },
      { k: "p", t: "Pour l'entreprise, " + (p.responsable || "") },
      { k: "p", t: "Le salarié, précédé de la mention « lu et approuvé »" },
    ];
  }

  /* LA CONVENTION DE FORFAIT. Les cinq mentions du I de L. 3121-64, 5°,
     l'autonomie caractérisée en fait et non recopiée du code, les repos qui
     restent dus, le suivi et l'entretien promis noir sur blanc. */
  function docConvention() {
    var f = fiche(), p = entreprise(), a = accord();
    var forfait = nb(f.conv.jours, 218);
    var periode = { civile: "du 1er janvier au 31 décembre",
      juin: "du 1er juin au 31 mai", autre: "de douze mois consécutifs, précisée ci-après" }[f.conv.periode || "civile"];
    var source = a.source === "branche"
      ? "l'accord de branche applicable à l'entreprise"
      : "l'accord d'entreprise du " + (enFrancais(a.signeLe) || "........................");
    var items = [entete(),
      { k: "h1", t: f.conv.forme === "clause"
        ? "Convention individuelle de forfait en jours sur l'année"
        : "Avenant au contrat de travail : convention de forfait en jours sur l'année" },
      { k: "p", t: "Entre " + (p.denomination || "........................") +
        ", représentée par " + (p.responsable || "........................") + ", d'une part," },
      { k: "p", t: "et " + qui.nom + (qui.emp ? ", " + qui.emp : "") + ", d'autre part," },
      { k: "p", t: "il est convenu ce qui suit." },
      { k: "h2", t: "Article 1. Ce qui fonde ce forfait" },
      { k: "p", t: "Le présent forfait est conclu en application de " + source + ", conformément à " +
        "l'article L. 3121-63 du code du travail." },
      { k: "h2", t: "Article 2. L'autonomie du salarié" },
      { k: "p", t: net(f.conv.fonctions) || "[décrire les fonctions et ce qui rend le salarié " +
        "autonome : qui fixe ses rendez-vous, ses déplacements, l'ordre de ses journées]" },
      { k: "p", t: "Le salarié dispose ainsi d'une réelle autonomie dans l'organisation de son " +
        "emploi du temps, et la nature de ses fonctions ne le conduit pas à suivre l'horaire " +
        "collectif applicable à son service. Il relève à ce titre de l'article L. 3121-58 du code " +
        "du travail." },
      { k: "h2", t: "Article 3. Le nombre de jours et la période" },
      { k: "p", t: "Le forfait est de " + forfait + " jours travaillés par période de référence, " +
        "journée de solidarité comprise. La période de référence court " + periode + "." },
      { k: "p", t: "Pour la période " + (f.conv.an || "") + ", ce forfait ouvre " +
        nb(f.conv.repos, 0) + " jours de repos, en plus des congés payés, des repos hebdomadaires " +
        "et des jours fériés chômés dans l'entreprise." },
      { k: "p", t: "Les absences, ainsi que les arrivées et départs en cours de période, sont " +
        "traitées selon les règles de l'accord collectif visé à l'article 1er." },
      { k: "h2", t: "Article 4. La rémunération" },
      { k: "p", t: "La rémunération annuelle brute est fixée à " +
        (euros(f.conv.remun) || "........................") + ", versée par douzièmes, " +
        "indépendamment du nombre de jours travaillés dans le mois." },
      { k: "h2", t: "Article 5. Les repos, qui restent dus" },
      { k: "p", t: "Le salarié n'est soumis ni à la durée quotidienne maximale, ni aux durées " +
        "hebdomadaires maximales, ni à la durée légale hebdomadaire (article L. 3121-62). Il " +
        "bénéficie en revanche d'un repos quotidien de onze heures consécutives au minimum " +
        "(article L. 3131-1) et d'un repos hebdomadaire de vingt-quatre heures consécutives " +
        "auxquelles s'ajoute ce repos quotidien (article L. 3132-2)." },
      { k: "h2", t: "Article 6. Le décompte des journées" },
      { k: "p", t: "Un document de contrôle fait apparaître le nombre et la date des journées ou " +
        "demi-journées travaillées, ainsi que la qualification des journées non travaillées. Il est " +
        "renseigné chaque mois, sous la responsabilité de l'employeur, et le salarié peut le remplir " +
        "lui-même. Il est validé par les deux parties." },
      { k: "h2", t: "Article 7. La charge de travail et l'entretien annuel" },
      { k: "p", t: "L'employeur s'assure régulièrement que la charge de travail du salarié est " +
        "raisonnable et permet une bonne répartition dans le temps de son travail. Un entretien est " +
        "organisé une fois par an au moins ; il porte sur la charge de travail, l'organisation du " +
        "travail, l'articulation entre l'activité professionnelle et la vie personnelle, et la " +
        "rémunération. Les mesures décidées y sont écrites, avec leur échéance." },
      { k: "p", t: "Le salarié peut, à tout moment et par écrit, signaler une charge qu'il estime " +
        "excessive. L'employeur le reçoit dans les quinze jours et lui répond par écrit." },
      { k: "h2", t: "Article 8. Le droit à la déconnexion" },
      { k: "p", t: "Le salarié n'est pas tenu de répondre aux courriels, messages et appels " +
        "professionnels pendant ses repos quotidiens et hebdomadaires, ses congés et ses jours de " +
        "repos. Aucun reproche ne peut lui en être fait." },
      { k: "h2", t: "Article 9. La renonciation à des jours de repos" },
      { k: "p", t: "Le salarié peut renoncer à une partie de ses jours de repos. Cette " +
        "renonciation fait l'objet d'un avenant écrit fixant la majoration, qui ne peut être " +
        "inférieure à 10 %. Cet avenant vaut pour la seule année en cours et ne se reconduit pas " +
        "tacitement." },
      { k: "p", t: "Prise d'effet : " + (enFrancais(f.conv.effet) || "........................") + "." },
      { k: "note", t: "Les autres clauses du contrat de travail demeurent inchangées." },
    ].concat(signature());
    sortir(items, "Convention de forfait en jours - " + qui.nom,
      "forfait-convention-" + qui.id + ".docx");
  }

  /* LE PROJET D'ACCORD. Il porte les huit clauses, parce qu'un accord qui en
     oublie une ne fonde rien. */
  function docAccord() {
    var p = entreprise(), f = fiche(), v = voie(), eff = effectif();
    var conclusion = {
      A: "Le présent accord est soumis à la consultation du personnel. Il sera considéré comme un " +
         "accord d'entreprise valide s'il est approuvé à la majorité des deux tiers du personnel " +
         "(articles L. 2232-21 et L. 2232-22 du code du travail).",
      B: "Le présent accord est conclu en application de l'article L. 2232-23-1 du code du travail.",
      C: "Le présent accord est conclu en application des articles L. 2232-24 à L. 2232-26 du code " +
         "du travail.",
      D: "Le présent accord est conclu en application de l'article L. 2232-12 du code du travail.",
    }[v] || "La voie de conclusion sera précisée avant signature.";
    var items = [entete(),
      { k: "h1", t: "Accord d'entreprise relatif au forfait annuel en jours" },
      { k: "p", t: "Entre " + (p.denomination || "........................") + ", dont l'effectif " +
        "est de " + (eff || "....") + " salariés, représentée par " +
        (p.responsable || "........................")+ "," },
      { k: "p", t: "et les parties désignées à l'article 10," },
      { k: "p", t: "il a été convenu ce qui suit." },
      { k: "h2", t: "Article 1. Objet" },
      { k: "p", t: "Le présent accord autorise la conclusion de conventions individuelles de " +
        "forfait annuel en jours, en application des articles L. 3121-58 et L. 3121-63 du code du " +
        "travail." },
      { k: "h2", t: "Article 2. Les salariés concernés" },
      { k: "p", t: "Peuvent conclure une convention de forfait en jours les cadres qui disposent " +
        "d'une autonomie dans l'organisation de leur emploi du temps et dont la nature des " +
        "fonctions ne les conduit pas à suivre l'horaire collectif de leur service, ainsi que les " +
        "salariés dont la durée du travail ne peut être prédéterminée et qui disposent d'une réelle " +
        "autonomie dans l'organisation de leur emploi du temps." },
      { k: "p", t: "Sont visés dans l'entreprise les emplois suivants : " +
        "[lister les emplois, un par un]." },
      { k: "h2", t: "Article 3. La période de référence" },
      { k: "p", t: "La période de référence est " + (f.conv.periode === "juin"
        ? "la période allant du 1er juin au 31 mai" : "l'année civile") + "." },
      { k: "h2", t: "Article 4. Le nombre de jours" },
      { k: "p", t: "Le forfait est fixé à " + nb(f.conv.jours, 218) + " jours travaillés par " +
        "période de référence, journée de solidarité comprise, dans la limite de deux cent " +
        "dix-huit jours." },
      { k: "h2", t: "Article 5. Absences, arrivées et départs en cours de période" },
      { k: "p", t: "En cas d'entrée ou de sortie en cours de période, le nombre de jours du forfait " +
        "est calculé au prorata du temps de présence, arrondi à l'entier le plus proche, et les " +
        "jours de repos sont recalculés en conséquence." },
      { k: "p", t: "Les absences indemnisées ou autorisées ne réduisent pas le nombre de jours de " +
        "repos ; elles s'imputent sur le nombre de jours travaillés dû." },
      { k: "h2", t: "Article 6. Les conventions individuelles" },
      { k: "p", t: "La conclusion d'un forfait en jours fait l'objet d'une convention individuelle " +
        "écrite, signée par le salarié. Elle fixe le nombre de jours, la période de référence, la " +
        "rémunération, et rappelle les repos et le suivi prévus au présent accord." },
      { k: "h2", t: "Article 7. L'évaluation et le suivi de la charge de travail" },
      { k: "p", t: "Un document de contrôle fait apparaître, chaque mois, le nombre et la date des " +
        "journées ou demi-journées travaillées, ainsi que la qualification des journées non " +
        "travaillées. Il est renseigné sous la responsabilité de l'employeur et peut l'être par le " +
        "salarié. L'employeur le valide et conserve cette validation." },
      { k: "p", t: "L'employeur s'assure que la charge est compatible avec le respect des repos " +
        "quotidien et hebdomadaire. Une amplitude ou une charge qui ne le seraient pas donnent lieu " +
        "à un entretien dans les quinze jours et à des mesures écrites." },
      { k: "h2", t: "Article 8. La communication périodique" },
      { k: "p", t: "Un entretien est organisé une fois par an au moins entre le salarié et son " +
        "responsable. Il porte sur la charge de travail, l'organisation du travail dans " +
        "l'entreprise, l'articulation entre l'activité professionnelle et la vie personnelle, et la " +
        "rémunération. Il donne lieu à un compte rendu écrit, signé des deux parties, où figurent " +
        "les mesures décidées et leur échéance." },
      { k: "p", t: "Indépendamment de cet entretien, le salarié peut à tout moment saisir par écrit " +
        "son employeur d'une difficulté liée à sa charge de travail. L'employeur le reçoit dans les " +
        "quinze jours et lui répond par écrit." },
      { k: "h2", t: "Article 9. Le droit à la déconnexion" },
      { k: "p", t: "Les salariés au forfait ne sont pas tenus de répondre aux sollicitations " +
        "professionnelles pendant leurs repos, congés et jours de repos. Les envois en dehors des " +
        "plages habituelles de travail n'appellent pas de réponse immédiate." },
      { k: "h2", t: "Article 10. Durée, révision, dénonciation" },
      { k: "p", t: "Le présent accord est conclu pour une durée indéterminée. Il peut être révisé " +
        "ou dénoncé dans les conditions prévues par le code du travail." },
      { k: "h2", t: "Article 11. Conclusion, dépôt et publicité" },
      { k: "p", t: conclusion },
      { k: "p", t: "Il sera notifié à l'ensemble des organisations représentatives, déposé sur la " +
        "plateforme de téléprocédure du ministère du travail avec sa version publiable, et un " +
        "exemplaire sera remis au greffe du conseil de prud'hommes du lieu de conclusion. Il entre " +
        "en vigueur le lendemain de son dépôt." },
    ].concat(signature());
    sortir(items, "Projet d'accord - forfait en jours", "forfait-projet-accord.docx");
  }

  /* LES MODALITÉS DU VOTE ET SON PROCÈS-VERBAL. Les quatre points de
     R. 2232-11, et le procès-verbal que R. 2232-10, 4° veut annexé. */
  function docVote() {
    var p = entreprise(), a = accord(), eff = effectif();
    var seuil = Math.ceil(eff * 2 / 3);
    var items = [entete(),
      { k: "h1", t: "Consultation du personnel sur le projet d'accord relatif au forfait en jours" },
      { k: "h2", t: "Modalités d'organisation" },
      { k: "puce", t: "Transmission du texte : le projet d'accord est remis en main propre contre " +
        "décharge à chaque salarié, et affiché sur le panneau réservé aux communications de la " +
        "direction." },
      { k: "puce", t: "Date de la remise : " + (enFrancais(a.depart) || "........................") + "." },
      { k: "puce", t: "Date, heure et lieu du vote : " +
        (a.depart ? enFrancais(plus(a.depart, 15)) : "........................") +
        ", de ...... h à ...... h, [lieu]. Le vote a lieu pendant le temps de travail." },
      { k: "puce", t: "Déroulement : vote personnel et secret, par bulletin déposé dans une urne. " +
        "Le dépouillement a lieu hors la présence de l'employeur ; le résultat lui est porté à " +
        "l'issue de la consultation." },
      { k: "puce", t: "Question posée : « Approuvez-vous le projet d'accord d'entreprise relatif au " +
        "forfait annuel en jours ? » Réponses : OUI, NON. Le vote blanc ou nul est possible." },
      { k: "note", t: "Articles R. 2232-10 à R. 2232-12 du code du travail. Le délai de quinze " +
        "jours court à compter de la communication du projet à chaque salarié." },
      { k: "h2", t: "Liste des salariés consultés" },
      { k: "p", t: "La liste nominative de l'ensemble des salariés est annexée aux présentes " +
        "modalités et affichée en même temps qu'elles. Elle fixe le dénominateur des deux tiers." },
      { k: "note", t: "Aucun texte ne définit l'électorat de cette consultation ; l'article " +
        "R. 2232-13 suppose seulement qu'une liste des salariés devant être consultés existe et " +
        "peut être contestée devant le tribunal judiciaire." },
      { k: "saut" },
      { k: "h1", t: "Procès-verbal de la consultation" },
      { k: "p", t: "Le ........................, de ...... h à ...... h, les salariés de " +
        (p.denomination || "........................") + " ont été consultés sur le projet d'accord " +
        "d'entreprise relatif au forfait annuel en jours." },
      { k: "table", head: ["", "Nombre"], rows: [
        ["Salariés inscrits sur la liste", String(eff || "")],
        ["Votants", ""],
        ["Bulletins blancs ou nuls", ""],
        ["OUI", ""],
        ["NON", ""],
        ["Majorité requise : deux tiers du personnel", String(seuil || "")],
      ] },
      { k: "p", t: "Le projet d'accord est en conséquence : approuvé / rejeté (rayer la mention " +
        "inutile)." },
      { k: "note", t: "La majorité se calcule sur l'effectif du personnel, et non sur les votants : " +
        "un salarié absent compte comme un refus (L. 2232-22). Ce procès-verbal fait l'objet d'une " +
        "publicité dans l'entreprise et est annexé à l'accord lors du dépôt." },
      { k: "p", t: " " },
      { k: "p", t: "Signatures des salariés chargés du dépouillement :" },
    ];
    sortir(items, "Consultation du personnel - forfait en jours", "forfait-consultation.docx");
  }

  function docDecharge() {
    var p = entreprise(), f = fiche();
    var items = [entete(),
      { k: "dest", t: qui.nom },
      { k: "p", t: "Objet : remise de votre convention de forfait en jours" },
      { k: "p", t: "Le ........................" },
      { k: "p", t: "Madame, Monsieur," },
      { k: "p", t: "Nous vous remettons ce jour la convention de forfait en jours qui vous " +
        "concerne, à effet du " + (enFrancais(f.conv.effet) || "........................") + ", " +
        "ainsi que l'accord collectif qui la fonde." },
      { k: "p", t: "Ce forfait ne peut s'appliquer qu'avec votre accord, et cet accord doit être " +
        "écrit. Nous vous remercions de nous retourner un exemplaire signé, ou de nous faire " +
        "connaître votre refus, par écrit également. Un refus ne peut vous être reproché." },
      { k: "p", t: "Nous restons à votre disposition pour en parler." },
      { k: "p", t: "Veuillez agréer, Madame, Monsieur, nos salutations distinguées." },
      { k: "p", t: (p.responsable || "") },
      { k: "p", t: " " },
      { k: "p", t: "Reçu le ........................" },
      { k: "p", t: "Signature du salarié, précédée de la mention « reçu le » :" },
    ];
    sortir(items, "Remise de la convention de forfait", "forfait-remise-" + qui.id + ".docx");
  }

  function docCse() {
    var p = entreprise();
    var items = [entete(),
      { k: "h1", t: "Consultation du comité social et économique" },
      { k: "p", t: "Objet : projet d'accord relatif au forfait annuel en jours" },
      { k: "h2", t: "Ordre du jour" },
      { k: "puce", t: "Présentation du projet d'accord relatif au forfait annuel en jours." },
      { k: "puce", t: "Les emplois concernés et ce qui fonde leur autonomie." },
      { k: "puce", t: "Le nombre de jours, la période de référence, le calcul des jours de repos." },
      { k: "puce", t: "Les modalités de suivi de la charge de travail et l'entretien annuel." },
      { k: "puce", t: "Le droit à la déconnexion." },
      { k: "puce", t: "Avis du comité." },
      { k: "p", t: "Les documents nécessaires ont été transmis aux membres du comité le " +
        "........................" },
      { k: "p", t: (p.responsable || "") },
      { k: "note", t: "Quand le comité est lui-même partie à la négociation, il n'est pas consulté " +
        "sur le projet qu'il négocie : la consultation se conçoit dans les autres cas, et son " +
        "étendue dépend de la voie de conclusion retenue." },
    ];
    sortir(items, "Consultation du CSE - forfait en jours", "forfait-cse.docx");
  }

  function docNotification() {
    var p = entreprise(), a = accord();
    var items = [entete(),
      { k: "dest", t: "[Organisation syndicale]" },
      { k: "p", t: "Lettre recommandée avec avis de réception" },
      { k: "p", t: "Objet : notification de l'accord d'entreprise relatif au forfait annuel en jours" },
      { k: "p", t: "Le ........................" },
      { k: "p", t: "Madame, Monsieur," },
      { k: "p", t: "Conformément à l'article L. 2231-5 du code du travail, nous vous notifions le " +
        "texte de l'accord d'entreprise relatif au forfait annuel en jours, signé le " +
        (enFrancais(a.signeLe) || "........................") + ", dont copie est jointe." },
      { k: "p", t: "Veuillez agréer, Madame, Monsieur, nos salutations distinguées." },
      { k: "p", t: (p.responsable || "") },
      { k: "note", t: "L'avis de réception ou le récépissé de cette notification est l'une des " +
        "pièces exigées au dépôt (D. 2231-7, 1°, b)." },
    ];
    sortir(items, "Notification de l'accord", "forfait-notification.docx");
  }

  function docGreffe() {
    var p = entreprise(), a = accord();
    var items = [entete(),
      { k: "dest", t: "Monsieur le Greffier en chef" },
      { k: "dest", t: "Conseil de prud'hommes de ........................" },
      { k: "p", t: "Objet : dépôt d'un accord d'entreprise" },
      { k: "p", t: "Le ........................" },
      { k: "p", t: "Monsieur le Greffier en chef," },
      { k: "p", t: "Conformément au III de l'article D. 2231-2 du code du travail, nous vous " +
        "adressons un exemplaire de l'accord d'entreprise relatif au forfait annuel en jours, " +
        "conclu le " + (enFrancais(a.signeLe) || "........................") + " au sein de " +
        (p.denomination || "........................") + "." },
      { k: "p", t: "Cet accord a par ailleurs été déposé sur la plateforme de téléprocédure du " +
        "ministère du travail le " + (enFrancais(a.depot) || "........................") + "." },
      { k: "p", t: "Nous vous prions d'agréer, Monsieur le Greffier en chef, l'expression de notre " +
        "considération distinguée." },
      { k: "p", t: (p.responsable || "") },
      { k: "note", t: "Pièce jointe : un exemplaire de l'accord." },
    ];
    sortir(items, "Dépôt au greffe du conseil de prud'hommes", "forfait-depot-greffe.docx");
  }

  function docEntretien() {
    var p = entreprise();
    var items = [entete(),
      { k: "h1", t: "Entretien annuel sur le forfait en jours" },
      { k: "p", t: "Salarié : " + qui.nom + (qui.emp ? ", " + qui.emp : "") },
      { k: "p", t: "Date de l'entretien : ........................" },
      { k: "p", t: "Conduit par : " + (p.responsable || "........................") },
      { k: "h2", t: "1. La charge de travail" },
      { k: "p", t: "Nombre de jours travaillés depuis le début de la période : ............ sur " +
        nb(fiche().conv.jours, 218) + "." },
      { k: "p", t: "Jours de repos pris : ............ sur " + nb(fiche().conv.repos, 0) + "." },
      { k: "p", t: "La charge vous paraît-elle raisonnable ? (raisonnable / lourde mais tenable / " +
        "excessive)" },
      { k: "p", t: "Quelles périodes ont été les plus lourdes, et pourquoi ?" },
      { k: "p", t: " " },
      { k: "h2", t: "2. L'organisation du travail" },
      { k: "p", t: "Les moyens, les délais et les priorités sont-ils compatibles avec le nombre de " +
        "jours du forfait ? Qu'est-ce qui déborde ?" },
      { k: "p", t: " " },
      { k: "h2", t: "3. L'articulation avec la vie personnelle" },
      { k: "p", t: "Les repos quotidien et hebdomadaire sont-ils respectés ? Des sollicitations ont-" +
        "elles lieu le soir, le week-end, pendant les congés ?" },
      { k: "p", t: " " },
      { k: "h2", t: "4. La rémunération" },
      { k: "p", t: "La rémunération vous paraît-elle en rapport avec les sujétions du forfait ?" },
      { k: "p", t: " " },
      { k: "h2", t: "5. Les mesures décidées" },
      { k: "p", t: "Ce qui est retiré, reporté ou redistribué, qui le reprend, et à partir de " +
        "quand :" },
      { k: "p", t: " " },
      { k: "p", t: " " },
      { k: "note", t: "Article L. 3121-65, I, 3° du code du travail. Un entretien qui constate une " +
        "charge excessive sans qu'aucune mesure suive ne protège pas l'employeur : l'article " +
        "L. 3121-60 est d'ordre public, et il faut y remédier en temps utile." },
      { k: "p", t: " " },
      { k: "p", t: "Signature du salarié :" },
      { k: "p", t: "Signature de l'employeur :" },
    ];
    sortir(items, "Entretien annuel - forfait en jours - " + qui.nom,
      "forfait-entretien-" + qui.id + ".docx");
  }

  function docRenonce() {
    var f = fiche(), p = entreprise();
    var n = nb($("r-nb").value, 0), taux = nb($("r-taux").value, 10);
    var forfait = nb(f.conv.jours, 218);
    var plafond = nb($("r-plafond").value, 0) || 235;
    var items = [entete(),
      { k: "h1", t: "Avenant de renonciation à des jours de repos" },
      { k: "p", t: "Entre " + (p.denomination || "........................") + ", représentée par " +
        (p.responsable || "........................") + ", et " + qui.nom + "," },
      { k: "p", t: "il est convenu ce qui suit." },
      { k: "h2", t: "Article 1" },
      { k: "p", t: "Le salarié, qui le souhaite et en accord avec son employeur, renonce à " +
        (n || "....") + " jour" + (n > 1 ? "s" : "") + " de repos au titre de la période de " +
        "référence " + (f.conv.an || "........") + "." },
      { k: "h2", t: "Article 2" },
      { k: "p", t: "Le nombre de jours travaillés est porté de " + forfait + " à " +
        (forfait + n) + " jours pour cette seule période. Ce nombre reste inférieur au plafond de " +
        plafond + " jours." },
      { k: "h2", t: "Article 3" },
      { k: "p", t: "Chaque journée de travail supplémentaire ainsi accomplie est rémunérée avec une " +
        "majoration de " + taux + " %, qui ne peut être inférieure à 10 %." },
      { k: "h2", t: "Article 4" },
      { k: "p", t: "Le présent avenant est valable pour la seule période de référence indiquée à " +
        "l'article 1er. Il ne peut être reconduit de manière tacite : une nouvelle renonciation " +
        "suppose un nouvel avenant écrit." },
      { k: "note", t: "Articles L. 3121-59 et L. 3121-66 du code du travail. Les repos quotidien et " +
        "hebdomadaire, ainsi que les congés payés, restent intégralement dus." },
    ].concat(signature());
    sortir(items, "Avenant de renonciation - " + qui.nom,
      "forfait-renonciation-" + qui.id + ".docx");
  }

  function docRappelRepos() {
    var p = entreprise(), t = compterPeriode(), f = fiche();
    var reposDus = nb(f.conv.repos, 0);
    var items = [entete(),
      { k: "dest", t: qui.nom },
      { k: "p", t: "Objet : vos jours de repos et vos temps de repos" },
      { k: "p", t: "Le ........................" },
      { k: "p", t: "Madame, Monsieur," },
      { k: "p", t: "Le document de contrôle de votre forfait fait apparaître, à ce jour, " +
        String(t.travail).replace(".", ",") + " journées travaillées et " + t.repos +
        " jours de repos pris sur les " + reposDus + " auxquels vous avez droit." },
      { k: "p", t: "Ces jours ne se paient pas : ils se prennent. Nous vous demandons de nous " +
        "indiquer, avant le ........................, les dates auxquelles vous comptez les poser, " +
        "et de vous rapprocher de nous si votre charge de travail ne vous le permet pas." },
      { k: "p", t: "Nous vous rappelons également que vous devez bénéficier d'un repos quotidien " +
        "de onze heures consécutives au minimum et d'un repos hebdomadaire de vingt-quatre heures " +
        "consécutives auxquelles s'ajoute ce repos quotidien. Si l'organisation de votre travail " +
        "ne vous permet pas de les respecter, dites-le nous par écrit : nous vous recevrons dans " +
        "les quinze jours." },
      { k: "p", t: "Veuillez agréer, Madame, Monsieur, nos salutations distinguées." },
      { k: "p", t: (p.responsable || "") },
    ];
    sortir(items, "Rappel des repos - " + qui.nom, "forfait-rappel-repos-" + qui.id + ".docx");
  }

  function docAudit() {
    var f = fiche(), p = entreprise();
    var lignes = CONTROLES.map(function (c) {
      return [c.t, f.ctrl[c.c] ? "Oui" : "Non", f.ctrl[c.c] ? "" : c.ko];
    });
    var v = $("ct-verdict");
    var items = [entete(),
      { k: "h1", t: "Contrôle de la convention de forfait en jours" },
      { k: "p", t: "Salarié : " + qui.nom + (qui.emp ? ", " + qui.emp : "") },
      { k: "p", t: "Contrôle effectué le " + enFrancais(iso(new Date())) + "." },
      { k: "table", head: ["Point contrôlé", "Tenu", "Ce qu'entraîne le défaut"], rows: lignes },
      { k: "enc", titre: v.querySelector(".t").textContent, t: v.querySelector(".d").textContent },
      { k: "note", t: "Établi au regard des articles L. 3121-55, L. 3121-58 à L. 3121-66 du code " +
        "du travail, et de la jurisprudence de la chambre sociale : Soc. 10 janvier 2024, " +
        "n° 22-15.782 ; Soc. 11 mars 2025, n° 23-19.669 ; Soc. 19 décembre 2018, n° 17-18.725 ; " +
        "Soc. 10 janvier 2024, n° 22-13.200 ; Soc. 6 janvier 2021, n° 17-28.234." },
      { k: "p", t: (p.responsable || "") },
    ];
    sortir(items, "Contrôle du forfait en jours - " + qui.nom,
      "forfait-controle-" + qui.id + ".docx", { paysage: true });
  }

  /* ════════════════ le document de contrôle, papier et fichiers ══════════ */

  function tableauMois(a, m) {
    var f = fiche();
    var x = f.suivi[cleMois(a, m)] || { j: {} };
    var dernier = new Date(a, m + 1, 0).getDate();
    var T = [["Jour", "Qualification", "Observation"]];
    for (var j = 1; j <= dernier; j++) {
      var d = new Date(a, m, j);
      var v = x.j[String(j)];
      var fe = estFerie(a, iso(d));
      T.push([j + " " + COURT[d.getDay()], v == null ? "non qualifié" : LIB[v], fe || ""]);
    }
    return T;
  }

  function feuilleImpression() {
    var p = entreprise(), f = fiche(), x = moisDe(an, mo), T = tableauMois(an, mo);
    var t = compterPeriode(), b = bornesPeriode();
    var h = "<h1>Document de contrôle du forfait en jours</h1>";
    h += '<p class="sous">' + ech(p.denomination || "") + (p.adresse ? " - " + ech(p.adresse) : "") +
      "<br>Salarié : " + ech(qui.nom) + (qui.emp ? ", " + ech(qui.emp) : "") +
      "<br>Mois : " + ech(MOIS[mo] + " " + an) +
      "<br>Forfait : " + nb(f.conv.jours, 218) + " jours, période de référence " + ech(b.dit) + "</p>";
    h += "<table><colgroup><col style='width:22%'><col style='width:42%'><col style='width:36%'></colgroup>";
    h += "<thead><tr>" + T[0].map(function (c) { return "<th>" + ech(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>";
    T.slice(1).forEach(function (l) {
      h += "<tr>" + l.map(function (c) { return "<td>" + ech(c) + "</td>"; }).join("") + "</tr>";
    });
    h += "</tbody></table>";
    h += '<p class="tot"><b>Depuis le début de la période : ' + String(t.travail).replace(".", ",") +
      " journées travaillées, " + t.repos + " jours de repos du forfait pris, " + t.conge +
      " congés payés.</b>" +
      (x.clos && x.clos.le ? "<br>Mois clos le " + ech(enFrancais(x.clos.le)) + "." : "") + "</p>";
    h += '<div class="sign">Le salarié, qui a renseigné ou vérifié ce document :<br>' +
      "Signature, précédée de la mention « lu et vérifié » :<br><br>" +
      "Pour l'entreprise, " + ech(p.responsable || "") + "<br>Signature :</div>";
    h += '<p class="pied">Établi en application de l\'article L. 3121-65, I, 1° du code du travail. ' +
      "Il appartient à l'employeur de rapporter la preuve qu'il a respecté les stipulations " +
      "destinées à assurer la protection de la santé et de la sécurité du salarié.</p>";
    return h;
  }

  function imprimer() {
    $("impression").innerHTML = feuilleImpression();
    window.print();
  }

  function docControleMois() {
    var f = fiche(), p = entreprise(), T = tableauMois(an, mo);
    var t = compterPeriode(), b = bornesPeriode(), x = moisDe(an, mo);
    var items = [entete(),
      { k: "h1", t: "Document de contrôle du forfait en jours" },
      { k: "p", t: "Salarié : " + qui.nom + (qui.emp ? ", " + qui.emp : "") },
      { k: "p", t: "Mois : " + MOIS[mo] + " " + an },
      { k: "p", t: "Forfait : " + nb(f.conv.jours, 218) + " jours, période de référence " + b.dit },
      { k: "table", head: T[0], rows: T.slice(1) },
      { k: "p", t: "Depuis le début de la période : " + String(t.travail).replace(".", ",") +
        " journées travaillées, " + t.repos + " jours de repos du forfait pris sur " +
        nb(f.conv.repos, 0) + ", " + t.conge + " congés payés." },
    ];
    if (x.clos && x.clos.le) items.push({ k: "note", t: "Mois clos le " + enFrancais(x.clos.le) + "." });
    (x.ouvertures || []).forEach(function (o) {
      items.push({ k: "rouge", t: "Mois rouvert le " + enFrancais(o.le) + ", après une clôture du " +
        enFrancais(o.closLe) + " : " + o.motif + "." });
    });
    items.push({ k: "note", t: "Article L. 3121-65, I, 1° du code du travail : le document fait " +
      "apparaître le nombre et la date des journées ou demi-journées travaillées. Sous la " +
      "responsabilité de l'employeur, il peut être renseigné par le salarié." });
    items.push({ k: "p", t: " " });
    items.push({ k: "p", t: "Le salarié, « lu et vérifié » :" });
    items.push({ k: "p", t: "Pour l'entreprise, " + (p.responsable || "") });
    sortir(items, "Document de contrôle - " + qui.nom + " - " + MOIS[mo] + " " + an,
      "forfait-controle-" + qui.id + "-" + cleMois(an, mo) + ".docx");
  }

  function classeur() {
    if (!window.TableurExport) return;
    var f = fiche(), p = entreprise(), b = bornesPeriode(), t = compterPeriode();
    var L = [
      ["Document de contrôle du forfait en jours"],
      ["Entreprise", p.denomination || ""],
      ["Salarié", qui.nom + (qui.emp ? ", " + qui.emp : "")],
      ["Période de référence", b.dit],
      ["Forfait", String(nb(f.conv.jours, 218)) + " jours"],
      ["Jours de repos du forfait", String(nb(f.conv.repos, 0))],
      [],
      ["Mois", "Jour", "Qualification", "Observation"],
    ];
    var a = b.deb.an, m = b.deb.mo;
    while (a < b.fin.an || (a === b.fin.an && m <= b.fin.mo)) {
      var T = tableauMois(a, m);
      T.slice(1).forEach(function (l, i) {
        L.push([i === 0 ? MOIS[m] + " " + a : "", l[0], l[1], l[2]]);
      });
      m++; if (m > 11) { m = 0; a++; }
    }
    L.push([]);
    L.push(["Journées travaillées", String(t.travail).replace(".", ",")]);
    L.push(["Repos du forfait pris", String(t.repos)]);
    L.push(["Congés payés pris", String(t.conge)]);
    L.push(["Jours non qualifiés", String(t.vides)]);
    L.push(["Plus longue suite de jours travaillés", String(t.pire)]);
    L.push([]);
    L.push(["Établi en application de l'article L. 3121-65, I, 1° du code du travail."]);

    var feuilles = [{ titre: "Contrôle", lignes: L, largeurs: [18, 14, 28, 28] }];
    if ((f.entretiens || []).length) {
      var E = [["Entretiens annuels"], [], ["Date", "Charge déclarée", "Ce qui a été dit", "Mesures décidées"]];
      f.entretiens.forEach(function (e) {
        E.push([enFrancais(e.le), e.charge || "", e.dit || "", e.mesures || ""]);
      });
      feuilles.push({ titre: "Entretiens", lignes: E, largeurs: [16, 18, 46, 46] });
    }
    window.TableurExport.telecharger(window.TableurExport.xlsx(feuilles),
      "forfait-" + qui.id + "-" + b.a + ".xlsx");
  }

  /* ═══════════════════════════ l'aiguillage ══════════════════════════════ */

  function poserReponse(r) {
    var f = fiche();
    f.rep = r;
    garderFiche(f);
    rendreTout();
    var cible = r === "non" ? "br-non" : "br-oui";
    setTimeout(function () {
      if ($(cible)) $(cible).scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  function majSuiviVisible() {
    var f = fiche();
    var ouvert = f.rep === "oui" ||
      (f.rep === "non" && !!f.conv.signee);
    $("br-suivi").hidden = !ouvert;
    if (ouvert) { dessinerJours(); majCompteurs(); rendreEntretiens(); }
  }

  function rendreIdentite() {
    var l = [], f = fiche();
    if (qui.emp) l.push(["Emploi", qui.emp]);
    if (qui.qua) l.push(["Qualification", qui.qua]);
    if (qui.ent) l.push(["Entrée", enFrancais(qui.ent) || qui.ent]);
    var p = entreprise();
    if (p.conventionCollective) l.push(["Convention collective", p.conventionCollective]);
    l.push(["Effectif", String(effectif() || "non renseigné")]);
    if (f.conv.jours) l.push(["Forfait", f.conv.jours + " jours"]);
    $("identite").innerHTML = l.map(function (x) {
      return '<div class="l"><span class="q">' + ech(x[0]) + '</span><span class="v">' +
        ech(x[1]) + "</span></div>";
    }).join("");
  }

  function rendreTout() {
    var f = fiche();
    rendreIdentite();
    var repondu = f.rep === "oui" || f.rep === "non";
    $("q-entree").hidden = repondu;
    $("q-rappel").hidden = !repondu;
    $("q-dit").textContent = f.rep === "oui"
      ? "Convention signée : on la contrôle."
      : (f.rep === "non" ? "Pas de convention : on la construit." : "");
    $("br-non").hidden = f.rep !== "non";
    $("br-non2").hidden = f.rep !== "non";
    $("br-oui").hidden = f.rep !== "oui";
    /* Les chiffres de la convention servent aux deux branches : sans eux, le
       suivi compterait des jours de repos qu'il ne connaît pas. */
    $("br-param").hidden = !repondu;
    if (repondu) rendreJours();
    if (f.rep === "non") {
      rendreEligibilite();
      rendreAccord();
      rendreConvention();
    }
    if (f.rep === "oui") rendreControle();
    majSuiviVisible();
  }

  /* ──────────────────────────────── branchements ────────────────────────── */

  function demarrer() {
    GENS = salaries();
    var p = entreprise();
    if ($("ent")) $("ent").textContent = p.denomination || "";
    if (!GENS.length) { $("e-vide").hidden = false; return; }
    $("e-tout").hidden = false;

    $("qui").innerHTML = GENS.map(function (s, i) {
      return '<option value="' + i + '">' + ech(s.nom + (s.emp ? ", " + s.emp : "")) + "</option>";
    }).join("");
    qui = GENS[0];

    var n = new Date();
    an = n.getFullYear(); mo = n.getMonth();

    $("qui").addEventListener("change", function () {
      qui = GENS[parseInt($("qui").value, 10) || 0];
      rendreTout();
    });

    $("rep-oui").addEventListener("click", function () { poserReponse("oui"); });
    $("rep-non").addEventListener("click", function () { poserReponse("non"); });
    $("q-changer").addEventListener("click", function () {
      var f = fiche(); delete f.rep; garderFiche(f); rendreTout();
    });

    $("el-cat").addEventListener("change", majEligibilite);
    $("el-auto").addEventListener("change", majEligibilite);

    $("ac-source").addEventListener("change", function () {
      var a = accord(); a.source = $("ac-source").value; garderAccord(a); rendreAccord();
    });
    $("ac-ds").addEventListener("change", function () {
      var a = accord(); a.ds = $("ac-ds").value; garderAccord(a); majVoie(); rendrePlan();
    });
    $("ac-cse").addEventListener("change", function () {
      var a = accord(); a.cse = $("ac-cse").value; garderAccord(a); majVoie(); rendrePlan();
    });

    ["j-an", "j-nb", "j-cp", "j-du", "j-au"].forEach(function (i) {
      $(i).addEventListener("input", function () {
        calculJours();
        if (!$("br-suivi").hidden) majCompteurs();
      });
    });
    $("j-prorata").addEventListener("change", calculJours);

    ["c-forme", "c-effet", "c-fonctions"].forEach(function (i) {
      $(i).addEventListener("input", lireConvention);
      $(i).addEventListener("change", lireConvention);
    });
    ["c-periode", "c-remun"].forEach(function (i) {
      $(i).addEventListener("input", lireParam);
      $(i).addEventListener("change", lireParam);
    });
    $("c-signee").addEventListener("click", function () {
      var f = fiche();
      f.conv.signee = iso(new Date());
      f.ctrl.ecrit = true;
      garderFiche(f);
      majSuiviVisible();
      $("br-suivi").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("p-depart").addEventListener("input", function () {
      var a = accord(); a.depart = $("p-depart").value; garderAccord(a); rendrePlan();
    });
    $("p-depot").addEventListener("input", function () {
      var a = accord(); a.depot = $("p-depot").value; garderAccord(a);
    });
    $("p-recepisse").addEventListener("change", function () {
      var a = accord(); a.recepisse = $("p-recepisse").value; garderAccord(a);
    });

    $("mois-avant").addEventListener("click", function () {
      mo--; if (mo < 0) { mo = 11; an--; } dessinerJours(); majCompteurs();
    });
    $("mois-apres").addEventListener("click", function () {
      mo++; if (mo > 11) { mo = 0; an++; } dessinerJours(); majCompteurs();
    });
    $("s-remplir").addEventListener("click", remplirMois);

    $("s-clore").addEventListener("click", function () {
      var x = moisDe(an, mo);
      if (x.clos && x.clos.le) return;
      var trou = premierNonQualifie();
      if (trou) {
        window.alert("Le " + trou + " " + MOIS[mo] + " n'est pas qualifié. Le document de contrôle " +
          "doit porter la date de chaque journée : on ne clôt pas un mois incomplet.");
        return;
      }
      if (!window.confirm("Clore " + MOIS[mo] + " " + an + " pour " + qui.nom +
        " ? Le mois passe en lecture seule.")) return;
      x.clos = { le: iso(new Date()) };
      garderMois(an, mo, x);
      var f = fiche(); f.ctrl.doc = true; garderFiche(f);
      dessinerJours(); majCompteurs();
    });
    $("s-rouvrir").addEventListener("click", function () {
      var motif = window.prompt("Pourquoi ce mois est-il rouvert, et par qui ?");
      if (!net(motif)) return;
      var x = moisDe(an, mo);
      if (!(x.clos && x.clos.le)) return;
      x.ouvertures.push({ le: iso(new Date()), closLe: x.clos.le, motif: net(motif) });
      delete x.clos;
      garderMois(an, mo, x);
      dessinerJours(); majCompteurs();
    });

    $("e-ok").addEventListener("click", function () {
      var le = net($("e-date").value);
      if (!le) { $("e-date").focus(); return; }
      var f = fiche();
      f.entretiens.unshift({ le: le, charge: $("e-charge").value,
        dit: net($("e-dit").value), mesures: net($("e-mesures").value) });
      f.ctrl.entretien = true;
      garderFiche(f);
      $("e-dit").value = ""; $("e-mesures").value = "";
      rendreEntretiens(); majCompteurs();
    });

    ["r-nb", "r-taux", "r-plafond"].forEach(function (i) {
      $(i).addEventListener("input", majRenonce);
    });
    $("r-ok").addEventListener("click", function () {
      var n2 = nb($("r-nb").value, 0);
      if (!n2) { $("r-nb").focus(); return; }
      var f = fiche();
      f.renonces.unshift({ an: bornesPeriode().a, nb: n2, taux: nb($("r-taux").value, 10),
        plafond: nb($("r-plafond").value, 0) || 235, le: net($("r-date").value) || iso(new Date()) });
      garderFiche(f);
      $("r-nb").value = "";
      majCompteurs();
    });

    $("d-accord").addEventListener("click", docAccord);
    $("d-vote").addEventListener("click", docVote);
    $("d-conv").addEventListener("click", docConvention);
    $("d-decharge").addEventListener("click", docDecharge);
    $("d-cse").addEventListener("click", docCse);
    $("d-notif").addEventListener("click", docNotification);
    $("d-greffe").addEventListener("click", docGreffe);
    $("d-entretien").addEventListener("click", docEntretien);
    $("d-renonce").addEventListener("click", docRenonce);
    $("d-audit").addEventListener("click", docAudit);
    $("b-imprimer").addEventListener("click", imprimer);
    $("b-word").addEventListener("click", docControleMois);
    $("b-excel").addEventListener("click", classeur);

    /* Le module s'ouvre parfois depuis l'audit, qui a déjà posé la question :
       « Oui » et « Non » arrivent alors dans l'adresse. */
    var rep = /[?&]rep=(oui|non)/.exec(window.location.search);
    if (rep) poserReponse(rep[1]);
    else rendreTout();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
