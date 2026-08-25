/* Les documents que l'application PRODUIT — module « plan de sauvegarde de
   l'emploi ».

   POURQUOI CE FICHIER EXISTE

   L'audit disait ce qui manque, les fiches de régularisation disaient comment
   le corriger. Un employeur à qui l'on explique en cinq étapes comment doter
   ses mesures d'un budget n'a toujours pas de tableau de chiffrage, et le
   dossier qu'il déposera n'en portera pas davantage. Ce fichier écrit le
   document lui-même, au nom de l'entreprise, avec les chiffres qu'elle a
   saisis, ses courriers et son calendrier calculé.

   CE QUI EST PROPRE À CE MODULE, ET QUI COMMANDE TOUT

   Beaucoup d'irrégularités d'un plan de sauvegarde de l'emploi NE SE
   RATTRAPENT PAS. Une lettre de licenciement expédiée avant la décision
   administrative frappe la rupture de nullité — le texte le dit en toutes
   lettres (L. 1233-39). Une réunion tenue trop tôt ne se déplace pas. Une
   désignation d'expert postérieure à la première réunion ne se rétrodate pas.
   Un accord signé en deçà de cinquante pour cent des suffrages n'existe pas
   comme accord majoritaire et ne se complète pas après coup.

   Produire, dans ces cas, un document de « régularisation » serait le pire
   service à rendre : l'employeur croirait s'être mis en règle, et il
   découvrirait le contraire devant le juge. Les documents concernés
   commencent donc par un encadré « CE QUI NE SE RATTRAPE PAS », qui dit
   pourquoi le rattrapage est impossible et sur quel texte. Ce qui suit ne
   rattrape pas : il CONSTATE, et il prépare la suite — arrêter ce qui peut
   encore l'être, tenir la réunion qui rétablit le rythme, notifier au bon
   moment, ne rien antidater.

   CE QUI EST ÉCRIT, CE QUI RESTE ENTRE CROCHETS

   Tout ce que la loi impose est écrit, et fondé sur l'article lu à la source.
   Aucun article n'est cité qui ne figure pas dans moteur/pse/textes-pse.json
   ou dans le fondement du contrôle. Aucun montant n'est avancé : AUCUN TEXTE
   NE FIXE LE MONTANT D'UN PLAN, et l'appréciation de sa proportionnalité
   appartient à l'autorité administrative puis au juge administratif
   (L. 1233-57-3). Tout le reste — les choix que la loi laisse à l'employeur,
   les données qu'il n'a pas saisies — sort ENTRE CROCHETS : c'est un choix ou
   une lacune, jamais une invention.

   LES DÉLAIS SE DISENT AVEC LEUR POINT DE DÉPART, et se calculent quand une
   date le permet. « Vingt et un jours » ne veut rien dire ; « vingt et un
   jours à compter de la réception du dossier complet, soit le 22 juin 2026 »
   se vérifie. */
(function (global) {
  "use strict";

  var A = global.DocumentsProduits;
  if (!A || typeof A.ajouter !== "function")
    throw new Error("documents-pse.js : documents-produits.js doit être chargé avant.");
  var O = A.outils;
  var cro = O.cro, leJour = O.leJour, entete = O.entete;

  /* Le moteur du module, quand la page l'a chargé : c'est LUI qui dit si le
     plan est dû, quel dispositif d'accompagnement l'effectif commande, quel
     délai d'instruction la voie ouvre et quel délai d'avis le nombre de
     licenciements ouvre. Les documents ne refont aucun de ces calculs : deux
     réponses différentes à la même question, dans le rapport et dans le
     document, se remarqueraient tout de suite. */
  function moteur() {
    return (global.MoteurPSE && global.MoteurPSE.moteur) || null;
  }

  /* ═══════════════════════════════════════════════════ les outils du module */

  function nbf(x) {
    if (typeof x === "number") return isFinite(x) ? x : null;
    if (typeof x !== "string" || x.trim() === "") return null;
    var n = Number(x.replace(/\s/g, "").replace(",", "."));
    return isFinite(n) ? n : null;
  }

  function eur(n, quoi) {
    return n === null || n === undefined
      ? "[" + (quoi || "montant") + "]"
      : Number(n).toLocaleString("fr-FR") + " €";
  }

  /* Les dates de la fiche sont des chaînes « AAAA-MM-JJ ». On les découpe
     à la main : « new Date("2026-06-01") » se lit en temps universel, et sur
     un poste à l'ouest de Greenwich la date affichée reculait d'un jour. */
  function dISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s == null ? "" : s).trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }
  function iso(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return null;
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j;
  }
  /* Le jour en clair, ou le crochet qui dit ce qui manque. */
  function jour(s, quoi) {
    var d = dISO(s);
    return d ? leJour(d) : "[" + (quoi || "date à compléter") + "]";
  }
  function plusJours(s, n) {
    var d = dISO(s);
    if (!d) return null;
    d.setDate(d.getDate() + n);
    return iso(d);
  }
  /* Le dernier jour du mois d'arrivée quand le quantième n'existe pas : la
     règle du moteur, reprise à l'identique pour ne pas en avoir deux. */
  function plusMois(s, n) {
    var d = dISO(s);
    if (!d) return null;
    var j = d.getDate();
    d.setMonth(d.getMonth() + n);
    if (d.getDate() !== j) d.setDate(0);
    return iso(d);
  }
  function ecart(a, b) {
    var x = dISO(a), y = dISO(b);
    return x && y ? Math.round((y - x) / 86400000) : null;
  }
  function avant(a, b) {                    /* a strictement antérieur à b */
    var x = dISO(a), y = dISO(b);
    return x && y ? x.getTime() < y.getTime() : null;
  }

  /* ── le texte de l'article L. 1233-62, verbatim ──────────────────────────

     Les sept rubriques sont reproduites mot pour mot depuis la version lue à
     la source, LEGIARTI000036261725, telle que moteur/pse/textes-pse.json la
     porte. Le module de calcul les découpe depuis le texte ; la page, elle,
     n'a pas accès à ce découpage, et un document qui parlerait des rubriques
     sans les citer obligerait le lecteur à ouvrir le code du travail à côté.

     La liste des marques est confrontée, à l'exécution, à celle que le moteur
     propose au formulaire : si l'article changeait et que l'une des deux
     dérivait, le document le dirait au lieu de se taire. */
  var RUBRIQUES = [
    { marque: "1°", court: "Reclassement interne sur le territoire national",
      texte: "Des actions en vue du reclassement interne sur le territoire national, des salariés sur des emplois relevant de la même catégorie d'emplois ou équivalents à ceux qu'ils occupent ou, sous réserve de l'accord exprès des salariés concernés, sur des emplois de catégorie inférieure" },
    { marque: "1° bis", court: "Reprise d'activités pour éviter la fermeture d'un établissement",
      texte: "Des actions favorisant la reprise de tout ou partie des activités en vue d'éviter la fermeture d'un ou de plusieurs établissements" },
    { marque: "2°", court: "Créations d'activités nouvelles par l'entreprise",
      texte: "Des créations d'activités nouvelles par l'entreprise" },
    { marque: "3°", court: "Reclassement externe et réactivation du bassin d'emploi",
      texte: "Des actions favorisant le reclassement externe à l'entreprise, notamment par le soutien à la réactivation du bassin d'emploi" },
    { marque: "4°", court: "Soutien à la création ou à la reprise d'activités par les salariés",
      texte: "Des actions de soutien à la création d'activités nouvelles ou à la reprise d'activités existantes par les salariés" },
    { marque: "5°", court: "Formation, validation des acquis, reconversion",
      texte: "Des actions de formation, de validation des acquis de l'expérience ou de reconversion de nature à faciliter le reclassement interne ou externe des salariés sur des emplois équivalents" },
    { marque: "6°", court: "Réduction ou aménagement du temps de travail et des heures supplémentaires",
      texte: "Des mesures de réduction ou d'aménagement du temps de travail ainsi que des mesures de réduction du volume des heures supplémentaires réalisées de manière régulière lorsque ce volume montre que l'organisation du travail de l'entreprise est établie sur la base d'une durée collective manifestement supérieure à trente-cinq heures hebdomadaires ou 1 600 heures par an et que sa réduction pourrait préserver tout ou partie des emplois dont la suppression est envisagée" },
  ];

  /* Les rubriques qui s'adressent aux seuls salariés dont le licenciement est
     envisagé — c'est le découpage que le contrôle de cohérence applique, et
     il n'y en a pas deux. */
  var INDIVIDUELLES = ["1°", "4°", "5°"];

  function divergenceRubriques() {
    var p = global.MoteurPSE && global.MoteurPSE.propositions;
    var v = p && p["plan.mesures.rubrique"] && p["plan.mesures.rubrique"].valeurs;
    if (!v || !v.length) return null;
    var ici = RUBRIQUES.map(function (r) { return r.marque; }).join("|");
    return v.join("|") === ici ? null
      : "Attention : les rubriques citées ici (" + ici.replace(/\|/g, ", ") +
        ") ne correspondent plus à celles du moteur (" + v.join(", ") +
        "). Vérifiez la version de l'article L. 1233-62 avant de vous servir de ce document.";
  }

  /* ── la mise en forme ───────────────────────────────────────────────────── */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var DOUBLE = "════════════════════════════════════════════════════════════════════════";

  function pad(s, n) {
    s = String(s == null ? "" : s);
    while (s.length < n) s += " ";
    return s;
  }
  /* Un tableau en texte simple : le document se colle dans un courriel, se
     copie dans Word et s'imprime sans rien perdre. */
  function tableau(L, entetes, lignes) {
    var larg = entetes.map(function (e, i) {
      var m = String(e).length;
      lignes.forEach(function (l) { m = Math.max(m, String(l[i] == null ? "" : l[i]).length); });
      return Math.min(m, 46);
    });
    var ligne = function (cells) {
      return cells.map(function (c, i) {
        var s = String(c == null ? "" : c);
        if (s.length > larg[i]) s = s.slice(0, larg[i] - 1) + "…";
        return pad(s, larg[i]);
      }).join("  ").replace(/\s+$/, "");
    };
    L.push(ligne(entetes));
    L.push(larg.map(function (n) { var s = ""; while (s.length < n) s += "─"; return s; }).join("  "));
    lignes.forEach(function (l) { L.push(ligne(l)); });
  }

  function titre(L, t) {
    L.push(DOUBLE);
    L.push(t.toUpperCase());
    L.push(DOUBLE);
    L.push("");
  }

  /* L'encadré des irrégularités qui ne se rattrapent pas. Il vient AVANT le
     document, jamais après : un lecteur qui trouve le modèle en premier ne
     lit pas l'avertissement qui le suit. */
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
    L.push("Ce qui est entre crochets vous appartient : ce sont vos choix, ou les");
    L.push("données que l'audit n'a pas reçues. Remplacez chaque crochet ; ne laissez");
    L.push("aucun crochet dans la pièce que vous versez au dossier.");
    L.push("");
    var d = divergenceRubriques();
    if (d) { L.push(d); L.push(""); }
    L.push(TRAIT);
    L.push("");
  }

  function pied(L, articles, note) {
    L.push("");
    L.push(TRAIT);
    L.push("");
    L.push("Fondement — " + articles.join(" · ") + " du code du travail,");
    L.push("lus à la source. Les versions lues sont celles du dépôt de textes du");
    L.push("module (moteur/pse/textes-pse.json), qui porte pour chacune son");
    L.push("identifiant LEGIARTI.");
    if (note) { L.push(""); L.push(note); }
    L.push("");
    L.push("Réserve — ce document ne vaut pas consultation. L'application ne lit ni");
    L.push("votre convention collective ni vos accords, qui peuvent ajouter des");
    L.push("exigences ou fixer d'autres délais. Et elle ne dit pas si votre plan est");
    L.push("suffisant : aucun texte n'en fixe le montant, l'appréciation de sa");
    L.push("proportionnalité aux moyens de l'entreprise, de l'unité économique et");
    L.push("sociale et du groupe appartient à l'autorité administrative, puis au juge");
    L.push("administratif (L. 1233-57-3).");
  }

  /* ── ce que la fiche donne ──────────────────────────────────────────────── */

  function nom(ctx) {
    var p = ctx.profil || {}, f = ctx.fiche || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }
  function ville(ctx) { return cro((ctx.profil || {}).ville, "lieu"); }
  function signataire(ctx) { return cro((ctx.profil || {}).responsable, "Nom et qualité du représentant légal"); }

  function mesures(f) {
    var p = (f || {}).plan || {};
    return Array.isArray(p.mesures) ? p.mesures : [];
  }
  function reunions(f) {
    var r = (f || {}).datesReunionsCSE;
    if (!Array.isArray(r)) return [];
    return r.filter(function (x) { return dISO(x); }).slice().sort();
  }
  function nbLicenciements(f) {
    f = f || {};
    return nbf(f.total30j !== undefined && f.total30j !== null ? f.total30j : f.nbLicenciements);
  }
  function sommeBudgets(f) {
    var s = 0, vu = false;
    mesures(f).forEach(function (m) {
      var b = nbf(m.budget);
      if (b !== null) { s += b; vu = true; }
    });
    return vu ? s : null;
  }
  function voie(f) { return ((f || {}).pse || {}).voie || null; }
  function voieEnClair(f) {
    var v = voie(f);
    return v === "accord" ? "accord collectif majoritaire (validation)"
      : v === "unilateral" ? "document unilatéral de l'employeur (homologation)"
      : "[voie non arrêtée : accord collectif majoritaire ou document unilatéral]";
  }

  /* Le régime, tel que le moteur le rend — jamais recalculé ici. */
  function regime(f) {
    var M = moteur();
    if (!M) return {};
    var r = {};
    try { r.planDu = M.planDu(f || {}); } catch (e) {}
    try { r.accompagnement = M.accompagnement(f || {}); } catch (e) {}
    try { r.instruction = M.instruction(f || {}); } catch (e) {}
    try { r.consultation = M.consultation(f || {}); } catch (e) {}
    try { r.priorite = M.priorite(f || {}); } catch (e) {}
    return r;
  }

  /* Le rappel du régime, en tête de chaque document : de quoi l'employeur
     comprend en trois lignes pourquoi ce document lui est adressé. */
  function rappelRegime(L, ctx) {
    var f = ctx.fiche || {}, r = regime(f);
    L.push("LE DOSSIER, TEL QUE L'AUDIT L'A LU");
    L.push("");
    var eff = nbf(f.effectif), n = nbLicenciements(f);
    L.push("  Entreprise ................ " + nom(ctx));
    L.push("  Effectif .................. " + (eff === null ? "[effectif non renseigné]" : eff + " salariés"));
    L.push("  Licenciements envisagés ... " + (n === null ? "[nombre non renseigné]" : n + " sur une même période de trente jours"));
    L.push("  Voie retenue .............. " + voieEnClair(f));
    if (r.planDu && r.planDu.motif) {
      L.push("");
      L.push("  " + r.planDu.motif);
    }
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  function doc(id, nomDoc, detail, produire) {
    A.ajouter(id, { nom: nomDoc, detail: detail, produire: produire });
  }

  /* ══════════════════════════════════════════════════════════════════════
     LE CONTENU DU PLAN — les sept rubriques de l'article L. 1233-62
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-CON-01",
    "Le tableau des mesures, rubrique par rubrique de l'article L. 1233-62",
    "Les sept rubriques du texte, les mesures que vous avez saisies rattachées " +
    "à chacune, la note motivée pour celles qui restent vides, et le courrier " +
    "de consultation du comité sur le plan complété.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var mes = mesures(f);
      var r = reunions(f);
      var derniere = r.length ? r[r.length - 1] : null;

      L = L.concat(entete(ctx, "Les mesures du plan, rubrique par rubrique de l'article L. 1233-62",
        "article L. 1233-62 du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-62 énonce « des mesures telles que » : la liste des sept",
        "rubriques N'EST PAS LIMITATIVE. Une rubrique vide n'est donc pas, en",
        "elle-même, une non-conformité. Mais l'administration apprécie le plan au",
        "regard de ces rubriques (L. 1233-57-3) : une rubrique laissée vide sans",
        "explication est un motif de refus ordinaire, et le refus renvoie tout le",
        "dossier au point de départ.",
        "",
        "Ce document fait donc deux choses, et deux seulement : il pose vos mesures",
        "en face des rubriques, et il ouvre, pour chaque rubrique vide, la note",
        "motivée qui dira POURQUOI elle est écartée. Un silence n'est ni une mesure",
        "ni un motif.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le texte, et ce que le plan y rattache");

      var vues = {};
      mes.forEach(function (m) {
        var k = String(m.rubrique || "").trim();
        if (!k) return;
        (vues[k] = vues[k] || []).push(m);
      });

      var absentes = [];
      RUBRIQUES.forEach(function (rub) {
        var lignes = vues[rub.marque] || [];
        L.push("── " + rub.marque + " — " + rub.court + " ──");
        L.push("");
        L.push("Texte de l'article : « " + rub.texte + ". »");
        L.push("");
        if (!lignes.length) {
          absentes.push(rub);
          L.push("  AUCUNE MESURE RATTACHÉE.");
          L.push("");
          L.push("  Deux issues, et deux seulement :");
          L.push("  — une mesure y est rattachée : [intitulé de la mesure], [nombre de");
          L.push("    bénéficiaires], [budget], [durée d'ouverture de la mesure] ;");
          L.push("  — ou la rubrique est écartée, et le motif est écrit ci-dessous en III.");
        } else {
          var t = [];
          lignes.forEach(function (m) {
            t.push([
              cro(m.intitule, "intitulé à compléter"),
              nbf(m.beneficiaires) === null ? "[bénéficiaires]" : nbf(m.beneficiaires),
              eur(nbf(m.budget), "budget"),
              cro(m.duree, "durée"),
            ]);
          });
          tableau(L, ["Mesure", "Bénéf.", "Budget", "Durée"], t);
        }
        L.push("");
      });

      /* Les mesures rattachées à rien : elles existent, l'article ne les
         interdit pas, mais elles ne doivent pas se perdre dans le tableau. */
      var horsRubrique = mes.filter(function (m) {
        var k = String(m.rubrique || "").trim();
        return !k || RUBRIQUES.every(function (r2) { return r2.marque !== k; });
      });
      if (horsRubrique.length) {
        L.push("── Mesures rattachées à aucune des sept rubriques ──");
        L.push("");
        L.push("La liste de l'article n'est pas limitative : ces mesures ont leur place");
        L.push("dans le plan. Elles ne dispensent pas d'examiner les rubriques vides.");
        L.push("");
        tableau(L, ["Mesure", "Rubrique déclarée", "Bénéf.", "Budget"],
          horsRubrique.map(function (m) {
            return [cro(m.intitule, "intitulé"), m.rubrique || "[aucune]",
              nbf(m.beneficiaires) === null ? "[—]" : nbf(m.beneficiaires), eur(nbf(m.budget), "budget")];
          }));
        L.push("");
      }

      titre(L, "II. Le relevé");

      L.push("  Rubriques de l'article ................ " + RUBRIQUES.length);
      L.push("  Rubriques portant au moins une mesure .. " + (RUBRIQUES.length - absentes.length));
      L.push("  Rubriques sans aucune mesure .......... " + absentes.length +
        (absentes.length ? " (" + absentes.map(function (x) { return x.marque; }).join(", ") + ")" : ""));
      L.push("  Mesures saisies ....................... " + mes.length);
      var s = sommeBudgets(f);
      L.push("  Somme des budgets de mesures .......... " + eur(s, "à chiffrer"));
      L.push("");

      titre(L, "III. La note motivée des rubriques écartées");

      if (!absentes.length) {
        L.push("Aucune rubrique n'est vide : cette partie est sans objet et peut être");
        L.push("supprimée du document que vous versez au dossier.");
        L.push("");
      } else {
        L.push("Cette note se verse au dossier de demande. Elle n'a pas à être longue :");
        L.push("elle doit dire pourquoi la rubrique ne peut pas recevoir de mesure dans");
        L.push("cette entreprise, et sur quoi ce constat repose.");
        L.push("");
        absentes.forEach(function (rub) {
          L.push("Rubrique " + rub.marque + " — " + rub.court);
          L.push("  Motif de l'écartement : [écrire ici pourquoi cette rubrique ne reçoit");
          L.push("  aucune mesure — absence de poste disponible, absence d'activité");
          L.push("  transférable, absence d'heures supplémentaires régulières, etc.]");
          L.push("  Éléments qui l'établissent : [pièce, date, auteur]");
          L.push("");
        });
      }

      titre(L, "IV. Le point de reprise de la consultation");

      L.push("Le comité social et économique est consulté sur « les mesures sociales");
      L.push("d'accompagnement prévues par le plan de sauvegarde de l'emploi »");
      L.push("(L. 1233-30, I, 2°). Une mesure ajoutée au plan APRÈS la dernière réunion");
      L.push("n'a donc pas été soumise au comité, et l'administration vérifie la");
      L.push("régularité de la procédure d'information et de consultation (L. 1233-57-3).");
      L.push("");
      if (derniere) {
        L.push("Vos réunions, telles que la fiche les porte : " +
          r.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("La dernière s'est tenue le " + jour(derniere) + ".");
        L.push("");
        L.push("=> Le plan complété n'a donc PAS été soumis au comité dans sa version");
        L.push("   définitive. Convoquez-le sur cette version avant toute saisine de");
        L.push("   l'administration : le courrier ci-dessous est prêt.");
      } else {
        L.push("Aucune date de réunion n'est renseignée. Si la consultation n'a pas");
        L.push("commencé, complétez le plan d'abord : le comité sera saisi d'une version");
        L.push("complète, et il n'y aura pas de réunion à reprendre.");
      }
      L.push("");

      L.push(DOUBLE);
      L.push("COURRIER — CONVOCATION DU COMITÉ SUR LE PLAN COMPLÉTÉ");
      L.push(DOUBLE);
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : réunion du comité sur le plan de sauvegarde de l'emploi complété");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le plan de sauvegarde de l'emploi a été complété sur " +
        (absentes.length ? "les rubriques suivantes de" : "les rubriques de"));
      L.push("l'article L. 1233-62 : " +
        (absentes.length ? absentes.map(function (x) { return x.marque + " (" + x.court.toLowerCase() + ")" ; }).join(", ")
                         : "[préciser les rubriques complétées]") + ".");
      L.push("");
      L.push("Le comité social et économique étant consulté sur les mesures sociales");
      L.push("d'accompagnement prévues par le plan (article L. 1233-30, I, 2°), je vous");
      L.push("adresse ci-joint la version complétée et vous convie à en délibérer lors");
      L.push("de la réunion du [DATE DE LA RÉUNION], à [HEURE], à [LIEU].");
      L.push("");
      L.push("Je rappelle que l'employeur met à l'étude les suggestions relatives aux");
      L.push("mesures sociales envisagées et les propositions alternatives que le comité");
      L.push("formule, et qu'il leur donne une réponse motivée (article L. 1233-33).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : plan de sauvegarde de l'emploi complété · tableau des");
      L.push("mesures rubrique par rubrique · note motivée des rubriques écartées");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous complétez le plan et vous écrivez la");
      L.push("note motivée des rubriques écartées.");
      L.push("");
      L.push("Ensuite — vous convoquez le comité sur la version complétée. Le délai de");
      L.push("convocation est celui de votre règlement intérieur de comité ou de vos");
      L.push("usages : l'application ne le lit pas.");
      L.push("");
      L.push("Après l'avis — et seulement après, vous déposez la demande de " +
        (voie(f) === "accord" ? "validation." : voie(f) === "unilateral" ? "homologation." : "validation ou d'homologation."));
      var inst = regime(f).instruction;
      if (inst && inst.connu && inst.jours) {
        L.push("L'administration disposera alors de " + inst.jours + " jours à compter de la réception");
        L.push("du dossier complet pour notifier sa décision (L. 1233-57-4).");
      } else {
        L.push("Le délai d'instruction court à compter de la réception du dossier complet :");
        L.push("quinze jours pour la validation d'un accord, vingt et un pour l'homologation");
        L.push("d'un document unilatéral (L. 1233-57-4).");
      }

      pied(L, ["L. 1233-62", "L. 1233-61", "L. 1233-30, I, 2°", "L. 1233-33", "L. 1233-57-3", "L. 1233-57-4"],
        "Le texte des sept rubriques est reproduit mot pour mot depuis l'article\n" +
        "L. 1233-62 dans sa version lue au dépôt (LEGIARTI000036261725).");
      return L.join("\n");
    });

  doc("PSE-CTL-CON-02",
    "Le plan de reclassement interne — postes, catégories, salariés à réinsertion difficile",
    "Le volet que l'article L. 1233-61 met au cœur du plan : le recensement des " +
    "postes, les catégories d'emplois visées, les salariés dont la réinsertion " +
    "est particulièrement difficile, le chiffrage, et le courrier de consultation.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var p = f.plan || {};
      var mes = mesures(f);
      var rec = mes.filter(function (m) { return String(m.rubrique || "").trim() === "1°"; });
      var exposes = Array.isArray(p.salariesExposes) ? p.salariesExposes
        : (typeof p.salariesExposes === "string" && p.salariesExposes.trim() ? [p.salariesExposes] : []);
      var r = reunions(f);
      var n = nbLicenciements(f);

      L = L.concat(entete(ctx, "Plan de reclassement interne",
        "articles L. 1233-61 et L. 1233-62, 1° du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-61 ne fait pas du reclassement une mesure parmi d'autres.",
        "Il écrit que le plan de sauvegarde de l'emploi « intègre un plan de",
        "reclassement visant à faciliter le reclassement sur le territoire national",
        "des salariés dont le licenciement ne pourrait être évité, notamment celui",
        "des salariés âgés ou présentant des caractéristiques sociales ou de",
        "qualification rendant leur réinsertion professionnelle particulièrement",
        "difficile ».",
        "",
        "Un plan sans reclassement interne n'est pas un plan incomplet : c'est un",
        "plan qui n'a pas son objet. Et l'administration vérifie expressément le",
        "respect des articles L. 1233-61 à L. 1233-63 (L. 1233-57-3).",
        "",
        "Ce document est le volet lui-même, à intégrer au plan. Le recensement des",
        "postes en est le préalable : il ne s'improvise pas en séance.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le recensement des postes disponibles");

      L.push("L'article L. 1233-62, 1° vise « des actions en vue du reclassement interne");
      L.push("sur le territoire national, des salariés sur des emplois relevant de la");
      L.push("même catégorie d'emplois ou équivalents à ceux qu'ils occupent ou, sous");
      L.push("réserve de l'accord exprès des salariés concernés, sur des emplois de");
      L.push("catégorie inférieure ».");
      L.push("");
      L.push("Trois colonnes, donc, et la troisième ne se propose pas sans l'accord");
      L.push("exprès du salarié — c'est le texte qui le dit, et cet accord doit être");
      L.push("recueilli par écrit.");
      L.push("");
      L.push("Recensement arrêté au [DATE D'ARRÊTÉ DU RECENSEMENT].");
      L.push("");
      tableau(L,
        ["Poste", "Établissement / lieu", "Catégorie", "Ouvert à", "Date de dispo."],
        [
          ["[intitulé du poste]", "[lieu — sur le territoire national]", "[même catégorie]", "[catégorie(s) d'origine]", "[AAAA-MM-JJ]"],
          ["[intitulé du poste]", "[lieu]", "[emploi équivalent]", "[catégorie(s) d'origine]", "[AAAA-MM-JJ]"],
          ["[intitulé du poste]", "[lieu]", "[catégorie inférieure]", "[accord exprès requis]", "[AAAA-MM-JJ]"],
        ]);
      L.push("");
      L.push("Ajoutez une ligne par poste. Un poste situé hors du territoire national");
      L.push("ne compte pas dans l'obligation : il peut être proposé en sus, sur une");
      L.push("liste séparée (voir le document de ventilation des offres).");
      L.push("");
      L.push("Si l'entreprise appartient à un groupe" +
        (f.groupe === true || f.groupe === "oui" ? " — ce que la fiche indique — " : " ") +
        "le recensement");
      L.push("s'étend aux postes du groupe que l'employeur peut effectivement proposer :");
      L.push("[préciser le périmètre retenu et pourquoi].");
      L.push("");

      titre(L, "II. Les actions de reclassement interne inscrites au plan");

      if (!rec.length) {
        L.push("AUCUNE ACTION DE RECLASSEMENT INTERNE N'EST SAISIE AU PLAN.");
        L.push("");
        L.push("C'est le manquement que ce document vient combler. Écrivez ci-dessous");
        L.push("chaque action, et rattachez-la à la rubrique 1° de l'article L. 1233-62.");
        L.push("");
        tableau(L, ["Action", "Contenu", "Bénéficiaires", "Durée", "Budget"], [
          ["[cellule de reclassement interne]", "[ce qu'elle fait]", "[nombre]", "[durée d'ouverture]", "[montant]"],
          ["[période de recherche]", "[dispense d'activité, moyens]", "[nombre]", "[durée]", "[montant]"],
          ["[priorité sur les postes ouverts]", "[modalités]", "[nombre]", "[durée]", "[montant]"],
        ]);
      } else {
        L.push(rec.length + " action(s) de reclassement interne sont saisies au plan :");
        L.push("");
        tableau(L, ["Action", "Bénéficiaires", "Budget", "Durée"],
          rec.map(function (m) {
            return [cro(m.intitule, "intitulé"),
              nbf(m.beneficiaires) === null ? "[nombre]" : nbf(m.beneficiaires),
              eur(nbf(m.budget), "budget"), cro(m.duree, "durée")];
          }));
        L.push("");
        L.push("Complétez chacune par le nombre de postes qu'elle mobilise et la période");
        L.push("de recherche qu'elle ouvre : une action sans postes n'est qu'une");
        L.push("intention, et l'administration l'appréciera comme telle.");
      }
      L.push("");
      if (n !== null) {
        L.push("Rappel de cohérence : " + n + " licenciements sont envisagés. Le nombre de");
        L.push("bénéficiaires du reclassement interne ne peut pas excéder ce nombre — la");
        L.push("mesure s'adresse aux salariés dont le licenciement est envisagé.");
        L.push("");
      }

      titre(L, "III. Les salariés dont la réinsertion est particulièrement difficile");

      L.push("L'article L. 1233-61 les vise NOMMÉMENT : « notamment celui des salariés");
      L.push("âgés ou présentant des caractéristiques sociales ou de qualification");
      L.push("rendant leur réinsertion professionnelle particulièrement difficile ». Le");
      L.push("plan doit dire qui ils sont et ce qui leur est spécifiquement proposé.");
      L.push("");
      if (exposes.length) {
        L.push("La fiche d'audit porte les catégories suivantes :");
        L.push("");
        exposes.forEach(function (x) {
          L.push("  · " + x);
          L.push("      Ce qui leur est spécifiquement proposé : [mesure dédiée, durée,");
          L.push("      budget, accompagnement renforcé]");
        });
      } else {
        L.push("AUCUNE CATÉGORIE N'EST IDENTIFIÉE DANS LA FICHE. Complétez :");
        L.push("");
        L.push("  · Salariés âgés — [tranche d'âge retenue, effectif concerné]");
        L.push("      Mesure dédiée : [laquelle], durée [—], budget [—]");
        L.push("  · Caractéristiques sociales — [lesquelles, effectif concerné]");
        L.push("      Mesure dédiée : [laquelle], durée [—], budget [—]");
        L.push("  · Qualification — [niveaux concernés, effectif]");
        L.push("      Mesure dédiée : [laquelle], durée [—], budget [—]");
      }
      L.push("");
      L.push("Les listes nominatives ne se versent pas au dossier public : le plan");
      L.push("désigne des CATÉGORIES et des effectifs, la liste nominative reste au");
      L.push("dossier interne.");
      L.push("");

      titre(L, "IV. Le chiffrage du volet");

      L.push("Chaque action porte un budget, un nombre de bénéficiaires et une durée :");
      L.push("l'administration apprécie les mesures d'accompagnement au regard de");
      L.push("l'importance du projet de licenciement et des moyens dont disposent");
      L.push("l'entreprise, l'unité économique et sociale et le groupe (L. 1233-57-3,");
      L.push("1° et 2°). Une action non chiffrée ne pèse rien dans cette appréciation.");
      L.push("");
      L.push("  Nombre de postes recensés ............ [nombre]");
      L.push("  dont sur le territoire national ...... [nombre]");
      L.push("  Bénéficiaires attendus ............... [nombre]");
      L.push("  Durée de la période de recherche ..... [durée, et son point de départ]");
      L.push("  Budget du volet reclassement ......... [montant]");
      L.push("");

      titre(L, "V. Le point de reprise de la consultation");

      L.push("Le comité est consulté sur les mesures sociales d'accompagnement prévues");
      L.push("par le plan (L. 1233-30, I, 2°). Un plan de reclassement écrit après la");
      L.push("dernière réunion n'a pas été soumis au comité.");
      L.push("");
      if (r.length) {
        L.push("Réunions tenues : " + r.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("=> Reprenez la consultation sur ce volet avant toute saisine de");
        L.push("   l'administration. Le courrier ci-dessous est prêt.");
      } else {
        L.push("Aucune réunion n'est renseignée : intégrez ce volet au plan avant la");
        L.push("première réunion, et la question ne se posera pas.");
      }
      L.push("");

      L.push(DOUBLE);
      L.push("COURRIER — CONSULTATION DU COMITÉ SUR LE PLAN DE RECLASSEMENT");
      L.push(DOUBLE);
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : consultation sur le plan de reclassement intégré au plan de");
      L.push("sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le plan de sauvegarde de l'emploi intègre, conformément à l'article");
      L.push("L. 1233-61 du code du travail, un plan de reclassement visant à faciliter");
      L.push("le reclassement sur le territoire national des salariés dont le");
      L.push("licenciement ne pourrait être évité.");
      L.push("");
      L.push("Je vous adresse ci-joint ce volet — recensement des postes, actions de");
      L.push("reclassement interne, catégories de salariés dont la réinsertion est");
      L.push("particulièrement difficile et mesures qui leur sont dédiées, chiffrage —");
      L.push("et vous convie à en délibérer lors de la réunion du [DATE], à [HEURE], à");
      L.push("[LIEU].");
      L.push("");
      L.push("Les suggestions relatives aux mesures sociales envisagées et les");
      L.push("propositions alternatives que vous formulerez seront mises à l'étude et");
      L.push("recevront une réponse motivée (article L. 1233-33).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : plan de reclassement interne · liste des postes recensés");
      L.push("arrêtée au [DATE] · chiffrage du volet");

      pied(L, ["L. 1233-61", "L. 1233-62, 1°", "L. 1233-30, I, 2°", "L. 1233-33", "L. 1233-57-3"]);
      return L.join("\n");
    });

  doc("PSE-CTL-CON-03",
    "La ventilation des offres de reclassement — territoire national et hors territoire",
    "Deux colonnes séparées, le recalcul de l'obligation sur la seule colonne " +
    "nationale, et la note qui explique pourquoi les offres étrangères s'ajoutent " +
    "sans jamais remplacer.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var mes = mesures(f);
      var rec = mes.filter(function (m) { return String(m.rubrique || "").trim() === "1°"; });
      var suspectes = mes.filter(function (m) {
        return /étranger|hors de France|international|filiale étrangère/i
          .test(String(m.intitule || "") + " " + String(m.detail || ""));
      });

      L = L.concat(entete(ctx, "Ventilation des offres de reclassement",
        "articles L. 1233-61 et L. 1233-62, 1° du code du travail"));

      modeEmploi(L, [
        "Le plan de reclassement de l'article L. 1233-61 vise le reclassement « sur",
        "le territoire national ». L'article L. 1233-62, 1° vise les actions de",
        "reclassement interne « sur le territoire national ». Les deux textes le",
        "disent.",
        "",
        "Conséquence, et elle est simple : une offre située hors de France NE COMPTE",
        "PAS dans l'obligation. Rien n'interdit de la proposer — elle s'ajoute — mais",
        "elle ne remplace pas une offre nationale. Un plan qui la compte affiche un",
        "volume de reclassement qu'il n'a pas, et l'écart se voit dès l'instruction.",
        "",
        "Ce document sépare les deux colonnes et recalcule l'obligation sur la",
        "première. C'est un travail de tri sur des mesures déjà écrites : il ne",
        "demande pas de rouvrir le plan.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Ce que l'audit a repéré");

      if (suspectes.length) {
        L.push(suspectes.length + " mesure(s) paraissent porter sur des emplois situés hors du");
        L.push("territoire national, d'après leur intitulé :");
        L.push("");
        tableau(L, ["Mesure", "Rubrique", "Bénéficiaires", "Budget"],
          suspectes.map(function (m) {
            return [cro(m.intitule, "intitulé"), m.rubrique || "[—]",
              nbf(m.beneficiaires) === null ? "[—]" : nbf(m.beneficiaires), eur(nbf(m.budget), "budget")];
          }));
        L.push("");
        L.push("Le repérage se fait sur les mots de l'intitulé : il peut se tromper dans");
        L.push("les deux sens. C'est la localisation réelle des emplois qui décide, et");
        L.push("c'est vous qui la connaissez.");
      } else {
        L.push("Aucune mesure ne paraît, à son intitulé, porter hors du territoire");
        L.push("national. Le repérage se fait sur les mots : il ne voit pas une offre");
        L.push("étrangère décrite sans le dire. Le tableau ci-dessous reste donc à");
        L.push("remplir mesure par mesure.");
      }
      L.push("");

      titre(L, "II. La ventilation, mesure par mesure");

      var lignes = (rec.length ? rec : mes).map(function (m) {
        return [cro(m.intitule, "intitulé"),
          "[lieu(x) des emplois visés]", "[oui / non]",
          nbf(m.beneficiaires) === null ? "[—]" : nbf(m.beneficiaires),
          eur(nbf(m.budget), "budget")];
      });
      if (!lignes.length)
        lignes = [["[intitulé de la mesure]", "[lieu des emplois]", "[oui / non]", "[nombre]", "[montant]"]];
      tableau(L, ["Mesure de reclassement", "Localisation des emplois", "France ?", "Bénéf.", "Budget"], lignes);
      L.push("");
      L.push("Renseignez la localisation pour chaque ligne. Une mesure qui vise des");
      L.push("emplois des deux côtés se dédouble : une ligne France, une ligne hors");
      L.push("France, avec le nombre de postes et le budget de chacune.");
      L.push("");

      titre(L, "III. Le recalcul de l'obligation");

      L.push("A — Colonne « territoire national » : ce qui compte dans l'obligation");
      L.push("");
      L.push("  Postes de reclassement offerts en France ..... [nombre]");
      L.push("  Bénéficiaires attendus ...................... [nombre]");
      L.push("  Budget correspondant ........................ [montant]");
      L.push("");
      L.push("B — Colonne « hors territoire national » : ce qui s'ajoute, en sus");
      L.push("");
      L.push("  Postes offerts hors de France ............... [nombre]");
      L.push("  Bénéficiaires attendus ...................... [nombre]");
      L.push("  Budget correspondant ........................ [montant]");
      L.push("");
      L.push("C — Ce que le plan affichera");
      L.push("");
      L.push("  Le volume de reclassement au titre de l'obligation est celui de la");
      L.push("  colonne A, et de la colonne A seule. La colonne B est présentée");
      L.push("  séparément, comme une offre supplémentaire.");
      L.push("");
      var s = sommeBudgets(f);
      if (s !== null) {
        L.push("  Pour mémoire, la somme actuelle des budgets de toutes les mesures du");
        L.push("  plan est de " + eur(s) + ". Le retrait des offres étrangères ne");
        L.push("  diminue pas ce total : il déplace une part de l'obligation vers l'offre");
        L.push("  supplémentaire.");
        L.push("");
      }

      titre(L, "IV. Si le retrait vide la rubrique");

      L.push("Si, une fois les offres étrangères mises à part, la rubrique 1° ne porte");
      L.push("plus aucune action, le plan n'a plus de plan de reclassement interne : ce");
      L.push("n'est plus une question de ventilation, c'est le cœur du plan qui manque");
      L.push("(L. 1233-61). Reprenez alors le document « plan de reclassement interne »,");
      L.push("et ne saisissez pas l'administration avant de l'avoir complété et soumis");
      L.push("au comité.");
      L.push("");

      titre(L, "V. La note à verser au dossier");

      L.push("« Les actions de reclassement interne inscrites au plan portent sur des");
      L.push("emplois situés sur le territoire national, conformément aux articles");
      L.push("L. 1233-61 et L. 1233-62, 1° du code du travail. Les offres situées hors");
      L.push("du territoire national, énumérées en annexe [numéro], sont proposées en");
      L.push("sus ; elles ne sont pas comptées au titre de l'obligation de reclassement");
      L.push("interne. »");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(ctx.aujourdhui) + ".");
      L.push("");
      L.push(signataire(ctx));

      pied(L, ["L. 1233-61", "L. 1233-62, 1°", "L. 1233-57-3"]);
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LE CHIFFRAGE
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-CHF-01",
    "Le tableau de chiffrage des mesures — budget, bénéficiaires, durée",
    "Vos mesures reprises une à une, les trois colonnes que l'administration " +
    "regarde, la base de calcul unitaire de chaque budget, et le report au " +
    "budget du plan.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var mes = mesures(f);
      var incomplets = mes.filter(function (m) {
        return nbf(m.budget) === null || nbf(m.beneficiaires) === null ||
          !String(m.duree == null ? "" : m.duree).trim();
      });
      var r = reunions(f);

      L = L.concat(entete(ctx, "Chiffrage des mesures du plan",
        "article L. 1233-57-3 du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-57-3 énumère les critères au regard desquels",
        "l'administration apprécie le plan : « 1° Les moyens dont disposent",
        "l'entreprise, l'unité économique et sociale et le groupe ; 2° Les mesures",
        "d'accompagnement prévues au regard de l'importance du projet de licenciement ;",
        "3° Les efforts de formation et d'adaptation ».",
        "",
        "Une mesure non chiffrée n'est pas appréciable : elle ne pèse rien dans cette",
        "appréciation, et le plan est jugé sur ce qui reste. Ce n'est pas une",
        "sanction, c'est une conséquence mécanique — on ne pondère pas une intention.",
        "",
        "Trois colonnes, donc, pour chaque mesure : un BUDGET, un nombre de",
        "BÉNÉFICIAIRES, une DURÉE. La durée est celle pendant laquelle la mesure est",
        "ouverte, pas celle d'un entretien.",
        "",
        "Aucun montant n'est proposé ici, et il ne faut en attendre aucun : AUCUN",
        "TEXTE NE FIXE LE MONTANT D'UN PLAN.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. L'état des lieux");

      if (!mes.length) {
        L.push("AUCUNE MESURE N'EST SAISIE. Le tableau ci-dessous est vierge : remplissez");
        L.push("une ligne par mesure du plan.");
      } else {
        L.push("  Mesures au plan ......................... " + mes.length);
        L.push("  Mesures portant les trois éléments ...... " + (mes.length - incomplets.length));
        L.push("  Mesures incomplètes ..................... " + incomplets.length);
        if (incomplets.length) {
          L.push("");
          L.push("  Les mesures à compléter :");
          incomplets.forEach(function (m) {
            var manque = [];
            if (nbf(m.budget) === null) manque.push("budget");
            if (nbf(m.beneficiaires) === null) manque.push("bénéficiaires");
            if (!String(m.duree == null ? "" : m.duree).trim()) manque.push("durée");
            L.push("    · " + cro(m.intitule, "sans intitulé") + " — manque : " + manque.join(", "));
          });
        }
      }
      L.push("");

      titre(L, "II. Le tableau de chiffrage");

      var lignes = mes.map(function (m) {
        return [
          m.rubrique || "[—]",
          cro(m.intitule, "intitulé"),
          nbf(m.beneficiaires) === null ? "[nombre]" : nbf(m.beneficiaires),
          "[coût unitaire]",
          eur(nbf(m.budget), "budget"),
          cro(m.duree, "durée"),
        ];
      });
      if (!lignes.length)
        lignes = [["[1°]", "[intitulé de la mesure]", "[nombre]", "[coût unitaire]", "[budget]", "[durée]"]];
      tableau(L, ["Rubr.", "Mesure", "Bénéf.", "Coût unitaire", "Budget", "Durée"], lignes);
      L.push("");
      var s = sommeBudgets(f);
      L.push("  Somme des budgets renseignés ............ " + eur(s, "à chiffrer"));
      var annonce = nbf((f.plan || {}).budgetTotal);
      L.push("  Budget total annoncé au plan ............ " + eur(annonce, "à renseigner"));
      if (s !== null && annonce !== null) {
        var e = Math.abs(annonce - s);
        L.push("  Écart ................................... " + eur(e) +
          (e === 0 ? "" : " — voir le document de rapprochement du budget"));
      }
      L.push("");

      titre(L, "III. La base de calcul, mesure par mesure");

      L.push("Une enveloppe globale sans base de calcul n'est pas un chiffrage : elle ne");
      L.push("se discute pas, elle ne se vérifie pas, et elle ne convainc personne. Pour");
      L.push("chaque mesure, écrivez le coût unitaire et le nombre de bénéficiaires");
      L.push("attendus, et faites-en découler le budget.");
      L.push("");
      (mes.length ? mes : [{ intitule: null }]).forEach(function (m) {
        L.push("· " + cro(m.intitule, "intitulé de la mesure"));
        L.push("    Coût unitaire ......... [montant par bénéficiaire, ou par action]");
        L.push("    Base retenue .......... [devis, tarif d'organisme, coût constaté,");
        L.push("                            barème interne — et la pièce qui l'établit]");
        L.push("    Bénéficiaires attendus  " +
          (nbf(m.beneficiaires) === null ? "[nombre]" : nbf(m.beneficiaires)));
        L.push("    Budget = unitaire × bénéficiaires : " + eur(nbf(m.budget), "à calculer"));
        L.push("    Période d'ouverture ... " + cro(m.duree, "du [date] au [date]"));
        L.push("");
      });

      titre(L, "IV. Le report au budget du plan");

      L.push("  1. Reportez la somme des budgets de mesures au budget total du plan.");
      L.push("  2. Vérifiez que les deux coïncident : c'est la première vérification");
      L.push("     faite en séance, et un écart nourrit la contestation du chiffrage");
      L.push("     tout entier.");
      L.push("  3. Vérifiez que le nombre de bénéficiaires des mesures individuelles —");
      L.push("     rubriques " + INDIVIDUELLES.join(", ") + " de l'article L. 1233-62 — n'excède pas le nombre");
      L.push("     de licenciements envisagés" +
        (nbLicenciements(f) === null ? "." : ", soit " + nbLicenciements(f) + "."));
      L.push("");

      titre(L, "V. Le moment");

      L.push("Le chiffrage se fait AVANT la saisine de l'administration : c'est sur le");
      L.push("dossier tel qu'il a été déposé qu'elle statue.");
      L.push("");
      if (r.length) {
        L.push("Vos réunions du comité : " + r.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("La dernière s'est tenue le " + jour(r[r.length - 1]) + ". Le plan chiffré");
        L.push("n'ayant pas été présenté dans cette version, soumettez-la au comité avant");
        L.push("de déposer : il est consulté sur les mesures sociales d'accompagnement");
        L.push("prévues par le plan (L. 1233-30, I, 2°).");
      } else {
        L.push("Aucune réunion n'est renseignée : chiffrez le plan avant la première, et");
        L.push("le comité sera saisi d'un plan chiffré.");
      }

      pied(L, ["L. 1233-57-3", "L. 1233-62", "L. 1233-30, I, 2°"]);
      return L.join("\n");
    });

  doc("PSE-CTL-CHF-02",
    "Le rapprochement du budget total et du détail des mesures",
    "L'écart calculé sur vos chiffres, les quatre causes qui l'expliquent " +
    "d'ordinaire, la pièce corrigée qui porte le détail et le total ensemble, " +
    "et le courrier au comité.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var mes = mesures(f);
      var annonce = nbf((f.plan || {}).budgetTotal);
      var somme = sommeBudgets(f);
      var e = (annonce !== null && somme !== null) ? somme - annonce : null;
      var r = reunions(f);

      L = L.concat(entete(ctx, "Rapprochement du budget total et du détail des mesures",
        "article L. 1233-62 du code du travail"));

      modeEmploi(L, [
        "Un plan dont le total ne correspond pas au détail se retourne contre celui",
        "qui le produit. C'est la première vérification faite en séance, elle prend",
        "une minute, et l'écart nourrit ensuite la contestation du chiffrage tout",
        "entier devant l'administration, qui apprécie les mesures d'accompagnement au",
        "regard de l'importance du projet (L. 1233-57-3, 2°).",
        "",
        "Une règle, et elle est plus importante que le reste de ce document : on",
        "corrige LA SOURCE de l'écart, pas le total. Un total ajusté à la main sur un",
        "détail erroné se voit à la ligne suivante.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. L'écart, calculé sur vos chiffres");

      tableau(L, ["", "Montant"], [
        ["Budget total annoncé au plan", eur(annonce, "à renseigner")],
        ["Somme ligne à ligne des budgets de mesures", eur(somme, "à chiffrer")],
        ["Écart", e === null ? "[non calculable]" : (e > 0 ? "+ " : e < 0 ? "− " : "") + eur(Math.abs(e))],
      ]);
      L.push("");
      if (e === null) {
        L.push("L'écart ne peut pas être calculé : le total annoncé ou le détail des");
        L.push("mesures n'est pas renseigné. Remplissez les deux, et reprenez ce");
        L.push("document.");
      } else if (e === 0) {
        L.push("Le total et le détail coïncident exactement. Cette pièce vaut alors");
        L.push("attestation de rapprochement : datez-la, signez-la, versez-la au dossier.");
      } else if (e > 0) {
        L.push("La somme des mesures DÉPASSE le total annoncé de " + eur(e) + ".");
        L.push("Autrement dit, le plan promet plus que son budget n'affiche.");
      } else {
        L.push("Le total annoncé DÉPASSE la somme des mesures de " + eur(-e) + ".");
        L.push("Autrement dit, le plan affiche un budget dont une part n'est rattachée à");
        L.push("aucune mesure — et une part non ventilée ne s'apprécie pas.");
      }
      L.push("");

      titre(L, "II. Le détail, ligne à ligne");

      var lignes = mes.map(function (m) {
        return [m.rubrique || "[—]", cro(m.intitule, "intitulé"), eur(nbf(m.budget), "budget")];
      });
      if (!lignes.length) lignes = [["[1°]", "[intitulé]", "[budget]"]];
      lignes.push(["", "TOTAL DU DÉTAIL", eur(somme, "à chiffrer")]);
      lignes.push(["", "TOTAL ANNONCÉ AU PLAN", eur(annonce, "à renseigner")]);
      tableau(L, ["Rubr.", "Mesure", "Budget"], lignes);
      L.push("");

      titre(L, "III. D'où vient l'écart");

      L.push("Quatre causes couvrent la quasi-totalité des cas. Cochez la vôtre :");
      L.push("");
      L.push("  [ ] Une mesure a été oubliée dans le détail.");
      L.push("      Laquelle : [intitulé] — montant : [—]");
      L.push("  [ ] Une mesure est comptée deux fois.");
      L.push("      Laquelle : [intitulé] — montant compté en double : [—]");
      L.push("  [ ] Une provision figure au total sans être ventilée en mesures.");
      L.push("      Objet de la provision : [—] — montant : [—]");
      L.push("  [ ] Le total a été arrêté avant la dernière version du plan.");
      L.push("      Date du total : [—] — date de la dernière version : [—]");
      L.push("  [ ] Autre : [expliquer]");
      L.push("");
      L.push("Correction retenue : [décrire ce qui a été modifié — le détail ou le");
      L.push("total — et pourquoi c'était celui-là qui était faux].");
      L.push("");

      titre(L, "IV. La pièce corrigée");

      L.push("Le tableau des mesures et le total du plan se republient dans UNE MÊME");
      L.push("PIÈCE. Deux pièces séparées se désynchronisent à la version suivante.");
      L.push("");
      L.push("  Version : [numéro] — arrêtée le [DATE]");
      L.push("  Remplace : la version [numéro] du [DATE]");
      L.push("  Somme des mesures après correction : [montant]");
      L.push("  Budget total du plan après correction : [le même montant]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(ctx.aujourdhui) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      L.push(DOUBLE);
      L.push("COURRIER — PRÉSENTATION DE LA VERSION CORRIGÉE AU COMITÉ");
      L.push(DOUBLE);
      L.push("");
      L.push("À n'adresser que si le plan a déjà été présenté au comité.");
      if (r.length) {
        L.push("Vos réunions : " + r.map(function (x) { return jour(x); }).join(" · ") +
          " — le plan a donc déjà été présenté.");
      } else {
        L.push("Aucune réunion n'est renseignée : si la consultation n'a pas commencé,");
        L.push("ce courrier est sans objet.");
      }
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : version corrigée du chiffrage du plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Un rapprochement entre le budget total annoncé du plan de sauvegarde de");
      L.push("l'emploi et la somme des budgets de mesures a fait apparaître un écart de");
      L.push((e === null ? "[montant]" : eur(Math.abs(e))) + ", dont l'origine est la suivante : [cause retenue].");
      L.push("");
      L.push("Je vous adresse ci-joint la pièce corrigée, qui porte dans un même");
      L.push("document le détail des mesures et le total du plan, et vous convie à en");
      L.push("délibérer lors de la réunion du [DATE], le comité étant consulté sur les");
      L.push("mesures sociales d'accompagnement prévues par le plan (article L. 1233-30,");
      L.push("I, 2°).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : tableau des mesures et budget total du plan, version");
      L.push("corrigée du [DATE]");

      pied(L, ["L. 1233-62", "L. 1233-57-3, 2°", "L. 1233-30, I, 2°"]);
      return L.join("\n");
    });

  doc("PSE-CTL-CAL-03",
    "Les comptes du groupe versés au dossier — bordereau, périmètre et note de moyens",
    "Le bordereau des comptes consolidés, l'identification des trois niveaux que " +
    "l'article énumère, la demande à la société mère, et la note de rapport entre " +
    "le budget du plan et les moyens — calcul de l'employeur, appréciation de " +
    "l'administration.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var p = f.plan || {};
      var annonce = nbf(p.budgetTotal), res = nbf(p.resultatGroupe);
      var pieces = Array.isArray(f.pieces) ? f.pieces : [];
      var comptes = pieces.filter(function (x) {
        return /comptes.?groupe|consolid/i.test(String(x.type || x.nom || ""));
      });

      L = L.concat(entete(ctx, "Comptes du groupe versés au dossier de demande",
        "article L. 1233-57-3, 1° du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-57-3 fait des « moyens dont disposent l'entreprise, l'unité",
        "économique et sociale et le groupe » le PREMIER critère d'appréciation du",
        "plan. Trois niveaux, énumérés par le texte, et le dossier doit dire ce qu'il",
        "en est de chacun.",
        "",
        "À défaut de comptes, l'administration apprécie ces moyens sur ce dont elle",
        "dispose. L'employeur perd alors la main sur ce qui est retenu contre lui,",
        "sans pouvoir le reprocher à personne : rien ne lui interdisait de produire",
        "les pièces.",
        "",
        "Ce document ne juge rien et ne le peut pas. Il verse les pièces, il pose le",
        "rapport entre le budget du plan et ces moyens — le calcul appartient à",
        "l'employeur — et il s'arrête là : l'appréciation appartient à l'autorité",
        "administrative, puis au juge administratif.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le périmètre, niveau par niveau");

      L.push("L'article énumère trois niveaux. Aucun ne se laisse en blanc : si l'un");
      L.push("n'existe pas, le dossier le dit expressément.");
      L.push("");
      L.push("  1. L'ENTREPRISE");
      L.push("     Dénomination ......... " + nom(ctx));
      L.push("     SIRET ................ " + cro((ctx.profil || {}).siret, "SIRET"));
      L.push("     Effectif ............. " +
        (nbf(f.effectif) === null ? "[effectif non renseigné]" : nbf(f.effectif) + " salariés"));
      L.push("     Comptes du dernier exercice clos : [exercice clos le AAAA-MM-JJ]");
      L.push("");
      L.push("  2. L'UNITÉ ÉCONOMIQUE ET SOCIALE");
      L.push("     [ ] Il en existe une : [dénomination, entreprises qui la composent,");
      L.push("         acte ou décision qui la reconnaît et sa date]");
      L.push("     [ ] Il n'en existe pas — mention expresse au dossier.");
      L.push("");
      L.push("  3. LE GROUPE");
      if (f.groupe === true || f.groupe === "oui") {
        L.push("     La fiche indique que l'entreprise appartient à un groupe.");
        L.push("     Société mère ......... [dénomination, siège]");
        L.push("     Effectif du groupe ... " +
          (nbf(f.effectifGroupe) === null ? "[non renseigné]" : nbf(f.effectifGroupe) + " salariés"));
        L.push("     Périmètre de consolidation : [sociétés incluses]");
      } else if (f.groupe === false || f.groupe === "non") {
        L.push("     La fiche indique que l'entreprise n'appartient à aucun groupe.");
        L.push("     Portez-le expressément au dossier : « l'entreprise n'appartient à");
        L.push("     aucun groupe » — un silence se lit comme une omission.");
      } else {
        L.push("     [L'appartenance à un groupe n'est pas renseignée. Renseignez-la :");
        L.push("     elle commande le périmètre d'appréciation des moyens.]");
      }
      L.push("");

      titre(L, "II. Le bordereau des pièces versées");

      var lignes = comptes.map(function (x) {
        return [String(x.type || x.nom || "[pièce]"), jour(x.date, "date non renseignée"), "[exercice]", "[nb pages]"];
      });
      if (!lignes.length) {
        L.push("AUCUNE PIÈCE DE COMPTES N'EST VERSÉE, d'après la fiche d'audit.");
        L.push("");
        lignes = [
          ["Comptes consolidés du groupe", "[date de versement]", "[dernier exercice clos]", "[—]"],
          ["Comptes annuels de l'entreprise", "[date]", "[dernier exercice clos]", "[—]"],
          ["Comptes intermédiaires (le cas échéant)", "[date]", "[période]", "[—]"],
        ];
      } else {
        L.push(comptes.length + " pièce(s) de comptes figurent déjà à la fiche :");
        L.push("");
      }
      tableau(L, ["Pièce", "Versée le", "Exercice", "Pages"], lignes);
      L.push("");
      L.push("Les comptes se joignent à la demande adressée à l'administration ET se");
      L.push("mettent à disposition du comité social et économique dans le cadre de sa");
      L.push("consultation : ce sont deux destinataires, pas un.");
      L.push("");

      titre(L, "III. La note de rapport — le calcul, et rien de plus");

      L.push("  Budget total du plan ................... " + eur(annonce, "à renseigner"));
      L.push("  Résultat consolidé du groupe .......... " + eur(res, "à renseigner"));
      if (annonce !== null && res !== null && res > 0) {
        var part = Math.round((annonce / res) * 1000) / 10;
        L.push("  Rapport du premier au second .......... " + String(part).replace(".", ",") + " %");
      } else {
        L.push("  Rapport du premier au second .......... [à calculer]");
      }
      var n = nbLicenciements(f);
      if (annonce !== null && n) {
        L.push("  Coût par salarié licencié ............. " + eur(Math.round(annonce / n)) +
          " (" + n + " licenciements)");
      } else {
        L.push("  Coût par salarié licencié ............. [à calculer]");
      }
      L.push("");
      L.push("CE QUE CE RAPPORT N'EST PAS. Il n'est pas un verdict, et il ne peut pas");
      L.push("l'être : aucun texte ne fixe le montant d'un plan, et aucun seuil n'existe");
      L.push("au-dessus ou au-dessous duquel un plan serait suffisant. L'article");
      L.push("L. 1233-57-3 confie l'appréciation à l'autorité administrative, puis au");
      L.push("juge administratif. Le chiffre est donné pour être présenté, comparé aux");
      L.push("plans du même secteur et aux précédents de l'entreprise — pas pour");
      L.push("conclure.");
      L.push("");
      L.push("Autres éléments de moyens à présenter, s'ils existent : [trésorerie");
      L.push("disponible, capitaux propres, résultats des trois derniers exercices,");
      L.push("distributions de dividendes, engagements de la société mère].");
      L.push("");

      L.push(DOUBLE);
      L.push("COURRIER — DEMANDE DES COMPTES CONSOLIDÉS À LA SOCIÉTÉ MÈRE");
      L.push(DOUBLE);
      L.push("");
      L.push("À n'utiliser que si les comptes ne sont pas déjà publiés ou disponibles.");
      L.push("Comptez deux à trois semaines : c'est le délai qui commande le dépôt.");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("À l'attention de la direction de [DÉNOMINATION DE LA SOCIÉTÉ MÈRE]");
      L.push("[Adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : communication des comptes consolidés du groupe — procédure de");
      L.push("plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push(nom(ctx) + " conduit une procédure de licenciement collectif pour");
      L.push("motif économique donnant lieu à un plan de sauvegarde de l'emploi.");
      L.push("");
      L.push("L'article L. 1233-57-3 du code du travail fait des moyens dont disposent");
      L.push("l'entreprise, l'unité économique et sociale et le groupe le premier");
      L.push("critère au regard duquel l'autorité administrative apprécie ce plan. Le");
      L.push("dossier de demande doit donc comporter les comptes consolidés du groupe.");
      L.push("");
      L.push("Je vous remercie de bien vouloir me communiquer, avant le [DATE LIMITE] :");
      L.push("  — les comptes consolidés du dernier exercice clos ;");
      L.push("  — les comptes intermédiaires plus récents, s'il en existe ;");
      L.push("  — le périmètre de consolidation à la date de clôture.");
      L.push("");
      L.push("Ces pièces seront jointes à la demande adressée à l'autorité");
      L.push("administrative et mises à la disposition du comité social et économique");
      L.push("dans le cadre de sa consultation.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous demandez les comptes s'ils ne sont");
      L.push("pas disponibles, et vous établissez le bordereau.");
      L.push("");
      L.push("Quelques jours si les comptes sont publiés ; deux à trois semaines s'ils");
      L.push("doivent être obtenus de la société mère.");
      L.push("");
      L.push("AVANT LE DÉPÔT DE LA DEMANDE — les comptes sont au dossier et à la");
      L.push("disposition du comité. Le dépôt sans les comptes n'est pas irrecevable :");
      L.push("il est simplement moins bien défendu, et cela ne se rattrape pas une fois");
      L.push("l'instruction ouverte sur un dossier incomplet.");

      pied(L, ["L. 1233-57-3, 1°", "L. 1233-57-3, 2°"]);
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     L'ACCOMPAGNEMENT INDIVIDUEL
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-ACC-01",
    "Le volet accompagnement individuel — le dispositif que l'effectif commande",
    "Le dispositif dû, calculé sur vos effectifs, le volet du plan réécrit sur " +
    "ce dispositif-là, les conséquences sur le budget et le calendrier, et le " +
    "courrier de consultation du comité.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var acc = regime(f).accompagnement || {};
      var choisi = (f.plan || {}).accompagnement;
      var conge = acc.dispositif === "congé de reclassement";
      var r = reunions(f);

      L = L.concat(entete(ctx, "Volet accompagnement individuel du plan",
        "articles L. 1233-66 et L. 1233-71 du code du travail"));

      modeEmploi(L, [
        "Les deux dispositifs d'accompagnement individuel NE SE CUMULENT PAS et NE SE",
        "CHOISISSENT PAS : l'effectif les commande.",
        "",
        "  — Congé de reclassement, dans les entreprises ou établissements d'au moins",
        "    mille salariés, ainsi que dans les entreprises et groupes que l'article",
        "    vise dès lors qu'ils emploient au total au moins mille salariés",
        "    (L. 1233-71) ;",
        "  — Contrat de sécurisation professionnelle, « dans les entreprises non",
        "    soumises à l'article L. 1233-71 » (L. 1233-66), c'est-à-dire en deçà.",
        "",
        "L'administration s'assure que l'employeur a prévu l'un ou l'autre",
        "(L. 1233-57-3, dernier alinéa). Le mauvais dispositif dans le plan est un",
        "motif de refus, et il ne se corrige pas par une note en séance : le",
        "dispositif change le coût du plan et son calendrier.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le dispositif dû, et le seul");

      L.push("  Effectif de l'entreprise ......... " +
        (nbf(f.effectif) === null ? "[non renseigné]" : nbf(f.effectif) + " salariés"));
      L.push("  Effectif de l'établissement ...... " +
        (nbf(f.effectifEtablissement) === null ? "[non renseigné]" : nbf(f.effectifEtablissement) + " salariés"));
      L.push("  Effectif du groupe ............... " +
        (f.groupe === true || f.groupe === "oui"
          ? (nbf(f.effectifGroupe) === null ? "[non renseigné]" : nbf(f.effectifGroupe) + " salariés")
          : (f.groupe === false || f.groupe === "non" ? "sans objet — pas de groupe" : "[appartenance au groupe non renseignée]")));
      L.push("  Date d'arrêté des effectifs ...... [AAAA-MM-JJ]");
      L.push("");
      if (acc.dispositif) {
        L.push("  DISPOSITIF DÛ : " + acc.dispositif.toUpperCase());
        L.push("");
        L.push("  " + acc.motif);
      } else {
        L.push("  DISPOSITIF DÛ : [indéterminable — aucun effectif n'est renseigné].");
        L.push("  Renseignez au moins l'effectif de l'entreprise : le seuil de mille se");
        L.push("  lit à l'échelle de l'entreprise, de l'établissement, et du groupe");
        L.push("  lorsque l'entreprise en relève.");
      }
      L.push("");
      L.push("  Dispositif actuellement inscrit au plan : " +
        (choisi ? "« " + choisi + " »" : "[non renseigné]"));
      if (acc.dispositif && choisi &&
          String(choisi).toLowerCase().indexOf(acc.dispositif.slice(0, 6).toLowerCase()) < 0) {
        L.push("");
        L.push("  => LES DEUX NE CONCORDENT PAS. C'est ce que ce document vient corriger :");
        L.push("     le volet doit être réécrit sur le dispositif dû, et sur lui seul.");
      }
      L.push("");

      titre(L, "II. Le volet, réécrit sur le dispositif dû");

      if (conge || !acc.dispositif) {
        L.push("── SI LE DISPOSITIF DÛ EST LE CONGÉ DE RECLASSEMENT (L. 1233-71) ──");
        L.push("");
        L.push("Article [n] — Objet");
        L.push("L'employeur propose à chaque salarié dont il envisage de prononcer le");
        L.push("licenciement pour motif économique un congé de reclassement, qui a pour");
        L.push("objet de lui permettre de bénéficier d'actions de formation et des");
        L.push("prestations d'une cellule d'accompagnement des démarches de recherche");
        L.push("d'emploi.");
        L.push("");
        L.push("Article [n+1] — Durée");
        L.push("La durée du congé de reclassement est de [DURÉE EN MOIS]. Elle ne peut");
        L.push("excéder douze mois, pouvant être portés à vingt-quatre mois en cas de");
        L.push("formation de reconversion professionnelle.");
        L.push("");
        L.push("Article [n+2] — Bilan de compétences");
        L.push("Le congé débute, si nécessaire, par un bilan de compétences qui a");
        L.push("vocation à permettre au salarié de définir un projet professionnel et,");
        L.push("le cas échéant, de déterminer les actions de formation nécessaires à son");
        L.push("reclassement. [Préciser l'organisme, la durée et le moment du bilan.]");
        L.push("");
        L.push("Article [n+3] — Actions de formation");
        L.push("Les actions de formation sont mises en œuvre pendant la durée du congé.");
        L.push("[Énumérer les actions prévues, leur organisme, leur durée et leur coût.]");
        L.push("");
        L.push("Article [n+4] — Financement");
        L.push("L'employeur finance l'ensemble de ces actions.");
        L.push("");
        L.push("Article [n+5] — Préavis");
        L.push("Le congé de reclassement est pris pendant le préavis, que le salarié est");
        L.push("dispensé d'exécuter. Lorsque la durée du congé excède celle du préavis,");
        L.push("le terme de ce dernier est reporté jusqu'à la fin du congé. Le montant de");
        L.push("la rémunération qui excède la durée du préavis est égal au montant de");
        L.push("l'allocation de conversion mentionnée au 3° de l'article L. 5123-2");
        L.push("(L. 1233-72).");
        L.push("");
        L.push("Article [n+6] — Cellule d'accompagnement");
        L.push("[Décrire la cellule : composition, lieu, horaires d'ouverture, nombre de");
        L.push("salariés suivis par conseiller, prestations offertes, durée de son");
        L.push("fonctionnement.]");
        L.push("");
      }
      if (!conge || !acc.dispositif) {
        L.push("── SI LE DISPOSITIF DÛ EST LE CONTRAT DE SÉCURISATION PROFESSIONNELLE");
        L.push("   (L. 1233-66) ──");
        L.push("");
        L.push("Article [n] — Objet");
        L.push("Le contrat de sécurisation professionnelle a pour objet l'organisation et");
        L.push("le déroulement d'un parcours de retour à l'emploi, le cas échéant au");
        L.push("moyen d'une reconversion ou d'une création ou reprise d'entreprise. Ce");
        L.push("parcours débute par une phase de prébilan, d'évaluation des compétences");
        L.push("et d'orientation professionnelle en vue de l'élaboration d'un projet");
        L.push("professionnel, lequel tient compte, au plan territorial, de l'évolution");
        L.push("des métiers et de la situation du marché du travail. Il comprend des");
        L.push("mesures d'accompagnement, notamment d'appui au projet professionnel,");
        L.push("ainsi que des périodes de formation et de travail (L. 1233-65).");
        L.push("");
        L.push("Article [n+1] — Proposition");
        L.push("L'employeur propose le bénéfice du contrat de sécurisation");
        L.push("professionnelle à chaque salarié dont il envisage de prononcer le");
        L.push("licenciement pour motif économique. Le licenciement donnant lieu à un");
        L.push("plan de sauvegarde de l'emploi, cette proposition est faite APRÈS la");
        L.push("notification par l'autorité administrative de sa décision de validation");
        L.push("ou d'homologation (L. 1233-66).");
        L.push("");
        L.push("Article [n+2] — Conséquence du défaut de proposition");
        L.push("À défaut de proposition, France Travail propose le contrat au salarié et");
        L.push("l'employeur verse à l'organisme chargé de la gestion du régime");
        L.push("d'assurance chômage une contribution égale à deux mois de salaire brut,");
        L.push("portée à trois mois lorsque l'ancien salarié adhère sur proposition de");
        L.push("cette institution (L. 1233-66). Cette contribution est due par salarié.");
        L.push("");
        L.push("Article [n+3] — Modalités pratiques");
        L.push("[Préciser : qui remet le document, où, contre quelle décharge, quel délai");
        L.push("de réflexion est laissé, à qui la réponse est adressée.]");
        L.push("");
      }

      titre(L, "III. Les conséquences sur le budget et le calendrier");

      L.push("Le dispositif ne change pas seulement un intitulé :");
      L.push("");
      if (conge) {
        L.push("  · Le congé de reclassement est financé en totalité par l'employeur");
        L.push("    (L. 1233-71). Chiffrez : [nombre de bénéficiaires] × [coût mensuel");
        L.push("    unitaire] × [durée en mois] = [budget du volet].");
        L.push("  · Il est pris pendant le préavis, dont le terme est reporté lorsque le");
        L.push("    congé l'excède (L. 1233-72) : le calendrier des ruptures s'en trouve");
        L.push("    déplacé d'autant.");
      } else {
        L.push("  · La proposition du contrat de sécurisation professionnelle intervient");
        L.push("    après la notification de la décision administrative : elle ne peut");
        L.push("    pas être calée sur la dernière réunion du comité.");
        L.push("  · Le défaut de proposition coûte deux mois de salaire brut par salarié,");
        L.push("    trois en cas d'adhésion sur proposition de France Travail. Chiffrez");
        L.push("    ce risque : [nombre de salariés] × [deux mois de salaire brut].");
      }
      L.push("  · Reportez le budget du volet au budget total du plan, et vérifiez que");
      L.push("    la somme des mesures et le total coïncident.");
      L.push("");

      titre(L, "IV. Le point de reprise de la consultation");

      L.push("Le dispositif d'accompagnement individuel fait partie des mesures sociales");
      L.push("d'accompagnement prévues par le plan, sur lesquelles le comité est");
      L.push("consulté (L. 1233-30, I, 2°). Un volet réécrit après la dernière réunion");
      L.push("n'a pas été soumis au comité.");
      L.push("");
      if (r.length) {
        L.push("Réunions tenues : " + r.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("=> Soumettez le plan corrigé au comité AVANT toute saisine de");
        L.push("   l'administration.");
      } else {
        L.push("Aucune réunion n'est renseignée : corrigez le volet avant la première.");
      }
      L.push("");

      L.push(DOUBLE);
      L.push("COURRIER — CONSULTATION DU COMITÉ SUR LE VOLET CORRIGÉ");
      L.push(DOUBLE);
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : volet accompagnement individuel du plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le volet accompagnement individuel du plan de sauvegarde de l'emploi a été");
      L.push("réécrit sur le dispositif que l'effectif de l'entreprise commande, soit");
      L.push(acc.dispositif
        ? "le " + acc.dispositif + " (article " + (acc.article || (conge ? "L. 1233-71" : "L. 1233-66")) + ")."
        : "[le dispositif dû — article L. 1233-66 ou L. 1233-71].");
      L.push("");
      L.push("Les deux dispositifs ne se cumulent pas : l'article L. 1233-66 vise « les");
      L.push("entreprises non soumises à l'article L. 1233-71 ». La correction emporte");
      L.push("des conséquences sur le budget du plan et sur son calendrier, exposées");
      L.push("dans la pièce jointe.");
      L.push("");
      L.push("Le comité étant consulté sur les mesures sociales d'accompagnement");
      L.push("prévues par le plan (article L. 1233-30, I, 2°), je vous convie à");
      L.push("délibérer sur cette version lors de la réunion du [DATE], à [HEURE], à");
      L.push("[LIEU].");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : volet accompagnement individuel corrigé · incidences sur");
      L.push("le budget et le calendrier");

      pied(L, ["L. 1233-66", "L. 1233-71", "L. 1233-72", "L. 1233-65", "L. 1233-57-3", "L. 1233-30, I, 2°"]);
      return L.join("\n");
    });

  doc("PSE-CTL-ACC-02",
    "Le volet congé de reclassement — durée, bilan, formation, financement, préavis",
    "La durée ramenée dans la limite de l'article, ou la formation de reconversion " +
    "qui la justifie versée au dossier ; les clauses que le texte attache au congé, " +
    "et le recalcul du budget.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var p = f.plan || {};
      var d = nbf(p.dureeConge);
      var reconv = p.formationReconversion === true || p.formationReconversion === "oui";
      var max = reconv ? 24 : 12;
      var r = reunions(f);

      L = L.concat(entete(ctx, "Volet congé de reclassement",
        "articles L. 1233-71 et L. 1233-72 du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-71 plafonne la durée : « La durée du congé de reclassement",
        "ne peut excéder douze mois, pouvant être portés à vingt-quatre mois en cas de",
        "formation de reconversion professionnelle. »",
        "",
        "C'est la formation de reconversion, et elle seule, qui porte le plafond de",
        "douze à vingt-quatre mois. Une durée annoncée hors de cette limite, sans la",
        "formation qui la justifie, est une stipulation que le plan ne peut pas tenir.",
        "",
        "Deux issues, donc, et le choix vous appartient : ramener la durée dans la",
        "limite, ou décrire au dossier la formation de reconversion qui la porte.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. La durée, telle qu'elle est écrite au plan");

      L.push("  Durée retenue au plan .................. " +
        (d === null ? "[non renseignée]" : d + " mois"));
      L.push("  Formation de reconversion prévue ....... " +
        (p.formationReconversion === undefined || p.formationReconversion === null || p.formationReconversion === ""
          ? "[non renseigné]" : (reconv ? "oui" : "non")));
      L.push("  Plafond applicable ..................... " + max + " mois" +
        (reconv ? " (formation de reconversion prévue)" : " (à défaut de formation de reconversion)"));
      L.push("");
      if (d === null) {
        L.push("La durée n'est pas renseignée : écrivez-la au plan. Une durée non écrite");
        L.push("n'est pas une durée libre, c'est une clause manquante.");
      } else if (d > max) {
        L.push("  => LA DURÉE EXCÈDE LE PLAFOND de " + (d - max) + " mois.");
        L.push("");
        L.push("  Deux issues, et deux seulement :");
        L.push("");
        L.push("  [ ] La formation de reconversion professionnelle existe. Décrivez-la en");
        L.push("      partie II : c'est elle qui porte le plafond à vingt-quatre mois.");
        if (!reconv) {
          L.push("      La fiche ne la mentionne pas : elle est donc à verser au dossier.");
        }
        L.push("  [ ] Elle n'existe pas. Ramenez la durée à " + (reconv ? "vingt-quatre" : "douze") + " mois au plus, et");
        L.push("      recalculez le budget du volet en partie IV.");
      } else {
        L.push("  La durée est dans la limite de l'article. Les clauses des parties II à");
        L.push("  V restent à vérifier : le plafond n'est pas la seule exigence du texte.");
      }
      L.push("");

      titre(L, "II. La formation de reconversion professionnelle");

      L.push("À remplir si la durée dépasse douze mois. Sans cette description, la durée");
      L.push("retenue n'a pas de fondement au dossier.");
      L.push("");
      L.push("  Nature de la formation ................ [intitulé, niveau visé]");
      L.push("  Organisme .............................. [dénomination, agrément]");
      L.push("  Durée ................................. [heures, et période]");
      L.push("  Coût unitaire .......................... [montant par salarié]");
      L.push("  Nombre de bénéficiaires attendus ...... [nombre]");
      L.push("  Coût total ............................. [montant]");
      L.push("  Lien avec la durée du congé ........... [en quoi cette formation");
      L.push("                                          justifie la durée retenue]");
      L.push("");

      titre(L, "III. Les clauses que le texte attache au congé");

      L.push("Article [n] — Bilan de compétences");
      L.push("Le congé de reclassement débute, si nécessaire, par un bilan de");
      L.push("compétences qui a vocation à permettre au salarié de définir un projet");
      L.push("professionnel et, le cas échéant, de déterminer les actions de formation");
      L.push("nécessaires à son reclassement (L. 1233-71).");
      L.push("[Préciser : organisme, durée, moment.]");
      L.push("");
      L.push("Article [n+1] — Actions de formation");
      L.push("Les actions de formation nécessaires au reclassement sont mises en œuvre");
      L.push("pendant la durée du congé (L. 1233-71).");
      L.push("[Énumérer les actions, leur organisme, leur durée, leur coût.]");
      L.push("");
      L.push("Article [n+2] — Financement");
      L.push("L'employeur finance l'ensemble de ces actions (L. 1233-71).");
      L.push("");
      L.push("Article [n+3] — Cellule d'accompagnement");
      L.push("Le congé permet au salarié de bénéficier des prestations d'une cellule");
      L.push("d'accompagnement des démarches de recherche d'emploi (L. 1233-71).");
      L.push("[Composition, lieu, horaires, prestations, durée de fonctionnement.]");
      L.push("");
      L.push("Article [n+4] — Préavis");
      L.push("Le congé de reclassement est pris pendant le préavis, que le salarié est");
      L.push("dispensé d'exécuter. Lorsque la durée du congé de reclassement excède la");
      L.push("durée du préavis, le terme de ce dernier est reporté jusqu'à la fin du");
      L.push("congé de reclassement. Le montant de la rémunération qui excède la durée");
      L.push("du préavis est égal au montant de l'allocation de conversion mentionnée au");
      L.push("3° de l'article L. 5123-2 (L. 1233-72).");
      L.push("");
      L.push("Cette clause n'est pas décorative : elle déplace la date de rupture des");
      L.push("contrats, et donc le point de départ de la priorité de réembauche.");
      L.push("");

      titre(L, "IV. Le recalcul du budget du volet");

      L.push("  Nombre de bénéficiaires ............... [nombre]");
      L.push("  Durée retenue après correction ........ [mois, dans la limite de " + max + "]");
      L.push("  Coût mensuel unitaire ................. [montant]");
      L.push("  Coût de la cellule d'accompagnement ... [montant]");
      L.push("  Coût des actions de formation ......... [montant]");
      L.push("  BUDGET DU VOLET ....................... [montant]");
      L.push("");
      var s = sommeBudgets(f), annonce = nbf(p.budgetTotal);
      if (s !== null || annonce !== null) {
        L.push("  Pour mémoire : somme actuelle des mesures " + eur(s, "—") +
          ", total annoncé " + eur(annonce, "—") + ".");
        L.push("  Toute correction de durée se reporte dans ces deux chiffres, et ils");
        L.push("  doivent continuer de coïncider.");
        L.push("");
      }

      titre(L, "V. Le moment");

      L.push("La version corrigée se soumet au comité avant la saisine de");
      L.push("l'administration : il est consulté sur les mesures sociales");
      L.push("d'accompagnement prévues par le plan (L. 1233-30, I, 2°), et");
      L.push("l'administration vérifie le respect des articles L. 1233-61 à L. 1233-63");
      L.push("comme la mise en place du congé de reclassement (L. 1233-57-3).");
      L.push("");
      if (r.length) {
        L.push("Réunions tenues : " + r.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("La version corrigée n'a donc pas été soumise au comité : convoquez-le.");
      } else {
        L.push("Aucune réunion n'est renseignée.");
      }
      L.push("");
      L.push("Délai à prévoir : une semaine si la formation de reconversion existe et");
      L.push("n'est que non documentée ; trois à quatre semaines s'il faut réécrire le");
      L.push("parcours de formation.");

      pied(L, ["L. 1233-71", "L. 1233-72", "L. 1233-57-3", "L. 1233-30, I, 2°"]);
      return L.join("\n");
    });

  doc("PSE-CTL-ACC-03",
    "La proposition du contrat de sécurisation professionnelle, et son constat de date",
    "Le document de proposition, la décharge datée qui seule le prouve, le tableau " +
    "nominatif — et, en tête, le constat de ce qu'une proposition faite trop tôt " +
    "ne se rétrodate pas.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var p = f.plan || {};
      var prop = p.dateProposition, dec = (f.pse || {}).dateDecisionAdmin;
      var duPlan = (regime(f).planDu || {}).du === true;
      var tropTot = duPlan && prop && dec ? avant(prop, dec) : null;

      L = L.concat(entete(ctx, "Proposition du contrat de sécurisation professionnelle",
        "article L. 1233-66 du code du travail"));

      if (tropTot) {
        irrattrapable(L, [
          "La proposition a été faite le " + jour(prop) + ", la décision administrative",
          "a été notifiée le " + jour(dec) + " : la proposition est ANTÉRIEURE à la",
          "décision.",
          "",
          "Or l'article L. 1233-66 est explicite : « Lorsque le licenciement pour motif",
          "économique donne lieu à un plan de sauvegarde de l'emploi dans les conditions",
          "prévues aux articles L. 1233-24-2 et L. 1233-24-4, cette proposition est",
          "faite après la notification par l'autorité administrative de sa décision de",
          "validation ou d'homologation prévue à l'article L. 1233-57-4. »",
          "",
          "Une proposition faite avant cette notification n'est pas celle que le texte",
          "prévoit. Et une date de remise ne se rétrodate pas : c'est la décharge",
          "signée par le salarié qui porte la date, et elle porte celle-là.",
        ], "La proposition est à REFAIRE, après la notification de la décision — et " +
           "les deux propositions, l'ancienne et la nouvelle, restent au dossier avec " +
           "leurs dates réelles.");
      }

      modeEmploi(L, [
        "Ce document se remet à CHAQUE salarié dont le licenciement est envisagé,",
        "contre décharge datée. C'est la décharge qui prouvera la proposition, jamais",
        "le courrier type : un modèle dans un classeur n'établit rien.",
        "",
        "Ce que coûte le défaut de proposition, et le texte le chiffre lui-même : à",
        "défaut de proposition, France Travail propose le contrat au salarié, et",
        "l'employeur verse à l'organisme chargé de la gestion du régime d'assurance",
        "chômage « une contribution égale à deux mois de salaire brut, portée à trois",
        "mois lorsque son ancien salarié adhère au contrat de sécurisation",
        "professionnelle sur proposition de » France Travail (L. 1233-66). Par",
        "salarié. Et elle se recouvre comme les contributions d'assurance chômage.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le moment de la proposition");

      L.push("  Un plan de sauvegarde de l'emploi est-il dû ? ... " +
        (duPlan ? "oui" : ((regime(f).planDu || {}).du === false ? "non" : "[indéterminé]")));
      L.push("  Date de la décision administrative ............. " + jour(dec, "non renseignée"));
      L.push("  Date de proposition portée à la fiche .......... " + jour(prop, "non renseignée"));
      L.push("");
      if (duPlan) {
        L.push("Un plan étant dû, la proposition se fait APRÈS la notification par");
        L.push("l'autorité administrative de sa décision de validation ou d'homologation");
        L.push("(L. 1233-66). Ce n'est pas l'ordre habituel — hors plan, la proposition se");
        L.push("fait lors de l'entretien préalable ou à l'issue de la dernière réunion des");
        L.push("représentants du personnel —, et c'est précisément là que l'erreur se");
        L.push("commet.");
        L.push("");
        if (dec) {
          L.push("  => Première date possible de remise : " + jour(dec) + " (jour de la");
          L.push("     notification de la décision) ou après.");
          var lim = plusJours(dec, 1);
          if (lim) L.push("     En pratique, prévoyez la remise à partir du " + jour(lim) + ".");
        } else {
          L.push("  => La date de la décision n'est pas renseignée : elle commande tout ce");
          L.push("     calendrier. Renseignez-la avant de remettre quoi que ce soit.");
        }
      } else if ((regime(f).planDu || {}).du === false) {
        L.push("Aucun plan n'est dû : la proposition se fait lors de l'entretien préalable");
        L.push("ou à l'issue de la dernière réunion des représentants du personnel");
        L.push("(L. 1233-66, premier alinéa).");
      } else {
        L.push("[L'effectif ou le nombre de licenciements n'est pas renseigné : on ne sait");
        L.push("pas si un plan est dû, et donc pas à quel moment la proposition se fait.]");
      }
      L.push("");
      L.push("L'ordre des actes, quand un plan est dû :");
      L.push("  1. notification de la décision de validation ou d'homologation ;");
      L.push("  2. proposition du contrat de sécurisation professionnelle, contre");
      L.push("     décharge datée ;");
      L.push("  3. notification des licenciements — que l'article L. 1233-39 place lui");
      L.push("     aussi après la décision, à peine de nullité de la rupture.");
      L.push("");

      titre(L, "II. Le document de proposition, à remettre à chaque salarié");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("À l'attention de [NOM ET PRÉNOM DU SALARIÉ]");
      L.push("[Emploi occupé] — [matricule]");
      L.push("");
      L.push(ville(ctx) + ", le " + (dec ? "[DATE DE REMISE, postérieure au " + jour(dec) + "]" : "[DATE DE REMISE]"));
      L.push("");
      L.push("Objet : proposition d'un contrat de sécurisation professionnelle");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Votre licenciement pour motif économique est envisagé dans le cadre du");
      L.push("projet de licenciement collectif conduit par " + nom(ctx) + ", donnant");
      L.push("lieu à un plan de sauvegarde de l'emploi.");
      L.push("");
      L.push("L'autorité administrative a notifié le " + jour(dec, "DATE DE LA DÉCISION") +
        " sa décision de");
      L.push("[validation / homologation]. Conformément à l'article L. 1233-66 du code du");
      L.push("travail, je vous propose en conséquence le bénéfice du contrat de");
      L.push("sécurisation professionnelle.");
      L.push("");
      L.push("Ce contrat a pour objet l'organisation et le déroulement d'un parcours de");
      L.push("retour à l'emploi, le cas échéant au moyen d'une reconversion ou d'une");
      L.push("création ou reprise d'entreprise. Ce parcours débute par une phase de");
      L.push("prébilan, d'évaluation des compétences et d'orientation professionnelle en");
      L.push("vue de l'élaboration d'un projet professionnel, lequel tient compte, au");
      L.push("plan territorial, de l'évolution des métiers et de la situation du marché");
      L.push("du travail. Il comprend des mesures d'accompagnement, notamment d'appui au");
      L.push("projet professionnel, ainsi que des périodes de formation et de travail");
      L.push("(article L. 1233-65 du code du travail).");
      L.push("");
      L.push("Vous trouverez ci-joint le document d'information et le bulletin");
      L.push("d'acceptation. Vous disposez pour vous prononcer du délai de réflexion");
      L.push("indiqué sur ces documents ; votre réponse est à adresser à [destinataire,");
      L.push("adresse].");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : document d'information sur le contrat de sécurisation");
      L.push("professionnelle · bulletin d'acceptation");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("DÉCHARGE — à faire signer, et à conserver");
      L.push("");
      L.push("Je soussigné(e) [NOM ET PRÉNOM], reconnais avoir reçu ce jour la");
      L.push("proposition de contrat de sécurisation professionnelle, le document");
      L.push("d'information et le bulletin d'acceptation.");
      L.push("");
      L.push("Fait à [LIEU], le [DATE DE REMISE]        Signature du salarié :");
      L.push("");
      L.push("C'est cette décharge, et elle seule, qui établira la proposition. Sans");
      L.push("elle, la contribution due à l'assurance chômage se discute sans pièce.");
      L.push("");

      titre(L, "III. Le tableau nominatif des propositions");

      tableau(L, ["Salarié", "Emploi", "Remise le", "Décharge", "Réponse le", "Sens"], [
        ["[nom, prénom]", "[emploi]", "[AAAA-MM-JJ]", "[oui/non]", "[AAAA-MM-JJ]", "[adhésion / refus]"],
        ["[nom, prénom]", "[emploi]", "[AAAA-MM-JJ]", "[oui/non]", "[AAAA-MM-JJ]", "[adhésion / refus]"],
      ]);
      L.push("");
      L.push("Une ligne par salarié dont le licenciement est envisagé" +
        (nbLicenciements(f) === null ? "." : ", soit " + nbLicenciements(f) + " lignes."));
      L.push("Toutes les dates de remise sont postérieures à celle de la décision.");
      L.push("");

      if (tropTot) {
        titre(L, "IV. Le constat, pour les propositions déjà faites");

        L.push("Ce constat se verse au dossier tel quel. Il ne s'antidate pas, il ne");
        L.push("s'efface pas, et il vaut mieux qu'il soit écrit par vous que découvert");
        L.push("par un autre.");
        L.push("");
        L.push("« Le " + jour(prop) + ", le contrat de sécurisation professionnelle a été");
        L.push("proposé aux salariés dont le licenciement était envisagé. L'autorité");
        L.push("administrative a notifié sa décision le " + jour(dec) + ", soit");
        L.push("postérieurement. Le licenciement donnant lieu à un plan de sauvegarde de");
        L.push("l'emploi, l'article L. 1233-66 du code du travail place la proposition");
        L.push("après cette notification. La proposition a en conséquence été renouvelée");
        L.push("le [DATE DE LA NOUVELLE REMISE], contre décharge datée, sans qu'aucune");
        L.push("date antérieure ait été modifiée. »");
        L.push("");
        L.push("Fait à " + ville(ctx) + ", le " + leJour(ctx.aujourdhui) + ".");
        L.push("");
        L.push(signataire(ctx));
        L.push("");
        L.push("Arrêtez avec le conseil de l'entreprise la conduite à tenir salarié par");
        L.push("salarié : l'application ne dit pas ce que devient l'adhésion recueillie");
        L.push("sur la première proposition, et elle ne l'inventera pas.");
        L.push("");
      }

      titre(L, "VOTRE CALENDRIER");

      L.push("La proposition est immédiate après la notification de la décision : elle");
      L.push("précède la notification du licenciement.");
      L.push("");
      if (dec) {
        L.push("  " + jour(dec) + " — notification de la décision administrative.");
        L.push("  À partir de cette date — remise du document contre décharge, salarié");
        L.push("  par salarié.");
        L.push("  Ensuite seulement — notification des licenciements par lettre");
        L.push("  recommandée avec avis de réception (L. 1233-39).");
      } else {
        L.push("  [DATE DE LA DÉCISION] — notification de la décision administrative.");
        L.push("  Puis la remise, puis la notification des licenciements.");
      }
      if (f.dateNotification) {
        L.push("");
        L.push("  La fiche porte une notification des licenciements au " +
          jour(f.dateNotification) + " :");
        L.push("  la remise du document doit lui être antérieure, et postérieure à la");
        L.push("  décision.");
      }

      pied(L, ["L. 1233-66", "L. 1233-65", "L. 1233-57-4", "L. 1233-39", "L. 1233-24-2", "L. 1233-24-4"],
        "L'application ne lit pas les textes qui fixent le délai de réflexion du\n" +
        "salarié ni le contenu du document d'information : ils ne sont pas au code du\n" +
        "travail. Le document renvoie donc aux pièces remises, sans en détailler le\n" +
        "contenu.");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA VOIE ET L'INSTRUCTION
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-VOI-01",
    "La note de choix de la voie et le calendrier prévisionnel",
    "La voie arrêtée et écrite au dossier, le courrier informant l'administration " +
    "de l'ouverture d'une négociation, et le calendrier que la voie commande — " +
    "quinze ou vingt et un jours d'instruction.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var v = voie(f);
      var reg = regime(f);
      var inst = reg.instruction || {};
      var cons = reg.consultation || {};
      var r = reunions(f);
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();

      L = L.concat(entete(ctx, "Choix de la voie et calendrier prévisionnel de la procédure",
        "articles L. 1233-24-1, L. 1233-24-4 et L. 1233-57-4 du code du travail"));

      modeEmploi(L, [
        "La voie commande tout le reste : le calendrier, ce que l'administration",
        "contrôle, et le moment où le document est élaboré. Une voie non arrêtée est",
        "un calendrier non arrêté, et la procédure se déroule alors sans échéance",
        "connue.",
        "",
        "  — L'ACCORD COLLECTIF MAJORITAIRE (L. 1233-24-1) détermine le contenu du",
        "    plan ainsi que les modalités de consultation du comité et de mise en",
        "    œuvre des licenciements. Il est signé par une ou plusieurs organisations",
        "    syndicales représentatives ayant recueilli au moins 50 % des suffrages",
        "    exprimés en faveur d'organisations reconnues représentatives au premier",
        "    tour des dernières élections des titulaires au comité, quel que soit le",
        "    nombre de votants, ou par le conseil d'entreprise. Validation en quinze",
        "    jours à compter de la réception de l'accord (L. 1233-57-4).",
        "",
        "  — LE DOCUMENT UNILATÉRAL (L. 1233-24-4) est élaboré par l'employeur APRÈS",
        "    la dernière réunion du comité ; il fixe le contenu du plan et précise les",
        "    éléments prévus aux 1° à 5° de l'article L. 1233-24-2. Homologation en",
        "    vingt et un jours à compter de la réception du document complet",
        "    (L. 1233-57-4).",
        "",
        "Le choix se fait AVANT la première réunion du comité, et il s'écrit.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. La note de choix, à verser au dossier");

      L.push("NOTE — CHOIX DE LA VOIE DE LA PROCÉDURE");
      L.push("");
      L.push("Entreprise : " + nom(ctx));
      L.push("Date de la décision : " + (r.length
        ? "[DATE — elle doit être antérieure au " + jour(r[0]) + ", date de la première réunion]"
        : "[DATE, antérieure à la première réunion du comité]"));
      L.push("Auteur de la décision : " + signataire(ctx));
      L.push("");
      L.push("Voie retenue :");
      if (v === "accord") {
        L.push("  [X] Accord collectif majoritaire — article L. 1233-24-1");
        L.push("  [ ] Document unilatéral de l'employeur — article L. 1233-24-4");
      } else if (v === "unilateral") {
        L.push("  [ ] Accord collectif majoritaire — article L. 1233-24-1");
        L.push("  [X] Document unilatéral de l'employeur — article L. 1233-24-4");
      } else {
        L.push("  [ ] Accord collectif majoritaire — article L. 1233-24-1");
        L.push("  [ ] Document unilatéral de l'employeur — article L. 1233-24-4");
        L.push("  [LA VOIE N'EST PAS ARRÊTÉE : cochez, et datez.]");
      }
      L.push("");
      L.push("Motifs du choix :");
      L.push("  [Écrire ici pourquoi cette voie. Pour l'accord : l'état des relations");
      L.push("  sociales, les organisations représentatives présentes et leur poids au");
      L.push("  premier tour des dernières élections, le calendrier de négociation");
      L.push("  envisageable. Pour le document unilatéral : l'absence d'organisation");
      L.push("  susceptible de porter le total à 50 %, l'échec d'une négociation");
      L.push("  ouverte, ou l'urgence du calendrier.]");
      L.push("");
      L.push("Appréciation de l'atteignabilité d'un accord majoritaire :");
      L.push("  Organisations représentatives : [liste]");
      L.push("  Suffrages recueillis par chacune au premier tour des dernières");
      L.push("  élections des titulaires au comité : [pourcentages]");
      L.push("  Total atteignable : [pourcentage]");
      L.push("  Procès-verbal des élections qui l'établit : [référence, date]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      if (v !== "unilateral") {
        L.push(DOUBLE);
        L.push("COURRIER — INFORMATION DE L'ADMINISTRATION SUR L'OUVERTURE D'UNE NÉGOCIATION");
        L.push(DOUBLE);
        L.push("");
        L.push("À adresser SANS DÉLAI si la voie de l'accord est retenue : le dernier");
        L.push("alinéa de l'article L. 1233-24-1 l'impose — « L'administration est informée");
        L.push("sans délai de l'ouverture d'une négociation en vue de l'accord précité. »");
        L.push("Ce n'est pas une formalité de courtoisie : c'est une obligation du texte,");
        L.push("et elle ne se rattrape pas à la fin.");
        L.push("");
        L.push(nom(ctx));
        L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
        L.push(cro((ctx.profil || {}).siret, "SIRET"));
        L.push("");
        L.push("À l'autorité administrative compétente");
        L.push("[Direction départementale de l'emploi, du travail et des solidarités —");
        L.push("adresse de l'unité compétente]");
        L.push("");
        L.push(ville(ctx) + ", le " + leJour(d0));
        L.push("");
        L.push("Objet : information sur l'ouverture d'une négociation en vue d'un accord");
        L.push("collectif portant sur le contenu du plan de sauvegarde de l'emploi");
        L.push("");
        L.push("Madame, Monsieur,");
        L.push("");
        L.push("Conformément au dernier alinéa de l'article L. 1233-24-1 du code du");
        L.push("travail, je vous informe de l'ouverture, le [DATE D'OUVERTURE], d'une");
        L.push("négociation en vue d'un accord collectif déterminant le contenu du plan");
        L.push("de sauvegarde de l'emploi ainsi que les modalités de consultation du");
        L.push("comité social et économique et de mise en œuvre des licenciements.");
        L.push("");
        L.push("  Entreprise ......................... " + nom(ctx));
        L.push("  Effectif ........................... " +
          (nbf(f.effectif) === null ? "[effectif]" : nbf(f.effectif) + " salariés"));
        L.push("  Licenciements envisagés ............ " +
          (nbLicenciements(f) === null ? "[nombre]" : nbLicenciements(f) +
            " sur une même période de trente jours"));
        L.push("  Organisations invitées ............. [liste des organisations");
        L.push("                                       syndicales représentatives]");
        L.push("  Calendrier prévisionnel ............ [dates des séances]");
        L.push("");
        L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma");
        L.push("considération distinguée.");
        L.push("");
        L.push(signataire(ctx));
        L.push("");
      }

      titre(L, "VOTRE CALENDRIER PRÉVISIONNEL");

      L.push("Les trois dates que la note doit porter, et leurs conséquences.");
      L.push("");
      L.push("1. PREMIÈRE RÉUNION DU COMITÉ ......... " +
        (r.length ? jour(r[0]) : "[DATE]"));
      L.push("   C'est d'elle que court le délai d'avis (L. 1233-30, II) et c'est lors");
      L.push("   de cette réunion que le comité peut décider de recourir à une expertise");
      L.push("   (L. 1233-34).");
      if (cons.connu && cons.mois) {
        L.push("   Délai d'avis applicable : " + cons.mois + " mois — " + cons.tranche + ".");
        if (cons.echeance)
          L.push("   Expiration : " + jour(cons.echeance) + ".");
      } else {
        L.push("   Délai d'avis : deux mois en deçà de cent licenciements, trois de cent");
        L.push("   à moins de deux cent cinquante, quatre à partir de deux cent");
        L.push("   cinquante — sauf délais différents fixés par accord (L. 1233-30, II).");
      }
      L.push("");
      L.push("2. DEUXIÈME RÉUNION AU MOINS .......... " +
        (r.length > 1 ? jour(r[1]) : "[DATE]"));
      L.push("   Le comité tient au moins deux réunions espacées d'au moins quinze");
      L.push("   jours (L. 1233-30, I).");
      if (r.length === 1) {
        var mini = plusJours(r[0], 15);
        if (mini) L.push("   Au plus tôt le " + jour(mini) + ", quinze jours après la première.");
      }
      L.push("");
      L.push("3. DERNIÈRE RÉUNION ................... " +
        (r.length ? jour(r[r.length - 1]) : "[DATE]"));
      if (v === "unilateral" || !v) {
        L.push("   Voie du document unilatéral : le document est élaboré APRÈS cette");
        L.push("   réunion (L. 1233-24-4). Il ne peut donc pas être déposé avant.");
      }
      L.push("");
      L.push("4. DÉPÔT DE LA DEMANDE ................ " +
        ((f.pse || {}).dateDepotAdmin ? jour((f.pse || {}).dateDepotAdmin) : "[DATE]"));
      L.push("   C'est la RÉCEPTION du dossier complet qui fait courir le délai");
      L.push("   d'instruction, pas la date d'envoi : conservez l'accusé de réception.");
      L.push("");
      L.push("5. ÉCHÉANCE D'INSTRUCTION ............. " +
        (inst.echeance ? jour(inst.echeance) : "[DATE]"));
      if (inst.connu && inst.jours) {
        L.push("   " + inst.jours + " jours pour la " + inst.quoi + " (L. 1233-57-4).");
        if (inst.motif) { L.push("   " + inst.motif); }
      } else {
        L.push("   Quinze jours pour la validation d'un accord à compter de la réception");
        L.push("   de l'accord ; vingt et un jours pour l'homologation d'un document");
        L.push("   unilatéral à compter de la réception du document complet");
        L.push("   (L. 1233-57-4). Le silence gardé pendant ce délai vaut acceptation.");
      }
      L.push("");
      L.push("6. NOTIFICATION DES LICENCIEMENTS ..... [après la décision]");
      L.push("   L'employeur ne peut procéder, À PEINE DE NULLITÉ, à la rupture des");
      L.push("   contrats avant la notification de la décision ou l'expiration des");
      L.push("   délais de l'article L. 1233-57-4 (L. 1233-39).");

      pied(L, ["L. 1233-24-1", "L. 1233-24-2", "L. 1233-24-4", "L. 1233-57-4",
               "L. 1233-30", "L. 1233-34", "L. 1233-39", "L. 1233-57-3"]);
      return L.join("\n");
    });

  doc("PSE-CTL-VOI-02",
    "Le relevé des suffrages et l'acte de choix de la voie",
    "Le calcul du total des suffrages signataires, le constat qu'un accord en deçà " +
    "de 50 % n'existe pas comme accord majoritaire, et l'acte qui arrête la suite " +
    "— rouvrir la négociation, ou basculer sur le document unilatéral.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var s = nbf((f.pse || {}).suffrages);
      var v = voie(f);
      var r = reunions(f);
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();

      L = L.concat(entete(ctx, "Relevé des suffrages et acte de choix de la voie",
        "article L. 1233-24-1 du code du travail"));

      if (v === "accord" && s !== null && s < 50) {
        irrattrapable(L, [
          "Les organisations signataires ont recueilli " + String(s).replace(".", ",") + " % des suffrages.",
          "",
          "L'article L. 1233-24-1 subordonne l'accord à la signature « par une ou",
          "plusieurs organisations syndicales représentatives ayant recueilli au moins",
          "50 % des suffrages exprimés en faveur d'organisations reconnues",
          "représentatives au premier tour des dernières élections des titulaires au",
          "comité social et économique, quel que soit le nombre de votants ».",
          "",
          "En deçà de ce seuil, IL N'Y A PAS D'ACCORD au sens du texte. Ce n'est pas un",
          "accord imparfait qu'une signature ultérieure viendrait consolider : c'est un",
          "acte qui n'a pas la qualité que la loi exige. Une demande de validation",
          "porterait alors sur un accord qui n'en est pas un.",
        ], "Deux issues seulement, et l'acte de choix ci-dessous les pose : recueillir " +
           "la signature d'organisations portant le total à 50 % ou plus, ou basculer " +
           "sur le document unilatéral et reprendre la procédure à ce point.");
      }

      modeEmploi(L, [
        "Le calcul se fait sur les SUFFRAGES EXPRIMÉS EN FAVEUR D'ORGANISATIONS",
        "RECONNUES REPRÉSENTATIVES au premier tour des dernières élections des",
        "titulaires au comité — et le nombre de votants est indifférent : le texte le",
        "dit expressément. Un calcul fait sur les inscrits ou sur les votants donne un",
        "autre chiffre, et c'est l'erreur ordinaire.",
        "",
        "Le procès-verbal du premier tour est la pièce qui l'établit. Sans lui, le",
        "pourcentage n'est qu'une affirmation.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le relevé des suffrages du premier tour");

      L.push("Élections des titulaires au comité social et économique");
      L.push("  Date du premier tour ............... [AAAA-MM-JJ]");
      L.push("  Procès-verbal ...................... [référence]");
      L.push("  Suffrages exprimés en faveur d'organisations reconnues");
      L.push("  représentatives .................... [nombre] (dénominateur du calcul)");
      L.push("");
      tableau(L, ["Organisation", "Suffrages", "% des exprimés", "Signataire ?"], [
        ["[organisation]", "[nombre]", "[%]", "[oui / non]"],
        ["[organisation]", "[nombre]", "[%]", "[oui / non]"],
        ["[organisation]", "[nombre]", "[%]", "[oui / non]"],
        ["TOTAL SIGNATAIRES", "[nombre]", s === null ? "[%]" : String(s).replace(".", ",") + " %", ""],
      ]);
      L.push("");
      L.push("  Seuil exigé par l'article L. 1233-24-1 ......... 50 %");
      if (s === null) {
        L.push("  Total signataire .............................. [non renseigné]");
        L.push("  => Renseignez-le : sans lui, on ne sait pas si l'accord existe.");
      } else if (s >= 50) {
        L.push("  Total signataire .............................. " + String(s).replace(".", ",") + " %");
        L.push("  => La condition est remplie. Ce relevé se verse au dossier de demande");
        L.push("     de validation : c'est lui qui l'établira devant l'administration.");
      } else {
        L.push("  Total signataire .............................. " + String(s).replace(".", ",") + " %");
        L.push("  Il manque ..................................... " +
          String(Math.round((50 - s) * 10) / 10).replace(".", ",") + " points");
        L.push("  => La condition n'est pas remplie : voir l'acte de choix ci-dessous.");
      }
      L.push("");
      L.push("Autre voie de signature ouverte par le texte : l'accord peut aussi être");
      L.push("signé par le conseil d'entreprise, dans les conditions prévues à l'article");
      L.push("L. 2321-9 (L. 1233-24-1). L'application ne lit pas cet article : si vous");
      L.push("empruntez cette voie, faites-la vérifier.");
      L.push("");

      titre(L, "II. Les organisations signataires");

      tableau(L, ["Organisation", "Signé le", "Représentant signataire"], [
        ["[organisation]", "[AAAA-MM-JJ]", "[nom, qualité]"],
        ["[organisation]", "[AAAA-MM-JJ]", "[nom, qualité]"],
      ]);
      L.push("");

      titre(L, "III. L'acte de choix de la voie");

      L.push("ACTE — SUITE DONNÉE À LA PROCÉDURE");
      L.push("");
      L.push("Entreprise : " + nom(ctx));
      L.push("Établi le : " + leJour(d0));
      L.push("");
      L.push("Constat :");
      if (s !== null && s < 50) {
        L.push("  Les organisations signataires ont recueilli " + String(s).replace(".", ",") +
          " % des suffrages exprimés");
        L.push("  en faveur d'organisations reconnues représentatives au premier tour des");
        L.push("  dernières élections des titulaires au comité social et économique. Le");
        L.push("  seuil de 50 % fixé par l'article L. 1233-24-1 du code du travail n'est");
        L.push("  pas atteint : l'acte signé n'a pas la qualité d'accord au sens de ce");
        L.push("  texte. Aucune demande de validation n'est déposée sur son fondement.");
      } else {
        L.push("  [Reprendre ici le total des suffrages signataires et conclure : le seuil");
        L.push("  de 50 % de l'article L. 1233-24-1 est atteint / n'est pas atteint.]");
      }
      L.push("");
      L.push("Décision :");
      L.push("  [ ] LA NÉGOCIATION EST ROUVERTE, en vue de recueillir la signature");
      L.push("      d'une ou plusieurs organisations portant le total à 50 % ou plus.");
      L.push("      Organisations sollicitées : [liste]");
      L.push("      Séances prévues : [dates]");
      L.push("      Délai à prévoir : deux à quatre semaines.");
      L.push("");
      L.push("  [ ] LA VOIE DU DOCUMENT UNILATÉRAL EST RETENUE (L. 1233-24-4).");
      L.push("      Le document est élaboré APRÈS la dernière réunion du comité social");
      L.push("      et économique" +
        (r.length ? ", tenue le " + jour(r[r.length - 1]) + "," : ",") + " et il précise les");
      L.push("      éléments prévus aux 1° à 5° de l'article L. 1233-24-2 :");
      L.push("        1° les modalités d'information et de consultation du comité, en");
      L.push("           particulier les conditions dans lesquelles elles peuvent être");
      L.push("           aménagées en cas de projet de transfert d'une ou de plusieurs");
      L.push("           entités économiques prévu à l'article L. 1233-61 ;");
      L.push("        2° la pondération et le périmètre d'application des critères");
      L.push("           d'ordre des licenciements ;");
      L.push("        3° le calendrier des licenciements ;");
      L.push("        4° le nombre de suppressions d'emploi et les catégories");
      L.push("           professionnelles concernées ;");
      L.push("        5° les modalités de mise en œuvre des mesures de formation,");
      L.push("           d'adaptation et de reclassement.");
      L.push("      Délai à prévoir : deux à quatre semaines.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "IV. Le calendrier refait sur la voie retenue");

      L.push("Le délai d'instruction n'est pas le même, et c'est ce qui déplace tout :");
      L.push("");
      L.push("  Validation d'un accord collectif ...... 15 jours à compter de la");
      L.push("                                          réception de l'accord");
      L.push("  Homologation d'un document unilatéral . 21 jours à compter de la");
      L.push("                                          réception du document complet");
      L.push("");
      L.push("(article L. 1233-57-4 ; le silence gardé pendant ce délai vaut décision");
      L.push("d'acceptation.)");
      L.push("");
      L.push("Basculer de l'accord vers le document unilatéral allonge donc");
      L.push("l'instruction de six jours, et impose d'attendre la dernière réunion du");
      L.push("comité pour élaborer le document. Refaites le calendrier sur ces bases.");
      L.push("");
      L.push("Une seule demande est déposée : celle qui correspond à la voie");
      L.push("effectivement retenue, et à elle seule.");

      pied(L, ["L. 1233-24-1", "L. 1233-24-2", "L. 1233-24-4", "L. 1233-57-4"],
        "L'article L. 2321-9, auquel L. 1233-24-1 renvoie pour la signature par le\n" +
        "conseil d'entreprise, n'est pas au dépôt de textes du module : l'application\n" +
        "le cite parce que L. 1233-24-1 le cite, sans en dire le contenu.");
      return L.join("\n");
    });

  doc("PSE-CTL-VOI-03",
    "La transmission de la demande au comité et l'affichage aux salariés",
    "L'échéance d'instruction calculée depuis la réception du dossier, les deux " +
    "transmissions que le silence de l'administration met à votre charge, et l'avis " +
    "d'affichage avec les voies et délais de recours.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var inst = regime(f).instruction || {};
      var pse = f.pse || {};
      var depot = pse.dateDepotAdmin, dec = pse.dateDecisionAdmin;
      var v = voie(f);
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var ech = inst.echeance || null;

      L = L.concat(entete(ctx, "Transmission de la demande et de son accusé de réception, et affichage",
        "article L. 1233-57-4 du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-57-4 organise trois choses, et la troisième est celle qu'on",
        "oublie.",
        "",
        "  1. LE DÉLAI. Quinze jours pour notifier la décision de validation, à",
        "     compter de la réception de l'accord collectif ; vingt et un jours pour",
        "     la décision d'homologation, à compter de la réception du document",
        "     complet. La décision est motivée et notifiée dans les mêmes délais au",
        "     comité social et économique et, si elle porte sur un accord, aux",
        "     organisations syndicales représentatives signataires.",
        "",
        "  2. LE SILENCE. « Le silence gardé par l'autorité administrative pendant les",
        "     délais prévus au premier alinéa vaut décision d'acceptation. » Mais il ne",
        "     dispense de rien : dans ce cas, l'employeur TRANSMET une copie de la",
        "     demande, accompagnée de son accusé de réception par l'administration, au",
        "     comité et, si elle porte sur un accord, aux organisations signataires.",
        "",
        "  3. L'INFORMATION DES SALARIÉS. La décision ou, à défaut, ces documents,",
        "     ainsi que les voies et délais de recours, sont portés à la connaissance",
        "     des salariés par voie d'affichage sur leurs lieux de travail ou par tout",
        "     autre moyen permettant de conférer date certaine à cette information.",
        "",
        "Rien de tout cela ne se présume : ce sont ces actes qui font courir les",
        "recours. Conservez la preuve de la date.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le point de départ, et l'échéance");

      L.push("  Voie retenue ............................ " + voieEnClair(f));
      L.push("  Délai applicable ........................ " +
        (inst.jours ? inst.jours + " jours" : "[15 jours pour la validation, 21 pour l'homologation]"));
      L.push("  Point de départ ......................... la RÉCEPTION par");
      L.push("                                            l'administration du dossier");
      L.push("                                            complet, et non l'envoi");
      L.push("  Date de réception (accusé de réception) . " + jour(depot, "non renseignée"));
      L.push("  Échéance ................................ " + jour(ech, "à calculer"));
      L.push("  Décision notifiée le .................... " + jour(dec, "aucune décision enregistrée"));
      L.push("");
      if (!depot) {
        L.push("SANS L'ACCUSÉ DE RÉCEPTION, RIEN NE SE CALCULE. C'est la première pièce à");
        L.push("retrouver : le délai court de la réception, l'employeur n'a pas la main");
        L.push("sur cette date, et c'est elle qui décidera si le silence a couru jusqu'à");
        L.push("son terme.");
      } else if (ech && !dec) {
        var reste = ecart(iso(d0), ech);
        if (reste !== null && reste > 0) {
          L.push("Le délai court encore : il reste " + reste + " jour(s) au " + leJour(d0) + ".");
          L.push("Aucune décision n'est enregistrée. Si l'échéance du " + jour(ech) + " est");
          L.push("atteinte sans décision, le silence vaudra acceptation et les actes de la");
          L.push("partie II deviendront exigibles.");
        } else {
          L.push("L'ÉCHÉANCE DU " + jour(ech).toUpperCase() + " EST PASSÉE et aucune décision");
          L.push("n'est enregistrée : le silence a valu décision d'acceptation. Les actes de");
          L.push("la partie II sont dus, et ils sont dus maintenant.");
        }
      } else if (ech && dec) {
        var apres = avant(ech, dec);
        if (apres === true) {
          L.push("La décision est datée du " + jour(dec) + ", POSTÉRIEURE à l'échéance du");
          L.push(jour(ech) + ". Le silence ayant valu acceptation à cette échéance, la");
          L.push("décision est intervenue sur une demande déjà acceptée. Vérifiez d'abord la");
          L.push("date de réception du dossier complet, qui seule fait courir le délai : une");
          L.push("erreur d'un jour sur ce point change la conclusion.");
        } else {
          L.push("La décision du " + jour(dec) + " est intervenue dans le délai expirant le");
          L.push(jour(ech) + ". La partie II est alors sans objet : c'est la DÉCISION qui");
          L.push("est portée à la connaissance des salariés (partie III), et non la demande.");
        }
      }
      L.push("");
      L.push("Vérifiez aussi, si une décision a été notifiée :");
      L.push("  [ ] elle est motivée — le texte l'exige ;");
      L.push("  [ ] elle a été notifiée dans les mêmes délais au comité social et");
      L.push("      économique ;");
      L.push("  [ ] et, si elle porte sur un accord collectif, aux organisations");
      L.push("      syndicales représentatives signataires.");
      L.push("");

      titre(L, "II. Si le délai s'est écoulé sans décision — les transmissions dues");

      L.push(DOUBLE);
      L.push("COURRIER 1 — TRANSMISSION AU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push(DOUBLE);
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : transmission de la demande de " +
        (v === "accord" ? "validation" : v === "unilateral" ? "homologation" : "validation ou d'homologation") +
        " et de son accusé de réception");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("La demande de " + (v === "accord" ? "validation de l'accord collectif" :
        v === "unilateral" ? "homologation du document unilatéral" : "validation ou d'homologation") +
        " a été reçue par");
      L.push("l'autorité administrative le " + jour(depot, "DATE DE RÉCEPTION") + ". Le délai de " +
        (inst.jours ? inst.jours : "[15 ou 21]") + " jours prévu");
      L.push("à l'article L. 1233-57-4 du code du travail a expiré le " + jour(ech, "DATE D'ÉCHÉANCE") + " sans");
      L.push("qu'une décision ait été notifiée.");
      L.push("");
      L.push("Le silence gardé par l'autorité administrative pendant ce délai valant");
      L.push("décision d'acceptation, je vous transmets, conformément au même article,");
      L.push("une copie de la demande accompagnée de son accusé de réception par");
      L.push("l'administration.");
      L.push("");
      L.push("Ces documents, ainsi que les voies et délais de recours, sont portés à la");
      L.push("connaissance des salariés par affichage sur les lieux de travail à compter");
      L.push("du [DATE D'AFFICHAGE].");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : copie de la demande · accusé de réception de");
      L.push("l'administration du " + jour(depot, "DATE"));
      L.push("");
      L.push("");
      L.push(DOUBLE);
      L.push("COURRIER 2 — TRANSMISSION AUX ORGANISATIONS SYNDICALES SIGNATAIRES");
      L.push(DOUBLE);
      L.push("");
      if (v === "unilateral") {
        L.push("SANS OBJET dans votre dossier : la voie retenue est celle du document");
        L.push("unilatéral. Le texte ne met cette transmission à la charge de l'employeur");
        L.push("que si la demande porte sur un accord collectif. Supprimez ce courrier.");
      } else {
        L.push("À adresser à CHAQUE organisation syndicale représentative signataire, si");
        L.push("la demande portait sur un accord collectif.");
      }
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("À [ORGANISATION SYNDICALE SIGNATAIRE]");
      L.push("[Adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : transmission de la demande de validation et de son accusé de");
      L.push("réception");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("La demande de validation de l'accord collectif du [DATE DE L'ACCORD]");
      L.push("portant sur le contenu du plan de sauvegarde de l'emploi a été reçue par");
      L.push("l'autorité administrative le " + jour(depot, "DATE DE RÉCEPTION") + ". Le délai de quinze jours");
      L.push("prévu à l'article L. 1233-57-4 du code du travail a expiré le " +
        jour(ech, "DATE") + " sans");
      L.push("qu'une décision ait été notifiée.");
      L.push("");
      L.push("Le silence gardé pendant ce délai valant décision d'acceptation, je vous");
      L.push("transmets, votre organisation étant signataire de l'accord, une copie de la");
      L.push("demande accompagnée de son accusé de réception par l'administration.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : copie de la demande · accusé de réception");
      L.push("");

      titre(L, "III. L'information des salariés — l'avis à afficher");

      L.push("Ce qui est porté à leur connaissance : LA DÉCISION si elle a été notifiée ;");
      L.push("À DÉFAUT, la copie de la demande et son accusé de réception. Et, dans les");
      L.push("deux cas, LES VOIES ET DÉLAIS DE RECOURS.");
      L.push("");
      L.push("Le moyen : affichage sur les lieux de travail, ou tout autre moyen");
      L.push("permettant de conférer DATE CERTAINE à cette information. Conservez la");
      L.push("preuve de cette date : c'est elle qui fera courir les recours.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("AVIS AU PERSONNEL");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("Plan de sauvegarde de l'emploi — " +
        (dec && ech && avant(ech, dec) !== true ? "décision de l'autorité administrative"
                                                : "demande adressée à l'autorité administrative"));
      L.push("");
      if (dec && ech && avant(ech, dec) !== true) {
        L.push("L'autorité administrative a notifié le " + jour(dec) + " sa décision de");
        L.push("[validation / homologation] du " +
          (v === "accord" ? "l'accord collectif" : "document unilatéral") +
          " portant sur le plan de");
        L.push("sauvegarde de l'emploi de " + nom(ctx) + ".");
        L.push("");
        L.push("Cette décision est consultable [lieu, service, horaires] et affichée");
        L.push("ci-joint.");
      } else {
        L.push("La demande de " + (v === "accord" ? "validation de l'accord collectif" :
          v === "unilateral" ? "homologation du document unilatéral" : "validation ou d'homologation") +
          " portant sur le plan");
        L.push("de sauvegarde de l'emploi de " + nom(ctx) + " a été reçue par l'autorité");
        L.push("administrative le " + jour(depot, "DATE DE RÉCEPTION") + ".");
        L.push("");
        L.push("Le délai de " + (inst.jours ? inst.jours : "[15 ou 21]") +
          " jours prévu à l'article L. 1233-57-4 du code du travail");
        L.push("a expiré le " + jour(ech, "DATE D'ÉCHÉANCE") + " sans qu'une décision ait été notifiée. Le");
        L.push("silence gardé par l'autorité administrative pendant ce délai vaut décision");
        L.push("d'acceptation.");
        L.push("");
        L.push("La copie de la demande et son accusé de réception par l'administration");
        L.push("sont affichés ci-joint et consultables [lieu, service, horaires].");
      }
      L.push("");
      L.push("VOIES ET DÉLAIS DE RECOURS");
      L.push("[Reproduire ici les voies et délais de recours applicables. L'application");
      L.push("ne les rédige pas : les articles qui les fixent ne sont pas au dépôt de");
      L.push("textes du module, et une mention de recours inexacte est pire qu'absente.");
      L.push("Reprenez-les de la décision elle-même lorsqu'elle a été notifiée, ou");
      L.push("faites-les vérifier.]");
      L.push("");
      L.push("Affiché le [DATE D'AFFICHAGE], à [LIEUX D'AFFICHAGE].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("PREUVE DE LA DATE CERTAINE — à conserver au dossier");
      L.push("");
      tableau(L, ["Lieu ou moyen", "Date", "Preuve conservée"], [
        ["[panneau d'affichage — site]", "[AAAA-MM-JJ]", "[photographie datée, constat]"],
        ["[intranet / messagerie]", "[AAAA-MM-JJ]", "[accusé, journal d'envoi]"],
        ["[courrier remis en main propre]", "[AAAA-MM-JJ]", "[décharges signées]"],
      ]);

      titre(L, "VOTRE CALENDRIER");

      L.push((depot ? jour(depot) : "[DATE DE RÉCEPTION]") + " — réception du dossier complet par");
      L.push("l'administration : le délai commence.");
      L.push("");
      L.push((ech ? jour(ech) : "[ÉCHÉANCE]") + " — terme du délai de " +
        (inst.jours ? inst.jours : "[15 ou 21]") + " jours. Passé ce terme sans");
      L.push("décision, le silence vaut acceptation.");
      L.push("");
      L.push("Dans les jours qui suivent — transmissions au comité et, s'il y a lieu, aux");
      L.push("organisations signataires ; affichage aux salariés avec les voies et délais");
      L.push("de recours.");
      L.push("");
      L.push("Ensuite seulement — la notification des licenciements, que l'article");
      L.push("L. 1233-39 place après la notification de la décision ou l'expiration des");
      L.push("délais prévus à l'article L. 1233-57-4, à peine de nullité de la rupture.");

      pied(L, ["L. 1233-57-4", "L. 1233-39", "L. 1233-24-1", "L. 1233-24-4"],
        "Les voies et délais de recours ne sont pas rédigés par l'application : les\n" +
        "textes qui les fixent ne sont pas au dépôt du module, et rien n'est écrit ici\n" +
        "qui n'ait été lu à la source.");
      return L.join("\n");
    });

  doc("PSE-CTL-VOI-04",
    "La note de suspension des notifications et le calendrier de notification",
    "Le constat, l'arrêt immédiat de tout envoi programmé, et le calendrier qui " +
    "place la notification après la décision — parce qu'une lettre déjà partie ne " +
    "se régularise pas : le texte frappe la rupture de nullité.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var pse = f.pse || {};
      var dec = pse.dateDecisionAdmin, notif = f.dateNotification;
      var inst = regime(f).instruction || {};
      var ech = inst.echeance || null;
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var tropTot = dec && notif ? !avant(dec, notif) : null;
      var dejaPartie = notif ? avant(notif, iso(d0)) : null;

      L = L.concat(entete(ctx, "Suspension des notifications et calendrier de notification",
        "article L. 1233-39 du code du travail"));

      irrattrapable(L, [
        "L'article L. 1233-39 dispose, pour les entreprises de cinquante salariés ou",
        "plus dont le projet de licenciement concerne dix salariés ou plus dans une",
        "même période de trente jours, que l'employeur notifie le licenciement « après",
        "la notification par l'autorité administrative de la décision de validation",
        "mentionnée à l'article L. 1233-57-2 ou de la décision d'homologation",
        "mentionnée à l'article L. 1233-57-3, ou à l'expiration des délais prévus à",
        "l'article L. 1233-57-4 ».",
        "",
        "Puis il ajoute, et c'est la phrase qui commande tout : « Il ne peut procéder,",
        "à peine de nullité, à la rupture des contrats de travail avant la",
        "notification de cette décision d'homologation ou de validation ou",
        "l'expiration des délais prévus à l'article L. 1233-57-4. »",
        "",
        "LA NULLITÉ N'EST PAS UNE IRRÉGULARITÉ QUE L'ON COUVRE. Elle atteint la",
        "rupture elle-même. Une lettre de licenciement déjà expédiée avant la décision",
        "ne se régularise ni par un courrier rectificatif, ni par une seconde lettre",
        "envoyée au bon moment, ni par l'accord du salarié.",
      ], "Ce qui peut encore l'être : ARRÊTER les envois qui n'ont pas eu lieu. " +
         "Ce qui ne le peut plus : constater, ne pas exécuter la rupture, et arrêter " +
         "avec le conseil de l'entreprise la conduite à tenir salarié par salarié.");

      modeEmploi(L, [
        "Ce document se compose de trois pièces : une note interne d'arrêt immédiat,",
        "à diffuser aujourd'hui ; un constat, si des lettres sont déjà parties ; et un",
        "calendrier de notification calé sur la décision.",
        "",
        "L'ordre des actes n'est pas indifférent : décision d'abord, proposition",
        "d'accompagnement individuel ensuite lorsqu'elle est due après la décision,",
        "notification enfin.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Les deux dates, et leur comparaison");

      L.push("  Décision administrative notifiée le ..... " + jour(dec, "non renseignée"));
      L.push("  Échéance du délai d'instruction ......... " + jour(ech, "à calculer"));
      L.push("  Notification des licenciements .......... " + jour(notif, "non renseignée"));
      L.push("  Aujourd'hui ............................. " + leJour(d0));
      L.push("");
      if (tropTot === true) {
        L.push("  => LA NOTIFICATION N'EST PAS POSTÉRIEURE À LA DÉCISION.");
        L.push("");
        if (dejaPartie) {
          L.push("     Et la date de notification est déjà passée : les lettres ont, selon");
          L.push("     toute vraisemblance, été expédiées. Passez directement à la partie III.");
        } else {
          L.push("     Mais la date de notification n'est pas encore atteinte : l'envoi peut");
          L.push("     encore être arrêté. C'est l'objet de la note de la partie II, et elle");
          L.push("     est à diffuser aujourd'hui.");
        }
      } else if (tropTot === false) {
        L.push("  => L'ordre est respecté : la notification est postérieure à la décision.");
        L.push("     Ce document sert alors de calendrier et de journal de contrôle : la");
        L.push("     comparaison des deux dates sera faite, et elle doit pouvoir être");
        L.push("     établie salarié par salarié (partie IV).");
      } else {
        L.push("  => L'une des deux dates n'est pas renseignée : la comparaison ne peut pas");
        L.push("     être faite. Tant qu'elle ne l'est pas, NE NOTIFIEZ PAS. C'est la seule");
        L.push("     position qui ne coûte rien.");
      }
      L.push("");

      titre(L, "II. La note d'arrêt immédiat — à diffuser aujourd'hui");

      L.push("NOTE INTERNE — SUSPENSION IMMÉDIATE DES NOTIFICATIONS DE LICENCIEMENT");
      L.push("");
      L.push("De : " + signataire(ctx));
      L.push("À : [service du personnel, service courrier, prestataire d'affranchissement,");
      L.push("     toute personne habilitée à expédier les lettres de notification]");
      L.push("Date : " + leJour(d0));
      L.push("");
      L.push("Objet : arrêt de toute notification de licenciement jusqu'à nouvel ordre");
      L.push("");
      L.push("1. Toute notification de licenciement pour motif économique programmée dans");
      L.push("   le cadre du projet en cours est SUSPENDUE à compter de la réception de");
      L.push("   la présente note.");
      L.push("");
      L.push("2. Les lettres déjà préparées sont RETIRÉES du circuit d'envoi. Les remises");
      L.push("   en main propre et les dépôts postaux programmés sont annulés. Le");
      L.push("   prestataire d'affranchissement, s'il y en a un, est prévenu ce jour par");
      L.push("   écrit.");
      L.push("");
      L.push("3. Motif : l'article L. 1233-39 du code du travail interdit à l'employeur");
      L.push("   de procéder, à peine de nullité, à la rupture des contrats de travail");
      L.push("   avant la notification de la décision de validation ou d'homologation ou");
      L.push("   l'expiration des délais prévus à l'article L. 1233-57-4. Le point de");
      L.push("   départ est la DÉCISION ADMINISTRATIVE, et non la fin de la consultation");
      L.push("   du comité.");
      L.push("");
      L.push("4. La reprise des notifications fera l'objet d'une instruction écrite,");
      L.push("   datée, et ne pourra intervenir qu'après " +
        (dec ? "le " + jour(dec) + "." : "la notification de la décision"));
      if (!dec) L.push("   administrative ou l'expiration du délai d'instruction.");
      L.push("");
      L.push("5. Toute lettre déjà expédiée est signalée immédiatement à la direction,");
      L.push("   avec sa date d'expédition et sa preuve de dépôt. Aucune date n'est");
      L.push("   modifiée, aucun courrier rectificatif n'est envoyé sans instruction.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Diffusion et accusés de réception :");
      tableau(L, ["Destinataire", "Reçue le", "Signature"], [
        ["[service]", "[AAAA-MM-JJ]", ""],
        ["[service]", "[AAAA-MM-JJ]", ""],
        ["[prestataire]", "[AAAA-MM-JJ]", ""],
      ]);
      L.push("");

      titre(L, "III. Le constat, pour les lettres déjà expédiées");

      L.push("Ne tentez pas de régulariser par un courrier rectificatif : le texte");
      L.push("frappe la rupture de nullité, et un rectificatif ne défait pas un envoi.");
      L.push("Ce qui se fait : constater, NE PAS EXÉCUTER la rupture, et arrêter la");
      L.push("conduite à tenir salarié par salarié avec le conseil de l'entreprise.");
      L.push("");
      L.push("CONSTAT");
      L.push("");
      L.push("Entreprise : " + nom(ctx));
      L.push("Établi le : " + leJour(d0));
      L.push("");
      L.push("  Décision de validation ou d'homologation : " + jour(dec, "non notifiée à ce jour"));
      L.push("  Expiration du délai d'instruction : " + jour(ech, "non déterminée"));
      L.push("  Lettres de notification expédiées avant cette date : [nombre]");
      L.push("");
      tableau(L, ["Salarié", "Lettre expédiée le", "Preuve de dépôt", "Rupture exécutée ?"], [
        ["[nom, prénom]", "[AAAA-MM-JJ]", "[n° recommandé]", "[non]"],
        ["[nom, prénom]", "[AAAA-MM-JJ]", "[n° recommandé]", "[non]"],
      ]);
      L.push("");
      L.push("Mentions à porter :");
      L.push("  · Aucune date n'a été modifiée ni antidatée.");
      L.push("  · Aucune rupture n'a été exécutée : [préciser, salarié par salarié, ce");
      L.push("    qui a été fait — maintien de la relation de travail, maintien de la");
      L.push("    rémunération, suspension des formalités de fin de contrat].");
      L.push("  · La conduite à tenir est arrêtée avec [conseil de l'entreprise] le");
      L.push("    [DATE].");
      L.push("");
      L.push("L'application s'arrête ici et le dit : elle ne se prononce pas sur le sort");
      L.push("de ces ruptures. Cette question relève du conseil de l'entreprise, sur");
      L.push("pièces, dossier par dossier.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "IV. Le calendrier de notification, après la décision");

      L.push("L'ordre des actes, et il ne s'intervertit pas :");
      L.push("");
      L.push("  1. " + jour(dec, "DATE DE LA DÉCISION") + " — notification par l'autorité");
      L.push("     administrative de sa décision de validation ou d'homologation ;");
      L.push("     à défaut de décision, expiration des délais de l'article L. 1233-57-4");
      L.push("     le " + jour(ech, "DATE D'ÉCHÉANCE") + ".");
      L.push("");
      L.push("  2. Puis, si le contrat de sécurisation professionnelle est le dispositif");
      L.push("     dû : proposition à chaque salarié, contre décharge datée — elle est");
      L.push("     faite après la notification de la décision (L. 1233-66) et précède la");
      L.push("     notification du licenciement.");
      L.push("");
      L.push("  3. Puis seulement : notification des licenciements par lettre");
      L.push("     recommandée avec avis de réception (L. 1233-39).");
      L.push("");
      if (dec) {
        var j1 = plusJours(dec, 1);
        L.push("  Première date d'envoi possible : " + jour(j1) + ", au lendemain de la");
        L.push("  décision. Vous pouvez la placer plus tard ; vous ne pouvez pas la placer");
        L.push("  plus tôt.");
      } else if (ech) {
        var j2 = plusJours(ech, 1);
        L.push("  À défaut de décision notifiée, première date d'envoi possible : " + jour(j2) + ",");
        L.push("  au lendemain de l'expiration du délai d'instruction.");
      } else {
        L.push("  [La date de la décision et l'échéance d'instruction ne sont pas connues :");
        L.push("  la première date d'envoi possible ne peut pas être calculée. Ne notifiez");
        L.push("  pas avant de la connaître.]");
      }
      L.push("");

      titre(L, "V. Le tableau des notifications — à tenir salarié par salarié");

      L.push("C'est la comparaison de deux dates qui sera faite : celle de la décision,");
      L.push("celle de l'envoi. Tenez-la à jour, avec la preuve de dépôt.");
      L.push("");
      tableau(L, ["Salarié", "Décision du", "Lettre expédiée le", "Preuve", "Postérieure ?"], [
        ["[nom, prénom]", jour(dec, "—"), "[AAAA-MM-JJ]", "[n° recommandé]", "[oui]"],
        ["[nom, prénom]", jour(dec, "—"), "[AAAA-MM-JJ]", "[n° recommandé]", "[oui]"],
      ]);
      L.push("");
      L.push("Conservez, pour chaque salarié, la décision et la preuve de dépôt : c'est");
      L.push("sur ces deux pièces que la question se tranchera, et sur aucune autre.");

      pied(L, ["L. 1233-39", "L. 1233-57-4", "L. 1233-66"],
        "L'article L. 1233-57-2, que L. 1233-39 cite pour la décision de validation,\n" +
        "n'est pas au dépôt de textes du module : il n'est mentionné ici que parce que\n" +
        "L. 1233-39 le mentionne, et son contenu n'est pas rapporté.");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LE SUIVI DU PLAN
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-SUI-01",
    "La clause de suivi du plan — commission, périodicité, avis du comité, bilan",
    "Les trois obligations distinctes de l'article L. 1233-63 rédigées en clauses : " +
    "les modalités de suivi, la consultation régulière et détaillée du comité avec " +
    "transmission de son avis, et le bilan que l'administration reçoit.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var s = (f.plan || {}).suivi || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var r = reunions(f);

      L = L.concat(entete(ctx, "Clause de suivi du plan de sauvegarde de l'emploi",
        "article L. 1233-63 du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-63 met TROIS obligations distinctes à la charge de",
        "l'employeur, et les confondre est l'erreur ordinaire :",
        "",
        "  1. « Le plan de sauvegarde de l'emploi détermine les modalités de suivi de",
        "     la mise en œuvre effective des mesures contenues dans le plan de",
        "     reclassement prévu à l'article L. 1233-61. »",
        "  2. « Ce suivi fait l'objet d'une consultation régulière et détaillée du",
        "     comité social et économique dont l'avis est transmis à l'autorité",
        "     administrative. »",
        "  3. « L'autorité administrative est associée au suivi de ces mesures et",
        "     reçoit un bilan, établi par l'employeur, de la mise en œuvre effective",
        "     du plan de sauvegarde de l'emploi. »",
        "",
        "L'administration vérifie le respect des articles L. 1233-61 à L. 1233-63",
        "(L. 1233-57-3) : un plan muet sur son suivi est incomplet au regard du texte,",
        "et le suivi fait partie de ce qu'elle contrôle AVANT de décider.",
        "",
        "Il s'agit d'écrire une clause et un calendrier, non de créer un dispositif :",
        "une semaine suffit.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Ce que le plan porte déjà");

      L.push("  1. Modalités de suivi ................ " +
        (String(s.modalites || "").trim() ? "« " + s.modalites + " »" : "[NON RENSEIGNÉ]"));
      L.push("  2. Consultation du comité ............ " +
        (String(s.consultation || "").trim() ? "« " + s.consultation + " »" : "[NON RENSEIGNÉ]"));
      L.push("  3. Bilan à l'administration .......... " +
        (String(s.bilan || "").trim() ? "« " + s.bilan + " »" : "[NON RENSEIGNÉ]"));
      L.push("");
      L.push("Ce qui est renseigné se reprend dans les clauses ci-dessous, et s'y");
      L.push("précise : « commission trimestrielle » n'est pas encore une clause, c'est");
      L.push("le titre d'une clause à écrire.");
      L.push("");

      titre(L, "II. Les clauses, à intégrer au plan");

      L.push("ARTICLE [n] — MODALITÉS DE SUIVI DE LA MISE EN ŒUVRE EFFECTIVE");
      L.push("");
      L.push("Le présent plan détermine les modalités de suivi de la mise en œuvre");
      L.push("effective des mesures contenues dans le plan de reclassement prévu à");
      L.push("l'article L. 1233-61 du code du travail.");
      L.push("");
      L.push("  Instance de suivi : [commission de suivi / autre instance — préciser].");
      L.push("  Composition : [nombre de représentants de l'employeur, nombre de");
      L.push("  représentants du personnel, mode de désignation, participation de");
      L.push("  l'organisme chargé de l'accompagnement le cas échéant].");
      L.push("  Périodicité des réunions : [mensuelle / trimestrielle / autre] à compter");
      L.push("  de [point de départ : notification de la décision, première rupture…].");
      L.push("  Durée du suivi : [jusqu'à quelle échéance].");
      L.push("  Convocation et documents transmis avant chaque réunion : [délai, pièces].");
      L.push("");
      L.push("  Indicateurs suivis, mesure par mesure :");
      tableau(L, ["Mesure", "Indicateur", "Cible", "Fréquence"], [
        ["[reclassement interne]", "[postes proposés / acceptés]", "[nombre]", "[périodicité]"],
        ["[formation, reconversion]", "[actions engagées / achevées]", "[nombre]", "[périodicité]"],
        ["[création, reprise d'activité]", "[dossiers soutenus]", "[nombre]", "[périodicité]"],
        ["[reclassement externe]", "[retours à l'emploi]", "[nombre]", "[périodicité]"],
      ]);
      L.push("");
      L.push("  Le suivi porte sur la mise en œuvre EFFECTIVE : le nombre d'entretiens");
      L.push("  proposés n'est pas un résultat, le nombre de reclassements réalisés en");
      L.push("  est un.");
      L.push("");
      L.push("ARTICLE [n+1] — CONSULTATION DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Le suivi de la mise en œuvre du plan fait l'objet d'une consultation");
      L.push("régulière et détaillée du comité social et économique, dont l'avis est");
      L.push("transmis à l'autorité administrative (article L. 1233-63).");
      L.push("");
      L.push("  Calendrier des consultations : [dates ou périodicité — le texte les veut");
      L.push("  RÉGULIÈRES, ce qui exclut une consultation unique en fin de plan, et");
      L.push("  DÉTAILLÉES, ce qui exclut une information globale].");
      L.push("  Documents remis au comité avant chaque consultation : [tableau des");
      L.push("  indicateurs, état des mesures engagées, difficultés rencontrées].");
      L.push("  Transmission de l'avis à l'autorité administrative : [par qui, sous quel");
      L.push("  délai après la séance, par quel moyen].");
      L.push("");
      L.push("ARTICLE [n+2] — ASSOCIATION DE L'AUTORITÉ ADMINISTRATIVE ET BILAN");
      L.push("");
      L.push("L'autorité administrative est associée au suivi des mesures et reçoit un");
      L.push("bilan, établi par l'employeur, de la mise en œuvre effective du plan de");
      L.push("sauvegarde de l'emploi (article L. 1233-63).");
      L.push("");
      L.push("  Auteur du bilan : l'employeur — [service ou personne désignée].");
      L.push("  Contenu du bilan : [mesure par mesure, bénéficiaires effectifs, budget");
      L.push("  consommé, résultats obtenus, écarts avec les prévisions du plan et leur");
      L.push("  explication].");
      L.push("  Date de transmission : [DATE], et le cas échéant bilans intermédiaires");
      L.push("  aux dates suivantes : [dates].");
      L.push("  Modalités d'association de l'administration au suivi : [invitation aux");
      L.push("  réunions de la commission, transmission des comptes rendus, points");
      L.push("  d'étape].");
      L.push("");

      titre(L, "III. Le calendrier de suivi");

      L.push("Les dates se calent sur la décision administrative et sur les ruptures :");
      L.push("le suivi commence quand les mesures commencent.");
      L.push("");
      var dec = (f.pse || {}).dateDecisionAdmin;
      var dep = dec || f.dateNotification || (f.plan || {}).dateRupture;
      if (dep) {
        L.push("  Point de départ retenu : " + jour(dep) +
          (dec ? " (décision administrative)" : " (date portée à la fiche)") + ".");
        L.push("");
        var t3 = plusMois(dep, 3), t6 = plusMois(dep, 6), t12 = plusMois(dep, 12);
        L.push("  À titre indicatif, une périodicité trimestrielle donnerait :");
        L.push("    · 1re réunion de suivi ....... " + jour(t3));
        L.push("    · 2e réunion de suivi ........ " + jour(t6));
        L.push("    · Bilan à douze mois ......... " + jour(t12));
        L.push("");
        L.push("  Ces dates sont un exemple de calcul, pas une exigence : aucun texte ne");
        L.push("  fixe la périodicité. Le texte exige qu'elle soit RÉGULIÈRE, et c'est à");
        L.push("  vous de l'arrêter.");
      } else {
        L.push("  [Aucune date de décision, de notification ou de rupture n'est");
        L.push("  renseignée : le calendrier de suivi ne peut pas être calculé. Arrêtez le");
        L.push("  point de départ, et les échéances en découleront.]");
      }
      L.push("");

      titre(L, "IV. Le moment");

      L.push("La clause de suivi se soumet au comité AVEC le reste du plan, puis se");
      L.push("verse au dossier de demande. Le suivi fait partie de ce que");
      L.push("l'administration contrôle avant de décider : une clause ajoutée après le");
      L.push("dépôt ne sera pas dans le dossier sur lequel elle statue.");
      L.push("");
      if (r.length) {
        L.push("Vos réunions : " + r.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("Si la clause est écrite après la dernière, soumettez la version complétée");
        L.push("au comité : il est consulté sur les mesures sociales d'accompagnement");
        L.push("prévues par le plan (L. 1233-30, I, 2°).");
      } else {
        L.push("Aucune réunion n'est renseignée : intégrez la clause au plan avant la");
        L.push("première.");
      }
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      pied(L, ["L. 1233-63", "L. 1233-61", "L. 1233-57-3", "L. 1233-30, I, 2°"]);
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA PRIORITÉ DE RÉEMBAUCHE
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-REM-01",
    "Le registre de la priorité de réembauche et l'information des représentants",
    "Le registre des demandes avec ses échéances calculées, le courrier qui informe " +
    "les élus des postes disponibles — due par elle-même, sans demande d'aucun " +
    "salarié —, la lettre au salarié, et le constat pour les postes déjà pourvus.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var p = f.plan || {};
      var pri = regime(f).priorite || {};
      var dem = Array.isArray(p.demandesReembauche) ? p.demandesReembauche : [];
      var info = p.informationElusPostes;
      var rupture = p.dateRupture || f.dateNotification;
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();

      L = L.concat(entete(ctx, "Priorité de réembauche — registre et information des représentants",
        "article L. 1233-45 du code du travail"));

      irrattrapable(L, [
        "L'article L. 1233-45 met à la charge de l'employeur, à l'égard du salarié qui",
        "a demandé le bénéfice de la priorité, l'information « de tout emploi devenu",
        "disponible et compatible avec sa qualification ».",
        "",
        "UN POSTE DÉJÀ POURVU sans avoir été proposé à un salarié inscrit au registre",
        "ne se rattrape pas : le poste est occupé, et l'information qui n'a pas été",
        "faite ne se fait pas rétroactivement. Aucune inscription tardive au registre,",
        "aucun courrier antidaté ne change cela.",
      ], "Ce qui se fait aujourd'hui, et qui vaut : ouvrir le registre, informer les " +
         "élus SANS ATTENDRE — cette obligation-là ne dépend de la demande d'aucun " +
         "salarié —, et tenir la traçabilité pour tous les postes à venir. Pour les " +
         "postes déjà pourvus, consigner la situation telle qu'elle est (partie V).");

      modeEmploi(L, [
        "Le texte porte DEUX obligations distinctes, et la seconde est celle qu'on",
        "oublie :",
        "",
        "  1. « Le salarié licencié pour motif économique bénéficie d'une priorité de",
        "     réembauche durant un délai d'un an à compter de la date de rupture de son",
        "     contrat s'il en fait la demande au cours de ce même délai. Dans ce cas,",
        "     l'employeur informe le salarié de tout emploi devenu disponible et",
        "     compatible avec sa qualification. »",
        "",
        "  2. « En outre, l'employeur informe les représentants du personnel des postes",
        "     disponibles. » Celle-ci NE DÉPEND D'AUCUNE DEMANDE d'un salarié : elle est",
        "     due par elle-même, et elle est due maintenant.",
        "",
        "Le texte ajoute enfin : « Le salarié ayant acquis une nouvelle qualification",
        "bénéficie également de la priorité de réembauche au titre de celle-ci, s'il en",
        "informe l'employeur. » Le registre doit donc porter une colonne pour cela.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le délai, et son point de départ");

      L.push("  Date de rupture des contrats ........... " + jour(rupture, "non renseignée"));
      if (pri.connu && pri.jusqu) {
        L.push("  Fin du délai d'un an ................... " + jour(pri.jusqu));
        var reste = ecart(iso(d0), pri.jusqu);
        if (reste !== null)
          L.push("  Reste au " + leJour(d0) + " ... " +
            (reste > 0 ? reste + " jour(s)" : "délai expiré depuis " + (-reste) + " jour(s)"));
      } else {
        L.push("  Fin du délai d'un an ................... [à calculer depuis la rupture]");
      }
      L.push("");
      L.push("La priorité court un an à compter de la RUPTURE, et le salarié doit en");
      L.push("faire la demande au cours de ce même délai. Deux conditions de date, donc,");
      L.push("et le registre doit porter les deux : la date de rupture, et la date de la");
      L.push("demande.");
      L.push("");
      L.push("Attention si le dispositif d'accompagnement est le congé de reclassement :");
      L.push("lorsque sa durée excède celle du préavis, le terme du préavis est reporté");
      L.push("jusqu'à la fin du congé (L. 1233-72) — la date de rupture s'en trouve");
      L.push("déplacée, et le point de départ de l'année avec elle.");
      L.push("");

      titre(L, "II. Le registre des demandes de priorité de réembauche");

      L.push("Une ligne par salarié licencié dont la rupture remonte à moins d'un an.");
      L.push("");
      var lignes = dem.map(function (x) {
        var nomS = typeof x === "string" ? x : (x && (x.nom || x.salarie)) || "[nom, prénom]";
        var dateD = (x && (x.date || x.dateDemande)) || null;
        return [nomS, jour(rupture, "—"),
          dateD ? jour(dateD) : "[date de la demande]",
          "[qualification]", "[nouvelle qualification]",
          pri.jusqu ? jour(pri.jusqu) : "[fin du délai]"];
      });
      if (!lignes.length) {
        L.push("AUCUNE DEMANDE N'EST RECENSÉE dans la fiche d'audit. Cela peut vouloir");
        L.push("dire qu'aucune n'a été reçue — ou que le recensement n'existe pas. Les");
        L.push("deux ne se ressemblent pas devant un juge : le registre établit le");
        L.push("premier, et rien n'établit le second.");
        L.push("");
        lignes = [
          ["[nom, prénom]", jour(rupture, "[rupture]"), "[date de la demande]", "[qualification]", "[le cas échéant]", pri.jusqu ? jour(pri.jusqu) : "[fin du délai]"],
          ["[nom, prénom]", jour(rupture, "[rupture]"), "[date de la demande]", "[qualification]", "[le cas échéant]", pri.jusqu ? jour(pri.jusqu) : "[fin du délai]"],
        ];
      } else {
        L.push(dem.length + " demande(s) figurent à la fiche. Complétez les colonnes vides :");
        L.push("");
      }
      tableau(L, ["Salarié", "Rupture", "Demande reçue le", "Qualification", "Nouvelle qualif.", "Priorité jusqu'au"], lignes);
      L.push("");
      L.push("Une demande reçue APRÈS l'expiration du délai d'un an n'ouvre pas la");
      L.push("priorité : le texte veut la demande « au cours de ce même délai ». Notez la");
      L.push("date de réception, pas celle du courrier.");
      L.push("");

      titre(L, "III. Le journal des postes devenus disponibles");

      L.push("Pour chaque poste devenu disponible, deux questions : est-il compatible");
      L.push("avec la qualification d'un salarié inscrit au registre ? et si oui, a-t-il");
      L.push("été proposé, par écrit et de manière datée ?");
      L.push("");
      tableau(L, ["Poste", "Disponible le", "Qualification requise", "Salariés compatibles", "Informés le", "Pourvu le"], [
        ["[intitulé]", "[AAAA-MM-JJ]", "[qualification]", "[noms ou « aucun »]", "[AAAA-MM-JJ]", "[AAAA-MM-JJ]"],
        ["[intitulé]", "[AAAA-MM-JJ]", "[qualification]", "[noms ou « aucun »]", "[AAAA-MM-JJ]", "[AAAA-MM-JJ]"],
      ]);
      L.push("");
      L.push("Lorsqu'aucun salarié inscrit n'est compatible, écrivez-le et dites");
      L.push("pourquoi : « aucun salarié inscrit ne possède la qualification de [—] ».");
      L.push("Un blanc se lira comme un oubli.");
      L.push("");

      L.push(DOUBLE);
      L.push("COURRIER 1 — INFORMATION DES REPRÉSENTANTS DU PERSONNEL");
      L.push(DOUBLE);
      L.push("");
      L.push("À adresser SANS ATTENDRE : cette obligation ne dépend de la demande");
      L.push("d'aucun salarié.");
      if (info === false || info === "non") {
        L.push("La fiche indique que les représentants NE SONT PAS informés des postes");
        L.push("disponibles : c'est le manquement que ce courrier vient combler.");
      } else if (info === true || info === "oui") {
        L.push("La fiche indique que les représentants sont informés : ce courrier sert");
        L.push("alors de modèle pour l'information périodique suivante.");
      }
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : postes disponibles — priorité de réembauche");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Conformément à l'article L. 1233-45 du code du travail, aux termes duquel");
      L.push("l'employeur informe les représentants du personnel des postes disponibles,");
      L.push("je vous communique la liste des postes actuellement disponibles au sein de");
      L.push(nom(ctx) + " :");
      L.push("");
      L.push("  · [intitulé du poste] — [établissement] — [qualification requise] —");
      L.push("    disponible depuis le [DATE]");
      L.push("  · [intitulé du poste] — [établissement] — [qualification requise] —");
      L.push("    disponible depuis le [DATE]");
      L.push("");
      L.push("[Ou, s'il n'y en a aucun : « Aucun poste n'est disponible à ce jour. »");
      L.push("Une information négative est une information : elle se date et elle");
      L.push("s'archive.]");
      L.push("");
      L.push("Cette information vous sera renouvelée [périodicité retenue : mensuelle,");
      L.push("trimestrielle, ou à chaque ouverture de poste].");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");
      L.push(DOUBLE);
      L.push("COURRIER 2 — INFORMATION DU SALARIÉ D'UN POSTE DEVENU DISPONIBLE");
      L.push(DOUBLE);
      L.push("");
      L.push("À adresser à chaque salarié inscrit au registre dont la qualification est");
      L.push("compatible avec le poste. Par écrit, et de manière datée : le recommandé");
      L.push("avec avis de réception est ce qui se prouve le mieux.");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("À [NOM ET PRÉNOM DU SALARIÉ]");
      L.push("[Adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : priorité de réembauche — poste devenu disponible");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Vous avez demandé, le [DATE DE LA DEMANDE], le bénéfice de la priorité de");
      L.push("réembauche prévue à l'article L. 1233-45 du code du travail, à la suite de");
      L.push("la rupture de votre contrat de travail intervenue le " +
        jour(rupture, "DATE DE RUPTURE") + ".");
      L.push("");
      L.push("Un emploi de [INTITULÉ DU POSTE], compatible avec votre qualification de");
      L.push("[QUALIFICATION], est devenu disponible au sein de " + nom(ctx));
      L.push("à compter du [DATE DE DISPONIBILITÉ].");
      L.push("");
      L.push("  Lieu d'exercice ........ [établissement, adresse]");
      L.push("  Nature du contrat ...... [durée indéterminée / déterminée, durée]");
      L.push("  Rémunération ........... [montant]");
      L.push("  Date de prise de poste . [DATE]");
      L.push("");
      L.push("Si cet emploi vous intéresse, je vous remercie de me le faire savoir avant");
      L.push("le [DATE LIMITE], à [destinataire, adresse ou courriel].");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "V. Le constat, pour les postes déjà pourvus");

      L.push("N'ANTIDATEZ RIEN. Un registre ouvert aujourd'hui s'ouvre aujourd'hui, et");
      L.push("il porte cette date. Consignez la situation telle qu'elle est :");
      L.push("");
      L.push("CONSTAT");
      L.push("");
      L.push("Entreprise : " + nom(ctx));
      L.push("Établi le : " + leJour(d0));
      L.push("");
      L.push("  Registre des demandes de priorité de réembauche ouvert le : " + leJour(d0));
      L.push("  Postes devenus disponibles depuis la première rupture : [nombre]");
      L.push("  Postes pourvus sans que l'information ait été faite à un salarié inscrit");
      L.push("  et compatible : [nombre]");
      L.push("");
      tableau(L, ["Poste", "Pourvu le", "Salarié inscrit compatible", "Information faite ?"], [
        ["[intitulé]", "[AAAA-MM-JJ]", "[nom, prénom]", "[non]"],
      ]);
      L.push("");
      L.push("  Conduite à tenir arrêtée avec [conseil de l'entreprise] le [DATE].");
      L.push("");
      L.push("L'application s'arrête ici : elle ne dit pas ce que coûte un poste pourvu");
      L.push("sans information, et elle ne l'inventera pas. Cette question relève du");
      L.push("conseil de l'entreprise, dossier par dossier.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      pied(L, ["L. 1233-45", "L. 1233-72"]);
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA CONSULTATION DU COMITÉ
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-CSE-01",
    "La convocation à la réunion de reprise et les procès-verbaux du comité",
    "Les écarts mesurés entre vos réunions, la date au plus tôt de la réunion qui " +
    "rétablit l'espacement de quinze jours, la convocation prête, et la trame de " +
    "procès-verbal — un espacement trop court se corrige en tenant la réunion, pas " +
    "sur le papier.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = reunions(f);
      var M = moteur();
      var mini = (M && M.ESPACEMENT_MINIMAL) || 15;
      var cons = regime(f).consultation || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();

      var ecarts = [];
      for (var i = 1; i < r.length; i++)
        ecarts.push({ de: r[i - 1], a: r[i], jours: ecart(r[i - 1], r[i]) });
      var courts = ecarts.filter(function (e) { return e.jours !== null && e.jours < mini; });

      L = L.concat(entete(ctx, "Réunion de reprise de la consultation du comité",
        "article L. 1233-30, I du code du travail"));

      if (courts.length || r.length === 1) {
        irrattrapable(L, [
          "L'article L. 1233-30, I dispose : « Le comité social et économique tient au",
          "moins deux réunions espacées d'au moins quinze jours. »",
          "",
          (courts.length
            ? "Vos réunions ne respectent pas cet espacement : " +
              courts.map(function (e) { return jour(e.de) + " → " + jour(e.a) + ", " + e.jours + " jour(s)"; }).join(" ; ") + "."
            : "Une seule réunion est renseignée : la seconde, celle où l'avis se rend, " +
              "n'a pas eu lieu."),
          "",
          "UNE RÉUNION TENUE TROP TÔT NE SE DÉPLACE PAS. Sa date est celle qu'elle a,",
          "elle figure sur la convocation, sur la feuille d'émargement et sur le",
          "procès-verbal. Corriger le procès-verbal ne corrige rien : cela ajoute un",
          "faux à une irrégularité.",
          "",
          "C'est l'irrégularité la plus visible d'un dossier, parce qu'elle se lit sur",
          "deux dates. Et l'administration vérifie la régularité de la procédure",
          "d'information et de consultation du comité (L. 1233-57-3).",
        ], "Ce qui se fait : TENIR LA RÉUNION qui rétablit le rythme, à plus de quinze " +
           "jours de la précédente, et y reprendre la consultation sur les points " +
           "concernés. Le temps ne se rattrape pas autrement — il faut le laisser courir.");
      }

      modeEmploi(L, [
        "Deux exigences distinctes, que ce document sépare :",
        "",
        "  — le NOMBRE : au moins deux réunions ;",
        "  — l'ESPACEMENT : au moins quinze jours entre elles.",
        "",
        "L'espacement n'est pas une formalité de calendrier. Il a un objet : c'est",
        "pendant ce temps que l'employeur met à l'étude les suggestions relatives aux",
        "mesures sociales envisagées et les propositions alternatives formulées par le",
        "comité, et qu'il leur donne une réponse motivée (L. 1233-33). Une réunion",
        "tenue trop tôt prive cette exigence de son objet.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Vos réunions, et les écarts");

      if (!r.length) {
        L.push("AUCUNE DATE DE RÉUNION N'EST RENSEIGNÉE. Renseignez-les : c'est sur deux");
        L.push("dates que l'irrégularité se lit, et sur deux dates qu'elle se dément.");
      } else {
        var lignes = r.map(function (x, k) {
          var e = k === 0 ? null : ecart(r[k - 1], x);
          return [(k + 1) + (k === 0 ? "re" : "e") + " réunion", jour(x),
            e === null ? "—" : e + " jour(s)",
            e === null ? "" : (e < mini ? "INSUFFISANT (< " + mini + ")" : "conforme")];
        });
        tableau(L, ["Réunion", "Date", "Écart avec la précédente", "Espacement"], lignes);
        L.push("");
        L.push("  Réunions tenues .......... " + r.length + (r.length < 2 ? " — le texte en exige au moins deux" : ""));
        L.push("  Écarts insuffisants ...... " + courts.length);
      }
      L.push("");

      titre(L, "II. La date de la réunion de reprise");

      var base = r.length ? r[r.length - 1] : null;
      var auPlusTot = base ? plusJours(base, mini) : null;
      if (base) {
        L.push("  Dernière réunion tenue ....... " + jour(base));
        L.push("  Espacement minimal ........... " + mini + " jours (L. 1233-30, I)");
        L.push("  Réunion de reprise au plus tôt " + jour(auPlusTot));
        L.push("");
        var dans = ecart(iso(d0), auPlusTot);
        if (dans !== null && dans > 0) {
          L.push("  Soit dans " + dans + " jour(s) à compter d'aujourd'hui, " + leJour(d0) + ".");
          L.push("  Ce délai ne se raccourcit pas : c'est l'espacement lui-même qu'il faut");
          L.push("  laisser courir.");
        } else if (dans !== null) {
          L.push("  Ce délai est déjà écoulé au " + leJour(d0) + " : la réunion de reprise");
          L.push("  peut être tenue dès que la convocation le permet.");
        }
        L.push("");
        L.push("  Ajoutez à cette date le délai de convocation que votre règlement");
        L.push("  intérieur de comité ou vos usages imposent : l'application ne les lit");
        L.push("  pas, et un ordre du jour communiqué trop tard ferait naître une seconde");
        L.push("  irrégularité par-dessus la première.");
      } else {
        L.push("  [Aucune réunion n'étant renseignée, la date au plus tôt ne peut pas être");
        L.push("  calculée. Elle est de " + mini + " jours après la précédente réunion.]");
      }
      L.push("");
      if (cons.connu && cons.echeance) {
        L.push("  ATTENTION AU DÉLAI D'AVIS. Il court de la PREMIÈRE réunion, et il n'est");
        L.push("  pas prolongé par la réunion de reprise : " + cons.mois + " mois à compter du");
        L.push("  " + jour(cons.premiere) + ", soit une expiration le " + jour(cons.echeance) + ".");
        if (auPlusTot && avant(cons.echeance, auPlusTot) === true) {
          L.push("");
          L.push("  => La réunion de reprise au plus tôt (" + jour(auPlusTot) + ") est");
          L.push("     POSTÉRIEURE à l'expiration du délai d'avis. Passé ce terme, le comité");
          L.push("     est réputé avoir été consulté (L. 1233-30, II) — ce qui ne dispense");
          L.push("     ni d'avoir tenu les réunions, ni d'avoir répondu à ses propositions.");
          L.push("     Tenez la réunion malgré tout, et écrivez au dossier pourquoi elle est");
          L.push("     postérieure.");
        }
        L.push("");
      }

      L.push(DOUBLE);
      L.push("COURRIER — CONVOCATION À LA RÉUNION DE REPRISE");
      L.push(DOUBLE);
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : convocation à une réunion du comité social et économique sur le");
      L.push("projet de licenciement collectif et le plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous convie à une réunion du comité social et économique portant sur");
      L.push("l'opération projetée et ses modalités d'application ainsi que sur le projet");
      L.push("de licenciement collectif, qui se tiendra le " +
        (auPlusTot ? "[DATE, au plus tôt le " + jour(auPlusTot) + "]" : "[DATE]") + ",");
      L.push("à [HEURE], à [LIEU].");
      L.push("");
      L.push("Ordre du jour :");
      L.push("  1. " + (r.length < 2
        ? "Consultation du comité et recueil de ses deux avis sur l'opération projetée"
        : "Reprise de la consultation sur l'opération projetée"));
      L.push("     et ses modalités d'application, et sur le projet de licenciement");
      L.push("     collectif : nombre de suppressions d'emploi, catégories");
      L.push("     professionnelles concernées, critères d'ordre, calendrier");
      L.push("     prévisionnel des licenciements, mesures sociales d'accompagnement");
      L.push("     prévues par le plan de sauvegarde de l'emploi et, le cas échéant,");
      L.push("     conséquences des licenciements projetés en matière de santé, de");
      L.push("     sécurité ou de conditions de travail (article L. 1233-30, I).");
      L.push("  2. Réponse motivée aux suggestions relatives aux mesures sociales");
      L.push("     envisagées et aux propositions alternatives formulées par le comité");
      L.push("     (article L. 1233-33).");
      L.push("  3. [Le cas échéant : présentation du rapport de l'expert.]");
      L.push("  4. Recueil des avis.");
      L.push("");
      L.push("La présente réunion est convoquée à plus de quinze jours de la précédente,");
      L.push("tenue le " + jour(base, "DATE DE LA PRÉCÉDENTE RÉUNION") + ", conformément à l'article");
      L.push("L. 1233-30, I du code du travail.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : [documents communiqués au comité pour cette réunion]");
      L.push("");

      titre(L, "IV. La trame de procès-verbal");

      L.push("Le procès-verbal se joint au dossier de demande. Il porte la date réelle");
      L.push("de la réunion, et rien d'autre.");
      L.push("");
      L.push("PROCÈS-VERBAL DE LA RÉUNION DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("  Entreprise ................ " + nom(ctx));
      L.push("  Date de la réunion ........ [AAAA-MM-JJ]");
      L.push("  Date de la précédente ..... " + jour(base, "AAAA-MM-JJ"));
      L.push("  Écart ..................... [nombre] jours");
      L.push("  Heure d'ouverture / clôture [—] / [—]");
      L.push("  Présents .................. [noms et qualités]");
      L.push("  Absents excusés ........... [noms]");
      L.push("  Président ................. " + signataire(ctx));
      L.push("  Secrétaire ................ [nom]");
      L.push("");
      L.push("  1. Points portés à l'ordre du jour : [reprendre l'ordre du jour]");
      L.push("");
      L.push("  2. Informations communiquées et documents remis : [liste, avec les dates");
      L.push("     de remise]");
      L.push("");
      L.push("  3. Suggestions et propositions alternatives formulées par le comité :");
      L.push("     [les reprendre une à une]");
      L.push("");
      L.push("  4. Réponses motivées de l'employeur (L. 1233-33) : [une réponse par");
      L.push("     proposition, motivée — « la proposition n'a pas été retenue » n'est");
      L.push("     pas une réponse motivée]");
      L.push("");
      L.push("  5. Avis rendus :");
      L.push("     · sur l'opération projetée et ses modalités d'application : [favorable");
      L.push("       / défavorable / abstention] — [voix pour, contre, abstentions]");
      L.push("     · sur le projet de licenciement collectif : [—]");
      L.push("");
      L.push("  Signatures : le président — le secrétaire");
      L.push("");

      titre(L, "V. Les réponses motivées — le tableau à tenir");

      L.push("C'est ce tableau qui donne son objet à l'espacement de quinze jours, et");
      L.push("c'est lui qu'on cherchera au dossier.");
      L.push("");
      tableau(L, ["Proposition du comité", "Formulée le", "Réponse motivée", "Donnée le"], [
        ["[proposition]", "[AAAA-MM-JJ]", "[motifs de l'acceptation ou du rejet]", "[AAAA-MM-JJ]"],
        ["[proposition]", "[AAAA-MM-JJ]", "[motifs]", "[AAAA-MM-JJ]"],
      ]);
      L.push("");
      L.push("Ne saisissez l'administration qu'une fois le rythme rétabli, et joignez");
      L.push("les procès-verbaux datés : ce qu'elle a sous les yeux est le dossier tel");
      L.push("qu'il a été déposé.");

      pied(L, ["L. 1233-30, I", "L. 1233-30, II", "L. 1233-33", "L. 1233-57-3", "L. 1233-28"]);
      return L.join("\n");
    });

  doc("PSE-CTL-CSE-02",
    "Le calendrier de consultation — première réunion, délai applicable, expiration",
    "Le délai que le nombre de licenciements commande, calculé depuis la date de " +
    "votre première réunion, la place de l'accord qui fixerait d'autres délais, et " +
    "le calendrier remis au comité.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var cons = regime(f).consultation || {};
      var r = reunions(f);
      var avis = (f.pse || {}).dateAvisCSE || f.dateAvisCSE;
      var accord = f.accordDelaisConsultation;
      var pieces = Array.isArray(f.pieces) ? f.pieces : [];
      var accordVerse = pieces.some(function (x) {
        return /accord.?d[ée]lais|accord.?m[ée]thode/i.test(String(x.type || x.nom || ""));
      });
      var M = moteur();
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();

      L = L.concat(entete(ctx, "Calendrier de consultation du comité social et économique",
        "article L. 1233-30, II du code du travail"));

      modeEmploi(L, [
        "L'article L. 1233-30, II fixe le délai dans lequel le comité rend SES DEUX",
        "AVIS : « à compter de la date de sa première réunion au cours de laquelle il",
        "est consulté sur les 1° et 2° du I », et non de la convocation, ni de la",
        "remise des documents, ni du dépôt du dossier.",
        "",
        "  · deux mois lorsque le nombre des licenciements est inférieur à cent ;",
        "  · trois mois lorsqu'il est au moins égal à cent et inférieur à deux cent",
        "    cinquante ;",
        "  · quatre mois lorsqu'il est au moins égal à deux cent cinquante.",
        "",
        "« Une convention ou un accord collectif de travail peut prévoir des délais",
        "différents » — plus longs comme plus courts. Et « en l'absence d'avis du",
        "comité social et économique dans ces délais, celui-ci est réputé avoir été",
        "consulté ».",
        "",
        "Un accord invoqué mais non versé n'est opposable à personne : ni",
        "l'administration ni l'application ne peuvent vérifier le délai que vous",
        "appliquez. Versez-le, ou le plafond légal reste la seule référence.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Le délai applicable");

      L.push("  Nombre de licenciements envisagés ..... " +
        (nbLicenciements(f) === null ? "[non renseigné]" : nbLicenciements(f)));
      if (cons.connu) {
        L.push("  Tranche de l'article L. 1233-30, II ... " + cons.tranche);
        L.push("  Délai légal ........................... " + cons.mois + " mois");
      } else {
        L.push("  Tranche ............................... [indéterminable]");
        L.push("  Délai légal ........................... [2, 3 ou 4 mois selon le nombre]");
      }
      L.push("");
      if (M && M.DELAIS_AVIS) {
        L.push("  Le barème du texte, pour mémoire :");
        M.DELAIS_AVIS.forEach(function (x) {
          L.push("    · " + x.mois + " mois — " + x.texte);
        });
        L.push("");
      }
      L.push("  Un accord fixe-t-il des délais différents ? " +
        (accord === true || accord === "oui" ? "oui, d'après la fiche"
          : accord === false || accord === "non" ? "non, d'après la fiche" : "[non renseigné]"));
      if (accord === true || accord === "oui") {
        L.push("  L'accord est-il versé au dossier ? ........ " + (accordVerse ? "oui" : "NON"));
        if (!accordVerse) {
          L.push("");
          L.push("  => L'ACCORD EST DÉCLARÉ MAIS N'EST PAS VERSÉ. En l'état, le plafond légal");
          L.push("     n'est pas opposable, et le délai que vous appliquez ne peut pas être");
          L.push("     vérifié. Joignez l'accord au dossier et renvoyez-y expressément dans");
          L.push("     le calendrier ci-dessous ; à défaut, appliquez le plafond légal.");
        }
        L.push("");
        L.push("  Référence de l'accord ..... [intitulé, date de signature, signataires]");
        L.push("  Délai qu'il prévoit ....... [durée, et son point de départ]");
        L.push("  Versé au dossier le ....... [AAAA-MM-JJ]");
      }
      L.push("");

      titre(L, "II. Le point de départ et l'expiration");

      L.push("  Première réunion au cours de laquelle le comité est consulté sur");
      L.push("  l'opération projetée ET sur le projet de licenciement collectif :");
      L.push("      " + (cons.premiere ? jour(cons.premiere) : "[DATE — non renseignée]"));
      L.push("");
      L.push("  Une réunion d'information préalable qui ne porte pas sur ces deux points");
      L.push("  n'est pas la première réunion au sens du texte. Vérifiez l'ordre du jour");
      L.push("  et le procès-verbal avant de retenir une date : c'est de celle-là que");
      L.push("  tout court.");
      L.push("");
      if (cons.echeance) {
        L.push("  EXPIRATION DU DÉLAI D'AVIS ....... " + jour(cons.echeance));
        L.push("  (" + cons.mois + " mois à compter du " + jour(cons.premiere) + ")");
        var reste = ecart(iso(d0), cons.echeance);
        if (reste !== null)
          L.push("  Au " + leJour(d0) + " : " +
            (reste > 0 ? "il reste " + reste + " jour(s)" : "le terme est dépassé de " + (-reste) + " jour(s)"));
      } else {
        L.push("  EXPIRATION DU DÉLAI D'AVIS ....... [à calculer depuis la première");
        L.push("  réunion, dont la date n'est pas renseignée]");
      }
      L.push("");
      L.push("  Avis rendu(s) le ................. " + jour(avis, "aucun avis enregistré"));
      if (avis && cons.echeance) {
        L.push("  Dans le délai ? .................. " +
          (avant(cons.echeance, avis) === true ? "NON — postérieur au terme" : "oui"));
      }
      L.push("");
      L.push("  À défaut d'avis rendu dans le délai, le comité est RÉPUTÉ AVOIR ÉTÉ");
      L.push("  CONSULTÉ. Cela ne dispense ni d'avoir tenu au moins deux réunions");
      L.push("  espacées d'au moins quinze jours (L. 1233-30, I), ni d'avoir mis à");
      L.push("  l'étude ses suggestions et propositions alternatives et d'y avoir donné");
      L.push("  une réponse motivée (L. 1233-33). Le silence du comité ne rachète aucune");
      L.push("  de ces obligations.");
      L.push("");

      titre(L, "III. Le calendrier à remettre au comité");

      var lignes = [];
      lignes.push(["Première réunion", cons.premiere ? jour(cons.premiere) : "[DATE]",
        "Point de départ du délai d'avis (L. 1233-30, II) ; décision éventuelle de recourir à une expertise (L. 1233-34)"]);
      if (r.length > 1) {
        for (var k = 1; k < r.length; k++)
          lignes.push([(k + 1) + "e réunion", jour(r[k]),
            "Écart avec la précédente : " + (ecart(r[k - 1], r[k]) || "—") + " jour(s)"]);
      } else if (cons.premiere) {
        lignes.push(["2e réunion au plus tôt", jour(plusJours(cons.premiere, 15)),
          "Au moins quinze jours après la première (L. 1233-30, I)"]);
      } else {
        lignes.push(["2e réunion", "[DATE]", "Au moins quinze jours après la première"]);
      }
      lignes.push(["Expiration du délai d'avis", cons.echeance ? jour(cons.echeance) : "[DATE]",
        (cons.mois ? cons.mois + " mois" : "[2, 3 ou 4 mois]") + " à compter de la première réunion"]);
      lignes.push(["Dépôt de la demande", ((f.pse || {}).dateDepotAdmin ? jour((f.pse || {}).dateDepotAdmin) : "[DATE]"),
        "Après les avis, ou après le terme du délai"]);
      tableau(L, ["Étape", "Date", "Ce qui s'y attache"], lignes);
      L.push("");
      L.push("Ce calendrier se remet au comité, et il se verse au dossier de demande :");
      L.push("l'administration vérifie la régularité de la procédure d'information et de");
      L.push("consultation (L. 1233-57-3), et un calendrier écrit est ce qui l'établit");
      L.push("le plus simplement.");
      L.push("");
      if (f.expertisePSE === true || f.expertisePSE === "oui") {
        L.push("Une expertise a été décidée : le rapport de l'expert est remis au comité");
        L.push("— et, le cas échéant, aux organisations syndicales — au plus tard quinze");
        L.push("jours avant l'expiration du délai d'avis (L. 1233-34), soit " +
          (cons.echeance ? "le " + jour(plusJours(cons.echeance, -15)) : "[DATE]") + ".");
        L.push("L'expertise ne prolonge pas le délai d'avis.");
        L.push("");
      }
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      pied(L, ["L. 1233-30, II", "L. 1233-30, I", "L. 1233-33", "L. 1233-34", "L. 1233-57-3"]);
      return L.join("\n");
    });

  doc("PSE-CTL-CSE-03",
    "La délibération de désignation de l'expert et le journal des échanges",
    "La date de la délibération versée telle qu'elle est, les délais de l'article " +
    "L. 1233-35 calculés — dix jours pour demander, huit pour répondre —, la date " +
    "de remise du rapport, et le constat si la désignation est postérieure à la " +
    "première réunion.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var cons = regime(f).consultation || {};
      var r = reunions(f);
      var des = (f.pse || {}).dateDesignationExpert;
      var premiere = cons.premiere || (r.length ? r[0] : null);
      var tardive = des && premiere ? avant(premiere, des) : null;
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();

      L = L.concat(entete(ctx, "Désignation de l'expert et journal des échanges d'informations",
        "articles L. 1233-34 et L. 1233-35 du code du travail"));

      if (tardive === true) {
        irrattrapable(L, [
          "L'expert a été désigné le " + jour(des) + ", la première réunion s'est tenue le",
          jour(premiere) + " : la désignation lui est POSTÉRIEURE.",
          "",
          "Or l'article L. 1233-34 place la décision de recourir à l'expertise à la",
          "première réunion : le comité « peut […] décider, LORS DE LA PREMIÈRE RÉUNION",
          "prévue à l'article L. 1233-30, de recourir à une expertise ».",
          "",
          "UNE DÉSIGNATION NE SE RÉTRODATE PAS. Elle résulte d'une délibération, et la",
          "délibération porte la date de la séance où elle a été prise. La corriger",
          "reviendrait à falsifier un procès-verbal.",
          "",
          "ET LE DÉLAI D'AVIS N'EN EST PAS PROLONGÉ. Le calendrier reste celui de",
          "l'article L. 1233-30, II : le retard de la désignation se paie sur le temps",
          "de l'expertise, pas sur celui de la consultation.",
        ], "Ce qui se fait : verser la délibération telle qu'elle est, avec sa date, " +
           "tenir scrupuleusement les délais d'échange que L. 1233-35 impose, et ne pas " +
           "différer la saisine de l'administration au motif de l'expertise.");
      }

      modeEmploi(L, [
        "Trois séries de dates, et elles s'enchaînent :",
        "",
        "  1. LA DÉSIGNATION. Le comité décide de recourir à l'expertise lors de la",
        "     première réunion prévue à l'article L. 1233-30 (L. 1233-34).",
        "",
        "  2. LES ÉCHANGES. « L'expert désigné par le comité social et économique",
        "     demande à l'employeur, dans les dix jours à compter de sa désignation,",
        "     toutes les informations qu'il juge nécessaires à la réalisation de sa",
        "     mission. L'employeur répond à cette demande dans les huit jours. Le cas",
        "     échéant, l'expert demande, dans les dix jours, des informations",
        "     complémentaires à l'employeur, qui répond à cette demande dans les huit",
        "     jours à compter de la date à laquelle la demande de l'expert est",
        "     formulée » (L. 1233-35).",
        "",
        "  3. LE RAPPORT. Il est remis au comité et, le cas échéant, aux organisations",
        "     syndicales, au plus tard quinze jours avant l'expiration du délai",
        "     mentionné à l'article L. 1233-30 (L. 1233-34).",
        "",
        "Ces délais sont courts. C'est le journal daté des échanges, et lui seul, qui",
        "établira qu'ils ont été tenus.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Les dates");

      L.push("  Recours à l'expertise décidé ? ......... " +
        (f.expertisePSE === true || f.expertisePSE === "oui" ? "oui"
          : f.expertisePSE === false || f.expertisePSE === "non" ? "non" : "[non renseigné]"));
      L.push("  Première réunion du comité ............. " + jour(premiere, "non renseignée"));
      L.push("  Désignation de l'expert ................ " + jour(des, "non renseignée"));
      if (des && premiere) {
        var dj = ecart(premiere, des);
        L.push("  Écart .................................. " +
          (dj === null ? "[—]" : dj + " jour(s)" + (dj > 0 ? " APRÈS la première réunion" : dj < 0 ? " avant la première réunion" : " — même jour")));
      }
      L.push("  Expiration du délai d'avis ............. " + jour(cons.echeance, "à calculer") +
        (cons.mois ? " (" + cons.mois + " mois)" : ""));
      L.push("");
      if (des) {
        L.push("  LES ÉCHÉANCES QUI EN DÉCOULENT (L. 1233-35) :");
        L.push("    Demande d'informations de l'expert, dans les dix jours de sa");
        L.push("    désignation .......................... au plus tard le " + jour(plusJours(des, 10)));
        L.push("    Réponse de l'employeur, dans les huit jours de la demande");
        L.push("                                          .. au plus tard le " +
          jour(plusJours(plusJours(des, 10), 8)) + " si la demande");
        L.push("                                             intervient au dernier jour");
        L.push("");
        L.push("    Les demandes complémentaires suivent la même règle : dix jours pour");
        L.push("    demander, huit jours pour répondre à compter de la date à laquelle la");
        L.push("    demande est formulée.");
      } else {
        L.push("  [La date de désignation n'est pas renseignée : les échéances des dix et");
        L.push("  huit jours ne peuvent pas être calculées. C'est elle qui les commande.]");
      }
      L.push("");
      if (cons.echeance) {
        var rap = plusJours(cons.echeance, -15);
        L.push("  REMISE DU RAPPORT ...................... au plus tard le " + jour(rap));
        L.push("  (quinze jours avant l'expiration du délai de l'article L. 1233-30,");
        L.push("   fixée au " + jour(cons.echeance) + ")");
        var margeJ = des ? ecart(des, rap) : null;
        if (margeJ !== null) {
          L.push("");
          L.push("  L'expert dispose donc de " + margeJ + " jour(s) entre sa désignation et la");
          L.push("  remise de son rapport. Portez cette date à sa lettre de mission : c'est");
          L.push("  la seule qui compte.");
        }
      } else {
        L.push("  REMISE DU RAPPORT ...................... [quinze jours avant");
        L.push("  l'expiration du délai d'avis, qui n'est pas calculable en l'état]");
      }
      L.push("");

      titre(L, "II. La délibération à verser au dossier");

      L.push("Elle se verse telle qu'elle est, avec sa date. La date est ce qu'elle est,");
      L.push("et elle sera lue.");
      L.push("");
      L.push("EXTRAIT DU PROCÈS-VERBAL — DÉLIBÉRATION DE DÉSIGNATION D'UN EXPERT");
      L.push("");
      L.push("  Entreprise ................ " + nom(ctx));
      L.push("  Réunion du ................ " + jour(des, "AAAA-MM-JJ"));
      L.push("  Nature de la réunion ...... [première réunion prévue à l'article");
      L.push("                              L. 1233-30 / autre — préciser laquelle]");
      L.push("  Objet de la délibération .. recours à une expertise");
      L.push("  Domaines de l'expertise ... [économique et comptable / santé, sécurité");
      L.push("                              ou effets potentiels du projet sur les");
      L.push("                              conditions de travail — L. 1233-34]");
      L.push("  Expert désigné ............ [dénomination, adresse]");
      L.push("  Vote ...................... [pour / contre / abstentions]");
      L.push("");
      L.push("  [Le cas échéant : le comité mandate également un expert afin qu'il");
      L.push("  apporte toute analyse utile aux organisations syndicales pour mener la");
      L.push("  négociation prévue à l'article L. 1233-24-1 (L. 1233-34).]");
      L.push("");
      L.push("  Signatures : le président — le secrétaire");
      L.push("");

      titre(L, "III. Le journal des échanges — à tenir au jour le jour");

      L.push("Demande, date, réponse, date. C'est lui qui établira que les délais de");
      L.push("l'article L. 1233-35 ont été tenus, et rien d'autre ne l'établira.");
      L.push("");
      tableau(L, ["N°", "Demande de l'expert", "Formulée le", "Échéance de réponse", "Réponse faite le", "Pièces remises"], [
        ["1", "[objet de la demande]", des ? "[au plus tard le " + jour(plusJours(des, 10)) + "]" : "[AAAA-MM-JJ]",
          "[8 jours après]", "[AAAA-MM-JJ]", "[liste]"],
        ["2", "[demande complémentaire]", "[AAAA-MM-JJ]", "[8 jours après]", "[AAAA-MM-JJ]", "[liste]"],
      ]);
      L.push("");
      L.push("Règle de calcul, telle que le texte l'écrit : la réponse est due dans les");
      L.push("huit jours « à compter de la date à laquelle la demande de l'expert est");
      L.push("formulée ». C'est la date de la demande, pas celle de sa réception par le");
      L.push("service compétent.");
      L.push("");
      L.push("Une réponse partielle se note comme telle, avec ce qui manque et pourquoi.");
      L.push("Un journal qui ne porte que des réponses complètes se lit mal quand");
      L.push("l'expert soutient le contraire.");
      L.push("");

      titre(L, "IV. Ce que l'expertise ne fait pas");

      L.push("Elle NE PROLONGE PAS le délai d'avis du comité. Le calendrier reste celui");
      L.push("de l'article L. 1233-30, II" +
        (cons.mois ? " : " + cons.mois + " mois à compter de la première réunion," : ",") + " et");
      L.push(cons.echeance ? "l'expiration reste fixée au " + jour(cons.echeance) + "."
        : "l'expiration se calcule depuis la première réunion.");
      L.push("");
      L.push("Ne différez donc pas la saisine de l'administration au motif que");
      L.push("l'expertise est en cours : le dossier se dépose quand la consultation est");
      L.push("achevée ou le délai expiré, et non quand le rapport arrive.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));

      pied(L, ["L. 1233-34", "L. 1233-35", "L. 1233-30", "L. 1233-24-1", "L. 1233-57-3"],
        "L'article L. 2315-81, auquel L. 1233-34 renvoie pour l'assistance de\n" +
        "l'expert, et le décret en Conseil d'État qui fixe les modalités de\n" +
        "l'expertise ne sont pas au dépôt de textes du module : ils sont mentionnés\n" +
        "parce que l'article les mentionne, sans que leur contenu soit rapporté.");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LA COHÉRENCE DU DOSSIER
     ══════════════════════════════════════════════════════════════════════ */

  doc("PSE-CTL-COH-01",
    "Le rapprochement du décompte des licenciements et des bénéficiaires",
    "Les deux décomptes posés côte à côte, la distinction entre mesures " +
    "individuelles et collectives, et les conséquences en chaîne d'une correction " +
    "du nombre de licenciements — délai d'avis, calendrier, chiffrage.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var n = nbLicenciements(f);
      var mes = mesures(f);
      var cons = regime(f).consultation || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var M = moteur();

      var indiv = mes.filter(function (m) {
        return INDIVIDUELLES.indexOf(String(m.rubrique || "").trim()) >= 0;
      });
      var maxI = 0, quelle = null;
      indiv.forEach(function (m) {
        var b = nbf(m.beneficiaires);
        if (b !== null && b > maxI) { maxI = b; quelle = m; }
      });

      L = L.concat(entete(ctx, "Rapprochement du décompte des licenciements et des bénéficiaires",
        "article L. 1233-62 du code du travail"));

      modeEmploi(L, [
        "Trois rubriques de l'article L. 1233-62 s'adressent aux salariés dont le",
        "licenciement est envisagé : le reclassement interne (1°), le soutien à la",
        "création ou à la reprise d'activités par les salariés (4°), la formation, la",
        "validation des acquis et la reconversion (5°). Une mesure relevant de l'une",
        "d'elles ne peut pas viser plus de bénéficiaires qu'il n'y a de licenciements.",
        "",
        "Les autres rubriques — reprise d'activités (1° bis), créations d'activités",
        "nouvelles (2°), reclassement externe et bassin d'emploi (3°), réduction ou",
        "aménagement du temps de travail (6°) — peuvent légitimement viser au-delà :",
        "la dernière n'a même de sens que si elle dépasse largement l'effectif",
        "licencié. Le rapprochement ne les compare donc pas.",
        "",
        "Quand les deux chiffres ne concordent pas, l'un des deux est faux — et les",
        "deux emportent des conséquences : le nombre de licenciements commande le",
        "délai d'avis du comité (L. 1233-30, II), le chiffrage commande l'appréciation",
        "des mesures au regard de l'importance du projet (L. 1233-57-3, 2°).",
        "",
        "Corrigez celui qui est faux, pas celui qui est le plus commode.",
      ]);

      rappelRegime(L, ctx);

      titre(L, "I. Les deux décomptes, côte à côte");

      L.push("  A — LICENCIEMENTS ENVISAGÉS");
      L.push("      Nombre retenu par l'audit ......... " + (n === null ? "[non renseigné]" : n));
      L.push("      Période de trente jours ........... du [AAAA-MM-JJ] au [AAAA-MM-JJ]");
      L.push("      dont refus de modification d'un élément essentiel du contrat");
      L.push("      proposée pour un motif économique (L. 1233-25) ... [nombre]");
      L.push("      dont licenciements déjà prononcés relevant de la règle des");
      L.push("      licenciements successifs (L. 1233-26) ............ [nombre]");
      L.push("");
      L.push("      Le décompte des trente jours est celui du module économique : il");
      L.push("      intègre ces deux séries. Si l'une manque, c'est là qu'il faut");
      L.push("      reprendre, et non dans le plan.");
      L.push("");
      L.push("  B — BÉNÉFICIAIRES DES MESURES INDIVIDUELLES (rubriques " +
        INDIVIDUELLES.join(", ") + ")");
      if (indiv.length) {
        L.push("");
        tableau(L, ["Rubr.", "Mesure", "Bénéficiaires", "Excède A ?"],
          indiv.map(function (m) {
            var b = nbf(m.beneficiaires);
            return [m.rubrique, cro(m.intitule, "intitulé"),
              b === null ? "[non chiffré]" : b,
              (b !== null && n !== null) ? (b > n ? "OUI" : "non") : "[—]"];
          }));
      } else {
        L.push("      [Aucune mesure des rubriques " + INDIVIDUELLES.join(", ") +
          " ne porte de nombre de bénéficiaires.]");
      }
      L.push("");
      if (maxI && n !== null) {
        L.push("  Le plus élevé des bénéficiaires individuels : " + maxI +
          (quelle ? " (« " + cro(quelle.intitule, "sans intitulé") + " »)" : ""));
        L.push("  Licenciements envisagés : " + n);
        L.push("");
        if (maxI > n) {
          L.push("  => INCOHÉRENCE : une mesure individuelle vise " + (maxI - n) + " bénéficiaire(s) de");
          L.push("     plus qu'il n'y a de licenciements envisagés. L'un des deux chiffres");
          L.push("     est faux, et les deux se voient en séance.");
        } else {
          L.push("  => Les deux décomptes sont cohérents. Ce document sert alors de pièce de");
          L.push("     rapprochement : datez-la, signez-la, versez-la au dossier.");
        }
      }
      L.push("");
      L.push("  C — MESURES COLLECTIVES, non comparées au nombre de licenciements");
      var coll = mes.filter(function (m) {
        var k = String(m.rubrique || "").trim();
        return k && INDIVIDUELLES.indexOf(k) < 0;
      });
      if (coll.length) {
        L.push("");
        tableau(L, ["Rubr.", "Mesure", "Bénéficiaires"],
          coll.map(function (m) {
            return [m.rubrique, cro(m.intitule, "intitulé"),
              nbf(m.beneficiaires) === null ? "[non chiffré]" : nbf(m.beneficiaires)];
          }));
        L.push("");
        L.push("      Vérifiez que ces mesures restent identifiées comme collectives dans");
        L.push("      le plan : c'est ce qui explique qu'elles dépassent le nombre de");
        L.push("      licenciements, et l'explication doit être lisible au dossier.");
      } else {
        L.push("      [Aucune mesure collective n'est saisie.]");
      }
      L.push("");

      titre(L, "II. Lequel des deux est faux");

      L.push("  [ ] LE DÉCOMPTE DES LICENCIEMENTS.");
      L.push("      Cause : [salariés oubliés, période mal bornée, refus de modification");
      L.push("      non intégrés, licenciements successifs non pris en compte].");
      L.push("      Nombre corrigé : [—]");
      L.push("      ATTENTION — cette correction déplace tout le calendrier : voir III.");
      L.push("");
      L.push("  [ ] LE CHIFFRAGE DES BÉNÉFICIAIRES.");
      L.push("      Cause : [double compte, bénéficiaires potentiels comptés pour");
      L.push("      effectifs, mesure collective classée en individuelle].");
      L.push("      Mesure(s) corrigée(s) : [—] — nouveau nombre : [—]");
      L.push("");
      L.push("  [ ] LE CLASSEMENT DE LA MESURE.");
      L.push("      Une mesure rattachée à la rubrique 1°, 4° ou 5° alors qu'elle vise");
      L.push("      tout l'effectif relève en réalité d'une rubrique collective.");
      L.push("      Mesure : [—] — rubrique correcte : [—]");
      L.push("");

      titre(L, "III. Les conséquences en chaîne d'une correction du nombre");

      L.push("Si c'est le décompte des licenciements qui change, quatre choses changent");
      L.push("avec lui. Aucune ne se rattrape après le dépôt.");
      L.push("");
      L.push("  1. LE DÉLAI D'AVIS DU COMITÉ (L. 1233-30, II)");
      if (M && M.DELAIS_AVIS) {
        M.DELAIS_AVIS.forEach(function (x) {
          L.push("     · " + x.mois + " mois — " + x.texte);
        });
      }
      if (cons.connu && cons.mois) {
        L.push("     Délai actuellement applicable : " + cons.mois + " mois (" + cons.tranche + ")");
        if (cons.premiere && cons.echeance)
          L.push("     Expiration actuelle : " + jour(cons.echeance) +
            ", depuis la première réunion du " + jour(cons.premiere) + ".");
      }
      L.push("     Nouveau délai après correction : [2, 3 ou 4 mois]");
      L.push("     Nouvelle expiration : " +
        (cons.premiere ? "[à recalculer depuis le " + jour(cons.premiere) + "]" : "[à recalculer]"));
      L.push("");
      L.push("  2. LE CALENDRIER DE LA PROCÉDURE — dates des réunions, date de dépôt,");
      L.push("     échéance d'instruction : refaites-le en entier, il ne se rapièce pas.");
      L.push("");
      L.push("  3. LE CHIFFRAGE — bénéficiaires, budgets, budget total du plan. Vérifiez");
      L.push("     que la somme des mesures et le total annoncé coïncident toujours.");
      var s = sommeBudgets(f), annonce = nbf((f.plan || {}).budgetTotal);
      if (s !== null || annonce !== null) {
        L.push("     Pour mémoire : somme des mesures " + eur(s, "—") +
          ", total annoncé " + eur(annonce, "—") + ".");
      }
      if (annonce !== null && n) {
        L.push("     Coût par salarié licencié, en l'état : " + eur(Math.round(annonce / n)) +
          " — à recalculer");
        L.push("     sur le nombre corrigé. Ce chiffre n'est pas un verdict : aucun texte");
        L.push("     ne fixe le montant d'un plan.");
      }
      L.push("");
      L.push("  4. LE RÉGIME LUI-MÊME — le plan est dû à partir de dix licenciements");
      L.push("     envisagés dans une même période de trente jours, dans les entreprises");
      L.push("     d'au moins cinquante salariés (L. 1233-61). Un décompte corrigé qui");
      L.push("     passerait sous ce seuil changerait la procédure entière.");
      L.push("");

      titre(L, "IV. La pièce de rapprochement");

      L.push("PIÈCE DE RAPPROCHEMENT — DÉCOMPTE DES LICENCIEMENTS ET BÉNÉFICIAIRES");
      L.push("");
      L.push("  Entreprise ......................... " + nom(ctx));
      L.push("  Arrêtée le ......................... " + leJour(d0));
      L.push("  Licenciements envisagés ............ [nombre corrigé]");
      L.push("  Période de trente jours ............ du [—] au [—]");
      L.push("  Bénéficiaires — rubrique 1° ........ [nombre]");
      L.push("  Bénéficiaires — rubrique 4° ........ [nombre]");
      L.push("  Bénéficiaires — rubrique 5° ........ [nombre]");
      L.push("  Aucun n'excède le nombre de licenciements : [oui]");
      L.push("  Pièces corrigées ................... [lesquelles, et leur version]");
      L.push("  Calendrier refait .................. [oui / sans objet]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Si cette correction intervient après une réunion du comité, présentez-lui");
      L.push("la version corrigée : il est consulté sur le nombre de suppressions");
      L.push("d'emploi et sur les mesures sociales d'accompagnement prévues par le plan");
      L.push("(L. 1233-30, I, 2°).");

      pied(L, ["L. 1233-62", "L. 1233-30, I", "L. 1233-30, II", "L. 1233-25", "L. 1233-26",
               "L. 1233-61", "L. 1233-57-3, 2°"]);
      return L.join("\n");
    });

})(typeof window !== "undefined" ? window : this);
