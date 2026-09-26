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

  /* L'HORAIRE DE LA SEMAINE EN UNE PHRASE.

     Le récapitulatif Word écrivait encore « r.d - r.f, pause r.p », c'est-à-dire
     l'ancien modèle à trois champs : depuis que la référence se tient jour par
     jour, avec les coupures, ces trois-là n'existent plus et le document sortait
     « undefined - undefined ». Les jours qui portent le même horaire se
     regroupent, sinon la phrase ferait sept lignes. */
  function bas(j) { return JOURS_LONG[j].toLowerCase(); }
  function direSemaine(r) {
    var ordre = [1, 2, 3, 4, 5, 6, 0], blocs = [], en = null;
    ordre.forEach(function (j) {
      var dit = direPlages(r.sem && r.sem[j]);
      if (en && en.dit === dit) { en.fin = j; return; }
      en = { dit: dit, deb: j, fin: j };
      blocs.push(en);
    });
    function quand(b, article) {
      if (b.deb === b.fin) return (article ? "le " : "") + bas(b.deb);
      var i = ordre.indexOf(b.deb), k = ordre.indexOf(b.fin);
      if (k - i === 1) return bas(b.deb) + " et " + bas(b.fin);
      return "du " + bas(b.deb) + " au " + bas(b.fin);
    }
    var L = blocs.filter(function (b) { return b.dit !== "repos"; }).map(function (b) {
      return quand(b, true) + ", " + b.dit;
    });
    var repos = blocs.filter(function (b) { return b.dit === "repos"; }).map(function (b) {
      return quand(b, false);
    });
    if (!L.length) return "aucun horaire de référence n'est renseigné.";
    return L.join(" ; ") + (repos.length ? ". Repos : " + repos.join(", ") + "." : ".");
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

  /* HORS CONTRAT : AVANT L'ENTRÉE, APRÈS LA SORTIE.

     Une salariée sortie le 1er août portait vingt-deux jours et cent
     cinquante-quatre heures au mois de septembre, parce que l'horaire de
     référence se recopiait sur tout le mois sans regarder le registre. Un
     mois scellé sur ces heures-là devient une pièce opposable. Relevé le
     26 septembre 2026. Ces jours ne se saisissent plus, ne comptent pas, et
     le disent. */
  function horsContrat(j) {
    var d = new Date(an, mo, j), e = null, so = null;
    if (qui && net(qui.ent)) e = new Date(net(qui.ent) + "T00:00:00");
    if (qui && net(qui.sor)) so = new Date(net(qui.sor) + "T00:00:00");
    if (e && !isNaN(e) && d < e) return "avant l'entrée";
    if (so && !isNaN(so) && d > so) return "après la sortie";
    return "";
  }

  function construire() {
    var m = moisDe(), r = refDe(qui.id);
    var dernier = new Date(an, mo + 1, 0).getDate();
    lignes = [];
    for (var j = 1; j <= dernier; j++) {
      var sem = new Date(an, mo, j).getDay();
      var base = baseDuJour(r.sem[sem]);
      var saisi = m.jours[String(j)];
      var hc = horsContrat(j);
      lignes.push({
        j: j, sem: sem, base: base, hc: hc,
        n: hc ? "repos" : (saisi ? saisi.n : base.n),
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
        (modifiee(l) ? " change" : "") + (verrou || l.hc ? " verrou" : "") +
        (l.hc ? " hc" : "");

      var q = document.createElement("div");
      q.className = "quand";
      q.textContent = l.j + " " + COURT[l.sem];
      /* Le jour qui n'est pas dans le contrat le dit et ne s'ouvre pas. */
      if (l.hc) {
        var mq = document.createElement("small");
        mq.className = "hcq";
        mq.textContent = l.hc;
        q.appendChild(mq);
      }
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
      nat.disabled = verrou || !!l.hc;
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
        pau.disabled = verrou || !!l.hc;
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
      l.noeud = d;            /* pour marquer la journée qui passe le plafond */
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
        e.disabled = verrou || !!l.hc;
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
  /* CE QUE LE CONTRAT DIT, QUAND IL A ÉTÉ ÉCRIT ICI.

     Le module des contrats du transport écrit la durée de service du poste,
     hebdomadaire et mensuelle : 39 heures et 169 heures pour un conducteur
     de courte distance, 43 et 186 pour un grand routier. Le décompte les
     ignorait et pré-remplissait une semaine de bureau, 9 heures à 17 heures
     du lundi au vendredi : le relevé signé annonçait 154 heures là où le
     contrat en porte 169. Relevé le 26 septembre 2026.

     Rien n'est inventé pour autant : l'horaire de chaque journée reste à
     saisir, parce que personne ici ne sait à quelle heure le camion est
     parti. Ce qui est repris du contrat, c'est la durée due, en face de
     laquelle le mois compté se lit. */
  function duContrat() {
    if (!qui || !window.EcheancesSalaries) return null;
    var su = window.EcheancesSalaries.suite(qui.id) || {};
    var sem = parseFloat(String(su.heuresSemaine || "").replace(",", "."));
    var mois = parseFloat(String(su.heuresMois || "").replace(",", "."));
    if (!isFinite(sem) && !isFinite(mois)) return null;
    return { sem: isFinite(sem) ? sem : 0, mois: isFinite(mois) ? mois : 0,
      quoi: String(su.dureeQuoi || "durée du contrat") };
  }

  function hebdoContrat() {
    var c = duContrat();
    if (c && c.sem > 0) return c.sem;
    var r = refDe(qui.id), t = 0;
    for (var k = 0; k < 7; k++) {
      var b = baseDuJour(r.sem[k]);
      if (b.n === "travail") t += duree(b);
    }
    return t;
  }

  /* ─────────── AU-DELÀ DE TRENTE-CINQ HEURES, ET LES PLAFONDS ──────────── */
  /* Le décompte additionnait les journées et s'arrêtait là. Il ne disait ni
     combien d'heures dépassaient la durée légale, ni qu'une journée de treize
     heures ou une semaine de cinquante-quatre heures est interdite. Relevé le
     26 septembre 2026 : un relevé qui ne dit pas cela laisse signer
     l'irrégularité.

     LES TEXTES, lus à la source au relais Légifrance le 26 septembre 2026,
     deux lectures espacées et concordantes chacun :

       - L. 3121-27 (LEGIARTI000033020376) : « La durée légale de travail
         effectif des salariés à temps complet est fixée à trente-cinq heures
         par semaine. »
       - L. 3121-28 (LEGIARTI000033020373) : « Toute heure accomplie au delà
         de la durée légale hebdomadaire ou de la durée considérée comme
         équivalente est une heure supplémentaire qui ouvre droit à une
         majoration salariale ou, le cas échéant, à un repos compensateur
         équivalent. »
       - L. 3121-36 (LEGIARTI000033020341) : « A défaut d'accord, les heures
         supplémentaires accomplies au-delà de la durée légale hebdomadaire
         fixée à l'article L. 3121-27 ou de la durée considérée comme
         équivalente donnent lieu à une majoration de salaire de 25 % pour
         chacune des huit premières heures supplémentaires. Les heures
         suivantes donnent lieu à une majoration de 50 %. »
       - L. 3121-18 (LEGIARTI000033020428) : dix heures par jour, sauf
         dérogation de l'inspecteur du travail, urgence, ou les cas de
         L. 3121-19.
       - L. 3121-20 (LEGIARTI000033020414) : « Au cours d'une même semaine, la
         durée maximale hebdomadaire de travail est de quarante-huit heures. »
       - L. 3121-22 (LEGIARTI000033020402) : quarante-quatre heures en moyenne
         sur douze semaines consécutives. Douze semaines ne tiennent pas dans
         un mois : cette moyenne-là n'est donc pas calculée ici, elle est
         nommée.
       - R. 3312-51 du code des transports (LEGIARTI000033450339) : « La durée
         quotidienne du temps de service ne peut excéder douze heures pour le
         personnel roulant. »
       - R. 3312-50 du code des transports (LEGIARTI000033450337) : cinquante-
         six heures sur une semaine isolée pour le grand routier, cinquante-
         deux pour les autres roulants marchandises, quarante-huit pour la
         messagerie et les convoyeurs de fonds.

     CE QUI N'EST PAS ÉCRIT ICI, ET POURQUOI. Le taux de majoration de
     L. 3121-36 ne vaut qu'« à défaut d'accord » : l'accord d'entreprise ou la
     convention collective peuvent en fixer un autre, et celle des transports
     routiers n'est pas lue ici. Les heures au-delà de trente-cinq heures sont
     donc comptées, jamais valorisées en euros. De même, le régime
     d'équivalence de L. 3121-13 et le temps de service du transport ne se
     déduisent pas d'un horaire : ce qui est comparé, c'est ce qui est saisi. */

  var LEGALE = 35;
  /* LE SEUIL AU-DELÀ DUQUEL L'HEURE EST SUPPLÉMENTAIRE N'EST PAS LE MÊME.

     Pour un roulant, ce n'est pas trente-cinq heures : « Est considérée comme
     heure supplémentaire, pour les personnels roulants, toute heure de temps
     de service assurée au-delà des durées mentionnées à l'article
     D. 3312-45 » (R. 3312-47, LEGIARTI000033450331). Et D. 3312-45
     (LEGIARTI000033450327) fixe ce temps de service à quarante-trois heures
     par semaine pour le grand routier, trente-neuf pour les autres roulants
     marchandises, trente-cinq pour la messagerie et les convoyeurs de fonds.
     Compter les heures d'un grand routier à partir de trente-cinq heures,
     c'était lui en compter huit de trop chaque semaine.

     La catégorie vient du contrat écrit ici, pas d'une supposition sur
     l'emploi : sans elle, ce sont le seuil et les plafonds du code du travail.
     Lectures faites au relais Légifrance le 26 septembre 2026, deux fois
     chacune. */
  var PLAFONDS_TRANSPORT = {
    grand: { sem: 56, jour: 12, seuil: 43, trimestre: 559,
      dit: "personnel roulant grand routier ou longue distance" },
    courte: { sem: 52, jour: 12, seuil: 39, trimestre: 507,
      dit: "autre personnel roulant marchandises" },
    messagerie: { sem: 48, jour: 12, seuil: 35, trimestre: 455,
      dit: "conducteur de messagerie ou convoyeur de fonds" },
  };
  function plafonds() {
    var su = (qui && window.EcheancesSalaries) ? (window.EcheancesSalaries.suite(qui.id) || {}) : {};
    var p = PLAFONDS_TRANSPORT[net(su.categorieTransport)];
    if (p) return { jour: p.jour, sem: p.sem, seuil: p.seuil, trimestre: p.trimestre,
      roulant: true, dit: p.dit,
      source: "R. 3312-51 et R. 3312-50 du code des transports",
      sourceSeuil: "D. 3312-45 et R. 3312-47 du code des transports" };
    return { jour: 10, sem: 48, seuil: LEGALE, trimestre: null, roulant: false, dit: "",
      source: "L. 3121-18 et L. 3121-20 du code du travail",
      sourceSeuil: "L. 3121-27 et L. 3121-28 du code du travail" };
  }

  /* Une semaine du mois n'est complète que si ses sept jours y sont : celles
     du premier et du dernier jour débordent sur le mois voisin, et un total
     de quatre jours ne se compare à aucun plafond hebdomadaire. */
  function analyse() {
    var pl = plafonds(), out = { pl: pl, jours: [], semaines: [], hs: 0, a25: 0, a50: 0, partielles: 0 };
    lignes.forEach(function (l) {
      var v = duree(l);
      if (v > pl.jour + 0.001) out.jours.push({ j: l.j, h: v });
    });
    semaines.forEach(function (s) {
      var t = 0;
      s.jours.forEach(function (l) { t += duree(l); });
      var complete = s.jours.length === 7;
      if (!complete) { out.partielles++; }
      out.semaines.push({ du: s.du, au: s.au, h: t, complete: complete,
        depasse: complete && t > pl.sem + 0.001 });
      if (complete && t > pl.seuil + 0.001) {
        var sup = t - pl.seuil;
        out.hs += sup;
        out.a25 += Math.min(sup, 8);
        out.a50 += Math.max(0, sup - 8);
      }
    });
    /* Le mois garde ce qu'il a compté : c'est ce qui permet au trimestre et à
       l'année de s'additionner sans recalculer des mois qu'on n'a pas
       ouverts. Seuls les mois tenus ici comptent, et l'écran le dit. */
    var m = moisDe();
    var avant = JSON.stringify([m.calcul, m.hs, m.seuil]);
    m.calcul = Math.round(totalMois() * 100) / 100;
    m.hs = Math.round(out.hs * 100) / 100;
    m.seuil = pl.seuil;
    if (JSON.stringify([m.calcul, m.hs, m.seuil]) !== avant) garderMois(m);
    return out;
  }

  /* CE QUE LE TRIMESTRE ET L'ANNÉE DOIVENT AU MOIS.

     Le repos compensateur du transport se compte par trimestre (R. 3312-48,
     LEGIARTI000033450333) : une journée de la quarante-et-unième à la
     soixante-dix-neuvième heure supplémentaire, une journée et demie de la
     quatre-vingtième à la cent-huitième, deux journées et demie au-delà. Le
     contingent du code du travail se compte par année civile : deux cent
     vingt heures à défaut d'accord (D. 3121-24, LEGIARTI000033509251), et
     au-delà s'ouvre la contrepartie obligatoire en repos (L. 3121-30,
     LEGIARTI000033020367), fixée à défaut d'accord à 100 % des heures pour
     les entreprises de plus de vingt salariés, 50 % au plus vingt
     (L. 3121-38, LEGIARTI000038610163). */
  function cumul(depuisMois, jusquaMois) {
    var t = lireCle(CLE_DEC, {}), total = 0, tenus = [], manquants = [];
    for (var k = depuisMois; k <= jusquaMois; k++) {
      var cle = qui.id + "|" + an + "-" + ("0" + (k + 1)).slice(-2);
      var m = t[cle];
      if (m && typeof m.hs === "number") { total += m.hs; tenus.push(k); }
      else manquants.push(k);
    }
    return { hs: Math.round(total * 100) / 100, tenus: tenus, manquants: manquants };
  }
  function reposTrimestre(hs) {
    if (hs <= 40) return 0;
    if (hs <= 79) return 1;
    if (hs <= 108) return 1.5;
    return 2.5;
  }
  function contingent() {
    var c = cumul(0, 11), p = entreprise();
    var eff = parseInt(String(p.effectif || "").replace(/[^0-9]/g, ""), 10);
    var taux = isFinite(eff) && eff <= 20 ? 50 : 100;
    return { hs: c.hs, manquants: c.manquants, taux: taux,
      audela: Math.max(0, Math.round((c.hs - 220) * 100) / 100) };
  }

  /* Ce que l'écran en dit : des phrases, pas un tableau de bord. Ce qui est
     franchi est dit en premier, avec le jour et le chiffre. */
  function leJourDit(j) { return j === 1 ? "le 1er" : "le " + j; }

  function rendreControles() {
    var z = $("controles");
    if (!z) return;
    var a = analyse(), L = [];
    /* Les journées franchies sont marquées dans la grille : la phrase n'en
       nomme que quatre au plus, sinon elle fait un mur de texte sur un
       téléphone. Le papier et le classeur, eux, les portent toutes. */
    lignes.forEach(function (l) {
      if (l.noeud) l.noeud.classList.toggle("trop", duree(l) > a.pl.jour + 0.001);
    });
    if (a.jours.length) {
      var dits = a.jours.slice(0, 4).map(function (x) { return leJourDit(x.j) + " (" + nbh(x.h) + ")"; });
      L.push('<p class="al rouge">' + (a.jours.length === 1
        ? "Une journée dépasse " + a.pl.jour + " heures : " + dits[0]
        : a.jours.length + " journées dépassent " + a.pl.jour + " heures, dont " + dits.join(", ") +
          (a.jours.length > 4 ? ", et " + (a.jours.length - 4) + " autres marquées dans la grille" : "")) +
        ". Plafond de " + ech(a.pl.source.split(" et ")[0]) + ".</p>");
    }
    var dep = a.semaines.filter(function (x) { return x.depasse; });
    if (dep.length) {
      L.push('<p class="al rouge">' + (dep.length === 1 ? "Une semaine dépasse " : dep.length +
        " semaines dépassent ") + a.pl.sem + " heures : " +
        dep.map(function (x) { return "du " + (x.du === 1 ? "1er" : x.du) + " au " + x.au +
          " (" + nbh(x.h) + ")"; }).join(", ") + ".</p>");
    }
    if (a.hs > 0.005) {
      L.push('<p class="al">Heures supplémentaires des semaines entières du mois, au-delà de ' +
        a.pl.seuil + " heures : " + nbh(a.hs) + ", dont " + nbh(a.a25) +
        " dans les huit premières heures de chaque semaine et " + nbh(a.a50) + " au-delà.</p>");
    } else if (!a.jours.length && !dep.length) {
      L.push('<p class="doux">Aucun dépassement des plafonds sur ce mois, et aucune semaine ' +
        "entière au-delà de trente-cinq heures.</p>");
    }
    if (a.partielles) {
      L.push('<p class="doux">' + (a.partielles > 1
        ? a.partielles + " semaines chevauchent le mois voisin : leurs totaux ne sont pas comparés"
        : "Une semaine chevauche le mois voisin : son total n'est pas comparé") +
        " aux plafonds hebdomadaires, il se vérifie avec l'autre mois.</p>");
    }
    /* LE REPOS QUI S'OUVRE, ET CE QUI MANQUE POUR LE DIRE.

       Le repos compensateur ne se lit ni au jour ni à la semaine : au
       trimestre pour un roulant, à l'année pour le contingent. Les mois qui
       n'ont pas été tenus ici ne sont pas devinés, ils sont nommés. */
    var tri = Math.floor(mo / 3);
    var c = cumul(tri * 3, tri * 3 + 2);
    if (a.pl.roulant) {
      var jRepos = reposTrimestre(c.hs);
      L.push('<p class="al">Trimestre ' + (tri + 1) + " (" + MOIS[tri * 3] + " à " +
        MOIS[tri * 3 + 2] + ") : " + nbh(c.hs) + " d'heures supplémentaires" +
        (jRepos ? ", soit " + String(jRepos).replace(".", ",") + " jour" + (jRepos > 1 ? "s" : "") +
          " de repos compensateur trimestriel (R. 3312-48)." : ", pas encore de repos compensateur " +
          "trimestriel : il s'ouvre à la quarante et unième heure (R. 3312-48).") + "</p>");
    } else {
      var ct = contingent();
      L.push('<p class="al">Année ' + an + " : " + nbh(ct.hs) + " d'heures supplémentaires sur " +
        "les mois tenus ici" + (ct.audela > 0
          ? ", soit " + nbh(ct.audela) + " au-delà du contingent de 220 heures : ces heures ouvrent " +
            "une contrepartie obligatoire en repos de " + ct.taux + " % (L. 3121-30, L. 3121-38, " +
            "D. 3121-24, à défaut d'accord)."
          : ", sur un contingent de 220 heures à défaut d'accord (D. 3121-24).") + "</p>");
    }
    if (c.manquants.length) {
      L.push('<p class="doux">Mois du trimestre qui ne sont pas tenus ici : ' +
        c.manquants.map(function (k) { return MOIS[k]; }).join(", ") +
        ". Ils ne sont pas comptés, et rien n'est supposé à leur place.</p>");
    }

    /* CE QUI FONDE CES CHIFFRES SE REPLIE.

       Les quatre paragraphes de droit faisaient huit cents pixels de texte sur
       un téléphone, au-dessus de la ligne qui compte. Ils restent, derrière un
       repli : ce qui est franchi se lit d'abord, le fondement se touche.
       Relevé le 26 septembre 2026. */
    L.push('<details class="loi"><summary>Ce qui fonde ces plafonds</summary><div>' +
      "<p>L'heure supplémentaire commence au-delà de " + a.pl.seuil + " heures par semaine, " +
      ech(a.pl.sourceSeuil) + ". À défaut d'accord, les huit premières de chaque semaine sont " +
      "majorées de 25 % et les suivantes de 50 % (L. 3121-36) ; votre convention ou votre accord " +
      "peut fixer d'autres taux, et celle des transports routiers n'est pas lue ici. Aucun " +
      "montant n'est calculé ici.</p>" +
      (a.pl.roulant
        ? "<p>Le repos compensateur du transport se compte par trimestre : une journée de la " +
          "quarante et unième à la soixante-dix-neuvième heure supplémentaire, une journée et " +
          "demie de la quatre-vingtième à la cent-huitième, deux journées et demie au-delà " +
          "(R. 3312-48). Il se prend dans les trois mois qui suivent, six au plus si un accord " +
          "le prévoit.</p>"
        : "<p>Au-delà du contingent annuel, fixé à 220 heures à défaut d'accord (D. 3121-24), " +
          "les heures supplémentaires ouvrent une contrepartie obligatoire en repos " +
          "(L. 3121-30), fixée à défaut d'accord à 100 % pour les entreprises de plus de vingt " +
          "salariés et à 50 % au plus vingt (L. 3121-38).</p>") +
      "<p>Plafonds appliqués sur ce relevé : " + a.pl.jour + " heures par jour et " + a.pl.sem +
      " heures par semaine, " + ech(a.pl.source) +
      (a.pl.dit ? ", catégorie « " + ech(a.pl.dit) + " »" : "") + ".</p>" +
      "<p>La moyenne de quarante-quatre heures sur douze semaines consécutives (L. 3121-22) ne se " +
      "calcule pas sur un mois : elle se vérifie sur trois mois de relevés.</p>" +
      "</div></details>");
    z.innerHTML = L.join("");
    /* La case du motif n'apparaît que s'il y a quelque chose à expliquer. */
    var lm = $("l-motif-dep"), im = $("t-motif-dep");
    if (lm && im) {
      var besoin = !!(a.jours.length || dep.length);
      lm.hidden = !besoin;
      if (besoin) { var mm = moisDe(); if (im.value !== (mm.motifDep || "")) im.value = mm.motifDep || ""; }
      im.disabled = VERROU;
    }
  }

  /* ══════════ L'AMPLITUDE, LA NUIT, LES REPAS ET LES DÉCOUCHERS ═══════

     Le relevé comptait des heures et rien d'autre. Or ce qui se paie en plus
     des heures, dans le transport, ce sont l'amplitude, les heures de nuit,
     les repas pris hors du domicile et les nuits passées dehors. L'audit du
     26 septembre 2026 l'a relevé.

     Ce qui se calcule est calculé depuis les horaires déjà saisis :
     l'amplitude d'une journée est l'écart entre le début et la fin, pause
     comprise, et les heures de nuit sont celles qui tombent dans la période
     de nuit de la convention. Ce que seul l'employeur sait, combien de repas
     ont été pris hors du domicile et combien de nuits dehors, se compte à la
     main : aucune règle ne permet de le déduire d'une heure de départ.

     Les montants viennent de contrats-transport.js, qui les porte avec leur
     source et leur date : protocole du 30 avril 1974 et son avenant, accord
     du 14 novembre 2001 pour la nuit, accord du 12 novembre 1998 pour
     l'amplitude. Ils sont affichés avec cette source, et l'écran dit de les
     vérifier au texte. */
  function ccnTransport() {
    return (window.ContratsTransport && window.ContratsTransport.CCN) || null;
  }
  function estTransport() {
    var p = entreprise() || {};
    var sec = sansAccent(String(p.secteur || ""));
    if (sec.indexOf("transport") >= 0 || sec.indexOf("logistique") >= 0) return true;
    var c = String(p.conventionCollective || "");
    var m = c.match(/\d{3,4}/);
    return !!(m && Number(m[0]) === 16);
  }
  /* Les heures d'une journée qui tombent entre deux bornes horaires, la
     journée pouvant déborder sur le lendemain. */
  function heuresEntre(debut, fin, borneA, borneB) {
    var d = enMinutes(debut), f = enMinutes(fin);
    if (d === null || f === null) return 0;
    if (f <= d) f += 1440;
    var total = 0;
    for (var tour = 0; tour <= 1; tour++) {
      var a = borneA + tour * 1440, b = borneB + tour * 1440;
      if (b <= a) b += 1440;
      var deb = Math.max(d, a), fi = Math.min(f, b);
      if (fi > deb) total += fi - deb;
    }
    return total / 60;
  }
  function sujetionsDuMois() {
    var C = ccnTransport();
    var perNuit = (C && C.nuit && C.nuit.periode) || "de 21 heures à 6 heures";
    var bornes = /(\d{1,2})\s*heures?\s*à\s*(\d{1,2})\s*heures?/.exec(perNuit);
    var a = bornes ? Number(bornes[1]) * 60 : 21 * 60;
    var b = bornes ? Number(bornes[2]) * 60 : 6 * 60;
    var out = { jours: 0, amplitude: 0, amplitudeMax: 0, jourMax: null, nuit: 0,
      nuits: 0, periode: perNuit, plafond: (C && C.amplitude && C.amplitude.plafondHeures) || null,
      audelaPlafond: 0 };
    lignes.forEach(function (l) {
      if (l.n !== "travail") return;
      var d = enMinutes(l.d), f = enMinutes(l.f);
      if (d === null || f === null) return;
      var fin = f <= d ? f + 1440 : f;
      var amp = (fin - d) / 60;
      if (amp <= 0) return;
      out.jours++;
      out.amplitude += amp;
      if (amp > out.amplitudeMax) { out.amplitudeMax = amp; out.jourMax = l.j; }
      var n = heuresEntre(l.d, l.f, a, b);
      if (n > 0) { out.nuit += n; out.nuits++; }
    });
    out.amplitude = Math.round(out.amplitude * 100) / 100;
    out.amplitudeMax = Math.round(out.amplitudeMax * 100) / 100;
    out.nuit = Math.round(out.nuit * 100) / 100;
    if (out.plafond && out.amplitude > out.plafond)
      out.audelaPlafond = Math.round((out.amplitude - out.plafond) * 100) / 100;
    return out;
  }

  /* Les indemnités qui se comptent, et le montant de chacune. */
  function lignesFrais() {
    var C = ccnTransport();
    var f = (C && C.frais) || {};
    return [
      { c: "repas", nom: "Repas", montant: f.repas, sous: "repas pris hors du domicile" },
      { c: "repasUnique", nom: "Repas unique", montant: f.repasUnique, sous: "un seul repas hors du domicile" },
      { c: "repasUniqueNuit", nom: "Repas unique de nuit", montant: f.repasUniqueNuit, sous: "pris pendant la période de nuit" },
      { c: "casseCroute", nom: "Casse-croûte", montant: f.casseCroute, sous: "prise de service avant 5 heures" },
      { c: "speciale", nom: "Indemnité spéciale", montant: f.speciale, sous: "sujétion particulière" },
      { c: "grandDeplacement1", nom: "Découcher, un repas", montant: f.grandDeplacement1, sous: "nuit dehors et un repas" },
      { c: "grandDeplacement2", nom: "Découcher, deux repas", montant: f.grandDeplacement2, sous: "nuit dehors et deux repas" }
    ].filter(function (x) { return typeof x.montant === "number"; });
  }
  function nombreFrais(m, c) {
    var v = parseInt(String((m.frais && m.frais[c]) || "").replace(/[^0-9]/g, ""), 10);
    return isFinite(v) ? v : 0;
  }
  function eur(n) {
    return (Math.round(n * 100) / 100).toFixed(2).replace(".", ",") + " €";
  }
  function rendreSujetions() {
    var bloc = $("bloc-sujetions");
    if (!bloc) return;
    if (!estTransport() || !ccnTransport()) { bloc.hidden = true; return; }
    bloc.hidden = false;
    var s = sujetionsDuMois(), C = ccnTransport(), m = moisDe(), verrou = !!(m.clos && m.clos.le);
    var L = lignesFrais();
    var total = 0;
    L.forEach(function (x) { total += nombreFrais(m, x.c) * x.montant; });

    $("sujetions").innerHTML =
      '<div class="tuile"><span class="et">Amplitude du mois</span><div class="n">' +
      ech(nbh(s.amplitude)) + "</div><small>" +
      ech(s.jours + " journée" + (s.jours > 1 ? "s" : "") + " comptée" + (s.jours > 1 ? "s" : "") +
        (s.jourMax ? ", la plus longue le " + s.jourMax + " avec " + nbh(s.amplitudeMax) : "")) +
      "</small></div>" +
      '<div class="tuile"><span class="et">Heures de nuit</span><div class="n">' +
      ech(nbh(s.nuit)) + "</div><small>" +
      ech(s.nuits + " journée" + (s.nuits > 1 ? "s" : "") + " touchée" + (s.nuits > 1 ? "s" : "") +
        " · période " + s.periode + " (" + C.nuit.source + ")") + "</small></div>" +
      '<div class="tuile"><span class="et">Frais et indemnités</span><div class="n">' +
      ech(eur(total)) + "</div><small>" +
      ech("somme des nombres saisis ci-dessous") + "</small></div>";

    $("frais").innerHTML = L.map(function (x) {
      return '<label class="champ"><span>' + ech(x.nom) +
        "<small>" + ech(x.sous + " · " + eur(x.montant)) + "</small></span>" +
        '<input type="number" min="0" step="1" inputmode="numeric" data-frais="' + ech(x.c) +
        '" value="' + ech(nombreFrais(m, x.c) || "") + '" placeholder="0"' +
        (verrou ? " disabled" : "") + "></label>";
    }).join("");

    $("frais-dit").textContent = "Les montants sont ceux de " + C.frais.source +
      ", en vigueur au " + C.frais.depuis.split("-").reverse().join("/") +
      ", et la période de nuit celle de " + C.nuit.source +
      ". Vérifiez-les au texte : la convention n'est pas lue par l'application, ces valeurs y ont été " +
      "recopiées avec leur date. Le nombre de repas et de découchers ne se déduit d'aucun horaire : " +
      "c'est vous qui le comptez.";

    Array.prototype.forEach.call($("frais").querySelectorAll("[data-frais]"), function (el) {
      el.addEventListener("input", function () {
        var mm = moisDe();
        mm.frais = mm.frais || {};
        var v = el.value.replace(/[^0-9]/g, "");
        if (v) mm.frais[el.getAttribute("data-frais")] = v;
        else delete mm.frais[el.getAttribute("data-frais")];
        garderMois(mm);
        rendreSujetions();
      });
    });
  }

  /* Les mêmes chiffres, en phrases, pour le relevé imprimé et pour le Word :
     un décompte qui ne dit pas l'amplitude ni les frais n'est pas le décompte
     du mois. */
  function phrasesSujetions() {
    if (!estTransport() || !ccnTransport()) return [];
    var s = sujetionsDuMois(), C = ccnTransport(), m = moisDe();
    var L = [];
    L.push("Amplitude cumulée des journées travaillées : " + nbh(s.amplitude) +
      (s.jourMax ? ", la plus longue le " + s.jourMax + " " + MOIS[mo] + " avec " + nbh(s.amplitudeMax) : "") + ".");
    L.push("Heures comprises dans la période de nuit, " + s.periode + " : " + nbh(s.nuit) +
      " sur " + s.nuits + " journée" + (s.nuits > 1 ? "s" : "") + " (" + C.nuit.source + ").");
    var F = lignesFrais(), total = 0, dits = [];
    F.forEach(function (x) {
      var n = nombreFrais(m, x.c);
      if (!n) return;
      total += n * x.montant;
      dits.push(n + " " + x.nom.toLowerCase() + " à " + eur(x.montant));
    });
    if (dits.length)
      L.push("Frais et indemnités du mois : " + dits.join(", ") + ", soit " + eur(total) +
        " (" + C.frais.source + ", en vigueur au " + C.frais.depuis.split("-").reverse().join("/") + ").");
    else
      L.push("Aucun repas ni découcher n'a été compté pour ce mois.");
    return L;
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
    var ct = duContrat();
    var tc = $("tuile-contrat");
    if (tc) {
      tc.hidden = !(ct && ct.mois > 0);
      if (ct && ct.mois > 0) {
        $("t-contrat").textContent = nbh(ct.mois);
        tc.title = ct.quoi;
      }
    }

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
    rendreControles();
    rendreSujetions();
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
             champTexte("f2", c.f2, "23:00") + "<span></span>" +
             '<span class="manque" data-manque="' + j + '"></span>'
           : "<span></span><span></span><span></span>") +
        "</div></div>";
    }
    $("r-sem").innerHTML = h;
    direCeQuiManque(r.sem);

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

  /* UNE PLAGE À MOITIÉ REMPLIE NE COMPTE PAS, ET IL FAUT LE DIRE.

     Le second service n'entre dans le calcul que si son début ET sa fin sont
     saisis : les heures grises du champ vide sont des exemples, non des
     valeurs. Tapé « 14:00 » sans la fin, le haut de l'écran ne bougeait pas et
     rien n'expliquait pourquoi. Mesuré le 23 septembre 2026 sur le vendredi
     d'un chauffeur. */
  function direCeQuiManque(sem) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-manque]"), function (el) {
      var c = sem[el.getAttribute("data-manque")];
      var dit = "";
      if (c) {
        if (c.d1 && !c.f1) dit = "Indiquez aussi l'heure de fin du premier service.";
        else if (!c.d1 && c.f1) dit = "Indiquez aussi l'heure de début du premier service.";
        else if (c.d2 && !c.f2) dit = "Second service : indiquez aussi l'heure de fin, sinon il ne compte pas.";
        else if (!c.d2 && c.f2) dit = "Second service : indiquez aussi l'heure de début, sinon il ne compte pas.";
      }
      el.textContent = dit;
      el.classList.toggle("vu", !!dit);
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
    direCeQuiManque(sem);
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

  /* Le même relevé pour trois sorties. `chiffres` change une seule chose : les
     heures et les pauses partent en nombres, pour que le tableur les
     additionne au lieu de les afficher comme du texte. Relevé le
     26 septembre 2026, « les heures sortent en texte dans Excel ». */
  function tableauMois(chiffres) {
    function h(v) { return chiffres ? Math.round(v * 100) / 100 : v.toFixed(2).replace(".", ","); }
    function mn(v) { var n = parseInt(v, 10) || 0; return chiffres ? n : String(n); }
    var t = [["Jour", "Nature", "Début", "Fin", "Pause (min)", "Heures"]];
    var sem = null, cumul = 0;
    lignes.forEach(function (l, i) {
      if (sem === null) sem = l.j;
      var v = duree(l);
      cumul += v;
      t.push([
        l.j + " " + COURT[l.sem],
        l.hc ? "Hors contrat, " + l.hc : (LIB[l.n] || ""),
        l.n === "travail" ? l.d : "",
        l.n === "travail" ? l.f : "",
        l.n === "travail" ? mn(l.p) : "",
        l.n === "travail" ? h(v) : "",
      ]);
      if (l.sem === 0 || i === lignes.length - 1) {
        t.push(["Semaine du " + sem + " au " + l.j, "", "", "", "Total semaine", h(cumul)]);
        sem = null; cumul = 0;
      }
    });
    return t;
  }

  /* Les mêmes contrôles qu'à l'écran, en phrases, pour les sorties : le papier
     signé et le classeur doivent dire ce que le relevé montre. */
  function phrasesControles() {
    var a = analyse(), L = [];
    if (a.jours.length) L.push("Journées au-delà de " + a.pl.jour + " heures : " +
      a.jours.map(function (x) { return leJourDit(x.j) + " (" + nbh(x.h) + ")"; }).join(", ") + ".");
    var dep = a.semaines.filter(function (x) { return x.depasse; });
    if (dep.length) L.push("Semaines au-delà de " + a.pl.sem + " heures : " +
      dep.map(function (x) { return "du " + (x.du === 1 ? "1er" : x.du) + " au " + x.au +
        " (" + nbh(x.h) + ")"; }).join(", ") + ".");
    if (a.hs > 0.005) L.push("Heures supplémentaires des semaines entières, au-delà de " +
      a.pl.seuil + " heures (" + a.pl.sourceSeuil + ") : " + nbh(a.hs) + ", dont " + nbh(a.a25) +
      " dans les huit premières heures de chaque semaine et " + nbh(a.a50) + " au-delà. À défaut " +
      "d'accord, 25 % et 50 % par L. 3121-36, sous réserve de votre convention collective, qui " +
      "n'est pas lue ici. Aucun montant n'est calculé : les taux se reportent en paie.");
    var tri = Math.floor(mo / 3), c = cumul(tri * 3, tri * 3 + 2);
    if (a.pl.roulant) {
      var jr = reposTrimestre(c.hs);
      L.push("Trimestre " + (tri + 1) + ", " + MOIS[tri * 3] + " à " + MOIS[tri * 3 + 2] + " : " +
        nbh(c.hs) + " d'heures supplémentaires sur les mois tenus" +
        (jr ? ", soit " + String(jr).replace(".", ",") + " jour" + (jr > 1 ? "s" : "") +
          " de compensation obligatoire en repos (R. 3312-48), à prendre dans les trois mois."
          : " : la compensation obligatoire en repos s'ouvre à la quarante et unième heure du " +
            "trimestre (R. 3312-48)."));
    } else {
      var ct = contingent();
      L.push("Année " + an + " : " + nbh(ct.hs) + " d'heures supplémentaires sur les mois tenus" +
        (ct.audela > 0 ? ", dont " + nbh(ct.audela) + " au-delà du contingent de 220 heures " +
          "(D. 3121-24), qui ouvrent une contrepartie obligatoire en repos de " + ct.taux + " % " +
          "(L. 3121-30 et L. 3121-38, à défaut d'accord)."
          : ", contingent de 220 heures à défaut d'accord (D. 3121-24)."));
    }
    if (c.manquants.length) L.push("Mois du trimestre non tenus ici : " +
      c.manquants.map(function (k) { return MOIS[k]; }).join(", ") + ". Ils ne sont pas comptés.");
    var md = net(moisDe().motifDep);
    if (md) L.push("Motif du dépassement, porté par l'entreprise : " + md);
    if (!a.jours.length && !dep.length && a.hs <= 0.005)
      L.push("Aucun dépassement des plafonds, et aucune semaine entière au-delà de trente-cinq heures.");
    if (a.partielles) L.push(a.partielles > 1
      ? a.partielles + " semaines chevauchent le mois voisin : leurs totaux se vérifient avec l'autre mois."
      : "Une semaine chevauche le mois voisin : son total se vérifie avec l'autre mois.");
    L.push("Plafonds appliqués : " + a.pl.jour + " heures par jour et " + a.pl.sem +
      " heures par semaine (" + a.pl.source + ")" + (a.pl.dit ? ", catégorie « " + a.pl.dit + " »" : "") +
      ". La moyenne de quarante-quatre heures sur douze semaines (L. 3121-22) ne se calcule pas sur un mois.");
    return L;
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
    /* Les plafonds et les heures au-delà de trente-cinq heures se lisent sur
       le papier que le salarié signe, avant sa signature. */
    phrasesControles().forEach(function (x) {
      h += '<p class="tot">' + ech(x) + "</p>";
    });
    phrasesSujetions().forEach(function (x) {
      h += '<p class="tot">' + ech(x) + "</p>";
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

  /* ══════════ L'ÉTAT DU MOIS, POUR TOUS LES SALARIÉS ═══════════════════

     Le décompte se tenait salarié par salarié : pour savoir où en était la
     paie du mois, il fallait ouvrir autant de fiches qu'il y a de salariés.
     L'audit du 26 septembre 2026 l'a relevé.

     Ce tableau ne recalcule rien. Il reprend, pour le mois affiché, ce que
     chaque mois tenu a enregistré : le total calculé, le total retenu, les
     heures supplémentaires, l'état de clôture. Un salarié dont le mois n'a
     jamais été ouvert n'a pas de chiffre, et la ligne le dit : elle ne met
     pas zéro, qui se lirait comme un mois à zéro heure. */
  function etatDuMois() {
    var t = lireCle(CLE_DEC, {});
    var cleM = an + "-" + ("0" + (mo + 1)).slice(-2);
    var trimestre = Math.floor(mo / 3);
    return salaries().map(function (s) {
      var m = t[s.id + "|" + cleM];
      var o = { id: s.id, nom: s.nom, emp: s.emp || "", tenu: !!m };
      if (!m) return o;
      o.calcul = typeof m.calcul === "number" ? m.calcul : null;
      o.retenu = nombre(m.retenu);
      o.hs = typeof m.hs === "number" ? m.hs : null;
      o.clos = !!(m.clos && m.clos.le);
      o.closLe = o.clos ? m.clos.le : "";
      o.motif = m.motif || "";
      o.motifDep = m.motifDep || "";
      /* Le repos compensateur se compte par trimestre : on additionne les
         mois du trimestre qui ont été tenus, et on dit ceux qui manquent. */
      var hsT = 0, manquants = [];
      for (var k = trimestre * 3; k < trimestre * 3 + 3; k++) {
        var mm = t[s.id + "|" + an + "-" + ("0" + (k + 1)).slice(-2)];
        if (mm && typeof mm.hs === "number") hsT += mm.hs;
        else manquants.push(MOIS[k]);
      }
      o.hsTrimestre = Math.round(hsT * 100) / 100;
      o.repos = reposTrimestre(o.hsTrimestre);
      o.trimestreManquants = manquants;
      /* Les frais du mois, s'il y en a. */
      var F = lignesFrais(), tot = 0;
      F.forEach(function (x) {
        var n = parseInt(String((m.frais && m.frais[x.c]) || "").replace(/[^0-9]/g, ""), 10);
        if (isFinite(n)) tot += n * x.montant;
      });
      o.frais = Math.round(tot * 100) / 100;
      return o;
    });
  }

  function rendreEtatTous() {
    var L = etatDuMois();
    var tenus = L.filter(function (x) { return x.tenu; });
    var clos = tenus.filter(function (x) { return x.clos; });
    $("etat-tous-dit").textContent = L.length + " salarié" + (L.length > 1 ? "s" : "") +
      " au registre · " + tenus.length + " mois tenu" + (tenus.length > 1 ? "s" : "") +
      " pour " + MOIS[mo] + " " + an + " · " + clos.length + " clos";
    if (!L.length) {
      $("etat-tous").innerHTML = "";
      $("b-etat-excel").hidden = true;
      return;
    }
    var h = '<div class="tableau-etat"><table><thead><tr>' +
      ["Salarié", "Calculé", "Retenu", "Heures sup.", "Repos trimestre", "Frais", "État"]
        .map(function (c) { return "<th>" + ech(c) + "</th>"; }).join("") +
      "</tr></thead><tbody>";
    L.forEach(function (x) {
      if (!x.tenu) {
        h += '<tr class="vide"><td>' + ech(x.nom) + "</td>" +
          '<td colspan="6">mois non tenu</td></tr>';
        return;
      }
      h += "<tr><td>" + ech(x.nom) + "</td>" +
        "<td>" + ech(x.calcul === null ? "" : nbh(x.calcul)) + "</td>" +
        "<td>" + ech(x.retenu === null ? "à remplir" : nbh(x.retenu)) + "</td>" +
        "<td>" + ech(x.hs === null ? "" : nbh(x.hs)) + "</td>" +
        "<td>" + ech(x.repos ? x.repos + " j" : "aucun") +
        (x.trimestreManquants.length ? " <small>(" + ech(x.trimestreManquants.join(", ")) +
          " non tenu" + (x.trimestreManquants.length > 1 ? "s" : "") + ")</small>" : "") + "</td>" +
        "<td>" + ech(x.frais ? eur(x.frais) : "") + "</td>" +
        "<td>" + (x.clos ? "clos le " + ech(enFrancais(x.closLe)) : "en cours") + "</td></tr>";
    });
    h += "</tbody></table></div>";
    $("etat-tous").innerHTML = h;
    $("b-etat-excel").hidden = false;
  }

  /* L'EXPORT POUR LA PAIE. Une ligne par salarié, les colonnes que la paie
     reprend, et rien de deviné : un mois non tenu sort vide, non à zéro. */
  function etatClasseur() {
    if (!window.TableurExport) return;
    var p = entreprise(), L = etatDuMois();
    var lignes = [
      ["État mensuel des heures, tous les salariés"],
      ["Entreprise", p.denomination || ""],
      ["Mois", MOIS[mo] + " " + an],
      ["Établi le", enFrancais(iso(new Date()))],
      [],
      ["Salarié", "Emploi", "Heures calculées", "Heures retenues", "Heures supplémentaires",
       "Heures sup. du trimestre", "Repos compensateur (jours)", "Frais et indemnités (euros)",
       "État du mois", "Motif de l'écart", "Motif du dépassement"],
    ];
    L.forEach(function (x) {
      if (!x.tenu) {
        lignes.push([x.nom, x.emp, "", "", "", "", "", "", "mois non tenu", "", ""]);
        return;
      }
      lignes.push([x.nom, x.emp,
        x.calcul === null ? "" : x.calcul,
        x.retenu === null ? "" : x.retenu,
        x.hs === null ? "" : x.hs,
        x.hsTrimestre, x.repos, x.frais,
        x.clos ? "clos le " + enFrancais(x.closLe) : "en cours",
        x.motif || "", x.motifDep || ""]);
    });
    lignes.push([]);
    lignes.push(["Un mois non tenu sort vide, et non à zéro : personne n'a compté ses heures, " +
      "ce qui n'est pas la même chose qu'un mois sans heures."]);
    lignes.push(["Établi en application des articles L. 3171-2 et D. 3171-8 du code du travail."]);
    var octets = window.TableurExport.xlsx([{
      titre: "État du mois",
      lignes: lignes,
      largeurs: [24, 18, 14, 14, 16, 16, 16, 18, 20, 26, 26],
    }]);
    window.TableurExport.telecharger(octets,
      "etat-heures-" + an + "-" + ("0" + (mo + 1)).slice(-2) + ".xlsx");
  }

  function classeur() {
    if (!window.TableurExport) return;
    var p = entreprise(), m = moisDe();
    var tete = [
      ["Décompte mensuel des heures de travail"],
      ["Entreprise", p.denomination || ""],
      ["Salarié", qui.nom + (qui.emp ? ", " + qui.emp : "")],
      ["Mois", MOIS[mo] + " " + an],
      /* L'ancien modèle à trois champs n'existe plus : cette ligne sortait
         « undefined - undefined, pause undefined min ». Relevé le
         26 septembre 2026. */
      ["Horaire de référence", direSemaine(refDe(qui.id))],
      [],
    ];
    var retenu = nombre(m.retenu);
    var pied = [
      [],
      ["Total calculé par les jours (heures)", Math.round(totalMois() * 100) / 100],
      ["Total retenu par l'entreprise (heures)", retenu === null ? "à remplir" : retenu],
      ["Motif de l'écart", m.motif || ""],
      ["État du mois", m.clos && m.clos.le
        ? "clos le " + enFrancais(m.clos.le) + ", empreinte " + m.clos.empreinte
        : "en cours"],
      [],
      ["Heures supplémentaires et plafonds"],
    ].concat(phrasesControles().map(function (p) { return [p]; }))
      .concat(phrasesSujetions().length ? [[], ["Amplitude, nuit, repas et découchers"]] : [])
      .concat(phrasesSujetions().map(function (p) { return [p]; })).concat([
      [],
      ["Établi en application des articles L. 3171-2 et D. 3171-8 du code du travail. " +
       "À conserver un an au moins à la disposition de l'inspection du travail (D. 3171-16)."],
    ]);
    var feuilles = [{
      titre: "Décompte",
      lignes: tete.concat(tableauMois(true)).concat(pied),
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
      { k: "p", t: "Horaire de référence : " + direSemaine(r) },
      { k: "table", head: T[0], rows: T.slice(1) },
      { k: "p", t: "Total calculé par les jours : " + nbh(totalMois()) + "." },
      { k: "p", t: "Total retenu par l'entreprise : " +
        (m.retenu ? nbh(nombre(m.retenu) || 0) : "à compléter") + "." +
        (m.motif ? " Motif de l'écart : " + m.motif + "." : "") },
      { k: "h2", t: "Heures supplémentaires et plafonds" },
    ].concat(phrasesControles().map(function (x) { return { k: "p", t: x }; }));
    var suj = phrasesSujetions();
    if (suj.length) {
      items.push({ k: "h2", t: "Amplitude, nuit, repas et découchers" });
      suj.forEach(function (x) { items.push({ k: "p", t: x }); });
    }
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

  /* ───────────── L'IMPRIMÉ QUE LE CONDUCTEUR SIGNE AVEC SON DÉCOMPTE ──────

     Demande du 16 septembre 2026 : « avec le décompte des heures, on joindra
     un imprimé type que tu feras et que le salarié signera en s'engageant à
     dire qu'il n'a pas perdu tous ses points ».

     Pourquoi une déclaration, et pas une vérification. L'entreprise de
     transport public routier de voyageurs ou de marchandises obtient bien de
     l'administration, pour les personnes qu'elle emploie comme conducteur,
     « les informations relatives à l'existence, la catégorie et la validité
     du permis de conduire » : article L. 225-5, 11°, du code de la route
     (LEGIARTI000054724576), et R. 225-5, I, 4° pour l'accès direct de ses
     personnels habilités (LEGIARTI000050924285). Le nombre de points, lui,
     n'est pas dans cette liste : l'accès aux informations enregistrées au
     titre de l'article L. 225-1 est réservé aux autorités que L. 225-4
     énumère (LEGIARTI000033460322), où l'employeur ne figure pas. D'où
     l'imprimé : c'est le conducteur qui déclare.

     Ce qu'il déclare tient au texte : « en cas de retrait de la totalité des
     points, l'intéressé reçoit de l'autorité administrative l'injonction de
     remettre son permis de conduire au préfet de son département de résidence
     et perd le droit de conduire un véhicule », article L. 223-5, I
     (LEGIARTI000039099768). Toutes ces lectures ont été faites deux fois, au
     relais Légifrance, le 16 septembre 2026.

     Les données du permis viennent de la fiche conducteur de la flotte : ce
     qui est déjà saisi ne se retape pas, et ce qui manque laisse des pointillés. */
  function permisDu(id) {
    try {
      var t = JSON.parse(window.localStorage.getItem("flotte-conducteurs") || "{}");
      return t[id] || {};
    } catch (e) { return {}; }
  }

  function pointilles(v, n) {
    v = net(v);
    return v || new Array((n || 22) + 1).join(".");
  }

  function declarationItems() {
    var p = entreprise(), f = permisDu(qui.id);
    var items = [
      { k: "sur", t: (p.denomination || "") + (p.adresse ? " - " + p.adresse : "") },
      { k: "h1", t: "Déclaration du conducteur sur la validité de son permis de conduire" },
      { k: "p", t: "À joindre au décompte des heures du mois de " + MOIS[mo] + " " + an + "." },
      { k: "p", t: "Je soussigné " + (qui.nom || pointilles("", 30)) +
        (qui.emp ? ", " + qui.emp : "") + ", salarié de " + (p.denomination || pointilles("", 24)) +
        ", déclare ce qui suit." },
      { k: "puce", t: "Je suis titulaire du permis de conduire de la catégorie " +
        pointilles(f.permisCat, 12) + ", délivré sous le numéro " + pointilles(f.permisNum, 18) +
        ", en cours de validité" + (net(f.permisFin) ? " jusqu'au " + enFrancais(f.permisFin) : "") + "." },
      { k: "puce", t: "Ce permis ne fait l'objet, à ce jour, d'aucune rétention, suspension, " +
        "annulation ni invalidation." },
      { k: "puce", t: "Il ne m'a pas été retiré la totalité de mes points, et je n'ai reçu aucune " +
        "injonction de remettre mon permis de conduire au préfet." },
      { k: "puce", t: "Je m'engage à informer l'entreprise sans délai, et par écrit, de toute " +
        "décision qui affecterait la validité de mon permis : rétention, suspension, annulation, " +
        "invalidation, ou retrait de la totalité des points." },
      { k: "puce", t: "Lorsque ma catégorie l'exige, la visite médicale du permis est à jour" +
        (net(f.visitePermisFin) ? ", valable jusqu'au " + enFrancais(f.visitePermisFin) : "") + "." },
      { k: "note", t: "Le retrait de la totalité des points fait perdre le droit de conduire : " +
        "l'intéressé reçoit l'injonction de remettre son permis au préfet (code de la route, " +
        "article L. 223-5, I). L'entreprise de transport public routier peut obtenir de " +
        "l'administration l'existence, la catégorie et la validité du permis des personnes qu'elle " +
        "emploie comme conducteur (L. 225-5, 11°, et R. 225-5, I, 4°), mais non le nombre de points " +
        "restants : c'est pourquoi cette déclaration est demandée au conducteur lui-même." },
      { k: "p", t: " " },
      { k: "p", t: "Fait à ........................, le ........................" },
      { k: "p", t: "Signature du salarié :" },
      { k: "p", t: " " },
      { k: "p", t: "Pour l'entreprise, " + (p.responsable || "") },
    ];
    return items;
  }

  function declarationWord() {
    if (!window.AuditExport) return;
    var titre = "Déclaration du conducteur - " + qui.nom + " - " + MOIS[mo] + " " + an;
    var nom = "declaration-conducteur-" + qui.id + "-" + an + "-" + ("0" + (mo + 1)).slice(-2) + ".docx";
    window.AuditExport.telecharger(window.AuditExport.docx(declarationItems(), titre), nom,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  }

  /* Le même imprimé, sur le papier de l'imprimante : la zone d'impression sert
     déjà au récapitulatif, elle porte ici la déclaration le temps du tirage. */
  function declarationImprimer() {
    var z = $("impression");
    if (!z) return;
    var garde = z.innerHTML;
    z.innerHTML = declarationItems().map(function (x) {
      if (x.k === "sur") return '<p class="i-sur">' + ech(x.t) + "</p>";
      if (x.k === "h1") return "<h1>" + ech(x.t) + "</h1>";
      if (x.k === "puce") return '<p class="i-puce">- ' + ech(x.t) + "</p>";
      if (x.k === "note") return '<p class="i-note">' + ech(x.t) + "</p>";
      return "<p>" + ech(x.t) + "</p>";
    }).join("");
    window.print();
    setTimeout(function () { z.innerHTML = garde; }, 600);
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
    if ($("t-motif-dep")) $("t-motif-dep").addEventListener("input", function () {
      var m = moisDe(); m.motifDep = $("t-motif-dep").value; garderMois(m);
    });

    /* CE QUI EMPÊCHE DE CLORE.

       Trois clôtures étaient acceptées qui n'auraient pas dû l'être : un mois
       à venir, dont les journées ne sont que l'horaire de référence recopié ;
       un mois sans total retenu, c'est-à-dire scellé sans que personne ait dit
       combien d'heures sont payées ; un écart entre le calcul et le total
       retenu sans un mot pour l'expliquer. Relevé le 26 septembre 2026. Le
       refus dit lequel des trois, et met le curseur dans la case qui manque. */
    function refusDeClore() {
      var m = moisDe(), d = new Date();
      var finDuMois = new Date(an, mo + 1, 0);
      if (finDuMois > d) {
        return { dit: "Ce mois n'est pas terminé : il se clôt à partir du " +
          enFrancais(iso(new Date(an, mo + 1, 1))) + ". Les journées qui restent ne sont que " +
          "l'horaire de référence recopié, elles n'ont pas été travaillées.", ou: null };
      }
      var n = nombre(m.retenu);
      if (n === null) {
        return { dit: "Le total retenu par l'entreprise n'est pas saisi : un mois se clôt sur un " +
          "nombre d'heures, pas sur une case vide.", ou: "t-retenu" };
      }
      if (Math.abs(n - totalMois()) >= 0.005 && !net(m.motif)) {
        return { dit: "Le total retenu diffère du calcul des jours de " +
          nbh(Math.abs(n - totalMois())) + " : le motif de l'écart est à écrire avant la clôture.",
          ou: "t-motif" };
      }
      var a = analyse();
      var dep = a.semaines.filter(function (x) { return x.depasse; });
      if ((a.jours.length || dep.length) && !net(m.motifDep)) {
        return { dit: "Ce mois porte " + (a.jours.length ? a.jours.length + " journée" +
          (a.jours.length > 1 ? "s" : "") + " au-delà de " + a.pl.jour + " heures" : "") +
          (a.jours.length && dep.length ? " et " : "") +
          (dep.length ? dep.length + " semaine" + (dep.length > 1 ? "s" : "") + " au-delà de " +
            a.pl.sem + " heures" : "") +
          " : le motif du dépassement est à écrire avant la clôture.", ou: "t-motif-dep" };
      }
      return null;
    }

    $("clore").addEventListener("click", function () {
      var m = moisDe();
      if (m.clos && m.clos.le) return;
      var refus = refusDeClore();
      var zr = $("cl-refus");
      if (refus) {
        if (zr) { zr.textContent = refus.dit; zr.hidden = false; }
        if (refus.ou && $(refus.ou)) { $(refus.ou).focus(); $(refus.ou).scrollIntoView({ behavior: "smooth", block: "center" }); }
        return;
      }
      if (zr) { zr.hidden = true; zr.textContent = ""; }
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

    /* ─────────────────────── le relevé de la machine ─────────────────── */
    /* CE QUE LA MACHINE A ENREGISTRÉ SE REPREND, IL NE SE RETAPE PAS.

       Un tableau, quelle que soit sa provenance : une ligne par jour, avec la
       date, le début, la fin et la pause. On ne devine pas l'ordre des
       colonnes au hasard : la date est cherchée en premier, les deux heures
       ensuite dans l'ordre où elles viennent, la pause est le nombre restant.
       Seuls les jours du mois affiché sont repris, et l'écran dit combien.
       Relevé le 26 septembre 2026, « importer le chronotachygraphe ». */
    function jourDeLaLigne(cellules) {
      for (var i = 0; i < cellules.length; i++) {
        var c = String(cellules[i] == null ? "" : cellules[i]).trim();
        var m = c.match(/^(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?$/);
        if (m) {
          var jj = parseInt(m[1], 10), mm = parseInt(m[2], 10);
          var aa = m[3] ? parseInt(m[3].length === 2 ? "20" + m[3] : m[3], 10) : an;
          if (mm === mo + 1 && aa === an && jj >= 1 && jj <= 31) return { j: jj, i: i };
          return null;
        }
        var iso2 = c.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (iso2) {
          if (parseInt(iso2[1], 10) === an && parseInt(iso2[2], 10) === mo + 1)
            return { j: parseInt(iso2[3], 10), i: i };
          return null;
        }
        if (/^\d{1,2}$/.test(c) && i === 0) return { j: parseInt(c, 10), i: i };
      }
      return null;
    }
    function heuresDeLaLigne(cellules, depuis) {
      var H = [];
      for (var i = depuis + 1; i < cellules.length; i++) {
        var c = String(cellules[i] == null ? "" : cellules[i]).trim();
        if (/^\d{1,2}\s*[:hH.]\s*\d{2}$/.test(c)) H.push(normaliser(c));
      }
      return H;
    }
    function pauseDeLaLigne(cellules, depuis) {
      for (var i = cellules.length - 1; i > depuis; i--) {
        var c = String(cellules[i] == null ? "" : cellules[i]).trim();
        if (/^\d{1,3}$/.test(c)) return String(parseInt(c, 10));
      }
      return null;
    }
    function reprendre(table) {
      var m = moisDe(), n = 0, hors = 0;
      table.forEach(function (cellules) {
        if (!cellules || !cellules.length) return;
        var d = jourDeLaLigne(cellules);
        if (!d) { hors++; return; }
        var H = heuresDeLaLigne(cellules, d.i);
        if (H.length < 2) { hors++; return; }
        var p = pauseDeLaLigne(cellules, d.i);
        m.jours[String(d.j)] = { n: "travail", d: H[0], f: H[1], p: p == null ? "0" : p };
        n++;
      });
      if (n) { garderMois(m); construire(); tout(); }
      $("imp-etat").textContent = n
        ? n + " jour" + (n > 1 ? "s" : "") + " repris dans le mois affiché" +
          (hors ? ", " + hors + " ligne" + (hors > 1 ? "s" : "") + " laissée" + (hors > 1 ? "s" : "") +
            " de côté (autre mois, ou ni début ni fin)" : "") + "."
        : "Aucun jour du mois affiché n'a été trouvé dans ce relevé.";
    }
    $("imp-lire").addEventListener("click", function () {
      var colle = $("imp-colle").value.trim();
      var f = $("imp-fichier").files && $("imp-fichier").files[0];
      if (!window.LireClasseur) { $("imp-etat").textContent = "Le lecteur de tableaux n'a pas pu être chargé."; return; }
      if (colle) { reprendre(window.LireClasseur.texte(colle)); return; }
      if (!f) { $("imp-etat").textContent = "Choisissez un fichier, ou collez le tableau."; return; }
      if (/\.(csv|txt|tsv)$/i.test(f.name)) {
        f.text().then(function (t) { reprendre(window.LireClasseur.texte(t)); });
        return;
      }
      if (!window.LireClasseur.possible()) {
        $("imp-etat").textContent = "Ce navigateur ne sait pas ouvrir un .xlsx : enregistrez le relevé en .csv, ou collez le tableau.";
        return;
      }
      $("imp-etat").textContent = "Lecture du fichier…";
      window.LireClasseur.fichier(f).then(function (lignes) {
        reprendre(lignes.filter(function (l) { return l.some(function (c) { return String(c || "").trim(); }); }));
      }, function () {
        $("imp-etat").textContent = "Ce fichier n'a pas pu être lu.";
      });
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
    $("b-etat").addEventListener("click", rendreEtatTous);
    $("b-etat-excel").addEventListener("click", etatClasseur);
    $("b-decl").addEventListener("click", declarationWord);
    $("b-decl-imp").addEventListener("click", declarationImprimer);

    tout();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
