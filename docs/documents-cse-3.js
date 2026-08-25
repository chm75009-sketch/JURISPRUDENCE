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

  function ligneSeuil(eff, s, ceQuiSeDeclenche) {
    if (eff == null) {
      return "  Effectif de l'entreprise ... [À RENSEIGNER] — le seuil de " + s +
             " salariés ne peut donc pas être tranché ici.";
    }
    return "  Effectif de l'entreprise ... " + eff + " salariés — seuil de " + s +
           " salariés " + (eff >= s ? "ATTEINT : " + ceQuiSeDeclenche
                                    : "non atteint à cette date.");
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
      L.push(ligneSeuil(eff, 300, "les trois commissions sont dues, à défaut d'accord."));
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
      L.push(ligneSeuil(eff, 1000, "la commission économique est due, à défaut d'accord."));
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

})(typeof window !== "undefined" ? window : this);
