/* Les documents que l'application PRODUIT — module « licenciement économique »,
   volet consultation du comité, entretien préalable, plan de sauvegarde de
   l'emploi, salariés protégés et situations individuelles.

   POURQUOI CE FICHIER EXISTE

   Les fiches de régularisation (moteur/economique/regularisation-eco.js) disent
   à l'employeur quel document produire. Elles ne le produisent pas. Un employeur
   à qui l'on annonce qu'il lui fallait « une convocation du comité et un ordre
   du jour » n'a toujours ni l'une ni l'autre, et le dossier qu'il déposera n'en
   portera pas davantage. Ce fichier écrit le document lui-même, au nom de
   l'entreprise, avec les dates de son dossier, et un calendrier calculé à partir
   d'elles.

   CE QUI COMMANDE TOUT ICI : LE RÉGIME

   Rien, dans cette matière, ne se dit sans le régime. Le même projet ouvre une
   réunion ou deux, un délai d'avis d'un mois ou de quatre, une information de
   l'autorité administrative ou une notification préalable, un entretien
   préalable ou sa dispense, un plan de sauvegarde de l'emploi ou rien. Les
   documents ne recalculent jamais ce régime : ils le demandent au moteur du
   module (MoteurEco.moteur.regimeEco), qui l'a déjà dit dans le rapport. Deux
   réponses différentes à la même question, dans le rapport et dans le document,
   se remarqueraient tout de suite. Quand le moteur n'est pas chargé — la page
   des documents peut l'être seule —, le document énonce les deux branches au
   lieu d'en choisir une au hasard.

   CE QUI NE SE RATTRAPE PAS

   Plusieurs irrégularités de cette procédure sont acquises dès qu'elles sont
   commises. Une lettre de licenciement expédiée avant la décision de validation
   ou d'homologation frappe la rupture de nullité, et le texte le dit en toutes
   lettres : l'employeur « ne peut procéder, à peine de nullité, à la rupture des
   contrats de travail avant la notification de cette décision » (L. 1233-39).
   Une réunion tenue trop tôt ne se déplace pas. Une consultation conduite devant
   l'instance incompétente ne se valide pas rétroactivement. Les documents
   concernés commencent donc par un encadré « CE QUI NE SE RATTRAPE PAS » : ce
   qui suit ne répare pas, il CONSTATE et il prépare la suite.

   CE QUI EST ÉCRIT, CE QUI RESTE ENTRE CROCHETS

   Aucun article n'est cité qui ne figure pas dans moteur/economique/textes_eco.json
   ou dans le fondement du contrôle. Les articles que le corpus ne porte pas sont
   NOMMÉS quand un texte lu y renvoie, jamais reproduits ni paraphrasés : le
   document dit alors, en toutes lettres, que l'application ne les a pas lus.

   Aucune peine n'est annoncée. Le corpus du module ne porte aucun article de
   sanction pénale : ce qui se joue est donc dit tel que les textes lus le
   disent — nullité de la procédure (L. 1235-10), poursuite du contrat ou
   réintégration (L. 1235-11), indemnité calculée en fonction du préjudice subi
   (L. 1235-12), indemnité non inférieure aux salaires des six derniers mois
   (L. 1235-16).

   Aucun fait n'est inventé. Le motif économique de l'entreprise, ses chiffres,
   l'identité des salariés concernés, le contenu de ses mesures : tout cela sort
   ENTRE CROCHETS, avec la consigne de l'écrire daté, chiffré et circonstancié.
   Un document qui devinerait ces éléments ferait signer à l'employeur des faits
   qu'il n'a pas déclarés — et c'est sur ces faits que le juge statue.

   LES DÉLAIS SE DISENT AVEC LEUR POINT DE DÉPART, et se calculent quand une date
   du dossier le permet. « Un mois » ne veut rien dire ; « un mois à compter de
   la première réunion du 23 mars 2026, soit le 23 avril 2026 » se vérifie.  */
(function (global) {
  "use strict";

  var A = global.DocumentsProduits;
  if (!A || typeof A.ajouter !== "function")
    throw new Error("documents-eco-cse.js : documents-produits.js doit être chargé avant.");
  var O = A.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  /* ═══════════════════════════════════════════ le moteur du module, s'il est là

     C'est lui qui dit le régime, le nombre de réunions, le délai d'avis, si
     l'entretien préalable est dû, si un plan est dû, et quel dispositif
     d'accompagnement l'effectif commande. Les documents ne refont aucun de ces
     calculs. Quand la page ne l'a pas chargé, les fonctions ci-dessous rendent
     null et le document énonce les branches du texte au lieu de trancher. */
  function moteur() {
    return (global.MoteurEco && global.MoteurEco.moteur) || null;
  }
  function regime(f) {
    var M = moteur();
    if (!M || typeof M.regimeEco !== "function") return null;
    try { return M.regimeEco(f || {}); } catch (e) { return null; }
  }
  function entretien(f) {
    var M = moteur();
    if (!M || typeof M.entretienDu !== "function") return null;
    try { return M.entretienDu(f || {}); } catch (e) { return null; }
  }
  function accompagnement(f) {
    var M = moteur();
    if (!M || typeof M.accompagnement !== "function") return null;
    try { return M.accompagnement(f || {}); } catch (e) { return null; }
  }
  function ordreDe(cat) {
    var M = moteur();
    if (!M || typeof M.ordre !== "function") return null;
    try { return M.ordre(cat); } catch (e) { return null; }
  }

  /* ═══════════════════════════════════════════════════ les outils du module */

  function nbf(x) {
    if (typeof x === "number") return isFinite(x) ? x : null;
    if (typeof x !== "string" || x.trim() === "") return null;
    var n = Number(x.replace(/\s/g, "").replace(",", "."));
    return isFinite(n) ? n : null;
  }

  /* Les dates de la fiche sont des chaînes « AAAA-MM-JJ ». On les découpe à la
     main : « new Date("2026-06-01") » se lit en temps universel, et sur un poste
     à l'ouest de Greenwich la date affichée reculait d'un jour. */
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
    return iso(dans(d, n));
  }
  /* Le dernier jour du mois d'arrivée quand le quantième n'existe pas : la règle
     du moteur (ajouteMois), reprise à l'identique pour ne pas en avoir deux. */
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
  /* Cinq jours ouvrables, sept, quinze : le samedi compte, le dimanche non. Les
     jours fériés ne sont pas retirés ici — le moteur, lui, les retire (il porte
     le calendrier des onze fériés, Pâques comprise). Le document le dit au lieu
     de laisser croire à un calcul complet. */
  function plusOuvrables(s, n) {
    var M = moteur();
    if (M && typeof M.ajouteJoursOuvrables === "function" && dISO(s)) {
      try { return M.ajouteJoursOuvrables(s, n); } catch (e) { /* on retombe */ }
    }
    var d = dISO(s);
    if (!d) return null;
    var reste = n;
    while (reste > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) reste--;
    }
    return iso(d);
  }
  /* Le calcul des jours ouvrables est-il celui du moteur, fériés compris ? */
  function ouvrablesExacts() {
    var M = moteur();
    return !!(M && typeof M.ajouteJoursOuvrables === "function");
  }

  /* ── la mise en forme, reprise du module voisin ─────────────────────────── */

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
    L.push("chiffré, circonstancié — et ne laissez aucun crochet dans la pièce que vous");
    L.push("versez au dossier. Un crochet resté dans une convocation se lit comme un");
    L.push("aveu d'improvisation.");
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
    var p = ctx.profil || {}, f = ctx.fiche || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }
  function ville(ctx) { return cro((ctx.profil || {}).ville, "lieu"); }
  function signataire(ctx) { return cro((ctx.profil || {}).responsable, "Nom et qualité du représentant légal"); }
  function effectifDe(ctx) {
    var p = ctx.profil || {}, f = ctx.fiche || {};
    var e = nbf(f.effectif);
    if (e === null) e = nbf(p.effectif);
    return e;
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
  function estDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(String(s == null ? "" : s).trim()); }
  function voie(f) { return ((f || {}).pse || {}).voie || null; }
  function voieEnClair(f) {
    var v = voie(f);
    return v === "accord" ? "accord collectif majoritaire (L. 1233-24-1), soumis à validation"
      : v === "unilateral" ? "document unilatéral de l'employeur (L. 1233-24-4), soumis à homologation"
      : "[voie non arrêtée : accord collectif majoritaire ou document unilatéral]";
  }
  /* Le délai d'avis, en mois, tel que le régime le fixe — et rien d'autre. Le
     régime de l'entreprise de moins de cinquante salariés n'exprime pas son
     délai en mois : le document ne lui en invente pas un. */
  function delaiAvisMois(r) {
    if (!r) return null;
    var M = moteur();
    if (M && typeof M.delaiAvisMois === "function") {
      try { return M.delaiAvisMois(r); } catch (e) { /* on retombe */ }
    }
    var d = String(r.delaiAvis || "");
    if (/quatre mois/.test(d)) return 4;
    if (/trois mois/.test(d)) return 3;
    if (/deux mois/.test(d)) return 2;
    if (/un mois/.test(d)) return 1;
    return null;
  }

  /* Le rappel du dossier, en tête de chaque document : en six lignes, ce que
     l'audit a lu, et donc pourquoi ce document est adressé à cet employeur. */
  function rappelDossier(L, ctx) {
    var f = ctx.fiche || {}, r = regime(f);
    var eff = effectifDe(ctx), n = nbLic(f), rs = reunions(f);
    L.push("LE DOSSIER, TEL QUE L'AUDIT L'A LU");
    L.push("");
    L.push("  Entreprise ................. " + nom(ctx));
    L.push("  Effectif ................... " + (eff === null ? "[effectif non renseigné]" : eff + " salariés"));
    L.push("  Licenciements envisagés .... " + (n === null ? "[nombre non renseigné]"
      : n + " sur une même période de trente jours"));
    L.push("  Convocation du comité ...... " + jour(f.dateInfoCSE, "date non renseignée"));
    L.push("  Réunions du comité ......... " + (rs.length
      ? rs.map(function (x) { return jour(x); }).join(" · ")
      : "[aucune date de réunion renseignée]"));
    L.push("  Avis du comité ............. " + (estDate(f.dateAvisCSE) ? jour(f.dateAvisCSE)
      : (f.dateAvisCSE ? String(f.dateAvisCSE) : "[non renseigné]")));
    L.push("  Notification envisagée ..... " + jour(f.dateNotification, "date non renseignée"));
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

  /* La liste des destinataires : elle va avec chaque convocation. Une réunion
     dont un membre n'a pas été convoqué est une réunion attaquable, et c'est la
     pièce la plus souvent absente du dossier. */
  function destinataires(L, ctx, central) {
    L.push("LISTE DES DESTINATAIRES — à compléter et à conserver au dossier");
    L.push("");
    L.push("  Membres titulaires de la délégation du personnel : [noms, un par ligne]");
    L.push("  Membres suppléants : [noms — les convoquer, même s'ils n'assistent qu'en");
    L.push("  l'absence du titulaire, est la seule façon de prouver qu'ils l'ont été]");
    L.push("  Représentant syndical au comité, le cas échéant : [nom]");
    if (central) {
      L.push("  Membres du comité social et économique central : [noms]");
      L.push("  Membres de chaque comité d'établissement intéressé : [noms, par");
      L.push("  établissement]");
    }
    L.push("  Le médecin du travail et l'agent de contrôle de l'inspection du travail,");
    L.push("  pour les points portant sur la santé, la sécurité et les conditions de");
    L.push("  travail : [à compléter — l'application n'a pas lu au code du travail la");
    L.push("  disposition qui règle cette convocation et ne l'affirme donc pas]");
    L.push("");
    L.push("  Moyen d'envoi : [remise en main propre contre décharge · lettre");
    L.push("  recommandée · courriel avec accusé de réception] — le moyen doit conférer");
    L.push("  date certaine, c'est cette date qui se discute.");
    L.push("");
    L.push("  Date d'envoi : ....................  Décharges signées : ☐");
    L.push("");
  }

  function doc(id, nomDoc, detail, produire) {
    A.ajouter(id, { nom: nomDoc, detail: detail, produire: produire });
  }

  /* ═════════════════════════════════════ LES GÉNÉRATEURS — un par contrôle */

  /* ══════════════════════════════════════════════════════════════════════
     LA CONSULTATION DU COMITÉ
     ══════════════════════════════════════════════════════════════════════ */

  /* Le corpus du module ne porte pas l'article qui règle l'établissement de
     l'ordre du jour du comité (L. 2315-29 n'est pas dans textes_eco.json et
     n'est le fondement d'aucun de ces contrôles). L'ordre du jour est donc
     produit avec deux emplacements de signature, et le document dit qu'il n'a
     pas lu la règle au lieu de l'énoncer de mémoire. */
  doc("CTL-CSE-01",
    "La convocation du comité, l'ordre du jour et le procès-verbal",
    "La convocation datée, l'ordre du jour présenté à la signature conjointe, " +
    "la liste des destinataires, la trame du procès-verbal de chaque réunion et " +
    "le calendrier calculé sur les dates de votre dossier.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f), n = nbLic(f), eff = effectifDe(ctx);
      var attendues = r ? r.reunions : null;

      L = L.concat(entete(ctx, "Convocation du comité social et économique, et ordre du jour",
        "articles L. 1233-8, L. 1233-28, L. 1233-29, L. 1233-30 et L. 1233-31 du code du travail"));

      modeEmploi(L, [
        "La consultation du comité n'est pas une formalité d'accompagnement : elle",
        "est la procédure elle-même. L'article L. 1233-8 vise l'employeur « qui",
        "envisage de procéder » à un licenciement collectif de moins de dix salariés",
        "et lui impose de réunir et de consulter le comité ; l'article L. 1233-28",
        "fait de même au-delà de dix. Le mot « envisage » commande l'ordre des",
        "opérations : la consultation précède la décision, elle ne la commente pas.",
        "",
        "Une consultation tenue après la notification ne régularise donc rien. Ce",
        "document sert à convoquer AVANT — et si une lettre est déjà partie, il ne",
        "faut pas antidater : il faut consigner le calendrier réel et porter le point",
        "à votre conseil.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le régime, et ce qu'il commande");

      if (r) {
        L.push("Régime retenu par l'audit : " + r.libelle + ".");
        L.push("");
        L.push("  Consultation du comité ..... " + (r.consultationCSE ? "due" : "non due dans cette configuration"));
        L.push("  Réunions exigées ........... " + (r.reunions ? r.reunions : "aucune"));
        L.push("  Délai d'avis ............... " + (r.delaiAvis || "non exprimé par le régime"));
        L.push("  Renseignements à joindre ... " + (r.documents || "[selon le texte applicable]"));
        if (r.note) { L.push(""); L.push("  " + r.note); }
        L.push("");
        if (!r.consultationCSE) {
          L.push("ATTENTION — l'audit conclut que la consultation n'est pas due ici. Ne vous");
          L.push("servez de ce document que si votre situation a changé depuis l'audit :");
          L.push("un licenciement supplémentaire dans la même période de trente jours");
          L.push("déplace le régime, et la consultation devient due sans autre avertissement.");
          L.push("");
        }
      } else {
        L.push("Le moteur du module n'est pas chargé : les deux branches du texte sont");
        L.push("énoncées ci-dessous, et c'est à vous — ou au rapport d'audit — de dire");
        L.push("laquelle s'applique.");
        L.push("");
        L.push("  Moins de dix licenciements sur trente jours, entreprise d'au moins onze");
        L.push("  salariés — L. 1233-8 : une réunion, et le comité « rend son avis dans un");
        L.push("  délai qui ne peut être supérieur, à compter de la date de la première");
        L.push("  réunion au cours de laquelle il est consulté, à un mois ». Les");
        L.push("  renseignements sont ceux de L. 1233-10.");
        L.push("");
        L.push("  Au moins dix licenciements sur trente jours — L. 1233-28. Dans une");
        L.push("  entreprise de moins de cinquante salariés, L. 1233-29 : « deux réunions,");
        L.push("  séparées par un délai qui ne peut être supérieur à quatorze jours ».");
        L.push("  Dans une entreprise d'au moins cinquante salariés, L. 1233-30 : « au");
        L.push("  moins deux réunions espacées d'au moins quinze jours », et un délai");
        L.push("  d'avis de deux, trois ou quatre mois selon que les licenciements sont");
        L.push("  inférieurs à cent, compris entre cent et deux cent cinquante, ou au");
        L.push("  moins égaux à deux cent cinquante. Les renseignements sont ceux de");
        L.push("  L. 1233-31.");
        L.push("");
      }

      if (rs.length && attendues !== null) {
        L.push("Vos réunions, telles que la fiche les porte : " +
          rs.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push(rs.length < attendues
          ? "=> " + rs.length + " réunion(s) tenue(s) pour " + attendues + " exigée(s) : la consultation n'est pas achevée."
          : "=> " + rs.length + " réunion(s) tenue(s), le régime en exige " + attendues + ".");
        L.push("");
      } else if (!rs.length) {
        L.push("Aucune date de réunion n'est renseignée dans la fiche : le calendrier de");
        L.push("la fin de ce document part donc de la date d'établissement.");
        L.push("");
      }

      titre(L, "II. La convocation");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Remise en main propre contre décharge / lettre recommandée avec avis de");
      L.push("réception [rayer la mention inutile]");
      L.push("");
      L.push("Objet : convocation à la réunion du comité social et économique — projet de");
      L.push("licenciement collectif pour motif économique");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("J'envisage un projet de licenciement collectif pour motif économique portant");
      L.push("sur " + (n === null ? "[nombre de licenciements envisagés]" : n) + " salarié(s) dans une même période de trente jours" +
        (eff === null ? "" : ", l'effectif de l'entreprise étant de " + eff + " salariés") + ".");
      L.push("");
      L.push("Conformément " + (r && r.textes && r.textes.length
        ? "aux articles " + r.textes.join(", ")
        : "aux articles L. 1233-8 et L. 1233-28") + " du code du travail, je réunis et");
      L.push("consulte le comité social et économique, et vous convoque à ce titre à la");
      L.push("réunion du [DATE DE LA RÉUNION], à [HEURE], à [LIEU].");
      L.push("");
      L.push("Vous trouverez joints à la présente convocation l'ordre du jour et");
      L.push("l'ensemble des renseignements que le code du travail impose d'adresser");
      L.push("« avec la convocation » — la liste en est reprise dans le document");
      L.push("d'information joint. Ils vous sont adressés avec la convocation, et non");
      L.push("remis en séance, afin que le comité dispose d'un temps réel d'examen.");
      L.push("");
      L.push("[Le cas échéant : un projet de plan de sauvegarde de l'emploi est également");
      L.push("joint, l'article L. 1233-32 imposant, dans les entreprises d'au moins");
      L.push("cinquante salariés, que l'employeur adresse « le plan de sauvegarde de");
      L.push("l'emploi » aux représentants du personnel outre les renseignements de");
      L.push("l'article L. 1233-31.]");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : ordre du jour · document d'information portant les");
      L.push("renseignements exigés · [le cas échéant] projet de plan de sauvegarde de");
      L.push("l'emploi · [le cas échéant] exposé des conséquences en matière de santé, de");
      L.push("sécurité et de conditions de travail");
      L.push("");

      titre(L, "III. L'ordre du jour");

      L.push("ORDRE DU JOUR DE LA RÉUNION DU [DATE]");
      L.push("Comité social et économique de " + nom(ctx));
      L.push("");
      L.push("  1. Information du comité sur le projet de licenciement collectif pour");
      L.push("     motif économique, et remise des renseignements prévus par le code du");
      L.push("     travail.");
      L.push("  2. Consultation sur l'opération projetée et ses modalités d'application.");
      L.push("  3. Consultation sur le projet de licenciement collectif : nombre de");
      L.push("     suppressions d'emploi, catégories professionnelles concernées,");
      L.push("     critères d'ordre, calendrier prévisionnel des licenciements.");
      L.push("  4. [Le cas échéant] Consultation sur les mesures sociales");
      L.push("     d'accompagnement prévues par le plan de sauvegarde de l'emploi.");
      L.push("  5. [Le cas échéant] Conséquences des licenciements projetés en matière de");
      L.push("     santé, de sécurité ou de conditions de travail.");
      L.push("  6. Recueil des suggestions et propositions alternatives du comité.");
      L.push("  7. [Le cas échéant] Décision du comité de recourir à une expertise.");
      L.push("  8. Avis du comité.");
      L.push("");
      L.push("Les points 2 à 5 reprennent, dans leur ordre, les objets que l'article");
      L.push("L. 1233-30, I énumère : « 1° L'opération projetée et ses modalités");
      L.push("d'application » ; « 2° Le projet de licenciement collectif : le nombre de");
      L.push("suppressions d'emploi, les catégories professionnelles concernées, les");
      L.push("critères d'ordre et le calendrier prévisionnel des licenciements, les");
      L.push("mesures sociales d'accompagnement prévues par le plan de sauvegarde de");
      L.push("l'emploi et, le cas échéant, les conséquences des licenciements projetés en");
      L.push("matière de santé, de sécurité ou de conditions de travail ».");
      L.push("");
      L.push("Le point 6 n'est pas décoratif : l'article L. 1233-33 oblige l'employeur à");
      L.push("mettre à l'étude les suggestions relatives aux mesures sociales envisagées");
      L.push("et les propositions alternatives formulées par le comité, et à leur donner");
      L.push("« une réponse motivée ». Une réunion qui ne les recueille pas prive cette");
      L.push("obligation d'objet.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE]");
      L.push("");
      L.push("Pour l'employeur                        Le secrétaire du comité");
      L.push(pad(signataire(ctx), 40) + "[nom du secrétaire]");
      L.push("");
      L.push("");
      L.push("L'application n'a pas lu, dans le corpus de ce module, la disposition du");
      L.push("code du travail qui règle l'établissement de l'ordre du jour du comité :");
      L.push("elle ne la cite donc pas et n'en énonce pas le contenu. Vérifiez-la, ainsi");
      L.push("que le règlement intérieur de votre comité, avant d'envoyer — les deux");
      L.push("emplacements de signature ci-dessus sont prévus pour cela.");
      L.push("");

      titre(L, "IV. À qui la convocation est adressée");
      destinataires(L, ctx, false);

      titre(L, "V. Le procès-verbal de chaque réunion");

      L.push("Le procès-verbal n'est pas un compte rendu de courtoisie : c'est la pièce");
      L.push("qui établit que la consultation a eu lieu, ce qui y a été dit et ce que le");
      L.push("comité a répondu. Et l'article L. 1233-48 impose que ces procès-verbaux");
      L.push("soient adressés à l'autorité administrative : « L'employeur lui adresse");
      L.push("également les procès-verbaux des réunions. Ces procès-verbaux comportent");
      L.push("les avis, suggestions et propositions des représentants du personnel. »");
      L.push("");
      L.push("PROCÈS-VERBAL DE LA RÉUNION DU [DATE]");
      L.push("");
      L.push("  Date, heure d'ouverture et de clôture : ..............................");
      L.push("  Présents (employeur et personnes l'assistant) : ......................");
      L.push("  Présents (délégation du personnel, titulaires et suppléants) : .......");
      L.push("  Absents excusés : ....................................................");
      L.push("  Ordre du jour rappelé : ..............................................");
      L.push("");
      L.push("  Renseignements remis ou rappelés, point par point : [reprendre la liste");
      L.push("  du document d'information et pointer chacun des sept points]");
      L.push("");
      L.push("  Questions posées par les membres, et réponses apportées : [transcrire —");
      L.push("  une question restée sans réponse au procès-verbal est une question");
      L.push("  restée sans réponse]");
      L.push("");
      L.push("  Suggestions relatives aux mesures sociales et propositions alternatives");
      L.push("  formulées par le comité (L. 1233-33) : [transcrire chacune]");
      L.push("  Réponse motivée de l'employeur, ou date à laquelle elle sera apportée :");
      L.push("  [à écrire — le texte exige une réponse motivée, non un accusé de");
      L.push("  réception]");
      L.push("");
      L.push("  [Le cas échéant] Décision de recourir à une expertise : ...............");
      L.push("  [Le cas échéant] Avis rendu, et résultat du vote : ....................");
      L.push("");
      L.push("  Signature du secrétaire : ............  Signature de l'employeur : ....");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var depart = rs.length ? rs[0] : null;
      var mois = delaiAvisMois(r);

      L.push("Aujourd'hui, " + leJour(d0) + " — vous adressez la convocation, l'ordre du");
      L.push("jour et les renseignements. Ils partent ENSEMBLE : le code impose de les");
      L.push("adresser « avec la convocation », et c'est le seul point de ce calendrier");
      L.push("qui ne souffre aucun aménagement.");
      L.push("");
      L.push("Ensuite — la première réunion. Le code ne fixe ici aucun délai chiffré");
      L.push("entre la convocation et la séance ; mais les renseignements devant parvenir");
      L.push("avec la convocation, une réunion tenue à deux ou trois jours prive le");
      L.push("comité de tout examen, et c'est sur ce terrain que la consultation est");
      L.push("attaquée. Prévoyez le délai de votre règlement intérieur de comité.");
      L.push("");
      if (depart) {
        L.push("Votre première réunion s'est tenue le " + jour(depart) + ".");
        if (mois) {
          L.push("Le délai d'avis de " + (r && r.delaiAvis ? r.delaiAvis : mois + " mois") + " court de cette date : il expire le");
          L.push(jour(plusMois(depart, mois)) + ". À cette date, faute d'avis, le comité est réputé");
          L.push("avoir été consulté.");
        } else if (r && r.code === "GRAND_PETITE_ENTREPRISE") {
          L.push("Le régime n'exprime pas le délai en mois : il impose deux réunions séparées");
          L.push("d'un délai qui ne peut être supérieur à quatorze jours (L. 1233-29). La");
          L.push("seconde réunion ne peut donc se tenir après le " + jour(plusJours(depart, 14)) + ".");
        }
        L.push("");
      } else {
        L.push("Aucune réunion n'est encore tenue. Dès que la première le sera, c'est de sa");
        L.push("date — et d'aucune autre — que courra le délai d'avis.");
        L.push("");
      }
      if (rs.length >= 2) {
        var e = ecart(rs[0], rs[1]);
        L.push("Intervalle entre vos deux premières réunions : " + e + " jours. Le contrôle");
        L.push("CTL-CSE-02 et son document le confrontent au régime.");
        L.push("");
      }
      L.push("Enfin — la notification. Aucune lettre ne part avant que le comité ait rendu");
      L.push("son avis ou soit réputé consulté : c'est l'objet du contrôle CTL-CSE-04 et");
      L.push("de son document.");

      pied(L, ["L. 1233-8", "L. 1233-28", "L. 1233-29", "L. 1233-30", "L. 1233-31",
        "L. 1233-32", "L. 1233-33", "L. 1233-48"],
        "Ce qui se joue si la consultation manque : l'article L. 1235-12 permet au juge\n" +
        "d'accorder au salarié compris dans un licenciement collectif « une indemnité à\n" +
        "la charge de l'employeur calculée en fonction du préjudice subi » en cas de\n" +
        "non-respect des procédures de consultation des représentants du personnel. Et\n" +
        "lorsqu'un plan de sauvegarde de l'emploi est dû, l'article L. 1235-10 attache\n" +
        "la nullité au licenciement intervenu en l'absence de décision de validation ou\n" +
        "d'homologation.");
      return L.join("\n");
    });

  doc("CTL-CSE-02",
    "Le calendrier de consultation, réunion par réunion",
    "Vos dates réelles confrontées à l'intervalle que le régime impose, le " +
    "courrier fixant la réunion manquante, et le constat écrit si l'intervalle " +
    "est déjà dépassé.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var e = rs.length >= 2 ? ecart(rs[0], rs[1]) : null;
      var code = r ? r.code : null;
      var trop = code === "GRAND_PETITE_ENTREPRISE" && e !== null && e > 14;
      var pasAssez = code === "GRAND_COLLECTIF" && e !== null && e < 15;

      L = L.concat(entete(ctx, "Calendrier de consultation du comité, réunion par réunion",
        "articles L. 1233-29 et L. 1233-30 du code du travail"));

      if (trop || pasAssez) {
        irrattrapable(L, [
          trop
            ? "Vos deux réunions sont séparées de " + e + " jours. L'article L. 1233-29 dispose que le comité « tient deux réunions, séparées par un délai qui ne peut être supérieur à quatorze jours ». Le dépassement est acquis : une troisième réunion ne l'efface pas, elle s'y ajoute."
            : "Vos deux réunions sont séparées de " + e + " jours. L'article L. 1233-30, I dispose que le comité « tient au moins deux réunions espacées d'au moins quinze jours ». L'espacement minimal n'a pas été tenu, et une réunion tenue trop tôt ne se déplace pas après coup.",
          "",
          "Antidater une convocation ou refaire la seconde réunion « pour la forme »",
          "aggraverait la situation au lieu de la corriger : la pièce antidatée se",
          "confronte aux décharges, aux courriels et aux procès-verbaux déjà versés.",
        ], "Il consigne le calendrier réel, il vous dit ce qui reste à tenir, et il " +
           "prépare le point à porter à votre conseil.");
      }

      modeEmploi(L, [
        "L'intervalle entre les réunions n'est pas une commodité d'agenda : c'est le",
        "temps que la loi donne au comité pour examiner ce qu'on lui a remis. Deux",
        "régimes, deux règles inverses — un MAXIMUM de quatorze jours dans",
        "l'entreprise de moins de cinquante salariés (L. 1233-29), un MINIMUM de",
        "quinze jours dans celle d'au moins cinquante (L. 1233-30, I). Se tromper de",
        "règle, c'est se tromper dans les deux sens à la fois.",
        "",
        "Ce document relève vos dates, les confronte au régime, et produit le courrier",
        "correspondant : convocation de la réunion manquante, ou constat du calendrier",
        "réel quand l'intervalle est déjà dépassé.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. La règle applicable, dans les termes du texte");

      L.push("Entreprise ou établissement de MOINS de cinquante salariés — L. 1233-29 :");
      L.push("« Dans les entreprises ou établissements employant habituellement moins de");
      L.push("cinquante salariés, l'employeur réunit et consulte le comité social et");
      L.push("économique. Ce dernier tient deux réunions, séparées par un délai qui ne");
      L.push("peut être supérieur à quatorze jours. »");
      L.push("");
      L.push("Entreprise ou établissement d'AU MOINS cinquante salariés — L. 1233-30, I,");
      L.push("dernier alinéa : « Le comité social et économique tient au moins deux");
      L.push("réunions espacées d'au moins quinze jours. »");
      L.push("");
      L.push("Le même article, au II, fixe le délai d'avis : « Le comité social et");
      L.push("économique rend ses deux avis dans un délai qui ne peut être supérieur, à");
      L.push("compter de la date de sa première réunion […], à : 1° Deux mois lorsque le");
      L.push("nombre des licenciements est inférieur à cent ; 2° Trois mois lorsque le");
      L.push("nombre des licenciements est au moins égal à cent et inférieur à deux cent");
      L.push("cinquante ; 3° Quatre mois lorsque le nombre des licenciements est au moins");
      L.push("égal à deux cent cinquante. Une convention ou un accord collectif de");
      L.push("travail peut prévoir des délais différents. En l'absence d'avis du comité");
      L.push("social et économique dans ces délais, celui-ci est réputé avoir été");
      L.push("consulté. »");
      L.push("");
      L.push("Vérifiez donc votre convention et vos accords : ce sont les seuls textes");
      L.push("qui peuvent déplacer ce délai, et l'application ne les lit pas.");
      L.push("");

      titre(L, "II. Vos dates, et ce qu'elles donnent");

      if (!rs.length) {
        L.push("Aucune date de réunion n'est renseignée dans la fiche. L'intervalle ne peut");
        L.push("donc pas être calculé : reportez ci-dessous les dates réelles, lues sur les");
        L.push("convocations et les procès-verbaux, et non de mémoire.");
        L.push("");
        L.push("  Convocation adressée le ......... [AAAA-MM-JJ]");
        L.push("  Première réunion tenue le ....... [AAAA-MM-JJ]");
        L.push("  Seconde réunion tenue le ........ [AAAA-MM-JJ]");
        L.push("  Intervalle .......................  [ ] jours");
        L.push("");
      } else {
        var lignes = rs.map(function (x, i) {
          return ["Réunion " + (i + 1), jour(x),
            i === 0 ? "point de départ du délai d'avis"
              : ecart(rs[0], x) + " jours après la première"];
        });
        tableau(L, ["Réunion", "Date", "Position"], lignes);
        L.push("");
        L.push("Convocation adressée le " + jour(f.dateInfoCSE, "date non renseignée") +
          (dISO(f.dateInfoCSE) && rs.length
            ? ", soit " + ecart(f.dateInfoCSE, rs[0]) + " jours avant la première réunion."
            : "."));
        L.push("");
        if (e === null) {
          L.push("Une seule réunion est renseignée : aucun intervalle n'est contrôlable, et");
          L.push("la seconde reste à tenir si le régime en impose deux.");
        } else if (code === "GRAND_PETITE_ENTREPRISE") {
          L.push("Intervalle : " + e + " jours, pour un maximum de quatorze (L. 1233-29).");
          L.push(e > 14 ? "=> Le maximum est dépassé de " + (e - 14) + " jour(s)."
                        : "=> Le maximum est respecté.");
        } else if (code === "GRAND_COLLECTIF") {
          L.push("Intervalle : " + e + " jours, pour un minimum de quinze (L. 1233-30, I).");
          L.push(e < 15 ? "=> Il manque " + (15 - e) + " jour(s)." : "=> Le minimum est respecté.");
        } else {
          L.push("Intervalle : " + e + " jours. Le régime n'étant pas rappelé ici — le moteur");
          L.push("du module n'est pas chargé —, confrontez ce chiffre au maximum de quatorze");
          L.push("jours de L. 1233-29 ou au minimum de quinze jours de L. 1233-30, I selon");
          L.push("que l'entreprise emploie habituellement moins de cinquante salariés ou non.");
        }
        L.push("");
      }

      if (rs.length && delaiAvisMois(r)) {
        L.push("Délai d'avis : " + r.delaiAvis + " à compter de la première réunion du " +
          jour(rs[0]) + ",");
        L.push("soit une expiration le " + jour(plusMois(rs[0], delaiAvisMois(r))) + ". À cette date, faute d'avis,");
        L.push("le comité est réputé avoir été consulté.");
        L.push("");
      }

      titre(L, "III. Le courrier");

      var manquante = attendu(r, rs);
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      if (trop || pasAssez) {
        L.push("Objet : calendrier des réunions du comité — constat");
        L.push("");
        L.push("Mesdames, Messieurs,");
        L.push("");
        L.push("Les réunions du comité relatives au projet de licenciement collectif se");
        L.push("sont tenues les " + rs.map(function (x) { return jour(x); }).join(" et ") + ", soit un intervalle de " + e + " jours.");
        L.push("");
        L.push(trop
          ? "L'article L. 1233-29 prévoit deux réunions séparées par un délai qui ne peut"
          : "L'article L. 1233-30, I prévoit deux réunions espacées d'au moins quinze");
        L.push(trop ? "être supérieur à quatorze jours. Cet intervalle n'a pas été respecté."
                    : "jours. Cet intervalle n'a pas été respecté.");
        L.push("");
        L.push("Je vous en informe et consigne ce calendrier au dossier. Aucune réunion");
        L.push("nouvelle n'est convoquée dans le seul but d'effacer ce constat : les dates");
        L.push("réelles restent celles qui figurent aux procès-verbaux.");
        L.push("");
        L.push("[Le cas échéant : la suite de la procédure — et notamment la date de");
        L.push("notification — est arrêtée comme suit : décrire.]");
      } else {
        L.push("Objet : convocation à la " + (manquante === 2 ? "seconde" : "prochaine") + " réunion du comité social et économique");
        L.push("");
        L.push("Mesdames, Messieurs,");
        L.push("");
        L.push("À la suite de la réunion du " + (rs.length ? jour(rs[0]) : "[DATE DE LA PREMIÈRE RÉUNION]") +
          ", je vous convoque à la");
        L.push((manquante === 2 ? "seconde" : "prochaine") + " réunion du comité social et économique, qui se tiendra le");
        L.push("[DATE], à [HEURE], à [LIEU].");
        L.push("");
        if (code === "GRAND_PETITE_ENTREPRISE" && rs.length) {
          L.push("Cette date est fixée dans le délai de quatorze jours au plus que l'article");
          L.push("L. 1233-29 impose entre les deux réunions : elle ne peut donc être");
          L.push("postérieure au " + jour(plusJours(rs[0], 14)) + ".");
        } else if (code === "GRAND_COLLECTIF" && rs.length) {
          L.push("Cette date respecte l'espacement d'au moins quinze jours que l'article");
          L.push("L. 1233-30, I impose entre les deux réunions : elle ne peut donc être");
          L.push("antérieure au " + jour(plusJours(rs[0], 15)) + ".");
        } else {
          L.push("[Fixer cette date selon le régime : au plus quatorze jours après la");
          L.push("première réunion dans une entreprise de moins de cinquante salariés");
          L.push("(L. 1233-29) ; au moins quinze jours après elle dans une entreprise d'au");
          L.push("moins cinquante salariés (L. 1233-30, I).]");
        }
        L.push("");
        L.push("L'ordre du jour et les pièces complémentaires vous sont adressés avec la");
        L.push("présente.");
      }
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous relevez les dates réelles sur les");
      L.push("convocations et les procès-verbaux, et vous les inscrivez au tableau du II.");
      L.push("");
      if (rs.length && code === "GRAND_PETITE_ENTREPRISE") {
        L.push("Butoir de la seconde réunion : " + jour(plusJours(rs[0], 14)) + " — quatorze jours après la");
        L.push("première réunion du " + jour(rs[0]) + " (L. 1233-29).");
        L.push("");
      }
      if (rs.length && code === "GRAND_COLLECTIF") {
        L.push("Date la plus proche pour la seconde réunion : " + jour(plusJours(rs[0], 15)) + " — quinze jours");
        L.push("après la première réunion du " + jour(rs[0]) + " (L. 1233-30, I).");
        L.push("");
      }
      if (rs.length && delaiAvisMois(r)) {
        L.push("Expiration du délai d'avis : " + jour(plusMois(rs[0], delaiAvisMois(r))) + ". Aucune notification avant.");
        L.push("");
      }
      L.push("Après l'avis, ou après l'expiration du délai — et pas avant — la");
      L.push("notification devient possible, sous réserve, lorsqu'un plan de sauvegarde");
      L.push("de l'emploi est dû, de la décision de validation ou d'homologation de");
      L.push("l'autorité administrative (L. 1233-39).");

      pied(L, ["L. 1233-29", "L. 1233-30", "L. 1233-39"],
        "Ce qui se joue : l'irrégularité du calendrier de consultation relève des\n" +
        "« procédures de consultation des représentants du personnel » dont l'article\n" +
        "L. 1235-12 sanctionne le non-respect par une indemnité calculée en fonction du\n" +
        "préjudice subi. En régime de plan de sauvegarde de l'emploi, l'autorité\n" +
        "administrative vérifie « la régularité de la procédure d'information et de\n" +
        "consultation du comité social et économique » (L. 1233-57-2, 2° et\n" +
        "L. 1233-57-3) : un calendrier irrégulier se lit dans le dossier de demande.");
      return L.join("\n");
    });

  /* Le nombre de réunions déjà tenues, rapporté à celles que le régime exige :
     sert à dire « seconde réunion » plutôt que « prochaine réunion », ce qui
     n'est pas la même convocation. */
  function attendu(r, rs) {
    var n = r ? r.reunions : null;
    if (!n) return null;
    return rs.length + 1 <= n ? rs.length + 1 : null;
  }

  /* Les sept renseignements, verbatim. Les deux articles disent la même chose à
     un mot près — L. 1233-10, 7° vise « les conséquences des licenciements
     projetés », L. 1233-31, 7° « les conséquences de la réorganisation ». Le
     document reproduit celui qui s'applique, et signale l'écart : ce n'est pas
     une coquette, c'est ce que l'exposé du 7° doit couvrir. */
  var SEPT = [
    { m: "1°", court: "Raisons économiques, financières ou techniques",
      t: "La ou les raisons économiques, financières ou techniques du projet de licenciement" },
    { m: "2°", court: "Nombre de licenciements envisagé",
      t: "Le nombre de licenciements envisagé" },
    { m: "3°", court: "Catégories professionnelles et critères d'ordre proposés",
      t: "Les catégories professionnelles concernées et les critères proposés pour l'ordre des licenciements" },
    { m: "4°", court: "Effectif de l'établissement",
      t: "Le nombre de salariés, permanents ou non, employés dans l'établissement" },
    { m: "5°", court: "Calendrier prévisionnel des licenciements",
      t: "Le calendrier prévisionnel des licenciements" },
    { m: "6°", court: "Mesures de nature économique envisagées",
      t: "Les mesures de nature économique envisagées" },
    { m: "7°", court: "Conséquences en matière de santé, de sécurité ou de conditions de travail",
      t: "Le cas échéant, les conséquences des licenciements projetés en matière de santé, de sécurité ou de conditions de travail",
      t31: "Le cas échéant, les conséquences de la réorganisation en matière de santé, de sécurité ou de conditions de travail" },
  ];

  /* Quel des deux articles porte les renseignements, selon le régime. */
  function articleRenseignements(r) {
    if (!r) return null;
    return r.code === "PETIT_COLLECTIF" ? "L. 1233-10"
      : (r.code === "GRAND_COLLECTIF" || r.code === "GRAND_PETITE_ENTREPRISE") ? "L. 1233-31" : null;
  }

  doc("CTL-CSE-03",
    "La note d'information et de consultation — les sept renseignements",
    "Le document que le code impose d'adresser « avec la convocation » : les " +
    "sept renseignements rédigés point par point, le tableau des catégories et " +
    "des critères d'ordre pondérés, le bordereau de décharge et le courrier de " +
    "transmission.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var art = articleRenseignements(r);
      var n = nbLic(f), eff = effectifDe(ctx);
      var cats = Array.isArray(f.categories) ? f.categories : [];
      var postes = Array.isArray(f.postesSupprimes) ? f.postesSupprimes : [];

      L = L.concat(entete(ctx, "Note d'information et de consultation du comité social et économique",
        art ? "article " + art + " du code du travail"
            : "articles L. 1233-10 et L. 1233-31 du code du travail"));

      modeEmploi(L, [
        "Les deux articles emploient le même mot : l'employeur adresse ces",
        "renseignements « avec la convocation ». Remis en séance, ils ne sont pas",
        "adressés avec la convocation — ils sont découverts en réunion, et le comité",
        "n'a rien pu examiner. C'est le reproche le plus simple à établir de toute",
        "cette procédure : il se lit sur une date.",
        "",
        "Les sept points sont numérotés ci-dessous dans l'ordre du texte. Écrivez",
        "chacun. Un point laissé vide n'est pas un point discret : c'est un",
        "renseignement manquant, et le septième — les conséquences en matière de",
        "santé, de sécurité et de conditions de travail — est dû comme les six",
        "autres.",
        "",
        "N'écrivez ici aucun fait que vous ne puissiez produire. Les raisons",
        "économiques se datent et se chiffrent ; les catégories professionnelles se",
        "définissent ; le calendrier se donne en dates. L'application ne connaît ni",
        "vos chiffres ni vos salariés et n'en invente aucun.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte applicable");

      if (art === "L. 1233-10") {
        L.push("Régime de moins de dix licenciements sur trente jours — L. 1233-10 :");
        L.push("« L'employeur adresse aux représentants du personnel, avec la convocation à");
        L.push("la réunion prévue à l'article L. 1233-8, tous renseignements utiles sur le");
        L.push("projet de licenciement collectif. »");
      } else if (art === "L. 1233-31") {
        L.push("Régime d'au moins dix licenciements sur trente jours — L. 1233-31 :");
        L.push("« L'employeur adresse aux représentants du personnel, avec la convocation à");
        L.push("la première réunion, tous renseignements utiles sur le projet de");
        L.push("licenciement collectif. »");
      } else {
        L.push("Le moteur du module n'est pas chargé : les deux textes sont rappelés, et");
        L.push("c'est le nombre de licenciements sur trente jours qui décide.");
        L.push("");
        L.push("L. 1233-10 — moins de dix licenciements : « L'employeur adresse aux");
        L.push("représentants du personnel, avec la convocation à la réunion prévue à");
        L.push("l'article L. 1233-8, tous renseignements utiles sur le projet de");
        L.push("licenciement collectif. »");
        L.push("");
        L.push("L. 1233-31 — au moins dix licenciements : « L'employeur adresse aux");
        L.push("représentants du personnel, avec la convocation à la première réunion,");
        L.push("tous renseignements utiles sur le projet de licenciement collectif. »");
      }
      L.push("");
      L.push("Les deux articles énumèrent ensuite les mêmes sept points, à un mot près");
      L.push("au septième : L. 1233-10 vise « les conséquences des licenciements");
      L.push("projetés », L. 1233-31 « les conséquences de la réorganisation ». Écrivez");
      L.push("ce que votre régime commande — et, dans le doute, couvrez les deux.");
      L.push("");
      if (dISO(f.dateInfoCSE) && rs.length) {
        L.push("Dans votre dossier, la convocation a été adressée le " + jour(f.dateInfoCSE) + " et la");
        L.push("première réunion s'est tenue le " + jour(rs[0]) + ", soit " + ecart(f.dateInfoCSE, rs[0]) + " jours plus tard.");
        L.push("La présente note doit avoir suivi le même chemin, à la même date.");
        L.push("");
      }

      titre(L, "II. Les sept renseignements");

      SEPT.forEach(function (p) {
        L.push("── " + p.m + " — " + p.court + " ──");
        L.push("");
        L.push("Texte : « " + (art === "L. 1233-31" && p.t31 ? p.t31 : p.t) + ". »");
        if (p.m === "7°" && art !== "L. 1233-10") {
          L.push("(L. 1233-10, 7° écrit pour sa part : « " + p.t + ". »)");
        }
        L.push("");
        if (p.m === "1°") {
          L.push("  [Écrire ici les raisons économiques, financières ou techniques du projet.");
          L.push("  Datées, chiffrées, circonstanciées : quelle activité, sur quel périmètre,");
          L.push("  quels indicateurs, sur quelles périodes comparées, avec quelles pièces à");
          L.push("  l'appui. Une phrase générale sur « le contexte du marché » n'est pas un");
          L.push("  renseignement : c'est une absence de renseignement rédigée.]");
          L.push("");
          L.push("  [Pièces annexées à ce point : liasse fiscale, comptes, tableau");
          L.push("  trimestriel comparé, comptes consolidés du groupe le cas échéant.]");
        } else if (p.m === "2°") {
          L.push("  Nombre de licenciements envisagé : " +
            (n === null ? "[nombre — à écrire en chiffres]" : n) + ".");
          if (nbf(f.licenciementsRecents30j)) {
            L.push("  Dont " + nbf(f.licenciementsRecents30j) + " licenciement(s) déjà prononcé(s) dans la même");
            L.push("  période de trente jours.");
          }
          if (nbf(f.refusModification)) {
            L.push("  Dont " + nbf(f.refusModification) + " salarié(s) dont le licenciement est envisagé après refus");
            L.push("  d'une modification d'un élément essentiel de leur contrat.");
          }
          L.push("  [Vérifier que ce nombre est celui de la période de trente jours : c'est");
          L.push("  lui qui commande le régime, et donc tout ce document.]");
        } else if (p.m === "3°") {
          L.push("  Les catégories professionnelles concernées, et les critères proposés");
          L.push("  pour l'ordre des licenciements. Le tableau du III les porte.");
        } else if (p.m === "4°") {
          L.push("  Nombre de salariés employés dans l'établissement : " +
            (nbf(f.effectifEtablissement) === null
              ? "[effectif de l'établissement]" : nbf(f.effectifEtablissement)) + ".");
          L.push("  Dont permanents : [nombre] · non permanents : [nombre — contrats à durée");
          L.push("  déterminée, intérimaires, saisonniers].");
          if (eff !== null) L.push("  Effectif de l'entreprise, pour mémoire : " + eff + " salariés.");
          L.push("  [Le texte demande l'effectif de l'ÉTABLISSEMENT, permanents ou non :");
          L.push("  donner celui de l'entreprise à sa place ne répond pas au 4°.]");
        } else if (p.m === "5°") {
          L.push("  Calendrier prévisionnel des licenciements :");
          L.push("");
          L.push("    Réunion(s) du comité ................. " +
            (rs.length ? rs.map(function (x) { return jour(x); }).join(" · ") : "[dates]"));
          L.push("    Avis du comité, ou expiration du délai  [date]");
          L.push("    Information ou notification à l'autorité administrative  " +
            jour(f.dateNotifAdmin, "date"));
          L.push("    Entretiens préalables, s'ils sont dus .. [dates]");
          L.push("    Notification des licenciements ........ " + jour(f.dateNotification, "date"));
          L.push("    Fin des préavis ....................... [dates]");
          L.push("");
          L.push("  [Ce calendrier est prévisionnel : il n'engage pas la date exacte, mais");
          L.push("  il doit être cohérent avec les délais du régime. Un calendrier qui place");
          L.push("  la notification avant l'avis se lit comme l'annonce d'une irrégularité.]");
        } else if (p.m === "6°") {
          L.push("  Mesures de nature économique envisagées :");
          L.push("");
          L.push("  [Écrire les mesures : réduction du recours aux contrats précaires et à");
          L.push("  l'intérim, non-remplacement des départs, réduction des heures");
          L.push("  supplémentaires, aménagement du temps de travail, mobilité interne,");
          L.push("  départs volontaires, reclassements. Pour chacune : ce qu'elle est,");
          L.push("  combien de postes elle préserve, à quelle échéance.]");
          if (Array.isArray(f.precaires) && f.precaires.length) {
            L.push("");
            L.push("  La fiche déclare " + f.precaires.length + " situation(s) de contrat précaire ou d'intérim");
            L.push("  dans le périmètre : " + f.precaires.map(function (x) {
              return cro(x.emploi, "emploi") + (x.type ? " (" + x.type + ")" : "");
            }).join(", ") + ". Dire ce qu'il en advient est le premier");
            L.push("  contenu attendu de ce point.");
          }
        } else if (p.m === "7°") {
          L.push("  [Exposer les conséquences du projet en matière de santé, de sécurité ou");
          L.push("  de conditions de travail — pour les salariés dont le licenciement est");
          L.push("  envisagé ET pour ceux qui restent, dont la charge se redistribue. Le");
          L.push("  document du contrôle CTL-CSE-10 développe ce point ; joignez-le.]");
          if (String(f.consequencesSSCT || "").trim()) {
            L.push("");
            L.push("  La fiche porte à ce titre : « " + String(f.consequencesSSCT).trim() + " ».");
            L.push("  [Le reprendre et le développer poste par poste, service par service.]");
          } else {
            L.push("");
            L.push("  La fiche ne porte rien à ce titre. Ce point ne peut pas rester vide :");
            L.push("  c'est le septième renseignement, dû comme les six autres.");
          }
        }
        L.push("");
      });

      titre(L, "III. Catégories professionnelles et critères d'ordre");

      L.push("Le 3° ne demande pas seulement la liste des catégories : il demande « les");
      L.push("critères proposés pour l'ordre des licenciements ». Le mot « proposés »");
      L.push("dit l'ordre des opérations — l'article L. 1233-5 précise que l'employeur");
      L.push("définit les critères « après consultation du comité social et");
      L.push("économique ». Ce tableau est donc une proposition soumise au comité, non");
      L.push("une décision déjà prise.");
      L.push("");
      L.push("Les critères que l'article L. 1233-5 énumère, et dont il dit qu'ils sont");
      L.push("« notamment » pris en compte :");
      L.push("");
      L.push("  1° Les charges de famille, en particulier celles des parents isolés ;");
      L.push("  2° L'ancienneté de service dans l'établissement ou l'entreprise ;");
      L.push("  3° La situation des salariés qui présentent des caractéristiques sociales");
      L.push("     rendant leur réinsertion professionnelle particulièrement difficile,");
      L.push("     notamment celle des personnes handicapées et des salariés âgés ;");
      L.push("  4° Les qualités professionnelles appréciées par catégorie.");
      L.push("");
      L.push("Le même article ajoute : « L'employeur peut privilégier un de ces critères,");
      L.push("à condition de tenir compte de l'ensemble des autres critères prévus au");
      L.push("présent article. » Privilégier n'est donc pas écarter : une pondération qui");
      L.push("affecte zéro point à un critère ne le prend pas en compte.");
      L.push("");
      L.push("Le texte réserve enfin la convention ou l'accord collectif : les critères");
      L.push("légaux ne s'appliquent qu'« en l'absence de convention ou accord collectif");
      L.push("de travail applicable ». Vérifiez le vôtre — l'application ne le lit pas.");
      if (f.convention && f.convention.criteresOrdre === true) {
        L.push("La fiche déclare que votre convention porte des critères d'ordre : ce sont");
        L.push("eux qui s'appliquent, et le tableau ci-dessous doit être refait sur leur");
        L.push("base.");
      }
      L.push("");
      L.push("Périmètre d'application retenu : " + cro(f.perimetreOrdre, "périmètre à préciser") + ".");
      L.push("L. 1233-5 : « Le périmètre d'application des critères d'ordre des");
      L.push("licenciements peut être fixé par un accord collectif. En l'absence d'un tel");
      L.push("accord, ce périmètre ne peut être inférieur à celui de chaque zone");
      L.push("d'emplois dans laquelle sont situés un ou plusieurs établissements de");
      L.push("l'entreprise concernés par les suppressions d'emplois. »");
      L.push("");
      L.push("PONDÉRATION PROPOSÉE — à compléter et à soumettre au comité");
      L.push("");
      tableau(L, ["Critère (L. 1233-5)", "Points proposés", "Comment il est apprécié"], [
        ["1° Charges de famille", "[  ]", "[barème : nombre de personnes à charge, parent isolé]"],
        ["2° Ancienneté", "[  ]", "[barème : par tranche d'ancienneté, arrêtée à quelle date]"],
        ["3° Réinsertion difficile", "[  ]", "[handicap, âge, autres caractéristiques sociales]"],
        ["4° Qualités professionnelles", "[  ]", "[éléments objectifs et vérifiables, par catégorie]"],
        ["[Critère conventionnel, le cas échéant]", "[  ]", "[référence de la clause]"],
      ]);
      L.push("");

      if (!cats.length) {
        L.push("Aucune catégorie professionnelle n'est renseignée dans la fiche. Reportez");
        L.push("ci-dessous, catégorie par catégorie : l'intitulé, l'effectif, le nombre de");
        L.push("suppressions envisagées, puis salarié par salarié la note de chacun des");
        L.push("quatre critères et le total.");
        L.push("");
        L.push("  Catégorie : [intitulé] — effectif [  ] — suppressions envisagées [  ]");
        L.push("");
        tableau(L, ["Salarié", "1° Charges", "2° Ancienneté", "3° Social", "4° Qualités", "Total"],
          [["[nom ou matricule]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]"],
           ["[nom ou matricule]", "[ ]", "[ ]", "[ ]", "[ ]", "[ ]"]]);
        L.push("");
      } else {
        cats.forEach(function (c) {
          var sal = Array.isArray(c.salaries) ? c.salaries : [];
          L.push("── Catégorie : " + cro(c.nom, "intitulé de la catégorie") + " ──");
          L.push("  Effectif de la catégorie ....... " +
            (nbf(c.effectif) === null ? (sal.length ? sal.length + " (déduit des salariés notés)" : "[effectif]") : nbf(c.effectif)));
          L.push("  Suppressions envisagées ........ " +
            (nbf(c.suppressions) === null ? "[nombre]" : nbf(c.suppressions)));
          L.push("");
          if (!sal.length) {
            L.push("  Aucun salarié noté dans cette catégorie : le tableau reste à établir.");
          } else {
            var cl = ordreDe(c);
            var lignes;
            if (cl && Array.isArray(cl.classement)) {
              lignes = cl.classement.map(function (s) {
                return [s.rang, cro(s.nom, "salarié"), nbf(s.charges) === null ? "[ ]" : s.charges,
                  nbf(s.anciennetePoints) === null ? "[ ]" : s.anciennetePoints,
                  nbf(s.social) === null ? "[ ]" : s.social,
                  nbf(s.qualites) === null ? "[ ]" : s.qualites,
                  s.total, s.licencie ? "compris dans le projet" : "maintenu"];
              });
              tableau(L, ["Rang", "Salarié", "1°", "2°", "3°", "4°", "Total", "Résultat"], lignes);
              L.push("");
              L.push("  Ce classement est celui que l'audit applique : total le plus faible en");
              L.push("  premier, l'ancienneté départageant les ex æquo. Il vaut ce que vaut la");
              L.push("  pondération — c'est elle, et non le classement, qui se discute.");
            } else {
              lignes = sal.map(function (s) {
                var t = (nbf(s.charges) || 0) + (nbf(s.anciennetePoints) || 0) +
                        (nbf(s.social) || 0) + (nbf(s.qualites) || 0);
                return [cro(s.nom, "salarié"),
                  nbf(s.charges) === null ? "[ ]" : s.charges,
                  nbf(s.anciennetePoints) === null ? "[ ]" : s.anciennetePoints,
                  nbf(s.social) === null ? "[ ]" : s.social,
                  nbf(s.qualites) === null ? "[ ]" : s.qualites, t];
              });
              tableau(L, ["Salarié", "1° Charges", "2° Ancienneté", "3° Social", "4° Qualités", "Total"], lignes);
              L.push("");
              L.push("  Les notes sont celles de la fiche. Le classement n'est pas dressé ici :");
              L.push("  le moteur du module n'est pas chargé sur cette page.");
            }
          }
          L.push("");
        });
      }

      if (postes.length) {
        L.push("POSTES SUPPRIMÉS, TELS QUE LA FICHE LES PORTE");
        L.push("");
        tableau(L, ["Poste", "Service", "Effectif avant", "Effectif après", "Écart"],
          postes.map(function (p) {
            var av = nbf(p.avant), ap = nbf(p.apres);
            return [cro(p.intitule, "intitulé"), cro(p.service, "—"),
              av === null ? "[ ]" : av, ap === null ? "[ ]" : ap,
              (av !== null && ap !== null) ? (ap - av) : "[ ]"];
          }));
        L.push("");
      }

      L.push("Rappel utile pour la suite : après le licenciement, « sur demande écrite du");
      L.push("salarié, l'employeur indique par écrit les critères retenus pour fixer");
      L.push("l'ordre des licenciements » (L. 1233-17 et L. 1233-43). L'article R. 1233-1");
      L.push("règle les délais de cette demande et de la réponse : le salarié demande");
      L.push("« avant l'expiration d'un délai de dix jours à compter de la date à");
      L.push("laquelle il quitte effectivement son emploi », et l'employeur répond");
      L.push("« dans les dix jours suivant la présentation ou de la remise de la lettre");
      L.push("du salarié ». Ces délais « ne sont pas des délais francs » et « expirent le");
      L.push("dernier jour à vingt-quatre heures ». Le tableau ci-dessus est ce que vous");
      L.push("aurez à produire : établissez-le maintenant, pas alors.");
      L.push("");

      titre(L, "IV. Le courrier de transmission et le bordereau de décharge");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : renseignements adressés avec la convocation à la réunion du [DATE]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous adresse, avec la convocation à la réunion du [DATE] et conformément");
      L.push("à l'article " + (art || "L. 1233-10 ou L. 1233-31, selon le régime applicable") + " du code du travail, la note");
      L.push("d'information portant l'ensemble des renseignements que ce texte énumère,");
      L.push("ainsi que les pièces qui les établissent.");
      L.push("");
      L.push("Le bordereau ci-dessous récapitule ces pièces. Je vous serais reconnaissant");
      L.push("de bien vouloir m'en retourner un exemplaire signé : c'est cette décharge");
      L.push("qui établira la date à laquelle vous en avez disposé.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");
      L.push("BORDEREAU DES PIÈCES ADRESSÉES AVEC LA CONVOCATION");
      L.push("");
      tableau(L, ["#", "Pièce", "Point du texte", "Remise"], [
        ["1", "Convocation à la réunion", "—", "☐"],
        ["2", "Ordre du jour", "—", "☐"],
        ["3", "Note d'information — raisons du projet", "1°", "☐"],
        ["4", "Nombre de licenciements envisagé", "2°", "☐"],
        ["5", "Catégories et critères d'ordre proposés", "3°", "☐"],
        ["6", "Effectif de l'établissement", "4°", "☐"],
        ["7", "Calendrier prévisionnel", "5°", "☐"],
        ["8", "Mesures de nature économique envisagées", "6°", "☐"],
        ["9", "Conséquences santé, sécurité, conditions de travail", "7°", "☐"],
        ["10", "[Le cas échéant] Projet de plan de sauvegarde de l'emploi", "L. 1233-32", "☐"],
        ["11", "[Pièces comptables annexées]", "1°", "☐"],
      ]);
      L.push("");
      L.push("Reçu le ................  Nom et signature ..............................");
      L.push("");
      L.push("Un bordereau par membre. C'est fastidieux, et c'est la seule pièce qui");
      L.push("prouve que chacun a reçu chaque document, et à quelle date.");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous complétez les sept points et le tableau");
      L.push("des critères.");
      L.push("");
      L.push("Le même jour que la convocation — et non après : la note et ses pièces");
      L.push("partent AVEC la convocation. Si la convocation est déjà partie sans elles,");
      L.push("il faut convoquer à nouveau ; le document du contrôle CTL-CSE-06 porte la");
      L.push("lettre de report.");
      L.push("");
      L.push("Ensuite — la réunion, puis l'avis. Et l'article L. 1233-48 impose que");
      L.push("« l'ensemble des informations communiquées aux représentants du personnel");
      L.push("lors de leur convocation aux réunions prévues par les articles L. 1233-29");
      L.push("et L. 1233-30 » soit communiqué SIMULTANÉMENT à l'autorité administrative.");
      L.push("Prévoyez donc le même envoi, le même jour, à l'administration : l'article");
      L.push("D. 1233-5 précise qu'il se fait « par la voie dématérialisée ».");

      pied(L, ["L. 1233-10", "L. 1233-31", "L. 1233-5", "L. 1233-17", "L. 1233-43",
        "R. 1233-1", "L. 1233-48", "D. 1233-5"],
        "Ce qui se joue : le défaut de renseignements adressés avec la convocation\n" +
        "relève des « procédures de consultation des représentants du personnel » que\n" +
        "l'article L. 1235-12 sanctionne par une indemnité calculée en fonction du\n" +
        "préjudice subi. En régime de plan de sauvegarde de l'emploi, l'autorité\n" +
        "administrative vérifie la régularité de la procédure d'information et de\n" +
        "consultation (L. 1233-57-2, 2° ; L. 1233-57-3).");
      return L.join("\n");
    });

  doc("CTL-CSE-04",
    "Le procès-verbal d'avis, ou le constat écrit d'expiration du délai",
    "L'avis du comité consigné, ou le constat daté qui établit qu'à défaut " +
    "d'avis le comité est réputé consulté — et la date de notification la plus " +
    "proche que ce constat autorise.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var mois = delaiAvisMois(r);
      var depart = rs.length ? rs[0] : null;
      var expiration = (depart && mois) ? plusMois(depart, mois) : null;
      var avisRendu = estDate(f.dateAvisCSE);
      var notif = estDate(f.dateNotification) ? f.dateNotification : null;
      var tropTot = (notif && expiration && !avisRendu && notif < expiration);
      var memeJour = (notif && expiration && !avisRendu && notif === expiration);

      L = L.concat(entete(ctx, "Avis du comité social et économique, ou constat d'expiration du délai",
        "articles L. 1233-8 et L. 1233-30, II du code du travail"));

      if (tropTot) {
        irrattrapable(L, [
          "Aucun avis n'est rendu, et la notification est fixée au " + jour(notif) + ",",
          "avant l'expiration du délai d'avis, le " + jour(expiration) + ".",
          "",
          "Une lettre de licenciement déjà expédiée à cette date a été expédiée sans",
          "que le comité ait rendu son avis ni soit réputé consulté. Le constat",
          "ci-dessous ne l'efface pas : il n'a d'effet qu'à sa propre date, et une",
          "date ne se rétrodate pas.",
        ], "Si aucune lettre n'est encore partie, ARRÊTEZ L'ENVOI : le calendrier de la " +
           "fin de ce document donne la première date possible.");
      }

      modeEmploi(L, [
        "Deux issues, et deux seulement : le comité rend un avis, ou le délai expire",
        "et il est réputé consulté. L'article L. 1233-8 le dit pour le régime de",
        "moins de dix licenciements — « En l'absence d'avis rendu dans ce délai, le",
        "comité social et économique est réputé avoir été consulté » — et l'article",
        "L. 1233-30, II le répète pour l'autre — « En l'absence d'avis du comité",
        "social et économique dans ces délais, celui-ci est réputé avoir été",
        "consulté ».",
        "",
        "Ce qui n'existe pas, c'est la troisième issue : notifier parce que « le",
        "comité ne répond pas ». Tant que le délai court, il n'est pas réputé",
        "consulté, et la lettre partie entre-temps est partie sans consultation.",
        "",
        "Ce document produit donc les deux pièces : le procès-verbal quand l'avis est",
        "rendu, le constat écrit et daté quand il ne l'est pas.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le délai, et d'où il court");

      L.push("Le point de départ n'est jamais la convocation : c'est la PREMIÈRE RÉUNION");
      L.push("au cours de laquelle le comité est consulté. Les deux textes le disent");
      L.push("dans les mêmes termes.");
      L.push("");
      L.push("L. 1233-8 : « Le comité social et économique rend son avis dans un délai");
      L.push("qui ne peut être supérieur, à compter de la date de la première réunion au");
      L.push("cours de laquelle il est consulté, à un mois. »");
      L.push("");
      L.push("L. 1233-30, II : « Le comité social et économique rend ses deux avis dans");
      L.push("un délai qui ne peut être supérieur, à compter de la date de sa première");
      L.push("réunion […], à : 1° Deux mois lorsque le nombre des licenciements est");
      L.push("inférieur à cent ; 2° Trois mois lorsque le nombre des licenciements est au");
      L.push("moins égal à cent et inférieur à deux cent cinquante ; 3° Quatre mois");
      L.push("lorsque le nombre des licenciements est au moins égal à deux cent");
      L.push("cinquante. Une convention ou un accord collectif de travail peut prévoir");
      L.push("des délais différents. »");
      L.push("");
      if (depart) {
        L.push("Votre première réunion : " + jour(depart) + ".");
        if (rs.length > 1) {
          L.push("(Les réunions renseignées sont " + rs.map(function (x) { return jour(x); }).join(" · ") +
            " ; c'est la plus");
          L.push("ancienne qui fait courir le délai, non la première de la liste saisie.)");
        }
        L.push("");
      } else {
        L.push("Aucune date de réunion n'est renseignée : le point de départ du délai est");
        L.push("inconnu, et son expiration ne peut pas être calculée. Renseignez la date");
        L.push("de la première réunion avant de vous servir de ce document.");
        L.push("");
      }
      if (expiration) {
        L.push("Délai applicable : " + r.delaiAvis + ".");
        L.push("EXPIRATION : " + jour(expiration) + ".");
        L.push("");
        L.push("À compter de cette date, et faute d'avis, le comité est réputé avoir été");
        L.push("consulté. Avant elle, il ne l'est pas.");
        L.push("");
      } else if (depart && r && r.code === "GRAND_PETITE_ENTREPRISE") {
        L.push("Votre régime n'exprime pas le délai d'avis en mois : l'article L. 1233-29");
        L.push("impose deux réunions séparées d'un délai qui ne peut être supérieur à");
        L.push("quatorze jours, sans fixer de délai d'avis chiffré. La date à laquelle le");
        L.push("comité est réputé consulté doit donc être établie autrement — par votre");
        L.push("accord collectif s'il en fixe une, à défaut par l'avis effectivement");
        L.push("rendu. Ne notifiez pas sur une date que rien n'établit.");
        L.push("");
      }

      titre(L, "II. Le procès-verbal d'avis — si le comité a rendu un avis");

      if (avisRendu) {
        L.push("La fiche porte un avis rendu le " + jour(f.dateAvisCSE) + ".");
        if (depart && expiration) {
          L.push("Il l'a été " + ecart(depart, f.dateAvisCSE) + " jours après la première réunion, donc " +
            (f.dateAvisCSE <= expiration ? "dans le délai." : "après l'expiration du délai."));
        }
        L.push("Le procès-verbal ci-dessous doit exister et être versé : la date seule ne");
        L.push("prouve rien.");
      } else if (String(f.dateAvisCSE || "").trim()) {
        L.push("La fiche porte, à la place d'une date : « " + String(f.dateAvisCSE).trim() + " ».");
        L.push("Si aucun avis n'a été rendu, c'est le constat du III qu'il faut établir.");
      } else {
        L.push("La fiche ne porte aucune date d'avis. Si le comité en a rendu un,");
        L.push("complétez le procès-verbal ci-dessous ; sinon, passez au III.");
      }
      L.push("");
      L.push("PROCÈS-VERBAL — AVIS DU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push(nom(ctx));
      L.push("Réunion du " + (avisRendu ? jour(f.dateAvisCSE) : "[DATE]") + ", à [HEURE], à [LIEU]");
      L.push("");
      L.push("  Présents : [employeur et personnes l'assistant ; membres titulaires ;");
      L.push("  membres suppléants ; représentant syndical]");
      L.push("  Absents excusés : [noms]");
      L.push("");
      L.push("  Rappel de l'objet : consultation sur le projet de licenciement collectif");
      L.push("  pour motif économique portant sur " +
        (nbLic(f) === null ? "[nombre]" : nbLic(f)) + " salarié(s) dans une même");
      L.push("  période de trente jours.");
      L.push("");
      L.push("  Renseignements adressés avec la convocation le " +
        jour(f.dateInfoCSE, "date") + ", rappelés point");
      L.push("  par point : [1° à 7°].");
      L.push("");
      L.push("  Débats : [transcrire les questions et les réponses]");
      L.push("");
      L.push("  Suggestions et propositions alternatives formulées par le comité");
      L.push("  (L. 1233-33) : [transcrire chacune]");
      L.push("  Réponse motivée de l'employeur : [transcrire, ou indiquer la date à");
      L.push("  laquelle elle est apportée — le texte exige une réponse motivée]");
      L.push("");
      L.push("  AVIS : le comité social et économique émet un avis [favorable /");
      L.push("  défavorable / réservé — reprendre les termes exacts du vote].");
      L.push("  Résultat du vote : [pour] · [contre] · [abstentions]");
      L.push("  [Le cas échéant : le comité décide de ne pas rendre d'avis.]");
      L.push("");
      L.push("  Le secrétaire du comité                L'employeur");
      L.push("  [nom et signature]                     " + signataire(ctx));
      L.push("");
      L.push("Ce procès-verbal est adressé à l'autorité administrative : l'article");
      L.push("L. 1233-48 dispose que « l'employeur lui adresse également les");
      L.push("procès-verbaux des réunions » et que « ces procès-verbaux comportent les");
      L.push("avis, suggestions et propositions des représentants du personnel ».");
      L.push("");

      titre(L, "III. Le constat d'expiration — si aucun avis n'est rendu");

      L.push("Ce constat n'est pas une formalité de confort : c'est la pièce qui");
      L.push("établit la date à laquelle le comité est réputé consulté, et donc celle à");
      L.push("partir de laquelle une notification devient concevable. Sans elle, cette");
      L.push("date se plaide au lieu de se lire.");
      L.push("");
      L.push("CONSTAT D'EXPIRATION DU DÉLAI D'AVIS");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Je soussigné(e) " + signataire(ctx) + ",");
      L.push("constate ce qui suit.");
      L.push("");
      L.push("  1. Le comité social et économique a été convoqué le " +
        jour(f.dateInfoCSE, "date") + ", avec");
      L.push("     l'ensemble des renseignements exigés par le code du travail.");
      L.push("  2. La première réunion au cours de laquelle il a été consulté sur le");
      L.push("     projet de licenciement collectif s'est tenue le " +
        (depart ? jour(depart) : "[DATE]") + ".");
      if (rs.length > 1) {
        L.push("     Les réunions suivantes se sont tenues les " +
          rs.slice(1).map(function (x) { return jour(x); }).join(", ") + ".");
      }
      L.push("  3. Le délai d'avis applicable est de " +
        (r && r.delaiAvis ? r.delaiAvis : "[délai du régime]") + ",");
      L.push("     à compter de cette première réunion.");
      L.push("  4. À la date du " + (expiration ? jour(expiration) : "[DATE D'EXPIRATION]") +
        ", aucun avis n'a été rendu.");
      L.push("  5. En conséquence, et par application " +
        (r && r.code === "PETIT_COLLECTIF" ? "de l'article L. 1233-8"
          : r && r.code === "GRAND_COLLECTIF" ? "de l'article L. 1233-30, II"
          : "des articles L. 1233-8 et L. 1233-30, II") + ", le comité");
      L.push("     social et économique est réputé avoir été consulté à cette date.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + (expiration ? jour(expiration) : "[DATE D'EXPIRATION]") + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Le constat est daté du jour de l'expiration, non d'un jour antérieur : il");
      L.push("constate un fait acquis ce jour-là. Une copie est adressée au comité, et");
      L.push("le constat est versé au dossier remis à l'autorité administrative.");
      L.push("");
      L.push("LETTRE D'ACCOMPAGNEMENT AU COMITÉ");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le délai dont le comité disposait pour rendre son avis sur le projet de");
      L.push("licenciement collectif est venu à expiration le " +
        (expiration ? jour(expiration) : "[DATE]") + ".");
      L.push("");
      L.push("Aucun avis n'ayant été rendu, le comité est réputé avoir été consulté à");
      L.push("cette date. Je vous adresse le constat correspondant, qui sera versé au");
      L.push("dossier.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + ".");
      L.push("");
      if (avisRendu) {
        L.push("Avis rendu le " + jour(f.dateAvisCSE) + " : la consultation est achevée de ce chef.");
        L.push("Versez le procès-verbal, et adressez-le à l'autorité administrative");
        L.push("(L. 1233-48).");
        L.push("");
      } else if (expiration) {
        L.push("Expiration du délai d'avis : " + jour(expiration) + ". Établissez le constat CE");
        L.push("JOUR-LÀ.");
        L.push("");
        L.push("Première date de notification concevable : " + jour(plusJours(expiration, 1)) + ".");
        L.push("");
        L.push("Pourquoi le lendemain et non le jour même : le texte fait courir la");
        L.push("présomption « à l'expiration » du délai, et la coïncidence exacte des deux");
        L.push("dates n'est tranchée ni par le texte, ni par un arrêt publié du corpus de");
        L.push("l'application. Décaler d'un jour supprime la difficulté ; la maintenir ne");
        L.push("rapporte rien.");
        L.push("");
        if (memeJour) {
          L.push("Or votre notification est fixée au " + jour(notif) + ", c'est-à-dire au jour même de");
          L.push("l'expiration. Décalez-la.");
          L.push("");
        }
      } else {
        L.push("L'expiration du délai n'est pas calculable en l'état : il manque la date de");
        L.push("la première réunion, ou le régime n'exprime pas le délai en mois. Ne fixez");
        L.push("aucune date de notification tant que cette date n'est pas établie.");
        L.push("");
      }
      if (r && r.pse) {
        L.push("Et ce n'est pas tout : un plan de sauvegarde de l'emploi étant dû, la");
        L.push("notification est en outre subordonnée à la décision de validation ou");
        L.push("d'homologation de l'autorité administrative (L. 1233-39). L'avis du comité");
        L.push("ne suffit pas — voyez le document du contrôle CTL-PSE-04.");
      } else {
        L.push("Si un plan de sauvegarde de l'emploi est dû, la notification est en outre");
        L.push("subordonnée à la décision de validation ou d'homologation de l'autorité");
        L.push("administrative (L. 1233-39) : l'avis du comité ne suffit alors pas.");
      }

      pied(L, ["L. 1233-8", "L. 1233-30, II", "L. 1233-33", "L. 1233-48", "L. 1233-39"],
        "Ce qui se joue : notifier avant que le comité ait rendu son avis ou soit\n" +
        "réputé consulté, c'est notifier sans consultation. L'article L. 1235-12 ouvre\n" +
        "alors au salarié compris dans le licenciement collectif une indemnité calculée\n" +
        "en fonction du préjudice subi ; et lorsqu'un plan de sauvegarde de l'emploi\n" +
        "est dû, l'article L. 1235-10 attache la nullité au licenciement intervenu en\n" +
        "l'absence de décision de validation ou d'homologation, le juge pouvant alors\n" +
        "ordonner la poursuite du contrat ou la réintégration (L. 1235-11).");
      return L.join("\n");
    });

  doc("CTL-CSE-05",
    "L'information ou la notification à l'autorité administrative",
    "Les deux actes que le code distingue — information des licenciements " +
    "prononcés (L. 1233-19) et notification du projet (L. 1233-46) —, la lettre " +
    "correspondante avec les mentions exigées par le décret, et la date d'envoi " +
    "que le calendrier des réunions contraint.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var grand = r && (r.code === "GRAND_COLLECTIF" || r.code === "GRAND_PETITE_ENTREPRISE");
      var petit = r && r.code === "PETIT_COLLECTIF";
      var envoi = estDate(f.dateNotifAdmin) ? f.dateNotifAdmin : null;
      var premiere = rs.length ? rs[0] : null;
      var tropTot = grand && envoi && premiere && envoi <= premiere;

      L = L.concat(entete(ctx, "Information ou notification à l'autorité administrative",
        "articles L. 1233-19 et L. 1233-46 du code du travail"));

      if (tropTot) {
        irrattrapable(L, [
          "La notification du projet a été adressée le " + jour(envoi) + ", et la première",
          "réunion du comité était prévue le " + jour(premiere) + ".",
          "",
          "L'article L. 1233-46 dispose que « la notification est faite au plus tôt le",
          "lendemain de la date prévue pour la première réunion prévue aux articles",
          "L. 1233-29 et L. 1233-30 ». Une notification envoyée le jour de cette",
          "réunion, ou avant, a été envoyée trop tôt : l'envoi a eu lieu, sa date est",
          "établie par l'accusé de réception, et elle ne se réécrit pas.",
        ], "Il vous dit ce qu'il reste à faire — notamment adresser à l'administration " +
           "les renseignements et les procès-verbaux que L. 1233-48 lui destine — sans " +
           "prétendre effacer une date d'envoi.");
      }

      modeEmploi(L, [
        "Deux actes, deux régimes, deux textes — et ils ne se ressemblent pas.",
        "",
        "L. 1233-19 : « L'employeur qui procède à un licenciement collectif pour motif",
        "économique de moins de dix salariés dans une même période de trente jours",
        "informe l'autorité administrative du ou des licenciements PRONONCÉS. » C'est",
        "une information, elle est postérieure, et le décret D. 1233-3 lui donne un",
        "délai : « dans les huit jours de l'envoi des lettres de licenciement aux",
        "salariés concernés ».",
        "",
        "L. 1233-46 : « L'employeur notifie à l'autorité administrative tout PROJET de",
        "licenciement pour motif économique d'au moins dix salariés dans une même",
        "période de trente jours. » C'est une notification, elle est préalable, et sa",
        "date d'envoi est contrainte par le calendrier des réunions.",
        "",
        "Se tromper d'acte, c'est faire une information là où une notification était",
        "due : l'autorité administrative n'a alors jamais été saisie du projet.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Quel acte vous est dû");

      if (petit) {
        L.push("Régime retenu par l'audit : " + r.libelle + ".");
        L.push("=> L'acte dû est l'INFORMATION des licenciements prononcés (L. 1233-19),");
        L.push("   dans les huit jours de l'envoi des lettres (D. 1233-3).");
      } else if (grand) {
        L.push("Régime retenu par l'audit : " + r.libelle + ".");
        L.push("=> L'acte dû est la NOTIFICATION DU PROJET (L. 1233-46), adressée « par la");
        L.push("   voie dématérialisée » (D. 1233-4), au plus tôt le lendemain de la date");
        L.push("   prévue pour la première réunion.");
      } else {
        L.push("Le moteur du module n'est pas chargé, ou le régime ne commande ni l'un ni");
        L.push("l'autre acte. Les deux branches sont écrites ci-dessous : celle de moins de");
        L.push("dix licenciements sur trente jours (information, L. 1233-19), celle d'au");
        L.push("moins dix (notification du projet, L. 1233-46).");
      }
      L.push("");
      if (envoi) {
        L.push("Votre dossier porte un envoi à l'administration le " + jour(envoi) + ".");
        if (premiere) {
          L.push("Première réunion du comité : " + jour(premiere) + ".");
          L.push(envoi > premiere
            ? "=> L'envoi est postérieur à la première réunion."
            : "=> L'envoi n'est PAS postérieur à la première réunion.");
        }
        L.push("");
      } else {
        L.push("Aucune date d'envoi à l'administration n'est renseignée. C'est l'accusé de");
        L.push("réception, et non la lettre, qui prouvera cette date : conservez-le.");
        L.push("");
      }

      titre(L, "II. La notification du projet — au moins dix licenciements (L. 1233-46)");

      L.push("Le texte, dans ses termes : « L'employeur notifie à l'autorité");
      L.push("administrative tout projet de licenciement pour motif économique d'au");
      L.push("moins dix salariés dans une même période de trente jours. Lorsque");
      L.push("l'entreprise est dotée de représentants du personnel, la notification est");
      L.push("faite au plus tôt le lendemain de la date prévue pour la première réunion");
      L.push("prévue aux articles L. 1233-29 et L. 1233-30. La notification est");
      L.push("accompagnée de tout renseignement concernant la convocation, l'ordre du");
      L.push("jour et la tenue de cette réunion. Au plus tard à cette date, elle indique,");
      L.push("le cas échéant, l'intention de l'employeur d'ouvrir la négociation prévue à");
      L.push("l'article L. 1233-24-1. »");
      L.push("");
      L.push("Le décret D. 1233-4 ajoute ce que la notification précise, outre ces");
      L.push("renseignements : « 1° Le nom et l'adresse de l'employeur ; 2° La nature de");
      L.push("l'activité et l'effectif de l'entreprise ou de l'établissement ; 3° Le");
      L.push("nombre des licenciements envisagés ; 4° Le cas échéant, les modifications");
      L.push("qu'il y a lieu d'apporter aux informations déjà transmises en application");
      L.push("de l'article L. 1233-31 ; 5° En cas de recours à un expert-comptable par le");
      L.push("comité social et économique, mention de cette décision ; 6° Le cas échéant,");
      L.push("la signature d'un accord collectif en application des articles L. 1233-21");
      L.push("et L. 1233-24-1. » Elle est adressée « par la voie dématérialisée ».");
      L.push("");
      L.push("──── LETTRE ────");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[Direction régionale — service en charge des licenciements collectifs]");
      L.push("[Adresse, ou plateforme dématérialisée utilisée]");
      L.push("");
      L.push(ville(ctx) + ", le " + (envoi ? jour(envoi) : "[DATE D'ENVOI]"));
      L.push("");
      L.push("Envoi par la voie dématérialisée (D. 1233-4)");
      L.push("");
      L.push("Objet : notification d'un projet de licenciement collectif pour motif");
      L.push("économique — article L. 1233-46 du code du travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous notifie, en application de l'article L. 1233-46 du code du travail,");
      L.push("le projet de licenciement collectif pour motif économique suivant.");
      L.push("");
      L.push("  1° Employeur : " + nom(ctx) + ", " + cro((ctx.profil || {}).adresse, "adresse") + ".");
      L.push("     SIREN : " + cro(f.siren || (ctx.profil || {}).siret, "à compléter") + ".");
      L.push("  2° Nature de l'activité : " +
        cro((ctx.profil || {}).secteur || f.activite, "activité de l'entreprise") + ".");
      L.push("     Effectif de l'entreprise : " +
        (effectifDe(ctx) === null ? "[effectif]" : effectifDe(ctx)) + " salariés.");
      L.push("     Effectif de l'établissement concerné : " +
        (nbf(f.effectifEtablissement) === null ? "[effectif]" : nbf(f.effectifEtablissement)) + ".");
      L.push("  3° Nombre de licenciements envisagés : " +
        (nbLic(f) === null ? "[nombre]" : nbLic(f)) + " dans une même période de");
      L.push("     trente jours.");
      L.push("  4° Modifications à apporter aux informations déjà transmises en");
      L.push("     application de l'article L. 1233-31 : [aucune / préciser].");
      L.push("  5° Recours à un expert-comptable par le comité : " +
        (f.expertise === true ? "oui, décidé par le comité"
          : f.expertise === false ? "non" : "[oui / non]") + ".");
      L.push("  6° Signature d'un accord collectif en application des articles L. 1233-21");
      L.push("     et L. 1233-24-1 : " +
        (voie(f) === "accord" ? "un accord est conclu ou en cours de négociation — copie jointe"
          : "[aucun / préciser, et joindre copie]") + ".");
      L.push("");
      L.push("Renseignements sur la réunion du comité social et économique :");
      L.push("  Convocation adressée le " + jour(f.dateInfoCSE, "date") + ".");
      L.push("  Ordre du jour : joint à la présente.");
      L.push("  Première réunion prévue et tenue le " +
        (premiere ? jour(premiere) : "[DATE]") + ".");
      if (rs.length > 1) {
        L.push("  Réunions suivantes : " + rs.slice(1).map(function (x) { return jour(x); }).join(", ") + ".");
      }
      L.push("");
      L.push("[Le cas échéant] J'indique l'intention d'ouvrir la négociation prévue à");
      L.push("l'article L. 1233-24-1, en vue d'un accord collectif majoritaire déterminant");
      L.push("le contenu du plan de sauvegarde de l'emploi.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : convocation · ordre du jour · renseignements adressés au");
      L.push("comité (L. 1233-31) · [le cas échéant] plan de sauvegarde de l'emploi ·");
      L.push("[le cas échéant] copie de l'accord · procès-verbaux des réunions tenues");
      L.push("");
      L.push("Ces pièces ne sont pas facultatives : l'article L. 1233-48 dispose que");
      L.push("« l'ensemble des informations communiquées aux représentants du personnel");
      L.push("lors de leur convocation aux réunions prévues par les articles L. 1233-29");
      L.push("et L. 1233-30 est communiqué simultanément à l'autorité administrative »,");
      L.push("et que « l'employeur lui adresse également les procès-verbaux des");
      L.push("réunions ». L'article D. 1233-5 précise que cet envoi se fait « par la voie");
      L.push("dématérialisée ».");
      L.push("");
      L.push("[Si l'entreprise est dépourvue de comité par suite d'une carence :");
      L.push("l'article D. 1233-10 impose de joindre à la notification le procès-verbal de");
      L.push("carence. Et l'article L. 1233-49 ajoute que, dans ce cas, lorsqu'un plan de");
      L.push("sauvegarde de l'emploi est dû, « ce plan ainsi que les informations");
      L.push("destinées aux représentants du personnel mentionnées à l'article L. 1233-31");
      L.push("sont communiqués à l'autorité administrative en même temps que la");
      L.push("notification du projet », le plan étant « porté à la connaissance des");
      L.push("salariés par tout moyen sur les lieux de travail ».]");
      L.push("");

      titre(L, "III. L'information des licenciements prononcés — moins de dix (L. 1233-19)");

      L.push("Le texte : « L'employeur qui procède à un licenciement collectif pour motif");
      L.push("économique de moins de dix salariés dans une même période de trente jours");
      L.push("informe l'autorité administrative du ou des licenciements prononcés. »");
      L.push("");
      L.push("Le décret D. 1233-3 en fixe le délai et le contenu : l'employeur informe");
      L.push("« dans les huit jours de l'envoi des lettres de licenciement aux salariés");
      L.push("concernés » et précise « 1° Son nom et son adresse ; 2° La nature de");
      L.push("l'activité et l'effectif de l'entreprise ou de l'établissement ; 3° Les");
      L.push("nom, prénoms, nationalité, date de naissance, sexe, adresse, emploi et");
      L.push("qualification du ou des salariés licenciés ; 4° La date de la notification");
      L.push("des licenciements aux salariés concernés ».");
      L.push("");
      L.push("──── LETTRE ────");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("À l'autorité administrative compétente");
      L.push("[Direction régionale — service compétent]");
      L.push("");
      L.push(ville(ctx) + ", le [DATE D'ENVOI]");
      L.push("");
      L.push("Objet : information sur les licenciements prononcés — article L. 1233-19 du");
      L.push("code du travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application de l'article L. 1233-19 du code du travail et dans le délai");
      L.push("de huit jours fixé par l'article D. 1233-3, je vous informe des");
      L.push("licenciements pour motif économique prononcés au sein de " + nom(ctx) + ".");
      L.push("");
      L.push("  1° " + nom(ctx) + ", " + cro((ctx.profil || {}).adresse, "adresse") + ".");
      L.push("  2° Nature de l'activité : " +
        cro((ctx.profil || {}).secteur || f.activite, "activité") + " — effectif : " +
        (effectifDe(ctx) === null ? "[effectif]" : effectifDe(ctx)) + " salariés.");
      L.push("  3° Salariés licenciés :");
      L.push("");
      tableau(L, ["Nom, prénoms", "Nationalité", "Naissance", "Sexe", "Adresse", "Emploi", "Qualification"],
        [["[à compléter]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"],
         ["[à compléter]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]", "[  ]"]]);
      L.push("");
      L.push("  4° Date de la notification des licenciements aux salariés concernés : " +
        jour(f.dateNotification, "date") + ".");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Ces données sont nominatives : ne les recopiez que depuis vos registres, et");
      L.push("n'en transmettez pas d'autres que celles que le texte énumère.");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + ".");
      L.push("");
      if (grand) {
        if (premiere) {
          L.push("Première réunion prévue le " + jour(premiere) + ".");
          L.push("PREMIÈRE DATE D'ENVOI POSSIBLE : " + jour(plusJours(premiere, 1)) + " — « au plus tôt le");
          L.push("lendemain de la date prévue pour la première réunion » (L. 1233-46).");
        } else {
          L.push("La date prévue pour la première réunion n'est pas renseignée : l'envoi ne");
          L.push("peut pas être daté. Fixez d'abord la réunion.");
        }
        L.push("");
        L.push("Le même jour, ou avant : l'intention d'ouvrir la négociation de l'article");
        L.push("L. 1233-24-1 s'indique « au plus tard à cette date ». Passée cette date,");
        L.push("elle ne s'indique plus dans la notification.");
        L.push("");
        L.push("Simultanément aux convocations : les informations communiquées au comité");
        L.push("vont à l'administration en même temps (L. 1233-48 ; D. 1233-5). Puis les");
        L.push("procès-verbaux, réunion par réunion.");
      } else if (petit) {
        if (estDate(f.dateNotification)) {
          L.push("Notification des licenciements aux salariés : " + jour(f.dateNotification) + ".");
          L.push("DATE LIMITE D'INFORMATION DE L'ADMINISTRATION : " +
            jour(plusJours(f.dateNotification, 8)) + " — huit jours");
          L.push("à compter de l'envoi des lettres (D. 1233-3).");
        } else {
          L.push("La date de notification n'est pas renseignée : le délai de huit jours de");
          L.push("l'article D. 1233-3 ne peut pas être calculé.");
        }
      } else {
        L.push("Le régime n'étant pas rappelé ici, les deux échéances sont données :");
        L.push("  — notification du projet : au plus tôt le lendemain de la date prévue");
        L.push("    pour la première réunion (L. 1233-46) ;");
        L.push("  — information des licenciements prononcés : dans les huit jours de");
        L.push("    l'envoi des lettres (D. 1233-3).");
      }
      L.push("");
      L.push("Dans tous les cas — conservez l'accusé de réception. C'est lui qui prouve");
      L.push("la date, et c'est la date qui se discute.");

      pied(L, ["L. 1233-19", "L. 1233-46", "L. 1233-48", "L. 1233-49",
        "D. 1233-3", "D. 1233-4", "D. 1233-5", "D. 1233-10"],
        "Ce qui se joue : l'article L. 1235-12 vise le non-respect par l'employeur\n" +
        "« des procédures de consultation des représentants du personnel OU\n" +
        "d'information de l'autorité administrative » — l'information de\n" +
        "l'administration y est expressément nommée — et ouvre au salarié compris dans\n" +
        "le licenciement collectif une indemnité calculée en fonction du préjudice\n" +
        "subi.");
      return L.join("\n");
    });

  doc("CTL-CSE-06",
    "La convocation reportée, avec l'ordre du jour et les renseignements joints",
    "Le relevé du délai réel entre votre convocation et votre première réunion, " +
    "la lettre de report, la nouvelle convocation portant l'intégralité des " +
    "renseignements, et les deux pièces conservées côte à côte.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var art = articleRenseignements(r);
      var premiere = rs.length ? rs[0] : null;
      var d = (dISO(f.dateInfoCSE) && premiere) ? ecart(f.dateInfoCSE, premiere) : null;

      L = L.concat(entete(ctx, "Report de la première réunion du comité, et nouvelle convocation",
        art ? "article " + art + " du code du travail"
            : "articles L. 1233-10 et L. 1233-31 du code du travail"));

      modeEmploi(L, [
        "Le code ne fixe ici aucun délai chiffré entre la convocation et la première",
        "réunion. Il fixe autre chose, et de plus contraignant : les renseignements",
        "sont adressés « avec la convocation ». Si le comité les reçoit avec la",
        "convocation mais siège trois jours plus tard, il les a reçus sans avoir pu",
        "les examiner — et le texte n'aurait aucun objet s'il suffisait de les faire",
        "partir à temps pour qu'ils soient réputés étudiés.",
        "",
        "Ce document n'invente donc pas un délai que la loi ne donne pas. Il relève",
        "le vôtre, il vous dit ce qui se plaide sur ce terrain, et il produit le",
        "report et la nouvelle convocation quand le délai ne laisse aucun temps",
        "d'examen.",
        "",
        "Reporter n'efface pas la première convocation : les deux se conservent. Une",
        "convocation qui disparaît du dossier se remarque plus qu'une convocation",
        "reportée.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Votre délai, tel que la fiche le donne");

      if (d === null) {
        L.push("La date de convocation ou celle de la première réunion n'est pas");
        L.push("renseignée : le délai n'est pas calculable. Reportez-les ci-dessous, lues");
        L.push("sur la convocation elle-même et sur le procès-verbal.");
        L.push("");
        L.push("  Convocation envoyée le ......... [AAAA-MM-JJ]");
        L.push("  Preuve d'envoi ................. [décharge, avis de réception, courriel]");
        L.push("  Première réunion tenue le ...... [AAAA-MM-JJ]");
        L.push("  Écart .......................... [  ] jours");
        L.push("");
      } else {
        L.push("  Convocation envoyée le ......... " + jour(f.dateInfoCSE));
        L.push("  Première réunion ............... " + jour(premiere));
        L.push("  Écart .......................... " + d + " jour(s)");
        L.push("");
        if (d < 0) {
          L.push("=> La convocation est POSTÉRIEURE à la première réunion. Ce n'est pas un");
          L.push("   délai court : c'est une réunion tenue avant d'avoir été convoquée. Il");
          L.push("   n'y a rien à reporter — il y a une réunion à tenir, sur une convocation");
          L.push("   régulière, et le calendrier réel à consigner.");
        } else if (d < 3) {
          L.push("=> " + d + " jour(s) : le comité n'a disposé d'aucun temps d'examen réel. Les");
          L.push("   renseignements devant lui parvenir avec la convocation, un délai aussi");
          L.push("   court prive cette exigence d'objet, et c'est sur ce terrain que la");
          L.push("   consultation s'attaque. Reportez.");
        } else {
          L.push("=> " + d + " jours. Le code ne fixe pas de seuil ici : c'est le contenu du");
          L.push("   dossier remis qui dit si ce délai permettait de l'examiner. Vérifiez-le");
          L.push("   au regard du volume des pièces adressées, et de votre règlement");
          L.push("   intérieur de comité, que l'application ne lit pas.");
        }
        L.push("");
      }
      L.push("Le texte, dans ses termes — " +
        (art === "L. 1233-10"
          ? "L. 1233-10 : « L'employeur adresse aux représentants du personnel, avec la"
          : art === "L. 1233-31"
            ? "L. 1233-31 : « L'employeur adresse aux représentants du personnel, avec la"
            : "L. 1233-10 et L. 1233-31 : « L'employeur adresse aux représentants du personnel, avec la"));
      L.push(art === "L. 1233-10"
        ? "convocation à la réunion prévue à l'article L. 1233-8, tous renseignements"
        : "convocation à la première réunion, tous renseignements");
      L.push("utiles sur le projet de licenciement collectif. »");
      L.push("");

      titre(L, "II. La lettre de report");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Remise en main propre contre décharge / lettre recommandée avec avis de");
      L.push("réception [rayer la mention inutile]");
      L.push("");
      L.push("Objet : report de la réunion du comité social et économique du " +
        (premiere ? jour(premiere) : "[DATE]"));
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Par convocation du " + jour(f.dateInfoCSE, "date") + ", je vous ai convoqués à une réunion du");
      L.push("comité social et économique portant sur un projet de licenciement collectif");
      L.push("pour motif économique, fixée au " + (premiere ? jour(premiere) : "[DATE]") + ".");
      L.push("");
      L.push("Afin que le comité dispose d'un temps d'examen réel des renseignements qui");
      L.push("lui sont adressés avec la convocation, cette réunion est reportée au");
      L.push("[NOUVELLE DATE], à [HEURE], à [LIEU].");
      L.push("");
      L.push("La nouvelle convocation, l'ordre du jour et l'intégralité des");
      L.push("renseignements prévus par l'article " +
        (art || "L. 1233-10 ou L. 1233-31") + " vous sont adressés avec la");
      L.push("présente, ainsi que le bordereau de décharge correspondant.");
      L.push("");
      L.push("La convocation initiale demeure au dossier : le report est consigné, il");
      L.push("n'efface rien.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : nouvelle convocation · ordre du jour · note d'information");
      L.push("portant les sept renseignements · [le cas échéant] projet de plan de");
      L.push("sauvegarde de l'emploi (L. 1233-32) · bordereau de décharge");
      L.push("");

      titre(L, "III. La nouvelle convocation");

      L.push("Elle porte, sans exception, TOUT ce que la première aurait dû porter. Une");
      L.push("convocation reportée qui omettrait un renseignement au motif qu'il a déjà");
      L.push("été remis reproduirait le défaut qu'elle prétend corriger.");
      L.push("");
      SEPT.forEach(function (p) {
        L.push("  " + p.m + " " + p.court + "  ☐ joint");
      });
      L.push("  L. 1233-32 — le cas échéant, le plan de sauvegarde de l'emploi  ☐ joint");
      L.push("");
      L.push("Objet : convocation à la réunion du comité social et économique du");
      L.push("[NOUVELLE DATE] — projet de licenciement collectif pour motif économique");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous convoque à la réunion du comité social et économique qui se tiendra");
      L.push("le [NOUVELLE DATE], à [HEURE], à [LIEU], et qui portera sur le projet de");
      L.push("licenciement collectif pour motif économique portant sur " +
        (nbLic(f) === null ? "[nombre]" : nbLic(f)) + " salarié(s)");
      L.push("dans une même période de trente jours.");
      L.push("");
      L.push("Vous trouverez joints l'ordre du jour et l'ensemble des renseignements que");
      L.push("l'article " + (art || "L. 1233-10 ou L. 1233-31") + " impose d'adresser avec la convocation.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "IV. À qui elle est adressée");
      destinataires(L, ctx, false);

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous adressez la lettre de report, la");
      L.push("nouvelle convocation et l'intégralité des pièces, ensemble.");
      L.push("");
      L.push("Nouvelle réunion : à fixer de manière à laisser un temps d'examen réel. Si");
      L.push("vous retenez, à titre d'exemple, un délai de quinze jours, la réunion se");
      L.push("tiendrait le " + leJour(dans(d0, 15)) + " ; à trois semaines, le " +
        leJour(dans(d0, 21)) + ".");
      L.push("Ces dates sont des repères de travail, non des délais légaux : le code n'en");
      L.push("fixe aucun ici, et l'application n'en invente pas.");
      L.push("");
      L.push("Attention à l'effet du report sur la suite : le délai d'avis court « à");
      L.push("compter de la date de la première réunion au cours de laquelle il est");
      L.push("consulté » (L. 1233-8 ; L. 1233-30, II). Reporter la première réunion");
      L.push("reporte donc aussi l'expiration du délai d'avis, et par conséquent la");
      L.push("première date de notification possible.");
      if (r && (r.code === "GRAND_COLLECTIF" || r.code === "GRAND_PETITE_ENTREPRISE")) {
        L.push("");
        L.push("Et il déplace la notification à l'autorité administrative : elle se fait");
        L.push("« au plus tôt le lendemain de la date prévue pour la première réunion »");
        L.push("(L. 1233-46). Si la réunion se tenait le " + leJour(dans(d0, 15)) + ", cette");
        L.push("notification ne pourrait pas partir avant le " + leJour(dans(d0, 16)) + ".");
      }

      pied(L, ["L. 1233-10", "L. 1233-31", "L. 1233-32", "L. 1233-8", "L. 1233-30", "L. 1233-46"],
        "Ce qui se joue : une consultation privée de tout examen préalable relève des\n" +
        "« procédures de consultation des représentants du personnel » que l'article\n" +
        "L. 1235-12 sanctionne par une indemnité calculée en fonction du préjudice\n" +
        "subi.");
      return L.join("\n");
    });

  doc("CTL-CSE-07",
    "Les convocations du comité central et des comités d'établissement",
    "Le critère de l'article L. 1233-9 appliqué à votre projet, les convocations " +
    "des deux niveaux, l'ordre des réunions que le texte impose, et le constat " +
    "quand la consultation a été conduite devant la seule instance locale.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var nbEt = nbf(f.etablissementsDistincts);
      if (nbEt === null) nbEt = nbf((ctx.profil || {}).etablissementsDistincts);
      var central = f.cseCentralConsulte === true;
      var manque = nbEt !== null && nbEt > 1 && f.cseCentralConsulte !== true;

      L = L.concat(entete(ctx, "Consultation du comité central et des comités d'établissement",
        "articles L. 1233-9 et L. 1233-36 du code du travail"));

      if (manque && rs.length) {
        irrattrapable(L, [
          nbEt + " établissements distincts sont déclarés, et le comité central n'a pas été",
          "réuni. Or " + rs.length + " réunion(s) se sont déjà tenues, les " +
            rs.map(function (x) { return jour(x); }).join(" et ") + ".",
          "",
          "Une consultation conduite devant l'instance incompétente n'est pas une",
          "consultation qu'on complète : c'est une consultation qui n'a pas eu lieu",
          "devant l'instance que la loi désigne. Elle ne se valide pas",
          "rétroactivement, et les réunions déjà tenues ne se requalifient pas.",
        ], "Il vous dit devant quelle instance la consultation doit être reprise, et " +
           "dans quel ordre les réunions se tiennent.");
      }

      modeEmploi(L, [
        "Le critère de l'article L. 1233-9 n'est pas le nombre d'établissements : il",
        "est ce que les mesures dépassent. Le texte : « Dans les entreprises dotées",
        "d'un comité social et économique central d'entreprise, l'employeur réunit le",
        "comité social et économique central et le ou les comités sociaux et",
        "économiques d'établissements intéressés dès lors que les mesures envisagées",
        "excèdent le pouvoir du ou des chefs d'établissement concernés ou portent sur",
        "plusieurs établissements simultanément. »",
        "",
        "Deux mots commandent tout. « Et » : les deux niveaux sont réunis, non l'un à",
        "l'exclusion de l'autre. « Intéressés » : les comités d'établissement",
        "concernés par les mesures, non tous les comités de l'entreprise.",
        "",
        "Ce document vous fait établir le critère, produit les convocations des deux",
        "niveaux, et rappelle l'ordre des réunions — que l'article L. 1233-36 fixe, et",
        "qui n'est pas celui qu'on suppose.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le critère, appliqué à votre projet");

      L.push("  Établissements distincts déclarés .... " +
        (nbEt === null ? "[nombre non renseigné]" : nbEt));
      L.push("  Comité central réuni ................. " +
        (f.cseCentralConsulte === true ? "oui"
          : f.cseCentralConsulte === false ? "non" : "[non renseigné]"));
      L.push("");
      if (nbEt === null) {
        L.push("Le nombre d'établissements distincts n'est pas renseigné : on ne peut pas");
        L.push("savoir si un comité central devait être réuni. C'est la première chose à");
        L.push("établir, et elle se lit sur l'accord de reconnaissance des établissements");
        L.push("distincts ou sur la décision qui en tient lieu.");
      } else if (nbEt <= 1) {
        L.push("Établissement unique : le comité de l'entreprise est seul compétent, et ce");
        L.push("document est sans objet — sauf si le périmètre a changé depuis l'audit.");
      } else if (central) {
        L.push(nbEt + " établissements distincts, et le comité central a été réuni ainsi que les");
        L.push("comités d'établissement intéressés. Les convocations ci-dessous servent");
        L.push("alors de trame de vérification : contrôlez que CHAQUE comité intéressé a");
        L.push("été convoqué, et non seulement le central.");
      } else {
        L.push(nbEt + " établissements distincts, et le comité central n'a pas été réuni.");
      }
      L.push("");
      L.push("LE CRITÈRE, À ÉTABLIR PAR ÉCRIT — c'est lui qui se discute, non le nombre");
      L.push("d'établissements :");
      L.push("");
      L.push("  Les mesures envisagées excèdent-elles le pouvoir du ou des chefs");
      L.push("  d'établissement concernés ?  ☐ oui  ☐ non");
      L.push("  [Justifier : quelles décisions relèvent de la direction générale, quelles");
      L.push("  délégations de pouvoir existent, ce que le chef d'établissement peut");
      L.push("  décider seul.]");
      L.push("");
      L.push("  Les mesures portent-elles sur plusieurs établissements simultanément ?");
      L.push("  ☐ oui  ☐ non");
      L.push("  [Énumérer les établissements touchés et, pour chacun, le nombre de");
      L.push("  suppressions envisagées.]");
      L.push("");
      L.push("  Établissements INTÉRESSÉS, dont le comité doit être réuni :");
      L.push("  [liste — un établissement dont aucune mesure ne touche les salariés n'est");
      L.push("  pas intéressé au sens du texte]");
      L.push("");
      L.push("Une seule réponse « oui » suffit : le texte pose les deux branches comme");
      L.push("alternatives.");
      L.push("");

      titre(L, "II. L'ordre des réunions");

      L.push("L'article L. 1233-36 le fixe, et il n'est pas intuitif : « Dans les");
      L.push("entreprises dotées d'un comité social et économique central, l'employeur");
      L.push("consulte le comité central et le ou les comités sociaux et économiques");
      L.push("d'établissement intéressés dès lors que les mesures envisagées excèdent le");
      L.push("pouvoir du ou des chefs d'établissement concernés ou portent sur plusieurs");
      L.push("établissements simultanément. Dans ce cas, le ou les comités sociaux et");
      L.push("économiques d'établissement tiennent leurs réunions APRÈS celles du comité");
      L.push("social et économique central tenues en application de l'article L. 1233-30.");
      L.push("Ces réunions ont lieu dans les délais prévus à l'article L. 1233-30. Si la");
      L.push("désignation d'un expert est envisagée, elle est effectuée par le comité");
      L.push("social et économique central […]. »");
      L.push("");
      L.push("Trois conséquences pratiques :");
      L.push("");
      L.push("  1. Le central d'abord, les établissements ensuite. L'ordre inverse ne");
      L.push("     s'aménage pas.");
      L.push("  2. Les réunions des comités d'établissement se tiennent dans les MÊMES");
      L.push("     délais que ceux de l'article L. 1233-30 : elles ne rouvrent pas un");
      L.push("     délai propre.");
      L.push("  3. L'expert, s'il est envisagé, est désigné par le comité CENTRAL. Une");
      L.push("     désignation faite par un comité d'établissement n'est pas celle que ce");
      L.push("     texte prévoit.");
      L.push("");
      L.push("Et l'article L. 1233-51 ajoute une obligation qu'on oublie : « Lorsque le");
      L.push("projet de licenciement donne lieu à consultation du comité social et");
      L.push("économique central, l'autorité administrative du siège de l'entreprise est");
      L.push("informée de cette consultation et, le cas échéant, de la désignation d'un");
      L.push("expert. » C'est l'administration DU SIÈGE, et l'information porte aussi sur");
      L.push("l'expertise.");
      L.push("");

      titre(L, "III. La convocation du comité social et économique central");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres du comité social et économique central");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : convocation du comité social et économique central — projet de");
      L.push("licenciement collectif pour motif économique");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Un projet de licenciement collectif pour motif économique portant sur " +
        (nbLic(f) === null ? "[nombre]" : nbLic(f)));
      L.push("salarié(s) dans une même période de trente jours est envisagé.");
      L.push("");
      L.push("Les mesures envisagées [excèdent le pouvoir des chefs d'établissement");
      L.push("concernés / portent sur plusieurs établissements simultanément — reprendre");
      L.push("la branche établie au I et la motiver]. En application de l'article");
      L.push("L. 1233-9 du code du travail, le comité social et économique central est en");
      L.push("conséquence réuni, ainsi que les comités d'établissement intéressés.");
      L.push("");
      L.push("Vous êtes convoqués à la réunion du [DATE], à [HEURE], à [LIEU]. L'ordre du");
      L.push("jour et l'ensemble des renseignements prévus par le code du travail sont");
      L.push("joints à la présente.");
      L.push("");
      L.push("Les comités d'établissement intéressés — " +
        (nbEt !== null && nbEt > 1 ? "[énumérer les " + nbEt + " établissements et désigner les intéressés]" : "[énumérer]") + " —");
      L.push("tiendront leurs réunions après celles du comité central, conformément à");
      L.push("l'article L. 1233-36.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièces jointes : ordre du jour · note d'information portant les");
      L.push("renseignements exigés · [le cas échéant] projet de plan de sauvegarde de");
      L.push("l'emploi · exposé des conséquences en matière de santé, de sécurité et de");
      L.push("conditions de travail");
      L.push("");

      titre(L, "IV. La convocation de chaque comité d'établissement intéressé");

      L.push("Une convocation PAR établissement intéressé. Le texte dit « le ou les");
      L.push("comités […] intéressés » : convoquer l'un et pas l'autre, c'est ne pas");
      L.push("consulter le second.");
      L.push("");
      L.push(nom(ctx) + " — Établissement de [NOM DE L'ÉTABLISSEMENT]");
      L.push("");
      L.push("Aux membres du comité social et économique");
      L.push("de l'établissement de [NOM]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : convocation du comité d'établissement — projet de licenciement");
      L.push("collectif pour motif économique");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le comité social et économique central a été réuni le [DATE] sur le projet");
      L.push("de licenciement collectif pour motif économique, en application de");
      L.push("l'article L. 1233-9 du code du travail.");
      L.push("");
      L.push("Votre établissement étant intéressé par les mesures envisagées — [préciser :");
      L.push("nombre de suppressions d'emploi projetées dans l'établissement, catégories");
      L.push("professionnelles concernées] —, je vous convoque à la réunion du [DATE], à");
      L.push("[HEURE], à [LIEU].");
      L.push("");
      L.push("Cette réunion se tient après celle du comité central, comme l'article");
      L.push("L. 1233-36 le prévoit, et dans les délais de l'article L. 1233-30.");
      L.push("");
      L.push("L'ordre du jour et l'ensemble des renseignements sont joints.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "V. À qui les convocations sont adressées");
      destinataires(L, ctx, true);

      titre(L, "VI. L'information de l'autorité administrative du siège");

      L.push(nom(ctx));
      L.push("");
      L.push("À l'autorité administrative du siège de l'entreprise");
      L.push("");
      L.push(ville(ctx) + ", le [DATE]");
      L.push("");
      L.push("Objet : information au titre de l'article L. 1233-51 du code du travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Le projet de licenciement collectif pour motif économique envisagé au sein");
      L.push("de " + nom(ctx) + " donne lieu à consultation du comité social et");
      L.push("économique central, en application de l'article L. 1233-9 du code du");
      L.push("travail.");
      L.push("");
      L.push("Conformément à l'article L. 1233-51, je vous en informe. Le comité central");
      L.push("a été convoqué le [DATE] pour une réunion le [DATE] ; les comités des");
      L.push("établissements intéressés — [liste] — seront réunis à sa suite.");
      L.push("");
      L.push("[Le cas échéant] Le comité social et économique central a désigné un expert");
      L.push("le [DATE] : [identité de l'expert et objet de la mission].");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez par écrit le critère de");
      L.push("l'article L. 1233-9 et la liste des établissements intéressés.");
      L.push("");
      L.push("Puis, dans l'ordre, et dans cet ordre seulement :");
      L.push("");
      L.push("  1. Convocation du comité central, avec l'ensemble des renseignements.");
      L.push("  2. Information de l'autorité administrative du siège (L. 1233-51).");
      L.push("  3. Réunions du comité central — deux au moins lorsque l'article");
      L.push("     L. 1233-30 s'applique, espacées d'au moins quinze jours.");
      L.push("  4. Réunions des comités d'établissement intéressés, APRÈS celles du");
      L.push("     central, et dans les délais de l'article L. 1233-30.");
      L.push("  5. Avis, ou expiration du délai.");
      L.push("");
      if (rs.length && manque) {
        L.push("Vos réunions déjà tenues — " + rs.map(function (x) { return jour(x); }).join(", ") + " — ne");
        L.push("comptent pas comme réunions du comité central si elles se sont tenues");
        L.push("devant une autre instance. La consultation reprend à l'étape 1, et le");
        L.push("délai d'avis courra de la première réunion du comité central, non de");
        L.push("celles-là.");
        L.push("");
      }
      L.push("Comptez plusieurs semaines : la reprise d'une consultation devant l'instance");
      L.push("compétente n'est pas une formalité de rattrapage, c'est la procédure");
      L.push("entière.");

      pied(L, ["L. 1233-9", "L. 1233-36", "L. 1233-30", "L. 1233-51"],
        "Le fondement du contrôle cite également l'article L. 2316-1, relatif aux\n" +
        "attributions du comité social et économique central. Le corpus de textes du\n" +
        "module ne le porte pas : l'application ne l'a pas lu, elle le nomme sans en\n" +
        "reproduire ni en paraphraser le contenu.\n" +
        "\n" +
        "Ce qui se joue : consulter la mauvaise instance équivaut à ne pas consulter.\n" +
        "L'article L. 1235-12 ouvre alors au salarié une indemnité calculée en fonction\n" +
        "du préjudice subi ; en régime de plan de sauvegarde de l'emploi, l'autorité\n" +
        "administrative vérifie la régularité de la procédure d'information et de\n" +
        "consultation (L. 1233-57-2, 2° ; L. 1233-57-3), et l'article L. 1235-10\n" +
        "attache la nullité au licenciement intervenu en l'absence de décision de\n" +
        "validation ou d'homologation.");
      return L.join("\n");
    });

  /* Les articles qui règlent l'organisation des élections et l'établissement du
     procès-verbal de carence (L. 2314-8 et suivants, L. 2314-9) ne sont pas dans
     le corpus du module et ne fondent pas ce contrôle : le document les NOMME —
     D. 1233-10 renvoie expressément à L. 2314-9 — sans en reproduire ni en
     paraphraser le contenu, et il le dit. */
  doc("CTL-CSE-08",
    "Le procès-verbal de carence, ou le constat de la situation du comité",
    "La situation retenue écrite noir sur blanc — comité en place, carence " +
    "établie, ou processus électoral à engager —, la pièce qui l'établit, et ce " +
    "que l'absence de comité change dans le dossier adressé à l'administration.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f);
      var existe = f.cseExistant;
      var pv = f.pvCarence;
      var eff = effectifDe(ctx);

      L = L.concat(entete(ctx, "Situation du comité social et économique — carence ou mise en place",
        "articles D. 1233-10, R. 1233-9 et L. 1233-49 du code du travail"));

      modeEmploi(L, [
        "L'absence de comité ne dispense pas de consulter : elle doit être ÉTABLIE.",
        "Tant qu'aucune pièce ne l'établit, l'employeur qui n'a pas consulté n'a pas",
        "de moyen de dire qu'il en était dispensé — il a seulement omis de",
        "consulter, ce qui n'est pas la même chose devant un juge.",
        "",
        "La pièce qui l'établit est le procès-verbal de carence. Le code du travail",
        "en tire lui-même les conséquences dans cette procédure : l'article",
        "D. 1233-10 impose de le JOINDRE à la notification du projet de licenciement",
        "adressée à l'autorité administrative.",
        "",
        "Ce document fait trois choses : il vous fait écrire la situation réelle, il",
        "produit le constat correspondant, et il dit ce que l'absence de comité",
        "change dans le dossier — ce n'est pas rien, et c'est souvent découvert trop",
        "tard.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. La situation, telle que la fiche la porte");

      L.push("  Comité social et économique en place ..... " +
        (existe === true ? "oui" : existe === false ? "non" : "[non renseigné]"));
      L.push("  Procès-verbal de carence produit ......... " +
        (pv ? "oui" : existe === false ? "NON" : "[sans objet ou non renseigné]"));
      L.push("  Effectif de l'entreprise ................. " +
        (eff === null ? "[non renseigné]" : eff + " salariés"));
      L.push("  Consultation due ......................... " +
        (r ? (r.consultationCSE ? "oui" : "non dans cette configuration") : "[régime non rappelé ici]"));
      L.push("");
      if (existe === true) {
        L.push("Un comité est en place : ce document sert alors à vérifier une seule chose,");
        L.push("mais la vérifier vraiment — que le mandat des membres court toujours, et");
        L.push("que le comité convoqué est bien celui qui existe. Un comité dont le mandat");
        L.push("est expiré ne consulte plus.");
      } else if (existe === false && pv) {
        L.push("Aucun comité, mais un procès-verbal de carence est produit. Vérifiez trois");
        L.push("choses : sa date, le scrutin auquel il se rapporte, et qu'il est bien versé");
        L.push("AU DOSSIER ADRESSÉ À L'ADMINISTRATION — l'article D. 1233-10 l'impose.");
      } else if (existe === false) {
        L.push("Aucun comité, et aucun procès-verbal de carence. C'est la situation la plus");
        L.push("exposée : la procédure est conduite comme si la consultation n'était pas");
        L.push("due, alors qu'elle l'était, et rien n'établit la dispense.");
      } else {
        L.push("L'existence d'un comité n'est pas renseignée. C'est la première question à");
        L.push("trancher : tout le reste de la procédure en dépend.");
      }
      L.push("");

      titre(L, "II. Le constat de situation — à établir et à verser");

      L.push("CONSTAT DE LA SITUATION DE LA REPRÉSENTATION DU PERSONNEL");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Je soussigné(e) " + signataire(ctx) + ", constate ce qui suit à la date");
      L.push("du " + leJour(ctx.aujourdhui) + ".");
      L.push("");
      L.push("  ☐ Un comité social et économique est en place dans l'entreprise.");
      L.push("     Date de proclamation des résultats : [AAAA-MM-JJ]");
      L.push("     Terme des mandats en cours : [AAAA-MM-JJ]");
      L.push("     Nombre de membres titulaires : [  ] · suppléants : [  ]");
      L.push("     Pièce jointe : procès-verbal des dernières élections.");
      L.push("");
      L.push("  ☐ Aucun comité n'est en place, et une CARENCE a été constatée.");
      L.push("     Date du procès-verbal de carence : [AAAA-MM-JJ]");
      L.push("     Scrutin auquel il se rapporte : [premier tour / second tour, date]");
      L.push("     Pièce jointe : procès-verbal de carence.");
      L.push("");
      L.push("  ☐ Aucun comité n'est en place et AUCUNE carence n'est établie.");
      L.push("     Le processus électoral est engagé le [AAAA-MM-JJ].");
      L.push("     Pièces jointes : [invitation des organisations syndicales, protocole");
      L.push("     d'accord préélectoral, calendrier du scrutin]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(ctx.aujourdhui) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Une seule case est cochée. Deux cases cochées, ou aucune, et le constat ne");
      L.push("constate rien.");
      L.push("");

      titre(L, "III. Ce que l'absence de comité change dans le dossier");

      L.push("Trois textes lus à la source, et ils ne disent pas la même chose :");
      L.push("");
      L.push("D. 1233-10 — le procès-verbal de carence est joint à la notification :");
      L.push("« En cas d'absence de comité social et économique, par suite d'une carence");
      L.push("constatée dans les conditions prévues à l'article L. 2314-9, l'employeur");
      L.push("joint à la notification du projet de licenciement le procès-verbal de");
      L.push("carence établi conformément à ces articles et l'adresse par la voie");
      L.push("dématérialisée. »");
      L.push("");
      L.push("R. 1233-9 — les informations et le plan partent avec la notification :");
      L.push("« Lorsqu'il n'existe pas de comité social et économique dans l'entreprise,");
      L.push("les informations mentionnées à l'article L. 1233-31, le plan de sauvegarde");
      L.push("de l'emploi et les renseignements prévus au 1° de l'article R. 1233-6 sont");
      L.push("adressés par la voie dématérialisée au directeur régional […] en même temps");
      L.push("que la notification du projet de licenciement prévue à l'article");
      L.push("L. 1233-46. »");
      L.push("");
      L.push("L. 1233-49 — et le plan est porté à la connaissance des salariés :");
      L.push("« Lorsque l'entreprise est dépourvue de comité social et économique et est");
      L.push("soumise à l'obligation d'établir un plan de sauvegarde de l'emploi, ce plan");
      L.push("ainsi que les informations destinées aux représentants du personnel");
      L.push("mentionnées à l'article L. 1233-31 sont communiqués à l'autorité");
      L.push("administrative en même temps que la notification du projet de licenciement.");
      L.push("En outre, le plan est porté à la connaissance des salariés par tout moyen");
      L.push("sur les lieux de travail. »");
      L.push("");
      L.push("Autrement dit : sans comité, ce qui lui aurait été adressé va à");
      L.push("l'administration, et le plan va directement aux salariés. Ce n'est pas une");
      L.push("dispense — c'est un autre circuit, et il a ses propres pièces.");
      L.push("");
      L.push("BORDEREAU DU DOSSIER, EN L'ABSENCE DE COMITÉ");
      L.push("");
      tableau(L, ["Pièce", "Fondement", "Jointe"], [
        ["Procès-verbal de carence", "D. 1233-10", "☐"],
        ["Notification du projet de licenciement", "L. 1233-46", "☐"],
        ["Informations de l'article L. 1233-31", "R. 1233-9 · L. 1233-49", "☐"],
        ["Plan de sauvegarde de l'emploi, s'il est dû", "R. 1233-9 · L. 1233-49", "☐"],
        ["Preuve de la publicité du plan sur les lieux de travail", "L. 1233-49", "☐"],
      ]);
      L.push("");
      L.push("Envoi par la voie dématérialisée : les deux textes le précisent.");
      L.push("");

      titre(L, "IV. S'il n'existe ni comité ni carence");

      L.push("Il faut engager le processus électoral. L'application NE PRODUIT PAS ici");
      L.push("les pièces de ce processus : les articles du code du travail qui règlent");
      L.push("l'organisation des élections et l'établissement du procès-verbal de");
      L.push("carence — l'article L. 2314-9, auquel D. 1233-10 renvoie, et ceux qui");
      L.push("l'entourent — ne figurent pas dans le corpus de textes de ce module.");
      L.push("L'application les nomme ; elle ne les a pas lus, et elle n'en écrira donc");
      L.push("ni le contenu ni les délais.");
      L.push("");
      L.push("Le module « comité social et économique » de cette application traite de");
      L.push("l'organisation des élections et porte ces textes : c'est là qu'il faut");
      L.push("aller, et non ici.");
      L.push("");
      L.push("Ce que ce document peut dire, en revanche, et qui suffit à décider :");
      L.push("");
      L.push("  — l'organisation d'élections se compte en mois, pas en jours ;");
      L.push("  — la procédure de licenciement ne s'interrompt pas d'elle-même pendant");
      L.push("    ce temps : c'est à vous d'arrêter le calendrier, par écrit ;");
      L.push("  — engager le processus après avoir notifié les licenciements ne");
      L.push("    rétablit rien : la consultation était due avant.");
      L.push("");
      L.push("  Décision retenue, à écrire et à dater : ..............................");
      L.push("  ......................................................................");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous cochez UNE case du constat du II, et");
      L.push("vous joignez la pièce qui l'établit.");
      L.push("");
      if (existe === false && !pv) {
        L.push("Vous n'avez ni comité ni carence : rien ne peut être joint aujourd'hui.");
        L.push("Deux chemins, et ils ne se cumulent pas — retrouver le procès-verbal de");
        L.push("carence du dernier scrutin s'il existe, ou engager le processus électoral.");
        L.push("Dans le second cas, le calendrier de la procédure de licenciement est à");
        L.push("reprendre entièrement.");
        L.push("");
      }
      L.push("Ensuite — si la carence est établie, le dossier adressé à l'administration");
      L.push("change de composition : reportez-vous au bordereau du III et complétez-le");
      L.push("avant l'envoi, non après.");
      L.push("");
      L.push("Et si un plan de sauvegarde de l'emploi est dû, n'oubliez pas la dernière");
      L.push("phrase de l'article L. 1233-49 : le plan est « porté à la connaissance des");
      L.push("salariés par tout moyen sur les lieux de travail ». Conservez la preuve de");
      L.push("cet affichage — date et lieu.");

      pied(L, ["D. 1233-10", "R. 1233-9", "L. 1233-49", "L. 1233-46", "L. 1233-31"],
        "L'article L. 2314-9, auquel D. 1233-10 renvoie pour les conditions du constat\n" +
        "de carence, N'A PAS ÉTÉ LU : il ne figure pas dans le corpus de textes du\n" +
        "module. Il est nommé, jamais reproduit ni paraphrasé.\n" +
        "\n" +
        "Ce qui se joue : sans comité et sans procès-verbal de carence, l'employeur ne\n" +
        "peut pas établir qu'il était dispensé de consulter. L'article L. 1235-12 ouvre\n" +
        "alors au salarié une indemnité calculée en fonction du préjudice subi, et\n" +
        "lorsqu'un plan de sauvegarde de l'emploi est dû, l'article L. 1235-10 attache\n" +
        "la nullité au licenciement intervenu en l'absence de décision de validation ou\n" +
        "d'homologation.");
      return L.join("\n");
    });

  doc("CTL-CSE-09",
    "Le calendrier arrêté de l'expertise et de la consultation",
    "La date de désignation, le calendrier des demandes d'informations que le " +
    "texte enferme dans des délais courts, la date de remise du rapport que " +
    "l'article fixe, et l'articulation avec l'expiration du délai d'avis.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var mois = delaiAvisMois(r);
      var depart = rs.length ? rs[0] : null;
      var expiration = (depart && mois) ? plusMois(depart, mois) : null;
      var remiseButoir = expiration ? plusJours(expiration, -15) : null;

      L = L.concat(entete(ctx, "Calendrier de l'expertise du comité et de la consultation",
        "articles L. 1233-34 et L. 1233-35 du code du travail"));

      modeEmploi(L, [
        "L'expertise ne prolonge pas le délai d'avis. Aucun des textes lus ne le",
        "prévoit, et l'article L. 1233-34 dit l'inverse : « Le rapport de l'expert",
        "est remis au comité social et économique et, le cas échéant, aux",
        "organisations syndicales, au plus tard quinze jours avant l'expiration du",
        "délai mentionné à l'article L. 1233-30. » Le rapport doit donc entrer DANS",
        "le délai, avec quinze jours de marge — ce n'est pas le délai qui s'étire",
        "pour attendre le rapport.",
        "",
        "D'où deux échecs symétriques, également fréquents. Attendre le rapport",
        "au-delà du délai, et notifier alors que le comité n'a pas pu se prononcer.",
        "Ou notifier avant l'expiration parce que l'expertise n'est pas finie — et",
        "notifier sans que le comité soit réputé consulté.",
        "",
        "Ce document arrête le calendrier par écrit, avec les dates calculées, et",
        "l'adresse au comité et à l'expert. Un calendrier qui n'est pas écrit n'est",
        "pas un calendrier.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Ce que le texte permet, et à quelles conditions");

      L.push("L. 1233-34 : « Dans les entreprises d'au moins cinquante salariés, lorsque");
      L.push("le projet de licenciement concerne au moins dix salariés dans une même");
      L.push("période de trente jours, le comité social et économique peut, le cas");
      L.push("échéant sur proposition des commissions constituées en son sein, décider,");
      L.push("LORS DE LA PREMIÈRE RÉUNION prévue à l'article L. 1233-30, de recourir à");
      L.push("une expertise pouvant porter sur les domaines économique et comptable ainsi");
      L.push("que sur la santé, la sécurité ou les effets potentiels du projet sur les");
      L.push("conditions de travail. »");
      L.push("");
      L.push("Trois conditions, donc, et elles se cumulent : l'effectif, le nombre de");
      L.push("licenciements, et le moment de la décision — LORS DE LA PREMIÈRE RÉUNION.");
      L.push("Une décision prise à la seconde réunion n'est pas celle que ce texte");
      L.push("prévoit, et cela ne se rattrape pas plus qu'une date.");
      L.push("");
      L.push("Le même article ajoute : « L'expert peut être assisté dans les conditions");
      L.push("prévues à l'article L. 2315-81 » et « Le comité social et économique peut");
      L.push("également mandater un expert afin qu'il apporte toute analyse utile aux");
      L.push("organisations syndicales pour mener la négociation prévue à l'article");
      L.push("L. 1233-24-1. » L'article L. 2315-81 n'est pas dans le corpus de ce module :");
      L.push("l'application le nomme, elle ne l'a pas lu et n'en écrit pas le contenu.");
      L.push("");
      L.push("L. 1233-35 enferme les échanges dans des délais courts, et symétriques :");
      L.push("« L'expert désigné par le comité social et économique demande à l'employeur,");
      L.push("DANS LES DIX JOURS à compter de sa désignation, toutes les informations");
      L.push("qu'il juge nécessaires à la réalisation de sa mission. L'employeur répond à");
      L.push("cette demande DANS LES HUIT JOURS. Le cas échéant, l'expert demande, dans");
      L.push("les dix jours, des informations complémentaires à l'employeur, qui répond à");
      L.push("cette demande dans les huit jours à compter de la date à laquelle la demande");
      L.push("de l'expert est formulée. »");
      L.push("");
      L.push("Les huit jours de l'employeur sont la partie du calendrier que vous tenez :");
      L.push("c'est la seule échéance de cet article qui dépende de vous, et c'est celle");
      L.push("qu'on vous opposera si le rapport est remis en retard.");
      L.push("");

      titre(L, "II. Votre calendrier, calculé");

      L.push("  Expertise décidée ou demandée ......... " +
        (f.expertise === true ? "oui, selon la fiche"
          : f.expertise === false ? "non, selon la fiche" : "[non renseigné]"));
      L.push("  Première réunion ...................... " +
        (depart ? jour(depart) : "[date non renseignée]"));
      L.push("  Délai d'avis .......................... " +
        (r && r.delaiAvis ? r.delaiAvis : "[délai du régime]"));
      L.push("  Expiration du délai d'avis ............ " +
        (expiration ? jour(expiration) : "[à calculer depuis la première réunion]"));
      L.push("");
      if (expiration) {
        L.push("  REMISE DU RAPPORT AU PLUS TARD ........ " + jour(remiseButoir));
        L.push("  (quinze jours avant l'expiration du délai — L. 1233-34, dernier alinéa)");
        L.push("");
      }
      L.push("Les dates de l'expertise elle-même, à compléter et à faire confirmer par");
      L.push("l'expert :");
      L.push("");
      L.push("  Décision du comité de recourir à l'expertise ..... [AAAA-MM-JJ]");
      L.push("  (doit être celle de la première réunion — L. 1233-34)");
      L.push("  Désignation de l'expert ......................... [AAAA-MM-JJ]");
      L.push("  Demande d'informations de l'expert .............. [AAAA-MM-JJ]");
      L.push("  (au plus tard dix jours après la désignation — L. 1233-35)");
      L.push("  Réponse de l'employeur ......................... [AAAA-MM-JJ]");
      L.push("  (au plus tard huit jours après la demande — L. 1233-35)");
      L.push("  Demande complémentaire, le cas échéant ......... [AAAA-MM-JJ]");
      L.push("  Réponse de l'employeur ......................... [AAAA-MM-JJ]");
      L.push("  Remise du rapport .............................. [AAAA-MM-JJ]");
      L.push("");
      if (expiration) {
        L.push("Confrontez la dernière ligne au butoir du " + jour(remiseButoir) + ". Si l'expert");
        L.push("annonce une date postérieure, ce n'est pas le délai d'avis qui s'adapte :");
        L.push("c'est le calendrier de l'expertise qu'il faut resserrer, ou le comité qui");
        L.push("se prononcera sans le rapport.");
        L.push("");
      }
      if (r && !r.pse) {
        L.push("Note — l'audit ne retient pas ici le régime dans lequel l'article");
        L.push("L. 1233-34 ouvre cette expertise (entreprise d'au moins cinquante salariés,");
        L.push("projet d'au moins dix licenciements sur trente jours). Vérifiez que");
        L.push("l'expertise envisagée repose bien sur un autre fondement, que l'application");
        L.push("n'a pas lu.");
        L.push("");
      }

      titre(L, "III. La lettre au comité — le calendrier arrêté");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : calendrier de l'expertise et de la consultation");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le comité a décidé, lors de sa réunion du " + (depart ? jour(depart) : "[DATE]") +
        ", de recourir à une");
      L.push("expertise portant sur [préciser les domaines : économique et comptable ;");
      L.push("santé, sécurité ou effets potentiels du projet sur les conditions de");
      L.push("travail]. L'expert désigné est [identité], désigné le [DATE].");
      L.push("");
      L.push("Je vous confirme le calendrier arrêté :");
      L.push("");
      L.push("  — demande d'informations de l'expert : [DATE] ;");
      L.push("  — réponse de l'entreprise : [DATE], dans les huit jours que l'article");
      L.push("    L. 1233-35 impose ;");
      L.push("  — remise du rapport : [DATE].");
      L.push("");
      if (expiration) {
        L.push("Je rappelle que l'article L. 1233-34 prévoit que le rapport est remis « au");
        L.push("plus tard quinze jours avant l'expiration du délai mentionné à l'article");
        L.push("L. 1233-30 », soit ici au plus tard le " + jour(remiseButoir) + ".");
        L.push("");
        L.push("Le délai d'avis, quant à lui, court depuis la première réunion du " +
          jour(depart) + " et");
        L.push("expire le " + jour(expiration) + ". À cette date, en l'absence d'avis, le comité sera");
        L.push("réputé avoir été consulté : l'expertise n'a pas pour effet de prolonger ce");
        L.push("délai.");
      } else {
        L.push("Je rappelle que le rapport est remis « au plus tard quinze jours avant");
        L.push("l'expiration du délai mentionné à l'article L. 1233-30 » (L. 1233-34), et");
        L.push("que ce délai court depuis la première réunion. En l'absence d'avis à son");
        L.push("expiration, le comité est réputé avoir été consulté : l'expertise n'a pas");
        L.push("pour effet de le prolonger.");
      }
      L.push("");
      L.push("Je me tiens à votre disposition pour toute demande d'information de");
      L.push("l'expert, à laquelle il sera répondu dans le délai de huit jours.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "IV. La lettre à l'expert");

      L.push("À [identité de l'expert désigné]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : expertise décidée par le comité social et économique — calendrier");
      L.push("et modalités d'échange");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + " a décidé, lors de sa");
      L.push("réunion du " + (depart ? jour(depart) : "[DATE]") + ", de recourir à une expertise et vous a désigné le");
      L.push("[DATE].");
      L.push("");
      L.push("L'article L. 1233-35 du code du travail enferme nos échanges dans des");
      L.push("délais courts : vous disposez de dix jours à compter de votre désignation");
      L.push("pour me demander toutes les informations que vous jugez nécessaires, et je");
      L.push("dispose de huit jours pour y répondre ; le même rythme vaut pour une");
      L.push("demande complémentaire.");
      L.push("");
      if (remiseButoir) {
        L.push("Je vous indique la date qui commande ce calendrier : votre rapport doit être");
        L.push("remis au comité au plus tard le " + jour(remiseButoir) + ", soit quinze jours avant");
        L.push("l'expiration, le " + jour(expiration) + ", du délai d'avis courant depuis la première");
        L.push("réunion du " + jour(depart) + " (L. 1233-34 et L. 1233-30, II).");
      } else {
        L.push("Votre rapport doit être remis au comité au plus tard quinze jours avant");
        L.push("l'expiration du délai d'avis mentionné à l'article L. 1233-30, délai qui");
        L.push("court depuis la première réunion (L. 1233-34).");
      }
      L.push("");
      L.push("Interlocuteur désigné pour vos demandes : [nom, fonction, courriel,");
      L.push("téléphone]. Toute demande sera horodatée et fera l'objet d'un accusé de");
      L.push("réception, afin que le respect du délai de huit jours soit vérifiable de");
      L.push("part et d'autre.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous écrivez le calendrier, vous l'adressez");
      L.push("au comité et à l'expert, et vous le versez au dossier.");
      L.push("");
      if (expiration) {
        L.push("  Remise du rapport, au plus tard ......... " + jour(remiseButoir));
        L.push("  Expiration du délai d'avis .............. " + jour(expiration));
        L.push("  Première notification concevable ........ " + jour(plusJours(expiration, 1)));
        L.push("");
        L.push("Ces trois dates se lisent ensemble. La deuxième ne bouge pas parce que la");
        L.push("première a été manquée.");
      } else {
        L.push("Les dates ne sont pas calculables en l'état : il manque la date de la");
        L.push("première réunion, ou le régime n'exprime pas le délai d'avis en mois.");
        L.push("Renseignez-les, et ce calendrier se remplira tout seul.");
      }
      L.push("");
      L.push("Si le rapport n'est pas remis à temps — le délai d'avis court quand même.");
      L.push("Le comité rendra son avis sans le rapport, ou sera réputé consulté à");
      L.push("l'expiration. Ne fixez aucune notification avant cette date, expertise");
      L.push("remise ou non.");
      if (r && r.pse) {
        L.push("");
        L.push("Et un plan de sauvegarde de l'emploi étant dû, la décision de recourir à");
        L.push("une expertise doit en outre être mentionnée dans la notification du projet");
        L.push("adressée à l'administration : l'article D. 1233-4, 5° l'exige — « en cas de");
        L.push("recours à un expert-comptable par le comité social et économique, mention");
        L.push("de cette décision ».");
      }

      pied(L, ["L. 1233-34", "L. 1233-35", "L. 1233-30", "D. 1233-4"],
        "L'article L. 2315-81, auquel L. 1233-34 renvoie pour l'assistance de l'expert,\n" +
        "N'A PAS ÉTÉ LU : il ne figure pas dans le corpus de textes du module. Il est\n" +
        "nommé, jamais reproduit.\n" +
        "\n" +
        "Ce qui se joue : un calendrier d'expertise mal articulé conduit soit à\n" +
        "notifier avant que le comité soit réputé consulté, soit à laisser expirer le\n" +
        "délai sans qu'il ait pu se prononcer. Dans les deux cas, l'irrégularité de la\n" +
        "consultation ouvre au salarié l'indemnité de l'article L. 1235-12, calculée en\n" +
        "fonction du préjudice subi.");
      return L.join("\n");
    });

  doc("CTL-CSE-10",
    "L'exposé des conséquences en matière de santé, de sécurité et de conditions de travail",
    "Le septième renseignement rédigé : ce que le projet change poste par poste, " +
    "pour ceux qui partent comme pour ceux qui restent, les mesures de prévention " +
    "envisagées, et le courrier qui le joint à la convocation.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f);
      var art = articleRenseignements(r);
      var deja = String(f.consequencesSSCT || "").trim();
      var postes = Array.isArray(f.postesSupprimes) ? f.postesSupprimes : [];

      L = L.concat(entete(ctx,
        "Conséquences du projet en matière de santé, de sécurité et de conditions de travail",
        art ? "article " + art + ", 7° du code du travail"
            : "articles L. 1233-10, 7° et L. 1233-31, 7° du code du travail"));

      modeEmploi(L, [
        "C'est le septième renseignement, et il est dû comme les six autres. Le texte",
        "dit « le cas échéant » : ces mots visent l'hypothèse où le projet n'a aucune",
        "conséquence sur la santé, la sécurité ou les conditions de travail — ce qui",
        "se démontre, et se rencontre rarement. Un projet qui supprime des postes",
        "redistribue la charge de ceux qui restent : c'est déjà une conséquence sur",
        "les conditions de travail.",
        "",
        "L'exposé porte donc sur DEUX populations, et l'oubli de la seconde est",
        "l'erreur ordinaire : les salariés dont le licenciement est envisagé, et ceux",
        "qui demeurent dans l'entreprise.",
        "",
        "Écrivez-le poste par poste et service par service. Un exposé général — « le",
        "projet n'aura pas d'incidence significative » — ne renseigne rien et se",
        "retourne : il établit que la question a été posée et qu'on n'y a pas",
        "répondu.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le texte");

      if (art === "L. 1233-10") {
        L.push("L. 1233-10, 7° : « Le cas échéant, les conséquences des licenciements");
        L.push("projetés en matière de santé, de sécurité ou de conditions de travail. »");
      } else if (art === "L. 1233-31") {
        L.push("L. 1233-31, 7° : « Le cas échéant, les conséquences de la réorganisation en");
        L.push("matière de santé, de sécurité ou de conditions de travail. »");
      } else {
        L.push("Les deux rédactions, selon le régime :");
        L.push("");
        L.push("L. 1233-10, 7° : « Le cas échéant, les conséquences des licenciements");
        L.push("projetés en matière de santé, de sécurité ou de conditions de travail. »");
        L.push("");
        L.push("L. 1233-31, 7° : « Le cas échéant, les conséquences de la réorganisation en");
        L.push("matière de santé, de sécurité ou de conditions de travail. »");
      }
      L.push("");
      L.push("La nuance n'est pas verbale. L. 1233-10 vise les conséquences DES");
      L.push("LICENCIEMENTS ; L. 1233-31, celles DE LA RÉORGANISATION — c'est-à-dire de");
      L.push("l'opération dans son ensemble, et non des seules ruptures. L'exposé du");
      L.push("second est donc plus large que celui du premier. Dans le doute, couvrez");
      L.push("les deux : l'exposé le plus large satisfait le plus étroit, l'inverse est");
      L.push("faux.");
      L.push("");
      L.push("Ce point revient une seconde fois dans la procédure : l'article");
      L.push("L. 1233-30, I, 2° range « le cas échéant, les conséquences des");
      L.push("licenciements projetés en matière de santé, de sécurité ou de conditions de");
      L.push("travail » parmi les objets sur lesquels le comité est consulté. Il est donc");
      L.push("à la fois un renseignement à adresser et un objet de consultation.");
      L.push("");
      if (deja) {
        L.push("Votre fiche porte à ce titre :");
        L.push("");
        L.push("  « " + deja + " »");
        L.push("");
        L.push("C'est un point de départ, pas l'exposé : reprenez-le dans la trame");
        L.push("ci-dessous et développez-le poste par poste.");
        L.push("");
      } else {
        L.push("Votre fiche ne porte rien à ce titre. L'exposé est donc entièrement à");
        L.push("écrire — et il ne peut pas l'être par l'application, qui ne connaît ni vos");
        L.push("postes, ni vos cadences, ni votre document unique d'évaluation des risques.");
        L.push("");
      }

      titre(L, "II. L'exposé — trame à compléter");

      L.push("EXPOSÉ DES CONSÉQUENCES DU PROJET EN MATIÈRE DE SANTÉ, DE SÉCURITÉ ET DE");
      L.push("CONDITIONS DE TRAVAIL");
      L.push("");
      L.push(nom(ctx) + " — " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("1. LE PROJET, DANS SES EFFETS SUR L'ORGANISATION");
      L.push("");
      if (postes.length) {
        L.push("Postes supprimés, tels que la fiche les porte :");
        L.push("");
        tableau(L, ["Poste", "Service", "Avant", "Après", "Écart"],
          postes.map(function (p) {
            var av = nbf(p.avant), ap = nbf(p.apres);
            return [cro(p.intitule, "intitulé"), cro(p.service, "—"),
              av === null ? "[ ]" : av, ap === null ? "[ ]" : ap,
              (av !== null && ap !== null) ? (ap - av) : "[ ]"];
          }));
        L.push("");
        L.push("Pour chaque ligne : [ce que ces suppressions changent dans l'organisation");
        L.push("du service — tâches redistribuées, à qui, dans quel volume].");
      } else {
        L.push("  [Décrire l'organisation avant et après : services concernés, effectifs");
        L.push("  avant et après, tâches supprimées, tâches redistribuées et à qui.]");
      }
      L.push("");
      L.push("2. CONSÉQUENCES POUR LES SALARIÉS DONT LE LICENCIEMENT EST ENVISAGÉ");
      L.push("");
      L.push("  [Exposer : conditions de travail pendant la période de procédure et de");
      L.push("  préavis, aménagement des postes, accompagnement, accès aux mesures de");
      L.push("  reclassement pendant le temps de travail.]");
      L.push("");
      L.push("3. CONSÉQUENCES POUR LES SALARIÉS QUI DEMEURENT — le point que l'on oublie");
      L.push("");
      L.push("  Service par service :");
      L.push("");
      tableau(L, ["Service", "Charge de travail", "Horaires", "Responsabilités", "Environnement"], [
        ["[service]", "[ce qui change]", "[ce qui change]", "[ce qui change]", "[ce qui change]"],
        ["[service]", "[ce qui change]", "[ce qui change]", "[ce qui change]", "[ce qui change]"],
      ]);
      L.push("");
      L.push("  [Préciser en particulier : polyvalence imposée, tâches nouvelles sans");
      L.push("  formation correspondante, isolement de postes jusque-là doublés, perte de");
      L.push("  compétences sur des tâches à risque, allongement des amplitudes.]");
      L.push("");
      L.push("4. RISQUES IDENTIFIÉS, ET MESURES DE PRÉVENTION ENVISAGÉES");
      L.push("");
      tableau(L, ["Risque identifié", "Unité de travail", "Mesure de prévention", "Échéance"], [
        ["[risque]", "[unité]", "[mesure]", "[date]"],
        ["[risque]", "[unité]", "[mesure]", "[date]"],
        ["[risque]", "[unité]", "[mesure]", "[date]"],
      ]);
      L.push("");
      L.push("  [Le document unique d'évaluation des risques est la source naturelle de");
      L.push("  ce tableau, et il devra être mis à jour de ce qui change. L'application");
      L.push("  ne lit pas au code du travail les articles qui règlent cette évaluation");
      L.push("  et cette mise à jour : ils ne figurent pas dans le corpus de ce module,");
      L.push("  elle ne les cite donc pas. Le module « santé, sécurité et conditions de");
      L.push("  travail » de cette application les porte.]");
      L.push("");
      L.push("5. SUIVI");
      L.push("");
      L.push("  [Qui suit ces mesures, à quelle échéance, et devant quelle instance le");
      L.push("  bilan en est présenté.]");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "III. Le courrier qui le joint à la convocation");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : exposé des conséquences du projet en matière de santé, de sécurité");
      L.push("et de conditions de travail");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous adresse, avec la convocation à la réunion du [DATE] et au titre du");
      L.push("7° de l'article " + (art || "L. 1233-10 ou L. 1233-31") + " du code du travail, l'exposé des");
      L.push("conséquences du projet en matière de santé, de sécurité et de conditions de");
      L.push("travail.");
      L.push("");
      L.push("Cet exposé porte sur les salariés dont le licenciement est envisagé comme");
      L.push("sur ceux qui demeurent dans l'entreprise, dont la charge de travail se");
      L.push("redistribue.");
      L.push("");
      L.push("Vos observations sur ce point seront consignées au procès-verbal de la");
      L.push("réunion. Je rappelle que l'employeur met à l'étude les suggestions");
      L.push("relatives aux mesures sociales envisagées et les propositions alternatives");
      L.push("formulées par le comité, et qu'il leur donne une réponse motivée");
      L.push("(L. 1233-33).");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : exposé des conséquences en matière de santé, de sécurité et");
      L.push("de conditions de travail");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous rédigez l'exposé. Comptez une semaine");
      L.push("si vous devez reprendre le document unique service par service.");
      L.push("");
      L.push("Il part AVEC la convocation, joint à la note des sept renseignements. Il ne");
      L.push("se remet pas en séance : c'est un renseignement, et les renseignements sont");
      L.push("adressés avec la convocation.");
      L.push("");
      if (dISO(f.dateInfoCSE) && rs.length) {
        L.push("Dans votre dossier, la convocation est partie le " + jour(f.dateInfoCSE) + " et la");
        L.push("première réunion s'est tenue le " + jour(rs[0]) + ". Si l'exposé n'a pas suivi le");
        L.push("même chemin, la convocation est à refaire : le document du contrôle");
        L.push("CTL-CSE-06 porte la lettre de report.");
        L.push("");
      } else {
        L.push("Si la convocation est déjà partie sans lui, convoquez à nouveau : le");
        L.push("document du contrôle CTL-CSE-06 porte la lettre de report et la nouvelle");
        L.push("convocation.");
        L.push("");
      }
      L.push("En réunion — faites consigner au procès-verbal les observations du comité");
      L.push("sur ce point, nommément. Un procès-verbal qui ne dit rien du 7° laisse");
      L.push("penser qu'il n'a pas été abordé.");
      if (r && r.pse) {
        L.push("");
        L.push("Un plan de sauvegarde de l'emploi étant dû, ce point sera lu par");
        L.push("l'administration : elle vérifie « la régularité de la procédure");
        L.push("d'information et de consultation du comité social et économique »");
        L.push("(L. 1233-57-2, 2° ; L. 1233-57-3), et l'article L. 1233-30, I, 2° range");
        L.push("expressément ces conséquences parmi les objets de la consultation.");
      }

      pied(L, ["L. 1233-10, 7°", "L. 1233-31, 7°", "L. 1233-30, I, 2°", "L. 1233-33"],
        "Les articles du code du travail relatifs à l'évaluation des risques et au\n" +
        "document unique ne figurent pas dans le corpus de textes de ce module :\n" +
        "l'application ne les a pas lus et ne les cite pas.\n" +
        "\n" +
        "Ce qui se joue : l'omission du septième renseignement vicie la consultation.\n" +
        "L'article L. 1235-12 ouvre au salarié compris dans le licenciement collectif\n" +
        "une indemnité calculée en fonction du préjudice subi ; en régime de plan de\n" +
        "sauvegarde de l'emploi, elle nourrit le refus de validation ou\n" +
        "d'homologation.");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     L'ENTRETIEN PRÉALABLE — ou sa dispense
     ══════════════════════════════════════════════════════════════════════ */

  doc("CTL-ENT-01",
    "La convocation à l'entretien préalable, ou la note fixant le calendrier collectif",
    "Le régime établi noir sur blanc — entretien dû (L. 1233-11) ou dispensé " +
    "(L. 1233-38) —, la convocation avec ses mentions obligatoires, le compte " +
    "rendu d'entretien, et les dates que les délais en jours ouvrables commandent.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f), e = entretien(f);
      var acc = accompagnement(f);
      var cadre = f.cadreAuSensL1441_13 === true;
      var joursAvant = cadre ? 15 : 7;
      var dateEnt = estDate(f.dateEntretien) ? f.dateEntretien : null;
      var notif = estDate(f.dateNotification) ? f.dateNotification : null;
      var notifMin = dateEnt ? plusOuvrables(dateEnt, joursAvant) : null;
      var du = e ? e.du : null;

      L = L.concat(entete(ctx, "Entretien préalable au licenciement pour motif économique",
        "articles L. 1233-11 à L. 1233-13, L. 1233-15 et L. 1233-38 du code du travail"));

      if (du === true && notif && notifMin && notif < notifMin) {
        irrattrapable(L, [
          "L'entretien préalable est dû, il est fixé au " + jour(dateEnt) + ", et la notification",
          "est prévue le " + jour(notif) + ".",
          "",
          "L'article L. 1233-15 dispose que la lettre « ne peut être expédiée moins de",
          (cadre
            ? "quinze jours ouvrables à compter de la date prévue de l'entretien » pour le"
            : "sept jours ouvrables à compter de la date prévue de l'entretien préalable"),
          (cadre
            ? "licenciement individuel d'un membre du personnel d'encadrement."
            : "de licenciement auquel le salarié a été convoqué."),
          "La première date d'expédition possible est donc le " + jour(notifMin) + ".",
          "",
          "Une lettre déjà expédiée avant cette date l'a été trop tôt : l'irrégularité",
          "est acquise dès l'envoi, et la date d'expédition se lit sur le bordereau",
          "postal.",
        ], "Si aucune lettre n'est partie, ARRÊTEZ L'ENVOI et reportez-vous au " +
           "calendrier de la fin de ce document.");
      }

      modeEmploi(L, [
        "Deux calendriers existent, et ils ne se mélangent pas.",
        "",
        "Le calendrier INDIVIDUEL : convocation, entretien au plus tôt cinq jours",
        "ouvrables après la présentation de la lettre, puis notification au plus tôt",
        "sept jours ouvrables — quinze pour un membre du personnel d'encadrement —",
        "après la date prévue de l'entretien.",
        "",
        "Le calendrier COLLECTIF : réunions du comité, avis ou expiration du délai,",
        "et, lorsqu'un plan de sauvegarde de l'emploi est dû, décision de validation",
        "ou d'homologation de l'administration.",
        "",
        "L'article L. 1233-38 écarte l'entretien préalable lorsque le licenciement",
        "porte sur au moins dix salariés dans une même période de trente jours ET",
        "qu'il existe un comité social et économique dans l'entreprise. Dans ce cas,",
        "un entretien tenu par précaution n'est pas irrégulier — mais il n'ouvre",
        "aucun délai opposable : se régler sur lui conduirait à notifier trop tôt au",
        "regard du calendrier collectif.",
        "",
        "Ce document établit lequel des deux régimes s'applique, et produit la pièce",
        "correspondante.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. L'entretien est-il dû ?");

      if (e && e.motif) {
        L.push(e.motif);
        L.push("");
        L.push("Fondement retenu : " + (e.texte || "[texte]") + ".");
      } else {
        L.push("Le moteur du module n'est pas chargé : les deux branches du texte sont");
        L.push("données, et c'est le nombre de licenciements sur trente jours et");
        L.push("l'existence d'un comité qui décident.");
      }
      L.push("");
      L.push("L. 1233-11 : « L'employeur qui envisage de procéder à un licenciement pour");
      L.push("motif économique, qu'il s'agisse d'un licenciement individuel ou inclus dans");
      L.push("un licenciement collectif de moins de dix salariés dans une même période de");
      L.push("trente jours, convoque, avant toute décision, le ou les intéressés à un");
      L.push("entretien préalable. La convocation est effectuée par lettre recommandée ou");
      L.push("par lettre remise en main propre contre décharge. Cette lettre indique");
      L.push("l'objet de la convocation. L'entretien préalable ne peut avoir lieu moins de");
      L.push("cinq jours ouvrables après la présentation de la lettre recommandée ou la");
      L.push("remise en main propre de la lettre de convocation. »");
      L.push("");
      L.push("L. 1233-38 : « Lorsque l'employeur procède au licenciement pour motif");
      L.push("économique d'au moins dix salariés dans une même période de trente jours et");
      L.push("qu'il existe un comité social et économique dans l'entreprise, la procédure");
      L.push("d'entretien préalable au licenciement ne s'applique pas. »");
      L.push("");
      L.push("  Licenciements sur trente jours ....... " +
        (nbLic(f) === null ? "[non renseigné]" : nbLic(f)));
      L.push("  Comité en place ..................... " +
        (f.cseExistant === true ? "oui" : f.cseExistant === false ? "non" : "[non renseigné]"));
      L.push("  Entretien déclaré ................... " +
        (dateEnt ? jour(dateEnt) : "[aucun]"));
      L.push("  Personnel d'encadrement (2° de L. 1441-13) ... " +
        (cadre ? "oui" : f.cadreAuSensL1441_13 === false ? "non" : "[non renseigné]"));
      L.push("");
      if (du === false && dateEnt) {
        L.push("ATTENTION — l'entretien n'est pas dû, et pourtant un entretien est déclaré");
        L.push("le " + jour(dateEnt) + ". Le tenir n'est pas irrégulier ; mais NE FIXEZ PAS la");
        L.push("notification à partir de sa date. Le calendrier qui vous lie est le");
        L.push("calendrier collectif : partie III de ce document.");
        L.push("");
      }
      if (du === null) {
        L.push("Le régime ne peut pas être établi en l'état : renseignez l'existence d'un");
        L.push("comité et le nombre de licenciements sur trente jours. Tant que ce point");
        L.push("n'est pas tranché, aucune date de notification n'est fiable — et se");
        L.push("tromper de calendrier, c'est notifier trop tôt.");
        L.push("");
      }

      titre(L, "II. Si l'entretien est dû — la convocation");

      L.push("Trois mentions que le texte impose, et une quatrième qu'il ajoute :");
      L.push("");
      L.push("  1. L'objet de la convocation (L. 1233-11).");
      L.push("  2. Le moyen : lettre recommandée, ou remise en main propre contre");
      L.push("     décharge (L. 1233-11). Le courriel n'est pas dans le texte.");
      L.push("  3. La possibilité de se faire assister, et — s'il n'y a pas");
      L.push("     d'institutions représentatives du personnel dans l'entreprise — la");
      L.push("     mention de la possibilité de recourir à un conseiller du salarié et");
      L.push("     « l'adresse des services où la liste des conseillers est tenue à la");
      L.push("     disposition des salariés » (L. 1233-13).");
      L.push("  4. Le délai : l'entretien « ne peut avoir lieu moins de cinq jours");
      L.push("     ouvrables après la présentation de la lettre recommandée ou la remise");
      L.push("     en main propre » (L. 1233-11). Cinq jours ouvrables après la");
      L.push("     PRÉSENTATION, non après l'envoi.");
      L.push("");
      L.push("──── LETTRE DE CONVOCATION ────");
      L.push("");
      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("[Nom, prénom du salarié]");
      L.push("[Adresse]");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Lettre recommandée avec avis de réception");
      L.push("[ou : remise en main propre contre décharge le ......]");
      L.push("");
      L.push("Objet : convocation à un entretien préalable à un éventuel licenciement pour");
      L.push("motif économique");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Nous envisageons de procéder à un licenciement pour motif économique");
      L.push("susceptible de vous concerner.");
      L.push("");
      L.push("Conformément à l'article L. 1233-11 du code du travail, nous vous convoquons");
      L.push("à un entretien préalable qui se tiendra le [DATE], à [HEURE], à [LIEU");
      L.push("PRÉCIS], avec [nom et qualité de la personne qui conduira l'entretien].");
      L.push("");
      L.push("Cet entretien a pour objet de vous exposer les motifs de la décision");
      L.push("envisagée et de recueillir vos explications (L. 1233-12). Aucune décision");
      L.push("n'est prise à ce jour.");
      L.push("");
      L.push("Vous pouvez vous faire assister lors de cet entretien par une personne de");
      L.push("votre choix appartenant au personnel de l'entreprise.");
      L.push("");
      L.push("[À CONSERVER UNIQUEMENT S'IL N'EXISTE PAS D'INSTITUTIONS REPRÉSENTATIVES DU");
      L.push("PERSONNEL DANS L'ENTREPRISE — L. 1233-13 : Vous pouvez également vous faire");
      L.push("assister par un conseiller du salarié choisi sur une liste dressée par");
      L.push("l'autorité administrative. Cette liste est tenue à votre disposition auprès");
      L.push("de [ADRESSE DES SERVICES OÙ LA LISTE EST TENUE À DISPOSITION — mairie de la");
      L.push("commune du lieu de travail et services de l'inspection du travail : indiquer");
      L.push("les adresses exactes]. Cette mention est obligatoire dans ce cas ; elle est");
      L.push("à supprimer si l'entreprise est dotée d'institutions représentatives.]");
      L.push("");
      L.push("Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations");
      L.push("distinguées.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Une convocation par salarié, nominative. Une convocation collective n'est");
      L.push("pas une convocation : le texte vise « le ou les intéressés » et l'entretien");
      L.push("est individuel.");
      L.push("");

      titre(L, "III. Si l'entretien n'est pas dû — la note de calendrier");

      L.push("NOTE — CALENDRIER RETENU POUR LA NOTIFICATION DES LICENCIEMENTS");
      L.push("");
      L.push(nom(ctx) + " — " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("1. Le projet porte sur " + (nbLic(f) === null ? "[nombre]" : nbLic(f)) +
        " licenciements dans une même période de");
      L.push("   trente jours, et un comité social et économique existe dans");
      L.push("   l'entreprise. La procédure d'entretien préalable ne s'applique donc pas");
      L.push("   (L. 1233-38).");
      L.push("");
      L.push("2. La notification est commandée par le calendrier collectif :");
      L.push("");
      L.push("   — l'avis du comité, ou l'expiration du délai d'avis à compter de la");
      L.push("     première réunion (L. 1233-8 ; L. 1233-30, II) ;");
      L.push("   — et, lorsqu'un plan de sauvegarde de l'emploi est dû, la décision de");
      L.push("     validation ou d'homologation de l'autorité administrative");
      L.push("     (L. 1233-39).");
      L.push("");
      L.push("3. Aucun entretien tenu par précaution n'ouvre de délai opposable : sa date");
      L.push("   n'est pas un point de départ, et la notification n'en est pas");
      L.push("   rapprochée.");
      L.push("");
      L.push("4. Information due malgré la dispense — l'article R. 1233-19 : « Lorsque");
      L.push("   l'employeur n'est pas tenu de convoquer les salariés à cet entretien, en");
      L.push("   cas de licenciement de dix salariés ou plus dans une même période de");
      L.push("   trente jours, il les informe, à l'issue de la dernière réunion du comité");
      L.push("   social et économique, des conditions de mise en œuvre du congé de");
      L.push("   reclassement. » Cette information est due À L'ISSUE DE LA DERNIÈRE");
      L.push("   RÉUNION : elle a une date, et elle se prouve.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "IV. Le compte rendu d'entretien");

      L.push("L'article L. 1233-12 fixe l'objet de l'entretien : « Au cours de l'entretien");
      L.push("préalable, l'employeur indique les motifs de la décision envisagée et");
      L.push("recueille les explications du salarié. » Deux obligations, donc, et la");
      L.push("seconde s'oublie plus vite que la première.");
      L.push("");
      L.push("COMPTE RENDU D'ENTRETIEN PRÉALABLE");
      L.push("");
      L.push("  Salarié : [nom, prénom, emploi, ancienneté]");
      L.push("  Date, heure et lieu de l'entretien : ..................................");
      L.push("  Employeur représenté par : ...........................................");
      L.push("  Salarié assisté par : [nom et qualité] / non assisté");
      L.push("");
      L.push("  Motifs exposés au salarié (L. 1233-12) : [reprendre les raisons");
      L.push("  économiques, la suppression ou la transformation de l'emploi, et le");
      L.push("  résultat de l'application des critères d'ordre pour ce salarié]");
      L.push("");
      L.push("  Explications recueillies du salarié : [transcrire — c'est la moitié de");
      L.push("  l'obligation, et celle qu'on omet]");
      L.push("");
      L.push("  Reclassement évoqué : [postes proposés, réponses données]");
      L.push("");
      L.push("  Dispositif d'accompagnement présenté : " +
        (acc && acc.type ? acc.type : "[contrat de sécurisation professionnelle / congé de reclassement]"));
      if (acc && acc.motif) { L.push("  (" + acc.motif + ")"); }
      L.push("");
      L.push("  Signature du salarié [facultative] : ..................................");
      L.push("  Signature de l'employeur : ...........................................");
      L.push("");
      L.push("Ce que le texte impose de dire à l'entretien, selon le dispositif :");
      L.push("");
      L.push("  — congé de reclassement : R. 1233-19 — « Lors de l'entretien préalable");
      L.push("    prévu à l'article L. 1233-11, en cas de licenciement de moins de dix");
      L.push("    salariés dans une même période de trente jours, l'employeur informe le");
      L.push("    salarié des conditions de mise en œuvre du congé de reclassement. »");
      L.push("");
      L.push("  — contrat de sécurisation professionnelle : L. 1233-66 — l'employeur");
      L.push("    « est tenu de proposer, lors de l'entretien préalable ou à l'issue de la");
      L.push("    dernière réunion des représentants du personnel, le bénéfice du contrat");
      L.push("    de sécurisation professionnelle à chaque salarié dont il envisage de");
      L.push("    prononcer le licenciement pour motif économique. Lorsque le licenciement");
      L.push("    pour motif économique donne lieu à un plan de sauvegarde de l'emploi");
      L.push("    dans les conditions prévues aux articles L. 1233-24-2 et L. 1233-24-4,");
      L.push("    cette proposition est faite APRÈS la notification par l'autorité");
      L.push("    administrative de sa décision de validation ou d'homologation prévue à");
      L.push("    l'article L. 1233-57-4. »");
      L.push("");
      L.push("Le second cas est un piège de calendrier : en régime de plan de sauvegarde");
      L.push("de l'emploi, la proposition de contrat de sécurisation professionnelle vient");
      L.push("APRÈS la décision administrative, non à l'entretien.");
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + ".");
      L.push("");
      if (du === true) {
        L.push("L'entretien est dû. Les dates s'enchaînent ainsi :");
        L.push("");
        if (dateEnt) {
          L.push("  Entretien fixé le ......................... " + jour(dateEnt));
        } else {
          L.push("  Convocation envoyée aujourd'hui ........... " + leJour(d0));
          L.push("  Présentation de la lettre ................. [date de première");
          L.push("  présentation — c'est d'elle que courent les cinq jours ouvrables]");
          L.push("  Entretien, au plus tôt ................... cinq jours ouvrables après");
          L.push("  la présentation (L. 1233-11)");
        }
        if (notifMin) {
          L.push("  Expédition de la lettre, au plus tôt ..... " + jour(notifMin));
          L.push("  (" + joursAvant + " jours ouvrables à compter de la date prévue de l'entretien" +
            (cadre ? ", le salarié relevant du personnel d'encadrement" : "") + " — L. 1233-15)");
          if (notif) {
            L.push("  Notification prévue ...................... " + jour(notif) +
              (notif < notifMin ? "  ← TROP TÔT" : "  ← compatible"));
          }
        } else {
          L.push("  Expédition de la lettre, au plus tôt ..... " + joursAvant + " jours ouvrables");
          L.push("  à compter de la date prévue de l'entretien (L. 1233-15)");
        }
        L.push("");
        L.push("Jours ouvrables : le samedi compte, le dimanche non. " +
          (ouvrablesExacts()
            ? "Le calcul ci-dessus retire les jours fériés."
            : "Le calcul ci-dessus ne retire PAS les jours fériés — le moteur du module,"));
        if (!ouvrablesExacts()) {
          L.push("qui les porte, n'est pas chargé sur cette page. Vérifiez les échéances qui");
          L.push("traversent un jour férié : elles se décalent d'autant.");
        }
        L.push("");
      } else if (du === false) {
        L.push("L'entretien n'est pas dû. Les dates qui vous lient sont celles-ci :");
        L.push("");
        L.push("  Dernière réunion du comité ............... " +
          (rs.length ? jour(rs[rs.length - 1]) : "[date]"));
        L.push("  Avis, ou expiration du délai d'avis ...... " +
          (estDate(f.dateAvisCSE) ? jour(f.dateAvisCSE)
            : (rs.length && delaiAvisMois(r)) ? jour(plusMois(rs[0], delaiAvisMois(r))) : "[date]"));
        if (r && r.pse) {
          L.push("  Décision de validation ou d'homologation .. " +
            jour((f.pse || {}).dateDecisionAdmin, "date"));
          L.push("  Notification, au plus tôt ................ le lendemain de cette");
          L.push("  décision (L. 1233-39)");
        }
        L.push("");
        L.push("À l'issue de la dernière réunion — information des salariés sur les");
        L.push("conditions de mise en œuvre du congé de reclassement, lorsqu'il est dû");
        L.push("(R. 1233-19). Datez-la et conservez-en la preuve.");
        L.push("");
      } else {
        L.push("Le régime n'est pas établi : ne fixez aucune date. Renseignez l'existence");
        L.push("d'un comité et le nombre de licenciements sur trente jours, puis reprenez");
        L.push("ce document.");
        L.push("");
      }
      L.push("Dans tous les cas — la lettre de licenciement comporte l'énoncé des motifs");
      L.push("économiques et mentionne la priorité de réembauche prévue par l'article");
      L.push("L. 1233-45 et ses conditions de mise en œuvre (L. 1233-16 ; L. 1233-42).");
      L.push("Cette mention n'est pas facultative, et elle s'écrit dans la lettre, pas");
      L.push("dans un document joint.");

      pied(L, ["L. 1233-11", "L. 1233-12", "L. 1233-13", "L. 1233-15", "L. 1233-16",
        "L. 1233-38", "L. 1233-42", "L. 1233-45", "L. 1233-66", "R. 1233-19"],
        "L'article L. 1441-13, dont le 2° définit le membre du personnel d'encadrement\n" +
        "auquel L. 1233-15 réserve le délai de quinze jours ouvrables, N'A PAS ÉTÉ LU :\n" +
        "il ne figure pas dans le corpus de textes du module. Il est nommé, et la\n" +
        "qualification vient de votre fiche, non de l'application.\n" +
        "\n" +
        "Ce qui se joue : se régler sur le mauvais calendrier conduit à notifier trop\n" +
        "tôt, et l'irrégularité est acquise dès l'envoi de la lettre. En régime\n" +
        "collectif, l'article L. 1235-12 ouvre au salarié une indemnité calculée en\n" +
        "fonction du préjudice subi ; en régime de plan de sauvegarde de l'emploi,\n" +
        "l'article L. 1233-39 interdit la rupture avant la décision administrative « à\n" +
        "peine de nullité ».");
      return L.join("\n");
    });

  /* ══════════════════════════════════════════════════════════════════════
     LE PLAN DE SAUVEGARDE DE L'EMPLOI
     ══════════════════════════════════════════════════════════════════════ */

  /* Les sept rubriques de L. 1233-62, verbatim, depuis la version lue au dépôt
     (LEGIARTI000036261725). La liste n'est pas limitative — le texte écrit
     « des mesures telles que » —, et le document le dit au lieu de laisser
     croire à un catalogue fermé. */
  var RUBRIQUES = [
    { m: "1°", court: "Reclassement interne sur le territoire national",
      cle: "reclassementInterne",
      t: "Des actions en vue du reclassement interne sur le territoire national, des salariés sur des emplois relevant de la même catégorie d'emplois ou équivalents à ceux qu'ils occupent ou, sous réserve de l'accord exprès des salariés concernés, sur des emplois de catégorie inférieure" },
    { m: "1° bis", court: "Reprise d'activités pour éviter la fermeture d'un établissement",
      t: "Des actions favorisant la reprise de tout ou partie des activités en vue d'éviter la fermeture d'un ou de plusieurs établissements" },
    { m: "2°", court: "Créations d'activités nouvelles par l'entreprise",
      t: "Des créations d'activités nouvelles par l'entreprise" },
    { m: "3°", court: "Reclassement externe et réactivation du bassin d'emploi",
      t: "Des actions favorisant le reclassement externe à l'entreprise, notamment par le soutien à la réactivation du bassin d'emploi" },
    { m: "4°", court: "Soutien à la création ou à la reprise d'activités par les salariés",
      cle: "creation",
      t: "Des actions de soutien à la création d'activités nouvelles ou à la reprise d'activités existantes par les salariés" },
    { m: "5°", court: "Formation, validation des acquis, reconversion",
      cle: "formation",
      t: "Des actions de formation, de validation des acquis de l'expérience ou de reconversion de nature à faciliter le reclassement interne ou externe des salariés sur des emplois équivalents" },
    { m: "6°", court: "Réduction ou aménagement du temps de travail et des heures supplémentaires",
      t: "Des mesures de réduction ou d'aménagement du temps de travail ainsi que des mesures de réduction du volume des heures supplémentaires réalisées de manière régulière lorsque ce volume montre que l'organisation du travail de l'entreprise est établie sur la base d'une durée collective manifestement supérieure à trente-cinq heures hebdomadaires ou 1 600 heures par an et que sa réduction pourrait préserver tout ou partie des emplois dont la suppression est envisagée" },
  ];

  doc("CTL-PSE-01",
    "Le plan de sauvegarde de l'emploi",
    "Le plan lui-même, rubrique par rubrique de l'article L. 1233-62 : le volet " +
    "de reclassement interne que L. 1233-61 met à son cœur, les mesures que vous " +
    "avez saisies rattachées à chacune, la note motivée des rubriques écartées, " +
    "les modalités de suivi de L. 1233-63, et le courrier de consultation.",
    function (ctx) {
      var f = ctx.fiche || {}, L = [];
      var r = regime(f), rs = reunions(f), p = f.pse || {};
      var acc = accompagnement(f);
      var eff = effectifDe(ctx), n = nbLic(f);
      var absentes = [];

      L = L.concat(entete(ctx, "Plan de sauvegarde de l'emploi",
        "articles L. 1233-61, L. 1233-62 et L. 1233-63 du code du travail"));

      modeEmploi(L, [
        "Ce document est le plan, non sa description. Ce qui suit se complète, se",
        "signe et se verse au dossier soumis à l'autorité administrative.",
        "",
        "Deux avertissements, et ils commandent tout le reste.",
        "",
        "PREMIER — la liste de l'article L. 1233-62 n'est pas limitative : le texte",
        "écrit « des mesures telles que ». Une rubrique vide n'est donc pas, en",
        "elle-même, une non-conformité. Mais l'autorité administrative apprécie le",
        "plan au regard de ces rubriques et vérifie « le respect par le plan de",
        "sauvegarde de l'emploi des articles L. 1233-61 à L. 1233-63 »",
        "(L. 1233-57-3) : une rubrique laissée vide SANS EXPLICATION est un motif de",
        "refus ordinaire, et le refus renvoie tout le dossier au point de départ.",
        "",
        "SECOND — aucun montant n'est avancé ici, et ce n'est pas une prudence",
        "excessive : AUCUN TEXTE NE FIXE LE MONTANT D'UN PLAN. L'article L. 1233-57-3",
        "confie à l'autorité administrative l'appréciation du plan « en fonction des",
        "critères suivants : 1° Les moyens dont disposent l'entreprise, l'unité",
        "économique et sociale et le groupe ; 2° Les mesures d'accompagnement prévues",
        "au regard de l'importance du projet de licenciement ; 3° Les efforts de",
        "formation et d'adaptation ». Un chiffre que l'application avancerait serait",
        "un chiffre inventé.",
      ]);

      rappelDossier(L, ctx);

      titre(L, "I. Le plan est-il dû ?");

      L.push("L. 1233-61, premier alinéa : « Dans les entreprises d'au moins cinquante");
      L.push("salariés, lorsque le projet de licenciement concerne au moins dix salariés");
      L.push("dans une même période de trente jours, l'employeur établit et met en oeuvre");
      L.push("un plan de sauvegarde de l'emploi pour éviter les licenciements ou en");
      L.push("limiter le nombre. »");
      L.push("");
      L.push("  Effectif de l'entreprise ............ " +
        (eff === null ? "[non renseigné]" : eff + " salariés"));
      L.push("  Licenciements sur trente jours ...... " +
        (n === null ? "[non renseigné]" : n));
      L.push("  Plan dû, selon l'audit .............. " +
        (r ? (r.pse ? "OUI" : "non") : "[le moteur du module n'est pas chargé]"));
      L.push("");
      L.push("Les deux conditions se cumulent, et le nombre s'apprécie sur la période de");
      L.push("trente jours : un licenciement supplémentaire dans cette fenêtre fait");
      L.push("basculer le régime, plan compris.");
      L.push("");

      titre(L, "II. Le plan de reclassement interne — le cœur du plan");

      L.push("L. 1233-61, deuxième alinéa : « Ce plan intègre un plan de reclassement");
      L.push("visant à faciliter le reclassement sur le territoire national des salariés");
      L.push("dont le licenciement ne pourrait être évité, notamment celui des salariés");
      L.push("âgés ou présentant des caractéristiques sociales ou de qualification");
      L.push("rendant leur réinsertion professionnelle particulièrement difficile. »");
      L.push("");
      L.push("Un plan sans reclassement interne n'est pas un plan incomplet : c'est un");
      L.push("plan qui n'a pas son objet. Le mot « intègre » ne laisse pas de marge.");
      L.push("");
      L.push("1. RECENSEMENT DES POSTES DISPONIBLES SUR LE TERRITOIRE NATIONAL");
      L.push("");
      if (Array.isArray(f.postesDisponibles) && f.postesDisponibles.length) {
        tableau(L, ["Société", "Poste", "Lieu", "Contrat", "Rémunération", "Classification"],
          f.postesDisponibles.map(function (x) {
            return [cro(x.societe, "société"), cro(x.intitule, "intitulé"), cro(x.lieu, "lieu"),
              cro(x.contrat, "[contrat]"), cro(x.remuneration, "[rémunération]"),
              cro(x.classification, "[classification]")];
          }));
        L.push("");
        L.push("  [Compléter ce recensement : il est daté, et il vieillit. Indiquer la date");
        L.push("  d'arrêté de l'état des postes et l'auteur de ce recensement.]");
      } else {
        L.push("  Aucun poste disponible n'est renseigné dans la fiche.");
        L.push("");
        tableau(L, ["Société", "Poste", "Lieu", "Contrat", "Rémunération", "Classification"],
          [["[société du groupe]", "[intitulé]", "[lieu]", "[CDI/CDD]", "[montant]", "[niveau]"],
           ["[société du groupe]", "[intitulé]", "[lieu]", "[CDI/CDD]", "[montant]", "[niveau]"]]);
      }
      L.push("");
      L.push("2. LES TROIS COLONNES DU RECLASSEMENT, ET L'ACCORD EXPRÈS");
      L.push("");
      L.push("Le 1° de l'article L. 1233-62 vise « des emplois relevant de la même");
      L.push("catégorie d'emplois ou équivalents à ceux qu'ils occupent ou, SOUS RÉSERVE");
      L.push("DE L'ACCORD EXPRÈS DES SALARIÉS CONCERNÉS, sur des emplois de catégorie");
      L.push("inférieure ». La troisième colonne ne se propose donc pas seule : elle");
      L.push("suppose un accord exprès, et cet accord se recueille par écrit.");
      L.push("");
      tableau(L, ["Colonne", "Nombre de postes", "Conditions"], [
        ["Même catégorie d'emplois", "[  ]", "proposition directe"],
        ["Emplois équivalents", "[  ]", "proposition directe"],
        ["Catégorie inférieure", "[  ]", "ACCORD EXPRÈS ÉCRIT du salarié"],
      ]);
      L.push("");
      L.push("3. SALARIÉS DONT LA RÉINSERTION EST PARTICULIÈREMENT DIFFICILE");
      L.push("");
      L.push("  [Recenser nominativement, avec pour chacun la caractéristique retenue —");
      L.push("  âge, caractéristique sociale, qualification — et les mesures");
      L.push("  spécifiques prévues pour lui. Le texte les nomme expressément : les");
      L.push("  ignorer se voit.]");
      L.push("");
      L.push("  [Nom ou matricule] — [caractéristique] — [mesures spécifiques]");
      L.push("  [Nom ou matricule] — [caractéristique] — [mesures spécifiques]");
      L.push("");
      L.push("4. MODALITÉS DES OFFRES");
      L.push("");
      L.push("L'article L. 1233-4 impose que « les offres de reclassement proposées au");
      L.push("salarié sont écrites et précises » et que l'employeur « adresse de manière");
      L.push("personnalisée les offres de reclassement à chaque salarié ou diffuse par");
      L.push("tout moyen une liste des postes disponibles à l'ensemble des salariés, dans");
      L.push("des conditions précisées par décret ».");
      L.push("");
      L.push("  Modalité retenue : ☐ offres personnalisées  ☐ liste diffusée");
      L.push("  Délai de réponse laissé au salarié : [  ]");
      L.push("  [Les conditions précisées par décret sont celles de l'article D. 1233-2-1,");
      L.push("  que le corpus du module porte mais dont le contenu n'est pas reproduit ici :");
      L.push("  ce document est le plan, non le manuel du reclassement individuel. Le");
      L.push("  contrôle CTL-REC de l'audit traite ce point.]");
      L.push("");

      titre(L, "III. Les mesures, rubrique par rubrique de l'article L. 1233-62");

      L.push("Chapeau du texte : « Le plan de sauvegarde de l'emploi prévoit des mesures");
      L.push("TELLES QUE : […] ». La liste est indicative, pas limitative — mais chaque");
      L.push("rubrique vide appelle un motif, et le motif s'écrit en IV.");
      L.push("");
      RUBRIQUES.forEach(function (rub) {
        var saisi = rub.cle ? String(p[rub.cle] || "").trim() : "";
        L.push("── " + rub.m + " — " + rub.court + " ──");
        L.push("");
        L.push("Texte : « " + rub.t + ". »");
        L.push("");
        if (saisi) {
          L.push("Ce que la fiche porte : « " + saisi + " »");
          L.push("");
          L.push("  À compléter dans le plan :");
          L.push("    Intitulé de la mesure ........ [  ]");
          L.push("    Bénéficiaires attendus ....... [nombre]");
          L.push("    Budget affecté ............... [montant]");
          L.push("    Durée d'ouverture ............ [du .... au ....]");
          L.push("    Modalités d'accès ............ [qui, comment, dans quel délai]");
          if (!/\d/.test(saisi)) {
            L.push("");
            L.push("  ATTENTION — la mesure telle qu'elle est saisie ne porte AUCUN chiffre.");
            L.push("  Une mesure non chiffrée n'est pas appréciable au regard des critères de");
            L.push("  l'article L. 1233-57-3. Voyez le document du contrôle CTL-PSE-05.");
          }
        } else {
          absentes.push(rub);
          L.push("  AUCUNE MESURE RATTACHÉE.");
          L.push("");
          L.push("  Deux issues, et deux seulement :");
          L.push("  — une mesure y est rattachée : [intitulé], [bénéficiaires], [budget],");
          L.push("    [durée], [modalités d'accès] ;");
          L.push("  — ou la rubrique est écartée, et le motif est écrit en IV.");
        }
        L.push("");
      });

      if (String(p.evitement || "").trim()) {
        L.push("── Mesures d'évitement des licenciements ──");
        L.push("");
        L.push("L'article L. 1233-61 assigne au plan sa finalité : « éviter les");
        L.push("licenciements ou en limiter le nombre ». Ce que la fiche porte à ce titre :");
        L.push("");
        L.push("  « " + String(p.evitement).trim() + " »");
        L.push("");
        L.push("  [Chiffrer : combien de licenciements ces mesures évitent, et sur quelle");
        L.push("  période. « Réduction de l'intérim » sans nombre ne mesure rien.]");
        L.push("");
      }

      titre(L, "IV. La note motivée des rubriques écartées");

      if (!absentes.length) {
        L.push("Toutes les rubriques que la fiche renseigne portent une mesure. Vérifiez");
        L.push("néanmoins les rubriques que la fiche ne couvre pas — 1° bis, 2°, 3° et 6°");
        L.push("ne correspondent à aucun champ du questionnaire : si votre plan ne les");
        L.push("renseigne pas, écrivez ci-dessous pourquoi.");
        L.push("");
      } else {
        L.push("Cette note se verse au dossier de demande. Elle n'a pas à être longue :");
        L.push("elle doit dire pourquoi la rubrique ne peut pas recevoir de mesure DANS");
        L.push("CETTE ENTREPRISE, et sur quoi ce constat repose.");
        L.push("");
      }
      var aMotiver = absentes.length ? absentes : RUBRIQUES.filter(function (x) { return !x.cle; });
      aMotiver.forEach(function (rub) {
        L.push("Rubrique " + rub.m + " — " + rub.court);
        L.push("  Motif de l'écartement : [écrire ici pourquoi cette rubrique ne reçoit");
        L.push("  aucune mesure — absence de poste disponible, absence d'activité");
        L.push("  transférable, absence d'heures supplémentaires régulières, etc.]");
        L.push("  Éléments qui l'établissent : [pièce, date, auteur]");
        L.push("");
      });

      titre(L, "V. Le dispositif d'accompagnement");

      if (acc && acc.type) {
        L.push("Dispositif retenu par l'audit : " + acc.type + " (" + acc.texte + ").");
        L.push(acc.motif);
        if (acc.ecarte) {
          L.push("");
          L.push("Dispositif écarté : " + acc.ecarte + ". " + (acc.motifEcart || ""));
        }
        if (acc.incertain) {
          L.push("");
          L.push("Réserve — l'effectif total du groupe n'est pas renseigné, et le seuil");
          L.push("s'apprécie aussi à ce niveau. Vérifiez-le avant de retenir ce dispositif.");
        }
      } else {
        L.push("Le moteur du module n'est pas chargé : le dispositif n'est pas déterminé");
        L.push("ici. Deux branches, et l'effectif décide.");
        L.push("");
        L.push("Congé de reclassement — L. 1233-71 : « Dans les entreprises ou les");
        L.push("établissements d'au moins mille salariés, ainsi que dans les entreprises");
        L.push("mentionnées à l'article L. 2331-1 et celles répondant aux conditions");
        L.push("mentionnées aux articles L. 2341-1 et L. 2341-2, dès lors qu'elles");
        L.push("emploient au total au moins mille salariés, l'employeur propose à chaque");
        L.push("salarié dont il envisage de prononcer le licenciement pour motif");
        L.push("économique un congé de reclassement […]. »");
        L.push("");
        L.push("Contrat de sécurisation professionnelle — L. 1233-66 : « Dans les");
        L.push("entreprises non soumises à l'article L. 1233-71, l'employeur est tenu de");
        L.push("proposer, lors de l'entretien préalable ou à l'issue de la dernière");
        L.push("réunion des représentants du personnel, le bénéfice du contrat de");
        L.push("sécurisation professionnelle à chaque salarié dont il envisage de");
        L.push("prononcer le licenciement pour motif économique. »");
      }
      L.push("");
      L.push("L'article L. 1233-57-3 impose expressément à l'autorité administrative de");
      L.push("s'assurer « que l'employeur a prévu le recours au contrat de sécurisation");
      L.push("professionnelle mentionné à l'article L. 1233-65 ou la mise en place du");
      L.push("congé de reclassement mentionné à l'article L. 1233-71 ». Le plan doit donc");
      L.push("le dire, en toutes lettres.");
      L.push("");
      L.push("  Dispositif prévu par le présent plan : [le nommer]");
      L.push("  Modalités de la proposition : [à l'entretien préalable / à l'issue de la");
      L.push("  dernière réunion / après la décision administrative — attention : en");
      L.push("  régime de plan de sauvegarde de l'emploi, L. 1233-66 place la proposition");
      L.push("  de contrat de sécurisation professionnelle APRÈS la notification de la");
      L.push("  décision de validation ou d'homologation]");
      L.push("");

      titre(L, "VI. Les modalités de suivi — article L. 1233-63");

      L.push("Le texte : « Le plan de sauvegarde de l'emploi détermine les modalités de");
      L.push("suivi de la mise en oeuvre effective des mesures contenues dans le plan de");
      L.push("reclassement prévu à l'article L. 1233-61. Ce suivi fait l'objet d'une");
      L.push("consultation régulière et détaillée du comité social et économique dont");
      L.push("l'avis est transmis à l'autorité administrative. L'autorité administrative");
      L.push("est associée au suivi de ces mesures et reçoit un bilan, établi par");
      L.push("l'employeur, de la mise en œuvre effective du plan de sauvegarde de");
      L.push("l'emploi. »");
      L.push("");
      L.push("Trois obligations distinctes, et l'oubli porte presque toujours sur la");
      L.push("troisième : déterminer les modalités, consulter régulièrement le comité,");
      L.push("adresser un bilan à l'administration.");
      L.push("");
      if (String(p.suivi || "").trim()) {
        L.push("Ce que la fiche porte : « " + String(p.suivi).trim() + " »");
        L.push("");
      } else {
        L.push("La fiche ne porte aucune modalité de suivi. C'est une exigence expresse du");
        L.push("texte, et l'autorité administrative vérifie « la présence dans le plan de");
        L.push("sauvegarde de l'emploi des mesures prévues aux articles L. 1233-61 et");
        L.push("L. 1233-63 » (L. 1233-57-2, 3°).");
        L.push("");
      }
      L.push("MODALITÉS DE SUIVI RETENUES");
      L.push("");
      L.push("  Instance de suivi ................ [commission de suivi : composition,");
      L.push("  nombre de membres, présidence]");
      L.push("  Périodicité des réunions ......... [  ]");
      L.push("  Périodicité de la consultation du comité social et économique ..... [  ]");
      L.push("  Indicateurs suivis ............... [nombre de reclassements réalisés,");
      L.push("  formations engagées et achevées, budgets consommés par mesure, nombre de");
      L.push("  salariés sortis du dispositif et leur situation]");
      L.push("  Bilan adressé à l'autorité administrative ..... [périodicité et date du");
      L.push("  premier bilan]");
      L.push("  Transmission de l'avis du comité à l'autorité administrative ..... ☐");
      L.push("");

      titre(L, "VII. Le courrier de consultation du comité sur le plan");

      L.push(nom(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(ville(ctx) + ", le " + leJour(ctx.aujourdhui));
      L.push("");
      L.push("Objet : consultation sur le plan de sauvegarde de l'emploi");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous adresse, avec la convocation à la réunion du [DATE], le plan de");
      L.push("sauvegarde de l'emploi établi en application des articles L. 1233-61 à");
      L.push("L. 1233-63 du code du travail.");
      L.push("");
      L.push("L'article L. 1233-32 impose que, dans les entreprises d'au moins cinquante");
      L.push("salariés, l'employeur adresse ce plan aux représentants du personnel outre");
      L.push("les renseignements prévus à l'article L. 1233-31 : il vous parvient donc");
      L.push("avec la convocation, et non en séance.");
      L.push("");
      L.push("Le comité est consulté sur « les mesures sociales d'accompagnement prévues");
      L.push("par le plan de sauvegarde de l'emploi » (L. 1233-30, I, 2°).");
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
      L.push("Pièces jointes : plan de sauvegarde de l'emploi · note motivée des rubriques");
      L.push("écartées · tableau budgétaire mesure par mesure · [le cas échéant] note de");
      L.push("proportionnalité et comptes consolidés du groupe");
      L.push("");

      titre(L, "VIII. Signature");

      L.push("Voie retenue : " + voieEnClair(f) + ".");
      L.push("");
      L.push("  ☐ Accord collectif majoritaire (L. 1233-24-1) — signé par une ou plusieurs");
      L.push("    organisations syndicales représentatives ayant recueilli au moins 50 %");
      L.push("    des suffrages exprimés en faveur d'organisations reconnues");
      L.push("    représentatives au premier tour des dernières élections des titulaires");
      L.push("    au comité, quel que soit le nombre de votants, ou par le conseil");
      L.push("    d'entreprise. Voyez le document du contrôle CTL-PSE-07.");
      L.push("");
      L.push("  ☐ Document unilatéral (L. 1233-24-4) — « A défaut d'accord mentionné à");
      L.push("    l'article L. 1233-24-1, un document élaboré par l'employeur APRÈS LA");
      L.push("    DERNIÈRE RÉUNION du comité social et économique fixe le contenu du plan");
      L.push("    de sauvegarde de l'emploi et précise les éléments prévus aux 1° à 5° de");
      L.push("    l'article L. 1233-24-2. »");
      L.push("");
      L.push("La date du document unilatéral n'est donc pas libre : il est élaboré après");
      L.push("la dernière réunion du comité. Un document daté d'avant se contredit");
      L.push("lui-même.");
      L.push("");
      L.push("Fait à " + ville(ctx) + ", le [DATE]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      titre(L, "VOTRE CALENDRIER");

      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      L.push("Aujourd'hui, " + leJour(d0) + " — vous complétez le plan et la note motivée");
      L.push("des rubriques écartées. Comptez quatre à huit semaines : un plan se négocie");
      L.push("ou s'élabore, il ne se remplit pas.");
      L.push("");
      L.push("Avant la convocation — le plan doit être PRÊT : l'article L. 1233-32 impose");
      L.push("de l'adresser avec elle. Un plan daté d'après la convocation établit à lui");
      L.push("seul qu'il n'a pas été joint (contrôle CTL-PSE-06).");
      L.push("");
      if (rs.length) {
        L.push("Vos réunions : " + rs.map(function (x) { return jour(x); }).join(" · ") + ".");
        L.push("Toute mesure ajoutée au plan APRÈS la dernière — le " +
          jour(rs[rs.length - 1]) + " — n'a pas été");
        L.push("soumise au comité. Reconvoquez sur la version définitive avant de saisir");
        L.push("l'administration.");
        L.push("");
      }
      L.push("Après l'avis — vous déposez la demande de " +
        (voie(f) === "accord" ? "validation" : voie(f) === "unilateral" ? "homologation"
          : "validation ou d'homologation") + ", par la voie");
      L.push("dématérialisée (D. 1233-14).");
      L.push("");
      L.push("L'administration notifie ensuite sa décision : « dans un délai de quinze");
      L.push("jours à compter de la réception de l'accord collectif » ou « dans un délai");
      L.push("de vingt et un jours à compter de la réception du document complet »");
      L.push("(L. 1233-57-4). Le mot « complet » est le point de départ réel : un dossier");
      L.push("incomplet ne fait pas courir le délai.");
      if (estDate(p.dateDecisionAdmin)) {
        L.push("");
        L.push("Votre fiche porte une décision administrative du " + jour(p.dateDecisionAdmin) + ".");
        L.push("Aucune lettre de licenciement ne peut être expédiée avant cette date");
        L.push("(L. 1233-39) : voyez le document du contrôle CTL-PSE-04.");
      }

      pied(L, ["L. 1233-61", "L. 1233-62", "L. 1233-63", "L. 1233-4", "L. 1233-32",
        "L. 1233-30, I, 2°", "L. 1233-33", "L. 1233-24-1", "L. 1233-24-4",
        "L. 1233-57-2", "L. 1233-57-3", "L. 1233-57-4", "D. 1233-14"],
        "Le texte des sept rubriques est reproduit mot pour mot depuis l'article\n" +
        "L. 1233-62 dans sa version lue au dépôt (LEGIARTI000036261725).\n" +
        "\n" +
        "Ce qui se joue : l'article L. 1235-10 dispose que « en cas d'annulation d'une\n" +
        "décision de validation […] ou d'homologation […] en raison d'une absence ou\n" +
        "d'une insuffisance de plan de sauvegarde de l'emploi mentionné à l'article\n" +
        "L. 1233-61, la procédure de licenciement est nulle ». Le juge peut alors\n" +
        "ordonner la poursuite du contrat de travail ou prononcer la nullité du\n" +
        "licenciement et ordonner la réintégration ; à défaut, il octroie une indemnité\n" +
        "« qui ne peut être inférieure aux salaires des six derniers mois »\n" +
        "(L. 1235-11).\n" +
        "\n" +
        "Et l'application ne dit pas si votre plan est suffisant : aucun texte n'en fixe\n" +
        "le montant, et l'appréciation de sa proportionnalité aux moyens de\n" +
        "l'entreprise, de l'unité économique et sociale et du groupe appartient à\n" +
        "l'autorité administrative (L. 1233-57-3), puis au juge.");
      return L.join("\n");
    });

})(typeof window !== "undefined" ? window : this);
