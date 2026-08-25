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

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
