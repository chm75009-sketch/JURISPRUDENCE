/* Les documents que l'application PRODUIT — licenciement économique : le fond
   du motif, les pièces, les seuils, la cohérence du dossier et les accords.

   POURQUOI CE FICHIER EXISTE

   Les fiches de moteur/economique/regularisation-eco.js disent à l'employeur
   quel écrit produire : « note de construction des catégories
   professionnelles », « tableau de confrontation des accords versés aux règles
   légales », « bordereau de pièces », « relevé des licenciements des trois mois
   consécutifs précédents ». Elles ne le produisent pas. Un employeur à qui
   l'on explique en quatre étapes comment reconstruire ses catégories n'a
   toujours pas de note de construction, et le dossier qu'il présentera au juge
   n'en portera pas davantage.

   Ce fichier écrit ces documents-là, à son nom, avec les données de son
   dossier, ses rubriques et ses cases à remplir. Ce qu'il produit n'est pas
   une lettre : la plupart de ces vingt-huit points appellent une NOTE, un
   TABLEAU, un BORDEREAU ou un RELEVÉ — un écrit interne, qui se verse au
   dossier et se montre. Deux d'entre eux seulement portent des courriers
   (CTL-PCO-02, CTL-CTX-01), parce que le texte impose d'écrire à quelqu'un.

   CE QUE CHAQUE DOCUMENT EST CENSÉ FAIRE

   Un document utile ici est un document que l'employeur n'a plus qu'à
   renseigner : les rubriques y sont, l'ordre y est, chaque colonne dit ce
   qu'elle attend, et chaque pièce annoncée dit CE QU'ELLE DOIT ÉTABLIR. Une
   pièce versée sans que l'on sache ce qu'elle prouve ne prouve rien : c'est la
   leçon des contrôles CTL-PCE-01 à CTL-PCE-04, et elle commande la forme des
   bordereaux de ce fichier.

   TROIS RÈGLES, TENUES PARTOUT

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Chaque article cité ici figure dans
      moteur/economique/textes_eco.json avec son identifiant de version, ou
      dans le champ « fondement » du contrôle auquel le document répond. Les
      articles simplement RENVOYÉS par un texte lu sont NOMMÉS, jamais
      reproduits ni paraphrasés : les articles L. 233-1, L. 233-3 et L. 233-16
      du code de commerce, auxquels L. 1233-3 et L. 1233-4 renvoient pour la
      notion de groupe ; les articles L. 631-17, L. 631-19, L. 641-4, L. 641-10
      et L. 642-5 du même code, auxquels L. 1233-60 renvoie ; les articles
      L. 1233-57-9 à L. 1233-57-16, que L. 1233-57-3 nomme et que ce module n'a
      pas captés. Chaque fois, le document le dit à l'endroit où le lecteur
      pourrait croire que l'application les connaît.

      La convention collective du client fait l'objet de la même règle, en plus
      strict : l'application NE CONNAÎT PAS son texte. Les documents CTL-CCN-01
      à CTL-CCN-03 organisent donc le RELEVÉ de ses stipulations — quelle
      stipulation, à quel article, dans quelle version — et n'en affirment
      aucune. Il en va de même des usages et engagements unilatéraux
      (CTL-USA-01), qui ne figurent dans aucune base publique.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ. Le corpus de
      ce module ne contient AUCUN article de sanction pénale — pas une amende,
      pas une contravention. Aucun document de ce fichier ne menace donc d'une
      peine. Ce qui s'y joue est écrit et fondé : l'absence de cause réelle et
      sérieuse et le barème de L. 1235-3, la nullité de L. 1235-10 quand le
      licenciement d'au moins dix salariés intervient sans décision de
      validation ou d'homologation, la nullité de la rupture prononcée avant
      cette décision (L. 1233-39), et la perte de la garantie des créances hors
      de la fenêtre de L. 3253-8. Rien d'autre.

   3. LES FAITS ET LES CHIFFRES NE S'INVENTENT JAMAIS. Aucun document n'écrit
      les difficultés de l'entreprise, ses résultats, son effectif réel, ses
      catégories ni l'identité des salariés. Tout cela sort ENTRE CROCHETS,
      avec la consigne de l'écrire daté, chiffré et sourcé. Quand la fiche
      d'audit porte une valeur, elle est reprise telle quelle et présentée pour
      ce qu'elle est — une déclaration à confirmer par une pièce, jamais un
      fait établi.

   UNE PARTICULARITÉ DU MODULE, QUI COMMANDE PLUSIEURS DOCUMENTS

   La plupart des obligations du licenciement économique s'apprécient au jour
   de la notification. Un état redaté, une pièce reconstituée, un ordre des
   licenciements refait après la lettre ne régularisent rien : ils établissent
   au contraire que l'élément n'existait pas au jour de l'acte. Les documents
   concernés — CTL-PCE-02, CTL-COH-01, CTL-COH-02, CTL-EFF-02, CTL-ORD-02,
   CTL-SEU-01, CTL-SEU-02, CTL-PCO-03 — portent donc un encadré « CE QUI NE SE
   RATTRAPE PAS », qui dit pourquoi, et sur quel texte. Ce qui suit ne rattrape
   pas : il CONSTATE, et il prépare ce qui peut encore l'être.                */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-eco-fond.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, entete = O.entete;

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE DATE

     Les dates de la fiche sont des chaînes « AAAA-MM-JJ ». On les découpe à la
     main : « new Date("2026-05-16") » se lit en temps universel, et sur un
     poste situé à l'ouest de Greenwich la date affichée reculait d'un jour.
     Un document daté du mauvais jour est pire qu'un document non daté.
     ════════════════════════════════════════════════════════════════════════ */

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
  /* Une date de la fiche, écrite en toutes lettres — ou son crochet. */
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
  function ecart(a, b) {
    var x = dISO(a), y = dISO(b);
    return x && y ? Math.round((y - x) / 86400000) : null;
  }
  function aujourd(ctx) {
    var d = ctx && ctx.aujourdhui;
    return d instanceof Date && !isNaN(d.getTime()) ? d : new Date();
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE LECTURE DE LA FICHE

     La fiche d'audit est un objet libre : un champ peut manquer, valoir une
     chaîne vide, un tableau vide ou un nombre. Aucun générateur ne doit
     lancer d'exception sur une fiche vide — un champ absent devient un
     crochet, et le document reste utilisable.
     ════════════════════════════════════════════════════════════════════════ */

  function fic(ctx) { return (ctx && ctx.fiche) || {}; }
  function pro(ctx) { return (ctx && ctx.profil) || {}; }

  function vide(x) {
    return x === undefined || x === null || x === "" ||
      (Array.isArray(x) && x.length === 0);
  }
  function liste(x) { return Array.isArray(x) ? x : []; }
  function nb(x) { return typeof x === "number" && isFinite(x) ? x : null; }

  /* Un nombre de la fiche, ou son crochet. */
  function chiffre(x, quoi) {
    var n = nb(x);
    if (n !== null) return String(n);
    if (typeof x === "string" && x.trim() !== "") return x.trim();
    return "[" + (quoi || "nombre") + "]";
  }

  /* La dénomination : le profil d'abord, la fiche ensuite. Les deux existent,
     et le module d'audit économique remplit « entreprise » quand le profil
     général remplit « denomination ». */
  function nomDe(ctx) {
    var p = pro(ctx), f = fic(ctx);
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }
  function lieuDe(ctx) { return cro(pro(ctx).ville, "lieu"); }
  function signataire(ctx) {
    return cro(pro(ctx).responsable, "Nom et qualité du représentant légal");
  }

  /* Les pièces de la fiche : tantôt des codes, tantôt des objets datés. La
     normalisation est celle de moteur/economique/pieces.js, reprise ici parce
     que la page ne charge pas le moteur du module. */
  var CHAMPS_PIECE = ["fichier", "date", "periode", "auteur", "version", "perimetre", "lue"];
  function pieces(ctx) {
    return liste(fic(ctx).pieces).map(function (p) {
      return typeof p === "string" ? { code: p, _binaire: true } : (p || {});
    });
  }
  function manquantsDe(p) {
    if (!p || p._binaire) return CHAMPS_PIECE.slice();
    return CHAMPS_PIECE.filter(function (c) {
      return p[c] === undefined || p[c] === "";
    });
  }

  /* ════════════════════════════════════════════════════════════════════════
     LA MISE EN FORME

     Tout sort en texte simple : le document se colle dans un courriel, se
     copie dans un traitement de texte et s'imprime sans rien perdre.
     ════════════════════════════════════════════════════════════════════════ */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  function pad(s, n) {
    s = String(s == null ? "" : s);
    while (s.length < n) s += " ";
    return s;
  }
  /* Un tableau en texte simple, aux colonnes calées sur leur contenu. */
  function tableau(L, entetes, lignes) {
    var larg = entetes.map(function (e, i) {
      var m = String(e).length;
      lignes.forEach(function (l) {
        m = Math.max(m, String(l[i] == null ? "" : l[i]).length);
      });
      return Math.min(m, 44);
    });
    function ligne(cells) {
      return "  " + cells.map(function (c, i) {
        var s = String(c == null ? "" : c);
        if (s.length > larg[i]) s = s.slice(0, larg[i] - 1) + "…";
        return pad(s, larg[i]);
      }).join(" │ ").replace(/\s+$/, "");
    }
    L.push(ligne(entetes));
    L.push("  " + larg.map(function (w) {
      return new Array(w + 1).join("─");
    }).join("─┼─"));
    if (!lignes.length) L.push(ligne(entetes.map(function () { return "[à compléter]"; })));
    else lignes.forEach(function (l) { L.push(ligne(l)); });
    L.push("");
    return L;
  }

  /* Un bloc de consignes, encadré, pour ce que l'employeur doit écrire
     lui-même. Il revient partout : c'est la troisième règle du fichier. */
  function consigne(L, lignes) {
    L.push("┌" + new Array(71).join("─"));
    lignes.forEach(function (x) { L.push("│ " + x); });
    L.push("└" + new Array(71).join("─"));
    L.push("");
    return L;
  }

  /* L'encadré des irrégularités qui ne se rattrapent pas. Il ne s'affiche que
     lorsqu'il a lieu d'être, et il dit sur quel texte il repose. */
  function nonRattrapable(L, quoi, pourquoi) {
    L.push(GROS);
    L.push("CE QUI NE SE RATTRAPE PAS");
    L.push(GROS);
    L.push("");
    L.push(quoi);
    L.push("");
    pourquoi.forEach(function (x) { L.push(x); });
    L.push("");
    L.push("N'ANTIDATEZ RIEN. Une pièce reconstituée après coup et portant une date");
    L.push("antérieure ne répare pas l'irrégularité : elle y ajoute. Le document");
    L.push("ci-dessous ne rattrape pas, il CONSTATE — et il prépare ce qui peut");
    L.push("encore l'être.");
    L.push("");
    return L;
  }

  /* Le pied commun : d'où vient ce qui est écrit, et ce que le document ne dit
     pas. La liste des articles est celle du document, pas celle du module. */
  function pied(articles, notes) {
    var L = ["", TRAIT, ""];
    L.push("FONDEMENT : " + articles + ".");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur");
    L.push("identifiant de version dans moteur/economique/textes_eco.json.");
    if (notes && notes.length) {
      L.push("");
      notes.forEach(function (n) { L.push(n); });
    }
    L.push("");
    L.push("CE QUE CE DOCUMENT NE DIT PAS. Il ne vaut pas consultation. Votre");
    L.push("convention collective, vos accords d'entreprise et vos usages peuvent");
    L.push("ajouter des exigences que l'application ne lit pas, et qui priment");
    L.push("lorsqu'elles sont plus favorables. Ne laissez aucun crochet dans le");
    L.push("texte que vous versez au dossier ou que vous remettez.");
    return L;
  }

  /* La réserve sur la notion de groupe : elle revient dans tous les documents
     de périmètre. L. 1233-3 et L. 1233-4 la définissent par renvoi au code de
     commerce, que ce module n'a pas lu. */
  var RESERVE_GROUPE =
    "La notion de groupe est définie par L. 1233-3 et L. 1233-4 par renvoi aux " +
    "articles L. 233-1, aux I et II de l'article L. 233-3 et à l'article " +
    "L. 233-16 du code de commerce. L'application n'a pas lu ces articles : " +
    "elle les nomme, elle n'en reproduit pas le contenu.";

  /* Ce que chaque pièce doit ÉTABLIR — pas ce qu'elle est. C'est la
     différence entre un bordereau utile et une liste de fichiers. */
  var PREUVE = {
    "convention": "que la convention collective appliquée est bien celle de l'IDCC déclaré, dans la version en vigueur à la date de la notification",
    "accords": "quelles règles légales l'accord aménage, et dans quel sens",
    "liasse": "les résultats de l'entreprise, exercice par exercice, tels qu'ils ont été arrêtés et non tels qu'ils sont invoqués",
    "comptes-groupe": "que les agrégats portent sur le secteur d'activité du groupe, et quelles sociétés y sont comprises",
    "etat-postes": "quels emplois étaient disponibles, dans quelles sociétés, et à quelle date",
    "attestation-absence-poste": "qu'une société interrogée n'avait aucun emploi disponible, et à quelle date elle l'a écrit",
    "offres": "ce qui a été proposé à chaque salarié, quand, et par quel moyen conférant date certaine",
    "renseignements-cse": "que les sept renseignements de L. 1233-31 ont été adressés avec la convocation, et lesquels",
    "pv-cse": "ce qui a été dit, décidé et rendu comme avis, à quelles dates",
    "pse": "le contenu du plan tel qu'il a été soumis, et la date à laquelle il l'a été",
    "decision-admin": "que la validation ou l'homologation est intervenue, et à quelle date elle a été notifiée",
    "autorisations": "que l'inspecteur du travail a autorisé le licenciement de chaque salarié protégé, avant la notification",
    "grille-ordre": "quelles valeurs les quatre critères de L. 1233-5 ont prises, salarié par salarié",
    "bulletins": "la rémunération de référence, mois par mois",
    "registre": "l'effectif réel, à une date certaine",
    "accord-perimetre-ordre": "que le périmètre d'application des critères d'ordre a été fixé par accord collectif, et lequel",
  };
  function ceQuePreuve(code) {
    return PREUVE[code] || "[ÉCRIRE CE QUE CETTE PIÈCE DOIT ÉTABLIR — un fait précis, daté, opposable]";
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ════════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     CTL-TMP-01 — LA VERSION APPLICABLE DE L'ARTICLE L. 1233-3
     ══════════════════════════════════════════════════════════════════════ */

  /* Les trois états successifs, tels que moteur/economique/moteur.js les
     nomme. Le document ne refait pas ce découpage : deux réponses différentes
     à la même question, dans le rapport et dans le document, se remarqueraient
     tout de suite. */
  function etatTexte(d) {
    if (!d) return null;
    if (d >= "2017-09-24")
      return { etat: "depuis le 24 septembre 2017",
               contenu: "indicateurs, seuils et périmètre du secteur d'activité du groupe" };
    if (d >= "2016-12-01")
      return { etat: "du 1er décembre 2016 au 23 septembre 2017",
               contenu: "indicateurs et seuils, sans périmètre défini" };
    return { etat: "avant le 1er décembre 2016",
             contenu: "« difficultés économiques », sans définition ni indicateur" };
  }

  DP.ajouter("CTL-TMP-01", {
    nom: "Note de relecture du dossier au regard de la version applicable de L. 1233-3",
    detail: "La date qui commande la version du texte, l'état retenu, ce qu'il " +
            "porte, et le relevé de ce qui doit être relu quand la version est abrogée.",
    produire: function (ctx) {
      var f = fic(ctx);
      var dn = f.dateNotification;
      var e = etatTexte(dn);
      var ancien = dn ? dn < "2017-09-24" : null;
      var tresAncien = dn ? dn < "2016-12-01" : null;
      var L = entete(ctx, "Note de relecture — version applicable de l'article L. 1233-3",
        "article L. 1233-3 du code du travail");

      L.push("À QUOI SERT CETTE NOTE");
      L.push("");
      L.push("La version applicable de l'article L. 1233-3 est celle en vigueur au jour");
      L.push("de la notification du licenciement. Raisonner sur la version en vigueur");
      L.push("aujourd'hui pour un licenciement plus ancien, c'est opposer au dossier des");
      L.push("conditions qui n'existaient pas — et, à l'inverse, s'interdire un périmètre");
      L.push("d'appréciation que le texte de l'époque n'enfermait pas.");
      L.push("");
      L.push("Cette note fixe la date, nomme la version, dit ce qu'elle porte, et relève");
      L.push("ce qui doit être relu lorsque cette version est abrogée. Elle se verse au");
      L.push("dossier : c'est elle qui datera le raisonnement.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LA DATE QUI COMMANDE");
      L.push("");
      L.push("   Date de notification retenue : " + jour(dn, "DATE DE NOTIFICATION, ou date envisagée — AAAA-MM-JJ"));
      L.push("   Source de cette date : [lettre recommandée, avis de réception, registre");
      L.push("   des envois — préciser la pièce et sa cote]");
      L.push("");
      if (!dn) {
        consigne(L, [
          "LA DATE MANQUE, ET TANT QU'ELLE MANQUE CETTE NOTE NE CONCLUT RIEN.",
          "",
          "Sans elle, la version applicable ne peut pas être déterminée, et le",
          "rapport d'audit raisonne sur la version en vigueur aujourd'hui — ce qui",
          "est faux pour tout licenciement antérieur au 24 septembre 2017.",
          "",
          "Renseignez la date de notification, ou celle envisagée, puis relancez",
          "l'audit avant de vous servir de la suite.",
        ]);
      }

      L.push("2. LA VERSION RETENUE");
      L.push("");
      if (e) {
        L.push("   Version applicable : " + e.etat);
        L.push("   Ce que cette version porte : " + e.contenu);
        L.push("");
      } else {
        L.push("   Version applicable : [à déterminer une fois la date renseignée]");
        L.push("   Ce que cette version porte : [à déterminer]");
        L.push("");
        L.push("   Les trois états successifs que l'application distingue :");
        L.push("     · avant le 1er décembre 2016 — « difficultés économiques », sans");
        L.push("       définition ni indicateur ;");
        L.push("     · du 1er décembre 2016 au 23 septembre 2017 — indicateurs et seuils,");
        L.push("       sans périmètre défini ;");
        L.push("     · depuis le 24 septembre 2017 — indicateurs, seuils et périmètre du");
        L.push("       secteur d'activité du groupe.");
        L.push("");
      }

      L.push("3. CE QUE PORTE LA VERSION EN VIGUEUR, LUE À LA SOURCE");
      L.push("");
      L.push("L'article L. 1233-3, dans sa version lue par l'application, définit le");
      L.push("licenciement économique comme celui « effectué par un employeur pour un ou");
      L.push("plusieurs motifs non inhérents à la personne du salarié résultant d'une");
      L.push("suppression ou transformation d'emploi ou d'une modification, refusée par");
      L.push("le salarié, d'un élément essentiel du contrat de travail », consécutives");
      L.push("notamment à des difficultés économiques (1°), à des mutations");
      L.push("technologiques (2°), à une réorganisation nécessaire à la sauvegarde de la");
      L.push("compétitivité (3°) ou à la cessation d'activité (4°).");
      L.push("");
      L.push("Elle chiffre la baisse significative des commandes ou du chiffre");
      L.push("d'affaires, en comparaison avec la même période de l'année précédente :");
      L.push("  a) un trimestre pour une entreprise de moins de onze salariés ;");
      L.push("  b) deux trimestres consécutifs de onze à moins de cinquante salariés ;");
      L.push("  c) trois trimestres consécutifs de cinquante à moins de trois cents ;");
      L.push("  d) quatre trimestres consécutifs à partir de trois cents salariés.");
      L.push("");
      L.push("Elle sépare deux niveaux d'appréciation : « la matérialité de la");
      L.push("suppression, de la transformation d'emploi ou de la modification d'un");
      L.push("élément essentiel du contrat de travail s'apprécie au niveau de");
      L.push("l'entreprise », tandis que les difficultés, les mutations technologiques ou");
      L.push("la nécessité de sauvegarder la compétitivité s'apprécient « au niveau du");
      L.push("secteur d'activité commun à cette entreprise et aux entreprises du groupe");
      L.push("auquel elle appartient, établies sur le territoire national, sauf fraude ».");
      L.push("");
      L.push("Effectif de l'entreprise déclaré : " + chiffre(pro(ctx).effectif != null ? pro(ctx).effectif : f.effectif,
        "EFFECTIF DE L'ENTREPRISE") + " — c'est lui qui commande le nombre de");
      L.push("trimestres de baisse exigé par le 1°, si c'est cette cause qui est invoquée.");
      L.push("");

      L.push("4. CE QUI DOIT ÊTRE RELU");
      L.push("");
      if (ancien === true) {
        L.push("LA VERSION APPLICABLE EST ABROGÉE. Le dossier doit être relu par un");
        L.push("professionnel avant toute décision : l'application connaît les trois");
        L.push("versions du texte, elle ne connaît pas la jurisprudence propre à chacune.");
        L.push("");
        if (tresAncien) {
          L.push("· Le seuil trimestriel chiffré n'existait pas dans cette version : il n'est");
          L.push("  pas opposable à ce dossier, et un rapport qui l'opposerait se tromperait.");
        }
        L.push("· La limitation du périmètre d'appréciation au territoire national est née");
        L.push("  de l'ordonnance du 22 septembre 2017, entrée en vigueur le 24 septembre");
        L.push("  2017 : elle n'est pas applicable à une notification antérieure. Les");
        L.push("  sociétés étrangères du groupe peuvent donc entrer dans le périmètre.");
        L.push("· Reprenez pour le même motif les développements du rapport sur le");
        L.push("  reclassement : la limitation de l'obligation de reclassement au");
        L.push("  territoire national procède de la même ordonnance.");
        L.push("");
        consigne(L, [
          "À FAIRE ÉCRIRE PAR LE PROFESSIONNEL SAISI :",
          "",
          "  · [le texte applicable au " + jour(dn, "date") + ", article par article]",
          "  · [ce que le rapport d'audit dit à tort, point de contrôle par point]",
          "  · [ce qu'il faut démontrer en plus, ou en moins, sous cette version]",
          "  · [la conclusion : le dossier tient-il sous le texte de l'époque ?]",
          "",
          "Datez et signez cette relecture. Sans elle, le dossier est raisonné sous",
          "un texte qui ne le régit pas.",
        ]);
      } else if (ancien === false) {
        L.push("La version applicable est celle en vigueur : le rapport d'audit raisonne");
        L.push("sous le texte qui régit ce dossier. Aucune relecture au titre du droit");
        L.push("dans le temps n'est requise à ce titre.");
        L.push("");
        L.push("Vérifiez cependant que la date retenue est bien celle de la notification,");
        L.push("et non celle de l'entretien, de l'avis du comité ou de la décision : c'est");
        L.push("la notification, et elle seule, qui fixe la version applicable.");
        L.push("");
      } else {
        L.push("[À DÉTERMINER — la date de notification n'est pas renseignée.]");
        L.push("");
        L.push("Une fois la date portée au point 1 :");
        L.push("  · si elle est postérieure au 23 septembre 2017, le rapport raisonne sous");
        L.push("    le bon texte et rien n'est à relire à ce titre ;");
        L.push("  · si elle lui est antérieure, faites relire le dossier par un");
        L.push("    professionnel et joignez sa note ici.");
        L.push("");
      }

      L.push("5. LES ACTIONS QUI SE PRESCRIVENT, ET DEPUIS QUAND");
      L.push("");
      L.push("Ce point n'est pas décoratif : c'est lui qui dit jusqu'à quand un dossier");
      L.push("ancien peut encore être contesté, et donc s'il faut le relire.");
      L.push("");
      L.push("« Toute contestation portant sur le licenciement pour motif économique se");
      L.push("prescrit par douze mois à compter de la dernière réunion du comité social");
      L.push("et économique ou, dans le cadre de l'exercice par le salarié de son droit");
      L.push("individuel à contester le licenciement pour motif économique, à compter de");
      L.push("la notification de celui-ci » (L. 1235-7).");
      L.push("");
      if (dn) {
        L.push("   Notification du " + jour(dn, "date") + " : douze mois courent de cette date");
        L.push("   pour le droit individuel de contester. [Portez ici la date de la");
        L.push("   dernière réunion du comité, qui fait courir l'autre point de départ.]");
      } else {
        L.push("   [Portez ici la date de notification et celle de la dernière réunion du");
        L.push("   comité social et économique : ce sont les deux points de départ.]");
      }
      L.push("");
      L.push("L'article L. 1471-1 réserve expressément ce délai plus court en le nommant");
      L.push("parmi ceux auxquels il ne fait pas obstacle.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1235-7, L. 1471-1",
        [RESERVE_GROUPE,
         "L'ordonnance du 22 septembre 2017 est nommée pour dater le changement de",
         "version ; l'application n'en a pas lu le texte et n'en reproduit aucune",
         "disposition. Ce qu'elle a lu, ce sont les états successifs de l'article",
         "L. 1233-3 lui-même."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-FRA-01 — LE RÉSULTAT RECONSTITUÉ HORS FLUX INTRAGROUPE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-FRA-01", {
    nom: "Tableau de reconstitution du résultat d'exploitation hors flux intragroupe",
    detail: "Exercice par exercice, le résultat déclaré, le détail des flux, le " +
            "résultat reconstitué et son recalcul — plus la saisine du conseil.",
    produire: function (ctx) {
      var f = fic(ctx);
      var re = liste(f.resultatExploitation);
      var hf = liste(f.resultatHorsFlux);
      var fl = liste(f.fluxIntragroupe);
      var annees = {};
      re.forEach(function (x) { if (x && x.annee != null) annees[x.annee] = true; });
      hf.forEach(function (x) { if (x && x.annee != null) annees[x.annee] = true; });
      fl.forEach(function (x) { if (x && x.annee != null) annees[x.annee] = true; });
      var listeAnnees = Object.keys(annees).sort();

      var L = entete(ctx, "Reconstitution du résultat d'exploitation hors flux intragroupe",
        "article L. 1233-3 du code du travail");

      L.push("POURQUOI CE TABLEAU EXISTE");
      L.push("");
      L.push("L'article L. 1233-3 fait apprécier les difficultés économiques au niveau du");
      L.push("secteur d'activité commun à l'entreprise et aux entreprises du groupe");
      L.push("établies sur le territoire national, « sauf fraude ». Deux mots, et toute");
      L.push("la question de ce document : des difficultés qui disparaissent une fois");
      L.push("neutralisés les flux versés au groupe — redevances de marque, management");
      L.push("fees, prix de transfert — ne sont pas nécessairement celles que le texte");
      L.push("vise ; elles peuvent procéder de l'organisation du groupe elle-même.");
      L.push("");
      L.push("Ce tableau ne qualifie aucune fraude, et l'application n'en qualifiera");
      L.push("jamais : elle rend le calcul VISIBLE et VÉRIFIABLE. Une reconstitution qui");
      L.push("ne se recalcule pas ne démontre rien — c'est la seule chose que ce document");
      L.push("établit tout seul.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LE TABLEAU, EXERCICE PAR EXERCICE");
      L.push("");
      L.push("Toutes les valeurs sont en milliers d'euros, ou dans l'unité que vous");
      L.push("préciserez ici : [UNITÉ RETENUE]. Une même unité pour toute la colonne.");
      L.push("");
      var lignes = listeAnnees.map(function (an) {
        var r = re.find(function (x) { return x && String(x.annee) === an; });
        var h = hf.find(function (x) { return x && String(x.annee) === an; });
        var x = fl.find(function (y) { return y && String(y.annee) === an; });
        var total = x ? (nb(x.total) !== null ? x.total
          : (nb(x.redevanceMarque) || 0) + (nb(x.managementFees) || 0) + (nb(x.prixTransfert) || 0)) : null;
        var attendu = (r && nb(r.valeur) !== null && total !== null) ? r.valeur + total : null;
        var ecartCalc = (attendu !== null && h && nb(h.valeur) !== null) ? h.valeur - attendu : null;
        return [
          an,
          r && nb(r.valeur) !== null ? r.valeur : "[résultat]",
          x && nb(x.redevanceMarque) !== null ? x.redevanceMarque : "[redevance]",
          x && nb(x.managementFees) !== null ? x.managementFees : "[fees]",
          x && nb(x.prixTransfert) !== null ? x.prixTransfert : "[prix transf.]",
          total !== null ? total : "[total flux]",
          h && nb(h.valeur) !== null ? h.valeur : "[reconstitué]",
          ecartCalc === null ? "[à vérifier]" : (Math.abs(ecartCalc) <= 1 ? "recalculé" : "ÉCART " + ecartCalc),
        ];
      });
      tableau(L, ["Exercice", "Résultat expl.", "Redevance marque",
                  "Management fees", "Prix transfert", "Total flux",
                  "Résultat reconstitué", "Contrôle"], lignes);

      L.push("Règle du contrôle, et elle ne souffre pas d'exception :");
      L.push("   résultat d'exploitation + total des flux de l'exercice = résultat");
      L.push("   reconstitué. Si l'égalité n'est pas vérifiée à l'unité près, la");
      L.push("   reconstitution est fausse ou incomplète, et elle ne démontre rien.");
      L.push("");
      if (!listeAnnees.length) {
        consigne(L, [
          "AUCUN EXERCICE N'EST RENSEIGNÉ DANS LE DOSSIER.",
          "",
          "Remplissez une ligne par exercice invoqué, en remontant au moins jusqu'à",
          "l'exercice antérieur à celui où les difficultés apparaissent — sans quoi",
          "il n'y a rien à comparer.",
          "",
          "Chaque montant se prend sur une pièce, jamais de mémoire : liasse fiscale,",
          "comptes annuels, grand livre pour le détail des flux.",
        ]);
      }

      L.push("2. D'OÙ VIENT CHAQUE MONTANT");
      L.push("");
      tableau(L, ["Colonne", "Pièce d'origine", "Ce que la pièce doit établir"], [
        ["Résultat d'exploitation", "[liasse fiscale, compte de résultat, exercice ...]",
         "le résultat tel qu'il a été arrêté, pas tel qu'il est invoqué"],
        ["Redevance de marque", "[convention de licence + factures de l'exercice]",
         "le montant facturé par le groupe et sa base contractuelle"],
        ["Management fees", "[convention de prestations + factures]",
         "le montant facturé et la contrepartie réelle"],
        ["Prix de transfert", "[documentation de prix de transfert, grand livre]",
         "les flux d'achat-vente intragroupe et leur marge"],
        ["Résultat reconstitué", "[calcul ci-dessus, visé par son auteur]",
         "que le résultat hors flux se recalcule à partir des deux colonnes"],
      ]);

      L.push("3. CE QUE LE TABLEAU MONTRE — ET CE QU'IL NE TRANCHE PAS");
      L.push("");
      var dernier = re.length ? re[re.length - 1] : null;
      var dernierHF = hf.length ? hf[hf.length - 1] : null;
      if (dernier && dernierHF && nb(dernier.valeur) !== null && nb(dernierHF.valeur) !== null) {
        L.push("   Dernier exercice renseigné : résultat d'exploitation " + dernier.valeur +
          ", résultat reconstitué " + dernierHF.valeur + ".");
        if (dernier.valeur < 0 && dernierHF.valeur >= 0) {
          L.push("   LE SIGNE S'INVERSE : les difficultés invoquées disparaissent une fois");
          L.push("   les flux intragroupe neutralisés. C'est précisément la situation qui");
          L.push("   appelle l'examen d'un professionnel, et le point sur lequel la");
          L.push("   démonstration sera attaquée.");
        } else {
          L.push("   Le signe ne s'inverse pas. Cela ne vaut pas conformité : le tableau");
          L.push("   doit être versé et opposable, et l'origine des difficultés reste une");
          L.push("   question de fond que ce document n'a pas vocation à trancher.");
        }
        L.push("");
      } else {
        L.push("   [Une fois le tableau rempli, écrivez ici en une phrase ce qu'il montre :");
        L.push("    le signe du résultat s'inverse-t-il, oui ou non, et sur quel exercice.]");
        L.push("");
      }
      L.push("Ce document ne conclut jamais à la conformité. L'appréciation d'une");
      L.push("organisation artificielle des difficultés excède ce que l'application peut");
      L.push("faire, et elle touche au « sauf fraude » de L. 1233-3 — c'est-à-dire à la");
      L.push("réserve qui, si elle joue, écarte la limitation du périmètre d'appréciation");
      L.push("au territoire national.");
      L.push("");

      L.push("4. LA SAISINE DU CONSEIL");
      L.push("");
      consigne(L, [
        "À TRANSMETTRE À L'AVOCAT OU AU JURISTE EN DROIT SOCIAL, AVEC CE TABLEAU :",
        "",
        "  · [les conventions intragroupe en vigueur, datées, avec leurs avenants]",
        "  · [les factures de l'exercice, poste par poste]",
        "  · [la documentation de prix de transfert, si elle existe]",
        "  · [l'organigramme du groupe et le périmètre de consolidation]",
        "  · [les comptes des sociétés du même secteur d'activité]",
        "",
        "QUESTION POSÉE : les difficultés invoquées au soutien du projet procèdent-",
        "elles de l'exploitation, ou de l'organisation des flux au sein du groupe ?",
        "",
        "Sa note, datée et signée, se joint à ce tableau. Le dossier ne se décide",
        "pas sur le seul signalement porté au questionnaire.",
      ]);

      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ DE CELUI QUI A FAIT LE CALCUL]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-3",
        [RESERVE_GROUPE,
         "Aucun texte capté par ce module ne définit la fraude ni n'en tire de",
         "conséquence chiffrée. Le seul mot lu est celui de L. 1233-3, « sauf",
         "fraude », et il n'est pas davantage commenté ici."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-COE-01 — LE DOSSIER DE SAISINE SUR LE RISQUE DE CO-EMPLOI
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-COE-01", {
    nom: "Dossier de saisine d'un conseil sur le risque de co-emploi",
    detail: "Le relevé des faits d'immixtion, pièce par pièce, et la question " +
            "posée au professionnel — l'application ne qualifie pas le co-emploi.",
    produire: function (ctx) {
      var f = fic(ctx);
      var societes = liste(f.societes);
      var L = entete(ctx, "Dossier de saisine — risque de co-emploi", null);

      L.push("CE QUE CE DOCUMENT EST, ET CE QU'IL N'EST PAS");
      L.push("");
      L.push("Ce n'est pas une note de qualification : l'application ne dit pas s'il y a");
      L.push("co-emploi, et elle ne le dira jamais. Aucun article du code du travail lu");
      L.push("par ce module ne définit le co-emploi — la notion est jurisprudentielle, et");
      L.push("sa qualification excède ce qu'une base de textes peut faire.");
      L.push("");
      L.push("Ce document ORGANISE LA SAISINE : il range les faits signalés, il attache à");
      L.push("chacun la pièce qui l'établit, et il pose la question au professionnel dans");
      L.push("des termes qui lui permettent d'y répondre. Un signalement porté au");
      L.push("questionnaire n'est pas un dossier ; ceci en est un.");
      L.push("");
      L.push("Le critère est exigeant, et c'est la raison pour laquelle un signalement ne");
      L.push("suffit pas : le co-emploi suppose une confusion d'intérêts, d'activités et");
      L.push("de direction se manifestant par une immixtion permanente de la société mère");
      L.push("dans la gestion économique et sociale de la société employeuse, conduisant à");
      L.push("la perte totale d'autonomie d'action de cette dernière. La première moitié");
      L.push("de la formule ne suffit pas : c'est la seconde qui décide.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LE PÉRIMÈTRE — QUI EST EN CAUSE");
      L.push("");
      L.push("   Société employeuse : " + nomDe(ctx));
      L.push("   Société mise en cause : [DÉNOMINATION, forme, siège, numéro d'immatriculation]");
      L.push("   Lien capitalistique : [pourcentage de détention, direct ou indirect, à quelle date]");
      L.push("   Pièce : [extrait Kbis, organigramme du groupe, pacte d'associés — datés]");
      L.push("");
      if (societes.length) {
        L.push("   Sociétés du groupe déclarées au dossier :");
        tableau(L, ["Société", "Effectif", "Activité", "Pays"],
          societes.map(function (s) {
            return [cro(s && s.nom, "société"),
                    s && nb(s.effectif) !== null ? s.effectif : "[effectif]",
                    cro(s && s.activite, "activité"),
                    cro(s && s.pays, s && s.etranger ? "étranger" : "France")];
          }));
        L.push("   Ces données viennent du questionnaire : elles sont déclarées, non");
        L.push("   établies. Joignez pour chacune la pièce qui la prouve.");
        L.push("");
      }

      L.push("2. LES FAITS D'IMMIXTION, UN PAR LIGNE");
      L.push("");
      L.push("Un fait s'écrit daté, situé et attribué : ce qui a été décidé, quel jour,");
      L.push("par qui, sur quoi, et à la place de qui. « La mère décide de tout » n'est");
      L.push("pas un fait, c'est une impression — et un professionnel n'en fera rien.");
      L.push("");
      tableau(L, ["Date", "Fait précis", "Auteur de l'acte", "Domaine", "Pièce"], [
        ["[AAAA-MM-JJ]", "[ce qui a été décidé, et par qui à la place de qui]",
         "[personne, fonction, société]", "[gestion / RH / finance / commercial]", "[cote]"],
        ["[AAAA-MM-JJ]", "[…]", "[…]", "[…]", "[…]"],
        ["[AAAA-MM-JJ]", "[…]", "[…]", "[…]", "[…]"],
      ]);
      L.push("Les quatre domaines à couvrir, parce que ce sont eux que la formule vise :");
      L.push("  · DÉCISIONS ÉCONOMIQUES — investissements, arrêts de production, prix,");
      L.push("    choix de clients ou de fournisseurs pris hors de la société employeuse ;");
      L.push("  · GESTION DU PERSONNEL — embauches, licenciements, sanctions, promotions,");
      L.push("    rémunérations décidées ou validées par la société mère ;");
      L.push("  · DIRECTION EFFECTIVE — qui préside, qui arbitre, qui donne les");
      L.push("    instructions, mandats sociaux croisés, délégations de pouvoir ;");
      L.push("  · FLUX FINANCIERS — trésorerie centralisée, conventions de compte");
      L.push("    courant, redevances, refacturations, garanties.");
      L.push("");
      L.push("Écrivez aussi ce qui reste à la société employeuse : un dossier qui ne");
      L.push("montre que l'immixtion sans dire ce qui subsiste ne permet pas d'apprécier");
      L.push("la « perte totale d'autonomie », qui est le nœud du critère.");
      L.push("");

      L.push("3. LES PIÈCES À RÉUNIR, ET CE QUE CHACUNE DOIT ÉTABLIR");
      L.push("");
      tableau(L, ["Pièce", "Ce qu'elle doit établir"], [
        ["[Conventions de prestations de services]", "ce que la mère facture, et ce qu'elle fait en échange"],
        ["[Délégations de pouvoir et mandats sociaux]", "qui décide en droit, et depuis quand"],
        ["[Comptes rendus de comités de direction]", "qui décide en fait, et sur quoi"],
        ["[Courriels d'instruction]", "que les instructions viennent de la mère et sont suivies"],
        ["[Procès-verbaux du comité social et économique]", "ce que les représentants ont constaté et dit"],
        ["[Organigrammes successifs]", "les rattachements hiérarchiques réels"],
        ["[Conventions de trésorerie]", "qui dispose des fonds de la société employeuse"],
      ]);

      L.push("4. LA QUESTION POSÉE");
      L.push("");
      consigne(L, [
        "AU CONSEIL SAISI — avocat ou juriste en droit social :",
        "",
        "Au vu des faits relevés au point 2 et des pièces du point 3, la société",
        "[DÉNOMINATION DE LA SOCIÉTÉ MISE EN CAUSE] doit-elle être regardée comme",
        "co-employeur des salariés de " + nomDe(ctx) + " ?",
        "",
        "Nous vous demandons de dire, en particulier :",
        "  · si l'immixtion relevée est permanente, ou ponctuelle ;",
        "  · si elle porte sur la gestion économique ET sociale ;",
        "  · ce qu'il reste d'autonomie d'action à la société employeuse ;",
        "  · les conséquences de votre réponse sur le projet de licenciement, et",
        "    sur la personne à qui incombent les obligations de reclassement.",
        "",
        "DÉLAI SOUHAITÉ : [date] — avant toute décision sur le projet.",
      ]);

      L.push("5. CE QUE CETTE SAISINE COMMANDE EN ATTENDANT");
      L.push("");
      L.push("Ne décidez rien sur le projet avant d'avoir la note. Le point n'est pas");
      L.push("secondaire : si le co-emploi était retenu, ce ne serait pas une irrégularité");
      L.push("de procédure mais un changement de débiteur des obligations, et le");
      L.push("raisonnement de tout le dossier serait à refaire — périmètre du");
      L.push("reclassement compris.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("aucun article ne fonde ce document",
        ["CE DOCUMENT NE CITE AUCUN ARTICLE, ET C'EST VOLONTAIRE. Le contrôle",
         "CTL-COE-01 ne repose sur aucun texte : son champ « fondement » est vide.",
         "Le co-emploi est une construction jurisprudentielle, et l'application",
         "n'écrit pas ce qu'elle n'a pas lu. La formule reprise au préambule est",
         "celle du contrôle lui-même, telle que le module la porte — elle sert à",
         "poser la question, pas à y répondre.",
         "",
         "La note du professionnel, elle, citera ses sources : c'est son office,",
         "et c'est pour cela qu'on le saisit."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-TRF-01 — TRANSFERT D'ENTITÉ ET PROJET DE LICENCIEMENT
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-TRF-01", {
    nom: "Note de répartition et saisine sur l'articulation du transfert",
    detail: "L'opération, sa date, la répartition nominative des salariés entre " +
            "l'entité transférée et celle qui demeure, et la question au conseil.",
    produire: function (ctx) {
      var f = fic(ctx);
      var dn = f.dateNotification;
      var L = entete(ctx, "Note de répartition — transfert d'entité et projet de licenciement",
        "article L. 1224-1 du code du travail");

      L.push("LA RÈGLE, LUE À LA SOURCE");
      L.push("");
      L.push("« Lorsque survient une modification dans la situation juridique de");
      L.push("l'employeur, notamment par succession, vente, fusion, transformation du");
      L.push("fonds, mise en société de l'entreprise, tous les contrats de travail en");
      L.push("cours au jour de la modification subsistent entre le nouvel employeur et le");
      L.push("personnel de l'entreprise » (L. 1224-1).");
      L.push("");
      L.push("Trois mots commandent tout : « tous », « en cours », « subsistent ». Un");
      L.push("contrat en cours au jour de la modification passe au nouvel employeur — il");
      L.push("n'y a rien à faire pour cela, et rien à faire contre. C'est pourquoi la");
      L.push("répartition des salariés entre l'entité transférée et celle qui demeure");
      L.push("décide de leur sort, et pourquoi elle doit être écrite AVANT, sur un");
      L.push("critère, et non constatée après.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. L'OPÉRATION");
      L.push("");
      L.push("   Nature de l'opération : [cession de fonds, apport partiel d'actif, fusion,");
      L.push("   cession de titres, externalisation, reprise de marché — préciser]");
      L.push("   Cédant : " + nomDe(ctx));
      L.push("   Cessionnaire : [DÉNOMINATION, forme, siège]");
      L.push("   Date de la modification dans la situation juridique : [AAAA-MM-JJ]");
      L.push("   Acte qui la constate : [protocole, traité d'apport, acte de cession — daté]");
      L.push("");
      L.push("   Objet transféré, décrit pour ce qu'il est et non pour ce qu'on l'appelle :");
      L.push("   [activité, moyens d'exploitation corporels et incorporels, clientèle,");
      L.push("    personnel affecté, locaux, contrats repris]");
      L.push("");

      L.push("2. LA RÉPARTITION NOMINATIVE");
      L.push("");
      L.push("Une ligne par salarié. Aucune ligne sans critère, et le même critère pour");
      L.push("tous : un rattachement décidé salarié par salarié, sans règle énonçable, se");
      L.push("lit comme un choix de personnes.");
      L.push("");
      tableau(L, ["Salarié", "Emploi", "Affectation réelle", "Rattaché à", "Critère appliqué"], [
        ["[NOM]", "[emploi et classification]", "[service, site, activité]",
         "[entité transférée / entité qui demeure]", "[le critère, énoncé]"],
        ["[NOM]", "[…]", "[…]", "[…]", "[…]"],
        ["[NOM]", "[…]", "[…]", "[…]", "[…]"],
      ]);
      consigne(L, [
        "LE CRITÈRE DE RATTACHEMENT S'ÉCRIT UNE FOIS, EN TÊTE, ET S'APPLIQUE À TOUS :",
        "",
        "  [ÉCRIRE ICI LE CRITÈRE — par exemple l'affectation effective à l'activité",
        "   transférée à la date de [...], établie par [pièce]. Puis dire ce que",
        "   vous faites des cas mixtes : un salarié affecté pour partie aux deux",
        "   activités, un salarié détaché, un salarié dont le contrat est suspendu.]",
        "",
        "N'écrivez pas ici pourquoi tel salarié doit partir : ce n'est pas l'objet.",
        "L'objet est de dire où il travaille, et selon quelle règle.",
      ]);

      L.push("3. LES SALARIÉS DONT LE CONTRAT EST SUSPENDU");
      L.push("");
      L.push("Le texte vise « tous les contrats de travail EN COURS au jour de la");
      L.push("modification ». Un contrat suspendu — arrêt de travail, congé maternité,");
      L.push("congé parental, congé sabbatique — est un contrat en cours. Portez-les au");
      L.push("tableau du point 2 comme les autres, avec la mention de leur situation :");
      L.push("[LISTE NOMINATIVE, nature et dates de chaque suspension].");
      L.push("");

      L.push("4. CE QUE LE PROJET DE LICENCIEMENT DEVIENT");
      L.push("");
      if (dn) {
        L.push("   Date de notification portée au dossier : " + jour(dn, "date") + ".");
        L.push("   Confrontez-la à la date de la modification portée au point 1 : c'est de");
        L.push("   cette confrontation que dépend le sort de chaque lettre.");
      } else {
        L.push("   [Date de notification envisagée : à porter ici, puis à confronter à la");
        L.push("   date de la modification du point 1.]");
      }
      L.push("");
      nonRattrapable(L,
        "Un licenciement notifié à un salarié dont le contrat subsiste avec le nouvel\n" +
        "employeur ne se rattrape pas par une lettre rectificative.",
        ["L. 1224-1 fait subsister le contrat de plein droit : la subsistance n'est",
         "pas subordonnée à un acte de l'employeur, et elle ne se défait pas par un",
         "acte de l'employeur. C'est pourquoi la notification des salariés rattachés",
         "à l'entité transférée doit être DIFFÉRÉE jusqu'à la conclusion de l'examen",
         "demandé au point 5, et non conduite « sous réserve »."]);

      L.push("5. LA QUESTION POSÉE AU CONSEIL");
      L.push("");
      consigne(L, [
        "AU CONSEIL SAISI — avocat ou juriste en droit social :",
        "",
        "Au vu de l'opération décrite au point 1 et de la répartition du point 2 :",
        "",
        "  · l'opération emporte-t-elle modification dans la situation juridique de",
        "    l'employeur au sens de L. 1224-1 ?",
        "  · quels contrats subsistent avec le nouvel employeur, nominativement ?",
        "  · le critère de rattachement retenu est-il défendable, et sinon lequel ?",
        "  · quels licenciements du projet peuvent être notifiés, et lesquels ne le",
        "    peuvent pas ?",
        "  · à quelle date, au plus tôt, chacun peut-il l'être ?",
        "",
        "PIÈCES JOINTES : [l'acte de l'opération, la liste du personnel affecté, les",
        "contrats de travail des salariés concernés, l'inventaire des moyens",
        "transférés, le projet de licenciement en l'état].",
        "",
        "DÉLAI : avant toute notification.",
      ]);
      L.push("Ce document ne conclut jamais à la conformité : l'articulation d'un");
      L.push("transfert avec un projet de licenciement ne se décide pas sur une case du");
      L.push("questionnaire.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1224-1",
        ["L'article L. 1233-61, lu à la source, prévoit un cas particulier : lorsque",
         "le plan de sauvegarde de l'emploi comporte, en vue d'éviter la fermeture",
         "d'un ou plusieurs établissements, le transfert d'entités économiques",
         "nécessaire à la sauvegarde d'une partie des emplois, « les dispositions de",
         "l'article L. 1224-1 relatives au transfert des contrats de travail ne",
         "s'appliquent que dans la limite du nombre des emplois qui n'ont pas été",
         "supprimés à la suite des licenciements, à la date d'effet de ce",
         "transfert ». Si votre opération relève de ce cas, dites-le au conseil : le",
         "raisonnement n'est pas le même."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-APC-01 — LE REFUS D'UN ACCORD DE PERFORMANCE COLLECTIVE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-APC-01", {
    nom: "Note de qualification — licenciement consécutif au refus d'un accord de performance collective",
    detail: "Le relevé nominatif des refus, le retrait du projet économique et la " +
            "reprise des décomptes une fois ces salariés sortis.",
    produire: function (ctx) {
      var f = fic(ctx);
      var L = entete(ctx, "Note de qualification — refus d'un accord de performance collective",
        "article L. 2254-2 du code du travail");

      L.push("CE QUE CETTE NOTE CORRIGE");
      L.push("");
      L.push("Le licenciement du salarié qui refuse l'application d'un accord de");
      L.push("performance collective N'EST PAS un licenciement pour motif économique. Lui");
      L.push("appliquer le régime de L. 1233-3 — cause économique à démontrer, critères");
      L.push("d'ordre, plan de sauvegarde de l'emploi — est une erreur de qualification,");
      L.push("et cette erreur se propage : elle gonfle les décomptes de seuil, elle fait");
      L.push("entrer des salariés dans des catégories professionnelles où ils n'ont rien à");
      L.push("faire, et elle expose le projet entier.");
      L.push("");
      L.push("Cette note constate la qualification exacte, sort les salariés concernés du");
      L.push("projet économique, et refait les décomptes. C'est une correction, pas une");
      L.push("régularisation : il n'y a rien à rattraper, il y a à ne plus se tromper.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LE TEXTE, LU À LA SOURCE");
      L.push("");
      L.push("L'article L. 2254-2 organise l'accord de performance collective, qui peut");
      L.push("« aménager la durée du travail, ses modalités d'organisation et de");
      L.push("répartition », « aménager la rémunération au sens de l'article L. 3221-3");
      L.push("dans le respect des salaires minima hiérarchiques » et « déterminer les");
      L.push("conditions de la mobilité professionnelle ou géographique interne à");
      L.push("l'entreprise » (I).");
      L.push("");
      L.push("Ses stipulations « se substituent de plein droit aux clauses contraires et");
      L.push("incompatibles du contrat de travail ». Le salarié « peut refuser la");
      L.push("modification de son contrat de travail résultant de l'application de");
      L.push("l'accord » (III), et il dispose « d'un délai d'un mois pour faire connaître");
      L.push("son refus par écrit à l'employeur à compter de la date à laquelle ce dernier");
      L.push("a informé les salariés, par tout moyen conférant date certaine et précise,");
      L.push("de l'existence et du contenu de l'accord, ainsi que du droit de chacun d'eux");
      L.push("d'accepter ou de refuser l'application à son contrat de travail de cet");
      L.push("accord » (IV).");
      L.push("");
      L.push("Et c'est le V qui commande cette note : « L'employeur dispose d'un délai de");
      L.push("deux mois à compter de la notification du refus du salarié pour engager une");
      L.push("procédure de licenciement. Ce licenciement repose sur un motif spécifique");
      L.push("qui constitue une cause réelle et sérieuse. Ce licenciement est soumis aux");
      L.push("seules modalités et conditions définies aux articles L. 1232-2 à L. 1232-14");
      L.push("ainsi qu'aux articles L. 1234-1 à L. 1234-11, L. 1234-14, L. 1234-18,");
      L.push("L. 1234-19 et L. 1234-20. »");
      L.push("");
      L.push("« Aux SEULES modalités et conditions » : le mot exclut le reste.");
      L.push("");

      L.push("2. LES SALARIÉS CONCERNÉS");
      L.push("");
      var nAPC = nb(f.refusModification);
      L.push("   Un licenciement consécutif au refus d'un accord de performance");
      L.push("   collective est-il envisagé : " +
        (f.refusAPC === true ? "OUI, le dossier le déclare."
         : f.refusAPC === false ? "non, le dossier ne le déclare pas."
         : "[non renseigné au dossier — répondre ici]"));
      L.push("");
      L.push("Attention à ne pas confondre deux choses que le questionnaire distingue :");
      L.push("le refus d'un accord de performance collective (L. 2254-2) et le refus");
      L.push("d'une modification d'un élément essentiel du contrat proposée pour un motif");
      L.push("économique (L. 1233-25). Le second est un licenciement économique et se");
      L.push("compte dans les seuils ; le premier ne l'est pas et ne s'y compte pas.");
      if (nAPC !== null) {
        L.push("");
        L.push("   Refus de modification déclarés au dossier au titre de L. 1233-25 : " +
          nAPC + ". Vérifiez qu'aucun refus d'accord de performance collective");
        L.push("   n'a été rangé dans ce compte.");
      }
      L.push("");
      tableau(L, ["Salarié", "Emploi", "Date du refus", "Forme du refus", "Pièce"], [
        ["[NOM]", "[emploi]", "[AAAA-MM-JJ]", "[écrit — le texte l'exige]", "[cote]"],
        ["[NOM]", "[…]", "[…]", "[…]", "[…]"],
      ]);
      consigne(L, [
        "TROIS DATES À VÉRIFIER POUR CHAQUE LIGNE, ET ELLES SE PRENNENT SUR PIÈCE :",
        "",
        "  1. la date à laquelle vous avez informé les salariés de l'existence et du",
        "     contenu de l'accord et de leur droit de l'accepter ou de le refuser,",
        "     par un moyen conférant date certaine et précise (IV) — [AAAA-MM-JJ]",
        "     et [pièce : accusé de réception, remise contre décharge] ;",
        "  2. la date du refus écrit du salarié : le délai qui lui est ouvert est",
        "     d'un mois à compter de la date du 1. ;",
        "  3. la date à laquelle vous engagez la procédure de licenciement : le V",
        "     vous ouvre deux mois à compter de la notification du refus.",
        "",
        "Un refus qui n'est pas écrit n'est pas un refus au sens du IV. Une",
        "procédure engagée au-delà des deux mois du V n'est pas couverte par lui.",
      ]);

      L.push("3. CE QUI EST RETIRÉ DU PROJET ÉCONOMIQUE");
      L.push("");
      L.push("Pour les salariés du point 2, et pour eux seuls, ne s'appliquent NI la cause");
      L.push("économique de L. 1233-3, NI les critères d'ordre de L. 1233-5, NI le plan de");
      L.push("sauvegarde de l'emploi de L. 1233-61. Les développements du rapport d'audit");
      L.push("sur ces points ne leur sont pas applicables.");
      L.push("");
      L.push("   [Écrire ici, salarié par salarié, ce qui est retiré : catégorie");
      L.push("    professionnelle où il figurait, rang au classement, offres de");
      L.push("    reclassement qui lui ont été adressées à ce titre.]");
      L.push("");
      L.push("Leur licenciement se conduit selon le régime propre du V de L. 2254-2, qui");
      L.push("renvoie aux articles L. 1232-2 à L. 1232-14 et L. 1234-1 à L. 1234-11,");
      L.push("L. 1234-14, L. 1234-18, L. 1234-19 et L. 1234-20 — c'est-à-dire à");
      L.push("l'entretien préalable et au préavis du licenciement pour motif personnel.");
      L.push("L'APPLICATION N'A PAS LU CES ARTICLES : elle les nomme parce que L. 2254-2");
      L.push("les nomme, elle n'en reproduit pas le contenu et ne dit pas ce qu'ils");
      L.push("imposent. Reportez-vous au module « discipline et procédure de");
      L.push("licenciement » de cette application, ou au code du travail.");
      L.push("");
      L.push("Le VI de L. 2254-2, lu à la source, prévoit que le salarié « peut s'inscrire");
      L.push("et être accompagné comme demandeur d'emploi à l'issue du licenciement ».");
      L.push("");

      L.push("4. LES DÉCOMPTES À REFAIRE UNE FOIS CES SALARIÉS SORTIS");
      L.push("");
      var nl = nb(f.nbLicenciements);
      tableau(L, ["Décompte", "Au dossier", "Après retrait", "Conséquence"], [
        ["Licenciements économiques envisagés",
         nl !== null ? String(nl) : "[nombre]", "[nombre corrigé]",
         "[seuil de dix atteint ou non]"],
        ["Total sur la fenêtre de trente jours", "[nombre]", "[nombre corrigé]",
         "[régime applicable]"],
        ["Effectif des catégories professionnelles", "[par catégorie]", "[corrigé]",
         "[classement à refaire ou non]"],
        ["Postes supprimés", "[nombre]", "[corrigé]", "[démonstration à reprendre ou non]"],
      ]);
      L.push("Ce n'est pas une formalité : le seuil de dix commande la consultation");
      L.push("collective (L. 1233-28), la notification du projet à l'autorité");
      L.push("administrative (L. 1233-46) et, à cinquante salariés, le plan de sauvegarde");
      L.push("de l'emploi (L. 1233-61). Un décompte faux fait retenir le mauvais régime.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      return L.concat(pied("L. 2254-2, L. 1233-3, L. 1233-5, L. 1233-25, L. 1233-28, " +
        "L. 1233-46, L. 1233-61",
        ["Les articles L. 1232-2 à L. 1232-14, L. 1234-1 à L. 1234-11, L. 1234-14,",
         "L. 1234-18, L. 1234-19, L. 1234-20 et L. 3221-3, que le V et le I de",
         "L. 2254-2 nomment, n'ont pas été lus à la source par ce module : ils sont",
         "nommés, jamais reproduits.",
         "Aucune peine n'est annoncée par ce document : le corpus de textes de ce",
         "module ne contient aucun article de sanction pénale."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-CCN-01 — LE BORDEREAU DE VERSEMENT DES NORMES CONVENTIONNELLES
     ══════════════════════════════════════════════════════════════════════ */

  /* L'application ne connaît PAS le texte de la convention du client. Ces trois
     documents organisent le RELEVÉ de ses stipulations ; ils n'en affirment
     aucune, et ils le disent à chaque rubrique. */

  DP.ajouter("CTL-CCN-01", {
    nom: "Bordereau de versement de la convention collective et des accords",
    detail: "Ce qu'il faut verser, ce que chaque texte doit établir, et le relevé " +
            "des stipulations à renseigner — l'application ne lit pas votre convention.",
    produire: function (ctx) {
      var f = fic(ctx);
      var p = pro(ctx);
      var idcc = f.idcc || p.conventionCollective;
      var conv = f.convention || {};
      var acc = f.accords || {};
      var L = entete(ctx, "Bordereau de versement — convention collective et accords d'entreprise",
        "articles L. 1233-5 et L. 1233-39 du code du travail");

      L.push("POURQUOI CE BORDEREAU, ET CE QUE L'APPLICATION NE SAIT PAS");
      L.push("");
      L.push("L'APPLICATION NE CONNAÎT PAS LE TEXTE DE VOTRE CONVENTION COLLECTIVE. Elle");
      L.push("ne le connaîtra pas davantage après ce document : ce qu'elle organise ici,");
      L.push("c'est le RELEVÉ de vos stipulations, par vous, sur le texte que vous");
      L.push("appliquez. Aucune ligne de ce bordereau n'affirme ce que votre convention");
      L.push("dit. Chacune demande où c'est écrit.");
      L.push("");
      L.push("Le motif est dans deux textes lus à la source, et ils commandent tout :");
      L.push("");
      L.push("· L. 1233-5 : « Lorsque l'employeur procède à un licenciement collectif pour");
      L.push("  motif économique ET EN L'ABSENCE DE CONVENTION OU ACCORD COLLECTIF DE");
      L.push("  TRAVAIL APPLICABLE, il définit les critères retenus pour fixer l'ordre des");
      L.push("  licenciements, après consultation du comité social et économique. » La");
      L.push("  définition des critères par l'employeur n'est donc que le régime");
      L.push("  supplétif : s'il existe une convention ou un accord applicable, c'est lui");
      L.push("  qui gouverne, et l'audit qui l'ignore raisonne à côté.");
      L.push("");
      L.push("· L. 1233-39 : la lettre de notification ne peut être adressée avant");
      L.push("  l'expiration d'un délai courant depuis la notification du projet à");
      L.push("  l'autorité administrative, délai « qui ne peut être inférieur à trente");
      L.push("  jours » ; et « une convention ou un accord collectif de travail peut");
      L.push("  prévoir des délais plus favorables aux salariés ».");
      L.push("");
      L.push("Tant que ces textes ne sont pas versés, l'audit applique la loi seule.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. CE QUE LE DOSSIER DÉCLARE AUJOURD'HUI");
      L.push("");
      tableau(L, ["Élément", "Au dossier"], [
        ["Convention collective (IDCC)", idcc ? String(idcc) : "[IDCC — quatre chiffres]"],
        ["Intitulé de la convention", cro(p.conventionCollective, "intitulé exact")],
        ["Convention versée comme pièce",
         f.conventionJointe === true ? "oui" : f.conventionJointe === false ? "NON" : "[non renseigné]"],
        ["Accords d'entreprise versés",
         f.accordsJoints === true ? "oui" : f.accordsJoints === false ? "NON" : "[non renseigné]"],
        ["Convention déclarée à jour", cro(f.conventionAJour, "non renseigné")],
        ["Avenants récents signalés", cro(f.avenantsRecents, "non renseigné")],
      ]);

      L.push("2. LES TEXTES À VERSER, ET CE QUE CHACUN DOIT ÉTABLIR");
      L.push("");
      tableau(L, ["Texte à verser", "Versé ?", "Ce qu'il doit établir"], [
        ["Convention collective, texte intégral à jour de ses avenants",
         f.conventionJointe === true ? "oui" : "[ ]",
         "les stipulations applicables à ce licenciement, et leur date d'effet"],
        ["Accord de méthode",
         acc.methode === true ? "déclaré" : acc.methode === false ? "néant déclaré" : "[ ]",
         "les modalités d'information et de consultation retenues, et ce qu'elles changent à la loi"],
        ["Accord portant plan de sauvegarde de l'emploi",
         acc.pse === true ? "déclaré" : acc.pse === false ? "néant déclaré" : "[ ]",
         "le contenu du plan et les modalités de mise en œuvre des licenciements"],
        ["Accord fixant le périmètre des critères d'ordre",
         "[ ]",
         "que le périmètre appliqué a bien été fixé par accord, et lequel"],
        ["Accord de performance collective",
         acc.apc === true ? "déclaré" : acc.apc === false ? "néant déclaré" : "[ ]",
         "son champ, sa date, et l'information donnée aux salariés"],
        ["Accord de gestion des emplois et des parcours professionnels",
         acc.gepp === true ? "déclaré" : acc.gepp === false ? "néant déclaré" : "[ ]",
         "les engagements pris qui pèsent sur le projet"],
      ]);
      L.push("Chaque texte s'enregistre comme une PIÈCE DATÉE, avec son auteur et sa");
      L.push("version — un texte versé sans date ne peut être rapporté à aucune étape de");
      L.push("la procédure, et ne prouve donc rien (voir CTL-PCE-01).");
      L.push("");

      L.push("3. LE RELEVÉ DES STIPULATIONS — À REMPLIR SUR LE TEXTE, PAS DE MÉMOIRE");
      L.push("");
      L.push("Une ligne par question. La colonne « Article » est la plus importante : une");
      L.push("stipulation dont on ne peut pas dire où elle est écrite ne s'oppose à");
      L.push("personne.");
      L.push("");
      tableau(L, ["Question", "Stipulation ?", "Article / page", "Ce qu'elle prévoit"], [
        ["Critères d'ordre des licenciements (L. 1233-5)",
         conv.criteresOrdre === true ? "déclarée" : conv.criteresOrdre === false ? "néant déclaré" : "[oui/non]",
         "[art. …]", "[texte de la stipulation, résumé fidèlement]"],
        ["Périmètre d'application des critères d'ordre", "[oui/non]", "[art. …]", "[…]"],
        ["Délai de notification plus favorable (L. 1233-39)", "[oui/non]", "[art. …]", "[…]"],
        ["Préavis plus favorable",
         conv.preavisPlusFavorable === true ? "déclarée" : conv.preavisPlusFavorable === false ? "néant déclaré" : "[oui/non]",
         "[art. …]", "[…]"],
        ["Indemnité de licenciement plus favorable",
         conv.indemnitePlusFavorable === true ? "déclarée" : conv.indemnitePlusFavorable === false ? "néant déclaré" : "[oui/non]",
         "[art. …]", "[…]"],
        ["Priorité de réembauche aménagée", "[oui/non]", "[art. …]", "[…]"],
        ["Procédure conventionnelle préalable", "[oui/non]", "[art. …]", "[…]"],
        ["Commission paritaire à saisir", "[oui/non]", "[art. …]", "[…]"],
        ["Reclassement : obligations propres", "[oui/non]", "[art. …]", "[…]"],
      ]);
      consigne(L, [
        "LA COLONNE « Stipulation ? » NE SE REMPLIT PAS DE MÉMOIRE.",
        "",
        "Les mentions « déclarée » et « néant déclaré » ci-dessus reprennent les",
        "réponses portées au questionnaire. Ce sont des DÉCLARATIONS, pas des",
        "lectures : elles doivent être confirmées article en main, et la colonne",
        "« Article / page » est là pour cela.",
        "",
        "Une case cochée sans référence d'article est un souvenir. Un souvenir ne",
        "se plaide pas.",
      ]);

      L.push("4. CE QUI SE PASSE ENSUITE");
      L.push("");
      L.push("Une fois les textes versés et le relevé rempli, RELANCEZ L'AUDIT : les");
      L.push("règles conventionnelles seront confrontées aux règles légales, et le");
      L.push("rapport cessera de raisonner sur la loi seule. Le tableau de confrontation");
      L.push("proprement dit est le document du point de contrôle CTL-CCN-03.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Relevé établi par : [NOM ET QUALITÉ — celui qui a lu le texte]");
      L.push("Date de la lecture : [AAAA-MM-JJ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-5, L. 1233-39",
        ["AUCUNE STIPULATION CONVENTIONNELLE N'EST REPRODUITE NI RÉSUMÉE DANS CE",
         "DOCUMENT. L'application ne lit pas la convention collective du client :",
         "elle ne peut donc ni la citer, ni dire ce qu'elle contient, ni affirmer",
         "qu'elle est muette. Tout ce qui la concerne est à renseigner, texte en",
         "main, par celui qui l'applique."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-CCN-02 — L'IDENTIFICATION ET LA VERSION DU TEXTE VERSÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-CCN-02", {
    nom: "Relevé d'identification de la convention versée — IDCC, version, avenants",
    detail: "Le rapprochement de l'IDCC déclaré et de l'intitulé versé, la version " +
            "appliquée, l'écart avec le dernier texte publié et son explication écrite.",
    produire: function (ctx) {
      var f = fic(ctx);
      var p = pro(ctx);
      var idcc = f.idcc || p.conventionCollective;
      var pc = pieces(ctx).find(function (x) {
        return x && (x.code === "convention" || x.code === "conventionJointe");
      }) || null;
      var veille = (f.veille && f.veille.convention) || {};
      var L = entete(ctx, "Relevé d'identification de la convention collective versée", null);

      L.push("CE QUE CE RELEVÉ ÉTABLIT");
      L.push("");
      L.push("Qu'une convention soit versée ne dit pas que c'est LA BONNE, ni que c'est la");
      L.push("BONNE VERSION. Ce sont deux questions distinctes, et ce relevé les sépare :");
      L.push("");
      L.push("  · l'intitulé du texte versé correspond-il à l'IDCC déclaré ?");
      L.push("  · la version versée est-elle celle que l'entreprise applique à la date");
      L.push("    utile, ou une version dépassée ?");
      L.push("");
      L.push("L'enjeu n'est pas documentaire. Une convention versée dans une version");
      L.push("dépassée conduit à appliquer des stipulations abrogées sur les critères");
      L.push("d'ordre, sur les délais ou sur l'indemnité — et l'audit conclut alors sur un");
      L.push("texte que l'entreprise n'applique pas.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LE RAPPROCHEMENT");
      L.push("");
      tableau(L, ["Élément", "Au dossier", "À vérifier sur le texte"], [
        ["IDCC déclaré", idcc ? String(idcc) : "[IDCC]", "[le numéro porté sur le texte lui-même]"],
        ["Intitulé déclaré", cro(p.conventionCollective, "intitulé"), "[l'intitulé exact du texte versé]"],
        ["Fichier versé", cro(pc && pc.fichier, "nom du fichier"), "[qu'il s'agit bien du texte intégral]"],
        ["Date de la pièce", pc && pc.date ? jour(pc.date, "date") : "[date]", "[la date de la version consolidée]"],
        ["Version portée", cro(pc && pc.version, "version"), "[le numéro ou la date de consolidation]"],
        ["Auteur / source", cro(pc && pc.auteur, "source"), "[Légifrance, fonds KALI, éditeur…]"],
        ["Période couverte", cro(pc && pc.periode, "période"), "[à partir de quelle date elle s'applique]"],
      ]);
      if (!pc) {
        consigne(L, [
          "AUCUNE CONVENTION N'EST ENREGISTRÉE COMME PIÈCE DATÉE.",
          "",
          "Un IDCC déclaré n'est pas une convention versée. L'application peut",
          "identifier une convention par son IDCC, mais rien n'établit alors que",
          "c'est celle que vous appliquez, ni dans quelle version.",
          "",
          "Versez le texte intégral, avec sa date, sa source et sa version, puis",
          "revenez à ce relevé.",
        ]);
      }

      L.push("2. LA VERSION, ET L'ÉCART S'IL Y EN A UN");
      L.push("");
      L.push("   Version versée : " + cro(pc && pc.version, "version du texte versé"));
      L.push("   Dernier texte publié signalé par la veille : " +
        cro(veille.dernier, "non renseigné — à relever sur Légifrance"));
      L.push("   Convention déclarée à jour : " + cro(f.conventionAJour, "non renseigné"));
      L.push("   Avenants récents signalés : " + cro(f.avenantsRecents, "non renseigné"));
      L.push("");
      var ecartVersion = pc && pc.version && veille.dernier &&
        String(veille.dernier).indexOf(String(pc.version)) === -1;
      if (ecartVersion) {
        L.push("   ÉCART CONSTATÉ entre la version versée et le dernier texte publié.");
        L.push("   Il doit être expliqué ci-dessous : sans explication, l'audit repose sur");
        L.push("   un texte dont rien ne dit qu'il est celui de l'entreprise.");
      } else {
        L.push("   [Si les deux lignes ci-dessus diffèrent, l'écart doit être expliqué");
        L.push("    ci-dessous. S'il n'y a pas d'écart, écrivez-le et datez le constat.]");
      }
      L.push("");
      consigne(L, [
        "L'EXPLICATION DE L'ÉCART — trois causes possibles, et une seule est la vôtre :",
        "",
        "  [ ] l'avenant est publié mais n'est pas encore applicable à l'entreprise",
        "      — préciser à quelle date il le devient, et sur quel fondement ;",
        "  [ ] l'avenant n'est pas encore étendu ou publié à la date utile",
        "      — préciser la date utile retenue et pourquoi ;",
        "  [ ] erreur de version : le mauvais fichier a été versé",
        "      — remplacer le texte et réenregistrer la pièce avec sa vraie date.",
        "",
        "  Explication retenue : [ÉCRIRE ICI, en une phrase, datée et signée]",
      ]);

      L.push("3. LA DATE À LAQUELLE LA VERSION S'APPRÉCIE");
      L.push("");
      var dn = f.dateNotification;
      L.push("   Date de notification portée au dossier : " + jour(dn, "DATE DE NOTIFICATION"));
      L.push("");
      L.push("C'est autour de cette date que se joue la question, comme pour la loi");
      L.push("elle-même : une stipulation abrogée avant elle ne s'applique pas, une");
      L.push("stipulation entrée en vigueur après elle non plus. Portez ici, pour chaque");
      L.push("stipulation que vous invoquez, la date à laquelle elle est entrée en");
      L.push("vigueur : [tableau à remplir si plusieurs versions se succèdent sur la");
      L.push("période de la procédure].");
      L.push("");

      L.push("4. LA CONCLUSION DU RELEVÉ");
      L.push("");
      L.push("   [ ] Le texte versé est celui de l'IDCC " +
        (idcc ? String(idcc) : "[IDCC]") + ", dans la version applicable au");
      L.push("       " + jour(dn, "date utile") + ". L'audit peut s'y appuyer.");
      L.push("   [ ] Le texte versé doit être remplacé. Version à verser : [référence].");
      L.push("   [ ] L'IDCC déclaré est erroné. IDCC exact : [numéro], intitulé : [texte].");
      L.push("       Dans ce cas, TOUT le relevé de stipulations (CTL-CCN-01) est à");
      L.push("       reprendre : ce n'est pas la même convention.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Relevé établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("aucun article ne fonde ce relevé",
        ["CE DOCUMENT NE CITE AUCUN ARTICLE, ET C'EST EXACT : le contrôle CTL-CCN-02",
         "n'a pas de fondement textuel — il vérifie que la pièce versée est bien",
         "celle qu'elle prétend être, ce qu'aucun article n'a besoin de dire.",
         "",
         "L'APPLICATION NE LIT PAS VOTRE CONVENTION. Elle ne peut donc ni confirmer",
         "ni infirmer une stipulation : tout ce qui figure ici est à établir sur le",
         "texte, par celui qui l'applique.",
         "La date de notification, qui commande la version applicable de la loi",
         "(CTL-TMP-01), commande de la même manière celle du texte conventionnel."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-CCN-03 — LA CONFRONTATION DES ACCORDS AUX RÈGLES LÉGALES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-CCN-03", {
    nom: "Tableau de confrontation des accords versés aux règles légales",
    detail: "Matière par matière : ce que la loi dit, ce que l'accord en fait, ce " +
            "qu'il laisse à la loi — et l'enregistrement de la lecture.",
    produire: function (ctx) {
      var f = fic(ctx);
      var acc = f.accords || {};
      var lus = pieces(ctx).filter(function (x) {
        return x && x.code && /accord/i.test(String(x.code));
      });
      var L = entete(ctx, "Tableau de confrontation — accords d'entreprise et règles légales",
        "articles L. 1233-21, L. 1233-24-1 et L. 2254-2 du code du travail");

      L.push("CE QUE CE TABLEAU FAIT");
      L.push("");
      L.push("Un accord déposé au dossier mais non lu n'a été articulé avec rien. Il ne");
      L.push("sert pas de bouclier : il sert d'aveu, parce qu'il établit que l'employeur");
      L.push("avait entre les mains la règle qu'il n'a pas appliquée.");
      L.push("");
      L.push("Ce tableau confronte, matière par matière, ce que dit la loi et ce que");
      L.push("l'accord en fait. Il ne se remplit qu'accord en main. Comme partout ici,");
      L.push("l'application ne connaît pas le texte de vos accords : la colonne « ce que");
      L.push("la loi dit » est écrite, lue à la source ; les deux autres sont à vous.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES ACCORDS VERSÉS, ET LEUR ÉTAT DE LECTURE");
      L.push("");
      if (lus.length) {
        tableau(L, ["Code", "Fichier", "Date", "Lu ?", "Lecteur / date de lecture"],
          lus.map(function (x) {
            return [cro(x.code, "code"), cro(x.fichier, "fichier"),
                    x.date ? jour(x.date, "date") : "[date]",
                    x.lue === true ? "oui" : "NON",
                    x.lue === true ? "[nom du lecteur, date]" : "[à faire]"];
          }));
      } else {
        tableau(L, ["Accord", "Fichier", "Date de signature", "Date de dépôt", "Lu ?"], [
          ["[nature de l'accord]", "[fichier]", "[AAAA-MM-JJ]", "[AAAA-MM-JJ]", "[ ]"],
          ["[…]", "[…]", "[…]", "[…]", "[ ]"],
        ]);
      }
      L.push("   Accords déclarés versés au questionnaire : " +
        (f.accordsJoints === true ? "oui" : f.accordsJoints === false ? "NON" : "[non renseigné]"));
      L.push("   Nature des accords déclarés : " +
        (["methode", "pse", "apc", "gepp"].filter(function (k) { return acc[k] === true; })
          .map(function (k) {
            return { methode: "accord de méthode", pse: "accord portant plan de sauvegarde de l'emploi",
                     apc: "accord de performance collective",
                     gepp: "gestion des emplois et des parcours professionnels" }[k];
          }).join(", ") || "[aucun déclaré — à renseigner]"));
      L.push("");
      L.push("« Déclaré » n'est pas « versé », et « versé » n'est pas « lu ». Les trois");
      L.push("états sont distincts, et seul le troisième permet de remplir le tableau du");
      L.push("point 2.");
      L.push("");

      L.push("2. LA CONFRONTATION, MATIÈRE PAR MATIÈRE");
      L.push("");
      L.push("MATIÈRE 1 — MODALITÉS D'INFORMATION ET DE CONSULTATION DU COMITÉ");
      L.push("");
      L.push("Ce que la loi dit, lu à la source : « Un accord d'entreprise, de groupe ou");
      L.push("de branche peut fixer, par dérogation aux règles de consultation des");
      L.push("instances représentatives du personnel prévues par le présent titre et par");
      L.push("le livre III de la deuxième partie, les modalités d'information et de");
      L.push("consultation du comité social et économique et, le cas échéant, le cadre de");
      L.push("recours à une expertise par ce comité lorsque l'employeur envisage de");
      L.push("prononcer le licenciement économique d'au moins dix salariés dans une même");
      L.push("période de trente jours » (L. 1233-21).");
      L.push("");
      tableau(L, ["Point", "Ce que l'accord prévoit", "Article de l'accord", "Ce qu'il laisse à la loi"], [
        ["Nombre de réunions", "[…]", "[art. …]", "[…]"],
        ["Délai entre les réunions", "[…]", "[art. …]", "[…]"],
        ["Délai d'avis du comité", "[…]", "[art. …]", "[…]"],
        ["Cadre du recours à l'expert", "[…]", "[art. …]", "[…]"],
        ["Documents remis, et quand", "[…]", "[art. …]", "[…]"],
      ]);

      L.push("MATIÈRE 2 — CONTENU DU PLAN ET MISE EN ŒUVRE DES LICENCIEMENTS");
      L.push("");
      L.push("Ce que la loi dit, lu à la source : « Dans les entreprises de cinquante");
      L.push("salariés et plus, un accord collectif peut déterminer le contenu du plan de");
      L.push("sauvegarde de l'emploi mentionné aux articles L. 1233-61 à L. 1233-63 ainsi");
      L.push("que les modalités de consultation du comité social et économique et de mise");
      L.push("en œuvre des licenciements » (L. 1233-24-1). Le même article exige que cet");
      L.push("accord soit « signé par une ou plusieurs organisations syndicales");
      L.push("représentatives ayant recueilli au moins 50 % des suffrages exprimés en");
      L.push("faveur d'organisations reconnues représentatives au premier tour des");
      L.push("dernières élections des titulaires au comité social et économique, quel que");
      L.push("soit le nombre de votants, ou par le conseil d'entreprise ».");
      L.push("");
      L.push("L'article L. 1233-24-2, lu à la source, énumère ce que cet accord peut");
      L.push("porter, outre le contenu du plan : « 1° Les modalités d'information et de");
      L.push("consultation du comité social et économique […] ; 2° La pondération et le");
      L.push("périmètre d'application des critères d'ordre des licenciements mentionnés à");
      L.push("l'article L. 1233-5 ; 3° Le calendrier des licenciements ; 4° Le nombre de");
      L.push("suppressions d'emploi et les catégories professionnelles concernées ;");
      L.push("5° Les modalités de mise en œuvre des mesures de formation, d'adaptation et");
      L.push("de reclassement prévues à l'article L. 1233-4. »");
      L.push("");
      tableau(L, ["Point de L. 1233-24-2", "Traité par l'accord ?", "Article", "Ce qu'il prévoit"], [
        ["Contenu du plan (L. 1233-61 à L. 1233-63)", "[oui/non]", "[art. …]", "[…]"],
        ["1° Information et consultation du comité", "[oui/non]", "[art. …]", "[…]"],
        ["2° Pondération et périmètre des critères d'ordre", "[oui/non]", "[art. …]", "[…]"],
        ["3° Calendrier des licenciements", "[oui/non]", "[art. …]", "[…]"],
        ["4° Nombre de suppressions et catégories", "[oui/non]", "[art. …]", "[…]"],
        ["5° Formation, adaptation, reclassement (L. 1233-4)", "[oui/non]", "[art. …]", "[…]"],
        ["Suffrages recueillis par les signataires", "[…] %", "[préambule]", "[≥ 50 % exigés]"],
      ]);
      L.push("Ce tableau n'est pas une commodité : « en cas d'accord ne portant pas sur");
      L.push("l'ensemble des points mentionnés aux 1° à 5° de l'article L. 1233-24-2 »,");
      L.push("l'autorité administrative homologue le document unilatéral de l'employeur");
      L.push("(L. 1233-57-3). Savoir ce que l'accord couvre, c'est savoir si l'on est en");
      L.push("validation ou en homologation.");
      L.push("");

      L.push("MATIÈRE 3 — L'ACCORD DE PERFORMANCE COLLECTIVE");
      L.push("");
      L.push("Ce que la loi dit, lu à la source : l'article L. 2254-2 permet à un accord");
      L.push("de performance collective d'« aménager la durée du travail, ses modalités");
      L.push("d'organisation et de répartition », d'« aménager la rémunération » et de");
      L.push("« déterminer les conditions de la mobilité professionnelle ou géographique");
      L.push("interne à l'entreprise » (I). Le salarié peut refuser la modification de son");
      L.push("contrat qui en résulte (III), dans le délai d'un mois du IV ; le");
      L.push("licenciement qui suit ce refus « repose sur un motif spécifique qui");
      L.push("constitue une cause réelle et sérieuse » (V) — il n'est donc pas économique.");
      L.push("");
      tableau(L, ["Point", "Ce que l'accord prévoit", "Article", "Conséquence sur le projet"], [
        ["Champ de l'accord", "[durée / rémunération / mobilité]", "[art. …]", "[…]"],
        ["Date d'information des salariés", "[AAAA-MM-JJ]", "[pièce]", "[point de départ du mois]"],
        ["Salariés ayant refusé", "[nombre et noms]", "[refus écrits]", "[à sortir du projet économique]"],
        ["Efforts des dirigeants et mandataires (II, 2°)", "[oui/non]", "[art. …]", "[…]"],
      ]);
      L.push("Si des salariés ont refusé, le document du point de contrôle CTL-APC-01");
      L.push("organise leur retrait du projet économique et la reprise des décomptes.");
      L.push("");

      L.push("3. CE QUE LA CONFRONTATION A CHANGÉ");
      L.push("");
      consigne(L, [
        "À ÉCRIRE UNE FOIS LE TABLEAU REMPLI, EN CLAIR ET EN UNE PAGE AU PLUS :",
        "",
        "  · [ce que l'accord modifie par rapport à la loi, point par point]",
        "  · [ce qu'il laisse entièrement à la loi]",
        "  · [ce qui, dans le calendrier déjà suivi, doit être corrigé en conséquence]",
        "  · [ce qui, dans le rapport d'audit, est à relire à la lumière de l'accord]",
        "",
        "Sans ce paragraphe, le tableau reste un inventaire. C'est ici qu'il devient",
        "une décision.",
      ]);

      L.push("4. L'ENREGISTREMENT DE LA LECTURE");
      L.push("");
      tableau(L, ["Accord", "Lu le", "Par", "Écarts relevés avec le dossier"], [
        ["[nature de l'accord]", "[AAAA-MM-JJ]", "[nom et qualité]", "[écarts, ou « aucun »]"],
        ["[…]", "[…]", "[…]", "[…]"],
      ]);
      L.push("Marquez ensuite chaque accord comme lu dans le dossier d'audit, puis");
      L.push("relancez-le : c'est cette marque que le contrôle CTL-CCN-03 vérifie.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-21, L. 1233-24-1, L. 1233-24-2, L. 1233-57-3, L. 2254-2",
        ["AUCUNE STIPULATION DE VOS ACCORDS N'EST REPRODUITE ICI. Seules les",
         "colonnes « ce que la loi dit » sont écrites par l'application, à partir des",
         "textes lus à la source. Tout le reste est à établir, accord en main.",
         "Parmi les articles que ces textes nomment, L. 1233-4, L. 1233-5 et",
         "L. 1233-61 à L. 1233-63 ont été lus à la source par ce module ; L. 2321-9",
         "et L. 3221-3 ne l'ont pas été : ils sont nommés, et leur contenu n'est ni",
         "reproduit ni résumé."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-USA-01 — LE CONSTAT DES USAGES ET ENGAGEMENTS UNILATÉRAUX
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-USA-01", {
    nom: "Constat d'usage d'entreprise et recensement des engagements unilatéraux",
    detail: "Une fiche par usage : son objet, sa date d'apparition, les salariés " +
            "qu'il vise, la pièce qui l'établit — et ce qu'il change au projet.",
    produire: function (ctx) {
      var f = fic(ctx);
      var L = entete(ctx, "Constat d'usage d'entreprise et engagements unilatéraux", null);

      L.push("POURQUOI CE RECENSEMENT, ET POURQUOI L'APPLICATION NE PEUT PAS LE FAIRE");
      L.push("");
      L.push("Les usages d'entreprise, les engagements unilatéraux et les décisions");
      L.push("unilatérales de l'employeur NE FIGURENT DANS AUCUNE BASE PUBLIQUE. Ils ne");
      L.push("sont ni publiés, ni déposés, ni recensés nulle part : l'application ne peut");
      L.push("pas les connaître, et elle ne les devinera pas.");
      L.push("");
      L.push("Ils priment pourtant lorsqu'ils sont plus favorables. Les ignorer, c'est");
      L.push("appliquer aux salariés un régime moins favorable que celui auquel ils ont");
      L.push("droit — et le découvrir au procès, quand un salarié produira le bulletin de");
      L.push("paie de son collègue de l'an dernier.");
      L.push("");
      L.push("Ce document ne dit donc pas ce que vos usages sont. Il organise leur");
      L.push("recensement, usage par usage, et il exige pour chacun la pièce qui");
      L.push("l'établit. Une fois rempli, il se verse au dossier et s'examine avec la");
      L.push("convention et les accords.");
      L.push("");
      L.push("   Ce que le dossier déclare aujourd'hui : " +
        (vide(f.usagesEtEngagements)
          ? "[rien n'est renseigné — c'est ce que ce document sert à corriger]"
          : String(f.usagesEtEngagements)));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. À QUI POSER LA QUESTION, ET COMMENT");
      L.push("");
      L.push("Un usage ne se trouve pas dans un classeur : il se trouve dans la mémoire");
      L.push("de ceux qui l'appliquent. Interrogez, par écrit et en datant la demande :");
      L.push("");
      L.push("  · la direction des ressources humaines — pratiques de paie, de préavis,");
      L.push("    d'indemnisation, de priorité de réembauche ;");
      L.push("  · les responsables de service anciens dans l'entreprise ;");
      L.push("  · les représentants du personnel — ce sont eux qui invoqueront l'usage,");
      L.push("    autant savoir maintenant lequel ;");
      L.push("  · le service de la paie — un usage laisse presque toujours une trace");
      L.push("    dans les bulletins, même quand personne ne s'en souvient.");
      L.push("");
      L.push("   Date de la demande écrite : [AAAA-MM-JJ]   Destinataires : [liste]");
      L.push("   Réponses reçues : [dates] — conservez-les, elles datent le recensement.");
      L.push("");

      L.push("2. LE RECENSEMENT — UNE LIGNE PAR USAGE");
      L.push("");
      tableau(L, ["Objet de l'usage", "Depuis quand", "Qui il vise",
                  "Ce qu'il donne de plus que la loi ou la convention", "Pièce"], [
        ["[prime de …]", "[année]", "[catégorie, service]", "[l'avantage, chiffré]", "[cote]"],
        ["[indemnité de …]", "[…]", "[…]", "[…]", "[…]"],
        ["[préavis allongé]", "[…]", "[…]", "[…]", "[…]"],
        ["[priorité de réembauche élargie]", "[…]", "[…]", "[…]", "[…]"],
        ["[…]", "[…]", "[…]", "[…]", "[…]"],
      ]);
      L.push("Les matières où un usage pèse sur un licenciement économique, et qu'il faut");
      L.push("donc balayer une par une :");
      L.push("  · l'indemnité de licenciement — montant, base de calcul, ancienneté prise");
      L.push("    en compte ;");
      L.push("  · le préavis — durée, dispense, indemnité compensatrice ;");
      L.push("  · les primes et gratifications, et leur sort à la rupture ;");
      L.push("  · la priorité de réembauche — durée, portée, modalités d'information ;");
      L.push("  · les mesures d'accompagnement pratiquées lors de restructurations");
      L.push("    précédentes : c'est l'usage le plus souvent invoqué, et le moins écrit ;");
      L.push("  · les critères d'ordre pratiqués antérieurement ;");
      L.push("  · le reclassement — périmètre, délais, aide à la mobilité.");
      L.push("");

      L.push("3. LES PIÈCES, ET CE QUE CHACUNE DOIT ÉTABLIR");
      L.push("");
      L.push("Un usage se prouve par sa répétition, sa constance et sa généralité. Les");
      L.push("pièces doivent donc porter sur PLUSIEURS occurrences, et non sur une.");
      L.push("");
      tableau(L, ["Pièce", "Ce qu'elle doit établir"], [
        ["[Notes de service]", "l'existence de la pratique et sa date d'apparition"],
        ["[Courriers et courriels d'annonce]", "que l'avantage a été annoncé, à qui, et en quels termes"],
        ["[Procès-verbaux du comité]", "que la pratique était connue et discutée"],
        ["[Bulletins de paie de plusieurs années]", "la répétition et la constance de l'avantage"],
        ["[Soldes de tout compte antérieurs]", "ce qui a été effectivement versé lors de ruptures précédentes"],
        ["[Dossiers de restructurations passées]", "les mesures réellement pratiquées, et à qui"],
      ]);
      consigne(L, [
        "POUR CHAQUE USAGE RECENSÉ, ÉCRIVEZ LES TROIS CARACTÈRES, OU DITES QU'ILS",
        "MANQUENT :",
        "",
        "  · RÉPÉTITION — combien de fois, sur quelle période, avec quelles pièces ;",
        "  · CONSTANCE — les mêmes conditions à chaque fois, ou non ;",
        "  · GÉNÉRALITÉ — tout le personnel, une catégorie, ou des cas isolés.",
        "",
        "Un avantage accordé une fois à une personne n'est pas un usage. Un avantage",
        "accordé chaque année à toute une catégorie en est probablement un.",
        "L'application ne tranche pas : elle demande que ce soit écrit.",
      ]);

      L.push("4. LES ENGAGEMENTS UNILATÉRAUX ÉCRITS");
      L.push("");
      L.push("Ils sont plus faciles à trouver et plus difficiles à discuter : ils sont");
      L.push("écrits. Recensez-les à part.");
      L.push("");
      tableau(L, ["Engagement", "Support", "Date", "Portée", "Toujours en vigueur ?"], [
        ["[objet]", "[note de service, courrier, PV]", "[AAAA-MM-JJ]", "[qui il vise]", "[oui/non — et si non, comment il a pris fin]"],
        ["[…]", "[…]", "[…]", "[…]", "[…]"],
      ]);

      L.push("5. CE QUE LE RECENSEMENT CHANGE AU PROJET");
      L.push("");
      consigne(L, [
        "À ÉCRIRE, USAGE PAR USAGE :",
        "",
        "  · [ce que cet usage impose de plus dans ce licenciement]",
        "  · [ce qu'il coûte, chiffré, pour l'ensemble des salariés concernés]",
        "  · [s'il est maintenu, dénoncé, ou intégré aux mesures du projet]",
        "",
        "L'ARTICULATION D'UN USAGE AVEC LA LOI ET LA CONVENTION EXCÈDE CE QUE CETTE",
        "APPLICATION PEUT FAIRE. Ce constat, une fois rempli, se transmet au conseil",
        "de l'entreprise avec la convention et les accords : c'est lui qui dira ce",
        "qui prime et ce qui cède.",
      ]);
      L.push("Ce document ne conclut jamais à la conformité.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Recensement établi par : [NOM ET QUALITÉ]");
      L.push("Personnes interrogées : [liste et dates]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("aucun article ne fonde ce constat",
        ["CE DOCUMENT NE CITE AUCUN ARTICLE, ET C'EST VOLONTAIRE. Le contrôle",
         "CTL-USA-01 n'a pas de fondement textuel : les usages et engagements",
         "unilatéraux ne sont définis par aucun article du code du travail lu par ce",
         "module. Écrire ici une règle sur leur formation, leur dénonciation ou leur",
         "hiérarchie reviendrait à citer de mémoire — ce que ce fichier ne fait",
         "jamais.",
         "",
         "Ce que l'application sait est plus modeste, et c'est ce qu'elle écrit :",
         "ces normes existent, elles ne sont nulle part publiées, elles priment",
         "lorsqu'elles sont plus favorables, et il faut donc les recenser."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-CTX-01 — LE SIGNALEMENT DES CONTENTIEUX ET CONTRÔLES EN COURS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-CTX-01", {
    nom: "Note de signalement des contentieux et contrôles en cours",
    detail: "Le relevé des instances, ce que chacune peut changer au projet, et le " +
            "courrier de transmission à la direction et au conseil.",
    produire: function (ctx) {
      var f = fic(ctx);
      var L = entete(ctx, "Note de signalement — contentieux et contrôles en cours", null);

      L.push("POURQUOI CETTE NOTE EST URGENTE");
      L.push("");
      L.push("Un contentieux ou un contrôle en cours peut modifier la stratégie et les");
      L.push("délais du projet : une instance prud'homale sur un licenciement antérieur");
      L.push("dit ce qui sera opposé au suivant ; un contrôle de l'inspection du travail");
      L.push("en cours change la manière dont une irrégularité sera vue ; une procédure");
      L.push("sur la représentation du personnel peut fragiliser la consultation");
      L.push("elle-même.");
      L.push("");
      L.push("Cette note se transmet AVANT toute décision, et elle se conserve : elle date");
      L.push("le moment où l'information a été portée à ceux qui décident. C'est sa");
      L.push("seconde fonction, et elle n'est pas la moindre.");
      L.push("");
      L.push("   Ce que le dossier déclare : " +
        (vide(f.contentieuxEnCours)
          ? "[rien n'est renseigné]"
          : String(f.contentieuxEnCours)));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LE RELEVÉ DES INSTANCES ET CONTRÔLES");
      L.push("");
      tableau(L, ["Objet", "Juridiction ou autorité", "Date de saisine",
                  "État d'avancement", "Ce qu'il peut changer au projet"], [
        ["[objet du litige ou du contrôle]", "[conseil de prud'hommes de …, DREETS, URSSAF, tribunal administratif]",
         "[AAAA-MM-JJ]", "[bureau de conciliation, mise en délibéré, observations reçues…]",
         "[en une phrase]"],
        ["[…]", "[…]", "[…]", "[…]", "[…]"],
        ["[…]", "[…]", "[…]", "[…]", "[…]"],
      ]);
      L.push("Les catégories à balayer, parce qu'on n'oublie que celles auxquelles on ne");
      L.push("pense pas :");
      L.push("  · instances prud'homales en cours, y compris en appel ou en cassation ;");
      L.push("  · contentieux sur des licenciements économiques antérieurs — c'est celui");
      L.push("    qui pèse le plus sur le projet en cours ;");
      L.push("  · contentieux électoral ou sur la représentativité ;");
      L.push("  · procédures relatives à des salariés protégés, y compris les recours");
      L.push("    contre une décision de l'inspecteur du travail ;");
      L.push("  · contrôles de l'inspection du travail, et suites données ;");
      L.push("  · contrôles de l'organisme de recouvrement des cotisations, et");
      L.push("    observations ou redressements notifiés ;");
      L.push("  · procédures devant la juridiction administrative sur une validation ou");
      L.push("    une homologation antérieure ;");
      L.push("  · procédures pénales ou d'enquête visant l'entreprise ou ses dirigeants.");
      L.push("");

      L.push("2. CE QUI COURT, ET DEPUIS QUAND");
      L.push("");
      L.push("Un seul délai est lu à la source par ce module, et il concerne directement");
      L.push("ce projet : « Toute contestation portant sur le licenciement pour motif");
      L.push("économique se prescrit par douze mois à compter de la dernière réunion du");
      L.push("comité social et économique ou, dans le cadre de l'exercice par le salarié");
      L.push("de son droit individuel à contester le licenciement pour motif économique, à");
      L.push("compter de la notification de celui-ci » (L. 1235-7).");
      L.push("");
      var reunions = liste(f.datesReunionsCSE);
      var derniere = reunions.length ? reunions[reunions.length - 1] : null;
      tableau(L, ["Point de départ", "Date", "Douze mois échoient le"], [
        ["Dernière réunion du comité social et économique",
         derniere ? jour(derniere, "date") : "[AAAA-MM-JJ]",
         derniere ? jour(plusJours(derniere, 365), "date") + " (365 jours — vérifiez le quantième)" : "[à calculer]"],
        ["Notification du licenciement",
         f.dateNotification ? jour(f.dateNotification, "date") : "[AAAA-MM-JJ]",
         f.dateNotification ? jour(plusJours(f.dateNotification, 365), "date") + " (365 jours — vérifiez le quantième)" : "[à calculer]"],
      ]);
      L.push("Les dates calculées ci-dessus le sont à 365 jours : elles situent l'échéance,");
      L.push("elles ne la tiennent pas lieu. Le calcul en mois relève du conseil.");
      L.push("");
      L.push("L'article L. 1471-1 nomme expressément L. 1235-7 parmi les délais plus");
      L.push("courts auxquels il ne fait pas obstacle.");
      L.push("");
      L.push("Portez ici les délais propres à chaque autre instance : [échéances,");
      L.push("audiences, délais de recours, dates limites d'observations].");
      L.push("");

      L.push("3. LES PIÈCES DE CHAQUE DOSSIER");
      L.push("");
      tableau(L, ["Instance", "Pièce", "Ce qu'elle doit établir"], [
        ["[instance 1]", "[requête, convocation, lettre d'observations]", "l'objet exact du litige et la date de saisine"],
        ["[instance 1]", "[conclusions adverses]", "ce qui est reproché, et sur quel fondement"],
        ["[instance 2]", "[…]", "[…]"],
      ]);

      L.push(GROS);
      L.push("COURRIER DE TRANSMISSION");
      L.push(GROS);
      L.push("");
      L.push("À : [direction générale] — [conseil de l'entreprise : avocat, juriste]");
      L.push("De : " + signataire(ctx));
      L.push(lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : signalement des contentieux et contrôles en cours — projet de");
      L.push("licenciement économique de " + nomDe(ctx));
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous transmets, avant toute décision sur le projet en cours, le relevé");
      L.push("des contentieux et contrôles dont l'entreprise fait actuellement l'objet.");
      L.push("");
      L.push("Je vous serais reconnaissant de me faire connaître, pour chacun :");
      L.push("  · s'il commande de différer une étape du projet, et laquelle ;");
      L.push("  · ce qu'il impose de verser, de conserver ou de ne pas écrire ;");
      L.push("  · ce qui, dans le projet, pourrait y être opposé.");
      L.push("");
      L.push("Cette note est conservée au dossier : elle date le moment où l'information");
      L.push("vous a été portée.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : le relevé ci-dessus, et les pièces du point 3.");
      L.push("");
      L.push("Accusé de réception : [date et signature du destinataire]");
      L.push("");

      return L.concat(pied("L. 1235-7, L. 1471-1",
        ["Le contrôle CTL-CTX-01 n'a pas de fondement textuel : il signale une",
         "situation, il n'applique aucune règle. Les deux articles cités ci-dessus le",
         "sont au titre du point 2 seulement, pour dater ce qui court.",
         "",
         "Ce document ne conclut jamais à la conformité : l'incidence d'un",
         "contentieux sur la stratégie d'un projet excède ce que cette application",
         "peut apprécier."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-PCE-01 — LE BORDEREAU DE PIÈCES ET SES MÉTADONNÉES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-PCE-01", {
    nom: "Bordereau de pièces probatoires — métadonnées et objet de chaque pièce",
    detail: "Pièce par pièce : le fichier, la date, la période, l'auteur, la " +
            "version, le périmètre, la lecture — et ce que la pièce doit établir.",
    produire: function (ctx) {
      var L = entete(ctx, "Bordereau de pièces probatoires", null);
      var l = pieces(ctx);
      var binaires = l.filter(function (p) { return p._binaire; });
      var incomplets = l.filter(function (p) { return !p._binaire && manquantsDe(p).length; });

      L.push("CE QU'EST UN BORDEREAU, ET CE QUE N'EST PAS UNE CASE COCHÉE");
      L.push("");
      L.push("Une case cochée n'établit ni la date, ni le périmètre, ni la complétude");
      L.push("d'une pièce. Or c'est exactement ce que l'on demandera à la pièce : de dire");
      L.push("QUAND l'élément existait, SUR QUOI il portait, et QUI l'a établi.");
      L.push("");
      L.push("Une pièce sans date ne peut être confrontée à aucune étape de la");
      L.push("chronologie — et toute la procédure du licenciement économique est une");
      L.push("chronologie. Une pièce sans périmètre ne peut être rapportée à aucun des");
      L.push("deux niveaux d'appréciation que L. 1233-3 distingue. Dans les deux cas, les");
      L.push("contrôles qui en dépendent ne peuvent conclure ni dans un sens ni dans");
      L.push("l'autre, et le dossier reste indéterminé.");
      L.push("");
      L.push("Ce bordereau ajoute une colonne que le dossier d'audit n'a pas : CE QUE LA");
      L.push("PIÈCE DOIT ÉTABLIR. C'est elle qui fait la différence entre un inventaire");
      L.push("de fichiers et un dossier de preuve.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. L'ÉTAT DU DOSSIER");
      L.push("");
      L.push("   Pièces enregistrées : " + (l.length ? String(l.length) : "aucune"));
      L.push("   Seulement cochées, sans métadonnées : " + binaires.length);
      L.push("   Enregistrées mais incomplètes : " + incomplets.length);
      L.push("   Complètes : " + (l.length - binaires.length - incomplets.length));
      L.push("");
      if (!l.length) {
        consigne(L, [
          "AUCUNE PIÈCE N'EST ENREGISTRÉE.",
          "",
          "Remplissez le bordereau du point 2 en partant des pièces que vous avez, et",
          "non de celles que vous devriez avoir : une ligne vide se voit et se",
          "corrige, une ligne inventée se paie.",
        ]);
      }

      L.push("2. LE BORDEREAU");
      L.push("");
      L.push("Les sept métadonnées sont celles que le dossier d'audit attend : fichier,");
      L.push("date, période couverte, auteur, version, périmètre, lecture.");
      L.push("");
      var lignes = l.map(function (p) {
        var m = manquantsDe(p);
        return [
          cro(p.code, "code"),
          cro(p.fichier, "fichier"),
          p.date ? String(p.date) : "[date]",
          cro(p.periode, "période"),
          cro(p.auteur, "auteur"),
          cro(p.version, "version"),
          cro(p.perimetre, "périmètre"),
          p.lue === true ? "lue" : "NON LUE",
          m.length ? "manquent : " + m.join(", ") : "complète",
        ];
      });
      if (!lignes.length) {
        lignes = [["[code]", "[nom du fichier]", "[AAAA-MM-JJ]", "[période couverte]",
                   "[auteur]", "[version]", "[périmètre]", "[lue ?]", "[ ]"]];
      }
      tableau(L, ["Code", "Fichier", "Date", "Période", "Auteur", "Version",
                  "Périmètre", "Lecture", "État"], lignes);

      L.push("3. CE QUE CHAQUE PIÈCE DOIT ÉTABLIR");
      L.push("");
      L.push("Cette colonne se remplit AVANT de chercher la pièce, pas après : c'est elle");
      L.push("qui dit si la pièce trouvée fait l'affaire.");
      L.push("");
      var connues = Object.keys(PREUVE);
      var vues = {};
      l.forEach(function (p) { if (p && p.code) vues[p.code] = true; });
      var lignesPreuve = connues.map(function (code) {
        return [code, vues[code] ? "au dossier" : "[à produire]", ceQuePreuve(code)];
      });
      l.forEach(function (p) {
        if (p && p.code && connues.indexOf(p.code) === -1)
          lignesPreuve.push([p.code, "au dossier", ceQuePreuve(p.code)]);
      });
      tableau(L, ["Code", "État", "Ce que la pièce doit établir"], lignesPreuve);
      L.push("Cette liste est celle du registre de pièces du module. Elle n'est pas");
      L.push("limitative : ajoutez les pièces propres à votre dossier, avec leur objet");
      L.push("probatoire écrit de la même manière — un fait précis, daté, opposable.");
      L.push("");

      L.push("4. LES SEPT MÉTADONNÉES, ET POURQUOI CHACUNE");
      L.push("");
      tableau(L, ["Métadonnée", "À quoi elle sert", "Ce qui arrive sans elle"], [
        ["Fichier", "attacher un document réel à une déclaration", "la pièce n'existe que dans la case cochée"],
        ["Date", "situer la pièce dans la chronologie", "l'antériorité ne peut pas être contrôlée (CTL-PCE-02)"],
        ["Période couverte", "dire sur quel intervalle porte le contenu", "un exercice peut être pris pour un autre"],
        ["Auteur", "savoir qui répond du contenu", "la pièce n'est opposable à personne"],
        ["Version", "distinguer les états successifs d'un même document", "on discute deux textes différents"],
        ["Périmètre", "rapporter la pièce au niveau à démontrer", "le périmètre ne peut pas être contrôlé (CTL-PCE-03)"],
        ["Lecture", "attester que la pièce a été rapprochée des réponses", "les contradictions ne sont pas vues (CTL-PCE-04)"],
      ]);

      L.push("5. CE QUI RESTE À FAIRE");
      L.push("");
      if (binaires.length) {
        L.push("   Pièces à documenter (aujourd'hui seulement cochées) : " +
          binaires.map(function (p) { return cro(p.code, "code"); }).join(", ") + ".");
        L.push("   Attachez un fichier réel à chacune, puis renseignez les sept champs.");
        L.push("");
      }
      if (incomplets.length) {
        L.push("   Pièces incomplètes, champ manquant par champ manquant :");
        incomplets.forEach(function (p) {
          L.push("     · " + cro(p.code, "code") + " — manquent : " + manquantsDe(p).join(", "));
        });
        L.push("");
      }
      if (!binaires.length && !incomplets.length && l.length) {
        L.push("   Les " + l.length + " pièces enregistrées portent leurs métadonnées.");
        L.push("   Reste à vérifier, pièce par pièce, que ce qu'elle établit correspond");
        L.push("   bien à ce que la colonne du point 3 attend d'elle.");
        L.push("");
      }
      L.push("Relancez ensuite l'audit : les contrôles de pièces et de chronologie");
      L.push("pourront alors conclure au lieu de refuser de conclure.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Bordereau établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-4",
        ["Le contrôle CTL-PCE-01 n'a pas de fondement textuel propre : aucun article",
         "n'impose de tenir un bordereau. Les deux articles cités le sont pour la",
         "seule raison qui compte ici — ce sont eux qui font peser sur l'employeur la",
         "démonstration de la cause et celle du reclassement, et une démonstration se",
         "fait avec des pièces datées."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-PCE-02 — L'ANTÉRIORITÉ DES PIÈCES À L'ACTE QU'ELLES JUSTIFIENT
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-PCE-02", {
    nom: "Relevé d'antériorité des pièces — et constat pour celles qui sont postérieures",
    detail: "La date de chaque pièce confrontée à celle de la notification, la " +
            "recherche d'une pièce contemporaine, et le constat quand il n'y en a pas.",
    produire: function (ctx) {
      var f = fic(ctx);
      var ref = f.dateNotification;
      var l = pieces(ctx).filter(function (p) { return p && p.date; });
      var tard = ref ? l.filter(function (p) { return String(p.date) > String(ref); }) : [];
      var L = entete(ctx, "Relevé d'antériorité des pièces", null);

      L.push("LA RÈGLE, EN UNE PHRASE");
      L.push("");
      L.push("Une pièce postérieure à l'acte qu'elle justifie ne le justifie pas : elle");
      L.push("établit au contraire que l'élément n'existait pas au jour de l'acte.");
      L.push("");
      L.push("Ce n'est pas une exigence de forme. L'article L. 1233-4 subordonne le");
      L.push("licenciement à ce que « tous les efforts de formation et d'adaptation ont");
      L.push("été réalisés » et que « le reclassement de l'intéressé ne peut être opéré »");
      L.push("— deux conditions à remplir AVANT que la lettre parte. Un état des postes");
      L.push("établi après elle ne dit rien de ce qui existait avant ; il dit seulement");
      L.push("qu'on n'en avait pas.");
      L.push("");
      L.push("   Date de notification retenue : " + jour(ref, "DATE DE NOTIFICATION"));
      L.push("   Pièces datées au dossier : " + l.length);
      L.push("   Pièces postérieures à la notification : " + (ref ? String(tard.length) : "[non calculable]"));
      L.push("");
      if (!ref) {
        consigne(L, [
          "LA DATE DE NOTIFICATION N'EST PAS RENSEIGNÉE.",
          "",
          "Sans elle, l'antériorité ne se contrôle pas : ni pour conclure qu'elle est",
          "acquise, ni pour conclure qu'elle ne l'est pas. Renseignez-la — sur la",
          "lettre recommandée, l'avis de réception ou le registre des envois — puis",
          "reprenez ce relevé.",
        ]);
      }
      L.push(TRAIT);
      L.push("");

      L.push("1. LE RELEVÉ, PIÈCE PAR PIÈCE");
      L.push("");
      var lignes = l.map(function (p) {
        var e = ref ? ecart(p.date, ref) : null;
        var apres = ref && String(p.date) > String(ref);
        return [
          cro(p.code, "code"),
          String(p.date),
          ref ? String(ref) : "[notification]",
          e === null ? "[à calculer]" : (apres ? "POSTÉRIEURE de " + (-e) + " j" : "antérieure de " + e + " j"),
          apres ? "à traiter au point 2" : (ref ? "rien à faire" : "[à vérifier]"),
        ];
      });
      if (!lignes.length) {
        lignes = [["[code]", "[date de la pièce]", "[date de notification]",
                   "[écart]", "[ ]"]];
      }
      tableau(L, ["Pièce", "Date de la pièce", "Notification", "Écart", "Suite"], lignes);
      L.push("L'écart est compté en jours de calendrier, à titre indicatif : ce qui");
      L.push("compte est le SENS, pas le nombre. Une pièce antérieure d'un jour est");
      L.push("antérieure ; une pièce postérieure d'un jour est postérieure.");
      L.push("");
      L.push("Les pièces sans date ne figurent pas dans ce relevé, et c'est le problème :");
      L.push("elles ne peuvent être ni retenues ni écartées. Datez-les d'abord");
      L.push("(bordereau CTL-PCE-01), revenez ensuite.");
      L.push("");

      if (tard.length) {
        nonRattrapable(L,
          tard.length + " pièce(s) portent une date postérieure à la notification du " +
          jour(ref, "date") + " :\n" +
          tard.map(function (p) { return "  · " + cro(p.code, "code") + " — " + p.date; }).join("\n"),
          ["Ces pièces ne peuvent pas justifier un acte qui leur est antérieur. Les",
           "REDATER serait pire que les laisser : ce ne serait plus une faiblesse de",
           "dossier, ce serait une pièce fausse.",
           "",
           "Deux issues, et deux seulement : retrouver la pièce CONTEMPORAINE, ou",
           "constater qu'il n'en existe pas et l'écarter de la démonstration."]);
      }

      L.push("2. LA RECHERCHE DE LA PIÈCE CONTEMPORAINE");
      L.push("");
      L.push("Pour chaque pièce postérieure, cherchez le document tel qu'il existait");
      L.push("AVANT la lettre : le brouillon daté, l'extraction horodatée, le courriel");
      L.push("qui la transmettait, la version enregistrée dans le système d'information.");
      L.push("");
      tableau(L, ["Pièce postérieure", "Pièce contemporaine recherchée",
                  "Trouvée ?", "Sa date", "Ce qu'elle établit"],
        (tard.length ? tard : [{ code: null }]).map(function (p) {
          return [p.code ? cro(p.code, "code") : "[code]",
                  "[le même document, dans son état antérieur]",
                  "[oui / non]", "[AAAA-MM-JJ]",
                  p.code ? ceQuePreuve(p.code) : "[ce que la pièce doit établir]"];
        }));
      consigne(L, [
        "QUAND LA PIÈCE CONTEMPORAINE EXISTE :",
        "  · substituez-la, et enregistrez-la avec sa VRAIE date ;",
        "  · conservez la pièce postérieure au dossier, sans la produire : elle",
        "    montre ce qui a été fait après, et cela peut servir ailleurs.",
        "",
        "QUAND ELLE N'EXISTE PAS :",
        "  · N'ANTIDATEZ RIEN ;",
        "  · écartez la pièce de la démonstration, et écrivez-le ci-dessous ;",
        "  · signalez le point au conseil de l'entreprise avant toute suite.",
        "",
        "  Constat : [ÉCRIRE ICI, pièce par pièce, ce qui a été retrouvé et ce qui",
        "  ne l'a pas été. Ce constat est daté et signé : c'est lui qui montrera",
        "  que le dossier a été repris de bonne foi.]",
      ]);

      L.push("3. CE QUE LA DÉMONSTRATION DEVIENT SANS CES PIÈCES");
      L.push("");
      L.push("C'est la question que le relevé sert à poser, et elle n'est pas");
      L.push("rhétorique : la charge de la preuve du reclassement pèse sur l'employeur.");
      L.push("Une démonstration privée de son support n'est pas une démonstration");
      L.push("affaiblie, c'est une démonstration absente.");
      L.push("");
      L.push("   [Écrire ici, point de contrôle par point de contrôle, ce qui n'est plus");
      L.push("    établi une fois les pièces postérieures écartées — et ce qu'il reste.]");
      L.push("");
      L.push("Ce qui se joue est écrit et fondé : si la cause économique ou la recherche");
      L.push("de reclassement ne sont pas établies, le licenciement peut être jugé sans");
      L.push("cause réelle et sérieuse, et l'indemnité relève alors du barème de");
      L.push("l'article L. 1235-3, dont les montants minimaux et maximaux sont fixés en");
      L.push("mois de salaire brut selon l'ancienneté.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Relevé établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1235-3",
        ["Le contrôle CTL-PCE-02 n'a pas de fondement textuel propre : aucun article",
         "ne dit qu'une pièce doit être antérieure. C'est L. 1233-4 qui le dit",
         "autrement, en faisant des efforts de formation et d'adaptation et de",
         "l'impossibilité du reclassement des CONDITIONS du licenciement — donc des",
         "éléments qui doivent exister au jour où il est prononcé.",
         "",
         "Aucune peine n'est annoncée : le corpus de ce module ne contient aucun",
         "article de sanction pénale."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-PCE-03 — LE PÉRIMÈTRE DES PIÈCES COMPTABLES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-PCE-03", {
    nom: "Note de périmètre des pièces comptables — les sociétés que la pièce agrège",
    detail: "Les sociétés du secteur d'activité, celles que la pièce couvre, le " +
            "rapprochement des deux listes et la demande au producteur de la pièce.",
    produire: function (ctx) {
      var f = fic(ctx);
      var societes = liste(f.societes);
      var secteur = Array.isArray(f.societesDuSecteur) ? f.societesDuSecteur
        : (typeof f.societesDuSecteur === "string" && f.societesDuSecteur.trim() !== ""
           ? [f.societesDuSecteur] : []);
      var grp = pieces(ctx).find(function (p) { return p && p.code === "comptes-groupe"; }) || null;
      var couvertes = grp ? liste(grp.societesCouvertes) : [];
      var L = entete(ctx, "Note de périmètre — les sociétés que les pièces comptables agrègent",
        "article L. 1233-3 du code du travail");

      L.push("LE PROBLÈME, ET IL EST TOUJOURS LE MÊME");
      L.push("");
      L.push("Une pièce comptable porte une étiquette : « groupe », « secteur »,");
      L.push("« consolidé ». L'étiquette n'est pas une couverture. Tant que la pièce ne");
      L.push("NOMME PAS les sociétés qu'elle agrège, rien ne dit que ses agrégats portent");
      L.push("sur le périmètre à démontrer — et la démonstration risque de ne valoir que");
      L.push("pour la seule entreprise.");
      L.push("");
      L.push("Le périmètre à démontrer est celui que L. 1233-3 fixe, et le texte le dit");
      L.push("en deux temps qu'il ne faut jamais confondre :");
      L.push("");
      L.push("  · « La matérialité de la suppression, de la transformation d'emploi ou de");
      L.push("    la modification d'un élément essentiel du contrat de travail s'apprécie");
      L.push("    AU NIVEAU DE L'ENTREPRISE. »");
      L.push("  · « Les difficultés économiques, les mutations technologiques ou la");
      L.push("    nécessité de sauvegarder la compétitivité de l'entreprise s'apprécient");
      L.push("    au niveau de cette entreprise si elle n'appartient pas à un groupe et,");
      L.push("    dans le cas contraire, AU NIVEAU DU SECTEUR D'ACTIVITÉ COMMUN à cette");
      L.push("    entreprise et aux entreprises du groupe auquel elle appartient,");
      L.push("    ÉTABLIES SUR LE TERRITOIRE NATIONAL, sauf fraude. »");
      L.push("");
      L.push("Et le texte définit le secteur : « Le secteur d'activité permettant");
      L.push("d'apprécier la cause économique du licenciement est caractérisé, notamment,");
      L.push("par la nature des produits biens ou services délivrés, la clientèle ciblée,");
      L.push("ainsi que les réseaux et modes de distribution, se rapportant à un même");
      L.push("marché. »");
      L.push("");
      L.push("   L'entreprise appartient-elle à un groupe : " +
        (f.groupe === true ? "OUI" : f.groupe === false ? "non — le périmètre de l'entreprise suffit"
         : "[non renseigné]"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES SOCIÉTÉS QUI COMPOSENT LE SECTEUR D'ACTIVITÉ");
      L.push("");
      L.push("Une ligne par société. Le critère de rattachement au secteur est celui du");
      L.push("texte : nature des produits, biens ou services délivrés, clientèle ciblée,");
      L.push("réseaux et modes de distribution, se rapportant à un même marché. Écrivez-le");
      L.push("pour chacune : c'est ce qui sera discuté.");
      L.push("");
      var lignesS = societes.map(function (s) {
        var etr = s && s.etranger === true;
        return [cro(s && s.nom, "société"),
                cro(s && s.activite, "activité"),
                cro(s && s.pays, etr ? "étranger" : "France"),
                etr ? "HORS PÉRIMÈTRE (hors territoire national)" : "[dans le secteur ? oui/non]",
                etr ? "L. 1233-3 limite au territoire national" : "[nature des produits, clientèle, réseaux]"];
      });
      if (!lignesS.length) {
        lignesS = [["[DÉNOMINATION]", "[activité]", "[pays]", "[dans le secteur ? oui/non]",
                    "[le critère, écrit]"]];
      }
      tableau(L, ["Société du groupe", "Activité", "Pays", "Dans le secteur ?",
                  "Pourquoi"], lignesS);
      if (secteur.length) {
        L.push("   Sociétés du secteur déjà énumérées au dossier : " + secteur.join(", ") + ".");
        L.push("");
      } else {
        L.push("   AUCUNE SOCIÉTÉ DU SECTEUR N'EST ÉNUMÉRÉE AU DOSSIER. C'est la première");
        L.push("   chose à écrire : sans cette liste, il n'y a rien à rapprocher.");
        L.push("");
      }

      L.push("2. CE QUE LA PIÈCE COMPTABLE DÉCLARE COUVRIR");
      L.push("");
      tableau(L, ["Élément", "Au dossier"], [
        ["Pièce", cro(grp && grp.fichier, "comptes du groupe — fichier")],
        ["Date", grp && grp.date ? jour(grp.date, "date") : "[date]"],
        ["Période couverte", cro(grp && grp.periode, "exercice")],
        ["Auteur", cro(grp && grp.auteur, "producteur de la pièce")],
        ["Périmètre déclaré", cro(grp && grp.perimetre, "périmètre porté sur la pièce")],
        ["Sociétés nommées par la pièce", couvertes.length ? couvertes.join(", ") : "[AUCUNE — c'est le problème]"],
      ]);

      L.push("3. LE RAPPROCHEMENT DES DEUX LISTES");
      L.push("");
      var manquantes = secteur.filter(function (n) { return couvertes.indexOf(n) === -1; });
      var lignesR = secteur.map(function (n) {
        return [n, couvertes.indexOf(n) !== -1 ? "oui" : "NON — À COMPLÉTER",
                couvertes.indexOf(n) !== -1 ? "rien à faire" : "[demander l'agrégat de cette société]"];
      });
      if (!lignesR.length) {
        lignesR = [["[société du secteur]", "[la pièce la nomme ? oui/non]", "[suite à donner]"]];
      }
      tableau(L, ["Société du secteur", "Nommée par la pièce ?", "Suite"], lignesR);
      if (secteur.length && couvertes.length && manquantes.length) {
        L.push("   " + manquantes.length + " société(s) du secteur ne figurent pas dans la pièce : " +
          manquantes.join(", ") + ".");
        L.push("   Les agrégats ne portent donc pas sur le périmètre à démontrer.");
        L.push("");
      }
      consigne(L, [
        "LE RAPPROCHEMENT SE FAIT DANS LES DEUX SENS, ET ON N'EN FAIT QU'UN :",
        "",
        "  · une société du secteur absente de la pièce → l'agrégat est incomplet,",
        "    et il faut le compléter ;",
        "  · une société nommée par la pièce mais étrangère au secteur → l'agrégat",
        "    est trop large, et il faut dire pourquoi elle y figure — ou la sortir.",
        "",
        "Les deux erreurs se plaident, et pas dans le même sens.",
      ]);

      L.push("4. LA DEMANDE AU PRODUCTEUR DE LA PIÈCE");
      L.push("");
      L.push("À : " + cro(grp && grp.auteur, "producteur de la pièce comptable") +
        " — [expert-comptable, direction financière du groupe]");
      L.push("De : " + signataire(ctx));
      L.push(lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : périmètre des agrégats comptables — sociétés couvertes");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("La pièce que vous avez établie porte la mention de périmètre « " +
        cro(grp && grp.perimetre, "périmètre") + " ».");
      L.push("Nous vous demandons de bien vouloir :");
      L.push("");
      L.push("  1. nous communiquer la liste EXHAUSTIVE des sociétés effectivement");
      L.push("     agrégées dans cette pièce, avec leur numéro d'immatriculation ;");
      L.push("  2. FAIRE FIGURER cette liste sur la pièce elle-même — une annexe visée");
      L.push("     suffit — de sorte que le périmètre ne repose plus sur une étiquette ;");
      L.push("  3. compléter les agrégats des sociétés suivantes, qui relèvent du secteur");
      L.push("     d'activité et n'y figurent pas : " +
        (manquantes.length ? manquantes.join(", ") : "[liste établie au point 3]") + " ;");
      L.push("  4. dater et signer la pièce ainsi complétée.");
      L.push("");
      L.push("Cette liste n'est pas une commodité de présentation : l'appréciation de la");
      L.push("cause économique se fait au niveau du secteur d'activité, et une pièce qui");
      L.push("ne dit pas ce qu'elle agrège ne permet pas de le vérifier.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");

      L.push("5. LE RÉENREGISTREMENT DE LA PIÈCE");
      L.push("");
      L.push("Une fois la pièce complétée, réenregistrez-la avec :");
      L.push("  · sa nouvelle date, qui est celle de la version complétée ;");
      L.push("  · son périmètre, écrit en toutes lettres ;");
      L.push("  · la liste des sociétés couvertes ;");
      L.push("  · sa version, distincte de celle de la pièce d'origine.");
      L.push("");
      L.push("ATTENTION À LA CHRONOLOGIE. Si la notification est déjà intervenue, une");
      L.push("pièce complétée aujourd'hui lui est postérieure : elle relève alors du");
      L.push("relevé d'antériorité (CTL-PCE-02), et elle ne justifie pas rétroactivement");
      L.push("ce qui a été décidé avant elle. Conservez la pièce d'origine.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Note établie par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-3",
        [RESERVE_GROUPE,
         "Les données sur les sociétés du groupe qui figurent au point 1 viennent du",
         "questionnaire : elles sont DÉCLARÉES, non établies. Chacune appelle sa",
         "pièce — extrait d'immatriculation, organigramme, périmètre de",
         "consolidation."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-PCE-04 — LA LECTURE ET LE VISA DES PIÈCES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-PCE-04", {
    nom: "Fiche de lecture et de visa des pièces — écarts entre les pièces et les réponses",
    detail: "Pièce par pièce : ce qu'elle dit, ce que le questionnaire déclare, " +
            "l'écart s'il y en a un, et ce qui en est fait.",
    produire: function (ctx) {
      var l = pieces(ctx).filter(function (p) { return p && !p._binaire; });
      var nonLues = l.filter(function (p) { return p.lue !== true; });
      var L = entete(ctx, "Fiche de lecture et de visa des pièces", null);

      L.push("TROIS ÉTATS, ET ON LES CONFOND TOUJOURS");
      L.push("");
      L.push("Le DÉPÔT n'est pas la LECTURE, et la lecture n'est pas la CONFORMITÉ.");
      L.push("");
      L.push("Une pièce déposée sans avoir été lue n'a été rapprochée d'aucune réponse du");
      L.push("questionnaire. Les contradictions entre ce que l'entreprise déclare et ce");
      L.push("que ses propres pièces disent — celles que l'adversaire relèvera, celles que");
      L.push("le juge relèvera — ne sont alors pas détectées avant la décision. Elles le");
      L.push("seront après, et par quelqu'un d'autre.");
      L.push("");
      L.push("Cette fiche fait la lecture, et elle en garde la trace.");
      L.push("");
      L.push("   Pièces documentées : " + l.length);
      L.push("   Pièces non encore lues : " + nonLues.length);
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES PIÈCES À LIRE");
      L.push("");
      var lignes = l.map(function (p) {
        return [cro(p.code, "code"), cro(p.fichier, "fichier"),
                p.date ? String(p.date) : "[date]",
                p.lue === true ? "lue" : "À LIRE",
                ceQuePreuve(p.code)];
      });
      if (!lignes.length) {
        lignes = [["[code]", "[fichier]", "[date]", "[à lire]",
                   "[ce que la pièce doit établir]"]];
      }
      tableau(L, ["Code", "Fichier", "Date", "État", "Ce qu'elle doit établir"], lignes);
      if (nonLues.length) {
        L.push("   Restent à lire : " +
          nonLues.map(function (p) { return cro(p.code, "code"); }).join(", ") + ".");
        L.push("");
      }

      L.push("2. LA LECTURE, PIÈCE PAR PIÈCE");
      L.push("");
      L.push("Une fiche par pièce. Elle tient en cinq lignes, et elle se remplit la pièce");
      L.push("ouverte — pas de mémoire, pas d'après le résumé de quelqu'un d'autre.");
      L.push("");
      (nonLues.length ? nonLues : l.length ? l.slice(0, 3) : [{ code: null }])
        .forEach(function (p) {
          var code = p && p.code ? cro(p.code, "code") : "[CODE DE LA PIÈCE]";
          L.push("  ┌── PIÈCE : " + code);
          L.push("  │ Ce qu'elle doit établir : " + ceQuePreuve(p && p.code));
          L.push("  │ Ce qu'elle dit réellement : [résumé fidèle, en deux lignes]");
          L.push("  │ Réponse du questionnaire correspondante : [champ et valeur déclarée]");
          L.push("  │ Écart : [aucun / décrire l'écart, chiffres et dates à l'appui]");
          L.push("  │ Suite donnée : [corriger la réponse / corriger la pièce / expliquer]");
          L.push("  │ Lue le [AAAA-MM-JJ] par [NOM ET QUALITÉ]");
          L.push("  └──");
          L.push("");
        });
      L.push("Reproduisez ce bloc autant de fois qu'il y a de pièces.");
      L.push("");

      L.push("3. LES ÉCARTS TYPES, ET OÙ ILS SE LOGENT");
      L.push("");
      L.push("Ce ne sont pas des hypothèses d'école : ce sont les écarts que les contrôles");
      L.push("de ce module cherchent, parce que ce sont ceux qui font tomber les dossiers");
      L.push("formellement complets.");
      L.push("");
      tableau(L, ["Où chercher", "L'écart qui s'y loge"], [
        ["État des postes / postes supprimés", "un même intitulé des deux côtés (voir CTL-COH-01)"],
        ["Offres de reclassement", "plusieurs salariés sur un même poste (voir CTL-COH-02)"],
        ["Grille des critères d'ordre", "des valeurs identiques pour tous (voir CTL-COH-03)"],
        ["Comptes du groupe", "un périmètre déclaré que la pièce ne nomme pas (voir CTL-PCE-03)"],
        ["Liasse fiscale", "des chiffres qui ne sont pas ceux du questionnaire"],
        ["Procès-verbaux du comité", "des dates de réunion qui ne sont pas celles déclarées"],
        ["Registre du personnel", "un effectif qui n'est pas celui saisi (voir CTL-EFF-01)"],
        ["Autorisations de l'inspecteur", "une date postérieure à la notification"],
        ["Convention collective", "une version qui n'est pas celle déclarée (voir CTL-CCN-02)"],
      ]);

      L.push("4. LA NOTE DES ÉCARTS");
      L.push("");
      consigne(L, [
        "À ÉCRIRE UNE FOIS TOUTES LES PIÈCES LUES :",
        "",
        "  · [écart n° 1 : la pièce X dit …, la réponse Y déclare …, l'écart est de …]",
        "  · [ce qui a été retenu, et sur quelle base]",
        "  · [ce qui reste inexpliqué]",
        "",
        "OU, si aucune contradiction n'apparaît : « Les N pièces ont été lues et",
        "rapprochées des réponses correspondantes ; aucun écart n'a été relevé. »",
        "Datez et signez : c'est cette phrase-là qui aura de la valeur, et elle n'en",
        "a que si elle est fausse quand elle est fausse.",
        "",
        "TRAITEZ LES ÉCARTS AVANT DE POURSUIVRE. Un écart connu et non traité est",
        "pire qu'un écart ignoré : il établit que l'on savait.",
      ]);

      L.push("5. L'ENREGISTREMENT");
      L.push("");
      L.push("Marquez chaque pièce comme LUE dans le dossier d'audit, avec la date de");
      L.push("lecture et le nom du lecteur, puis relancez l'audit. La marque de lecture");
      L.push("n'est pas une formalité : c'est elle qui distingue un dossier constitué");
      L.push("d'un dossier empilé.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Lectures faites par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("aucun article ne fonde cette fiche",
        ["Le contrôle CTL-PCE-04 n'a pas de fondement textuel : aucun article",
         "n'impose de viser ses pièces. Ce qui l'impose est plus simple — la charge",
         "de la preuve pèse sur l'employeur, et on ne prouve pas avec des documents",
         "qu'on n'a pas lus.",
         "",
         "Les renvois aux autres contrôles du point 3 désignent des points de ce",
         "module, non des articles."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-EFF-01 — LA RÉCONCILIATION DES EFFECTIFS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-EFF-01", {
    nom: "Tableau de réconciliation des effectifs — entreprise et établissement",
    detail: "Les deux effectifs à la même date, l'origine de l'écart, la pièce qui " +
            "les établit, et les seuils qui en dépendent.",
    produire: function (ctx) {
      var f = fic(ctx);
      var p = pro(ctx);
      var eEnt = nb(f.effectif) !== null ? f.effectif : nb(p.effectif);
      var eEta = nb(f.effectifEtablissement);
      var impossible = (nb(eEnt) !== null && eEta !== null && eEta > eEnt);
      var L = entete(ctx, "Tableau de réconciliation des effectifs", null);

      L.push("POURQUOI UN CHIFFRE FAUX ICI FAIT TOUT BASCULER");
      L.push("");
      L.push("L'effectif n'est pas une donnée de contexte : c'est une donnée de régime.");
      L.push("Trois textes lus à la source en dépendent directement.");
      L.push("");
      L.push("  · L. 1233-3, 1° : le nombre de trimestres consécutifs de baisse des");
      L.push("    commandes ou du chiffre d'affaires exigé pour caractériser des");
      L.push("    difficultés change avec l'effectif de l'entreprise — un trimestre en");
      L.push("    dessous de onze salariés, deux de onze à moins de cinquante, trois de");
      L.push("    cinquante à moins de trois cents, quatre à partir de trois cents.");
      L.push("  · L. 1233-61 : le plan de sauvegarde de l'emploi est dû « dans les");
      L.push("    entreprises d'au moins cinquante salariés » lorsque le projet concerne");
      L.push("    au moins dix salariés dans une même période de trente jours.");
      L.push("  · L. 1233-26 : la règle anti-fractionnement ne vise que « une entreprise");
      L.push("    ou un établissement employant habituellement au moins cinquante");
      L.push("    salariés ».");
      L.push("");
      L.push("Et L. 1235-3 fait varier les montants minimaux du barème selon que");
      L.push("l'entreprise emploie habituellement moins de onze salariés ou non.");
      L.push("");
      L.push("Ces seuils s'apprécient au niveau de L'ENTREPRISE. Le périmètre des critères");
      L.push("d'ordre, lui, obéit à L. 1233-5 : ce n'est pas le même niveau, et c'est");
      L.push("pourquoi les deux effectifs doivent être justes et distincts.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES DEUX EFFECTIFS, À LA MÊME DATE");
      L.push("");
      tableau(L, ["Périmètre", "Effectif au dossier", "Date d'appréciation",
                  "Pièce qui l'établit"], [
        ["Entreprise", nb(eEnt) !== null ? String(eEnt) : "[EFFECTIF DE L'ENTREPRISE]",
         "[AAAA-MM-JJ]", "[registre unique du personnel, déclaration sociale — datée]"],
        ["Établissement concerné", eEta !== null ? String(eEta) : "[EFFECTIF DE L'ÉTABLISSEMENT]",
         "[AAAA-MM-JJ — LA MÊME]", "[la même extraction, filtrée sur l'établissement]"],
        ["Groupe", nb(f.effectifGroupe) !== null ? String(f.effectifGroupe) : "[effectif du groupe]",
         "[AAAA-MM-JJ]", "[à titre d'information — les seuils ne s'y apprécient pas]"],
      ]);
      L.push("   Établissements distincts déclarés : " +
        chiffre(f.etablissementsDistincts != null ? f.etablissementsDistincts : p.etablissementsDistincts,
          "nombre d'établissements distincts"));
      L.push("");
      L.push("LA MÊME DATE, LE MÊME REGISTRE. Deux extractions faites à deux dates ne se");
      L.push("comparent pas, et l'écart qu'elles montrent n'existe peut-être pas.");
      L.push("");

      if (impossible) {
        L.push("2. L'ANOMALIE CONSTATÉE");
        L.push("");
        L.push("   L'effectif de l'établissement (" + eEta + ") est SUPÉRIEUR à celui de");
        L.push("   l'entreprise (" + eEnt + "). C'est arithmétiquement impossible : un");
        L.push("   établissement est une partie de l'entreprise.");
        L.push("");
        L.push("   L'anomalie révèle une erreur de saisie ou une confusion de périmètre.");
        L.push("   Tant qu'elle subsiste, les verdicts qui utilisent l'un ou l'autre");
        L.push("   chiffre ne valent rien : ils peuvent conclure à la conformité comme à");
        L.push("   la non-conformité sur une valeur qui ne peut pas exister.");
        L.push("");
      } else {
        L.push("2. LE CONTRÔLE ARITHMÉTIQUE");
        L.push("");
        L.push("   L'effectif de l'établissement doit être inférieur ou égal à celui de");
        L.push("   l'entreprise. " +
          (nb(eEnt) !== null && eEta !== null
            ? "Ici : " + eEta + " ≤ " + eEnt + " — la relation est respectée."
            : "[À vérifier une fois les deux chiffres renseignés.]"));
        L.push("");
        if (nb(eEnt) !== null && eEta !== null && eEta === eEnt) {
          L.push("   Les deux chiffres sont égaux : l'entreprise ne compte-t-elle qu'un");
          L.push("   seul établissement ? Si oui, écrivez-le ici et joignez la pièce ; si");
          L.push("   non, l'un des deux chiffres est faux.");
          L.push("");
        }
      }

      L.push("3. L'ORIGINE DE L'ÉCART");
      L.push("");
      L.push("Quand les deux chiffres ne se réconcilient pas, l'écart a presque toujours");
      L.push("l'une de ces causes. Cochez, chiffrez, et joignez la pièce.");
      L.push("");
      tableau(L, ["Cause possible", "Nombre", "Pièce"], [
        ["[ ] Double compte — un salarié rattaché à deux établissements", "[nb]", "[extraction]"],
        ["[ ] Salariés mis à disposition, comptés au mauvais endroit", "[nb]", "[conventions]"],
        ["[ ] Périmètre d'établissement mal délimité", "[nb]", "[décision de reconnaissance des établissements distincts]"],
        ["[ ] Salariés d'un autre établissement inclus par erreur", "[nb]", "[extraction]"],
        ["[ ] Dates d'extraction différentes", "[écart]", "[les deux extractions]"],
        ["[ ] Erreur de saisie dans le questionnaire", "[valeur exacte]", "[la pièce d'origine]"],
      ]);
      consigne(L, [
        "LA CORRECTION SE PREND SUR LA PIÈCE, JAMAIS DE MÉMOIRE.",
        "",
        "  Effectif de l'entreprise retenu : [nombre] au [date], établi par [pièce]",
        "  Effectif de l'établissement retenu : [nombre] au [date], établi par [pièce]",
        "  Origine de l'écart initial : [en une phrase]",
        "",
        "Joignez l'extraction du registre unique du personnel ou la déclaration",
        "sociale. Une extraction sans date n'établit aucun effectif.",
      ]);

      L.push("4. CE QUE LA CORRECTION DÉPLACE");
      L.push("");
      tableau(L, ["Ce qui en dépend", "Avant correction", "Après correction"], [
        ["Trimestres de baisse exigés (L. 1233-3, 1°)", "[nombre]", "[nombre]"],
        ["Plan de sauvegarde de l'emploi dû (L. 1233-61)", "[oui/non]", "[oui/non]"],
        ["Règle anti-fractionnement applicable (L. 1233-26)", "[oui/non]", "[oui/non]"],
        ["Barème applicable (L. 1235-3)", "[moins de onze salariés ? oui/non]", "[oui/non]"],
        ["Périmètre des critères d'ordre (L. 1233-5)", "[périmètre]", "[périmètre]"],
      ]);
      L.push("Relancez l'audit une fois les chiffres corrigés, et relisez les verdicts :");
      L.push("plusieurs auront changé.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-5, L. 1233-26, L. 1233-61, L. 1235-3",
        ["Le contrôle CTL-EFF-01 n'a pas de fondement textuel propre : c'est un",
         "contrôle arithmétique. Les articles cités le sont pour dire ce que",
         "l'effectif commande, et chacun a été lu à la source.",
         "",
         "L'APPLICATION NE CALCULE PAS VOTRE EFFECTIF et n'en connaît pas les règles",
         "de décompte : elle reprend le nombre que vous avez saisi. Les règles de",
         "calcul de l'effectif ne figurent pas dans le corpus de textes de ce",
         "module."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-EFF-02 — LE PÉRIMÈTRE D'APPLICATION DES CRITÈRES D'ORDRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-EFF-02", {
    nom: "Note de délimitation du périmètre d'application des critères d'ordre",
    detail: "Le périmètre appliqué, l'accord qui le fonde ou la zone d'emplois qui " +
            "s'impose à défaut, et la reprise du classement.",
    produire: function (ctx) {
      var f = fic(ctx);
      var per = f.perimetreOrdre;
      var etab = per && /etablissement|établissement/i.test(String(per));
      var acc = pieces(ctx).find(function (p) { return p && p.code === "accord-perimetre-ordre"; }) || null;
      var dn = f.dateNotification;
      var L = entete(ctx, "Note de délimitation — périmètre d'application des critères d'ordre",
        "article L. 1233-5 du code du travail");

      L.push("LA RÈGLE, LUE À LA SOURCE, ET ELLE TIENT EN DEUX PHRASES");
      L.push("");
      L.push("« Le périmètre d'application des critères d'ordre des licenciements peut");
      L.push("être fixé par un accord collectif. En l'absence d'un tel accord, ce");
      L.push("périmètre ne peut être inférieur à celui de chaque zone d'emplois dans");
      L.push("laquelle sont situés un ou plusieurs établissements de l'entreprise");
      L.push("concernés par les suppressions d'emplois » (L. 1233-5).");
      L.push("");
      L.push("Autrement dit : le périmètre de l'établissement ne se défend QUE par un");
      L.push("accord collectif. Sans accord, le plancher est la zone d'emplois — et il");
      L.push("n'est pas négociable unilatéralement.");
      L.push("");
      L.push("Les zones d'emploi ne sont pas laissées à l'appréciation : « Les zones");
      L.push("d'emploi mentionnées à l'avant-dernier alinéa de l'article L. 1233-5 sont");
      L.push("celles référencées dans l'atlas des zones d'emploi établi par l'Institut");
      L.push("national de la statistique et des études économiques et les services");
      L.push("statistiques du ministre chargé de l'emploi » (D. 1233-2).");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LE PÉRIMÈTRE EFFECTIVEMENT APPLIQUÉ");
      L.push("");
      L.push("   Périmètre retenu au dossier : " + cro(per, "PÉRIMÈTRE APPLIQUÉ — à renseigner"));
      L.push("   Accord collectif déclaré le fixant : " +
        (f.accordPerimetreOrdre === true ? "oui"
         : f.accordPerimetreOrdre === false ? "NON" : "[non renseigné]"));
      L.push("   Accord versé comme pièce datée : " +
        (acc ? "oui — " + cro(acc.fichier, "fichier") + (acc.date ? ", du " + jour(acc.date, "date") : "")
             : "NON"));
      L.push("");
      L.push("   Le périmètre appliqué est celui sur lequel les salariés ont été");
      L.push("   effectivement départagés, pas celui qui figure dans une note. Vérifiez-le");
      L.push("   sur la grille de classement : [pièce, et le périmètre qu'elle montre].");
      L.push("");

      L.push("2. LE CHEMIN À SUIVRE, SELON LE CAS");
      L.push("");
      if (etab) {
        L.push("   LE PÉRIMÈTRE RETENU EST L'ÉTABLISSEMENT. C'est le cas qui appelle un");
        L.push("   titre, et un seul : l'accord collectif de L. 1233-5.");
        L.push("");
        if (!acc) {
          L.push("   L'accord n'est pas versé comme pièce datée. Tant qu'il ne l'est pas,");
          L.push("   ni son existence, ni son champ, ni sa date ne sont vérifiables — et");
          L.push("   un périmètre d'établissement sans accord vérifiable vicie l'ordre des");
          L.push("   licenciements.");
          L.push("");
        }
        tableau(L, ["Cas", "Ce qu'il faut faire"], [
          ["Un accord existe", "le verser comme pièce datée, avec sa date de signature ET de dépôt, et vérifier qu'il vise bien le périmètre des critères d'ordre"],
          ["Un accord existe mais ne vise pas le périmètre", "il ne fonde rien ici : passer au cas suivant"],
          ["Aucun accord", "ÉLARGIR le périmètre à la zone d'emplois, et refaire le classement"],
        ]);
      } else if (per) {
        L.push("   Périmètre retenu : « " + per + " ». Vérifiez qu'il n'est pas inférieur");
        L.push("   à la zone d'emplois dans laquelle sont situés les établissements");
        L.push("   concernés par les suppressions — c'est le plancher légal à défaut");
        L.push("   d'accord, et un périmètre nommé autrement peut lui être inférieur en");
        L.push("   fait.");
        L.push("");
      } else {
        L.push("   LE PÉRIMÈTRE N'EST PAS RENSEIGNÉ. Commencez par l'écrire : sans lui,");
        L.push("   rien ne peut être vérifié, ni dans un sens ni dans l'autre.");
        L.push("");
      }

      L.push("3. LA DÉLIMITATION DE LA ZONE D'EMPLOIS");
      L.push("");
      L.push("À remplir dès lors qu'aucun accord ne fixe le périmètre. Une ligne par");
      L.push("établissement concerné par les suppressions.");
      L.push("");
      tableau(L, ["Établissement concerné", "Commune", "Zone d'emploi (atlas INSEE)",
                  "Autres établissements dans la même zone"], [
        ["[nom de l'établissement]", "[commune]", "[libellé et code de la zone]",
         "[lesquels — ils entrent dans le périmètre]"],
        ["[…]", "[…]", "[…]", "[…]"],
      ]);
      consigne(L, [
        "LA ZONE D'EMPLOI SE RELÈVE DANS L'ATLAS, PAS AU JUGÉ.",
        "",
        "D. 1233-2 renvoie à l'atlas des zones d'emploi établi par l'Institut",
        "national de la statistique et des études économiques et les services",
        "statistiques du ministre chargé de l'emploi. Relevez le libellé et le code",
        "de la zone pour chaque commune d'implantation, et joignez l'extrait.",
        "",
        "L'APPLICATION NE CONNAÎT PAS CET ATLAS et ne le consulte pas : elle sait",
        "seulement que c'est lui qui fait foi, parce que D. 1233-2 le dit.",
        "",
        "  Périmètre retenu au terme de la délimitation : [ÉCRIRE ICI]",
        "  Salariés qui y entrent et qui n'y étaient pas : [liste nominative]",
      ]);

      L.push("4. LA REPRISE DU CLASSEMENT");
      L.push("");
      L.push("Élargir le périmètre n'est pas une formalité déclarative : cela change LES");
      L.push("PERSONNES COMPARÉES. Des salariés qui n'étaient pas dans la comparaison y");
      L.push("entrent, et le rang de chacun s'en trouve modifié.");
      L.push("");
      L.push("  1. reconstituer, pour chaque catégorie professionnelle, la liste des");
      L.push("     salariés du périmètre corrigé ;");
      L.push("  2. leur appliquer les quatre critères de L. 1233-5 — charges de famille,");
      L.push("     ancienneté de service, situation rendant la réinsertion");
      L.push("     professionnelle particulièrement difficile, qualités professionnelles");
      L.push("     appréciées par catégorie ;");
      L.push("  3. refaire le classement, et le dater ;");
      L.push("  4. n'engager la suite qu'ensuite.");
      L.push("");
      L.push("Le tableau d'application des quatre critères est le document du point de");
      L.push("contrôle CTL-COH-03.");
      L.push("");

      if (dn) {
        nonRattrapable(L,
          "Les licenciements sont déjà notifiés (notification du " + jour(dn, "date") + ").\n" +
          "L'ordre des licenciements ne se refait pas après la lettre.",
          ["L'ordre s'apprécie au jour où le licenciement est prononcé. Refaire le",
           "classement aujourd'hui produirait une grille postérieure à la",
           "notification : elle ne justifierait pas le choix opéré avant elle, et elle",
           "établirait au contraire que ce choix reposait sur un autre périmètre.",
           "",
           "Ce qui reste à faire : écrire le constat, le dater, le transmettre au",
           "conseil de l'entreprise, et mesurer avec lui l'exposition — un ordre des",
           "licenciements vicié expose le licenciement à être jugé sans cause réelle",
           "et sérieuse, avec l'indemnité du barème de L. 1235-3.",
           "",
           "Et, sur demande écrite du salarié, « l'employeur indique par écrit les",
           "critères retenus pour fixer l'ordre des licenciements » (L. 1233-43) : ce",
           "que vous écrirez alors devra être ce qui a réellement été appliqué."]);
      }

      L.push("5. LA CONCLUSION DE LA NOTE");
      L.push("");
      L.push("   [ ] Le périmètre appliqué est fondé sur l'accord collectif du [date],");
      L.push("       versé sous la cote [cote]. Rien à corriger.");
      L.push("   [ ] Le périmètre appliqué est inférieur à la zone d'emplois et aucun");
      L.push("       accord ne le fonde. Périmètre corrigé : [ÉCRIRE]. Classement refait");
      L.push("       le [date].");
      L.push("   [ ] Les licenciements sont notifiés : constat établi, conseil saisi le");
      L.push("       [date].");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-5, L. 1233-43, L. 1235-3, D. 1233-2",
        ["L'atlas des zones d'emploi, auquel D. 1233-2 renvoie, n'est pas lu par",
         "l'application : elle le nomme parce que le texte le nomme, elle n'en",
         "reproduit aucune donnée et ne dit pas dans quelle zone se trouve votre",
         "établissement.",
         "",
         "Aucune peine n'est annoncée : le corpus de ce module ne contient aucun",
         "article de sanction pénale. Ce qui se joue est l'irrégularité de l'ordre",
         "des licenciements, et l'indemnité de L. 1235-3."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ORD-02 — LA CONSTRUCTION DES CATÉGORIES PROFESSIONNELLES
     ══════════════════════════════════════════════════════════════════════ */

  /* L'effectif d'une catégorie : le nombre déclaré, sinon le nombre de
     salariés listés. C'est le décompte du contrôle, repris à l'identique. */
  function effectifCat(c) {
    if (!c) return null;
    return nb(c.effectif) !== null ? c.effectif : liste(c.salaries).length;
  }

  DP.ajouter("CTL-ORD-02", {
    nom: "Note de construction des catégories professionnelles",
    detail: "Chaque catégorie, son effectif, le regroupement des catégories d'un " +
            "seul salarié, et la justification écrite quand il est impossible.",
    produire: function (ctx) {
      var f = fic(ctx);
      var cats = liste(f.categories);
      var proteges = liste(f.salariesProteges).map(function (s) { return s && s.nom; });
      var uniques = cats.filter(function (c) { return effectifCat(c) === 1; });
      var ciblees = uniques.filter(function (c) {
        return liste(c.salaries).some(function (s) { return s && proteges.indexOf(s.nom) !== -1; });
      });
      var dn = f.dateNotification;
      var L = entete(ctx, "Note de construction des catégories professionnelles",
        "article L. 1233-5 du code du travail");

      L.push("À QUOI SERT UNE CATÉGORIE PROFESSIONNELLE");
      L.push("");
      L.push("Une catégorie professionnelle regroupe les salariés exerçant des fonctions");
      L.push("de même nature supposant une formation professionnelle commune. Elle sert à");
      L.push("CLASSER : c'est à l'intérieur d'elle que les quatre critères de L. 1233-5");
      L.push("départagent, et notamment les qualités professionnelles, que le texte");
      L.push("apprécie expressément « par catégorie ».");
      L.push("");
      L.push("Une catégorie d'une seule personne ne classe rien. Elle DÉSIGNE cette");
      L.push("personne, et elle neutralise du même coup les quatre critères : il n'y a");
      L.push("personne à qui la comparer. Lorsque cette catégorie est occupée par un");
      L.push("salarié protégé, la construction ne se lit plus comme une maladresse.");
      L.push("");
      L.push("Cette note reconstruit les catégories, ou justifie par écrit celles qui ne");
      L.push("peuvent pas l'être. Elle doit être établie AVANT l'application des critères,");
      L.push("non après : un classement fait sur des catégories fausses est un classement");
      L.push("faux.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES CATÉGORIES RETENUES, ET LEUR EFFECTIF");
      L.push("");
      var lignes = cats.map(function (c) {
        var e = effectifCat(c);
        var prot = liste(c.salaries).filter(function (s) {
          return s && proteges.indexOf(s.nom) !== -1;
        }).length;
        return [cro(c && c.nom, "catégorie"),
                e === null ? "[effectif]" : String(e),
                nb(c && c.suppressions) !== null ? String(c.suppressions) : "[suppressions]",
                prot ? String(prot) : "0",
                e === 1 ? "À TRAITER — un seul salarié" : "[ ]"];
      });
      if (!lignes.length) {
        lignes = [["[NOM DE LA CATÉGORIE]", "[effectif]", "[suppressions envisagées]",
                   "[salariés protégés]", "[ ]"]];
      }
      tableau(L, ["Catégorie professionnelle", "Effectif", "Suppressions",
                  "Dont protégés", "État"], lignes);
      L.push("   Catégories déclarées : " + cats.length +
        " — dont " + uniques.length + " ne comptant qu'un seul salarié" +
        (ciblees.length ? ", dont " + ciblees.length + " occupée(s) par un salarié protégé." : "."));
      L.push("");
      if (ciblees.length) {
        L.push("   Catégories d'un seul salarié occupées par un salarié protégé : " +
          ciblees.map(function (c) { return cro(c.nom, "catégorie"); }).join(" ; ") + ".");
        L.push("   Ce sont celles qu'il faut traiter en premier, et le plus soigneusement.");
        L.push("");
      } else if (uniques.length) {
        L.push("   Catégories d'un seul salarié : " +
          uniques.map(function (c) { return cro(c.nom, "catégorie"); }).join(" ; ") + ".");
        L.push("");
      }

      L.push("2. LE REGROUPEMENT — À TENTER AVANT DE JUSTIFIER");
      L.push("");
      L.push("Pour chaque catégorie d'un seul salarié, cherchez les fonctions de MÊME");
      L.push("NATURE supposant une FORMATION PROFESSIONNELLE COMMUNE. Les deux conditions");
      L.push("vont ensemble : ce n'est ni le seul intitulé de poste, ni le seul");
      L.push("rattachement hiérarchique.");
      L.push("");
      tableau(L, ["Catégorie d'un seul salarié", "Fonctions de même nature dans l'entreprise",
                  "Formation commune ?", "Regroupée avec", "Effectif après"],
        (uniques.length ? uniques : [{ nom: null }]).map(function (c) {
          return [c.nom ? cro(c.nom, "catégorie") : "[catégorie]",
                  "[lesquelles, nommées]", "[oui/non — laquelle]",
                  "[catégorie d'accueil]", "[effectif]"];
        }));
      consigne(L, [
        "COMMENT CHERCHER, CONCRÈTEMENT :",
        "",
        "  · la classification conventionnelle — deux emplois au même niveau et",
        "    dans la même filière relèvent souvent de la même catégorie ;",
        "  · le diplôme, le titre ou la qualification exigés à l'embauche ;",
        "  · la formation qu'il faudrait à l'un pour occuper le poste de l'autre :",
        "    si elle est courte, la formation est commune ;",
        "  · les permutations déjà pratiquées dans l'entreprise — remplacements,",
        "    polyvalence, mobilités internes. Elles se prouvent, et elles parlent.",
        "",
        "N'utilisez JAMAIS le nom du titulaire pour délimiter une catégorie.",
      ]);

      L.push("3. LA JUSTIFICATION, QUAND LE REGROUPEMENT EST IMPOSSIBLE");
      L.push("");
      L.push("Elle porte sur la FONCTION, pas sur la personne. Une justification qui");
      L.push("décrit celui qui occupe le poste au lieu de décrire le poste se retourne");
      L.push("contre son auteur.");
      L.push("");
      (uniques.length ? uniques : [{ nom: null }]).forEach(function (c) {
        L.push("  ┌── CATÉGORIE : " + (c.nom ? cro(c.nom, "catégorie") : "[NOM DE LA CATÉGORIE]"));
        L.push("  │ Formation ou diplôme exigés : [lesquels, et pourquoi ils sont propres]");
        L.push("  │ Qualification requise : [laquelle]");
        L.push("  │ Technicité de la fonction : [en quoi elle diffère des fonctions voisines]");
        L.push("  │ Fonctions les plus proches dans l'entreprise : [lesquelles]");
        L.push("  │ Ce qui empêche le regroupement avec elles : [le motif, tenant à la");
        L.push("  │   fonction — durée de formation nécessaire, habilitation, agrément]");
        L.push("  │ Pièces : [fiche de poste, référentiel de classification, offre");
        L.push("  │   d'emploi d'origine, plan de formation]");
        L.push("  └──");
        L.push("");
      });

      if (ciblees.length) {
        L.push("4. LE CAS PARTICULIER DES SALARIÉS PROTÉGÉS");
        L.push("");
        L.push("   " + ciblees.length + " catégorie(s) d'un seul salarié sont occupées par");
        L.push("   un salarié protégé : " +
          ciblees.map(function (c) { return cro(c.nom, "catégorie"); }).join(" ; ") + ".");
        L.push("");
        L.push("   Une catégorie sur mesure autour d'un salarié protégé n'est pas une");
        L.push("   maladresse de méthode : c'est ce qui sera présenté comme un ciblage, à");
        L.push("   l'inspecteur du travail d'abord, au juge ensuite. La justification du");
        L.push("   point 3 doit ici être particulièrement solide — et si elle ne l'est");
        L.push("   pas, la catégorie doit être élargie.");
        L.push("");
        L.push("   Salariés protégés déclarés au dossier : " +
          (proteges.length ? proteges.map(function (n) { return cro(n, "nom"); }).join(", ")
           : "[aucun — à vérifier]") + ".");
        L.push("");
      }

      L.push((ciblees.length ? "5" : "4") + ". LA REPRISE DU CLASSEMENT");
      L.push("");
      L.push("Une fois les catégories reconstruites, refaites l'application des quatre");
      L.push("critères de L. 1233-5 sur ces catégories, et non sur les anciennes. Le");
      L.push("tableau d'application est le document du point de contrôle CTL-COH-03.");
      L.push("");
      L.push("   Nouvelle liste des catégories : [à écrire, avec l'effectif de chacune]");
      L.push("   Date du nouveau classement : [AAAA-MM-JJ]");
      L.push("   Auteur : [nom et qualité]");
      L.push("");

      if (dn) {
        nonRattrapable(L,
          "Les licenciements sont déjà notifiés (notification du " + jour(dn, "date") + ").\n" +
          "Les catégories ne se reconstruisent pas après la lettre.",
          ["Une note de construction établie aujourd'hui serait postérieure à la",
           "notification : elle ne justifierait pas le choix opéré avant elle. Elle",
           "établirait au contraire que la construction n'avait pas été faite au",
           "moment où elle devait l'être.",
           "",
           "Ce qui reste : écrire le constat, le dater, le transmettre au conseil, et",
           "mesurer l'exposition. Et se souvenir que, sur demande écrite du salarié,",
           "« l'employeur indique par écrit les critères retenus pour fixer l'ordre",
           "des licenciements » (L. 1233-43) — ce que vous répondrez alors devra être",
           "ce qui a réellement été appliqué."]);
      }

      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-5, L. 1233-43",
        ["La définition de la catégorie professionnelle — fonctions de même nature",
         "supposant une formation professionnelle commune — ne figure dans aucun",
         "article capté par ce module : elle est reprise du contrôle CTL-ORD-02",
         "lui-même, tel que la base la porte. Ce que L. 1233-5 dit, et qui est lu à",
         "la source, c'est que les qualités professionnelles s'apprécient « par",
         "catégorie » — d'où l'importance de la manière dont les catégories sont",
         "faites.",
         "",
         "Les règles propres au licenciement des salariés protégés ne sont pas",
         "traitées ici : elles relèvent du contrôle CTL-PRT-01 et de ses textes."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-COH-03 — LE TABLEAU D'APPLICATION DES QUATRE CRITÈRES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-COH-03", {
    nom: "Tableau d'application des quatre critères de L. 1233-5, salarié par salarié",
    detail: "Les valeurs attribuées, la pièce qui justifie chacune, le repérage des " +
            "critères inertes et le classement qui en résulte.",
    produire: function (ctx) {
      var f = fic(ctx);
      var cats = liste(f.categories);
      var tous = [];
      cats.forEach(function (c) {
        liste(c.salaries).forEach(function (s) {
          if (s) tous.push({ cat: c.nom, s: s });
        });
      });
      var CRIT = [
        ["charges", "1° Charges de famille, en particulier celles des parents isolés"],
        ["anciennetePoints", "2° Ancienneté de service dans l'établissement ou l'entreprise"],
        ["social", "3° Situation rendant la réinsertion professionnelle particulièrement difficile"],
        ["qualites", "4° Qualités professionnelles appréciées par catégorie"],
      ];
      var inertes = CRIT.filter(function (k) {
        if (tous.length < 2) return false;
        var v = tous.map(function (x) { return x.s[k[0]] == null ? 0 : x.s[k[0]]; });
        return v.every(function (y) { return y === v[0]; });
      });
      var L = entete(ctx, "Tableau d'application des critères d'ordre des licenciements",
        "article L. 1233-5 du code du travail");

      L.push("LE TEXTE, LU À LA SOURCE, ET CE QU'IL EXIGE VRAIMENT");
      L.push("");
      L.push("Les critères « prennent notamment en compte : 1° Les charges de famille, en");
      L.push("particulier celles des parents isolés ; 2° L'ancienneté de service dans");
      L.push("l'établissement ou l'entreprise ; 3° La situation des salariés qui");
      L.push("présentent des caractéristiques sociales rendant leur réinsertion");
      L.push("professionnelle particulièrement difficile, notamment celle des personnes");
      L.push("handicapées et des salariés âgés ; 4° Les qualités professionnelles");
      L.push("appréciées par catégorie » (L. 1233-5).");
      L.push("");
      L.push("Et la phrase qui commande ce tableau : « L'employeur peut privilégier un de");
      L.push("ces critères, À CONDITION DE TENIR COMPTE DE L'ENSEMBLE DES AUTRES critères");
      L.push("prévus au présent article. »");
      L.push("");
      L.push("Privilégier n'est pas neutraliser. Quatre critères formellement présents");
      L.push("mais dont trois prennent la même valeur pour tout le monde ne sont pas");
      L.push("quatre critères : c'est un seul, déguisé en quatre. Le départage repose");
      L.push("alors sur le seul critère qui varie — et c'est ce que le dossier montrera.");
      L.push("");
      L.push("Ce tableau rend chaque valeur visible et chaque valeur justifiable.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES VALEURS ATTRIBUÉES, SALARIÉ PAR SALARIÉ");
      L.push("");
      var lignes = tous.map(function (x) {
        return [cro(x.cat, "catégorie"), cro(x.s.nom, "salarié"),
                x.s.charges == null ? "[ ]" : String(x.s.charges),
                x.s.anciennetePoints == null ? "[ ]" : String(x.s.anciennetePoints),
                x.s.social == null ? "[ ]" : String(x.s.social),
                x.s.qualites == null ? "[ ]" : String(x.s.qualites),
                "[total]", "[rang]"];
      });
      if (!lignes.length) {
        lignes = [["[catégorie]", "[SALARIÉ]", "[1°]", "[2°]", "[3°]", "[4°]", "[total]", "[rang]"]];
      }
      tableau(L, ["Catégorie", "Salarié", "1° Charges", "2° Ancienneté",
                  "3° Réinsertion", "4° Qualités", "Total", "Rang"], lignes);
      L.push("Le barème — combien de points par tranche, et leur pondération — est votre");
      L.push("choix, et il doit être écrit AVANT d'être appliqué : [ÉCRIRE ICI LE BARÈME");
      L.push("RETENU, critère par critère, et le dater]. Un barème établi après le");
      L.push("classement n'est pas un barème, c'est une justification.");
      L.push("");

      L.push("2. LES CRITÈRES QUI NE DÉPARTAGENT PERSONNE");
      L.push("");
      if (tous.length < 2) {
        L.push("   Moins de deux salariés sont renseignés : aucun départage n'est en jeu");
        L.push("   pour l'instant. Renseignez tous les salariés de chaque catégorie");
        L.push("   concernée — pas seulement ceux dont le licenciement est envisagé : le");
        L.push("   départage se fait entre TOUS les salariés de la catégorie.");
        L.push("");
      } else if (inertes.length) {
        L.push("   " + inertes.length + " critère(s) sur quatre prennent la MÊME VALEUR");
        L.push("   pour tous les salariés renseignés :");
        inertes.forEach(function (k) { L.push("     · " + k[1]); });
        L.push("");
        if (inertes.length >= 3) {
          L.push("   TROIS CRITÈRES OU PLUS SONT NEUTRALISÉS. Le départage ne repose donc");
          L.push("   pas sur quatre critères mais sur " +
            CRIT.filter(function (k) { return inertes.indexOf(k) === -1; })
              .map(function (k) { return k[1].replace(/^\d° /, ""); }).join(" et ") + ".");
          L.push("   La condition posée par L. 1233-5 — tenir compte de l'ensemble des");
          L.push("   autres critères — n'est pas remplie en fait, quoi qu'en dise la");
          L.push("   forme du tableau.");
          L.push("");
        } else {
          L.push("   Une identité de valeur peut être exacte : trois salariés peuvent");
          L.push("   n'avoir aucune charge de famille. Mais elle doit alors être");
          L.push("   JUSTIFIÉE SALARIÉ PAR SALARIÉ, et non résulter d'un renseignement par");
          L.push("   défaut. Le point 3 sert à cela.");
          L.push("");
        }
      } else {
        L.push("   Les quatre critères prennent des valeurs différenciées : chacun");
        L.push("   contribue au départage. Reste à justifier chaque valeur — point 3.");
        L.push("");
      }
      consigne(L, [
        "POUR CHAQUE CRITÈRE DONT LA VALEUR EST IDENTIQUE POUR TOUS, RÉPONDEZ :",
        "",
        "  [ ] l'identité est RÉELLE — dire pourquoi, salarié par salarié, et joindre",
        "      les pièces qui l'établissent ;",
        "  [ ] l'identité résulte d'un renseignement PAR DÉFAUT — la donnée n'a pas",
        "      été recherchée. Dans ce cas, recherchez-la et refaites le classement.",
        "",
        "Il n'y a pas de troisième réponse.",
      ]);

      L.push("3. LA PIÈCE QUI JUSTIFIE CHAQUE VALEUR");
      L.push("");
      L.push("Une valeur sans pièce est une opinion. Voici, critère par critère, ce qui");
      L.push("l'établit et ce que la pièce doit montrer.");
      L.push("");
      tableau(L, ["Critère", "Pièce", "Ce qu'elle doit établir"], [
        ["1° Charges de famille", "[composition de famille, situation de parent isolé]",
         "le nombre de personnes à charge à la date d'appréciation, et l'isolement le cas échéant"],
        ["2° Ancienneté de service", "[contrat de travail, registre du personnel]",
         "la date d'entrée et l'ancienneté acquise dans l'établissement ou l'entreprise"],
        ["3° Réinsertion difficile", "[reconnaissance de travailleur handicapé, âge, autres caractéristiques]",
         "la caractéristique sociale invoquée, et sa date"],
        ["4° Qualités professionnelles", "[évaluations, entretiens annuels, sanctions, résultats]",
         "une appréciation antérieure au projet, portée sur des éléments objectifs"],
      ]);
      L.push("Le 4° appelle une vigilance particulière : le texte l'apprécie « par");
      L.push("catégorie ». Une note de qualité professionnelle qui n'a jamais existé");
      L.push("avant le projet et qui apparaît avec lui se lit pour ce qu'elle est.");
      L.push("");
      L.push("   Date d'appréciation retenue pour tous les critères : [AAAA-MM-JJ]");
      L.push("   La même pour tous les salariés : c'est ce qui rend la comparaison");
      L.push("   possible.");
      L.push("");

      L.push("4. LE CLASSEMENT QUI EN RÉSULTE");
      L.push("");
      L.push("   [Reporter ici, catégorie par catégorie, le classement obtenu, du rang le");
      L.push("    plus protégé au rang le moins protégé, avec le total de chacun.]");
      L.push("");
      L.push("   Nombre de suppressions par catégorie : [reporter] — ce nombre, appliqué");
      L.push("   au classement, désigne les salariés dont le licenciement est envisagé.");
      L.push("   C'est le classement qui désigne, pas l'inverse.");
      L.push("");

      L.push("5. CE QUE VOUS DEVREZ POUVOIR ÉCRIRE AU SALARIÉ");
      L.push("");
      L.push("« Sur demande écrite du salarié, l'employeur indique par écrit les critères");
      L.push("retenus pour fixer l'ordre des licenciements » (L. 1233-43 ; la même règle");
      L.push("figure à L. 1233-17).");
      L.push("");
      L.push("Le décret précise la mécanique, lue à la source : le salarié « adresse sa");
      L.push("demande à l'employeur […] par lettre recommandée avec avis de réception ou");
      L.push("remise contre récépissé, avant l'expiration d'un délai de dix jours à");
      L.push("compter de la date à laquelle il quitte effectivement son emploi »");
      L.push("(R. 1233-1). Et l'employeur « fait connaître les critères qu'il a retenus");
      L.push("[…] par lettre recommandée avec avis de réception ou remise contre");
      L.push("récépissé, dans les dix jours suivant la présentation ou de la remise de la");
      L.push("lettre du salarié ». Le même article ajoute : « Ces délais ne sont pas des");
      L.push("délais francs. Ils expirent le dernier jour à vingt-quatre heures. »");
      L.push("");
      L.push("Dix jours pour répondre : c'est court, et ce n'est tenable que si le tableau");
      L.push("existe déjà. C'est la raison la plus pratique de le remplir maintenant.");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Tableau établi par : [NOM ET QUALITÉ]");
      L.push("Date d'établissement : [AAAA-MM-JJ] — antérieure à toute notification");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-5, L. 1233-17, L. 1233-43, R. 1233-1",
        ["Les valeurs reprises au point 1 sont celles saisies au questionnaire : ce",
         "sont des DÉCLARATIONS, non des faits établis. Chacune appelle la pièce du",
         "point 3.",
         "",
         "L'application ne fixe aucun barème et n'en propose aucun : aucun texte",
         "capté n'en fixe. Le barème est votre choix, et il est votre",
         "responsabilité."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-COH-01 — UN POSTE À LA FOIS SUPPRIMÉ ET DISPONIBLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-COH-01", {
    nom: "Note de résolution — postes déclarés à la fois supprimés et disponibles",
    detail: "Les postes en contradiction, leur situation réelle à la date utile, la " +
            "liste corrigée et la démonstration de suppression refaite.",
    produire: function (ctx) {
      var f = fic(ctx);
      var sup = liste(f.postesSupprimes);
      var dispo = liste(f.postesDisponibles);
      var entreprise = f.entreprise || pro(ctx).denomination;
      var cles = {};
      sup.forEach(function (p) {
        var k = String((p && p.intitule) || "").trim().toLowerCase();
        if (k) cles[k] = p;
      });
      var contradictoires = dispo.filter(function (p) {
        var k = String((p && p.intitule) || "").trim().toLowerCase();
        var memeSociete = !p.societe || p.societe === entreprise;
        return k && memeSociete && cles[k];
      });
      var dn = f.dateNotification;
      var L = entete(ctx, "Note de résolution — postes supprimés et postes disponibles",
        "articles L. 1233-3 et L. 1233-4 du code du travail");

      L.push("LA CONTRADICTION, ET CE QU'ELLE COÛTE");
      L.push("");
      L.push("Un poste ne peut pas être à la fois supprimé et disponible dans la même");
      L.push("entreprise. Les deux affirmations viennent de deux textes différents, et");
      L.push("elles s'excluent :");
      L.push("");
      L.push("  · L. 1233-3 fonde le licenciement sur une « suppression ou transformation");
      L.push("    d'emploi », dont « la matérialité […] s'apprécie au niveau de");
      L.push("    l'entreprise » ;");
      L.push("  · L. 1233-4 subordonne le licenciement à ce que « le reclassement de");
      L.push("    l'intéressé ne puisse être opéré SUR LES EMPLOIS DISPONIBLES ».");
      L.push("");
      L.push("Si l'emploi figure sur les deux listes, l'une des deux est fausse — et");
      L.push("quelle que soit celle qui l'est, le dossier en souffre : ou l'emploi n'est");
      L.push("pas supprimé et la cause n'est pas caractérisée, ou il n'était pas");
      L.push("disponible et le reclassement a été mal recensé.");
      L.push("");
      L.push("Cette note tranche, poste par poste, sur pièce, et refait ce qui en dépend.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES POSTES EN CONTRADICTION");
      L.push("");
      var lignes = contradictoires.map(function (p) {
        var s = cles[String(p.intitule || "").trim().toLowerCase()] || {};
        return [cro(p.intitule, "intitulé"),
                cro(p.societe || entreprise, "société"),
                nb(s.avant) !== null ? String(s.avant) : "[avant]",
                nb(s.apres) !== null ? String(s.apres) : "[après]",
                p.date ? String(p.date) : "[date de l'état]",
                "[à trancher]"];
      });
      if (!lignes.length) {
        lignes = [["[INTITULÉ DU POSTE]", "[société]", "[effectif avant]",
                   "[effectif après]", "[date de l'état]", "[à trancher]"]];
      }
      tableau(L, ["Intitulé", "Société", "Effectif avant", "Effectif après",
                  "Date de l'état des postes", "Situation retenue"], lignes);
      if (contradictoires.length) {
        L.push("   " + contradictoires.length + " poste(s) figurent à la fois parmi les");
        L.push("   postes supprimés et parmi les postes disponibles dans l'entreprise.");
        L.push("");
      } else {
        L.push("   Aucun poste n'apparaît simultanément sur les deux listes dans l'état");
        L.push("   actuel du dossier. Vérifiez tout de même les intitulés : deux libellés");
        L.push("   différents peuvent désigner le même emploi, et la contradiction se");
        L.push("   cache alors dans le vocabulaire.");
        L.push("");
      }
      L.push("   Postes supprimés déclarés : " + sup.length +
        "   —   Postes disponibles déclarés : " + dispo.length + ".");
      L.push("");

      L.push("2. LA SITUATION RÉELLE, POSTE PAR POSTE");
      L.push("");
      L.push("Pour chaque poste du point 1, établissez ce qu'il était à LA DATE UTILE —");
      L.push("celle de l'état des postes, confrontée à celle de la notification.");
      L.push("");
      (contradictoires.length ? contradictoires : [{ intitule: null }]).forEach(function (p) {
        L.push("  ┌── POSTE : " + (p.intitule ? cro(p.intitule, "intitulé") : "[INTITULÉ]"));
        L.push("  │ Situation à la date utile :");
        L.push("  │   [ ] OCCUPÉ ET SUPPRIMÉ — il sort de la liste des postes disponibles ;");
        L.push("  │       le titulaire est alors dans le projet, et le poste ne peut être");
        L.push("  │       proposé à personne.");
        L.push("  │   [ ] VACANT ET DISPONIBLE — il sort de la liste des suppressions ; la");
        L.push("  │       démonstration de suppression est à refaire sans lui.");
        L.push("  │   [ ] DEUX POSTES DISTINCTS portant le même intitulé — dire ce qui les");
        L.push("  │       distingue : lieu, classification, contenu, rattachement.");
        L.push("  │ Pièce qui l'établit : [organigramme daté, registre du personnel,");
        L.push("  │   contrat du titulaire, lettre de démission, fiche de poste]");
        L.push("  │ Date de la pièce : [AAAA-MM-JJ]");
        L.push("  └──");
        L.push("");
      });

      L.push("3. LES DEUX LISTES CORRIGÉES");
      L.push("");
      L.push("A. POSTES SUPPRIMÉS — après correction");
      L.push("");
      tableau(L, ["Intitulé", "Service", "Effectif avant", "Effectif après", "Suppressions"],
        (sup.length ? sup : [{}]).map(function (p) {
          return [cro(p && p.intitule, "intitulé"), cro(p && p.service, "service"),
                  nb(p && p.avant) !== null ? String(p.avant) : "[avant]",
                  nb(p && p.apres) !== null ? String(p.apres) : "[après]",
                  (nb(p && p.avant) !== null && nb(p && p.apres) !== null)
                    ? String(p.avant - p.apres) : "[écart]"];
        }));
      L.push("B. POSTES DISPONIBLES — après correction");
      L.push("");
      tableau(L, ["Société", "Intitulé", "Lieu", "Classification", "Date de l'état"],
        (dispo.length ? dispo : [{}]).map(function (p) {
          return [cro(p && p.societe, "société"), cro(p && p.intitule, "intitulé"),
                  cro(p && p.lieu, "lieu"), cro(p && p.classification, "classification"),
                  p && p.date ? String(p.date) : "[date]"];
        }));
      L.push("Les deux tableaux reprennent l'état actuel du dossier : rayez, corrigez,");
      L.push("et réenregistrez ensuite les listes corrigées dans le dossier d'audit.");
      L.push("");

      L.push("4. CE QU'IL FAUT REFAIRE ENSUITE");
      L.push("");
      L.push("  1. Le DÉCOMPTE DES SUPPRESSIONS — il commande le seuil de dix, donc le");
      L.push("     régime de la procédure (L. 1233-28) et, à cinquante salariés, le plan");
      L.push("     de sauvegarde de l'emploi (L. 1233-61).");
      L.push("  2. La DÉMONSTRATION DE SUPPRESSION D'EMPLOI, sans le poste retiré.");
      L.push("  3. Le DÉCOMPTE DES POSTES À PROPOSER au reclassement, et les offres qui en");
      L.push("     découlent.");
      L.push("  4. Si la démonstration a déjà été présentée au comité social et");
      L.push("     économique, la lui REMETTRE corrigée : un comité consulté sur des");
      L.push("     chiffres faux n'a pas été consulté sur le projet.");
      L.push("");
      L.push("   [Écrire ici ce qui change : nombre de suppressions avant / après,");
      L.push("    nombre de postes disponibles avant / après, régime applicable.]");
      L.push("");

      if (dn) {
        nonRattrapable(L,
          "Les licenciements sont déjà notifiés (notification du " + jour(dn, "date") + ").",
          ["Un poste disponible non proposé avant la lettre ne se propose pas après :",
           "L. 1233-4 fait de l'impossibilité du reclassement une CONDITION du",
           "licenciement, appréciée au jour où il est prononcé.",
           "",
           "Corrigez les listes pour dire le vrai, et n'en tirez pas un rattrapage.",
           "Le constat, daté et signé, se transmet au conseil de l'entreprise : c'est",
           "lui qui dira ce qui est encore utile et ce qui ne l'est plus."]);
      }

      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-4, L. 1233-28, L. 1233-61",
        ["Les intitulés des postes sont rapprochés à l'identique, après mise en",
         "minuscules et suppression des espaces de bord. Deux libellés différents",
         "désignant le même emploi échappent donc au rapprochement : c'est à vous de",
         "les voir, et c'est le premier travail à faire au point 1."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-COH-02 — UN MÊME POSTE PROPOSÉ À PLUSIEURS SALARIÉS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-COH-02", {
    nom: "Liste des offres de reclassement et critères de départage entre candidatures",
    detail: "Les offres regroupées par poste, le nombre réel de postes offerts, les " +
            "critères de départage et le délai de candidature exigés par D. 1233-2-1.",
    produire: function (ctx) {
      var f = fic(ctx);
      var offres = liste(f.offresFaites);
      var parPoste = {};
      offres.forEach(function (o) {
        if (!o) return;
        var cle = [o.intitule, o.employeur, o.lieu].join(" | ");
        if (!parPoste[cle]) parPoste[cle] = { o: o, salaries: [] };
        if (parPoste[cle].salaries.indexOf(o.salarie) === -1)
          parPoste[cle].salaries.push(o.salarie);
      });
      var cles = Object.keys(parPoste);
      var partages = cles.filter(function (k) { return parPoste[k].salaries.length > 1; });
      var procColl = f.procedureCollective === true &&
        (f.typeProcedure === "redressement" || f.typeProcedure === "liquidation");
      var dn = f.dateNotification;
      var L = entete(ctx, "Liste des offres de reclassement et critères de départage",
        "article L. 1233-4 et article D. 1233-2-1 du code du travail");

      L.push("LE NOMBRE D'OFFRES NE VAUT PAS NOMBRE DE POSTES");
      L.push("");
      L.push("Proposer le même poste à cinq salariés, c'est adresser cinq offres et");
      L.push("n'offrir qu'un emploi. Sans critères de départage, quatre d'entre eux");
      L.push("recevront un refus qu'aucune règle n'explique — et l'obligation de");
      L.push("reclassement de L. 1233-4 n'aura été satisfaite que pour un seul.");
      L.push("");
      L.push("Le texte a prévu le cas, et il l'a prévu précisément. « En cas de diffusion");
      L.push("d'une liste des offres de reclassement interne, celle-ci comprend les postes");
      L.push("disponibles situés sur le territoire national dans l'entreprise et les");
      L.push("autres entreprises du groupe dont l'entreprise fait partie. LA LISTE PRÉCISE");
      L.push("LES CRITÈRES DE DÉPARTAGE ENTRE SALARIÉS EN CAS DE CANDIDATURES MULTIPLES");
      L.push("SUR UN MÊME POSTE, AINSI QUE LE DÉLAI DONT DISPOSE LE SALARIÉ POUR PRÉSENTER");
      L.push("SA CANDIDATURE ÉCRITE. Ce délai ne peut être inférieur à quinze jours francs");
      L.push("à compter de la publication de la liste, sauf lorsque l'entreprise fait");
      L.push("l'objet d'un redressement ou d'une liquidation judiciaire. Dans les");
      L.push("entreprises en redressement ou liquidation judiciaire, ce délai ne peut être");
      L.push("inférieur à quatre jours francs à compter de la publication de la liste.");
      L.push("L'absence de candidature écrite du salarié à l'issue du délai mentionné au");
      L.push("deuxième alinéa vaut refus des offres » (D. 1233-2-1, III).");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("1. LES OFFRES REGROUPÉES PAR POSTE");
      L.push("");
      var lignes = cles.map(function (k) {
        var x = parPoste[k];
        return [cro(x.o.intitule, "intitulé"), cro(x.o.employeur, "employeur"),
                cro(x.o.lieu, "lieu"),
                String(x.salaries.length),
                x.salaries.map(function (n) { return cro(n, "salarié"); }).join(", "),
                x.salaries.length > 1 ? "DÉPARTAGE REQUIS" : "un seul destinataire"];
      });
      if (!lignes.length) {
        lignes = [["[INTITULÉ]", "[employeur]", "[lieu]", "[nb]", "[salariés]", "[ ]"]];
      }
      tableau(L, ["Intitulé du poste", "Employeur", "Lieu", "Destinataires",
                  "Lesquels", "État"], lignes);
      L.push("   Offres adressées : " + offres.length +
        "   —   Postes distincts : " + cles.length +
        "   —   Postes partagés : " + partages.length + ".");
      L.push("");
      if (partages.length) {
        L.push("   " + partages.length + " poste(s) sont proposés simultanément à");
        L.push("   plusieurs salariés. Le compte réel des postes offerts à chacun est");
        L.push("   donc inférieur au nombre d'offres qu'il a reçues.");
        L.push("");
      }

      L.push("2. LE COMPTE RÉEL, SALARIÉ PAR SALARIÉ");
      L.push("");
      L.push("C'est ce tableau-là qui compte, et c'est celui qu'on ne fait jamais.");
      L.push("");
      var parSalarie = {};
      offres.forEach(function (o) {
        if (!o) return;
        var n = o.salarie == null ? "" : o.salarie;
        (parSalarie[n] = parSalarie[n] || []).push(o);
      });
      var lignesS = Object.keys(parSalarie).map(function (n) {
        var os = parSalarie[n];
        var exclusifs = os.filter(function (o) {
          var cle = [o.intitule, o.employeur, o.lieu].join(" | ");
          return parPoste[cle] && parPoste[cle].salaries.length === 1;
        }).length;
        return [cro(n, "salarié"), String(os.length), String(exclusifs),
                String(os.length - exclusifs), "[postes réellement acquis : à écrire]"];
      });
      if (!lignesS.length) {
        lignesS = [["[SALARIÉ]", "[offres reçues]", "[dont exclusives]",
                    "[dont partagées]", "[ ]"]];
      }
      tableau(L, ["Salarié", "Offres reçues", "Dont non partagées",
                  "Dont partagées", "Ce dont il dispose réellement"], lignesS);

      L.push("3. LES CRITÈRES DE DÉPARTAGE");
      L.push("");
      L.push("Ils s'écrivent AVANT de recevoir les candidatures, ils figurent SUR LA");
      L.push("LISTE elle-même, et ils sont les mêmes pour tous les postes partagés.");
      L.push("");
      consigne(L, [
        "CRITÈRES DE DÉPARTAGE EN CAS DE CANDIDATURES MULTIPLES SUR UN MÊME POSTE :",
        "",
        "  [ÉCRIRE ICI LES CRITÈRES, dans l'ordre où ils s'appliquent, et dire ce",
        "   qui départage en cas d'égalité sur le premier. Chaque critère doit être",
        "   vérifiable sur pièce et applicable sans appréciation nouvelle : une",
        "   règle qui se décide au moment où on l'applique n'est pas une règle.]",
        "",
        "  Exemples de formulations à proscrire : « le meilleur profil », « le plus",
        "  adapté », « l'appréciation de la direction ». Elles ne départagent rien",
        "  et elles ne se contrôlent pas.",
        "",
        "  Ces critères sont-ils fixés par un accord collectif ? [oui / non]",
        "  Si oui : [référence de l'accord et de son article].",
      ]);

      L.push("4. LE DÉLAI DE CANDIDATURE");
      L.push("");
      L.push("   Régime applicable : " +
        (procColl ? "l'entreprise fait l'objet d'un " +
           (f.typeProcedure === "liquidation" ? "liquidation judiciaire" : "redressement judiciaire") +
           " — le délai ne peut être inférieur à QUATRE JOURS FRANCS."
         : f.procedureCollective === true
           ? "procédure collective déclarée — vérifiez sa nature : quatre jours francs en redressement ou liquidation, quinze jours francs sinon."
           : "droit commun — le délai ne peut être inférieur à QUINZE JOURS FRANCS."));
      L.push("");
      L.push("   Point de départ : la publication de la liste. [Date de publication :");
      L.push("   AAAA-MM-JJ, et par quel moyen conférant date certaine.]");
      L.push("   Délai retenu : [nombre de jours] — Date limite de candidature : [date]");
      L.push("");
      L.push("« L'absence de candidature écrite du salarié à l'issue du délai […] vaut");
      L.push("refus des offres » (D. 1233-2-1, III). Le délai n'est donc pas une");
      L.push("commodité : c'est lui qui transforme un silence en refus, et un délai trop");
      L.push("court prive ce refus de sa base.");
      L.push("");
      L.push("Le décompte des jours francs n'est pas fait par l'application : elle lit le");
      L.push("plancher dans le texte, elle ne calcule pas la date d'expiration.");
      L.push("");

      L.push("5. CE QUE CHAQUE OFFRE DOIT PRÉCISER");
      L.push("");
      L.push("Le II de D. 1233-2-1, lu à la source : « Ces offres écrites précisent :");
      L.push("a) L'intitulé du poste et son descriptif ; b) Le nom de l'employeur ;");
      L.push("c) La nature du contrat de travail ; d) La localisation du poste ; e) Le");
      L.push("niveau de rémunération ; f) La classification du poste. »");
      L.push("");
      L.push("Et le I : l'employeur adresse les offres de manière personnalisée ou");
      L.push("communique la liste « par tout moyen permettant de conférer date certaine ».");
      L.push("");
      var manqueMentions = offres.filter(function (o) {
        return o && (!o.intitule || !o.descriptif || !o.employeur || !o.contrat ||
                     !o.lieu || !o.remuneration || !o.classification);
      });
      if (offres.length) {
        L.push("   Offres au dossier ne portant pas les six mentions : " +
          manqueMentions.length + " sur " + offres.length + ".");
        L.push("   Le contrôle des six mentions relève du point CTL-REC-03 ; il est");
        L.push("   rappelé ici parce qu'une liste diffusée doit les porter aussi.");
        L.push("");
      }

      L.push("6. CE QU'IL FAUT FAIRE MAINTENANT");
      L.push("");
      if (dn) {
        nonRattrapable(L,
          "Les licenciements sont déjà notifiés (notification du " + jour(dn, "date") + ").",
          ["Des critères de départage communiqués aujourd'hui ne rendent pas régulière",
           "une liste diffusée sans eux : le salarié devait pouvoir candidater en",
           "connaissance de cause, dans le délai qui lui était ouvert, AVANT que la",
           "lettre parte.",
           "",
           "Écrivez le constat, comptez combien de salariés se sont vu opposer un",
           "refus sur un poste partagé, et transmettez au conseil : c'est l'ampleur",
           "de l'exposition qu'il faut mesurer, pas un rattrapage qu'il faut",
           "chercher."]);
      } else {
        L.push("  1. Écrire les critères de départage (point 3).");
        L.push("  2. Les COMMUNIQUER aux salariés concernés, avec le délai de candidature,");
        L.push("     par un moyen conférant date certaine.");
        L.push("  3. ROUVRIR le délai de candidature à compter de cette communication :");
        L.push("     un salarié qui a répondu sans connaître les critères n'a pas");
        L.push("     candidaté en connaissance de cause.");
        L.push("  4. Refaire le décompte des postes réellement offerts à chacun (point 2)");
        L.push("     et COMPLÉTER les offres si le compte n'y est pas.");
        L.push("  5. Ne notifier qu'ensuite.");
        L.push("");
      }
      L.push("   Date de communication des critères : [AAAA-MM-JJ]");
      L.push("   Moyen employé : [remise contre décharge, lettre recommandée, envoi");
      L.push("   électronique horodaté]");
      L.push("   Nouveau délai de candidature : [du … au …]");
      L.push("");
      L.push("Fait à " + lieuDe(ctx) + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Établi par : [NOM ET QUALITÉ]");
      L.push("Visa : " + signataire(ctx));
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1",
        ["Les offres sont regroupées sur le triplet intitulé / employeur / lieu, qui",
         "est le regroupement du contrôle CTL-COH-02. Deux offres portant le même",
         "emploi sous deux libellés différents ne sont donc pas rapprochées : à vous",
         "de les voir.",
         "",
         "L'application ne calcule pas les jours francs : elle lit dans D. 1233-2-1",
         "les planchers de quinze et de quatre jours, et s'arrête là."])).join("\n");
    },
  });

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
