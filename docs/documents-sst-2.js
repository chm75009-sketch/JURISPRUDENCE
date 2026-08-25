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

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-HAR-04 — LA PRÉVENTION ORGANISÉE

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
      L.push("unique — « l'entreprise est attentive aux risques psychosociaux » — ne");
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
        L.push("C'est la version qui reçoit le volet ci-dessous — et l'insertion de ce");
        L.push("volet est elle-même une mise à jour, à dater du jour où vous la faites.");
      }
      L.push(ligneEffectif(ctx));
      L.push("");
      if (estNon((f.duerp || {}).existe)) {
        L.push("ATTENTION — le dossier indique qu'il n'existe pas de document unique. Le");
        L.push("volet ci-dessous n'a alors nulle part où s'inscrire : commencez par le");
        L.push("document unique lui-même, que le générateur SST-CTL-DUE-01 de cette");
        L.push("application produit. Le volet « harcèlement » viendra s'y insérer.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — VOLET « HARCÈLEMENT ET AGISSEMENTS SEXISTES » DU DOCUMENT UNIQUE");
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
      L.push("sans enquête — c'est un inventaire, pas une accusation :");
      L.push("");
      L.push("  · le travail isolé ou en très petite équipe, où il n'y a pas de témoin ;");
      L.push("  · le travail de nuit, en horaires décalés, sur site du client ;");
      L.push("  · les relations hiérarchiques resserrées, où une seule personne décide");
      L.push("    des plannings, des affectations et de l'évaluation ;");
      L.push("  · les contacts avec des tiers — clients, usagers, sous-traitants — sur");
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
      L.push("PIÈCE 2 — PROCÉDURE INTERNE DE SIGNALEMENT ET DE TRAITEMENT");
      L.push(GROS);
      L.push("");
      L.push("AVERTISSEMENT SUR CE QUI SUIT — aucun texte lu n'impose une procédure");
      L.push("écrite, ni n'en fixe le contenu, les circuits ou les délais. Ce que les");
      L.push("textes imposent, c'est le résultat : prévenir, mettre un terme,");
      L.push("sanctionner (L. 1152-4 ; L. 1153-5), et prendre les mesures nécessaires");
      L.push("pour protéger la santé physique et mentale des travailleurs (L. 4121-1).");
      L.push("La procédure ci-dessous est un MOYEN, proposé parce qu'un employeur qui");
      L.push("n'a pas décidé à l'avance qui reçoit, qui décide et en combien de temps");
      L.push("improvise le jour où il reçoit un signalement — et improvise mal. Les");
      L.push("délais qu'elle porte sont les vôtres : ils ne sont pas dans la loi.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("     PROCÉDURE DE SIGNALEMENT ET DE TRAITEMENT DES SITUATIONS DE");
      L.push("     HARCÈLEMENT MORAL, DE HARCÈLEMENT SEXUEL ET D'AGISSEMENTS SEXISTES");
      L.push("");
      L.push("     " + nomDe(ctx));
      L.push("     Version [N°] — applicable à compter du [DATE]");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("ARTICLE 1 — OBJET ET CHAMP");
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
      L.push("ARTICLE 2 — CE QUE LA LOI DÉFINIT");
      L.push("");
      L = L.concat(blocDefinitions());
      L.push("ARTICLE 3 — QUI PEUT SIGNALER, ET COMMENT");
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
      L.push("ARTICLE 4 — QUI REÇOIT");
      L.push("");
      L.push("  · [FONCTION] — destinataire principal ;");
      L.push("  · [FONCTION] — destinataire de remplacement, notamment lorsque le");
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
      L.push("ARTICLE 5 — LE CIRCUIT, ÉTAPE PAR ÉTAPE");
      L.push("");
      L.push("  ÉTAPE 1 — RÉCEPTION ET ACCUSÉ. Le signalement est daté à sa réception et");
      L.push("  consigné dans un registre tenu par [FONCTION]. Un accusé de réception");
      L.push("  écrit est remis à son auteur sous [X jours ouvrés — proposé : 2],");
      L.push("  rappelant la protection dont il bénéficie et indiquant qui suivra le");
      L.push("  dossier.");
      L.push("");
      L.push("  ÉTAPE 2 — MESURES IMMÉDIATES. Sans attendre l'enquête, sont examinées");
      L.push("  les mesures propres à faire cesser les faits ALLÉGUÉS et à protéger la");
      L.push("  personne : aménagement des horaires ou des affectations, suspension des");
      L.push("  contacts entre les personnes concernées, orientation vers le médecin du");
      L.push("  travail. Délai proposé : [X jours ouvrés — proposé : 3].");
      L.push("");
      L.push("  CES MESURES NE SONT PAS DES SANCTIONS et ne se prennent pas au détriment");
      L.push("  de celui qui signale : le déplacer, changer ses horaires ou l'écarter");
      L.push("  d'un projet contre son gré peut constituer, à son égard, une mesure que");
      L.push("  L. 1152-2 et L. 1153-2 interdisent. Quand l'éloignement s'impose, il se");
      L.push("  discute d'abord avec la personne protégée, et la solution retenue est");
      L.push("  écrite avec son accord ou, à défaut, avec la raison qui l'a imposée.");
      L.push("");
      L.push("  ÉTAPE 3 — DÉCISION D'ENQUÊTER. Une décision écrite fixe l'auteur de");
      L.push("  l'enquête, son périmètre et son calendrier. Délai proposé : [X jours");
      L.push("  ouvrés — proposé : 5]. Ne pas enquêter est une décision : si elle est");
      L.push("  prise, elle s'écrit et se motive.");
      L.push("");
      L.push("  ÉTAPE 4 — ENQUÊTE. Auditions de la personne qui signale, de la personne");
      L.push("  mise en cause et des témoins utiles, recueil des pièces. Durée proposée :");
      L.push("  [X semaines — proposé : 4 à 6]. Le document SST-CTL-HAR-05 de cette");
      L.push("  application porte la trame d'audition et la structure du rapport.");
      L.push("");
      L.push("  ÉTAPE 5 — RAPPORT. Un rapport écrit et daté expose ce qui a été");
      L.push("  recherché, ce qui a été constaté et ce qui ne l'a pas été.");
      L.push("");
      L.push("  ÉTAPE 6 — SUITES. Mesures pour mettre un terme aux faits ; sanction");
      L.push("  disciplinaire s'ils sont établis, prise selon la procédure disciplinaire");
      L.push("  — que le module « discipline » de cette application traite ; mesures");
      L.push("  d'organisation pour l'avenir. Délai proposé : [X jours ouvrés après le");
      L.push("  rapport — proposé : 10].");
      L.push("");
      L.push("  ÉTAPE 7 — RETOUR AUX PERSONNES. La personne qui a signalé et la personne");
      L.push("  mise en cause sont informées par écrit de la clôture et du sens de la");
      L.push("  décision. Le rapport lui-même n'est pas nécessairement communiqué ; ce");
      L.push("  qui doit l'être, c'est que l'entreprise a instruit et a décidé.");
      L.push("");
      L.push("  ÉTAPE 8 — SUIVI. Un point est fait avec la personne qui a signalé à");
      L.push("  [X semaines — proposé : 4] puis à [X mois — proposé : 3], pour vérifier");
      L.push("  que les faits ont cessé et qu'aucune mesure défavorable n'a suivi.");
      L.push("  C'est cette étape qui manque presque toujours, et c'est elle qui donne");
      L.push("  sa portée à l'obligation d'Y METTRE UN TERME.");
      L.push("");
      L.push("ARTICLE 6 — LES GARANTIES");
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
      L.push("     signalés », « les faits allégués » — jamais « les faits de");
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
      L.push("     et par qui — un salarié de l'entreprise, un membre du comité. Aucun");
      L.push("     texte lu ne l'impose au stade de l'enquête ; le prévoir apaise les");
      L.push("     auditions. En revanche, l'assistance lors de l'entretien préalable à");
      L.push("     une SANCTION est, elle, prévue par L. 1332-2, et le module");
      L.push("     « discipline » de cette application la traite.]");
      L.push("");
      L.push("ARTICLE 7 — CONSERVATION");
      L.push("");
      L.push("Le dossier complet — signalement, accusé, mesures immédiates, décision");
      L.push("d'enquête, comptes rendus d'audition, pièces, rapport, suites, courriers");
      L.push("de retour, points de suivi — est conservé [durée que vous fixez], sous");
      L.push("[modalité]. C'est ce dossier, et non le souvenir des personnes, qui");
      L.push("établira ce que l'entreprise a fait.");
      L.push("");
      L.push("ARTICLE 8 — RÉVISION");
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
        L.push(" intérieur et de ses formalités — avis du comité social et économique,");
        L.push(" publicité, dépôt, communication à l'inspection. Le module « discipline");
        L.push(" et règlement intérieur » de cette application les traite. Présenter la");
        L.push(" procédure au comité est en tout état de cause de bonne méthode : une");
        L.push(" procédure que les élus découvrent le jour d'un signalement ne sera pas");
        L.push(" utilisée.]");
        L.push("");
      }
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — PLAN D'INFORMATION ET DE FORMATION");
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
      L.push("PIÈCE 4 — NOTE DE DIFFUSION DE LA PROCÉDURE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — note du " + leJour(d0));
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
      L.push("Diffusion : [tout le personnel — préciser le support et conserver la");
      L.push("preuve : émargement, accusé électronique, capture datée]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous relevez vos unités de travail et");
      L.push("les situations exposantes (pièce 1). Ce relevé se fait avec ceux qui");
      L.push("connaissent le travail réel, pas depuis un bureau.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " — le volet du document unique est");
      L.push("rédigé et intégré. C'est l'ordre qui compte : le risque d'abord, la");
      L.push("procédure ensuite.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " — la procédure est arrêtée (pièce 2) :");
      L.push("les noms sont portés, les délais choisis, la règle de déport écrite.");
      L.push("");
      if (!estNon(cse.existe)) {
        L.push("Avant l'adoption — présentation au comité social et économique. Le comité");
        L.push("« est consulté sur le document unique d'évaluation des risques");
        L.push("professionnels et sur ses mises à jour » (L. 4121-3, 1°) : la mise à jour");
        L.push("qui porte le volet harcèlement entre dans cette consultation. Prévoyez le");
        L.push("délai de convocation propre à l'instance.");
        L.push("");
      }
      L.push("Au " + leJour(dans(d0, 45)) + " — la procédure est diffusée (pièce 4),");
      L.push("l'affichage est en place, et les preuves de diffusion sont conservées.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 120)) + " — la formation de l'encadrement est");
      L.push("faite (pièce 3), avec sa feuille de présence.");
      L.push("");
      L.push("Avant le " + leJour(dans(d0, 365)) + " — réexamen du volet et de la");
      L.push("procédure, à l'occasion de la mise à jour du document unique.");
      L.push("");
      L.push("Ces durées sont les VÔTRES : aucun texte lu ne fixe de délai pour");
      L.push("organiser la prévention. Ce que les textes fixent, c'est l'obligation de");
      L.push("l'organiser — et elle court déjà.");
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
         "les conditions prévues aux articles R. 4121-1 et R. 4121-2 » — il atteint",
         "donc le document unique lui-même, dont le module traite ailleurs (SST-CTL-",
         "DUE-01 à DUE-04), et non l'organisation de la prévention du harcèlement.",
         "L. 4741-1 ne rattrape pas les principes généraux de prévention : son",
         "énumération vise, pour le livre Ier de la quatrième partie, les « Titres",
         "Ier, III et IV », et le titre II — où vivent L. 4121-1 et L. 4121-2 — en est",
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
     SST-CTL-HAR-05 — LE SIGNALEMENT REÇU : ENQUÊTE, AUDITIONS, RAPPORT, SUITES

     Le seul document du fichier qui s'écrit sous la pression du temps, et le
     seul où une phrase maladroite se paie. Deux règles l'ont commandé :

     — RIEN N'EST QUALIFIÉ D'AVANCE. La trame d'audition ne pose aucune
       question qui suppose les faits établis. Le rapport porte trois
       conclusions possibles, et aucune n'est pré-remplie. « Faits non
       établis » n'est pas « signalement mensonger » : le rapport le dit, parce
       que la confusion des deux fonde les représailles que L. 1152-2 et
       L. 1153-2 interdisent.

     — LES SUITES SE DÉCIDENT DANS LES TROIS SENS. Établis : mesures et
       sanction. Non établis : mesures d'organisation quand même, s'il y a
       lieu. Éléments insuffisants : ce que l'on fait pour que la situation ne
       reste pas en l'état.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-HAR-05", {
    nom: "Le signalement reçu : mesures immédiates, enquête, trames d'audition, rapport et suites",
    detail: "L'accusé de réception, la décision de mesures conservatoires, la lettre " +
            "de mission d'enquête, les trois trames d'audition — personne qui signale, " +
            "personne mise en cause, témoins —, la structure du rapport, les courriers " +
            "de clôture et le calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var s = f.signalement || {};
      var cse = f.cse || {};
      var d0 = aujourd(ctx);
      var au250 = seuil(ctx, 250);
      var L = entete(ctx, "Signalement de harcèlement — enquête interne et suites",
        "articles L. 1153-5, L. 1152-4, L. 4121-1, L. 1152-2 et L. 1153-2 du code du travail");

      L.push("À LIRE AVANT TOUT LE RESTE");
      L.push("");
      L.push("Ce document ne dit pas ce qui s'est passé. Il ne le dira à aucun moment.");
      L.push("L'application ne connaît ni les personnes, ni les faits, ni les pièces :");
      L.push("tout ce qui les concerne sort ENTRE CROCHETS, et c'est l'employeur qui");
      L.push("écrit — c'est lui qui sait, et c'est lui qui répondra de ce qu'il aura");
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
      L.push("D'où la règle qui commande tout le dossier — TOUT S'ÉCRIT, TOUT SE DATE,");
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
      L.push("PIÈCE 1 — ACCUSÉ DE RÉCEPTION DU SIGNALEMENT");
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
      L.push("PIÈCE 2 — DÉCISION DE MESURES IMMÉDIATES");
      L.push(GROS);
      L.push("");
      L.push("Ces mesures ne supposent AUCUNE enquête et n'attendent AUCUNE");
      L.push("qualification : elles portent sur les faits ALLÉGUÉS, et elles se");
      L.push("justifient par le seul signalement. C'est le sens de l'obligation d'Y");
      L.push("METTRE UN TERME (L. 1153-5) et de l'obligation de sécurité (L. 4121-1).");
      L.push("");
      L.push(nomDe(ctx));
      L.push("DÉCISION DU " + leJour(d0).toUpperCase() + " — MESURES IMMÉDIATES");
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
      L.push("         [préciser — c'est une mesure d'attente, non une sanction ; la");
      L.push("         procédure disciplinaire qui doit la suivre relève du module");
      L.push("         « discipline » de cette application]");
      L.push("     [ ] autre : [préciser]");
      L.push("     [ ] aucune mesure — SI VOUS COCHEZ CETTE CASE, ÉCRIVEZ POURQUOI :");
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
      L.push("PIÈCE 3 — DÉCISION D'ENQUÊTE ET LETTRE DE MISSION");
      L.push(GROS);
      L.push("");
      L.push("Écrire QUI enquête, SUR QUOI et JUSQU'À QUAND avant de commencer : c'est");
      L.push("ce qui distingue une enquête d'une série de conversations.");
      L.push("");
      L.push(nomDe(ctx));
      L.push("DÉCISION DU " + leJour(d0).toUpperCase() + " — ENQUÊTE INTERNE");
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
      L.push("   rendus, courriels — préciser].");
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
      L.push("     · ne rien promettre à personne — ni l'anonymat des témoins, qui ne");
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
      L.push("PIÈCE 4 — CONVOCATION À UNE AUDITION");
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
      L.push("[VARIANTE — PERSONNE MISE EN CAUSE, à substituer au paragraphe précédent :");
      L.push(" Une enquête interne a été ouverte le [DATE]. Des faits vous sont");
      L.push(" imputés : [LES ÉNONCER, datés et circonstanciés, en termes qui vous");
      L.push(" permettent de répondre — c'est la condition pour que votre réponse ait un");
      L.push(" sens]. Vous êtes invité(e) à vous en expliquer le [DATE] à [HEURE], à");
      L.push(" [LIEU], devant [NOMS].");
      L.push(" Cette convocation ne préjuge de rien : aucune conclusion n'est arrêtée,");
      L.push(" et elle ne le sera pas avant que vous ayez été entendu(e).");
      L.push(" Elle n'est pas une convocation à un entretien préalable à une sanction :");
      L.push(" si une procédure disciplinaire devait être engagée à l'issue de");
      L.push(" l'enquête, elle donnerait lieu à une convocation distincte, portant ses");
      L.push(" propres mentions.]");
      L.push("");
      L.push("[VARIANTE — TÉMOIN, à ajouter : Vous êtes entendu(e) en qualité de témoin.");
      L.push(" Vous n'êtes mis(e) en cause d'aucune manière.]");
      L.push("");
      L.push("[Le cas échéant : vous pouvez être accompagné(e) par [préciser qui —");
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
      L.push("PIÈCE 5 — TRAME D'AUDITION N° 1 : LA PERSONNE QUI A SIGNALÉ");
      L.push(GROS);
      L.push("");
      L.push("COMPTE RENDU D'AUDITION");
      L.push("Enquête ouverte le [DATE] · Audition n° [.] · " + nomDe(ctx));
      L.push("");
      L.push("Date et heure : [.....] — début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Personne entendue : [NOM, PRÉNOM] — [fonction, service, ancienneté]");
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
      L.push("LE RÉCIT — QUESTIONS OUVERTES D'ABORD");
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
      L.push("  Q6. Disposez-vous d'éléments matériels — messages, courriels, plannings,");
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
      L.push("      intervenue — horaires, affectation, planning, évaluation, relations");
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
      L.push("[ou : la personne entendue a refusé de signer — mention portée le [DATE]]");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 6 — TRAME D'AUDITION N° 2 : LA PERSONNE MISE EN CAUSE");
      L.push(GROS);
      L.push("");
      L.push("C'est l'audition la plus délicate, et la plus décisive : une enquête qui");
      L.push("conclut sans avoir entendu la personne mise en cause sur des faits énoncés");
      L.push("de manière précise ne vaut rien — ni contre elle, ni pour l'entreprise.");
      L.push("");
      L.push("COMPTE RENDU D'AUDITION");
      L.push("Enquête ouverte le [DATE] · Audition n° [.] · " + nomDe(ctx));
      L.push("");
      L.push("Date et heure : [.....] — début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Personne entendue : [NOM, PRÉNOM] — [fonction, service]");
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
      L.push("   dit ou fait, quel jour, où, devant qui. Une formule générale — « votre");
      L.push("   comportement », « des propos déplacés » — ne met pas la personne en");
      L.push("   mesure de répondre, et rend sa réponse inutilisable.");
      L.push("");
      L.push("   Fait 1 : [.....]");
      L.push("   Fait 2 : [.....]");
      L.push("   Fait 3 : [.....]");
      L.push("");
      L.push("   NE PAS RÉVÉLER ce qui identifierait un témoin lorsque cela n'est pas");
      L.push("   nécessaire à l'énoncé du fait — mais ne pas énoncer si vaguement que la");
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
      L.push("  Q4. Y a-t-il eu, entre vous, des difficultés antérieures — désaccord,");
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
      L.push("[ou : la personne entendue a refusé de signer — mention portée le [DATE]]");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 7 — TRAME D'AUDITION N° 3 : LES TÉMOINS");
      L.push(GROS);
      L.push("");
      L.push("COMPTE RENDU D'AUDITION");
      L.push("Enquête ouverte le [DATE] · Audition n° [.] · " + nomDe(ctx));
      L.push("");
      L.push("Date et heure : [.....] — début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Personne entendue : [NOM, PRÉNOM] — [fonction, service]");
      L.push("Qualité : témoin — n'est mis(e) en cause d'aucune manière");
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
      L.push("      dans quelles conditions — mêmes horaires, même lieu, même équipe ?");
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
      L.push("[ou : refus de signer — mention portée le [DATE]]");
      L.push("Signatures des enquêteurs : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 8 — RAPPORT D'ENQUÊTE");
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
      L.push("3. ACTES ACCOMPLIS — TABLEAU CHRONOLOGIQUE");
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
      L.push("   FAIT n° 1 — [énoncé, daté, circonstancié]");
      L.push("     · ce qu'en dit la personne qui a signalé : [.....]");
      L.push("     · ce qu'en dit la personne mise en cause : [.....]");
      L.push("     · ce qu'en disent les témoins : [.....]");
      L.push("     · pièces s'y rapportant : [cotes]");
      L.push("     · points concordants : [.....]");
      L.push("     · points contradictoires : [.....]");
      L.push("");
      L.push("   FAIT n° 2 — [même structure]");
      L.push("   FAIT n° 3 — [même structure]");
      L.push("");
      L.push("5. ANALYSE");
      L.push("");
      L.push("   5.1 Pour chaque fait : les éléments recueillis permettent-ils de le");
      L.push("       tenir pour établi, et sur quoi repose cette appréciation ?");
      L.push("   5.2 Rapprochement des faits établis avec les définitions légales,");
      L.push("       CITÉES et non résumées : L. 1152-1 pour le harcèlement moral,");
      L.push("       L. 1153-1 pour le harcèlement sexuel. Vérifier notamment, pour");
      L.push("       L. 1153-1, les cas a) et b) — plusieurs auteurs — et le 2°, où la");
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
      L.push("       [.....] — L. 1153-5 impose d'y mettre un terme, et cette obligation");
      L.push("       est distincte de celle de sanctionner.");
      L.push("   7.2 SANCTION, si les faits sont établis : [proposition]. Elle se prend");
      L.push("       selon la procédure disciplinaire — convocation, entretien,");
      L.push("       notification écrite et motivée dans les délais — que le module");
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
      L.push("PIÈCE 9 — COURRIERS DE CLÔTURE");
      L.push(GROS);
      L.push("");
      L.push("A — À LA PERSONNE QUI A SIGNALÉ");
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
      L.push(" — Les faits sont établis. Les mesures suivantes ont été prises : [.....].");
      L.push("   [Le cas échéant : une procédure disciplinaire a été engagée. Son issue");
      L.push("   ne peut pas vous être communiquée dans le détail.]");
      L.push(" — Les faits n'ont pas pu être établis au vu des éléments recueillis. Les");
      L.push("   mesures suivantes ont néanmoins été prises : [.....].");
      L.push(" — Les éléments recueillis n'ont pas permis de conclure. Les mesures");
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
      L.push("B — À LA PERSONNE MISE EN CAUSE");
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
      L.push(" — Les faits qui vous étaient imputés n'ont pas été établis. Aucune suite");
      L.push("   n'y est donnée, et aucune mention n'en sera portée à votre dossier");
      L.push("   individuel.");
      L.push(" — Les éléments recueillis n'ont pas permis de conclure. Aucune sanction");
      L.push("   n'est prononcée. [Le cas échéant : les mesures d'organisation suivantes");
      L.push("   sont prises, qui ne constituent pas une sanction : .....]");
      L.push(" — Les faits suivants ont été retenus : [.....]. Vous serez convoqué(e) à");
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
      L.push("textes fixent, c'est l'obligation d'agir — et le temps passé sans agir se");
      L.push("lira sur les dates du dossier.");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — accusé de réception (pièce 1) et");
      L.push("examen des mesures immédiates (pièce 2). Ces deux actes ne supposent");
      L.push("aucune enquête et ne dépendent que de vous.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 3)) + " au plus tard — les mesures immédiates");
      L.push("sont arrêtées et écrites, avec la vérification du point 4 : ne pas faire");
      L.push("peser la mesure sur celui qui a parlé.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " — la décision d'enquête est signée");
      L.push("(pièce 3) : qui enquête, sur quoi, jusqu'à quand.");
      L.push("");
      L.push("Du " + leJour(dans(d0, 8)) + " au " + leJour(dans(d0, 42)) + " — les");
      L.push("auditions (pièces 4 à 7) et le recueil des pièces. Entendre la personne");
      L.push("mise en cause AVANT toute conclusion, jamais après.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 49)) + " — le rapport est établi (pièce 8).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 56)) + " — les suites sont décidées et les");
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
      L.push("Au " + leJour(dans(d0, 84)) + " puis au " + leJour(dans(d0, 175)) + " —");
      L.push("les points de suivi avec la personne qui a signalé. C'est l'étape que");
      L.push("l'on saute, et c'est elle qui prouve qu'on a mis un terme.");

      return L.concat(pied("L. 1153-5, L. 1152-4, L. 1152-1, L. 1153-1, L. 1152-2, " +
        "L. 1153-2, L. 4121-1, L. 1155-2, R. 4121-2, D. 1151-1",
        ["Décision citée, lue à la source dans la base Judilibre de la Cour de",
         "cassation, réponse non relaxée : Soc., 18 juin 2025, n° 23-19.022, publié —",
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
         "Ce texte punit les REPRÉSAILLES — la mesure prise contre celui qui a subi,",
         "refusé de subir, relaté ou témoigné —, non l'insuffisance d'une enquête ni",
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

})(typeof window !== "undefined" ? window : this);
