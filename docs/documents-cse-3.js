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

})(typeof window !== "undefined" ? window : this);
