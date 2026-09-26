/* Les documents que l'application PRODUIT - discipline et règlement intérieur.

   POURQUOI CE FICHIER EXISTE

   documents-produits.js porte le règlement intérieur lui-même (DIS-CTL-RI-01).
   Il manquait tout le reste : les avenants qui complètent un règlement
   incomplet, les courriers qui lui font suivre ses formalités, et surtout les
   écrits de la procédure disciplinaire - convocation, compte rendu,
   notification motivée, mise à pied conservatoire, retraits.

   Un employeur à qui l'on explique qu'il aurait dû convoquer n'a toujours pas
   de lettre de convocation. Ce fichier l'écrit, à son nom, avec les dates de
   son dossier et les délais calculés à partir d'elles.

   TROIS RÈGLES, TENUES PARTOUT

   1. Rien qui n'ait été lu à la source. Chaque article cité ici figure dans
      moteur/discipline/textes-discipline.json, avec son identifiant de version,
      ou dans le fondement du contrôle auquel le document répond. Les articles
      simplement RENVOYÉS par un texte lu - L. 4122-1, les dispositions sur les
      harcèlements, la loi du 9 décembre 2016 - sont nommés, jamais reproduits :
      l'application ne les a pas lus, et elle le dit à l'endroit où le lecteur
      pourrait croire qu'elle les connaît.

   2. Les griefs ne s'inventent jamais. Aucune de ces lettres n'écrit ce que le
      salarié aurait fait. Les faits sortent entre crochets, avec la consigne de
      les écrire datés et circonstanciés - c'est l'employeur qui sait, et c'est
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

  function jj(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "[date]";
    var m = d.getMonth() + 1, j = d.getDate();
    return (j < 10 ? "0" + j : j) + "/" + (m < 10 ? "0" + m : m) + "/" + d.getFullYear();
  }

  function dansJours(d, jours) {
    var r = new Date(d);
    r.setDate(r.getDate() + jours);
    return r;
  }

  function tableau(en_tete, lignes) {
    var L = [];
    if (en_tete && en_tete.length > 0) {
      L.push(en_tete.join(" | "));
    }
    if (lignes) {
      lignes.forEach(function (l) {
        L.push(l.join(" | "));
      });
    }
    return L;
  }

  function pied(articles, notes) {
    var L = ["", "---" + "-".repeat(60), ""];
    L.push("Fondement : " + articles + ".");
    L.push("Ces textes ont été lus à la source et sont conservés avec leur");
    L.push("identifiant de version dans moteur/discipline/textes-discipline.json.");
    if (notes && notes.length) { L.push(""); notes.forEach(function (n) { L.push(n); }); }
    L.push("");
    L.push("Ce document ne vaut pas consultation. Votre convention collective, vos");
    L.push("accords et votre règlement intérieur peuvent ajouter des exigences qui");
    L.push("ne sont pas reprises ici. Ne laissez aucun crochet dans le texte que");
    L.push("vous remettez, déposez ou envoyez.");
    return L;
  }

  /* ===================================================================
     DIS-CTL-RI-02 - AVENANT DES TROIS MATIÈRES DE L. 1321-1
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-02", {
    nom: "L'avenant qui complète les trois matières de L. 1321-1",
    detail: "L'avenant rédigé matière par matière, le courrier de saisine du comité et le calendrier.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Avenant au règlement intérieur - les trois matières de L. 1321-1",
        "articles L. 1321-1 et L. 1321-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - AVENANT N° 1 AU RÈGLEMENT INTÉRIEUR");
      L.push("");
      L.push("Le règlement intérieur est complété comme suit :");
      L.push("");
      L.push("ARTICLE 1 - SANTÉ ET SÉCURITÉ");
      L.push("Chaque membre du personnel se conforme aux instructions données en matière de santé et sécurité.");
      L.push("");
      L.push("ARTICLE 2 - RÉTABLISSEMENT DES CONDITIONS DE TRAVAIL");
      L.push("Lorsque les conditions de travail compromises apparaissent, les salariés peuvent y participer.");
      L.push("");
      L.push("ARTICLE 3 - DISCIPLINE");
      L.push("Les sanctions susceptibles d'être prononcées sont : l'avertissement, le blâme, la mise à pied d'une durée maximale de 5 jours, le licenciement.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà portées ; chaque crochet est un choix à faire.");
      L.push("");
      L.push("AVENANT N° [numéro] AU RÈGLEMENT INTÉRIEUR");
      L.push("");
      L.push("Le règlement intérieur en vigueur depuis [DATE] est complété comme suit :");
      L.push("");
      L.push("ARTICLE 1 - SANTÉ ET SÉCURITÉ");
      L.push("[RÉDIGER LES MESURES DE SÉCURITÉ]");
      L.push("");
      L.push("ARTICLE 2 - RÉTABLISSEMENT DES CONDITIONS DE TRAVAIL");
      L.push("[PRÉCISER LES CONDITIONS DE PARTICIPATION]");
      L.push("");
      L.push("ARTICLE 3 - DISCIPLINE");
      L.push("[ÉNUMÉRER LES SANCTIONS AVEC LA DURÉE MAXIMALE DE MISE À PIED]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Rédaction de l'avenant", jj(d0), "texte signé"],
        ["Saisine du comité", jj(dansJours(d0, 1)), "courrier"],
        ["Avis du comité", jj(dansJours(d0, 14)), "procès-verbal"],
        ["Publication et dépôt", jj(dansJours(d0, 15)), "affichage et récépissé"],
        ["Communication à l'inspection", jj(dansJours(d0, 15)), "accusé de réception"],
        ["Entrée en vigueur", jj(dansJours(d0, 45)), "document daté"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "cse"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le règlement intérieur fixe exclusivement : 1° Les mesures de santé et");
      L.push("sécurité ; 2° Les conditions de participation au rétablissement des conditions");
      L.push("protectrices ; 3° Les règles générales et permanentes relatives à la discipline »");
      L.push("(L. 1321-1).");
      L.push("");
      L.push("Le mot qui commande est « exclusivement » : ces trois matières doivent y être,");
      L.push("et une clause étrangère à ces trois matières n'y a pas sa place.");
      L.push("");

      return L.concat(pied("L. 1321-1, L. 1321-4, L. 1331-1, L. 1331-2, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4",
        ["L'article L. 4122-1 n'a pas été lu à la source."])).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-03 - ÉCHELLE DES SANCTIONS ET DURÉE MAXIMALE
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-03", {
    nom: "L'avenant qui fixe l'échelle des sanctions et la durée maximale de la mise à pied",
    detail: "L'avenant rédigé, la durée maximale chiffrée, le calendrier des formalités.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Avenant au règlement intérieur - échelle des sanctions et mise à pied",
        "article L. 1321-1, 3°, du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - AVENANT ÉCHELLE DES SANCTIONS");
      L.push("");
      L.push("ARTICLE 1 - DÉFINITION D'UNE SANCTION");
      L.push("Constitue une sanction toute mesure autre que les observations verbales.");
      L.push("");
      L.push("ARTICLE 2 - NATURE ET ÉCHELLE DES SANCTIONS");
      L.push("Les sanctions susceptibles d'être prononcées sont : l'avertissement, le blâme,");
      L.push("la mise à pied d'une durée maximale de 5 jours, le licenciement.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. C'est ce point qui fait tomber les sanctions : il faut le chiffrer.");
      L.push("");
      L.push("ARTICLE 1 - DÉFINITION D'UNE SANCTION");
      L.push("[RÉDIGER LA DÉFINITION APPLICABLE]");
      L.push("");
      L.push("ARTICLE 2 - NATURE ET ÉCHELLE DES SANCTIONS");
      L.push("[ÉNUMÉRER CHAQUE SANCTION AVEC LA DURÉE MAXIMALE DE MISE À PIED - CE CHIFFRE EST OBLIGATOIRE]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Rédaction de l'avenant", jj(d0), "texte signé"],
        ["Saisine du comité", jj(dansJours(d0, 1)), "courrier de saisine"],
        ["Avis du comité", jj(dansJours(d0, 14)), "procès-verbal"],
        ["Publication et dépôt", jj(dansJours(d0, 15)), "affichage et récépissé"],
        ["Communication à l'inspection", jj(dansJours(d0, 15)), "courrier avec avis"],
        ["Entrée en vigueur", jj(dansJours(d0, 45)), "document daté"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« La nature et l'échelle des sanctions que peut prendre l'employeur »");
      L.push("doivent être fixées par le règlement intérieur (L. 1321-1, 3°). Sans cette");
      L.push("échelle, les sanctions autres que le licenciement ne peuvent pas être prononcées.");
      L.push("Une mise à pied n'est licite que si le règlement en fixe la durée maximale.");
      L.push("");

      return L.concat(pied("L. 1321-1, 3°, L. 1321-4, L. 1331-1, L. 1331-2, L. 1333-2, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4",
        ["Les amendes et sanctions pécuniaires sont interdites (L. 1331-2)."])).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-04 - LES TROIS RAPPELS DE L. 1321-2
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-04", {
    nom: "L'avenant qui porte les trois rappels de L. 1321-2",
    detail: "Droits de la défense, harcèlements, lanceurs d'alerte.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Avenant au règlement intérieur - les rappels de L. 1321-2",
        "article L. 1321-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - RAPPELS AU RÈGLEMENT INTÉRIEUR");
      L.push("");
      L.push("ARTICLE 1 - DROITS DE LA DÉFENSE");
      L.push("« Aucune sanction ne peut être prise sans que le salarié soit informé par écrit des griefs.");
      L.push("La sanction ne peut intervenir moins de deux jours ouvrables, ni plus d'un mois après l'entretien » (L. 1332-1 à L. 1332-3).");
      L.push("");
      L.push("ARTICLE 2 - HARCÈLEMENT");
      L.push("Les harcèlements moral et sexuel et les agissements sexistes sont interdits.");
      L.push("");
      L.push("ARTICLE 3 - LANCEURS D'ALERTE");
      L.push("Il existe un dispositif de protection des lanceurs d'alerte prévu par la loi du 9 décembre 2016.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Ces trois points sont obligatoires.");
      L.push("");
      L.push("ARTICLE 1 - DROITS DE LA DÉFENSE");
      L.push("[REPRODUIRE LES ARTICLES L. 1332-1 À L. 1332-3]");
      L.push("");
      L.push("ARTICLE 2 - HARCÈLEMENT");
      L.push("[REPRODUIRE LES DISPOSITIONS APPLICABLES DU CODE DU TRAVAIL]");
      L.push("");
      L.push("ARTICLE 3 - LANCEURS D'ALERTE");
      L.push("[RAPPELER L'EXISTENCE DU DISPOSITIF]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Rédaction de l'avenant", jj(d0), "texte signé"],
        ["Saisine du comité", jj(dansJours(d0, 1)), "courrier"],
        ["Avis du comité", jj(dansJours(d0, 14)), "procès-verbal"],
        ["Publication et dépôt", jj(dansJours(d0, 15)), "affichage"],
        ["Communication à l'inspection", jj(dansJours(d0, 15)), "accusé"],
        ["Entrée en vigueur", jj(dansJours(d0, 45)), "document"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "cse"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le règlement intérieur rappelle : 1° Les dispositions relatives aux droits");
      L.push("de la défense ; 2° Les dispositions relatives aux harcèlements ; 3° L'existence");
      L.push("du dispositif de protection des lanceurs d'alerte » (L. 1321-2).");
      L.push("");
      L.push("Le verbe est à l'indicatif : le règlement rappelle, ce n'est pas une faculté.");
      L.push("");

      return L.concat(pied("L. 1321-2, L. 1321-4, L. 1332-1, L. 1332-2, L. 1332-3, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-05 - REVUE DES CLAUSES
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-05", {
    nom: "La note de revue des clauses, clause par clause",
    detail: "Grille de revue, interdictions de L. 1321-3, clause de neutralité.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Note de revue des clauses du règlement intérieur",
        "articles L. 1321-3 et L. 1321-2-1 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - GRILLE DE REVUE D'UNE CLAUSE");
      L.push("");
      L.push("Clause n° 5 - Article [5] du règlement intérieur - FOUILLE DES SACS");
      L.push("a) Texte : Toute fouille des sacs et vestiaires est autorisée");
      L.push("b) Droit restreint : Droit à la vie privée");
      L.push("c) Nature de la tâche : Prévention du vol dans l'entrepôt");
      L.push("d) Proportionnalité : Fouille sans témoin, local fermé, consentement demandé");
      L.push("e) Conclusion : Maintenue après réécriture");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("À remplir pour chaque clause qui restreint un droit ou une liberté :");
      L.push("");
      L.push("Clause n° [X] - Article [numéro] - [TITRE DE LA CLAUSE]");
      L.push("a) Texte : [REPRODUIRE LA CLAUSE TELLE QU'ÉCRITE]");
      L.push("b) Droit restreint : [LIBERTÉ, DROIT OU INTÉRÊT AFFECTÉ]");
      L.push("c) Nature de la tâche : [QUELLE TÂCHE, QUEL RISQUE JUSTIFIE CETTE CLAUSE]");
      L.push("d) Proportionnalité : [EN QUOI CETTE CLAUSE EST LIMITÉE, ENCADRÉE, JUSTIFIÉE]");
      L.push("e) Conclusion : [MAINTENUE / RÉÉCRIRE / RETIRER]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Revue complète du texte", jj(d0), "note de revue"],
        ["Identification des clauses", jj(dansJours(d0, 5)), "liste datée"],
        ["Rédaction des avenants", jj(dansJours(d0, 15)), "textes signés"],
        ["Saisine du comité", jj(dansJours(d0, 16)), "courrier"],
        ["Publication et dépôt", jj(dansJours(d0, 26)), "affichage"],
        ["Entrée en vigueur", jj(dansJours(d0, 56)), "document"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "cse"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le règlement ne peut contenir : 1° Des dispositions contraires aux lois");
      L.push("et règlements ; 2° Des restrictions aux droits qui ne seraient pas justifiées");
      L.push("par la nature de la tâche NI proportionnées au but ; 3° Des discriminations »");
      L.push("(L. 1321-3).");
      L.push("");
      L.push("Le 2° impose DEUX conditions cumulatives : justifiée ET proportionnée.");
      L.push("");

      return L.concat(pied("L. 1321-3, L. 1321-2-1, L. 1321-4, L. 1322-1, L. 1331-2, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-06 - LE DOSSIER DE CONSULTATION DU COMITÉ

     Il ne portait qu'un exemple, sous l'en-tête du client, avec une réunion
     au 15 septembre 2026 et un avis « FAVORABLE » déjà écrit : un dossier
     que personne ne pouvait remettre. L'audit du 26 septembre 2026 demandait
     les trois pièces et le rétroplanning ; les voici, datées du dossier.

     Les quatre textes, lus à la source le 26 septembre 2026, deux lectures
     concordantes chacun :

       L. 1321-4   LEGIARTI000054140230  le règlement « ne peut être introduit
                   qu'après avoir été soumis à l'avis du comité social et
                   économique » ; il indique sa date d'entrée en vigueur,
                   « postérieure d'un mois à l'accomplissement des formalités
                   de publicité » ; en même temps que la publicité, il est
                   communiqué à l'inspecteur du travail, accompagné de l'avis ;
       R. 1321-3   LEGIARTI000018536913  ce délai « court à compter de la
                   dernière en date des formalités de publicité et de dépôt » ;
       R. 1321-4   LEGIARTI000018536911  la transmission à l'inspecteur du
                   travail se fait en deux exemplaires ;
       L. 2315-30  LEGIARTI000035624863  l'ordre du jour est communiqué aux
                   membres du comité, à l'agent de contrôle de l'inspection du
                   travail et à celui des services de prévention « trois jours
                   au moins avant la réunion ».
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-06", {
    nom: "Le dossier de consultation du comité sur le règlement intérieur",
    detail: "Lettre de transmission, ordre du jour, extrait de procès-verbal, et le rétroplanning daté.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var D = ctx.donnees || ctx.fiche || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      function deIso(v) {
        var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || "").trim());
        if (!m) return null;
        var d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
        return isNaN(d.getTime()) ? null : d;
      }
      function moisApres(d, n) {
        var r = new Date(d), j = r.getDate();
        r.setMonth(r.getMonth() + n);
        if (r.getDate() < j) r.setDate(0);
        return r;
      }
      /* La réunion est celle du dossier quand elle y est ; sinon, une
         proposition à dix jours, que l'employeur remplace. */
      var reunion = deIso(D.dateAvisCSE);
      var propose = !reunion;
      if (!reunion) reunion = dansJours(d0, 10);
      /* L'ordre du jour part trois jours au moins avant (L. 2315-30) : le
         dossier retient cinq, pour que les élus aient le temps de lire. */
      var envoi = dansJours(reunion, -5);
      if (envoi < d0) envoi = d0;
      var formalites = deIso(D.datePublicite) || deIso(D.dateDepotGreffe) || dansJours(reunion, 3);
      var deuxFormalites = [deIso(D.datePublicite), deIso(D.dateDepotGreffe)].filter(Boolean);
      if (deuxFormalites.length === 2)
        formalites = deuxFormalites[0] > deuxFormalites[1] ? deuxFormalites[0] : deuxFormalites[1];
      var vigueur = deIso(D.dateEntreeVigueur) || dansJours(moisApres(formalites, 1), 1);
      var objet = D.operation === "modification" ? "projet de modification du règlement intérieur"
        : (D.operation === "retrait de clauses" ? "projet de retrait de clauses du règlement intérieur"
        : "projet de règlement intérieur");

      var L = entete(ctx, "Dossier de consultation du comité social et économique sur le règlement intérieur",
        "articles L. 1321-4 et L. 2315-30 du code du travail");

      if (propose) {
        L.push("La date de la réunion n'est pas renseignée dans le parcours : les dates qui");
        L.push("suivent partent d'une réunion proposée au " + jj(reunion) + ". Saisissez la");
        L.push("vôtre, et le dossier se recalcule autour d'elle.");
        L.push("");
      }

      /* L'EXEMPLE D'ABORD, SOUS UN NOM QUI N'EST PAS CELUI DU CLIENT.
         Un dossier vide ne dit pas à quoi il doit ressembler une fois rempli ;
         un exemple sous l'en-tête du client se signe par mégarde. Celui-ci
         porte une entreprise fictive, et le bandeau le dit. */
      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - UN DOSSIER COMPLET, CHEZ UNE ENTREPRISE FICTIVE");
      L.push("");
      L.push("SARL LES DEUX PONTS, 4 rue de la Gare, 45000 Orléans.");
      L.push("");
      L.push("Lettre du 2 mars 2026 aux membres du comité : « Vous trouverez ci-joint le");
      L.push("projet de règlement intérieur de la SARL LES DEUX PONTS, 9 pages, soumis à");
      L.push("votre avis en application de l'article L. 1321-4. Il sera inscrit à l'ordre du");
      L.push("jour de la réunion du 7 mars 2026. »");
      L.push("");
      L.push("Ordre du jour du 2 mars 2026 : 1. approbation du procès-verbal précédent ;");
      L.push("2. consultation sur le projet de règlement intérieur ; 3. questions diverses.");
      L.push("");
      L.push("Extrait du procès-verbal du 7 mars 2026 : « Le comité, consulté, rend un avis");
      L.push("défavorable. Votants : 4. Pour : 1. Contre : 3. » Le règlement a été déposé le");
      L.push("9 mars, affiché et communiqué à l'inspection du travail le même jour, et est");
      L.push("entré en vigueur le 10 avril 2026.");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Ce qui se garde"], [
        ["Transmission du projet et de l'ordre du jour", "02/03/2026", "copie datée de l'envoi"],
        ["Réunion du comité, avis recueilli", "07/03/2026", "procès-verbal signé"],
        ["Dépôt au greffe", "09/03/2026", "récépissé daté"],
        ["Publicité et communication à l'inspection", "09/03/2026", "photo de l'affichage, preuve d'envoi"],
        ["Entrée en vigueur", "10/04/2026", "la date portée dans le règlement"]
      ]));
      L.push("");
      L.push("L'avis défavorable n'a pas empêché l'introduction du règlement : ce qui est");
      L.push("exigé est que le projet ait été soumis à l'avis, non qu'il soit approuvé.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");

      L.push("PIÈCE 1 - LETTRE DE TRANSMISSION DU PROJET AUX MEMBRES DU COMITÉ");
      L.push("");
      L.push(cro(p.denomination, "dénomination"));
      L.push(cro(p.adresse, "adresse"));
      L.push("");
      L.push("Aux membres de la délégation du personnel");
      L.push("au comité social et économique");
      L.push("");
      L.push(cro(p.ville, "ville") + ", le " + jj(envoi));
      L.push("");
      L.push("Objet : consultation sur le " + objet + ".");
      L.push("Pièce jointe : le " + objet + ", " + cro("", "nombre") + " pages.");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Vous trouverez ci-joint le " + objet + " de " + cro(p.denomination, "dénomination") + ",");
      L.push("soumis à l'avis du comité en application de l'article L. 1321-4 du code du travail.");
      L.push("");
      L.push("Ce projet sera inscrit à l'ordre du jour de la réunion du " + jj(reunion) + ", dont");
      L.push("l'ordre du jour vous est communiqué avec la présente lettre, trois jours au moins");
      L.push("avant la réunion (L. 2315-30).");
      L.push("");
      L.push("Je me tiens à votre disposition pour tout élément que vous souhaiteriez obtenir");
      L.push("avant la séance.");
      L.push("");
      L.push(cro(p.responsable, "nom et qualité du représentant légal"));
      L.push("");

      L.push("PIÈCE 2 - ORDRE DU JOUR DE LA RÉUNION");
      L.push("");
      L.push("Comité social et économique de " + cro(p.denomination, "dénomination"));
      L.push("Réunion du " + jj(reunion) + ", à " + cro("", "heure") + ", " + cro("", "lieu") + ".");
      L.push("");
      L.push("Ordre du jour établi par le président, communiqué aux membres du comité, à");
      L.push("l'agent de contrôle de l'inspection du travail et à l'agent des services de");
      L.push("prévention des organismes de sécurité sociale le " + jj(envoi) + " (L. 2315-30).");
      L.push("");
      L.push("1. Approbation du procès-verbal de la réunion précédente.");
      L.push("2. Consultation du comité sur le " + objet + " (L. 1321-4).");
      L.push("3. Questions diverses.");
      L.push("");
      L.push("Le président du comité");
      L.push(cro(p.responsable, "nom et qualité du représentant légal"));
      L.push("");

      L.push("PIÈCE 3 - EXTRAIT DE PROCÈS-VERBAL RECUEILLANT L'AVIS");
      L.push("");
      L.push("Comité social et économique de " + cro(p.denomination, "dénomination"));
      L.push("Extrait du procès-verbal de la réunion du " + jj(reunion) + ".");
      L.push("");
      L.push("Présents : " + cro("", "noms et qualités des membres présents") + ".");
      L.push("Absents excusés : " + cro("", "noms") + ".");
      L.push("Président : " + cro(p.responsable, "nom et qualité") + ".");
      L.push("Secrétaire : " + cro("", "nom du secrétaire") + ".");
      L.push("");
      L.push("Point " + cro("2", "numéro du point") + " de l'ordre du jour : consultation sur le " + objet + ".");
      L.push("");
      L.push("Le projet a été transmis aux membres du comité le " + jj(envoi) + ".");
      L.push("Le président a présenté le projet et répondu aux questions des élus.");
      L.push("Observations des élus : " + cro("", "à retranscrire, même brièvement") + ".");
      L.push("");
      L.push("Le comité, consulté, rend un avis " + cro("", "favorable / défavorable / le comité ne rend pas d'avis") + ".");
      L.push("Votants : " + cro("", "nombre") + ". Pour : " + cro("", "nombre") +
        ". Contre : " + cro("", "nombre") + ". Abstentions : " + cro("", "nombre") + ".");
      L.push("");
      L.push("Le secrétaire du comité : " + cro("", "nom et signature") + ".");
      L.push("Le président : " + cro("", "nom et signature") + ".");
      L.push("");
      L.push("Ce que la loi exige est que le projet ait été soumis à l'avis, non que l'avis");
      L.push("soit favorable : un avis défavorable, ou l'absence d'avis rendu, n'empêche pas");
      L.push("l'introduction du règlement. C'est l'absence de consultation qui l'empêche.");
      L.push("");

      L.push("VOTRE RÉTROPLANNING");
      L.push("");
      var depot = deIso(D.dateDepotGreffe) || dansJours(reunion, 1);
      var publicite = deIso(D.datePublicite) || dansJours(reunion, 1);
      L = L.concat(tableau(["Étape", "Date", "Ce qui se garde"], [
        ["Transmission du projet et de l'ordre du jour", jj(envoi), "copie datée de l'envoi"],
        ["Réunion du comité, avis recueilli", jj(reunion), "procès-verbal signé"],
        ["Dépôt au greffe du conseil de prud'hommes", jj(depot), "récépissé daté"],
        ["Publicité, et communication à l'inspection du travail en deux exemplaires, avec l'avis",
          jj(publicite), "photo de l'affichage, preuve d'envoi"],
        ["Entrée en vigueur, au plus tôt", jj(vigueur), "la date portée dans le règlement"]
      ]));
      L.push("");
      L.push("La publicité et la communication à l'inspection du travail ont lieu en même");
      L.push("temps (L. 1321-4). Le mois qui précède l'entrée en vigueur court à compter de");
      L.push("la dernière en date des formalités de publicité et de dépôt (R. 1321-3) : ici");
      L.push("le " + jj(formalites) + ".");
      L.push("");

      L = L.concat(DP.liens(ctx, ["discipline", "cse"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le règlement intérieur ne peut être introduit qu'après avoir été soumis");
      L.push("à l'avis du comité social et économique » (L. 1321-4). La même formalité");
      L.push("vaut en cas de modification ou de retrait de clauses.");
      L.push("");
      L.push("« L'ordre du jour des réunions du comité social et économique est communiqué");
      L.push("par le président aux membres du comité, à l'agent de contrôle de l'inspection");
      L.push("du travail [...] ainsi qu'à l'agent des services de prévention des organismes");
      L.push("de sécurité sociale trois jours au moins avant la réunion » (L. 2315-30).");
      L.push("");
      L.push("« Le texte du règlement intérieur est transmis à l'inspecteur du travail en");
      L.push("deux exemplaires » (R. 1321-4), accompagné de l'avis du comité.");
      L.push("");

      return L.concat(pied("L. 1321-4, L. 2315-30, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-07 - PUBLICATION ET DÉPÔT
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-07", {
    nom: "La publication du règlement intérieur et son dépôt au greffe",
    detail: "Lieux d'affichage, récépissé du greffe, calendrier des formalités.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Publication et dépôt du règlement intérieur",
        "articles R. 1321-1 et R. 1321-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - PUBLICATION ET DÉPÔT");
      L.push("");
      L.push("LIEUX D'AFFICHAGE");
      L.push("- Panneau du personnel au rez-de-chaussée");
      L.push("- Intranet de l'entreprise");
      L.push("- Bureau d'embauche");
      L.push("");
      L.push("Affichage effectué : 15 septembre 2026");
      L.push("Dépôt au greffe : 15 septembre 2026");
      L.push("Récépissé n° : 2026-123456");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("LIEUX D'AFFICHAGE");
      L.push("- [ÉNUMÉRER CHAQUE LIEU]");
      L.push("");
      L.push("Affichage effectué : [DATE]");
      L.push("Dépôt au greffe : [DATE]");
      L.push("Récépissé n° : [NUMÉRO]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Affichage physique", jj(d0), "photographie du panneau"],
        ["Affichage sur intranet", jj(d0), "capture d'écran"],
        ["Dépôt au greffe", jj(d0), "récépissé signé"],
        ["Communication à l'inspection", jj(d0), "courrier"],
        ["Vérification de l'affichage", jj(dansJours(d0, 15)), "nouvelle photographie"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le réglement intérieur est porté à la connaissance des salariés par tous");
      L.push("les moyens » (R. 1321-1).");
      L.push("");
      L.push("« Un exemplaire du règlement intérieur est adressé au greffe du conseil de");
      L.push("prud'hommes du ressort de l'établissement » (R. 1321-2).");
      L.push("");

      return L.concat(pied("R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-08 - MODIFICATION, RETRAIT, SUSPENSION
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-08", {
    nom: "Modification, retrait ou suspension d'une clause du règlement intérieur",
    detail: "Décision motivée, consultation du comité et calendrier des formalités.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Modification, retrait ou suspension d'une clause du règlement intérieur",
        "articles L. 1321-3 et L. 1321-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - DÉCISION DE RETRAIT");
      L.push("");
      L.push("AAAAA SARL");
      L.push("");
      L.push("DÉCISION DE RETRAIT D'UNE CLAUSE");
      L.push("");
      L.push("La clause prévoyant une fouille sans consentement du salarié est retirée du");
      L.push("règlement intérieur, car elle n'est pas proportionnée au but recherché.");
      L.push("Date d'effet : 1er octobre 2026");
      L.push("Signée par : M. XXXXX, gérant");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("DÉCISION DE [RETRAIT / MODIFICATION / SUSPENSION]");
      L.push("");
      L.push("[QUELLE CLAUSE] : [MOTIVATION DU RETRAIT OU DE LA MODIFICATION]");
      L.push("");
      L.push("Date d'effet : [DATE]");
      L.push("Signée par : [NOM ET QUALITÉ]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Décision de retrait", jj(d0), "texte signé"],
        ["Saisine du comité", jj(dansJours(d0, 1)), "courrier"],
        ["Avis du comité", jj(dansJours(d0, 14)), "procès-verbal"],
        ["Publication et dépôt", jj(dansJours(d0, 15)), "affichage"],
        ["Communication à l'inspection", jj(dansJours(d0, 15)), "courrier"],
        ["Application", jj(dansJours(d0, 45)), "pièce datée"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« La modification ou le retrait d'une clause du règlement intérieur");
      L.push("s'effectue selon les mêmes formalités que l'introduction du règlement »");
      L.push("(L. 1321-4).");
      L.push("");
      L.push("L'employeur peut retirer ou modifier une clause notamment si elle a été");
      L.push("jugée contraire à la loi ou si elle restreint les droits sans justification.");
      L.push("");

      return L.concat(pied("L. 1321-3, L. 1321-4, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-09 - OPPOSITION DE L'INSPECTEUR
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-09", {
    nom: "Opposition de l'inspecteur du travail à une clause du règlement intérieur",
    detail: "Conséquences légales et actions à engager dans les 30 jours.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Opposition de l'inspecteur du travail à une clause",
        "articles L. 1322-1 et L. 1321-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - COURRIER DE L'INSPECTION DU TRAVAIL");
      L.push("");
      L.push("À l'examen du règlement intérieur déposé, l'inspection du travail s'oppose");
      L.push("à la clause relative à la fouille des sacs, jugée disproportionnée.");
      L.push("");
      L.push("Cette clause doit être retirée dans les 30 jours. Sinon, l'inspecteur");
      L.push("saisira le conseil de prud'hommes.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Si vous recevez une opposition de l'inspecteur du travail :");
      L.push("");
      L.push("1. Consultez votre comité social et économique");
      L.push("2. Votez le retrait ou la modification de la clause en question");
      L.push("3. Publiez et déposez l'avenant dans le délai prévu");
      L.push("4. Communiquez la preuve à l'inspection du travail");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Réception de l'opposition", jj(d0), "lettre de l'inspection"],
        ["Consultation du comité", jj(dansJours(d0, 5)), "convocation"],
        ["Décision de retrait", jj(dansJours(d0, 10)), "texte signé"],
        ["Publication de l'avenant", jj(dansJours(d0, 20)), "affichage"],
        ["Communication à l'inspection", jj(dansJours(d0, 21)), "courrier"],
        ["Limite des 30 jours", jj(dansJours(d0, 30)), "date fixée"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "inspection"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« L'inspecteur du travail peut s'opposer à une clause qui contrevient à la");
      L.push("loi. L'employeur dispose d'un délai de 30 jours pour la retirer. Passé ce");
      L.push("délai, l'inspecteur saisit le conseil de prud'hommes » (L. 1322-1).");
      L.push("");
      L.push("C'est une mesure d'ordre public : elle s'impose à tous.");
      L.push("");

      return L.concat(pied("L. 1322-1, L. 1321-4, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-10 - NULLITÉ PAR DÉCISION DE JUSTICE
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-10", {
    nom: "Conséquences d'une décision de justice déclarant une clause nulle",
    detail: "Obligations après une décision de justice et annulation des sanctions.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Conséquences d'une décision de justice concernant le règlement intérieur",
        "articles L. 1321-3 et L. 1333-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CONSÉQUENCES D'UNE DÉCISION JUDICIAIRE");
      L.push("");
      L.push("JUGEMENT : La clause de fouille des sacs est nulle car disproportionnée.");
      L.push("");
      L.push("OBLIGATIONS :");
      L.push("1. Retirer la clause du règlement intérieur");
      L.push("2. Annuler toute sanction fondée uniquement sur cette clause");
      L.push("3. Publier le règlement modifié");
      L.push("4. Redéposer au greffe");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Si une clause est déclarée nulle :");
      L.push("");
      L.push("ARTICLE DU JUGEMENT : [CLAUSE DÉCLARÉE NULLE]");
      L.push("DATE DU JUGEMENT : [DATE]");
      L.push("ACTION : Retrait de la clause du règlement");
      L.push("DATE DE RETRAIT : [DATE]");
      L.push("PREUVE : [PUBLICATION ET DÉPÔT]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Réception du jugement", jj(d0), "copie du jugement"],
        ["Signification du jugement", jj(dansJours(d0, 5)), "acte d'huissier"],
        ["Décision de retrait", jj(dansJours(d0, 10)), "procès-verbal"],
        ["Publication du retrait", jj(dansJours(d0, 15)), "affichage"],
        ["Dépôt à nouveau", jj(dansJours(d0, 15)), "récépissé"],
        ["Révision des sanctions", jj(dansJours(d0, 30)), "liste annulée"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "conseil"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Une décision de justice déclarant une clause du règlement intérieur nulle");
      L.push("s'impose à l'employeur. Il doit la retirer et annuler les sanctions");
      L.push("prononcées sur son fondement exclusif. Les salariés ayant subi des mesures");
      L.push("fondées sur la même clause peuvent demander réparation.");
      L.push("");

      return L.concat(pied("L. 1333-2, L. 1321-3, L. 1321-4, R. 1321-1, R. 1321-2")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-11 - RÉCAPITULATIF DE RÉVISION
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-11", {
    nom: "Récapitulatif de révision du règlement intérieur",
    detail: "Grille complète de ce qu'un règlement doit contenir et des pièges.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Récapitulatif de révision du règlement intérieur",
        "articles L. 1321-1 et L. 1321-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - GRILLE DE RÉVISION COMPLÈTE");
      L.push("");
      L.push("Le règlement intérieur comporte :");
      L.push("");
      L.push("1° Santé-sécurité : OUI | Instructions précises | Daté");
      L.push("2° Participation au rétablissement : OUI | Conditions précises | Daté");
      L.push("3° Discipline : OUI | Échelle complète | Durée max. fixée");
      L.push("");
      L.push("Le règlement intérieur rappelle :");
      L.push("1° Droits de la défense : OUI | Articles L. 1332-1 à L. 1332-3 | Daté");
      L.push("2° Harcèlements : OUI | Dispositions complètes | Daté");
      L.push("3° Lanceurs d'alerte : OUI | Existence rappelée | Daté");
      L.push("");
      L.push("Contrôle de proportionnalité des clauses :");
      L.push("Aucune clause contraire aux lois : OUI");
      L.push("Chaque restriction est justifiée ET proportionnée : OUI");
      L.push("Aucune discrimination : OUI");
      L.push("Aucune amende ni sanction pécuniaire : OUI");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("POINT | PRÉSENT | COMPLET | APPROUVÉ");
      L.push("------|---------|---------|----------");
      L.push("Santé-sécurité | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("Participation | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("Discipline | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("Droits défense | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("Harcèlement | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("Lanceurs alerte | [OUI/NON] | [OUI/NON] | [OUI/NON]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Rédaction du règlement", jj(d0), "texte brouillon"],
        ["Revue interne", jj(dansJours(d0, 5)), "liste des points"],
        ["Consultation du comité", jj(dansJours(d0, 15)), "procès-verbal"],
        ["Modifications si nécessaire", jj(dansJours(d0, 20)), "texte révisé"],
        ["Publication", jj(dansJours(d0, 30)), "affichage"],
        ["Dépôt au greffe", jj(dansJours(d0, 30)), "récépissé"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "cse"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Le règlement intérieur doit contenir les trois matières de L. 1321-1 et");
      L.push("rappeler les trois points de L. 1321-2. Il ne peut contenir que ce qui est");
      L.push("autorisé. Chaque restriction aux droits doit être justifiée par la nature");
      L.push("de la tâche ET proportionnée au but. Les droits à la vie privée, à la");
      L.push("liberté d'expression, à la liberté de conscience doivent être respectés.");
      L.push("");

      return L.concat(pied("L. 1321-1, L. 1321-2, L. 1321-3, L. 1321-4, L. 1331-2, R. 1321-1, R. 1321-2, R. 1321-3, R. 1321-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-RI-12 - TRANSFERT D'ENTREPRISE
     =================================================================== */

  DP.ajouter("DIS-CTL-RI-12", {
    nom: "Transfert d'entreprise et maintien du règlement intérieur",
    detail: "Continuité et adaptation du règlement à la suite d'un transfert.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Transfert d'entreprise et règlement intérieur",
        "article L. 1224-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - COMMUNICATION LORS D'UN TRANSFERT");
      L.push("");
      L.push("Le règlement intérieur s'applique intégralement aux salariés qui ont suivi");
      L.push("le transfert vers la nouvelle entité.");
      L.push("");
      L.push("Les points suivants sont adaptés :");
      L.push("- Nouvelle dénomination de l'entreprise");
      L.push("- Nouveaux lieux de travail");
      L.push("- Nouvelle hiérarchie");
      L.push("");
      L.push("Les salariés sont informés le 1er septembre 2026.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("LE RÈGLEMENT INTÉRIEUR LORS D'UN TRANSFERT");
      L.push("");
      L.push("1. Règlement de l'entreprise transférée : [OUI / À ADAPTER]");
      L.push("");
      L.push("2. Points à adapter à la nouvelle entité :");
      L.push("   [ÉNUMÉRER]");
      L.push("");
      L.push("3. Communication aux salariés :");
      L.push("   Date : [DATE]");
      L.push("   Moyen : [ÉCRIT / RÉUNION / AFFICHAGE]");
      L.push("   Preuve : [LISTE DE DIFFUSION]");
      L.push("");

      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Notification du transfert", jj(d0), "acte de transfert"],
        ["Consultation du comité", jj(dansJours(d0, 5)), "convocation"],
        ["Adaptation du règlement", jj(dansJours(d0, 10)), "texte modifié"],
        ["Publication du nouveau texte", jj(dansJours(d0, 15)), "affichage"],
        ["Communication aux salariés", jj(dansJours(d0, 15)), "liste de diffusion"],
        ["Dépôt au nouveau greffe", jj(dansJours(d0, 20)), "récépissé"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "transfert"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Lors d'un transfert d'entreprise au sens de L. 1224-1, le règlement");
      L.push("intérieur de l'entreprise transférante s'applique aux salariés qui ont");
      L.push("suivi le transfert, jusqu'à ce qu'un nouveau règlement soit mis en place.");
      L.push("Les adaptations nécessaires doivent être rapidement communiquées et formalisées.");
      L.push("");

      return L.concat(pied("L. 1224-3, L. 1321-4, R. 1321-1, R. 1321-2")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-SAN-01 - LETTRE DE CONVOCATION
     =================================================================== */

  DP.ajouter("DIS-CTL-SAN-01", {
    nom: "La lettre de convocation à l'entretien préalable à sanction",
    detail: "Délai de 2 mois depuis la connaissance des faits, délais de l'entretien.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Lettre de convocation à l'entretien préalable à sanction",
        "articles L. 1332-2, R. 1332-1, R. 1332-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - CONVOCATION À L'ENTRETIEN");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("");
      L.push("À [NOM DU SALARIÉ]");
      L.push("[fonction]");
      L.push("[adresse]");
      L.push("");
      L.push("[lieu], le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec demande d'avis de réception");
      L.push("");
      L.push("Objet : Convocation à un entretien le 15 septembre 2026 à 10 h");
      L.push("");
      L.push("Monsieur,");
      L.push("");
      L.push("Vous êtes convoqué pour un entretien préalable le 15 septembre 2026 à 10 h.");
      L.push("Cet entretien porte sur [DESCRIPTION FACTUELLE DES FAITS].");
      L.push("");
      L.push("Vous pouvez vous faire assister par une personne du personnel.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple, avec vos données et délais.");
      L.push("");
      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Connaissance des faits", jj(d0), "signalement ou rapport"],
        ["Début du délai de 2 mois", jj(d0), "date fixée"],
        ["Rédaction de la convocation", jj(dansJours(d0, 5)), "texte signé"],
        ["Envoi de la convocation", jj(dansJours(d0, 10)), "recommandé"],
        ["Entretien avec le salarié", jj(dansJours(d0, 17)), "procès-verbal"],
        ["Limite du délai de 2 mois", jj(dansJours(d0, 60)), "date limite"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "procedure"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Aucun fait fautif ne peut donner lieu à l'engagement de poursuites");
      L.push("disciplinaires au-delà d'un délai de deux mois à compter du jour où");
      L.push("l'employeur en a eu connaissance » (L. 1332-4).");
      L.push("");
      L.push("« La lettre de convocation est remise contre récépissé ou adressée par");
      L.push("lettre recommandée, dans le délai de deux mois » (R. 1332-1).");
      L.push("");

      return L.concat(pied("L. 1332-2, L. 1332-4, R. 1332-1, R. 1332-2, R. 1332-3")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-SAN-02 - COMPTE RENDU DE L'ENTRETIEN
     =================================================================== */

  DP.ajouter("DIS-CTL-SAN-02", {
    nom: "Le compte rendu de l'entretien préalable à sanction",
    detail: "Document factuel avec les explications du salarié.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Compte rendu de l'entretien préalable à sanction",
        "articles L. 1332-2, R. 1332-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - COMPTE RENDU D'ENTRETIEN");
      L.push("");
      L.push("ENTRETIEN DU 15 SEPTEMBRE 2026 À 10 H");
      L.push("Avec : M. Jean MARTIN, conducteur");
      L.push("Présent : M. XXXXX, gérant");
      L.push("Assistant du salarié : [si l'une demande]");
      L.push("");
      L.push("FAITS REPROCHÉS");
      L.push("Absence sans justification du 10 au 12 septembre 2026.");
      L.push("");
      L.push("EXPLICATIONS DU SALARIÉ");
      L.push("M. Martin déclare avoir eu un problème familial urgent. Il n'a pas pu");
      L.push("informer l'entreprise immédiatement mais a envoyé un texte le 12 au soir.");
      L.push("");
      L.push("CONCLUSION DE L'EMPLOYEUR");
      L.push("L'absence est établie. La justification fournie sera examinée. Une décision");
      L.push("interviendra dans le délai prévu.");
      L.push("");
      L.push("Signé le 15 septembre 2026 : [signature]");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple, avec neutralité rigoureuse.");
      L.push("");
      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Convocation envoyée", jj(d0), "recommandé"],
        ["Entretien prévu", jj(dansJours(d0, 7)), "courrier"],
        ["Entretien tenu", jj(dansJours(d0, 7)), "compte rendu"],
        ["Compte rendu signé", jj(dansJours(d0, 7)), "signature"],
        ["Remise au salarié", jj(dansJours(d0, 8)), "reçu"],
        ["Fenêtre de notification", jj(dansJours(d0, 37)), "entre 2j et 1 mois"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "procedure"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Lors de son audition, le salarié peut se faire assister par une personne");
      L.push("du personnel. L'employeur indique le motif de la sanction envisagée et");
      L.push("recueille les explications du salarié » (L. 1332-2).");
      L.push("");
      L.push("Le compte rendu doit être factuel, sans interprétation ni conclusion");
      L.push("prématurée sur la culpabilité.");
      L.push("");

      return L.concat(pied("L. 1332-2, R. 1332-2, R. 1332-3")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-SAN-03 - NOTIFICATION DE LA SANCTION
     =================================================================== */

  DP.ajouter("DIS-CTL-SAN-03", {
    nom: "La notification motivée de la sanction disciplinaire",
    detail: "Délais de notification, motivation requise, notification correcte.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Notification motivée de la sanction disciplinaire",
        "articles L. 1332-2, R. 1332-2, R. 1332-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - NOTIFICATION DE SANCTION");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("");
      L.push("À [NOM DU SALARIÉ]");
      L.push("[adresse]");
      L.push("");
      L.push("[lieu], le " + leJour(d0));
      L.push("");
      L.push("Lettre recommandée avec avis de réception");
      L.push("");
      L.push("Objet : Notification d'une sanction disciplinaire");
      L.push("");
      L.push("Monsieur,");
      L.push("");
      L.push("À l'issue de l'entretien du 15 septembre 2026, la sanction suivante est");
      L.push("prononcée à votre encontre.");
      L.push("");
      L.push("SANCTION : Avertissement écrit");
      L.push("MOTIF : Absence sans justification, en violation de votre obligation");
      L.push("de présence au travail.");
      L.push("");
      L.push("Cette sanction prend effet immédiatement.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple.");
      L.push("");
      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Entretien tenu", jj(d0), "compte rendu"],
        ["Au plus tôt : 2j ouvrables", jj(dansJours(d0, 3)), "calendrier"],
        ["Au plus tard : 1 mois", jj(dansJours(d0, 30)), "limite"],
        ["Notification de la sanction", jj(dansJours(d0, 20)), "recommandé"],
        ["Signature du salarié", jj(dansJours(d0, 21)), "reçu"],
        ["Inscription au dossier", jj(dansJours(d0, 22)), "dossier"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "procedure"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« La sanction ne peut intervenir moins de deux jours ouvrables, ni plus");
      L.push("d'un mois après l'entretien. Elle est motivée et notifiée à l'intéressé »");
      L.push("(L. 1332-2).");
      L.push("");
      L.push("La motivation doit exposer le fait fautif et le fondement de la sanction.");
      L.push("Elle peut être formulée dans la lettre elle-même.");
      L.push("");

      return L.concat(pied("L. 1332-2, L. 1333-2, R. 1332-2, R. 1332-3")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-SAN-04 - MISE À PIED CONSERVATOIRE
     =================================================================== */

  DP.ajouter("DIS-CTL-SAN-04", {
    nom: "La mise à pied conservatoire à effet immédiat",
    detail: "Conditions d'une mise à pied d'urgence, durée, procédure accélérée.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Mise à pied conservatoire à effet immédiat",
        "articles L. 1332-3, R. 1332-2 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - MISE À PIED CONSERVATOIRE");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("");
      L.push("À [NOM DU SALARIÉ]");
      L.push("[adresse]");
      L.push("");
      L.push("[lieu], le " + leJour(d0) + " à 16 h");
      L.push("");
      L.push("Remise en main propre");
      L.push("");
      L.push("Objet : Mise à pied conservatoire");
      L.push("");
      L.push("Monsieur,");
      L.push("");
      L.push("Suite aux faits du 10 septembre 2026, vous êtes mis à pied à effet");
      L.push("immédiat, jusqu'à l'entretien préalable à sanction, sans constituer une");
      L.push("sanction définitive.");
      L.push("");
      L.push("Durée provisoire : du 10 au 15 septembre 2026");
      L.push("Entretien prévu : 15 septembre 2026 à 10 h");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple.");
      L.push("");
      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Faits découverts", jj(d0), "signalement"],
        ["Mise à pied conservatoire", jj(d0), "notification"],
        ["Convocation à l'entretien", jj(dansJours(d0, 1)), "recommandé"],
        ["Entretien tenu", jj(dansJours(d0, 6)), "compte rendu"],
        ["Au plus tard 1 mois", jj(dansJours(d0, 29)), "délai limite"],
        ["Décision définitive", jj(dansJours(d0, 30)), "notification"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "procedure"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Lorsque les faits reprochés ont rendu indispensable une mesure");
      L.push("conservatoire de mise à pied à effet immédiat, aucune sanction définitive");
      L.push("ne peut être prise sans que la procédure de L. 1332-2 ait été respectée »");
      L.push("(L. 1332-3).");
      L.push("");
      L.push("La mise à pied conservatoire n'est pas une sanction : c'est une mesure");
      L.push("d'urgence. La sanction définitive ne peut dépasser sa durée.");
      L.push("");

      return L.concat(pied("L. 1332-3, L. 1333-2, R. 1332-2, R. 1332-3")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-SAN-05 - RETRAIT OU ANNULATION
     =================================================================== */

  DP.ajouter("DIS-CTL-SAN-05", {
    nom: "Retrait ou annulation d'une sanction disciplinaire",
    detail: "Procédure de retrait à l'initiative de l'employeur.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Retrait ou annulation d'une sanction disciplinaire",
        "articles L. 1333-3, L. 1333-4 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - RETRAIT DE SANCTION");
      L.push("");
      L.push(cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("");
      L.push("À [NOM DU SALARIÉ]");
      L.push("[adresse]");
      L.push("");
      L.push("[lieu], le " + leJour(d0));
      L.push("");
      L.push("Objet : Retrait de l'avertissement du 25 septembre 2026");
      L.push("");
      L.push("Monsieur,");
      L.push("");
      L.push("À la suite de votre demande de recours, nous avons réexaminé votre");
      L.push("situation. Nous retirons l'avertissement prononcé le 25 septembre 2026.");
      L.push("Cet avertissement ne figurera pas à votre dossier.");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple.");
      L.push("");
      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Sanction originelle", jj(d0), "notification"],
        ["Salarié demande révision", jj(dansJours(d0, 10)), "courrier"],
        ["Réexamen par l'employeur", jj(dansJours(d0, 15)), "analyse"],
        ["Décision de retrait", jj(dansJours(d0, 20)), "texte signé"],
        ["Notification au salarié", jj(dansJours(d0, 21)), "lettre"],
        ["Effacement du dossier", jj(dansJours(d0, 22)), "dossier"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "recours"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« L'employeur peut à tout moment retirer une sanction du dossier du");
      L.push("salarié » (L. 1333-3). Cette action est unilatérale, sans délai.");
      L.push("");
      L.push("« Si le salarié conteste la sanction et obtient son annulation, la sanction");
      L.push("est retirée du dossier » (L. 1333-4).");
      L.push("");

      return L.concat(pied("L. 1333-3, L. 1333-4")).join("\n");
    }
  });

  /* ===================================================================
     DIS-CTL-SAN-06 - RECOURS DEVANT LE CONSEIL DE PRUD'HOMMES
     =================================================================== */

  DP.ajouter("DIS-CTL-SAN-06", {
    nom: "Contestation de la sanction devant le conseil de prud'hommes",
    detail: "Délais de saisine, moyens de contestation, interventions possibles.",
    produire: function (ctx) {
      var p = ctx.profil || {};
      var d0 = ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
      var L = entete(ctx, "Contestation de sanction devant le conseil de prud'hommes",
        "articles L. 1333-1, L. 1333-2, L. 1333-3 du code du travail");

      L.push(DP.EXEMPLE);
      L.push("");
      L.push("EXEMPLE - SAISINE DU CONSEIL DE PRUD'HOMMES");
      L.push("");
      L.push("REQUÊTE EN CONTESTATION DE SANCTION");
      L.push("");
      L.push("Demandeur : M. Jean MARTIN");
      L.push("Défendeur : " + cro(p.denomination || p.entreprise, "DÉNOMINATION"));
      L.push("");
      L.push("Objet : Contestation de l'avertissement du 25 septembre 2026");
      L.push("");
      L.push("MOYENS");
      L.push("1. La convocation n'a pas précisé l'objet de l'entretien");
      L.push("2. L'absence s'explique par un motif familial établi");
      L.push("3. La sanction est disproportionnée aux faits");
      L.push("");
      L.push("DEMANDES");
      L.push("- Annulation de la sanction");
      L.push("- Retrait du dossier");
      L.push("- Réparation du préjudice");
      L.push("");

      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Consultez un avocat ou le défenseur des salariés pour cette procédure.");
      L.push("");
      L.push("VOTRE CALENDRIER");
      L.push("");
      L = L.concat(tableau(["Étape", "Date", "Preuve conservée"], [
        ["Notification de la sanction", jj(d0), "lettre recommandée"],
        ["Délai de 2 ans pour saisir", jj(dansJours(d0, 730)), "date limite"],
        ["Demande de conciliation", jj(dansJours(d0, 30)), "convocation"],
        ["Conciliation ou rupture", jj(dansJours(d0, 60)), "procès-verbal"],
        ["Requête si pas d'accord", jj(dansJours(d0, 90)), "dossier"],
        ["Audience de jugement", jj(dansJours(d0, 180)), "convocation"]
      ]));

      L = L.concat(DP.liens(ctx, ["discipline", "prud"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le salarié peut contester la sanction devant le conseil de prud'hommes »");
      L.push("(L. 1333-1). Le délai est de 2 ans à partir de la notification.");
      L.push("");
      L.push("« Le conseil vérifie que la sanction est justifiée et proportionnée. Il peut");
      L.push("l'annuler si elle est irrégulière en la forme ou disproportionnée » (L. 1333-2).");
      L.push("");

      return L.concat(pied("L. 1333-1, L. 1333-2, L. 1333-3, L. 1333-4")).join("\n");
    }
  });

})(typeof window !== "undefined" ? window : this);
