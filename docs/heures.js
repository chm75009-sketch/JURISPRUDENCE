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
  var semaines = [];

  function refDe(id) {
    var t = lireCle(CLE_REF, {});
    var r = t[id] || {};
    return {
      d: r.d || "09:00",
      f: r.f || "17:00",
      p: r.p == null ? 60 : r.p,
      jours: r.jours || { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 0: false },
    };
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
      var travaille = !!r.jours[sem];
      var base = {
        n: travaille ? "travail" : "repos",
        d: r.d, f: r.f, p: String(r.p),
      };
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

  function majLigne(noeud, l) {
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
    var r = refDe(qui.id), n = 0;
    for (var k = 0; k < 7; k++) if (r.jours[k]) n++;
    return duree({ n: "travail", d: r.d, f: r.f, p: r.p }) * n;
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
    $("identite").innerHTML = l.map(function (x) {
      return '<div class="l"><span class="q">' + ech(x[0]) + '</span><span class="v">' + ech(x[1]) + "</span></div>";
    }).join("");
  }

  function rendreRef() {
    var r = refDe(qui.id);
    $("r-deb").value = r.d;
    $("r-fin").value = r.f;
    $("r-pause").value = r.p;
    var h = "";
    for (var k = 1; k <= 7; k++) {
      var j = k % 7;
      h += '<button type="button" data-j="' + j + '" aria-pressed="' + (r.jours[j] ? "true" : "false") +
        '" aria-label="' + COURT[j] + '">' + LETTRE[j] + "</button>";
    }
    $("r-jours").innerHTML = h;
    Array.prototype.forEach.call($("r-jours").querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () {
        var rr = refDe(qui.id), j = b.getAttribute("data-j");
        rr.jours[j] = !rr.jours[j];
        garderRef(qui.id, rr);
        construire(); rendreRef(); rendreIdentite(); dessinerJours(); calculer();
      });
    });
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
    $("x-jour").value = an + "-" + ("0" + (mo + 1)).slice(-2) + "-01";
    if (!$("c-date").value) $("c-date").value = iso(new Date());
    rendreListes(m);
  }

  function rendreListes(m) {
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

    if ((m.rectifs || []).length || (m.recl || []).length) {
      var L = [["Rectificatifs et réclamations"], []];
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
    if (!window.AuditExport) return;
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
    items.push({ k: "p", t: "Établi en application des articles L. 3171-2 et D. 3171-8 du code du travail." });
    items.push({ k: "p", t: " " });
    items.push({ k: "p", t: "Remis au salarié le ........................" });
    items.push({ k: "p", t: "Signature du salarié :" });
    items.push({ k: "p", t: "Pour l'entreprise, " + (p.responsable || "") });

    var titre = "Décompte des heures - " + qui.nom + " - " + MOIS[mo] + " " + an;
    var nom = "decompte-heures-" + qui.id + "-" + an + "-" + ("0" + (mo + 1)).slice(-2) + ".docx";
    window.AuditExport.telecharger(window.AuditExport.docx(items, titre),
      nom, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
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

    ["r-deb", "r-fin"].forEach(function (id) {
      $(id).addEventListener("blur", function () {
        var r = refDe(qui.id);
        $(id).value = normaliser($(id).value);
        if (id === "r-deb") r.d = $(id).value; else r.f = $(id).value;
        garderRef(qui.id, r);
        construire(); rendreIdentite(); dessinerJours(); calculer();
      });
    });
    $("r-pause").addEventListener("input", function () {
      var r = refDe(qui.id);
      $("r-pause").value = $("r-pause").value.replace(/[^0-9]/g, "");
      r.p = $("r-pause").value;
      garderRef(qui.id, r);
      construire(); rendreIdentite(); dessinerJours(); calculer();
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
        le: iso(d),
        heure: ("0" + d.getHours()).slice(-2) + "h" + ("0" + d.getMinutes()).slice(-2),
        empreinte: empreinte(m),
      };
      garderMois(m);
      rendreMois(); dessinerJours(); calculer();
      $("sceau").scrollIntoView({ behavior: "smooth", block: "center" });
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

    $("b-excel").addEventListener("click", classeur);
    $("b-word").addEventListener("click", word);

    tout();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();

})(window, document);
