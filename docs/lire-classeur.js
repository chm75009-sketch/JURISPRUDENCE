/* LIRE UN CLASSEUR EXCEL DANS LE NAVIGATEUR.

   POURQUOI CE FICHIER EXISTE

   L'application sait écrire des .xlsx depuis le 8 septembre 2026
   (tableur-export.js), mais pas en lire un. Or les clients arrivent avec leurs
   propres tableaux : le 16 septembre 2026, l'état de parc de TEC, quatre-vingt-
   dix véhicules dans un classeur sans ligne d'en-tête. Les retaper à la main
   n'a pas de sens.

   CE QUE FAIT CE FICHIER

   Il ouvre un .xlsx et rend un tableau de lignes de texte. Rien d'autre : ni
   formules, ni styles, ni dates typées. Une date lue rend le nombre de jours
   d'Excel si la cellule est numérique, et le texte tel quel sinon, le
   rapprochement se fait ailleurs, sur des valeurs.

   COMMENT

   Un .xlsx est une archive zip de fichiers XML. On lit le répertoire central
   de l'archive, on décompresse les deux seules entrées utiles, la feuille et
   la table des chaînes partagées, avec DecompressionStream, présent dans
   Safari depuis la version 16.4 et dans Chrome depuis la 80. Sans lui, le
   fichier le dit au lieu d'échouer en silence.

   USAGE

     LireClasseur.fichier(file)   →  Promise([[texte, ...], ...])
     LireClasseur.texte(chaine)   →  [[texte, ...], ...]   (collé d'Excel)
     LireClasseur.possible()      →  true si le navigateur sait décompresser

   Tout se fait sur le poste : rien n'est envoyé.                            */

"use strict";
(function (window) {

  function possible() {
    return typeof window.DecompressionStream === "function";
  }

  /* ─────────────────────────────── le zip ───────────────────────────────── */

  function u16(v, i) { return v[i] | (v[i + 1] << 8); }
  function u32(v, i) { return (v[i] | (v[i + 1] << 8) | (v[i + 2] << 16) | (v[i + 3] << 24)) >>> 0; }

  function entrees(octets) {
    /* La fin du répertoire central se cherche depuis la fin : sa signature
       est 0x06054b50, et le commentaire qui la suit fait au plus 65 535. */
    var fin = -1;
    for (var i = octets.length - 22; i >= 0 && i >= octets.length - 65558; i--) {
      if (u32(octets, i) === 0x06054b50) { fin = i; break; }
    }
    if (fin < 0) return null;
    var nb = u16(octets, fin + 10);
    var debut = u32(octets, fin + 16);
    var out = {}, p = debut;
    for (var k = 0; k < nb; k++) {
      if (u32(octets, p) !== 0x02014b50) break;
      var methode = u16(octets, p + 10);
      var taille = u32(octets, p + 20);
      var brute = u32(octets, p + 24);
      var lnom = u16(octets, p + 28);
      var lextra = u16(octets, p + 30);
      var lcom = u16(octets, p + 32);
      var offset = u32(octets, p + 42);
      var nom = "";
      for (var n = 0; n < lnom; n++) nom += String.fromCharCode(octets[p + 46 + n]);
      try { nom = decodeURIComponent(escape(nom)); } catch (e) {}
      out[nom] = { methode: methode, taille: taille, brute: brute, offset: offset };
      p += 46 + lnom + lextra + lcom;
    }
    return out;
  }

  function donnees(octets, e) {
    if (u32(octets, e.offset) !== 0x04034b50) return null;
    var lnom = u16(octets, e.offset + 26);
    var lextra = u16(octets, e.offset + 28);
    var debut = e.offset + 30 + lnom + lextra;
    return octets.subarray(debut, debut + e.taille);
  }

  function enTexte(octets, e) {
    var brut = donnees(octets, e);
    if (!brut) return Promise.resolve("");
    if (e.methode === 0) return Promise.resolve(new TextDecoder("utf-8").decode(brut));
    if (e.methode !== 8 || !possible()) return Promise.reject(new Error("compression"));
    var flux = new Blob([brut]).stream().pipeThrough(new window.DecompressionStream("deflate-raw"));
    return new Response(flux).arrayBuffer().then(function (b) {
      return new TextDecoder("utf-8").decode(new Uint8Array(b));
    });
  }

  /* ─────────────────────────────── le XML ───────────────────────────────── */

  function sansBalises(x) {
    return String(x || "").replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, function (m, d) {
        return String.fromCharCode(parseInt(d, 10));
      }).replace(/&amp;/g, "&");
  }

  function chaines(xml) {
    if (!xml) return [];
    var out = [];
    var re = /<si\b[^>]*>([\s\S]*?)<\/si>/g, m;
    while ((m = re.exec(xml))) {
      var t = "", rt = /<t\b[^>]*>([\s\S]*?)<\/t>/g, x;
      while ((x = rt.exec(m[1]))) t += sansBalises(x[1]);
      out.push(t);
    }
    return out;
  }

  function colonne(ref) {
    var m = /^([A-Z]+)/.exec(String(ref || ""));
    if (!m) return 0;
    var n = 0;
    for (var i = 0; i < m[1].length; i++) n = n * 26 + (m[1].charCodeAt(i) - 64);
    return n - 1;
  }

  function feuille(xml, partagees) {
    var lignes = [];
    /* Les attributs se lisent sans gourmandise : sinon « <c r="E88"/> », une
       cellule vide refermée sur elle-même, avale la cellule suivante et sa
       valeur se retrouve une colonne trop à gauche. Mesuré le 16 septembre
       2026 sur l'état de parc de TEC, quatre lignes décalées. */
    var reL = /<row\b[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g, mL;
    while ((mL = reL.exec(xml))) {
      var cellules = [], contenu = mL[1] || "";
      var reC = /<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g, mC;
      while ((mC = reC.exec(contenu))) {
        var attrs = mC[1] || "", dedans = mC[2] || "";
        var ref = /r="([A-Z]+\d+)"/.exec(attrs);
        var type = /t="([a-zA-Z]+)"/.exec(attrs);
        var i = ref ? colonne(ref[1]) : cellules.length;
        var v = "";
        if (type && type[1] === "inlineStr") {
          var ti = /<t\b[^>]*>([\s\S]*?)<\/t>/.exec(dedans);
          v = ti ? sansBalises(ti[1]) : "";
        } else {
          var vv = /<v>([\s\S]*?)<\/v>/.exec(dedans);
          v = vv ? sansBalises(vv[1]) : "";
          if (type && type[1] === "s") v = partagees[parseInt(v, 10)] || "";
        }
        while (cellules.length < i) cellules.push("");
        cellules[i] = v;
      }
      lignes.push(cellules);
    }
    return lignes;
  }

  /* ─────────────────────────────── l'entrée ─────────────────────────────── */

  function fichier(f) {
    if (!f) return Promise.reject(new Error("aucun fichier"));
    if (!possible()) return Promise.reject(new Error("navigateur"));
    return f.arrayBuffer().then(function (b) {
      var octets = new Uint8Array(b);
      var rep = entrees(octets);
      if (!rep) throw new Error("archive");
      /* La première feuille du classeur, quel que soit son numéro. */
      var nomFeuille = null;
      Object.keys(rep).forEach(function (n) {
        if (!/^xl\/worksheets\/sheet\d+\.xml$/.test(n)) return;
        if (!nomFeuille || n < nomFeuille) nomFeuille = n;
      });
      if (!nomFeuille) throw new Error("feuille");
      var lireChaines = rep["xl/sharedStrings.xml"]
        ? enTexte(octets, rep["xl/sharedStrings.xml"]) : Promise.resolve("");
      return Promise.all([enTexte(octets, rep[nomFeuille]), lireChaines])
        .then(function (r) { return feuille(r[0], chaines(r[1])); });
    });
  }

  /* Un tableau collé depuis Excel arrive en colonnes séparées par des
     tabulations ; un fichier enregistré en CSV, par des points-virgules. */
  function texte(t) {
    var lignes = String(t || "").split(/\r?\n/).filter(function (l) { return l.trim(); });
    if (!lignes.length) return [];
    var sep = "\t";
    var compte = function (c) {
      var n = 0;
      lignes.slice(0, 10).forEach(function (l) { n += l.split(c).length - 1; });
      return n;
    };
    [";", ",", "|"].forEach(function (c) { if (compte(c) > compte(sep)) sep = c; });
    return lignes.map(function (l) {
      return l.split(sep).map(function (c) { return c.trim().replace(/^"|"$/g, ""); });
    });
  }

  window.LireClasseur = { fichier: fichier, texte: texte, possible: possible };
})(window);
