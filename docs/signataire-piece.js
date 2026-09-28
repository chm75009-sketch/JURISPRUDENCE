/* LE SIGNATAIRE D'UNE PIÈCE DÉPOSÉE, COMPARÉ À CELUI DE LA FICHE.

   Demande du 26 septembre 2026 : « alerter quand une pièce porte un autre
   signataire ». Le dossier d'origine portait « Chadi EL AFAI » quand les pièces
   déposées par l'entreprise écrivent « EL SAFADI », et rien ne relevait l'écart.
   Un document produit au nom d'un signataire que ses propres pièces ne
   connaissent pas se défend mal.

   Ce que fait ce module, et rien d'autre : dans le texte déposé sur un écran de
   contrôle, il cherche les formules par lesquelles un écrit se signe, en relève
   le nom, et le compare à celui de la fiche. S'ils diffèrent, il l'écrit, avec
   la phrase exacte de la pièce. Il ne corrige rien : c'est l'employeur qui sait
   lequel des deux est le bon.

   Le rapprochement se fait sur le nom de famille, en capitales, sans accents et
   sans la civilité : « Monsieur Chadi EL SAFADI » et « EL SAFADI Chadi » sont la
   même personne, « EL AFAI » non.

     SignatairePiece.trouves(texte)   -> [{ nom, phrase }]
     SignatairePiece.ecart(texte, profil) -> null, ou { attendu, trouves[] }
     SignatairePiece.veiller(idZone, idDepot)  branche l'alerte sur un écran */
(function (global) {
  "use strict";

  /* Les formules par lesquelles un écrit se signe. Chacune a été relevée dans
     une pièce réelle du dossier. */
  var FORMULES = [
    /je\s+soussign[ée]{1,2}\s*,?\s*([^,.;\n(]{3,60})/gi,
    /repr[ée]sent[ée]e?\s+par\s*,?\s*([^,.;\n(]{3,60})/gi,
    /agissant\s+en\s+qualit[ée]\s+de\s+[^,\n]{2,40},?\s*([A-ZÀ-Þ][^,.;\n(]{2,60})/g,
    /(?:le|la)\s+(?:g[ée]rant|g[ée]rante|pr[ée]sident|pr[ée]sidente|directeur|directrice)\s*,?\s*([^,.;\n(]{3,60})/gi,
    /pour\s+l['’]employeur\s*,?\s*([^,.;\n(]{3,60})/gi,
    /signature\s*(?:du|de\s+la)?\s*(?:g[ée]rant|g[ée]rante|employeur)?\s*:\s*([^,.;\n(]{3,60})/gi,
  ];

  var CIVILITES = /^(monsieur|madame|mademoiselle|mme|mlle|m\.|mr)\s+/i;

  function sansAccent(t) {
    try {
      return String(t == null ? "" : t).normalize("NFD").replace(/[̀-ͯ]/g, "");
    } catch (e) { return String(t == null ? "" : t); }
  }

  /* Le nom de famille d'une identité : les mots en capitales s'il y en a, le
     dernier mot sinon. « Chadi EL SAFADI » rend « EL SAFADI », « Chadi el
     safadi » rend « safadi », et la comparaison se fait sans casse. */
  function famille(identite) {
    var t = String(identite == null ? "" : identite).replace(CIVILITES, "").trim();
    t = t.replace(/\s+/g, " ");
    if (!t) return "";
    var mots = t.split(" ").filter(Boolean);
    var caps = mots.filter(function (m) {
      return m.length > 1 && sansAccent(m) === sansAccent(m).toUpperCase() && /[A-Z]/i.test(sansAccent(m));
    });
    var choix = caps.length && caps.length < mots.length ? caps : mots.slice(-1);
    return sansAccent(choix.join(" ")).toUpperCase().replace(/[^A-Z0-9 ]/g, "").trim();
  }

  /* Les signataires que la pièce nomme, avec la phrase où chacun est pris. */
  function trouves(texte) {
    var t = String(texte == null ? "" : texte);
    var out = [], vus = {};
    FORMULES.forEach(function (re) {
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(t))) {
        var brut = String(m[1] || "").trim().replace(/\s+/g, " ");
        if (!brut) continue;
        /* Un mot seul en bas de casse n'est pas un nom : c'est la suite de la
           phrase, « je soussigné atteste que ». */
        if (!/[A-ZÀ-Þ]/.test(brut)) continue;
        var cle = famille(brut);
        if (!cle || cle.length < 3 || vus[cle]) continue;
        vus[cle] = true;
        var debut = Math.max(0, m.index);
        var fin = Math.min(t.length, m.index + m[0].length + 30);
        out.push({ nom: brut, famille: cle,
          phrase: t.slice(debut, fin).replace(/\s+/g, " ").trim() });
      }
    });
    return out;
  }

  /* L'écart, ou rien. La fiche vide ne produit aucune alerte : on ne reproche
     pas à une pièce de nommer quelqu'un quand on ne sait pas qui attendre. */
  function ecart(texte, profil) {
    var p = profil || {};
    var attendu = String(p.responsableNom || "").trim() ||
      String(p.responsable || "").split(",")[0].trim();
    if (!attendu) return null;
    var cle = famille(attendu);
    if (!cle) return null;
    var L = trouves(texte).filter(function (x) {
      /* Le même nom écrit autrement n'est pas un écart : on compare les noms de
         famille, et l'un peut contenir l'autre, « EL SAFADI » et « SAFADI ». */
      return x.famille !== cle && x.famille.indexOf(cle) < 0 && cle.indexOf(x.famille) < 0;
    });
    return L.length ? { attendu: attendu, trouves: L } : null;
  }

  function ech(t) {
    return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function html(e) {
    if (!e) return "";
    var n = e.trouves.length;
    return '<div class="avis att sig-ecart"><b>La pièce déposée porte ' +
      (n > 1 ? "d'autres signataires" : "un autre signataire") + " que votre fiche</b>" +
      "<p>Votre fiche d'entreprise porte " + ech(e.attendu) + ". La pièce nomme " +
      (n > 1 ? "aussi " : "") +
      e.trouves.map(function (x) { return "<b>" + ech(x.nom) + "</b>"; }).join(", ") + " : " +
      e.trouves.map(function (x) { return "« " + ech(x.phrase) + " »"; }).join(" ; ") + ".</p>" +
      "<p>Rien n'est corrigé : c'est vous qui savez lequel est le bon. Si c'est " +
      "la pièce, corrigez la fiche d'entreprise ; si c'est la fiche, la pièce " +
      "est à refaire au bon nom, parce que c'est elle qu'on produira.</p></div>";
  }

  /* L'alerte sur un écran de contrôle : la zone de dépôt porte l'identifiant
     « depot » sur les sept écrans, et la boîte d'alerte se pose juste après. */
  function veiller(idZone, idDepot) {
    var doc = global.document;
    if (!doc) return;
    var depot = doc.getElementById(idDepot || "depot");
    if (!depot) return;
    var zone = idZone ? doc.getElementById(idZone) : null;
    if (!zone) {
      zone = doc.createElement("div");
      zone.id = "sig-alerte";
      zone.hidden = true;
      if (depot.parentNode) depot.parentNode.insertBefore(zone, depot.nextSibling);
    }
    function relire() {
      var p = (global.Profil && global.Profil.lire) ? global.Profil.lire() : null;
      var e = ecart(depot.value, p);
      zone.innerHTML = html(e);
      zone.hidden = !e;
      /* UNE ALERTE DANS UN REPLI FERMÉ N'EST PAS UNE ALERTE. La zone de dépôt
         de plusieurs écrans vit sous « Ou coller le texte » : l'écart s'écrivait
         dans un panneau replié, où personne ne le voyait. Relevé le
         28 septembre 2026 en écrivant le contrôle. */
      if (e) {
        var n = zone.parentNode;
        while (n && n.nodeType === 1) {
          if (n.tagName === "DETAILS" && !n.open) n.open = true;
          n = n.parentNode;
        }
      }
    }
    depot.addEventListener("input", relire);
    depot.addEventListener("change", relire);
    relire();
    return relire;
  }

  global.SignatairePiece = { trouves: trouves, ecart: ecart, html: html,
    famille: famille, veiller: veiller };

  /* Les sept écrans de contrôle portent la même zone de dépôt, « depot » : le
     module s'y branche seul, pour qu'aucun n'oublie l'alerte et qu'il n'y ait
     rien à écrire dans chacun. Si l'écran pose sa propre zone d'alerte, il la
     nomme « sig-alerte » et elle est reprise telle quelle. */
  if (global.document) {
    var lancer = function () {
      if (global.document.getElementById("depot")) veiller("sig-alerte", "depot");
    };
    if (global.document.readyState === "loading")
      global.document.addEventListener("DOMContentLoaded", lancer);
    else lancer();
  }
})(typeof window !== "undefined" ? window : this);
