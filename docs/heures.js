/* LE DÉCOMPTE MENSUEL DES HEURES.

   Le détail de ce que l'écran fait et des textes qui le commandent est en tête
   de heures.html. Ici, la mécanique.

   Ce qui est gardé sur le poste, sous trois clés :

     registre-personnel   les salariés, écrits ailleurs, seulement lus ici
     heures-reference     par salarié, l'horaire du contrat { d, f, p, jours }
     heures-decompte      par salarié et par mois, les jours, le total retenu,
                          la clôture, les rectificatifs, les réclamations

   Une règle tient tout le reste : après clôture, rien ne s'écrase. Le mois
   passe en lecture seule, son empreinte est calculée sur ses lignes, et une
   correction ouvre un rectificatif daté à côté de l'original.               */

"use strict";
(function (window, document) {

  var CLE_REG = "registre-personnel";
  var CLE_REF = "heures-reference";
  var CLE_DEC = "heures-decompte";

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"];
  var COURT = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  var LETTRE = ["D", "L", "M", "M", "J", "V", "S"];
  /* LES HORAIRES TYPES. Ils ne sont qu'un pré-remplissage : trois champs
     posés d'un geste, que l'on corrige aussitôt si le contrat dit autre chose.
     Aucun n'est présenté comme une règle, et la semaine qu'il donne s'affiche
     au-dessus, calculée sur les jours cochés. Demande du 15 septembre 2026. */
  var TYPES = [
    { d: "09:00", f: "17:00", p: 60, lib: "Bureau, 9h00 - 17h00, pause 1 h" },
    { d: "08:00", f: "16:00", p: 60, lib: "Journée continue, 8h00 - 16h00, pause 1 h" },
    { d: "08:00", f: "17:00", p: 60, lib: "Journée longue, 8h00 - 17h00, pause 1 h" },
    { d: "06:00", f: "14:00", p: 30, lib: "Équipe du matin, 6h00 - 14h00, pause 30 min" },
    { d: "14:00", f: "22:00", p: 30, lib: "Équipe d'après-midi, 14h00 - 22h00, pause 30 min" },
    { d: "21:00", f: "06:00", p: 45, lib: "Équipe de nuit, 21h00 - 6h00, pause 45 min" },
    { d: "09:00", f: "15:00", p: 30, lib: "Temps partiel, 9h00 - 15h00, pause 30 min" },
  ];

  var NATURES = [
    ["travail", "Travail"], ["repos", "Repos"], ["conge", "Congé payé"],
    ["maladie", "Maladie"], ["ferie", "Férié"], ["absence", "Absence"],
  ];
  var LIB = {};
  NATURES.forEach(function (n) { LIB[n[0]] = n[1]; });

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
  function nbh(n) { return n.toFixed(2).replace(".", ",") + " h"; }
  function enFrancais(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
    if (!m) return "";
    var j = parseInt(m[3], 10);
    return (j === 1 ? "1er" : j) + " " + MOIS[parseInt(m[2], 10) - 1] + " " + m[1];
  }
  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }

  /* « 8 », « 830 », « 8h30 », « 08:30 » donnent tous 08:30 : la secrétaire
     tape au clavier numérique, sans chercher les deux points. */
  function normaliser(v) {
    var c = String(v == null ? "" : v).replace(/[^0-9]/g, "");
    if (!c) return "";
    var h, m;
    if (c.length <= 2) { h = parseInt(c, 10); m = 0; }
    else if (c.length === 3) { h = parseInt(c.slice(0, 1), 10); m = parseInt(c.slice(1), 10); }
    else { h = parseInt(c.slice(0, 2), 10); m = parseInt(c.slice(2, 4), 10); }
    if (h > 23) h = 23;
    if (m > 59) m = 59;
    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2);
  }
  function enMinutes(t) {
    var m = /^(\d{1,2})[:hH.]?(\d{2})?$/.exec(String(t == null ? "" : t).trim());
    return m ? parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0) : null;
  }
  function duree(l) {
    if (!l || l.n !== "travail") return 0;
    var a = enMinutes(l.d), b = enMinutes(l.f);
    if (a === null || b === null) return 0;
    /* Une fin plus petite que le début est une nuit qui passe minuit : 21h00
       à 6h00 fait neuf heures, pas moins que rien. */
    if (b <= a) b += 1440;
    var v = b - a - (parseInt(l.p, 10) || 0);
    return v > 0 ? v / 60 : 0;
  }
  function nombre(v) {
    var s = String(v == null ? "" : v).replace(",", ".").replace(/[^0-9.]/g, "").trim();
    if (!s) return null;
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
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
      return String(s.nom || "").trim() || String(s.pre || "").trim();
    }).map(function (s) {
      var nom = (String(s.nom || "").trim() + " " + String(s.pre || "").trim()).trim();
      return {
        id: sansAccent(nom) || "salarie",
        nom: nom,
        emp: String(s.emp || "").trim(),
        qua: String(s.qua || "").trim(),
        ent: String(s.ent || "").trim(),
        sor: String(s.sor || "").trim(),
        part: s.part === "partiel" ? "Temps partiel" : (s.part === "complet" ? "Temps complet" : ""),
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

  /* ─────────────────────────── l'état de l'écran ────────────────────────── */

  var GENS = [];
  var qui = null;                       /* le salarié affiché               */
  var an, mo;                           /* le mois affiché, mo de 0 à 11    */
  var lignes = [];                      /* les jours du mois, à l'écran     */
  var VERROU = false;                   /* le mois affiché est-il clos      */
  var semaines = [];

  /* LA SEMAINE DE RÉFÉRENCE, JOUR PAR JOUR, AVEC LES COUPURES.

     Un horaire unique pour toute la semaine ne dit pas la restauration : un
     serveur fait 12h00-15h00 et 19h00-23h00 le mardi, 15h30-23h00 le samedi,
     et se repose le lundi et le jeudi. Chaque jour porte donc ses plages, une
     ou deux, et sa pause. L'ancien format, un début, une fin et des jours
     cochés, est repris tel quel à la première lecture. Demande du
     16 septembre 2026, après une convocation fixée un jour de repos. */
  function refDe(id) {
    var t = lireCle(CLE_REF, {});
    var r = t[id] || {};
    var sem = r.sem;
    if (!sem) {
      sem = {};
      var jours = r.jours || { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 0: false };
      for (var k = 0; k < 7; k++) {
        sem[k] = jours[k]
          ? { d1: r.d || "09:00", f1: r.f || "17:00", d2: "", f2: "", p: r.p == null ? "60" : String(r.p) }
          : null;
      }
    }
    for (var j = 0; j < 7; j++) {
      var c = sem[j];
      if (!c) { sem[j] = null; continue; }
      if (c.plages) {
        c.d1 = (c.plages[0] || ["", ""])[0]; c.f1 = (c.plages[0] || ["", ""])[1];
        c.d2 = (c.plages[1] || ["", ""])[0]; c.f2 = (c.plages[1] || ["", ""])[1];
        delete c.plages;
      }
      c.d1 = c.d1 || ""; c.f1 = c.f1 || ""; c.d2 = c.d2 || ""; c.f2 = c.f2 || "";
      if (c.p == null) c.p = "0";
    }
    return { sem: sem, courriel: r.courriel || "" };
  }

  /* Les plages réellement travaillées d'un jour : une, ou deux en coupure. Les
     quatre heures sont gardées telles qu'elles sont tapées, même à moitié :
     sinon la seconde plage disparaîtrait avant d'être finie. */
  function plagesDe(c) {
    if (!c) return [];
    var L = [];
    if (c.d1 && c.f1) L.push([c.d1, c.f1]);
    if (c.d2 && c.f2) L.push([c.d2, c.f2]);
    return L;
  }

  function baseDuJour(c) {
    var plages = plagesDe(c);
    if (!plages.length) return { n: "repos", d: "09:00", f: "17:00", p: "0" };
    var deb = plages[0][0], fin = plages[plages.length - 1][1];
    var a = enMinutes(deb), b = enMinutes(fin);
    if (b <= a) b += 1440;
    var travail = 0;
    plages.forEach(function (x) {
      var d1 = enMinutes(x[0]), f1 = enMinutes(x[1]);
      if (d1 === null || f1 === null) return;
      if (f1 <= d1) f1 += 1440;
      travail += f1 - d1;
    });
    /* Ce qui sépare deux services, la coupure, se compte en pause : la grille du
       mois garde une ligne par jour, et le total de la journée reste juste. */
    var pause = (b - a) - travail + (parseInt(c.p, 10) || 0);
    return { n: "travail", d: deb, f: fin, p: String(pause < 0 ? 0 : pause) };
  }

  function direPlages(c) {
    var plages = plagesDe(c);
    if (!plages.length) return "repos";
    return plages.map(function (x) { return x[0] + " - " + x[1]; }).join(" et ") +
      (parseInt(c.p, 10) ? ", pause " + parseInt(c.p, 10) + " min" : "");
  }

  function garderRef(id, r) {
    var t = lireCle(CLE_REF, {});
    t[id] = r;
    garderCle(CLE_REF, t);
  }
  function cleMois() {
    return qui.id + "|" + an + "-" + ("0" + (mo + 1)).slice(-2);
  }
  function moisDe() {
    var t = lireCle(CLE_DEC, {});
    var m = t[cleMois()] || {};
    m.jours = m.jours || {};
    m.rectifs = m.rectifs || [];
    m.recl = m.recl || [];
    m.ouvertures = m.ouvertures || [];
    return m;
  }
  function garderMois(m) {
    var t = lireCle(CLE_DEC, {});
    t[cleMois()] = m;
    garderCle(CLE_DEC, t);
  }

  /* L'empreinte : de quoi voir qu'une ligne a bougé après la clôture. Ce n'est
     pas une signature, et l'écran ne le dit jamais autrement. */
  function empreinte(m) {
    var s = lignes.map(function (l) {
      return l.j + ":" + l.n + ":" + l.d + ":" + l.f + ":" + l.p;
    }).join("|") + "|" + (m.retenu || "") + "|" + qui.id + "|" + an + "-" + (mo + 1);
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    var t = h.toString(16).toUpperCase();
    while (t.length < 8) t = "0" + t;
    return t.slice(0, 4) + " " + t.slice(4);
  }

  /* ───────────────────────────── construction ───────────────────────────── */

  function construire() {
    var m = moisDe(), r = refDe(qui.id);
    var dernier = new Date(an, mo + 1, 0).getDate();
    lignes = [];
    for (var j = 1; j <= dernier; j++) {
      var sem = new Date(an, mo, j).getDay();
      var base = baseDuJour(r.sem[sem]);
      var saisi = m.jours[String(j)];
      lignes.push({
        j: j, sem: sem, base: base,
        n: saisi ? saisi.n : base.n,
        d: saisi && saisi.d != null ? saisi.d : base.d,
        f: saisi && saisi.f != null ? saisi.f : base.f,
        p: saisi && saisi.p != null ? String(saisi.p) : base.p,
      });
    }
  }
  function modifiee(l) {
    return l.n !== l.base.n || l.d !== l.base.d || l.f !== l.base.f || String(l.p) !== String(l.base.p);
  }
  /* On n'écrit que ce qui s'écarte du contrat : un mois conforme ne pèse rien,
     et changer l'horaire de référence ne réécrit pas les jours déjà corrigés. */
  function enregistrerJour(l) {
    var m = moisDe();
    if (modifiee(l)) m.jours[String(l.j)] = { n: l.n, d: l.d, f: l.f, p: l.p };
    else delete m.jours[String(l.j)];
    garderMois(m);
  }

  /* Le nom d'une case, posé juste au-dessus d'elle. */
  function cap(texte, gauche) {
    var e = document.createElement("span");
    e.className = "cap" + (gauche ? " g" : "");
    e.textContent = texte;
    return e;
  }

  function dessinerJours() {
    var m = moisDe(), verrou = !!(m.clos && m.clos.le);
    VERROU = verrou;
    var hote = $("jours");
    hote.textContent = "";
    semaines = [];
    var courante = null;

    lignes.forEach(function (l, i) {
      if (!courante) courante = { du: l.j, au: l.j, jours: [], noeud: null, cadre: null };
      courante.jours.push(l);
      courante.au = l.j;

      var d = document.createElement("div");
      d.className = "jour" + (l.n === "travail" ? "" : " hors") +
        (modifiee(l) ? " change" : "") + (verrou ? " verrou" : "");

      var q = document.createElement("div");
      q.className = "quand";
      q.textContent = l.j + " " + COURT[l.sem];
      d.appendChild(q);

      var z = document.createElement("div");
      z.className = "saisie";

      /* Les intitulés d'abord, la rangée des cases ensuite : la grille les
         range en deux lignes, et un intitulé qui passe à la ligne ne décale
         pas les cases. */
      z.appendChild(cap("Nature", true));
      if (l.n === "travail") {
        z.appendChild(cap("Début"));
        z.appendChild(cap("Fin"));
        z.appendChild(cap("Pause min"));
      }

      var nat = document.createElement("select");
      nat.id = "n-" + l.j;
      nat.setAttribute("aria-label", "Nature du " + l.j + " " + MOIS[mo]);
      NATURES.forEach(function (o) {
        var op = document.createElement("option");
        op.value = o[0]; op.textContent = o[1];
        if (o[0] === l.n) op.selected = true;
        nat.appendChild(op);
      });
      nat.disabled = verrou;
      nat.addEventListener("change", function () {
        l.n = nat.value; enregistrerJour(l); dessinerJours(); calculer();
      });
      z.appendChild(nat);

      if (l.n === "travail") {
        z.appendChild(champ("d-" + l.j, l.d, "Heure de début du " + l.j, function (v) { l.d = v; }, 5));
        z.appendChild(champ("f-" + l.j, l.f, "Heure de fin du " + l.j, function (v) { l.f = v; }, 5));
        var pau = document.createElement("input");
        pau.type = "text"; pau.inputMode = "numeric"; pau.maxLength = 3;
        pau.id = "p-" + l.j; pau.value = l.p;
        pau.setAttribute("aria-label", "Pause en minutes du " + l.j);
        pau.disabled = verrou;
        pau.addEventListener("input", function () {
          l.p = pau.value.replace(/[^0-9]/g, "");
          enregistrerJour(l); majLigne(d, l); calculer();
        });
        z.appendChild(pau);
      } else {
        z.classList.add("seule");
      }
      d.appendChild(z);

      var h = document.createElement("div");
      h.className = "h";
      d.appendChild(h);
      hote.appendChild(d);
      majLigne(d, l);

      /* La récapitulation de chaque semaine, dimanche ou fin de mois :
         c'est le 2° de l'article D. 3171-8. */
      if (l.sem === 0 || i === lignes.length - 1) {
        var s = document.createElement("div");
        s.className = "semaine";
        s.innerHTML = "<span>Semaine du " + courante.du + " au " + courante.au + " " +
          MOIS[mo] + "</span><b>0,00 h</b>";
        hote.appendChild(s);
        courante.noeud = s.querySelector("b");
        courante.cadre = s;
        semaines.push(courante);
        courante = null;
      }

      function champ(id, val, aria, poser, max) {
        var e = document.createElement("input");
        e.type = "text"; e.id = id; e.value = val;
        e.inputMode = "numeric"; e.maxLength = max; e.placeholder = "08:00";
        e.setAttribute("aria-label", aria);
        e.disabled = verrou;
        e.addEventListener("input", function () { poser(e.value); enregistrerJour(l); majLigne(d, l); calculer(); });
        e.addEventListener("blur", function () {
          e.value = normaliser(e.value); poser(e.value);
          enregistrerJour(l); majLigne(d, l); calculer();
        });
        return e;
      }
    });
  }

  /* Recopier un jour sur tous les jours que le contrat fait travailler. La
     nature de chaque jour ne bouge pas : un congé posé reste un congé. */
  function recopier(modele) {
    if (!window.confirm("Reporter " + modele.d + " - " + modele.f + ", pause " + modele.p +
      " minutes, sur tous les jours travaillés de " + MOIS[mo] + " " + an + " ?")) return;
    var m = moisDe();
    lignes.forEach(function (l) {
      if (l.base.n !== "travail" || l.n !== "travail") return;
      l.d = modele.d; l.f = modele.f; l.p = modele.p;
      if (modifiee(l)) m.jours[String(l.j)] = { n: l.n, d: l.d, f: l.f, p: l.p };
      else delete m.jours[String(l.j)];
    });
    garderMois(m);
    dessinerJours(); calculer();
  }

  function majLigne(noeud, l) {
    /* Le bouton de recopie se pose et se retire au fil de la frappe : il n'a
       de sens que sur un jour qui s'écarte du contrat. */
    var z = noeud.querySelector(".saisie");
    var rep = z ? z.querySelector(".repeter") : null;
    var doitEtre = l.n === "travail" && modifiee(l) && !VERROU;
    if (doitEtre && !rep) {
      rep = document.createElement("button");
      rep.type = "button";
      rep.className = "repeter";
      rep.textContent = "Ces horaires pour tout le mois";
      rep.addEventListener("click", function () { recopier(l); });
      z.appendChild(rep);
    } else if (!doitEtre && rep) {
      rep.parentNode.removeChild(rep);
    }
    var h = noeud.querySelector(".h");
    var v = duree(l);
    h.innerHTML = l.n === "travail"
      ? v.toFixed(2).replace(".", ",") + "<small>heures</small>"
      : "<small>" + ech(LIB[l.n] || "") + "</small>";
    noeud.classList.toggle("change", modifiee(l));
  }

  function totalMois() {
    var t = 0;
    lignes.forEach(function (l) { t += duree(l); });
    return t;
  }
  function hebdoContrat() {
    var r = refDe(qui.id), t = 0;
    for (var k = 0; k < 7; k++) {
      var b = baseDuJour(r.sem[k]);
      if (b.n === "travail") t += duree(b);
    }
    return t;
  }

  function calculer() {
    var total = 0, jours = 0, hebdo = hebdoContrat();
    lignes.forEach(function (l) {
      var v = duree(l);
      if (l.n === "travail" && v > 0) { total += v; jours++; }
    });
    semaines.forEach(function (s) {
      var t = 0;
      s.jours.forEach(function (l) { t += duree(l); });
      if (s.noeud) s.noeud.textContent = nbh(t);
      if (s.cadre) s.cadre.classList.toggle("sup", hebdo > 0 && t > hebdo + 0.001);
    });
    $("t-jours").textContent = jours;
    $("t-calcule").textContent = nbh(total);

    var m = moisDe();
    var n = nombre(m.retenu);
    var e = $("ecart");
    e.classList.remove("ok");
    if (n === null) {
      e.textContent = "Le total retenu n'est pas encore saisi.";
      $("l-motif").hidden = true;
    } else if (Math.abs(n - total) < 0.005) {
      e.textContent = "Le total retenu correspond aux jours saisis.";
      e.classList.add("ok");
      $("l-motif").hidden = true;
    } else {
      var d = n - total;
      e.textContent = "Écart de " + nbh(Math.abs(d)) + (d > 0 ? " en plus" : " en moins") +
        " par rapport aux jours saisis.";
      $("l-motif").hidden = false;
    }
    return total;
  }

  /* ─────────────────────────────── les écrans ───────────────────────────── */

  function rendreIdentite() {
    var l = [];
    if (qui.emp) l.push(["Emploi", qui.emp]);
    if (qui.qua) l.push(["Qualification", qui.qua]);
    if (qui.ent) l.push(["Entrée", enFrancais(qui.ent) || qui.ent]);
    if (qui.sor) l.push(["Sortie", enFrancais(qui.sor) || qui.sor]);
    if (qui.part) l.push(["Temps de travail", qui.part]);
    l.push(["Semaine de référence", nbh(hebdoContrat())]);
    var r = refDe(qui.id);
    for (var k = 1; k <= 7; k++) {
      var j = k % 7, c = r.sem[j];
      if (c) l.push([JOURS_LONG[j], direPlages(c)]);
    }
    $("identite").innerHTML = l.map(function (x) {
      return '<div class="l"><span class="q">' + ech(x[0]) + '</span><span class="v">' + ech(x[1]) + "</span></div>";
    }).join("");
  }

  var JOURS_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  var JOURS_LONG = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  function rendreRef() {
    var r = refDe(qui.id);
    $("s-courriel").value = r.courriel || "";
    $("r-type").innerHTML = '<option value="">- appliquer un horaire type aux jours travaill\u00e9s -</option>' +
      TYPES.map(function (t, i) { return '<option value="' + i + '">' + ech(t.lib) + "</option>"; }).join("");

    var h = "";
    for (var k = 1; k <= 7; k++) {
      var j = k % 7, c = r.sem[j];
      h += '<div class="jsem' + (c ? "" : " hors") + '" data-j="' + j + '">' +
        '<div class="quand">' + JOURS_LONG[j] + "</div>" +
        '<div class="saisie">' +
        '<span class="cap g">Service</span><span class="cap">D\u00e9but</span><span class="cap">Fin</span><span class="cap">Pause min</span>' +
        '<select data-q="etat"><option value="repos"' + (c ? "" : " selected") + ">Repos</option>" +
        '<option value="travail"' + (c ? " selected" : "") + ">Travail</option></select>" +
        (c ? champTexte("d1", c.d1, "12:00") + champTexte("f1", c.f1, "15:00") + champTexte("p", c.p, "0") +
             '<span class="cap g">2e service</span><span class="cap">D\u00e9but</span><span class="cap">Fin</span><span class="cap"></span>' +
             '<span class="lib">coupure</span>' + champTexte("d2", c.d2, "19:00") +
             champTexte("f2", c.f2, "23:00") + "<span></span>"
           : "<span></span><span></span><span></span>") +
        "</div></div>";
    }
    $("r-sem").innerHTML = h;

    Array.prototype.forEach.call($("r-sem").querySelectorAll("[data-q]"), function (el) {
      if (el.tagName === "SELECT") {
        el.addEventListener("change", function () { lireSemaine(true); });
        return;
      }
      el.addEventListener("input", function () {
        if (el.getAttribute("data-q") === "p") el.value = el.value.replace(/[^0-9]/g, "");
        lireSemaine(false);
      });
      el.addEventListener("blur", function () {
        if (el.getAttribute("data-q") !== "p") el.value = normaliser(el.value);
        lireSemaine(false);
      });
    });
  }

  function champTexte(quoi, valeur, invite) {
    return '<input type="text" data-q="' + quoi + '" value="' + ech(valeur || "") +
      '" placeholder="' + invite + '" inputmode="numeric" maxlength="5" aria-label="' + quoi + '">';
  }

  /* On relit les sept jours d'un coup. L'\u00e9diteur n'est redessin\u00e9 que si un jour
     change d'\u00e9tat : sinon la case qu'on remplit dispara\u00eetrait sous les doigts. */
  function lireSemaine(redessiner) {
    var r = refDe(qui.id), sem = {};
    Array.prototype.forEach.call($("r-sem").querySelectorAll(".jsem"), function (bloc) {
      var j = bloc.getAttribute("data-j");
      var v = function (q) {
        var el = bloc.querySelector('[data-q="' + q + '"]');
        return el ? net(el.value) : "";
      };
      if (v("etat") !== "travail") { sem[j] = null; return; }
      var c = { d1: v("d1"), f1: v("f1"), d2: v("d2"), f2: v("f2"), p: v("p") || "0" };
      /* Un jour qui passe de repos \u00e0 travail n'a pas encore d'heures : on lui
         donne celles d'un autre jour travaill\u00e9, sinon 9 heures 17 heures. */
      if (!c.d1 && !c.f1 && !r.sem[j]) {
        var modele = null;
        for (var k = 0; k < 7 && !modele; k++) if (r.sem[k]) modele = r.sem[k];
        c = modele
          ? { d1: modele.d1, f1: modele.f1, d2: modele.d2, f2: modele.f2, p: modele.p }
          : { d1: "09:00", f1: "17:00", d2: "", f2: "", p: "60" };
      }
      sem[j] = c;
    });
    garderRef(qui.id, { sem: sem, courriel: r.courriel });
    construire();
    if (redessiner) rendreRef();
    rendreIdentite(); dessinerJours(); calculer();
  }

  function rendreMois() {
    var m = moisDe(), clos = !!(m.clos && m.clos.le);
    $("mois-nom").textContent = MOIS[mo] + " " + an;
    var suivant = new Date(an, mo + 1, 5);
    $("mois-sous").textContent = clos ? "clos" : "clôture prévue le 5 " + MOIS[suivant.getMonth()] + " " + suivant.getFullYear();
    $("etat").classList.toggle("clos", clos);
    $("etat-txt").textContent = clos ? "Mois clos" : "Mois en cours";
    $("clore").disabled = clos;
    $("clore").textContent = "Clore le mois de " + MOIS[mo];
    $("rectifier").hidden = !clos;
    $("rouvrir").hidden = !clos;
    $("f-rouvrir").hidden = true;
    $("f-rectif").hidden = true;
    $("t-retenu").value = m.retenu || "";
    $("t-retenu").disabled = clos;
    $("t-motif").value = m.motif || "";
    $("t-motif").disabled = clos;
    if (clos) {
      $("sceau").hidden = false;
      $("sceau-d").innerHTML = "Clos le " + ech(enFrancais(m.clos.le)) + " à " + ech(m.clos.heure || "") +
        ". Empreinte des lignes : <code>" + ech(m.clos.empreinte) + "</code>." +
        " Le récapitulatif est à remettre au salarié avec son bulletin, et à faire signer.";
    } else {
      $("sceau").hidden = true;
    }
    /* La date de clôture se choisit : on clôt souvent le 5 du mois suivant,
       parfois plus tard, et la date écrite doit être la vraie. */
    $("cl-date").value = (m.clos && m.clos.le) || iso(new Date());
    $("cl-date").disabled = clos;
    $("x-jour").value = an + "-" + ("0" + (mo + 1)).slice(-2) + "-01";
    if (!$("c-date").value) $("c-date").value = iso(new Date());
    rendreListes(m);
  }

  function rendreListes(m) {
    /* UNE CLÔTURE NE S'EFFACE PAS, ELLE SE LÈVE AU VU DE TOUS.

       Rouvrir un mois clos est possible depuis le 16 septembre 2026, parce
       qu'une erreur de manipulation ne doit pas enfermer un mois entier. Mais
       la réouverture se date, se motive, et reste écrite à côté du sceau
       qu'elle lève : un mois rouvert sans raison se verrait, et c'est bien le
       but. */
    $("ouvertures").innerHTML = (m.ouvertures || []).map(function (o) {
      return '<div class="item"><div class="t">Mois rouvert le ' + ech(enFrancais(o.le)) +
        (o.heure ? " à " + ech(o.heure) : "") + '</div><div class="meta">Il avait été clos le ' +
        ech(enFrancais(o.closLe)) + ", empreinte " + ech(o.empreinte || "") +
        ". Cette mention reste au mois.</div>" +
        '<div class="corps">' + ech(o.motif) + "</div></div>";
    }).join("");

    $("rectifs").innerHTML = (m.rectifs || []).map(function (r) {
      return '<div class="item"><div class="t">Rectificatif du ' + ech(enFrancais(r.jour) || "jour non précisé") +
        '</div><div class="meta">Ajouté le ' + ech(enFrancais(r.le)) +
        ", après clôture. La ligne d'origine reste en place.</div>" +
        '<div class="corps">' + (r.h ? "Heures rectifiées : " + ech(r.h) + " h.\n" : "") + ech(r.motif) + "</div></div>";
    }).join("");

    $("recls").innerHTML = (m.recl || []).map(function (c, i) {
      return '<div class="item recl"><div class="t">Réclamation reçue le ' + ech(enFrancais(c.le) || "date à saisir") +
        '</div><div class="meta">' + ech(MOIS[mo] + " " + an) + (c.h ? ", " + ech(c.h) + " h réclamées" : "") + "</div>" +
        '<div class="corps">' + ech(c.motif) + "</div>" +
        '<div class="rep"><label class="champ"><span>Réponse de l\'entreprise</span>' +
        '<textarea data-recl="' + i + '" placeholder="ce qui est accordé, ce qui est refusé, et sur quelles pièces">' +
        ech(c.reponse || "") + "</textarea></label></div></div>";
    }).join("");
    Array.prototype.forEach.call($("recls").querySelectorAll("textarea"), function (t) {
      t.addEventListener("input", function () {
        var mm = moisDe(), i = parseInt(t.getAttribute("data-recl"), 10);
        if (!mm.recl[i]) return;
        mm.recl[i].reponse = t.value;
        mm.recl[i].repLe = iso(new Date());
        garderMois(mm);
      });
    });
  }

  function tout() {
    construire();
    rendreIdentite();
    rendreRef();
    rendreMois();
    dessinerJours();
    calculer();
  }

  /* ──────────────────────────────── sorties ─────────────────────────────── */

  function tableauMois() {
    var t = [["Jour", "Nature", "Début", "Fin", "Pause (min)", "Heures"]];
    var sem = null, cumul = 0;
    lignes.forEach(function (l, i) {
      if (sem === null) sem = l.j;
      var v = duree(l);
      cumul += v;
      t.push([
        l.j + " " + COURT[l.sem],
        LIB[l.n] || "",
        l.n === "travail" ? l.d : "",
        l.n === "travail" ? l.f : "",
        l.n === "travail" ? String(l.p) : "",
        l.n === "travail" ? v.toFixed(2).replace(".", ",") : "",
      ]);
      if (l.sem === 0 || i === lignes.length - 1) {
        t.push(["Semaine du " + sem + " au " + l.j, "", "", "", "Total semaine", cumul.toFixed(2).replace(".", ",")]);
        sem = null; cumul = 0;
      }
    });
    return t;
  }

  /* ───────────────────── la feuille à signer, et l'e-mail ───────────────── */

  /* Le même relevé que le classeur et le Word, posé en page pour le papier :
     la journée, la semaine, le total, puis la signature. */
  function feuilleImpression() {
    var p = entreprise(), m = moisDe(), r = refDe(qui.id), T = tableauMois();
    var h = '<h1>Décompte des heures de travail</h1>';
    h += '<p class="sous">' + ech(p.denomination || "") + (p.adresse ? " - " + ech(p.adresse) : "") +
      "<br>Salarié : " + ech(qui.nom) + (qui.emp ? ", " + ech(qui.emp) : "") +
      "<br>Mois : " + ech(MOIS[mo] + " " + an) +
      "<br>Horaire de référence : " + ech(r.d + " - " + r.f + ", pause " + r.p + " minutes") + "</p>";
    /* La récapitulation de semaine tient sur une seule cellule : autrement,
       ses quatre cases vides élargissent la colonne du jour et le tableau
       déborde de la page. */
    h += "<table><colgroup>" +
      ["19%", "19%", "14%", "14%", "17%", "17%"].map(function (w) {
        return '<col style="width:' + w + '">'; }).join("") + "</colgroup>";
    h += "<thead><tr>" + T[0].map(function (c) { return "<th>" + ech(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>";
    T.slice(1).forEach(function (l) {
      if (/^Semaine/.test(String(l[0]))) {
        h += '<tr class="sem"><td colspan="4">' + ech(l[0]) + "</td><td>" + ech(l[4]) +
          '</td><td class="n">' + ech(l[5]) + "</td></tr>";
        return;
      }
      h += "<tr>" + l.map(function (c, i) {
        return '<td' + (i === 5 ? ' class="n"' : "") + ">" + ech(c) + "</td>";
      }).join("") + "</tr>";
    });
    h += "</tbody></table>";
    h += '<p class="tot"><b>Total calculé par les jours : ' + ech(nbh(totalMois())) + ".</b>" +
      "<br>Total retenu par l'entreprise : " +
      ech(m.retenu ? nbh(nombre(m.retenu) || 0) : "à compléter") + "." +
      (m.motif ? "<br>Motif de l'écart : " + ech(m.motif) + "." : "") +
      (m.clos && m.clos.le ? "<br>Mois clos le " + ech(enFrancais(m.clos.le)) + " à " +
        ech(m.clos.heure || "") + ", empreinte des lignes " + ech(m.clos.empreinte) + "." : "") + "</p>";
    (m.rectifs || []).forEach(function (x) {
      h += '<p class="tot">Rectificatif du ' + ech(enFrancais(x.jour)) + (x.h ? ", " + ech(x.h) + " h" : "") +
        " : " + ech(x.motif) + " (enregistré le " + ech(enFrancais(x.le)) + ").</p>";
    });
    (m.ouvertures || []).forEach(function (o) {
      h += '<p class="tot">Mois rouvert le ' + ech(enFrancais(o.le)) + (o.heure ? " à " + ech(o.heure) : "") +
        ", après une clôture du " + ech(enFrancais(o.closLe)) + " (empreinte " + ech(o.empreinte || "") +
        ") : " + ech(o.motif) + ".</p>";
    });
    h += '<div class="sign">Remis au salarié le ..............................<br>' +
      "Signature du salarié, précédée de la mention « reçu le » :<br><br>" +
      "Pour l'entreprise, " + ech(p.responsable || "") + "<br>" +
      "Signature :</div>";
    h += '<p class="pied">Établi en application des articles L. 3171-2 et D. 3171-8 du code du travail. ' +
      "La signature du salarié vaut réception du relevé, non renonciation à le contester : une " +
      "réclamation reste possible et se note dans l'écran du décompte.</p>";
    return h;
  }

  function imprimer() {
    $("impression").innerHTML = feuilleImpression();
    window.print();
  }

  /* ENVOYER LE RÉCAPITULATIF.

     Le téléphone sait faire mieux qu'un e-mail : la feuille de partage pose
     le fichier dans Mail, WhatsApp, Messenger ou les Fichiers, au choix. On
     l'utilise quand elle existe. Sinon, on retombe sur le message
     électronique : le fichier se télécharge, et le message s'ouvre prêt, à
     compléter d'une pièce jointe, parce qu'une page web ne peut pas joindre
     un fichier elle-même. */
  function envoyer() {
    var p = entreprise(), m = moisDe();
    var r = refDe(qui.id);
    var adresse = net($("s-courriel").value);
    if (adresse) { r.courriel = adresse; garderRef(qui.id, r); }

    var sujet = "Récapitulatif de vos heures - " + MOIS[mo] + " " + an;
    var corps = [
      "Bonjour,",
      "",
      "Vous trouverez en pièce jointe le récapitulatif de vos heures de travail pour le mois de " +
        MOIS[mo] + " " + an + ".",
      "Total retenu : " + (m.retenu ? nbh(nombre(m.retenu) || 0) : "à compléter") + ".",
      "",
      "Merci de nous le retourner signé. Si une journée vous paraît inexacte, indiquez-le en réponse " +
        "à ce message : votre réclamation sera enregistrée et recevra une réponse écrite.",
      "",
      "Cordialement,",
      (p.responsable || ""),
      (p.denomination || ""),
    ].join("\n");
    var w = construireWord();

    /* La feuille de partage du téléphone, si elle accepte les fichiers. */
    if (w && window.File && navigator.share && navigator.canShare) {
      var fichier = null;
      try {
        fichier = new File([w.octets], w.nom,
          { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      } catch (e) { fichier = null; }
      if (fichier && navigator.canShare({ files: [fichier] })) {
        navigator.share({ files: [fichier], title: sujet, text: corps })
          .catch(function () { /* partage refusé ou annulé : rien à dire */ });
        return;
      }
    }

    if (!adresse) { $("s-courriel").focus(); return; }
    if (w) window.AuditExport.telecharger(w.octets, w.nom,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    var lien = document.createElement("a");
    lien.href = "mailto:" + encodeURIComponent(adresse) +
      "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps);
    lien.rel = "noopener";
    document.body.appendChild(lien);
    lien.click();
    setTimeout(function () { lien.remove(); }, 1000);
  }

  function classeur() {
    if (!window.TableurExport) return;
    var p = entreprise(), m = moisDe();
    var tete = [
      ["Décompte mensuel des heures de travail"],
      ["Entreprise", p.denomination || ""],
      ["Salarié", qui.nom + (qui.emp ? ", " + qui.emp : "")],
      ["Mois", MOIS[mo] + " " + an],
      ["Horaire de référence", refDe(qui.id).d + " - " + refDe(qui.id).f +
        ", pause " + refDe(qui.id).p + " min"],
      [],
    ];
    var pied = [
      [],
      ["Total calculé par les jours", nbh(totalMois())],
      ["Total retenu par l'entreprise", m.retenu ? nbh(nombre(m.retenu) || 0) : "à remplir"],
      ["Motif de l'écart", m.motif || ""],
      ["État du mois", m.clos && m.clos.le
        ? "clos le " + enFrancais(m.clos.le) + ", empreinte " + m.clos.empreinte
        : "en cours"],
      [],
      ["Établi en application des articles L. 3171-2 et D. 3171-8 du code du travail. " +
       "À conserver un an au moins à la disposition de l'inspection du travail (D. 3171-16)."],
    ];
    var feuilles = [{
      titre: "Décompte",
      lignes: tete.concat(tableauMois()).concat(pied),
      largeurs: [26, 22, 12, 12, 14, 12],
    }];

    if ((m.rectifs || []).length || (m.recl || []).length || (m.ouvertures || []).length) {
      var L = [["Rectificatifs, réouvertures et réclamations"], []];
      if ((m.ouvertures || []).length) {
        L.push(["Réouvertures du mois"]);
        L.push(["Rouvert le", "Était clos le", "Empreinte levée", "Motif"]);
        m.ouvertures.forEach(function (o) {
          L.push([enFrancais(o.le) + (o.heure ? " à " + o.heure : ""), enFrancais(o.closLe),
            o.empreinte || "", o.motif || ""]);
        });
        L.push([]);
      }
      if ((m.rectifs || []).length) {
        L.push(["Rectificatifs après clôture"]);
        L.push(["Jour", "Heures rectifiées", "Enregistré le", "Motif"]);
        m.rectifs.forEach(function (r) {
          L.push([enFrancais(r.jour), r.h || "", enFrancais(r.le), r.motif || ""]);
        });
        L.push([]);
      }
      if ((m.recl || []).length) {
        L.push(["Réclamations du salarié"]);
        L.push(["Reçue le", "Heures réclamées", "Motif invoqué", "Réponse de l'entreprise"]);
        m.recl.forEach(function (c) {
          L.push([enFrancais(c.le), c.h || "", c.motif || "", c.reponse || ""]);
        });
      }
      feuilles.push({ titre: "Réclamations", lignes: L, largeurs: [18, 18, 46, 46] });
    }

    var nom = "decompte-heures-" + qui.id + "-" + an + "-" + ("0" + (mo + 1)).slice(-2) + ".xlsx";
    window.TableurExport.telecharger(window.TableurExport.xlsx(feuilles), nom);
  }

  function word() {
    var w = construireWord();
    if (!w) return;
    window.AuditExport.telecharger(w.octets, w.nom,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  }

  function construireWord() {
    if (!window.AuditExport) return null;
    var p = entreprise(), m = moisDe();
    var r = refDe(qui.id);
    var T = tableauMois();
    var items = [
      { k: "sur", t: (p.denomination || "") + (p.adresse ? " - " + p.adresse : "") },
      { k: "h1", t: "Décompte des heures de travail" },
      { k: "p", t: "Salarié : " + qui.nom + (qui.emp ? ", " + qui.emp : "") },
      { k: "p", t: "Mois : " + MOIS[mo] + " " + an },
      { k: "p", t: "Horaire de référence : " + r.d + " - " + r.f + ", pause " + r.p + " minutes." },
      { k: "table", head: T[0], rows: T.slice(1) },
      { k: "p", t: "Total calculé par les jours : " + nbh(totalMois()) + "." },
      { k: "p", t: "Total retenu par l'entreprise : " +
        (m.retenu ? nbh(nombre(m.retenu) || 0) : "à compléter") + "." +
        (m.motif ? " Motif de l'écart : " + m.motif + "." : "") },
    ];
    if (m.clos && m.clos.le) {
      items.push({ k: "note", t: "Mois clos le " + enFrancais(m.clos.le) + " à " + (m.clos.heure || "") +
        ". Empreinte des lignes : " + m.clos.empreinte + "." });
    }
    (m.rectifs || []).forEach(function (x) {
      items.push({ k: "rouge", t: "Rectificatif du " + enFrancais(x.jour) +
        (x.h ? ", " + x.h + " h" : "") + " : " + x.motif + " (enregistré le " + enFrancais(x.le) + ")." });
    });
    (m.ouvertures || []).forEach(function (o) {
      items.push({ k: "rouge", t: "Mois rouvert le " + enFrancais(o.le) + (o.heure ? " à " + o.heure : "") +
        ", après une clôture du " + enFrancais(o.closLe) + " (empreinte " + (o.empreinte || "") + ") : " +
        o.motif + "." });
    });
    items.push({ k: "p", t: "Établi en application des articles L. 3171-2 et D. 3171-8 du code du travail." });
    items.push({ k: "p", t: " " });
    items.push({ k: "p", t: "Remis au salarié le ........................" });
    items.push({ k: "p", t: "Signature du salarié :" });
    items.push({ k: "p", t: "Pour l'entreprise, " + (p.responsable || "") });

    var titre = "Décompte des heures - " + qui.nom + " - " + MOIS[mo] + " " + an;
    var nom = "decompte-heures-" + qui.id + "-" + an + "-" + ("0" + (mo + 1)).slice(-2) + ".docx";
    return { octets: window.AuditExport.docx(items, titre), nom: nom, titre: titre };
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
      tout();
    });
    $("mois-avant").addEventListener("click", function () {
      mo--; if (mo < 0) { mo = 11; an--; } tout(); });
    $("mois-apres").addEventListener("click", function () {
      mo++; if (mo > 11) { mo = 0; an++; } tout(); });

    /* Un horaire type pose les trois champs ; le reste du mois se recalcule,
       et les jours déjà corrigés à la main ne bougent pas. */
    $("r-type").addEventListener("change", function () {
      var i = $("r-type").value;
      if (i === "") return;
      var t = TYPES[parseInt(i, 10)];
      if (!t) return;
      var r = refDe(qui.id), sem = {}, aucun = true;
      for (var k = 0; k < 7; k++) if (r.sem[k]) aucun = false;
      for (var j = 0; j < 7; j++) {
        var travaille = aucun ? (j >= 1 && j <= 5) : !!r.sem[j];
        sem[j] = travaille ? { d1: t.d, f1: t.f, d2: "", f2: "", p: String(t.p) } : null;
      }
      garderRef(qui.id, { sem: sem, courriel: r.courriel });
      $("r-type").value = "";
      construire(); rendreRef(); rendreIdentite(); dessinerJours(); calculer();
    });

    $("t-retenu").addEventListener("input", function () {
      var m = moisDe(); m.retenu = $("t-retenu").value; garderMois(m); calculer();
    });
    $("t-motif").addEventListener("input", function () {
      var m = moisDe(); m.motif = $("t-motif").value; garderMois(m);
    });

    $("clore").addEventListener("click", function () {
      var m = moisDe();
      if (m.clos && m.clos.le) return;
      if (!window.confirm("Clore " + MOIS[mo] + " " + an + " pour " + qui.nom +
        " ? Le mois passe en lecture seule ; ensuite, une correction ne peut plus " +
        "qu'ouvrir un rectificatif daté.")) return;
      var d = new Date();
      m.clos = {
        le: $("cl-date").value || iso(d),
        heure: ("0" + d.getHours()).slice(-2) + "h" + ("0" + d.getMinutes()).slice(-2),
        empreinte: empreinte(m),
      };
      garderMois(m);
      rendreMois(); dessinerJours(); calculer();
      $("sceau").scrollIntoView({ behavior: "smooth", block: "center" });
    });

    $("rouvrir").addEventListener("click", function () {
      $("f-rouvrir").hidden = !$("f-rouvrir").hidden;
      if (!$("f-rouvrir").hidden) $("o-motif").focus();
    });
    $("o-ok").addEventListener("click", function () {
      var motif = $("o-motif").value.trim();
      if (!motif) { $("o-motif").focus(); return; }
      var m = moisDe();
      if (!(m.clos && m.clos.le)) { $("f-rouvrir").hidden = true; return; }
      var d = new Date();
      m.ouvertures.push({
        le: iso(d),
        heure: ("0" + d.getHours()).slice(-2) + "h" + ("0" + d.getMinutes()).slice(-2),
        closLe: m.clos.le, empreinte: m.clos.empreinte, motif: motif,
      });
      delete m.clos;
      garderMois(m);
      $("o-motif").value = "";
      rendreMois(); dessinerJours(); calculer();
    });

    $("rectifier").addEventListener("click", function () {
      $("f-rectif").hidden = !$("f-rectif").hidden;
      if (!$("f-rectif").hidden) $("x-motif").focus();
    });
    $("x-ok").addEventListener("click", function () {
      var motif = $("x-motif").value.trim();
      if (!motif) { $("x-motif").focus(); return; }
      var m = moisDe();
      m.rectifs.push({ le: iso(new Date()), jour: $("x-jour").value, h: $("x-h").value.trim(), motif: motif });
      garderMois(m);
      $("x-motif").value = ""; $("x-h").value = "";
      $("f-rectif").hidden = true;
      rendreListes(m);
    });

    $("c-ok").addEventListener("click", function () {
      var motif = $("c-motif").value.trim();
      if (!motif) { $("c-motif").focus(); return; }
      var m = moisDe();
      m.recl.push({ le: $("c-date").value || iso(new Date()), h: $("c-h").value.trim(), motif: motif, reponse: "" });
      garderMois(m);
      $("c-motif").value = ""; $("c-h").value = "";
      rendreListes(m);
    });

    $("b-imprimer").addEventListener("click", imprimer);
    $("b-mail").addEventListener("click", envoyer);
    $("s-courriel").addEventListener("input", function () {
      var r = refDe(qui.id);
      r.courriel = $("s-courriel").value;
      garderRef(qui.id, r);
    });
    $("b-excel").addEventListener("click", classeur);
    $("b-word").addEventListener("click", word);

    tout();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
