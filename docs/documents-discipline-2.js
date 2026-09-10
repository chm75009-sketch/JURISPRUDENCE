/* Les documents que l'application PRODUIT - les six écrits de la procédure
   disciplinaire.

   POURQUOI CE FICHIER EXISTE, ET POURQUOI IL EST SÉPARÉ

   documents-produits.js porte le règlement intérieur ; documents-discipline.js
   porte ses avenants, ses formalités, et les six premiers contrôles de
   sanction - DIS-CTL-SAN-01 à SAN-06 : l'écrit des griefs, la sanction
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
        · L. 1334-1 ne vise que L. 1331-2 - l'amende et la sanction
          pécuniaire -, que le module traite en DIS-CTL-SAN-02.
      Aucun des six documents de ce fichier ne menace donc d'une amende pour
      un entretien qui n'a pas eu lieu, une convocation incomplète, un délai
      dépassé, une notification défaillante, une mise à pied conservatoire
      laissée sans suite ou une procédure conventionnelle non suivie. CE QUI
      S'Y JOUE EST L'ANNULATION : « le conseil de prud'hommes peut annuler une
      sanction irrégulière en la forme ou injustifiée ou disproportionnée à la
      faute commise » (L. 1333-2) - et, lorsque la mesure est un licenciement,
      l'absence de cause réelle et sérieuse, selon la jurisprudence citée.

   3. LES GRIEFS NE S'INVENTENT JAMAIS. Aucune de ces lettres n'écrit ce que
      le salarié aurait fait. Les faits sortent entre crochets, avec la
      consigne de les écrire datés et circonstanciés - c'est l'employeur qui
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

  var TRAIT = "--------------------------------------------------------------------------";
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
  function jour(iso, quoi) {
    var d = dateDe(iso);
    return d ? leJour(d) : "[" + (quoi || "date") + "]";
  }
  function jj(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "[date]";
    var m = d.getMonth() + 1, j = d.getDate();
    return (j < 10 ? "0" + j : j) + "/" + (m < 10 ? "0" + m : m) + "/" + d.getFullYear();
  }

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

  function prorogerOuvrable(iso) {
    var d = dateDe(iso);
    if (!d) return null;
    var tours = 0;
    while (tours < 4 && (d.getDay() === 0 || d.getDay() === 6)) {
      d.setDate(d.getDate() + 1); tours++;
    }
    return isoDe(d);
  }

  function deuxJoursOuvrablesApres(iso) {
    if (!estISO(iso)) return null;
    var x = iso, compte = 0, tours = 0;
    while (compte < 2 && tours < 15) {
      x = plusJours(x, 1); tours++;
      if (dateDe(x).getDay() !== 0) compte++;
    }
    return x;
  }

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

  function etat(v, oui, non) {
    if (v === true || v === "oui") return oui;
    if (v === false || v === "non") return non;
    return "non renseigné - à vérifier sur le document lui-même";
  }
  function estOui(v) { return v === true || v === "oui"; }
  function estNon(v) { return v === false || v === "non"; }
  function rempli(v) { return v !== undefined && v !== null && String(v).trim() !== ""; }

  function nomDe(ctx) {
    var p = (ctx && ctx.profil) || {};
    return cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE");
  }
  function lieu(ctx) { return cro(((ctx && ctx.profil) || {}).ville, "lieu"); }

  function X(ex, valeur, crochet) { return ex ? valeur : "[" + crochet + "]"; }

  function blocSalarie() {
    return [
      "[NOM ET PRÉNOM DU SALARIÉ]",
      "[fonction et service]",
      "[adresse]",
      "",
    ];
  }

  function blocGriefs(intro) {
    return [
      (intro || "Les faits qui vous sont reprochés sont les suivants :"),
      "",
      "[ÉCRIRE ICI LES GRIEFS - c'est à vous, et à personne d'autre, de le faire.",
      " Un grief s'écrit daté, situé et circonstancié : ce qui s'est passé, quel",
      " jour, à quelle heure, où, avec qui, et en quoi cela contrevient à une",
      " obligation. Une formule générale - « votre comportement », « vos",
      " manquements répétés » - ne met pas le salarié en mesure de discuter, et",
      " ne permet pas au conseil de prud'hommes d'apprécier. L'application ne",
      " connaît pas vos faits et ne les inventera pas.]",
      "",
    ];
  }

  function teteLettre(ctx, E, destinataire, recommande, dateLettre) {
    var p = (ctx && ctx.profil) || {};
    var L = [E ? E.name : nomDe(ctx), E ? E.adresse : cro(p.adresse, "adresse du siège"), ""];
    if (destinataire) {
      (Array.isArray(destinataire) ? destinataire : [destinataire]).forEach(function (x) { L.push(x); });
    } else {
      L = L.concat(blocSalarie());
    }
    L.push("");
    L.push((E ? E.ville : lieu(ctx)) + ", le " + leJour(dateLettre || aujourd(ctx)));
    L.push("");
    if (recommande) {
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("- ou remise en main propre contre récépissé daté et signé -");
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

  function tableau(entete, lignes) {
    var L = [];
    if (entete && entete.length > 0) {
      L.push(entete.join(" | "));
    }
    if (lignes) {
      lignes.forEach(function (l) {
        L.push(l.join(" | "));
      });
    }
    return L;
  }

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

  var ARRETS = {
    tousLesTermes: [
      "Soc., 16 avril 2008, n° 06-41.999, publié : « Dès lors qu'il a choisi de",
      "convoquer le salarié selon les modalités de l'article L. 122-41 du code du",
      "travail [devenu L. 1332-2], l'employeur est tenu d'en respecter tous les",
      "termes, quelle que soit la sanction finalement infligée. » La cour d'appel",
      "qui avait annulé des avertissements notifiés plus d'un mois après les",
      "entretiens préalables en avait fait une exacte application.",
    ],
  };

  var NOTE_ANNULATION = [
    "Aucune peine n'est annoncée dans ce document, et le périmètre a été vérifié :",
    "R. 1323-1 s'arrête à L. 1322-4 et à R. 1321-5 - il atteint le règlement",
    "intérieur, non la procédure disciplinaire -, et L. 1334-1 ne vise que",
    "L. 1331-2, l'amende et la sanction pécuniaire. Ce qui se joue ici est",
    "l'annulation : « Le conseil de prud'hommes peut annuler une sanction",
    "irrégulière en la forme ou injustifiée ou disproportionnée à la faute",
    "commise » (L. 1333-2). Et le juge n'attend pas l'employeur : « En cas de",
    "litige, le conseil de prud'hommes apprécie la régularité de la procédure",
    "suivie et si les faits reprochés au salarié sont de nature à justifier une",
    "sanction. L'employeur fournit au conseil de prud'hommes les éléments retenus",
    "pour prendre la sanction. [...] Si un doute subsiste, il profite au salarié »",
    "(L. 1333-1).",
  ];

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-07 - L'ENTRETIEN PRÉALABLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-07", {
    nom: "L'entretien préalable : convocation, compte rendu et retrait",
    detail: "La question de savoir si l'entretien est dû ; la lettre de convocation ; le compte rendu ; et le retrait de la sanction prise sans l'entretien dû.",
    produire: function (ctx) {
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Entretien préalable à une sanction disciplinaire",
        "article L. 1332-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - ENTRETIEN PRÉALABLE");
      L.push("");
      L.push("Lettre de convocation du salarié");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : convocation à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous convoque à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire.");
      L.push("");
      L.push("Cet entretien se tiendra le 10 janvier 2027 à 9 h 00, au bureau du");
      L.push("directeur, 45 rue du Port, 76600 Le Havre.");
      L.push("");
      L.push("Au cours de cet entretien, je vous indiquerai le motif de la sanction");
      L.push("envisagée et je recueillerai vos explications.");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne de votre choix");
      L.push("appartenant au personnel de l'entreprise.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");
      L.push("Compte rendu d'entretien préalable");
      L.push("");
      L.push("Date de l'entretien : 10 janvier 2027 - début 9 h 00 / fin 9 h 30");
      L.push("Salarié : MARTIN Sofia, agent d'exploitation");
      L.push("Motif indiqué : retard répété aux horaires de service en janvier 2027");
      L.push("Explications du salarié : transports en commun défaillants");
      L.push("Décision annoncée : aucune - le salarié sera informé par écrit");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple, complétée avec les dates et les noms de");
      L.push("votre dossier. Remplacez les crochets par les informations manquantes.");
      L.push("");
      L.push("LETTRE DE CONVOCATION");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : convocation à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous convoque à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire.");
      L.push("");
      L.push("Cet entretien se tiendra le [DATE] à [HEURE], à [LIEU PRÉCIS].");
      L.push("");
      L.push("Au cours de cet entretien, je vous indiquerai le motif de la sanction");
      L.push("envisagée et je recueillerai vos explications.");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne de votre choix");
      L.push("appartenant au personnel de l'entreprise.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Convocation envoyée", jj(d0), "récépissé ou recommandé"],
        ["Entretien tenu", jj(dans(d0, 8)), "compte rendu d'entretien"],
        ["Notification de la décision", jj(dans(d0, 15)), "lettre motivée et remise au salarié"],
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Lorsque l'employeur envisage de prendre une sanction, il convoque le");
      L.push("salarié en lui précisant l'objet de la convocation, sauf si la sanction");
      L.push("envisagée est un avertissement ou une sanction de même nature n'ayant pas");
      L.push("d'incidence, immédiate ou non, sur la présence dans l'entreprise, la");
      L.push("fonction, la carrière ou la rémunération du salarié.");
      L.push("Lors de son audition, le salarié peut se faire assister par une personne");
      L.push("de son choix appartenant au personnel de l'entreprise.");
      L.push("Au cours de l'entretien, l'employeur indique le motif de la sanction");
      L.push("envisagée et recueille les explications du salarié. La sanction ne peut");
      L.push("intervenir moins de deux jours ouvrables, ni plus d'un mois après le jour");
      L.push("fixé pour l'entretien. Elle est motivée et notifiée à l'intéressé »");
      L.push("(L. 1332-2).");
      L.push("");
      L.push("L'entretien est l'occasion pour le salarié de s'expliquer et pour");
      L.push("l'employeur de recueillir les faits. L'absence d'entretien, quand il était");
      L.push("dû, vicie la procédure tout entière.");
      L.push("");

      return L.concat(pied("L. 1332-2, R. 1332-1, L. 1333-2",
        NOTE_ANNULATION)).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-08 - LA LETTRE DE CONVOCATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-08", {
    nom: "La lettre de convocation aux quatre exigences de R. 1332-1",
    detail: "Les quatre exigences de la lettre, confrontées au dossier, et le récépissé de remise.",
    produire: function (ctx) {
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Lettre de convocation à l'entretien préalable",
        "articles R. 1332-1 et L. 1332-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - LETTRE DE CONVOCATION");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : convocation à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous convoque à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire.");
      L.push("");
      L.push("Cet entretien se tiendra le 10 janvier 2027 à 9 h 00, au bureau de");
      L.push("direction, 45 rue du Port, 76600 Le Havre.");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne de votre choix");
      L.push("appartenant au personnel de l'entreprise.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");
      L.push("Récépissé de remise en main propre : 09/01/2027, salarié présent");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Vérifiez que chaque exigence de R. 1332-1");
      L.push("est satisfaite.");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : convocation à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je vous convoque à un entretien préalable à une éventuelle sanction");
      L.push("disciplinaire.");
      L.push("");
      L.push("Cet entretien se tiendra le [DATE] à [HEURE], à [LIEU PRÉCIS].");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne de votre choix");
      L.push("appartenant au personnel de l'entreprise.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Rédaction de la convocation", jj(d0), "texte complété"],
        ["Remise au salarié", jj(dans(d0, 1)), "récépissé signé ou avis d'envoi"],
        ["Entretien à tenir avant", jj(dans(d0, 30)), "date à fixer dans les deux mois"],
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« La lettre de convocation prévue à l'article L. 1332-2 indique l'objet");
      L.push("de l'entretien entre le salarié et l'employeur. Elle précise la date,");
      L.push("l'heure et le lieu de cet entretien. Elle rappelle que le salarié peut se");
      L.push("faire assister par une personne de son choix appartenant au personnel de");
      L.push("l'entreprise. Elle est soit remise contre récépissé, soit adressée par");
      L.push("lettre recommandée, dans le délai de deux mois fixé à l'article");
      L.push("L. 1332-4 » (R. 1332-1).");
      L.push("");
      L.push("Ces quatre exigences sont indissociables. Manquer l'une d'elles vicie la");
      L.push("convocation tout entière, et la sanction qui suivrait serait irrégulière.");
      L.push("");

      return L.concat(pied("R. 1332-1, L. 1332-2, L. 1332-4, L. 1333-2",
        NOTE_ANNULATION)).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-09 - LES DEUX BORNES DE NOTIFICATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-09", {
    nom: "Le calendrier de notification - les deux bornes de L. 1332-2",
    detail: "Les bornes calculées selon R. 1332-3, la fiche de suivi des délais, et le retrait si le mois est passé.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, s = f.sanction || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Calendrier de notification de la sanction",
        "articles L. 1332-2, R. 1332-2 et R. 1332-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - FICHE DE SUIVI DES DÉLAIS");
      L.push("");
      L.push("Dossier disciplinaire - MARTIN Sofia");
      L.push("");
      L.push("1. Connaissance des faits par l'employeur : 15 décembre 2026");
      L.push("   Terme des deux mois (L. 1332-4) : 15 février 2027");
      L.push("");
      L.push("2. Remise ou envoi de la convocation : 20 décembre 2026");
      L.push("   Voie : lettre recommandée");
      L.push("");
      L.push("3. Jour fixé pour l'entretien : 10 janvier 2027");
      L.push("   Au plus tôt la sanction : 13 janvier 2027");
      L.push("   Au plus tard la sanction : 10 février 2027");
      L.push("");
      L.push("4. Notification effectivement faite le : 25 janvier 2027");
      L.push("   Voie : lettre recommandée");
      L.push("   Décision : mise à pied disciplinaire de 3 jours");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Portez les dates réelles de votre dossier ci-dessous. Vérifiez que la");
      L.push("notification tombe bien dans la fenêtre.");
      L.push("");
      L.push("Dossier disciplinaire - [NOM ET PRÉNOM DU SALARIÉ]");
      L.push("");
      L.push("1. Connaissance des faits par l'employeur : [DATE]");
      L.push("   Terme des deux mois (L. 1332-4) : [DATE]");
      L.push("");
      L.push("2. Remise ou envoi de la convocation : [DATE]");
      L.push("   Voie : [récépissé / lettre recommandée]");
      L.push("");
      L.push("3. Jour fixé pour l'entretien : [DATE]");
      L.push("   Au plus tôt la sanction : [DATE]");
      L.push("   Au plus tard la sanction : [DATE]");
      L.push("");
      L.push("4. Notification effectivement faite le : [DATE]");
      L.push("   Voie : [récépissé / lettre recommandée]");
      L.push("   Décision : [nature de la sanction]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve à conserver"], [
        ["Faits portés à la connaissance", "J", "pièce établissant la date"],
        ["Convocation remise ou envoyée", "J+5", "récépissé ou recommandé"],
        ["Entretien tenu", "J+20", "compte rendu d'entretien"],
        ["Notification au plus tôt", "J+22", "deux jours ouvrables après entretien"],
        ["Notification au plus tard", "J+50", "un mois après le jour d'entretien"],
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« La sanction ne peut intervenir moins de deux jours ouvrables, ni plus");
      L.push("d'un mois après le jour fixé pour l'entretien. Elle est motivée et");
      L.push("notifiée à l'intéressé » (L. 1332-2, dernier alinéa).");
      L.push("");
      L.push("« Le délai d'un mois prévu à l'article L. 1332-2 expire à vingt-quatre");
      L.push("heures le jour du mois suivant qui porte le même quantième que le jour");
      L.push("fixé pour l'entretien. À défaut d'un quantième identique, le délai expire");
      L.push("le dernier jour du mois suivant à vingt-quatre heures. Lorsque le dernier");
      L.push("jour de ce délai est un samedi, un dimanche ou un jour férié ou chômé, le");
      L.push("délai est prorogé jusqu'au premier jour ouvrable suivant » (R. 1332-3).");
      L.push("");
      L.push("Une sanction notifiée hors de cette fenêtre est irrégulière en la forme.");
      L.push("");

      return L.concat(pied("L. 1332-2, R. 1332-2, R. 1332-3, L. 1333-2",
        NOTE_ANNULATION)).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-10 - LA DÉCISION ÉCRITE ET MOTIVÉE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-10", {
    nom: "La lettre de notification de la sanction - décision écrite et motivée",
    detail: "Les trois exigences de R. 1332-2, la lettre de notification, le récépissé, et le retrait en cas d'irrégularité.",
    produire: function (ctx) {
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Notification de la sanction disciplinaire",
        "articles R. 1332-2 et L. 1332-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - LETTRE DE NOTIFICATION DE SANCTION");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : notification d'une sanction disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Vous avez été convoqué(e) par lettre du 20 décembre 2026 à un entretien");
      L.push("préalable qui s'est tenu le 10 janvier 2027 à 9 h 00.");
      L.push("");
      L.push("Les faits qui vous sont reprochés sont les suivants : absences");
      L.push("injustifiées les 22, 23 et 24 décembre 2026.");
      L.push("");
      L.push("En conséquence, je vous notifie la sanction suivante :");
      L.push("UNE MISE À PIED DISCIPLINAIRE DE 3 JOURS, du 30 janvier 2027 au 1er février 2027.");
      L.push("");
      L.push("Pendant cette période, votre contrat de travail est suspendu et votre");
      L.push("rémunération n'est pas due.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure. Vérifiez que la décision est écrite, motivée sur les");
      L.push("faits précis, et remise selon l'une des deux voies de R. 1332-2.");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : notification d'une sanction disciplinaire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Vous avez été convoqué(e) par lettre du [DATE] à un entretien préalable");
      L.push("qui s'est tenu le [DATE].");
      L.push("");
      L.push("Les faits qui vous sont reprochés sont les suivants : [ÉCRIRE LES FAITS");
      L.push("DATÉS ET CIRCONSTANCIÉS].");
      L.push("");
      L.push("En conséquence, je vous notifie la sanction suivante :");
      L.push("[NOMMER LA SANCTION], à effet du [DATE].");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve à conserver"], [
        ["Rédaction de la notification", jj(d0), "lettre complétée"],
        ["Remise au salarié ou envoi", jj(dans(d0, 1)), "récépissé ou recommandé"],
        ["Versement au dossier individuel", jj(dans(d0, 2)), "copie signée et datée"],
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« La sanction prévue à l'article L. 1332-2 fait l'objet d'une décision");
      L.push("écrite et motivée. La décision est notifiée au salarié soit par lettre");
      L.push("remise contre récépissé, soit par lettre recommandée, dans le délai d'un");
      L.push("mois prévu par l'article L. 1332-2 » (R. 1332-2).");
      L.push("");
      L.push("Écrite : la sanction n'existe que si elle est écrite.");
      L.push("");
      L.push("Motivée : la lettre énonce les faits reprochés, datés et circonstanciés.");
      L.push("Une formule vague ne suffit pas à mettre le salarié en mesure de discuter.");
      L.push("");
      L.push("Notifiée : remise en main propre contre récépissé, ou par lettre");
      L.push("recommandée. Aucune autre voie n'est ouverte.");
      L.push("");

      return L.concat(pied("R. 1332-2, L. 1332-2, L. 1333-1, L. 1333-2",
        NOTE_ANNULATION)).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-11 - LA MISE À PIED CONSERVATOIRE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-11", {
    nom: "La mise à pied conservatoire et la procédure qui doit la suivre",
    detail: "L'écrit qui la qualifie de conservatoire, la convocation engagée sans délai, la fiche d'enchaînement des dates, et la consigne de paie.",
    produire: function (ctx) {
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Mise à pied conservatoire et procédure disciplinaire",
        "article L. 1332-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - MISE À PIED CONSERVATOIRE");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : mise à pied conservatoire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Les faits portés à ma connaissance le 15 décembre 2026 rendent");
      L.push("indispensable votre éloignement immédiat, pour la raison suivante :");
      L.push("risque de conflit avec d'autres salariés.");
      L.push("");
      L.push("Je prononce en conséquence, à effet immédiat, votre MISE À PIED À TITRE");
      L.push("CONSERVATOIRE, à compter du 15 décembre 2026 à 14 h 00.");
      L.push("");
      L.push("CETTE MESURE N'EST PAS UNE SANCTION. Elle est prise dans l'attente de la");
      L.push("décision qui sera arrêtée à l'issue de la procédure disciplinaire.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure. Rappellez que la mesure est conservatoire, à titre");
      L.push("d'attente, non une sanction définitive.");
      L.push("");
      L = L.concat(teteLettre(ctx, null, null, true, d0));
      L.push("Objet : mise à pied conservatoire");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Les faits portés à ma connaissance le [DATE] rendent indispensable votre");
      L.push("éloignement immédiat, pour la raison suivante : [ÉCRIRE POURQUOI].");
      L.push("");
      L.push("Je prononce en conséquence, à effet immédiat, votre MISE À PIED À TITRE");
      L.push("CONSERVATOIRE, à compter du [DATE] à [HEURE].");
      L.push("");
      L.push("CETTE MESURE N'EST PAS UNE SANCTION. Elle est prise dans l'attente de la");
      L.push("décision qui sera arrêtée à l'issue de la procédure disciplinaire.");
      L.push("");
      L = L.concat(signature(ctx));
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve à conserver"], [
        ["Mise à pied conservatoire prononcée", jj(d0), "lettre datée et signée"],
        ["Convocation à l'entretien", jj(d0), "lettre remise le même jour"],
        ["Entretien préalable tenu", jj(dans(d0, 5)), "compte rendu d'entretien"],
        ["Sanction définitive notifiée", jj(dans(d0, 25)), "lettre motivée"],
        ["Fin de la mise à pied conservatoire", jj(dans(d0, 25)), "à la notification"],
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Lorsque les faits reprochés au salarié ont rendu indispensable une");
      L.push("mesure conservatoire de mise à pied à effet immédiat, aucune sanction");
      L.push("définitive relative à ces faits ne peut être prise sans que la procédure");
      L.push("prévue à l'article L. 1332-2 ait été respectée » (L. 1332-3).");
      L.push("");
      L.push("La mise à pied conservatoire n'est pas une sanction : elle attend la");
      L.push("décision. Elle doit être engagée d'urgence et suivie immédiatement de la");
      L.push("procédure disciplinaire. Les deux lettres partent ensemble.");
      L.push("");
      L.push("Une mise à pied conservatoire laissée sans suite peut être regardée comme");
      L.push("une sanction non motivée et non notifiée : la retenue de salaire alors");
      L.push("opérée n'a plus de support disciplinaire.");
      L.push("");

      return L.concat(pied("L. 1332-3, L. 1332-2, R. 1332-1, R. 1332-2, L. 1331-1, L. 1331-2, L. 1334-1, L. 1333-2",
        ["L. 1334-1 punit de 3 750 euros l'infliction d'une amende ou sanction",
         "pécuniaire en méconnaissance de L. 1331-2."].concat(NOTE_ANNULATION))).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     DIS-CTL-SAN-12 - LA GARANTIE DE FOND
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("DIS-CTL-SAN-12", {
    nom: "La procédure conventionnelle ou de règlement intérieur - garantie de fond",
    detail: "Le relevé de la clause, la saisine de l'organisme, la fiche de suivi des délais, et le retrait lorsque la procédure n'a pas été suivie.",
    produire: function (ctx) {
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Procédure conventionnelle ou de règlement intérieur préalable à la sanction",
        "jurisprudence de la chambre sociale - garantie de fond");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - RELEVÉ DE LA CLAUSE");
      L.push("");
      L.push("Entreprise EXEMPLE SARL - dossier disciplinaire MARTIN");
      L.push("Relevé établi le 15 janvier 2027");
      L.push("");
      L.push("1. CLAUSE CONSULTÉE");
      L.push("   Convention collective nationale du commerce de détail");
      L.push("   Article 42 : « Avant toute sanction autre que l'avertissement, le chef");
      L.push("   d'entreprise doit consulter le comité d'établissement »");
      L.push("");
      L.push("2. DÉLAIS IMPOSÉS PAR LA CLAUSE");
      L.push("   Saisine : avant la notification de la sanction");
      L.push("   Avis du comité : dans les quinze jours");
      L.push("");
      L.push("3. STATUT DE LA PROCÉDURE");
      L.push("   Suivie : oui, le 12 janvier 2027");
      L.push("   Avis rendu : le 20 janvier 2027");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Avant de convoquer, relevez la clause applicable dans votre convention");
      L.push("collective ou votre règlement intérieur. Remplissez cette fiche.");
      L.push("");
      L.push("Entreprise [DÉNOMINATION] - dossier disciplinaire [NOM]");
      L.push("Relevé établi le [DATE]");
      L.push("");
      L.push("1. CLAUSE CONSULTÉE");
      L.push("   Convention collective : [TITRE ET IDCC]");
      L.push("   Clause : [ARTICLE - recopiez le texte exact]");
      L.push("");
      L.push("2. DÉLAIS IMPOSÉS PAR LA CLAUSE");
      L.push("   Saisine : [DATE OU DÉLAI]");
      L.push("   Avis de l'organisme : [DATE OU DÉLAI]");
      L.push("");
      L.push("3. STATUT DE LA PROCÉDURE");
      L.push("   Suivie : [OUI / NON]");
      L.push("   Avis rendu : [DATE]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve à conserver"], [
        ["Relevé de la clause", jj(d0), "fiche complétée"],
        ["Saisine de l'organisme", jj(dans(d0, 2)), "lettre recommandée et avis réception"],
        ["Avis rendu par l'organisme", jj(dans(d0, 15)), "procès-verbal ou lettre"],
        ["Notification de la sanction", jj(dans(d0, 25)), "après avis, dans le mois de l'entretien"],
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "cse"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Lorsqu'une convention collective ou un règlement intérieur impose une");
      L.push("procédure préalable à la sanction (conseil de discipline, commission");
      L.push("paritaire, avis préalable), cette formalité n'est pas une simple exigence");
      L.push("de forme : elle constitue une garantie de fond. L'absence de consultation,");
      L.push("ou une consultation tardive, rend le licenciement sans cause réelle et");
      L.push("sérieuse, ou la sanction irrégulière en la forme et annulable.");
      L.push("");
      L.push("Cette obligation ne se corrige pas après coup. Une fois la sanction");
      L.push("notifiée, la consulter tardivement ne rétablit rien. Si l'organisme n'a");
      L.push("pas été consulté avant notification, la sanction doit être retirée et la");
      L.push("procédure reprise depuis l'origine.");
      L.push("");

      return L.concat(pied("L. 1333-2, L. 1332-2, R. 1332-1, R. 1332-2, R. 1332-3, L. 1333-1",
        ["Jurisprudence : Soc., 8 septembre 2021, n° 19-15.039, publié ; Soc., 20 mars 2024, n° 22-17.292, publié.",
         "La clause elle-même figure dans votre convention collective, que l'application ne lit pas."].concat(NOTE_ANNULATION))).join("\n");
    },
  });

})(typeof window !== "undefined" ? window : this);
