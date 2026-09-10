/* Les documents que l'application PRODUIT - licenciement pour motif économique :
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
   RATTRAPE PAS » : il dit ce qui est acquis, et ce qui reste à faire - arrêter
   ce qui peut encore l'être, documenter ce qui avait réellement été fait avant
   la lettre, et ne rien antidater. Antidater une pièce n'est pas une
   régularisation ; c'est un risque d'une autre nature, et l'application ne le
   proposera jamais.

   TROIS RÈGLES, TENUES PARTOUT

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Les seuls articles cités ici sont ceux
      que porte moteur/economique/textes_eco.json, avec leur identifiant de
      version - L. 1233-2 (LEGIARTI000019071124), L. 1233-3
      (LEGIARTI000036762081), L. 1233-4 (LEGIARTI000036261863), D. 1233-2-1
      (LEGIARTI000036248612), L. 1233-16 (LEGIARTI000036762077), L. 1235-1
      (LEGIARTI000035643446), L. 1235-2 (LEGIARTI000036261950), L. 1235-3
      (LEGIARTI000036762052) - ou ceux que le contrôle porte en fondement.
      Les articles seulement RENVOYÉS par ces textes - L. 233-1, L. 233-3 et
      L. 233-16 du code de commerce pour la notion de groupe, L. 1237-11 et
      L. 1237-17 pour les ruptures exclues - sont NOMMÉS, jamais reproduits ni
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
       ne fixe de plancher - quinze jours francs, quatre en redressement ou
       liquidation judiciaire - que pour la LISTE diffusée du III. Aucun
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

     Les dates du dossier économique sont des chaînes « AAAA-MM-JJ » -
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
  /* Une date du dossier, écrite en toutes lettres - ou son crochet. */
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
  /* Le jour où l'on sera, n jours après aujourd'hui - pour les calendriers. */
  function dansJours(ctx, n) { return leJour(dans(aujourd(ctx), n)); }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE TEXTE ET DE TABLEAU
     ════════════════════════════════════════════════════════════════════════ */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  function nomDe(ctx) {
    var p = ctx.profil || {}, f = ctx.fiche || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }

  /* Une pièce du dossier, si elle y est - avec sa date et son auteur. */
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
     le déclare - jamais recalculé, jamais supposé. */
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

  /* Le pied commun : d'où vient ce qui est écrit, et ce que le document ne dit
     pas. Même forme que dans les autres modules - deux façons d'écrire un pied
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

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-01 - L'ÉTAT DATÉ DES POSTES DISPONIBLES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-01", {
    nom: "L'état daté des postes disponibles, société par société",
    detail: "L'état lui-même, sa page de signature, le bordereau des réponses " +
            "reçues et le calendrier qui le place avant les offres et avant la lettre.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var postes = liste(f, "postesDisponibles");
      var L = entete(ctx, "État daté des postes disponibles",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ÉTAT DES POSTES DISPONIBLES");
      L.push("");
      L.push("DUPONT DISTRIBUTION SARL");
      L.push("");
      L.push("ÉTAT DES EMPLOIS DISPONIBLES SUR LE TERRITOIRE NATIONAL");
      L.push("Arrêté au 10 septembre 2026");
      L.push("");
      L.push("Périmètre de permutation retenu (L. 1233-4) :");
      L.push("  · DUPONT DISTRIBUTION SARL, Ile-de-France, activité commerce de gros");
      L.push("");
      L.push("Société | Intitulé du poste | Lieu | Classification et rémunération");
      L.push("DUPONT DISTRIBUTION | Cariste | Nanterre | Ouvrier niveau 2, 2 000 euros");
      L.push("DUPONT DISTRIBUTION | Préparateur | Le Havre | Employé niveau 1, 1 700 euros");
      L.push("");
      L.push("À COMPLÉTER");
      L.push("");
      L.push("Remplissez l'état en listant tous les postes disponibles au jour que vous choisissez :");
      L.push("date à reporter dans l'en-tête et dans la signature ci-dessous.");
      L.push("");
      L.push("Périmètre : " + (societesFR(f).length > 0 ? "sociétés en France" : "[À DÉFINIR]") + ".");
      L.push("");
      L.push("Tableau des postes :");
      L.push("Société | Intitulé | Lieu | Qualification");
      L.push("[société] | [intitulé] | [lieu] | [salaire et classification]");
      L.push("Pour chaque ligne, joindre le descriptif du poste et la nature du contrat.");
      L.push("");
      L.push("Signature et certification :");
      L.push("Signataire : " + cro(p.responsable, "nom et qualité"));
      L.push("Date de certification : [DATE]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 subordonne le licenciement pour motif économique à l'impossibilité");
      L.push("de reclasser le salarié sur « les emplois disponibles, situés sur le territoire");
      L.push("national dans l'entreprise ou les autres entreprises du groupe ».");
      L.push("");
      L.push("L'état daté est la pièce qui prouve cette recherche. C'est une condition du");
      L.push("licenciement, pas une formalité. Elle s'apprécie au jour de la notification.");
      L.push("Un état redaté, une offre complétée après la lettre ne régularisent rien : ils");
      L.push("ajoutent une pièce postérieure à un acte antérieur, et la pièce elle-même");
      L.push("prouve alors que la recherche n'était pas faite à la date requise.");
      L.push("");
      L.push("Le groupe se lit dans L. 233-1, L. 233-3 et L. 233-16 du code de commerce :");
      L.push("l'application n'a pas lu ces articles. Faites vérifier par votre conseil");
      L.push("quelles sociétés y répondent.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le périmètre du groupe n'a pas été lu à la source : l'application nomme",
         "les articles, elle n'en reproduit pas le contenu."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-02 - L'INTERROGATION DES SOCIÉTÉS DU PÉRIMÈTRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-02", {
    nom: "Les lettres d'interrogation des sociétés du périmètre, et le suivi des réponses",
    detail: "La lettre à adresser à chaque société, le formulaire de réponse qui " +
            "l'accompagne - réponse négative comprise - et le tableau de suivi.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var fr = societesFR(f);
      var L = entete(ctx, "Interrogation des sociétés du périmètre de permutation",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - LETTRE D'INTERROGATION");
      L.push("");
      L.push("DUPONT DISTRIBUTION SARL");
      L.push("12 rue des Lilas, 95100 Argenteuil");
      L.push("");
      L.push("À l'attention de DUPONT TRANSPORTS SARL");
      L.push("[adresse]");
      L.push("");
      L.push("Argenteuil, le 10 septembre 2026");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : recherche de reclassement - demande d'état des emplois disponibles");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("DUPONT DISTRIBUTION SARL a engagé une procédure de licenciement pour motif");
      L.push("économique portant sur 2 salariés.");
      L.push("");
      L.push("L'article L. 1233-4 du code du travail subordonne ce licenciement à");
      L.push("l'impossibilité de reclasser les salariés concernés sur les emplois disponibles");
      L.push("situés sur le territoire national, dans l'entreprise comme dans les autres");
      L.push("entreprises du groupe dont l'organisation, les activités ou le lieu");
      L.push("d'exploitation assurent la permutation de tout ou partie du personnel.");
      L.push("");
      L.push("Je vous demande de me communiquer, à la date du 8 septembre 2026, la liste");
      L.push("des emplois disponibles au sein de votre société, avec les six mentions");
      L.push("imposées par D. 1233-2-1 : intitulé, descriptif, employeur, contrat, lieu,");
      L.push("rémunération et classification.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Adaptez cette lettre au nombre de sociétés et de salariés de votre dossier.");
      L.push("Envoyez à toutes les sociétés du périmètre, y compris les réponses négatives.");
      L.push("");
      L.push("Destinataire : [SOCIÉTÉ]");
      L.push("Adresse : [ADRESSE]");
      L.push("Date demandée : [DATE]");
      L.push("Délai de réponse : [NOMBRE DE JOURS]");
      L.push("");
      L.push("Tableau de suivi des envois :");
      L.push("Société | Envoi le | Preuve | Réponse reçue le");
      L.push("[société] | [date] | [AR n°...] | [date] ou NÉANT");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 impose la recherche sur l'ensemble du périmètre du groupe. Une");
      L.push("société interrogée qui n'a pas répondu laisse un trou : c'est comme si elle");
      L.push("n'avait pas été interrogée. La réponse écrite, y compris « aucun poste");
      L.push("disponible », atteste que la recherche l'a couverte.");
      L.push("");
      L.push("Conservez les preuves d'envoi (accusé de réception) et toutes les réponses :");
      L.push("c'est l'ensemble qui fait la preuve de la recherche. L'absence de réponse");
      L.push("doit être constatée par écrit, dès que le délai est passé.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-03 - L'OFFRE DE RECLASSEMENT ET SES SIX MENTIONS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-03", {
    nom: "L'offre de reclassement écrite - les six mentions de D. 1233-2-1",
    detail: "L'offre rédigée mention par mention, la grille de contrôle des offres " +
            "déjà adressées et le rappel du moyen conférant date certaine.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var L = entete(ctx, "Offre de reclassement écrite",
        "articles L. 1233-4 et D. 1233-2-1 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - OFFRE DE RECLASSEMENT");
      L.push("");
      L.push("DUPONT DISTRIBUTION SARL");
      L.push("12 rue des Lilas, 95100 Argenteuil");
      L.push("");
      L.push("Monsieur DUPONT Jean");
      L.push("Conducteur poids lourd");
      L.push("[adresse]");
      L.push("");
      L.push("Argenteuil, le 12 septembre 2026");
      L.push("Lettre recommandée avec avis de réception");
      L.push("");
      L.push("Objet : proposition de reclassement");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous propose le poste de Cariste, intitulé « chef de quai » :");
      L.push("  a) Intitulé et descriptif : Chef de quai, organisation des flux, 4 personnes encadrées");
      L.push("  b) Employeur : DUPONT TRANSPORTS");
      L.push("  c) Contrat : CDI, temps complet");
      L.push("  d) Lieu : Nanterre");
      L.push("  e) Rémunération : 2 200 euros brut mensuel");
      L.push("  f) Classification : Ouvrier, coefficient 150 (accord DUPONT du 1er janvier 2020)");
      L.push("");
      L.push("Vous disposez de quinze jours à compter de la réception pour me faire connaître");
      L.push("votre réponse par lettre recommandée.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Une offre par salarié et par poste. Six mentions obligatoires :");
      L.push("a) Intitulé ET descriptif | b) Nom de l'employeur | c) Nature du contrat");
      L.push("d) Localisation | e) Rémunération | f) Classification");
      L.push("");
      L.push("Contrôle avant envoi :");
      L.push("Offre | Salarié | a) Intitulé et descriptif | b) Employeur | c) Contrat");
      L.push("[intitulé] | [nom] | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("d) Lieu | e) Rémunération | f) Classification | Moyen date certaine | Délai écrit");
      L.push("[OUI/NON] | [OUI/NON] | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("");
      L.push("Une offre à laquelle il manque une mention n'est pas une offre au sens du texte.");
      L.push("Si elle a déjà été adressée ET la notification faite, l'irrégularité est acquise.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 impose que les offres soient « écrites et précises ». D. 1233-2-1");
      L.push("énumère six mentions obligatoires. Une offre incomplète n'est pas une offre :");
      L.push("le poste est traité comme non proposé, et l'obligation de reclassement reste");
      L.push("non satisfaite pour ce poste.");
      L.push("");
      L.push("« Précise » signifie que le salarié peut décider sa réponse sans avoir à");
      L.push("demander d'autres informations. Les missions, le rattachement hiérarchique,");
      L.push("les horaires si différents : tout cela entre dans le descriptif.");
      L.push("");
      L.push("Moyen conférant date certaine (D. 1233-2-1, I) : lettre recommandée,");
      L.push("remise en main propre contre signature datée, ou tout moyen équivalent.");
      L.push("Conservez la preuve pour chaque offre.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le plancher de quinze jours francs vise la liste diffusée du III de D. 1233-2-1,",
         "non l'offre personnalisée. Le délai que vous écrivez pour celle-ci doit être",
         "réel et vous devrez pouvoir le défendre."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-04 - L'ATTESTATION D'ABSENCE DE POSTE DISPONIBLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-04", {
    nom: "L'attestation datée d'absence de poste disponible et ses pièces d'appui",
    detail: "L'attestation rédigée, l'état des effectifs et des mouvements qui la " +
            "soutient, le bordereau des réponses des sociétés et la date de refonte.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var L = entete(ctx, "Attestation d'absence de poste disponible",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ATTESTATION D'ABSENCE DE POSTE");
      L.push("");
      L.push("DUPONT DISTRIBUTION SARL");
      L.push("12 rue des Lilas, 95100 Argenteuil");
      L.push("");
      L.push("ATTESTATION D'ABSENCE DE POSTE DISPONIBLE");
      L.push("");
      L.push("Je soussigné(e) Madame Léa MARTIN, gérante, atteste que la recherche des");
      L.push("emplois disponibles conduite au sein de DUPONT DISTRIBUTION SARL n'a fait");
      L.push("apparaître aucun emploi disponible au sens de L. 1233-4, à la date du");
      L.push("10 septembre 2026.");
      L.push("");
      L.push("Cette recherche a porté sur les sociétés suivantes :");
      L.push("  · DUPONT DISTRIBUTION SARL, Ile-de-France");
      L.push("");
      L.push("Pièces d'appui jointes : état des effectifs, réponses des sociétés interrogées.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Une attestation d'absence de poste se justifie. Ce n'est pas une affirmation :");
      L.push("c'est une conclusion documentée.");
      L.push("");
      L.push("Attestation signée le : [DATE]");
      L.push("Par : [NOM, QUALITÉ]");
      L.push("");
      L.push("État des effectifs et mouvements (arrêté au [DATE]) :");
      L.push("Période de recherche : du [DATE DÉBUT] au [DATE ARRÊTÉ]");
      L.push("");
      L.push("Société | Effectif | Entrées | Sorties | Postes ouverts au recrutement");
      L.push("[société] | [nb] | [nb] | [nb] | [nb] et [intitulés]");
      L.push("");
      L.push("Une entrée survenue pendant la période et non explicitée donne à voir un poste");
      L.push("qui existait pendant que l'on attestait qu'il n'y en avait pas.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 ne punit pas l'absence de poste : elle punit l'absence de");
      L.push("JUSTIFICATION de cette absence. L'employeur qui n'a aucun poste à proposer ne");
      L.push("manque à rien, à condition de le justifier (Cass. soc. 2 juillet 2014).");
      L.push("");
      L.push("L'attestation doit porter sur les sociétés du périmètre nommément énumérées.");
      L.push("Attachez-y l'état des effectifs et des mouvements qui la soutient, et les");
      L.push("réponses écrites de chaque société interrogée (y compris les réponses négatives).");
      L.push("");
      L.push("Si un poste se libère après l'attestation, refaites-la : c'est l'état des");
      L.push("postes AU JOUR DE LA NOTIFICATION qui sera discuté.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-05 - LES EFFORTS DE FORMATION ET D'ADAPTATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-05", {
    nom: "Le tableau des actions de formation et d'adaptation, salarié par salarié",
    detail: "Le tableau nominatif, la lettre de proposition d'une action, le " +
            "formulaire de réponse et la note motivée pour les salariés sans action.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var nom = nomDe(ctx);
      var noms = nomsSalaries(f);
      var L = entete(ctx, "Actions de formation et d'adaptation",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ACTIONS DE FORMATION");
      L.push("");
      L.push("DUPONT DISTRIBUTION SARL");
      L.push("Tableau des actions de formation et d'adaptation");
      L.push("Arrêté au 10 septembre 2026");
      L.push("");
      L.push("Salarié | Action proposée | Date | Durée | Réponse et date");
      L.push("DUPONT Jean | Formation conduite de chariot | 15/09 | 5 jours | Acceptée 16/09");
      L.push("MARTIN Sofia | Aucune action proposée | - | - | Justifié 12/09");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Le texte exige « que tous les efforts de formation et d'adaptation aient été");
      L.push("réalisés ». Cela précède même la recherche de postes. Remplissez ce tableau");
      L.push("salarié par salarié.");
      L.push("");
      L.push("Salarié | Action proposée | Date de proposition | Durée | Réponse de l'intéressé");
      L.push("[nom] | [action ou « aucune »] | [date] | [durée] | [acceptation/refus/silence]");
      L.push("");
      L.push("Pour chaque salarié sans action : expliquez pourquoi aucune action n'a été proposée");
      L.push("(qualification déjà suffisante, poste de même niveau disponible immédiatement, etc.)");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 impose que « tous les efforts de formation et d'adaptation aient");
      L.push("été réalisés ». Ce sont des efforts d'ADAPTATION AU POSTE : on n'impose pas");
      L.push("une formation initiale à un métier nouveau. Mais tout ce qui rend le salarié");
      L.push("capable de tenir le poste doit avoir été tenté.");
      L.push("");
      L.push("Une proposition refusée ou restée sans réponse ne ferme pas le point : c'est le");
      L.push("constat daté du silence ou du refus qui le ferme. Documentez chaque refus.");
      L.push("");
      L.push("Ce tableau est central dans les dossiers de mutation technologique (cause 2 de");
      L.push("L. 1233-3) : l'outil change, et ce qui compte est ce qui a été fait pour que");
      L.push("le salarié puisse le tenir.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3",
        ["Le registre unique du personnel est nommé comme pièce d'appui. Aucun article",
         "du corpus de ce module ne porte l'obligation de le tenir : l'application le",
         "désigne, elle ne cite aucun texte à son sujet."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-06 - CALENDRIER ET ANTÉRIORITÉ DE L'ÉTAT DES POSTES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-06", {
    nom: "Calendrier et antériorité de l'état des postes à la notification",
    detail: "Le point d'équilibre entre la date d'arrêté de l'état et celle de la " +
            "notification, et ce qui se réouvre si l'état est postérieur à la lettre.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Calendrier du reclassement",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CALENDRIER");
      L.push("");
      L.push("Date de l'état des postes : 8 septembre 2026");
      L.push("Date d'envoi des offres : 12 septembre 2026");
      L.push("Délai d'attente des réponses : 15 jours");
      L.push("Date de la notification : 28 septembre 2026 ou après");
      L.push("");
      L.push("Jour | Événement | Délai restant");
      L.push("8 septembre | Arrêté de l'état | Cet événement doit être avant tous les autres");
      L.push("12 septembre | Envoi des offres | Au moins 4 jours après l'état");
      L.push("27 septembre | Expiration du délai de réponse | 15 jours après envoi");
      L.push("28 septembre ou après | Notification possible | Jamais avant ce jour");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Fixez les dates de votre dossier et vérifiez leur ordre.");
      L.push("");
      L.push("Date de l'état des postes : [DATE]");
      L.push("Date de notification : [DATE]");
      L.push("Écart entre les deux : [NOMBRE] jour(s)");
      L.push("");
      L.push("L'état des postes doit être antérieur à la notification. L'écart minimal");
      L.push("est celui qu'il faut pour adresser les offres et laisser courir le délai.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 s'apprécie AU JOUR DE LA NOTIFICATION. Cela signifie que l'état");
      L.push("des postes et l'attestation d'absence de poste doivent être antérieurs à la");
      L.push("lettre, et aussi proches que possible d'elle.");
      L.push("");
      L.push("Un état redaté après la notification, une offre complétée après la lettre ne");
      L.push("régularisent rien : ils ajoutent une pièce postérieure à un acte antérieur, et");
      L.push("la pièce elle-même prouve alors que la recherche n'était pas faite le jour");
      L.push("requis. Antidater une pièce n'est pas une régularisation : c'est un risque");
      L.push("d'une autre nature.");
      L.push("");
      L.push("N'ANTIDATEZ RIEN.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-07 - CONTRÔLE DES OFFRES OMISES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-07", {
    nom: "Contrôle des postes omis et des offres non faites",
    detail: "Le point où se trouvent les oublis : postes recensés mais jamais proposés, " +
            "ou proposés sans motif écrit d'exclusion, ou exclus sans justification.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Contrôle des offres omises",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CONTRÔLE DES OMISSIONS");
      L.push("");
      L.push("État des postes du 8 septembre 2026 : 5 postes");
      L.push("Offres adressées : 3 postes");
      L.push("Postes omis : 2");
      L.push("");
      L.push("Poste | Raison de l'omission | Justification");
      L.push("Cariste | Pourvu 7/09 | Affiche de l'annonce du 5/09");
      L.push("Préparateur | Non proposé | AUCUNE - omission");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Comparez l'état des postes et les offres adressées. Pour chaque poste");
      L.push("disponible qui n'a pas reçu d'offre, documentez la raison.");
      L.push("");
      L.push("État des postes : [NOMBRE] poste(s)");
      L.push("Offres adressées : [NOMBRE] poste(s)");
      L.push("Postes omis : [NOMBRE]");
      L.push("");
      L.push("Poste | Raison de l'omission | Document justificatif");
      L.push("[intitulé] | [pourvu/non adapté/autre] | [référence du document]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Chaque poste recensé dans l'état doit recevoir une offre ou un motif écrit");
      L.push("d'exclusion. Un poste sans l'un ni l'autre est un poste omis : c'est une");
      L.push("violation de L. 1233-4.");
      L.push("");
      L.push("Les motifs valables : poste pourvu pendant la procédure, qualification hors");
      L.push("de portée d'une adaptation, mutation interne accordée à l'intéressé. Tout autre");
      L.push("silence à ce sujet laisse une lacune dans la procédure.");
      L.push("");
      L.push("Documentez chaque exclusion. L'absence de documentation = absence d'exclusion.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-08 - DÉLAI DE RÉPONSE ET MOYENS DE RÉPONDRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-08", {
    nom: "Délai de réponse à l'offre et moyens de répondre",
    detail: "L'écrit du délai dans l'offre, les moyens acceptables de répondre, " +
            "la constatation du silence et le délai maximal avant la notification.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Délai et moyen de réponse à l'offre",
        "article D. 1233-2-1 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - OFFRE AVEC DÉLAI");
      L.push("");
      L.push("« Vous disposez d'un délai de quinze jours à compter de la réception de la");
      L.push("présente pour me faire connaître votre réponse. »");
      L.push("");
      L.push("« Vous pouvez répondre par écrit (lettre ou courriel à dupont@dupont.fr) ou");
      L.push("en remettant votre réponse en main propre contre décharge datée et signée. »");
      L.push("");
      L.push("Offre adressée le : 12 septembre 2026");
      L.push("Délai d'attente : 15 jours");
      L.push("Expiration du délai : 27 septembre 2026");
      L.push("Constat de silence : 28 septembre 2026");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Chaque offre doit écrire :");
      L.push("");
      L.push("1. Un délai en jours clairs (minimum recommandé : 15 jours) :");
      L.push("[DÉLAI] à compter de la réception");
      L.push("");
      L.push("2. Les moyens acceptables de répondre :");
      L.push("Lettre recommandée | Remise en main propre | Courriel | Tous les trois");
      L.push("[MOYEN] | [MOYEN] | [MOYEN] | [MOYEN]");
      L.push("");
      L.push("3. Constatez le silence à la date d'expiration. Consignez par écrit :");
      L.push("Date d'expiration : [DATE]");
      L.push("Constat de silence : [DATE]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("D. 1233-2-1, II fixe un plancher de 15 jours francs pour la liste diffusée du");
      L.push("III (ou 4 jours en redressement ou liquidation). Ce plancher ne vise que la");
      L.push("liste diffusée, non l'offre personnalisée : le délai que vous écrivez pour");
      L.push("celle-ci doit être réel et vous devrez pouvoir le défendre.");
      L.push("");
      L.push("Le silence du salarié ne vaut pas acceptation. Si aucune réponse n'arrive,");
      L.push("constatez-le par écrit à la date d'expiration du délai. Cette constatation");
      L.push("ferme le point : vous pouvez alors notifier.");
      L.push("");

      return L.concat(pied("D. 1233-2-1, L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-09 - OFFRES À UN SALARIÉ DE CATÉGORIE INFÉRIEURE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-09", {
    nom: "Reclassement de catégorie inférieure - accord préalable exprès",
    detail: "Le point où le salarié accepte explicitement un poste de catégorie " +
            "inférieure, avant que l'offre lui soit proposée.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Accord préalable pour reclassement de catégorie inférieure",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ACCORD PRÉALABLE");
      L.push("");
      L.push("Salarié | Catégorie actuelle | Catégorie proposée | Date d'accord");
      L.push("DUPONT Jean | Cadre | Ouvrier | 10 septembre 2026");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Si le poste proposé est de catégorie inférieure, vous devez recueillir");
      L.push("l'accord exprès du salarié AVANT de lui proposer l'offre.");
      L.push("");
      L.push("Accord des salariés pour reclassement inférieur :");
      L.push("Salarié | Catégorie actuelle | Catégorie proposée | Date d'accord | Pièce");
      L.push("[nom] | [classification] | [classification] | [date] | [référence accord]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 prévoit un reclassement sans modification des caractéristiques du");
      L.push("contrat. Proposer un poste de catégorie inférieure est une modification du");
      L.push("contrat qui exige l'accord du salarié. Cet accord doit être EXPRÈS et obtenu");
      L.push("AVANT la proposition du poste.");
      L.push("");
      L.push("Un accord donné dans l'offre elle-même n'a pas la même valeur : le salarié");
      L.push("accepte certes, mais c'est après avoir découvert le poste. L'accord préalable");
      L.push("dit que le salarié consent à ce type de modification avant même de voir le");
      L.push("poste.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-10 - RECLASSEMENT HORS DU PÉRIMÈTRE, AUTRES TERRITOIRES
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-10", {
    nom: "Recherche de reclassement hors du périmètre légal",
    detail: "La limite de L. 1233-4 : territoire national dans le groupe. " +
            "Au-delà, c'est de la bonne volonté, pas une obligation.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Reclassement hors du périmètre légal",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DÉMARCHE HORS PÉRIMÈTRE");
      L.push("");
      L.push("Périmètre légal : France (groupes établis sur le territoire national)");
      L.push("");
      L.push("Au-delà du périmètre légal :");
      L.push("  · Filiales ou sociétés du groupe en Belgique, Allemagne, etc. : reclassement");
      L.push("    possible, mais non obligatoire.");
      L.push("  · PME indépendantes du groupe : reclassement possible, mais non obligatoire.");
      L.push("");
      L.push("Cette bonne volonté, si elle existe, est documentée à titre informatif.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Avez-vous exploré d'autres possibilités de reclassement ?");
      L.push("");
      L.push("Recherche effectuée | Oui / Non | Date et résultat");
      L.push("Autres sociétés du groupe | [OUI/NON] | [résumé]");
      L.push("Autres entreprises | [OUI/NON] | [résumé]");
      L.push("Partenaires économiques | [OUI/NON] | [résumé]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 limite la recherche au « territoire national » dans « l'entreprise");
      L.push("ou les autres entreprises du groupe » dont certaines conditions de permutation");
      L.push("sont remplies. Au-delà, l'employeur n'a pas d'obligation légale.");
      L.push("");
      L.push("Si vous recherchez au-delà, c'est à titre de bonne volonté. Documentez-le.");
      L.push("Ce qui n'existe pas : une obligation d'internationaliser la recherche, ou de");
      L.push("rechercher chez des tiers.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 233-1, L. 233-3, L. 233-16 du code de commerce,",
        ["Le groupe se lit dans des articles du code de commerce que l'application n'a",
         "pas lus : elle les nomme, elle ne les interprète pas."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-11 - RECLASSEMENT INTERNE ACCORDÉ AU SALARIÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-11", {
    nom: "Acceptation d'une offre de reclassement",
    detail: "Le moment où le salarié accepte le poste proposé, et ce qui en découle.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Acceptation d'une offre de reclassement",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ACCEPTATION");
      L.push("");
      L.push("Salarié : DUPONT Jean");
      L.push("Offre adressée le : 12 septembre 2026");
      L.push("Réponse reçue le : 15 septembre 2026");
      L.push("Réponse : Acceptation");
      L.push("Pièce : Lettre de l'intéressé du 15 septembre 2026");
      L.push("");
      L.push("Conséquence : Aucune notification. Le licenciement n'a pas lieu.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Pour chaque offre acceptée :");
      L.push("");
      L.push("Salarié | Offre | Date d'acceptation | Pièce probante");
      L.push("[nom] | [intitulé] | [date] | [courrier, signature]");
      L.push("");
      L.push("Une acceptation ferme entraîne : le contrat change de clauses (lieu, horaires,");
      L.push("rémunération si elle varie), la notification n'a pas lieu.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Le but de la procédure est un reclassement. Dès qu'un reclassement est");
      L.push("accepté, la procédure s'arrête : le contrat de travail continue avec des");
      L.push("clauses modifiées (lieu, horaires, rémunération le cas échéant).");
      L.push("");
      L.push("La notification du licenciement n'a donc pas lieu si le salarié accepte.");
      L.push("C'est pourquoi le délai de réponse à l'offre est crucial : il est le temps de");
      L.push("réflexion du salarié, qui peut librement accepter ou refuser.");
      L.push("");

      return L.concat(pied("L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-REC-12 - DÉCOMPTE ET CRITÈRES DE CONFORMITÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-REC-12", {
    nom: "Décompte des postes et critères de conformité de la recherche",
    detail: "Le critère unique et capital : tous les postes du périmètre légal, " +
            "y compris ceux de catégorie inférieure, tous documentés.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Décompte et conformité de la recherche",
        "article L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DÉCOMPTE");
      L.push("");
      L.push("Périmètre : DUPONT DISTRIBUTION (France)");
      L.push("");
      L.push("État des postes : 5 postes");
      L.push("Offres adressées : 3 postes");
      L.push("Offres refusées : 2 postes");
      L.push("Refus constatés : 2 (15/09 et 18/09 2026)");
      L.push("");
      L.push("Critère de conformité : tous les salariés licenciés ont reçu toutes les");
      L.push("offres adaptées à leurs qualifications et toutes les offres de catégories");
      L.push("inférieures. Aucun poste n'a été omis documenté.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Synthèse de la recherche :");
      L.push("");
      L.push("Salariés licenciés : [NOMBRE]");
      L.push("Postes disponibles : [NOMBRE]");
      L.push("Postes proposés : [NOMBRE]");
      L.push("Postes refusés par le salarié : [NOMBRE]");
      L.push("Postes omis (non proposés) : [NOMBRE]");
      L.push("");
      L.push("Conformité | Oui | Non | Justification");
      L.push("Tous les postes du périmètre proposés ou motivement exclus | [ ] | [ ] | [ou référence]");
      L.push("Tous les salariés ont reçu toutes les offres appropriées | [ ] | [ ] | [ou référence]");
      L.push("Efforts de formation documentés pour chaque salarié | [ ] | [ ] | [ou référence]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "reclassement"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-4 s'apprécie à deux moments : avant la notification (l'état des");
      L.push("postes), et au jour de la notification. Le critère unique est l'impossibilité");
      L.push("de reclasser : elle se prouve par l'absence de poste adapté.");
      L.push("");
      L.push("Tous les postes disponibles au jour de la notification doivent avoir reçu une");
      L.push("offre : cette offre a pu être refusée, mais il ne doit y avoir aucun poste");
      L.push("oublié ni non proposé sans motif documenté.");
      L.push("");

      return L.concat(pied("L. 1233-4, D. 1233-2-1, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-EMP-01 - SUPPRESSION D'EMPLOI
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-EMP-01", {
    nom: "L'ordre de suppression d'emploi et sa justification",
    detail: "La décision d'éliminer le poste, comment elle se documente et comment " +
            "elle s'oppose à la reconversion du salarié après son refus.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Suppression de l'emploi",
        "articles L. 1233-2 et L. 1233-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - SUPPRESSION");
      L.push("");
      L.push("Poste : Chauffeur livreur");
      L.push("Cause : Mutations économiques - livraison logistique externalisée");
      L.push("Date de suppression : 30 septembre 2026");
      L.push("Justification : Contrat de sous-traitance signé avec Prestations Logistiques");
      L.push("Pièce probante : Contrat signé le 20 août 2026");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Poste supprimé : [INTITULÉ]");
      L.push("Date de suppression : [DATE]");
      L.push("Cause : [CAUSE ÉCONOMIQUE]");
      L.push("Justification : [PIÈCES PROBANTES]");
      L.push("");
      L.push("Différence clé :");
      L.push("Reclassement refusé | Suppression | Salarié rejette le poste proposé");
      L.push("[OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("");
      L.push("Si le salarié refuse le reclassement, le poste existe toujours : la cause");
      L.push("reste le reclassement impossible. Ce n'est pas une suppression.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "emploi"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("La suppression d'emploi est le moment où l'employeur décide d'éliminer le");
      L.push("poste. Ce n'est pas une conséquence du refus du salarié : c'est une décision");
      L.push("antérieure à la notification.");
      L.push("");
      L.push("Documentez-la. « Le poste disparaît » ne suffit pas : dites pourquoi. Une");
      L.push("fusion, une externalisation, la fermeture d'une activité, l'arrêt d'une");
      L.push("gamme de produits, une baisse durable de l'activité : tout cela peut justifier");
      L.push("une suppression. Mais il faut le dire et le prouver.");
      L.push("");

      return L.concat(pied("L. 1233-2, L. 1233-4, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-EMP-02 - BILAN SOCIAL ET DEMANDES DE RENSEIGNEMENTS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-EMP-02", {
    nom: "Documents sociaux produits et renseignements du dossier",
    detail: "Le registre unique du personnel, les données du dossier, les demandes " +
            "de renseignements du CSE si l'entreprise en a un.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Documents sociaux et demandes de renseignements",
        "article L. 1233-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DOCUMENTS");
      L.push("");
      L.push("Registre unique du personnel : à jour");
      L.push("Fiches de paye : 12 derniers mois conservés");
      L.push("Éléments de rémunération : salaire, primes, avantages documentés");
      L.push("Demandes du CSE : Demandes de renseignements du 5 septembre 2026");
      L.push("Réponses apportées : Fournies le 10 septembre 2026");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Documentez ce que vous avez produit :");
      L.push("");
      L.push("Document | Présent | Date | Demandes du CSE addressées");
      L.push("Registre unique du personnel | [OUI/NON] | [date] | [OUI/NON]");
      L.push("Fiches de paye (12 derniers mois) | [OUI/NON] | [période] | [OUI/NON]");
      L.push("Éléments de rémunération | [OUI/NON] | [références] | [OUI/NON]");
      L.push("Organigramme daté | [OUI/NON] | [date] | [OUI/NON]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "emploi"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Aucun article du corpus de ce module ne porte l'obligation de le tenir : le");
      L.push("registre unique du personnel est nommé comme pièce d'appui. Ce qui le crédibilise");
      L.push("sont les autres données de l'entreprise : il doit concorder avec la paye, avec");
      L.push("les effectifs déclarés, avec l'organigramme.");
      L.push("");
      L.push("Si le CSE de l'entreprise a adressé des demandes de renseignements, répondez-y");
      L.push("avant de notifier. Leur absence de réponse est un point de procédure qui");
      L.push("restera ouvert, et sera discuté.");
      L.push("");

      return L.concat(pied("L. 1233-2, L. 1233-4, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-01 - CAUSE ÉCONOMIQUE DÉFINITION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-01", {
    nom: "Définition et preuve de la cause économique",
    detail: "Les quatre causes de L. 1233-3, ce qui chacune impose de prouver, et " +
            "le moment où elle s'apprécie.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Cause économique",
        "articles L. 1233-2 et L. 1233-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CAUSE ÉCONOMIQUE");
      L.push("");
      L.push("Cause invoquée : Difficultés économiques");
      L.push("Preuve : Compte de résultat 2024-2025 déficitaire");
      L.push("Périmètre du licenciement : 2 salariés sur 12");
      L.push("Justification : Postes les moins productifs, surcoûts de 12 %");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Cause invoquée | Preuve requise | Pièce jointe");
      L.push("Difficultés économiques | Comptes, ratios | [références]");
      L.push("Mutations technologiques | Cahier de charges | [références]");
      L.push("Réorganisation | Organigrammes avant/après | [références]");
      L.push("Perte de marché ou contrats | Pertes chiffrées | [références]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "cause"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-3 énumère quatre causes économiques qui peuvent justifier un");
      L.push("licenciement. Chacune doit être prouvée. L'absence de preuve laisse la cause");
      L.push("non établie.");
      L.push("");
      L.push("Difficultés économiques : présentez les données comptables.");
      L.push("Mutations technologiques : décrivez l'évolution, le nouveau process.");
      L.push("Réorganisation : produisez les organigrammes avant et après.");
      L.push("Perte de marché : documentez les contrats perdus ou la baisse d'activité.");
      L.push("");

      return L.concat(pied("L. 1233-2, L. 1233-3, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-02 - DÉMONSTRATION COMPTABLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-02", {
    nom: "Démonstration comptable des difficultés économiques",
    detail: "Les données de l'entreprise qui soutiennent la cause, et comment les " +
            "présenter au service du raisonnement juridique.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Démonstration comptable",
        "article L. 1233-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DONNÉES COMPTABLES");
      L.push("");
      L.push("Chiffre d'affaires 2023 : 1 500 000 euros");
      L.push("Chiffre d'affaires 2024 : 1 200 000 euros (-20 %)");
      L.push("Résultat 2023 : +80 000 euros");
      L.push("Résultat 2024 : -50 000 euros");
      L.push("Ratio massf salariale / chiffre d'affaires 2023 : 30 %");
      L.push("Ratio 2024 : 37 % (surcoût du salariat face à la baisse d'activité)");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Données financières | 2023 | 2024 | Variation");
      L.push("Chiffre d'affaires | [montant] | [montant] | [%]");
      L.push("Résultat d'exploitation | [montant] | [montant] | [%]");
      L.push("Masse salariale | [montant] | [montant] | [%]");
      L.push("Ratio masse salariale / CA | [%] | [%] | [variation]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "cause"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Les difficultés économiques doivent être documentées par des données");
      L.push("comptables tangibles. Une affirmation sans chiffres ne suffit pas.");
      L.push("");
      L.push("Présentez la tendance : une baisse d'activité, un déficit, une dégradation");
      L.push("du ratio de rentabilité. Montrez comment cette dégradation justifie le");
      L.push("licenciement de ces salariés-là, à ce nombre-là.");
      L.push("");
      L.push("Conservez les comptes et les états de trésorerie : ils seront demandés.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-03 - LIEN ENTRE CAUSE ET EMPLOI
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-03", {
    nom: "Lien de causalité entre la cause économique et la suppression de l'emploi",
    detail: "Le point où l'employeur explique comment la cause économique justifie " +
            "précisément ce licenciement-là, à ces salariés-là.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Lien de causalité",
        "article L. 1233-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - LIEN DE CAUSALITÉ");
      L.push("");
      L.push("Cause | Emploi supprimé | Nombre avant / après | Justification du lien");
      L.push("Baisse d'activité 20 % | Chauffeur livreur | 10 à 9 | Zone touristique -25 % CA");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Tableau du lien de causalité :");
      L.push("Cause économique | Emploi | Effectif avant | Effectif après | Justification");
      L.push("[cause] | [intitulé] | [nombre] | [nombre] | [explication du lien]");
      L.push("");
      L.push("Pour chaque emploi supprimé, expliquez pourquoi IL DOIT disparaître");
      L.push("en raison de cette cause économique.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "cause"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Un licenciement économique doit établir deux choses :");
      L.push("  1. Une cause économique existe (difficultés, mutations, réorganisation, etc.)");
      L.push("  2. Le licenciement de ce salarié en découle logiquement.");
      L.push("");
      L.push("Le lien de causalité ne se déduit pas : il s'explique. Dites comment cette");
      L.push("cause justifie précisément cette suppression.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-04 - MUTATION TECHNOLOGIQUE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-04", {
    nom: "Mutation technologique - description et efforts d'adaptation",
    detail: "La cause 2 de L. 1233-3. Ce qui change techniquement, comment le salarié " +
            "pourrait l'apprendre, et ce qui a été tenté.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Mutation technologique",
        "article L. 1233-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - MUTATION TECHNOLOGIQUE");
      L.push("");
      L.push("Technologie ancienne : Logiciel de facturation maison, acquis en 1995");
      L.push("Technologie nouvelle : Logiciel cloud ERP SAP, implémentation juillet 2026");
      L.push("Poste concerné : Gestionnaire paie (2 ans d'ancienneté sur ce poste)");
      L.push("");
      L.push("Action d'adaptation proposée :");
      L.push("  · Formation SAP paie : 3 jours, prestataire externa, juin 2026");
      L.push("  · Accompagnement post-déploiement : support interne 2 semaines");
      L.push("  · Réponse du salarié : Refus de la formation (motif : [à documenter])");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Mutation invoquée : [DESCRIPTION DÉTAILLÉE]");
      L.push("Date du changement : [DATE EFFECTIVE]");
      L.push("Impact sur le poste : [EXPLICATIONS]");
      L.push("");
      L.push("Efforts d'adaptation proposés :");
      L.push("Formation | Contenu | Durée | Dates | Réponse du salarié");
      L.push("[type] | [descriptif] | [durée] | [du ... au ...] | [accepté/refusé/silence]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "cause"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-3, 1° énumère « les mutations technologiques » comme cause économique.");
      L.push("C'est le terrain où se nouent les contentieux : l'outil change, et la question");
      L.push("devient de savoir ce qui a été fait pour que le salarié puisse le tenir.");
      L.push("");
      L.push("Décrivez le changement avec précision. Documentez les efforts d'adaptation :");
      L.push("formation, accompagnement, tutorat. Si une formation a été refusée, documentez");
      L.push("le refus et la date.");
      L.push("");
      L.push("C'est L. 1233-4 qui impose ces efforts : ils doivent tous avoir été épuisés");
      L.push("avant le licenciement (point CTL-REC-05).");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-4, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-05 - RÉORGANISATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-05", {
    nom: "Réorganisation d'activité ou modification de structure",
    detail: "La cause 3 de L. 1233-3. Avant et après : organigrammes, effectifs, " +
            "mission du poste supprimé.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Réorganisation",
        "article L. 1233-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - RÉORGANISATION");
      L.push("");
      L.push("Avant le 1er septembre 2026 :");
      L.push("  · Direction générale");
      L.push("  · · Secrétaire de direction (poste à supprimer)");
      L.push("  · · Directeur administratif");
      L.push("  · · · Assistante administrative");
      L.push("");
      L.push("Après le 1er septembre 2026 :");
      L.push("  · Direction générale");
      L.push("  · · Directeur administratif");
      L.push("  · · · Assistante administrative (ajout : secrétariat mutualisé)");
      L.push("");
      L.push("Justification : Redondance éliminée. Le secrétariat mutualisé économise un poste.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Date de réorganisation : [DATE]");
      L.push("Motif : [DESCRIPTION]");
      L.push("");
      L.push("Structure avant | Structure après | Poste supprimé");
      L.push("Organigramme daté du [DATE] | Organigramme daté du [DATE] | [INTITULÉ ET JUSTIFICATION]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "cause"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Une réorganisation crédible doit être documentée. Produisez les organigrammes");
      L.push("avant et après, datés. Montrez comment cette restructuration justifie la");
      L.push("suppression de ce poste.");
      L.push("");
      L.push("Un poste qui disparaît pour être remplacé par un autre n'est pas supprimé : on");
      L.push("l'appelle mutation, et le salarié peut être proposé au nouveau poste (souvent");
      L.push("c'est un reclassement). C'est seulement si le poste disparaît vraiment et que");
      L.push("le reclassement échoue que le licenciement intervient.");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3")).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     CTL-ECO-06 - FAUTE DE L'EMPLOYEUR
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("CTL-ECO-06", {
    nom: "Faute de l'employeur dans la procédure de licenciement",
    detail: "Les vices de procédure qui annulent le licenciement, et ce qui ne se " +
            "rattrape pas - L. 1233-3, 4°.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {};
      var L = entete(ctx, "Faute de l'employeur",
        "article L. 1233-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - FAUTES");
      L.push("");
      L.push("Faute constatée : État des postes complété après la notification.");
      L.push("Date de l'état : 30 septembre 2026");
      L.push("Date de la notification : 28 septembre 2026");
      L.push("Vice : L'état ne peut pas justifier la recherche si elle était inexistante");
      L.push("à la date de la notification.");
      L.push("");

      L.push("À COMPLÉTER");
      L.push("");
      L.push("Procédure mise en oeuvre | Conforme | Faute relevée | Justification");
      L.push("État des postes antérieur | [OUI/NON] | [OUI/NON] | [référence]");
      L.push("Offres écrites et précises | [OUI/NON] | [OUI/NON] | [référence]");
      L.push("Délai de réponse écrit | [OUI/NON] | [OUI/NON] | [référence]");
      L.push("Efforts d'adaptation documentés | [OUI/NON] | [OUI/NON] | [référence]");
      L.push("Cause économique établie | [OUI/NON] | [OUI/NON] | [référence]");
      L.push("");

      L = L.concat(DP.liens(ctx, ["eco", "cause"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("L. 1233-3, 4° dit que le licenciement ne peut être justifié si l'employeur a");
      L.push("commis une faute dans la procédure. Cette réserve est d'origine prétorienne :");
      L.push("le texte ne la mentionne pas explicitement, mais la jurisprudence en a déduit");
      L.push("que certains manquements annulent le licenciement.");
      L.push("");
      L.push("Fautes qui annulent : Omission d'une pièce capitale (état des postes, offre");
      L.push("précise, efforts d'adaptation). Redatage après la notification. Absence totale");
      L.push("d'une obligation d'ordre public.");
      L.push("");
      L.push("Fautes qui n'annulent pas : Défaut d'un tableau de suivi, lacune mineure dans");
      L.push("une offre sinon conforme (à sauf si elle rend l'offre incomplète).");
      L.push("");

      return L.concat(pied("L. 1233-3, L. 1233-2, L. 1235-1, L. 1235-3",
        ["La faute et la légèreté blâmable du texte de L. 1233-3, 4° ne sont pas au corpus",
         "de ce module : la réserve est d'origine prétorienne et le document l'écrit comme",
         "telle."])).join("\n");
    },
  });

})(typeof window !== "undefined" ? window : global);
