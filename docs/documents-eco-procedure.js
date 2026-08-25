/* Les documents que l'application PRODUIT — licenciement pour motif économique :
   reclassement, suppression d'emploi, cause économique.

   POURQUOI CE FICHIER EXISTE

   Les fiches de moteur/economique/regularisation-eco.js disent à l'employeur
   quel document il lui fallait : « état daté des postes disponibles », « offre
   de reclassement écrite », « tableau des actions de formation ». Elles ne le
   produisent pas. Un employeur à qui l'on explique qu'il aurait dû établir un
   état daté des postes n'a toujours pas d'état des postes, et la page blanche
   qu'il a devant lui est exactement ce qui, six mois plus tard, manquera au
   dossier.

   Ce fichier écrit les vingt documents des rubriques « reclassement »,
   « emploi » et « cause économique » : la pièce elle-même, à l'en-tête de
   l'entreprise, avec les dates de son dossier et les délais calculés à partir
   d'elles, accompagnée des courriers qui la font vivre et du calendrier qui
   dit dans quel ordre les actes se placent.

   CE QUI EST PROPRE À CE MODULE, ET QUI COMMANDE TOUT

   Les obligations du licenciement économique s'apprécient AU JOUR DE LA
   NOTIFICATION. Un état des postes redaté, une offre complétée après la lettre,
   une attestation d'absence de poste établie une fois le salarié parti ne
   régularisent rien : ils ajoutent une pièce postérieure à un acte antérieur,
   et la pièce elle-même prouve alors que la recherche n'était pas faite. Les
   documents qui touchent à ces points portent donc un encadré « CE QUI NE SE
   RATTRAPE PAS » : il dit ce qui est acquis, et ce qui reste à faire — arrêter
   ce qui peut encore l'être, documenter ce qui avait réellement été fait avant
   la lettre, et ne rien antidater. Antidater une pièce n'est pas une
   régularisation ; c'est un risque d'une autre nature, et l'application ne le
   proposera jamais.

   TROIS RÈGLES, TENUES PARTOUT

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Les seuls articles cités ici sont ceux
      que porte moteur/economique/textes_eco.json, avec leur identifiant de
      version — L. 1233-2 (LEGIARTI000019071124), L. 1233-3
      (LEGIARTI000036762081), L. 1233-4 (LEGIARTI000036261863), D. 1233-2-1
      (LEGIARTI000036248612), L. 1233-16 (LEGIARTI000036762077), L. 1235-1
      (LEGIARTI000035643446), L. 1235-2 (LEGIARTI000036261950), L. 1235-3
      (LEGIARTI000036762052) — ou ceux que le contrôle porte en fondement.
      Les articles seulement RENVOYÉS par ces textes — L. 233-1, L. 233-3 et
      L. 233-16 du code de commerce pour la notion de groupe, L. 1237-11 et
      L. 1237-17 pour les ruptures exclues — sont NOMMÉS, jamais reproduits ni
      paraphrasés : l'application ne les a pas lus, et elle le dit à l'endroit
      où le lecteur pourrait croire qu'elle les connaît.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ. Aucun texte
      du corpus de ce module ne punit d'une amende le défaut d'état des postes,
      l'offre incomplète ou l'absence de démonstration comptable. Ces documents
      ne menacent donc de rien de tel. Ce qui se joue est écrit tel que les
      textes lus le portent : le licenciement « est justifié par une cause
      réelle et sérieuse » (L. 1233-2) ; à défaut, le juge peut proposer la
      réintégration et, si elle est refusée, octroie l'indemnité du barème de
      L. 1235-3 ; et « si un doute subsiste, il profite au salarié »
      (L. 1235-1).

   3. LES FAITS NE S'INVENTENT JAMAIS. Aucun de ces documents n'écrit ce que
      l'entreprise a fait, ce qu'elle a cherché, ni ce qu'un salarié a répondu.
      Ce que le dossier de l'audit porte est repris tel quel et attribué à ce
      dossier ; tout le reste sort ENTRE CROCHETS, avec la consigne de l'écrire
      daté et circonstancié. Un tableau prérempli d'exemples serait pire
      qu'une page blanche : il ferait signer à l'employeur des affirmations
      qu'il n'a pas vérifiées.

   CE QUE LE CORPUS NE PORTE PAS, ET QUI MANQUE ICI

   Trois besoins n'ont pas trouvé de texte dans le corpus du module, et les
   documents concernés sont écrits sans, en le disant :
     · le registre unique du personnel (CTL-REC-11, CTL-EMP-02) : l'obligation
       de le tenir n'est portée par aucun article capté ici ; le document le
       nomme comme pièce, sans citer d'article ;
     · la faute et la légèreté blâmable de l'employeur (CTL-ECO-06) : le texte
       de L. 1233-3, 4° lu à la source ne les mentionne pas ; la réserve est
       d'origine prétorienne et le document l'écrit comme telle ;
     · le délai de réponse à une offre PERSONNALISÉE (CTL-REC-09) : D. 1233-2-1
       ne fixe de plancher — quinze jours francs, quatre en redressement ou
       liquidation judiciaire — que pour la LISTE diffusée du III. Aucun
       plancher n'est donc affirmé pour l'offre personnalisée : le document dit
       que le délai doit être écrit et raisonnable, et il laisse le nombre à
       l'employeur.                                                            */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-eco-procedure.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE DATE

     Les dates du dossier économique sont des chaînes « AAAA-MM-JJ » —
     dateNotification, dateEntretien, dateInfoCSE, et la date portée par chaque
     pièce. Elles sont lues en heure locale : un midi UTC suffirait à décaler
     d'un jour l'affichage chez un lecteur situé assez à l'ouest, et un document
     daté du mauvais jour est pire qu'un document non daté.
     ════════════════════════════════════════════════════════════════════════ */

  function estISO(v) {
    return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
      !isNaN(new Date(v + "T12:00:00Z").getTime());
  }
  function dateDe(iso) {
    if (!estISO(iso)) return null;
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function isoDe(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return null;
    var m = d.getMonth() + 1, j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (j < 10 ? "0" + j : j);
  }
  /* Une date du dossier, écrite en toutes lettres — ou son crochet. */
  function jour(iso, quoi) {
    var d = dateDe(iso);
    return d ? leJour(d) : "[" + (quoi || "date") + "]";
  }
  function aujourd(ctx) {
    var d = ctx && ctx.aujourdhui;
    if (d instanceof Date && !isNaN(d.getTime())) return d;
    var x = new Date(d);
    return isNaN(x.getTime()) ? new Date() : x;
  }
  /* Le nombre de jours qui séparent deux dates du dossier. Sert à mesurer, non
     à qualifier : aucun texte du module ne fixe de délai chiffré entre l'état
     des postes et la lettre. */
  function ecartJours(a, b) {
    var x = dateDe(a), y = dateDe(b);
    if (!x || !y) return null;
    return Math.round((y.getTime() - x.getTime()) / 86400000);
  }
  /* Le jour où l'on sera, n jours après aujourd'hui — pour les calendriers. */
  function dansJours(ctx, n) { return leJour(dans(aujourd(ctx), n)); }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE TEXTE ET DE TABLEAU
     ════════════════════════════════════════════════════════════════════════ */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  /* Une colonne de largeur fixe : les tableaux de ces documents s'impriment en
     texte, et une colonne qui déborde rend la ligne illisible. */
  function col(v, n) {
    var s = String(v == null ? "" : v);
    if (s.length > n - 1) s = s.slice(0, n - 2) + "…";
    while (s.length < n) s += " ";
    return s;
  }

  function nomDe(ctx) {
    var p = ctx.profil || {}, f = ctx.fiche || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }

  /* Une pièce du dossier, si elle y est — avec sa date et son auteur. */
  function pieceDe(f, code) {
    var l = f && Array.isArray(f.pieces) ? f.pieces : [];
    for (var i = 0; i < l.length; i++) if (l[i] && l[i].code === code) return l[i];
    return null;
  }

  function liste(f, champ) {
    var v = f && f[champ];
    return Array.isArray(v) ? v : [];
  }

  /* Les sociétés du groupe, séparées selon le seul critère que L. 1233-4 retient
     pour le reclassement : l'établissement sur le territoire national. */
  function societesFR(f) {
    return liste(f, "societes").filter(function (s) { return s && !s.etranger; });
  }
  function societesEtrangeres(f) {
    return liste(f, "societes").filter(function (s) { return s && s.etranger; });
  }

  /* Le nombre de salariés dont le licenciement est envisagé, tel que le dossier
     le déclare — jamais recalculé, jamais supposé. */
  function nbLic(f) {
    return typeof f.nbLicenciements === "number" ? f.nbLicenciements : null;
  }

  /* Les noms des salariés que le dossier connaît : ceux des catégories
     professionnelles et ceux de la liste nominative. L'audit décrit une
     procédure, pas des personnes : cette liste peut être vide, et le document
     bascule alors sur des crochets. */
  function nomsSalaries(f) {
    var vus = {}, out = [];
    liste(f, "categories").forEach(function (c) {
      (c && Array.isArray(c.salaries) ? c.salaries : []).forEach(function (s) {
        if (s && s.nom && !vus[s.nom]) { vus[s.nom] = 1; out.push(s.nom); }
      });
    });
    liste(f, "salaries").forEach(function (s) {
      if (s && s.nom && !vus[s.nom]) { vus[s.nom] = 1; out.push(s.nom); }
    });
    return out;
  }

  /* ════════════════════════════════════════════════════════════════════════
     CE QUI EST EN JEU, ÉCRIT UNE FOIS POUR TOUTES

     Aucun texte du corpus de ce module ne punit d'une amende le défaut de ces
     pièces. Ce bloc dit donc ce qui se joue réellement, avec les mots des
     textes lus, et il est le seul endroit d'où les documents tirent leur
     avertissement.
     ════════════════════════════════════════════════════════════════════════ */
  function blocEnjeu(quoi) {
    return [
      "CE QUI SE JOUE",
      "",
      "« Tout licenciement pour motif économique est motivé dans les conditions",
      "définies par le présent chapitre. Il est justifié par une cause réelle et",
      "sérieuse » (L. 1233-2).",
      "",
      quoi,
      "",
      "Si le licenciement survient pour une cause qui n'est pas réelle et sérieuse,",
      "le juge peut proposer la réintégration du salarié avec maintien de ses",
      "avantages acquis ; si l'une ou l'autre des parties la refuse, il octroie au",
      "salarié une indemnité à la charge de l'employeur, comprise entre les montants",
      "minimaux et maximaux du tableau de L. 1235-3 — de un à vingt mois de salaire",
      "brut selon l'ancienneté, avec un plancher abaissé dans les entreprises",
      "employant habituellement moins de onze salariés.",
      "",
      "Il appartient au juge « d'apprécier la régularité de la procédure suivie et le",
      "caractère réel et sérieux des motifs invoqués par l'employeur » au vu des",
      "éléments fournis par les parties, et « si un doute subsiste, il profite au",
      "salarié » (L. 1235-1). C'est pourquoi ces documents existent : ce qui n'est",
      "pas écrit ne sera pas produit, et ce qui n'est pas produit ne sera pas retenu.",
      "",
    ];
  }

  /* L'encadré des points qui ne se rattrapent pas. Il ne remplace jamais le
     document : il le précède, pour que l'employeur sache ce qu'il signe. */
  function blocNonRattrapable(lignes) {
    var L = [GROS, "CE QUI NE SE RATTRAPE PAS", GROS, ""];
    lignes.forEach(function (l) { L.push(l); });
    L.push("");
    L.push("N'ANTIDATEZ RIEN. Une pièce redatée après coup ne répare pas le dossier ;");
    L.push("elle l'expose, et elle expose celui qui l'a signée. Ce qui reste utile est");
    L.push("de documenter ce qui avait RÉELLEMENT été fait avant la lettre, à sa date");
    L.push("réelle, et de porter le point à la connaissance du conseil de l'entreprise.");
    L.push("");
    return L;
  }

  /* Le pied commun : d'où vient ce qui est écrit, et ce que le document ne dit
     pas. Même forme que dans les autres modules — deux façons d'écrire un pied
     dans deux documents de la même entreprise se remarquent tout de suite. */
  function pied(articles, notes) {
    var L = ["", TRAIT, ""];
    L.push("Fondement : " + articles + ".");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur identifiant");
    L.push("de version dans moteur/economique/textes_eco.json.");
    if (notes && notes.length) { L.push(""); notes.forEach(function (n) { L.push(n); }); }
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords d'entreprise et, le cas échéant, votre accord de méthode peuvent");
    L.push("ajouter des exigences que l'application ne lit pas. Ne laissez aucun crochet");
    L.push("dans la pièce que vous versez, remettez ou envoyez.");
    return L;
  }

  /* Le calendrier : il ne se déduit pas d'un texte, il se compte à partir des
     dates du dossier. Les documents qui en portent un l'ouvrent par cette
     ligne, et ajoutent leurs propres échéances. */
  function ouvrirCalendrier(ctx) {
    var f = ctx.fiche || {};
    var L = [GROS, "VOTRE CALENDRIER", GROS, ""];
    L.push("Compté depuis aujourd'hui, " + leJour(aujourd(ctx)) + ".");
    L.push("");
    if (estISO(f.dateNotification)) {
      L.push("Date de notification portée au dossier : " + jour(f.dateNotification) + ".");
      var e = ecartJours(isoDe(aujourd(ctx)), f.dateNotification);
      if (e !== null) {
        L.push(e > 0
          ? "Elle est dans " + e + " jour(s) : tout ce qui suit doit être accompli avant elle."
          : (e === 0
            ? "Elle est aujourd'hui : plus rien ne peut être accompli avant elle."
            : "Elle est passée depuis " + Math.abs(e) + " jour(s) : lisez d'abord l'encadré ci-dessus."));
      }
      L.push("");
    } else {
      L.push("Le dossier ne porte pas de date de notification. Fixez-la, et placez-la");
      L.push("APRÈS toutes les échéances ci-dessous : c'est au jour de la lettre que");
      L.push("l'obligation s'apprécie.");
      L.push("");
    }
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-01 — L'ÉTAT DATÉ DES POSTES DISPONIBLES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-01", {
    nom: "L'état daté des postes disponibles, société par société",
    detail: "L'état lui-même, sa page de signature, le bordereau des réponses " +
            "reçues et le calendrier qui le place avant les offres et avant la lettre.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var postes = liste(f, "postesDisponibles");
      var pe = pieceDe(f, "etat-postes");
      var L = entete(ctx, "État daté des postes disponibles",
        "article L. 1233-4 du code du travail");

      L.push("CE QUE LE TEXTE EXIGE");
      L.push("");
      L.push("« Le licenciement pour motif économique d'un salarié ne peut intervenir");
      L.push("que lorsque tous les efforts de formation et d'adaptation ont été réalisés");
      L.push("et que le reclassement de l'intéressé ne peut être opéré sur les emplois");
      L.push("disponibles, situés sur le territoire national dans l'entreprise ou les");
      L.push("autres entreprises du groupe dont l'entreprise fait partie et dont");
      L.push("l'organisation, les activités ou le lieu d'exploitation assurent la");
      L.push("permutation de tout ou partie du personnel » (L. 1233-4).");
      L.push("");
      L.push("Ce n'est pas une formalité qui accompagne le licenciement : c'est une");
      L.push("CONDITION du licenciement. Elle s'apprécie au jour où la lettre part, et");
      L.push("c'est à l'employeur d'établir qu'elle était remplie ce jour-là. L'état des");
      L.push("postes est la pièce qui date la recherche : sans lui, il n'y a rien à");
      L.push("produire, et une recherche non prouvée est traitée comme une recherche non");
      L.push("faite.");
      L.push("");
      L.push("Le même article renvoie, pour la notion de groupe, aux articles L. 233-1,");
      L.push("aux I et II de l'article L. 233-3 et à l'article L. 233-16 du code de");
      L.push("commerce. Ces articles ne sont pas au code du travail : l'application ne");
      L.push("les a pas lus et n'en reproduit pas le contenu. Faites vérifier par votre");
      L.push("conseil quelles sociétés y répondent.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE DÉJÀ");
      L.push("");
      if (pe) {
        L.push("Une pièce « état des postes » figure au dossier : " +
          cro(pe.fichier, "fichier") + ", datée du " + jour(pe.date, "date non portée") +
          ", établie par " + cro(pe.auteur, "auteur non renseigné") + ".");
        L.push("Périmètre déclaré : " + cro(pe.perimetre, "non renseigné") + ".");
      } else {
        L.push("Aucune pièce « état des postes » n'est versée au dossier. C'est celle");
        L.push("que le document ci-dessous établit.");
      }
      L.push(postes.length
        ? postes.length + " poste(s) disponible(s) sont renseignés dans la fiche : ils sont"
        : "Aucun poste disponible n'est renseigné dans la fiche : le tableau ci-dessous");
      L.push(postes.length
        ? "repris tels quels dans le tableau, sans être complétés ni interprétés."
        : "est à remplir ligne à ligne. S'il n'y a réellement aucun poste, c'est le");
      if (!postes.length) {
        L.push("document du point CTL-REC-04 — l'attestation d'absence de poste — qu'il");
        L.push("vous faut, et non celui-ci : l'absence de poste se justifie, elle ne se");
        L.push("déclare pas.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — ÉTAT DES POSTES DISPONIBLES");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("ÉTAT DES EMPLOIS DISPONIBLES SUR LE TERRITOIRE NATIONAL");
      L.push("Établi au [DATE D'ARRÊTÉ DE L'ÉTAT — c'est cette date qui devra être");
      L.push("antérieure à toute offre et à toute notification]");
      L.push("");
      L.push("Périmètre de permutation retenu (L. 1233-4) :");
      var fr = societesFR(f);
      if (fr.length) {
        fr.forEach(function (s) {
          L.push("  · " + cro(s.nom, "société") + " — " + cro(s.activite, "activité") +
            (s.effectif != null ? " — " + s.effectif + " salariés" : ""));
        });
      } else {
        L.push("  · " + nom + " [et, s'il y a lieu, les autres sociétés du groupe");
        L.push("    établies sur le territoire national dont l'organisation, les");
        L.push("    activités ou le lieu d'exploitation assurent la permutation de tout");
        L.push("    ou partie du personnel — à énumérer nommément]");
      }
      var etr = societesEtrangeres(f);
      if (etr.length) {
        L.push("");
        L.push("Écartées du présent état comme non établies sur le territoire national :");
        etr.forEach(function (s) {
          L.push("  · " + cro(s.nom, "société") + " (" + cro(s.pays, "pays") + ")");
        });
        L.push("  Leurs postes ne satisfont pas l'obligation de L. 1233-4 et ne sont pas");
        L.push("  décomptés (voir le point CTL-REC-12).");
      }
      L.push("");
      L.push(col("Société", 26) + col("Intitulé du poste", 26) + col("Lieu", 14) + "Classification");
      L.push(col("", 26) + col("", 26) + col("", 14) + "et rémunération");
      L.push(TRAIT);
      if (postes.length) {
        postes.forEach(function (x) {
          L.push(col(x.societe, 26) + col(x.intitule, 26) + col(x.lieu, 14) +
            cro(x.classification, "classification") + " · " + cro(x.remuneration, "rémunération"));
        });
      }
      for (var i = 0; i < 4; i++)
        L.push(col("[société]", 26) + col("[intitulé du poste]", 26) + col("[lieu]", 14) +
          "[classification] · [rémunération]");
      L.push(TRAIT);
      L.push("");
      L.push("Pour chaque ligne, joindre le descriptif du poste et la nature du contrat :");
      L.push("ce sont deux des six mentions que l'offre devra porter (D. 1233-2-1, II).");
      L.push("");
      L.push("Postes recensés puis ÉCARTÉS, avec le motif d'exclusion :");
      L.push(col("Poste", 30) + col("Société", 24) + "Motif d'exclusion");
      L.push(TRAIT);
      L.push(col("[intitulé]", 30) + col("[société]", 24) + "[motif — poste pourvu à la date");
      L.push(col("", 30) + col("", 24) + " d'arrêté, qualification hors de portée");
      L.push(col("", 30) + col("", 24) + " d'une adaptation, etc.]");
      L.push(TRAIT);
      L.push("Un poste sans motif écrit est un poste omis : c'est ce que vérifie le");
      L.push("point CTL-REC-07.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — SIGNATURE ET CERTIFICATION DE L'ÉTAT");
      L.push(GROS);
      L.push("");
      L.push("Je soussigné(e) " + cro(p.responsable, "nom, prénom") + ",");
      L.push("[qualité — la personne qui a réellement établi l'état, et qui pourra en");
      L.push("répondre], certifie que l'état ci-dessus recense les emplois disponibles");
      L.push("dans les sociétés énumérées, tels qu'ils ressortent des réponses écrites");
      L.push("reçues de chacune et des pièces annexées, à la date du [DATE D'ARRÊTÉ].");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE]");
      L.push("");
      L.push("Signature");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — BORDEREAU DES PIÈCES ANNEXÉES");
      L.push(GROS);
      L.push("");
      L.push("  1. Réponse écrite de chaque société interrogée, y compris les réponses");
      L.push("     négatives (le document du point CTL-REC-02 les demande et les suit).");
      L.push("  2. Descriptif de chaque poste recensé.");
      L.push("  3. [Toute pièce extérieure appuyant l'état : extraction datée de l'outil");
      L.push("     de gestion des ressources humaines, organigramme daté, état des");
      L.push("     mouvements de personnel.]");
      L.push("");
      L.push("Conservez ces annexes avec l'état : c'est leur ensemble qui fait la preuve,");
      L.push("et l'état seul se lit comme une déclaration de l'employeur sur lui-même.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la condition posée par L. 1233-4 : le\n" +
        "licenciement ne peut intervenir que si le reclassement ne peut être opéré."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  1. Aujourd'hui — vous arrêtez l'état et vous le faites signer.");
      L.push("  2. Ensuite seulement — vous adressez les offres, poste par poste, par un");
      L.push("     moyen conférant date certaine (D. 1233-2-1, I).");
      L.push("  3. Puis — vous laissez courir le délai de réponse écrit dans l'offre.");
      L.push("  4. Enfin — la notification, jamais avant.");
      L.push("");
      L.push("Si l'état était arrêté aujourd'hui et les offres adressées demain avec un");
      L.push("délai de réponse de quinze jours, ce délai expirerait le " +
        dansJours(ctx, 16) + ",");
      L.push("et la lettre ne pourrait pas partir avant le " + dansJours(ctx, 17) + ".");
      L.push("Ces nombres sont ceux d'un exemple : le délai que vous écrirez dans l'offre");
      L.push("est le vôtre, et c'est lui qui compte.");
      if (estISO(f.dateNotification) && pe && estISO(pe.date)) {
        var ec = ecartJours(pe.date, f.dateNotification);
        L.push("");
        L.push("Dans votre dossier, l'état est daté du " + jour(pe.date) + " et la");
        L.push("notification du " + jour(f.dateNotification) + ", soit un écart de " +
          ec + " jour(s).");
        if (ec < 0) {
          L.push("L'ÉTAT EST POSTÉRIEUR À LA LETTRE. Lisez le document du point CTL-REC-06");
          L.push("avant de faire quoi que ce soit de celui-ci.");
        }
      }
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le périmètre du groupe se lit dans des articles du code de commerce que",
         "l'application n'a pas lus : elle les nomme, elle ne les interprète pas."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-02 — L'INTERROGATION DES SOCIÉTÉS DU PÉRIMÈTRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-02", {
    nom: "Les lettres d'interrogation des sociétés du périmètre, et le suivi des réponses",
    detail: "La lettre à adresser à chaque société, le formulaire de réponse qui " +
            "l'accompagne — réponse négative comprise — et le tableau de suivi.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var fr = societesFR(f), etr = societesEtrangeres(f);
      var vues = {};
      liste(f, "postesDisponibles").forEach(function (x) { if (x && x.societe) vues[x.societe] = 1; });
      var L = entete(ctx, "Interrogation des sociétés du périmètre de permutation",
        "article L. 1233-4 du code du travail");

      L.push("POURQUOI CES LETTRES");
      L.push("");
      L.push("L. 1233-4 fixe le périmètre de la recherche : « l'entreprise ou les autres");
      L.push("entreprises du groupe dont l'entreprise fait partie et dont l'organisation,");
      L.push("les activités ou le lieu d'exploitation assurent la permutation de tout ou");
      L.push("partie du personnel », les emplois devant être « situés sur le territoire");
      L.push("national ».");
      L.push("");
      L.push("Une société du périmètre qui n'a pas été interrogée n'est pas une société");
      L.push("sans poste : c'est une société dont on ignore si elle en avait. C'est la");
      L.push("réponse écrite — y compris « aucun poste disponible » — qui atteste que la");
      L.push("recherche l'a couverte. Sans elle, il manque au dossier autant de trous");
      L.push("qu'il y a de sociétés muettes.");
      L.push("");

      L.push("LE PÉRIMÈTRE, TEL QUE VOTRE DOSSIER LE PORTE");
      L.push("");
      if (!f.groupe) {
        L.push("Le dossier ne déclare aucun groupe. Le périmètre se limite alors à");
        L.push(nom + " elle-même, et la lettre ci-dessous se transforme en demande");
        L.push("interne : elle s'adresse à chaque établissement et à chaque direction");
        L.push("opérationnelle. Si un groupe existe, revenez d'abord à l'audit : c'est");
        L.push("cette réponse qui commande tout le reste.");
      } else if (!fr.length && !etr.length) {
        L.push("Un groupe est déclaré, mais aucune société n'est renseignée. Énumérez-les");
        L.push("nommément avant d'écrire : un périmètre non nommé n'est pas vérifiable.");
      } else {
        L.push("À interroger — sociétés établies sur le territoire national :");
        L.push("");
        L.push(col("Société", 30) + col("Activité", 26) + "Réponse au dossier ?");
        L.push(TRAIT);
        fr.forEach(function (s) {
          L.push(col(s.nom, 30) + col(s.activite, 26) +
            (vues[s.nom] ? "des postes y sont recensés" : "AUCUNE — à interroger"));
        });
        L.push(TRAIT);
        L.push("La colonne de droite ne dit pas qu'une réponse écrite existe : elle dit");
        L.push("seulement si l'état des postes recense quelque chose pour cette société.");
        L.push("La preuve reste la lettre de réponse elle-même.");
        if (etr.length) {
          L.push("");
          L.push("Hors périmètre — sociétés non établies sur le territoire national :");
          etr.forEach(function (s) {
            L.push("  · " + cro(s.nom, "société") + " (" + cro(s.pays, "pays") + ")");
          });
          L.push("Depuis que L. 1233-4 limite le reclassement aux emplois « situés sur le");
          L.push("territoire national », leurs postes ne satisfont pas l'obligation. Vous");
          L.push("pouvez les interroger, mais ne les décomptez pas (point CTL-REC-12).");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LETTRE D'INTERROGATION (une par société)");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("À l'attention de la direction de [SOCIÉTÉ DESTINATAIRE]");
      L.push("[adresse]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception [ou tout autre moyen");
      L.push("conservant la date et la preuve de l'envoi]");
      L.push("");
      L.push("Objet : recherche de reclassement — demande d'état des emplois disponibles");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push(nom + " a engagé une procédure de licenciement pour motif");
      L.push("économique portant sur " + (nbLic(f) != null ? nbLic(f) + " salarié(s)" :
        "[nombre] salarié(s)") + ".");
      L.push("");
      L.push("L'article L. 1233-4 du code du travail subordonne ce licenciement à");
      L.push("l'impossibilité de reclasser les salariés concernés sur les emplois");
      L.push("disponibles situés sur le territoire national, dans l'entreprise comme dans");
      L.push("les autres entreprises du groupe dont l'organisation, les activités ou le");
      L.push("lieu d'exploitation assurent la permutation de tout ou partie du personnel.");
      L.push("Votre société relève de ce périmètre.");
      L.push("");
      L.push("Je vous demande en conséquence de me communiquer, à la date du");
      L.push("[DATE D'ARRÊTÉ DEMANDÉE], la liste des emplois disponibles au sein de votre");
      L.push("société — emplois vacants, créés ou libérés par un départ — en précisant");
      L.push("pour chacun les éléments que l'article D. 1233-2-1 impose de faire figurer");
      L.push("dans l'offre : intitulé du poste et son descriptif, nom de l'employeur,");
      L.push("nature du contrat de travail, localisation du poste, niveau de rémunération");
      L.push("et classification du poste.");
      L.push("");
      L.push("SI VOTRE SOCIÉTÉ N'A AUCUN EMPLOI DISPONIBLE, je vous remercie de me le");
      L.push("confirmer par écrit : cette réponse est aussi nécessaire que l'autre, et");
      L.push("son absence serait lue comme une recherche incomplète.");
      L.push("");
      L.push("Je vous saurais gré de me répondre avant le [DATE LIMITE DE RÉPONSE], le");
      L.push("calendrier de la procédure en dépendant.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("Pièce jointe : formulaire de réponse");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — FORMULAIRE DE RÉPONSE (à joindre à chaque lettre)");
      L.push(GROS);
      L.push("");
      L.push("SOCIÉTÉ : [dénomination]        SIRET : [siret]");
      L.push("Réponse arrêtée au : [DATE]     Signataire : [nom, qualité]");
      L.push("");
      L.push("  ☐ Notre société ne dispose d'AUCUN emploi disponible à la date ci-dessus.");
      L.push("  ☐ Notre société dispose des emplois disponibles suivants :");
      L.push("");
      L.push(col("Intitulé", 24) + col("Descriptif", 22) + col("Contrat", 10) + "Lieu · rémun. · classif.");
      L.push(TRAIT);
      L.push(col("[intitulé]", 24) + col("[descriptif]", 22) + col("[CDI/CDD]", 10) + "[lieu] · [rémun.] · [classif.]");
      L.push(col("[intitulé]", 24) + col("[descriptif]", 22) + col("[CDI/CDD]", 10) + "[lieu] · [rémun.] · [classif.]");
      L.push(TRAIT);
      L.push("");
      L.push("Date et signature :");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — TABLEAU DE SUIVI DES ENVOIS ET DES RÉPONSES");
      L.push(GROS);
      L.push("");
      L.push(col("Société", 28) + col("Envoi le", 14) + col("Preuve", 14) + "Réponse reçue le");
      L.push(TRAIT);
      if (fr.length) {
        fr.forEach(function (s) {
          L.push(col(s.nom, 28) + col("[date]", 14) + col("[AR n°…]", 14) + "[date] · [postes / néant]");
        });
      } else {
        L.push(col("[société]", 28) + col("[date]", 14) + col("[AR n°…]", 14) + "[date] · [postes / néant]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Ce tableau n'est pas un document interne de confort : c'est lui qui montre,");
      L.push("d'un regard, qu'aucune société du périmètre n'a été laissée de côté.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est l'étendue de la recherche : une société du\n" +
        "périmètre non interrogée laisse la condition de L. 1233-4 non établie."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui, " + leJour(aujourd(ctx)) + " — envoi des lettres ;");
      L.push("  · " + dansJours(ctx, 10) + " — date limite de réponse si vous accordez");
      L.push("    dix jours aux sociétés interrogées ;");
      L.push("  · " + dansJours(ctx, 12) + " — arrêté de l'état des postes, réponses en");
      L.push("    main (point CTL-REC-01) ;");
      L.push("  · " + dansJours(ctx, 13) + " — envoi des offres ;");
      L.push("  · au plus tôt le " + dansJours(ctx, 29) + " — notification, si le délai");
      L.push("    de réponse écrit dans l'offre est de quinze jours.");
      L.push("");
      L.push("Ces dates sont un exemple bâti sur les délais que vous choisirez : seul");
      L.push("l'ordre des actes est imposé, jamais leur écartement.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-03 — L'OFFRE DE RECLASSEMENT ET SES SIX MENTIONS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-03", {
    nom: "L'offre de reclassement écrite — les six mentions de D. 1233-2-1",
    detail: "L'offre rédigée mention par mention, la grille de contrôle des offres " +
            "déjà adressées et le rappel du moyen conférant date certaine.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var offres = liste(f, "offresFaites");
      var REQ = [["intitule", "intitulé du poste"], ["descriptif", "descriptif"],
                 ["employeur", "nom de l'employeur"], ["contrat", "nature du contrat"],
                 ["lieu", "localisation"], ["remuneration", "rémunération"],
                 ["classification", "classification"]];
      var L = entete(ctx, "Offre de reclassement écrite",
        "articles L. 1233-4 et D. 1233-2-1 du code du travail");

      L.push("LE TEXTE, EN ENTIER SUR CE POINT");
      L.push("");
      L.push("L. 1233-4 : « Les offres de reclassement proposées au salarié sont écrites");
      L.push("et précises. »");
      L.push("");
      L.push("D. 1233-2-1, I : l'employeur adresse les offres de manière personnalisée ou");
      L.push("communique la liste des offres disponibles « par tout moyen permettant de");
      L.push("conférer date certaine ».");
      L.push("");
      L.push("D. 1233-2-1, II : « Ces offres écrites précisent :");
      L.push("  a) L'intitulé du poste et son descriptif ;");
      L.push("  b) Le nom de l'employeur ;");
      L.push("  c) La nature du contrat de travail ;");
      L.push("  d) La localisation du poste ;");
      L.push("  e) Le niveau de rémunération ;");
      L.push("  f) La classification du poste. »");
      L.push("");
      L.push("Une offre à laquelle il manque une de ces mentions n'est pas une offre au");
      L.push("sens du texte : le poste est traité comme n'ayant pas été proposé, et");
      L.push("l'obligation de L. 1233-4 reste non satisfaite pour ce poste.");
      L.push("");

      L.push("LES OFFRES DE VOTRE DOSSIER, MENTION PAR MENTION");
      L.push("");
      if (!offres.length) {
        L.push("Aucune offre n'est renseignée dans la fiche. Le modèle ci-dessous est à");
        L.push("établir en autant d'exemplaires qu'il y a de couples salarié-poste.");
      } else {
        L.push(col("Offre", 34) + col("Destinataire", 12) + "Mentions manquantes");
        L.push(TRAIT);
        offres.forEach(function (o) {
          var manq = REQ.filter(function (m) {
            var v = o[m[0]];
            return v == null || String(v).trim() === "";
          }).map(function (m) { return m[1]; });
          L.push(col(cro(o.intitule, "intitulé") + " · " + cro(o.employeur, "employeur"), 34) +
            col(cro(o.salarie, "non désigné"), 12) +
            (manq.length ? manq.join(", ") : "aucune — offre complète"));
        });
        L.push(TRAIT);
        var sansDC = offres.filter(function (o) { return o.dateCertaine !== true; });
        L.push(sansDC.length
          ? sansDC.length + " offre(s) ne portent pas la mention d'un moyen conférant date certaine."
          : "Toutes les offres portent la mention d'un moyen conférant date certaine.");
        L.push("Ce tableau lit la fiche de l'audit, non les originaux : reprenez chaque");
        L.push("offre sur la pièce elle-même avant de conclure.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — OFFRE DE RECLASSEMENT (un exemplaire par salarié et par poste)");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("[NOM ET PRÉNOM DU SALARIÉ]");
      L.push("[emploi occupé et service]");
      L.push("[adresse]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception [ou remise en main");
      L.push("propre contre décharge datée et signée — D. 1233-2-1, I exige un moyen");
      L.push("permettant de conférer date certaine]");
      L.push("");
      L.push("Objet : proposition de reclassement");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Dans le cadre de la procédure de licenciement pour motif économique");
      L.push("engagée au sein de " + nom + ", et en application de l'article");
      L.push("L. 1233-4 du code du travail, je vous propose le poste suivant :");
      L.push("");
      L.push("  a) Intitulé du poste : [INTITULÉ]");
      L.push("     Descriptif : [DESCRIPTIF DU POSTE — les missions, le rattachement");
      L.push("     hiérarchique, les horaires ou l'organisation du temps de travail s'ils");
      L.push("     diffèrent des vôtres. « Précise » veut dire que le salarié peut");
      L.push("     décider sans avoir à demander autre chose.]");
      L.push("  b) Nom de l'employeur : [DÉNOMINATION DE LA SOCIÉTÉ QUI EMBAUCHE]");
      L.push("  c) Nature du contrat de travail : [CDI / CDD — durée / autre]");
      L.push("  d) Localisation du poste : [ADRESSE PRÉCISE DU LIEU DE TRAVAIL]");
      L.push("  e) Niveau de rémunération : [MONTANT ANNUEL BRUT ET, S'IL Y A LIEU,");
      L.push("     variable, primes et avantages]");
      L.push("  f) Classification du poste : [NIVEAU, COEFFICIENT, POSITION selon la");
      L.push("     convention collective applicable" +
        (p.conventionCollective ? " — " + p.conventionCollective : "") + "]");
      L.push("");
      L.push("[SI LE POSTE RELÈVE D'UNE CATÉGORIE INFÉRIEURE À CELLE QUE VOUS OCCUPEZ :");
      L.push(" cette offre ne peut vous être adressée qu'après votre accord exprès sur le");
      L.push(" principe d'un reclassement de catégorie inférieure. Voir le document du");
      L.push(" point CTL-REC-10 : l'accord se recueille AVANT la proposition.]");
      L.push("");
      L.push("Vous disposez d'un délai de [DÉLAI] à compter de la réception de la présente");
      L.push("pour me faire connaître votre réponse, par [MOYEN — courrier remis contre");
      L.push("décharge, lettre recommandée, courriel à telle adresse].");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — GRILLE DE CONTRÔLE AVANT ENVOI");
      L.push(GROS);
      L.push("");
      L.push("  ☐ a) intitulé du poste ET son descriptif — les deux, le texte les lie");
      L.push("  ☐ b) nom de l'employeur");
      L.push("  ☐ c) nature du contrat de travail");
      L.push("  ☐ d) localisation du poste");
      L.push("  ☐ e) niveau de rémunération");
      L.push("  ☐ f) classification du poste");
      L.push("  ☐ moyen conférant date certaine, et preuve conservée (D. 1233-2-1, I)");
      L.push("  ☐ délai de réponse et moyen de répondre écrits dans le corps de l'offre");
      L.push("     (point CTL-REC-09)");
      L.push("  ☐ accord exprès préalable si le poste est de catégorie inférieure");
      L.push("     (point CTL-REC-10)");
      L.push("");
      L.push("UNE OFFRE COMPLÉTÉE EST UNE OFFRE NOUVELLE. Si vous reprenez une offre");
      L.push("incomplète, elle repart avec une nouvelle date et un nouveau délai : le");
      L.push("silence gardé sur l'offre incomplète ne vaut refus de rien.");
      L.push("");

      L = L.concat(blocNonRattrapable([
        "Si les offres incomplètes ont déjà été adressées ET la notification faite,",
        "l'irrégularité est acquise : le poste est traité comme non proposé, et une",
        "offre complète expédiée aujourd'hui ne le remettra pas dans le dossier au",
        "jour où la lettre est partie. Ce qui reste à faire est de rassembler les",
        "offres telles qu'elles étaient, avec leur preuve d'envoi, et de porter le",
        "point à la connaissance du conseil de l'entreprise.",
      ]));

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est le caractère écrit et précis de l'offre :\n" +
        "L. 1233-4 l'exige, D. 1233-2-1 en dresse le contenu."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — envoi des offres complètes, avec preuve de date certaine ;");
      L.push("  · " + dansJours(ctx, 15) + " — expiration d'un délai de réponse de quinze");
      L.push("    jours ouvert aujourd'hui ;");
      L.push("  · à compter du " + dansJours(ctx, 16) + " — la notification redevient");
      L.push("    possible, les autres conditions étant remplies.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le plancher de quinze jours francs — quatre en redressement ou liquidation",
         "judiciaire — que porte le III de D. 1233-2-1 vise la LISTE diffusée, non",
         "l'offre personnalisée. Aucun texte capté ne fixe de plancher pour celle-ci :",
         "le délai que vous écrirez doit être réel, et vous devrez pouvoir le",
         "défendre."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-04 — L'ATTESTATION D'ABSENCE DE POSTE DISPONIBLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-04", {
    nom: "L'attestation datée d'absence de poste disponible et ses pièces d'appui",
    detail: "L'attestation rédigée, l'état des effectifs et des mouvements qui la " +
            "soutient, le bordereau des réponses des sociétés et la date de refonte.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var postes = liste(f, "postesDisponibles");
      var att = pieceDe(f, "attestation-absence-poste");
      var L = entete(ctx, "Attestation d'absence de poste disponible",
        "article L. 1233-4 du code du travail");

      L.push("CE QUE CETTE PIÈCE DOIT FAIRE");
      L.push("");
      L.push("L. 1233-4 ne permet le licenciement que si « le reclassement de l'intéressé");
      L.push("ne peut être opéré sur les emplois disponibles ». L'employeur qui n'a aucun");
      L.push("poste à proposer ne manque à rien — à condition de le JUSTIFIER. C'est la");
      L.push("justification qui le protège, non l'affirmation : une attestation qui dit");
      L.push("« il n'y a pas de poste » sans dire d'où elle le tient est une déclaration");
      L.push("de l'employeur sur lui-même.");
      L.push("");
      L.push("Le contrôle CTL-REC-04 de ce module l'énonce ainsi : « Il n'y a pas de");
      L.push("manquement à l'obligation de reclassement si l'employeur justifie de");
      L.push("l'absence de poste disponible » — encore faut-il le justifier (Cass. soc.");
      L.push("2 juillet 2014, n° 13-12.048, décision figurant au corpus du module).");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (postes.length) {
        L.push(postes.length + " poste(s) disponible(s) sont recensés dans la fiche.");
        L.push("Une attestation d'absence de poste n'a alors pas d'objet, et elle serait");
        L.push("contredite par votre propre état des postes. Ce qu'il vous faut est le");
        L.push("document du point CTL-REC-07 : l'offre de chaque poste recensé, ou le");
        L.push("motif écrit de son exclusion, poste par poste.");
        L.push("");
      }
      if (att) {
        L.push("Une attestation figure au dossier : " + cro(att.fichier, "fichier") +
          ", du " + jour(att.date, "date non portée") + ", établie par " +
          cro(att.auteur, "auteur non renseigné") + ".");
        L.push("Vérifiez sur la pièce elle-même qu'elle porte les trois éléments du modèle");
        L.push("ci-dessous : la date d'arrêté, le périmètre nommé, et le renvoi aux pièces.");
      } else {
        L.push("Aucune attestation n'est versée. C'est celle que le modèle ci-dessous");
        L.push("établit.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — ATTESTATION D'ABSENCE DE POSTE DISPONIBLE");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("ATTESTATION D'ABSENCE DE POSTE DISPONIBLE");
      L.push("");
      L.push("Je soussigné(e) [NOM, PRÉNOM], [QUALITÉ ET FONCTION], atteste que la");
      L.push("recherche des emplois disponibles conduite dans le cadre de la procédure de");
      L.push("licenciement pour motif économique engagée au sein de " + nom);
      L.push("n'a fait apparaître aucun emploi disponible au sens de l'article L. 1233-4");
      L.push("du code du travail, à la date du [DATE D'ARRÊTÉ].");
      L.push("");
      L.push("Cette recherche a porté sur les emplois situés sur le territoire national,");
      L.push("dans les sociétés suivantes :");
      var fr = societesFR(f);
      if (fr.length) {
        fr.forEach(function (s) {
          L.push("  · " + cro(s.nom, "société") + " — " + cro(s.activite, "activité"));
        });
      } else {
        L.push("  · " + nom);
        L.push("  · [et chaque autre société du groupe établie en France dont");
        L.push("    l'organisation, les activités ou le lieu d'exploitation assurent la");
        L.push("    permutation de tout ou partie du personnel — à nommer]");
      }
      L.push("");
      L.push("Elle a porté sur les emplois vacants, les emplois créés et les emplois");
      L.push("libérés par un départ, quel que soit le type de contrat, y compris ceux");
      L.push("d'une catégorie inférieure à celle des salariés concernés.");
      L.push("");
      L.push("Elle s'appuie sur les pièces suivantes, annexées à la présente :");
      L.push("  1. l'état des effectifs et des mouvements de personnel de chaque société");
      L.push("     du périmètre, arrêté au [DATE] ;");
      L.push("  2. les réponses écrites de chaque société interrogée, y compris les");
      L.push("     réponses négatives ;");
      L.push("  3. [le registre du personnel, l'organigramme daté, l'état des postes");
      L.push("     ouverts au recrutement — toute pièce extérieure à la présente");
      L.push("     attestation].");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE]");
      L.push("");
      L.push("[Signature et qualité]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — ÉTAT DES EFFECTIFS ET DES MOUVEMENTS, PAR SOCIÉTÉ");
      L.push(GROS);
      L.push("");
      L.push("Période couverte : du [DATE DE DÉBUT DE LA RECHERCHE] au [DATE D'ARRÊTÉ]");
      L.push("");
      L.push(col("Société", 26) + col("Effectif", 10) + col("Entrées", 10) + col("Sorties", 10) + "Postes ouverts");
      L.push(TRAIT);
      if (fr.length) {
        fr.forEach(function (s) {
          L.push(col(s.nom, 26) + col(s.effectif != null ? s.effectif : "[nb]", 10) +
            col("[nb]", 10) + col("[nb]", 10) + "[nb] · [intitulés]");
        });
      } else {
        L.push(col("[société]", 26) + col("[nb]", 10) + col("[nb]", 10) + col("[nb]", 10) + "[nb] · [intitulés]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Une entrée survenue pendant la période et non expliquée dans la colonne de");
      L.push("droite est exactement ce qu'un contradicteur cherchera : elle donne à voir");
      L.push("un poste qui existait pendant que l'on attestait qu'il n'y en avait pas.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — NOTE DE MISE À JOUR");
      L.push(GROS);
      L.push("");
      L.push("Un poste peut se libérer entre l'attestation et la lettre. Si la procédure");
      L.push("se prolonge, refaites l'exercice et datez la nouvelle attestation : c'est");
      L.push("l'état des postes AU JOUR DE LA NOTIFICATION qui sera discuté.");
      L.push("");
      L.push("  Attestation initiale, arrêtée au ......... [DATE]");
      L.push("  Mise à jour n° 1, arrêtée au ............. [DATE]");
      L.push("  Mise à jour n° 2, arrêtée au ............. [DATE]");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la justification de l'absence de poste :\n" +
        "l'employeur ne manque pas à L. 1233-4 s'il en justifie ; s'il se borne à\n" +
        "l'affirmer, la condition n'est pas établie."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — arrêté de l'état des effectifs et des mouvements ;");
      L.push("  · " + dansJours(ctx, 1) + " — signature de l'attestation, pièces");
      L.push("    annexées ;");
      L.push("  · " + dansJours(ctx, 30) + " — si la lettre n'est toujours pas partie à");
      L.push("    cette date, refaites l'attestation : celle d'aujourd'hui aura un mois.");
      L.push("");
      L.push("L'attestation doit être ANTÉRIEURE à la notification, et aussi proche que");
      L.push("possible d'elle : c'est le même raisonnement que pour l'état des postes");
      L.push("(point CTL-REC-06).");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le registre unique du personnel est ici nommé comme pièce d'appui. Aucun",
         "article du corpus de ce module ne porte l'obligation de le tenir :",
         "l'application le désigne, elle ne cite aucun texte à son sujet."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-05 — LES EFFORTS DE FORMATION ET D'ADAPTATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-05", {
    nom: "Le tableau des actions de formation et d'adaptation, salarié par salarié",
    detail: "Le tableau nominatif, la lettre de proposition d'une action, le " +
            "formulaire de réponse et la note motivée pour les salariés sans action.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var actions = liste(f, "formationProposee");
      var noms = nomsSalaries(f);
      var L = entete(ctx, "Actions de formation et d'adaptation",
        "article L. 1233-4 du code du travail");

      L.push("CE QUE LE TEXTE EXIGE, ET QUI PRÉCÈDE MÊME LE RECLASSEMENT");
      L.push("");
      L.push("« Le licenciement pour motif économique d'un salarié ne peut intervenir que");
      L.push("lorsque TOUS LES EFFORTS DE FORMATION ET D'ADAPTATION ONT ÉTÉ RÉALISÉS et");
      L.push("que le reclassement de l'intéressé ne peut être opéré… » (L. 1233-4).");
      L.push("");
      L.push("Deux conditions, et la première n'est pas la seconde. Un dossier peut");
      L.push("montrer une recherche de postes irréprochable et rester en défaut sur les");
      L.push("efforts de formation et d'adaptation, dont rien n'aura été écrit. Ce sont");
      L.push("des efforts D'ADAPTATION AU POSTE : le texte n'impose pas de dispenser une");
      L.push("formation initiale à un métier nouveau, et c'est précisément la frontière");
      L.push("qu'il faut écrire, salarié par salarié.");
      L.push("");
      if (f.cause === "2") {
        L.push("VOTRE DOSSIER INVOQUE UNE MUTATION TECHNOLOGIQUE (cause 2 de L. 1233-3).");
        L.push("C'est le terrain sur lequel ce type de litige se noue : l'outil change, et");
        L.push("la question posée est de savoir ce qui a été fait pour que le salarié");
        L.push("puisse le tenir. Le tableau ci-dessous n'est pas une pièce de confort, il");
        L.push("est la pièce centrale du dossier. Rapprochez-le du dossier de mutation");
        L.push("technologique (point CTL-ECO-04).");
        L.push("");
      }

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (!actions.length) {
        L.push("Aucune action de formation ou d'adaptation n'est renseignée dans la fiche.");
        L.push("Deux issues, et deux seulement : ou bien des actions ont été proposées et");
        L.push("il faut les écrire, ou bien aucune ne l'a été et il faut écrire pourquoi,");
        L.push("salarié par salarié. Une case vide n'est ni l'une ni l'autre.");
      } else {
        L.push(col("Action", 30) + col("Durée", 10) + col("Coût", 12) + "Réponse du salarié");
        L.push(TRAIT);
        actions.forEach(function (a) {
          L.push(col(cro(a.contenu, "contenu"), 30) + col(cro(a.duree, "durée"), 10) +
            col(cro(a.cout, "coût"), 12) + cro(a.reponse, "NON DOCUMENTÉE"));
        });
        L.push(TRAIT);
        var sans = actions.filter(function (a) { return !a.reponse; });
        if (sans.length) {
          L.push(sans.length + " action(s) sans réponse documentée. Une proposition dont");
          L.push("on ignore le sort ne prouve pas grand-chose : c'est la réponse, ou le");
          L.push("constat daté du silence, qui ferme le point.");
        }
        L.push("La fiche ne rattache pas ces actions à un salarié nommé : le tableau 1");
        L.push("ci-dessous est à remplir nom par nom.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — TABLEAU DES ACTIONS, SALARIÉ PAR SALARIÉ");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase() + " — arrêté au [DATE]");
      L.push("");
      L.push(col("Salarié", 16) + col("Action proposée", 26) + col("Date", 12) +
        col("Durée", 8) + "Réponse et date");
      L.push(TRAIT);
      if (noms.length) {
        noms.forEach(function (n) {
          L.push(col(n, 16) + col("[action ou « aucune »]", 26) + col("[date]", 12) +
            col("[durée]", 8) + "[acceptation / refus / silence]");
        });
      } else {
        L.push(col("[nom]", 16) + col("[action ou « aucune »]", 26) + col("[date]", 12) +
          col("[durée]", 8) + "[acceptation / refus / silence]");
        L.push(col("[nom]", 16) + col("[action ou « aucune »]", 26) + col("[date]", 12) +
          col("[durée]", 8) + "[acceptation / refus / silence]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Les noms repris ci-dessus sont ceux que porte votre fiche d'audit. Ajoutez");
      L.push("les salariés manquants : le tableau doit couvrir TOUS les salariés dont le");
      L.push("licenciement est envisagé" +
        (nbLic(f) != null ? ", soit " + nbLic(f) + " personne(s) selon votre dossier." : "."));
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE DE PROPOSITION D'UNE ACTION D'ADAPTATION");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("[NOM ET PRÉNOM DU SALARIÉ]");
      L.push("[emploi occupé]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Remise en main propre contre décharge [ou lettre recommandée avec avis de");
      L.push("réception]");
      L.push("");
      L.push("Objet : proposition d'une action de formation et d'adaptation");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Dans le cadre de la procédure de licenciement pour motif économique engagée");
      L.push("au sein de " + nom + ", et avant toute décision, l'article L. 1233-4 du");
      L.push("code du travail impose que tous les efforts de formation et d'adaptation");
      L.push("aient été réalisés.");
      L.push("");
      L.push("Je vous propose en conséquence l'action suivante :");
      L.push("  · objet et contenu : [CONTENU DE L'ACTION]");
      L.push("  · poste visé à l'issue : [INTITULÉ DU POSTE, ET SOCIÉTÉ QUI L'OFFRE]");
      L.push("  · dates et durée : [DU … AU …, soit … heures]");
      L.push("  · lieu et organisme : [LIEU, ORGANISME]");
      L.push("  · prise en charge : [ce que l'entreprise prend en charge]");
      L.push("  · maintien de la rémunération : [préciser]");
      L.push("");
      L.push("Je vous remercie de me faire connaître votre réponse avant le [DATE], au");
      L.push("moyen du formulaire joint ou par tout écrit de votre choix.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — FORMULAIRE DE RÉPONSE DU SALARIÉ");
      L.push(GROS);
      L.push("");
      L.push("Je soussigné(e) [NOM, PRÉNOM], déclare :");
      L.push("  ☐ ACCEPTER l'action de formation et d'adaptation proposée le [DATE] ;");
      L.push("  ☐ REFUSER cette action.");
      L.push("[Motif du refus, si vous souhaitez l'indiquer : ……………………………………]");
      L.push("");
      L.push("Fait à …………………, le ……………     Signature :");
      L.push("");
      L.push("Si le salarié ne répond pas, établissez un constat daté du silence à");
      L.push("l'expiration du délai : c'est ce constat qui remplacera la réponse au");
      L.push("dossier.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — NOTE MOTIVÉE POUR LES SALARIÉS SANS ACTION PROPOSÉE");
      L.push(GROS);
      L.push("");
      L.push("Pour chaque salarié auquel aucune action n'a été proposée, écrivez ici");
      L.push("pourquoi. Une ligne vide dans le tableau 1 se lit comme une absence");
      L.push("d'effort ; une ligne motivée se discute.");
      L.push("");
      L.push("  · [NOM] — aucune action proposée. Motif : [le poste visé n'existe dans");
      L.push("    aucune société du périmètre ; l'écart de qualification excède ce qu'une");
      L.push("    adaptation au poste permet de combler ; le salarié a refusé le principe");
      L.push("    même d'une adaptation par écrit du … ; autre — à écrire précisément.]");
      L.push("");
      L.push("N'écrivez ici que ce que vous pouvez établir. Cette note est une pièce du");
      L.push("dossier au même titre que les autres, et elle sera lue comme telle.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la première des deux conditions de L. 1233-4 :\n" +
        "tous les efforts de formation et d'adaptation doivent avoir été réalisés."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — envoi des propositions d'action ;");
      L.push("  · " + dansJours(ctx, 10) + " — date de réponse si vous accordez dix jours ;");
      L.push("  · " + dansJours(ctx, 11) + " — constat daté du silence pour ceux qui n'ont");
      L.push("    pas répondu, et clôture du tableau ;");
      L.push("  · après seulement — les offres de reclassement, puis la notification.");
      L.push("");
      L.push("Les actions elles-mêmes prennent le temps qu'elles prennent : une action");
      L.push("d'adaptation annoncée mais jamais engagée ne vaut pas effort réalisé.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-06 — LA DATE DE L'ÉTAT DES POSTES ET CELLE DE LA LETTRE

     La fiche de régularisation ne prévoit aucun document pour ce point : il
     s'agit d'une date à contrôler, non d'une pièce à produire. Le document
     écrit ici n'invente donc pas une régularisation — il constate les deux
     dates, il dit ce qui reste possible, et il interdit expressément la seule
     chose qu'un employeur pressé serait tenté de faire.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-06", {
    nom: "Le constat des deux dates : état des postes et notification",
    detail: "Le relevé daté des deux pièces, l'écart mesuré, ce qui reste possible " +
            "selon que la lettre est partie ou non, et l'instruction de ne rien redater.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var pe = pieceDe(f, "etat-postes");
      var dEtat = pe && estISO(pe.date) ? pe.date : null;
      var dLettre = estISO(f.dateNotification) ? f.dateNotification : null;
      var ec = dEtat && dLettre ? ecartJours(dEtat, dLettre) : null;
      var partie = dLettre ? dLettre <= isoDe(aujourd(ctx)) : null;
      var L = entete(ctx, "Constat des dates — état des postes et notification",
        "article L. 1233-4 du code du travail");

      L.push("POURQUOI CETTE DATE DÉCIDE DE TOUT");
      L.push("");
      L.push("L. 1233-4 subordonne le licenciement à ce que « le reclassement de");
      L.push("l'intéressé ne puisse être opéré sur les emplois disponibles ». Cette");
      L.push("condition s'apprécie au jour où le licenciement est prononcé. Un état des");
      L.push("postes établi APRÈS la lettre ne prouve pas que la recherche avait été");
      L.push("faite : il montre qu'elle ne l'était pas au moment où elle devait l'être.");
      L.push("");
      L.push("C'est pourquoi ce point n'appelle aucune pièce nouvelle. Il appelle une");
      L.push("lecture de deux dates, et une décision honnête sur ce qui suit.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — RELEVÉ DES DEUX DATES");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("Relevé établi le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("  · État des postes disponibles — date portée sur la pièce : " +
        (dEtat ? jour(dEtat) : "[NON RENSEIGNÉE]"));
      if (pe) {
        L.push("    pièce : " + cro(pe.fichier, "fichier") + " · auteur : " +
          cro(pe.auteur, "non renseigné") + " · périmètre : " + cro(pe.perimetre, "non renseigné"));
      } else {
        L.push("    Aucune pièce « état des postes » n'est versée au dossier : la date ne");
        L.push("    peut pas être relevée, et le point ne peut pas être contrôlé.");
      }
      L.push("  · Notification des licenciements — date portée au dossier : " +
        (dLettre ? jour(dLettre) : "[NON RENSEIGNÉE]"));
      L.push("");
      if (ec !== null) {
        L.push("Écart mesuré : " + ec + " jour(s).");
        L.push("");
        if (ec < 0) {
          L.push("L'ÉTAT DES POSTES EST POSTÉRIEUR À LA NOTIFICATION DE " +
            Math.abs(ec) + " JOUR(S).");
          L.push("Le grief est constitué. Lisez la partie « ce qui ne se rattrape pas ».");
        } else if (ec === 0) {
          L.push("L'état des postes porte LE JOUR MÊME de la notification. Rien n'établit");
          L.push("que la recherche précédait la décision. Documentez ce qui avait été fait");
          L.push("avant — réponses des sociétés, échanges datés — et faites examiner le");
          L.push("point par votre conseil.");
        } else {
          L.push("L'état des postes est antérieur à la notification. Vérifiez toutefois");
          L.push("qu'il n'est pas trop ancien : un poste peut s'être libéré entre les deux,");
          L.push("et c'est l'état des emplois AU JOUR DE LA LETTRE qui sera discuté.");
        }
      } else {
        L.push("Les deux dates ne sont pas toutes deux au dossier : relevez-les sur les");
        L.push("pièces elles-mêmes — la date portée sur l'état, et la date d'envoi de la");
        L.push("lettre attestée par le récépissé — avant toute conclusion.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — CE QUI RESTE POSSIBLE");
      L.push(GROS);
      L.push("");
      if (partie === false) {
        L.push("LA LETTRE N'EST PAS ENCORE PARTIE (notification prévue le " +
          jour(dLettre) + ").");
        L.push("");
        L.push("Tout est encore réparable, et la marche à suivre est simple :");
        L.push("  1. refaire l'état des postes à une date d'aujourd'hui, avec les réponses");
        L.push("     écrites des sociétés du périmètre (points CTL-REC-01 et CTL-REC-02) ;");
        L.push("  2. adresser ou réadresser les offres correspondantes, complètes des six");
        L.push("     mentions de D. 1233-2-1 ;");
        L.push("  3. laisser courir le délai de réponse écrit dans l'offre ;");
        L.push("  4. n'expédier la lettre qu'ensuite — au besoin en repoussant la date");
        L.push("     prévue. Repousser une notification ne coûte rien ; l'expédier trop tôt");
        L.push("     coûte le licenciement.");
      } else if (partie === true) {
        L.push("LA LETTRE EST PARTIE LE " + jour(dLettre) + ".");
        L.push("");
        L.push("Ce qui pouvait être fait avant elle ne peut plus l'être. Ce qui reste :");
        L.push("  1. verser l'état des postes TEL QU'IL EST, avec sa date réelle ;");
        L.push("  2. rassembler séparément ce qui, avant la lettre, établissait la");
        L.push("     recherche — courriers aux sociétés, réponses reçues, échanges datés,");
        L.push("     offres adressées : ces pièces-là sont antérieures, et elles comptent ;");
        L.push("  3. porter le point à la connaissance du conseil de l'entreprise, à qui");
        L.push("     il appartient d'apprécier la conduite à tenir.");
      } else {
        L.push("La date de notification n'est pas au dossier. Deux situations, et la");
        L.push("réponse n'est pas la même :");
        L.push("  · la lettre n'est pas partie — refaites l'état à une date antérieure,");
        L.push("    adressez les offres, laissez courir le délai, puis notifiez ;");
        L.push("  · la lettre est partie — ne redatez rien, versez l'état tel qu'il est,");
        L.push("    et documentez séparément ce que la recherche couvrait avant elle.");
      }
      L.push("");

      L = L.concat(blocNonRattrapable([
        "Un état des postes postérieur à la lettre ne devient pas antérieur parce",
        "qu'on le réimprime avec une autre date. Le reclassement s'apprécie au jour",
        "du licenciement : ce qui a été fait après ne peut pas être versé comme",
        "ayant été fait avant.",
        "",
        "Et une pièce redatée n'est plus seulement une pièce faible : c'est une",
        "pièce fausse, opposable à celui qui l'a signée, sur un terrain qui n'est",
        "plus celui du droit du travail. L'application ne propose jamais cela, et",
        "aucun gain de procédure ne le vaut.",
      ]));

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la date à laquelle la condition de L. 1233-4\n" +
        "devait être remplie : celle de la lettre, et aucune autre."));

      L = L.concat(ouvrirCalendrier(ctx));
      if (partie === false || partie === null) {
        L.push("  · aujourd'hui — nouvel état des postes, réponses en main ;");
        L.push("  · " + dansJours(ctx, 1) + " — envoi ou réenvoi des offres complètes ;");
        L.push("  · " + dansJours(ctx, 16) + " — expiration d'un délai de réponse de");
        L.push("    quinze jours ouvert demain ;");
        L.push("  · à compter du " + dansJours(ctx, 17) + " — notification possible.");
        if (dLettre) {
          L.push("");
          L.push("La date de notification prévue au dossier est le " + jour(dLettre) + " :");
          L.push(ecartJours(isoDe(aujourd(ctx)), dLettre) >= 17
            ? "elle laisse la place à ce calendrier."
            : "elle NE LAISSE PAS la place à ce calendrier — repoussez-la.");
        }
      } else {
        L.push("  · aujourd'hui — relevé des dates, sans aucune modification des pièces ;");
        L.push("  · " + dansJours(ctx, 1) + " — remise du dossier au conseil de");
        L.push("    l'entreprise, avec la présente note.");
        L.push("");
        L.push("Il n'y a pas d'autre échéance : le calendrier de régularisation est");
        L.push("derrière vous, et prétendre le contraire ne rendrait service à personne.");
      }
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-07 — LES POSTES DISPONIBLES OMIS DANS LES OFFRES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-07", {
    nom: "Le rapprochement postes-offres, les offres complémentaires et les motifs d'exclusion",
    detail: "Le tableau poste par poste avec les omissions calculées d'après votre " +
            "dossier, la lettre d'offre complémentaire et la note d'exclusion motivée.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var postes = liste(f, "postesDisponibles");
      var offres = liste(f, "offresFaites");
      var etrangeres = {};
      societesEtrangeres(f).forEach(function (s) { if (s.nom) etrangeres[s.nom] = 1; });
      var servis = {};
      offres.forEach(function (o) {
        if (o && !etrangeres[o.employeur])
          servis[(o.intitule || "") + "|" + (o.employeur || "")] = (servis[(o.intitule || "") + "|" + (o.employeur || "")] || 0) + 1;
      });
      var omis = postes.filter(function (x) {
        return !x.motifExclusion && !servis[(x.intitule || "") + "|" + (x.societe || "")];
      });
      var L = entete(ctx, "Postes disponibles et offres adressées — rapprochement",
        "article L. 1233-4 du code du travail");

      L.push("LA RÈGLE, ET CE QU'ELLE INTERDIT");
      L.push("");
      L.push("L. 1233-4 ne permet le licenciement que si le reclassement « ne peut être");
      L.push("opéré sur les emplois disponibles ». Un poste que l'entreprise a elle-même");
      L.push("recensé comme disponible, et qu'elle n'a proposé à personne, contredit sa");
      L.push("propre affirmation : il établit à lui seul que le reclassement pouvait être");
      L.push("tenté et ne l'a pas été.");
      L.push("");
      L.push("Deux issues, et deux seulement, pour chaque poste recensé : il est OFFERT,");
      L.push("ou son exclusion est ÉCRITE et MOTIVÉE. Un poste sans offre et sans motif");
      L.push("est un poste omis.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — TABLEAU DE RAPPROCHEMENT, POSTE PAR POSTE");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase() + " — arrêté au " + leJour(aujourd(ctx)));
      L.push("");
      if (!postes.length) {
        L.push("Aucun poste disponible n'est renseigné dans votre fiche : le rapprochement");
        L.push("ne peut pas être fait ici. Établissez d'abord l'état des postes (point");
        L.push("CTL-REC-01), puis revenez à ce tableau.");
        L.push("");
        L.push(col("Poste recensé", 26) + col("Société", 22) + col("Offert ?", 10) + "Motif d'exclusion");
        L.push(TRAIT);
        L.push(col("[intitulé]", 26) + col("[société]", 22) + col("[oui/non]", 10) + "[motif si non offert]");
        L.push(TRAIT);
      } else {
        L.push(col("Poste recensé", 26) + col("Société", 22) + col("Offres", 8) + "Situation");
        L.push(TRAIT);
        postes.forEach(function (x) {
          var n = servis[(x.intitule || "") + "|" + (x.societe || "")] || 0;
          L.push(col(x.intitule, 26) + col(x.societe, 22) + col(n, 8) +
            (n ? "offert" : (x.motifExclusion ? "exclu — motif au dossier" : "OMIS — rien au dossier")));
        });
        L.push(TRAIT);
        L.push(postes.length + " poste(s) recensé(s) · " + offres.length + " offre(s) déclarée(s) · " +
          omis.length + " poste(s) sans offre ni motif.");
        L.push("");
        L.push("La colonne « Offres » ne compte que les offres émanant de sociétés");
        L.push("établies sur le territoire national : une offre d'une société étrangère ne");
        L.push("satisfait pas l'obligation et ne couvre donc aucun poste (point");
        L.push("CTL-REC-12).");
        if (omis.length) {
          L.push("");
          L.push("POSTES À TRAITER AVANT TOUTE NOTIFICATION :");
          omis.forEach(function (x) {
            L.push("  · " + cro(x.intitule, "intitulé") + " — " + cro(x.societe, "société") +
              " — " + cro(x.lieu, "lieu"));
          });
          L.push("  Pour chacun : l'offrir, ou écrire son motif d'exclusion ci-dessous.");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE D'OFFRE COMPLÉMENTAIRE");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("[NOM ET PRÉNOM DU SALARIÉ]");
      L.push("[emploi occupé]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception [ou remise contre");
      L.push("décharge — D. 1233-2-1, I : un moyen conférant date certaine]");
      L.push("");
      L.push("Objet : proposition de reclassement complémentaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En complément de la ou des propositions qui vous ont déjà été adressées, et");
      L.push("en application de l'article L. 1233-4 du code du travail, je vous propose");
      L.push("le poste suivant :");
      L.push("");
      L.push("  a) Intitulé du poste et descriptif : [À COMPLÉTER]");
      L.push("  b) Nom de l'employeur : [À COMPLÉTER]");
      L.push("  c) Nature du contrat de travail : [À COMPLÉTER]");
      L.push("  d) Localisation du poste : [À COMPLÉTER]");
      L.push("  e) Niveau de rémunération : [À COMPLÉTER]");
      L.push("  f) Classification du poste : [À COMPLÉTER]");
      L.push("");
      L.push("Vous disposez d'un délai de [DÉLAI] à compter de la réception de la présente");
      L.push("pour me faire connaître votre réponse, par [MOYEN].");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — NOTE DES MOTIFS D'EXCLUSION, POSTE PAR POSTE");
      L.push(GROS);
      L.push("");
      L.push("Un poste peut légitimement n'être proposé à personne. Encore faut-il que le");
      L.push("dossier dise pourquoi, et le dise poste par poste : un motif général vaut");
      L.push("absence de motif.");
      L.push("");
      L.push(col("Poste · société", 34) + "Motif d'exclusion, daté");
      L.push(TRAIT);
      if (omis.length) {
        omis.forEach(function (x) {
          L.push(col(cro(x.intitule, "intitulé") + " · " + cro(x.societe, "société"), 34) +
            "[motif — à écrire]");
        });
      } else {
        L.push(col("[poste] · [société]", 34) + "[motif — à écrire]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Motifs qui s'écrivent et se prouvent — la liste n'est pas limitative, et");
      L.push("aucun ne se présume :");
      L.push("  · le poste n'était plus disponible à la date utile : dire à quelle date il");
      L.push("    a été pourvu, et par qui ;");
      L.push("  · le poste exige une qualification que le salarié n'a pas et qu'une");
      L.push("    adaptation au poste ne permet pas d'atteindre : dire laquelle, et");
      L.push("    rapprocher du tableau des actions de formation (point CTL-REC-05) ;");
      L.push("  · le poste relève d'une catégorie inférieure et le salarié n'a pas donné");
      L.push("    l'accord exprès que L. 1233-4 exige (point CTL-REC-10).");
      L.push("");
      L.push("N'écrivez aucun de ces motifs sans l'avoir vérifié : ce tableau sera lu.");
      L.push("");

      L = L.concat(blocNonRattrapable([
        "Si la notification est déjà partie, un poste omis reste omis : l'offre",
        "expédiée aujourd'hui ne se replace pas avant la lettre. Ce qui reste utile",
        "est d'établir, à leur date réelle, quels postes étaient réellement",
        "disponibles au jour de la lettre et lesquels avaient été proposés.",
      ]));

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est l'épuisement des possibilités de reclassement :\n" +
        "un poste disponible non proposé et non motivé laisse la condition de\n" +
        "L. 1233-4 non satisfaite."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — rapprochement, décision poste par poste ;");
      L.push("  · " + dansJours(ctx, 1) + " — envoi des offres complémentaires ;");
      L.push("  · " + dansJours(ctx, 16) + " — expiration d'un délai de réponse de quinze");
      L.push("    jours ouvert demain ;");
      L.push("  · à compter du " + dansJours(ctx, 17) + " — notification possible.");
      L.push("");
      L.push("Une offre complémentaire ouvre un délai NOUVEAU : la notification recule");
      L.push("d'autant, et c'est le prix — modeste — de la régularisation.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-08 — OFFRES PERSONNALISÉES OU LISTE DIFFUSÉE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-08", {
    nom: "Les deux voies de L. 1233-4 : offres personnalisées ou liste diffusée",
    detail: "Le relevé des destinataires servis, la liste conforme au III de " +
            "D. 1233-2-1 avec ses critères de départage et son délai, et le registre de diffusion.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var offres = liste(f, "offresFaites");
      var postes = liste(f, "postesDisponibles");
      var etrangeres = {};
      societesEtrangeres(f).forEach(function (s) { if (s.nom) etrangeres[s.nom] = 1; });
      var dest = {}, ecartees = 0;
      offres.forEach(function (o) {
        if (etrangeres[o.employeur]) { ecartees++; return; }
        if (o.salarie) dest[o.salarie] = (dest[o.salarie] || 0) + 1;
      });
      var noms = nomsSalaries(f);
      var nb = nbLic(f);
      var nbDest = Object.keys(dest).length;
      var enPC = f.procedureCollective === true &&
        (f.typeProcedure === "redressement" || f.typeProcedure === "liquidation");
      var plancher = enPC ? 4 : 15;
      var L = entete(ctx, "Offres personnalisées ou liste des postes disponibles",
        "articles L. 1233-4 et D. 1233-2-1 du code du travail");

      L.push("LES DEUX VOIES, ET IL FAUT EN SUIVRE UNE");
      L.push("");
      L.push("« L'employeur adresse de manière personnalisée les offres de reclassement à");
      L.push("chaque salarié ou diffuse par tout moyen une liste des postes disponibles à");
      L.push("l'ensemble des salariés, dans des conditions précisées par décret »");
      L.push("(L. 1233-4).");
      L.push("");
      L.push("Le décret est D. 1233-2-1. Son I impose, dans les deux voies, un moyen");
      L.push("permettant de conférer date certaine. Son III ajoute, pour la LISTE :");
      L.push("  · elle comprend les postes disponibles situés sur le territoire national");
      L.push("    dans l'entreprise et les autres entreprises du groupe ;");
      L.push("  · elle précise les critères de départage entre salariés en cas de");
      L.push("    candidatures multiples sur un même poste ;");
      L.push("  · elle précise le délai dont dispose le salarié pour présenter sa");
      L.push("    candidature écrite, qui « ne peut être inférieur à quinze jours francs à");
      L.push("    compter de la publication de la liste », et à quatre jours francs dans");
      L.push("    les entreprises en redressement ou liquidation judiciaire ;");
      L.push("  · « L'absence de candidature écrite du salarié à l'issue du délai");
      L.push("    mentionné au deuxième alinéa vaut refus des offres. »");
      L.push("");
      L.push("Un salarié qui n'a reçu ni offre personnalisée ni liste n'a été mis en");
      L.push("mesure de rien : pour lui, l'obligation n'est pas satisfaite, quel que soit");
      L.push("le soin apporté au sort des autres.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — RELEVÉ DES DESTINATAIRES");
      L.push(GROS);
      L.push("");
      L.push("Salariés dont le licenciement est envisagé : " +
        (nb != null ? nb : "[nombre non renseigné]"));
      L.push("Salariés destinataires d'au moins une offre valable : " + nbDest);
      if (ecartees) {
        L.push(ecartees + " offre(s) émanant d'une société non établie sur le territoire");
        L.push("national ne sont pas décomptées (L. 1233-4 ; point CTL-REC-12).");
      }
      L.push("");
      L.push(col("Salarié", 18) + col("Offres reçues", 16) + "À faire");
      L.push(TRAIT);
      if (noms.length) {
        noms.forEach(function (n) {
          var k = dest[n] || 0;
          L.push(col(n, 18) + col(k ? k + " offre(s)" : "aucune", 16) +
            (k ? "vérifier la preuve d'envoi" : "ADRESSER UNE OFFRE OU LA LISTE"));
        });
      } else {
        L.push(col("[nom]", 18) + col("[nb]", 16) + "[à compléter salarié par salarié]");
      }
      L.push(TRAIT);
      if (nb != null && nbDest < nb) {
        L.push("");
        L.push(nb - nbDest + " salarié(s) au moins n'ont, selon votre dossier, reçu aucune");
        L.push("offre. Traitez-les avant toute notification : c'est la seule chose à faire");
        L.push("et il est encore temps si la lettre n'est pas partie.");
      }
      L.push("");
      L.push("Ce relevé lit votre fiche d'audit. La preuve reste l'accusé de réception ou");
      L.push("la décharge, salarié par salarié : reportez-les dans la colonne de droite.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — VOIE A : LES OFFRES PERSONNALISÉES");
      L.push(GROS);
      L.push("");
      L.push("Le modèle d'offre est celui du document du point CTL-REC-03 : six mentions,");
      L.push("moyen conférant date certaine, délai et moyen de réponse. Une offre par");
      L.push("salarié et par poste, et une preuve d'envoi par offre.");
      L.push("");
      L.push("Registre des envois :");
      L.push(col("Salarié", 16) + col("Poste", 24) + col("Envoi", 12) + "Preuve · réponse");
      L.push(TRAIT);
      L.push(col("[nom]", 16) + col("[poste]", 24) + col("[date]", 12) + "[AR n°…] · [réponse, date]");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — VOIE B : LA LISTE DIFFUSÉE (III de D. 1233-2-1)");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("LISTE DES POSTES DISPONIBLES — RECLASSEMENT INTERNE");
      L.push("Publiée le [DATE DE PUBLICATION] · diffusée par [MOYEN CONFÉRANT DATE");
      L.push("CERTAINE — préciser lequel, et conserver la preuve]");
      L.push("");
      L.push("1. LES POSTES");
      L.push("");
      L.push(col("Intitulé et descriptif", 30) + col("Employeur", 22) + "Contrat · lieu · rémun. · classif.");
      L.push(TRAIT);
      if (postes.length) {
        postes.forEach(function (x) {
          L.push(col(x.intitule, 30) + col(x.societe, 22) +
            "[contrat] · " + cro(x.lieu, "lieu") + " · " + cro(x.remuneration, "rémun.") +
            " · " + cro(x.classification, "classif."));
        });
      } else {
        L.push(col("[intitulé et descriptif]", 30) + col("[employeur]", 22) +
          "[contrat] · [lieu] · [rémun.] · [classif.]");
      }
      L.push(TRAIT);
      L.push("La liste comprend les postes disponibles situés sur le territoire national");
      L.push("dans l'entreprise et les autres entreprises du groupe (D. 1233-2-1, III).");
      L.push("Complétez le descriptif de chaque poste : les six mentions du II valent");
      L.push("aussi pour les offres portées par la liste.");
      L.push("");
      L.push("2. LES CRITÈRES DE DÉPARTAGE EN CAS DE CANDIDATURES MULTIPLES");
      L.push("");
      L.push("[À ÉCRIRE — le III les exige, et une liste qui n'en porte pas est");
      L.push(" incomplète. Les critères sont les vôtres : dites-les, dans l'ordre où ils");
      L.push(" s'appliquent, et de façon qu'un salarié puisse vérifier le résultat.");
      L.push(" L'application ne les invente pas : aucun texte capté ne les fixe.]");
      L.push("");
      L.push("3. LE DÉLAI DE CANDIDATURE");
      L.push("");
      L.push("Les candidatures sont présentées par écrit, par [MOYEN], au plus tard le");
      L.push("[DATE LIMITE].");
      L.push("");
      L.push("Ce délai « ne peut être inférieur à " + plancher + " jours francs à compter de la");
      L.push("publication de la liste » (D. 1233-2-1, III)" +
        (enPC ? " — votre dossier déclare une procédure de " +
          cro(f.typeProcedure, "procédure collective") + "." : "."));
      if (!enPC) {
        L.push("Le plancher de quatre jours francs ne vaut que pour les entreprises en");
        L.push("redressement ou en liquidation judiciaire ; le vôtre est de quinze.");
      }
      L.push("");
      L.push("« L'absence de candidature écrite du salarié à l'issue du délai mentionné au");
      L.push("deuxième alinéa vaut refus des offres. » C'est le seul cas où le silence");
      L.push("vaut refus par la volonté du texte : encore faut-il que la liste ait été");
      L.push("diffusée par un moyen conférant date certaine et qu'elle porte le délai.");
      L.push("");
      L.push("4. DIFFUSION — registre à conserver");
      L.push("");
      L.push(col("Destinataire", 20) + col("Moyen", 20) + col("Date", 12) + "Preuve");
      L.push(TRAIT);
      L.push(col("[nom]", 20) + col("[moyen]", 20) + col("[date]", 12) + "[référence]");
      L.push(TRAIT);
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la mise en mesure du salarié : l'offre\n" +
        "personnalisée ou la liste, l'une des deux, pour chacun."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui, " + leJour(aujourd(ctx)) + " — envoi des offres ou");
      L.push("    publication de la liste, avec preuve de date certaine ;");
      L.push("  · " + dansJours(ctx, plancher) + " — plus tôt que ce jour, le délai de " +
        plancher + " jours");
      L.push("    francs de la liste ne peut pas expirer ; les jours francs se comptent");
      L.push("    entiers, de sorte que la date limite se place au lendemain de ce jour au");
      L.push("    plus tôt : retenez le " + dansJours(ctx, plancher + 1) + " ;");
      L.push("  · à compter du " + dansJours(ctx, plancher + 2) + " — la notification");
      L.push("    redevient possible, les autres conditions étant remplies.");
      L.push("");
      L.push("N'EXPÉDIEZ AUCUNE LETTRE avant l'expiration de ce délai : une notification");
      L.push("intervenue pendant que le salarié pouvait encore se porter candidat vide la");
      L.push("liste de son objet.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Les critères de départage restent à écrire par l'employeur : le III de",
         "D. 1233-2-1 impose qu'ils figurent, aucun texte capté ne dit lesquels."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-09 — LE DÉLAI ET LE MOYEN DE RÉPONSE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-09", {
    nom: "Le délai et le moyen de réponse écrits dans l'offre",
    detail: "La clause à insérer, la lettre qui rouvre un délai pour les offres " +
            "muettes, le registre des échéances et le constat de silence.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var offres = liste(f, "offresFaites");
      var sans = offres.filter(function (o) {
        return o.delaiReponse == null || String(o.delaiReponse).trim() === "";
      });
      var enPC = f.procedureCollective === true &&
        (f.typeProcedure === "redressement" || f.typeProcedure === "liquidation");
      var plancher = enPC ? 4 : 15;
      var L = entete(ctx, "Délai et moyen de réponse aux offres de reclassement",
        "articles L. 1233-4 et D. 1233-2-1 du code du travail");

      L.push("POURQUOI UN DÉLAI ÉCRIT CHANGE TOUT");
      L.push("");
      L.push("Le silence d'un salarié ne vaut refus que si l'on peut dire à partir de");
      L.push("quand il se tait. Sans délai identifiable, l'offre reste ouverte : le poste");
      L.push("n'est ni accepté ni refusé, et l'obligation de reclassement de L. 1233-4");
      L.push("n'est pas soldée pour ce poste-là.");
      L.push("");
      L.push("Le texte ne l'écrit expressément que pour la LISTE diffusée : « L'absence de");
      L.push("candidature écrite du salarié à l'issue du délai mentionné au deuxième");
      L.push("alinéa vaut refus des offres » (D. 1233-2-1, III), le délai ne pouvant y");
      L.push("être inférieur à quinze jours francs à compter de la publication — quatre");
      L.push("jours francs dans les entreprises en redressement ou liquidation judiciaire.");
      L.push("");
      L.push("AUCUN TEXTE CAPTÉ NE FIXE DE PLANCHER POUR L'OFFRE PERSONNALISÉE. Ce n'est");
      L.push("pas une liberté : c'est une charge. Le délai que vous écrirez devra être");
      L.push("assez long pour qu'une réponse ait été possible, et c'est vous qui le");
      L.push("défendrez. Le plancher de la liste diffusée donne un ordre de grandeur");
      L.push("qu'il serait imprudent de descendre sans raison.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (!offres.length) {
        L.push("Aucune offre n'est renseignée : la clause ci-dessous est à insérer dans");
        L.push("chacune de celles que vous rédigerez.");
      } else {
        L.push(col("Offre · destinataire", 40) + "Délai indiqué");
        L.push(TRAIT);
        offres.forEach(function (o) {
          L.push(col(cro(o.intitule, "intitulé") + " · " + cro(o.salarie, "destinataire non désigné"), 40) +
            cro(o.delaiReponse, "AUCUN"));
        });
        L.push(TRAIT);
        L.push(sans.length
          ? sans.length + " offre(s) sur " + offres.length + " n'indiquent aucun délai : elles sont à reprendre."
          : "Chaque offre indique un délai. Vérifiez sur la pièce que le MOYEN de répondre y figure aussi : la fiche ne le porte pas.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LA CLAUSE À INSÉRER DANS CHAQUE OFFRE");
      L.push(GROS);
      L.push("");
      L.push("« Vous disposez d'un délai de [NOMBRE] jours à compter de la réception de la");
      L.push("présente offre pour me faire connaître votre réponse.");
      L.push("");
      L.push("Votre réponse doit être écrite. Vous pouvez la remettre en main propre");
      L.push("contre décharge à [NOM ET QUALITÉ], l'adresser par lettre recommandée avec");
      L.push("avis de réception à [ADRESSE], ou l'envoyer par courriel à [ADRESSE");
      L.push("ÉLECTRONIQUE].");
      L.push("");
      L.push("À défaut de réponse de votre part à l'expiration de ce délai, je considérerai");
      L.push("que vous n'êtes pas candidat à ce poste. »");
      L.push("");
      L.push("Trois choses, et les trois sont nécessaires : la DURÉE, son POINT DE DÉPART,");
      L.push("et le MOYEN de répondre. Un délai sans point de départ ne se compte pas ; un");
      L.push("moyen non indiqué se retourne contre celui qui n'a pas reçu la réponse.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE DE RÉOUVERTURE POUR UNE OFFRE MUETTE SUR LE DÉLAI");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("[NOM ET PRÉNOM DU SALARIÉ]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception [ou remise contre");
      L.push("décharge — D. 1233-2-1, I]");
      L.push("");
      L.push("Objet : proposition de reclassement — délai de réponse");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous ai adressé le [DATE] une proposition de reclassement portant sur le");
      L.push("poste de [INTITULÉ]. Cette proposition n'indiquait pas le délai dont vous");
      L.push("disposiez pour y répondre.");
      L.push("");
      L.push("Je vous la confirme donc par la présente, dans les mêmes termes, et vous");
      L.push("précise que vous disposez d'un délai de [NOMBRE] jours à compter de la");
      L.push("réception de ce courrier pour me faire connaître votre réponse, par [MOYEN].");
      L.push("");
      L.push("[Rappeler ici, en entier, les six mentions du poste : intitulé et");
      L.push(" descriptif, nom de l'employeur, nature du contrat, localisation,");
      L.push(" rémunération, classification. Une lettre qui renvoie à la précédente");
      L.push(" oblige le salarié à reconstituer l'offre : elle n'est pas « précise » au");
      L.push(" sens de L. 1233-4.]");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — REGISTRE DES ÉCHÉANCES");
      L.push(GROS);
      L.push("");
      L.push(col("Salarié", 16) + col("Offre", 22) + col("Reçue le", 12) + col("Délai", 10) + "Expire le");
      L.push(TRAIT);
      if (offres.length) {
        offres.forEach(function (o) {
          L.push(col(cro(o.salarie, "[nom]"), 16) + col(cro(o.intitule, "[poste]"), 22) +
            col("[date]", 12) + col(cro(o.delaiReponse, "[délai]"), 10) + "[date]");
        });
      } else {
        L.push(col("[nom]", 16) + col("[poste]", 22) + col("[date]", 12) + col("[délai]", 10) + "[date]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Le délai court de la RÉCEPTION, non de l'envoi : c'est l'avis de réception");
      L.push("ou la décharge qui donne la date, et c'est pourquoi D. 1233-2-1 impose un");
      L.push("moyen conférant date certaine.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — CONSTAT DE SILENCE À L'EXPIRATION DU DÉLAI");
      L.push(GROS);
      L.push("");
      L.push("Je soussigné(e) " + cro(p.responsable, "nom, qualité") + " constate que");
      L.push("[NOM DU SALARIÉ], destinataire le [DATE DE RÉCEPTION] d'une offre de");
      L.push("reclassement portant sur le poste de [INTITULÉ], n'a présenté aucune réponse");
      L.push("écrite à l'expiration du délai de [NOMBRE] jours, soit au [DATE].");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE]     Signature :");
      L.push("");
      L.push("Ce constat est daté du jour où le délai expire, jamais avant : établi la");
      L.push("veille, il constate un silence qui ne s'était pas encore produit.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la portée du silence du salarié : sans délai\n" +
        "écrit, il ne vaut pas refus, et le poste reste réputé non refusé."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — envoi ou réenvoi des offres portant délai et moyen ;");
      L.push("  · " + dansJours(ctx, 2) + " — réception présumée, à vérifier sur l'avis ;");
      L.push("  · " + dansJours(ctx, 2 + plancher) + " — expiration d'un délai de " +
        plancher + " jours");
      L.push("    compté de cette réception ;");
      L.push("  · " + dansJours(ctx, 3 + plancher) + " — constats de silence, puis");
      L.push("    notification possible.");
      L.push("");
      L.push("Le nombre de " + plancher + " jours retenu ici est celui que D. 1233-2-1 impose à la");
      L.push("liste diffusée" + (enPC ? " dans les entreprises en redressement ou liquidation judiciaire" : "") +
        " : il sert d'exemple de calcul, non de règle pour l'offre");
      L.push("personnalisée. Écrivez votre délai, et refaites le compte.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Aucun texte capté ne fixe de délai minimal de réponse à une offre",
         "personnalisée : l'application n'en invente pas, et laisse le nombre entre",
         "crochets."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-10 — LE POSTE DE CATÉGORIE INFÉRIEURE ET L'ACCORD EXPRÈS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-10", {
    nom: "Le recueil de l'accord exprès sur un reclassement de catégorie inférieure",
    detail: "La lettre qui demande l'accord AVANT la proposition, le formulaire " +
            "d'accord ou de refus, et le tableau des offres concernées.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var offres = liste(f, "offresFaites");
      var inf = offres.filter(function (o) { return o.categorieInferieure; });
      var sansAccord = inf.filter(function (o) { return o.accordExpres !== true; });
      var L = entete(ctx, "Accord exprès sur un reclassement de catégorie inférieure",
        "article L. 1233-4 du code du travail");

      L.push("L'ORDRE QUE LE TEXTE IMPOSE");
      L.push("");
      L.push("« Le reclassement du salarié s'effectue sur un emploi relevant de la même");
      L.push("catégorie que celui qu'il occupe ou sur un emploi équivalent assorti d'une");
      L.push("rémunération équivalente. A défaut, ET SOUS RÉSERVE DE L'ACCORD EXPRÈS DU");
      L.push("SALARIÉ, le reclassement s'effectue sur un emploi d'une catégorie");
      L.push("inférieure » (L. 1233-4).");
      L.push("");
      L.push("Trois conséquences, et elles commandent la chronologie :");
      L.push("  1. les postes de même catégorie ou équivalents se cherchent et se");
      L.push("     proposent D'ABORD ;");
      L.push("  2. le poste de catégorie inférieure ne vient qu'« à défaut » ;");
      L.push("  3. l'accord exprès du salarié se recueille AVANT que le poste inférieur");
      L.push("     lui soit proposé — c'est une réserve posée à la proposition, non une");
      L.push("     formalité qui la suit.");
      L.push("");
      L.push("Une proposition de catégorie inférieure faite sans cet accord ne vaut pas");
      L.push("offre de reclassement : elle ne décharge de rien, et elle peut être opposée");
      L.push("comme une dégradation proposée sans titre.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (!inf.length) {
        L.push("Aucune offre n'est marquée comme portant sur un emploi de catégorie");
        L.push("inférieure. Vérifiez-le sur les offres elles-mêmes : la comparaison se");
        L.push("fait entre la classification du poste offert et celle du poste occupé, non");
        L.push("sur l'intitulé. Une offre dont la classification descend d'un niveau est");
        L.push("une offre de catégorie inférieure, même si le salaire est maintenu.");
      } else {
        L.push(col("Offre", 28) + col("Destinataire", 14) + col("Classif.", 12) + "Accord exprès ?");
        L.push(TRAIT);
        inf.forEach(function (o) {
          L.push(col(cro(o.intitule, "intitulé"), 28) + col(cro(o.salarie, "non désigné"), 14) +
            col(cro(o.classification, "n. r."), 12) +
            (o.accordExpres === true ? "oui, au dossier" : "NON — à recueillir"));
        });
        L.push(TRAIT);
        if (sansAccord.length) {
          L.push(sansAccord.length + " proposition(s) de catégorie inférieure sans accord");
          L.push("exprès. Ne les décomptez pas comme des offres tant que l'accord n'a pas");
          L.push("été donné, et reprenez-les dans l'ordre : accord d'abord, offre ensuite.");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LETTRE DE DEMANDE D'ACCORD EXPRÈS");
      L.push(GROS);
      L.push("");
      L.push("Cette lettre se place AVANT toute proposition de poste inférieur.");
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("[NOM ET PRÉNOM DU SALARIÉ]");
      L.push("[emploi occupé et classification actuelle]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Remise en main propre contre décharge [ou lettre recommandée avec avis de");
      L.push("réception]");
      L.push("");
      L.push("Objet : recherche de reclassement — postes de catégorie inférieure");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Dans le cadre de la recherche de reclassement conduite en application de");
      L.push("l'article L. 1233-4 du code du travail, [vous avez reçu / vous recevrez] les");
      L.push("offres portant sur des emplois relevant de la même catégorie que le vôtre ou");
      L.push("sur des emplois équivalents assortis d'une rémunération équivalente.");
      L.push("");
      L.push("Le même article prévoit qu'à défaut de tels emplois, et SOUS RÉSERVE DE");
      L.push("VOTRE ACCORD EXPRÈS, le reclassement peut s'effectuer sur un emploi d'une");
      L.push("catégorie inférieure.");
      L.push("");
      L.push("Je vous demande donc si vous acceptez que des postes d'une catégorie");
      L.push("inférieure à la vôtre vous soient proposés. Votre réponse ne vous engage à");
      L.push("accepter aucun poste : elle ouvre seulement la possibilité que de telles");
      L.push("offres vous soient adressées, chacune restant soumise à votre acceptation.");
      L.push("");
      L.push("[Si vous êtes en mesure de le faire dès à présent, indiquez ici la nature des");
      L.push(" postes concernés — sans les proposer : « des postes de niveau …, dans les");
      L.push(" sociétés …, aux conditions de rémunération de … ». Un salarié qui ne sait");
      L.push(" pas de quoi il s'agit ne donne pas un accord éclairé.]");
      L.push("");
      L.push("Je vous remercie de me répondre par écrit avant le [DATE], au moyen du");
      L.push("formulaire joint ou par tout écrit de votre choix.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("Pièce jointe : formulaire d'accord");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — FORMULAIRE D'ACCORD OU DE REFUS");
      L.push(GROS);
      L.push("");
      L.push("Je soussigné(e) [NOM, PRÉNOM], occupant l'emploi de [EMPLOI], classification");
      L.push("[CLASSIFICATION], déclare, en réponse au courrier du [DATE] :");
      L.push("");
      L.push("  ☐ ACCEPTER que des emplois d'une catégorie inférieure à la mienne me");
      L.push("    soient proposés dans le cadre de la recherche de reclassement ;");
      L.push("  ☐ REFUSER que de tels emplois me soient proposés.");
      L.push("");
      L.push("Je suis informé(e) que cette réponse ne vaut acceptation d'aucun poste en");
      L.push("particulier, et que chaque offre me sera adressée par écrit.");
      L.push("");
      L.push("Fait à …………………, le ……………     Signature :");
      L.push("");
      L.push("« Exprès » veut dire écrit et sans équivoque. Un accord verbal, une absence");
      L.push("de réaction, une candidature spontanée à un poste inférieur ne sont pas");
      L.push("l'accord que le texte exige : c'est ce formulaire, signé et daté, qui le");
      L.push("porte.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — SUIVI");
      L.push(GROS);
      L.push("");
      L.push(col("Salarié", 16) + col("Demande envoyée", 16) + col("Réponse", 12) + "Offres inférieures adressées");
      L.push(TRAIT);
      if (inf.length) {
        inf.forEach(function (o) {
          L.push(col(cro(o.salarie, "[nom]"), 16) + col("[date]", 16) +
            col(o.accordExpres === true ? "accord" : "[à venir]", 12) +
            cro(o.intitule, "[poste]") + " le [date]");
        });
      } else {
        L.push(col("[nom]", 16) + col("[date]", 16) + col("[accord/refus]", 12) + "[poste] le [date]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Pour les salariés qui refusent, RETIREZ du décompte des offres celles qui");
      L.push("portaient sur un poste inférieur : elles ne comptent pas, et laisser le");
      L.push("décompte inchangé donnerait une image fausse de la recherche.");
      L.push("");

      L = L.concat(blocNonRattrapable([
        "Si la proposition de catégorie inférieure est déjà partie sans accord et la",
        "notification faite, l'accord recueilli aujourd'hui ne la validera pas : la",
        "réserve du texte porte sur la proposition, et une réserve ne se lève pas",
        "après coup. Reprenez la proposition si la lettre n'est pas partie ; sinon,",
        "constatez, ne décomptez pas ces offres, et faites examiner le point.",
      ]));

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la réserve posée par L. 1233-4 au reclassement\n" +
        "sur un emploi de catégorie inférieure : l'accord exprès du salarié."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — envoi des demandes d'accord ;");
      L.push("  · " + dansJours(ctx, 7) + " — date de réponse si vous accordez une");
      L.push("    semaine ;");
      L.push("  · " + dansJours(ctx, 8) + " — envoi des offres de catégorie inférieure");
      L.push("    aux seuls salariés ayant donné leur accord ;");
      L.push("  · " + dansJours(ctx, 23) + " — expiration d'un délai de réponse de quinze");
      L.push("    jours ouvert sur ces offres ;");
      L.push("  · à compter du " + dansJours(ctx, 24) + " — notification possible.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-11 — LES PIÈCES EXTÉRIEURES À LA DIRECTION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-11", {
    nom: "Les pièces extérieures qui établissent l'absence de poste",
    detail: "Le bordereau des pièces à réunir, la demande d'extraction adressée à " +
            "chaque société, l'attestation établie par un tiers et la grille d'auto-contrôle.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var att = pieceDe(f, "attestation-absence-poste");
      var fr = societesFR(f);
      var L = entete(ctx, "Justification externe de l'absence de poste disponible",
        "article L. 1233-4 du code du travail");

      L.push("CE QUE CE DOCUMENT CORRIGE");
      L.push("");
      L.push("L. 1233-4 exige que le reclassement « ne puisse être opéré ». C'est à");
      L.push("l'employeur de l'établir. Une attestation qu'il se délivre à lui-même — sur");
      L.push("son papier, signée de sa direction, sans pièce derrière — n'est pas une");
      L.push("preuve : c'est la répétition de ce qu'il faut prouver.");
      L.push("");
      L.push("Le remède n'est pas d'écrire l'attestation plus fermement. Il est de");
      L.push("l'adosser à des pièces qui existent indépendamment d'elle, et que l'on");
      L.push("n'écrit pas pour les besoins du dossier : le registre du personnel, les");
      L.push("extractions datées de l'outil de gestion, les organigrammes, les états de");
      L.push("mouvements, les réponses écrites des sociétés interrogées.");
      L.push("");
      L.push("Aucun article du corpus de ce module ne régit la tenue du registre du");
      L.push("personnel : l'application le nomme comme pièce d'appui, elle ne cite aucun");
      L.push("texte à son sujet et n'en décrit pas le contenu obligatoire.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (att) {
        L.push("Attestation au dossier : " + cro(att.fichier, "fichier") + ", du " +
          jour(att.date, "date non portée") + ", auteur : " +
          cro(att.auteur, "NON RENSEIGNÉ") + ".");
        L.push("");
        L.push("Posez-vous la seule question qui compte : cet auteur est-il en mesure de");
        L.push("vérifier ce qu'il atteste, et est-il distinct de celui qui décide du");
        L.push("licenciement ? Si les deux se confondent, la pièce garde sa valeur");
        L.push("d'organisation interne, mais elle ne renverse rien.");
      } else {
        L.push("Aucune attestation d'absence de poste n'est versée. Établissez-la (point");
        L.push("CTL-REC-04) ET réunissez les pièces ci-dessous : l'une sans les autres ne");
        L.push("suffit pas.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — BORDEREAU DES PIÈCES À RÉUNIR");
      L.push(GROS);
      L.push("");
      L.push(col("Pièce", 38) + col("Date", 12) + "Origine");
      L.push(TRAIT);
      L.push(col("Registre du personnel, extrait sur la", 38) + col("[date]", 12) + "[service / société]");
      L.push(col("  période de recherche", 38) + col("", 12) + "");
      L.push(col("État des mouvements de personnel", 38) + col("[date]", 12) + "[service / société]");
      L.push(col("Organigramme daté, avant et après", 38) + col("[date]", 12) + "[direction]");
      L.push(col("Extraction de l'outil de gestion des", 38) + col("[date]", 12) + "[éditeur / service]");
      L.push(col("  ressources humaines", 38) + col("", 12) + "");
      L.push(col("État des postes ouverts au recrutement", 38) + col("[date]", 12) + "[groupe]");
      L.push(col("Réponses écrites des sociétés du", 38) + col("[dates]", 12) + "[chaque société]");
      L.push(col("  périmètre (point CTL-REC-02)", 38) + col("", 12) + "");
      L.push(TRAIT);
      L.push("");
      L.push("Une pièce non datée ne sert à rien : c'est la date qui la rattache à la");
      L.push("période où la recherche devait être conduite.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — DEMANDE D'EXTRACTION ADRESSÉE À CHAQUE SOCIÉTÉ");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push("");
      L.push("À [SOCIÉTÉ / SERVICE DÉTENTEUR DES DONNÉES]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : extraction datée des effectifs et des mouvements");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Dans le cadre de la recherche de reclassement conduite en application de");
      L.push("l'article L. 1233-4 du code du travail, je vous demande de bien vouloir me");
      L.push("communiquer, pour la période du [DATE] au [DATE] :");
      L.push("");
      L.push("  1. l'état des effectifs de votre société à chacune de ces deux dates ;");
      L.push("  2. la liste des entrées et des sorties survenues pendant la période, avec");
      L.push("     l'emploi concerné et la date ;");
      L.push("  3. la liste des postes ouverts au recrutement à la date du [DATE], quel");
      L.push("     que soit le type de contrat ;");
      L.push("  4. l'organigramme en vigueur, daté.");
      L.push("");
      L.push("Ces éléments sont demandés tels qu'ils figurent dans vos outils de gestion,");
      L.push("sans mise en forme particulière : c'est leur caractère brut et daté qui leur");
      L.push("donne leur valeur.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      if (fr.length) {
        L.push("Destinataires, d'après votre dossier :");
        fr.forEach(function (s) { L.push("  · " + cro(s.nom, "société")); });
        L.push("");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — ATTESTATION ÉTABLIE PAR UNE PERSONNE DISTINCTE DU DÉCIDEUR");
      L.push(GROS);
      L.push("");
      L.push("Je soussigné(e) [NOM, PRÉNOM], [QUALITÉ — la personne qui tient les données");
      L.push("de gestion ou qui en répond : responsable du personnel, expert-comptable,");
      L.push("commissaire aux comptes, direction d'une autre société du périmètre],");
      L.push("");
      L.push("atteste avoir procédé, à la demande de " + nom + ", à l'examen des");
      L.push("pièces énumérées au bordereau annexé, et constate qu'à la date du [DATE] :");
      L.push("");
      L.push("  ☐ aucun emploi disponible au sens de l'article L. 1233-4 du code du");
      L.push("    travail n'apparaît dans les sociétés examinées ;");
      L.push("  ☐ les seuls emplois disponibles apparaissant sont les suivants : [liste].");
      L.push("");
      L.push("Cette attestation porte sur ce que les pièces montrent, à la date indiquée.");
      L.push("");
      L.push("Fait à …………………, le ……………     Signature :");
      L.push("");
      L.push("N'écrivez pas cette attestation à la place de celui qui la signe, et ne lui");
      L.push("demandez pas d'attester ce qu'il n'a pas vérifié : une attestation de");
      L.push("complaisance est une pièce plus dangereuse qu'une pièce absente.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — GRILLE D'AUTO-CONTRÔLE");
      L.push(GROS);
      L.push("");
      L.push("  ☐ chaque société du périmètre a répondu par écrit, y compris « néant »");
      L.push("  ☐ chaque pièce porte une date, et cette date est dans la période utile");
      L.push("  ☐ l'auteur de l'attestation est distinct de celui qui décide");
      L.push("  ☐ les mouvements de personnel de la période sont expliqués, entrée par");
      L.push("     entrée");
      L.push("  ☐ l'ensemble est antérieur à la notification (point CTL-REC-06)");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la charge de la preuve : c'est à l'employeur\n" +
        "d'établir que le reclassement ne pouvait être opéré, et une affirmation ne\n" +
        "l'établit pas."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — envoi des demandes d'extraction ;");
      L.push("  · " + dansJours(ctx, 7) + " — réception des pièces, si vous accordez une");
      L.push("    semaine ;");
      L.push("  · " + dansJours(ctx, 8) + " — établissement de l'attestation par le tiers,");
      L.push("    pièces en main ;");
      L.push("  · ensuite seulement — la notification, jamais avant.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le registre du personnel et les outils de gestion sont nommés comme pièces.",
         "Aucun article du corpus de ce module ne les régit : l'application ne dit",
         "donc rien de leur contenu obligatoire."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-12 — LE TERRITOIRE NATIONAL
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-12", {
    nom: "L'état des postes limité au territoire national, et le retraitement des offres étrangères",
    detail: "Le retraitement offre par offre d'après votre dossier, l'état refait " +
            "sur le périmètre national et la vérification de la date de notification.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var offres = liste(f, "offresFaites");
      var etr = societesEtrangeres(f), fr = societesFR(f);
      var noms = {};
      etr.forEach(function (s) { if (s.nom) noms[s.nom] = s; });
      var hors = offres.filter(function (o) { return noms[o.employeur]; });
      var avant2017 = estISO(f.dateNotification) && f.dateNotification < "2017-09-24";
      var L = entete(ctx, "Reclassement et territoire national",
        "article L. 1233-4 du code du travail");

      L.push("CE QUE LE TEXTE LU DIT, ET DEPUIS QUAND");
      L.push("");
      L.push("L. 1233-4, dans la version lue à la source (LEGIARTI000036261863), limite le");
      L.push("reclassement aux « emplois disponibles, SITUÉS SUR LE TERRITOIRE NATIONAL");
      L.push("dans l'entreprise ou les autres entreprises du groupe ».");
      L.push("");
      L.push("Cette limitation est née de l'ordonnance n° 2017-1386 du 22 septembre 2017 :");
      L.push("le contrôle CTL-REC-12 de ce module écarte le grief pour les notifications");
      L.push("antérieures au 24 septembre 2017, la limitation ne leur étant pas opposable.");
      L.push("");
      L.push("Conséquence immédiate : une offre émanant d'une société non établie en");
      L.push("France ne satisfait pas l'obligation. Elle n'est pas interdite — elle ne");
      L.push("compte pas. Un salarié qui n'a reçu que celles-là est, au regard du texte,");
      L.push("un salarié qui n'a reçu aucune offre.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (avant2017) {
        L.push("La notification portée au dossier est datée du " + jour(f.dateNotification) +
          ",");
        L.push("antérieure au 24 septembre 2017. La limitation au territoire national ne");
        L.push("lui est pas opposable, et les offres émanant de sociétés étrangères");
        L.push("comptent. Le retraitement ci-dessous ne vous concerne pas ; conservez");
        L.push("néanmoins le tableau, il documente le périmètre retenu.");
        L.push("");
      }
      if (!etr.length) {
        L.push("Aucune société étrangère n'est déclarée dans le groupe. Vérifiez-le : le");
        L.push("critère est l'ÉTABLISSEMENT de la société, non la nationalité de ses");
        L.push("dirigeants ni la langue de ses contrats. Une succursale française d'une");
        L.push("société étrangère, un établissement étranger d'une société française : ces");
        L.push("cas se tranchent sur le lieu de l'emploi offert.");
      } else {
        L.push("Sociétés du groupe non établies sur le territoire national :");
        etr.forEach(function (s) {
          L.push("  · " + cro(s.nom, "société") + " — " + cro(s.pays, "pays") + " — " +
            cro(s.activite, "activité"));
        });
        L.push("");
        L.push("Offres émanant de ces sociétés : " + hors.length + " sur " + offres.length + ".");
        if (hors.length) {
          L.push("");
          L.push(col("Offre", 28) + col("Employeur", 24) + "Destinataire");
          L.push(TRAIT);
          hors.forEach(function (o) {
            L.push(col(cro(o.intitule, "intitulé"), 28) + col(cro(o.employeur, "employeur"), 24) +
              cro(o.salarie, "non désigné"));
          });
          L.push(TRAIT);
          L.push("Ces offres sortent du décompte. Reprenez ensuite le relevé des");
          L.push("destinataires (point CTL-REC-08) : un salarié dont toutes les offres");
          L.push("figurent ci-dessus n'a, en droit, rien reçu.");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — ÉTAT DES POSTES DISPONIBLES, PÉRIMÈTRE NATIONAL");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("ÉTAT DES EMPLOIS DISPONIBLES SITUÉS SUR LE TERRITOIRE NATIONAL");
      L.push("Arrêté au [DATE]");
      L.push("");
      L.push("Sociétés comprises dans le périmètre :");
      if (fr.length) {
        fr.forEach(function (s) {
          L.push("  · " + cro(s.nom, "société") + " (" + cro(s.pays, "France") + ") — " +
            cro(s.activite, "activité"));
        });
      } else {
        L.push("  · [à énumérer nommément — les sociétés du groupe établies en France");
        L.push("    dont l'organisation, les activités ou le lieu d'exploitation assurent");
        L.push("    la permutation de tout ou partie du personnel]");
      }
      L.push("");
      L.push("Sociétés écartées, et pourquoi :");
      if (etr.length) {
        etr.forEach(function (s) {
          L.push("  · " + cro(s.nom, "société") + " — établie en " + cro(s.pays, "pays") +
            ", hors territoire national (L. 1233-4)");
        });
      } else {
        L.push("  · [aucune, ou à énumérer]");
      }
      L.push("");
      L.push(col("Société", 26) + col("Poste", 26) + col("Lieu", 14) + "Classif. · rémun.");
      L.push(TRAIT);
      liste(f, "postesDisponibles").filter(function (x) { return !noms[x.societe]; })
        .forEach(function (x) {
          L.push(col(x.societe, 26) + col(x.intitule, 26) + col(x.lieu, 14) +
            cro(x.classification, "classif.") + " · " + cro(x.remuneration, "rémun."));
        });
      L.push(col("[société]", 26) + col("[poste]", 26) + col("[lieu]", 14) + "[classif.] · [rémun.]");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — NOTE DE RETRAITEMENT");
      L.push(GROS);
      L.push("");
      L.push("Note interne — recherche de reclassement, périmètre géographique");
      L.push("Établie le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("  1. L'obligation de reclassement de l'article L. 1233-4 du code du travail");
      L.push("     porte sur les emplois disponibles situés sur le territoire national.");
      L.push("  2. Les offres émanant des sociétés énumérées ci-dessus, non établies sur");
      L.push("     ce territoire, sont en conséquence retirées du décompte des offres.");
      L.push("  3. La recherche est rouverte sur les seules sociétés françaises du");
      L.push("     périmètre de permutation, selon le document du point CTL-REC-02.");
      L.push("  4. Le décompte des salariés destinataires d'au moins une offre est refait");
      L.push("     sur cette base (point CTL-REC-08).");
      L.push("  5. [Le cas échéant : les salariés ayant manifesté un intérêt pour un poste");
      L.push("     à l'étranger en sont informés ; rien n'interdit de donner suite, mais");
      L.push("     cela ne tient pas lieu de reclassement au sens du texte.]");
      L.push("");
      L.push("Signature : [nom, qualité]");
      L.push("");

      L = L.concat(blocNonRattrapable([
        "Une offre adressée à l'étranger avant la lettre ne devient pas une offre",
        "valable parce qu'on la reclasse dans un tableau. Si la notification est",
        "partie et qu'un salarié n'avait reçu que de telles offres, l'irrégularité",
        "est acquise pour lui. Ce qui reste : refaire le décompte honnêtement, et",
        "porter le point à la connaissance du conseil de l'entreprise.",
      ]));

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est l'assiette même de l'obligation : les emplois\n" +
        "situés sur le territoire national, et eux seuls."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — retraitement et nouvel état, périmètre national ;");
      L.push("  · " + dansJours(ctx, 10) + " — réponses des sociétés françaises");
      L.push("    interrogées, si vous leur accordez dix jours ;");
      L.push("  · " + dansJours(ctx, 11) + " — envoi des offres correspondantes ;");
      L.push("  · " + dansJours(ctx, 27) + " — expiration d'un délai de réponse de quinze");
      L.push("    jours ;");
      L.push("  · à compter du " + dansJours(ctx, 28) + " — notification possible.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["La date du 24 septembre 2017 vient du contrôle CTL-REC-12 du module, qui",
         "la rattache à l'ordonnance n° 2017-1386 du 22 septembre 2017. Cette",
         "ordonnance n'est pas un article du code du travail : l'application la",
         "nomme, elle ne la reproduit pas."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-EMP-01 — LE DOSSIER DE SUPPRESSION D'EMPLOI
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-EMP-01", {
    nom: "Le dossier de suppression d'emploi : organigrammes, fiches de poste, redistribution",
    detail: "Le tableau avant/après rempli d'après votre dossier, le rapprochement " +
            "avec le nombre de licenciements, le tableau de redistribution des tâches.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var sup = liste(f, "postesSupprimes");
      var total = sup.reduce(function (a, x) {
        return a + ((typeof x.avant === "number" ? x.avant : 0) -
                    (typeof x.apres === "number" ? x.apres : 0));
      }, 0);
      var nb = nbLic(f);
      var ecart = nb != null && sup.length ? total - nb : null;
      var L = entete(ctx, "Dossier de suppression d'emploi",
        "article L. 1233-3, alinéa 1er, du code du travail");

      L.push("CE QUE LE TEXTE EXIGE");
      L.push("");
      L.push("« Constitue un licenciement pour motif économique le licenciement effectué");
      L.push("par un employeur pour un ou plusieurs motifs non inhérents à la personne du");
      L.push("salarié résultant d'une SUPPRESSION OU TRANSFORMATION D'EMPLOI ou d'une");
      L.push("modification, refusée par le salarié, d'un élément essentiel du contrat de");
      L.push("travail, consécutives notamment… » (L. 1233-3).");
      L.push("");
      L.push("Deux termes, et deux démonstrations distinctes : la CAUSE (les difficultés,");
      L.push("la mutation technologique, la réorganisation, la cessation — c'est le");
      L.push("« consécutives à ») et l'EFFET SUR L'EMPLOI (la suppression, la");
      L.push("transformation, la modification refusée). Un dossier peut établir");
      L.push("parfaitement les difficultés et échouer sur l'emploi, parce que rien n'y dit");
      L.push("quel poste disparaît ni ce que deviennent ses tâches.");
      L.push("");
      L.push("Le même article ajoute que « la matérialité de la suppression, de la");
      L.push("transformation d'emploi ou de la modification d'un élément essentiel du");
      L.push("contrat de travail s'apprécie AU NIVEAU DE L'ENTREPRISE » — et non au niveau");
      L.push("du groupe ni du secteur d'activité, à la différence de la cause. C'est votre");
      L.push("entreprise, " + nom + ", qui doit montrer ses postes.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (!sup.length) {
        L.push("Aucun poste supprimé n'est renseigné : ni la suppression ni son étendue ne");
        L.push("peuvent être décrites ici. Le tableau ci-dessous est à remplir poste par");
        L.push("poste, avec les effectifs avant et après.");
      } else {
        L.push(col("Poste", 30) + col("Service", 18) + col("Avant", 8) + col("Après", 8) + "Supprimés");
        L.push(TRAIT);
        sup.forEach(function (x) {
          var d = (typeof x.avant === "number" ? x.avant : 0) -
                  (typeof x.apres === "number" ? x.apres : 0);
          L.push(col(x.intitule, 30) + col(x.service, 18) +
            col(x.avant != null ? x.avant : "[nb]", 8) +
            col(x.apres != null ? x.apres : "[nb]", 8) + d);
        });
        L.push(TRAIT);
        L.push(col("TOTAL", 30) + col("", 18) + col("", 8) + col("", 8) + total);
        L.push("");
        L.push("Licenciements envisagés selon votre dossier : " +
          (nb != null ? nb : "[non renseigné]") + ".");
        if (ecart !== null && ecart !== 0) {
          L.push("");
          L.push("ÉCART DE " + Math.abs(ecart) + " : " + total + " suppression(s) déclarée(s) pour " +
            nb + " licenciement(s).");
          L.push("Un écart n'est pas une faute — il s'explique presque toujours. Mais un");
          L.push("écart NON EXPLIQUÉ affaiblit la démonstration au point qu'elle peut être");
          L.push("écartée. Écrivez l'explication à la pièce 3 : reclassements internes,");
          L.push("départs volontaires, postes vacants supprimés, refus de modification déjà");
          L.push("comptés ailleurs, licenciements déjà prononcés dans la période.");
        } else if (ecart === 0) {
          L.push("Les suppressions déclarées correspondent exactement au nombre de");
          L.push("licenciements envisagés. Vérifiez toutefois les postes vacants supprimés :");
          L.push("un poste supprimé sans salarié dessus se compte dans la réorganisation et");
          L.push("non dans les licenciements.");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — NOTE DE PRÉSENTATION DE LA RÉORGANISATION");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("NOTE SUR LES SUPPRESSIONS D'EMPLOI ENVISAGÉES");
      L.push("Établie le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("1. Situation actuelle");
      L.push("[Décrire l'organisation en vigueur : services, effectifs par emploi,");
      L.push(" rattachements. Cette description doit correspondre à l'organigramme joint.]");
      L.push("");
      L.push("2. Organisation cible");
      L.push("[Décrire l'organisation projetée, emploi par emploi. Ce qui disparaît, ce");
      L.push(" qui se transforme, ce qui se crée — car une réorganisation qui crée des");
      L.push(" postes doit le dire : ces postes sont des postes disponibles au sens de");
      L.push(" L. 1233-4, et ils entrent dans la recherche de reclassement.]");
      L.push("");
      L.push("3. Emplois supprimés ou transformés");
      L.push("[Reprendre le tableau ci-dessus, corrigé et complété.]");
      L.push("");
      L.push("4. Effet sur les contrats");
      L.push("[Distinguer : suppressions pures ; transformations d'emploi ; modifications");
      L.push(" d'un élément essentiel du contrat proposées aux salariés. Ces trois cas");
      L.push(" n'appellent pas les mêmes actes, et L. 1233-3 les distingue.]");
      L.push("");
      L.push("Signature : " + cro(p.responsable, "nom et qualité"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — TABLEAU DE REDISTRIBUTION DES TÂCHES");
      L.push(GROS);
      L.push("");
      L.push("C'est la pièce qu'on oublie, et c'est celle qui décide. Un emploi supprimé");
      L.push("dont les tâches continuent d'être exécutées à l'identique par quelqu'un");
      L.push("d'autre, sans que rien n'ait changé, se défend mal.");
      L.push("");
      L.push(col("Poste supprimé", 24) + col("Tâche", 24) + "Devenir de la tâche");
      L.push(TRAIT);
      if (sup.length) {
        sup.forEach(function (x) {
          L.push(col(cro(x.intitule, "poste"), 24) + col("[tâche]", 24) +
            "[abandonnée / répartie sur … / externalisée / automatisée]");
        });
      } else {
        L.push(col("[poste]", 24) + col("[tâche]", 24) +
          "[abandonnée / répartie sur … / externalisée / automatisée]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Une tâche « répartie » doit dire sur qui, et à quelle charge : si le report");
      L.push("est important, il intéresse aussi les conséquences du projet sur les");
      L.push("conditions de travail des salariés conservés.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — EXPLICATION DE L'ÉCART SUPPRESSIONS / LICENCIEMENTS");
      L.push(GROS);
      L.push("");
      L.push("Suppressions déclarées : " + (sup.length ? total : "[nb]"));
      L.push("Licenciements envisagés : " + (nb != null ? nb : "[nb]"));
      L.push("Écart : " + (ecart !== null ? ecart : "[à calculer]"));
      L.push("");
      L.push("Explication, ligne par ligne :");
      L.push("  · reclassements internes acceptés ................. [nb] — [noms/postes]");
      L.push("  · départs volontaires ou ruptures d'un autre type .. [nb] — [préciser]");
      L.push("  · postes vacants supprimés (aucun salarié dessus) .. [nb] — [intitulés]");
      L.push("  · départs à la retraite, fins de contrat ........... [nb] — [préciser]");
      L.push("  · autres ........................................... [nb] — [préciser]");
      L.push("");
      L.push("Le total des lignes ci-dessus doit égaler l'écart. S'il ne l'égale pas,");
      L.push("c'est qu'une partie du projet n'est pas décrite : cherchez-la maintenant.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — BORDEREAU DES ANNEXES");
      L.push(GROS);
      L.push("");
      L.push("  1. Organigramme avant projet, daté du [DATE].");
      L.push("  2. Organigramme cible, daté du [DATE].");
      L.push("  3. Fiche de poste de chaque emploi supprimé ou transformé.");
      L.push("  4. [Le cas échéant : notes internes, comptes rendus de réunion, études");
      L.push("     ayant préparé la réorganisation.]");
      L.push("");
      L.push("Les deux organigrammes portent des dates différentes et le disent : un");
      L.push("organigramme « cible » non daté ne prouve pas qu'un projet existait avant la");
      L.push("décision.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est l'effet sur l'emploi que L. 1233-3 exige :\n" +
        "suppression, transformation, ou modification refusée d'un élément essentiel\n" +
        "du contrat — appréciée au niveau de l'entreprise."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — établissement des organigrammes et du tableau de");
      L.push("    redistribution ;");
      L.push("  · " + dansJours(ctx, 3) + " — explication écrite de l'écart, s'il en");
      L.push("    subsiste un ;");
      L.push("  · " + dansJours(ctx, 5) + " — versement du dossier AVANT la convocation du");
      L.push("    comité social et économique : c'est de ces pièces que part la");
      L.push("    démonstration remise aux élus.");
      if (estISO(f.dateInfoCSE)) {
        L.push("");
        L.push("Votre dossier porte une convocation du comité datée du " +
          jour(f.dateInfoCSE) + " :");
        L.push("le dossier de suppression doit lui être antérieur, puisqu'il en est la");
        L.push("matière.");
      }
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-EMP-02 — LES CONTRATS PRÉCAIRES ET LES RECRUTEMENTS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-EMP-02", {
    nom: "L'inventaire des contrats précaires et des recrutements sur les emplois supprimés",
    detail: "L'inventaire à extraire, le rapprochement intitulé par intitulé fait " +
            "d'après votre dossier, la note de justification et la décision contrat par contrat.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var sup = liste(f, "postesSupprimes");
      var prec = liste(f, "precaires");
      var declare = Object.prototype.hasOwnProperty.call(f, "precaires");
      var titres = {};
      sup.forEach(function (x) { if (x.intitule) titres[x.intitule] = 1; });
      var conflits = prec.filter(function (c) { return c && titres[c.emploi]; });
      var L = entete(ctx, "Contrats précaires et recrutements sur les emplois supprimés",
        "article L. 1233-3 du code du travail");

      L.push("LA CONTRADICTION QUE CE DOCUMENT PRÉVIENT");
      L.push("");
      L.push("L. 1233-3 fait de la suppression ou de la transformation d'emploi la");
      L.push("condition du licenciement économique. Un contrat à durée déterminée, une");
      L.push("mission d'intérim ou une embauche portant sur l'emploi que l'on déclare");
      L.push("supprimé contredit la suppression elle-même : si le poste est tenu, c'est");
      L.push("qu'il existe.");
      L.push("");
      L.push("C'est la première contradiction que cherche un contradicteur, parce qu'elle");
      L.push("est la plus facile à établir : elle se lit dans les propres registres de");
      L.push("l'entreprise. Mieux vaut la trouver soi-même, et l'expliquer.");
      L.push("");
      L.push("Toutes ces situations ne sont pas des contradictions. Un remplacement de");
      L.push("salarié absent, un accroissement ponctuel étranger au poste supprimé, un");
      L.push("contrat conclu avant le projet et arrivant à son terme s'expliquent — à");
      L.push("condition que l'explication soit ÉCRITE, DATÉE, et versée au dossier avant");
      L.push("la notification. Écrite après, elle ressemble à une justification");
      L.push("reconstituée.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (!declare) {
        L.push("Le champ des contrats précaires n'est pas renseigné : ni déclaré vide, ni");
        L.push("rempli. C'est un silence, et un silence ne vaut pas néant. Faites");
        L.push("l'extraction demandée à la pièce 1 avant de conclure quoi que ce soit.");
      } else if (!prec.length) {
        L.push("Votre dossier déclare qu'aucun contrat à durée déterminée, aucune mission");
        L.push("d'intérim et aucun recrutement ne porte sur un emploi supprimé.");
        L.push("");
        L.push("C'est une déclaration, non une preuve : elle n'est appuyée par aucune");
        L.push("pièce, et elle sera vérifiée sur le registre du personnel en cas de");
        L.push("contestation. Faites l'extraction de la pièce 1 et versez-la : une");
        L.push("déclaration adossée à un état daté vaut infiniment mieux qu'une");
        L.push("déclaration seule.");
      } else {
        L.push(col("Emploi", 30) + col("Type", 14) + col("Période", 20) + "Sur un poste supprimé ?");
        L.push(TRAIT);
        prec.forEach(function (c) {
          L.push(col(cro(c.emploi, "emploi"), 30) + col(cro(c.type, "type"), 14) +
            col(cro(c.periode || c.date, "période"), 20) +
            (titres[c.emploi] ? "OUI — à traiter" : "non, d'après les intitulés"));
        });
        L.push(TRAIT);
        L.push("Le rapprochement ci-dessus se fait sur les INTITULÉS, tels que votre");
        L.push("dossier les porte. Un intitulé différent pour le même travail échappe à ce");
        L.push("test : refaites-le sur les tâches réellement exercées, c'est ainsi qu'il");
        L.push("sera fait en face.");
        if (conflits.length) {
          L.push("");
          L.push(conflits.length + " contrat(s) portent sur un emploi déclaré supprimé :");
          conflits.forEach(function (c) { L.push("  · " + cro(c.emploi, "emploi")); });
          L.push("  Chacun appelle une décision, à la pièce 3.");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — DEMANDE D'EXTRACTION");
      L.push(GROS);
      L.push("");
      L.push("À [SERVICE DU PERSONNEL / PRESTATAIRE DE PAIE]");
      L.push("Objet : extraction des contrats précaires et des embauches");
      L.push("");
      L.push("Merci d'extraire, pour " + nom + " et pour la période du [DATE] au");
      L.push("[DATE] — au minimum les douze derniers mois :");
      L.push("");
      L.push("  1. tous les contrats à durée déterminée, en cours ou achevés, avec");
      L.push("     l'emploi occupé, le motif de recours, les dates de début et de fin ;");
      L.push("  2. toutes les missions d'intérim, avec l'emploi, l'entreprise de travail");
      L.push("     temporaire et les dates ;");
      L.push("  3. toutes les embauches en contrat à durée indéterminée, avec l'emploi et");
      L.push("     la date d'entrée ;");
      L.push("  4. les contrats de prestation portant sur des tâches auparavant exécutées");
      L.push("     en interne, s'il en existe.");
      L.push("");
      L.push("Ces éléments proviennent du registre du personnel et des outils de paie :");
      L.push("l'extraction est datée et conservée telle quelle.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — TABLEAU DE RAPPROCHEMENT");
      L.push(GROS);
      L.push("");
      L.push("Emplois déclarés supprimés :");
      if (sup.length) {
        sup.forEach(function (x) {
          L.push("  · " + cro(x.intitule, "intitulé") + " (" + cro(x.service, "service") + ")");
        });
      } else {
        L.push("  · [à énumérer — voir le document du point CTL-EMP-01]");
      }
      L.push("");
      L.push(col("Contrat / embauche", 26) + col("Emploi occupé", 22) + col("Dates", 16) + "Recoupe ?");
      L.push(TRAIT);
      if (prec.length) {
        prec.forEach(function (c) {
          L.push(col(cro(c.type, "type"), 26) + col(cro(c.emploi, "emploi"), 22) +
            col(cro(c.periode || c.date, "dates"), 16) + (titres[c.emploi] ? "OUI" : "non"));
        });
      } else {
        L.push(col("[CDD / intérim / CDI]", 26) + col("[emploi]", 22) + col("[du … au …]", 16) + "[oui/non]");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — DÉCISION ET JUSTIFICATION, CONTRAT PAR CONTRAT");
      L.push(GROS);
      L.push("");
      L.push("Pour chaque recoupement, une seule ligne, et une décision réelle :");
      L.push("");
      L.push("  Contrat : [référence, emploi, dates]");
      L.push("  ☐ IL PREND FIN : [date de terme ou de rupture, et pièce qui l'établit].");
      L.push("  ☐ IL SE POURSUIT, et voici pourquoi il n'est pas incompatible avec la");
      L.push("    suppression : [remplacement de [NOM], absent depuis le [DATE] pour");
      L.push("    [MOTIF] ; accroissement ponctuel d'activité sur [PÉRIODE] portant sur");
      L.push("    [TÂCHES], distinctes de celles du poste supprimé ; autre — à écrire].");
      L.push("");
      L.push("  Pièce jointe : [contrat, avenant, attestation d'absence, bon de commande");
      L.push("  du client dont l'activité est invoquée…]");
      L.push("");
      L.push("N'écrivez ici aucun motif que vous ne pourriez pas établir. Ce tableau sera");
      L.push("le premier lu, et un motif inexact y coûte plus cher qu'un recoupement");
      L.push("assumé.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — NOTE DE SYNTHÈSE À VERSER AU DOSSIER");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase() + " — note établie le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("L'inventaire des contrats à durée déterminée, des missions d'intérim et des");
      L.push("embauches de la période du [DATE] au [DATE] a été rapproché de la liste des");
      L.push("emplois dont la suppression est envisagée.");
      L.push("");
      L.push("[Conclusion — à écrire d'après le tableau : « aucun contrat ne porte sur un");
      L.push(" emploi supprimé », ou « les contrats suivants y portent, et il en est");
      L.push(" disposé comme suit : … ». Ne concluez pas avant d'avoir rempli les");
      L.push(" tableaux : c'est le rapprochement qui écrit la conclusion, non l'inverse.]");
      L.push("");
      L.push("Signature : " + cro(p.responsable, "nom et qualité"));
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la réalité même de la suppression exigée par\n" +
        "L. 1233-3 : un poste tenu par un autre contrat n'est pas un poste supprimé."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — demande d'extraction ;");
      L.push("  · " + dansJours(ctx, 3) + " — rapprochement intitulé par intitulé, puis");
      L.push("    tâche par tâche ;");
      L.push("  · " + dansJours(ctx, 5) + " — décision et justification écrites, contrat");
      L.push("    par contrat ;");
      L.push("  · " + dansJours(ctx, 6) + " — versement de la note au dossier, AVANT la");
      L.push("    notification.");
      L.push("");
      L.push("Pour les contrats qui doivent prendre fin, le calendrier est celui de leur");
      L.push("terme ou de leur rupture, qui obéit à ses propres règles : l'application ne");
      L.push("les traite pas ici.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le registre du personnel est nommé comme source de l'extraction. Aucun",
         "article du corpus de ce module ne le régit : l'application n'en décrit ni",
         "le contenu ni les modalités de tenue."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-01 — LA DÉMONSTRATION COMPTABLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-01", {
    nom: "Le dossier de démonstration économique : tableau trimestriel, résultats, liasse",
    detail: "Le tableau trimestriel comparé rempli d'après votre dossier, la durée " +
            "de baisse exigée par votre effectif, les séries de résultat et de trésorerie, le bordereau.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var eff = typeof f.effectif === "number" ? f.effectif :
        (typeof p.effectif === "number" ? p.effectif : null);
      var tri = liste(f, "trimestres");
      var re = liste(f, "resultatExploitation");
      var tre = liste(f, "tresorerie");
      var liasse = pieceDe(f, "liasse");
      var seuil = null, seuilTexte = "[selon votre effectif]";
      if (eff != null) {
        if (eff < 11) { seuil = 1; seuilTexte = "un trimestre (entreprise de moins de onze salariés — a)"; }
        else if (eff < 50) { seuil = 2; seuilTexte = "deux trimestres consécutifs (au moins onze et moins de cinquante salariés — b)"; }
        else if (eff < 300) { seuil = 3; seuilTexte = "trois trimestres consécutifs (au moins cinquante et moins de trois cents salariés — c)"; }
        else { seuil = 4; seuilTexte = "quatre trimestres consécutifs (trois cents salariés et plus — d)"; }
      }
      var L = entete(ctx, "Dossier de démonstration économique",
        "article L. 1233-3, 1°, du code du travail");

      L.push("LE TEXTE, SUR CE POINT PRÉCIS");
      L.push("");
      L.push("Le licenciement doit être consécutif « 1° A des difficultés économiques");
      L.push("caractérisées soit par l'évolution significative d'au moins un indicateur");
      L.push("économique tel qu'une baisse des commandes ou du chiffre d'affaires, des");
      L.push("pertes d'exploitation ou une dégradation de la trésorerie ou de l'excédent");
      L.push("brut d'exploitation, soit par tout autre élément de nature à justifier de");
      L.push("ces difficultés » (L. 1233-3).");
      L.push("");
      L.push("« Une baisse significative des commandes ou du chiffre d'affaires est");
      L.push("constituée dès lors que la durée de cette baisse est, en comparaison avec la");
      L.push("même période de l'année précédente, au moins égale à :");
      L.push("  a) Un trimestre pour une entreprise de moins de onze salariés ;");
      L.push("  b) Deux trimestres consécutifs pour une entreprise d'au moins onze");
      L.push("     salariés et de moins de cinquante salariés ;");
      L.push("  c) Trois trimestres consécutifs pour une entreprise d'au moins cinquante");
      L.push("     salariés et de moins de trois cents salariés ;");
      L.push("  d) Quatre trimestres consécutifs pour une entreprise de trois cents");
      L.push("     salariés et plus. »");
      L.push("");
      L.push("DEUX CHOSES À NE PAS CONFONDRE. Le seuil trimestriel ne concerne QUE la");
      L.push("baisse des commandes ou du chiffre d'affaires. Les autres indicateurs —");
      L.push("pertes d'exploitation, dégradation de la trésorerie ou de l'excédent brut");
      L.push("d'exploitation — n'ont pas de durée légale, et le texte laisse en outre");
      L.push("ouverte la voie de « tout autre élément de nature à justifier » les");
      L.push("difficultés. Si votre baisse n'atteint pas la durée exigée, ce n'est pas");
      L.push("perdu : c'est un autre indicateur qu'il faut documenter, et le dire.");
      L.push("");

      L.push("VOTRE EFFECTIF ET LA DURÉE QUI EN DÉCOULE");
      L.push("");
      L.push(eff != null
        ? "Effectif porté au dossier : " + eff + " salariés."
        : "L'effectif n'est pas renseigné : la durée de baisse exigée ne peut pas être déterminée.");
      L.push("Durée de baisse exigée pour le chiffre d'affaires ou les commandes : " +
        seuilTexte + ".");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — TABLEAU TRIMESTRIEL COMPARÉ");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("CHIFFRE D'AFFAIRES [OU COMMANDES — préciser lequel] PAR TRIMESTRE");
      L.push("Comparaison avec le même trimestre de l'année précédente");
      L.push("Périmètre : [ENTREPRISE / SECTEUR D'ACTIVITÉ DU GROUPE — voir le point");
      L.push("CTL-ECO-02, qui commande ce choix]");
      L.push("");
      L.push(col("Trimestre", 14) + col("Année N", 14) + col("Année N-1", 14) +
        col("Écart", 12) + "Baisse ?");
      L.push(TRAIT);
      var suite = 0, meilleure = 0;
      if (tri.length) {
        tri.forEach(function (t) {
          var a = typeof t.n === "number" ? t.n : null;
          var b = typeof t.n1 === "number" ? t.n1 : null;
          var pc = (a != null && b) ? Math.round((a - b) / b * 1000) / 10 : null;
          if (pc !== null && pc < 0) { suite++; if (suite > meilleure) meilleure = suite; }
          else if (pc !== null) suite = 0;
          L.push(col(cro(t.libelle, "trim."), 14) + col(a != null ? a : "[N]", 14) +
            col(b != null ? b : "[N-1]", 14) +
            col(pc !== null ? (pc > 0 ? "+" : "") + pc + " %" : "[écart]", 12) +
            (pc === null ? "[?]" : (pc < 0 ? "oui" : "non")));
        });
      } else {
        L.push(col("[T…-…]", 14) + col("[montant]", 14) + col("[montant]", 14) +
          col("[%]", 12) + "[oui/non]");
        L.push(col("[T…-…]", 14) + col("[montant]", 14) + col("[montant]", 14) +
          col("[%]", 12) + "[oui/non]");
      }
      L.push(TRAIT);
      L.push("");
      if (tri.length) {
        L.push("Trimestres consécutifs en baisse, d'après votre dossier : " + meilleure + ".");
        if (seuil != null) {
          L.push(meilleure >= seuil
            ? "La durée exigée pour votre effectif (" + seuil + ") est atteinte, sur les chiffres déclarés."
            : "La durée exigée pour votre effectif (" + seuil + ") N'EST PAS atteinte sur les chiffres déclarés.");
          if (meilleure < seuil) {
            L.push("Documentez alors un autre indicateur — pertes d'exploitation,");
            L.push("dégradation de la trésorerie ou de l'excédent brut d'exploitation — ou");
            L.push("« tout autre élément de nature à justifier » les difficultés, et");
            L.push("dites-le expressément dans la note de la pièce 4.");
          }
        }
        L.push("Ce calcul porte sur les chiffres SAISIS DANS LA FICHE, non sur vos comptes :");
        L.push("il ne vaut rien tant que la liasse fiscale ne le confirme pas.");
      } else {
        L.push("Aucun trimestre n'est renseigné dans votre dossier : ce tableau est à");
        L.push("remplir. Sans lui, le 1° de L. 1233-3 reste une affirmation.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — RÉSULTAT D'EXPLOITATION, TROIS EXERCICES");
      L.push(GROS);
      L.push("");
      L.push(col("Exercice", 14) + col("Résultat d'exploitation", 26) + "Source");
      L.push(TRAIT);
      if (re.length) {
        re.forEach(function (x) {
          L.push(col(cro(x.annee, "exercice"), 14) +
            col(x.valeur != null ? x.valeur : "[montant]", 26) + "[liasse / comptes]");
        });
      } else {
        L.push(col("[année]", 14) + col("[montant]", 26) + "[liasse]");
        L.push(col("[année]", 14) + col("[montant]", 26) + "[liasse]");
        L.push(col("[année]", 14) + col("[montant]", 26) + "[liasse]");
      }
      L.push(TRAIT);
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 3 — TRÉSORERIE ET EXCÉDENT BRUT D'EXPLOITATION");
      L.push(GROS);
      L.push("");
      L.push(col("Exercice", 14) + col("Trésorerie", 20) + col("EBE", 20) + "Source");
      L.push(TRAIT);
      if (tre.length) {
        tre.forEach(function (x) {
          L.push(col(cro(x.annee, "exercice"), 14) +
            col(x.valeur != null ? x.valeur : "[montant]", 20) + col("[montant]", 20) + "[liasse]");
        });
      } else {
        L.push(col("[année]", 14) + col("[montant]", 20) + col("[montant]", 20) + "[liasse]");
        L.push(col("[année]", 14) + col("[montant]", 20) + col("[montant]", 20) + "[liasse]");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — NOTE DE PRÉSENTATION DE LA DÉMONSTRATION");
      L.push(GROS);
      L.push("");
      L.push("1. L'indicateur invoqué");
      L.push("[Dire lequel des indicateurs de L. 1233-3, 1° est invoqué, et pourquoi :");
      L.push(" baisse des commandes, baisse du chiffre d'affaires, pertes d'exploitation,");
      L.push(" dégradation de la trésorerie, dégradation de l'excédent brut");
      L.push(" d'exploitation, ou tout autre élément — à décrire.]");
      L.push("");
      L.push("2. Le périmètre");
      L.push("[Entreprise seule si elle n'appartient à aucun groupe ; sinon, secteur");
      L.push(" d'activité commun à l'entreprise et aux entreprises du groupe établies sur");
      L.push(" le territoire national. Le document du point CTL-ECO-02 traite ce choix.]");
      L.push("");
      L.push("3. La période");
      L.push("[Du … au …, et pourquoi cette période : elle doit se rattacher à la date à");
      L.push(" laquelle la cause est appréciée.]");
      L.push("");
      L.push("4. Les pièces");
      L.push("[Renvoyer aux tableaux et à la liasse.]");
      L.push("");
      L.push("Signature : " + cro(p.responsable, "nom et qualité"));
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 5 — BORDEREAU DES PIÈCES COMPTABLES");
      L.push(GROS);
      L.push("");
      L.push("  ☐ Liasse fiscale de chaque exercice invoqué" +
        (liasse ? " — au dossier : " + cro(liasse.fichier, "fichier") +
          ", " + cro(liasse.periode, "période") : " — ABSENTE DU DOSSIER"));
      L.push("  ☐ Comptes annuels et annexe");
      L.push("  ☐ Situation intermédiaire, si la période invoquée n'est pas close");
      L.push("  ☐ Balances ou grands livres à l'appui du tableau trimestriel");
      L.push("  ☐ [Visa de l'expert-comptable ou du commissaire aux comptes, s'il en");
      L.push("     existe un : ce visa ne rend pas les chiffres vrais, il rend leur");
      L.push("     origine vérifiable]");
      L.push("");
      L.push("Sans la liasse, les tableaux restent des documents internes : ils disent ce");
      L.push("que l'entreprise affirme, non ce que ses comptes portent.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la caractérisation des difficultés\n" +
        "économiques : non chiffrées, elles ne sont pas caractérisées au sens du 1°\n" +
        "de L. 1233-3."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — construction des trois tableaux ;");
      L.push("  · " + dansJours(ctx, 7) + " — obtention de la liasse et, s'il y a lieu, du");
      L.push("    visa du professionnel des comptes ;");
      L.push("  · " + dansJours(ctx, 10) + " — remise du dossier au comité social et");
      L.push("    économique AVEC la convocation : les renseignements se joignent à");
      L.push("    l'ordre du jour, ils ne se distribuent pas en séance ;");
      L.push("  · ensuite — la consultation, puis la notification.");
      if (estISO(f.dateInfoCSE)) {
        L.push("");
        L.push("Votre dossier porte une convocation du comité datée du " +
          jour(f.dateInfoCSE) + " : la démonstration doit être prête à cette date.");
      }
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le contrôle CTL-ECO-01 du module rappelle que, si le seuil trimestriel est",
         "écarté, un indicateur de repli doit être documenté (Cass. soc. 21 septembre",
         "2022, n° 20-18.511, décision figurant au corpus du module)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-02 — LE PÉRIMÈTRE D'APPRÉCIATION DE LA CAUSE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-02", {
    nom: "La démonstration refaite au périmètre du secteur d'activité",
    detail: "La note qui délimite et nomme le secteur, le tableau consolidé société " +
            "par société d'après votre dossier, et la demande de comptes aux sociétés.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var soc = liste(f, "societes");
      var fr = societesFR(f);
      var nommees = liste(f, "societesDuSecteur");
      var act = f.activite ? String(f.activite).toLowerCase() : null;
      var memeAct = fr.filter(function (s) {
        return s.activite && act && String(s.activite).toLowerCase() === act;
      });
      var tri = liste(f, "trimestres");
      var secteurDeclare = tri.some(function (t) { return t && t.perimetre === "secteur"; });
      var L = entete(ctx, "Périmètre d'appréciation de la cause économique",
        "article L. 1233-3 du code du travail");

      L.push("LE TEXTE, ET CE QU'IL COMMANDE");
      L.push("");
      L.push("« Les difficultés économiques, les mutations technologiques ou la nécessité");
      L.push("de sauvegarder la compétitivité de l'entreprise s'apprécient au niveau de");
      L.push("cette entreprise si elle n'appartient pas à un groupe et, dans le cas");
      L.push("contraire, AU NIVEAU DU SECTEUR D'ACTIVITÉ COMMUN à cette entreprise et aux");
      L.push("entreprises du groupe auquel elle appartient, ÉTABLIES SUR LE TERRITOIRE");
      L.push("NATIONAL, sauf fraude » (L. 1233-3).");
      L.push("");
      L.push("« Le secteur d'activité permettant d'apprécier la cause économique du");
      L.push("licenciement est caractérisé, notamment, par la nature des produits biens ou");
      L.push("services délivrés, la clientèle ciblée, ainsi que les réseaux et modes de");
      L.push("distribution, se rapportant à un même marché » (même article).");
      L.push("");
      L.push("Et la notion de groupe y est celle « formé par une entreprise appelée");
      L.push("entreprise dominante et les entreprises qu'elle contrôle dans les conditions");
      L.push("définies à l'article L. 233-1, aux I et II de l'article L. 233-3 et à");
      L.push("l'article L. 233-16 du code de commerce ». Ces trois articles ne sont pas au");
      L.push("code du travail : l'application les nomme, elle ne les a pas lus et n'en dit");
      L.push("rien de plus.");
      L.push("");
      L.push("ATTENTION À NE PAS CONFONDRE DEUX PÉRIMÈTRES. La MATÉRIALITÉ de la");
      L.push("suppression d'emploi s'apprécie au niveau de l'entreprise (point");
      L.push("CTL-EMP-01) ; la CAUSE s'apprécie au niveau du secteur d'activité du groupe.");
      L.push("Deux pièces, deux périmètres, et les intervertir ruine les deux.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (!f.groupe) {
        L.push("Votre dossier ne déclare aucun groupe : la cause s'apprécie alors au niveau");
        L.push("de " + nom + " seule, et ce document se réduit à la note de la pièce 1,");
        L.push("qui doit le dire et l'établir. Si un groupe existe — même étranger, même");
        L.push("réduit à une holding — revenez à l'audit : cette réponse commande tout.");
      } else {
        L.push("Groupe déclaré" +
          (typeof f.effectifGroupe === "number" ? " — effectif total : " + f.effectifGroupe : "") + ".");
        L.push("Activité de l'entreprise auditée : " + cro(f.activite, "NON RENSEIGNÉE") + ".");
        L.push("");
        if (soc.length) {
          L.push(col("Société", 30) + col("Activité", 26) + col("Pays", 12) + "Même secteur ?");
          L.push(TRAIT);
          soc.forEach(function (s) {
            var meme = s.activite && act && String(s.activite).toLowerCase() === act;
            L.push(col(s.nom, 30) + col(s.activite, 26) +
              col(s.pays || (s.etranger ? "étranger" : "France"), 12) +
              (s.etranger ? "hors périmètre (territoire)" : (meme ? "OUI, à agréger" : "[à trancher]")));
          });
          L.push(TRAIT);
          L.push("La colonne de droite compare des LIBELLÉS d'activité. Le texte, lui,");
          L.push("caractérise le secteur par la nature des produits, biens ou services");
          L.push("délivrés, la clientèle ciblée, les réseaux et modes de distribution se");
          L.push("rapportant à un même marché : c'est cette analyse-là qui décide, et elle");
          L.push("est à écrire à la pièce 1.");
        } else {
          L.push("Aucune société du groupe n'est renseignée : le secteur ne peut pas être");
          L.push("délimité. Énumérez-les avant tout.");
        }
        L.push("");
        L.push(nommees.length
          ? "Sociétés que votre dossier nomme comme relevant du secteur : " + nommees.join(", ") + "."
          : "Votre dossier ne NOMME aucune société comme relevant du secteur d'activité.");
        L.push(secteurDeclare
          ? "Vos données trimestrielles se déclarent portant sur le « secteur »."
          : "Vos données trimestrielles ne se déclarent pas portant sur le secteur : rien n'indique qu'elles dépassent la seule entreprise.");
        if (memeAct.length && !nommees.length) {
          L.push("");
          L.push(memeAct.length + " société(s) française(s) du groupe portent la même activité");
          L.push("que l'entreprise auditée : " +
            memeAct.map(function (s) { return s.nom; }).join(", ") + ".");
          L.push("Une étiquette « secteur » posée sur un tableau ne prouve pas qu'elles y");
          L.push("sont comprises. La pièce doit le dire, société par société.");
        }
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — NOTE DE DÉLIMITATION DU SECTEUR D'ACTIVITÉ");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("NOTE SUR LE PÉRIMÈTRE D'APPRÉCIATION DE LA CAUSE ÉCONOMIQUE");
      L.push("Établie le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("1. Le groupe");
      L.push("[Nommer l'entreprise dominante et les entreprises contrôlées. Le renvoi de");
      L.push(" L. 1233-3 aux articles L. 233-1, L. 233-3 (I et II) et L. 233-16 du code de");
      L.push(" commerce commande cette liste : faites-la établir par votre conseil, qui a");
      L.push(" lu ces textes.]");
      L.push("");
      L.push("2. Les sociétés établies sur le territoire national");
      if (fr.length) {
        fr.forEach(function (s) {
          L.push("   · " + cro(s.nom, "société") + " — " + cro(s.activite, "activité") +
            (s.effectif != null ? " — " + s.effectif + " salariés" : ""));
        });
      } else {
        L.push("   · [à énumérer]");
      }
      var etr = societesEtrangeres(f);
      if (etr.length) {
        L.push("   Écartées comme non établies sur le territoire national :");
        etr.forEach(function (s) {
          L.push("   · " + cro(s.nom, "société") + " (" + cro(s.pays, "pays") + ")");
        });
      }
      L.push("");
      L.push("3. La caractérisation du secteur, selon les quatre éléments du texte");
      L.push("   · nature des produits, biens ou services délivrés : [À ÉCRIRE]");
      L.push("   · clientèle ciblée : [À ÉCRIRE]");
      L.push("   · réseaux et modes de distribution : [À ÉCRIRE]");
      L.push("   · marché auquel le tout se rapporte : [À ÉCRIRE]");
      L.push("");
      L.push("4. Les sociétés retenues comme relevant du même secteur, et pourquoi");
      L.push("   [Société par société, une phrase qui applique les quatre éléments");
      L.push("    ci-dessus. Une société écartée s'explique aussi : c'est l'exclusion qui");
      L.push("    sera contestée, pas l'inclusion.]");
      L.push("");
      L.push("Signature : " + cro(p.responsable, "nom et qualité"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — TABLEAU CONSOLIDÉ, SOCIÉTÉ PAR SOCIÉTÉ");
      L.push(GROS);
      L.push("");
      L.push("La pièce doit NOMMER ce qu'elle agrège. Un total sans détail ne se vérifie");
      L.push("pas, et une étiquette « secteur » sur un total n'est qu'une affirmation.");
      L.push("");
      L.push("Indicateur : [chiffre d'affaires / commandes / résultat d'exploitation /");
      L.push("trésorerie / excédent brut d'exploitation — un tableau par indicateur]");
      L.push("");
      var entetes = col("Société", 28);
      if (tri.length) tri.forEach(function (t) { entetes += col(cro(t.libelle, "T…"), 12); });
      else entetes += col("[T1]", 12) + col("[T2]", 12) + col("[T3]", 12) + col("[T4]", 12);
      L.push(entetes);
      L.push(TRAIT);
      var lignes = (memeAct.length ? memeAct : fr);
      if (lignes.length) {
        lignes.forEach(function (s) {
          var ligne = col(s.nom, 28);
          var k = tri.length || 4;
          for (var i = 0; i < k; i++) ligne += col("[montant]", 12);
          L.push(ligne);
        });
      } else {
        L.push(col("[société]", 28) + col("[montant]", 12) + col("[montant]", 12));
      }
      var tot = col("TOTAL SECTEUR", 28);
      if (tri.length) {
        tri.forEach(function (t) {
          tot += col(typeof t.n === "number" ? t.n : "[total]", 12);
        });
      } else { tot += col("[total]", 12) + col("[total]", 12) + col("[total]", 12) + col("[total]", 12); }
      L.push(TRAIT);
      L.push(tot);
      L.push(TRAIT);
      L.push("");
      L.push("Les totaux de la dernière ligne sont ceux que porte votre fiche, lorsqu'ils");
      L.push("y figurent. Les lignes par société sont à remplir : c'est leur somme qui");
      L.push("doit donner le total, et l'écart éventuel est la première chose à");
      L.push("expliquer.");
      L.push("");
      if (f.autresElements) {
        L.push("Votre dossier porte en outre, au titre des autres éléments invoqués :");
        L.push("« " + String(f.autresElements) + " »");
        L.push("Reprenez ces éléments dans le tableau : s'ils concernent une société du");
        L.push("secteur, ils doivent y figurer, favorables ou non.");
        L.push("");
      }

      L.push(GROS);
      L.push("PIÈCE 3 — DEMANDE DE COMPTES AUX SOCIÉTÉS DU SECTEUR");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("À la direction de [SOCIÉTÉ]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : appréciation de la cause économique — communication de données");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("L'article L. 1233-3 du code du travail impose d'apprécier les difficultés");
      L.push("économiques au niveau du secteur d'activité commun à notre entreprise et aux");
      L.push("entreprises du groupe établies sur le territoire national.");
      L.push("");
      L.push("Votre société relevant de ce secteur, je vous demande de me communiquer,");
      L.push("pour les exercices [ANNÉES] et pour les trimestres [PÉRIODE] :");
      L.push("  1. le chiffre d'affaires et les commandes, trimestre par trimestre, avec");
      L.push("     le comparatif du même trimestre de l'année précédente ;");
      L.push("  2. le résultat d'exploitation de chaque exercice ;");
      L.push("  3. la trésorerie et l'excédent brut d'exploitation ;");
      L.push("  4. la liasse fiscale de chaque exercice.");
      L.push("");
      L.push("Ces éléments seront agrégés et présentés au comité social et économique.");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est le périmètre : une démonstration faite au\n" +
        "niveau de la seule entreprise, quand le texte commande celui du secteur\n" +
        "d'activité du groupe, ne caractérise pas la cause de L. 1233-3."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — note de délimitation et demandes de données ;");
      L.push("  · " + dansJours(ctx, 21) + " — réception et agrégation des comptes, si");
      L.push("    vous accordez trois semaines aux sociétés interrogées ;");
      L.push("  · " + dansJours(ctx, 25) + " — démonstration consolidée prête pour le");
      L.push("    comité social et économique ;");
      L.push("  · ensuite — la consultation, puis la notification.");
      L.push("");
      L.push("Agréger des comptes prend du temps : c'est le point de ce module qui");
      L.push("repousse le plus souvent un calendrier, et le découvrir tard est la");
      L.push("mauvaise façon de l'apprendre.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le contrôle CTL-ECO-02 du module rappelle qu'« il incombe à l'employeur de",
         "démontrer, dans le périmètre pertinent, la réalité et le sérieux du motif »",
         "(Cass. soc. 31 mars 2021, n° 19-26.054, décision figurant au corpus du",
         "module)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-03 — LA MENACE SUR LA COMPÉTITIVITÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-03", {
    nom: "La note d'analyse de la menace sur la compétitivité, et sa lettre de mission",
    detail: "La lettre de mission au tiers, le plan imposé de la note, le tableau " +
            "de chiffrage et le scénario de référence sans réorganisation.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var L = entete(ctx, "Analyse de la menace pesant sur la compétitivité",
        "article L. 1233-3, 3°, du code du travail");

      L.push(GROS);
      L.push("CE QUE L'APPLICATION NE TRANCHE PAS");
      L.push(GROS);
      L.push("");
      L.push("Le contrôle CTL-ECO-03 de ce module ne conclut JAMAIS à la conformité, quel");
      L.push("que soit le soin apporté au dossier. La question — cette réorganisation");
      L.push("était-elle nécessaire à la sauvegarde de la compétitivité ? — excède ce");
      L.push("qu'une base de textes peut apprécier : elle suppose de lire un marché, des");
      L.push("comptes et une stratégie.");
      L.push("");
      L.push("Ce document ne rédige donc pas la note d'analyse. Il en dit le contenu, il");
      L.push("écrit la lettre de mission qui la commande, et il donne la trame que le");
      L.push("professionnel remplira. Une note que l'employeur écrirait seul, avec les");
      L.push("mots que l'application lui aurait soufflés, serait le contraire de ce que le");
      L.push("texte attend.");
      L.push("");

      L.push("LE TEXTE, ET LA FRONTIÈRE QU'IL TRACE");
      L.push("");
      L.push("Le licenciement peut être consécutif « 3° A une réorganisation de");
      L.push("l'entreprise nécessaire à la sauvegarde de sa compétitivité » (L. 1233-3).");
      L.push("");
      L.push("Deux mots portent tout : NÉCESSAIRE, et SAUVEGARDE. Sauvegarder suppose");
      L.push("quelque chose à préserver, donc une menace ; nécessaire suppose que la");
      L.push("réorganisation soit la réponse à cette menace, et non un choix parmi");
      L.push("d'autres également ouverts. C'est là que se sépare la réorganisation");
      L.push("nécessaire de la recherche d'une rentabilité meilleure — et une menace");
      L.push("seulement affirmée ne fait pas cette séparation.");
      L.push("");
      L.push("Le périmètre d'appréciation est le même que pour les difficultés : celui du");
      L.push("secteur d'activité du groupe, établi sur le territoire national, si");
      L.push("l'entreprise appartient à un groupe (L. 1233-3 ; point CTL-ECO-02).");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (f.cause && f.cause !== "3") {
        L.push("La cause invoquée dans votre dossier n'est pas la sauvegarde de la");
        L.push("compétitivité (cause déclarée : " + cro(f.cause, "non renseignée") + ").");
        L.push("Ce document ne vous concerne que si vous changez de fondement — et changer");
        L.push("de fondement en cours de procédure n'est pas neutre : la lettre de");
        L.push("licenciement comporte l'énoncé des motifs économiques invoqués (L. 1233-16)");
        L.push("et fixe les limites du litige (L. 1235-2).");
        L.push("");
      }
      if (f.menace && String(f.menace).trim()) {
        L.push("Menace décrite dans votre dossier :");
        L.push("« " + String(f.menace) + " »");
        L.push("");
        L.push("Cette description est le point de départ, non la note. Confrontez-la à la");
        L.push("grille ci-dessous : d'où vient la menace, à quelle date, quelles données");
        L.push("extérieures l'établissent, que se passe-t-il si l'on ne fait rien.");
      } else {
        L.push("Aucune menace n'est décrite dans votre dossier. Sans elle, la");
        L.push("réorganisation ne se distingue pas d'un choix de gestion : c'est le premier");
        L.push("écrit à produire.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LETTRE DE MISSION AU PROFESSIONNEL");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("À [CABINET / EXPERT — économiste, cabinet de conseil en stratégie,");
      L.push("expert-comptable, selon la nature de la menace]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : mission d'analyse de la menace pesant sur la compétitivité");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push(nom + " envisage une réorganisation" +
        (p.secteur ? " de son activité de " + p.secteur : "") + ".");
      L.push("");
      L.push("L'article L. 1233-3, 3° du code du travail ne permet de fonder un");
      L.push("licenciement économique sur une réorganisation que si celle-ci est");
      L.push("nécessaire à la sauvegarde de la compétitivité, appréciée — l'entreprise");
      L.push("appartenant à un groupe — au niveau du secteur d'activité commun aux");
      L.push("entreprises du groupe établies sur le territoire national.");
      L.push("");
      L.push("Je vous confie en conséquence une mission d'analyse portant sur :");
      L.push("");
      L.push("  1. la MENACE : son origine, sa date d'apparition, le marché sur lequel");
      L.push("     elle pèse, et les données extérieures à l'entreprise qui l'établissent ;");
      L.push("  2. son CHIFFRAGE : parts de marché, évolution des prix, marges du secteur,");
      L.push("     carnet de commandes, sur une période que vous déterminerez ;");
      L.push("  3. le SCÉNARIO DE RÉFÉRENCE : la situation de l'entreprise et du secteur à");
      L.push("     horizon [DURÉE] si la réorganisation n'a pas lieu ;");
      L.push("  4. la COMPARAISON de ce scénario avec la réorganisation envisagée, et");
      L.push("     l'examen des autres voies possibles.");
      L.push("");
      L.push("Votre analyse doit pouvoir être remise au comité social et économique et,");
      L.push("le cas échéant, produite en justice. Les sources y sont datées et citées.");
      L.push("");
      L.push("[Délai de remise souhaité : le … — préciser.]");
      L.push("");
      L.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
      L.push("distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — TRAME DE LA NOTE D'ANALYSE");
      L.push(GROS);
      L.push("");
      L.push("1. LA MENACE");
      L.push("   1.1 Origine : [d'où elle vient — nouvel entrant, évolution technologique,");
      L.push("       réglementation, perte d'un donneur d'ordre, mutation de la demande]");
      L.push("   1.2 Date : [quand elle s'est manifestée, et à quoi on l'a vue]");
      L.push("   1.3 Marché concerné : [le même marché que celui qui caractérise le");
      L.push("       secteur d'activité, au sens de L. 1233-3]");
      L.push("   1.4 Sources : [études, statistiques de branche, données de marché —");
      L.push("       datées et citées. Une menace établie par les seules notes internes");
      L.push("       de l'entreprise reste une affirmation de l'entreprise.]");
      L.push("");
      L.push("2. LE CHIFFRAGE");
      L.push("");
      L.push(col("Indicateur", 30) + col("N-2", 12) + col("N-1", 12) + col("N", 12) + "Source");
      L.push(TRAIT);
      L.push(col("Part de marché", 30) + col("[%]", 12) + col("[%]", 12) + col("[%]", 12) + "[source]");
      L.push(col("Prix moyen de vente", 30) + col("[€]", 12) + col("[€]", 12) + col("[€]", 12) + "[source]");
      L.push(col("Marge du secteur", 30) + col("[%]", 12) + col("[%]", 12) + col("[%]", 12) + "[source]");
      L.push(col("Carnet de commandes", 30) + col("[€]", 12) + col("[€]", 12) + col("[€]", 12) + "[interne]");
      L.push(col("[autre indicateur]", 30) + col("[…]", 12) + col("[…]", 12) + col("[…]", 12) + "[source]");
      L.push(TRAIT);
      L.push("");
      L.push("3. LE SCÉNARIO DE RÉFÉRENCE — SANS RÉORGANISATION");
      L.push("   [Que devient l'entreprise si rien n'est fait : à quelle échéance, sur");
      L.push("    quelles hypothèses, avec quel effet sur l'emploi. C'est la partie que");
      L.push("    l'on oublie, et c'est celle qui montre la NÉCESSITÉ : sans elle, la");
      L.push("    réorganisation reste une option parmi d'autres.]");
      L.push("");
      L.push("4. LA RÉORGANISATION ENVISAGÉE, CONFRONTÉE À CE SCÉNARIO");
      L.push("   [Ce qu'elle change, ce qu'elle préserve, à quel horizon. Et les autres");
      L.push("    voies examinées, avec la raison de leur écartement.]");
      L.push("");
      L.push("5. CONCLUSION");
      L.push("   [Écrite par le professionnel, signée et datée par lui.]");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — CE QUI DOIT PRÉCÉDER LA DÉCISION");
      L.push(GROS);
      L.push("");
      L.push("La note s'établit AVANT la décision de réorganiser, non pour la justifier");
      L.push("après. Une analyse datée du lendemain de la convocation du comité se lit");
      L.push("comme une pièce fabriquée pour le dossier.");
      L.push("");
      L.push("  ☐ mission confiée le ................. [DATE]");
      L.push("  ☐ note remise le ..................... [DATE]");
      L.push("  ☐ décision de réorganisation prise le  [DATE] — postérieure à la note");
      L.push("  ☐ information du comité le ........... [DATE]" +
        (estISO(f.dateInfoCSE) ? " — votre dossier porte le " + jour(f.dateInfoCSE) : ""));
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la nécessité de la réorganisation au sens du\n" +
        "3° de L. 1233-3 : une menace affirmée ne distingue pas la sauvegarde de la\n" +
        "compétitivité d'une recherche de rentabilité."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — envoi de la lettre de mission ;");
      L.push("  · " + dansJours(ctx, 28) + " — remise de la note, si vous accordez quatre");
      L.push("    semaines ; l'analyse suppose des données de marché, et huit semaines ne");
      L.push("    sont pas rares ;");
      L.push("  · " + dansJours(ctx, 30) + " — décision de réorganisation, au vu de la");
      L.push("    note et non l'inverse ;");
      L.push("  · ensuite — l'information du comité, puis la procédure.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1233-16, L. 1235-1, L. 1235-2, L. 1235-3",
        ["Le contrôle CTL-ECO-03 du module rattache l'exigence d'une menace",
         "extérieure, datée et chiffrée à un arrêt figurant au corpus (Cass. soc.",
         "1er décembre 1999, n° 98-42.746). Ce contrôle ne conclut jamais à la",
         "conformité : l'application signale, elle ne tranche pas."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-04 — LA MUTATION TECHNOLOGIQUE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-04", {
    nom: "Le dossier de mutation technologique : la fiche, les pièces, les effets sur les postes",
    detail: "La fiche descriptive datée de l'outil abandonné et de l'outil nouveau, " +
            "le bordereau des quatre pièces, le tableau des effets poste par poste.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var sup = liste(f, "postesSupprimes");
      var L = entete(ctx, "Dossier de mutation technologique",
        "article L. 1233-3, 2°, du code du travail");

      L.push("LE TEXTE, ET CE QU'IL LAISSE À PROUVER");
      L.push("");
      L.push("Le licenciement peut être consécutif « 2° A des mutations technologiques »");
      L.push("(L. 1233-3). Le texte n'en dit pas plus : il ne définit pas la mutation, il");
      L.push("ne fixe ni seuil ni montant. Tout se joue donc sur la PREUVE — et une");
      L.push("mutation non datée, non documentée, ne se distingue pas d'un changement");
      L.push("d'organisation ordinaire, qui n'est pas une cause économique.");
      L.push("");
      L.push("Trois questions, et le dossier doit répondre aux trois : QU'EST-CE QUI A");
      L.push("CHANGÉ (l'outil abandonné, l'outil nouveau) ; QUAND (la date de mise en");
      L.push("service, établie par une pièce) ; QUEL EFFET SUR LES EMPLOIS (poste par");
      L.push("poste, tâche par tâche).");
      L.push("");
      L.push("ET UN QUATRIÈME POINT, QUI EST LE VRAI TERRAIN DU LITIGE : lorsque la cause");
      L.push("invoquée est une mutation technologique, la question posée par L. 1233-4 —");
      L.push("tous les efforts de FORMATION ET D'ADAPTATION ont-ils été réalisés ? —");
      L.push("devient centrale. L'outil change ; qu'a-t-on fait pour que le salarié");
      L.push("puisse le tenir ? Le document du point CTL-REC-05 traite ce point, et les");
      L.push("deux dossiers se lisent ensemble.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (f.cause && f.cause !== "2") {
        L.push("La cause déclarée dans votre dossier n'est pas la mutation technologique");
        L.push("(cause : " + cro(f.cause, "non renseignée") + "). Ce document ne vous");
        L.push("concerne que si la mutation est invoquée — seule ou avec une autre cause,");
        L.push("étant rappelé que la lettre de licenciement comporte l'énoncé des motifs");
        L.push("économiques invoqués (L. 1233-16).");
        L.push("");
      }
      if (f.mutation && String(f.mutation).trim()) {
        L.push("Mutation décrite dans votre dossier :");
        L.push("« " + String(f.mutation) + " »");
        L.push("");
        L.push("Reprenez cette description dans la fiche ci-dessous et adossez-la aux");
        L.push("quatre pièces : une description sans pièce reste une déclaration.");
      } else {
        L.push("Aucune mutation n'est décrite dans votre dossier : la fiche ci-dessous est");
        L.push("à établir entièrement.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — FICHE DESCRIPTIVE DE LA MUTATION");
      L.push(GROS);
      L.push("");
      L.push(nom.toUpperCase());
      L.push("FICHE DE MUTATION TECHNOLOGIQUE — établie le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("1. L'OUTIL ABANDONNÉ");
      L.push("   · désignation : [machine, logiciel, procédé — désignation précise]");
      L.push("   · mis en service le : [DATE]");
      L.push("   · arrêté le : [DATE] — pièce : [procès-verbal d'arrêt, contrat de");
      L.push("     cession, bon d'enlèvement, désinstallation]");
      L.push("   · ce qu'il permettait de faire : [tâches]");
      L.push("");
      L.push("2. L'OUTIL NOUVEAU");
      L.push("   · désignation : [désignation précise]");
      L.push("   · commandé le : [DATE] — bon de commande n° [RÉFÉRENCE]");
      L.push("   · facturé le : [DATE] — facture n° [RÉFÉRENCE] — montant : [MONTANT]");
      L.push("   · mis en service le : [DATE] — procès-verbal de mise en service du [DATE]");
      L.push("   · ce qu'il permet de faire, et ce qu'il fait autrement : [description]");
      L.push("");
      L.push("3. CE QUE LA MUTATION CHANGE DANS LE TRAVAIL");
      L.push("   [Non pas « l'outil est plus performant » — cela ne dit rien d'un emploi —");
      L.push("    mais : quelles opérations disparaissent, lesquelles sont automatisées,");
      L.push("    quelles compétences nouvelles sont exigées, à quel niveau.]");
      L.push("");
      L.push("Signature : " + cro(p.responsable, "nom et qualité"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — BORDEREAU DES PIÈCES");
      L.push(GROS);
      L.push("");
      L.push(col("Pièce", 44) + col("Date", 14) + "Référence");
      L.push(TRAIT);
      L.push(col("Bon de commande de l'outil nouveau", 44) + col("[date]", 14) + "[n°]");
      L.push(col("Facture", 44) + col("[date]", 14) + "[n°]");
      L.push(col("Procès-verbal de mise en service", 44) + col("[date]", 14) + "[n°]");
      L.push(col("Preuve de l'arrêt de l'ancien outil", 44) + col("[date]", 14) + "[n°]");
      L.push(col("[Contrat de maintenance, formation des", 44) + col("[date]", 14) + "[n°]");
      L.push(col("  utilisateurs, cahier des charges]", 44) + col("", 14) + "");
      L.push(TRAIT);
      L.push("");
      L.push("La date de MISE EN SERVICE est celle qui compte : une commande passée ne");
      L.push("supprime aucun emploi, et une facture ne prouve pas qu'un outil fonctionne.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — EFFETS SUR LES POSTES");
      L.push(GROS);
      L.push("");
      L.push(col("Poste", 24) + col("Tâches disparues", 24) + "Compétences nouvelles exigées");
      L.push(TRAIT);
      if (sup.length) {
        sup.forEach(function (x) {
          L.push(col(cro(x.intitule, "poste"), 24) + col("[tâches]", 24) + "[compétences]");
        });
      } else {
        L.push(col("[poste]", 24) + col("[tâches]", 24) + "[compétences]");
        L.push(col("[poste]", 24) + col("[tâches]", 24) + "[compétences]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Cette colonne de droite est celle qui sera retournée contre le dossier : les");
      L.push("compétences nouvelles exigées appellent la question de l'adaptation. Pour");
      L.push("chaque ligne, dites si une action de formation a été proposée, et laquelle");
      L.push("(point CTL-REC-05). Écrire « compétences trop éloignées » sans avoir rien");
      L.push("proposé ni rien écrit ne se défend pas.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — CHRONOLOGIE DE LA MUTATION");
      L.push(GROS);
      L.push("");
      L.push("  · décision d'investissement ........... [DATE]");
      L.push("  · commande ............................ [DATE]");
      L.push("  · livraison ........................... [DATE]");
      L.push("  · mise en service ..................... [DATE]");
      L.push("  · arrêt de l'ancien outil ............. [DATE]");
      L.push("  · actions de formation proposées ...... [DATES]");
      L.push("  · information du comité ............... " +
        (estISO(f.dateInfoCSE) ? jour(f.dateInfoCSE) : "[DATE]"));
      L.push("  · notification envisagée .............. " +
        (estISO(f.dateNotification) ? jour(f.dateNotification) : "[DATE]"));
      L.push("");
      L.push("Une chronologie où la mise en service suit la notification pose la question");
      L.push("de savoir ce qui, au jour de la lettre, avait effectivement changé.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la caractérisation de la mutation\n" +
        "technologique du 2° de L. 1233-3 : non datée et non documentée, elle ne se\n" +
        "distingue pas d'un changement d'organisation."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — établissement de la fiche et réunion des quatre pièces ;");
      L.push("  · " + dansJours(ctx, 5) + " — tableau des effets, poste par poste ;");
      L.push("  · " + dansJours(ctx, 7) + " — rapprochement avec le tableau des actions de");
      L.push("    formation et d'adaptation (point CTL-REC-05) ;");
      L.push("  · ensuite — le dossier au comité, puis la procédure.");
      L.push("");
      L.push("Les pièces existent déjà : ce dossier ne demande pas de créer quoi que ce");
      L.push("soit, il demande de rassembler et de dater.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-4, L. 1233-2, L. 1233-16, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-05 — LA CESSATION COMPLÈTE ET DÉFINITIVE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-05", {
    nom: "Le dossier de cessation d'activité : décision, calendrier d'arrêt, activités du groupe",
    detail: "Le procès-verbal de la décision à faire adopter, le calendrier d'arrêt " +
            "site par site, l'état des sociétés du groupe rempli d'après votre dossier.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var soc = liste(f, "societes");
      var act = f.activite ? String(f.activite).toLowerCase() : null;
      var memes = soc.filter(function (s) {
        return s.activite && act && String(s.activite).toLowerCase() === act;
      });
      var L = entete(ctx, "Dossier de cessation d'activité",
        "article L. 1233-3, 4°, du code du travail");

      L.push("LE TEXTE, ET LES DEUX MOTS QUI NE SONT PAS DANS LE TEXTE");
      L.push("");
      L.push("Le licenciement peut être consécutif « 4° A la cessation d'activité de");
      L.push("l'entreprise » (L. 1233-3).");
      L.push("");
      L.push("L'article lu à la source dit cela, et rien de plus : il n'écrit ni");
      L.push("« complète » ni « définitive ». Ces deux caractères, que le contrôle");
      L.push("CTL-ECO-05 de ce module applique, ne sont donc pas cités ici comme des mots");
      L.push("du texte. Ils commandent pourtant le dossier, et la raison en est simple :");
      L.push("une activité qui s'arrête en partie, ou qui s'arrête pour un temps, n'est");
      L.push("pas une activité qui cesse — et ce qui n'a pas cessé continue de fournir des");
      L.push("emplois, donc des postes de reclassement.");
      L.push("");
      L.push("Une précision du même article, celle-là écrite : la matérialité s'apprécie");
      L.push("au niveau de l'entreprise. La cessation est celle de VOTRE entreprise, non");
      L.push("celle du groupe. Mais la poursuite de la même activité par une société du");
      L.push("groupe nourrit deux débats à la fois — la réalité de la cessation, et");
      L.push("l'obligation de reclassement de L. 1233-4, qui s'étend aux autres");
      L.push("entreprises du groupe assurant la permutation du personnel.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE");
      L.push("");
      if (f.cause && f.cause !== "4") {
        L.push("La cause déclarée n'est pas la cessation d'activité (cause : " +
          cro(f.cause, "non renseignée") + ").");
        L.push("");
      }
      if (f.cessationComplete === true) {
        L.push("Votre dossier déclare la cessation complète et définitive.");
      } else if (f.cessationComplete === false) {
        L.push("Votre dossier déclare la cessation INCOMPLÈTE OU NON DÉFINITIVE. Le 4° de");
        L.push("L. 1233-3 vise la cessation d'activité de l'entreprise : une cessation");
        L.push("partielle relève, le cas échéant, d'un autre cas du même article — et c'est");
        L.push("alors ce cas qu'il faut démontrer, avec ses pièces propres.");
      } else {
        L.push("Le caractère de la cessation n'est pas renseigné. C'est la première chose");
        L.push("à trancher : tout le dossier en découle.");
      }
      L.push("");
      if (soc.length) {
        L.push("Sociétés du groupe et activités, d'après votre dossier :");
        L.push("");
        L.push(col("Société", 30) + col("Activité", 26) + col("Pays", 12) + "Même activité ?");
        L.push(TRAIT);
        soc.forEach(function (s) {
          var m = s.activite && act && String(s.activite).toLowerCase() === act;
          L.push(col(s.nom, 30) + col(s.activite, 26) +
            col(s.pays || (s.etranger ? "étranger" : "France"), 12) +
            (m ? "OUI — à expliquer" : "[à vérifier]"));
        });
        L.push(TRAIT);
        if (memes.length) {
          L.push("");
          L.push(memes.length + " société(s) du groupe exercent la même activité que");
          L.push("l'entreprise auditée. Ce n'est pas rédhibitoire, mais cela s'explique :");
          L.push("la pièce 4 est faite pour cela, et l'explication doit être écrite AVANT");
          L.push("que la question ne soit posée en face.");
        }
      } else {
        L.push("Aucune société du groupe n'est renseignée : la contradiction ne peut pas");
        L.push("être recherchée, et c'est précisément ce qu'un contradicteur relèvera.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — PROCÈS-VERBAL DE LA DÉCISION DE L'ORGANE COMPÉTENT");
      L.push(GROS);
      L.push("");
      L.push("Trame à adapter à la forme sociale et aux statuts de l'entreprise :");
      L.push("l'application ne connaît ni vos statuts ni votre organe compétent, et le");
      L.push("droit des sociétés n'est pas le code du travail — elle n'en dit donc rien.");
      L.push("");
      L.push(nom.toUpperCase());
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("PROCÈS-VERBAL DE [ASSEMBLÉE / CONSEIL / DÉCISION DE L'ASSOCIÉ UNIQUE]");
      L.push("DU [DATE]");
      L.push("");
      L.push("Présents : [selon les statuts]");
      L.push("");
      L.push("Ordre du jour : cessation de l'activité de la société");
      L.push("");
      L.push("[EXPOSÉ — écrire ici, en propre, la situation qui conduit à la décision.");
      L.push(" L'application n'écrit pas cet exposé : il porte sur des faits qu'elle ne");
      L.push(" connaît pas, et un exposé inventé serait la pièce la plus dangereuse du");
      L.push(" dossier.]");
      L.push("");
      L.push("RÉSOLUTION [n°] — [L'organe] décide la cessation de l'activité de la société");
      L.push("[à compter du DATE / selon le calendrier annexé], portant sur [L'ÉTENDUE :");
      L.push("toutes les activités, tous les sites — préciser].");
      L.push("");
      L.push("[Le cas échéant : résolutions relatives à la dévolution des actifs, à la");
      L.push(" résiliation des baux, au sort des contrats en cours.]");
      L.push("");
      L.push("Signatures : [selon les statuts]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — CALENDRIER D'ARRÊT, SITE PAR SITE");
      L.push(GROS);
      L.push("");
      L.push(col("Site / établissement", 26) + col("Effectif", 10) + col("Arrêt prévu", 14) + "Devenir des actifs");
      L.push(TRAIT);
      var nbEt = p.etablissementsDistincts || f.etablissementsDistincts;
      L.push(col("[site]", 26) + col("[nb]", 10) + col("[date]", 14) + "[cession / reprise / mise au rebut]");
      L.push(col("[site]", 26) + col("[nb]", 10) + col("[date]", 14) + "[cession / reprise / mise au rebut]");
      L.push(TRAIT);
      if (nbEt) {
        L.push("Votre dossier déclare " + nbEt + " établissement(s) distinct(s) : le");
        L.push("tableau doit en porter autant de lignes.");
      }
      L.push("");
      L.push("Un site dont l'arrêt n'est pas daté est un site dont on ne sait pas s'il");
      L.push("s'arrête. Et une activité poursuivie sur un site après la notification");
      L.push("contredit la cessation invoquée pour licencier.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — BORDEREAU DES PIÈCES DE LA CESSATION");
      L.push(GROS);
      L.push("");
      L.push("  ☐ décision de l'organe compétent, datée");
      L.push("  ☐ calendrier d'arrêt, site par site");
      L.push("  ☐ [résiliations de baux, cessions d'actifs, résiliations de contrats]");
      L.push("  ☐ [radiation ou modification au registre du commerce, si elle est");
      L.push("     intervenue]");
      L.push("  ☐ état des sociétés du groupe et de leurs activités (pièce 4)");
      L.push("  ☐ [le cas échéant : pièces de la procédure collective — jugement");
      L.push("     d'ouverture, ordonnance du juge-commissaire" +
        (f.procedureCollective === true ? " ; votre dossier déclare une procédure de " +
          cro(f.typeProcedure, "nature non renseignée") : "") + "]");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — ÉTAT DES SOCIÉTÉS DU GROUPE ET DE LEURS ACTIVITÉS");
      L.push(GROS);
      L.push("");
      L.push("Établi le " + leJour(aujourd(ctx)) + " — pour que la contradiction puisse");
      L.push("être recherchée par vous avant de l'être par d'autres.");
      L.push("");
      L.push(col("Société", 28) + col("Activité", 24) + col("Pays", 12) + "Clientèle et marché");
      L.push(TRAIT);
      if (soc.length) {
        soc.forEach(function (s) {
          L.push(col(s.nom, 28) + col(s.activite, 24) +
            col(s.pays || (s.etranger ? "étranger" : "France"), 12) + "[à préciser]");
        });
      } else {
        L.push(col("[société]", 28) + col("[activité]", 24) + col("[pays]", 12) + "[à préciser]");
      }
      L.push(TRAIT);
      L.push("");
      L.push("Pour chaque société exerçant une activité proche, écrivez ce qui la");
      L.push("distingue de la vôtre — clientèle, marché, moyens, implantation — ou");
      L.push("renoncez à invoquer la cessation et cherchez un autre fondement. La");
      L.push("distinction s'écrit dans les termes que L. 1233-3 emploie pour caractériser");
      L.push("un secteur d'activité : nature des produits, biens ou services délivrés,");
      L.push("clientèle ciblée, réseaux et modes de distribution, marché.");
      L.push("");
      L.push("Et n'oubliez pas l'autre conséquence : ces sociétés, si elles assurent la");
      L.push("permutation de tout ou partie du personnel, appartiennent au périmètre de");
      L.push("reclassement de L. 1233-4. Une société du groupe qui poursuit votre activité");
      L.push("est une société qui a peut-être des postes (points CTL-REC-01 et CTL-REC-02).");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la réalité de la cessation d'activité du 4° de\n" +
        "L. 1233-3, et, par ricochet, l'étendue de la recherche de reclassement."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — état des sociétés du groupe et de leurs activités ;");
      L.push("  · " + dansJours(ctx, 7) + " — calendrier d'arrêt, site par site ;");
      L.push("  · " + dansJours(ctx, 10) + " — décision de l'organe compétent, dans les");
      L.push("    formes prévues par vos statuts ;");
      L.push("  · ensuite — l'information du comité, la recherche de reclassement dans le");
      L.push("    groupe, puis la notification.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Les caractères « complet » et « définitif » de la cessation ne figurent pas",
         "dans le texte de L. 1233-3 lu à la source : ils viennent de l'application",
         "qu'en font les juridictions, et le document ne les présente pas comme des",
         "mots de l'article.",
         "",
         "Le droit des sociétés, qui désigne l'organe compétent pour décider la",
         "cessation, n'appartient pas au corpus de ce module : l'application renvoie",
         "à vos statuts sans rien en dire."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-06 — L'IMPUTABILITÉ DE LA CESSATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-06", {
    nom: "L'examen de l'imputabilité de la cessation : lettre de mission et pièces de gestion",
    detail: "La lettre de mission au conseil, le bordereau des pièces de gestion à " +
            "lui remettre, la trame de sa note et le calendrier de la décision.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var flux = liste(f, "fluxIntragroupe");
      var rg = liste(f, "resultatGroupe");
      var L = entete(ctx, "Imputabilité de la cessation d'activité — examen extérieur",
        "article L. 1233-3, 4°, du code du travail");

      L.push(GROS);
      L.push("CE QUE L'APPLICATION NE TRANCHE PAS, ET POURQUOI");
      L.push(GROS);
      L.push("");
      L.push("Le contrôle CTL-ECO-06 de ce module ne conclut JAMAIS à la conformité.");
      L.push("");
      L.push("La raison tient à la nature de la question. L. 1233-3, 4° vise « la cessation");
      L.push("d'activité de l'entreprise » — et le texte lu à la source s'arrête là. La");
      L.push("réserve qui s'y attache — la cessation ne vaut pas cause économique");
      L.push("lorsqu'elle procède d'une faute de l'employeur ou de sa légèreté blâmable —");
      L.push("N'EST PORTÉE PAR AUCUN TEXTE DU CORPUS DE CE MODULE. Elle est d'origine");
      L.push("prétorienne. L'application l'écrit comme telle, elle ne l'attribue pas à");
      L.push("l'article, et elle ne peut ni l'appliquer ni l'écarter : apprécier une");
      L.push("gestion suppose de lire des comptes, des décisions et des intentions.");
      L.push("");
      L.push("Ce document ne rédige donc aucune conclusion. Il commande l'examen, il");
      L.push("rassemble les pièces, et il dit quand décider — c'est-à-dire après.");
      L.push("");

      L.push("POURQUOI CE POINT MÉRITE UN EXAMEN SÉPARÉ");
      L.push("");
      L.push("Dans un dossier de cessation, tout le reste peut être irréprochable : la");
      L.push("décision datée, le calendrier d'arrêt tenu, le reclassement recherché dans");
      L.push("le groupe. C'est ici que le dossier se gagne ou se perd, et c'est ici que");
      L.push("l'employeur regarde le moins volontiers, parce que la question porte sur sa");
      L.push("propre gestion.");
      L.push("");
      L.push("Un examen conduit tôt a une vertu que rien ne remplace : il montre ce qui");
      L.push("sera contesté, pendant qu'il est encore temps d'y répondre autrement — par");
      L.push("un autre fondement, un autre calendrier, ou des mesures d'accompagnement.");
      L.push("");

      L.push("CE QUE VOTRE DOSSIER PORTE DÉJÀ SUR LA GESTION");
      L.push("");
      if (flux.length || rg.length) {
        if (flux.length) {
          L.push("Flux intragroupe déclarés (redevances de marque, management fees, prix de");
          L.push("transfert) :");
          L.push(col("Exercice", 12) + col("Redev. marque", 16) + col("Management fees", 18) + "Total");
          L.push(TRAIT);
          flux.forEach(function (x) {
            L.push(col(cro(x.annee, "année"), 12) +
              col(x.redevanceMarque != null ? x.redevanceMarque : "[montant]", 16) +
              col(x.managementFees != null ? x.managementFees : "[montant]", 18) +
              (x.total != null ? x.total : "[total]"));
          });
          L.push(TRAIT);
        }
        if (rg.length) {
          L.push("");
          L.push("Résultat du groupe et distributions déclarés :");
          L.push(col("Exercice", 12) + col("Résultat consolidé", 22) + "Dividendes");
          L.push(TRAIT);
          rg.forEach(function (x) {
            L.push(col(cro(x.annee, "année"), 12) +
              col(x.resultatConsolide != null ? x.resultatConsolide : "[montant]", 22) +
              (x.dividendes != null ? x.dividendes : "[montant]"));
          });
          L.push(TRAIT);
        }
        L.push("");
        L.push("Ces chiffres sont ceux de votre fiche. L'application les affiche sans les");
        L.push("qualifier : elle ne dit ni qu'ils sont normaux ni qu'ils ne le sont pas.");
        L.push("Remettez-les au professionnel, c'est à lui de les lire.");
      } else {
        L.push("Votre dossier ne porte ni flux intragroupe ni résultat consolidé. Ce sont");
        L.push("les premières pièces que le professionnel demandera : réunissez-les avant");
        L.push("de le saisir.");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LETTRE DE MISSION");
      L.push(GROS);
      L.push("");
      L.push(nom);
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("À [AVOCAT EN DROIT SOCIAL / JURISTE — le cas échéant avec le concours d'un");
      L.push("expert-comptable]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
      L.push("");
      L.push("Objet : cessation d'activité — examen de l'imputabilité");
      L.push("");
      L.push("Maître, [ou : Madame, Monsieur,]");
      L.push("");
      L.push(nom + " envisage de cesser son activité et de fonder sur cette");
      L.push("cessation les licenciements pour motif économique qui en résulteront");
      L.push("(L. 1233-3, 4° du code du travail).");
      L.push("");
      L.push("La cessation d'activité constitue en elle-même une cause économique. Il est");
      L.push("toutefois admis qu'elle ne la constitue pas lorsqu'elle procède d'une faute");
      L.push("de l'employeur ou de sa légèreté blâmable — réserve qui ne figure pas dans");
      L.push("le texte de l'article, et dont l'appréciation excède ce que nos outils");
      L.push("internes permettent.");
      L.push("");
      L.push("Je vous confie en conséquence une mission d'examen portant sur :");
      L.push("  1. les décisions de gestion des exercices ayant précédé la cessation ;");
      L.push("  2. les opérations avec les sociétés liées, notamment les flux");
      L.push("     intragroupe, et leur incidence sur les résultats de l'entreprise ;");
      L.push("  3. les décisions d'investissement, de désinvestissement et de");
      L.push("     distribution ;");
      L.push("  4. ce qui, dans cet ensemble, pourrait être qualifié de faute ou de");
      L.push("     légèreté blâmable, et ce qui l'écarte.");
      L.push("");
      L.push("Votre note sera datée et signée, et vous préciserez les pièces sur");
      L.push("lesquelles elle repose. Aucune décision ne sera prise avant sa remise.");
      L.push("");
      L.push("Je vous prie d'agréer, Maître, l'expression de ma considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — BORDEREAU DES PIÈCES DE GESTION REMISES");
      L.push(GROS);
      L.push("");
      L.push(col("Pièce", 44) + col("Exercices", 16) + "Remise le");
      L.push(TRAIT);
      L.push(col("Comptes annuels et annexes", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("Liasses fiscales", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("Rapports du commissaire aux comptes", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("Procès-verbaux des organes sociaux", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("Conventions avec les sociétés liées", 44) + col("[en vigueur]", 16) + "[date]");
      L.push(col("  (marque, management fees, prêts)", 44) + col("", 16) + "");
      L.push(col("Décisions d'investissement et de cession", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("Distributions de dividendes", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("Comptes consolidés du groupe", 44) + col("[N-3 à N]", 16) + "[date]");
      L.push(col("[Autres — à compléter]", 44) + col("", 16) + "[date]");
      L.push(TRAIT);
      L.push("");
      L.push("Remettez tout, y compris ce qui vous paraît défavorable. Un conseil qui");
      L.push("découvre une pièce en cours de contentieux ne peut plus rien en faire ;");
      L.push("informé à temps, il peut construire autour.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — TRAME DE LA NOTE ATTENDUE");
      L.push(GROS);
      L.push("");
      L.push("1. Les faits de gestion examinés, exercice par exercice.");
      L.push("2. Les flux avec les sociétés liées : nature, montant, contrepartie,");
      L.push("   incidence sur le résultat de l'entreprise.");
      L.push("3. Les décisions structurantes : investissements, cessions, arrêts");
      L.push("   d'activité partiels, distributions.");
      L.push("4. Ce qui, dans cet ensemble, pourrait être discuté, et sur quel terrain.");
      L.push("5. Ce qui l'écarte : les raisons économiques des décisions, leur");
      L.push("   contemporanéité, les avis reçus à l'époque.");
      L.push("6. Conclusion, datée et signée.");
      L.push("");
      L.push("Cette note appartient à l'employeur et à son conseil. L'application ne la");
      L.push("lit pas, ne la juge pas, et n'en tire aucun verdict.");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — ORDRE DES DÉCISIONS");
      L.push(GROS);
      L.push("");
      L.push("  1. mission confiée .................... [DATE]");
      L.push("  2. pièces remises ..................... [DATE]");
      L.push("  3. note reçue ......................... [DATE]");
      L.push("  4. DÉCISION PRISE AU VU DE LA NOTE .... [DATE] — et non l'inverse");
      L.push("  5. information du comité .............. " +
        (estISO(f.dateInfoCSE) ? jour(f.dateInfoCSE) : "[DATE]"));
      L.push("  6. notification ....................... " +
        (estISO(f.dateNotification) ? jour(f.dateNotification) : "[DATE]"));
      L.push("");
      L.push("Décider d'abord et faire écrire ensuite une note qui approuve : c'est ce");
      L.push("que ce document existe pour éviter.");
      L.push("");

      L = L.concat(blocEnjeu(
        "Ici, ce qui est en cause est la valeur même de la cause invoquée : la\n" +
        "cessation d'activité fonde le licenciement, sauf à ce qu'elle soit imputable\n" +
        "à l'employeur — question que l'application ne tranche pas."));

      L = L.concat(ouvrirCalendrier(ctx));
      L.push("  · aujourd'hui — lettre de mission et remise des pièces ;");
      L.push("  · " + dansJours(ctx, 14) + " — remise de la note, si vous accordez deux");
      L.push("    semaines ; quatre ne sont pas excessives ;");
      L.push("  · " + dansJours(ctx, 16) + " — décision prise au vu de la note ;");
      L.push("  · ensuite — l'information du comité, puis la procédure.");
      if (estISO(f.dateNotification)) {
        var e2 = ecartJours(isoDe(aujourd(ctx)), f.dateNotification);
        L.push("");
        L.push("Votre dossier fixe la notification au " + jour(f.dateNotification) +
          (e2 !== null ? ", dans " + e2 + " jour(s)" : "") + " :");
        L.push(e2 !== null && e2 < 16
          ? "ce délai ne laisse pas la place à un examen sérieux. Repoussez-la."
          : "l'examen peut y tenir, à condition d'être engagé aujourd'hui.");
      }
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3",
        ["La faute et la légèreté blâmable de l'employeur ne figurent dans aucun",
         "article du corpus de ce module. Le document les nomme comme une réserve",
         "d'origine prétorienne, appliquée par le contrôle CTL-ECO-06, et ne les",
         "attribue pas au texte de L. 1233-3."])).join("\n");
    },
  });

  /* ══ FIN ══ */
})(typeof window !== "undefined" ? window : this);
