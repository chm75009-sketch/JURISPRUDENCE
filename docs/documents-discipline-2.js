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

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
