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

  /* ══════════════════════════════════════════════════════════════════════
     LE PLAN DE SAUVEGARDE DE L'EMPLOI — CE QUI L'ENTOURE
     ══════════════════════════════════════════════════════════════════════ */

  doc("CTL-PSE-02",
    "La note de proportionnalité du plan et le bordereau des comptes du groupe",
    "Le tableau des moyens entité par entité, le rapprochement du budget du plan " +
    "avec ces moyens, la note motivée que l'administration attend au titre du 1° " +
    "de l'article L. 1233-57-3, le bordereau des comptes consolidés et le " +
    "courrier de transmission.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var eff = effectifDe(ctx), effG = effectifGroupeDe(ctx);
      var socs = liste(f.societes), re = liste(f.resultatExploitation);
      var tres = liste(f.tresorerie), rg = liste(f.resultatGroupe);
      var flux = liste(f.fluxIntragroupe);
      var pc = pieceDe(f, "comptes-groupe");
      var enPC = f.procedureCollective === true;

      L = L.concat(entete(ctx, "Note de proportionnalité du plan de sauvegarde de l'emploi",
        "article L. 1233-57-3 du code du travail"));

      modeEmploi(L, [
        "Ce document n'est pas une explication du droit : c'est la pièce que vous",
        "versez au dossier de demande de validation ou d'homologation, à côté des",
        "comptes eux-mêmes. Elle répond à une question et à une seule : au regard de",
        "quels moyens le budget de ce plan a-t-il été calibré ?",
        "",
        "AUCUN MONTANT N'EST AVANCÉ ICI, et ce n'est pas une prudence excessive :",
        "aucun texte ne fixe le montant d'un plan. L'article L. 1233-57-3 confie à",
        "l'autorité administrative l'appréciation du plan « en fonction des critères",
        "suivants : 1° Les moyens dont disposent l'entreprise, l'unité économique et",
        "sociale et le groupe ; 2° Les mesures d'accompagnement prévues au regard de",
        "l'importance du projet de licenciement ; 3° Les efforts de formation et",
        "d'adaptation tels que mentionnés aux articles L. 1233-4 et L. 6321-1 ». Un",
        "chiffre que l'application avancerait serait un chiffre inventé.",
        "",
        "Ce que vous pouvez faire, en revanche, c'est RENDRE LE CALIBRAGE VISIBLE.",
        "Un plan dont on ne sait pas à quels moyens il est rapporté n'est pas",
        "appréciable ; un plan dont la note dit « voici les moyens, voici le budget,",
        "voici pourquoi ce budget au regard de ces moyens » l'est.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Ce que l'administration vérifie, et sur quoi");

      L.push("L. 1233-57-3, en cas d'homologation d'un document unilatéral :");
      L.push("« En l'absence d'accord collectif ou en cas d'accord ne portant pas sur");
      L.push("l'ensemble des points mentionnés aux 1° à 5° de l'article L. 1233-24-2,");
      L.push("l'autorité administrative homologue le document élaboré par l'employeur");
      L.push("mentionné à l'article L. 1233-24-4, après avoir vérifié la conformité de son");
      L.push("contenu aux dispositions législatives et aux stipulations conventionnelles");
      L.push("relatives aux éléments mentionnés aux 1° à 5° de l'article L. 1233-24-2, la");
      L.push("régularité de la procédure d'information et de consultation du comité social");
      L.push("et économique, le respect, le cas échéant, des obligations prévues aux");
      L.push("articles L. 1233-57-9 à L. 1233-57-16, L. 1233-57-19 et L. 1233-57-20 et le");
      L.push("respect par le plan de sauvegarde de l'emploi des articles L. 1233-61 à");
      L.push("L. 1233-63 en fonction des critères suivants : 1° Les moyens dont disposent");
      L.push("l'entreprise, l'unité économique et sociale et le groupe ; 2° Les mesures");
      L.push("d'accompagnement prévues au regard de l'importance du projet de licenciement ;");
      L.push("3° Les efforts de formation et d'adaptation tels que mentionnés aux articles");
      L.push("L. 1233-4 et L. 6321-1. »");
      L.push("");
      L.push("Trois mots commandent tout : « l'entreprise, l'unité économique et sociale");
      L.push("ET LE GROUPE ». Le périmètre d'appréciation des moyens n'est pas celui de");
      L.push("l'employeur : il est plus large. Un plan calibré sur les seuls moyens de la");
      L.push("filiale répond à une question que le texte ne pose pas.");
      L.push("");
      L.push("En cas de validation d'un accord majoritaire, L. 1233-57-2 énonce ce que");
      L.push("l'administration vérifie : « 1° Sa conformité aux articles L. 1233-24-1 à");
      L.push("L. 1233-24-3 ; 2° La régularité de la procédure d'information et de");
      L.push("consultation du comité social et économique ; 3° La présence dans le plan de");
      L.push("sauvegarde de l'emploi des mesures prévues aux articles L. 1233-61 et");
      L.push("L. 1233-63 ; 4° La mise en œuvre effective, le cas échéant, des obligations");
      L.push("prévues aux articles L. 1233-57-9 à L. 1233-57-16, L. 1233-57-19 et");
      L.push("L. 1233-57-20. » Le contrôle du calibrage y est moins étendu : il n'en reste");
      L.push("pas moins que le 3° exige la PRÉSENCE des mesures, et qu'une mesure sans");
      L.push("moyen n'est pas présente.");
      L.push("");
      if (enPC) {
        L.push("VOTRE DOSSIER PORTE UNE PROCÉDURE COLLECTIVE, et le texte en tire une");
        L.push("conséquence expresse. L'article L. 1233-58, II, dispose que « par dérogation");
        L.push("au 1° de l'article L. 1233-57-3, sans préjudice de la recherche, selon le");
        L.push("cas, par l'administrateur, le liquidateur ou l'employeur, en cas de");
        L.push("redressement ou de liquidation judiciaire, des moyens du groupe auquel");
        L.push("l'employeur appartient pour l'établissement du plan de sauvegarde de");
        L.push("l'emploi, l'autorité administrative homologue le plan de sauvegarde de");
        L.push("l'emploi après s'être assurée du respect par celui-ci des articles");
        L.push("L. 1233-61 à L. 1233-63 AU REGARD DES MOYENS DONT DISPOSE L'ENTREPRISE ».");
        L.push("");
        L.push("La recherche des moyens du groupe reste due — le texte l'écrit « sans");
        L.push("préjudice » —, mais le contrôle d'homologation se fait au regard des moyens");
        L.push("de l'entreprise. Renseignez donc les deux périmètres ci-dessous : celui de");
        L.push("l'entreprise, sur lequel l'administration se prononcera, et celui du groupe,");
        L.push("dont la recherche doit apparaître au dossier.");
        L.push("");
      }

      titre(L, "II. Les moyens, entité par entité");

      L.push("Une colonne vide n'est pas une erreur de saisie : c'est un moyen que");
      L.push("l'administration ne pourra pas apprécier. Chaque montant se rattache à une");
      L.push("pièce, et la pièce se nomme en dernière colonne.");
      L.push("");
      var lignesEnt = [];
      lignesEnt.push([nom(ctx) + " (employeur)",
        eff === null ? "[  ]" : String(eff),
        "[résultat]", "[capitaux propres]", "[trésorerie]", "[pièce]"]);
      socs.forEach(function (s) {
        if (!s) return;
        lignesEnt.push([cro(s.nom, "société"),
          s.effectif == null ? "[  ]" : String(s.effectif),
          "[résultat]", "[capitaux propres]", "[trésorerie]", "[pièce]"]);
      });
      lignesEnt.push(["TOTAL GROUPE",
        effG === null ? "[  ]" : String(effG),
        "[résultat consolidé]", "[capitaux propres]", "[trésorerie]", "[comptes consolidés]"]);
      tableau(L, ["Entité", "Effectif", "Résultat d'exploitation",
        "Capitaux propres", "Trésorerie", "Pièce"], lignesEnt);
      L.push("");
      L.push("  [Indiquer pour chaque colonne l'EXERCICE retenu. Un résultat sans exercice");
      L.push("  ne se rapproche de rien. Retenir le même exercice pour toutes les entités,");
      L.push("  ou dire pourquoi ce n'est pas possible.]");
      L.push("");

      if (re.length || tres.length) {
        L.push("Ce que la fiche porte déjà pour l'entreprise :");
        L.push("");
        var an = {};
        re.forEach(function (x) { if (x && x.annee != null) an[x.annee] = true; });
        tres.forEach(function (x) { if (x && x.annee != null) an[x.annee] = true; });
        var annees = Object.keys(an).sort();
        tableau(L, ["Exercice", "Résultat d'exploitation", "Trésorerie"],
          annees.map(function (a) {
            var r1 = re.filter(function (x) { return x && String(x.annee) === a; })[0];
            var t1 = tres.filter(function (x) { return x && String(x.annee) === a; })[0];
            return [a,
              r1 && r1.valeur != null ? String(r1.valeur) : "[  ]",
              t1 && t1.valeur != null ? String(t1.valeur) : "[  ]"];
          }));
        L.push("");
        L.push("  [Préciser l'unité — euros, milliers d'euros — et la source de chaque");
        L.push("  ligne. La fiche d'audit ne la porte pas.]");
        L.push("");
      }
      if (rg.length || flux.length) {
        L.push("La fiche porte également des éléments de niveau groupe — résultat consolidé");
        L.push("et flux intragroupe. Ils sont traités par le document du contrôle");
        L.push("CTL-FRA-01, qui les rapproche du résultat reconstitué. Reprenez-les ici en");
        L.push("tant que MOYENS, et non en tant que cause : ce sont deux démonstrations");
        L.push("distinctes, et les confondre affaiblit les deux.");
        L.push("");
      }

      titre(L, "III. Le budget du plan, rapproché de ces moyens");

      L.push("Le chiffrage mesure par mesure se fait dans le document du contrôle");
      L.push("CTL-PSE-05. Reportez ici le seul total, et sa ventilation par grande");
      L.push("rubrique de l'article L. 1233-62.");
      L.push("");
      tableau(L, ["Rubrique du plan", "Budget", "Bénéficiaires attendus", "Coût moyen"], [
        ["1° Reclassement interne", "[  ]", "[  ]", "[  ]"],
        ["3° Reclassement externe", "[  ]", "[  ]", "[  ]"],
        ["4° Création ou reprise d'activités", "[  ]", "[  ]", "[  ]"],
        ["5° Formation, VAE, reconversion", "[  ]", "[  ]", "[  ]"],
        ["Autres mesures du plan", "[  ]", "[  ]", "[  ]"],
        ["TOTAL", "[  ]", "[  ]", "[  ]"],
      ]);
      L.push("");
      L.push("  Budget total du plan ......................... [montant]");
      L.push("  Rapporté au résultat d'exploitation du groupe  [ratio]");
      L.push("  Rapporté aux capitaux propres du groupe ...... [ratio]");
      L.push("  Nombre de salariés concernés ................. " +
        (nbLic(f) === null ? "[  ]" : String(nbLic(f))));
      L.push("  Budget moyen par salarié concerné ............ [montant]");
      L.push("");
      L.push("  [Ces ratios ne sont pas des normes : aucun texte n'en fixe. Ils servent à");
      L.push("  ce que l'administration voie ce que vous avez rapporté à quoi.]");
      L.push("");

      titre(L, "IV. La note de proportionnalité");

      L.push("À reprendre sur papier à en-tête, signée, et versée au dossier.");
      L.push("");
      L.push("« Le plan de sauvegarde de l'emploi de " + nom(ctx) + " a été");
      L.push("établi au regard des moyens suivants.");
      L.push("");
      L.push("Moyens de l'entreprise — [rappeler les chiffres du tableau II, exercice par");
      L.push("exercice, avec la pièce qui les porte].");
      L.push("");
      L.push("Moyens de l'unité économique et sociale — [si une unité économique et");
      L.push("sociale existe : la nommer, indiquer l'acte qui la reconnaît, et donner ses");
      L.push("moyens. À défaut, écrire qu'il n'en existe pas : le silence se lit comme un");
      L.push("oubli.]");
      L.push("");
      L.push("Moyens du groupe — [rappeler les chiffres consolidés et l'exercice retenu.");
      L.push("Préciser le périmètre de consolidation et l'entité consolidante.]");
      L.push("");
      L.push("Au regard de ces moyens, les mesures du plan représentent [montant], soit");
      L.push("[ratio] des [référence retenue]. Elles ont été calibrées ainsi pour les");
      L.push("raisons suivantes : [écrire les raisons — engagements financiers déjà pris,");
      L.push("besoins de trésorerie du groupe, autres plans en cours, capacité");
      L.push("d'absorption du bassin d'emploi. Chaque raison se rattache à une pièce.]");
      L.push("");
      L.push("Les efforts de formation et d'adaptation mentionnés au 3° de l'article");
      L.push("L. 1233-57-3 sont retracés au [renvoi vers la partie du plan qui les porte].");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE]");
      L.push(signataire(ctx) + " »");
      L.push("");

      titre(L, "V. Le bordereau des comptes versés");

      L.push("Une pièce n'est pas une case cochée : c'est un document daté, situé, dont");
      L.push("on sait qui l'a établi et ce qu'il couvre.");
      L.push("");
      if (pc && !pc._binaire) {
        tableau(L, ["Pièce", "Fichier", "Date", "Période", "Auteur", "Version", "Périmètre", "Lue"],
          [["Comptes consolidés du groupe", cro(pc.fichier, "fichier"), cro(pc.date, "date"),
            cro(pc.periode, "période"), cro(pc.auteur, "auteur"), cro(pc.version, "version"),
            cro(pc.perimetre, "périmètre"), pc.lue === true ? "oui" : pc.lue === false ? "non" : "[  ]"]]);
        L.push("");
        if (pc.lue !== true) {
          L.push("  ATTENTION — cette pièce est enregistrée comme NON LUE. Une pièce versée");
          L.push("  sans avoir été rapprochée des réponses de l'audit n'établit rien : elle");
          L.push("  peut porter un périmètre ou un exercice différents de ceux sur lesquels");
          L.push("  le plan a été calibré.");
          L.push("");
        }
      } else {
        L.push("  La fiche ne porte AUCUNE pièce « comptes-groupe » décrite. C'est");
        L.push("  précisément ce que le contrôle a relevé.");
        L.push("");
        tableau(L, ["Pièce", "Fichier", "Date", "Période", "Auteur", "Version", "Périmètre", "Lue"],
          [["Comptes consolidés du groupe", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
           ["Comptes de l'entreprise", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
           ["Comptes des sociétés du secteur", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
        L.push("");
      }
      L.push("Ce que chaque pièce doit établir :");
      L.push("");
      L.push("  Comptes consolidés du groupe — les moyens du groupe au sens du 1° de");
      L.push("  L. 1233-57-3, sur un exercice clos et certifié. Le périmètre de");
      L.push("  consolidation doit apparaître : c'est lui qui dit de quel groupe on parle.");
      L.push("  Comptes de l'entreprise — les moyens de l'employeur, seul périmètre sur");
      L.push("  lequel l'administration se prononce en cas de redressement ou de");
      L.push("  liquidation judiciaire (L. 1233-58, II).");
      L.push("  Acte reconnaissant l'unité économique et sociale, s'il en existe une —");
      L.push("  le texte cite l'unité économique et sociale à part du groupe.");
      L.push("");

      titre(L, "VI. Le courrier de transmission");

      L.push("La demande elle-même s'adresse par la voie dématérialisée : l'article");
      L.push("D. 1233-14 dispose que « la demande de validation de l'accord mentionné à");
      L.push("l'article L. 1233-24-1 ou d'homologation du document unilatéral mentionné à");
      L.push("l'article L. 1233-24-4 est adressée au directeur régional des entreprises,");
      L.push("de la concurrence, de la consommation, du travail et de l'emploi par la voie");
      L.push("dématérialisée ». Le courrier ci-dessous accompagne le dépôt ; il ne le");
      L.push("remplace pas.");
      L.push("");
      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[Direction régionale — service en charge des plans de sauvegarde de l'emploi]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : note de proportionnalité et comptes du groupe — demande de " +
        (voie(f) === "accord" ? "validation" : voie(f) === "unilateral" ? "homologation"
          : "validation ou d'homologation"));
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je verse au dossier de " + nom(ctx) + " la note par laquelle le");
      L.push("calibrage du plan de sauvegarde de l'emploi est rapporté aux moyens de");
      L.push("l'entreprise, de l'unité économique et sociale le cas échéant, et du groupe,");
      L.push("ainsi que les comptes qui établissent ces moyens.");
      L.push("");
      L.push("Ces pièces sont produites au titre du 1° de l'article L. 1233-57-3, qui");
      L.push("confie à l'autorité administrative l'appréciation du plan au regard des");
      L.push("moyens dont disposent l'entreprise, l'unité économique et sociale et le");
      L.push("groupe.");
      L.push("");
      L.push("Je me tiens à votre disposition pour tout élément complémentaire. Je rappelle");
      L.push("que l'article L. 1233-57-6 vous permet, à tout moment en cours de procédure,");
      L.push("de faire toute observation ou proposition, à laquelle je répondrai en");
      L.push("adressant copie de ma réponse aux représentants du personnel.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : note de proportionnalité · comptes consolidés du groupe ·");
      L.push("comptes de l'entreprise · [le cas échéant] acte reconnaissant l'unité");
      L.push("économique et sociale · tableau budgétaire du plan");
      L.push("");
      L.push("Copie : comité social et économique — les observations de l'administration");
      L.push("lui sont adressées simultanément (L. 1233-57-6), et il est utile qu'il");
      L.push("dispose des mêmes pièces que celui qui les commentera.");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = aujourd(ctx);
      L.push("Aujourd'hui, " + leJour(d0) + " — vous réunissez les comptes. Comptez deux à");
      L.push("quatre semaines : des comptes consolidés ne s'obtiennent pas en un jour,");
      L.push("surtout auprès d'une société mère étrangère.");
      L.push("");
      L.push("Au plus tard le " + leJour(dans(d0, 28)) + " — la note de proportionnalité est");
      L.push("écrite et les comptes sont versés.");
      L.push("");
      var dr = derniereReunion(f);
      if (dr) {
        L.push("Votre dernière réunion du comité s'est tenue le " + jour(dr) + ". La demande");
        L.push("de " + (voie(f) === "accord" ? "validation" : voie(f) === "unilateral"
          ? "homologation" : "validation ou d'homologation") + " se dépose après elle : ces pièces");
        L.push("doivent être prêtes avant le dépôt, non ajoutées ensuite. Une pièce ajoutée");
        L.push("en cours d'instruction rend le dossier « complet » plus tard — et le délai");
        L.push("de L. 1233-57-4 court à compter de la réception du document COMPLET.");
        L.push("");
      }
      var dd = delaiDecision(f);
      L.push("Après le dépôt — l'administration notifie sa décision « dans un délai de");
      L.push("quinze jours à compter de la réception de l'accord collectif » ou « dans un");
      L.push("délai de vingt et un jours à compter de la réception du document complet »");
      L.push("(L. 1233-57-4)" + (dd ? ", soit " + dd + " jours dans la voie que vous avez retenue." : "."));
      if (dd) {
        L.push("Si vous déposiez aujourd'hui, la décision serait attendue au plus tard le");
        L.push(leJour(dans(d0, dd)) + ".");
      }
      L.push("");
      L.push("Un refus renvoie le dossier au point de départ : c'est le coût réel d'une");
      L.push("note absente, et il se compte en semaines de procédure, non en pages.");

      pied(L, ["L. 1233-57-2", "L. 1233-57-3", "L. 1233-57-4", "L. 1233-57-6",
        "L. 1233-61", "L. 1233-62", "L. 1233-63", "L. 1233-58", "D. 1233-14"],
        NON_LUS_57_9 + "\n" +
        "\n" +
        "L'article L. 6321-1, que le 3° de L. 1233-57-3 cite, n'est pas au corpus du\n" +
        "module : il est nommé, non reproduit.\n" +
        "\n" +
        "Ce qui se joue : le refus d'homologation ou de validation, d'abord. Ensuite,\n" +
        "« en cas d'annulation d'une décision de validation […] ou d'homologation […]\n" +
        "en raison d'une absence ou d'une insuffisance de plan de sauvegarde de\n" +
        "l'emploi mentionné à l'article L. 1233-61, la procédure de licenciement est\n" +
        "nulle » (L. 1235-10) ; le juge peut ordonner la poursuite du contrat ou\n" +
        "prononcer la nullité et ordonner la réintégration, et à défaut octroie une\n" +
        "indemnité « qui ne peut être inférieure aux salaires des six derniers mois »\n" +
        "(L. 1235-11). L'annulation pour un autre motif ouvre l'indemnité de\n" +
        "L. 1235-16, elle aussi non inférieure aux salaires des six derniers mois.");
      return L.join("\n");
    });

  doc("CTL-PSE-03",
    "La note arrêtant la voie du plan, et le calendrier qui en découle",
    "Le rapprochement des deux voies — accord collectif majoritaire ou document " +
    "unilatéral —, la décision datée et signée, le calendrier calculé jusqu'à la " +
    "décision administrative, l'information de l'administration sur l'ouverture " +
    "d'une négociation et l'information du comité.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var v = voie(f), rs = reunions(f), dr = derniereReunion(f);
      var d0 = aujourd(ctx);

      L = L.concat(entete(ctx, "Note arrêtant la voie retenue pour le plan de sauvegarde de l'emploi",
        "articles L. 1233-24-1, L. 1233-24-2, L. 1233-24-4 et L. 1233-57-3 du code du travail"));

      modeEmploi(L, [
        "C'est une décision à formaliser, non une pièce à construire : elle tient en",
        "une page et se prend en une réunion. Mais elle commande TOUT LE RESTE — la",
        "nature du contrôle administratif, son délai, la date à laquelle vous pourrez",
        "notifier, et jusqu'à la personne qui signera le plan.",
        "",
        "Tant qu'elle n'est pas arrêtée, aucune date de saisine ni de notification ne",
        "peut être fixée de façon fiable. C'est pourquoi ce document se remplit AVANT",
        "la première réunion du comité, et non après.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Les deux voies, telles que le code les écrit");

      L.push("VOIE 1 — L'ACCORD COLLECTIF MAJORITAIRE");
      L.push("");
      L.push("L. 1233-24-1 : « Dans les entreprises de cinquante salariés et plus, un");
      L.push("accord collectif peut déterminer le contenu du plan de sauvegarde de l'emploi");
      L.push("mentionné aux articles L. 1233-61 à L. 1233-63 ainsi que les modalités de");
      L.push("consultation du comité social et économique et de mise en œuvre des");
      L.push("licenciements. Cet accord est signé par une ou plusieurs organisations");
      L.push("syndicales représentatives ayant recueilli au moins 50 % des suffrages");
      L.push("exprimés en faveur d'organisations reconnues représentatives au premier tour");
      L.push("des dernières élections des titulaires au comité social et économique, quel");
      L.push("que soit le nombre de votants, ou par le conseil d'entreprise dans les");
      L.push("conditions prévues à l'article L. 2321-9. L'administration est informée sans");
      L.push("délai de l'ouverture d'une négociation en vue de l'accord précité. »");
      L.push("");
      L.push("Trois conséquences, et elles sont souvent oubliées :");
      L.push("  — le seuil de 50 % se calcule sur les SUFFRAGES EXPRIMÉS EN FAVEUR");
      L.push("    D'ORGANISATIONS RECONNUES REPRÉSENTATIVES, non sur les inscrits ni sur");
      L.push("    tous les suffrages ; le document du contrôle CTL-PSE-07 fait ce calcul ;");
      L.push("  — l'administration doit être informée SANS DÉLAI de l'ouverture de la");
      L.push("    négociation : c'est une obligation autonome, et le courrier en III y");
      L.push("    pourvoit ;");
      L.push("  — l'article L. 2321-9, qui règle le conseil d'entreprise, n'est pas au");
      L.push("    corpus du module : il est nommé ici, non reproduit.");
      L.push("");
      L.push("Ce que l'accord peut porter, au-delà du contenu du plan — L. 1233-24-2 :");
      L.push("« 1° Les modalités d'information et de consultation du comité social et");
      L.push("économique, en particulier les conditions dans lesquelles ces modalités");
      L.push("peuvent être aménagées en cas de projet de transfert d'une ou de plusieurs");
      L.push("entités économiques prévu à l'article L. 1233-61, nécessaire à la sauvegarde");
      L.push("d'une partie des emplois ; 2° La pondération et le périmètre d'application");
      L.push("des critères d'ordre des licenciements mentionnés à l'article L. 1233-5 ;");
      L.push("3° Le calendrier des licenciements ; 4° Le nombre de suppressions d'emploi et");
      L.push("les catégories professionnelles concernées ; 5° Les modalités de mise en");
      L.push("œuvre des mesures de formation, d'adaptation et de reclassement prévues à");
      L.push("l'article L. 1233-4. »");
      L.push("");
      L.push("VOIE 2 — LE DOCUMENT UNILATÉRAL");
      L.push("");
      L.push("L. 1233-24-4 : « A défaut d'accord mentionné à l'article L. 1233-24-1, un");
      L.push("document élaboré par l'employeur APRÈS LA DERNIÈRE RÉUNION du comité social");
      L.push("et économique fixe le contenu du plan de sauvegarde de l'emploi et précise");
      L.push("les éléments prévus aux 1° à 5° de l'article L. 1233-24-2, dans le cadre des");
      L.push("dispositions légales et conventionnelles en vigueur. »");
      L.push("");
      L.push("La date du document n'est donc pas libre : elle est postérieure à la dernière");
      L.push("réunion. Un document unilatéral daté d'avant se contredit lui-même.");
      if (dr) {
        L.push("");
        L.push("Dans votre dossier, la dernière réunion portée par la fiche est celle du");
        L.push(jour(dr) + " : un document unilatéral porterait donc une date");
        L.push("postérieure au " + jour(dr) + ".");
      }
      L.push("");

      titre(L, "II. Ce que la voie commande");

      tableau(L, ["", "Accord majoritaire", "Document unilatéral"], [
        ["Fondement", "L. 1233-24-1", "L. 1233-24-4"],
        ["Contrôle administratif", "validation", "homologation"],
        ["Texte du contrôle", "L. 1233-57-2", "L. 1233-57-3"],
        ["Délai de décision", "15 jours", "21 jours"],
        ["Point de départ", "réception de l'accord", "réception du document COMPLET"],
        ["Condition préalable", "50 % des suffrages", "après la dernière réunion"],
        ["Date de la pièce", "date de signature", "postérieure à la dernière réunion"],
      ]);
      L.push("");
      L.push("Les deux délais sont ceux de L. 1233-57-4 : « L'autorité administrative");
      L.push("notifie à l'employeur la décision de validation dans un délai de quinze jours");
      L.push("à compter de la réception de l'accord collectif mentionné à l'article");
      L.push("L. 1233-24-1 et la décision d'homologation dans un délai de vingt et un jours");
      L.push("à compter de la réception du document complet élaboré par l'employeur");
      L.push("mentionné à l'article L. 1233-24-4. »");
      L.push("");
      L.push("Le même article ajoute : « Le silence gardé par l'autorité administrative");
      L.push("pendant les délais prévus au premier alinéa vaut décision d'acceptation de");
      L.push("validation ou d'homologation. Dans ce cas, l'employeur transmet une copie de");
      L.push("la demande de validation ou d'homologation, accompagnée de son accusé de");
      L.push("réception par l'administration, au comité social et économique et, si elle");
      L.push("porte sur un accord collectif, aux organisations syndicales représentatives");
      L.push("signataires. »");
      L.push("");
      L.push("Le mot « COMPLET » est le point de départ réel dans la voie unilatérale : un");
      L.push("dossier incomplet ne fait pas courir le délai, et une pièce ajoutée le");
      L.push("dixième jour peut le faire repartir. C'est la raison pour laquelle la voie");
      L.push("s'arrête tôt : elle détermine ce que le dossier doit contenir.");
      L.push("");
      L.push("Et l'un des deux textes de contrôle est plus exigeant que l'autre sur le");
      L.push("calibrage du plan : L. 1233-57-3 fait apprécier le plan « en fonction des");
      L.push("critères suivants : 1° Les moyens dont disposent l'entreprise, l'unité");
      L.push("économique et sociale et le groupe ; 2° Les mesures d'accompagnement prévues");
      L.push("au regard de l'importance du projet de licenciement ; 3° Les efforts de");
      L.push("formation et d'adaptation ». Voyez le document du contrôle CTL-PSE-02.");
      L.push("");

      titre(L, "III. La décision, à arrêter et à dater");

      L.push("À reprendre sur papier à en-tête, à signer, et à verser au dossier avant la");
      L.push("première réunion du comité.");
      L.push("");
      L.push("« NOTE ARRÊTANT LA VOIE DU PLAN DE SAUVEGARDE DE L'EMPLOI");
      L.push("");
      L.push(nom(ctx) + " — projet de licenciement collectif pour motif économique");
      L.push("");
      L.push("État des organisations syndicales représentatives dans l'entreprise :");
      L.push("  [Organisation] — [suffrages recueillis au premier tour des dernières");
      L.push("  élections des titulaires au comité, en pourcentage des suffrages exprimés");
      L.push("  en faveur d'organisations reconnues représentatives]");
      L.push("  [Organisation] — [  ]");
      L.push("  [S'il n'existe aucune organisation représentative, l'écrire : c'est ce qui");
      L.push("  justifie à lui seul la voie unilatérale.]");
      L.push("");
      L.push("  Total mobilisable pour un accord majoritaire : [  ] %");
      L.push("  Un conseil d'entreprise existe-t-il ? ☐ oui  ☐ non");
      L.push("");
      L.push("Voie retenue :");
      L.push("  ☐ Accord collectif majoritaire (L. 1233-24-1), soumis à validation");
      L.push("  ☐ Document unilatéral de l'employeur (L. 1233-24-4), soumis à homologation");
      if (v) {
        L.push("");
        L.push("  La fiche d'audit porte : " + voieEnClair(f) + ".");
        L.push("  Cochez la case correspondante ou corrigez la fiche : les deux doivent");
        L.push("  dire la même chose.");
      } else {
        L.push("");
        L.push("  La fiche d'audit ne porte AUCUNE voie. C'est précisément ce que le");
        L.push("  contrôle a relevé : la voie n'est pas arrêtée.");
      }
      L.push("");
      L.push("Motif de ce choix : [écrire le motif — état de la représentativité, absence");
      L.push("d'organisation représentative, échec constaté d'une négociation, délai");
      L.push("disponible. Un choix motivé se défend ; un choix subi se constate.]");
      L.push("");
      L.push("Décision prise le [DATE] par " + signataire(ctx) + ". »");
      L.push("");

      titre(L, "IV. L'information de l'administration sur l'ouverture d'une négociation");

      L.push("À n'envoyer que si la voie de l'accord est retenue. L'article L. 1233-24-1");
      L.push("dispose que « l'administration est informée sans délai de l'ouverture d'une");
      L.push("négociation en vue de l'accord précité ».");
      L.push("");
      L.push("L'article L. 1233-46 en dit le moment le plus tardif : la notification du");
      L.push("projet à l'autorité administrative « indique, le cas échéant, l'intention de");
      L.push("l'employeur d'ouvrir la négociation prévue à l'article L. 1233-24-1 », « au");
      L.push("plus tard à cette date ». Et il ajoute que « le seul fait d'ouvrir cette");
      L.push("négociation avant cette date ne peut constituer une entrave au fonctionnement");
      L.push("du comité social et économique ».");
      L.push("");
      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[Direction régionale — service en charge des plans de sauvegarde de l'emploi]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : ouverture d'une négociation en vue d'un accord collectif majoritaire");
      L.push("portant plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Conformément au dernier alinéa de l'article L. 1233-24-1 du code du travail,");
      L.push("je vous informe de l'ouverture, le [DATE], d'une négociation en vue de");
      L.push("l'accord collectif déterminant le contenu du plan de sauvegarde de l'emploi");
      L.push("de " + nom(ctx) + ".");
      L.push("");
      L.push("Les organisations syndicales représentatives invitées à cette négociation");
      L.push("sont : [les nommer]. La première séance est fixée au [DATE].");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "V. L'information du comité social et économique");

      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : voie retenue pour le plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous informe que la voie retenue pour le plan de sauvegarde de l'emploi");
      L.push("est celle [de l'accord collectif majoritaire prévu à l'article L. 1233-24-1 /");
      L.push("du document unilatéral prévu à l'article L. 1233-24-4]. La note qui arrête ce");
      L.push("choix et son motif est jointe à la présente.");
      L.push("");
      L.push("Ce choix commande le calendrier : [rappeler ici les dates du VI ci-dessous].");
      L.push("");
      L.push("Je rappelle que le comité est consulté sur « les mesures sociales");
      L.push("d'accompagnement prévues par le plan de sauvegarde de l'emploi »");
      L.push("(L. 1233-30, I, 2°) et que, dans la voie de l'accord, « les éléments");
      L.push("mentionnés au 2° du présent I qui font l'objet de l'accord mentionné à");
      L.push("l'article L. 1233-24-1 ne sont pas soumis à la consultation du comité social");
      L.push("et économique prévue au présent article » — ce que le même article dispose.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : note arrêtant la voie retenue");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous arrêtez la voie et vous datez la note.");
      L.push("Une réunion suffit : c'est une décision, non une pièce à construire.");
      L.push("");
      if (rs.length) {
        L.push("Vos réunions, telles que la fiche les porte : " +
          rs.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("La note doit porter une date antérieure à la première, le " + jour(rs[0]) + " :");
        L.push("c'est la voie qui dit ce que le comité doit recevoir et sur quoi il est");
        L.push("consulté. Si elle est postérieure, ne l'antidatez pas — datez-la du jour où");
        L.push("elle est prise, et consignez le calendrier réel.");
        L.push("");
      } else {
        L.push("La fiche ne porte aucune date de réunion. Arrêtez la voie AVANT de");
        L.push("convoquer : la convocation et les pièces qui l'accompagnent en dépendent.");
        L.push("");
      }
      if (dr) {
        L.push("Voie unilatérale — le document se date après la dernière réunion, soit après");
        L.push("le " + jour(dr) + ", donc au plus tôt le " + jourPlus(dr, 1) + ".");
        L.push("");
      }
      var dd2 = delaiDecision(f);
      L.push("Après la dernière réunion — vous déposez la demande par la voie");
      L.push("dématérialisée (D. 1233-14). L'administration dispose alors de " +
        (dd2 ? dd2 + " jours" : "quinze jours dans la voie de l'accord, vingt et un dans la voie unilatérale"));
      L.push("pour notifier sa décision (L. 1233-57-4).");
      if (dd2 && dr) {
        L.push("");
        L.push("Si vous déposiez le lendemain de la dernière réunion, soit le " +
          jourPlus(dr, 1) + ",");
        L.push("la décision serait attendue au plus tard le " + jourPlus(dr, 1 + dd2) + " —");
        L.push("à condition que le dossier soit COMPLET dès le dépôt.");
      }
      L.push("");
      L.push("Puis, et seulement puis, la notification des licenciements : l'employeur");
      L.push("« ne peut procéder, à peine de nullité, à la rupture des contrats de travail");
      L.push("avant la notification de cette décision d'homologation ou de validation ou");
      L.push("l'expiration des délais prévus à l'article L. 1233-57-4 » (L. 1233-39). Voyez");
      L.push("le document du contrôle CTL-PSE-04.");

      pied(L, ["L. 1233-24-1", "L. 1233-24-2", "L. 1233-24-4", "L. 1233-30",
        "L. 1233-39", "L. 1233-46", "L. 1233-57-2", "L. 1233-57-3", "L. 1233-57-4",
        "D. 1233-14"],
        "L'article L. 2321-9, que L. 1233-24-1 cite pour le conseil d'entreprise, et\n" +
        "l'article L. 2323-31, que L. 1233-30 cite pour l'opération projetée, ne sont\n" +
        "pas au corpus du module : ils sont nommés, non reproduits.\n" +
        "\n" +
        "Ce qui se joue : tant que la voie n'est pas arrêtée, le calendrier ne l'est\n" +
        "pas non plus, et une notification mal datée frappe la rupture de nullité\n" +
        "(L. 1233-39 ; L. 1235-10).");
      return L.join("\n");
    });

  doc("CTL-PSE-04",
    "Le calendrier de notification calé sur la décision administrative",
    "Le relevé de la décision de validation ou d'homologation, la liste de " +
    "vérification à passer avant tout envoi de lettre, la portée à connaissance " +
    "des salariés, et — si des lettres sont déjà parties — la note de constat à " +
    "remettre au conseil de l'entreprise.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var p = f.pse || {};
      var dDec = p.dateDecisionAdmin, dNot = f.dateNotification;
      var partiTrop = estDate(dDec) && estDate(dNot) && dNot <= dDec;
      var d0 = aujourd(ctx);
      var dr = derniereReunion(f);

      L = L.concat(entete(ctx, "Calendrier de notification et décision administrative",
        "article L. 1233-39 du code du travail"));

      if (partiTrop) {
        irrattrapable(L, [
          "La fiche porte une notification au " + jour(dNot) + " et une décision",
          "administrative au " + jour(dDec) + " : la notification n'est pas postérieure",
          "à la décision.",
          "",
          "L'article L. 1233-39 dispose que l'employeur « ne peut procéder, à peine de",
          "nullité, à la rupture des contrats de travail avant la notification de cette",
          "décision d'homologation ou de validation ou l'expiration des délais prévus à",
          "l'article L. 1233-57-4 ». Les mots « à peine de nullité » sont dans le texte.",
          "",
          "Et l'article L. 1235-10 ajoute : « Dans les entreprises d'au moins cinquante",
          "salariés, lorsque le projet de licenciement concerne au moins dix salariés",
          "dans une même période de trente jours, le licenciement intervenu en l'absence",
          "de toute décision relative à la validation ou à l'homologation ou alors qu'une",
          "décision négative a été rendue est nul. »",
        ], "Une lettre expédiée ne se rappelle pas, et une seconde lettre datée d'après " +
           "la décision ne remplace pas la première : elle en ajoute une. La partie VI " +
           "ci-dessous est faite pour ce cas.");
      }

      modeEmploi(L, [
        "Ce document ne rédige aucune lettre de licenciement : ce n'est pas son objet,",
        "et le module de la procédure s'en charge. Il fait une chose, et il la fait",
        "complètement : il DATE l'envoi.",
        "",
        "Trois pièces le composent — le relevé de la décision administrative, la liste",
        "de vérification à passer avant de mettre une enveloppe à la poste, et le",
        "constat à établir si des lettres sont déjà parties trop tôt.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte, en entier");

      L.push("L. 1233-39, troisième et quatrième alinéas :");
      L.push("");
      L.push("« Dans les entreprises de cinquante salariés ou plus, lorsque le projet de");
      L.push("licenciement concerne dix salariés ou plus dans une même période de trente");
      L.push("jours, l'employeur notifie le licenciement selon les modalités prévues au");
      L.push("premier alinéa du présent article, après la notification par l'autorité");
      L.push("administrative de la décision de validation mentionnée à l'article");
      L.push("L. 1233-57-2 ou de la décision d'homologation mentionnée à l'article");
      L.push("L. 1233-57-3, ou à l'expiration des délais prévus à l'article L. 1233-57-4.");
      L.push("");
      L.push("Il ne peut procéder, à peine de nullité, à la rupture des contrats de travail");
      L.push("avant la notification de cette décision d'homologation ou de validation ou");
      L.push("l'expiration des délais prévus à l'article L. 1233-57-4. »");
      L.push("");
      L.push("Le premier alinéa, auquel le texte renvoie pour les modalités, vise la");
      L.push("« lettre recommandée avec avis de réception ».");
      L.push("");
      L.push("Deux points de départ possibles, donc, et un seul est sûr : la NOTIFICATION");
      L.push("de la décision. L'expiration des délais de L. 1233-57-4 en est un autre —");
      L.push("« le silence gardé par l'autorité administrative pendant les délais prévus au");
      L.push("premier alinéa vaut décision d'acceptation de validation ou d'homologation »");
      L.push("—, mais il suppose de savoir exactement quand le dossier a été reçu COMPLET.");
      L.push("Se fonder sur le silence sans en tenir la preuve, c'est parier.");
      L.push("");

      titre(L, "II. L'état de votre dossier");

      tableau(L, ["Élément", "Date portée par la fiche"], [
        ["Dernière réunion du comité", dr ? jour(dr) : "[non renseignée]"],
        ["Voie retenue", voieEnClair(f)],
        ["Décision de validation ou d'homologation", estDate(dDec) ? jour(dDec) : "[non renseignée]"],
        ["Notification envisagée", estDate(dNot) ? jour(dNot) : "[non renseignée]"],
        ["Écart entre les deux", (function () {
          var e = ecart(dDec, dNot);
          return e === null ? "[non calculable]" : (e > 0 ? e + " jours après la décision"
            : e === 0 ? "le jour même — insuffisant" : Math.abs(e) + " jours AVANT la décision");
        })()],
      ]);
      L.push("");
      if (!estDate(dDec)) {
        L.push("  La date de la décision administrative n'est pas renseignée. Tant qu'elle");
        L.push("  ne l'est pas, aucune date de notification ne peut être arrêtée : le point");
        L.push("  de départ manque. Renseignez-la dès la réception de la décision, et");
        L.push("  relancez l'audit.");
        L.push("");
      } else if (ecart(dDec, dNot) === 0) {
        L.push("  ATTENTION — la notification est prévue LE JOUR MÊME de la décision. Le");
        L.push("  texte exige qu'elle intervienne APRÈS la notification de la décision. Le");
        L.push("  jour même n'est pas après : décalez d'au moins un jour, et conservez la");
        L.push("  preuve de l'heure de réception de la décision si vous n'aviez pas le");
        L.push("  choix.");
        L.push("");
      }

      titre(L, "III. Le relevé de la décision administrative");

      L.push("À remplir dès réception, et à conserver avec la décision elle-même.");
      L.push("");
      L.push("  Nature de la décision ......... ☐ validation (L. 1233-57-2)");
      L.push("                                  ☐ homologation (L. 1233-57-3)");
      L.push("                                  ☐ acceptation tacite par silence gardé");
      L.push("                                    pendant le délai de L. 1233-57-4");
      L.push("  Sens ......................... ☐ favorable  ☐ refus");
      L.push("  Date de la décision ........... [  ]");
      L.push("  Date de NOTIFICATION à l'entreprise .... [  ]   ← c'est celle qui compte");
      L.push("  Moyen et preuve de la notification ..... [  ]");
      L.push("  La décision est-elle motivée ? ......... ☐ oui  ☐ non");
      L.push("  Date de dépôt de la demande ............ [  ]");
      L.push("  Date à laquelle le dossier a été déclaré ou réputé COMPLET ..... [  ]");
      L.push("");
      L.push("L'article L. 1233-57-4 impose que « la décision prise par l'autorité");
      L.push("administrative est motivée » et qu'elle soit notifiée « dans les mêmes");
      L.push("délais, au comité social et économique et, si elle porte sur un accord");
      L.push("collectif, aux organisations syndicales représentatives signataires ».");
      L.push("");
      L.push("EN CAS DE REFUS — ne notifiez rien. L'article L. 1235-10 vise expressément");
      L.push("le licenciement « intervenu […] alors qu'une décision négative a été rendue »");
      L.push("et le déclare nul. La suite se traite avec votre conseil, et non par un");
      L.push("nouvel envoi.");
      L.push("");
      if (f.procedureCollective === true) {
        L.push("VOTRE DOSSIER PORTE UNE PROCÉDURE COLLECTIVE. L'article L. 1233-58, II,");
        L.push("écrit la même règle sous une autre sanction : « L'employeur, l'administrateur");
        L.push("ou le liquidateur ne peut procéder, sous peine d'irrégularité, à la rupture");
        L.push("des contrats de travail avant la notification de la décision favorable de");
        L.push("validation ou d'homologation, ou l'expiration des délais mentionnés au");
        L.push("quatrième alinéa du présent II. » Et les délais y sont plus courts : ils");
        L.push("« sont ramenés, à compter de la dernière réunion du comité social et");
        L.push("économique, à huit jours en cas de redressement judiciaire et à quatre jours");
        L.push("en cas de liquidation judiciaire ». Voyez les documents des contrôles");
        L.push("CTL-PCO-01 à CTL-PCO-03.");
        L.push("");
      }

      titre(L, "IV. La portée à connaissance des salariés");

      L.push("L. 1233-57-4, dernier alinéa : « La décision de validation ou d'homologation");
      L.push("ou, à défaut, les documents mentionnés au troisième alinéa et les voies et");
      L.push("délais de recours sont portés à la connaissance des salariés par voie");
      L.push("d'affichage sur leurs lieux de travail ou par tout autre moyen permettant de");
      L.push("conférer date certaine à cette information. »");
      L.push("");
      L.push("  Moyen retenu ..... ☐ affichage  ☐ autre moyen conférant date certaine : [  ]");
      L.push("  Date ............. [  ]        Lieux : [  ]");
      L.push("  Les voies et délais de recours sont-ils portés avec la décision ? ☐");
      L.push("  Photographie ou constat de l'affichage conservé au dossier ? ....... ☐");
      L.push("");
      L.push("  [En cas d'acceptation tacite, ce sont « les documents mentionnés au");
      L.push("  troisième alinéa » qui sont affichés : la copie de la demande accompagnée");
      L.push("  de son accusé de réception par l'administration.]");
      L.push("");

      titre(L, "V. La liste de vérification, à passer avant tout envoi");

      L.push("Une seule case non cochée suffit à arrêter l'envoi. C'est le but de cette");
      L.push("liste : elle n'est pas un pense-bête, elle est un verrou.");
      L.push("");
      L.push("  ☐ La décision administrative est NOTIFIÉE à l'entreprise, et j'en tiens la");
      L.push("    preuve datée — ou le délai de L. 1233-57-4 est expiré et je tiens la");
      L.push("    preuve de la date de réception du dossier complet.");
      L.push("  ☐ Elle est FAVORABLE.");
      L.push("  ☐ La date d'expédition des lettres est POSTÉRIEURE à cette date, et non le");
      L.push("    jour même.");
      L.push("  ☐ La décision est portée à la connaissance des salariés (L. 1233-57-4).");
      L.push("  ☐ Chaque salarié protégé concerné dispose d'une autorisation de");
      L.push("    l'inspecteur du travail antérieure à l'envoi — voyez le document du");
      L.push("    contrôle CTL-PRT-01.");
      L.push("  ☐ Les salariés en arrêt, en congé maternité ou déclarés inaptes ont fait");
      L.push("    l'objet de l'examen individuel du contrôle CTL-IND-01.");
      L.push("  ☐ Le contrat de sécurisation professionnelle ou le congé de reclassement");
      L.push("    est proposé selon les modalités du plan.");
      L.push("  ☐ Les réponses aux observations de l'administration (L. 1233-57-6) ont été");
      L.push("    adressées, avec copie aux représentants du personnel.");
      L.push("  ☐ Aucune lettre n'a déjà été expédiée.");
      L.push("");
      L.push("  Vérification faite le [DATE] par [nom et qualité]. Signature : ..........");
      L.push("");

      titre(L, "VI. Si des lettres sont déjà parties avant la décision");

      L.push("Ne les réexpédiez pas. N'antidatez rien. Ne rédigez aucune lettre de");
      L.push("« régularisation » : il n'y en a pas.");
      L.push("");
      L.push("Établissez le constat ci-dessous et remettez-le à votre conseil. Ce qui se");
      L.push("joue est écrit dans deux articles, et il vaut mieux les avoir lus avant de");
      L.push("décider de la suite.");
      L.push("");
      L.push("L. 1235-10 : « […] le licenciement intervenu en l'absence de toute décision");
      L.push("relative à la validation ou à l'homologation ou alors qu'une décision");
      L.push("négative a été rendue est nul. […] Les deux premiers alinéas ne sont pas");
      L.push("applicables aux entreprises en redressement ou liquidation judiciaires. »");
      L.push("");
      L.push("L. 1235-11 : « Lorsque le juge constate que le licenciement est intervenu");
      L.push("alors que la procédure de licenciement est nulle, conformément aux");
      L.push("dispositions des deux premiers alinéas de l'article L. 1235-10, il peut");
      L.push("ordonner la poursuite du contrat de travail ou prononcer la nullité du");
      L.push("licenciement et ordonner la réintégration du salarié à la demande de ce");
      L.push("dernier, sauf si cette réintégration est devenue impossible, notamment du");
      L.push("fait de la fermeture de l'établissement ou du site ou de l'absence d'emploi");
      L.push("disponible. Lorsque le salarié ne demande pas la poursuite de son contrat de");
      L.push("travail ou lorsque la réintégration est impossible, le juge octroie au");
      L.push("salarié une indemnité à la charge de l'employeur qui ne peut être inférieure");
      L.push("aux salaires des six derniers mois. »");
      L.push("");
      L.push("CONSTAT — à établir, dater et signer :");
      L.push("");
      tableau(L, ["Salarié", "Date d'expédition", "Preuve d'envoi", "Reçue le", "Décision admin. du"],
        [["[nom ou matricule]", "[  ]", "[avis de réception n°]", "[  ]",
          estDate(dDec) ? jour(dDec) : "[  ]"],
         ["[nom ou matricule]", "[  ]", "[avis de réception n°]", "[  ]",
          estDate(dDec) ? jour(dDec) : "[  ]"]]);
      L.push("");
      L.push("  Nombre de lettres expédiées avant la décision : [  ]");
      L.push("  Nombre de contrats effectivement rompus : [  ]");
      L.push("  Constat établi le [DATE] par [nom et qualité].");
      L.push("");
      L.push("  Remis à [nom du conseil] le [DATE].");
      L.push("");
      L.push("  [Ne joignez à ce constat que des pièces : lettres, preuves d'envoi,");
      L.push("  décision. Aucune appréciation juridique : elle appartient à votre conseil,");
      L.push("  et une appréciation écrite par l'employeur se retourne contre lui.]");
      L.push("");
      L.push("Rappel de délai — l'article L. 1235-7 dispose que « toute contestation portant");
      L.push("sur le licenciement pour motif économique se prescrit par douze mois à compter");
      L.push("de la dernière réunion du comité social et économique ou, dans le cadre de");
      L.push("l'exercice par le salarié de son droit individuel à contester le licenciement");
      L.push("pour motif économique, à compter de la notification de celui-ci ».");
      if (dr) {
        L.push("Dans votre dossier, la dernière réunion portée par la fiche est celle du");
        L.push(jour(dr) + " : le premier de ces deux points de départ conduirait au");
        L.push(jourPlus(dr, 365) + ".");
      }
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + ".");
      L.push("");
      if (estDate(dDec)) {
        L.push("Décision administrative portée par la fiche : " + jour(dDec) + ".");
        L.push("Première date d'expédition possible : " + jourPlus(dDec, 1) + ", sous réserve");
        L.push("que ce soit la date de NOTIFICATION de la décision à l'entreprise, et non sa");
        L.push("date de signature — le texte compte à partir de la notification.");
        L.push("");
      } else {
        L.push("Aucune décision administrative n'est portée par la fiche : la première date");
        L.push("d'expédition possible ne peut donc pas être calculée. Elle le sera dès que");
        L.push("la décision sera notifiée.");
        L.push("");
        var dd3 = delaiDecision(f);
        if (dr && dd3) {
          L.push("Repère : si la demande avait été déposée le lendemain de la dernière");
          L.push("réunion, soit le " + jourPlus(dr, 1) + ", le délai de " + dd3 + " jours de");
          L.push("L. 1233-57-4 expirerait le " + jourPlus(dr, 1 + dd3) + ". Ce n'est qu'un");
          L.push("repère : il suppose un dossier complet dès le dépôt.");
          L.push("");
        }
      }
      L.push("Le jour de la notification de la décision — vous affichez ou portez à");
      L.push("connaissance (L. 1233-57-4), et vous passez la liste de vérification du V.");
      L.push("");
      L.push("Le lendemain au plus tôt — vous expédiez, par lettre recommandée avec avis de");
      L.push("réception (L. 1233-39, premier alinéa).");
      L.push("");
      L.push("Ce jour-là, gardez à l'esprit ce que le texte protège : il n'exige pas un");
      L.push("formalisme, il exige que la rupture ne précède pas le contrôle. C'est");
      L.push("pourquoi la nullité y est écrite en toutes lettres.");

      pied(L, ["L. 1233-39", "L. 1233-57-2", "L. 1233-57-3", "L. 1233-57-4",
        "L. 1233-57-6", "L. 1233-58", "L. 1235-7", "L. 1235-10", "L. 1235-11"],
        "Ce qui se joue : la nullité du licenciement (L. 1235-10), la poursuite du\n" +
        "contrat ou la réintégration, et à défaut une indemnité « qui ne peut être\n" +
        "inférieure aux salaires des six derniers mois » (L. 1235-11). En redressement\n" +
        "ou en liquidation judiciaire, les deux premiers alinéas de L. 1235-10 ne\n" +
        "s'appliquent pas : L. 1233-58, II, écrit alors une irrégularité et une\n" +
        "indemnité « qui ne peut être inférieure aux salaires des six derniers mois »,\n" +
        "L. 1235-16 ne s'appliquant pas.");
      return L.join("\n");
    });

  /* Les quatre mesures que le questionnaire fait saisir, et la rubrique de
     L. 1233-62 à laquelle chacune se rattache. Le contrôle CTL-PSE-05 signale
     celles qui ne portent aucun chiffre : le document reprend la même liste,
     pour que le rapport et la pièce disent la même chose. */
  var MESURES = [
    { cle: "evitement", nom: "Mesures d'évitement des licenciements",
      rub: "L. 1233-61 — « éviter les licenciements ou en limiter le nombre »" },
    { cle: "reclassementInterne", nom: "Reclassement interne sur le territoire national",
      rub: "L. 1233-62, 1°" },
    { cle: "formation", nom: "Formation, validation des acquis, reconversion",
      rub: "L. 1233-62, 5°" },
    { cle: "creation", nom: "Soutien à la création ou à la reprise d'activités",
      rub: "L. 1233-62, 4°" },
  ];

  doc("CTL-PSE-05",
    "Le tableau budgétaire du plan, mesure par mesure",
    "Chaque mesure du plan avec son budget, ses bénéficiaires attendus, sa durée " +
    "et ses modalités d'accès ; le total et sa ventilation ; le relevé des " +
    "mesures que la fiche porte sans aucun chiffre ; et le courrier qui remet le " +
    "tableau au comité et à l'administration.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var p = f.pse || {};
      var d0 = aujourd(ctx), dr = derniereReunion(f);
      var sansChiffre = MESURES.filter(function (m) {
        var s = txt(p[m.cle]);
        return s !== "" && !/\d/.test(s);
      });
      var renseignees = MESURES.filter(function (m) { return txt(p[m.cle]) !== ""; });
      var absentes = MESURES.filter(function (m) { return txt(p[m.cle]) === ""; });

      L = L.concat(entete(ctx, "Tableau budgétaire du plan de sauvegarde de l'emploi",
        "article L. 1233-62 du code du travail"));

      modeEmploi(L, [
        "Une mesure non chiffrée n'est pas une mesure incomplète : c'est une mesure",
        "que personne ne peut apprécier. « Des actions de formation » ne dit ni",
        "combien de salariés, ni combien d'heures, ni combien d'euros — et",
        "l'administration ne peut donc pas dire si elle est proportionnée aux moyens",
        "de l'entreprise et du groupe, ce que le 1° de l'article L. 1233-57-3 lui",
        "demande précisément de faire.",
        "",
        "Ce tableau se remplit puis SE RECOPIE DANS LE PLAN LUI-MÊME. Une annexe",
        "séparée se détache du document déposé ; un tableau intégré au plan est le",
        "plan.",
        "",
        "L'application ne propose aucun montant. Aucun texte n'en fixe, et un chiffre",
        "avancé ici serait un chiffre inventé.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Pourquoi le chiffre, et pas seulement l'intitulé");

      L.push("L. 1233-62 énumère les mesures que le plan prévoit : « Le plan de sauvegarde");
      L.push("de l'emploi prévoit des mesures telles que : 1° Des actions en vue du");
      L.push("reclassement interne sur le territoire national […] ; 1° bis Des actions");
      L.push("favorisant la reprise de tout ou partie des activités en vue d'éviter la");
      L.push("fermeture d'un ou de plusieurs établissements ; 2° Des créations d'activités");
      L.push("nouvelles par l'entreprise ; 3° Des actions favorisant le reclassement");
      L.push("externe à l'entreprise, notamment par le soutien à la réactivation du bassin");
      L.push("d'emploi ; 4° Des actions de soutien à la création d'activités nouvelles ou à");
      L.push("la reprise d'activités existantes par les salariés ; 5° Des actions de");
      L.push("formation, de validation des acquis de l'expérience ou de reconversion […] ;");
      L.push("6° Des mesures de réduction ou d'aménagement du temps de travail […]. »");
      L.push("");
      L.push("Le texte ne dit nulle part « chiffrées ». Ce sont les articles du contrôle");
      L.push("administratif qui l'imposent en fait :");
      L.push("");
      L.push("  L. 1233-57-3 fait apprécier le plan « en fonction des critères suivants :");
      L.push("  1° Les moyens dont disposent l'entreprise, l'unité économique et sociale et");
      L.push("  le groupe ; 2° Les mesures d'accompagnement prévues au regard de");
      L.push("  l'importance du projet de licenciement ; 3° Les efforts de formation et");
      L.push("  d'adaptation […]. »");
      L.push("");
      L.push("  L. 1233-57-2, 3°, fait vérifier « la présence dans le plan de sauvegarde de");
      L.push("  l'emploi des mesures prévues aux articles L. 1233-61 et L. 1233-63 ».");
      L.push("");
      L.push("Un rapport se fait entre deux nombres. Une mesure sans nombre n'entre dans");
      L.push("aucun des deux critères : elle n'est ni proportionnée ni disproportionnée,");
      L.push("elle est inappréciable — et c'est le motif de refus le plus économique à");
      L.push("rédiger pour l'administration.");
      L.push("");

      titre(L, "II. Ce que la fiche porte, mesure par mesure");

      if (renseignees.length) {
        renseignees.forEach(function (m) {
          var s = txt(p[m.cle]);
          L.push("── " + m.nom + " (" + m.rub + ") ──");
          L.push("");
          L.push("  Saisi dans la fiche : « " + s + " »");
          if (!/\d/.test(s)) {
            L.push("");
            L.push("  AUCUN CHIFFRE. C'est ce que le contrôle a relevé. La mesure existe");
            L.push("  peut-être, mais rien dans le dossier ne permet d'en mesurer la portée.");
          } else {
            L.push("");
            L.push("  Un chiffre y figure. Vérifiez qu'il dit bien ce qu'il faut : un budget");
            L.push("  n'est pas un nombre de bénéficiaires, et un nombre d'heures n'est pas");
            L.push("  un coût. Les quatre colonnes du III doivent toutes être remplies.");
          }
          L.push("");
        });
      } else {
        L.push("La fiche ne porte AUCUNE mesure saisie. Le tableau du III est donc à");
        L.push("remplir intégralement — à partir du plan tel que vous l'avez rédigé, et non");
        L.push("de mémoire.");
        L.push("");
      }
      if (absentes.length) {
        L.push("Rubriques du questionnaire restées vides : " +
          absentes.map(function (m) { return m.nom.toLowerCase(); }).join(" · ") + ".");
        L.push("Une rubrique vide n'est pas en elle-même une non-conformité — le texte écrit");
        L.push("« des mesures telles que » —, mais elle appelle un motif écrit. Le document");
        L.push("du contrôle CTL-PSE-01 porte la note motivée des rubriques écartées.");
        L.push("");
      }
      if (sansChiffre.length) {
        L.push("EN RÉSUMÉ — mesures énoncées sans aucun chiffre : " +
          sansChiffre.map(function (m) { return m.cle; }).join(", ") + ".");
        L.push("");
      }

      titre(L, "III. Le tableau budgétaire");

      L.push("Une ligne par mesure. Une mesure qui ne peut pas remplir les six colonnes");
      L.push("n'est pas prête à être déposée.");
      L.push("");
      var lignesB = MESURES.map(function (m) {
        var s = txt(p[m.cle]);
        return [m.rub.split(" —")[0], m.nom, s ? "[préciser : « " + s + " »]" : "[intitulé]",
          "[  ]", "[  ]", "[  ]", "[  ]"];
      });
      lignesB.push(["L. 1233-62, 1° bis", "Reprise d'activités", "[intitulé]", "[  ]", "[  ]", "[  ]", "[  ]"]);
      lignesB.push(["L. 1233-62, 2°", "Créations d'activités nouvelles", "[intitulé]", "[  ]", "[  ]", "[  ]", "[  ]"]);
      lignesB.push(["L. 1233-62, 3°", "Reclassement externe", "[intitulé]", "[  ]", "[  ]", "[  ]", "[  ]"]);
      lignesB.push(["L. 1233-62, 6°", "Temps de travail, heures supplémentaires", "[intitulé]", "[  ]", "[  ]", "[  ]", "[  ]"]);
      tableau(L, ["Rubrique", "Objet", "Mesure retenue", "Bénéficiaires",
        "Coût unitaire", "Budget", "Durée"], lignesB);
      L.push("");
      L.push("Pour chaque ligne, à écrire dans le plan sous le tableau :");
      L.push("");
      L.push("  Modalités d'accès ..... [qui peut en bénéficier, comment il en fait la");
      L.push("  demande, dans quel délai, qui décide, et ce qui se passe en cas de refus]");
      L.push("  Point de départ ....... [à compter de quel événement la mesure est ouverte]");
      L.push("  Pièce justificative ... [devis, convention avec l'organisme, engagement");
      L.push("  budgétaire, délibération]");
      L.push("");
      L.push("  [Une mesure ouverte « pendant la durée du plan » sans date de début ni de");
      L.push("  fin ne se contrôle pas au moment du suivi. L'article L. 1233-63 impose que");
      L.push("  le plan « détermine les modalités de suivi de la mise en oeuvre effective");
      L.push("  des mesures » : on ne suit que ce qui a un terme.]");
      L.push("");

      titre(L, "IV. Le total, et sa ventilation");

      tableau(L, ["", "Montant", "Part du total"], [
        ["Évitement des licenciements", "[  ]", "[  ] %"],
        ["Reclassement interne", "[  ]", "[  ] %"],
        ["Reclassement externe et bassin d'emploi", "[  ]", "[  ] %"],
        ["Formation, VAE, reconversion", "[  ]", "[  ] %"],
        ["Création ou reprise d'activités", "[  ]", "[  ] %"],
        ["Aménagement du temps de travail", "[  ]", "[  ] %"],
        ["Frais de gestion du plan (cellule, prestataires)", "[  ]", "[  ] %"],
        ["TOTAL DU PLAN", "[  ]", "100 %"],
      ]);
      L.push("");
      L.push("  Nombre de salariés concernés par le projet ..... " +
        (nbLic(f) === null ? "[non renseigné]" : String(nbLic(f))));
      L.push("  Budget moyen par salarié concerné ............. [  ]");
      L.push("  Exercice sur lequel le budget est engagé ...... [  ]");
      L.push("  Ligne comptable ou provision correspondante ... [  ]");
      L.push("");
      L.push("Ce total se rapproche ensuite des moyens de l'entreprise, de l'unité");
      L.push("économique et sociale et du groupe : c'est l'objet du document du contrôle");
      L.push("CTL-PSE-02. Les deux pièces se lisent ensemble, et l'administration les lira");
      L.push("ensemble.");
      L.push("");

      titre(L, "V. Où ce tableau doit figurer, et à qui il est remis");

      L.push("DANS LE PLAN. Pas en annexe, pas dans un fichier joint : dans le corps du");
      L.push("plan de sauvegarde de l'emploi, sous la rubrique de chaque mesure.");
      L.push("");
      L.push("AU COMITÉ, avec la convocation. L. 1233-32 : « Outre les renseignements");
      L.push("prévus à l'article L. 1233-31, dans les entreprises de moins de cinquante");
      L.push("salariés, l'employeur adresse aux représentants du personnel les mesures");
      L.push("qu'il envisage de mettre en oeuvre pour éviter les licenciements ou en");
      L.push("limiter le nombre et pour faciliter le reclassement du personnel dont le");
      L.push("licenciement ne pourrait être évité. Dans les entreprises d'au moins");
      L.push("cinquante salariés, l'employeur adresse le plan de sauvegarde de l'emploi");
      L.push("concourant aux mêmes objectifs. »");
      L.push("");
      L.push("À L'ADMINISTRATION, en même temps. L. 1233-48 : « L'ensemble des informations");
      L.push("communiquées aux représentants du personnel lors de leur convocation aux");
      L.push("réunions prévues par les articles L. 1233-29 et L. 1233-30 est communiqué");
      L.push("simultanément à l'autorité administrative. L'employeur lui adresse également");
      L.push("les procès-verbaux des réunions. Ces procès-verbaux comportent les avis,");
      L.push("suggestions et propositions des représentants du personnel. » L'article");
      L.push("D. 1233-5 précise que ces informations et documents « sont adressés par la");
      L.push("voie dématérialisée simultanément » à l'autorité administrative.");
      L.push("");

      titre(L, "VI. Le courrier de remise");

      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("Copie : autorité administrative compétente (L. 1233-48 ; D. 1233-5)");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : chiffrage des mesures du plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous adresse le tableau budgétaire du plan de sauvegarde de l'emploi de");
      L.push(nom(ctx) + ", mesure par mesure : bénéficiaires attendus, coût");
      L.push("unitaire, budget affecté, durée d'ouverture et modalités d'accès.");
      L.push("");
      L.push("Ce tableau est intégré au plan lui-même. Il est produit pour que les mesures");
      L.push("puissent être appréciées « au regard de l'importance du projet de");
      L.push("licenciement » et des « moyens dont disposent l'entreprise, l'unité");
      L.push("économique et sociale et le groupe », ce que l'article L. 1233-57-3 confie à");
      L.push("l'autorité administrative.");
      L.push("");
      L.push("Je rappelle que l'employeur met à l'étude les suggestions relatives aux");
      L.push("mesures sociales envisagées et les propositions alternatives que le comité");
      L.push("formule, et qu'il leur donne une réponse motivée (L. 1233-33).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : tableau budgétaire · plan de sauvegarde de l'emploi dans sa");
      L.push("version intégrant ce tableau · [le cas échéant] devis et conventions");
      L.push("justifiant les montants");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous remplissez le tableau. Comptez une à");
      L.push("deux semaines : les montants se justifient par des devis et des engagements,");
      L.push("qui se demandent.");
      L.push("");
      L.push("Au plus tard le " + leJour(dans(d0, 14)) + " — le tableau est intégré au plan.");
      L.push("");
      L.push("Avant la convocation du comité — le plan chiffré doit être PRÊT : L. 1233-32");
      L.push("impose de l'adresser avec elle, et non de le remettre en séance. Voyez le");
      L.push("document du contrôle CTL-PSE-06.");
      L.push("");
      if (dr) {
        L.push("Vos réunions se sont tenues jusqu'au " + jour(dr) + ". Un chiffrage ajouté");
        L.push("APRÈS cette date n'a pas été soumis au comité : reconvoquez sur la version");
        L.push("définitive avant de saisir l'administration, plutôt que de déposer un plan");
        L.push("que le comité n'a pas vu dans cet état.");
        L.push("");
      }
      L.push("Puis la saisine de l'administration, par la voie dématérialisée");
      L.push("(D. 1233-14), et son délai de décision de quinze ou vingt et un jours");
      L.push("(L. 1233-57-4)" +
        (delaiDecision(f) ? ", soit " + delaiDecision(f) + " jours dans votre voie." : "."));

      pied(L, ["L. 1233-32", "L. 1233-33", "L. 1233-48", "L. 1233-57-2",
        "L. 1233-57-3", "L. 1233-57-4", "L. 1233-61", "L. 1233-62", "L. 1233-63",
        "D. 1233-5", "D. 1233-14"],
        "Le texte des rubriques est reproduit depuis l'article L. 1233-62 dans sa\n" +
        "version lue au dépôt (LEGIARTI000036261725).\n" +
        "\n" +
        "Ce qui se joue : le refus d'homologation ou de validation. Et si la décision\n" +
        "est annulée « en raison d'une absence ou d'une insuffisance de plan de\n" +
        "sauvegarde de l'emploi mentionné à l'article L. 1233-61, la procédure de\n" +
        "licenciement est nulle » (L. 1235-10) ; le juge peut ordonner la poursuite du\n" +
        "contrat ou la réintégration, et à défaut octroie une indemnité « qui ne peut\n" +
        "être inférieure aux salaires des six derniers mois » (L. 1235-11).");
      return L.join("\n");
    });

  doc("CTL-PSE-06",
    "La convocation du comité accompagnée du projet de plan, et son bordereau",
    "La convocation datée, le bordereau des pièces jointes rubrique par rubrique " +
    "de l'article L. 1233-31, la feuille de décharge, la mention à porter au " +
    "procès-verbal, et le constat à établir si une réunion s'est tenue sans le plan.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var pp = pieceDe(f, "pse");
      var datePlan = pp && pp.date ? pp.date : null;
      var dConv = f.dateInfoCSE;
      var apres = estDate(datePlan) && estDate(dConv) && datePlan > dConv;
      var r = regime(f), rs = reunions(f), d0 = aujourd(ctx);
      var eff = effectifDe(ctx);

      L = L.concat(entete(ctx, "Convocation du comité social et économique et projet de plan",
        "articles L. 1233-31 et L. 1233-32 du code du travail"));

      if (apres) {
        irrattrapable(L, [
          "Le projet de plan enregistré comme pièce porte la date du " + jour(datePlan) + ".",
          "La convocation du comité a été adressée le " + jour(dConv) + ".",
          "Le plan est donc POSTÉRIEUR à la convocation : il n'a pas pu être adressé",
          "avec elle.",
          "",
          "L'article L. 1233-32 impose que, dans les entreprises d'au moins cinquante",
          "salariés, l'employeur « adresse le plan de sauvegarde de l'emploi » aux",
          "représentants du personnel, outre les renseignements de l'article L. 1233-31",
          "— lesquels sont adressés, selon ce dernier, « avec la convocation à la",
          "première réunion ».",
        ], "Une réunion tenue sans le plan ne se répare pas en versant le plan ensuite : " +
           "elle se REPREND, sur une nouvelle convocation à laquelle le plan est joint. " +
           "La partie VI ci-dessous s'en charge.");
      }

      modeEmploi(L, [
        "Ce document sert à convoquer AVEC le plan, et à en garder la preuve. La",
        "preuve est la moitié du travail : un employeur qui a bien joint le plan mais",
        "ne peut pas l'établir se trouve dans la même position que celui qui ne l'a",
        "pas joint.",
        "",
        "D'où les trois pièces qui suivent la convocation : le bordereau, qui dit ce",
        "qui part ; la décharge, qui dit à qui et quand ; la mention au procès-verbal,",
        "qui le fait constater par le comité lui-même.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Ce qui doit partir avec la convocation");

      L.push("L. 1233-31 : « L'employeur adresse aux représentants du personnel, AVEC LA");
      L.push("CONVOCATION À LA PREMIÈRE RÉUNION, tous renseignements utiles sur le projet");
      L.push("de licenciement collectif. Il indique : 1° La ou les raisons économiques,");
      L.push("financières ou techniques du projet de licenciement ; 2° Le nombre de");
      L.push("licenciements envisagé ; 3° Les catégories professionnelles concernées et les");
      L.push("critères proposés pour l'ordre des licenciements ; 4° Le nombre de salariés,");
      L.push("permanents ou non, employés dans l'établissement ; 5° Le calendrier");
      L.push("prévisionnel des licenciements ; 6° Les mesures de nature économique");
      L.push("envisagées ; 7° Le cas échéant, les conséquences de la réorganisation en");
      L.push("matière de santé, de sécurité ou de conditions de travail. »");
      L.push("");
      L.push("L. 1233-32 : « Outre les renseignements prévus à l'article L. 1233-31, dans");
      L.push("les entreprises de moins de cinquante salariés, l'employeur adresse aux");
      L.push("représentants du personnel les mesures qu'il envisage de mettre en oeuvre");
      L.push("pour éviter les licenciements ou en limiter le nombre et pour faciliter le");
      L.push("reclassement du personnel dont le licenciement ne pourrait être évité. Dans");
      L.push("les entreprises d'au moins cinquante salariés, l'employeur adresse LE PLAN DE");
      L.push("SAUVEGARDE DE L'EMPLOI concourant aux mêmes objectifs. »");
      L.push("");
      L.push("Les deux articles se lisent ensemble : le plan s'ajoute aux renseignements,");
      L.push("il ne les remplace pas. Et les renseignements partent « avec la convocation");
      L.push("à la première réunion » : c'est le seul moment que le texte fixe.");
      L.push("");
      L.push("  Effectif de l'entreprise : " +
        (eff === null ? "[non renseigné — les deux branches de L. 1233-32 valent, et"
          : eff + " salariés."));
      if (eff === null) {
        L.push("  elles sont énoncées ci-dessus]");
      } else if (eff >= 50) {
        L.push("  Branche applicable : « au moins cinquante salariés » — c'est LE PLAN qui");
        L.push("  est adressé avec la convocation.");
      } else {
        L.push("  Branche applicable : « moins de cinquante salariés » — ce sont LES MESURES");
        L.push("  envisagées qui sont adressées avec la convocation, et non un plan.");
      }
      L.push("");
      L.push("Et l'administration reçoit la même chose au même moment : L. 1233-48");
      L.push("dispose que « l'ensemble des informations communiquées aux représentants du");
      L.push("personnel lors de leur convocation aux réunions prévues par les articles");
      L.push("L. 1233-29 et L. 1233-30 est communiqué simultanément à l'autorité");
      L.push("administrative », par la voie dématérialisée (D. 1233-5).");
      L.push("");

      titre(L, "II. L'état de votre dossier");

      tableau(L, ["Élément", "Ce que la fiche porte"], [
        ["Date de la convocation", estDate(dConv) ? jour(dConv) : "[non renseignée]"],
        ["Projet de plan enregistré comme pièce", pp ? (pp.fichier ? String(pp.fichier) : "oui, sans nom de fichier") : "[aucune pièce « pse »]"],
        ["Date portée par le projet de plan", estDate(datePlan) ? jour(datePlan) : "[non datée]"],
        ["Le plan a-t-il été lu et rapproché ?", pp ? (pp.lue === true ? "oui" : pp.lue === false ? "NON" : "[non renseigné]") : "[  ]"],
        ["Réunions tenues", rs.length ? rs.map(function (x) { return jour(x); }).join(" · ") : "[aucune]"],
      ]);
      L.push("");
      if (!pp) {
        L.push("  Le projet de plan n'est pas enregistré comme pièce datée. Ce n'est pas une");
        L.push("  formalité de classement : sans date portée sur la pièce, rien n'établit");
        L.push("  qu'il existait au jour de la convocation. Enregistrez-le avec sa date, son");
        L.push("  auteur, sa version et son périmètre.");
        L.push("");
      } else if (!estDate(datePlan)) {
        L.push("  La pièce existe mais n'est pas datée. Une pièce non datée ne prouve pas");
        L.push("  son antériorité — et c'est exactement ce qu'il s'agit de prouver ici.");
        L.push("");
      } else if (!apres) {
        L.push("  Le projet de plan est daté du " + jour(datePlan) + ", soit à la date de la");
        L.push("  convocation ou avant. Reste à établir qu'il a EFFECTIVEMENT été joint :");
        L.push("  c'est l'objet du bordereau et de la décharge ci-dessous.");
        L.push("");
      }

      titre(L, "III. La convocation");

      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("[et, le cas échéant : aux membres du comité social et économique central]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : convocation à la réunion du [DATE] — projet de licenciement collectif");
      L.push("pour motif économique et plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Vous êtes convoqués à la réunion du comité social et économique qui se tiendra");
      L.push("le [DATE] à [HEURE], [LIEU].");
      L.push("");
      L.push("Conformément à l'article L. 1233-31 du code du travail, je vous adresse avec");
      L.push("la présente convocation l'ensemble des renseignements utiles sur le projet de");
      L.push("licenciement collectif, dont le détail figure au bordereau ci-joint.");
      L.push("");
      L.push("Conformément à l'article L. 1233-32 du même code, je vous adresse également");
      L.push("le plan de sauvegarde de l'emploi.");
      L.push("");
      if (r && r.reunions) {
        L.push("Cette réunion est la [première / seconde] des " + r.reunions + " que le");
        L.push("régime applicable impose.");
      } else {
        L.push("Cette réunion est la [première / seconde] de celles que le régime applicable");
        L.push("impose : « deux réunions, séparées par un délai qui ne peut être supérieur à");
        L.push("quatorze jours » dans les entreprises de moins de cinquante salariés");
        L.push("(L. 1233-29) ; « au moins deux réunions espacées d'au moins quinze jours »");
        L.push("dans celles d'au moins cinquante (L. 1233-30, I).");
      }
      L.push("");
      L.push("Je rappelle que le comité peut, lors de la première réunion, décider de");
      L.push("recourir à une expertise (L. 1233-34), et que je mets à l'étude les");
      L.push("suggestions relatives aux mesures sociales envisagées et les propositions");
      L.push("alternatives que vous formulerez, en y apportant une réponse motivée");
      L.push("(L. 1233-33).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "IV. Le bordereau des pièces jointes");

      L.push("Une ligne par pièce. Ce bordereau part avec la convocation, et un exemplaire");
      L.push("signé revient au dossier.");
      L.push("");
      tableau(L, ["N°", "Pièce", "Fondement", "Ce qu'elle doit établir", "Jointe"], [
        ["1", "Note sur les raisons économiques, financières ou techniques",
          "L. 1233-31, 1°", "la cause invoquée, datée et chiffrée", "☐"],
        ["2", "Nombre de licenciements envisagé", "L. 1233-31, 2°",
          "le nombre, sur la période de trente jours", "☐"],
        ["3", "Catégories professionnelles et critères d'ordre proposés",
          "L. 1233-31, 3°", "la construction des catégories et les critères", "☐"],
        ["4", "Effectif de l'établissement, permanents et non permanents",
          "L. 1233-31, 4°", "l'effectif réel, y compris précaires", "☐"],
        ["5", "Calendrier prévisionnel des licenciements", "L. 1233-31, 5°",
          "les dates envisagées", "☐"],
        ["6", "Mesures de nature économique envisagées", "L. 1233-31, 6°",
          "ce qui est fait hors licenciement", "☐"],
        ["7", "Conséquences en matière de santé, sécurité, conditions de travail",
          "L. 1233-31, 7°", "les effets du projet sur le travail", "☐"],
        ["8", "PLAN DE SAUVEGARDE DE L'EMPLOI", "L. 1233-32",
          "le plan lui-même, daté, dans sa version soumise", "☐"],
        ["9", "Tableau budgétaire du plan", "L. 1233-57-3",
          "le chiffrage mesure par mesure (CTL-PSE-05)", "☐"],
        ["10", "Note motivée des rubriques écartées", "L. 1233-62",
          "pourquoi telle rubrique ne reçoit pas de mesure", "☐"],
      ]);
      L.push("");
      L.push("  Version du plan jointe : [numéro de version et date]");
      L.push("  Nombre total de pages adressées : [  ]");
      L.push("");
      L.push("  [Numérotez les pages du plan et indiquez le total. C'est la façon la plus");
      L.push("  simple d'établir, plus tard, que c'est bien CETTE version qui a été");
      L.push("  adressée.]");
      L.push("");

      titre(L, "V. La décharge, et la mention au procès-verbal");

      L.push("DÉCHARGE — un exemplaire par destinataire, conservé au dossier.");
      L.push("");
      tableau(L, ["Destinataire", "Qualité", "Moyen d'envoi", "Date", "Signature"], [
        ["[nom]", "titulaire", "[remise en main propre / LRAR / courriel AR]", "[  ]", ""],
        ["[nom]", "suppléant", "[  ]", "[  ]", ""],
        ["[nom]", "représentant syndical au comité", "[  ]", "[  ]", ""],
      ]);
      L.push("");
      L.push("  Convoquez les suppléants : ils n'assistent qu'en l'absence du titulaire,");
      L.push("  mais la seule façon de prouver qu'ils ont été convoqués est de les avoir");
      L.push("  convoqués. Le moyen doit conférer date certaine — c'est cette date qui se");
      L.push("  discute.");
      L.push("");
      L.push("MENTION À PORTER AU PROCÈS-VERBAL DE LA RÉUNION :");
      L.push("");
      L.push("  « Le président rappelle que la convocation du [DATE] a été adressée aux");
      L.push("  membres du comité accompagnée des renseignements prévus à l'article");
      L.push("  L. 1233-31 du code du travail et du plan de sauvegarde de l'emploi prévu à");
      L.push("  l'article L. 1233-32, tels qu'énumérés au bordereau annexé au présent");
      L.push("  procès-verbal. Les membres présents en donnent acte / formulent les");
      L.push("  observations suivantes : [  ]. »");
      L.push("");
      L.push("  [Si les membres contestent avoir reçu le plan, faites-le consigner tel");
      L.push("  quel. Un procès-verbal qui tait une contestation ne la fait pas");
      L.push("  disparaître : il la déplace vers l'instruction du dossier, où elle sera");
      L.push("  soulevée sans que vous ayez pu y répondre.]");
      L.push("");
      L.push("Ce procès-verbal est adressé à l'autorité administrative : L. 1233-48 impose");
      L.push("que « l'employeur lui adresse également les procès-verbaux des réunions »,");
      L.push("lesquels « comportent les avis, suggestions et propositions des représentants");
      L.push("du personnel ».");
      L.push("");

      titre(L, "VI. Si une réunion s'est tenue sans le plan");

      L.push("Il n'y a rien à ajouter au dossier de cette réunion : il y a une réunion à");
      L.push("reprendre.");
      L.push("");
      L.push("  1. N'utilisez pas l'avis rendu lors de cette réunion à l'appui de la");
      L.push("     demande de validation ou d'homologation : l'article L. 1233-57-3 fait");
      L.push("     vérifier « la régularité de la procédure d'information et de");
      L.push("     consultation du comité social et économique », et L. 1233-57-2, 2°, la");
      L.push("     même chose pour la validation.");
      L.push("  2. Adressez une NOUVELLE convocation, avec le plan et les renseignements de");
      L.push("     L. 1233-31, et recueillez les décharges.");
      L.push("  3. Faites consigner au procès-verbal de la nouvelle réunion que le plan a");
      L.push("     été adressé avec la convocation.");
      L.push("  4. Ne modifiez pas la date de la première convocation et ne redatez pas le");
      L.push("     plan. Le calendrier réel se consigne ; il ne se réécrit pas.");
      L.push("");
      L.push("  Nouvelle convocation adressée le [DATE] pour une réunion du [DATE].");
      L.push("  Motif consigné : [reprise de la consultation, le plan n'ayant pas été joint");
      L.push("  à la convocation du " + (estDate(dConv) ? jour(dConv) : "[DATE]") + "].");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous vérifiez que le plan est daté, complet");
      L.push("et chiffré. Un plan qui n'est pas prêt ne se convoque pas : il se termine.");
      L.push("");
      L.push("Le jour de la convocation — le plan part AVEC elle, et le même jour à");
      L.push("l'autorité administrative (L. 1233-48 ; D. 1233-5).");
      L.push("");
      if (r && r.reunions === 2) {
        L.push("Puis les deux réunions que le régime impose. " +
          (r.libelle ? "Régime retenu : " + r.libelle + "." : ""));
        L.push("");
      }
      L.push("Si vous convoquiez aujourd'hui, la seconde réunion ne pourrait pas se tenir");
      L.push("avant le " + leJour(dans(d0, 15)) + " dans une entreprise d'au moins cinquante");
      L.push("salariés — « au moins deux réunions espacées d'au moins quinze jours »");
      L.push("(L. 1233-30, I) —, et devrait se tenir au plus tard le " +
        leJour(dans(d0, 14)) + " dans");
      L.push("une entreprise de moins de cinquante — « deux réunions, séparées par un délai");
      L.push("qui ne peut être supérieur à quatorze jours » (L. 1233-29). Les deux règles");
      L.push("ne disent pas la même chose : l'une fixe un minimum, l'autre un maximum.");
      L.push("");
      L.push("Enfin le dépôt de la demande, après la dernière réunion, par la voie");
      L.push("dématérialisée (D. 1233-14).");

      pied(L, ["L. 1233-29", "L. 1233-30", "L. 1233-31", "L. 1233-32", "L. 1233-33",
        "L. 1233-34", "L. 1233-48", "L. 1233-57-2", "L. 1233-57-3", "L. 1233-62",
        "D. 1233-5", "D. 1233-14"],
        "Ce qui se joue : une consultation menée sans le plan est une irrégularité de\n" +
        "la procédure d'information et de consultation, que l'administration vérifie\n" +
        "expressément (L. 1233-57-2, 2° ; L. 1233-57-3). Elle expose au refus de\n" +
        "validation ou d'homologation, et le licenciement prononcé en l'absence de\n" +
        "décision est nul (L. 1235-10).");
      return L.join("\n");
    });

  doc("CTL-PSE-07",
    "Le décompte des suffrages et la note de bascule vers le document unilatéral",
    "Le tableau de décompte organisation par organisation, le calcul du seuil de " +
    "50 % tel que L. 1233-24-1 le définit, le bordereau du procès-verbal des " +
    "dernières élections, et — si le seuil n'est pas atteint — la note qui arrête " +
    "le passage au document unilatéral et le calendrier qui en découle.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var p = f.pse || {};
      var s = nbf(p.suffrages);
      var v = voie(f), dr = derniereReunion(f), d0 = aujourd(ctx);

      L = L.concat(entete(ctx, "Décompte des suffrages et condition de représentativité",
        "article L. 1233-24-1 du code du travail"));

      modeEmploi(L, [
        "Le seuil de 50 % n'est pas celui qu'on croit. Il ne se calcule ni sur les",
        "inscrits, ni sur les votants, ni sur tous les suffrages exprimés : il se",
        "calcule sur les « suffrages exprimés EN FAVEUR D'ORGANISATIONS RECONNUES",
        "REPRÉSENTATIVES au premier tour des dernières élections des titulaires au",
        "comité social et économique ». Les suffrages allés à une liste non",
        "représentative sortent du dénominateur.",
        "",
        "Le texte ajoute « quel que soit le nombre de votants » : le quorum du premier",
        "tour est sans effet sur ce calcul. Un premier tour sans quorum a tout de même",
        "produit des suffrages, et ce sont eux qui comptent.",
        "",
        "Faites ce calcul AVANT de déposer l'accord. Un accord déposé en deçà du seuil",
        "ne sera pas validé, et le temps perdu ne se rattrape pas : il faut alors",
        "élaborer le document unilatéral et rouvrir un délai d'instruction de vingt et",
        "un jours.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte");

      L.push("L. 1233-24-1, deuxième phrase : l'accord « est signé par une ou plusieurs");
      L.push("organisations syndicales représentatives ayant recueilli au moins 50 % des");
      L.push("suffrages exprimés en faveur d'organisations reconnues représentatives au");
      L.push("premier tour des dernières élections des titulaires au comité social et");
      L.push("économique, quel que soit le nombre de votants, ou par le conseil");
      L.push("d'entreprise dans les conditions prévues à l'article L. 2321-9. »");
      L.push("");
      L.push("Quatre conditions dans une seule phrase, et chacune se vérifie :");
      L.push("");
      L.push("  — les signataires sont des organisations REPRÉSENTATIVES ;");
      L.push("  — le score cumulé atteint 50 % ;");
      L.push("  — le score se mesure au PREMIER TOUR des DERNIÈRES élections ;");
      L.push("  — et sur le collège des TITULAIRES au comité social et économique.");
      L.push("");
      L.push("L'article L. 2321-9, qui règle la signature par le conseil d'entreprise,");
      L.push("n'est pas au corpus du module : il est nommé ici, non reproduit.");
      L.push("");

      titre(L, "II. Le décompte, organisation par organisation");

      L.push("À remplir à partir du procès-verbal des dernières élections des titulaires,");
      L.push("et de lui seul. Un chiffre de mémoire ne se vérifie pas.");
      L.push("");
      tableau(L, ["Organisation", "Reconnue représentative", "Suffrages 1er tour titulaires",
        "Signataire de l'accord"], [
        ["[organisation]", "☐ oui ☐ non", "[  ]", "☐"],
        ["[organisation]", "☐ oui ☐ non", "[  ]", "☐"],
        ["[organisation]", "☐ oui ☐ non", "[  ]", "☐"],
        ["[liste non représentative]", "non", "[  ]", "—"],
      ]);
      L.push("");
      L.push("LE CALCUL :");
      L.push("");
      L.push("  A. Suffrages exprimés au premier tour, titulaires, TOUTES listes .... [  ]");
      L.push("  B. Dont suffrages allés à des organisations RECONNUES");
      L.push("     REPRÉSENTATIVES ............................................... [  ]");
      L.push("  C. Suffrages recueillis par les organisations SIGNATAIRES .......... [  ]");
      L.push("");
      L.push("  Pourcentage à comparer au seuil : C ÷ B × 100 = [  ] %");
      L.push("");
      L.push("  Le dénominateur est B, non A. C'est la source d'erreur la plus fréquente,");
      L.push("  et elle joue toujours dans le même sens : elle fait paraître le score plus");
      L.push("  faible qu'il n'est, ou masque un seuil atteint.");
      L.push("");
      L.push("  Nombre de votants ................................................ [  ]");
      L.push("  Quorum atteint au premier tour ? ☐ oui ☐ non — sans effet sur le calcul,");
      L.push("  le texte disant « quel que soit le nombre de votants ».");
      L.push("");
      L.push("  Calcul établi le [DATE] par [nom et qualité], à partir du procès-verbal");
      L.push("  des élections du [DATE].");
      L.push("");

      titre(L, "III. Ce que la fiche porte, et ce qu'il faut en faire");

      if (s === null) {
        L.push("La fiche ne porte AUCUN pourcentage de suffrages. C'est ce que le contrôle a");
        L.push("relevé : tant que ce chiffre manque, personne ne peut dire si l'accord est");
        L.push("validable — ni vous, ni l'administration, ni le rapport d'audit.");
        L.push("");
        L.push("Faites le calcul du II, reportez le résultat dans la fiche, et relancez");
        L.push("l'audit.");
      } else if (s >= 50) {
        L.push("La fiche porte " + s + " % des suffrages pour les signataires : la condition");
        L.push("de l'article L. 1233-24-1 est remplie, telle que la fiche la déclare.");
        L.push("");
        L.push("Une déclaration n'est pas une preuve. Joignez au dossier le procès-verbal");
        L.push("des élections et le calcul du II : c'est ce qui établit le chiffre, et");
        L.push("l'administration vérifie « la conformité [de l'accord] aux articles");
        L.push("L. 1233-24-1 à L. 1233-24-3 » (L. 1233-57-2, 1°).");
        L.push("");
        L.push("Vérifiez en particulier le dénominateur : un score de " + s + " % calculé sur");
        L.push("l'ensemble des suffrages exprimés, et non sur les seuls suffrages allés à");
        L.push("des organisations reconnues représentatives, n'est pas le score que le");
        L.push("texte demande.");
      } else {
        L.push("La fiche porte " + s + " % des suffrages pour les signataires. Le seuil de");
        L.push("50 % n'est PAS atteint.");
        L.push("");
        L.push("Ne déposez pas cet accord comme accord majoritaire au sens de");
        L.push("L. 1233-24-1 : il ne remplit pas la condition que le texte pose, et");
        L.push("l'administration vérifie cette conformité au titre du 1° de L. 1233-57-2.");
        L.push("Passez à la partie IV.");
      }
      L.push("");
      if (v && v !== "accord") {
        L.push("Remarque — la fiche porte par ailleurs la voie du document unilatéral. Ce");
        L.push("décompte reste utile : il documente pourquoi l'accord n'a pas été retenu, et");
        L.push("c'est le premier élément de la note de bascule du IV.");
        L.push("");
      }

      titre(L, "IV. La note de bascule vers le document unilatéral");

      L.push("À établir si le seuil n'est pas atteint, ou si la négociation n'aboutit pas.");
      L.push("");
      L.push("Le texte prévoit expressément cette issue. L. 1233-24-4 : « A défaut");
      L.push("d'accord mentionné à l'article L. 1233-24-1, un document élaboré par");
      L.push("l'employeur APRÈS LA DERNIÈRE RÉUNION du comité social et économique fixe le");
      L.push("contenu du plan de sauvegarde de l'emploi et précise les éléments prévus aux");
      L.push("1° à 5° de l'article L. 1233-24-2, dans le cadre des dispositions légales et");
      L.push("conventionnelles en vigueur. »");
      L.push("");
      L.push("« NOTE ARRÊTANT LE PASSAGE AU DOCUMENT UNILATÉRAL");
      L.push("");
      L.push("Le décompte des suffrages du premier tour des dernières élections des");
      L.push("titulaires au comité social et économique, établi le [DATE] à partir du");
      L.push("procès-verbal des élections du [DATE], fait apparaître que les organisations");
      L.push("signataires ou susceptibles de signer ont recueilli [  ] % des suffrages");
      L.push("exprimés en faveur d'organisations reconnues représentatives.");
      L.push("");
      L.push("Le seuil de 50 % posé par l'article L. 1233-24-1 n'étant pas atteint, le");
      L.push("contenu du plan de sauvegarde de l'emploi sera fixé par un document élaboré");
      L.push("par l'employeur, sur le fondement de l'article L. 1233-24-4. Ce document");
      L.push("précisera les éléments prévus aux 1° à 5° de l'article L. 1233-24-2.");
      L.push("");
      L.push("Il sera élaboré après la dernière réunion du comité social et économique, et");
      L.push("soumis à l'homologation de l'autorité administrative.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE] — " + signataire(ctx) + " »");
      L.push("");
      L.push("Le document unilatéral doit préciser les cinq éléments de L. 1233-24-2 :");
      L.push("« 1° Les modalités d'information et de consultation du comité social et");
      L.push("économique […] ; 2° La pondération et le périmètre d'application des critères");
      L.push("d'ordre des licenciements mentionnés à l'article L. 1233-5 ; 3° Le calendrier");
      L.push("des licenciements ; 4° Le nombre de suppressions d'emploi et les catégories");
      L.push("professionnelles concernées ; 5° Les modalités de mise en œuvre des mesures");
      L.push("de formation, d'adaptation et de reclassement prévues à l'article");
      L.push("L. 1233-4. »");
      L.push("");
      L.push("  ☐ 1° modalités d'information et de consultation");
      L.push("  ☐ 2° pondération et périmètre des critères d'ordre");
      L.push("  ☐ 3° calendrier des licenciements");
      L.push("  ☐ 4° nombre de suppressions et catégories professionnelles");
      L.push("  ☐ 5° modalités des mesures de formation, d'adaptation et de reclassement");
      L.push("");
      L.push("  [Ces cinq points sont ceux que l'homologation vérifie en premier :");
      L.push("  L. 1233-57-3 fait contrôler « la conformité de son contenu aux dispositions");
      L.push("  législatives et aux stipulations conventionnelles relatives aux éléments");
      L.push("  mentionnés aux 1° à 5° de l'article L. 1233-24-2 ».]");
      L.push("");

      titre(L, "V. Le bordereau des pièces");

      tableau(L, ["Pièce", "Ce qu'elle doit établir", "Date", "Jointe"], [
        ["Procès-verbal des dernières élections des titulaires",
          "les suffrages du premier tour, liste par liste", "[  ]", "☐"],
        ["Décompte des suffrages (partie II)",
          "le calcul C ÷ B, et son auteur", "[  ]", "☐"],
        ["Accord collectif signé, le cas échéant",
          "les signataires et la date de signature", "[  ]", "☐"],
        ["Note de bascule (partie IV), le cas échéant",
          "pourquoi la voie unilatérale est retenue", "[  ]", "☐"],
        ["Document unilatéral, le cas échéant",
          "une date postérieure à la dernière réunion", "[  ]", "☐"],
      ]);
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous faites le décompte. Quelques jours");
      L.push("suffisent : le procès-verbal des élections porte les chiffres, il n'y a rien");
      L.push("à reconstituer.");
      L.push("");
      L.push("Au plus tard le " + leJour(dans(d0, 7)) + " — le résultat est connu, et la voie");
      L.push("est arrêtée en conséquence (document du contrôle CTL-PSE-03).");
      L.push("");
      if (dr) {
        L.push("Votre dernière réunion du comité s'est tenue le " + jour(dr) + ".");
        L.push("Un document unilatéral se daterait donc au plus tôt du " + jourPlus(dr, 1) + ",");
        L.push("et son homologation ouvrirait un délai de vingt et un jours à compter de la");
        L.push("réception du dossier complet (L. 1233-57-4) — soit, pour un dépôt le");
        L.push(jourPlus(dr, 1) + ", une décision attendue au plus tard le " +
          jourPlus(dr, 22) + ".");
        L.push("");
      } else {
        L.push("La fiche ne porte aucune date de réunion : le calendrier du document");
        L.push("unilatéral ne peut donc pas être calculé. Il court à compter de la dernière");
        L.push("réunion, que le texte fixe comme point de départ (L. 1233-24-4).");
        L.push("");
      }
      L.push("La bascule coûte du temps, et c'est la raison de faire le décompte tôt : un");
      L.push("accord déposé au-dessous du seuil ne fait pas gagner les quinze jours de la");
      L.push("validation, il fait perdre le temps de l'instruction, puis impose les vingt");
      L.push("et un jours de l'homologation.");

      pied(L, ["L. 1233-24-1", "L. 1233-24-2", "L. 1233-24-4", "L. 1233-57-2",
        "L. 1233-57-3", "L. 1233-57-4"],
        "Les articles L. 2321-9 (conseil d'entreprise) et L. 1233-5 (critères d'ordre,\n" +
        "cité par L. 1233-24-2) sont nommés tels que les textes lus les citent ;\n" +
        "L. 2321-9 n'est pas au corpus du module et n'est donc pas reproduit.\n" +
        "\n" +
        "Ce qui se joue : un accord signé en deçà du seuil ne peut pas être validé, et\n" +
        "« le licenciement intervenu en l'absence de toute décision relative à la\n" +
        "validation ou à l'homologation ou alors qu'une décision négative a été rendue\n" +
        "est nul » (L. 1235-10).");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     SALARIÉS PROTÉGÉS ET SITUATIONS INDIVIDUELLES
     ══════════════════════════════════════════════════════════════════════ */

  /* La lecture du champ « autorisation », reprise à l'identique du contrôle
     (moteur/economique/controles.js) : une case remplie n'est pas une
     autorisation, elle peut porter un refus, une attente ou une mention
     inintelligible. Deux lectures différentes du même champ, dans le rapport et
     dans le document, se remarqueraient tout de suite. */
  function sensAutorisation(s) {
    if (s == null || s === "") return { sens: "absent" };
    if (typeof s === "object") return { sens: s.sens || "absent", date: s.date };
    var t = String(s);
    var d = (t.match(/\d{4}-\d{2}-\d{2}/) || [])[0];
    if (/refus|rejet|refusé/i.test(t)) return { sens: "refus", date: d };
    if (/attente|en cours|instruction/i.test(t)) return { sens: "en attente", date: d };
    if (d && /accord|autoris|accept/i.test(t)) return { sens: "accord", date: d };
    if (d && t.trim() === d) return { sens: "accord", date: d };
    return { sens: "illisible", date: d, brut: t };
  }

  doc("CTL-PRT-01",
    "Les demandes d'autorisation de licencier les salariés protégés, et leur registre",
    "Le recensement nominatif mandat par mandat, la demande d'autorisation à " +
    "adresser à l'inspecteur du travail pour chacun, le registre de suivi des " +
    "décisions et de leur antériorité par rapport à la notification, et la " +
    "conduite à tenir en cas de refus.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var prot = liste(f.salariesProteges).map(function (x) {
        var o = x || {};
        return { nom: txt(o.nom), mandat: txt(o.mandat), a: sensAutorisation(o.autorisation) };
      });
      var dNot = f.dateNotification, d0 = aujourd(ctx);
      var refus = prot.filter(function (x) { return x.a.sens === "refus"; });
      var tardives = prot.filter(function (x) {
        return x.a.date && estDate(dNot) && x.a.date > dNot;
      });
      var manquantes = prot.filter(function (x) {
        return x.a.sens === "absent" || x.a.sens === "en attente";
      });

      L = L.concat(entete(ctx, "Salariés protégés — demandes d'autorisation et registre des décisions",
        "articles L. 2411-1 et L. 2411-5 du code du travail"));

      if (refus.length || tardives.length) {
        var quoi = [];
        if (refus.length) {
          quoi.push("La fiche porte " + refus.length + " salarié(s) protégé(s) dont");
          quoi.push("l'autorisation a été REFUSÉE : " +
            refus.map(function (x) {
              return cro(x.nom, "nom") + " (" + cro(x.mandat, "mandat") + ")";
            }).join(", ") + ".");
          quoi.push("");
        }
        if (tardives.length) {
          quoi.push("La fiche porte " + tardives.length + " autorisation(s) datée(s) APRÈS la");
          quoi.push("notification du " + jour(dNot) + " : " +
            tardives.map(function (x) {
              return cro(x.nom, "nom") + " — " + jour(x.a.date);
            }).join(", ") + ".");
          quoi.push("");
        }
        quoi.push("L'article L. 2411-5 dispose que « le licenciement d'un membre élu de la");
        quoi.push("délégation du personnel du comité social et économique, titulaire ou");
        quoi.push("suppléant ou d'un représentant syndical au comité social et économique, ne");
        quoi.push("peut intervenir qu'APRÈS AUTORISATION de l'inspecteur du travail ».");
        quoi.push("");
        quoi.push("Une autorisation qui arrive après la lettre n'est pas une autorisation");
        quoi.push("préalable : elle ne remplit pas la condition que le texte pose.");
        irrattrapable(L, quoi,
          "Ne réexpédiez rien et n'antidatez rien. Retirez du projet tout salarié dont " +
          "l'autorisation a été refusée, consignez les faits au registre du V, et " +
          "remettez le tout à votre conseil.");
      }

      modeEmploi(L, [
        "Ce document ne dit pas comment se conduit l'instruction d'une demande",
        "d'autorisation : l'application n'a pas lu à la source les articles qui la",
        "règlent — forme et contenu de la demande, consultation préalable du comité",
        "pour certains mandats, enquête contradictoire, délais d'instruction, recours",
        "hiérarchique. Ils ne sont pas au corpus de ce module, et l'application",
        "n'énonce pas ce qu'elle n'a pas lu. Faites vérifier ce point.",
        "",
        "Ce qu'il fait, en revanche, il le fait entièrement : il recense, il rédige la",
        "demande, il tient le registre, et il DATE — parce que c'est la date qui se",
        "discute. L'autorisation doit précéder la notification ; un registre qui",
        "rapproche les deux dates, salarié par salarié, est la pièce la plus utile du",
        "dossier.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Qui est protégé, et ce que la protection exige");

      L.push("Les deux articles ci-dessous sont le fondement du contrôle. Ils ne figurent");
      L.push("pas au corpus du module « licenciement économique » : ils sont lus dans celui");
      L.push("du module « comité social et économique » (moteur/cse/textes_cse.json),");
      L.push("versions LEGIARTI000035652370 et LEGIARTI000035652360. Le dire ici n'est pas");
      L.push("une précaution de style : c'est ce qui permet de vérifier laquelle des");
      L.push("versions successives a été lue.");
      L.push("");
      L.push("L. 2411-1 : « Bénéficie de la protection contre le licenciement prévue par le");
      L.push("présent chapitre, y compris lors d'une procédure de sauvegarde, de");
      L.push("redressement ou de liquidation judiciaire, le salarié investi de l'un des");
      L.push("mandats suivants : 1° Délégué syndical ; 2° Membre élu à la délégation du");
      L.push("personnel du comité social et économique ; 3° Représentant syndical au comité");
      L.push("social et économique ; 4° Représentant de proximité ; 5° Membre de la");
      L.push("délégation du personnel du comité social et économique interentreprises ;");
      L.push("6° Membre du groupe spécial de négociation et membre du comité d'entreprise");
      L.push("européen ; 7° Membre du groupe spécial de négociation et représentant au");
      L.push("comité de la société européenne ; 7° bis Membre du groupe spécial de");
      L.push("négociation et représentant au comité de la société coopérative européenne ;");
      L.push("7° ter Membre du groupe spécial de négociation et représentant au comité de");
      L.push("la société issue de la fusion transfrontalière ; 8° Représentant du personnel");
      L.push("d'une entreprise extérieure, désigné à la commission santé, sécurité et");
      L.push("conditions de travail d'un établissement comprenant au moins une installation");
      L.push("classée […] ; 9° Membre d'une commission paritaire d'hygiène, de sécurité et");
      L.push("des conditions de travail en agriculture […] ; 10° Salarié mandaté […]. »");
      L.push("");
      L.push("Trois choses à retenir de ce seul article :");
      L.push("  — la liste est plus longue que « les élus du comité » : le délégué syndical,");
      L.push("    le représentant de proximité et le salarié mandaté y sont ;");
      L.push("  — la protection joue « Y COMPRIS lors d'une procédure de sauvegarde, de");
      L.push("    redressement ou de liquidation judiciaire » — le texte l'écrit, et");
      L.push("    l'urgence d'une procédure collective n'en dispense pas ;");
      L.push("  — les mentions abrégées ci-dessus par des points de suspension renvoient à");
      L.push("    des articles d'autres codes que l'application n'a pas lus : vérifiez le");
      L.push("    texte intégral si l'un de vos salariés relève des 8°, 9° ou 10°.");
      L.push("");
      L.push("L. 2411-5 : « Le licenciement d'un membre élu de la délégation du personnel du");
      L.push("comité social et économique, titulaire ou suppléant ou d'un représentant");
      L.push("syndical au comité social et économique, ne peut intervenir qu'après");
      L.push("autorisation de l'inspecteur du travail. L'ancien membre élu de la délégation");
      L.push("du personnel du comité social et économique ainsi que l'ancien représentant");
      L.push("syndical qui, désigné depuis deux ans, n'est pas reconduit dans ses fonctions");
      L.push("lors du renouvellement du comité bénéficient également de cette protection");
      L.push("pendant les six premiers mois suivant l'expiration de leur mandat ou la");
      L.push("disparition de l'institution. »");
      L.push("");
      L.push("LES ANCIENS ÉLUS SONT DANS LE TEXTE. C'est l'oubli le plus fréquent : un");
      L.push("salarié dont le mandat s'est achevé il y a quatre mois, s'il était désigné");
      L.push("depuis deux ans et n'a pas été reconduit, est encore protégé.");
      L.push("");
      L.push("Ce que le document n'énonce pas : l'application n'a pas lu l'article qui fixe");
      L.push("la conséquence d'une notification intervenue sans autorisation ou malgré un");
      L.push("refus. Elle ne l'affirme donc pas. Ce qui est certain et lu, c'est la");
      L.push("condition : le licenciement « ne peut intervenir qu'après autorisation ».");
      L.push("Une lettre expédiée sans elle ne remplit pas cette condition, et la suite");
      L.push("appartient à votre conseil.");
      L.push("");

      titre(L, "II. Le recensement, mandat par mandat");

      if (prot.length) {
        L.push("Ce que la fiche porte :");
        L.push("");
        tableau(L, ["Salarié", "Mandat", "Autorisation déclarée", "Sens lu", "Date lue"],
          prot.map(function (x) {
            return [cro(x.nom, "nom"), cro(x.mandat, "mandat"),
              x.a.brut ? "« " + x.a.brut + " »" : (x.a.date ? x.a.date : "[aucune]"),
              x.a.sens.toUpperCase(), x.a.date ? jour(x.a.date) : "[  ]"];
          }));
        L.push("");
        if (manquantes.length) {
          L.push("  " + manquantes.length + " salarié(s) sans autorisation obtenue : " +
            manquantes.map(function (x) { return cro(x.nom, "nom"); }).join(", ") + ".");
          L.push("  Aucune notification ne peut intervenir les concernant avant l'autorisation.");
          L.push("");
        }
        var illisibles = prot.filter(function (x) { return x.a.sens === "illisible"; });
        if (illisibles.length) {
          L.push("  Mention non interprétable pour " +
            illisibles.map(function (x) { return cro(x.nom, "nom"); }).join(", ") + ".");
          L.push("  Attendu : le SENS de la décision — accord, refus ou en attente — ET sa");
          L.push("  date. « Vu », « OK » ou « dossier envoyé » ne disent ni l'un ni l'autre.");
          L.push("");
        }
        var sansDate = prot.filter(function (x) { return x.a.sens === "accord" && !x.a.date; });
        if (sansDate.length) {
          L.push("  Autorisation déclarée mais NON DATÉE pour " +
            sansDate.map(function (x) { return cro(x.nom, "nom"); }).join(", ") + " :");
          L.push("  l'antériorité par rapport à la notification n'est pas vérifiable, et");
          L.push("  c'est précisément ce qu'il faut pouvoir établir.");
          L.push("");
        }
      } else {
        L.push("La fiche ne porte aucun salarié protégé. Vérifiez-le avant de passer :");
        L.push("« aucun salarié protégé » et « la question n'a pas été posée » ne sont pas");
        L.push("la même chose, et la seconde se découvre toujours au mauvais moment.");
        L.push("");
      }
      L.push("À COMPLÉTER — un salarié par ligne, pour tous les mandats de L. 2411-1 :");
      L.push("");
      tableau(L, ["Salarié", "Mandat", "Depuis le", "Mandat en cours ?",
        "Fin de mandat", "Protection courant jusqu'au"], [
        ["[nom ou matricule]", "[mandat exact]", "[  ]", "☐ oui ☐ non", "[  ]", "[  ]"],
        ["[nom ou matricule]", "[mandat exact]", "[  ]", "☐ oui ☐ non", "[  ]", "[  ]"],
        ["[ancien élu non reconduit]", "[mandat exact]", "[  ]", "non", "[  ]",
          "[six mois après — L. 2411-5]"],
      ]);
      L.push("");
      L.push("  [Reprenez le procès-verbal des élections, les lettres de désignation");
      L.push("  syndicale et le procès-verbal du dernier renouvellement. Le mandat s'écrit");
      L.push("  exactement : « membre du CSE » ne dit pas s'il est titulaire ou suppléant,");
      L.push("  ni de quel comité — d'établissement, central.]");
      L.push("");

      titre(L, "III. La demande d'autorisation — une par salarié");

      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("Monsieur l'Inspecteur du travail");
      L.push("[Unité de contrôle compétente — adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : demande d'autorisation de licenciement pour motif économique d'un");
      L.push("salarié protégé — [NOM DU SALARIÉ], [MANDAT]");
      L.push("");
      L.push("Monsieur l'Inspecteur,");
      L.push("");
      L.push("En application de l'article L. 2411-5 du code du travail, aux termes duquel");
      L.push("le licenciement d'un membre élu de la délégation du personnel du comité social");
      L.push("et économique, titulaire ou suppléant, ou d'un représentant syndical au");
      L.push("comité, ne peut intervenir qu'après autorisation de l'inspecteur du travail,");
      L.push("je sollicite l'autorisation de licencier pour motif économique :");
      L.push("");
      L.push("  Nom et prénom ............ [  ]");
      L.push("  Emploi occupé ............ [  ]");
      L.push("  Ancienneté ............... [  ]");
      L.push("  Mandat détenu ............ [  ], depuis le [  ]");
      L.push("  Établissement ............ [  ]");
      L.push("");
      L.push("Le projet de licenciement collectif pour motif économique dans lequel s'inscrit");
      L.push("cette demande porte sur " +
        (nbLic(f) === null ? "[nombre] salariés" : nbLic(f) + " salariés") +
        " sur une même période de trente jours.");
      L.push("");
      L.push("MOTIF ÉCONOMIQUE INVOQUÉ — [exposer ici, daté et chiffré, le motif au sens de");
      L.push("l'article L. 1233-3 : difficultés économiques, mutations technologiques,");
      L.push("réorganisation nécessaire à la sauvegarde de la compétitivité, cessation");
      L.push("d'activité. Joindre les pièces qui l'établissent. L'application n'écrit pas");
      L.push("ce motif : il est propre à votre entreprise, et c'est sur lui que la décision");
      L.push("se prendra.]");
      L.push("");
      L.push("SUPPRESSION DE POSTE — [préciser le poste supprimé, l'effectif de la catégorie");
      L.push("avant et après, et la place du salarié dans l'application des critères d'ordre");
      L.push("des licenciements].");
      L.push("");
      L.push("RECHERCHE DE RECLASSEMENT — [exposer les recherches menées, les offres");
      L.push("adressées au salarié, écrites et précises, et leurs réponses. Joindre l'état");
      L.push("daté des postes disponibles et les offres.]");
      L.push("");
      L.push("ABSENCE DE LIEN AVEC LE MANDAT — [exposer les éléments qui établissent que la");
      L.push("mesure envisagée est sans rapport avec le mandat détenu.]");
      L.push("");
      L.push("Je me tiens à votre disposition pour toute pièce complémentaire et pour");
      L.push("l'enquête que vous jugerez utile de conduire.");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur l'Inspecteur, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : [état daté des postes disponibles · offres de reclassement");
      L.push("adressées et réponses · procès-verbal du comité · procès-verbal des dernières");
      L.push("élections ou lettre de désignation · éléments du motif économique · le cas");
      L.push("échéant, plan de sauvegarde de l'emploi et décision administrative]");
      L.push("");
      L.push("  [AVANT D'ENVOYER — l'application n'a pas lu les articles qui règlent la");
      L.push("  procédure de cette demande. Certaines catégories de mandats supposent une");
      L.push("  consultation préalable du comité, et la demande obéit à des formes et à des");
      L.push("  délais que ce document n'énonce pas. Faites vérifier ces points avant");
      L.push("  l'envoi : une demande irrégulière fait perdre le temps de son instruction.]");
      L.push("");

      titre(L, "IV. Le registre de suivi des décisions");

      L.push("C'est la pièce qui rapproche les deux dates. Elle se tient au fil de l'eau,");
      L.push("et elle se relit avant chaque envoi de lettre.");
      L.push("");
      tableau(L, ["Salarié", "Mandat", "Demande déposée le", "Décision", "Décision du",
        "Notification prévue le", "Antérieure ?"],
        prot.length ? prot.map(function (x) {
          return [cro(x.nom, "nom"), cro(x.mandat, "mandat"), "[  ]",
            x.a.sens === "accord" ? "accord" : x.a.sens === "refus" ? "REFUS"
              : x.a.sens === "en attente" ? "en attente" : "[  ]",
            x.a.date ? jour(x.a.date) : "[  ]",
            estDate(dNot) ? jour(dNot) : "[  ]",
            (x.a.date && estDate(dNot)) ? (x.a.date < dNot ? "oui" : "NON") : "[  ]"];
        }) : [["[nom]", "[mandat]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  Une demande en cours d'instruction n'est pas une autorisation. Une case");
      L.push("  « en attente » interdit l'envoi tout autant qu'une case vide.");
      L.push("");
      L.push("  Registre tenu par [nom et qualité], arrêté le [DATE].");
      L.push("");

      titre(L, "V. En cas de refus");

      L.push("  1. Retirez le salarié du projet. Il n'y a pas de deuxième lecture possible");
      L.push("     du texte : le licenciement « ne peut intervenir qu'après autorisation »,");
      L.push("     et il n'y en a pas.");
      L.push("  2. Ne notifiez rien le concernant, et vérifiez qu'aucune lettre n'est déjà");
      L.push("     partie.");
      L.push("  3. Consignez le retrait par écrit, avec sa date, et informez le comité de");
      L.push("     la modification du périmètre du projet.");
      L.push("  4. Si le retrait change le nombre de licenciements envisagés, relancez");
      L.push("     l'audit : le décompte de la fenêtre de trente jours en dépend, et avec");
      L.push("     lui le régime (documents des contrôles CTL-SEU-01 à CTL-SEU-03).");
      L.push("  5. Si une lettre est déjà partie malgré un refus, ne tentez aucune");
      L.push("     régularisation et saisissez immédiatement votre conseil.");
      L.push("");
      L.push("  CONSTAT — salarié [nom], mandat [  ], décision de refus du [DATE],");
      L.push("  notifiée à l'entreprise le [DATE]. Retiré du projet le [DATE].");
      L.push("  Aucune lettre de licenciement n'a été expédiée : ☐ vérifié le [DATE]");
      L.push("  par [nom et qualité].");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous recensez et vous déposez les demandes.");
      L.push("");
      L.push("La durée de l'instruction n'est pas fixée par un texte que l'application ait");
      L.push("lu : elle ne l'annonce donc pas. Ce qui est certain, c'est que la");
      L.push("notification est suspendue jusqu'à la décision, et que ce délai s'ajoute au");
      L.push("calendrier du projet au lieu de courir en parallèle.");
      L.push("");
      if (estDate(dNot)) {
        L.push("Votre fiche porte une notification envisagée au " + jour(dNot) + ". Chaque");
        L.push("autorisation doit être ANTÉRIEURE à cette date, non du même jour.");
        L.push("");
      }
      if (estDate((f.pse || {}).dateDecisionAdmin)) {
        L.push("Votre fiche porte par ailleurs une décision de validation ou d'homologation");
        L.push("du " + jour(f.pse.dateDecisionAdmin) + ". Les deux conditions se cumulent : la");
        L.push("lettre part après la décision administrative (L. 1233-39) ET après");
        L.push("l'autorisation de l'inspecteur du travail (L. 2411-5). C'est la plus tardive");
        L.push("des deux dates qui commande.");
        L.push("");
      }
      L.push("Le jour de l'envoi — relisez le registre du IV. Une seule ligne sans");
      L.push("autorisation datée et antérieure suffit à arrêter l'envoi pour ce salarié,");
      L.push("et pour lui seul : les autres lettres ne sont pas retenues par la sienne.");

      pied(L, ["L. 1233-3", "L. 1233-39"],
        "Les articles L. 2411-1 et L. 2411-5, fondement de ce contrôle, ne sont pas au\n" +
        "corpus du module « licenciement économique ». Ils sont reproduits ci-dessus\n" +
        "depuis le corpus du module « comité social et économique »\n" +
        "(moteur/cse/textes_cse.json), versions LEGIARTI000035652370 et\n" +
        "LEGIARTI000035652360.\n" +
        "\n" +
        "Ce que ce document N'ÉNONCE PAS : les articles qui règlent la procédure de la\n" +
        "demande d'autorisation et la conséquence d'un licenciement notifié sans elle\n" +
        "ne sont lus dans aucun corpus de l'application. Ils ne sont ni reproduits ni\n" +
        "paraphrasés, et aucune sanction n'est annoncée de ce chef.");
      return L.join("\n");
    });

  doc("CTL-IND-01",
    "La note d'examen individuel des salariés en situation particulière",
    "Le recensement nominatif des salariés en arrêt, en congé maternité ou " +
    "déclarés inaptes, la fiche d'examen à remplir pour chacun, la lettre de " +
    "mission au conseil, et la décision écrite de différer ou non la notification.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var sus = liste(f.salariesSuspendus);
      var dNot = f.dateNotification, d0 = aujourd(ctx);

      L = L.concat(entete(ctx, "Note d'examen individuel des salariés en situation particulière",
        "contrôle sans fondement textuel propre — voyez la partie I"));

      modeEmploi(L, [
        "Ce document est le seul du module qui ne conclut jamais. Ce n'est pas une",
        "faiblesse : c'est la seule attitude honnête.",
        "",
        "L'arrêt de travail, le congé de maternité et l'inaptitude constatée par le",
        "médecin du travail obéissent chacun à un régime propre, qui peut interdire ou",
        "retarder la notification. Ces régimes ne sont pas au corpus du module :",
        "l'application ne les a pas lus à la source, et elle n'écrira donc ni leurs",
        "articles, ni leurs conditions, ni leurs exceptions. Un document qui les",
        "résumerait de mémoire serait pire qu'absent — il ferait croire à un examen",
        "qui n'a pas eu lieu.",
        "",
        "Ce qu'il fait : il recense, il rassemble les pièces, il pose les questions à",
        "poser, il commande l'examen à qui peut le conduire, et il consigne la",
        "décision. C'est-à-dire tout ce qui prépare l'examen — et rien de l'examen",
        "lui-même.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Ce que ce contrôle établit, et ce qu'il n'établit pas");

      L.push("Le contrôle CTL-IND-01 n'a AUCUN article au champ « fondement ». Ce n'est pas");
      L.push("un oubli : il ne vérifie le respect d'aucune règle, il SIGNALE une situation");
      L.push("qui appelle un examen extérieur à la base.");
      L.push("");
      L.push("Il ne conclut donc jamais à la conformité. Trois issues seulement :");
      L.push("  — aucun salarié dans une telle situation n'est déclaré : sans objet ;");
      L.push("  — la question n'est pas renseignée : donnée manquante ;");
      L.push("  — des salariés le sont : chacun doit faire l'objet d'un examen distinct.");
      L.push("");
      L.push("Ce que l'application sait avec certitude, et qui suffit à justifier la");
      L.push("prudence : la date de notification n'est pas libre. L'article L. 1233-39");
      L.push("l'enferme déjà dans un délai courant à compter de la notification du projet à");
      L.push("l'autorité administrative dans les entreprises de moins de cinquante");
      L.push("salariés, et après la décision de validation ou d'homologation dans les");
      L.push("autres. Les régimes propres aux situations recensées ici ajoutent leurs");
      L.push("propres contraintes à celles-là. Elles se cumulent ; elles ne se compensent");
      L.push("pas.");
      L.push("");

      titre(L, "II. Le recensement");

      if (sus.length) {
        L.push("Ce que la fiche porte :");
        L.push("");
        tableau(L, ["Salarié", "Situation déclarée", "Depuis le", "Jusqu'au", "Pièce"],
          sus.map(function (x) {
            var o = x || {};
            return [cro(o.nom, "nom"), cro(o.situation, "situation"), "[  ]", "[  ]", "[  ]"];
          }));
        L.push("");
        L.push("  " + sus.length + " salarié(s) dans une situation particulière. Chacun doit");
        L.push("  faire l'objet d'un examen distinct, hors du champ de cette base.");
        L.push("");
      } else {
        L.push("La fiche ne porte aucun salarié en arrêt, en congé maternité ou déclaré");
        L.push("inapte. Deux lectures possibles, et elles n'ont pas la même conséquence :");
        L.push("il n'y en a pas, ou la question n'a pas été posée. Tranchez-la avant de");
        L.push("notifier.");
        L.push("");
      }
      L.push("À COMPLÉTER — pour chaque salarié concerné par le projet :");
      L.push("");
      tableau(L, ["Salarié", "Emploi", "Nature de la situation", "Début", "Fin prévue",
        "Pièce au dossier"], [
        ["[nom ou matricule]", "[  ]", "arrêt de travail", "[  ]", "[  ]",
          "[avis d'arrêt du ...]"],
        ["[nom ou matricule]", "[  ]", "congé de maternité", "[  ]", "[  ]",
          "[attestation, dates]"],
        ["[nom ou matricule]", "[  ]", "inaptitude constatée", "[  ]", "—",
          "[avis du médecin du travail du ...]"],
        ["[nom ou matricule]", "[  ]", "[autre situation à signaler]", "[  ]", "[  ]", "[  ]"],
      ]);
      L.push("");
      L.push("  [Vérifiez cette liste au jour où vous préparez l'envoi, et non au jour de");
      L.push("  l'audit : un arrêt de travail peut commencer entre les deux. C'est la");
      L.push("  situation à la date de l'envoi qui compte.]");
      L.push("");

      titre(L, "III. La fiche d'examen — une par salarié");

      L.push("À remplir par l'entreprise, puis à remettre au professionnel avec les pièces.");
      L.push("Elle ne comporte aucune appréciation juridique : ce n'est pas son rôle, et");
      L.push("une appréciation écrite par l'employeur se retourne contre lui.");
      L.push("");
      L.push("  Salarié ......................... [nom ou matricule]");
      L.push("  Emploi et catégorie ............. [  ]");
      L.push("  Ancienneté ...................... [  ]");
      L.push("  Salarié protégé ? ............... ☐ oui — mandat : [  ]  ☐ non");
      L.push("");
      L.push("  NATURE DE LA SITUATION");
      L.push("  ☐ Arrêt de travail — origine déclarée : [maladie / accident du travail /");
      L.push("    maladie professionnelle / non renseignée]");
      L.push("    Date du premier arrêt : [  ]   Prolongations : [  ]   Fin prévue : [  ]");
      L.push("  ☐ Congé de maternité ou congé qui le suit — dates : [du ... au ...]");
      L.push("    Déclaration de grossesse reçue le : [  ]");
      L.push("  ☐ Inaptitude constatée par le médecin du travail");
      L.push("    Date de l'avis : [  ]   Mentions portées sur l'avis : [  ]");
      L.push("    Propositions de reclassement formulées par le médecin : [  ]");
      L.push("  ☐ Autre : [  ]");
      L.push("");
      L.push("  PIÈCES JOINTES À LA FICHE");
      L.push("  ☐ avis d'arrêt de travail et prolongations");
      L.push("  ☐ attestation ou justificatif du congé de maternité");
      L.push("  ☐ avis d'inaptitude du médecin du travail, dans son intégralité");
      L.push("  ☐ échanges avec le médecin du travail, le cas échéant");
      L.push("  ☐ contrat de travail et avenants");
      L.push("  ☐ offres de reclassement adressées et réponses");
      L.push("  ☐ éléments du motif économique et de la suppression du poste");
      L.push("");
      L.push("  CE QUE L'ENTREPRISE ENVISAGE");
      L.push("  Date de notification envisagée pour ce salarié : " +
        (estDate(dNot) ? jour(dNot) : "[  ]"));
      L.push("  Position dans l'application des critères d'ordre : [  ]");
      L.push("  Reclassement recherché : ☐ oui ☐ non — postes proposés : [  ]");
      L.push("");
      L.push("  QUESTIONS POSÉES AU PROFESSIONNEL");
      L.push("  1. La notification peut-elle intervenir dans cette situation ?");
      L.push("  2. Si oui, à quelle date au plus tôt, et sous quelles conditions ?");
      L.push("  3. Si non, jusqu'à quand est-elle empêchée, et par quoi ?");
      L.push("  4. La situation modifie-t-elle l'application des critères d'ordre ?");
      L.push("  5. La recherche de reclassement doit-elle être conduite différemment ?");
      L.push("  6. Des formalités propres s'ajoutent-elles à celles du licenciement");
      L.push("     économique — avis, délais, mentions dans la lettre ?");
      L.push("");

      titre(L, "IV. La lettre de mission");

      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("À [Maître / cabinet], [adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : examen individuel de la situation de " +
        (sus.length ? sus.length : "[nombre]") + " salarié(s) concerné(s) par un projet");
      L.push("de licenciement pour motif économique");
      L.push("");
      L.push("Maître,");
      L.push("");
      L.push(nom(ctx) + " conduit un projet de licenciement pour motif");
      L.push("économique portant sur " +
        (nbLic(f) === null ? "[nombre]" : String(nbLic(f))) +
        " salariés sur une même période de trente jours.");
      L.push("");
      L.push("Parmi eux, " + (sus.length ? sus.length : "[nombre]") +
        " se trouvent dans une situation particulière : arrêt de");
      L.push("travail, congé de maternité ou inaptitude constatée par le médecin du");
      L.push("travail. Chacune de ces situations obéit à des règles propres, qui peuvent");
      L.push("interdire ou retarder la notification.");
      L.push("");
      L.push("Je vous confie l'examen individuel de chacune de ces situations et vous prie");
      L.push("de me faire connaître, salarié par salarié, si la notification peut");
      L.push("intervenir, à quelle date au plus tôt et sous quelles conditions.");
      L.push("");
      L.push("Vous trouverez ci-joint, pour chacun, la fiche d'examen et les pièces qui la");
      L.push("documentent.");
      L.push("");
      L.push("La notification est actuellement envisagée au " +
        (estDate(dNot) ? jour(dNot) : "[DATE]") + ". Aucune lettre ne");
      L.push("sera expédiée aux salariés concernés avant réception de votre analyse.");
      L.push("");
      L.push("Je vous prie d'agréer, Maître, l'expression de ma considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : fiches d'examen individuel · pièces de chaque situation ·");
      L.push("éléments du projet de licenciement");
      L.push("");

      titre(L, "V. La décision, consignée");

      L.push("À remplir au retour de l'analyse, et à conserver au dossier. C'est cette");
      L.push("page qui établira, plus tard, que la question a été posée avant l'envoi et");
      L.push("non après.");
      L.push("");
      tableau(L, ["Salarié", "Analyse reçue le", "Notification possible ?",
        "Date retenue", "Décision consignée le"],
        sus.length ? sus.map(function (x) {
          return [cro((x || {}).nom, "nom"), "[  ]", "☐ oui ☐ non ☐ différée", "[  ]", "[  ]"];
        }) : [["[nom]", "[  ]", "☐ oui ☐ non ☐ différée", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  Pour chaque notification DIFFÉRÉE, écrire :");
      L.push("  « La notification concernant [nom] est différée au [DATE], pour le motif");
      L.push("  suivant : [reprendre le motif donné par le conseil]. Décision prise le");
      L.push("  [DATE] par [nom et qualité]. »");
      L.push("");
      L.push("  [Différer une notification peut faire sortir un salarié de la fenêtre de");
      L.push("  trente jours, ou l'y faire entrer. Relancez l'audit après toute décision de");
      L.push("  report : le décompte du seuil de dix en dépend, et avec lui le régime tout");
      L.push("  entier — voyez le document du contrôle CTL-SEU-01.]");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous recensez et vous réunissez les pièces.");
      L.push("");
      L.push("Comptez une à deux semaines d'examen extérieur PAR SALARIÉ. Ce n'est pas une");
      L.push("formalité groupée : chaque situation est distincte, et une analyse commune à");
      L.push("trois salariés dans trois situations différentes n'analyse rien.");
      L.push("");
      L.push("Au plus tard le " + leJour(dans(d0, 21)) + " — les analyses sont revenues et");
      L.push("les décisions sont consignées.");
      L.push("");
      if (estDate(dNot)) {
        var e = ecart(iso0(d0), dNot);
        L.push("Votre fiche porte une notification envisagée au " + jour(dNot) + ".");
        if (e !== null && e < 21) {
          L.push("Il reste " + (e < 0 ? "moins de zéro jour — cette date est passée"
            : e + " jours") + " : c'est court pour un examen individuel.");
          L.push("Mieux vaut décaler la notification que de la faire sans l'avoir examinée.");
        } else {
          L.push("Le calendrier permet l'examen. Ne le comprimez pas au dernier moment.");
        }
        L.push("");
      }
      L.push("Le jour de l'envoi — reprenez le tableau du V. Un salarié dont la ligne");
      L.push("porte « différée » ne reçoit pas de lettre ce jour-là, et le reste du");
      L.push("projet n'est pas retenu par lui.");

      pied(L, ["L. 1233-39"],
        "Ce contrôle n'a aucun article au champ « fondement », et ce document n'en\n" +
        "invente pas. Les régimes propres à l'arrêt de travail, au congé de maternité\n" +
        "et à l'inaptitude ne sont dans aucun corpus lu par l'application : ils ne\n" +
        "sont ni cités, ni résumés, ni paraphrasés ici.\n" +
        "\n" +
        "Ce qui se joue : l'application ne le dit pas, parce qu'elle ne l'a pas lu.\n" +
        "C'est précisément pourquoi ce document commande un examen extérieur au lieu\n" +
        "de conclure.");
      return L.join("\n");
    });

  /* Le jour même en « AAAA-MM-JJ », pour comparer une date de la fiche à
     aujourd'hui sans repasser par une Date. */
  function iso0(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return null;
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j;
  }

})(typeof window !== "undefined" ? window : this);
