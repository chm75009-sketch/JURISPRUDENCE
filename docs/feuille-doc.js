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

  /* Les blancs à remplir se voient. Partout dans l'application, ce que
     l'application ne peut pas connaître sort entre crochets plutôt que d'être
     inventé ; encore faut-il que l'employeur les repère avant de déposer son
     document. Demande du 12 septembre 2026 : en rouge.

     Le style est écrit dans la balise, et non dans une feuille : il y a une
     copie du style des feuilles dans chaque page qui en affiche, et un
     document imprimé ou collé ailleurs perdrait la couleur. */
  var STYLE_BLANC = "color:#b3261e;font-weight:600";
  function blancs(h) {
    /* 400 et non 200 depuis le 25 septembre 2026 : voir audit-export.js, les
       deux bornes doivent rester égales, sinon l'écran et le Word ne colorent
       pas les mêmes blancs. */
    return h.replace(/\[[^\[\]\n]{1,400}\]/g, function (m) {
      return '<span class="fd-blanc" style="' + STYLE_BLANC + '">' + m + "</span>";
    });
  }
  function propre(t) {
    return String(t == null ? "" : t).replace(/[-]/g, "-").replace(/ /g, " ")
      .replace(/│/g, "|");
  }
  /* LES TABLEAUX DESSINÉS AU TRAIT.

     Des générateurs encadrent leurs tableaux avec les caractères de dessin
     des boîtes. Rendus tels quels, le cadre sortait en texte et les cellules
     se coupaient, « 1°) » seul sur une ligne. La barre verticale de dessin
     devient le séparateur de cellules, les lignes qui ne portent que du
     cadre se jettent, et le tableau redevient un tableau. Relevé le
     26 septembre 2026. */
  function estCadre(l) {
    /* Un angle ou un croisement est exigé : un simple filet de ─, qui sépare
       deux parties d'un document, reste un filet et se rend comme tel. */
    return /^[\s┌┬┐├┼┤└┴┘─═|+:]+$/.test(l) && /[┌┬┐├┼┤└┴┘]/.test(l);
  }
  function estSeparateur(l) {
    return /^[\s|:\-─═_]+$/.test(l) && /[-─═_]/.test(l);
  }
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
  /* TOUT CE QUI EST EN CAPITALES N'EST PAS UN TITRE.

     « TOTAL BRUT : [MONTANT] € » et « L. 1234-19, D. 1234-6 » sortaient en
     titres de niveau 1 dans le Word, faute d'une minuscule. Relevé le
     27 septembre 2026. Deux marques les séparent d'un vrai titre : un titre ne
     porte pas de valeur après un deux-points, et il contient au moins un mot de
     trois lettres capitales. Une liste de numéros d'articles n'en a aucun. */
  function estTitre(t) {
    var s = String(t == null ? "" : t).trim();
    if (/:\s*\S/.test(s)) return false;
    return /[A-ZÀ-Þ]{3}/.test(s);
  }

  function blocs(t) {
    t = propre(t);
    var lignes = t.split("\n"), b = [], para = [], premier = true, table = null;
    var cadreVu = false, tableCadre = false;
    function viderTable() {
      if (!table) return;
      /* Dans un tableau dessiné au trait, une cellule trop longue est écrite
         sur deux lignes, et la seconde n'a pas de première colonne : elle
         rejoint la ligne du dessus au lieu d'en former une nouvelle. */
      var jointes = [];
      table.forEach(function (l) {
        var avant = jointes.length ? jointes[jointes.length - 1] : null;
        if (tableCadre && avant && !String(l[0] == null ? "" : l[0]).trim()) {
          l.forEach(function (c, i) {
            if (!String(c == null ? "" : c).trim()) return;
            avant[i] = avant[i] ? avant[i] + " " + c : c;
          });
          return;
        }
        /* SANS TRAIT NON PLUS, UNE CELLULE COUPÉE RESTE UNE CELLULE.

           Relevé le 27 septembre 2026 dans le calendrier des négociations : le
           tableau n'était pas dessiné au trait, et un intitulé de trois lignes
           donnait trois lignes de tableau, dont deux n'avaient que leur
           première colonne. La suite d'un intitulé se reconnaît à ce que la
           ligne précédente n'est pas finie : elle ne s'arrête ni sur un point,
           ni sur un point-virgule, ni sur un deux-points. */
        var tete = String(l[0] == null ? "" : l[0]).trim();
        var suite = avant && tete &&
          l.slice(1).every(function (c) { return !String(c == null ? "" : c).trim(); }) &&
          !/[.;:!?]$/.test(String(avant[0] == null ? "" : avant[0]).trim()) &&
          /* Une ligne entièrement en capitales est un intitulé à elle seule,
             « TOTAL » ou « NIVEAU DE RÉSULTAT » : elle ne continue rien. */
          !/^[A-ZÀ-Þ][A-ZÀ-Þ\s'’,-]*$/.test(tete);
        if (suite) {
          avant[0] = avant[0] + " " + String(l[0]).trim();
          return;
        }
        jointes.push(l.slice());
      });
      var nb = jointes.reduce(function (m, l) { return Math.max(m, l.length); }, 0);
      var rows = jointes.map(function (l) { while (l.length < nb) l.push(""); return l; });
      b.push({ k: "table", head: rows[0], rows: rows.slice(1) });
      table = null;
      tableCadre = false;
      cadreVu = false;
    }
    function vider() {
      if (!para.length) return;
      /* UN ARTICLE NUMÉROTÉ SEUL SUR SON PARAGRAPHE EST UN TITRE. « Article 12
         - Usage des biens » se rendait en texte courant, faute d'être en
         capitales : les trente et un articles du règlement intérieur
         disparaissaient dans le corps, à l'écran comme dans le Word.
         La règle est volontairement étroite. Ailleurs dans le dépôt, les
         délibérations du comité écrivent « Article 1 - Le comité décide de
         recourir à une expertise sur le fondement de… » : l'article y EST la
         phrase, sur plusieurs lignes, et rien n'y est un titre. Exiger que la
         ligne soit seule entre deux blancs, et qu'elle ne finisse pas par un
         point, sépare les deux cas sans avoir à deviner. */
      if (!premier && para.length === 1 && /^(Article|ARTICLE)\s+\d+\b/.test(para[0]) &&
          para[0].trim().length <= 90 && !/\.$/.test(para[0].trim())) {
        b.push({ k: "h2", t: para[0].trim() });
        para = [];
        return;
      }
      /* UN TITRE EN CAPITALES NE SE COLLE PAS À CE QUI LE SUIT.

         « CONVOCATION ET ORDRE DU JOUR Réunion du comité social et économique
         du 12 octobre » sortait en un seul titre, et « ORDRE DU JOUR 1.
         Approbation du procès-verbal 2. ... » en une seule ligne : le
         générateur écrit le titre, puis ce qu'il annonce, sans ligne blanche
         entre les deux. Relevé le 27 septembre 2026. La première ligne part en
         titre, le reste repasse par les mêmes règles. La réserve du
         sous-titre entre parenthèses reste avant celle-ci. */
      if (!premier && para.length >= 2 && !/[a-zà-ÿ]/.test(para[0]) &&
          para[0].trim().length <= 90 && !/[.;,:]$/.test(para[0].trim()) &&
          estTitre(para[0]) &&
          /[a-zà-ÿ]/.test(para[1]) && !/^\s*\(/.test(para[1])) {
        b.push({ k: "h1", t: para[0].trim() });
        para = para.slice(1);
        vider();
        return;
      }
      var texte = para.map(function (s) { return s.trim(); }).join(" ");
      var capitales = !/[a-zà-ÿ]/.test(para[0]);
      /* Le premier paragraphe est l'en-tête de l'entreprise : ses lignes se
         rendent une par une, et non collées en un bloc. Sauf quand ce premier
         paragraphe est une ligne unique en capitales : là, c'est un titre, et
         c'est le cas des onglets qui n'ouvrent qu'un morceau de document, une
         formalité ou une rubrique de la base. Sans cette réserve, « RUBRIQUE 10
         - ENVIRONNEMENT » sortait en texte courant. */
      if (premier && !(capitales && para.length === 1 && texte.length < 120)) {
        para.forEach(function (l) { b.push({ k: "p", t: l.trim() }); });
      } else if (/^EXEMPLE\b/.test(texte)) {
        b.push({ k: "exemple", t: texte });
      } else if (capitales && para.length >= 2 && /^\s*\(/.test(para[1])) {
        b.push({ k: "t1", t: para[0].trim() });
        b.push({ k: "st", t: para.slice(1).map(function (s) { return s.trim(); }).join(" ") });
      } else if (capitales && texte.length < 120 && estTitre(texte)) {
        b.push({ k: "h1", t: texte });
      } else if (/^NOTE\b/.test(texte)) {
        b.push({ k: "note", t: texte });
      } else if (/https?:\/\//.test(texte) && para.length === 1) {
        b.push({ k: "lien", t: texte });
      } else if (para.every(function (l) { return /^\s{2,}/.test(l) || /^\s*[-•·]\s/.test(l); })) {
        /* UNE CITATION COUPÉE À SOIXANTE-DOUZE SIGNES N'EST PAS UNE LISTE.

           Les générateurs écrivent leur texte en lignes courtes, en retrait.
           Chacune devenait une puce : une citation de quatre lignes sortait
           en quatre puces, et une longue en trente. Une ligne sans marque,
           qui commence en minuscule et suit une ligne inachevée, continue la
           précédente : c'est une coupure de mise en page, pas un élément de
           plus. Relevé le 26 septembre 2026. */
        var items = [];
        para.forEach(function (l) {
          var brut = l.trim();
          var lien = /https?:\/\//.test(brut);
          var puce = /^[-•·]\s*/.test(brut);
          /* UNE LISTE DÉJÀ NUMÉROTÉE NE PREND PAS DE PUCE EN PLUS.

             L'échelle des sanctions du règlement intérieur est écrite « 1. »
             à « 5. », et son ordre est le sujet même de la clause. Rendue en
             liste à puces, elle sortait « - 1. L'avertissement ». Relevé le
             25 septembre 2026 : le numéro est dans le texte, la puce s'en
             va. */
          var numero = /^\d{1,2}[.)]\s/.test(brut);
          /* UNE LIGNE DE POINTS DE CONDUITE EST UN COUPLE, PAS UNE PHRASE.

             « Effectif ....... 82 salariés » se lit en deux colonnes sur une
             page à chasse fixe et se casse n'importe où sur un téléphone, où
             les points occupent la moitié de la largeur. Relevé le
             27 septembre 2026. Les points deviennent un deux-points, la ligne
             se suffit à elle-même, et rien ne s'y colle. */
          var conduite = /\.{4,}\s*\S/.test(brut);
          var avant = items.length ? items[items.length - 1] : null;
          if (conduite) {
            items.push({ t: brut.replace(/\s*\.{4,}\s*/, " : ").replace(/\s+:\s+:/, " :"),
              puce: false, numero: false, lien: false, seul: true });
            return;
          }
          if (avant && avant.seul) { items.push({ t: brut, puce: puce, numero: numero, lien: lien }); return; }
          /* UNE MISE EN VALEUR EN CAPITALES AU MILIEU D'UNE PHRASE N'OUVRE PAS
             UN ÉLÉMENT DE PLUS.

             « le comité se réunit au moins UNE FOIS PAR / MOIS ; ... au moins /
             UNE FOIS TOUS LES DEUX MOIS » donnait trois blocs, coupés en plein
             milieu. Relevé le 27 septembre 2026. Ce qui décide n'est pas la
             casse de la ligne qui suit, c'est que la ligne d'avant n'est pas
             finie : elle ne s'arrête ni sur un point, ni sur un point-virgule,
             ni sur un deux-points, ni sur une parenthèse fermante. */
          if (avant && !puce && !numero && !lien && !avant.lien &&
              !/[.:;»)\]]$/.test(avant.t)) {
            avant.t += " " + brut;
            return;
          }
          items.push({ t: brut.replace(/^[-•·]\s*/, ""), puce: puce, numero: numero, lien: lien });
        });
        items.forEach(function (x) {
          if (x.lien) b.push({ k: "lien", t: x.t });
          else if (x.seul) b.push({ k: "p", t: x.t });
          else if (x.numero) b.push({ k: "p", t: x.t });
          else if (x.puce) b.push({ k: "puce", t: x.t });
          /* Un seul bloc en retrait, sans marque : c'est un paragraphe. */
          else b.push({ k: items.length === 1 ? "p" : "puce", t: x.t });
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
      /* Une ligne de cadre ne porte aucun texte : elle se jette, et elle ne
         ferme pas le tableau qu'elle traverse. */
      if (estCadre(l)) { cadreVu = true; if (!table) vider(); return; }
      if (estLigneTable(l) || (table && estSeparateur(l))) {
        vider();
        if (estSeparateur(l)) return;
        if (!table) { table = []; tableCadre = cadreVu; }
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
    b.head.forEach(function (c) { h += "<th" + e + ">" + blancs(ech(c)) + "</th>"; });
    h += "</tr></thead><tbody>";
    b.rows.forEach(function (r) {
      h += "<tr>";
      r.forEach(function (c) { h += "<td" + e + (c ? "" : ' class="vide"') + ">" + blancs(ech(c)) + "</td>"; });
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
      if (b.k === "exemple") { h += '<div class="b-exemple" data-k="exemple"' + e + ">" + blancs(ech(b.t)) + "</div>"; return; }
      h += '<div class="b-' + b.k + '" data-k="' + b.k + '"' + e + ">" + blancs(ech(b.t)) + "</div>";
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
  /* UN BLOC DE SIGNATURE ALIGNÉ À L'ESPACE SORT SUR UNE SEULE LIGNE DANS WORD.

     « Le salarié                    Pour la Société » et les deux noms en
     dessous sont écrits avec des espaces, et la police du Word n'est pas à
     chasse fixe : les deux colonnes se mêlaient, et les retours à la ligne
     disparaissaient. Relevé le 27 septembre 2026. Deux colonnes séparées par
     trois espaces ou plus se rendent en tableau de deux colonnes, la première
     ligne servant d'en-tête. Un bloc d'une seule colonne reste un paragraphe,
     ligne par ligne. */
  function signature(t) {
    var lignes = String(t == null ? "" : t).split("\n")
      .map(function (l) { return l.replace(/\s+$/, ""); })
      .filter(function (l) { return l.trim() !== ""; });
    if (!lignes.length) return null;
    var coupe = lignes.map(function (l) {
      var m = l.match(/^(.*?\S)\s{3,}(\S.*)$/);
      return m ? [m[1].trim(), m[2].trim()] : [l.trim(), ""];
    });
    if (!coupe.some(function (c) { return c[1]; })) return null;
    /* Une mention qui se poursuit sous la première colonne, « (signature
       précédée de la mention » puis « « lu et approuvé » ) », rejoint la case
       du dessus : elle n'est pas une ligne de plus. */
    var jointes = [];
    coupe.forEach(function (c, i) {
      if (i && !c[1] && jointes.length) {
        var av = jointes[jointes.length - 1];
        av[0] = av[0] ? av[0] + " " + c[0] : c[0];
        return;
      }
      jointes.push(c);
    });
    return { k: "table", nu: true, head: jointes[0], rows: jointes.slice(1) };
  }
  function items(bs) {
    var out = [];
    bs.forEach(function (b) {
      if (b.k === "note") return;
      if (b.k === "table") { out.push({ k: "table", head: b.head, rows: b.rows, nu: b.nu }); return; }
      if (b.k === "exemple") { out.push({ k: "enc", titre: "Exemple", t: b.t }); return; }
      if (b.k === "sign") {
        var s = signature(b.t);
        if (s) { out.push(s); return; }
        String(b.t).split("\n").forEach(function (l) {
          if (l.trim()) out.push({ k: "p", t: l.trim() });
        });
        return;
      }
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
  /* UNE DATE ÉCRITE DANS UN TABLEAU EST UNE DATE, PAS DU TEXTE.

     Les colonnes de dates du classeur ne se triaient ni ne se filtraient : le
     générateur écrit « 02/04/2019 », et la cellule partait en texte. Relevé le
     27 septembre 2026. Une cellule qui ne contient QUE une date en chiffres
     devient une vraie date ; tout le reste est laissé tel quel, y compris
     « du 02/04/2019 au 27/09/2026 », qui est une phrase. */
  function dateCellule(c) {
    if (c instanceof Date || c === null || c === undefined) return c;
    var m = String(c).trim().match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
    if (!m) return c;
    var j = Number(m[1]), mo = Number(m[2]), a = Number(m[3]);
    if (mo < 1 || mo > 12 || j < 1 || j > 31) return c;
    var d = new Date(a, mo - 1, j);
    return (d.getDate() === j && d.getMonth() === mo - 1) ? d : c;
  }

  /* UN NOM D'ONGLET NE SE COUPE PAS AU MILIEU D'UN MOT. Le classeur du
     document unique ouvrait sur un onglet « DOCUMENT UNIQUE D'ÉVALUATION DE »,
     trente et un signes pile, le mot « DES » tranché en deux. Relevé le
     28 septembre 2026. On coupe au dernier mot entier qui tient. */
  /* Et il ne finit pas sur un article ou une préposition : « EX. 2.
     CONTRIBUTIONS À » se lit aussi mal qu'un mot tranché. */
  var PETITS = /\s+(à|a|de|des|du|d'|le|la|les|l'|et|en|au|aux|par|pour|sur|un|une)$/i;
  function couper(t, n) {
    t = String(t || "");
    if (t.length <= n) return t;
    var c = t.slice(0, n), i = c.lastIndexOf(" ");
    c = (i >= Math.floor(n / 2) ? c.slice(0, i) : c).replace(/[\s,;.]+$/, "");
    while (PETITS.test(c)) c = c.replace(PETITS, "");
    return c;
  }

  function tableaux(bs) {
    var f = [], titre = "", n = 0, vus = {}, doc = "", dansEx = false;
    bs.forEach(function (b) {
      /* L'EXEMPLE SE VOIT SUR L'ONGLET, PAS SEULEMENT DANS LE DOCUMENT.
         Le classeur du document unique donnait un onglet à la grille de
         l'entreprise fictive comme aux grilles à remplir, sans rien qui les
         distingue : on y lisait un procès-verbal n° 4 et un service de santé
         de Lagny-sur-Marne comme s'ils étaient ceux du client. Relevé le
         28 septembre 2026. Les onglets de l'exemple portent « EX. ». */
      if (b.k === "exemple") dansEx = true;
      else if ((b.k === "t1" || b.k === "h1") && /^(votre|vos)\b|À COMPLÉTER/i.test(String(b.t || "")))
        dansEx = false;
      /* Le dernier grand titre : il nomme l'onglet quand deux tableaux portent
         le même intitulé, « VOTRE CALENDRIER » et « VOTRE CALENDRIER 2 » ne
         disant pas de quel document chacun relève. Relevé le 27 septembre
         2026. */
      if (b.k === "t1") doc = b.t;
      /* Le titre de l'onglet : le dernier titre, ou la courte ligne qui
         précède le tableau (« UNITÉ DE TRAVAIL : Quai de chargement »). */
      if (b.k === "h1" || b.k === "t1" || b.k === "h2" || ((b.k === "p" || b.k === "puce") && b.t && (b.t.length < 60 || /^unité de travail/i.test(b.t)))) titre = b.t;
      if (b.k !== "table") return;
      n++;
      /* Un nom d'onglet : 31 signes au plus, sans : \ / ? * [ ], unique. Le
         nom était coupé à vingt-huit signes même quand rien ne l'obligeait,
         « INVENTAIRE DES SOMMES VERSÉE ». Relevé le 27 septembre 2026. */
      var propre = function (t) {
        return String(t || "").replace(/^UNITÉ DE TRAVAIL\s*:\s*/i, "").replace(/\s*\(.*$/, "")
          .replace(/[:\\\/?*\[\]]/g, " ").replace(/\s+/g, " ").trim();
      };
      var marque = dansEx ? "EX. " : "", place = 31 - marque.length;
      var nom = marque + (couper(propre(titre), place) || "Tableau " + n);
      if (vus[nom.toLowerCase()] && propre(doc)) {
        var autre = marque + couper(propre(doc) + " - " + propre(titre), place);
        if (!vus[autre.toLowerCase()]) nom = autre;
      }
      var base = nom, k = 2;
      while (vus[nom.toLowerCase()]) { nom = couper(base, 28) + " " + k; k++; }
      vus[nom.toLowerCase()] = true;
      f.push({ titre: nom, lignes: [b.head].concat(b.rows.map(function (l) {
        return (l || []).map(dateCellule);
      })) });
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
    /* SUR UN TÉLÉPHONE, LA TROISIÈME COLONNE SORTAIT DE L'ÉCRAN.
       Chaque cellule réservait cent dix pixels au moins et deux cent soixante
       au plus : à trois colonnes, le tableau mesurait plus large que l'écran, et
       la dernière colonne ne se lisait qu'en faisant glisser. Sous quatre cent
       trente pixels, les colonnes se serrent et le texte passe à la ligne.
       Relevé le 27 septembre 2026. */
    "@media (max-width:430px){.fd table.fd-table{font-size:12.5px}" +
    ".fd table.fd-table th,.fd table.fd-table td{min-width:0;max-width:none;padding:5px 6px;" +
    "font-size:12.5px;overflow-wrap:break-word;hyphens:auto}" +
    ".fd table.fd-table th{font-size:12px}}" +
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
