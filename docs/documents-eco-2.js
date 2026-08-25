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

  /* ══════════════════════════════════════════════════════════════════════
     LE SEUIL DE DIX
     ══════════════════════════════════════════════════════════════════════ */

  doc("CTL-SEU-01",
    "Le tableau de décompte des licenciements sur la fenêtre de trente jours",
    "Le décompte nominatif et daté, licenciement par licenciement, sur la période " +
    "de trente jours ; le total ; le régime que ce total commande, article par " +
    "article ; et la note de régime à verser au dossier.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var c = comptes(f), r = regime(f);
      var projet = nbf(f.nbLicenciements), recents = nbf(f.licenciementsRecents30j);
      var refus = nbf(f.refusModification);
      var total = c ? c.total30j : nbLic(f);
      var eff = effectifDe(ctx), d0 = aujourd(ctx);
      var bascule = c && c.projet < 10 && c.total30j >= 10;

      L = L.concat(entete(ctx, "Décompte des licenciements sur une même période de trente jours",
        "articles L. 1233-28 et L. 1233-61 du code du travail"));

      if (bascule) {
        irrattrapable(L, [
          "Le projet porte sur " + c.projet + " licenciement(s), mais la fenêtre de trente",
          "jours en compte " + c.total30j + ".",
          "",
          c.motif,
          "",
          "Le régime du licenciement collectif d'au moins dix salariés s'applique donc" +
            (eff !== null && eff >= 50 ? ", plan de sauvegarde de l'emploi compris." : "."),
          "",
          "Une procédure engagée au régime allégé ne se convertit pas en cours de",
          "route : la consultation, la notification du projet à l'autorité",
          "administrative et, le cas échéant, le plan sont des actes qui se placent",
          "AVANT ceux déjà accomplis. On ne les intercale pas après coup.",
        ], "Il faut reprendre la procédure à son commencement, tant qu'aucune lettre " +
           "n'est partie. Si des lettres sont déjà parties, la partie VI dit ce qu'il " +
           "reste à faire, et ce n'est pas une régularisation.");
      }

      modeEmploi(L, [
        "Ce document ne dit pas le droit : il COMPTE. Et c'est le compte qui décide",
        "de tout le reste — une réunion ou deux, un mois d'avis ou quatre, une",
        "information de l'administration ou une notification préalable, un plan de",
        "sauvegarde de l'emploi ou rien.",
        "",
        "L'unité comptée est LE SALARIÉ DONT LE LICENCIEMENT EST ENVISAGÉ, quel que",
        "soit le chemin qui y mène : le licenciement projeté, celui déjà prononcé",
        "dans la même fenêtre, celui qui suit le refus d'une modification du contrat.",
        "Trois colonnes, un seul total.",
        "",
        "Remplissez le tableau du II avec des NOMS et des DATES, pas avec des",
        "nombres. Un nombre ne se vérifie pas ; une ligne datée se vérifie.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Les textes que le compte déclenche");

      L.push("L. 1233-8 : « L'employeur qui envisage de procéder à un licenciement collectif");
      L.push("pour motif économique DE MOINS DE DIX SALARIÉS dans une même période de");
      L.push("trente jours réunit et consulte le comité social et économique dans les");
      L.push("entreprises d'au moins onze salariés, dans les conditions prévues par la");
      L.push("présente sous-section. Le comité social et économique rend son avis dans un");
      L.push("délai qui ne peut être supérieur, à compter de la date de la première réunion");
      L.push("au cours de laquelle il est consulté, à un mois. En l'absence d'avis rendu");
      L.push("dans ce délai, le comité social et économique est réputé avoir été consulté. »");
      L.push("");
      L.push("L. 1233-28 : « L'employeur qui envisage de procéder à un licenciement");
      L.push("collectif pour motif économique D'AU MOINS DIX SALARIÉS dans une même période");
      L.push("de trente jours réunit et consulte le comité social et économique dans les");
      L.push("conditions prévues par le présent paragraphe. »");
      L.push("");
      L.push("L. 1233-61, premier alinéa : « Dans les entreprises d'au moins cinquante");
      L.push("salariés, lorsque le projet de licenciement concerne au moins dix salariés");
      L.push("dans une même période de trente jours, l'employeur établit et met en oeuvre un");
      L.push("plan de sauvegarde de l'emploi pour éviter les licenciements ou en limiter le");
      L.push("nombre. »");
      L.push("");
      L.push("L. 1233-25 : « Lorsqu'au moins dix salariés ont refusé la modification d'un");
      L.push("élément essentiel de leur contrat de travail, proposée par leur employeur pour");
      L.push("l'un des motifs économiques énoncés à l'article L. 1233-3 et que leur");
      L.push("licenciement est envisagé, celui-ci est soumis aux dispositions applicables en");
      L.push("cas de licenciement collectif pour motif économique. »");
      L.push("");
      L.push("Ces quatre textes comptent la même unité : le salarié dont le licenciement");
      L.push("est envisagé sur une même période de trente jours. L'article L. 1233-25 règle");
      L.push("le cas où les refus atteignent dix à eux seuls ; il n'écarte pas ces salariés");
      L.push("du décompte général lorsqu'ils s'ajoutent à d'autres licenciements. C'est la");
      L.push("lecture que le moteur du module applique, et le document ne s'en écarte pas.");
      L.push("");
      L.push("Le risque de double compte se règle au questionnaire, non ici : la question");
      L.push("posée est celle des refus « non compris dans le nombre de licenciements");
      L.push("envisagés ». Vérifiez que vous y avez répondu ainsi.");
      L.push("");

      titre(L, "II. Le décompte, ligne par ligne");

      L.push("Une ligne par salarié. La date retenue est celle de l'ENVOI de la lettre pour");
      L.push("un licenciement déjà prononcé, et celle de l'envoi envisagé pour un");
      L.push("licenciement projeté.");
      L.push("");
      L.push("A — LICENCIEMENTS ENVISAGÉS DANS LE PROJET EN COURS");
      L.push("");
      tableau(L, ["N°", "Salarié", "Emploi", "Catégorie", "Date d'envoi envisagée", "Pièce"],
        [["1", "[nom ou matricule]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["2", "[nom ou matricule]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["…", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  Sous-total A ...... " + (projet === null ? "[  ]" : String(projet)) +
        (projet === null ? "  (la fiche ne le renseigne pas)" : "  (selon la fiche)"));
      L.push("");
      L.push("B — LICENCIEMENTS ÉCONOMIQUES DÉJÀ PRONONCÉS DANS LA MÊME PÉRIODE");
      L.push("");
      tableau(L, ["N°", "Salarié", "Emploi", "Date d'envoi de la lettre", "Motif", "Pièce"],
        [["1", "[nom ou matricule]", "[  ]", "[  ]", "[économique]", "[lettre du ...]"],
         ["2", "[nom ou matricule]", "[  ]", "[  ]", "[économique]", "[lettre du ...]"]]);
      L.push("");
      L.push("  Sous-total B ...... " + (recents === null ? "[  ]" : String(recents)) +
        (recents === null ? "  (NON RENSEIGNÉ — sans lui, le seuil ne peut pas être vérifié)"
          : "  (selon la fiche)"));
      L.push("");
      L.push("C — LICENCIEMENTS ENVISAGÉS APRÈS REFUS D'UNE MODIFICATION DU CONTRAT");
      L.push("");
      tableau(L, ["N°", "Salarié", "Élément essentiel modifié", "Date du refus", "Pièce"],
        [["1", "[nom ou matricule]", "[  ]", "[  ]", "[lettre de refus du ...]"],
         ["2", "[nom ou matricule]", "[  ]", "[  ]", "[lettre de refus du ...]"]]);
      L.push("");
      L.push("  Sous-total C ...... " + (refus === null ? "[  ]" : String(refus)) +
        "  — non compris dans A. Le détail se tient dans le document du");
      L.push("  contrôle CTL-SEU-02.");
      L.push("");
      L.push("LA FENÊTRE RETENUE");
      L.push("");
      L.push("  Premier jour de la période de trente jours ..... [  ]");
      L.push("  Dernier jour ................................... [  ]");
      L.push("  [La période de trente jours est GLISSANTE : elle ne se cale ni sur le mois");
      L.push("  civil ni sur la date de la première lettre. Faites glisser la fenêtre sur");
      L.push("  toutes les dates du tableau et retenez celle qui contient le plus de");
      L.push("  licenciements : c'est elle qui commande, non celle qui vous arrange.]");
      L.push("");

      titre(L, "III. Le total, et le régime qu'il commande");

      tableau(L, ["Terme", "Nombre", "Source"], [
        ["A — licenciements envisagés", projet === null ? "[  ]" : String(projet), "nbLicenciements"],
        ["B — déjà prononcés dans les trente jours", recents === null ? "[  ]" : String(recents), "licenciementsRecents30j"],
        ["C — après refus de modification", refus === null ? "[  ]" : String(refus), "refusModification"],
        ["TOTAL SUR LA FENÊTRE", total === null ? "[  ]" : String(total), "A + B + C"],
      ]);
      L.push("");
      if (c) {
        L.push("Ce que le moteur du module retient : " + c.motif);
        L.push("");
      }
      L.push("  Effectif de l'entreprise ..... " +
        (eff === null ? "[non renseigné]" : eff + " salariés"));
      L.push("");
      L.push("LE RÉGIME QUI EN DÉCOULE :");
      L.push("");
      tableau(L, ["Si le total est", "et l'effectif", "alors"], [
        ["moins de 10", "au moins 11", "L. 1233-8 : une réunion, avis dans un mois"],
        ["au moins 10", "moins de 50", "L. 1233-28 et L. 1233-29 : deux réunions, " +
          "séparées de quatorze jours au plus"],
        ["au moins 10", "au moins 50", "L. 1233-28 et L. 1233-30 : au moins deux réunions " +
          "espacées d'au moins quinze jours, avis en deux, trois ou quatre mois"],
        ["au moins 10", "au moins 50", "L. 1233-61 : PLAN DE SAUVEGARDE DE L'EMPLOI"],
        ["au moins 10", "toute entreprise", "L. 1233-46 : notification du projet à " +
          "l'autorité administrative"],
      ]);
      L.push("");
      if (r && r.libelle) {
        L.push("Régime retenu par l'audit : " + r.libelle + ".");
        if (r.delaiAvis) L.push("Délai d'avis : " + r.delaiAvis + ".");
        if (r.reunions) L.push("Réunions exigées : " + r.reunions + ".");
        if (r.pse) L.push("Plan de sauvegarde de l'emploi : dû (L. 1233-61).");
        L.push("");
      } else {
        L.push("Le moteur du module n'est pas chargé sur cette page : le régime n'est pas");
        L.push("tranché ici. Le tableau ci-dessus énonce les branches ; le rapport d'audit a");
        L.push("dit laquelle s'applique.");
        L.push("");
      }
      L.push("Et le délai d'envoi des lettres change lui aussi. Sous le régime des moins de");
      L.push("dix, L. 1233-15 dispose que la lettre « ne peut être expédiée moins de sept");
      L.push("jours ouvrables à compter de la date prévue de l'entretien préalable […]. Ce");
      L.push("délai est de quinze jours ouvrables pour le licenciement individuel d'un");
      L.push("membre du personnel d'encadrement mentionné au 2° de l'article L. 1441-13. »");
      L.push("Sous le régime des dix et plus, dans une entreprise de moins de cinquante");
      L.push("salariés, L. 1233-39 fixe un délai courant « à compter de la notification du");
      L.push("projet de licenciement à l'autorité administrative » qui « ne peut être");
      L.push("inférieur à trente jours ». Ce ne sont pas les mêmes points de départ.");
      L.push("");

      titre(L, "IV. La note de régime, à verser au dossier");

      L.push("« NOTE FIXANT LE RÉGIME APPLICABLE AU PROJET DE LICENCIEMENT");
      L.push("");
      L.push(nom(ctx) + " — projet de licenciement pour motif économique");
      L.push("");
      L.push("Le décompte des licenciements envisagés sur une même période de trente jours,");
      L.push("établi le [DATE] à partir des pièces énumérées au tableau annexé, s'établit");
      L.push("comme suit :");
      L.push("");
      L.push("  Licenciements envisagés dans le projet .......................... [  ]");
      L.push("  Licenciements économiques prononcés dans la même période ........ [  ]");
      L.push("  Licenciements envisagés après refus d'une modification du contrat [  ]");
      L.push("  TOTAL ........................................................... [  ]");
      L.push("");
      L.push("  Période retenue : du [DATE] au [DATE].");
      L.push("  Effectif de l'entreprise : [  ] salariés.");
      L.push("");
      L.push("Il en résulte que le projet relève du régime [du licenciement collectif de");
      L.push("moins de dix salariés (L. 1233-8) / du licenciement collectif d'au moins dix");
      L.push("salariés (L. 1233-28)], et [qu'un plan de sauvegarde de l'emploi est dû");
      L.push("(L. 1233-61) / qu'aucun plan n'est dû].");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE] — " + signataire(ctx) + " »");
      L.push("");
      L.push("  [Cette note se date AVANT la convocation du comité. C'est elle qui justifie");
      L.push("  le régime retenu, et une justification écrite après coup ne justifie rien.]");
      L.push("");

      titre(L, "V. Ce que le régime collectif ajoute, dans l'ordre");

      L.push("  1. La notification du projet à l'autorité administrative. L. 1233-46 :");
      L.push("     « L'employeur notifie à l'autorité administrative tout projet de");
      L.push("     licenciement pour motif économique d'au moins dix salariés dans une même");
      L.push("     période de trente jours. Lorsque l'entreprise est dotée de représentants");
      L.push("     du personnel, la notification est faite AU PLUS TÔT LE LENDEMAIN de la");
      L.push("     date prévue pour la première réunion prévue aux articles L. 1233-29 et");
      L.push("     L. 1233-30. La notification est accompagnée de tout renseignement");
      L.push("     concernant la convocation, l'ordre du jour et la tenue de cette");
      L.push("     réunion. » Elle est adressée par la voie dématérialisée (D. 1233-4).");
      L.push("  2. La consultation du comité, selon L. 1233-29 ou L. 1233-30.");
      L.push("  3. La communication simultanée à l'administration de tout ce qui est");
      L.push("     adressé aux représentants du personnel, et des procès-verbaux");
      L.push("     (L. 1233-48 ; D. 1233-5).");
      L.push("  4. Le plan de sauvegarde de l'emploi, si l'effectif atteint cinquante");
      L.push("     salariés (L. 1233-61), et la demande de validation ou d'homologation");
      L.push("     (L. 1233-57-1 ; D. 1233-14).");
      L.push("  5. La notification des licenciements, après la décision administrative");
      L.push("     (L. 1233-39).");
      L.push("");
      L.push("  Les documents des contrôles CTL-CSE et CTL-PSE couvrent chacune de ces");
      L.push("  étapes. Ce document ne les refait pas : il dit lesquelles sont devenues");
      L.push("  dues.");
      L.push("");

      titre(L, "VI. Si la procédure a été conduite au régime allégé");

      L.push("Reprendre la procédure ne veut pas dire ajouter des pièces : cela veut dire");
      L.push("recommencer les actes dans l'ordre où le texte les place.");
      L.push("");
      L.push("  ☐ Aucune lettre de licenciement n'est partie — reprenez au commencement :");
      L.push("    note de régime, convocation du comité avec les renseignements de");
      L.push("    L. 1233-31, notification du projet à l'administration, et le reste.");
      L.push("  ☐ Des lettres sont déjà parties — ne les rappelez pas, ne les réexpédiez");
      L.push("    pas, n'antidatez rien. Établissez le relevé ci-dessous et remettez-le à");
      L.push("    votre conseil.");
      L.push("");
      tableau(L, ["Salarié", "Lettre expédiée le", "Preuve d'envoi", "Régime suivi"],
        [["[nom]", "[  ]", "[avis de réception n°]", "[moins de dix]"],
         ["[nom]", "[  ]", "[avis de réception n°]", "[moins de dix]"]]);
      L.push("");
      L.push("  Relevé établi le [DATE] par [nom et qualité], remis à [conseil] le [DATE].");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez le décompte. Une journée");
      L.push("suffit si les lettres déjà envoyées sont classées ; plusieurs si elles ne le");
      L.push("sont pas.");
      L.push("");
      if (bascule) {
        L.push("La reprise au régime collectif se compte en semaines, non en jours. Repères,");
        L.push("si vous convoquiez le comité aujourd'hui :");
        L.push("");
        L.push("  Convocation ..................................... " + leJour(d0));
        L.push("  Première réunion, au plus tôt ................... [selon vos usages]");
        L.push("  Notification du projet à l'administration ....... au plus tôt le lendemain");
        L.push("    de la date prévue pour la première réunion (L. 1233-46)");
        L.push("  Seconde réunion — au moins quinze jours après la première dans une");
        L.push("    entreprise d'au moins cinquante salariés (L. 1233-30, I), quatorze jours");
        L.push("    au plus dans une entreprise de moins de cinquante (L. 1233-29)");
        L.push("  Avis du comité — dans le délai que le régime fixe" +
          (r && r.delaiAvis ? " : " + r.delaiAvis : ""));
        L.push("  Demande de validation ou d'homologation, puis quinze ou vingt et un jours");
        L.push("    de décision (L. 1233-57-4)");
        L.push("");
        L.push("Soit, au plus tôt et sans aléa, une notification bien après le " +
          leJour(dans(d0, 60)) + ".");
        L.push("");
      } else {
        L.push("Refaites ce décompte à chaque fois qu'un licenciement s'ajoute ou se");
        L.push("retire du projet. Le seuil se franchit d'un salarié, et il se franchit");
        L.push("sans avertissement : un salarié protégé dont l'autorisation est refusée, un");
        L.push("salarié dont la notification est différée, un licenciement décidé dans un");
        L.push("autre service — chacun de ces mouvements déplace le total.");
        L.push("");
        L.push("Prochaine vérification conseillée : le " + leJour(dans(d0, 30)) + ", ou le");
        L.push("jour où un licenciement s'ajoute, selon ce qui vient en premier.");
        L.push("");
      }
      L.push("Le décompte se conserve. C'est lui qui justifiera, plus tard, le régime que");
      L.push("vous avez retenu — et si vous ne le conservez pas, c'est l'autre partie qui");
      L.push("fera le compte.");

      pied(L, ["L. 1233-8", "L. 1233-15", "L. 1233-25", "L. 1233-28", "L. 1233-29",
        "L. 1233-30", "L. 1233-31", "L. 1233-39", "L. 1233-46", "L. 1233-48",
        "L. 1233-57-1", "L. 1233-57-4", "L. 1233-61", "D. 1233-4", "D. 1233-5",
        "D. 1233-14"],
        "L'article L. 1441-13, que L. 1233-15 cite pour le personnel d'encadrement,\n" +
        "n'est pas au corpus du module : il est nommé, non reproduit.\n" +
        "\n" +
        "Ce qui se joue : conduire la procédure au régime des moins de dix salariés\n" +
        "quand le seuil est franchi, c'est omettre la consultation, la notification du\n" +
        "projet à l'administration et, le cas échéant, le plan. « Le licenciement\n" +
        "intervenu en l'absence de toute décision relative à la validation ou à\n" +
        "l'homologation […] est nul » (L. 1235-10), et le juge peut ordonner la\n" +
        "poursuite du contrat ou la réintégration, à défaut une indemnité non\n" +
        "inférieure aux salaires des six derniers mois (L. 1235-11).");
      return L.join("\n");
    });

  doc("CTL-SEU-02",
    "Le décompte des refus de modification du contrat de travail",
    "Le relevé nominatif des propositions de modification et des refus, avec pour " +
    "chacun l'élément essentiel modifié, le motif économique invoqué et la date " +
    "du refus ; le décompte au regard du seuil de dix de l'article L. 1233-25 ; " +
    "et la note de régime qui en découle.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var c = comptes(f);
      var refus = nbf(f.refusModification);
      var eff = effectifDe(ctx), d0 = aujourd(ctx);
      var declencheur = refus !== null && refus >= 10;

      L = L.concat(entete(ctx, "Décompte des refus de modification du contrat de travail",
        "article L. 1233-25 du code du travail"));

      if (declencheur) {
        irrattrapable(L, [
          "La fiche porte " + refus + " salariés ayant refusé la modification d'un élément",
          "essentiel de leur contrat de travail.",
          "",
          "L. 1233-25 : « Lorsqu'au moins dix salariés ont refusé la modification d'un",
          "élément essentiel de leur contrat de travail, proposée par leur employeur pour",
          "l'un des motifs économiques énoncés à l'article L. 1233-3 et que leur",
          "licenciement est envisagé, celui-ci est soumis aux dispositions applicables en",
          "cas de licenciement collectif pour motif économique. »",
          "",
          "Le seuil est atteint à lui seul, quand bien même aucun autre licenciement ne",
          "serait envisagé.",
        ], "Une procédure conduite comme un licenciement de moins de dix salariés est " +
           "irrégulière dès l'origine, et elle ne se convertit pas : elle se reprend, " +
           "tant qu'aucune lettre n'est partie.");
      }

      modeEmploi(L, [
        "Ce document sert deux fois. D'abord à établir si le seuil de dix refus est",
        "atteint — auquel cas le régime collectif s'applique à lui seul. Ensuite, et",
        "même en deçà de dix, à documenter chaque refus : ces salariés entrent dans le",
        "décompte général de la fenêtre de trente jours, et leur nombre s'ajoute à",
        "celui des autres licenciements envisagés.",
        "",
        "Deux conditions se cumulent dans le texte, et l'une est presque toujours",
        "oubliée : le refus doit porter sur un ÉLÉMENT ESSENTIEL du contrat, ET la",
        "modification doit avoir été proposée POUR L'UN DES MOTIFS ÉCONOMIQUES de",
        "l'article L. 1233-3. Une modification proposée pour un autre motif ne compte",
        "pas ici. C'est pourquoi le tableau du II a une colonne « motif invoqué » :",
        "elle n'est pas décorative.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte, et les deux conditions qu'il pose");

      L.push("L. 1233-25 : « Lorsqu'au moins dix salariés ont refusé la modification d'un");
      L.push("élément essentiel de leur contrat de travail, proposée par leur employeur pour");
      L.push("l'un des motifs économiques énoncés à l'article L. 1233-3 et que leur");
      L.push("licenciement est envisagé, celui-ci est soumis aux dispositions applicables en");
      L.push("cas de licenciement collectif pour motif économique. »");
      L.push("");
      L.push("Les motifs auxquels le texte renvoie sont ceux de L. 1233-3, qui définit le");
      L.push("licenciement économique comme celui effectué « pour un ou plusieurs motifs");
      L.push("non inhérents à la personne du salarié résultant d'une suppression ou");
      L.push("transformation d'emploi ou d'une modification, REFUSÉE PAR LE SALARIÉ, d'un");
      L.push("élément essentiel du contrat de travail, consécutives notamment : 1° A des");
      L.push("difficultés économiques […] ; 2° A des mutations technologiques ; 3° A une");
      L.push("réorganisation de l'entreprise nécessaire à la sauvegarde de sa");
      L.push("compétitivité ; 4° A la cessation d'activité de l'entreprise. »");
      L.push("");
      L.push("Le même article ajoute que « la matérialité de la suppression, de la");
      L.push("transformation d'emploi ou de la modification d'un élément essentiel du");
      L.push("contrat de travail s'apprécie au niveau de l'entreprise ».");
      L.push("");
      L.push("TROIS QUESTIONS PAR SALARIÉ, et il faut trois oui :");
      L.push("  1. La modification portait-elle sur un élément ESSENTIEL du contrat ?");
      L.push("  2. Était-elle proposée pour l'un des quatre motifs de L. 1233-3 ?");
      L.push("  3. Le licenciement du salarié est-il envisagé à la suite du refus ?");
      L.push("");

      titre(L, "II. Le relevé, salarié par salarié");

      tableau(L, ["N°", "Salarié", "Élément essentiel modifié", "Motif invoqué",
        "Proposition du", "Réponse attendue le", "Refus du", "Forme du refus"],
        [["1", "[nom ou matricule]", "[rémunération / durée / lieu / qualification]",
          "[1° 2° 3° 4°]", "[  ]", "[  ]", "[  ]", "[écrit / silence / autre]"],
         ["2", "[nom ou matricule]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["3", "[nom ou matricule]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  [Une colonne « forme du refus » vide est un problème : ce qui vaut refus,");
      L.push("  et à quelle date, se lit sur une pièce. Joignez la lettre de proposition et");
      L.push("  la réponse du salarié, ou la preuve de l'absence de réponse dans le délai");
      L.push("  imparti.]");
      L.push("");
      L.push("  [La colonne « motif invoqué » se remplit à partir de la PROPOSITION");
      L.push("  elle-même, telle qu'elle a été adressée au salarié, et non du motif que");
      L.push("  vous retiendriez aujourd'hui. C'est ce qui a été écrit au salarié qui");
      L.push("  compte.]");
      L.push("");
      L.push("  Total des refus remplissant les trois conditions du I ..... [  ]");
      L.push("  Total déclaré dans la fiche d'audit ....................... " +
        (refus === null ? "[NON RENSEIGNÉ]" : String(refus)));
      L.push("");
      if (refus === null) {
        L.push("  Le nombre de salariés ayant refusé une modification n'est pas renseigné.");
        L.push("  Tant qu'il ne l'est pas, ni le seuil de L. 1233-25 ni le décompte de la");
        L.push("  fenêtre de trente jours ne peuvent être vérifiés.");
        L.push("");
      }

      titre(L, "III. Ce que le décompte commande");

      if (c && c.motifRefus) {
        L.push("Ce que le moteur du module retient : " + c.motifRefus);
        L.push("");
      }
      tableau(L, ["Si le nombre de refus est", "alors"], [
        ["au moins 10", "L. 1233-25 : le licenciement de ces salariés est à lui seul " +
          "soumis au régime du licenciement collectif pour motif économique"],
        ["moins de 10", "L. 1233-25 ne joue pas comme déclencheur autonome, mais ces " +
          "salariés entrent dans le décompte de la fenêtre de trente jours"],
      ]);
      L.push("");
      L.push("  Refus déclarés ................................ " +
        (refus === null ? "[  ]" : String(refus)));
      L.push("  Autres licenciements envisagés ................ " +
        (nbf(f.nbLicenciements) === null ? "[  ]" : String(nbf(f.nbLicenciements))));
      L.push("  Déjà prononcés dans les trente jours .......... " +
        (nbf(f.licenciementsRecents30j) === null ? "[  ]" : String(nbf(f.licenciementsRecents30j))));
      L.push("  TOTAL SUR LA FENÊTRE .......................... " +
        (c ? String(c.total30j) : nbLic(f) === null ? "[  ]" : String(nbLic(f))));
      L.push("  Effectif de l'entreprise ...................... " +
        (eff === null ? "[  ]" : eff + " salariés"));
      L.push("");
      L.push("Le décompte détaillé de la fenêtre se tient dans le document du contrôle");
      L.push("CTL-SEU-01. Les deux tableaux doivent porter les mêmes nombres : s'ils");
      L.push("divergent, c'est qu'un salarié a été compté deux fois, ou pas du tout.");
      L.push("");
      L.push("  ATTENTION AU DOUBLE COMPTE. La question posée par le questionnaire est");
      L.push("  celle des refus « NON COMPRIS dans le nombre de licenciements envisagés ».");
      L.push("  Si vous avez déjà fait figurer ces salariés dans le nombre de licenciements");
      L.push("  du projet, ne les recomptez pas ici : corrigez l'une des deux réponses et");
      L.push("  relancez l'audit.");
      L.push("");

      titre(L, "IV. La note de régime");

      L.push("« NOTE SUR LES REFUS DE MODIFICATION DU CONTRAT DE TRAVAIL");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("[Nombre] salariés se sont vu proposer, pour le motif économique mentionné au");
      L.push("[1° / 2° / 3° / 4°] de l'article L. 1233-3 du code du travail, la modification");
      L.push("d'un élément essentiel de leur contrat de travail : [décrire l'élément].");
      L.push("");
      L.push("[Nombre] d'entre eux l'ont refusée, aux dates portées au tableau annexé. Leur");
      L.push("licenciement est envisagé.");
      L.push("");
      L.push("En conséquence, et par application de l'article L. 1233-25 du code du travail,");
      L.push("[ces licenciements sont soumis aux dispositions applicables en cas de");
      L.push("licenciement collectif pour motif économique / le nombre de refus étant");
      L.push("inférieur à dix, ces salariés sont intégrés au décompte des licenciements");
      L.push("envisagés sur une même période de trente jours, dont le total s'élève à");
      L.push("[nombre]].");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE] — " + signataire(ctx) + " »");
      L.push("");
      L.push("Pièces annexées : propositions de modification adressées · réponses des");
      L.push("salariés · tableau du II · décompte de la fenêtre de trente jours");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez le relevé. Les pièces");
      L.push("existent déjà : ce sont vos propositions et les réponses reçues.");
      L.push("");
      L.push("Au plus tard le " + leJour(dans(d0, 7)) + " — le décompte est arrêté, et la");
      L.push("note de régime est datée. Elle doit précéder la convocation du comité :");
      L.push("c'est elle qui dit sous quel régime celle-ci est faite.");
      L.push("");
      if (declencheur) {
        L.push("Le seuil de dix étant atteint, la procédure à conduire est celle du");
        L.push("licenciement collectif : convocation et consultation du comité, notification");
        L.push("du projet à l'autorité administrative (L. 1233-46), et plan de sauvegarde de");
        L.push("l'emploi si l'entreprise atteint cinquante salariés (L. 1233-61). Comptez");
        L.push("plusieurs semaines — une notification avant le " + leJour(dans(d0, 60)));
        L.push("serait, en pratique, difficile à tenir régulièrement.");
        L.push("");
      } else {
        L.push("Refaites ce relevé si une proposition de modification est encore en cours de");
        L.push("réponse : un refus supplémentaire déplace le total, et peut faire franchir");
        L.push("le seuil de dix — celui de L. 1233-25 comme celui de la fenêtre de trente");
        L.push("jours. Notez la date à laquelle la dernière réponse est attendue : [  ].");
        L.push("");
      }
      L.push("Une proposition de modification encore ouverte n'est pas un refus, et un");
      L.push("refus n'est pas un licenciement. Datez chacun des trois : c'est la seule");
      L.push("façon de savoir, un mois plus tard, quel régime s'appliquait quand.");

      pied(L, ["L. 1233-3", "L. 1233-25", "L. 1233-28", "L. 1233-46", "L. 1233-61"],
        "Ce qui se joue : la procédure conduite au régime allégé alors que le seuil de\n" +
        "dix refus est atteint est irrégulière, et l'absence de plan de sauvegarde de\n" +
        "l'emploi expose à la nullité — « en cas d'annulation d'une décision de\n" +
        "validation […] ou d'homologation […] en raison d'une absence ou d'une\n" +
        "insuffisance de plan de sauvegarde de l'emploi mentionné à l'article\n" +
        "L. 1233-61, la procédure de licenciement est nulle » (L. 1235-10).");
      return L.join("\n");
    });

  doc("CTL-SEU-03",
    "Le relevé anti-fractionnement des trois mois consécutifs",
    "Le relevé mois par mois des licenciements économiques des trois mois " +
    "précédents, la vérification de la condition d'effectif, le constat du " +
    "déclenchement ou non de la règle de l'article L. 1233-26, et la note fixant " +
    "le régime du nouveau projet.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var trois = nbf(f.licenciements3moisGlissants);
      var c = comptes(f);
      var eff = effectifDe(ctx), d0 = aujourd(ctx);
      var declenche = eff !== null && eff >= 50 && trois !== null && trois > 10 &&
        c && c.total30j < 10;

      L = L.concat(entete(ctx, "Relevé des licenciements économiques des trois mois consécutifs",
        "article L. 1233-26 du code du travail"));

      if (declenche) {
        irrattrapable(L, [
          trois + " licenciements économiques ont été prononcés sur les trois mois",
          "consécutifs précédents, sans qu'aucune période de trente jours n'en compte dix.",
          "",
          "L. 1233-26 : « Lorsqu'une entreprise ou un établissement employant",
          "habituellement au moins cinquante salariés a procédé pendant trois mois",
          "consécutifs à des licenciements économiques de plus de dix salariés au total,",
          "sans atteindre dix salariés dans une même période de trente jours, TOUT",
          "NOUVEAU LICENCIEMENT ÉCONOMIQUE envisagé au cours des trois mois suivants est",
          "soumis aux dispositions du présent chapitre. »",
          "",
          "La règle est déclenchée. Le nouveau projet relève du régime du licenciement",
          "collectif, quel que soit le nombre de salariés qu'il concerne.",
        ], "Conduire la nouvelle procédure au régime allégé la rend irrégulière dès son " +
           "premier acte. Ce document sert à l'établir, à le dater, et à en tirer le " +
           "calendrier — non à le corriger après coup.");
      }

      modeEmploi(L, [
        "C'est une règle qui se retourne contre l'employeur prudent. Un employeur qui",
        "étale ses licenciements pour rester sous le seuil de dix sur trente jours",
        "franchit un autre seuil : celui de dix sur trois mois consécutifs. Et à",
        "partir de là, TOUT nouveau licenciement économique des trois mois suivants —",
        "fût-il unique — relève du régime collectif.",
        "",
        "Le relevé se fait donc à l'envers du réflexe habituel : on ne compte pas ce",
        "que le projet contient, on compte ce que les trois mois passés ont contenu.",
        "",
        "Deux conditions doivent être réunies, et la première est la plus vite",
        "vérifiée : l'entreprise ou l'établissement doit employer HABITUELLEMENT au",
        "moins cinquante salariés. En deçà, l'article ne s'applique pas.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte");

      L.push("L. 1233-26 : « Lorsqu'une entreprise ou un établissement employant");
      L.push("habituellement au moins cinquante salariés a procédé pendant trois mois");
      L.push("consécutifs à des licenciements économiques de plus de dix salariés au total,");
      L.push("sans atteindre dix salariés dans une même période de trente jours, tout");
      L.push("nouveau licenciement économique envisagé au cours des trois mois suivants est");
      L.push("soumis aux dispositions du présent chapitre. »");
      L.push("");
      L.push("Quatre conditions, à vérifier dans cet ordre :");
      L.push("  1. l'entreprise ou l'établissement emploie HABITUELLEMENT au moins");
      L.push("     cinquante salariés ;");
      L.push("  2. des licenciements économiques ont été prononcés pendant TROIS MOIS");
      L.push("     CONSÉCUTIFS ;");
      L.push("  3. leur total dépasse dix — « PLUS de dix salariés au total », donc onze au");
      L.push("     moins ;");
      L.push("  4. sans qu'aucune période de trente jours en ait compté dix.");
      L.push("");
      L.push("Si les quatre sont réunies, la conséquence porte sur les TROIS MOIS SUIVANTS,");
      L.push("et sur « tout nouveau licenciement économique envisagé » — le singulier est");
      L.push("dans le texte.");
      L.push("");

      titre(L, "II. La condition d'effectif");

      L.push("  Effectif de l'entreprise ............... " +
        (eff === null ? "[NON RENSEIGNÉ]" : eff + " salariés"));
      L.push("  Effectif de l'établissement concerné ... " +
        (nbf(f.effectifEtablissement) === null ? "[  ]" : nbf(f.effectifEtablissement) + " salariés"));
      L.push("");
      if (eff === null) {
        L.push("  L'effectif n'est pas renseigné : la règle ne peut pas être vérifiée.");
        L.push("  Renseignez-le et relancez l'audit.");
      } else if (eff < 50) {
        L.push("  L'effectif est inférieur à cinquante salariés. L'article L. 1233-26 ne vise");
        L.push("  que les entreprises ou établissements employant habituellement au moins");
        L.push("  cinquante salariés : la règle ne trouve pas à s'appliquer.");
        L.push("");
        L.push("  Remplissez néanmoins le relevé du III. L'effectif peut changer, et le");
        L.push("  texte vise aussi l'ÉTABLISSEMENT : un établissement d'au moins cinquante");
        L.push("  salariés dans une entreprise plus petite n'existe pas, mais l'inverse");
        L.push("  arrive — et c'est alors l'établissement qu'il faut regarder.");
      } else {
        L.push("  L'effectif atteint cinquante salariés : la première condition est remplie.");
        L.push("  Le mot « habituellement » se vérifie sur la durée, non au jour du projet :");
        L.push("  [indiquer l'effectif moyen des douze derniers mois, et la pièce qui");
        L.push("  l'établit].");
      }
      L.push("");

      titre(L, "III. Le relevé, mois par mois");

      L.push("Trois mois consécutifs, antérieurs au projet en cours. Une ligne par");
      L.push("licenciement, groupée par mois.");
      L.push("");
      tableau(L, ["Mois", "Période", "Salarié", "Emploi", "Lettre expédiée le", "Motif"],
        [["M-3", "[du ... au ...]", "[nom ou matricule]", "[  ]", "[  ]", "[économique]"],
         ["", "", "[nom ou matricule]", "[  ]", "[  ]", "[économique]"],
         ["M-2", "[du ... au ...]", "[nom ou matricule]", "[  ]", "[  ]", "[économique]"],
         ["", "", "[nom ou matricule]", "[  ]", "[  ]", "[économique]"],
         ["M-1", "[du ... au ...]", "[nom ou matricule]", "[  ]", "[  ]", "[économique]"],
         ["", "", "[nom ou matricule]", "[  ]", "[  ]", "[économique]"]]);
      L.push("");
      L.push("  Sous-total M-3 ..... [  ]");
      L.push("  Sous-total M-2 ..... [  ]");
      L.push("  Sous-total M-1 ..... [  ]");
      L.push("  TOTAL SUR LES TROIS MOIS CONSÉCUTIFS ..... " +
        (trois === null ? "[  ]" : String(trois)) +
        (trois === null ? "  (non renseigné dans la fiche)" : "  (selon la fiche)"));
      L.push("");
      L.push("  [Ne comptez que les licenciements ÉCONOMIQUES. Un licenciement pour motif");
      L.push("  personnel, une rupture conventionnelle, une démission, une fin de contrat à");
      L.push("  durée déterminée ne sont pas des licenciements économiques et ne comptent");
      L.push("  pas ici. Indiquez le motif de chaque rupture : c'est ce qui permettra de");
      L.push("  justifier une exclusion.]");
      L.push("");
      L.push("VÉRIFICATION DE LA QUATRIÈME CONDITION — aucune période de trente jours ne");
      L.push("doit avoir compté dix licenciements :");
      L.push("");
      tableau(L, ["Fenêtre de trente jours examinée", "Licenciements", "Atteint dix ?"],
        [["[du ... au ...]", "[  ]", "☐ oui ☐ non"],
         ["[du ... au ...]", "[  ]", "☐ oui ☐ non"],
         ["[du ... au ...]", "[  ]", "☐ oui ☐ non"]]);
      L.push("");
      L.push("  [Faites glisser la fenêtre sur toutes les dates du relevé. Si l'une des");
      L.push("  fenêtres atteint dix, ce n'est plus L. 1233-26 qui s'applique mais");
      L.push("  L. 1233-28 — et la procédure aurait dû être collective dès ce moment-là.");
      L.push("  Voyez alors le document du contrôle CTL-SEU-01.]");
      L.push("");

      titre(L, "IV. Le constat");

      tableau(L, ["Condition", "Vérifiée ?", "Élément"], [
        ["Effectif habituel d'au moins cinquante salariés",
          eff === null ? "[  ]" : (eff >= 50 ? "oui" : "NON"),
          eff === null ? "[effectif à renseigner]" : eff + " salariés"],
        ["Licenciements sur trois mois consécutifs", "[  ]", "[dates du relevé]"],
        ["Total de PLUS de dix salariés",
          trois === null ? "[  ]" : (trois > 10 ? "oui" : "non"),
          trois === null ? "[à renseigner]" : trois + " licenciements"],
        ["Aucune fenêtre de trente jours à dix", "[  ]", "[tableau du III]"],
      ]);
      L.push("");
      if (trois === null) {
        L.push("Le total des trois mois consécutifs n'est pas renseigné : la règle");
        L.push("anti-fractionnement ne peut pas être vérifiée. Remplissez le relevé du III,");
        L.push("reportez le total dans la fiche, et relancez l'audit.");
      } else if (declenche) {
        L.push("LES QUATRE CONDITIONS SONT RÉUNIES, selon les données de la fiche. Tout");
        L.push("nouveau licenciement économique envisagé au cours des trois mois suivants");
        L.push("est soumis aux dispositions du chapitre — c'est-à-dire au régime du");
        L.push("licenciement collectif pour motif économique.");
      } else if (eff !== null && eff >= 50) {
        L.push("Les conditions ne sont pas toutes réunies selon les données de la fiche : " +
          trois + " licenciement(s) sur les trois mois précédents. La règle");
        L.push("anti-fractionnement de l'article L. 1233-26 ne trouve pas à s'appliquer en");
        L.push("l'état. Refaites le constat à chaque nouveau licenciement : le total des");
        L.push("trois mois glisse, lui aussi.");
      } else {
        L.push("La condition d'effectif n'est pas remplie : le constat s'arrête là. Il se");
        L.push("refait si l'effectif atteint cinquante salariés.");
      }
      L.push("");

      titre(L, "V. La note fixant le régime du nouveau projet");

      L.push("« NOTE SUR L'APPLICATION DE L'ARTICLE L. 1233-26");
      L.push("");
      L.push(nom(ctx) + ", employant [  ] salariés.");
      L.push("");
      L.push("Au cours des trois mois consécutifs du [DATE] au [DATE], [nombre]");
      L.push("licenciements pour motif économique ont été prononcés, selon le relevé");
      L.push("annexé. Aucune période de trente jours n'en a compté dix.");
      L.push("");
      L.push("[Le total dépassant dix, tout nouveau licenciement économique envisagé au");
      L.push("cours des trois mois suivants, soit jusqu'au [DATE], est soumis aux");
      L.push("dispositions du chapitre III du titre III du livre II de la première partie");
      L.push("du code du travail, par application de l'article L. 1233-26. Le présent");
      L.push("projet est en conséquence conduit selon ce régime.]");
      L.push("");
      L.push("[ou : Le total n'excédant pas dix, l'article L. 1233-26 ne trouve pas à");
      L.push("s'appliquer. Le régime du présent projet est celui qui résulte du décompte de");
      L.push("la fenêtre de trente jours, arrêté par note distincte.]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE] — " + signataire(ctx) + " »");
      L.push("");
      L.push("Ce que le régime collectif ajoute est énuméré au document du contrôle");
      L.push("CTL-SEU-01, partie V : notification du projet à l'autorité administrative");
      L.push("(L. 1233-46), consultation du comité selon L. 1233-29 ou L. 1233-30,");
      L.push("communication simultanée à l'administration (L. 1233-48), et plan de");
      L.push("sauvegarde de l'emploi si le projet concerne au moins dix salariés dans une");
      L.push("même période de trente jours et que l'entreprise atteint cinquante salariés");
      L.push("(L. 1233-61).");
      L.push("");
      L.push("  [Attention à ne pas confondre les deux seuils. L. 1233-26 soumet le nouveau");
      L.push("  projet AUX DISPOSITIONS DU CHAPITRE ; il ne transforme pas un licenciement");
      L.push("  isolé en projet de dix salariés. Le plan de sauvegarde de l'emploi, lui,");
      L.push("  reste commandé par le seuil propre de L. 1233-61 : « au moins dix salariés");
      L.push("  dans une même période de trente jours ». Faites trancher ce point par votre");
      L.push("  conseil : l'application dit ce que les textes disent, elle ne comble pas");
      L.push("  leur articulation.]");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez le relevé des trois mois");
      L.push("précédents. Les pièces existent : ce sont les lettres déjà expédiées.");
      L.push("");
      L.push("Les trois mois précédents à examiner courent, en repère de date, du " +
        leJour(dans(d0, -92)) + " au " + leJour(d0) + ".");
      L.push("Ajustez ces bornes sur vos mois réels : le texte dit « trois mois");
      L.push("consécutifs », non « quatre-vingt-douze jours ».");
      L.push("");
      if (declenche) {
        L.push("La règle étant déclenchée, elle produit effet pendant les trois mois");
        L.push("suivants, soit en repère jusqu'au " + leJour(dans(d0, 92)) + ".");
        L.push("Tout licenciement économique envisagé d'ici là relève du régime collectif.");
        L.push("");
        L.push("Comptez donc, pour ce projet, le calendrier d'une procédure collective :");
        L.push("convocation, deux réunions, avis, notification du projet à l'administration,");
        L.push("et le cas échéant demande de validation ou d'homologation. Une notification");
        L.push("avant le " + leJour(dans(d0, 60)) + " serait, en pratique, difficile à tenir.");
        L.push("");
      } else {
        L.push("Refaites ce relevé avant CHAQUE nouveau licenciement économique. Le total");
        L.push("des trois mois glisse : un licenciement prononcé aujourd'hui entre dans le");
        L.push("relevé de demain, et en fait sortir un autre.");
        L.push("");
        L.push("Prochaine vérification conseillée : le " + leJour(dans(d0, 30)) + ", ou le");
        L.push("jour où un nouveau licenciement économique est envisagé.");
        L.push("");
      }
      L.push("Conservez le relevé signé et daté. C'est lui qui justifie le régime retenu —");
      L.push("et, s'il fait apparaître que la règle n'est pas déclenchée, il justifie aussi");
      L.push("de ne pas l'avoir appliquée.");

      pied(L, ["L. 1233-26", "L. 1233-28", "L. 1233-29", "L. 1233-30", "L. 1233-46",
        "L. 1233-48", "L. 1233-61"],
        "Ce qui se joue : conduire la nouvelle procédure au régime allégé alors que la\n" +
        "règle anti-fractionnement est déclenchée la rend irrégulière. Si un plan de\n" +
        "sauvegarde de l'emploi était par ailleurs dû et n'a pas été établi, « le\n" +
        "licenciement intervenu en l'absence de toute décision relative à la\n" +
        "validation ou à l'homologation […] est nul » (L. 1235-10).");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA QUALITÉ DES DONNÉES
     ══════════════════════════════════════════════════════════════════════ */

  /* Ce que chaque champ doit être — repris à l'identique de
     moteur/economique/valider.js, qui est le seul juge de la lisibilité d'une
     donnée. Le fichier n'est pas exposé au navigateur : le document en reprend
     la table plutôt que d'en inventer une seconde. */
  var ATTENDU = [
    ["dateAudit", "date AAAA-MM-JJ", "date"],
    ["dateEntretien", "date AAAA-MM-JJ", "date"],
    ["dateNotification", "date AAAA-MM-JJ", "date"],
    ["dateInfoCSE", "date AAAA-MM-JJ", "date"],
    ["dateAvisCSE", "date AAAA-MM-JJ, ou « avis non rendu »", "date"],
    ["dateNotifAdmin", "date AAAA-MM-JJ", "date"],
    ["effectif", "entier positif", "nombre"],
    ["effectifEtablissement", "entier positif", "nombre"],
    ["effectifGroupe", "entier positif", "nombre"],
    ["nbLicenciements", "entier positif", "nombre"],
    ["licenciementsRecents30j", "entier positif", "nombre"],
    ["refusModification", "entier positif", "nombre"],
    ["licenciements3moisGlissants", "entier positif", "nombre"],
    ["etablissementsDistincts", "entier positif", "nombre"],
    ["idcc", "quatre chiffres", "code"],
    ["siren", "neuf chiffres", "code"],
    ["cause", "1, 2, 3 ou 4", "code"],
  ];

  /* Les mêmes vérifications que valider.js, sur la fiche que le document reçoit.
     Deux natures d'anomalie, et la distinction commande ce qui en découle :
     « lisibilité », la valeur ne peut pas exister ; « cohérence », deux valeurs
     parfaitement lisibles se contredisent. */
  function anomalies(f) {
    f = f || {};
    var A = [];
    var dit = function (champ, valeur, motif, nature) {
      A.push({ champ: champ, valeur: valeur, motif: motif, nature: nature || "lisibilité" });
    };
    var a = function (champ) {
      return Object.prototype.hasOwnProperty.call(f, champ) && f[champ] !== null && f[champ] !== "";
    };
    var estDateISO = function (s) {
      if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
      var p = s.split("-").map(Number);
      if (p[1] < 1 || p[1] > 12) return false;
      var dernier = new Date(Date.UTC(p[0], p[1], 0)).getUTCDate();
      return p[2] >= 1 && p[2] <= dernier;
    };
    var entier = function (x) {
      return typeof x === "number" && isFinite(x) && Math.floor(x) === x && x >= 0;
    };
    ["dateAudit", "dateEntretien", "dateNotification", "dateInfoCSE", "dateNotifAdmin"]
      .forEach(function (ch) {
        if (a(ch) && !estDateISO(f[ch]))
          dit(ch, f[ch], "date inexistante ou format non reconnu — attendu AAAA-MM-JJ");
      });
    if (a("dateAvisCSE") && !estDateISO(f.dateAvisCSE) && !/non rendu/i.test(String(f.dateAvisCSE)))
      dit("dateAvisCSE", f.dateAvisCSE, "ni date valide, ni mention « avis non rendu »");
    ["effectif", "effectifEtablissement", "effectifGroupe", "nbLicenciements",
     "licenciementsRecents30j", "refusModification", "licenciements3moisGlissants",
     "etablissementsDistincts"].forEach(function (ch) {
      if (a(ch) && !entier(f[ch]))
        dit(ch, f[ch], typeof f[ch] === "number"
          ? (f[ch] < 0 ? "valeur négative"
            : "valeur décimale, alors qu'il s'agit d'un dénombrement")
          : "valeur non numérique");
    });
    if (a("idcc") && !/^\d{4}$/.test(String(f.idcc)))
      dit("idcc", f.idcc, "un identifiant de convention collective compte quatre chiffres");
    if (a("siren") && !/^\d{9}$/.test(String(f.siren).replace(/\s/g, "")))
      dit("siren", f.siren, "un SIREN compte neuf chiffres");
    if (a("cause") && ["1", "2", "3", "4"].indexOf(String(f.cause)) < 0)
      dit("cause", f.cause, "la cause est l'un des quatre cas de l'article L. 1233-3");
    if (estDateISO(f.dateEntretien) && estDateISO(f.dateNotification) &&
        f.dateNotification < f.dateEntretien)
      dit("dateNotification", f.dateNotification,
        "antérieure à l'entretien préalable du " + f.dateEntretien, "cohérence");
    if (Array.isArray(f.datesReunionsCSE)) {
      var mauvaises = f.datesReunionsCSE.filter(function (d) { return !estDateISO(d); });
      if (mauvaises.length)
        dit("datesReunionsCSE", mauvaises.join(", "), "date(s) inexistante(s) ou mal formée(s)");
    }
    if (entier(f.effectif) && entier(f.effectifEtablissement) && f.effectifEtablissement > f.effectif)
      dit("effectifEtablissement", f.effectifEtablissement,
        "supérieur à l'effectif de l'entreprise (" + f.effectif + ")", "cohérence");
    if (entier(f.effectif) && entier(f.effectifGroupe) && f.effectifGroupe < f.effectif)
      dit("effectifGroupe", f.effectifGroupe,
        "inférieur à l'effectif de l'entreprise (" + f.effectif +
        "), alors que celle-ci en fait partie", "cohérence");
    if (entier(f.nbLicenciements) && entier(f.effectif) && f.nbLicenciements > f.effectif)
      dit("nbLicenciements", f.nbLicenciements,
        "supérieur à l'effectif de l'entreprise (" + f.effectif + ")", "cohérence");
    return A;
  }

  doc("CTL-VAL-01",
    "La fiche de correction des données signalées",
    "La table de ce que chaque champ doit être, le relevé des données que l'audit " +
    "a signalées comme impossibles ou incohérentes, la fiche de correction " +
    "champ par champ avec la pièce d'origine, et la marche à suivre pour relancer " +
    "l'audit.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var an = anomalies(f);
      var lisib = an.filter(function (x) { return x.nature === "lisibilité"; });
      var coher = an.filter(function (x) { return x.nature === "cohérence"; });
      var d0 = aujourd(ctx);

      L = L.concat(entete(ctx, "Fiche de correction des données de l'audit",
        "contrôle sans fondement textuel propre — voyez la partie I"));

      modeEmploi(L, [
        "Ce document est le premier à remplir et le seul à remplir en premier. Tant",
        "qu'une donnée impossible subsiste, les verdicts qui l'utilisent ne valent",
        "rien : ils peuvent conclure à la conformité comme à la non-conformité sur une",
        "valeur qui ne peut pas exister. Décider sur un tel rapport, c'est décider",
        "sans savoir.",
        "",
        "Les corrections se font À PARTIR DE LA PIÈCE D'ORIGINE, jamais de mémoire.",
        "C'est la seule consigne de fond de ce document, et c'est celle qu'on",
        "contourne le plus volontiers : une date qu'on croit se rappeler se saisit en",
        "trois secondes, et se conteste pendant des mois.",
        "",
        "Puis vous relancez l'audit, et vous ne lisez les verdicts qu'ensuite.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Ce que ce contrôle fait");

      L.push("CTL-VAL-01 n'a aucun article au champ « fondement », et ce document n'en");
      L.push("invente pas. Il ne juge rien du droit : il dit seulement si la donnée est");
      L.push("LISIBLE, et si deux données lisibles se contredisent.");
      L.push("");
      L.push("La distinction commande ce qui en découle :");
      L.push("");
      L.push("  LISIBILITÉ — la valeur ne peut pas exister : le 30 février, un effectif");
      L.push("  négatif, neuf licenciements et demi. Aucun contrôle ne peut rien conclure");
      L.push("  de ce qu'il a lu là, et le moteur le lui interdit.");
      L.push("");
      L.push("  COHÉRENCE — deux valeurs parfaitement lisibles se contredisent : un");
      L.push("  effectif d'établissement supérieur à celui de l'entreprise, une");
      L.push("  notification antérieure à l'entretien préalable. Ce n'est pas un obstacle à");
      L.push("  l'examen, c'est son objet : les contrôles doivent au contraire pouvoir le");
      L.push("  constater.");
      L.push("");
      L.push("Une donnée impossible n'est pas un détail de saisie. Elle se propage : le");
      L.push("nombre de licenciements commande le régime, le régime commande le nombre de");
      L.push("réunions, le délai d'avis, la saisine de l'administration et le plan de");
      L.push("sauvegarde de l'emploi. Une erreur d'un chiffre à l'entrée peut faire");
      L.push("basculer tout un rapport.");
      L.push("");

      titre(L, "II. Ce que l'audit signale sur cette fiche");

      if (!an.length) {
        L.push("Aucune anomalie n'est relevée sur les données présentes dans cette fiche :");
        L.push("les dates sont des dates, les dénombrements sont des entiers positifs, et");
        L.push("les valeurs ne se contredisent pas entre elles.");
        L.push("");
        L.push("Cela ne dit rien de leur EXACTITUDE. « 84 salariés » est lisible et cohérent");
        L.push("même si l'entreprise en compte 148. Servez-vous du tableau du IV pour");
        L.push("rapprocher chaque valeur de la pièce qui la porte : c'est le seul contrôle");
        L.push("qui vaille, et l'application ne peut pas le faire à votre place.");
        L.push("");
      } else {
        if (lisib.length) {
          L.push("DONNÉES ILLISIBLES — " + lisib.length + " :");
          L.push("");
          tableau(L, ["Champ", "Valeur saisie", "Pourquoi elle est impossible"],
            lisib.map(function (x) {
              return [x.champ, "« " + String(x.valeur) + " »", x.motif];
            }));
          L.push("");
          L.push("  Tant qu'elles subsistent, les verdicts qui les utilisent ne valent rien.");
          L.push("");
        }
        if (coher.length) {
          L.push("DONNÉES INCOHÉRENTES ENTRE ELLES — " + coher.length + " :");
          L.push("");
          tableau(L, ["Champ", "Valeur saisie", "Contradiction relevée"],
            coher.map(function (x) {
              return [x.champ, "« " + String(x.valeur) + " »", x.motif];
            }));
          L.push("");
          L.push("  Celles-ci sont lisibles. Deux issues seulement : l'une des deux valeurs");
          L.push("  est fausse et se corrige, ou les deux sont exactes et c'est le dossier");
          L.push("  lui-même qui porte la contradiction — auquel cas elle ne se corrige pas");
          L.push("  dans la fiche, elle se traite dans le dossier.");
          L.push("");
        }
      }

      titre(L, "III. Ce que chaque champ doit être");

      L.push("La table de référence. Un champ absent n'est pas invalide : il est manquant,");
      L.push("et les contrôles le disent déjà par ailleurs.");
      L.push("");
      tableau(L, ["Champ", "Attendu", "Nature"],
        ATTENDU.map(function (x) { return [x[0], x[1], x[2]]; }));
      L.push("");
      L.push("Et les quatre cohérences vérifiées entre champs :");
      L.push("");
      L.push("  — la notification ne peut pas être antérieure à l'entretien préalable ;");
      L.push("  — l'effectif de l'établissement ne peut pas dépasser celui de l'entreprise ;");
      L.push("  — l'effectif du groupe ne peut pas être inférieur à celui de l'entreprise,");
      L.push("    puisque celle-ci en fait partie ;");
      L.push("  — le nombre de licenciements ne peut pas dépasser l'effectif.");
      L.push("");
      L.push("  [Les dates des réunions du comité sont vérifiées une à une : une seule date");
      L.push("  mal formée dans la liste suffit à la signaler.]");
      L.push("");

      titre(L, "IV. La fiche de correction");

      L.push("Une ligne par donnée corrigée. La colonne « pièce d'origine » n'est pas");
      L.push("facultative : c'est elle qui distingue une correction d'une seconde");
      L.push("approximation.");
      L.push("");
      tableau(L, ["Champ", "Valeur saisie", "Valeur retenue", "Pièce d'origine",
        "Date de la pièce", "Corrigé par", "Le"],
        an.length ? an.map(function (x) {
          return [x.champ, "« " + String(x.valeur) + " »", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"];
        }) : [["[champ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("OÙ SE LIT CHAQUE DONNÉE :");
      L.push("");
      tableau(L, ["Donnée", "Pièce qui la porte"], [
        ["Effectif de l'entreprise", "registre unique du personnel, déclaration sociale nominative"],
        ["Effectif de l'établissement", "registre du personnel de l'établissement"],
        ["Effectif du groupe", "comptes consolidés, ou état fourni par la société mère"],
        ["Nombre de licenciements envisagés", "note de projet, tableau des suppressions de postes"],
        ["Licenciements déjà prononcés", "lettres expédiées et leurs preuves d'envoi"],
        ["Refus de modification", "propositions adressées et réponses des salariés"],
        ["Date de convocation du comité", "convocation et sa décharge"],
        ["Dates des réunions", "procès-verbaux des réunions"],
        ["Date de l'avis", "procès-verbal portant l'avis"],
        ["Date d'entretien préalable", "convocation à l'entretien"],
        ["Date de notification", "date d'expédition des lettres, non de leur signature"],
        ["Date de notification à l'administration", "accusé de réception de la voie dématérialisée"],
        ["IDCC", "bulletin de paie, ou intitulé exact de la convention appliquée"],
        ["SIREN", "extrait Kbis"],
        ["Cause invoquée", "note de projet — l'un des quatre cas de L. 1233-3"],
      ]);
      L.push("");

      titre(L, "V. Après la correction");

      L.push("  1. Reportez chaque valeur retenue dans la fiche d'audit.");
      L.push("  2. RELANCEZ L'AUDIT. Un rapport établi sur des données corrigées n'est pas");
      L.push("     l'ancien rapport annoté : c'est un autre rapport, et il peut conclure");
      L.push("     autrement.");
      L.push("  3. Ne lisez les verdicts qu'ensuite, et jetez l'ancien tirage. Deux");
      L.push("     rapports contradictoires dans un même dossier se retournent contre");
      L.push("     celui qui les y a laissés.");
      L.push("  4. Conservez cette fiche de correction : elle établit que les données ont");
      L.push("     été vérifiées à la source, et quand.");
      L.push("");
      L.push("  Fiche arrêtée le [DATE] par [nom et qualité]. Audit relancé le [DATE].");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous corrigez. Quelques heures suffisent :");
      L.push("ce sont des saisies à reprendre, non des pièces à construire.");
      L.push("");
      L.push("Aujourd'hui encore — vous relancez l'audit. Il n'y a aucune raison");
      L.push("d'attendre, et une seule de ne pas attendre : tout le reste du travail");
      L.push("dépend de ce que le rapport dira.");
      L.push("");
      L.push("Au plus tard le " + leJour(dans(d0, 2)) + " — les verdicts sont relus sur les");
      L.push("données corrigées, et les documents des autres contrôles sont régénérés à");
      L.push("partir de la fiche corrigée. Un document produit avant la correction porte");
      L.push("les anciennes valeurs : il est à refaire, pas à modifier à la main.");
      L.push("");
      L.push("Refaites cette vérification chaque fois qu'une donnée change — un");
      L.push("licenciement ajouté, une notification différée, une réunion déplacée. Les");
      L.push("données de ce dossier bougent jusqu'au dernier jour.");

      pied(L, ["L. 1233-3"],
        "Ce contrôle n'a aucun article au champ « fondement ». La table du III et les\n" +
        "quatre cohérences du même titre sont reprises de\n" +
        "moteur/economique/valider.js, qui est le seul juge de la lisibilité d'une\n" +
        "donnée dans ce module — le document n'en invente pas une seconde.\n" +
        "\n" +
        "Ce qui se joue : rien de juridique, et c'est bien le problème. Une donnée\n" +
        "impossible ne se sanctionne pas ; elle fausse tout ce qui en dépend, sans que\n" +
        "rien ne le signale ailleurs que dans ce contrôle.");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA PROCÉDURE COLLECTIVE
     ══════════════════════════════════════════════════════════════════════ */

  var PROC = {
    sauvegarde: "sauvegarde", redressement: "redressement judiciaire",
    liquidation: "liquidation judiciaire",
  };

  doc("CTL-PCO-01",
    "La fiche d'identification du régime de la procédure collective",
    "Les trois données que l'article L. 1233-58 rend indispensables — nature de " +
    "la procédure, date du jugement, qualité de l'auteur du plan —, le tableau " +
    "des renvois que ce texte opère selon le seuil et l'effectif, et le bordereau " +
    "des pièces qui les établissent.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var d0 = aujourd(ctx), eff = effectifDe(ctx), n = nbLic(f);
      var enPC = f.procedureCollective === true;
      var type = txt(f.typeProcedure), dJug = f.dateJugement, qual = txt(f.qualiteAuteur);
      var manque = [];
      if (!type) manque.push("la nature de la procédure — sauvegarde, redressement ou liquidation");
      if (!estDate(dJug)) manque.push("la date du jugement d'ouverture ou de liquidation");
      if (!qual) manque.push("la qualité de celui qui met en œuvre le plan de licenciement");

      L = L.concat(entete(ctx, "Identification du régime de la procédure collective",
        "article L. 1233-58 du code du travail"));

      modeEmploi(L, [
        "Trois données, et rien d'autre. Mais tant qu'elles manquent, le régime de",
        "l'article L. 1233-58 ne peut pas être appliqué — et ce régime n'est pas un",
        "aménagement de détail : il désigne qui met en œuvre le plan, il renvoie à des",
        "articles de consultation différents selon le nombre de licenciements et",
        "l'effectif, il raccourcit les délais de décision de l'administration, et il",
        "change la sanction encourue.",
        "",
        "Ces trois données se lisent sur le jugement et sur l'acte de désignation.",
        "Elles se saisissent en dix minutes. C'est le meilleur rapport entre le temps",
        "passé et ce qu'il débloque dans tout le reste du dossier.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Les trois données");

      tableau(L, ["Donnée", "Ce que la fiche porte", "Où elle se lit"], [
        ["Procédure collective ouverte ?",
          f.procedureCollective === true ? "oui" : f.procedureCollective === false ? "non" : "[non renseigné]",
          "jugement du tribunal"],
        ["Nature de la procédure", type ? (PROC[type] || type) : "[non renseignée]",
          "dispositif du jugement"],
        ["Date du jugement", estDate(dJug) ? jour(dJug) : "[non renseignée]",
          "en-tête du jugement"],
        ["Qui met en œuvre le plan", qual || "[non renseignée]",
          "jugement, acte de désignation"],
      ]);
      L.push("");
      if (!enPC) {
        L.push("La fiche ne déclare AUCUNE procédure collective. Ce document n'a alors pas");
        L.push("d'objet — sauf si la situation a changé depuis l'audit, auquel cas");
        L.push("renseignez les trois données ci-dessus et relancez l'audit avant tout acte");
        L.push("suivant : l'ouverture d'une procédure collective déplace le régime entier.");
        L.push("");
      } else if (manque.length) {
        L.push("PROCÉDURE COLLECTIVE DÉCLARÉE, MAIS " + manque.length + " DONNÉE(S)");
        L.push("MANQUANTE(S) :");
        L.push("");
        manque.forEach(function (m) { L.push("  — " + m); });
        L.push("");
        L.push("Le régime de l'article L. 1233-58 ne peut pas être appliqué en l'état.");
        L.push("");
      } else {
        L.push((PROC[type] || type) + " ouverte le " + jour(dJug) + ", plan de licenciement");
        L.push("mis en œuvre par " + qual + ". Les trois données sont renseignées : le régime");
        L.push("de l'article L. 1233-58 peut être appliqué.");
        L.push("");
      }

      titre(L, "II. Ce que L. 1233-58 commande, renvoi par renvoi");

      L.push("L. 1233-58, I : « En cas de redressement ou de liquidation judiciaire,");
      L.push("l'employeur, l'administrateur ou le liquidateur, selon le cas, qui envisage");
      L.push("des licenciements économiques, met en œuvre un plan de licenciement dans les");
      L.push("conditions prévues aux articles L. 1233-24-1 à L. 1233-24-4. L'employeur,");
      L.push("l'administrateur ou le liquidateur, selon le cas, réunit et consulte le");
      L.push("comité social et économique dans les conditions prévues à l'article");
      L.push("L. 2323-31 ainsi qu'aux articles : […] »");
      L.push("");
      L.push("Les sept renvois, tels que le texte les écrit :");
      L.push("");
      tableau(L, ["Renvoi", "Articles", "Cas visé"], [
        ["1°", "L. 1233-8", "licenciement collectif de moins de dix salariés"],
        ["2°", "L. 1233-29, premier alinéa",
          "au moins dix salariés, entreprise de moins de cinquante"],
        ["3°", "L. 1233-30, I sauf dernier alinéa, et dernier alinéa du II",
          "au moins dix salariés, entreprise d'au moins cinquante"],
        ["4°", "L. 1233-34 et L. 1233-35 premier alinéa", "recours à l'expert"],
        ["5°", "L. 1233-31 à L. 1233-33, L. 1233-48 et L. 1233-63",
          "renseignements et mesures sociales"],
        ["6°", "L. 1233-49, L. 1233-61 et L. 1233-62", "plan de sauvegarde de l'emploi"],
        ["7°", "L. 1233-57-5 et L. 1233-57-6",
          "au moins dix salariés, entreprise d'au moins cinquante"],
      ]);
      L.push("");
      L.push("  Effectif de l'entreprise ......... " +
        (eff === null ? "[non renseigné]" : eff + " salariés"));
      L.push("  Licenciements sur trente jours ... " +
        (n === null ? "[non renseigné]" : String(n)));
      L.push("  Renvoi applicable ............... " +
        (eff === null || n === null ? "[à déterminer une fois ces deux données renseignées]"
          : n < 10 ? "1° — L. 1233-8"
          : eff < 50 ? "2° — L. 1233-29, premier alinéa"
          : "3° — L. 1233-30, I et dernier alinéa du II, et 7°"));
      L.push("");
      L.push("Le texte cite aussi les articles L. 2325-35, L. 4614-12-1 et L. 2323-31, qui");
      L.push("ne sont pas au corpus du module : ils sont nommés, non reproduits.");
      L.push("");
      L.push("ET LE PLAN RESTE DÛ. Le 6° renvoie expressément aux articles L. 1233-61 et");
      L.push("L. 1233-62 : l'ouverture d'une procédure collective ne dispense pas du plan");
      L.push("de sauvegarde de l'emploi lorsque ses conditions sont réunies.");
      L.push("");

      titre(L, "III. Les délais, tels que le II de l'article les raccourcit");

      L.push("L. 1233-58, II : « Pour un licenciement d'au moins dix salariés dans une");
      L.push("entreprise d'au moins cinquante salariés, l'accord mentionné à l'article");
      L.push("L. 1233-24-1 est validé et le document mentionné à l'article L. 1233-24-4,");
      L.push("élaboré par l'employeur, l'administrateur ou le liquidateur, est homologué");
      L.push("dans les conditions fixées aux articles L. 1233-57-1 à L. 1233-57-3, aux");
      L.push("deuxième et troisième alinéas de l'article L. 1233-57-4 et à l'article");
      L.push("L. 1233-57-7. »");
      L.push("");
      L.push("Puis : « Les délais prévus au premier alinéa de l'article L. 1233-57-4 sont");
      L.push("ramenés, à compter de la dernière réunion du comité social et économique, à");
      L.push("HUIT JOURS en cas de redressement judiciaire et à QUATRE JOURS en cas de");
      L.push("liquidation judiciaire. »");
      L.push("");
      var dr2 = derniereReunion(f);
      tableau(L, ["Procédure", "Délai de décision", "Point de départ"], [
        ["Redressement judiciaire", "8 jours", "dernière réunion du comité"],
        ["Liquidation judiciaire", "4 jours", "dernière réunion du comité"],
        ["Plan de sauvegarde arrêté (L. 1233-58, III)", "8 jours",
          "réception de la demande, postérieure au jugement arrêtant le plan"],
      ]);
      L.push("");
      if (dr2 && type) {
        var dl = type === "liquidation" ? 4 : type === "redressement" ? 8 : null;
        if (dl) {
          L.push("Votre dernière réunion portée par la fiche est celle du " + jour(dr2) + " :");
          L.push("le délai de " + dl + " jours expirerait le " + jourPlus(dr2, dl) + ".");
          L.push("");
        }
      }
      L.push("Et la demande se dépose vite : D. 1233-14 dispose qu'« en cas de procédure de");
      L.push("sauvegarde, de redressement ou de liquidation judiciaire, la demande est");
      L.push("envoyée par voie dématérialisée AU PLUS TARD LE LENDEMAIN de la dernière");
      L.push("réunion du comité social et économique mentionnée aux II et III de l'article");
      L.push("L. 1233-58 ».");
      if (dr2) {
        L.push("");
        L.push("Soit, pour une dernière réunion du " + jour(dr2) + ", un dépôt au plus tard le");
        L.push(jourPlus(dr2, 1) + ".");
      }
      L.push("");
      L.push("Ce que le même II ajoute sur la rupture : « L'employeur, l'administrateur ou");
      L.push("le liquidateur ne peut procéder, SOUS PEINE D'IRRÉGULARITÉ, à la rupture des");
      L.push("contrats de travail avant la notification de la décision favorable de");
      L.push("validation ou d'homologation, ou l'expiration des délais mentionnés au");
      L.push("quatrième alinéa du présent II. »");
      L.push("");
      L.push("Et en cas de décision défavorable : « l'employeur, l'administrateur ou le");
      L.push("liquidateur consulte le comité social et économique dans un délai de trois");
      L.push("jours. Selon le cas, le document modifié et l'avis du comité social et");
      L.push("économique ou un avenant à l'accord collectif sont transmis à l'autorité");
      L.push("administrative, qui se prononce dans un délai de trois jours. »");
      L.push("");
      L.push("Enfin, sur le calibrage du plan : « Par dérogation au 1° de l'article");
      L.push("L. 1233-57-3, sans préjudice de la recherche, selon le cas, par");
      L.push("l'administrateur, le liquidateur ou l'employeur, en cas de redressement ou de");
      L.push("liquidation judiciaire, des moyens du groupe auquel l'employeur appartient");
      L.push("pour l'établissement du plan de sauvegarde de l'emploi, l'autorité");
      L.push("administrative homologue le plan de sauvegarde de l'emploi après s'être");
      L.push("assurée du respect par celui-ci des articles L. 1233-61 à L. 1233-63 AU");
      L.push("REGARD DES MOYENS DONT DISPOSE L'ENTREPRISE. » Voyez le document du contrôle");
      L.push("CTL-PSE-02.");
      L.push("");
      L.push("Un dernier point, souvent utile : L. 1233-59 dispose que « les délais prévus");
      L.push("à l'article L. 1233-15 pour l'envoi des lettres de licenciement prononcé pour");
      L.push("un motif économique ne sont pas applicables en cas de redressement ou de");
      L.push("liquidation judiciaire ».");
      L.push("");

      titre(L, "IV. La fiche à remplir, et le bordereau des pièces");

      L.push("  Tribunal ......................... [  ]");
      L.push("  Nature de la procédure ........... ☐ sauvegarde  ☐ redressement judiciaire");
      L.push("                                     ☐ liquidation judiciaire");
      L.push("  Date du jugement ................. [  ]");
      L.push("  Maintien provisoire de l'activité autorisé ? ☐ oui, jusqu'au [  ]  ☐ non");
      L.push("  Administrateur judiciaire ........ [nom, date de désignation]");
      L.push("  Mandataire judiciaire ............ [nom, date de désignation]");
      L.push("  Liquidateur ...................... [nom, date de désignation]");
      L.push("  Juge-commissaire ................. [nom]");
      L.push("  Représentant des salariés ........ [nom, date de désignation]");
      L.push("");
      L.push("  QUI MET EN ŒUVRE LE PLAN DE LICENCIEMENT (L. 1233-58, I) :");
      L.push("  ☐ l'employeur  ☐ l'administrateur  ☐ le liquidateur");
      L.push("  Acte qui le désigne : [  ]");
      L.push("");
      L.push("  [Cette dernière case n'est pas une formalité. C'est elle qui dit qui signe");
      L.push("  la demande de validation ou d'homologation, qui convoque le comité, et qui");
      L.push("  expédie les lettres. Un acte signé par la mauvaise personne se conteste.]");
      L.push("");
      tableau(L, ["Pièce", "Ce qu'elle doit établir", "Date", "Jointe"], [
        ["Jugement d'ouverture ou de liquidation",
          "la nature de la procédure et sa date", "[  ]", "☐"],
        ["Acte de désignation de l'administrateur ou du liquidateur",
          "la qualité de l'auteur du plan", "[  ]", "☐"],
        ["Jugement arrêtant le plan de sauvegarde, le cas échéant",
          "le point de départ des délais du III de L. 1233-58", "[  ]", "☐"],
        ["Ordonnance du juge-commissaire",
          "l'autorisation des licenciements (CTL-PCO-02)", "[  ]", "☐"],
        ["Procès-verbal de carence, à défaut de comité",
          "l'absence de comité, au sens de L. 1233-49 et D. 1233-10", "[  ]", "☐"],
      ]);
      L.push("");
      L.push("  [Sur le procès-verbal de carence : L. 1233-49 dispose que « lorsque");
      L.push("  l'entreprise est dépourvue de comité social et économique et est soumise à");
      L.push("  l'obligation d'établir un plan de sauvegarde de l'emploi, ce plan ainsi que");
      L.push("  les informations destinées aux représentants du personnel mentionnées à");
      L.push("  l'article L. 1233-31 sont communiqués à l'autorité administrative en même");
      L.push("  temps que la notification du projet de licenciement. En outre, le plan est");
      L.push("  porté à la connaissance des salariés par tout moyen sur les lieux de");
      L.push("  travail. » Et D. 1233-10 impose de joindre le procès-verbal de carence à la");
      L.push("  notification du projet, par la voie dématérialisée.]");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous renseignez les trois données et vous");
      L.push("relancez l'audit. C'est immédiat : elles se lisent sur le jugement.");
      L.push("");
      if (estDate(dJug)) {
        L.push("Jugement du " + jour(dJug) + ", tel que la fiche le porte.");
        if (type === "liquidation") {
          L.push("En liquidation judiciaire, la fenêtre de garantie des créances de rupture");
          L.push("court à compter de ce jugement : quinze jours, ou vingt et un lorsqu'un");
          L.push("plan de sauvegarde de l'emploi est élaboré (L. 3253-8, 2° c). Soit jusqu'au");
          L.push(jourPlus(dJug, 15) + " ou au " + jourPlus(dJug, 21) + ". Voyez le document");
          L.push("du contrôle CTL-PCO-03, qui fait ce calcul.");
        }
        L.push("");
      }
      L.push("Puis, dans l'ordre : l'ordonnance du juge-commissaire et l'information de");
      L.push("l'autorité administrative (CTL-PCO-02), la consultation du comité selon le");
      L.push("renvoi applicable, la demande de validation ou d'homologation au plus tard le");
      L.push("lendemain de la dernière réunion (D. 1233-14), la décision dans les quatre ou");
      L.push("huit jours, puis seulement la notification.");
      L.push("");
      L.push("Ces délais sont courts, et c'est leur seul défaut : ils ne laissent aucune");
      L.push("marge à une donnée manquante. Renseignez-les maintenant.");

      pied(L, ["L. 1233-8", "L. 1233-15", "L. 1233-29", "L. 1233-30", "L. 1233-31",
        "L. 1233-49", "L. 1233-57-1", "L. 1233-57-3", "L. 1233-57-4", "L. 1233-58",
        "L. 1233-59", "L. 1233-61", "L. 1233-62", "D. 1233-10", "D. 1233-14"],
        "Les articles L. 2323-31, L. 2325-35, L. 4614-12-1, L. 1233-57-7 et L. 2324-8,\n" +
        "que L. 1233-58 cite, ne sont pas au corpus du module : ils sont nommés, non\n" +
        "reproduits. Il en va de même des articles du code de commerce auxquels le\n" +
        "III de ce texte renvoie.\n" +
        "\n" +
        "Ce qui se joue : « L'employeur, l'administrateur ou le liquidateur ne peut\n" +
        "procéder, sous peine d'irrégularité, à la rupture des contrats de travail\n" +
        "avant la notification de la décision favorable de validation ou\n" +
        "d'homologation » (L. 1233-58, II). Et « en cas de licenciements intervenus en\n" +
        "l'absence de toute décision relative à la validation ou à l'homologation ou\n" +
        "en cas d'annulation d'une décision ayant procédé à la validation ou à\n" +
        "l'homologation, le juge octroie au salarié une indemnité à la charge de\n" +
        "l'employeur qui ne peut être inférieure aux salaires des six derniers mois »\n" +
        "(même texte) ; les deux premiers alinéas de L. 1235-10 ne sont, eux, pas\n" +
        "applicables aux entreprises en redressement ou liquidation judiciaires.");
      return L.join("\n");
    });

  doc("CTL-PCO-02",
    "La requête au juge-commissaire et l'information de l'autorité administrative",
    "La requête caractérisant l'urgence et le caractère inévitable et " +
    "indispensable des licenciements, le relevé de l'ordonnance et du périmètre " +
    "qu'elle autorise, la lettre d'information à l'autorité administrative exigée " +
    "par l'article L. 1233-60, et l'ordre dans lequel ces actes se placent.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var d0 = aujourd(ctx);
      var type = txt(f.typeProcedure), qual = txt(f.qualiteAuteur);
      var ord = txt(f.ordonnanceJugeCommissaire);
      var dAdm = f.dateNotifAdmin, dNot = f.dateNotification, dJug = f.dateJugement;
      var rjOuLj = type === "redressement" || type === "liquidation";
      var manquePrealable = (rjOuLj && !ord) || !estDate(dAdm);

      L = L.concat(entete(ctx, "Autorisation du juge-commissaire et information de l'autorité administrative",
        "article L. 1233-60 du code du travail"));

      if (manquePrealable && estDate(dNot)) {
        var quoi2 = [];
        if (rjOuLj && !ord) {
          quoi2.push("Aucune ordonnance du juge-commissaire n'est déclarée, alors que la");
          quoi2.push("procédure est " + (PROC[type] || type) + ".");
          quoi2.push("");
          quoi2.push("En redressement comme en liquidation, les licenciements présentant un");
          quoi2.push("caractère urgent, inévitable et indispensable sont autorisés par");
          quoi2.push("ordonnance du juge-commissaire. Sans elle, la notification serait");
          quoi2.push("dépourvue de fondement.");
          quoi2.push("");
        }
        if (!estDate(dAdm)) {
          quoi2.push("Aucune information de l'autorité administrative n'est déclarée.");
          quoi2.push("");
          quoi2.push("L. 1233-60 : « En cas de redressement ou de liquidation judiciaire,");
          quoi2.push("l'employeur, l'administrateur ou le liquidateur, selon le cas, informe");
          quoi2.push("l'autorité administrative AVANT DE PROCÉDER à des licenciements pour");
          quoi2.push("motif économique, dans les conditions prévues aux articles L. 631-17,");
          quoi2.push("L. 631-19 (II), L. 641-4, dernier alinéa, L. 641-10, troisième alinéa,");
          quoi2.push("et L. 642-5 du code de commerce. »");
          quoi2.push("");
        }
        quoi2.push("Une notification est pourtant envisagée au " + jour(dNot) + ".");
        irrattrapable(L, quoi2,
          "Ces deux actes précèdent la notification ; ils ne se rattrapent pas après " +
          "elle. Suspendez tout envoi, accomplissez-les dans l'ordre du V, et redatez " +
          "la notification en conséquence.");
      }

      modeEmploi(L, [
        "Deux actes distincts, et ils ne se remplacent pas l'un l'autre.",
        "",
        "L'ORDONNANCE DU JUGE-COMMISSAIRE autorise les licenciements. Elle en fixe le",
        "périmètre : nombre, catégories, parfois nommément. Notifier au-delà de ce que",
        "l'ordonnance autorise revient à notifier sans autorisation.",
        "",
        "L'INFORMATION DE L'AUTORITÉ ADMINISTRATIVE est imposée par l'article",
        "L. 1233-60, « avant de procéder à des licenciements ». Elle est due même",
        "quand l'ordonnance a été obtenue, et l'ordonnance ne la dispense pas.",
        "",
        "L'application n'a pas lu à la source les articles du code de commerce",
        "auxquels L. 1233-60 renvoie — L. 631-17, L. 631-19 (II), L. 641-4 dernier",
        "alinéa, L. 641-10 troisième alinéa, L. 642-5. Ils sont NOMMÉS ici tels que le",
        "texte lu les nomme, jamais reproduits ni résumés : c'est là que se trouvent",
        "les conditions et la forme de la requête, et elles doivent être vérifiées à",
        "la source.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. L'état de votre dossier");

      tableau(L, ["Élément", "Ce que la fiche porte"], [
        ["Procédure collective", f.procedureCollective === true ? "oui" :
          f.procedureCollective === false ? "non" : "[non renseigné]"],
        ["Nature", type ? (PROC[type] || type) : "[non renseignée]"],
        ["Date du jugement", estDate(dJug) ? jour(dJug) : "[non renseignée]"],
        ["Qui met en œuvre le plan", qual || "[non renseignée]"],
        ["Ordonnance du juge-commissaire", ord ? "« " + ord + " »" : "[aucune déclarée]"],
        ["Autorité administrative informée le", estDate(dAdm) ? jour(dAdm) : "[non renseigné]"],
        ["Notification envisagée", estDate(dNot) ? jour(dNot) : "[non renseignée]"],
      ]);
      L.push("");
      if (f.procedureCollective !== true) {
        L.push("  La fiche ne déclare aucune procédure collective : ce document n'a pas");
        L.push("  d'objet en l'état. Il le retrouve si une procédure est ouverte — auquel");
        L.push("  cas renseignez la fiche et relancez l'audit avant tout acte suivant.");
        L.push("");
      }
      if (rjOuLj && !ord) {
        L.push("  L'ordonnance manque. En " + (PROC[type] || type) + ", elle est le");
        L.push("  fondement même de la notification.");
        L.push("");
      }
      if (!estDate(dAdm)) {
        L.push("  L'information de l'autorité administrative n'est pas déclarée. Elle est");
        L.push("  due AVANT de procéder aux licenciements (L. 1233-60), et l'accusé de");
        L.push("  réception en est la seule preuve.");
        L.push("");
      }

      titre(L, "II. La requête au juge-commissaire");

      L.push("Trois caractères à établir, et ils sont cumulatifs : URGENT, INÉVITABLE,");
      L.push("INDISPENSABLE. Une requête qui les affirme sans les caractériser n'établit");
      L.push("rien — et ce sont des faits, pas des qualifications : chacun se démontre par");
      L.push("des dates et des chiffres.");
      L.push("");
      L.push(cro((ctx.profil || {}).denomination || f.entreprise, "DÉNOMINATION SOCIALE"));
      L.push("[ou : cabinet de l'administrateur / du liquidateur, selon la qualité de");
      L.push("l'auteur du plan — voyez le document du contrôle CTL-PCO-01]");
      L.push("");
      L.push("À Monsieur le Juge-commissaire");
      L.push("Tribunal [de commerce / judiciaire] de [VILLE]");
      L.push("Procédure n° [  ] — " + (type ? (PROC[type] || type) : "[nature de la procédure]") +
        " ouverte le " + (estDate(dJug) ? jour(dJug) : "[DATE]"));
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : requête aux fins d'autorisation de procéder à des licenciements pour");
      L.push("motif économique");
      L.push("");
      L.push("Monsieur le Juge-commissaire,");
      L.push("");
      L.push("[Qualité du requérant : l'employeur / l'administrateur judiciaire / le");
      L.push("liquidateur, désigné par jugement du [DATE]] sollicite l'autorisation de");
      L.push("procéder au licenciement pour motif économique de [nombre] salariés.");
      L.push("");
      L.push("1. LA SITUATION");
      L.push("[Exposer l'état de l'entreprise à la date de la requête : activité");
      L.push("poursuivie ou non, effectif, trésorerie disponible, échéances, maintien");
      L.push("provisoire de l'activité et son terme. Chaque élément daté et chiffré.]");
      L.push("");
      L.push("2. L'URGENCE");
      L.push("[Dire à quelle échéance précise la décision doit être prise, et ce qui se");
      L.push("produit si elle ne l'est pas. « L'urgence est caractérisée » n'est pas une");
      L.push("démonstration ; « la trésorerie disponible au [DATE] est de [montant] et ne");
      L.push("couvre la masse salariale que jusqu'au [DATE] » en est une.]");
      L.push("");
      L.push("3. LE CARACTÈRE INÉVITABLE");
      L.push("[Dire ce qui a été tenté et n'a pas abouti : recherche de repreneur,");
      L.push("financement, réduction d'activité, mesures d'évitement. Joindre les pièces.]");
      L.push("");
      L.push("4. LE CARACTÈRE INDISPENSABLE");
      L.push("[Dire pourquoi CES licenciements-là, et pas d'autres : quels postes, quelles");
      L.push("catégories, et en quoi leur suppression est nécessaire à ce que la procédure");
      L.push("poursuit.]");
      L.push("");
      L.push("5. LE PÉRIMÈTRE DEMANDÉ");
      L.push("");
      tableau(L, ["Catégorie professionnelle", "Effectif", "Licenciements demandés"],
        [["[  ]", "[  ]", "[  ]"], ["[  ]", "[  ]", "[  ]"], ["TOTAL", "[  ]", "[  ]"]]);
      L.push("");
      L.push("6. L'ÉTAT DE LA PROCÉDURE DE CONSULTATION");
      L.push("[Indiquer où en est la consultation du comité social et économique, selon le");
      L.push("renvoi applicable de l'article L. 1233-58, I, et si un plan de sauvegarde de");
      L.push("l'emploi est en cours d'élaboration.]");
      L.push("");
      L.push("Par ces motifs, il est demandé au juge-commissaire d'autoriser les");
      L.push("licenciements pour motif économique ci-dessus décrits.");
      L.push("");
      L.push("Pièces jointes : [jugement · acte de désignation · situation de trésorerie ·");
      L.push("convocation et procès-verbaux du comité · projet de plan, le cas échéant ·");
      L.push("tableau des catégories et des suppressions]");
      L.push("");
      L.push("[Signature — qualité de l'auteur du plan]");
      L.push("");
      L.push("  [AVANT DE DÉPOSER — la forme, le contenu et le circuit de cette requête");
      L.push("  sont réglés par les articles du code de commerce que L. 1233-60 nomme, et");
      L.push("  que l'application n'a pas lus. Faites-les vérifier. Ce modèle organise le");
      L.push("  fond de la démonstration ; il ne garantit pas la forme.]");
      L.push("");

      titre(L, "III. Le relevé de l'ordonnance");

      L.push("À remplir dès réception, et à relire avant chaque envoi de lettre.");
      L.push("");
      L.push("  Date de l'ordonnance ............. [  ]");
      L.push("  Sens ............................. ☐ autorisation  ☐ refus  ☐ partielle");
      L.push("  Nombre de licenciements autorisés . [  ]");
      L.push("  Catégories autorisées ............ [  ]");
      L.push("  Salariés nommément visés, le cas échéant ..... [  ]");
      L.push("  Conditions ou réserves portées par l'ordonnance ..... [  ]");
      L.push("");
      tableau(L, ["Catégorie", "Demandé", "Autorisé", "Écart", "Notifié"],
        [["[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["TOTAL", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  La colonne « écart » est celle qu'on oublie. Une autorisation partielle est");
      L.push("  une autorisation : elle vaut pour ce qu'elle autorise, et pour rien de");
      L.push("  plus. Notifier au-delà du périmètre autorisé, c'est notifier sans");
      L.push("  autorisation pour les salariés en excédent.");
      L.push("");
      L.push("  [Si l'ordonnance vise des salariés nommément, la marge d'application des");
      L.push("  critères d'ordre s'en trouve réduite d'autant. Rapprochez-la du tableau");
      L.push("  d'application des critères avant d'expédier quoi que ce soit.]");
      L.push("");

      titre(L, "IV. La lettre d'information à l'autorité administrative");

      L.push("L. 1233-60 : « En cas de redressement ou de liquidation judiciaire,");
      L.push("l'employeur, l'administrateur ou le liquidateur, selon le cas, informe");
      L.push("l'autorité administrative avant de procéder à des licenciements pour motif");
      L.push("économique, dans les conditions prévues aux articles L. 631-17, L. 631-19");
      L.push("(II), L. 641-4, dernier alinéa, L. 641-10, troisième alinéa, et L. 642-5 du");
      L.push("code de commerce. »");
      L.push("");
      L.push("Ces cinq articles du code de commerce fixent les conditions de cette");
      L.push("information. L'application ne les a pas lus et ne les énonce pas : vérifiez-y");
      L.push("la forme et le moment exacts.");
      L.push("");
      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("[ou en-tête de l'administrateur ou du liquidateur, selon le cas]");
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[Direction régionale — adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : information préalable à des licenciements pour motif économique —");
      L.push("article L. 1233-60 du code du travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application de l'article L. 1233-60 du code du travail, je vous informe,");
      L.push("avant qu'il y soit procédé, des licenciements pour motif économique envisagés");
      L.push("au sein de " + nom(ctx) + ".");
      L.push("");
      L.push("  Nature de la procédure ....... " +
        (type ? (PROC[type] || type) : "[à préciser]"));
      L.push("  Jugement du .................. " + (estDate(dJug) ? jour(dJug) : "[DATE]"));
      L.push("  Tribunal ..................... [  ]");
      L.push("  Qualité du signataire ........ " + (qual || "[employeur / administrateur / liquidateur]"));
      L.push("  Effectif de l'entreprise ..... " +
        (effectifDe(ctx) === null ? "[  ]" : effectifDe(ctx) + " salariés"));
      L.push("  Licenciements envisagés ...... " +
        (nbLic(f) === null ? "[  ]" : String(nbLic(f))));
      L.push("  Catégories concernées ........ [  ]");
      L.push("  Ordonnance du juge-commissaire du [DATE], autorisant [périmètre]");
      L.push("  Date envisagée des notifications ..... " +
        (estDate(dNot) ? jour(dNot) : "[DATE]"));
      L.push("");
      L.push("Je vous prie de bien vouloir m'accuser réception de la présente.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push("[Signature — qualité de l'auteur du plan]");
      L.push("");
      L.push("Pièces jointes : jugement · acte de désignation · ordonnance du");
      L.push("juge-commissaire · tableau des catégories et des suppressions");
      L.push("");
      L.push("  Envoyée le [DATE] — moyen : [voie dématérialisée / LRAR] — accusé de");
      L.push("  réception du [DATE], conservé au dossier : ☐");
      L.push("");
      L.push("  [Cette information ne se confond pas avec la demande de validation ou");
      L.push("  d'homologation du plan, ni avec la notification du projet de l'article");
      L.push("  L. 1233-46. Ce sont trois actes distincts, adressés au même service, et");
      L.push("  l'un ne vaut pas les autres.]");
      L.push("");

      titre(L, "V. L'ordre des actes");

      tableau(L, ["Rang", "Acte", "Fondement", "Fait le"], [
        ["1", "Requête au juge-commissaire", "code de commerce (non lu ici)", "[  ]"],
        ["2", "Ordonnance autorisant les licenciements", "code de commerce (non lu ici)", "[  ]"],
        ["3", "Information de l'autorité administrative", "L. 1233-60", "[  ]"],
        ["4", "Consultation du comité selon le renvoi applicable", "L. 1233-58, I", "[  ]"],
        ["5", "Demande de validation ou d'homologation, le cas échéant",
          "L. 1233-58, II ; D. 1233-14", "[  ]"],
        ["6", "Décision de l'administration — 8 jours en redressement, 4 en liquidation",
          "L. 1233-58, II", "[  ]"],
        ["7", "Notification des licenciements", "L. 1233-58, II", "[  ]"],
      ]);
      L.push("");
      L.push("  Aucun rang ne se saute, et aucun ne se rattrape en le plaçant après.");
      L.push("  Vérifiez que les dates portées dans la colonne de droite sont croissantes :");
      L.push("  c'est le contrôle le plus rapide et le plus révélateur du dossier.");
      L.push("");
      if (estDate(dAdm) && estDate(dNot)) {
        var e2 = ecart(dAdm, dNot);
        L.push("  Dans votre fiche : information de l'administration le " + jour(dAdm) + ",");
        L.push("  notification envisagée le " + jour(dNot) + " — soit " +
          (e2 === null ? "[  ]" : e2 + " jours") + ".");
        if (e2 !== null && e2 < 0) {
          L.push("  L'ordre est INVERSÉ : l'information doit précéder les licenciements.");
        }
        L.push("");
      }

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous déposez la requête et vous préparez");
      L.push("l'information de l'administration.");
      L.push("");
      L.push("L'application n'annonce aucun délai d'obtention de l'ordonnance : elle n'a");
      L.push("pas lu le texte qui le fixerait, et un délai inventé ferait plus de mal");
      L.push("qu'une case vide. Demandez-le au greffe, et inscrivez-le ici : [  ].");
      L.push("");
      L.push("L'information de l'autorité administrative, elle, est immédiate : elle part");
      L.push("dès l'ordonnance obtenue, et en tout cas AVANT toute notification.");
      L.push("");
      if (estDate(dJug) && type === "liquidation") {
        L.push("ET LE TEMPS EST COMPTÉ. Le jugement de liquidation date du " + jour(dJug) + " :");
        L.push("la fenêtre de garantie des créances de rupture expire le " +
          jourPlus(dJug, 15) + ",");
        L.push("ou le " + jourPlus(dJug, 21) + " si un plan de sauvegarde de l'emploi est");
        L.push("élaboré (L. 3253-8, 2° c). Requête, ordonnance, information et notification");
        L.push("doivent tenir dans cet intervalle. Voyez le document du contrôle CTL-PCO-03.");
        L.push("");
      }
      L.push("Puis la consultation, la demande de validation ou d'homologation au plus tard");
      L.push("le lendemain de la dernière réunion (D. 1233-14), et la décision dans les");
      L.push("quatre ou huit jours (L. 1233-58, II).");
      L.push("");
      L.push("Ce n'est qu'ensuite que la première lettre part.");

      pied(L, ["L. 1233-46", "L. 1233-58", "L. 1233-60", "L. 3253-8", "D. 1233-14"],
        "Les articles L. 631-17, L. 631-19 (II), L. 641-4 dernier alinéa, L. 641-10\n" +
        "troisième alinéa et L. 642-5 du code de commerce, auxquels L. 1233-60\n" +
        "renvoie, ne sont dans aucun corpus lu par l'application. Ils sont nommés tels\n" +
        "que le texte lu les nomme, et ni reproduits ni paraphrasés. C'est là que se\n" +
        "trouvent les conditions de l'ordonnance et de l'information : vérifiez-les à\n" +
        "la source.\n" +
        "\n" +
        "Ce qui se joue : sans ordonnance, la notification est dépourvue de fondement.\n" +
        "Et « l'employeur, l'administrateur ou le liquidateur ne peut procéder, sous\n" +
        "peine d'irrégularité, à la rupture des contrats de travail avant la\n" +
        "notification de la décision favorable de validation ou d'homologation »\n" +
        "(L. 1233-58, II).");
      return L.join("\n");
    });

  doc("CTL-PCO-03",
    "Le calendrier de notification calé sur la fenêtre de garantie des créances",
    "Le calcul de la fenêtre de quinze ou vingt et un jours ouverte par le " +
    "jugement de liquidation, le tableau de contrôle date par date, et — si la " +
    "fenêtre est expirée — l'état des créances qui ne seraient pas garanties, à " +
    "établir avec le liquidateur avant toute notification.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var d0 = aujourd(ctx);
      var type = txt(f.typeProcedure), dJug = f.dateJugement, dNot = f.dateNotification;
      var r = regime(f);
      var pse = r ? !!r.pse : null;
      var jours = pse === null ? null : (pse ? 21 : 15);
      var e = ecart(dJug, dNot);
      var horsFenetre = estDate(dJug) && estDate(dNot) && jours !== null && e !== null && e > jours;
      var avant = e !== null && e < 0;

      L = L.concat(entete(ctx, "Fenêtre de garantie des créances de rupture",
        "article L. 3253-8 du code du travail"));

      if (horsFenetre || avant) {
        var quoi3 = [];
        if (avant) {
          quoi3.push("La notification est datée du " + jour(dNot) + ", ANTÉRIEURE au jugement");
          quoi3.push("de liquidation du " + jour(dJug) + ".");
          quoi3.push("");
          quoi3.push("La fenêtre de garantie court à compter du jugement : une rupture");
          quoi3.push("notifiée avant lui n'en relève pas.");
        } else {
          quoi3.push("Jugement de liquidation du " + jour(dJug) + ", notification prévue le");
          quoi3.push(jour(dNot) + ", soit " + e + " jours.");
          quoi3.push("");
          quoi3.push("L. 3253-8, 2° c) : l'assurance couvre « les créances résultant de la");
          quoi3.push("rupture des contrats de travail intervenant : […] c) Dans les quinze");
          quoi3.push("jours, ou vingt et un jours lorsqu'un plan de sauvegarde de l'emploi est");
          quoi3.push("élaboré, suivant le jugement de liquidation ».");
          quoi3.push("");
          quoi3.push("La fenêtre applicable est de " + jours + " jours et expire le " +
            jourPlus(dJug, jours) + ".");
          quoi3.push("Hors d'elle, les créances de rupture ne sont pas garanties.");
        }
        irrattrapable(L, quoi3,
          "Une date de notification ne se change pas rétroactivement, et n'antidatez " +
          "rien : les créances non garanties resteraient à la charge de la procédure, " +
          "et l'antidate ajouterait un faux à une difficulté financière. La partie V " +
          "chiffre ce qui est en jeu.");
      }

      modeEmploi(L, [
        "Ce document ne parle pas de régularité de la procédure : il parle d'argent,",
        "et de qui le paie.",
        "",
        "La garantie couvre les créances de rupture intervenant dans une fenêtre qui",
        "s'ouvre au jugement de liquidation et dure quinze jours — vingt et un lorsqu'un",
        "plan de sauvegarde de l'emploi est élaboré. Hors de cette fenêtre, indemnités",
        "et préavis restent à la charge de la procédure, et les salariés ne sont pas",
        "payés par la garantie.",
        "",
        "Deux conséquences pratiques, et elles tirent en sens contraire : il ne faut",
        "pas notifier trop tard, et il ne faut pas notifier sans avoir accompli ce qui",
        "doit précéder — ordonnance du juge-commissaire, information de",
        "l'administration, consultation. Le calendrier est étroit ; il n'est pas",
        "facultatif.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte");

      L.push("L. 3253-8, 2° : l'assurance couvre « les créances résultant de la rupture des");
      L.push("contrats de travail intervenant : a) Pendant la période d'observation ;");
      L.push("b) Dans le mois suivant le jugement qui arrête le plan de sauvegarde, de");
      L.push("redressement ou de cession ; c) DANS LES QUINZE JOURS, OU VINGT ET UN JOURS");
      L.push("LORSQU'UN PLAN DE SAUVEGARDE DE L'EMPLOI EST ÉLABORÉ, SUIVANT LE JUGEMENT DE");
      L.push("LIQUIDATION ; d) Pendant le maintien provisoire de l'activité autorisé par le");
      L.push("jugement de liquidation judiciaire et dans les quinze jours, ou vingt et un");
      L.push("jours lorsqu'un plan de sauvegarde de l'emploi est élaboré, suivant la fin de");
      L.push("ce maintien de l'activité ».");
      L.push("");
      L.push("LE d) EST AUSSI IMPORTANT QUE LE c). Si le jugement de liquidation a autorisé");
      L.push("un maintien provisoire de l'activité, la fenêtre ne court pas du jugement");
      L.push("mais de la FIN de ce maintien. Vérifiez le dispositif du jugement avant de");
      L.push("calculer quoi que ce soit :");
      L.push("");
      L.push("  Maintien provisoire de l'activité autorisé ? ☐ oui, jusqu'au [  ]  ☐ non");
      L.push("  Point de départ retenu : ☐ le jugement (c)  ☐ la fin du maintien (d)");
      L.push("");
      L.push("Le même article couvre aussi, au 4°, « les mesures d'accompagnement résultant");
      L.push("d'un plan de sauvegarde de l'emploi déterminé par un accord collectif");
      L.push("majoritaire ou par un document élaboré par l'employeur, conformément aux");
      L.push("articles L. 1233-24-1 à L. 1233-24-4, dès lors qu'il a été validé ou homologué");
      L.push("dans les conditions prévues à l'article L. 1233-58 avant ou après l'ouverture");
      L.push("de la procédure de redressement ou de liquidation judiciaire ».");
      L.push("");
      L.push("Et il précise que « la garantie des sommes et créances mentionnées aux 1°, 2°");
      L.push("et 5° inclut les cotisations et contributions sociales et salariales d'origine");
      L.push("légale, ou d'origine conventionnelle imposée par la loi, ainsi que la retenue");
      L.push("à la source prévue à l'article 204 A du code général des impôts ».");
      L.push("");

      titre(L, "II. Le calcul de votre fenêtre");

      if (type && type !== "liquidation") {
        L.push("La procédure déclarée est une " + (PROC[type] || type) + ". La fenêtre de");
        L.push("quinze ou vingt et un jours du c) vise les ruptures suivant le JUGEMENT DE");
        L.push("LIQUIDATION : elle ne s'applique pas en l'état.");
        L.push("");
        L.push("Les autres branches du 2° peuvent en revanche jouer : les créances de");
        L.push("rupture intervenant « pendant la période d'observation » (a) ou « dans le");
        L.push("mois suivant le jugement qui arrête le plan de sauvegarde, de redressement");
        L.push("ou de cession » (b). Faites vérifier laquelle s'applique à votre situation.");
        L.push("");
      }
      tableau(L, ["Élément", "Valeur"], [
        ["Nature de la procédure", type ? (PROC[type] || type) : "[non renseignée]"],
        ["Date du jugement de liquidation", estDate(dJug) ? jour(dJug) : "[non renseignée]"],
        ["Un plan de sauvegarde de l'emploi est-il élaboré ?",
          pse === null ? "[le moteur du module n'est pas chargé]" : (pse ? "oui" : "non")],
        ["Durée de la fenêtre", jours === null ? "[15 jours, ou 21 avec plan]" : jours + " jours"],
        ["Dernier jour de la fenêtre",
          (estDate(dJug) && jours !== null) ? jourPlus(dJug, jours) : "[à calculer]"],
        ["Notification envisagée", estDate(dNot) ? jour(dNot) : "[non renseignée]"],
        ["Écart jugement → notification", e === null ? "[non calculable]" : e + " jours"],
        ["Dans la fenêtre ?", (e === null || jours === null) ? "[  ]"
          : (e < 0 ? "NON — antérieure au jugement" : e <= jours ? "oui" : "NON — hors fenêtre")],
      ]);
      L.push("");
      if (!estDate(dJug) || !estDate(dNot)) {
        L.push("  La date du jugement de liquidation ou celle de la notification n'est pas");
        L.push("  renseignée : la fenêtre ne peut pas être vérifiée. Ce sont deux dates, et");
        L.push("  elles conditionnent le paiement des salariés.");
        L.push("");
      }
      if (pse === null) {
        L.push("  Le moteur du module n'est pas chargé : le document ne tranche pas entre");
        L.push("  quinze et vingt et un jours. Reportez-vous au rapport d'audit, qui a dit");
        L.push("  si un plan est dû.");
        L.push("");
        if (estDate(dJug)) {
          L.push("  Repères : fenêtre de quinze jours jusqu'au " + jourPlus(dJug, 15) + " ;");
          L.push("  fenêtre de vingt et un jours jusqu'au " + jourPlus(dJug, 21) + ".");
          L.push("");
        }
      }

      titre(L, "III. Le tableau de contrôle avant notification");

      L.push("Chaque acte préalable doit tenir DANS la fenêtre, avec la notification.");
      L.push("C'est ce qui rend le calendrier de la liquidation si serré.");
      L.push("");
      tableau(L, ["Acte", "Fondement", "Prévu le", "Dans la fenêtre ?"], [
        ["Jugement de liquidation", "—", estDate(dJug) ? jour(dJug) : "[  ]", "point de départ"],
        ["Requête et ordonnance du juge-commissaire", "code de commerce (non lu ici)",
          "[  ]", "☐"],
        ["Information de l'autorité administrative", "L. 1233-60", "[  ]", "☐"],
        ["Consultation du comité", "L. 1233-58, I", "[  ]", "☐"],
        ["Demande de validation ou d'homologation", "D. 1233-14", "[  ]", "☐"],
        ["Décision de l'administration (4 jours en liquidation)", "L. 1233-58, II", "[  ]", "☐"],
        ["NOTIFICATION DES LICENCIEMENTS", "L. 1233-58, II",
          estDate(dNot) ? jour(dNot) : "[  ]", "☐"],
        ["Dernier jour de la fenêtre", "L. 3253-8, 2° c",
          (estDate(dJug) && jours !== null) ? jourPlus(dJug, jours) : "[  ]", "—"],
      ]);
      L.push("");
      L.push("  Rappel utile : L. 1233-59 dispose que « les délais prévus à l'article");
      L.push("  L. 1233-15 pour l'envoi des lettres de licenciement prononcé pour un motif");
      L.push("  économique ne sont pas applicables en cas de redressement ou de liquidation");
      L.push("  judiciaire ». Le délai de sept jours ouvrables après l'entretien préalable");
      L.push("  ne retient donc pas l'envoi ici.");
      L.push("");
      L.push("  Mais l'article L. 1233-58, II, le retient : la rupture ne peut intervenir");
      L.push("  « avant la notification de la décision favorable de validation ou");
      L.push("  d'homologation, ou l'expiration des délais mentionnés au quatrième alinéa »");
      L.push("  — quatre jours à compter de la dernière réunion du comité en liquidation.");
      L.push("  Les deux contraintes se cumulent : il faut être après la décision ET dans");
      L.push("  la fenêtre.");
      L.push("");

      titre(L, "IV. Si la fenêtre n'est pas encore expirée");

      L.push("Avancez la notification pour y entrer, à condition que tout ce qui doit la");
      L.push("précéder soit accompli.");
      L.push("");
      L.push("  Jours restants avant l'expiration : " +
        ((estDate(dJug) && jours !== null)
          ? (function () {
              var restant = ecart(iso0(d0), plusJoursISO(dJug, jours));
              return restant === null ? "[  ]" : String(restant) + " jours";
            })()
          : "[  ]"));
      L.push("");
      L.push("  ☐ Ordonnance du juge-commissaire obtenue");
      L.push("  ☐ Autorité administrative informée (L. 1233-60)");
      L.push("  ☐ Comité consulté selon le renvoi applicable (L. 1233-58, I)");
      L.push("  ☐ Décision de validation ou d'homologation notifiée, ou délai expiré");
      L.push("  ☐ Autorisations de l'inspecteur du travail obtenues pour les salariés");
      L.push("    protégés — la protection joue « y compris lors d'une procédure de");
      L.push("    sauvegarde, de redressement ou de liquidation judiciaire » (L. 2411-1,");
      L.push("    lu au corpus du module « comité social et économique »)");
      L.push("  ☐ Date d'expédition retenue : [  ], dans la fenêtre");
      L.push("");
      L.push("  [Si une case reste vide, ne forcez pas l'envoi pour tenir la fenêtre. Une");
      L.push("  créance non garantie se chiffre ; une rupture irrégulière se plaide, et");
      L.push("  coûte davantage.]");
      L.push("");

      titre(L, "V. Si la fenêtre est expirée");

      L.push("N'antidatez rien. Chiffrez, avec le liquidateur, ce qui ne serait pas");
      L.push("garanti — c'est la seule décision utile à ce stade, et elle se prend sur des");
      L.push("montants, non sur une impression.");
      L.push("");
      tableau(L, ["Salarié", "Ancienneté", "Indemnité de licenciement",
        "Préavis", "Congés payés", "Total non garanti"],
        [["[nom ou matricule]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["[nom ou matricule]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["TOTAL", "", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  [L'indemnité de licenciement est due au salarié titulaire d'un contrat à");
      L.push("  durée indéterminée « licencié alors qu'il compte 8 mois d'ancienneté");
      L.push("  ininterrompus au service du même employeur », sauf faute grave, et ses");
      L.push("  modalités de calcul « sont fonction de la rémunération brute dont le salarié");
      L.push("  bénéficiait antérieurement à la rupture », déterminées par voie");
      L.push("  réglementaire (L. 1234-9). Le module du licenciement économique calcule");
      L.push("  cette indemnité ; reportez ici ses montants plutôt que de les recalculer.]");
      L.push("");
      L.push("  Ressources disponibles de la procédure : [montant, à la date du  ]");
      L.push("  Position du liquidateur : [  ]");
      L.push("  Décision prise le [DATE], par [nom et qualité].");
      L.push("");
      L.push("  [Informez les salariés concernés de la situation. Une créance non garantie");
      L.push("  découverte au moment du paiement fait plus de dégâts qu'une créance non");
      L.push("  garantie annoncée.]");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + ".");
      L.push("");
      if (estDate(dJug) && jours !== null) {
        L.push("Jugement de liquidation : " + jour(dJug) + ".");
        L.push("Dernier jour de la fenêtre de " + jours + " jours : " + jourPlus(dJug, jours) + ".");
        L.push("");
        L.push("  Repères intermédiaires :");
        L.push("    Ordonnance et information de l'administration, au plus tard le " +
          jourPlus(dJug, Math.max(1, Math.floor(jours / 3))));
        L.push("    Dernière réunion du comité, au plus tard le " +
          jourPlus(dJug, Math.max(2, jours - 6)));
        L.push("    Dépôt de la demande, au plus tard le lendemain de cette réunion");
        L.push("    (D. 1233-14)");
        L.push("    Décision de l'administration, quatre jours plus tard (L. 1233-58, II)");
        L.push("    Notification, avant le " + jourPlus(dJug, jours));
        L.push("");
        L.push("  [Ces repères ne sont pas des règles : ce sont des jalons pour tenir dans");
        L.push("  la fenêtre. Seuls le premier et le dernier jour sont commandés par un");
        L.push("  texte ; ce qu'il y a entre les deux relève de votre organisation.]");
        L.push("");
      } else if (estDate(dJug)) {
        L.push("Jugement de liquidation : " + jour(dJug) + ". La fenêtre expire le " +
          jourPlus(dJug, 15));
        L.push("si aucun plan de sauvegarde de l'emploi n'est élaboré, le " +
          jourPlus(dJug, 21) + " s'il l'est.");
        L.push("");
      } else {
        L.push("Aucune date de jugement de liquidation n'est portée par la fiche : la");
        L.push("fenêtre ne peut pas être calculée. C'est la première donnée à renseigner,");
        L.push("et elle se lit en tête du jugement.");
        L.push("");
      }
      L.push("Refaites ce calcul si le maintien provisoire de l'activité se prolonge : le");
      L.push("d) de l'article fait alors courir la fenêtre de la FIN de ce maintien, et");
      L.push("non du jugement.");

      pied(L, ["L. 1233-15", "L. 1233-58", "L. 1233-59", "L. 1233-60", "L. 1234-9",
        "L. 3253-8", "D. 1233-14"],
        "L'article L. 3253-6, que L. 3253-8 mentionne pour désigner l'assurance, et\n" +
        "l'article 204 A du code général des impôts, qu'il cite pour la retenue à la\n" +
        "source, ne sont pas au corpus du module : ils sont nommés, non reproduits.\n" +
        "\n" +
        "Ce qui se joue : hors de la fenêtre, les créances résultant de la rupture ne\n" +
        "sont pas couvertes par l'assurance de l'article L. 3253-8. Indemnités et\n" +
        "préavis restent à la charge de la procédure, et les salariés ne sont pas\n" +
        "payés par la garantie. Ce n'est pas une irrégularité de procédure : c'est une\n" +
        "charge.");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA RECHERCHE D'UN REPRENEUR
     ══════════════════════════════════════════════════════════════════════ */

  doc("CTL-REP-01",
    "Le dossier de recherche de repreneur : mandat, journal des candidats, rapport au comité",
    "Le mandat écrit et daté, le journal des contacts et des offres avec les " +
    "motifs d'écartement, la consultation du comité sur l'offre à laquelle " +
    "l'entreprise souhaite donner suite, et le rapport de l'article L. 1233-57-20 " +
    "à présenter avant la fin de la procédure d'information et de consultation.",
    function (ctx) {
      var f = (ctx && ctx.fiche) || {}, L = [];
      var d0 = aujourd(ctx), eff = effectifDe(ctx);
      var ferme = f.fermetureEtablissement;
      var rech = txt(f.rechercheRepreneur);
      var rs = reunions(f), dr = derniereReunion(f);
      var vise = eff !== null && eff >= 1000;

      L = L.concat(entete(ctx, "Dossier de recherche d'un repreneur",
        "articles L. 1233-57-9 à L. 1233-57-14, L. 1233-57-19 et L. 1233-57-20 du code du travail"));

      modeEmploi(L, [
        "Une précision qui commande la lecture de tout ce document : les articles",
        "L. 1233-57-9 à L. 1233-57-16, qui portent l'obligation elle-même, NE SONT",
        "DANS AUCUN CORPUS LU PAR L'APPLICATION. Ils sont nommés — les textes lus les",
        "nomment —, mais ni reproduits, ni résumés, ni paraphrasés. Le contenu exact",
        "de l'obligation, ses conditions et ses exceptions se vérifient à la source.",
        "",
        "Ce que l'application a lu, en revanche, ce sont les deux articles qui",
        "referment la procédure : L. 1233-57-19, sur la consultation du comité",
        "relative à une offre de reprise, et L. 1233-57-20, sur le rapport à",
        "présenter avant la fin de la procédure d'information et de consultation. Ces",
        "deux-là sont reproduits mot pour mot ci-dessous, et ce sont eux que ce",
        "document sert à exécuter.",
        "",
        "Le reste — mandat, journal, motifs d'écartement — n'est pas commandé article",
        "par article : c'est ce sans quoi le rapport du L. 1233-57-20 ne pourra pas",
        "être écrit. On ne rend pas compte, à la fin, d'une recherche dont on n'a rien",
        "consigné au fil de l'eau.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. À qui l'obligation s'adresse");

      tableau(L, ["Condition", "Ce que la fiche porte"], [
        ["Effectif d'au moins mille salariés",
          eff === null ? "[non renseigné]" : eff + " salariés — " + (vise ? "condition remplie" : "en deçà du seuil")],
        ["Fermeture d'un établissement envisagée",
          ferme === true ? "oui" : ferme === false ? "non" : "[non renseignée]"],
        ["Recherche engagée, telle que déclarée", rech ? "« " + rech + " »" : "[rien de déclaré]"],
      ]);
      L.push("");
      if (eff === null) {
        L.push("  L'effectif n'est pas renseigné : l'obligation ne peut pas être vérifiée.");
        L.push("");
      } else if (!vise) {
        L.push("  L'effectif est inférieur à mille salariés. L'obligation de recherche d'un");
        L.push("  repreneur ne vise que les entreprises d'au moins mille salariés : elle ne");
        L.push("  s'applique pas en l'état.");
        L.push("");
        L.push("  Ce document reste utile à deux titres. D'abord parce que l'effectif du");
        L.push("  groupe peut compter : vérifiez le périmètre exact que les articles");
        L.push("  L. 1233-57-9 et suivants retiennent — l'application ne les a pas lus et ne");
        L.push("  le dit donc pas. Ensuite parce qu'une recherche de repreneur conduite");
        L.push("  volontairement se documente de la même manière, et sert alors la");
        L.push("  démonstration des mesures d'évitement du plan.");
        L.push("");
      } else if (ferme !== true) {
        L.push("  L'effectif atteint mille salariés, mais la fermeture d'un établissement");
        L.push("  n'est pas déclarée" + (ferme === false ? "." : " — la donnée manque.") + " L'obligation est");
        L.push("  attachée au projet de fermeture : renseignez cette donnée avant de");
        L.push("  conclure, et relancez l'audit.");
        L.push("");
      } else {
        L.push("  Effectif d'au moins mille salariés et fermeture d'établissement envisagée :");
        L.push("  l'obligation est en jeu. Le respect des articles L. 1233-57-9 à");
        L.push("  L. 1233-57-16 est vérifié par l'autorité administrative — voyez le II.");
        L.push("");
      }

      titre(L, "II. Ce que l'administration vérifie");

      L.push("Les deux textes du contrôle administratif citent expressément ces articles.");
      L.push("");
      L.push("L. 1233-57-2, 4° — pour la validation d'un accord : l'autorité administrative");
      L.push("s'assure de « la mise en œuvre effective, le cas échéant, des obligations");
      L.push("prévues aux articles L. 1233-57-9 à L. 1233-57-16, L. 1233-57-19 et");
      L.push("L. 1233-57-20 ».");
      L.push("");
      L.push("L. 1233-57-3 — pour l'homologation d'un document unilatéral : elle vérifie");
      L.push("« le respect, le cas échéant, des obligations prévues aux articles");
      L.push("L. 1233-57-9 à L. 1233-57-16, L. 1233-57-19 et L. 1233-57-20 ».");
      L.push("");
      L.push("Deux mots à retenir de ces deux phrases. « MISE EN ŒUVRE EFFECTIVE » : ce");
      L.push("n'est pas l'existence d'un mandat qui est vérifiée, c'est ce qui a été fait.");
      L.push("Et « LE CAS ÉCHÉANT » : l'administration vérifie d'abord si l'obligation");
      L.push("s'appliquait — d'où l'intérêt de documenter aussi le cas où elle ne");
      L.push("s'appliquait pas.");
      L.push("");
      L.push("  [Ce que ces obligations contiennent exactement, l'application ne le dit");
      L.push("  pas : elle n'a pas lu les articles L. 1233-57-9 à L. 1233-57-16. Le mandat,");
      L.push("  le journal et les motifs d'écartement organisés ci-dessous sont ce qui");
      L.push("  permet d'établir une mise en œuvre effective, quelle qu'en soit la");
      L.push("  définition précise. Faites vérifier cette définition à la source.]");
      L.push("");

      titre(L, "III. Le mandat de recherche");

      L.push("Écrit, daté, et donné DÈS l'information du comité sur le projet de fermeture.");
      L.push("La date du mandat est la première chose que l'on regardera : un mandat daté");
      L.push("de la veille du rapport final dit à lui seul que la recherche n'a pas eu");
      L.push("lieu.");
      L.push("");
      L.push("  Mandataire ....................... [nom, qualité, coordonnées]");
      L.push("  Date du mandat ................... [  ]");
      L.push("  Date d'information du comité sur le projet de fermeture ..... " +
        (estDate(f.dateInfoCSE) ? jour(f.dateInfoCSE) : "[  ]"));
      L.push("  Périmètre de la recherche ........ [établissement(s) concerné(s), activités,");
      L.push("  actifs, effectif repris envisagé]");
      L.push("  Moyens mis à disposition ......... [budget, accès aux données, personnes");
      L.push("  référentes dans l'entreprise]");
      L.push("  Durée du mandat .................. [du ... au ...]");
      L.push("  Obligation de compte rendu ....... [périodicité, forme]");
      L.push("  Confidentialité .................. [modalités]");
      L.push("");
      L.push("  [Si la recherche est conduite en interne, sans mandataire extérieur,");
      L.push("  écrivez-le et désignez nominativement qui en est chargé. « L'entreprise a");
      L.push("  cherché » n'est imputable à personne, et donc invérifiable.]");
      L.push("");
      if (rech) {
        L.push("Ce que la fiche porte à ce titre : « " + rech + " »");
        L.push("");
        L.push("  Reprenez cette mention et complétez-la avec les rubriques ci-dessus : une");
        L.push("  déclaration n'est pas un mandat.");
        L.push("");
      } else if (vise && ferme === true) {
        L.push("La fiche ne porte AUCUNE indication sur la recherche de repreneur : ni date");
        L.push("d'engagement, ni mandataire, ni candidat, ni motif d'écartement. C'est ce que");
        L.push("le contrôle a relevé.");
        L.push("");
      }

      titre(L, "IV. Le journal des contacts et des offres");

      L.push("Une ligne par contact, tenue au fil de l'eau. C'est la pièce la plus");
      L.push("laborieuse et la plus décisive : elle transforme une recherche en recherche");
      L.push("prouvée.");
      L.push("");
      tableau(L, ["N°", "Candidat", "Premier contact", "Nature du contact",
        "Suite donnée", "Offre reçue le", "Motif d'écartement"],
        [["1", "[nom ou raison sociale]", "[  ]", "[courrier / entretien / visite]",
          "[  ]", "[  ]", "[  ]"],
         ["2", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["3", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("Pour chaque offre reçue, une fiche distincte :");
      L.push("");
      L.push("  Auteur de l'offre ................ [  ]");
      L.push("  Date de réception ................ [  ]");
      L.push("  Périmètre repris ................. [activités, actifs, sites]");
      L.push("  Emplois repris ................... [nombre, catégories]");
      L.push("  Prix et conditions financières ... [  ]");
      L.push("  Conditions suspensives ........... [  ]");
      L.push("  Capacité de l'auteur à garantir la pérennité de l'activité et de");
      L.push("  l'emploi de l'établissement ...... [éléments d'appréciation]");
      L.push("  Suite donnée ..................... ☐ retenue  ☐ écartée");
      L.push("  Motif, si écartée ................ [  ]");
      L.push("");
      L.push("  [La formule « capacité de l'auteur de l'offre à garantir la pérennité de");
      L.push("  l'activité et de l'emploi de l'établissement » est celle de l'article");
      L.push("  L. 1233-57-19 : c'est sur ce terrain que le comité est appelé à donner son");
      L.push("  avis, et c'est donc sur ce terrain que l'offre doit être documentée.]");
      L.push("");
      L.push("  Journal tenu par [nom et qualité], arrêté au [DATE].");
      L.push("");

      titre(L, "V. La consultation du comité sur l'offre retenue");

      L.push("L. 1233-57-19 : « L'employeur consulte le comité social et économique sur");
      L.push("toute offre de reprise à laquelle il souhaite donner suite et indique les");
      L.push("raisons qui le conduisent à accepter cette offre, notamment au regard de la");
      L.push("capacité de l'auteur de l'offre à garantir la pérennité de l'activité et de");
      L.push("l'emploi de l'établissement. Le comité social et économique émet un avis sur");
      L.push("cette offre dans un délai fixé en application de l'article L. 2323-3. Lorsque");
      L.push("la procédure est aménagée en application de l'article L. 1233-24-2 pour");
      L.push("favoriser un projet de transfert d'une ou de plusieurs entités économiques");
      L.push("mentionné à l'article L. 1233-61, l'employeur consulte le comité social et");
      L.push("économique sur l'offre de reprise dans le délai fixé par l'accord collectif");
      L.push("mentionné à l'article L. 1233-24-2. »");
      L.push("");
      L.push("L'article L. 2323-3, qui fixe le délai de droit commun, n'est pas au corpus du");
      L.push("module : il est nommé, non reproduit. Vérifiez-y le délai applicable.");
      L.push("");
      L.push(nom(ctx));
      L.push(adresse(ctx));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : consultation sur une offre de reprise");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("En application de l'article L. 1233-57-19 du code du travail, je vous consulte");
      L.push("sur l'offre de reprise présentée par [auteur de l'offre], reçue le [DATE], à");
      L.push("laquelle l'entreprise souhaite donner suite.");
      L.push("");
      L.push("Vous trouverez ci-joint l'offre et ses annexes.");
      L.push("");
      L.push("Les raisons qui conduisent l'entreprise à accepter cette offre sont les");
      L.push("suivantes, notamment au regard de la capacité de son auteur à garantir la");
      L.push("pérennité de l'activité et de l'emploi de l'établissement : [exposer les");
      L.push("raisons — nombre d'emplois repris, périmètre d'activité maintenu, moyens");
      L.push("financiers de l'auteur, projet industriel, engagements pris].");
      L.push("");
      L.push("La consultation est ouverte à compter de ce jour ; vous êtes invités à émettre");
      L.push("votre avis lors de la réunion du [DATE].");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : offre de reprise et annexes · note exposant les raisons de");
      L.push("l'acceptation · journal des contacts et des offres");
      L.push("");

      titre(L, "VI. Le rapport à présenter avant la fin de la consultation");

      L.push("L. 1233-57-20 : « Avant la fin de la procédure d'information et de");
      L.push("consultation prévue à l'article L. 1233-30, si aucune offre de reprise n'a été");
      L.push("reçue ou si l'employeur n'a souhaité donner suite à aucune des offres,");
      L.push("celui-ci réunit le comité social et économique et lui présente un rapport, qui");
      L.push("est communiqué à l'autorité administrative. Ce rapport indique : 1° Les");
      L.push("actions engagées pour rechercher un repreneur ; 2° Les offres de reprise qui");
      L.push("ont été reçues ainsi que leurs caractéristiques ; 3° Les motifs qui l'ont");
      L.push("conduit, le cas échéant, à refuser la cession de l'établissement. »");
      L.push("");
      L.push("Trois obligations dans une phrase, et la troisième est celle qu'on oublie :");
      L.push("réunir le comité, lui présenter le rapport, et COMMUNIQUER LE RAPPORT À");
      L.push("L'AUTORITÉ ADMINISTRATIVE.");
      L.push("");
      L.push("Et un moment : AVANT LA FIN de la procédure d'information et de consultation");
      L.push("prévue à l'article L. 1233-30. Un rapport présenté après l'avis du comité");
      L.push("n'est pas présenté « avant la fin » de la procédure.");
      L.push("");
      L.push("« RAPPORT SUR LA RECHERCHE D'UN REPRENEUR");
      L.push("Article L. 1233-57-20 du code du travail");
      L.push("");
      L.push(nom(ctx) + " — établissement de [  ]");
      L.push("Présenté au comité social et économique réuni le [DATE]");
      L.push("");
      L.push("1° LES ACTIONS ENGAGÉES POUR RECHERCHER UN REPRENEUR");
      L.push("[Reprendre le mandat et le journal du IV : date d'engagement de la recherche,");
      L.push("mandataire, périmètre, nombre de candidats contactés, nature et dates des");
      L.push("contacts, moyens engagés. Des dates et des nombres, non des adjectifs.]");
      L.push("");
      L.push("2° LES OFFRES DE REPRISE REÇUES ET LEURS CARACTÉRISTIQUES");
      L.push("");
      tableau(L, ["Auteur", "Reçue le", "Périmètre", "Emplois repris", "Conditions"],
        [["[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("[Si aucune offre n'a été reçue, l'écrire en toutes lettres : « aucune offre de");
      L.push("reprise n'a été reçue ». Le 2° doit être renseigné même par la négative.]");
      L.push("");
      L.push("3° LES MOTIFS DU REFUS DE CESSION, LE CAS ÉCHÉANT");
      L.push("[Pour chaque offre écartée, le motif : capacité de l'auteur, périmètre");
      L.push("insuffisant, conditions financières, conditions suspensives non levées,");
      L.push("absence de projet industriel. Un motif par offre, et rattaché à des éléments.]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE] — " + signataire(ctx) + " »");
      L.push("");
      L.push("  Présenté au comité le [DATE] — porté au procès-verbal : ☐");
      L.push("  Communiqué à l'autorité administrative le [DATE] — accusé conservé : ☐");
      L.push("");

      titre(L, "VII. Le suivi de l'information du comité au fil des réunions");

      L.push("Le rapport final ne suffit pas : le comité est informé du déroulement de la");
      L.push("recherche au fur et à mesure, et cette information se consigne au");
      L.push("procès-verbal de chaque réunion. C'est ce qui établira, plus tard, que la");
      L.push("recherche a duré autant que la procédure.");
      L.push("");
      tableau(L, ["Réunion du", "Point présenté sur la recherche", "Consigné au PV"],
        rs.length ? rs.map(function (x) {
          return [jour(x), "[état de la recherche à cette date]", "☐"];
        }) : [["[  ]", "[  ]", "☐"], ["[  ]", "[  ]", "☐"]]);
      L.push("");
      L.push("  Mention type à porter au procès-verbal : « Le président rend compte de");
      L.push("  l'état de la recherche d'un repreneur : [nombre] candidats contactés depuis");
      L.push("  la précédente réunion, [nombre] offres reçues, [nombre] écartées pour les");
      L.push("  motifs suivants : [  ]. »");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      L.push("Aujourd'hui, " + leJour(d0) + " — vous datez le mandat et vous ouvrez le");
      L.push("journal. La recherche s'engage DÈS l'information du comité sur le projet de");
      L.push("fermeture, et non après : c'est la date du mandat qui le prouvera.");
      L.push("");
      if (estDate(f.dateInfoCSE)) {
        L.push("Votre comité a été informé le " + jour(f.dateInfoCSE) + ". Un mandat daté");
        L.push("d'après cette date se défend d'autant plus mal qu'il est postérieur.");
        L.push("");
      }
      if (rs.length) {
        L.push("Vos réunions : " + rs.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("À chacune, un point sur la recherche, consigné au procès-verbal.");
        L.push("");
      }
      if (dr) {
        L.push("Le rapport de l'article L. 1233-57-20 se présente AVANT LA FIN de la");
        L.push("procédure d'information et de consultation. Votre dernière réunion portée par");
        L.push("la fiche est celle du " + jour(dr) + " : le rapport doit être présenté au plus");
        L.push("tard à cette réunion, et non après.");
        L.push("");
        L.push("Prévoyez de le communiquer à l'autorité administrative dans la foulée, le " +
          jourPlus(dr, 1) + " au plus tard — avant, en tout cas, le dépôt de la demande");
        L.push("de validation ou d'homologation, puisque c'est elle qui vérifie le respect");
        L.push("de cette obligation (L. 1233-57-2, 4° ; L. 1233-57-3).");
        L.push("");
      } else {
        L.push("La fiche ne porte aucune date de réunion : le terme du rapport ne peut pas");
        L.push("être calculé. Il se place avant la fin de la procédure d'information et de");
        L.push("consultation prévue à l'article L. 1233-30.");
        L.push("");
      }
      L.push("Une recherche engagée tard ne se rattrape pas en la prolongeant : elle se");
      L.push("constate telle qu'elle a eu lieu. Ce qui se rattrape, c'est le compte rendu —");
      L.push("à condition d'avoir consigné quelque chose à rendre.");

      pied(L, ["L. 1233-30", "L. 1233-57-2", "L. 1233-57-3", "L. 1233-57-19",
        "L. 1233-57-20", "L. 1233-24-2", "L. 1233-61"],
        NON_LUS_57_9 + "\n" +
        "\n" +
        "L'article L. 2323-3, que L. 1233-57-19 cite pour le délai d'avis du comité,\n" +
        "n'est pas au corpus du module : il est nommé, non reproduit.\n" +
        "\n" +
        "Ce qui se joue : l'autorité administrative vérifie « la mise en œuvre\n" +
        "effective, le cas échéant, des obligations prévues aux articles L. 1233-57-9\n" +
        "à L. 1233-57-16, L. 1233-57-19 et L. 1233-57-20 » (L. 1233-57-2, 4° ;\n" +
        "L. 1233-57-3). Le refus de validation ou d'homologation est donc le premier\n" +
        "risque, et le licenciement prononcé en l'absence de décision est nul\n" +
        "(L. 1235-10).");
      return L.join("\n");
    });

  /* Le jour même en « AAAA-MM-JJ », pour comparer une date de la fiche à
     aujourd'hui sans repasser par une Date. */
  function iso0(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return null;
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j;
  }
  /* Une date de la fiche, décalée de n jours, rendue au même format : c'est ce
     que « ecart » sait comparer. */
  function plusJoursISO(s, n) {
    var d = dISO(s);
    return d ? iso0(dans(d, n)) : null;
  }

})(typeof window !== "undefined" ? window : this);
