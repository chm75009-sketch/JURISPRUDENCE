/* LE TRANSPORT ROUTIER DE MARCHANDISES.

   POURQUOI CE FICHIER EXISTE

   Demande du 14 septembre 2026 : « prévoir, lorsque le client choisit
   transport, les documents les plus complets et surtout les plus adaptés à la
   convention collective et à toute la réglementation routière, notamment en
   matière de transport de marchandises ».

   Un contrat de conducteur routier écrit sur le seul code du travail est faux
   sur l'essentiel : la durée du travail s'y appelle temps de service, elle
   n'est pas de trente-cinq heures mais de quarante-trois pour un grand
   routier, les heures supplémentaires ne se comptent pas au même seuil, le
   repos quotidien obéit à un autre régime, et le décompte se fait par le
   chronotachygraphe. Ce fichier porte ces clauses.

   CE QUI EST FONDÉ ICI, ET CE QUI NE L'EST PAS

   Tout ce qui est écrit ci-dessous vient du code des transports, lu à la
   source par le relais Légifrance de l'application le 14 septembre 2026, deux
   lectures espacées concordantes, onze articles, identifiants de version
   consignés dans moteur/transport/textes-transport.json. Le code des
   transports est servi par le relais comme le code du travail : découverte du
   14 septembre 2026, à laquelle ce fichier doit d'exister.

   LA CONVENTION COLLECTIVE, ELLE, N'EST PAS LUE. Le relais ne sert pas les
   textes conventionnels : interrogé sur la convention des transports
   routiers, il rend un homonyme sans rapport. Les grilles de salaires, les
   coefficients, les indemnités de repas et de découcher de la convention
   collective nationale des transports routiers (IDCC 16) restent donc entre
   crochets, à compléter depuis le texte, et le document le dit. Écrire un
   montant qu'on n'a pas lu serait pire que de laisser un crochet.          */

(function (window) {
  "use strict";

  /* Les articles, avec l'identifiant de la version lue : un article se
     modifie sans changer de numéro, et le numéro seul ne dit pas laquelle. */
  var T = {
    "D3312-45": { id: "LEGIARTI000033450327", code: "transports" },
    "R3312-47": { id: "LEGIARTI000033450331", code: "transports" },
    "R3312-50": { id: "LEGIARTI000033450337", code: "transports" },
    "R3312-51": { id: "LEGIARTI000033450339", code: "transports" },
    "R3312-2":  { id: "LEGIARTI000033450215", code: "transports" },
    "R3312-53": { id: "LEGIARTI000033450343", code: "transports" },
    "R3312-55": { id: "LEGIARTI000033450349", code: "transports" },
    "L3312-1":  { id: "LEGIARTI000033021297", code: "transports" },
    "L3312-2":  { id: "LEGIARTI000026054561", code: "transports" },
    "L3314-1":  { id: "LEGIARTI000043976900", code: "transports" },
    "R3314-1":  { id: "LEGIARTI000044326162", code: "transports" },
  };
  function art(n) { return n.replace(/^([LRD])(\d)/, "$1. $2"); }
  function refs(liste) {
    return liste.map(art).join(", ") + " du code des transports";
  }

  /* Les quatre catégories qui commandent tout le reste. Le nom est celui du
     code des transports, non un vocabulaire d'entreprise. */
  var CATEGORIES = [
    { cle: "grand", nom: "Personnel roulant grand routier ou longue distance",
      service: 43, trimestre: 559,
      max: "56 heures sur une semaine isolée, et 53 heures en moyenne sur trois mois " +
           "(689 heures par trimestre) lorsque les transports sont exécutés exclusivement " +
           "avec des véhicules de plus de 3,5 tonnes, 48 heures dans les autres cas" },
    { cle: "courte", nom: "Autre personnel roulant marchandises (courte distance)",
      service: 39, trimestre: 507,
      max: "52 heures sur une semaine isolée, et 50 heures en moyenne sur trois mois " +
           "(650 heures par trimestre) lorsque les transports sont exécutés exclusivement " +
           "avec des véhicules de plus de 3,5 tonnes, 48 heures dans les autres cas" },
    { cle: "messagerie", nom: "Conducteur de messagerie ou convoyeur de fonds",
      service: 35, trimestre: 455,
      max: "48 heures sur une semaine isolée, et 44 heures en moyenne sur trois mois " +
           "(572 heures par trimestre)" },
    { cle: "sedentaire", nom: "Personnel sédentaire (exploitation, atelier, administratif)",
      service: 35, trimestre: null, max: null },
  ];
  function categorie(cle) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].cle === cle) return CATEGORIES[i];
    return CATEGORIES[0];
  }

  /* L'entreprise relève-t-elle du transport ? Le secteur de la fiche le dit,
     l'IDCC 16 le confirme. L'un ou l'autre suffit : une entreprise peut avoir
     renseigné sa convention sans son secteur, ou l'inverse. */
  function estTransport(profil) {
    var p = profil || {};
    var s = String(p.secteur || "").toLowerCase();
    if (s.indexOf("transport") >= 0 || s.indexOf("logistique") >= 0) return true;
    var c = String(p.conventionCollective || p.convention || p.idcc || "");
    var m = c.match(/\d{3,4}/);
    if (m && Number(m[0]) === 16) return true;
    return /transports routiers/i.test(c);
  }

  /* LES CLAUSES DU CONTRAT D'UN CONDUCTEUR.

     Elles s'ajoutent au contrat commun, elles ne le remplacent pas : le
     contrat garde ses mentions de droit commun, et reçoit ici ce que le code
     des transports impose en plus, ou autrement. */
  function clausesContrat(v, profil) {
    var c = categorie((v && v.roulant) || "grand");
    var b = [];
    function p(t) { b.push({ k: "p", t: t }); }
    function h(t) { b.push({ k: "h2", t: t }); }
    function note(t) { b.push({ k: "note", t: t }); }

    b.push({ k: "h1", t: "DISPOSITIONS PROPRES AU TRANSPORT ROUTIER DE MARCHANDISES" });
    note("Ces clauses viennent du code des transports, lu à la source le 14 septembre 2026. " +
      "Ce qui relève de la convention collective des transports routiers (IDCC 16), coefficient, " +
      "grille de salaires, indemnités de repas et de découcher, reste entre crochets : " +
      "l'application ne l'a pas lu et n'invente pas un montant.");

    h("Article : catégorie de personnel et temps de service");
    p("Le salarié relève de la catégorie suivante : " + c.nom.toLowerCase() + ".");
    if (c.cle === "sedentaire") {
      p("La durée du travail est celle du droit commun, trente-cinq heures par semaine. " +
        "Les dispositions du code des transports relatives au temps de service des personnels " +
        "roulants ne lui sont pas applicables.");
    } else {
      p("La durée du travail, dénommée temps de service, correspondant à la durée légale ou " +
        "réputée équivalente à celle-ci, est fixée à " + c.service + " heures par semaine, soit " +
        c.trimestre + " heures par trimestre (" + art("D3312-45") + " du code des transports).");
      p("Est une heure supplémentaire toute heure de temps de service accomplie au-delà de cette " +
        "durée (" + art("R3312-47") + "). Les heures supplémentaires ouvrent droit, outre leur " +
        "majoration, à la compensation obligatoire en repos trimestrielle prévue par " +
        art("R3312-48") + " et " + art("R3312-49") + ".");
      p("Le temps de service ne peut excéder " + c.max + " (" + art("R3312-50") + ").");
      p("La durée quotidienne du temps de service ne peut excéder douze heures (" +
        art("R3312-51") + ").");
    }

    h("Article : amplitude, pauses et repos");
    p("L'amplitude de la journée de travail est l'intervalle entre deux repos quotidiens " +
      "successifs, ou entre un repos hebdomadaire et le repos quotidien qui le précède ou le " +
      "suit immédiatement (" + art("R3312-2") + ").");
    if (c.cle !== "sedentaire") {
      p("Le salarié ne travaille en aucun cas plus de six heures consécutives sans pause (" +
        art("L3312-2") + "). Le temps de pause est d'au moins trente minutes lorsque le temps " +
        "de travail est compris entre six et neuf heures, et d'au moins quarante-cinq minutes " +
        "au-delà de neuf heures.");
      p("La durée du repos quotidien peut être réduite dans les conditions et limites fixées " +
        "par " + art("R3312-53") + ", et, pour les transports soumis au règlement (CE) " +
        "n° 561/2006, dans les conditions prévues par ce règlement.");
    }

    h("Article : enregistrement et décompte du temps de service");
    if (c.cle !== "sedentaire") {
      p("Le temps de service est enregistré, attesté et contrôlé au moyen du chronotachygraphe " +
        "équipant le véhicule : feuille d'enregistrement pour un appareil analogique, données " +
        "de la carte personnelle du conducteur et de l'unité véhicule pour un appareil " +
        "numérique, téléchargées de manière continue et régulière (" + art("R3312-55") + ").");
      p("Le salarié utilise sa carte de conducteur à chaque prise de service, la conserve en bon " +
        "état, signale sans délai toute perte, vol ou dysfonctionnement et en demande le " +
        "renouvellement en temps utile. Il respecte les temps de conduite, de pause et de repos " +
        "fixés par le règlement (CE) n° 561/2006.");
      p("Le décompte distingue la durée du temps de service consacré à la conduite et celle " +
        "consacrée aux autres tâches (" + art("R3312-57") + ").");
    } else {
      p("Le temps de travail est décompté selon les règles de droit commun applicables dans " +
        "l'entreprise.");
    }

    h("Article : formations et titres obligatoires");
    if (c.cle !== "sedentaire") {
      p("La conduite est subordonnée à la détention du permis correspondant à la catégorie du " +
        "véhicule, en cours de validité, et à la qualification initiale de conducteur routier " +
        "(" + art("R3314-1") + "), complétée par la formation continue obligatoire. Cette " +
        "formation porte sur les règles de sécurité routière et de sécurité à l'arrêt, sur la " +
        "réglementation de la durée du travail et des temps de conduite et de repos, et sur la " +
        "réduction de l'incidence de la conduite sur l'environnement (" + art("L3314-1") + ").");
      p("Le salarié informe l'employeur sans délai de toute suspension, rétention, annulation " +
        "ou invalidation de son permis de conduire, ainsi que de toute décision affectant la " +
        "validité de sa carte de qualification de conducteur ou de son aptitude médicale.");
      p("[Le cas échéant : habilitation au transport de marchandises dangereuses (ADR), " +
        "certificat correspondant et date de validité.]");
    } else {
      p("[Le cas échéant : habilitations et formations propres au poste, avec leur date de " +
        "validité.]");
    }

    h("Article : travail de nuit");
    p("Est considéré comme travail de nuit, pour le personnel roulant, le travail accompli " +
      "pendant la période définie par " + art("L3312-1") + " du code des transports. " +
      "[Préciser la période de nuit retenue dans l'entreprise et les contreparties applicables.]");

    h("Article : véhicule, chargement et sécurité");
    p("Le véhicule confié au salarié reste la propriété de l'entreprise. Le salarié en prend " +
      "soin, procède aux vérifications avant départ, signale sans délai toute avarie, tout " +
      "dommage et tout accident, et n'effectue aucune réparation de sa propre initiative.");
    p("Le salarié respecte les consignes de chargement, d'arrimage et de déchargement, les " +
      "limites de charge et les règles de circulation. Il ne transporte aucune personne ni " +
      "aucune marchandise étrangère à sa mission.");
    p("L'usage du téléphone tenu en main est interdit pendant la conduite. La consommation " +
      "d'alcool et de substances psychoactives est interdite pendant le service.");

    h("Article : rémunération et frais de déplacement");
    p("La rémunération du salarié est fixée à l'article [numéro] du présent contrat. Elle ne " +
      "peut être inférieure au minimum conventionnel correspondant à son coefficient.");
    p("[Coefficient et groupe conventionnels : à compléter depuis la convention collective " +
      "nationale des transports routiers et activités auxiliaires du transport, IDCC 16.]");
    p("[Indemnités de repas, de repas unique, de casse-croûte et de grand déplacement " +
      "(découcher) : montants à reprendre du protocole annexé à la convention collective, en " +
      "vigueur à la date de signature.]");
    note("L'application ne lit pas les textes conventionnels : le relais Légifrance dont elle " +
      "dispose ne sert que les codes. Les montants ci-dessus doivent être repris du texte " +
      "lui-même, et vérifiés à sa dernière version.");

    return b;
  }

  /* Le champ que la page ajoute au contrat quand l'entreprise est du
     transport : c'est lui qui commande les durées. */
  var CHAMP_ROULANT = {
    id: "roulant", nom: "Catégorie (transport routier)", t: "select",
    opts: CATEGORIES.map(function (c) { return [c.cle, c.nom]; }),
    defaut: "grand",
  };

  window.Transport = {
    TEXTES: T, CATEGORIES: CATEGORIES, CHAMP_ROULANT: CHAMP_ROULANT,
    estTransport: estTransport, clausesContrat: clausesContrat,
    categorie: categorie, art: art, refs: refs,
  };
})(window);
