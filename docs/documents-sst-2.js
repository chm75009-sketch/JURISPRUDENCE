/* Les documents que l'application PRODUIT, les harcèlements et les
   agissements sexistes.

   POURQUOI CE FICHIER EXISTE, ET POURQUOI IL EST SÉPARÉ

   documents-sst.js porte le document unique, le programme de prévention et la
   commission santé, sécurité et conditions de travail, quatorze générateurs,
   déjà. Le bloc « harcèlement » du même module en attendait cinq, et ils
   n'ont rien à voir avec les précédents : ils ne décrivent pas un risque
   d'atelier, ils organisent la manière dont une entreprise reçoit la parole
   d'un salarié qui dit avoir subi quelque chose, et dont elle y répond.

   Ces cinq documents sont écrits ici, à la suite de documents-sst.js et sur
   le même registre. Le registre commun n'accepte qu'une fois chaque
   identifiant : ce fichier n'enregistre que SST-CTL-HAR-01 à SST-CTL-HAR-05,
   qu'aucun autre fichier ne porte.

   LA FORME, DEPUIS LE 9 SEPTEMBRE 2026 (epreuve/CONSIGNE-EXEMPLE-TABLEAUX.md)

   Chaque générateur rend, dans cet ordre : l'en-tête ; l'exemple, ouvert par
   le bandeau DP.EXEMPLE et entièrement rempli pour une entreprise fictive du
   secteur de la fiche (cinq secteurs, services par défaut) ; le document à
   compléter, même structure, données de la fiche et crochets ; le calendrier ;
   les liens du thème et du secteur ; puis LES RÈGLES, le droit tel qu'il a
   été lu. Les tableaux s'écrivent une rangée par ligne, cellules séparées par
   une barre verticale : feuille-doc.js les rend en vrai tableau. Le corps de
   chaque document est écrit une seule fois, dans une fonction corps(E) qui
   sert à l'exemple (E rempli) et au document à compléter (E nul).

   TROIS RÈGLES ONT COMMANDÉ L'ÉCRITURE, ET LA TROISIÈME EST VITALE ICI

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Chaque article cité figure dans
      moteur/sst/textes-sst.json avec son identifiant de version, ou dans le
      fondement du contrôle auquel le document répond. Les articles seulement
      RENVOYÉS par un texte lu sont NOMMÉS, jamais reproduits ni paraphrasés,
      et le document le dit à l'endroit exact où le lecteur pourrait croire
      que l'application les connaît. La liste, pour ce fichier :
        - les articles 222-33 et 222-33-2 du CODE PÉNAL, dont L. 1153-5 et
          L. 1152-4 imposent pourtant d'afficher le TEXTE. C'est le manque le
          plus gênant du fichier, et le plus visible : le relais Légifrance du
          dépôt ne sert que le code du travail. L'affichage produit ici porte
          donc, à la place de ces deux textes, un emplacement réservé et la
          consigne d'aller les chercher, un affichage sans eux ne satisfait
          ni L. 1152-4 ni L. 1153-5 ;
        - L. 1121-2, auquel L. 1152-2 et L. 1153-2 renvoient pour désigner les
          mesures interdites contre la personne qui a subi, refusé de subir,
          relaté ou témoigné ;
        - L. 1142-2-1, qui définit l'agissement sexiste et auquel renvoie
          L. 4121-2, 7° ;
        - L. 1153-3, l'un des trois articles que vise la peine de L. 1155-2 ;
        - les articles 10-1, 12 à 13-1 de la loi n° 2016-1691 du 9 décembre
          2016, dont L. 1152-2 et L. 1153-2 étendent les protections ;
        - L. 4644-1 et L. 2312-9, nommés par L. 4121-3 ;
        - L. 2315-22-1 et L. 2315-32, nommés par L. 2315-18 et L. 2314-1 ;
          L. 2315-32, lui, est capté et se cite.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ, ET QUI NE
      VISE L'OBLIGATION EN CAUSE. Le périmètre a été revérifié pour ce fichier,
      et il est étroit :
        - L. 1155-2 punit « les faits de discriminations commis à la suite d'un
          harcèlement moral ou sexuel définis aux articles L. 1152-2, L. 1153-2
          et L. 1153-3 » : ce sont les REPRÉSAILLES, non l'organisation de la
          prévention. Il n'est invoqué qu'en HAR-05, et seulement au titre de
          la protection de la personne qui signale ou témoigne ;
        - L. 4741-1 ne rattrape rien ici : son énumération vise, pour le livre
          Ier de la quatrième partie, les « Titres Ier, III et IV », le titre
          II, où vivent L. 4121-1 et L. 4121-2, en est absent ; et les articles
          L. 1152 et L. 1153 relèvent de la PREMIÈRE partie du code, que cette
          énumération n'atteint pas davantage ;
        - R. 4741-3, quoique son objet, « les documents et affichages
          obligatoires », le laisse croire, a une énumération close
          (L. 4711-1 à L. 4711-5, D. 4711-1 à D. 4711-3) où l'affichage de
          L. 1153-5 ne figure pas. Il n'est invoqué nulle part ;
        - L. 2317-1 punit deux faits, et deux seulement : l'entrave à la
          constitution du comité ou à la libre désignation de ses MEMBRES, et
          l'entrave à son fonctionnement régulier. La désignation du référent
          de L. 2314-1 est le fait du COMITÉ, non de l'employeur : HAR-02
          n'annonce donc aucune peine.
      Partout ailleurs, ce qui se joue est civil : l'obligation de prévention
      de L. 1152-4 et L. 1153-5, l'obligation de sécurité de L. 4121-1, et ce
      que le juge du fond en tirera. Les documents le disent, plutôt que
      d'agiter une amende qui n'existe pas.

   3. LES FAITS NE S'INVENTENT JAMAIS, ET LES QUALIFICATIONS ENCORE MOINS.
      Le document à compléter n'écrit jamais ce qu'un salarié aurait fait ou
      subi : tout sort ENTRE CROCHETS, avec la consigne de l'écrire daté et
      circonstancié. L'exemple, lui, met en scène des personnes fictives, dans
      une entreprise fictive, et le bandeau qui l'ouvre le dit ; il n'emploie
      que les mots « faits signalés » et « faits allégués » tant que l'enquête
      n'est pas close, et son rapport ne conclut qu'après avoir entendu la
      personne mise en cause. La trame d'audition ne pose aucune question qui
      suppose les faits établis ; le rapport porte trois conclusions
      possibles, établis, non établis, éléments insuffisants, et le document à
      compléter n'en coche aucune.

   LES SEUILS NE SE SUPPOSENT PAS. Deux cent cinquante salariés pour le
   référent de l'employeur (L. 1153-5-1) : quand l'effectif n'est pas
   renseigné, aucun document ne tranche. Il expose les deux branches et laisse
   le lecteur porter son chiffre. L'exemple, lui, prend l'effectif de la
   fiche s'il est connu, celui de l'entreprise fictive sinon, et dit de quel
   côté du seuil il se trouve.                                             */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-sst-2.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  var GROS = "════════";
  function blocCoordonnees(ctx) { return tableauCoordonnees(ctx, null); }
  var TRAIT = "────────────────────────────────────────────────────────────────────────";

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE DATE

     Les mêmes que ceux de documents-sst.js et du module discipline, et pour la
     même raison : les dates du dossier sont des chaînes « AAAA-MM-JJ », lues
     en heure locale. Un midi UTC suffirait à décaler d'un jour l'affichage
     chez un lecteur situé assez à l'ouest, et un document daté du mauvais jour
     est pire qu'un document non daté.
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
  /* Une date du dossier, écrite en toutes lettres, ou son crochet. */
  function jour(iso, quoi) {
    var d = dateDe(iso);
    return d ? leJour(d) : "[" + (quoi || "date") + "]";
  }
  function aujourd(ctx) {
    return ctx && ctx.aujourdhui instanceof Date && !isNaN(ctx.aujourdhui.getTime())
      ? ctx.aujourdhui : new Date();
  }
  /* La date courte des tableaux, JJ/MM/AAAA. */
  function jj(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "[date]";
    var m = d.getMonth() + 1, j = d.getDate();
    return (j < 10 ? "0" + j : j) + "/" + (m < 10 ? "0" + m : m) + "/" + d.getFullYear();
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE TEXTE, D'EFFECTIF ET DE PROFIL
     ════════════════════════════════════════════════════════════════════════ */

  /* Ce que le dossier déclare, dit sans être interprété. */
  function etat(v, oui, non) {
    if (v === true || v === "oui") return oui;
    if (v === false || v === "non") return non;
    return "non renseigné, à vérifier sur la pièce elle-même";
  }
  function estOui(v) { return v === true || v === "oui"; }
  function estNon(v) { return v === false || v === "non"; }

  function nomDe(ctx) {
    var p = (ctx && ctx.profil) || {};
    return cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE");
  }
  function lieu(ctx) { return cro(((ctx && ctx.profil) || {}).ville, "lieu"); }
  function signataire(ctx) {
    return cro(((ctx && ctx.profil) || {}).responsable, "Nom et qualité du représentant légal");
  }
  function villeDe(ctx) {
    var p = (ctx && ctx.profil) || {};
    if (p.ville && String(p.ville).trim() !== "") return String(p.ville).trim();
    var m = String(p.adresse || "").match(/\d{5}\s+([^,;]+)$/);
    return m ? m[1].trim() : "[ville]";
  }

  /* Une valeur d'exemple, ou son crochet quand on écrit le document à
     compléter : la même fonction sert aux deux, pour que les deux aient
     exactement la même structure. */
  function X(ex, valeur, crochet) { return ex ? valeur : "[" + crochet + "]"; }

  /* L'effectif, lu au profil puis au dossier, et jamais deviné. Un effectif
     absent ne devient pas zéro : il reste inconnu, et tout ce qui dépend d'un
     seuil se dédouble. */
  function effectifDe(ctx) {
    var p = (ctx && ctx.profil) || {}, f = (ctx && ctx.fiche) || {};
    var v = p.effectif != null && p.effectif !== "" ? p.effectif
          : (f.effectif != null && f.effectif !== "" ? f.effectif : null);
    if (v === null) return { connu: false, n: null };
    var n = Number(v);
    if (!isFinite(n)) return { connu: false, n: null };
    return { connu: true, n: n };
  }

  /* Un seuil, dit dans les trois états possibles : atteint, non atteint, ou
     inconnu. Aucun document n'a le droit de conclure sur le troisième. */
  function seuil(ctx, n) {
    var e = effectifDe(ctx);
    if (!e.connu) return null;
    return e.n >= n;
  }
  function ligneEffectif(ctx) {
    var e = effectifDe(ctx);
    return e.connu ? "Effectif déclaré : " + e.n + " salariés."
                   : "Effectif : [EFFECTIF DE L'ENTREPRISE, non renseigné]. Le seuil de " +
                     "deux cent cinquante salariés de L. 1153-5-1 en dépend : portez-le " +
                     "avant de choisir une branche.";
  }

  /* LES TABLEAUX. Une ligne par rangée, cellules séparées par une barre
     verticale, la première ligne étant l'en-tête : feuille-doc.js rend ces
     lignes en vrai tableau à l'écran, en tableau Word bordé et en feuille
     Excel. Plus de texte à chasse fixe, plus de crochets pointillés pour
     figurer une colonne. Demande du 9 septembre 2026. */
  function rangee(cellules) { return cellules.join(" | "); }
  /* Une rangée vide garde une barre à chaque bout pour que la feuille la
     reconnaisse comme une ligne de tableau même à deux colonnes. */
  function rangeeVide(nb) {
    var c = [];
    for (var i = 0; i < nb; i++) c.push(" ");
    return "|" + c.join("|") + "|";
  }
  function tableau(entete, lignes) {
    var L = [rangee(entete)];
    (lignes || []).forEach(function (l) { L.push(rangee(l)); });
    L.push("");
    return L;
  }
  function tableauVide(entete, nbLignes) {
    var L = [rangee(entete)];
    for (var i = 0; i < (nbLignes || 3); i++) L.push(rangeeVide(entete.length));
    L.push("");
    return L;
  }

  /* Le pied commun : d'où vient ce qui est écrit, et ce que le document ne
     dit pas. */
  function pied(articles, notes) {
    var L = ["", TRAIT, ""];
    L.push("Fondement : " + articles + ".");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur");
    L.push("identifiant de version dans moteur/sst/textes-sst.json.");
    if (notes && notes.length) { L.push(""); notes.forEach(function (n) { L.push(n); }); }
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords, votre règlement intérieur et les textes propres à votre activité");
    L.push("peuvent ajouter des exigences que l'application ne lit pas. Ne laissez");
    L.push("aucun crochet dans le texte que vous adoptez, affichez ou transmettez.");
    return L;
  }

  /* L'avertissement qui revient partout où l'application NOMME un article
     qu'elle n'a pas lu. Il est écrit à l'endroit du renvoi, jamais relégué en
     note de bas de page : c'est là que le lecteur pourrait croire que
     l'application connaît le texte. */
  function blocRenvoi(articles, quoi) {
    return [
      "[ARTICLE NON LU PAR L'APPLICATION, " + articles + " " +
        (quoi || "est nommé ici parce qu'un texte lu y renvoie") + ".",
      " L'application ne l'a pas capté et n'en reproduit donc pas le contenu.",
      " Allez le lire avant de vous en servir.]",
      "",
    ];
  }

  /* Les deux articles du code pénal que l'affichage doit porter. Le relais
     Légifrance du dépôt ne sert que le code du travail : le bloc est écrit une
     fois, et repris partout où l'un des deux textes est en cause. Dans
     l'exemple, la même place est tenue par une phrase sans crochet qui dit
     ce qui y est recopié. */
  function blocCodePenal(E, lesquels) {
    if (E) return [
      "Texte de " + lesquels + ", recopié ici en entier dans sa version en vigueur",
      "au " + jj(E.d0) + ", date notée sur le support. L'application ne lit que le code",
      "du travail : elle ne le reproduit pas, et l'exemple ne l'invente pas.",
      "",
    ];
    return [
      "[TEXTE À REPORTER, " + lesquels + ".",
      " L'application ne lit que le CODE DU TRAVAIL : elle n'a pas capté ces",
      " articles du CODE PÉNAL et ne les reproduit donc pas. Or c'est bien LEUR",
      " TEXTE que L. 1152-4 et L. 1153-5 obligent à porter à la connaissance des",
      " salariés, non leur numéro, ni un résumé. Recopiez-les intégralement,",
      " dans leur version en vigueur au jour de l'affichage, et notez cette date",
      " sur le support : ces articles ont été modifiés plusieurs fois.]",
      "",
    ];
  }

  /* L'en-tête d'un courrier : qui écrit, à qui, d'où, quand. E est
     l'entreprise de l'exemple, ou nul pour le document à compléter. */
  function teteLettre(ctx, E, destinataire, recommande, dateLettre) {
    var p = (ctx && ctx.profil) || {};
    var L = [E ? E.nom : nomDe(ctx), E ? E.adresse : cro(p.adresse, "adresse du siège"), ""];
    (destinataire || []).forEach(function (x) { L.push(x); });
    L.push("");
    L.push((E ? E.ville : lieu(ctx)) + ", le " + leJour(dateLettre || aujourd(ctx)));
    L.push("");
    if (recommande) {
      L.push("Lettre recommandée avec demande d'avis de réception, ou remise en main");
      L.push("propre contre récépissé daté et signé");
      L.push("");
    }
    return L;
  }

  function formulePolitesse(ctx, E, appel) {
    return [
      "Je vous prie d'agréer, " + (appel || "Madame, Monsieur") + ", l'expression de ma",
      "considération distinguée.",
      "",
      E ? E.signataire : signataire(ctx),
      "",
    ];
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES ENTREPRISES DE L'EXEMPLE, UNE PAR SECTEUR

     Les mêmes entreprises fictives que celles de documents-sst.js, pour que
     le document unique et son volet harcèlement parlent de la même maison.
     Les personnes, les adresses et les numéros sont inventés ; les numéros
     d'appel sont pris dans les tranches que l'autorité des télécommunications
     réserve aux œuvres de fiction. Le Défenseur des droits a été relevé sur
     son site le 9 septembre 2026, c'est la seule coordonnée réelle.

     Ce que chaque secteur porte : l'entreprise, ses signataires, les
     interlocuteurs de D. 1151-1, les lieux d'affichage, les unités de travail
     exposées au harcèlement (grille à six colonnes du volet du document
     unique) et un signalement fictif, pour l'exemple de HAR-05, écrit en
     « faits signalés » et jamais qualifié avant la clôture.
     ════════════════════════════════════════════════════════════════════════ */
  var DDD = { nom: "Défenseur des droits", adresse: "Libre réponse 71120, 75342 Paris Cedex 07", tel: "09 69 39 00 00" };
  var CSE_EX = {
    secretaire: "Monsieur Marc TISSIER, secrétaire du comité",
    referent: "Madame Julie ROUX", qualite: "membre titulaire", college: "1er collège",
    membres: 4, presents: 4,
  };

  var EXEMPLES = {
    "transport et logistique": {
      nom: "TRANSPORTS EXEMPLE SARL", adresse: "ZA des Chênes, 14 rue du Fret, 77400 Lagny-sur-Marne",
      siret: "812 345 678 00019", ville: "Lagny-sur-Marne", effectif: 34, femmes: 6,
      activite: "messagerie, transport routier de marchandises et garage mécanique",
      signataire: "Monsieur Éric DUVAL, gérant",
      recoit: "Madame Nadia FERRAND, responsable d'exploitation",
      remplacant: "Monsieur Éric DUVAL, gérant",
      referent: { nom: "Madame Claire BONNET", fonction: "assistante de direction", service: "bureau d'exploitation, dépôt de Lagny-sur-Marne",
        adresse: "bureau de l'étage du dépôt, 14 rue du Fret, 77400 Lagny-sur-Marne, et referent@transports-exemple.example", tel: "01 99 00 12 34",
        temps: "quatre heures par mois", formation: "deux jours, « prévenir et traiter le harcèlement sexuel et les agissements sexistes », organisme de formation interprofessionnel de Seine-et-Marne",
        lieuReception: "salle de réunion de l'étage, porte fermée, hors de la vue du quai" },
      cseAdresse: "local du comité, rez-de-chaussée du dépôt", cseTel: "01 99 00 12 35",
      spst: { nom: "SPSTI de Seine-et-Marne, antenne de Lagny", adresse: "6 rue de l'Industrie, 77400 Lagny-sur-Marne", tel: "01 99 00 45 67", medecin: "Docteur Sylvie MARTEAU, médecin du travail" },
      inspection: { nom: "Inspection du travail, unité de contrôle de Seine-et-Marne nord", adresse: "cité administrative, 77000 Melun", tel: "01 99 00 78 90", inspecteur: "Madame Isabelle PONS, inspectrice du travail" },
      lieux: ["quai de chargement, panneau à côté de la pointeuse", "atelier mécanique, porte du bureau du chef d'atelier", "porte du bureau d'exploitation, où se font les entretiens d'embauche"],
      encadrement: "chef de quai, chef d'atelier, responsable d'exploitation",
      unites: [
        ["Tournées VL et PL", "11 conducteurs dont 4 femmes, seuls toute la journée, contacts avec les clients et avec les chauffeurs d'autres entreprises sur les aires", "téléphone professionnel", "consigne écrite en cas de propos ou de gestes déplacés d'un client, débriefing sous 48 heures, signalement consigné", 2, "responsable d'exploitation, Mme Nadia FERRAND"],
        ["Quai de chargement", "10 salariés sous un seul chef de quai qui fait les plannings et les évaluations, 2 femmes, intérimaires fréquents", "aucune", "second regard du responsable d'exploitation sur les plannings et les évaluations, accueil des intérimaires avec remise de la procédure", 3, "gérant, M. Éric DUVAL"],
        ["Atelier mécanique", "3 salariés, travail en soirée jusqu'à 20 heures sans témoin, apprenti de 17 ans", "aucune", "point mensuel avec l'apprenti hors de la présence du chef d'atelier, procédure remise au maître d'apprentissage", 2, "gérant, M. Éric DUVAL"],
        ["Bureau d'exploitation", "4 salariés, appels tendus avec les chauffeurs et les clients, surcharge de novembre à décembre", "aucune", "droit de transférer un appel devenu insultant, main courante relue chaque mois, formation de l'encadrement", 3, "gérant, M. Éric DUVAL"],
      ],
      signalement: {
        auteur: "Madame Sonia PETIT", auteurQualite: "conductrice VL, tournée est", auteurF: true,
        cause: "Monsieur Alain ROCHER", causeQualite: "chef d'équipe au quai de chargement",
        temoins: ["Madame Léa COSTA, agente de quai", "Monsieur Yanis BRUN, conducteur VL"],
        unite: "quai de chargement, au chargement des tournées, entre 6 h 15 et 6 h 45",
        faits: [
          "remarques répétées sur sa tenue au chargement de sa tournée, les D28, D21 et D14 vers 6 h 30, devant l'équipe du quai",
          "message envoyé sur son téléphone personnel le D13 à 22 h 14, sans aucun motif de service",
          "tournée est réattribuée à un collègue le D9, au lendemain du jour où elle a demandé que cela cesse",
        ],
        mesure: "chargement de la tournée de Mme PETIT confié au chef de quai, M. Karim BELAÏD, jusqu'à la clôture ; M. ROCHER affecté au quai de l'après-midi, ses horaires ne croisant plus ceux de Mme PETIT ; Mme PETIT garde sa tournée est, à sa demande",
        enqueteurs: ["Madame Nadia FERRAND, responsable d'exploitation", "Monsieur Pascal MOREL, chef d'atelier, extérieur au quai"],
        pieces: "relevé des tournées du D28 au D9, copie du message du D13, planning du quai",
        reponsesCause: ["reconnaît des remarques sur la tenue, qu'il dit « pour rire » et sans intention de blesser", "reconnaît l'envoi du message, dit avoir voulu prévenir d'un changement d'horaire, ne peut pas expliquer le contenu ni l'heure", "conteste : la tournée est aurait été réattribuée pour équilibrer les kilomètres, sur sa seule décision"],
        temoin1: "a entendu les remarques sur la tenue les D21 et D14, devant l'équipe ; les trouve déplacées ; n'a rien vu d'autre",
        temoin2: "a vu Mme PETIT bouleversée le D13 au soir et a lu le message sur son téléphone ; a entendu M. ROCHER dire le D9 qu'elle « n'avait qu'à être moins compliquée »",
        conclusions: ["établi : propos reconnus, deux témoins concordants sur les dates", "établi : message produit, envoi reconnu, contenu sans rapport avec le service", "non établi : la réattribution est établie, sa cause ne l'est pas ; le motif d'organisation invoqué n'est pas exclu par les pièces"],
        organisation: "affectation des tournées décidée par la responsable d'exploitation sur un tableau partagé ; consigne écrite sur l'usage des téléphones personnels ; formation de l'encadrement du quai",
      },
    },

    "industrie": {
      nom: "MÉCA EXEMPLE SAS", adresse: "ZI de la Plaine, 8 avenue des Forges, 42000 Saint-Étienne",
      siret: "823 456 789 00027", ville: "Saint-Étienne", effectif: 58, femmes: 9,
      activite: "découpe, emboutissage et assemblage de pièces métalliques",
      signataire: "Madame Hélène ROCHE, présidente",
      recoit: "Madame Claire VIDAL, responsable administratif",
      remplacant: "Madame Hélène ROCHE, présidente",
      referent: { nom: "Madame Sonia DIALLO", fonction: "responsable logistique", service: "bâtiment B, magasin",
        adresse: "bureau du magasin, bâtiment B, 8 avenue des Forges, 42000 Saint-Étienne, et referent@meca-exemple.example", tel: "04 65 71 20 21",
        temps: "une demi-journée par mois", formation: "deux jours, « référent harcèlement sexuel et agissements sexistes », organisme de formation de la métallurgie de la Loire",
        lieuReception: "bureau du magasin, porte fermée, ou salle de réunion du bâtiment A sur rendez-vous" },
      cseAdresse: "local du comité, bâtiment A, rez-de-chaussée", cseTel: "04 65 71 20 22",
      spst: { nom: "SPSTI Loire, antenne de Saint-Étienne", adresse: "12 rue des Aciéries, 42000 Saint-Étienne", tel: "04 65 71 20 30", medecin: "Docteur Paul GERMAIN, médecin du travail" },
      inspection: { nom: "Inspection du travail, unité de contrôle de la Loire sud", adresse: "cité administrative, 42000 Saint-Étienne", tel: "04 65 71 40 50", inspecteur: "Monsieur Denis FAVRE, inspecteur du travail" },
      lieux: ["vestiaires de l'atelier A", "panneau du réfectoire", "hall d'accueil du bâtiment A, où se font les entretiens d'embauche"],
      encadrement: "chefs d'équipe des trois postes, responsable de production, responsable maintenance",
      unites: [
        ["Ligne de production", "17 opérateurs en 3 x 8 dont 2 femmes, équipe de nuit de 6 sans encadrement de direction présent", "référent du comité désigné", "chef d'équipe de nuit formé, procédure affichée au poste, tout signalement traité sous 48 heures", 2, "présidente, Mme Hélène ROCHE"],
        ["Maintenance", "3 techniciens, astreinte du week-end seul, interventions de nuit sur la ligne", "aucune", "rappel du règlement intérieur, point trimestriel avec le responsable maintenance", 3, "responsable maintenance, M. Yann LE GALL"],
        ["Magasin et manutention", "6 salariés, intérimaires et jeunes embauchés, un seul responsable pour les plannings", "aucune", "second regard sur les plannings, accueil des intérimaires avec remise de la procédure", 3, "responsable logistique, Mme Sonia DIALLO"],
        ["Laboratoire et bureaux", "11 salariés, 2 salariées seules au laboratoire en fin de poste, réorganisation des méthodes en cours", "aucune", "porte ouverte sur l'atelier en fin de poste, entretien avec chaque salarié pendant la réorganisation", 3, "présidente, Mme Hélène ROCHE"],
      ],
      signalement: {
        auteur: "Madame Laura MENDES", auteurQualite: "opératrice sur la ligne de production, équipe de nuit", auteurF: true,
        cause: "Monsieur Bruno CASTEL", causeQualite: "chef d'équipe de nuit",
        temoins: ["Monsieur Ahmed SAHRAOUI, opérateur", "Madame Nadège BRUN, opératrice"],
        unite: "atelier A, ligne de production, équipe de nuit",
        faits: [
          "propos sur son physique à chaque prise de poste, du D40 au D12, devant l'équipe",
          "main posée sur l'épaule et le bas du dos à trois reprises, les D25, D18 et D12, au poste de découpe",
          "affectation au poste le plus bruyant pendant deux semaines à partir du D11, au lendemain du jour où elle a demandé que cela cesse",
        ],
        mesure: "M. CASTEL affecté à l'équipe du matin jusqu'à la clôture, sans autorité sur l'équipe de nuit ; Mme MENDES maintenue à son poste et à ses horaires, à sa demande, sous la responsabilité directe du responsable de production",
        enqueteurs: ["Madame Claire VIDAL, responsable administratif", "Madame Inès BARBIER, responsable qualité, extérieure à l'atelier"],
        pieces: "plannings de l'équipe de nuit du D40 au D9, fiche d'affectation du D11, relevé de pointage",
        reponsesCause: ["reconnaît des « compliments », conteste qu'ils aient été quotidiens", "conteste tout geste, dit avoir pu la toucher « en passant » dans l'allée étroite de la découpe", "reconnaît l'affectation, l'explique par l'absence d'un opérateur, produit le planning"],
        temoin1: "a entendu les propos à la prise de poste « presque chaque nuit » depuis l'été ; a vu la main sur le bas du dos le D18, au poste de découpe",
        temoin2: "a entendu Mme MENDES demander le D12 que cela cesse ; a constaté l'affectation au poste bruyant dès la nuit suivante, alors qu'un autre opérateur y était prévu",
        conclusions: ["établi : propos reconnus en partie, deux témoins concordants sur la répétition", "établi pour le D18, vu par un témoin ; les D25 et D12 reposent sur le seul récit de la personne qui a signalé", "non établi : l'affectation est établie, le planning produit rend le motif d'organisation possible ; un témoin la lie à la demande du D12, sans autre élément"],
        organisation: "affectations de nuit validées chaque semaine par le responsable de production ; allée de la découpe élargie ; formation des chefs d'équipe des trois postes",
      },
    },

    "bâtiment et travaux publics": {
      nom: "BÂTI EXEMPLE SARL", adresse: "3 chemin des Carrières, 33700 Mérignac",
      siret: "834 567 890 00035", ville: "Mérignac", effectif: 27, femmes: 2,
      activite: "gros œuvre, second œuvre et terrassement",
      signataire: "Monsieur Paul LAMBERT, gérant",
      recoit: "Monsieur Rachid AMRANI, conducteur de travaux",
      remplacant: "Monsieur Paul LAMBERT, gérant",
      referent: { nom: "Madame Nathalie SORIN", fonction: "assistante de gestion", service: "bureaux du dépôt de Mérignac",
        adresse: "bureau du dépôt, 3 chemin des Carrières, 33700 Mérignac, et referent@bati-exemple.example", tel: "05 36 49 10 11",
        temps: "trois heures par mois, et le temps des rendez-vous", formation: "deux jours, « prévenir le harcèlement sexuel et les agissements sexistes sur les chantiers », organisme de prévention du bâtiment",
        lieuReception: "bureau du dépôt, porte fermée, ou sur le chantier dans le bungalow de réunion, à la demande de la personne" },
      cseAdresse: "vestiaires du dépôt, casier du comité", cseTel: "05 36 49 10 12",
      spst: { nom: "Service de santé au travail du BTP de la Gironde", adresse: "18 avenue de la Pelouse, 33700 Mérignac", tel: "05 36 49 10 20", medecin: "Docteur Anne RIVAL, médecin du travail" },
      inspection: { nom: "Inspection du travail, unité de contrôle de la Gironde ouest", adresse: "immeuble administratif, 33000 Bordeaux", tel: "05 36 49 30 40", inspecteur: "Madame Hélène CARRÉ, inspectrice du travail" },
      lieux: ["base vie de chaque chantier, bungalow réfectoire", "dépôt de Mérignac, vestiaires", "bureau du dépôt, où se font les entretiens d'embauche"],
      encadrement: "chefs de chantier, conducteur de travaux, chef d'atelier",
      unites: [
        ["Gros œuvre", "12 compagnons sur des chantiers éloignés du dépôt, 1 salariée, apprentis de 16 et 17 ans, coactivité avec d'autres entreprises", "aucune", "procédure affichée à la base vie, quart d'heure sécurité mensuel consacré au sujet, maître d'apprentissage formé", 2, "conducteur de travaux, M. Rachid AMRANI"],
        ["Second œuvre", "7 compagnons en binômes chez des clients particuliers, sans témoin", "téléphone", "consigne écrite en cas de propos ou de gestes déplacés d'un client, retrait autorisé, débriefing", 2, "conducteur de travaux, M. Rachid AMRANI"],
        ["Conduite d'engins et base vie", "5 salariés, un seul chef de chantier qui décide des affectations et des primes", "aucune", "second regard du gérant sur les affectations et les primes, entretien annuel par le conducteur de travaux", 3, "gérant, M. Paul LAMBERT"],
        ["Bureaux", "3 salariés dont 1 salariée, gérant seul décideur, tension aux réponses aux appels d'offres", "aucune", "référent désigné hors de la ligne hiérarchique, procédure remise", 3, "gérant, M. Paul LAMBERT"],
      ],
      signalement: {
        auteur: "Monsieur Kevin DORÉ", auteurQualite: "maçon, embauché depuis quatre mois", auteurF: false,
        cause: "Monsieur Serge VALLET", causeQualite: "chef d'équipe gros œuvre",
        temoins: ["Monsieur Ali MEZIANE, coffreur", "Madame Émilie NOËL, conductrice de minipelle"],
        unite: "chantier de la rue des Vignes, gros œuvre",
        faits: [
          "surnoms humiliants et moqueries devant l'équipe à chaque prise de poste, du D45 au D9",
          "affectation systématique aux tâches les plus pénibles et refus de pause le D20 et le D13, alors que le reste de l'équipe en prenait une",
          "menace, le D9, devant deux compagnons, de ne pas le garder à la fin du chantier s'il « continuait à se plaindre »",
        ],
        mesure: "M. DORÉ affecté au chantier du dépôt sous l'autorité directe du conducteur de travaux, à sa demande ; M. VALLET reste sur son chantier et ne participe plus à l'appréciation du travail de M. DORÉ",
        enqueteurs: ["Monsieur Rachid AMRANI, conducteur de travaux", "Monsieur Lucas PERRIN, chef d'atelier, extérieur au chantier"],
        pieces: "feuilles de pointage du chantier du D45 au D9, fiches d'affectation journalières, compte rendu du quart d'heure sécurité du D20",
        reponsesCause: ["reconnaît les surnoms, dit que « tout le monde en a un sur le chantier »", "conteste : les tâches sont réparties « selon les besoins », les pauses auraient été décalées pour tout le monde le D20 à cause d'une livraison", "conteste avoir menacé, dit avoir « rappelé les règles » devant l'équipe"],
        temoin1: "a entendu les surnoms tous les jours, dit qu'ils ne visaient que M. DORÉ ; a pris sa pause le D20 pendant que M. DORÉ continuait seul",
        temoin2: "a entendu le D9 la phrase sur la fin du chantier, la rapporte mot pour mot ; n'a pas vu les affectations",
        conclusions: ["établi : surnoms reconnus, un témoin dit qu'ils ne visaient que lui", "établi pour le D20, contredit par un témoin sur la pause « décalée pour tous » ; non établi pour le D13, aucun élément hors le récit", "établi : phrase rapportée mot pour mot par un témoin, « rappel des règles » non retenu au vu des termes"],
        organisation: "affectations journalières visées par le conducteur de travaux ; quart d'heure sécurité mensuel consacré au respect entre compagnons ; accueil des nouveaux embauchés par le conducteur de travaux",
      },
    },

    "commerce": {
      nom: "COMMERCE EXEMPLE SARL", adresse: "25 rue de la République, 69002 Lyon",
      siret: "845 678 901 00043", ville: "Lyon", effectif: 22, femmes: 14,
      activite: "commerce de détail, magasin de centre-ville avec réserve et livraison",
      signataire: "Madame Sophie LENOIR, gérante",
      recoit: "Madame Sophie LENOIR, gérante",
      remplacant: "Monsieur Antoine ROY, responsable réception",
      referent: { nom: "Madame Farida HADDAD", fonction: "comptable", service: "bureaux de l'entresol",
        adresse: "bureau de l'entresol, 25 rue de la République, 69002 Lyon, et referent@commerce-exemple.example", tel: "04 65 71 50 51",
        temps: "deux heures par mois, et le temps des rendez-vous", formation: "une journée, « harcèlement sexuel et agissements sexistes dans le commerce », organisme de formation de la branche",
        lieuReception: "bureau de l'entresol, porte fermée, hors des heures d'ouverture à la demande de la personne" },
      cseAdresse: "salle de pause, casier du comité", cseTel: "04 65 71 50 52",
      spst: { nom: "SPSTI du Rhône, centre de Lyon Bellecour", adresse: "20 rue de la Charité, 69002 Lyon", tel: "04 65 71 50 60", medecin: "Docteur Marc DUBOIS, médecin du travail" },
      inspection: { nom: "Inspection du travail, unité de contrôle de Lyon centre", adresse: "immeuble administratif, 69003 Lyon", tel: "04 65 71 70 80", inspecteur: "Monsieur Julien BLANC, inspecteur du travail" },
      lieux: ["réserve, panneau à côté de la pointeuse", "salle de pause", "bureau de l'entresol, où se font les entretiens d'embauche"],
      encadrement: "chef de rayon, responsable réception, gérante",
      unites: [
        ["Surface de vente", "9 vendeurs dont 6 femmes, contacts permanents avec la clientèle, fermeture à deux", "procédure d'appel du responsable", "consigne écrite face aux propos sexistes de clients, interruption de la vente autorisée, signalement consigné et relu chaque mois", 2, "gérante, Mme Sophie LENOIR"],
        ["Caisse", "5 salariées, seules le dimanche matin, un seul chef de rayon pour les plannings", "aucune", "second regard de la gérante sur les plannings, affichage à l'entrée du magasin, procédure remise", 2, "gérante, Mme Sophie LENOIR"],
        ["Réserve et livraison", "5 salariés, contacts avec les chauffeurs, livreurs seuls chez les clients, étudiants en contrat court", "téléphone", "consigne en cas de propos ou de gestes déplacés d'un client ou d'un chauffeur, retrait autorisé, débriefing", 2, "responsable réception, M. Antoine ROY"],
        ["Bureaux", "3 salariés, gérante seule décideuse, période des soldes et des inventaires", "aucune", "référent désigné hors de la ligne hiérarchique, formation de l'encadrement", 3, "gérante, Mme Sophie LENOIR"],
      ],
      signalement: {
        auteur: "Madame Inès CARON", auteurQualite: "hôtesse de caisse", auteurF: true,
        cause: "Monsieur Cédric LAMY", causeQualite: "chef de rayon, chargé des plannings de la caisse",
        temoins: ["Madame Clara MOREAU, vendeuse", "Monsieur Hugo FABRE, vendeur"],
        unite: "ligne de caisses et réserve, à la fermeture du magasin",
        faits: [
          "plaisanteries à connotation sexuelle à la fermeture de caisse, les D30, D23 et D16, devant les vendeurs",
          "insistance répétée pour un rendez-vous hors du magasin, par messages les D21 et D14, après un premier refus",
          "planning modifié le D10 pour la mettre en fermeture seule avec lui, au lendemain de son second refus",
        ],
        mesure: "fermetures de Mme CARON planifiées avec la gérante ou le responsable réception jusqu'à la clôture ; M. LAMY retiré de l'établissement des plannings de la caisse ; Mme CARON garde ses horaires, à sa demande",
        enqueteurs: ["Madame Sophie LENOIR, gérante", "Monsieur Antoine ROY, responsable réception, extérieur à la surface de vente"],
        pieces: "plannings de la caisse du D30 au D9, copies des messages des D21 et D14, main courante du magasin",
        reponsesCause: ["reconnaît des plaisanteries « de fin de journée », conteste leur connotation", "reconnaît les deux messages, dit avoir compris le premier refus comme une hésitation", "conteste : le planning du D10 aurait été fait « au hasard des disponibilités »"],
        temoin1: "a entendu les plaisanteries les D30 et D16, les a trouvées gênantes, a vu Mme CARON quitter la caisse le D16 sans répondre",
        temoin2: "a vu le planning du D10 affiché, a remarqué que Mme CARON était seule en fermeture avec M. LAMY pour la première fois",
        conclusions: ["établi : propos reconnus, un témoin concordant sur deux dates et sur leur nature", "établi : messages produits, envoi reconnu, second message postérieur à un refus écrit", "non établi : le planning est établi, sa cause ne l'est pas ; le motif de disponibilité n'est pas exclu"],
        organisation: "plannings de la caisse établis par la gérante ; fermetures toujours à deux personnes, jamais un responsable seul avec un salarié qu'il évalue ; formation de l'encadrement",
      },
    },

    "services": {
      nom: "SERVICES EXEMPLE SAS", adresse: "10 boulevard Haussmann, 75009 Paris",
      siret: "856 789 012 00051", ville: "Paris", effectif: 31, femmes: 19,
      activite: "conseil et prestations administratives, accueil du public, télétravail deux jours par semaine",
      signataire: "Madame Anne MERCIER, présidente",
      recoit: "Madame Camille VIDAL, responsable administrative",
      remplacant: "Madame Anne MERCIER, présidente",
      referent: { nom: "Madame Élise RENARD", fonction: "chargée des ressources humaines", service: "siège, 3e étage",
        adresse: "bureau 3.12, 10 boulevard Haussmann, 75009 Paris, et referent@services-exemple.example", tel: "01 99 00 60 61",
        temps: "une demi-journée par mois", formation: "deux jours, « référent harcèlement sexuel et agissements sexistes », organisme de formation interprofessionnel",
        lieuReception: "salle de réunion du 3e étage, réservée sous un intitulé neutre, ou en visioconférence pour les salariés en télétravail" },
      cseAdresse: "local du comité, 3e étage, bureau 3.02", cseTel: "01 99 00 60 62",
      spst: { nom: "SPSTI de Paris, centre Haussmann", adresse: "5 rue de Provence, 75009 Paris", tel: "01 99 00 60 70", medecin: "Docteur Claire NOUAILLES, médecin du travail" },
      inspection: { nom: "Inspection du travail, unité de contrôle de Paris 9e", adresse: "cité administrative, 75019 Paris", tel: "01 99 00 80 90", inspecteur: "Madame Sarah LEVY, inspectrice du travail" },
      lieux: ["3e étage, panneau à côté de la machine à café", "hall d'accueil du rez-de-chaussée, où se font les entretiens d'embauche", "intranet, page « prévention », consultée depuis le domicile en télétravail"],
      encadrement: "responsables d'équipe, responsable d'agence, responsable administrative",
      unites: [
        ["Bureaux et écrans", "18 salariés en open space dont 12 femmes, responsables d'équipe qui évaluent et répartissent les missions, pics de clôture", "référent du comité désigné", "formation des responsables d'équipe, procédure affichée, enquête écrite sous huit jours", 2, "présidente, Mme Anne MERCIER"],
        ["Accueil du public", "2 salariées seules au comptoir en début et en fin de journée, public parfois agressif", "aucune", "consigne écrite face aux propos sexistes ou insultants du public, bouton d'appel, main courante relue chaque mois", 2, "responsable administrative, Mme Camille VIDAL"],
        ["Déplacements et clients", "6 consultants seuls chez les clients, 3 nuits par mois en déplacement, rendez-vous sensibles", "aucune", "consigne de retrait chez un client, rendez-vous sensibles à deux, débriefing sous 48 heures", 2, "responsable d'agence, M. Nicolas FAURE"],
        ["Télétravail", "12 salariés deux jours par semaine, échanges par messagerie sans témoin, sur-connexion", "charte", "règles d'usage de la messagerie écrites, signalement possible par courriel dédié, point d'équipe hebdomadaire en présence", 3, "présidente, Mme Anne MERCIER"],
        ["Entretien des locaux", "2 salariées en soirée, seules dans les étages", "téléphone", "procédure remise en main propre, coordonnées du référent enregistrées sur le téléphone professionnel", 2, "responsable administrative, Mme Camille VIDAL"],
      ],
      signalement: {
        auteur: "Madame Chloé BERNARD", auteurQualite: "consultante", auteurF: true,
        cause: "Monsieur Olivier MARTIN", causeQualite: "responsable d'équipe",
        temoins: ["Monsieur Théo LAMBERT, consultant", "Madame Aurélie GIRAUD, assistante"],
        unite: "3e étage, open space, et messagerie interne",
        faits: [
          "messages sur la messagerie interne le soir et le week-end, à contenu personnel et insistant, du D50 au D12",
          "commentaires sur sa tenue en réunion d'équipe les D27 et D13, devant l'équipe",
          "retrait de la mission Durand le D9, au lendemain de son refus d'un dîner",
        ],
        mesure: "Mme BERNARD rattachée à M. Nicolas FAURE, responsable d'agence, pour ses missions jusqu'à la clôture, à sa demande ; M. MARTIN n'évalue plus ses travaux et ne lui adresse plus de message hors de la présence d'un tiers",
        enqueteurs: ["Madame Camille VIDAL, responsable administrative", "Monsieur Nicolas FAURE, responsable d'agence, extérieur à l'équipe"],
        pieces: "export de la messagerie interne du D50 au D12, comptes rendus des réunions d'équipe des D27 et D13, courriel de retrait de mission du D9",
        reponsesCause: ["reconnaît les messages, les dit « amicaux », conteste qu'ils aient été insistants", "conteste des commentaires sur la tenue, dit avoir parlé « du code vestimentaire client »", "conteste tout lien : la mission Durand aurait été retirée pour une raison de planning, sur demande du client"],
        temoin1: "a entendu les commentaires le D27, en réunion, les a trouvés déplacés ; a reçu de Mme BERNARD, le D26, une capture des messages du week-end",
        temoin2: "a préparé le courriel de retrait de mission le D9 à la demande de M. MARTIN ; n'a pas connaissance d'une demande du client",
        conclusions: ["établi : messages produits, envoi reconnu, fréquence et horaires sans rapport avec le service", "établi pour le D27, un témoin concordant ; non établi pour le D13, aucun élément hors le récit", "non établi : le retrait est établi, la demande du client n'a pas été retrouvée, mais le lien avec le refus n'est pas établi par un élément extérieur au récit"],
        organisation: "règles d'usage de la messagerie interne écrites, aucun message hors plage sans motif de service ; attribution et retrait des missions validés par la responsable d'agence ; formation des responsables d'équipe",
      },
    },
  };

  function secteurDe(ctx) {
    var s = String(((ctx && ctx.profil) || {}).secteur || "").trim().toLowerCase();
    return EXEMPLES[s] ? s : "services";
  }
  /* L'entreprise de l'exemple : celle du profil quand il en donne une, la
     fictive du secteur sinon. Les dates se comptent depuis aujourd'hui, et
     les « D28 » des faits signalés deviennent des dates réelles, vingt-huit
     jours avant aujourd'hui. */
  function exempleDe(ctx) {
    var s = secteurDe(ctx), p = (ctx && ctx.profil) || {}, M = EXEMPLES[s];
    var e = effectifDe(ctx), d0 = aujourd(ctx);
    var ville = villeDe(ctx);
    var ex = {
      secteur: s, activite: M.activite,
      nom: String(p.denomination || p.entreprise || "").trim() || M.nom,
      adresse: String(p.adresse || "").trim() || M.adresse,
      siret: String(p.siret || "").trim() || M.siret,
      ville: ville === "[ville]" ? M.ville : ville,
      effectif: e.connu ? e.n : M.effectif, femmes: M.femmes,
      signataire: String(p.responsable || "").trim() || M.signataire,
      recoit: M.recoit, remplacant: M.remplacant, referent: M.referent,
      cse: CSE_EX, cseAdresse: M.cseAdresse, cseTel: M.cseTel,
      spst: M.spst, inspection: M.inspection, lieux: M.lieux, encadrement: M.encadrement,
      unites: M.unites, signalement: M.signalement, d0: d0,
    };
    ex.au250 = ex.effectif >= 250;
    ex.date = function (n) { return jj(dans(d0, n)); };
    ex.lettres = function (n) { return leJour(dans(d0, n)); };
    /* « D28 » dans un fait signalé : vingt-huit jours avant aujourd'hui. */
    ex.dater = function (texte) {
      return String(texte).replace(/\bD(\d+)\b/g, function (m, n) { return jj(dans(d0, -Number(n))); });
    };
    /* La grille du volet harcèlement du document unique, six colonnes. */
    ex.grille = function () {
      return M.unites.map(function (u) {
        return [u[0], u[1], u[2], u[3], ex.date(u[4] * 30), u[5]];
      });
    };
    return ex;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES BLOCS COMMUNS AUX CINQ DOCUMENTS
     ════════════════════════════════════════════════════════════════════════ */

  /* Les définitions, telles que les textes lus les écrivent. Elles reviennent
     dans l'affichage, dans la procédure et dans les règles, et il n'y en a
     qu'une version, pour qu'un salarié qui lit l'affichage et un enquêteur
     qui lit la trame ne travaillent pas sur deux définitions différentes. */
  function blocDefinitions(E) {
    var L = [
      "LE HARCÈLEMENT MORAL (L. 1152-1)",
      "",
      "« Aucun salarié ne doit subir les agissements répétés de harcèlement moral",
      "qui ont pour objet ou pour effet une dégradation de ses conditions de travail",
      "susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa",
      "santé physique ou mentale ou de compromettre son avenir professionnel. »",
      "",
      "LE HARCÈLEMENT SEXUEL (L. 1153-1)",
      "",
      "« Aucun salarié ne doit subir des faits :",
      "1° Soit de harcèlement sexuel, constitué par des propos ou comportements à",
      "connotation sexuelle ou sexiste répétés qui soit portent atteinte à sa dignité",
      "en raison de leur caractère dégradant ou humiliant, soit créent à son encontre",
      "une situation intimidante, hostile ou offensante ;",
      "Le harcèlement sexuel est également constitué :",
      "a) Lorsqu'un même salarié subit de tels propos ou comportements venant de",
      "plusieurs personnes, de manière concertée ou à l'instigation de l'une d'elles,",
      "alors même que chacune de ces personnes n'a pas agi de façon répétée ;",
      "b) Lorsqu'un même salarié subit de tels propos ou comportements,",
      "successivement, venant de plusieurs personnes qui, même en l'absence de",
      "concertation, savent que ces propos ou comportements caractérisent une",
      "répétition ;",
      "2° Soit assimilés au harcèlement sexuel, consistant en toute forme de pression",
      "grave, même non répétée, exercée dans le but réel ou apparent d'obtenir un",
      "acte de nature sexuelle, que celui-ci soit recherché au profit de l'auteur des",
      "faits ou au profit d'un tiers. »",
      "",
      "L'AGISSEMENT SEXISTE",
      "",
    ];
    if (E) {
      L.push("Texte de l'article L. 1142-2-1 du code du travail, qui définit l'agissement");
      L.push("sexiste, recopié ici en entier (l'application ne l'a pas lu et ne le");
      L.push("reproduit pas).");
      L.push("");
      return L;
    }
    return L.concat(blocRenvoi("L. 1142-2-1",
      "définit l'agissement sexiste, et L. 4121-2, 7°, y renvoie expressément"));
  }

  /* La protection de celui qui parle, dans les mots des deux articles. Elle
     est rappelée dans l'affichage, dans la procédure et dans chaque courrier :
     un salarié qui ne la connaît pas ne signale pas. */
  function blocProtection(E) {
    var L = [
      "LA PROTECTION DE CELUI QUI SUBIT, REFUSE, RELATE OU TÉMOIGNE",
      "",
      "« Aucune personne ayant subi ou refusé de subir des agissements répétés de",
      "harcèlement moral ou ayant, de bonne foi, relaté ou témoigné de tels",
      "agissements ne peut faire l'objet des mesures mentionnées à l'article",
      "L. 1121-2 » (L. 1152-2).",
      "",
      "« Aucune personne ayant subi ou refusé de subir des faits de harcèlement",
      "sexuel définis à l'article L. 1153-1, y compris, dans le cas mentionné au 1°",
      "du même article L. 1153-1, si les propos ou comportements n'ont pas été",
      "répétés, ou ayant, de bonne foi, témoigné de faits de harcèlement sexuel ou",
      "relaté de tels faits ne peut faire l'objet des mesures mentionnées à l'article",
      "L. 1121-2 » (L. 1153-2).",
      "",
      "Les deux articles ajoutent que ces personnes « bénéficient des protections",
      "prévues aux I et III de l'article 10-1 et aux articles 12 à 13-1 de la loi",
      "n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre",
      "la corruption et à la modernisation de la vie économique ».",
      "",
    ];
    if (E) return L;
    return L.concat(blocRenvoi("L. 1121-2",
      "porte la liste des mesures interdites, à laquelle L. 1152-2 et L. 1153-2 " +
      "renvoient l'une et l'autre ; c'est lui qui dit ce qui ne peut pas être fait " +
      "à la personne protégée"))
     .concat(blocRenvoi("les articles 10-1, 12 à 13-1 de la loi n° 2016-1691 du 9 décembre 2016",
      "sont nommés par L. 1152-2 et L. 1153-2, mais ne sont pas au code du travail : " +
      "le relais de l'application ne sert que ce code"));
  }

  /* Le rappel court de la protection, tel qu'il se met dans un courrier. */
  function rappelProtection() {
    return [
      "Il est rappelé qu'aucune personne ayant subi ou refusé de subir des faits",
      "de harcèlement, ni celle qui, de bonne foi, les a relatés ou en a témoigné,",
      "ne peut faire l'objet des mesures mentionnées à l'article L. 1121-2 du code",
      "du travail (L. 1152-2 ; L. 1153-2).",
    ];
  }

  /* Les trois obligations de l'employeur, dans les mots des textes lus. C'est
     le socle des règles de HAR-04 et de HAR-05 : prévenir, mettre un terme,
     sanctionner. */
  function blocTroisTemps() {
    return [
      "LES TROIS TEMPS QUE LA LOI IMPOSE, ET QU'ON NE PEUT PAS INTERVERTIR",
      "",
      "« L'employeur prend toutes dispositions nécessaires en vue de prévenir les",
      "agissements de harcèlement moral » (L. 1152-4, première phrase).",
      "",
      "« L'employeur prend toutes dispositions nécessaires en vue de prévenir les",
      "faits de harcèlement sexuel, d'y mettre un terme et de les sanctionner »",
      "(L. 1153-5, premier alinéa).",
      "",
      "Sur le harcèlement sexuel, le texte énonce donc TROIS obligations distinctes :",
      "PRÉVENIR, METTRE UN TERME, SANCTIONNER. Un employeur qui a affiché et formé,",
      "mais qui laisse une situation signalée se poursuivre, a tenu la première et",
      "manqué la deuxième. Une enquête qui conclut à des faits établis et ne donne",
      "lieu à aucune suite manque la troisième.",
      "",
      "Ces obligations s'inscrivent dans l'obligation générale de sécurité :",
      "« L'employeur prend les mesures nécessaires pour assurer la sécurité et",
      "protéger la santé physique et mentale des travailleurs. Ces mesures",
      "comprennent : 1° Des actions de prévention des risques professionnels […] ;",
      "2° Des actions d'information et de formation ; 3° La mise en place d'une",
      "organisation et de moyens adaptés. L'employeur veille à l'adaptation de ces",
      "mesures pour tenir compte du changement des circonstances et tendre à",
      "l'amélioration des situations existantes » (L. 4121-1).",
      "",
      "Et la planification de la prévention les intègre expressément : l'employeur",
      "doit « planifier la prévention en y intégrant, dans un ensemble cohérent, la",
      "technique, l'organisation du travail, les conditions de travail, les relations",
      "sociales et l'influence des facteurs ambiants, notamment les risques liés au",
      "harcèlement moral et au harcèlement sexuel, tels qu'ils sont définis aux",
      "articles L. 1152-1 et L. 1153-1, ainsi que ceux liés aux agissements sexistes",
      "définis à l'article L. 1142-2-1 » (L. 4121-2, 7°).",
      "",
    ];
  }

  /* Les cinq coordonnées de D. 1151-1, en tableau : l'interlocuteur, son
     adresse, son numéro d'appel, et le nom quand le texte le demande. Dans
     l'exemple, tout est rempli ; dans le document à compléter, les lignes
     dues dépendent de l'effectif et du comité, et le reste est à crochets. */
  function tableauCoordonnees(ctx, E) {
    var T = ["Interlocuteur (D. 1151-1)", "Adresse", "Numéro d'appel", "Nom, quand le texte l'exige"];
    var f = (ctx && ctx.fiche) || {}, cse = f.cse || {};
    var au250 = E ? E.au250 : seuil(ctx, 250);
    var R = [];
    if (E) {
      R.push(["1° Médecin du travail ou service de santé au travail : " + E.spst.nom, E.spst.adresse, E.spst.tel, E.spst.medecin]);
      R.push(["2° Inspection du travail : " + E.inspection.nom, E.inspection.adresse, E.inspection.tel, E.inspection.inspecteur + " (nom exigé par le 2°)"]);
      R.push(["3° " + DDD.nom, DDD.adresse, DDD.tel, "sans objet"]);
      R.push(["4° Référent de l'employeur (L. 1153-5-1)" + (au250 ? ", dû, effectif d'au moins deux cent cinquante salariés" : ", désigné volontairement, effectif de " + E.effectif + " salariés"),
        E.referent.adresse, E.referent.tel, E.referent.nom + ", " + E.referent.fonction]);
      R.push(["5° Référent du comité social et économique (L. 2314-1)", E.cseAdresse, E.cseTel, E.cse.referent + ", " + E.cse.qualite]);
      return tableau(T, R);
    }
    R.push(["1° Médecin du travail ou service de santé au travail compétent pour l'établissement", "[ADRESSE]", "[NUMÉRO]", "[nom du médecin, utile]"]);
    R.push(["2° Inspection du travail compétente", "[ADRESSE DE L'UNITÉ DE CONTRÔLE]", "[NUMÉRO]", "[NOM DE L'INSPECTEUR, exigé par le 2°]"]);
    R.push(["3° Défenseur des droits", "[ADRESSE]", "[NUMÉRO]", "sans objet"]);
    if (au250 === true) {
      R.push(["4° Référent de l'employeur (L. 1153-5-1), DÛ : votre effectif atteint deux cent cinquante salariés", "[ADRESSE]", "[NUMÉRO]", "[NOM, PRÉNOM, FONCTION]"]);
    } else if (au250 === false) {
      R.push(["4° Référent de l'employeur (L. 1153-5-1) : votre effectif n'atteint pas deux cent cinquante salariés, ligne à supprimer si vous n'avez pas désigné de référent", "[ADRESSE, si désigné]", "[NUMÉRO, si désigné]", "[NOM, si désigné]"]);
    } else {
      R.push(["4° Référent de l'employeur (L. 1153-5-1) : dû à partir de deux cent cinquante salariés, effectif non renseigné, gardez ou supprimez la ligne", "[ADRESSE]", "[NUMÉRO]", "[NOM, PRÉNOM, FONCTION]"]);
    }
    if (estNon(cse.existe)) {
      R.push(["5° Référent du comité social et économique (L. 2314-1) : aucun comité déclaré, ligne sans objet", "sans objet", "sans objet", "sans objet"]);
    } else {
      R.push(["5° Référent du comité social et économique (L. 2314-1)" + (estNon(f.referentCSE) ? ", non encore désigné par le comité selon le dossier" : ""), "[ADRESSE]", "[NUMÉRO]", "[NOM, PRÉNOM]"]);
    }
    return tableau(T, R);
  }

  /* Ce que D. 1151-1 demande, dans ses mots, pour les règles. */
  function blocD1151() {
    return [
      "LES CINQ COORDONNÉES DE D. 1151-1, DANS L'ORDRE DU TEXTE",
      "",
      "« L'information prévue au second alinéa de l'article L. 1153-5 précise",
      "l'adresse et le numéro d'appel : 1° Du médecin du travail ou du service de",
      "santé au travail compétent pour l'établissement ; 2° De l'inspection du",
      "travail compétente ainsi que le nom de l'inspecteur compétent ; 3° Du",
      "Défenseur des droits ; 4° Du référent prévu à l'article L. 1153-5-1 dans toute",
      "entreprise employant au moins deux cent cinquante salariés ; 5° Du référent",
      "prévu à l'article L. 2314-1 lorsqu'un comité social et économique existe. »",
      "",
      "Le texte demande, pour chacun, DEUX choses : une ADRESSE et un NUMÉRO",
      "D'APPEL. Un nom seul ne suffit pas ; un numéro seul non plus. Et pour",
      "l'inspection du travail, il en demande une troisième : LE NOM de l'inspecteur",
      "compétent, c'est la mention la plus souvent absente, et elle se périme.",
      "Ces cinq coordonnées se périment : un service qui déménage, un inspecteur",
      "qui change d'affectation, un référent dont le mandat s'achève. Datez le",
      "support et fixez qui le relit.",
      "",
    ];
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-01, LE RÉFÉRENT DE L'EMPLOYEUR

     Un article de deux lignes, et pourtant le document le plus facile à rater :
     désigner quelqu'un ne suffit pas, encore faut-il que la décision énonce la
     mission telle que le texte la définit, orienter, informer, accompagner,
     et que les coordonnées du référent rejoignent l'affichage, où D. 1151-1,
     4°, va les chercher. Un référent désigné et introuvable ne remplit ni l'une
     ni l'autre obligation.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-HAR-01", {
    nom: "La désignation du référent « harcèlement sexuel et agissements sexistes » de l'employeur",
    detail: "La décision de désignation, la lettre de mission avec ses moyens, " +
            "la note au personnel, la ligne à porter dans l'affichage et le calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = aujourd(ctx);
      var au250 = seuil(ctx, 250);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Désignation du référent harcèlement sexuel et agissements sexistes",
        "article L. 1153-5-1 du code du travail");

      /* Le corps du document, écrit une fois : rempli pour l'exemple, à
         crochets pour le document à compléter. */
      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        var adresse = E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège");
        var R = E ? E.referent : null;
        var refNom = X(E, R && R.nom, "NOM, PRÉNOM");
        var refFonction = X(E, R && R.fonction, "fonction exercée dans l'entreprise");
        var refService = X(E, R && R.service, "service, site, établissement");
        var refAdresse = X(E, R && R.adresse, "ADRESSE");
        var refTel = X(E, R && R.tel, "NUMÉRO");
        var due = E ? E.au250 : au250;
        var eff = E ? E.effectif : (effectifDe(ctx).connu ? effectifDe(ctx).n : null);
        var dateDecision = X(E, leJour(dans(d0, 3)), "DATE");
        var dateEffet = X(E, leJour(dans(d0, 3)), "DATE D'EFFET");

        C.push("PIÈCE 1, DÉCISION DE DÉSIGNATION");
        C.push("");
        C.push(nom.toUpperCase());
        C.push(adresse);
        C.push("");
        C.push("DÉCISION DU " + dateDecision.toUpperCase());
        C.push("Désignation du référent chargé d'orienter, d'informer et d'accompagner");
        C.push("les salariés en matière de lutte contre le harcèlement sexuel et les");
        C.push("agissements sexistes");
        C.push("");
        C.push("Vu l'article L. 1153-5-1 du code du travail ;");
        C.push("Vu l'article D. 1151-1 du même code, 4° ;");
        C.push("Vu les articles L. 1153-1, L. 1153-2 et L. 1153-5 du même code ;");
        if (due === true) {
          C.push("Considérant que l'entreprise emploie " + eff + " salariés, soit au moins deux");
          C.push("cent cinquante, et que la désignation d'un référent est due ;");
        } else if (due === false) {
          C.push("Considérant que l'entreprise emploie " + eff + " salariés, moins de deux cent");
          C.push("cinquante, et que la désignation, volontaire, s'inscrit dans les dispositions");
          C.push("de prévention que l'article L. 1153-5 impose à tout employeur ;");
        } else {
          C.push("Considérant que l'entreprise emploie [EFFECTIF] salariés, [au moins deux cent");
          C.push("cinquante : la désignation est due / moins de deux cent cinquante : la");
          C.push("désignation est volontaire et s'inscrit dans les dispositions de prévention");
          C.push("de L. 1153-5] ;");
        }
        C.push("");
        C.push("ARTICLE 1, DÉSIGNATION");
        C.push("Est désigné(e) référent(e) chargé(e) d'orienter, d'informer et");
        C.push("d'accompagner les salariés en matière de lutte contre le harcèlement");
        C.push("sexuel et les agissements sexistes : " + refNom + ", " + refFonction + ",");
        C.push(refService + ".");
        C.push("");
        C.push("ARTICLE 2, MISSION");
        C.push("La mission du référent est celle que L. 1153-5-1 définit :");
        C.push("  - ORIENTER les salariés, vers le médecin du travail ou le service de");
        C.push("    santé au travail, vers l'inspection du travail, vers le Défenseur des");
        C.push("    droits, vers le référent du comité social et économique, vers la");
        C.push("    procédure interne de signalement ;");
        C.push("  - INFORMER les salariés sur ce que sont le harcèlement sexuel et les");
        C.push("    agissements sexistes, sur les protections dont bénéficie celui qui");
        C.push("    relate ou témoigne, et sur les voies ouvertes ;");
        C.push("  - ACCOMPAGNER les salariés qui le saisissent, pendant le temps");
        C.push("    nécessaire.");
        C.push("Ce que le référent ne fait pas : " + X(E,
          "il ne conduit pas les enquêtes internes, qui relèvent de la procédure de signalement ; il peut y être entendu, et il n'y qualifie rien",
          "PRÉCISER, par exemple s'il conduit ou non les enquêtes internes ; le texte ne le dit pas, et le flou se reprochera plus tard au référent") + ".");
        C.push("");
        C.push("ARTICLE 3, MOYENS");
        C.push("Sont mis à sa disposition :");
        C.push("");
        C = C.concat(tableau(["Moyen", "Ce qui est mis à disposition", "Date ou échéance"], [
          ["Temps identifié, distinct de la charge habituelle", X(E, R && R.temps, "NOMBRE d'heures par mois ou par trimestre"), X(E, "à compter du " + leJour(dans(d0, 3)), "date d'effet")],
          ["Formation", X(E, R && R.formation, "INTITULÉ, ORGANISME, DURÉE"), X(E, "engagée avant le " + jj(dans(d0, 90)), "suivie le DATE, ou à suivre avant le DATE")],
          ["Lieu où recevoir sans être vu ni entendu", X(E, R && R.lieuReception, "LIEU"), X(E, "disponible dès la désignation", "date")],
          ["Adresse et numéro d'appel dédiés, portés à l'affichage", refAdresse + " ; " + refTel, X(E, "portés à l'affichage le " + jj(dans(d0, 7)), "date de mise à jour de l'affichage")],
        ]));
        C.push("ARTICLE 4, SAISINE");
        C.push("Tout salarié peut le saisir directement, " + X(E,
          "par écrit à l'adresse ci-dessus, par téléphone ou sur rendez-vous",
          "par écrit à l'adresse ci-dessus / par téléphone / sur rendez-vous") + ".");
        C.push("La saisine du référent ne prive le salarié d'aucune autre voie : il peut");
        C.push("s'adresser directement à l'employeur, au comité social et économique, au");
        C.push("médecin du travail, à l'inspection du travail ou au Défenseur des droits.");
        C.push("");
        C.push("ARTICLE 5, DURÉE ET PUBLICITÉ");
        C.push("La présente désignation prend effet le " + dateEffet + " et court");
        C.push("jusqu'à " + X(E, "décision contraire", "décision contraire / terme, s'il en est fixé un") + ". Elle est portée à la");
        C.push("connaissance du personnel par " + X(E, "note de service remise contre émargement et affichage", "note de service / intranet / affichage") + ",");
        C.push("et les coordonnées du référent sont ajoutées à l'information de D. 1151-1.");
        C.push("");
        C.push("Fait à " + ville + ", le " + dateDecision + ".");
        C.push(sig);
        C.push("");
        C.push("Pour acceptation de la mission : " + X(E, R && R.nom + ", le " + leJour(dans(d0, 3)), "NOM du référent, le DATE") + ", signature.");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, LETTRE DE MISSION AU RÉFÉRENT");
        C.push("");
        C = C.concat(teteLettre(ctx, E, [refNom, refFonction + ", " + refService], false, E ? dans(d0, 3) : d0));
        C.push("Objet : votre désignation comme référent harcèlement sexuel et");
        C.push("agissements sexistes");
        C.push("");
        C.push("Madame, Monsieur,");
        C.push("");
        C.push("Par décision du " + dateDecision + ", je vous ai désigné(e) référent(e) au");
        C.push("titre de l'article L. 1153-5-1 du code du travail, qui charge ce référent");
        C.push("« d'orienter, d'informer et d'accompagner les salariés en matière de lutte");
        C.push("contre le harcèlement sexuel et les agissements sexistes ».");
        C.push("");
        C.push("Cette lettre précise ce que cette mission suppose de votre part, et ce");
        C.push("que l'entreprise met à votre disposition pour l'exercer.");
        C.push("");
        C.push("CE QUE VOUS AUREZ À CONNAÎTRE");
        C.push("");
        C.push("Les définitions, d'abord, elles sont dans le code du travail et non dans");
        C.push("l'usage : L. 1153-1 pour le harcèlement sexuel, L. 1152-1 pour le");
        C.push("harcèlement moral. Vous les trouverez reproduites dans l'affichage de");
        C.push("l'entreprise et dans la procédure interne de signalement.");
        C.push("");
        C.push("La protection de celui qui parle, ensuite : L. 1153-2 et L. 1152-2");
        C.push("interdisent que la personne qui a subi, refusé de subir, relaté de bonne");
        C.push("foi ou témoigné fasse l'objet des mesures mentionnées à l'article");
        C.push("L. 1121-2. C'est la première chose à dire à un salarié qui hésite.");
        C.push("");
        C.push("Les interlocuteurs, enfin : médecin du travail ou service de santé au");
        C.push("travail, inspection du travail, Défenseur des droits, référent du comité");
        C.push("social et économique. Leurs coordonnées figurent à l'affichage");
        C.push("(D. 1151-1) ; vérifiez qu'elles sont à jour avant d'y renvoyer quelqu'un.");
        C.push("");
        C.push("CE QUE L'ENTREPRISE MET À VOTRE DISPOSITION");
        C.push("");
        C.push("  - du temps : " + X(E, R && R.temps, "NOMBRE d'heures par mois ou par trimestre") + " ;");
        C.push("  - une formation : " + X(E, R && R.formation + ", à engager avant le " + leJour(dans(d0, 90)), "INTITULÉ, ORGANISME, DURÉE, suivie le DATE ou à suivre avant le DATE") + " ;");
        C.push("  - un lieu de réception préservé : " + X(E, R && R.lieuReception, "LIEU") + " ;");
        C.push("  - une adresse et un numéro d'appel dédiés : " + refAdresse + " ; " + refTel + ".");
        C.push("");
        C.push("CE QUI VOUS EST DEMANDÉ EN RETOUR");
        C.push("");
        C.push("  - tenir le registre des saisines ci-dessous, sans y porter le récit des");
        C.push("    faits : date, nature de la demande, orientation donnée, suite. Il sert");
        C.push("    à mesurer l'activité, pas à constituer un dossier ;");
        C.push("  - ne pas qualifier les faits : ce n'est ni votre rôle ni celui de");
        C.push("    l'entreprise avant l'enquête ;");
        C.push("  - alerter sans délai " + X(E, E && E.recoit, "le signataire de la présente / la personne désignée par la procédure interne") + " lorsqu'une");
        C.push("    situation vous paraît appeler des mesures immédiates ;");
        C.push("  - vous abstenir de tout traitement d'une situation où vous seriez");
        C.push("    personnellement en cause ou trop proche des personnes concernées, et");
        C.push("    le signaler aussitôt.");
        C.push("");
        C.push("Registre des saisines du référent, modèle :");
        C.push("");
        var enteteRegistre = ["Date", "Qui saisit (fonction, sans nom)", "Nature de la demande", "Orientation donnée", "Suite"];
        C = C.concat(E ? tableau(enteteRegistre, [
          [E.date(20), "salariée, " + E.unites[0][0], "question sur ce qui relève de l'agissement sexiste", "définitions remises, affichage montré", "aucune saisine formelle, la salariée sait où s'adresser"],
          [E.date(34), "salarié, " + E.unites[1][0], "récit de propos entendus au poste", "orientation vers la procédure interne, rappel de la protection de L. 1153-2", "signalement écrit remis à " + E.recoit + " le " + E.date(35)],
          [E.date(51), "salariée, " + E.unites[2][0], "demande de rendez-vous avec le médecin du travail", "coordonnées du service de santé au travail remises, appel passé avec elle", "rendez-vous obtenu le " + E.date(58)],
          [E.date(66), "intérimaire, " + E.unites[1][0], "message reçu d'un collègue, hors service", "conservation du message conseillée, orientation vers la procédure interne", "signalement écrit le " + E.date(67)],
        ]) : tableauVide(enteteRegistre, 3));
        C = C.concat(formulePolitesse(ctx, E, "Madame, Monsieur"));
        C.push("Pièce jointe : décision de désignation du " + dateDecision);
        C.push("");
        C.push("");

        C.push("PIÈCE 3, NOTE D'INFORMATION AU PERSONNEL");
        C.push("");
        C.push(nom + ", note du " + X(E, leJour(dans(d0, 7)), "DATE"));
        C.push("Objet : désignation d'un référent harcèlement sexuel et agissements");
        C.push("sexistes");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("En application de l'article L. 1153-5-1 du code du travail, " + refNom + ",");
        C.push(refFonction + ", est désigné(e) référent(e) chargé(e) d'orienter, d'informer");
        C.push("et d'accompagner les salariés en matière de lutte contre le harcèlement");
        C.push("sexuel et les agissements sexistes.");
        C.push("");
        C.push("Vous pouvez le ou la saisir directement : " + refAdresse + " ; " + refTel + " ;");
        C.push(X(E, "sur rendez-vous, par écrit ou par téléphone, aux heures d'ouverture des bureaux", "modalités : sur rendez-vous, par écrit, aux heures suivantes") + ".");
        C.push("");
        C.push("Cette saisine ne vous prive d'aucune autre voie. Vous pouvez également");
        C.push("vous adresser à l'employeur, au comité social et économique et à son");
        C.push("référent, au médecin du travail ou au service de santé au travail, à");
        C.push("l'inspection du travail ou au Défenseur des droits. Leurs coordonnées");
        C.push("figurent sur l'affichage prévu par l'article D. 1151-1 du code du");
        C.push("travail.");
        C.push("");
        C.push("Il est rappelé qu'aucune personne ayant subi ou refusé de subir des faits");
        C.push("de harcèlement sexuel définis à l'article L. 1153-1, ou ayant de bonne foi");
        C.push("témoigné de tels faits ou les ayant relatés, ne peut faire l'objet des");
        C.push("mesures mentionnées à l'article L. 1121-2 (L. 1153-2). La même protection");
        C.push("est prévue en matière de harcèlement moral par l'article L. 1152-2.");
        C.push("");
        C.push(sig);
        C.push("Diffusion : " + X(E, "remise contre émargement à chaque salarié, affichage aux trois emplacements de l'entreprise, le " + leJour(dans(d0, 7)), "support, date, preuve conservée") + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 4, CE QUI DOIT CHANGER SUR L'AFFICHAGE");
        C.push("");
        C.push("La ligne à porter, ou à corriger, sur le support d'information de");
        C.push("D. 1151-1, 4° :");
        C.push("");
        C = C.concat(tableau(["Rubrique de l'affichage", "Nom et fonction", "Adresse", "Numéro d'appel", "Porté le"], [
          ["Référent harcèlement sexuel et agissements sexistes de l'entreprise (L. 1153-5-1)", refNom + ", " + refFonction, refAdresse, refTel, X(E, E && E.date(7), "date")],
        ]));
        C.push("Le document SST-CTL-HAR-03 de cette application produit l'affichage");
        C.push("complet, avec les cinq coordonnées de D. 1151-1.");
        C.push("");
        return C;
      }

      /* ---- l'exemple ---- */
      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");

      /* ---- le document à compléter ---- */
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà");
      L.push("portées ; chaque crochet est un choix à faire, pas une case à cocher.");
      L.push("Ne laissez aucun crochet dans les pièces que vous signez et diffusez.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Pièce", "Preuve conservée"], [
        ["Choix de la personne, et accord de l'intéressé : un référent désigné sans son accord ne recevra personne", jj(d0), "aucune", "aucune"],
        ["Signature de la décision et remise de la lettre de mission ; aucune consultation, aucun délai, aucune formalité extérieure", jj(dans(d0, 3)), "pièces 1 et 2", "décision signée, lettre contresignée pour acceptation"],
        ["Diffusion de la note au personnel et correction de l'affichage", jj(dans(d0, 7)), "pièces 3 et 4", "émargement ou accusé, photographie du panneau, capture datée de l'intranet"],
        ["Formation du référent engagée ; aucun texte lu ne fixe ce délai, c'est une échéance que vous vous donnez", jj(dans(d0, 90)), "pièce 2, article 3", "convention de formation, attestation"],
        ["À chaque changement : départ du référent, changement de fonction, de site ou de numéro", "le jour même", "pièces 1 et 4", "nouvelle décision, affichage corrigé et photographié"],
      ]));

      L = L.concat(DP.liens(ctx, ["sst", "cse"]));

      /* ---- les règles ---- */
      L.push("LES RÈGLES");
      L.push("");
      L.push("LE TEXTE, EN ENTIER, IL TIENT EN UNE PHRASE");
      L.push("");
      L.push("« Dans toute entreprise employant au moins deux cent cinquante salariés est");
      L.push("désigné un référent chargé d'orienter, d'informer et d'accompagner les");
      L.push("salariés en matière de lutte contre le harcèlement sexuel et les");
      L.push("agissements sexistes » (L. 1153-5-1).");
      L.push("");
      L.push("Quatre choses s'y lisent, et chacune commande une ligne du document :");
      L.push("  - le SEUIL, au moins deux cent cinquante salariés ;");
      L.push("  - l'obligation de DÉSIGNER : le texte n'ouvre pas une faculté ;");
      L.push("  - la MISSION, en trois verbes, orienter, informer, accompagner. Ce ne");
      L.push("    sont pas les mêmes : orienter suppose de connaître les interlocuteurs,");
      L.push("    informer suppose de connaître les textes, accompagner suppose du");
      L.push("    temps et un lieu où recevoir ;");
      L.push("  - l'OBJET, la lutte contre le harcèlement sexuel ET les agissements");
      L.push("    sexistes. Le second est plus large que le premier.");
      L.push("");
      L.push("CE QUE LE TEXTE NE DIT PAS, et qu'aucun document ne peut inventer : ni la");
      L.push("qualité que doit avoir le référent, ni sa formation, ni le temps qui lui");
      L.push("est alloué, ni les modalités de sa saisine. Ces choix vous appartiennent ;");
      L.push("ils sortent entre crochets, et l'exemple en montre une façon. Mais un");
      L.push("référent sans temps, sans formation et sans procédure de saisine n'est un");
      L.push("référent que sur le papier, et c'est le papier qui sera discuté.");
      L.push("");
      L.push("Une désignation qui ne rejoint pas l'affichage laisse l'information");
      L.push("incomplète : D. 1151-1, 4°, veut l'adresse et le numéro d'appel « du");
      L.push("référent prévu à l'article L. 1153-5-1 dans toute entreprise employant au");
      L.push("moins deux cent cinquante salariés ». Le manquement se constate alors à");
      L.push("deux titres, la désignation et l'information.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push(ligneEffectif(ctx));
      if (au250 === true) {
        L.push("Le seuil de deux cent cinquante salariés est atteint : la désignation est");
        L.push("DUE, et la ligne 4° de l'affichage de D. 1151-1 l'est également.");
      } else if (au250 === false) {
        L.push("Le seuil de deux cent cinquante salariés n'est pas atteint : L. 1153-5-1");
        L.push("ne vous oblige pas à désigner un référent, et le 4° de D. 1151-1 ne");
        L.push("s'applique pas à votre affichage. RIEN NE VOUS L'INTERDIT POUR AUTANT.");
        L.push("Si vous désignez malgré tout, les pièces servent telles quelles : la");
        L.push("désignation volontaire produit les mêmes effets pratiques, et elle est");
        L.push("un élément des dispositions de prévention que L. 1152-4 et L. 1153-5");
        L.push("imposent par ailleurs, sans seuil, à tout employeur.");
      } else {
        L.push("L'effectif n'étant pas renseigné, l'application NE TRANCHE PAS. Portez");
        L.push("votre effectif : au moins deux cent cinquante salariés, la désignation");
        L.push("est due et l'affichage doit porter les coordonnées du référent ; en");
        L.push("deçà, elle reste possible et utile, mais elle n'est pas imposée par");
        L.push("L. 1153-5-1.");
      }
      L.push("Référent désigné selon le dossier : " + etat(f.referentEmployeur, "oui", "NON") + ".");

      return L.concat(pied("L. 1153-5-1, D. 1151-1, L. 1153-1, L. 1153-2, L. 1153-5, " +
        "L. 1152-2, L. 4121-1",
        ["Aucune peine n'est annoncée. Le seul texte répressif capté par ce module en",
         "matière de harcèlement est L. 1155-2, qui punit « les faits de",
         "discriminations commis à la suite d'un harcèlement moral ou sexuel » : il",
         "vise les représailles, non l'absence de référent. Ce qui se joue ici est",
         "l'obligation de prévention de L. 1153-5 et l'obligation de sécurité de",
         "L. 4121-1, dont le juge du fond appréciera si elles ont été tenues.",
         "",
         "L. 1121-2 et L. 1142-2-1, nommés ci-dessus, n'ont pas été lus par",
         "l'application : elle ne les reproduit pas et n'en écrit pas le régime."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-02, LE RÉFÉRENT DU COMITÉ

     Celui-là, l'employeur ne le désigne pas : le comité le désigne, parmi ses
     membres, par une résolution. L'employeur ne peut donc produire ni la
     désignation ni le procès-verbal, mais il peut inscrire la question à
     l'ordre du jour, écrire aux élus, et prouver qu'il l'a fait. Ce document
     porte cette démarche, et le modèle de résolution que le comité adoptera
     s'il le veut bien.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-HAR-02", {
    nom: "La désignation du référent harcèlement par le comité social et économique",
    detail: "L'inscription à l'ordre du jour, le courrier aux élus, le modèle de " +
            "résolution, la formation due au référent et la mise à jour de l'affichage.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var cse = f.cse || {};
      var d0 = aujourd(ctx);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Désignation du référent harcèlement par le comité social et économique",
        "article L. 2314-1, dernier alinéa, du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var K = E ? E.cse : null;
        var reunion = X(E, leJour(dans(d0, 15)), "DATE DE LA RÉUNION");
        var refNom = X(E, K && K.referent, "NOM, PRÉNOM");
        var refQualite = X(E, K && K.qualite + ", " + K.college, "membre titulaire / suppléant, collège");
        var refAdresse = X(E, E && E.cseAdresse, "ADRESSE");
        var refTel = X(E, E && E.cseTel, "NUMÉRO");
        var datesFormation = X(E, "du " + leJour(dans(d0, 60)) + " au " + leJour(dans(d0, 64)), "DATES");

        C.push("PIÈCE 1, INSCRIPTION À L'ORDRE DU JOUR");
        C.push("");
        C.push(nom);
        C.push("");
        C.push("ORDRE DU JOUR, RÉUNION DU COMITÉ SOCIAL ET ÉCONOMIQUE DU " + reunion.toUpperCase());
        C.push("Extrait");
        C.push("");
        C.push("Point " + X(E, "3", "N°") + ", désignation du référent en matière de lutte contre le");
        C.push("harcèlement sexuel et les agissements sexistes (L. 2314-1, dernier alinéa).");
        C.push("");
        C.push("Objet : le comité est appelé à désigner, parmi ses membres, par une");
        C.push("résolution adoptée selon les modalités de L. 2315-32, le référent en");
        C.push("matière de lutte contre le harcèlement sexuel et les agissements sexistes,");
        C.push("pour une durée qui prend fin avec celle du mandat des membres élus du");
        C.push("comité. Document joint : modèle de résolution.");
        C.push("");
        C.push("Transmission du point au secrétaire : " + X(E,
          "courriel adressé à " + (K ? K.secretaire : "") + " le " + leJour(d0) + ", copie conservée au dossier du comité",
          "DATE et moyen ; si l'ordre du jour est établi conjointement avec le secrétaire, transmettez-lui ce point par écrit et gardez la trace de l'envoi, c'est elle qui établira votre démarche") + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, COURRIER AUX MEMBRES DE LA DÉLÉGATION DU PERSONNEL");
        C.push("");
        C = C.concat(teteLettre(ctx, E, ["Aux membres de la délégation du personnel", "du comité social et économique"], false));
        C.push("Objet : désignation du référent en matière de lutte contre le harcèlement");
        C.push("sexuel et les agissements sexistes");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("Le dernier alinéa de l'article L. 2314-1 du code du travail prévoit qu'un");
        C.push("référent en matière de lutte contre le harcèlement sexuel et les");
        C.push("agissements sexistes « est désigné par le comité social et économique");
        C.push("parmi ses membres, sous la forme d'une résolution adoptée selon les");
        C.push("modalités définies à l'article L. 2315-32, pour une durée qui prend fin");
        C.push("avec celle du mandat des membres élus du comité ».");
        C.push("");
        C.push("Cette désignation appartient au comité, et à lui seul : je ne peux ni y");
        C.push("procéder, ni proposer un nom. Je vous invite en conséquence à y procéder");
        C.push("lors de la réunion du " + reunion + ", à l'ordre du jour de laquelle");
        C.push("cette question est inscrite. Un modèle de résolution est joint, que vous");
        C.push("pourrez reprendre ou écarter.");
        C.push("");
        C.push("Deux points pratiques, qui ne sont pas de simples formalités :");
        C.push("");
        C.push("  - les coordonnées du référent que vous désignerez, adresse et numéro");
        C.push("    d'appel, devront figurer sur l'information délivrée aux salariés et");
        C.push("    aux candidats à l'embauche, l'article D. 1151-1, 5°, l'exigeant");
        C.push("    « lorsqu'un comité social et économique existe ». Merci de me les");
        C.push("    communiquer dès la désignation, afin que le support soit corrigé sans");
        C.push("    délai ;");
        C.push("  - le référent bénéficie de la formation en matière de santé, de");
        C.push("    sécurité et de conditions de travail : l'article L. 2315-18 vise");
        C.push("    expressément, à côté des membres de la délégation du personnel, « le");
        C.push("    référent prévu au dernier alinéa de l'article L. 2314-1 ». Le");
        C.push("    financement de cette formation est pris en charge par l'employeur");
        C.push("    dans les conditions prévues par décret en Conseil d'État. Indiquez-moi");
        C.push("    les dates que vous souhaitez retenir" + (E ? " ; l'organisme sollicité propose la session " + datesFormation : "") + ".");
        C.push("");
        C.push("Je vous rappelle enfin que la désignation prend fin avec le mandat des");
        C.push("membres élus du comité : elle devra être reprise au prochain");
        C.push("renouvellement.");
        C.push("");
        C = C.concat(formulePolitesse(ctx, E, "Mesdames, Messieurs"));
        C.push("Pièce jointe : modèle de résolution");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, MODÈLE DE RÉSOLUTION, À L'USAGE DU COMITÉ");
        C.push("");
        C.push("Ce modèle est mis à la disposition du comité. Il ne l'engage pas : le");
        C.push("comité l'adopte, le modifie ou l'écarte.");
        C.push("");
        C.push("RÉSOLUTION N° " + X(E, "5", ".") + ", DÉSIGNATION DU RÉFÉRENT EN MATIÈRE DE LUTTE CONTRE");
        C.push("LE HARCÈLEMENT SEXUEL ET LES AGISSEMENTS SEXISTES");
        C.push("");
        C.push("Réunion du comité social et économique de " + nom + " du " + reunion + ".");
        C.push("");
        C.push("Vu le dernier alinéa de l'article L. 2314-1 du code du travail ;");
        C.push("Vu l'article L. 2315-32 du même code ;");
        C.push("");
        C.push("Le comité social et économique, après en avoir délibéré, désigne parmi");
        C.push("ses membres, en qualité de référent en matière de lutte contre le");
        C.push("harcèlement sexuel et les agissements sexistes, pour une durée qui prend");
        C.push("fin avec celle du mandat des membres élus du comité : " + refNom + ", " + refQualite + ".");
        C.push("");
        C.push("Coordonnées à porter sur l'information délivrée aux salariés (D. 1151-1,");
        C.push("5°) : " + refAdresse + " ; " + refTel + ".");
        C.push("");
        C.push("Le comité demande que le référent ainsi désigné bénéficie de la");
        C.push("formation prévue à l'article L. 2315-18, aux dates suivantes : " + datesFormation + ".");
        C.push("");
        C = C.concat(tableau(["Votants", "Pour", "Contre", "Abstentions", "Le président"], [
          [X(E, K && String(K.presents), ".."), X(E, K && String(K.presents), ".."), X(E, "0", ".."), X(E, "0", ".."), "n'a pas pris part au vote (L. 2315-32)"],
        ]));
        C.push("Résolution adoptée à la majorité des membres présents.");
        C.push("");
        C.push("Le secrétaire du comité, " + X(E, K && K.secretaire.replace(/, secrétaire du comité$/, ""), "NOM") + ". Le président, " + sig + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 4, LA FORMATION DU RÉFÉRENT");
        C.push("");
        C.push("Le référent est nommément visé par la première phrase de L. 2315-18 : il");
        C.push("bénéficie de la formation, et l'employeur en supporte le financement.");
        C.push("");
        C = C.concat(tableau(["Ce qui est arrêté", "Valeur retenue", "Trace conservée"], [
          ["Organisme", X(E, "organisme de formation agréé retenu par le comité, session « santé, sécurité et conditions de travail » avec un module sur le harcèlement sexuel et les agissements sexistes", "NOM DE L'ORGANISME"), X(E, "convention de formation signée le " + jj(dans(d0, 20)), "convention")],
          ["Dates", datesFormation, X(E, "convocation remise le " + jj(dans(d0, 45)), "convocation")],
          ["Durée", X(E, "cinq jours, la référente exerçant son premier mandat de membre de la délégation du personnel", "DURÉE"), X(E, "attestation de présence", "attestation")],
          ["Prise en charge", "employeur (L. 2315-18, dernier alinéa)", X(E, "facture réglée le " + jj(dans(d0, 75)), "facture")],
        ]));
        C.push("");

        C.push("PIÈCE 5, CE QUI DOIT CHANGER SUR L'AFFICHAGE, DÈS LA DÉSIGNATION");
        C.push("");
        C = C.concat(tableau(["Rubrique de l'affichage", "Nom", "Adresse", "Numéro d'appel", "Porté le"], [
          ["Référent harcèlement du comité social et économique (L. 2314-1)", refNom + ", " + refQualite, refAdresse, refTel, X(E, E && E.date(18), "date, dans les trois jours de la désignation")],
        ]));
        C.push("Cette ligne se met à jour à chaque renouvellement du comité : le mandat du");
        C.push("référent prend fin avec celui des élus, et un affichage qui porte le nom");
        C.push("d'un ancien élu vaut, sur ce point, une absence d'information.");
        C.push("");
        return C;
      }

      /* ---- l'exemple ---- */
      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");

      /* ---- le document à compléter ---- */
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Vous ne pouvez pas désigner à la place du");
      L.push("comité, mais vous pouvez établir que vous l'avez mis en mesure de le");
      L.push("faire : chaque pièce ci-dessous se date et se conserve.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Pièce", "Preuve conservée"], [
        ["Transmission du point d'ordre du jour et du courrier aux élus ; c'est la seule chose qui établira votre démarche si le comité ne désigne pas", jj(d0), "pièces 1 et 2", "courriel ou récépissé daté"],
        ["Réunion du comité, selon le calendrier propre à l'instance ; résolution adoptée à la majorité des membres présents, le président ne prenant pas part au vote", jj(dans(d0, 15)) + " environ", "pièce 3", "extrait de procès-verbal demandé au secrétaire le jour même, avec le décompte des voix"],
        ["Affichage corrigé ; cette ligne dépend de vous seul, ne la laissez pas attendre le procès-verbal définitif", jj(dans(d0, 18)), "pièce 5", "photographie du panneau, capture datée"],
        ["Formation de L. 2315-18 engagée ; aucun texte lu ne fixe ce délai, c'est une échéance que vous vous donnez", jj(dans(d0, 90)) + " au plus tard", "pièce 4", "convention, convocation, attestation"],
        ["Prochain renouvellement du comité : la désignation se refait, sans que personne ne vous le rappelle", "à porter dès aujourd'hui à l'agenda", "pièces 1 à 5", "nouvelle résolution, affichage corrigé"],
      ]));

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      /* ---- les règles ---- */
      L.push("LES RÈGLES");
      L.push("");
      L.push("LE TEXTE, EN ENTIER, DERNIER ALINÉA DE L. 2314-1");
      L.push("");
      L.push("« Un référent en matière de lutte contre le harcèlement sexuel et les");
      L.push("agissements sexistes est désigné par le comité social et économique parmi");
      L.push("ses membres, sous la forme d'une résolution adoptée selon les modalités");
      L.push("définies à l'article L. 2315-32, pour une durée qui prend fin avec celle");
      L.push("du mandat des membres élus du comité. »");
      L.push("");
      L.push("Et les modalités auxquelles il renvoie, lues elles aussi :");
      L.push("");
      L.push("« Les résolutions du comité social et économique sont prises à la majorité");
      L.push("des membres présents. Le président du comité social et économique ne");
      L.push("participe pas au vote lorsqu'il consulte les membres élus du comité en tant");
      L.push("que délégation du personnel » (L. 2315-32).");
      L.push("");
      L.push("QUATRE CONSÉQUENCES, ET LA PREMIÈRE EST CELLE QUI CHANGE TOUT");
      L.push("");
      L.push("  1. LA DÉSIGNATION N'APPARTIENT PAS À L'EMPLOYEUR. Il ne peut ni la");
      L.push("     faire, ni la refuser, ni choisir la personne. Une « désignation »");
      L.push("     par note de l'employeur ne satisferait pas L. 2314-1 ; elle ferait");
      L.push("     croire à une conformité qui n'existe pas.");
      L.push("  2. LE RÉFÉRENT SE PREND PARMI LES MEMBRES DU COMITÉ. Un salarié");
      L.push("     extérieur au comité, si compétent soit-il, ne peut pas l'être à ce");
      L.push("     titre ; l'employeur peut, lui, désigner son propre référent au titre");
      L.push("     de L. 1153-5-1, mais c'est un autre référent et un autre article.");
      L.push("  3. LA FORME EST UNE RÉSOLUTION, adoptée à la majorité des membres");
      L.push("     présents, le président ne prenant pas part au vote. Un tour de table");
      L.push("     consigné au procès-verbal n'est pas une résolution.");
      L.push("  4. LA DURÉE EST CELLE DU MANDAT DES ÉLUS : elle prend fin avec lui. À");
      L.push("     chaque renouvellement du comité, la désignation se refait, c'est");
      L.push("     l'oubli le plus fréquent, et il laisse l'affichage porter le nom");
      L.push("     d'un ancien élu.");
      L.push("");
      L.push("CE QUE L'EMPLOYEUR PEUT FAIRE, ET QUI SE PROUVE");
      L.push("");
      L.push("Inscrire la question à l'ordre du jour, écrire aux élus, mettre à");
      L.push("disposition le modèle de résolution, et porter les coordonnées du référent");
      L.push("à l'affichage dès qu'il est désigné. C'est peu ; c'est exactement ce que");
      L.push("l'on vous demandera de montrer. Le 5° de D. 1151-1 exige en effet");
      L.push("l'adresse et le numéro d'appel « du référent prévu à l'article L. 2314-1");
      L.push("lorsqu'un comité social et économique existe » : tant que le comité n'a");
      L.push("pas désigné, VOTRE information reste incomplète.");
      L.push("");
      L.push("LA FORMATION DU RÉFÉRENT");
      L.push("");
      L.push("« Les membres de la délégation du personnel du comité social et économique");
      L.push("et le référent prévu au dernier alinéa de l'article L. 2314-1 bénéficient");
      L.push("de la formation nécessaire à l'exercice de leurs missions en matière de");
      L.push("santé, de sécurité et de conditions de travail prévues au chapitre II du");
      L.push("présent titre, dans des conditions déterminées par décret en Conseil");
      L.push("d'Etat. La formation est d'une durée minimale de cinq jours lors du");
      L.push("premier mandat des membres de la délégation du personnel. En cas de");
      L.push("renouvellement de ce mandat, la formation est d'une durée minimale : 1° De");
      L.push("trois jours pour chaque membre de la délégation du personnel, quelle que");
      L.push("soit la taille de l'entreprise ; 2° De cinq jours pour les membres de la");
      L.push("commission santé, sécurité et conditions de travail dans les entreprises");
      L.push("d'au moins trois cents salariés. […] le financement de la formation prévue");
      L.push("au premier alinéa du présent article est pris en charge par l'employeur");
      L.push("dans des conditions prévues par décret en Conseil d'Etat » (L. 2315-18).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-22-1",
        "est réservé par L. 2315-18 (« sans préjudice des dispositions de l'article " +
        "L. 2315-22-1 ») pour le financement de la formation"));
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      if (estNon(cse.existe)) {
        L.push("Le dossier ne déclare AUCUN comité social et économique. L. 2314-1 n'a");
        L.push("donc pas d'objet en l'état, et le 5° de D. 1151-1 non plus : cette ligne");
        L.push("se supprime de l'affichage. La régularité de cette absence de comité");
        L.push("relève du module « comité social et économique » de l'application, qui");
        L.push("traite de sa mise en place. Les pièces ci-dessus sont écrites pour le");
        L.push("jour où le comité existera.");
      } else if (estOui(cse.existe)) {
        L.push("Un comité social et économique existe.");
        L.push("Référent harcèlement du comité désigné selon le dossier : " +
          etat(f.referentCSE, "oui", "NON") + ".");
        if (estNon(f.referentCSE)) {
          L.push("La désignation n'a pas eu lieu : engagez la démarche et conservez-en la");
          L.push("date. Vous ne pouvez pas désigner à la place du comité, mais vous pouvez");
          L.push("établir que vous l'avez mis en mesure de le faire.");
        }
      } else {
        L.push("Le dossier ne dit pas s'il existe un comité social et économique. La");
        L.push("question commande tout : le référent de L. 2314-1 est désigné PAR le");
        L.push("comité, PARMI ses membres. Renseignez-la avant de vous servir des pièces.");
      }

      return L.concat(pied("L. 2314-1, L. 2315-32, L. 2315-18, D. 1151-1, 5°, " +
        "L. 1153-5, L. 1153-5-1",
        ["Aucune peine n'est annoncée, et le périmètre a été vérifié. L. 2317-1 punit",
         "l'entrave à la constitution du comité, à la libre désignation de ses MEMBRES",
         "et à son fonctionnement régulier : la désignation du référent est un acte du",
         "COMITÉ statuant par résolution, non une désignation de ses membres, et",
         "l'employeur qui inscrit la question à l'ordre du jour n'entrave rien. Ce qui",
         "se joue ici est double et civil : l'absence de référent laisse l'information",
         "de D. 1151-1 incomplète, et la prévention de L. 1153-5 s'apprécie au fond.",
         "",
         "L. 2315-22-1, nommé par L. 2315-18, n'a pas été lu par l'application."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-03, L'AFFICHAGE ET L'INFORMATION

     Le document le plus contrôlable de tout le module : il se lit sur un mur.
     Et le plus incomplet que l'application puisse produire, pour une raison
     qu'elle doit dire haut : le texte à afficher est celui de DEUX ARTICLES DU
     CODE PÉNAL, et le relais Légifrance du dépôt ne sert que le code du
     travail. L'affichage sort donc avec deux emplacements réservés et la
     consigne d'aller chercher les textes. Le contraire, un résumé de mémoire,
     serait un affichage faux, affiché sous la signature de l'employeur.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-HAR-03", {
    nom: "L'affichage et l'information dues sur les harcèlements",
    detail: "Le support d'affichage complet, la note de diffusion sur le harcèlement " +
            "moral, la fiche de relevé des cinq coordonnées, la preuve de diffusion " +
            "et le calendrier de mise à jour.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = aujourd(ctx);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Affichage et information, harcèlements et agissements sexistes",
        "articles L. 1152-4, L. 1153-5 et D. 1151-1 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var datePose = X(E, leJour(dans(d0, 7)), "DATE");
        var responsable = X(E, E && E.referent.nom + ", " + E.referent.fonction, "NOM, FONCTION");

        C.push("PIÈCE 1, LE SUPPORT D'AFFICHAGE");
        C.push("");
        C.push("À afficher dans les lieux de travail et dans les locaux ou à la porte des");
        C.push("locaux où se fait l'embauche (L. 1153-5). Deux emplacements, deux");
        C.push("supports : ne vous contentez pas du panneau du réfectoire.");
        C.push("");
        C.push("HARCÈLEMENT MORAL, HARCÈLEMENT SEXUEL ET AGISSEMENTS SEXISTES");
        C.push(nom.toUpperCase());
        C.push("Affichage établi le " + datePose);
        C.push("");
        C = C.concat(blocDefinitions(E));
        C.push("CE QUE LA LOI PUNIT, TEXTES DU CODE PÉNAL");
        C.push("");
        C.push("Harcèlement sexuel, article 222-33 du code pénal (dont L. 1153-5 impose");
        C.push("l'affichage) :");
        C.push("");
        C = C.concat(blocCodePenal(E, "l'article 222-33 du code pénal, en entier"));
        C.push("Harcèlement moral, article 222-33-2 du code pénal (dont L. 1152-4 impose");
        C.push("la communication par tout moyen) :");
        C.push("");
        C = C.concat(blocCodePenal(E, "l'article 222-33-2 du code pénal, en entier"));
        C.push("LES ACTIONS CONTENTIEUSES OUVERTES EN MATIÈRE DE HARCÈLEMENT SEXUEL");
        C.push("(exigées par L. 1153-5 : les actions civiles et les actions pénales)");
        C.push("");
        if (E) {
          C.push("Rubrique rédigée par le conseil de l'entreprise le " + leJour(dans(d0, 3)) + " et relue");
          C.push("avec lui : devant quelle juridiction la personne peut agir, au civil et au");
          C.push("pénal, dans quels délais, avec quels concours. L'application ne rédige pas");
          C.push("cette rubrique, elle n'a pas lu les textes de procédure, et l'exemple ne");
          C.push("l'invente pas.");
        } else {
          C.push("[À COMPLÉTER, l'application ne rédige pas cette rubrique, et il faut");
          C.push(" dire pourquoi : L. 1153-5 impose d'informer « des actions contentieuses");
          C.push(" civiles et pénales ouvertes en matière de harcèlement sexuel », mais ni");
          C.push(" lui ni D. 1151-1 n'en dressent la liste. Les décrire suppose de citer");
          C.push(" des textes de procédure civile et pénale que l'application n'a pas lus :");
          C.push(" elle ne les reproduira donc pas de mémoire. Portez ici, en termes simples");
          C.push(" et exacts, les voies ouvertes à la personne : devant quelle juridiction,");
          C.push(" dans quels délais, avec quels concours. Faites relire cette rubrique par");
          C.push(" un conseil : c'est la seule du support dont le contenu ne soit pas dicté");
          C.push(" par un texte que vous pouvez recopier.]");
        }
        C.push("");
        C = C.concat(blocProtection(E));
        C.push("LES AUTORITÉS ET SERVICES COMPÉTENTS, ADRESSE ET NUMÉRO D'APPEL (D. 1151-1)");
        C.push("");
        C = C.concat(tableauCoordonnees(ctx, E));
        C.push("À QUI S'ADRESSER DANS L'ENTREPRISE");
        C.push("");
        C.push(X(E,
          "Procédure interne de signalement et de traitement du " + (E && E.lettres(45)) + " : signalement par écrit ou oralement, sans forme imposée, à " + (E && E.recoit) + ", ou au référent, " + (E && E.referent.nom) + ", " + (E && E.referent.tel) + ". Un accusé de réception est remis sous deux jours ouvrés ; la procédure complète est affichée à côté du présent support",
          "Renvoyer ici à la procédure interne de signalement, si elle existe : à qui s'adresser, sous quelle forme, et ce qui se passe ensuite. Le document SST-CTL-HAR-04 de cette application la rédige. Un affichage qui dit ce qui est interdit sans dire à qui en parler laisse le salarié devant une porte fermée") + ".");
        C.push("");
        C.push("Affichage établi le " + datePose + ", à vérifier avant le " + X(E, leJour(dans(d0, 372)), "DATE, un an plus tard") + ".");
        C.push("Responsable de la mise à jour : " + responsable + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, NOTE DE DIFFUSION SUR LE HARCÈLEMENT MORAL (L. 1152-4)");
        C.push("");
        C.push(nom + ", note du " + datePose);
        C.push("Objet : information sur le harcèlement moral (article L. 1152-4 du code");
        C.push("du travail)");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("L'article L. 1152-4 du code du travail prévoit que l'employeur prend");
        C.push("toutes dispositions nécessaires en vue de prévenir les agissements de");
        C.push("harcèlement moral, et que les personnes mentionnées à l'article L. 1152-2");
        C.push("sont informées par tout moyen du texte de l'article 222-33-2 du code");
        C.push("pénal.");
        C.push("");
        C.push("Le harcèlement moral est défini par l'article L. 1152-1 du code du");
        C.push("travail : « Aucun salarié ne doit subir les agissements répétés de");
        C.push("harcèlement moral qui ont pour objet ou pour effet une dégradation de ses");
        C.push("conditions de travail susceptible de porter atteinte à ses droits et à sa");
        C.push("dignité, d'altérer sa santé physique ou mentale ou de compromettre son");
        C.push("avenir professionnel. »");
        C.push("");
        C.push("Le texte de l'article 222-33-2 du code pénal figure ci-après :");
        C.push("");
        C = C.concat(blocCodePenal(E, "l'article 222-33-2 du code pénal, en entier"));
        C.push("Aucune personne ayant subi ou refusé de subir de tels agissements, ou");
        C.push("ayant de bonne foi relaté ou témoigné de tels agissements, ne peut faire");
        C.push("l'objet des mesures mentionnées à l'article L. 1121-2 du code du travail");
        C.push("(L. 1152-2).");
        C.push("");
        C.push("Vous pouvez vous adresser à " + X(E, E && E.recoit + " ou au référent, " + E.referent.nom + ", ainsi qu'aux personnes et services dont les coordonnées figurent à l'affichage",
          "voir la procédure interne de signalement / aux personnes et services dont les coordonnées figurent à l'affichage") + ".");
        C.push("");
        C.push(sig);
        C.push("Diffusion : " + X(E, "remise contre émargement à chaque salarié le " + leJour(dans(d0, 7)) + ", et à chaque nouvel embauché avec le livret d'accueil", "support, date, preuve conservée") + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, RELEVÉ DE DIFFUSION ET D'AFFICHAGE");
        C.push("");
        C.push("Ce que l'on vous demandera n'est pas « avez-vous affiché ? » mais");
        C.push("« montrez-le ». Ce relevé est la pièce qui répond.");
        C.push("");
        var enteteReleve = ["Emplacement", "Date", "Support", "Preuve conservée"];
        if (E) {
          C = C.concat(tableau(enteteReleve, [
            ["Lieu de travail : " + E.lieux[0], E.date(7), "panneau sous vitre, format A3", "photographie datée du " + E.date(7)],
            ["Lieu de travail : " + E.lieux[1], E.date(7), "panneau sous vitre, format A3", "photographie datée du " + E.date(7)],
            ["Locaux ou porte des locaux où se fait l'embauche : " + E.lieux[2], E.date(7), "cadre à la porte, format A4, et exemplaire remis à chaque candidat reçu", "photographie datée, récépissés des candidats"],
            ["Note nominative sur le harcèlement moral (L. 1152-4)", E.date(7), "note remise en main propre", "feuille d'émargement, " + E.effectif + " signatures sur " + E.effectif],
            ["Livret d'accueil, remise à l'embauche", "à chaque embauche", "livret, page « prévention »", "récépissé signé au dossier du salarié"],
          ]));
        } else {
          C = C.concat(tableau(enteteReleve, [
            ["Lieu de travail : [SITE / ATELIER]", "[date]", "[support]", "[photographie datée]"],
            ["Lieu de travail : [SITE / ATELIER]", "[date]", "[support]", "[photographie datée]"],
            ["Locaux ou porte des locaux où se fait l'embauche : [LIEU]", "[date]", "[support]", "[photographie datée]"],
            ["Note nominative sur le harcèlement moral (L. 1152-4)", "[date]", "[support]", "[émargement, accusé électronique]"],
            ["Livret d'accueil, remise à l'embauche", "à chaque embauche", "[support]", "[récépissé]"],
          ]));
        }
        C.push("Le lieu d'embauche est visé pour lui-même par L. 1153-5 : s'il ne figure");
        C.push("pas dans ce relevé, l'obligation n'est pas tenue, quel que soit le nombre");
        C.push("de panneaux dans les ateliers.");
        C.push("");
        C.push("Relevé arrêté le " + datePose + " par " + responsable + ".");
        C.push("");
        return C;
      }

      /* ---- l'exemple ---- */
      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");

      /* ---- le document à compléter ---- */
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les crochets sont des coordonnées à relever,");
      L.push("des textes à recopier et une rubrique à rédiger : rien de tout cela ne se");
      L.push("devine, et l'application ne l'invente pas.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Pièce", "Preuve conservée"], [
        ["Relevé des cinq coordonnées de D. 1151-1 ; le nom de l'inspecteur du travail compétent se demande à l'unité de contrôle, il ne se devine pas", jj(d0), "pièce 1, tableau", "réponse écrite de l'unité de contrôle, fiche du service de santé au travail"],
        ["Recopie des deux articles du code pénal dans leur version en vigueur, rédaction de la rubrique des actions contentieuses, relecture par un conseil", jj(dans(d0, 3)), "pièce 1", "version datée des textes, relecture"],
        ["Pose aux deux emplacements, lieux de travail et lieu d'embauche ; note sur le harcèlement moral diffusée le même jour ; relevé daté", jj(dans(d0, 7)), "pièces 1 à 3", "photographies datées, émargement"],
        ["Vérification que rien n'a été décroché, recouvert ou déplacé", jj(dans(d0, 30)), "pièce 3", "photographie"],
        ["Relecture annuelle des cinq coordonnées ; aucun texte lu ne fixe cette périodicité, c'est une échéance que vous vous donnez", jj(dans(d0, 365)) + " au plus tard", "pièce 1, tableau", "relevé daté et signé"],
        ["Sans attendre l'échéance, à chaque changement : nouveau référent, nouvel inspecteur, déménagement du service de santé au travail, franchissement du seuil de deux cent cinquante salariés", "le jour même", "pièce 1", "support corrigé et photographié"],
      ]));

      L = L.concat(DP.liens(ctx, ["sst", "cse"]));

      /* ---- les règles ---- */
      L.push("LES RÈGLES");
      L.push("");
      L.push("DEUX OBLIGATIONS DISTINCTES, QU'ON CONFOND SANS CESSE");
      L.push("");
      L.push("LA PREMIÈRE, sur le HARCÈLEMENT MORAL : « L'employeur prend toutes");
      L.push("dispositions nécessaires en vue de prévenir les agissements de harcèlement");
      L.push("moral. Les personnes mentionnées à l'article L. 1152-2 sont informées PAR");
      L.push("TOUT MOYEN du texte de l'article 222-33-2 du code pénal » (L. 1152-4).");
      L.push("");
      L.push("  - le moyen est libre, affichage, note, intranet, livret d'accueil ;");
      L.push("  - l'objet ne l'est pas : c'est LE TEXTE de l'article 222-33-2 du code");
      L.push("    pénal, non son numéro et non un résumé ;");
      L.push("  - les destinataires sont « les personnes mentionnées à l'article");
      L.push("    L. 1152-2 », celles qui ont subi, refusé de subir, relaté de bonne");
      L.push("    foi ou témoigné. En pratique, cela se traduit par une information");
      L.push("    accessible à tous : on ne sait pas d'avance qui sera concerné. Une");
      L.push("    note nominativement diffusée se prouve mieux qu'un affichage, et la");
      L.push("    preuve, ici, est tout ce qui restera.");
      L.push("");
      L.push("LA SECONDE, sur le HARCÈLEMENT SEXUEL : « Dans les lieux de travail ainsi");
      L.push("que dans les locaux ou à la porte des locaux où se fait l'embauche, les");
      L.push("personnes mentionnées à l'article L. 1153-2 sont informées par tout moyen");
      L.push("du texte de l'article 222-33 du code pénal ainsi que des actions");
      L.push("contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel");
      L.push("et des coordonnées des autorités et services compétents. La liste de ces");
      L.push("services est définie par décret » (L. 1153-5, second alinéa).");
      L.push("");
      L.push("  - DEUX LIEUX, et le second est celui qu'on oublie : les lieux de");
      L.push("    travail, ET les locaux ou la porte des locaux OÙ SE FAIT L'EMBAUCHE.");
      L.push("    Le texte vise ce lieu pour lui-même : un candidat qui n'est pas encore");
      L.push("    salarié doit lire cette information avant d'entrer ;");
      L.push("  - TROIS OBJETS : le texte de l'article 222-33 du code pénal ; les");
      L.push("    actions contentieuses civiles et pénales ouvertes en matière de");
      L.push("    harcèlement sexuel ; les coordonnées des autorités et services");
      L.push("    compétents ;");
      L.push("  - la liste de ces services est celle du décret, D. 1151-1, reproduit");
      L.push("    ci-dessous, et qui exige pour chacun UNE ADRESSE ET UN NUMÉRO D'APPEL.");
      L.push("");
      L = L.concat(blocD1151());
      L.push("CE QU'IL FAUT ALLER CHERCHER, ET OÙ");
      L.push("");
      L.push("L'application ne lit que le CODE DU TRAVAIL. Trois éléments de cet");
      L.push("affichage ne s'y trouvent pas, et elle ne les inventera pas :");
      L.push("  1. le TEXTE de l'article 222-33 du code pénal (harcèlement sexuel) ;");
      L.push("  2. le TEXTE de l'article 222-33-2 du code pénal (harcèlement moral) ;");
      L.push("  3. la description des actions contentieuses civiles et pénales");
      L.push("     ouvertes en matière de harcèlement sexuel.");
      L.push("Les deux premiers se recopient depuis le code pénal, dans leur version en");
      L.push("vigueur au jour de l'affichage. Notez cette date sur le support : ces");
      L.push("articles ont été modifiés, et un affichage périmé se voit. Le troisième");
      L.push("demande une rédaction : faites-la relire.");
      L.push("");
      L.push("Deux autres articles du code du travail sont NOMMÉS par l'affichage sans");
      L.push("que l'application les ait lus :");
      L.push("");
      L = L.concat(blocRenvoi("L. 1121-2",
        "porte les mesures interdites contre la personne protégée, auxquelles " +
        "renvoient L. 1152-2 et L. 1153-2"));
      L = L.concat(blocRenvoi("L. 1142-2-1",
        "définit l'agissement sexiste, auquel renvoie L. 4121-2, 7°"));
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Information sur le harcèlement moral (L. 1152-4) : " +
        etat(f.infoHarcelementMoral, "délivrée", "NON DÉLIVRÉE") + ".");
      L.push("Information sur le harcèlement sexuel (L. 1153-5) : " +
        etat(f.infoHarcelementSexuel, "délivrée", "NON DÉLIVRÉE") + ".");
      L.push("Coordonnées des autorités et services (D. 1151-1) : " +
        etat(f.infoCoordonnees, "délivrées", "NON DÉLIVRÉES") + ".");
      L.push(ligneEffectif(ctx));

      return L.concat(pied("L. 1152-4, L. 1153-5, D. 1151-1, L. 1152-1, L. 1152-2, " +
        "L. 1153-1, L. 1153-2, L. 4121-1",
        ["Aucune peine n'est annoncée pour ce manquement, et le périmètre a été",
         "vérifié. R. 4741-3 punit la méconnaissance des « documents et affichages",
         "obligatoires », mais son énumération est CLOSE, L. 4711-1 à L. 4711-5 et",
         "D. 4711-1 à D. 4711-3, et l'affichage de L. 1153-5 n'y figure pas.",
         "L. 4741-1 ne l'atteint pas davantage : son énumération porte sur la",
         "quatrième partie du code, quand L. 1152-4 et L. 1153-5 sont à la première.",
         "L. 1155-2 ne punit que les discriminations commises À LA SUITE d'un",
         "harcèlement. Ce qui se joue ici est civil : une information absente ou",
         "incomplète se constate sur place et nourrit le manquement à l'obligation de",
         "prévention (L. 1152-4, L. 1153-5) et à l'obligation de sécurité (L. 4121-1).",
         "",
         "Les articles 222-33 et 222-33-2 du CODE PÉNAL, ainsi que L. 1121-2 et",
         "L. 1142-2-1 du code du travail, sont NOMMÉS ici sans avoir été lus par",
         "l'application : elle n'en reproduit pas le contenu. Les coordonnées du",
         "Défenseur des droits portées dans l'exemple ont été relevées sur son site",
         "le 9 septembre 2026 ; vérifiez-les avant de les afficher."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-04, LA PRÉVENTION ORGANISÉE

     Deux pièces indissociables, et l'ordre compte : le risque s'évalue et se
     transcrit d'abord (L. 4121-2, 7° ; R. 4121-1), la procédure de signalement
     et le plan d'action viennent ensuite. Une procédure écrite sans risque
     évalué décrit un circuit sans savoir ce qui y circulera ; un risque évalué
     sans procédure laisse le salarié devant une porte fermée.

     Ce document ne dit jamais que les mesures suffisent : la suffisance
     s'apprécie au fond. Il dit ce qui doit exister, et il l'écrit.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-HAR-04", {
    nom: "La prévention du harcèlement : volet du document unique et procédure interne de signalement",
    detail: "Le volet « harcèlement et agissements sexistes » du document unique, " +
            "la procédure interne de signalement et de traitement avec ses circuits, " +
            "ses délais et ses garanties, le plan d'information et de formation, la " +
            "note de diffusion et le calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var cse = f.cse || {};
      var d0 = aujourd(ctx);
      var au250 = seuil(ctx, 250);
      var L = entete(ctx, "Prévention du harcèlement et des agissements sexistes",
        "articles L. 1152-4, L. 1153-5, L. 4121-1, L. 4121-2, 7°, et R. 4121-1 du code du travail");

      L = L.concat(blocTroisTemps());
      L.push("LA MAILLE DE L'ÉVALUATION");
      L.push("");
      L.push("« L'employeur transcrit et met à jour dans un document unique les résultats");
      L.push("de l'évaluation des risques pour la santé et la sécurité des travailleurs à");
      L.push("laquelle il procède en application de l'article L. 4121-3. Cette évaluation");
      L.push("comporte un inventaire des risques identifiés dans chaque unité de travail");
      L.push("de l'entreprise ou de l'établissement, y compris ceux liés aux ambiances");
      L.push("thermiques » (R. 4121-1).");
      L.push("");
      L.push("Le risque de harcèlement s'inscrit donc UNITÉ DE TRAVAIL PAR UNITÉ DE");
      L.push("TRAVAIL, comme les autres. Une phrase générale en préambule du document");
      L.push("unique, « l'entreprise est attentive aux risques psychosociaux », ne");
      L.push("vaut pas inventaire : elle ne dit à quoi personne est exposé.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("Risques de harcèlement intégrés à l'évaluation : " +
        etat(f.risquesHarcelementEvalues, "oui", "NON"));
      L.push("Dispositions de prévention prises : " +
        etat(f.mesuresPreventionHarcelement, "oui", "NON"));
      L.push("Document unique existant : " + etat((f.duerp || {}).existe, "oui", "NON"));
      L.push("Dernière mise à jour du document unique : " +
        jour((f.duerp || {}).dateDerniereMaj, "date non renseignée"));
      if (estISO((f.duerp || {}).dateDerniereMaj)) {
        L.push("C'est la version qui reçoit le volet ci-dessous, et l'insertion de ce");
        L.push("volet est elle-même une mise à jour, à dater du jour où vous la faites.");
      }
      L.push(ligneEffectif(ctx));
      L.push("");
      if (estNon((f.duerp || {}).existe)) {
        L.push("ATTENTION, le dossier indique qu'il n'existe pas de document unique. Le");
        L.push("volet ci-dessous n'a alors nulle part où s'inscrire : commencez par le");
        L.push("document unique lui-même, que le générateur SST-CTL-DUE-01 de cette");
        L.push("application produit. Le volet « harcèlement » viendra s'y insérer.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1, VOLET « HARCÈLEMENT ET AGISSEMENTS SEXISTES » DU DOCUMENT UNIQUE");
      L.push(GROS);
      L.push("");
      L.push("À insérer dans le document unique, unité de travail par unité de travail,");
      L.push("avec les mêmes colonnes que le reste du document. Ce qui suit est une");
      L.push("grille : les risques réels de votre entreprise, l'application ne les");
      L.push("connaît pas et ne les inventera pas.");
      L.push("");
      L.push("CE QUI SE REGARDE, ET QUI N'EST PAS UNE MACHINE");
      L.push("");
      L.push("Le risque de harcèlement ne se lit pas sur un équipement : il se lit dans");
      L.push("l'organisation. Les situations qui l'exposent sont connues et se relèvent");
      L.push("sans enquête, c'est un inventaire, pas une accusation :");
      L.push("");
      L.push("  · le travail isolé ou en très petite équipe, où il n'y a pas de témoin ;");
      L.push("  · le travail de nuit, en horaires décalés, sur site du client ;");
      L.push("  · les relations hiérarchiques resserrées, où une seule personne décide");
      L.push("    des plannings, des affectations et de l'évaluation ;");
      L.push("  · les contacts avec des tiers, clients, usagers, sous-traitants, sur");
      L.push("    lesquels l'employeur n'a pas d'autorité disciplinaire, mais dont il");
      L.push("    doit protéger ses salariés ;");
      L.push("  · les fortes disparités d'âge, d'ancienneté ou de statut dans une même");
      L.push("    équipe ; les contrats précaires, l'apprentissage, les stages ;");
      L.push("  · les métiers très déséquilibrés du point de vue du sexe, dans un sens");
      L.push("    ou dans l'autre ;");
      L.push("  · les périodes de tension : réorganisation, changement de responsable,");
      L.push("    surcharge saisonnière.");
      L.push("");
      L.push("  Unité de travail   | Situations exposantes | Mesures existantes | Mesures à prendre   | Échéance   | Responsable");
      L.push("  -------------------|-----------------------|--------------------|---------------------|------------|-------------");
      L.push("  [.................] | [...................] | [................] | [.................] | [........] | [...........]");
      L.push("  [.................] | [...................] | [................] | [.................] | [........] | [...........]");
      L.push("  [.................] | [...................] | [................] | [.................] | [........] | [...........]");
      L.push("  [.................] | [...................] | [................] | [.................] | [........] | [...........]");
      L.push("");
      L.push("[REPRENDRE LA LISTE DE VOS UNITÉS DE TRAVAIL, celle du document unique.");
      L.push(" Si le harcèlement y apparaît sous une découpe différente du reste du");
      L.push(" document, personne ne saura les rapprocher.]");
      L.push("");
      L.push("Ce volet se met à jour comme le reste du document unique, et notamment");
      L.push("« lorsqu'une information supplémentaire intéressant l'évaluation d'un");
      L.push("risque est portée à la connaissance de l'employeur » (R. 4121-2, 3°). UN");
      L.push("SIGNALEMENT EST UNE TELLE INFORMATION : après tout signalement, ce volet");
      L.push("se relit, qu'une enquête ait ou non conclu à des faits établis.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2, PROCÉDURE INTERNE DE SIGNALEMENT ET DE TRAITEMENT");
      L.push(GROS);
      L.push("");
      L.push("AVERTISSEMENT SUR CE QUI SUIT, aucun texte lu n'impose une procédure");
      L.push("écrite, ni n'en fixe le contenu, les circuits ou les délais. Ce que les");
      L.push("textes imposent, c'est le résultat : prévenir, mettre un terme,");
      L.push("sanctionner (L. 1152-4 ; L. 1153-5), et prendre les mesures nécessaires");
      L.push("pour protéger la santé physique et mentale des travailleurs (L. 4121-1).");
      L.push("La procédure ci-dessous est un MOYEN, proposé parce qu'un employeur qui");
      L.push("n'a pas décidé à l'avance qui reçoit, qui décide et en combien de temps");
      L.push("improvise le jour où il reçoit un signalement, et improvise mal. Les");
      L.push("délais qu'elle porte sont les vôtres : ils ne sont pas dans la loi.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("     PROCÉDURE DE SIGNALEMENT ET DE TRAITEMENT DES SITUATIONS DE");
      L.push("     HARCÈLEMENT MORAL, DE HARCÈLEMENT SEXUEL ET D'AGISSEMENTS SEXISTES");
      L.push("");
      L.push("     " + nomDe(ctx));
      L.push("     Version [N°], applicable à compter du [DATE]");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("ARTICLE 1, OBJET ET CHAMP");
      L.push("");
      L.push("La présente procédure s'applique à toute personne travaillant dans");
      L.push("l'entreprise ou y intervenant : salariés, apprentis, stagiaires,");
      L.push("intérimaires, salariés d'entreprises extérieures, candidats à l'embauche.");
      L.push("[Adapter selon votre organisation.]");
      L.push("");
      L.push("Elle porte sur les faits définis aux articles L. 1152-1 (harcèlement");
      L.push("moral) et L. 1153-1 (harcèlement sexuel) du code du travail, ainsi que sur");
      L.push("les agissements sexistes.");
      L.push("");
      L.push("ARTICLE 2, CE QUE LA LOI DÉFINIT");
      L.push("");
      L = L.concat(blocDefinitions());
      L.push("ARTICLE 3, QUI PEUT SIGNALER, ET COMMENT");
      L.push("");
      L.push("Peut signaler : la personne qui s'estime concernée, toute personne qui a");
      L.push("été témoin de faits, un membre de la délégation du personnel du comité");
      L.push("social et économique, le référent du comité, le médecin du travail.");
      L.push("");
      L.push("Le signalement peut être fait :");
      L.push("  · par écrit à [ADRESSE POSTALE / ADRESSE ÉLECTRONIQUE DÉDIÉE] ;");
      L.push("  · oralement à [FONCTION DE LA PERSONNE DÉSIGNÉE], qui l'écrit aussitôt");
      L.push("    et le fait relire et signer par celui qui l'a fait ;");
      L.push("  · [autre voie que vous ouvrez : ligne d'écoute, formulaire].");
      L.push("");
      L.push("AUCUNE FORME N'EST IMPOSÉE À CELUI QUI SIGNALE. Un signalement n'a pas à");
      L.push("être motivé, daté par heure, ni accompagné de preuves : c'est l'enquête");
      L.push("qui établira, pas le signalement. Un signalement rejeté pour vice de forme");
      L.push("est un signalement reçu, et il obligera l'entreprise comme les autres.");
      L.push("");
      L.push("ARTICLE 4, QUI REÇOIT");
      L.push("");
      L.push("  · [FONCTION], destinataire principal ;");
      L.push("  · [FONCTION], destinataire de remplacement, notamment lorsque le");
      L.push("    précédent est personnellement concerné, proche des personnes en cause,");
      L.push("    ou empêché ;");
      if (au250 === true || au250 === null) {
        L.push("  · le référent harcèlement sexuel et agissements sexistes de l'employeur");
        L.push("    (L. 1153-5-1), qui oriente, informe et accompagne" +
          (au250 === null ? " s'il a été désigné" : "") + " ;");
      }
      if (!estNon(cse.existe)) {
        L.push("  · le référent harcèlement du comité social et économique (L. 2314-1),");
        L.push("    que la personne peut saisir directement.");
      }
      L.push("");
      L.push("LA RÈGLE DE DÉPORT EST LA PLUS IMPORTANTE DE TOUT L'ARTICLE : celui qui");
      L.push("est en cause, ou proche des personnes en cause, ne reçoit pas, n'enquête");
      L.push("pas et ne décide pas. Le prévoir à l'avance évite d'avoir à le décider");
      L.push("dans l'urgence, sous le regard de l'intéressé.");
      L.push("");
      L.push("ARTICLE 5, LE CIRCUIT, ÉTAPE PAR ÉTAPE");
      L.push("");
      L.push("  ÉTAPE 1, RÉCEPTION ET ACCUSÉ. Le signalement est daté à sa réception et");
      L.push("  consigné dans un registre tenu par [FONCTION]. Un accusé de réception");
      L.push("  écrit est remis à son auteur sous [X jours ouvrés, proposé : 2],");
      L.push("  rappelant la protection dont il bénéficie et indiquant qui suivra le");
      L.push("  dossier.");
      L.push("");
      L.push("  ÉTAPE 2, MESURES IMMÉDIATES. Sans attendre l'enquête, sont examinées");
      L.push("  les mesures propres à faire cesser les faits ALLÉGUÉS et à protéger la");
      L.push("  personne : aménagement des horaires ou des affectations, suspension des");
      L.push("  contacts entre les personnes concernées, orientation vers le médecin du");
      L.push("  travail. Délai proposé : [X jours ouvrés, proposé : 3].");
      L.push("");
      L.push("  CES MESURES NE SONT PAS DES SANCTIONS et ne se prennent pas au détriment");
      L.push("  de celui qui signale : le déplacer, changer ses horaires ou l'écarter");
      L.push("  d'un projet contre son gré peut constituer, à son égard, une mesure que");
      L.push("  L. 1152-2 et L. 1153-2 interdisent. Quand l'éloignement s'impose, il se");
      L.push("  discute d'abord avec la personne protégée, et la solution retenue est");
      L.push("  écrite avec son accord ou, à défaut, avec la raison qui l'a imposée.");
      L.push("");
      L.push("  ÉTAPE 3, DÉCISION D'ENQUÊTER. Une décision écrite fixe l'auteur de");
      L.push("  l'enquête, son périmètre et son calendrier. Délai proposé : [X jours");
      L.push("  ouvrés, proposé : 5]. Ne pas enquêter est une décision : si elle est");
      L.push("  prise, elle s'écrit et se motive.");
      L.push("");
      L.push("  ÉTAPE 4, ENQUÊTE. Auditions de la personne qui signale, de la personne");
      L.push("  mise en cause et des témoins utiles, recueil des pièces. Durée proposée :");
      L.push("  [X semaines, proposé : 4 à 6]. Le document SST-CTL-HAR-05 de cette");
      L.push("  application porte la trame d'audition et la structure du rapport.");
      L.push("");
      L.push("  ÉTAPE 5, RAPPORT. Un rapport écrit et daté expose ce qui a été");
      L.push("  recherché, ce qui a été constaté et ce qui ne l'a pas été.");
      L.push("");
      L.push("  ÉTAPE 6, SUITES. Mesures pour mettre un terme aux faits ; sanction");
      L.push("  disciplinaire s'ils sont établis, prise selon la procédure disciplinaire");
      L.push(" , que le module « discipline » de cette application traite ; mesures");
      L.push("  d'organisation pour l'avenir. Délai proposé : [X jours ouvrés après le");
      L.push("  rapport, proposé : 10].");
      L.push("");
      L.push("  ÉTAPE 7, RETOUR AUX PERSONNES. La personne qui a signalé et la personne");
      L.push("  mise en cause sont informées par écrit de la clôture et du sens de la");
      L.push("  décision. Le rapport lui-même n'est pas nécessairement communiqué ; ce");
      L.push("  qui doit l'être, c'est que l'entreprise a instruit et a décidé.");
      L.push("");
      L.push("  ÉTAPE 8, SUIVI. Un point est fait avec la personne qui a signalé à");
      L.push("  [X semaines, proposé : 4] puis à [X mois, proposé : 3], pour vérifier");
      L.push("  que les faits ont cessé et qu'aucune mesure défavorable n'a suivi.");
      L.push("  C'est cette étape qui manque presque toujours, et c'est elle qui donne");
      L.push("  sa portée à l'obligation d'Y METTRE UN TERME.");
      L.push("");
      L.push("ARTICLE 6, LES GARANTIES");
      L.push("");
      L.push("  1. CONFIDENTIALITÉ. L'information circule entre les seules personnes");
      L.push("     qui doivent en connaître pour instruire et décider. Les documents");
      L.push("     sont conservés séparément des dossiers du personnel, sous [modalité");
      L.push("     de conservation]. Aucune communication n'est faite aux collègues, à");
      L.push("     l'encadrement non concerné, ni à des tiers.");
      L.push("");
      L.push("  2. IMPARTIALITÉ. Règle de déport de l'article 4. L'enquête est conduite");
      L.push("     par [désignation : binôme, dont une personne extérieure au service");
      L.push("     concerné], et non par le supérieur direct des personnes en cause.");
      L.push("");
      L.push("  3. ABSENCE DE PRÉJUGÉ. Aucun écrit de la procédure ne qualifie les faits");
      L.push("     avant la clôture de l'enquête. Les termes employés sont « les faits");
      L.push("     signalés », « les faits allégués », jamais « les faits de");
      L.push("     harcèlement », tant que rien n'est établi. Cette règle protège aussi");
      L.push("     l'entreprise : un écrit qui préjuge est une pièce contre elle.");
      L.push("");
      L.push("  4. NON-REPRÉSAILLES.");
      L.push("");
      L = L.concat(blocProtection());
      L.push("  5. DROIT DE LA PERSONNE MISE EN CAUSE. Elle est informée de ce qui lui");
      L.push("     est reproché avant d'être entendue, dans des termes qui lui");
      L.push("     permettent de répondre, et elle est entendue avant toute conclusion.");
      L.push("     Une enquête qui conclut sans l'avoir entendue ne vaut rien, ni pour");
      L.push("     elle ni pour l'entreprise.");
      L.push("");
      L.push("  6. ASSISTANCE. [Préciser si la personne entendue peut être accompagnée,");
      L.push("     et par qui, un salarié de l'entreprise, un membre du comité. Aucun");
      L.push("     texte lu ne l'impose au stade de l'enquête ; le prévoir apaise les");
      L.push("     auditions. En revanche, l'assistance lors de l'entretien préalable à");
      L.push("     une SANCTION est, elle, prévue par L. 1332-2, et le module");
      L.push("     « discipline » de cette application la traite.]");
      L.push("");
      L.push("ARTICLE 7, CONSERVATION");
      L.push("");
      L.push("Le dossier complet, signalement, accusé, mesures immédiates, décision");
      L.push("d'enquête, comptes rendus d'audition, pièces, rapport, suites, courriers");
      L.push("de retour, points de suivi, est conservé [durée que vous fixez], sous");
      L.push("[modalité]. C'est ce dossier, et non le souvenir des personnes, qui");
      L.push("établira ce que l'entreprise a fait.");
      L.push("");
      L.push("ARTICLE 8, RÉVISION");
      L.push("");
      L.push("La présente procédure est réexaminée à chaque mise à jour du document");
      L.push("unique, et après chaque signalement traité.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push(TRAIT);
      L.push("");
      if (!estNon(cse.existe)) {
        L.push("[AVANT D'ADOPTER : votre règlement intérieur porte-t-il déjà un article");
        L.push(" sur le signalement des harcèlements ? Si la présente procédure y ajoute");
        L.push(" des obligations générales et permanentes, elle relève du règlement");
        L.push(" intérieur et de ses formalités, avis du comité social et économique,");
        L.push(" publicité, dépôt, communication à l'inspection. Le module « discipline");
        L.push(" et règlement intérieur » de cette application les traite. Présenter la");
        L.push(" procédure au comité est en tout état de cause de bonne méthode : une");
        L.push(" procédure que les élus découvrent le jour d'un signalement ne sera pas");
        L.push(" utilisée.]");
        L.push("");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3, PLAN D'INFORMATION ET DE FORMATION");
      L.push(GROS);
      L.push("");
      L.push("L'obligation de sécurité comprend expressément « des actions d'information");
      L.push("et de formation » (L. 4121-1, 2°). Ce qui sera discuté n'est pas");
      L.push("l'existence du plan, mais sa MISE EN ŒUVRE : dates, destinataires,");
      L.push("contenus, présences.");
      L.push("");
      L.push("  Action                          | Public       | Date | Contenu | Preuve");
      L.push("  --------------------------------|--------------|------|---------|--------");
      L.push("  Diffusion de la procédure       | tout le      | [..] | [.....] | [.....]");
      L.push("                                  | personnel    |      |         |");
      L.push("  Affichage L. 1152-4 / L. 1153-5 | tous + lieu  | [..] | [.....] | [.....]");
      L.push("                                  | d'embauche   |      |         |");
      L.push("  Formation de l'encadrement :    | encadrement  | [..] | [.....] | [.....]");
      L.push("  repérer, recevoir, ne pas       |              |      |         |");
      L.push("  qualifier, transmettre          |              |      |         |");
      L.push("  Information des nouveaux        | embauches    | [..] | [.....] | [.....]");
      L.push("  entrants (livret d'accueil)     |              |      |         |");
      if (au250 === true || au250 === null) {
        L.push("  Formation du référent employeur | référent     | [..] | [.....] | [.....]");
      }
      if (!estNon(cse.existe)) {
        L.push("  Formation du référent du comité | référent CSE | [..] | [.....] | [.....]");
        L.push("  (L. 2315-18, financée par       |              |      |         |");
        L.push("  l'employeur)                    |              |      |         |");
      }
      L.push("  Point annuel devant le comité   | élus         | [..] | [.....] | [.....]");
      L.push("");
      L.push("L'encadrement est le public le plus important de ce tableau : c'est à lui");
      L.push("que la parole arrive d'abord, et c'est lui qui, faute de savoir quoi en");
      L.push("faire, l'arrête. Une formation qui apprend à NE PAS qualifier et à");
      L.push("transmettre vaut mieux qu'une formation juridique.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4, NOTE DE DIFFUSION DE LA PROCÉDURE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + ", note du " + leJour(d0));
      L.push("Objet : procédure de signalement et de traitement des situations de");
      L.push("harcèlement et d'agissements sexistes");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Une procédure de signalement et de traitement des situations de");
      L.push("harcèlement moral, de harcèlement sexuel et d'agissements sexistes est");
      L.push("mise en place dans l'entreprise à compter du [DATE]. Elle est jointe à la");
      L.push("présente note et consultable [LIEU / LIEN].");
      L.push("");
      L.push("Ce qu'il faut en retenir :");
      L.push("");
      L.push("  · à qui parler : [FONCTION / NOM], à [ADRESSE / NUMÉRO]. Vous pouvez");
      L.push("    aussi vous adresser aux personnes et services dont les coordonnées");
      L.push("    figurent à l'affichage prévu par l'article D. 1151-1 ;");
      L.push("  · comment : par écrit ou oralement, sans forme imposée ;");
      L.push("  · ce qui se passe ensuite : un accusé de réception, l'examen de mesures");
      L.push("    immédiates, une décision d'enquête, une enquête, un rapport, des");
      L.push("    suites, et un retour ;");
      L.push("  · ce que vous risquez en parlant : rien. Aucune personne ayant subi ou");
      L.push("    refusé de subir de tels faits, ni celle qui, de bonne foi, les a");
      L.push("    relatés ou en a témoigné, ne peut faire l'objet des mesures");
      L.push("    mentionnées à l'article L. 1121-2 du code du travail (L. 1152-2 ;");
      L.push("    L. 1153-2).");
      L.push("");
      L.push("Les personnes exerçant une responsabilité d'encadrement sont tenues de");
      L.push("transmettre sans délai tout signalement qui leur parvient, sans le");
      L.push("qualifier ni l'apprécier.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pièce jointe : la procédure");
      L.push("Diffusion : [tout le personnel, préciser le support et conserver la");
      L.push("preuve : émargement, accusé électronique, capture datée]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous relevez vos unités de travail et");
      L.push("les situations exposantes (pièce 1). Ce relevé se fait avec ceux qui");
      L.push("connaissent le travail réel, pas depuis un bureau.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + ", le volet du document unique est");
      L.push("rédigé et intégré. C'est l'ordre qui compte : le risque d'abord, la");
      L.push("procédure ensuite.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + ", la procédure est arrêtée (pièce 2) :");
      L.push("les noms sont portés, les délais choisis, la règle de déport écrite.");
      L.push("");
      if (!estNon(cse.existe)) {
        L.push("Avant l'adoption, présentation au comité social et économique. Le comité");
        L.push("« est consulté sur le document unique d'évaluation des risques");
        L.push("professionnels et sur ses mises à jour » (L. 4121-3, 1°) : la mise à jour");
        L.push("qui porte le volet harcèlement entre dans cette consultation. Prévoyez le");
        L.push("délai de convocation propre à l'instance.");
        L.push("");
      }
      L.push("Au " + leJour(dans(d0, 45)) + ", la procédure est diffusée (pièce 4),");
      L.push("l'affichage est en place, et les preuves de diffusion sont conservées.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 120)) + ", la formation de l'encadrement est");
      L.push("faite (pièce 3), avec sa feuille de présence.");
      L.push("");
      L.push("Avant le " + leJour(dans(d0, 365)) + ", réexamen du volet et de la");
      L.push("procédure, à l'occasion de la mise à jour du document unique.");
      L.push("");
      L.push("Ces durées sont les VÔTRES : aucun texte lu ne fixe de délai pour");
      L.push("organiser la prévention. Ce que les textes fixent, c'est l'obligation de");
      L.push("l'organiser, et elle court déjà.");
      L.push("");
      L.push("CE QUE CE DOCUMENT NE DIT PAS, ET NE DIRA JAMAIS : que ces mesures");
      L.push("suffisent. La suffisance des dispositions de prévention s'apprécie AU");
      L.push("FOND, au vu de ce qui s'est réellement passé dans l'entreprise. Ce");
      L.push("document dit ce qui doit exister ; il ne délivre aucun quitus.");

      return L.concat(pied("L. 1152-4, L. 1153-5, L. 1152-1, L. 1153-1, L. 1152-2, " +
        "L. 1153-2, L. 4121-1, L. 4121-2, 7°, L. 4121-3, R. 4121-1, R. 4121-2, " +
        "L. 1153-5-1, L. 2314-1, L. 2315-18, D. 1151-1",
        ["Aucune peine n'est annoncée, et le périmètre a été vérifié. R. 4741-1 punit",
         "une chose et une seule : le défaut de transcription ou de mise à jour « dans",
         "les conditions prévues aux articles R. 4121-1 et R. 4121-2 », il atteint",
         "donc le document unique lui-même, dont le module traite ailleurs (SST-CTL-",
         "DUE-01 à DUE-04), et non l'organisation de la prévention du harcèlement.",
         "L. 4741-1 ne rattrape pas les principes généraux de prévention : son",
         "énumération vise, pour le livre Ier de la quatrième partie, les « Titres",
         "Ier, III et IV », et le titre II, où vivent L. 4121-1 et L. 4121-2, en est",
         "absent. L. 1155-2 ne punit que les discriminations commises à la suite d'un",
         "harcèlement. Ce qui se joue ici est civil, et il est lourd : l'obligation de",
         "prévention et l'obligation de sécurité, appréciées au fond.",
         "",
         "L. 1121-2 et L. 1142-2-1, nommés ci-dessus, n'ont pas été lus par",
         "l'application. L. 1332-2, cité pour l'assistance lors de l'entretien",
         "préalable à une sanction, appartient au corpus du module « discipline »."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-05, LE SIGNALEMENT REÇU : ENQUÊTE, AUDITIONS, RAPPORT, SUITES

     Le seul document du fichier qui s'écrit sous la pression du temps, et le
     seul où une phrase maladroite se paie. Deux règles l'ont commandé :

    , RIEN N'EST QUALIFIÉ D'AVANCE. La trame d'audition ne pose aucune
       question qui suppose les faits établis. Le rapport porte trois
       conclusions possibles, et aucune n'est pré-remplie. « Faits non
       établis » n'est pas « signalement mensonger » : le rapport le dit, parce
       que la confusion des deux fonde les représailles que L. 1152-2 et
       L. 1153-2 interdisent.

    , LES SUITES SE DÉCIDENT DANS LES TROIS SENS. Établis : mesures et
       sanction. Non établis : mesures d'organisation quand même, s'il y a
       lieu. Éléments insuffisants : ce que l'on fait pour que la situation ne
       reste pas en l'état.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-HAR-05", {
    nom: "Le signalement reçu : mesures immédiates, enquête, trames d'audition, rapport et suites",
    detail: "L'accusé de réception, la décision de mesures conservatoires, la lettre " +
            "de mission d'enquête, les trois trames d'audition, personne qui signale, " +
            "personne mise en cause, témoins -, la structure du rapport, les courriers " +
            "de clôture et le calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var s = f.signalement || {};
      var cse = f.cse || {};
      var d0 = aujourd(ctx);
      var au250 = seuil(ctx, 250);
      var L = entete(ctx, "Signalement de harcèlement, enquête interne et suites",
        "articles L. 1153-5, L. 1152-4, L. 4121-1, L. 1152-2 et L. 1153-2 du code du travail");

      L.push("À LIRE AVANT TOUT LE RESTE");
      L.push("");
      L.push("Ce document ne dit pas ce qui s'est passé. Il ne le dira à aucun moment.");
      L.push("L'application ne connaît ni les personnes, ni les faits, ni les pièces :");
      L.push("tout ce qui les concerne sort ENTRE CROCHETS, et c'est l'employeur qui");
      L.push("écrit, c'est lui qui sait, et c'est lui qui répondra de ce qu'il aura");
      L.push("écrit.");
      L.push("");
      L.push("Il ne qualifie pas davantage. Aucune pièce produite ici ne parle de");
      L.push("« faits de harcèlement » avant que l'enquête soit close : elle parle de");
      L.push("FAITS SIGNALÉS et de FAITS ALLÉGUÉS. Ce n'est pas une précaution de");
      L.push("style. Un écrit qui qualifie avant d'avoir entendu la personne mise en");
      L.push("cause est une pièce à charge contre son propre auteur, et il le reste");
      L.push("quelle que soit l'issue.");
      L.push("");
      L = L.concat(blocTroisTemps());
      L.push("CE QUE VAUDRA VOTRE ENQUÊTE");
      L.push("");
      L.push("La valeur probante d'une enquête interne relève de l'appréciation");
      L.push("souveraine des juges du fond, au regard le cas échéant des autres éléments");
      L.push("de preuve (Soc., 18 juin 2025, n° 23-19.022, publié). Autrement dit : elle");
      L.push("ne s'impose à personne, et elle ne vaudra que ce que vaudront ses actes.");
      L.push("D'où la règle qui commande tout le dossier, TOUT S'ÉCRIT, TOUT SE DATE,");
      L.push("TOUT SE CONSERVE. Un acte accompli et non consigné n'a pas eu lieu.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("Signalement reçu selon le dossier : " + etat(s.recu, "OUI", "non"));
      L.push("Enquête menée : " + etat(s.enqueteMenee, "oui", "NON"));
      L.push("Mesures prises pour mettre un terme aux faits : " +
        etat(s.mesuresPrises, "oui", "NON"));
      L.push("");
      if (estNon(s.enqueteMenee) || estNon(s.mesuresPrises)) {
        L.push("LE DOSSIER PORTE UN SIGNALEMENT RESTÉ SANS RÉACTION COMPLÈTE. Le temps");
        L.push("écoulé ne se rattrape pas, mais il s'aggrave à chaque jour : commencez");
        L.push("par les mesures immédiates (pièce 2), qui ne demandent aucune enquête,");
        L.push("puis engagez l'enquête. Et écrivez, dans la décision d'enquête, la date");
        L.push("réelle de réception du signalement : la dissimuler serait ajouter une");
        L.push("faute à un retard.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1, ACCUSÉ DE RÉCEPTION DU SIGNALEMENT");
      L.push(GROS);
      L.push("");
      L.push("Le premier écrit du dossier, et celui qui fixe la date à partir de");
      L.push("laquelle tout se comptera.");
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM, PRÉNOM de la personne qui a signalé]", "[fonction et service]"], true));
      L.push("Objet : réception de votre signalement");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("J'accuse réception du signalement que vous m'avez adressé le [DATE DE");
      L.push("RÉCEPTION, telle qu'elle est réelle], [par écrit / oralement, consigné le");
      L.push("même jour et que vous avez relu et signé].");
      L.push("");
      L.push("Ce signalement va être instruit. [NOM, FONCTION] en assure le suivi et");
      L.push("sera votre interlocuteur. Vous serez entendu(e) dans le cadre de cette");
      L.push("instruction, et informé(e) par écrit de sa clôture.");
      L.push("");
      L.push("Sans attendre, [les mesures suivantes sont prises / l'examen des mesures");
      L.push("immédiates est engagé] : [PRÉCISER, ou renvoyer à la décision jointe].");
      L.push("");
      L.push("Je vous rappelle qu'aucune personne ayant subi ou refusé de subir des");
      L.push("faits de harcèlement, ni celle qui, de bonne foi, les a relatés ou en a");
      L.push("témoigné, ne peut faire l'objet des mesures mentionnées à l'article");
      L.push("L. 1121-2 du code du travail (L. 1152-2 ; L. 1153-2). Si vous estimiez");
      L.push("qu'une décision vous concernant est intervenue à raison de votre");
      L.push("signalement, faites-le-moi savoir immédiatement.");
      L.push("");
      L.push("Vous pouvez à tout moment vous adresser au médecin du travail ou au");
      L.push("service de santé au travail, à l'inspection du travail, au Défenseur des");
      L.push("droits" + (estNon(cse.existe) ? "" : ", au comité social et économique et à son référent") +
        (au250 === false ? "" : ", au référent de l'entreprise") + " :");
      L.push("leurs coordonnées figurent sur l'affichage prévu par l'article D. 1151-1.");
      L.push("La présente instruction ne vous prive d'aucune de ces voies.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Madame, Monsieur"));
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2, DÉCISION DE MESURES IMMÉDIATES");
      L.push(GROS);
      L.push("");
      L.push("Ces mesures ne supposent AUCUNE enquête et n'attendent AUCUNE");
      L.push("qualification : elles portent sur les faits ALLÉGUÉS, et elles se");
      L.push("justifient par le seul signalement. C'est le sens de l'obligation d'Y");
      L.push("METTRE UN TERME (L. 1153-5) et de l'obligation de sécurité (L. 4121-1).");
      L.push("");
      L.push(nomDe(ctx));
      L.push("DÉCISION DU " + leJour(d0).toUpperCase() + ", MESURES IMMÉDIATES");
      L.push("");
      L.push("1. Signalement reçu le [DATE], par [voie], de [qualité de l'auteur :");
      L.push("   personne concernée / témoin / membre du comité / médecin du travail].");
      L.push("");
      L.push("2. Personnes concernées : [IDENTIFIER, sans qualifier].");
      L.push("");
      L.push("3. Mesures arrêtées, à effet immédiat :");
      L.push("     [ ] suspension des contacts professionnels directs entre les");
      L.push("         personnes concernées : [modalité]");
      L.push("     [ ] aménagement des horaires, du planning ou de l'affectation :");
      L.push("         [préciser QUI est déplacé et POURQUOI ce choix]");
      L.push("     [ ] retrait provisoire de l'autorité hiérarchique ou de la");
      L.push("         responsabilité d'évaluation : [préciser]");
      L.push("     [ ] orientation vers le médecin du travail : [date de la demande]");
      L.push("     [ ] mise à pied conservatoire de la personne mise en cause :");
      L.push("         [préciser, c'est une mesure d'attente, non une sanction ; la");
      L.push("         procédure disciplinaire qui doit la suivre relève du module");
      L.push("         « discipline » de cette application]");
      L.push("     [ ] autre : [préciser]");
      L.push("     [ ] aucune mesure, SI VOUS COCHEZ CETTE CASE, ÉCRIVEZ POURQUOI :");
      L.push("         [motif]. Ne rien faire est une décision, et c'est celle qui se");
      L.push("         défend le moins bien.");
      L.push("");
      L.push("4. VÉRIFICATION OBLIGATOIRE AVANT DE SIGNER : la mesure retenue pèse-t-elle");
      L.push("   sur la personne qui a signalé ? Un changement d'horaires, de poste, de");
      L.push("   site ou d'équipe imposé à celui qui parle peut constituer, à son égard,");
      L.push("   une mesure que L. 1152-2 et L. 1153-2 interdisent. Si l'éloignement");
      L.push("   s'impose et qu'aucune autre solution n'existe :");
      L.push("     · en discuter avec elle AVANT ;");
      L.push("     · écrire son accord, ou à défaut la raison qui l'a imposé ;");
      L.push("     · prévoir expressément le retour à la situation antérieure et la");
      L.push("       date à laquelle il sera examiné : [DATE].");
      L.push("");
      L.push("5. Durée et réexamen : ces mesures sont provisoires et seront réexaminées");
      L.push("   le [DATE], et au plus tard à la clôture de l'enquête.");
      L.push("");
      L.push("6. Information des personnes : [qui est informé, de quoi, et par quel");
      L.push("   écrit].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3, DÉCISION D'ENQUÊTE ET LETTRE DE MISSION");
      L.push(GROS);
      L.push("");
      L.push("Écrire QUI enquête, SUR QUOI et JUSQU'À QUAND avant de commencer : c'est");
      L.push("ce qui distingue une enquête d'une série de conversations.");
      L.push("");
      L.push(nomDe(ctx));
      L.push("DÉCISION DU " + leJour(d0).toUpperCase() + ", ENQUÊTE INTERNE");
      L.push("");
      L.push("1. AUTEUR DE L'ENQUÊTE : [NOMS et qualités].");
      L.push("   [Composition recommandée : deux personnes, dont une extérieure au");
      L.push("    service concerné. Aucun texte lu ne l'impose ; l'impartialité, elle,");
      L.push("    se discutera. Une enquête conduite par le supérieur direct des");
      L.push("    personnes en cause s'expose à ce reproche avant d'avoir commencé.]");
      L.push("   Déport : aucun des enquêteurs n'est personnellement concerné par les");
      L.push("   faits signalés ni proche des personnes en cause. [Le vérifier et");
      L.push("   l'écrire.]");
      L.push("");
      L.push("2. PÉRIMÈTRE : les faits signalés le [DATE], tels qu'ils sont décrits dans");
      L.push("   le signalement, concernant [PERSONNES] sur la période [DU … AU …].");
      L.push("   L'enquête peut être étendue si des éléments concordants apparaissent :");
      L.push("   l'extension est alors écrite et datée par un avenant à la présente");
      L.push("   décision.");
      L.push("");
      L.push("3. ACTES PRÉVUS : audition de la personne qui a signalé ; audition de la");
      L.push("   personne mise en cause ; audition des témoins utiles [LISTE");
      L.push("   PRÉVISIONNELLE] ; recueil des pièces [messages, plannings, comptes");
      L.push("   rendus, courriels, préciser].");
      L.push("");
      L.push("4. CALENDRIER : début le [DATE], rapport attendu pour le [DATE].");
      L.push("   [Proposé : quatre à six semaines. Aucun texte lu ne fixe de durée. Mais");
      L.push("    une enquête qui dure six mois laisse la situation en l'état pendant");
      L.push("    six mois, et c'est cela qui se reprochera.]");
      L.push("");
      L.push("5. MOYENS : accès à [documents, locaux], temps dégagé, [assistance");
      L.push("   extérieure éventuelle].");
      L.push("");
      L.push("6. CONSIGNES AUX ENQUÊTEURS :");
      L.push("     · entendre la personne mise en cause AVANT toute conclusion, sur des");
      L.push("       faits énoncés en termes qui lui permettent de répondre ;");
      L.push("     · ne qualifier à aucun stade : recueillir, confronter, rapporter ;");
      L.push("     · consigner chaque audition, la faire relire et signer ;");
      L.push("     · ne rien promettre à personne, ni l'anonymat des témoins, qui ne");
      L.push("       peut pas toujours être tenu, ni une issue ;");
      L.push("     · signaler immédiatement toute situation appelant une mesure");
      L.push("       nouvelle et urgente.");
      L.push("");
      L.push("7. CONFIDENTIALITÉ : les enquêteurs et toute personne entendue sont tenus");
      L.push("   de ne pas divulguer ce qui est dit au cours de l'enquête.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4, CONVOCATION À UNE AUDITION");
      L.push(GROS);
      L.push("");
      L.push("Un même modèle pour les trois qualités, avec la variante indiquée.");
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM, PRÉNOM]", "[fonction et service]"], false));
      L.push("Objet : audition dans le cadre d'une enquête interne");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Une enquête interne a été ouverte le [DATE] à la suite d'un signalement.");
      L.push("Vous êtes invité(e) à être entendu(e) le [DATE] à [HEURE], à [LIEU], par");
      L.push("[NOMS et qualités des enquêteurs].");
      L.push("");
      L.push("[VARIANTE, PERSONNE MISE EN CAUSE, à substituer au paragraphe précédent :");
      L.push(" Une enquête interne a été ouverte le [DATE]. Des faits vous sont");
      L.push(" imputés : [LES ÉNONCER, datés et circonstanciés, en termes qui vous");
      L.push(" permettent de répondre, c'est la condition pour que votre réponse ait un");
      L.push(" sens]. Vous êtes invité(e) à vous en expliquer le [DATE] à [HEURE], à");
      L.push(" [LIEU], devant [NOMS].");
      L.push(" Cette convocation ne préjuge de rien : aucune conclusion n'est arrêtée,");
      L.push(" et elle ne le sera pas avant que vous ayez été entendu(e).");
      L.push(" Elle n'est pas une convocation à un entretien préalable à une sanction :");
      L.push(" si une procédure disciplinaire devait être engagée à l'issue de");
      L.push(" l'enquête, elle donnerait lieu à une convocation distincte, portant ses");
      L.push(" propres mentions.]");
      L.push("");
      L.push("[VARIANTE, TÉMOIN, à ajouter : Vous êtes entendu(e) en qualité de témoin.");
      L.push(" Vous n'êtes mis(e) en cause d'aucune manière.]");
      L.push("");
      L.push("[Le cas échéant : vous pouvez être accompagné(e) par [préciser qui -");
      L.push(" un salarié de l'entreprise, un membre du comité social et économique].");
      L.push(" Aucun texte lu par l'application n'impose cette assistance au stade de");
      L.push(" l'enquête ; l'entreprise l'ouvre par sa procédure interne.]");
      L.push("");
      L.push("Ce qui sera dit au cours de cet entretien sera consigné dans un compte");
      L.push("rendu que vous relirez et signerez, ou dont vous pourrez refuser la");
      L.push("signature, ce refus étant alors mentionné.");
      L.push("");
      L.push("Il est rappelé qu'aucune personne ayant subi ou refusé de subir des faits");
      L.push("de harcèlement, ni celle qui, de bonne foi, les a relatés ou en a");
      L.push("témoigné, ne peut faire l'objet des mesures mentionnées à l'article");
      L.push("L. 1121-2 du code du travail (L. 1152-2 ; L. 1153-2). Vous êtes par");
      L.push("ailleurs tenu(e) de ne pas divulguer ce qui sera dit au cours de");
      L.push("l'enquête.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Madame, Monsieur"));
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 5, TRAME D'AUDITION N° 1 : LA PERSONNE QUI A SIGNALÉ");
      L.push(GROS);
      L.push("");
      L.push("COMPTE RENDU D'AUDITION");
      L.push("Enquête ouverte le [DATE] · Audition n° [.] · " + nomDe(ctx));
      L.push("");
      L.push("Date et heure : [.....], début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Personne entendue : [NOM, PRÉNOM], [fonction, service, ancienneté]");
      L.push("Qualité : personne ayant signalé / personne s'estimant concernée");
      L.push("Enquêteurs présents : [NOMS et qualités]");
      L.push("Accompagnant, le cas échéant : [NOM et qualité]");
      L.push("");
      L.push("MENTIONS LUES À VOIX HAUTE AU DÉBUT DE L'AUDITION, ET PORTÉES ICI");
      L.push("");
      L.push("  1. Objet : recueillir votre récit des faits que vous avez signalés le");
      L.push("     [DATE]. Nous ne portons aucune appréciation aujourd'hui.");
      L.push("  2. Confidentialité : ce qui est dit ici ne sera porté qu'à la");
      L.push("     connaissance des personnes qui doivent en connaître pour instruire et");
      L.push("     décider. Il vous est demandé la même réserve.");
      L.push("  3. Non-représailles : aucune personne ayant subi ou refusé de subir des");
      L.push("     faits de harcèlement, ni celle qui, de bonne foi, les a relatés ou en");
      L.push("     a témoigné, ne peut faire l'objet des mesures mentionnées à l'article");
      L.push("     L. 1121-2 du code du travail (L. 1152-2 ; L. 1153-2). Signalez-nous");
      L.push("     immédiatement toute décision vous concernant qui vous paraîtrait liée");
      L.push("     à votre signalement.");
      L.push("  4. Ce compte rendu vous sera relu et soumis à signature. Vous pourrez y");
      L.push("     faire porter toute rectification ou observation.");
      L.push("  5. Vous pouvez interrompre l'entretien à tout moment.");
      L.push("");
      L.push("LE RÉCIT, QUESTIONS OUVERTES D'ABORD");
      L.push("");
      L.push("  Q1. Racontez-nous, avec vos mots, ce qui s'est passé.");
      L.push("      [LAISSER PARLER SANS INTERROMPRE. Écrire le récit tel qu'il est");
      L.push("       donné, y compris dans son désordre. Ne pas résumer, ne pas");
      L.push("       reformuler en termes juridiques.]");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q2. Depuis quand ? Quand cela a-t-il commencé, et quand la dernière");
      L.push("      fois ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q3. À quelle fréquence, et dans quelles circonstances ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q4. Qui d'autre était présent, ou a pu voir ou entendre ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q5. En avez-vous parlé à quelqu'un, et quand ? À qui, et qu'a-t-on");
      L.push("      répondu ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q6. Disposez-vous d'éléments matériels, messages, courriels, plannings,");
      L.push("      notes, certificats ? Pouvez-vous nous les remettre ?");
      L.push("      Réponse : [.....]     Pièces remises : [LISTE, cotée]");
      L.push("");
      L.push("  Q7. Quelles conséquences cela a-t-il eues sur votre travail et sur vous ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q8. Avez-vous consulté le médecin du travail ou un médecin ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q9. Depuis votre signalement, une décision vous concernant est-elle");
      L.push("      intervenue, horaires, affectation, planning, évaluation, relations");
      L.push("      de travail ?");
      L.push("      Réponse : [.....]");
      L.push("      [CETTE QUESTION EST OBLIGATOIRE. C'est le seul point de l'audition");
      L.push("       qui porte sur l'entreprise elle-même, et sur ce que L. 1152-2 et");
      L.push("       L. 1153-2 lui interdisent.]");
      L.push("");
      L.push("  Q10. Qu'attendez-vous de l'entreprise aujourd'hui ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q11. Souhaitez-vous ajouter quelque chose que nous n'avons pas demandé ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("CE QU'IL NE FAUT PAS DEMANDER");
      L.push("");
      L.push("  · pourquoi la personne n'a pas parlé plus tôt, sur le ton du reproche ;");
      L.push("  · ce qu'elle portait, comment elle se comportait, ce qu'elle a pu");
      L.push("    laisser croire ;");
      L.push("  · si elle est sûre de vouloir « aller jusqu'au bout », formule qui");
      L.push("    suggère un renoncement ;");
      L.push("  · si elle mesure les conséquences pour la personne mise en cause.");
      L.push("  Ces questions n'apportent rien à l'enquête et figureront au dossier.");
      L.push("");
      L.push("CLÔTURE");
      L.push("");
      L.push("Compte rendu relu par la personne entendue le [DATE].");
      L.push("Observations ou rectifications : [.....]");
      L.push("");
      L.push("Signature de la personne entendue : ................");
      L.push("[ou : la personne entendue a refusé de signer, mention portée le [DATE]]");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 6, TRAME D'AUDITION N° 2 : LA PERSONNE MISE EN CAUSE");
      L.push(GROS);
      L.push("");
      L.push("C'est l'audition la plus délicate, et la plus décisive : une enquête qui");
      L.push("conclut sans avoir entendu la personne mise en cause sur des faits énoncés");
      L.push("de manière précise ne vaut rien, ni contre elle, ni pour l'entreprise.");
      L.push("");
      L.push("COMPTE RENDU D'AUDITION");
      L.push("Enquête ouverte le [DATE] · Audition n° [.] · " + nomDe(ctx));
      L.push("");
      L.push("Date et heure : [.....], début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Personne entendue : [NOM, PRÉNOM], [fonction, service]");
      L.push("Qualité : personne mise en cause");
      L.push("Enquêteurs présents : [NOMS et qualités]");
      L.push("Accompagnant, le cas échéant : [NOM et qualité]");
      L.push("");
      L.push("MENTIONS LUES À VOIX HAUTE AU DÉBUT DE L'AUDITION, ET PORTÉES ICI");
      L.push("");
      L.push("  1. Objet : une enquête interne est en cours. Des faits vous sont");
      L.push("     imputés ; nous allons vous les énoncer et recueillir vos");
      L.push("     explications.");
      L.push("  2. AUCUNE CONCLUSION N'EST ARRÊTÉE. Rien n'est établi à ce stade, et");
      L.push("     rien ne le sera avant que vous ayez été entendu(e) et que l'ensemble");
      L.push("     des éléments ait été examiné.");
      L.push("  3. Cet entretien n'est PAS un entretien préalable à une sanction. Si une");
      L.push("     procédure disciplinaire devait être engagée, elle donnerait lieu à");
      L.push("     une convocation distincte, avec ses propres mentions et ses propres");
      L.push("     droits.");
      L.push("  4. Confidentialité : il vous est demandé de ne pas divulguer ce qui est");
      L.push("     dit ici, et de ne prendre aucun contact avec les personnes concernées");
      L.push("     au sujet de cette enquête.");
      L.push("  5. Ce compte rendu vous sera relu et soumis à signature ; vous pourrez y");
      L.push("     faire porter toute rectification ou observation.");
      L.push("");
      L.push("LES FAITS IMPUTÉS, ÉNONCÉS");
      L.push("");
      L.push("  [LES ÉCRIRE ICI, UN PAR UN, DATÉS ET CIRCONSTANCIÉS : ce qui aurait été");
      L.push("   dit ou fait, quel jour, où, devant qui. Une formule générale, « votre");
      L.push("   comportement », « des propos déplacés », ne met pas la personne en");
      L.push("   mesure de répondre, et rend sa réponse inutilisable.");
      L.push("");
      L.push("   Fait 1 : [.....]");
      L.push("   Fait 2 : [.....]");
      L.push("   Fait 3 : [.....]");
      L.push("");
      L.push("   NE PAS RÉVÉLER ce qui identifierait un témoin lorsque cela n'est pas");
      L.push("   nécessaire à l'énoncé du fait, mais ne pas énoncer si vaguement que la");
      L.push("   personne ne puisse pas répondre. L'arbitrage se fait fait par fait, et");
      L.push("   il s'écrit.]");
      L.push("");
      L.push("LES QUESTIONS");
      L.push("");
      L.push("  Q1. Que répondez-vous à ce qui vient de vous être énoncé ?");
      L.push("      [LAISSER RÉPONDRE SANS INTERROMPRE.]");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q2. Fait par fait : ce fait s'est-il produit ? Dans quelles");
      L.push("      circonstances ? Comment le décrivez-vous ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q3. Comment décrivez-vous vos relations de travail avec [la personne");
      L.push("      concernée] ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q4. Y a-t-il eu, entre vous, des difficultés antérieures, désaccord,");
      L.push("      évaluation, sanction, refus ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q5. Quelles personnes peuvent, selon vous, éclairer ces faits ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q6. Disposez-vous d'éléments matériels que vous souhaitez nous remettre ?");
      L.push("      Réponse : [.....]     Pièces remises : [LISTE, cotée]");
      L.push("");
      L.push("  Q7. Souhaitez-vous ajouter quelque chose ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("SI DES ÉLÉMENTS NOUVEAUX APPARAISSENT APRÈS CETTE AUDITION");
      L.push("");
      L.push("La personne mise en cause est entendue une seconde fois sur ces éléments");
      L.push("avant toute conclusion. Une enquête qui recueille un élément décisif après");
      L.push("l'audition et ne rouvre pas revient à ne pas l'avoir entendue.");
      L.push("");
      L.push("CLÔTURE");
      L.push("");
      L.push("Compte rendu relu par la personne entendue le [DATE].");
      L.push("Observations ou rectifications : [.....]");
      L.push("");
      L.push("Signature de la personne entendue : ................");
      L.push("[ou : la personne entendue a refusé de signer, mention portée le [DATE]]");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 7, TRAME D'AUDITION N° 3 : LES TÉMOINS");
      L.push(GROS);
      L.push("");
      L.push("COMPTE RENDU D'AUDITION");
      L.push("Enquête ouverte le [DATE] · Audition n° [.] · " + nomDe(ctx));
      L.push("");
      L.push("Date et heure : [.....], début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Personne entendue : [NOM, PRÉNOM], [fonction, service]");
      L.push("Qualité : témoin, n'est mis(e) en cause d'aucune manière");
      L.push("Enquêteurs présents : [NOMS et qualités]");
      L.push("");
      L.push("MENTIONS LUES À VOIX HAUTE AU DÉBUT DE L'AUDITION, ET PORTÉES ICI");
      L.push("");
      L.push("  1. Vous êtes entendu(e) comme témoin. Vous n'êtes mis(e) en cause");
      L.push("     d'aucune manière.");
      L.push("  2. Nous vous demandons ce que vous avez PERSONNELLEMENT vu ou entendu.");
      L.push("     Ce que l'on vous a rapporté a une valeur différente : dites-le, mais");
      L.push("     dites aussi que cela vous a été rapporté, et par qui.");
      L.push("  3. Non-représailles : aucune personne ayant, de bonne foi, témoigné de");
      L.push("     tels faits ou les ayant relatés ne peut faire l'objet des mesures");
      L.push("     mentionnées à l'article L. 1121-2 du code du travail (L. 1152-2 ;");
      L.push("     L. 1153-2). Signalez-nous immédiatement toute décision vous");
      L.push("     concernant qui vous paraîtrait liée à votre témoignage.");
      L.push("  4. Confidentialité : ce qui est dit ici ne sera porté qu'à la");
      L.push("     connaissance des personnes qui doivent en connaître. Il vous est");
      L.push("     demandé la même réserve.");
      L.push("  5. NOUS NE POUVONS PAS VOUS GARANTIR L'ANONYMAT. Ce compte rendu");
      L.push("     appartiendra au dossier d'enquête, et certains éléments devront");
      L.push("     peut-être être énoncés à la personne mise en cause pour qu'elle");
      L.push("     puisse y répondre. Ne promettez jamais ce que vous ne pourrez pas");
      L.push("     tenir : une promesse d'anonymat rompue détruit la confiance de tous");
      L.push("     les témoins suivants.");
      L.push("  6. Ce compte rendu vous sera relu et soumis à signature.");
      L.push("");
      L.push("LES QUESTIONS");
      L.push("");
      L.push("  Q1. Depuis quand travaillez-vous avec [les personnes concernées], et");
      L.push("      dans quelles conditions, mêmes horaires, même lieu, même équipe ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q2. Avez-vous personnellement vu ou entendu quelque chose concernant");
      L.push("      [décrire l'objet sans le qualifier] ? Si oui, quoi, quand, où ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q3. Comment décririez-vous les relations de travail entre ces personnes ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q4. Quelque chose vous a-t-il été rapporté ? Par qui, et quand ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q5. D'autres personnes ont-elles pu voir ou entendre ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("  Q6. Disposez-vous d'éléments matériels ?");
      L.push("      Réponse : [.....]     Pièces remises : [LISTE, cotée]");
      L.push("");
      L.push("  Q7. Souhaitez-vous ajouter quelque chose ?");
      L.push("      Réponse : [.....]");
      L.push("");
      L.push("CLÔTURE");
      L.push("");
      L.push("Compte rendu relu par la personne entendue le [DATE].");
      L.push("Observations ou rectifications : [.....]");
      L.push("");
      L.push("Signature de la personne entendue : ................");
      L.push("[ou : refus de signer, mention portée le [DATE]]");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 8, RAPPORT D'ENQUÊTE");
      L.push(GROS);
      L.push("");
      L.push("            RAPPORT D'ENQUÊTE INTERNE");
      L.push("            " + nomDe(ctx));
      L.push("            Établi le [DATE] par [NOMS et qualités des enquêteurs]");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("1. SAISINE");
      L.push("");
      L.push("   1.1 Signalement reçu le [DATE], par [voie : écrit, oral consigné],");
      L.push("       émanant de [qualité de l'auteur].");
      L.push("   1.2 Objet du signalement, tel qu'il a été formulé : [REPRENDRE LES");
      L.push("       TERMES DU SIGNALEMENT, sans les requalifier].");
      L.push("   1.3 Mesures immédiates arrêtées le [DATE] : [RAPPELER].");
      L.push("   1.4 Décision d'enquête du [DATE] : auteur(s), périmètre, calendrier.");
      L.push("   1.5 Déport : [mentionner les vérifications faites sur l'impartialité");
      L.push("       des enquêteurs].");
      L.push("");
      L.push("2. MÉTHODE");
      L.push("");
      L.push("   2.1 Ce qui a été fait : [nombre] auditions, [nombre] pièces recueillies,");
      L.push("       [constatations sur place, le cas échéant].");
      L.push("   2.2 Comment les personnes ont été entendues : convocation écrite,");
      L.push("       mentions lues, compte rendu relu et signé.");
      L.push("   2.3 CE QUI N'A PAS PU ÊTRE FAIT, et pourquoi : [personne qui n'a pas");
      L.push("       souhaité être entendue, salarié parti de l'entreprise, pièce non");
      L.push("       retrouvée, période trop ancienne]. CETTE RUBRIQUE EST OBLIGATOIRE.");
      L.push("       Un rapport qui tait ses limites perd sa crédibilité entière quand");
      L.push("       l'une d'elles apparaît.");
      L.push("");
      L.push("3. ACTES ACCOMPLIS, TABLEAU CHRONOLOGIQUE");
      L.push("");
      L.push("   Date | Acte                          | Personne     | Pièce cotée");
      L.push("   -----|-------------------------------|--------------|-------------");
      L.push("   [..] | réception du signalement      | [..........] | [P1]");
      L.push("   [..] | accusé de réception           | [..........] | [P2]");
      L.push("   [..] | décision de mesures immédiates| [..........] | [P3]");
      L.push("   [..] | décision d'enquête            | [..........] | [P4]");
      L.push("   [..] | audition                      | [..........] | [P.]");
      L.push("   [..] | audition                      | [..........] | [P.]");
      L.push("   [..] | audition                      | [..........] | [P.]");
      L.push("   [..] | remise de pièces              | [..........] | [P.]");
      L.push("");
      L.push("4. ÉLÉMENTS RECUEILLIS");
      L.push("");
      L.push("   Fait par fait, et sans mélanger ce qui est dit et ce qui est conclu.");
      L.push("");
      L.push("   FAIT n° 1, [énoncé, daté, circonstancié]");
      L.push("     · ce qu'en dit la personne qui a signalé : [.....]");
      L.push("     · ce qu'en dit la personne mise en cause : [.....]");
      L.push("     · ce qu'en disent les témoins : [.....]");
      L.push("     · pièces s'y rapportant : [cotes]");
      L.push("     · points concordants : [.....]");
      L.push("     · points contradictoires : [.....]");
      L.push("");
      L.push("   FAIT n° 2, [même structure]");
      L.push("   FAIT n° 3, [même structure]");
      L.push("");
      L.push("5. ANALYSE");
      L.push("");
      L.push("   5.1 Pour chaque fait : les éléments recueillis permettent-ils de le");
      L.push("       tenir pour établi, et sur quoi repose cette appréciation ?");
      L.push("   5.2 Rapprochement des faits établis avec les définitions légales,");
      L.push("       CITÉES et non résumées : L. 1152-1 pour le harcèlement moral,");
      L.push("       L. 1153-1 pour le harcèlement sexuel. Vérifier notamment, pour");
      L.push("       L. 1153-1, les cas a) et b), plusieurs auteurs, et le 2°, où la");
      L.push("       pression grave n'a pas besoin d'être répétée.");
      L.push("   5.3 Ce qui, sans relever de ces définitions, révèle un dysfonctionnement");
      L.push("       de l'organisation du travail : [.....]. Cette rubrique est utile :");
      L.push("       beaucoup de situations n'entrent pas dans les définitions et");
      L.push("       appellent pourtant une mesure.");
      L.push("");
      L.push("6. CONCLUSIONS");
      L.push("");
      L.push("   Une seule case, et elle n'est pas pré-remplie :");
      L.push("");
      L.push("   [ ] LES FAITS SONT ÉTABLIS. Lesquels : [.....]. Sur quels éléments :");
      L.push("       [.....].");
      L.push("");
      L.push("   [ ] LES FAITS NE SONT PAS ÉTABLIS. Sur quels éléments : [.....].");
      L.push("       ATTENTION AU SENS DE CETTE CASE : « non établis » ne veut pas dire");
      L.push("       « inventés ». Le rapport ne conclut à la mauvaise foi de l'auteur");
      L.push("       du signalement que s'il l'établit expressément, par des éléments");
      L.push("       qu'il énonce. À défaut, la protection de L. 1152-2 et L. 1153-2");
      L.push("       joue pleinement, et toute mesure défavorable prise contre lui");
      L.push("       serait une représaille.");
      L.push("");
      L.push("   [ ] LES ÉLÉMENTS SONT INSUFFISANTS POUR CONCLURE. Pourquoi : [.....].");
      L.push("       Ce qui a manqué : [.....]. Cette case n'est pas un échec : c'est");
      L.push("       parfois la seule conclusion honnête. Elle appelle des mesures");
      L.push("       d'organisation, pas le classement du dossier.");
      L.push("");
      L.push("7. SUITES ENVISAGÉES");
      L.push("");
      L.push("   7.1 MESURES POUR METTRE UN TERME AUX FAITS ou à la situation :");
      L.push("       [.....], L. 1153-5 impose d'y mettre un terme, et cette obligation");
      L.push("       est distincte de celle de sanctionner.");
      L.push("   7.2 SANCTION, si les faits sont établis : [proposition]. Elle se prend");
      L.push("       selon la procédure disciplinaire, convocation, entretien,");
      L.push("       notification écrite et motivée dans les délais, que le module");
      L.push("       « discipline » de cette application traite. LE DÉLAI DE DEUX MOIS");
      L.push("       DE L'ARTICLE L. 1332-4 COURT : vérifiez-le avant toute autre chose.");
      L.push("   7.3 MESURES D'ORGANISATION, quelle que soit la conclusion : [.....].");
      L.push("   7.4 MISE À JOUR DU DOCUMENT UNIQUE : le signalement est une information");
      L.push("       supplémentaire intéressant l'évaluation d'un risque, au sens de");
      L.push("       R. 4121-2, 3°. Le volet « harcèlement » se relit, que les faits");
      L.push("       aient été établis ou non.");
      L.push("   7.5 SUIVI : point avec la personne qui a signalé le [DATE] puis le");
      L.push("       [DATE], pour vérifier que la situation a cessé et qu'aucune mesure");
      L.push("       défavorable n'a suivi.");
      L.push("");
      L.push("8. PIÈCES ANNEXÉES");
      L.push("");
      L.push("   [LISTE COTÉE, dans l'ordre du tableau du 3.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 9, COURRIERS DE CLÔTURE");
      L.push(GROS);
      L.push("");
      L.push("A, À LA PERSONNE QUI A SIGNALÉ");
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM, PRÉNOM]", "[fonction et service]"], true));
      L.push("Objet : clôture de l'instruction de votre signalement du [DATE]");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("L'enquête ouverte à la suite de votre signalement du [DATE] est close. Vous");
      L.push("avez été entendu(e) le [DATE], ainsi que [nombre] autres personnes.");
      L.push("");
      L.push("[CHOISIR UNE SEULE SUITE, celle qui correspond à la conclusion du rapport :");
      L.push(", Les faits sont établis. Les mesures suivantes ont été prises : [.....].");
      L.push("   [Le cas échéant : une procédure disciplinaire a été engagée. Son issue");
      L.push("   ne peut pas vous être communiquée dans le détail.]");
      L.push(", Les faits n'ont pas pu être établis au vu des éléments recueillis. Les");
      L.push("   mesures suivantes ont néanmoins été prises : [.....].");
      L.push(", Les éléments recueillis n'ont pas permis de conclure. Les mesures");
      L.push("   suivantes ont été prises : [.....].]");
      L.push("");
      L.push("Un point sera fait avec vous le [DATE], puis le [DATE].");
      L.push("");
      L.push("Je vous rappelle que la protection prévue par les articles L. 1152-2 et");
      L.push("L. 1153-2 du code du travail continue de vous être acquise : signalez-moi");
      L.push("immédiatement toute décision vous concernant qui vous paraîtrait liée à");
      L.push("votre signalement.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Madame, Monsieur"));
      L.push("");
      L.push("B, À LA PERSONNE MISE EN CAUSE");
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM, PRÉNOM]", "[fonction et service]"], true));
      L.push("Objet : clôture de l'enquête interne ouverte le [DATE]");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("L'enquête interne ouverte le [DATE], dans le cadre de laquelle vous avez");
      L.push("été entendu(e) le [DATE], est close.");
      L.push("");
      L.push("[CHOISIR UNE SEULE SUITE :");
      L.push(", Les faits qui vous étaient imputés n'ont pas été établis. Aucune suite");
      L.push("   n'y est donnée, et aucune mention n'en sera portée à votre dossier");
      L.push("   individuel.");
      L.push(", Les éléments recueillis n'ont pas permis de conclure. Aucune sanction");
      L.push("   n'est prononcée. [Le cas échéant : les mesures d'organisation suivantes");
      L.push("   sont prises, qui ne constituent pas une sanction : .....]");
      L.push(", Les faits suivants ont été retenus : [.....]. Vous serez convoqué(e) à");
      L.push("   un entretien préalable par une lettre distincte, qui vous précisera");
      L.push("   l'objet de la convocation, la date, l'heure et le lieu de l'entretien,");
      L.push("   et rappellera votre faculté de vous faire assister. AUCUNE SANCTION");
      L.push("   N'EST PRONONCÉE PAR LA PRÉSENTE LETTRE.]");
      L.push("");
      L.push("[Les mesures provisoires prises le [DATE] sont levées / maintenues");
      L.push(" jusqu'à [DATE] pour la raison suivante : .....]");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Madame, Monsieur"));
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Les délais ci-dessous sont proposés : aucun texte lu n'en fixe. Ce que les");
      L.push("textes fixent, c'est l'obligation d'agir, et le temps passé sans agir se");
      L.push("lira sur les dates du dossier.");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", accusé de réception (pièce 1) et");
      L.push("examen des mesures immédiates (pièce 2). Ces deux actes ne supposent");
      L.push("aucune enquête et ne dépendent que de vous.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 3)) + " au plus tard, les mesures immédiates");
      L.push("sont arrêtées et écrites, avec la vérification du point 4 : ne pas faire");
      L.push("peser la mesure sur celui qui a parlé.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + ", la décision d'enquête est signée");
      L.push("(pièce 3) : qui enquête, sur quoi, jusqu'à quand.");
      L.push("");
      L.push("Du " + leJour(dans(d0, 8)) + " au " + leJour(dans(d0, 42)) + ", les");
      L.push("auditions (pièces 4 à 7) et le recueil des pièces. Entendre la personne");
      L.push("mise en cause AVANT toute conclusion, jamais après.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 49)) + ", le rapport est établi (pièce 8).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 56)) + ", les suites sont décidées et les");
      L.push("courriers de clôture partent (pièce 9).");
      L.push("");
      L.push("SI UNE SANCTION EST ENVISAGÉE, UN AUTRE DÉLAI COMMANDE, ET CELUI-LÀ EST");
      L.push("DANS LA LOI : « Aucun fait fautif ne peut donner lieu à lui seul à");
      L.push("l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois");
      L.push("à compter du jour où l'employeur en a eu connaissance » (L. 1332-4, article");
      L.push("du corpus du module « discipline » de cette application). Compté depuis");
      L.push("aujourd'hui, ce délai conduirait au " + leJour(dans(d0, 61)) + " environ :");
      L.push("il peut donc expirer AVANT la fin d'une enquête menée en huit semaines.");
      L.push("Portez la date de connaissance des faits en tête du dossier, et faites");
      L.push("vérifier ce point par le module « discipline » avant d'engager quoi que ce");
      L.push("soit.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 84)) + " puis au " + leJour(dans(d0, 175)) + " -");
      L.push("les points de suivi avec la personne qui a signalé. C'est l'étape que");
      L.push("l'on saute, et c'est elle qui prouve qu'on a mis un terme.");

      return L.concat(pied("L. 1153-5, L. 1152-4, L. 1152-1, L. 1153-1, L. 1152-2, " +
        "L. 1153-2, L. 4121-1, L. 1155-2, R. 4121-2, D. 1151-1",
        ["Décision citée, lue à la source dans la base Judilibre de la Cour de",
         "cassation, réponse non relaxée : Soc., 18 juin 2025, n° 23-19.022, publié -",
         "la valeur probante d'une enquête interne relève de l'appréciation souveraine",
         "des juges du fond, au regard le cas échéant des autres éléments de preuve.",
         "",
         "LA SEULE PEINE QUE CE MODULE PUISSE ANNONCER EN MATIÈRE DE HARCÈLEMENT SE",
         "TROUVE ICI, ET ELLE NE VISE PAS CE QUE L'ON CROIT. « Sont punis d'un an",
         "d'emprisonnement et d'une amende de 3 750 € les faits de discriminations",
         "commis à la suite d'un harcèlement moral ou sexuel définis aux articles",
         "L. 1152-2, L. 1153-2 et L. 1153-3 du présent code. La juridiction peut",
         "également ordonner, à titre de peine complémentaire, l'affichage du jugement",
         "aux frais de la personne condamnée dans les conditions prévues à l'article",
         "131-35 du code pénal et son insertion, intégrale ou par extraits, dans les",
         "journaux qu'elle désigne. Ces frais ne peuvent excéder le montant maximum de",
         "l'amende encourue » (L. 1155-2).",
         "",
         "Ce texte punit les REPRÉSAILLES, la mesure prise contre celui qui a subi,",
         "refusé de subir, relaté ou témoigné -, non l'insuffisance d'une enquête ni",
         "l'absence de prévention. C'est la raison pour laquelle chaque pièce de ce",
         "dossier rappelle la protection de L. 1152-2 et L. 1153-2, et pourquoi le",
         "rapport distingue expressément « faits non établis » de « signalement",
         "mensonger ».",
         "",
         "L. 1153-3, l'un des trois articles visés par L. 1155-2, n'a pas été lu par",
         "l'application : elle le nomme sans en reproduire le contenu. L. 1121-2, les",
         "articles 10-1 et 12 à 13-1 de la loi n° 2016-1691 du 9 décembre 2016 et",
         "l'article 131-35 du code pénal ne l'ont pas été davantage.",
         "",
         "L. 1332-4, cité pour le délai de deux mois, appartient au corpus du module",
         "« discipline » (moteur/discipline/textes-discipline.json), où il a été lu à",
         "la source. Les autres règles de la procédure disciplinaire s'y trouvent."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     LES PIÈCES DE L'AUDIT SOCIAL QUI N'AVAIENT PAS DE PARCOURS

     Le module social recense quatre-vingt-dix obligations. Trente-cinq
     n'avaient aucune procédure guidée derrière elles : la question posée, un
     « non » ne menait nulle part. Celles qui sont un ÉCRIT sont reprises ici,
     avec le document déjà rédigé. Les autres - une durée maximale de travail,
     un repos quotidien, une interdiction de discriminer - ne se règlent pas
     par un document et ne sont pas transformées en formulaire pour le plaisir
     d'avoir une pièce à sortir.

     Le registre des dangers graves et imminents, la fiche d'entreprise et le
     plan de prévention manquaient aussi au social : ils sont écrits dans
     docs/documents-sst.js et servent aux deux écrans, une seule fois écrits.
     ══════════════════════════════════════════════════════════════════════ */

  var PI = global.Pieces;
  if (!PI || typeof PI.ajouter !== "function") {
    /* Sans documents-sst.js (l'épreuve epreuve/tester-generateurs.mjs charge
       ce fichier seul, après documents-produits.js), les cinq générateurs
       ci-dessus suffisent : les pièces et l'écran qui suivent ne se montent
       pas, et rien ne casse. */
    return;
  }

  var U = PI.outils;
  var feuille = U.feuille, val = U.val, dateVal = U.dateVal, teteDocument = U.teteDocument;
  var nomDe = U.nomDe, adresseDe = U.adresseDe, signataire = U.signataire;
  var villeDe = U.villeDe, leJourDu = U.leJourDu;

  function effectifNombre(profil) {
    var v = (profil || {}).effectif;
    if (v === undefined || v === null || String(v).trim() === "") return null;
    var n = Number(v);
    return isFinite(n) ? n : null;
  }

  /* ══════════════════════════════════════════════════════════════════════
     LE REGISTRE UNIQUE DE SÉCURITÉ

     Prudence sur ce que dit le texte : L. 4711-1 ne dresse pas la liste des
     vérifications, il dit que les attestations, consignes, résultats et
     rapports « comportent des mentions obligatoires déterminées par voie
     réglementaire ». L. 4711-5 autorise seulement à réunir sur un registre
     unique ce que d'autres textes prévoient de tenir séparément. Le document
     produit ici est donc un classeur et son sommaire, pas un référentiel des
     contrôles techniques : ceux-là dépendent de vos installations, et
     l'application ne les a pas lus.
     ══════════════════════════════════════════════════════════════════════ */

  PI.ajouter({
    id: "PIECE-REGISTRE-SECURITE",
    modules: ["social", "sst"],
    titre: "Registre unique de sécurité",
    question: "Avez-vous rassemblé les attestations, rapports et observations relatifs à la santé et à la sécurité ?",
    fichier: "registre-unique-securite",
    renvoi: "L. 4711-1 (LEGIARTI000006903383), L. 4711-2 (LEGIARTI000006903384), " +
            "L. 4711-5 (LEGIARTI000006903389)",
    champs: [
      { c: "lieu", nom: "Où le registre est tenu", ph: "bureau des services généraux" },
      { c: "gardien", nom: "Qui en a la garde", ph: "M. Dupont, responsable des services généraux" },
      { c: "ouvertLe", nom: "Date d'ouverture", t: "date" },
      { c: "verifications", nom: "Vérifications périodiques recensées dans l'entreprise", t: "textarea",
        ph: "installations électriques, extincteurs et robinets d'incendie armés, ascenseur, portes automatiques, chariots élévateurs, échafaudages, aération des ateliers" },
      { c: "organismes", nom: "Organismes qui les réalisent", t: "textarea",
        ph: "[organisme] pour l'électricité et les engins, [organisme] pour les moyens de secours" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      teteDocument(f, ctx, "REGISTRE UNIQUE DE SÉCURITÉ",
        "Vérifications, contrôles, et observations de l'inspection du travail");
      f.p("Registre ouvert le " + dateVal(ctx, "ouvertLe", "date d'ouverture") + ".");
      f.p("Lieu de conservation : " + val(ctx, "lieu", "lieu de conservation") + ". Garde du " +
        "registre : " + val(ctx, "gardien", "nom et fonction") + ".");
      f.p("Il réunit les informations que d'autres textes prévoient de faire figurer dans des " +
        "registres distincts, afin d'en faciliter la conservation et la consultation.");
      f.note("L. 4711-5 autorise cette réunion en un registre unique « dès lors que cette mesure " +
        "est de nature à faciliter la conservation et la consultation de ces informations ». " +
        "Réunir n'est pas remplacer : chaque pièce conserve ses mentions obligatoires.");

      f.h1("Onglet 1 - Attestations, consignes, résultats et rapports de vérification");
      f.p("Y sont classés les attestations, consignes, résultats et rapports relatifs aux " +
        "vérifications et contrôles mis à la charge de l'employeur au titre de la santé et de la " +
        "sécurité au travail.");
      f.p("Vérifications recensées dans l'entreprise : " +
        val(ctx, "verifications", "liste des vérifications périodiques"));
      f.p("Organismes qui les réalisent : " + val(ctx, "organismes", "organismes et coordonnées"));
      f.p("Tableau de suivi : objet de la vérification | date | organisme | conclusions | " +
        "observations levées le | prochaine échéance.");
      f.p("....................  | ..........  | ..........  | ..........  | ..........  | ..........");
      f.p("....................  | ..........  | ..........  | ..........  | ..........  | ..........");
      f.note("L. 4711-1 : ces documents comportent des mentions obligatoires déterminées par " +
        "voie réglementaire. Le rythme et le contenu de chaque vérification dépendent de vos " +
        "installations et de textes techniques que l'application n'a pas lus : la liste " +
        "ci-dessus est celle que vous recensez, pas celle qu'un texte imposerait.");

      f.h1("Onglet 2 - Observations et mises en demeure de l'inspection du travail");
      f.p("Y sont conservées les observations et mises en demeure notifiées par l'inspection du " +
        "travail en matière de santé et de sécurité, de médecine du travail et de prévention des " +
        "risques.");
      f.p("Date de notification | objet | suites données | date d'exécution | pièce justificative");
      f.p("..........  | ..........  | ..........  | ..........  | ..........");
      f.note("L. 4711-2, dans ses termes : ces observations et mises en demeure « sont " +
        "conservées par l'employeur ». Conserver la réponse et la preuve de l'exécution vaut " +
        "autant que conserver la mise en demeure.");

      f.h1("Onglet 3 - Ce qui reste ailleurs");
      f.p("Le document unique d'évaluation des risques et ses versions successives, le registre " +
        "des dangers graves et imminents et les consignes de sécurité incendie ont leur propre " +
        "régime : ils sont mentionnés ici pour dire où ils se trouvent, et n'y sont pas classés.");
      f.p("Document unique : ..........   Registre des dangers graves et imminents : ..........   " +
        "Consignes incendie : ..........");
      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + "\n\n" + signataire(ctx) +
        "\n" + nomDe(ctx));
      return f.L;
    },
    attendus: [
      { cle: "verifications", objet: "Les attestations, résultats et rapports de vérification",
        mots: ["vérification", "rapport", "attestation", "contrôle périodique"],
        renvoi: "L. 4711-1",
        clause: ["Onglet 1 - Attestations, consignes, résultats et rapports relatifs aux " +
          "vérifications et contrôles mis à la charge de l'employeur au titre de la santé et de " +
          "la sécurité au travail : [objet, date, organisme, conclusions, suites]."] },
      { cle: "inspection", objet: "Les observations et mises en demeure de l'inspection du travail",
        mots: ["mise en demeure", "observations", "inspection du travail"],
        renvoi: "L. 4711-2",
        clause: ["Onglet 2 - Observations et mises en demeure notifiées par l'inspection du " +
          "travail en matière de santé et de sécurité, de médecine du travail et de prévention " +
          "des risques, conservées avec les suites qui leur ont été données."] },
      { cle: "unique", objet: "La réunion des informations en un registre unique",
        mots: ["registre unique", "réunir", "classeur unique"],
        renvoi: "L. 4711-5",
        clause: ["Les informations énumérées aux articles L. 4711-1 et L. 4711-2 sont réunies " +
          "dans le présent registre unique, cette mesure facilitant leur conservation et leur " +
          "consultation."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LE RÉFÉRENT HANDICAP

     L. 5213-6-1 (LEGIARTI000043894133, lu deux fois le 7 septembre 2026) :
     dans toute entreprise employant au moins deux cent cinquante salariés. Le
     franchissement du seuil s'apprécie selon L. 130-1 du code de la sécurité
     sociale, que l'application n'a pas lu : elle nomme l'article et ne calcule
     rien à sa place. Ne pas confondre ce référent-là avec celui du harcèlement
     sexuel, qui a le même seuil et un autre objet (L. 1153-5-1).
     ══════════════════════════════════════════════════════════════════════ */

  PI.ajouter({
    id: "PIECE-REFERENT-HANDICAP",
    modules: ["social"],
    titre: "Désignation du référent handicap",
    question: "Avez-vous désigné un référent chargé d'orienter, d'informer et d'accompagner les personnes en situation de handicap ?",
    fichier: "designation-referent-handicap",
    renvoi: "L. 5213-6-1 (LEGIARTI000043894133)",
    due: function (profil) {
      var n = effectifNombre(profil);
      if (n === null) return null;
      return n >= 250;
    },
    champs: [
      { c: "referent", nom: "Référent désigné (nom et prénom)", ph: "Madame Inès MOREAU" },
      { c: "fonction", nom: "Sa fonction", ph: "chargée de mission ressources humaines" },
      { c: "effet", nom: "Date d'effet", t: "date" },
      { c: "contact", nom: "Comment le joindre", ph: "referent-handicap@[entreprise].fr, poste 4412, bureau B12" },
      { c: "temps", nom: "Temps consacré à la mission", ph: "un jour par semaine" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      teteDocument(f, ctx, "DÉSIGNATION DU RÉFÉRENT HANDICAP", null);
      f.p("Dans toute entreprise employant au moins deux cent cinquante salariés, est désigné un " +
        "référent chargé d'orienter, d'informer et d'accompagner les personnes en situation de " +
        "handicap.");
      f.p(val(ctx, "referent", "nom et prénom") + ", " + val(ctx, "fonction", "fonction") +
        ", est désigné référent handicap de " + nomDe(ctx) + " à compter du " +
        dateVal(ctx, "effet", "date d'effet") + ".");
      f.note("L. 5213-6-1, première phrase. Le même article renvoie, pour l'effectif et le " +
        "franchissement du seuil, à l'article L. 130-1 du code de la sécurité sociale : " +
        "l'application ne l'a pas lu et ne calcule pas votre effectif à sa place.");

      f.h1("La mission");
      f.puce("Orienter les personnes en situation de handicap dans l'entreprise et vers les " +
        "interlocuteurs qui peuvent les aider.");
      f.puce("Les informer de leurs droits et des dispositifs qui les concernent.");
      f.puce("Les accompagner dans leurs démarches, à leur demande.");
      f.p("À la demande du travailleur concerné, le référent participe au rendez-vous de liaison " +
        "prévu à l'article L. 1226-1-3 du code du travail, ainsi qu'aux échanges organisés sur le " +
        "fondement du dernier alinéa du I de l'article L. 4624-2-2.");
      f.p("Dans les deux cas, il est tenu à une obligation de discrétion à l'égard des " +
        "informations à caractère personnel qu'il est amené à connaître.");
      f.note("Ces deux paragraphes reprennent L. 5213-6-1 dans ses termes. Les articles " +
        "L. 1226-1-3 et L. 4624-2-2 sont nommés parce que L. 5213-6-1 y renvoie : l'application " +
        "ne les a pas lus et n'en reproduit pas le contenu.");

      f.h1("Les moyens");
      f.p("Temps consacré à la mission : " + val(ctx, "temps", "temps consacré") + ".");
      f.p("Le référent est joignable : " + val(ctx, "contact", "courriel, téléphone, bureau") + ".");
      f.p("Sa désignation et ses coordonnées sont portées à la connaissance de l'ensemble du " +
        "personnel et affichées avec les autres informations obligatoires.");
      f.note("La diffusion n'est pas exigée par L. 5213-6-1 : un référent que personne ne peut " +
        "nommer ni joindre ne remplit aucune de ses trois missions, d'où cette clause.");
      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + "\n\n" + signataire(ctx) +
        "\n" + nomDe(ctx));
      return f.L;
    },
    attendus: [
      { cle: "nomme", objet: "Le nom du référent désigné",
        mots: ["référent", "désigné", "handicap"],
        renvoi: "L. 5213-6-1",
        clause: ["[Nom et prénom], [fonction], est désigné référent chargé d'orienter, " +
          "d'informer et d'accompagner les personnes en situation de handicap, à compter du [date]."] },
      { cle: "mission", objet: "Les trois missions : orienter, informer, accompagner",
        mots: ["orienter", "informer", "accompagner"],
        renvoi: "L. 5213-6-1",
        clause: ["Le référent oriente, informe et accompagne les personnes en situation de " +
          "handicap."] },
      { cle: "liaison", objet: "La participation au rendez-vous de liaison, à la demande du salarié",
        mots: ["rendez-vous de liaison", "L. 1226-1-3", "L. 4624-2-2"],
        renvoi: "L. 5213-6-1",
        clause: ["À la demande du travailleur concerné, le référent participe au rendez-vous de " +
          "liaison prévu à l'article L. 1226-1-3 ainsi qu'aux échanges organisés sur le fondement " +
          "du dernier alinéa du I de l'article L. 4624-2-2."] },
      { cle: "discretion", objet: "L'obligation de discrétion",
        mots: ["discrétion", "confidentialité"],
        renvoi: "L. 5213-6-1",
        clause: ["Le référent est tenu à une obligation de discrétion à l'égard des informations " +
          "à caractère personnel qu'il est amené à connaître."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LE LIVRET D'ÉPARGNE SALARIALE

     L'obligation ne naît que si l'entreprise propose l'un des six dispositifs
     que L. 3341-6 énumère : la pièce demande donc d'abord lesquels, et refuse
     de sortir un livret quand aucun n'est coché - un livret qui ne présente
     rien ne serait pas un document, ce serait un papier.
     ══════════════════════════════════════════════════════════════════════ */

  PI.ajouter({
    id: "PIECE-LIVRET-EPARGNE",
    modules: ["social"],
    titre: "Livret d'épargne salariale",
    question: "Remettez-vous un livret d'épargne salariale à chaque embauche ?",
    fichier: "livret-epargne-salariale",
    renvoi: "L. 3341-6 (LEGIARTI000043975313)",
    champs: [
      { c: "dispositifs", nom: "Dispositifs en place dans l'entreprise", t: "textarea",
        ph: "accord d'intéressement du 3 mars 2025, plan d'épargne entreprise ouvert le 1er janvier 2020" },
      { c: "gestionnaire", nom: "Teneur de compte ou gestionnaire", ph: "[établissement], service épargne salariale" },
      { c: "modalites", nom: "Versements, abondement, déblocage", t: "textarea",
        ph: "versements volontaires jusqu'à 25 % de la rémunération annuelle, abondement de 100 % dans la limite de 500 euros par an, blocage de cinq ans sauf cas de déblocage anticipé" },
      { c: "contact", nom: "Qui répond aux questions dans l'entreprise", ph: "service paie, poste 4402" },
    ],
    refus: function (ctx) {
      var d = ((ctx.valeurs || {}).dispositifs || "").trim();
      if (d !== "") return null;
      return ["L'obligation de remettre un livret d'épargne salariale ne pèse que sur " +
        "l'entreprise qui propose un dispositif d'intéressement, de participation, un plan " +
        "d'épargne entreprise, un plan d'épargne interentreprises, un plan d'épargne pour la " +
        "retraite collectif ou un plan d'épargne retraite d'entreprise collectif (L. 3341-6).",
        "Nommez à gauche le ou les dispositifs en place : le livret s'écrira. Si vous n'en avez " +
        "aucun, il n'y a pas de livret à remettre, et rien à régulariser ici."];
    },
    blocs: function (ctx) {
      var f = feuille();
      teteDocument(f, ctx, "LIVRET D'ÉPARGNE SALARIALE",
        "Remis lors de la conclusion du contrat de travail");
      f.p("Ce livret présente les dispositifs d'épargne salariale mis en place au sein de " +
        nomDe(ctx) + ". Il vous est remis lors de la conclusion de votre contrat de travail.");
      f.note("L. 3341-6 : tout salarié d'une entreprise proposant un dispositif d'intéressement, " +
        "de participation, un plan d'épargne entreprise, un plan d'épargne interentreprises, un " +
        "plan d'épargne pour la retraite collectif ou un plan d'épargne retraite d'entreprise " +
        "collectif reçoit ce livret lors de la conclusion de son contrat de travail.");

      f.h1("Les dispositifs en place");
      f.p(val(ctx, "dispositifs", "dispositifs, avec la date de l'accord ou du règlement"));
      f.p("Le texte de chaque accord ou règlement est tenu à votre disposition et vous en " +
        "recevez copie sur simple demande.");

      f.h1("Comment cela fonctionne");
      f.p(val(ctx, "modalites", "versements, abondement, durée de blocage, cas de déblocage"));
      f.p("Teneur de compte ou gestionnaire : " + val(ctx, "gestionnaire", "établissement et coordonnées") + ".");
      f.p("Dans l'entreprise, vos questions se posent à : " + val(ctx, "contact", "service et coordonnées") + ".");
      f.note("Les montants, plafonds et cas de déblocage ne sont pas écrits par l'application : " +
        "ils sortent de vos accords et du code du travail sur chaque dispositif, que le module " +
        "n'a pas lus. Recopiez-les de vos textes, ne les devinez pas.");

      f.h1("Ce qui se passe si vous quittez l'entreprise");
      f.p("Un état récapitulatif de vos avoirs vous est remis à votre départ. Indiquez au " +
        "gestionnaire l'adresse à laquelle vous joindre : c'est ce qui évite les avoirs en " +
        "déshérence.");
      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + "\n\n" + signataire(ctx) +
        "\n" + nomDe(ctx));
      f.note("Le livret est également porté à la connaissance des représentants du personnel, le " +
        "cas échéant en tant qu'élément de la base de données économiques, sociales et " +
        "environnementales établie en application de l'article L. 2312-18 (L. 3341-6, second " +
        "alinéa). Faites signer un accusé de remise et classez-le au dossier du salarié : " +
        "l'obligation se prouve par la remise.");
      return f.L;
    },
    attendus: [
      { cle: "dispositifs", objet: "La présentation des dispositifs mis en place",
        mots: ["intéressement", "participation", "plan d'épargne", "PERCO", "PERECO"],
        renvoi: "L. 3341-6",
        clause: ["Dispositifs d'épargne salariale mis en place dans l'entreprise : [intitulé de " +
          "chaque accord ou règlement, avec sa date]."] },
      { cle: "remise", objet: "La remise lors de la conclusion du contrat de travail",
        mots: ["lors de la conclusion", "à l'embauche", "remis"],
        renvoi: "L. 3341-6",
        clause: ["Ce livret est remis au salarié lors de la conclusion de son contrat de travail."] },
      { cle: "representants", objet: "L'information des représentants du personnel",
        mots: ["représentants du personnel", "comité social", "base de données"],
        renvoi: "L. 3341-6",
        clause: ["Le livret est porté à la connaissance des représentants du personnel, le cas " +
          "échéant en tant qu'élément de la base de données économiques, sociales et " +
          "environnementales établie en application de l'article L. 2312-18."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     L'INFORMATION DE L'INSPECTION DU TRAVAIL APRÈS UN ACCIDENT MORTEL

     Douze heures, et cinq éléments : R. 4121-5 est l'un des rares textes qui
     écrit lui-même le contenu du courrier. Le document le suit point par
     point, et l'écran le sort d'un clic parce que ce jour-là, personne n'a le
     temps de chercher comment rédiger.
     ══════════════════════════════════════════════════════════════════════ */

  PI.ajouter({
    id: "PIECE-ACCIDENT-MORTEL",
    modules: ["social", "sst"],
    titre: "Information de l'inspection du travail après un accident mortel",
    question: "Savez-vous informer l'inspection du travail dans les douze heures d'un accident du travail mortel ?",
    fichier: "information-inspection-accident-mortel",
    renvoi: "R. 4121-5 (LEGIARTI000047665981)",
    champs: [
      { c: "agent", nom: "Agent de contrôle et adresse (unité de contrôle du lieu de l'accident)",
        ph: "DDETS du Nord, unité de contrôle de [ville], [adresse], [courriel]" },
      { c: "victime", nom: "Nom, prénom de la victime", ph: "Monsieur [nom et prénom]" },
      { c: "naissance", nom: "Date de naissance de la victime", t: "date" },
      { c: "quand", nom: "Date et heure de l'accident", ph: "le 7 septembre 2026 à 14 h 20" },
      { c: "ou", nom: "Lieu de l'accident", ph: "atelier de production, bâtiment A" },
      { c: "circonstances", nom: "Circonstances", t: "textarea",
        ph: "chute depuis une passerelle de maintenance pendant le nettoyage de la ligne 3" },
      { c: "temoins", nom: "Identité et coordonnées des témoins", t: "textarea",
        ph: "M. [nom], [téléphone] ; Mme [nom], [téléphone]" },
      { c: "accueil", nom: "Entreprise où l'accident s'est produit, si différente de l'employeur",
        t: "textarea", ph: "sans objet" },
      { c: "connaissanceLe", nom: "Date à laquelle vous avez eu connaissance du décès", t: "date" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      var v = ctx.valeurs || {};
      f.t1("INFORMATION DE L'INSPECTION DU TRAVAIL");
      f.st("Accident du travail ayant entraîné le décès d'un travailleur");
      f.p(nomDe(ctx));
      f.p(adresseDe(ctx));
      f.vide();
      f.p(val(ctx, "agent", "agent de contrôle de l'inspection du travail compétent pour le lieu de l'accident"));
      f.vide();
      f.p(villeDe(ctx) + ", le " + leJourDu(ctx));
      f.p("Transmis par un moyen conférant date certaine à l'envoi.");
      f.p("Objet : accident du travail mortel survenu le " + val(ctx, "quand", "date et heure"));
      f.vide();
      f.p("Madame, Monsieur l'agent de contrôle,");
      f.p("Je vous informe du décès d'un travailleur à la suite d'un accident du travail, dans " +
        "les conditions de l'article R. 4121-5 du code du travail.");
      f.h1("1. L'entreprise ou l'établissement qui emploie le travailleur");
      f.p(nomDe(ctx) + ", " + adresseDe(ctx) + ". Adresse électronique : " +
        cro(((ctx.profil || {}).courriel), "courriel") + ". Téléphone : " +
        cro(((ctx.profil || {}).telephone), "téléphone") + ".");
      f.h1("2. L'entreprise ou l'établissement où l'accident s'est produit, s'il est différent");
      f.p(val(ctx, "accueil", "dénomination, adresses postale et électronique, téléphone, ou « sans objet »"));
      f.h1("3. La victime");
      f.p(val(ctx, "victime", "nom et prénom") + ", né(e) le " +
        dateVal(ctx, "naissance", "date de naissance") + ".");
      f.h1("4. L'accident");
      f.p("Date et heure : " + val(ctx, "quand", "date et heure") + ".");
      f.p("Lieu : " + val(ctx, "ou", "lieu") + ".");
      f.p("Circonstances : " + val(ctx, "circonstances", "circonstances, décrites sans qualification"));
      f.h1("5. Les témoins");
      f.p(val(ctx, "temoins", "identité et coordonnées des témoins, le cas échéant"));
      f.p("Je me tiens à votre disposition et à celle de vos services.");
      f.sign("\n" + signataire(ctx) + "\n" + nomDe(ctx));
      f.note("R. 4121-5 : l'information est due immédiatement et au plus tard dans les douze " +
        "heures qui suivent le décès, sauf si l'employeur établit qu'il n'a pu en avoir " +
        "connaissance que postérieurement - le délai court alors du moment où il l'a apprise" +
        ((v.connaissanceLe || "") !== "" ? " (ici, le " + dateVal(ctx, "connaissanceLe", "date") + ")" : "") +
        ". Elle se communique par tout moyen permettant de conférer date certaine à l'envoi : " +
        "gardez l'accusé de réception ou le récépissé.");
      f.note("Les cinq rubriques ci-dessus sont celles que R. 4121-5 énumère. Décrivez les " +
        "circonstances sans les qualifier : ce courrier est une information, pas une " +
        "reconnaissance de responsabilité, et il ne remplace pas la déclaration d'accident du " +
        "travail à la caisse, qui obéit à d'autres textes que l'application n'a pas lus.");
      return f.L;
    },
    attendus: [
      { cle: "entreprise", objet: "L'entreprise employeuse et ses coordonnées",
        mots: ["raison sociale", "adresse", "téléphone"],
        renvoi: "R. 4121-5, 1°",
        clause: ["Entreprise ou établissement qui emploie le travailleur au moment de " +
          "l'accident : [dénomination], [adresse postale], [adresse électronique], [téléphone]."] },
      { cle: "accueil", objet: "L'entreprise où l'accident s'est produit, si elle est différente",
        mots: ["lieu de l'accident", "entreprise utilisatrice", "établissement où"],
        renvoi: "R. 4121-5, 2°",
        clause: ["Le cas échéant, entreprise ou établissement dans lequel l'accident s'est " +
          "produit s'il est différent : [dénomination], [adresses], [téléphone]."] },
      { cle: "victime", objet: "Les nom, prénom et date de naissance de la victime",
        mots: ["victime", "né le", "date de naissance"],
        renvoi: "R. 4121-5, 3°",
        clause: ["Victime : [nom], [prénom], né(e) le [date de naissance]."] },
      { cle: "accident", objet: "Les date, heure, lieu et circonstances",
        mots: ["circonstances", "heure", "lieu"],
        renvoi: "R. 4121-5, 4°",
        clause: ["Date, heure, lieu et circonstances de l'accident : [description factuelle]."] },
      { cle: "temoins", objet: "L'identité et les coordonnées des témoins",
        mots: ["témoin", "témoins"],
        renvoi: "R. 4121-5, 5°",
        clause: ["Identité et coordonnées des témoins, le cas échéant : [noms et coordonnées]."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LA CONVENTION INDIVIDUELLE DE FORFAIT EN JOURS

     Le refus est ici la partie la plus utile du document. L. 3121-63 : les
     forfaits annuels sont mis en place par un accord collectif d'entreprise ou
     d'établissement ou, à défaut, par une convention ou un accord de branche.
     Sans accord, la convention individuelle ne peut pas être valablement
     conclue - et l'écran ne l'écrit pas.
     ══════════════════════════════════════════════════════════════════════ */

  PI.ajouter({
    id: "PIECE-FORFAIT-JOURS",
    modules: ["social"],
    titre: "Convention individuelle de forfait en jours",
    question: "Vos salariés au forfait en jours ont-ils une convention individuelle écrite ?",
    fichier: "convention-forfait-jours",
    renvoi: "L. 3121-63 (LEGIARTI000033003340), L. 3121-64 (LEGIARTI000036262805), " +
            "L. 3121-65 (LEGIARTI000036262800)",
    champs: [
      { c: "accord", nom: "Accord collectif qui autorise le forfait en jours",
        ph: "accord d'entreprise du 14 juin 2024, ou convention de branche [intitulé]" },
      { c: "salarie", nom: "Salarié", ph: "Madame Claire NGUYEN" },
      { c: "fonctionS", nom: "Fonction et autonomie", ph: "responsable de projet, autonome dans l'organisation de son emploi du temps" },
      { c: "jours", nom: "Nombre de jours travaillés dans l'année", t: "number", ph: "218" },
      { c: "periode", nom: "Période de référence", ph: "année civile" },
      { c: "remuneration", nom: "Rémunération annuelle brute forfaitaire", ph: "48 000 euros" },
      { c: "suivi", nom: "Modalités de suivi de la charge de travail", t: "textarea",
        ph: "document de contrôle mensuel des journées et demi-journées travaillées, visé par le responsable ; point trimestriel sur la charge" },
      { c: "deconnexion", nom: "Modalités du droit à la déconnexion", t: "textarea",
        ph: "pas de courriel attendu entre 20 heures et 7 heures ni le week-end, sauf astreinte ; messagerie coupée pendant les congés" },
      { c: "entretien", nom: "Date du prochain entretien annuel", t: "date" },
    ],
    refus: function (ctx) {
      var a = ((ctx.valeurs || {}).accord || "").trim();
      if (a !== "") return null;
      return ["Aucun accord collectif n'est indiqué. Les forfaits annuels en heures ou en jours " +
        "sur l'année sont mis en place par un accord collectif d'entreprise ou d'établissement " +
        "ou, à défaut, par une convention ou un accord de branche (L. 3121-63).",
        "Sans cet accord, une convention individuelle de forfait en jours ne peut pas être " +
        "valablement conclue : l'application ne l'écrit pas. Portez à gauche l'accord " +
        "applicable, ou négociez-le avant de proposer un forfait."];
    },
    blocs: function (ctx) {
      var f = feuille();
      var v = ctx.valeurs || {};
      var j = Number(v.jours);
      teteDocument(f, ctx, "CONVENTION INDIVIDUELLE DE FORFAIT ANNUEL EN JOURS", null);
      f.p("Entre " + nomDe(ctx) + ", " + adresseDe(ctx) + ", représentée par " + signataire(ctx) +
        ", d'une part,");
      f.p("Et " + val(ctx, "salarie", "nom et prénom du salarié") + ", " +
        val(ctx, "fonctionS", "fonction") + ", d'autre part,");
      f.p("Il est convenu ce qui suit.");

      f.h1("Article 1 - L'accord collectif applicable");
      f.p("La présente convention est conclue en application de l'accord collectif suivant : " +
        val(ctx, "accord", "intitulé et date de l'accord collectif") + ". Cet accord autorise la " +
        "conclusion de conventions individuelles de forfait en jours et en fixe les " +
        "caractéristiques principales.");
      f.note("L. 3121-63 : le forfait annuel se met en place par accord collectif d'entreprise " +
        "ou d'établissement ou, à défaut, par convention ou accord de branche. L. 3121-64, I, 5°, " +
        "veut que cet accord fixe les caractéristiques principales des conventions individuelles, " +
        "qui doivent notamment fixer le nombre de jours compris dans le forfait.");

      f.h1("Article 2 - Le nombre de jours et la période de référence");
      f.p("Le forfait est de " + val(ctx, "jours", "nombre") + " jours travaillés par période de " +
        "référence. Période de référence : " + val(ctx, "periode", "année civile ou autre période de douze mois consécutifs") + ".");
      if (isFinite(j) && j > 218) {
        f.p("Attention : le nombre saisi dépasse deux cent dix-huit jours. L'accord ne peut " +
          "prévoir un nombre de jours supérieur que dans le cas de la renonciation du salarié à " +
          "une partie de ses jours de repos ; hors ce cas, le forfait est plafonné.");
        f.note("L. 3121-64, I, 3° : le nombre de jours compris dans le forfait est déterminé " +
          "« dans la limite de deux cent dix-huit jours s'agissant du forfait en jours ». " +
          "L. 3121-64, II, dernier alinéa, permet à l'accord de fixer un nombre maximal de jours " +
          "travaillés lorsque le salarié renonce à une partie de ses jours de repos en " +
          "application de l'article L. 3121-59, ce nombre devant rester compatible avec les " +
          "repos quotidien et hebdomadaire, les jours fériés chômés et les congés payés.");
      }
      f.p("Les absences, ainsi que les arrivées et départs en cours de période, sont prises en " +
        "compte pour la rémunération dans les conditions fixées par l'accord collectif.");

      f.h1("Article 3 - La rémunération");
      f.p("La rémunération annuelle brute forfaitaire est de " +
        val(ctx, "remuneration", "montant") + ", versée par douzièmes, indépendamment du nombre " +
        "d'heures de travail accomplies chaque mois.");

      f.h1("Article 4 - Le décompte et le suivi de la charge de travail");
      f.p("Un document de contrôle fait apparaître le nombre et la date des journées ou " +
        "demi-journées travaillées. Sous la responsabilité de l'employeur, ce document peut être " +
        "renseigné par le salarié.");
      f.p("Modalités retenues : " + val(ctx, "suivi", "modalités de suivi de la charge"));
      f.p("L'employeur s'assure que la charge de travail du salarié est compatible avec le " +
        "respect des temps de repos quotidiens et hebdomadaires.");
      f.p("Un entretien est organisé une fois par an pour évoquer la charge de travail, qui doit " +
        "être raisonnable, l'organisation du travail, l'articulation entre l'activité " +
        "professionnelle et la vie personnelle ainsi que la rémunération. Prochain entretien : " +
        dateVal(ctx, "entretien", "date") + ".");
      f.note("L. 3121-65, I : ces trois obligations - document de contrôle, vigilance sur la " +
        "compatibilité de la charge avec les repos, entretien annuel - s'appliquent à défaut de " +
        "stipulations conventionnelles prévues aux 1° et 2° du II de l'article L. 3121-64. Si " +
        "votre accord prévoit ses propres modalités d'évaluation et de suivi, ce sont elles qui " +
        "s'appliquent : recopiez-les ici à la place.");

      f.h1("Article 5 - Le droit à la déconnexion");
      f.p(val(ctx, "deconnexion", "modalités d'exercice du droit à la déconnexion"));
      f.note("L. 3121-65, II : à défaut de stipulations conventionnelles prévues au 3° du II de " +
        "l'article L. 3121-64, les modalités d'exercice du droit à la déconnexion sont définies " +
        "par l'employeur et communiquées par tout moyen aux salariés concernés. Dans les " +
        "entreprises d'au moins cinquante salariés, elles sont conformes à la charte mentionnée " +
        "au 7° de l'article L. 2242-17.");

      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + ", en deux exemplaires.\n\n" +
        "Le salarié                                              Pour l'entreprise\n" +
        val(ctx, "salarie", "nom") + "                          " + signataire(ctx));
      f.note("La convention individuelle est écrite et signée : c'est elle qui rend le forfait " +
        "opposable au salarié. Un forfait appliqué sans convention signée, ou sans accord " +
        "collectif l'autorisant, se paie en heures supplémentaires.");
      return f.L;
    },
    attendus: [
      { cle: "accord", objet: "Le renvoi à l'accord collectif qui autorise le forfait",
        mots: ["accord", "convention de branche", "accord d'entreprise"],
        renvoi: "L. 3121-63",
        clause: ["La présente convention est conclue en application de [intitulé et date de " +
          "l'accord collectif d'entreprise, d'établissement ou de branche], qui autorise la " +
          "conclusion de conventions individuelles de forfait en jours."] },
      { cle: "jours", objet: "Le nombre de jours compris dans le forfait",
        mots: ["jours", "218", "forfait de"],
        renvoi: "L. 3121-64, I, 5°",
        clause: ["Le forfait est de [nombre] jours travaillés par période de référence, dans la " +
          "limite de deux cent dix-huit jours."] },
      { cle: "periode", objet: "La période de référence",
        mots: ["période de référence", "année civile", "douze mois"],
        renvoi: "L. 3121-64, I, 2°",
        clause: ["Période de référence du forfait : [année civile, ou toute autre période de " +
          "douze mois consécutifs]."] },
      { cle: "controle", objet: "Le document de contrôle des journées travaillées",
        mots: ["document de contrôle", "décompte", "journées travaillées"],
        renvoi: "L. 3121-65, I, 1°",
        clause: ["Un document de contrôle fait apparaître le nombre et la date des journées ou " +
          "demi-journées travaillées. Sous la responsabilité de l'employeur, ce document peut " +
          "être renseigné par le salarié."] },
      { cle: "entretien", objet: "L'entretien annuel sur la charge de travail",
        mots: ["entretien", "charge de travail"],
        renvoi: "L. 3121-65, I, 3°",
        clause: ["Un entretien est organisé une fois par an pour évoquer la charge de travail, " +
          "qui doit être raisonnable, l'organisation du travail, l'articulation entre l'activité " +
          "professionnelle et la vie personnelle ainsi que la rémunération."] },
      { cle: "deconnexion", objet: "Le droit à la déconnexion",
        mots: ["déconnexion"],
        renvoi: "L. 3121-65, II",
        clause: ["Modalités d'exercice du droit à la déconnexion : [plages sans sollicitation, " +
          "règles d'usage de la messagerie, conduite à tenir pendant les congés]."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     L'ÉCRAN

     Un seul écran pour les deux modules, parce qu'ils font la même chose : une
     question fermée, un « non » qui sort le document, un « oui » qui contrôle
     celui qu'on dépose. Le dupliquer dans deux pages, c'était le corriger une
     fois sur deux.

     CE QU'IL S'INTERDIT. Pas d'introduction, pas d'explication sous les
     champs, pas d'étape numérotée. La liste est l'écran 3 de la maquette
     validée le 8 septembre 2026 : une ligne par pièce, Oui et Non sur la
     ligne. Sur « non », aucune question préalable : le document est déjà
     écrit à partir de la fiche d'entreprise, seul à l'écran (écran 5), les
     champs qui restent en tête, chaque frappe le réécrit ; puis Télécharger
     en Word, Imprimer, et « Voir le texte de loi » replié sous la feuille,
     jamais devant elle. Le bouton Retour du bandeau, posé par droits.js,
     ramène à la liste. Sur « oui », le dépôt du document existant ; sans
     contrôle écrit pour la pièce, la réponse est notée et la ligne passe
     en vert.

     LES CORRECTIONS À LA MAIN SURVIVENT. Un paragraphe corrigé dans la feuille
     est retenu sur l'empreinte de son texte d'origine, pas sur sa place : il
     reste quand le reste se réécrit, et il survit à l'ajout d'un article.
     C'est le mécanisme de docs/gerer.html, repris tel quel.
     ══════════════════════════════════════════════════════════════════════ */

  /* Le complément à docs/style.css, et rien de plus : la feuille commune tient
     déjà les couleurs, les boutons, les champs, les avis et l'impression. Ne
     descend ici que ce que cet écran est seul à afficher : la ligne de
     question telle que la maquette du 8 septembre 2026 la dessine (le nom à
     gauche, Oui vert et Non bleu à droite, un filet dessous), les champs en
     tête du document, et les genres de blocs de la feuille. */
  var STYLE = [
    ".rappel{margin:14px 0 0;font:400 var(--t2)/1.3 system-ui;color:var(--texte-2)}",
    "h2.q{font:600 var(--t5)/1.3 system-ui;color:var(--encre);margin:var(--e4) 0 var(--e3)}",
    ".groupe{margin:14px 0 0;font:600 var(--t0)/1.3 system-ui;letter-spacing:.1em;",
    "text-transform:uppercase;color:var(--texte-2)}",
    ".ligne{display:flex;align-items:center;gap:10px;padding:14px 0;margin:0;",
    "border:0;border-bottom:1px solid var(--filet);border-radius:0;background:none;min-height:var(--h-ligne)}",
    ".ligne>div:first-child{flex:1;min-width:0}",
    ".ligne.repondue{background:var(--vert-clair);margin:0 -10px;padding-left:10px;padding-right:10px;border-radius:var(--r1)}",
    ".ligne.repondue .t{color:var(--vert)}",
    ".ligne .t{font:400 var(--t4)/1.3 system-ui;color:var(--encre)}",
    ".ligne .s{display:block;font-size:var(--t2);color:var(--texte-2);margin-top:2px}",
    ".ligne .b{display:flex;gap:8px;flex:none;flex-wrap:nowrap}",
    ".ligne .b button{font:600 17px/1 system-ui;min-width:74px;min-height:46px;padding:0 12px;",
    "border-radius:var(--r1);cursor:pointer;white-space:nowrap}",
    ".ligne .b [data-oui]{border:2px solid var(--vert);background:var(--vert-clair);color:var(--vert)}",
    ".ligne .b [data-oui]:hover{background:var(--vert);color:#fff;border-color:var(--vert)}",
    ".ligne .b [data-non]{border:2px solid var(--accent);background:var(--accent);color:#fff}",
    ".ligne .b [data-non]:hover{background:var(--accent-fonce);border-color:var(--accent-fonce);color:#fff}",
    "@media (max-width:640px){.ligne .t{font-size:17px}",
    ".ligne .b button{min-width:64px;padding:0 10px;font-size:16px}}",
    "#vue .champs{margin:14px 0 0}",
    "#vue .champs label.ch.plein>.nom{color:var(--vert)}",
    "#vue #cote-doc{margin:14px 0 0}",
    "#vue .barre{margin:14px 0 0}",
    "#vue details.loi{margin:var(--e2) 0 var(--e5)}",
    "#vue details.loi .c{font-size:var(--t2);line-height:1.5;color:var(--texte-2);padding:0 0 var(--e3)}",
    ".reprendre{margin:0 0 var(--e5);font-size:var(--t2);color:var(--texte-2)}",
    ".reprendre button{font:inherit;border:0;background:none;padding:0;min-height:0;color:var(--accent);",
    "text-decoration:underline;cursor:pointer}",
    ".reprendre button:hover{background:none;color:var(--accent-fonce)}",
    ".feuille [contenteditable]{outline:none}",
    ".feuille [contenteditable]:focus{background:#fffbe9;border-radius:3px}",
    ".feuille .modifie{border-left:2px solid var(--vert);padding-left:8px;margin-left:-10px}",
    ".feuille .b-t1{font:700 18px/1.35 system-ui;margin:0 0 6px;text-align:center}",
    ".feuille .b-st{font:600 13.5px/1.4 system-ui;margin:0 0 22px;text-align:center;color:var(--texte-2)}",
    ".feuille .b-h1{font:700 15px/1.35 system-ui;margin:20px 0 7px}",
    ".feuille .b-h2{font:600 14px/1.35 system-ui;margin:15px 0 5px}",
    ".feuille .b-p{margin:0 0 9px;font-size:14.5px;line-height:1.68}",
    ".feuille .b-puce{margin:0 0 5px 18px;font-size:14.5px;line-height:1.6}",
    ".feuille .b-note{margin:9px 0 12px;padding:0 0 0 10px;border-left:2px dashed var(--filet-2);",
    "font-size:var(--t1);font-style:italic;line-height:1.55;color:var(--texte-3)}",
    ".feuille .b-vide{height:9px}",
    ".feuille .b-trait{border:0;border-top:1px solid var(--filet);margin:20px 0}",
    ".feuille .b-saut{border:0;border-top:2px dashed var(--filet-2);margin:30px 0}",
    ".feuille .b-sign{margin:20px 0 0;font-size:14.5px;white-space:pre-wrap;line-height:1.7}",
    ".refus{background:var(--rouge-clair);border:1px solid var(--filet-2);border-radius:var(--r2);",
    "padding:var(--e4);margin:0 0 var(--e3);color:var(--rouge);font-size:var(--t3);line-height:1.6}",
    ".refus b{display:block;margin-bottom:5px;font-size:15.5px}",
    "textarea.depot{min-height:200px;margin:14px 0 0;font:15px/1.5 system-ui}",
    "#lecture{margin:14px 0 0}",
    ".manque{border:1px solid var(--filet);border-left:4px solid var(--ambre);",
    "border-radius:0 var(--r2) var(--r2) 0;background:var(--surface);padding:12px 14px;margin:0 0 var(--e2)}",
    ".manque.trouve{border-left-color:var(--vert)}",
    ".manque .o{font:600 15px/1.35 system-ui;color:var(--encre)}",
    ".manque .clause{margin:var(--e2) 0 0;padding:11px 13px;background:var(--vert-clair);",
    "border-radius:var(--r1);font-size:var(--t2);line-height:1.55;color:var(--vert)}",
    ".manque .clause p{margin:0 0 6px}",
    ".manque label{display:flex;gap:var(--e2);align-items:flex-start;margin:var(--e2) 0 0;font-size:var(--t2)}",
    ".manque label input{margin-top:3px;width:auto}",
    ".manque q{color:var(--encre)}",
    ".manque .fond{margin:var(--e2) 0 0;font-size:var(--t0);color:var(--texte-3)}",
    "pre.sortie{font:14px/1.6 system-ui;background:var(--surface);",
    "border:1px solid var(--filet);border-radius:var(--r2);padding:var(--e4);max-height:64vh;overflow:auto}",
    "@media print{.barre,.champs,.ligne .b,details.loi,.rappel,h2.q,.reprendre{display:none !important}}",
  ].join("\n");

  function ech(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function empreinte(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return "b" + (h >>> 0).toString(36);
  }
  function texteDe(el) {
    var t = el.innerText !== undefined && el.innerText !== null ? el.innerText : el.textContent;
    return String(t).replace(/\u00a0/g, " ");
  }
  function sansAccents(s) {
    return String(s || "").normalize ? String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
                                     : String(s || "").toLowerCase();
  }
  function slug(s) {
    return sansAccents(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "document";
  }

  /* La lecture d'un .docx sans bibliothèque : l'archive est ouverte dans la
     page, le texte est pris dans word/document.xml, et aucun octet ne sort du
     poste. Repris de docs/controler-ri.html, où il a été écrit. */
  function u16(v, i) { return v.getUint16(i, true); }
  function u32(v, i) { return v.getUint32(i, true); }
  function entreeZip(buf, nomVoulu) {
    var v = new DataView(buf), n = buf.byteLength, fin = -1;
    for (var i = n - 22; i >= 0 && i > n - 65558; i--) if (u32(v, i) === 0x06054b50) { fin = i; break; }
    if (fin < 0) throw new Error("Ce fichier n'est pas une archive lisible.");
    var nb = u16(v, fin + 10), pos = u32(v, fin + 16), dec = new TextDecoder("utf-8");
    for (var k = 0; k < nb; k++) {
      if (u32(v, pos) !== 0x02014b50) throw new Error("Répertoire de l'archive illisible.");
      var methode = u16(v, pos + 10), taille = u32(v, pos + 20);
      var lnom = u16(v, pos + 28), lextra = u16(v, pos + 30), lcom = u16(v, pos + 32);
      var debut = u32(v, pos + 42);
      var nom = dec.decode(new Uint8Array(buf, pos + 46, lnom));
      if (nom === nomVoulu) {
        var ln = u16(v, debut + 26), lx = u16(v, debut + 28);
        return { methode: methode, data: new Uint8Array(buf, debut + 30 + ln + lx, taille) };
      }
      pos += 46 + lnom + lextra + lcom;
    }
    throw new Error("Le fichier ne contient pas de document Word (word/document.xml).");
  }
  function inflater(u8) {
    if (typeof DecompressionStream !== "function")
      return Promise.reject(new Error("Ce navigateur ne sait pas décomprimer le fichier. Collez le texte à la place."));
    return new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer();
  }
  function texteDeXml(xml) {
    return xml.replace(/<w:tab[^>]*\/>/g, "\t").replace(/<w:br[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n").replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/\n{3,}/g, "\n\n").trim();
  }
  function lireDocx(fichier) {
    return fichier.arrayBuffer().then(function (buf) {
      var e = entreeZip(buf, "word/document.xml");
      if (e.methode === 0) return new TextDecoder("utf-8").decode(e.data);
      if (e.methode !== 8) throw new Error("Compression inconnue dans ce .docx.");
      return inflater(e.data).then(function (b) { return new TextDecoder("utf-8").decode(new Uint8Array(b)); });
    }).then(texteDeXml);
  }

  var VERS_EXPORT = { t1: "t1", st: "sur", h1: "h1", h2: "h2", p: "p", puce: "puce",
    sign: "p", trait: "trait", saut: "saut", vide: "p" };

  function demarrer(opt) {
    opt = opt || {};
    var module = opt.module || "sst";
    var racine = document.getElementById(opt.racine || "ecran");
    if (!racine) return;

    var st = document.createElement("style");
    st.textContent = STYLE;
    document.head.appendChild(st);

    var Pr = global.Profil;
    var profil = Pr ? Pr.lire() : {};
    if (!profil || !profil.denomination) { location.replace("index.html"); return; }

    var CLE = "ecran-pieces-" + module;
    var ETAT = { reponses: {}, valeurs: {}, corrections: {} };
    try {
      var lu = JSON.parse(localStorage.getItem(CLE) || "null");
      if (lu && typeof lu === "object") {
        ETAT.reponses = lu.reponses || {};
        ETAT.valeurs = lu.valeurs || {};
        ETAT.corrections = lu.corrections || {};
      }
    } catch (e) {}
    function garder() { try { localStorage.setItem(CLE, JSON.stringify(ETAT)); } catch (e) {} }

    /* Ce qui est ouvert : la liste, un document ou un contrôle. Le bouton
       Retour du bandeau, posé par droits.js, ramène à la liste tant qu'un
       document est ouvert ; depuis la liste, il quitte la page. */
    var OUVERT = null;

    /* ------------------------------------------------------ les questions */
    var LISTE = (opt.questions || []).filter(function (q) {
      if (typeof q.due !== "function") return true;
      return q.due(profil) !== false;   /* inconnu : la question se pose */
    });

    function rappel() {
      var e = Number(profil.effectif);
      return ech(profil.denomination) +
        (isFinite(e) && String(profil.effectif).trim() !== "" ? " · " + e + " salarié" + (e > 1 ? "s" : "") : "");
    }

    function ligneHtml(q) {
      var rep = ETAT.reponses[q.id];
      return '<div class="ligne' + (rep ? " repondue" : "") + '">' +
        '<div><span class="t">' + ech(q.question) + "</span>" +
        (rep ? '<span class="s">' + (rep === "oui" ? "vous l'avez" : "vous ne l'avez pas") +
          (q.piece || q.texteId ? " : " + ech(q.titre) : "") + "</span>" : "") +
        "</div><div class=\"b\">" +
        '<button type="button" data-oui="' + ech(q.id) + '">Oui</button>' +
        '<button type="button" data-non="' + ech(q.id) + '">Non</button>' +
        "</div></div>";
    }

    function rendreListe(message) {
      OUVERT = null;
      var h = '<p class="rappel">' + rappel() + "</p>" +
        (opt.titre ? '<h2 class="q">' + ech(opt.titre) + "</h2>" : "") +
        (message ? '<div class="avis info">' + message + "</div>" : "");
      var groupe = null;
      LISTE.forEach(function (q) {
        if (q.groupe && q.groupe !== groupe) { groupe = q.groupe; h += '<p class="groupe">' + ech(groupe) + "</p>"; }
        h += ligneHtml(q);
      });
      if (opt.pied) h += "<footer>" + opt.pied + "</footer>";
      racine.innerHTML = h;
      racine.querySelectorAll("[data-non]").forEach(function (b) {
        b.addEventListener("click", function () { repondre(b.getAttribute("data-non"), "non"); });
      });
      racine.querySelectorAll("[data-oui]").forEach(function (b) {
        b.addEventListener("click", function () { repondre(b.getAttribute("data-oui"), "oui"); });
      });
      window.scrollTo({ top: 0 });
    }

    function questionDe(id) {
      for (var i = 0; i < LISTE.length; i++) if (LISTE[i].id === id) return LISTE[i];
      return null;
    }

    function repondre(id, rep) {
      var q = questionDe(id);
      if (!q) return;
      ETAT.reponses[id] = rep;
      garder();
      if (rep === "non") {
        if (q.lien) { location.href = q.lien; return; }
        ouvrirDocument(q);
        return;
      }
      /* Certaines pièces ont leur écran à elles : le « oui » y mène aussi,
         parce que c'est là que se fait le contrôle du document déposé. */
      if (q.lienOui) { location.href = q.lienOui; return; }
      ouvrirControle(q);
    }

    /* Le bouton Retour du bandeau : depuis un document ou un contrôle, il
       revient à la liste ; depuis la liste, il quitte la page. */
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest ? ev.target.closest("header.site a.retour") : null;
      if (!a || !OUVERT) return;
      ev.preventDefault(); ev.stopPropagation();
      rendreListe();
    }, true);

    /* ------------------------------------------------ le document, sur « non » */
    function contexte(q) {
      return { profil: Pr ? Pr.lire() : profil,
        valeurs: ETAT.valeurs[q.id] || {},
        fiche: { effectif: profil.effectif, entreprise: profil.denomination },
        aujourdhui: new Date() };
    }

    /* Un générateur hérité rend du texte : chaque ligne devient un bloc, les
       titres soulignés par une ligne de tirets restent des titres. Rien n'est
       réécrit, c'est le même document. */
    function blocsDeTexte(txt) {
      var out = [];
      String(txt).split(/\n/).forEach(function (l) {
        var t = l.replace(/\s+$/, "");
        if (/^[═─]{10,}$/.test(t.trim())) { out.push({ k: "trait", t: "" }); return; }
        if (t.trim() === "") { out.push({ k: "vide", t: "" }); return; }
        if (/^[A-ZÀ-Ý0-9 ,'’«»\-.()]{12,}$/.test(t.trim()) && t.trim().length < 90)
          { out.push({ k: "h1", t: t.trim() }); return; }
        out.push({ k: "p", t: t });
      });
      return out;
    }

    function blocsDe(q, ctx) {
      if (q.piece) return q.piece.blocs(ctx);
      var gen = global.DocumentsProduits && global.DocumentsProduits.pour(q.texteId);
      if (!gen) return [{ k: "p", t: "Aucun document n'est écrit pour ce point." }];
      return blocsDeTexte(gen.produire(ctx));
    }

    function feuilleHtml(blocs, id) {
      var c = ETAT.corrections[id] || {};
      var h = '<div class="feuille" id="feuille">';
      blocs.forEach(function (b) {
        if (b.k === "trait" || b.k === "saut") { h += '<hr class="b-' + b.k + '">'; return; }
        if (b.k === "vide") { h += '<div class="b-vide"></div>'; return; }
        var cle = empreinte(b.t);
        var texte = Object.prototype.hasOwnProperty.call(c, cle) ? c[cle] : b.t;
        h += '<div class="b-' + b.k + (texte !== b.t ? " modifie" : "") +
          '" contenteditable="true" data-k="' + b.k + '" data-o="' + cle + '">' + ech(texte) + "</div>";
      });
      return h + "</div>";
    }

    /* Les champs en tête du document : seulement ce que l'application ne
       peut pas connaître. Chaque frappe réécrit la feuille dessous. Sans
       champ, rien ne s'affiche au-dessus du document. */
    function champsHtml(q) {
      var v = ETAT.valeurs[q.id] || {};
      if (!q.piece || !q.piece.champs || !q.piece.champs.length) return "";
      var h = '<form class="champs" id="champs-piece" autocomplete="off" onsubmit="return false">';
      q.piece.champs.forEach(function (c) {
        var val = v[c.c] == null ? "" : String(v[c.c]);
        var plein = val.trim() !== "";
        h += '<label class="ch' + (plein ? " plein" : "") + (c.t === "textarea" ? " pleine" : "") +
          '"><span class="nom">' + ech(c.nom) + "</span>";
        if (c.t === "textarea")
          h += '<textarea data-c="' + ech(c.c) + '" placeholder="' + ech(c.ph || "") + '">' + ech(val) + "</textarea>";
        else if (c.t === "select")
          h += '<select data-c="' + ech(c.c) + '">' + (c.options || []).map(function (o) {
            return '<option' + (val === o ? " selected" : "") + ">" + ech(o) + "</option>"; }).join("") + "</select>";
        else
          h += '<input type="' + ech(c.t || "text") + '" data-c="' + ech(c.c) + '" value="' + ech(val) +
            '" placeholder="' + ech(c.ph || "") + '">';
        h += "</label>";
      });
      return h + "</form>";
    }

    function corpsHtml(q, ctx) {
      var refus = q.piece && typeof q.piece.refus === "function" ? q.piece.refus(ctx) : null;
      return refus
        ? '<div class="refus"><b>Ce document n\'est pas produit.</b>' +
          refus.map(function (l) { return "<div>" + ech(l) + "</div>"; }).join("") + "</div>"
        : feuilleHtml(blocsDe(q, ctx), q.id);
    }

    function reprendreHtml(q) {
      var c = ETAT.corrections[q.id] || {};
      return Object.keys(c).length
        ? '<p class="reprendre">Le document a été corrigé à la main. ' +
          '<button type="button" id="reprendre">Repartir du texte généré</button></p>'
        : "";
    }

    function ouvrirDocument(q) {
      OUVERT = q;
      var ctx = contexte(q);
      racine.innerHTML = '<div id="vue">' + champsHtml(q) +
        '<div id="cote-doc">' + corpsHtml(q, ctx) + "</div>" +
        '<div class="barre pile">' +
        '<button type="button" class="btn" id="dl-docx">Télécharger en Word</button>' +
        '<button type="button" class="btn second" id="imprimer">Imprimer</button></div>' +
        (q.renvoi ? '<details class="loi"><summary>Voir le texte de loi</summary>' +
          '<div class="c">' + ech(q.renvoi) + "</div></details>" : "") +
        '<div id="reprise">' + reprendreHtml(q) + "</div></div>";
      brancherDocument(q);
      window.scrollTo({ top: 0 });
    }

    function redessinerDocument(q) {
      var cote = document.getElementById("cote-doc");
      if (!cote) return;
      cote.innerHTML = corpsHtml(q, contexte(q));
      var r = document.getElementById("reprise");
      if (r) r.innerHTML = reprendreHtml(q);
    }

    function brancherDocument(q) {
      var vue = document.getElementById("vue");
      var maj = function (ev) {
        var el = ev.target;
        if (!el.getAttribute || !el.getAttribute("data-c")) return;
        ETAT.valeurs[q.id] = ETAT.valeurs[q.id] || {};
        ETAT.valeurs[q.id][el.getAttribute("data-c")] = el.value;
        garder();
        redessinerDocument(q);
        el.closest("label").classList.toggle("plein", String(el.value).trim() !== "");
      };
      vue.addEventListener("input", maj);
      vue.addEventListener("change", maj);

      /* La correction faite à la main dans la feuille, retenue sur le texte
         d'origine du bloc : elle survit à la réécriture des autres. */
      vue.addEventListener("input", function (ev) {
        var el = ev.target;
        if (!el || !el.hasAttribute || !el.hasAttribute("contenteditable")) return;
        ETAT.corrections[q.id] = ETAT.corrections[q.id] || {};
        ETAT.corrections[q.id][el.getAttribute("data-o")] = texteDe(el);
        el.classList.add("modifie");
        garder();
        var r = document.getElementById("reprise");
        if (r && !r.firstChild) r.innerHTML = reprendreHtml(q);
      });
      vue.addEventListener("click", function (ev) {
        if (ev.target && ev.target.id === "reprendre") {
          ETAT.corrections[q.id] = {}; garder(); redessinerDocument(q);
        }
      });

      document.getElementById("imprimer").addEventListener("click", function () { window.print(); });
      document.getElementById("dl-docx").addEventListener("click", function () { exporter(q, "docx"); });
    }

    /* Ce qui part dans le fichier : le document, et lui seul. Les notes de
       marge s'adressent à l'employeur, pas au destinataire. */
    function relire() {
      var out = [];
      var f = document.getElementById("feuille");
      if (!f) return out;
      Array.prototype.forEach.call(f.children, function (el) {
        if (el.tagName === "HR") { out.push({ k: el.classList.contains("b-saut") ? "saut" : "trait", t: "" }); return; }
        if (el.classList.contains("b-vide")) { out.push({ k: "p", t: "" }); return; }
        if (el.classList.contains("b-note")) return;
        out.push({ k: el.getAttribute("data-k"), t: texteDe(el) });
      });
      return out;
    }

    function nomFichier(q, ext) {
      var base = (q.piece && q.piece.fichier) || slug(q.titre || q.id);
      return base + "-" + slug(profil.denomination) + "-" +
        new Date().toISOString().slice(0, 10) + "." + ext;
    }

    function exporter(q, ext) {
      var blocs = relire();
      if (!blocs.length) return;
      var titre = blocs.length && blocs[0].k === "t1" ? blocs.shift().t : (q.titre || "");
      if (ext === "txt") {
        var t = (titre ? titre + "\n\n" : "") + blocs.map(function (b) {
          return b.k === "trait" || b.k === "saut" ? "" : b.t; }).join("\n");
        global.AuditExport.telecharger(t, nomFichier(q, "txt"), "text/plain;charset=utf-8");
        return;
      }
      var items = blocs.map(function (b) { return { k: VERS_EXPORT[b.k] || "p", t: b.t }; });
      global.AuditExport.telecharger(global.AuditExport.docx(items, titre),
        nomFichier(q, "docx"),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    /* ------------------------------------------------- le contrôle, sur « oui » */
    /* Le contrôle du document déposé n'est écrit que pour les pièces qui
       portent leurs attendus. Ailleurs, la réponse est enregistrée et la
       ligne passe en vert : rien d'autre à faire. */
    function ouvrirControle(q) {
      if (!q.piece || !q.piece.attendus || !q.piece.attendus.length) { rendreListe(); return; }
      OUVERT = q;
      racine.innerHTML = '<div id="vue">' +
        '<h2 class="q">' + ech(q.titre) + " : déposez le vôtre</h2>" +
        '<div class="barre pile">' +
        '<label class="btn second" style="display:inline-flex;align-items:center;justify-content:center;gap:9px">Choisir le fichier (.docx ou .txt)' +
        '<input type="file" id="fichier" accept=".docx,.txt,text/plain" style="display:none"></label></div>' +
        '<div id="lecture"></div>' +
        '<textarea class="depot" id="depot" placeholder="Ou collez ici le texte de votre document."></textarea>' +
        '<div class="barre pile"><button type="button" class="btn" id="controler">Contrôler</button></div>' +
        '<div id="diagnostic"></div></div>';
      document.getElementById("fichier").addEventListener("change", function (ev) {
        var f = ev.target.files && ev.target.files[0];
        if (!f) return;
        var dit = function (m, c) {
          document.getElementById("lecture").innerHTML = '<div class="avis ' + (c || "info") + '">' + m + "</div>";
        };
        dit("Lecture de <b>" + ech(f.name) + "</b>…");
        (/\.docx$/i.test(f.name) ? lireDocx(f) : f.text()).then(function (t) {
          document.getElementById("depot").value = t;
          dit("<b>" + ech(f.name) + "</b> lu, " + t.length.toLocaleString("fr-FR") +
            " caractères. Le fichier n'est pas sorti de ce poste.");
        }).catch(function (e) {
          dit("<b>Ce fichier n'a pas pu être lu.</b>" + ech(e.message) +
            " Ouvrez le document, copiez son texte et collez-le ci-dessous.", "att");
        });
      });
      document.getElementById("controler").addEventListener("click", function () { controler(q); });
      window.scrollTo({ top: 0 });
    }

    var insertions = {};

    function controler(q) {
      var txt = document.getElementById("depot").value;
      var cible = document.getElementById("diagnostic");
      if (txt.trim().length < 80) {
        cible.innerHTML = '<div class="avis att"><b>Le texte déposé est trop court.</b>' +
          "Déposez le document entier : sur un extrait, tout ce qui n'y figure pas serait dit absent.</div>";
        return;
      }
      var plat = sansAccents(txt);
      insertions = {};
      var manques = 0, h = "";
      q.piece.attendus.forEach(function (a) {
        var trouve = null;
        (a.mots || []).forEach(function (m) {
          if (trouve) return;
          var i = plat.indexOf(sansAccents(m));
          if (i >= 0) trouve = txt.slice(Math.max(0, i - 90), i + 150).replace(/\s+/g, " ").trim();
        });
        if (!trouve) { manques++; insertions[a.cle] = true; }
        h += '<div class="manque' + (trouve ? " trouve" : "") + '">' +
          '<div class="o">' + ech(a.objet) + "</div>" +
          (trouve
            ? '<p class="note" style="margin:6px 0 0">Trouvé dans votre document : <q>…' +
              ech(trouve) + '…</q> Relisez ce passage : la recherche voit que le sujet est traité, ' +
              "elle ne dit jamais qu'il l'est bien.</p>"
            : '<p class="note" style="margin:6px 0 0">Introuvable dans votre document. ' +
              "Le texte à insérer est écrit :</p>" +
              '<div class="clause">' + a.clause.map(function (l) { return "<p>" + ech(l) + "</p>"; }).join("") + "</div>" +
              '<label><input type="checkbox" data-ins="' + ech(a.cle) + '" checked> Insérer ce texte dans la version corrigée</label>') +
          '<p class="fond">' + ech(a.renvoi || "") + "</p></div>";
      });
      cible.innerHTML =
        '<div class="avis ' + (manques ? "att" : "ok") + '"><b>' +
        (manques ? manques + " point(s) introuvable(s) dans votre document" : "Tous les points cherchés ont été trouvés") +
        "</b>La recherche est faite sur les mots : un point rédigé autrement sera dit introuvable, et un " +
        "point trouvé n'est pas pour autant bien rédigé. C'est votre lecture qui décide.</div>" + h +
        '<div class="barre pile" style="margin-top:14px">' +
        '<button type="button" class="btn" id="assembler">Assembler la version corrigée</button></div>' +
        '<div id="corrige"></div>';
      cible.querySelectorAll("[data-ins]").forEach(function (i) {
        i.addEventListener("change", function () { insertions[i.getAttribute("data-ins")] = i.checked; });
      });
      document.getElementById("assembler").addEventListener("click", function () { assembler(q); });
    }

    function assembler(q) {
      var txt = document.getElementById("depot").value;
      var ajouts = q.piece.attendus.filter(function (a) { return insertions[a.cle]; });
      var L = [txt.replace(/\s+$/, ""), "", "", "AJOUTS AU TITRE DU CONTRÔLE DU " +
        new Date().toLocaleDateString("fr-FR"), ""];
      ajouts.forEach(function (a) {
        L.push(a.objet + " (" + (a.renvoi || "") + ")");
        a.clause.forEach(function (l) { L.push(l); });
        L.push("");
      });
      if (!ajouts.length) L.push("Aucun ajout retenu.");
      var sortie = L.join("\n");
      document.getElementById("corrige").innerHTML =
        '<div class="barre pile" style="margin-top:14px">' +
        '<button type="button" class="btn" id="c-docx">Télécharger en Word</button>' +
        '<button type="button" class="btn second" id="c-copier">Copier</button></div>' +
        '<pre class="sortie">' + ech(sortie) + "</pre>";
      var nom = ((q.piece && q.piece.fichier) || slug(q.titre)) + "-corrige-" +
        new Date().toISOString().slice(0, 10);
      document.getElementById("c-docx").addEventListener("click", function () {
        var items = sortie.split(/\n/).map(function (l) { return { k: "p", t: l }; });
        global.AuditExport.telecharger(global.AuditExport.docx(items, q.titre + " - version corrigée"),
          nom + ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      });
      document.getElementById("c-copier").addEventListener("click", function () {
        if (navigator.clipboard) navigator.clipboard.writeText(sortie);
      });
      document.getElementById("corrige").scrollIntoView({ behavior: "smooth" });
    }

    rendreListe();
  }
  global.EcranPieces = { demarrer: demarrer };

})(typeof window !== "undefined" ? window : this);
