/* Les documents que l'application PRODUIT — module « licenciement économique »,
   quatrième et dernier volet : le plan de sauvegarde de l'emploi au-delà de son
   contenu (proportionnalité, voie, chiffrage, transmission, calendrier de
   notification, représentativité des signataires), les salariés protégés et les
   situations individuelles, le seuil de dix, la qualité des données saisies, la
   procédure collective et la recherche d'un repreneur.

   POURQUOI UN QUATRIÈME FICHIER

   Trois fichiers portaient déjà cinquante-deux générateurs de ce module :
   documents-eco-procedure.js (recevabilité, reclassement, motif économique),
   documents-eco-cse.js (consultation, entretien préalable, le plan lui-même) et
   documents-eco-fond.js (fondement, groupe, conventions, ordre, cohérence).
   Seize contrôles restaient sans document. Ce fichier les couvre. Il ne
   réenregistre aucun identifiant des trois autres : le registre lève une
   exception sur un doublon, et c'est voulu — deux documents pour un même
   contrôle, ce sont deux réponses possibles à la même question.

   CE QUE CES SEIZE POINTS ONT DE PARTICULIER

   Ce ne sont pour la plupart PAS des lettres. Un employeur qui doit établir que
   le seuil de dix n'est pas franchi n'a pas besoin d'un courrier : il a besoin
   du tableau qui compte, ligne par ligne, les salariés de la fenêtre de trente
   jours, et de la note qui en déduit le régime. Un employeur qui saisit
   l'administration n'a pas besoin d'une exhortation : il a besoin du bordereau
   qui dit, pièce par pièce, ce que chacune doit établir. Ces documents sont donc
   des notes, des tableaux, des relevés et des bordereaux — avec leurs colonnes,
   leurs rubriques et leurs cases. Ce qu'ils demandent à l'employeur, c'est de
   renseigner, pas de rédiger.

   TROIS RÈGLES, LES MÊMES QUE DANS LES TROIS AUTRES FICHIERS

   1. Aucun article n'est cité qui n'ait été lu à la source. Le corpus du module
      est moteur/economique/textes_eco.json, qui porte pour chaque article son
      identifiant LEGIARTI. Deux articles font exception et le document le dit
      là où il les cite : L. 2411-1 et L. 2411-5, fondement du contrôle des
      salariés protégés, ne sont pas au corpus du module — ils sont lus dans
      celui du module « comité social et économique »
      (moteur/cse/textes_cse.json, LEGIARTI000035652370 et LEGIARTI000035652360).
      Les articles L. 1233-57-9 à L. 1233-57-16, auxquels L. 1233-57-2 et
      L. 1233-57-3 renvoient, ne sont lus nulle part dans le dépôt : ils sont
      NOMMÉS, jamais reproduits ni paraphrasés, et le document l'écrit.

   2. Aucune peine n'est annoncée. Le corpus du module ne porte aucun article de
      sanction pénale. Ce qui se joue est dit tel que les textes lus le disent :
      nullité du licenciement ou de la procédure (L. 1235-10), poursuite du
      contrat ou réintégration (L. 1235-11), indemnité non inférieure aux
      salaires des six derniers mois (L. 1235-11, L. 1235-16, L. 1233-58, II),
      refus de validation ou d'homologation (L. 1233-57-2, L. 1233-57-3), perte
      de la garantie des créances de rupture (L. 3253-8).

   3. Aucun fait n'est inventé. Les difficultés de l'entreprise, ses effectifs,
      ses résultats, ses budgets, l'identité des salariés : tout sort ENTRE
      CROCHETS, avec la consigne de l'écrire daté, chiffré et sourcé. Un
      document qui devinerait ces éléments ferait signer à l'employeur des faits
      qu'il n'a pas déclarés — et c'est sur ces faits que l'administration
      décide, puis que le juge statue.  */
(function (global) {
  "use strict";

  var A = global.DocumentsProduits;
  if (!A || typeof A.ajouter !== "function")
    throw new Error("documents-eco-2.js : documents-produits.js doit être chargé avant.");
  var O = A.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  /* ═══════════════════════════════════════════ le moteur du module, s'il est là

     C'est lui qui dit le régime, le décompte des trente jours et le dispositif
     d'accompagnement. Les documents ne refont aucun de ces calculs : deux
     réponses différentes à la même question, dans le rapport et dans le
     document, se remarqueraient tout de suite. Quand la page ne l'a pas chargé,
     ces fonctions rendent null et le document énonce les branches du texte au
     lieu d'en choisir une. */
  function moteur() {
    return (global.MoteurEco && global.MoteurEco.moteur) || null;
  }
  function regime(f) {
    var M = moteur();
    if (!M || typeof M.regimeEco !== "function") return null;
    try { return M.regimeEco(f || {}); } catch (e) { return null; }
  }
  function comptes(f) {
    var M = moteur();
    if (!M || typeof M.comptes30j !== "function") return null;
    try { return M.comptes30j(f || {}); } catch (e) { return null; }
  }

  /* ═══════════════════════════════════════════════════ les outils du module */

  function nbf(x) {
    if (typeof x === "number") return isFinite(x) ? x : null;
    if (typeof x !== "string" || x.trim() === "") return null;
    var n = Number(x.replace(/\s/g, "").replace(",", "."));
    return isFinite(n) ? n : null;
  }
  function liste(x) { return Array.isArray(x) ? x : []; }
  function txt(x) { return String(x == null ? "" : x).trim(); }

  /* Les dates de la fiche sont des chaînes « AAAA-MM-JJ ». On les découpe à la
     main : « new Date("2026-06-01") » se lit en temps universel, et sur un poste
     à l'ouest de Greenwich la date affichée reculait d'un jour. */
  function dISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(txt(s));
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }
  function estDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(txt(s)); }
  function jour(s, quoi) {
    var d = dISO(s);
    return d ? leJour(d) : "[" + (quoi || "date à compléter") + "]";
  }
  function jourPlus(s, n, quoi) {
    var d = dISO(s);
    return d ? leJour(dans(d, n)) : "[" + (quoi || "date à compléter") + "]";
  }
  function ecart(a, b) {
    var x = dISO(a), y = dISO(b);
    return x && y ? Math.round((y - x) / 86400000) : null;
  }
  function aujourd(ctx) {
    var d = ctx && ctx.aujourdhui;
    return d instanceof Date && !isNaN(d.getTime()) ? d : new Date();
  }

  /* ── la mise en forme, reprise du volet « comité » pour que deux documents
        de la même entreprise se ressemblent ────────────────────────────────── */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var DOUBLE = "════════════════════════════════════════════════════════════════════════";

  function pad(s, n) {
    s = String(s == null ? "" : s);
    while (s.length < n) s += " ";
    return s;
  }
  /* Un tableau en texte simple : le document se colle dans un courriel, se copie
     dans Word et s'imprime sans rien perdre. */
  function tableau(L, entetes, lignes) {
    var larg = entetes.map(function (e, i) {
      var m = String(e).length;
      lignes.forEach(function (l) { m = Math.max(m, String(l[i] == null ? "" : l[i]).length); });
      return Math.min(m, 44);
    });
    var ligne = function (cells) {
      return "  " + cells.map(function (c, i) {
        var s = String(c == null ? "" : c);
        if (s.length > larg[i]) s = s.slice(0, larg[i] - 1) + "…";
        return pad(s, larg[i]);
      }).join("  ").replace(/\s+$/, "");
    };
    L.push(ligne(entetes));
    L.push("  " + larg.map(function (n) {
      var s = ""; while (s.length < n) s += "─"; return s;
    }).join("  "));
    if (!lignes.length) L.push(ligne(entetes.map(function () { return "[  ]"; })));
    else lignes.forEach(function (l) { L.push(ligne(l)); });
  }

  function titre(L, t) {
    L.push(DOUBLE);
    L.push(t.toUpperCase());
    L.push(DOUBLE);
    L.push("");
  }

  /* L'encadré des irrégularités qui ne se rattrapent pas. Il vient AVANT le
     document, jamais après : un lecteur qui trouve le modèle en premier ne lit
     pas l'avertissement qui le suit. */
  function irrattrapable(L, quoi, pourquoi) {
    L.push(DOUBLE);
    L.push("CE QUI NE SE RATTRAPE PAS — À LIRE AVANT TOUT LE RESTE");
    L.push(DOUBLE);
    L.push("");
    quoi.forEach(function (x) { L.push(x); });
    L.push("");
    L.push("Ce document ne rattrape donc pas ce qui précède : il le CONSTATE, et il");
    L.push("prépare la suite. " + pourquoi);
    L.push("");
    L.push("Un document qui prétendrait régulariser ce point vous ferait croire que");
    L.push("vous êtes en règle. Vous ne le seriez pas, et vous l'apprendriez trop tard.");
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  function modeEmploi(L, lignes) {
    L.push("COMMENT SE SERVIR DE CE DOCUMENT");
    L.push("");
    lignes.forEach(function (x) { L.push(x); });
    L.push("");
    L.push("Ce qui est entre crochets vous appartient : ce sont vos choix, vos faits,");
    L.push("ou les données que l'audit n'a pas reçues. Remplacez chaque crochet — daté,");
    L.push("chiffré, sourcé — et ne laissez aucun crochet dans la pièce que vous versez");
    L.push("au dossier. Un crochet resté dans un bordereau adressé à l'administration se");
    L.push("lit comme un aveu d'improvisation.");
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  function pied(L, articles, note) {
    L.push("");
    L.push(TRAIT);
    L.push("");
    L.push("Fondement — " + articles.join(" · ") + " du code du travail,");
    L.push("lus à la source. Les versions lues sont celles du dépôt de textes du module");
    L.push("(moteur/economique/textes_eco.json), qui porte pour chacune son identifiant");
    L.push("LEGIARTI : un article peut être modifié sans changer de numéro, et seul cet");
    L.push("identifiant dit laquelle des versions successives a été lue.");
    if (note) { L.push(""); L.push(note); }
    L.push("");
    L.push("Aucune peine n'est annoncée dans ce document : le corpus du module ne porte");
    L.push("aucun article de sanction pénale, et l'application n'annonce pas une sanction");
    L.push("qu'elle n'a pas lue. Ce qui est dit du risque l'est sur le fondement des");
    L.push("articles cités.");
    L.push("");
    L.push("Réserve — ce document ne vaut pas consultation. L'application ne lit ni votre");
    L.push("convention collective ni vos accords, qui peuvent fixer d'autres délais ou");
    L.push("ajouter des exigences — l'article L. 1233-30 réserve expressément la");
    L.push("convention ou l'accord collectif qui « peut prévoir des délais différents ».");
  }

  /* ── ce que la fiche et le profil donnent ───────────────────────────────── */

  function nom(ctx) {
    var p = (ctx && ctx.profil) || {}, f = (ctx && ctx.fiche) || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }
  function adresse(ctx) { return cro(((ctx && ctx.profil) || {}).adresse, "adresse du siège"); }
  function ville(ctx) { return cro(((ctx && ctx.profil) || {}).ville, "lieu"); }
  function signataire(ctx) {
    return cro(((ctx && ctx.profil) || {}).responsable, "Nom et qualité du représentant légal");
  }
  function effectifDe(ctx) {
    var p = (ctx && ctx.profil) || {}, f = (ctx && ctx.fiche) || {};
    var e = nbf(f.effectif);
    if (e === null) e = nbf(p.effectif);
    return e;
  }
  function effectifGroupeDe(ctx) {
    var f = (ctx && ctx.fiche) || {};
    return nbf(f.effectifGroupe);
  }
  function nbLic(f) {
    f = f || {};
    var n = nbf(f.nbLicenciements) || 0;
    var r = nbf(f.licenciementsRecents30j) || 0;
    var m = nbf(f.refusModification) || 0;
    var t = n + r + m;
    return t > 0 ? t : null;
  }
  function reunions(f) {
    var r = (f || {}).datesReunionsCSE;
    if (!Array.isArray(r)) return [];
    return r.filter(function (x) { return dISO(x); }).slice().sort();
  }
  function derniereReunion(f) {
    var r = reunions(f);
    return r.length ? r[r.length - 1] : null;
  }
  function voie(f) { return ((f || {}).pse || {}).voie || null; }
  function voieEnClair(f) {
    var v = voie(f);
    return v === "accord" ? "accord collectif majoritaire (L. 1233-24-1), soumis à validation"
      : v === "unilateral" ? "document unilatéral de l'employeur (L. 1233-24-4), soumis à homologation"
      : "[voie non arrêtée : accord collectif majoritaire ou document unilatéral]";
  }
  /* Le délai que L. 1233-57-4 laisse à l'administration : quinze jours pour la
     validation d'un accord, vingt et un pour l'homologation d'un document. Tant
     que la voie n'est pas arrêtée, le document ne choisit pas. */
  function delaiDecision(f) {
    var v = voie(f);
    return v === "accord" ? 15 : v === "unilateral" ? 21 : null;
  }
  function pieceDe(f, code) {
    var l = liste((f || {}).pieces).map(function (p) {
      return typeof p === "string" ? { code: p, _binaire: true } : p;
    });
    for (var i = 0; i < l.length; i++) if (l[i] && l[i].code === code) return l[i];
    return null;
  }

  /* Le rappel du dossier, en tête de chaque document : en quelques lignes, ce
     que l'audit a lu, et donc pourquoi ce document est adressé à cet employeur. */
  function rappelDossier(L, ctx) {
    var f = (ctx && ctx.fiche) || {}, r = regime(f);
    var eff = effectifDe(ctx), n = nbLic(f), rs = reunions(f);
    L.push("LE DOSSIER, TEL QUE L'AUDIT L'A LU");
    L.push("");
    L.push("  Entreprise ................. " + nom(ctx));
    L.push("  Effectif ................... " + (eff === null ? "[effectif non renseigné]" : eff + " salariés"));
    L.push("  Effectif du groupe ......... " + (effectifGroupeDe(ctx) === null
      ? "[non renseigné]" : effectifGroupeDe(ctx) + " salariés"));
    L.push("  Licenciements envisagés .... " + (n === null ? "[nombre non renseigné]"
      : n + " sur une même période de trente jours"));
    L.push("  Convocation du comité ...... " + jour(f.dateInfoCSE, "date non renseignée"));
    L.push("  Réunions du comité ......... " + (rs.length
      ? rs.map(function (x) { return jour(x); }).join(" · ")
      : "[aucune date de réunion renseignée]"));
    L.push("  Notification envisagée ..... " + jour(f.dateNotification, "date non renseignée"));
    L.push("  Voie retenue pour le plan .. " + voieEnClair(f));
    if (r && r.libelle) {
      L.push("");
      L.push("  Régime retenu par l'audit .. " + r.libelle);
      if (r.delaiAvis) L.push("  Délai d'avis ............... " + r.delaiAvis);
      if (r.pse) L.push("  Plan de sauvegarde ......... dû (L. 1233-61)");
    } else {
      L.push("");
      L.push("  Le moteur du module n'est pas chargé sur cette page : le régime n'est pas");
      L.push("  rappelé ici. Le document énonce les branches du texte au lieu d'en choisir");
      L.push("  une — reportez-vous au rapport d'audit, qui l'a tranché.");
    }
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  /* Le renvoi que le corpus ne porte pas. Il revient dans quatre documents :
     autant l'écrire une fois. */
  var NON_LUS_57_9 =
    "Les articles L. 1233-57-9 à L. 1233-57-16, auxquels L. 1233-57-2 et\n" +
    "L. 1233-57-3 renvoient, ne figurent dans aucun corpus lu par l'application.\n" +
    "Ils sont donc NOMMÉS ici, jamais reproduits ni résumés : l'application ne\n" +
    "dit pas ce qu'elle n'a pas lu. Leur contenu se vérifie à la source.";

  function doc(id, nomDoc, detail, produire) {
    A.ajouter(id, { nom: nomDoc, detail: detail, produire: produire });
  }

  /* ═════════════════════════════════════ LES GÉNÉRATEURS — un par contrôle */

})(typeof window !== "undefined" ? window : this);
