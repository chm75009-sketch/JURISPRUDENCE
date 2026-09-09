/* LA FEUILLE : le texte d'un générateur devient une page, avec de vrais
   tableaux.

   Les générateurs écrivent du texte, ligne à ligne. Ce module le lit et le
   rend : titres, paragraphes, puces, notes, et surtout les tableaux, qui
   sont écrits en colonnes séparées par une barre verticale :

     Risque | Exposition | Mesure
     Chute de hauteur | tous les jours | garde-corps

   À l'écran, c'est un tableau HTML. En Word, un tableau Word bordé. En
   Excel, une feuille par tableau. Jamais du texte à chasse fixe : demande
   du 9 septembre 2026, « faire de vrais beaux tableaux ».

   Trois autres formes sont reconnues :
     EXEMPLE ...        une ligne qui commence par EXEMPLE : un bandeau qui
                        dit que ce qui suit est un exemple, à adapter.
     NOTE ...           une note, en retrait, qui ne part pas dans le Word.
     http(s)://...      un lien, cliquable à l'écran.

   Le module ne dépend de rien. Les pages qui exportent en Word passent par
   AuditExport, celles qui exportent en Excel par TableurExport. */
(function (global) {
  "use strict";

  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function propre(t) {
    return String(t == null ? "" : t).replace(/[—–]/g, "-").replace(/ /g, " ");
  }
  function estSeparateur(l) { return /^[\s|:\-─═]+$/.test(l) && l.indexOf("-") >= 0; }
  function cellules(l) {
    var c = l.split("|").map(function (x) { return x.trim(); });
    if (c.length && c[0] === "") c.shift();
    if (c.length && c[c.length - 1] === "") c.pop();
    return c;
  }
  function estLigneTable(l) {
    if (l.indexOf("|") < 0) return false;
    if (/https?:\/\//.test(l)) return false;
    return cellules(l).length >= 2;
  }

  /* Le texte en blocs. */
  function blocs(t) {
    t = propre(t);
    var lignes = t.split("\n"), b = [], para = [], premier = true, table = null;
    function viderTable() {
      if (!table) return;
      var nb = table.reduce(function (m, l) { return Math.max(m, l.length); }, 0);
      var rows = table.map(function (l) { while (l.length < nb) l.push(""); return l; });
      b.push({ k: "table", head: rows[0], rows: rows.slice(1) });
      table = null;
    }
    function vider() {
      if (!para.length) return;
      var texte = para.map(function (s) { return s.trim(); }).join(" ");
      var capitales = !/[a-zà-ÿ]/.test(para[0]);
      if (premier) {
        para.forEach(function (l) { b.push({ k: "p", t: l.trim() }); });
      } else if (/^EXEMPLE\b/.test(texte)) {
        b.push({ k: "exemple", t: texte });
      } else if (capitales && para.length >= 2 && /^\s*\(/.test(para[1])) {
        b.push({ k: "t1", t: para[0].trim() });
        b.push({ k: "st", t: para.slice(1).map(function (s) { return s.trim(); }).join(" ") });
      } else if (capitales && texte.length < 120) {
        b.push({ k: "h1", t: texte });
      } else if (/^NOTE\b/.test(texte)) {
        b.push({ k: "note", t: texte });
      } else if (/https?:\/\//.test(texte) && para.length === 1) {
        b.push({ k: "lien", t: texte });
      } else if (para.every(function (l) { return /^\s{2,}/.test(l) || /^\s*[-•·]\s/.test(l); })) {
        para.forEach(function (l) {
          if (/https?:\/\//.test(l)) b.push({ k: "lien", t: l.trim().replace(/^[-•·]\s*/, "") });
          else b.push({ k: "puce", t: l.trim().replace(/^[-•·]\s*/, "") });
        });
      } else if (para.length >= 2 && para.every(function (l) { return /^[^:]{2,70} ?:/.test(l.trim()); })) {
        para.forEach(function (l) { b.push({ k: "p", t: l.trim() }); });
      } else {
        b.push({ k: "p", t: texte });
      }
      premier = false;
      para = [];
    }
    lignes.forEach(function (l) {
      if (estLigneTable(l) || (table && estSeparateur(l))) {
        vider();
        if (estSeparateur(l)) return;
        if (!table) table = [];
        table.push(cellules(l));
        return;
      }
      viderTable();
      if (!l.trim()) { vider(); return; }
      if (/^[─═_\-\s]{6,}$/.test(l.trim())) { vider(); b.push({ k: "trait", t: "" }); return; }
      if (/^[═─]{2,}\s.*\s[═─]{2,}$/.test(l.trim())) { vider(); b.push({ k: "h1", t: l.trim().replace(/^[═─]+\s*|\s*[═─]+$/g, "") }); return; }
      para.push(l);
    });
    vider(); viderTable();
    return b;
  }

  /* Un lien dans un texte devient cliquable. */
  function avecLiens(t) {
    var h = "", re = /https?:\/\/[^\s<>"')\]]+/g, m, i = 0;
    while ((m = re.exec(t))) {
      h += ech(t.slice(i, m.index));
      var u = m[0].replace(/[.,;]$/, "");
      h += '<a href="' + ech(u) + '" target="_blank" rel="noopener">' + ech(u) + "</a>" + ech(m[0].slice(u.length));
      i = m.index + m[0].length;
    }
    return h + ech(t.slice(i));
  }

  function tableHtml(b, editable) {
    var e = editable ? ' contenteditable="true"' : "";
    var h = '<div class="fd-cadre"><table class="fd-table"><thead><tr>';
    b.head.forEach(function (c) { h += "<th" + e + ">" + ech(c) + "</th>"; });
    h += "</tr></thead><tbody>";
    b.rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (c) { h += "<td" + e + (c ? "" : ' class="vide"') + ">" + ech(c) + "</td>"; });
      h += "</tr>";
    });
    return h + "</tbody></table></div>";
  }

  /* Les blocs en page. options.editable : chaque bloc se corrige en place.
     options.classe : la classe du conteneur (« feuille » par défaut). */
  function html(bs, options) {
    options = options || {};
    var editable = options.editable !== false;
    var e = editable ? ' contenteditable="true"' : "";
    var h = '<div class="' + (options.classe || "feuille") + ' fd">';
    bs.forEach(function (b) {
      if (b.k === "trait" || b.k === "saut") { h += '<hr class="b-' + b.k + '" data-k="' + b.k + '">'; return; }
      if (b.k === "table") { h += tableHtml(b, editable); return; }
      if (b.k === "lien") { h += '<div class="b-lien" data-k="lien">' + avecLiens(b.t) + "</div>"; return; }
      if (b.k === "exemple") { h += '<div class="b-exemple" data-k="exemple"' + e + ">" + ech(b.t) + "</div>"; return; }
      h += '<div class="b-' + b.k + '" data-k="' + b.k + '"' + e + ">" + ech(b.t) + "</div>";
    });
    return h + "</div>";
  }

  function texteDe(el) {
    var t = el.innerText !== undefined && el.innerText !== null ? el.innerText : el.textContent;
    return propre(t).replace(/\s+/g, " ").trim();
  }
  /* La page relue, telle que l'utilisateur l'a corrigée. */
  function relire(racine) {
    var out = [];
    Array.prototype.forEach.call(racine.children, function (el) {
      if (el.tagName === "HR") { out.push({ k: el.getAttribute("data-k") || "trait", t: "" }); return; }
      if (el.classList.contains("fd-cadre")) {
        var lignes = [];
        el.querySelectorAll("tr").forEach(function (tr) {
          lignes.push(Array.prototype.map.call(tr.children, texteDe));
        });
        if (lignes.length) out.push({ k: "table", head: lignes[0], rows: lignes.slice(1) });
        return;
      }
      out.push({ k: el.getAttribute("data-k") || "p", t: texteDe(el) });
    });
    return out;
  }

  /* Les blocs en texte, la forme d'origine : c'est ce qui s'enregistre et
     ce qui se copie. */
  function texte(bs) {
    var L = [];
    bs.forEach(function (b) {
      if (b.k === "trait") { L.push("", "------------------------------", ""); return; }
      if (b.k === "saut") { L.push("", ""); return; }
      if (b.k === "table") {
        L.push("");
        L.push(b.head.join(" | "));
        L.push(b.head.map(function () { return "---"; }).join(" | "));
        b.rows.forEach(function (r) { L.push(r.join(" | ")); });
        L.push("");
        return;
      }
      if (b.k === "puce") { L.push("  " + b.t); return; }
      if (b.k === "h1" || b.k === "t1" || b.k === "exemple") { L.push("", b.t, ""); return; }
      L.push(b.t, "");
    });
    return L.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  /* Les blocs vers le Word commun (AuditExport). Les notes ne partent pas :
     elles s'adressent à celui qui remplit, pas à celui qui lit. */
  var VERS_WORD = { t1: "t1", st: "sur", h1: "h1", h2: "h2", p: "p", puce: "puce",
    lien: "p", sign: "p", trait: "trait", saut: "saut" };
  function items(bs) {
    var out = [];
    bs.forEach(function (b) {
      if (b.k === "note") return;
      if (b.k === "table") { out.push({ k: "table", head: b.head, rows: b.rows }); return; }
      if (b.k === "exemple") { out.push({ k: "enc", titre: "Exemple", t: b.t }); return; }
      out.push({ k: VERS_WORD[b.k] || "p", t: b.t });
    });
    return out;
  }
  function docx(bs, titre) {
    var its = items(bs);
    var t = its.length && its[0].k === "t1" ? its.shift().t : titre;
    return global.AuditExport.docx(its, t);
  }

  /* Les tableaux de la page, une feuille chacun, pour TableurExport. Le
     titre de la feuille est le dernier titre lu avant le tableau. */
  function tableaux(bs) {
    var f = [], titre = "", n = 0;
    bs.forEach(function (b) {
      if (b.k === "h1" || b.k === "t1") titre = b.t;
      if (b.k !== "table") return;
      n++;
      f.push({ titre: (titre || "Tableau " + n).slice(0, 31), lignes: [b.head].concat(b.rows) });
    });
    return f;
  }

  var CSS = ".fd .fd-cadre{overflow:auto;margin:6px 0 14px;border:1px solid #d5d9e0;border-radius:8px;-webkit-overflow-scrolling:touch}" +
    ".fd table.fd-table{border-collapse:separate;border-spacing:0;font:14px/1.4 system-ui,sans-serif;min-width:100%}" +
    ".fd table.fd-table th,.fd table.fd-table td{border-bottom:1px solid #e3e6eb;border-right:1px solid #e3e6eb;padding:7px 9px;text-align:left;vertical-align:top;min-width:110px;max-width:260px;white-space:normal}" +
    ".fd table.fd-table th{position:sticky;top:0;background:#eef1f5;font-weight:600;font-size:13px;color:#2d3540}" +
    ".fd table.fd-table td.vide{background:#fafbfc}" +
    ".fd table.fd-table th:last-child,.fd table.fd-table td:last-child{border-right:0}" +
    ".fd table.fd-table tr:last-child td{border-bottom:0}" +
    ".fd .b-exemple{margin:10px 0 12px;padding:10px 12px;border-radius:8px;background:#fff6dc;border:1px solid #f0d78a;font:600 14px/1.45 system-ui,sans-serif;color:#5a4300}" +
    ".fd .b-lien{margin:0 0 8px;font-size:15px;line-height:1.5;word-break:break-word}" +
    ".fd .b-lien a{color:#1f4e9a}" +
    ".fd .b-note{margin:9px 0 12px;padding:0 0 0 10px;border-left:2px dashed #cfd4dc;font-size:13.5px;color:#5f6874}" +
    ".fd [contenteditable]{outline:none}.fd [contenteditable]:focus{background:#fffbe9}" +
    "@media print{.fd .fd-cadre{overflow:visible;border:0}.fd table.fd-table th{position:static}}";
  var styleMis = false;
  function style() {
    if (styleMis || typeof document === "undefined") return;
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    styleMis = true;
  }

  global.FeuilleDoc = { blocs: blocs, html: html, tableHtml: tableHtml, relire: relire, texte: texte,
    items: items, docx: docx, tableaux: tableaux, style: style, ech: ech, avecLiens: avecLiens };
})(typeof window !== "undefined" ? window : this);
