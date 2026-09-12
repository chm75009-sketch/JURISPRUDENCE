/* Les documents que l'application PRODUIT, santé, sécurité et conditions de
   travail.

   POURQUOI CE FICHIER EXISTE

   Le module d'audit dit ce qui manque ; les fiches de régularisation disent
   quoi faire. Aucun des deux ne fait le travail : un employeur à qui l'on
   explique en cinq étapes comment évaluer ses risques n'a toujours pas de
   document unique. Ce fichier écrit la pièce elle-même, le document unique
   avec ses colonnes et sa maille par unité de travail, le programme annuel de
   prévention, l'acte qui crée la commission santé-sécurité, l'affichage sur
   les harcèlements, la procédure d'enquête et sa trame d'audition, au nom de
   l'entreprise, avec les courriers qui vont avec et le calendrier calculé.

   TROIS RÈGLES ONT COMMANDÉ L'ÉCRITURE, ET AUCUNE N'A PLIÉ

   1. RIEN QUI N'AIT ÉTÉ LU À LA SOURCE. Chaque article cité ici figure dans
      moteur/sst/textes-sst.json avec son identifiant de version, ou dans le
      fondement du contrôle auquel le document répond. Les articles seulement
      RENVOYÉS par un texte lu, L. 4122-1, L. 4644-1, L. 4622-1, L. 4521-1 et
      suivants, L. 2312-9, L. 4161-1, L. 2313-2, L. 2314-3, L. 2315-3,
      L. 2315-16 et L. 2315-17, L. 1121-2, L. 1142-2-1, L. 1153-3, et les
      articles 222-33 et 222-33-2 du code pénal, sont NOMMÉS, jamais
      reproduits ni paraphrasés. Le document le dit à l'endroit exact où le
      lecteur pourrait croire que l'application les connaît. Le relais
      Légifrance du dépôt ne sert que le code du travail : les deux articles du
      code pénal que L. 1152-4 et L. 1153-5 obligent à afficher sortent donc en
      crochets, avec la consigne d'aller les chercher.

   2. AUCUNE PEINE ANNONCÉE QUI NE SOIT PORTÉE PAR UN TEXTE CAPTÉ, ET QUI NE
      VISE L'OBLIGATION EN CAUSE. Le périmètre a été vérifié article par
      article, et il est étroit :
        · R. 4741-1 punit une chose et une seule, le défaut de transcription
          et le défaut de mise à jour « dans les conditions prévues aux
          articles R. 4121-1 et R. 4121-2 ». Il fonde donc DUE-01 à DUE-04, et
          rien d'autre.
        · L. 4741-1 ne rattrape pas les principes généraux de prévention : son
          énumération vise, pour le livre Ier de la quatrième partie, les
          « Titres Ier, III et IV », le titre II, où vivent L. 4121-1 à
          L. 4121-3-1, en est absent. Il n'est donc invoqué pour AUCUN document
          de ce fichier.
        · R. 4741-3 ne l'atteint pas davantage, quoique son objet, « les
          documents et affichages obligatoires », puisse le laisser croire :
          son énumération est close (L. 4711-1 à L. 4711-5, D. 4711-1 à
          D. 4711-3), et R. 4121-4, qui porte l'avis d'accès au document
          unique, n'y est pas. Il n'est invoqué nulle part.
        · L. 2317-1 punit deux faits, et deux seulement : l'entrave à la
          constitution du comité ou à la libre désignation de ses membres, et
          l'entrave à son fonctionnement régulier. Il n'est invoqué que là où
          le module le retient, la consultation du comité sur le document
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
      CROCHETS, avec la consigne de l'écrire daté et circonstancié. Depuis le
      9 septembre 2026, chaque document s'ouvre sur un EXEMPLE entièrement
      rempli pour une entreprise fictive du secteur de la fiche, annoncé comme
      tel par le bandeau EXEMPLE, puis vient le document à compléter, qui ne
      porte que les données de la fiche et des crochets ailleurs. Sur le
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
  /* Une date du dossier, écrite en toutes lettres, ou son crochet. */
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
                   : "Effectif : [EFFECTIF DE L'ENTREPRISE, non renseigné]. Plusieurs " +
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
      "[ARTICLE NON LU PAR L'APPLICATION, " + articles + " " +
        (quoi || "est nommé ici parce qu'un texte lu y renvoie") + ".",
      " L'application ne l'a pas capté et n'en reproduit donc pas le contenu.",
      " Allez le lire avant de vous en servir.]",
      "",
    ];
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
  /* Une valeur d'exemple, ou son crochet quand on écrit le document à
     compléter : la même fonction sert aux deux, pour que les deux aient
     exactement la même structure. */
  function X(ex, valeur, crochet) { return ex ? valeur : "[" + crochet + "]"; }
  function jj(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "[date]";
    var m = d.getMonth() + 1, j = d.getDate();
    return (j < 10 ? "0" + j : j) + "/" + (m < 10 ? "0" + m : m) + "/" + d.getFullYear();
  }
  var GRILLE = ["Unité de travail", "Risque identifié", "Exposition", "Mesures existantes",
                "Mesures à prendre", "Échéance", "Responsable"];

  /* ══════════════════════════════════════════════════════════════════════
     LE SOCLE COMMUN

     Seize familles de dangers qui valent pour n'importe quelle entreprise,
     quel que soit son secteur : c'est le plus large qu'on puisse écrire sans
     connaître les postes. Chacune porte ses situations types, ses dommages,
     les mesures de prévention courantes et une cotation proposée.

     LA GRILLE NE REMPLACE PAS L'ÉVALUATION. Demande du 12 septembre 2026 :
     « un modèle le plus large possible avec le socle commun, et dire qu'il
     faut impérativement l'adapter ». Le client retranche ce qui ne le
     concerne pas, remplace les crochets par ses chiffres, ajoute ce qui
     manque. Recopiée telle quelle, elle n'évalue rien.

     Les familles et leurs dommages viennent de la fiche ressources du guide
     Carsat Prév. 317 de juillet 2024, page 10, lue en entier le 12 septembre
     2026. Les mesures sont des mesures de prévention courantes, non des
     obligations : celles qui en sont portent leur article.
     ══════════════════════════════════════════════════════════════════════ */
  var SOCLE = [
    { n: "Incendie, explosion",
      sit: ["Stockage de produits inflammables : [nature, quantité, lieu]",
            "Installations électriques, chargeurs de batteries, locaux de charge",
            "Travaux par points chauds : soudage, meulage, [fréquence]",
            "Locaux recevant du personnel : [nombre] personnes, [nombre] issues de secours"],
      dom: "Intoxication, brûlures, asphyxie, contusions, décès",
      mes: ["Extincteurs vérifiés le [date], nombre et emplacement [préciser]",
            "Consignes de sécurité affichées, plan d'évacuation à jour",
            "Exercice d'évacuation du [date]",
            "Permis de feu pour les travaux par points chauds",
            "Dégagements et issues de secours dégagés en permanence"],
      cote: ["faible", "mortels"] },
    { n: "Électricité",
      sit: ["Installation fixe : dernière vérification le [date]",
            "Appareils portatifs, rallonges, multiprises en cascade",
            "Interventions sur ou à proximité d'installations sous tension",
            "Travail en zone humide ou à l'extérieur"],
      dom: "Électrocution, électrisation, brûlures, décès",
      mes: ["Vérification périodique par organisme agréé, rapport du [date]",
            "Levée des observations du rapport : [faites / en cours]",
            "Habilitations électriques à jour le [date]",
            "Armoires fermées à clé, consignation avant intervention",
            "Matériel portatif contrôlé, rallonges remplacées si endommagées"],
      cote: ["faible", "mortels"] },
    { n: "Manutention manuelle",
      sit: ["Port de charges : [poids] kg, [nombre] fois par jour, [nombre] salariés",
            "Gestes répétitifs : [nombre] mouvements par heure, [durée] par jour",
            "Postures contraignantes : [décrire], [durée] par jour",
            "Déplacement de charges roulantes, transpalettes manuels"],
      dom: "Lombalgie, hernie discale, écrasement, coupures, troubles musculo-squelettiques",
      mes: ["Aides à la manutention : [diable, transpalette, table élévatrice, hayon]",
            "Formation gestes et postures du [date], [nombre] salariés formés",
            "Poids unitaire plafonné à [kg], conditionnement revu avec le fournisseur",
            "Rotation des postes, pauses organisées",
            "Suivi par le service de prévention et de santé au travail"],
      cote: ["forte", "réversibles"] },
    { n: "Déplacement des personnes, chute de plain-pied",
      sit: ["Circulation dans les locaux : sols [état], éclairage [niveau]",
            "Zones encombrées, câbles au sol, dénivelés non signalés",
            "Sols glissants : nettoyage, intempéries, produits répandus",
            "Escaliers, quais, passerelles : [nombre], état des mains courantes"],
      dom: "Décès, traumatismes divers, fractures, entorses, écrasement",
      mes: ["Rangement des circulations, goulottes et passe-câbles posés",
            "Nettoyage par moitié avec panneaux de signalisation",
            "Éclairage vérifié, sources défaillantes remplacées",
            "Marquage au sol des allées piétonnes",
            "Mains courantes et nez de marche antidérapants"],
      cote: ["forte", "réversibles"] },
    { n: "Chute d'objets, effondrement",
      sit: ["Stockage en hauteur : rayonnages [hauteur], charge admissible [kg]",
            "Empilement de palettes, gerbage : [hauteur] maximale",
            "Charges suspendues au-dessus de zones de passage",
            "Ouverture de portes de véhicules chargés"],
      dom: "Décès, traumatismes divers, fractures, écrasement",
      mes: ["Rayonnages vérifiés le [date], charges admissibles affichées",
            "Filmage ou houssage des charges palettisées",
            "Interdiction de circuler sous une charge, zone balisée",
            "Casque fourni, port contrôlé",
            "Arrimage vérifié avant tout déplacement"],
      cote: ["moyenne", "irréversibles"] },
    { n: "Travaux en hauteur",
      sit: ["Accès en hauteur : [échelle, escabeau, échafaudage, nacelle, toiture]",
            "Hauteur de travail : [mètres], [nombre] salariés, [fréquence]",
            "Travail sur véhicule, plateau, remorque, hayon",
            "Interventions en toiture ou sur verrière"],
      dom: "Décès, traumatismes divers, fractures, entorses",
      mes: ["Protection collective d'abord : garde-corps, plateforme, filet",
            "Échafaudage monté par du personnel formé, vérifié le [date]",
            "Harnais et point d'ancrage en dernier recours, vérifiés le [date]",
            "Échelles réservées à l'accès, non au travail",
            "Interdiction écrite de monter sur la charge ou sur le plateau"],
      cote: ["moyenne", "mortels"] },
    { n: "Produits chimiques",
      sit: ["Produits utilisés : [liste], quantités, [nombre] salariés exposés",
            "Agents cancérogènes, mutagènes ou toxiques pour la reproduction : [oui / non]",
            "Poussières, fumées, vapeurs : [nature], [durée] d'exposition",
            "Stockage, transvasement, élimination des déchets"],
      dom: "Brûlures, intoxication aiguë ou chronique, cancers, allergie, irritation",
      mes: ["Fiches de données de sécurité disponibles et à jour, classeur [lieu]",
            "Substitution recherchée pour les produits les plus dangereux",
            "Ventilation et captage à la source, vérifiés le [date]",
            "Équipements de protection adaptés, fournis et remplacés",
            "Étiquetage conservé, aucun transvasement en contenant alimentaire",
            "Information et formation des salariés exposés"],
      cote: ["moyenne", "mortels"] },
    { n: "Agents biologiques",
      sit: ["Contact avec des personnes, des animaux, des déchets, des eaux usées",
            "Nettoyage de sanitaires, collecte de déchets, soins",
            "Risque de piqûre ou de coupure avec un objet souillé",
            "Travail en milieu humide, légionelles, moisissures"],
      dom: "Affection chronique, allergies, maladies professionnelles",
      mes: ["Gants et protections adaptés, fournis et remplacés",
            "Points d'eau et savon accessibles, vestiaires séparés",
            "Conduite à tenir en cas d'exposition, affichée",
            "Vaccinations proposées par le service de santé au travail",
            "Entretien des installations d'eau, contrôle du [date]"],
      cote: ["faible", "irréversibles"] },
    { n: "Bruit, vibrations, ambiances thermiques, éclairage",
      sit: ["Bruit : [niveau] dB(A) mesuré le [date], [durée] par jour, [nombre] salariés",
            "Vibrations : engins, outils portatifs, conduite, [durée] par jour",
            "Chaleur ou froid : [température], [période], [nombre] salariés",
            "Éclairage insuffisant ou éblouissant : [lieux]"],
      dom: "Surdité, malaise, déshydratation, fatigue, traumatismes articulaires",
      mes: ["Mesure du bruit du [date], plan d'action au-delà des seuils",
            "Capotage des sources, traitement acoustique, protections auditives",
            "Sièges suspendus, outils à vibrations réduites, rotation des postes",
            "Eau fraîche à disposition, local de pause tempéré, horaires adaptés",
            "Éclairage renforcé, écrans perpendiculaires aux fenêtres"],
      cote: ["forte", "irréversibles"] },
    { n: "Équipements de travail, machines",
      sit: ["Machines et outils : [liste], [nombre] salariés, [durée]",
            "Engins mobiles : [chariot élévateur, nacelle, engin de chantier]",
            "Maintenance, réglage, nettoyage en marche",
            "Outillage portatif : meuleuse, scie, perceuse"],
      dom: "Décès, fractures, écrasement, coupures, amputation",
      mes: ["Protecteurs et arrêts d'urgence en place et contrôlés",
            "Vérifications périodiques réglementaires, rapport du [date]",
            "Consignation avant toute intervention de maintenance",
            "Autorisations de conduite délivrées, formation du [date]",
            "Notices d'utilisation disponibles au poste",
            "Équipements de protection individuelle fournis : [liste]"],
      cote: ["forte", "irréversibles"] },
    { n: "Organisation du travail et risques psychosociaux",
      sit: ["Charge de travail, délais, interruptions : [décrire], [nombre] salariés",
            "Travail isolé : [qui], [durée], moyen d'alerte [préciser]",
            "Horaires atypiques, travail de nuit, astreintes : [nombre] salariés",
            "Relation avec le public, agressivité : [nombre] incidents",
            "Autonomie, soutien de l'encadrement, reconnaissance"],
      dom: "Surcharge mentale, stress, fatigue, troubles du sommeil et musculo-squelettiques",
      mes: ["Remplaçant identifié aux postes sensibles, plages sans sollicitation",
            "Procédure d'alerte pour le travail isolé, appel de fin de journée",
            "Consigne écrite en cas d'agression, débriefing systématique",
            "Entretiens réguliers sur la charge de travail",
            "Référent désigné, dispositif d'écoute : [préciser]"],
      cote: ["forte", "réversibles"] },
    { n: "Travail sur écran",
      sit: ["[nombre] salariés, [durée] par jour devant un écran",
            "Postes fixes, portables sans rehausseur, doubles écrans",
            "Sièges et plans de travail : [réglables / non]",
            "Implantation par rapport aux fenêtres et à l'éclairage"],
      dom: "Fatigue visuelle, troubles musculo-squelettiques, douleurs cervicales et lombaires",
      mes: ["Sièges réglables, repose-pieds et supports d'écran fournis",
            "Rehausseur et clavier séparé pour tout portable en poste fixe",
            "Écran perpendiculaire aux fenêtres, stores posés",
            "Réglage du poste expliqué à l'arrivée de chaque salarié",
            "Suivi de la vue par le service de prévention et de santé au travail"],
      cote: ["forte", "réversibles"] },
    { n: "Risque routier et déplacements",
      sit: ["Déplacements professionnels : [nombre] salariés, [km] par an",
            "Trajets domicile-travail, véhicules personnels ou de service",
            "Conduite et téléphone, délais, durée de conduite",
            "État et entretien du parc : [nombre] véhicules"],
      dom: "Décès, traumatismes divers",
      mes: ["Entretien du parc au carnet, contrôles techniques à jour",
            "Interdiction écrite du téléphone au volant, mains libres compris",
            "Organisation des tournées tenant compte des temps réels",
            "Formation à la conduite en sécurité du [date]",
            "Protocole de sécurité établi avec les sites clients"],
      cote: ["forte", "mortels"] },
    { n: "Circulation interne, coactivité, entreprises extérieures",
      sit: ["Croisement piétons et engins : [zones], [nombre] de chacun",
            "Manœuvres, mise à quai, marche arrière",
            "Intervention d'entreprises extérieures : [nature], [fréquence]",
            "Livraisons, accès des visiteurs"],
      dom: "Décès, traumatismes divers, écrasement",
      mes: ["Plan de circulation affiché, allées piétonnes séparées et marquées",
            "Miroirs aux angles, avertisseurs de recul, gilets haute visibilité",
            "Plan de prévention écrit avec chaque entreprise extérieure",
            "Protocole de sécurité pour les opérations de chargement",
            "Accueil sécurité des intervenants extérieurs"],
      cote: ["forte", "mortels"] },
    { n: "Harcèlements, agissements sexistes, violences",
      sit: ["Ensemble du personnel : [nombre] salariés dont [nombre] femmes",
            "Signalements reçus l'an dernier : [nombre]",
            "Organisation permettant l'isolement d'un salarié",
            "Accueil du public, tiers, clients"],
      dom: "Atteintes psychiques, dépression, arrêts de travail, ruptures",
      mes: ["Référent harcèlement désigné le [date] : [nom]",
            "Procédure de signalement écrite et portée à la connaissance de tous",
            "Affichage des textes et des coordonnées des services compétents",
            "Formation de l'encadrement du [date]",
            "Enquête écrite à tout signalement, sans délai"],
      cote: ["moyenne", "irréversibles"] },
    { n: "Espaces confinés, fouilles, milieux particuliers",
      sit: ["Interventions en cuve, fosse, silo, regard, vide sanitaire",
            "Travaux en tranchée ou en fouille : [profondeur]",
            "Atmosphère appauvrie en oxygène ou explosive",
            "À supprimer si l'entreprise n'en a aucun"],
      dom: "Décès, asphyxie, traumatismes divers, ensevelissement",
      mes: ["Interdiction d'intervenir seul, surveillant à l'extérieur",
            "Contrôle d'atmosphère avant et pendant l'intervention",
            "Ventilation forcée, harnais et moyen de récupération",
            "Blindage des fouilles, talutage",
            "Autorisation de pénétrer écrite pour chaque intervention"],
      cote: ["faible", "mortels"] },
  ];

  /* Le rang du risque : probabilité croisée avec gravité, méthode Carsat.
     1 important, 2 moyen, 3 faible. */
  var RANG = {
    faible:  { "réversibles": 3, "irréversibles": 3, "mortels": 2 },
    moyenne: { "réversibles": 3, "irréversibles": 2, "mortels": 1 },
    forte:   { "réversibles": 2, "irréversibles": 1, "mortels": 1 },
  };
  var NOM_RANG = { 1: "1 - important", 2: "2 - moyen", 3: "3 - faible" };
  function rangDe(c) { return RANG[c[0]][c[1]]; }

  /* ══════════════════════════════════════════════════════════════════════
     LES EXEMPLES, PAR SECTEUR

     Cinq entreprises fictives, une par secteur de la fiche, avec leurs
     unités de travail et, pour chacune, six à dix risques rédigés : la
     situation, l'exposition chiffrée, ce qui existe, ce qui reste à faire,
     l'échéance en mois et la personne responsable. Le contenu vient des
     unités de travail par métier de docs/duerp-metiers.js, resserré au
     format du tableau à sept colonnes. Ce sont des exemples : le bandeau
     EXEMPLE le dit, et le document à compléter suit.
     ══════════════════════════════════════════════════════════════════════ */
  var EXEMPLES = {
    "transport et logistique": {
      nom: "TRANSPORTS EXEMPLE SARL", adresse: "ZA des Chênes, 14 rue du Fret, 77400 Lagny-sur-Marne",
      siret: "812 345 678 00019", ville: "Lagny-sur-Marne", effectif: 34, femmes: 6,
      activite: "messagerie, transport routier de marchandises et garage mécanique",
      signataire: "Monsieur Éric DUVAL, gérant", redacteur: "Madame Nadia FERRAND, responsable d'exploitation",
      spst: "SPSTI de Seine-et-Marne, antenne de Lagny", designe: "Monsieur Pascal MOREL, chef d'atelier",
      pilote: "Madame Nadia FERRAND, responsable d'exploitation",
      evenement: { texte: "décision d'installer une seconde travée de levage à l'atelier mécanique et d'y affecter un troisième mécanicien, avec reprise des horaires de l'atelier jusqu'à 20 heures", nature: 2, piece: "compte rendu de la réunion de direction et devis signé du pont élévateur", unites: [3, 2], risque: "écrasement sous un véhicule levé sur la seconde travée, travail isolé jusqu'à 20 heures", ricochet: "attelage et dételage à l'atelier en soirée, coactivité avec les mécaniciens" },
      unites: [
        { nom: "Quai de chargement", def: "réception, tri et chargement des colis, conduite des chariots", effectif: 10, site: "dépôt",
          lignes: [
            ["Chute de hauteur depuis le bord de quai", "tous les jours, 8 agents de quai, portes ouvertes sans camion", "bord marqué au sol sur la moitié des portes", "barrière escamotable à chaque porte sans camion, porte fermée après chaque opération", 1, "chef de quai, M. Karim BELAÏD"],
            ["Coincement entre camion et quai, départ inopiné", "25 camions par jour, 8 agents et 2 caristes", "cales de roue disponibles", "protocole de sécurité écrit avec chaque transporteur, clés remises au chef de quai pendant le déchargement, feux rouge et vert au poste", 1, "chef de quai, M. Karim BELAÏD"],
            ["Heurt d'un piéton par un chariot élévateur", "6 heures par jour, 8 agents à pied et 2 caristes", "avertisseur sonore, autorisations de conduite à jour", "allée piétonne peinte et séparée par des barrières, miroirs aux angles, gilet haute visibilité pour tous", 2, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Manutention manuelle au dépotage", "2 heures par jour, 8 agents (6 hommes, 2 femmes, mêmes charges)", "transpalettes manuels", "convoyeur mobile pour le dépotage, poids maximal par colis au cahier des charges, port à deux au-delà de 20 kg", 3, "chef de quai, M. Karim BELAÏD"],
            ["Chute de plain-pied, film et cerclage au sol", "toute la vacation, 10 salariés", "balayage en fin de journée", "poubelle à film à chaque tête d'allée, sol contrôlé par le chef de quai à chaque fin de poste", 1, "chef de quai, M. Karim BELAÏD"],
            ["Froid sur le quai ouvert (ambiance thermique)", "de novembre à mars, 10 salariés", "vêtements chauds fournis", "rideau d'air aux portes, local de pause chauffé accessible depuis le quai, seuils de température affichés", 4, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Bruit des convoyeurs et de la filmeuse", "7 heures par jour, 10 salariés", "bouchons à disposition", "mesure annuelle du bruit, capotage de la filmeuse au renouvellement, protections en plusieurs modèles", 6, "responsable d'exploitation, Mme Nadia FERRAND"],
          ] },
        { nom: "Tournée VL", def: "livraison en véhicule léger, 40 arrêts par tournée", effectif: 6, site: "sur la route, Seine-et-Marne et Paris est",
          lignes: [
            ["Accident de la route", "7 heures de conduite par jour, 6 conducteurs (4 hommes, 2 femmes), 150 km par tournée", "véhicules entretenus au carnet, limiteur de vitesse", "tournées reconstruites avec un temps réaliste, téléphone interdit au volant même en mains libres, pneus contrôlés avant l'hiver", 1, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Manutention à la livraison, colis en étage", "60 colis par jour, 6 conducteurs", "diable", "diable monte-escalier, poids par colis plafonné à 20 kg, étage et ascenseur demandés à la prise de commande", 3, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Agression ou incivilité chez le client", "2 incidents signalés l'an dernier, 6 conducteurs", "téléphone professionnel", "consigne écrite (remettre, ne pas résister, appeler ensuite), suivi de fin de course par l'exploitation, débriefing sous 48 heures", 2, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Chute de plain-pied à la descente du véhicule", "40 arrêts par jour, 6 conducteurs", "chaussures fermées", "chaussures antidérapantes fournies, marchepied vérifié chaque mois, consigne des trois points d'appui", 2, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Travail isolé sur la tournée", "toute la journée, 6 conducteurs", "géolocalisation des véhicules", "point téléphonique à mi-tournée, procédure d'alerte écrite si un conducteur ne répond pas", 2, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Cadence et charge mentale, temps de livraison affichés", "toute la journée, 6 conducteurs", "aucune", "temps de course indicatifs, aucun classement individuel, point mensuel sur les points noirs des tournées", 3, "gérant, M. Éric DUVAL"],
            ["Chaleur en cabine l'été, froid l'hiver (ambiances thermiques)", "juin à septembre et décembre à février, 6 conducteurs", "climatisation sur 4 véhicules sur 6", "climatisation sur les deux derniers véhicules, eau fraîche à bord, tournées suspendues en alerte orange", 6, "gérant, M. Éric DUVAL"],
          ] },
        { nom: "Tournée PL", def: "transport régional en poids lourd, bâchage, arrimage, découchés", effectif: 5, site: "sur la route, Île-de-France et Bourgogne",
          lignes: [
            ["Chute depuis la remorque au bâchage et au sanglage", "2 fois par jour, 5 conducteurs", "aucune", "plateforme de bâchage avec garde-corps au dépôt, interdiction écrite de monter sur la charge", 1, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Accident de la route poids lourd, fatigue", "8 heures de conduite par jour, 5 conducteurs, 2 découchés par semaine", "chronotachygraphe, pauses réglementaires", "planning avec marge sur les temps de conduite, nuit sur place au-delà de 500 km, aucun départ avant 5 heures", 1, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Chute de la charge à l'ouverture des portes, arrimage défaillant", "3 chargements par jour, 5 conducteurs", "sangles fournies", "formation à l'arrimage, contrôle avant départ sur fiche signée, ouverture des portes en se plaçant de côté", 2, "chef de quai, M. Karim BELAÏD"],
            ["Écrasement à l'attelage et au dételage", "2 fois par jour, 5 conducteurs", "frein de parc", "consigne d'attelage écrite et affichée, cales, gants, éclairage de la zone d'attelage", 2, "chef d'atelier, M. Pascal MOREL"],
            ["Vibrations et posture de conduite", "8 heures par jour, 5 conducteurs", "sièges pneumatiques", "réglage du siège au poids expliqué à chaque conducteur, suivi médical demandé au service de prévention", 6, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Travail isolé de nuit et agression sur les aires", "3 nuits par semaine, 5 conducteurs", "téléphone", "aires sécurisées imposées au planning, consigne en cas d'agression, appel de fin de journée", 2, "responsable d'exploitation, Mme Nadia FERRAND"],
            ["Gaz d'échappement, moteur tournant à quai", "tous les jours, 5 conducteurs et 8 agents de quai", "aucune", "consigne moteur coupé à quai, extraction du quai vérifiée", 3, "chef de quai, M. Karim BELAÏD"],
          ] },
        { nom: "Atelier mécanique", def: "entretien et réparation des VL et PL de la flotte et de clients : pont, fosse, pneumatiques, soudure", effectif: 3, site: "dépôt, bâtiment B",
          lignes: [
            ["Chute de plain-pied sur sol huileux, chute dans la fosse de visite", "tous les jours, 3 salariés (2 mécaniciens, 1 chef d'atelier)", "garde-corps amovible de la fosse, absorbant disponible", "couverture de fosse roulante, échelle fixe à chaque extrémité, éclairage de fosse remis en état, sol antidérapant repris, nettoyage immédiat des fuites", 1, "chef d'atelier, M. Pascal MOREL"],
            ["Écrasement sous un véhicule levé ou calé (pont élévateur, cric, chandelles)", "4 levages par jour, 3 salariés", "pont vérifié chaque année, chandelles", "vérification semestrielle du pont avec rapport conservé, chandelles obligatoires sous tout véhicule levé au cric, consigne affichée au pont", 1, "chef d'atelier, M. Pascal MOREL"],
            ["Éclatement de pneumatique au gonflage, démontage des roues PL", "6 pneus par semaine, 3 salariés", "compresseur avec manomètre", "cage de gonflage pour les roues PL, gonflage à distance, formation au démontage des jantes PL", 2, "chef d'atelier, M. Pascal MOREL"],
            ["Batteries et électricité : projection d'acide, court-circuit, brûlure", "3 batteries par semaine, 3 salariés", "gants", "lunettes et tablier au poste batteries, rince-œil à moins de 10 mètres, outillage isolé, consignation avant intervention sur le circuit", 2, "chef d'atelier, M. Pascal MOREL"],
            ["Produits : huiles, solvants, liquides de frein, dégraissants, gaz d'échappement", "4 heures par jour, 3 salariés", "gants nitrile, portes ouvertes aux essais moteur", "fiches de données de sécurité à l'atelier, fontaine de dégraissage à aspiration, armoire ventilée avec bac de rétention, extracteur raccordé au pot pour tout essai moteur", 2, "chef d'atelier, M. Pascal MOREL"],
            ["Soudure et meulage : brûlures, projections, fumées, incendie", "3 heures par semaine, 2 mécaniciens", "masque de soudeur, extincteur", "aspiration à la source, écran de soudure, permis de feu pour toute intervention près d'un réservoir, chiffons souillés en bac métallique fermé", 2, "chef d'atelier, M. Pascal MOREL"],
            ["Bruit : compresseur, clé à chocs, meuleuse", "5 heures par jour, 3 salariés", "bouchons à disposition", "capotage du compresseur, mesure du bruit au poste, casques anti-bruit fournis et portés", 4, "chef d'atelier, M. Pascal MOREL"],
            ["Manutention de pièces lourdes : roues PL, boîtes de vitesses, batteries", "10 manutentions par jour, 3 salariés", "palan sur une travée", "chariot porte-roue PL, palan sur la seconde travée, port à deux au-delà de 25 kg", 3, "chef d'atelier, M. Pascal MOREL"],
            ["Outillage à main et électroportatif : coupure, projection, électrisation", "toute la journée, 3 salariés", "lunettes disponibles", "vérification annuelle de l'électroportatif consignée, outil douteux retiré le jour même, lunettes portées au meulage et au perçage", 2, "chef d'atelier, M. Pascal MOREL"],
            ["Travail isolé en fin de journée et froid de l'atelier (ambiance thermique)", "1 heure par jour seul, 3 salariés ; portes ouvertes de novembre à mars", "téléphone", "appel de fin de poste au responsable d'exploitation, alarme pour travailleur isolé, chauffage radiant et rideau à la porte de l'atelier", 3, "chef d'atelier, M. Pascal MOREL"],
          ] },
        { nom: "Bureau d'exploitation", def: "planification des tournées, relation clients et chauffeurs, administration", effectif: 4, site: "dépôt, étage",
          lignes: [
            ["Travail sur écran, posture", "7 heures par jour, 4 salariés", "sièges réglables", "rehausseur et clavier séparé pour les portables, écran perpendiculaire à la fenêtre, réglage du poste à l'arrivée", 2, "gérant, M. Éric DUVAL"],
            ["Charge mentale : appels, planification en urgence", "toute la journée, 2 exploitants", "aucune", "remplaçant identifié pour le planning, plage sans appel le soir, point mensuel sur la charge", 3, "gérant, M. Éric DUVAL"],
            ["Agressivité téléphonique des clients et des chauffeurs", "5 appels difficiles par semaine, 3 salariés", "aucune", "droit de transférer un appel devenu agressif, phrase de fin d'appel, main courante relue chaque mois", 2, "gérant, M. Éric DUVAL"],
            ["Harcèlement moral, harcèlement sexuel et agissements sexistes", "ensemble du personnel, 34 salariés dont 6 femmes", "référent harcèlement désigné", "procédure de signalement affichée au dépôt, formation de l'encadrement, enquête écrite à tout signalement", 2, "gérant, M. Éric DUVAL"],
            ["Circulation du personnel de bureau sur le quai et à l'atelier", "3 passages par jour, 4 salariés", "aucune", "gilet et chaussures de sécurité pour toute entrée sur le quai, allée piétonne seule empruntée", 1, "chef de quai, M. Karim BELAÏD"],
            ["Électricité et départ de feu, multiprises en cascade", "permanent, 4 salariés", "extincteurs vérifiés", "prises murales ajoutées, vérification périodique de l'installation, archives hors des dégagements", 3, "gérant, M. Éric DUVAL"],
          ] },
      ] },

    "industrie": {
      nom: "MÉCA EXEMPLE SAS", adresse: "ZI de la Plaine, 8 avenue des Forges, 42000 Saint-Étienne",
      siret: "823 456 789 00027", ville: "Saint-Étienne", effectif: 58, femmes: 9,
      activite: "découpe, emboutissage et assemblage de pièces métalliques",
      signataire: "Madame Hélène ROCHE, présidente", redacteur: "Monsieur Julien HAMON, responsable de production",
      spst: "SPSTI Loire, antenne de Saint-Étienne", designe: "Monsieur Yann LE GALL, responsable maintenance",
      pilote: "Monsieur Julien HAMON, responsable de production",
      evenement: { texte: "décision d'installer une presse de 400 tonnes sur la ligne de production et de passer l'équipe de nuit de 4 à 6 opérateurs", nature: 2, piece: "compte rendu du comité de direction et bon de commande de la presse", unites: [0, 1], risque: "happement et écrasement par la nouvelle presse, bruit accru, équipe de nuit renforcée", ricochet: "consignation de la nouvelle presse, interventions de nuit" },
      unites: [
        { nom: "Ligne de production", def: "conduite des presses et des postes de découpe et d'assemblage, en 3 x 8", effectif: 17, site: "atelier A",
          lignes: [
            ["Happement, écrasement et coupure par les machines", "8 heures par jour, 17 salariés", "protecteurs en place, arrêt d'urgence", "consignation avant toute intervention en zone d'outillage, arrêt d'urgence essayé chaque mois avec la date notée, formation au poste consignée avant la première conduite seul", 1, "responsable de production, M. Julien HAMON"],
            ["Bruit du poste de découpe", "8 heures par jour, 17 salariés, 85 dB(A) mesurés", "bouchons fournis", "capotage de la découpe, zones marquées au sol, suivi audiométrique avec le service de prévention", 3, "responsable de production, M. Julien HAMON"],
            ["Manutention et gestes répétitifs, bacs de 15 kg", "40 fois par heure, 17 salariés (15 hommes, 2 femmes, mêmes charges)", "aucune", "bacs sur support à hauteur de hanche, table élévatrice au poste d'alimentation, rotation toutes les deux heures inscrite au planning", 3, "responsable de production, M. Julien HAMON"],
            ["Risque chimique : huiles de coupe, solvants, fumées de soudure", "3 heures par jour, 6 salariés", "gants nitrile", "aspiration à la source, fiches de données de sécurité à l'atelier, substitution demandée à chaque commande, suivi individuel renforcé", 2, "responsable de production, M. Julien HAMON"],
            ["Ambiances thermiques : four de traitement, quai ouvert", "juin à septembre devant le four, décembre à février au quai, 17 salariés", "ventilation", "écrans devant le four, eau fraîche au poste, seuils de température affichés, sas au quai", 4, "responsable de production, M. Julien HAMON"],
            ["Chute de plain-pied, huile et copeaux au sol", "toute la journée, 17 salariés", "nettoyage en fin de poste", "absorbant à chaque poste, caillebotis devant les presses, chaussures antidérapantes", 1, "responsable de production, M. Julien HAMON"],
            ["Travail posté, cadence et charge mentale", "3 x 8, 17 salariés", "aucune", "planning remis quinze jours à l'avance, objectifs discutés en équipe sans classement individuel, pauses respectées", 3, "présidente, Mme Hélène ROCHE"],
            ["Agissements sexistes sur la ligne", "quotidien, 2 salariées sur 17", "référent désigné", "rappel écrit du règlement intérieur, formation de l'encadrement, tout signalement traité sous 48 heures", 2, "présidente, Mme Hélène ROCHE"],
          ] },
        { nom: "Maintenance", def: "dépannage, entretien préventif, interventions électriques et mécaniques", effectif: 3, site: "atelier A et local technique",
          lignes: [
            ["Électrisation et remise en marche intempestive", "5 interventions par jour, 3 techniciens", "habilitations à jour", "consignation par cadenas personnel, vérification d'absence de tension à l'appareil, procédure par machine affichée près de l'armoire", 1, "responsable maintenance, M. Yann LE GALL"],
            ["Chute de hauteur, échelle sur sol huileux", "2 fois par semaine, 3 techniciens", "échelle", "plateforme roulante ou nacelle au-dessus de 2 mètres, autorisation de conduite de nacelle, échelle réservée à l'accès", 1, "responsable maintenance, M. Yann LE GALL"],
            ["Travail isolé d'astreinte", "1 week-end sur 3, 3 techniciens", "téléphone", "dispositif d'alarme pour travailleur isolé, appel de prise et de fin d'intervention, interventions en hauteur ou électriques interdites seul", 2, "responsable maintenance, M. Yann LE GALL"],
            ["Manutention de moteurs et de pièces lourdes", "3 fois par semaine, 3 techniciens", "palan", "chariot de manutention, port à deux au-delà de 25 kg", 3, "responsable maintenance, M. Yann LE GALL"],
            ["Produits de dégraissage et de lubrification", "2 heures par jour, 3 techniciens", "gants", "fontaine de dégraissage fermée, fiches de données de sécurité au local, armoire ventilée", 2, "responsable maintenance, M. Yann LE GALL"],
            ["Soudure et meulage", "4 heures par semaine, 3 techniciens", "masque", "aspiration mobile, permis de feu, extincteur au poste", 2, "responsable maintenance, M. Yann LE GALL"],
          ] },
        { nom: "Magasin et manutention", def: "réception, stockage, expédition, conduite des chariots", effectif: 6, site: "bâtiment B et quai",
          lignes: [
            ["Circulation des chariots et des piétons", "8 heures par jour, 6 salariés et 17 opérateurs qui traversent", "autorisations de conduite", "plan de circulation affiché, allées piétonnes marquées au sol, gyrophare et avertisseur vérifiés à la prise de poste, gilets pour tous", 1, "responsable logistique, Mme Sonia DIALLO"],
            ["Chute d'objets, rayonnages heurtés", "permanent, 6 salariés", "charge maximale affichée", "contrôle mensuel des rayonnages sur fiche signée, sabots de protection, casques en zone de stockage haute", 2, "responsable logistique, Mme Sonia DIALLO"],
            ["Manutention au quai, niveleur en panne", "4 camions par jour, 6 salariés", "transpalette manuel", "niveleur réparé sous quinze jours, camion calé avant tout accès, transpalette électrique pour les charges lourdes", 2, "responsable logistique, Mme Sonia DIALLO"],
            ["Chute de hauteur depuis le quai", "tous les jours, 6 salariés", "bord marqué au sol", "barrière escamotable aux portes sans camion, porte fermée après chaque opération", 1, "responsable logistique, Mme Sonia DIALLO"],
            ["Batteries de traction, local de charge", "2 charges par jour, 2 caristes", "local ventilé", "écran facial, gants et tablier, rince-œil vérifié chaque mois, procédure affichée dans le local", 2, "responsable logistique, Mme Sonia DIALLO"],
            ["Froid au quai ouvert (ambiance thermique)", "novembre à mars, 6 salariés", "vêtements chauds", "rideau d'air, local de pause chauffé, seuils de température affichés", 4, "responsable logistique, Mme Sonia DIALLO"],
          ] },
        { nom: "Laboratoire et contrôle qualité", def: "essais, mesures, contrôle des pièces, manipulation de réactifs", effectif: 3, site: "bâtiment A, laboratoire",
          lignes: [
            ["Produits chimiques de laboratoire : réactifs, solvants", "5 heures par jour, 3 salariés dont 2 femmes en âge de procréer (impact différencié selon le sexe)", "sorbonne, gants", "inventaire des produits et substitution des plus dangereux, sorbonne vérifiée chaque année, suivi individuel renforcé, poste aménagé dès une grossesse déclarée", 2, "responsable qualité, Mme Inès BARBIER"],
            ["Coupures et piqûres, verrerie", "tous les jours, 3 salariés", "conteneur à verre", "gants anti-coupure au lavage, pelle et balayette, boîte à aiguilles", 1, "responsable qualité, Mme Inès BARBIER"],
            ["Brûlures : étuve, bain-marie, plaque chauffante", "10 fois par jour, 3 salariés", "gants anti-chaleur", "zone chaude signalée, gants à manchette, consigne affichée", 2, "responsable qualité, Mme Inès BARBIER"],
            ["Travail sur écran et posture au microscope", "4 heures par jour, 3 salariés", "sièges réglables", "microscope à oculaires réglables, pause visuelle chaque heure", 3, "responsable qualité, Mme Inès BARBIER"],
            ["Incendie, stockage de solvants", "permanent, 3 salariés", "extincteur CO2", "armoire coupe-feu, quantités limitées à la semaine, exercice annuel", 3, "présidente, Mme Hélène ROCHE"],
            ["Travail isolé en fin de poste", "1 heure par jour, 1 salariée", "aucune", "porte ouverte sur l'atelier, appel de fin de poste, aucune manipulation dangereuse seule", 2, "responsable qualité, Mme Inès BARBIER"],
          ] },
        { nom: "Bureaux", def: "administration, méthodes, encadrement", effectif: 8, site: "bâtiment A, étage",
          lignes: [
            ["Travail sur écran et posture", "8 heures par jour, 8 salariés", "sièges réglables", "écran en face à hauteur des yeux, second écran pour les postes qui comparent deux documents, réglage du poste à l'arrivée", 6, "responsable administratif, Mme Claire VIDAL"],
            ["Charge mentale de l'encadrement, horaires étendus", "permanent, 3 chefs d'équipe", "aucune", "remplaçants identifiés par poste, plage sans sollicitation le soir respectée par la direction, point mensuel sur la charge", 3, "présidente, Mme Hélène ROCHE"],
            ["Circulation du personnel de bureau dans l'atelier", "5 passages par jour, 8 salariés", "aucune", "chaussures de sécurité et gilet fournis, allées piétonnes seules empruntées, protections auditives à l'entrée de l'atelier", 2, "responsable de production, M. Julien HAMON"],
            ["Harcèlement moral, harcèlement sexuel et agissements sexistes", "ensemble du personnel, 58 salariés dont 9 femmes", "référent du comité désigné", "procédure de signalement affichée, formation des chefs d'équipe, enquête écrite sous huit jours", 2, "présidente, Mme Hélène ROCHE"],
            ["Électricité et départ de feu", "permanent, 8 salariés", "vérification annuelle", "multiprises en cascade supprimées, archives hors des dégagements, exercice d'évacuation annuel", 3, "présidente, Mme Hélène ROCHE"],
            ["Risque routier, déplacements clients et fournisseurs", "2 jours par semaine, 3 salariés", "véhicules de service entretenus", "rendez-vous à temps de trajet réaliste, téléphone interdit au volant, nuit sur place au-delà de 400 km", 2, "présidente, Mme Hélène ROCHE"],
          ] },
      ] },

    "bâtiment et travaux publics": {
      nom: "BÂTI EXEMPLE SARL", adresse: "3 chemin des Carrières, 33700 Mérignac",
      siret: "834 567 890 00035", ville: "Mérignac", effectif: 27, femmes: 2,
      activite: "gros œuvre, second œuvre et terrassement",
      signataire: "Monsieur Paul LAMBERT, gérant", redacteur: "Monsieur Rachid AMRANI, conducteur de travaux",
      spst: "Service de santé au travail du BTP de la Gironde", designe: "Monsieur Rachid AMRANI, conducteur de travaux",
      pilote: "Monsieur Rachid AMRANI, conducteur de travaux",
      evenement: { texte: "signalement par le service de prévention et de santé au travail de deux cas de surdité chez des compagnons du gros œuvre, avec mesures de bruit dépassant les seuils", nature: 3, piece: "courrier du médecin du travail et rapport de mesures", unites: [0, 2], risque: "bruit du marteau-piqueur et de la disqueuse, deux surdités constatées", ricochet: "bruit en cabine, coactivité avec les postes bruyants" },
      unites: [
        { nom: "Gros œuvre", def: "maçonnerie, coffrage, ferraillage, fouilles", effectif: 12, site: "chantiers en cours",
          lignes: [
            ["Chute de hauteur, garde-corps incomplet", "quotidien, 12 compagnons, planchers à 4 mètres", "garde-corps sur trois côtés", "garde-corps sur les quatre côtés sans exception, trémies couvertes dès leur création, échafaudage réceptionné par écrit avant usage", 1, "chef de chantier, M. Thomas GIRARD"],
            ["Ensevelissement en fouille", "2 tranchées par mois, 4 compagnons", "aucune", "blindage ou talutage au-delà de 1,30 mètre, déblais éloignés du bord, échelle d'accès, guetteur en surface", 1, "conducteur de travaux, M. Rachid AMRANI"],
            ["Port de charges : sacs, parpaings, banches", "4 heures par jour, 12 compagnons", "brouette", "monte-matériaux, approvisionnement livré au poste, sacs de 25 kg, banches à deux", 3, "chef de chantier, M. Thomas GIRARD"],
            ["Poussières de silice à la découpe à sec", "3 heures par jour, 6 compagnons", "masque FFP2", "découpe à l'eau ou aspiration obligatoire, FFP3 avec essai d'ajustement, découpe en extérieur", 1, "conducteur de travaux, M. Rachid AMRANI"],
            ["Bruit : marteau-piqueur, disqueuse", "4 heures par jour, 12 compagnons", "bouchons", "protections auditives moulées, plages de travaux bruyants annoncées, mesure d'exposition", 3, "chef de chantier, M. Thomas GIRARD"],
            ["Chaleur l'été, froid l'hiver sur le chantier (ambiances thermiques)", "juin à septembre et décembre à février, 12 compagnons", "eau", "abri ombragé, horaires décalés en canicule, vêtements chauds et boissons chaudes, seuils écrits", 4, "conducteur de travaux, M. Rachid AMRANI"],
            ["Chute de plain-pied : gravats, câbles, cheminements", "permanent, 12 compagnons", "nettoyage hebdomadaire", "nettoyage quotidien, cheminements balisés et éclairés, bennes au plus près", 1, "chef de chantier, M. Thomas GIRARD"],
            ["Vibrations des outils percutants", "3 heures par jour, 6 compagnons", "aucune", "outils antivibratiles au renouvellement, rotation, suivi médical", 6, "conducteur de travaux, M. Rachid AMRANI"],
          ] },
        { nom: "Second œuvre", def: "électricité, plâtrerie, peinture, menuiserie intérieure", effectif: 7, site: "chantiers en cours",
          lignes: [
            ["Chute depuis un escabeau ou une échelle", "quotidien, 7 compagnons", "escabeaux", "plateforme individuelle roulante, échelle réservée à l'accès, matériel vérifié à chaque prise de poste", 1, "chef de chantier, M. Thomas GIRARD"],
            ["Risque chimique : colles, peintures, solvants", "3 heures par jour, 4 compagnons", "gants", "fiches de données de sécurité au chantier, produit le moins dangereux retenu, ventilation forcée en local fermé, gants adaptés au produit", 2, "conducteur de travaux, M. Rachid AMRANI"],
            ["Poussières de bois et de plâtre", "2 heures par jour, 5 compagnons", "masque", "aspiration raccordée aux machines, FFP3, nettoyage par aspiration", 2, "chef de chantier, M. Thomas GIRARD"],
            ["Électricité : percement de cloisons, câbles sous tension", "3 fois par semaine, 7 compagnons", "habilitations", "consignation écrite, détection de réseaux avant percement, différentiel de chantier testé chaque semaine", 1, "conducteur de travaux, M. Rachid AMRANI"],
            ["Postures contraignantes : plafonds, plinthes", "6 heures par jour, 7 compagnons", "genouillères", "lève-plaque, tabouret roulant, tréteaux réglables, alternance des tâches", 3, "chef de chantier, M. Thomas GIRARD"],
            ["Bruit des outils électroportatifs", "4 heures par jour, 7 compagnons", "bouchons", "protections en plusieurs modèles, plages bruyantes annoncées", 3, "chef de chantier, M. Thomas GIRARD"],
            ["Coactivité avec les autres corps d'état", "quotidien, 7 compagnons", "réunion de chantier", "tâches incompatibles décalées dans le temps, plan de sécurité commenté aux compagnons, quart d'heure sécurité hebdomadaire", 1, "conducteur de travaux, M. Rachid AMRANI"],
          ] },
        { nom: "Conduite d'engins", def: "pelle, chargeuse, minipelle, terrassement", effectif: 3, site: "chantiers en cours",
          lignes: [
            ["Heurt d'un piéton par un engin en recul", "quotidien, 3 conducteurs et 19 compagnons à pied", "avertisseur de recul", "plan de circulation affiché, zones piétonnes balisées, aucun recul sans guide ou caméra, gilets pour tous", 1, "conducteur de travaux, M. Rachid AMRANI"],
            ["Renversement de l'engin en talus ou en bord de fouille", "2 fois par semaine, 3 conducteurs", "ceinture", "distance au bord fixée par écrit, ceinture contrôlée, autorisation de conduite après formation", 1, "conducteur de travaux, M. Rachid AMRANI"],
            ["Contact avec les réseaux enterrés ou aériens", "5 fouilles par mois, 3 conducteurs", "plans des réseaux", "marquage au sol avant toute fouille, distance aux lignes, terrassement manuel à l'approche", 1, "conducteur de travaux, M. Rachid AMRANI"],
            ["Vibrations et posture de conduite", "7 heures par jour, 3 conducteurs", "siège à suspension", "réglage du siège au poids, rotation avec un poste au sol, suivi médical", 6, "conducteur de travaux, M. Rachid AMRANI"],
            ["Bruit et poussières en cabine", "7 heures par jour, 3 conducteurs", "cabine fermée", "filtration de cabine entretenue, arrosage des pistes, protections auditives", 3, "chef de chantier, M. Thomas GIRARD"],
            ["Écrasement à l'entretien et au changement de godet", "3 fois par semaine, 3 conducteurs", "aucune", "calage avant intervention, moteur coupé, verrouillage de l'attache rapide vérifié", 2, "chef d'atelier, M. Lucas PERRIN"],
            ["Chaleur et froid en cabine (ambiances thermiques)", "été et hiver, 3 conducteurs", "climatisation sur 2 engins sur 3", "climatisation du troisième engin, eau fraîche, pauses aux heures chaudes", 4, "conducteur de travaux, M. Rachid AMRANI"],
          ] },
        { nom: "Base vie et dépôt", def: "atelier, stockage, chargement des fourgons, installations de chantier", effectif: 2, site: "dépôt de Mérignac et base vie de chaque chantier",
          lignes: [
            ["Manutention au chargement des fourgons", "quotidien, 2 salariés", "hayon sur 1 fourgon sur 3", "hayon sur tous les fourgons, chargement à deux au-delà de 25 kg, échelle de toit maniée à deux", 2, "chef d'atelier, M. Lucas PERRIN"],
            ["Machines d'atelier : scie, meuleuse", "2 heures par jour, 2 salariés", "protecteurs", "machine sans protecteur mise hors service le jour même, poussoir, arrêt d'urgence testé chaque mois, liste des personnes formées affichée", 1, "chef d'atelier, M. Lucas PERRIN"],
            ["Incendie : solvants et bouteilles de gaz", "permanent, 2 salariés", "extincteurs", "armoire ventilée, bouteilles de gaz à l'extérieur, chiffons en bac métallique, interdiction de fumer affichée", 2, "chef d'atelier, M. Lucas PERRIN"],
            ["Hygiène de la base vie : sanitaires, réfectoire, eau", "quotidien, 27 salariés", "bungalow sanitaire", "eau potable et chauffage vérifiés chaque semaine, nettoyage quotidien, vestiaire séparé pour les 2 salariées", 1, "chef de chantier, M. Thomas GIRARD"],
            ["Risque routier, trajets dépôt-chantier", "1 heure par jour, 27 salariés", "véhicules entretenus", "départ groupé, conducteur désigné et reposé, téléphone interdit au volant", 2, "conducteur de travaux, M. Rachid AMRANI"],
            ["Chute d'objets stockés au dépôt", "permanent, 2 salariés", "racks fixés", "hauteur de stockage marquée, contrôle mensuel, rack déformé vidé le jour même", 2, "chef d'atelier, M. Lucas PERRIN"],
          ] },
        { nom: "Bureaux", def: "études de prix, administration, direction", effectif: 3, site: "dépôt de Mérignac, étage",
          lignes: [
            ["Travail sur écran", "8 heures par jour, 3 salariés", "sièges réglables", "rehausseur de portable, écran perpendiculaire à la fenêtre", 3, "gérant, M. Paul LAMBERT"],
            ["Charge mentale : appels d'offres, urgences de chantier", "permanent, 3 salariés", "aucune", "priorités arbitrées par le gérant, plage sans sollicitation le soir", 3, "gérant, M. Paul LAMBERT"],
            ["Visites de chantier du personnel de bureau", "2 fois par semaine, 3 salariés", "casque", "casque, chaussures et gilet fournis, accueil sécurité à chaque visite", 1, "chef de chantier, M. Thomas GIRARD"],
            ["Harcèlement moral, harcèlement sexuel et agissements sexistes", "ensemble du personnel, 27 salariés dont 2 femmes", "aucune", "procédure de signalement affichée à la base vie, référent désigné, sanction prévue au règlement intérieur", 2, "gérant, M. Paul LAMBERT"],
            ["Électricité et incendie des bureaux", "permanent, 3 salariés", "extincteurs", "multiprises retirées, vérification périodique, exercice d'évacuation annuel", 3, "gérant, M. Paul LAMBERT"],
            ["Risque routier des déplacements clients", "3 jours par semaine, 2 salariés", "aucune", "rendez-vous à temps de trajet réaliste, téléphone interdit au volant", 2, "gérant, M. Paul LAMBERT"],
          ] },
      ] },

    "commerce": {
      nom: "COMMERCE EXEMPLE SARL", adresse: "25 rue de la République, 69002 Lyon",
      siret: "845 678 901 00043", ville: "Lyon", effectif: 22, femmes: 14,
      activite: "commerce de détail, magasin de centre-ville avec réserve et livraison",
      signataire: "Madame Sophie LENOIR, gérante", redacteur: "Monsieur Antoine ROY, responsable réception",
      spst: "SPSTI du Rhône, centre de Lyon Bellecour", designe: "Monsieur Antoine ROY, responsable réception",
      pilote: "Madame Sophie LENOIR, gérante",
      evenement: { texte: "décision d'ouvrir le magasin le dimanche matin, avec une caisse et un vendeur seulement", nature: 2, piece: "décision de la gérante et nouveau planning", unites: [2, 0], risque: "braquage et travail isolé le dimanche matin, une seule personne en caisse", ricochet: "vendeur seul en surface, agression et incivilité sans appui" },
      unites: [
        { nom: "Surface de vente", def: "accueil, conseil, réassort en rayon", effectif: 9, site: "magasin, rez-de-chaussée",
          lignes: [
            ["Station debout prolongée", "8 heures par jour, 9 vendeurs", "aucune", "siège assis-debout en zone de vente, tapis anti-fatigue au comptoir, rotation dans la journée", 3, "gérante, Mme Sophie LENOIR"],
            ["Incivilité et agression verbale de clients", "3 incidents par mois, 9 vendeurs dont 6 femmes", "aucune", "procédure de refus et d'appel du responsable affichée en réserve, deux personnes minimum à la fermeture, main courante relue chaque mois", 2, "gérante, Mme Sophie LENOIR"],
            ["Chute de plain-pied les jours de pluie", "40 jours par an, 9 vendeurs et la clientèle", "serpillière à la demande", "tapis absorbant à l'entrée, passage programmé à heure fixe, cône de signalisation, sol antidérapant au prochain remplacement", 1, "gérante, Mme Sophie LENOIR"],
            ["Chute depuis un escabeau pour atteindre le haut des rayons", "20 fois par jour, 9 vendeurs", "escabeau", "escabeau à plate-forme par rayon, interdiction de monter sur un rayonnage, montée les mains libres", 1, "chef de rayon, M. Mehdi SAÏDI"],
            ["Manutention au réassort", "2 heures par jour, 9 vendeurs", "aucune", "références lourdes entre les hanches et les épaules, port à deux au-delà de 15 kg, formation gestes et postures", 3, "chef de rayon, M. Mehdi SAÏDI"],
            ["Courant d'air et froid à l'entrée (ambiance thermique)", "novembre à mars, 3 vendeurs près de l'entrée", "aucune", "rideau d'air chaud, poste d'accueil déplacé hors de l'axe de la porte", 6, "gérante, Mme Sophie LENOIR"],
            ["Bruit de la sonorisation et des annonces", "8 heures par jour, 9 vendeurs", "aucune", "niveau plafonné et verrouillé, mesure annuelle", 6, "gérante, Mme Sophie LENOIR"],
          ] },
        { nom: "Réserve et réception", def: "déchargement des livraisons, stockage, déballage", effectif: 3, site: "réserve et quai arrière",
          lignes: [
            ["Chute de quai et manœuvre de hayon", "3 livraisons par jour, 3 salariés", "aucune", "bord de quai marqué, cale de roue, clés du camion remises pendant l'opération, aucun déplacement à reculons avec une charge", 1, "responsable réception, M. Antoine ROY"],
            ["Chute d'objets stockés en hauteur", "permanent, 3 salariés", "palettes filmées", "charges lourdes au niveau bas, hauteur de gerbage marquée, contrôle mensuel des racks", 2, "responsable réception, M. Antoine ROY"],
            ["Heurt par le transpalette électrique", "4 heures par jour, 3 salariés", "avertisseur", "conduite réservée aux personnes autorisées (liste affichée), allées dégagées et marquées, réserve interdite à la clientèle", 2, "gérante, Mme Sophie LENOIR"],
            ["Port de charges au dépotage", "40 minutes par livraison, 3 salariés", "transpalette", "poids maximal par colis au cahier des charges des fournisseurs, aide au-delà de 20 kg, rotation avec un poste de saisie", 3, "responsable réception, M. Antoine ROY"],
            ["Coupures au déballage, cutter", "200 cartons par jour, 3 salariés", "cutter à lame fixe", "cutter à lame rétractable, lames fixes retirées, coupe-cerclage, gants anti-coupure", 1, "chef de rayon, M. Mehdi SAÏDI"],
            ["Froid au quai et en chambre froide (ambiances thermiques)", "2 heures par jour, 3 salariés", "veste", "rideau d'air, vêtement chaud et gants fournis, temps continu limité en chambre froide", 6, "gérante, Mme Sophie LENOIR"],
            ["Coactivité avec les chauffeurs", "3 livraisons par jour, 3 salariés", "aucune", "protocole de sécurité avec chaque transporteur régulier, zone d'attente des chauffeurs, gilet pour tous", 3, "responsable réception, M. Antoine ROY"],
          ] },
        { nom: "Caisse", def: "encaissement, accueil, gestion des fonds", effectif: 5, site: "magasin, ligne de caisses",
          lignes: [
            ["Troubles musculo-squelettiques au scan", "400 articles par heure, 5 salariées", "sièges assis-debout", "poste réglé personne par personne, alternance caisse et rayon (deux heures maximum d'affilée), douchette pour les articles lourds", 3, "gérante, Mme Sophie LENOIR"],
            ["Braquage", "1 tentative en trois ans, 5 salariées, seules le dimanche matin", "coffre", "prélèvements réguliers, coffre à ouverture différée signalé, jamais seule à l'ouverture ni à la fermeture, consigne écrite (obéir, mémoriser, appeler), soutien pris en charge", 1, "gérante, Mme Sophie LENOIR"],
            ["Charge mentale : refus devant la file d'attente", "10 fois par jour, 5 salariées", "aucune", "procédure de refus écrite et affichée, appel du responsable sous deux minutes, aucun reproche à qui applique la procédure", 2, "gérante, Mme Sophie LENOIR"],
            ["Station assise-debout prolongée", "6 heures par jour, 5 salariées", "sièges", "repose-pieds, autorisation permanente de se lever entre deux clients, chaussures prises en charge", 2, "gérante, Mme Sophie LENOIR"],
            ["Agissements sexistes de la clientèle envers les hôtesses", "4 signalements l'an dernier, 5 salariées", "aucune", "consigne d'interruption de l'encaissement et d'appel du responsable, affichage à l'entrée, signalement consigné", 2, "gérante, Mme Sophie LENOIR"],
            ["Courant d'air à la ligne de caisses (ambiance thermique)", "novembre à mars, 5 salariées", "aucune", "sas ou rideau d'air, gilet fourni", 6, "gérante, Mme Sophie LENOIR"],
          ] },
        { nom: "Livraison", def: "livraison des commandes à domicile en véhicule léger", effectif: 2, site: "sur la route, Lyon et périphérie",
          lignes: [
            ["Risque routier", "5 heures par jour, 2 livreurs, 80 km par tournée", "véhicules entretenus", "tournées à temps de trajet réaliste, téléphone interdit au volant, pneus vérifiés avant l'hiver", 1, "gérante, Mme Sophie LENOIR"],
            ["Port de charges dans les escaliers", "30 livraisons par jour, 2 livreurs", "diable", "poids par commande plafonné, étage demandé à la commande, diable monte-escalier", 2, "gérante, Mme Sophie LENOIR"],
            ["Agression et vol pendant la tournée", "1 incident l'an dernier, 2 livreurs", "téléphone", "paiement en ligne privilégié, suivi de fin de course, consigne en cas de menace", 2, "gérante, Mme Sophie LENOIR"],
            ["Intempéries et chaleur (ambiances thermiques)", "été et hiver, 2 livreurs", "aucune", "équipement chaud et imperméable, eau fraîche, livraisons suspendues en alerte orange", 3, "gérante, Mme Sophie LENOIR"],
            ["Travail isolé sur la tournée", "5 heures par jour, 2 livreurs", "géolocalisation", "appel de mi-tournée, procédure d'alerte écrite", 2, "gérante, Mme Sophie LENOIR"],
            ["Chute de plain-pied à la descente du véhicule", "30 arrêts par jour, 2 livreurs", "aucune", "chaussures antidérapantes, marchepied vérifié", 2, "gérante, Mme Sophie LENOIR"],
          ] },
        { nom: "Bureaux", def: "gestion, comptabilité, direction", effectif: 3, site: "magasin, entresol",
          lignes: [
            ["Travail sur écran", "7 heures par jour, 3 salariés", "sièges réglables", "rehausseur, écran à hauteur des yeux, pause visuelle chaque heure", 3, "gérante, Mme Sophie LENOIR"],
            ["Charge de travail de la comptable en clôture", "1 semaine par mois, 1 salariée", "aucune", "charge évaluée par écrit, remplacement pendant les congés, droit à la déconnexion écrit", 3, "gérante, Mme Sophie LENOIR"],
            ["Harcèlement moral, harcèlement sexuel et agissements sexistes", "ensemble du personnel, 22 salariés dont 14 femmes", "aucune", "procédure de signalement affichée en réserve, référent désigné, enquête écrite à tout signalement, formation de l'encadrement", 2, "gérante, Mme Sophie LENOIR"],
            ["Transport de fonds à la banque", "3 fois par semaine, 2 salariés", "aucune", "horaires et trajets variables, montant plafonné, jamais seul, sacoche discrète", 1, "gérante, Mme Sophie LENOIR"],
            ["Électricité et incendie", "permanent, 3 salariés", "extincteurs", "multiprises retirées, vérification périodique, plan d'évacuation à jour, exercice annuel", 3, "gérante, Mme Sophie LENOIR"],
            ["Circulation dans la réserve pour le personnel de bureau", "5 passages par jour, 3 salariés", "aucune", "allée piétonne marquée, chaussures fermées, transpalette arrêté au passage", 2, "responsable réception, M. Antoine ROY"],
          ] },
      ] },

    "services": {
      nom: "SERVICES EXEMPLE SAS", adresse: "10 boulevard Haussmann, 75009 Paris",
      siret: "856 789 012 00051", ville: "Paris", effectif: 31, femmes: 19,
      activite: "conseil et prestations administratives, accueil du public, télétravail deux jours par semaine",
      signataire: "Madame Anne MERCIER, présidente", redacteur: "Madame Camille VIDAL, responsable administrative",
      spst: "SPSTI de Paris, centre Haussmann", designe: "Madame Camille VIDAL, responsable administrative",
      pilote: "Madame Camille VIDAL, responsable administrative",
      evenement: { texte: "décision de passer le télétravail de deux à trois jours par semaine et de réduire les postes fixes au siège (bureaux partagés)", nature: 2, piece: "avenant à la charte de télétravail et plan d'aménagement du 3e étage", unites: [3, 0], risque: "poste à domicile trois jours par semaine, isolement, sur-connexion", ricochet: "bureaux partagés, poste non réglé à chaque changement, bruit" },
      unites: [
        { nom: "Bureaux et écrans", def: "travail administratif et de conseil sur écran, en open space", effectif: 18, site: "siège, 3e étage",
          lignes: [
            ["Troubles musculo-squelettiques et fatigue visuelle, portables sans rehausseur", "7 heures par jour, 18 salariés", "sièges réglables", "rehausseur, clavier et souris séparés sur chaque poste portable, écran perpendiculaire à la fenêtre, réglage du poste à l'arrivée", 2, "responsable administrative, Mme Camille VIDAL"],
            ["Sédentarité", "7 heures assises par jour, 18 salariés", "aucune", "réunions courtes debout, imprimante à distance des postes, consigne de se lever chaque heure, bureau assis-debout sur avis du médecin du travail", 4, "responsable administrative, Mme Camille VIDAL"],
            ["Charge de travail et risques psychosociaux", "permanent, 18 salariés, pics de clôture", "entretien annuel", "charge évaluée par écrit avant toute nouvelle mission, remplacement pendant les congés, droit à la déconnexion écrit et respecté par l'encadrement, interlocuteur nommé", 2, "présidente, Mme Anne MERCIER"],
            ["Harcèlement moral, harcèlement sexuel et agissements sexistes", "ensemble du personnel, 31 salariés dont 19 femmes", "référent du comité désigné", "procédure de signalement affichée, formation de l'encadrement, enquête écrite sous huit jours, sanction prévue au règlement intérieur", 2, "présidente, Mme Anne MERCIER"],
            ["Électricité et départ de feu, multiprises en cascade", "permanent, 18 salariés", "vérification annuelle", "multiprises supprimées et prises murales ajoutées, archives hors des dégagements, appareils personnels contrôlés", 3, "présidente, Mme Anne MERCIER"],
            ["Évacuation des locaux", "permanent, 18 salariés et visiteurs", "plan ancien", "plan à jour à chaque étage, guides désignés par fonction, exercice annuel, visiteurs comptés au rassemblement", 3, "présidente, Mme Anne MERCIER"],
            ["Chute de plain-pied : câbles et cartons dans les circulations", "permanent, 18 salariés", "aucune", "passages de câbles, cartons retirés des circulations, éclairage vérifié", 1, "responsable administrative, Mme Camille VIDAL"],
            ["Bruit de l'open space", "7 heures par jour, 12 salariés", "aucune", "cloisons acoustiques, salle de concentration, appels passés en cabine", 4, "responsable administrative, Mme Camille VIDAL"],
          ] },
        { nom: "Accueil du public", def: "accueil physique et téléphonique, standard", effectif: 2, site: "siège, rez-de-chaussée",
          lignes: [
            ["Charge émotionnelle et incivilité, au comptoir et au téléphone", "10 situations difficiles par semaine, 2 salariées", "aucune", "droit de transférer un appel agressif, phrase de fin d'appel connue de tous, main courante, quart d'heure hors ligne après un appel violent", 2, "responsable administrative, Mme Camille VIDAL"],
            ["Agression physique au comptoir", "1 incident l'an dernier, 2 salariées", "aucune", "bouton d'appel discret relié à un poste occupé, accueil en vue directe de l'entrée, consigne écrite, soutien après incident", 1, "présidente, Mme Anne MERCIER"],
            ["Station assise prolongée et casque en continu", "8 heures par jour, 2 salariées", "siège", "siège réglable et repose-pieds, casque à limiteur de niveau sonore, pauses hors du hall", 3, "responsable administrative, Mme Camille VIDAL"],
            ["Intrusion et vol", "permanent, 2 salariées", "aucune", "badge visiteur et registre d'entrée, aucun sac ni objet de valeur sur le comptoir", 3, "présidente, Mme Anne MERCIER"],
            ["Travail isolé à l'accueil en début et en fin de journée", "1 heure par jour, 2 salariées", "aucune", "second salarié présent à l'ouverture et à la fermeture, ou porte fermée à clé", 2, "présidente, Mme Anne MERCIER"],
            ["Courant d'air du hall (ambiance thermique)", "novembre à mars, 2 salariées", "aucune", "sas d'entrée, poste hors de l'axe de la porte", 6, "présidente, Mme Anne MERCIER"],
          ] },
        { nom: "Déplacements", def: "missions et rendez-vous chez les clients, en voiture et en train", effectif: 6, site: "France entière",
          lignes: [
            ["Risque routier", "2 jours par semaine, 6 salariés, 400 km par semaine", "véhicules de fonction entretenus", "rendez-vous à temps de trajet réaliste, téléphone interdit au volant même en mains libres, pause toutes les deux heures, nuit sur place au-delà de 300 km", 1, "présidente, Mme Anne MERCIER"],
            ["Fatigue et isolement en mission", "3 nuits par mois, 6 salariés", "aucune", "planning connu au bureau, point téléphonique quotidien, hébergement pris en charge, jours de récupération", 2, "présidente, Mme Anne MERCIER"],
            ["Port de matériel : ordinateur, documents, valise", "2 jours par semaine, 6 salariés", "sacoche", "valise à roulettes, matériel allégé, documents envoyés à l'avance", 3, "responsable d'agence, M. Nicolas FAURE"],
            ["Travail sur écran en mobilité, portable sur les genoux", "3 heures par jour, 6 salariés", "aucune", "rehausseur pliable et clavier nomade, temps de saisie limité en train", 3, "responsable d'agence, M. Nicolas FAURE"],
            ["Agression ou conflit chez le client", "2 signalements l'an dernier, 6 salariés", "aucune", "consigne de retrait, rendez-vous sensibles à deux, débriefing", 2, "responsable d'agence, M. Nicolas FAURE"],
            ["Horaires étendus et charge mentale des déplacements", "2 jours par semaine, 6 salariés", "aucune", "plafond d'heures de déplacement par semaine, aucune réunion avant 9 heures le lendemain d'un déplacement", 3, "présidente, Mme Anne MERCIER"],
          ] },
        { nom: "Télétravail", def: "travail au domicile deux jours par semaine", effectif: 12, site: "domicile des salariés",
          lignes: [
            ["Poste de travail à domicile inadapté", "2 jours par semaine, 12 salariés", "écran fourni", "siège et écran fournis ou indemnisés, guide d'aménagement remis, photo du poste à la demande de la personne", 3, "responsable administrative, Mme Camille VIDAL"],
            ["Isolement et déconnexion", "2 jours par semaine, 12 salariés", "charte", "point d'équipe hebdomadaire en présence, plage de déconnexion écrite, contact désigné", 3, "présidente, Mme Anne MERCIER"],
            ["Charge de travail non visible, sur-connexion", "permanent, 12 salariés", "aucune", "suivi de la charge en entretien, horaires de télétravail écrits, aucune réponse attendue hors plage", 3, "présidente, Mme Anne MERCIER"],
            ["Électricité et incendie au domicile", "2 jours par semaine, 12 salariés", "attestation de conformité", "rappel des consignes (multiprises, détecteur de fumée), attestation renouvelée chaque année", 6, "responsable administrative, Mme Camille VIDAL"],
            ["Accident au domicile pendant le télétravail", "2 jours par semaine, 12 salariés", "aucune", "procédure de déclaration d'accident écrite, horaires de télétravail définis", 2, "responsable administrative, Mme Camille VIDAL"],
            ["Interruptions et charge domestique (impact différencié selon le sexe)", "2 jours par semaine, 12 salariés dont 8 femmes", "aucune", "plages de travail garanties, aucune réunion à 8 heures ni après 18 heures, entretien sur la conciliation", 3, "présidente, Mme Anne MERCIER"],
          ] },
        { nom: "Entretien des locaux", def: "nettoyage des bureaux en soirée", effectif: 2, site: "siège, tous étages",
          lignes: [
            ["Produits de nettoyage : projections, mélanges", "3 heures par jour, 2 salariées", "gants", "fiches de données de sécurité au local d'entretien, doses préemballées, produits chlorés et acides séparés, lunettes", 2, "responsable administrative, Mme Camille VIDAL"],
            ["Chute de plain-pied sur sol mouillé", "3 heures par jour, 2 salariées", "panneau sol glissant", "chaussures antidérapantes fournies, lavage par demi-couloir, panneau posé systématiquement", 1, "responsable administrative, Mme Camille VIDAL"],
            ["Manutention : chariot, sacs de déchets, seaux", "3 heures par jour, 2 salariées", "chariot", "chariot à seaux à roulettes, sacs remplis à moitié, aspirateur dorsal léger", 3, "responsable administrative, Mme Camille VIDAL"],
            ["Travail isolé en soirée", "de 18 heures à 21 heures, 2 salariées", "téléphone personnel", "téléphone professionnel avec alerte, appel de fin de poste, éclairage des accès", 2, "présidente, Mme Anne MERCIER"],
            ["Gestes répétitifs et postures", "3 heures par jour, 2 salariées", "aucune", "manches télescopiques, rotation des tâches, formation gestes et postures", 3, "responsable administrative, Mme Camille VIDAL"],
            ["Électricité des appareils de nettoyage", "3 heures par jour, 2 salariées", "aucune", "vérification annuelle des aspirateurs et monobrosses, câbles remplacés dès une entaille", 4, "responsable administrative, Mme Camille VIDAL"],
            ["Horaires décalés et conciliation (impact différencié selon le sexe)", "5 soirs par semaine, 2 salariées", "aucune", "horaires en journée proposés là où c'est possible, planning stable remis quinze jours à l'avance", 3, "présidente, Mme Anne MERCIER"],
          ] },
      ] },
  };

  function secteurDe(ctx) {
    var s = String(((ctx && ctx.profil) || {}).secteur || "").trim().toLowerCase();
    return EXEMPLES[s] ? s : "services";
  }
  /* L'entreprise de l'exemple : celle du profil quand il en donne une, la
     fictive du secteur sinon. Les dates se comptent depuis aujourd'hui. */
  function exempleDe(ctx) {
    var s = secteurDe(ctx), p = (ctx && ctx.profil) || {}, M = EXEMPLES[s];
    var e = effectifDe(ctx), d0 = aujourd(ctx);
    var ville = villeDe(ctx);
    var ex = {
      secteur: s, unites: M.unites, activite: M.activite,
      nom: String(p.denomination || p.entreprise || "").trim() || M.nom,
      adresse: String(p.adresse || "").trim() || M.adresse,
      siret: String(p.siret || "").trim() || M.siret,
      ville: ville === "[ville]" ? M.ville : ville,
      effectif: e.connu ? e.n : M.effectif, femmes: M.femmes,
      signataire: String(p.responsable || "").trim() || M.signataire,
      redacteur: M.redacteur, spst: M.spst, designe: M.designe, pilote: M.pilote,
      d0: d0,
    };
    ex.echeance = function (mois) { return jj(dans(d0, mois * 30)); };
    /* La commission santé, sécurité et conditions de travail de l'exemple :
       obligatoire à partir de trois cents salariés, conventionnelle en deçà. */
    ex.cssct = {
      fondement: ex.effectif >= 300 ? "L. 2315-36, 1°" : "L. 2315-43",
      phrase: ex.effectif >= 300 ? "entreprise de " + ex.effectif + " salariés, au moins trois cents : la commission est obligatoire"
                                 : "entreprise de " + ex.effectif + " salariés, sous trois cents : la commission est mise en place par accord entre l'employeur et le comité",
      etage: "accord entre l'employeur et le comité social et économique (L. 2315-42)",
      membres: [["Mme Aïcha BENALI", "titulaire", "2e"], ["M. Marc TISSIER", "titulaire", "1er"], ["M. Sofiane KHELIF", "suppléant", "1er"]],
      referent: "Mme Julie ROUX, titulaire, référente harcèlement du comité",
      collaborateur: M.pilote,
    };
    /* Les lignes d'une unité, au format de la grille à sept colonnes. */
    ex.grille = function (u) {
      return u.lignes.map(function (l) {
        var expo = l[1].replace(/^ensemble du personnel, \d+ salariés dont \d+ femmes/,
          "ensemble du personnel, " + ex.effectif + " salariés dont " + ex.femmes + " femmes");
        return [u.nom, l[0], expo, l[2], l[3], ex.echeance(l[4]), l[5]];
      });
    };
    /* Les actions les plus pressées, celles à un ou deux mois, pour la
       liste d'actions ou le programme. */
    ex.actions = function (max) {
      var A = [];
      M.unites.forEach(function (u) {
        u.lignes.forEach(function (l) {
          if (l[4] <= 2 && A.length < (max || 8))
            A.push([String(A.length + 1), u.nom, l[0], l[3], ex.echeance(l[4]), l[5]]);
        });
      });
      return A;
    };
    return ex;
  }

  /* Le rappel de la maille, écrit une fois et repris dans les règles des
     documents qui en dépendent. */
  function blocMaille() {
    return [
      "LA MAILLE : L'UNITÉ DE TRAVAIL",
      "",
      "« Cette évaluation comporte un inventaire des risques identifiés dans chaque",
      "unité de travail de l'entreprise ou de l'établissement, y compris ceux liés",
      "aux ambiances thermiques » (R. 4121-1).",
      "",
      "L'unité de travail n'est pas l'organigramme : c'est le regroupement des",
      "situations d'exposition semblables, un atelier, une tournée, un poste, un",
      "site. Un document unique qui reprend les directions de l'entreprise au lieu",
      "des situations de travail ne répond pas à R. 4121-1, parce qu'il ne permet",
      "pas de dire à quoi tel travailleur est exposé.",
      "",
    ];
  }

  /* ══════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-01, LE DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES

     C'est la pièce maîtresse du module, et la plus longue : la loi n'en fixe
     pas la forme, mais elle en fixe le contenu (l'ensemble des risques, la
     traçabilité collective des expositions) et la maille (chaque unité de
     travail). Le document produit ici porte cette structure, avec ses sept
     colonnes, d'abord remplies pour l'entreprise de l'exemple, puis vides pour
     l'entreprise de la fiche : ses risques, l'application ne les connaît pas.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-01", {
    nom: "Le document unique d'évaluation des risques professionnels",
    detail: "Le document rédigé, le socle commun des seize familles de dangers " +
            "unité par unité, les suites, les formalités et le calendrier.",
    /* LE CLASSEUR. Le document unique se remplit dans un tableur, pas dans un
       traitement de texte : une ligne par situation, les colonnes de cotation
       et celles du plan d'action. Le socle commun sort déjà rempli de ses
       seize familles, il n'y a qu'à retrancher et chiffrer. */
    tableur: function (ctx) {
      var p = ctx.profil || {};
      var L = [];
      L.push(["DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS"]);
      L.push([cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE")]);
      L.push(["Établi le " + leJour(aujourd(ctx)) +
              " - articles L. 4121-1 à L. 4121-3-1 et R. 4121-1 à R. 4121-4 du code du travail"]);
      L.push(["SOCLE COMMUN, À ADAPTER IMPÉRATIVEMENT. Seize familles valables pour toute " +
              "entreprise. Écartez ce qui ne vous concerne pas, remplacez les crochets par vos " +
              "chiffres, ajoutez ce qui manque. Recopiez le bloc pour chaque unité de travail."]);
      L.push([]);
      L.push(["Unité de travail", "N°", "Famille de dangers", "Situation : qui, combien, où, quand",
              "Dommages possibles", "Mesures déjà en place", "Probabilité", "Gravité", "Rang",
              "Mesures à prendre", "Conditions d'exécution", "Indicateur de résultat",
              "Coût estimé", "Responsable", "Échéance", "Réalisé le"]);
      SOCLE.forEach(function (f, i) {
        L.push(["[NOM DE L'UNITÉ]", i + 1, f.n, f.sit.join(" · "), f.dom, f.mes.join(" · "),
                f.cote[0], f.cote[1], NOM_RANG[rangDe(f.cote)], "", "", "", "", "", "", ""]);
      });
      return L;
    },
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var s50 = seuil(ctx, 50), s11 = seuil(ctx, 11);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Document unique d'évaluation des risques professionnels",
        "articles L. 4121-1 à L. 4121-3-1 et R. 4121-1 à R. 4121-4 du code du travail");

      /* Le corps du document, écrit une fois : rempli pour l'exemple, à
         crochets pour le document à compléter. */
      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var eff = E ? E.effectif : (effectifDe(ctx).connu ? effectifDe(ctx).n : null);
        var plus50 = E ? E.effectif >= 50 : s50;
        C.push("DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS");
        C.push("");
        C.push(nom.toUpperCase());
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("Version " + X(E, "1", "n° de version") + ", établie le " + X(E, leJour(d0), "DATE D'ÉTABLISSEMENT"));
        C.push("Rédacteur : " + X(E, E && E.redacteur, "nom et qualité") + ". Validation : " + sig + ".");
        C.push("");

        C.push("1. OBJET ET PÉRIMÈTRE");
        C.push("");
        C.push("Le présent document transcrit les résultats de l'évaluation des risques");
        C.push("pour la santé et la sécurité des travailleurs à laquelle l'employeur");
        C.push("procède en application de l'article L. 4121-3 du code du travail");
        C.push("(R. 4121-1). Il répertorie l'ensemble des risques professionnels auxquels");
        C.push("sont exposés les travailleurs et assure la traçabilité collective de ces");
        C.push("expositions (L. 4121-3-1, I).");
        C.push("");
        C.push("Activité : " + X(E, E && E.activite, "ACTIVITÉ DE L'ENTREPRISE") + ".");
        C.push("Périmètre couvert : " + X(E, "l'ensemble des unités de travail listées en 4, un seul établissement",
          "ÉNUMÉRER LES ÉTABLISSEMENTS ET LES SITES COUVERTS") + ".");
        C.push("Effectif : " + (eff != null ? eff + " salariés" : "[EFFECTIF]") +
          (E ? ", dont " + E.femmes + " femmes" : ", dont [nombre] femmes") + ".");
        C.push("");

        C.push("2. CONTRIBUTIONS À L'ÉVALUATION (L. 4121-3)");
        C.push("");
        var contrib = [["Contributeur", "Contribution apportée", "Date"]];
        if (E) {
          C = C.concat(tableau(contrib[0], [
            ["Comité social et économique" + (E.effectif >= 300 ? " et sa commission santé, sécurité et conditions de travail" : ""), "réunion consacrée au projet, observations portées au procès-verbal n° 4", leJour(dans(d0, -12))],
            ["Salarié désigné (L. 4644-1) : " + E.designe, "visites de postes avec le pilote, relecture des grilles", leJour(dans(d0, -20))],
            ["Service de prévention et de santé au travail : " + E.spst, "visite du médecin du travail, fiche d'entreprise du " + leJour(dans(d0, -90)), leJour(dans(d0, -30))],
            ["Chefs d'équipe et salariés de chaque unité", "entretiens par unité, relevé des situations dangereuses", "du " + leJour(dans(d0, -45)) + " au " + leJour(dans(d0, -25))],
          ]));
        } else {
          C = C.concat(tableau(contrib[0], [
            ["Comité social et économique" + (estNon((f.cse || {}).existe) ? " (aucun comité déclaré, sans objet)" : ""), "[réunion, référence du procès-verbal]", "[date]"],
            ["Salarié désigné (L. 4644-1) : [nom, ou « aucun désigné »]", "[ce qu'il a fait]", "[date]"],
            ["Service de prévention et de santé au travail : [nom du service]", "[visite, échange, fiche d'entreprise]", "[date]"],
          ]));
        }

        C.push("3. MÉTHODE RETENUE");
        C.push("");
        if (E) {
          C.push("Chaque risque est coté en gravité (1 bénin à 4 très grave) et en fréquence");
          C.push("(1 rare à 4 permanente) ; le produit fixe l'ordre des actions : 12 et plus,");
          C.push("action immédiate ; 8 à 11, prioritaire ; 4 à 7, à programmer ; en deçà, à");
          C.push("surveiller. La même échelle est appliquée dans toutes les unités. Aucun");
          C.push("texte n'impose cette cotation : c'est le choix de l'entreprise, écrit ici");
          C.push("pour que le document se relise dans dix ans.");
          C.push("");
          C.push("Impact différencié selon le sexe : examiné pour chaque unité et écrit dans");
          C.push("la colonne « exposition » quand il existe (charges identiques quel que soit");
          C.push("le sexe au quai et sur la ligne, exposition aux produits des salariées en");
          C.push("âge de procréer, agissements sexistes, conciliation des horaires).");
        } else {
          C.push("[DÉCRIRE VOTRE MÉTHODE : comment vous appréciez la gravité, la fréquence ou");
          C.push(" la durée d'exposition, et comment vous en déduisez un ordre de priorité.");
          C.push(" Toute échelle convient, pourvu qu'elle soit expliquée et appliquée de la");
          C.push(" même façon partout.]");
          C.push("");
          C.push("Impact différencié selon le sexe : [ÉCRIRE, unité par unité, si l'exposition");
          C.push("diffère selon le sexe des travailleurs, et en quoi].");
        }
        C.push("");

        C.push("4. UNITÉS DE TRAVAIL");
        C.push("");
        var enteteUnites = ["Unité de travail", "Ce qui la définit", "Effectif", "Site"];
        if (E) {
          C = C.concat(tableau(enteteUnites, E.unites.map(function (u) {
            return [u.nom, u.def, String(u.effectif), u.site];
          })));
        } else {
          C = C.concat(tableauVide(enteteUnites, 3));
        }

        C.push("5. INVENTAIRE DES RISQUES, UNITÉ PAR UNITÉ");
        C.push("");
        if (E) {
          E.unites.forEach(function (u) {
            C.push("Unité de travail : " + u.nom + " (" + u.effectif + " salariés, " + u.site + ")");
            C.push("");
            C = C.concat(tableau(GRILLE, E.grille(u)));
          });
        } else {
          /* LE SOCLE COMMUN, PRÉ-ÉCRIT. La grille était vide : trois lignes à
             remplir devant un tableau de sept colonnes. On donne désormais
             les seize familles rédigées, avec leurs situations types, les
             mesures courantes et une cotation proposée, pour que le client
             ait à retrancher plutôt qu'à inventer. */
          C.push("SOCLE COMMUN, À ADAPTER IMPÉRATIVEMENT");
          C.push("");
          C.push("Les seize familles ci-dessous valent pour n'importe quelle entreprise,");
          C.push("quel que soit son secteur : c'est le plus large qu'on puisse écrire sans");
          C.push("connaître vos postes. Tout y est rédigé, situations types et mesures");
          C.push("courantes, pour que vous ayez à retrancher plutôt qu'à inventer.");
          C.push("Écartez ce qui ne vous concerne pas, remplacez les crochets par vos");
          C.push("chiffres, ajoutez ce qui manque. Un document unique recopié tel quel");
          C.push("n'évalue rien et ne vous protégera pas.");
          C.push("");
          C.push("Recopiez ces seize familles pour CHAQUE unité de travail : l'inventaire");
          C.push("est dû unité par unité (R. 4121-1), et la même famille n'a pas la même");
          C.push("cotation à l'atelier et au bureau.");
          C.push("");
          C.push("Unité de travail : [NOM DE L'UNITÉ, effectif, site]");
          C.push("");
          SOCLE.forEach(function (f, i) {
            C.push("Situation " + (i + 1) + " - " + f.n);
            C.push("");
            C.push("Les situations, à confirmer et à chiffrer :");
            C.push("");
            f.sit.forEach(function (x) { C.push("  - " + x); });
            C.push("");
            C.push("Dommages possibles : " + f.dom);
            C.push("");
            C.push("Mesures déjà en place, à cocher et à dater :");
            C.push("");
            f.mes.forEach(function (x) { C.push("  - [ ] " + x); });
            C.push("  - [ ] Autres mesures : [préciser]");
            C.push("");
            C.push("Cotation proposée, à revoir sur vos chiffres : probabilité " + f.cote[0] +
              ", gravité " + f.cote[1] + ", soit un risque de rang " + NOM_RANG[rangDe(f.cote)] + ".");
            C.push("");
            C.push("Mesures à prendre : [décrire]   -   Échéance : [DATE]   -   Responsable : [NOM]");
            C.push("");
            C.push("");
          });
          C.push("[Recopier ce bloc pour chaque unité de travail. N'oubliez ni les");
          C.push(" ambiances thermiques (R. 4121-1), ni le harcèlement moral, le harcèlement");
          C.push(" sexuel et les agissements sexistes (L. 4121-2, 7°).]");
          C.push("");
        }

        C.push("6. SUITES DE L'ÉVALUATION (L. 4121-3-1, III)");
        C.push("");
        if (plus50 === true) {
          C.push("L'effectif est d'au moins cinquante salariés : les mesures à prendre");
          C.push("alimentent le programme annuel de prévention, établi à part (document");
          C.push("SST-CTL-DUE-05) et joint au présent document. Les actions les plus");
          C.push("pressées sont rappelées ci-dessous.");
        } else if (plus50 === false) {
          C.push("L'effectif est inférieur à cinquante salariés : la liste des actions de");
          C.push("prévention et de protection est consignée ici même, et reprise à chaque");
          C.push("mise à jour.");
        } else {
          C.push("[Selon l'effectif : à cinquante salariés et au-delà, programme annuel de");
          C.push(" prévention établi à part ; en deçà, liste des actions consignée ici.]");
        }
        C.push("");
        var enteteActions = ["N°", "Unité de travail", "Risque visé", "Action de prévention ou de protection", "Échéance", "Responsable"];
        C = C.concat(E ? tableau(enteteActions, E.actions(8)) : tableauVide(enteteActions, 3));

        C.push("7. MISE À JOUR (R. 4121-2)");
        C.push("");
        var onze = E ? E.effectif >= 11 : s11;
        if (onze === true) {
          C.push("Le document est mis à jour au moins chaque année, la prochaine fois au plus");
          C.push("tard le " + X(E, leJour(dans(d0, 365)), "date, un an après la version") + ", et sans attendre lors de toute");
          C.push("décision d'aménagement important ou de toute information nouvelle");
          C.push("intéressant l'évaluation d'un risque.");
        } else if (onze === false) {
          C.push("L'effectif est inférieur à onze salariés : la mise à jour peut être moins");
          C.push("fréquente qu'annuelle, sous réserve d'un niveau équivalent de protection,");
          C.push("garanti par : " + X(E, "une relecture des grilles à chaque nouvel embauché et à chaque changement de matériel", "EXPOSER CE QUI GARANTIT LE NIVEAU ÉQUIVALENT DE PROTECTION") + ".");
          C.push("Elle reste due lors de tout aménagement important et de toute information");
          C.push("nouvelle.");
        } else {
          C.push("[À partir de onze salariés, mise à jour au moins annuelle ; en deçà, elle");
          C.push(" peut être moins fréquente sous réserve d'un niveau équivalent de");
          C.push(" protection à écrire ici. Dans tous les cas, mise à jour à chaque");
          C.push(" aménagement important et à chaque information nouvelle.]");
        }
        C.push("");
        var enteteVersions = ["Version", "Établie le", "Motif (R. 4121-2)", "Comité consulté le", "Transmise au service le", "Archivée à"];
        C = C.concat(E ? tableau(enteteVersions, [
          ["1", leJour(d0), "première évaluation", leJour(dans(d0, -12)), leJour(dans(d0, 3)), "serveur, dossier « prévention », et classeur du bureau du pilote"],
        ]) : tableauVide(enteteVersions, 3));

        C.push("8. CONSERVATION ET ACCÈS (L. 4121-3-1, V ; R. 4121-4)");
        C.push("");
        C.push("Chaque version est conservée quarante ans au moins à compter de son");
        C.push("élaboration et tenue à la disposition des travailleurs, des anciens");
        C.push("travailleurs et des personnes et instances qui y ont accès.");
        C.push("Version en vigueur conservée à : " + X(E, "serveur de l'entreprise, dossier « prévention », et classeur papier au bureau du pilote", "LIEU ET SUPPORT") + ".");
        C.push("Versions antérieures conservées à : " + X(E, "même dossier, sous-dossier « versions », jamais écrasées", "LIEU ET SUPPORT") + ".");
        C.push("Demande d'accès à adresser à : " + X(E, E && E.pilote, "NOM ET FONCTION") + ".");
        C.push("L'avis d'accès est affiché " + X(E, "à l'entrée des vestiaires, au même emplacement que le règlement intérieur", "LIEU, au même emplacement que le règlement intérieur s'il en existe un") + ".");
        C.push("");

        C.push("9. TRANSMISSION AU SERVICE DE PRÉVENTION ET DE SANTÉ AU TRAVAIL (L. 4121-3-1, VI)");
        C.push("");
        C.push("Le document est transmis à chaque mise à jour à " + X(E, E && E.spst, "NOM DU SERVICE") +
          ", la présente version le " + X(E, leJour(dans(d0, 3)), "date") + ".");
        C.push("");
        C.push("Fait à " + (E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(d0), "DATE"));
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE JOINTE, NOTE DE LANCEMENT DE L'ÉVALUATION (interne)");
        C.push("");
        C.push(nom + ", note du " + X(E, leJour(dans(d0, -60)), "date"));
        C.push("Objet : évaluation des risques professionnels, organisation des travaux");
        C.push("");
        C.push("1. Périmètre : " + X(E, "l'ensemble de l'entreprise, un seul établissement", "établissements et sites") + ".");
        C.push("2. Unités de travail retenues : " + X(E, E && E.unites.map(function (u) { return u.nom.toLowerCase(); }).join(", "), "liste") + ".");
        C.push("3. Pilote : " + X(E, E && E.pilote, "nom et fonction") + ". Contributeurs : " +
          X(E, "les chefs d'équipe de chaque unité, " + (E && E.designe) + " (salarié désigné), " + (E && E.spst),
            "encadrement de proximité, salarié désigné s'il en existe, service de prévention et de santé au travail") + ".");
        C.push("4. Méthode d'appréciation : " + X(E, "gravité 1 à 4, fréquence 1 à 4, priorité au produit", "voir la section 3") + ".");
        C.push("5. Calendrier : visites de postes du " + X(E, leJour(dans(d0, -45)), "date") + " au " + X(E, leJour(dans(d0, -25)), "date") +
          " ; rédaction pour le " + X(E, leJour(dans(d0, -15)), "date") + " ; consultation du comité le " + X(E, leJour(dans(d0, -12)), "date") +
          " ; version datée le " + X(E, leJour(d0), "date") + ".");
        C.push("6. Le comité social et économique et sa commission, s'ils existent,");
        C.push("   apportent leur contribution (L. 4121-3, 1°) et le comité est consulté");
        C.push("   sur le document et ses mises à jour.");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      /* ---- l'exemple ---- */
      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");

      /* ---- le document à compléter ---- */
      L.push("VOTRE DOCUMENT UNIQUE, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Les données de votre fiche sont déjà");
      L.push("portées ; chaque crochet est un travail à faire, pas une case à cocher.");
      L.push("Ne laissez aucun crochet dans le document que vous datez et signez.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous lancez l'évaluation (note ci-dessus)");
      L.push("et vous arrêtez la liste des unités de travail.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ, visites de postes et recueil des");
      L.push("contributions de L. 4121-3 achevés : comité et commission s'ils existent,");
      L.push("salarié désigné s'il en existe, service de prévention et de santé au");
      L.push("travail.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 60)) + " environ, projet de document unique rédigé,");
      L.push("unité par unité, avec les sept colonnes remplies.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 75)) + " environ, consultation du comité social et");
      L.push("économique sur le document (L. 4121-3, 1°) : l'ordre du jour et le");
      L.push("procès-verbal sont produits à part (SST-CTL-DUE-07).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 90)) + " au plus tard, version datée et signée,");
      L.push("avis d'accès affiché (R. 4121-4), document transmis au service de");
      L.push("prévention et de santé au travail (L. 4121-3-1, VI), et suites établies :");
      L.push("programme annuel de prévention ou liste d'actions (L. 4121-3-1, III).");
      L.push("");
      if (s11 !== false) {
        L.push("Puis, dans un an, au " + leJour(dans(d0, 365)) + " si la version est");
        L.push("datée d'aujourd'hui, la mise à jour annuelle de R. 4121-2, 1°, dans les");
        L.push("entreprises d'au moins onze salariés.");
        L.push("");
      }
      if (estISO(du.dateDerniereMaj)) {
        L.push("Votre dossier porte une version datée du " + jour(du.dateDerniereMaj) +
          " : l'année de R. 4121-2, 1°, échoit le " + jour(moisApres(du.dateDerniereMaj, 12)) + ".");
        L.push("");
      }
      L.push("Ces durées sont indicatives : elles disent le temps qu'une évaluation");
      L.push("sérieuse demande, non un délai légal. Aucun texte lu ne fixe de délai");
      L.push("pour établir un premier document unique, il est dû, et il l'est déjà.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst"]));

      /* ---- les règles ---- */
      L.push("LES RÈGLES");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE AUJOURD'HUI");
      L.push("");
      L.push(ligneEffectif(ctx));
      L.push("  - document unique existant : " + etat(du.existe, "oui", "NON, c'est l'objet de ce document"));
      L.push("  - inventaire par unité de travail : " + etat(du.unitesTravail, "oui", "NON"));
      L.push("  - dernière mise à jour : " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  - versions successives conservées : " + etat(du.versionsConservees, "oui", "NON"));
      L.push("  - avis d'accès affiché : " + etat(du.avisAffiche, "oui", "NON"));
      L.push("  - comité consulté : " + etat(du.consultationCSE, "oui", "NON"));
      L.push("  - transmis au service de prévention et de santé au travail : " +
        etat(du.transmisSPST, "oui", "NON"));
      L.push("");
      L.push("Le document unique est dû par tout employeur, sans seuil d'effectif. Le");
      L.push("document unique d'un autre ne vaut rien pour vous : un modèle de branche");
      L.push("recopié sans être repris n'est pas une transcription de votre évaluation.");
      L.push("L'exemple ci-dessus montre la forme ; vos risques sont les vôtres.");
      L.push("");

      L.push("L'OBLIGATION QUI COMMANDE L'ÉVALUATION");
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
      L.push("pour chaque unité, si l'exposition diffère selon le sexe des travailleurs,");
      L.push("et d'écrire la réponse.");
      L.push("");

      L.push("LES NEUF PRINCIPES GÉNÉRAUX DE PRÉVENTION");
      L.push("(L. 4121-2, ils commandent l'ORDRE des mesures, non leur seule liste)");
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
      L.push("harcèlement et d'agissements sexistes s'inscrivent dans les grilles,");
      L.push("comme les autres. Un document unique muet sur ces risques est incomplet au");
      L.push("regard de L. 4121-2, 7°. Le 8° en a une autre : dans la colonne « mesures");
      L.push("à prendre », une protection individuelle ne se justifie qu'après avoir");
      L.push("écrit pourquoi la protection collective ne suffit pas.");
      L.push("");
      L = L.concat(blocRenvoi("L. 1142-2-1",
        "est nommé par L. 4121-2, 7°, comme définissant les agissements sexistes"));

      L.push("LES CONTRIBUTIONS APPELÉES À L'ÉVALUATION");
      L.push("");
      L.push("« Apportent leur contribution à l'évaluation des risques professionnels");
      L.push("dans l'entreprise : 1° Dans le cadre du dialogue social dans l'entreprise,");
      L.push("le comité social et économique et sa commission santé, sécurité et");
      L.push("conditions de travail, s'ils existent, en application du 1° de l'article");
      L.push("L. 2312-9. Le comité social et économique est consulté sur le document");
      L.push("unique d'évaluation des risques professionnels et sur ses mises à jour ;");
      L.push("2° Le ou les salariés mentionnés au premier alinéa du I de l'article");
      L.push("L. 4644-1, s'ils ont été désignés ; 3° Le service de prévention et de");
      L.push("santé au travail auquel l'employeur adhère » (L. 4121-3).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2312-9 et L. 4644-1",
        "sont nommés par L. 4121-3 pour désigner l'attribution du comité et le salarié " +
        "désigné pour s'occuper des activités de protection et de prévention"));
      L = L.concat(blocMaille());

      L.push("LES SEPT COLONNES");
      L.push("");
      L.push("La loi ne fixe pas la forme du document, mais elle en fixe le contenu.");
      L.push("L'exposition (qui, combien de travailleurs, à quelle fréquence, pendant");
      L.push("combien de temps) est la colonne qui assure la « traçabilité collective des");
      L.push("expositions » de L. 4121-3-1, I, et celle que l'on relira dans trente ans ;");
      L.push("c'est là que se note l'impact différencié selon le sexe (L. 4121-3). Les");
      L.push("mesures à prendre alimentent le programme annuel ou la liste d'actions");
      L.push("(L. 4121-3-1, III). Deux risques sont nommés par un texte lu : les");
      L.push("ambiances thermiques (R. 4121-1), le harcèlement et les agissements");
      L.push("sexistes (L. 4121-2, 7°, détaillés dans SST-CTL-HAR-04).");
      L.push("");

      L.push("LES SUITES DE L'ÉVALUATION");
      L.push("");
      L.push("« Les résultats de cette évaluation débouchent : 1° Pour les entreprises");
      L.push("dont l'effectif est supérieur ou égal à cinquante salariés, sur un");
      L.push("programme annuel de prévention des risques professionnels et");
      L.push("d'amélioration des conditions de travail [...] ; 2° Pour les entreprises");
      L.push("dont l'effectif est inférieur à cinquante salariés, sur la définition");
      L.push("d'actions de prévention des risques et de protection des salariés. La");
      L.push("liste de ces actions est consignée dans le document unique d'évaluation");
      L.push("des risques professionnels et ses mises à jour » (L. 4121-3-1, III).");
      L.push("");
      if (s50 === true) {
        L.push("Effectif d'au moins cinquante salariés : c'est le programme annuel de");
        L.push("prévention qui est dû. Il est produit à part (SST-CTL-DUE-05) et se joint");
        L.push("au présent document.");
      } else if (s50 === false) {
        L.push("Effectif inférieur à cinquante salariés : c'est la liste des actions de");
        L.push("prévention et de protection qui est due, et elle se consigne dans ce");
        L.push("document, non dans une pièce séparée. Elle est produite à part");
        L.push("(SST-CTL-DUE-05) pour être recopiée ici.");
      } else {
        L.push("L'effectif n'étant pas renseigné, la branche applicable n'est pas");
        L.push("tranchée ici : à cinquante salariés et au-delà, c'est le programme annuel");
        L.push("de prévention ; en deçà, c'est la liste d'actions consignée dans ce");
        L.push("document même. Portez votre effectif et suivez la branche.");
      }
      L.push("");

      L.push("LA MISE À JOUR");
      L.push("");
      L.push("La mise à jour est réalisée (R. 4121-2) : 1° Au moins chaque année dans les");
      L.push("entreprises d'au moins onze salariés ; 2° Lors de toute décision");
      L.push("d'aménagement important modifiant les conditions de santé et de sécurité");
      L.push("ou les conditions de travail ; 3° Lorsqu'une information supplémentaire");
      L.push("intéressant l'évaluation d'un risque est portée à la connaissance de");
      L.push("l'employeur.");
      L.push("");
      if (s11 === true) {
        L.push("Effectif d'au moins onze salariés : la mise à jour annuelle du 1° est due.");
      } else if (s11 === false) {
        L.push("Effectif inférieur à onze salariés : la mise à jour « peut être moins");
        L.push("fréquente [...] sous réserve que soit garanti un niveau équivalent de");
        L.push("protection de la santé et de la sécurité des travailleurs » (L. 4121-3,");
        L.push("dernier alinéa). Cette garantie ne se présume pas : écrivez-la.");
      } else {
        L.push("L'effectif n'étant pas renseigné, la périodicité n'est pas tranchée ici :");
        L.push("à partir de onze salariés la mise à jour est au moins annuelle ; en deçà");
        L.push("elle peut être moins fréquente, sous réserve d'un niveau équivalent de");
        L.push("protection à écrire (L. 4121-3, dernier alinéa).");
      }
      L.push("Les cas 2° et 3° ne suivent aucun calendrier : ils suivent l'événement.");
      L.push("");

      L.push("CONSERVATION, ACCÈS, TRANSMISSION");
      L.push("");
      L.push("Le document unique, « dans ses versions successives, est conservé par");
      L.push("l'employeur et tenu à la disposition des travailleurs, des anciens");
      L.push("travailleurs ainsi que de toute personne ou instance pouvant justifier");
      L.push("d'un intérêt à y avoir accès. La durée, qui ne peut être inférieure à");
      L.push("quarante ans, et les modalités de conservation et de mise à disposition");
      L.push("[...] sont fixées par décret » (L. 4121-3-1, V, A). R. 4121-4 fixe cette");
      L.push("durée à quarante ans à compter de l'élaboration de chaque version, et");
      L.push("impose d'afficher un avis indiquant les modalités d'accès des travailleurs,");
      L.push("au même emplacement que le règlement intérieur là où il en existe un");
      L.push("(R. 4121-4, dernier alinéa ; avis produit par SST-CTL-DUE-06).");
      L.push("");
      L.push("« Le document unique d'évaluation des risques professionnels est transmis");
      L.push("par l'employeur à chaque mise à jour au service de prévention et de santé");
      L.push("au travail auquel il adhère » (L. 4121-3-1, VI ; bordereau produit par");
      L.push("SST-CTL-DUE-08). Le V, B, de L. 4121-3-1 prévoit en outre un dépôt");
      L.push("dématérialisé sur un portail numérique, applicable « à compter du 1er");
      L.push("juillet 2023, aux entreprises dont l'effectif est supérieur ou égal à cent");
      L.push("cinquante salariés » et, « à compter de dates fixées par décret [...] et au");
      L.push("plus tard à compter du 1er juillet 2024 », aux autres ; jusqu'à l'entrée en");
      L.push("vigueur de ce dépôt, « l'employeur conserve les versions successives du");
      L.push("document unique au sein de l'entreprise sous la forme d'un document papier");
      L.push("ou dématérialisé » (R. 4121-4). L'application ne sait pas où en est le");
      L.push("déploiement de ce portail : vérifiez-le, et conservez en tout état de cause");
      L.push("vos versions dans l'entreprise.");

      return L.concat(pied(
        "L. 4121-1, L. 4121-2, L. 4121-3, L. 4121-3-1, R. 4121-1, R. 4121-2, R. 4121-4, R. 4741-1",
        ["L'ABSENCE DE TRANSCRIPTION EST PUNIE. « Le fait de ne pas transcrire ou de",
         "ne pas mettre à jour les résultats de l'évaluation des risques, dans les",
         "conditions prévues aux articles R. 4121-1 et R. 4121-2, est puni de l'amende",
         "prévue pour les contraventions de la cinquième classe » (R. 4741-1). Ce",
         "texte, et lui seul, atteint le document unique : l'amende de L. 4741-1 vise",
         "pour le livre Ier de la quatrième partie les « Titres Ier, III et IV », et",
         "le titre II, celui des principes généraux de prévention où vivent",
         "L. 4121-1 à L. 4121-3-1, n'y figure pas."])).join("\n");
    },
  });

  /* LES TROIS ONGLETS, SUR LE MODÈLE DU RÈGLEMENT INTÉRIEUR ET DE LA BASE.
     Le document à remplir, les formalités une par une, le droit. Le texte
     produit contient deux fois les mêmes titres de section, une fois pour
     l'exemple et une fois pour le document réel : on coupe donc d'abord
     l'exemple, et l'on découpe ce qui reste. */
  function coupeSst(L, debut, fin) {
    var a = -1, b = L.length;
    for (var i = 0; i < L.length; i++) if (L[i].indexOf(debut) === 0) { a = i; break; }
    if (a < 0) return [];
    if (fin) for (var j = a + 1; j < L.length; j++) if (L[j].indexOf(fin) === 0) { b = j; break; }
    return L.slice(a, b);
  }
  DP.pour("SST-CTL-DUE-01").parties = function (ctx) {
    var L = DP.pour("SST-CTL-DUE-01").produire(ctx).split("\n");
    var coupure = -1;
    for (var i = 0; i < L.length; i++)
      if (L[i].indexOf("VOTRE DOCUMENT UNIQUE, À COMPLÉTER") === 0) { coupure = i; break; }
    var exemple = coupure > 0 ? L.slice(0, coupure) : [];
    var reste = coupure > 0 ? L.slice(coupure) : L;

    var form = [
      { cle: "s6", nom: "6 Les suites", texte: coupeSst(reste, "6. SUITES", "7. MISE À JOUR").join("\n") },
      { cle: "s7", nom: "7 Mise à jour", texte: coupeSst(reste, "7. MISE À JOUR", "8. CONSERVATION").join("\n") },
      { cle: "s8", nom: "8 Conservation", texte: coupeSst(reste, "8. CONSERVATION", "9. TRANSMISSION").join("\n") },
      { cle: "s9", nom: "9 Transmission", texte: coupeSst(reste, "9. TRANSMISSION", "VOTRE CALENDRIER").join("\n") },
      { cle: "cal", nom: "Le calendrier", texte: coupeSst(reste, "VOTRE CALENDRIER", "LES RÈGLES").join("\n") },
    ].filter(function (x) { return x.texte.trim() !== ""; });
    var droit = coupeSst(reste, "LES RÈGLES", null).join("\n");

    /* PAS DE SOUS-BOUTONS SUR LE DOCUMENT. Ils y avaient été posés, et le
       Word n'emportait plus que le morceau ouvert : l'en-tête sans
       l'inventaire, c'est-à-dire tout sauf un document unique. Défaut relevé
       le 12 septembre 2026 sur le fichier téléchargé. L'onglet rend donc le
       document entier, sections 1 à 5, socle compris, et l'exemple vient
       après lui, comme dans le règlement intérieur. */
    var doc = coupeSst(reste, "VOTRE DOCUMENT UNIQUE", "6. SUITES")
      .concat([""], exemple);
    return [
      { cle: "document", nom: "Le document", texte: doc.join("\n") },
      { cle: "formalites", nom: "Formalités",
        texte: coupeSst(reste, "6. SUITES", "LES RÈGLES").join("\n"), sous: form },
      { cle: "droit", nom: "Le droit", texte: droit },
    ];
  };


  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-02, L'INVENTAIRE PAR UNITÉ DE TRAVAIL

     Le document unique existe, mais sans maille. Ce n'est pas le document
     entier qu'il faut refaire : c'est la découpe, et l'inventaire qu'elle
     commande.
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-02", {
    nom: "L'inventaire des risques par unité de travail",
    detail: "La découpe des unités, la grille à recopier pour chacune, la note " +
            "de reprise du document unique et le calendrier.",
    /* LE TABLEUR, l'inventaire des risques est un tableau, pas une lettre.
       Le client le remplit dans Excel, unité de travail par unité de travail.
       Chaque ligne porte son exemple, pour qu'il voie ce qu'on attend avant
       d'effacer et de mettre les siens. Demande du 2 septembre 2026. */
    tableur: function (ctx) {
      var p = ctx.profil || {}, f = ctx.fiche || {}, du = f.duerp || {};
      var unites = (du.unitesTravail && du.unitesTravail.length ? du.unitesTravail : null);
      var L = [];
      L.push(["DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS, INVENTAIRE PAR UNITÉ DE TRAVAIL"]);
      L.push([cro(p.denomination || p.entreprise, "DÉNOMINATION SOCIALE")]);
      L.push(["Établi le " + leJour(ctx.aujourdhui) + ", articles L. 4121-3 et R. 4121-1 du code du travail"]);
      L.push([]);
      L.push(["MODE D'EMPLOI : une ligne par risque et par unité de travail. Les deux premières lignes " +
              "sont des exemples : effacez-les et portez les vôtres. La cotation gravité x fréquence " +
              "n'est imposée par aucun texte, elle sert à ordonner les actions, gardez celle que vous " +
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
      L.push(["RAPPEL, Le document unique transcrit les résultats de l'évaluation des risques et " +
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
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Inventaire des risques par unité de travail, annexe au document unique",
        "article R. 4121-1 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        C.push("INVENTAIRE DES RISQUES PAR UNITÉ DE TRAVAIL");
        C.push("Annexe au document unique d'évaluation des risques professionnels");
        C.push("");
        C.push(nom.toUpperCase());
        C.push("Document unique, version " + X(E, "2", "n°") + " du " + X(E, leJour(d0), "DATE DE LA VERSION") +
          ". Inventaire établi par " + X(E, E && E.pilote, "nom et fonction") + ".");
        C.push("");

        C.push("1. LES UNITÉS DE TRAVAIL RETENUES");
        C.push("");
        C.push("Chaque unité regroupe les salariés exposés aux mêmes situations. Personne");
        C.push("n'est laissé dehors : intérimaires, apprentis, salariés en déplacement,");
        C.push("télétravailleurs et travailleurs isolés sont rattachés à une unité.");
        C.push("");
        var enteteUnites = ["Unité de travail", "Ce qui la définit", "Effectif", "Site"];
        if (E) {
          C = C.concat(tableau(enteteUnites, E.unites.map(function (u) {
            return [u.nom, u.def, String(u.effectif), u.site];
          })));
        } else {
          C = C.concat(tableauVide(enteteUnites, 3));
        }

        C.push("2. LA GRILLE, UNITÉ PAR UNITÉ");
        C.push("");
        C.push("Les sept colonnes sont celles du document unique : la même grille partout,");
        C.push("sans quoi les lignes ne se recoupent pas d'une unité à l'autre.");
        C.push("");
        if (E) {
          E.unites.forEach(function (u) {
            C.push("Unité de travail : " + u.nom + " (" + u.effectif + " salariés, " + u.site + ")");
            C.push("");
            C = C.concat(tableau(GRILLE, E.grille(u)));
          });
        } else {
          C.push("Unité de travail : [NOM DE L'UNITÉ, effectif, site]");
          C.push("");
          C = C.concat(tableauVide(GRILLE, 3));
          C.push("[Recopier la grille pour chaque unité de travail.]");
          C.push("");
        }

        C.push("3. CE QUE L'INVENTAIRE N'OUBLIE PAS");
        C.push("");
        C.push("Ambiances thermiques (R. 4121-1) : " + X(E, "traitées dans chaque unité exposée au chaud ou au froid, voir les lignes « ambiance thermique »",
          "renseigner les unités concernées, ou écrire pourquoi aucune ne l'est") + ".");
        C.push("Impact différencié selon le sexe (L. 4121-3) : " + X(E, "écrit dans la colonne « exposition » là où il existe, et examiné pour chaque unité",
          "écrire, unité par unité, ce qui diffère selon le sexe") + ".");
        C.push("Harcèlement moral, harcèlement sexuel et agissements sexistes (L. 4121-2, 7°) : " +
          X(E, "une ligne dans l'unité des bureaux, pour l'ensemble du personnel, et des lignes propres aux unités exposées à la clientèle",
            "une ligne au moins, pour l'ensemble du personnel") + ".");
        C.push("");
        C.push("Fait à " + (E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(d0), "DATE"));
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE, NOTE DE REPRISE DU DOCUMENT UNIQUE (interne)");
        C.push("");
        C.push(nom + ", note du " + X(E, leJour(dans(d0, -35)), "date"));
        C.push("Objet : reprise du document unique, inventaire par unité de travail");
        C.push("");
        C.push("1. Constat : le document unique en vigueur, version du " +
          (E ? leJour(dans(d0, -400)) : jour(du.dateDerniereMaj, "date")) + ",");
        C.push("   ne comporte pas d'inventaire des risques identifiés dans chaque unité");
        C.push("   de travail, comme R. 4121-1 l'impose.");
        C.push("2. Ce qui est repris : la découpe en unités de travail et l'inventaire");
        C.push("   qu'elle commande. Le reste du document n'est pas réécrit.");
        C.push("3. Pilote : " + X(E, E && E.pilote, "nom et fonction") + ". Contributeurs : " +
          X(E, "les chefs d'équipe de chaque unité, " + (E && E.designe) + " (salarié désigné), " + (E && E.spst),
            "encadrement de proximité, salarié désigné s'il en existe, service de prévention et de santé au travail") + ".");
        C.push("4. La version reprise sera datée sans écraser la précédente");
        C.push("   (L. 4121-3-1, V), soumise au comité (L. 4121-3, 1°) et transmise au");
        C.push("   service de prévention et de santé au travail (L. 4121-3-1, VI).");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");

      L.push("VOTRE INVENTAIRE, À COMPLÉTER");
      L.push("");
      L.push("Même structure que l'exemple. Trois questions avant de remplir la première");
      L.push("grille : qui est exposé aux mêmes choses ? le découpage laisse-t-il");
      L.push("quelqu'un dehors ? se tiendra-t-il dans le temps, puisqu'il sera comparé aux");
      L.push("versions antérieures pendant quarante ans ?");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous arrêtez la liste des unités de");
      L.push("travail et vous en faites valider la découpe.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ, visites et entretiens faits,");
      L.push("grilles remplies unité par unité.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 35)) + " environ, inventaire réintégré au document");
      L.push("unique, nouvelle version datée, version précédente conservée.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 45)) + " au plus tard, consultation du comité");
      L.push("(L. 4121-3, 1°) et transmission au service de prévention et de santé au");
      L.push("travail (L. 4121-3-1, VI).");
      L.push("");
      L.push("Ces durées sont indicatives : aucun texte lu ne fixe de délai pour");
      L.push("reprendre la maille d'un document unique. Le manquement, lui, court tant");
      L.push("qu'elle manque.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("  - document unique existant : " + etat(du.existe, "oui", "NON"));
      L.push("  - inventaire par unité de travail : " +
        etat(du.unitesTravail, "oui", "NON, c'est l'objet de ce document"));
      L.push("  - dernière version : " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  - " + ligneEffectif(ctx));
      L.push("");
      if (estNon(du.existe)) {
        L.push("ATTENTION, le dossier indique qu'il n'existe pas de document unique. Il");
        L.push("n'y a alors pas de maille à corriger : c'est le document lui-même qu'il");
        L.push("faut établir, et l'inventaire ci-dessus en fera partie. Servez-vous du");
        L.push("document produit pour SST-CTL-DUE-01, qui porte la charpente entière.");
        L.push("");
      }
      L = L.concat(blocMaille());
      L.push("COMMENT DÉCOUPER");
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
      L.push("CE QUE R. 4121-1 ET L. 4121-3 IMPOSENT DE NE PAS OUBLIER");
      L.push("");
      L.push("  - les AMBIANCES THERMIQUES : R. 4121-1 les vise expressément, dans");
      L.push("    l'énumération même de l'inventaire. Chaleur, froid, écarts, travail en");
      L.push("    extérieur, chambres froides, cabines, ateliers non chauffés.");
      L.push("  - l'IMPACT DIFFÉRENCIÉ SELON LE SEXE : « Cette évaluation des risques");
      L.push("    tient compte de l'impact différencié de l'exposition au risque en");
      L.push("    fonction du sexe » (L. 4121-3). La colonne « exposition » doit porter");
      L.push("    la réponse, unité par unité.");
      L.push("  - les RISQUES DE HARCÈLEMENT ET LES AGISSEMENTS SEXISTES : la");
      L.push("    planification de la prévention les intègre « dans un ensemble");
      L.push("    cohérent » (L. 4121-2, 7°).");

      return L.concat(pied("R. 4121-1, L. 4121-2, L. 4121-3, L. 4121-3-1, R. 4121-4, R. 4741-1",
        ["R. 4741-1 punit de l'amende prévue pour les contraventions de la cinquième",
         "classe le fait de ne pas transcrire les résultats de l'évaluation « dans les",
         "conditions prévues aux articles R. 4121-1 et R. 4121-2 », et l'inventaire",
         "par unité de travail est l'une de ces conditions."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-03, LA MISE À JOUR ANNUELLE ET LA TRAÇABILITÉ DES VERSIONS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-03", {
    nom: "La note de mise à jour du document unique et le registre des versions",
    detail: "La note de mise à jour datée, le registre de traçabilité des " +
            "versions, la révision des suites et le calendrier calculé.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx), iso0 = isoDe(d0);
      var s11 = seuil(ctx, 11), s50 = seuil(ctx, 50);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Mise à jour du document unique, note et registre des versions",
        "articles R. 4121-2 et L. 4121-3-1, V, du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var plus50 = E ? E.effectif >= 50 : s50;
        var u0 = E ? E.unites[0] : null, u1 = E ? E.unites[1] : null;
        C.push("PIÈCE 1, NOTE DE MISE À JOUR");
        C.push("");
        C.push(nom.toUpperCase());
        C.push("DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS");
        C.push("Note de mise à jour, version " + X(E, "2", "n° de la nouvelle version") +
          ", établie le " + X(E, leJour(d0), "DATE DE LA NOUVELLE VERSION"));
        C.push("");
        C.push("1. VERSION REMPLACÉE");
        C.push("   Version " + X(E, "1", "n°") + ", établie le " +
          (E ? leJour(dans(d0, -365)) : jour(du.dateDerniereMaj, "date")) + ". Elle est conservée et");
        C.push("   reste consultable : les versions successives sont conservées pendant");
        C.push("   quarante ans au moins à compter de leur élaboration (L. 4121-3-1, V ;");
        C.push("   R. 4121-4). Une mise à jour n'écrase jamais la version précédente.");
        C.push("");
        C.push("2. FONDEMENT DE LA MISE À JOUR (cocher tous les cas applicables)");
        C.push("   " + X(E, "[x]", "[ ]") + " périodicité annuelle (R. 4121-2, 1°)");
        C.push("   " + X(E, "[ ]", "[ ]") + " décision d'aménagement important (R. 4121-2, 2°)");
        C.push("   " + X(E, "[x]", "[ ]") + " information supplémentaire intéressant l'évaluation d'un risque");
        C.push("       (R. 4121-2, 3°)");
        C.push("");
        C.push("3. CE QUI A CHANGÉ DEPUIS LA VERSION PRÉCÉDENTE");
        if (E) {
          C.push("   " + u0.nom + " : mesure « " + u0.lignes[0][3].split(",")[0] + " » réalisée ; un incident bénin le " +
            leJour(dans(d0, -120)) + ", lié au risque « " + u0.lignes[1][0].toLowerCase() + " », a conduit à recoter ce risque.");
          C.push("   " + u1.nom + " : effectif passé de " + (u1.effectif - 1) + " à " + u1.effectif + " salariés ; le service de " +
            "prévention a signalé dans sa fiche d'entreprise le risque « " + u1.lignes[2][0].toLowerCase() + " ».");
          C.push("   Ensemble du personnel : un signalement d'agissements sexistes traité le " + leJour(dans(d0, -60)) + ", ligne ajoutée.");
        } else {
          C.push("   [ÉCRIRE ICI, unité par unité, ce qui a changé : postes créés ou");
          C.push("    supprimés, équipements, procédés, produits, locaux, organisation,");
          C.push("    horaires, effectifs, accidents et incidents survenus, alertes reçues,");
          C.push("    remontées du comité ou du service de prévention et de santé au");
          C.push("    travail.]");
        }
        C.push("");
        C.push("4. UNITÉS DE TRAVAIL MODIFIÉES");
        C.push("");
        var enteteModif = ["Unité de travail", "Ce qui change", "Lignes ajoutées ou retirées", "Grille reprise le"];
        C = C.concat(E ? tableau(enteteModif, [
          [u0.nom, "mesure réalisée, accident bénin recoté", "1 ligne modifiée (" + u0.lignes[1][0].toLowerCase() + ")", leJour(dans(d0, -10))],
          [u1.nom, "effectif et matériel nouveaux, signalement du service de prévention", "1 ligne ajoutée (" + u1.lignes[2][0].toLowerCase() + "), 0 retirée", leJour(dans(d0, -8))],
          [E.unites[E.unites.length - 1].nom, "signalement d'agissements sexistes", "1 ligne ajoutée (harcèlement et agissements sexistes)", leJour(dans(d0, -8))],
        ]) : tableauVide(enteteModif, 3));
        C.push("5. UNITÉS RELUES SANS MODIFICATION");
        C.push("   " + X(E, E && E.unites.slice(2, E.unites.length - 1).map(function (u) { return u.nom; }).join(", ") + " : relues le " + leJour(dans(d0, -9)) + ", expositions et mesures inchangées",
          "Les nommer. Une unité non relue n'est pas une unité inchangée, et la différence se voit à la lecture des versions successives") + ".");
        C.push("");
        C.push("6. SUITES RÉVISÉES (R. 4121-2, dernier alinéa)");
        if (plus50 === true) {
          C.push("   Effectif d'au moins cinquante salariés : le programme annuel de");
          C.push("   prévention est révisé (L. 4121-3-1, III, 1°).");
        } else if (plus50 === false) {
          C.push("   Effectif inférieur à cinquante salariés : la liste des actions de");
          C.push("   prévention et de protection, consignée dans le document unique, est");
          C.push("   révisée (L. 4121-3-1, III, 2°).");
        } else {
          C.push("   Selon l'effectif : programme annuel à partir de cinquante salariés,");
          C.push("   liste d'actions consignée au document unique en deçà (L. 4121-3-1, III).");
        }
        C.push("   " + X(E, "[x] révisé le " + leJour(dans(d0, -5)) + "   [ ] non révisé", "[ ] révisé, le [date]   [ ] non révisé, parce que [motif écrit]"));
        C.push("");
        C.push("7. FORMALITÉS QUI SUIVENT CETTE VERSION");
        C.push("   " + X(E, "[x] comité social et économique consulté le " + leJour(dans(d0, -3)), "[ ] comité social et économique consulté le [date]") +
          " (L. 4121-3, 1°, vise le document unique « et ses mises à jour ») ;");
        C.push("   " + X(E, "[x] transmis au service de prévention et de santé au travail le " + leJour(dans(d0, 2)), "[ ] transmis au service de prévention et de santé au travail le [date]") +
          " (L. 4121-3-1, VI, « à chaque mise à jour ») ;");
        C.push("   " + X(E, "[x]", "[ ]") + " version précédente archivée, avis d'accès toujours affiché (R. 4121-4).");
        C.push("");
        C.push("Fait à " + (E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(d0), "DATE"));
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 2, REGISTRE DES VERSIONS (traçabilité)");
        C.push("");
        C.push("Ce registre n'est imposé par aucun texte lu. Il sert à tenir ce que deux");
        C.push("textes lus imposent : conserver les versions successives pendant quarante");
        C.push("ans au moins et pouvoir dire, pour un travailleur ou un ancien travailleur,");
        C.push("quelles versions étaient en vigueur durant sa période d'activité.");
        C.push("");
        var enteteReg = ["Version", "Établie le", "Motif (R. 4121-2)", "Comité consulté le", "Transmise au service le", "Archivée à"];
        C = C.concat(E ? tableau(enteteReg, [
          ["1", leJour(dans(d0, -365)), "première évaluation", leJour(dans(d0, -370)), leJour(dans(d0, -362)), "serveur, dossier « prévention », sous-dossier « versions »"],
          ["2", leJour(d0), "1° périodicité annuelle et 3° information nouvelle", leJour(dans(d0, -3)), leJour(dans(d0, 2)), "même dossier, et classeur du bureau du pilote"],
        ]) : tableauVide(enteteReg, 3));
        C.push("Support et lieu de conservation : " + X(E, "serveur de l'entreprise et classeur papier", "PRÉCISER") +
          ". Responsable : " + X(E, E && E.pilote, "NOM") + ".");
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOTRE NOTE DE MISE À JOUR, À COMPLÉTER");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous relevez la date de la version en");
      L.push("vigueur et vous ouvrez la note de mise à jour.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 14)) + " environ, unités relues, changements");
      L.push("consignés, grilles reprises.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ, nouvelle version datée, version");
      L.push("précédente archivée, registre des versions complété.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " au plus tard, comité consulté");
      L.push("(L. 4121-3, 1°), document transmis au service de prévention et de santé au");
      L.push("travail (L. 4121-3-1, VI), suites révisées (R. 4121-2, dernier alinéa).");
      L.push("");
      if (estISO(du.dateDerniereMaj)) {
        L.push("Prochaine échéance annuelle si la nouvelle version est datée");
        L.push("d'aujourd'hui : " + jour(moisApres(iso0, 12)) + " (R. 4121-2, 1°).");
      } else {
        L.push("Prochaine échéance annuelle si la nouvelle version est datée");
        L.push("d'aujourd'hui : " + leJour(dans(d0, 365)) + " environ, le terme se");
        L.push("compte à partir de la date portée sur la version (R. 4121-2, 1°).");
      }
      L.push("");
      L.push("Ces durées sont indicatives, sauf l'année de R. 4121-2, 1°, qui est un");
      L.push("délai du texte.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("Le présent document traite le 1°, la périodicité. Les 2° et 3° suivent");
      L.push("l'événement et non le calendrier : ils font l'objet d'un document propre");
      L.push("(SST-CTL-DUE-04).");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  - " + ligneEffectif(ctx));
      L.push("  - dernière version du document unique : " +
        jour(du.dateDerniereMaj, "DATE NON RENSEIGNÉE"));
      if (estISO(du.dateDerniereMaj)) {
        var ech = moisApres(du.dateDerniereMaj, 12);
        L.push("  - l'année de R. 4121-2, 1°, échoit le " + jour(ech));
        if (iso0 && ech && iso0 > ech) {
          L.push("  - au " + leJour(d0) + ", CE TERME EST DÉPASSÉ : la mise à jour");
          L.push("    annuelle est en retard.");
        } else if (iso0 && ech) {
          L.push("  - au " + leJour(d0) + ", ce terme n'est pas atteint.");
        }
      } else {
        L.push("  - la date de la dernière version n'est pas au dossier : relevez-la sur");
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
      L.push("Les versions successives sont conservées pendant quarante ans au moins à");
      L.push("compter de leur élaboration (L. 4121-3-1, V ; R. 4121-4), et l'on doit");
      L.push("pouvoir dire, pour un travailleur ou un ancien travailleur, quelles versions");
      L.push("étaient en vigueur durant sa période d'activité (R. 4121-4, 1°). Jusqu'à");
      L.push("l'entrée en vigueur de l'obligation de dépôt dématérialisé prévue au B du V");
      L.push("de L. 4121-3-1, « l'employeur conserve les versions successives du document");
      L.push("unique au sein de l'entreprise sous la forme d'un document papier ou");
      L.push("dématérialisé » (R. 4121-4). Le comité est consulté sur chaque mise à jour");
      L.push("(L. 4121-3, 1°) et le document est transmis « à chaque mise à jour » au");
      L.push("service de prévention et de santé au travail (L. 4121-3-1, VI).");

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
     SST-CTL-DUE-04, LA MISE À JOUR ÉVÉNEMENTIELLE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-04", {
    nom: "La mise à jour du document unique après un aménagement ou une information nouvelle",
    detail: "La fiche d'événement, la mise à jour ciblée, la révision des " +
            "suites et le calendrier compté depuis l'événement.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {}, ev = f.evenement || {};
      var d0 = aujourd(ctx);
      var s50 = seuil(ctx, 50);
      var ex = exempleDe(ctx);
      var EV = EXEMPLES[ex.secteur].evenement;
      var L = entete(ctx, "Mise à jour événementielle du document unique",
        "article R. 4121-2, 2° et 3°, du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var plus50 = E ? E.effectif >= 50 : s50;
        var touchees = E ? EV.unites.map(function (i) { return E.unites[i]; }) : [];
        C.push("PIÈCE 1, FICHE D'ÉVÉNEMENT");
        C.push("");
        C.push(nom + ", fiche établie le " + X(E, leJour(d0), "date"));
        C.push("");
        C.push("1. NATURE DE L'ÉVÉNEMENT");
        C.push("   " + X(E, EV.nature === 2 ? "[x]" : "[ ]", "[ ]") + " décision d'aménagement important modifiant les conditions de santé");
        C.push("       et de sécurité ou les conditions de travail (R. 4121-2, 2°)");
        C.push("   " + X(E, EV.nature === 3 ? "[x]" : "[ ]", "[ ]") + " information supplémentaire intéressant l'évaluation d'un risque,");
        C.push("       portée à la connaissance de l'employeur (R. 4121-2, 3°)");
        C.push("");
        C.push("2. DESCRIPTION");
        if (E) {
          C.push("   " + EV.texte.charAt(0).toUpperCase() + EV.texte.slice(1) + ". " +
            (EV.nature === 2 ? "Décision prise le " + leJour(dans(d0, -6)) + " par " + E.signataire + "."
              : "Information reçue le " + leJour(dans(d0, -6)) + " par " + E.signataire + "."));
        } else {
          C.push("   [DÉCRIRE L'ÉVÉNEMENT, daté et circonstancié : quelle décision, prise");
          C.push("    par qui et quand ; ou quelle information, reçue de qui et quand.]");
        }
        C.push("");
        C.push("3. DATE DE LA DÉCISION OU DE LA CONNAISSANCE : " + X(E, leJour(dans(d0, -6)), "DATE"));
        C.push("   C'est de ce jour, et non de celui des travaux ou du constat définitif,");
        C.push("   que la mise à jour est due.");
        C.push("");
        C.push("4. PIÈCE QUI L'ÉTABLIT : " + X(E, EV.piece, "note de décision, compte rendu, courrier, déclaration d'accident, rapport du service de prévention, signalement, alerte") + ".");
        C.push("");
        C.push("5. UNITÉS DE TRAVAIL TOUCHÉES");
        C.push("");
        var enteteTouch = ["Unité de travail", "En quoi elle est touchée", "Risque nouveau ou modifié", "Examinée et écartée ?"];
        if (E) {
          var lignesT = touchees.map(function (u, i) {
            return [u.nom, i === 0 ? "directement, c'est l'objet de l'événement" : "par ricochet : organisation et coactivité modifiées",
              i === 0 ? EV.risque : EV.ricochet, "non, reprise"];
          });
          E.unites.forEach(function (u) {
            if (EV.unites.indexOf(E.unites.indexOf(u)) < 0 && lignesT.length < 5)
              lignesT.push([u.nom, "aucune exposition modifiée", "aucun", "oui, écartée le " + leJour(dans(d0, -2))]);
          });
          C = C.concat(tableau(enteteTouch, lignesT));
        } else {
          C = C.concat(tableauVide(enteteTouch, 3));
        }
        C.push("   On ne reprend que les unités que l'événement touche, mais on écrit");
        C.push("   aussi quelles unités ont été examinées et écartées.");
        C.push("");
        C.push("6. SUITES À RÉVISER (R. 4121-2, dernier alinéa)");
        if (plus50 === true) {
          C.push("   Effectif d'au moins cinquante salariés : le programme annuel de");
          C.push("   prévention est révisé si nécessaire (L. 4121-3-1, III, 1°).");
        } else if (plus50 === false) {
          C.push("   Effectif inférieur à cinquante salariés : la liste des actions de");
          C.push("   prévention et de protection consignée au document unique est révisée si");
          C.push("   nécessaire (L. 4121-3-1, III, 2°).");
        } else {
          C.push("   Programme annuel à partir de cinquante salariés, liste d'actions");
          C.push("   consignée au document unique en deçà (L. 4121-3-1, III).");
        }
        C.push("   " + X(E, "[x] révisées le " + leJour(dans(d0, 8)), "[ ] révisées le [date]   [ ] non révisées, parce que [motif écrit]"));
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 2, GRILLES DES UNITÉS REPRISES");
        C.push("");
        C.push("Les sept colonnes du document unique, pour les seules unités touchées.");
        C.push("");
        if (E) {
          touchees.forEach(function (u) {
            C.push("Unité de travail : " + u.nom + " (" + u.effectif + " salariés, " + u.site + "), version " + leJour(dans(d0, 8)));
            C.push("");
            C = C.concat(tableau(GRILLE, E.grille(u).slice(0, 5)));
          });
        } else {
          C.push("Unité de travail : [UNITÉ TOUCHÉE, effectif, site]");
          C.push("");
          C = C.concat(tableauVide(GRILLE, 3));
          C.push("[Recopier pour chaque unité touchée.]");
          C.push("");
        }
        C.push("");

        C.push("PIÈCE 3, INFORMATION DU COMITÉ ET DU SERVICE DE PRÉVENTION");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la délégation du personnel");
        C.push("du comité social et économique");
        C.push("[et, s'il en existe une, aux membres de la commission santé, sécurité et");
        C.push("conditions de travail]");
        C.push("");
        C.push((E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(dans(d0, 8)), "date"));
        C.push("");
        C.push("Objet : mise à jour du document unique à la suite de " + X(E, "la " + EV.texte.split(",")[0], "nature de l'événement") +
          " du " + X(E, leJour(dans(d0, -6)), "date"));
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push(X(E, "La " + EV.texte + ", le " + leJour(dans(d0, -6)) + ",", "[Décrire l'événement en une phrase, datée.]") + " a conduit à mettre à jour le");
        C.push("document unique d'évaluation des risques professionnels, comme R. 4121-2");
        C.push("l'impose lors de toute décision d'aménagement important modifiant les");
        C.push("conditions de santé et de sécurité ou les conditions de travail, et");
        C.push("lorsqu'une information supplémentaire intéressant l'évaluation d'un risque");
        C.push("est portée à la connaissance de l'employeur.");
        C.push("");
        C.push("Je vous adresse ci-joint la version mise à jour et vous invite à en");
        C.push("délibérer lors de la réunion du " + X(E, leJour(dans(d0, 21)), "DATE") + " : l'article L. 4121-3, 1°,");
        C.push("dispose que « le comité social et économique est consulté sur le document");
        C.push("unique d'évaluation des risques professionnels et sur ses mises à jour ».");
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("Pièce jointe : document unique, version du " + X(E, leJour(dans(d0, 8)), "date"));
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOTRE MISE À JOUR, À COMPLÉTER");
      L.push("");
      if (estNon((f.cse || {}).existe)) {
        L.push("Le dossier n'indique aucun comité social et économique : la consultation");
        L.push("de L. 4121-3, 1°, n'a pas d'objet en l'état. Le courrier de la pièce 3 est");
        L.push("écrit pour le jour où le comité existera ; la transmission au service de");
        L.push("prévention et de santé au travail, elle, reste due sans condition");
        L.push("(L. 4121-3-1, VI).");
        L.push("");
      }
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Le point de départ n'est pas aujourd'hui : c'est le jour de la décision ou");
      L.push("de la connaissance de l'information. Portez-le en tête de la fiche");
      L.push("d'événement, puis comptez à partir de lui.");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous établissez la fiche d'événement et");
      L.push("vous identifiez les unités touchées.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 10)) + " environ, grilles des unités touchées");
      L.push("reprises, nouvelle version datée, précédente conservée (L. 4121-3-1, V).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ, comité consulté sur la mise à");
      L.push("jour (L. 4121-3, 1°) et suites révisées (R. 4121-2, dernier alinéa).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " au plus tard, transmission au service de");
      L.push("prévention et de santé au travail (L. 4121-3-1, VI).");
      L.push("");
      L.push("Ces durées sont indicatives : R. 4121-2 ne fixe aucun délai chiffré pour");
      L.push("les cas 2° et 3°. Il les rattache à l'événement, ce qui est plus exigeant");
      L.push("qu'un délai, l'obligation naît le jour même.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("  - aménagement important ou information nouvelle depuis la dernière mise");
      L.push("    à jour : " + etat(ev.survenu, "OUI", "non"));
      L.push("  - mise à jour faite en conséquence : " + etat(ev.majFaite, "oui", "NON"));
      L.push("  - dernière version du document unique : " +
        jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  - " + ligneEffectif(ctx));
      L.push("");
      L.push("La mise à jour du programme annuel de prévention ou de la liste des actions");
      L.push("« est effectuée à chaque mise à jour du document unique, si nécessaire »");
      L.push("(R. 4121-2, dernier alinéa). Le comité social et économique « est consulté");
      L.push("sur le document unique d'évaluation des risques professionnels et sur ses");
      L.push("mises à jour » (L. 4121-3, 1°), et le document est transmis au service de");
      L.push("prévention et de santé au travail « à chaque mise à jour » (L. 4121-3-1,");
      L.push("VI). La version précédente est conservée (L. 4121-3-1, V).");

      return L.concat(pied("R. 4121-2, L. 4121-3, L. 4121-3-1, R. 4741-1",
        ["Le défaut de mise à jour « dans les conditions prévues aux articles",
         "R. 4121-1 et R. 4121-2 » est puni de l'amende prévue pour les contraventions",
         "de la cinquième classe (R. 4741-1). Les cas 2° et 3° sont dans ces",
         "conditions."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-05, LES SUITES DE L'ÉVALUATION

     Deux régimes, un seuil. Le document produit les DEUX, parce qu'un effectif
     absent ne doit jamais faire choisir à la place du lecteur, mais il dit
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
      var ex = exempleDe(ctx);
      var annee = d0.getFullYear() + 1;
      var L = entete(ctx, "Suites de l'évaluation des risques, programme annuel de prévention ou liste d'actions",
        "articles L. 4121-3-1, III, et L. 2312-27 du code du travail");

      var COUTS = ["1 200 €", "3 500 €", "800 €", "6 000 €", "2 400 €", "450 €", "1 800 €", "950 €"];
      var CONDITIONS = ["devis puis commande, mise en place par ", "rédaction et diffusion à l'équipe par ",
                        "organisme retenu, sessions programmées par ", "travaux par une entreprise extérieure hors heures de travail, suivis par ",
                        "consigne écrite, affichée et expliquée en réunion d'équipe par ", "achat et remise contre signature par ",
                        "planning modifié et remis quinze jours à l'avance par ", "contrôle mensuel sur fiche signée par "];
      var INDIC = ["mesure en place et vérifiée, aucun incident sur douze mois",
                   "fiche de contrôle signée chaque mois, zéro écart",
                   "100 % des salariés concernés formés, attestations classées",
                   "matériel livré et réceptionné, consigne affichée",
                   "mesure faite et résultat sous le seuil",
                   "procédure diffusée et signée par tous",
                   "aucune situation signalée sur six mois",
                   "vérification faite, rapport sans réserve"];

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var plus50 = E ? E.effectif >= 50 : s50;
        var actions = E ? E.actions(8) : [];
        C.push("PARTIE A, PROGRAMME ANNUEL DE PRÉVENTION DES RISQUES PROFESSIONNELS");
        C.push("ET D'AMÉLIORATION DES CONDITIONS DE TRAVAIL");
        C.push("(effectif supérieur ou égal à cinquante salariés, L. 4121-3-1, III, 1°)");
        C.push("");
        if (E) {
          C.push(plus50 ? "Avec " + E.effectif + " salariés, c'est cette partie A qui s'applique à l'entreprise de l'exemple ; la partie B est montrée pour la forme."
                        : "Avec " + E.effectif + " salariés, c'est la partie B qui s'applique à l'entreprise de l'exemple ; la partie A est montrée pour la forme.");
          C.push("");
        }
        C.push(nom.toUpperCase());
        C.push("Programme annuel de prévention, année " + X(E, String(annee), "ANNÉE"));
        C.push("Établi le " + X(E, leJour(d0), "DATE") + ". Source : document unique, version du " +
          (E ? leJour(dans(d0, -15)) : jour(du.dateDerniereMaj, "date")) + ".");
        C.push("");
        C.push("A.1, D'OÙ VIENNENT LES MESURES");
        C.push("");
        C.push("Chaque mesure vient d'une ligne « mesures à prendre » du document unique,");
        C.push("avec l'unité de travail et le risque d'origine.");
        C.push("");
        C.push("A.2, LA LISTE DÉTAILLÉE DES MESURES (pour chaque mesure : conditions");
        C.push("d'exécution, indicateurs de résultat, estimation du coût)");
        C.push("");
        var enteteA = ["N°", "Unité de travail", "Risque visé", "Mesure", "Conditions d'exécution", "Indicateurs de résultat", "Coût estimé", "Échéance", "Responsable"];
        if (E) {
          C = C.concat(tableau(enteteA, actions.map(function (a, i) {
            return [a[0], a[1], a[2], a[3], CONDITIONS[i % CONDITIONS.length] + a[5].split(",")[0] + ", information des salariés de l'unité",
                    INDIC[i % INDIC.length], COUTS[i % COUTS.length], a[4], a[5]];
          })));
        } else {
          C = C.concat(tableauVide(enteteA, 3));
        }
        C.push("A.3, LES RESSOURCES MOBILISABLES (L. 4121-3-1, III, 1°, b)");
        C.push("");
        C.push(X(E, "Budget prévention de " + (E ? "18 000 €" : "") + " pour l'année ; une demi-journée par semaine de " + (E && E.designe) +
          " (salarié désigné) ; appui du " + (E && E.spst) + " ; guides et outils de la branche.",
          "IDENTIFIER LES RESSOURCES DE L'ENTREPRISE POUVANT ÊTRE MOBILISÉES : budget, temps d'encadrement, compétences internes, salarié désigné, appui du service de prévention et de santé au travail, organismes de la branche"));
        C.push("");
        C.push("A.4, LE CALENDRIER DE MISE EN ŒUVRE (L. 4121-3-1, III, 1°, c)");
        C.push("");
        var enteteCal = ["Trimestre", "Mesures engagées (n°)", "Jalons", "Point d'étape prévu le"];
        C = C.concat(E ? tableau(enteteCal, [
          ["T1", "1, 2, 3", "commandes passées, consignes affichées", leJour(dans(d0, 90))],
          ["T2", "4, 5", "matériel livré, formations faites", leJour(dans(d0, 180))],
          ["T3", "6, 7", "actions de fond réalisées, indicateurs relevés", leJour(dans(d0, 270))],
          ["T4", "8, bilan", "bilan de l'année, préparation du programme suivant", leJour(dans(d0, 360))],
        ]) : tableauVide(enteteCal, 4));
        C.push("A.5, CE QUI N'A PAS ÉTÉ FAIT L'AN DERNIER (annexe au rapport annuel, L. 2312-27)");
        C.push("");
        var enteteNon = ["Mesure non exécutée", "Prévue par", "Motif de l'inexécution", "Reportée en"];
        C = C.concat(E ? tableau(enteteNon, [
          [E.unites[0].lignes[E.unites[0].lignes.length - 1][3].split(",")[0], "employeur", "devis reçu en décembre, budget reporté", "T2 " + annee],
          [E.unites[1].lignes[1][3].split(",")[0], "comité", "fournisseur en rupture, livraison décalée", "T1 " + annee],
        ]) : tableauVide(enteteNon, 3));
        C.push("Fait à " + (E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(d0), "DATE"));
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PARTIE B, LISTE DES ACTIONS DE PRÉVENTION ET DE PROTECTION");
        C.push("(effectif inférieur à cinquante salariés, L. 4121-3-1, III, 2°)");
        C.push("");
        C.push("La liste est consignée dans le document unique lui-même et refaite à");
        C.push("chaque mise à jour ; elle n'exige ni indicateurs, ni coût, ni calendrier");
        C.push("formalisé, mais la définition des actions.");
        C.push("");
        C.push(nom.toUpperCase());
        C.push("Liste des actions de prévention et de protection, consignée au document");
        C.push("unique, version du " + (E ? leJour(dans(d0, -15)) : "[DATE DE LA VERSION]"));
        C.push("");
        var enteteB = ["N°", "Unité de travail", "Risque visé", "Action de prévention ou de protection", "Échéance", "Responsable"];
        C = C.concat(E ? tableau(enteteB, actions) : tableauVide(enteteB, 3));
        C.push("Ordre imposé par L. 4121-2 : éviter, évaluer ce qui ne peut être évité,");
        C.push("combattre à la source, adapter le travail à l'homme, tenir compte de la");
        C.push("technique, remplacer ce qui est dangereux, planifier, privilégier la");
        C.push("protection collective sur la protection individuelle, donner les");
        C.push("instructions appropriées.");
        C.push("");
        C.push("");

        C.push("PIÈCE COMMUNE, PRÉSENTATION AU COMITÉ SOCIAL ET ÉCONOMIQUE (L. 2312-27)");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la délégation du personnel");
        C.push("du comité social et économique");
        C.push("");
        C.push((E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(dans(d0, 30)), "date"));
        C.push("");
        C.push("Objet : consultation sur la politique sociale, rapport annuel et");
        C.push("programme annuel de prévention");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("Dans le cadre de la consultation sur la politique sociale, je vous adresse");
        C.push("ci-joint, conformément à l'article L. 2312-27 du code du travail :");
        C.push("");
        C.push("  - le rapport annuel écrit faisant le bilan de la situation générale de");
        C.push("    la santé, de la sécurité et des conditions de travail dans");
        C.push("    l'entreprise et des actions menées au cours de l'année écoulée, dans");
        C.push("    lequel les questions du travail de nuit et de prévention des effets de");
        C.push("    l'exposition aux facteurs de risques professionnels sont traitées");
        C.push("    spécifiquement ;");
        C.push("  - le programme annuel de prévention des risques professionnels et");
        C.push("    d'amélioration des conditions de travail pour l'année " + X(E, String(annee), "ANNÉE") + ".");
        C.push("");
        C.push("La réunion consacrée à leur examen est fixée au " + X(E, leJour(dans(d0, 45)), "DATE") + ". Lors de l'avis que");
        C.push("vous rendrez, vous pouvez proposer un ordre de priorité et l'adoption de");
        C.push("mesures supplémentaires.");
        C.push("");
        C.push(X(E, "Les motifs pour lesquels deux mesures prévues l'an dernier n'ont pas été prises figurent en annexe au rapport annuel.",
          "Le cas échéant : les motifs pour lesquels certaines des mesures prévues l'an dernier n'ont pas été prises figurent en annexe au rapport annuel."));
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("Pièces jointes : rapport annuel, programme annuel de prévention");
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOTRE PROGRAMME OU VOTRE LISTE, À COMPLÉTER");
      L.push("");
      if (s50 === true) {
        L.push("Effectif d'au moins cinquante salariés : c'est le PROGRAMME ANNUEL DE");
        L.push("PRÉVENTION (partie A) qui vous concerne. Supprimez la partie B.");
      } else if (s50 === false) {
        L.push("Effectif inférieur à cinquante salariés : c'est la LISTE DES ACTIONS");
        L.push("(partie B), consignée dans le document unique, qui vous concerne.");
        L.push("Supprimez la partie A.");
      } else {
        L.push("Régime non tranché, faute d'effectif renseigné : portez votre effectif,");
        L.push("gardez la partie qui vous concerne et supprimez l'autre.");
      }
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous extrayez du document unique les");
      L.push("lignes « mesures à prendre » et vous les chiffrez.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 14)) + " environ, chaque mesure porte ses trois");
      L.push("éléments : conditions d'exécution, indicateurs de résultat, estimation du");
      L.push("coût (L. 4121-3-1, III, 1°, a). C'est l'étape la plus longue.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 21)) + " environ, ressources identifiées (b) et");
      L.push("calendrier de mise en œuvre arrêté (c). Le programme est complet.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ, envoi au comité du rapport");
      L.push("annuel et du programme, sous réserve des délais propres au comité.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 45)) + " environ, réunion consacrée à leur examen,");
      L.push("avis rendu, procès-verbal établi et conservé (L. 2312-27).");
      L.push("");
      L.push("Puis à chaque mise à jour du document unique, révision du programme ou de");
      L.push("la liste « si nécessaire » (R. 4121-2, dernier alinéa).");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst", "cse"]));

      L.push("LES RÈGLES");
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
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("  - " + ligneEffectif(ctx));
      L.push("  - programme annuel " + etat(pa.existe, "établi", "NON ÉTABLI") + " ; présenté au comité " +
        etat(pa.presenteCSE, "oui", "NON") + " ; liste d'actions consignée " + etat(la.consignee, "oui", "NON"));
      L.push("  - document unique : " + etat(du.existe, "existant", "INEXISTANT") +
        ", version du " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("");
      if (estNon(du.existe)) {
        L.push("ATTENTION, sans document unique, il n'y a pas d'évaluation transcrite,");
        L.push("et donc rien dont un programme ou une liste puisse « déboucher ». Le");
        L.push("document unique se fait d'abord (SST-CTL-DUE-01).");
        L.push("");
      }
      L.push("Les mesures du programme « comprennent les mesures de prévention des");
      L.push("effets de l'exposition aux facteurs de risques professionnels » ; ces");
      L.push("facteurs sont ceux que L. 4121-1 désigne par renvoi à L. 4161-1.");
      L.push("");
      L = L.concat(blocRenvoi("L. 4161-1",
        "est nommé par L. 4121-1 et par L. 2312-27 pour désigner les facteurs de " +
        "risques professionnels"));
      L.push("L. 4121-3-1, IV, dispose que « les organismes et instances mis en place par");
      L.push("la branche peuvent accompagner les entreprises dans l'élaboration et la");
      L.push("mise à jour du document unique [...], dans la définition du programme");
      L.push("annuel de prévention [...] ainsi que dans la définition des actions de");
      L.push("prévention et de protection [...] au moyen de méthodes et référentiels");
      L.push("adaptés aux risques considérés et d'outils d'aide à la rédaction ».");
      L.push("");
      L.push("LA PRÉSENTATION AU COMITÉ");
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
      L.push("« Lorsque certaines des mesures prévues par l'employeur ou demandées par");
      L.push("le comité n'ont pas été prises au cours de l'année concernée par le");
      L.push("programme, l'employeur énonce les motifs de cette inexécution, en annexe");
      L.push("au rapport annuel » (L. 2312-27). Et « le procès-verbal de la réunion du");
      L.push("comité consacrée à l'examen du rapport et du programme est joint à toute");
      L.push("demande présentée par l'employeur en vue d'obtenir des marchés publics, des");
      L.push("participations publiques, des subventions, des primes de toute nature ou");
      L.push("des avantages sociaux ou fiscaux » (L. 2312-27).");
      L.push("");
      L.push("R. 4121-3 ajoute que « dans les établissements dotés d'un comité social et");
      L.push("économique, le document unique d'évaluation des risques professionnels est");
      L.push("utilisé pour l'établissement du rapport annuel prévu au 1° de l'article");
      L.push("L. 2312-27 ».");
      L.push("");
      if (estNon(cseExiste)) {
        L.push("Le dossier n'indique aucun comité social et économique : la présentation");
        L.push("de L. 2312-27 n'a pas d'objet en l'état, et la régularité de cette absence");
        L.push("relève du module « comité social et économique ». Le programme ou la liste");
        L.push("reste dû : L. 4121-3-1, III, ne le subordonne à l'existence d'aucune");
        L.push("instance.");
        L.push("");
      }
      L.push("Les délais de convocation et de transmission au comité sont fixés par les");
      L.push("règles propres au comité, que ce module n'a pas lues : le module « comité");
      L.push("social et économique » les traite.");

      return L.concat(pied("L. 4121-3-1, III et IV, L. 4121-2, L. 2312-27, R. 4121-2, R. 4121-3",
        ["Aucune peine n'est annoncée ici, et ce n'est pas une omission. R. 4741-1 ne",
         "punit que le défaut de transcription et de mise à jour « dans les conditions",
         "prévues aux articles R. 4121-1 et R. 4121-2 » : il n'atteint pas le III de",
         "L. 4121-3-1. L. 4741-1 ne l'atteint pas non plus, son énumération vise,",
         "pour le livre Ier de la quatrième partie, les « Titres Ier, III et IV », et",
         "le titre II en est absent. Ce qui se joue est l'inexécution d'une obligation",
         "civile, et l'incomplétude des demandes visées au dernier alinéa de",
         "L. 2312-27."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-06, CONSERVATION DES VERSIONS ET AVIS D'ACCÈS
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-06", {
    nom: "L'avis d'accès affiché, le protocole de conservation et le courrier de mise à disposition",
    detail: "L'avis à afficher, le protocole des quarante ans, la liste des " +
            "sept destinataires du droit d'accès et la réponse type à une demande.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Accès au document unique, avis affiché et conservation des versions",
        "articles L. 4121-3-1, V, et R. 4121-4 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        C.push("PIÈCE 1, AVIS À AFFICHER");
        C.push("");
        C.push("AVIS");
        C.push("MODALITÉS D'ACCÈS AU DOCUMENT UNIQUE D'ÉVALUATION DES RISQUES PROFESSIONNELS");
        C.push("");
        C.push(nom.toUpperCase());
        C.push("");
        C.push("Le document unique d'évaluation des risques professionnels de");
        C.push("l'entreprise, ainsi que ses versions antérieures, sont tenus à votre");
        C.push("disposition en application des articles L. 4121-3-1, V, et R. 4121-4 du");
        C.push("code du travail.");
        C.push("");
        C.push("OÙ LE CONSULTER : " + X(E, "bureau de " + (E && E.pilote) + ", et sur l'intranet, rubrique « prévention » ; les anciens salariés le demandent par courriel ou par courrier au siège",
          "LIEU PRÉCIS, bureau, service, intranet ; s'il est dématérialisé, dire comment y accéder sans compte professionnel, pour les anciens travailleurs") + ".");
        C.push("");
        C.push("À QUI LE DEMANDER : " + X(E, E && E.pilote + ", prevention@" + (E && E.nom.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")) + ".fr, poste 210",
          "NOM, FONCTION, courriel, téléphone") + ".");
        C.push("");
        C.push("QUAND : " + X(E, "du lundi au vendredi de 9 h à 17 h ; réponse à toute demande écrite sous cinq jours ouvrables", "horaires ou délai de réponse à une demande") + ".");
        C.push("");
        C.push("QUI PEUT Y ACCÉDER : les travailleurs et les anciens travailleurs, pour");
        C.push("les versions en vigueur durant leur période d'activité dans l'entreprise ;");
        C.push("les membres de la délégation du personnel du comité social et économique ;");
        C.push("le service de prévention et de santé au travail ; les agents du système");
        C.push("d'inspection du travail ; les agents des services de prévention des");
        C.push("organismes de sécurité sociale ; les agents des organismes professionnels");
        C.push("de santé, de sécurité et des conditions de travail ; les inspecteurs de la");
        C.push("radioprotection et les agents mentionnés au 7° de R. 4121-4, pour ce qui");
        C.push("concerne les rayonnements ionisants.");
        C.push("");
        C.push("Les travailleurs et anciens travailleurs peuvent communiquer les éléments");
        C.push("mis à leur disposition aux professionnels de santé en charge de leur suivi");
        C.push("médical (R. 4121-4, 1°).");
        C.push("");
        C.push("Affiché le " + X(E, leJour(d0), "DATE") + ", " + X(E, "à l'entrée des vestiaires, au même emplacement que le règlement intérieur", "LIEU, au même emplacement que le règlement intérieur s'il en existe un") + ". " + sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 2, PROTOCOLE DE CONSERVATION ET DE MISE À DISPOSITION");
        C.push("");
        C.push(nom + ", protocole établi le " + X(E, leJour(d0), "date"));
        C.push("");
        C.push("1. CE QUI EST CONSERVÉ : la version en vigueur et toutes les versions");
        C.push("   antérieures, chacune pendant quarante ans au moins à compter de son");
        C.push("   élaboration (R. 4121-4). Une sauvegarde écrasée à chaque mise à jour");
        C.push("   ne satisfait pas le texte.");
        C.push("");
        C.push("2. SUPPORT ET LIEU : " + X(E, "un exemplaire papier signé par version dans l'armoire du bureau du pilote, et un fichier PDF par version sur le serveur, dossier « prévention », sous-dossier « versions », sauvegardé chaque nuit",
          "PRÉCISER : papier, armoire, local ; dématérialisé, serveur, espace, sauvegarde") + ".");
        C.push("");
        C.push("3. RESPONSABLE : " + X(E, E && E.pilote, "NOM ET FONCTION") + ". Suppléant : " + X(E, E && E.designe, "NOM") + ".");
        C.push("   La fonction est nommée autant que la personne : une conservation de");
        C.push("   quarante ans survit à ceux qui l'ont organisée.");
        C.push("");
        C.push("4. DÉLAI DE RÉPONSE À UNE DEMANDE : " + X(E, "cinq", "....") + " jours ouvrables. Aucun texte lu n'en");
        C.push("   fixe ; celui-ci est le nôtre, et il se tient.");
        C.push("");
        C.push("5. REGISTRE DES DEMANDES");
        C.push("");
        var enteteReg = ["Date", "Demandeur", "Qualité (1° à 7° de R. 4121-4)", "Versions demandées", "Réponse le", "Éléments remis"];
        C = C.concat(E ? tableau(enteteReg, [
          [leJour(dans(d0, -40)), "M. Jean PETIT, ancien salarié (" + E.unites[1].nom.toLowerCase() + ")", "1°, ancien travailleur", "versions en vigueur de " + (d0.getFullYear() - 6) + " à " + (d0.getFullYear() - 1), leJour(dans(d0, -36)), "grilles de l'unité « " + E.unites[1].nom + " », versions 1 à 3, en PDF"],
          [leJour(dans(d0, -12)), "Membres de la délégation du personnel du comité", "2°", "version en vigueur", leJour(dans(d0, -12)), "version 2 complète, en PDF"],
        ]) : tableauVide(enteteReg, 3));
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 3, RÉPONSE À UNE DEMANDE D'ACCÈS (lettre type)");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push(X(E, "Monsieur Jean PETIT", "NOM ET PRÉNOM DU DEMANDEUR"));
        C.push(E ? "7 rue des Peupliers, " + E.adresse.split(", ").pop() : "[adresse]");
        C.push("");
        C.push((E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(dans(d0, -36)), "date"));
        C.push("");
        C.push("Objet : votre demande d'accès au document unique d'évaluation des risques");
        C.push("professionnels");
        C.push("");
        C.push("Monsieur" + X(E, "", " / Madame") + ",");
        C.push("");
        C.push("Vous avez sollicité, par " + X(E, "courrier", "courrier / courriel") + " du " + X(E, leJour(dans(d0, -40)), "DATE") + ", l'accès au");
        C.push("document unique d'évaluation des risques professionnels de " + nom + ".");
        C.push("");
        C.push("En application des articles L. 4121-3-1, V, et R. 4121-4 du code du");
        C.push("travail, je mets à votre disposition les versions suivantes :");
        C.push("");
        C.push(X(E, "  les versions 1, 2 et 3, en vigueur durant votre période d'activité, du 1er mars " + (d0.getFullYear() - 6) + " au 30 novembre " + (d0.getFullYear() - 1) + ".",
          "LISTER LES VERSIONS REMISES, avec leur date d'élaboration. Pour un ancien travailleur : celles en vigueur durant sa période d'activité, du [date d'entrée] au [date de sortie]"));
        C.push("");
        C.push(X(E, "Conformément au 1° de l'article R. 4121-4, la communication des versions antérieures à celle en vigueur à la date de votre demande est limitée aux éléments afférents à votre activité, à savoir l'unité de travail « " + (E && E.unites[1].nom) + " ».",
          "Le cas échéant : conformément au 1° de l'article R. 4121-4, la communication des versions antérieures à celle en vigueur à la date de votre demande est limitée aux éléments afférents à votre activité, à savoir [préciser les unités de travail concernées]."));
        C.push("");
        C.push("Le même texte vous permet de communiquer ces éléments aux professionnels");
        C.push("de santé en charge de votre suivi médical.");
        C.push("");
        C.push(X(E, "Les documents sont joints à la présente en copie, et vous pouvez les consulter sur place sur rendez-vous.", "Modalités pratiques : remise sur place le [date] / envoi dématérialisé / copie jointe."));
        C.push("");
        C.push("Je vous prie d'agréer, " + X(E, "Monsieur", "Madame, Monsieur") + ", l'expression de ma considération");
        C.push("distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Le texte n'impose pas d'afficher le document unique : il impose d'afficher");
      L.push("l'avis qui dit comment y accéder. Sur plusieurs sites, un avis par site.");
      L.push("Photographiez l'affichage, daté : c'est la seule preuve simple.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous rédigez l'avis et vous l'affichez.");
      L.push("C'est l'acte le plus rapide du module : il ne dépend de personne d'autre.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ, avis affiché sur chaque site,");
      L.push("photographié et daté.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ, versions antérieures rassemblées,");
      L.push("support de conservation arrêté, responsable nommé, registre des demandes");
      L.push("ouvert.");
      L.push("");
      L.push("Ensuite, à chaque nouvelle version, archiver la précédente sans l'écraser");
      L.push("et vérifier que l'avis affiché reste exact (nom, lieu, contact).");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("  - versions successives conservées : " + etat(du.versionsConservees, "oui", "NON"));
      L.push("  - avis d'accès affiché : " + etat(du.avisAffiche, "oui", "NON"));
      L.push("  - version en vigueur : " + jour(du.dateDerniereMaj, "date non renseignée"));
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
      L.push("catégories qu'il énumère. Quarante ans à compter de leur élaboration : le");
      L.push("compte court version par version, non depuis la dernière.");
      L.push("");
      L.push("R. 4121-4, dernier alinéa : « Un avis indiquant les modalités d'accès des");
      L.push("travailleurs au document unique est affiché à une place convenable et");
      L.push("aisément accessible dans les lieux de travail. Dans les entreprises ou");
      L.push("établissements dotés d'un règlement intérieur, cet avis est affiché au");
      L.push("même emplacement que celui réservé au règlement intérieur. »");
      L.push("");
      L.push("LES SEPT CATÉGORIES DE R. 4121-4, ET CE QU'ELLES PEUVENT DEMANDER");
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
      L.push("Sur le dépôt dématérialisé, L. 4121-3-1, V, B, prévoit un portail numérique");
      L.push("déployé et administré par un organisme géré par les organisations");
      L.push("professionnelles d'employeurs représentatives au niveau national et");
      L.push("interprofessionnel, l'obligation étant applicable « à compter du 1er juillet");
      L.push("2023, aux entreprises dont l'effectif est supérieur ou égal à cent");
      L.push("cinquante salariés » et, « à compter de dates fixées par décret, en fonction");
      L.push("des effectifs des entreprises, et au plus tard à compter du 1er juillet");
      L.push("2024 », aux autres. Jusqu'à l'entrée en vigueur de ce dépôt, « l'employeur");
      L.push("conserve les versions successives du document unique au sein de");
      L.push("l'entreprise sous la forme d'un document papier ou dématérialisé »");
      L.push("(R. 4121-4). L'application ne sait pas où en est ce déploiement :");
      L.push("vérifiez-le, et conservez en tout état de cause vos versions dans");
      L.push("l'entreprise.");

      return L.concat(pied("L. 4121-3-1, I et V, R. 4121-4",
        ["Aucune peine n'est annoncée ici, et la vérification a été faite. R. 4741-1",
         "ne punit que le défaut de transcription et de mise à jour « dans les",
         "conditions prévues aux articles R. 4121-1 et R. 4121-2 » : R. 4121-4 n'y est",
         "pas. R. 4741-3, dont l'objet, « les documents et affichages obligatoires »,",
         "pourrait le laisser croire, vise une liste close : « les articles L. 4711-1 à",
         "L. 4711-5 ainsi que [...] les articles D. 4711-1 à D. 4711-3 ». R. 4121-4 n'y",
         "figure pas davantage. Ce qui se perd sans conservation, c'est la traçabilité",
         "collective des expositions que L. 4121-3-1, I, met à la charge du document,",
         "et la capacité de répondre à un ancien salarié ou à un agent de contrôle."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-07, LA CONSULTATION DU COMITÉ SUR LE DOCUMENT UNIQUE
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-07", {
    nom: "La consultation du comité sur le document unique, ordre du jour et procès-verbal",
    detail: "Le courrier de transmission, le point d'ordre du jour rédigé, la " +
            "trame de procès-verbal et le suivi des mises à jour successives.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {}, cse = f.cse || {};
      var d0 = aujourd(ctx);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Consultation du comité social et économique sur le document unique",
        "article L. 4121-3, 1°, du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var vers = E ? leJour(d0) : "[DATE DE LA VERSION]";
        var reunion = E ? leJour(dans(d0, 21)) : "[DATE DE LA RÉUNION]";
        C.push("PIÈCE 1, COURRIER DE TRANSMISSION ET DE SAISINE");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la délégation du personnel");
        C.push("du comité social et économique");
        C.push("Copie : " + X(E, E && E.effectif >= 300 ? "aux membres de la commission santé, sécurité et conditions de travail" : "sans objet, pas de commission santé, sécurité et conditions de travail",
          "aux membres de la commission santé, sécurité et conditions de travail, s'il en existe une"));
        C.push("");
        C.push((E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(d0), "date"));
        C.push("");
        C.push("Objet : consultation sur le document unique d'évaluation des risques");
        C.push("professionnels, version du " + vers);
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("L'article L. 4121-3, 1°, du code du travail dispose que le comité social");
        C.push("et économique est consulté sur le document unique d'évaluation des risques");
        C.push("professionnels et sur ses mises à jour.");
        C.push("");
        C.push("Je vous adresse en conséquence, ci-joint, " + X(E, "la mise à jour du document unique", "le document unique / la mise à jour du document unique") + " dans sa");
        C.push("version du " + vers + ", afin que vous puissiez en prendre connaissance avant");
        C.push("la réunion du " + reunion + ", à laquelle ce point sera soumis à votre avis.");
        C.push("");
        C.push(X(E, "La note de mise à jour, qui expose ce qui a changé depuis la version précédente et pour quel motif de R. 4121-2, est jointe.",
          "S'il s'agit d'une mise à jour : la note de mise à jour, qui expose ce qui a changé depuis la version précédente et pour quel motif de R. 4121-2, est jointe."));
        C.push("");
        C.push("Le même article associe à l'évaluation la commission santé, sécurité et");
        C.push("conditions de travail lorsqu'elle existe : " + X(E, E && E.effectif >= 300 ? "la commission en a été saisie le " + leJour(dans(d0, -7)) : "il n'en existe pas dans l'entreprise",
          "le cas échéant, préciser la date à laquelle la commission en a été saisie") + ".");
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("Pièces jointes : document unique, version du " + vers + " ; note de mise à jour ;");
        C.push("inventaire par unité de travail");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, POINT D'ORDRE DU JOUR, RÉDIGÉ");
        C.push("");
        C.push("Point n° " + X(E, "3", ".") + ", CONSULTATION SUR LE DOCUMENT UNIQUE D'ÉVALUATION DES");
        C.push("RISQUES PROFESSIONNELS ET SUR SA MISE À JOUR (L. 4121-3, 1°)");
        C.push("Objet : recueillir l'avis du comité sur " + X(E, "la mise à jour du document unique", "le document unique / la mise à jour du document unique") + " dans sa version du " + vers + ".");
        C.push("Document transmis le " + X(E, leJour(d0), "DATE") + ". Avis attendu : oui.");
        C.push("");
        C.push("Point n° " + X(E, "4", ".") + ", PRÉSENTATION DU RAPPORT ANNUEL ET DU PROGRAMME ANNUEL DE");
        C.push("PRÉVENTION (L. 2312-27), point distinct du précédent.");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, TRAME DE PROCÈS-VERBAL (extrait relatif à ce point)");
        C.push("");
        C.push(nom.toUpperCase());
        C.push("COMITÉ SOCIAL ET ÉCONOMIQUE, RÉUNION DU " + (E ? reunion.toUpperCase() : "[DATE]"));
        C.push("Extrait du procès-verbal, point n° " + X(E, "3", "."));
        C.push("");
        C.push("PRÉSENTS : " + X(E, sig + ", président ; Mme Aïcha BENALI, M. Marc TISSIER, Mme Julie ROUX, titulaires ; M. Sofiane KHELIF, suppléant ; " + (E && E.pilote) + ", invitée",
          "liste, président, membres titulaires, suppléants présents, représentants syndicaux, invités") + ".");
        C.push("");
        C.push("1. DOCUMENT SOUMIS : " + X(E, "mise à jour du document unique", "document unique / mise à jour du document unique") + ", version du " + vers + ",");
        C.push("   transmis aux membres le " + X(E, leJour(d0), "DATE") + ".");
        C.push("");
        C.push("2. PRÉSENTATION");
        C.push("   " + X(E, (E && E.pilote) + " présente les " + (E && E.unites.length) + " unités de travail, les lignes ajoutées (" +
          (E && E.unites[1].lignes[2][0].toLowerCase()) + ", harcèlement et agissements sexistes), les mesures à prendre et leurs échéances.",
          "Résumer ce qui a été exposé : périmètre, unités de travail, risques ajoutés ou retirés, mesures à prendre, échéances."));
        C.push("");
        C.push("3. OBSERVATIONS DES MEMBRES");
        C.push("   " + X(E, "Mme BENALI demande que l'échéance de la mesure « " + (E && E.unites[0].lignes[0][3].split(",")[0]) + " » soit avancée d'un mois. M. TISSIER signale que l'unité « " + (E && E.unites[2].nom) + " » n'a pas été visitée depuis deux ans.",
          "CONSIGNER LES OBSERVATIONS, telles qu'elles ont été faites."));
        C.push("");
        C.push("4. RÉPONSES APPORTÉES");
        C.push("   " + X(E, "L'échéance est avancée au " + leJour(dans(d0, 20)) + ". Une visite de l'unité « " + (E && E.unites[2].nom) + " » est fixée au " + leJour(dans(d0, 35)) + " avec un membre du comité.", "....."));
        C.push("");
        C.push("5. AVIS DU COMITÉ");
        C.push("   Le comité, consulté en application de l'article L. 4121-3, 1°, du code");
        C.push("   du travail sur " + X(E, "la mise à jour du document unique", "le document unique / sa mise à jour") + ", rend un avis");
        C.push("   " + X(E, "favorable, assorti de la réserve suivante : visite de l'unité « " + (E && E.unites[2].nom) + " » avant la prochaine réunion", "favorable / défavorable / favorable assorti des réserves suivantes : .....") + ".");
        C.push("   Votants : " + X(E, "3", "..") + ". Pour : " + X(E, "3", "..") + ". Contre : " + X(E, "0", "..") + ". Abstentions : " + X(E, "0", "..") + ".");
        C.push("");
        C.push("6. SUITES : " + X(E, "l'employeur retient les deux demandes et les porte au programme.", "ce que l'employeur retient, ce qu'il ne retient pas et pourquoi."));
        C.push("");
        C.push("");

        C.push("PIÈCE 4, SUIVI DES CONSULTATIONS, VERSION PAR VERSION");
        C.push("");
        var enteteSuivi = ["Version du document unique", "Transmise le", "Réunion du", "Avis rendu", "Procès-verbal n°"];
        C = C.concat(E ? tableau(enteteSuivi, [
          ["1, du " + leJour(dans(d0, -365)), leJour(dans(d0, -380)), leJour(dans(d0, -360)), "favorable", "PV n° 2 de " + (d0.getFullYear() - 1)],
          ["2, du " + vers, leJour(d0), reunion, "favorable avec une réserve", "PV n° 4 de " + d0.getFullYear()],
        ]) : tableauVide(enteteSuivi, 3));
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      if (estNon(cse.existe)) {
        L.push("ATTENTION, le dossier n'indique aucun comité social et économique. La");
        L.push("consultation de L. 4121-3, 1°, ne peut pas être accomplie tant qu'il n'y");
        L.push("a pas de comité, et la régularité de cette absence relève du module");
        L.push("« comité social et économique ». Les pièces ci-dessous sont écrites pour");
        L.push("le jour où le comité existera.");
        L.push("");
      }
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous transmettez le document aux membres");
      L.push("(pièce 1) et vous inscrivez le point à l'ordre du jour (pièce 2).");
      L.push("");
      L.push("Réunion : à fixer selon les délais de convocation et de transmission");
      L.push("propres au comité, que ce module n'a pas lus. À titre indicatif, une");
      L.push("réunion au " + leJour(dans(d0, 21)) + " laisse trois semaines de lecture ;");
      L.push("vérifiez ce que vos règles imposent avant de retenir cette date.");
      L.push("");
      L.push("Le jour de la réunion, avis recueilli et consigné (pièce 3). Ensuite,");
      L.push("procès-verbal conservé avec la version correspondante du document, et");
      L.push("ligne ajoutée au tableau de suivi (pièce 4). À chaque mise à jour, on");
      L.push("recommence.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst", "cse"]));

      L.push("LES RÈGLES");
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
      L.push("  - c'est une CONSULTATION, pas une information. Une remise de document en");
      L.push("    séance, sans avis demandé ni recueilli, ne satisfait pas le texte ;");
      L.push("  - elle porte sur le document unique ET SES MISES À JOUR, sans");
      L.push("    distinguer : chaque nouvelle version se soumet ;");
      L.push("  - elle est DISTINCTE de la présentation du rapport et du programme");
      L.push("    annuels de L. 2312-27. Deux points d'ordre du jour, deux avis.");
      L.push("");
      L = L.concat(blocRenvoi("L. 2312-9",
        "est nommé par L. 4121-3, 1°, comme le siège de l'attribution du comité en " +
        "matière de santé, de sécurité et de conditions de travail"));
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  - comité social et économique : " + etat(cse.existe, "existant", "AUCUN DÉCLARÉ"));
      L.push("  - document unique : " + etat(du.existe, "existant", "INEXISTANT") +
        ", version du " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  - comité consulté sur cette version : " +
        etat(du.consultationCSE, "oui", "NON, c'est l'objet de ce document"));
      L.push("");
      L.push("Si le comité ne rend pas d'avis, l'écrire au procès-verbal : « le comité");
      L.push("n'a pas rendu d'avis ». La consultation aura eu lieu ; l'avis, non. Les");
      L.push("deux se prouvent séparément. Le délai de transmission avant la réunion,");
      L.push("les règles de convocation et l'établissement du procès-verbal sont fixés");
      L.push("par les textes propres au comité, l'accord d'entreprise et le règlement");
      L.push("intérieur du comité, que ce module n'a pas lus : le module « comité social");
      L.push("et économique » les traite. Une consultation menée sans délai suffisant se");
      L.push("conteste.");

      return L.concat(pied("L. 4121-3, 1°, L. 4121-3-1, R. 4121-2, L. 2312-27, L. 2317-1",
        ["LE MANQUEMENT N'EST PAS SEULEMENT CIVIL. « Le fait d'apporter une entrave à",
         "leur fonctionnement régulier est puni d'une amende de 7 500 € » (L. 2317-1).",
         "Une consultation que la loi impose et qui n'a pas eu lieu expose l'employeur",
         "à cette qualification, qu'il appartient au juge de retenir ou d'écarter, et",
         "que l'application n'anticipe pas. Le module « comité social et économique »",
         "cite le même texte dans les mêmes termes."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-DUE-08, LA TRANSMISSION AU SERVICE DE PRÉVENTION ET DE SANTÉ
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-DUE-08", {
    nom: "Le bordereau de transmission du document unique au service de prévention et de santé au travail",
    detail: "Le courrier de transmission, le bordereau, le registre des envois " +
            "et la consigne qui fait que l'envoi se répète tout seul.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, du = f.duerp || {};
      var d0 = aujourd(ctx);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Transmission du document unique au service de prévention et de santé au travail",
        "article L. 4121-3-1, VI, du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var vers = E ? leJour(d0) : "[DATE DE LA VERSION]";
        var service = X(E, E && E.spst, "NOM DU SERVICE DE PRÉVENTION ET DE SANTÉ AU TRAVAIL");
        C.push("PIÈCE 1, COURRIER DE TRANSMISSION");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push(service);
        C.push(E ? "6 rue de la Santé, " + E.adresse.split(", ").pop() : "[adresse]");
        C.push("À l'attention de " + X(E, "Docteur Marie LAURENT, médecin du travail", "médecin du travail référent / responsable du suivi de l'entreprise"));
        C.push("");
        C.push((E ? E.ville : lieu(ctx)) + ", le " + X(E, leJour(dans(d0, 3)), "date"));
        C.push("");
        C.push("Objet : transmission du document unique d'évaluation des risques");
        C.push("professionnels, version du " + vers);
        C.push("");
        C.push("Madame, Monsieur,");
        C.push("");
        C.push("En application de l'article L. 4121-3-1, VI, du code du travail, aux termes");
        C.push("duquel le document unique d'évaluation des risques professionnels est");
        C.push("transmis par l'employeur à chaque mise à jour au service de prévention et");
        C.push("de santé au travail auquel il adhère, je vous adresse ci-joint la version");
        C.push("du " + vers + " du document unique de " + nom + ".");
        C.push("");
        C.push(X(E, "Cette version fait suite à celle du " + leJour(dans(d0, -365)) + ". La note de mise à jour, qui expose ce qui a changé et sur quel fondement de R. 4121-2, est jointe.",
          "S'il s'agit d'une mise à jour : cette version fait suite à celle du [DATE]. La note de mise à jour, qui expose ce qui a changé et sur quel fondement de R. 4121-2, est jointe."));
        C.push("");
        C.push("Je vous rappelle que votre service est appelé, par le 3° de l'article");
        C.push("L. 4121-3, à apporter sa contribution à l'évaluation des risques");
        C.push("professionnels dans l'entreprise. Toute observation de votre part sur");
        C.push("cette version sera versée au dossier et examinée à la prochaine mise à");
        C.push("jour.");
        C.push("");
        C.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
        C.push("distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("Pièces jointes : document unique, version du " + vers + " ; note de mise à jour ;");
        C.push(X(E, E && E.effectif >= 50 ? "programme annuel de prévention" : "liste des actions de prévention", "programme annuel de prévention ou liste des actions"));
        C.push("");
        C.push("");

        C.push("PIÈCE 2, BORDEREAU DE TRANSMISSION");
        C.push("");
        C.push("À joindre à l'envoi et à conserver : c'est cette pièce, datée, qui prouvera");
        C.push("la transmission.");
        C.push("");
        var enteteBord = ["Rubrique", "Contenu"];
        C = C.concat(tableau(enteteBord, [
          ["Émetteur", nom + ", " + (E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège")) + ", SIRET " + (E ? E.siret : cro((ctx.profil || {}).siret, "SIRET"))],
          ["Destinataire", service],
          ["Date d'envoi", X(E, leJour(dans(d0, 3)), "DATE")],
          ["Mode d'envoi", X(E, "plateforme du service, accusé de réception automatique", "courriel avec accusé de réception / plateforme du service / lettre recommandée / remise contre récépissé")],
          ["Pièces transmises", X(E, "document unique version 2 du " + leJour(d0) + " (38 pages), note de mise à jour, inventaire par unité de travail, " + (E && E.effectif >= 50 ? "programme annuel de prévention" : "liste des actions"),
            "document unique version du [DATE], [nb] pages ; note de mise à jour ; inventaire par unité de travail ; programme annuel ou liste des actions")],
          ["Fondement", "article L. 4121-3-1, VI, du code du travail"],
          ["Émis par", sig],
          ["Accusé de réception du service", X(E, "reçu le " + leJour(dans(d0, 4)) + ", référence AR-" + d0.getFullYear() + "-0417", "le [DATE], [signature ou référence]")],
        ]));

        C.push("PIÈCE 3, REGISTRE DES TRANSMISSIONS");
        C.push("");
        C.push("Une ligne par version, non par année : deux mises à jour dans l'année font");
        C.push("deux envois.");
        C.push("");
        var enteteReg = ["Version du document unique", "Date de la version", "Transmise le", "Mode", "Accusé de réception"];
        C = C.concat(E ? tableau(enteteReg, [
          ["1", leJour(dans(d0, -365)), leJour(dans(d0, -362)), "plateforme du service", "AR-" + (d0.getFullYear() - 1) + "-0233"],
          ["2", leJour(d0), leJour(dans(d0, 3)), "plateforme du service", "AR-" + d0.getFullYear() + "-0417"],
        ]) : tableauVide(enteteReg, 3));

        C.push("PIÈCE 4, CONSIGNE PERMANENTE (interne)");
        C.push("");
        C.push(nom + ", consigne du " + X(E, leJour(d0), "date"));
        C.push("Objet : transmission systématique du document unique");
        C.push("");
        C.push("La transmission au service de prévention et de santé au travail est");
        C.push("intégrée à la procédure de mise à jour du document unique, comme sa");
        C.push("dernière étape obligatoire. Aucune version n'est réputée close tant que :");
        C.push("");
        C.push("  1. la version est datée et la précédente archivée (L. 4121-3-1, V ;");
        C.push("     R. 4121-4) ;");
        C.push("  2. le comité social et économique a été consulté (L. 4121-3, 1°) ;");
        C.push("  3. le programme annuel ou la liste d'actions a été revu si nécessaire");
        C.push("     (R. 4121-2, dernier alinéa) ;");
        C.push("  4. le document a été transmis au service de prévention et de santé au");
        C.push("     travail, bordereau à l'appui (L. 4121-3-1, VI).");
        C.push("");
        C.push("Chargé de l'envoi : " + X(E, E && E.pilote, "NOM ET FONCTION") + ". Suppléant : " + X(E, E && E.designe, "NOM") + ".");
        C.push("Service destinataire : " + service + ", " + X(E, "par sa plateforme, accusé automatique", "contact, mode d'envoi accepté") + ".");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous identifiez le service auquel");
      L.push("l'entreprise adhère et le canal d'envoi qu'il accepte.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 3)) + ", envoi de la version en vigueur, avec son");
      L.push("bordereau. Il n'y a rien à préparer : c'est un envoi.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 10)) + ", accusé de réception obtenu et classé ;");
      L.push("à défaut, relance.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 15)) + ", consigne permanente diffusée et");
      L.push("registre des transmissions ouvert. Ensuite, à chaque mise à jour du");
      L.push("document unique, un envoi de plus.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["duerp", "sst"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("« Le document unique d'évaluation des risques professionnels est transmis");
      L.push("par l'employeur à chaque mise à jour au service de prévention et de santé");
      L.push("au travail auquel il adhère » (L. 4121-3-1, VI).");
      L.push("");
      L.push("« À CHAQUE MISE À JOUR » : ce n'est pas une transmission initiale, c'est un");
      L.push("réflexe. C'est aussi la raison pour laquelle ce manquement est le plus");
      L.push("fréquent du module : le premier envoi se fait, les suivants s'oublient.");
      L.push("");
      L.push("Pourquoi ce service : parce que L. 4121-3 le compte parmi ceux qui");
      L.push("« apportent leur contribution à l'évaluation des risques professionnels");
      L.push("dans l'entreprise » (3°). Sans le document, il ne dispose pas de la pièce");
      L.push("sur laquelle cette contribution repose. Et R. 4121-4, 3°, lui ouvre par");
      L.push("ailleurs l'accès aux versions antérieures.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  - document unique : " + etat(du.existe, "existant", "INEXISTANT") +
        ", version du " + jour(du.dateDerniereMaj, "date non renseignée"));
      L.push("  - transmis au service à chaque mise à jour : " +
        etat(du.transmisSPST, "oui", "NON, c'est l'objet de ce document"));
      L.push("");
      L.push("L. 4121-3-1, VI, ne fixe pas de délai. Il rattache la transmission à la");
      L.push("mise à jour, ce qui la rend exigible dès que la version est établie.");

      return L.concat(pied("L. 4121-3-1, VI, L. 4121-3, 3°, R. 4121-2, R. 4121-4",
        ["Aucune peine n'est annoncée. R. 4741-1 ne punit que le défaut de",
         "transcription et de mise à jour « dans les conditions prévues aux articles",
         "R. 4121-1 et R. 4121-2 » : le VI de L. 4121-3-1 n'y est pas, et L. 4741-1",
         "n'atteint pas le titre II du livre Ier de la quatrième partie. Ce qui se",
         "joue est l'inexécution d'une obligation civile, et la privation, pour le",
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
        phrase: "l'effectif est sous trois cents, mais les trois autres cas, " +
                "établissement distinct d'au moins trois cents salariés, établissement " +
                "à hauts risques industriels, création imposée par l'inspecteur, ne " +
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
     SST-CTL-CSS-01, LA CRÉATION DE LA COMMISSION
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
      var ex = exempleDe(ctx), K = ex.cssct;
      var L = entete(ctx, "Commission santé, sécurité et conditions de travail, acte constitutif et première réunion",
        "articles L. 2315-36 à L. 2315-44 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        var reunion = E ? leJour(dans(d0, 75)) : "[DATE]";
        C.push("PIÈCE 1, ACTE CONSTITUTIF DE LA COMMISSION");
        C.push("");
        C.push(X(E, "Accord entre l'employeur et le comité social et économique relatif à la commission santé, sécurité et conditions de travail (L. 2315-42)",
          "INTITULÉ, choisir : « Accord d'entreprise relatif à la commission santé, sécurité et conditions de travail » (L. 2315-41) ; « Accord entre l'employeur et le comité social et économique relatif à la commission santé, sécurité et conditions de travail », en l'absence de délégué syndical (L. 2315-42) ; « Chapitre [.] du règlement intérieur du comité social et économique, commission santé, sécurité et conditions de travail » (L. 2315-44)"));
        C.push("");
        C.push(nom.toUpperCase());
        C.push("");
        C.push("PRÉAMBULE");
        C.push("");
        C.push("La commission santé, sécurité et conditions de travail est créée au sein");
        C.push("du comité social et économique de " + nom + " sur le fondement de");
        C.push(X(E, K.fondement + " (" + K.phrase + ")", fond.texte || "PRÉCISER LE FONDEMENT : L. 2315-36, 1°, 2° ou 3°, L. 2315-37, ou L. 2315-43") + ".");
        C.push("Le présent texte définit les modalités que l'article L. 2315-41 énumère");
        C.push("aux 1° à 6°.");
        C.push("");
        C.push("ARTICLE 1, NOMBRE ET PÉRIMÈTRE (L. 2315-41, 1°)");
        C.push("");
        C.push("Il est créé " + X(E, "une", "NOMBRE") + " commission, sur le périmètre suivant : " +
          X(E, "l'entreprise entière, un seul établissement", "PRÉCISER, entreprise ou établissement distinct") + ".");
        C.push("Elle comprend " + X(E, "trois", "NOMBRE") + " membres représentants du personnel, nombre qui ne");
        C.push("peut être inférieur à trois (L. 2315-39).");
        C.push("");
        C.push("ARTICLE 2, COMPOSITION ET PRÉSIDENCE (L. 2315-39)");
        C.push("");
        C.push("La commission est présidée par l'employeur ou son représentant. L'employeur");
        C.push("peut se faire assister par des collaborateurs appartenant à l'entreprise et");
        C.push("choisis en dehors du comité ; ensemble, ils ne peuvent pas être en nombre");
        C.push("supérieur à celui des représentants du personnel titulaires.");
        C.push("Les membres représentants du personnel sont désignés par le comité parmi");
        C.push("ses membres, par une résolution adoptée selon les modalités de l'article");
        C.push("L. 2315-32, pour une durée qui prend fin avec celle du mandat des membres");
        C.push("élus du comité. Au moins un membre représente le second collège ou, le cas");
        C.push("échéant, le troisième collège prévu à l'article L. 2314-11. Les");
        C.push("dispositions de l'article L. 2315-3 relatives au secret professionnel et à");
        C.push("l'obligation de discrétion sont applicables aux membres et aux");
        C.push("collaborateurs qui assistent l'employeur.");
        C.push("");
        C.push("ARTICLE 3, MISSIONS DÉLÉGUÉES (L. 2315-41, 2° ; limites de L. 2315-38)");
        C.push("");
        C.push("Le comité délègue à la commission : " + X(E, "les inspections périodiques des locaux, les enquêtes après accident ou danger grave et imminent, l'analyse des risques et la préparation des délibérations du comité sur le document unique et le programme annuel de prévention",
          "PRÉCISER, une par une, les attributions relatives à la santé, à la sécurité et aux conditions de travail") + ".");
        C.push("Cette délégation ne porte, en aucun cas, sur le recours à un expert prévu");
        C.push("à la sous-section 10 ni sur les attributions consultatives du comité");
        C.push("(L. 2315-38, d'ordre public : Soc., 13 mai 2026, n° 25-12.560).");
        C.push("");
        C.push("ARTICLE 4, FONCTIONNEMENT ET HEURES DE DÉLÉGATION (L. 2315-41, 3°)");
        C.push("");
        C.push(X(E, "La commission se réunit quatre fois par an, sur convocation du président adressée huit jours avant avec l'ordre du jour ; le procès-verbal est rédigé par le secrétaire de la commission sous quinze jours et diffusé au comité ; le médecin du travail est invité à chaque réunion ; les visites de postes se font sur préavis de trois jours.",
          "FIXER : fréquence et convocation des réunions, délai de transmission de l'ordre du jour, qui établit le procès-verbal et dans quel délai, qui peut être invité, modalités des visites et des enquêtes."));
        C.push("Chaque membre dispose de " + X(E, "cinq", "NOMBRE") + " heures de délégation par mois pour l'exercice");
        C.push("de ses missions au sein de la commission.");
        C.push("");
        C.push("ARTICLE 5, FORMATION (L. 2315-41, 4° et 6°)");
        C.push("");
        C.push("Les modalités de formation des membres sont fixées conformément aux");
        C.push("articles L. 2315-16 à L. 2315-18 : " + X(E, "organisme agréé retenu par le comité, sessions dans les trois mois de la désignation, frais pris en charge par l'employeur",
          "PRÉCISER l'organisme, le calendrier, les modalités de prise en charge") + ".");
        C.push("Formation spécifique aux risques de l'activité : " + X(E, "une journée sur les risques de l'unité « " + (E && E.unites[0].nom) + " », tirés du document unique",
          "PRÉCISER, ou supprimer cet alinéa") + ".");
        C.push("");
        C.push("ARTICLE 6, MOYENS (L. 2315-41, 5°)");
        C.push("");
        C.push(X(E, "Salle de réunion et armoire fermée mises à disposition, accès au document unique, aux rapports de vérification et aux locaux, temps de déplacement entre sites compté en heures de délégation.",
          "LE CAS ÉCHÉANT : local, matériel, accès aux documents, temps de déplacement, budget. Ce qui n'est pas écrit ne sera pas dû."));
        C.push("");
        C.push("ARTICLE 7, DURÉE ET RÉVISION");
        C.push("");
        C.push(X(E, "L'accord est conclu pour la durée du mandat des membres élus du comité et se révise par accord entre l'employeur et le comité, adopté à la majorité des membres titulaires élus.",
          "Durée, révision, dénonciation, selon l'étage retenu."));
        C.push("");
        C.push("Fait à " + ville + ", le " + X(E, leJour(dans(d0, 45)), "DATE"));
        C.push("Pour l'employeur : " + sig);
        C.push(X(E, "Adopté par le comité social et économique à la majorité de ses membres titulaires élus, réunion du " + leJour(dans(d0, 45)) + ", 4 voix sur 4.",
          "Signatures des organisations syndicales représentatives / mention de l'adoption à la majorité des membres titulaires élus / référence de la délibération adoptant le règlement intérieur du comité"));
        C.push("");
        C.push("");

        C.push("PIÈCE 2, RÉSOLUTION DU COMITÉ DÉSIGNANT LES MEMBRES");
        C.push("");
        C.push("RÉSOLUTION N° " + X(E, "7", ".") + ", DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ,");
        C.push("SÉCURITÉ ET CONDITIONS DE TRAVAIL");
        C.push("Réunion du comité social et économique du " + X(E, leJour(dans(d0, 60)), "DATE") + ".");
        C.push("");
        C.push("Le comité social et économique, après en avoir délibéré, désigne parmi");
        C.push("ses membres, pour siéger à la commission santé, sécurité et conditions");
        C.push("de travail, pour une durée qui prend fin avec celle du mandat des");
        C.push("membres élus du comité (L. 2315-39) :");
        C.push("");
        var enteteMembres = ["Membre désigné", "Titulaire ou suppléant au comité", "Collège"];
        C = C.concat(E ? tableau(enteteMembres, K.membres) : tableauVide(enteteMembres, 3));
        C.push("Le comité constate que " + X(E, K.membres[0][0], "NOM") + " représente le second collège, comme");
        C.push("L. 2315-39 l'exige.");
        C.push("Votants : " + X(E, "4", "..") + ". Pour : " + X(E, "4", "..") + ". Contre : " + X(E, "0", "..") + ". Abstentions : " + X(E, "0", "..") + ".");
        C.push("Le président n'a pas pris part au vote (L. 2315-32). Résolution adoptée");
        C.push("à la majorité des membres présents.");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, CONVOCATION À LA PREMIÈRE RÉUNION DE LA COMMISSION");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la commission santé, sécurité et conditions de travail");
        C.push("Copie : aux membres de la délégation du personnel du comité social et");
        C.push("économique");
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 65)), "date"));
        C.push("");
        C.push("Objet : convocation à la réunion de la commission santé, sécurité et");
        C.push("conditions de travail du " + reunion);
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("J'ai l'honneur de vous convoquer à la réunion de la commission santé,");
        C.push("sécurité et conditions de travail, qui se tiendra le " + reunion + ", à " + X(E, "9 h 30", "HEURE") + ",");
        C.push(X(E, "en salle de réunion du siège", "à [LIEU PRÉCIS]") + ". L'ordre du jour figure ci-après ; les documents");
        C.push("s'y rapportant vous sont transmis avec la présente.");
        C.push("");
        C.push("Je serai assisté de " + X(E, K.collaborateur, "NOM, fonction") + ", collaborateur appartenant à");
        C.push("l'entreprise et choisi en dehors du comité. Le nombre de collaborateurs qui");
        C.push("m'assistent ne peut, avec moi, excéder celui des représentants du");
        C.push("personnel titulaires (L. 2315-39).");
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 4, ORDRE DU JOUR DE LA PREMIÈRE RÉUNION");
        C.push("");
        C.push("COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
        C.push(nom.toUpperCase() + ", réunion du " + reunion);
        C.push("");
        C.push("  1. Installation de la commission, rappel du texte constitutif, du");
        C.push("     périmètre et de la résolution de désignation.");
        C.push("  2. Rappel des limites de la délégation : le recours à un expert et les");
        C.push("     attributions consultatives du comité restent au comité (L. 2315-38).");
        C.push("  3. Formation des membres, état des formations suivies et à programmer");
        C.push("     (L. 2315-18 ; L. 2315-41, 4° et 6°).");
        C.push("  4. Document unique d'évaluation des risques professionnels : la");
        C.push("     commission apporte sa contribution à l'évaluation (L. 4121-3, 1°).");
        C.push("     Version examinée : du " + X(E, leJour(d0), "DATE") + ".");
        C.push("  5. Programme annuel de prévention ou liste des actions, examen");
        C.push("     préparatoire à l'avis du comité (L. 4121-3-1, III ; L. 2312-27).");
        C.push("  6. " + X(E, "Accident du " + leJour(dans(d0, -30)) + " à l'unité « " + (E && E.unites[0].nom) + " » (" + (E && E.unites[0].lignes[0][0].toLowerCase()) + ") : analyse et suites.",
          "Points propres à l'entreprise : accidents et incidents survenus, visites de postes, signalements, alertes, suites données."));
        C.push("  7. Calendrier des prochaines réunions et des visites.");
        C.push("  8. Questions diverses.");
        C.push("");
        C.push("");

        C.push("PIÈCE 5, TRAME DE PROCÈS-VERBAL DE LA COMMISSION");
        C.push("");
        C.push("COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
        C.push(nom.toUpperCase());
        C.push("PROCÈS-VERBAL DE LA RÉUNION DU " + (E ? reunion.toUpperCase() : "[DATE]"));
        C.push("");
        C.push("PRÉSIDENCE : " + sig + ".");
        C.push("MEMBRES PRÉSENTS : " + X(E, K.membres.map(function (m) { return m[0] + " (" + m[2] + " collège)"; }).join(" ; "), "NOM, collège ; NOM, collège ; NOM, collège") + ".");
        C.push("MEMBRES ABSENTS EXCUSÉS : " + X(E, "aucun", ".....") + ".");
        C.push("COLLABORATEUR ASSISTANT L'EMPLOYEUR : " + X(E, K.collaborateur, "NOM, fonction") + ". Leur nombre,");
        C.push("président compris, n'excède pas celui des représentants du personnel");
        C.push("titulaires (L. 2315-39).");
        C.push("INVITÉS : " + X(E, "Docteur Marie LAURENT, médecin du travail", "le cas échéant") + ".");
        C.push("Ouverture à " + X(E, "9 h 30", "HEURE") + ".");
        C.push("");
        var enteteOdj = ["Point", "Exposé", "Observations des membres", "Suites"];
        C = C.concat(E ? tableau(enteteOdj, [
          ["1. Installation", "lecture de l'accord et de la résolution n° 7", "aucune", "texte remis à chaque membre"],
          ["2. Limites de la délégation", "L. 2315-38 rappelé", "Mme BENALI demande la procédure de saisine du comité", "note de circuit à rédiger pour la prochaine réunion"],
          ["3. Formation", "aucun membre formé", "demande de sessions avant la fin de l'année", "organisme sollicité, dates au " + leJour(dans(d0, 90))],
          ["4. Document unique", "présentation de la version du " + leJour(d0), "M. TISSIER signale l'unité « " + E.unites[1].nom + " »", "visite fixée au " + leJour(dans(d0, 95))],
          ["6. Accident du " + leJour(dans(d0, -30)), "analyse des causes", "arbre des causes demandé", "mesure ajoutée au programme, échéance " + leJour(dans(d0, 120))],
        ]) : tableauVide(enteteOdj, 3));
        C.push("PROPOSITIONS DE LA COMMISSION AU COMITÉ : " + X(E, "avancer l'échéance de la mesure « " + (E && E.unites[0].lignes[0][3].split(",")[0]) + " » ; aucune proposition d'expertise.",
          "la commission propose ; elle ne décide pas à la place du comité. Toute proposition d'expertise se transmet au comité, à qui la décision appartient."));
        C.push("CLÔTURE à " + X(E, "11 h 45", "HEURE") + ". Prochaine réunion : " + X(E, leJour(dans(d0, 165)), "DATE") + ".");
        C.push("Établi par " + X(E, K.membres[0][0] + ", secrétaire de la commission", "NOM") + ", le " + X(E, leJour(dans(d0, 80)), "DATE") + ".");
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Conclusion tirée de votre dossier : " + fond.phrase + (fond.texte ? " (" + fond.texte + ")" : "") + ".");
      if (fond.due === null) {
        L.push("L'application ne tranche pas : portez les quatre réponses (effectif,");
        L.push("établissement distinct, établissement à hauts risques, création imposée");
        L.push("par l'inspecteur) avant de conclure.");
      }
      if (estNon(cse.existe)) {
        L.push("ATTENTION, le dossier n'indique aucun comité social et économique. La");
        L.push("commission est créée AU SEIN du comité (L. 2315-36) et ses membres sont");
        L.push("désignés par lui parmi ses membres (L. 2315-39) : elle ne peut pas");
        L.push("exister sans lui.");
      }
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous établissez le fondement sur lequel");
      L.push("la commission est due et vous choisissez l'étage : accord d'entreprise,");
      L.push("accord avec le comité, ou règlement intérieur du comité.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 15)) + " environ, projet de texte constitutif");
      L.push("rédigé (pièce 1), avec les six points de L. 2315-41.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 45)) + " environ, texte adopté. Une négociation");
      L.push("d'accord prend plus longtemps qu'une délibération de règlement intérieur :");
      L.push("comptez deux à trois mois pour un accord d'entreprise.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 60)) + " environ, résolution de désignation des");
      L.push("membres par le comité (pièce 2), avec le décompte des voix.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 75)) + " environ, convocation et première réunion");
      L.push("(pièces 3 à 5). Puis sans attendre, formation des membres (L. 2315-18).");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("CE QUE LE DOSSIER DÉCLARE");
      L.push("");
      L.push("  - " + ligneEffectif(ctx));
      L.push("  - établissement distinct d'au moins trois cents salariés : " +
        etat(f.etablissementDistinct300, "OUI", "non"));
      L.push("  - établissement relevant de L. 4521-1 et suivants : " +
        etat(f.etablissementRisqueParticulier, "OUI", "non"));
      L.push("  - création imposée par l'inspecteur du travail : " +
        etat(f.cssctImposeeInspection, "OUI", "non"));
      L.push("  - commission existante : " + etat(c.existe, "oui", "NON"));
      L.push("  - comité social et économique : " + etat(cse.existe, "existant", "AUCUN DÉCLARÉ"));
      L.push("");
      L.push("HORS OBLIGATION : « En dehors des cas prévus aux articles L. 2315-36 et");
      L.push("L. 2315-37, l'accord d'entreprise défini à l'article L. 2313-2 ou, en");
      L.push("l'absence de délégué syndical, un accord entre l'employeur et le comité");
      L.push("social et économique, adopté à la majorité des membres titulaires élus de");
      L.push("la délégation du personnel du comité, peut fixer le nombre et le périmètre");
      L.push("de mise en place de la ou des commissions santé, sécurité et conditions de");
      L.push("travail et définir les modalités mentionnées aux 1° à 6° de l'article");
      L.push("L. 2315-41 » (L. 2315-43). Et L. 2315-44, deuxième alinéa : « En l'absence");
      L.push("d'accord prévu à l'article L. 2315-43, l'employeur peut fixer le nombre et");
      L.push("le périmètre de mise en place d'une ou plusieurs commissions ».");
      L.push("");
      L = L.concat(blocEtages(ctx));
      L.push("LA COMPOSITION ET LA DÉSIGNATION");
      L.push("");
      L.push("« Elle comprend au minimum trois membres représentants du personnel, dont");
      L.push("au moins un représentant du second collège, ou le cas échéant du troisième");
      L.push("collège prévus à l'article L. 2314-11 » (L. 2315-39). La désignation");
      L.push("appartient au comité, « par une résolution adoptée selon les modalités");
      L.push("définies à l'article L. 2315-32 » (L. 2315-39), c'est-à-dire « à la");
      L.push("majorité des membres présents », le président ne participant pas au vote");
      L.push("« lorsqu'il consulte les membres élus du comité en tant que délégation du");
      L.push("personnel » (L. 2315-32). « La désignation des membres d'une CSSCT, que sa");
      L.push("mise en place soit obligatoire ou conventionnelle, résulte d'un vote des");
      L.push("membres du CSE à la majorité des voix des membres présents lors du vote,");
      L.push("sans qu'il soit besoin d'une résolution préalable fixant les modalités de");
      L.push("l'élection » (Soc., 27 novembre 2019, n° 19-14.224, publié).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-3 et L. 2314-3",
        "sont nommés par L. 2315-39, le premier pour le secret professionnel et " +
        "l'obligation de discrétion, le second pour les réunions de la commission " +
        "lorsque l'accord lui confie tout ou partie des attributions du comité"));
      L.push("LA DÉLÉGATION ET SES LIMITES");
      L.push("");
      L.push("« La commission santé, sécurité et conditions de travail se voit confier,");
      L.push("par délégation du comité social et économique, tout ou partie des");
      L.push("attributions du comité relatives à la santé, à la sécurité et aux");
      L.push("conditions de travail, à l'exception du recours à un expert prévu à la");
      L.push("sous-section 10 et des attributions consultatives du comité »");
      L.push("(L. 2315-38). Ces dispositions sont d'ordre public (Soc., 13 mai 2026,");
      L.push("n° 25-12.560). Le comité peut décider d'une expertise « le cas échéant sur");
      L.push("proposition des commissions constituées en son sein » (Soc., 18 mars 2026,");
      L.push("n° 23-22.270, publié).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-16 et L. 2315-17",
        "sont nommés par L. 2315-41, 4°, aux côtés de L. 2315-18, seul des trois que " +
        "l'application ait lu"));
      L.push("Ni le délai de convocation, ni celui de transmission de l'ordre du jour, ni");
      L.push("le rédacteur du procès-verbal ne sont fixés par les textes lus : ils");
      L.push("relèvent de l'article 4 du texte constitutif, « leurs modalités de");
      L.push("fonctionnement » au sens de L. 2315-41, 3°. Écrivez-les là, et tenez-les.");

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
         "l'invoque pas non plus pour les autres contrôles de la commission, la",
         "composition, les modalités, la délégation, la formation, le remplacement",
         "des membres, qui sont des irrégularités que le juge annule, non des faits",
         "que ce texte pénal désigne."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-02, LA COMPOSITION DE LA COMMISSION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-02", {
    nom: "La résolution rectificative de désignation, composition conforme à L. 2315-39",
    detail: "Les quatre exigences confrontées au dossier, la résolution à " +
            "reprendre, la note sur les collèges et le rappel de discrétion.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var n = (c.nbMembres === "" || c.nbMembres == null) ? null : Number(c.nbMembres);
      var ex = exempleDe(ctx), K = ex.cssct;
      var L = entete(ctx, "Composition de la commission santé, sécurité et conditions de travail",
        "article L. 2315-39 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        C.push("PIÈCE 1, NOTE SUR LES COLLÈGES (à lire avant de désigner)");
        C.push("");
        C.push("Relevé sur les résultats des dernières élections du " + X(E, leJour(dans(d0, -500)), "DATE") + " :");
        C.push("");
        var enteteCol = ["Collège", "Institué ?", "Élus titulaires", "Élus suppléants"];
        C = C.concat(E ? tableau(enteteCol, [
          ["1er collège, ouvriers et employés", "oui", "M. Marc TISSIER, Mme Julie ROUX", "M. Sofiane KHELIF, Mme Fatou NDIAYE"],
          ["2e collège, techniciens, agents de maîtrise, cadres", "oui", "Mme Aïcha BENALI", "M. Hugo LEROY"],
          ["3e collège, ingénieurs et cadres", "non, moins de vingt-cinq cadres", "sans objet", "sans objet"],
        ]) : tableauVide(enteteCol, 3));
        C.push("Conséquence : un siège au moins revient à un élu du " + X(E, "second collège (Mme BENALI ou M. LEROY)", "second collège ou, s'il existe, du troisième") + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, RÉSOLUTION RECTIFICATIVE DU COMITÉ");
        C.push("");
        C.push("RÉSOLUTION N° " + X(E, "9", ".") + ", DÉSIGNATION DES MEMBRES DE LA COMMISSION SANTÉ,");
        C.push("SÉCURITÉ ET CONDITIONS DE TRAVAIL (rectificative)");
        C.push("Réunion du comité social et économique du " + X(E, leJour(dans(d0, 20)), "DATE") + ".");
        C.push("");
        C.push("Vu l'article L. 2315-39 du code du travail, dont les dispositions sont");
        C.push("d'ordre public ; vu l'article L. 2315-32 du même code ; vu " +
          X(E, "l'accord entre l'employeur et le comité du " + leJour(dans(d0, -400)), "le texte constitutif de la commission : accord ou règlement intérieur du comité") + " ;");
        C.push("");
        C.push("Constatant que la composition issue de la désignation du " + X(E, leJour(dans(d0, -380)), "DATE") + " ne");
        C.push("satisfait pas " + X(E, "l'exigence d'un représentant du second collège, les trois membres désignés relevant du premier collège",
          "PRÉCISER LAQUELLE DES QUATRE EXIGENCES : nombre inférieur à trois / absence de représentant du second ou du troisième collège / désignation faite autrement que par résolution du comité / présidence") + " ;");
        C.push("");
        C.push("Le comité social et économique, après en avoir délibéré, désigne parmi");
        C.push("ses membres, pour siéger à la commission santé, sécurité et conditions");
        C.push("de travail, pour une durée qui prend fin avec celle du mandat des");
        C.push("membres élus du comité :");
        C.push("");
        var enteteMembres = ["Membre désigné", "Titulaire ou suppléant au comité", "Collège"];
        C = C.concat(E ? tableau(enteteMembres, K.membres) : tableauVide(enteteMembres, 3));
        C.push("Votants : " + X(E, "4", "..") + ". Pour : " + X(E, "3", "..") + ". Contre : " + X(E, "0", "..") + ". Abstentions : " + X(E, "1", "..") + ".");
        C.push("Le président n'a pas pris part au vote (L. 2315-32). Résolution adoptée");
        C.push("à la majorité des membres présents.");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, NOTE DE L'EMPLOYEUR : PRÉSIDENCE ET COLLABORATEURS");
        C.push("");
        C.push(nom + ", note du " + X(E, leJour(dans(d0, 7)), "date"));
        C.push("Objet : présidence de la commission santé, sécurité et conditions de");
        C.push("travail et assistance de l'employeur");
        C.push("");
        C.push("1. La commission est présidée par " + X(E, sig + " en personne", "l'employeur / son représentant : NOM, qualité, désigné par [acte, daté]") + ".");
        C.push("   L. 2315-39 ne connaît que ces deux possibilités.");
        C.push("2. Collaborateur assistant l'employeur : " + X(E, K.collaborateur, "NOMS et fonctions") + ". Il appartient à");
        C.push("   l'entreprise et est choisi en dehors du comité.");
        C.push("3. Règle de nombre, vérifiée avant chaque réunion :");
        C.push("");
        var enteteNb = ["Représentants du personnel titulaires", "Employeur et collaborateurs présents", "Le second n'excède pas le premier ?"];
        C = C.concat(E ? tableau(enteteNb, [["2 (Mme BENALI, M. TISSIER)", "2 (président et " + K.collaborateur.split(",")[0] + ")", "oui, 2 pour 2"]]) : tableauVide(enteteNb, 1));
        C.push("4. Secret professionnel et obligation de discrétion : les dispositions de");
        C.push("   l'article L. 2315-3 sont applicables aux membres et aux collaborateurs");
        C.push("   (L. 2315-39, dernier alinéa).");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 4, RAPPEL ÉCRIT AUX MEMBRES ET AUX COLLABORATEURS");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la commission santé, sécurité et conditions de travail");
        C.push("et aux collaborateurs assistant l'employeur");
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 21)), "date"));
        C.push("");
        C.push("Objet : secret professionnel et obligation de discrétion");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("Le dernier alinéa de l'article L. 2315-39 du code du travail rend");
        C.push("applicables aux membres de la commission santé, sécurité et conditions de");
        C.push("travail, ainsi qu'aux collaborateurs qui assistent l'employeur, les");
        C.push("dispositions de l'article L. 2315-3 relatives au secret professionnel et à");
        C.push("l'obligation de discrétion.");
        C.push("");
        C.push(X(E, "Les informations présentées comme confidentielles par l'employeur, et celles relatives aux procédés de fabrication, ne sont divulguées ni à l'extérieur ni aux salariés non membres.",
          "Le contenu de l'article L. 2315-3 n'a pas été lu par l'application : reportez-vous en au texte avant de préciser ici l'étendue de ces obligations."));
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Une désignation irrégulière ne se corrige pas par une note de l'employeur :");
      L.push("elle se refait par une résolution du comité. Relevez d'abord les collèges");
      L.push("(pièce 1) : sans cette lecture, la désignation se fait à l'aveugle.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous relevez sur les résultats des");
      L.push("dernières élections le nombre de collèges et les élus de chacun (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ, l'employeur écrit sa note de");
      L.push("présidence et arrête la liste de ses collaborateurs (pièce 3).");
      L.push("");
      L.push("À la prochaine réunion du comité, résolution rectificative (pièce 2),");
      L.push("avec le décompte des voix. La désignation appartient au comité : elle ne");
      L.push("peut pas se faire plus tôt. Dans la foulée, rappel écrit du secret");
      L.push("professionnel et de l'obligation de discrétion (pièce 4).");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("  1. Présidence par l'employeur ou son représentant : " +
        etat(c.presideeEmployeur, "oui", "NON, à rétablir"));
      L.push("  2. Trois membres au minimum : " +
        (n != null && isFinite(n)
          ? n + " membre(s) déclaré(s)" + (n < 3 ? ", INSUFFISANT" : ", le minimum est atteint")
          : "[nombre non renseigné]"));
      L.push("  3. Un membre du second collège au moins (ou du troisième) : " +
        etat(c.membreSecondCollege, "oui", "NON, à rétablir"));
      L.push("  4. Désignation par le comité, parmi ses membres, par résolution");
      L.push("     adoptée selon L. 2315-32 : " + etat(c.designesParCSE, "oui", "NON, à refaire"));
      L.push("");
      L.push("LES COLLÈGES");
      L.push("");
      L.push("L. 2314-11 : « Les membres de la délégation du personnel du comité social");
      L.push("et économique sont élus sur des listes établies par les organisations");
      L.push("syndicales pour chaque catégorie de personnel :, d'une part, par le");
      L.push("collège des ouvriers et employés ;, d'autre part, par le collège des");
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
      L.push("La désignation « résulte d'un vote des membres du CSE à la majorité des");
      L.push("voix des membres présents lors du vote, sans qu'il soit besoin d'une");
      L.push("résolution préalable fixant les modalités de l'élection » (Soc.,");
      L.push("27 novembre 2019, n° 19-14.224, publié).");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-3",
        "est nommé par L. 2315-39 pour le secret professionnel et l'obligation de " +
        "discrétion ; l'application ne l'a pas capté et n'en écrit donc pas le régime"));

      return L.concat(pied("L. 2315-39, L. 2315-32, L. 2314-11, L. 2315-38",
        ["Décisions citées, lues à la source dans la base Judilibre de la Cour de",
         "cassation le 21 août 2026, réponse non relaxée : Soc., 27 novembre 2019,",
         "n° 19-14.224, publié ; Soc., 26 février 2025, n° 24-12.295, publié ; Soc.,",
         "11 février 2026, n° 24-16.408.",
         "",
         "Aucune peine n'est annoncée : L. 2317-1 punit l'entrave à la constitution du",
         "comité, à la libre désignation de ses membres et à son fonctionnement",
         "régulier, non l'irrégularité de la composition d'une commission, dont la",
         "désignation appartient d'ailleurs au comité et non à l'employeur. Ce qui se",
         "joue est l'annulation de la désignation."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-03, LES MODALITÉS DE LA COMMISSION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-03", {
    nom: "Le texte qui fixe les six points de L. 2315-41",
    detail: "Les trois étages, le texte rédigé point par point, la délibération " +
            "d'adoption du règlement intérieur du comité et la notification.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var fond = fondementCommission(ctx);
      var ex = exempleDe(ctx), K = ex.cssct;
      var L = entete(ctx, "Modalités de la commission santé, sécurité et conditions de travail",
        "articles L. 2315-41 à L. 2315-44 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        C.push("PIÈCE 1, LES SIX POINTS, RÉDIGÉS");
        C.push("");
        C.push(X(E, "Chapitre 5 du règlement intérieur du comité social et économique : commission santé, sécurité et conditions de travail (L. 2315-44)", "Intitulé, selon l'étage retenu"));
        C.push(nom.toUpperCase());
        C.push("");
        var enteteSix = ["Point de L. 2315-41", "Ce que le texte fixe"];
        C = C.concat(E ? tableau(enteteSix, [
          ["1° Nombre de membres", "trois membres représentants du personnel, dont un au moins du second collège ; une seule commission, sur le périmètre de l'entreprise"],
          ["2° Missions déléguées et modalités d'exercice", "inspections trimestrielles des locaux, enquêtes après accident ou danger grave et imminent, analyse des risques, préparation des délibérations du comité sur le document unique et le programme annuel ; la commission saisit le comité par un rapport écrit remis huit jours avant sa réunion ; ni le recours à un expert ni les attributions consultatives ne sont délégués (L. 2315-38)"],
          ["3° Fonctionnement et heures de délégation", "quatre réunions par an, convoquées par le président huit jours avant avec l'ordre du jour ; procès-verbal par le secrétaire de la commission sous quinze jours ; visites sur préavis de trois jours ; cinq heures de délégation par mois et par membre"],
          ["4° Formation (L. 2315-16 à L. 2315-18)", "organisme agréé retenu par le comité, sessions dans les trois mois de la désignation, durée minimale de L. 2315-18, frais et salaires pris en charge par l'employeur"],
          ["5° Moyens alloués", "salle de réunion, armoire fermée, accès au document unique, aux rapports de vérification et à tous les locaux, temps de déplacement entre sites compté en heures de délégation"],
          ["6° Formation spécifique aux risques de l'activité", "une journée sur les risques de l'unité « " + E.unites[0].nom + " » (" + E.unites[0].lignes[0][0].toLowerCase() + ", " + E.unites[0].lignes[1][0].toLowerCase() + "), tirés du document unique"],
        ]) : tableau(enteteSix, [
          ["1° Nombre de membres", "[NOMBRE, au moins trois (L. 2315-39) ; le cas échéant, nombre de commissions et périmètres]"],
          ["2° Missions déléguées et modalités d'exercice", "[ÉNUMÉRER, une par une, les attributions confiées ; comment la commission saisit le comité, sous quelle forme, dans quels délais ; ni le recours à un expert ni les attributions consultatives (L. 2315-38)]"],
          ["3° Fonctionnement et heures de délégation", "[réunions : nombre par an, qui convoque, délais ; procès-verbal : rédacteur, délai, adoption ; visites ; NOMBRE d'heures de délégation par mois et par membre]"],
          ["4° Formation (L. 2315-16 à L. 2315-18)", "[organisme, calendrier, durée par membre, prise en charge]"],
          ["5° Moyens alloués", "[local, matériel, accès aux documents et aux locaux, temps de déplacement, budget ; ce qui n'est pas écrit ne sera pas dû]"],
          ["6° Formation spécifique aux risques de l'activité", "[PRÉCISER LESQUELS, à partir de votre document unique, puis le contenu, la durée et l'organisme]"],
        ]));
        C.push("Fait à " + ville + ", le " + X(E, leJour(dans(d0, 30)), "DATE"));
        C.push("Pour l'employeur : " + sig);
        C.push(X(E, "Adopté par délibération du comité social et économique n° 11 du " + leJour(dans(d0, 30)) + ".", "Signatures ou mention du mode d'adoption, selon l'étage retenu"));
        C.push("");
        C.push("");

        C.push("PIÈCE 2, DÉLIBÉRATION DU COMITÉ ADOPTANT SON RÈGLEMENT INTÉRIEUR");
        C.push("(troisième étage, L. 2315-44)");
        C.push("");
        C.push("DÉLIBÉRATION N° " + X(E, "11", ".") + ", RÈGLEMENT INTÉRIEUR DU COMITÉ : CHAPITRE RELATIF");
        C.push("À LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL");
        C.push("Réunion du comité social et économique du " + X(E, leJour(dans(d0, 30)), "DATE") + ".");
        C.push("");
        C.push("Vu l'article L. 2315-44 du code du travail, aux termes duquel, en");
        C.push("l'absence d'accord prévu aux articles L. 2315-41 et L. 2315-42, le");
        C.push("règlement intérieur du comité social et économique définit les modalités");
        C.push("mentionnées aux 1° à 6° de l'article L. 2315-41 ;");
        C.push("Constatant qu'aucun accord d'entreprise (L. 2315-41) ni accord entre");
        C.push("l'employeur et le comité (L. 2315-42) ne fixe ces modalités ;");
        C.push("Le comité adopte le chapitre " + X(E, "5", ".") + " de son règlement intérieur, dont le texte");
        C.push("figure en annexe, définissant les six points de L. 2315-41.");
        C.push("Votants : " + X(E, "4", "..") + ". Pour : " + X(E, "4", "..") + ". Contre : " + X(E, "0", "..") + ". Abstentions : " + X(E, "0", "..") + ".");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, NOTIFICATION DU TEXTE AUX MEMBRES");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la commission santé, sécurité et conditions de travail");
        C.push("Copie : aux membres de la délégation du personnel du comité social et");
        C.push("économique");
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 33)), "date"));
        C.push("");
        C.push("Objet : modalités de la commission santé, sécurité et conditions de");
        C.push("travail, texte applicable");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("Je vous transmets ci-joint " + X(E, "le chapitre 5 du règlement intérieur du comité", "l'accord d'entreprise / l'accord conclu avec le comité social et économique / le chapitre du règlement intérieur du comité") + " fixant");
        C.push("les modalités de mise en place et de fonctionnement de la commission");
        C.push("santé, sécurité et conditions de travail, adopté le " + X(E, leJour(dans(d0, 30)), "DATE") + ".");
        C.push("");
        C.push("Ce texte définit les six points énumérés à l'article L. 2315-41 du code du");
        C.push("travail : le nombre de membres, les missions déléguées et leurs modalités");
        C.push("d'exercice, les modalités de fonctionnement et le nombre d'heures de");
        C.push("délégation, les modalités de formation, les moyens alloués et, le cas");
        C.push("échéant, la formation spécifique correspondant aux risques particuliers de");
        C.push("l'activité. C'est ce texte qui établira l'étendue de la délégation reçue");
        C.push("du comité : conservez-le.");
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("Pièce jointe : le texte adopté");
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOTRE TEXTE, À COMPLÉTER");
      L.push("");
      L.push("Ce que le dossier déclare : commission " + etat(c.existe, "existante", "INEXISTANTE") +
        " ; modalités fixées par " +
        (c.modalitesFixees ? "« " + c.modalitesFixees + " »" : "[SOURCE NON RENSEIGNÉE]") + ".");
      L.push("Fondement de la commission : " + fond.phrase +
        (fond.texte ? " (" + fond.texte + ")" : "") + ".");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous établissez lequel des trois étages");
      L.push("s'applique : y a-t-il un délégué syndical, et un accord a-t-il été engagé ?");
      L.push("");
      L.push("Au " + leJour(dans(d0, 10)) + " environ, projet rédigé, les six points");
      L.push("couverts (pièce 1).");
      L.push("");
      L.push("Si l'étage retenu est le règlement intérieur du comité : à la prochaine");
      L.push("réunion du comité, délibération d'adoption (pièce 2). Si l'étage retenu");
      L.push("est un accord : au " + leJour(dans(d0, 75)) + " environ, deux à trois mois de");
      L.push("négociation. Dans les jours qui suivent l'adoption, notification aux");
      L.push("membres (pièce 3).");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      L.push("LES RÈGLES");
      L.push("");
      L.push("Tant que rien ne fixe les modalités, la commission ne peut démontrer ni ce");
      L.push("qu'elle est en droit de faire, ni de combien d'heures ses membres");
      L.push("disposent, ni quelle formation leur est due.");
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
      L.push("troisième alinéas). L'employeur peut fixer le nombre et le périmètre ; les");
      L.push("modalités, elles, reviennent au règlement intérieur du comité.");
      L.push("");
      L.push("LES SIX POINTS");
      L.push("");
      L.push("Le nombre de membres ne peut être inférieur à trois (L. 2315-39). La");
      L.push("délégation ne peut porter ni sur le recours à un expert prévu à la");
      L.push("sous-section 10, ni sur les attributions consultatives du comité");
      L.push("(L. 2315-38), texte d'ordre public (Soc., 13 mai 2026, n° 25-12.560).");
      L.push("L. 2315-18, seul des trois articles de formation que l'application ait lu,");
      L.push("fixe des durées minimales : cinq jours lors du premier mandat des membres");
      L.push("de la délégation du personnel ; en cas de renouvellement, trois jours pour");
      L.push("chaque membre quelle que soit la taille de l'entreprise, et cinq jours");
      L.push("pour les membres de la commission dans les entreprises d'au moins trois");
      L.push("cents salariés ; le financement est pris en charge par l'employeur. Les");
      L.push("moyens (5°) et la formation spécifique (6°) sont « le cas échéant » : ce");
      L.push("qui n'est pas écrit ne sera pas dû, et ce qui est écrit le sera.");
      L.push("");
      L = L.concat(blocRenvoi("L. 2315-16 et L. 2315-17",
        "sont nommés par L. 2315-41, 4° ; l'application ne les a pas captés et n'en " +
        "écrit donc rien"));
      L.push("Les règles d'adoption et de modification du règlement intérieur du comité");
      L.push("relèvent du module « comité social et économique » de l'application : ce");
      L.push("module-ci ne les a pas lues et ne les écrit pas.");

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
     SST-CTL-CSS-04, LES LIMITES DE LA DÉLÉGATION
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-04", {
    nom: "L'avenant ramenant la délégation dans les limites de L. 2315-38",
    detail: "La clause à reprendre, l'avenant, le circuit rétabli entre la " +
            "commission et le comité, et la reprise des avis déjà rendus.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var ex = exempleDe(ctx);
      var L = entete(ctx, "Délégation confiée à la commission, retour dans les limites de L. 2315-38",
        "article L. 2315-38 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        C.push("PIÈCE 1, RELECTURE DE LA CLAUSE DE DÉLÉGATION");
        C.push("");
        var enteteClause = ["Clause examinée (recopiée mot à mot)", "Dépasse-t-elle L. 2315-38 ?", "Réécriture"];
        C = C.concat(E ? tableau(enteteClause, [
          ["« La commission rend, au nom du comité, l'avis sur le programme annuel de prévention. »", "oui, attribution consultative déléguée", "« La commission prépare l'examen du programme annuel de prévention ; l'avis est rendu par le comité. »"],
          ["« La commission peut décider du recours à un expert habilité en cas de risque grave. »", "oui, recours à l'expert délégué", "« La commission peut proposer au comité le recours à un expert ; la décision appartient au comité. »"],
          ["« La commission procède aux inspections et aux enquêtes prévues par le code du travail. »", "non", "inchangée"],
        ]) : tableauVide(enteteClause, 3));
        C.push("");

        C.push("PIÈCE 2, AVENANT, OU MODIFICATION DU RÈGLEMENT INTÉRIEUR DU COMITÉ");
        C.push("");
        C.push(X(E, "Avenant n° 1 à l'accord entre l'employeur et le comité social et économique du " + leJour(dans(d0, -400)) + " relatif à la commission santé, sécurité et conditions de travail",
          "INTITULÉ, Avenant n° [.] à [référence du texte], ou délibération modifiant le chapitre [.] du règlement intérieur du comité"));
        C.push(nom.toUpperCase());
        C.push("");
        C.push("PRÉAMBULE");
        C.push("Les parties constatent que la clause " + X(E, "3.2", "référence") + " confie à la commission");
        C.push("santé, sécurité et conditions de travail " + X(E, "l'avis sur le programme annuel de prévention et la décision de recourir à un expert", "PRÉCISER CE QUI DÉPASSE : le recours à un expert / des attributions consultatives du comité") + ", alors que");
        C.push("l'article L. 2315-38 du code du travail, dont les dispositions sont");
        C.push("d'ordre public, exclut l'un et l'autre de la délégation.");
        C.push("");
        C.push("ARTICLE 1, RETRAIT");
        C.push("La clause " + X(E, "3.2", "référence") + " est " + X(E, "remplacée par les stipulations de l'article 2", "supprimée / remplacée par les stipulations de l'article 2") + ".");
        C.push("");
        C.push("ARTICLE 2, NOUVELLE RÉDACTION DE LA DÉLÉGATION");
        C.push("Le comité social et économique délègue à la commission santé, sécurité et");
        C.push("conditions de travail les attributions suivantes, relatives à la santé, à");
        C.push("la sécurité et aux conditions de travail : " + X(E, "les inspections périodiques des locaux, les enquêtes après accident ou danger grave et imminent, l'analyse des risques et la préparation des délibérations du comité",
          "ÉNUMÉRER, une par une, les attributions déléguées") + ".");
        C.push("Cette délégation ne porte, en aucun cas, sur le recours à un expert prévu");
        C.push("à la sous-section 10, ni sur les attributions consultatives du comité, qui");
        C.push("demeurent exercées par le comité social et économique lui-même");
        C.push("(L. 2315-38).");
        C.push("");
        C.push("ARTICLE 3, CIRCUIT");
        C.push("La commission instruit et propose ; le comité consulte et décide. La");
        C.push("commission transmet ses travaux au comité par " + X(E, "un rapport écrit remis huit jours avant la réunion du comité", "forme et délai") + ". Toute");
        C.push("proposition de recours à un expert est transmise au comité, à qui la");
        C.push("décision appartient. Aucun avis n'est rendu par la commission au nom du");
        C.push("comité.");
        C.push("");
        C.push("ARTICLE 4, ENTRÉE EN VIGUEUR");
        C.push("Le présent " + X(E, "avenant", "avenant / chapitre modifié") + " entre en vigueur le " + X(E, leJour(dans(d0, 30)), "DATE") + ".");
        C.push("");
        C.push("Fait à " + ville + ", le " + X(E, leJour(dans(d0, 30)), "DATE"));
        C.push("Pour l'employeur : " + sig);
        C.push(X(E, "Adopté par le comité à la majorité de ses membres titulaires élus, 4 voix sur 4.", "Signatures ou mention du mode d'adoption"));
        C.push("");
        C.push("");

        C.push("PIÈCE 3, REPRISE DES AVIS DÉJÀ RENDUS PAR LA SEULE COMMISSION");
        C.push("");
        var enteteAvis = ["Objet de l'avis", "Rendu par", "Le", "À refaire par le comité ?", "Réunion prévue"];
        C = C.concat(E ? tableau(enteteAvis, [
          ["programme annuel de prévention " + d0.getFullYear(), "la commission seule", leJour(dans(d0, -200)), "oui", leJour(dans(d0, 45))],
          ["mise à jour du document unique, version du " + leJour(dans(d0, -150)), "la commission seule", leJour(dans(d0, -140)), "oui", leJour(dans(d0, 45))],
          ["aménagement du local de pause", "le comité, après rapport de la commission", leJour(dans(d0, -90)), "non", "sans objet"],
        ]) : tableauVide(enteteAvis, 3));
        C.push("Expertises décidées depuis la mise en place de la commission :");
        C.push("");
        var enteteExp = ["Objet", "Décidée par", "Le", "Délibération du comité existe-t-elle ?"];
        C = C.concat(E ? tableau(enteteExp, [
          ["expertise risque grave, unité « " + E.unites[0].nom + " »", "la commission seule", leJour(dans(d0, -100)), "non : à faire délibérer par le comité le " + leJour(dans(d0, 45))],
        ]) : tableauVide(enteteExp, 2));
        C.push("Pour chaque ligne « non », faire délibérer le comité : la décision");
        C.push("d'expertise lui appartient, la commission ne pouvant que la proposer.");
        C.push("");
        C.push("");

        C.push("PIÈCE 4, NOTE DE CIRCUIT AUX DEUX INSTANCES");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la délégation du personnel du comité social et économique");
        C.push("Aux membres de la commission santé, sécurité et conditions de travail");
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 32)), "date"));
        C.push("");
        C.push("Objet : répartition des rôles entre le comité et la commission");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("À la suite de la modification de la clause de délégation, la répartition");
        C.push("des rôles est la suivante, conformément à l'article L. 2315-38 du code du");
        C.push("travail : la commission exerce les attributions du comité relatives à la");
        C.push("santé, à la sécurité et aux conditions de travail qui lui sont déléguées");
        C.push("(" + X(E, "inspections, enquêtes, analyse des risques, préparation des délibérations", "rappeler lesquelles") + ") ; elle ne rend aucun avis au nom du comité ; elle ne");
        C.push("décide d'aucune expertise, mais peut la proposer au comité, à qui la");
        C.push("décision appartient. Ces dispositions sont d'ordre public : aucune");
        C.push("stipulation d'accord ne peut y déroger.");
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("Trois formulations trahissent presque toujours un dépassement : « la");
      L.push("commission rend l'avis du comité sur... », « la commission décide du");
      L.push("recours à un expert », « la commission exerce l'ensemble des attributions");
      L.push("du comité en matière de santé et de sécurité » sans réserve. Recopiez la");
      L.push("clause telle qu'elle est écrite.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous relisez la clause de délégation et");
      L.push("vous recopiez ce qui dépasse (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ, projet d'avenant ou de");
      L.push("délibération rédigé (pièce 2).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ, adoption. Une délibération");
      L.push("modifiant le règlement intérieur du comité tient dans une réunion ; un");
      L.push("avenant à un accord d'entreprise demande plus.");
      L.push("");
      L.push("Dans la foulée, note de circuit aux deux instances (pièce 4) et reprise");
      L.push("des avis déjà rendus par la seule commission (pièce 3), aux prochaines");
      L.push("réunions du comité.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("irrégulier : ce n'est pas l'accord qui sauve l'avis, c'est l'avis qui");
      L.push("tombe avec la clause.");
      L.push("");
      L.push("DEUX CHOSES, ET DEUX SEULEMENT, NE SE DÉLÈGUENT PAS");
      L.push("");
      L.push("  1. Le recours à un expert prévu à la sous-section 10. La commission peut");
      L.push("     PROPOSER ; elle ne peut pas DÉCIDER. Le comité « peut décider d'une");
      L.push("     expertise le cas échéant sur proposition des commissions constituées");
      L.push("     en son sein » (Soc., 18 mars 2026, n° 23-22.270, publié, tirant cette");
      L.push("     solution de L. 1233-34).");
      L.push("  2. Les attributions consultatives du comité. L'avis se rend par le");
      L.push("     comité, en réunion du comité, au procès-verbal du comité. Un avis");
      L.push("     rendu par la seule commission n'est pas l'avis du comité.");
      L.push("");
      L = L.concat(blocRenvoi("L. 1233-34 et la sous-section 10 relative au recours à l'expert",
        "sont nommés, le premier par la décision citée, la seconde par L. 2315-38 ; " +
        "l'application ne les a pas captés et n'en écrit donc pas le régime"));
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  - commission : " + etat(c.existe, "existante", "INEXISTANTE"));
      L.push("  - délégation excluant l'expert et les attributions consultatives : " +
        etat(c.delegationConforme, "oui", "NON, c'est l'objet de ce document"));
      L.push("  - texte qui fixe les modalités : " +
        (c.modalitesFixees ? "« " + c.modalitesFixees + " »" : "[non renseigné]"));
      L.push("");
      L.push("La modification suit la voie qui a fixé les modalités : avenant à");
      L.push("l'accord d'entreprise (L. 2315-41), avenant à l'accord conclu avec le");
      L.push("comité (L. 2315-42), ou délibération modifiant le règlement intérieur du");
      L.push("comité (L. 2315-44). Un avis rendu par la commission au lieu du comité ne");
      L.push("devient pas régulier parce que la clause a été corrigée depuis : il se");
      L.push("refait.");

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
     SST-CTL-CSS-05, LA FORMATION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL
     ══════════════════════════════════════════════════════════════════════ */

  DP.ajouter("SST-CTL-CSS-05", {
    nom: "Le plan de formation santé, sécurité et conditions de travail des élus et du référent",
    detail: "Les bénéficiaires recensés, la durée due élu par élu, la demande à " +
            "l'organisme, les courriers et le registre des attestations.",
    produire: function (ctx) {
      var f = ctx.fiche || {}, cse = f.cse || {}, c = f.cssct || {};
      var d0 = aujourd(ctx);
      var s300 = seuil(ctx, 300);
      var ex = exempleDe(ctx), K = ex.cssct;
      var L = entete(ctx, "Formation santé, sécurité et conditions de travail des élus",
        "article L. 2315-18 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        var plus300 = E ? E.effectif >= 300 : s300;
        C.push("PIÈCE 1, RECENSEMENT ET DURÉE DUE, ÉLU PAR ÉLU");
        C.push("");
        C.push(nom + ", recensement établi le " + X(E, leJour(d0), "date") + ".");
        C.push("");
        var enteteRec = ["Nom", "Qualité (élu ou référent)", "Membre de la commission ?", "Premier mandat ou renouvellement", "Durée due", "Durée suivie", "Reste dû"];
        C = C.concat(E ? tableau(enteteRec, [
          [K.membres[0][0], "élue titulaire", "oui", "renouvellement", plus300 ? "5 jours (commission, au moins 300 salariés)" : "3 jours", "0", plus300 ? "5 jours" : "3 jours"],
          [K.membres[1][0], "élu titulaire", "oui", "premier mandat", "5 jours", "2 jours", "3 jours"],
          [K.membres[2][0], "élu suppléant", "oui", "premier mandat", "5 jours", "0", "5 jours"],
          ["Mme Julie ROUX", "élue titulaire et référente harcèlement du comité", "non", "premier mandat", "5 jours", "5 jours", "0"],
          ["Mme Fatou NDIAYE", "élue suppléante", "non", "renouvellement", "3 jours", "3 jours", "0"],
        ]) : tableauVide(enteteRec, 3));
        C.push("Le référent harcèlement du comité a sa ligne, même s'il figure déjà comme");
        C.push("élu : L. 2315-18 le vise à ce double titre.");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, DEMANDE À L'ORGANISME DE FORMATION");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push(X(E, "INSTITUT EXEMPLE FORMATION, organisme agréé", "NOM DE L'ORGANISME DE FORMATION"));
        C.push(E ? "22 rue des Écoles, " + E.adresse.split(", ").pop() : "[adresse]");
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 7)), "date"));
        C.push("");
        C.push("Objet : formation santé, sécurité et conditions de travail des membres du");
        C.push("comité social et économique (L. 2315-18)");
        C.push("");
        C.push("Madame, Monsieur,");
        C.push("");
        C.push("Je souhaite inscrire à la formation nécessaire à l'exercice de leurs");
        C.push("missions en matière de santé, de sécurité et de conditions de travail");
        C.push("(article L. 2315-18 du code du travail) les personnes suivantes :");
        C.push("");
        var enteteDem = ["Personne", "Titre", "Durée demandée"];
        C = C.concat(E ? tableau(enteteDem, [
          [K.membres[0][0], "renouvellement, membre de la commission", plus300 ? "5 jours" : "3 jours"],
          [K.membres[1][0], "premier mandat, membre de la commission", "3 jours restant dus sur 5"],
          [K.membres[2][0], "premier mandat, membre de la commission", "5 jours"],
        ]) : tableau(enteteDem, [
          ["[NOM]", "[premier mandat : cinq jours / renouvellement : trois jours / renouvellement, membre de la commission dans une entreprise d'au moins trois cents salariés : cinq jours]", "[durée]"],
          ["[NOM]", "[titre]", "[durée]"],
          ["[NOM]", "référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes désigné par le comité (L. 2314-1), que L. 2315-18 vise expressément", "[durée]"],
        ]));
        C.push("Sessions souhaitées : " + X(E, "entre le " + leJour(dans(d0, 30)) + " et le " + leJour(dans(d0, 90)), "PÉRIODE") + ". Lieu : " + X(E, "sur site", "sur site / dans vos locaux") + ".");
        C.push("");
        C.push(X(E, "Formation spécifique correspondant aux risques particuliers de l'activité, prévue par l'article 5 du texte constitutif de la commission en application de L. 2315-41, 6° : une journée sur les risques de l'unité « " + (E && E.unites[0].nom) + " » (" + (E && E.unites[0].lignes[0][0].toLowerCase()) + ", " + (E && E.unites[0].lignes[1][0].toLowerCase()) + ").",
          "Le cas échéant, formation spécifique correspondant aux risques ou facteurs de risques particuliers en rapport avec l'activité de l'entreprise, prévue par [référence du texte constitutif de la commission] en application de L. 2315-41, 6° : [préciser les risques concernés, tirés du document unique]."));
        C.push("");
        C.push("Je vous remercie de me faire parvenir votre proposition, votre programme");
        C.push("et, à l'issue de chaque session, une attestation individuelle mentionnant");
        C.push("le nom du participant et le nombre de jours suivis.");
        C.push("");
        C.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
        C.push("distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 3, CONVOCATION D'UN ÉLU À LA FORMATION");
        C.push("");
        C.push(nom);
        C.push("");
        C.push(X(E, K.membres[1][0], "NOM DU MEMBRE"));
        C.push(X(E, E && E.unites[0].nom + ", élu titulaire", "fonction et service"));
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 30)), "date"));
        C.push("");
        C.push("Objet : formation santé, sécurité et conditions de travail");
        C.push("");
        C.push("Madame, Monsieur,");
        C.push("");
        C.push("En application de l'article L. 2315-18 du code du travail, vous");
        C.push("bénéficiez, en votre qualité de " + X(E, "membre de la délégation du personnel du comité social et économique", "membre de la délégation du personnel du comité social et économique / référent en matière de lutte contre le harcèlement sexuel et les agissements sexistes") + ", de la");
        C.push("formation nécessaire à l'exercice de vos missions en matière de santé, de");
        C.push("sécurité et de conditions de travail.");
        C.push("");
        C.push("Cette formation se déroulera du " + X(E, leJour(dans(d0, 60)), "DATE") + " au " + X(E, leJour(dans(d0, 62)), "DATE") + ", soit " + X(E, "trois", "NOMBRE") + " jours,");
        C.push("auprès de " + X(E, "INSTITUT EXEMPLE FORMATION", "ORGANISME") + ", " + X(E, "sur site", "à [LIEU]") + ". Son financement est pris en charge par");
        C.push("l'employeur, comme le dernier alinéa de L. 2315-18 le prévoit. À l'issue de");
        C.push("la formation, l'attestation vous sera remise ; une copie sera versée au");
        C.push("dossier de l'instance.");
        C.push("");
        C.push("Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération");
        C.push("distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        C.push("");

        C.push("PIÈCE 4, REGISTRE DES ATTESTATIONS");
        C.push("");
        C.push("L'attestation est la seule pièce qui établira la durée suivie. Colonne");
        C.push("« solde » : ce qui reste dû par rapport au minimum applicable.");
        C.push("");
        var enteteAtt = ["Nom", "Session du", "au", "Jours suivis", "Organisme", "Attestation reçue le", "Solde"];
        C = C.concat(E ? tableau(enteteAtt, [
          ["Mme Julie ROUX", leJour(dans(d0, -200)), leJour(dans(d0, -194)), "5", "INSTITUT EXEMPLE FORMATION", leJour(dans(d0, -180)), "0"],
          [K.membres[1][0], leJour(dans(d0, -120)), leJour(dans(d0, -119)), "2", "INSTITUT EXEMPLE FORMATION", leJour(dans(d0, -110)), "3 jours"],
          ["Mme Fatou NDIAYE", leJour(dans(d0, -90)), leJour(dans(d0, -88)), "3", "INSTITUT EXEMPLE FORMATION", leJour(dans(d0, -80)), "0"],
        ]) : tableauVide(enteteAtt, 3));
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("La durée ne se calcule pas pour le comité en bloc : elle se calcule pour");
      L.push("chaque bénéficiaire, selon qu'il est à son premier mandat ou à un");
      L.push("renouvellement, et selon qu'il siège ou non à la commission.");
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous recensez les bénéficiaires et vous");
      L.push("calculez la durée due pour chacun (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ, demande adressée à l'organisme");
      L.push("(pièce 2).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 30)) + " environ, proposition reçue, dates");
      L.push("arrêtées, élus convoqués (pièce 3). Le délai d'inscription auprès des");
      L.push("organismes est le point de passage obligé : anticipez-le.");
      L.push("");
      L.push("Au " + leJour(dans(d0, 90)) + " environ, premières sessions suivies et");
      L.push("attestations classées (pièce 4). Ensuite, à chaque désignation nouvelle,");
      L.push("un élu ou un référent nouvellement désigné ouvre droit à la formation.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("DEUX BÉNÉFICIAIRES : les membres de la délégation du personnel du comité,");
      L.push("et le référent en matière de lutte contre le harcèlement sexuel et les");
      L.push("agissements sexistes désigné par le comité (L. 2314-1, dernier alinéa),");
      L.push("que L. 2315-18 vise expressément, sur le même plan. Les durées sont des");
      L.push("minima : rien n'interdit de faire plus ; le texte interdit de faire moins.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  - comité social et économique : " + etat(cse.existe, "existant", "AUCUN DÉCLARÉ"));
      L.push("  - commission santé-sécurité : " + etat(c.existe, "existante", "inexistante"));
      L.push("  - référent harcèlement du comité désigné : " +
        etat(f.referentCSE, "oui", "NON, il est pourtant bénéficiaire de la formation"));
      L.push("  - formation santé-sécurité assurée : " +
        etat(f.formationSSCT, "oui", "NON, c'est l'objet de ce document"));
      L.push("  - " + ligneEffectif(ctx));
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
      if (estNon(cse.existe)) {
        L.push("");
        L.push("Le dossier n'indique aucun comité social et économique : la formation de");
        L.push("L. 2315-18 bénéficie aux membres de sa délégation du personnel et à son");
        L.push("référent, et n'a donc pas d'objet en l'état.");
      }

      return L.concat(pied("L. 2315-18, L. 2314-1, L. 2315-41, 4° et 6°",
        ["Aucune peine n'est annoncée : aucun texte répressif capté ne vise le défaut",
         "de formation des élus. Ce qui se joue est un élu qui exerce des missions",
         "pour lesquelles la loi le veut préparé, et une entreprise qui se prive de",
         "l'apport que le texte organise."])).join("\n");
    },
  });

  /* ══════════════════════════════════════════════════════════════════════
     SST-CTL-CSS-06, LES REMPLACEMENTS EN COURS DE MANDAT
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
      var ex = exempleDe(ctx), K = ex.cssct;
      var L = entete(ctx, "Remplacement des membres de la commission, retour à la règle",
        "articles L. 2315-39 et L. 2314-33 du code du travail");

      function corps(E) {
        var C = [];
        var nom = E ? E.nom : nomDe(ctx);
        var sig = E ? E.signataire : signataire(ctx);
        var ville = E ? E.ville : lieu(ctx);
        C.push("PIÈCE 1, TRI DES REMPLACEMENTS INTERVENUS");
        C.push("");
        C.push("Une ligne par remplacement depuis la désignation initiale du " + X(E, leJour(dans(d0, -380)), "DATE") + ". La");
        C.push("cause qui compte est celle qui figure au procès-verbal.");
        C.push("");
        var enteteTri = ["Membre remplacé", "Remplacé par", "Le", "Cause portée au procès-verbal", "Figure à L. 2314-33 ?", "Pièce l'établissant"];
        C = C.concat(E ? tableau(enteteTri, [
          ["M. Hugo LEROY", K.membres[0][0], leJour(dans(d0, -250)), "démission du mandat", "oui", "lettre de démission du " + leJour(dans(d0, -260))],
          [K.membres[2][0], "Mme Fatou NDIAYE", leJour(dans(d0, -60)), "changement de service, souhait de l'organisation syndicale", "NON", "aucune"],
          ["Mme Julie ROUX", "M. Marc TISSIER", leJour(dans(d0, -30)), "passage au second collège", "NON : « ils conservent leur mandat en cas de changement de catégorie professionnelle »", "aucune"],
        ]) : tableauVide(enteteTri, 3));
        C.push("Toute ligne « non » appelle la délibération de la pièce 2.");
        C.push("");
        C.push("");

        C.push("PIÈCE 2, DÉLIBÉRATION RAPPORTANT LE REMPLACEMENT IRRÉGULIER");
        C.push("");
        C.push("DÉLIBÉRATION N° " + X(E, "14", ".") + ", RETRAIT DE LA DÉLIBÉRATION DE REMPLACEMENT DU");
        C.push((E ? leJour(dans(d0, -60)).toUpperCase() : "[DATE]") + " ET RÉTABLISSEMENT DU MEMBRE INITIALEMENT DÉSIGNÉ");
        C.push("Réunion du comité social et économique du " + X(E, leJour(dans(d0, 20)), "DATE") + ".");
        C.push("");
        C.push("Vu l'article L. 2315-39 du code du travail, aux termes duquel les membres");
        C.push("de la commission santé, sécurité et conditions de travail sont désignés");
        C.push("« pour une durée qui prend fin avec celle du mandat des membres élus du");
        C.push("comité » ; vu l'article L. 2314-33 du même code, qui énumère les causes de");
        C.push("fin anticipée du mandat : le décès, la démission, la rupture du contrat de");
        C.push("travail, la perte des conditions requises pour être éligible ;");
        C.push("");
        C.push("Constatant que la délibération du " + X(E, leJour(dans(d0, -60)), "DATE") + " a remplacé " + X(E, K.membres[2][0], "NOM") + " par");
        C.push(X(E, "Mme Fatou NDIAYE", "NOM") + " pour une cause, " + X(E, "un changement de service souhaité par l'organisation syndicale", "RAPPELER LA CAUSE PORTÉE AU PROCÈS-VERBAL") + ", qui ne");
        C.push("figure pas parmi celles de L. 2314-33 ;");
        C.push("");
        C.push("Le comité social et économique, après en avoir délibéré :");
        C.push("  1. RAPPORTE la délibération de remplacement du " + X(E, leJour(dans(d0, -60)), "DATE") + " ;");
        C.push("  2. CONSTATE que " + X(E, K.membres[2][0], "NOM") + ", initialement désigné, demeure membre de la");
        C.push("     commission santé, sécurité et conditions de travail jusqu'au terme du");
        C.push("     mandat des membres élus du comité ;");
        C.push("  3. DIT que toute stipulation d'accord autorisant un remplacement pour une");
        C.push("     autre cause est sans effet, aucun accord d'entreprise ne pouvant");
        C.push("     déroger à cette règle.");
        C.push("");
        C.push("Votants : " + X(E, "4", "..") + ". Pour : " + X(E, "4", "..") + ". Contre : " + X(E, "0", "..") + ". Abstentions : " + X(E, "0", "..") + ".");
        C.push("Le président n'a pas pris part au vote (L. 2315-32).");
        C.push("");
        C.push("");

        C.push("PIÈCE 3, CONSIGNE POUR LES REMPLACEMENTS À VENIR");
        C.push("");
        C.push(nom);
        C.push(E ? E.adresse : cro((ctx.profil || {}).adresse, "adresse du siège"));
        C.push("");
        C.push("Aux membres de la délégation du personnel du comité social et économique");
        C.push("Copie : aux membres de la commission santé, sécurité et conditions de travail");
        C.push("");
        C.push(ville + ", le " + X(E, leJour(dans(d0, 7)), "date"));
        C.push("");
        C.push("Objet : remplacement des membres de la commission santé, sécurité et");
        C.push("conditions de travail");
        C.push("");
        C.push("Mesdames, Messieurs,");
        C.push("");
        C.push("Les membres de la commission santé, sécurité et conditions de travail sont");
        C.push("désignés par le comité pour une durée qui prend fin avec celle du mandat");
        C.push("des membres élus du comité (article L. 2315-39 du code du travail). Avant");
        C.push("ce terme, le comité ne peut procéder à leur remplacement que dans les cas");
        C.push("de fin anticipée de mandat énumérés à l'article L. 2314-33 : le décès, la");
        C.push("démission, la rupture du contrat de travail, la perte des conditions");
        C.push("requises pour être éligible. Aucune autre cause ne l'autorise, et aucun");
        C.push("accord d'entreprise ne peut y déroger.");
        C.push("");
        C.push("En conséquence, pour tout remplacement à venir, le procès-verbal portera :");
        C.push("");
        var enteteMention = ["Mention à porter au procès-verbal", "Pièce"];
        C = C.concat(tableau(enteteMention, [
          ["la cause invoquée, nommée telle que L. 2314-33 la nomme", X(E, "décès : acte de décès ; démission : lettre de démission du mandat, datée ; rupture du contrat : la pièce qui la constate ; perte d'éligibilité : l'élément qui la fait perdre, écrit", "la pièce qui l'établit")],
          ["la référence de la pièce qui l'établit", "jointe au procès-verbal"],
          ["le décompte des voix de la résolution (L. 2315-32)", "procès-verbal"],
        ]));
        C.push("Une délibération de remplacement fondée sur une autre cause encourt");
        C.push("l'annulation, et avec elle la composition de la commission.");
        C.push("");
        C.push("Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma");
        C.push("considération distinguée.");
        C.push("");
        C.push(sig);
        C.push("");
        return C;
      }

      L.push(DP.EXEMPLE);
      L.push("");
      L = L.concat(corps(ex));
      L.push("");
      L.push("VOS PIÈCES, À COMPLÉTER");
      L.push("");
      L.push("C'est le comité qui a délibéré, c'est lui qui rapporte. L'employeur ne");
      L.push("peut ni annuler la délibération, ni rétablir le membre : il inscrit le");
      L.push("point à l'ordre du jour et expose la règle.");
      if (estNon(c.remplacementEnCoursDeMandat)) {
        L.push("Le dossier ne déclare aucun remplacement : la pièce 3 est alors la");
        L.push("consigne à appliquer le jour où la question se posera.");
      }
      L.push("");
      L = L.concat(corps(null));

      L.push("VOTRE CALENDRIER");
      L.push("");
      L.push("Aujourd'hui, " + leJour(d0) + ", vous reprenez les procès-verbaux depuis");
      L.push("la désignation initiale et vous triez les remplacements (pièce 1).");
      L.push("");
      L.push("Au " + leJour(dans(d0, 7)) + " environ, la consigne pour l'avenir est");
      L.push("diffusée (pièce 3). Elle ne dépend d'aucune réunion.");
      L.push("");
      L.push("À la prochaine réunion du comité, inscription du point à l'ordre du jour");
      L.push("et délibération rapportant le remplacement irrégulier (pièce 2). Ensuite,");
      L.push("composition de la commission mise à jour et notifiée à ses membres.");
      L.push("");

      L = L.concat(DP.liens(ctx, ["cse", "sst"]));

      L.push("LES RÈGLES");
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
      L.push("membres élus du comité », et sans qu'un accord d'entreprise puisse y");
      L.push("déroger (Soc., 28 mai 2026, n° 24-22.914, publié).");
      L.push("");
      L.push("L. 2314-33 : « Les membres de la délégation du personnel du comité social");
      L.push("et économique sont élus pour quatre ans. Les fonctions de ces membres");
      L.push("prennent fin par le décès, la démission, la rupture du contrat de travail,");
      L.push("la perte des conditions requises pour être éligible. Ils conservent leur");
      L.push("mandat en cas de changement de catégorie professionnelle. »");
      L.push("");
      L.push("Un membre qui passe d'un collège à l'autre ne perd pas son mandat, et n'a");
      L.push("donc pas à être remplacé pour ce motif. Ne permettent pas de remplacer :");
      L.push("la perte de confiance, un changement d'équipe ou de service, un");
      L.push("arrangement entre organisations syndicales, une réorganisation de la");
      L.push("commission, une absence prolongée, un désaccord. Aucune de ces causes ne");
      L.push("figure à L. 2314-33, et aucun accord ne peut les y ajouter.");
      L.push("");
      L.push("OÙ VOUS EN ÊTES");
      L.push("");
      L.push("  - commission : " + etat(c.existe, "existante", "INEXISTANTE"));
      L.push("  - remplacement depuis la désignation initiale : " +
        etat(c.remplacementEnCoursDeMandat, "OUI", "non"));
      L.push("  - cause déclarée : " + (cause ? "« " + cause + " »" : "[non renseignée]"));
      if (cause) {
        L.push("  - cette cause figure-t-elle à L. 2314-33 ? " +
          (admise ? "OUI, le remplacement est régulier de ce chef."
                  : "NON, la délibération de remplacement encourt l'annulation."));
      }
      L.push("");
      L.push("Si le membre initialement désigné a lui-même quitté l'entreprise ou");
      L.push("démissionné depuis, la cause de L. 2314-33 est alors constituée : le");
      L.push("remplacement devient régulier, mais il se refait par une délibération");
      L.push("nouvelle, fondée sur cette cause-là et sur la pièce qui l'établit.");

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

  /* ══════════════════════════════════════════════════════════════════════
     LES PIÈCES QUE L'ÉCRAN SORT SUR « NON »

     POURQUOI UN SECOND FORMAT. Les générateurs ci-dessus rendent du texte
     brut, bon pour une fenêtre de lecture et pour le presse-papiers. L'écran
     d'entrée, lui, affiche le document et le laisse corriger à la main pendant
     que les champs le remplissent : il lui faut des BLOCS, chacun avec son
     genre, pour savoir ce qui est un titre, ce qui est un paragraphe et ce qui
     est une note de marge qui ne part pas dans le fichier.

     Une pièce, c'est donc : la question fermée qui l'ouvre, le seuil qui la
     rend due, les quelques champs que l'application ne peut pas connaître, le
     document déjà écrit à partir de la fiche d'entreprise, et - pour la
     branche « oui » - la liste de ce qu'on cherche dans le document déposé,
     avec le texte prêt à insérer quand on ne l'y trouve pas.

     LE RENVOI RESTE DERRIÈRE. Chaque pièce porte ses articles, mais l'écran
     ne les met jamais devant le document : ils tiennent dans une ligne
     dépliable, sous la feuille.
     ══════════════════════════════════════════════════════════════════════ */

  var PIECES = [];

  function ajouterPiece(p) {
    if (!p || !p.id || typeof p.blocs !== "function")
      throw new Error("pièces : « " + (p && p.id) + " » n'a pas de fonction blocs.");
    for (var i = 0; i < PIECES.length; i++)
      if (PIECES[i].id === p.id) throw new Error("pièces : « " + p.id + " » est déjà enregistrée.");
    PIECES.push(p);
    return p;
  }

  /* Le constructeur de blocs. Les genres sont ceux de la feuille de
     docs/gerer.html, et l'export Word les connaît déjà. « note » s'adresse à
     l'employeur : elle se voit à l'écran et ne part pas dans le fichier. */
  function feuille() {
    var L = [];
    var api = {
      L: L,
      t1: function (t) { L.push({ k: "t1", t: t }); return api; },
      st: function (t) { L.push({ k: "st", t: t }); return api; },
      h1: function (t) { L.push({ k: "h1", t: t }); return api; },
      h2: function (t) { L.push({ k: "h2", t: t }); return api; },
      p: function (t) { L.push({ k: "p", t: t }); return api; },
      puce: function (t) { L.push({ k: "puce", t: t }); return api; },
      note: function (t) { L.push({ k: "note", t: t }); return api; },
      sign: function (t) { L.push({ k: "sign", t: t }); return api; },
      trait: function () { L.push({ k: "trait", t: "" }); return api; },
      saut: function () { L.push({ k: "saut", t: "" }); return api; },
      vide: function () { L.push({ k: "vide", t: "" }); return api; },
    };
    return api;
  }

  /* La valeur d'un champ, ou son crochet. Rien n'est deviné : un crochet se
     voit, une invention ne se voit pas. */
  function val(ctx, cle, quoi) {
    var v = ((ctx && ctx.valeurs) || {})[cle];
    v = v == null ? "" : String(v).trim();
    return v === "" ? "[" + (quoi || cle) + "]" : v;
  }
  function rempli(ctx, cle) {
    var v = ((ctx && ctx.valeurs) || {})[cle];
    return v != null && String(v).trim() !== "";
  }
  function dateVal(ctx, cle, quoi) {
    var v = ((ctx && ctx.valeurs) || {})[cle];
    return estISO(v) ? leJour(dateDe(v)) : "[" + (quoi || "date") + "]";
  }
  function adresseDe(ctx) {
    return cro(((ctx && ctx.profil) || {}).adresse, "adresse du siège");
  }
  function leJourDu(ctx) { return leJour(aujourd(ctx)); }
  /* La ville, tirée du code postal de l'adresse du siège : la fiche ne la
     demande pas séparément, et un « Fait à [lieu] » sur un document qu'on
     signe le jour même se remarque. */
  function villeDe(ctx) {
    var p = (ctx && ctx.profil) || {};
    if (p.ville && String(p.ville).trim() !== "") return String(p.ville).trim();
    var m = String(p.adresse || "").match(/\d{5}\s+([^,;]+)$/);
    return m ? m[1].trim() : "[ville]";
  }

  /* L'en-tête que porte toute pièce : qui l'établit, où, quand. */
  function teteDocument(f, ctx, titre, sous) {
    f.t1(titre);
    if (sous) f.st(sous);
    f.p(nomDe(ctx));
    f.p(adresseDe(ctx));
    f.p("Établi le " + leJourDu(ctx) + " par " + signataire(ctx) + ".");
    f.trait();
    return f;
  }

  global.Pieces = {
    ajouter: ajouterPiece,
    liste: function (module) {
      return PIECES.filter(function (p) {
        return !module || !p.modules || p.modules.indexOf(module) >= 0;
      });
    },
    pour: function (id) {
      for (var i = 0; i < PIECES.length; i++) if (PIECES[i].id === id) return PIECES[i];
      return null;
    },
    outils: { feuille: feuille, val: val, rempli: rempli, dateVal: dateVal,
      teteDocument: teteDocument, nomDe: nomDe, adresseDe: adresseDe,
      signataire: signataire, leJourDu: leJourDu, aujourd: aujourd, villeDe: villeDe,
      effectifDe: effectifDe, seuil: seuil, cro: cro, leJour: leJour, dans: dans,
      estISO: estISO, dateDe: dateDe, isoDe: isoDe, moisApres: moisApres },
  };

  /* ══════════════════════════════════════════════════════════════════════
     LA CONSIGNE DE SÉCURITÉ INCENDIE

     Les huit mentions sont celles de R. 4227-38, dans son ordre : c'est lui
     qui dit ce que la consigne « indique ». Les essais et exercices tous les
     six mois et leur registre viennent de R. 4227-39, la communication à
     l'inspection du travail de R. 4227-40.

     R. 4227-37, qui commande l'établissement et l'affichage de la consigne
     dans les établissements de l'article R. 4227-34, a été lu le 7 septembre
     2026 dans un état « abrogé à effet différé » : le document le dit à
     l'endroit où il s'en sert plutôt que de le taire.
     ══════════════════════════════════════════════════════════════════════ */

  ajouterPiece({
    id: "PIECE-INCENDIE",
    modules: ["sst", "social"],
    titre: "Consigne de sécurité incendie",
    question: "Avez-vous une consigne de sécurité incendie affichée dans vos locaux ?",
    fichier: "consigne-securite-incendie",
    renvoi: "R. 4227-38 (LEGIARTI000024769384), R. 4227-39 (LEGIARTI000024769386), " +
            "R. 4227-40 (LEGIARTI000018532053), R. 4227-34 (LEGIARTI000018532067), " +
            "R. 4227-28 (LEGIARTI000018532081), R. 4227-37 (LEGIARTI000024769379)",
    champs: [
      { c: "local", nom: "Local ou bâtiment couvert", ph: "atelier de montage, rez-de-chaussée" },
      { c: "effectifLocal", nom: "Personnes présentes dans ce local", t: "number", ph: "12" },
      { c: "materiel", nom: "Matériel d'extinction et de secours, et son emplacement",
        t: "textarea", ph: "3 extincteurs à eau pulvérisée près des issues, 1 extincteur CO2 au tableau électrique, 1 robinet d'incendie armé dans le couloir" },
      { c: "chargesMateriel", nom: "Qui met ce matériel en action", ph: "MM. Dupont et Kaci, formés le 12 mars 2026" },
      { c: "chargesEvacuation", nom: "Qui dirige l'évacuation", ph: "Mme Lambert, guide-file ; M. Sow, serre-file" },
      { c: "handicap", nom: "Espaces d'attente sécurisés, ou mesures équivalentes",
        ph: "palier du 1er étage, cage d'escalier B, capacité 4 personnes" },
      { c: "alerte", nom: "Moyens d'alerte", ph: "déclencheurs manuels près des issues, sirène, téléphone de l'accueil" },
      { c: "chargesPompiers", nom: "Qui avise les sapeurs-pompiers", ph: "l'accueil, à défaut le premier témoin" },
      { c: "secours", nom: "Adresse et numéro du service de secours de premier appel",
        ph: "Sapeurs-pompiers : 18 ou 112 - centre de secours de [ville], [adresse]" },
      { c: "rassemblement", nom: "Point de rassemblement", ph: "parking visiteurs, devant le portail" },
      { c: "dernierExercice", nom: "Date du dernier exercice", t: "date" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      teteDocument(f, ctx, "CONSIGNE DE SÉCURITÉ INCENDIE",
        val(ctx, "local", "local ou bâtiment couvert"));
      f.p("Cette consigne est affichée de manière très apparente dans le local qu'elle " +
        "couvre. Toute personne qui y travaille est tenue de l'avoir lue.");

      f.h1("1. Le matériel d'extinction et de secours");
      f.p(val(ctx, "materiel", "nature, nombre et emplacement du matériel d'extinction et de secours"));
      f.note("R. 4227-38, 1°. R. 4227-28 met à la charge de l'employeur les mesures " +
        "nécessaires pour que tout commencement d'incendie puisse être rapidement et " +
        "efficacement combattu : le matériel énuméré ici doit être celui qui s'y trouve " +
        "réellement, vérifié et accessible.");

      f.h1("2. Les personnes chargées de mettre ce matériel en action");
      f.p(val(ctx, "chargesMateriel", "noms et fonctions"));
      f.note("R. 4227-38, 2°.");

      f.h1("3. Les personnes chargées de diriger l'évacuation");
      f.p(val(ctx, "chargesEvacuation", "noms et fonctions, guide-file et serre-file"));
      f.p("Elles dirigent l'évacuation des travailleurs et, le cas échéant, du public " +
        "présent dans le local.");
      f.note("R. 4227-38, 3°.");

      f.h1("4. Les mesures liées à la présence de personnes handicapées");
      f.p("Espaces d'attente sécurisés ou espaces équivalents : " +
        val(ctx, "handicap", "nombre et localisation"));
      f.p("Les personnes chargées de l'évacuation vérifient ces espaces avant de quitter " +
        "le bâtiment et signalent aux sapeurs-pompiers, dès leur arrivée, les personnes " +
        "qui s'y trouvent.");
      f.note("R. 4227-38, 4°, qui impose d'indiquer notamment le nombre et la " +
        "localisation des espaces d'attente sécurisés ou des espaces équivalents.");

      f.h1("5. Les moyens d'alerte");
      f.p(val(ctx, "alerte", "déclencheurs manuels, sirène, téléphone"));
      f.note("R. 4227-38, 5°. R. 4227-34 impose un système d'alarme sonore dans les " +
        "établissements où peuvent se trouver occupées ou réunies habituellement plus de " +
        "cinquante personnes, ainsi que, quelle que soit leur importance, dans ceux où " +
        "sont manipulées et mises en œuvre des matières inflammables mentionnées à " +
        "l'article R. 4227-22.");

      f.h1("6. Les personnes chargées d'aviser les sapeurs-pompiers");
      f.p(val(ctx, "chargesPompiers", "noms ou fonctions"));
      f.note("R. 4227-38, 6°.");

      f.h1("7. Le service de secours de premier appel");
      f.p(val(ctx, "secours", "adresse et numéro d'appel téléphonique"));
      f.p("Ce numéro est affiché en caractères apparents.");
      f.note("R. 4227-38, 7°, qui exige les caractères apparents.");

      f.h1("8. Ce que chacun doit faire");
      f.p("Toute personne qui aperçoit un début d'incendie a le devoir de donner l'alarme " +
        "et de mettre en œuvre les moyens de premier secours, sans attendre l'arrivée des " +
        "travailleurs spécialement désignés.");
      f.puce("Donner l'alarme par le déclencheur le plus proche.");
      f.puce("Prévenir les sapeurs-pompiers, ou faire prévenir.");
      f.puce("Attaquer le feu avec le matériel adapté, sans se mettre en danger.");
      f.puce("Évacuer au signal, sans revenir en arrière, et rejoindre le point de " +
        "rassemblement : " + val(ctx, "rassemblement", "point de rassemblement") + ".");
      f.note("R. 4227-38, 8°, pour le devoir de donner l'alarme et de mettre en œuvre les " +
        "moyens de premier secours. Le point de rassemblement et l'ordre des gestes sont " +
        "une mise en pratique, pas une exigence du texte lu.");

      f.h1("9. Essais, visites et exercices");
      f.p("Le matériel fait l'objet d'essais et de visites périodiques. Des exercices sont " +
        "organisés au cours desquels les travailleurs apprennent à reconnaître les " +
        "caractéristiques du signal sonore d'alarme générale, à localiser et à utiliser les " +
        "espaces d'attente sécurisés ou les espaces équivalents, à se servir des moyens de " +
        "premier secours et à exécuter les diverses manœuvres nécessaires.");
      f.p("Ces exercices et essais ont lieu au moins tous les six mois. Dernier exercice : " +
        dateVal(ctx, "dernierExercice", "date du dernier exercice") +
        (rempli(ctx, "dernierExercice")
          ? ". Prochain exercice au plus tard le " +
            (moisApres(ctx.valeurs.dernierExercice, 6)
              ? leJour(dateDe(moisApres(ctx.valeurs.dernierExercice, 6))) : "[date]") + "."
          : "."));
      f.p("Leur date et les observations auxquelles ils donnent lieu sont consignées sur un " +
        "registre tenu à la disposition de l'inspection du travail.");
      f.note("R. 4227-39, qui fixe la périodicité de six mois et le registre.");

      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + "\n\n" + signataire(ctx) +
        "\n" + nomDe(ctx));
      f.note("Cette consigne est communiquée à l'inspection du travail (R. 4227-40). " +
        "Elle est affichée dans chaque local dont l'effectif dépasse cinq personnes et " +
        "dans les locaux mentionnés à l'article R. 4227-24, et dans chaque local ou " +
        "dégagement desservant un groupe de locaux dans les autres cas (R. 4227-37, lu le " +
        "7 septembre 2026 dans un état « abrogé à effet différé » : vérifiez sa rédaction " +
        "en vigueur au jour où vous affichez).");
      return f.L;
    },
    attendus: [
      { cle: "materiel", objet: "Le matériel d'extinction et de secours",
        mots: ["extincteur", "matériel d'extinction", "robinet d'incendie", "moyens d'extinction"],
        renvoi: "R. 4227-38, 1°",
        clause: ["Matériel d'extinction et de secours présent dans le local et à ses abords : " +
          "[nature, nombre et emplacement des extincteurs, robinets d'incendie armés et autres moyens]."] },
      { cle: "chargesMateriel", objet: "Les personnes chargées de mettre ce matériel en action",
        mots: ["chargées de mettre", "chargés de mettre", "équipier de première intervention", "mise en action"],
        renvoi: "R. 4227-38, 2°",
        clause: ["Personnes chargées de mettre le matériel d'extinction en action : [noms et fonctions]."] },
      { cle: "chargesEvacuation", objet: "Les personnes chargées de diriger l'évacuation",
        mots: ["évacuation", "guide-file", "serre-file"],
        renvoi: "R. 4227-38, 3°",
        clause: ["Personnes chargées de diriger l'évacuation des travailleurs et, le cas échéant, " +
          "du public : [noms et fonctions, guide-file et serre-file]."] },
      { cle: "handicap", objet: "Les mesures liées à la présence de personnes handicapées",
        mots: ["handicap", "espace d'attente", "espaces d'attente", "attente sécurisé"],
        renvoi: "R. 4227-38, 4°",
        clause: ["Mesures spécifiques liées à la présence de personnes handicapées : espaces " +
          "d'attente sécurisés ou espaces équivalents, [nombre et localisation]. Les personnes " +
          "chargées de l'évacuation les vérifient et signalent aux sapeurs-pompiers, dès leur " +
          "arrivée, les personnes qui s'y trouvent."] },
      { cle: "alerte", objet: "Les moyens d'alerte",
        mots: ["alerte", "alarme", "déclencheur"],
        renvoi: "R. 4227-38, 5°",
        clause: ["Moyens d'alerte : [déclencheurs manuels et leur emplacement, sirène, téléphone]."] },
      { cle: "chargesPompiers", objet: "Les personnes chargées d'aviser les sapeurs-pompiers",
        /* « pompiers » tout court suffirait à faire croire le point traité par
           la première phrase venue : on cherche l'acte, pas le mot. */
        mots: ["chargées d'aviser", "chargés d'aviser", "aviser les sapeurs-pompiers",
          "prévenir les sapeurs-pompiers", "alerter les sapeurs-pompiers"],
        renvoi: "R. 4227-38, 6°",
        clause: ["Personnes chargées d'aviser les sapeurs-pompiers dès le début d'un incendie : " +
          "[noms ou fonctions]."] },
      { cle: "secours", objet: "L'adresse et le numéro du service de secours de premier appel",
        mots: ["service de secours", "centre de secours", "18 ou 112", "numéro d'appel"],
        renvoi: "R. 4227-38, 7°",
        clause: ["Service de secours de premier appel : sapeurs-pompiers, 18 ou 112, centre de " +
          "secours de [ville], [adresse]. Ce numéro est affiché en caractères apparents."] },
      { cle: "devoir", objet: "Le devoir de donner l'alarme sans attendre",
        mots: ["donner l'alarme", "sans attendre", "premier secours"],
        renvoi: "R. 4227-38, 8°",
        clause: ["Toute personne qui aperçoit un début d'incendie a le devoir de donner l'alarme " +
          "et de mettre en œuvre les moyens de premier secours, sans attendre l'arrivée des " +
          "travailleurs spécialement désignés."] },
      { cle: "exercices", objet: "Les essais et exercices, au moins tous les six mois",
        mots: ["exercice", "essais", "six mois", "semestre"],
        renvoi: "R. 4227-39",
        clause: ["La présente consigne prévoit des essais et visites périodiques du matériel et " +
          "des exercices au cours desquels les travailleurs apprennent à reconnaître les " +
          "caractéristiques du signal sonore d'alarme générale, à localiser et à utiliser les " +
          "espaces d'attente sécurisés ou les espaces équivalents, à se servir des moyens de " +
          "premier secours et à exécuter les diverses manœuvres nécessaires. Ces exercices et " +
          "essais ont lieu au moins tous les six mois ; leur date et les observations auxquelles " +
          "ils donnent lieu sont consignées sur un registre tenu à la disposition de l'inspection " +
          "du travail."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LE REGISTRE DES DANGERS GRAVES ET IMMINENTS

     Le registre n'est pas un cahier vierge : D. 4132-1 dit ce que l'avis du
     représentant doit porter, et il dit aussi comment le registre est tenu -
     pages numérotées, authentifiées par le tampon du comité. La pièce produite
     ici est donc la page de garde du registre, son mode d'emploi et le
     feuillet type que le représentant remplit ; ce que le représentant écrit,
     l'employeur ne l'écrit pas à sa place.
     ══════════════════════════════════════════════════════════════════════ */

  ajouterPiece({
    id: "PIECE-DGI",
    modules: ["sst", "social"],
    titre: "Registre des dangers graves et imminents",
    question: "Avez-vous un registre spécial des dangers graves et imminents ?",
    fichier: "registre-dangers-graves-imminents",
    renvoi: "D. 4132-1 (LEGIARTI000036484010), D. 4132-2 (LEGIARTI000036484007), " +
            "L. 4131-1 (LEGIARTI000006903155), L. 4131-2 (LEGIARTI000035653297), " +
            "L. 4132-2 (LEGIARTI000035653288)",
    /* Le registre reçoit l'avis d'un représentant du personnel au comité :
       sans comité, il n'a personne pour l'écrire. La question ne se pose donc
       qu'à partir de onze salariés : « Un comité social et économique est mis
       en place dans les entreprises d'au moins onze salariés » (L. 2311-2,
       LEGIARTI000035609353, lu deux fois le 7 septembre 2026). Le même article
       ajoute que la mise en place n'est obligatoire que si le seuil est
       atteint pendant douze mois consécutifs : cet écran ne le vérifie pas,
       la fiche d'entreprise ne portant que l'effectif du jour. */
    due: function (profil) {
      var n = Number(profil && profil.effectif);
      if (!isFinite(n) || String((profil || {}).effectif || "").trim() === "") return null;
      return n >= 11;
    },
    champs: [
      { c: "lieu", nom: "Où le registre est tenu", ph: "bureau du responsable sécurité, rez-de-chaussée" },
      { c: "gardien", nom: "Qui en a la garde", ph: "Mme Lambert, responsable sécurité" },
      { c: "ouvertLe", nom: "Date d'ouverture du registre", t: "date" },
      { c: "pages", nom: "Nombre de pages numérotées", t: "number", ph: "50" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      teteDocument(f, ctx, "REGISTRE SPÉCIAL DES DANGERS GRAVES ET IMMINENTS",
        "Avis des représentants du personnel au comité social et économique");
      f.p("Registre ouvert le " + dateVal(ctx, "ouvertLe", "date d'ouverture") + ", comportant " +
        val(ctx, "pages", "nombre") + " pages numérotées, authentifiées par le tampon du comité " +
        "social et économique.");
      f.p("Lieu de conservation : " + val(ctx, "lieu", "lieu de conservation") + ". Garde du " +
        "registre : " + val(ctx, "gardien", "nom et fonction") + ". Il reste à la disposition " +
        "des représentants du personnel au comité social et économique.");
      f.note("D. 4132-1 pour la numérotation et le tampon du comité, D. 4132-2 pour la tenue " +
        "sous la responsabilité de l'employeur et la mise à disposition des représentants.");

      f.h1("À quoi sert ce registre");
      f.p("Un travailleur qui a un motif raisonnable de penser qu'une situation de travail " +
        "présente un danger grave et imminent pour sa vie ou sa santé alerte immédiatement " +
        "l'employeur ; il peut se retirer de cette situation. L'employeur ne peut pas lui " +
        "demander de reprendre son activité tant que le danger persiste.");
      f.p("Le représentant du personnel au comité social et économique qui constate une cause " +
        "de danger grave et imminent, notamment par l'intermédiaire d'un travailleur, en alerte " +
        "immédiatement l'employeur et consigne son avis sur le présent registre.");
      f.p("Dès cet avis, l'employeur procède immédiatement à une enquête avec le représentant " +
        "qui lui a signalé le danger et prend les dispositions nécessaires pour y remédier.");
      f.note("L. 4131-1 pour l'alerte et le retrait du travailleur, L. 4131-2 pour l'alerte du " +
        "représentant, L. 4132-2 pour la consignation par écrit et l'enquête immédiate.");

      f.trait();
      f.h1("Feuillet d'avis nº ....");
      f.p("Date et heure de l'avis : ..............................................");
      f.p("Représentant du personnel au comité social et économique : ......................");
      f.h2("1. Postes de travail concernés par la cause du danger constaté");
      f.p("..........................................................................");
      f.h2("2. Nature et cause du danger");
      f.p("..........................................................................");
      f.p("..........................................................................");
      f.h2("3. Nom des travailleurs exposés");
      f.p("..........................................................................");
      f.p("Signature du représentant : ....................................");
      f.note("Les trois rubriques et la signature sont celles que D. 4132-1 exige de l'avis. " +
        "Elles se remplissent à la main, sur le registre : l'application n'écrit pas l'avis " +
        "d'un représentant.");

      f.h1("Suites données par l'employeur");
      f.p("Date et heure de l'enquête menée avec le représentant : ........................");
      f.p("Personnes présentes : ......................................................");
      f.p("Constatations : ...........................................................");
      f.p("Dispositions prises pour remédier au danger, et date d'exécution : ..............");
      f.p("..........................................................................");
      f.p("Signature de l'employeur : ................................................");
      f.note("L. 4132-2 : l'enquête est immédiate et se mène avec le représentant qui a " +
        "signalé le danger. En cas de divergence sur la réalité du danger ou sur la façon de " +
        "le faire cesser, la suite de la procédure relève des articles suivants du même " +
        "chapitre, que l'application n'a pas lus : allez les lire avant de vous en servir.");
      return f.L;
    },
    attendus: [
      { cle: "numerote", objet: "Des pages numérotées et authentifiées par le tampon du comité",
        mots: ["numérot", "tampon", "authentifi"],
        renvoi: "D. 4132-1",
        clause: ["Le présent registre comporte [nombre] pages numérotées, authentifiées par le " +
          "tampon du comité social et économique."] },
      { cle: "postes", objet: "Les postes de travail concernés par la cause du danger",
        mots: ["poste de travail", "postes de travail", "postes concernés"],
        renvoi: "D. 4132-1, 1°",
        clause: ["1. Postes de travail concernés par la cause du danger constaté : ..............."] },
      { cle: "nature", objet: "La nature et la cause du danger",
        mots: ["nature et", "cause du danger", "nature du danger"],
        renvoi: "D. 4132-1, 2°",
        clause: ["2. Nature et cause du danger : ..............................................."] },
      { cle: "exposes", objet: "Le nom des travailleurs exposés",
        mots: ["travailleurs exposés", "salariés exposés", "nom des travailleurs"],
        renvoi: "D. 4132-1, 3°",
        clause: ["3. Nom des travailleurs exposés : ..........................................."] },
      { cle: "date", objet: "L'avis daté et signé",
        mots: ["daté et signé", "signature", "date de l'avis"],
        renvoi: "D. 4132-1",
        clause: ["Chaque avis est daté et signé par le représentant du personnel qui le porte."] },
      { cle: "enquete", objet: "L'enquête immédiate et les suites données",
        mots: ["enquête", "dispositions nécessaires", "suites données"],
        renvoi: "L. 4132-2",
        clause: ["Suites données par l'employeur : dès l'avis, l'employeur procède immédiatement " +
          "à une enquête avec le représentant qui lui a signalé le danger et prend les " +
          "dispositions nécessaires pour y remédier. Date de l'enquête, personnes présentes, " +
          "constatations et dispositions prises sont portées en regard de l'avis."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LA FICHE D'ENTREPRISE, ET LE DOCUMENT QUE L'EMPLOYEUR ADRESSE AU SERVICE

     Attention au partage des rôles, parce qu'il commande tout le document :
     la fiche d'entreprise est établie par le médecin du travail ou, dans les
     services interentreprises, par l'équipe pluridisciplinaire (R. 4624-46).
     L'employeur ne l'écrit pas. Ce qu'il doit produire, lui, c'est le document
     de D. 4622-22 - nombre et catégorie des travailleurs à suivre, risques
     auxquels ils sont exposés - mis à jour chaque année.

     La pièce sort donc les deux : le courrier qui demande la fiche, et le
     document annuel qui l'accompagne.
     ══════════════════════════════════════════════════════════════════════ */

  ajouterPiece({
    id: "PIECE-FICHE-ENTREPRISE",
    modules: ["sst", "social"],
    titre: "Fiche d'entreprise du service de santé au travail",
    question: "Avez-vous la fiche d'entreprise établie par votre service de prévention et de santé au travail ?",
    fichier: "fiche-entreprise-demande",
    renvoi: "R. 4624-46 (LEGIARTI000045677119), R. 4624-47 (LEGIARTI000045676758), " +
            "D. 4622-22 (LEGIARTI000045676988)",
    champs: [
      { c: "service", nom: "Service de prévention et de santé au travail", ph: "SPSTI de [ville]" },
      { c: "adresseService", nom: "Adresse du service", ph: "4 rue des Prés, 59000 Lille" },
      { c: "medecin", nom: "Médecin du travail", ph: "Docteur [nom]" },
      { c: "adhesion", nom: "Date d'adhésion au service", t: "date" },
      { c: "categories", nom: "Catégories de travailleurs et effectifs", t: "textarea",
        ph: "18 opérateurs de production, 4 caristes, 6 salariés administratifs, 2 techniciens de maintenance" },
      { c: "risques", nom: "Risques professionnels auxquels ils sont exposés", t: "textarea",
        ph: "bruit, manutention manuelle, circulation d'engins, produits chimiques d'entretien, travail sur écran" },
      { c: "renforce", nom: "Postes relevant du suivi individuel renforcé", t: "textarea",
        ph: "conduite d'engins soumise à autorisation, travaux en hauteur avec montage d'échafaudage" },
      { c: "avisCSE", nom: "Date de l'avis du comité social et économique", t: "date" },
      { c: "avisMedecin", nom: "Date de l'avis du médecin du travail", t: "date" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      f.t1("DEMANDE DE FICHE D'ENTREPRISE");
      f.st("et document annuel des travailleurs à suivre et des risques");
      f.p(nomDe(ctx));
      f.p(adresseDe(ctx));
      f.vide();
      f.p(val(ctx, "service", "service de prévention et de santé au travail"));
      f.p(val(ctx, "adresseService", "adresse du service"));
      f.p("À l'attention de " + val(ctx, "medecin", "Docteur, médecin du travail"));
      f.vide();
      f.p(villeDe(ctx) + ", le " + leJourDu(ctx));
      f.p("Objet : fiche d'entreprise et document annuel prévu à l'article D. 4622-22");
      f.vide();
      f.p("Docteur,");
      f.p("Notre entreprise adhère à votre service depuis le " +
        dateVal(ctx, "adhesion", "date d'adhésion") + ". Je n'ai pas, à ce jour, la fiche " +
        "d'entreprise prévue à l'article R. 4624-46 : je vous demande de l'établir et de me la " +
        "transmettre.");
      f.p("Pour chaque entreprise ou établissement, le médecin du travail ou, dans les services " +
        "de prévention et de santé au travail interentreprises, l'équipe pluridisciplinaire " +
        "établit et met à jour une fiche d'entreprise ou d'établissement sur laquelle figurent, " +
        "notamment, les risques professionnels et les effectifs de salariés qui y sont exposés. " +
        "Pour les entreprises adhérentes à un service interentreprises, elle est établie dans " +
        "l'année qui suit l'adhésion.");
      f.p("Vous trouverez ci-après le document que l'article D. 4622-22 met à ma charge : le " +
        "nombre et la catégorie des travailleurs à suivre et les risques professionnels auxquels " +
        "ils sont exposés. Il est établi en cohérence avec l'évaluation des risques et le " +
        "recensement des postes exposés à des facteurs de risques.");
      f.p("Je vous prie d'agréer, Docteur, l'expression de ma considération distinguée.");
      f.sign("\n" + signataire(ctx) + "\n" + nomDe(ctx));
      f.note("R. 4624-46 et R. 4624-47 sont cités dans leurs termes. La fiche d'entreprise " +
        "n'est pas un document que vous écrivez : elle est établie par le médecin du travail " +
        "ou l'équipe pluridisciplinaire. Ce courrier la demande, il ne la remplace pas.");

      f.saut();
      f.t1("DOCUMENT ANNUEL DES TRAVAILLEURS À SUIVRE ET DES RISQUES");
      f.st("Article D. 4622-22 du code du travail");
      f.p(nomDe(ctx) + " - " + adresseDe(ctx));
      f.p("Établi le " + leJourDu(ctx) + ". " + ligneEffectif(ctx));
      f.h1("1. Nombre et catégorie des travailleurs à suivre");
      f.p(val(ctx, "categories", "catégories de travailleurs et effectif de chacune"));
      f.h1("2. Risques professionnels auxquels ils sont exposés");
      f.p(val(ctx, "risques", "risques, par catégorie de travailleurs"));
      f.h1("3. Postes relevant d'un suivi individuel renforcé");
      f.p(val(ctx, "renforce", "postes exposant aux risques mentionnés à l'article R. 4624-23"));
      f.note("D. 4622-22 renvoie, pour ces postes, aux risques mentionnés à l'article " +
        "R. 4624-23, que l'application ne reproduit pas : allez le lire pour dresser cette " +
        "liste, elle commande le suivi individuel renforcé de vos salariés.");
      f.h1("4. Avis recueillis");
      f.p("Avis du médecin du travail, le " + dateVal(ctx, "avisMedecin", "date") + ".");
      f.p("Avis du comité social et économique, le " + dateVal(ctx, "avisCSE", "date") +
        " (s'il existe).");
      f.p("Ce document est établi en cohérence avec l'évaluation des risques prévue à l'article " +
        "L. 4121-3 et avec le recensement des postes exposés à des facteurs de risques prévu à " +
        "l'article R. 4624-46. Il est mis à jour chaque année selon les mêmes modalités et tenu " +
        "à disposition de l'administration du travail.");
      f.sign("\n" + signataire(ctx) + "\n" + nomDe(ctx));
      f.note("D. 4622-22, dans ses termes : le document est adressé au service, établi après " +
        "avis du ou des médecins du travail concernés ainsi que du comité social et économique " +
        "s'il existe, mis à jour chaque année et tenu à disposition.");
      return f.L;
    },
    attendus: [
      { cle: "risques", objet: "Les risques professionnels de l'entreprise",
        mots: ["risque", "exposition", "exposé"],
        renvoi: "R. 4624-46",
        clause: ["Risques professionnels relevés dans l'entreprise : [liste des risques, par " +
          "unité de travail]."] },
      { cle: "effectifs", objet: "Les effectifs de salariés exposés",
        mots: ["effectif", "salariés exposés", "nombre de salariés"],
        renvoi: "R. 4624-46",
        clause: ["Effectifs de salariés exposés à chacun de ces risques : [nombre par risque et " +
          "par catégorie]."] },
      { cle: "datee", objet: "Une fiche datée et mise à jour",
        mots: ["mise à jour", "établie le", "date"],
        renvoi: "R. 4624-46, R. 4624-47",
        clause: ["Fiche établie le [date] et mise à jour le [date]. Pour une entreprise " +
          "adhérente à un service interentreprises, la fiche est établie dans l'année qui suit " +
          "l'adhésion (R. 4624-47)."] },
      { cle: "renforce", objet: "Les postes relevant du suivi individuel renforcé",
        mots: ["suivi individuel renforcé", "R. 4624-23", "surveillance renforcée"],
        renvoi: "D. 4622-22",
        clause: ["Postes exposant aux risques mentionnés à l'article R. 4624-23, qui ouvrent le " +
          "suivi individuel renforcé : [liste des postes]."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LA DÉSIGNATION DU SALARIÉ COMPÉTENT

     L. 4644-1, I : l'employeur DÉSIGNE un ou plusieurs salariés compétents.
     Ce n'est pas une faculté, et le texte ne pose pas de seuil d'effectif. La
     pièce sort la décision de désignation et la lettre de mission ; l'avis du
     comité, lui, ne concerne que le cas où l'employeur fait appel à des
     intervenants extérieurs faute de compétences dans l'entreprise.
     ══════════════════════════════════════════════════════════════════════ */

  ajouterPiece({
    id: "PIECE-SALARIE-COMPETENT",
    modules: ["sst", "social"],
    titre: "Désignation du salarié compétent en prévention",
    question: "Avez-vous désigné un ou plusieurs salariés compétents pour s'occuper de la protection et de la prévention des risques ?",
    fichier: "designation-salarie-competent",
    renvoi: "L. 4644-1 (LEGIARTI000043893856)",
    champs: [
      { c: "salarie", nom: "Salarié désigné (nom et prénom)", ph: "Madame Sarah BENOÎT" },
      { c: "fonction", nom: "Sa fonction dans l'entreprise", ph: "responsable maintenance" },
      { c: "effet", nom: "Date d'effet de la désignation", t: "date" },
      { c: "temps", nom: "Temps consacré à la mission", ph: "une demi-journée par semaine" },
      { c: "moyens", nom: "Moyens mis à sa disposition", t: "textarea",
        ph: "accès au document unique et aux rapports de vérification, budget de 1 500 euros par an, accès aux fiches de données de sécurité, liberté de circuler sur les sites" },
      { c: "formation", nom: "Formation prévue (organisme, dates)", ph: "[organisme], du 12 au 14 novembre 2026" },
      { c: "exterieur", nom: "Recours à un intervenant extérieur faute de compétences internes ?",
        t: "select", options: ["non", "oui"] },
      { c: "avisCSE", nom: "Date de l'avis du comité (si recours extérieur)", t: "date" },
    ],
    blocs: function (ctx) {
      var f = feuille();
      var exterieur = String((ctx.valeurs || {}).exterieur || "non") === "oui";
      teteDocument(f, ctx, "DÉSIGNATION D'UN SALARIÉ COMPÉTENT",
        "Protection et prévention des risques professionnels");
      f.p("L'employeur désigne un ou plusieurs salariés compétents pour s'occuper des activités " +
        "de protection et de prévention des risques professionnels de l'entreprise.");
      f.p("En conséquence, " + val(ctx, "salarie", "nom et prénom du salarié") + ", " +
        val(ctx, "fonction", "fonction") + ", est désigné salarié compétent en matière de " +
        "protection et de prévention des risques professionnels, à compter du " +
        dateVal(ctx, "effet", "date d'effet") + ".");
      f.note("L. 4644-1, I, première phrase, dans ses termes.");

      f.h1("La mission");
      f.p("Le salarié désigné s'occupe des activités de protection et de prévention des risques " +
        "professionnels de l'entreprise. À ce titre :");
      f.puce("il participe à l'évaluation des risques et à la tenue à jour du document unique ;");
      f.puce("il propose les actions de prévention et suit leur exécution ;");
      f.puce("il tient le lien avec le service de prévention et de santé au travail ;");
      f.puce("il suit les vérifications périodiques et les contrôles réglementaires ;");
      f.puce("il est associé à l'analyse des accidents du travail et des situations dangereuses ;");
      f.puce("il rend compte à la direction et, s'il en existe un, au comité social et " +
        "économique et à sa commission santé, sécurité et conditions de travail.");
      f.note("Cette énumération est une proposition de contenu : L. 4644-1 fixe l'objet de la " +
        "mission - les activités de protection et de prévention - sans en dresser la liste. " +
        "Retirez ce qui ne correspond pas à votre organisation, ajoutez ce qui y correspond.");

      f.h1("Le temps et les moyens");
      f.p("Temps consacré à la mission : " + val(ctx, "temps", "temps consacré") + ".");
      f.p("Moyens mis à disposition : " + val(ctx, "moyens", "moyens matériels, budget, accès aux documents") + ".");
      f.p("La désignation ne modifie ni le contrat de travail ni la rémunération du salarié. " +
        "Elle ne transfère pas la responsabilité de l'employeur en matière de santé et de " +
        "sécurité.");
      f.note("La dernière phrase n'est pas tirée d'un article lu ici : elle rappelle que " +
        "l'obligation de sécurité pèse sur l'employeur. Le refus du salarié ne peut pas être " +
        "sanctionné sur le fondement de ce document.");

      f.h1("La formation");
      f.p("Le salarié désigné bénéficie d'une formation en matière de santé au travail dans les " +
        "conditions prévues aux articles L. 2315-16 à L. 2315-18 du code du travail. Formation " +
        "prévue : " + val(ctx, "formation", "organisme et dates") + ".");
      f.note("L. 4644-1, I, deuxième phrase, renvoie aux articles L. 2315-16 à L. 2315-18 pour " +
        "les conditions de cette formation. L'application ne les a pas lus et n'en reproduit " +
        "donc ni la durée ni le financement : allez les lire avant de commander la formation.");

      if (exterieur) {
        f.h1("Le recours à des compétences extérieures");
        f.p("Les compétences disponibles dans l'entreprise ne permettent pas d'organiser ces " +
          "activités. L'employeur fait donc appel, après avis du comité social et économique " +
          "rendu le " + dateVal(ctx, "avisCSE", "date de l'avis") + ", aux intervenants en " +
          "prévention des risques professionnels appartenant au service de prévention et de " +
          "santé au travail interentreprises auquel l'entreprise adhère, ou dûment enregistrés " +
          "auprès de l'autorité administrative.");
        f.note("L. 4644-1, I : ce recours n'intervient qu'À DÉFAUT, si les compétences dans " +
          "l'entreprise ne permettent pas d'organiser ces activités, et après avis du comité. " +
          "Il ne dispense pas de la désignation d'un salarié compétent, que le même texte " +
          "impose en premier lieu. L'employeur peut aussi faire appel aux services de prévention " +
          "des caisses de sécurité sociale, à l'organisme professionnel de prévention du " +
          "bâtiment et des travaux publics et à l'Agence nationale pour l'amélioration des " +
          "conditions de travail et son réseau.");
      }

      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + ", en deux exemplaires.\n\n" +
        "Le salarié désigné" + "                                        " + "Pour l'entreprise\n" +
        val(ctx, "salarie", "nom") + "                                   " + signataire(ctx));
      f.note("Remettez un exemplaire au salarié, informez le comité social et économique s'il " +
        "en existe un, et indiquez le nom du salarié désigné à votre service de prévention et " +
        "de santé au travail.");
      return f.L;
    },
    attendus: [
      { cle: "nomme", objet: "Le nom du salarié désigné",
        mots: ["désigne", "désigné", "est chargé"],
        renvoi: "L. 4644-1, I",
        clause: ["[Nom et prénom], [fonction], est désigné salarié compétent pour s'occuper des " +
          "activités de protection et de prévention des risques professionnels de l'entreprise, " +
          "à compter du [date]."] },
      { cle: "mission", objet: "L'objet de la mission",
        mots: ["protection et", "prévention des risques", "activités de prévention"],
        renvoi: "L. 4644-1, I",
        clause: ["Le salarié désigné s'occupe des activités de protection et de prévention des " +
          "risques professionnels de l'entreprise."] },
      { cle: "formation", objet: "La formation en matière de santé au travail",
        mots: ["formation"],
        renvoi: "L. 4644-1, I",
        clause: ["Le salarié désigné bénéficie d'une formation en matière de santé au travail " +
          "dans les conditions prévues aux articles L. 2315-16 à L. 2315-18 du code du travail."] },
      { cle: "moyens", objet: "Le temps et les moyens de la mission",
        mots: ["temps", "moyens", "heures"],
        renvoi: "L. 4644-1",
        clause: ["Temps consacré à la mission : [durée]. Moyens mis à disposition : [accès aux " +
          "documents, budget, matériel]."] },
    ],
  });

  /* ══════════════════════════════════════════════════════════════════════
     LE PLAN DE PRÉVENTION

     Deux temps que le document ne mélange pas : l'inspection commune préalable
     des lieux (R. 4512-2), puis l'analyse commune des risques d'interférence
     et le plan lui-même (R. 4512-6). L'écrit n'est obligatoire que dans deux
     cas, et R. 4512-7 les énonce : 400 heures sur douze mois au plus, ou
     travaux dangereux de la liste ministérielle. En dehors de ces deux cas le
     plan reste dû dès qu'il y a des risques d'interférence, mais il peut être
     verbal - le document le dit, et conseille l'écrit sans le présenter comme
     une obligation.
     ══════════════════════════════════════════════════════════════════════ */

  ajouterPiece({
    id: "PIECE-PLAN-PREVENTION",
    modules: ["sst", "social"],
    titre: "Plan de prévention avec une entreprise extérieure",
    question: "Avez-vous un plan de prévention pour les interventions d'entreprises extérieures chez vous ?",
    fichier: "plan-de-prevention",
    renvoi: "R. 4511-1 (LEGIARTI000018529829), R. 4512-2 (LEGIARTI000018529795), " +
            "R. 4512-6 (LEGIARTI000018529785), R. 4512-7 (LEGIARTI000018529783), " +
            "R. 4512-8 (LEGIARTI000018529781), R. 4512-11 (LEGIARTI000043841178), " +
            "R. 4512-12 (LEGIARTI000018529773), R. 4512-15 (LEGIARTI000018529763), " +
            "R. 4515-4 (LEGIARTI000018529684)",
    champs: [
      { c: "exterieure", nom: "Entreprise extérieure", ph: "SARL NETTOYAGE PLUS" },
      { c: "adresseExt", nom: "Son adresse", ph: "8 rue du Moulin, 59000 Lille" },
      { c: "representantExt", nom: "Son représentant", ph: "M. Karim ALAOUI, gérant" },
      { c: "operation", nom: "Nature de l'opération", t: "textarea",
        ph: "nettoyage des vitres en hauteur et des sanitaires, deux passages par semaine" },
      { c: "lieuOp", nom: "Lieu d'exécution", ph: "bâtiment A, ateliers et bureaux" },
      { c: "debut", nom: "Date de début", t: "date" },
      { c: "fin", nom: "Date de fin", t: "date" },
      { c: "heures", nom: "Heures de travail prévisibles sur douze mois", t: "number", ph: "480" },
      { c: "dangereux", nom: "Travaux figurant sur la liste des travaux dangereux ?",
        t: "select", options: ["non", "oui", "je ne sais pas"] },
      { c: "inspection", nom: "Date de l'inspection commune préalable", t: "date" },
      { c: "participants", nom: "Participants à l'inspection commune", t: "textarea",
        ph: "M. Dupont (entreprise utilisatrice), M. Alaoui (entreprise extérieure), Mme Lambert (CSE)" },
      { c: "phases", nom: "Phases d'activité dangereuses et moyens de prévention", t: "textarea",
        ph: "travail en hauteur sur nacelle : nacelle vérifiée, port du harnais, zone balisée au sol ; co-activité avec les caristes : interdiction de circulation dans l'allée pendant l'intervention" },
      { c: "materiels", nom: "Matériels, installations et dispositifs, et leur entretien", t: "textarea",
        ph: "nacelle fournie par l'entreprise extérieure, vérification périodique à jour ; prises électriques du bâtiment A, contrôlées le 3 mars 2026" },
      { c: "instructions", nom: "Instructions données aux travailleurs", t: "textarea",
        ph: "consigne incendie remise, plan d'évacuation affiché, interdiction d'accès au local chaufferie, port du gilet dans les allées de circulation" },
      { c: "secoursOp", nom: "Organisation des premiers secours", t: "textarea",
        ph: "infirmerie au rez-de-chaussée, deux sauveteurs secouristes du travail joignables au 4512, défibrillateur à l'accueil" },
      { c: "participation", nom: "Participation de travailleurs d'une entreprise aux travaux d'une autre", t: "textarea",
        ph: "aucune ; en cas de besoin, le cariste de l'entreprise utilisatrice assure les manutentions, sous l'autorité de son responsable" },
      { c: "amiante", nom: "Dossier technique amiante joint ?", t: "select", options: ["oui", "non", "sans objet"] },
    ],
    /* L'écrit est obligatoire dans deux cas, et l'écran doit les distinguer :
       le document produit dit lequel s'applique au dossier saisi. */
    blocs: function (ctx) {
      var f = feuille();
      var v = ctx.valeurs || {};
      var h = Number(v.heures);
      var ecrit400 = isFinite(h) && h >= 400;
      var dangereux = String(v.dangereux || "") === "oui";
      teteDocument(f, ctx, "PLAN DE PRÉVENTION",
        "Entreprise utilisatrice et entreprise extérieure");

      f.h1("Les parties");
      f.p("Entreprise utilisatrice : " + nomDe(ctx) + ", " + adresseDe(ctx) + ", représentée par " +
        signataire(ctx) + ".");
      f.p("Entreprise extérieure : " + val(ctx, "exterieure", "dénomination") + ", " +
        val(ctx, "adresseExt", "adresse") + ", représentée par " +
        val(ctx, "representantExt", "nom et qualité") + ".");
      f.note("R. 4511-1 : le titre s'applique dès qu'une entreprise extérieure fait intervenir " +
        "des travailleurs pour exécuter ou participer à l'exécution d'une opération, quelle que " +
        "soit sa nature, dans un établissement de l'entreprise utilisatrice, y compris dans ses " +
        "dépendances ou chantiers.");

      f.h1("L'opération");
      f.p("Nature : " + val(ctx, "operation", "nature de l'opération"));
      f.p("Lieu : " + val(ctx, "lieuOp", "lieu d'exécution") + ".");
      f.p("Période : du " + dateVal(ctx, "debut", "date de début") + " au " +
        dateVal(ctx, "fin", "date de fin") + ".");
      f.p("Nombre total d'heures de travail prévisible : " + val(ctx, "heures", "nombre d'heures") +
        " sur une période inférieure ou égale à douze mois.");
      f.p(ecrit400 || dangereux
        ? "Le présent plan est établi par écrit et arrêté avant le commencement des travaux : " +
          (ecrit400 ? "l'opération représente au moins 400 heures de travail sur une période " +
            "inférieure ou égale à douze mois" : "") +
          (ecrit400 && dangereux ? ", et " : "") +
          (dangereux ? "les travaux à accomplir figurent sur la liste des travaux dangereux " +
            "fixée par arrêté du ministre chargé du travail" : "") + "."
        : "En l'état des heures saisies et de la nature des travaux, l'écrit n'est pas imposé " +
          "par R. 4512-7. Le plan reste dû dès que l'analyse commune révèle des risques " +
          "d'interférence, et il est ici établi par écrit par prudence : c'est la seule façon " +
          "de prouver ce qui a été arrêté en commun.");
      f.note("R. 4512-7 : l'écrit est obligatoire dans deux cas, l'un tenant aux 400 heures - y " +
        "compris s'il apparaît en cours d'exécution que ce nombre doit être atteint -, l'autre " +
        "aux travaux dangereux d'une liste fixée par arrêté. L'application n'a pas lu cet " +
        "arrêté et ne dit pas si vos travaux y figurent.");

      f.h1("L'inspection commune préalable");
      f.p("Une inspection commune des lieux de travail, des installations qui s'y trouvent et " +
        "des matériels éventuellement mis à disposition de l'entreprise extérieure a eu lieu le " +
        dateVal(ctx, "inspection", "date de l'inspection commune") + ", préalablement à " +
        "l'exécution de l'opération.");
      f.p("Participants : " + val(ctx, "participants", "noms et qualités"));
      f.note("R. 4512-2. Elle précède le plan : c'est d'elle que sortent les informations sur " +
        "lesquelles les chefs d'entreprise analysent ensemble les risques d'interférence " +
        "(R. 4512-6).");

      f.h1("L'analyse commune des risques d'interférence");
      f.p("Au vu des informations et éléments recueillis au cours de l'inspection commune " +
        "préalable, les chefs des entreprises utilisatrice et extérieure ont procédé en commun à " +
        "une analyse des risques pouvant résulter de l'interférence entre les activités, " +
        "installations et matériels. Ces risques existent ; les mesures ci-après sont arrêtées " +
        "d'un commun accord avant le début des travaux.");
      f.note("R. 4512-6, dans ses termes.");

      f.h1("1. Phases d'activité dangereuses et moyens de prévention correspondants");
      f.p(val(ctx, "phases", "phases dangereuses et moyens de prévention"));
      f.h1("2. Adaptation des matériels, installations et dispositifs, et conditions d'entretien");
      f.p(val(ctx, "materiels", "matériels, installations, dispositifs et leur entretien"));
      f.h1("3. Instructions à donner aux travailleurs");
      f.p(val(ctx, "instructions", "instructions données aux travailleurs"));
      f.h1("4. Organisation des premiers secours en cas d'urgence");
      f.p(val(ctx, "secoursOp", "organisation des secours et dispositif de l'entreprise utilisatrice"));
      f.h1("5. Participation de travailleurs d'une entreprise aux travaux d'une autre");
      f.p(val(ctx, "participation", "conditions de la participation et organisation du commandement"));
      f.note("Ces cinq points sont les dispositions que R. 4512-8 exige au moins. Ce qui les " +
        "remplit vient de votre opération : l'application ne connaît ni vos lieux, ni vos " +
        "matériels, ni vos co-activités.");

      f.h1("Pièces jointes");
      f.p(String(v.amiante || "") === "oui"
        ? "Sont joints au présent plan les dossiers techniques regroupant les informations " +
          "relatives à la recherche et à l'identification des matériaux contenant de l'amiante, " +
          "ou, le cas échéant, le rapport de repérage de l'amiante."
        : "Dossiers techniques amiante : " + (String(v.amiante || "") === "sans objet"
            ? "sans objet pour cette opération."
            : "[à joindre - voir la note ci-dessous]"));
      f.note("R. 4512-11 impose de joindre au plan de prévention les dossiers techniques " +
        "amiante prévus aux articles R. 1334-29-4 à R. 1334-29-6 du code de la santé publique " +
        "et à l'article R. 126-10 du code de la construction et de l'habitation ou, le cas " +
        "échéant, le rapport de repérage prévu à l'article R. 4412-97-5 du code du travail. Ces " +
        "articles-là n'ont pas été lus par l'application : allez les lire.");

      f.trait();
      f.sign("Fait à " + villeDe(ctx) + ", le " + leJourDu(ctx) + ", avant le commencement des " +
        "travaux, en deux exemplaires.\n\nPour l'entreprise utilisatrice        Pour l'entreprise extérieure\n" +
        signataire(ctx) + "                    " + val(ctx, "representantExt", "nom et qualité"));

      if (ecrit400 || dangereux) {
        f.note("Parce que l'écrit est obligatoire ici : le plan est tenu pendant toute la durée " +
          "des travaux à la disposition de l'inspection du travail, des agents de prévention des " +
          "organismes de sécurité sociale et, le cas échéant, de l'OPPBTP ; et le chef de " +
          "l'entreprise utilisatrice informe par écrit l'inspection du travail de l'ouverture " +
          "des travaux (R. 4512-12).");
      }
      f.note("Avant le début des travaux et sur le lieu même de leur exécution, le chef de " +
        "l'entreprise extérieure fait connaître aux travailleurs qu'il y affecte les dangers " +
        "spécifiques auxquels ils sont exposés et les mesures de prévention prises, précise les " +
        "zones dangereuses et les moyens de les matérialiser, explique l'emploi des dispositifs " +
        "de protection et montre les voies d'accès, les locaux mis à disposition et les issues " +
        "de secours (R. 4512-15).");
      f.note("Pour une opération de chargement ou de déchargement, ce n'est pas un plan de " +
        "prévention qu'il faut : R. 4515-4 impose un document écrit dit « protocole de " +
        "sécurité », qui remplace le plan de prévention.");
      return f.L;
    },
    attendus: [
      { cle: "inspection", objet: "L'inspection commune préalable des lieux",
        mots: ["inspection commune", "visite préalable", "inspection préalable"],
        renvoi: "R. 4512-2",
        clause: ["Une inspection commune des lieux de travail, des installations qui s'y trouvent " +
          "et des matériels éventuellement mis à disposition de l'entreprise extérieure a eu lieu " +
          "le [date], préalablement à l'exécution de l'opération. Participants : [noms et qualités]."] },
      { cle: "analyse", objet: "L'analyse commune des risques d'interférence",
        mots: ["interférence", "analyse en commun", "analyse des risques"],
        renvoi: "R. 4512-6",
        clause: ["Au vu des informations recueillies au cours de l'inspection commune préalable, " +
          "les chefs des entreprises utilisatrice et extérieures ont procédé en commun à une " +
          "analyse des risques pouvant résulter de l'interférence entre les activités, " +
          "installations et matériels."] },
      { cle: "phases", objet: "Les phases d'activité dangereuses et leurs moyens de prévention",
        mots: ["phases d'activité", "phase dangereuse", "activités dangereuses"],
        renvoi: "R. 4512-8, 1°",
        clause: ["1. Phases d'activité dangereuses et moyens de prévention spécifiques " +
          "correspondants : [phases et mesures]."] },
      { cle: "materiels", objet: "L'adaptation des matériels et leurs conditions d'entretien",
        mots: ["matériel", "installations", "entretien"],
        renvoi: "R. 4512-8, 2°",
        clause: ["2. Adaptation des matériels, installations et dispositifs à la nature des " +
          "opérations à réaliser, et définition de leurs conditions d'entretien : [description]."] },
      { cle: "instructions", objet: "Les instructions à donner aux travailleurs",
        mots: ["instruction", "consigne"],
        renvoi: "R. 4512-8, 3°",
        clause: ["3. Instructions à donner aux travailleurs : [instructions]."] },
      { cle: "secours", objet: "L'organisation des premiers secours",
        mots: ["premiers secours", "secours", "urgence"],
        renvoi: "R. 4512-8, 4°",
        clause: ["4. Organisation mise en place pour assurer les premiers secours en cas " +
          "d'urgence, et description du dispositif mis en place à cet effet par l'entreprise " +
          "utilisatrice : [organisation]."] },
      { cle: "participation", objet: "La participation de travailleurs d'une entreprise aux travaux d'une autre",
        mots: ["participation", "commandement", "coordination"],
        renvoi: "R. 4512-8, 5°",
        clause: ["5. Conditions de la participation des travailleurs d'une entreprise aux travaux " +
          "réalisés par une autre en vue d'assurer la coordination nécessaire au maintien de la " +
          "sécurité, notamment l'organisation du commandement : [conditions]."] },
      { cle: "amiante", objet: "Les dossiers techniques amiante joints au plan",
        mots: ["amiante", "repérage"],
        renvoi: "R. 4512-11",
        clause: ["Sont joints au présent plan les dossiers techniques regroupant les informations " +
          "relatives à la recherche et à l'identification des matériaux contenant de l'amiante, " +
          "ou, le cas échéant, le rapport de repérage de l'amiante."] },
      { cle: "disposition", objet: "La tenue à disposition et l'information de l'inspection du travail",
        mots: ["disposition de l'inspection", "ouverture des travaux", "inspection du travail"],
        renvoi: "R. 4512-12",
        clause: ["Le présent plan est tenu, pendant toute la durée des travaux, à la disposition " +
          "de l'inspection du travail, des agents de prévention des organismes de sécurité " +
          "sociale et, le cas échéant, de l'OPPBTP. Le chef de l'entreprise utilisatrice informe " +
          "par écrit l'inspection du travail de l'ouverture des travaux."] },
    ],
  });

/* ==SUITE== */
})(typeof window !== "undefined" ? window : this);
