/* Les documents que l'application PRODUIT — module « comité social et économique »,
   troisième série : les commissions, les budgets, les expertises, et les deux
   points à faire examiner.

   POURQUOI UN TROISIÈME FICHIER

   « documents-cse.js » a pris dix-neuf points — effectifs, mise en place,
   périmètre, élections, consultations. « documents-cse-2.js » en a pris quinze
   — recevabilité, moyens du comité, commission santé, sécurité et conditions de
   travail. Douze restaient sans document, et ce sont ceux où l'argent circule :
   les commissions obligatoires, les deux budgets, le financement et la
   contestation des expertises, les accords à faire relire et les faits
   susceptibles de caractériser une entrave. Ce fichier les écrit.

   Trois fichiers plutôt qu'un seul de dix mille lignes : on travaille sur le
   calcul de la subvention de fonctionnement sans risquer d'abîmer le protocole
   préélectoral, et le registre refuse de lui-même tout identifiant déjà pris —
   c'est lui, et non la vigilance, qui garantit qu'aucun point n'est servi deux
   fois.

   LES TROIS RÈGLES SONT CELLES DES DEUX PREMIERS FICHIERS, ET ELLES N'ONT PAS
   BOUGÉ

   1. Rien qui n'ait été lu à la source. Aucun article n'est reproduit ici qui ne
      figure dans « moteur/cse/textes_cse.json », le corpus capté du module, ou
      dans le fondement du contrôle servi. Les articles que ces textes RENVOIENT
      sans que le corpus les porte sont NOMMÉS, jamais reproduits ni paraphrasés,
      et le document dit alors expressément que l'application ne les a pas lus :

        · L. 242-1 du code de la sécurité sociale et L. 741-10 du code rural et
          de la pêche maritime, auxquels L. 2315-61 et L. 2312-83 empruntent la
          définition de la masse salariale brute ;
        · R. 612-1 du code de commerce, dont D. 2315-29 tire deux de ses trois
          seuils, et D. 2315-34, qui définit les ressources annuelles du comité ;
        · L. 2315-44-2, dont D. 2315-29 fixe le seuil à 30 000 € ;
        · L. 2315-81-1, auquel le 3° de L. 2315-86 rattache le point de départ du
          délai de contestation du coût prévisionnel ;
        · L. 1233-35-1, que L. 2315-86 réserve, et L. 1233-30, auquel L. 1233-34
          renvoie pour la première réunion ;
        · L. 2231-5 et L. 2231-5-1, dont L. 2262-14 tire la notification et la
          publication qui font courir son délai de deux mois ;
        · L. 123-12 du code de commerce, visé par L. 2315-64 ;
        · les articles 641 et 642 du code de procédure civile, sur lesquels le
          moteur du module fonde la computation du délai de dix jours.

      Un document qui aurait besoin d'un de ces textes le dit et s'arrête là où
      la lecture s'arrête. C'est moins confortable qu'une paraphrase, et c'est la
      seule chose qui distingue une pièce vérifiable d'une pièce plausible.

   2. Aucune peine annoncée qui ne soit portée par un texte capté. Un seul des
      douze points en porte une : CSE-CTL-DET-03, dont le fondement est
      L. 2317-1, qui punit l'entrave à la constitution du comité, à la libre
      désignation de ses membres et à son fonctionnement régulier. Ce texte est
      cité là, et nulle part ailleurs.

      Pour les onze autres, le document dit ce qui se joue réellement, et c'est
      souvent plus lourd qu'une amende : une SUBVENTION QUI RESTE DUE et se
      réclame, une CONTRIBUTION dont le rapport à la masse salariale doit être
      rétabli, une RÉPARTITION DE FRAIS D'EXPERTISE à corriger avant paiement
      avec, pour l'employeur qui supporte le tout au titre du 3° de L. 2315-80,
      trois années sans transfert d'excédent possible, une DÉLIBÉRATION
      IRRÉGULIÈRE qui ne fonde plus l'expertise décidée, une CONTESTATION
      IRRECEVABLE passé le dixième jour, une DÉCISION prise sur une consultation
      qui n'en était pas une.

   3. Les faits et les chiffres ne s'inventent jamais. Aucun document n'écrit la
      masse salariale de l'entreprise, le montant de la subvention versée, le
      coût de l'expertise, le nom des élus ni la date d'une délibération. Tout
      cela sort ENTRE CROCHETS, avec la source où l'employeur ira le chercher —
      déclarations sociales nominatives, comptes annuels du comité, justificatifs
      de versement, délibération, cahier des charges. Ce que le dossier porte
      lui-même est repris tel quel, et rien de plus.

      LE CALCUL, LUI, DESCEND DANS LE DOCUMENT. C'est même tout l'intérêt des
      deux notes budgétaires : l'assiette reste entre crochets, mais le taux, la
      multiplication, la soustraction et l'échéancier sont écrits en toutes
      lettres, ligne à ligne, de sorte qu'il ne reste qu'à remplacer un crochet
      par un nombre pour obtenir le montant dû. Quand la fiche porte l'assiette,
      le document la reprend et achève le calcul.

   L'ORDRE DES TROIS ÉTAGES COMMANDE ENCORE ICI. Les trois commissions de
   L. 2315-49, L. 2315-50 et L. 2315-56, la commission économique de L. 2315-46 :
   tout cela ne joue qu'« en l'absence d'accord prévu à l'article L. 2315-45 ».
   Le plancher de L. 2312-81 ne joue qu'« à défaut d'accord ». Chaque document
   commence donc par chercher l'accord, et n'applique le supplétif qu'ensuite.

   ET AUCUN SEUIL N'EST SUPPOSÉ FRANCHI. Trois cents salariés pour les
   commissions de la formation, du logement et de l'égalité professionnelle ;
   mille pour la commission économique ; deux mille pour le taux de 0,22 %. Quand
   l'effectif manque au dossier, le document expose la règle, laisse l'effectif
   entre crochets et dit ce qui se passe de part et d'autre du seuil — il ne
   conclut pas. Quand l'effectif est là, il conclut, et écrit sur quoi.  */
(function (global) {
  "use strict";

  var DP = global.DocumentsProduits;
  if (!DP || typeof DP.ajouter !== "function") return;

  var O = DP.outils;
  var cro = O.cro;
  var leJour = O.leJour;
  var dans = O.dans;
  var entete = O.entete;

  /* ─────────────────────────────── petits outils ─────────────────────────── */

  var TRAIT = "────────────────────────────────────────────────────────────────────────";
  var DOUBLE = "════════════════════════════════════════════════════════════════════════";

  function dateDe(v) {
    if (!v) return null;
    var x = v instanceof Date ? v : new Date(String(v));
    return isNaN(x) ? null : x;
  }

  function jourOu(v, quoi) {
    var x = dateDe(v);
    return x ? leJour(x) : "[" + (quoi || "date") + "]";
  }

  function jour0(ctx) {
    return ctx && ctx.aujourdhui instanceof Date ? ctx.aujourdhui : new Date();
  }

  function nb(v) {
    if (v === null || v === undefined || v === "") return null;
    var n = Number(String(v).replace(/\s/g, "").replace(",", "."));
    return isFinite(n) ? n : null;
  }

  function eur(n) {
    if (n === null || n === undefined || !isFinite(n)) return "[montant]";
    var s = Math.round(n * 100) / 100;
    var neg = s < 0;
    s = Math.abs(s);
    var e = String(Math.floor(s));
    var d = Math.round((s - Math.floor(s)) * 100);
    e = e.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "-" : "") + e + (d ? "," + (d < 10 ? "0" + d : d) : "") + " €";
  }

  /* Un rapport s'écrit en pourcentage avec assez de décimales pour que la
     comparaison de deux exercices ait un sens : 0,80 % et 0,77 % ne se
     distinguent plus au dixième. */
  function pourcent(n, dec) {
    if (n === null || n === undefined || !isFinite(n)) return "[taux]";
    var d = dec === undefined ? 4 : dec;
    return (n * 100).toFixed(d).replace(".", ",") + " %";
  }

  /* Les tableaux de ce fichier sont dessinés en caractères : une colonne qui
     déborde casse la ligne du bas et rend le tableau illisible. On complète à
     la largeur, et on tronque plutôt que de déborder. */
  function pad(s, n) {
    var t = String(s == null ? "" : s);
    if (t.length > n) return t.slice(0, n);
    while (t.length < n) t += " ";
    return t;
  }

  function liste(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    var s = String(v).trim();
    if (s.charAt(0) === "[") { try { return JSON.parse(s); } catch (e) {} }
    return s ? s.split(/\s*[;,]\s*/).filter(Boolean) : [];
  }

  function objet(v) {
    if (!v) return {};
    if (typeof v === "object") return v;
    var s = String(v).trim();
    if (s.charAt(0) === "{") { try { return JSON.parse(s); } catch (e) {} }
    return {};
  }

  function nom(ctx) {
    var p = (ctx && ctx.profil) || {};
    var f = (ctx && ctx.fiche) || {};
    return cro(p.denomination || p.entreprise || f.entreprise, "DÉNOMINATION SOCIALE");
  }

  function lieu(ctx) { return cro(((ctx && ctx.profil) || {}).ville, "lieu"); }

  function signataire(ctx) {
    return cro(((ctx && ctx.profil) || {}).responsable, "Nom et qualité du représentant légal");
  }

  function effectifDe(ctx) {
    var p = (ctx && ctx.profil) || {}, f = (ctx && ctx.fiche) || {};
    return nb(f.effectif != null ? f.effectif : p.effectif);
  }

  /* Une réponse oui/non de la fiche, telle qu'elle a été saisie. « Non
     renseigné » est une troisième valeur, et elle se voit. */
  function oui(v) {
    if (v === true) return true;
    if (v === false) return false;
    var s = String(v == null ? "" : v).trim().toLowerCase();
    if (s === "oui" || s === "true") return true;
    if (s === "non" || s === "false") return false;
    return null;
  }

  function ouiNon(v, siVide) {
    var b = oui(v);
    return b === true ? "oui" : b === false ? "non" : "[" + (siVide || "à renseigner") + "]";
  }

  function usage(L) {
    L.push("COMMENT SE SERVIR DE CE DOCUMENT");
    L.push("");
    L.push("Ce qui est écrit sans crochets est imposé par la loi et fondé sur l'article");
    L.push("cité en regard. Ce qui est ENTRE CROCHETS vous appartient : soit la loi vous");
    L.push("en laisse le choix, soit l'application ne dispose pas de la donnée. Remplacez");
    L.push("chaque crochet, ou supprimez la ligne si elle ne vous concerne pas — n'en");
    L.push("laissez aucun dans le document que vous signez, adoptez ou adressez.");
    L.push("");
    L.push("Gardez les mentions d'articles : elles vous serviront le jour où la pièce se");
    L.push("discutera devant l'inspection du travail, devant le trésorier du comité ou");
    L.push("devant le juge.");
    L.push("");
    L.push(TRAIT);
    L.push("");
  }

  function pied(L, arts, nonLus) {
    L.push("");
    L.push(TRAIT);
    L.push("");
    if (arts && arts.length) {
      L.push("FONDEMENT — les articles du code du travail lus à la source :");
      L.push(arts.join(" · ") + ".");
    }
    if (nonLus && nonLus.length) {
      L.push("");
      L.push("NOMMÉS MAIS NON LUS — l'application ne dispose pas de leur texte et ne les");
      L.push("reproduit donc pas ; reportez-vous-y avant de conclure :");
      L.push(nonLus.join(" · ") + ".");
    }
    L.push("");
    L.push("Ce document ne vaut pas consultation juridique. Votre convention collective,");
    L.push("vos accords d'entreprise, vos usages et vos engagements unilatéraux peuvent");
    L.push("ajouter des exigences que l'application ne lit pas, et priment lorsqu'ils sont");
    L.push("plus favorables. L'application n'apprécie pas ce que la loi confie à");
    L.push("l'appréciation du juge.");
    return L.join("\n");
  }

  function titre(L, t) {
    L.push(DOUBLE);
    L.push(t.toUpperCase());
    L.push(DOUBLE);
    L.push("");
  }

  function courrier(L, rang, objetTxt, avertissement) {
    L.push("");
    L.push(DOUBLE);
    L.push("COURRIER " + rang + " — " + objetTxt.toUpperCase());
    L.push(DOUBLE);
    L.push("");
    if (avertissement) { avertissement.forEach(function (a) { L.push(a); }); L.push(""); }
  }

  function papier(L, ctx, destinataire, dateLigne) {
    var p = (ctx && ctx.profil) || {};
    L.push(nom(ctx));
    L.push(cro(p.adresse, "adresse du siège"));
    L.push("");
    destinataire.forEach(function (x) { L.push(x); });
    L.push("");
    L.push(lieu(ctx) + ", le " + (dateLigne || leJour(jour0(ctx))));
    L.push("");
  }

  function salutation(L, ctx, formule) {
    L.push(formule || "Je vous prie d'agréer, Mesdames, Messieurs, l'expression de ma considération distinguée.");
    L.push("");
    L.push(cro(((ctx && ctx.profil) || {}).responsable, "Nom et qualité"));
    L.push("");
  }

  function calendrier(L, lignes) {
    L.push("");
    L.push(DOUBLE);
    L.push("VOTRE CALENDRIER");
    L.push(DOUBLE);
    L.push("");
    lignes.forEach(function (x) { L.push(x); });
  }

  /* Le rappel de l'ordre des sources pour les commissions du comité. Trois
     documents s'en servent : il est écrit une fois. */
  function ordreCommissions(L) {
    L.push("  1er étage — L'ACCORD D'ENTREPRISE conclu dans les conditions prévues au");
    L.push("     premier alinéa de l'article L. 2232-12 peut prévoir la création de");
    L.push("     commissions supplémentaires pour l'examen de problèmes particuliers.");
    L.push("     L'employeur peut alors leur adjoindre, avec voix consultative, des experts");
    L.push("     et des techniciens appartenant à l'entreprise et choisis en dehors du");
    L.push("     comité, tenus au secret professionnel et à l'obligation de discrétion de");
    L.push("     l'article L. 2315-3. Les rapports des commissions sont soumis à la");
    L.push("     délibération du comité (L. 2315-45).");
    L.push("");
    L.push("  2e étage — EN L'ABSENCE DE CET ACCORD, et à ce moment seulement, jouent les");
    L.push("     commissions supplétives : la commission de la formation (L. 2315-49), la");
    L.push("     commission d'information et d'aide au logement (L. 2315-50), la commission");
    L.push("     de l'égalité professionnelle (L. 2315-56) à trois cents salariés, et la");
    L.push("     commission économique (L. 2315-46) à mille salariés. Chacun de ces quatre");
    L.push("     articles s'ouvre par les mots « En l'absence d'accord prévu à l'article");
    L.push("     L. 2315-45 » : l'ordre n'est pas une commodité de rédaction.");
    L.push("");
    L.push("  À PART — la commission des marchés ne dépend d'aucun accord ni d'aucun");
    L.push("     effectif d'entreprise : elle se déclenche sur les COMPTES DU COMITÉ");
    L.push("     (L. 2315-44-1, D. 2315-29).");
    L.push("");
  }

  /* La position de l'entreprise au regard d'un seuil, dite sans jamais la
     supposer. Renvoie trois états : au-dessus, en dessous, inconnu. */
  function seuil(eff, s) {
    if (eff == null) return null;
    return eff >= s;
  }

  function ligneSeuil(L, eff, s, ceQuiSeDeclenche) {
    if (eff == null) {
      L.push("  Effectif de l'entreprise ... [À RENSEIGNER]");
      L.push("  Le seuil de " + s + " salariés ne peut donc pas être tranché ici, et il ne");
      L.push("  sera pas supposé franchi.");
      return;
    }
    L.push("  Effectif de l'entreprise ... " + eff + " salariés");
    if (eff >= s) {
      L.push("  Seuil de " + s + " salariés ATTEINT :");
      L.push("  " + ceQuiSeDeclenche);
    } else {
      L.push("  Seuil de " + s + " salariés non atteint à cette date.");
    }
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LES GÉNÉRATEURS
     ══════════════════════════════════════════════════════════════════════════ */

  /* ────────────────────────────────────────────────────────────────────────
     LES COMMISSIONS OBLIGATOIRES
     ──────────────────────────────────────────────────────────────────────── */

  /* Trois commissions, un seul acte : elles naissent du même article de renvoi
     (L. 2315-45), du même seuil (trois cents salariés) et de la même
     résolution. Les séparer en trois documents obligerait le comité à trois
     réunions là où une suffit, et ferait perdre de vue que c'est l'ABSENCE
     d'accord qui les commande toutes les trois. */
  DP.ajouter("CSE-CTL-COM-01", {
    nom: "Les trois commissions supplétives : les résolutions constitutives, le procès-verbal et la note d'organisation",
    detail: "La recherche préalable de l'accord de L. 2315-45, les trois résolutions " +
            "constituant la commission de la formation, celle d'information et d'aide au " +
            "logement et celle de l'égalité professionnelle, avec leurs attributions et " +
            "leurs moyens, le procès-verbal de la délibération, la note d'organisation " +
            "des réunions et le courrier au secrétaire du comité.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var accord = oui(f.accordCommissions);
      var faites = liste(f.commissionsConstituees);
      var a = seuil(eff, 300);
      var L = [];

      L = L.concat(entete(ctx, "Constitution des commissions de la formation, du logement et de l'égalité professionnelle",
        "articles L. 2315-45, L. 2315-49, L. 2315-50, L. 2315-51 et L. 2315-56 du code du travail"));
      usage(L);

      L.push("CE QUE CE DOCUMENT PRODUIT");
      L.push("");
      L.push("Trois actes et deux courriers, dans l'ordre où ils se signent :");
      L.push("");
      L.push("  1. le constat préalable — y a-t-il un accord de L. 2315-45 ? ;");
      L.push("  2. les TROIS RÉSOLUTIONS constitutives, prêtes à être mises aux voix ;");
      L.push("  3. le PROCÈS-VERBAL de la délibération qui les institue ;");
      L.push("  4. la NOTE D'ORGANISATION des réunions des trois commissions ;");
      L.push("  5. le COURRIER au secrétaire du comité portant l'inscription du point à");
      L.push("     l'ordre du jour, et le courrier de transmission aux membres désignés.");
      L.push("");
      L.push("Ces commissions ne sont pas des comités d'étude facultatifs : la commission");
      L.push("de la formation et celle de l'égalité professionnelle PRÉPARENT DES");
      L.push("DÉLIBÉRATIONS DU COMITÉ prévues à l'article L. 2312-17 — les orientations");
      L.push("stratégiques, la situation économique et financière, la politique sociale,");
      L.push("les conditions de travail et l'emploi. Leur absence prive ces délibérations");
      L.push("de la préparation que la loi leur assigne.");
      L.push("");

      titre(L, "1 — Le constat préalable : quel étage s'applique");
      ordreCommissions(L);
      L.push("  Un accord de L. 2315-45 organise-t-il les commissions du comité ? ...... " +
        ouiNon(f.accordCommissions, "oui / non — à établir sur l'accord lui-même"));
      if (accord === true) {
        L.push("");
        L.push("  UN ACCORD EST DÉCLARÉ. Alors les articles L. 2315-49, L. 2315-50 et");
        L.push("  L. 2315-56 ne s'appliquent pas : ils ne jouent qu'« en l'absence d'accord");
        L.push("  prévu à l'article L. 2315-45 ». Ce sont les commissions de l'accord qui");
        L.push("  fonctionnent, dans les termes de l'accord. Reportez la référence de");
        L.push("  l'accord ci-dessous, et n'adoptez les résolutions du paragraphe 3 QUE POUR");
        L.push("  les commissions que l'accord ne couvre pas.");
        L.push("");
        L.push("     Accord du [DATE] · déposé le [DATE] · article(s) relatif(s) aux");
        L.push("     commissions : [ ] · commissions qu'il institue : [ ]");
      } else if (accord === false) {
        L.push("");
        L.push("  AUCUN ACCORD N'EST DÉCLARÉ. Le régime supplétif s'applique donc en");
        L.push("  entier : les trois résolutions du paragraphe 3 sont à adopter, sous");
        L.push("  réserve du seuil examiné au paragraphe 2.");
      } else {
        L.push("");
        L.push("  LA RÉPONSE MANQUE. Cherchez l'accord avant de délibérer : s'il existe, les");
        L.push("  résolutions du paragraphe 3 sont sans objet ; s'il n'existe pas, elles sont");
        L.push("  dues. Une résolution adoptée par-dessus un accord existant n'annule pas");
        L.push("  l'accord — elle crée deux régimes concurrents dans la même entreprise.");
      }
      L.push("");
      if (faites.length) {
        L.push("  Commissions déjà déclarées constituées : " + faites.join(" · ") + ".");
        L.push("  Ne reprenez pas la résolution de celles-là ; vérifiez seulement que la");
        L.push("  délibération qui les a instituées figure au procès-verbal, datée.");
        L.push("");
      }

      titre(L, "2 — Le seuil de trois cents salariés");
      ligneSeuil(L, eff, 300, "les trois commissions sont dues, à défaut d'accord.");
      L.push("");
      L.push("« Le seuil de trois cents salariés mentionné au présent chapitre est réputé");
      L.push("franchi lorsque l'effectif de l'entreprise dépasse ce seuil PENDANT DOUZE MOIS");
      L.push("CONSÉCUTIFS. L'employeur dispose d'un délai d'un an à compter du franchissement");
      L.push("de ce seuil pour se conformer complètement aux obligations d'information et de");
      L.push("consultation du comité social et économique qui en découlent » (L. 2312-34).");
      L.push("");
      L.push("Deux conséquences pratiques, souvent confondues :");
      L.push("");
      L.push("  · le seuil ne se franchit pas le mois où l'effectif dépasse trois cents,");
      L.push("    mais au terme de douze mois consécutifs au-dessus ;");
      L.push("  · le délai d'un an que le texte accorde ne suspend pas la constitution des");
      L.push("    commissions : il porte sur les obligations D'INFORMATION ET DE");
      L.push("    CONSULTATION qui découlent du franchissement.");
      L.push("");
      L.push("  Mois consécutifs au-dessus de trois cents à ce jour : [ ] — relevé sur");
      L.push("  [états d'effectif ou déclarations sociales nominatives, mois par mois].");
      L.push("");
      if (a === false) {
        L.push("  L'effectif déclaré étant inférieur à trois cents, les résolutions qui");
        L.push("  suivent ne sont PAS DUES aujourd'hui. Le comité reste libre de constituer");
        L.push("  des commissions ; il le fait alors de son propre chef, et non en exécution");
        L.push("  de L. 2315-49, L. 2315-50 et L. 2315-56. Conservez le document : il servira");
        L.push("  le jour où l'effectif aura dépassé trois cents pendant douze mois.");
        L.push("");
        L.push("  Une seule exception se lit dans le texte : « Les entreprises de moins de");
        L.push("  trois cents salariés PEUVENT SE GROUPER ENTRE ELLES pour former » la");
        L.push("  commission d'information et d'aide au logement (L. 2315-50, second alinéa).");
        L.push("");
      }

      titre(L, "3 — Les trois résolutions, prêtes à être mises aux voix");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Réunion du [DATE DE LA RÉUNION] · point [n°] de l'ordre du jour");
      L.push("");
      L.push("Les résolutions du comité sont prises À LA MAJORITÉ DES MEMBRES PRÉSENTS. Le");
      L.push("président du comité NE PARTICIPE PAS AU VOTE lorsqu'il consulte les membres");
      L.push("élus du comité en tant que délégation du personnel (L. 2315-32).");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("RÉSOLUTION N° 1 — COMMISSION DE LA FORMATION");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ", constatant qu'aucun accord");
      L.push("prévu à l'article L. 2315-45 du code du travail n'organise ses commissions et");
      L.push("que l'entreprise emploie au moins trois cents salariés, CONSTITUE une");
      L.push("commission de la formation, en application de l'article L. 2315-49.");
      L.push("");
      L.push("ATTRIBUTIONS — la commission est chargée, aux termes mêmes de L. 2315-49 :");
      L.push("");
      L.push("  1° de préparer les délibérations du comité prévues aux 1° et 3° de");
      L.push("     l'article L. 2312-17 dans les domaines qui relèvent de sa compétence,");
      L.push("     c'est-à-dire les délibérations sur LES ORIENTATIONS STRATÉGIQUES DE");
      L.push("     L'ENTREPRISE (1°) et sur LA POLITIQUE SOCIALE DE L'ENTREPRISE, LES");
      L.push("     CONDITIONS DE TRAVAIL ET L'EMPLOI (3°) ;");
      L.push("  2° d'étudier les moyens permettant de favoriser l'expression des salariés");
      L.push("     en matière de formation et de participer à leur information dans ce");
      L.push("     domaine ;");
      L.push("  3° d'étudier les problèmes spécifiques concernant l'emploi et le travail des");
      L.push("     jeunes et des travailleurs handicapés.");
      L.push("");
      L.push("CE QUI LUI EST SOUMIS — en l'absence d'accord prévu à l'article L. 2315-45, le");
      L.push("comité et, dans les entreprises d'au moins trois cents salariés, la commission");
      L.push("de la formation SONT CONSULTÉS sur les problèmes généraux relatifs à la mise en");
      L.push("œuvre des dispositifs de formation professionnelle continue et de la validation");
      L.push("des acquis de l'expérience (R. 2315-30) ; ils SONT INFORMÉS des possibilités de");
      L.push("congé accordées aux salariés, des conditions dans lesquelles ces congés ont été");
      L.push("accordés et des résultats obtenus (R. 2315-31).");
      L.push("");
      L.push("COMPOSITION — [nombre] membres : [noms ou matricules des membres désignés].");
      L.push("La loi ne fixe pas la composition de cette commission : c'est au comité de la");
      L.push("déterminer, et la résolution doit donc la porter expressément.");
      L.push("");
      L.push("PRÉSIDENCE ET RAPPORTEUR — [désigner le rapporteur chargé de présenter les");
      L.push("travaux de la commission au comité].");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention — le président ne prenant pas");
      L.push("part au vote (L. 2315-32).");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("RÉSOLUTION N° 2 — COMMISSION D'INFORMATION ET D'AIDE AU LOGEMENT");
      L.push("");
      L.push("Le comité, aux mêmes constatations, CRÉE en son sein une commission");
      L.push("d'information et d'aide au logement des salariés (L. 2315-50).");
      L.push("");
      L.push("MISSIONS — « La commission d'information et d'aide au logement facilite le");
      L.push("logement et l'accession des salariés à la propriété et à la location des locaux");
      L.push("d'habitation. À cet effet, la commission : 1° Recherche les possibilités");
      L.push("d'offre de logements correspondant aux besoins du personnel, EN LIAISON AVEC");
      L.push("LES ORGANISMES HABILITÉS À COLLECTER LA PARTICIPATION DES EMPLOYEURS À L'EFFORT");
      L.push("DE CONSTRUCTION ; 2° Informe les salariés sur leurs conditions d'accès à la");
      L.push("propriété ou à la location d'un logement et les assiste dans les démarches");
      L.push("nécessaires pour l'obtention des aides financières auxquelles ils peuvent");
      L.push("prétendre » (L. 2315-51).");
      L.push("");
      L.push("ELLE AIDE AUSSI les salariés souhaitant acquérir ou louer un logement au titre");
      L.push("de la participation des employeurs à l'effort de construction, ou investir les");
      L.push("fonds provenant des droits constitués en application des dispositions relatives");
      L.push("à l'intéressement, à la participation et à l'épargne salariale. À cet effet,");
      L.push("elle PROPOSE DANS L'ENTREPRISE DES CRITÈRES DE CLASSEMENT des salariés");
      L.push("candidats à l'accession à la propriété ou à la location d'un logement, tenant");
      L.push("compte notamment des charges de famille des candidats (L. 2315-52).");
      L.push("");
      L.push("  Critères de classement proposés par la commission : [à établir par la");
      L.push("  commission elle-même — ils ne peuvent pas figurer d'avance dans la");
      L.push("  résolution, et L. 2315-52 réserve des priorités que ce texte énonce et");
      L.push("  que la commission devra reprendre.]");
      L.push("");
      L.push("MOYENS — la commission peut s'adjoindre, AVEC L'ACCORD DE L'EMPLOYEUR et à");
      L.push("titre consultatif, un ou plusieurs conseillers délégués par des organisations");
      L.push("professionnelles, juridiques ou techniques (L. 2315-53).");
      L.push("");
      L.push("  Conseillers dont l'adjonction est demandée : [ ] — accord de l'employeur");
      L.push("  demandé le [DATE], obtenu le [DATE].");
      L.push("");
      L.push("COMPOSITION — [nombre] membres : [noms ou matricules]. Le nombre maximum de");
      L.push("membres de cette commission et les conditions de rémunération éventuelle des");
      L.push("conseillers sont fixés par décret (L. 2315-55) ; les conditions dans lesquelles");
      L.push("la commission est constituée le sont par décret en Conseil d'État (L. 2315-54).");
      L.push("L'application n'a pas lu ces décrets : vérifiez-les avant d'arrêter le nombre.");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("RÉSOLUTION N° 3 — COMMISSION DE L'ÉGALITÉ PROFESSIONNELLE");
      L.push("");
      L.push("Le comité, aux mêmes constatations, CRÉE en son sein une commission de");
      L.push("l'égalité professionnelle (L. 2315-56).");
      L.push("");
      L.push("ATTRIBUTIONS — elle est notamment chargée de préparer les délibérations du");
      L.push("comité prévues au 3° de l'article L. 2312-17 — LA POLITIQUE SOCIALE DE");
      L.push("L'ENTREPRISE, LES CONDITIONS DE TRAVAIL ET L'EMPLOI — dans les domaines qui");
      L.push("relèvent de sa compétence (L. 2315-56).");
      L.push("");
      L.push("COMPOSITION — [nombre] membres : [noms ou matricules].");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention.");
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("CE QUI VAUT POUR LES TROIS");
      L.push("");
      L.push("  · LES RAPPORTS DES COMMISSIONS SONT SOUMIS À LA DÉLIBÉRATION DU COMITÉ");
      L.push("    (L. 2315-45, dernière phrase). Une commission qui travaille sans que son");
      L.push("    rapport revienne devant le comité n'a rien préparé du tout.");
      L.push("  · Les experts et techniciens éventuellement adjoints avec voix consultative");
      L.push("    sont tenus au secret professionnel pour les questions relatives aux");
      L.push("    procédés de fabrication et à une obligation de discrétion à l'égard des");
      L.push("    informations confidentielles présentées comme telles par l'employeur");
      L.push("    (L. 2315-45 renvoyant à L. 2315-3).");
      L.push("  · Les délibérations du comité sont consignées dans un procès-verbal établi");
      L.push("    par le secrétaire du comité (L. 2315-34).");
      L.push("");

      titre(L, "4 — Le procès-verbal de la délibération");
      L.push("PROCÈS-VERBAL — extrait");
      L.push("");
      L.push("Comité social et économique de " + nom(ctx));
      L.push("Réunion du [DATE] · lieu : [ ]");
      L.push("Président : " + cro(((ctx.profil) || {}).responsable, "l'employeur ou son représentant"));
      L.push("Secrétaire : [nom du secrétaire du comité]");
      L.push("Membres présents : [liste nominative — c'est elle qui établit la majorité des");
      L.push("membres présents exigée par L. 2315-32]");
      L.push("Membres absents : [liste]");
      L.push("");
      L.push("Point [n°] — Constitution des commissions prévues aux articles L. 2315-49,");
      L.push("L. 2315-50 et L. 2315-56.");
      L.push("");
      L.push("Le président rappelle qu'aucun accord prévu à l'article L. 2315-45 n'organise");
      L.push("les commissions du comité et que l'effectif de l'entreprise est de " +
        (eff == null ? "[EFFECTIF]" : eff) + " salariés,");
      L.push("le seuil de trois cents salariés étant réputé franchi lorsqu'il est dépassé");
      L.push("pendant douze mois consécutifs (L. 2312-34).");
      L.push("");
      L.push("Les trois résolutions sont successivement mises aux voix. Le président ne");
      L.push("prend pas part au vote (L. 2315-32).");
      L.push("");
      L.push("  Résolution n° 1 — commission de la formation ......... adoptée / rejetée");
      L.push("    [ ] pour · [ ] contre · [ ] abstention");
      L.push("  Résolution n° 2 — commission logement ................ adoptée / rejetée");
      L.push("    [ ] pour · [ ] contre · [ ] abstention");
      L.push("  Résolution n° 3 — commission égalité professionnelle . adoptée / rejetée");
      L.push("    [ ] pour · [ ] contre · [ ] abstention");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");
      L.push("Le procès-verbal, après avoir été adopté, peut être affiché ou diffusé dans");
      L.push("l'entreprise par le secrétaire du comité, selon des modalités précisées par le");
      L.push("règlement intérieur du comité (L. 2315-35).");
      L.push("");

      titre(L, "5 — La note d'organisation des réunions des commissions");
      L.push("Cette note n'est imposée par aucun texte lu : elle sert à ce que les trois");
      L.push("commissions produisent effectivement les rapports que L. 2315-45 fait remonter");
      L.push("au comité. Tout y est donc entre crochets, sauf ce qui vient de la loi.");
      L.push("");
      L.push("  a) CE QUE LA LOI IMPOSE");
      L.push("     · les rapports des commissions sont soumis à la délibération du comité");
      L.push("       (L. 2315-45) ;");
      L.push("     · la commission de la formation est consultée sur les problèmes généraux");
      L.push("       de mise en œuvre de la formation professionnelle continue et de la");
      L.push("       validation des acquis de l'expérience (R. 2315-30), et informée des");
      L.push("       congés accordés et de leurs résultats (R. 2315-31) ;");
      L.push("     · les commissions de la formation et de l'égalité professionnelle");
      L.push("       préparent des délibérations de L. 2312-17 : leurs travaux doivent donc");
      L.push("       être disponibles AVANT la consultation qu'elles préparent.");
      L.push("");
      L.push("  b) CE QUE VOUS FIXEZ");
      L.push("     · calendrier : commission de la formation [nombre] réunions par an, aux");
      L.push("       environs de [périodes] ; logement [nombre] ; égalité professionnelle");
      L.push("       [nombre] ;");
      L.push("     · convocation : par [qui], [délai] avant la réunion, avec l'ordre du jour");
      L.push("       et les pièces ;");
      L.push("     · compte rendu : établi par [qui], dans [délai], transmis au secrétaire du");
      L.push("       comité pour inscription du rapport à l'ordre du jour ;");
      L.push("     · temps consacré aux réunions des commissions : [préciser le régime");
      L.push("       retenu dans l'entreprise et sa source — accord, usage, règlement");
      L.push("       intérieur du comité. L'application ne tranche pas ce point ici : il");
      L.push("       relève des moyens du comité, traités par les documents CSE-CTL-MOY de");
      L.push("       ce module.]");
      L.push("");
      L.push("  c) L'ARTICULATION AVEC LES CONSULTATIONS RÉCURRENTES");
      L.push("     Les délibérations préparées par les commissions sont celles des 1° et 3°");
      L.push("     de L. 2312-17. Placez chaque réunion de commission à une date qui laisse");
      L.push("     au comité le temps d'examiner le rapport avant de rendre son avis.");
      L.push("     Rapprochez ce calendrier de celui de vos consultations récurrentes.");
      L.push("");

      courrier(L, 1, "inscription du point à l'ordre du jour", [
        "L'ordre du jour de chaque réunion du comité est établi par LE PRÉSIDENT ET LE",
        "SECRÉTAIRE (L. 2315-29). L'employeur ne l'arrête donc pas seul : ce courrier est",
        "la demande conjointe qui met le point à l'ordre du jour.",
      ]);
      papier(L, ctx, ["À l'attention du secrétaire", "du comité social et économique"]);
      L.push("Objet : inscription à l'ordre du jour de la constitution des commissions");
      L.push("prévues aux articles L. 2315-49, L. 2315-50 et L. 2315-56");
      L.push("");
      L.push("Monsieur le Secrétaire, [ou Madame la Secrétaire]");
      L.push("");
      L.push("En l'absence d'accord d'entreprise prévu à l'article L. 2315-45 du code du");
      L.push("travail, les articles L. 2315-49, L. 2315-50 et L. 2315-56 imposent, dans les");
      L.push("entreprises d'au moins trois cents salariés, la constitution d'une commission");
      L.push("de la formation, d'une commission d'information et d'aide au logement et d'une");
      L.push("commission de l'égalité professionnelle.");
      L.push("");
      L.push("Je vous propose d'inscrire ce point à l'ordre du jour de la réunion du");
      L.push("[DATE DE LA RÉUNION], et vous adresse ci-joint les projets de résolution ainsi");
      L.push("que la note d'organisation des travaux de ces commissions.");
      L.push("");
      L.push("Ces commissions préparent des délibérations du comité prévues à l'article");
      L.push("L. 2312-17 ; leurs rapports seront soumis à la délibération du comité");
      L.push("conformément à l'article L. 2315-45.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Monsieur le Secrétaire, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : trois projets de résolution · note d'organisation des");
      L.push("réunions des commissions.");
      L.push("");

      courrier(L, 2, "transmission aux membres désignés", [
        "À adresser APRÈS l'adoption des résolutions, à chaque membre désigné.",
      ]);
      papier(L, ctx, ["À l'attention de [nom du membre désigné]",
                      "Membre de la commission [formation / logement / égalité professionnelle]"]);
      L.push("Objet : votre désignation au sein de la commission [ ] du comité social et");
      L.push("économique");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Le comité social et économique vous a désigné, par une résolution adoptée le");
      L.push("[DATE], membre de la commission [ ] constituée en application de l'article");
      L.push("[L. 2315-49 / L. 2315-50 / L. 2315-56] du code du travail.");
      L.push("");
      L.push("Vous trouverez ci-joint l'extrait du procès-verbal portant cette résolution,");
      L.push("qui énonce les attributions de la commission, ainsi que la note d'organisation");
      L.push("de ses réunions. Les rapports de la commission sont soumis à la délibération");
      L.push("du comité (L. 2315-45).");
      L.push("");
      salutation(L, ctx);
      L.push("Pièces jointes : extrait du procès-verbal · note d'organisation.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous cherchez l'accord de L. 2315-45. C'est le seul",
        "acte qui ne peut pas attendre : tout le reste en dépend. S'il existe, ce document",
        "n'a plus d'objet que pour les commissions qu'il ne couvre pas.",
        "",
        "Dans la foulée — vous adressez au secrétaire le courrier 1 pour que le point soit",
        "inscrit à l'ordre du jour, l'ordre du jour étant établi conjointement par le",
        "président et le secrétaire (L. 2315-29). Envoyé aujourd'hui, il permet une",
        "inscription à la réunion suivante.",
        "",
        "À la réunion — les trois résolutions sont mises aux voix, à la majorité des",
        "membres présents, le président ne votant pas (L. 2315-32). Une seule réunion",
        "suffit pour les trois : ne les étalez pas.",
        "",
        "Dans les jours qui suivent — le secrétaire établit le procès-verbal (L. 2315-34)",
        "et vous adressez le courrier 2 à chaque membre désigné.",
        "",
        "Au plus tard le " + leJour(dans(d0, 90)) + ", soit trois mois — la première réunion de chaque",
        "commission devrait s'être tenue. Ce délai n'est imposé par aucun texte lu : il",
        "est celui qui laisse aux rapports le temps de remonter au comité avant la",
        "prochaine consultation récurrente. Si votre calendrier de consultation est plus",
        "serré, avancez-le d'autant.",
        "",
        "À chaque clôture d'exercice — reprenez le paragraphe 2. Le seuil de trois cents",
        "salariés se franchit sur douze mois consécutifs, et se reperd de la même façon.",
      ]);

      return pied(L,
        ["L. 2232-12", "L. 2312-17", "L. 2312-34", "L. 2315-3", "L. 2315-29",
         "L. 2315-32", "L. 2315-34", "L. 2315-35", "L. 2315-45", "L. 2315-49",
         "L. 2315-50", "L. 2315-51", "L. 2315-52", "L. 2315-53", "L. 2315-54",
         "L. 2315-55", "L. 2315-56", "R. 2315-30", "R. 2315-31"],
        ["les décrets pris pour l'application de L. 2315-54 et L. 2315-55 (constitution de la commission logement, nombre maximum de membres, rémunération des conseillers)"]);
    },
  });

  DP.ajouter("CSE-CTL-COM-02", {
    nom: "La commission économique : la résolution de création, la désignation de ses membres et la note d'organisation de ses deux réunions",
    detail: "Le constat de l'absence d'accord, le seuil de mille salariés, la résolution " +
            "créant la commission et désignant au plus cinq membres dont au moins un cadre, " +
            "le procès-verbal, la note sur ses moyens d'instruction et son rôle dans le " +
            "droit d'alerte économique, et le courrier au secrétaire.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var accord = oui(f.accordCommissions);
      var existe = oui(f.commissionEconomique);
      var membres = liste(f.membresCommissionEconomique);
      var cadres = membres.filter(function (m) {
        var s = JSON.stringify(m == null ? "" : m).toLowerCase();
        return s.indexOf("cadre") >= 0;
      }).length;
      var L = [];

      L = L.concat(entete(ctx, "Création de la commission économique et désignation de ses membres",
        "articles L. 2315-45, L. 2315-46, L. 2315-47 et L. 2315-48 du code du travail"));
      usage(L);

      L.push("CE QUE CE DOCUMENT PRODUIT");
      L.push("");
      L.push("  1. le constat préalable — accord de L. 2315-45, seuil de mille salariés,");
      L.push("     niveau de création ;");
      L.push("  2. la RÉSOLUTION créant la commission et désignant ses membres ;");
      L.push("  3. le PROCÈS-VERBAL de la délibération ;");
      L.push("  4. la NOTE D'ORGANISATION de ses réunions et de ses moyens d'instruction ;");
      L.push("  5. le COURRIER au secrétaire du comité et le courrier de demande d'audition");
      L.push("     d'un cadre supérieur ou dirigeant.");
      L.push("");
      L.push("La commission économique n'est pas une commission d'étude parmi d'autres.");
      L.push("Dans les entreprises d'au moins mille salariés et en l'absence d'accord prévu");
      L.push("à l'article L. 2315-45, c'est ELLE qui établit le rapport du DROIT D'ALERTE");
      L.push("ÉCONOMIQUE lorsque le comité n'a pu obtenir de réponse suffisante de");
      L.push("l'employeur ou que cette réponse confirme le caractère préoccupant de la");
      L.push("situation (L. 2312-63). Son absence ôte au comité l'organe que la loi charge");
      L.push("d'écrire ce rapport.");
      L.push("");

      titre(L, "1 — Le constat préalable");
      ordreCommissions(L);
      L.push("  Un accord de L. 2315-45 organise-t-il les commissions ? .... " +
        ouiNon(f.accordCommissions, "oui / non"));
      L.push("  Une commission économique est-elle déjà créée ? ............ " +
        ouiNon(f.commissionEconomique, "oui / non"));
      ligneSeuil(L, eff, 1000, "la commission économique est due, à défaut d'accord.");
      L.push("");
      if (accord === true) {
        L.push("  UN ACCORD EST DÉCLARÉ : L. 2315-46 ne joue pas, puisqu'il ne s'applique");
        L.push("  qu'« en l'absence d'accord prévu à l'article L. 2315-45 ». Vérifiez");
        L.push("  seulement que l'accord traite bien de l'examen des documents économiques");
        L.push("  et financiers, et qu'il désigne l'organe chargé du rapport de L. 2312-63.");
        L.push("");
      }
      if (existe === true && membres.length) {
        L.push("  Membres déclarés : " + membres.length + " — dont " + cadres +
          " identifié(s) comme représentant la catégorie des cadres.");
        if (membres.length > 5) {
          L.push("  ATTENTION : L. 2315-47 fixe un MAXIMUM DE CINQ membres représentants du");
          L.push("  personnel. Au-delà, la composition n'est pas celle que le texte prévoit ;");
          L.push("  la résolution ci-dessous vaut alors résolution rectificative.");
        }
        if (cadres === 0) {
          L.push("  ATTENTION : aucun membre n'est identifié comme représentant la catégorie");
          L.push("  des cadres, alors que L. 2315-47 en impose AU MOINS UN. Vérifiez la");
          L.push("  résolution de désignation : si elle ne le mentionne pas, désignez-le.");
        }
        L.push("");
      }
      L.push("  NIVEAU DE CRÉATION — la commission est créée « au sein du comité social et");
      L.push("  économique OU du comité social et économique central » (L. 2315-46). Le");
      L.push("  texte laisse ce choix ouvert et ne le tranche pas.");
      L.push("");
      L.push("     Niveau retenu : [comité social et économique / comité social et");
      L.push("     économique central] — motif : [ ].");
      L.push("");
      L.push("     Si l'entreprise comporte plusieurs comités d'établissement, c'est le");
      L.push("     comité central qui examine les questions excédant les pouvoirs des chefs");
      L.push("     d'établissement : le niveau de la commission suit ce choix.");
      L.push("");

      titre(L, "2 — La résolution de création et de désignation");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE [CENTRAL]");
      L.push("");
      L.push("Réunion du [DATE] · point [n°] de l'ordre du jour");
      L.push("");
      L.push("RÉSOLUTION — CRÉATION DE LA COMMISSION ÉCONOMIQUE");
      L.push("");
      L.push("Le comité social et économique [central] de " + nom(ctx) + ", constatant");
      L.push("qu'aucun accord prévu à l'article L. 2315-45 du code du travail n'organise ses");
      L.push("commissions et que l'entreprise emploie au moins mille salariés :");
      L.push("");
      L.push("  1. CRÉE en son sein une commission économique, en application de l'article");
      L.push("     L. 2315-46 ;");
      L.push("  2. DÉSIGNE, parmi ses membres, les représentants du personnel suivants :");
      L.push("");
      L.push("        1. [nom ou matricule] · collège [ ] · catégorie [ ]");
      L.push("        2. [nom ou matricule] · collège [ ] · catégorie [ ]");
      L.push("        3. [nom ou matricule] · collège [ ] · catégorie [ ]");
      L.push("        4. [nom ou matricule] · collège [ ] · catégorie [ ]");
      L.push("        5. [nom ou matricule] · collège [ ] · catégorie [ ]");
      L.push("");
      L.push("     dont [nom] REPRÉSENTANT LA CATÉGORIE DES CADRES.");
      L.push("");
      L.push("  3. PREND ACTE que la commission est présidée par l'employeur ou son");
      L.push("     représentant (L. 2315-47).");
      L.push("");
      L.push("LES TROIS RÈGLES DE COMPOSITION, telles que L. 2315-47 les pose :");
      L.push("");
      L.push("  · CINQ MEMBRES AU MAXIMUM représentants du personnel — c'est un plafond, pas");
      L.push("    un nombre imposé : le comité peut en désigner moins ;");
      L.push("  · AU MOINS UN REPRÉSENTANT DE LA CATÉGORIE DES CADRES — cette mention doit");
      L.push("    figurer dans la résolution elle-même, faute de quoi rien n'établit qu'elle");
      L.push("    a été respectée ;");
      L.push("  · DÉSIGNÉS PAR LE COMITÉ PARMI SES MEMBRES — la commission économique ne");
      L.push("    s'ouvre pas à des salariés extérieurs au comité.");
      L.push("");
      L.push("La résolution est adoptée à la majorité des membres présents, le président ne");
      L.push("prenant pas part au vote lorsqu'il consulte les membres élus en tant que");
      L.push("délégation du personnel (L. 2315-32).");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention.");
      L.push("");

      titre(L, "3 — Le procès-verbal de la délibération");
      L.push("PROCÈS-VERBAL — extrait");
      L.push("");
      L.push("Comité social et économique [central] de " + nom(ctx));
      L.push("Réunion du [DATE]");
      L.push("Président : " + cro(((ctx.profil) || {}).responsable, "l'employeur ou son représentant"));
      L.push("Secrétaire : [nom]");
      L.push("Membres présents : [liste nominative]");
      L.push("");
      L.push("Point [n°] — Création de la commission économique (L. 2315-46) et désignation");
      L.push("de ses membres (L. 2315-47).");
      L.push("");
      L.push("Le président rappelle qu'aucun accord de L. 2315-45 n'organise les commissions");
      L.push("du comité et que l'effectif de l'entreprise est de " +
        (eff == null ? "[EFFECTIF]" : eff) + " salariés.");
      L.push("");
      L.push("La résolution est mise aux voix. Adoptée par [ ] voix pour, [ ] contre,");
      L.push("[ ] abstention, le président n'ayant pas pris part au vote (L. 2315-32).");
      L.push("");
      L.push("Sont désignés membres de la commission économique : [liste nominative des");
      L.push("membres désignés, avec l'indication de celui qui représente la catégorie des");
      L.push("cadres].");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");

      titre(L, "4 — La note d'organisation des réunions et des moyens d'instruction");
      L.push("  a) CE QUE LA LOI IMPOSE (L. 2315-46 et L. 2315-48)");
      L.push("");
      L.push("     · LA COMMISSION SE RÉUNIT AU MOINS DEUX FOIS PAR AN. C'est un plancher :");
      L.push("       deux réunions tenues dans le même trimestre y satisfont littéralement");
      L.push("       mais vident l'obligation de son objet.");
      L.push("     · Elle est CHARGÉE NOTAMMENT d'étudier les documents économiques et");
      L.push("       financiers recueillis par le comité et toute question que ce dernier lui");
      L.push("       soumet (L. 2315-46). L'adverbe « notamment » signifie que le comité peut");
      L.push("       lui confier davantage, non qu'elle puisse se saisir seule.");
      L.push("     · Elle PEUT DEMANDER À ENTENDRE tout cadre supérieur ou dirigeant de");
      L.push("       l'entreprise APRÈS ACCORD DE L'EMPLOYEUR (L. 2315-48). L'accord de");
      L.push("       l'employeur est une condition du texte : demandez-le par écrit, et");
      L.push("       conservez la réponse.");
      L.push("     · Elle PEUT SE FAIRE ASSISTER par l'expert-comptable qui assiste le comité");
      L.push("       et par les experts choisis par le comité dans les conditions fixées à la");
      L.push("       sous-section 10 (L. 2315-48). Elle ne désigne donc pas d'expert de son");
      L.push("       propre chef : elle s'adjoint celui du comité.");
      L.push("     · Elle est PRÉSIDÉE PAR L'EMPLOYEUR OU SON REPRÉSENTANT (L. 2315-47).");
      L.push("");
      L.push("  b) SON RÔLE DANS LE DROIT D'ALERTE ÉCONOMIQUE (L. 2312-63)");
      L.push("");
      L.push("     Lorsque le comité a connaissance de faits de nature à affecter de manière");
      L.push("     préoccupante la situation économique de l'entreprise, il peut demander à");
      L.push("     l'employeur de lui fournir des explications ; la demande est inscrite DE");
      L.push("     DROIT à l'ordre du jour de la prochaine séance. Si le comité n'a pu");
      L.push("     obtenir de réponse suffisante, ou si celle-ci confirme le caractère");
      L.push("     préoccupant de la situation, IL ÉTABLIT UN RAPPORT — et « dans les");
      L.push("     entreprises employant au moins mille salariés et en l'absence d'accord");
      L.push("     prévu à l'article L. 2315-45, CE RAPPORT EST ÉTABLI PAR LA COMMISSION");
      L.push("     ÉCONOMIQUE prévue par l'article L. 2315-46 ». Ce rapport est transmis à");
      L.push("     l'employeur et au commissaire aux comptes (L. 2312-63).");
      L.push("");
      L.push("  c) SON RÔLE EN CAS DE CONCENTRATION (L. 2312-41)");
      L.push("");
      L.push("     Lorsque l'entreprise est partie à une opération de concentration,");
      L.push("     l'employeur réunit le comité au plus tard dans les trois jours de la");
      L.push("     publication du communiqué relatif à la notification du projet. Au cours de");
      L.push("     cette réunion, LE COMITÉ OU, LE CAS ÉCHÉANT, LA COMMISSION ÉCONOMIQUE PEUT");
      L.push("     PROPOSER le recours à un expert-comptable dans les conditions des articles");
      L.push("     L. 2315-92 et L. 2315-93. Une deuxième réunion se tient alors pour");
      L.push("     entendre les résultats des travaux de l'expert (L. 2312-41).");
      L.push("");
      L.push("  d) CE QUE VOUS FIXEZ");
      L.push("");
      L.push("     · dates des deux réunions au moins : [ ] et [ ] — de préférence l'une");
      L.push("       avant la consultation sur la situation économique et financière, l'autre");
      L.push("       après la clôture ;");
      L.push("     · convocation par [qui], [délai] à l'avance, avec les documents");
      L.push("       économiques et financiers recueillis par le comité ;");
      L.push("     · rapporteur : [nom] · compte rendu remis au secrétaire du comité dans");
      L.push("       [délai] pour être soumis à la délibération du comité (L. 2315-45).");
      L.push("");

      courrier(L, 1, "inscription du point à l'ordre du jour", [
        "L'ordre du jour est établi par le président ET le secrétaire (L. 2315-29).",
      ]);
      papier(L, ctx, ["À l'attention du secrétaire",
                      "du comité social et économique [central]"]);
      L.push("Objet : inscription à l'ordre du jour de la création de la commission");
      L.push("économique (L. 2315-46)");
      L.push("");
      L.push("Monsieur le Secrétaire, [ou Madame la Secrétaire]");
      L.push("");
      L.push("En l'absence d'accord d'entreprise prévu à l'article L. 2315-45 du code du");
      L.push("travail, l'article L. 2315-46 impose, dans les entreprises d'au moins mille");
      L.push("salariés, la création d'une commission économique au sein du comité social et");
      L.push("économique ou du comité social et économique central.");
      L.push("");
      L.push("Je vous propose d'inscrire ce point à l'ordre du jour de la réunion du [DATE]");
      L.push("et vous adresse le projet de résolution. Il appartient au comité de désigner");
      L.push("les membres de la commission parmi les siens — cinq au maximum, dont au moins");
      L.push("un représentant de la catégorie des cadres (L. 2315-47).");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Monsieur le Secrétaire, l'expression de ma considération distinguée.");
      L.push("Pièce jointe : projet de résolution.");
      L.push("");

      courrier(L, 2, "demande d'audition d'un cadre supérieur ou dirigeant", [
        "L'audition suppose l'ACCORD DE L'EMPLOYEUR (L. 2315-48) : ce courrier est celui",
        "par lequel la commission le demande, et la réponse doit être écrite.",
      ]);
      L.push("Commission économique du comité social et économique [central]");
      L.push("de " + nom(ctx));
      L.push("");
      L.push("À l'attention de " + cro(((ctx.profil) || {}).responsable, "l'employeur"));
      L.push("Président de la commission économique");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : demande d'audition au titre de l'article L. 2315-48");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("La commission économique, réunie le [DATE], a décidé de demander à entendre");
      L.push("[nom et fonction du cadre supérieur ou dirigeant], sur [objet précis de");
      L.push("l'audition].");
      L.push("");
      L.push("L'article L. 2315-48 du code du travail permet à la commission de demander à");
      L.push("entendre tout cadre supérieur ou dirigeant de l'entreprise APRÈS ACCORD DE");
      L.push("L'EMPLOYEUR. Je vous saurais gré de bien vouloir me faire connaître votre");
      L.push("réponse par écrit avant le [DATE], la commission devant se réunir le [DATE].");
      L.push("");
      L.push("Le rapporteur de la commission,");
      L.push("[nom]");
      L.push("");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous cherchez l'accord de L. 2315-45 et vous établissez",
        "l'effectif. Sans ces deux constats, la résolution est prématurée.",
        "",
        "Dans la foulée — courrier 1 au secrétaire, pour l'inscription à l'ordre du jour",
        "(L. 2315-29).",
        "",
        "À la réunion suivante — la résolution est mise aux voix : création, puis",
        "désignation de cinq membres au plus dont au moins un cadre (L. 2315-47),",
        "à la majorité des membres présents (L. 2315-32).",
        "",
        "Puis DEUX RÉUNIONS AU MOINS DANS L'ANNÉE (L. 2315-48). Si la première se tenait",
        "le " + leJour(dans(d0, 30)) + ", la seconde devrait être fixée avant le " + leJour(dans(d0, 365)) + " pour que",
        "l'année civile en porte deux. Inscrivez les deux dates dès la réunion de",
        "constitution : c'est la seule façon de ne pas les perdre.",
        "",
        "Le jour où la situation économique devient préoccupante — la commission devient",
        "l'auteur du rapport d'alerte (L. 2312-63). Ce n'est pas le moment de la créer.",
      ]);

      return pied(L,
        ["L. 2312-41", "L. 2312-63", "L. 2315-29", "L. 2315-32", "L. 2315-34",
         "L. 2315-45", "L. 2315-46", "L. 2315-47", "L. 2315-48", "L. 2315-92",
         "L. 2315-93"]);
    },
  });

  DP.ajouter("CSE-CTL-COM-03", {
    nom: "La commission des marchés : le test des trois seuils sur les comptes du comité et la résolution de création",
    detail: "Le tableau de test des trois critères de D. 2315-29 exercice par exercice, " +
            "la résolution du comité créant la commission des marchés, le procès-verbal, " +
            "et le rappel du recontrôle à chaque clôture.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var franchis = oui(f.seuilsComptesComite);
      var creee = oui(f.commissionMarches);
      var L = [];

      L = L.concat(entete(ctx, "Commission des marchés du comité : test des seuils et résolution de création",
        "articles L. 2315-44-1 et D. 2315-29 du code du travail"));
      usage(L);

      L.push("LE PIÈGE DE CE POINT, ET IL EST CONSTANT");
      L.push("");
      L.push("La commission des marchés NE DÉPEND PAS DE L'EFFECTIF DE L'ENTREPRISE. Elle");
      L.push("dépend des COMPTES DU COMITÉ. Une entreprise de deux mille salariés dont le");
      L.push("comité a de petits comptes n'en doit aucune ; un comité doté d'un budget");
      L.push("d'activités sociales important dans une entreprise plus modeste peut en devoir");
      L.push("une. Le critère du « nombre de cinquante salariés » que D. 2315-29 retient est");
      L.push("celui DU COMITÉ à la clôture d'un exercice, et non celui de l'entreprise.");
      L.push("");
      if (eff != null) {
        L.push("L'effectif de l'entreprise — " + eff + " salariés — est donc SANS INCIDENCE ici. Il");
        L.push("n'est rappelé que pour qu'on ne le confonde pas avec le premier critère.");
        L.push("");
      }

      titre(L, "1 — Le texte, et ce que l'application n'a pas lu");
      L.push("« Une commission des marchés est créée au sein du comité social et économique");
      L.push("qui dépasse, POUR AU MOINS DEUX DES TROIS CRITÈRES mentionnés au II de");
      L.push("l'article L. 2315-64, des seuils fixés par décret » (L. 2315-44-1).");
      L.push("");
      L.push("Le II de L. 2315-64 nomme ces trois critères : LE NOMBRE DE SALARIÉS, LES");
      L.push("RESSOURCES ANNUELLES et LE TOTAL DU BILAN du comité, appréciés à la clôture");
      L.push("d'un exercice.");
      L.push("");
      L.push("Le décret est D. 2315-29 : « Une commission des marchés est créée au sein du");
      L.push("comité social et économique qui dépasse, pour au moins deux des trois critères,");
      L.push("les seuils suivants : 1° Le nombre de cinquante salariés à la clôture d'un");
      L.push("exercice ; 2° Le montant prévu au 2° de l'article R. 612-1 du code de commerce");
      L.push("de ressources annuelles définies à l'article D. 2315-34 ; 3° Le montant du");
      L.push("total du bilan prévu au 3° de l'article R. 612-1 du code de commerce. Le seuil");
      L.push("mentionné à l'article L. 2315-44-2 est fixé à 30 000 euros. »");
      L.push("");
      L.push("CE QUE L'APPLICATION NE PEUT PAS ÉCRIRE ICI, ET NE L'ÉCRIRA PAS :");
      L.push("");
      L.push("  · le MONTANT DE RESSOURCES ANNUELLES du 2° et le MONTANT DU TOTAL DU BILAN");
      L.push("    du 3° sont fixés par l'article R. 612-1 DU CODE DE COMMERCE. Ce texte");
      L.push("    n'appartient pas au code du travail et le relais de l'application ne le");
      L.push("    sert pas : il est NOMMÉ ici, et vous devez l'aller lire vous-même. Aucun");
      L.push("    chiffre n'est reproduit de mémoire ;");
      L.push("  · la DÉFINITION DES RESSOURCES ANNUELLES du comité est à l'article");
      L.push("    D. 2315-34, que l'application n'a pas lu davantage. Ce point n'est pas");
      L.push("    accessoire : il commande ce qu'on additionne pour le critère 2°.");
      L.push("");
      L.push("Votre expert-comptable ou le commissaire aux comptes du comité, s'il en a un,");
      L.push("porte ces deux montants. Demandez-les-lui par écrit et joignez la réponse au");
      L.push("présent test : c'est elle qui datera la vérification.");
      L.push("");

      titre(L, "2 — Le test, critère par critère");
      L.push("À remplir sur LES COMPTES ANNUELS DU COMITÉ arrêtés à la clôture du dernier");
      L.push("exercice, et non sur une estimation.");
      L.push("");
      L.push("  Exercice clos le ......................................... [DATE DE CLÔTURE]");
      L.push("  Pièce : comptes annuels du comité, ou documents de L. 2315-65 . [référence]");
      L.push("");
      L.push("  ┌────┬──────────────────────────────┬───────────────┬───────────────┬───────┐");
      L.push("  │ N° │ Critère (D. 2315-29)         │ Valeur du     │ Seuil         │ Dép.  │");
      L.push("  │    │                              │ comité        │ applicable    │ ?     │");
      L.push("  ├────┼──────────────────────────────┼───────────────┼───────────────┼───────┤");
      L.push("  │ 1° │ Nombre de salariés DU COMITÉ │ [        ]    │ 50            │ [O/N] │");
      L.push("  │    │ à la clôture de l'exercice   │               │ (D. 2315-29)  │       │");
      L.push("  ├────┼──────────────────────────────┼───────────────┼───────────────┼───────┤");
      L.push("  │ 2° │ Ressources annuelles         │ [        ] €  │ [montant du   │ [O/N] │");
      L.push("  │    │ (définies à D. 2315-34,      │               │ 2° de R.612-1 │       │");
      L.push("  │    │ NON LU par l'application)    │               │ c. com. — À   │       │");
      L.push("  │    │                              │               │ RELEVER]      │       │");
      L.push("  ├────┼──────────────────────────────┼───────────────┼───────────────┼───────┤");
      L.push("  │ 3° │ Total du bilan du comité     │ [        ] €  │ [montant du   │ [O/N] │");
      L.push("  │    │                              │               │ 3° de R.612-1 │       │");
      L.push("  │    │                              │               │ c. com. — À   │       │");
      L.push("  │    │                              │               │ RELEVER]      │       │");
      L.push("  └────┴──────────────────────────────┴───────────────┴───────────────┴───────┘");
      L.push("");
      L.push("  NOMBRE DE CRITÈRES DÉPASSÉS : [ ] sur 3.");
      L.push("");
      L.push("  RÈGLE DE DÉCISION — deux critères dépassés sur trois suffisent, et il en faut");
      L.push("  deux : un seul critère dépassé, même très largement, ne déclenche rien.");
      L.push("");
      L.push("  CONCLUSION : la commission des marchés est [DUE / NON DUE] au titre de");
      L.push("  l'exercice clos le [DATE].");
      L.push("");
      if (franchis === true) {
        L.push("  LE DOSSIER DÉCLARE QUE DEUX SEUILS AU MOINS SONT DÉPASSÉS. La résolution du");
        L.push("  paragraphe 3 est donc à adopter" +
          (creee === true ? ", si ce n'est déjà fait — le dossier déclare par ailleurs la commission créée : vérifiez alors la date de la résolution."
                          : ", et le dossier ne déclare aucune commission créée."));
        L.push("");
      } else if (franchis === false) {
        L.push("  LE DOSSIER DÉCLARE QUE LES SEUILS NE SONT PAS DÉPASSÉS. Remplissez tout de");
        L.push("  même le tableau : c'est lui, et non la déclaration, qui établira le constat");
        L.push("  le jour où il sera discuté. Le test se refait à chaque clôture.");
        L.push("");
      } else {
        L.push("  LE DOSSIER NE DIT PAS si les seuils sont dépassés. Le tableau ci-dessus est");
        L.push("  donc l'acte à accomplir en premier : sans lui, ni la création ni l'absence");
        L.push("  de création ne peuvent être justifiées.");
        L.push("");
      }
      L.push("  UNE PRÉCISION QUE PORTE LE MÊME DÉCRET — D. 2315-29 fixe à 30 000 euros le");
      L.push("  seuil mentionné à l'article L. 2315-44-2. L'application n'a pas lu");
      L.push("  L. 2315-44-2 et ne dit donc pas à quoi ce seuil s'applique : reportez-vous-y");
      L.push("  avant de conclure sur les obligations qui s'y attachent.");
      L.push("");

      titre(L, "3 — La résolution créant la commission des marchés");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Réunion du [DATE] · point [n°] de l'ordre du jour");
      L.push("");
      L.push("RÉSOLUTION — CRÉATION DE LA COMMISSION DES MARCHÉS");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ",");
      L.push("");
      L.push("VU l'article L. 2315-44-1 du code du travail ;");
      L.push("VU l'article D. 2315-29 du même code ;");
      L.push("VU les comptes annuels du comité arrêtés au [DATE DE CLÔTURE] ;");
      L.push("");
      L.push("CONSTATANT que, à la clôture de cet exercice, [deux / trois] des trois critères");
      L.push("mentionnés au II de l'article L. 2315-64 dépassent les seuils fixés par");
      L.push("D. 2315-29, à savoir : [énumérer les critères dépassés et leurs valeurs, telles");
      L.push("qu'elles ressortent du tableau du paragraphe 2] ;");
      L.push("");
      L.push("CRÉE en son sein une COMMISSION DES MARCHÉS.");
      L.push("");
      L.push("  Membres désignés : [noms ou matricules].");
      L.push("  [La composition de cette commission n'est pas fixée par les textes que");
      L.push("  l'application a lus : c'est au comité de l'arrêter, et la résolution doit");
      L.push("  donc la porter.]");
      L.push("");
      L.push("  Modalités de fonctionnement : [à définir — les modalités de fonctionnement du");
      L.push("  comité et de ses rapports avec les salariés relèvent du règlement intérieur");
      L.push("  du comité (L. 2315-24). C'est là que la commission des marchés trouve");
      L.push("  naturellement sa place.]");
      L.push("");
      L.push("La résolution est adoptée à la majorité des membres présents, le président ne");
      L.push("prenant pas part au vote (L. 2315-32).");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention.");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");

      titre(L, "4 — Ce à quoi ce test se rattache");
      L.push("Le test des trois critères n'est pas un exercice isolé : il vient des");
      L.push("obligations comptables du comité, et il y retourne.");
      L.push("");
      L.push("  · « Le comité social et économique est soumis aux obligations comptables");
      L.push("    définies à l'article L. 123-12 du code de commerce. Ses comptes annuels");
      L.push("    sont établis selon les modalités définies par un règlement de l'Autorité");
      L.push("    des normes comptables » (L. 2315-64, I). L'article L. 123-12 du code de");
      L.push("    commerce est NOMMÉ : l'application ne l'a pas lu.");
      L.push("  · Le comité dont les ressources annuelles n'excèdent pas un seuil fixé par");
      L.push("    décret peut s'acquitter de ses obligations comptables en tenant un LIVRE");
      L.push("    retraçant chronologiquement les montants et l'origine des dépenses et des");
      L.push("    recettes, et en établissant une fois par an un ÉTAT DE SYNTHÈSE SIMPLIFIÉ");
      L.push("    portant sur son patrimoine et ses engagements en cours (L. 2315-65).");
      L.push("  · « Les comptes annuels ou les documents mentionnés à l'article L. 2315-65");
      L.push("    sont approuvés DANS UN DÉLAI DE SIX MOIS à compter de la clôture de");
      L.push("    l'exercice. Ce délai peut être prolongé à la demande du comité par");
      L.push("    ordonnance du président du tribunal judiciaire statuant sur requête »");
      L.push("    (R. 2315-37).");
      L.push("  · Le comité établit, selon des modalités prévues par son règlement intérieur,");
      L.push("    un RAPPORT présentant des informations qualitatives sur ses activités et sa");
      L.push("    gestion financière ; il est présenté aux membres élus lors de la réunion en");
      L.push("    séance plénière (L. 2315-69).");
      L.push("");
      L.push("C'est donc au moment de l'arrêté des comptes que le test se fait — pas à un");
      L.push("autre moment de l'année, et pas une fois pour toutes.");
      L.push("");

      courrier(L, 1, "demande des deux montants au professionnel des comptes du comité", [
        "Sans les seuils du 2° et du 3°, le test ne peut pas être achevé : ces deux",
        "montants viennent de R. 612-1 du code de commerce, que l'application n'a pas lu.",
      ]);
      papier(L, ctx, ["À l'attention de [expert-comptable / commissaire aux comptes]",
                      "du comité social et économique"]);
      L.push("Objet : montants applicables aux 2° et 3° de l'article D. 2315-29 du code du");
      L.push("travail");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("L'article L. 2315-44-1 du code du travail impose la création d'une commission");
      L.push("des marchés au sein du comité qui dépasse, pour au moins deux des trois");
      L.push("critères mentionnés au II de l'article L. 2315-64, des seuils fixés par");
      L.push("décret. L'article D. 2315-29 renvoie, pour deux de ces trois seuils, aux 2° et");
      L.push("3° de l'article R. 612-1 du code de commerce, et définit les ressources");
      L.push("annuelles par renvoi à l'article D. 2315-34.");
      L.push("");
      L.push("Je vous saurais gré de bien vouloir me confirmer par écrit, pour l'exercice");
      L.push("clos le [DATE] :");
      L.push("");
      L.push("  1. le montant de ressources annuelles applicable au 2° de D. 2315-29 ;");
      L.push("  2. le montant du total du bilan applicable au 3° ;");
      L.push("  3. les valeurs correspondantes dans les comptes du comité, ainsi que le");
      L.push("     nombre de salariés du comité à la clôture.");
      L.push("");
      L.push("Ces éléments conditionnent la création, ou l'absence de création, de la");
      L.push("commission des marchés au titre de cet exercice.");
      L.push("");
      salutation(L, ctx);

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous adressez le courrier 1 et vous ouvrez le tableau du",
        "paragraphe 2 sur les comptes du dernier exercice clos.",
        "",
        "Dès la réponse reçue — vous achevez le test. Trois lignes à remplir, et la",
        "conclusion s'impose d'elle-même : deux critères dépassés sur trois, la commission",
        "est due.",
        "",
        "Si elle est due — la résolution du paragraphe 3 se prend à la réunion suivante du",
        "comité, à la majorité des membres présents (L. 2315-32). Comptez le délai",
        "d'inscription à l'ordre du jour, établi conjointement par le président et le",
        "secrétaire (L. 2315-29).",
        "",
        "À CHAQUE CLÔTURE — le test se refait. Les comptes annuels sont approuvés dans les",
        "six mois de la clôture (R. 2315-37) : c'est la fenêtre naturelle. Si votre",
        "exercice se clôturait aujourd'hui, l'approbation devrait intervenir au plus tard",
        "le " + leJour(dans(d0, 182)) + ", et le test avec elle.",
        "",
        "L'obligation peut naître d'une année sur l'autre, et disparaître de même : c'est",
        "une commission qui suit les comptes, pas un état acquis.",
      ]);

      return pied(L,
        ["L. 2315-24", "L. 2315-29", "L. 2315-32", "L. 2315-44-1", "L. 2315-64",
         "L. 2315-65", "L. 2315-69", "D. 2315-29", "R. 2315-37"],
        ["R. 612-1 du code de commerce (montants des 2° et 3°)",
         "D. 2315-34 (définition des ressources annuelles du comité)",
         "L. 2315-44-2 (auquel D. 2315-29 rattache le seuil de 30 000 €)",
         "L. 123-12 du code de commerce (obligations comptables visées par L. 2315-64)"]);
    },
  });

  /* ────────────────────────────────────────────────────────────────────────
     LES DEUX BUDGETS
     ──────────────────────────────────────────────────────────────────────── */

  /* La définition de l'assiette est la même pour les deux budgets, et elle est
     écrite deux fois dans le code : à L. 2315-61 pour la subvention de
     fonctionnement, à L. 2312-83 pour la contribution aux activités sociales.
     Les deux textes sont identiques mot pour mot. On les cite ensemble, une
     fois, dans un bloc commun aux deux documents : c'est ce qui évite qu'une
     entreprise applique deux assiettes différentes à deux calculs qui n'en ont
     qu'une. */
  function assiette(L) {
    L.push("L'ASSIETTE — CE QUE LE TEXTE DIT, ET RIEN DE PLUS");
    L.push("");
    L.push("« La masse salariale brute est constituée par L'ENSEMBLE DES GAINS ET");
    L.push("RÉMUNÉRATIONS SOUMIS À COTISATIONS DE SÉCURITÉ SOCIALE en application des");
    L.push("dispositions de l'article L. 242-1 du code de la sécurité sociale ou de");
    L.push("l'article L. 741-10 du code rural et de la pêche maritime, À L'EXCEPTION DES");
    L.push("INDEMNITÉS VERSÉES À L'OCCASION DE LA RUPTURE DU CONTRAT DE TRAVAIL À DURÉE");
    L.push("INDÉTERMINÉE. »");
    L.push("");
    L.push("Cette définition figure deux fois, dans les mêmes termes : au dernier alinéa de");
    L.push("L. 2315-61 pour la subvention de fonctionnement, et à L. 2312-83 pour la");
    L.push("contribution aux activités sociales et culturelles. Une seule assiette, donc,");
    L.push("pour les deux budgets.");
    L.push("");
    L.push("  CE QUI ENTRE — tout ce qui est soumis à cotisations de sécurité sociale au");
    L.push("  sens de L. 242-1 du code de la sécurité sociale (ou de L. 741-10 du code");
    L.push("  rural et de la pêche maritime pour les employeurs qui en relèvent).");
    L.push("");
    L.push("  CE QUI SORT — les indemnités versées à l'occasion de la rupture du contrat de");
    L.push("  travail À DURÉE INDÉTERMINÉE. C'est la seule exclusion que le texte énonce,");
    L.push("  et elle vise la rupture du CDI : ce que le texte ne nomme pas, il ne");
    L.push("  l'exclut pas.");
    L.push("");
    L.push("  CE QUE L'APPLICATION N'A PAS LU — l'article L. 242-1 du code de la sécurité");
    L.push("  sociale et l'article L. 741-10 du code rural. Ils n'appartiennent pas au code");
    L.push("  du travail et le relais de l'application ne les sert pas. Ils sont donc");
    L.push("  NOMMÉS ici, jamais paraphrasés. Le périmètre exact de ce qui est « soumis à");
    L.push("  cotisations » se lit dans ces textes et dans vos déclarations sociales");
    L.push("  nominatives — pas dans ce document.");
    L.push("");
    L.push("  LA PIÈCE QUI PORTE L'ASSIETTE — vos déclarations sociales nominatives de");
    L.push("  l'exercice, dont le cumul annuel des rémunérations brutes soumises à");
    L.push("  cotisations constitue le point de départ, DIMINUÉ des indemnités de rupture");
    L.push("  de CDI qui y figurent. Conservez le détail du retraitement : c'est lui qui");
    L.push("  sera discuté, jamais le total.");
    L.push("");
  }

  DP.ajouter("CSE-CTL-BUD-01", {
    nom: "La subvention de fonctionnement : note de méthode sur l'assiette, tableau de calcul, ordre de versement, courrier au trésorier et protocole de régularisation de l'arriéré",
    detail: "La définition de l'assiette article à l'appui, le taux de la tranche, le " +
            "calcul chiffré du montant dû et du complément, le procès-verbal de versement, " +
            "le courrier au trésorier du comité et l'échéancier de régularisation.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var ms = nb(f.masseSalariale);
      var verse = nb(f.subventionVersee);
      var tauxNum = null, tauxTxt = "[0,20 % ou 0,22 % — selon l'effectif]", tranche = "[tranche à déterminer]";
      if (eff != null) {
        if (eff >= 2000) { tauxNum = 0.0022; tauxTxt = "0,22 %"; tranche = "entreprises d'au moins deux mille salariés (L. 2315-61, 2°)"; }
        else if (eff >= 50) { tauxNum = 0.0020; tauxTxt = "0,20 %"; tranche = "entreprises de cinquante à moins de deux mille salariés (L. 2315-61, 1°)"; }
      }
      var du = (ms != null && tauxNum != null) ? ms * tauxNum : null;
      var solde = (du != null && verse != null) ? du - verse : null;
      var L = [];

      L = L.concat(entete(ctx, "Subvention de fonctionnement du comité : note de méthode, calcul et régularisation",
        "article L. 2315-61 du code du travail"));
      usage(L);

      L.push("CE QUI SE JOUE, ET CE QUI NE SE JOUE PAS");
      L.push("");
      L.push("Le complément de subvention non versé RESTE DÛ. Ce n'est pas une irrégularité");
      L.push("formelle qui se corrige en écrivant une note : c'est une dette du budget de");
      L.push("l'entreprise envers le budget du comité, que le comité peut réclamer, et dont");
      L.push("le montant se calcule exactement — c'est tout l'objet du paragraphe 3.");
      L.push("");
      L.push("Ce document produit, dans l'ordre :");
      L.push("");
      L.push("  1. la NOTE DE MÉTHODE sur l'assiette, avec ce qui entre et ce qui sort ;");
      L.push("  2. le TAUX de la tranche, et la vérification de la tranche ;");
      L.push("  3. le TABLEAU DE CALCUL de l'exercice, chiffré ;");
      L.push("  4. la question de L'IMPUTATION — cette subvention s'ajoute-t-elle à celle");
      L.push("     des activités sociales, ou l'employeur en est-il déjà quitte ? ;");
      L.push("  5. l'ORDRE DE VERSEMENT et le procès-verbal ;");
      L.push("  6. le COURRIER AU TRÉSORIER du comité ;");
      L.push("  7. le PROTOCOLE DE RÉGULARISATION de l'arriéré, avec son échéancier.");
      L.push("");

      titre(L, "1 — Note de méthode : l'assiette");
      assiette(L);

      titre(L, "2 — Le taux, et la tranche");
      L.push("« L'employeur verse au comité social et économique une subvention de");
      L.push("fonctionnement d'un montant annuel équivalent à : 1° 0,20 % DE LA MASSE");
      L.push("SALARIALE BRUTE dans les entreprises de CINQUANTE À MOINS DE DEUX MILLE");
      L.push("salariés ; 2° 0,22 % DE LA MASSE SALARIALE BRUTE dans les entreprises D'AU");
      L.push("MOINS DEUX MILLE salariés » (L. 2315-61, premier alinéa).");
      L.push("");
      if (eff == null) {
        L.push("  Effectif de l'entreprise ...... [À RENSEIGNER]");
        L.push("");
        L.push("  L'EFFECTIF MANQUE : le taux ne peut pas être arrêté ici, et il ne sera pas");
        L.push("  supposé. Les deux calculs sont donc écrits côte à côte au paragraphe 3 ;");
        L.push("  rayez celui qui ne s'applique pas une fois l'effectif établi.");
      } else if (eff < 50) {
        L.push("  Effectif de l'entreprise ...... " + eff + " salariés.");
        L.push("");
        L.push("  L'EFFECTIF DÉCLARÉ EST INFÉRIEUR À CINQUANTE. Le premier alinéa de");
        L.push("  L. 2315-61 vise les entreprises « de cinquante à moins de deux mille »");
        L.push("  salariés : en deçà, ce texte ne fixe aucune subvention. Vérifiez d'abord");
        L.push("  l'effectif et la façon dont le seuil de cinquante salariés a été apprécié");
        L.push("  — c'est le point CSE-CTL-MEP de ce module qui le traite —, puis reprenez");
        L.push("  ce document si le seuil est en réalité franchi.");
      } else {
        L.push("  Effectif de l'entreprise ...... " + eff + " salariés");
        L.push("  Tranche applicable ............ " + tranche);
        L.push("  TAUX RETENU ................... " + tauxTxt);
        L.push("");
        if (eff >= 1900 && eff < 2000) {
          L.push("  ATTENTION — l'effectif est proche du seuil de deux mille salariés. Le taux");
          L.push("  passe de 0,20 % à 0,22 % au franchissement : reprenez ce calcul dès que");
          L.push("  l'effectif atteint deux mille.");
          L.push("");
        }
      }
      L.push("");

      titre(L, "3 — Le tableau de calcul de l'exercice");
      L.push("Exercice considéré : [DU ..... AU .....]");
      L.push("");
      L.push("  A — MASSE SALARIALE BRUTE de l'exercice, au sens du dernier alinéa de");
      L.push("      L. 2315-61 (gains et rémunérations soumis à cotisations, moins les");
      L.push("      indemnités de rupture de CDI) ......... " +
        (ms == null ? "[MASSE SALARIALE BRUTE — à relever sur les déclarations sociales nominatives]"
                    : eur(ms)));
      L.push("");
      if (eff == null || eff < 50) {
        L.push("  B — TAUX. Les deux hypothèses, puisque l'effectif n'est pas établi :");
        L.push("");
        L.push("      · de cinquante à moins de deux mille salariés .......... 0,20 %");
        L.push("        C = A × 0,0020 = " +
          (ms == null ? "[A] × 0,0020 = [MONTANT DÛ]" : eur(ms * 0.0020)));
        L.push("      · au moins deux mille salariés ......................... 0,22 %");
        L.push("        C = A × 0,0022 = " +
          (ms == null ? "[A] × 0,0022 = [MONTANT DÛ]" : eur(ms * 0.0022)));
        L.push("");
        L.push("      Rayez la ligne qui ne s'applique pas.");
      } else {
        L.push("  B — TAUX de la tranche ....................... " + tauxTxt +
          " (soit " + (tauxNum === 0.0022 ? "0,0022" : "0,0020") + ")");
        L.push("");
        L.push("  C — MONTANT ANNUEL DÛ = A × B");
        L.push("      " + (ms == null
          ? "[MASSE SALARIALE BRUTE] × " + (tauxNum === 0.0022 ? "0,0022" : "0,0020") + " = [MONTANT DÛ]"
          : eur(ms) + " × " + (tauxNum === 0.0022 ? "0,0022" : "0,0020") + " = " + eur(du)));
      }
      L.push("");
      L.push("  D — DÉJÀ VERSÉ sur l'exercice, tous versements confondus ...... " +
        (verse == null ? "[MONTANT VERSÉ — à relever sur les justificatifs de versement]" : eur(verse)));
      L.push("");
      L.push("      Détail des versements : [date · montant · pièce], ligne par ligne. Un");
      L.push("      total sans détail ne prouve rien le jour où il est contesté.");
      L.push("");
      L.push("  E — COMPLÉMENT RESTANT DÛ = C − D");
      if (solde == null) {
        L.push("      [MONTANT DÛ] − [MONTANT VERSÉ] = [COMPLÉMENT]");
      } else if (solde > 0) {
        L.push("      " + eur(du) + " − " + eur(verse) + " = " + eur(solde));
        L.push("");
        L.push("      IL RESTE DÛ " + eur(solde) + " AU TITRE DE CET EXERCICE.");
        L.push("      Cette somme est une dette : elle ne s'éteint pas par l'écoulement de");
        L.push("      l'exercice, et le comité peut en demander le paiement.");
      } else if (solde < 0) {
        L.push("      " + eur(du) + " − " + eur(verse) + " = " + eur(solde));
        L.push("");
        L.push("      LE VERSEMENT EXCÈDE LE MONTANT LÉGAL DE " + eur(Math.abs(solde)) + ". Le taux de");
        L.push("      L. 2315-61 est un MINIMUM légal : rien n'interdit de verser davantage.");
        L.push("      Vérifiez seulement d'où vient l'excédent — un accord plus favorable, un");
        L.push("      usage, ou une erreur d'imputation entre les deux budgets, qui ne se");
        L.push("      confondent pas.");
      } else {
        L.push("      " + eur(du) + " − " + eur(verse) + " = " + eur(0));
        L.push("");
        L.push("      LE COMPTE EST EXACT au titre de cet exercice.");
      }
      L.push("");
      L.push("  CE QUE CE TABLEAU NE FAIT PAS — il ne remonte pas les exercices antérieurs.");
      L.push("  Refaites-le, à l'identique, pour chaque exercice où le doute existe ; le");
      L.push("  paragraphe 7 échelonne ensuite le total.");
      L.push("");

      titre(L, "4 — L'imputation : cette subvention s'ajoute-t-elle ?");
      L.push("« Ce montant S'AJOUTE à la subvention destinée aux activités sociales et");
      L.push("culturelles, SAUF SI l'employeur fait déjà bénéficier le comité d'une somme ou");
      L.push("de moyens en personnel équivalents à 0,22 % de la masse salariale brute »");
      L.push("(L. 2315-61, deuxième alinéa).");
      L.push("");
      L.push("  L'employeur fait-il déjà bénéficier le comité d'une somme ou de moyens en");
      L.push("  personnel équivalents à 0,22 % de la masse salariale brute ? ... [oui / non]");
      L.push("");
      L.push("  Si oui, détaillez ce qui est fourni et sa valorisation :");
      L.push("     · sommes versées à un autre titre .......... [ ] €");
      L.push("     · moyens en personnel mis à disposition .... [ ] € — [nature, temps,");
      L.push("       méthode de valorisation]");
      L.push("     · TOTAL ................................... [ ] €");
      L.push("     · à comparer à 0,22 % de A ................ " +
        (ms == null ? "[A] × 0,0022 = [ ] €" : eur(ms * 0.0022)));
      L.push("");
      L.push("  Le texte pose une équivalence à 0,22 %, quel que soit l'effectif : c'est ce");
      L.push("  taux-là qui sert de mesure à l'exception, et non celui de votre tranche.");
      L.push("");
      L.push("  TROIS AUTRES RÈGLES QUE PORTE LE MÊME ARTICLE, et qu'on oublie :");
      L.push("");
      L.push("  · le comité PEUT DÉCIDER, PAR UNE DÉLIBÉRATION, de consacrer une partie de");
      L.push("    son budget de fonctionnement au financement de la formation des délégués");
      L.push("    syndicaux de l'entreprise ainsi qu'à la formation des représentants de");
      L.push("    proximité, lorsqu'ils existent (L. 2315-61) ;");
      L.push("  · il peut également décider, par une délibération, de TRANSFÉRER UNE PARTIE");
      L.push("    DE L'EXCÉDENT ANNUEL du budget de fonctionnement au financement des");
      L.push("    activités sociales et culturelles, dans des conditions et limites fixées");
      L.push("    par décret en Conseil d'État (L. 2315-61) — le décret n'est pas cité ici :");
      L.push("    l'application ne l'a pas lu, et la limite ne s'invente pas ;");
      L.push("  · MAIS lorsque le financement des frais d'expertise est pris en charge par");
      L.push("    l'employeur en application du 3° de l'article L. 2315-80, LE COMITÉ NE PEUT");
      L.push("    PAS DÉCIDER DE TRANSFÉRER D'EXCÉDENTS du budget de fonctionnement au");
      L.push("    financement des activités sociales et culturelles PENDANT LES TROIS ANNÉES");
      L.push("    SUIVANTES (L. 2315-61, dernier alinéa). Vérifiez ce point avant toute");
      L.push("    délibération de transfert : il se rattache au document CSE-CTL-EXP-01.");
      L.push("");
      L.push("  INSCRIPTION AUX COMPTES — « Cette somme et ses modalités d'utilisation sont");
      L.push("  inscrites, d'une part, dans les comptes annuels du comité social et");
      L.push("  économique ou, le cas échéant, dans les documents mentionnés à l'article");
      L.push("  L. 2315-65 et, d'autre part, dans le rapport mentionné à l'article");
      L.push("  L. 2315-69 » (L. 2315-61). Le versement ne suffit donc pas : il doit se lire");
      L.push("  dans les comptes et dans le rapport de gestion du comité.");
      L.push("");

      titre(L, "5 — L'ordre de versement, et le procès-verbal");
      L.push("ORDRE DE VERSEMENT");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("Objet : versement du complément de subvention de fonctionnement du comité");
      L.push("social et économique — exercice [ ]");
      L.push("");
      L.push("Vu l'article L. 2315-61 du code du travail ;");
      L.push("Vu le tableau de calcul annexé ;");
      L.push("");
      L.push("Il est ordonné le versement, au comité social et économique de " + nom(ctx) + ",");
      L.push("d'une somme de " + (solde != null && solde > 0 ? eur(solde) : "[COMPLÉMENT]") +
        " au titre du complément de subvention de");
      L.push("fonctionnement de l'exercice [ ].");
      L.push("");
      L.push("  Compte à créditer : [coordonnées bancaires du comité — à demander au");
      L.push("  trésorier, jamais reconstituées]");
      L.push("  Date d'exécution : [DATE]");
      L.push("  Référence à porter au libellé : « Subvention de fonctionnement L. 2315-61 —");
      L.push("  complément exercice [ ] » — le libellé compte : c'est lui qui empêchera");
      L.push("  qu'on impute plus tard ce versement au budget des activités sociales.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("PROCÈS-VERBAL DE VERSEMENT — extrait à porter au procès-verbal du comité");
      L.push("");
      L.push("Comité social et économique de " + nom(ctx));
      L.push("Réunion du [DATE]");
      L.push("");
      L.push("Point [n°] — Subvention de fonctionnement de l'exercice [ ].");
      L.push("");
      L.push("Le président présente le calcul de la subvention de fonctionnement : masse");
      L.push("salariale brute de l'exercice " +
        (ms == null ? "[MONTANT]" : eur(ms)) + ", taux de " + tauxTxt + ", soit " +
        (du == null ? "[MONTANT DÛ]" : eur(du)) + " dus.");
      L.push("Il indique que " + (verse == null ? "[MONTANT VERSÉ]" : eur(verse)) +
        " ont été versés et qu'un complément de");
      L.push((solde != null && solde > 0 ? eur(solde) : "[COMPLÉMENT]") +
        " a été ordonné le [DATE], porté au compte du comité le [DATE].");
      L.push("");
      L.push("Le trésorier confirme la réception et l'inscription de cette somme aux comptes");
      L.push("annuels du comité, ainsi que la mention de ses modalités d'utilisation dans le");
      L.push("rapport de l'article L. 2315-69.");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");

      courrier(L, 1, "au trésorier du comité social et économique", [
        "Ce courrier accompagne le versement. Il porte le calcul, et non seulement le",
        "montant : c'est le calcul qui permet au trésorier de le vérifier, et c'est sa",
        "vérification qui clôt le sujet.",
      ]);
      papier(L, ctx, ["À l'attention du trésorier",
                      "du comité social et économique"]);
      L.push("Objet : subvention de fonctionnement de l'exercice [ ] — calcul et versement");
      L.push("du complément");
      L.push("");
      L.push("Madame, Monsieur le Trésorier,");
      L.push("");
      L.push("L'article L. 2315-61 du code du travail fixe la subvention de fonctionnement");
      L.push("du comité à " + tauxTxt + " de la masse salariale brute, celle-ci étant constituée par");
      L.push("l'ensemble des gains et rémunérations soumis à cotisations de sécurité sociale,");
      L.push("à l'exception des indemnités versées à l'occasion de la rupture du contrat de");
      L.push("travail à durée indéterminée.");
      L.push("");
      L.push("Pour l'exercice [ ], le calcul s'établit ainsi :");
      L.push("");
      L.push("  masse salariale brute .................. " + (ms == null ? "[ ] €" : eur(ms)));
      L.push("  taux applicable ........................ " + tauxTxt);
      L.push("  montant annuel dû ...................... " + (du == null ? "[ ] €" : eur(du)));
      L.push("  déjà versé ............................. " + (verse == null ? "[ ] €" : eur(verse)));
      L.push("  COMPLÉMENT VERSÉ CE JOUR ............... " +
        (solde != null && solde > 0 ? eur(solde) : "[ ] €"));
      L.push("");
      L.push("Vous trouverez ci-joint le détail du retraitement de l'assiette et la copie de");
      L.push("l'ordre de versement. Je vous remercie de bien vouloir en accuser réception et");
      L.push("de faire inscrire cette somme, ainsi que ses modalités d'utilisation, dans les");
      L.push("comptes annuels du comité et dans le rapport prévu à l'article L. 2315-69,");
      L.push("comme l'article L. 2315-61 l'exige.");
      L.push("");
      L.push("Si votre propre calcul diffère du mien, faites-le-moi connaître avec le détail");
      L.push("de votre assiette : c'est sur l'assiette, et non sur le taux, que les écarts");
      L.push("se logent presque toujours.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur le Trésorier, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : tableau de calcul · détail du retraitement de l'assiette ·");
      L.push("ordre de versement.");
      L.push("");

      titre(L, "7 — Le protocole de régularisation de l'arriéré, et son échéancier");
      L.push("À n'utiliser que si le complément porte sur PLUSIEURS EXERCICES ou si son");
      L.push("montant ne peut pas être versé en une fois. Un arriéré se règle d'abord en un");
      L.push("seul versement : l'échéancier est une facilité, et il se négocie.");
      L.push("");
      L.push("PROTOCOLE DE RÉGULARISATION");
      L.push("");
      L.push("Entre " + nom(ctx) + ", représentée par " + signataire(ctx) + ",");
      L.push("et le comité social et économique de " + nom(ctx) + ", représenté par");
      L.push("[secrétaire et trésorier, autorisés par la délibération du [DATE]],");
      L.push("");
      L.push("Article 1 — Reconnaissance de la dette");
      L.push("Les parties constatent qu'au titre de l'article L. 2315-61 du code du travail,");
      L.push("il reste dû au comité, au jour de la signature :");
      L.push("");
      L.push("     Exercice [ ] .......... [ ] €");
      L.push("     Exercice [ ] .......... [ ] €");
      L.push("     Exercice [ ] .......... [ ] €");
      L.push("     TOTAL ................. " +
        (solde != null && solde > 0 ? eur(solde) + " (pour le seul exercice calculé ci-dessus)" : "[TOTAL DE L'ARRIÉRÉ]"));
      L.push("");
      L.push("Le calcul de chaque exercice est annexé, avec l'assiette retenue et sa pièce.");
      L.push("");
      L.push("Article 2 — Échéancier");
      L.push("Le total est versé selon l'échéancier suivant :");
      L.push("");
      var q = (solde != null && solde > 0) ? solde / 4 : null;
      L.push("     1re échéance — le " + leJour(dans(d0, 30)) + " ......... " + (q == null ? "[ ] €" : eur(q)));
      L.push("     2e échéance — le " + leJour(dans(d0, 120)) + " .......... " + (q == null ? "[ ] €" : eur(q)));
      L.push("     3e échéance — le " + leJour(dans(d0, 210)) + " .......... " + (q == null ? "[ ] €" : eur(q)));
      L.push("     4e échéance — le " + leJour(dans(d0, 300)) + " .......... " + (q == null ? "[ ] €" : eur(q)));
      L.push("");
      L.push("     [Ces quatre dates et ce quart sont une PROPOSITION calculée à partir");
      L.push("     d'aujourd'hui : quatre versements trimestriels sur moins d'un an. Aucun");
      L.push("     texte lu n'impose de délai de régularisation ; c'est donc une négociation,");
      L.push("     et le comité peut refuser l'étalement. Adaptez les dates et les");
      L.push("     montants, ou supprimez cet article et versez en une fois.]");
      L.push("");
      L.push("Article 3 — Imputation");
      L.push("Chaque versement est porté au crédit du budget DE FONCTIONNEMENT du comité,");
      L.push("avec le libellé « Subvention de fonctionnement L. 2315-61 — arriéré exercice");
      L.push("[ ] ». Aucun de ces versements ne s'impute sur la contribution aux activités");
      L.push("sociales et culturelles, qui obéit à l'article L. 2312-81 et fait l'objet d'un");
      L.push("calcul distinct.");
      L.push("");
      L.push("Article 4 — Inscription aux comptes");
      L.push("Le comité inscrit chaque versement à ses comptes annuels ou aux documents de");
      L.push("l'article L. 2315-65, et en mentionne les modalités d'utilisation dans le");
      L.push("rapport de l'article L. 2315-69 (L. 2315-61).");
      L.push("");
      L.push("Article 5 — Défaut");
      L.push("À défaut de versement à l'une des échéances, le solde devient immédiatement");
      L.push("exigible en totalité.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("");
      L.push("Pour l'entreprise,                     Pour le comité,");
      L.push(signataire(ctx) + "        [secrétaire] · [trésorier]");
      L.push("");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous demandez au service paie le cumul annuel des",
        "rémunérations brutes soumises à cotisations, et le détail des indemnités de",
        "rupture de CDI à en retrancher. C'est le seul travail réel de ce document : le",
        "reste est une multiplication.",
        "",
        "Dès l'assiette obtenue — le tableau du paragraphe 3 se remplit en dix minutes et",
        "donne le complément. Comptez une semaine, soit le " + leJour(dans(d0, 7)) + ".",
        "",
        "Le versement — il n'est enfermé dans aucun délai par le texte lu, ce qui ne",
        "signifie pas qu'il puisse attendre : la somme est due, et elle porte sur un",
        "exercice qui se clôture. Fixez-vous le " + leJour(dans(d0, 30)) + " au plus tard.",
        "",
        "Le même jour — courrier 1 au trésorier, avec le calcul. Sans le calcul, le",
        "versement ne clôt rien : il reste discutable.",
        "",
        "À la réunion suivante du comité — le point est porté au procès-verbal",
        "(paragraphe 5), et le trésorier confirme l'inscription aux comptes.",
        "",
        "À CHAQUE EXERCICE — le calcul se refait. Deux choses le changent : la masse",
        "salariale, qui bouge chaque année, et le franchissement du seuil de deux mille",
        "salariés, qui fait passer le taux de 0,20 % à 0,22 %.",
      ]);

      return pied(L,
        ["L. 2312-81", "L. 2312-83", "L. 2315-61", "L. 2315-65", "L. 2315-69", "L. 2315-80"],
        ["L. 242-1 du code de la sécurité sociale et L. 741-10 du code rural et de la pêche maritime (définition des gains et rémunérations soumis à cotisations)",
         "le décret en Conseil d'État fixant les conditions et limites du transfert d'excédent du budget de fonctionnement vers les activités sociales et culturelles"]);
    },
  });

  DP.ajouter("CSE-CTL-BUD-02", {
    nom: "La contribution aux activités sociales et culturelles : note de méthode sur le rapport, tableau des deux exercices, ordre de versement et protocole de régularisation",
    detail: "La recherche de l'accord, le calcul du rapport de l'exercice précédent et de " +
            "celui de l'exercice en cours, le complément nécessaire pour rétablir le " +
            "plancher, l'ordre de versement, le courrier au trésorier, la répartition entre " +
            "comités d'établissement et l'échéancier de régularisation.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var ms = nb(f.masseSalariale);
      var msN1 = nb(f.masseSalarialeN1);
      var ascN = nb(f.ascAnneeN);
      var ascN1 = nb(f.ascAnneeN1);
      var multi = oui(f.etablissementsMultiples);
      var rN1 = (ascN1 != null && msN1 != null && msN1 > 0) ? ascN1 / msN1 : null;
      var rN = (ascN != null && ms != null && ms > 0) ? ascN / ms : null;
      var duN = (rN1 != null && ms != null) ? rN1 * ms : null;
      var comp = (duN != null && ascN != null) ? duN - ascN : null;
      var L = [];

      L = L.concat(entete(ctx, "Contribution aux activités sociales et culturelles : note de méthode, calcul du rapport et régularisation",
        "articles L. 2312-81, L. 2312-82, L. 2312-83 et L. 2312-84 du code du travail"));
      usage(L);

      L.push("CE QUI SE MESURE ICI N'EST PAS UN MONTANT, C'EST UN RAPPORT");
      L.push("");
      L.push("« La contribution versée chaque année par l'employeur pour financer des");
      L.push("institutions sociales du comité social et économique est FIXÉE PAR ACCORD");
      L.push("D'ENTREPRISE. À défaut d'accord, LE RAPPORT DE CETTE CONTRIBUTION À LA MASSE");
      L.push("SALARIALE BRUTE NE PEUT ÊTRE INFÉRIEUR AU MÊME RAPPORT EXISTANT POUR L'ANNÉE");
      L.push("PRÉCÉDENTE » (L. 2312-81).");
      L.push("");
      L.push("D'où l'erreur qui se répète chaque année : verser le même montant que l'an");
      L.push("passé, et croire l'obligation satisfaite. Elle ne l'est pas. Si la masse");
      L.push("salariale a progressé et que la contribution est restée stable, LE RAPPORT A");
      L.push("BAISSÉ, et l'insuffisance est caractérisée — sans qu'aucun montant ait");
      L.push("diminué.");
      L.push("");
      L.push("Ce document produit, dans l'ordre :");
      L.push("");
      L.push("  1. la recherche de L'ACCORD, qui écarte le plancher ;");
      L.push("  2. la NOTE DE MÉTHODE sur l'assiette ;");
      L.push("  3. le TABLEAU DES DEUX EXERCICES et le calcul du complément ;");
      L.push("  4. la RÉPARTITION entre comités d'établissement, s'il y en a ;");
      L.push("  5. l'ORDRE DE VERSEMENT et le procès-verbal ;");
      L.push("  6. le COURRIER AU TRÉSORIER ;");
      L.push("  7. le PROTOCOLE DE RÉGULARISATION et son échéancier.");
      L.push("");

      titre(L, "1 — L'accord d'abord : c'est lui qui fixe la contribution");
      L.push("Le plancher du rapport ne joue qu'« À DÉFAUT D'ACCORD ». Cherchez donc");
      L.push("l'accord avant tout calcul :");
      L.push("");
      L.push("  Un accord d'entreprise fixe-t-il la contribution aux activités sociales et");
      L.push("  culturelles ? ..................................... [oui / non]");
      L.push("");
      L.push("     Si OUI : accord du [DATE], déposé le [DATE], article [ ]. C'est lui qui");
      L.push("     fixe la contribution, et le calcul du paragraphe 3 devient une simple");
      L.push("     vérification de son exécution — comparez ce qui a été versé à ce que");
      L.push("     l'accord prévoit, et arrêtez-vous là.");
      L.push("");
      L.push("     Si NON : le plancher de L. 2312-81 s'applique, et le calcul du");
      L.push("     paragraphe 3 est l'acte à accomplir.");
      L.push("");
      L.push("  ATTENTION à ne pas confondre deux accords : celui qui fixe la CONTRIBUTION");
      L.push("  (L. 2312-81) et celui qui en fixe la RÉPARTITION entre comités");
      L.push("  d'établissement (L. 2312-82). Le second n'écarte pas le plancher du premier.");
      L.push("");

      titre(L, "2 — Note de méthode : l'assiette");
      assiette(L);
      L.push("UNE PRÉCISION PROPRE À CE CALCUL — l'assiette doit être LA MÊME POUR LES DEUX");
      L.push("EXERCICES comparés. Un rapport calculé sur une assiette retraitée cette année");
      L.push("et sur une assiette brute l'an dernier ne compare rien du tout : c'est la");
      L.push("première chose qu'on vous opposera. Si votre méthode de retraitement a changé,");
      L.push("recalculez l'exercice précédent avec la nouvelle méthode et dites-le.");
      L.push("");

      titre(L, "3 — Le tableau des deux exercices");
      L.push("  ┌──────────────────────────────────────┬──────────────┬──────────────┐");
      L.push("  │                                      │ Exercice N-1 │ Exercice N   │");
      L.push("  ├──────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ A · Contribution versée aux ASC      │ " +
        pad(ascN1 == null ? "[ ] €" : eur(ascN1), 12) + " │ " +
        pad(ascN == null ? "[ ] €" : eur(ascN), 12) + " │");
      L.push("  │     (activités sociales, culturelles)│              │              │");
      L.push("  ├──────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ B · Masse salariale brute            │ " +
        pad(msN1 == null ? "[ ] €" : eur(msN1), 12) + " │ " +
        pad(ms == null ? "[ ] €" : eur(ms), 12) + " │");
      L.push("  │     (L. 2312-83)                     │              │              │");
      L.push("  ├──────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ C · RAPPORT = A ÷ B                  │ " +
        pad(rN1 == null ? "[ ] %" : pourcent(rN1), 12) + " │ " +
        pad(rN == null ? "[ ] %" : pourcent(rN), 12) + " │");
      L.push("  └──────────────────────────────────────┴──────────────┴──────────────┘");
      L.push("");
      L.push("  Pièces : justificatifs de versement pour A · déclarations sociales");
      L.push("  nominatives retraitées pour B, sur chacun des deux exercices.");
      L.push("");
      L.push("  LE TEST — le rapport de l'exercice N est-il au moins égal à celui de");
      L.push("  l'exercice N-1 ?");
      L.push("");
      if (rN != null && rN1 != null) {
        L.push("     " + pourcent(rN) + " (N) contre " + pourcent(rN1) + " (N-1) — " +
          (rN >= rN1 ? "LE PLANCHER EST RESPECTÉ." : "LE PLANCHER N'EST PAS RESPECTÉ."));
      } else {
        L.push("     [rapport N] contre [rapport N-1] — [respecté / non respecté].");
      }
      L.push("");
      L.push("  LE CALCUL DU DÛ ET DU COMPLÉMENT");
      L.push("");
      L.push("  D · CONTRIBUTION MINIMALE DE L'EXERCICE N = rapport N-1 × masse salariale N");
      if (duN != null) {
        L.push("      " + pourcent(rN1) + " × " + eur(ms) + " = " + eur(duN));
      } else {
        L.push("      [rapport N-1] × [masse salariale N] = [CONTRIBUTION MINIMALE]");
      }
      L.push("");
      L.push("  E · COMPLÉMENT À VERSER = D − contribution déjà versée en N");
      if (comp != null && comp > 0) {
        L.push("      " + eur(duN) + " − " + eur(ascN) + " = " + eur(comp));
        L.push("");
        L.push("      IL FAUT VERSER " + eur(comp) + " POUR RÉTABLIR LE RAPPORT.");
        L.push("      Après ce versement, la contribution de l'exercice N s'établira à");
        L.push("      " + eur(duN) + ", soit " + pourcent(rN1) + " de la masse salariale — exactement le");
        L.push("      rapport de l'exercice précédent, qui est le plancher légal.");
      } else if (comp != null && comp <= 0) {
        L.push("      " + eur(duN) + " − " + eur(ascN) + " = " + eur(comp));
        L.push("");
        L.push("      AUCUN COMPLÉMENT N'EST DÛ au titre du plancher : le rapport de");
        L.push("      l'exercice N est déjà au moins égal à celui de l'exercice précédent.");
        L.push("      Attention toutefois : le rapport de cette année devient le plancher de");
        L.push("      l'an prochain. Un rapport élevé cette année engage l'exercice suivant.");
      } else {
        L.push("      [CONTRIBUTION MINIMALE] − [déjà versé en N] = [COMPLÉMENT]");
        L.push("");
        L.push("      Une fois les quatre montants du tableau relevés, ce calcul se fait en");
        L.push("      deux opérations : une division pour le rapport N-1, une multiplication");
        L.push("      pour le dû, une soustraction pour le complément.");
      }
      L.push("");
      L.push("  L'EFFET DE CLIQUET, qu'il faut voir avant de verser : le rapport de");
      L.push("  l'exercice N devient le plancher de l'exercice N+1. Un versement");
      L.push("  exceptionnel élève le plancher de l'année suivante. Si le versement est");
      L.push("  destiné à ne pas se reproduire, dites-le expressément dans l'acte qui le");
      L.push("  décide — et vérifiez ce que votre accord, s'il en existe un, en dit.");
      L.push("");
      L.push("  CE QUE CE CALCUL NE COUVRE PAS — le reliquat budgétaire. « En cas de");
      L.push("  reliquat budgétaire les membres de la délégation du personnel du comité");
      L.push("  peuvent décider, par une délibération, de transférer tout ou partie du");
      L.push("  montant de l'excédent annuel du budget destiné aux activités sociales et");
      L.push("  culturelles au budget de fonctionnement ou à des associations, dans des");
      L.push("  conditions et limites fixées par décret en Conseil d'État » (L. 2312-84).");
      L.push("  C'est une décision DU COMITÉ, pas de l'employeur, et elle ne réduit pas la");
      L.push("  contribution due.");
      L.push("");

      titre(L, "4 — La répartition entre comités d'établissement");
      L.push("  L'entreprise comporte-t-elle plusieurs établissements distincts ? ...... " +
        ouiNon(f.etablissementsMultiples, "oui / non"));
      L.push("");
      if (multi === false) {
        L.push("  Le dossier déclare un établissement unique : ce paragraphe est sans objet.");
        L.push("  Conservez-le pour le jour où le périmètre changerait.");
        L.push("");
      } else {
        L.push("  « Dans les entreprises comportant plusieurs comités sociaux et économiques");
        L.push("  d'établissement, la détermination du MONTANT GLOBAL de la contribution");
        L.push("  patronale versée pour financer les activités sociales et culturelles du");
        L.push("  comité est effectuée AU NIVEAU DE L'ENTREPRISE dans les conditions prévues");
        L.push("  à l'article L. 2312-81. La RÉPARTITION de la contribution entre les comités");
        L.push("  d'établissement est fixée par un ACCORD D'ENTREPRISE au prorata des");
        L.push("  effectifs des établissements ou de leur masse salariale ou de ces deux");
        L.push("  critères combinés. À DÉFAUT D'ACCORD, cette répartition est effectuée AU");
        L.push("  PRORATA DE LA MASSE SALARIALE DE CHAQUE ÉTABLISSEMENT » (L. 2312-82).");
        L.push("");
        L.push("  Deux étages, donc, et dans cet ordre :");
        L.push("");
        L.push("     1. le MONTANT GLOBAL se calcule au niveau de l'entreprise — c'est le");
        L.push("        tableau du paragraphe 3, et lui seul ;");
        L.push("     2. la RÉPARTITION suit l'accord ; à défaut, elle suit la masse salariale");
        L.push("        de chaque établissement, et rien d'autre.");
        L.push("");
        L.push("  TABLEAU DE RÉPARTITION");
        L.push("");
        L.push("     Établissement · masse salariale · part · montant réparti");
        L.push("     [ ] ...... [ ] € ...... [ ] % ...... [ ] €");
        L.push("     [ ] ...... [ ] € ...... [ ] % ...... [ ] €");
        L.push("     [ ] ...... [ ] € ...... [ ] % ...... [ ] €");
        L.push("     TOTAL .... " + (ms == null ? "[ ] €" : eur(ms)) + " ...... 100 % ...... " +
          (duN == null ? "[ ] €" : eur(duN)));
        L.push("");
        L.push("     Un accord de répartition existe-t-il ? [oui / non] — s'il existe :");
        L.push("     accord du [DATE], critère retenu : [effectifs / masse salariale / les");
        L.push("     deux combinés].");
        L.push("");
      }

      titre(L, "5 — L'ordre de versement et le procès-verbal");
      L.push("ORDRE DE VERSEMENT");
      L.push("");
      L.push(nom(ctx));
      L.push("");
      L.push("Objet : versement du complément de contribution aux activités sociales et");
      L.push("culturelles — exercice [ ]");
      L.push("");
      L.push("Vu l'article L. 2312-81 du code du travail ;");
      L.push("Vu l'absence d'accord d'entreprise fixant la contribution ;");
      L.push("Vu le tableau de calcul des rapports annexé ;");
      L.push("");
      L.push("Il est ordonné le versement, au comité social et économique de " + nom(ctx) + ",");
      L.push("d'une somme de " + (comp != null && comp > 0 ? eur(comp) : "[COMPLÉMENT]") +
        ", portant la contribution de l'exercice");
      L.push((duN == null ? "à [CONTRIBUTION MINIMALE]" : "à " + eur(duN)) +
        ", soit un rapport à la masse salariale brute au moins");
      L.push("égal à celui de l'exercice précédent.");
      L.push("");
      L.push("  Référence à porter au libellé : « Contribution activités sociales et");
      L.push("  culturelles L. 2312-81 — complément exercice [ ] ». Ce libellé n'est pas");
      L.push("  une formalité : c'est lui qui empêchera qu'on impute plus tard ce versement");
      L.push("  à la subvention de fonctionnement, qui a son propre calcul et son propre");
      L.push("  article.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ".");
      L.push("");
      L.push(signataire(ctx));
      L.push("");
      L.push(TRAIT);
      L.push("");
      L.push("PROCÈS-VERBAL — extrait");
      L.push("");
      L.push("Comité social et économique de " + nom(ctx) + " · réunion du [DATE]");
      L.push("");
      L.push("Point [n°] — Contribution aux activités sociales et culturelles de");
      L.push("l'exercice [ ].");
      L.push("");
      L.push("Le président expose que, en l'absence d'accord d'entreprise fixant la");
      L.push("contribution, le rapport de celle-ci à la masse salariale brute ne peut être");
      L.push("inférieur au rapport de l'année précédente (L. 2312-81). Le rapport de");
      L.push("l'exercice précédent s'établissait à " + (rN1 == null ? "[ ] %" : pourcent(rN1)) + " ; celui de");
      L.push("l'exercice en cours, avant complément, à " + (rN == null ? "[ ] %" : pourcent(rN)) + ".");
      L.push("");
      L.push("Un complément de " + (comp != null && comp > 0 ? eur(comp) : "[COMPLÉMENT]") +
        " a été ordonné le [DATE] et porté au compte");
      L.push("du comité le [DATE], rétablissant le rapport au niveau du plancher légal.");
      L.push("");
      L.push("Le trésorier confirme la réception et l'inscription de cette somme aux comptes");
      L.push("du comité.");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");

      courrier(L, 1, "au trésorier du comité social et économique", [
        "Ce courrier porte les quatre montants et les deux rapports. C'est la seule",
        "présentation qui permette au trésorier de refaire le calcul lui-même.",
      ]);
      papier(L, ctx, ["À l'attention du trésorier",
                      "du comité social et économique"]);
      L.push("Objet : contribution aux activités sociales et culturelles de l'exercice [ ] —");
      L.push("calcul du rapport et versement du complément");
      L.push("");
      L.push("Madame, Monsieur le Trésorier,");
      L.push("");
      L.push("En l'absence d'accord d'entreprise fixant la contribution aux activités");
      L.push("sociales et culturelles, l'article L. 2312-81 du code du travail impose que le");
      L.push("rapport de cette contribution à la masse salariale brute ne soit pas inférieur");
      L.push("au même rapport existant pour l'année précédente.");
      L.push("");
      L.push("Le calcul s'établit ainsi, sur l'assiette définie à l'article L. 2312-83 :");
      L.push("");
      L.push("  Exercice précédent — contribution " + (ascN1 == null ? "[ ] €" : eur(ascN1)) +
        " · masse salariale " + (msN1 == null ? "[ ] €" : eur(msN1)));
      L.push("     rapport ....................... " + (rN1 == null ? "[ ] %" : pourcent(rN1)));
      L.push("  Exercice en cours — contribution " + (ascN == null ? "[ ] €" : eur(ascN)) +
        " · masse salariale " + (ms == null ? "[ ] €" : eur(ms)));
      L.push("     rapport avant complément ...... " + (rN == null ? "[ ] %" : pourcent(rN)));
      L.push("");
      L.push("  Contribution minimale de l'exercice = rapport précédent × masse salariale");
      L.push("  de l'exercice = " + (duN == null ? "[ ] €" : eur(duN)));
      L.push("  COMPLÉMENT VERSÉ CE JOUR ......... " +
        (comp != null && comp > 0 ? eur(comp) : "[ ] €"));
      L.push("");
      L.push("Le détail du retraitement de l'assiette, identique pour les deux exercices,");
      L.push("est joint. Je vous remercie d'en accuser réception et de faire inscrire cette");
      L.push("somme aux comptes du comité.");
      L.push("");
      L.push("Je rappelle que le budget des activités sociales et culturelles et le budget de");
      L.push("fonctionnement ne se confondent pas : ce versement s'ajoute à la subvention de");
      L.push("fonctionnement de l'article L. 2315-61, qui fait l'objet d'un calcul distinct.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur le Trésorier, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : tableau des deux exercices · détail du retraitement de");
      L.push("l'assiette · ordre de versement.");
      L.push("");

      titre(L, "7 — Le protocole de régularisation de l'arriéré");
      L.push("PROTOCOLE DE RÉGULARISATION");
      L.push("");
      L.push("Entre " + nom(ctx) + ", représentée par " + signataire(ctx) + ",");
      L.push("et le comité social et économique, représenté par [secrétaire et trésorier,");
      L.push("autorisés par la délibération du [DATE]],");
      L.push("");
      L.push("Article 1 — Reconnaissance");
      L.push("Les parties constatent que, faute d'accord fixant la contribution, le rapport");
      L.push("de la contribution à la masse salariale brute est demeuré inférieur au rapport");
      L.push("de l'année précédente sur le ou les exercices suivants, et qu'il reste dû :");
      L.push("");
      L.push("     Exercice [ ] — rapport constaté [ ] % contre [ ] % ... [ ] €");
      L.push("     Exercice [ ] — rapport constaté [ ] % contre [ ] % ... [ ] €");
      L.push("     TOTAL ................................................ " +
        (comp != null && comp > 0 ? eur(comp) + " (pour le seul exercice calculé)" : "[TOTAL]"));
      L.push("");
      L.push("Article 2 — Échéancier");
      var q2 = (comp != null && comp > 0) ? comp / 3 : null;
      L.push("     1re échéance — le " + leJour(dans(d0, 30)) + " ......... " + (q2 == null ? "[ ] €" : eur(q2)));
      L.push("     2e échéance — le " + leJour(dans(d0, 120)) + " .......... " + (q2 == null ? "[ ] €" : eur(q2)));
      L.push("     3e échéance — le " + leJour(dans(d0, 210)) + " .......... " + (q2 == null ? "[ ] €" : eur(q2)));
      L.push("");
      L.push("     [Trois échéances calculées à partir d'aujourd'hui, à titre de");
      L.push("     proposition. Aucun texte lu n'impose de délai : c'est une négociation,");
      L.push("     et le comité peut exiger le versement en une fois.]");
      L.push("");
      L.push("Article 3 — Effet sur les exercices suivants");
      L.push("Les parties conviennent que le rapport rétabli au titre de chaque exercice");
      L.push("régularisé constitue le rapport de référence pour l'exercice suivant, au sens");
      L.push("de l'article L. 2312-81. [Vérifiez cette clause : elle est la conséquence");
      L.push("logique du texte, mais elle engage l'entreprise pour l'avenir.]");
      L.push("");
      L.push("Article 4 — Imputation et défaut");
      L.push("Chaque versement est porté au budget des activités sociales et culturelles,");
      L.push("distinct du budget de fonctionnement. À défaut de versement à l'une des");
      L.push("échéances, le solde devient immédiatement exigible.");
      L.push("");
      L.push("Fait à " + lieu(ctx) + ", le " + leJour(d0) + ", en deux exemplaires.");
      L.push("");
      L.push("Pour l'entreprise,                     Pour le comité,");
      L.push(signataire(ctx) + "        [secrétaire] · [trésorier]");
      L.push("");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous cherchez l'accord de L. 2312-81. S'il existe, le",
        "plancher ne joue pas et le travail s'arrête presque là.",
        "",
        "Le même jour — vous demandez au service paie les DEUX masses salariales, celle",
        "de l'exercice et celle de l'exercice précédent, retraitées de la même façon. Ce",
        "sont deux chiffres, pas un : c'est là que les dossiers s'enlisent.",
        "",
        "Dès les quatre montants réunis — le tableau du paragraphe 3 donne les deux",
        "rapports et le complément. Comptez le " + leJour(dans(d0, 10)) + ".",
        "",
        "Le versement — avant la clôture de l'exercice en cours. C'est le seul repère",
        "utile : le plancher se mesure exercice par exercice, et un complément versé",
        "après la clôture régularise l'exercice clos sans rien changer au suivant.",
        "",
        "Le même jour — courrier 1 au trésorier, avec les deux rapports.",
        "",
        "À la réunion suivante du comité — le point est porté au procès-verbal.",
        "",
        "L'AN PROCHAIN, à la même date — le rapport rétabli cette année devient le",
        "plancher. Refaites le calcul : c'est une obligation annuelle, et elle se perd",
        "toujours de la même façon, en reconduisant un montant au lieu d'un rapport.",
      ]);

      return pied(L,
        ["L. 2312-78", "L. 2312-81", "L. 2312-82", "L. 2312-83", "L. 2312-84", "L. 2315-61"],
        ["L. 242-1 du code de la sécurité sociale et L. 741-10 du code rural et de la pêche maritime (définition des gains et rémunérations soumis à cotisations)",
         "le décret en Conseil d'État fixant les conditions et limites du transfert de l'excédent des activités sociales et culturelles (L. 2312-84)"]);
    },
  });

  DP.ajouter("CSE-CTL-BUD-03", {
    nom: "La suppression de la condition d'ancienneté d'accès aux activités sociales et culturelles : recensement, délibération, note aux salariés et reprise des refus",
    detail: "Le recensement des prestations selon la nomenclature de R. 2312-35, la " +
            "délibération du comité supprimant la condition, la note d'information au " +
            "personnel, la reprise des demandes refusées et le courrier au secrétaire.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var cond = oui(f.ancienneteASC);
      var L = [];

      L = L.concat(entete(ctx, "Suppression de la condition d'ancienneté d'accès aux activités sociales et culturelles",
        "articles L. 2312-78 et R. 2312-35 du code du travail"));
      usage(L);

      L.push("QUI DÉCIDE, ET DONC QUI SIGNE");
      L.push("");
      L.push("« Le comité social et économique ASSURE, CONTRÔLE OU PARTICIPE À LA GESTION de");
      L.push("toutes les activités sociales et culturelles établies dans l'entreprise");
      L.push("PRIORITAIREMENT AU BÉNÉFICE DES SALARIÉS, DE LEUR FAMILLE ET DES STAGIAIRES,");
      L.push("quel qu'en soit le mode de financement, dans des conditions déterminées par");
      L.push("décret en Conseil d'État » (L. 2312-78).");
      L.push("");
      L.push("La gestion de ces activités appartient donc AU COMITÉ. L'acte central de ce");
      L.push("document est une DÉLIBÉRATION DU COMITÉ, et non une décision de l'employeur :");
      L.push("une note de la direction supprimant la condition d'ancienneté serait un acte");
      L.push("pris par celui qui n'a pas le pouvoir de le prendre.");
      L.push("");
      L.push("  Une condition d'ancienneté est-elle déclarée ? ......... " +
        ouiNon(f.ancienneteASC, "oui / non"));
      L.push("");
      if (cond === false) {
        L.push("  Le dossier déclare qu'aucune condition d'ancienneté ne commande l'accès.");
        L.push("  Servez-vous alors du paragraphe 1 comme d'une VÉRIFICATION : le recensement");
        L.push("  prestation par prestation fait souvent apparaître une ancienneté résiduelle");
        L.push("  dans le règlement d'une seule prestation, que la réponse globale masquait.");
        L.push("");
      }
      L.push("  Ce que le texte lu commande, et ce qu'il ne commande pas : L. 2312-78 dit au");
      L.push("  bénéfice de qui ces activités sont établies — les salariés, leur famille,");
      L.push("  les stagiaires. Il ne dit rien d'une condition d'ancienneté, ni pour, ni");
      L.push("  contre. Ce qui se joue est donc ceci : une condition d'ancienneté FERME");
      L.push("  L'ACCÈS À DES BÉNÉFICIAIRES QUE LE TEXTE VISE, et la décision qui l'institue");
      L.push("  peut être remise en cause. Aucune peine n'est encourue de ce chef ; c'est la");
      L.push("  décision, et les refus qu'elle a fondés, qui sont fragiles.");
      L.push("");

      titre(L, "1 — Le recensement, prestation par prestation");
      L.push("La nomenclature de R. 2312-35 sert de grille : elle énumère ce que sont les");
      L.push("activités sociales et culturelles, et elle a l'avantage de ne rien laisser de");
      L.push("côté. « Les activités sociales et culturelles établies dans l'entreprise au");
      L.push("bénéfice des salariés OU ANCIENS SALARIÉS de l'entreprise ET DE LEUR FAMILLE");
      L.push("comprennent : »");
      L.push("");
      L.push("  ┌────────────────────────────────────────┬───────────┬──────────────────┐");
      L.push("  │ Catégorie (R. 2312-35)                 │ Ancienneté│ Prestations      │");
      L.push("  │                                        │ exigée ?  │ concernées       │");
      L.push("  ├────────────────────────────────────────┼───────────┼──────────────────┤");
      L.push("  │ 1° Institutions sociales de prévoyance │ [oui/non] │ [ ]              │");
      L.push("  │    et d'entraide — institutions de     │ [durée]   │                  │");
      L.push("  │    retraites, sociétés de secours      │           │                  │");
      L.push("  │    mutuels                             │           │                  │");
      L.push("  ├────────────────────────────────────────┼───────────┼──────────────────┤");
      L.push("  │ 2° Activités tendant à l'amélioration  │ [oui/non] │ [ ]              │");
      L.push("  │    des conditions de bien-être —       │ [durée]   │                  │");
      L.push("  │    cantines, coopératives de           │           │                  │");
      L.push("  │    consommation, logements, jardins    │           │                  │");
      L.push("  │    familiaux, crèches, colonies de     │           │                  │");
      L.push("  │    vacances                            │           │                  │");
      L.push("  ├────────────────────────────────────────┼───────────┼──────────────────┤");
      L.push("  │ 3° Activités ayant pour objet          │ [oui/non] │ [ ]              │");
      L.push("  │    l'utilisation des loisirs et        │ [durée]   │                  │");
      L.push("  │    l'organisation sportive             │           │                  │");
      L.push("  ├────────────────────────────────────────┼───────────┼──────────────────┤");
      L.push("  │ 4° Institutions d'ordre professionnel  │ [oui/non] │ [ ]              │");
      L.push("  │    ou éducatif attachées à l'entreprise│ [durée]   │                  │");
      L.push("  │    ou dépendant d'elle — centres       │           │                  │");
      L.push("  │    d'apprentissage et de formation     │           │                  │");
      L.push("  │    professionnelle, bibliothèques,     │           │                  │");
      L.push("  │    cercles d'études, cours de culture  │           │                  │");
      L.push("  │    générale                            │           │                  │");
      L.push("  ├────────────────────────────────────────┼───────────┼──────────────────┤");
      L.push("  │ 5° Services sociaux chargés a) de      │ [oui/non] │ [ ]              │");
      L.push("  │    veiller au bien-être du salarié     │ [durée]   │                  │");
      L.push("  │    dans l'entreprise, de faciliter son │           │                  │");
      L.push("  │    adaptation à son travail et de      │           │                  │");
      L.push("  │    collaborer avec le service de santé │           │                  │");
      L.push("  │    au travail ; b) de coordonner et de │           │                  │");
      L.push("  │    promouvoir les réalisations sociales│           │                  │");
      L.push("  │    décidées par le comité et par       │           │                  │");
      L.push("  │    l'employeur                         │           │                  │");
      L.push("  ├────────────────────────────────────────┼───────────┼──────────────────┤");
      L.push("  │ 6° Le service de santé au travail      │ [oui/non] │ [ ]              │");
      L.push("  │    institué dans l'entreprise          │ [durée]   │                  │");
      L.push("  └────────────────────────────────────────┴───────────┴──────────────────┘");
      L.push("");
      L.push("  Pièce à joindre : le règlement des activités sociales du comité, ou à défaut");
      L.push("  les délibérations et notes qui fixent les conditions d'accès de chaque");
      L.push("  prestation. Une condition d'ancienneté vit rarement dans un seul document.");
      L.push("");
      L.push("  DEUX VÉRIFICATIONS QUI SE PERDENT TOUJOURS");
      L.push("");
      L.push("  · LES STAGIAIRES. L. 2312-78 les vise expressément, aux côtés des salariés et");
      L.push("    de leur famille. Une condition d'ancienneté les exclut par construction,");
      L.push("    puisqu'un stage est bref. Vérifiez prestation par prestation.");
      L.push("       Les stagiaires ont-ils accès aux activités sociales ? ... [oui / non]");
      L.push("");
      L.push("  · LES ANCIENS SALARIÉS ET LA FAMILLE. R. 2312-35 ouvre son énumération par");
      L.push("    les activités établies « au bénéfice des salariés OU ANCIENS SALARIÉS de");
      L.push("    l'entreprise ET DE LEUR FAMILLE ». Vérifiez que votre règlement ne les a");
      L.push("    pas perdus en route.");
      L.push("       Les ayants droit familiaux sont-ils admis ? ............. [oui / non]");
      L.push("");

      titre(L, "2 — La délibération du comité");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Réunion du [DATE] · point [n°] de l'ordre du jour");
      L.push("");
      L.push("DÉLIBÉRATION — SUPPRESSION DE LA CONDITION D'ANCIENNETÉ D'ACCÈS AUX ACTIVITÉS");
      L.push("SOCIALES ET CULTURELLES");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ",");
      L.push("");
      L.push("VU l'article L. 2312-78 du code du travail, aux termes duquel il assure,");
      L.push("contrôle ou participe à la gestion de toutes les activités sociales et");
      L.push("culturelles établies dans l'entreprise prioritairement au bénéfice des");
      L.push("salariés, de leur famille et des stagiaires ;");
      L.push("VU l'article R. 2312-35, qui énumère ces activités ;");
      L.push("VU le recensement annexé, qui identifie les prestations dont l'accès était");
      L.push("subordonné à une condition d'ancienneté de [durée] ;");
      L.push("");
      L.push("DÉCIDE :");
      L.push("");
      L.push("Article 1 — La condition d'ancienneté de [durée] qui subordonnait l'accès aux");
      L.push("prestations suivantes est SUPPRIMÉE, à compter du [DATE D'EFFET] :");
      L.push("     · [prestation] ;");
      L.push("     · [prestation] ;");
      L.push("     · [prestation].");
      L.push("");
      L.push("Article 2 — Ont accès aux activités sociales et culturelles du comité, sans");
      L.push("condition d'ancienneté : les salariés de l'entreprise, LES STAGIAIRES, et");
      L.push("[préciser les autres bénéficiaires retenus : la famille des salariés, les");
      L.push("anciens salariés — R. 2312-35 vise les uns et les autres].");
      L.push("");
      L.push("Article 3 — [Le cas échéant : les modalités d'attribution, notamment les");
      L.push("critères de modulation retenus par le comité, sont maintenues. Attention :");
      L.push("l'application ne se prononce pas ici sur la licéité d'un critère de");
      L.push("modulation, qui est une question distincte de celle de l'ancienneté et que le");
      L.push("texte lu ne tranche pas. Faites-la examiner.]");
      L.push("");
      L.push("Article 4 — Les demandes refusées sur le fondement de la condition supprimée,");
      L.push("depuis le [DATE], sont reprises d'office selon les modalités du paragraphe 3.");
      L.push("");
      L.push("Article 5 — La présente délibération est portée à la connaissance des salariés");
      L.push("par la note figurant au paragraphe 4, et le règlement des activités sociales");
      L.push("est modifié en conséquence.");
      L.push("");
      L.push("La délibération est adoptée À LA MAJORITÉ DES MEMBRES PRÉSENTS ; le président");
      L.push("ne participe pas au vote lorsqu'il consulte les membres élus du comité en tant");
      L.push("que délégation du personnel (L. 2315-32).");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention.");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");
      L.push("La délibération est consignée au procès-verbal établi par le secrétaire du");
      L.push("comité (L. 2315-34) ; le procès-verbal peut, après adoption, être affiché ou");
      L.push("diffusé dans l'entreprise par le secrétaire (L. 2315-35).");
      L.push("");

      titre(L, "3 — La reprise des demandes refusées");
      L.push("Supprimer la condition pour l'avenir laisse debout les refus qu'elle a");
      L.push("fondés. Ce sont eux qui feront le contentieux, pas la clause.");
      L.push("");
      L.push("  RELEVÉ DES REFUS");
      L.push("");
      L.push("     Date · demandeur · prestation · motif du refus · suite donnée");
      L.push("     [ ] · [ ] · [ ] · condition d'ancienneté · [reprise / sans objet]");
      L.push("     [ ] · [ ] · [ ] · condition d'ancienneté · [reprise / sans objet]");
      L.push("");
      L.push("  Période couverte : du [DATE] au [DATE]. [Fixez cette période avec le comité.");
      L.push("  Aucun texte lu n'en détermine l'étendue : c'est une décision de gestion, et");
      L.push("  elle se motive.]");
      L.push("");
      L.push("  Pour chaque refus repris : la prestation est-elle encore attribuable");
      L.push("  aujourd'hui — un séjour passé ne se rattrape pas —, et sinon, que propose le");
      L.push("  comité à la place ? [à décider par le comité, qui gère.]");
      L.push("");

      titre(L, "4 — La note d'information au personnel");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("NOTE AU PERSONNEL — " + leJour(d0));
      L.push("");
      L.push("Objet : accès aux activités sociales et culturelles — suppression de la");
      L.push("condition d'ancienneté");
      L.push("");
      L.push("Le comité social et économique a décidé, par une délibération du [DATE], de");
      L.push("supprimer la condition d'ancienneté de [durée] qui subordonnait l'accès aux");
      L.push("prestations suivantes : [liste].");
      L.push("");
      L.push("À compter du [DATE D'EFFET], ont accès à ces prestations, sans condition");
      L.push("d'ancienneté :");
      L.push("");
      L.push("  · l'ensemble des salariés de l'entreprise, quelle que soit la date de leur");
      L.push("    entrée et la nature de leur contrat ;");
      L.push("  · LES STAGIAIRES accueillis dans l'entreprise ;");
      L.push("  · [le cas échéant : les ayants droit familiaux, les anciens salariés].");
      L.push("");
      L.push("Les demandes qui ont été refusées depuis le [DATE] au seul motif de");
      L.push("l'ancienneté sont reprises. Si vous êtes dans ce cas, vous n'avez aucune");
      L.push("démarche à faire : [préciser — le comité vous recontacte / adressez-vous à");
      L.push("[qui] avant le [DATE]].");
      L.push("");
      L.push("Le règlement des activités sociales et culturelles, modifié en conséquence,");
      L.push("est consultable [où].");
      L.push("");
      L.push("Le secrétaire du comité,");
      L.push("[nom]");
      L.push("");

      courrier(L, 1, "inscription du point à l'ordre du jour", [
        "L'ordre du jour est établi par le président ET le secrétaire (L. 2315-29). La",
        "décision appartenant au comité, ce courrier ne la prend pas : il la provoque.",
      ]);
      papier(L, ctx, ["À l'attention du secrétaire",
                      "du comité social et économique"]);
      L.push("Objet : inscription à l'ordre du jour — conditions d'accès aux activités");
      L.push("sociales et culturelles");
      L.push("");
      L.push("Monsieur le Secrétaire, [ou Madame la Secrétaire]");
      L.push("");
      L.push("Le recensement des prestations servies par le comité fait apparaître que");
      L.push("l'accès à [prestations] est subordonné à une condition d'ancienneté de");
      L.push("[durée].");
      L.push("");
      L.push("L'article L. 2312-78 du code du travail établit ces activités prioritairement");
      L.push("au bénéfice des salariés, de leur famille et des stagiaires. La gestion de ces");
      L.push("activités appartenant au comité, il lui revient de délibérer sur le maintien");
      L.push("ou la suppression de cette condition.");
      L.push("");
      L.push("Je vous propose d'inscrire ce point à l'ordre du jour de la réunion du [DATE]");
      L.push("et vous adresse le recensement ainsi qu'un projet de délibération.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Monsieur le Secrétaire, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : recensement des prestations · projet de délibération · projet");
      L.push("de note au personnel.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous ouvrez le recensement du paragraphe 1 sur le",
        "règlement des activités sociales. Six lignes à remplir : c'est la grille de",
        "R. 2312-35, et elle est faite pour qu'aucune prestation ne passe au travers.",
        "",
        "Dans la semaine, soit le " + leJour(dans(d0, 7)) + " — courrier 1 au secrétaire, pour",
        "l'inscription à l'ordre du jour (L. 2315-29).",
        "",
        "À la réunion suivante — le comité délibère, à la majorité des membres présents,",
        "le président ne votant pas (L. 2315-32). C'est LE COMITÉ qui décide : une note de",
        "la direction ne remplacerait pas cette délibération.",
        "",
        "Le lendemain de la délibération — la note au personnel est diffusée et le",
        "règlement des activités sociales est modifié. Une délibération non publiée ne",
        "change rien pour celui qui s'est vu opposer la condition.",
        "",
        "Dans le mois qui suit, soit avant le " + leJour(dans(d0, 60)) + " — la reprise des demandes",
        "refusées est achevée. C'est la partie la plus longue, et la seule qui",
        "intéresse vraiment ceux qui ont été écartés.",
        "",
        "À chaque nouvelle prestation créée par le comité — reprenez la grille du",
        "paragraphe 1. Les conditions d'ancienneté reviennent par le règlement d'une",
        "prestation nouvelle, jamais par la porte principale.",
      ]);

      return pied(L,
        ["L. 2312-78", "L. 2315-29", "L. 2315-32", "L. 2315-34", "L. 2315-35", "R. 2312-35"],
        ["le décret en Conseil d'État déterminant les conditions de gestion des activités sociales et culturelles, la délégation des pouvoirs du comité à des organismes créés par lui, et les règles d'octroi et d'étendue de la personnalité civile (visé par L. 2312-78)"]);
    },
  });

  /* ────────────────────────────────────────────────────────────────────────
     LES EXPERTISES
     ──────────────────────────────────────────────────────────────────────── */

  /* Les quatre documents d'expertise partagent une même erreur de départ, qu'il
     faut écrire une fois : on croit que la répartition des frais dépend de ce
     que l'expert a fait, alors qu'elle dépend du CAS DE RECOURS sur lequel la
     délibération est fondée. Tout part de la délibération. */
  function casDeRecours(L) {
    L.push("  LES CAS DE RECOURS, tels que les textes lus les énoncent :");
    L.push("");
    L.push("  · L. 2315-87 — recours à un EXPERT-COMPTABLE en vue de la consultation sur");
    L.push("    les ORIENTATIONS STRATÉGIQUES de l'entreprise (1° de L. 2312-17) ;");
    L.push("  · L. 2315-88 — expert-comptable en vue de la consultation sur la SITUATION");
    L.push("    ÉCONOMIQUE ET FINANCIÈRE (2° de L. 2312-17) ;");
    L.push("  · L. 2315-91 — expert-comptable dans le cadre de la consultation sur la");
    L.push("    POLITIQUE SOCIALE, LES CONDITIONS DE TRAVAIL ET L'EMPLOI (3° de");
    L.push("    L. 2312-17) ;");
    L.push("  · L. 2315-92, I — expert-comptable : 1° opérations de CONCENTRATION");
    L.push("    (L. 2312-41) ; 2° exercice du DROIT D'ALERTE ÉCONOMIQUE (L. 2312-63 et");
    L.push("    suivants) ; 3° LICENCIEMENTS COLLECTIFS pour motif économique (L. 1233-34");
    L.push("    et suivants) ; 4° OFFRES PUBLIQUES D'ACQUISITION (L. 2312-42 à L. 2312-52).");
    L.push("    Le II ajoute le mandat donné à un expert-comptable pour apporter toute");
    L.push("    analyse utile aux organisations syndicales en vue des négociations prévues");
    L.push("    aux articles L. 2254-2 et L. 1233-24-1 ; dans ce dernier cas, l'expert est");
    L.push("    le même que celui désigné au titre du 3° du I ;");
    L.push("  · L. 2315-94 — EXPERT HABILITÉ : 1° lorsqu'un RISQUE GRAVE, IDENTIFIÉ ET");
    L.push("    ACTUEL, révélé ou non par un accident du travail, une maladie");
    L.push("    professionnelle ou à caractère professionnel, est constaté dans");
    L.push("    l'établissement ; 2° en cas d'INTRODUCTION DE NOUVELLES TECHNOLOGIES ou de");
    L.push("    PROJET IMPORTANT modifiant les conditions de santé et de sécurité ou les");
    L.push("    conditions de travail, prévus au 4° du II de L. 2312-8 ; 3° dans les");
    L.push("    entreprises D'AU MOINS TROIS CENTS SALARIÉS, en vue de préparer la");
    L.push("    NÉGOCIATION SUR L'ÉGALITÉ PROFESSIONNELLE ;");
    L.push("  · L. 2315-81 — par DÉROGATION aux articles L. 2315-78 et L. 2315-80, le");
    L.push("    comité peut faire appel à TOUT TYPE D'EXPERTISE RÉMUNÉRÉE PAR SES SOINS");
    L.push("    pour la préparation de ses travaux. C'est l'expertise dite libre : elle est");
    L.push("    intégralement à sa charge, et c'est le prix de sa liberté.");
    L.push("");
  }

  DP.ajouter("CSE-CTL-EXP-01", {
    nom: "La note de répartition du financement de l'expertise, la lettre d'encadrement du recours et la régularisation des paiements",
    detail: "La qualification du cas de recours, le tableau de répartition selon les 1°, " +
            "2° et 3° de L. 2315-80, le calcul chiffré des deux parts, la condition du 3° " +
            "et sa conséquence sur trois ans, la lettre à l'expert et le courrier de " +
            "rectification au trésorier.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var e = objet(f.expertise);
      var cas = e.cas ? String(e.cas) : null;
      var part = nb(e.partEmployeur);
      var L = [];

      L = L.concat(entete(ctx, "Répartition du financement de l'expertise",
        "article L. 2315-80 du code du travail"));
      usage(L);

      L.push("LE PRINCIPE, ET L'ERREUR QU'IL CORRIGE");
      L.push("");
      L.push("« LORSQUE LE COMITÉ SOCIAL ET ÉCONOMIQUE DÉCIDE DU RECOURS À L'EXPERTISE, les");
      L.push("frais d'expertise sont pris en charge : … » (L. 2315-80). La répartition suit");
      L.push("donc LE CAS DE RECOURS sur lequel la délibération du comité est fondée — et");
      L.push("non la nature du rapport rendu, ni le sujet que l'expert a finalement traité,");
      L.push("ni ce qui a été discuté en séance.");
      L.push("");
      L.push("D'où l'ordre de ce document : on qualifie d'abord, on répartit ensuite.");
      L.push("");
      L.push("Ce qui se joue : une répartition erronée n'expose à aucune peine. Elle expose");
      L.push("à ceci — une facture payée par celui qui ne la devait pas, qui se réclame ; et");
      L.push("surtout, dans le cas du 3°, TROIS ANNÉES PENDANT LESQUELLES LE COMITÉ NE PEUT");
      L.push("PLUS TRANSFÉRER D'EXCÉDENT de son budget de fonctionnement vers les activités");
      L.push("sociales et culturelles (L. 2315-61). Cette conséquence-là se paie longtemps.");
      L.push("");

      titre(L, "1 — La qualification du cas de recours");
      L.push("  Cas de recours déclaré au dossier ......... " +
        (cas ? cas : "[À QUALIFIER — reportez-vous à la délibération du comité]"));
      L.push("  Délibération du comité du ................. [DATE]");
      L.push("  Fondement visé par la délibération ........ [article visé]");
      L.push("");
      L.push("  Si la délibération ne vise aucun article, c'est le premier problème à");
      L.push("  traiter : sans fondement visé, la répartition ne peut pas être établie et la");
      L.push("  délibération elle-même est fragile. Le document CSE-CTL-EXP-03 de ce module");
      L.push("  la reprend.");
      L.push("");
      casDeRecours(L);

      titre(L, "2 — La règle de répartition, article en main");
      L.push("L'article L. 2315-80 pose trois règles, et une seule s'applique :");
      L.push("");
      L.push("  1° À LA CHARGE DE L'EMPLOYEUR, pour les consultations prévues par les");
      L.push("     articles L. 2315-88, L. 2315-91, au 3° de l'article L. 2315-92 et au 1°");
      L.push("     de l'article L. 2315-94, ainsi qu'au 3° du même article L. 2315-94 EN");
      L.push("     L'ABSENCE DE TOUT INDICATEUR relatif à l'égalité professionnelle prévu à");
      L.push("     l'article L. 2312-18.");
      L.push("");
      L.push("     Soit, en clair : la situation économique et financière, la politique");
      L.push("     sociale, le licenciement collectif pour motif économique, le risque grave");
      L.push("     — et la préparation de la négociation sur l'égalité professionnelle, mais");
      L.push("     seulement s'il n'existe AUCUN indicateur d'égalité professionnelle dans la");
      L.push("     base de données économiques, sociales et environnementales.");
      L.push("");
      L.push("  2° PAR LE COMITÉ, SUR SON BUDGET DE FONCTIONNEMENT, À HAUTEUR DE 20 %, ET");
      L.push("     PAR L'EMPLOYEUR À HAUTEUR DE 80 %, concernant la consultation prévue à");
      L.push("     l'article L. 2315-87 — les orientations stratégiques — ET LES");
      L.push("     CONSULTATIONS PONCTUELLES hors celles visées au deuxième alinéa.");
      L.push("");
      L.push("  3° PAR L'EMPLOYEUR, concernant les consultations mentionnées au 2°, LORSQUE");
      L.push("     LE BUDGET DE FONCTIONNEMENT DU COMITÉ EST INSUFFISANT pour couvrir le coût");
      L.push("     de l'expertise ET N'A PAS DONNÉ LIEU À UN TRANSFERT D'EXCÉDENT ANNUEL au");
      L.push("     budget destiné aux activités sociales et culturelles prévu à l'article");
      L.push("     L. 2312-84 AU COURS DES TROIS ANNÉES PRÉCÉDENTES.");
      L.push("");
      L.push("     Les deux conditions du 3° sont CUMULATIVES : budget insuffisant ET absence");
      L.push("     de transfert sur trois ans. Un seul transfert dans les trois années");
      L.push("     précédentes suffit à faire tomber le 3°, et la part de 20 % reste alors");
      L.push("     à la charge du comité.");
      L.push("");
      L.push("  ET, HORS DE CES TROIS RÈGLES — l'expertise libre de L. 2315-81, rémunérée");
      L.push("  par le comité seul, « par dérogation aux articles L. 2315-78 et L. 2315-80 ».");
      L.push("");

      titre(L, "3 — Le calcul, chiffré");
      L.push("  A — COÛT DE L'EXPERTISE ................ [COÛT — hors taxes ou toutes taxes");
      L.push("      comprises : dites-le, et gardez la même base d'un bout à l'autre.");
      L.push("      Source : cahier des charges de l'expert, puis facture]");
      L.push("");
      L.push("  B — RÈGLE APPLICABLE (cochez UNE case) :");
      L.push("");
      L.push("     [ ] 1° de L. 2315-80 — intégralement à la charge de l'employeur");
      L.push("            Employeur : [A] · Comité : 0 €");
      L.push("");
      L.push("     [ ] 2° de L. 2315-80 — 80 % employeur, 20 % comité");
      L.push("            Employeur = [A] × 0,80 = [ ] €");
      L.push("            Comité ... = [A] × 0,20 = [ ] € — sur le BUDGET DE FONCTIONNEMENT,");
      L.push("            et sur lui seul : le budget des activités sociales et culturelles");
      L.push("            n'a pas à financer une expertise.");
      L.push("");
      L.push("            Exemple de lecture, pour vérifier la mécanique : pour un coût de");
      L.push("            10 000 €, l'employeur doit 8 000 € et le comité 2 000 €.");
      L.push("");
      L.push("     [ ] 3° de L. 2315-80 — intégralement à la charge de l'employeur, par");
      L.push("            exception au 2°, les deux conditions étant réunies");
      L.push("            Employeur : [A] · Comité : 0 €");
      L.push("");
      L.push("     [ ] L. 2315-81 — expertise libre : intégralement à la charge du comité");
      L.push("            Comité : [A] · Employeur : 0 €");
      L.push("");
      if (cas) {
        L.push("  CE QUE LE DOSSIER DÉCLARE — cas de recours : « " + cas + " ».");
        if (part != null) {
          L.push("  Part employeur déclarée : " + part + " %.");
          L.push("  Confrontez cette part à la règle cochée en B. Si elles diffèrent, c'est");
          L.push("  la règle qui l'emporte, et le paragraphe 5 régularise les paiements.");
        } else {
          L.push("  Aucune part employeur n'est déclarée : relevez-la sur les paiements déjà");
          L.push("  effectués avant de cocher la case B.");
        }
        L.push("");
      }
      L.push("  C — LA VÉRIFICATION DU 3°, si la case 3° est cochée");
      L.push("");
      L.push("     · Le budget de fonctionnement du comité est-il insuffisant pour couvrir");
      L.push("       le coût de l'expertise ? ......................... [oui / non]");
      L.push("       Solde du budget de fonctionnement à la date de la délibération :");
      L.push("       [ ] € — pièce : comptes du comité ou situation intermédiaire.");
      L.push("");
      L.push("     · Le comité a-t-il transféré un excédent annuel du budget de");
      L.push("       fonctionnement vers les activités sociales et culturelles au cours des");
      L.push("       TROIS ANNÉES PRÉCÉDENTES (L. 2312-84) ? ........... [oui / non]");
      L.push("");
      L.push("          Exercice [ ] ... transfert : [oui / non] · délibération du [DATE]");
      L.push("          Exercice [ ] ... transfert : [oui / non] · délibération du [DATE]");
      L.push("          Exercice [ ] ... transfert : [oui / non] · délibération du [DATE]");
      L.push("");
      L.push("       Ce sont les DÉLIBÉRATIONS DU COMITÉ qui l'établissent, pas une");
      L.push("       déclaration : demandez-les au trésorier sur trois exercices.");
      L.push("");
      L.push("     Si les deux réponses sont « oui » et « non » dans cet ordre, le 3°");
      L.push("     s'applique. Sinon, on retombe sur le 2°.");
      L.push("");

      titre(L, "4 — La conséquence du 3°, qui court sur trois ans");
      L.push("« Lorsque le financement des frais d'expertise est pris en charge par");
      L.push("l'employeur en application du 3° de l'article L. 2315-80 du présent code, LE");
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE NE PEUT PAS DÉCIDER DE TRANSFÉRER D'EXCÉDENTS DU");
      L.push("BUDGET DE FONCTIONNEMENT au financement des activités sociales et culturelles");
      L.push("PENDANT LES TROIS ANNÉES SUIVANTES » (L. 2315-61, dernier alinéa).");
      L.push("");
      L.push("  Date de la prise en charge au titre du 3° ......... [DATE]");
      L.push("  Interdiction de transfert jusqu'au ............... [DATE + 3 ans]");
      L.push("");
      L.push("  À titre indicatif, si la prise en charge intervenait aujourd'hui,");
      L.push("  " + leJour(d0) + ", l'interdiction courrait jusqu'au " +
        leJour(dans(d0, 1095)) + " environ.");
      L.push("  [Le texte dit « les trois années suivantes » sans préciser s'il s'agit");
      L.push("  d'années civiles ou d'exercices : c'est une question d'interprétation que");
      L.push("  l'application ne tranche pas. Retenez la lecture la plus prudente.]");
      L.push("");
      L.push("  À PORTER AU DOSSIER DU COMITÉ — cette interdiction pèse sur le comité, pas");
      L.push("  sur l'employeur. Elle doit donc être écrite au procès-verbal de la réunion");
      L.push("  où la prise en charge est constatée, faute de quoi un trésorier suivant");
      L.push("  délibérera un transfert que la loi lui interdit.");
      L.push("");

      titre(L, "5 — La régularisation des paiements déjà effectués");
      L.push("  RELEVÉ");
      L.push("");
      L.push("     Date · payeur · montant · pièce");
      L.push("     [ ] · [employeur / comité] · [ ] € · [facture, ordre de virement]");
      L.push("     [ ] · [employeur / comité] · [ ] € · [ ]");
      L.push("     TOTAL PAYÉ ............................ [ ] €");
      L.push("");
      L.push("  RÉPARTITION LÉGALE (paragraphe 3) ......... employeur [ ] € · comité [ ] €");
      L.push("  ÉCART À RÉGULARISER ....................... [ ] € au profit de [ ]");
      L.push("");
      L.push("  Si le comité a payé ce que l'employeur devait, l'entreprise lui rembourse");
      L.push("  la différence, sur le BUDGET DE FONCTIONNEMENT — c'est de là qu'elle est");
      L.push("  sortie. Si l'employeur a payé ce que le comité devait, la somme reste due");
      L.push("  par le comité, sauf renonciation expresse de l'entreprise, qui doit alors");
      L.push("  être écrite.");
      L.push("");
      L.push("  UN CAS QUE LE TEXTE PRÉVOIT SÉPARÉMENT — « en cas d'annulation définitive");
      L.push("  par le juge de la délibération du comité social et économique, LES SOMMES");
      L.push("  PERÇUES PAR L'EXPERT SONT REMBOURSÉES PAR CE DERNIER À L'EMPLOYEUR. Le");
      L.push("  comité social et économique peut, à tout moment, décider de les prendre en");
      L.push("  charge » (L. 2315-86, dernier alinéa). Ce n'est pas la même chose qu'une");
      L.push("  mauvaise répartition : c'est le sort des sommes après annulation.");
      L.push("");

      courrier(L, 1, "lettre encadrant le recours à l'expert", [
        "À adresser à l'expert désigné, dès sa désignation. Elle ne décide rien — le",
        "comité a décidé — mais elle fixe par écrit ce dont la suite dépendra : le cas de",
        "recours, la répartition, et les délais que les textes imposent à l'expert.",
      ]);
      papier(L, ctx, ["À l'attention de [cabinet / expert désigné]",
                      "[adresse]"]);
      L.push("Objet : expertise décidée par le comité social et économique le [DATE] —");
      L.push("cadre du recours et financement");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + " vous a désigné, par une");
      L.push("délibération du [DATE], au titre de [cas de recours et article visé].");
      L.push("");
      L.push("1. FINANCEMENT. En application de l'article L. 2315-80 du code du travail, les");
      L.push("frais de cette expertise sont pris en charge [intégralement par l'employeur /");
      L.push("à hauteur de 80 % par l'employeur et de 20 % par le comité sur son budget de");
      L.push("fonctionnement], soit [ ] € et [ ] € pour un coût de [ ] €. Vos factures");
      L.push("seront établies en conséquence, et adressées [préciser : à l'entreprise pour");
      L.push("sa part, au comité pour la sienne].");
      L.push("");
      L.push("2. INFORMATIONS. L'employeur vous fournit les informations nécessaires à");
      L.push("l'exercice de votre mission (L. 2315-83) et vous avez libre accès dans");
      L.push("l'entreprise pour les besoins de celle-ci (L. 2315-82). Vous demandez à");
      L.push("l'employeur, AU PLUS TARD DANS LES TROIS JOURS DE VOTRE DÉSIGNATION, toutes");
      L.push("les informations complémentaires que vous jugez nécessaires ; l'employeur y");
      L.push("répond dans les cinq jours (R. 2315-45).");
      L.push("");
      L.push("3. COÛT PRÉVISIONNEL. Vous notifiez à l'employeur le coût prévisionnel,");
      L.push("l'étendue et la durée de l'expertise DANS UN DÉLAI DE DIX JOURS À COMPTER DE");
      L.push("VOTRE DÉSIGNATION (R. 2315-46). Cette notification fait courir le délai de");
      L.push("contestation de l'employeur sur ces trois points (L. 2315-86, 3°) : sa date");
      L.push("doit être certaine.");
      L.push("");
      L.push("4. RAPPORT. Vous remettez votre rapport au plus tard quinze jours avant");
      L.push("l'expiration des délais de consultation du comité (R. 2315-47). [Le cas");
      L.push("échéant, adapter : huit jours à compter de la notification de la décision de");
      L.push("l'Autorité de la concurrence ou de la Commission européenne pour le cas du 1°");
      L.push("de L. 2315-92 ; deux mois à compter de la désignation, renouvelables une fois");
      L.push("pour deux mois par accord, hors ces cas.]");
      L.push("");
      L.push("5. SECRET. Vous êtes tenu aux obligations de secret et de discrétion définies");
      L.push("à l'article L. 2315-3 (L. 2315-84).");
      L.push("");
      L.push("[Le cas échéant, pour une expertise de L. 2315-94 : votre habilitation est une");
      L.push("certification justifiant de vos compétences, délivrée par un organisme");
      L.push("certificateur accrédité (R. 2315-51). Merci de nous en adresser copie.]");
      L.push("");
      salutation(L, ctx);
      L.push("");

      courrier(L, 2, "au trésorier du comité — rectification de la répartition", [
        "À adresser quand la répartition appliquée n'était pas la bonne.",
      ]);
      papier(L, ctx, ["À l'attention du trésorier",
                      "du comité social et économique"]);
      L.push("Objet : expertise du [DATE] — rectification de la répartition des frais");
      L.push("");
      L.push("Madame, Monsieur le Trésorier,");
      L.push("");
      L.push("L'expertise décidée par le comité le [DATE] a été engagée au titre de [cas de");
      L.push("recours]. L'article L. 2315-80 du code du travail en met les frais [à la");
      L.push("charge de l'employeur / à la charge du comité à hauteur de 20 % et de");
      L.push("l'employeur à hauteur de 80 %].");
      L.push("");
      L.push("Or les paiements effectués s'établissent à [ ] € pour l'entreprise et [ ] €");
      L.push("pour le comité, soit un écart de [ ] € par rapport à cette répartition.");
      L.push("");
      L.push("[Je procède donc au remboursement de [ ] € au budget de fonctionnement du");
      L.push("comité. / Je vous prie de bien vouloir procéder au versement de [ ] € au");
      L.push("titre de la part revenant au comité.]");
      L.push("");
      L.push("[Le cas échéant : je vous rappelle que, la prise en charge étant intervenue en");
      L.push("application du 3° de l'article L. 2315-80, le comité ne peut pas décider de");
      L.push("transférer d'excédents de son budget de fonctionnement au financement des");
      L.push("activités sociales et culturelles pendant les trois années suivantes");
      L.push("(L. 2315-61). Il convient d'en porter mention au procès-verbal.]");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Madame, Monsieur le Trésorier, l'expression de ma considération distinguée.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous reprenez la DÉLIBÉRATION du comité et vous notez le",
        "cas de recours qu'elle vise. Tout part de là : sans elle, aucune case du",
        "paragraphe 3 ne peut être cochée honnêtement.",
        "",
        "Dans les trois jours de la désignation — l'expert demande ses informations",
        "complémentaires (R. 2315-45) ; l'employeur répond dans les cinq jours. Partie",
        "aujourd'hui, une désignation appellerait la demande avant le " + leJour(dans(d0, 3)) + " et la",
        "réponse avant le " + leJour(dans(d0, 8)) + ".",
        "",
        "Dans les dix jours de la désignation — l'expert notifie le coût prévisionnel,",
        "l'étendue et la durée (R. 2315-46), soit avant le " + leJour(dans(d0, 10)) + " pour une",
        "désignation de ce jour. C'est à cette notification que se raccroche le délai de",
        "contestation du 3° de L. 2315-86 : le document CSE-CTL-EXP-02 le calcule.",
        "",
        "AVANT TOUT PAIEMENT — la répartition se fixe. Une facture payée s'annule mal ;",
        "une répartition écrite avant paiement ne se discute plus.",
        "",
        "Si le 3° s'applique — inscrivez au procès-verbal du comité, le jour même,",
        "l'interdiction de transfert pour les trois années suivantes (L. 2315-61). C'est",
        "la seule chose de ce document qui produira encore ses effets dans trois ans.",
      ]);

      return pied(L,
        ["L. 2312-8", "L. 2312-17", "L. 2312-18", "L. 2312-41", "L. 2312-63",
         "L. 2312-84", "L. 2315-3", "L. 2315-61", "L. 2315-78", "L. 2315-80",
         "L. 2315-81", "L. 2315-82", "L. 2315-83", "L. 2315-84", "L. 2315-86",
         "L. 2315-87", "L. 2315-88", "L. 2315-91", "L. 2315-92", "L. 2315-94",
         "R. 2315-45", "R. 2315-46", "R. 2315-47", "R. 2315-51"],
        ["L. 2254-2 et L. 1233-24-1 (négociations pour lesquelles le II de L. 2315-92 permet de mandater l'expert-comptable)"]);
    },
  });

  DP.ajouter("CSE-CTL-EXP-02", {
    nom: "La contestation de l'expertise devant le président du tribunal judiciaire : le calendrier des délais, l'acte et ses mentions",
    detail: "Le tableau des quatre points de départ de L. 2315-86, le calcul du dixième " +
            "jour, l'écrit de saisine du président du tribunal judiciaire avec ses " +
            "mentions, l'effet suspensif, et ce qu'il faut faire quand le délai est expiré.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var e = objet(f.expertise);
      var objetC = e.objetContestation ? String(e.objetContestation) : null;
      var dep = dateDe(e.dateDepart);
      var sais = dateDe(e.dateSaisine);
      var limite = dep ? dans(dep, 10) : null;
      var ecart = (dep && sais) ? Math.round((sais - dep) / 86400000) : null;
      var L = [];

      L = L.concat(entete(ctx, "Contestation de l'expertise devant le président du tribunal judiciaire",
        "articles L. 2315-86, R. 2315-49 et R. 2315-50 du code du travail"));
      usage(L);

      L.push("DIX JOURS, ET QUATRE POINTS DE DÉPART DIFFÉRENTS");
      L.push("");
      L.push("« Pour chacun des cas de recours prévus à l'article L. 2315-86, l'employeur");
      L.push("saisit le juge DANS UN DÉLAI DE DIX JOURS » (R. 2315-49). Le délai est le");
      L.push("même dans les quatre cas ; c'est le POINT DE DÉPART qui change, et c'est là");
      L.push("que les contestations se perdent : on compte à partir de la réunion où le");
      L.push("sujet a été évoqué, au lieu de compter à partir de l'acte que le texte");
      L.push("désigne.");
      L.push("");
      L.push("Passé ce délai, la contestation n'est plus recevable, et la délibération du");
      L.push("comité s'impose. Aucune peine n'est en jeu : ce qui est en jeu, c'est le droit");
      L.push("de discuter l'expertise, qui s'éteint.");
      L.push("");

      titre(L, "1 — Que conteste-t-on ? Le tableau des quatre cas");
      L.push("L'article L. 2315-86 énumère quatre objets, et rattache à chacun son point de");
      L.push("départ. « Sauf dans le cas prévu à l'article L. 1233-35-1, l'employeur saisit");
      L.push("le juge judiciaire dans un délai fixé par décret en Conseil d'État de : »");
      L.push("");
      L.push("  ┌────┬─────────────────────────────┬──────────────────────────────────────┐");
      L.push("  │ N° │ Ce qui est contesté         │ Le délai court à compter de…         │");
      L.push("  ├────┼─────────────────────────────┼──────────────────────────────────────┤");
      L.push("  │ 1° │ LA NÉCESSITÉ de l'expertise │ la DÉLIBÉRATION du comité décidant   │");
      L.push("  │    │                             │ le recours à l'expertise             │");
      L.push("  ├────┼─────────────────────────────┼──────────────────────────────────────┤");
      L.push("  │ 2° │ LE CHOIX DE L'EXPERT        │ la DÉSIGNATION de l'expert par le    │");
      L.push("  │    │                             │ comité                               │");
      L.push("  ├────┼─────────────────────────────┼──────────────────────────────────────┤");
      L.push("  │ 3° │ LE COÛT PRÉVISIONNEL,       │ la NOTIFICATION à l'employeur du     │");
      L.push("  │    │ L'ÉTENDUE ou LA DURÉE       │ cahier des charges et des            │");
      L.push("  │    │                             │ informations prévues à L. 2315-81-1  │");
      L.push("  ├────┼─────────────────────────────┼──────────────────────────────────────┤");
      L.push("  │ 4° │ LE COÛT FINAL               │ la NOTIFICATION à l'employeur du     │");
      L.push("  │    │                             │ coût final de l'expertise            │");
      L.push("  └────┴─────────────────────────────┴──────────────────────────────────────┘");
      L.push("");
      L.push("  L'article L. 2315-81-1, auquel le 3° renvoie pour le contenu des");
      L.push("  informations notifiées, N'A PAS ÉTÉ LU par l'application : il est nommé ici,");
      L.push("  et son contenu n'est ni reproduit ni paraphrasé. Reportez-vous-y pour savoir");
      L.push("  ce que la notification doit comporter — c'est de sa complétude que dépend le");
      L.push("  point de départ.");
      L.push("");
      L.push("  De même, l'article L. 1233-35-1, que L. 2315-86 réserve dès sa première");
      L.push("  ligne, n'a pas été lu : vérifiez si votre situation en relève AVANT de");
      L.push("  compter dix jours.");
      L.push("");
      L.push("  Objet de la contestation, au dossier ....... " +
        (objetC ? objetC : "[À DÉTERMINER — cochez l'une des quatre lignes ci-dessus]"));
      L.push("");
      L.push("  UNE CONTESTATION, UN OBJET, UN POINT DE DÉPART. Si vous contestez à la fois");
      L.push("  la nécessité et le coût prévisionnel, ce sont DEUX délais distincts qui");
      L.push("  courent depuis deux actes distincts. Ne les confondez pas dans un seul");
      L.push("  calcul.");
      L.push("");

      titre(L, "2 — Le calcul du délai");
      L.push("  Acte qui fait courir le délai ....... [délibération / désignation /");
      L.push("                                        notification], en date du " +
        (dep ? leJour(dep) : "[DATE]"));
      L.push("  Pièce qui l'établit ................. [procès-verbal, courrier de");
      L.push("                                        notification, accusé de réception]");
      L.push("");
      if (dep) {
        L.push("  DÉLAI DE DIX JOURS (R. 2315-49) — dernier jour utile : " + leJour(limite) + ".");
      } else {
        L.push("  DÉLAI DE DIX JOURS (R. 2315-49) — dernier jour utile : [date de l'acte");
        L.push("  + 10 jours].");
      }
      L.push("");
      L.push("  COMPUTATION — le module retient que le délai exprimé en jours ne commence à");
      L.push("  courir QUE LE LENDEMAIN de l'acte qui le fait courir, par application des");
      L.push("  ARTICLES 641 ET 642 DU CODE DE PROCÉDURE CIVILE. Ces deux articles sont");
      L.push("  NOMMÉS : ils n'appartiennent pas au code du travail et l'application ne les");
      L.push("  a pas lus. Vérifiez-les avant de compter au jour près — un jour d'écart");
      L.push("  suffit ici.");
      L.push("");
      L.push("  LA DATE DE SAISINE s'entend de celle de l'ASSIGNATION devant le président du");
      L.push("  tribunal judiciaire statuant selon la procédure accélérée au fond.");
      L.push("");
      if (dep && sais) {
        L.push("  AU DOSSIER — acte du " + leJour(dep) + ", saisine du " + leJour(sais) +
          " : " + ecart + " jour(s) d'écart.");
        L.push("  " + (ecart <= 10
          ? "L'écart n'excède pas dix jours : la saisine paraît faite dans le délai, sous"
          : "L'ÉCART EXCÈDE DIX JOURS : la contestation paraît IRRECEVABLE, sous"));
        L.push("  réserve de la computation rappelée ci-dessus et de la date exacte de");
        L.push("  l'assignation.");
        L.push("");
      } else if (dep && !sais) {
        L.push("  AU DOSSIER — l'acte de départ est daté du " + leJour(dep) + " ; aucune saisine");
        L.push("  n'est déclarée. Le dernier jour utile est le " + leJour(limite) + ".");
        L.push("");
      }

      titre(L, "3 — Si le délai est expiré");
      L.push("N'ENGAGEZ PAS UNE CONTESTATION IRRECEVABLE. Elle coûte, elle retarde, et elle");
      L.push("ne rétablit rien. Ce qu'il faut faire à la place :");
      L.push("");
      L.push("  · TENIR LA DÉLIBÉRATION POUR ACQUISE et reprendre le calendrier de la");
      L.push("    consultation. L'expertise a lieu ;");
      L.push("  · vérifier si UN AUTRE OBJET reste contestable : les quatre délais courent");
      L.push("    depuis quatre actes différents, et celui du coût final (4°) ne court");
      L.push("    qu'à compter de la notification de ce coût, donc bien après les autres ;");
      L.push("  · s'assurer que la RÉPARTITION DU FINANCEMENT est correcte : c'est un sujet");
      L.push("    distinct, qui n'est enfermé dans aucun délai de dix jours, et que le");
      L.push("    document CSE-CTL-EXP-01 de ce module traite ;");
      L.push("  · écrire au dossier POURQUOI la contestation n'a pas été engagée. Une");
      L.push("    renonciation motivée est une décision ; un silence est un oubli.");
      L.push("");
      L.push("  Note écrite au dossier : « Le délai de dix jours de l'article R. 2315-49,");
      L.push("  courant à compter de [acte] du [date], est expiré depuis le [date]. La");
      L.push("  contestation de [objet] n'est plus recevable. Il est décidé de [reprendre le");
      L.push("  calendrier de la consultation / réserver la contestation du coût final]. »");
      L.push("");
      L.push("  Signée le " + leJour(d0) + " par " + signataire(ctx) + ".");
      L.push("");

      titre(L, "4 — L'écrit de saisine, et ses mentions");
      L.push("LE JUGE COMPÉTENT — « Les contestations de l'employeur prévues à l'article");
      L.push("L. 2315-86 relèvent de la compétence DU PRÉSIDENT DU TRIBUNAL JUDICIAIRE »");
      L.push("(R. 2315-50). Il statue, dans les cas 1° à 3°, SUIVANT LA PROCÉDURE ACCÉLÉRÉE");
      L.push("AU FOND DANS LES DIX JOURS SUIVANT SA SAISINE, et sa décision N'EST PAS");
      L.push("SUSCEPTIBLE D'APPEL (L. 2315-86). « Le délai du pourvoi en cassation formé à");
      L.push("l'encontre du jugement est de dix jours à compter de sa notification »");
      L.push("(R. 2315-50).");
      L.push("");
      L.push("L'ACTE LUI-MÊME est une assignation, qui se rédige et se délivre par un");
      L.push("commissaire de justice : l'application n'en produit pas la forme, qui relève");
      L.push("du code de procédure civile qu'elle n'a pas lu. Ce qui suit est LA MATIÈRE que");
      L.push("votre conseil y fera figurer, et le rappel des mentions qui, si elles");
      L.push("manquent, feront perdre la contestation avant tout débat.");
      L.push("");
      L.push("  MENTIONS INDISPENSABLES");
      L.push("");
      L.push("  1. LES PARTIES — l'entreprise demanderesse : " + nom(ctx) + ", " +
        cro(((ctx.profil) || {}).adresse, "adresse du siège") + " ;");
      L.push("     le défendeur : LE COMITÉ SOCIAL ET ÉCONOMIQUE de " + nom(ctx) + ", pris");
      L.push("     en la personne de son secrétaire. [L'expert désigné est-il appelé à la");
      L.push("     cause ? À décider avec votre conseil : l'application ne tranche pas.]");
      L.push("");
      L.push("  2. LA JURIDICTION — Monsieur le Président du tribunal judiciaire de [ville],");
      L.push("     statuant selon la procédure accélérée au fond (R. 2315-50, L. 2315-86).");
      L.push("");
      L.push("  3. L'OBJET PRÉCIS DE LA CONTESTATION — l'un des quatre cas, et un seul par");
      L.push("     chef de demande : [la nécessité de l'expertise / le choix de l'expert /");
      L.push("     le coût prévisionnel, l'étendue ou la durée / le coût final].");
      L.push("");
      L.push("  4. L'ACTE DE DÉPART ET SA DATE — [délibération du comité du " +
        (dep ? leJour(dep) : "[date]") + " /");
      L.push("     désignation de l'expert du [date] / notification du cahier des charges et");
      L.push("     des informations de L. 2315-81-1 reçue le [date] / notification du coût");
      L.push("     final reçue le [date]], établi par [pièce]. C'EST LA MENTION QUI ÉTABLIT");
      L.push("     LA RECEVABILITÉ : sans elle, le juge ne peut pas vérifier le délai.");
      L.push("");
      L.push("  5. LE RESPECT DU DÉLAI — assignation délivrée le [date], soit dans les dix");
      L.push("     jours de l'acte de départ (R. 2315-49).");
      L.push("");
      L.push("  6. LES MOYENS — [ce que vous soutenez : selon le cas, que le fondement");
      L.push("     invoqué n'est pas réuni, que le coût prévisionnel est disproportionné à");
      L.push("     l'objet, que l'étendue excède le cas de recours, que la durée n'est pas");
      L.push("     justifiée. L'application ne rédige pas vos moyens : ils dépendent des");
      L.push("     faits, qu'elle ne connaît pas.]");
      L.push("");
      L.push("  7. LES PIÈCES — procès-verbal de la délibération · lettre de désignation ·");
      L.push("     cahier des charges et informations notifiés, avec la preuve de leur date");
      L.push("     de réception · facture ou notification du coût final · le présent");
      L.push("     calendrier.");
      L.push("");
      L.push("  8. LA DEMANDE — [annulation de la délibération / réduction du coût");
      L.push("     prévisionnel / limitation de l'étendue ou de la durée / réduction du coût");
      L.push("     final].");
      L.push("");

      titre(L, "5 — L'effet suspensif, qu'il faut mesurer avant de saisir");
      L.push("« Cette saisine SUSPEND L'EXÉCUTION DE LA DÉCISION DU COMITÉ, ainsi que LES");
      L.push("DÉLAIS DANS LESQUELS IL EST CONSULTÉ en application de l'article L. 2312-15,");
      L.push("JUSQU'À LA NOTIFICATION DU JUGEMENT » (L. 2315-86).");
      L.push("");
      L.push("Deux conséquences, et la seconde surprend toujours :");
      L.push("");
      L.push("  · l'expertise s'arrête le temps de l'instance ;");
      L.push("  · MAIS LE DÉLAI DE CONSULTATION S'ARRÊTE AUSSI. L'employeur qui conteste");
      L.push("    pour gagner du temps sur la consultation ne gagne rien : le compteur");
      L.push("    reprend à la notification du jugement, et le comité retrouve le solde de");
      L.push("    son délai d'examen.");
      L.push("");
      L.push("  Date de saisine ................. " + (sais ? leJour(sais) : "[DATE]"));
      L.push("  Délai de consultation suspendu à compter de cette date, jusqu'à la");
      L.push("  notification du jugement.");
      L.push("  Solde du délai de consultation restant à courir au jour de la saisine :");
      L.push("  [ ] jours — à calculer sur le délai applicable à votre consultation.");
      L.push("");
      L.push("  ET APRÈS — « en cas d'annulation définitive par le juge de la délibération");
      L.push("  du comité social et économique, les sommes perçues par l'expert sont");
      L.push("  remboursées par ce dernier à l'employeur. Le comité social et économique");
      L.push("  peut, à tout moment, décider de les prendre en charge » (L. 2315-86).");
      L.push("");

      courrier(L, 1, "information du comité de la saisine du juge", [
        "Aucun texte lu n'impose ce courrier. Il est là parce que l'effet suspensif joue",
        "dès la saisine : le comité et l'expert doivent savoir que l'expertise s'arrête,",
        "faute de quoi l'expert continuera de travailler et de facturer.",
      ]);
      papier(L, ctx, ["Aux membres de la délégation du personnel",
                      "du comité social et économique",
                      "Copie : [expert désigné]"]);
      L.push("Objet : saisine du président du tribunal judiciaire — contestation de");
      L.push("l'expertise décidée le [DATE]");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Par acte du [DATE], l'entreprise a saisi le président du tribunal judiciaire");
      L.push("de [ville], statuant selon la procédure accélérée au fond, aux fins de");
      L.push("contester [objet de la contestation], sur le fondement du [1° / 2° / 3° / 4°]");
      L.push("de l'article L. 2315-86 du code du travail.");
      L.push("");
      L.push("Conformément au même article, cette saisine suspend l'exécution de la décision");
      L.push("du comité ainsi que les délais dans lesquels il est consulté en application de");
      L.push("l'article L. 2312-15, jusqu'à la notification du jugement. Les travaux");
      L.push("d'expertise sont donc suspendus à compter de ce jour.");
      L.push("");
      L.push("Le juge statue dans les dix jours suivant sa saisine et sa décision n'est pas");
      L.push("susceptible d'appel. Je vous tiendrai informés de sa notification, à compter de");
      L.push("laquelle les délais reprendront leur cours.");
      L.push("");
      salutation(L, ctx);
      L.push("Pièce jointe : copie de l'acte de saisine.");

      calendrier(L, (function () {
        var base = dep || d0;
        var l = [];
        l.push("Le point de départ — " + (dep ? "l'acte est daté du " + leJour(dep) + "."
          : "à dater précisément, sur la pièce elle-même. Tout le calendrier"));
        if (!dep) l.push("en dépend, et une date approximative ne sert à rien ici.");
        l.push("");
        l.push("Jour 1 — le lendemain de l'acte, soit le " + leJour(dans(base, 1)) + " : le délai");
        l.push("commence à courir (computation rappelée au paragraphe 2).");
        l.push("");
        l.push("Au plus tard le " + leJour(dans(base, 10)) + " — L'ASSIGNATION EST DÉLIVRÉE.");
        l.push("Dix jours, c'est court : il faut le conseil, l'acte et le commissaire de");
        l.push("justice. Décidez de contester ou non dans les TROIS PREMIERS JOURS, soit");
        l.push("avant le " + leJour(dans(base, 3)) + ", sans quoi le délai se consommera en");
        l.push("délibérations internes.");
        l.push("");
        l.push("Dans les dix jours de la saisine — le juge statue selon la procédure");
        l.push("accélérée au fond (L. 2315-86). Une saisine du " + leJour(dans(base, 10)) + " appellerait");
        l.push("une décision aux environs du " + leJour(dans(base, 20)) + ".");
        l.push("");
        l.push("Pas d'appel — la décision n'est pas susceptible d'appel ; le pourvoi en");
        l.push("cassation se forme dans les DIX JOURS DE LA NOTIFICATION du jugement");
        l.push("(R. 2315-50). Notifié le [date], le pourvoi devrait être formé dans les dix");
        l.push("jours qui suivent.");
        l.push("");
        l.push("Pendant tout ce temps — l'expertise ET le délai de consultation sont");
        l.push("suspendus. Reprenez le calcul du délai de consultation à la notification du");
        l.push("jugement, en repartant du solde, et non de zéro.");
        return l;
      })());

      return pied(L,
        ["L. 2312-15", "L. 2315-80", "L. 2315-86", "R. 2315-49", "R. 2315-50"],
        ["L. 2315-81-1 (contenu du cahier des charges et des informations dont la notification fait courir le délai du 3°)",
         "L. 1233-35-1 (cas réservé par la première ligne de L. 2315-86)",
         "les articles 641 et 642 du code de procédure civile (computation du délai)"]);
    },
  });

  DP.ajouter("CSE-CTL-EXP-03", {
    nom: "La délibération rectifiant le fondement du recours à l'expertise, et le test du seuil de dix licenciements",
    detail: "Le test des deux conditions de L. 1233-34, la grille des fondements " +
            "possibles, la délibération rectificative visant le fondement exact, le " +
            "courrier à l'expert en cas de renonciation et le courrier au secrétaire.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var eff = effectifDe(ctx);
      var e = objet(f.expertise);
      var cas = e.cas ? String(e.cas) : null;
      var nbL = nb(f.nbLicenciements);
      var L = [];

      L = L.concat(entete(ctx, "Rectification du fondement du recours à l'expertise",
        "articles L. 1233-34, L. 2315-92 et L. 2315-94 du code du travail"));
      usage(L);

      L.push("UNE EXPERTISE SANS FONDEMENT N'EST PAS UNE EXPERTISE FRAGILE : ELLE EST SANS");
      L.push("BASE");
      L.push("");
      L.push("Le comité ne peut recourir à un expert que DANS LES CAS PRÉVUS par la loi :");
      L.push("« Le comité social et économique peut, le cas échéant sur proposition des");
      L.push("commissions constituées en son sein, décider de recourir à un expert-comptable");
      L.push("ou à un expert habilité DANS LES CAS PRÉVUS À LA PRÉSENTE SOUS-SECTION »");
      L.push("(L. 2315-78). Hors ces cas, il reste l'expertise libre de L. 2315-81, qu'il");
      L.push("rémunère lui-même.");
      L.push("");
      L.push("Ce qui se joue : une délibération fondée sur un texte qui ne la prévoit pas ne");
      L.push("fonde pas l'expertise. Aucune peine n'est encourue ; c'est la délibération qui");
      L.push("tombe, et avec elle la prise en charge des frais par l'employeur.");
      L.push("");
      L.push("  Cas de recours déclaré au dossier ......... " +
        (cas ? cas : "[À RELEVER SUR LA DÉLIBÉRATION]"));
      L.push("");

      titre(L, "1 — Le test des deux conditions de L. 1233-34");
      L.push("« DANS LES ENTREPRISES D'AU MOINS CINQUANTE SALARIÉS, lorsque LE PROJET DE");
      L.push("LICENCIEMENT CONCERNE AU MOINS DIX SALARIÉS DANS UNE MÊME PÉRIODE DE TRENTE");
      L.push("JOURS, le comité social et économique peut, LE CAS ÉCHÉANT SUR PROPOSITION DES");
      L.push("COMMISSIONS CONSTITUÉES EN SON SEIN, décider, LORS DE LA PREMIÈRE RÉUNION");
      L.push("PRÉVUE À L'ARTICLE L. 1233-30, de recourir à une expertise pouvant porter sur");
      L.push("les domaines économique et comptable ainsi que sur la santé, la sécurité ou");
      L.push("les effets potentiels du projet sur les conditions de travail » (L. 1233-34).");
      L.push("");
      L.push("  a) EFFECTIF DE L'ENTREPRISE");
      ligneSeuil(L, eff, 50, "la première condition de L. 1233-34 est remplie.");
      L.push("");
      L.push("  b) NOMBRE DE LICENCIEMENTS ENVISAGÉS DANS UNE MÊME PÉRIODE DE TRENTE JOURS");
      if (nbL != null) {
        L.push("     " + nbL + " licenciement(s) envisagé(s) — seuil de dix salariés " +
          (nbL >= 10 ? "ATTEINT." : "NON ATTEINT."));
      } else {
        L.push("     [NOMBRE] licenciement(s) envisagé(s) — seuil de dix salariés");
        L.push("     [atteint / non atteint].");
      }
      L.push("     Période de trente jours considérée : du [DATE] au [DATE].");
      L.push("     Pièce : projet de licenciement.");
      L.push("");
      L.push("     LA PÉRIODE COMPTE AUTANT QUE LE NOMBRE. Neuf licenciements sur trente");
      L.push("     jours, puis deux le trente-cinquième jour, ne font pas onze au sens du");
      L.push("     texte. Datez chaque licenciement envisagé.");
      L.push("");
      if (nbL != null && nbL < 10) {
        L.push("  CONCLUSION AU DOSSIER — le seuil de dix salariés sur trente jours n'est pas");
        L.push("  atteint. L'expertise NE PEUT PAS être fondée sur L. 1233-34. Deux voies :");
        L.push("  chercher un autre cas de recours au paragraphe 2, ou renoncer et employer");
        L.push("  le courrier 2.");
        L.push("");
      }
      L.push("  c) LE MOMENT DE LA DÉCISION — la décision se prend LORS DE LA PREMIÈRE");
      L.push("     RÉUNION PRÉVUE À L'ARTICLE L. 1233-30. L'article L. 1233-30 n'a pas été");
      L.push("     lu par l'application : il est NOMMÉ, et vous devez y vérifier de quelle");
      L.push("     réunion il s'agit et à quelle date elle se tient.");
      L.push("");
      L.push("     Date de la première réunion de L. 1233-30 ......... [DATE]");
      L.push("     Date de la délibération décidant l'expertise ...... [DATE]");
      L.push("     Les deux dates coïncident-elles ? ................. [oui / non]");
      L.push("");
      L.push("  d) CE QUE LE TEXTE AJOUTE, ET QU'ON OUBLIE");
      L.push("     · l'expert peut être assisté dans les conditions prévues à L. 2315-81 ;");
      L.push("     · le comité peut ÉGALEMENT mandater un expert afin qu'il apporte toute");
      L.push("       analyse utile aux organisations syndicales pour mener la négociation");
      L.push("       prévue à l'article L. 1233-24-1 — article NOMMÉ, non lu ;");
      L.push("     · LE RAPPORT DE L'EXPERT est remis au comité et, le cas échéant, aux");
      L.push("       organisations syndicales, AU PLUS TARD QUINZE JOURS AVANT L'EXPIRATION");
      L.push("       DU DÉLAI mentionné à l'article L. 1233-30 (L. 1233-34).");
      L.push("");

      titre(L, "2 — La grille des fondements : lequel existe réellement ?");
      L.push("Parcourez-la dans l'ordre et cochez celui qui correspond aux faits. Si aucun");
      L.push("ne correspond, il n'y a pas d'expertise financée : il reste l'expertise libre.");
      L.push("");
      casDeRecours(L);
      L.push("  [ ] Aucun de ces cas ne correspond — voir le courrier 2 : renonciation, ou");
      L.push("      recours à l'expertise libre de L. 2315-81, aux frais du comité.");
      L.push("");
      L.push("  POUR LE CAS DU 2° DE L. 2315-94 en particulier — introduction de nouvelles");
      L.push("  technologies ou projet important modifiant les conditions de santé et de");
      L.push("  sécurité ou les conditions de travail, prévus au 4° du II de L. 2312-8 :");
      L.push("");
      L.push("     Le fondement du contrôle de ce module retient que, LORSQUE CE PROJET");
      L.push("     ENTRAÎNE DES LICENCIEMENTS ÉCONOMIQUES DONNANT LIEU À UN PLAN DE");
      L.push("     SAUVEGARDE DE L'EMPLOI, la faculté de recourir à une expertise portant");
      L.push("     sur l'incidence du projet sur les conditions de santé, de sécurité et de");
      L.push("     travail NE PEUT S'EXERCER QUE DANS LES CONDITIONS DE L'ARTICLE");
      L.push("     L. 1233-34 : une délibération distincte fondée sur le 2° de L. 2315-94");
      L.push("     est alors nulle (Soc., 18 mars 2026, n° 23-22.270, publié).");
      L.push("");
      L.push("     Autrement dit : dans cette configuration, on ne prend pas DEUX");
      L.push("     délibérations — une « santé et sécurité » et une « économique ». On en");
      L.push("     prend UNE, lors de la première réunion de L. 1233-30, et elle peut porter");
      L.push("     sur les domaines économique et comptable AINSI QUE sur la santé, la");
      L.push("     sécurité ou les effets potentiels du projet sur les conditions de travail");
      L.push("     — L. 1233-34 le dit expressément.");
      L.push("");
      L.push("     Le projet donne-t-il lieu à un plan de sauvegarde de l'emploi ? [oui/non]");
      L.push("     Une délibération distincte a-t-elle été prise sur le 2° de L. 2315-94 ?");
      L.push("     [oui / non] — si oui, elle est à reprendre.");
      L.push("");

      titre(L, "3 — La délibération rectificative");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Réunion du [DATE] · point [n°] de l'ordre du jour");
      L.push("");
      L.push("DÉLIBÉRATION RECTIFICATIVE — FONDEMENT DU RECOURS À L'EXPERTISE");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ",");
      L.push("");
      L.push("VU sa délibération du [DATE] décidant le recours à une expertise sur le");
      L.push("fondement de [article visé à l'origine] ;");
      L.push("VU l'article L. 2315-78, aux termes duquel il ne peut décider de recourir à un");
      L.push("expert-comptable ou à un expert habilité que dans les cas prévus à la");
      L.push("sous-section 10 ;");
      L.push("VU [le ou les articles retenus après le test du paragraphe 2] ;");
      L.push("");
      L.push("CONSTATANT que [exposer le fait : le nombre de licenciements envisagés sur");
      L.push("trente jours, l'existence d'un plan de sauvegarde de l'emploi, la nature du");
      L.push("projet, le risque grave constaté dans l'établissement, l'absence d'indicateur");
      L.push("d'égalité professionnelle] ;");
      L.push("");
      L.push("DÉCIDE :");
      L.push("");
      L.push("Article 1 — La délibération du [DATE] est RAPPORTÉE en tant qu'elle vise");
      L.push("[l'article erroné].");
      L.push("");
      L.push("Article 2 — Le comité décide de recourir à une expertise sur le fondement de");
      L.push("[ARTICLE EXACT], portant sur [objet de l'expertise, décrit en termes qui");
      L.push("correspondent au cas de recours retenu].");
      L.push("");
      L.push("Article 3 — [Le cas échéant : cette expertise, décidée dans le cadre de");
      L.push("l'article L. 1233-34, porte sur les domaines économique et comptable ainsi que");
      L.push("sur la santé, la sécurité et les effets potentiels du projet sur les");
      L.push("conditions de travail, en une seule expertise et par une seule délibération.]");
      L.push("");
      L.push("Article 4 — [Le cas échéant : la présente décision est prise sur proposition de");
      L.push("la commission [nom], formulée le [DATE], conformément à l'article L. 2315-78");
      L.push("et à l'article L. 1233-34 qui réservent cette faculté de proposition aux");
      L.push("commissions constituées au sein du comité.]");
      L.push("");
      L.push("Article 5 — L'expert désigné est [nom]. Le financement de l'expertise sera");
      L.push("réparti conformément à l'article L. 2315-80, selon le cas de recours retenu à");
      L.push("l'article 2.");
      L.push("");
      L.push("La délibération est adoptée à la majorité des membres présents, le président ne");
      L.push("prenant pas part au vote (L. 2315-32), et consignée au procès-verbal");
      L.push("(L. 2315-34).");
      L.push("");
      L.push("Vote : [ ] pour · [ ] contre · [ ] abstention.");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");
      L.push("  ATTENTION AU DÉLAI QUE CETTE DÉLIBÉRATION ROUVRE — une délibération");
      L.push("  rectificative décidant le recours à l'expertise fait courir à nouveau, pour");
      L.push("  l'employeur, le délai de dix jours de contestation de la nécessité de");
      L.push("  l'expertise (L. 2315-86, 1° ; R. 2315-49). Le document CSE-CTL-EXP-02 le");
      L.push("  calcule.");
      L.push("");

      courrier(L, 1, "inscription du point à l'ordre du jour", [
        "L'ordre du jour est établi par le président ET le secrétaire (L. 2315-29).",
      ]);
      papier(L, ctx, ["À l'attention du secrétaire",
                      "du comité social et économique"]);
      L.push("Objet : fondement du recours à l'expertise décidée le [DATE]");
      L.push("");
      L.push("Monsieur le Secrétaire, [ou Madame la Secrétaire]");
      L.push("");
      L.push("La délibération du [DATE] décidant le recours à une expertise vise [article].");
      L.push("L'examen des conditions de ce texte fait apparaître que [exposer : le seuil de");
      L.push("dix licenciements sur trente jours n'est pas atteint / le projet donne lieu à");
      L.push("un plan de sauvegarde de l'emploi et relève donc de L. 1233-34 / le fondement");
      L.push("visé ne prévoit pas ce cas].");
      L.push("");
      L.push("Le comité ne pouvant décider de recourir à un expert que dans les cas prévus à");
      L.push("la sous-section 10 (L. 2315-78), je vous propose d'inscrire ce point à l'ordre");
      L.push("du jour de la réunion du [DATE], afin que le comité puisse reprendre sa");
      L.push("délibération en visant le fondement exact.");
      L.push("");
      L.push("Vous trouverez ci-joint la grille des cas de recours et un projet de");
      L.push("délibération rectificative.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Monsieur le Secrétaire, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : grille des cas de recours · projet de délibération.");
      L.push("");

      courrier(L, 2, "à l'expert — renonciation ou changement de fondement", [
        "À adresser dès que le constat est fait, et non après la remise du rapport : ce",
        "qui a été engagé se paie.",
      ]);
      papier(L, ctx, ["À l'attention de [cabinet / expert désigné]", "[adresse]"]);
      L.push("Objet : expertise décidée le [DATE] — fondement du recours");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Vous avez été désigné par une délibération du comité social et économique du");
      L.push("[DATE], prise sur le fondement de [article].");
      L.push("");
      L.push("[VARIANTE 1 — RECTIFICATION] Le comité a repris cette délibération le [DATE]");
      L.push("pour viser [article exact]. L'objet de votre mission en est [inchangé /");
      L.push("modifié comme suit : ...]. Le financement en sera réparti selon l'article");
      L.push("L. 2315-80 dans les conditions attachées à ce cas de recours.");
      L.push("");
      L.push("[VARIANTE 2 — RENONCIATION] Les conditions du texte fondant votre désignation");
      L.push("ne sont pas réunies : [exposer]. Le comité a en conséquence rapporté sa");
      L.push("délibération le [DATE], et il n'est pas donné suite à cette expertise. Je vous");
      L.push("prie de bien vouloir nous adresser le décompte des diligences accomplies à ce");
      L.push("jour.");
      L.push("");
      L.push("[VARIANTE 3 — EXPERTISE LIBRE] Le comité a décidé, le [DATE], de poursuivre");
      L.push("cette expertise sur le fondement de l'article L. 2315-81 du code du travail,");
      L.push("qui lui permet de faire appel à tout type d'expertise RÉMUNÉRÉE PAR SES SOINS");
      L.push("pour la préparation de ses travaux. Vos honoraires seront donc réglés par le");
      L.push("comité, et vos factures lui seront adressées.");
      L.push("");
      salutation(L, ctx);

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous remplissez le test du paragraphe 1 et la grille du",
        "paragraphe 2. Deux chiffres et une date suffisent : le nombre de licenciements,",
        "la période de trente jours, la date de la première réunion de L. 1233-30.",
        "",
        "Le même jour, si le fondement est erroné — courrier 2 à l'expert. Chaque jour de",
        "retard est un jour de diligences engagées sur une délibération qui ne tient pas.",
        "",
        "Dans les jours qui suivent — courrier 1 au secrétaire pour l'inscription à",
        "l'ordre du jour (L. 2315-29), puis délibération rectificative à la réunion",
        "suivante.",
        "",
        "À COMPTER DE LA DÉLIBÉRATION RECTIFICATIVE — un nouveau délai de dix jours court",
        "pour l'employeur qui voudrait contester la nécessité de l'expertise (L. 2315-86,",
        "1° ; R. 2315-49). Prise aujourd'hui, elle ouvrirait un délai expirant le",
        leJour(dans(d0, 10)) + ".",
        "",
        "Si l'expertise se rattache à L. 1233-34 — le rapport de l'expert est remis au",
        "plus tard QUINZE JOURS AVANT l'expiration du délai de L. 1233-30. Remontez ce",
        "délai depuis la date d'expiration, et non depuis la désignation.",
      ]);

      return pied(L,
        ["L. 1233-34", "L. 2312-8", "L. 2312-17", "L. 2312-41", "L. 2312-63",
         "L. 2315-29", "L. 2315-32", "L. 2315-34", "L. 2315-78", "L. 2315-80",
         "L. 2315-81", "L. 2315-86", "L. 2315-87", "L. 2315-88", "L. 2315-91",
         "L. 2315-92", "L. 2315-94", "R. 2315-49"],
        ["L. 1233-30 (première réunion et délai auxquels L. 1233-34 renvoie)",
         "L. 1233-24-1 et L. 2254-2 (négociations pour lesquelles un expert peut être mandaté)"]);
    },
  });

  DP.ajouter("CSE-CTL-EXP-04", {
    nom: "La délibération du comité décidant le recours à l'expertise, et ce que la commission peut seulement proposer",
    detail: "Le constat de l'auteur réel de la décision, la règle d'ordre public de " +
            "L. 2315-38, la délibération du comité avec son décompte des voix, la mention " +
            "distincte de la proposition de la commission, la lettre de désignation de " +
            "l'expert et sa notification à l'employeur.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var e = objet(f.expertise);
      var par = e.decideePar ? String(e.decideePar) : null;
      var parBas = par ? par.toLowerCase() : "";
      var parCommission = parBas.indexOf("commission") >= 0;
      var parEmployeur = parBas.indexOf("employeur") >= 0;
      var L = [];

      L = L.concat(entete(ctx, "Décision de recourir à l'expertise : la délibération du comité",
        "articles L. 2315-38, L. 2315-78 et L. 1233-34 du code du travail"));
      usage(L);

      L.push("LE COMITÉ DÉCIDE. LA COMMISSION PROPOSE. L'EMPLOYEUR CONTESTE.");
      L.push("");
      L.push("Trois rôles, trois textes, et ils ne se substituent pas :");
      L.push("");
      L.push("  · LE COMITÉ DÉCIDE — « Le comité social et économique peut, le cas échéant");
      L.push("    sur proposition des commissions constituées en son sein, DÉCIDER de");
      L.push("    recourir à un expert-comptable ou à un expert habilité dans les cas prévus");
      L.push("    à la présente sous-section » (L. 2315-78) ; « le comité social et");
      L.push("    économique peut, le cas échéant sur proposition des commissions");
      L.push("    constituées en son sein, DÉCIDER, lors de la première réunion prévue à");
      L.push("    l'article L. 1233-30, de recourir à une expertise » (L. 1233-34).");
      L.push("");
      L.push("  · LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL NE DÉCIDE PAS —");
      L.push("    « La commission santé, sécurité et conditions de travail se voit confier,");
      L.push("    par délégation du comité social et économique, tout ou partie des");
      L.push("    attributions du comité relatives à la santé, à la sécurité et aux");
      L.push("    conditions de travail, À L'EXCEPTION DU RECOURS À UN EXPERT PRÉVU À LA");
      L.push("    SOUS-SECTION 10 et des attributions consultatives du comité » (L. 2315-38).");
      L.push("");
      L.push("    Le fondement du contrôle de ce module retient que CES DISPOSITIONS SONT");
      L.push("    D'ORDRE PUBLIC (Soc., 13 mai 2026, n° 25-12.560). Un accord ne peut donc");
      L.push("    pas y déroger : une clause qui déléguerait le recours à l'expert à la");
      L.push("    commission ne produit pas d'effet, et la décision prise sur son fondement");
      L.push("    est irrégulière.");
      L.push("");
      L.push("  · L'EMPLOYEUR CONTESTE, il ne décide pas — sa voie est la saisine du");
      L.push("    président du tribunal judiciaire dans les dix jours (L. 2315-86,");
      L.push("    R. 2315-49 ; document CSE-CTL-EXP-02 de ce module).");
      L.push("");
      L.push("Ce qui se joue : une décision prise par la commission, ou attribuée à");
      L.push("l'employeur, est irrégulière. Aucune peine n'est encourue de ce chef ; c'est");
      L.push("la décision qui ne tient pas, et l'expertise engagée sur elle avec.");
      L.push("");

      titre(L, "1 — Qui a décidé, et sur quelle pièce");
      L.push("  Auteur de la décision, au dossier ......... " +
        (par ? par : "[À ÉTABLIR SUR LA PIÈCE]"));
      L.push("");
      L.push("  Pièce produite (cochez) :");
      L.push("     [ ] délibération du comité social et économique du [DATE] ;");
      L.push("     [ ] compte rendu de la commission santé, sécurité et conditions de");
      L.push("         travail du [DATE] ;");
      L.push("     [ ] décision ou courrier de l'employeur du [DATE] ;");
      L.push("     [ ] aucune pièce — c'est alors le premier problème.");
      L.push("");
      if (parCommission) {
        L.push("  AU DOSSIER, LA DÉCISION ÉMANE DE LA COMMISSION. Elle est à reprendre : le");
        L.push("  recours à l'expert de la sous-section 10 est EXPRESSÉMENT EXCLU des");
        L.push("  attributions délégables (L. 2315-38), et ce texte est d'ordre public. La");
        L.push("  commission a pu PROPOSER l'expertise — L. 2315-78 et L. 1233-34 le");
        L.push("  prévoient — mais seul le comité peut la DÉCIDER. Le paragraphe 2 produit");
        L.push("  la délibération, et le paragraphe 3 montre comment la proposition de la");
        L.push("  commission se consigne sans se confondre avec la décision.");
        L.push("");
      } else if (parEmployeur) {
        L.push("  AU DOSSIER, LA DÉCISION EST ATTRIBUÉE À L'EMPLOYEUR. Elle est à reprendre :");
        L.push("  le recours à l'expert est une prérogative du comité, qui en délibère");
        L.push("  (L. 2315-78, L. 1233-34). L'employeur, lui, a une autre voie, et une seule :");
        L.push("  contester devant le président du tribunal judiciaire dans les dix jours de");
        L.push("  la délibération (L. 2315-86, 1° ; R. 2315-49 ; R. 2315-50).");
        L.push("");
      } else if (par) {
        L.push("  AU DOSSIER, LA DÉCISION EST ATTRIBUÉE AU COMITÉ. Vérifiez alors les trois");
        L.push("  points du paragraphe 2 : l'inscription à l'ordre du jour, la majorité des");
        L.push("  membres présents, et le fait que le président n'ait pas pris part au vote.");
        L.push("  C'est là que les délibérations régulières deviennent contestables.");
        L.push("");
      } else {
        L.push("  L'AUTEUR N'EST PAS RENSEIGNÉ. Établissez-le sur la pièce elle-même avant");
        L.push("  toute autre chose : rien ne se déduit ici, et une expertise dont l'auteur");
        L.push("  de la décision est incertain se conteste sans difficulté.");
        L.push("");
      }

      titre(L, "2 — La délibération du comité");
      L.push(nom(ctx));
      L.push("COMITÉ SOCIAL ET ÉCONOMIQUE");
      L.push("");
      L.push("Réunion du [DATE] · point [n°] de l'ordre du jour");
      L.push("");
      L.push("Le point a été inscrit à l'ordre du jour établi par le président et le");
      L.push("secrétaire (L. 2315-29). [Le cas échéant : les consultations rendues");
      L.push("obligatoires par une disposition législative ou réglementaire ou par un accord");
      L.push("collectif sont inscrites de plein droit à l'ordre du jour par le président ou");
      L.push("le secrétaire.]");
      L.push("");
      L.push("DÉLIBÉRATION — RECOURS À UNE EXPERTISE");
      L.push("");
      L.push("Le comité social et économique de " + nom(ctx) + ",");
      L.push("");
      L.push("VU l'article L. 2315-78 du code du travail ;");
      L.push("VU [l'article qui porte le cas de recours : L. 2315-87, L. 2315-88,");
      L.push("L. 2315-91, L. 2315-92, L. 2315-94 ou L. 1233-34] ;");
      L.push("[VU la proposition de la commission [nom] formulée le [DATE] ;]");
      L.push("");
      L.push("DÉCIDE :");
      L.push("");
      L.push("Article 1 — Le comité décide de RECOURIR À UNE EXPERTISE sur le fondement de");
      L.push("[ARTICLE], portant sur [objet précis].");
      L.push("");
      L.push("Article 2 — Est désigné en qualité d'expert : [nom, qualité, adresse].");
      L.push("[Pour une expertise de L. 2315-94 : l'expert est habilité, son habilitation");
      L.push("étant une certification délivrée par un organisme certificateur accrédité");
      L.push("(R. 2315-51). Copie de la certification est demandée.]");
      L.push("");
      L.push("Article 3 — Le financement de l'expertise est réparti conformément à l'article");
      L.push("L. 2315-80 : [à la charge de l'employeur / 80 % employeur, 20 % comité sur son");
      L.push("budget de fonctionnement].");
      L.push("");
      L.push("Article 4 — Le secrétaire est chargé de notifier la présente délibération à");
      L.push("l'employeur et à l'expert désigné.");
      L.push("");
      L.push("LE VOTE — les résolutions du comité sont prises À LA MAJORITÉ DES MEMBRES");
      L.push("PRÉSENTS ; le président ne participe pas au vote lorsqu'il consulte les membres");
      L.push("élus du comité en tant que délégation du personnel (L. 2315-32).");
      L.push("");
      L.push("  Membres présents ....... [nombre] · [liste nominative]");
      L.push("  Le président a-t-il pris part au vote ? ....... NON (L. 2315-32)");
      L.push("  Voix pour .............. [ ]");
      L.push("  Voix contre ............ [ ]");
      L.push("  Abstentions ............ [ ]");
      L.push("  Résultat ............... [adoptée / rejetée]");
      L.push("");
      L.push("  LE DÉCOMPTE DOIT FIGURER AU PROCÈS-VERBAL. C'est lui qui établit la majorité");
      L.push("  des membres présents ; une mention « adoptée à l'unanimité » sans nombre de");
      L.push("  présents n'établit rien.");
      L.push("");
      L.push("Les délibérations du comité sont consignées dans un procès-verbal établi par le");
      L.push("secrétaire du comité (L. 2315-34).");
      L.push("");
      L.push("Le secrétaire,                             Le président,");
      L.push("[nom]                                      " + signataire(ctx));
      L.push("");

      titre(L, "3 — La proposition de la commission, consignée sans être confondue");
      L.push("C'est là ce que les commissions apportent à l'expertise, et la seule chose");
      L.push("qu'elles y apportent. Écrivez-la donc SÉPARÉMENT, et à sa place.");
      L.push("");
      L.push("  EXTRAIT DU COMPTE RENDU DE LA COMMISSION");
      L.push("");
      L.push("     Commission [santé, sécurité et conditions de travail / autre] du [DATE]");
      L.push("     Membres présents : [ ]");
      L.push("");
      L.push("     La commission, ayant examiné [objet], PROPOSE au comité social et");
      L.push("     économique de recourir à une expertise sur le fondement de [article],");
      L.push("     portant sur [objet].");
      L.push("");
      L.push("     La commission rappelle qu'elle ne dispose pas du pouvoir de décider ce");
      L.push("     recours : l'article L. 2315-38 exclut expressément le recours à un expert");
      L.push("     prévu à la sous-section 10 des attributions qui peuvent lui être");
      L.push("     déléguées. La présente proposition est transmise au comité, à qui il");
      L.push("     appartient de délibérer.");
      L.push("");
      L.push("     Le rapporteur, [nom]");
      L.push("");
      L.push("  EXTRAIT DU PROCÈS-VERBAL DU COMITÉ — la proposition et la décision, dans");
      L.push("  deux paragraphes distincts");
      L.push("");
      L.push("     « Le rapporteur de la commission [nom] présente la proposition formulée");
      L.push("     par celle-ci le [DATE], tendant au recours à une expertise sur le");
      L.push("     fondement de [article].");
      L.push("");
      L.push("     Après en avoir délibéré, LE COMITÉ décide de recourir à cette expertise et");
      L.push("     désigne [expert]. La délibération est adoptée par [ ] voix pour, [ ]");
      L.push("     contre, [ ] abstention, sur [ ] membres présents, le président n'ayant");
      L.push("     pas pris part au vote. »");
      L.push("");
      L.push("  SI L'ACCORD OU LE RÈGLEMENT INTÉRIEUR DU COMITÉ DIT LE CONTRAIRE — la clause");
      L.push("  qui délègue le recours à l'expert à la commission ne produit pas d'effet,");
      L.push("  L. 2315-38 étant d'ordre public. Signalez-la, et faites-la examiner : c'est");
      L.push("  l'objet du document CSE-CTL-DET-01 de ce module. En attendant, ne vous");
      L.push("  fondez pas sur elle.");
      L.push("");

      courrier(L, 1, "notification de la délibération à l'employeur", [
        "Cette notification n'est pas une formalité de courtoisie : c'est elle qui met",
        "l'employeur en mesure de connaître la délibération, et donc de la contester dans",
        "les dix jours (L. 2315-86, 1° ; R. 2315-49). Sa date doit être certaine.",
      ]);
      L.push("Comité social et économique de " + nom(ctx));
      L.push("");
      L.push("À l'attention de " + cro(((ctx.profil) || {}).responsable, "l'employeur"));
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Lettre remise en main propre contre décharge, ou adressée par tout moyen");
      L.push("conférant date certaine à sa réception");
      L.push("");
      L.push("Objet : notification de la délibération du [DATE] décidant le recours à une");
      L.push("expertise");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Le comité social et économique, réuni le [DATE], a décidé de recourir à une");
      L.push("expertise sur le fondement de l'article [ ] du code du travail, portant sur");
      L.push("[objet], et a désigné [expert].");
      L.push("");
      L.push("Vous trouverez ci-joint l'extrait du procès-verbal portant la délibération et");
      L.push("le décompte des voix.");
      L.push("");
      L.push("Le financement de cette expertise est réparti conformément à l'article");
      L.push("L. 2315-80 du code du travail.");
      L.push("");
      L.push("Le secrétaire du comité,");
      L.push("[nom]");
      L.push("");
      L.push("Pièce jointe : extrait du procès-verbal.");
      L.push("");

      courrier(L, 2, "lettre de désignation adressée à l'expert", [
        "Elle ouvre les délais que les textes imposent à l'expert : trois jours pour",
        "demander les informations complémentaires, dix jours pour notifier le coût",
        "prévisionnel.",
      ]);
      L.push("Comité social et économique de " + nom(ctx));
      L.push("");
      L.push("À l'attention de [cabinet / expert]");
      L.push("[adresse]");
      L.push("");
      L.push(lieu(ctx) + ", le " + leJour(d0));
      L.push("");
      L.push("Objet : votre désignation par le comité social et économique");
      L.push("");
      L.push("Madame, Monsieur,");
      L.push("");
      L.push("Par une délibération du [DATE], adoptée à la majorité des membres présents, le");
      L.push("comité social et économique de " + nom(ctx) + " vous a désigné en qualité");
      L.push("d'expert sur le fondement de l'article [ ] du code du travail, pour une");
      L.push("mission portant sur [objet].");
      L.push("");
      L.push("Je vous rappelle que vous demandez à l'employeur, AU PLUS TARD DANS LES TROIS");
      L.push("JOURS de la présente désignation, toutes les informations complémentaires que");
      L.push("vous jugez nécessaires à la réalisation de votre mission ; l'employeur y répond");
      L.push("dans les cinq jours (R. 2315-45). Vous notifiez à l'employeur le coût");
      L.push("prévisionnel, l'étendue et la durée de l'expertise DANS UN DÉLAI DE DIX JOURS");
      L.push("à compter de votre désignation (R. 2315-46).");
      L.push("");
      L.push("Vous êtes tenu aux obligations de secret et de discrétion définies à l'article");
      L.push("L. 2315-3 (L. 2315-84), et vous avez libre accès dans l'entreprise pour les");
      L.push("besoins de votre mission (L. 2315-82).");
      L.push("");
      L.push("Le secrétaire du comité,");
      L.push("[nom]");
      L.push("");
      L.push("Pièce jointe : extrait du procès-verbal portant la délibération.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous établissez QUI a décidé, sur la pièce. Une seule",
        "question, et elle commande tout le reste.",
        "",
        "Si la décision émane de la commission ou de l'employeur — le point est inscrit à",
        "l'ordre du jour de la réunion suivante (L. 2315-29) et le comité délibère. Ne",
        "laissez pas l'expertise se poursuivre entre-temps sur une décision irrégulière.",
        "",
        "Le jour de la délibération — le décompte des voix est porté au procès-verbal, et",
        "la proposition de la commission y est consignée SÉPARÉMENT de la décision.",
        "",
        "Le lendemain — notification à l'employeur (courrier 1) et lettre de désignation à",
        "l'expert (courrier 2). Notifiée le " + leJour(dans(d0, 1)) + ", la délibération ouvrirait à",
        "l'employeur un délai de contestation expirant vers le " + leJour(dans(d0, 11)) + ".",
        "",
        "Dans les trois jours de la désignation — l'expert demande ses informations",
        "(R. 2315-45) ; dans les dix jours, il notifie le coût prévisionnel (R. 2315-46).",
        "",
        "Et une fois pour toutes — relisez la clause de votre accord ou du règlement",
        "intérieur du comité qui organise la délégation à la commission. Si elle inclut le",
        "recours à l'expert, elle est inopérante : L. 2315-38 est d'ordre public.",
      ]);

      return pied(L,
        ["L. 1233-34", "L. 2315-3", "L. 2315-29", "L. 2315-32", "L. 2315-34",
         "L. 2315-38", "L. 2315-78", "L. 2315-80", "L. 2315-82", "L. 2315-84",
         "L. 2315-86", "L. 2315-87", "L. 2315-88", "L. 2315-91", "L. 2315-92",
         "L. 2315-94", "R. 2315-45", "R. 2315-46", "R. 2315-49", "R. 2315-50",
         "R. 2315-51"],
        ["L. 1233-30 (première réunion à laquelle L. 1233-34 rattache la décision)"]);
    },
  });

  /* ────────────────────────────────────────────────────────────────────────
     LES DEUX POINTS À FAIRE EXAMINER
     ──────────────────────────────────────────────────────────────────────── */

  DP.ajouter("CSE-CTL-DET-01", {
    nom: "La note d'analyse des accords applicables au comité : la grille clause par clause, le relevé des dates et la demande d'examen",
    detail: "Le relevé des accords avec la date de notification et celle de publication " +
            "qui font courir le délai de deux mois de L. 2262-14, la grille de ce qu'un " +
            "accord peut et ne peut pas faire, la conclusion en action en nullité ou en " +
            "exception d'illégalité, et le courrier de saisine du conseil.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var accords = liste(f.accordsCse);
      var deleg = objet(f.delegationCssct);
      var multi = oui(f.etablissementsMultiples);
      var L = [];

      L = L.concat(entete(ctx, "Analyse des accords collectifs applicables au comité au regard de ses prérogatives légales",
        "article L. 2262-14 du code du travail"));
      usage(L);

      L.push("CE QUE CETTE NOTE FAIT, ET CE QU'ELLE NE FAIT PAS");
      L.push("");
      L.push("Elle ne lit pas vos accords : l'application ne dispose que de leur existence,");
      L.push("jamais de leurs stipulations. Elle fait deux choses, et elles sont utiles :");
      L.push("");
      L.push("  · elle relève LES DEUX DATES qui ouvrent le délai de deux mois de");
      L.push("    L. 2262-14, parce que ce délai court sans qu'on s'en aperçoive et qu'il");
      L.push("    est très court ;");
      L.push("  · elle donne LA GRILLE de ce qu'un accord peut faire et de ce qu'il ne peut");
      L.push("    pas faire, texte par texte, de sorte que la relecture professionnelle");
      L.push("    porte sur les bonnes clauses.");
      L.push("");
      L.push("La relecture elle-même appartient à un professionnel. Ce document la prépare");
      L.push("et la date ; il ne la remplace pas.");
      L.push("");
      L.push("CE QUI SE JOUE — un accord peut légalement aménager beaucoup de choses. Il ne");
      L.push("peut pas priver le comité d'une prérogative que la loi lui reconnaît. La");
      L.push("clause qui le ferait n'est pas une faute pénale : elle est inopérante, et");
      L.push("l'acte pris sur son fondement — un avis rendu par la seule commission, une");
      L.push("expertise décidée par elle — est irrégulier.");
      L.push("");

      titre(L, "1 — Le relevé des accords et de leurs deux dates");
      L.push("« Toute action en nullité de tout ou partie d'une convention ou d'un accord");
      L.push("collectif doit, À PEINE D'IRRECEVABILITÉ, être engagée dans un délai de DEUX");
      L.push("MOIS à compter : 1° DE LA NOTIFICATION de l'accord d'entreprise prévue à");
      L.push("l'article L. 2231-5, pour les organisations disposant d'une section syndicale");
      L.push("dans l'entreprise ; 2° DE LA PUBLICATION de l'accord prévue à l'article");
      L.push("L. 2231-5-1 dans tous les autres cas. Ce délai s'applique sans préjudice des");
      L.push("articles L. 1233-24, L. 1235-7-1 et L. 1237-19-8 du code du travail »");
      L.push("(L. 2262-14).");
      L.push("");
      L.push("  Les articles L. 2231-5 et L. 2231-5-1, qui définissent cette notification et");
      L.push("  cette publication, N'ONT PAS ÉTÉ LUS par l'application : ils sont nommés, et");
      L.push("  leur contenu n'est ni reproduit ni paraphrasé. De même pour L. 1233-24,");
      L.push("  L. 1235-7-1 et L. 1237-19-8, que le dernier alinéa réserve.");
      L.push("");
      L.push("  DEUX POINTS DE DÉPART, ET ILS NE VISENT PAS LES MÊMES PERSONNES : la");
      L.push("  notification pour les organisations disposant d'une section syndicale dans");
      L.push("  l'entreprise ; la publication DANS TOUS LES AUTRES CAS. Relevez donc les");
      L.push("  deux dates pour chaque accord, sans choisir.");
      L.push("");
      L.push("  ┌───────────────────────┬────────────┬────────────┬────────────────────────┐");
      L.push("  │ Accord                │ Notifié le │ Publié le  │ Deux mois expirent le  │");
      L.push("  ├───────────────────────┼────────────┼────────────┼────────────────────────┤");
      if (accords.length) {
        accords.forEach(function (a) {
          var s = typeof a === "string" ? a : (a && a.nom) ? a.nom : JSON.stringify(a);
          L.push("  │ " + pad(s, 21) + " │ [        ] │ [        ] │ [                    ] │");
        });
      } else {
        L.push("  │ [                   ] │ [        ] │ [        ] │ [                    ] │");
        L.push("  │ [                   ] │ [        ] │ [        ] │ [                    ] │");
        L.push("  │ [                   ] │ [        ] │ [        ] │ [                    ] │");
      }
      L.push("  └───────────────────────┴────────────┴────────────┴────────────────────────┘");
      L.push("");
      if (accords.length) {
        L.push("  Accords déclarés au dossier : " + accords.length + ".");
        L.push("");
      } else {
        L.push("  Aucun accord n'est déclaré au dossier. Vérifiez tout de même : les accords");
        L.push("  applicables au comité ne portent pas tous le mot « comité » dans leur");
        L.push("  intitulé — un accord de dialogue social, un accord de groupe, un accord de");
        L.push("  branche étendu peuvent l'être.");
        L.push("");
      }
      L.push("  À TITRE DE REPÈRE — un accord notifié ou publié aujourd'hui, " + leJour(d0) + ",");
      L.push("  ouvrirait un délai expirant aux environs du " + leJour(dans(d0, 61)) + ". Deux mois se");
      L.push("  consomment en une relecture et une décision : ce n'est pas beaucoup.");
      L.push("");
      L.push("  LES ACCORDS À CHERCHER EN PRIORITÉ, parce que le module en dépend :");
      L.push("");
      L.push("     [ ] l'accord de L. 2313-2 déterminant LE NOMBRE ET LE PÉRIMÈTRE DES");
      L.push("         ÉTABLISSEMENTS DISTINCTS — ou, en l'absence de délégué syndical,");
      L.push("         l'accord entre l'employeur et le comité adopté à la majorité des");
      L.push("         membres titulaires élus (L. 2313-3) ; à défaut des deux, la décision");
      L.push("         de l'employeur prise compte tenu de L'AUTONOMIE DE GESTION du");
      L.push("         responsable de l'établissement, notamment en matière de gestion du");
      L.push("         personnel (L. 2313-4). " +
        (multi === true ? "LE DOSSIER DÉCLARE PLUSIEURS ÉTABLISSEMENTS" : "[le dossier ne déclare pas"));
      if (multi === true) {
        L.push("         DISTINCTS : cet accord ou cette décision est le premier à produire.");
      } else {
        L.push("         plusieurs établissements distincts]");
      }
      L.push("         Le périmètre lui-même est traité par les documents CSE-CTL-PER de ce");
      L.push("         module : ne le refaites pas ici, relevez seulement l'accord et ses");
      L.push("         dates.");
      L.push("");
      L.push("     [ ] l'accord de L. 2312-19 sur LE CONTENU, LA PÉRIODICITÉ, LES MODALITÉS");
      L.push("         ET LES NIVEAUX DES CONSULTATIONS RÉCURRENTES ;");
      L.push("     [ ] l'accord de L. 2315-45 sur LES COMMISSIONS du comité ;");
      L.push("     [ ] les accords de L. 2315-41, L. 2315-42 et L. 2315-43 sur LA COMMISSION");
      L.push("         SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL ;");
      L.push("     [ ] l'accord de L. 2315-79 sur LE NOMBRE D'EXPERTISES dans le cadre des");
      L.push("         consultations récurrentes ;");
      L.push("     [ ] l'accord de L. 2312-81 sur LA CONTRIBUTION AUX ACTIVITÉS SOCIALES, et");
      L.push("         celui de L. 2312-82 sur sa RÉPARTITION entre comités d'établissement ;");
      L.push("     [ ] l'accord de L. 2312-16 fixant LES DÉLAIS dans lesquels les avis sont");
      L.push("         rendus ;");
      L.push("     [ ] le PROTOCOLE PRÉÉLECTORAL, qui n'est pas un accord d'entreprise mais");
      L.push("         qui peut modifier le nombre de sièges ou le volume des heures");
      L.push("         individuelles de délégation (L. 2314-7) ;");
      L.push("     [ ] LE RÈGLEMENT INTÉRIEUR DU COMITÉ, qui n'est pas un accord non plus,");
      L.push("         mais qui produit les mêmes effets pratiques (L. 2315-24).");
      L.push("");

      titre(L, "2 — La grille : ce qu'un accord peut faire");
      L.push("Ce qui suit vient des textes lus. Une clause qui entre dans l'une de ces cases");
      L.push("n'a rien d'irrégulier par elle-même.");
      L.push("");
      L.push("  · LES CONSULTATIONS RÉCURRENTES — un accord d'entreprise conclu dans les");
      L.push("    conditions du premier alinéa de L. 2232-12 ou, EN L'ABSENCE DE DÉLÉGUÉ");
      L.push("    SYNDICAL, un accord entre l'employeur et le comité adopté à la majorité des");
      L.push("    membres titulaires, peut définir : 1° le contenu, la périodicité et les");
      L.push("    modalités des consultations récurrentes de L. 2312-17 ainsi que la liste et");
      L.push("    le contenu des informations nécessaires ; 2° LE NOMBRE DE RÉUNIONS");
      L.push("    ANNUELLES du comité prévues à L. 2315-27, QUI NE PEUT ÊTRE INFÉRIEUR À");
      L.push("    SIX ; 3° les niveaux auxquels les consultations sont conduites et leur");
      L.push("    articulation ; 4° les délais de L. 2312-15 dans lesquels les avis sont");
      L.push("    rendus. Il peut aussi prévoir un AVIS UNIQUE portant sur tout ou partie des");
      L.push("    thèmes. « LA PÉRIODICITÉ DES CONSULTATIONS PRÉVUE PAR L'ACCORD NE PEUT ÊTRE");
      L.push("    SUPÉRIEURE À TROIS ANS » (L. 2312-19).");
      L.push("");
      L.push("       DEUX PLANCHERS À VÉRIFIER LIGNE À LIGNE : six réunions au minimum, trois");
      L.push("       ans au maximum. Ce sont les deux seuls chiffres que L. 2312-19 impose,");
      L.push("       et ce sont les deux qu'un accord franchit sans le vouloir.");
      L.push("");
      L.push("  · LES COMMISSIONS — un accord d'entreprise peut prévoir la création de");
      L.push("    commissions supplémentaires pour l'examen de problèmes particuliers, et");
      L.push("    l'employeur peut leur adjoindre des experts et techniciens de l'entreprise");
      L.push("    avec voix consultative. « LES RAPPORTS DES COMMISSIONS SONT SOUMIS À LA");
      L.push("    DÉLIBÉRATION DU COMITÉ » (L. 2315-45).");
      L.push("");
      L.push("  · LA COMMISSION SANTÉ, SÉCURITÉ ET CONDITIONS DE TRAVAIL — l'accord de");
      L.push("    L. 2313-2 fixe les modalités de mise en place de la ou des commissions en");
      L.push("    définissant les six points des 1° à 6° de L. 2315-41 : nombre de membres,");
      L.push("    missions déléguées et leurs modalités d'exercice, modalités de");
      L.push("    fonctionnement dont les heures de délégation, modalités de formation,");
      L.push("    moyens alloués, modalités des transports. En l'absence de délégué syndical,");
      L.push("    l'accord avec le comité y pourvoit (L. 2315-42). Hors les cas de L. 2315-36");
      L.push("    et L. 2315-37, l'accord peut aussi fixer LE NOMBRE ET LE PÉRIMÈTRE de ces");
      L.push("    commissions (L. 2315-43).");
      L.push("");
      L.push("  · LE NOMBRE D'EXPERTISES — « Un accord d'entreprise, ou à défaut un accord");
      L.push("    conclu entre l'employeur et le comité social et économique, adopté à la");
      L.push("    majorité des membres titulaires élus de la délégation du personnel,");
      L.push("    détermine LE NOMBRE D'EXPERTISES dans le cadre des consultations");
      L.push("    récurrentes prévues au paragraphe 2 sur une ou plusieurs années »");
      L.push("    (L. 2315-79). L'accord borne donc le nombre ; il ne supprime pas le");
      L.push("    recours.");
      L.push("");
      L.push("  · LES BUDGETS — la contribution aux activités sociales et culturelles EST");
      L.push("    FIXÉE PAR ACCORD D'ENTREPRISE (L. 2312-81) ; sa répartition entre comités");
      L.push("    d'établissement est fixée par accord au prorata des effectifs, de la masse");
      L.push("    salariale, ou des deux combinés (L. 2312-82). En revanche, la subvention de");
      L.push("    fonctionnement de L. 2315-61 est fixée par la loi : voir la case suivante.");
      L.push("");
      L.push("  · LES ÉTABLISSEMENTS DISTINCTS ET LES REPRÉSENTANTS DE PROXIMITÉ — l'accord");
      L.push("    de L. 2313-2 détermine le nombre et le périmètre des établissements");
      L.push("    distincts, et peut mettre en place des représentants de proximité en");
      L.push("    définissant leur nombre, leurs attributions, les modalités de leur");
      L.push("    désignation et de leur fonctionnement, dont leurs heures de délégation");
      L.push("    (L. 2313-7).");
      L.push("");
      L.push("  · LE PROTOCOLE PRÉÉLECTORAL — il peut modifier le nombre de sièges ou le");
      L.push("    volume des heures individuelles de délégation « DÈS LORS QUE LE VOLUME");
      L.push("    GLOBAL DE CES HEURES, AU SEIN DE CHAQUE COLLÈGE, EST AU MOINS ÉGAL À CELUI");
      L.push("    RÉSULTANT DES DISPOSITIONS LÉGALES au regard de l'effectif » (L. 2314-7).");
      L.push("    C'est une condition, pas une faculté : vérifiez-la collège par collège.");
      L.push("");

      titre(L, "3 — La grille : ce qu'un accord ne peut pas faire");
      L.push("Ce sont les clauses à relever en priorité pour la relecture. Chacune renvoie");
      L.push("à un texte lu, et à un document de ce module qui la traite.");
      L.push("");
      L.push("  ┌───────────────────────────────────────────┬──────────────┬──────────────┐");
      L.push("  │ Ce qu'une clause ne peut pas faire        │ Texte        │ Présente ?   │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Déléguer à la commission santé, sécurité  │ L. 2315-38   │ " +
        pad(deleg.expertDelegue === true ? "OUI (dossier)" : "[oui / non]", 12) + " │");
      L.push("  │ et conditions de travail LE RECOURS À UN  │ (d'ordre     │              │");
      L.push("  │ EXPERT prévu à la sous-section 10         │  public)     │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Déléguer à cette commission LES           │ L. 2315-38   │ " +
        pad(deleg.avisDelegue === true ? "OUI (dossier)" : "[oui / non]", 12) + " │");
      L.push("  │ ATTRIBUTIONS CONSULTATIVES du comité      │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Prévoir une périodicité des consultations │ L. 2312-19   │ [oui / non]  │");
      L.push("  │ récurrentes SUPÉRIEURE À TROIS ANS        │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Fixer un nombre de réunions annuelles     │ L. 2312-19   │ [oui / non]  │");
      L.push("  │ INFÉRIEUR À SIX                           │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Modifier LE TAUX de la subvention de      │ L. 2315-61   │ [oui / non]  │");
      L.push("  │ fonctionnement, que la loi fixe elle-même │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Écarter la règle selon laquelle les       │ L. 2315-32   │ [oui / non]  │");
      L.push("  │ résolutions sont prises à la MAJORITÉ DES │              │              │");
      L.push("  │ MEMBRES PRÉSENTS, le président ne votant  │              │              │");
      L.push("  │ pas quand il consulte les élus            │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Composer la commission santé et sécurité  │ L. 2315-39   │ [oui / non]  │");
      L.push("  │ sans le MINIMUM DE TROIS MEMBRES dont au  │              │              │");
      L.push("  │ moins un du second — ou du troisième —    │              │              │");
      L.push("  │ collège, ou hors des membres du comité    │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Modifier le nombre de sièges ou d'heures  │ L. 2314-7    │ [oui / non]  │");
      L.push("  │ en abaissant LE VOLUME GLOBAL D'HEURES    │              │              │");
      L.push("  │ D'UN COLLÈGE sous le volume légal         │              │              │");
      L.push("  ├───────────────────────────────────────────┼──────────────┼──────────────┤");
      L.push("  │ Imposer à l'employeur, par le RÈGLEMENT   │ L. 2315-24   │ [oui / non]  │");
      L.push("  │ INTÉRIEUR DU COMITÉ, des obligations ne   │              │              │");
      L.push("  │ résultant pas de dispositions légales,    │              │              │");
      L.push("  │ sauf son accord                           │              │              │");
      L.push("  └───────────────────────────────────────────┴──────────────┴──────────────┘");
      L.push("");
      if (deleg.expertDelegue === true || deleg.avisDelegue === true) {
        L.push("  LE DOSSIER SIGNALE DÉJÀ UNE DÉLÉGATION QUI EXCÈDE L. 2315-38 :");
        if (deleg.avisDelegue === true)
          L.push("     · les attributions consultatives du comité sont déléguées ;");
        if (deleg.expertDelegue === true)
          L.push("     · le recours à l'expert est délégué ;");
        L.push("  alors que L. 2315-38 les en exclut expressément l'un et l'autre. Portez");
        L.push("  cette clause en tête de la relecture. Les documents CSE-CTL-SST et");
        L.push("  CSE-CTL-EXP-04 de ce module en tirent les conséquences pratiques.");
        L.push("");
      }
      L.push("  UNE PRÉCISION QUI ÉVITE UN CONTRESENS — « les projets d'accord collectif,");
      L.push("  leur révision ou leur dénonciation NE SONT PAS SOUMIS À LA CONSULTATION DU");
      L.push("  COMITÉ » (L. 2312-14). L'absence de consultation sur le projet d'accord");
      L.push("  lui-même n'est donc pas un grief.");
      L.push("");

      titre(L, "4 — La conclusion : action en nullité ou exception d'illégalité");
      L.push("Deux voies, et le choix dépend d'une seule chose : la date.");
      L.push("");
      L.push("  A — L'ACTION EN NULLITÉ, dans les DEUX MOIS de la notification ou de la");
      L.push("      publication (L. 2262-14), À PEINE D'IRRECEVABILITÉ. Elle attaque la");
      L.push("      clause de front et la fait disparaître pour tous.");
      L.push("");
      L.push("        Accord concerné ............. [ ]");
      L.push("        Date de départ retenue ...... [notification du ... / publication du ...]");
      L.push("        Délai expirant le ........... [ ]");
      L.push("        Jours restants .............. [ ]");
      L.push("");
      L.push("  B — L'EXCEPTION D'ILLÉGALITÉ, quand le délai est passé. L'article L. 2262-14");
      L.push("      enferme dans deux mois L'ACTION EN NULLITÉ ; il ne dit rien de");
      L.push("      l'invocation de l'illégalité par voie d'exception, à l'occasion d'un");
      L.push("      litige où la clause est opposée. C'est la voie qui reste, et elle n'est");
      L.push("      pas enfermée dans ce délai.");
      L.push("");
      L.push("        [L'application ne dispose ici d'aucun texte lu qui organise l'exception");
      L.push("        d'illégalité : elle en signale la possibilité parce que le fondement du");
      L.push("        contrôle la retient, et laisse au professionnel le soin d'en apprécier");
      L.push("        les conditions et la portée.]");
      L.push("");
      L.push("  C — CE QU'IL FAUT FAIRE DANS TOUS LES CAS, et tout de suite : NE PLUS SE");
      L.push("      FONDER SUR LA CLAUSE. Une clause qui prive le comité d'une prérogative");
      L.push("      légale ne devient pas valable parce que le délai de nullité est passé.");
      L.push("      L'acte pris sur son fondement reste irrégulier — l'avis rendu par la");
      L.push("      seule commission, l'expertise décidée par elle. Cessez de vous en");
      L.push("      prévaloir, et reprenez les actes concernés.");
      L.push("");

      titre(L, "5 — La note d'analyse, à dater et à signer");
      L.push("NOTE D'ANALYSE DES CLAUSES DES ACCORDS APPLICABLES AU COMITÉ SOCIAL ET");
      L.push("ÉCONOMIQUE");
      L.push("");
      L.push(nom(ctx));
      L.push("Établie le " + leJour(d0) + " par [nom et qualité de l'auteur de l'analyse].");
      L.push("");
      L.push("1. Accords examinés : [liste, avec pour chacun sa date de signature, de");
      L.push("   notification et de publication].");
      L.push("2. Clauses relevées : [article de l'accord · objet · texte du code du travail");
      L.push("   concerné · appréciation].");
      L.push("3. Conclusion : [aucune clause ne paraît excéder ce que la loi permet / les");
      L.push("   clauses suivantes appellent un examen : ...].");
      L.push("4. Suites proposées : [action en nullité avant le ... / exception");
      L.push("   d'illégalité / cessation de l'application de la clause / renégociation].");
      L.push("");
      L.push("Signature : [ ]");
      L.push("");
      L.push("  Cette note est datée et signée pour une raison précise : elle établit QUAND");
      L.push("  l'entreprise a su. C'est cette date qui distinguera plus tard l'erreur");
      L.push("  d'appréciation du maintien délibéré d'une clause reconnue inopérante.");
      L.push("");

      courrier(L, 1, "saisine du conseil pour relecture des accords", [
        "La base signale que des stipulations existent ; elle ne les lit pas. Ce courrier",
        "cadre la relecture pour qu'elle porte sur les bonnes clauses et rende un avis",
        "daté.",
      ]);
      papier(L, ctx, ["À l'attention de [conseil / avocat]", "[adresse]"]);
      L.push("Objet : examen des accords collectifs applicables au comité social et");
      L.push("économique");
      L.push("");
      L.push("Maître, [ou Madame, Monsieur,]");
      L.push("");
      L.push("Je vous adresse les accords collectifs applicables au comité social et");
      L.push("économique de " + nom(ctx) + ", ainsi qu'une grille des points sur lesquels");
      L.push("j'appelle votre attention.");
      L.push("");
      L.push("Je souhaiterais votre avis sur trois questions :");
      L.push("");
      L.push("  1. l'une des clauses de ces accords prive-t-elle le comité d'une prérogative");
      L.push("     que la loi lui reconnaît — notamment au regard de l'article L. 2315-38,");
      L.push("     qui exclut le recours à l'expert et les attributions consultatives des");
      L.push("     attributions délégables à la commission santé, sécurité et conditions de");
      L.push("     travail, et des planchers de l'article L. 2312-19 : six réunions");
      L.push("     annuelles au minimum, périodicité des consultations de trois ans au");
      L.push("     maximum ?");
      L.push("");
      L.push("  2. dans l'affirmative, le délai de deux mois de l'article L. 2262-14 est-il");
      L.push("     encore ouvert, au regard des dates de notification et de publication");
      L.push("     figurant au tableau joint, et quelle voie recommandez-vous ?");
      L.push("");
      L.push("  3. quels actes déjà pris sur le fondement de ces clauses appellent une");
      L.push("     reprise ?");
      L.push("");
      L.push("Compte tenu de la brièveté du délai de deux mois, je vous saurais gré de me");
      L.push("répondre avant le [DATE].");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Maître, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : accords collectifs en intégralité · tableau des dates ·");
      L.push("grille des clauses relevées.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — vous remplissez le tableau du paragraphe 1. Deux dates",
        "par accord, et rien d'autre : la notification aux organisations disposant d'une",
        "section syndicale, et la publication. Ce sont elles qui décident de tout le",
        "reste.",
        "",
        "Dans les jours qui suivent — vous cochez la grille du paragraphe 3 sur chaque",
        "accord, puis vous adressez le courrier 1 avec les accords en intégralité. Un",
        "extrait ne suffit pas : une clause se lit dans son accord.",
        "",
        "Si un accord a été notifié ou publié récemment — comptez DEUX MOIS depuis cette",
        "date, et remontez de quinze jours pour laisser à votre conseil le temps de",
        "conclure. Un accord notifié aujourd'hui appellerait une décision avant le",
        leJour(dans(d0, 45)) + " et une action avant le " + leJour(dans(d0, 61)) + ".",
        "",
        "Si le délai est passé — ne renoncez pas pour autant : l'exception d'illégalité",
        "n'est pas enfermée dans ce délai, et la cessation de l'application de la clause",
        "ne dépend d'aucun délai du tout.",
        "",
        "À CHAQUE NOUVEL ACCORD SIGNÉ — inscrivez immédiatement ses deux dates au tableau.",
        "C'est la seule discipline qui évite de découvrir un délai le jour où il est",
        "expiré.",
      ]);

      return pied(L,
        ["L. 2262-14", "L. 2312-14", "L. 2312-16", "L. 2312-17", "L. 2312-19",
         "L. 2312-81", "L. 2312-82", "L. 2313-2", "L. 2313-3", "L. 2313-4",
         "L. 2313-7", "L. 2314-7", "L. 2315-24", "L. 2315-27", "L. 2315-32",
         "L. 2315-38", "L. 2315-39", "L. 2315-41", "L. 2315-42", "L. 2315-43",
         "L. 2315-45", "L. 2315-61", "L. 2315-79", "L. 2232-12"],
        ["L. 2231-5 (notification de l'accord) et L. 2231-5-1 (publication), qui fixent les deux points de départ du délai de L. 2262-14",
         "L. 1233-24, L. 1235-7-1 et L. 1237-19-8, réservés par le dernier alinéa de L. 2262-14"]);
    },
  });

  /* Le seul des douze points dont le fondement porte une peine. Elle est donc
     écrite ici — telle que L. 2317-1 la formule, sans l'arrondir — et nulle
     part ailleurs dans ce fichier. */
  DP.ajouter("CSE-CTL-DET-03", {
    nom: "La note de constat des faits signalés et des mesures prises, avec le relevé daté et la saisine du conseil",
    detail: "Le relevé daté des faits, la distinction que L. 2317-1 opère entre l'entrave " +
            "à la constitution ou à la libre désignation et l'entrave au fonctionnement " +
            "régulier, les mesures de cessation immédiate, l'accomplissement de l'acte " +
            "omis, sa consignation au procès-verbal et le courrier au conseil.",
    produire: function (ctx) {
      var f = ctx.fiche || {};
      var d0 = jour0(ctx);
      var faits = f.faitsEntrave ? String(f.faitsEntrave).trim() : "";
      var L = [];

      L = L.concat(entete(ctx, "Constat des faits signalés et des mesures prises",
        "article L. 2317-1 du code du travail"));
      usage(L);

      L.push("CE DOCUMENT NE QUALIFIE RIEN, ET C'EST VOULU");
      L.push("");
      L.push("L'entrave est une INFRACTION PÉNALE. La qualifier suppose d'apprécier des");
      L.push("faits, une intention et un contexte : c'est l'office du juge répressif, et");
      L.push("l'affaire d'un professionnel avant lui. L'application détecte, elle ne");
      L.push("qualifie pas — et un document qui écrirait « il y a entrave » ou « il n'y a");
      L.push("pas entrave » serait faux dans les deux sens.");
      L.push("");
      L.push("Ce que ce document fait, en revanche, est ce qui compte le jour où la");
      L.push("question se pose : il DATE LES FAITS, il FAIT CESSER ce qui peut l'être, il");
      L.push("ACCOMPLIT L'ACTE OMIS et il CONSIGNE le tout. Une régularisation datée vaut");
      L.push("mieux qu'une déclaration d'intention, et elle vaut infiniment mieux qu'un");
      L.push("silence.");
      L.push("");

      titre(L, "1 — Le texte, tel qu'il est");
      L.push("« Le fait d'apporter une entrave SOIT À LA CONSTITUTION d'un comité social et");
      L.push("économique, d'un comité social et économique d'établissement ou d'un comité");
      L.push("social et économique central, SOIT À LA LIBRE DÉSIGNATION DE LEURS MEMBRES,");
      L.push("notamment par la méconnaissance des dispositions des articles L. 2314-1 à");
      L.push("L. 2314-9, est puni D'UN EMPRISONNEMENT D'UN AN ET D'UNE AMENDE DE 7 500 €.");
      L.push("");
      L.push("Le fait d'apporter une entrave À LEUR FONCTIONNEMENT RÉGULIER est puni D'UNE");
      L.push("AMENDE DE 7 500 €. » (L. 2317-1)");
      L.push("");
      L.push("DEUX INFRACTIONS, DEUX PEINES. Le texte les sépare, et la différence n'est pas");
      L.push("mince : l'emprisonnement d'un an n'est encouru que pour la première branche.");
      L.push("Le classement des faits au paragraphe 3 n'est donc pas un exercice de style.");
      L.push("");
      L.push("  Ce que le texte NE DIT PAS, et que ce document n'écrira donc pas : il ne");
      L.push("  dit pas ce qui constitue une entrave. Il vise « notamment » la");
      L.push("  méconnaissance des articles L. 2314-1 à L. 2314-9 pour la première branche,");
      L.push("  et rien de plus pour la seconde. L'appréciation reste entière.");
      L.push("");

      titre(L, "2 — Le relevé daté des faits signalés");
      if (faits) {
        L.push("  CE QUE LE DOSSIER SIGNALE, repris tel quel et sans commentaire :");
        L.push("");
        faits.split(/\n/).forEach(function (x) { L.push("     " + x); });
        L.push("");
        L.push("  Datez chacun de ces faits ci-dessous. Une description sans date ne permet");
        L.push("  ni de savoir si les faits se poursuivent, ni de mesurer ce qui a été fait");
        L.push("  depuis.");
        L.push("");
      } else {
        L.push("  Aucun fait n'est décrit au dossier. Remplissez le tableau à partir des");
        L.push("  signalements reçus : courriers du comité, mentions au procès-verbal,");
        L.push("  observations de l'inspection du travail, courriers d'élus.");
        L.push("");
      }
      L.push("  ┌────┬────────────┬──────────────────────────────┬────────────┬──────────┐");
      L.push("  │ N° │ Date du    │ Fait signalé, décrit sans    │ Source du  │ Se       │");
      L.push("  │    │ fait       │ qualification                │ signalement│ poursuit?│");
      L.push("  ├────┼────────────┼──────────────────────────────┼────────────┼──────────┤");
      L.push("  │ 1  │ [        ] │ [                          ] │ [        ] │ [oui/non]│");
      L.push("  │ 2  │ [        ] │ [                          ] │ [        ] │ [oui/non]│");
      L.push("  │ 3  │ [        ] │ [                          ] │ [        ] │ [oui/non]│");
      L.push("  │ 4  │ [        ] │ [                          ] │ [        ] │ [oui/non]│");
      L.push("  └────┴────────────┴──────────────────────────────┴────────────┴──────────┘");
      L.push("");
      L.push("  DEUX RÈGLES D'ÉCRITURE, et elles importent :");
      L.push("");
      L.push("  · DÉCRIVEZ, NE QUALIFIEZ PAS. « La réunion du 12 mars n'a pas été");
      L.push("    convoquée » est un fait ; « entrave au fonctionnement » est une");
      L.push("    qualification, et elle ne vous appartient pas.");
      L.push("  · DATEZ CHAQUE FAIT SÉPARÉMENT. Un fait épuisé et un fait qui se poursuit");
      L.push("    n'appellent pas la même mesure : le premier se régularise, le second se");
      L.push("    fait cesser d'abord.");
      L.push("");

      titre(L, "3 — Le classement, selon la distinction du texte");
      L.push("  A — FAITS TOUCHANT À LA CONSTITUTION DU COMITÉ OU À LA LIBRE DÉSIGNATION DE");
      L.push("      SES MEMBRES (première branche de L. 2317-1 — un an d'emprisonnement et");
      L.push("      7 500 € d'amende)");
      L.push("");
      L.push("      Le texte vise « notamment la méconnaissance des dispositions des");
      L.push("      articles L. 2314-1 à L. 2314-9 ». Ces neuf articles ont été lus ; voici");
      L.push("      ce que chacun impose, pour que le classement se fasse sur le texte :");
      L.push("");
      L.push("        [ ] L. 2314-1 — composition du comité : l'employeur et une délégation");
      L.push("            du personnel comportant UN NOMBRE ÉGAL DE TITULAIRES ET DE");
      L.push("            SUPPLÉANTS ; le suppléant assiste aux réunions en l'absence du");
      L.push("            titulaire ; un référent en matière de lutte contre le harcèlement");
      L.push("            sexuel et les agissements sexistes est désigné par le comité ;");
      L.push("        [ ] L. 2314-2 — désignation par chaque organisation syndicale");
      L.push("            représentative d'un REPRÉSENTANT SYNDICAL au comité, qui assiste");
      L.push("            aux séances avec voix consultative ;");
      L.push("        [ ] L. 2314-3 — présence, AVEC VOIX CONSULTATIVE, du médecin du");
      L.push("            travail, du responsable interne du service de sécurité et des");
      L.push("            autres personnes que ce texte désigne, aux réunions portant sur la");
      L.push("            santé, la sécurité et les conditions de travail ;");
      L.push("        [ ] L. 2314-4 — INFORMATION DU PERSONNEL tous les quatre ans de");
      L.push("            l'organisation des élections, par tout moyen conférant date");
      L.push("            certaine, avec la date envisagée du premier tour, qui doit se");
      L.push("            tenir AU PLUS TARD LE QUATRE-VINGT-DIXIÈME JOUR suivant la");
      L.push("            diffusion ;");
      L.push("        [ ] L. 2314-5 — INVITATION DES ORGANISATIONS SYNDICALES à négocier le");
      L.push("            protocole préélectoral et à établir leurs listes ;");
      L.push("        [ ] L. 2314-6 — condition de VALIDITÉ DU PROTOCOLE : signature par la");
      L.push("            majorité des organisations ayant participé à sa négociation, dont");
      L.push("            les organisations représentatives ayant recueilli la majorité des");
      L.push("            suffrages exprimés aux dernières élections ;");
      L.push("        [ ] L. 2314-7 — modification du nombre de sièges ou du volume des");
      L.push("            heures par le protocole, à la condition du volume global par");
      L.push("            collège ;");
      L.push("        [ ] L. 2314-8 — engagement de la procédure de L. 2314-5 À LA DEMANDE");
      L.push("            d'un salarié ou d'une organisation syndicale, DANS LE MOIS suivant");
      L.push("            la réception de cette demande ;");
      L.push("        [ ] L. 2314-9 — établissement du PROCÈS-VERBAL DE CARENCE, sa");
      L.push("            publicité auprès des salariés par tout moyen conférant date");
      L.push("            certaine, et sa TRANSMISSION DANS LES QUINZE JOURS à l'agent de");
      L.push("            contrôle de l'inspection du travail.");
      L.push("");
      L.push("      Le mot « notamment » signifie que la liste n'est pas limitative : un");
      L.push("      fait touchant à la constitution ou à la libre désignation peut relever");
      L.push("      de cette branche sans se rattacher à l'un de ces neuf articles.");
      L.push("");
      L.push("  B — FAITS TOUCHANT AU FONCTIONNEMENT RÉGULIER (seconde branche — 7 500 €");
      L.push("      d'amende)");
      L.push("");
      L.push("      Le texte ne les énumère pas. Décrivez-les, sans les qualifier :");
      L.push("");
      L.push("        [ ] réunion non tenue ou non convoquée — le [date] ;");
      L.push("        [ ] information ou document non remis — [lequel], le [date] ;");
      L.push("        [ ] consultation non menée avant la décision — [laquelle], le [date] ;");
      L.push("        [ ] moyens retirés ou non fournis — [lesquels], depuis le [date] ;");
      L.push("        [ ] autre : [                                                    ].");
      L.push("");
      L.push("      [Ce classement est une PRÉPARATION à l'examen professionnel, non une");
      L.push("      qualification. Cochez ce qui décrit les faits ; laissez à votre conseil");
      L.push("      le soin de dire ce qu'ils sont.]");
      L.push("");

      titre(L, "4 — Les mesures : faire cesser, puis accomplir");
      L.push("  A — CE QUI SE FAIT CESSER IMMÉDIATEMENT — sans attendre l'avis du conseil,");
      L.push("      parce que chaque jour de plus est un jour de plus.");
      L.push("");
      L.push("        Fait n° [ ] · mesure : [rétablir les moyens retirés / convoquer la");
      L.push("        réunion non tenue / communiquer l'information non remise] · prise le");
      L.push("        [DATE] · pièce : [ ].");
      L.push("");
      L.push("        Fait n° [ ] · mesure : [ ] · prise le [DATE] · pièce : [ ].");
      L.push("");
      L.push("  B — L'ACTE OMIS, ACCOMPLI DANS LES FORMES QUI LUI SONT PROPRES");
      L.push("");
      L.push("      C'est le point où l'on se trompe le plus souvent : on annonce qu'on va");
      L.push("      régulariser, et l'on omet la forme. Une réunion se convoque avec un");
      L.push("      ordre du jour établi par le président ET le secrétaire (L. 2315-29) ;");
      L.push("      une consultation suppose un délai d'examen suffisant et des informations");
      L.push("      précises et écrites (L. 2312-15) ; une désignation suppose une");
      L.push("      résolution adoptée à la majorité des membres présents (L. 2315-32).");
      L.push("");
      L.push("        Acte omis ................ [ ]");
      L.push("        Forme requise ............ [ ] — texte : [ ]");
      L.push("        Accompli le .............. [DATE]");
      L.push("        Pièce ..................... [ ]");
      L.push("        Consigné au procès-verbal du comité du [DATE] ? ...... [oui / non]");
      L.push("");
      L.push("      LA CONSIGNATION AU PROCÈS-VERBAL N'EST PAS UNE FORMALITÉ. Les");
      L.push("      délibérations du comité sont consignées dans un procès-verbal établi par");
      L.push("      le secrétaire (L. 2315-34) : c'est la seule trace contradictoire de ce");
      L.push("      qui a été fait, et la seule qu'un tiers lira.");
      L.push("");
      L.push("  C — CE QUI NE PEUT PAS ÊTRE RÉPARÉ");
      L.push("");
      L.push("      Certains faits sont épuisés : une consultation qui n'a pas eu lieu avant");
      L.push("      une décision déjà exécutée ne se rattrape pas à l'identique. Écrivez-le,");
      L.push("      plutôt que de faire semblant :");
      L.push("");
      L.push("        Fait n° [ ] · ne peut être réparé en l'état, motif : [ ] · mesure");
      L.push("        prise à la place : [ ].");
      L.push("");

      titre(L, "5 — La note de constat, datée et signée");
      L.push("NOTE DE CONSTAT DES FAITS SIGNALÉS ET DES MESURES PRISES");
      L.push("");
      L.push(nom(ctx));
      L.push("Établie le " + leJour(d0) + " par " + signataire(ctx) + ".");
      L.push("");
      L.push("1. FAITS SIGNALÉS — [reprendre le tableau du paragraphe 2, daté].");
      L.push("");
      L.push("2. CLASSEMENT — [reprendre le paragraphe 3, sans qualification pénale].");
      L.push("");
      L.push("3. MESURES DE CESSATION — [reprendre le A du paragraphe 4, avec les dates].");
      L.push("");
      L.push("4. ACTES ACCOMPLIS — [reprendre le B, avec les formes suivies et les dates de");
      L.push("   consignation au procès-verbal].");
      L.push("");
      L.push("5. EXAMEN PROFESSIONNEL — les faits ont été soumis à [conseil] le [DATE].");
      L.push("   La présente note ne comporte aucune qualification : elle constate et elle");
      L.push("   date.");
      L.push("");
      L.push("Signature : " + signataire(ctx));
      L.push("");
      L.push("  POURQUOI CETTE NOTE EST SIGNÉE ET DATÉE — parce que la date à laquelle");
      L.push("  l'employeur a su, et celle à laquelle il a agi, sont les deux seules choses");
      L.push("  qui distinguent celui qui a laissé faire de celui qui a corrigé.");
      L.push("");

      courrier(L, 1, "information du comité des mesures prises", [
        "Aucun texte lu n'impose ce courrier. Il est là parce qu'une régularisation que",
        "le comité ignore ne produit aucun de ses effets utiles.",
      ]);
      papier(L, ctx, ["Aux membres de la délégation du personnel",
                      "du comité social et économique"]);
      L.push("Objet : suites données aux points signalés");
      L.push("");
      L.push("Mesdames, Messieurs,");
      L.push("");
      L.push("Vous avez appelé l'attention de la direction sur [rappeler les faits, sans les");
      L.push("qualifier], par [courrier / mention au procès-verbal] du [DATE].");
      L.push("");
      L.push("Les mesures suivantes ont été prises :");
      L.push("");
      L.push("  · [mesure], le [DATE] ;");
      L.push("  · [mesure], le [DATE] ;");
      L.push("  · [acte omis accompli], le [DATE].");
      L.push("");
      L.push("Je vous propose d'inscrire ce point à l'ordre du jour de la prochaine réunion,");
      L.push("afin que ces mesures soient consignées au procès-verbal et que vous puissiez");
      L.push("faire connaître vos observations.");
      L.push("");
      salutation(L, ctx);
      L.push("");

      courrier(L, 2, "saisine du conseil", [
        "L'entrave est une infraction pénale : la base détecte, elle ne qualifie pas.",
        "Ce courrier confie la qualification à qui elle revient, et lui donne les faits",
        "datés plutôt qu'une inquiétude.",
      ]);
      papier(L, ctx, ["À l'attention de [conseil / avocat]", "[adresse]"]);
      L.push("Objet : faits signalés concernant le comité social et économique — demande");
      L.push("d'examen");
      L.push("");
      L.push("Maître, [ou Madame, Monsieur,]");
      L.push("");
      L.push("Des faits concernant le fonctionnement du comité social et économique de");
      L.push(nom(ctx) + " ont été signalés. Je vous en adresse le relevé daté, ainsi que le");
      L.push("constat des mesures prises.");
      L.push("");
      L.push("Je ne procède à aucune qualification : l'article L. 2317-1 du code du travail");
      L.push("punit l'entrave à la constitution du comité et à la libre désignation de ses");
      L.push("membres d'un an d'emprisonnement et de 7 500 € d'amende, et l'entrave à son");
      L.push("fonctionnement régulier de 7 500 € d'amende. Cette qualification relève de");
      L.push("votre appréciation, non de la mienne.");
      L.push("");
      L.push("Je souhaiterais votre avis sur :");
      L.push("");
      L.push("  1. la portée des faits relevés au regard de ce texte, et la distinction");
      L.push("     entre ses deux branches ;");
      L.push("  2. le caractère suffisant des mesures déjà prises, et celles qu'il");
      L.push("     conviendrait d'ajouter ;");
      L.push("  3. les actes qui devraient être repris, et dans quelles formes.");
      L.push("");
      salutation(L, ctx, "Je vous prie d'agréer, Maître, l'expression de ma considération distinguée.");
      L.push("Pièces jointes : relevé daté des faits · note de constat · procès-verbaux et");
      L.push("courriers cités.");

      calendrier(L, [
        "Aujourd'hui, " + leJour(d0) + " — deux choses, et dans cet ordre : vous FAITES CESSER ce",
        "qui se poursuit, et vous DATEZ les faits. La cessation ne se planifie pas ; le",
        "relevé, si.",
        "",
        "Le même jour — courrier 2 au conseil. L'entrave est pénale : plus tôt les faits",
        "lui parviennent datés, mieux ils seront appréciés.",
        "",
        "Dans la semaine, soit avant le " + leJour(dans(d0, 7)) + " — l'acte omis est accompli dans",
        "les formes qui lui sont propres. Une convocation, une communication, une",
        "consultation : chacune a sa forme, et c'est la forme qui régularise.",
        "",
        "À la prochaine réunion du comité — les mesures sont consignées au procès-verbal",
        "(L. 2315-34) et le courrier 1 a été adressé. Sans cette consignation, la",
        "régularisation existe pour vous seul.",
        "",
        "Dans les deux mois, soit avant le " + leJour(dans(d0, 61)) + " — vous reprenez le relevé et",
        "vous vérifiez, fait par fait, que rien ne s'est reconstitué. Un fait qui",
        "réapparaît après régularisation ne se lit pas du tout comme un fait isolé.",
      ]);

      return pied(L,
        ["L. 2312-15", "L. 2314-1", "L. 2314-2", "L. 2314-3", "L. 2314-4",
         "L. 2314-5", "L. 2314-6", "L. 2314-7", "L. 2314-8", "L. 2314-9",
         "L. 2315-29", "L. 2315-32", "L. 2315-34", "L. 2317-1"]);
    },
  });

})(typeof window !== "undefined" ? window : this);
