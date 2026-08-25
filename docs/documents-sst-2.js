/* Les documents que l'application PRODUIT — les harcèlements et les
   agissements sexistes.

   POURQUOI CE FICHIER EXISTE, ET POURQUOI IL EST SÉPARÉ

   documents-sst.js porte le document unique, le programme de prévention et la
   commission santé, sécurité et conditions de travail — quatorze générateurs,
   déjà. Le bloc « harcèlement » du même module en attendait cinq, et ils
   n'ont rien à voir avec les précédents : ils ne décrivent pas un risque
   d'atelier, ils organisent la manière dont une entreprise reçoit la parole
   d'un salarié qui dit avoir subi quelque chose, et dont elle y répond.

   Ces cinq documents sont écrits ici, à la suite de documents-sst.js et sur
   le même registre. Le registre commun n'accepte qu'une fois chaque
   identifiant : ce fichier n'enregistre que SST-CTL-HAR-01 à SST-CTL-HAR-05,
   qu'aucun autre fichier ne porte.

   TROIS RÈGLES ONT COMMANDÉ L'ÉCRITURE, ET LA TROISIÈME EST VITALE ICI

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Chaque article cité figure dans
      moteur/sst/textes-sst.json avec son identifiant de version, ou dans le
      fondement du contrôle auquel le document répond. Les articles seulement
      RENVOYÉS par un texte lu sont NOMMÉS, jamais reproduits ni paraphrasés,
      et le document le dit à l'endroit exact où le lecteur pourrait croire
      que l'application les connaît. La liste, pour ce fichier :
        · les articles 222-33 et 222-33-2 du CODE PÉNAL, dont L. 1153-5 et
          L. 1152-4 imposent pourtant d'afficher le TEXTE. C'est le manque le
          plus gênant du fichier, et le plus visible : le relais Légifrance du
          dépôt ne sert que le code du travail. L'affichage produit ici porte
          donc, à la place de ces deux textes, un emplacement réservé et la
          consigne d'aller les chercher — un affichage sans eux ne satisfait
          ni L. 1152-4 ni L. 1153-5 ;
        · L. 1121-2, auquel L. 1152-2 et L. 1153-2 renvoient pour désigner les
          mesures interdites contre la personne qui a subi, refusé de subir,
          relaté ou témoigné ;
        · L. 1142-2-1, qui définit l'agissement sexiste et auquel renvoie
          L. 4121-2, 7° ;
        · L. 1153-3, l'un des trois articles que vise la peine de L. 1155-2 ;
        · les articles 10-1, 12 à 13-1 de la loi n° 2016-1691 du 9 décembre
          2016, dont L. 1152-2 et L. 1153-2 étendent les protections ;
        · L. 4644-1 et L. 2312-9, nommés par L. 4121-3 ;
        · L. 2315-22-1 et L. 2315-32, nommés par L. 2315-18 et L. 2314-1 —
          L. 2315-32, lui, est capté et se cite.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ, ET QUI NE
      VISE L'OBLIGATION EN CAUSE. Le périmètre a été revérifié pour ce fichier,
      et il est étroit :
        · L. 1155-2 punit « les faits de discriminations commis à la suite d'un
          harcèlement moral ou sexuel définis aux articles L. 1152-2, L. 1153-2
          et L. 1153-3 » : ce sont les REPRÉSAILLES, non l'organisation de la
          prévention. Il n'est invoqué qu'en HAR-05, et seulement au titre de
          la protection de la personne qui signale ou témoigne ;
        · L. 4741-1 ne rattrape rien ici : son énumération vise, pour le livre
          Ier de la quatrième partie, les « Titres Ier, III et IV » — le titre
          II, où vivent L. 4121-1 et L. 4121-2, en est absent ; et les articles
          L. 1152-… et L. 1153-… relèvent de la PREMIÈRE partie du code, que
          cette énumération n'atteint pas davantage ;
        · R. 4741-3, quoique son objet — « les documents et affichages
          obligatoires » — le laisse croire, a une énumération close
          (L. 4711-1 à L. 4711-5, D. 4711-1 à D. 4711-3) où l'affichage de
          L. 1153-5 ne figure pas. Il n'est invoqué nulle part ;
        · L. 2317-1 punit deux faits, et deux seulement : l'entrave à la
          constitution du comité ou à la libre désignation de ses MEMBRES, et
          l'entrave à son fonctionnement régulier. La désignation du référent
          de L. 2314-1 est le fait du COMITÉ, non de l'employeur : HAR-02
          n'annonce donc aucune peine.
      Partout ailleurs, ce qui se joue est civil : l'obligation de prévention
      de L. 1152-4 et L. 1153-5, l'obligation de sécurité de L. 4121-1, et ce
      que le juge du fond en tirera. Les documents le disent, plutôt que
      d'agiter une amende qui n'existe pas.

   3. LES FAITS NE S'INVENTENT JAMAIS, ET LES QUALIFICATIONS ENCORE MOINS.
      Aucun document de ce fichier n'écrit ce qu'un salarié aurait fait ou
      subi. Aucun ne qualifie les faits à la place de l'enquête, ni ne préjuge
      de son issue. Tout sort ENTRE CROCHETS, avec la consigne de l'écrire
      daté et circonstancié. La trame d'audition ne pose aucune question qui
      suppose les faits établis ; le rapport d'enquête porte trois conclusions
      possibles — établis, non établis, éléments insuffisants — et jamais une
      seule pré-remplie. Un document qui écrirait « les faits de harcèlement
      établis » avant l'audition de la personne mise en cause serait une pièce
      à charge contre son propre auteur.

   LES SEUILS NE SE SUPPOSENT PAS. Deux cent cinquante salariés pour le
   référent de l'employeur (L. 1153-5-1) : quand l'effectif n'est pas
   renseigné, aucun document ne tranche. Il expose les deux branches et laisse
   le lecteur porter son chiffre.                                            */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-sst-2.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

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
  /* Une date du dossier, écrite en toutes lettres — ou son crochet. */
  function jour(iso, quoi) {
    var d = dateDe(iso);
    return d ? leJour(d) : "[" + (quoi || "date") + "]";
  }
  function aujourd(ctx) {
    return ctx && ctx.aujourdhui instanceof Date && !isNaN(ctx.aujourdhui.getTime())
      ? ctx.aujourdhui : new Date();
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE TEXTE, D'EFFECTIF ET DE PROFIL
     ════════════════════════════════════════════════════════════════════════ */

  /* Ce que le dossier déclare, dit sans être interprété. */
  function etat(v, oui, non) {
    if (v === true || v === "oui") return oui;
    if (v === false || v === "non") return non;
    return "non renseigné — à vérifier sur la pièce elle-même";
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
                   : "Effectif : [EFFECTIF DE L'ENTREPRISE — non renseigné]. Le seuil de " +
                     "deux cent cinquante salariés de L. 1153-5-1 en dépend : portez-le " +
                     "avant de choisir une branche.";
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
      "[ARTICLE NON LU PAR L'APPLICATION — " + articles + " " +
        (quoi || "est nommé ici parce qu'un texte lu y renvoie") + ".",
      " L'application ne l'a pas capté et n'en reproduit donc pas le contenu.",
      " Allez le lire avant de vous en servir.]",
      "",
    ];
  }

  /* Les deux articles du code pénal que l'affichage doit porter. Le relais
     Légifrance du dépôt ne sert que le code du travail : le bloc est écrit une
     fois, et repris partout où l'un des deux textes est en cause. */
  function blocCodePenal(lesquels) {
    return [
      "[TEXTE À REPORTER — " + lesquels + ".",
      " L'application ne lit que le CODE DU TRAVAIL : elle n'a pas capté ces",
      " articles du CODE PÉNAL et ne les reproduit donc pas. Or c'est bien LEUR",
      " TEXTE que L. 1152-4 et L. 1153-5 obligent à porter à la connaissance des",
      " salariés — non leur numéro, ni un résumé. Recopiez-les intégralement,",
      " dans leur version en vigueur au jour de l'affichage, et notez cette date",
      " sur le support : ces articles ont été modifiés plusieurs fois.]",
      "",
    ];
  }

  /* L'en-tête d'un courrier : qui écrit, à qui, d'où, quand. */
  function teteLettre(ctx, destinataire, recommande) {
    var p = (ctx && ctx.profil) || {};
    var L = [nomDe(ctx), cro(p.adresse, "adresse du siège"), ""];
    (destinataire || []).forEach(function (x) { L.push(x); });
    L.push("");
    L.push(lieu(ctx) + ", le " + leJour(aujourd(ctx)));
    L.push("");
    if (recommande) {
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("— ou remise en main propre contre récépissé daté et signé —");
      L.push("");
    }
    return L;
  }

  function formulePolitesse(ctx, appel) {
    return [
      "Je vous prie d'agréer, " + (appel || "Madame, Monsieur") + ", l'expression de ma",
      "considération distinguée.",
      "",
      signataire(ctx),
      "",
    ];
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES BLOCS COMMUNS AUX CINQ DOCUMENTS
     ════════════════════════════════════════════════════════════════════════ */

  /* Les définitions, telles que les textes lus les écrivent. Elles reviennent
     dans l'affichage, dans la procédure et dans la trame d'audition — et il
     n'y en a qu'une version, pour qu'un salarié qui lit l'affichage et un
     enquêteur qui lit la trame ne travaillent pas sur deux définitions
     différentes. */
  function blocDefinitions() {
    return [
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
      "Trois points de ce texte se manquent souvent, et ils décident de tout :",
      "  · les propos ou comportements peuvent être à connotation SEXUELLE OU",
      "    SEXISTE — le texte dit les deux ;",
      "  · la répétition peut résulter de plusieurs auteurs (a et b), y compris sans",
      "    concertation lorsqu'ils savent qu'ils répètent ;",
      "  · la pression grave du 2° n'a pas besoin d'être répétée.",
      "",
      "L'AGISSEMENT SEXISTE",
      "",
    ].concat(blocRenvoi("L. 1142-2-1",
      "définit l'agissement sexiste, et L. 4121-2, 7°, y renvoie expressément"));
  }

  /* La protection de celui qui parle. Elle est rappelée dans l'affichage, dans
     la procédure, dans chaque convocation d'audition et dans le rapport : un
     salarié qui ne la connaît pas ne signale pas. */
  function blocProtection() {
    return [
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
    ].concat(blocRenvoi("L. 1121-2",
      "porte la liste des mesures interdites, à laquelle L. 1152-2 et L. 1153-2 " +
      "renvoient l'une et l'autre ; c'est lui qui dit ce qui ne peut pas être fait " +
      "à la personne protégée"))
     .concat(blocRenvoi("les articles 10-1, 12 à 13-1 de la loi n° 2016-1691 du 9 décembre 2016",
      "sont nommés par L. 1152-2 et L. 1153-2, mais ne sont pas au code du travail : " +
      "le relais de l'application ne sert que ce code"));
  }

  /* Les trois obligations de l'employeur, dans les mots des textes lus. C'est
     le socle de HAR-04 et de HAR-05 : prévenir, mettre un terme, sanctionner. */
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

  /* Les cinq coordonnées de D. 1151-1, avec leurs lignes à remplir. Elles
     servent à l'affichage (HAR-03), mais aussi aux deux documents de
     désignation, qui doivent dire où porter le nom du référent. */
  function blocCoordonnees(ctx) {
    var au250 = seuil(ctx, 250);
    var f = (ctx && ctx.fiche) || {};
    var cse = f.cse || {};
    var L = [
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
      "compétent — c'est la mention la plus souvent absente, et elle se périme.",
      "",
      "  1° MÉDECIN DU TRAVAIL OU SERVICE DE SANTÉ AU TRAVAIL compétent pour",
      "     l'établissement",
      "       adresse ......... [ADRESSE]",
      "       numéro d'appel .. [NUMÉRO]",
      "",
      "  2° INSPECTION DU TRAVAIL compétente",
      "       adresse ......... [ADRESSE DE L'UNITÉ DE CONTRÔLE]",
      "       numéro d'appel .. [NUMÉRO]",
      "       nom de l'inspecteur compétent ... [NOM] (exigé par le texte)",
      "",
      "  3° DÉFENSEUR DES DROITS",
      "       adresse ......... [ADRESSE]",
      "       numéro d'appel .. [NUMÉRO]",
      "",
    ];
    L.push("  4° RÉFÉRENT DE L'EMPLOYEUR (L. 1153-5-1)");
    if (au250 === true) {
      L.push("       Votre effectif atteint deux cent cinquante salariés : cette");
      L.push("       ligne est DUE.");
      L.push("       nom ............. [NOM, PRÉNOM, FONCTION]");
      L.push("       adresse ......... [ADRESSE]");
      L.push("       numéro d'appel .. [NUMÉRO]");
    } else if (au250 === false) {
      L.push("       Votre effectif n'atteint pas deux cent cinquante salariés :");
      L.push("       le 4° ne vous concerne pas, et cette ligne se SUPPRIME du");
      L.push("       support. Rien n'interdit de désigner un référent malgré tout ;");
      L.push("       si vous le faites, portez ses coordonnées ici.");
    } else {
      L.push("       [EFFECTIF NON RENSEIGNÉ : cette ligne n'est due qu'à partir de");
      L.push("        deux cent cinquante salariés. Portez votre effectif, puis");
      L.push("        gardez ou supprimez la ligne.]");
      L.push("       nom ............. [NOM, PRÉNOM, FONCTION]");
      L.push("       adresse ......... [ADRESSE]");
      L.push("       numéro d'appel .. [NUMÉRO]");
    }
    L.push("");
    L.push("  5° RÉFÉRENT DU COMITÉ SOCIAL ET ÉCONOMIQUE (L. 2314-1)");
    if (estNon(cse.existe)) {
      L.push("       Le dossier ne déclare aucun comité social et économique : le 5°");
      L.push("       n'a pas d'objet et cette ligne se supprime. La régularité de");
      L.push("       cette absence relève du module « comité social et économique ».");
    } else {
      L.push("       nom ............. [NOM, PRÉNOM]");
      L.push("       adresse ......... [ADRESSE]");
      L.push("       numéro d'appel .. [NUMÉRO]");
      if (estNon(f.referentCSE)) {
        L.push("       Le dossier indique qu'aucun référent n'a été désigné par le");
        L.push("       comité : cette ligne ne peut pas être remplie tant que la");
        L.push("       désignation n'a pas eu lieu, et l'information reste donc");
        L.push("       incomplète. Le document SST-CTL-HAR-02 porte la démarche.");
      }
    }
    L.push("");
    L.push("Ces cinq coordonnées se périment : un service qui déménage, un inspecteur");
    L.push("qui change d'affectation, un référent dont le mandat s'achève. Datez le");
    L.push("support et fixez qui le relit.");
    L.push("");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-01 — LE RÉFÉRENT DE L'EMPLOYEUR

     Un article de deux lignes, et pourtant le document le plus facile à rater :
     désigner quelqu'un ne suffit pas, encore faut-il que la décision énonce la
     mission telle que le texte la définit — orienter, informer, accompagner —
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
      var L = entete(ctx, "Désignation du référent harcèlement sexuel et agissements sexistes",
        "article L. 1153-5-1 du code du travail");

      L.push("LE TEXTE, EN ENTIER — IL TIENT EN UNE PHRASE");
      L.push("");
      L.push("« Dans toute entreprise employant au moins deux cent cinquante salariés est");
      L.push("désigné un référent chargé d'orienter, d'informer et d'accompagner les");
      L.push("salariés en matière de lutte contre le harcèlement sexuel et les");
      L.push("agissements sexistes » (L. 1153-5-1).");
      L.push("");
      L.push("Quatre choses s'y lisent, et chacune commande une ligne du document :");
      L.push("  · le SEUIL — au moins deux cent cinquante salariés ;");
      L.push("  · l'obligation de DÉSIGNER : le texte n'ouvre pas une faculté ;");
      L.push("  · la MISSION, en trois verbes — orienter, informer, accompagner. Ce ne");
      L.push("    sont pas les mêmes : orienter suppose de connaître les interlocuteurs,");
      L.push("    informer suppose de connaître les textes, accompagner suppose du");
      L.push("    temps et un lieu où recevoir ;");
      L.push("  · l'OBJET — la lutte contre le harcèlement sexuel ET les agissements");
      L.push("    sexistes. Le second est plus large que le premier.");
      L.push("");
      L.push("CE QUE LE TEXTE NE DIT PAS, et qu'aucun document ne peut inventer : ni la");
      L.push("qualité que doit avoir le référent, ni sa formation, ni le temps qui lui");
      L.push("est alloué, ni les modalités de sa saisine. Ces choix vous appartiennent ;");
      L.push("ils sortent ici entre crochets. Mais un référent sans temps, sans");
      L.push("formation et sans procédure de saisine n'est un référent que sur le");
      L.push("papier, et c'est le papier qui sera discuté.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push(ligneEffectif(ctx));
      if (au250 === true) {
        L.push("Le seuil de deux cent cinquante salariés est atteint : la désignation est");
        L.push("DUE, et la ligne 4° de l'affichage de D. 1151-1 l'est également.");
      } else if (au250 === false) {
        L.push("Le seuil de deux cent cinquante salariés n'est pas atteint : L. 1153-5-1");
        L.push("ne vous oblige pas à désigner un référent, et le 4° de D. 1151-1 ne");
        L.push("s'applique pas à votre affichage. RIEN NE VOUS L'INTERDIT POUR AUTANT.");
        L.push("Si vous désignez malgré tout, le présent document sert tel quel : la");
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
      L.push("Référent désigné selon le dossier : " +
        etat(f.referentEmployeur, "oui", "NON"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — DÉCISION DE DÉSIGNATION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("");
      L.push("DÉCISION DU " + leJour(d0).toUpperCase());
      L.push("Désignation du référent chargé d'orienter, d'informer et d'accompagner");
      L.push("les salariés en matière de lutte contre le harcèlement sexuel et les");
      L.push("agissements sexistes");
      L.push("");
      L.push("Vu l'article L. 1153-5-1 du code du travail ;");
      L.push("Vu l'article D. 1151-1 du même code, 4° ;");
      L.push("Vu les articles L. 1153-1, L. 1153-2 et L. 1153-5 du même code ;");
      L.push("");
      L.push("ARTICLE 1er — DÉSIGNATION");
      L.push("Est désigné(e) référent(e) chargé(e) d'orienter, d'informer et");
      L.push("d'accompagner les salariés en matière de lutte contre le harcèlement");
      L.push("sexuel et les agissements sexistes :");
      L.push("");
      L.push("    [NOM, PRÉNOM]");
      L.push("    [fonction exercée dans l'entreprise]");
      L.push("    [service, site, établissement]");
      L.push("");
      L.push("ARTICLE 2 — MISSION");
      L.push("La mission du référent est celle que L. 1153-5-1 définit :");
      L.push("  · ORIENTER les salariés — vers le médecin du travail ou le service de");
      L.push("    santé au travail, vers l'inspection du travail, vers le Défenseur des");
      L.push("    droits, vers le référent du comité social et économique, vers la");
      L.push("    procédure interne de signalement ;");
      L.push("  · INFORMER les salariés sur ce que sont le harcèlement sexuel et les");
      L.push("    agissements sexistes, sur les protections dont bénéficie celui qui");
      L.push("    relate ou témoigne, et sur les voies ouvertes ;");
      L.push("  · ACCOMPAGNER les salariés qui le saisissent, pendant le temps");
      L.push("    nécessaire.");
      L.push("");
      L.push("[Le cas échéant, préciser ce que le référent ne fait PAS : par exemple,");
      L.push(" s'il conduit ou non les enquêtes internes. Le texte ne le dit pas ; le");
      L.push(" laisser dans le flou expose le référent à se voir reprocher, plus tard,");
      L.push(" ce qu'il n'avait pas mission de faire.]");
      L.push("");
      L.push("ARTICLE 3 — MOYENS");
      L.push("Sont mis à sa disposition :");
      L.push("  · un temps identifié de [NOMBRE] heures par [mois / trimestre],");
      L.push("    distinct de sa charge de travail habituelle ;");
      L.push("  · une formation de [DURÉE], portant sur [CONTENU], suivie le [DATE] ou");
      L.push("    à suivre avant le [DATE] ;");
      L.push("  · un lieu où recevoir un salarié sans que l'entretien soit vu ou");
      L.push("    entendu : [LIEU] ;");
      L.push("  · une adresse et un numéro d'appel dédiés, portés à l'affichage :");
      L.push("    [ADRESSE] · [NUMÉRO].");
      L.push("");
      L.push("ARTICLE 4 — SAISINE");
      L.push("Tout salarié peut le saisir directement, [par écrit à l'adresse");
      L.push("ci-dessus / par téléphone / sur rendez-vous]. La saisine du référent ne");
      L.push("prive le salarié d'aucune autre voie : il peut s'adresser directement à");
      L.push("l'employeur, au comité social et économique, au médecin du travail, à");
      L.push("l'inspection du travail ou au Défenseur des droits.");
      L.push("");
      L.push("ARTICLE 5 — DURÉE ET PUBLICITÉ");
      L.push("La présente désignation prend effet le [DATE D'EFFET] et court jusqu'à");
      L.push("[décision contraire / terme, s'il en est fixé un]. Elle est portée à la");
      L.push("connaissance du personnel par [note de service / intranet / affichage],");
      L.push("et les coordonnées du référent sont ajoutées à l'information de");
      L.push("D. 1151-1.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("Pour acceptation de la mission,");
      L.push("[NOM du référent] — le [DATE] — signature :");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE DE MISSION AU RÉFÉRENT");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM, PRÉNOM du référent]", "[fonction et service]"], false));
      L.push("Objet : votre désignation comme référent harcèlement sexuel et");
      L.push("agissements sexistes");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par décision du " + leJour(d0) + ", je vous ai désigné(e) référent(e) au");
      L.push("titre de l'article L. 1153-5-1 du code du travail, qui charge ce référent");
      L.push("« d'orienter, d'informer et d'accompagner les salariés en matière de lutte");
      L.push("contre le harcèlement sexuel et les agissements sexistes ».");
      L.push("");
      L.push("Cette lettre précise ce que cette mission suppose de votre part, et ce");
      L.push("que l'entreprise met à votre disposition pour l'exercer.");
      L.push("");
      L.push("CE QUE VOUS AUREZ À CONNAÎTRE");
      L.push("");
      L.push("Les définitions, d'abord — elles sont dans le code du travail et non dans");
      L.push("l'usage : L. 1153-1 pour le harcèlement sexuel, L. 1152-1 pour le");
      L.push("harcèlement moral. Vous les trouverez reproduites dans l'affichage de");
      L.push("l'entreprise et dans la procédure interne de signalement.");
      L.push("");
      L.push("La protection de celui qui parle, ensuite : L. 1153-2 et L. 1152-2");
      L.push("interdisent que la personne qui a subi, refusé de subir, relaté de bonne");
      L.push("foi ou témoigné fasse l'objet des mesures mentionnées à l'article");
      L.push("L. 1121-2. C'est la première chose à dire à un salarié qui hésite.");
      L.push("");
      L.push("Les interlocuteurs, enfin : médecin du travail ou service de santé au");
      L.push("travail, inspection du travail, Défenseur des droits, référent du comité");
      L.push("social et économique. Leurs coordonnées figurent à l'affichage");
      L.push("(D. 1151-1) ; vérifiez qu'elles sont à jour avant d'y renvoyer quelqu'un.");
      L.push("");
      L.push("CE QUE L'ENTREPRISE MET À VOTRE DISPOSITION");
      L.push("");
      L.push("  · du temps : [NOMBRE] heures par [mois / trimestre] ;");
      L.push("  · une formation : [INTITULÉ, ORGANISME, DURÉE], [suivie le DATE / à");
      L.push("    suivre avant le DATE] ;");
      L.push("  · un lieu de réception préservé : [LIEU] ;");
      L.push("  · une adresse et un numéro d'appel dédiés : [ADRESSE] · [NUMÉRO].");
      L.push("");
      L.push("CE QUI VOUS EST DEMANDÉ EN RETOUR");
      L.push("");
      L.push("  · tenir un registre des saisines, sans y porter le récit des faits :");
      L.push("    date, nature de la demande, orientation donnée. Il sert à mesurer");
      L.push("    l'activité, pas à constituer un dossier ;");
      L.push("  · ne pas qualifier les faits : ce n'est ni votre rôle ni celui de");
      L.push("    l'entreprise avant l'enquête ;");
      L.push("  · alerter sans délai [le signataire de la présente / la personne");
      L.push("    désignée par la procédure interne] lorsqu'une situation vous paraît");
      L.push("    appeler des mesures immédiates ;");
      L.push("  · vous abstenir de tout traitement d'une situation où vous seriez");
      L.push("    personnellement en cause ou trop proche des personnes concernées, et");
      L.push("    le signaler aussitôt.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Madame, Monsieur"));
      L.push("Pièce jointe : décision de désignation du " + leJour(d0));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — NOTE D'INFORMATION AU PERSONNEL");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — note du " + leJour(d0));
      L.push("Objet : désignation d'un référent harcèlement sexuel et agissements");
      L.push("sexistes");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("En application de l'article L. 1153-5-1 du code du travail, [NOM, PRÉNOM],");
      L.push("[fonction], est désigné(e) référent(e) chargé(e) d'orienter, d'informer et");
      L.push("d'accompagner les salariés en matière de lutte contre le harcèlement");
      L.push("sexuel et les agissements sexistes.");
      L.push("");
      L.push("Vous pouvez le ou la saisir directement :");
      L.push("    adresse ......... [ADRESSE]");
      L.push("    numéro d'appel .. [NUMÉRO]");
      L.push("    [modalités : sur rendez-vous, par écrit, aux heures suivantes]");
      L.push("");
      L.push("Cette saisine ne vous prive d'aucune autre voie. Vous pouvez également");
      L.push("vous adresser à l'employeur, au comité social et économique et à son");
      L.push("référent, au médecin du travail ou au service de santé au travail, à");
      L.push("l'inspection du travail ou au Défenseur des droits. Leurs coordonnées");
      L.push("figurent sur l'affichage prévu par l'article D. 1151-1 du code du");
      L.push("travail.");
      L.push("");
      L.push("Il est rappelé qu'aucune personne ayant subi ou refusé de subir des faits");
      L.push("de harcèlement sexuel définis à l'article L. 1153-1, ou ayant de bonne foi");
      L.push("témoigné de tels faits ou les ayant relatés, ne peut faire l'objet des");
      L.push("mesures mentionnées à l'article L. 1121-2 (L. 1153-2). La même protection");
      L.push("est prévue en matière de harcèlement moral par l'article L. 1152-2.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — CE QUI DOIT CHANGER SUR L'AFFICHAGE");
      L.push(GROS);
      L.push("");
      L.push("Une désignation qui ne rejoint pas l'affichage laisse l'information");
      L.push("incomplète : D. 1151-1, 4°, veut l'adresse et le numéro d'appel « du");
      L.push("référent prévu à l'article L. 1153-5-1 dans toute entreprise employant au");
      L.push("moins deux cent cinquante salariés ». Le manquement se constate alors à");
      L.push("deux titres — la désignation et l'information.");
      L.push("");
      L.push("À porter, ou à corriger, sur le support d'information :");
      L.push("");
      L.push("    Référent harcèlement sexuel et agissements sexistes de l'entreprise");
      L.push("    (article L. 1153-5-1 du code du travail)");
      L.push("      [NOM, PRÉNOM] — [fonction]");
      L.push("      adresse ......... [ADRESSE]");
      L.push("      numéro d'appel .. [NUMÉRO]");
      L.push("");
      L.push("Le document SST-CTL-HAR-03 de cette application produit l'affichage");
      L.push("complet, avec les cinq coordonnées de D. 1151-1 et les deux textes du");
      L.push("code pénal à y reporter.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous choisissez la personne, et vous");
      L.push("lui en parlez avant de signer : un référent désigné sans son accord ne");
      L.push("recevra personne.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 3)) + " — vous signez la décision (pièce 1) et");
      L.push("vous remettez la lettre de mission (pièce 2). Ces deux actes ne dépendent");
      L.push("que de vous : aucune consultation, aucun délai, aucune formalité");
      L.push("extérieure. C'est pourquoi ce manquement ne se laisse pas expliquer.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " — la note au personnel est diffusée");
      L.push("(pièce 3) et l'affichage est corrigé (pièce 4). Datez la diffusion et");
      L.push("gardez-en la trace : photographie du panneau, accusé de réception de la");
      L.push("note, capture de la page intranet.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 90)) + " au plus tard — la formation du référent");
      L.push("est engagée. Aucun texte lu ne fixe ce délai : c'est une échéance que");
      L.push("vous vous donnez, et elle vaut mieux qu'une intention.");
      L.push("");
      L.push("Ensuite, à chaque changement — départ du référent, changement de");
      L.push("fonction, de site ou de numéro : la décision se refait et l'affichage se");
      L.push("corrige le même jour.");

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
     SST-CTL-HAR-02 — LE RÉFÉRENT DU COMITÉ

     Celui-là, l'employeur ne le désigne pas : le comité le désigne, parmi ses
     membres, par une résolution. L'employeur ne peut donc produire ni la
     désignation ni le procès-verbal — mais il peut inscrire la question à
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
      var L = entete(ctx, "Désignation du référent harcèlement par le comité social et économique",
        "article L. 2314-1, dernier alinéa, du code du travail");

      L.push("LE TEXTE, EN ENTIER — DERNIER ALINÉA DE L. 2314-1");
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
      L.push("     titre — l'employeur peut, lui, désigner son propre référent au titre");
      L.push("     de L. 1153-5-1, mais c'est un autre référent et un autre article.");
      L.push("  3. LA FORME EST UNE RÉSOLUTION, adoptée à la majorité des membres");
      L.push("     présents, le président ne prenant pas part au vote. Un tour de table");
      L.push("     consigné au procès-verbal n'est pas une résolution.");
      L.push("  4. LA DURÉE EST CELLE DU MANDAT DES ÉLUS : elle prend fin avec lui. À");
      L.push("     chaque renouvellement du comité, la désignation se refait — c'est");
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
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      if (estNon(cse.existe)) {
        L.push("Le dossier ne déclare AUCUN comité social et économique. L. 2314-1 n'a");
        L.push("donc pas d'objet en l'état, et le 5° de D. 1151-1 non plus : cette ligne");
        L.push("se supprime de l'affichage. La régularité de cette absence de comité");
        L.push("relève du module « comité social et économique » de l'application, qui");
        L.push("traite de sa mise en place. Les pièces ci-dessous sont écrites pour le");
        L.push("jour où le comité existera.");
      } else if (estOui(cse.existe)) {
        L.push("Un comité social et économique existe.");
        L.push("Référent harcèlement du comité désigné selon le dossier : " +
          etat(f.referentCSE, "oui", "NON"));
        if (estNon(f.referentCSE)) {
          L.push("La désignation n'a pas eu lieu : engagez la démarche ci-dessous et");
          L.push("conservez-en la date. Vous ne pouvez pas désigner à la place du comité,");
          L.push("mais vous pouvez établir que vous l'avez mis en mesure de le faire.");
        }
      } else {
        L.push("Le dossier ne dit pas s'il existe un comité social et économique. La");
        L.push("question commande tout : le référent de L. 2314-1 est désigné PAR le");
        L.push("comité, PARMI ses membres. Renseignez-la avant de vous servir des pièces");
        L.push("ci-dessous.");
      }
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — INSCRIPTION À L'ORDRE DU JOUR");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push("");
      L.push("ORDRE DU JOUR — RÉUNION DU COMITÉ SOCIAL ET ÉCONOMIQUE DU [DATE]");
      L.push("Extrait");
      L.push("");
      L.push("Point [N°] — Désignation du référent en matière de lutte contre le");
      L.push("harcèlement sexuel et les agissements sexistes (L. 2314-1, dernier");
      L.push("alinéa).");
      L.push("");
      L.push("  Objet : le comité est appelé à désigner, parmi ses membres, par une");
      L.push("  résolution adoptée selon les modalités de L. 2315-32, le référent en");
      L.push("  matière de lutte contre le harcèlement sexuel et les agissements");
      L.push("  sexistes, pour une durée qui prend fin avec celle du mandat des membres");
      L.push("  élus du comité.");
      L.push("");
      L.push("  Document joint : modèle de résolution.");
      L.push("");
      L.push("[L'ordre du jour est arrêté selon les règles propres au fonctionnement du");
      L.push(" comité — le module « comité social et économique » de cette application");
      L.push(" les traite. Si l'ordre du jour est établi conjointement avec le");
      L.push(" secrétaire, transmettez-lui ce point par écrit et gardez la trace de");
      L.push(" l'envoi : c'est cette trace qui établira votre démarche.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — COURRIER AUX MEMBRES DE LA DÉLÉGATION DU PERSONNEL");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la délégation du personnel",
         "du comité social et économique"], false));
      L.push("Objet : désignation du référent en matière de lutte contre le harcèlement");
      L.push("sexuel et les agissements sexistes");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le dernier alinéa de l'article L. 2314-1 du code du travail prévoit qu'un");
      L.push("référent en matière de lutte contre le harcèlement sexuel et les");
      L.push("agissements sexistes « est désigné par le comité social et économique");
      L.push("parmi ses membres, sous la forme d'une résolution adoptée selon les");
      L.push("modalités définies à l'article L. 2315-32, pour une durée qui prend fin");
      L.push("avec celle du mandat des membres élus du comité ».");
      L.push("");
      L.push("Cette désignation appartient au comité, et à lui seul : je ne peux ni y");
      L.push("procéder, ni proposer un nom. Je vous invite en conséquence à y procéder");
      L.push("lors de la réunion du [DATE DE LA RÉUNION], à l'ordre du jour de laquelle");
      L.push("cette question est inscrite. Un modèle de résolution est joint, que vous");
      L.push("pourrez reprendre ou écarter.");
      L.push("");
      L.push("Deux points pratiques, qui ne sont pas de simples formalités :");
      L.push("");
      L.push("  · les coordonnées du référent que vous désignerez — adresse et numéro");
      L.push("    d'appel — devront figurer sur l'information délivrée aux salariés et");
      L.push("    aux candidats à l'embauche, l'article D. 1151-1, 5°, l'exigeant");
      L.push("    « lorsqu'un comité social et économique existe ». Merci de me les");
      L.push("    communiquer dès la désignation, afin que le support soit corrigé sans");
      L.push("    délai ;");
      L.push("");
      L.push("  · le référent bénéficie de la formation en matière de santé, de");
      L.push("    sécurité et de conditions de travail : l'article L. 2315-18 vise");
      L.push("    expressément, à côté des membres de la délégation du personnel, « le");
      L.push("    référent prévu au dernier alinéa de l'article L. 2314-1 ». Le");
      L.push("    financement de cette formation est pris en charge par l'employeur");
      L.push("    dans les conditions prévues par décret en Conseil d'État. Indiquez-moi");
      L.push("    les dates que vous souhaitez retenir.");
      L.push("");
      L.push("Je vous rappelle enfin que la désignation prend fin avec le mandat des");
      L.push("membres élus du comité : elle devra être reprise au prochain");
      L.push("renouvellement.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("Pièce jointe : modèle de résolution");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — MODÈLE DE RÉSOLUTION (à l'usage du comité)");
      L.push(GROS);
      L.push("");
      L.push("Ce modèle est mis à la disposition du comité. Il ne l'engage pas : le");
      L.push("comité l'adopte, le modifie ou l'écarte.");
      L.push("");
      L.push("  RÉSOLUTION N° [.] — DÉSIGNATION DU RÉFÉRENT EN MATIÈRE DE LUTTE CONTRE");
      L.push("  LE HARCÈLEMENT SEXUEL ET LES AGISSEMENTS SEXISTES");
      L.push("");
      L.push("  Réunion du comité social et économique de " + nomDe(ctx));
      L.push("  du [DATE].");
      L.push("");
      L.push("  Vu le dernier alinéa de l'article L. 2314-1 du code du travail ;");
      L.push("  Vu l'article L. 2315-32 du même code ;");
      L.push("");
      L.push("  Le comité social et économique, après en avoir délibéré, désigne parmi");
      L.push("  ses membres, en qualité de référent en matière de lutte contre le");
      L.push("  harcèlement sexuel et les agissements sexistes, pour une durée qui prend");
      L.push("  fin avec celle du mandat des membres élus du comité :");
      L.push("");
      L.push("      [NOM, PRÉNOM] — [membre titulaire / suppléant] — [collège]");
      L.push("");
      L.push("  Coordonnées à porter sur l'information délivrée aux salariés");
      L.push("  (D. 1151-1, 5°) :");
      L.push("      adresse ......... [ADRESSE]");
      L.push("      numéro d'appel .. [NUMÉRO]");
      L.push("");
      L.push("  Le comité demande que le référent ainsi désigné bénéficie de la");
      L.push("  formation prévue à l'article L. 2315-18, aux dates suivantes : [DATES].");
      L.push("");
      L.push("  Votants : [..] · Pour : [..] · Contre : [..] · Abstentions : [..]");
      L.push("  Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("  Résolution adoptée à la majorité des membres présents.");
      L.push("");
      L.push("  Le secrétaire du comité,            Le président,");
      L.push("  [NOM]                               [NOM]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — LA FORMATION DU RÉFÉRENT");
      L.push(GROS);
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
      L.push("Le référent est NOMMÉMENT visé par la première phrase : il bénéficie de");
      L.push("la formation, et l'employeur en supporte le financement.");
      L.push("");
      L.push("  À arrêter :");
      L.push("      organisme ....... [NOM DE L'ORGANISME]");
      L.push("      dates ........... [DATES]");
      L.push("      durée ........... [DURÉE]");
      L.push("      prise en charge . employeur (L. 2315-18, dernier alinéa)");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-22-1",
        "est réservé par L. 2315-18 (« sans préjudice des dispositions de l'article " +
        "L. 2315-22-1 ») pour le financement de la formation"));
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 5 — CE QUI DOIT CHANGER SUR L'AFFICHAGE, DÈS LA DÉSIGNATION");
      L.push(GROS);
      L.push("");
      L.push("    Référent harcèlement du comité social et économique");
      L.push("    (article L. 2314-1 du code du travail)");
      L.push("      [NOM, PRÉNOM]");
      L.push("      adresse ......... [ADRESSE]");
      L.push("      numéro d'appel .. [NUMÉRO]");
      L.push("");
      L.push("Cette ligne se met à jour à chaque renouvellement du comité : le mandat du");
      L.push("référent prend fin avec celui des élus, et un affichage qui porte le nom");
      L.push("d'un ancien élu vaut, sur ce point, une absence d'information.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous transmettez le point d'ordre du");
      L.push("jour (pièce 1) et le courrier aux élus (pièce 2). Datez l'envoi et");
      L.push("conservez-en la preuve : c'est la seule chose qui établira votre");
      L.push("démarche si le comité ne désigne pas.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 15)) + " environ — la réunion du comité se tient,");
      L.push("selon le calendrier propre à l'instance. La résolution est adoptée à la");
      L.push("majorité des membres présents, le président ne prenant pas part au vote.");
      L.push("");
      L.push("Le jour même de la désignation — vous demandez au secrétaire l'extrait de");
      L.push("procès-verbal portant la résolution et le décompte des voix.");
      L.push("");
      L.push("Dans les trois jours qui suivent — l'affichage est corrigé (pièce 5).");
      L.push("Cette ligne, elle, dépend de vous seul : ne la laissez pas attendre le");
      L.push("procès-verbal définitif.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 90)) + " au plus tard — la formation de");
      L.push("L. 2315-18 est engagée (pièce 4). Aucun texte lu ne fixe ce délai : c'est");
      L.push("une échéance que vous vous donnez.");
      L.push("");
      L.push("Au prochain renouvellement du comité — la désignation se refait. Portez");
      L.push("dès aujourd'hui ce rendez-vous dans votre agenda : le mandat du référent");
      L.push("prend fin avec celui des élus, sans que personne ne vous le rappelle.");

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
     SST-CTL-HAR-03 — L'AFFICHAGE ET L'INFORMATION

     Le document le plus contrôlable de tout le module : il se lit sur un mur.
     Et le plus incomplet que l'application puisse produire, pour une raison
     qu'elle doit dire haut : le texte à afficher est celui de DEUX ARTICLES DU
     CODE PÉNAL, et le relais Légifrance du dépôt ne sert que le code du
     travail. L'affichage sort donc avec deux emplacements réservés et la
     consigne d'aller chercher les textes. Le contraire — un résumé de mémoire —
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
      var L = entete(ctx, "Affichage et information — harcèlements et agissements sexistes",
        "articles L. 1152-4, L. 1153-5 et D. 1151-1 du code du travail");

      L.push("DEUX OBLIGATIONS DISTINCTES, QU'ON CONFOND SANS CESSE");
      L.push("");
      L.push("LA PREMIÈRE, sur le HARCÈLEMENT MORAL : « L'employeur prend toutes");
      L.push("dispositions nécessaires en vue de prévenir les agissements de harcèlement");
      L.push("moral. Les personnes mentionnées à l'article L. 1152-2 sont informées PAR");
      L.push("TOUT MOYEN du texte de l'article 222-33-2 du code pénal » (L. 1152-4).");
      L.push("");
      L.push("  · le moyen est libre — affichage, note, intranet, livret d'accueil ;");
      L.push("  · l'objet ne l'est pas : c'est LE TEXTE de l'article 222-33-2 du code");
      L.push("    pénal, non son numéro et non un résumé ;");
      L.push("  · les destinataires sont « les personnes mentionnées à l'article");
      L.push("    L. 1152-2 » — celles qui ont subi, refusé de subir, relaté de bonne");
      L.push("    foi ou témoigné. En pratique, cela se traduit par une information");
      L.push("    accessible à tous : on ne sait pas d'avance qui sera concerné.");
      L.push("");
      L.push("LA SECONDE, sur le HARCÈLEMENT SEXUEL : « Dans les lieux de travail ainsi");
      L.push("que dans les locaux ou à la porte des locaux où se fait l'embauche, les");
      L.push("personnes mentionnées à l'article L. 1153-2 sont informées par tout moyen");
      L.push("du texte de l'article 222-33 du code pénal ainsi que des actions");
      L.push("contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel");
      L.push("et des coordonnées des autorités et services compétents. La liste de ces");
      L.push("services est définie par décret » (L. 1153-5, second alinéa).");
      L.push("");
      L.push("  · DEUX LIEUX, et le second est celui qu'on oublie : les lieux de");
      L.push("    travail, ET les locaux ou la porte des locaux OÙ SE FAIT L'EMBAUCHE.");
      L.push("    Le texte vise ce lieu pour lui-même : un candidat qui n'est pas encore");
      L.push("    salarié doit lire cette information avant d'entrer ;");
      L.push("  · TROIS OBJETS : le texte de l'article 222-33 du code pénal ; les");
      L.push("    actions contentieuses civiles et pénales ouvertes en matière de");
      L.push("    harcèlement sexuel ; les coordonnées des autorités et services");
      L.push("    compétents ;");
      L.push("  · la liste de ces services est celle du décret — D. 1151-1, reproduit");
      L.push("    plus bas, et qui exige pour chacun UNE ADRESSE ET UN NUMÉRO D'APPEL.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("Information sur le harcèlement moral (L. 1152-4) : " +
        etat(f.infoHarcelementMoral, "délivrée", "NON DÉLIVRÉE"));
      L.push("Information sur le harcèlement sexuel (L. 1153-5) : " +
        etat(f.infoHarcelementSexuel, "délivrée", "NON DÉLIVRÉE"));
      L.push("Coordonnées des autorités et services (D. 1151-1) : " +
        etat(f.infoCoordonnees, "délivrées", "NON DÉLIVRÉES"));
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LE SUPPORT D'AFFICHAGE");
      L.push(GROS);
      L.push("");
      L.push("À afficher DANS LES LIEUX DE TRAVAIL et DANS LES LOCAUX OU À LA PORTE DES");
      L.push("LOCAUX OÙ SE FAIT L'EMBAUCHE (L. 1153-5). Deux emplacements, deux");
      L.push("supports : ne vous contentez pas du panneau du réfectoire.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("            HARCÈLEMENT MORAL, HARCÈLEMENT SEXUEL");
      L.push("                ET AGISSEMENTS SEXISTES");
      L.push("");
      L.push("                    " + nomDe(ctx));
      L.push("              Affichage établi le " + leJour(d0));
      L.push("");
      L.push(TRAIT);
      L.push("");
      L = L.concat(blocDefinitions());
      L.push(TRAIT);
      L.push("");
      L.push("CE QUE LA LOI PUNIT — TEXTES DU CODE PÉNAL");
      L.push("");
      L.push("Harcèlement sexuel — article 222-33 du code pénal");
      L.push("(dont L. 1153-5 impose l'affichage) :");
      L.push("");
      L = L.concat(blocCodePenal("l'article 222-33 du code pénal, en entier"));
      L.push("Harcèlement moral — article 222-33-2 du code pénal");
      L.push("(dont L. 1152-4 impose la communication par tout moyen) :");
      L.push("");
      L = L.concat(blocCodePenal("l'article 222-33-2 du code pénal, en entier"));
      L.push(TRAIT);
      L.push("");
      L.push("LES ACTIONS CONTENTIEUSES OUVERTES EN MATIÈRE DE HARCÈLEMENT SEXUEL");
      L.push("(exigées par L. 1153-5 : les actions CIVILES et les actions PÉNALES)");
      L.push("");
      L.push("[À COMPLÉTER — l'application ne rédige pas cette rubrique, et il faut");
      L.push(" dire pourquoi : L. 1153-5 impose d'informer « des actions contentieuses");
      L.push(" civiles et pénales ouvertes en matière de harcèlement sexuel », mais ni");
      L.push(" lui ni D. 1151-1 n'en dressent la liste. Les décrire suppose de citer");
      L.push(" des textes de procédure civile et pénale que l'application n'a pas lus :");
      L.push(" elle ne les reproduira donc pas de mémoire.");
      L.push("");
      L.push(" Portez ici, en termes simples et exacts, les voies ouvertes à la");
      L.push(" personne : devant quelle juridiction, dans quels délais, avec quels");
      L.push(" concours. Faites relire cette rubrique par un conseil : c'est la seule");
      L.push(" du support dont le contenu ne soit pas dicté par un texte que vous");
      L.push(" pouvez recopier.]");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L = L.concat(blocProtection());
      L.push(TRAIT);
      L.push("");
      L = L.concat(blocCoordonnees(ctx));
      L.push(TRAIT);
      L.push("");
      L.push("À QUI S'ADRESSER DANS L'ENTREPRISE");
      L.push("");
      L.push("[Renvoyer ici à la procédure interne de signalement, si elle existe :");
      L.push(" à qui s'adresser, sous quelle forme, et ce qui se passe ensuite. Le");
      L.push(" document SST-CTL-HAR-04 de cette application la rédige. Un affichage qui");
      L.push(" dit ce qui est interdit sans dire à qui en parler laisse le salarié");
      L.push(" devant une porte fermée.]");
      L.push("");
      L.push("Affichage établi le " + leJour(d0) + " — à vérifier avant le " +
        leJour(dans(d0, 365)) + ".");
      L.push("Responsable de la mise à jour : [NOM, FONCTION].");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — NOTE DE DIFFUSION (harcèlement moral, L. 1152-4)");
      L.push(GROS);
      L.push("");
      L.push("L. 1152-4 n'impose pas un affichage : il impose une information PAR TOUT");
      L.push("MOYEN. L'affichage y suffit, mais une note nominativement diffusée se");
      L.push("prouve mieux — et la preuve, ici, est tout ce qui restera.");
      L.push("");
      L.push(nomDe(ctx) + " — note du " + leJour(d0));
      L.push("Objet : information sur le harcèlement moral (article L. 1152-4 du code");
      L.push("du travail)");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'article L. 1152-4 du code du travail prévoit que l'employeur prend");
      L.push("toutes dispositions nécessaires en vue de prévenir les agissements de");
      L.push("harcèlement moral, et que les personnes mentionnées à l'article L. 1152-2");
      L.push("sont informées par tout moyen du texte de l'article 222-33-2 du code");
      L.push("pénal.");
      L.push("");
      L.push("Le harcèlement moral est défini par l'article L. 1152-1 du code du");
      L.push("travail : « Aucun salarié ne doit subir les agissements répétés de");
      L.push("harcèlement moral qui ont pour objet ou pour effet une dégradation de ses");
      L.push("conditions de travail susceptible de porter atteinte à ses droits et à sa");
      L.push("dignité, d'altérer sa santé physique ou mentale ou de compromettre son");
      L.push("avenir professionnel. »");
      L.push("");
      L.push("Le texte de l'article 222-33-2 du code pénal figure ci-après :");
      L.push("");
      L = L.concat(blocCodePenal("l'article 222-33-2 du code pénal, en entier"));
      L.push("Aucune personne ayant subi ou refusé de subir de tels agissements, ou");
      L.push("ayant de bonne foi relaté ou témoigné de tels agissements, ne peut faire");
      L.push("l'objet des mesures mentionnées à l'article L. 1121-2 du code du travail");
      L.push("(L. 1152-2).");
      L.push("");
      L.push("Vous pouvez vous adresser à [voir la procédure interne de signalement /");
      L.push("aux personnes et services dont les coordonnées figurent à l'affichage].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — RELEVÉ DE DIFFUSION ET D'AFFICHAGE");
      L.push(GROS);
      L.push("");
      L.push("Ce que l'on vous demandera n'est pas « avez-vous affiché ? » mais");
      L.push("« montrez-le ». Ce relevé est la pièce qui répond.");
      L.push("");
      L.push("  Emplacement                       | Date | Support | Preuve conservée");
      L.push("  ----------------------------------|------|---------|-----------------");
      L.push("  Lieu de travail : [SITE / ATELIER]| [..] | [......] | [photographie]");
      L.push("  Lieu de travail : [SITE / ATELIER]| [..] | [......] | [photographie]");
      L.push("  Locaux ou porte des locaux où se  |      |         |");
      L.push("  fait l'embauche : [LIEU]          | [..] | [......] | [photographie]");
      L.push("  Intranet / espace salarié         | [..] | [......] | [capture datée]");
      L.push("  Note nominative (L. 1152-4)       | [..] | [......] | [émargement]");
      L.push("  Livret d'accueil / remise à");
      L.push("  l'embauche                        | [..] | [......] | [récépissé]");
      L.push("");
      L.push("Le lieu d'embauche est visé pour lui-même par L. 1153-5 : s'il ne figure");
      L.push("pas dans ce relevé, l'obligation n'est pas tenue, quel que soit le nombre");
      L.push("de panneaux dans les ateliers.");
      L.push("");
      L.push("Relevé arrêté le " + leJour(d0) + " par [NOM, FONCTION].");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — CE QU'IL FAUT ALLER CHERCHER, ET OÙ");
      L.push(GROS);
      L.push("");
      L.push("L'application ne lit que le CODE DU TRAVAIL. Trois éléments de cet");
      L.push("affichage ne s'y trouvent pas, et elle ne les inventera pas :");
      L.push("");
      L.push("  1. le TEXTE de l'article 222-33 du code pénal (harcèlement sexuel) ;");
      L.push("  2. le TEXTE de l'article 222-33-2 du code pénal (harcèlement moral) ;");
      L.push("  3. la description des actions contentieuses civiles et pénales");
      L.push("     ouvertes en matière de harcèlement sexuel.");
      L.push("");
      L.push("Les deux premiers se recopient depuis le code pénal, dans leur version en");
      L.push("vigueur au jour de l'affichage. Notez cette date sur le support : ces");
      L.push("articles ont été modifiés, et un affichage périmé se voit.");
      L.push("");
      L.push("Le troisième demande une rédaction : faites-la relire.");
      L.push("");
      L.push("Deux autres articles du code du travail sont NOMMÉS par l'affichage sans");
      L.push("que l'application les ait lus :");
      L.push("");
      L = L.concat(blocRenvoi("L. 1121-2",
        "porte les mesures interdites contre la personne protégée, auxquelles " +
        "renvoient L. 1152-2 et L. 1153-2"));
      L = L.concat(blocRenvoi("L. 1142-2-1",
        "définit l'agissement sexiste, auquel renvoie L. 4121-2, 7°"));

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous relevez les cinq coordonnées de");
      L.push("D. 1151-1. C'est le travail le plus long : le nom de l'inspecteur du");
      L.push("travail compétent se demande à l'unité de contrôle, il ne se devine pas.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 3)) + " — vous recopiez les deux articles du code");
      L.push("pénal et vous rédigez la rubrique des actions contentieuses.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " — l'affichage est posé, aux DEUX");
      L.push("emplacements : lieux de travail, et locaux ou porte des locaux où se fait");
      L.push("l'embauche. La note de diffusion sur le harcèlement moral part le même");
      L.push("jour. Vous datez le relevé (pièce 3) et vous photographiez chaque");
      L.push("emplacement.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " — vous vérifiez que rien n'a été");
      L.push("décroché, recouvert ou déplacé. Un affichage arraché la semaine suivante");
      L.push("n'est plus un affichage.");
      L.push("");
      L.push("Avant le " + leJour(dans(d0, 365)) + " — relecture annuelle des cinq");
      L.push("coordonnées. Aucun texte lu ne fixe cette périodicité : c'est une");
      L.push("échéance que vous vous donnez, parce que ces coordonnées se périment.");
      L.push("");
      L.push("Sans attendre l'échéance, à chaque changement : nouveau référent, nouvel");
      L.push("inspecteur, déménagement du service de santé au travail, franchissement");
      L.push("du seuil de deux cent cinquante salariés. Le support se corrige le jour");
      L.push("même.");

      return L.concat(pied("L. 1152-4, L. 1153-5, D. 1151-1, L. 1152-1, L. 1152-2, " +
        "L. 1153-1, L. 1153-2, L. 4121-1",
        ["Aucune peine n'est annoncée pour ce manquement, et le périmètre a été",
         "vérifié. R. 4741-3 punit la méconnaissance des « documents et affichages",
         "obligatoires », mais son énumération est CLOSE — L. 4711-1 à L. 4711-5 et",
         "D. 4711-1 à D. 4711-3 —, et l'affichage de L. 1153-5 n'y figure pas.",
         "L. 4741-1 ne l'atteint pas davantage : son énumération porte sur la",
         "quatrième partie du code, quand L. 1152-4 et L. 1153-5 sont à la première.",
         "L. 1155-2 ne punit que les discriminations commises À LA SUITE d'un",
         "harcèlement. Ce qui se joue ici est civil : une information absente ou",
         "incomplète se constate sur place et nourrit le manquement à l'obligation de",
         "prévention (L. 1152-4, L. 1153-5) et à l'obligation de sécurité (L. 4121-1).",
         "",
         "Les articles 222-33 et 222-33-2 du CODE PÉNAL, ainsi que L. 1121-2 et",
         "L. 1142-2-1 du code du travail, sont NOMMÉS ici sans avoir été lus par",
         "l'application : elle n'en reproduit pas le contenu."])).join("\n");
    },
  });

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
