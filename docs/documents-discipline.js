/* Les documents que l'application PRODUIT — discipline et règlement intérieur.

   POURQUOI CE FICHIER EXISTE

   documents-produits.js porte le règlement intérieur lui-même (DIS-CTL-RI-01).
   Il manquait tout le reste : les avenants qui complètent un règlement
   incomplet, les courriers qui lui font suivre ses formalités, et surtout les
   écrits de la procédure disciplinaire — convocation, compte rendu,
   notification motivée, mise à pied conservatoire, retraits.

   Un employeur à qui l'on explique qu'il aurait dû convoquer n'a toujours pas
   de lettre de convocation. Ce fichier l'écrit, à son nom, avec les dates de
   son dossier et les délais calculés à partir d'elles.

   TROIS RÈGLES, TENUES PARTOUT

   1. Rien qui n'ait été lu à la source. Chaque article cité ici figure dans
      moteur/discipline/textes-discipline.json, avec son identifiant de version,
      ou dans le fondement du contrôle auquel le document répond. Les articles
      simplement RENVOYÉS par un texte lu — L. 4122-1, les dispositions sur les
      harcèlements, la loi du 9 décembre 2016 — sont nommés, jamais reproduits :
      l'application ne les a pas lus, et elle le dit à l'endroit où le lecteur
      pourrait croire qu'elle les connaît.

   2. Les griefs ne s'inventent jamais. Aucune de ces lettres n'écrit ce que le
      salarié aurait fait. Les faits sortent entre crochets, avec la consigne de
      les écrire datés et circonstanciés — c'est l'employeur qui sait, et c'est
      lui qui répondra de ce qu'il a écrit.

   3. Aucune peine annoncée qui ne soit portée par un texte capté. R. 1323-1
      s'arrête à L. 1322-4 et à R. 1321-5 : il atteint le règlement intérieur,
      pas la procédure disciplinaire. L. 1334-1 ne vise que L. 1331-2. Aucun
      document ne menace donc d'une amende pour un entretien qui n'a pas eu
      lieu, un délai dépassé ou une notification défaillante : ce qui s'y joue
      est l'annulation par le conseil de prud'hommes (L. 1333-2), et rien
      d'autre.                                                                */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-discipline.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE DATE

     Les dates du dossier sont des chaînes « AAAA-MM-JJ ». Elles sont lues en
     heure locale — un midi UTC suffirait à décaler d'un jour l'affichage chez
     un lecteur situé assez à l'ouest, et un document daté du mauvais jour est
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
     mois suivant ». n négatif remonte le temps, pour les trois ans de
     L. 1332-5. */
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

  /* La date d'aujourd'hui, telle que le générateur la reçoit. */
  function aujourd(ctx) {
    return ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
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

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

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

  /* Les quatre formalités du titre, et le calendrier qu'elles imposent.
     L. 1321-4 les commande « également en cas de modification ou de retrait des
     clauses du règlement intérieur » : tout avenant les refait. */
  function blocFormalites(ctx, quoi) {
    var d0 = aujourd(ctx);
    var iso0 = isoDe(d0);
    var plancher = moisApres(iso0, 1);
    return [
      "════ LES FORMALITÉS À ACCOMPLIR POUR " + quoi.toUpperCase() + " ════",
      "",
      "L'article L. 1321-4 s'applique « également en cas de modification ou de",
      "retrait des clauses du règlement intérieur ». " + quoi + " suit donc les",
      "quatre formalités du règlement lui-même, dans cet ordre :",
      "",
      "  1. AVIS DU COMITÉ SOCIAL ET ÉCONOMIQUE, avant toute introduction — « le",
      "     règlement intérieur ne peut être introduit qu'après avoir été soumis à",
      "     l'avis du comité social et économique » (L. 1321-4, premier alinéa) ;",
      "  2. PUBLICITÉ par tout moyen, à la connaissance des personnes ayant accès",
      "     aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1) ;",
      "  3. DÉPÔT au greffe du conseil de prud'hommes du ressort de l'entreprise",
      "     ou de l'établissement (R. 1321-2) ;",
      "  4. COMMUNICATION À L'INSPECTEUR DU TRAVAIL, en deux exemplaires",
      "     (R. 1321-4), accompagnée de l'avis du comité, EN MÊME TEMPS que les",
      "     mesures de publicité (L. 1321-4, troisième alinéa).",
      "",
      "Le délai d'un mois qui précède l'entrée en vigueur court « à compter de la",
      "dernière en date des formalités de publicité et de dépôt » (R. 1321-3), et",
      "la date d'entrée en vigueur doit lui être POSTÉRIEURE (L. 1321-4).",
      "",
      "Calendrier, compté depuis aujourd'hui " + leJour(d0) + " :",
      "  · aujourd'hui — saisine du comité social et économique (courrier",
      "    ci-dessous) ; l'avis se rend en réunion, sur un texte transmis avant ;",
      "  · le jour de l'avis — publicité, dépôt au greffe et communication à",
      "    l'inspection : ces trois actes peuvent se faire le même jour ;",
      "  · un mois plus tard — si la dernière des formalités de publicité et de",
      "    dépôt était accomplie aujourd'hui, le mois échoirait le " +
        jour(plancher, "date") + ",",
      "    et l'entrée en vigueur ne pourrait pas être antérieure au " +
        jour(plusJours(plancher, 1), "date") + ".",
      "",
      "Avant cette date, aucune sanction ne peut être fondée sur " + quoi + ".",
      "",
    ];
  }

  /* Le courrier de saisine du comité, produit avec l'avenant : un avenant qui
     attend son courrier n'est pas soumis, et un règlement non soumis n'est pas
     introduit. */
  function courrierCSE(ctx, objet, corpsSupp) {
    var p = ctx.profil || {};
    var f = ctx.fiche || {};
    var nom = cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE");
    var L = [
      GROS,
      "COURRIER — SAISINE DU COMITÉ SOCIAL ET ÉCONOMIQUE",
      GROS,
      "",
    ];
    if (f.cse && f.cse.existe === false) {
      L.push("ATTENTION — le dossier indique qu'il n'existe pas de comité social et");
      L.push("économique. L. 1321-4 subordonne l'introduction du règlement, et donc de");
      L.push("toute modification, à ce qu'il ait été soumis à l'avis du comité : cette");
      L.push("formalité ne peut pas être accomplie tant qu'il n'y a pas de comité. Le");
      L.push("module « comité social et économique » de cette application traite de sa");
      L.push("mise en place. Le courrier ci-dessous est écrit pour le jour où le comité");
      L.push("existera.");
      L.push("");
    }
    L.push(nom);
    L.push(cro(p.adresse, "adresse du siège"));
    L.push("");
    L.push("Aux membres de la délégation du personnel");
    L.push("du comité social et économique");
    L.push("");
    L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
    L.push("");
    L.push("Objet : " + objet);
    L.push("");
    L.push("Mesdames, Messieurs,");
    L.push("");
    (corpsSupp || []).forEach(function (x) { L.push(x); });
    L.push("Conformément à l'article L. 1321-4 du code du travail, aux termes duquel");
    L.push("le règlement intérieur ne peut être introduit qu'après avoir été soumis à");
    L.push("l'avis du comité social et économique, ces dispositions s'appliquant");
    L.push("également en cas de modification ou de retrait de ses clauses, je vous");
    L.push("adresse ci-joint le projet et vous invite à en délibérer lors de la");
    L.push("réunion du [DATE DE LA RÉUNION].");
    L.push("");
    L.push("L'avis que vous rendrez sera communiqué à l'inspecteur du travail en même");
    L.push("temps que le texte, comme le même article l'exige.");
    L.push("");
    L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
    L.push("considération distinguée.");
    L.push("");
    L.push(cro(p.responsable, "Nom et qualité du signataire"));
    L.push("");
    L.push("Pièce jointe : le projet");
    L.push("");
    return L;
  }

  /* Le nom de l'entreprise, tel qu'il s'écrit dans le corps d'une lettre. */
  function nomDe(ctx) {
    var p = ctx.profil || {};
    return cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE");
  }

  /* L'en-tête d'un courrier au salarié : qui écrit, à qui, d'où, quand. */
  function teteLettre(ctx, recommande) {
    var p = ctx.profil || {};
    var L = [nomDe(ctx), cro(p.adresse, "adresse du siège"), ""];
    L = L.concat(blocSalarie());
    L.push(cro(p.ville, "lieu") + ", le " + leJour(aujourd(ctx)));
    L.push("");
    if (recommande) {
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("— ou remise en main propre contre récépissé daté et signé —");
      L.push("");
    }
    return L;
  }

  function signature(ctx) {
    var p = ctx.profil || {};
    return [
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations",
      "distinguées.",
      "",
      cro(p.responsable, "Nom et qualité du signataire"),
      "",
    ];
  }

  /* ════════════════════════════════════════════════════════════════════════
     LE RAPPEL DE LA PRESCRIPTION, calculé

     Il revient dans presque tous les écrits de la procédure : deux mois à
     compter du jour où l'employeur a eu connaissance des faits (L. 1332-4), et
     la convocation doit être remise ou adressée dans ce délai (R. 1332-1).
     ════════════════════════════════════════════════════════════════════════ */
  function blocPrescription(ctx) {
    var s = (ctx.fiche || {}).sanction || {};
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
    var s = (ctx.fiche || {}).sanction || {};
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
    var s = (ctx.fiche || {}).sanction || {};
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

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-02 — L'AVENANT DES TROIS MATIÈRES DE L. 1321-1
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-02", {
    nom: "L'avenant qui complète les trois matières de L. 1321-1",
    detail: "L'avenant rédigé matière par matière, le courrier de saisine du " +
            "comité et le calendrier des quatre formalités.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, ri = f.ri || {};
      var L = entete(ctx, "Avenant au règlement intérieur — les trois matières de L. 1321-1",
        "articles L. 1321-1 et L. 1321-4 du code du travail");

      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("1° Mesures d'application de la réglementation santé-sécurité : " +
        etat(ri.contenuSanteSecurite, "portées par le règlement", "ABSENTES"));
      L.push("2° Participation au rétablissement de conditions de travail");
      L.push("   protectrices : " +
        etat(ri.contenuParticipation, "portée par le règlement", "ABSENTE"));
      L.push("3° Règles générales et permanentes relatives à la discipline : " +
        etat(ri.contenuDiscipline, "portées par le règlement", "ABSENTES"));
      L.push("");
      L.push("CE QUE LE TEXTE DIT, EN ENTIER");
      L.push("");
      L.push("« Le règlement intérieur est un document écrit par lequel l'employeur");
      L.push("fixe exclusivement : 1° Les mesures d'application de la réglementation en");
      L.push("matière de santé et de sécurité dans l'entreprise ou l'établissement,");
      L.push("notamment les instructions prévues à l'article L. 4122-1 ; 2° Les");
      L.push("conditions dans lesquelles les salariés peuvent être appelés à");
      L.push("participer, à la demande de l'employeur, au rétablissement de conditions");
      L.push("de travail protectrices de la santé et de la sécurité des salariés, dès");
      L.push("lors qu'elles apparaîtraient compromises ; 3° Les règles générales et");
      L.push("permanentes relatives à la discipline, notamment la nature et l'échelle");
      L.push("des sanctions que peut prendre l'employeur » (L. 1321-1).");
      L.push("");
      L.push("Le mot qui commande est « exclusivement » : ces trois matières doivent y");
      L.push("être, et une clause étrangère à ces trois matières n'y a pas sa place.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("AVENANT N° [numéro] AU RÈGLEMENT INTÉRIEUR DE " + nomDe(ctx).toUpperCase());
      L.push("");
      L.push("Le règlement intérieur en vigueur depuis le " +
        jour(ri.dateEntreeVigueur, "date d'entrée en vigueur du règlement") +
        " est complété");
      L.push("comme suit.");
      L.push("");

      if (estOui(ri.contenuSanteSecurite)) {
        L.push("MATIÈRE 1° — SANTÉ ET SÉCURITÉ");
        L.push("Le dossier déclare cette matière déjà portée par le règlement");
        L.push("intérieur. Rien n'est ajouté ici. Pointez l'article [numéro] qui la");
        L.push("porte, pour pouvoir le montrer.");
        L.push("");
      } else {
        L.push("ARTICLE 1 — MESURES D'APPLICATION DE LA RÉGLEMENTATION EN MATIÈRE DE");
        L.push("SANTÉ ET DE SÉCURITÉ (L. 1321-1, 1°)");
        L.push("");
        L.push("1.1. Chaque membre du personnel se conforme aux instructions données");
        L.push("par l'employeur en matière de santé et de sécurité.");
        L.push("");
        L.push("1.2. [REPRENDRE ICI LES INSTRUCTIONS PRÉVUES À L'ARTICLE L. 4122-1,");
        L.push(" auquel L. 1321-1, 1°, renvoie. L'application n'a pas lu cet article à");
        L.push(" la source : elle ne le reproduit pas et vous laisse l'écrire. Le module");
        L.push(" « santé, sécurité et conditions de travail » de cette application porte");
        L.push(" ces textes.]");
        L.push("");
        L.push("1.3. [Énumérer vos instructions propres, tirées de votre document unique");
        L.push(" d'évaluation des risques : consignes par unité de travail, conduites à");
        L.push(" tenir, interdictions par poste, équipements de protection individuelle");
        L.push(" et postes où leur port est obligatoire. Une instruction qui ne");
        L.push(" correspond à aucun risque évalué se défend mal ; une instruction");
        L.push(" absente là où le risque est évalué se défend encore plus mal.]");
        L.push("");
        L.push("1.4. [Préciser à qui tout accident, même bénin, et tout incident sont");
        L.push(" signalés, et dans quel délai.]");
        L.push("");
      }

      if (estOui(ri.contenuParticipation)) {
        L.push("MATIÈRE 2° — PARTICIPATION AU RÉTABLISSEMENT DE CONDITIONS DE TRAVAIL");
        L.push("PROTECTRICES");
        L.push("Le dossier déclare cette matière déjà portée par le règlement");
        L.push("intérieur. Rien n'est ajouté ici. Pointez l'article [numéro].");
        L.push("");
      } else {
        L.push("ARTICLE 2 — PARTICIPATION AU RÉTABLISSEMENT DE CONDITIONS DE TRAVAIL");
        L.push("PROTECTRICES (L. 1321-1, 2°)");
        L.push("");
        L.push("2.1. Lorsque les conditions de travail protectrices de la santé et de");
        L.push("la sécurité des salariés apparaissent compromises, les salariés peuvent");
        L.push("être appelés, à la demande de l'employeur, à participer à leur");
        L.push("rétablissement.");
        L.push("");
        L.push("2.2. [PRÉCISER LES CONDITIONS — c'est ce que le texte demande, et c'est");
        L.push(" la partie que l'on oublie : qui peut être appelé (quels postes, quelles");
        L.push(" qualifications), à quelles tâches, par qui la demande est formulée,");
        L.push(" dans quelles limites de durée, et ce qui reste exclu. Une clause qui se");
        L.push(" borne à recopier la loi ne fixe aucune condition.]");
        L.push("");
      }

      if (estOui(ri.contenuDiscipline)) {
        L.push("MATIÈRE 3° — RÈGLES GÉNÉRALES ET PERMANENTES RELATIVES À LA DISCIPLINE");
        L.push("Le dossier déclare cette matière déjà portée par le règlement");
        L.push("intérieur. Rien n'est ajouté ici. Pointez l'article [numéro].");
        L.push("");
      } else {
        L.push("ARTICLE 3 — RÈGLES GÉNÉRALES ET PERMANENTES RELATIVES À LA DISCIPLINE");
        L.push("(L. 1321-1, 3°)");
        L.push("");
        L.push("3.1. [RÉDIGER VOS RÈGLES : horaires et leur respect, accès aux locaux,");
        L.push(" usage du matériel de l'entreprise, tenue, absences et leur");
        L.push(" justification, circulation. Elles doivent être GÉNÉRALES et");
        L.push(" PERMANENTES : une règle individuelle ou temporaire n'a pas sa place");
        L.push(" dans un règlement intérieur.]");
        L.push("");
        L.push("3.2. Nature et échelle des sanctions.");
        L.push("Constitue une sanction toute mesure, autre que les observations");
        L.push("verbales, prise par l'employeur à la suite d'un agissement du salarié");
        L.push("considéré par l'employeur comme fautif, que cette mesure soit de nature");
        L.push("à affecter immédiatement ou non la présence du salarié dans");
        L.push("l'entreprise, sa fonction, sa carrière ou sa rémunération (L. 1331-1).");
        L.push("");
        L.push("Les sanctions susceptibles d'être prononcées sont :");
        L.push("  1. l'avertissement ;");
        L.push("  2. le blâme ;");
        L.push("  3. la mise à pied disciplinaire, d'une durée maximale de");
        L.push("     [PRÉCISER LE NOMBRE DE JOURS] — cette mention est ce qui rend la");
        L.push("     mise à pied licite ; sans elle, elle ne peut pas être prononcée ;");
        L.push("  4. [le cas échéant : la mutation disciplinaire, la rétrogradation] ;");
        L.push("  5. le licenciement pour motif disciplinaire.");
        L.push("");
        L.push("Aucune sanction ne peut être prononcée qui ne figure pas dans cette");
        L.push("liste. Les amendes et autres sanctions pécuniaires sont interdites, et");
        L.push("toute disposition ou stipulation contraire est réputée non écrite");
        L.push("(L. 1331-2).");
        L.push("");
      }

      L.push("ARTICLE FINAL — ENTRÉE EN VIGUEUR");
      L.push("Le présent avenant entre en vigueur le [DATE], postérieure d'un mois à la");
      L.push("dernière en date des formalités de publicité et de dépôt (L. 1321-4 ;");
      L.push("R. 1321-3).");
      L.push("");
      L.push("Fait à " + cro((ctx.profil || {}).ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro((ctx.profil || {}).responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");

      L = L.concat(blocFormalites(ctx, "l'avenant"));
      L = L.concat(courrierCSE(ctx, "consultation sur un projet d'avenant au règlement intérieur",
        ["Le règlement intérieur de l'entreprise doit fixer les trois matières que",
         "l'article L. 1321-1 du code du travail lui réserve. Le projet d'avenant",
         "ci-joint complète celles qui n'y figuraient pas.",
         ""]));

      return L.concat(pied("L. 1321-1, L. 1321-4, L. 1331-1, L. 1331-2, R. 1321-1, " +
        "R. 1321-2, R. 1321-3, R. 1321-4",
        ["L'article L. 4122-1, auquel L. 1321-1, 1°, renvoie, n'a pas été lu à la",
         "source par ce module : son contenu n'est pas reproduit ici.",
         "Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — L. 1321-1 est dans cette",
         "énumération."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-03 — L'ÉCHELLE DES SANCTIONS ET LA DURÉE MAXIMALE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-03", {
    nom: "L'avenant qui fixe l'échelle des sanctions et la durée maximale de la mise à pied",
    detail: "C'est le point qui fait tomber les sanctions : l'avenant rédigé, " +
            "la durée maximale chiffrée, le courrier de saisine et le calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, ri = f.ri || {}, s = f.sanction || {};
      var jours = ri.misePiedDureeMaxJours;
      var L = entete(ctx, "Avenant au règlement intérieur — échelle des sanctions et mise à pied",
        "article L. 1321-1, 3°, du code du travail");

      L.push("POURQUOI CET AVENANT EST LE PLUS URGENT DES AVENANTS");
      L.push("");
      L.push("La nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve");
      L.push("au règlement intérieur. Deux conséquences, et ce sont elles qui coûtent :");
      L.push("chez l'employeur tenu d'établir un règlement intérieur, une sanction");
      L.push("autre que le licenciement ne peut être prononcée que si elle y figure ;");
      L.push("et une mise à pied disciplinaire n'est licite que si le règlement précise");
      L.push("sa durée maximale. Le conseil de prud'hommes peut annuler une sanction");
      L.push("irrégulière en la forme (L. 1333-2).");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Échelle des sanctions fixée : " +
        etat(ri.echelleSanctions, "oui", "NON"));
      L.push("Durée maximale de la mise à pied précisée : " +
        etat(ri.misePiedDureeMax, "oui", "NON"));
      L.push("Cette durée, en jours : " +
        (jours != null && jours !== "" ? jours : "[non renseignée]"));
      if (s.dureeMisePiedJours != null && s.dureeMisePiedJours !== "")
        L.push("Mise à pied effectivement prononcée dans le dossier : " +
          s.dureeMisePiedJours + " jour(s).");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("AVENANT N° [numéro] AU RÈGLEMENT INTÉRIEUR DE " + nomDe(ctx).toUpperCase());
      L.push("");
      L.push("ARTICLE 1 — CE QU'EST UNE SANCTION");
      L.push("");
      L.push("Constitue une sanction toute mesure, autre que les observations");
      L.push("verbales, prise par l'employeur à la suite d'un agissement du salarié");
      L.push("considéré par l'employeur comme fautif, que cette mesure soit de nature à");
      L.push("affecter immédiatement ou non la présence du salarié dans l'entreprise,");
      L.push("sa fonction, sa carrière ou sa rémunération (L. 1331-1).");
      L.push("");
      L.push("ARTICLE 2 — NATURE ET ÉCHELLE DES SANCTIONS");
      L.push("");
      L.push("Les sanctions susceptibles d'être prononcées dans l'entreprise sont,");
      L.push("dans l'ordre croissant de gravité :");
      L.push("");
      L.push("  1. L'AVERTISSEMENT — observation écrite notifiée au salarié.");
      L.push("");
      L.push("  2. LE BLÂME — reproche écrit notifié au salarié et versé à son");
      L.push("     dossier.");
      L.push("");
      L.push("  3. LA MISE À PIED DISCIPLINAIRE — suspension du contrat de travail et");
      L.push("     de la rémunération pendant sa durée, d'une durée maximale de " +
        (jours != null && jours !== ""
          ? jours + " JOUR(S)."
          : "[PRÉCISER"));
      if (jours == null || jours === "") {
        L.push("     LE NOMBRE DE JOURS — c'est la mention qui rend cette sanction");
        L.push("     licite. Sans elle, la mise à pied ne peut pas être prononcée, et");
        L.push("     l'avenant ne sert à rien. Chiffrez-la.].");
      } else {
        L.push("     Ce nombre est celui que le dossier déclare : vérifiez qu'il est");
        L.push("     bien celui du texte que vous déposez.");
      }
      L.push("");
      L.push("  4. [LE CAS ÉCHÉANT : LA MUTATION DISCIPLINAIRE, LA RÉTROGRADATION —");
      L.push("     ces sanctions modifient le contrat de travail et ne peuvent pas être");
      L.push("     imposées : le refus du salarié oblige l'employeur à y renoncer ou à");
      L.push("     engager une autre procédure. Ne les inscrivez que si vous entendez");
      L.push("     pouvoir les prononcer.]");
      L.push("");
      L.push("  5. LE LICENCIEMENT POUR MOTIF DISCIPLINAIRE.");
      L.push("");
      L.push("L'employeur n'est pas tenu de suivre cet ordre : il choisit la sanction");
      L.push("proportionnée à la faute. Il ne peut en revanche prononcer aucune");
      L.push("sanction qui ne figure pas dans cette liste.");
      L.push("");
      L.push("ARTICLE 3 — INTERDICTION DES SANCTIONS PÉCUNIAIRES");
      L.push("");
      L.push("Les amendes ou autres sanctions pécuniaires sont interdites. Toute");
      L.push("disposition ou stipulation contraire est réputée non écrite (L. 1331-2).");
      L.push("");
      L.push("Relisez l'échelle ci-dessus avant de la déposer : aucune de ses lignes ne");
      L.push("doit consister en une amende, une pénalité, une retenue ou une");
      L.push("suppression de prime prononcée à titre de sanction.");
      L.push("");
      L.push("ARTICLE 4 — ENTRÉE EN VIGUEUR");
      L.push("Le présent avenant entre en vigueur le [DATE], postérieure d'un mois à la");
      L.push("dernière en date des formalités de publicité et de dépôt (L. 1321-4 ;");
      L.push("R. 1321-3).");
      L.push("");
      L.push("Une échelle complétée ne rétroagit pas : elle ne rend pas régulière une");
      L.push("sanction déjà prononcée sans elle.");
      L.push("");
      L.push("Fait à " + cro((ctx.profil || {}).ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro((ctx.profil || {}).responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");

      L = L.concat(blocFormalites(ctx, "l'avenant"));
      L = L.concat(courrierCSE(ctx, "consultation sur un projet d'avenant — échelle des sanctions",
        ["L'article L. 1321-1, 3°, du code du travail réserve au règlement intérieur",
         "la nature et l'échelle des sanctions que peut prendre l'employeur. Le",
         "projet d'avenant ci-joint fixe cette échelle et précise la durée maximale",
         "de la mise à pied disciplinaire.",
         ""]));

      return L.concat(pied("L. 1321-1, 3°, L. 1321-4, L. 1331-1, L. 1331-2, L. 1333-2, " +
        "R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1). Et « le fait d'infliger une amende",
         "ou une sanction pécuniaire en méconnaissance des dispositions de",
         "l'article L. 1331-2 est puni d'une amende de 3 750 euros » (L. 1334-1)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-04 — LES TROIS RAPPELS DE L. 1321-2
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-04", {
    nom: "L'avenant qui porte les trois rappels de L. 1321-2",
    detail: "Les droits de la défense reproduits mot pour mot, les deux autres " +
            "rappels cadrés, le courrier de saisine et le calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, ri = f.ri || {};
      var L = entete(ctx, "Avenant au règlement intérieur — les rappels de L. 1321-2",
        "article L. 1321-2 du code du travail");

      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("1° Droits de la défense (L. 1332-1 à L. 1332-3) : " +
        etat(ri.rappelDroitsDefense, "rappelés", "NON RAPPELÉS"));
      L.push("2° Harcèlements moral et sexuel, agissements sexistes : " +
        etat(ri.rappelHarcelement, "rappelés", "NON RAPPELÉS"));
      L.push("3° Dispositif de protection des lanceurs d'alerte : " +
        etat(ri.rappelLanceursAlerte, "rappelé", "NON RAPPELÉ"));
      L.push("");
      L.push("CE QUE LE TEXTE DIT, EN ENTIER");
      L.push("");
      L.push("« Le règlement intérieur rappelle : 1° Les dispositions relatives aux");
      L.push("droits de la défense des salariés définis aux articles L. 1332-1 à");
      L.push("L. 1332-3 ou par la convention collective applicable ; 2° Les");
      L.push("dispositions relatives aux harcèlements moral et sexuel et aux");
      L.push("agissements sexistes prévues par le présent code ; 3° L'existence du");
      L.push("dispositif de protection des lanceurs d'alerte prévu au chapitre II de la");
      L.push("loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la");
      L.push("lutte contre la corruption et à la modernisation de la vie économique »");
      L.push("(L. 1321-2).");
      L.push("");
      L.push("Le verbe est à l'indicatif : le règlement « rappelle ». Ce n'est pas une");
      L.push("faculté.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("AVENANT N° [numéro] AU RÈGLEMENT INTÉRIEUR DE " + nomDe(ctx).toUpperCase());
      L.push("");

      L.push("ARTICLE 1 — DROITS DE LA DÉFENSE (L. 1321-2, 1°)");
      L.push("");
      L.push("Le règlement intérieur rappelle les dispositions suivantes, reproduites");
      L.push("dans leur texte.");
      L.push("");
      L.push("1.1. Information écrite des griefs. « Aucune sanction ne peut être prise");
      L.push("à l'encontre du salarié sans que celui-ci soit informé, dans le même");
      L.push("temps et par écrit, des griefs retenus contre lui » (L. 1332-1).");
      L.push("");
      L.push("1.2. Convocation, entretien, assistance et délais. « Lorsque l'employeur");
      L.push("envisage de prendre une sanction, il convoque le salarié en lui précisant");
      L.push("l'objet de la convocation, sauf si la sanction envisagée est un");
      L.push("avertissement ou une sanction de même nature n'ayant pas d'incidence,");
      L.push("immédiate ou non, sur la présence dans l'entreprise, la fonction, la");
      L.push("carrière ou la rémunération du salarié. Lors de son audition, le salarié");
      L.push("peut se faire assister par une personne de son choix appartenant au");
      L.push("personnel de l'entreprise. Au cours de l'entretien, l'employeur indique le");
      L.push("motif de la sanction envisagée et recueille les explications du salarié.");
      L.push("La sanction ne peut intervenir moins de deux jours ouvrables, ni plus d'un");
      L.push("mois après le jour fixé pour l'entretien. Elle est motivée et notifiée à");
      L.push("l'intéressé » (L. 1332-2).");
      L.push("");
      L.push("1.3. Mise à pied conservatoire. « Lorsque les faits reprochés au salarié");
      L.push("ont rendu indispensable une mesure conservatoire de mise à pied à effet");
      L.push("immédiat, aucune sanction définitive relative à ces faits ne peut être");
      L.push("prise sans que la procédure prévue à l'article L. 1332-2 ait été");
      L.push("respectée » (L. 1332-3).");
      L.push("");
      L.push("1.4. [LE CAS ÉCHÉANT : L. 1321-2, 1°, permet de rappeler les droits de la");
      L.push(" défense « définis aux articles L. 1332-1 à L. 1332-3 OU par la convention");
      L.push(" collective applicable ». Si votre convention collective en prévoit");
      L.push(" d'autres — conseil de discipline, commission paritaire, délai de");
      L.push(" réflexion, forme particulière de notification —, rappelez-les ici, en");
      L.push(" citant la stipulation. L'application ne lit aucune convention");
      L.push(" collective : elle ne peut ni les écrire ni affirmer qu'il n'y en a pas.]");
      L.push("");

      L.push("ARTICLE 2 — HARCÈLEMENTS ET AGISSEMENTS SEXISTES (L. 1321-2, 2°)");
      L.push("");
      L.push("[REPRODUIRE ICI LES DISPOSITIONS DU CODE DU TRAVAIL RELATIVES AUX");
      L.push(" HARCÈLEMENTS MORAL ET SEXUEL ET AUX AGISSEMENTS SEXISTES. L. 1321-2, 2°,");
      L.push(" impose de les rappeler, mais ces articles ne sont pas ceux du chapitre");
      L.push(" de la discipline : ce module ne les a pas lus à la source, et il ne");
      L.push(" reproduira pas un texte qu'il n'a pas lu. Le module « santé, sécurité et");
      L.push(" conditions de travail » de cette application porte ces articles, et le");
      L.push(" module « comité social et économique » traite du référent chargé de ces");
      L.push(" questions. Reprenez-les de là, ou du code lui-même.]");
      L.push("");
      L.push("[PRÉCISER EN OUTRE : à qui un salarié peut signaler des faits de");
      L.push(" harcèlement ou des agissements sexistes dans l'entreprise, et ce qui");
      L.push(" suit un signalement.]");
      L.push("");

      L.push("ARTICLE 3 — DISPOSITIF DE PROTECTION DES LANCEURS D'ALERTE");
      L.push("(L. 1321-2, 3°)");
      L.push("");
      L.push("Il existe un dispositif de protection des lanceurs d'alerte, prévu au");
      L.push("chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la");
      L.push("transparence, à la lutte contre la corruption et à la modernisation de la");
      L.push("vie économique.");
      L.push("");
      L.push("Ce que le texte impose est de rappeler l'EXISTENCE du dispositif : la");
      L.push("phrase ci-dessus y suffit, et elle est reprise mot pour mot de");
      L.push("L. 1321-2, 3°.");
      L.push("");
      L.push("[PRÉCISER, SI ELLE EXISTE : la procédure de recueil et de traitement des");
      L.push(" signalements en vigueur dans l'entreprise, et où la consulter. Cette loi");
      L.push(" n'est pas au code du travail : l'application ne l'a pas lue à la source");
      L.push(" et n'en détaille donc pas le contenu.]");
      L.push("");

      L.push("ARTICLE 4 — ENTRÉE EN VIGUEUR");
      L.push("Le présent avenant entre en vigueur le [DATE], postérieure d'un mois à la");
      L.push("dernière en date des formalités de publicité et de dépôt (L. 1321-4 ;");
      L.push("R. 1321-3).");
      L.push("");
      L.push("Fait à " + cro((ctx.profil || {}).ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro((ctx.profil || {}).responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");

      L = L.concat(blocFormalites(ctx, "l'avenant"));
      L = L.concat(courrierCSE(ctx, "consultation sur un projet d'avenant — les rappels de L. 1321-2",
        ["L'article L. 1321-2 du code du travail impose au règlement intérieur de",
         "rappeler les droits de la défense, les dispositions relatives aux",
         "harcèlements et aux agissements sexistes, et l'existence du dispositif de",
         "protection des lanceurs d'alerte. Le projet d'avenant ci-joint y pourvoit.",
         ""]));

      return L.concat(pied("L. 1321-2, L. 1321-4, L. 1332-1, L. 1332-2, L. 1332-3, " +
        "R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4",
        ["Les dispositions relatives aux harcèlements et aux agissements sexistes,",
         "ainsi que la loi n° 2016-1691 du 9 décembre 2016, ne sont pas des textes",
         "du chapitre de la discipline : ce module ne les a pas lus à la source et",
         "ne les reproduit pas.",
         "Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — L. 1321-2 est dans cette",
         "énumération."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-05 — LA REVUE DES CLAUSES (L. 1321-3 ; L. 1321-2-1)
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-05", {
    nom: "La note de revue des clauses, clause par clause",
    detail: "Les trois interdictions de L. 1321-3 reproduites, la grille à " +
            "remplir clause par clause, et la justification écrite de toute " +
            "clause de neutralité.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, ri = f.ri || {};
      var L = entete(ctx, "Note de revue des clauses du règlement intérieur",
        "articles L. 1321-3 et L. 1321-2-1 du code du travail");

      L.push("À QUOI SERT CETTE NOTE");
      L.push("");
      L.push("Elle n'est pas un avenant : elle est le travail qui précède l'avenant.");
      L.push("Elle se remplit clause par clause, et ce qu'elle établit — ou n'établit");
      L.push("pas — décide de ce qui est retiré. Datée et signée, elle est aussi la");
      L.push("pièce que l'on montre lorsque l'inspecteur du travail exige le retrait ou");
      L.push("la modification d'une disposition (L. 1322-1).");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Clauses à retirer relevées à la relecture : " +
        etat(ri.clausesInterdites, "OUI — elles sont à traiter ci-dessous", "aucune"));
      L.push("Clause de neutralité au règlement : " +
        etat(ri.clauseNeutralite, "OUI", "non"));
      if (estOui(ri.clauseNeutralite))
        L.push("Justification et proportionnalité écrites : " +
          etat(ri.neutraliteJustifieeProportionnee, "déclarées", "NON ÉCRITES"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("I. CE QUE LE RÈGLEMENT NE PEUT PAS CONTENIR — L. 1321-3, EN ENTIER");
      L.push("");
      L.push("« Le règlement intérieur ne peut contenir : 1° Des dispositions");
      L.push("contraires aux lois et règlements ainsi qu'aux stipulations des");
      L.push("conventions et accords collectifs de travail applicables dans");
      L.push("l'entreprise ou l'établissement ; 2° Des dispositions apportant aux");
      L.push("droits des personnes et aux libertés individuelles et collectives des");
      L.push("restrictions qui ne seraient pas justifiées par la nature de la tâche à");
      L.push("accomplir ni proportionnées au but recherché ; 3° Des dispositions");
      L.push("discriminant les salariés dans leur emploi ou leur travail, à capacité");
      L.push("professionnelle égale, en raison de leur origine, de leur sexe, de leurs");
      L.push("mœurs, de leur orientation sexuelle ou identité de genre, de leur âge, de");
      L.push("leur situation de famille ou de leur grossesse, de leurs caractéristiques");
      L.push("génétiques, de leur appartenance ou de leur non-appartenance, vraie ou");
      L.push("supposée, à une ethnie, une nation ou une race, de leurs opinions");
      L.push("politiques, de leurs activités syndicales ou mutualistes, de leurs");
      L.push("convictions religieuses, de leur apparence physique, de leur nom de");
      L.push("famille ou en raison de leur état de santé ou de leur handicap »");
      L.push("(L. 1321-3).");
      L.push("");
      L.push("Le 2° pose DEUX conditions, et elles sont cumulatives : justifiée par la");
      L.push("nature de la tâche à accomplir, ET proportionnée au but recherché. Une");
      L.push("clause qui ne remplit qu'une des deux tombe.");
      L.push("");

      L.push("II. LA GRILLE, CLAUSE PAR CLAUSE");
      L.push("");
      L.push("À remplir pour CHAQUE clause qui restreint un droit ou une liberté. Les");
      L.push("endroits où l'on en trouve, dans l'ordre où on les rencontre : fouille des");
      L.push("sacs et des vestiaires, contrôle d'alcoolémie ou de stupéfiants, tenue et");
      L.push("apparence, usage des outils numériques et de la messagerie, vidéo-");
      L.push("surveillance, liberté d'expression, circulation et accès aux locaux,");
      L.push("interdiction de recevoir des visites.");
      L.push("");
      L.push("  Clause n° ....  Article [numéro] du règlement intérieur");
      L.push("  ────────────────────────────────────────────────────────────────────");
      L.push("  a) Ce que la clause interdit ou impose, dans ses termes :");
      L.push("     [.....................................................]");
      L.push("  b) Quel droit ou quelle liberté elle restreint :");
      L.push("     [.....................................................]");
      L.push("  c) La NATURE DE LA TÂCHE qui la justifie — quels postes, quelles");
      L.push("     opérations, quel risque, établi par quelle pièce :");
      L.push("     [.....................................................]");
      L.push("  d) En quoi elle est PROPORTIONNÉE au but recherché — pourquoi une");
      L.push("     mesure moins restrictive ne suffirait pas, et à quoi la clause est");
      L.push("     limitée (postes, moments, modalités, présence d'un tiers, refus");
      L.push("     possible) :");
      L.push("     [.....................................................]");
      L.push("  e) Conclusion : maintenue en l'état · maintenue après réécriture ·");
      L.push("     RETIRÉE  → [entourer, dater, signer]");
      L.push("");
      L.push("  Une case c) ou d) laissée vide vaut retrait : c'est le sens du mot");
      L.push("  « ni » dans L. 1321-3, 2°.");
      L.push("");
      L.push("[REPRODUIRE CE CADRE AUTANT DE FOIS QU'IL Y A DE CLAUSES.]");
      L.push("");
      L.push("Vérifiez en outre, sur l'ensemble du règlement :");
      L.push("  · qu'aucune disposition n'est contraire aux lois, aux règlements ou aux");
      L.push("    stipulations des conventions et accords collectifs applicables");
      L.push("    (L. 1321-3, 1°) ;");
      L.push("  · qu'aucune disposition ne discrimine les salariés au sens de");
      L.push("    L. 1321-3, 3°, dont la liste des motifs est reproduite ci-dessus ;");
      L.push("  · qu'aucune clause ne prévoit d'amende ni de sanction pécuniaire :");
      L.push("    elles sont interdites et réputées non écrites (L. 1331-2).");
      L.push("");

      L.push("III. LA CLAUSE DE NEUTRALITÉ, SI ELLE EXISTE");
      L.push("");
      L.push("« Le règlement intérieur peut contenir des dispositions inscrivant le");
      L.push("principe de neutralité et restreignant la manifestation des convictions");
      L.push("des salariés si ces restrictions sont justifiées par l'exercice d'autres");
      L.push("libertés et droits fondamentaux ou par les nécessités du bon");
      L.push("fonctionnement de l'entreprise et si elles sont proportionnées au but");
      L.push("recherché » (L. 1321-2-1).");
      L.push("");
      if (estNon(ri.clauseNeutralite)) {
        L.push("Le dossier déclare qu'il n'y a pas de clause de neutralité : ce III est");
        L.push("sans objet. Ne l'inscrivez pas pour faire nombre — le texte n'en fait");
        L.push("qu'une faculté, et une clause inscrite sans justification écrite est une");
        L.push("clause exposée.");
      } else {
        L.push("  Article [numéro] du règlement intérieur");
        L.push("  ────────────────────────────────────────────────────────────────────");
        L.push("  a) Ce que la clause restreint, dans ses termes :");
        L.push("     [.....................................................]");
        L.push("  b) Ce qui la justifie — cochez et développez :");
        L.push("     [ ] l'exercice d'autres libertés et droits fondamentaux, à savoir");
        L.push("         [.................................................]");
        L.push("     [ ] les nécessités du bon fonctionnement de l'entreprise, à savoir");
        L.push("         [.................................................]");
        L.push("  c) En quoi elle est proportionnée au but recherché, POSTE PAR POSTE :");
        L.push("     [.....................................................]");
        L.push("  d) Postes concernés, et postes expressément exclus :");
        L.push("     [.....................................................]");
        L.push("");
        L.push("Écrivez cette justification DANS LE RÈGLEMENT lui-même, et pas seulement");
        L.push("dans la présente note : c'est la motivation portée au texte qui le");
        L.push("défendra. Une affirmation n'établit ni la justification ni la");
        L.push("proportionnalité.");
      }
      L.push("");

      L.push("IV. LA SUITE");
      L.push("");
      L.push("Ce qui est retiré ou réécrit à l'issue de cette revue forme un avenant, et");
      L.push("l'avenant refait les formalités : L. 1321-4 « s'applique également en cas");
      L.push("de modification ou de retrait des clauses du règlement intérieur ».");
      L.push("");
      L.push("Fait à " + cro((ctx.profil || {}).ville, "lieu") + ", le " +
        leJour(aujourd(ctx)));
      L.push("");
      L.push(cro((ctx.profil || {}).responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("");

      L = L.concat(blocFormalites(ctx, "l'avenant issu de cette revue"));
      L = L.concat(courrierCSE(ctx, "consultation sur un projet d'avenant — retrait de clauses",
        ["La relecture du règlement intérieur au regard de l'article L. 1321-3 du",
         "code du travail a conduit à retirer ou à réécrire les clauses dont la",
         "note de revue jointe rend compte. Le projet d'avenant en tire les",
         "conséquences.",
         ""]));

      return L.concat(pied("L. 1321-3, L. 1321-2-1, L. 1321-4, L. 1322-1, L. 1331-2, " +
        "R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — L. 1321-3 est dans cette",
         "énumération."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-06 — LA CONSULTATION DU COMITÉ : ORDRE DU JOUR ET PROCÈS-VERBAL
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-06", {
    nom: "La consultation du comité : convocation, ordre du jour, procès-verbal",
    detail: "Le courrier de transmission du projet, l'ordre du jour et le " +
            "procès-verbal qui recueille l'avis — la pièce qui accompagnera le " +
            "règlement chez l'inspecteur du travail.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Consultation du comité social et économique sur le règlement intérieur",
        "article L. 1321-4 du code du travail");

      L.push("CE QUE LE TEXTE EXIGE, ET CE QU'IL N'EXIGE PAS");
      L.push("");
      L.push("« Le règlement intérieur ne peut être introduit qu'après avoir été soumis");
      L.push("à l'avis du comité social et économique » (L. 1321-4, premier alinéa).");
      L.push("Ce qui est exigé est que le règlement ait été SOUMIS à l'avis, non que");
      L.push("l'avis soit favorable. Un avis défavorable, ou l'absence d'avis rendu");
      L.push("après que le comité a été mis à même de se prononcer, n'empêche pas");
      L.push("l'introduction ; l'absence de consultation, elle, l'empêche.");
      L.push("");
      L.push("L'avis est en outre la pièce qui accompagne le règlement communiqué à");
      L.push("l'inspecteur du travail (L. 1321-4, troisième alinéa) : il se consigne");
      L.push("donc par écrit, daté.");
      L.push("");
      L.push("Dans votre dossier : avis du comité recueilli avant l'introduction — " +
        etat(ri.avisCSE, "oui", "NON"));
      if (f.cse && f.cse.existe === false) {
        L.push("Et le dossier n'indique aucun comité social et économique : la");
        L.push("consultation ne peut pas être accomplie tant qu'il n'y en a pas. Le");
        L.push("module « comité social et économique » de cette application traite de sa");
        L.push("mise en place.");
      }
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — COURRIER DE TRANSMISSION DU PROJET AUX MEMBRES DU COMITÉ");
      L.push(GROS);
      L.push("");
      L.push("Un avis se rend sur un texte, pas sur une annonce : le projet part avant");
      L.push("la réunion.");
      L.push("");
      L.push(nomDe(ctx));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("du comité social et économique");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : consultation sur le règlement intérieur — transmission du projet");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'article L. 1321-4 du code du travail dispose que le règlement intérieur");
      L.push("ne peut être introduit qu'après avoir été soumis à l'avis du comité social");
      L.push("et économique, ces dispositions s'appliquant également en cas de");
      L.push("modification ou de retrait de ses clauses.");
      L.push("");
      L.push("Je vous adresse en conséquence le projet ci-joint, et vous invite à en");
      L.push("délibérer lors de la réunion du [DATE DE LA RÉUNION], dont l'ordre du jour");
      L.push("figure ci-après.");
      L.push("");
      L.push("L'avis que vous rendrez sera consigné au procès-verbal et communiqué à");
      L.push("l'inspecteur du travail en même temps que le règlement, comme le même");
      L.push("article l'exige.");
      L.push("");
      L.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("Pièce jointe : projet de règlement intérieur [ou d'avenant]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — ORDRE DU JOUR DE LA RÉUNION");
      L.push(GROS);
      L.push("");
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE DE " + nomDe(ctx).toUpperCase());
      L.push("Réunion du [DATE] à [HEURE] — [LIEU]");
      L.push("");
      L.push("Ordre du jour");
      L.push("");
      L.push("  1. Consultation sur le projet de règlement intérieur [ou d'avenant au");
      L.push("     règlement intérieur], en application de l'article L. 1321-4 du code");
      L.push("     du travail :");
      L.push("       a) présentation du projet et des matières qu'il fixe (L. 1321-1) ;");
      L.push("       b) présentation des rappels qu'il porte (L. 1321-2) ;");
      L.push("       c) échanges et questions des membres de la délégation ;");
      L.push("       d) recueil de l'avis.");
      L.push("  2. [Autres points, le cas échéant.]");
      L.push("");
      L.push("Établi le " + leJour(d0) + " par [qui arrête l'ordre du jour].");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — PROCÈS-VERBAL DE LA CONSULTATION");
      L.push(GROS);
      L.push("");
      L.push("C'est cette pièce qui prouve la consultation, et c'est elle qui part");
      L.push("chez l'inspecteur du travail avec le règlement.");
      L.push("");
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE DE " + nomDe(ctx).toUpperCase());
      L.push("PROCÈS-VERBAL DE LA RÉUNION DU [DATE]");
      L.push("");
      L.push("Présents : [noms et qualités des membres présents]");
      L.push("Absents excusés : [noms]");
      L.push("Présidence : " + cro(p.responsable, "nom et qualité"));
      L.push("Secrétaire de séance : [nom]");
      L.push("");
      L.push("1. Consultation sur le projet de règlement intérieur");
      L.push("");
      L.push("Le projet a été adressé aux membres de la délégation du personnel le");
      L.push("[DATE D'ENVOI], soit [nombre] jours avant la séance.");
      L.push("");
      L.push("Le président a exposé l'objet du projet et les matières qu'il fixe.");
      L.push("");
      L.push("Observations des membres de la délégation du personnel :");
      L.push("[CONSIGNER LES OBSERVATIONS — elles font la valeur du procès-verbal. Un");
      L.push(" procès-verbal qui n'en porte aucune se lit comme une consultation");
      L.push(" formelle.]");
      L.push("");
      L.push("Avis rendu : [FAVORABLE / DÉFAVORABLE / le comité n'a pas souhaité rendre");
      L.push("d'avis], par [nombre] voix pour, [nombre] contre, [nombre] abstentions.");
      L.push("");
      L.push("Date de l'avis : [DATE] — c'est cette date qui doit être ANTÉRIEURE à");
      L.push("l'introduction du règlement intérieur (L. 1321-4).");
      L.push("");
      L.push("Le procès-verbal a été établi le [DATE] et signé par :");
      L.push("");
      L.push("Le secrétaire                          Le président");
      L.push("[nom, signature]                       " + cro(p.responsable, "nom, signature"));
      L.push("");
      L.push("");

      L.push("════ CE QUI SUIT L'AVIS ════");
      L.push("");
      L.push("Le jour de l'avis, ou après lui — jamais avant — vous accomplissez la");
      L.push("publicité (R. 1321-1), le dépôt au greffe (R. 1321-2) et la communication");
      L.push("à l'inspecteur du travail en deux exemplaires avec l'avis (L. 1321-4 ;");
      L.push("R. 1321-4). Le délai d'un mois qui précède l'entrée en vigueur court de la");
      L.push("dernière en date des formalités de publicité et de dépôt (R. 1321-3).");
      L.push("");
      L.push("Si l'avis était recueilli aujourd'hui " + leJour(d0) + " et les trois");
      L.push("autres formalités accomplies le même jour, le mois échoirait le " +
        jour(moisApres(isoDe(d0), 1)) + ",");
      L.push("et l'entrée en vigueur ne pourrait pas être antérieure au " +
        jour(plusJours(moisApres(isoDe(d0), 1), 1)) + ".");
      L.push("");

      return L.concat(pied("L. 1321-4, L. 1321-1, L. 1321-2, R. 1321-1, R. 1321-2, " +
        "R. 1321-3, R. 1321-4",
        ["Sur le terrain pénal, deux textes se rencontrent ici : « le fait de",
         "méconnaître les dispositions des articles L. 1311-2 à L. 1322-4 et",
         "R. 1321-1 à R. 1321-5 relatives au règlement intérieur, est puni de",
         "l'amende prévue pour les contraventions de la quatrième classe »",
         "(R. 1323-1) ; et « le fait d'apporter une entrave à leur fonctionnement",
         "régulier est puni d'une amende de 7 500 € » (L. 2317-1), qualification",
         "qu'il appartient au juge de retenir ou d'écarter."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-07 — PUBLICITÉ ET DATE D'ENTRÉE EN VIGUEUR
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-07", {
    nom: "L'attestation de publicité et la note fixant l'entrée en vigueur",
    detail: "L'attestation datée, la note qui fixe la date d'entrée en vigueur, " +
            "et le calcul du mois de L. 1321-4 depuis la dernière formalité.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var derniere = estISO(ri.dateDerniereFormalite) ? ri.dateDerniereFormalite : null;
      var base = derniere || isoDe(d0);
      var plancher = moisApres(base, 1);
      var minimum = plusJours(plancher, 1);
      var L = entete(ctx, "Publicité du règlement intérieur et date de son entrée en vigueur",
        "articles R. 1321-1, L. 1321-4 et R. 1321-3 du code du travail");

      L.push("LES DEUX TEXTES, EN ENTIER");
      L.push("");
      L.push("« Le règlement intérieur est porté, par tout moyen, à la connaissance des");
      L.push("personnes ayant accès aux lieux de travail ou aux locaux où se fait");
      L.push("l'embauche » (R. 1321-1).");
      L.push("");
      L.push("« Le règlement intérieur indique la date de son entrée en vigueur. Cette");
      L.push("date doit être postérieure d'un mois à l'accomplissement des formalités de");
      L.push("publicité » (L. 1321-4, deuxième alinéa). Et « le délai prévu au deuxième");
      L.push("alinéa de l'article L. 1321-4 court à compter de la dernière en date des");
      L.push("formalités de publicité et de dépôt définies aux articles R. 1321-1 et");
      L.push("R. 1321-2 » (R. 1321-3).");
      L.push("");
      L.push("Le moyen est libre — « par tout moyen ». La preuve, elle, incombe à celui");
      L.push("qui l'invoque : c'est pourquoi l'attestation ci-dessous est datée et");
      L.push("accompagnée de ses pièces.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Publicité accomplie : " + etat(ri.publicite, "oui", "NON"));
      L.push("Dépôt au greffe : " + etat(ri.depotGreffe, "oui", "NON"));
      L.push("Dernière des formalités de publicité et de dépôt : " +
        jour(ri.dateDerniereFormalite, "date non renseignée"));
      L.push("Date d'entrée en vigueur inscrite au règlement : " +
        jour(ri.dateEntreeVigueur, "date non renseignée"));
      L.push("");
      if (derniere && estISO(ri.dateEntreeVigueur)) {
        L.push("Le mois échoit le " + jour(plancher) + " : l'entrée en vigueur doit lui");
        L.push("être postérieure, soit le " + jour(minimum) + " au plus tôt.");
        L.push(ri.dateEntreeVigueur > plancher
          ? "La date inscrite au règlement (" + jour(ri.dateEntreeVigueur) + ") satisfait cette condition."
          : "La date inscrite au règlement (" + jour(ri.dateEntreeVigueur) + ") NE la satisfait PAS :");
        if (!(ri.dateEntreeVigueur > plancher)) {
          L.push("elle est antérieure au terme du mois. Reportez-la au " + jour(minimum) + " ou");
          L.push("au-delà, et refaites pour cette rectification les formalités de");
          L.push("L. 1321-4. Avant cette date, aucune sanction ne peut être fondée sur le");
          L.push("règlement.");
        }
      } else {
        L.push("Le dossier ne permet pas de calculer le terme à partir de vos dates.");
        L.push("Si la dernière des formalités de publicité et de dépôt était accomplie");
        L.push("aujourd'hui " + leJour(d0) + ", le mois échoirait le " + jour(plancher) + ",");
        L.push("et l'entrée en vigueur ne pourrait pas être antérieure au " +
          jour(minimum) + ".");
      }
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — ATTESTATION DE PUBLICITÉ");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("ATTESTATION DE PUBLICITÉ DU RÈGLEMENT INTÉRIEUR");
      L.push("");
      L.push("Je soussigné(e) " + cro(p.responsable, "nom et qualité") + ",");
      L.push("agissant en qualité de représentant légal de " + nomDe(ctx) + ",");
      L.push("atteste que le règlement intérieur de l'entreprise [ou : l'avenant n° ...]");
      L.push("a été porté à la connaissance des personnes ayant accès aux lieux de");
      L.push("travail et aux locaux où se fait l'embauche, en application de l'article");
      L.push("R. 1321-1 du code du travail, selon les modalités suivantes :");
      L.push("");
      L.push("  · moyen employé : [affichage sur les lieux de travail · affichage dans");
      L.push("    les locaux où se fait l'embauche · mise à disposition sur l'intranet ·");
      L.push("    remise à chaque salarié contre émargement · autre — préciser] ;");
      L.push("  · emplacements ou adresse exacte : [.....................] ;");
      L.push("  · date d'accomplissement : [DATE] ;");
      L.push("  · pièces jointes établissant cet accomplissement : [photographie datée");
      L.push("    de l'affichage · capture d'écran datée · liste d'émargement · autre].");
      L.push("");
      L.push("N'oubliez pas les LOCAUX OÙ SE FAIT L'EMBAUCHE : le texte les vise");
      L.push("expressément, à côté des lieux de travail, et c'est l'endroit que l'on");
      L.push("oublie.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — NOTE FIXANT LA DATE D'ENTRÉE EN VIGUEUR");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push("");
      L.push("NOTE — DATE D'ENTRÉE EN VIGUEUR DU RÈGLEMENT INTÉRIEUR");
      L.push("");
      L.push("Les formalités de publicité et de dépôt ont été accomplies aux dates");
      L.push("suivantes :");
      L.push("");
      L.push("  · publicité (R. 1321-1)                     : [DATE]");
      L.push("  · dépôt au greffe du conseil de prud'hommes");
      L.push("    du ressort (R. 1321-2)                    : [DATE]");
      L.push("  · communication à l'inspecteur du travail,");
      L.push("    en deux exemplaires, avec l'avis du comité");
      L.push("    (L. 1321-4 ; R. 1321-4)                   : [DATE]");
      L.push("");
      L.push("La dernière en date des formalités de PUBLICITÉ ET DE DÉPÔT — et d'elles");
      L.push("seules, R. 1321-3 ne visant que celles-là — est intervenue le " +
        jour(ri.dateDerniereFormalite, "DATE"));
      L.push(".");
      L.push("");
      L.push("Le délai d'un mois court de cette date. En conséquence, la date d'entrée");
      L.push("en vigueur du règlement intérieur est fixée au " +
        (derniere ? jour(minimum) : "[DATE — au plus tôt le lendemain du terme du mois]") + ".");
      L.push("");
      L.push("Cette date est inscrite dans le règlement lui-même : L. 1321-4 veut que");
      L.push("« le règlement intérieur indique la date de son entrée en vigueur ».");
      L.push("");
      L.push("Avant cette date, le règlement ne s'applique pas, et aucune sanction ne");
      L.push("peut être fondée sur lui.");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");

      return L.concat(pied("R. 1321-1, R. 1321-2, R. 1321-3, L. 1321-4, R. 1321-4",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — R. 1321-1, R. 1321-3 et L. 1321-4",
         "sont dans cette énumération."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-08 — LE DÉPÔT AU GREFFE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-08", {
    nom: "La lettre de dépôt au greffe du conseil de prud'hommes",
    detail: "La lettre au greffe du conseil du RESSORT, la demande de récépissé " +
            "et le calcul du mois qui suit la dernière formalité.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Dépôt du règlement intérieur au greffe du conseil de prud'hommes",
        "articles R. 1321-2 et R. 1321-3 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Le règlement intérieur est déposé, en application du deuxième alinéa de");
      L.push("l'article L. 1321-4, au greffe du conseil de prud'hommes du ressort de");
      L.push("l'entreprise ou de l'établissement » (R. 1321-2).");
      L.push("");
      L.push("Deux mots comptent. « DU RESSORT » : c'est le conseil dans le ressort");
      L.push("duquel se trouve l'entreprise ou l'établissement, et non celui du siège");
      L.push("social lorsque les deux diffèrent. « OU DE L'ÉTABLISSEMENT » : s'il existe");
      L.push("plusieurs établissements, regardez le ressort de chacun.");
      L.push("");
      L.push("Et « le délai prévu au deuxième alinéa de l'article L. 1321-4 court à");
      L.push("compter de la dernière en date des formalités de publicité et de dépôt »");
      L.push("(R. 1321-3) : tant que le dépôt n'est pas fait, le mois qui précède");
      L.push("l'entrée en vigueur n'a pas commencé de courir, et la date inscrite au");
      L.push("règlement ne vaut pas.");
      L.push("");
      L.push("Dans votre dossier : dépôt au greffe — " +
        etat(ri.depotGreffe, "déclaré accompli", "NON ACCOMPLI") + ".");
      L.push("Publicité — " + etat(ri.publicite, "déclarée accomplie", "non accomplie") + ".");
      L.push("");
      L.push(GROS);
      L.push("LETTRE DE DÉPÔT");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push(p.siret ? "SIRET " + p.siret : "[SIRET]");
      L.push("");
      L.push("Monsieur le Greffier en chef");
      L.push("Conseil de prud'hommes de [VILLE DU RESSORT DE L'ENTREPRISE OU DE");
      L.push("L'ÉTABLISSEMENT]");
      L.push("[adresse du greffe]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("— ou dépôt sur place contre récépissé —");
      L.push("");
      L.push("Objet : dépôt du règlement intérieur de " + nomDe(ctx));
      L.push("");
      L.push("Monsieur le Greffier en chef,");
      L.push("");
      L.push("En application de l'article R. 1321-2 du code du travail, je procède au");
      L.push("dépôt du règlement intérieur de " + nomDe(ctx) + " [ou : de l'avenant");
      L.push("n° ... à ce règlement] au greffe du conseil de prud'hommes du ressort de");
      L.push("l'entreprise [ou : de l'établissement de ...].");
      L.push("");
      L.push("Je vous serais reconnaissant de bien vouloir m'en délivrer récépissé daté.");
      L.push("C'est de la dernière en date des formalités de publicité et de dépôt que");
      L.push("court le délai d'un mois précédant l'entrée en vigueur (R. 1321-3) : la");
      L.push("date que portera votre récépissé est donc l'une des deux dates dont ce");
      L.push("délai dépend.");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur le Greffier en chef, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("Pièce jointe : règlement intérieur [ou avenant]");
      L.push("");
      L.push("");
      L.push("════ CE QU'IL FAUT FAIRE DU RÉCÉPISSÉ ════");
      L.push("");
      L.push("1. Conservez-le : sans pièce, la date du dépôt n'est qu'une déclaration.");
      L.push("2. Comparez sa date à celle de la publicité, et retenez LA PLUS TARDIVE");
      L.push("   des deux : c'est elle, et elle seule, qui fait courir le mois");
      L.push("   (R. 1321-3).");
      L.push("3. Rectifiez, s'il y a lieu, la date d'entrée en vigueur inscrite au");
      L.push("   règlement — et refaites pour cette rectification les formalités de");
      L.push("   L. 1321-4, qui s'appliquent également en cas de modification.");
      L.push("");
      if (estISO(ri.dateDerniereFormalite)) {
        L.push("Dans votre dossier, la dernière des deux formalités est datée du " +
          jour(ri.dateDerniereFormalite) + " :");
        L.push("le mois échoit le " + jour(moisApres(ri.dateDerniereFormalite, 1)) +
          ", et l'entrée en vigueur ne peut pas être");
        L.push("antérieure au " + jour(plusJours(moisApres(ri.dateDerniereFormalite, 1), 1)) + ".");
      } else {
        L.push("Si le dépôt était accompli aujourd'hui " + leJour(d0) + " et qu'il fût la");
        L.push("dernière des deux formalités, le mois échoirait le " +
          jour(moisApres(isoDe(d0), 1)) + ", et");
        L.push("l'entrée en vigueur ne pourrait pas être antérieure au " +
          jour(plusJours(moisApres(isoDe(d0), 1), 1)) + ".");
      }
      L.push("");

      return L.concat(pied("R. 1321-2, R. 1321-3, L. 1321-4",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — R. 1321-2 et R. 1321-3 sont dans",
         "cette énumération."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-09 — LA COMMUNICATION À L'INSPECTEUR DU TRAVAIL
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-09", {
    nom: "La lettre de transmission à l'inspecteur du travail, en deux exemplaires",
    detail: "La lettre, le bordereau des pièces — deux exemplaires du texte et " +
            "l'avis du comité — et ce qu'il faut faire d'une réponse.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Communication du règlement intérieur à l'inspecteur du travail",
        "articles L. 1321-4 et R. 1321-4 du code du travail");

      L.push("LES DEUX TEXTES, EN ENTIER");
      L.push("");
      L.push("« En même temps qu'il fait l'objet des mesures de publicité, le règlement");
      L.push("intérieur, accompagné de l'avis du comité social et économique, est");
      L.push("communiqué à l'inspecteur du travail » (L. 1321-4, troisième alinéa).");
      L.push("");
      L.push("« Le texte du règlement intérieur est transmis à l'inspecteur du travail");
      L.push("en deux exemplaires » (R. 1321-4).");
      L.push("");
      L.push("Trois exigences, donc, et elles se vérifient sur le bordereau : DEUX");
      L.push("exemplaires, l'AVIS DU COMITÉ joint, et EN MÊME TEMPS que la publicité.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Communication à l'inspection : " +
        etat(ri.communicationInspection, "déclarée faite", "NON FAITE"));
      L.push("En deux exemplaires : " +
        etat(ri.communicationDeuxExemplaires, "oui", "NON"));
      L.push("Avis du comité recueilli : " + etat(ri.avisCSE, "oui", "NON"));
      if (estNon(ri.avisCSE)) {
        L.push("");
        L.push("L'avis manque : il est la pièce que L. 1321-4 veut voir accompagner le");
        L.push("règlement. Recueillez-le avant d'envoyer — un envoi sans avis n'accomplit");
        L.push("pas la formalité.");
      }
      L.push("");
      L.push(GROS);
      L.push("LETTRE DE TRANSMISSION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push(p.siret ? "SIRET " + p.siret : "[SIRET]");
      L.push("");
      L.push("Monsieur l'Inspecteur du travail");
      L.push("[Unité de contrôle compétente pour l'établissement]");
      L.push("[adresse]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : communication du règlement intérieur de " + nomDe(ctx));
      L.push("");
      L.push("Monsieur l'Inspecteur,");
      L.push("");
      L.push("En application des articles L. 1321-4 et R. 1321-4 du code du travail, je");
      L.push("vous communique, EN DEUX EXEMPLAIRES, le texte du règlement intérieur de");
      L.push(nomDe(ctx) + " [ou : de l'avenant n° ... à ce règlement],");
      L.push("accompagné de l'avis rendu par le comité social et économique le [DATE DE");
      L.push("L'AVIS].");
      L.push("");
      L.push("Les mesures de publicité prévues à l'article R. 1321-1 ont été accomplies");
      L.push("le [DATE], et le dépôt au greffe du conseil de prud'hommes de [VILLE DU");
      L.push("RESSORT] le [DATE]. La présente communication est faite en même temps que");
      L.push("ces mesures, comme L. 1321-4 l'exige.");
      L.push("");
      L.push("La date d'entrée en vigueur inscrite au règlement est le [DATE],");
      L.push("postérieure d'un mois à la dernière en date des formalités de publicité et");
      L.push("de dépôt (L. 1321-4 ; R. 1321-3).");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur l'Inspecteur, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("Pièces jointes :");
      L.push("  · règlement intérieur [ou avenant] — DEUX exemplaires (R. 1321-4) ;");
      L.push("  · avis du comité social et économique du [DATE] (L. 1321-4) ;");
      L.push("  · [le cas échéant : justificatif de publicité et récépissé de dépôt].");
      L.push("");
      L.push("");
      L.push("════ CE QU'IL FAUT FAIRE ENSUITE ════");
      L.push("");
      L.push("1. Conservez la preuve d'envoi et sa date : L. 1321-4 veut que la");
      L.push("   communication soit faite en même temps que les mesures de publicité, et");
      L.push("   c'est la date qui l'établit.");
      L.push("");
      L.push("2. Traitez sans délai toute observation en retour. « L'inspecteur du");
      L.push("   travail peut à tout moment exiger le retrait ou la modification des");
      L.push("   dispositions contraires aux articles L. 1321-1 à L. 1321-3 et");
      L.push("   L. 1321-6 » (L. 1322-1). Sa décision est motivée, notifiée à");
      L.push("   l'employeur et communiquée pour information aux membres du comité");
      L.push("   social et économique (L. 1322-2). La seule voie ouverte contre elle est");
      L.push("   le recours hiérarchique (L. 1322-3) : l'inaction n'en est pas une.");
      L.push("");
      L.push("3. Une communication tardive se répare par un envoi — mais elle laisse,");
      L.push("   jusque-là, un texte que l'inspection n'a jamais vu.");
      L.push("");

      return L.concat(pied("L. 1321-4, R. 1321-4, R. 1321-1, R. 1321-2, R. 1321-3, " +
        "L. 1322-1, L. 1322-2, L. 1322-3",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — L. 1321-4 et R. 1321-4 sont dans",
         "cette énumération."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-10 — LA VERSION FRANÇAISE (L. 1321-6)
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-10", {
    nom: "La mise en français du règlement et des documents qui obligent le salarié",
    detail: "Le texte de L. 1321-6 en entier, le recensement des documents qu'il " +
            "atteint, et l'avenant qui établit la version française.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var L = entete(ctx, "Version française du règlement intérieur et des documents obligeant le salarié",
        "article L. 1321-6 du code du travail");

      L.push("LE TEXTE, EN ENTIER — ET IL EN DIT PLUS QU'ON NE CROIT");
      L.push("");
      L.push("« Le règlement intérieur est rédigé en français. Il peut être accompagné");
      L.push("de traductions en une ou plusieurs langues étrangères. Il en va de même");
      L.push("pour tout document comportant des obligations pour le salarié ou des");
      L.push("dispositions dont la connaissance est nécessaire pour l'exécution de son");
      L.push("travail. Ces dispositions ne sont pas applicables aux documents reçus de");
      L.push("l'étranger ou destinés à des étrangers » (L. 1321-6).");
      L.push("");
      L.push("Trois choses en sortent :");
      L.push("  · la version française FAIT FOI ; la traduction n'est qu'un");
      L.push("    accompagnement, jamais le texte de référence ;");
      L.push("  · l'exigence déborde le règlement intérieur : elle atteint TOUT document");
      L.push("    comportant des obligations pour le salarié, ou dont la connaissance");
      L.push("    est nécessaire à l'exécution de son travail ;");
      L.push("  · l'exception est étroite — les documents REÇUS DE L'ÉTRANGER ou");
      L.push("    DESTINÉS À DES ÉTRANGERS —, et elle ne s'étend pas au-delà.");
      L.push("");
      L.push("Dans votre dossier : règlement rédigé en français — " +
        etat(ri.redigeFrancais, "oui", "NON") + ".");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — RECENSEMENT DES DOCUMENTS ATTEINTS PAR L. 1321-6");
      L.push(GROS);
      L.push("");
      L.push("Une ligne par document. La colonne qui décide est la dernière.");
      L.push("");
      L.push("  Document | Ce qu'il oblige ou fait connaître | Langue | Version");
      L.push("           |                                   |        | française ?");
      L.push("  ---------|-----------------------------------|--------|-----------");
      L.push("  Règlement intérieur                          | [.....] | [oui/non]");
      L.push("  [consignes de sécurité]                      | [.....] | [oui/non]");
      L.push("  [charte informatique]                        | [.....] | [oui/non]");
      L.push("  [procédures et modes opératoires]            | [.....] | [oui/non]");
      L.push("  [notes de service]                           | [.....] | [oui/non]");
      L.push("  [fiches de poste, consignes d'atelier]       | [.....] | [oui/non]");
      L.push("  [.......................................]    | [.....] | [oui/non]");
      L.push("");
      L.push("Pour chaque ligne où la réponse est « non », établissez la version");
      L.push("française. Si vous invoquez l'exception, écrivez ici en quoi le document");
      L.push("est reçu de l'étranger ou destiné à des étrangers : [....................]");
      L.push("");
      L.push("Traductions en usage, et pour quels documents : [.....................]");
      L.push("Rappel : elles accompagnent, elles ne remplacent pas.");
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — AVENANT ÉTABLISSANT LA VERSION FRANÇAISE");
      L.push(GROS);
      L.push("");
      L.push("AVENANT N° [numéro] AU RÈGLEMENT INTÉRIEUR DE " + nomDe(ctx).toUpperCase());
      L.push("");
      L.push("Article 1 — Le règlement intérieur de " + nomDe(ctx) + " est établi en");
      L.push("langue française. La version française est seule opposable ; les");
      L.push("traductions éventuelles ne sont remises qu'à titre d'accompagnement");
      L.push("(L. 1321-6).");
      L.push("");
      L.push("Article 2 — Il en va de même de tout document comportant des obligations");
      L.push("pour le salarié ou des dispositions dont la connaissance est nécessaire à");
      L.push("l'exécution de son travail.");
      L.push("");
      L.push("Article 3 — Entrée en vigueur : le [DATE], postérieure d'un mois à la");
      L.push("dernière en date des formalités de publicité et de dépôt (L. 1321-4 ;");
      L.push("R. 1321-3).");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");

      L = L.concat(blocFormalites(ctx, "la version française"));
      L = L.concat(courrierCSE(ctx, "consultation sur un projet d'avenant — version française",
        ["L'article L. 1321-6 du code du travail impose que le règlement intérieur,",
         "et tout document comportant des obligations pour le salarié, soient",
         "rédigés en français. Le projet ci-joint établit cette version.",
         ""]));

      return L.concat(pied("L. 1321-6, L. 1321-4, L. 1322-1, R. 1321-1, R. 1321-2, " +
        "R. 1321-3, R. 1321-4",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — L. 1321-6 est dans cette",
         "énumération. L'inspecteur du travail peut en outre exiger à tout moment le",
         "retrait ou la modification des dispositions contraires à L. 1321-6",
         "(L. 1322-1)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-11 — MODIFICATIONS ET NOTES DE SERVICE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-11", {
    nom: "Le récapitulatif daté des modifications et des notes de service",
    detail: "Le tableau des quatre formalités, modification par modification et " +
            "note par note, et la règle de l'urgence en santé-sécurité.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Récapitulatif des modifications du règlement intérieur et des notes de service",
        "articles L. 1321-4 et L. 1321-5 du code du travail");

      L.push("POURQUOI UNE NOTE DE SERVICE N'ÉCHAPPE PAS À LA RÈGLE");
      L.push("");
      L.push("« Les notes de service ou tout autre document comportant des obligations");
      L.push("générales et permanentes dans les matières mentionnées aux articles");
      L.push("L. 1321-1 et L. 1321-2 sont, lorsqu'il existe un règlement intérieur,");
      L.push("considérées comme des adjonctions à celui-ci. Ils sont, en toute");
      L.push("hypothèse, soumis aux dispositions du présent titre. Toutefois, lorsque");
      L.push("l'urgence le justifie, les obligations relatives à la santé et à la");
      L.push("sécurité peuvent recevoir application immédiate. Dans ce cas, ces");
      L.push("prescriptions sont immédiatement et simultanément communiquées au");
      L.push("secrétaire du comité social et économique ainsi qu'à l'inspection du");
      L.push("travail » (L. 1321-5).");
      L.push("");
      L.push("Et L. 1321-4 finit ainsi : « Ces dispositions s'appliquent également en");
      L.push("cas de modification ou de retrait des clauses du règlement intérieur. »");
      L.push("");
      L.push("Autrement dit : changer de nom ne change pas de régime. Ce qui compte est");
      L.push("que le document porte des obligations GÉNÉRALES ET PERMANENTES dans les");
      L.push("matières de L. 1321-1 et L. 1321-2 — santé et sécurité, participation au");
      L.push("rétablissement de conditions protectrices, discipline, et les rappels de");
      L.push("L. 1321-2. Une note qui les porte est une adjonction au règlement.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Clauses modifiées ou retirées depuis l'introduction : " +
        etat(ri.modifieDepuis, "OUI", "non"));
      if (estOui(ri.modifieDepuis))
        L.push("Ces modifications ont suivi les mêmes formalités : " +
          etat(ri.modificationsFormalites, "oui", "NON"));
      L.push("Notes de service à obligations générales et permanentes : " +
        etat(ri.notesServiceGenerales, "OUI", "non"));
      if (estOui(ri.notesServiceGenerales))
        L.push("Ces notes ont été soumises aux formalités du titre : " +
          etat(ri.notesServiceFormalites, "oui", "NON"));
      L.push("");
      L.push(GROS);
      L.push("TABLEAU — UNE LIGNE PAR MODIFICATION ET PAR NOTE DE SERVICE");
      L.push(GROS);
      L.push("");
      L.push("Remplissez les quatre dates. Une case vide est une formalité manquante,");
      L.push("et une formalité manquante est une adjonction irrégulièrement introduite.");
      L.push("");
      L.push("  N° | Objet (clause modifiée, retirée, | Date du | Avis  | Publi- | Dépôt | Inspec-");
      L.push("     | ou note de service)              | texte   | CSE   | cité   | greffe| tion");
      L.push("  ---|----------------------------------|---------|-------|--------|-------|-------");
      L.push("   1 | [.............................]  | [.....] |[.....]|[......]|[.....]|[.....]");
      L.push("   2 | [.............................]  | [.....] |[.....]|[......]|[.....]|[.....]");
      L.push("   3 | [.............................]  | [.....] |[.....]|[......]|[.....]|[.....]");
      L.push("   4 | [.............................]  | [.....] |[.....]|[......]|[.....]|[.....]");
      L.push("   5 | [.............................]  | [.....] |[.....]|[......]|[.....]|[.....]");
      L.push("");
      L.push("  [AJOUTER AUTANT DE LIGNES QU'IL Y A DE TEXTES. Recensez depuis");
      L.push("   l'introduction du règlement intérieur, le " +
        jour(ri.dateEntreeVigueur, "date d'entrée en vigueur") + ".]");
      L.push("");
      L.push("Colonnes, et leur fondement :");
      L.push("  · Avis CSE     — L. 1321-4, premier alinéa ;");
      L.push("  · Publicité    — R. 1321-1 ;");
      L.push("  · Dépôt greffe — R. 1321-2 ;");
      L.push("  · Inspection   — L. 1321-4, troisième alinéa, et R. 1321-4 (deux");
      L.push("    exemplaires, avec l'avis du comité).");
      L.push("");
      L.push("Une entrée en vigueur ne peut être fixée qu'un mois après la dernière en");
      L.push("date des formalités de publicité et de dépôt (R. 1321-3), texte par texte.");
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("LA SEULE EXCEPTION : L'URGENCE EN SANTÉ ET SÉCURITÉ");
      L.push(GROS);
      L.push("");
      L.push("L. 1321-5 ne l'ouvre que pour les obligations RELATIVES À LA SANTÉ ET À LA");
      L.push("SÉCURITÉ, et seulement LORSQUE L'URGENCE LE JUSTIFIE. Elle ne dispense de");
      L.push("rien : elle décale. Les prescriptions sont alors « immédiatement et");
      L.push("simultanément communiquées au secrétaire du comité social et économique");
      L.push("ainsi qu'à l'inspection du travail ».");
      L.push("");
      L.push("Si vous l'invoquez, écrivez-le sur la note elle-même :");
      L.push("");
      L.push("  « La présente note reçoit application immédiate en application de");
      L.push("  l'article L. 1321-5 du code du travail, l'urgence le justifiant pour le");
      L.push("  motif suivant : [ÉCRIRE L'URGENCE — quel risque, constaté quand, par");
      L.push("  qui]. Elle est communiquée ce jour, simultanément, au secrétaire du");
      L.push("  comité social et économique et à l'inspection du travail. »");
      L.push("");
      L.push("Puis accomplissez les formalités du titre : l'application immédiate ne");
      L.push("les efface pas.");
      L.push("");
      L.push("");
      L.push("════ CE QU'IL RESTE À FAIRE ════");
      L.push("");
      L.push("Pour chaque ligne du tableau dont une case est vide : reprenez le texte,");
      L.push("soumettez-le à l'avis du comité, puis accomplissez publicité, dépôt et");
      L.push("communication. Si la reprise commençait aujourd'hui " + leJour(d0) + ",");
      L.push("et que les trois dernières formalités soient accomplies le jour de l'avis,");
      L.push("l'entrée en vigueur ne pourrait pas être antérieure au " +
        jour(plusJours(moisApres(isoDe(d0), 1), 1)) + ".");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");

      return L.concat(pied("L. 1321-4, L. 1321-5, L. 1321-1, L. 1321-2, R. 1321-1, " +
        "R. 1321-2, R. 1321-3, R. 1321-4",
        ["Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1) — L. 1321-4 et L. 1321-5 sont dans",
         "cette énumération. Et la modification soustraite à l'avis du comité expose",
         "à l'amende de 7 500 € que L. 2317-1 attache à l'entrave au fonctionnement",
         "régulier du comité, qualification qu'il appartient au juge de retenir ou",
         "d'écarter."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-RI-12 — LA DEMANDE DE L'INSPECTEUR DU TRAVAIL
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-RI-12", {
    nom: "La suite à donner à la demande de l'inspecteur du travail",
    detail: "Le relevé de ce que la décision vise, l'avenant de retrait ou de " +
            "modification, la lettre à l'inspecteur — et, si c'est la voie " +
            "choisie, le recours hiérarchique de L. 1322-3.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Suite donnée à la demande de l'inspecteur du travail",
        "articles L. 1322-1, L. 1322-2 et L. 1322-3 du code du travail");

      L.push("LES TROIS TEXTES, EN ENTIER");
      L.push("");
      L.push("« L'inspecteur du travail peut à tout moment exiger le retrait ou la");
      L.push("modification des dispositions contraires aux articles L. 1321-1 à");
      L.push("L. 1321-3 et L. 1321-6 » (L. 1322-1).");
      L.push("");
      L.push("« La décision de l'inspecteur du travail est motivée. Elle est notifiée à");
      L.push("l'employeur et communiquée, pour information, aux membres du comité social");
      L.push("et économique » (L. 1322-2).");
      L.push("");
      L.push("« La décision de l'inspecteur du travail peut faire l'objet d'un recours");
      L.push("hiérarchique, dans des conditions déterminées par voie réglementaire. La");
      L.push("décision prise sur ce recours est notifiée à l'employeur et communiquée,");
      L.push("pour information, aux membres du comité social et économique »");
      L.push("(L. 1322-3).");
      L.push("");
      L.push("Deux voies, et deux seulement : exécuter, ou former le recours");
      L.push("hiérarchique. Ne rien faire n'en est pas une — la décision reste, et la");
      L.push("clause aussi.");
      L.push("");
      L.push("Dans votre dossier : demande de l'inspecteur — " +
        etat(ri.demandeInspection, "OUI", "non") + " ; suivie d'effet — " +
        etat(ri.suiteDemandeInspection, "oui", "NON") + ".");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — RELEVÉ DE CE QUE LA DÉCISION VISE");
      L.push(GROS);
      L.push("");
      L.push("La décision est motivée : c'est sa motivation qui délimite exactement ce");
      L.push("qu'il faut retirer ou modifier — ni moins, ni plus.");
      L.push("");
      L.push("  Décision de l'inspecteur du travail du [DATE], reçue le [DATE]");
      L.push("  Référence : [numéro ou objet]");
      L.push("");
      L.push("  Disposition visée n° 1 : article [numéro] du règlement intérieur");
      L.push("    · ce que la décision reproche : [.............................]");
      L.push("    · article du code qu'elle invoque : [L. 1321-1 / L. 1321-2 /");
      L.push("      L. 1321-3 / L. 1321-6 — L. 1322-1 ne permet d'exiger le retrait ou");
      L.push("      la modification que des dispositions contraires à ces articles]");
      L.push("    · retrait exigé  [ ]     modification exigée  [ ]");
      L.push("");
      L.push("  [REPRODUIRE POUR CHAQUE DISPOSITION VISÉE.]");
      L.push("");
      L.push("  Vérification : la décision a-t-elle été communiquée, pour information,");
      L.push("  aux membres du comité social et économique (L. 1322-2) ? [oui / non]");
      L.push("  Si non, cette communication incombe à l'inspecteur ; mais le comité est");
      L.push("  de toute façon consulté sur l'avenant qui suit.");
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — LA VOIE CHOISIE, DATÉE ET ÉCRITE");
      L.push(GROS);
      L.push("");
      L.push("  [ ] EXÉCUTION — le retrait ou la modification est opéré par l'avenant");
      L.push("      qui suit (pièce 3), et l'inspecteur en est informé (pièce 4).");
      L.push("");
      L.push("  [ ] RECOURS HIÉRARCHIQUE (L. 1322-3) — formé le [DATE], auprès de");
      L.push("      [autorité hiérarchique]. Le texte ouvre ce recours « dans des");
      L.push("      conditions déterminées par voie réglementaire » : l'application n'a");
      L.push("      pas lu ces conditions à la source et ne les écrit donc pas ici.");
      L.push("      Vérifiez le délai et la forme avant de l'exercer, et formez-le sans");
      L.push("      attendre.");
      L.push("");
      L.push("Choisissez une voie et une seule, datez ce choix, et conservez cet écrit.");
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 3 — AVENANT DE RETRAIT OU DE MODIFICATION");
      L.push(GROS);
      L.push("");
      L.push("AVENANT N° [numéro] AU RÈGLEMENT INTÉRIEUR DE " + nomDe(ctx).toUpperCase());
      L.push("");
      L.push("Vu la décision de l'inspecteur du travail du [DATE], notifiée le [DATE],");
      L.push("exigeant, sur le fondement de l'article L. 1322-1 du code du travail, le");
      L.push("retrait ou la modification des dispositions ci-après ;");
      L.push("");
      L.push("Article 1 — L'article [numéro] du règlement intérieur est RETIRÉ.");
      L.push("");
      L.push("Article 2 — L'article [numéro] du règlement intérieur est MODIFIÉ et");
      L.push("rédigé comme suit :");
      L.push("  « [NOUVELLE RÉDACTION — elle doit répondre exactement à ce que la");
      L.push("  décision reproche. Si le reproche portait sur une restriction non");
      L.push("  justifiée ou disproportionnée (L. 1321-3, 2°), écrivez dans la clause");
      L.push("  elle-même la nature de la tâche qui la justifie et ce qui la limite au");
      L.push("  but recherché.] »");
      L.push("");
      L.push("Article 3 — Entrée en vigueur : le [DATE], postérieure d'un mois à la");
      L.push("dernière en date des formalités de publicité et de dépôt (L. 1321-4 ;");
      L.push("R. 1321-3).");
      L.push("");
      L.push("Fait à " + cro(p.ville, "lieu") + ", le [DATE DE SIGNATURE]");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du représentant légal"));
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 4 — LETTRE INFORMANT L'INSPECTEUR DE LA SUITE DONNÉE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push(cro(p.adresse, "adresse du siège"));
      L.push("");
      L.push("Monsieur l'Inspecteur du travail");
      L.push("[Unité de contrôle compétente]");
      L.push("");
      L.push(cro(p.ville, "lieu") + ", le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : suite donnée à votre décision du [DATE] — règlement intérieur de " +
        nomDe(ctx));
      L.push("");
      L.push("Monsieur l'Inspecteur,");
      L.push("");
      L.push("Par décision motivée du [DATE], notifiée le [DATE], vous avez exigé, sur");
      L.push("le fondement de l'article L. 1322-1 du code du travail, le retrait [ou la");
      L.push("modification] des dispositions suivantes du règlement intérieur de");
      L.push("l'entreprise : [énumérer les articles visés].");
      L.push("");
      L.push("J'ai l'honneur de vous informer qu'il y a été procédé par l'avenant n° ...");
      L.push("ci-joint, soumis à l'avis du comité social et économique le [DATE], porté");
      L.push("à la connaissance du personnel le [DATE] et déposé au greffe du conseil de");
      L.push("prud'hommes de [VILLE] le [DATE]. Le présent envoi vaut communication de");
      L.push("cet avenant en deux exemplaires, accompagné de l'avis du comité");
      L.push("(L. 1321-4 ; R. 1321-4).");
      L.push("");
      L.push("Je vous prie d'agréer, Monsieur l'Inspecteur, l'expression de ma");
      L.push("considération distinguée.");
      L.push("");
      L.push(cro(p.responsable, "Nom et qualité du signataire"));
      L.push("");
      L.push("Pièces jointes : avenant (2 exemplaires) · avis du comité social et");
      L.push("économique · justificatif de publicité · récépissé de dépôt");
      L.push("");
      L.push("");

      L = L.concat(blocFormalites(ctx, "l'avenant"));
      L = L.concat(courrierCSE(ctx, "consultation sur un projet d'avenant — décision de l'inspecteur du travail",
        ["Par décision motivée du [DATE], l'inspecteur du travail a exigé, sur le",
         "fondement de l'article L. 1322-1 du code du travail, le retrait ou la",
         "modification de dispositions du règlement intérieur. Cette décision vous",
         "est communiquée pour information (L. 1322-2). Le projet d'avenant ci-joint",
         "en tire les conséquences.",
         ""]));

      return L.concat(pied("L. 1322-1, L. 1322-2, L. 1322-3, L. 1321-4, R. 1321-1, " +
        "R. 1321-2, R. 1321-3, R. 1321-4",
        ["Les conditions du recours hiérarchique sont renvoyées par L. 1322-3 à un",
         "texte réglementaire que ce module n'a pas lu à la source : il ne les",
         "écrit pas.",
         "Sur le terrain pénal : « le fait de méconnaître les dispositions des",
         "articles L. 1311-2 à L. 1322-4 et R. 1321-1 à R. 1321-5 relatives au",
         "règlement intérieur, est puni de l'amende prévue pour les contraventions",
         "de la quatrième classe » (R. 1323-1), dont l'énumération court jusqu'à",
         "L. 1322-4."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-01 — L'ÉCRIT D'ÉNONCIATION DES GRIEFS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-01", {
    nom: "L'écrit qui énonce les griefs — et, s'il a manqué, le retrait de la sanction",
    detail: "L. 1332-1 exige l'information écrite « dans le même temps » : un écrit " +
            "postérieur ne répare pas. Le document porte donc le retrait, puis " +
            "l'écrit d'une procédure reprise.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, s = f.sanction || {};
      var L = entete(ctx, "Information écrite des griefs retenus contre le salarié",
        "articles L. 1332-1 et L. 1331-1 du code du travail");

      L.push("LES DEUX TEXTES, EN ENTIER");
      L.push("");
      L.push("« Aucune sanction ne peut être prise à l'encontre du salarié sans que");
      L.push("celui-ci soit informé, dans le même temps et par écrit, des griefs retenus");
      L.push("contre lui » (L. 1332-1).");
      L.push("");
      L.push("« Constitue une sanction toute mesure, autre que les observations");
      L.push("verbales, prise par l'employeur à la suite d'un agissement du salarié");
      L.push("considéré par l'employeur comme fautif, que cette mesure soit de nature à");
      L.push("affecter immédiatement ou non la présence du salarié dans l'entreprise, sa");
      L.push("fonction, sa carrière ou sa rémunération » (L. 1331-1).");
      L.push("");
      L.push("Trois conséquences, et la troisième est celle que l'on manque :");
      L.push("  · l'exigence vaut pour TOUTE sanction au sens de L. 1331-1 — toute mesure");
      L.push("    autre que les observations verbales. L'avertissement et le blâme en");
      L.push("    sont, et ils ne bénéficient pas ici de l'exception que L. 1332-2");
      L.push("    réserve à la convocation : celle-ci dispense de l'entretien, jamais de");
      L.push("    l'écrit ;");
      L.push("  · l'information porte sur les GRIEFS — les faits reprochés —, non sur");
      L.push("    l'existence d'une procédure ;");
      L.push("  · elle est donnée « DANS LE MÊME TEMPS » que la sanction. Un écrit");
      L.push("    postérieur ne rétablit pas ce simultané : une sanction prise sans");
      L.push("    écrit ne se complète pas, elle se retire.");
      L.push("");
      L.push("Dans votre dossier : sanction déclarée — " +
        (s.nature ? s.nature : "[nature non renseignée]") +
        " ; information écrite des griefs — " + etat(s.griefsEcrits, "oui", "NON") + ".");
      L.push("");

      if (estNon(s.griefsEcrits)) {
        L.push(GROS);
        L.push("PIÈCE 1 — RETRAIT DE LA SANCTION PRISE SANS ÉCRIT");
        L.push(GROS);
        L.push("");
        L.push("À remettre avant toute reprise : c'est le retrait, et non un écrit");
        L.push("rétroactif, qui met fin à l'irrégularité.");
        L.push("");
        L = L.concat(teteLettre(ctx, true));
        L.push("Objet : retrait de la mesure notifiée le " +
          jour(s.dateNotification, "date de la notification"));
        L.push("");
        L.push("Madame, Monsieur,");
        L.push("");
        L.push("Par [lettre / décision] du " + jour(s.dateNotification, "date") +
          ", il vous a été notifié");
        L.push("[rappeler la mesure : " + (s.nature || "[nature de la mesure]") + "].");
        L.push("");
        L.push("L'article L. 1332-1 du code du travail dispose qu'aucune sanction ne peut");
        L.push("être prise à l'encontre du salarié sans que celui-ci soit informé, dans");
        L.push("le même temps et par écrit, des griefs retenus contre lui. Cette");
        L.push("information ne vous ayant pas été donnée dans les conditions qu'exige ce");
        L.push("texte, je retire cette mesure.");
        L.push("");
        L.push("Elle est réputée n'avoir jamais été prononcée. Toute mention en sera");
        L.push("supprimée de votre dossier individuel[, et les conséquences qu'elle a");
        L.push("emportées sur votre rémunération seront régularisées sur la prochaine");
        L.push("paie].");
        L.push("");
        L = L.concat(signature(ctx));
        L.push("");
      }

      L.push(GROS);
      L.push((estNon(s.griefsEcrits) ? "PIÈCE 2" : "PIÈCE 1") +
        " — ÉCRIT D'ÉNONCIATION DES GRIEFS");
      L.push(GROS);
      L.push("");
      L.push("Cet écrit se remet AVANT ou EN MÊME TEMPS que la sanction, jamais après.");
      L.push("Selon la sanction envisagée, il prend l'une de ces deux formes :");
      L.push("  · si un entretien préalable est dû, les griefs sont énoncés dans la");
      L.push("    lettre de notification, motivée, qui suit l'entretien (L. 1332-2 ;");
      L.push("    R. 1332-2) ;");
      L.push("  · si aucun entretien n'est dû — avertissement, ou sanction de même");
      L.push("    nature sans incidence —, la lettre ci-dessous est à la fois");
      L.push("    l'énonciation des griefs et la sanction elle-même.");
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : griefs retenus à votre encontre");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L = L.concat(blocGriefs("Je vous informe des griefs retenus contre vous."));
      L.push("[Le cas échéant, préciser : les pièces sur lesquelles ces griefs se");
      L.push(" fondent, et les règles auxquelles les faits contreviennent — article du");
      L.push(" règlement intérieur, consigne, instruction.]");
      L.push("");
      L.push("[Choisir l'une des deux suites :");
      L.push(" — soit : Ces faits me conduisent à vous notifier [SANCTION, telle qu'elle");
      L.push("   est nommée dans l'échelle du règlement intérieur].");
      L.push(" — soit : Ces faits me conduisent à envisager une sanction. Vous êtes");
      L.push("   convoqué à un entretien préalable dont l'objet, la date, l'heure et le");
      L.push("   lieu vous sont précisés par la lettre jointe, qui rappelle également");
      L.push("   votre faculté d'être assisté.]");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("Remise : contre récépissé daté et signé, ou par lettre recommandée avec");
      L.push("demande d'avis de réception. Conservez la preuve : c'est cette pièce, et");
      L.push("non le souvenir d'un entretien, qui établit l'information.");
      L.push("");
      L.push("");

      L = L.concat(blocPrescription(ctx));
      L = L.concat(blocProtege(ctx));

      return L.concat(pied("L. 1332-1, L. 1331-1, L. 1332-2, L. 1332-4, R. 1332-1, " +
        "R. 1332-2, L. 1333-2",
        ["Ce qui se joue ici n'est pas une peine : aucun texte pénal capté par ce",
         "module n'atteint la procédure disciplinaire. Ce qui se joue est",
         "l'annulation : « le conseil de prud'hommes peut annuler une sanction",
         "irrégulière en la forme ou injustifiée ou disproportionnée à la faute",
         "commise » (L. 1333-2)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-02 — LA SANCTION PÉCUNIAIRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-02", {
    nom: "Le retrait de la sanction pécuniaire et la régularisation de paie",
    detail: "La note de retrait, la lettre au salarié, la consigne de paie et " +
            "la purge des stipulations qui la prévoyaient.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, s = f.sanction || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Retrait de la sanction pécuniaire et régularisation de la paie",
        "article L. 1331-2 du code du travail");

      L.push("LE TEXTE, EN ENTIER — IL TIENT EN DEUX PHRASES");
      L.push("");
      L.push("« Les amendes ou autres sanctions pécuniaires sont interdites. Toute");
      L.push("disposition ou stipulation contraire est réputée non écrite » (L. 1331-2).");
      L.push("");
      L.push("L'interdiction est absolue : ni le contrat, ni le règlement intérieur, ni");
      L.push("un accord ne peuvent y déroger — ce qui les prévoirait est réputé non");
      L.push("écrit. C'est en outre la seule interdiction de ce chapitre que le code");
      L.push("assortit d'une peine : « le fait d'infliger une amende ou une sanction");
      L.push("pécuniaire en méconnaissance des dispositions de l'article L. 1331-2 est");
      L.push("puni d'une amende de 3 750 euros » (L. 1334-1).");
      L.push("");
      L.push("CE QUI EST UNE SANCTION PÉCUNIAIRE, ET CE QUI N'EN EST PAS");
      L.push("");
      L.push("En est une, quelle que soit sa dénomination : l'amende, la pénalité, la");
      L.push("retenue opérée à titre de sanction, la suppression ou la réduction d'une");
      L.push("prime prononcée à raison d'un agissement considéré comme fautif.");
      L.push("");
      L.push("N'en est pas une : la perte de rémunération correspondant à une mise à");
      L.push("pied disciplinaire RÉGULIÈREMENT prononcée. Elle n'est pas une sanction");
      L.push("pécuniaire mais la conséquence de la suspension du contrat pendant les");
      L.push("jours de mise à pied. La distinction se vérifie sur deux points : les");
      L.push("jours retenus sont-ils exactement les jours de mise à pied prononcés, et");
      L.push("la mise à pied elle-même était-elle régulière ?");
      L.push("");
      L.push("Dans votre dossier : retenue sur la rémunération étrangère à une");
      L.push("suspension du contrat — " + etat(s.retenueSalaire, "OUI", "non") +
        " ; nature déclarée de la");
      L.push("sanction — " + (s.nature ? s.nature : "[non renseignée]") + ".");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — NOTE DE RETRAIT (interne)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push("NOTE — RETRAIT D'UNE SANCTION PÉCUNIAIRE");
      L.push("Établie le " + leJour(d0));
      L.push("");
      L.push("1. Mesure identifiée : [amende / pénalité / retenue / suppression de");
      L.push("   prime — écrire la dénomination employée], notifiée le " +
        jour(s.dateNotification, "date") + ",");
      L.push("   d'un montant de [MONTANT] euros.");
      L.push("");
      L.push("2. Qualification : cette mesure affecte la rémunération à raison d'un");
      L.push("   agissement considéré comme fautif, sans correspondre à une suspension");
      L.push("   du contrat de travail. Elle constitue une sanction pécuniaire au sens");
      L.push("   de L. 1331-2, et elle est interdite.");
      L.push("");
      L.push("3. Décision : la mesure est RETIRÉE. La somme retenue est restituée sur la");
      L.push("   paie de [MOIS], sous une ligne de régularisation identifiable");
      L.push("   [intitulé retenu : « régularisation — retenue indue »].");
      L.push("");
      L.push("4. Purge : sont retirées, dans les textes suivants, les stipulations qui");
      L.push("   prévoyaient une telle mesure — L. 1331-2 les répute non écrites, mais");
      L.push("   les laisser figurer entretient la pratique :");
      L.push("     · règlement intérieur, article(s) [numéro(s)] ;");
      L.push("     · contrats de travail, clause [référence] ;");
      L.push("     · notes de service [références].");
      L.push("   Le retrait d'une clause du règlement intérieur suit les formalités de");
      L.push("   L. 1321-4 : avis du comité social et économique, publicité, dépôt au");
      L.push("   greffe, communication à l'inspection.");
      L.push("");
      L.push("5. Consigne de paie transmise le [DATE] à [service ou prestataire].");
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE AU SALARIÉ");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : retrait d'une retenue et régularisation de votre rémunération");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Une somme de [MONTANT] euros a été retenue sur votre rémunération du mois");
      L.push("de [MOIS], au titre de [dénomination employée].");
      L.push("");
      L.push("L'article L. 1331-2 du code du travail dispose que « les amendes ou autres");
      L.push("sanctions pécuniaires sont interdites » et que « toute disposition ou");
      L.push("stipulation contraire est réputée non écrite ». Cette mesure est en");
      L.push("conséquence retirée.");
      L.push("");
      L.push("La somme retenue vous sera restituée sur votre paie de [MOIS], sous une");
      L.push("ligne de régularisation distincte. Toute mention de cette mesure est");
      L.push("supprimée de votre dossier individuel.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");
      L.push("════ CE QU'IL RESTE À VÉRIFIER ════");
      L.push("");
      L.push("· Sur le bulletin qui portait la retenue : la période visée, le libellé, le");
      L.push("  montant. Confrontez-les aux jours de mise à pied effectivement prononcés");
      L.push("  s'il y en a eu — au-delà de ces jours, la retenue n'a plus de support");
      L.push("  disciplinaire.");
      L.push("· Le retrait de la mesure pécuniaire ne préjuge pas des faits : si les");
      L.push("  faits justifient une sanction, elle se prend dans l'échelle du règlement");
      L.push("  intérieur et par une procédure régulière, sous réserve du délai de deux");
      L.push("  mois de L. 1332-4.");
      L.push("");

      L = L.concat(blocPrescription(ctx));
      L = L.concat(blocProtege(ctx));

      return L.concat(pied("L. 1331-2, L. 1334-1, L. 1331-1, L. 1333-2, L. 1321-4, L. 1332-4",
        ["« Le fait d'infliger une amende ou une sanction pécuniaire en",
         "méconnaissance des dispositions de l'article L. 1331-2 est puni d'une",
         "amende de 3 750 euros » (L. 1334-1) : c'est la seule peine que le chapitre",
         "de la discipline attache à un manquement, et elle ne vise que L. 1331-2.",
         "Le conseil de prud'hommes peut par ailleurs annuler la sanction",
         "(L. 1333-2), et la somme retenue reste due."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-03 — LA SANCTION NON PRÉVUE PAR LE RÈGLEMENT INTÉRIEUR
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-03", {
    nom: "Le retrait de la sanction que le règlement intérieur ne prévoit pas",
    detail: "La note de retrait, la lettre au salarié, et ce qui peut être " +
            "repris — une échelle complétée ne rétroagit pas.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, s = f.sanction || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Retrait d'une sanction non prévue par le règlement intérieur",
        "articles L. 1321-1, 3°, et L. 1311-2 du code du travail");

      L.push("LA RÈGLE, ET D'OÙ ELLE VIENT");
      L.push("");
      L.push("L'article L. 1321-1, 3°, réserve au règlement intérieur « les règles");
      L.push("générales et permanentes relatives à la discipline, notamment la nature et");
      L.push("l'échelle des sanctions que peut prendre l'employeur ». L'article");
      L.push("L. 1311-2 rend ce règlement obligatoire dans les entreprises ou");
      L.push("établissements employant au moins cinquante salariés.");
      L.push("");
      L.push("La conséquence que l'audit applique : chez l'employeur tenu d'établir un");
      L.push("règlement intérieur, une sanction autre que le licenciement ne peut être");
      L.push("prononcée que si elle y est prévue. À défaut, elle est irrégulière, et");
      L.push("« le conseil de prud'hommes peut annuler une sanction irrégulière en la");
      L.push("forme ou injustifiée ou disproportionnée à la faute commise » (L. 1333-2).");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("Sanction prononcée : " + (s.nature ? s.nature : "[nature non renseignée]"));
      L.push("Figure dans l'échelle du règlement intérieur : " +
        etat(s.prevueRI, "oui", "NON"));
      L.push("Échelle des sanctions fixée au règlement : " +
        etat(ri.echelleSanctions, "oui", "NON"));
      L.push("Effectif déclaré : " +
        (f.effectif != null && f.effectif !== "" ? f.effectif + " salariés" : "[non renseigné]"));
      L.push("");
      L.push("PREMIER RÉFLEXE : LA BONNE VERSION DU RÈGLEMENT");
      L.push("");
      L.push("Prenez le règlement intérieur DANS LA VERSION EN VIGUEUR À LA DATE DE LA");
      L.push("SANCTION — et non dans celle d'aujourd'hui. C'est elle qui s'applique.");
      L.push("");
      L.push("  · date de la sanction               : " + jour(s.dateNotification, "date"));
      L.push("  · version applicable, entrée en");
      L.push("    vigueur le                        : " +
        jour(ri.dateEntreeVigueur, "date d'entrée en vigueur"));
      L.push("  · article de l'échelle où la sanction");
      L.push("    figure, s'il existe               : [numéro, ou : elle n'y figure pas]");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — NOTE DE RETRAIT (interne)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push("NOTE — RETRAIT D'UNE SANCTION NON PRÉVUE PAR LE RÈGLEMENT INTÉRIEUR");
      L.push("Établie le " + leJour(d0));
      L.push("");
      L.push("1. Sanction concernée : " + (s.nature ? s.nature : "[nature]") +
        ", notifiée le " + jour(s.dateNotification, "date") + ".");
      L.push("");
      L.push("2. Constat : l'échelle des sanctions du règlement intérieur en vigueur à");
      L.push("   cette date [ne comporte pas cette sanction / n'existe pas]. Or la");
      L.push("   nature et l'échelle des sanctions sont ce que L. 1321-1, 3°, réserve au");
      L.push("   règlement intérieur.");
      L.push("");
      L.push("3. Décision : la sanction est RETIRÉE. Elle est réputée n'avoir jamais été");
      L.push("   prononcée ; toute mention en est supprimée du dossier individuel du");
      L.push("   salarié, et ses effets sur la rémunération sont régularisés.");
      L.push("");
      L.push("4. Examen d'une reprise : l'échelle telle qu'elle est écrite comporte-t-elle");
      L.push("   une sanction adaptée aux faits ? [oui — laquelle : ......... / non].");
      L.push("   Si oui, une procédure régulière peut être reprise, sous réserve du délai");
      L.push("   de deux mois de L. 1332-4 rappelé plus bas.");
      L.push("");
      L.push("5. Pour l'avenir : compléter l'échelle par un avenant au règlement");
      L.push("   intérieur, avec l'avis du comité social et économique et les formalités");
      L.push("   de L. 1321-4. UNE ÉCHELLE COMPLÉTÉE NE RÉTROAGIT PAS : elle ne rendra");
      L.push("   pas régulière la sanction retirée ci-dessus.");
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE AU SALARIÉ");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : retrait de la sanction notifiée le " +
        jour(s.dateNotification, "date de la notification"));
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par lettre du " + jour(s.dateNotification, "date") +
        ", il vous a été notifié [rappeler la");
      L.push("sanction : " + (s.nature || "[nature]") + "].");
      L.push("");
      L.push("Après réexamen, il apparaît que cette sanction ne figure pas dans");
      L.push("l'échelle des sanctions du règlement intérieur applicable à cette date.");
      L.push("Je la retire en conséquence.");
      L.push("");
      L.push("Elle est réputée n'avoir jamais été prononcée. Toute mention en sera");
      L.push("supprimée de votre dossier individuel[, et ses effets sur votre");
      L.push("rémunération seront régularisés sur la prochaine paie].");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L = L.concat(blocPrescription(ctx));
      L = L.concat(blocProtege(ctx));

      return L.concat(pied("L. 1321-1, 3°, L. 1311-2, L. 1333-2, L. 1321-4, L. 1332-4",
        ["Aucune peine n'est annoncée ici : ce qui se joue est l'annulation par le",
         "conseil de prud'hommes (L. 1333-2). Le module « règlement intérieur » de",
         "cet audit traite, lui, du manquement au règlement lui-même."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-04 — LA DURÉE DE LA MISE À PIED DISCIPLINAIRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-04", {
    nom: "La rectification de la durée de la mise à pied disciplinaire",
    detail: "Les deux nombres confrontés, la décision rectificative, la " +
            "restitution des jours et la régularisation de la paie.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, s = f.sanction || {}, ri = f.ri || {};
      var d0 = aujourd(ctx);
      var prononcee = (s.dureeMisePiedJours === "" || s.dureeMisePiedJours == null)
        ? null : Number(s.dureeMisePiedJours);
      var plafond = (ri.misePiedDureeMaxJours === "" || ri.misePiedDureeMaxJours == null)
        ? null : Number(ri.misePiedDureeMaxJours);
      var exces = (prononcee != null && plafond != null && !isNaN(prononcee) && !isNaN(plafond))
        ? prononcee - plafond : null;
      var L = entete(ctx, "Durée de la mise à pied disciplinaire — décision rectificative",
        "article L. 1321-1, 3°, du code du travail");

      L.push("LA RÈGLE");
      L.push("");
      L.push("L'article L. 1321-1, 3°, réserve au règlement intérieur « la nature et");
      L.push("l'échelle des sanctions que peut prendre l'employeur ». La règle que");
      L.push("l'audit en tire, et qui commande ce document : une mise à pied");
      L.push("disciplinaire n'est licite que si le règlement intérieur précise sa durée");
      L.push("maximale ; une mise à pied qui excède cette durée excède l'échelle, et la");
      L.push("sanction est annulable comme irrégulière en la forme (L. 1333-2).");
      L.push("");
      L.push("LES DEUX NOMBRES");
      L.push("");
      L.push("  · durée maximale inscrite au règlement intérieur en vigueur à la date de");
      L.push("    la sanction : " +
        (plafond != null && !isNaN(plafond) ? plafond + " jour(s)"
          : "[AUCUNE DURÉE MAXIMALE RENSEIGNÉE]"));
      L.push("  · durée effectivement prononcée : " +
        (prononcee != null && !isNaN(prononcee) ? prononcee + " jour(s)"
          : "[durée non renseignée]"));
      L.push("");
      if (plafond == null || isNaN(plafond)) {
        L.push("LE RÈGLEMENT NE FIXE AUCUNE DURÉE MAXIMALE.");
        L.push("");
        L.push("Il n'y a alors rien à ramener dans une limite qui n'existe pas : la mise");
        L.push("à pied se RETIRE, et le point se traite au niveau du règlement intérieur");
        L.push("— c'est l'objet du document « échelle des sanctions et durée maximale de");
        L.push("la mise à pied » de cet audit. Une durée maximale inscrite après coup ne");
        L.push("rétroagit pas.");
        L.push("");
        L.push("Utilisez la PIÈCE 1 ci-dessous dans sa variante « retrait ».");
      } else if (exces != null && exces > 0) {
        L.push("LA MISE À PIED EXCÈDE LE PLAFOND DE " + exces + " JOUR(S).");
        L.push("");
        L.push("Elle est ramenée à " + plafond + " jour(s). Les " + exces + " jour(s)");
        L.push("retirés en excès sont rendus au salarié, et la rémunération");
        L.push("correspondante lui est restituée : au-delà du plafond, la retenue n'a");
        L.push("plus de support disciplinaire, et une retenue sans support tombe sous");
        L.push("l'interdiction des sanctions pécuniaires de L. 1331-2.");
      } else if (exces != null) {
        L.push("La durée prononcée n'excède pas le plafond déclaré. Vérifiez néanmoins");
        L.push("les deux nombres sur les documents eux-mêmes — la notification et le");
        L.push("règlement dans sa version applicable — avant de conclure.");
      } else {
        L.push("Le dossier ne porte pas les deux nombres. Relevez-les avant toute");
        L.push("décision : la durée maximale sur le règlement en vigueur à la date de la");
        L.push("sanction, et la durée prononcée sur la notification.");
      }
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — DÉCISION RECTIFICATIVE NOTIFIÉE AU SALARIÉ");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : mise à pied disciplinaire notifiée le " +
        jour(s.dateNotification, "date de la notification") + " — rectification");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par lettre du " + jour(s.dateNotification, "date") +
        ", il vous a été notifié une mise à pied");
      L.push("disciplinaire de " +
        (prononcee != null && !isNaN(prononcee) ? prononcee + " jour(s)" : "[durée]") +
        ", du [DATE DE DÉBUT] au [DATE DE FIN].");
      L.push("");
      L.push("[VARIANTE 1 — le règlement fixe une durée maximale, et elle est dépassée :");
      L.push(" Le règlement intérieur applicable fixe à " +
        (plafond != null && !isNaN(plafond) ? plafond + " jour(s)" : "[nombre] jour(s)") +
        " la durée maximale de la");
      L.push(" mise à pied disciplinaire (article [numéro]). La mesure est en conséquence");
      L.push(" ramenée à cette durée. Les jours retenus en excès vous sont rendus, et la");
      L.push(" rémunération correspondante vous sera restituée sur votre paie de [MOIS],");
      L.push(" sous une ligne de régularisation distincte.]");
      L.push("");
      L.push("[VARIANTE 2 — le règlement ne fixe aucune durée maximale :");
      L.push(" Le règlement intérieur applicable ne précise pas la durée maximale de la");
      L.push(" mise à pied disciplinaire. Je retire en conséquence cette mesure. Elle est");
      L.push(" réputée n'avoir jamais été prononcée ; les jours de suspension vous sont");
      L.push(" rendus et la rémunération correspondante vous sera restituée sur votre");
      L.push(" paie de [MOIS]. Toute mention en sera supprimée de votre dossier");
      L.push(" individuel.]");
      L.push("");
      L.push("[Ne conservez qu'une seule variante.]");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — CONSIGNE DE PAIE");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — note à [service paie / prestataire], le " + leJour(d0));
      L.push("");
      L.push("Salarié : [NOM PRÉNOM] — matricule [.....]");
      L.push("Objet : régularisation d'une retenue de mise à pied disciplinaire");
      L.push("");
      L.push("  · jours de mise à pied initialement retenus : " +
        (prononcee != null && !isNaN(prononcee) ? prononcee : "[nombre]"));
      L.push("  · jours régulièrement retenus après rectification : " +
        (plafond != null && !isNaN(plafond) ? plafond : "0 (mesure retirée)"));
      L.push("  · jours à restituer : " +
        (exces != null && exces > 0 ? exces : "[nombre]") +
        " — soit [MONTANT] euros bruts");
      L.push("  · paie concernée : [MOIS], ligne « régularisation »");
      L.push("");
      L.push("La retenue maintenue au-delà de la durée régulière ne serait plus la");
      L.push("conséquence d'une suspension du contrat : elle tomberait sous");
      L.push("l'interdiction des amendes et sanctions pécuniaires de L. 1331-2, punie");
      L.push("d'une amende de 3 750 euros (L. 1334-1).");
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");

      L = L.concat(blocProtege(ctx));

      return L.concat(pied("L. 1321-1, 3°, L. 1331-2, L. 1334-1, L. 1333-2",
        ["Si le règlement intérieur ne fixe aucune durée maximale, le point se règle",
         "au niveau du règlement : c'est l'objet du document produit pour le contrôle",
         "de l'échelle des sanctions (DIS-CTL-RI-03)."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-05 — LES FAITS PRESCRITS (L. 1332-4)
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-05", {
    nom: "Le retrait de la sanction fondée sur des faits prescrits",
    detail: "Les deux dates confrontées, le calcul du terme des deux mois, la " +
            "seule réserve que le texte prévoit, et la lettre de retrait.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, s = f.sanction || {};
      var d0 = aujourd(ctx);
      var engagement = estISO(s.dateConvocation) ? s.dateConvocation
        : (estISO(s.dateNotification) ? s.dateNotification : null);
      var quoiEngagement = estISO(s.dateConvocation)
        ? "l'envoi de la lettre de convocation à l'entretien préalable"
        : (estISO(s.dateNotification)
          ? "la notification de la sanction, aucune convocation n'ayant été envoyée"
          : null);
      var limite = estISO(s.dateConnaissance) ? moisApres(s.dateConnaissance, 2) : null;
      var L = entete(ctx, "Retrait d'une sanction fondée sur des faits prescrits",
        "articles L. 1332-4 et R. 1332-1 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de");
      L.push("poursuites disciplinaires au-delà d'un délai de deux mois à compter du");
      L.push("jour où l'employeur en a eu connaissance, à moins que ce fait ait donné");
      L.push("lieu dans le même délai à l'exercice de poursuites pénales » (L. 1332-4).");
      L.push("");
      L.push("Et R. 1332-1 rattache expressément la convocation à ce délai : la lettre");
      L.push("« est soit remise contre récépissé, soit adressée par lettre recommandée,");
      L.push("dans le délai de deux mois fixé à l'article L. 1332-4 ».");
      L.push("");
      L.push("Le délai est de prescription : passé le terme, le fait ne peut plus à lui");
      L.push("seul fonder une sanction, quelle que soit sa gravité. Rien ne le rouvre.");
      L.push("");
      L.push("LES DEUX DATES, ET CE QU'ELLES DONNENT");
      L.push("");
      L.push("  · point de départ — le jour où l'EMPLOYEUR A EU CONNAISSANCE des faits,");
      L.push("    et non celui où ils se sont produits, ni celui où une enquête interne");
      L.push("    s'est achevée : " + jour(s.dateConnaissance, "DATE NON RENSEIGNÉE"));
      L.push("  · terme des deux mois : " + (limite ? jour(limite) : "[à calculer]"));
      L.push("  · engagement des poursuites : " +
        (engagement ? jour(engagement) : "[DATE NON RENSEIGNÉE]"));
      if (quoiEngagement) L.push("    (c'est-à-dire " + quoiEngagement + ")");
      L.push("");
      if (limite && engagement) {
        var ec = ecartJours(s.dateConnaissance, engagement);
        L.push("Écart mesuré : " + ec + " jours.");
        if (engagement > limite) {
          L.push("");
          L.push("LES POURSUITES ONT ÉTÉ ENGAGÉES APRÈS LE TERME. Les faits étaient");
          L.push("prescrits : sauf la réserve ci-dessous, ils ne pouvaient plus fonder à");
          L.push("eux seuls une sanction, et celle-ci se retire.");
        } else {
          L.push("");
          L.push("Les poursuites ont été engagées avant le terme. Vérifiez néanmoins la");
          L.push("date de connaissance sur la pièce qui l'établit : c'est elle qui décide,");
          L.push("et c'est elle que l'on discute.");
        }
      } else {
        L.push("Le dossier ne porte pas les deux dates : établissez-les avant toute");
        L.push("décision. La date de connaissance se prouve par une pièce — signalement,");
        L.push("constat, rapport reçu — et non par une affirmation.");
      }
      L.push("");
      L.push("LA SEULE RÉSERVE QUE LE TEXTE PRÉVOIT");
      L.push("");
      L.push("« à moins que ce fait ait donné lieu DANS LE MÊME DÉLAI à l'exercice de");
      L.push("poursuites pénales ». Elle suppose que les poursuites pénales aient été");
      L.push("exercées DANS les deux mois, non après.");
      L.push("");
      L.push("  · des poursuites pénales ont-elles été exercées ? " +
        etat(s.poursuitesPenales, "OUI", "non"));
      L.push("  · date de l'acte de poursuite : [DATE] — à comparer au terme du délai" +
        (limite ? " (" + jour(limite) + ")" : "") + ".");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — NOTE DE RETRAIT (interne)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx));
      L.push("NOTE — RETRAIT D'UNE SANCTION FONDÉE SUR DES FAITS PRESCRITS");
      L.push("Établie le " + leJour(d0));
      L.push("");
      L.push("1. Faits : [rappel sommaire, sans les requalifier].");
      L.push("2. Connaissance par l'employeur : le " +
        jour(s.dateConnaissance, "DATE") + ", établie par [pièce].");
      L.push("3. Terme des deux mois de L. 1332-4 : le " +
        (limite ? jour(limite) : "[DATE]") + ".");
      L.push("4. Engagement des poursuites : le " +
        (engagement ? jour(engagement) : "[DATE]") +
        (quoiEngagement ? ", par " + quoiEngagement : "") + ".");
      L.push("5. Poursuites pénales exercées dans le même délai : [oui — date : ..... /");
      L.push("   non].");
      L.push("6. Décision : hors la réserve du 5, la sanction est RETIRÉE. Le fait");
      L.push("   prescrit ne peut plus la fonder.");
      L.push("7. Pour l'avenir : engager les poursuites dès la connaissance des faits,");
      L.push("   sans attendre l'issue d'une enquête interne au-delà du terme. La");
      L.push("   convocation doit être remise contre récépissé ou adressée par lettre");
      L.push("   recommandée DANS ce délai (R. 1332-1).");
      L.push("");
      L.push(cro(p.responsable, "Nom, qualité et signature"));
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — LETTRE AU SALARIÉ");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : retrait de la sanction notifiée le " +
        jour(s.dateNotification, "date de la notification"));
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par lettre du " + jour(s.dateNotification, "date") +
        ", il vous a été notifié [rappeler la");
      L.push("sanction].");
      L.push("");
      L.push("L'article L. 1332-4 du code du travail dispose qu'aucun fait fautif ne");
      L.push("peut donner lieu à lui seul à l'engagement de poursuites disciplinaires");
      L.push("au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu");
      L.push("connaissance. Ce délai était expiré lorsque les poursuites ont été");
      L.push("engagées. Je retire en conséquence cette sanction.");
      L.push("");
      L.push("Elle est réputée n'avoir jamais été prononcée. Toute mention en sera");
      L.push("supprimée de votre dossier individuel[, et ses effets sur votre");
      L.push("rémunération seront régularisés sur la prochaine paie].");
      L.push("");
      L = L.concat(signature(ctx));

      L = L.concat(blocProtege(ctx));

      return L.concat(pied("L. 1332-4, R. 1332-1, L. 1333-2",
        ["Aucune peine n'est annoncée : ce qui se joue est l'annulation par le",
         "conseil de prud'hommes (L. 1333-2), et la perte définitive de la",
         "possibilité de sanctionner ces faits."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-06 — LES SANCTIONS ANTÉRIEURES DE PLUS DE TROIS ANS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-06", {
    nom: "La rectification des motifs, expurgée des sanctions antérieures prescrites",
    detail: "La date pivot calculée, le tri des sanctions antérieures, le " +
            "réexamen de la mesure sans elles et la lettre rectificative.",
    produire: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, s = f.sanction || {};
      var d0 = aujourd(ctx);
      var engagement = estISO(s.dateConvocation) ? s.dateConvocation
        : (estISO(s.dateNotification) ? s.dateNotification : null);
      var pivot = engagement ? moisApres(engagement, -36) : null;
      var plusAncienne = estISO(s.dateSanctionAnterieurePlusAncienne)
        ? s.dateSanctionAnterieurePlusAncienne : null;
      var L = entete(ctx, "Motifs de la sanction — retrait des sanctions antérieures prescrites",
        "article L. 1332-5 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Aucune sanction antérieure de plus de trois ans à l'engagement des");
      L.push("poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle");
      L.push("sanction » (L. 1332-5).");
      L.push("");
      L.push("L'interdiction porte sur l'INVOCATION : la sanction ancienne n'est pas");
      L.push("effacée, elle ne peut simplement plus servir d'appui. Une nouvelle mesure");
      L.push("qui ne tient que par un passé disciplinaire prescrit perd donc son appui,");
      L.push("et le conseil de prud'hommes peut l'annuler comme irrégulière en la forme,");
      L.push("injustifiée ou disproportionnée (L. 1333-2).");
      L.push("");
      L.push("LA DATE PIVOT");
      L.push("");
      L.push("  · engagement des poursuites en cours : " +
        (engagement ? jour(engagement) : "[DATE NON RENSEIGNÉE]"));
      L.push("    (l'envoi de la convocation ; à défaut de convocation, la notification");
      L.push("    de la sanction — R. 1332-1 rattache la convocation au délai de");
      L.push("    L. 1332-4, ce qui en fait l'acte d'engagement)");
      L.push("  · trois ans avant cet engagement : " +
        (pivot ? jour(pivot) : "[à calculer]"));
      L.push("");
      L.push("TOUTE SANCTION NOTIFIÉE AVANT LE " +
        (pivot ? jour(pivot).toUpperCase() : "[DATE PIVOT]") + " EST ÉCARTÉE.");
      L.push("Celles notifiées à cette date ou après elle peuvent être invoquées.");
      L.push("");
      L.push("Dans votre dossier : sanctions antérieures invoquées — " +
        etat(s.sanctionsAnterieuresInvoquees, "OUI", "non") + ".");
      if (plusAncienne) {
        L.push("Plus ancienne d'entre elles : " + jour(plusAncienne) + ".");
        if (pivot)
          L.push(plusAncienne < pivot
            ? "Elle est antérieure à la date pivot : ELLE EST ÉCARTÉE."
            : "Elle n'est pas antérieure à la date pivot : elle peut être invoquée.");
      }
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 1 — TRI DES SANCTIONS ANTÉRIEURES");
      L.push(GROS);
      L.push("");
      L.push("Une ligne par sanction invoquée. La date qui compte est celle de sa");
      L.push("NOTIFICATION.");
      L.push("");
      L.push("  Sanction antérieure          | Notifiée le | Écartée ? (avant le " +
        (pivot ? jour(pivot) : "[pivot]") + ")");
      L.push("  -----------------------------|-------------|--------------------------");
      L.push("  [.........................]  | [.........] | [oui / non]");
      L.push("  [.........................]  | [.........] | [oui / non]");
      L.push("  [.........................]  | [.........] | [oui / non]");
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 2 — RÉEXAMEN DE LA MESURE SANS CE QUI EST ÉCARTÉ");
      L.push(GROS);
      L.push("");
      L.push("C'est l'étape que l'on saute, et c'est elle qui décide.");
      L.push("");
      L.push("  a) Éléments qui subsistent après le tri — faits, pièces, sanctions");
      L.push("     antérieures encore invocables :");
      L.push("     [.....................................................]");
      L.push("");
      L.push("  b) La mesure envisagée tient-elle par ces seuls éléments ?");
      L.push("     [ ] OUI — elle est maintenue, et sa motivation est réécrite sans");
      L.push("         aucune mention des sanctions écartées (pièce 3).");
      L.push("     [ ] NON — elle ne tenait que par le passé écarté : elle est RETIRÉE.");
      L.push("");
      L.push("  c) Purge des dossiers : les mentions devenues inutilisables sont");
      L.push("     retirées des pièces qui servent à motiver — trames, historiques,");
      L.push("     notes internes. Une mention laissée en place ressort à la première");
      L.push("     lecture contradictoire.");
      L.push("");
      L.push("");
      L.push(GROS);
      L.push("PIÈCE 3 — LETTRE RECTIFICATIVE AU SALARIÉ");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx, true));
      L.push("Objet : sanction notifiée le " +
        jour(s.dateNotification, "date de la notification") + " — rectification des motifs");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par lettre du " + jour(s.dateNotification, "date") +
        ", il vous a été notifié [rappeler la");
      L.push("sanction]. Cette lettre mentionnait, à l'appui de la mesure, des sanctions");
      L.push("antérieures dont l'une au moins remonte à plus de trois ans avant");
      L.push("l'engagement des poursuites.");
      L.push("");
      L.push("L'article L. 1332-5 du code du travail interdit d'invoquer une telle");
      L.push("sanction à l'appui d'une nouvelle sanction. Ces mentions sont en");
      L.push("conséquence retirées de la motivation.");
      L.push("");
      L.push("[VARIANTE 1 — la mesure est maintenue :");
      L.push(" La mesure est maintenue, motivée par les seuls éléments suivants :");
      L.push(" " + "[REPRENDRE ICI LES SEULS GRIEFS QUI SUBSISTENT, datés et");
      L.push(" circonstanciés. N'y faites figurer aucune sanction écartée.]]");
      L.push("");
      L.push("[VARIANTE 2 — la mesure ne tenait que par ce passé :");
      L.push(" La mesure ne se justifiant pas par les seuls éléments qui subsistent, je");
      L.push(" la retire. Elle est réputée n'avoir jamais été prononcée, et toute mention");
      L.push(" en sera supprimée de votre dossier individuel.]");
      L.push("");
      L.push("[Ne conservez qu'une seule variante.]");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("Attention : rectifier la motivation ne rouvre aucun délai. Si la mesure");
      L.push("est maintenue, elle reste celle qui a été notifiée, avec sa date ; les");
      L.push("bornes de L. 1332-2 s'apprécient sur cette notification-là.");
      L.push("");

      L = L.concat(blocProtege(ctx));

      return L.concat(pied("L. 1332-5, R. 1332-1, L. 1332-2, L. 1333-2",
        ["Aucune peine n'est annoncée : ce qui se joue est l'annulation par le",
         "conseil de prud'hommes (L. 1333-2)."])).join("\n");
    },
  });

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
