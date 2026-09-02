/* Les documents que l'application PRODUIT — santé, sécurité et conditions de
   travail.

   POURQUOI CE FICHIER EXISTE

   Le module d'audit dit ce qui manque ; les fiches de régularisation disent
   quoi faire. Aucun des deux ne fait le travail : un employeur à qui l'on
   explique en cinq étapes comment évaluer ses risques n'a toujours pas de
   document unique. Ce fichier écrit la pièce elle-même — le document unique
   avec ses colonnes et sa maille par unité de travail, le programme annuel de
   prévention, l'acte qui crée la commission santé-sécurité, l'affichage sur
   les harcèlements, la procédure d'enquête et sa trame d'audition — au nom de
   l'entreprise, avec les courriers qui vont avec et le calendrier calculé.

   TROIS RÈGLES ONT COMMANDÉ L'ÉCRITURE, ET AUCUNE N'A PLIÉ

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Chaque article cité ici figure dans
      moteur/sst/textes-sst.json avec son identifiant de version, ou dans le
      fondement du contrôle auquel le document répond. Les articles seulement
      RENVOYÉS par un texte lu — L. 4122-1, L. 4644-1, L. 4622-1, L. 4521-1 et
      suivants, L. 2312-9, L. 4161-1, L. 2313-2, L. 2314-3, L. 2315-3,
      L. 2315-16 et L. 2315-17, L. 1121-2, L. 1142-2-1, L. 1153-3, et les
      articles 222-33 et 222-33-2 du code pénal — sont NOMMÉS, jamais
      reproduits ni paraphrasés. Le document le dit à l'endroit exact où le
      lecteur pourrait croire que l'application les connaît. Le relais
      Légifrance du dépôt ne sert que le code du travail : les deux articles du
      code pénal que L. 1152-4 et L. 1153-5 obligent à afficher sortent donc en
      crochets, avec la consigne d'aller les chercher.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ, ET QUI NE
      VISE L'OBLIGATION EN CAUSE. Le périmètre a été vérifié article par
      article, et il est étroit :
        · R. 4741-1 punit une chose et une seule — le défaut de transcription
          et le défaut de mise à jour « dans les conditions prévues aux
          articles R. 4121-1 et R. 4121-2 ». Il fonde donc DUE-01 à DUE-04, et
          rien d'autre.
        · L. 4741-1 ne rattrape pas les principes généraux de prévention : son
          énumération vise, pour le livre Ier de la quatrième partie, les
          « Titres Ier, III et IV » — le titre II, où vivent L. 4121-1 à
          L. 4121-3-1, en est absent. Il n'est donc invoqué pour AUCUN document
          de ce fichier.
        · R. 4741-3 ne l'atteint pas davantage, quoique son objet — « les
          documents et affichages obligatoires » — puisse le laisser croire :
          son énumération est close (L. 4711-1 à L. 4711-5, D. 4711-1 à
          D. 4711-3), et R. 4121-4, qui porte l'avis d'accès au document
          unique, n'y est pas. Il n'est invoqué nulle part.
        · L. 2317-1 punit deux faits, et deux seulement : l'entrave à la
          constitution du comité ou à la libre désignation de ses membres, et
          l'entrave à son fonctionnement régulier. Il n'est invoqué que là où
          le module le retient — la consultation du comité sur le document
          unique (DUE-07) et la commission absente là où elle est due
          (CSS-01).
        · L. 1155-2 ne punit que « les faits de discriminations commis à la
          suite d'un harcèlement moral ou sexuel » : les représailles, pas
          l'organisation de la prévention. Il n'est invoqué qu'en HAR-05.
      Partout ailleurs, ce qui se joue est civil : l'obligation de sécurité de
      L. 4121-1, l'irrégularité opposable, l'annulation d'une désignation. Les
      documents le disent, plutôt que d'agiter une amende qui n'existe pas.

   3. LES FAITS NE S'INVENTENT JAMAIS. Aucun document de ce fichier n'écrit les
      risques réels de l'entreprise, ses unités de travail, ses postes, ses
      accidents, ni ce qu'un salarié aurait fait ou subi. Tout cela sort ENTRE
      CROCHETS, avec la consigne de l'écrire daté et circonstancié. Sur le
      harcèlement, la règle est vitale : aucune lettre, aucune trame, aucun
      rapport produit ici ne qualifie les faits à la place de l'enquête. Un
      document qui écrirait « les faits de harcèlement établis » avant
      l'audition de la personne mise en cause serait une pièce à charge contre
      son propre auteur.

   LES SEUILS NE SE SUPPOSENT PAS. Onze salariés pour la mise à jour annuelle,
   cinquante pour le programme annuel de prévention, deux cent cinquante pour le
   référent de l'employeur, trois cents pour la commission et pour la formation
   de cinq jours en renouvellement : quand l'effectif n'est pas renseigné, aucun
   document ne tranche. Il expose les deux branches et laisse le lecteur porter
   son chiffre.                                                              */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function")
    throw new Error("documents-sst.js : documents-produits.js doit être chargé avant.");

  var O = DP.outils;
  var cro = O.cro, leJour = O.leJour, dans = O.dans, entete = O.entete;

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var GROS  = "════════════════════════════════════════════════════════════════════════";

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE DATE

     Les mêmes que ceux du module discipline, et pour la même raison : les
     dates du dossier sont des chaînes « AAAA-MM-JJ », lues en heure locale.
     Un midi UTC suffirait à décaler d'un jour l'affichage chez un lecteur
     situé assez à l'ouest, et un document daté du mauvais jour est pire qu'un
     document non daté.
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
  /* Le même quantième, n mois plus tard. Sert à dire quand échoit l'année de
     R. 4121-2, 1°, comptée depuis la dernière version du document unique. */
  function moisApres(iso, n) {
    if (!estISO(iso)) return null;
    var p = iso.split("-").map(Number);
    var t = p[0] * 12 + (p[1] - 1) + n;
    var an = Math.floor(t / 12), mo = t - an * 12 + 1;
    var dernier = new Date(an, mo, 0).getDate();
    return isoDe(new Date(an, mo - 1, Math.min(p[2], dernier)));
  }
  function aujourd(ctx) {
    return ctx && ctx.aujourdhui instanceof Date && !isNaN(ctx.aujourdhui.getTime())
      ? ctx.aujourdhui : new Date();
  }

  /* ════════════════════════════════════════════════════════════════════════
     LES OUTILS DE TEXTE ET D'EFFECTIF
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
                   : "Effectif : [EFFECTIF DE L'ENTREPRISE — non renseigné]. Plusieurs " +
                     "obligations en dépendent : portez-le avant de choisir une branche.";
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
    L.push("accords, votre règlement intérieur et la réglementation technique propre");
    L.push("à votre activité peuvent ajouter des exigences que l'application ne lit");
    L.push("pas. Ne laissez aucun crochet dans le texte que vous adoptez, affichez ou");
    L.push("transmettez.");
    return L;
  }

  /* L'avertissement qui revient partout où l'application nomme un article
     qu'elle n'a pas lu. Il est écrit à l'endroit du renvoi, jamais relégué en
     note de bas de page. */
  function blocRenvoi(articles, quoi) {
    return [
      "[ARTICLE NON LU PAR L'APPLICATION — " + articles + " " +
        (quoi || "est nommé ici parce qu'un texte lu y renvoie") + ".",
      " L'application ne l'a pas capté et n'en reproduit donc pas le contenu.",
      " Allez le lire avant de vous en servir.]",
      "",
    ];
  }

  /* L'en-tête d'un courrier : qui écrit, d'où, quand. */
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

  /* La ligne de tableau du document unique : elle sert au modèle vierge comme
     à l'inventaire annexé, et les deux doivent avoir exactement les mêmes
     colonnes — un employeur qui remplit deux grilles différentes finit avec
     deux documents qui ne se recoupent pas. */
  var COLONNES = [
    "  Risque identifié      | Exposition        | Mesures existantes  | Mesures à prendre   | Échéance   | Responsable",
    "  ----------------------|-------------------|---------------------|---------------------|------------|-------------",
  ];
  function ligneVide() {
    return "  [....................] | [.................] | [.................] | [.................] | [........] | [...........]";
  }
  function grilleUnite(nom) {
    var L = ["UNITÉ DE TRAVAIL : " + nom, ""];
    L = L.concat(COLONNES);
    for (var i = 0; i < 4; i++) L.push(ligneVide());
    L.push("");
    return L;
  }

  /* Le rappel de la maille, écrit une fois et repris partout : c'est la
     découpe qui commande tout le reste du document unique. */
  function blocMaille() {
    return [
      "LA MAILLE : L'UNITÉ DE TRAVAIL",
      "",
      "« Cette évaluation comporte un inventaire des risques identifiés dans chaque",
      "unité de travail de l'entreprise ou de l'établissement, y compris ceux liés",
      "aux ambiances thermiques » (R. 4121-1).",
      "",
      "L'unité de travail n'est pas l'organigramme : c'est le regroupement des",
      "situations d'exposition semblables — un atelier, une tournée, un poste, un",
      "site. Un document unique qui reprend les directions de l'entreprise au lieu",
      "des situations de travail ne répond pas à R. 4121-1, parce qu'il ne permet",
      "pas de dire à quoi tel travailleur est exposé.",
      "",
      "[LISTER ICI VOS UNITÉS DE TRAVAIL, une par ligne, avec le nombre de",
      " travailleurs concernés. L'application ne connaît ni vos sites, ni vos",
      " métiers, ni vos postes, et ne les inventera pas.]",
      "",
    ];
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-01 — LE DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES

     C'est la pièce maîtresse du module, et la plus longue : la loi n'en fixe
     pas la forme, mais elle en fixe le contenu (l'ensemble des risques, la
     traçabilité collective des expositions) et la maille (chaque unité de
     travail). Le document produit ici porte cette structure, avec ses six
     colonnes ; ce qu'il ne porte pas, ce sont les risques de l'entreprise —
     l'application ne les connaît pas.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-01", {
    nom: "Le document unique d'évaluation des risques professionnels",
    detail: "Le document rédigé, avec sa maille par unité de travail, ses six " +
            "colonnes, ses suites, ses formalités et son calendrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var e = effectifDe(ctx);
      var L = entete(ctx, "Document unique d'évaluation des risques professionnels",
        "articles L. 4121-1 à L. 4121-3-1 et R. 4121-1 à R. 4121-4 du code du travail");

      L.push("COMMENT SE SERVIR DE CE DOCUMENT");
      L.push("");
      L.push("Ce texte est la charpente du document unique : sa maille, ses colonnes,");
      L.push("ses rubriques obligatoires et les formalités qui le suivent. Ce qu'il ne");
      L.push("contient pas, ce sont VOS risques — l'application ne connaît ni vos");
      L.push("postes, ni vos machines, ni vos produits, ni vos accidents, et elle ne les");
      L.push("inventera pas. Le document unique d'un autre ne vaut rien pour vous : un");
      L.push("modèle de branche recopié sans être repris n'est pas une transcription de");
      L.push("VOTRE évaluation.");
      L.push("");
      L.push("Remplissez unité de travail par unité de travail. Chaque crochet est un");
      L.push("travail à faire, pas une case à cocher. Ne laissez aucun crochet dans le");
      L.push("document que vous datez et signez.");
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE AUJOURD'HUI");
      L.push("");
      L.push("  · document unique existant : " +
        etat(du.existe, "OUI", "NON — c'est l'objet de ce document"));
      L.push("  · inventaire par unité de travail : " + etat(du.unitesTravail, "oui", "NON"));
      L.push("  · dernière mise à jour : " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  · versions successives conservées : " + etat(du.versionsConservees, "oui", "NON"));
      L.push("  · avis d'accès affiché : " + etat(du.avisAffiche, "oui", "NON"));
      L.push("  · comité consulté : " + etat(du.consultationCSE, "oui", "NON"));
      L.push("  · transmis au service de prévention et de santé au travail : " +
        etat(du.transmisSPST, "oui", "NON"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push("DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("Version [n° de version] — établie le [DATE D'ÉTABLISSEMENT]");
      L.push("Rédacteur : [nom et qualité] · Validation : " + signataire(ctx));
      L.push("");

      L.push("════ 1. OBJET ET PORTÉE ════");
      L.push("");
      L.push("Le présent document transcrit les résultats de l'évaluation des risques");
      L.push("pour la santé et la sécurité des travailleurs à laquelle l'employeur");
      L.push("procède en application de l'article L. 4121-3 du code du travail");
      L.push("(R. 4121-1).");
      L.push("");
      L.push("Il « répertorie l'ensemble des risques professionnels auxquels sont");
      L.push("exposés les travailleurs et assure la traçabilité collective de ces");
      L.push("expositions » (L. 4121-3-1, I). Ces deux fonctions commandent sa forme :");
      L.push("un document qui ne répertorie qu'une partie des risques, ou qui ne permet");
      L.push("pas de retrouver dans quinze ans à quoi une unité de travail était");
      L.push("exposée, ne remplit ni l'une ni l'autre.");
      L.push("");
      L.push("Il est dû par TOUT employeur, sans seuil d'effectif.");
      L.push("");
      L.push("Périmètre couvert : [ÉNUMÉRER LES ÉTABLISSEMENTS ET LES SITES COUVERTS.");
      L.push("Un document d'entreprise qui laisse un établissement hors champ laisse");
      L.push("ses travailleurs sans évaluation.]");
      L.push("");

      L.push("════ 2. L'OBLIGATION QUI COMMANDE L'ÉVALUATION ════");
      L.push("");
      L.push("« L'employeur prend les mesures nécessaires pour assurer la sécurité et");
      L.push("protéger la santé physique et mentale des travailleurs. Ces mesures");
      L.push("comprennent : 1° Des actions de prévention des risques professionnels, y");
      L.push("compris ceux mentionnés à l'article L. 4161-1 ; 2° Des actions");
      L.push("d'information et de formation ; 3° La mise en place d'une organisation et");
      L.push("de moyens adaptés. L'employeur veille à l'adaptation de ces mesures pour");
      L.push("tenir compte du changement des circonstances et tendre à l'amélioration");
      L.push("des situations existantes » (L. 4121-1).");
      L.push("");
      L = L.concat(blocRenvoi("L. 4161-1",
        "est nommé par L. 4121-1 pour désigner les facteurs de risques professionnels"));
      L.push("« L'employeur, compte tenu de la nature des activités de l'établissement,");
      L.push("évalue les risques pour la santé et la sécurité des travailleurs, y");
      L.push("compris dans le choix des procédés de fabrication, des équipements de");
      L.push("travail, des substances ou préparations chimiques, dans l'aménagement ou");
      L.push("le réaménagement des lieux de travail ou des installations, dans");
      L.push("l'organisation du travail et dans la définition des postes de travail.");
      L.push("Cette évaluation des risques tient compte de l'impact différencié de");
      L.push("l'exposition au risque en fonction du sexe » (L. 4121-3).");
      L.push("");
      L.push("Cette dernière phrase n'est pas décorative : elle impose de se demander,");
      L.push("pour chaque unité, si l'exposition diffère selon le sexe des travailleurs");
      L.push("— et d'écrire la réponse.");
      L.push("");

      L.push("════ 3. LES NEUF PRINCIPES GÉNÉRAUX DE PRÉVENTION ════");
      L.push("(L. 4121-2 — ils commandent l'ORDRE des mesures, non leur seule liste)");
      L.push("");
      L.push("  1° Éviter les risques ;");
      L.push("  2° Évaluer les risques qui ne peuvent pas être évités ;");
      L.push("  3° Combattre les risques à la source ;");
      L.push("  4° Adapter le travail à l'homme, en particulier en ce qui concerne la");
      L.push("     conception des postes de travail ainsi que le choix des équipements");
      L.push("     de travail et des méthodes de travail et de production, en vue");
      L.push("     notamment de limiter le travail monotone et le travail cadencé et de");
      L.push("     réduire les effets de ceux-ci sur la santé ;");
      L.push("  5° Tenir compte de l'état d'évolution de la technique ;");
      L.push("  6° Remplacer ce qui est dangereux par ce qui n'est pas dangereux ou par");
      L.push("     ce qui est moins dangereux ;");
      L.push("  7° Planifier la prévention en y intégrant, dans un ensemble cohérent, la");
      L.push("     technique, l'organisation du travail, les conditions de travail, les");
      L.push("     relations sociales et l'influence des facteurs ambiants, notamment les");
      L.push("     risques liés au harcèlement moral et au harcèlement sexuel, tels");
      L.push("     qu'ils sont définis aux articles L. 1152-1 et L. 1153-1, ainsi que");
      L.push("     ceux liés aux agissements sexistes définis à l'article L. 1142-2-1 ;");
      L.push("  8° Prendre des mesures de protection collective en leur donnant la");
      L.push("     priorité sur les mesures de protection individuelle ;");
      L.push("  9° Donner les instructions appropriées aux travailleurs.");
      L.push("");
      L.push("Le 7° a une conséquence directe sur ce document : les risques de");
      L.push("harcèlement et d'agissements sexistes s'inscrivent dans les grilles");
      L.push("ci-dessous, comme les autres. Un document unique muet sur ces risques est");
      L.push("incomplet au regard de L. 4121-2, 7°.");
      L.push("");
      L = L.concat(blocRenvoi("L. 1142-2-1",
        "est nommé par L. 4121-2, 7°, comme définissant les agissements sexistes"));
      L.push("Le 8° a une autre conséquence : dans la colonne « mesures à prendre », une");
      L.push("protection individuelle ne se justifie qu'après avoir écrit pourquoi la");
      L.push("protection collective ne suffit pas. C'est un ordre, pas un choix.");
      L.push("");

      L.push("════ 4. LES CONTRIBUTIONS APPELÉES À L'ÉVALUATION ════");
      L.push("(L. 4121-3)");
      L.push("");
      L.push("« Apportent leur contribution à l'évaluation des risques professionnels");
      L.push("dans l'entreprise : 1° Dans le cadre du dialogue social dans l'entreprise,");
      L.push("le comité social et économique et sa commission santé, sécurité et");
      L.push("conditions de travail, s'ils existent, en application du 1° de l'article");
      L.push("L. 2312-9. Le comité social et économique est consulté sur le document");
      L.push("unique d'évaluation des risques professionnels et sur ses mises à jour ;");
      L.push("2° Le ou les salariés mentionnés au premier alinéa du I de l'article");
      L.push("L. 4644-1, s'ils ont été désignés ; 3° Le service de prévention et de");
      L.push("santé au travail auquel l'employeur adhère. »");
      L.push("");
      L = L.concat(blocRenvoi("L. 2312-9 et L. 4644-1",
        "sont nommés par L. 4121-3 pour désigner l'attribution du comité et le salarié " +
        "désigné pour s'occuper des activités de protection et de prévention"));
      L.push("Contributions recueillies pour cette version :");
      L.push("  · comité social et économique : " +
        (estNon((f.cse || {}).existe) ? "aucun comité déclaré — la contribution du 1° n'a pas d'objet"
          : "[date de la réunion et référence du procès-verbal]"));
      L.push("  · salarié désigné (L. 4644-1) : [nom, ou « aucun désigné »]");
      L.push("  · service de prévention et de santé au travail : [nom du service, date");
      L.push("    de l'échange ou de la visite]");
      L.push("");

      L.push("════ 5. LA MÉTHODE RETENUE ════");
      L.push("");
      L.push("La loi ne fixe pas de méthode de cotation. Elle exige un inventaire par");
      L.push("unité de travail et une transcription qui répertorie l'ensemble des");
      L.push("risques. La méthode ci-dessous est donc VOTRE choix, et il doit être");
      L.push("écrit pour que le document se relise dans dix ans.");
      L.push("");
      L.push("[DÉCRIRE ICI VOTRE MÉTHODE : comment vous appréciez la gravité, la");
      L.push(" fréquence ou la durée d'exposition, et comment vous en déduisez un ordre");
      L.push(" de priorité. Toute échelle convient, pourvu qu'elle soit expliquée et");
      L.push(" appliquée de la même façon partout.]");
      L.push("");
      L = L.concat(blocMaille());

      L.push("════ 6. L'INVENTAIRE, UNITÉ PAR UNITÉ ════");
      L.push("");
      L.push("Six colonnes, les mêmes pour toutes les unités :");
      L.push("");
      L.push("  · RISQUE IDENTIFIÉ — nommé, pas catégorisé. « Chute de hauteur lors du");
      L.push("    bâchage » dit quelque chose ; « risque physique » ne dit rien.");
      L.push("  · EXPOSITION — qui, combien de travailleurs, à quelle fréquence, pendant");
      L.push("    combien de temps. C'est cette colonne qui assure la « traçabilité");
      L.push("    collective des expositions » de L. 4121-3-1, I, et c'est elle que l'on");
      L.push("    relira dans trente ans. Y noter l'impact différencié de l'exposition");
      L.push("    en fonction du sexe lorsqu'il existe (L. 4121-3).");
      L.push("  · MESURES EXISTANTES — ce qui est DÉJÀ en place, pas ce qui est prévu.");
      L.push("  · MESURES À PRENDRE — ce qui reste à faire, rédigé en actes. Ces lignes");
      L.push("    alimentent directement le programme annuel de prévention ou la liste");
      L.push("    d'actions (L. 4121-3-1, III).");
      L.push("  · ÉCHÉANCE — une date. « Dès que possible » n'est pas une échéance.");
      L.push("  · RESPONSABLE — une personne nommée. « La direction » n'est personne.");
      L.push("");
      L.push("Recopiez la grille autant de fois qu'il y a d'unités de travail.");
      L.push("");
      L = L.concat(grilleUnite("[NOM DE L'UNITÉ 1 — effectif concerné : ....]"));
      L = L.concat(grilleUnite("[NOM DE L'UNITÉ 2 — effectif concerné : ....]"));
      L = L.concat(grilleUnite("[NOM DE L'UNITÉ 3 — effectif concerné : ....]"));
      L.push("[…recopier la grille pour chaque unité de travail restante…]");
      L.push("");
      L.push("DEUX RISQUES À NE PAS OUBLIER, PARCE QU'UN TEXTE LU LES NOMME :");
      L.push("  · les risques liés aux AMBIANCES THERMIQUES — R. 4121-1 les vise");
      L.push("    expressément, chaleur comme froid ;");
      L.push("  · les risques liés au HARCÈLEMENT MORAL, au HARCÈLEMENT SEXUEL et aux");
      L.push("    AGISSEMENTS SEXISTES — L. 4121-2, 7°, les fait entrer dans la");
      L.push("    planification de la prévention. Le document produit pour la");
      L.push("    prévention du harcèlement (SST-CTL-HAR-04) détaille ce volet.");
      L.push("");

      L.push("════ 7. LES SUITES DE L'ÉVALUATION ════");
      L.push("(L. 4121-3-1, III)");
      L.push("");
      L.push("« Les résultats de cette évaluation débouchent : 1° Pour les entreprises");
      L.push("dont l'effectif est supérieur ou égal à cinquante salariés, sur un");
      L.push("programme annuel de prévention des risques professionnels et");
      L.push("d'amélioration des conditions de travail […] ; 2° Pour les entreprises");
      L.push("dont l'effectif est inférieur à cinquante salariés, sur la définition");
      L.push("d'actions de prévention des risques et de protection des salariés. La");
      L.push("liste de ces actions est consignée dans le document unique d'évaluation");
      L.push("des risques professionnels et ses mises à jour. »");
      L.push("");
      var s50 = seuil(ctx, 50);
      if (s50 === true) {
        L.push("Effectif d'au moins cinquante salariés : c'est le PROGRAMME ANNUEL DE");
        L.push("PRÉVENTION qui est dû. Il est produit à part (SST-CTL-DUE-05) et se joint");
        L.push("au présent document.");
      } else if (s50 === false) {
        L.push("Effectif inférieur à cinquante salariés : c'est la LISTE DES ACTIONS de");
        L.push("prévention et de protection qui est due, et elle se consigne DANS ce");
        L.push("document — non dans une pièce séparée. Elle est produite à part");
        L.push("(SST-CTL-DUE-05) pour être recopiée ici.");
      } else {
        L.push("L'effectif n'étant pas renseigné, la branche applicable n'est pas");
        L.push("tranchée ici : à cinquante salariés et au-delà, c'est le programme annuel");
        L.push("de prévention ; en deçà, c'est la liste d'actions consignée dans ce");
        L.push("document même. Portez votre effectif et suivez la branche.");
      }
      L.push("");
      L.push("[REPORTER ICI LA LISTE DES ACTIONS, si l'effectif est inférieur à");
      L.push(" cinquante salariés : elle se consigne dans le document unique et dans");
      L.push(" chacune de ses mises à jour (L. 4121-3-1, III, 2°).]");
      L.push("");

      L.push("════ 8. MISE À JOUR ════");
      L.push("(R. 4121-2)");
      L.push("");
      L.push("La mise à jour est réalisée :");
      L.push("  1° Au moins chaque année dans les entreprises d'au moins onze salariés ;");
      L.push("  2° Lors de toute décision d'aménagement important modifiant les");
      L.push("     conditions de santé et de sécurité ou les conditions de travail ;");
      L.push("  3° Lorsqu'une information supplémentaire intéressant l'évaluation d'un");
      L.push("     risque est portée à la connaissance de l'employeur.");
      L.push("");
      var s11 = seuil(ctx, 11);
      if (s11 === true) {
        L.push("Effectif d'au moins onze salariés : la mise à jour annuelle du 1° est due.");
      } else if (s11 === false) {
        L.push("Effectif inférieur à onze salariés : la mise à jour « peut être moins");
        L.push("fréquente […] sous réserve que soit garanti un niveau équivalent de");
        L.push("protection de la santé et de la sécurité des travailleurs » (L. 4121-3,");
        L.push("dernier alinéa). Cette garantie ne se présume pas : écrivez-la ici.");
        L.push("[EXPOSER CE QUI GARANTIT LE NIVEAU ÉQUIVALENT DE PROTECTION.]");
      } else {
        L.push("L'effectif n'étant pas renseigné, la périodicité n'est pas tranchée ici :");
        L.push("à partir de onze salariés la mise à jour est au moins annuelle ; en deçà");
        L.push("elle peut être moins fréquente, sous réserve d'un niveau équivalent de");
        L.push("protection à écrire (L. 4121-3, dernier alinéa).");
      }
      L.push("");
      L.push("Les cas 2° et 3° ne suivent aucun calendrier : ils suivent l'événement.");
      L.push("");

      L.push("════ 9. CONSERVATION ET ACCÈS ════");
      L.push("(L. 4121-3-1, V ; R. 4121-4)");
      L.push("");
      L.push("Le document unique, « dans ses versions successives, est conservé par");
      L.push("l'employeur et tenu à la disposition des travailleurs, des anciens");
      L.push("travailleurs ainsi que de toute personne ou instance pouvant justifier");
      L.push("d'un intérêt à y avoir accès. La durée, qui ne peut être inférieure à");
      L.push("quarante ans, et les modalités de conservation et de mise à disposition");
      L.push("[…] sont fixées par décret » (L. 4121-3-1, V, A). R. 4121-4 fixe cette");
      L.push("durée à quarante ans à compter de l'élaboration de chaque version.");
      L.push("");
      L.push("Un avis indiquant les modalités d'accès des travailleurs est affiché à une");
      L.push("place convenable et aisément accessible dans les lieux de travail — au");
      L.push("même emplacement que le règlement intérieur là où il en existe un");
      L.push("(R. 4121-4, dernier alinéa). Cet avis est produit à part");
      L.push("(SST-CTL-DUE-06).");
      L.push("");
      L.push("Version en vigueur conservée à : [LIEU ET SUPPORT]");
      L.push("Versions antérieures conservées à : [LIEU ET SUPPORT]");
      L.push("Personne à qui s'adresse une demande d'accès : [NOM ET FONCTION]");
      L.push("");

      L.push("════ 10. TRANSMISSION ════");
      L.push("(L. 4121-3-1, VI)");
      L.push("");
      L.push("« Le document unique d'évaluation des risques professionnels est transmis");
      L.push("par l'employeur à chaque mise à jour au service de prévention et de santé");
      L.push("au travail auquel il adhère. » Le bordereau est produit à part");
      L.push("(SST-CTL-DUE-08).");
      L.push("");
      L.push("Le V, B, de L. 4121-3-1 prévoit en outre un dépôt dématérialisé sur un");
      L.push("portail numérique, applicable « à compter du 1er juillet 2023, aux");
      L.push("entreprises dont l'effectif est supérieur ou égal à cent cinquante");
      L.push("salariés » et, « à compter de dates fixées par décret, en fonction des");
      L.push("effectifs des entreprises, et au plus tard à compter du 1er juillet 2024 »,");
      L.push("aux entreprises de moins de cent cinquante salariés. Le même V, A, second");
      L.push("alinéa de R. 4121-4, prévoit que « jusqu'à l'entrée en vigueur de");
      L.push("l'obligation de dépôt […] l'employeur conserve les versions successives du");
      L.push("document unique au sein de l'entreprise sous la forme d'un document papier");
      L.push("ou dématérialisé ». L'application ne sait pas où en est le déploiement de");
      L.push("ce portail : vérifiez-le, et conservez en tout état de cause vos versions");
      L.push("dans l'entreprise.");
      L.push("");

      L.push("Fait à " + lieu(ctx) + ", le [DATE]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      /* ---- les pièces qui vont avec ---- */
      L.push(GROS);
      L.push("PIÈCE JOINTE — NOTE DE LANCEMENT DE L'ÉVALUATION (interne)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — note du " + leJour(d0));
      L.push("Objet : évaluation des risques professionnels — organisation des travaux");
      L.push("");
      L.push("1. Périmètre : [établissements et sites].");
      L.push("2. Unités de travail retenues : [liste].");
      L.push("3. Pilote : [nom et fonction]. Contributeurs : [encadrement de proximité,");
      L.push("   salarié désigné s'il en existe, service de prévention et de santé au");
      L.push("   travail].");
      L.push("4. Méthode d'appréciation retenue : [voir section 5].");
      L.push("5. Calendrier : visites de postes du [date] au [date] ; rédaction pour le");
      L.push("   [date] ; consultation du comité le [date] ; version datée le [date].");
      L.push("6. Le comité social et économique et sa commission, s'ils existent,");
      L.push("   apportent leur contribution (L. 4121-3, 1°) et le comité est consulté");
      L.push("   sur le document et ses mises à jour.");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous lancez l'évaluation (note ci-dessus)");
      L.push("et vous arrêtez la liste des unités de travail.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ — visites de postes et recueil des");
      L.push("contributions de L. 4121-3 achevés : comité et commission s'ils existent,");
      L.push("salarié désigné s'il en existe, service de prévention et de santé au");
      L.push("travail.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 60)) + " environ — projet de document unique rédigé,");
      L.push("unité par unité, avec les six colonnes remplies.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 75)) + " environ — consultation du comité social et");
      L.push("économique sur le document (L. 4121-3, 1°) : l'ordre du jour et le");
      L.push("procès-verbal sont produits à part (SST-CTL-DUE-07).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 90)) + " au plus tard — version datée et signée,");
      L.push("avis d'accès affiché (R. 4121-4), document transmis au service de");
      L.push("prévention et de santé au travail (L. 4121-3-1, VI), et suites établies :");
      L.push("programme annuel de prévention ou liste d'actions (L. 4121-3-1, III).");
      L.push("");
      if (s11 !== false) {
        L.push("Puis, dans un an — au " + leJour(dans(d0, 365)) + " si la version est");
        L.push("datée d'aujourd'hui — la mise à jour annuelle de R. 4121-2, 1°, dans les");
        L.push("entreprises d'au moins onze salariés.");
        L.push("");
      }
      if (estISO(du.dateDerniereMaj)) {
        var ech = moisApres(du.dateDerniereMaj, 12);
        L.push("Votre dossier porte une version datée du " + jour(du.dateDerniereMaj) +
          " : l'année");
        L.push("de R. 4121-2, 1°, échoit le " + jour(ech) + ".");
        L.push("");
      }
      L.push("Ces durées sont indicatives : elles disent le temps qu'une évaluation");
      L.push("sérieuse demande, non un délai légal. Aucun texte lu ne fixe de délai");
      L.push("pour établir un premier document unique — il est dû, et il l'est déjà.");

      return L.concat(pied(
        "L. 4121-1, L. 4121-2, L. 4121-3, L. 4121-3-1, R. 4121-1, R. 4121-2, R. 4121-4, R. 4741-1",
        ["L'ABSENCE DE TRANSCRIPTION EST PUNIE. « Le fait de ne pas transcrire ou de",
         "ne pas mettre à jour les résultats de l'évaluation des risques, dans les",
         "conditions prévues aux articles R. 4121-1 et R. 4121-2, est puni de l'amende",
         "prévue pour les contraventions de la cinquième classe » (R. 4741-1). Ce",
         "texte, et lui seul, atteint le document unique : l'amende de L. 4741-1 vise",
         "pour le livre Ier de la quatrième partie les « Titres Ier, III et IV », et",
         "le titre II — celui des principes généraux de prévention où vivent",
         "L. 4121-1 à L. 4121-3-1 — n'y figure pas."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-02 — L'INVENTAIRE PAR UNITÉ DE TRAVAIL

     Le document unique existe, mais sans maille. Ce n'est pas le document
     entier qu'il faut refaire : c'est la découpe, et l'inventaire qu'elle
     commande.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-02", {
    nom: "L'inventaire des risques par unité de travail",
    detail: "La découpe des unités, la grille à recopier pour chacune, la note " +
            "de reprise du document unique et le calendrier.",
    /* LE TABLEUR — l'inventaire des risques est un tableau, pas une lettre.
       Le client le remplit dans Excel, unité de travail par unité de travail.
       Chaque ligne porte son exemple, pour qu'il voie ce qu'on attend avant
       d'effacer et de mettre les siens. Demande du 2 septembre 2026. */
    tableur: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, du = f.duerp || {};
      var unites = (du.unitesTravail && du.unitesTravail.length ? du.unitesTravail : null);
      var L = [];
      L.push(["DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS — INVENTAIRE PAR UNITÉ DE TRAVAIL"]);
      L.push([cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE")]);
      L.push(["Établi le " + leJour(ctx.aujourdhui) + " — articles L. 4121-3 et R. 4121-1 du code du travail"]);
      L.push([]);
      L.push(["MODE D'EMPLOI : une ligne par risque et par unité de travail. Les deux premières lignes " +
              "sont des exemples : effacez-les et portez les vôtres. La cotation gravité x fréquence " +
              "n'est imposée par aucun texte — elle sert à ordonner les actions, gardez celle que vous " +
              "employez déjà si vous en avez une."]);
      L.push([]);
      L.push(["Unité de travail", "Poste ou activité", "Danger identifié", "Situation d'exposition",
              "Salariés exposés (nombre)", "Gravité (1 à 4)", "Fréquence (1 à 4)", "Criticité",
              "Mesures de prévention déjà en place", "Mesures à mettre en œuvre",
              "Responsable", "Échéance", "Date de l'évaluation"]);
      L.push(["Atelier", "Conduite de chariot élévateur", "Renversement, heurt de piéton",
              "Circulation dans l'allée centrale aux heures de chargement", "4", "4", "3", "12",
              "Formation à la conduite, avertisseur sonore",
              "Marquage au sol séparant piétons et engins ; miroir en sortie d'allée",
              "Responsable d'atelier", "31/12/" + new Date(ctx.aujourdhui || Date.now()).getFullYear(),
              leJour(ctx.aujourdhui)]);
      L.push(["Bureaux", "Saisie sur écran", "Troubles musculo-squelettiques",
              "Poste de travail non réglable, plus de six heures par jour", "6", "2", "4", "8",
              "Sièges réglables", "Réglage individuel des postes ; formation aux postures",
              "Ressources humaines", "30/06/" + (new Date(ctx.aujourdhui || Date.now()).getFullYear() + 1),
              leJour(ctx.aujourdhui)]);
      if (unites) unites.forEach(function (u) {
        L.push([String(u.unite || u), "[poste]", "[danger]", "[situation]", "", "", "", "",
                "[existant]", "[à faire]", "[qui]", "[quand]", ""]);
      });
      else L.push(["[VOTRE UNITÉ DE TRAVAIL]", "[poste]", "[danger]", "[situation]", "", "", "", "",
                   "[existant]", "[à faire]", "[qui]", "[quand]", ""]);
      L.push([]);
      L.push(["RAPPEL — Le document unique transcrit les résultats de l'évaluation des risques et " +
              "répertorie l'ensemble des risques pour la santé et la sécurité des travailleurs, par " +
              "unité de travail. Il est mis à jour au moins chaque année dans les entreprises d'au " +
              "moins onze salariés, lors de toute décision d'aménagement important, et lorsqu'une " +
              "information supplémentaire intéressant l'évaluation d'un risque est portée à la " +
              "connaissance de l'employeur (R. 4121-2)."]);
      return L;
    },
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Inventaire des risques par unité de travail — annexe au document unique",
        "article R. 4121-1 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« L'employeur transcrit et met à jour dans un document unique les");
      L.push("résultats de l'évaluation des risques pour la santé et la sécurité des");
      L.push("travailleurs à laquelle il procède en application de l'article L. 4121-3.");
      L.push("Cette évaluation comporte un inventaire des risques identifiés dans chaque");
      L.push("unité de travail de l'entreprise ou de l'établissement, y compris ceux");
      L.push("liés aux ambiances thermiques » (R. 4121-1).");
      L.push("");
      L.push("Deux mots commandent : « chaque » et « identifiés ». Un inventaire global,");
      L.push("valable pour toute l'entreprise, ne répond pas à « chaque unité » ; une");
      L.push("liste de familles de risques ne répond pas à « identifiés ».");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · document unique existant : " + etat(du.existe, "oui", "NON"));
      L.push("  · inventaire par unité de travail : " +
        etat(du.unitesTravail, "oui", "NON — c'est l'objet de ce document"));
      L.push("  · dernière version : " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("");
      if (estNon(du.existe)) {
        L.push("ATTENTION — le dossier indique qu'il n'existe pas de document unique. Il");
        L.push("n'y a alors pas de maille à corriger : c'est le document lui-même qu'il");
        L.push("faut établir, et l'inventaire ci-dessous en fera partie. Servez-vous du");
        L.push("document produit pour SST-CTL-DUE-01, qui porte la charpente entière.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");
      L = L.concat(blocMaille());

      L.push("════ COMMENT DÉCOUPER, CONCRÈTEMENT ════");
      L.push("");
      L.push("Trois questions, dans cet ordre :");
      L.push("");
      L.push("  1. Qui est exposé aux mêmes choses ? Deux salariés qui font le même");
      L.push("     geste au même endroit avec le même matériel sont dans la même unité.");
      L.push("     Deux salariés du même service qui ne partagent aucune exposition n'y");
      L.push("     sont pas.");
      L.push("  2. Le découpage laisse-t-il quelqu'un dehors ? Intérimaires, salariés");
      L.push("     d'entreprises extérieures, apprentis, stagiaires, salariés en");
      L.push("     déplacement, travailleurs isolés, télétravailleurs : chacun est");
      L.push("     quelque part, ou l'inventaire est incomplet.");
      L.push("  3. Le découpage se tiendra-t-il dans le temps ? Il sera relu à chaque");
      L.push("     mise à jour, et comparé aux versions antérieures pendant quarante ans");
      L.push("     (R. 4121-4). Une découpe qui change à chaque version rend la");
      L.push("     traçabilité collective des expositions illisible (L. 4121-3-1, I).");
      L.push("");
      L.push("[TABLEAU DES UNITÉS DE TRAVAIL — à remplir avant les grilles]");
      L.push("");
      L.push("  Unité de travail        | Ce qui la définit        | Effectif | Sites");
      L.push("  ------------------------|--------------------------|----------|--------");
      L.push("  [....................]  | [......................] | [......] | [.....]");
      L.push("  [....................]  | [......................] | [......] | [.....]");
      L.push("  [....................]  | [......................] | [......] | [.....]");
      L.push("  [....................]  | [......................] | [......] | [.....]");
      L.push("");

      L.push("════ LA GRILLE, À RECOPIER POUR CHAQUE UNITÉ ════");
      L.push("");
      L.push("Les six colonnes sont celles du document unique : la même grille partout,");
      L.push("sans quoi les lignes ne se recoupent pas d'une unité à l'autre.");
      L.push("");
      L = L.concat(grilleUnite("[NOM DE L'UNITÉ 1]"));
      L = L.concat(grilleUnite("[NOM DE L'UNITÉ 2]"));
      L = L.concat(grilleUnite("[NOM DE L'UNITÉ 3]"));
      L.push("[…recopier pour chaque unité restante…]");
      L.push("");

      L.push("════ CE QUE R. 4121-1 ET L. 4121-3 IMPOSENT DE NE PAS OUBLIER ════");
      L.push("");
      L.push("  · les AMBIANCES THERMIQUES : R. 4121-1 les vise expressément, dans");
      L.push("    l'énumération même de l'inventaire. Chaleur, froid, écarts, travail en");
      L.push("    extérieur, chambres froides, cabines, ateliers non chauffés :");
      L.push("    [renseigner les unités concernées, ou écrire pourquoi aucune ne l'est].");
      L.push("  · l'IMPACT DIFFÉRENCIÉ SELON LE SEXE : « Cette évaluation des risques");
      L.push("    tient compte de l'impact différencié de l'exposition au risque en");
      L.push("    fonction du sexe » (L. 4121-3). La colonne « exposition » doit porter");
      L.push("    la réponse, unité par unité.");
      L.push("  · les RISQUES DE HARCÈLEMENT ET LES AGISSEMENTS SEXISTES : la");
      L.push("    planification de la prévention les intègre « dans un ensemble");
      L.push("    cohérent » (L. 4121-2, 7°).");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE — NOTE DE REPRISE DU DOCUMENT UNIQUE (interne)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — note du " + leJour(d0));
      L.push("Objet : reprise du document unique — inventaire par unité de travail");
      L.push("");
      L.push("1. Constat : le document unique en vigueur, version du " +
        jour(du.dateDerniereMaj, "date") + ",");
      L.push("   ne comporte pas d'inventaire des risques identifiés dans chaque unité");
      L.push("   de travail, comme R. 4121-1 l'impose.");
      L.push("2. Ce qui est repris : la découpe en unités de travail et l'inventaire");
      L.push("   qu'elle commande. Le reste du document n'est pas réécrit.");
      L.push("3. Pilote : [nom et fonction]. Contributeurs : [encadrement de proximité,");
      L.push("   salarié désigné s'il en existe, service de prévention et de santé au");
      L.push("   travail].");
      L.push("4. La version reprise sera datée sans écraser la précédente");
      L.push("   (L. 4121-3-1, V), soumise au comité (L. 4121-3, 1°) et transmise au");
      L.push("   service de prévention et de santé au travail (L. 4121-3-1, VI).");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous arrêtez la liste des unités de");
      L.push("travail et vous en faites valider la découpe.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ — visites et entretiens faits,");
      L.push("grilles remplies unité par unité.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 35)) + " environ — inventaire réintégré au document");
      L.push("unique, nouvelle version datée, version précédente conservée.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 45)) + " au plus tard — consultation du comité");
      L.push("(L. 4121-3, 1°) et transmission au service de prévention et de santé au");
      L.push("travail (L. 4121-3-1, VI).");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai pour");
      L.push("reprendre la maille d'un document unique. Le manquement, lui, court tant");
      L.push("qu'elle manque.");

      return L.concat(pied("R. 4121-1, L. 4121-2, L. 4121-3, L. 4121-3-1, R. 4121-4, R. 4741-1",
        ["R. 4741-1 punit de l'amende prévue pour les contraventions de la cinquième",
         "classe le fait de ne pas transcrire les résultats de l'évaluation « dans les",
         "conditions prévues aux articles R. 4121-1 et R. 4121-2 » — et l'inventaire",
         "par unité de travail est l'une de ces conditions."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-03 — LA MISE À JOUR ANNUELLE ET LA TRAÇABILITÉ DES VERSIONS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-03", {
    nom: "La note de mise à jour du document unique et le registre des versions",
    detail: "La note de mise à jour datée, le registre de traçabilité des " +
            "versions, la révision des suites et le calendrier calculé.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx), iso0 = isoDe(d0);
      var s11 = seuil(ctx, 11), s50 = seuil(ctx, 50);
      var L = entete(ctx, "Mise à jour du document unique — note et registre des versions",
        "articles R. 4121-2 et L. 4121-3-1, V, du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« La mise à jour du document unique d'évaluation des risques");
      L.push("professionnels est réalisée : 1° Au moins chaque année dans les");
      L.push("entreprises d'au moins onze salariés ; 2° Lors de toute décision");
      L.push("d'aménagement important modifiant les conditions de santé et de sécurité");
      L.push("ou les conditions de travail ; 3° Lorsqu'une information supplémentaire");
      L.push("intéressant l'évaluation d'un risque est portée à la connaissance de");
      L.push("l'employeur. La mise à jour du programme annuel de prévention des risques");
      L.push("professionnels et d'amélioration des conditions de travail ou de la liste");
      L.push("des actions de prévention et de protection mentionnés au III de l'article");
      L.push("L. 4121-3-1 est effectuée à chaque mise à jour du document unique, si");
      L.push("nécessaire » (R. 4121-2).");
      L.push("");
      L.push("Le présent document traite le 1° — la périodicité. Les 2° et 3° suivent");
      L.push("l'événement et non le calendrier : ils font l'objet d'un document propre");
      L.push("(SST-CTL-DUE-04).");
      L.push("");

      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("  · dernière version du document unique : " +
        jour(du.dateDerniereMaj, "DATE NON RENSEIGNÉE"));
      if (estISO(du.dateDerniereMaj)) {
        var ech = moisApres(du.dateDerniereMaj, 12);
        L.push("  · l'année de R. 4121-2, 1°, échoit le " + jour(ech));
        if (iso0 && ech && iso0 > ech) {
          L.push("  · au " + leJour(d0) + ", CE TERME EST DÉPASSÉ : la mise à jour");
          L.push("    annuelle est en retard.");
        } else if (iso0 && ech) {
          L.push("  · au " + leJour(d0) + ", ce terme n'est pas atteint.");
        }
      } else {
        L.push("  · la date de la dernière version n'est pas au dossier : relevez-la sur");
        L.push("    la page de garde ou l'historique du document lui-même, et non sur un");
        L.push("    courriel ou un compte rendu de réunion. C'est d'elle que court");
        L.push("    l'année.");
      }
      L.push("");
      if (s11 === true) {
        L.push("Effectif d'au moins onze salariés : la mise à jour annuelle est due.");
      } else if (s11 === false) {
        L.push("Effectif inférieur à onze salariés : « Lorsque les documents prévus pour");
        L.push("l'application du présent article doivent faire l'objet d'une mise à jour,");
        L.push("celle-ci peut être moins fréquente dans les entreprises de moins de onze");
        L.push("salariés, sous réserve que soit garanti un niveau équivalent de");
        L.push("protection de la santé et de la sécurité des travailleurs, dans des");
        L.push("conditions fixées par décret en Conseil d'État après avis des");
        L.push("organisations professionnelles concernées » (L. 4121-3, dernier alinéa).");
        L.push("Cette garantie s'apprécie au fond : elle s'écrit, elle ne se présume pas.");
        L.push("Les 2° et 3° de R. 4121-2, eux, restent dus sans atténuation.");
      } else {
        L.push("L'effectif n'est pas renseigné : la périodicité n'est pas tranchée ici. À");
        L.push("partir de onze salariés la mise à jour est au moins annuelle ; en deçà,");
        L.push("elle peut être moins fréquente sous réserve d'un niveau équivalent de");
        L.push("protection écrit (L. 4121-3, dernier alinéa).");
      }
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — NOTE DE MISE À JOUR");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS");
      L.push("NOTE DE MISE À JOUR — version [n° de la nouvelle version]");
      L.push("Établie le [DATE DE LA NOUVELLE VERSION]");
      L.push("");
      L.push("1. VERSION REMPLACÉE");
      L.push("   Version [n°], établie le " + jour(du.dateDerniereMaj, "date") + ".");
      L.push("   Elle est CONSERVÉE et reste consultable : les versions successives sont");
      L.push("   conservées pendant quarante ans au moins à compter de leur élaboration");
      L.push("   (L. 4121-3-1, V ; R. 4121-4). Une mise à jour n'écrase jamais la");
      L.push("   version précédente.");
      L.push("");
      L.push("2. FONDEMENT DE LA MISE À JOUR");
      L.push("   [ ] périodicité annuelle (R. 4121-2, 1°)");
      L.push("   [ ] décision d'aménagement important (R. 4121-2, 2°)");
      L.push("   [ ] information supplémentaire intéressant l'évaluation d'un risque");
      L.push("       (R. 4121-2, 3°)");
      L.push("   Cocher tous les cas applicables.");
      L.push("");
      L.push("3. CE QUI A CHANGÉ DEPUIS LA VERSION PRÉCÉDENTE");
      L.push("   [ÉCRIRE ICI, unité par unité, ce qui a changé : postes créés ou");
      L.push("    supprimés, équipements, procédés, produits, locaux, organisation,");
      L.push("    horaires, effectifs, accidents et incidents survenus, alertes reçues,");
      L.push("    remontées du comité ou du service de prévention et de santé au");
      L.push("    travail. L'application ne connaît rien de tout cela.]");
      L.push("");
      L.push("4. UNITÉS DE TRAVAIL MODIFIÉES");
      L.push("");
      L.push("  Unité de travail        | Ce qui change | Lignes ajoutées / retirées");
      L.push("  ------------------------|---------------|---------------------------");
      L.push("  [....................]  | [...........] | [.......................]");
      L.push("  [....................]  | [...........] | [.......................]");
      L.push("  [....................]  | [...........] | [.......................]");
      L.push("");
      L.push("5. UNITÉS RELUES SANS MODIFICATION");
      L.push("   [Les nommer. Une unité non relue n'est pas une unité inchangée, et la");
      L.push("    différence se voit à la lecture des versions successives.]");
      L.push("");
      L.push("6. SUITES RÉVISÉES");
      L.push("   R. 4121-2, dernier alinéa : la mise à jour du programme annuel de");
      L.push("   prévention ou de la liste des actions « est effectuée à chaque mise à");
      L.push("   jour du document unique, si nécessaire ».");
      if (s50 === true) {
        L.push("   Effectif d'au moins cinquante salariés : c'est le PROGRAMME ANNUEL de");
        L.push("   prévention qui est révisé (L. 4121-3-1, III, 1°).");
      } else if (s50 === false) {
        L.push("   Effectif inférieur à cinquante salariés : c'est la LISTE DES ACTIONS de");
        L.push("   prévention et de protection, consignée dans le document unique lui-même");
        L.push("   (L. 4121-3-1, III, 2°).");
      } else {
        L.push("   Selon l'effectif : programme annuel à partir de cinquante salariés,");
        L.push("   liste d'actions consignée au document unique en deçà (L. 4121-3-1, III).");
      }
      L.push("   [ ] révisé, le [date]   [ ] non révisé, parce que [motif écrit]");
      L.push("");
      L.push("7. FORMALITÉS QUI SUIVENT CETTE VERSION");
      L.push("   [ ] comité social et économique consulté le [date] — L. 4121-3, 1°,");
      L.push("       vise le document unique « et ses mises à jour », sans distinguer ;");
      L.push("   [ ] transmis au service de prévention et de santé au travail le [date]");
      L.push("       — L. 4121-3-1, VI, impose la transmission « à chaque mise à jour » ;");
      L.push("   [ ] version précédente archivée, avis d'accès toujours affiché");
      L.push("       (R. 4121-4).");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — REGISTRE DES VERSIONS (traçabilité)");
      L.push(GROS);
      L.push("");
      L.push("Ce registre n'est imposé par aucun texte lu. Il sert à tenir ce que deux");
      L.push("textes lus imposent : conserver les versions successives pendant quarante");
      L.push("ans au moins (L. 4121-3-1, V ; R. 4121-4) et pouvoir dire, pour un");
      L.push("travailleur ou un ancien travailleur, quelles versions étaient en vigueur");
      L.push("durant sa période d'activité (R. 4121-4, 1°). Sans lui, la traçabilité");
      L.push("collective des expositions de L. 4121-3-1, I, se perd au troisième");
      L.push("changement de logiciel.");
      L.push("");
      L.push("  Version | Établie le | Motif (R. 4121-2) | Comité consulté | Transmise SPST | Archivée à");
      L.push("  --------|------------|-------------------|-----------------|----------------|------------");
      L.push("  [.....] | [........] | [...............] | [.............] | [............] | [.........]");
      L.push("  [.....] | [........] | [...............] | [.............] | [............] | [.........]");
      L.push("  [.....] | [........] | [...............] | [.............] | [............] | [.........]");
      L.push("  [.....] | [........] | [...............] | [.............] | [............] | [.........]");
      L.push("");
      L.push("Support et lieu de conservation : [PRÉCISER]. Responsable : [NOM].");
      L.push("Jusqu'à l'entrée en vigueur de l'obligation de dépôt dématérialisé prévue");
      L.push("au B du V de L. 4121-3-1, « l'employeur conserve les versions successives");
      L.push("du document unique au sein de l'entreprise sous la forme d'un document");
      L.push("papier ou dématérialisé » (R. 4121-4).");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous relevez la date de la version en");
      L.push("vigueur et vous ouvrez la note de mise à jour.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 14)) + " environ — unités relues, changements");
      L.push("consignés, grilles reprises.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ — nouvelle version datée, version");
      L.push("précédente archivée, registre des versions complété.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " au plus tard — comité consulté");
      L.push("(L. 4121-3, 1°), document transmis au service de prévention et de santé au");
      L.push("travail (L. 4121-3-1, VI), suites révisées (R. 4121-2, dernier alinéa).");
      L.push("");
      if (estISO(du.dateDerniereMaj)) {
        L.push("Prochaine échéance annuelle si la nouvelle version est datée");
        L.push("d'aujourd'hui : " + jour(moisApres(iso0, 12)) + " (R. 4121-2, 1°).");
      } else {
        L.push("Prochaine échéance annuelle si la nouvelle version est datée");
        L.push("d'aujourd'hui : " + leJour(dans(d0, 365)) + " environ — le terme se");
        L.push("compte à partir de la date portée sur la version (R. 4121-2, 1°).");
      }
      L.push("");
      L.push("Ces durées sont indicatives, sauf l'année de R. 4121-2, 1°, qui est un");
      L.push("délai du texte.");

      return L.concat(pied("R. 4121-2, L. 4121-3, L. 4121-3-1, R. 4121-4, R. 4741-1",
        ["« Le fait de ne pas transcrire ou de ne pas mettre à jour les résultats de",
         "l'évaluation des risques, dans les conditions prévues aux articles R. 4121-1",
         "et R. 4121-2, est puni de l'amende prévue pour les contraventions de la",
         "cinquième classe. La récidive est réprimée conformément aux articles 132-11",
         "et 132-15 du code pénal » (R. 4741-1). Les deux articles du code pénal qu'il",
         "nomme n'ont pas été lus par l'application : elle ne dit donc pas ce que la",
         "récidive emporte."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-04 — LA MISE À JOUR ÉVÉNEMENTIELLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-04", {
    nom: "La mise à jour du document unique après un aménagement ou une information nouvelle",
    detail: "La fiche d'événement, la mise à jour ciblée, la révision des " +
            "suites et le calendrier compté depuis l'événement.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {}, ev = f.evenement || {};
      var d0 = aujourd(ctx);
      var s50 = seuil(ctx, 50);
      var L = entete(ctx, "Mise à jour événementielle du document unique",
        "article R. 4121-2, 2° et 3°, du code du travail");

      L.push("LES DEUX CAS, ET CE QUI LES DISTINGUE DE L'ANNÉE");
      L.push("");
      L.push("La mise à jour du document unique est réalisée « 2° Lors de toute décision");
      L.push("d'aménagement important modifiant les conditions de santé et de sécurité");
      L.push("ou les conditions de travail ; 3° Lorsqu'une information supplémentaire");
      L.push("intéressant l'évaluation d'un risque est portée à la connaissance de");
      L.push("l'employeur » (R. 4121-2).");
      L.push("");
      L.push("Ces deux cas ne suivent pas le calendrier : ils suivent l'événement. Une");
      L.push("mise à jour annuelle faite dans les temps ne dispense pas de la mise à");
      L.push("jour événementielle, et l'inverse est vrai aussi. Le 2° se déclenche à la");
      L.push("DÉCISION, non à la réalisation des travaux ; le 3° se déclenche au jour où");
      L.push("l'information est PORTÉE À LA CONNAISSANCE de l'employeur.");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · aménagement important ou information nouvelle depuis la dernière mise");
      L.push("    à jour : " + etat(ev.survenu, "OUI", "non"));
      L.push("  · mise à jour faite en conséquence : " + etat(ev.majFaite, "oui", "NON"));
      L.push("  · dernière version du document unique : " +
        jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — FICHE D'ÉVÉNEMENT");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — fiche établie le " + leJour(d0));
      L.push("");
      L.push("1. NATURE DE L'ÉVÉNEMENT");
      L.push("   [ ] décision d'aménagement important modifiant les conditions de santé");
      L.push("       et de sécurité ou les conditions de travail (R. 4121-2, 2°)");
      L.push("   [ ] information supplémentaire intéressant l'évaluation d'un risque,");
      L.push("       portée à la connaissance de l'employeur (R. 4121-2, 3°)");
      L.push("");
      L.push("2. DESCRIPTION");
      L.push("   [DÉCRIRE L'ÉVÉNEMENT, daté et circonstancié : quelle décision, prise");
      L.push("    par qui et quand ; ou quelle information, reçue de qui et quand.");
      L.push("    L'application ne connaît ni vos investissements, ni vos");
      L.push("    réorganisations, ni vos accidents, ni les alertes qui vous sont");
      L.push("    parvenues. Elle n'en écrira aucun à votre place.]");
      L.push("");
      L.push("3. DATE DE LA DÉCISION OU DE LA CONNAISSANCE : [DATE]");
      L.push("   C'est de ce jour, et non de celui des travaux ou du constat définitif,");
      L.push("   que la mise à jour est due.");
      L.push("");
      L.push("4. PIÈCE QUI L'ÉTABLIT : [note de décision, compte rendu de comité de");
      L.push("   direction, courrier, déclaration d'accident, rapport du service de");
      L.push("   prévention et de santé au travail, signalement, alerte…]");
      L.push("");
      L.push("5. UNITÉS DE TRAVAIL TOUCHÉES");
      L.push("");
      L.push("  Unité de travail        | En quoi elle est touchée | Risque nouveau ou modifié");
      L.push("  ------------------------|--------------------------|--------------------------");
      L.push("  [....................]  | [......................] | [......................]");
      L.push("  [....................]  | [......................] | [......................]");
      L.push("  [....................]  | [......................] | [......................]");
      L.push("");
      L.push("   La mise à jour événementielle n'est pas la réécriture du document : on");
      L.push("   ne reprend que les unités que l'événement touche. Mais on écrit aussi");
      L.push("   quelles unités ont été examinées et écartées — sans quoi rien ne dit");
      L.push("   qu'elles l'ont été.");
      L.push("");
      L.push("6. SUITES À RÉVISER (R. 4121-2, dernier alinéa)");
      if (s50 === true) {
        L.push("   Effectif d'au moins cinquante salariés : le programme annuel de");
        L.push("   prévention est révisé si nécessaire (L. 4121-3-1, III, 1°).");
      } else if (s50 === false) {
        L.push("   Effectif inférieur à cinquante salariés : la liste des actions de");
        L.push("   prévention et de protection consignée au document unique est révisée si");
        L.push("   nécessaire (L. 4121-3-1, III, 2°).");
      } else {
        L.push("   Programme annuel à partir de cinquante salariés, liste d'actions");
        L.push("   consignée au document unique en deçà (L. 4121-3-1, III).");
      }
      L.push("   [ ] révisées le [date]   [ ] non révisées, parce que [motif écrit]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — GRILLES DES UNITÉS REPRISES");
      L.push(GROS);
      L.push("");
      L.push("Les six colonnes du document unique, pour les seules unités touchées.");
      L.push("");
      L = L.concat(grilleUnite("[UNITÉ TOUCHÉE 1]"));
      L = L.concat(grilleUnite("[UNITÉ TOUCHÉE 2]"));
      L.push("[…recopier pour chaque unité touchée…]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — INFORMATION DU COMITÉ ET DU SERVICE DE PRÉVENTION");
      L.push(GROS);
      L.push("");
      if (estNon((f.cse || {}).existe)) {
        L.push("Le dossier n'indique aucun comité social et économique : la consultation");
        L.push("de L. 4121-3, 1°, n'a pas d'objet en l'état. Le courrier ci-dessous est");
        L.push("écrit pour le jour où le comité existera ; la transmission au service de");
        L.push("prévention et de santé au travail, elle, reste due sans condition");
        L.push("(L. 4121-3-1, VI).");
        L.push("");
      }
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la délégation du personnel",
         "du comité social et économique",
         "[et, s'il en existe une, aux membres de la commission santé, sécurité et",
         "conditions de travail]"], false));
      L.push("Objet : mise à jour du document unique à la suite de [nature de");
      L.push("l'événement] du [date]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("[Décrire l'événement en une phrase, datée.] a conduit à mettre à jour le");
      L.push("document unique d'évaluation des risques professionnels, comme R. 4121-2");
      L.push("l'impose lors de toute décision d'aménagement important modifiant les");
      L.push("conditions de santé et de sécurité ou les conditions de travail, et");
      L.push("lorsqu'une information supplémentaire intéressant l'évaluation d'un risque");
      L.push("est portée à la connaissance de l'employeur.");
      L.push("");
      L.push("Je vous adresse ci-joint la version mise à jour et vous invite à en");
      L.push("délibérer lors de la réunion du [DATE] : l'article L. 4121-3, 1°, dispose");
      L.push("que « le comité social et économique est consulté sur le document unique");
      L.push("d'évaluation des risques professionnels et sur ses mises à jour ».");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("Pièce jointe : document unique, version du [date]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Le point de départ n'est pas aujourd'hui : c'est le jour de la décision ou");
      L.push("de la connaissance de l'information. Portez-le en tête de la fiche");
      L.push("d'événement, puis comptez à partir de lui.");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez la fiche d'événement et");
      L.push("vous identifiez les unités touchées.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 10)) + " environ — grilles des unités touchées");
      L.push("reprises, nouvelle version datée, précédente conservée (L. 4121-3-1, V).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ — comité consulté sur la mise à");
      L.push("jour (L. 4121-3, 1°) et suites révisées (R. 4121-2, dernier alinéa).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " au plus tard — transmission au service de");
      L.push("prévention et de santé au travail (L. 4121-3-1, VI).");
      L.push("");
      L.push("Ces durées sont indicatives : R. 4121-2 ne fixe aucun délai chiffré pour");
      L.push("les cas 2° et 3°. Il les rattache à l'événement, ce qui est plus exigeant");
      L.push("qu'un délai — l'obligation naît le jour même.");

      return L.concat(pied("R. 4121-2, L. 4121-3, L. 4121-3-1, R. 4741-1",
        ["Le défaut de mise à jour « dans les conditions prévues aux articles",
         "R. 4121-1 et R. 4121-2 » est puni de l'amende prévue pour les contraventions",
         "de la cinquième classe (R. 4741-1). Les cas 2° et 3° sont dans ces",
         "conditions."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-05 — LES SUITES DE L'ÉVALUATION

     Deux régimes, un seuil. Le document produit les DEUX, parce qu'un effectif
     absent ne doit jamais faire choisir à la place du lecteur — mais il dit
     lequel s'applique dès que l'effectif est connu.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-05", {
    nom: "Le programme annuel de prévention (PAPRIPACT), ou la liste des actions",
    detail: "Le programme rédigé avec ses trois éléments par mesure, ses " +
            "ressources et son calendrier ; la liste d'actions en deçà de " +
            "cinquante salariés ; la présentation au comité et le courrier.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var pa = f.programmeAnnuel || {}, la = f.listeActions || {};
      var d0 = aujourd(ctx);
      var s50 = seuil(ctx, 50);
      var cseExiste = (f.cse || {}).existe;
      var L = entete(ctx, "Suites de l'évaluation des risques — programme annuel de prévention ou liste d'actions",
        "articles L. 4121-3-1, III, et L. 2312-27 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« III.-Les résultats de cette évaluation débouchent :");
      L.push("1° Pour les entreprises dont l'effectif est supérieur ou égal à cinquante");
      L.push("salariés, sur un programme annuel de prévention des risques professionnels");
      L.push("et d'amélioration des conditions de travail qui : a) Fixe la liste");
      L.push("détaillée des mesures devant être prises au cours de l'année à venir, qui");
      L.push("comprennent les mesures de prévention des effets de l'exposition aux");
      L.push("facteurs de risques professionnels ainsi que, pour chaque mesure, ses");
      L.push("conditions d'exécution, des indicateurs de résultat et l'estimation de son");
      L.push("coût ; b) Identifie les ressources de l'entreprise pouvant être");
      L.push("mobilisées ; c) Comprend un calendrier de mise en œuvre ;");
      L.push("2° Pour les entreprises dont l'effectif est inférieur à cinquante");
      L.push("salariés, sur la définition d'actions de prévention des risques et de");
      L.push("protection des salariés. La liste de ces actions est consignée dans le");
      L.push("document unique d'évaluation des risques professionnels et ses mises à");
      L.push("jour » (L. 4121-3-1, III).");
      L.push("");
      L.push("QUEL RÉGIME VOUS CONCERNE");
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("");
      if (s50 === true) {
        L.push("→ PROGRAMME ANNUEL DE PRÉVENTION (partie A ci-dessous). La partie B ne");
        L.push("  vous concerne pas : supprimez-la.");
      } else if (s50 === false) {
        L.push("→ LISTE DES ACTIONS DE PRÉVENTION ET DE PROTECTION, consignée dans le");
        L.push("  document unique (partie B ci-dessous). La partie A ne vous concerne");
        L.push("  pas : supprimez-la.");
      } else {
        L.push("→ RÉGIME NON TRANCHÉ, faute d'effectif renseigné. Les deux parties sont");
        L.push("  produites ci-dessous. Portez votre effectif, gardez la partie qui vous");
        L.push("  concerne et supprimez l'autre. L'application ne suppose aucun seuil");
        L.push("  franchi.");
      }
      L.push("");
      L.push("Ce que le dossier déclare : programme annuel " +
        etat(pa.existe, "établi", "NON ÉTABLI") + " ; présenté au comité " +
        etat(pa.presenteCSE, "oui", "NON") + " ; liste d'actions consignée " +
        etat(la.consignee, "oui", "NON") + ".");
      L.push("Document unique : " + etat(du.existe, "existant", "INEXISTANT") +
        ", version du " + jour(du.dateDerniereMaj, "date non renseignée") + ".");
      if (estNon(du.existe)) {
        L.push("");
        L.push("ATTENTION — sans document unique, il n'y a pas d'évaluation transcrite,");
        L.push("et donc rien dont un programme ou une liste puisse « déboucher ». Le");
        L.push("document unique se fait d'abord (SST-CTL-DUE-01).");
      }
      L.push("");
      L.push(TRAIT);
      L.push("");

      /* ---- PARTIE A : le programme annuel ---- */
      L.push(GROS);
      L.push("PARTIE A — PROGRAMME ANNUEL DE PRÉVENTION DES RISQUES PROFESSIONNELS");
      L.push("ET D'AMÉLIORATION DES CONDITIONS DE TRAVAIL");
      L.push("(effectif supérieur ou égal à cinquante salariés — L. 4121-3-1, III, 1°)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("Programme annuel de prévention — année [ANNÉE]");
      L.push("Établi le [DATE] · Source : document unique, version du " +
        jour(du.dateDerniereMaj, "date"));
      L.push("");
      L.push("A.1 — D'OÙ VIENNENT LES MESURES");
      L.push("");
      L.push("Chaque mesure inscrite ci-dessous vient d'une ligne « mesures à prendre »");
      L.push("du document unique. C'est le sens du mot « débouchent » : un programme qui");
      L.push("ne se rattache à aucune évaluation ne débouche de rien, et se défend mal.");
      L.push("Portez, pour chaque mesure, l'unité de travail et le risque d'origine.");
      L.push("");
      L.push("A.2 — LA LISTE DÉTAILLÉE DES MESURES");
      L.push("");
      L.push("L. 4121-3-1, III, 1°, a) exige, POUR CHAQUE MESURE et non pour le");
      L.push("programme en bloc, trois éléments : ses conditions d'exécution, des");
      L.push("indicateurs de résultat, et l'estimation de son coût. Les trois manquent");
      L.push("souvent ; c'est le premier point que l'on vérifie.");
      L.push("");
      L.push("  N° | Unité de travail | Risque visé | Mesure | Conditions d'exécution | Indicateurs de résultat | Coût estimé | Échéance | Responsable");
      L.push("  ---|------------------|-------------|--------|------------------------|-------------------------|-------------|----------|------------");
      L.push("  1  | [..............] | [.........] | [....] | [....................] | [.....................] | [.........] | [......] | [.........]");
      L.push("  2  | [..............] | [.........] | [....] | [....................] | [.....................] | [.........] | [......] | [.........]");
      L.push("  3  | [..............] | [.........] | [....] | [....................] | [.....................] | [.........] | [......] | [.........]");
      L.push("  4  | [..............] | [.........] | [....] | [....................] | [.....................] | [.........] | [......] | [.........]");
      L.push("  5  | [..............] | [.........] | [....] | [....................] | [.....................] | [.........] | [......] | [.........]");
      L.push("");
      L.push("Le a) précise que ces mesures « comprennent les mesures de prévention des");
      L.push("effets de l'exposition aux facteurs de risques professionnels ». Ces");
      L.push("facteurs sont ceux que L. 4121-1 désigne par renvoi à L. 4161-1.");
      L.push("");
      L = L.concat(blocRenvoi("L. 4161-1",
        "est nommé par L. 4121-1 et par L. 2312-27 pour désigner les facteurs de " +
        "risques professionnels"));
      L.push("A.3 — LES RESSOURCES MOBILISABLES");
      L.push("(L. 4121-3-1, III, 1°, b)");
      L.push("");
      L.push("[IDENTIFIER LES RESSOURCES DE L'ENTREPRISE POUVANT ÊTRE MOBILISÉES :");
      L.push(" budget affecté, temps d'encadrement, compétences internes, salarié");
      L.push(" désigné pour s'occuper des activités de protection et de prévention s'il");
      L.push(" en existe un, appui du service de prévention et de santé au travail,");
      L.push(" organismes et instances mis en place par la branche.]");
      L.push("");
      L.push("Sur ce dernier point, L. 4121-3-1, IV, dispose que « les organismes et");
      L.push("instances mis en place par la branche peuvent accompagner les entreprises");
      L.push("dans l'élaboration et la mise à jour du document unique […], dans la");
      L.push("définition du programme annuel de prévention […] ainsi que dans la");
      L.push("définition des actions de prévention et de protection […] au moyen de");
      L.push("méthodes et référentiels adaptés aux risques considérés et d'outils d'aide");
      L.push("à la rédaction ». C'est une ressource, à mentionner si vous l'utilisez.");
      L.push("");
      L.push("A.4 — LE CALENDRIER DE MISE EN ŒUVRE");
      L.push("(L. 4121-3-1, III, 1°, c)");
      L.push("");
      L.push("  Trimestre | Mesures engagées (n°) | Jalons | Point d'étape prévu le");
      L.push("  ----------|-----------------------|--------|-----------------------");
      L.push("  T1        | [...................] | [....] | [...................]");
      L.push("  T2        | [...................] | [....] | [...................]");
      L.push("  T3        | [...................] | [....] | [...................]");
      L.push("  T4        | [...................] | [....] | [...................]");
      L.push("");
      L.push("A.5 — CE QUI N'A PAS ÉTÉ FAIT L'AN DERNIER");
      L.push("");
      L.push("« Lorsque certaines des mesures prévues par l'employeur ou demandées par");
      L.push("le comité n'ont pas été prises au cours de l'année concernée par le");
      L.push("programme, l'employeur énonce les motifs de cette inexécution, en annexe");
      L.push("au rapport annuel » (L. 2312-27). Cette annexe n'est pas facultative, et");
      L.push("c'est elle que le comité lit en premier.");
      L.push("");
      L.push("  Mesure non exécutée | Prévue par | Motif de l'inexécution | Reportée en");
      L.push("  --------------------|------------|------------------------|-------------");
      L.push("  [................]  | [employeur / comité] | [.............] | [........]");
      L.push("  [................]  | [employeur / comité] | [.............] | [........]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      /* ---- PARTIE B : la liste d'actions ---- */
      L.push(GROS);
      L.push("PARTIE B — LISTE DES ACTIONS DE PRÉVENTION ET DE PROTECTION");
      L.push("(effectif inférieur à cinquante salariés — L. 4121-3-1, III, 2°)");
      L.push(GROS);
      L.push("");
      L.push("DEUX DIFFÉRENCES AVEC LE PROGRAMME, ET ELLES COMPTENT :");
      L.push("");
      L.push("  · le 2° n'exige ni indicateurs de résultat, ni estimation de coût, ni");
      L.push("    calendrier formalisé : il exige la DÉFINITION d'actions de prévention");
      L.push("    des risques et de protection des salariés ;");
      L.push("  · la liste « est consignée DANS LE DOCUMENT UNIQUE d'évaluation des");
      L.push("    risques professionnels ET SES MISES À JOUR ». Elle n'est donc pas une");
      L.push("    pièce séparée : une liste rangée dans un autre classeur ne satisfait");
      L.push("    pas le texte. Recopiez le tableau ci-dessous dans votre document");
      L.push("    unique, et refaites-le à chaque mise à jour.");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("Liste des actions de prévention et de protection");
      L.push("Consignée au document unique, version du [DATE DE LA VERSION]");
      L.push("");
      L.push("  N° | Unité de travail | Risque visé | Action de prévention ou de protection | Échéance | Responsable");
      L.push("  ---|------------------|-------------|---------------------------------------|----------|------------");
      L.push("  1  | [..............] | [.........] | [...................................] | [......] | [.........]");
      L.push("  2  | [..............] | [.........] | [...................................] | [......] | [.........]");
      L.push("  3  | [..............] | [.........] | [...................................] | [......] | [.........]");
      L.push("  4  | [..............] | [.........] | [...................................] | [......] | [.........]");
      L.push("");
      L.push("Rappel de l'ordre imposé par L. 4121-2 : éviter, évaluer ce qui ne peut");
      L.push("être évité, combattre à la source, adapter le travail à l'homme, tenir");
      L.push("compte de la technique, remplacer ce qui est dangereux, planifier,");
      L.push("PRIVILÉGIER LA PROTECTION COLLECTIVE SUR LA PROTECTION INDIVIDUELLE,");
      L.push("donner les instructions appropriées. Une action qui distribue des");
      L.push("équipements individuels sans avoir écrit pourquoi le collectif ne suffit");
      L.push("pas prend le 8° à l'envers.");
      L.push("");
      L.push("");

      /* ---- la présentation au comité ---- */
      L.push(GROS);
      L.push("PIÈCE COMMUNE — PRÉSENTATION AU COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push(GROS);
      L.push("");
      L.push("« Dans le cadre de la consultation sur la politique sociale, l'employeur");
      L.push("présente également au comité social et économique : 1° Un rapport annuel");
      L.push("écrit faisant le bilan de la situation générale de la santé, de la");
      L.push("sécurité et des conditions de travail dans l'entreprise et des actions");
      L.push("menées au cours de l'année écoulée dans ces domaines. Les questions du");
      L.push("travail de nuit et de prévention des effets de l'exposition aux facteurs");
      L.push("de risques professionnels mentionnés à l'article L. 4161-1 sont traitées");
      L.push("spécifiquement ; 2° Le programme annuel de prévention des risques");
      L.push("professionnels et d'amélioration des conditions de travail mentionné au 1°");
      L.push("du III de l'article L. 4121-3-1. Lors de l'avis rendu sur le rapport et");
      L.push("sur le programme annuels de prévention, le comité peut proposer un ordre");
      L.push("de priorité et l'adoption de mesures supplémentaires » (L. 2312-27).");
      L.push("");
      L.push("DEUX PIÈCES, PAS UNE : le rapport annuel (1°) ET le programme (2°). Le");
      L.push("rapport regarde l'année écoulée, le programme l'année à venir. Présenter");
      L.push("l'un sans l'autre ne satisfait pas le texte.");
      L.push("");
      L.push("ET UN EFFET QUE L'ON DÉCOUVRE TROP TARD : « Le procès-verbal de la réunion");
      L.push("du comité consacrée à l'examen du rapport et du programme est joint à");
      L.push("toute demande présentée par l'employeur en vue d'obtenir des marchés");
      L.push("publics, des participations publiques, des subventions, des primes de");
      L.push("toute nature ou des avantages sociaux ou fiscaux » (L. 2312-27). Sans");
      L.push("réunion, pas de procès-verbal ; sans procès-verbal, la demande est");
      L.push("incomplète.");
      L.push("");
      L.push("R. 4121-3 ajoute que « dans les établissements dotés d'un comité social et");
      L.push("économique, le document unique d'évaluation des risques professionnels est");
      L.push("utilisé pour l'établissement du rapport annuel prévu au 1° de l'article");
      L.push("L. 2312-27 ». Le rapport se nourrit donc du document unique : ce sont deux");
      L.push("pièces, une seule source.");
      L.push("");
      if (estNon(cseExiste)) {
        L.push("Le dossier n'indique aucun comité social et économique : la présentation");
        L.push("de L. 2312-27 n'a pas d'objet en l'état, et la régularité de cette absence");
        L.push("relève du module « comité social et économique ». Le programme ou la liste");
        L.push("reste dû : L. 4121-3-1, III, ne le subordonne à l'existence d'aucune");
        L.push("instance.");
        L.push("");
      }
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la délégation du personnel",
         "du comité social et économique"], false));
      L.push("Objet : consultation sur la politique sociale — rapport annuel et");
      L.push("programme annuel de prévention");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Dans le cadre de la consultation sur la politique sociale, je vous adresse");
      L.push("ci-joint, conformément à l'article L. 2312-27 du code du travail :");
      L.push("");
      L.push("  · le rapport annuel écrit faisant le bilan de la situation générale de");
      L.push("    la santé, de la sécurité et des conditions de travail dans");
      L.push("    l'entreprise et des actions menées au cours de l'année écoulée, dans");
      L.push("    lequel les questions du travail de nuit et de prévention des effets de");
      L.push("    l'exposition aux facteurs de risques professionnels sont traitées");
      L.push("    spécifiquement ;");
      L.push("  · le programme annuel de prévention des risques professionnels et");
      L.push("    d'amélioration des conditions de travail pour l'année [ANNÉE].");
      L.push("");
      L.push("La réunion consacrée à leur examen est fixée au [DATE]. Lors de l'avis que");
      L.push("vous rendrez, vous pouvez proposer un ordre de priorité et l'adoption de");
      L.push("mesures supplémentaires.");
      L.push("");
      L.push("[Le cas échéant : les motifs pour lesquels certaines des mesures prévues");
      L.push("l'an dernier n'ont pas été prises figurent en annexe au rapport annuel.]");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("Pièces jointes : rapport annuel · programme annuel de prévention");
      L.push("");
      L.push("Note sur les délais de convocation et de transmission : ils sont fixés par");
      L.push("les règles propres au comité — accord, règlement intérieur du comité, code");
      L.push("du travail dans sa partie consacrée au comité — que ce module n'a pas");
      L.push("lues. Le module « comité social et économique » de l'application les");
      L.push("traite. Ne calez pas votre réunion sans les avoir vérifiés.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous extrayez du document unique les");
      L.push("lignes « mesures à prendre » et vous les chiffrez.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 14)) + " environ — chaque mesure porte ses trois");
      L.push("éléments : conditions d'exécution, indicateurs de résultat, estimation du");
      L.push("coût (L. 4121-3-1, III, 1°, a). C'est l'étape la plus longue.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ — ressources identifiées (b) et");
      L.push("calendrier de mise en œuvre arrêté (c). Le programme est complet.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ — envoi au comité du rapport");
      L.push("annuel et du programme, sous réserve des délais propres au comité.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 45)) + " environ — réunion consacrée à leur examen,");
      L.push("avis rendu, procès-verbal établi et conservé (L. 2312-27).");
      L.push("");
      L.push("Puis à chaque mise à jour du document unique — révision du programme ou de");
      L.push("la liste « si nécessaire » (R. 4121-2, dernier alinéa), et non une fois");
      L.push("par an seulement.");
      L.push("");
      L.push("Ces durées sont indicatives. Le seul rythme que les textes lus imposent");
      L.push("est annuel : « au cours de l'année à venir » pour le programme");
      L.push("(L. 4121-3-1, III, 1°, a), « rapport annuel » pour le bilan (L. 2312-27).");

      return L.concat(pied("L. 4121-3-1, III et IV, L. 4121-2, L. 2312-27, R. 4121-2, R. 4121-3",
        ["Aucune peine n'est annoncée ici, et ce n'est pas une omission. R. 4741-1 ne",
         "punit que le défaut de transcription et de mise à jour « dans les conditions",
         "prévues aux articles R. 4121-1 et R. 4121-2 » : il n'atteint pas le III de",
         "L. 4121-3-1. L. 4741-1 ne l'atteint pas non plus — son énumération vise,",
         "pour le livre Ier de la quatrième partie, les « Titres Ier, III et IV », et",
         "le titre II en est absent. Ce qui se joue est l'inexécution d'une obligation",
         "civile, et l'incomplétude des demandes visées au dernier alinéa de",
         "L. 2312-27."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-06 — CONSERVATION DES VERSIONS ET AVIS D'ACCÈS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-06", {
    nom: "L'avis d'accès affiché, le protocole de conservation et le courrier de mise à disposition",
    detail: "L'avis à afficher, le protocole des quarante ans, la liste des " +
            "sept destinataires du droit d'accès et la réponse type à une demande.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Accès au document unique — avis affiché et conservation des versions",
        "articles L. 4121-3-1, V, et R. 4121-4 du code du travail");

      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("  · versions successives conservées : " +
        etat(du.versionsConservees, "oui", "NON"));
      L.push("  · avis d'accès affiché : " + etat(du.avisAffiche, "oui", "NON"));
      L.push("  · version en vigueur : " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("");
      L.push("LES DEUX OBLIGATIONS, ET LEUR DURÉE");
      L.push("");
      L.push("« Le document unique d'évaluation des risques professionnels, dans ses");
      L.push("versions successives, est conservé par l'employeur et tenu à la");
      L.push("disposition des travailleurs, des anciens travailleurs ainsi que de toute");
      L.push("personne ou instance pouvant justifier d'un intérêt à y avoir accès. La");
      L.push("durée, qui ne peut être inférieure à quarante ans, et les modalités de");
      L.push("conservation et de mise à disposition du document ainsi que la liste des");
      L.push("personnes et instances sont fixées par décret en Conseil d'État »");
      L.push("(L. 4121-3-1, V, A).");
      L.push("");
      L.push("Le décret est R. 4121-4 : « Le document unique d'évaluation des risques");
      L.push("professionnels et ses versions antérieures sont tenus, pendant une durée");
      L.push("de 40 ans à compter de leur élaboration, à la disposition » des sept");
      L.push("catégories qu'il énumère.");
      L.push("");
      L.push("Quarante ans À COMPTER DE LEUR ÉLABORATION : le compte court version par");
      L.push("version, non depuis la dernière. Une version de 2024 se conserve jusqu'en");
      L.push("2064, indépendamment de celles qui la suivent.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — AVIS À AFFICHER");
      L.push(GROS);
      L.push("");
      L.push("R. 4121-4, dernier alinéa : « Un avis indiquant les modalités d'accès des");
      L.push("travailleurs au document unique est affiché à une place convenable et");
      L.push("aisément accessible dans les lieux de travail. Dans les entreprises ou");
      L.push("établissements dotés d'un règlement intérieur, cet avis est affiché au");
      L.push("même emplacement que celui réservé au règlement intérieur. »");
      L.push("");
      L.push("Le texte n'impose pas d'afficher le document unique : il impose d'afficher");
      L.push("l'AVIS qui dit comment y accéder. Un document unique punaisé au mur ne");
      L.push("remplace pas cet avis, et ne le contient pas.");
      L.push("");
      L.push("────────── à recopier sur une feuille et à afficher ──────────");
      L.push("");
      L.push("                              AVIS");
      L.push("        MODALITÉS D'ACCÈS AU DOCUMENT UNIQUE D'ÉVALUATION");
      L.push("                 DES RISQUES PROFESSIONNELS");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("Le document unique d'évaluation des risques professionnels de");
      L.push("l'entreprise, ainsi que ses versions antérieures, sont tenus à votre");
      L.push("disposition en application des articles L. 4121-3-1, V, et R. 4121-4 du");
      L.push("code du travail.");
      L.push("");
      L.push("OÙ LE CONSULTER : [LIEU PRÉCIS — bureau, service, intranet, adresse de la");
      L.push("page ; s'il est dématérialisé, dire comment y accéder sans compte");
      L.push("professionnel, pour les anciens travailleurs].");
      L.push("");
      L.push("À QUI LE DEMANDER : [NOM, FONCTION, courriel, téléphone].");
      L.push("");
      L.push("QUAND : [horaires ou délai de réponse à une demande].");
      L.push("");
      L.push("QUI PEUT Y ACCÉDER : les travailleurs et les anciens travailleurs, pour");
      L.push("les versions en vigueur durant leur période d'activité dans l'entreprise ;");
      L.push("les membres de la délégation du personnel du comité social et économique ;");
      L.push("le service de prévention et de santé au travail ; les agents du système");
      L.push("d'inspection du travail ; les agents des services de prévention des");
      L.push("organismes de sécurité sociale ; les agents des organismes professionnels");
      L.push("de santé, de sécurité et des conditions de travail ; les inspecteurs de la");
      L.push("radioprotection et les agents mentionnés au 7° de R. 4121-4, pour ce qui");
      L.push("concerne les rayonnements ionisants.");
      L.push("");
      L.push("Les travailleurs et anciens travailleurs peuvent communiquer les éléments");
      L.push("mis à leur disposition aux professionnels de santé en charge de leur suivi");
      L.push("médical (R. 4121-4, 1°).");
      L.push("");
      L.push("Affiché le [DATE] · " + signataire(ctx));
      L.push("");
      L.push("──────────────────────────────────────────────────────────────");
      L.push("");
      L.push("OÙ L'AFFICHER : à une place convenable et aisément accessible dans les");
      L.push("lieux de travail. S'il existe un règlement intérieur, AU MÊME EMPLACEMENT");
      L.push("que lui — le texte le dit expressément. Sur plusieurs sites, un avis par");
      L.push("site : « les lieux de travail » sont tous les lieux de travail.");
      L.push("");
      L.push("[PHOTOGRAPHIER L'AFFICHAGE, daté. C'est la seule preuve simple, et elle ne");
      L.push(" se reconstitue pas après coup.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — PROTOCOLE DE CONSERVATION ET DE MISE À DISPOSITION");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — protocole établi le " + leJour(d0));
      L.push("");
      L.push("1. CE QUI EST CONSERVÉ");
      L.push("   La version en vigueur ET toutes les versions antérieures, chacune");
      L.push("   pendant quarante ans au moins à compter de son élaboration (R. 4121-4).");
      L.push("   Une sauvegarde écrasée à chaque mise à jour ne satisfait pas le texte :");
      L.push("   elle détruit précisément ce qu'il faut conserver.");
      L.push("");
      L.push("2. SUPPORT ET LIEU");
      L.push("   [PRÉCISER : papier — armoire, local ; dématérialisé — serveur, espace,");
      L.push("    sauvegarde. Jusqu'à l'entrée en vigueur de l'obligation de dépôt sur le");
      L.push("    portail numérique prévue au B du V de L. 4121-3-1, « l'employeur");
      L.push("    conserve les versions successives du document unique au sein de");
      L.push("    l'entreprise sous la forme d'un document papier ou dématérialisé »");
      L.push("    (R. 4121-4).]");
      L.push("");
      L.push("   Sur ce dépôt dématérialisé, L. 4121-3-1, V, B, prévoit un portail");
      L.push("   numérique déployé et administré par un organisme géré par les");
      L.push("   organisations professionnelles d'employeurs représentatives au niveau");
      L.push("   national et interprofessionnel, l'obligation étant applicable « à");
      L.push("   compter du 1er juillet 2023, aux entreprises dont l'effectif est");
      L.push("   supérieur ou égal à cent cinquante salariés » et, « à compter de dates");
      L.push("   fixées par décret, en fonction des effectifs des entreprises, et au plus");
      L.push("   tard à compter du 1er juillet 2024 », aux autres. L'application ne sait");
      L.push("   pas où en est ce déploiement : vérifiez-le. En tout état de cause,");
      L.push("   conservez vos versions dans l'entreprise.");
      L.push("");
      L.push("3. RESPONSABLE : [NOM ET FONCTION]. Suppléant : [NOM].");
      L.push("   Une conservation de quarante ans survit à ceux qui l'ont organisée :");
      L.push("   nommez la FONCTION autant que la personne.");
      L.push("");
      L.push("4. LES SEPT CATÉGORIES DE R. 4121-4, ET CE QU'ELLES PEUVENT DEMANDER");
      L.push("");
      L.push("  1° Les travailleurs et anciens travailleurs, « pour les versions en");
      L.push("     vigueur durant leur période d'activité dans l'entreprise ». La");
      L.push("     communication des versions antérieures à celle en vigueur à la date de");
      L.push("     la demande « peut être limitée aux seuls éléments afférents à");
      L.push("     l'activité du demandeur ». Ils peuvent communiquer ces éléments aux");
      L.push("     professionnels de santé en charge de leur suivi médical.");
      L.push("  2° Les membres de la délégation du personnel du comité social et");
      L.push("     économique.");
      L.push("  3° Le service de prévention et de santé au travail mentionné à l'article");
      L.push("     L. 4622-1.");
      L.push("  4° Les agents du système d'inspection du travail.");
      L.push("  5° Les agents des services de prévention des organismes de sécurité");
      L.push("     sociale.");
      L.push("  6° Les agents des organismes professionnels de santé, de sécurité et des");
      L.push("     conditions de travail mentionnés à l'article L. 4643-1.");
      L.push("  7° Les inspecteurs de la radioprotection mentionnés à l'article");
      L.push("     L. 1333-29 du code de la santé publique et les agents mentionnés à");
      L.push("     l'article L. 1333-30 du même code, en ce qui concerne les résultats");
      L.push("     des évaluations liées à l'exposition des travailleurs aux rayonnements");
      L.push("     ionisants, pour les installations et activités dont ils ont");
      L.push("     respectivement la charge.");
      L.push("");
      L = L.concat(blocRenvoi("L. 4622-1, L. 4643-1, et les articles L. 1333-29 et L. 1333-30 du code de la santé publique",
        "sont nommés par R. 4121-4 pour désigner les services et agents qui ont accès " +
        "au document ; le relais Légifrance du dépôt ne sert que le code du travail"));
      L.push("5. DÉLAI DE RÉPONSE À UNE DEMANDE");
      L.push("   Aucun texte lu n'en fixe. Fixez-en un et tenez-le : [.... jours");
      L.push("   ouvrables]. Un document « tenu à la disposition » qui met trois mois à");
      L.push("   sortir n'est pas tenu à la disposition de qui que ce soit.");
      L.push("");
      L.push("6. REGISTRE DES DEMANDES");
      L.push("");
      L.push("  Date | Demandeur | Qualité (1° à 7°) | Versions demandées | Réponse le | Éléments remis");
      L.push("  -----|-----------|-------------------|--------------------|------------|---------------");
      L.push("  [..] | [.......] | [...............] | [................] | [........] | [............]");
      L.push("  [..] | [.......] | [...............] | [................] | [........] | [............]");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — RÉPONSE À UNE DEMANDE D'ACCÈS (lettre type)");
      L.push(GROS);
      L.push("");
      L.push("À adapter selon la qualité du demandeur. Le cas le plus fréquent, et le");
      L.push("plus mal traité, est celui de l'ancien travailleur : il a droit aux");
      L.push("versions en vigueur DURANT SA PÉRIODE D'ACTIVITÉ, et non à la seule");
      L.push("version du jour.");
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM ET PRÉNOM DU DEMANDEUR]", "[adresse]"], false));
      L.push("Objet : votre demande d'accès au document unique d'évaluation des risques");
      L.push("professionnels");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Vous avez sollicité, par [courrier / courriel] du [DATE], l'accès au");
      L.push("document unique d'évaluation des risques professionnels de " + nomDe(ctx) + ".");
      L.push("");
      L.push("En application des articles L. 4121-3-1, V, et R. 4121-4 du code du");
      L.push("travail, je mets à votre disposition les versions suivantes :");
      L.push("");
      L.push("  [LISTER LES VERSIONS REMISES, avec leur date d'élaboration. Pour un");
      L.push("   ancien travailleur : celles en vigueur durant sa période d'activité,");
      L.push("   du [date d'entrée] au [date de sortie].]");
      L.push("");
      L.push("[Le cas échéant : conformément au 1° de l'article R. 4121-4, la");
      L.push("communication des versions antérieures à celle en vigueur à la date de");
      L.push("votre demande est limitée aux éléments afférents à votre activité, à");
      L.push("savoir [préciser les unités de travail concernées].]");
      L.push("");
      L.push("Le même texte vous permet de communiquer ces éléments aux professionnels");
      L.push("de santé en charge de votre suivi médical.");
      L.push("");
      L.push("[Modalités pratiques : remise sur place le [date] / envoi dématérialisé /");
      L.push("copie jointe.]");
      L.push("");
      L = L.concat(formulePolitesse(ctx));
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous rédigez l'avis et vous l'affichez.");
      L.push("C'est l'acte le plus rapide du module : il ne dépend de personne d'autre.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ — avis affiché sur chaque site,");
      L.push("photographié et daté.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ — versions antérieures rassemblées,");
      L.push("support de conservation arrêté, responsable nommé, registre des demandes");
      L.push("ouvert.");
      L.push("");
      L.push("Ensuite, à chaque nouvelle version — archiver la précédente sans l'écraser");
      L.push("et vérifier que l'avis affiché reste exact (nom, lieu, contact).");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai. La");
      L.push("conservation, elle, se compte en quarante ans par version.");

      return L.concat(pied("L. 4121-3-1, I et V, R. 4121-4",
        ["Aucune peine n'est annoncée ici, et la vérification a été faite. R. 4741-1",
         "ne punit que le défaut de transcription et de mise à jour « dans les",
         "conditions prévues aux articles R. 4121-1 et R. 4121-2 » : R. 4121-4 n'y est",
         "pas. R. 4741-3, dont l'objet — « les documents et affichages obligatoires » —",
         "pourrait le laisser croire, vise une liste close : « les articles L. 4711-1 à",
         "L. 4711-5 ainsi que […] les articles D. 4711-1 à D. 4711-3 ». R. 4121-4 n'y",
         "figure pas davantage. Ce qui se perd sans conservation, c'est la traçabilité",
         "collective des expositions que L. 4121-3-1, I, met à la charge du document —",
         "et la capacité de répondre à un ancien salarié ou à un agent de contrôle."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-07 — LA CONSULTATION DU COMITÉ SUR LE DOCUMENT UNIQUE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-07", {
    nom: "La consultation du comité sur le document unique — ordre du jour et procès-verbal",
    detail: "Le courrier de transmission, le point d'ordre du jour rédigé, la " +
            "trame de procès-verbal et le suivi des mises à jour successives.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {}, cse = f.cse || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Consultation du comité social et économique sur le document unique",
        "article L. 4121-3, 1°, du code du travail");

      L.push("LE TEXTE, ET CE QU'IL VISE EXACTEMENT");
      L.push("");
      L.push("« Apportent leur contribution à l'évaluation des risques professionnels");
      L.push("dans l'entreprise : 1° Dans le cadre du dialogue social dans l'entreprise,");
      L.push("le comité social et économique et sa commission santé, sécurité et");
      L.push("conditions de travail, s'ils existent, en application du 1° de l'article");
      L.push("L. 2312-9. LE COMITÉ SOCIAL ET ÉCONOMIQUE EST CONSULTÉ SUR LE DOCUMENT");
      L.push("UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS ET SUR SES MISES À JOUR »");
      L.push("(L. 4121-3).");
      L.push("");
      L.push("Trois conséquences, souvent manquées :");
      L.push("");
      L.push("  · c'est une CONSULTATION, pas une information. Une remise de document en");
      L.push("    séance, sans avis demandé ni recueilli, ne satisfait pas le texte.");
      L.push("  · elle porte sur le document unique ET SES MISES À JOUR, sans");
      L.push("    distinguer : chaque nouvelle version se soumet. Une consultation");
      L.push("    unique, à l'origine, ne couvre pas les versions suivantes.");
      L.push("  · elle est DISTINCTE de la présentation du rapport et du programme");
      L.push("    annuels de L. 2312-27. Deux points d'ordre du jour, deux avis.");
      L.push("");
      L = L.concat(blocRenvoi("L. 2312-9",
        "est nommé par L. 4121-3, 1°, comme le siège de l'attribution du comité en " +
        "matière de santé, de sécurité et de conditions de travail"));
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  · comité social et économique : " +
        etat(cse.existe, "existant", "AUCUN DÉCLARÉ"));
      L.push("  · document unique : " + etat(du.existe, "existant", "INEXISTANT") +
        ", version du " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  · comité consulté sur cette version : " +
        etat(du.consultationCSE, "oui", "NON — c'est l'objet de ce document"));
      L.push("");
      if (estNon(cse.existe)) {
        L.push("ATTENTION — le dossier n'indique aucun comité social et économique. La");
        L.push("consultation de L. 4121-3, 1°, ne peut pas être accomplie tant qu'il n'y");
        L.push("a pas de comité, et la régularité de cette absence relève du module");
        L.push("« comité social et économique » de l'application, non de celui-ci. Les");
        L.push("pièces ci-dessous sont écrites pour le jour où le comité existera.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — COURRIER DE TRANSMISSION ET DE SAISINE");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la délégation du personnel",
         "du comité social et économique",
         "Copie : [aux membres de la commission santé, sécurité et conditions de",
         "travail, s'il en existe une]"], false));
      L.push("Objet : consultation sur le document unique d'évaluation des risques");
      L.push("professionnels — version du [DATE DE LA VERSION]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("L'article L. 4121-3, 1°, du code du travail dispose que le comité social");
      L.push("et économique est consulté sur le document unique d'évaluation des risques");
      L.push("professionnels et sur ses mises à jour.");
      L.push("");
      L.push("Je vous adresse en conséquence, ci-joint, [le document unique / la mise à");
      L.push("jour du document unique] dans sa version du [DATE], afin que vous puissiez");
      L.push("en prendre connaissance avant la réunion du [DATE DE LA RÉUNION], à");
      L.push("laquelle ce point sera soumis à votre avis.");
      L.push("");
      L.push("[S'il s'agit d'une mise à jour : la note de mise à jour, qui expose ce qui");
      L.push("a changé depuis la version précédente et pour quel motif de R. 4121-2, est");
      L.push("jointe.]");
      L.push("");
      L.push("Le même article associe à l'évaluation la commission santé, sécurité et");
      L.push("conditions de travail lorsqu'elle existe : [le cas échéant, préciser la");
      L.push("date à laquelle la commission en a été saisie].");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("Pièces jointes : document unique, version du [date] · [note de mise à");
      L.push("jour] · [inventaire par unité de travail]");
      L.push("");
      L.push("Note sur les délais : le délai de transmission avant la réunion et les");
      L.push("règles de convocation du comité sont fixés par les textes propres au");
      L.push("comité, par l'accord d'entreprise et par le règlement intérieur du comité");
      L.push("— que ce module n'a pas lus. Le module « comité social et économique » de");
      L.push("l'application les traite. Ne fixez pas la date de réunion sans les avoir");
      L.push("vérifiés : une consultation menée sans délai suffisant se conteste.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — POINT D'ORDRE DU JOUR, RÉDIGÉ");
      L.push(GROS);
      L.push("");
      L.push("À reprendre tel quel dans l'ordre du jour de la réunion. La rédaction");
      L.push("compte : un point intitulé « point sécurité » ne prouve pas qu'une");
      L.push("consultation a eu lieu.");
      L.push("");
      L.push("  Point n° [.] — CONSULTATION SUR LE DOCUMENT UNIQUE D'ÉVALUATION DES");
      L.push("  RISQUES PROFESSIONNELS ET SUR SA MISE À JOUR (L. 4121-3, 1°)");
      L.push("");
      L.push("  Objet : recueillir l'avis du comité sur [le document unique / la mise à");
      L.push("  jour du document unique] dans sa version du [DATE].");
      L.push("  Document transmis le [DATE].");
      L.push("  Avis attendu : oui.");
      L.push("");
      L.push("  [Point distinct, le cas échéant :]");
      L.push("  Point n° [.] — PRÉSENTATION DU RAPPORT ANNUEL ET DU PROGRAMME ANNUEL DE");
      L.push("  PRÉVENTION (L. 2312-27) — à ne pas confondre avec le point précédent.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — TRAME DE PROCÈS-VERBAL (extrait relatif à ce point)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE — RÉUNION DU [DATE]");
      L.push("Extrait du procès-verbal — point n° [.]");
      L.push("");
      L.push("PRÉSENTS : [liste — président, membres titulaires, suppléants présents,");
      L.push("représentants syndicaux, invités].");
      L.push("");
      L.push("1. DOCUMENT SOUMIS");
      L.push("   [Document unique / mise à jour du document unique], version du [DATE],");
      L.push("   transmis aux membres le [DATE].");
      L.push("");
      L.push("2. PRÉSENTATION");
      L.push("   [Résumer ce qui a été exposé : périmètre, unités de travail, risques");
      L.push("    ajoutés ou retirés, mesures à prendre, échéances. L'application ne");
      L.push("    connaît pas le contenu de votre document et n'en résumera rien.]");
      L.push("");
      L.push("3. OBSERVATIONS DES MEMBRES");
      L.push("   [CONSIGNER LES OBSERVATIONS, telles qu'elles ont été faites. Un");
      L.push("    procès-verbal qui n'en porte aucune, alors qu'il y en a eu, se retourne");
      L.push("    contre celui qui l'a rédigé.]");
      L.push("");
      L.push("4. RÉPONSES APPORTÉES");
      L.push("   [.....................................................]");
      L.push("");
      L.push("5. AVIS DU COMITÉ");
      L.push("   Le comité, consulté en application de l'article L. 4121-3, 1°, du code");
      L.push("   du travail sur [le document unique / sa mise à jour], rend un avis");
      L.push("   [favorable / défavorable / favorable assorti des réserves suivantes :");
      L.push("   ..... ].");
      L.push("   Votants : [..] · Pour : [..] · Contre : [..] · Abstentions : [..]");
      L.push("");
      L.push("   [Si le comité ne rend pas d'avis, l'écrire : « le comité n'a pas rendu");
      L.push("    d'avis ». La consultation aura eu lieu ; l'avis, non. Les deux se");
      L.push("    prouvent séparément.]");
      L.push("");
      L.push("6. SUITES");
      L.push("   [Ce que l'employeur retient, ce qu'il ne retient pas et pourquoi.]");
      L.push("");
      L.push("Le procès-verbal est établi selon les règles propres au comité — délais,");
      L.push("rédacteur, adoption, diffusion — que ce module n'a pas lues.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — SUIVI DES CONSULTATIONS, VERSION PAR VERSION");
      L.push(GROS);
      L.push("");
      L.push("L. 4121-3, 1°, vise le document unique « et ses mises à jour ». Ce tableau");
      L.push("sert à démontrer que la correspondance est complète : une version sans");
      L.push("ligne en face est une consultation manquante.");
      L.push("");
      L.push("  Version du document unique | Transmise le | Réunion du | Avis rendu | PV n°");
      L.push("  ---------------------------|--------------|------------|------------|-------");
      L.push("  [.......................]  | [..........] | [........] | [........] | [....]");
      L.push("  [.......................]  | [..........] | [........] | [........] | [....]");
      L.push("  [.......................]  | [..........] | [........] | [........] | [....]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous transmettez le document aux membres");
      L.push("(pièce 1) et vous inscrivez le point à l'ordre du jour (pièce 2).");
      L.push("");
      L.push("Réunion : à fixer selon les délais de convocation et de transmission");
      L.push("propres au comité, que ce module n'a pas lus. À titre indicatif, une");
      L.push("réunion au " + leJour(dans(d0, 21)) + " laisse trois semaines de lecture ;");
      L.push("vérifiez ce que vos règles imposent avant de retenir cette date.");
      L.push("");
      L.push("Le jour de la réunion — avis recueilli et consigné (pièce 3).");
      L.push("");
      L.push("Ensuite — procès-verbal conservé avec la version correspondante du");
      L.push("document, et ligne ajoutée au tableau de suivi (pièce 4).");
      L.push("");
      L.push("À chaque mise à jour — on recommence. C'est le point où l'on décroche :");
      L.push("la première consultation se fait, les suivantes s'oublient.");

      return L.concat(pied("L. 4121-3, 1°, L. 4121-3-1, R. 4121-2, L. 2312-27, L. 2317-1",
        ["LE MANQUEMENT N'EST PAS SEULEMENT CIVIL. « Le fait d'apporter une entrave à",
         "leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1).",
         "Une consultation que la loi impose et qui n'a pas eu lieu expose l'employeur",
         "à cette qualification — qu'il appartient au juge de retenir ou d'écarter, et",
         "que l'application n'anticipe pas. Le module « comité social et économique »",
         "cite le même texte dans les mêmes termes."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-08 — LA TRANSMISSION AU SERVICE DE PRÉVENTION ET DE SANTÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-08", {
    nom: "Le bordereau de transmission du document unique au service de prévention et de santé au travail",
    detail: "Le courrier de transmission, le bordereau, le registre des envois " +
            "et la consigne qui fait que l'envoi se répète tout seul.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Transmission du document unique au service de prévention et de santé au travail",
        "article L. 4121-3-1, VI, du code du travail");

      L.push("LE TEXTE, EN ENTIER — IL TIENT EN UNE PHRASE");
      L.push("");
      L.push("« Le document unique d'évaluation des risques professionnels est transmis");
      L.push("par l'employeur à chaque mise à jour au service de prévention et de santé");
      L.push("au travail auquel il adhère » (L. 4121-3-1, VI).");
      L.push("");
      L.push("« À CHAQUE MISE À JOUR » : ce n'est pas une transmission initiale, c'est un");
      L.push("réflexe. C'est aussi la raison pour laquelle ce manquement est le plus");
      L.push("fréquent du module — le premier envoi se fait, les suivants s'oublient.");
      L.push("");
      L.push("POURQUOI CE SERVICE, ET PAS UN AUTRE");
      L.push("");
      L.push("Parce que L. 4121-3 le compte parmi ceux qui « apportent leur contribution");
      L.push("à l'évaluation des risques professionnels dans l'entreprise » (3°). Sans");
      L.push("le document, il ne dispose pas de la pièce sur laquelle cette contribution");
      L.push("repose. Et R. 4121-4, 3°, lui ouvre par ailleurs l'accès aux versions");
      L.push("antérieures.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  · document unique : " + etat(du.existe, "existant", "INEXISTANT") +
        ", version du " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  · transmis au service à chaque mise à jour : " +
        etat(du.transmisSPST, "oui", "NON — c'est l'objet de ce document"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — COURRIER DE TRANSMISSION");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM DU SERVICE DE PRÉVENTION ET DE SANTÉ AU TRAVAIL]",
         "[adresse]",
         "À l'attention de [médecin du travail référent / responsable du suivi de",
         "l'entreprise]"], false));
      L.push("Objet : transmission du document unique d'évaluation des risques");
      L.push("professionnels — version du [DATE DE LA VERSION]");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application de l'article L. 4121-3-1, VI, du code du travail, aux termes");
      L.push("duquel le document unique d'évaluation des risques professionnels est");
      L.push("transmis par l'employeur à chaque mise à jour au service de prévention et");
      L.push("de santé au travail auquel il adhère, je vous adresse ci-joint la version");
      L.push("du [DATE] du document unique de " + nomDe(ctx) + ".");
      L.push("");
      L.push("[S'il s'agit d'une mise à jour : cette version fait suite à celle du");
      L.push("[DATE]. La note de mise à jour, qui expose ce qui a changé et sur quel");
      L.push("fondement de R. 4121-2, est jointe.]");
      L.push("");
      L.push("Je vous rappelle que votre service est appelé, par le 3° de l'article");
      L.push("L. 4121-3, à apporter sa contribution à l'évaluation des risques");
      L.push("professionnels dans l'entreprise. Toute observation de votre part sur");
      L.push("cette version sera versée au dossier et examinée à la prochaine mise à");
      L.push("jour.");
      L.push("");
      L = L.concat(formulePolitesse(ctx));
      L.push("Pièces jointes : document unique, version du [date] · [note de mise à");
      L.push("jour] · [programme annuel de prévention ou liste des actions]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — BORDEREAU DE TRANSMISSION");
      L.push(GROS);
      L.push("");
      L.push("À joindre à l'envoi et à conserver. C'est cette pièce, datée, qui prouvera");
      L.push("la transmission — un courriel effacé du serveur de messagerie ne prouve");
      L.push("rien trois ans plus tard.");
      L.push("");
      L.push("  BORDEREAU DE TRANSMISSION");
      L.push("");
      L.push("  Émetteur      : " + nomDe(ctx));
      L.push("                  " + cro((ctx.profil || {}).adresse, "adresse du siège"));
      L.push("                  " + cro((ctx.profil || {}).siret, "SIRET"));
      L.push("  Destinataire  : [nom du service de prévention et de santé au travail]");
      L.push("  Date d'envoi  : [DATE]");
      L.push("  Mode d'envoi  : [courriel avec accusé de réception / plateforme du");
      L.push("                  service / lettre recommandée / remise contre récépissé]");
      L.push("");
      L.push("  Pièces transmises :");
      L.push("    [ ] document unique d'évaluation des risques professionnels,");
      L.push("        version du [DATE], [nb] pages");
      L.push("    [ ] note de mise à jour");
      L.push("    [ ] inventaire par unité de travail");
      L.push("    [ ] programme annuel de prévention / liste des actions de prévention");
      L.push("");
      L.push("  Fondement : article L. 4121-3-1, VI, du code du travail.");
      L.push("");
      L.push("  Émis par : " + signataire(ctx));
      L.push("  Accusé de réception du service, le : [DATE] — [signature ou référence]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — REGISTRE DES TRANSMISSIONS");
      L.push(GROS);
      L.push("");
      L.push("  Version du document unique | Date de la version | Transmise le | Mode | Accusé");
      L.push("  ---------------------------|--------------------|--------------|------|-------");
      L.push("  [.......................]  | [................] | [..........] | [..] | [....]");
      L.push("  [.......................]  | [................] | [..........] | [..] | [....]");
      L.push("  [.......................]  | [................] | [..........] | [..] | [....]");
      L.push("");
      L.push("Une ligne par VERSION, non par année : c'est la mise à jour qui déclenche");
      L.push("l'obligation, et deux mises à jour dans l'année font deux envois.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — CONSIGNE PERMANENTE (interne)");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — consigne du " + leJour(d0));
      L.push("Objet : transmission systématique du document unique");
      L.push("");
      L.push("La transmission au service de prévention et de santé au travail est");
      L.push("intégrée à la procédure de mise à jour du document unique, comme sa");
      L.push("dernière étape obligatoire. Aucune version n'est réputée close tant que :");
      L.push("");
      L.push("  1. la version est datée et la précédente archivée (L. 4121-3-1, V ;");
      L.push("     R. 4121-4) ;");
      L.push("  2. le comité social et économique a été consulté (L. 4121-3, 1°) ;");
      L.push("  3. le programme annuel ou la liste d'actions a été revu si nécessaire");
      L.push("     (R. 4121-2, dernier alinéa) ;");
      L.push("  4. le document a été transmis au service de prévention et de santé au");
      L.push("     travail, bordereau à l'appui (L. 4121-3-1, VI).");
      L.push("");
      L.push("Chargé de l'envoi : [NOM ET FONCTION]. Suppléant : [NOM].");
      L.push("Service destinataire : [NOM, contact, mode d'envoi accepté].");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous identifiez le service auquel");
      L.push("l'entreprise adhère et le canal d'envoi qu'il accepte.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 3)) + " — envoi de la version en vigueur, avec son");
      L.push("bordereau. Il n'y a rien à préparer : c'est un envoi.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 10)) + " — accusé de réception obtenu et classé ;");
      L.push("à défaut, relance.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 15)) + " — consigne permanente diffusée et");
      L.push("registre des transmissions ouvert, pour que l'envoi suivant ne dépende");
      L.push("plus de la mémoire de personne.");
      L.push("");
      L.push("Ensuite, à chaque mise à jour du document unique — un envoi de plus.");
      L.push("");
      L.push("Ces durées sont indicatives : L. 4121-3-1, VI, ne fixe pas de délai. Il");
      L.push("rattache la transmission à la mise à jour, ce qui la rend exigible dès que");
      L.push("la version est établie.");

      return L.concat(pied("L. 4121-3-1, VI, L. 4121-3, 3°, R. 4121-2, R. 4121-4",
        ["Aucune peine n'est annoncée. R. 4741-1 ne punit que le défaut de",
         "transcription et de mise à jour « dans les conditions prévues aux articles",
         "R. 4121-1 et R. 4121-2 » : le VI de L. 4121-3-1 n'y est pas, et L. 4741-1",
         "n'atteint pas le titre II du livre Ier de la quatrième partie. Ce qui se",
         "joue est l'inexécution d'une obligation civile — et la privation, pour le",
         "service, de la pièce sur laquelle repose la contribution que L. 4121-3, 3°,",
         "lui reconnaît."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     LES OUTILS DE LA COMMISSION SANTÉ-SÉCURITÉ

     Le fondement sur lequel la commission est due se lit dans le dossier ; il
     n'est jamais supposé. Un effectif absent ne fait pas conclure « non due » :
     il fait dire que la question reste ouverte.
     ══════════════════════════════════════════════════════════════════════ */

  function fondementCommission(ctx) {
    var f = ctx.fiche || {};
    var e = effectifDe(ctx);
    if (estOui(f.etablissementRisqueParticulier))
      return { due: true, texte: "L. 2315-36, 3°",
        phrase: "un établissement mentionné aux articles L. 4521-1 et suivants est " +
                "déclaré : la commission est obligatoire quel que soit l'effectif" };
    if (estOui(f.cssctImposeeInspection))
      return { due: true, texte: "L. 2315-37",
        phrase: "l'inspecteur du travail a imposé la création de la commission : " +
                "elle est due quel que soit l'effectif" };
    if (e.connu && e.n >= 300)
      return { due: true, texte: "L. 2315-36, 1°",
        phrase: "effectif de " + e.n + " salariés, au moins trois cents : la " +
                "commission est obligatoire" };
    if (estOui(f.etablissementDistinct300))
      return { due: true, texte: "L. 2315-36, 2°",
        phrase: "un établissement distinct d'au moins trois cents salariés est " +
                "déclaré : la commission y est obligatoire" };
    if (!e.connu)
      return { due: null, texte: null,
        phrase: "l'effectif n'est pas renseigné, et les trois autres cas ne sont " +
                "pas tous tranchés : la question reste ouverte" };
    if (!estNon(f.etablissementDistinct300) || !estNon(f.etablissementRisqueParticulier) ||
        !estNon(f.cssctImposeeInspection))
      return { due: null, texte: null,
        phrase: "l'effectif est sous trois cents, mais les trois autres cas — " +
                "établissement distinct d'au moins trois cents salariés, établissement " +
                "à hauts risques industriels, création imposée par l'inspecteur — ne " +
                "sont pas tous tranchés" };
    return { due: false, texte: "L. 2315-43",
      phrase: "aucun des cas de L. 2315-36 et L. 2315-37 n'est déclaré : la " +
              "commission n'est pas obligatoire, mais elle peut être mise en place " +
              "par accord (L. 2315-43)" };
  }

  /* Le rappel qui doit accompagner tout document sur la commission : les
     modalités de fonctionnement ne viennent pas de la loi, elles viennent de
     l'accord ou du règlement intérieur du comité. */
  function blocEtages(ctx) {
    var c = (ctx.fiche || {}).cssct || {};
    var L = [
      "LES TROIS ÉTAGES, ET CELUI QUI VOUS CONCERNE",
      "",
      "Les modalités de la commission ne sont pas dans la loi : elles sont dans ce",
      "que la loi renvoie à un accord ou, à défaut, au règlement intérieur du",
      "comité. L'ordre est celui-ci, et il ne se prend pas à l'envers :",
      "",
      "  1. ACCORD D'ENTREPRISE défini à l'article L. 2313-2 (L. 2315-41) ;",
      "  2. à défaut de délégué syndical, ACCORD ENTRE L'EMPLOYEUR ET LE COMITÉ,",
      "     « adopté à la majorité des membres titulaires élus de la délégation du",
      "     personnel du comité » (L. 2315-42) ;",
      "  3. « En l'absence d'accord prévu aux articles L. 2315-41 et L. 2315-42, le",
      "     RÈGLEMENT INTÉRIEUR DU COMITÉ social et économique définit les modalités",
      "     mentionnées aux 1° à 6° de l'article L. 2315-41 » (L. 2315-44).",
      "",
    ];
    L = L.concat(blocRenvoi("L. 2313-2",
      "est nommé par L. 2315-41 et L. 2315-43 pour définir l'accord d'entreprise en cause"));
    L.push("Ce que votre dossier déclare : les modalités sont fixées par " +
      (c.modalitesFixees ? "« " + c.modalitesFixees + " »" :
        "[SOURCE NON RENSEIGNÉE]") + ".");
    L.push("");
    return L;
  }

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-01 — LA CRÉATION DE LA COMMISSION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-01", {
    nom: "L'acte constitutif de la commission santé-sécurité, sa convocation, son ordre du jour et son procès-verbal",
    detail: "Le fondement établi, le texte constitutif article par article, la " +
            "résolution de désignation, la convocation, l'ordre du jour type et " +
            "la trame de procès-verbal.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {}, cse = f.cse || {};
      var d0 = aujourd(ctx);
      var fond = fondementCommission(ctx);
      var L = entete(ctx, "Commission santé, sécurité et conditions de travail — acte constitutif et première réunion",
        "articles L. 2315-36 à L. 2315-44 du code du travail");

      L.push("SUR QUEL FONDEMENT LA COMMISSION EST-ELLE DUE ?");
      L.push("");
      L.push("« Une commission santé, sécurité et conditions de travail est créée au");
      L.push("sein du comité social et économique dans : 1° Les entreprises d'au moins");
      L.push("trois cent salariés ; 2° Les établissements distincts d'au moins trois");
      L.push("cent salariés ; 3° Les établissements mentionnés aux articles L. 4521-1 et");
      L.push("suivants » (L. 2315-36).");
      L.push("");
      L.push("« Dans les entreprises et établissements distincts de moins de trois cents");
      L.push("salariés, l'inspecteur du travail peut imposer la création d'une");
      L.push("commission santé, sécurité et conditions de travail lorsque cette mesure");
      L.push("est nécessaire, notamment en raison de la nature des activités, de");
      L.push("l'agencement ou de l'équipement des locaux. Cette décision peut être");
      L.push("contestée devant le directeur régional des entreprises, de la concurrence,");
      L.push("de la consommation, du travail et de l'emploi » (L. 2315-37).");
      L.push("");
      L = L.concat(blocRenvoi("L. 4521-1 et suivants",
        "sont nommés par L. 2315-36, 3°, pour désigner les établissements à hauts " +
        "risques industriels"));
      L.push(ligneEffectif(ctx));
      L.push("  · établissement distinct d'au moins trois cents salariés : " +
        etat(f.etablissementDistinct300, "OUI", "non"));
      L.push("  · établissement relevant de L. 4521-1 et suivants : " +
        etat(f.etablissementRisqueParticulier, "OUI", "non"));
      L.push("  · création imposée par l'inspecteur du travail : " +
        etat(f.cssctImposeeInspection, "OUI", "non"));
      L.push("  · commission existante : " + etat(c.existe, "oui", "NON"));
      L.push("  · comité social et économique : " + etat(cse.existe, "existant", "AUCUN DÉCLARÉ"));
      L.push("");
      L.push("Conclusion tirée du dossier : " + fond.phrase +
        (fond.texte ? " (" + fond.texte + ")" : "") + ".");
      L.push("");
      if (fond.due === null) {
        L.push("L'APPLICATION NE TRANCHE PAS. Elle ne suppose aucun seuil franchi et ne");
        L.push("suppose pas davantage qu'il ne l'est pas. Portez les quatre réponses");
        L.push("ci-dessus avant de conclure : la commission peut être due sur l'un");
        L.push("quelconque des quatre fondements, indépendamment des autres.");
        L.push("");
      }
      if (fond.due === false) {
        L.push("La commission n'est obligatoire sur aucun des fondements déclarés. Elle");
        L.push("peut néanmoins être mise en place : « En dehors des cas prévus aux");
        L.push("articles L. 2315-36 et L. 2315-37, l'accord d'entreprise défini à");
        L.push("l'article L. 2313-2 ou, en l'absence de délégué syndical, un accord entre");
        L.push("l'employeur et le comité social et économique, adopté à la majorité des");
        L.push("membres titulaires élus de la délégation du personnel du comité, peut");
        L.push("fixer le nombre et le périmètre de mise en place de la ou des commissions");
        L.push("santé, sécurité et conditions de travail et définir les modalités");
        L.push("mentionnées aux 1° à 6° de l'article L. 2315-41 » (L. 2315-43). Et");
        L.push("L. 2315-44, deuxième alinéa : « En l'absence d'accord prévu à l'article");
        L.push("L. 2315-43, l'employeur peut fixer le nombre et le périmètre de mise en");
        L.push("place d'une ou plusieurs commissions ». Les documents ci-dessous servent");
        L.push("alors tels quels.");
        L.push("");
      }
      if (estNon(cse.existe)) {
        L.push("ATTENTION — le dossier n'indique aucun comité social et économique. La");
        L.push("commission est créée AU SEIN du comité (L. 2315-36) et ses membres sont");
        L.push("désignés par lui parmi ses membres (L. 2315-39) : elle ne peut pas");
        L.push("exister sans lui. La mise en place du comité relève du module « comité");
        L.push("social et économique » de l'application.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");
      L = L.concat(blocEtages(ctx));

      L.push(GROS);
      L.push("PIÈCE 1 — ACTE CONSTITUTIF DE LA COMMISSION");
      L.push(GROS);
      L.push("");
      L.push("Ce texte se coule dans l'étage retenu : accord d'entreprise, accord avec");
      L.push("le comité, ou règlement intérieur du comité. Le corps des articles ne");
      L.push("change pas ; seuls changent l'intitulé, les signataires et le mode");
      L.push("d'adoption.");
      L.push("");
      L.push("  [INTITULÉ — choisir :");
      L.push("   · « Accord d'entreprise relatif à la commission santé, sécurité et");
      L.push("     conditions de travail » (L. 2315-41) ;");
      L.push("   · « Accord entre l'employeur et le comité social et économique relatif");
      L.push("     à la commission santé, sécurité et conditions de travail »,");
      L.push("     en l'absence de délégué syndical (L. 2315-42) ;");
      L.push("   · « Chapitre [.] du règlement intérieur du comité social et économique");
      L.push("     — commission santé, sécurité et conditions de travail » (L. 2315-44).]");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("La commission santé, sécurité et conditions de travail est créée au sein");
      L.push("du comité social et économique de " + nomDe(ctx) + " sur le fondement de");
      L.push("[" + (fond.texte || "PRÉCISER LE FONDEMENT : L. 2315-36, 1°, 2° ou 3°, " +
        "L. 2315-37, ou L. 2315-43") + "].");
      L.push("");
      L.push("Le présent texte définit les modalités que l'article L. 2315-41 énumère");
      L.push("aux 1° à 6°.");
      L.push("");
      L.push("ARTICLE 1 — NOMBRE ET PÉRIMÈTRE");
      L.push("(L. 2315-41, 1°)");
      L.push("");
      L.push("Il est créé [NOMBRE] commission(s), sur le(s) périmètre(s) suivant(s) :");
      L.push("[PRÉCISER — entreprise, ou tel établissement distinct. Là où la commission");
      L.push("est due au titre d'un établissement distinct d'au moins trois cents");
      L.push("salariés (L. 2315-36, 2°), c'est cet établissement qui commande le");
      L.push("périmètre.]");
      L.push("");
      L.push("Chaque commission comprend [NOMBRE] membres représentants du personnel.");
      L.push("Ce nombre ne peut être inférieur à trois : « Elle comprend au minimum");
      L.push("trois membres représentants du personnel, dont au moins un représentant du");
      L.push("second collège, ou le cas échéant du troisième collège prévus à l'article");
      L.push("L. 2314-11 » (L. 2315-39).");
      L.push("");
      L.push("ARTICLE 2 — COMPOSITION ET PRÉSIDENCE");
      L.push("(L. 2315-39)");
      L.push("");
      L.push("La commission est présidée par l'employeur ou son représentant.");
      L.push("");
      L.push("L'employeur peut se faire assister par des collaborateurs appartenant à");
      L.push("l'entreprise et choisis en dehors du comité. Ensemble, ils ne peuvent pas");
      L.push("être en nombre supérieur à celui des représentants du personnel");
      L.push("titulaires.");
      L.push("");
      L.push("Les membres représentants du personnel sont désignés par le comité social");
      L.push("et économique parmi ses membres, par une résolution adoptée selon les");
      L.push("modalités définies à l'article L. 2315-32, pour une durée qui prend fin");
      L.push("avec celle du mandat des membres élus du comité.");
      L.push("");
      L.push("Au moins un membre représente le second collège ou, le cas échéant, le");
      L.push("troisième collège prévu à l'article L. 2314-11.");
      L.push("");
      L.push("Les dispositions de l'article L. 2315-3 relatives au secret professionnel");
      L.push("et à l'obligation de discrétion sont applicables aux membres et aux");
      L.push("collaborateurs qui assistent l'employeur.");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-3 et L. 2314-3",
        "sont nommés par L. 2315-39 — le premier pour le secret professionnel et " +
        "l'obligation de discrétion, le second pour les réunions de la commission " +
        "lorsque l'accord lui confie tout ou partie des attributions du comité"));
      L.push("ARTICLE 3 — MISSIONS DÉLÉGUÉES");
      L.push("(L. 2315-41, 2° ; limites de L. 2315-38)");
      L.push("");
      L.push("Le comité social et économique délègue à la commission [PRÉCISER : tout ou");
      L.push("partie de ses attributions relatives à la santé, à la sécurité et aux");
      L.push("conditions de travail — et lesquelles, une par une].");
      L.push("");
      L.push("Cette délégation ne peut porter, en aucun cas, sur le recours à un expert");
      L.push("prévu à la sous-section 10 ni sur les attributions consultatives du");
      L.push("comité : « La commission santé, sécurité et conditions de travail se voit");
      L.push("confier, par délégation du comité social et économique, tout ou partie des");
      L.push("attributions du comité relatives à la santé, à la sécurité et aux");
      L.push("conditions de travail, à l'exception du recours à un expert prévu à la");
      L.push("sous-section 10 et des attributions consultatives du comité »");
      L.push("(L. 2315-38). Ces dispositions sont d'ordre public (Soc., 13 mai 2026,");
      L.push("n° 25-12.560) : aucune stipulation du présent texte ne peut y déroger.");
      L.push("");
      L.push("ARTICLE 4 — FONCTIONNEMENT ET HEURES DE DÉLÉGATION");
      L.push("(L. 2315-41, 3°)");
      L.push("");
      L.push("[FIXER : fréquence et convocation des réunions, délai de transmission de");
      L.push("l'ordre du jour, qui établit le procès-verbal et dans quel délai, qui peut");
      L.push("être invité, modalités des visites et des enquêtes.]");
      L.push("");
      L.push("Chaque membre dispose de [NOMBRE] heures de délégation par mois pour");
      L.push("l'exercice de ses missions au sein de la commission.");
      L.push("");
      L.push("ARTICLE 5 — FORMATION");
      L.push("(L. 2315-41, 4° et 6°)");
      L.push("");
      L.push("Les modalités de formation des membres sont fixées conformément aux");
      L.push("articles L. 2315-16 à L. 2315-18 : [PRÉCISER l'organisme, le calendrier,");
      L.push("les modalités de prise en charge].");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-16 et L. 2315-17",
        "sont nommés par L. 2315-41, 4°, aux côtés de L. 2315-18, seul des trois que " +
        "l'application ait lu"));
      L.push("Le cas échéant, une formation spécifique correspondant aux risques ou");
      L.push("facteurs de risques particuliers en rapport avec l'activité de");
      L.push("l'entreprise est dispensée aux membres, dans les conditions suivantes :");
      L.push("[PRÉCISER, ou supprimer cet alinéa].");
      L.push("");
      L.push("ARTICLE 6 — MOYENS");
      L.push("(L. 2315-41, 5°)");
      L.push("");
      L.push("[LE CAS ÉCHÉANT : local, matériel, accès aux documents, temps de");
      L.push("déplacement, budget. Le 5° dit « le cas échéant » : c'est une faculté,");
      L.push("non une obligation. Ce qui n'est pas écrit ne sera pas dû.]");
      L.push("");
      L.push("ARTICLE 7 — DURÉE ET RÉVISION");
      L.push("");
      L.push("[Durée, révision, dénonciation — selon l'étage retenu. Un règlement");
      L.push("intérieur de comité se modifie par délibération du comité ; un accord se");
      L.push("révise selon ses propres stipulations.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE]");
      L.push("");
      L.push("Pour l'employeur : " + signataire(ctx));
      L.push("[Signatures des organisations syndicales représentatives / mention de");
      L.push("l'adoption à la majorité des membres titulaires élus / référence de la");
      L.push("délibération adoptant le règlement intérieur du comité]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — RÉSOLUTION DU COMITÉ DÉSIGNANT LES MEMBRES");
      L.push(GROS);
      L.push("");
      L.push("La désignation appartient au COMITÉ, non à l'employeur. Elle se fait « par");
      L.push("une résolution adoptée selon les modalités définies à l'article");
      L.push("L. 2315-32 » (L. 2315-39), c'est-à-dire « à la majorité des membres");
      L.push("présents », le président ne participant pas au vote « lorsqu'il consulte");
      L.push("les membres élus du comité en tant que délégation du personnel »");
      L.push("(L. 2315-32).");
      L.push("");
      L.push("Et il n'y a rien à faire avant : « la désignation des membres d'une CSSCT,");
      L.push("que sa mise en place soit obligatoire ou conventionnelle, résulte d'un");
      L.push("vote des membres du CSE à la majorité des voix des membres présents lors");
      L.push("du vote, sans qu'il soit besoin d'une résolution préalable fixant les");
      L.push("modalités de l'élection » (Soc., 27 novembre 2019, n° 19-14.224, publié).");
      L.push("");
      L.push("  RÉSOLUTION N° [.] — DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ,");
      L.push("  SÉCURITÉ ET CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("  Réunion du comité social et économique du [DATE].");
      L.push("");
      L.push("  Le comité social et économique, après en avoir délibéré, désigne parmi");
      L.push("  ses membres, pour siéger à la commission santé, sécurité et conditions");
      L.push("  de travail, pour une durée qui prend fin avec celle du mandat des");
      L.push("  membres élus du comité (L. 2315-39) :");
      L.push("");
      L.push("    · [NOM PRÉNOM] — [titulaire / suppléant] — collège : [1er / 2e / 3e]");
      L.push("    · [NOM PRÉNOM] — [titulaire / suppléant] — collège : [1er / 2e / 3e]");
      L.push("    · [NOM PRÉNOM] — [titulaire / suppléant] — collège : [1er / 2e / 3e]");
      L.push("    [ajouter autant de lignes que le texte constitutif en prévoit]");
      L.push("");
      L.push("  Le comité constate que [NOM] représente le second collège [ou, le cas");
      L.push("  échéant, le troisième collège prévu à l'article L. 2314-11], comme");
      L.push("  L. 2315-39 l'exige.");
      L.push("");
      L.push("  Votants : [..] · Pour : [..] · Contre : [..] · Abstentions : [..]");
      L.push("  Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("  Résolution adoptée à la majorité des membres présents.");
      L.push("");
      L.push("[Le décompte des voix n'est pas une formalité : c'est lui qui établira");
      L.push(" que la résolution a été adoptée selon L. 2315-32.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — CONVOCATION À LA PREMIÈRE RÉUNION DE LA COMMISSION");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la commission santé, sécurité",
         "et conditions de travail",
         "Copie : aux membres de la délégation du personnel du comité social et",
         "économique"], false));
      L.push("Objet : convocation à la réunion de la commission santé, sécurité et");
      L.push("conditions de travail du [DATE]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("J'ai l'honneur de vous convoquer à la réunion de la commission santé,");
      L.push("sécurité et conditions de travail, qui se tiendra :");
      L.push("");
      L.push("  le [DATE], à [HEURE],");
      L.push("  à [LIEU PRÉCIS].");
      L.push("");
      L.push("L'ordre du jour figure ci-après. Les documents s'y rapportant vous sont");
      L.push("transmis avec la présente.");
      L.push("");
      L.push("[Le cas échéant : je serai assisté de [NOM, fonction], collaborateur");
      L.push("appartenant à l'entreprise et choisi en dehors du comité. Le nombre de");
      L.push("collaborateurs qui m'assistent ne peut, avec moi, excéder celui des");
      L.push("représentants du personnel titulaires (L. 2315-39).]");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("Note sur les délais : ni le délai de convocation, ni celui de");
      L.push("transmission de l'ordre du jour ne sont fixés par les textes que ce module");
      L.push("a lus. Ils relèvent de l'article 4 du texte constitutif — « leurs");
      L.push("modalités de fonctionnement » au sens de L. 2315-41, 3°. Écrivez-les là,");
      L.push("et tenez-les.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — ORDRE DU JOUR TYPE DE LA COMMISSION");
      L.push(GROS);
      L.push("");
      L.push("COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
      L.push(nomDe(ctx).toUpperCase() + " — réunion du [DATE]");
      L.push("");
      L.push("  1. Installation de la commission — rappel du texte constitutif, du");
      L.push("     périmètre et de la résolution de désignation.");
      L.push("  2. Rappel des LIMITES de la délégation : le recours à un expert et les");
      L.push("     attributions consultatives du comité restent au comité (L. 2315-38).");
      L.push("     La commission instruit et propose ; le comité consulte et décide.");
      L.push("  3. Formation des membres — état des formations suivies et à programmer");
      L.push("     (L. 2315-18 ; L. 2315-41, 4° et 6°).");
      L.push("  4. Document unique d'évaluation des risques professionnels : la");
      L.push("     commission apporte sa contribution à l'évaluation (L. 4121-3, 1°).");
      L.push("     [Version examinée : du [DATE].]");
      L.push("  5. [Programme annuel de prévention ou liste des actions — examen");
      L.push("     préparatoire à l'avis du comité (L. 4121-3-1, III ; L. 2312-27).]");
      L.push("  6. [Points propres à l'entreprise : accidents et incidents survenus,");
      L.push("     visites de postes, signalements, alertes, suites données.]");
      L.push("  7. Calendrier des prochaines réunions et des visites.");
      L.push("  8. Questions diverses.");
      L.push("");
      L.push("[Les points 6 et suivants ne peuvent pas être écrits par l'application :");
      L.push(" elle ne connaît ni vos accidents, ni vos signalements, ni vos visites.");
      L.push(" Portez-les vous-même, datés.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 5 — TRAME DE PROCÈS-VERBAL DE LA COMMISSION");
      L.push(GROS);
      L.push("");
      L.push("COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
      L.push(nomDe(ctx).toUpperCase());
      L.push("PROCÈS-VERBAL DE LA RÉUNION DU [DATE]");
      L.push("");
      L.push("PRÉSIDENCE : " + signataire(ctx) + " [ou son représentant : NOM, qualité,");
      L.push("acte lui donnant cette qualité].");
      L.push("");
      L.push("MEMBRES PRÉSENTS : [NOM — collège] ; [NOM — collège] ; [NOM — collège].");
      L.push("MEMBRES ABSENTS EXCUSÉS : [.....].");
      L.push("COLLABORATEURS ASSISTANT L'EMPLOYEUR : [NOM, fonction]. Leur nombre,");
      L.push("président compris, n'excède pas celui des représentants du personnel");
      L.push("titulaires (L. 2315-39).");
      L.push("INVITÉS : [le cas échéant].");
      L.push("");
      L.push("Ouverture à [HEURE].");
      L.push("");
      L.push("POINT 1 — [intitulé]");
      L.push("  Exposé : [.....]");
      L.push("  Observations des membres : [CONSIGNER, telles qu'elles ont été faites]");
      L.push("  Suites : [.....]");
      L.push("");
      L.push("POINT 2 — [intitulé]");
      L.push("  [même structure]");
      L.push("");
      L.push("PROPOSITIONS DE LA COMMISSION AU COMITÉ");
      L.push("  [La commission propose ; elle ne décide pas à la place du comité. Toute");
      L.push("   proposition d'expertise se transmet au comité, à qui la décision");
      L.push("   appartient : le comité peut décider d'une expertise « le cas échéant");
      L.push("   sur proposition des commissions constituées en son sein » (Soc.,");
      L.push("   18 mars 2026, n° 23-22.270, publié).]");
      L.push("");
      L.push("CLÔTURE à [HEURE]. Prochaine réunion : [DATE].");
      L.push("");
      L.push("Établi par [NOM], le [DATE].");
      L.push("");
      L.push("[Le rédacteur, le délai et le mode d'adoption du procès-verbal relèvent");
      L.push(" des « modalités de fonctionnement » du texte constitutif (L. 2315-41,");
      L.push(" 3°). L'application ne les invente pas.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez le fondement sur lequel");
      L.push("la commission est due et vous choisissez l'étage : accord d'entreprise,");
      L.push("accord avec le comité, ou règlement intérieur du comité.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 15)) + " environ — projet de texte constitutif");
      L.push("rédigé (pièce 1), avec les six points de L. 2315-41.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 45)) + " environ — texte adopté. Une négociation");
      L.push("d'accord prend plus longtemps qu'une délibération de règlement intérieur :");
      L.push("comptez deux à trois mois pour un accord d'entreprise.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 60)) + " environ — résolution de désignation des");
      L.push("membres par le comité (pièce 2), avec le décompte des voix.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 75)) + " environ — convocation et première réunion");
      L.push("(pièces 3 à 5).");
      L.push("");
      L.push("Puis sans attendre — formation des membres (L. 2315-18) : elle se");
      L.push("programme dès la désignation, parce que les places d'organisme ne sont pas");
      L.push("disponibles le jour où l'on y pense.");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai pour créer");
      L.push("la commission. Là où elle est due, elle l'est déjà.");

      return L.concat(pied(
        "L. 2315-36, L. 2315-37, L. 2315-38, L. 2315-39, L. 2315-41, L. 2315-42, " +
        "L. 2315-43, L. 2315-44, L. 2315-32, L. 2314-11, L. 2315-18, L. 4121-3, L. 2317-1",
        ["Décisions citées : Soc., 27 novembre 2019, n° 19-14.224, publié ; Soc.,",
         "13 mai 2026, n° 25-12.560 ; Soc., 18 mars 2026, n° 23-22.270, publié. Elles",
         "ont été lues à la source dans la base Judilibre de la Cour de cassation le",
         "21 août 2026, réponse non relaxée, et ne sont citées que pour ce qu'elles",
         "disent.",
         "",
         "LA COMMISSION ABSENTE LÀ OÙ ELLE EST DUE N'EST PAS UN MANQUEMENT SEULEMENT",
         "CIVIL. « Le fait d'apporter une entrave à leur fonctionnement régulier est",
         "puni d'une amende de 7 500 € » (L. 2317-1). Il appartient au juge de retenir",
         "ou d'écarter cette qualification ; l'application ne l'anticipe pas. Elle ne",
         "l'invoque pas non plus pour les autres contrôles de la commission — la",
         "composition, les modalités, la délégation, la formation, le remplacement",
         "des membres —, qui sont des irrégularités que le juge annule, non des faits",
         "que ce texte pénal désigne."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-02 — LA COMPOSITION DE LA COMMISSION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-02", {
    nom: "La résolution rectificative de désignation — composition conforme à L. 2315-39",
    detail: "Les quatre exigences confrontées au dossier, la résolution à " +
            "reprendre, la note sur les collèges et le rappel de discrétion.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var n = (c.nbMembres === "" || c.nbMembres == null) ? null : Number(c.nbMembres);
      var L = entete(ctx, "Composition de la commission santé, sécurité et conditions de travail",
        "article L. 2315-39 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« La commission est présidée par l'employeur ou son représentant. Elle");
      L.push("comprend au minimum trois membres représentants du personnel, dont au");
      L.push("moins un représentant du second collège, ou le cas échéant du troisième");
      L.push("collège prévus à l'article L. 2314-11. Les membres de la commission santé,");
      L.push("sécurité et conditions de travail sont désignés par le comité social et");
      L.push("économique parmi ses membres, par une résolution adoptée selon les");
      L.push("modalités définies à l'article L. 2315-32, pour une durée qui prend fin");
      L.push("avec celle du mandat des membres élus du comité. Lorsque l'accord confie");
      L.push("tout ou partie des attributions du comité social et économique à la");
      L.push("commission santé, sécurité et conditions de travail, les dispositions de");
      L.push("l'article L. 2314-3 s'appliquent aux réunions de la commission.");
      L.push("L'employeur peut se faire assister par des collaborateurs appartenant à");
      L.push("l'entreprise et choisis en dehors du comité. Ensemble, ils ne peuvent pas");
      L.push("être en nombre supérieur à celui des représentants du personnel");
      L.push("titulaires. Les dispositions de l'article L. 2315-3 relatives au secret");
      L.push("professionnel et à l'obligation de discrétion leur sont applicables »");
      L.push("(L. 2315-39).");
      L.push("");
      L.push("CES DISPOSITIONS SONT D'ORDRE PUBLIC. Un accord ne peut ni les écarter ni");
      L.push("les réécrire : « les dispositions de L. 2315-39 sont d'ordre public ; une");
      L.push("stipulation d'accord attribuant un siège à chaque organisation syndicale");
      L.push("représentée au CSE, par ordre de représentativité, ne peut pas s'entendre");
      L.push("comme imposant une désignation proportionnelle au résultat électoral de");
      L.push("chaque syndicat, une telle lecture étant contraire à L. 2315-32 et");
      L.push("L. 2315-39 » (Soc., 11 février 2026, n° 24-16.408).");
      L.push("");
      L.push("LES QUATRE EXIGENCES, CONFRONTÉES À VOTRE DOSSIER");
      L.push("");
      L.push("  1. PRÉSIDENCE par l'employeur ou son représentant : " +
        etat(c.presideeEmployeur, "oui", "NON — à rétablir"));
      L.push("  2. TROIS MEMBRES au minimum : " +
        (n != null && isFinite(n)
          ? n + " membre(s) déclaré(s)" + (n < 3 ? " — INSUFFISANT" : " — le minimum est atteint")
          : "[nombre non renseigné]"));
      L.push("  3. UN MEMBRE DU SECOND COLLÈGE au moins (ou du troisième) : " +
        etat(c.membreSecondCollege, "oui", "NON — à rétablir"));
      L.push("  4. DÉSIGNATION PAR LE COMITÉ, parmi ses membres, par résolution");
      L.push("     adoptée selon L. 2315-32 : " +
        etat(c.designesParCSE, "oui", "NON — à refaire"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — NOTE SUR LES COLLÈGES (à lire avant de désigner)");
      L.push(GROS);
      L.push("");
      L.push("C'est l'exigence la plus souvent manquée, parce qu'elle suppose de");
      L.push("connaître le découpage des collèges de l'entreprise.");
      L.push("");
      L.push("L. 2314-11 : « Les membres de la délégation du personnel du comité social");
      L.push("et économique sont élus sur des listes établies par les organisations");
      L.push("syndicales pour chaque catégorie de personnel : — d'une part, par le");
      L.push("collège des ouvriers et employés ; — d'autre part, par le collège des");
      L.push("ingénieurs, chefs de service, techniciens, agents de maîtrise et");
      L.push("assimilés. Dans les entreprises d'au moins cinq cent un salariés, les");
      L.push("ingénieurs, les chefs de service et cadres administratifs, commerciaux ou");
      L.push("techniques assimilés ont au moins un délégué titulaire au sein du second");
      L.push("collège, élu dans les mêmes conditions. En outre, dans les entreprises,");
      L.push("quel que soit leur effectif, dont le nombre des ingénieurs, chefs de");
      L.push("service et cadres administratifs, commerciaux ou techniques assimilés sur");
      L.push("le plan de la classification est au moins égal à vingt-cinq au moment de");
      L.push("la constitution ou du renouvellement de l'instance, ces catégories");
      L.push("constituent un troisième collège. Par dérogation aux alinéas précédents,");
      L.push("dans les établissements ou les entreprises n'élisant qu'un membre de la");
      L.push("délégation du personnel titulaire et un membre de la délégation du");
      L.push("personnel suppléant, il est mis en place pour chacune de ces élections, un");
      L.push("collège électoral unique regroupant l'ensemble des catégories");
      L.push("professionnelles. »");
      L.push("");
      L.push("LÀ OÙ UN TROISIÈME COLLÈGE EXISTE, UN SIÈGE LUI REVIENT : « Il résulte de");
      L.push("l'article L. 2315-39 du code du travail dont les dispositions sont d'ordre");
      L.push("public que, dans les entreprises ou établissements où est institué, en");
      L.push("application de l'article L. 2314-11 du code du travail, un troisième");
      L.push("collège électoral, un siège au moins à la commission santé, sécurité et");
      L.push("conditions de travail doit être attribué à un élu au comité social et");
      L.push("économique représentant le troisième collège » (Soc., 26 février 2025,");
      L.push("n° 24-12.295, publié).");
      L.push("");
      L.push("  [RELEVER SUR LES RÉSULTATS DES DERNIÈRES ÉLECTIONS :");
      L.push("   · nombre de collèges institués : [2 / 3 / collège unique]");
      L.push("   · élus du deuxième collège : [NOMS]");
      L.push("   · élus du troisième collège, s'il existe : [NOMS]");
      L.push("   Sans cette lecture, la désignation se fait à l'aveugle.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — RÉSOLUTION RECTIFICATIVE DU COMITÉ");
      L.push(GROS);
      L.push("");
      L.push("Une désignation irrégulière ne se corrige pas par une note de l'employeur :");
      L.push("elle se REFAIT par une résolution du comité. La désignation appartient au");
      L.push("comité, et « résulte d'un vote des membres du CSE à la majorité des voix");
      L.push("des membres présents lors du vote, sans qu'il soit besoin d'une résolution");
      L.push("préalable fixant les modalités de l'élection » (Soc., 27 novembre 2019,");
      L.push("n° 19-14.224, publié).");
      L.push("");
      L.push("  RÉSOLUTION N° [.] — DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ,");
      L.push("  SÉCURITÉ ET CONDITIONS DE TRAVAIL (rectificative)");
      L.push("");
      L.push("  Réunion du comité social et économique du [DATE].");
      L.push("");
      L.push("  Vu l'article L. 2315-39 du code du travail, dont les dispositions sont");
      L.push("  d'ordre public ;");
      L.push("  Vu l'article L. 2315-32 du même code ;");
      L.push("  Vu [le texte constitutif de la commission : accord ou règlement");
      L.push("  intérieur du comité] ;");
      L.push("");
      L.push("  Constatant que la composition issue de la désignation du [DATE] ne");
      L.push("  satisfait pas [PRÉCISER LAQUELLE DES QUATRE EXIGENCES : nombre inférieur");
      L.push("  à trois / absence de représentant du second ou du troisième collège /");
      L.push("  désignation faite autrement que par résolution du comité / présidence] ;");
      L.push("");
      L.push("  Le comité social et économique, après en avoir délibéré, désigne parmi");
      L.push("  ses membres, pour siéger à la commission santé, sécurité et conditions");
      L.push("  de travail, pour une durée qui prend fin avec celle du mandat des");
      L.push("  membres élus du comité :");
      L.push("");
      L.push("    · [NOM PRÉNOM] — collège : [1er / 2e / 3e]");
      L.push("    · [NOM PRÉNOM] — collège : [1er / 2e / 3e]");
      L.push("    · [NOM PRÉNOM] — collège : [1er / 2e / 3e]");
      L.push("    [au minimum trois, dont au moins un du second collège ou, le cas");
      L.push("     échéant, du troisième]");
      L.push("");
      L.push("  Votants : [..] · Pour : [..] · Contre : [..] · Abstentions : [..]");
      L.push("  Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("  Résolution adoptée à la majorité des membres présents.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — NOTE DE L'EMPLOYEUR : PRÉSIDENCE ET COLLABORATEURS");
      L.push(GROS);
      L.push("");
      L.push(nomDe(ctx) + " — note du " + leJour(d0));
      L.push("Objet : présidence de la commission santé, sécurité et conditions de");
      L.push("travail et assistance de l'employeur");
      L.push("");
      L.push("1. La commission est présidée par [l'employeur / son représentant : NOM,");
      L.push("   qualité, désigné par [acte, daté]]. L. 2315-39 ne connaît que ces deux");
      L.push("   possibilités : une commission présidée par un élu, ou par personne, ne");
      L.push("   respecte pas le texte.");
      L.push("");
      L.push("2. Collaborateurs assistant l'employeur : [NOMS et fonctions]. Ils");
      L.push("   appartiennent à l'entreprise et sont choisis EN DEHORS du comité.");
      L.push("");
      L.push("3. Règle de nombre, à vérifier avant chaque réunion : ensemble —");
      L.push("   président compris — l'employeur et ses collaborateurs ne peuvent pas");
      L.push("   être en nombre supérieur à celui des représentants du personnel");
      L.push("   TITULAIRES.");
      L.push("      représentants du personnel titulaires : [..]");
      L.push("      employeur et collaborateurs présents : [..]");
      L.push("   Le second nombre ne doit pas excéder le premier.");
      L.push("");
      L.push("4. Secret professionnel et obligation de discrétion : les dispositions de");
      L.push("   l'article L. 2315-3 leur sont applicables (L. 2315-39, dernier alinéa).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-3",
        "est nommé par L. 2315-39 pour le secret professionnel et l'obligation de " +
        "discrétion ; l'application ne l'a pas capté et n'en écrit donc pas le régime"));
      L.push(signataire(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — RAPPEL ÉCRIT AUX MEMBRES ET AUX COLLABORATEURS");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la commission santé, sécurité et conditions de travail",
         "et aux collaborateurs assistant l'employeur"], false));
      L.push("Objet : secret professionnel et obligation de discrétion");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Le dernier alinéa de l'article L. 2315-39 du code du travail rend");
      L.push("applicables aux membres de la commission santé, sécurité et conditions de");
      L.push("travail, ainsi qu'aux collaborateurs qui assistent l'employeur, les");
      L.push("dispositions de l'article L. 2315-3 relatives au secret professionnel et à");
      L.push("l'obligation de discrétion.");
      L.push("");
      L.push("[Le contenu de l'article L. 2315-3 n'a pas été lu par l'application :");
      L.push("reportez-vous en au texte avant de préciser ici l'étendue de ces");
      L.push("obligations. Le module « comité social et économique » traite du");
      L.push("fonctionnement du comité.]");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous relevez sur les résultats des");
      L.push("dernières élections le nombre de collèges et les élus de chacun (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ — l'employeur écrit sa note de");
      L.push("présidence et arrête la liste de ses collaborateurs (pièce 3). C'est le");
      L.push("seul point qui ne dépende que de lui.");
      L.push("");
      L.push("À la prochaine réunion du comité — résolution rectificative (pièce 2),");
      L.push("avec le décompte des voix. La désignation appartient au comité : elle ne");
      L.push("peut pas se faire plus tôt.");
      L.push("");
      L.push("Dans la foulée — rappel écrit du secret professionnel et de l'obligation");
      L.push("de discrétion (pièce 4).");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai. La");
      L.push("désignation irrégulière, elle, reste attaquable tant qu'elle n'est pas");
      L.push("refaite.");

      return L.concat(pied("L. 2315-39, L. 2315-32, L. 2314-11, L. 2315-38",
        ["Décisions citées, lues à la source dans la base Judilibre de la Cour de",
         "cassation le 21 août 2026, réponse non relaxée : Soc., 27 novembre 2019,",
         "n° 19-14.224, publié ; Soc., 26 février 2025, n° 24-12.295, publié ; Soc.,",
         "11 février 2026, n° 24-16.408.",
         "",
         "Aucune peine n'est annoncée : L. 2317-1 punit l'entrave à la constitution du",
         "comité, à la libre désignation de ses membres et à son fonctionnement",
         "régulier — non l'irrégularité de la composition d'une commission, dont la",
         "désignation appartient d'ailleurs au comité et non à l'employeur. Ce qui se",
         "joue est l'annulation de la désignation."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-03 — LES MODALITÉS DE LA COMMISSION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-03", {
    nom: "Le texte qui fixe les six points de L. 2315-41",
    detail: "Les trois étages, le texte rédigé point par point, la délibération " +
            "d'adoption du règlement intérieur du comité et la notification.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var fond = fondementCommission(ctx);
      var L = entete(ctx, "Modalités de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-41 à L. 2315-44 du code du travail");

      L.push("CE QUI MANQUE, ET POURQUOI C'EST BLOQUANT");
      L.push("");
      L.push("Tant que rien ne fixe les modalités, la commission ne peut démontrer ni ce");
      L.push("qu'elle est en droit de faire, ni de combien d'heures ses membres");
      L.push("disposent, ni quelle formation leur est due. Elle existe sans pouvoir");
      L.push("établir son périmètre — et un membre qui pose une heure de délégation ne");
      L.push("peut pas dire d'où elle vient.");
      L.push("");
      L.push("Ce que le dossier déclare : commission " + etat(c.existe, "existante", "INEXISTANTE") +
        " ; modalités fixées par " +
        (c.modalitesFixees ? "« " + c.modalitesFixees + " »" : "[SOURCE NON RENSEIGNÉE]") + ".");
      L.push("Fondement de la commission : " + fond.phrase +
        (fond.texte ? " (" + fond.texte + ")" : "") + ".");
      L.push("");
      L = L.concat(blocEtages(ctx));
      L.push("UN QUATRIÈME CAS, HORS OBLIGATION");
      L.push("");
      L.push("« En dehors des cas prévus aux articles L. 2315-36 et L. 2315-37, l'accord");
      L.push("d'entreprise défini à l'article L. 2313-2 ou en l'absence de délégué");
      L.push("syndical, un accord entre l'employeur et le comité social et économique,");
      L.push("adopté à la majorité des membres titulaires élus de la délégation du");
      L.push("personnel du comité peut fixer le nombre et le périmètre de mise en place");
      L.push("de la ou des commissions santé, sécurité et conditions de travail et");
      L.push("définir les modalités mentionnées aux 1° à 6° de l'article L. 2315-41 »");
      L.push("(L. 2315-43).");
      L.push("");
      L.push("Et à défaut : « En l'absence d'accord prévu à l'article L. 2315-43,");
      L.push("l'employeur peut fixer le nombre et le périmètre de mise en place d'une ou");
      L.push("plusieurs commissions santé, sécurité et conditions de travail. Le");
      L.push("règlement intérieur du comité social et économique définit les modalités");
      L.push("mentionnées aux 1° à 6° de l'article L. 2315-41 » (L. 2315-44, deuxième et");
      L.push("troisième alinéas).");
      L.push("");
      L.push("Noter la répartition : l'employeur peut fixer le NOMBRE et le PÉRIMÈTRE ;");
      L.push("les MODALITÉS, elles, reviennent au règlement intérieur du comité.");
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — LES SIX POINTS, RÉDIGÉS");
      L.push(GROS);
      L.push("");
      L.push("L'article L. 2315-41 énumère exactement six points. Le texte que vous");
      L.push("adopterez doit les couvrir tous : un texte qui en oublie un laisse une");
      L.push("question ouverte, et c'est celle-là qui se posera.");
      L.push("");
      L.push("  [Intitulé, selon l'étage retenu — voir ci-dessus.]");
      L.push("");
      L.push("1° LE NOMBRE DE MEMBRES");
      L.push("");
      L.push("   La ou les commissions comprennent [NOMBRE] membres représentants du");
      L.push("   personnel. Ce nombre ne peut être inférieur à trois (L. 2315-39).");
      L.push("");
      L.push("   [Le cas échéant, périmètre : [NOMBRE] commissions, sur les périmètres");
      L.push("    suivants : .....]");
      L.push("");
      L.push("2° LES MISSIONS DÉLÉGUÉES PAR LE COMITÉ ET LEURS MODALITÉS D'EXERCICE");
      L.push("");
      L.push("   Le comité délègue à la commission : [ÉNUMÉRER, une par une, les");
      L.push("   attributions relatives à la santé, à la sécurité et aux conditions de");
      L.push("   travail qui lui sont confiées — inspections, enquêtes, analyse des");
      L.push("   risques, préparation des délibérations du comité, suivi du document");
      L.push("   unique, suivi du programme annuel de prévention.]");
      L.push("");
      L.push("   Modalités d'exercice : [comment la commission saisit le comité, sous");
      L.push("   quelle forme elle rend ses travaux, dans quels délais].");
      L.push("");
      L.push("   LIMITE D'ORDRE PUBLIC : la délégation ne peut porter ni sur le recours");
      L.push("   à un expert prévu à la sous-section 10, ni sur les attributions");
      L.push("   consultatives du comité (L. 2315-38). Une stipulation contraire est");
      L.push("   sans effet : ce texte est d'ordre public (Soc., 13 mai 2026,");
      L.push("   n° 25-12.560).");
      L.push("");
      L.push("3° LES MODALITÉS DE FONCTIONNEMENT, NOTAMMENT LE NOMBRE D'HEURES DE");
      L.push("   DÉLÉGATION");
      L.push("");
      L.push("   Réunions : [nombre par an, qui convoque, délai de convocation, délai de");
      L.push("   transmission de l'ordre du jour, qui l'établit].");
      L.push("   Procès-verbal : [rédacteur, délai, adoption, diffusion].");
      L.push("   Visites et inspections : [modalités, préavis, comptes rendus].");
      L.push("   Heures de délégation : [NOMBRE] heures par mois et par membre pour");
      L.push("   l'exercice de leurs missions au sein de la commission.");
      L.push("");
      L.push("   Ces modalités ne sont écrites nulle part ailleurs : ni le code, dans ce");
      L.push("   que ce module a lu, ni un usage ne les fournissent. Ce que vous");
      L.push("   n'écrivez pas ici n'existera pas.");
      L.push("");
      L.push("4° LES MODALITÉS DE FORMATION, CONFORMÉMENT AUX ARTICLES L. 2315-16 À");
      L.push("   L. 2315-18");
      L.push("");
      L.push("   [Organisme, calendrier, durée par membre, prise en charge.]");
      L.push("");
      L.push("   L. 2315-18, seul des trois articles que l'application ait lu, fixe des");
      L.push("   durées minimales : cinq jours lors du premier mandat des membres de la");
      L.push("   délégation du personnel ; en cas de renouvellement, trois jours pour");
      L.push("   chaque membre quelle que soit la taille de l'entreprise, et cinq jours");
      L.push("   pour les membres de la commission dans les entreprises d'au moins trois");
      L.push("   cents salariés. Le financement est pris en charge par l'employeur.");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-16 et L. 2315-17",
        "sont nommés par L. 2315-41, 4° ; l'application ne les a pas captés et n'en " +
        "écrit donc rien"));
      L.push("5° LE CAS ÉCHÉANT, LES MOYENS ALLOUÉS");
      L.push("");
      L.push("   [Local, matériel, accès aux documents et aux locaux, temps de");
      L.push("   déplacement, budget propre. « Le cas échéant » : c'est une faculté. Ce");
      L.push("   qui n'est pas écrit ne sera pas dû — et ce qui est écrit le sera.]");
      L.push("");
      L.push("6° LE CAS ÉCHÉANT, LES CONDITIONS ET MODALITÉS D'UNE FORMATION SPÉCIFIQUE");
      L.push("");
      L.push("   Formation spécifique « correspondant aux risques ou facteurs de risques");
      L.push("   particuliers, en rapport avec l'activité de l'entreprise » :");
      L.push("   [PRÉCISER LESQUELS, à partir de votre document unique — c'est là qu'ils");
      L.push("    sont identifiés — puis le contenu, la durée et l'organisme.");
      L.push("    L'application ne connaît pas les risques particuliers de votre");
      L.push("    activité et ne les nommera pas à votre place.]");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE]");
      L.push("");
      L.push("Pour l'employeur : " + signataire(ctx));
      L.push("[Signatures ou mention du mode d'adoption, selon l'étage retenu]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — DÉLIBÉRATION DU COMITÉ ADOPTANT SON RÈGLEMENT INTÉRIEUR");
      L.push("(troisième étage — L. 2315-44)");
      L.push(GROS);
      L.push("");
      L.push("À n'utiliser qu'« en l'absence d'accord prévu aux articles L. 2315-41 et");
      L.push("L. 2315-42 » : c'est la condition que L. 2315-44 pose, et l'ordre des");
      L.push("étages ne se prend pas à l'envers.");
      L.push("");
      L.push("  DÉLIBÉRATION N° [.] — RÈGLEMENT INTÉRIEUR DU COMITÉ : CHAPITRE RELATIF");
      L.push("  À LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
      L.push("");
      L.push("  Réunion du comité social et économique du [DATE].");
      L.push("");
      L.push("  Vu l'article L. 2315-44 du code du travail, aux termes duquel, en");
      L.push("  l'absence d'accord prévu aux articles L. 2315-41 et L. 2315-42, le");
      L.push("  règlement intérieur du comité social et économique définit les modalités");
      L.push("  mentionnées aux 1° à 6° de l'article L. 2315-41 ;");
      L.push("");
      L.push("  Constatant qu'aucun accord d'entreprise (L. 2315-41) ni accord entre");
      L.push("  l'employeur et le comité (L. 2315-42) ne fixe ces modalités ;");
      L.push("");
      L.push("  Le comité adopte le chapitre [.] de son règlement intérieur, dont le");
      L.push("  texte figure en annexe, définissant les six points de L. 2315-41.");
      L.push("");
      L.push("  Votants : [..] · Pour : [..] · Contre : [..] · Abstentions : [..]");
      L.push("");
      L.push("[Les règles d'adoption et de modification du règlement intérieur du comité");
      L.push(" relèvent du module « comité social et économique » de l'application : ce");
      L.push(" module-ci ne les a pas lues et ne les écrit pas.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — NOTIFICATION DU TEXTE AUX MEMBRES");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la commission santé, sécurité et conditions de travail",
         "Copie : aux membres de la délégation du personnel du comité social et",
         "économique"], false));
      L.push("Objet : modalités de la commission santé, sécurité et conditions de");
      L.push("travail — texte applicable");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Je vous transmets ci-joint [l'accord d'entreprise / l'accord conclu avec");
      L.push("le comité social et économique / le chapitre du règlement intérieur du");
      L.push("comité] fixant les modalités de mise en place et de fonctionnement de la");
      L.push("commission santé, sécurité et conditions de travail, adopté le [DATE].");
      L.push("");
      L.push("Ce texte définit les six points énumérés à l'article L. 2315-41 du code du");
      L.push("travail : le nombre de membres, les missions déléguées et leurs modalités");
      L.push("d'exercice, les modalités de fonctionnement et le nombre d'heures de");
      L.push("délégation, les modalités de formation, les moyens alloués et, le cas");
      L.push("échéant, la formation spécifique correspondant aux risques particuliers de");
      L.push("l'activité.");
      L.push("");
      L.push("C'est ce texte qui établira l'étendue de la délégation reçue du comité.");
      L.push("Conservez-le : c'est la pièce que l'on produit lorsque le périmètre d'une");
      L.push("intervention de la commission est discuté.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("Pièce jointe : le texte adopté");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous établissez lequel des trois étages");
      L.push("s'applique. Cette question se tranche d'abord : y a-t-il un délégué");
      L.push("syndical, et un accord a-t-il été engagé ?");
      L.push("");
      L.push("Au " + leJour(dans(d0, 10)) + " environ — projet rédigé, les six points");
      L.push("couverts (pièce 1).");
      L.push("");
      L.push("Si l'étage retenu est le RÈGLEMENT INTÉRIEUR DU COMITÉ : à la prochaine");
      L.push("réunion du comité — délibération d'adoption (pièce 2). Le chemin est");
      L.push("court.");
      L.push("");
      L.push("Si l'étage retenu est un ACCORD : au " + leJour(dans(d0, 75)) + " environ");
      L.push("— deux à trois mois de négociation, selon le nombre d'organisations et le");
      L.push("calendrier des réunions.");
      L.push("");
      L.push("Dans les jours qui suivent l'adoption — notification aux membres");
      L.push("(pièce 3) et versement du texte au dossier de la commission.");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai pour fixer");
      L.push("les modalités. Elles sont dues dès que la commission existe.");

      return L.concat(pied(
        "L. 2315-41, L. 2315-42, L. 2315-43, L. 2315-44, L. 2315-38, L. 2315-39, L. 2315-18",
        ["Décision citée, lue à la source dans la base Judilibre de la Cour de",
         "cassation le 21 août 2026, réponse non relaxée : Soc., 13 mai 2026,",
         "n° 25-12.560.",
         "",
         "Aucune peine n'est annoncée : aucun texte répressif capté ne vise l'absence",
         "de texte fixant les modalités de la commission. Ce qui se joue est",
         "l'impossibilité, pour la commission, d'établir ce qu'elle est en droit de",
         "faire."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-04 — LES LIMITES DE LA DÉLÉGATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-04", {
    nom: "L'avenant ramenant la délégation dans les limites de L. 2315-38",
    detail: "La clause à reprendre, l'avenant, le circuit rétabli entre la " +
            "commission et le comité, et la reprise des avis déjà rendus.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var L = entete(ctx, "Délégation confiée à la commission — retour dans les limites de L. 2315-38",
        "article L. 2315-38 du code du travail");

      L.push("LE TEXTE, EN ENTIER — ET SA PORTÉE");
      L.push("");
      L.push("« La commission santé, sécurité et conditions de travail se voit confier,");
      L.push("par délégation du comité social et économique, tout ou partie des");
      L.push("attributions du comité relatives à la santé, à la sécurité et aux");
      L.push("conditions de travail, à l'exception du recours à un expert prévu à la");
      L.push("sous-section 10 et des attributions consultatives du comité »");
      L.push("(L. 2315-38).");
      L.push("");
      L.push("« Aux termes de l'article L. 2315-38 du même code, dont les dispositions");
      L.push("sont d'ordre public, la commission santé, sécurité et conditions de");
      L.push("travail se voit confier, par délégation du comité social et économique,");
      L.push("tout ou partie des attributions du comité relatives à la santé, à la");
      L.push("sécurité et aux conditions de travail, à l'exception du recours à un");
      L.push("expert prévu à la sous-section 10 et des attributions consultatives du");
      L.push("comité » (Soc., 13 mai 2026, n° 25-12.560).");
      L.push("");
      L.push("D'ORDRE PUBLIC : l'accord qui organise la commission ne peut pas en");
      L.push("disposer autrement. Une clause qui déléguerait l'expertise ou la");
      L.push("consultation est sans effet, et l'avis rendu sur son fondement est");
      L.push("irrégulier — ce n'est pas l'accord qui sauve l'avis, c'est l'avis qui");
      L.push("tombe avec la clause.");
      L.push("");
      L.push("DEUX CHOSES, ET DEUX SEULEMENT, NE SE DÉLÈGUENT PAS");
      L.push("");
      L.push("  1. LE RECOURS À UN EXPERT prévu à la sous-section 10. La commission peut");
      L.push("     PROPOSER ; elle ne peut pas DÉCIDER. Le comité « peut décider d'une");
      L.push("     expertise le cas échéant sur proposition des commissions constituées");
      L.push("     en son sein » (Soc., 18 mars 2026, n° 23-22.270, publié, tirant cette");
      L.push("     solution de L. 1233-34). La commission n'est donc pas hors du chemin");
      L.push("     de l'expertise : elle en est le point de départ, pas le point");
      L.push("     d'arrivée.");
      L.push("  2. LES ATTRIBUTIONS CONSULTATIVES DU COMITÉ. L'avis se rend par le");
      L.push("     comité, en réunion du comité, au procès-verbal du comité. Un avis");
      L.push("     rendu par la seule commission n'est pas l'avis du comité, quelle que");
      L.push("     soit la qualité du travail accompli.");
      L.push("");
      L = L.concat(blocRenvoi("L. 1233-34 et la sous-section 10 relative au recours à l'expert",
        "sont nommés — le premier par la décision citée, la seconde par L. 2315-38 ; " +
        "l'application ne les a pas captés et n'en écrit donc pas le régime"));
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  · commission : " + etat(c.existe, "existante", "INEXISTANTE"));
      L.push("  · délégation excluant l'expert et les attributions consultatives : " +
        etat(c.delegationConforme, "oui", "NON — c'est l'objet de ce document"));
      L.push("  · texte qui fixe les modalités : " +
        (c.modalitesFixees ? "« " + c.modalitesFixees + " »" : "[non renseigné]"));
      L.push("");
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — RELECTURE DE LA CLAUSE DE DÉLÉGATION");
      L.push(GROS);
      L.push("");
      L.push("Ligne à ligne, sans indulgence. Trois formulations trahissent presque");
      L.push("toujours un dépassement :");
      L.push("");
      L.push("  · « la commission rend l'avis du comité sur… » → attribution");
      L.push("    consultative déléguée : à retirer ;");
      L.push("  · « la commission décide du recours à un expert » ou « mandate un");
      L.push("    expert » → recours à l'expert délégué : à retirer ;");
      L.push("  · « la commission exerce l'ensemble des attributions du comité en");
      L.push("    matière de santé et de sécurité » sans réserve → formule trop large :");
      L.push("    la réserve de L. 2315-38 doit être écrite, pas sous-entendue.");
      L.push("");
      L.push("  Clause examinée (à recopier mot à mot) | Dépasse-t-elle L. 2315-38 ? | Réécriture");
      L.push("  ---------------------------------------|-----------------------------|------------");
      L.push("  [.....................................] | [oui / non]                | [.........]");
      L.push("  [.....................................] | [oui / non]                | [.........]");
      L.push("  [.....................................] | [oui / non]                | [.........]");
      L.push("");
      L.push("[RECOPIER LA CLAUSE TELLE QU'ELLE EST ÉCRITE. L'application ne connaît pas");
      L.push(" votre accord et ne le paraphrasera pas.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — AVENANT, OU MODIFICATION DU RÈGLEMENT INTÉRIEUR DU COMITÉ");
      L.push(GROS);
      L.push("");
      L.push("La modification suit la voie qui a fixé les modalités : avenant à");
      L.push("l'accord d'entreprise (L. 2315-41), avenant à l'accord conclu avec le");
      L.push("comité (L. 2315-42), ou délibération modifiant le règlement intérieur du");
      L.push("comité (L. 2315-44).");
      L.push("");
      L.push("  [INTITULÉ — Avenant n° [.] à [référence du texte], ou délibération");
      L.push("   modifiant le chapitre [.] du règlement intérieur du comité]");
      L.push("");
      L.push(nomDe(ctx).toUpperCase());
      L.push("");
      L.push("PRÉAMBULE");
      L.push("");
      L.push("Les parties constatent que la clause [référence] confie à la commission");
      L.push("santé, sécurité et conditions de travail [PRÉCISER CE QUI DÉPASSE : le");
      L.push("recours à un expert / des attributions consultatives du comité], alors que");
      L.push("l'article L. 2315-38 du code du travail, dont les dispositions sont");
      L.push("d'ordre public, exclut l'un et l'autre de la délégation.");
      L.push("");
      L.push("ARTICLE 1 — RETRAIT");
      L.push("");
      L.push("La clause [référence] est [supprimée / remplacée par les stipulations de");
      L.push("l'article 2].");
      L.push("");
      L.push("ARTICLE 2 — NOUVELLE RÉDACTION DE LA DÉLÉGATION");
      L.push("");
      L.push("Le comité social et économique délègue à la commission santé, sécurité et");
      L.push("conditions de travail les attributions suivantes, relatives à la santé, à");
      L.push("la sécurité et aux conditions de travail :");
      L.push("");
      L.push("  [ÉNUMÉRER, une par une, les attributions déléguées.]");
      L.push("");
      L.push("Cette délégation ne porte, en aucun cas, sur le recours à un expert prévu");
      L.push("à la sous-section 10, ni sur les attributions consultatives du comité, qui");
      L.push("demeurent exercées par le comité social et économique lui-même");
      L.push("(L. 2315-38).");
      L.push("");
      L.push("ARTICLE 3 — CIRCUIT");
      L.push("");
      L.push("La commission instruit et propose ; le comité consulte et décide.");
      L.push("");
      L.push("  · La commission transmet ses travaux au comité par [forme et délai].");
      L.push("  · Toute proposition de recours à un expert est transmise au comité, à");
      L.push("    qui la décision appartient.");
      L.push("  · Aucun avis n'est rendu par la commission au nom du comité.");
      L.push("");
      L.push("ARTICLE 4 — ENTRÉE EN VIGUEUR");
      L.push("");
      L.push("Le présent [avenant / chapitre modifié] entre en vigueur le [DATE].");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le [DATE]");
      L.push("");
      L.push("Pour l'employeur : " + signataire(ctx));
      L.push("[Signatures ou mention du mode d'adoption]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — REPRISE DES AVIS DÉJÀ RENDUS PAR LA SEULE COMMISSION");
      L.push(GROS);
      L.push("");
      L.push("C'est l'étape que l'on saute, et c'est elle qui coûte : un avis rendu par");
      L.push("la commission au lieu du comité ne devient pas régulier parce que la");
      L.push("clause a été corrigée depuis. Il se refait.");
      L.push("");
      L.push("  Objet de l'avis | Rendu par | Le | À refaire par le comité ? | Réunion prévue");
      L.push("  ----------------|-----------|----|---------------------------|----------------");
      L.push("  [.............] | [.......] | [] | [oui / non]               | [.............]");
      L.push("  [.............] | [.......] | [] | [oui / non]               | [.............]");
      L.push("  [.............] | [.......] | [] | [oui / non]               | [.............]");
      L.push("");
      L.push("  Expertises décidées depuis la mise en place de la commission :");
      L.push("");
      L.push("  Objet | Décidée par | Le | Délibération du comité existe-t-elle ?");
      L.push("  ------|-------------|----|---------------------------------------");
      L.push("  [....] | [.........] | [] | [oui — référence / non]");
      L.push("  [....] | [.........] | [] | [oui — référence / non]");
      L.push("");
      L.push("Pour chaque ligne « non », faire délibérer le comité : la décision");
      L.push("d'expertise lui appartient, la commission ne pouvant que la proposer");
      L.push("(Soc., 18 mars 2026, n° 23-22.270, publié).");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — NOTE DE CIRCUIT AUX DEUX INSTANCES");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la délégation du personnel du comité social et économique",
         "Aux membres de la commission santé, sécurité et conditions de travail"], false));
      L.push("Objet : répartition des rôles entre le comité et la commission");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("À la suite de la modification de la clause de délégation, la répartition");
      L.push("des rôles est la suivante, conformément à l'article L. 2315-38 du code du");
      L.push("travail :");
      L.push("");
      L.push("  · la commission santé, sécurité et conditions de travail exerce les");
      L.push("    attributions du comité relatives à la santé, à la sécurité et aux");
      L.push("    conditions de travail qui lui sont déléguées : [rappeler lesquelles] ;");
      L.push("  · elle ne rend aucun avis au nom du comité : les attributions");
      L.push("    consultatives demeurent exercées par le comité lui-même ;");
      L.push("  · elle ne décide d'aucune expertise : elle peut la proposer au comité,");
      L.push("    à qui la décision appartient.");
      L.push("");
      L.push("Ces dispositions sont d'ordre public : aucune stipulation d'accord ne peut");
      L.push("y déroger.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous relisez la clause de délégation et");
      L.push("vous recopiez ce qui dépasse (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ — projet d'avenant ou de");
      L.push("délibération rédigé (pièce 2).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ — adoption. Une délibération");
      L.push("modifiant le règlement intérieur du comité tient dans une réunion ; un");
      L.push("avenant à un accord d'entreprise demande plus.");
      L.push("");
      L.push("Dans la foulée — note de circuit aux deux instances (pièce 4) et reprise");
      L.push("des avis déjà rendus par la seule commission (pièce 3). Cette dernière");
      L.push("étape se fait aux prochaines réunions du comité.");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai. Ce qui");
      L.push("presse, c'est l'avis en cours — un avis rendu demain par la commission");
      L.push("s'ajouterait à ceux qu'il faut reprendre.");

      return L.concat(pied("L. 2315-38, L. 2315-41, L. 2315-42, L. 2315-44",
        ["Décisions citées, lues à la source dans la base Judilibre de la Cour de",
         "cassation le 21 août 2026, réponse non relaxée : Soc., 13 mai 2026,",
         "n° 25-12.560 ; Soc., 18 mars 2026, n° 23-22.270, publié.",
         "",
         "Aucune peine n'est annoncée : aucun texte répressif capté ne vise le",
         "dépassement de la délégation. Ce qui se joue est l'irrégularité de l'avis",
         "rendu par la seule commission et de l'expertise décidée par elle."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-05 — LA FORMATION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-05", {
    nom: "Le plan de formation santé, sécurité et conditions de travail des élus et du référent",
    detail: "Les bénéficiaires recensés, la durée due élu par élu, la demande à " +
            "l'organisme, les courriers et le registre des attestations.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, cse = f.cse || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var s300 = seuil(ctx, 300);
      var L = entete(ctx, "Formation santé, sécurité et conditions de travail des élus",
        "article L. 2315-18 du code du travail");

      L.push("LE TEXTE, EN ENTIER");
      L.push("");
      L.push("« Les membres de la délégation du personnel du comité social et économique");
      L.push("et le référent prévu au dernier alinéa de l'article L. 2314-1 bénéficient");
      L.push("de la formation nécessaire à l'exercice de leurs missions en matière de");
      L.push("santé, de sécurité et de conditions de travail prévues au chapitre II du");
      L.push("présent titre, dans des conditions déterminées par décret en Conseil");
      L.push("d'État. La formation est d'une durée minimale de cinq jours lors du");
      L.push("premier mandat des membres de la délégation du personnel. En cas de");
      L.push("renouvellement de ce mandat, la formation est d'une durée minimale : 1° De");
      L.push("trois jours pour chaque membre de la délégation du personnel, quelle que");
      L.push("soit la taille de l'entreprise ; 2° De cinq jours pour les membres de la");
      L.push("commission santé, sécurité et conditions de travail dans les entreprises");
      L.push("d'au moins trois cents salariés. Sans préjudice des dispositions de");
      L.push("l'article L. 2315-22-1, le financement de la formation prévue au premier");
      L.push("alinéa du présent article est pris en charge par l'employeur dans des");
      L.push("conditions prévues par décret en Conseil d'État » (L. 2315-18).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-22-1",
        "est nommé par L. 2315-18 pour la prise en charge du financement ; " +
        "l'application ne l'a pas capté et n'en écrit donc rien"));
      L.push("DEUX BÉNÉFICIAIRES, ET LE SECOND S'OUBLIE");
      L.push("");
      L.push("  · les membres de la délégation du personnel du comité ;");
      L.push("  · LE RÉFÉRENT en matière de lutte contre le harcèlement sexuel et les");
      L.push("    agissements sexistes désigné par le comité (L. 2314-1, dernier");
      L.push("    alinéa). L. 2315-18 le vise expressément, sur le même plan.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  · comité social et économique : " +
        etat(cse.existe, "existant", "AUCUN DÉCLARÉ"));
      L.push("  · commission santé-sécurité : " + etat(c.existe, "existante", "inexistante"));
      L.push("  · référent harcèlement du comité désigné : " +
        etat(f.referentCSE, "oui", "NON — il est pourtant bénéficiaire de la formation"));
      L.push("  · formation santé-sécurité assurée : " +
        etat(f.formationSSCT, "oui", "NON — c'est l'objet de ce document"));
      L.push("  " + ligneEffectif(ctx));
      L.push("");
      if (estNon(cse.existe)) {
        L.push("Le dossier n'indique aucun comité social et économique : la formation de");
        L.push("L. 2315-18 bénéficie aux membres de sa délégation du personnel et à son");
        L.push("référent, et n'a donc pas d'objet en l'état. La mise en place du comité");
        L.push("relève du module « comité social et économique ».");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — RECENSEMENT ET DURÉE DUE, ÉLU PAR ÉLU");
      L.push(GROS);
      L.push("");
      L.push("La durée ne se calcule pas pour le comité en bloc : elle se calcule pour");
      L.push("CHAQUE bénéficiaire, selon qu'il est à son premier mandat ou à un");
      L.push("renouvellement, et selon qu'il siège ou non à la commission.");
      L.push("");
      L.push("  · PREMIER MANDAT — cinq jours au minimum, pour tout membre de la");
      L.push("    délégation du personnel, sans condition d'effectif ;");
      L.push("  · RENOUVELLEMENT — trois jours au minimum pour chaque membre de la");
      L.push("    délégation du personnel, quelle que soit la taille de l'entreprise ;");
      L.push("  · RENOUVELLEMENT ET MEMBRE DE LA COMMISSION, dans les entreprises d'au");
      L.push("    moins trois cents salariés — cinq jours au minimum.");
      L.push("");
      if (s300 === true) {
        L.push("Effectif d'au moins trois cents salariés : le 2° joue. Les membres de la");
        L.push("commission dont le mandat est renouvelé ont droit à cinq jours, non à");
        L.push("trois.");
      } else if (s300 === false) {
        L.push("Effectif inférieur à trois cents salariés : le 2° ne joue pas. En cas de");
        L.push("renouvellement, la durée minimale est de trois jours pour chaque membre");
        L.push("de la délégation du personnel, membres de la commission compris.");
      } else {
        L.push("L'effectif n'est pas renseigné : le 2° n'est pas tranché ici. Il ne joue");
        L.push("qu'à partir de trois cents salariés, et alors seulement pour les membres");
        L.push("de la commission en cas de renouvellement. Portez votre effectif.");
      }
      L.push("");
      L.push("  Nom | Qualité (élu / référent) | Membre de la commission ? | Premier mandat ou renouvellement | Durée due | Durée suivie | Reste dû");
      L.push("  ----|--------------------------|---------------------------|----------------------------------|-----------|--------------|----------");
      L.push("  [.] | [......................] | [oui / non]               | [..............................] | [.......] | [..........] | [......]");
      L.push("  [.] | [......................] | [oui / non]               | [..............................] | [.......] | [..........] | [......]");
      L.push("  [.] | [......................] | [oui / non]               | [..............................] | [.......] | [..........] | [......]");
      L.push("  [.] | [......................] | [oui / non]               | [..............................] | [.......] | [..........] | [......]");
      L.push("");
      L.push("[N'OUBLIEZ PAS LE RÉFÉRENT HARCÈLEMENT DU COMITÉ : une ligne pour lui,");
      L.push(" même s'il figure déjà comme élu — L. 2315-18 le vise à ce double titre.]");
      L.push("");
      L.push("Les durées sont des MINIMA : « d'une durée minimale de cinq jours »,");
      L.push("« d'une durée minimale : 1° De trois jours… ». Rien n'interdit de faire");
      L.push("plus ; le texte interdit de faire moins.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — DEMANDE À L'ORGANISME DE FORMATION");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM DE L'ORGANISME DE FORMATION]", "[adresse]"], false));
      L.push("Objet : formation santé, sécurité et conditions de travail des membres du");
      L.push("comité social et économique (L. 2315-18)");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Je souhaite inscrire à la formation nécessaire à l'exercice de leurs");
      L.push("missions en matière de santé, de sécurité et de conditions de travail");
      L.push("(article L. 2315-18 du code du travail) les personnes suivantes :");
      L.push("");
      L.push("  · [NOM] — [premier mandat : cinq jours / renouvellement : trois jours /");
      L.push("    renouvellement, membre de la commission dans une entreprise d'au moins");
      L.push("    trois cents salariés : cinq jours]");
      L.push("  · [NOM] — [durée]");
      L.push("  · [NOM] — [durée], référent en matière de lutte contre le harcèlement");
      L.push("    sexuel et les agissements sexistes désigné par le comité (L. 2314-1),");
      L.push("    que L. 2315-18 vise expressément.");
      L.push("");
      L.push("Sessions souhaitées : [PÉRIODE]. Lieu : [sur site / dans vos locaux].");
      L.push("");
      L.push("[Le cas échéant, formation spécifique correspondant aux risques ou");
      L.push("facteurs de risques particuliers en rapport avec l'activité de");
      L.push("l'entreprise, prévue par [référence du texte constitutif de la commission]");
      L.push("en application de L. 2315-41, 6° : [préciser les risques concernés, tirés");
      L.push("du document unique].]");
      L.push("");
      L.push("Je vous remercie de me faire parvenir votre proposition, votre programme");
      L.push("et, à l'issue de chaque session, une attestation individuelle mentionnant");
      L.push("le nom du participant et le NOMBRE DE JOURS suivis : c'est cette mention");
      L.push("qui établira que la durée minimale a été atteinte.");
      L.push("");
      L = L.concat(formulePolitesse(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — CONVOCATION DES ÉLUS À LA FORMATION");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["[NOM DU MEMBRE]", "[fonction et service]"], false));
      L.push("Objet : formation santé, sécurité et conditions de travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("En application de l'article L. 2315-18 du code du travail, vous");
      L.push("bénéficiez, en votre qualité de [membre de la délégation du personnel du");
      L.push("comité social et économique / référent en matière de lutte contre le");
      L.push("harcèlement sexuel et les agissements sexistes], de la formation");
      L.push("nécessaire à l'exercice de vos missions en matière de santé, de sécurité");
      L.push("et de conditions de travail.");
      L.push("");
      L.push("Cette formation se déroulera du [DATE] au [DATE], soit [NOMBRE] jours,");
      L.push("auprès de [ORGANISME], à [LIEU].");
      L.push("");
      L.push("Son financement est pris en charge par l'employeur, comme le dernier");
      L.push("alinéa de L. 2315-18 le prévoit.");
      L.push("");
      L.push("À l'issue de la formation, l'attestation vous sera remise ; une copie sera");
      L.push("versée au dossier de l'instance. Elle mentionnera le nombre de jours");
      L.push("suivis.");
      L.push("");
      L = L.concat(formulePolitesse(ctx));
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 4 — REGISTRE DES ATTESTATIONS");
      L.push(GROS);
      L.push("");
      L.push("L'attestation est la SEULE pièce qui établira la durée suivie. Une");
      L.push("inscription, un devis ou une convocation ne prouvent pas qu'une formation");
      L.push("a eu lieu.");
      L.push("");
      L.push("  Nom | Session du | au | Jours suivis | Organisme | Attestation reçue le | Solde");
      L.push("  ----|------------|----|--------------|-----------|----------------------|-------");
      L.push("  [.] | [........] | [] | [..........] | [.......] | [..................] | [....]");
      L.push("  [.] | [........] | [] | [..........] | [.......] | [..................] | [....]");
      L.push("  [.] | [........] | [] | [..........] | [.......] | [..................] | [....]");
      L.push("");
      L.push("Colonne « solde » : ce qui reste dû par rapport au minimum applicable. Une");
      L.push("formation de deux jours au premier mandat laisse trois jours dus.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous recensez les bénéficiaires et vous");
      L.push("calculez la durée due pour chacun (pièce 1). C'est un travail de tableau,");
      L.push("il tient dans l'après-midi.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ — demande adressée à l'organisme");
      L.push("(pièce 2).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ — proposition reçue, dates");
      L.push("arrêtées, élus convoqués (pièce 3). Le délai d'inscription auprès des");
      L.push("organismes est le point de passage obligé : anticipez-le.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 90)) + " environ — premières sessions suivies et");
      L.push("attestations classées (pièce 4).");
      L.push("");
      L.push("Ensuite, à chaque désignation nouvelle — un élu désigné en cours de");
      L.push("mandat, ou un référent nouvellement désigné, ouvre droit à la formation");
      L.push("comme les autres.");
      L.push("");
      L.push("Ces durées sont indicatives : L. 2315-18 fixe des durées de formation, non");
      L.push("un délai pour la dispenser.");

      return L.concat(pied("L. 2315-18, L. 2314-1, L. 2315-41, 4° et 6°",
        ["Aucune peine n'est annoncée : aucun texte répressif capté ne vise le défaut",
         "de formation des élus. Ce qui se joue est un élu qui exerce des missions",
         "pour lesquelles la loi le veut préparé — et une entreprise qui se prive de",
         "l'apport que le texte organise."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-06 — LES REMPLACEMENTS EN COURS DE MANDAT
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-06", {
    nom: "La délibération rapportant un remplacement irrégulier de membre de la commission",
    detail: "Les quatre causes admises, le tri des remplacements, la " +
            "délibération qui rétablit le membre désigné et la consigne pour l'avenir.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var cause = (c.causeRemplacement || "").trim();
      var CAUSES = ["décès", "démission", "rupture du contrat de travail",
                    "perte des conditions requises pour être éligible"];
      var admise = CAUSES.indexOf(cause) !== -1;
      var L = entete(ctx, "Remplacement des membres de la commission — retour à la règle",
        "articles L. 2315-39 et L. 2314-33 du code du travail");

      L.push("LA RÈGLE, ET SON UNIQUE EXCEPTION");
      L.push("");
      L.push("Les membres de la commission sont désignés par le comité « pour une durée");
      L.push("qui prend fin avec celle du mandat des membres élus du comité »");
      L.push("(L. 2315-39). Leur mandat court donc jusqu'au terme de celui des élus : il");
      L.push("ne se reprend pas en chemin.");
      L.push("");
      L.push("« Sauf dans les cas de fin anticipée de mandat énumérés à l'article");
      L.push("L. 2314-33 du code du travail, le comité social et économique ne peut");
      L.push("procéder au remplacement des membres d'une commission santé, sécurité et");
      L.push("conditions de travail initialement désignés avant le terme du mandat des");
      L.push("membres élus du comité » — et sans qu'un accord d'entreprise puisse y");
      L.push("déroger (Soc., 28 mai 2026, n° 24-22.914, publié).");
      L.push("");
      L.push("LES QUATRE CAUSES, ET ELLES SEULES");
      L.push("");
      L.push("L. 2314-33 : « Les membres de la délégation du personnel du comité social");
      L.push("et économique sont élus pour quatre ans. Les fonctions de ces membres");
      L.push("prennent fin par le décès, la démission, la rupture du contrat de travail,");
      L.push("la perte des conditions requises pour être éligible. Ils conservent leur");
      L.push("mandat en cas de changement de catégorie professionnelle. »");
      L.push("");
      L.push("  1. le décès ;");
      L.push("  2. la démission ;");
      L.push("  3. la rupture du contrat de travail ;");
      L.push("  4. la perte des conditions requises pour être éligible.");
      L.push("");
      L.push("La dernière phrase du texte ferme d'ailleurs une porte que l'on croit");
      L.push("souvent ouverte : « Ils conservent leur mandat en cas de changement de");
      L.push("catégorie professionnelle. » Un membre qui passe d'un collège à l'autre ne");
      L.push("perd pas son mandat, et n'a donc pas à être remplacé pour ce motif.");
      L.push("");
      L.push("CE QUI NE PERMET PAS DE REMPLACER : la perte de confiance, un changement");
      L.push("d'équipe ou de service, un arrangement entre organisations syndicales, une");
      L.push("réorganisation de la commission, une absence prolongée, un désaccord.");
      L.push("Aucune de ces causes ne figure à L. 2314-33, et aucun accord ne peut les y");
      L.push("ajouter.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  · commission : " + etat(c.existe, "existante", "INEXISTANTE"));
      L.push("  · remplacement depuis la désignation initiale : " +
        etat(c.remplacementEnCoursDeMandat, "OUI", "non"));
      L.push("  · cause déclarée : " + (cause ? "« " + cause + " »" : "[non renseignée]"));
      if (cause) {
        L.push("  · cette cause figure-t-elle à L. 2314-33 ? " +
          (admise ? "OUI — le remplacement est régulier de ce chef."
                  : "NON — la délibération de remplacement encourt l'annulation."));
      }
      L.push("");
      if (estNon(c.remplacementEnCoursDeMandat)) {
        L.push("Le dossier ne déclare aucun remplacement. Les pièces ci-dessous servent");
        L.push("alors de garde-fou : la pièce 3 est la consigne à appliquer le jour où la");
        L.push("question se posera, et elle se pose toujours dans l'urgence.");
        L.push("");
      }
      L.push(TRAIT);
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 1 — TRI DES REMPLACEMENTS INTERVENUS");
      L.push(GROS);
      L.push("");
      L.push("Une ligne par remplacement, depuis la désignation initiale. La cause qui");
      L.push("compte est celle qui figure AU PROCÈS-VERBAL, non celle que l'on se");
      L.push("rappelle, et elle doit être établie par une pièce.");
      L.push("");
      L.push("  Membre remplacé | Remplacé le | Cause portée au PV | Figure à L. 2314-33 ? | Pièce l'établissant");
      L.push("  ----------------|-------------|--------------------|-----------------------|--------------------");
      L.push("  [.............] | [.........] | [................] | [oui / non]           | [................]");
      L.push("  [.............] | [.........] | [................] | [oui / non]           | [................]");
      L.push("  [.............] | [.........] | [................] | [oui / non]           | [................]");
      L.push("");
      L.push("Pièces qui établissent chacune des quatre causes :");
      L.push("  · décès — acte de décès ;");
      L.push("  · démission — la lettre de démission du mandat, datée ;");
      L.push("  · rupture du contrat de travail — la pièce qui la constate ;");
      L.push("  · perte des conditions requises pour être éligible — l'élément qui la");
      L.push("    fait perdre, écrit.");
      L.push("");
      L.push("Toute ligne « non » appelle la délibération de la pièce 2.");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 2 — DÉLIBÉRATION RAPPORTANT LE REMPLACEMENT IRRÉGULIER");
      L.push(GROS);
      L.push("");
      L.push("C'est le COMITÉ qui a délibéré, c'est lui qui rapporte. L'employeur ne");
      L.push("peut ni annuler la délibération, ni rétablir le membre : il peut inscrire");
      L.push("le point à l'ordre du jour et exposer la règle.");
      L.push("");
      L.push("  DÉLIBÉRATION N° [.] — RETRAIT DE LA DÉLIBÉRATION DE REMPLACEMENT DU");
      L.push("  [DATE] ET RÉTABLISSEMENT DU MEMBRE INITIALEMENT DÉSIGNÉ");
      L.push("");
      L.push("  Réunion du comité social et économique du [DATE].");
      L.push("");
      L.push("  Vu l'article L. 2315-39 du code du travail, aux termes duquel les membres");
      L.push("  de la commission santé, sécurité et conditions de travail sont désignés");
      L.push("  « pour une durée qui prend fin avec celle du mandat des membres élus du");
      L.push("  comité » ;");
      L.push("  Vu l'article L. 2314-33 du même code, qui énumère les causes de fin");
      L.push("  anticipée du mandat : le décès, la démission, la rupture du contrat de");
      L.push("  travail, la perte des conditions requises pour être éligible ;");
      L.push("");
      L.push("  Constatant que la délibération du [DATE] a remplacé [NOM] par [NOM] pour");
      L.push("  une cause — [RAPPELER LA CAUSE PORTÉE AU PROCÈS-VERBAL] — qui ne figure");
      L.push("  pas parmi celles de L. 2314-33 ;");
      L.push("");
      L.push("  Le comité social et économique, après en avoir délibéré :");
      L.push("");
      L.push("  1. RAPPORTE la délibération de remplacement du [DATE] ;");
      L.push("  2. CONSTATE que [NOM], initialement désigné, demeure membre de la");
      L.push("     commission santé, sécurité et conditions de travail jusqu'au terme du");
      L.push("     mandat des membres élus du comité ;");
      L.push("  3. DIT que toute stipulation d'accord autorisant un remplacement pour une");
      L.push("     autre cause est sans effet, aucun accord d'entreprise ne pouvant");
      L.push("     déroger à cette règle.");
      L.push("");
      L.push("  Votants : [..] · Pour : [..] · Contre : [..] · Abstentions : [..]");
      L.push("  Le président n'a pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("[Si le membre initialement désigné a lui-même quitté l'entreprise ou");
      L.push(" démissionné depuis, la cause de L. 2314-33 est alors constituée : le");
      L.push(" remplacement devient régulier, mais il se refait par une délibération");
      L.push(" nouvelle, fondée sur cette cause-là et sur la pièce qui l'établit.]");
      L.push("");
      L.push("");

      L.push(GROS);
      L.push("PIÈCE 3 — CONSIGNE POUR LES REMPLACEMENTS À VENIR");
      L.push(GROS);
      L.push("");
      L = L.concat(teteLettre(ctx,
        ["Aux membres de la délégation du personnel du comité social et économique",
         "Copie : aux membres de la commission santé, sécurité et conditions de travail"],
        false));
      L.push("Objet : remplacement des membres de la commission santé, sécurité et");
      L.push("conditions de travail");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Les membres de la commission santé, sécurité et conditions de travail sont");
      L.push("désignés par le comité pour une durée qui prend fin avec celle du mandat");
      L.push("des membres élus du comité (article L. 2315-39 du code du travail).");
      L.push("");
      L.push("Avant ce terme, le comité ne peut procéder à leur remplacement que dans");
      L.push("les cas de fin anticipée de mandat énumérés à l'article L. 2314-33 : le");
      L.push("décès, la démission, la rupture du contrat de travail, la perte des");
      L.push("conditions requises pour être éligible. Aucune autre cause ne l'autorise,");
      L.push("et aucun accord d'entreprise ne peut y déroger.");
      L.push("");
      L.push("En conséquence, pour tout remplacement à venir, il est demandé que le");
      L.push("procès-verbal porte :");
      L.push("");
      L.push("  · la cause invoquée, nommée telle que L. 2314-33 la nomme ;");
      L.push("  · la référence de la pièce qui l'établit ;");
      L.push("  · le décompte des voix de la résolution (L. 2315-32).");
      L.push("");
      L.push("Une délibération de remplacement fondée sur une autre cause encourt");
      L.push("l'annulation, et avec elle la composition de la commission.");
      L.push("");
      L = L.concat(formulePolitesse(ctx, "Mesdames, Messieurs"));
      L.push("");

      L.push(GROS);
      L.push("VOTRE CALENDRIER");
      L.push(GROS);
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + " — vous reprenez les procès-verbaux depuis");
      L.push("la désignation initiale et vous triez les remplacements (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ — la consigne pour l'avenir est");
      L.push("diffusée (pièce 3). Elle ne dépend d'aucune réunion.");
      L.push("");
      L.push("À la prochaine réunion du comité — inscription du point à l'ordre du jour");
      L.push("et délibération rapportant le remplacement irrégulier (pièce 2). La");
      L.push("décision appartient au comité : elle ne peut pas venir plus tôt.");
      L.push("");
      L.push("Ensuite — composition de la commission mise à jour et notifiée à ses");
      L.push("membres.");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai. Mais chaque");
      L.push("réunion tenue dans une composition irrégulière ajoute une pièce discutable");
      L.push("au dossier.");

      return L.concat(pied("L. 2315-39, L. 2314-33, L. 2315-32",
        ["Décision citée, lue à la source dans la base Judilibre de la Cour de",
         "cassation le 21 août 2026, réponse non relaxée : Soc., 28 mai 2026,",
         "n° 24-22.914, publié.",
         "",
         "Aucune peine n'est annoncée. Le remplacement est le fait du COMITÉ, non de",
         "l'employeur : L. 2317-1, qui punit l'entrave, ne vise pas la délibération",
         "irrégulière d'un comité sur la composition d'une de ses commissions. Ce qui",
         "se joue est l'annulation de cette délibération."])).join("\n");
    },
  });

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
