/* Les documents que l'application PRODUIT — les six écrits de la procédure
   disciplinaire.

   POURQUOI CE FICHIER EXISTE, ET POURQUOI IL EST SÉPARÉ

   documents-produits.js porte le règlement intérieur ; documents-discipline.js
   porte ses avenants, ses formalités, et les six premiers contrôles de
   sanction — DIS-CTL-SAN-01 à SAN-06 : l'écrit des griefs, la sanction
   pécuniaire, la sanction absente de l'échelle, la durée de la mise à pied, la
   prescription des faits, la prescription des sanctions antérieures.

   Restaient les six autres, et ce sont les plus quotidiens : l'entretien
   préalable, la lettre qui y convoque, les délais de notification, la décision
   écrite et motivée, la mise à pied conservatoire, et la procédure que la
   convention collective ajoute à la loi. Un employeur à qui l'on explique
   qu'il aurait dû convoquer n'a toujours pas de lettre de convocation ; ce
   fichier l'écrit, à son nom, avec les dates de son dossier et les délais
   calculés à partir d'elles.

   Le registre commun n'accepte qu'une fois chaque identifiant : ce fichier
   n'enregistre que DIS-CTL-SAN-07 à DIS-CTL-SAN-12.

   TROIS RÈGLES, TENUES PARTOUT

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Chaque article cité ici figure dans
      moteur/discipline/textes-discipline.json avec son identifiant de version,
      ou dans le fondement du contrôle auquel le document répond. Les articles
      seulement RENVOYÉS par un texte lu sont NOMMÉS, jamais reproduits ni
      paraphrasés, et le document le dit à l'endroit du renvoi. Pour ce
      fichier : le chapitre V du titre III du livre II, auquel L. 1333-3
      renvoie pour la contestation des irrégularités de licenciement, et les
      articles 132-11 et 132-15 du code pénal, étrangers au corpus.

      Les décisions citées viennent du bloc ARRETS de
      moteur/discipline/controles-discipline.js, où elles sont conservées
      telles qu'elles ont été lues dans la base Judilibre de la Cour de
      cassation. Elles ne sont citées que pour ce qu'elles disent.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ. Le
      périmètre a été revérifié pour ce fichier, et il ne bouge pas :
        · R. 1323-1 s'arrête à L. 1322-4 et à R. 1321-5 : il atteint le
          règlement intérieur, jamais la procédure disciplinaire ;
        · L. 1334-1 ne vise que L. 1331-2 — l'amende et la sanction
          pécuniaire —, que le module traite en DIS-CTL-SAN-02.
      Aucun des six documents de ce fichier ne menace donc d'une amende pour
      un entretien qui n'a pas eu lieu, une convocation incomplète, un délai
      dépassé, une notification défaillante, une mise à pied conservatoire
      laissée sans suite ou une procédure conventionnelle non suivie. CE QUI
      S'Y JOUE EST L'ANNULATION : « le conseil de prud'hommes peut annuler une
      sanction irrégulière en la forme ou injustifiée ou disproportionnée à la
      faute commise » (L. 1333-2) — et, lorsque la mesure est un licenciement,
      l'absence de cause réelle et sérieuse, selon la jurisprudence citée.

   3. LES GRIEFS NE S'INVENTENT JAMAIS. Aucune de ces lettres n'écrit ce que
      le salarié aurait fait. Les faits sortent entre crochets, avec la
      consigne de les écrire datés et circonstanciés — c'est l'employeur qui
      sait, et c'est lui qui répondra de ce qu'il a écrit.

   UNE QUATRIÈME RÈGLE, PROPRE AU LICENCIEMENT. Lorsque la mesure auditée est
   un licenciement disciplinaire, la procédure applicable n'est pas celle de
   L. 1332-2 : « Lorsque la sanction contestée est un licenciement les
   dispositions du présent chapitre ne sont pas applicables » (L. 1333-3).
   Chacun des documents qui écrit une pièce de la procédure de L. 1332-2 le
   dit avant de la produire, et n'écrit jamais une convocation de licenciement
   sous couvert de convocation disciplinaire.                                */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-discipline-2.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE DATE

     Les mêmes que ceux de documents-discipline.js, et pour la même raison :
     les dates du dossier sont des chaînes « AAAA-MM-JJ », lues en heure
     locale. Un midi UTC suffirait à décaler d'un jour l'affichage chez un
     lecteur situé assez à l'ouest, et un document daté du mauvais jour est
     pire qu'un document non daté.
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

  /* Le même quantième, n mois plus tard — la règle que R. 1332-3 énonce pour
     le délai d'un mois de L. 1332-2, et selon laquelle se compte aussi le
     délai de deux mois de L. 1332-4 : « le jour du mois suivant qui porte le
     même quantième […] à défaut d'un quantième identique, le dernier jour du
     mois suivant ». */
  function moisApres(iso, n) {
    if (!estISO(iso)) return null;
    var p = iso.split("-").map(Number);
    var t = p[0] * 12 + (p[1] - 1) + n;
    var an = Math.floor(t / 12), mo = t - an * 12 + 1;
    var dernier = new Date(an, mo, 0).getDate();
    return isoDe(new Date(an, mo - 1, Math.min(p[2], dernier)));
  }

  function plusJours(iso, n) {
    var d = dateDe(iso);
    if (!d) return null;
    d.setDate(d.getDate() + n);
    return isoDe(d);
  }

  /* « Lorsque le dernier jour de ce délai est un samedi, un dimanche ou un jour
     férié ou chômé, le délai est prorogé jusqu'au premier jour ouvrable
     suivant » (R. 1332-3). L'application ne tient pas le calendrier des jours
     fériés : elle proroge le samedi et le dimanche, et signale partout que le
     report peut aller au-delà. */
  function prorogerOuvrable(iso) {
    var d = dateDe(iso);
    if (!d) return null;
    var tours = 0;
    while (tours < 4 && (d.getDay() === 0 || d.getDay() === 6)) {
      d.setDate(d.getDate() + 1); tours++;
    }
    return isoDe(d);
  }

  /* Le premier jour où deux jours ouvrables se sont écoulés depuis le jour
     fixé pour l'entretien (L. 1332-2). Les jours ouvrables sont tous les jours
     sauf le dimanche et les jours fériés ; l'application compte les jours non
     dominicaux et le dit, faute de tenir le calendrier des fériés. */
  function deuxJoursOuvrablesApres(iso) {
    if (!estISO(iso)) return null;
    var x = iso, compte = 0, tours = 0;
    while (compte < 2 && tours < 15) {
      x = plusJours(x, 1); tours++;
      if (dateDe(x).getDay() !== 0) compte++;
    }
    return x;
  }

  /* L'écart en jours entre deux dates du dossier, ou null. */
  function ecartJours(a, b) {
    var da = dateDe(a), db = dateDe(b);
    if (!da || !db) return null;
    return Math.round((db.getTime() - da.getTime()) / 86400000);
  }

  function aujourd(ctx) {
    return ctx && ctx.aujourdhui instanceof Date && !isNaN(ctx.aujourdhui.getTime())
      ? ctx.aujourdhui : new Date();
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE TEXTE
     ════════════════════════════════════════════════════════════════════════ */

  /* Ce que le dossier déclare, dit sans être interprété. */
  function etat(v, oui, non) {
    if (v === true || v === "oui") return oui;
    if (v === false || v === "non") return non;
    return "non renseigné — à vérifier sur le document lui-même";
  }
  function estOui(v) { return v === true || v === "oui"; }
  function estNon(v) { return v === false || v === "non"; }
  function rempli(v) { return v !== undefined && v !== null && String(v).trim() !== ""; }

  /* Le nom de l'entreprise, tel qu'il s'écrit dans le corps d'une lettre. */
  function nomDe(ctx) {
    var p = (ctx && ctx.profil) || {};
    return cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE");
  }
  function lieu(ctx) { return cro(((ctx && ctx.profil) || {}).ville, "lieu"); }

  /* L'identification du salarié : le dossier de l'audit ne la porte pas — il
     décrit une procédure, pas une personne. Elle sort donc entre crochets, et
     le document le dit une fois pour toutes. */
  function blocSalarie() {
    return [
      "[NOM ET PRÉNOM DU SALARIÉ]",
      "[fonction et service]",
      "[adresse]",
      "",
    ];
  }

  /* Les griefs : la seule chose que l'application ne rédigera jamais. */
  function blocGriefs(intro) {
    return [
      (intro || "Les faits qui vous sont reprochés sont les suivants :"),
      "",
      "[ÉCRIRE ICI LES GRIEFS — c'est à vous, et à personne d'autre, de le faire.",
      " Un grief s'écrit daté, situé et circonstancié : ce qui s'est passé, quel",
      " jour, à quelle heure, où, avec qui, et en quoi cela contrevient à une",
      " obligation. Une formule générale — « votre comportement », « vos",
      " manquements répétés » — ne met pas le salarié en mesure de discuter, et",
      " ne permet pas au conseil de prud'hommes d'apprécier. L'application ne",
      " connaît pas vos faits et ne les inventera pas.]",
      "",
    ];
  }

  /* L'en-tête d'un courrier au salarié : qui écrit, à qui, d'où, quand. */
  function teteLettre(ctx, recommande) {
    var p = (ctx && ctx.profil) || {};
    var L = [nomDe(ctx), cro(p.adresse, "adresse du siège"), ""];
    L = L.concat(blocSalarie());
    L.push(lieu(ctx) + ", le " + leJour(aujourd(ctx)));
    L.push("");
    if (recommande) {
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("— ou remise en main propre contre récépissé daté et signé —");
      L.push("");
    }
    return L;
  }

  function signature(ctx) {
    var p = (ctx && ctx.profil) || {};
    return [
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations",
      "distinguées.",
      "",
      cro(p.responsable, "Nom et qualité du signataire"),
      "",
    ];
  }

  /* Le pied commun : d'où vient ce qui est écrit, et ce que le document ne
     dit pas. */
  function pied(articles, notes) {
    var L = ["", TRAIT, ""];
    L.push("Fondement : " + articles + ".");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur");
    L.push("identifiant de version dans moteur/discipline/textes-discipline.json.");
    if (notes && notes.length) { L.push(""); notes.forEach(function (n) { L.push(n); }); }
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords et votre règlement intérieur peuvent ajouter des exigences que");
    L.push("l'application ne lit pas. Ne laissez aucun crochet dans le texte que");
    L.push("vous remettez, déposez ou envoyez.");
    return L;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES DÉCISIONS, CITÉES TELLES QU'ELLES ONT ÉTÉ LUES

     Elles viennent du bloc ARRETS de moteur/discipline/controles-discipline.js,
     où elles sont conservées dans les termes de la base Judilibre. Elles ne
     sont reprises ici que pour ce qu'elles disent.
     ════════════════════════════════════════════════════════════════════════ */

  var ARRETS = {
    tousLesTermes: [
      "Soc., 16 avril 2008, n° 06-41.999, publié : « Dès lors qu'il a choisi de",
      "convoquer le salarié selon les modalités de l'article L. 122-41 du code du",
      "travail [devenu L. 1332-2], l'employeur est tenu d'en respecter tous les",
      "termes, quelle que soit la sanction finalement infligée. » La cour d'appel",
      "qui avait annulé des avertissements notifiés plus d'un mois après les",
      "entretiens préalables en avait fait une exacte application.",
    ],
    avertissementRI: [
      "Soc., 3 mai 2011, n° 10-14.104, publié : « L'employeur qui n'est pas tenu en",
      "principe de convoquer un salarié avant de lui notifier un avertissement, est",
      "tenu de le faire dès lors qu'au regard d'un règlement intérieur",
      "l'avertissement peut avoir une influence sur le maintien du salarié dans",
      "l'entreprise. Tel est le cas lorsque le règlement intérieur, instituant ainsi",
      "une garantie de fond, subordonne le licenciement d'un salarié à l'existence",
      "de deux sanctions antérieures pouvant être constituées notamment par un",
      "avertissement. »",
    ],
    avertissementCCN: [
      "Soc., 22 septembre 2021, n° 18-22.204, publié : même solution au regard d'une",
      "convention collective — si l'employeur n'est en principe pas tenu de",
      "convoquer un salarié à un entretien préalable avant de lui notifier un",
      "avertissement ou une sanction de même nature, il en va autrement lorsque, au",
      "regard des dispositions d'une convention collective, la sanction peut avoir",
      "une influence sur le maintien du salarié dans l'entreprise ; tel est le cas",
      "lorsque la convention collective, instituant une garantie de fond, subordonne",
      "le licenciement à l'existence de deux sanctions antérieures. Il appartient",
      "alors à la juridiction prud'homale d'apprécier si ces sanctions, irrégulières",
      "en la forme, doivent être annulées (L. 1333-2).",
    ],
    garantieFond: [
      "Soc., 8 septembre 2021, n° 19-15.039, publié : « La consultation d'un",
      "organisme chargé, en vertu d'une disposition conventionnelle ou d'un",
      "règlement intérieur, de donner son avis sur un licenciement envisagé par un",
      "employeur constitue une garantie de fond, en sorte que le licenciement",
      "prononcé sans que cet organisme ait été consulté ne peut avoir de cause",
      "réelle et sérieuse. L'irrégularité commise dans le déroulement de la",
      "procédure disciplinaire prévue par une disposition conventionnelle ou un",
      "règlement intérieur, est assimilée à la violation d'une garantie de fond et",
      "rend le licenciement sans cause réelle et sérieuse lorsqu'elle a privé le",
      "salarié de droits de sa défense ou lorsqu'elle est susceptible d'avoir exercé",
      "en l'espèce une influence sur la décision finale de licenciement par",
      "l'employeur. »",
    ],
    avisTardif: [
      "Soc., 20 mars 2024, n° 22-17.292, publié : le caractère tardif de la demande",
      "d'avis prévue par le règlement intérieur avant le prononcé d'une sanction",
      "constitue une irrégularité dans le déroulement de la procédure disciplinaire,",
      "et il appartient au juge de rechercher si cette irrégularité a privé le",
      "salarié de la possibilité d'assurer utilement sa défense ou est susceptible",
      "d'avoir exercé une influence sur la décision finale de sanctionner par",
      "l'employeur.",
    ],
  };

  /* ════════════════════════════════════════════════════════════════════════
     LE RAPPEL DE LA PRESCRIPTION, calculé

     Il revient dans presque tous les écrits de la procédure : deux mois à
     compter du jour où l'employeur a eu connaissance des faits (L. 1332-4), et
     la convocation doit être remise ou adressée dans ce délai (R. 1332-1).
     ════════════════════════════════════════════════════════════════════════ */
  function blocPrescription(ctx) {
    var s = ((ctx && ctx.fiche) || {}).sanction || {};
    var L = ["════ LE DÉLAI DE DEUX MOIS, ET SON POINT DE DÉPART ════", ""];
    L.push("« Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de");
    L.push("poursuites disciplinaires au-delà d'un délai de deux mois à compter du");
    L.push("jour où l'employeur en a eu connaissance, à moins que ce fait ait donné");
    L.push("lieu dans le même délai à l'exercice de poursuites pénales » (L. 1332-4).");
    L.push("La lettre de convocation est « remise contre récépissé, soit adressée par");
    L.push("lettre recommandée, dans le délai de deux mois fixé à l'article");
    L.push("L. 1332-4 » (R. 1332-1).");
    L.push("");
    if (estISO(s.dateConnaissance)) {
      var lim = moisApres(s.dateConnaissance, 2);
      L.push("Dans votre dossier : la connaissance des faits est datée du " +
        jour(s.dateConnaissance) + ".");
      L.push("Le délai de deux mois échoit donc le " + jour(lim) + " : passé ce jour,");
      L.push("ces faits ne peuvent plus, à eux seuls, fonder une sanction.");
      if (estISO(s.dateConvocation)) {
        var e = ecartJours(s.dateConnaissance, s.dateConvocation);
        L.push("La convocation a été envoyée le " + jour(s.dateConvocation) +
          ", soit " + e + " jours après");
        L.push("cette connaissance — " + (s.dateConvocation > lim
          ? "AU-DELÀ du terme : les poursuites ont été engagées hors délai."
          : "dans le délai."));
      }
      if (estOui(s.poursuitesPenales)) {
        L.push("Le dossier déclare que ces faits ont donné lieu à des poursuites");
        L.push("pénales : L. 1332-4 réserve ce cas — « à moins que ce fait ait donné");
        L.push("lieu dans le même délai à l'exercice de poursuites pénales ». Vérifiez");
        L.push("la date de l'acte de poursuite et conservez-en la pièce.");
      }
    } else {
      L.push("Votre dossier ne porte pas la date à laquelle l'employeur a eu");
      L.push("connaissance des faits : [DATE DE CONNAISSANCE DES FAITS — à établir par");
      L.push("la pièce qui la fixe : signalement, constat, rapport reçu]. C'est de");
      L.push("cette date, et non de celle des faits ni de la fin d'une enquête, que");
      L.push("courent les deux mois.");
    }
    L.push("");
    return L;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES BORNES DE LA NOTIFICATION, calculées (L. 1332-2 ; R. 1332-2 ; R. 1332-3)
     ════════════════════════════════════════════════════════════════════════ */
  function bornesNotification(iso) {
    if (!estISO(iso)) return null;
    var basse = deuxJoursOuvrablesApres(iso);
    var haute = moisApres(iso, 1);
    var hauteProrogee = prorogerOuvrable(haute);
    return { entretien: iso, basse: basse, haute: haute, hauteProrogee: hauteProrogee,
             prorogee: hauteProrogee !== haute };
  }

  function blocBornes(ctx) {
    var s = ((ctx && ctx.fiche) || {}).sanction || {};
    var L = ["════ LA FENÊTRE DE NOTIFICATION ════", ""];
    L.push("« La sanction ne peut intervenir moins de deux jours ouvrables, ni plus");
    L.push("d'un mois après le jour fixé pour l'entretien. Elle est motivée et");
    L.push("notifiée à l'intéressé » (L. 1332-2). Le mois se compte selon R. 1332-3 :");
    L.push("il « expire à vingt-quatre heures le jour du mois suivant qui porte le");
    L.push("même quantième que le jour fixé pour l'entretien. À défaut d'un quantième");
    L.push("identique, le délai expire le dernier jour du mois suivant à vingt-quatre");
    L.push("heures. Lorsque le dernier jour de ce délai est un samedi, un dimanche ou");
    L.push("un jour férié ou chômé, le délai est prorogé jusqu'au premier jour");
    L.push("ouvrable suivant. »");
    L.push("");
    var b = bornesNotification(s.dateEntretien);
    if (b) {
      L.push("Dans votre dossier, le jour fixé pour l'entretien est le " +
        jour(b.entretien) + ".");
      L.push("");
      L.push("  · au plus tôt   : " + jour(b.basse) + " — deux jours ouvrables au moins");
      L.push("    doivent s'être écoulés. L'application compte les jours non");
      L.push("    dominicaux : elle ne tient pas le calendrier des jours fériés ou");
      L.push("    chômés, qui repousseraient cette date. Vérifiez-le à la main.");
      L.push("  · au plus tard  : " + jour(b.haute) + " à vingt-quatre heures" +
        (b.prorogee ? "," : "."));
      if (b.prorogee) {
        L.push("    ce jour étant un samedi ou un dimanche, le délai est prorogé");
        L.push("    jusqu'au " + jour(b.hauteProrogee) + ", premier jour ouvrable suivant");
        L.push("    (R. 1332-3). Un jour férié le reporterait plus loin encore.");
      } else {
        L.push("    Si ce jour est férié ou chômé dans l'entreprise, le délai est");
        L.push("    prorogé jusqu'au premier jour ouvrable suivant (R. 1332-3).");
      }
      L.push("");
      if (estISO(s.dateNotification)) {
        L.push("La notification portée au dossier est datée du " +
          jour(s.dateNotification) + " :");
        if (s.dateNotification < b.basse)
          L.push("elle est INTERVENUE TROP TÔT — moins de deux jours ouvrables après l'entretien.");
        else if (s.dateNotification > b.hauteProrogee)
          L.push("elle est INTERVENUE TROP TARD — après le terme du mois de L. 1332-2.");
        else {
          L.push("elle tombe dans la fenêtre, sous réserve des jours fériés que");
          L.push("l'application ne tient pas.");
        }
        L.push("");
      }
    } else {
      L.push("Votre dossier ne porte pas la date de l'entretien : [DATE FIXÉE POUR");
      L.push("L'ENTRETIEN]. C'est de ce jour, et non du jour où la décision est");
      L.push("arrêtée, que courent les deux bornes.");
      L.push("");
    }
    return L;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LA MENTION DU SALARIÉ PROTÉGÉ

     Le module la signale sans l'auditer : il ne peut donc pas écrire la
     procédure spéciale, mais il ne peut pas non plus produire une lettre qui
     ferait comme si elle n'existait pas.
     ════════════════════════════════════════════════════════════════════════ */
  function blocProtege(ctx) {
    var s = ((ctx && ctx.fiche) || {}).sanction || {};
    if (!estOui(s.salarieProtege)) return [];
    return [
      "════ AVERTISSEMENT — SALARIÉ TITULAIRE D'UN MANDAT ════",
      "",
      "Le dossier déclare que le salarié est titulaire d'un mandat représentatif",
      "ou syndical. Le statut protecteur ajoute à la procédure disciplinaire des",
      "exigences propres, que ce module SIGNALE sans les auditer : il ne les a pas",
      "lues à la source et ne les écrit donc pas ici. Ne remettez pas ce document",
      "sans avoir vérifié ce que le statut impose en plus.",
      "",
    ];
  }

  /* ════════════════════════════════════════════════════════════════════════
     LA MESURE, TELLE QUE LE DOSSIER LA DÉCLARE

     Trois natures portent l'incidence par construction — la mise à pied
     disciplinaire suspend le contrat et la rémunération, la mutation change la
     fonction, la rétrogradation change la qualification. Le licenciement, lui,
     sort du chapitre (L. 1333-3). Pour les autres, l'incidence est DÉCLARÉE :
     l'application ne la présume jamais.
     ════════════════════════════════════════════════════════════════════════ */
  var AVEC_INCIDENCE = {
    "mise à pied disciplinaire": true,
    "mutation disciplinaire": true,
    "rétrogradation": true,
    "sanction pécuniaire ou amende": true,
  };

  function mesureDe(ctx) {
    var f = (ctx && ctx.fiche) || {};
    var s = f.sanction || {}, g = f.garantie || {};
    var nature = rempli(s.nature) ? String(s.nature) : null;
    var licenciement = nature === "licenciement disciplinaire";
    var incidence = null;
    if (nature && AVEC_INCIDENCE[nature]) incidence = true;
    else if (rempli(s.incidence)) incidence = estOui(s.incidence);
    var subordination = rempli(g.licenciementSubordonneSanctions)
      ? estOui(g.licenciementSubordonneSanctions) : null;
    var du = null;
    if (licenciement) du = null;
    else if (incidence === true) du = true;
    else if (subordination === true) du = true;
    else if (incidence === false && subordination === false) du = false;
    return { nature: nature, licenciement: licenciement, incidence: incidence,
             subordination: subordination, du: du,
             fondement: (du === true && incidence !== true) ? "garantie de fond" : "L. 1332-2" };
  }

  /* Le bloc qui dit si l'entretien est dû, et sur quel fondement. Il ne
     conclut jamais sur une donnée absente : « on ne sait pas » est une réponse
     que le document écrit en toutes lettres. */
  function blocEntretienDu(ctx) {
    var m = mesureDe(ctx);
    var L = ["════ L'ENTRETIEN EST-IL DÛ ? ════", ""];
    L.push("« Lorsque l'employeur envisage de prendre une sanction, il convoque le");
    L.push("salarié en lui précisant l'objet de la convocation, sauf si la sanction");
    L.push("envisagée est un avertissement ou une sanction de même nature n'ayant pas");
    L.push("d'incidence, immédiate ou non, sur la présence dans l'entreprise, la");
    L.push("fonction, la carrière ou la rémunération du salarié » (L. 1332-2, premier");
    L.push("alinéa).");
    L.push("");
    L.push("Mesure déclarée : " + (m.nature ? m.nature : "[nature non renseignée]") + ".");
    L.push("");
    if (m.licenciement) {
      L.push("LA MESURE EST UN LICENCIEMENT DISCIPLINAIRE. « Lorsque la sanction");
      L.push("contestée est un licenciement les dispositions du présent chapitre ne");
      L.push("sont pas applicables. Dans ce cas, le conseil de prud'hommes applique les");
      L.push("dispositions relatives à la contestation des irrégularités de licenciement");
      L.push("prévues par le chapitre V du titre III du livre II » (L. 1333-3).");
      L.push("");
      L.push("[CHAPITRE NON LU PAR L'APPLICATION — le chapitre V du titre III du");
      L.push(" livre II, auquel L. 1333-3 renvoie, n'a pas été capté : l'application");
      L.push(" n'écrit ni la procédure du licenciement, ni ses délais, ni ses");
      L.push(" mentions. NE VOUS SERVEZ PAS DES LETTRES CI-DESSOUS POUR UN");
      L.push(" LICENCIEMENT.]");
      L.push("");
      L.push("Ce qui demeure applicable au licenciement disciplinaire, et que ce module");
      L.push("contrôle : la prescription des faits (L. 1332-4), l'interdiction des");
      L.push("sanctions pécuniaires (L. 1331-2), et les garanties de fond que la");
      L.push("convention collective ou le règlement intérieur ajoutent — DIS-CTL-SAN-12.");
      L.push("");
      return L;
    }
    if (m.du === true && m.incidence === true) {
      L.push("OUI — L'ENTRETIEN EST DÛ. La mesure a une incidence, immédiate ou non,");
      L.push("sur la présence dans l'entreprise, la fonction, la carrière ou la");
      L.push("rémunération : l'exception de L. 1332-2 ne joue pas.");
      if (m.nature === "mise à pied disciplinaire") {
        L.push("La mise à pied disciplinaire suspend le contrat et la rémunération");
        L.push("pendant sa durée : l'incidence est immédiate, et elle ne se discute pas.");
      } else if (m.nature === "mutation disciplinaire") {
        L.push("La mutation prononcée à titre disciplinaire change le poste ou le lieu");
        L.push("de travail : l'incidence porte sur la fonction.");
      } else if (m.nature === "rétrogradation") {
        L.push("La rétrogradation modifie la qualification et, le plus souvent, la");
        L.push("rémunération : l'incidence porte sur la fonction et la carrière.");
      }
    } else if (m.du === true) {
      L.push("OUI — L'ENTRETIEN EST DÛ, mais pas par l'effet de L. 1332-2 : PAR UNE");
      L.push("GARANTIE DE FOND. Le dossier déclare que le règlement intérieur ou la");
      L.push("convention collective subordonne le licenciement à l'existence de");
      L.push("sanctions antérieures. La sanction, fût-elle un avertissement, peut donc");
      L.push("avoir une influence sur le maintien du salarié dans l'entreprise.");
      L.push("");
      ARRETS.avertissementRI.forEach(function (x) { L.push(x); });
      L.push("");
      ARRETS.avertissementCCN.forEach(function (x) { L.push(x); });
    } else if (m.du === false) {
      L.push("NON — l'entretien n'est pas dû. La mesure est déclarée sans incidence,");
      L.push("immédiate ou non, sur la présence dans l'entreprise, la fonction, la");
      L.push("carrière ou la rémunération, et ni le règlement intérieur ni la");
      L.push("convention collective ne subordonnent le licenciement à l'existence de");
      L.push("sanctions antérieures.");
      L.push("");
      L.push("DEUX RÉSERVES, ET ELLES SONT LOURDES.");
      L.push("");
      L.push("La première : l'exception de L. 1332-2 dispense de l'ENTRETIEN, jamais de");
      L.push("l'ÉCRIT. « Aucune sanction ne peut être prise à l'encontre du salarié sans");
      L.push("que celui-ci soit informé, dans le même temps et par écrit, des griefs");
      L.push("retenus contre lui » (L. 1332-1) — et cela vaut pour toute sanction au");
      L.push("sens de L. 1331-1, avertissement compris. Le générateur DIS-CTL-SAN-01 de");
      L.push("cette application écrit cet écrit.");
      L.push("");
      L.push("La seconde : si vous convoquez malgré tout, vous vous liez.");
      L.push("");
      ARRETS.tousLesTermes.forEach(function (x) { L.push(x); });
    } else {
      L.push("L'APPLICATION NE TRANCHE PAS, et elle dit pourquoi.");
      L.push("");
      if (!m.nature)
        L.push("  · la nature de la mesure n'est pas renseignée ;");
      if (m.incidence === null)
        L.push("  · l'incidence de la mesure sur la présence dans l'entreprise, la " +
          "fonction,");
      if (m.incidence === null)
        L.push("    la carrière ou la rémunération n'est pas déclarée ;");
      if (m.subordination === null) {
        L.push("  · il n'est pas dit si le règlement intérieur ou la convention");
        L.push("    collective subordonne le licenciement à l'existence de sanctions");
        L.push("    antérieures — auquel cas l'entretien serait dû même pour un");
        L.push("    avertissement.");
      }
      L.push("");
      L.push("Répondez à ces questions avant de choisir. En cas de doute, CONVOQUEZ :");
      L.push("une convocation superflue ne vicie rien, une convocation manquante vicie");
      L.push("tout. Mais sachez qu'en convoquant vous vous liez à toute la procédure —");
      L.push("");
      ARRETS.tousLesTermes.forEach(function (x) { L.push(x); });
    }
    L.push("");
    return L;
  }

  /* Le rappel de la sanction possible, écrit une fois : ce qui se joue n'est
     pas une peine, c'est l'annulation. */
  var NOTE_ANNULATION = [
    "Aucune peine n'est annoncée dans ce document, et le périmètre a été vérifié :",
    "R. 1323-1 s'arrête à L. 1322-4 et à R. 1321-5 — il atteint le règlement",
    "intérieur, non la procédure disciplinaire —, et L. 1334-1 ne vise que",
    "L. 1331-2, l'amende et la sanction pécuniaire. Ce qui se joue ici est",
    "l'annulation : « Le conseil de prud'hommes peut annuler une sanction",
    "irrégulière en la forme ou injustifiée ou disproportionnée à la faute",
    "commise » (L. 1333-2). Et le juge n'attend pas l'employeur : « En cas de",
    "litige, le conseil de prud'hommes apprécie la régularité de la procédure",
    "suivie et si les faits reprochés au salarié sont de nature à justifier une",
    "sanction. L'employeur fournit au conseil de prud'hommes les éléments retenus",
    "pour prendre la sanction. […] Si un doute subsiste, il profite au salarié »",
    "(L. 1333-1).",
  ];

  /* ══════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-07 — L'ENTRETIEN PRÉALABLE

     Deux questions, et la seconde ne se pose que si la première est tranchée :
     l'entretien était-il dû, et a-t-il été tenu ? Le document répond à la
     première avec les seules données déclarées, puis produit la convocation et
     le compte rendu — et, si la sanction a déjà été prise sans l'entretien dû,
     le retrait : un entretien tenu après coup ne répare pas une sanction déjà
     notifiée.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-07", {
    nom: "L'entretien préalable : convocation, compte rendu — et, s'il a manqué, le retrait",
    detail: "La question de savoir si l'entretien est dû, tranchée sur les données " +
            "déclarées ; la lettre de convocation, la trame de compte rendu, et le " +
            "retrait de la sanction prise sans l'entretien dû.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, s = f.sanction || {};
      var m = mesureDe(ctx);
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Entretien préalable à une sanction disciplinaire",
        "article L. 1332-2 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Lorsque l'employeur envisage de prendre une sanction, il convoque le");
      L.push("salarié en lui précisant l'objet de la convocation, sauf si la sanction");
      L.push("envisagée est un avertissement ou une sanction de même nature n'ayant pas");
      L.push("d'incidence, immédiate ou non, sur la présence dans l'entreprise, la");
      L.push("fonction, la carrière ou la rémunération du salarié.");
      L.push("Lors de son audition, le salarié peut se faire assister par une personne");
      L.push("de son choix appartenant au personnel de l'entreprise.");
      L.push("Au cours de l'entretien, l'employeur indique le motif de la sanction");
      L.push("envisagée et recueille les explications du salarié.");
      L.push("La sanction ne peut intervenir moins de deux jours ouvrables, ni plus");
      L.push("d'un mois après le jour fixé pour l'entretien. Elle est motivée et");
      L.push("notifiée à l'intéressé » (L. 1332-2).");
      L.push("");
      L.push("TROIS OBLIGATIONS DISTINCTES DANS CE SEUL ARTICLE, et on les confond :");
      L.push("  · CONVOQUER, en précisant l'objet de la convocation ;");
      L.push("  · LAISSER JOUER L'ASSISTANCE, par une personne du choix du salarié");
      L.push("    appartenant au personnel de l'entreprise ;");
      L.push("  · TENIR L'ENTRETIEN et y faire deux choses — indiquer le motif de la");
      L.push("    sanction ENVISAGÉE, et RECUEILLIR les explications du salarié. Un");
      L.push("    entretien où l'employeur annonce une décision déjà prise n'est pas");
      L.push("    un entretien préalable : il ne recueille rien.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Nature de la mesure : " + (m.nature ? m.nature : "[non renseignée]"));
      L.push("Incidence sur la présence, la fonction, la carrière ou la rémunération : " +
        (m.incidence === true ? "OUI" : m.incidence === false ? "non" : "non renseignée"));
      L.push("Le licenciement est-il subordonné à des sanctions antérieures par le");
      L.push("règlement intérieur ou la convention collective : " +
        (m.subordination === true ? "OUI" : m.subordination === false ? "non" : "non renseigné"));
      L.push("Convocation envoyée : " + etat(s.convocationEnvoyee, "oui", "NON") +
        (estISO(s.dateConvocation) ? " — le " + jour(s.dateConvocation) : ""));
      L.push("Entretien tenu : " + etat(s.entretienTenu, "oui", "NON") +
        (estISO(s.dateEntretien) ? " — le " + jour(s.dateEntretien) : ""));
      L.push("Sanction notifiée : " +
        (estISO(s.dateNotification) ? "le " + jour(s.dateNotification) : "[date non renseignée]"));
      L.push("");
      L = L.concat(blocEntretienDu(ctx));

      if (m.licenciement) {
        L.push("LES PIÈCES CI-DESSOUS NE SONT PAS PRODUITES POUR CETTE MESURE.");
        L.push("");
        L.push("La mesure déclarée est un licenciement disciplinaire, et L. 1333-3");
        L.push("écarte le présent chapitre. Écrire ici une convocation « au titre de");
        L.push("L. 1332-2 » serait produire une pièce inapplicable, et la faire signer.");
        L.push("L'application s'en abstient.");
        L.push("");
        L.push("Ce qui, en revanche, s'applique et se vérifie tout de suite :");
        L.push("");
        L = L.concat(blocPrescription(ctx));
        L.push("Et la garantie de fond — consultation d'un conseil de discipline ou");
        L.push("d'une commission paritaire prévue par la convention collective ou le");
        L.push("règlement intérieur : le générateur DIS-CTL-SAN-12 de cette application");
        L.push("la traite, et c'est le manquement le plus coûteux du module, parce que");
        L.push("le licenciement prononcé sans cette consultation ne peut avoir de cause");
        L.push("réelle et sérieuse.");
        L.push("");
        L = L.concat(blocProtege(ctx));
        return L.concat(pied("L. 1332-2, L. 1333-3, L. 1332-4, R. 1332-1, L. 1333-2",
          NOTE_ANNULATION.concat([
            "",
            "Le chapitre V du titre III du livre II, auquel L. 1333-3 renvoie, n'a pas",
            "été lu par l'application : elle le nomme sans en écrire le contenu."]))).join("\n");
      }

      if (estNon(s.entretienTenu) && m.du === true && estISO(s.dateNotification)) {
        L.push(GROS);
        L.push("PIÈCE 1 — RETRAIT DE LA SANCTION PRISE SANS L'ENTRETIEN DÛ");
        L.push(GROS);
        L.push("");
        L.push("À REMETTRE AVANT TOUTE REPRISE. Un entretien tenu après coup ne répare");
        L.push("pas une sanction déjà notifiée : la sanction a été prise sans que");
        L.push("l'employeur ait indiqué le motif envisagé ni recueilli les explications");
        L.push("du salarié, et ce moment-là ne revient pas. Ce qui se répare, c'est la");
        L.push("situation — en retirant, puis en reprenant régulièrement si le délai de");
        L.push("deux mois le permet encore.");
        L.push("");
        L = L.concat(teteLettre(ctx, true));
        L.push("Objet : retrait de la sanction notifiée le " +
          jour(s.dateNotification, "date de la notification"));
        L.push("");
        L.push("Madame, Monsieur,");
        L.push("");
        L.push("Par lettre du " + jour(s.dateNotification, "date") +
          ", il vous a été notifié [rappeler la");
        L.push("mesure : " + (m.nature || "[nature de la mesure]") + "].");
        L.push("");
        L.push("L'article L. 1332-2 du code du travail impose à l'employeur qui envisage");
        L.push("de prendre une telle sanction de convoquer le salarié, puis, au cours de");
        L.push("l'entretien, d'indiquer le motif de la sanction envisagée et de");
        L.push("recueillir ses explications. Cette procédure n'ayant pas été suivie, je");
        L.push("retire cette mesure.");
        L.push("");
        L.push("Elle est réputée n'avoir jamais été prononcée. Toute mention en sera");
        L.push("supprimée de votre dossier individuel[, et les conséquences qu'elle a");
        L.push("emportées sur votre rémunération seront régularisées sur la prochaine");
        L.push("paie].");
        L.push("");
        L = L.concat(signature(ctx));
        L.push("");
        L.push("[APRÈS LE RETRAIT, ET AVANT DE REPRENDRE : vérifiez le délai de deux");
        L.push(" mois de L. 1332-4, rappelé plus bas. S'il est expiré, ces faits ne");
        L.push(" peuvent plus, à eux seuls, fonder une sanction : le retrait est alors");
        L.push(" définitif, et c'est le prix de l'irrégularité.]");
        L.push("");
        L.push("");
      }

      L.push(GROS);
      L.push("PIÈCE " + ((estNon(s.entretienTenu) && m.du === true && estISO(s.dateNotification)) ? "2" : "1") +
        " — LETTRE DE CONVOCATION À L'ENTRETIEN PRÉALABLE");
      L.push(GROS);
      L.push("");
      L.push("Cette lettre porte les quatre exigences de R. 1332-1. Le générateur");
      L.push("DIS-CTL-SAN-08 les reprend une à une avec leur grille de contrôle.");
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : convocation à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous convoque à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire.");
      L.push("");
      L.push("Cet entretien se tiendra le [DATE] à [HEURE], à l'adresse suivante :");
      L.push("[LIEU PRÉCIS — bâtiment, étage, bureau].");
      L.push("");
      L.push("Au cours de cet entretien, je vous indiquerai le motif de la sanction");
      L.push("envisagée et je recueillerai vos explications.");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne de votre choix");
      L.push("appartenant au personnel de l'entreprise.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("Remise : contre récépissé daté et signé, ou par lettre recommandée avec");
      L.push("demande d'avis de réception (R. 1332-1). Ces deux voies sont les seules");
      L.push("qu'ouvre le texte, et la date de cette remise doit tomber dans le délai de");
      L.push("deux mois de L. 1332-4.");
      L.push("");
      L.push("[NE PAS ÉCRIRE LES GRIEFS DANS CETTE LETTRE si vous n'êtes pas encore en");
      L.push(" mesure de les arrêter : R. 1332-1 exige que la lettre indique l'OBJET de");
      L.push(" l'entretien, non les griefs. Les griefs s'énoncent au cours de");
      L.push(" l'entretien, puis dans la notification motivée. Mais si vous les écrivez");
      L.push(" ici, écrivez-les datés et circonstanciés : une lettre qui les annonce");
      L.push(" vaguement met le salarié en difficulté pour préparer sa défense, et cela");
      L.push(" se discutera.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE " + ((estNon(s.entretienTenu) && m.du === true && estISO(s.dateNotification)) ? "3" : "2") +
        " — COMPTE RENDU D'ENTRETIEN PRÉALABLE");
      L.push(GROS);
      L.push("");
      L.push("Aucun texte lu n'impose ce compte rendu. Mais L. 1332-2 impose à");
      L.push("l'employeur d'INDIQUER le motif et de RECUEILLIR les explications : ce");
      L.push("sont deux faits, et un fait se prouve. Sans écrit, il ne restera que deux");
      L.push("souvenirs contraires, et « si un doute subsiste, il profite au salarié »");
      L.push("(L. 1333-1).");
      L.push("");
      L.push(nomDe(ctx));
      L.push("COMPTE RENDU D'ENTRETIEN PRÉALABLE À UNE ÉVENTUELLE SANCTION");
      L.push("");
      L.push("Date de l'entretien : " + jour(s.dateEntretien, "DATE") +
        " — début [..h..] / fin [..h..]");
      L.push("Lieu : [.....]");
      L.push("Salarié : [NOM, PRÉNOM] — [fonction, service, ancienneté]");
      L.push("Représentant de l'employeur : [NOM, qualité]");
      L.push("Personne assistant le salarié : [NOM, qualité — appartenant au personnel");
      L.push("de l'entreprise] / [le salarié n'était pas assisté] / [le salarié ne");
      L.push("s'est pas présenté]");
      L.push("");
      L.push("1. RAPPEL DE LA CONVOCATION");
      L.push("   Lettre du " + jour(s.dateConvocation, "DATE") + ", remise [contre");
      L.push("   récépissé le DATE / par lettre recommandée, présentée le DATE].");
      L.push("");
      L.push("2. MOTIF DE LA SANCTION ENVISAGÉE, INDIQUÉ AU SALARIÉ");
      L.push("");
      L = L.concat(blocGriefs("Ont été indiqués au salarié les faits suivants :"));
      L.push("   [Préciser également : les pièces sur lesquelles ces faits se fondent,");
      L.push("    si elles ont été montrées ou évoquées, et la règle à laquelle ils");
      L.push("    contreviennent — article du règlement intérieur, consigne,");
      L.push("    instruction.]");
      L.push("");
      L.push("3. EXPLICATIONS DU SALARIÉ, RECUEILLIES");
      L.push("");
      L.push("   [ÉCRIRE CE QUE LE SALARIÉ A RÉPONDU, dans ses termes et sans le");
      L.push("    résumer à l'avantage de l'employeur. C'est la partie du compte rendu");
      L.push("    qui sera lue en premier par le juge, et la seule qui établisse que les");
      L.push("    explications ont été RECUEILLIES au sens de L. 1332-2.]");
      L.push("");
      L.push("   Réponse du salarié : [.....]");
      L.push("   Éléments qu'il annonce vouloir produire : [.....]");
      L.push("   Personnes qu'il demande à voir entendues : [.....]");
      L.push("");
      L.push("4. OBSERVATIONS DE LA PERSONNE ASSISTANT LE SALARIÉ");
      L.push("   [.....]");
      L.push("");
      L.push("5. CLÔTURE");
      L.push("   Aucune décision n'a été annoncée au cours de l'entretien.");
      L.push("   [CETTE LIGNE N'EST PAS UNE FORMULE. Annoncer la sanction pendant");
      L.push("    l'entretien revient à dire qu'elle était arrêtée avant d'avoir entendu");
      L.push("    le salarié — et à contredire l'obligation de recueillir ses");
      L.push("    explications. Si la décision a été annoncée, ne l'écrivez pas comme");
      L.push("    ci-dessus : écrivez ce qui s'est réellement passé, et tirez-en les");
      L.push("    conséquences.]");
      L.push("");
      L.push("   Le salarié a été informé que la décision lui serait notifiée par écrit,");
      L.push("   au plus tôt deux jours ouvrables et au plus tard un mois après ce jour");
      L.push("   (L. 1332-2).");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE].");
      L.push("");
      L.push("Pour l'employeur : ................");
      L.push("Le salarié : ................");
      L.push("[ou : le salarié a refusé de signer — mention portée le [DATE] devant");
      L.push(" [témoin]. Le refus de signer ne vicie rien ; le taire, si.]");
      L.push("La personne assistant le salarié : ................");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("SI LE SALARIÉ NE SE PRÉSENTE PAS");
      L.push(GROS);
      L.push("");
      L.push("L'entretien préalable est une garantie offerte au salarié, non une");
      L.push("obligation qui pèserait sur lui : son absence n'empêche pas la suite. Mais");
      L.push("elle s'établit — portez au compte rendu la date, l'heure, la durée");
      L.push("d'attente, et les personnes présentes. Le jour fixé pour l'entretien reste");
      L.push("le point de départ des deux bornes de L. 1332-2, qu'il se soit tenu ou");
      L.push("non.");
      L.push("");
      L.push("[Si le salarié demande un report, écrivez la demande, votre réponse et la");
      L.push(" nouvelle date. Un report déplace le jour fixé pour l'entretien, donc les");
      L.push(" deux bornes — mais il ne suspend pas le délai de deux mois de L. 1332-4,");
      L.push(" qui court depuis la connaissance des faits.]");
      L.push("");
      L.push("");

      L = L.concat(blocBornes(ctx));
      L = L.concat(blocPrescription(ctx));
      L = L.concat(blocProtege(ctx));

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous arrêtez la date de l'entretien et");
      L.push("vous remettez ou adressez la convocation. La date de cette remise doit");
      L.push("tomber dans le délai de deux mois de L. 1332-4 : c'est elle qui engage les");
      L.push("poursuites (R. 1332-1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 8)) + " environ — l'entretien se tient. Aucun");
      L.push("texte lu ne fixe de délai entre la convocation et l'entretien : laissez au");
      L.push("salarié le temps de trouver la personne qui l'assistera, faute de quoi");
      L.push("l'assistance qu'ouvre L. 1332-2 restera théorique.");
      L.push("");
      L.push("Le jour même — le compte rendu s'écrit. Pas la semaine suivante : ce qui");
      L.push("a été dit s'oublie, et un compte rendu tardif se conteste.");
      L.push("");
      L.push("Ensuite, la fenêtre de notification s'ouvre : au plus tôt deux jours");
      L.push("ouvrables, au plus tard un mois après le jour fixé pour l'entretien. Le");
      L.push("générateur DIS-CTL-SAN-09 la calcule, et DIS-CTL-SAN-10 écrit la");
      L.push("notification motivée.");

      return L.concat(pied("L. 1332-2, R. 1332-1, R. 1332-2, R. 1332-3, L. 1332-1, " +
        "L. 1331-1, L. 1332-4, L. 1333-1, L. 1333-2, L. 1333-3",
        ["Décisions citées, conservées telles qu'elles ont été lues dans la base",
         "Judilibre de la Cour de cassation : Soc., 3 mai 2011, n° 10-14.104, publié ;",
         "Soc., 22 septembre 2021, n° 18-22.204, publié ; Soc., 16 avril 2008,",
         "n° 06-41.999, publié.",
         ""].concat(NOTE_ANNULATION))).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-08 — LES QUATRE EXIGENCES DE LA CONVOCATION

     R. 1332-1 tient en quatre phrases, et chacune est une exigence. Celle qu'on
     manque est la troisième : le rappel du droit d'assistance. Une convocation
     qui l'omet prive le salarié de sa défense avant même l'entretien.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-08", {
    nom: "La lettre de convocation aux quatre exigences de R. 1332-1",
    detail: "Le texte confronté au dossier exigence par exigence, la lettre reprise, " +
            "le récépissé de remise, et la reconvocation lorsque l'entretien s'est " +
            "tenu sur une convocation irrégulière.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, s = f.sanction || {};
      var m = mesureDe(ctx);
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Lettre de convocation à l'entretien préalable",
        "articles R. 1332-1 et L. 1332-2 du code du travail");

      L.push("LE TEXTE, EN ENTIER — QUATRE PHRASES, QUATRE EXIGENCES");
      L.push("");
      L.push("« La lettre de convocation prévue à l'article L. 1332-2 indique l'objet de");
      L.push("l'entretien entre le salarié et l'employeur. Elle précise la date, l'heure");
      L.push("et le lieu de cet entretien. Elle rappelle que le salarié peut se faire");
      L.push("assister par une personne de son choix appartenant au personnel de");
      L.push("l'entreprise. Elle est soit remise contre récépissé, soit adressée par");
      L.push("lettre recommandée, dans le délai de deux mois fixé à l'article");
      L.push("L. 1332-4 » (R. 1332-1).");
      L.push("");
      L.push("CE QUE CHACUNE VEUT DIRE");
      L.push("");
      L.push("  1. L'OBJET. « Entretien » ne suffit pas ; « point sur votre situation »");
      L.push("     non plus. L'objet, c'est qu'une sanction est envisagée. L. 1332-2");
      L.push("     dit d'ailleurs la même chose : l'employeur « convoque le salarié en");
      L.push("     lui précisant l'objet de la convocation ». Un salarié qui ne sait");
      L.push("     pas ce qui se joue ne prépare rien.");
      L.push("");
      L.push("  2. LA DATE, L'HEURE ET LE LIEU. Les trois, et le lieu précis : un");
      L.push("     bâtiment, un étage, un bureau. « Au siège » n'est pas un lieu dans");
      L.push("     une entreprise qui en occupe trois.");
      L.push("");
      L.push("  3. LE RAPPEL DU DROIT D'ASSISTANCE — c'est l'exigence la plus souvent");
      L.push("     manquée. Elle se rappelle DANS LA LETTRE, pas à l'entretien : le");
      L.push("     salarié qui l'apprend en arrivant n'a plus le temps de trouver");
      L.push("     quelqu'un. Et la personne est « de son choix, appartenant au");
      L.push("     personnel de l'entreprise » : ce n'est pas à l'employeur de la");
      L.push("     désigner, ni de la refuser, ni de la restreindre à un délégué.");
      L.push("");
      L.push("  4. LA REMISE. Deux voies, et deux seulement : contre récépissé, ou par");
      L.push("     lettre recommandée. Un courriel, une remise sans récépissé, un dépôt");
      L.push("     dans un casier n'en sont pas. Et cette remise doit intervenir dans");
      L.push("     le délai de deux mois de L. 1332-4 — c'est elle qui engage les");
      L.push("     poursuites disciplinaires.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE, EXIGENCE PAR EXIGENCE");
      L.push("");
      L.push("  Convocation envoyée .................. " +
        etat(s.convocationEnvoyee, "oui", "NON"));
      L.push("  1. objet de l'entretien indiqué ...... " +
        etat(s.convocationObjet, "oui", "NON — à reprendre"));
      L.push("  2. date, heure et lieu précisés ...... " +
        etat(s.convocationDateHeureLieu, "oui", "NON — à reprendre"));
      L.push("  3. droit d'assistance rappelé ........ " +
        etat(s.convocationAssistance, "oui", "NON — à reprendre"));
      L.push("  4. mode de remise .................... " +
        (rempli(s.convocationRemise)
          ? (s.convocationRemise === "récépissé" || s.convocationRemise === "lettre recommandée"
             ? s.convocationRemise + " — l'une des deux voies de R. 1332-1"
             : String(s.convocationRemise) + " — HORS DES DEUX VOIES DE R. 1332-1")
          : "[non renseigné]"));
      L.push("  date de la remise .................... " +
        jour(s.dateConvocation, "non renseignée"));
      L.push("");
      L = L.concat(blocEntretienDu(ctx));

      if (m.licenciement) {
        L.push("LA LETTRE CI-DESSOUS N'EST PAS ÉCRITE POUR UN LICENCIEMENT.");
        L.push("");
        L.push("R. 1332-1 est le décret d'application de L. 1332-2, et L. 1333-3 écarte");
        L.push("ce chapitre lorsque la sanction contestée est un licenciement. La");
        L.push("convocation à l'entretien préalable au licenciement obéit à d'autres");
        L.push("règles, que l'application n'a pas lues. Ne servez pas de ce modèle.");
        L.push("");
        L = L.concat(blocPrescription(ctx));
        L = L.concat(blocProtege(ctx));
        return L.concat(pied("R. 1332-1, L. 1332-2, L. 1333-3, L. 1332-4, L. 1333-2",
          NOTE_ANNULATION)).join("\n");
      }

      if (m.du === false) {
        L.push("UN AVERTISSEMENT AVANT DE VOUS SERVIR DE CETTE LETTRE");
        L.push("");
        L.push("Le dossier conduit à dire que la convocation n'était pas due. Vous êtes");
        L.push("libre de convoquer quand même — mais alors vous devez tout tenir.");
        L.push("");
        ARRETS.tousLesTermes.forEach(function (x) { L.push(x); });
        L.push("");
        L.push("Autrement dit : convoquer à moitié est pire que ne pas convoquer.");
        L.push("");
      }

      L.push(GROS);
      L.push("PIÈCE 1 — LETTRE DE CONVOCATION (les quatre exigences portées)");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : convocation à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire");
      L.push("       ← EXIGENCE 1 : l'objet de l'entretien, dit en clair");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous convoque à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire.");
      L.push("");
      L.push("Cet entretien se tiendra :");
      L.push("     le ....... [DATE]");
      L.push("     à ........ [HEURE]");
      L.push("     à ........ [LIEU PRÉCIS : adresse, bâtiment, étage, bureau]");
      L.push("       ← EXIGENCE 2 : la date, l'heure ET le lieu");
      L.push("");
      L.push("Au cours de cet entretien, je vous indiquerai le motif de la sanction");
      L.push("envisagée et je recueillerai vos explications (L. 1332-2).");
      L.push("");
      L.push("Vous pouvez vous faire assister, lors de cet entretien, par une personne");
      L.push("de votre choix appartenant au personnel de l'entreprise.");
      L.push("       ← EXIGENCE 3 : le rappel du droit d'assistance, DANS LA LETTRE");
      L.push("");
      L.push("[Le cas échéant : si la date proposée ne vous convient pas, faites-le-moi");
      L.push(" savoir sans délai afin qu'une autre soit arrêtée.]");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("       ← EXIGENCE 4 : la remise. Choisissez l'une des deux voies");
      L.push("         ci-dessous, et une seule. Aucune autre n'est ouverte.");
      L.push("");
      L.push("[SUPPRIMER LES FLÈCHES ET LES MENTIONS D'EXIGENCE AVANT D'ENVOYER : elles");
      L.push(" sont là pour votre contrôle, pas pour le salarié.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — RÉCÉPISSÉ DE REMISE EN MAIN PROPRE");
      L.push(GROS);
      L.push("");
      L.push("La première des deux voies de R. 1332-1. Le récépissé est la preuve de la");
      L.push("date, et la date décide de tout : c'est elle qui doit tomber dans le délai");
      L.push("de deux mois de L. 1332-4.");
      L.push("");
      L.push("     RÉCÉPISSÉ DE REMISE EN MAIN PROPRE");
      L.push("");
      L.push("     Je soussigné(e) [NOM, PRÉNOM], [fonction], reconnais avoir reçu ce");
      L.push("     jour, en main propre, la lettre de " + nomDe(ctx) + " datée du");
      L.push("     [DATE], me convoquant à un entretien préalable à une éventuelle");
      L.push("     sanction disciplinaire.");
      L.push("");
      L.push("     Fait à " + lieu(ctx) + ", le [DATE DE LA REMISE].");
      L.push("");
      L.push("     Signature du salarié : ................");
      L.push("");
      L.push("     [SI LE SALARIÉ REFUSE DE SIGNER : ne le forcez pas et ne datez pas à");
      L.push("      sa place. Adressez la lettre par recommandé le jour même — c'est");
      L.push("      l'autre voie du texte, et elle est ouverte sans condition. Portez");
      L.push("      par écrit, daté et signé de deux personnes, la mention du refus.]");
      L.push("");
      L.push("Établir le récépissé en deux exemplaires : un pour le salarié, un pour le");
      L.push("dossier. Celui du dossier est le seul qui comptera.");
      L.push("");
      L.push("SECONDE VOIE — LETTRE RECOMMANDÉE : conservez la preuve de dépôt et l'avis");
      L.push("de réception. Le texte n'exige pas que le salarié ait retiré le pli ; il");
      L.push("exige que la lettre ait été ADRESSÉE dans le délai. Gardez néanmoins");
      L.push("l'avis : il dira quand elle a été présentée.");
      L.push("");
      L.push("");

      var irreguliere = estNon(s.convocationObjet) || estNon(s.convocationDateHeureLieu) ||
        estNon(s.convocationAssistance) ||
        (rempli(s.convocationRemise) && s.convocationRemise !== "récépissé" &&
         s.convocationRemise !== "lettre recommandée");

      L.push(GROS);
      L.push("PIÈCE 3 — SI L'ENTRETIEN S'EST DÉJÀ TENU SUR UNE CONVOCATION IRRÉGULIÈRE");
      L.push(GROS);
      L.push("");
      if (irreguliere) {
        L.push("VOTRE DOSSIER EST DANS CE CAS : au moins une des quatre exigences de");
        L.push("R. 1332-1 est déclarée non satisfaite.");
        L.push("");
      }
      L.push("La règle est simple, et elle coûte : NE PRONONCEZ PAS LA SANCTION SUR CE");
      L.push("FONDEMENT. Une convocation privée de la mention d'assistance a privé le");
      L.push("salarié de sa défense avant même l'entretien ; la sanction qui suit est");
      L.push("irrégulière en la forme, et le conseil de prud'hommes peut l'annuler");
      L.push("(L. 1333-2).");
      L.push("");
      L.push("Ce qui se fait à la place : RECONVOQUER régulièrement, si le délai de deux");
      L.push("mois de L. 1332-4 le permet encore, et tenir un nouvel entretien.");
      L.push("");
      L.push("Lettre de reconvocation :");
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : nouvelle convocation à un entretien préalable à une éventuelle");
      L.push("sanction disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par lettre du " + jour(s.dateConvocation, "date") +
        ", vous avez été convoqué(e) à un entretien");
      L.push("qui s'est tenu le " + jour(s.dateEntretien, "date") + ".");
      L.push("");
      L.push("Après réexamen, il apparaît que cette convocation ne satisfaisait pas aux");
      L.push("exigences de l'article R. 1332-1 du code du travail. Aucune sanction ne");
      L.push("sera prononcée sur ce fondement.");
      L.push("");
      L.push("Je vous convoque en conséquence à un nouvel entretien préalable à une");
      L.push("éventuelle sanction disciplinaire, qui se tiendra :");
      L.push("     le ....... [DATE]");
      L.push("     à ........ [HEURE]");
      L.push("     à ........ [LIEU PRÉCIS]");
      L.push("");
      L.push("Au cours de cet entretien, je vous indiquerai le motif de la sanction");
      L.push("envisagée et je recueillerai vos explications.");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne de votre choix");
      L.push("appartenant au personnel de l'entreprise.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");
      L.push("[LE NOUVEAU JOUR D'ENTRETIEN DEVIENT LE POINT DE DÉPART DES DEUX BORNES");
      L.push(" DE L. 1332-2 : deux jours ouvrables au moins, un mois au plus. Mais il ne");
      L.push(" rouvre pas le délai de deux mois de L. 1332-4, qui court depuis la");
      L.push(" connaissance des faits — vérifiez-le ci-dessous AVANT d'envoyer.]");
      L.push("");
      L.push("");

      L = L.concat(blocPrescription(ctx));
      L = L.concat(blocBornes(ctx));
      L = L.concat(blocProtege(ctx));

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous reprenez la lettre et vous cochez");
      L.push("les quatre exigences une à une. Cinq minutes, et c'est le contrôle le plus");
      L.push("rentable de toute la procédure.");
      L.push("");
      L.push("Le jour de la remise — récépissé signé et daté, ou dépôt du recommandé.");
      L.push("Cette date doit tomber dans le délai de deux mois de L. 1332-4 : elle");
      L.push("engage les poursuites (R. 1332-1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 8)) + " environ — l'entretien. Laissez au salarié");
      L.push("le temps de trouver la personne qui l'assistera : aucun texte lu ne fixe");
      L.push("ce délai, mais une convocation remise la veille rend l'assistance");
      L.push("illusoire, et cela se plaide.");
      L.push("");
      L.push("Après l'entretien — la fenêtre de notification s'ouvre. Le générateur");
      L.push("DIS-CTL-SAN-09 la calcule.");

      return L.concat(pied("R. 1332-1, L. 1332-2, L. 1332-4, R. 1332-2, R. 1332-3, " +
        "L. 1333-2, L. 1333-3",
        ["Décision citée, conservée telle qu'elle a été lue dans la base Judilibre de",
         "la Cour de cassation : Soc., 16 avril 2008, n° 06-41.999, publié.",
         ""].concat(NOTE_ANNULATION))).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-09 — LES DEUX BORNES

     Le seul document du fichier qui soit d'abord un calcul. Il calcule ce
     qu'il peut — les quantièmes, la prorogation du samedi et du dimanche — et
     dit tout aussi clairement ce qu'il ne peut pas : le calendrier des jours
     fériés ou chômés, que l'application ne tient pas.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-09", {
    nom: "Le calendrier de notification — les deux bornes de L. 1332-2, calculées",
    detail: "Les bornes calculées selon R. 1332-3, la fiche de suivi, la lettre à " +
            "envoyer dans la fenêtre, et le retrait si le mois est passé.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, s = f.sanction || {};
      var m = mesureDe(ctx);
      var d0 = aujourd(ctx);
      var b = bornesNotification(s.dateEntretien);
      var L = entete(ctx, "Calendrier de notification de la sanction",
        "articles L. 1332-2, R. 1332-2 et R. 1332-3 du code du travail");

      L.push("LES TROIS TEXTES, EN ENTIER");
      L.push("");
      L.push("« La sanction ne peut intervenir moins de deux jours ouvrables, ni plus");
      L.push("d'un mois après le jour fixé pour l'entretien. Elle est motivée et");
      L.push("notifiée à l'intéressé » (L. 1332-2, dernier alinéa).");
      L.push("");
      L.push("« La sanction prévue à l'article L. 1332-2 fait l'objet d'une décision");
      L.push("écrite et motivée. La décision est notifiée au salarié soit par lettre");
      L.push("remise contre récépissé, soit par lettre recommandée, dans le délai d'un");
      L.push("mois prévu par l'article L. 1332-2 » (R. 1332-2).");
      L.push("");
      L.push("« Le délai d'un mois prévu à l'article L. 1332-2 expire à vingt-quatre");
      L.push("heures le jour du mois suivant qui porte le même quantième que le jour");
      L.push("fixé pour l'entretien. A défaut d'un quantième identique, le délai expire");
      L.push("le dernier jour du mois suivant à vingt-quatre heures. Lorsque le dernier");
      L.push("jour de ce délai est un samedi, un dimanche ou un jour férié ou chômé, le");
      L.push("délai est prorogé jusqu'au premier jour ouvrable suivant » (R. 1332-3).");
      L.push("");
      L.push("QUATRE POINTS QUE CES TROIS TEXTES DÉCIDENT");
      L.push("");
      L.push("  1. LE POINT DE DÉPART est le JOUR FIXÉ POUR L'ENTRETIEN — pas le jour");
      L.push("     où la décision est arrêtée, pas le jour où le dossier est complet,");
      L.push("     pas le jour du retour de congé du signataire. Et c'est le jour FIXÉ :");
      L.push("     si le salarié ne s'est pas présenté, le délai court quand même.");
      L.push("");
      L.push("  2. LA BORNE BASSE est de deux jours ouvrables au moins. Elle a un sens :");
      L.push("     elle laisse à l'employeur le temps de peser ce qu'il a entendu. Une");
      L.push("     sanction notifiée le lendemain de l'entretien dit qu'elle était");
      L.push("     décidée avant.");
      L.push("");
      L.push("  3. LA BORNE HAUTE se compte par QUANTIÈME, non en trente jours. Le");
      L.push("     30 janvier donne le 28 février — « à défaut d'un quantième identique,");
      L.push("     le dernier jour du mois suivant ».");
      L.push("");
      L.push("  4. LA PROROGATION joue pour le samedi, le dimanche, ET tout jour férié");
      L.push("     ou chômé. L'application proroge les deux premiers ; elle NE TIENT PAS");
      L.push("     le calendrier des fériés, et elle le dit chaque fois.");
      L.push("");

      if (m.licenciement) {
        L.push("CES BORNES NE S'APPLIQUENT PAS À VOTRE MESURE.");
        L.push("");
        L.push("La mesure déclarée est un licenciement disciplinaire : « Lorsque la");
        L.push("sanction contestée est un licenciement les dispositions du présent");
        L.push("chapitre ne sont pas applicables » (L. 1333-3). Les délais du");
        L.push("licenciement sont autres, et l'application ne les a pas lus : elle ne");
        L.push("les calcule donc pas.");
        L.push("");
        L.push("Ce qui court néanmoins, et qui se vérifie tout de suite :");
        L.push("");
        L = L.concat(blocPrescription(ctx));
        L = L.concat(blocProtege(ctx));
        return L.concat(pied("L. 1332-2, R. 1332-2, R. 1332-3, L. 1333-3, L. 1332-4, " +
          "L. 1333-2", NOTE_ANNULATION)).join("\n");
      }

      L = L.concat(blocBornes(ctx));

      L.push(GROS);
      L.push("PIÈCE 1 — FICHE DE SUIVI DES DÉLAIS");
      L.push(GROS);
      L.push("");
      L.push("À agrafer en tête du dossier disciplinaire. Une seule feuille, et elle");
      L.push("porte les quatre dates qui décident de la régularité.");
      L.push("");
      L.push("  " + nomDe(ctx) + " — dossier [RÉFÉRENCE]");
      L.push("  Salarié : [NOM, PRÉNOM]");
      L.push("");
      L.push("  1. Connaissance des faits par l'employeur ..... " +
        jour(s.dateConnaissance, "À PORTER"));
      L.push("     Pièce qui l'établit : [.....]");
      L.push("     Terme des deux mois (L. 1332-4) ........... " +
        (estISO(s.dateConnaissance)
          ? jour(moisApres(s.dateConnaissance, 2))
          : "[à calculer une fois la date portée]"));
      L.push("");
      L.push("  2. Remise ou envoi de la convocation .......... " +
        jour(s.dateConvocation, "À PORTER"));
      L.push("     Voie : [récépissé / lettre recommandée] — pièce : [.....]");
      L.push("     Doit tomber avant le terme du 1 (R. 1332-1).");
      L.push("");
      L.push("  3. JOUR FIXÉ POUR L'ENTRETIEN ................. " +
        jour(s.dateEntretien, "À PORTER"));
      L.push("     C'est de ce jour, et de lui seul, que courent les deux bornes.");
      L.push("");
      L.push("  4. Fenêtre de notification");
      if (b) {
        L.push("     au plus tôt ............................... " + jour(b.basse));
        L.push("     au plus tard .............................. " +
          jour(b.hauteProrogee) + (b.prorogee ? " (prorogé depuis le " + jour(b.haute) + ")" : ""));
      } else {
        L.push("     au plus tôt ............................... [deux jours ouvrables");
        L.push("                                                  après le 3]");
        L.push("     au plus tard .............................. [même quantième le mois");
        L.push("                                                  suivant, R. 1332-3]");
      }
      L.push("     Jour férié ou chômé dans l'intervalle ou au terme ? [OUI / NON]");
      L.push("     — à vérifier À LA MAIN : l'application ne tient pas ce calendrier.");
      L.push("");
      L.push("  5. Notification effectivement faite le ........ " +
        jour(s.dateNotification, "À PORTER"));
      L.push("     Voie : [récépissé / lettre recommandée] — pièce : [.....]");
      L.push("");
      L.push("  Vérifié le [DATE] par [NOM, FONCTION].");
      L.push("");
      L.push("");

      var horsFenetre = b && estISO(s.dateNotification) &&
        (s.dateNotification < b.basse || s.dateNotification > b.hauteProrogee);

      if (horsFenetre) {
        L.push(GROS);
        L.push("PIÈCE 2 — VOTRE NOTIFICATION EST HORS DE LA FENÊTRE");
        L.push(GROS);
        L.push("");
        if (s.dateNotification < b.basse) {
          L.push("Elle est intervenue TROP TÔT : moins de deux jours ouvrables après le");
          L.push("jour fixé pour l'entretien. La sanction est irrégulière en la forme.");
          L.push("");
          L.push("La borne basse ne se rattrape pas en renotifiant plus tard la même");
          L.push("décision : la sanction a été prise à une date qui la vicie. Ce qui se");
          L.push("fait, c'est le retrait, puis — si le délai de deux mois de L. 1332-4 le");
          L.push("permet encore — une procédure reprise depuis la convocation.");
        } else {
          L.push("Elle est intervenue TROP TARD : après le terme du mois compté selon");
          L.push("R. 1332-3 depuis le jour fixé pour l'entretien. La sanction est");
          L.push("irrégulière en la forme.");
          L.push("");
          L.push("AVANT DE RETIRER, VÉRIFIEZ UNE CHOSE À LA MAIN : le terme calculé");
          L.push("ci-dessus tombait-il un jour férié ou chômé dans l'entreprise ? Si oui,");
          L.push("R. 1332-3 le proroge jusqu'au premier jour ouvrable suivant, et votre");
          L.push("notification pourrait être dans les temps. L'application ne tient pas");
          L.push("ce calendrier et ne peut pas trancher à votre place.");
        }
        L.push("");
        L.push("Lettre de retrait :");
        L.push("");
        L = L.concat(teteLettre(ctx, true));
        L.push("Objet : retrait de la sanction notifiée le " +
          jour(s.dateNotification, "date"));
        L.push("");
        L.push("Madame, Monsieur,");
        L.push("");
        L.push("Par lettre du " + jour(s.dateNotification, "date") +
          ", il vous a été notifié [rappeler la");
        L.push("mesure : " + (m.nature || "[nature de la mesure]") + "], à la suite de");
        L.push("l'entretien préalable du " + jour(s.dateEntretien, "date") + ".");
        L.push("");
        L.push("L'article L. 1332-2 du code du travail dispose que la sanction ne peut");
        L.push("intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour");
        L.push("fixé pour l'entretien. Cette condition n'ayant pas été respectée, je");
        L.push("retire cette mesure.");
        L.push("");
        L.push("Elle est réputée n'avoir jamais été prononcée. Toute mention en sera");
        L.push("supprimée de votre dossier individuel[, et ses effets sur votre");
        L.push("rémunération seront régularisés sur la prochaine paie].");
        L.push("");
        L = L.concat(signature(ctx));
        L.push("");
        L.push("");
      } else {
        L.push(GROS);
        L.push("PIÈCE 2 — CE QUI SE FAIT SI LE MOIS EST PASSÉ");
        L.push(GROS);
        L.push("");
        L.push("NE NOTIFIEZ PAS. Une sanction notifiée après le terme est irrégulière en");
        L.push("la forme, et la notifier quand même ajoute une pièce datée au dossier de");
        L.push("celui qui la contestera. Le cas se traite comme un renoncement, non");
        L.push("comme un rattrapage.");
        L.push("");
        L.push("Trois questions, dans cet ordre :");
        L.push("");
        L.push("  1. Le terme tombait-il un samedi, un dimanche, un jour férié ou chômé ?");
        L.push("     R. 1332-3 le proroge alors jusqu'au premier jour ouvrable suivant.");
        L.push("     L'application proroge les deux premiers ; vérifiez les fériés.");
        L.push("");
        L.push("  2. Le délai de deux mois de L. 1332-4 est-il encore ouvert ? S'il");
        L.push("     l'est, une procédure entièrement reprise — nouvelle convocation,");
        L.push("     nouvel entretien, nouvelle notification dans les bornes — reste");
        L.push("     possible. Le jour fixé pour le NOUVEL entretien devient le nouveau");
        L.push("     point de départ.");
        L.push("");
        L.push("  3. S'il ne l'est plus, ces faits ne peuvent plus, à eux seuls, fonder");
        L.push("     une sanction. Écrivez-le au dossier : c'est une décision, et elle");
        L.push("     s'assume mieux qu'une notification tardive.");
        L.push("");
        L.push("");
      }

      L.push(GROS);
      L.push("PIÈCE 3 — LA LETTRE DE NOTIFICATION, DANS LA FENÊTRE");
      L.push(GROS);
      L.push("");
      L.push("Elle est écrite en entier par le générateur DIS-CTL-SAN-10 de cette");
      L.push("application, avec ses exigences propres — décision ÉCRITE et MOTIVÉE,");
      L.push("remise contre récépissé ou par lettre recommandée (R. 1332-2). Ce");
      L.push("document-ci ne s'occupe que de la DATE à laquelle elle part.");
      L.push("");
      if (b) {
        L.push("Pour votre dossier : entre le " + jour(b.basse) + " et le " +
          jour(b.hauteProrogee) + ".");
        L.push("Visez le milieu de la fenêtre, pas son dernier jour : un pli déposé le");
        L.push("dernier soir, un service fermé, un férié oublié, et le mois est passé.");
      } else {
        L.push("Portez d'abord la date de l'entretien : sans elle, la fenêtre ne se");
        L.push("calcule pas.");
      }
      L.push("");
      L.push("");

      L = L.concat(blocPrescription(ctx));
      L = L.concat(blocProtege(ctx));

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous remplissez la fiche de suivi");
      L.push("(pièce 1) avec les dates réelles du dossier, et vous vérifiez à la main");
      L.push("les jours fériés que l'application ne tient pas.");
      if (b) {
        L.push("");
        L.push("Du " + jour(b.basse) + " au " + jour(b.hauteProrogee) + " — la fenêtre");
        L.push("de notification est ouverte. Choisissez une date, et tenez-la.");
        L.push("");
        L.push("Le " + jour(b.hauteProrogee) + " à vingt-quatre heures — le délai");
        L.push("expire, sauf férié ou jour chômé qui le reporterait au premier jour");
        L.push("ouvrable suivant.");
      } else {
        L.push("");
        L.push("Dès que la date de l'entretien sera portée — la fenêtre se calculera");
        L.push("d'elle-même : deux jours ouvrables au moins, un mois au plus, compté par");
        L.push("quantième.");
      }
      L.push("");
      L.push("Ces deux bornes ne se négocient pas et ne se suspendent pas : ni un congé,");
      L.push("ni une enquête complémentaire, ni l'attente d'un avis ne les arrêtent. Si");
      L.push("une formalité conventionnelle doit s'intercaler — DIS-CTL-SAN-12 —, elle");
      L.push("doit tenir DANS le mois.");

      return L.concat(pied("L. 1332-2, R. 1332-2, R. 1332-3, L. 1332-4, R. 1332-1, " +
        "L. 1333-2, L. 1333-1, L. 1333-3", NOTE_ANNULATION)).join("\n");
    },
  });

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
